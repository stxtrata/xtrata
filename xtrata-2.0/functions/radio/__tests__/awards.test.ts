// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { boolCV, cvToHex, noneCV, principalCV, responseOkCV, someCV, tupleCV, uintCV } from '@stacks/transactions';
import { AwardUnavailable, hiroAwardChain, type AwardsEnv } from '../../lib/radio-awards';
import { onRequest } from '../awards/[[path]]';
import { PLAYS_CONTRACT } from '../../../src/lib/listening-wallet/tx';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0';
const HERO = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N';
const call = (path: string, init: RequestInit = {}, env: Partial<AwardsEnv> = {}) =>
  onRequest({ request: new Request('https://radio.test/radio/awards/' + path, init), env: env as AwardsEnv, params: { path: path.split('?')[0].split('/') } });
afterEach(() => vi.unstubAllGlobals());

describe('/radio/awards', () => {
  it('is off unless switched on, and says so without touching the chain', async () => {
    const fetched = vi.fn(); vi.stubGlobal('fetch', fetched);
    expect(await (await call('config')).json()).toEqual({ enabled: false });
    expect(await (await call('status?address=' + HERO)).json()).toEqual({ state: 'off' });
    expect(await (await call('note', { method: 'POST' })).json()).toEqual({ state: 'off' });
    expect(fetched).not.toHaveBeenCalled();
  });

  it('when on: says what each class needs, takes notes only from its own page, and nothing else exists', async () => {
    const env = { RADIO_AWARDS_ENABLED: '1', RADIO_AWARDS_CONTRACT: CONTRACT, RADIO_AWARDS_TARGET_PERCENT: '90' };
    const cfg = await (await call('config', {}, env)).json() as any;
    expect(cfg).toMatchObject({ enabled: true, contract: CONTRACT, drop: 1, percent: 90 });
    expect(cfg.classes).toEqual([{ id: 'diamond', plays: 1000, need: 900 }, { id: 'gold', plays: 500, need: 450 }, { id: 'silver', plays: 250, need: 225 }, { id: 'bronze', plays: 100, need: 90 }, { id: 'classic', plays: 50, need: 45 }]);
    expect(JSON.stringify(cfg)).not.toMatch(/key|secret/i);
    expect((await call('note', { method: 'POST', headers: { origin: 'https://evil.test' }, body: '{}' }, env)).status).toBe(403);
    expect((await call('note', { method: 'POST', body: '{}' }, env)).status).toBe(403);
    expect((await call('note', {}, env)).status).toBe(405);
    expect((await call('nothing', {}, env)).status).toBe(404);
  });
});

describe('reading the chain for awards (Hiro)', () => {
  const answer = (cv: any) => new Response(JSON.stringify({ okay: true, result: cvToHex(cv) }), { status: 200, headers: { 'content-type': 'application/json' } });
  const stub = (reply: (url: string, init?: RequestInit) => Response) => { const f = vi.fn(async (url: any, init?: any) => reply(String(url), init)); vi.stubGlobal('fetch', f); return f; };
  const chain = () => hiroAwardChain({} as AwardsEnv);

  it('reads an award, a class, the pause switch and an owner; "none" is none, never an error', async () => {
    const f = stub((url) => {
      if (url.endsWith('/get-award-of')) return answer(someCV(uintCV(48213)));
      if (url.endsWith('/get-award-by-number')) return answer(noneCV());
      if (url.endsWith('/get-class')) return answer(someCV(tupleCV({ template: uintCV(9002), cap: uintCV(10), minted: uintCV(3) })));
      if (url.endsWith('/is-paused')) return answer(responseOkCV(boolCV(false)));
      if (url.endsWith('/get-owner')) return answer(responseOkCV(someCV(principalCV(HERO))));
      return new Response('', { status: 404 });
    });
    const c = chain();
    expect(await c.awardOf(CONTRACT, 1, HERO)).toBe(48213);
    expect(await c.awardAt(CONTRACT, 1, 7)).toBeNull();
    expect(await c.classOf(CONTRACT, 1, 2)).toEqual({ template: 9002, cap: 10, minted: 3 });
    expect(await c.paused(CONTRACT)).toBe(false);
    expect(await c.ownerOf(48213)).toBe(HERO);
    expect(String(f.mock.calls[0][0])).toBe(`https://api.mainnet.hiro.so/v2/contracts/call-read/${CONTRACT.replace('.', '/')}/get-award-of`);
  });

  it('anything it cannot read is unavailable: a refused call, a failed call, an answer of the wrong shape', async () => {
    stub(() => new Response(JSON.stringify({ okay: false, cause: 'boom' }), { status: 200 }));
    await expect(chain().awardOf(CONTRACT, 1, HERO)).rejects.toBeInstanceOf(AwardUnavailable);
    stub(() => new Response('nope', { status: 404 }));
    await expect(chain().paused(CONTRACT)).rejects.toBeInstanceOf(AwardUnavailable);
    stub(() => answer(uintCV(1)));                       // not an optional
    await expect(chain().awardOf(CONTRACT, 1, HERO)).rejects.toBeInstanceOf(AwardUnavailable);
    await expect(chain().classOf(CONTRACT, 1, 2)).rejects.toBeInstanceOf(AwardUnavailable);
    stub(() => { throw new Error('network'); });
    await expect(chain().tip()).rejects.toBeInstanceOf(AwardUnavailable);
  });

  it('reads the tip and a page of transactions pinned to a block, keeping only what counting needs', async () => {
    const f = stub((url) => {
      if (url.endsWith('/v2/info')) return new Response(JSON.stringify({ stacks_tip_height: 5210884 }));
      return new Response(JSON.stringify({ total: 3, results: [
        { block_height: 100, tx_status: 'success', canonical: true, sender_address: HERO, tx_type: 'contract_call', contract_call: { contract_id: PLAYS_CONTRACT, function_name: 'play' } },
        { block_height: 99, tx_status: 'abort_by_response', canonical: true, sender_address: HERO, tx_type: 'contract_call', contract_call: { contract_id: PLAYS_CONTRACT, function_name: 'play' } },
        { block_height: 98, tx_status: 'success', canonical: true, sender_address: HERO, tx_type: 'token_transfer' }
      ] }));
    });
    const c = chain();
    expect(await c.tip()).toBe(5210884);
    const p = await c.page(HERO, 5210883, 50);
    expect(String(f.mock.calls[1][0])).toBe(`https://api.mainnet.hiro.so/extended/v1/address/${HERO}/transactions?until_block=5210883&limit=50&offset=50`);
    expect(p).toEqual({ total: 3, txs: [
      { height: 100, ok: true, sender: HERO, contract: PLAYS_CONTRACT, fn: 'play' },
      { height: 99, ok: false, sender: HERO, contract: PLAYS_CONTRACT, fn: 'play' },
      { height: 98, ok: true, sender: HERO, contract: null, fn: null }
    ] });
    stub(() => new Response(JSON.stringify({ results: [] })));    // no total
    await expect(chain().page(HERO, 1, 0)).rejects.toBeInstanceOf(AwardUnavailable);
  });
});

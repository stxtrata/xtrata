import { describe, expect, it, vi } from 'vitest';
import { onRequest, songStats } from '../song-stats';

const deps = (total: string | Error, plays: number | Error = 7) => ({
  paidPlaysTotal: vi.fn(async (core: number, _id: number) => { expect(core).toBe(3); if (plays instanceof Error) throw plays; return plays; }),
  chainConfig: vi.fn(async () => ({ enabled: true as const, contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.likes', network: 'mainnet' as const, batchLimit: 25 as const, platformFee: 0 as const })),
  chainStates: vi.fn(async (_c: string, ids: number[]) => { if (total instanceof Error) throw total; return [{ id: ids[0], liked: false, total }]; })
});

describe('one song’s on-chain counters', () => {
  it('reads both totals from the chain: likes, and the paid-plays contract counter for the radio core', async () => {
    const d = deps('12', 41);
    expect(await songStats({} as any, 3567, d)).toEqual({ id: 3567, likes: 12, plays: 41 });
    expect(d.paidPlaysTotal).toHaveBeenCalledWith(3, 3567, {});
  });

  it('reports a failed read as unknown, never as zero', async () => {
    expect(await songStats({} as any, 5, deps(new Error('429'), new Error('429')))).toEqual({ id: 5, likes: null, plays: null });
    expect(await songStats({} as any, 5, deps('0', 0))).toEqual({ id: 5, likes: 0, plays: 0 });
  });

  it('rejects anything but a plain song number', async () => {
    for (const id of ['', 'abc', '0', '1e3', '-4', '123456789']) {
      const r = await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=' + id), env: {} });
      expect(r.status).toBe(400);
    }
    expect((await onRequest({ request: new Request('https://radio.test/radio/song-stats?id=1', { method: 'POST' }), env: {} })).status).toBe(405);
  });
});

describe('the paid-plays contract counter', () => {
  it('calls get-total(core, id) on the paid-plays contract and decodes the uint', async () => {
    const { Cl, serializeCV, deserializeCV, cvToJSON } = await import('@stacks/transactions');
    const { paidPlaysTotal, resetChainReadState } = await import('../../lib/radio-chain-likes');
    resetChainReadState();
    const hex = (cv: any) => '0x' + Array.from(serializeCV(cv)).map((b) => b.toString(16).padStart(2, '0')).join('');
    const fetcher = vi.fn(async (url: string, init: RequestInit) => {
      expect(url).toBe('https://api.mainnet.hiro.so/v2/contracts/call-read/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-radio-plays-v1-0/get-total');
      const args = JSON.parse(String(init.body)).arguments.map((a: string) => cvToJSON(deserializeCV(a)).value);
      expect(args).toEqual(['3', '3567']);
      return new Response(JSON.stringify({ okay: true, result: hex(Cl.uint(41)) }));
    });
    vi.stubGlobal('fetch', fetcher);
    try {
      expect(await paidPlaysTotal(3, 3567)).toBe(41);
      await expect(paidPlaysTotal(4, 3567)).rejects.toThrow();
      fetcher.mockImplementationOnce(async () => new Response(JSON.stringify({ okay: true, result: hex(Cl.ok(Cl.uint(1))) })));
      await expect(paidPlaysTotal(3, 3567)).rejects.toThrow(/Malformed/);
    } finally { vi.unstubAllGlobals(); }
  });
});

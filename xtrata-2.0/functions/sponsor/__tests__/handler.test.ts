/**
 * Direct tests for the Pages sponsor relayer (functions/sponsor/[[path]].ts).
 *
 * These exercise THE PRODUCTION HANDLER, not the Node svc: real signed
 * fixtures, an in-memory D1 double, and a stubbed fetch for every chain call.
 * They encode the 5.6 SOL findings so the protections cannot silently
 * regress again:
 *   1. signed-arg binding (body listingId must match the signed transaction)
 *   2. atomic settlement transitions (no duplicate claim-fee broadcasts)
 *   3. per-origin rolling rate limit (429 RATE_LIMITED)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AnchorMode,
  Cl,
  FungibleConditionCode,
  PostConditionMode,
  contractPrincipalCV,
  cvToHex,
  makeContractCall,
  makeStandardSTXPostCondition,
  getAddressFromPrivateKey,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { onRequest } from '../[[path]]';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MARKET = `${DEPLOYER}.xtrata-market-sponsored-stx-v1-1`;
const DROPS = `${DEPLOYER}.xtrata-drops-v1-0`;
const NFT = `${DEPLOYER}.xtrata-v3-2-3`;
// throwaway keys, never used on-chain
const BUYER_KEY = 'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601';
const SPONSOR_KEY = 'a5c9a52b98b3e1cb6f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd9101';
const SPONSOR_ADDRESS = getAddressFromPrivateKey(SPONSOR_KEY);

type Row = Record<string, unknown> & { id: string; state: string };

const makeDb = () => {
  const jobs: Row[] = [];
  const exec = (raw: string, binds: unknown[]) => {
    const q = raw.replace(/\s+/g, ' ').trim();
    if (q.startsWith('CREATE TABLE') || q.startsWith('CREATE INDEX')) {
      return { results: [], meta: { changes: 0 } };
    }
    if (q.startsWith('ALTER TABLE')) throw new Error('duplicate column');
    if (q.startsWith('UPDATE sponsor_jobs SET state=?')) {
      // transition(): binds = [to, now, ...extra, id, from]
      const to = binds[0] as string;
      const from = binds[binds.length - 1] as string;
      const id = binds[binds.length - 2] as string;
      const row = jobs.find((j) => j.id === id && j.state === from);
      if (!row) return { results: [], meta: { changes: 0 } };
      row.state = to;
      row.updated_at = binds[1];
      const extra = q.match(/SET state=\?, updated_at=\?, (.+?) WHERE/);
      if (extra) {
        extra[1].split(',').forEach((part, index) => {
          row[part.trim().split('=')[0]] = binds[2 + index];
        });
      }
      return { results: [], meta: { changes: 1 } };
    }
    if (q.startsWith("UPDATE sponsor_jobs SET state='")) {
      return { results: [], meta: { changes: 0 } }; // stale-lease reverts: nothing stale in tests
    }
    if (q.includes('WHERE buyer=?')) {
      const [buyer, after] = binds as [string, number];
      const n = jobs.filter(
        (j) => j.buyer === buyer && (j.created_at as number) > after && j.state !== 'ABANDONED'
      ).length;
      return { results: [{ n }], meta: {} };
    }
    if (q.includes("state NOT IN ('SETTLED','ABANDONED')")) {
      const n = jobs.filter((j) => !['SETTLED', 'ABANDONED'].includes(j.state)).length;
      return { results: [{ n }], meta: {} };
    }
    if (q.startsWith('INSERT INTO sponsor_jobs')) {
      const [id, contract_id, listing_id, buyer, payload_hash, fee_ustx, created_at, updated_at] =
        binds as [string, string, string, string, string, string, number, number];
      if (jobs.some((j) => j.payload_hash === payload_hash)) {
        throw new Error('UNIQUE constraint failed: sponsor_jobs.payload_hash');
      }
      jobs.push({
        id, state: 'RECEIVED', contract_id, listing_id, buyer, payload_hash, fee_ustx,
        buy_tx: null, claim_tx: null, refund_tx: null, error: null, created_at, updated_at
      });
      return { results: [], meta: { changes: 1 } };
    }
    if (q.includes("WHERE state IN ('SPONSORED','CONFIRMED','CLAIMED')")) {
      const pending = jobs.filter((j) => ['SPONSORED', 'CONFIRMED', 'CLAIMED'].includes(j.state));
      return { results: pending.slice(0, Number(binds[0] ?? 4)), meta: {} };
    }
    if (q.includes('WHERE payload_hash=?')) {
      return { results: jobs.filter((j) => j.payload_hash === binds[0]), meta: {} };
    }
    if (q.includes('WHERE id=?')) {
      return { results: jobs.filter((j) => j.id === binds[0]), meta: {} };
    }
    throw new Error(`unhandled query in test double: ${q}`);
  };
  const statement = (q: string, binds: unknown[] = []) => ({
    bind: (...next: unknown[]) => statement(q, next),
    all: async () => exec(q, binds),
    run: async () => exec(q, binds)
  });
  return { db: { prepare: (q: string) => statement(q) }, jobs };
};

const listingTuple = () =>
  Cl.some(
    Cl.tuple({
      seller: Cl.standardPrincipal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'),
      'nft-contract': Cl.contractPrincipal(DEPLOYER, 'xtrata-v3-2-3'),
      'token-id': Cl.uint(2759),
      price: Cl.uint(0),
      'created-at': Cl.uint(1),
      'fee-budget': Cl.uint(100_000),
      'budget-remaining': Cl.uint(100_000),
      claimed: Cl.uint(0),
      buyer: Cl.none(),
      'sold-at': Cl.none()
    })
  );

const broadcasts: string[] = [];

const stubFetch = () => {
  broadcasts.length = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/v2/fees/transfer')) return new Response('1', { status: 200 });
    if (url.includes('/stx')) return Response.json({ balance: '100000000' });
    if (url.includes('/nonces')) return Response.json({ possible_next_nonce: 5 });
    if (url.includes('/get-listing')) {
      return Response.json({ okay: true, result: cvToHex(listingTuple()) });
    }
    if (url.includes('/get-sponsor')) {
      return Response.json({ okay: true, result: cvToHex(Cl.ok(Cl.standardPrincipal(SPONSOR_ADDRESS))) });
    }
    if (url.includes('/extended/v1/tx/')) return Response.json({ tx_status: 'success' });
    if (url.includes('/v2/transactions')) {
      broadcasts.push(String(init?.body ?? ''));
      const txid = broadcasts.length.toString(16).padStart(64, '0');
      return new Response(JSON.stringify(txid), { status: 200 });
    }
    throw new Error(`unexpected fetch in test: ${url}`);
  }));
};

const fixture = async (params: {
  contract?: string;
  fn?: string;
  listingId?: bigint;
  sponsored?: boolean;
} = {}) => {
  const contract = params.contract ?? MARKET;
  const [addr, name] = contract.split('.');
  const [nftAddr, nftName] = NFT.split('.');
  const tx = await makeContractCall({
    contractAddress: addr,
    contractName: name,
    functionName: params.fn ?? 'buy',
    functionArgs: [contractPrincipalCV(nftAddr, nftName), uintCV(params.listingId ?? 7n)],
    senderKey: BUYER_KEY,
    network: new StacksMainnet(),
    fee: 0n,
    nonce: 0n,
    sponsored: params.sponsored ?? true,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(
        'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
        FungibleConditionCode.Equal,
        0n
      )
    ]
  });
  return Buffer.from(tx.serialize()).toString('hex');
};

const submit = (env: unknown, body: Record<string, unknown>) =>
  onRequest({
    request: new Request('https://x/sponsor/submit', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    env
  } as never) as Promise<Response>;

describe('sponsor relayer Pages handler', () => {
  let db: ReturnType<typeof makeDb>;
  let env: Record<string, unknown>;

  beforeEach(() => {
    db = makeDb();
    env = { SPONSOR_KEY: SPONSOR_KEY, DB: db.db };
    stubFetch();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('accepts a valid market buy and persists the SIGNED listing id', async () => {
    const res = await submit(env, { txHex: await fixture({ listingId: 7n }), contractId: MARKET, listingId: '7' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.state).toBe('SPONSORED');
    expect(db.jobs[0].listing_id).toBe('7');
    expect(db.jobs[0].state).toBe('SPONSORED');
  });

  it('accepts a valid drops claim', async () => {
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(200);
  });

  it('refuses to spend when the relayer key is not the contract-authorised sponsor', async () => {
    const workingFetch = fetch;
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('/get-sponsor')) {
        return Promise.resolve(
          Response.json({
            okay: true,
            result: cvToHex(Cl.ok(Cl.standardPrincipal('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7')))
          })
        );
      }
      return workingFetch(input, init);
    }));
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ code: 'RELAYER_NOT_AUTHORIZED' });
    expect(db.jobs).toHaveLength(0);
    expect(broadcasts).toHaveLength(0);
  });

  it('returns a safe request id when the sponsor key is invalid', async () => {
    const res = await submit({ ...env, SPONSOR_KEY: 'not-a-private-key' }, {});
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body).toMatchObject({
      code: 'RELAYER_CONFIG_INVALID',
      requestId: expect.any(String)
    });
    expect(body.message).toContain(body.requestId);
    expect(res.headers.get('x-request-id')).toBe(body.requestId);
    expect(body.message).not.toContain('not-a-private-key');
  });

  it('identifies a missing D1 binding as a storage failure without exposing bindings', async () => {
    const res = await submit({ SPONSOR_KEY }, {});
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.code).toBe('RELAYER_STORAGE_UNAVAILABLE');
    expect(body.message).not.toContain('Available bindings');
  });

  it('abandons a reserved job and identifies an invalid nonce response as chain-state failure', async () => {
    const workingFetch = fetch;
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('/nonces')) return Promise.resolve(Response.json({}));
      return workingFetch(input, init);
    }));
    const res = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'claim', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({
      code: 'RELAYER_CHAIN_UNAVAILABLE',
      requestId: expect.any(String)
    });
    expect(db.jobs).toHaveLength(1);
    expect(db.jobs[0].state).toBe('ABANDONED');
    expect(db.jobs[0].error).toMatch(/chain state/);
    expect(broadcasts).toHaveLength(0);
  });

  it('FINDING 1: rejects body listingId B when the signed transaction targets A, before any job or broadcast', async () => {
    const res = await submit(env, { txHex: await fixture({ listingId: 7n }), contractId: MARKET, listingId: '8' });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/listingId mismatch/);
    expect(db.jobs.length).toBe(0);
    expect(broadcasts.length).toBe(0);
  });

  it('rejects buy on a drops contract and claim on a market contract', async () => {
    const wrongDrops = await submit(env, {
      txHex: await fixture({ contract: DROPS, fn: 'buy', listingId: 3n }),
      contractId: DROPS,
      listingId: '3'
    });
    expect(wrongDrops.status).toBe(400);
    const wrongMarket = await submit(env, {
      txHex: await fixture({ contract: MARKET, fn: 'claim', listingId: 7n }),
      contractId: MARKET,
      listingId: '7'
    });
    expect(wrongMarket.status).toBe(400);
  });

  it('rejects malformed listingId and oversized/odd txHex before deserialization', async () => {
    const hex = await fixture({ listingId: 7n });
    expect((await submit(env, { txHex: hex, contractId: MARKET, listingId: '-1' })).status).toBe(400);
    expect((await submit(env, { txHex: hex, contractId: MARKET, listingId: '1.5' })).status).toBe(400);
    expect((await submit(env, { txHex: `${hex}0`, contractId: MARKET, listingId: '7' })).status).toBe(400);
    expect((await submit(env, { txHex: 'zz'.repeat(10), contractId: MARKET, listingId: '7' })).status).toBe(400);
    expect(
      (await submit(env, { txHex: 'aa'.repeat(20_001), contractId: MARKET, listingId: '7' })).status
    ).toBe(400);
    expect(db.jobs.length).toBe(0);
  });

  it('FINDING 3: rate-limits the sixth job from one origin with 429 RATE_LIMITED', async () => {
    for (let i = 0; i < 5; i += 1) {
      const res = await submit(env, {
        txHex: await fixture({ listingId: BigInt(10 + i) }),
        contractId: MARKET,
        listingId: String(10 + i)
      });
      expect(res.status).toBe(200);
    }
    const sixth = await submit(env, {
      txHex: await fixture({ listingId: 99n }),
      contractId: MARKET,
      listingId: '99'
    });
    expect(sixth.status).toBe(429);
    expect((await sixth.json()).code).toBe('RATE_LIMITED');
  });

  it('duplicate payload returns 409 with the existing job instead of double-broadcasting', async () => {
    const hex = await fixture({ listingId: 7n });
    const first = await submit(env, { txHex: hex, contractId: MARKET, listingId: '7' });
    expect(first.status).toBe(200);
    const beforeBroadcasts = broadcasts.length;
    const second = await submit(env, { txHex: hex, contractId: MARKET, listingId: '7' });
    expect(second.status).toBe(409);
    // The second request legitimately advances SETTLEMENT of job 1 (one
    // claim-fee broadcast); what must NOT happen is a second buy broadcast.
    expect(broadcasts.length).toBeLessThanOrEqual(beforeBroadcasts + 1);
    expect(db.jobs.length).toBe(1);
    expect(db.jobs[0].state).toBe('CLAIMED');
  });

  it('FINDING 2: concurrent settlement advances a CONFIRMED job with exactly one claim-fee broadcast', async () => {
    db.jobs.push({
      id: 'job-1', state: 'CONFIRMED', contract_id: MARKET, listing_id: '7',
      buyer: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7', payload_hash: 'h1', fee_ustx: '3000',
      buy_tx: 'buytx', claim_tx: null, refund_tx: null, error: null,
      created_at: Date.now(), updated_at: Date.now()
    });
    const status = () =>
      onRequest({
        request: new Request('https://x/sponsor/status/job-1', { method: 'GET' }),
        env
      } as never) as Promise<Response>;
    // Each request runs settleBatch first; both race to advance the job.
    await Promise.all([status(), status()]);
    expect(broadcasts.length).toBe(1);
    expect(db.jobs[0].state).toBe('CLAIMED');
  });
});

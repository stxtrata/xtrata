import { describe, expect, it } from 'vitest';
import { getAddressFromPrivateKey } from '@stacks/transactions';
import { createRouter, type RelayerRequest, type RelayerResponse } from '../src/http.js';
import { InMemoryJobStore } from '../src/jobs.js';
import { InMemoryNonceAuthority } from '../src/nonce.js';
import { SponsorRelayer } from '../src/sponsor.js';
import type { RelayerConfig } from '../src/types.js';
import { FakeChain, SPONSOR_KEY, buildClaimTx, claimerKey, makeDrop, testConfig } from './helpers.js';
import type { FakeDrop } from './helpers.js';

const SPONSOR_ADDRESS = getAddressFromPrivateKey(SPONSOR_KEY, 'mainnet');

const harness = (
  overrides: Partial<RelayerConfig> = {},
  drops: Record<string, Partial<FakeDrop>> = { '1': {} }
) => {
  const cfg = testConfig(overrides);
  const chain = new FakeChain();
  for (const [id, drop] of Object.entries(drops)) chain.drops.set(id, makeDrop(drop));
  const jobs = new InMemoryJobStore();
  const relayer = new SponsorRelayer(
    cfg,
    chain,
    new InMemoryNonceAuthority(chain, SPONSOR_ADDRESS),
    jobs
  );
  const router = createRouter(relayer, cfg, chain);
  const call = (req: Partial<RelayerRequest>): Promise<RelayerResponse> =>
    router({ method: 'GET', path: '/sponsor/v3/health', ...req });
  return { cfg, chain, jobs, relayer, router, call };
};

const claimTx = (index = 0, dropId = 1n, nonce = 0n) =>
  buildClaimTx({ senderKey: claimerKey(index), dropId, nonce });

/** Every error body must be exactly the machine-readable envelope. */
const assertCleanError = (res: RelayerResponse, code: string, status: number) => {
  expect(res.status).toBe(status);
  const body = res.body as Record<string, unknown>;
  expect(body.ok).toBe(false);
  expect(body.code).toBe(code);
  expect(Object.keys(body).sort()).toEqual(
    body.detail === undefined ? ['code', 'ok'] : ['code', 'detail', 'ok']
  );
  const serialized = JSON.stringify(body);
  expect(serialized).not.toMatch(/\bat .*\(|node_modules|Error:|stack/i);
};

describe('router: quote', () => {
  it('returns a stringified fee and budget', async () => {
    const h = harness();
    const res = await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: '1' } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, feeUstx: '30000', budgetRemaining: '10000000' });
  });

  it('accepts a numeric dropId and rejects non-canonical ones', async () => {
    const h = harness();
    expect((await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: 1 } })).status).toBe(200);
    for (const dropId of [undefined, '', '-1', '1.0', 'abc', '0x1', ' 1']) {
      assertCleanError(
        await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId } }),
        'BAD_REQUEST',
        400
      );
    }
  });

  it('maps quote failures to stable codes and statuses', async () => {
    const h = harness({}, { '1': { status: 3n }, '2': { budgetRemaining: 1n } });
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: '9' } }),
      'DROP_NOT_FOUND',
      404
    );
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: '1' } }),
      'DROP_NOT_ACTIVE',
      400
    );
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: '2' } }),
      'BUDGET_EXHAUSTED',
      400
    );
  });
});

describe('router: submit', () => {
  it('201 on acceptance, 200 on an idempotent resubmit', async () => {
    const h = harness();
    const txHex = await claimTx();
    const first = await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex }, originKey: 'ip1' });
    expect(first.status).toBe(201);
    const body = first.body as Record<string, unknown>;
    expect(body).toMatchObject({ ok: true, state: 'SPONSORED', existing: false });
    expect(typeof body.jobId).toBe('string');
    expect(body.sponsorTxid).toBe(h.chain.broadcasts[0]!.txid);

    const second = await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex }, originKey: 'ip1' });
    expect(second.status).toBe(200);
    expect(second.body).toMatchObject({ ok: true, existing: true, jobId: body.jobId });
  });

  it('requires a txHex string', async () => {
    const h = harness();
    for (const body of [{}, { txHex: 123 }, { txHex: null }, undefined, 'raw-string']) {
      assertCleanError(
        await h.call({ method: 'POST', path: '/sponsor/v3/submit', body }),
        'BAD_REQUEST',
        400
      );
    }
    expect(h.chain.broadcasts).toHaveLength(0);
  });

  it('maps validation failures to 4xx with the validator code', async () => {
    const h = harness();
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: 'zzzz' } }),
      'BAD_TX',
      400
    );
    const unsponsored = await buildClaimTx({ sponsored: false, fee: 1_000n });
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: unsponsored } }),
      'NOT_SPONSORED',
      400
    );
    assertCleanError(
      await h.call({
        method: 'POST',
        path: '/sponsor/v3/submit',
        body: { txHex: await claimTx(), dropId: '999' }
      }),
      'BODY_MISMATCH',
      400
    );
  });

  it('maps capacity, rate limit, float and preflight codes to their statuses', async () => {
    const rate = harness({ ratePerWallet: 1, ratePerOrigin: 100 }, { '1': {}, '2': {} });
    await rate.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx(0, 1n, 0n) } });
    assertCleanError(
      await rate.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx(0, 2n, 1n) } }),
      'RATE_LIMITED',
      429
    );

    const full = harness({ maxUnsettled: 0 });
    assertCleanError(
      await full.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } }),
      'CAPACITY',
      503
    );

    const broke = harness();
    broke.chain.balance = 1n;
    assertCleanError(
      await broke.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } }),
      'LOW_FLOAT',
      503
    );

    const off = harness({ disabled: true });
    assertCleanError(
      await off.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } }),
      'RELAYER_DISABLED',
      503
    );

    const soldOut = harness({}, { '1': { remaining: 0n } });
    assertCleanError(
      await soldOut.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } }),
      'SOLD_OUT',
      400
    );

    const missing = harness({}, {});
    assertCleanError(
      await missing.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } }),
      'DROP_NOT_FOUND',
      404
    );
  });

  it('maps a node rejection to 502 without leaking the upstream body', async () => {
    const h = harness();
    h.chain.broadcastHook = () => ({ ok: false, error: 'ServerFailureError', reason: 'mempool full' });
    const res = await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } });
    assertCleanError(res, 'BROADCAST_REJECTED', 502);
  });

  it('uses originKey for per-origin limiting and defaults it when absent', async () => {
    const h = harness({ ratePerOrigin: 1, ratePerWallet: 100 }, { '1': { perWalletLimit: 0n } });
    expect(
      (await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx(1) }, originKey: 'ip1' })).status
    ).toBe(201);
    assertCleanError(
      await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx(2) }, originKey: 'ip1' }),
      'RATE_LIMITED',
      429
    );
    expect(
      (await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx(3) } })).status
    ).toBe(201); // 'unknown' origin bucket
  });
});

describe('router: status', () => {
  it('returns the job projection and 404 for unknown ids', async () => {
    const h = harness();
    const submitted = await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } });
    const jobId = (submitted.body as { jobId: string }).jobId;
    const res = await h.call({ method: 'GET', path: `/sponsor/v3/status/${jobId}` });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, jobId, state: 'SPONSORED', dropId: '1' });
    // The raw tx hex and payload hash are never echoed back.
    expect(Object.keys(res.body as object)).not.toContain('txHex');
    expect(Object.keys(res.body as object)).not.toContain('payloadHash');
    assertCleanError(await h.call({ method: 'GET', path: '/sponsor/v3/status/does-not-exist' }), 'NOT_FOUND', 404);
  });
});

describe('router: health', () => {
  it('reports float balance, unsettled count, kill switch and shutdown drops', async () => {
    const h = harness();
    await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } });
    const res = await h.call({ method: 'GET', path: '/sponsor/v3/health' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      ok: true,
      sponsorAddress: SPONSOR_ADDRESS,
      floatUstx: '100000000',
      unsettled: 1,
      disabled: false,
      shutdownDrops: []
    });
  });

  it('reports ok:false (still HTTP 200) when the float is below the floor or the relayer is off', async () => {
    const low = harness();
    low.chain.balance = 1n;
    expect(await low.call({ method: 'GET', path: '/sponsor/v3/health' })).toMatchObject({
      status: 200,
      body: { ok: false, floatUstx: '1' }
    });
    const off = harness({ disabled: true });
    expect(await off.call({ method: 'GET', path: '/sponsor/v3/health' })).toMatchObject({
      status: 200,
      body: { ok: false, disabled: true }
    });
  });
});

describe('router: unknown routes and internal failures', () => {
  it('404s unknown paths and wrong methods', async () => {
    const h = harness();
    for (const req of [
      { method: 'GET', path: '/sponsor/v3/quote' },
      { method: 'POST', path: '/sponsor/v3/health' },
      { method: 'GET', path: '/sponsor/v3/status/' },
      { method: 'POST', path: '/sponsor/v2/submit' },
      { method: 'DELETE', path: '/' }
    ]) {
      assertCleanError(await h.call(req), 'NOT_FOUND', 404);
    }
  });

  it('never lets a transport failure escape as an unhandled rejection', async () => {
    const h = harness();
    h.chain.callReadOnly = async () => {
      throw new Error('hiro 502: <html>upstream detail</html>');
    };
    const res = await h.call({ method: 'POST', path: '/sponsor/v3/quote', body: { dropId: '1' } });
    assertCleanError(res, 'INTERNAL', 500);
    expect(JSON.stringify(res.body)).not.toContain('hiro');
  });

  it('settlement failures never fail the caller request', async () => {
    const h = harness();
    const submitted = await h.call({ method: 'POST', path: '/sponsor/v3/submit', body: { txHex: await claimTx() } });
    const jobId = (submitted.body as { jobId: string }).jobId;
    h.chain.getTxStatus = async () => {
      throw new Error('indexer down');
    };
    const res = await h.call({ method: 'GET', path: `/sponsor/v3/status/${jobId}` });
    expect(res.status).toBe(200);
  });
});

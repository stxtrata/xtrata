import { describe, expect, it } from 'vitest';
import { deserializeTransaction, getAddressFromPrivateKey } from '@stacks/transactions';
import { InMemoryJobStore } from '../src/jobs.js';
import { InMemoryNonceAuthority } from '../src/nonce.js';
import { SponsorRelayer } from '../src/sponsor.js';
import type { RelayerConfig } from '../src/types.js';
import { FakeChain, SPONSOR_KEY, buildClaimTx, claimerKey, makeDrop, testConfig } from './helpers.js';
import type { FakeDrop } from './helpers.js';

const SPONSOR_ADDRESS = getAddressFromPrivateKey(SPONSOR_KEY, 'mainnet');

interface Harness {
  cfg: RelayerConfig;
  chain: FakeChain;
  jobs: InMemoryJobStore;
  nonces: InMemoryNonceAuthority;
  relayer: SponsorRelayer;
  now: () => number;
  setNow: (t: number) => void;
}

const harness = (
  overrides: Partial<RelayerConfig> = {},
  drops: Record<string, Partial<FakeDrop>> = { '1': {} }
): Harness => {
  const cfg = testConfig(overrides);
  const chain = new FakeChain();
  for (const [id, drop] of Object.entries(drops)) chain.drops.set(id, makeDrop(drop));
  const jobs = new InMemoryJobStore();
  const nonces = new InMemoryNonceAuthority(chain, SPONSOR_ADDRESS);
  let t = 1_000_000;
  const relayer = new SponsorRelayer(cfg, chain, nonces, jobs, () => t);
  return { cfg, chain, jobs, nonces, relayer, now: () => t, setNow: (next) => { t = next; } };
};

/** A distinct, valid, sponsored claim tx per (claimer index, drop, nonce). */
const claimTx = (claimerIndex: number, dropId = 1n, nonce = 0n) =>
  buildClaimTx({ senderKey: claimerKey(claimerIndex), dropId, nonce });

const addressOf = (claimerIndex: number) =>
  getAddressFromPrivateKey(claimerKey(claimerIndex), 'mainnet');

// ---------------------------------------------------------------- quote

describe('quote', () => {
  it('fee = estimate × multiplier, capped by the configured ceiling', async () => {
    const h = harness();
    h.chain.feeEstimate = 10_000n;
    expect(await h.relayer.quote(1n)).toMatchObject({
      ok: true,
      feeUstx: 30_000n,
      budgetRemaining: 10_000_000n
    });
    h.chain.feeEstimate = 5_000_000n; // 15 STX × 3 — clamped by maxFeeUstx
    expect(await h.relayer.quote(1n)).toMatchObject({ ok: true, feeUstx: h.cfg.maxFeeUstx });
  });

  it('is capped by the on-chain claim-fee-cap', async () => {
    const h = harness();
    h.chain.claimFeeCap = 12_000n;
    expect(await h.relayer.quote(1n)).toMatchObject({ ok: true, feeUstx: 12_000n });
  });

  it('is refused when budget-remaining cannot cover the quote', async () => {
    const h = harness({}, { '1': { budgetRemaining: 29_999n } });
    expect(await h.relayer.quote(1n)).toMatchObject({
      ok: false,
      code: 'BUDGET_EXHAUSTED',
      budgetRemaining: 29_999n
    });
  });

  it('falls back to the configured estimate when the transport cannot price', async () => {
    const h = harness();
    h.chain.estimateFeeUstx = async () => {
      throw new Error('node down');
    };
    expect(await h.relayer.quote(1n)).toMatchObject({
      ok: true,
      feeUstx: h.cfg.fallbackFeeUstx * h.cfg.feeMultiplier
    });
  });

  it('reports unknown and inactive drops', async () => {
    const h = harness({}, { '1': {}, '2': { status: 3n } });
    expect(await h.relayer.quote(9n)).toMatchObject({ ok: false, code: 'DROP_NOT_FOUND' });
    expect(await h.relayer.quote(2n)).toMatchObject({ ok: false, code: 'DROP_NOT_ACTIVE' });
  });
});

// ---------------------------------------------------------------- submit

describe('submit: validate → preflight → job → nonce → sponsor → broadcast', () => {
  it('drives a well-formed claim to SPONSORED and fronts the fee', async () => {
    const h = harness();
    const outcome = await h.relayer.submit(await claimTx(0), {}, 'ip-a');
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.job.state).toBe('SPONSORED');
    expect(outcome.job.claimer).toBe(addressOf(0));
    expect(outcome.job.dropId).toBe('1');
    expect(outcome.job.feeUstx).toBe('30000');
    expect(outcome.job.sponsorNonce).toBe('100'); // FakeChain account nonce
    expect(outcome.job.sponsorTxid).toBe(h.chain.broadcasts[0]!.txid);
    expect(h.chain.broadcasts).toHaveLength(1);
    expect(h.relayer.auditFor('1').feesFrontedUstx).toBe(30_000n);
    expect(h.relayer.auditFor('1').sponsoredTxids).toEqual([outcome.job.sponsorTxid]);
  });

  it('rejects a body hint that contradicts the signed transaction (threat 17)', async () => {
    const h = harness();
    const tx = await claimTx(0);
    expect(await h.relayer.submit(tx, { dropId: '2' })).toMatchObject({ ok: false, code: 'BODY_MISMATCH' });
    expect(h.chain.broadcasts).toHaveLength(0);
  });

  it('surfaces validation and preflight codes without touching the wallet', async () => {
    const h = harness({}, { '1': { remaining: 0n } });
    expect(await h.relayer.submit('not-hex')).toMatchObject({ ok: false, code: 'BAD_TX' });
    expect(await h.relayer.submit(await claimTx(0))).toMatchObject({ ok: false, code: 'SOLD_OUT' });
    expect(h.chain.broadcasts).toHaveLength(0);
    expect(await h.jobs.countUnsettled()).toBe(0);
  });

  it('is idempotent for an identical payload', async () => {
    const h = harness();
    const tx = await claimTx(0);
    const first = await h.relayer.submit(tx);
    const second = await h.relayer.submit(tx);
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) return;
    expect(second.existing).toBe(true);
    expect(second.job.id).toBe(first.job.id);
    expect(h.chain.broadcasts).toHaveLength(1);
  });

  it('honours the global kill switch and the per-drop deny list', async () => {
    const off = harness({ disabled: true });
    expect(await off.relayer.submit(await claimTx(0))).toMatchObject({ ok: false, code: 'RELAYER_DISABLED' });
    const denied = harness({ deniedDrops: new Set(['1']) });
    expect(await denied.relayer.submit(await claimTx(0))).toMatchObject({ ok: false, code: 'DROP_DENIED' });
  });
});

// ---------------------------------------------------------------- nonce serialization

describe('nonce serialization (threat 18)', () => {
  it('20 concurrent submits allocate 20 distinct sequential nonces', async () => {
    const h = harness({ ratePerOrigin: 100, maxUnsettled: 100, ratePerWallet: 5 });
    h.chain.nonce = 100n;
    const txs = await Promise.all(Array.from({ length: 20 }, (_, i) => claimTx(i + 1)));
    const outcomes = await Promise.all(txs.map((tx) => h.relayer.submit(tx, {}, 'ip-a')));
    expect(outcomes.every((o) => o.ok)).toBe(true);
    const nonces = outcomes.map((o) => (o.ok ? o.job.sponsorNonce : null));
    expect(new Set(nonces).size).toBe(20);
    expect([...nonces].map((n) => Number(n)).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, i) => 100 + i)
    );
    expect(h.chain.broadcasts).toHaveLength(20);
    expect(new Set(h.chain.broadcasts.map((b) => b.txid)).size).toBe(20);
    expect(h.chain.nonceCalls).toBe(1); // one chain read, then in-memory increments
  });
});

// ---------------------------------------------------------------- broadcast idempotency

describe('broadcast idempotency (threat 19)', () => {
  it('a lost broadcast response advances the job instead of re-signing', async () => {
    const h = harness();
    h.chain.broadcastHook = (txid) => {
      h.chain.knownTxids.add(txid); // the node did accept it
      return 'throw'; // ...but the response never came back
    };
    const outcome = await h.relayer.submit(await claimTx(0));
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.job.state).toBe('SPONSORED');
    expect(outcome.job.sponsorNonce).toBe('100');
    expect(h.chain.broadcasts).toHaveLength(0); // hook short-circuited the record

    // The nonce was consumed exactly once: the next job gets 101.
    h.chain.broadcastHook = null;
    const next = await h.relayer.submit(await claimTx(1));
    expect(next.ok && next.job.sponsorNonce).toBe('101');
  });

  it('an "already known" rejection for the exact txid is treated as success', async () => {
    const h = harness();
    h.chain.broadcastHook = (txid) => {
      h.chain.knownTxids.add(txid);
      return { ok: false, error: 'ConflictingNonceInMempool', reason: 'transaction already known' };
    };
    const outcome = await h.relayer.submit(await claimTx(0));
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.job.state).toBe('SPONSORED');
    expect(outcome.job.sponsorTxid).toBeTruthy();
  });

  it('a genuine rejection fails the job and returns the nonce to the pool', async () => {
    const h = harness();
    h.chain.broadcastHook = () => ({ ok: false, error: 'BadFunctionArgument', reason: 'nope' });
    const outcome = await h.relayer.submit(await claimTx(0));
    expect(outcome).toMatchObject({ ok: false, code: 'BROADCAST_REJECTED', detail: 'nope' });
    const failed = (await h.jobs.listByState('FAILED', 10))[0]!;
    expect(failed.error).toContain('BadFunctionArgument');
    h.chain.broadcastHook = null;
    const next = await h.relayer.submit(await claimTx(1));
    expect(next.ok && next.job.sponsorNonce).toBe('100'); // no gap
  });
});

// ---------------------------------------------------------------- guards

describe('submit guards: budget, rate limits, float, capacity, duplicates', () => {
  it('accepts until budget-remaining falls below the quote, then rejects', async () => {
    const h = harness({ ratePerOrigin: 100 }, { '1': { budgetRemaining: 100_000n, perWalletLimit: 0n } });
    const drop = h.chain.drops.get('1')!;
    const codes: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const outcome = await h.relayer.submit(await claimTx(i + 1));
      codes.push(outcome.ok ? 'ok' : outcome.code);
      if (outcome.ok) drop.budgetRemaining -= BigInt(outcome.job.feeUstx); // chain-side debit
    }
    expect(codes).toEqual(['ok', 'ok', 'ok', 'BUDGET_EXHAUSTED', 'BUDGET_EXHAUSTED']);
    expect(drop.budgetRemaining).toBe(10_000n);
  });

  it('enforces the per-wallet rate limit (6th submit in the window)', async () => {
    const drops = Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [String(i + 1), { perWalletLimit: 0n }])
    );
    const h = harness({ ratePerWallet: 5, ratePerOrigin: 100 }, drops);
    const codes: string[] = [];
    for (let dropId = 1; dropId <= 6; dropId += 1) {
      const outcome = await h.relayer.submit(await claimTx(0, BigInt(dropId), BigInt(dropId)));
      codes.push(outcome.ok ? 'ok' : outcome.code);
    }
    expect(codes).toEqual(['ok', 'ok', 'ok', 'ok', 'ok', 'RATE_LIMITED']);

    // The window rolls: advancing past rateWindowMs frees the wallet again.
    h.setNow(h.now() + h.cfg.rateWindowMs + 1);
    const after = await h.relayer.submit(await claimTx(0, 6n, 60n));
    expect(after.ok).toBe(true);
  });

  it('enforces the per-origin rate limit across different wallets', async () => {
    const h = harness({ ratePerOrigin: 3, ratePerWallet: 100 }, { '1': { perWalletLimit: 0n } });
    const codes: string[] = [];
    for (let i = 1; i <= 4; i += 1) {
      const outcome = await h.relayer.submit(await claimTx(i), {}, 'ip-shared');
      codes.push(outcome.ok ? 'ok' : outcome.code);
    }
    expect(codes).toEqual(['ok', 'ok', 'ok', 'RATE_LIMITED']);
    // A different origin is unaffected.
    expect((await h.relayer.submit(await claimTx(9), {}, 'ip-other')).ok).toBe(true);
  });

  it('refuses to sponsor below the float floor', async () => {
    const h = harness();
    h.chain.balance = h.cfg.floatFloorUstx - 1n;
    expect(await h.relayer.submit(await claimTx(0))).toMatchObject({ ok: false, code: 'LOW_FLOAT' });
    h.chain.balance = h.cfg.floatFloorUstx;
    expect((await h.relayer.submit(await claimTx(0))).ok).toBe(true);
  });

  it('applies MAX_UNSETTLED backpressure', async () => {
    const h = harness({ maxUnsettled: 2, ratePerOrigin: 100 }, { '1': { perWalletLimit: 0n } });
    expect((await h.relayer.submit(await claimTx(1))).ok).toBe(true);
    expect((await h.relayer.submit(await claimTx(2))).ok).toBe(true);
    expect(await h.relayer.submit(await claimTx(3))).toMatchObject({ ok: false, code: 'CAPACITY' });
    // Settling one job frees a slot.
    for (const job of await h.jobs.listByState('SPONSORED', 10)) {
      h.chain.txStatuses.set(job.sponsorTxid!, 'success');
    }
    await h.relayer.settle();
    await h.relayer.settle();
    expect(await h.jobs.countUnsettled()).toBeLessThan(2);
    expect((await h.relayer.submit(await claimTx(3))).ok).toBe(true);
  });

  it('rejects a second live claim by the same wallet on a one-per-wallet drop', async () => {
    const h = harness();
    expect((await h.relayer.submit(await claimTx(0, 1n, 0n))).ok).toBe(true);
    // Different tx (different origin nonce) so the payload-hash path is not hit.
    expect(await h.relayer.submit(await claimTx(0, 1n, 1n))).toMatchObject({
      ok: false,
      code: 'DUPLICATE_CLAIM'
    });
    expect(h.chain.broadcasts).toHaveLength(1);
  });
});

// ---------------------------------------------------------------- settlement

describe('settlement walk', () => {
  const settleUntil = async (relayer: SponsorRelayer, passes = 6) => {
    for (let i = 0; i < passes; i += 1) await relayer.settle();
  };

  it('walks CONFIRMED → FEE_CLAIMING → FEE_CLAIMED → SETTLED and reimburses the fee', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    const jobId = submitted.job.id;

    // Claim confirms on chain.
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    expect(await h.relayer.settle()).toBeGreaterThan(0);
    let job = (await h.jobs.get(jobId))!;
    expect(['CONFIRMED', 'FEE_CLAIMED']).toContain(job.state);

    await h.relayer.settle();
    job = (await h.jobs.get(jobId))!;
    expect(job.state).toBe('FEE_CLAIMED');
    expect(job.claimFeeTxid).toBeTruthy();
    // claim-fee is a sponsor-key contract call broadcast through the authority.
    expect(h.chain.broadcasts).toHaveLength(2);

    // Reimbursement only counts once claim-fee confirms.
    expect(h.relayer.auditFor('1').feesReimbursedUstx).toBe(0n);
    await h.relayer.settle();
    expect((await h.jobs.get(jobId))!.state).toBe('FEE_CLAIMED'); // claim-fee still pending

    h.chain.txStatuses.set(job.claimFeeTxid!, 'success');
    await h.relayer.settle();
    expect((await h.jobs.get(jobId))!.state).toBe('SETTLED');
    expect(h.relayer.auditFor('1').feesReimbursedUstx).toBe(30_000n);
    expect(await h.jobs.countUnsettled()).toBe(0);
  });

  it('respects the bounded batch size', async () => {
    const h = harness({ settleBatch: 2, ratePerOrigin: 100 }, { '1': { perWalletLimit: 0n } });
    for (let i = 1; i <= 5; i += 1) {
      const outcome = await h.relayer.submit(await claimTx(i));
      if (outcome.ok) h.chain.txStatuses.set(outcome.job.sponsorTxid!, 'success');
    }
    expect(await h.jobs.listByState('SPONSORED', 10)).toHaveLength(5);
    expect(await h.relayer.settle()).toBe(2);
    expect(await h.jobs.listByState('SPONSORED', 10)).toHaveLength(3);
  });

  it('marks an aborted sponsored tx FAILED and keeps the fronted fee as exposure', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'abort_by_response');
    await h.relayer.settle();
    const job = (await h.jobs.get(submitted.job.id))!;
    expect(job.state).toBe('FAILED');
    expect(job.error).toBe('abort_by_response');
    expect(h.relayer.auditFor('1').feesFrontedUstx).toBe(30_000n); // never reimbursed
  });

  it('un-fronts a dropped tx (no fee was ever charged)', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'dropped');
    await h.relayer.settle();
    expect((await h.jobs.get(submitted.job.id))!.state).toBe('FAILED');
    expect(h.relayer.auditFor('1').feesFrontedUstx).toBe(0n);
  });

  it('a claim-fee broadcast failure returns the job to CONFIRMED for retry, never loses it', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    h.chain.broadcastHook = () => ({ ok: false, error: 'ContractError', reason: 'claim-fee rejected' });
    await settleUntil(h.relayer, 3);
    const job = (await h.jobs.get(submitted.job.id))!;
    expect(job.state).toBe('CONFIRMED');
    expect(job.claimFeeTxid).toBeNull();

    // Retry succeeds once the node accepts it again.
    h.chain.broadcastHook = null;
    await h.relayer.settle();
    const retried = (await h.jobs.get(submitted.job.id))!;
    expect(retried.state).toBe('FEE_CLAIMED');
    expect(retried.claimFeeTxid).toBeTruthy();
  });

  it('prices the claim-fee call from the live estimate, not a hard-coded fee', async () => {
    const h = harness();
    h.chain.feeEstimate = 40_000n; // busy network
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    await settleUntil(h.relayer, 2);
    const claimFeeTx = deserializeTransaction(h.chain.broadcasts[1]!.txHex);
    expect(BigInt(claimFeeTx.auth.spendingCondition.fee)).toBe(120_000n);
  });

  it('records the reimbursement after a worker restart loses the in-memory pending map', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    await settleUntil(h.relayer, 2);
    const claimFeeTxid = (await h.jobs.get(submitted.job.id))!.claimFeeTxid!;
    h.chain.txStatuses.set(claimFeeTxid, 'success');

    // A fresh isolate over the same durable job store: no pendingReimbursements.
    const restarted = new SponsorRelayer(h.cfg, h.chain, h.nonces, h.jobs, h.now);
    restarted.auditFor('1').feesFrontedUstx = 30_000n; // durable ledger replay
    await restarted.settle();
    expect((await h.jobs.get(submitted.job.id))!.state).toBe('SETTLED');
    expect(restarted.auditFor('1').feesReimbursedUstx).toBe(30_000n);
    expect(restarted.auditFor('1').shutdown).toBe(false);
  });

  it('settles reserve-claim jobs without a claim-fee call', async () => {
    const h = harness();
    const tx = await buildClaimTx({
      senderKey: claimerKey(0),
      functionName: 'reserve-claim',
      postConditions: []
    });
    const submitted = await h.relayer.submit(tx);
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    await settleUntil(h.relayer, 4);
    expect((await h.jobs.get(submitted.job.id))!.state).toBe('SETTLED');
    expect(h.chain.broadcasts).toHaveLength(1); // only the sponsored claim itself
  });

  it('refunds the leftover budget once the drop has ended', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    await settleUntil(h.relayer, 2);
    const claimFeeTxid = (await h.jobs.get(submitted.job.id))!.claimFeeTxid!;
    h.chain.txStatuses.set(claimFeeTxid, 'success');
    h.chain.drops.get('1')!.status = 3n; // ENDED with budget left
    await h.relayer.settle();
    const job = (await h.jobs.get(submitted.job.id))!;
    expect(job.state).toBe('SETTLED');
    expect(job.refundTxid).toBeTruthy();
  });

  it('reaps an expired lease instead of stranding the job', async () => {
    const h = harness();
    // A crashed worker left a job holding an expired SIGNING lease.
    const forced = await h.jobs.insert(
      {
        id: 'stranded',
        contractId: h.cfg.dropsContractId,
        functionName: 'claim',
        dropId: '1',
        claimer: 'SP_STRANDED',
        originKey: 'ip',
        payloadHash: 'stranded',
        txHex: '00',
        feeUstx: '30000'
      },
      h.now()
    );
    if (!forced.ok) throw new Error('insert failed');
    await h.jobs.cas('stranded', 'RECEIVED', 'SIGNING', {}, { owner: 'dead', expiresAt: h.now() - 1 }, h.now());
    await h.relayer.settle();
    expect((await h.jobs.get('stranded'))!.state).toBe('RECEIVED');
  });
});

// ---------------------------------------------------------------- exposure

describe('exposure invariant (threat 6)', () => {
  it('trips the per-drop shutdown flag and refuses further submits', async () => {
    const h = harness(
      { maxFloatLossUstx: 45_000n, ratePerOrigin: 100 },
      { '1': { perWalletLimit: 0n } }
    );
    expect((await h.relayer.submit(await claimTx(1))).ok).toBe(true); // fronted 30k
    expect(h.relayer.auditFor('1').shutdown).toBe(false);
    expect((await h.relayer.submit(await claimTx(2))).ok).toBe(true); // fronted 60k > 45k
    expect(h.relayer.auditFor('1').shutdown).toBe(true);
    expect(await h.relayer.submit(await claimTx(3))).toMatchObject({ ok: false, code: 'DROP_SHUTDOWN' });
    expect((await h.relayer.health()).shutdownDrops).toEqual(['1']);

    // An operator can clear it after topping the float up / investigating.
    h.relayer.clearShutdown('1');
    expect((await h.relayer.submit(await claimTx(3))).ok).toBe(true);
  });

  it('reimbursements bring exposure back under the threshold', async () => {
    const h = harness({ maxFloatLossUstx: 45_000n });
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    h.chain.txStatuses.set(submitted.job.sponsorTxid!, 'success');
    await h.relayer.settle();
    await h.relayer.settle();
    const claimFeeTxid = (await h.jobs.get(submitted.job.id))!.claimFeeTxid!;
    h.chain.txStatuses.set(claimFeeTxid, 'success');
    await h.relayer.settle();
    const audit = h.relayer.auditFor('1');
    expect(audit.feesFrontedUstx - audit.feesReimbursedUstx).toBe(0n);
    expect(audit.shutdown).toBe(false);
  });
});

// ---------------------------------------------------------------- status & health

describe('status and health', () => {
  it('returns the job record by id and null for unknown ids', async () => {
    const h = harness();
    const submitted = await h.relayer.submit(await claimTx(0));
    if (!submitted.ok) throw new Error('submit failed');
    expect((await h.relayer.status(submitted.job.id))?.id).toBe(submitted.job.id);
    expect(await h.relayer.status('nope')).toBeNull();
  });

  it('reports float, unsettled count, kill switch and shutdown drops', async () => {
    const h = harness();
    await h.relayer.submit(await claimTx(0));
    const health = await h.relayer.health();
    expect(health).toMatchObject({
      ok: true,
      sponsorAddress: SPONSOR_ADDRESS,
      floatUstx: '100000000',
      unsettled: 1,
      disabled: false,
      shutdownDrops: []
    });
    h.chain.balance = 1n;
    expect((await h.relayer.health()).ok).toBe(false);
    h.chain.getBalance = async () => {
      throw new Error('node down');
    };
    expect(await h.relayer.health()).toMatchObject({ ok: false, floatUstx: '-1' });
  });
});

/**
 * Orchestration: quote → submit (validate → preflight → job → nonce →
 * sponsor → broadcast) → traffic-driven settlement → status.
 *
 * Settlement is traffic-driven (no background loop needed): callers invoke
 * settle() per incoming request; if traffic stops, nothing strands — the
 * contract lets creators self-refund 144 blocks after end/cancel.
 *
 * Exposure invariant per drop:  Σ fronted − Σ reimbursed ≤ maxFloatLossUstx.
 * A breach flips the drop's shutdown flag: no further sponsoring for it until
 * an operator clears it (threat 6).
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  Cl,
  deserializeTransaction,
  getAddressFromPrivateKey,
  makeContractCall,
  sponsorTransaction
} from '@stacks/transactions';
import { preflight, readClaimFeeCap, readDropForSettlement } from './preflight.js';
import { checkBodyHints, validateSubmittedTx } from './validate.js';
import type { NonceAuthority, NonceOutcome } from './nonce.js';
import type {
  BroadcastResult,
  ChainTransport,
  DropAuditEntry,
  JobRecord,
  JobStore,
  RelayerConfig
} from './types.js';

const STATUS_ACTIVE = 1n;

const minBig = (...values: bigint[]): bigint => values.reduce((a, b) => (b < a ? b : a));

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const isNonceConflict = (res: BroadcastResult): boolean =>
  !res.ok && /nonce/i.test(`${res.error} ${res.reason ?? ''}`);

export type SubmitOutcome =
  | { ok: true; job: JobRecord; existing?: boolean }
  | { ok: false; code: string; detail?: string; retryAfterMs?: number };

export interface QuoteOutcome {
  ok: boolean;
  code?: string;
  feeUstx?: bigint;
  budgetRemaining?: bigint;
}

export class SponsorRelayer {
  private readonly sponsorAddress: string;
  private readonly audit = new Map<string, DropAuditEntry>();
  private clock: () => number;

  constructor(
    private readonly cfg: RelayerConfig,
    private readonly transport: ChainTransport,
    private readonly nonces: NonceAuthority,
    private readonly jobs: JobStore,
    clock?: () => number
  ) {
    this.sponsorAddress = getAddressFromPrivateKey(
      cfg.sponsorKey,
      cfg.network === 'mainnet' ? 'mainnet' : 'testnet'
    );
    this.clock = clock ?? (() => Date.now());
  }

  // ---------------------------------------------------------------- audit

  auditFor(dropId: string): DropAuditEntry {
    let entry = this.audit.get(dropId);
    if (!entry) {
      entry = {
        dropId,
        feesFrontedUstx: 0n,
        feesReimbursedUstx: 0n,
        sponsoredTxids: [],
        shutdown: false
      };
      this.audit.set(dropId, entry);
    }
    return entry;
  }

  private recordFronted(dropId: string, amount: bigint, txid: string): void {
    const entry = this.auditFor(dropId);
    entry.feesFrontedUstx += amount;
    entry.sponsoredTxids.push(txid);
    this.checkExposure(entry);
  }

  private recordReimbursed(dropId: string, amount: bigint): void {
    const entry = this.auditFor(dropId);
    entry.feesReimbursedUstx += amount;
    this.checkExposure(entry);
  }

  private checkExposure(entry: DropAuditEntry): void {
    if (entry.feesFrontedUstx - entry.feesReimbursedUstx > this.cfg.maxFloatLossUstx) {
      entry.shutdown = true;
    }
  }

  /** Operator hook: clear a tripped per-drop shutdown. */
  clearShutdown(dropId: string): void {
    this.auditFor(dropId).shutdown = false;
  }

  // ---------------------------------------------------------------- quote

  async quote(dropId: bigint): Promise<QuoteOutcome> {
    const drop = await readDropForSettlement(this.transport, this.cfg, dropId);
    if (!drop) return { ok: false, code: 'DROP_NOT_FOUND' };
    if (drop.status !== STATUS_ACTIVE) return { ok: false, code: 'DROP_NOT_ACTIVE' };
    const fee = await this.computeFee(await readClaimFeeCap(this.transport, this.cfg));
    // The quote is what will actually be attached; a budget that cannot cover
    // it is exhausted (attaching less would underprice the sponsored tx).
    if (fee <= 0n || drop.budgetRemaining < fee) {
      return { ok: false, code: 'BUDGET_EXHAUSTED', budgetRemaining: drop.budgetRemaining };
    }
    return { ok: true, feeUstx: fee, budgetRemaining: drop.budgetRemaining };
  }

  /** fee = min(estimate × multiplier, configured ceiling, on-chain claim-fee-cap). */
  private async computeFee(claimFeeCap: bigint): Promise<bigint> {
    let estimate: bigint;
    try {
      estimate = await this.transport.estimateFeeUstx();
    } catch {
      estimate = this.cfg.fallbackFeeUstx;
    }
    if (estimate <= 0n) estimate = this.cfg.fallbackFeeUstx;
    return minBig(estimate * this.cfg.feeMultiplier, this.cfg.maxFeeUstx, claimFeeCap);
  }

  // ---------------------------------------------------------------- submit

  async submit(
    txHex: string,
    bodyHints: { contractId?: unknown; dropId?: unknown; functionName?: unknown } = {},
    originKey = 'unknown'
  ): Promise<SubmitOutcome> {
    if (this.cfg.disabled) return { ok: false, code: 'RELAYER_DISABLED' };

    // 1. The signed tx is the sole source of truth.
    const validated = validateSubmittedTx(txHex, this.cfg);
    if (!validated.ok) return { ok: false, code: validated.code, detail: validated.detail };
    const facts = validated.facts;

    // 2. Advisory body hints must agree or the request is rejected outright.
    const hintCheck = checkBodyHints(facts, bodyHints);
    if (!hintCheck.ok) return { ok: false, code: 'BODY_MISMATCH', detail: hintCheck.detail };

    const dropKey = facts.dropId.toString();
    if (this.cfg.deniedDrops?.has(dropKey)) return { ok: false, code: 'DROP_DENIED' };
    if (this.auditFor(dropKey).shutdown) return { ok: false, code: 'DROP_SHUTDOWN' };

    // 3. Idempotency: identical payload returns the existing job.
    const payloadHash = hex(sha256(Uint8Array.from(Buffer.from(facts.txHex, 'hex'))));
    const existing = await this.jobs.getByPayloadHash(payloadHash);
    if (existing) return { ok: true, job: existing, existing: true };

    // 4. Rate limits (accepted jobs only) + global capacity + float floor.
    const now = this.clock();
    const since = now - this.cfg.rateWindowMs;
    if ((await this.jobs.countAcceptedSince('claimer', facts.origin, since)) >= this.cfg.ratePerWallet) {
      return { ok: false, code: 'RATE_LIMITED', retryAfterMs: this.cfg.rateWindowMs };
    }
    if ((await this.jobs.countAcceptedSince('originKey', originKey, since)) >= this.cfg.ratePerOrigin) {
      return { ok: false, code: 'RATE_LIMITED', retryAfterMs: this.cfg.rateWindowMs };
    }
    if ((await this.jobs.countUnsettled()) >= this.cfg.maxUnsettled) {
      return { ok: false, code: 'CAPACITY' };
    }
    const balance = await this.transport.getBalance(this.sponsorAddress);
    if (balance < this.cfg.floatFloorUstx) return { ok: false, code: 'LOW_FLOAT' };

    // 5. On-chain preflight with the exact fee we intend to front: preflight
    //    is the budget authority (budget-remaining ≥ quote or BUDGET_EXHAUSTED).
    const fee = await this.computeFee(await readClaimFeeCap(this.transport, this.cfg));
    if (fee <= 0n) return { ok: false, code: 'BUDGET_EXHAUSTED' };
    const pre = await preflight(this.transport, this.cfg, {
      dropId: facts.dropId,
      claimer: facts.origin,
      functionName: facts.functionName,
      quoteUstx: fee
    });
    if (!pre.ok) return { ok: false, code: pre.code, detail: pre.detail };
    const cappedFee = minBig(fee, pre.claimFeeCap, pre.budgetRemaining);

    // 6. Job row (off-chain UNIQUE(drop, claimer) race guard) before any
    //    wallet mutation.
    const inserted = await this.jobs.insert(
      {
        id: crypto.randomUUID(),
        contractId: facts.contractId,
        functionName: facts.functionName,
        dropId: dropKey,
        claimer: facts.origin,
        originKey,
        payloadHash,
        txHex: facts.txHex,
        feeUstx: cappedFee.toString()
      },
      now
    );
    if (!inserted.ok) {
      if (inserted.code === 'DUPLICATE_PAYLOAD') return { ok: true, job: inserted.job, existing: true };
      return { ok: false, code: 'DUPLICATE_CLAIM' };
    }
    let job = inserted.job;

    // 7. Lease → nonce → sign → broadcast. Nonce is allocated only after the
    //    job row holds the SIGNING lease (single-writer authority serializes).
    const leased = await this.jobs.cas(
      job.id,
      'RECEIVED',
      'SIGNING',
      {},
      { owner: 'submit', expiresAt: now + this.cfg.leaseTimeoutMs },
      now
    );
    if (!leased) return { ok: false, code: 'JOB_RACE' };
    job = leased;

    try {
      const result = await this.nonces.withNonce(async (nonce) => {
        const sponsored = await sponsorTransaction({
          transaction: deserializeTransaction(job.txHex),
          sponsorPrivateKey: this.cfg.sponsorKey,
          fee: cappedFee,
          sponsorNonce: nonce,
          network: this.cfg.network
        });
        const txid = sponsored.txid();
        const res = await this.broadcastIdempotent(sponsored.serialize(), txid);
        let outcome: NonceOutcome;
        if (res.ok) outcome = 'broadcast';
        else if (isNonceConflict(res)) outcome = 'conflict';
        else outcome = 'unused';
        return { outcome, value: { res, txid, nonce } };
      });
      if (!result.res.ok) {
        await this.jobs.cas(
          job.id, 'SIGNING', 'FAILED',
          { error: `${result.res.error}: ${result.res.reason ?? ''}` }, null, this.clock()
        );
        return { ok: false, code: 'BROADCAST_REJECTED', detail: result.res.reason ?? result.res.error };
      }
      const sponsoredJob = await this.jobs.cas(
        job.id, 'SIGNING', 'SPONSORED',
        { sponsorTxid: result.txid, sponsorNonce: result.nonce.toString() }, null, this.clock()
      );
      this.recordFronted(dropKey, cappedFee, result.txid);
      return { ok: true, job: sponsoredJob ?? (await this.jobs.get(job.id))! };
    } catch (error) {
      await this.jobs.cas(
        job.id, 'SIGNING', 'FAILED',
        { error: error instanceof Error ? error.message : String(error) }, null, this.clock()
      );
      return { ok: false, code: 'SPONSOR_ERROR', detail: error instanceof Error ? error.message : undefined };
    }
  }

  /** Broadcast with known-txid idempotency (threat 19). */
  private async broadcastIdempotent(txHex: string, expectedTxid: string): Promise<BroadcastResult> {
    if (await this.transport.isTxKnown(expectedTxid)) return { ok: true, txid: expectedTxid };
    let res: BroadcastResult;
    try {
      res = await this.transport.broadcast(txHex, expectedTxid);
    } catch {
      // Transport lost the response; the node may still have accepted it.
      if (await this.transport.isTxKnown(expectedTxid)) return { ok: true, txid: expectedTxid };
      return { ok: false, error: 'TRANSPORT', reason: 'broadcast transport failure' };
    }
    if (!res.ok && (await this.transport.isTxKnown(expectedTxid))) {
      return { ok: true, txid: expectedTxid };
    }
    return res;
  }

  // ---------------------------------------------------------------- settlement

  /**
   * Advance a bounded batch of unsettled jobs:
   * SPONSORED → CONFIRMED/FAILED (chain status) → FEE_CLAIMING (claim-fee tx)
   * → FEE_CLAIMED → REFUNDING (settle-refund when the drop is over) → SETTLED.
   */
  async settle(): Promise<number> {
    const now = this.clock();
    await this.jobs.reapExpiredLeases(now);
    let advanced = 0;
    const budget = this.cfg.settleBatch;

    for (const job of await this.jobs.listByState('SPONSORED', budget)) {
      if (advanced >= budget) break;
      if (await this.advanceSponsored(job)) advanced += 1;
    }
    for (const job of await this.jobs.listByState('CONFIRMED', budget)) {
      if (advanced >= budget) break;
      if (await this.advanceConfirmed(job)) advanced += 1;
    }
    for (const job of await this.jobs.listByState('FEE_CLAIMING', budget)) {
      if (advanced >= budget) break;
      if (await this.advanceFeeClaiming(job)) advanced += 1;
    }
    for (const job of await this.jobs.listByState('FEE_CLAIMED', budget)) {
      if (advanced >= budget) break;
      if (await this.advanceFeeClaimed(job)) advanced += 1;
    }
    for (const job of await this.jobs.listByState('REFUNDING', budget)) {
      if (advanced >= budget) break;
      if (await this.advanceRefunding(job)) advanced += 1;
    }
    return advanced;
  }

  private async advanceSponsored(job: JobRecord): Promise<boolean> {
    if (!job.sponsorTxid) return false;
    const status = await this.transport.getTxStatus(job.sponsorTxid);
    if (status === 'success') {
      return (await this.jobs.cas(job.id, 'SPONSORED', 'CONFIRMED', {}, null, this.clock())) !== null;
    }
    if (status === 'abort_by_response' || status === 'abort_by_post_condition') {
      // The chain charged the sponsor fee even though the claim aborted:
      // the fronted amount stays in the audit ledger as unreimbursed loss.
      return (
        (await this.jobs.cas(job.id, 'SPONSORED', 'FAILED', { error: status }, null, this.clock())) !== null
      );
    }
    if (status === 'dropped') {
      // Dropped from mempool: no fee was spent; undo the fronted record.
      const entry = this.auditFor(job.dropId);
      entry.feesFrontedUstx -= BigInt(job.feeUstx);
      return (
        (await this.jobs.cas(job.id, 'SPONSORED', 'FAILED', { error: 'dropped' }, null, this.clock())) !== null
      );
    }
    return false; // pending / not_found: wait
  }

  private async advanceConfirmed(job: JobRecord): Promise<boolean> {
    // reserve-claim moves no escrow and consumes no fee-settled slot on its
    // own; the follow-up claim job settles the fee. Mark it settled.
    if (job.functionName === 'reserve-claim') {
      return (await this.jobs.cas(job.id, 'CONFIRMED', 'FEE_CLAIMING', {}, null, this.clock())) !== null
        ? (await this.jobs.cas(job.id, 'FEE_CLAIMING', 'FEE_CLAIMED', {}, null, this.clock())) !== null
        : false;
    }
    const now = this.clock();
    const leased = await this.jobs.cas(
      job.id, 'CONFIRMED', 'FEE_CLAIMING', {},
      { owner: 'settle', expiresAt: now + this.cfg.leaseTimeoutMs }, now
    );
    if (!leased) return false; // another worker won the CAS
    const drop = await readDropForSettlement(this.transport, this.cfg, BigInt(job.dropId));
    const amount = minBig(BigInt(job.feeUstx), drop?.budgetRemaining ?? 0n);
    if (amount <= 0n) {
      // Budget already drained: nothing reimbursable; settle as claimed-zero.
      await this.jobs.cas(job.id, 'FEE_CLAIMING', 'FEE_CLAIMED', { error: 'no-budget-for-reimbursement' }, null, this.clock());
      return true;
    }
    const txid = await this.sponsorCall('claim-fee', [Cl.uint(BigInt(job.dropId)), Cl.uint(amount)]);
    if (!txid) {
      await this.jobs.cas(job.id, 'FEE_CLAIMING', 'CONFIRMED', {}, null, this.clock());
      return false;
    }
    await this.jobs.cas(job.id, 'FEE_CLAIMING', 'FEE_CLAIMED', { claimFeeTxid: txid }, null, this.clock());
    // Reimbursement recorded on confirmation in advanceFeeClaimed via txid check
    this.pendingReimbursements.set(txid, { dropId: job.dropId, amount });
    return true;
  }

  private pendingReimbursements = new Map<string, { dropId: string; amount: bigint }>();

  private async advanceFeeClaiming(job: JobRecord): Promise<boolean> {
    // Only reachable after a lease reap; retry from CONFIRMED.
    return (await this.jobs.cas(job.id, 'FEE_CLAIMING', 'CONFIRMED', {}, null, this.clock())) !== null;
  }

  private async advanceFeeClaimed(job: JobRecord): Promise<boolean> {
    // Confirm the claim-fee tx before counting the reimbursement.
    if (job.claimFeeTxid) {
      const pending = this.pendingReimbursements.get(job.claimFeeTxid);
      const status = await this.transport.getTxStatus(job.claimFeeTxid);
      if (status === 'pending' || status === 'not_found') return false;
      if (status === 'success') {
        // The in-memory pending map is per-isolate; a restart between
        // FEE_CLAIMING and confirmation must not lose the reimbursement (it
        // would inflate exposure and trip a bogus shutdown), so fall back to
        // the fee recorded on the durable job row.
        this.recordReimbursed(pending?.dropId ?? job.dropId, pending?.amount ?? BigInt(job.feeUstx));
        this.pendingReimbursements.delete(job.claimFeeTxid);
      }
    }
    // settle-refund only once the drop is over (ended/cancelled) with budget
    // left; while active the budget keeps serving future claims.
    const drop = await readDropForSettlement(this.transport, this.cfg, BigInt(job.dropId));
    if (drop && drop.status !== STATUS_ACTIVE && drop.budgetRemaining > 0n) {
      const now = this.clock();
      const leased = await this.jobs.cas(
        job.id, 'FEE_CLAIMED', 'REFUNDING', {},
        { owner: 'settle', expiresAt: now + this.cfg.leaseTimeoutMs }, now
      );
      if (!leased) return false;
      const txid = await this.sponsorCall('settle-refund', [Cl.uint(BigInt(job.dropId))]);
      if (!txid) {
        await this.jobs.cas(job.id, 'REFUNDING', 'FEE_CLAIMED', {}, null, this.clock());
        return false;
      }
      await this.jobs.cas(job.id, 'REFUNDING', 'SETTLED', { refundTxid: txid }, null, this.clock());
      return true;
    }
    return (await this.jobs.cas(job.id, 'FEE_CLAIMED', 'SETTLED', {}, null, this.clock())) !== null;
  }

  private async advanceRefunding(job: JobRecord): Promise<boolean> {
    // Only reachable after a lease reap; fall back for retry.
    return (await this.jobs.cas(job.id, 'REFUNDING', 'FEE_CLAIMED', {}, null, this.clock())) !== null;
  }

  /** Sponsor-key contract call through the nonce authority. Null on rejection. */
  private async sponsorCall(
    functionName: 'claim-fee' | 'settle-refund',
    args: ReturnType<typeof Cl.uint>[]
  ): Promise<string | null> {
    const [contractAddress, contractName] = this.cfg.dropsContractId.split('.') as [string, string];
    // Settlement calls must not stall behind a stale hard-coded fee: an unmined
    // claim-fee never reimburses the float and eventually trips the exposure
    // shutdown. Price them like sponsorships (estimate × multiplier, ceiling).
    const settlementFee = await this.computeFee(this.cfg.maxFeeUstx);
    try {
      return await this.nonces.withNonce(async (nonce) => {
        const tx = await makeContractCall({
          contractAddress,
          contractName,
          functionName,
          functionArgs: args,
          senderKey: this.cfg.sponsorKey,
          network: this.cfg.network,
          fee: settlementFee,
          nonce,
          postConditionMode: 'allow'
        });
        const txid = tx.txid();
        const res = await this.broadcastIdempotent(tx.serialize(), txid);
        if (res.ok) return { outcome: 'broadcast', value: res.txid };
        return { outcome: isNonceConflict(res) ? 'conflict' : 'unused', value: null };
      });
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------- status & health

  async status(jobId: string): Promise<JobRecord | null> {
    return this.jobs.get(jobId);
  }

  async health(): Promise<{
    ok: boolean;
    sponsorAddress: string;
    floatUstx: string;
    unsettled: number;
    disabled: boolean;
    shutdownDrops: string[];
  }> {
    let float = -1n;
    try {
      float = await this.transport.getBalance(this.sponsorAddress);
    } catch {
      /* transport down: report -1 */
    }
    const unsettled = await this.jobs.countUnsettled();
    const shutdownDrops = [...this.audit.values()].filter((e) => e.shutdown).map((e) => e.dropId);
    return {
      ok: !this.cfg.disabled && float >= this.cfg.floatFloorUstx,
      sponsorAddress: this.sponsorAddress,
      floatUstx: float.toString(),
      unsettled,
      disabled: Boolean(this.cfg.disabled),
      shutdownDrops
    };
  }
}

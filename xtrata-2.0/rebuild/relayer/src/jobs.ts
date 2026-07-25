/**
 * Job store: atomic compare-and-set state machine for sponsor jobs
 * (FABLE-5 finding 2 / threat 18).
 *
 * States: RECEIVED → SIGNING → SPONSORED → CONFIRMED → FEE_CLAIMING →
 * FEE_CLAIMED → (REFUNDING →) SETTLED, with FAILED / ABANDONED terminals.
 * Every transition is `set state=to where id=? and state=from` — proceed only
 * if exactly one row changed. Expired leases on in-flight signing states
 * revert one state so a crashed worker's job is retried, never double-signed.
 *
 * UNIQUE(payload_hash) makes identical resubmits idempotent; the partial
 * unique index on (drop_id, claimer) over non-terminal states is the
 * off-chain one-claim-per-wallet race guard.
 */
import {
  JOB_TRANSITIONS,
  UNSETTLED_STATES,
  type InsertOutcome,
  type JobInsert,
  type JobRecord,
  type JobState,
  type JobStore
} from './types.js';

const LEASE_REVERT: Partial<Record<JobState, JobState>> = {
  SIGNING: 'RECEIVED',
  FEE_CLAIMING: 'CONFIRMED',
  REFUNDING: 'FEE_CLAIMED'
};

export const isLegalTransition = (from: JobState, to: JobState): boolean =>
  JOB_TRANSITIONS[from]?.includes(to) ?? false;

const freshJob = (row: JobInsert, now: number): JobRecord => ({
  ...row,
  state: 'RECEIVED',
  sponsorTxid: null,
  sponsorNonce: null,
  claimFeeTxid: null,
  refundTxid: null,
  error: null,
  leaseOwner: null,
  leaseExpiresAt: null,
  createdAt: now,
  updatedAt: now
});

// ---------------------------------------------------------------- in-memory

export class InMemoryJobStore implements JobStore {
  private jobs = new Map<string, JobRecord>();

  async insert(row: JobInsert, now: number): Promise<InsertOutcome> {
    // Single-threaded JS: this whole method is atomic with respect to other
    // insert/cas calls (no await between check and write).
    for (const job of this.jobs.values()) {
      if (job.payloadHash === row.payloadHash) {
        return { ok: false, code: 'DUPLICATE_PAYLOAD', job };
      }
    }
    for (const job of this.jobs.values()) {
      if (
        job.dropId === row.dropId &&
        job.claimer === row.claimer &&
        job.state !== 'FAILED' &&
        job.state !== 'ABANDONED'
      ) {
        return { ok: false, code: 'DUPLICATE_CLAIM', job };
      }
    }
    const job = freshJob(row, now);
    this.jobs.set(job.id, job);
    return { ok: true, job };
  }

  async get(id: string): Promise<JobRecord | null> {
    return this.jobs.get(id) ?? null;
  }

  async getByPayloadHash(hash: string): Promise<JobRecord | null> {
    for (const job of this.jobs.values()) if (job.payloadHash === hash) return job;
    return null;
  }

  async cas(
    id: string,
    from: JobState,
    to: JobState,
    patch: Partial<JobRecord>,
    lease: { owner: string; expiresAt: number } | null,
    now: number
  ): Promise<JobRecord | null> {
    if (!isLegalTransition(from, to)) {
      throw new Error(`illegal job transition ${from} -> ${to}`);
    }
    const job = this.jobs.get(id);
    if (!job || job.state !== from) return null; // 0 rows changed
    const updated: JobRecord = {
      ...job,
      ...patch,
      id: job.id,
      state: to,
      leaseOwner: lease?.owner ?? null,
      leaseExpiresAt: lease?.expiresAt ?? null,
      updatedAt: now
    };
    this.jobs.set(id, updated);
    return updated;
  }

  async listByState(state: JobState, limit: number): Promise<JobRecord[]> {
    const out: JobRecord[] = [];
    for (const job of this.jobs.values()) {
      if (job.state === state) {
        out.push(job);
        if (out.length >= limit) break;
      }
    }
    return out;
  }

  async countUnsettled(): Promise<number> {
    let n = 0;
    for (const job of this.jobs.values()) if (UNSETTLED_STATES.includes(job.state)) n += 1;
    return n;
  }

  async countAcceptedSince(
    field: 'claimer' | 'originKey',
    value: string,
    since: number
  ): Promise<number> {
    let n = 0;
    for (const job of this.jobs.values()) {
      if (job[field] === value && job.createdAt >= since && job.state !== 'FAILED') n += 1;
    }
    return n;
  }

  async reapExpiredLeases(now: number): Promise<number> {
    let reaped = 0;
    for (const job of this.jobs.values()) {
      const revert = LEASE_REVERT[job.state];
      if (revert && job.leaseExpiresAt !== null && job.leaseExpiresAt < now) {
        this.jobs.set(job.id, {
          ...job,
          state: revert,
          leaseOwner: null,
          leaseExpiresAt: null,
          updatedAt: now
        });
        reaped += 1;
      }
    }
    return reaped;
  }
}

// ---------------------------------------------------------------- D1 adapter

/** Minimal D1 surface so the adapter typechecks without CF workers types. */
export interface D1DatabaseLike {
  prepare(sql: string): {
    bind(...params: unknown[]): {
      run(): Promise<{ meta: { changes: number } }>;
      first<T = unknown>(): Promise<T | null>;
      all<T = unknown>(): Promise<{ results: T[] }>;
    };
  };
}

type Row = {
  id: string;
  state: string;
  contract_id: string;
  function_name: string;
  drop_id: string;
  claimer: string;
  origin_key: string;
  payload_hash: string;
  tx_hex: string;
  fee_ustx: string;
  sponsor_txid: string | null;
  sponsor_nonce: string | null;
  claim_fee_txid: string | null;
  refund_txid: string | null;
  error: string | null;
  lease_owner: string | null;
  lease_expires_at: number | null;
  created_at: number;
  updated_at: number;
};

const fromRow = (r: Row): JobRecord => ({
  id: r.id,
  state: r.state as JobState,
  contractId: r.contract_id,
  functionName: r.function_name as JobRecord['functionName'],
  dropId: r.drop_id,
  claimer: r.claimer,
  originKey: r.origin_key,
  payloadHash: r.payload_hash,
  txHex: r.tx_hex,
  feeUstx: r.fee_ustx,
  sponsorTxid: r.sponsor_txid,
  sponsorNonce: r.sponsor_nonce,
  claimFeeTxid: r.claim_fee_txid,
  refundTxid: r.refund_txid,
  error: r.error,
  leaseOwner: r.lease_owner,
  leaseExpiresAt: r.lease_expires_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

export class D1JobStore implements JobStore {
  constructor(private readonly db: D1DatabaseLike) {}

  async insert(row: JobInsert, now: number): Promise<InsertOutcome> {
    try {
      await this.db
        .prepare(
          `INSERT INTO sponsor_jobs_v3
           (id, state, contract_id, function_name, drop_id, claimer, origin_key,
            payload_hash, tx_hex, fee_ustx, created_at, updated_at)
           VALUES (?, 'RECEIVED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          row.id, row.contractId, row.functionName, row.dropId, row.claimer,
          row.originKey, row.payloadHash, row.txHex, row.feeUstx, now, now
        )
        .run();
    } catch (error) {
      const existingPayload = await this.getByPayloadHash(row.payloadHash);
      if (existingPayload) return { ok: false, code: 'DUPLICATE_PAYLOAD', job: existingPayload };
      const existingClaim = await this.db
        .prepare(
          `SELECT * FROM sponsor_jobs_v3
           WHERE drop_id = ? AND claimer = ? AND state NOT IN ('FAILED','ABANDONED') LIMIT 1`
        )
        .bind(row.dropId, row.claimer)
        .first<Row>();
      if (existingClaim) return { ok: false, code: 'DUPLICATE_CLAIM', job: fromRow(existingClaim) };
      throw error;
    }
    const job = await this.get(row.id);
    if (!job) throw new Error('D1 insert lost the job row');
    return { ok: true, job };
  }

  async get(id: string): Promise<JobRecord | null> {
    const r = await this.db.prepare(`SELECT * FROM sponsor_jobs_v3 WHERE id = ?`).bind(id).first<Row>();
    return r ? fromRow(r) : null;
  }

  async getByPayloadHash(hash: string): Promise<JobRecord | null> {
    const r = await this.db
      .prepare(`SELECT * FROM sponsor_jobs_v3 WHERE payload_hash = ?`)
      .bind(hash)
      .first<Row>();
    return r ? fromRow(r) : null;
  }

  async cas(
    id: string,
    from: JobState,
    to: JobState,
    patch: Partial<JobRecord>,
    lease: { owner: string; expiresAt: number } | null,
    now: number
  ): Promise<JobRecord | null> {
    if (!isLegalTransition(from, to)) {
      throw new Error(`illegal job transition ${from} -> ${to}`);
    }
    const result = await this.db
      .prepare(
        `UPDATE sponsor_jobs_v3 SET
           state = ?,
           sponsor_txid = COALESCE(?, sponsor_txid),
           sponsor_nonce = COALESCE(?, sponsor_nonce),
           claim_fee_txid = COALESCE(?, claim_fee_txid),
           refund_txid = COALESCE(?, refund_txid),
           fee_ustx = COALESCE(?, fee_ustx),
           error = COALESCE(?, error),
           lease_owner = ?,
           lease_expires_at = ?,
           updated_at = ?
         WHERE id = ? AND state = ?`
      )
      .bind(
        to,
        patch.sponsorTxid ?? null,
        patch.sponsorNonce ?? null,
        patch.claimFeeTxid ?? null,
        patch.refundTxid ?? null,
        patch.feeUstx ?? null,
        patch.error ?? null,
        lease?.owner ?? null,
        lease?.expiresAt ?? null,
        now,
        id,
        from
      )
      .run();
    if (result.meta.changes !== 1) return null;
    return this.get(id);
  }

  async listByState(state: JobState, limit: number): Promise<JobRecord[]> {
    const { results } = await this.db
      .prepare(`SELECT * FROM sponsor_jobs_v3 WHERE state = ? ORDER BY created_at LIMIT ?`)
      .bind(state, limit)
      .all<Row>();
    return results.map(fromRow);
  }

  async countUnsettled(): Promise<number> {
    const placeholders = UNSETTLED_STATES.map(() => '?').join(',');
    const r = await this.db
      .prepare(`SELECT COUNT(*) AS n FROM sponsor_jobs_v3 WHERE state IN (${placeholders})`)
      .bind(...UNSETTLED_STATES)
      .first<{ n: number }>();
    return r?.n ?? 0;
  }

  async countAcceptedSince(
    field: 'claimer' | 'originKey',
    value: string,
    since: number
  ): Promise<number> {
    const column = field === 'claimer' ? 'claimer' : 'origin_key';
    const r = await this.db
      .prepare(
        `SELECT COUNT(*) AS n FROM sponsor_jobs_v3
         WHERE ${column} = ? AND created_at >= ? AND state != 'FAILED'`
      )
      .bind(value, since)
      .first<{ n: number }>();
    return r?.n ?? 0;
  }

  async reapExpiredLeases(now: number): Promise<number> {
    let reaped = 0;
    for (const [from, to] of Object.entries(LEASE_REVERT) as [JobState, JobState][]) {
      const result = await this.db
        .prepare(
          `UPDATE sponsor_jobs_v3
           SET state = ?, lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
           WHERE state = ? AND lease_expires_at IS NOT NULL AND lease_expires_at < ?`
        )
        .bind(to, now, from, now)
        .run();
      reaped += result.meta.changes;
    }
    return reaped;
  }
}

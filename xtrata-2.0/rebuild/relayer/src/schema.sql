-- D1 schema for the rebuilt sponsor relayer (xtrata-drops-v3).
-- Apply once via `wrangler d1 execute <db> --file=src/schema.sql`;
-- do NOT recreate per-request (FABLE-5 hardening note).

CREATE TABLE IF NOT EXISTS sponsor_jobs_v3 (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  function_name TEXT NOT NULL,
  drop_id TEXT NOT NULL,
  claimer TEXT NOT NULL,
  origin_key TEXT NOT NULL,
  payload_hash TEXT NOT NULL UNIQUE,
  tx_hex TEXT NOT NULL,
  fee_ustx TEXT NOT NULL,
  sponsor_txid TEXT,
  sponsor_nonce TEXT,
  claim_fee_txid TEXT,
  refund_txid TEXT,
  error TEXT,
  lease_owner TEXT,
  lease_expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- One live claim per (drop, claimer): the off-chain race guard ahead of the
-- on-chain ItemClaimed/WalletClaims guards. Terminal failures free the slot.
CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_v3_active_claim
  ON sponsor_jobs_v3 (drop_id, claimer)
  WHERE state NOT IN ('FAILED', 'ABANDONED');

CREATE INDEX IF NOT EXISTS idx_jobs_v3_state ON sponsor_jobs_v3 (state, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_v3_claimer ON sponsor_jobs_v3 (claimer, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_v3_origin ON sponsor_jobs_v3 (origin_key, created_at);

-- Per-drop audit ledger: every sponsored txid with the fee fronted and the
-- reimbursement observed, for the exposure invariant
--   sum(fronted) - sum(reimbursed) <= maxFloatLossUstx  (else shutdown).
CREATE TABLE IF NOT EXISTS sponsor_audit_v3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drop_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  kind TEXT NOT NULL,           -- 'fronted' | 'reimbursed' | 'refund'
  amount_ustx TEXT NOT NULL,
  txid TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_v3_drop ON sponsor_audit_v3 (drop_id, kind);

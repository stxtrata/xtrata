-- Per-token summary index so explorers/wallet grids read one cached page
-- instead of N per-token chain reads. Populated incrementally from the core's
-- minted-id list (append-only) via /index/<contract> POST sync.

CREATE TABLE IF NOT EXISTS inscription_index (
  contract TEXT NOT NULL,
  token_id INTEGER NOT NULL,
  owner TEXT,
  creator TEXT,
  final_hash TEXT,
  mime TEXT,
  total_size INTEGER,
  total_chunks INTEGER,
  sealed INTEGER,
  migration_source TEXT,
  updated_at INTEGER,
  PRIMARY KEY (contract, token_id)
);

CREATE INDEX IF NOT EXISTS idx_inscription_index_contract_id
  ON inscription_index(contract, token_id);

-- Sync watermark per contract: how many minted-id entries we have ingested.
CREATE TABLE IF NOT EXISTS inscription_index_state (
  contract TEXT PRIMARY KEY,
  minted_count INTEGER,
  synced_count INTEGER,
  updated_at INTEGER
);

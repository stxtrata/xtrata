-- Browser-requested transfers only. No wallet secrets or server-side signer.
CREATE TABLE IF NOT EXISTS audionaut_royalty_intents (
  id TEXT PRIMARY KEY,
  edition INTEGER NOT NULL CHECK(edition BETWEEN 1 AND 111),
  recipient TEXT NOT NULL,
  sender TEXT NOT NULL,
  tx_id TEXT UNIQUE,
  state TEXT NOT NULL CHECK(state IN ('awaiting-wallet','submitted','confirmed','cancelled','failed')),
  note TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS audionaut_royalty_active_intent
  ON audionaut_royalty_intents(edition) WHERE state IN ('awaiting-wallet','submitted');
CREATE TABLE IF NOT EXISTS audionaut_royalty_sales (
  token_id INTEGER PRIMARY KEY,
  tx_id TEXT NOT NULL,
  block_height INTEGER NOT NULL,
  block_hash TEXT NOT NULL,
  amount_micro_stx TEXT NOT NULL
);

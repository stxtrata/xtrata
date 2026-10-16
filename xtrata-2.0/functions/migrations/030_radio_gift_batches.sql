-- Radio prefunded batches (functions/lib/radio-gifts.ts creates these on first use too, so this file is for
-- running by hand against a fresh database). A batch is N gift links a creator pays for up front, in one transfer to
-- the gift treasury with memo `batch <id>`. `request_hash` is the hash of the creator's signed request: each works once.
-- `deposit_txid` is the one payment that made the batch live (unique, so one payment can never fund two batches).
CREATE TABLE IF NOT EXISTS radio_gift_batches(
  id TEXT PRIMARY KEY, request_hash TEXT NOT NULL UNIQUE, creator TEXT NOT NULL, player_id TEXT, count INTEGER NOT NULL,
  amount INTEGER NOT NULL, label TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, deposit_txid TEXT UNIQUE,
  created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS radio_gift_batches_creator ON radio_gift_batches(creator, created_at);
-- The batch a gift belongs to. Null for every gift made before batches existed.
ALTER TABLE radio_gifts ADD COLUMN batch_id TEXT;
CREATE INDEX IF NOT EXISTS radio_gifts_batch ON radio_gifts(batch_id);

-- Radio gift wallets (functions/lib/radio-gifts.ts creates these on first use too).
-- Codes are never stored, only their hash. ip_hash is a salted, truncated hash for per-IP limits.
CREATE TABLE IF NOT EXISTS radio_gifts(
  id TEXT PRIMARY KEY, code_hash TEXT NOT NULL UNIQUE, amount INTEGER NOT NULL, source TEXT NOT NULL,
  gifter TEXT, label TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, deposit_txid TEXT UNIQUE,
  created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, claimed_by TEXT UNIQUE, claim_txid TEXT,
  claimed_at INTEGER, ip_hash TEXT, refund_txid TEXT, updated_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS radio_gifts_status ON radio_gifts(status, expires_at);
CREATE INDEX IF NOT EXISTS radio_gifts_claimed ON radio_gifts(claimed_at);
-- Every treasury send (claim or refund): nonce and signed bytes recorded BEFORE broadcast. txids lists
-- every signature of the same nonce (fee bumps); at most one can land. Only one send may be open.
CREATE TABLE IF NOT EXISTS radio_gift_sends(
  id TEXT PRIMARY KEY, gift_id TEXT NOT NULL, kind TEXT NOT NULL, nonce INTEGER NOT NULL, recipient TEXT NOT NULL,
  amount INTEGER NOT NULL, fee INTEGER NOT NULL, txids TEXT NOT NULL, raw TEXT NOT NULL, status TEXT NOT NULL,
  created_at INTEGER NOT NULL, signed_at INTEGER NOT NULL, broadcast_at INTEGER NOT NULL, nonce_used_at INTEGER, updated_at INTEGER NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS radio_gift_sends_one_open ON radio_gift_sends(status) WHERE status='sent';
-- Signed admin campaign requests already used (SIP-018 message hash): each works once.
CREATE TABLE IF NOT EXISTS radio_gift_campaigns(hash TEXT PRIMARY KEY, admin TEXT NOT NULL, created_at INTEGER NOT NULL);
-- Memo'd deposits that belong to no waiting gift (paid twice, wrong amount, gift already live):
-- status needs-refund until the admin returns them. The row with txid 'scan' only marks the last scan.
CREATE TABLE IF NOT EXISTS radio_gift_orphans(txid TEXT PRIMARY KEY, gift_id TEXT, sender TEXT NOT NULL, amount INTEGER NOT NULL,
  reason TEXT NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);

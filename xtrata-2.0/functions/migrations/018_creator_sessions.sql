-- Collection studio sign-in (2026-09-26).
-- Wallet-signed challenges and HttpOnly session cookies. Only a SHA-256 hash of
-- each session token is stored; the token itself lives only in the browser cookie.
-- Run once: npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/018_creator_sessions.sql
CREATE TABLE IF NOT EXISTS creator_challenges (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  challenge TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE INDEX IF NOT EXISTS creator_challenges_expiry ON creator_challenges(expires_at);

CREATE TABLE IF NOT EXISTS creator_sessions (
  token_hash TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS creator_sessions_address ON creator_sessions(address);

-- Would-be (log mode) and actual (enforce mode) refusals, for the rollout review.
CREATE TABLE IF NOT EXISTS creator_auth_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  action TEXT NOT NULL,
  collection_id TEXT,
  address TEXT,
  reason TEXT NOT NULL,
  mode TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS creator_auth_audit_at ON creator_auth_audit(at);

-- Collector reservations: confirm/cancel must present the token returned at
-- creation (stored hashed), so nobody can cancel someone else's reservation.
-- Existing rows keep NULL and remain manageable by the collection's creator.
ALTER TABLE reservations ADD COLUMN token_hash TEXT;

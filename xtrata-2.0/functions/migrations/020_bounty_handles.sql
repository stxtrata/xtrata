-- Self-linked X handles for the bounty ticket tracker. Public association only: a wallet signed
-- the handle (no funds, no keys). One row per wallet and campaign; one wallet per handle.
CREATE TABLE IF NOT EXISTS bounty_handles(
  campaign TEXT NOT NULL,
  address TEXT NOT NULL,
  handle TEXT NOT NULL,
  handle_key TEXT NOT NULL,
  signed_at INTEGER NOT NULL,
  signature TEXT NOT NULL,
  updated INTEGER NOT NULL,
  PRIMARY KEY(campaign, address)
);
CREATE UNIQUE INDEX IF NOT EXISTS bounty_handles_handle ON bounty_handles(campaign, handle_key);
CREATE TABLE IF NOT EXISTS bounty_handle_rate(key TEXT PRIMARY KEY, started INTEGER NOT NULL, count INTEGER NOT NULL);

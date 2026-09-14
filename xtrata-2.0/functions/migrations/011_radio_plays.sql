-- Pseudonymous browser-reported playback. No IPs, wallets or media URLs.
CREATE TABLE IF NOT EXISTS radio_plays (
  session_id TEXT PRIMARY KEY,
  browser_hash TEXT NOT NULL,
  contract TEXT NOT NULL,
  token_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  rule_version INTEGER NOT NULL,
  duration REAL NOT NULL,
  sequence INTEGER NOT NULL,
  seconds REAL NOT NULL DEFAULT 0,
  spans TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  qualified_at INTEGER,
  completed_at INTEGER,
  closed INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS radio_plays_browser ON radio_plays(browser_hash, updated_at);
CREATE INDEX IF NOT EXISTS radio_plays_track ON radio_plays(contract, token_id, qualified_at);
CREATE INDEX IF NOT EXISTS radio_plays_created ON radio_plays(created_at);

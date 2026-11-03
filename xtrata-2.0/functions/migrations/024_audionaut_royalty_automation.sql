CREATE TABLE IF NOT EXISTS audionaut_royalty_scans (
  address TEXT PRIMARY KEY,
  until_height INTEGER NOT NULL,
  until_hash TEXT NOT NULL,
  floor_height INTEGER NOT NULL,
  scan_offset INTEGER NOT NULL DEFAULT 0,
  complete INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS audionaut_royalty_candidates (
  tx_id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL,
  sender TEXT NOT NULL,
  amount TEXT NOT NULL,
  memo TEXT NOT NULL,
  editions_json TEXT,
  block_height INTEGER NOT NULL,
  note TEXT NOT NULL,
  checked_at INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS audionaut_royalty_automation (
  id INTEGER PRIMARY KEY CHECK(id=1),
  payers_json TEXT NOT NULL DEFAULT '[]',
  lease_until INTEGER NOT NULL DEFAULT 0,
  checked_at INTEGER,
  block_height INTEGER,
  summary_json TEXT,
  error TEXT
);
INSERT OR IGNORE INTO audionaut_royalty_automation(id) VALUES(1);

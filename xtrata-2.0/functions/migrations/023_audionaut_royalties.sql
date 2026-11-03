-- Receipt registration records evidence only. It never initiates a payment.
CREATE TABLE IF NOT EXISTS audionaut_royalty_payments (
  tx_id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL,
  editions_json TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  recorded_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS audionaut_royalty_allocations (
  edition INTEGER PRIMARY KEY CHECK(edition BETWEEN 1 AND 111),
  tx_id TEXT NOT NULL REFERENCES audionaut_royalty_payments(tx_id)
);

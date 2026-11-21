-- One private iPad and one pending approval for the beta-pro tester.
CREATE TABLE IF NOT EXISTS audionaut_device_pairing (
  owner TEXT PRIMARY KEY,
  pending_code TEXT, pending_parent TEXT, pending_until INTEGER,
  device_hash TEXT, device_parent TEXT, device_until INTEGER
);

-- One passkey, many listening wallets (derived, one per album). The code creates these at runtime too
-- (ensureGiftTables / ensureSlotTable), so this file is for running by hand against a fresh database.
-- Public data only: addresses, numbers and the two signatures that prove an address belongs to a passkey.
ALTER TABLE radio_gifts ADD COLUMN root TEXT;
ALTER TABLE radio_gifts ADD COLUMN slot INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS radio_gifts_root_slot ON radio_gifts(root, slot) WHERE root IS NOT NULL;
CREATE TABLE IF NOT EXISTS radio_listening_slots(
  address TEXT PRIMARY KEY,
  root TEXT NOT NULL,
  slot INTEGER NOT NULL,
  issued INTEGER NOT NULL,
  root_signature TEXT NOT NULL,
  slot_signature TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(root, slot)
);

-- Links between a listener's main wallet and their temporary pay-per-play listening wallet.
-- Public data only: two addresses and the two SIP-018 signatures that prove both sides agreed.
-- No keys, no balances, no listening history. A listening wallet links to one main wallet;
-- a main wallet may have a few (one per device or passkey).
CREATE TABLE IF NOT EXISTS radio_listening_wallets(
  listening TEXT PRIMARY KEY,
  main TEXT NOT NULL,
  issued INTEGER NOT NULL,
  main_signature TEXT NOT NULL,
  listening_signature TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS radio_listening_wallets_main ON radio_listening_wallets(main);

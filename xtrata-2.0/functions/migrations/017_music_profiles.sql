-- Public association proofs only. No wallet secrets or funds.
CREATE TABLE IF NOT EXISTS music_profile_versions(address TEXT PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 0, last_challenge TEXT);
CREATE TABLE IF NOT EXISTS music_profile_challenges(id TEXT PRIMARY KEY, support TEXT NOT NULL, revision INTEGER NOT NULL, challenge TEXT NOT NULL, expires INTEGER NOT NULL, consumed INTEGER NOT NULL DEFAULT 0, support_proof TEXT, transfer_seen TEXT, transfer_seen_at INTEGER);
CREATE INDEX IF NOT EXISTS music_profile_expiry ON music_profile_challenges(expires);
CREATE TABLE IF NOT EXISTS music_profiles(address TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT NOT NULL, verified_at INTEGER NOT NULL, revoked INTEGER NOT NULL DEFAULT 0, challenge_id TEXT NOT NULL, proof TEXT NOT NULL, transfer_txid TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS music_profile_transfers(txid TEXT PRIMARY KEY, challenge_id TEXT UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS music_profile_rate(key TEXT PRIMARY KEY, started INTEGER NOT NULL, count INTEGER NOT NULL);

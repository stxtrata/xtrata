-- Radio gift players (functions/lib/radio-gifts.ts creates these on first use too).
-- A player is a stored definition (title, track list, cover) that gift links can point to. A definition
-- never changes after it is made: a new version is a new player. `hash` is the signed definition hash.
CREATE TABLE IF NOT EXISTS radio_gift_players(
  id TEXT PRIMARY KEY, hash TEXT NOT NULL UNIQUE, owner TEXT NOT NULL, title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '',
  tracks TEXT NOT NULL, cover INTEGER, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL);
-- Links that open a player. Null for every gift made before players existed.
ALTER TABLE radio_gifts ADD COLUMN player_id TEXT;
CREATE INDEX IF NOT EXISTS radio_gifts_player ON radio_gifts(player_id);

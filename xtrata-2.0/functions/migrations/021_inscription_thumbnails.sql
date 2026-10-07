-- Stored grid thumbnails for the Explorer (Phase 1 of the Explorer speed-up).
--
-- One row per inscription whose grid tile should show a small stored picture
-- instead of downloading and running the inscription itself. The image lives in
-- the THUMBNAILS R2 bucket at thumbs/<contract_id>/<token_id>.webp (see
-- functions/lib/thumbnails.ts); this table is the index that tells the Explorer
-- which tokens have one, so the grid knows without an extra request per tile.
--
-- status:
--   ready  a WebP exists in R2 (etag is its version, used in the /thumb URL)
--   none   the inscription was inspected and has no cover; title/artist are still
--          kept so the tile can show text instead of a blank poster
--   failed the last attempt failed; a later run retries it
-- source: where the picture came from. 'cover' = embedded or declared artwork,
--         'render' = a screenshot (Phase 3).
CREATE TABLE IF NOT EXISTS inscription_thumbnails (
  contract_id TEXT NOT NULL,
  token_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ready', 'none', 'failed')),
  thumb_key TEXT,
  etag TEXT,
  width INTEGER,
  height INTEGER,
  bytes INTEGER,
  title TEXT NOT NULL DEFAULT '',
  artist TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'cover' CHECK (source IN ('cover', 'render')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (contract_id, token_id)
);

-- Lets a refresh job find work (failed or stale rows) without scanning the table.
CREATE INDEX IF NOT EXISTS idx_inscription_thumbnails_status
  ON inscription_thumbnails (status, updated_at);

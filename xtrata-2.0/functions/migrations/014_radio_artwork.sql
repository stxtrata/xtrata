-- Existing artist metadata stays available while artwork is gradually enriched.
ALTER TABLE radio_metadata ADD COLUMN cover TEXT NOT NULL DEFAULT '';
ALTER TABLE radio_metadata ADD COLUMN cover_checked INTEGER NOT NULL DEFAULT 0;

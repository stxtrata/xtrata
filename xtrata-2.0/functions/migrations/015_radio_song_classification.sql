-- NULL means not yet inspected; only verified HTML audio players enter the song catalogue.
ALTER TABLE radio_metadata ADD COLUMN is_song INTEGER;

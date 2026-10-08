-- Whether the picture behind a thumbnail is animated (a GIF, animated WebP or
-- APNG). The grid only swaps a picture for its still thumbnail when the original
-- is known to be still, so animation keeps playing.
--   NULL = not checked yet, 0 = still, 1 = animated.
ALTER TABLE inscription_thumbnails ADD COLUMN animated INTEGER;

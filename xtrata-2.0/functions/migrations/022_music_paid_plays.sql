-- Public paid-play receipts copied from the xtrata-radio-plays contract, so the homepage
-- can show supporter and play totals without every visitor reading the chain.
-- Everything here is already public on Stacks. No wallet secrets, no listening data.
-- pos is the event's 1-based position in the contract log (oldest = 1).
CREATE TABLE IF NOT EXISTS music_paid_plays(
  txid TEXT PRIMARY KEY,
  pos INTEGER NOT NULL,
  payer TEXT NOT NULL,
  recipient TEXT NOT NULL,
  core INTEGER NOT NULL,
  song_id INTEGER NOT NULL,
  block_time INTEGER
);
CREATE INDEX IF NOT EXISTS music_paid_plays_pos ON music_paid_plays(pos);
CREATE INDEX IF NOT EXISTS music_paid_plays_payer ON music_paid_plays(payer);
-- cursor: highest contiguous log position copied. total: log size at the last read.
-- checked_at: when a refresh last started (ms), used to throttle chain reads.
CREATE TABLE IF NOT EXISTS music_stats_state(key TEXT PRIMARY KEY, value INTEGER NOT NULL);

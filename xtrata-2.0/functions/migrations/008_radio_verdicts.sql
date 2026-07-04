-- Shared radio verdict memory. The radio's client-side probe is the gatekeeper
-- for what actually plays; this table makes its findings COMMUNAL, so one
-- listener discovering a dud (no decodable audio on any core, html player with
-- no embedded audio, wrong mime) spares every other listener the same failed
-- tune attempt. Rows are advisory: /index/playable subtracts duds from the
-- station list; an 'ok' report deletes the row (self-healing if a token was
-- wrongly reported or later becomes playable, e.g. after an R2 warm).
CREATE TABLE IF NOT EXISTS radio_verdicts (
  contract   TEXT    NOT NULL,
  token_id   INTEGER NOT NULL,
  verdict    TEXT    NOT NULL DEFAULT 'dud',  -- only duds are stored; 'ok' clears
  reason     TEXT,                            -- e.g. 'no-content', 'html-no-audio', 'mime:image/png'
  reports    INTEGER NOT NULL DEFAULT 1,      -- distinct sightings (informational)
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (contract, token_id)
);

CREATE INDEX IF NOT EXISTS idx_radio_verdicts_contract ON radio_verdicts (contract);

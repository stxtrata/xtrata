-- Server-side Dataing OAuth sessions. The browser holds `xt_dataing_session`,
-- an opaque id and nothing else; the access token lives only in this row.
--
-- Applied manually like the other migrations, e.g.:
--   npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/010_dataing_sessions.sql
-- (drop --remote for the local dev DB).
--
-- PRIVACY — read before touching this table. `access_token` is a bearer
-- credential for somebody's DATING PROFILE. It must never be selected into
-- /debug, into telemetry, into an API response, or into any log line. Nothing
-- here identifies a Dataing user to us beyond the token itself: no name, no
-- profile fields, no match data are persisted, and per docs/DATAING-COLLAB.md
-- nothing derived from a profile is ever inscribed on-chain.
--
-- Rows are short-lived by construction: `expires_at` comes from the token's own
-- expires_in, and the sweep below is the deletion mechanism the privacy policy
-- (public/privacy.html) promises.
CREATE TABLE IF NOT EXISTS dataing_sessions (
  session_id   TEXT    PRIMARY KEY,       -- opaque; the only half the browser sees
  access_token TEXT    NOT NULL,          -- never leaves the edge
  scope        TEXT,                      -- what the person actually granted
  created_at   INTEGER NOT NULL,          -- epoch ms
  expires_at   INTEGER NOT NULL           -- epoch ms; past this the row is dead
);

CREATE INDEX IF NOT EXISTS idx_dataing_sessions_expires ON dataing_sessions (expires_at);

-- Sweep expired sessions (safe to run repeatedly):
--   DELETE FROM dataing_sessions WHERE expires_at < <now_ms>;

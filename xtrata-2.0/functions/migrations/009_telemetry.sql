-- Append-only user-journey + issue event stream. One row per meaningful thing
-- that happens to a person using the site — especially failures. Everything the
-- /debug dashboard shows (unique issues, failure funnels, retry->success rates)
-- is a QUERY over this table, so there is exactly one source of truth.
--
-- Applied manually like the other migrations, e.g.:
--   npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/009_telemetry.sql
-- (drop --remote for the local dev DB).
--
-- Privacy: no raw wallet addresses, signatures, keys or seed material ever land
-- here. `wallet_hash` is sha256(TELEMETRY_SALT || address) computed server-side
-- in functions/log.ts; the salt is a Pages secret, so rows are not reversible and
-- not brute-forceable offline. No raw or partial wallet address is persisted.
CREATE TABLE IF NOT EXISTS telemetry_events (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id          TEXT    NOT NULL,            -- client uuid; dedup on retry-resend
  ts                INTEGER NOT NULL,            -- client event time (epoch ms)
  received_at       INTEGER NOT NULL,            -- server ingest time (epoch ms)

  session_id        TEXT    NOT NULL,            -- one browser session
  journey_id        TEXT,                        -- one goal attempt-chain (buy X, mint Y)
  attempt           INTEGER NOT NULL DEFAULT 1,  -- 1,2,3… within a journey

  flow              TEXT    NOT NULL,            -- wallet_connect|mint|drop_claim|market_buy|collection_publish|app
  step              TEXT,                        -- sign|broadcast|poll_confirm|upload|reserve…
  outcome           TEXT    NOT NULL,            -- start|success|error|abandon|info
  severity          TEXT    NOT NULL DEFAULT 'info', -- debug|info|warn|error|fatal
  target            TEXT,                        -- object of the action: collectionId|listingId|contract
  duration_ms       INTEGER,                     -- time in this step before the outcome

  error_code        TEXT,                        -- stable code: WALLET_REJECTED, INSUFFICIENT_FEE…
  error_fingerprint TEXT,                        -- hash(flow|step|error_code|normalised msg) => the UNIQUE ISSUE key
  error_message     TEXT,                        -- scrubbed + truncated
  error_stack       TEXT,                        -- scrubbed + truncated (uncaught only)

  app_version       TEXT,                        -- release/build tag => iteration tracking
  route             TEXT,                        -- window.location.pathname
  wallet_hash       TEXT,                        -- salted hash (nullable)
  wallet_prefix     TEXT,                        -- reserved; ingest always writes NULL
  wallet_kind       TEXT,                        -- leather|xverse|asigna|…
  network           TEXT,                        -- mainnet|testnet
  ua_browser        TEXT,                        -- parsed server-side, coarse
  ua_os             TEXT,
  device            TEXT,                        -- desktop|mobile|tablet
  country           TEXT,                        -- request.cf.country
  context_json      TEXT                         -- small JSON: extra fields + breadcrumbs
);

CREATE INDEX IF NOT EXISTS idx_tel_fingerprint  ON telemetry_events (error_fingerprint);
CREATE INDEX IF NOT EXISTS idx_tel_flow_outcome ON telemetry_events (flow, outcome);
CREATE INDEX IF NOT EXISTS idx_tel_session      ON telemetry_events (session_id);
CREATE INDEX IF NOT EXISTS idx_tel_journey      ON telemetry_events (journey_id);
CREATE INDEX IF NOT EXISTS idx_tel_received     ON telemetry_events (received_at);
CREATE INDEX IF NOT EXISTS idx_tel_version      ON telemetry_events (app_version);
CREATE INDEX IF NOT EXISTS idx_tel_target       ON telemetry_events (target);
CREATE UNIQUE INDEX IF NOT EXISTS uq_tel_event_id ON telemetry_events (event_id);

-- One row per UNIQUE issue (error_fingerprint). Ingest upserts the machine
-- columns (counts, first/last seen, a sample); humans own the triage columns
-- (status, owner, notes, resolved_in_release) — this is where "what was learned"
-- and "the solution" live.
CREATE TABLE IF NOT EXISTS telemetry_issues (
  fingerprint         TEXT PRIMARY KEY,
  flow                TEXT,
  step                TEXT,
  error_code          TEXT,
  title               TEXT,                     -- normalised message template (human-readable)
  first_seen          INTEGER NOT NULL,
  last_seen           INTEGER NOT NULL,
  occurrences         INTEGER NOT NULL DEFAULT 0,
  last_sample_event   TEXT,                     -- event_id of a recent occurrence to drill into
  last_app_version    TEXT,                     -- most recent build it was seen on

  status              TEXT NOT NULL DEFAULT 'open', -- open|investigating|resolved|ignored
  owner               TEXT,
  notes               TEXT,                         -- root cause + what was learned
  resolved_in_release TEXT,                         -- app_version the fix shipped in
  updated_at          INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_issues_status   ON telemetry_issues (status, last_seen);
CREATE INDEX IF NOT EXISTS idx_issues_lastseen ON telemetry_issues (last_seen);

-- Roll up an issue only when SQLite actually inserts a new event. Keeping this
-- in an AFTER INSERT trigger makes beacon retries idempotent: INSERT OR IGNORE
-- suppresses both the duplicate event and the occurrence increment.
CREATE TRIGGER IF NOT EXISTS trg_telemetry_issue_rollup
AFTER INSERT ON telemetry_events
WHEN NEW.outcome = 'error'
  AND NEW.error_fingerprint IS NOT NULL
  AND NEW.error_fingerprint <> ''
BEGIN
  INSERT INTO telemetry_issues
    (fingerprint, flow, step, error_code, title, first_seen, last_seen, occurrences,
     last_sample_event, last_app_version, updated_at)
  VALUES
    (NEW.error_fingerprint, NEW.flow, NEW.step, NEW.error_code, NEW.error_message,
     NEW.received_at, NEW.received_at, 1, NEW.event_id, NEW.app_version, NEW.received_at)
  ON CONFLICT(fingerprint) DO UPDATE SET
    last_seen = excluded.last_seen,
    occurrences = telemetry_issues.occurrences + 1,
    last_sample_event = excluded.last_sample_event,
    last_app_version = excluded.last_app_version,
    updated_at = excluded.updated_at;
END;

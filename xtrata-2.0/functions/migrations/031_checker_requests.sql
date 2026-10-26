-- Preservation checker: requests from the page (functions/checker/requests.ts, POST /checker/requests).
-- A holder or creator looking at a report card can ask for a re-test, for an open Forever Twins helper for that
-- collection, or for an assessment of a collection the census has not covered.
--
-- What is stored: the collection (chain + contract id), the kind of request, an optional collection name, an optional
-- note, an optional contact the person chose to type, and whether they say they are a holder or the creator.
-- What is NOT stored: wallet addresses, IP addresses, or anything read from the visitor's browser. The rate-limit table
-- below holds a salted hash of the IP and the hour, and each row is deleted after two hours.
--
-- There is deliberately no public read endpoint. Read and triage requests with wrangler or the D1 console:
--   Run once: npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/031_checker_requests.sql
--
--   New requests, oldest first:
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT datetime(created_at/1000,'unixepoch') AS at, kind, contract_id, collection_name, role, contact, note FROM checker_requests WHERE status='new' ORDER BY created_at"
--   Mark one handled (status is new | seen | done | dismissed):
--     npx wrangler d1 execute xtrata-manage --remote --command "UPDATE checker_requests SET status='done', handled_at=strftime('%s','now')*1000, handled_note='re-tested 2026-11-02' WHERE id='<id>'"
--   Count by collection (what people are asking about most):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT contract_id, kind, COUNT(*) AS n FROM checker_requests GROUP BY contract_id, kind ORDER BY n DESC"
--   Remove contact details once a request is closed (do this on a schedule you are comfortable with):
--     npx wrangler d1 execute xtrata-manage --remote --command "UPDATE checker_requests SET contact='' WHERE status IN ('done','dismissed') AND handled_at < (strftime('%s','now')-7776000)*1000"
CREATE TABLE IF NOT EXISTS checker_requests(
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  chain TEXT NOT NULL DEFAULT 'stacks',
  contract_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  collection_name TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  handled_at INTEGER,
  handled_note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS checker_requests_status ON checker_requests(status, created_at);
CREATE INDEX IF NOT EXISTS checker_requests_contract ON checker_requests(chain, contract_id, kind);
CREATE TABLE IF NOT EXISTS checker_request_rate(key TEXT PRIMARY KEY, started INTEGER NOT NULL, count INTEGER NOT NULL);

-- Preservation checker: anonymous demand counters (functions/checker/lookup.ts).
-- Answers "which collections do people look up, and which ones do we not cover yet?" so new or popular collections can be
-- added to the research. It counts lookups, not people.
--
-- What is stored: a UTC day, a contract id, how it was met ('contract' = someone looked that contract up; 'wallet' = it was among
-- the collections held by a wallet that someone looked up), whether we had a report on it that day, how many lookups, and (for
-- wallets) how many NFTs of it were seen in total.
-- What is NOT stored: the wallet address, the IP, what was pasted, or any link between two lookups or between a collection and
-- a wallet. A person looking things up several times counts several times. Recording is best-effort: if it fails, the lookup
-- is answered as normal.
--
--   Run once: npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/032_checker_demand.sql
--
--   Most-seen collections we do NOT cover, last 30 days (lookups = how often it turned up; items = NFTs seen across those wallets):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT contract_id, SUM(lookups) AS lookups, SUM(items) AS items, SUM(CASE WHEN source='contract' THEN lookups ELSE 0 END) AS looked_up_directly FROM checker_demand WHERE covered=0 AND day >= date('now','-30 day') GROUP BY contract_id ORDER BY lookups DESC LIMIT 40"
--   Same for the collections we do cover (what people are actually checking):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT contract_id, SUM(lookups) AS lookups, SUM(items) AS items FROM checker_demand WHERE covered=1 AND day >= date('now','-30 day') GROUP BY contract_id ORDER BY lookups DESC LIMIT 40"
--   Lookups per day:
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT day, SUM(lookups) AS lookups FROM checker_demand WHERE source='contract' GROUP BY day ORDER BY day DESC LIMIT 30"
--   Delete counts older than a year:
--     npx wrangler d1 execute xtrata-manage --remote --command "DELETE FROM checker_demand WHERE day < date('now','-365 day')"
CREATE TABLE IF NOT EXISTS checker_demand(
  day TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  source TEXT NOT NULL,
  covered INTEGER NOT NULL,
  lookups INTEGER NOT NULL DEFAULT 0,
  items INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, contract_id, source)
);
CREATE INDEX IF NOT EXISTS checker_demand_covered ON checker_demand(covered, day);

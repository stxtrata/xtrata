-- Index tuning for the inscription index.
--
-- 1) Drop idx_inscription_index_contract_id: it is an exact duplicate of the
--    PRIMARY KEY (contract, token_id), so it adds write cost on every upsert
--    without serving any read the PK can't already serve.
-- 2) Add a (contract, updated_at) index for the rolling owner-refresh query in
--    functions/index/[contract].ts, which does
--      SELECT token_id FROM inscription_index
--      WHERE contract = ? ORDER BY updated_at ASC LIMIT ?
--    Without this index that ORDER BY forces a scan + sort of every row for the
--    contract on each completed sync.

DROP INDEX IF EXISTS idx_inscription_index_contract_id;

CREATE INDEX IF NOT EXISTS idx_inscription_index_refresh
  ON inscription_index(contract, updated_at);

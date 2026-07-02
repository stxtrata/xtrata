-- Store token-uri so the index can serve a complete TokenSummary (the grid then
-- needs zero per-token chain reads). Existing rows get NULL until re-synced.
ALTER TABLE inscription_index ADD COLUMN token_uri TEXT;

-- Parent/child edge table for relationship navigation. Each row is one directed
-- edge child_id -> parent_id, populated from each token's get-inscription-summary
-- `parents` list during the index sync (no extra chain reads — the summary the
-- index already reads carries the parents list on v3.2.0+ cores).
--
-- There is no on-chain get-children reader, so this table IS the children index.
-- Because relationships form a mint-ordered DAG (a token can only name parents
-- minted before it), the edge set answers every navigation direction from one
-- table via recursive CTEs:
--   - direct children:   parent_id = X
--   - descendants:        recurse parent_id -> child_id
--   - direct parents:     child_id = X
--   - ancestors:          recurse child_id -> parent_id
--   - siblings:           other children of X's parents
CREATE TABLE IF NOT EXISTS inscription_parents (
  contract TEXT NOT NULL,
  child_id INTEGER NOT NULL,
  parent_id INTEGER NOT NULL,
  updated_at INTEGER,
  PRIMARY KEY (contract, child_id, parent_id)
);

-- Forward traversal: parents/ancestors of a child (also used to refresh a
-- child's edge set in one delete).
CREATE INDEX IF NOT EXISTS idx_inscription_parents_child
  ON inscription_parents(contract, child_id);

-- Reverse traversal: children/descendants of a parent — the core children lookup.
CREATE INDEX IF NOT EXISTS idx_inscription_parents_parent
  ON inscription_parents(contract, parent_id);

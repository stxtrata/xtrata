-- Dependency edge table for composition/reference navigation. Each row is one
-- directed edge child_id -> dependency_id, populated from each token's
-- get-inscription-summary `dependencies` list during the index sync (no extra
-- chain reads — the summary the index already reads carries the dependencies
-- list on v3.2.0+ cores).
--
-- Unlike `parents` (ownership-attested), `dependencies` are existence-only: any
-- inscription may reference any earlier inscription it does not own. That makes
-- this table the index behind permissionless "things that point at X" features —
-- e.g. an open bulletin board whose root is X and whose posts are every
-- inscription that depends on X.
--
-- There is no on-chain get-dependents reader, so this table IS the dependents
-- index. Because relationships form a mint-ordered DAG (a token can only name
-- dependencies minted before it), the edge set answers both directions:
--   - direct dependents (posts on a board):  dependency_id = X
--   - direct dependencies of a child:         child_id = X
CREATE TABLE IF NOT EXISTS inscription_dependencies (
  contract TEXT NOT NULL,
  child_id INTEGER NOT NULL,
  dependency_id INTEGER NOT NULL,
  updated_at INTEGER,
  PRIMARY KEY (contract, child_id, dependency_id)
);

-- Forward traversal: dependencies of a child.
CREATE INDEX IF NOT EXISTS idx_inscription_dependencies_child
  ON inscription_dependencies(contract, child_id);

-- Reverse traversal: dependents of a target — the core "posts on X" lookup.
CREATE INDEX IF NOT EXISTS idx_inscription_dependencies_dependency
  ON inscription_dependencies(contract, dependency_id);

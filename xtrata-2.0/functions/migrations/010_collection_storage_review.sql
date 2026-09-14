-- Opt-in with COLLECTION_STORAGE_V2=1 only after this migration is applied.
-- No remote buckets or lifecycle deletion rules are created by this migration.
CREATE TABLE IF NOT EXISTS collection_storage_objects (
  storage_key TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  total_bytes INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  etag TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'ready' CHECK(state IN ('uploading','ready','held','quarantining','quarantined')),
  recovery_key TEXT,
  ref_version INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS collection_storage_hash ON collection_storage_objects(collection_id, content_hash, state);
CREATE TABLE IF NOT EXISTS collection_upload_intents (
  upload_key TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  content_hash TEXT,
  state TEXT NOT NULL CHECK(state IN ('created','uploading','uploaded')),
  storage_key TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS collection_cleanup_jobs (
  job_id TEXT PRIMARY KEY,
  storage_key TEXT NOT NULL UNIQUE REFERENCES collection_storage_objects(storage_key),
  collection_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('flagged','approved','quarantining','quarantined','retained','blocked')),
  revision INTEGER NOT NULL DEFAULT 1,
  reason TEXT NOT NULL,
  proof_json TEXT,
  references_json TEXT NOT NULL,
  review_note TEXT,
  approved_at INTEGER,
  eligible_at INTEGER,
  lease_until INTEGER,
  lease_id TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS collection_cleanup_review ON collection_cleanup_jobs(collection_id, state, updated_at);
CREATE TABLE IF NOT EXISTS collection_cleanup_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
-- Old mutation endpoints must not bypass a claimed cleanup job. Checks live
-- inside SQLite so they also cover races after a route's preliminary reads.
CREATE TRIGGER IF NOT EXISTS storage_asset_insert_guard BEFORE INSERT ON assets
WHEN EXISTS (SELECT 1 FROM collection_storage_objects o WHERE o.storage_key = NEW.storage_key AND o.state != 'ready')
BEGIN SELECT RAISE(ABORT, 'Storage object is held for cleanup review'); END;
CREATE TRIGGER IF NOT EXISTS storage_asset_update_guard BEFORE UPDATE ON assets
WHEN EXISTS (SELECT 1 FROM collection_storage_objects o WHERE o.storage_key IN (OLD.storage_key, NEW.storage_key)
  AND (o.state IN ('uploading','held','quarantining') OR (o.state='quarantined' AND
    (NEW.asset_id IS NOT OLD.asset_id OR NEW.collection_id IS NOT OLD.collection_id OR NEW.storage_key IS NOT OLD.storage_key
     OR NEW.expected_hash IS NOT OLD.expected_hash OR NEW.total_bytes IS NOT OLD.total_bytes OR NEW.total_chunks IS NOT OLD.total_chunks))))
BEGIN SELECT RAISE(ABORT, 'Storage object is held for cleanup review'); END;
CREATE TRIGGER IF NOT EXISTS storage_asset_delete_guard BEFORE DELETE ON assets
WHEN EXISTS (SELECT 1 FROM collection_storage_objects o WHERE o.storage_key = OLD.storage_key AND o.state != 'ready')
BEGIN SELECT RAISE(ABORT, 'Retain asset history for reviewed storage'); END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_insert_guard BEFORE INSERT ON reservations
WHEN EXISTS (SELECT 1 FROM assets a JOIN collection_storage_objects o ON o.storage_key = a.storage_key
  WHERE a.asset_id = NEW.asset_id AND o.state != 'ready')
BEGIN SELECT RAISE(ABORT, 'Storage object is held for cleanup review'); END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_update_guard BEFORE UPDATE ON reservations
WHEN EXISTS (SELECT 1 FROM assets a JOIN collection_storage_objects o ON o.storage_key = a.storage_key
  WHERE a.asset_id IN (OLD.asset_id, NEW.asset_id) AND (o.state IN ('uploading','held','quarantining') OR
    (o.state='quarantined' AND (NEW.asset_id IS NOT OLD.asset_id OR NEW.collection_id IS NOT OLD.collection_id
      OR NEW.hash_hex IS NOT OLD.hash_hex OR NEW.buyer_address IS NOT OLD.buyer_address))))
BEGIN SELECT RAISE(ABORT, 'Storage object is held for cleanup review'); END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_delete_guard BEFORE DELETE ON reservations
WHEN EXISTS (SELECT 1 FROM assets a JOIN collection_storage_objects o ON o.storage_key = a.storage_key
  WHERE a.asset_id = OLD.asset_id AND o.state != 'ready')
BEGIN SELECT RAISE(ABORT, 'Retain reservation history for reviewed storage'); END;
CREATE TRIGGER IF NOT EXISTS storage_collection_update_guard BEFORE UPDATE ON collections
WHEN (NEW.id IS NOT OLD.id OR NEW.contract_address IS NOT OLD.contract_address OR
  json_extract(NEW.metadata, '$.coreContractId') IS NOT json_extract(OLD.metadata, '$.coreContractId'))
  AND EXISTS (SELECT 1 FROM collection_storage_objects o WHERE o.collection_id = OLD.id AND o.state != 'ready')
BEGIN SELECT RAISE(ABORT, 'Collection has storage held for cleanup review'); END;
CREATE TRIGGER IF NOT EXISTS storage_collection_delete_guard BEFORE DELETE ON collections
WHEN EXISTS (SELECT 1 FROM collection_storage_objects o WHERE o.collection_id = OLD.id)
BEGIN SELECT RAISE(ABORT, 'Retain collection storage audit history'); END;

CREATE TRIGGER IF NOT EXISTS storage_asset_insert_version AFTER INSERT ON assets
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key = NEW.storage_key; END;
CREATE TRIGGER IF NOT EXISTS storage_asset_update_version AFTER UPDATE ON assets
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key IN (OLD.storage_key, NEW.storage_key); END;
CREATE TRIGGER IF NOT EXISTS storage_asset_delete_version AFTER DELETE ON assets
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key = OLD.storage_key; END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_insert_version AFTER INSERT ON reservations
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key IN (SELECT storage_key FROM assets WHERE asset_id = NEW.asset_id); END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_update_version AFTER UPDATE ON reservations
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key IN (SELECT storage_key FROM assets WHERE asset_id IN (OLD.asset_id, NEW.asset_id)); END;
CREATE TRIGGER IF NOT EXISTS storage_reservation_delete_version AFTER DELETE ON reservations
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE storage_key IN (SELECT storage_key FROM assets WHERE asset_id = OLD.asset_id); END;
CREATE TRIGGER IF NOT EXISTS storage_collection_update_version AFTER UPDATE ON collections
WHEN NEW.id IS NOT OLD.id OR NEW.contract_address IS NOT OLD.contract_address OR
  json_extract(NEW.metadata, '$.coreContractId') IS NOT json_extract(OLD.metadata, '$.coreContractId')
BEGIN UPDATE collection_storage_objects SET ref_version = ref_version + 1 WHERE collection_id = OLD.id; END;

CREATE TABLE IF NOT EXISTS collection_content_claims (
  collection_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  PRIMARY KEY (collection_id, content_hash)
);
CREATE TABLE IF NOT EXISTS collection_storage_scan_state (
  collection_id TEXT PRIMARY KEY,
  r2_cursor TEXT,
  updated_at INTEGER NOT NULL DEFAULT 0
);

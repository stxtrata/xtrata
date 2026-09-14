import type { Env } from '../db';
import { advanceAutomaticJobs, scanObject, type Job } from './cleanup';
import { db, first, rows, staging, storageEnabled } from './common';

export async function scanCollection(env: Env, collectionId: string, now = Date.now()) {
  if (!storageEnabled(env)) throw new Error('Verified collection storage is not enabled.');
  const exists = await first(env, 'SELECT id FROM collections WHERE id = ?', [collectionId]);
  if (!exists) throw new Error('Collection not found.');
  const advanced = await advanceAutomaticJobs(env, collectionId, undefined, now);
  // Scan one referenced object per invocation. Rotation by last observation
  // prevents a blocked file from starving the rest of the collection.
  const candidates = await rows<{ storage_key: string }>(env, `SELECT a.storage_key, MIN(COALESCE(j.updated_at,0)) AS checked_at
    FROM assets a LEFT JOIN collection_cleanup_jobs j ON j.storage_key=a.storage_key
    WHERE a.collection_id=? AND a.storage_key IS NOT NULL AND (j.state IS NULL OR j.state IN ('flagged','blocked'))
    GROUP BY a.storage_key ORDER BY checked_at, a.storage_key LIMIT 1`, [collectionId]);
  const scanned: Array<Job | null | { error: string }> = [];
  if (candidates[0]) {
    try { scanned.push(await scanObject(env, collectionId, candidates[0].storage_key, undefined, now)); }
    catch (error) { scanned.push({ error: error instanceof Error ? error.message : 'Scan failed.' }); }
  }
  // Paginate R2 independently to discover abandoned PUTs and legacy orphan
  // objects. Never infer absence of references from an incomplete listing.
  const state = await first<{ r2_cursor: string | null }>(env,
    'SELECT r2_cursor FROM collection_storage_scan_state WHERE collection_id=?', [collectionId]);
  const page = await staging(env).list({ prefix: `${collectionId}/`, limit: 1, ...(state?.r2_cursor ? { cursor: state.r2_cursor } : {}) });
  for (const item of page.objects) {
    if (!candidates.some(candidate => candidate.storage_key === item.key)) {
      try { scanned.push(await scanObject(env, collectionId, item.key, undefined, now)); }
      catch (error) { scanned.push({ error: error instanceof Error ? error.message : 'Object scan failed.' }); }
    }
  }
  await db(env).prepare(`INSERT INTO collection_storage_scan_state (collection_id,r2_cursor,updated_at) VALUES (?,?,?)
    ON CONFLICT(collection_id) DO UPDATE SET r2_cursor=excluded.r2_cursor,updated_at=excluded.updated_at`)
    .bind(collectionId, page.truncated ? page.cursor : null, now).run();
  return { advanced, scanned };
}
export async function runStorageSweep(env: Env) {
  if (!storageEnabled(env)) return { skipped: true };
  // A single collection per invocation bounds RPC/memory work and rotates
  // across collections. Cron never signs, broadcasts, or calls core purge.
  const collection = await first<{ id: string }>(env, `SELECT c.id FROM collections c
    LEFT JOIN collection_storage_scan_state s ON s.collection_id=c.id ORDER BY COALESCE(s.updated_at,0), c.id LIMIT 1`);
  if (!collection) return { empty: true };
  return scanCollection(env, collection.id);
}

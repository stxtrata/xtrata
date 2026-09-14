import type { Env } from '../db';
import { boundedInt, changed, CHUNK_SIZE, db, first, readObject, recovery, references, rows, staging, type Snapshot, type StoredObject } from './common';
import { makeChainReader, targetFor, verifySealedContent, type ChainProof } from './chain';

export type OrphanProof = { kind: 'orphan'; hash: string; size: number; verifiedAt: number };
export type Proof = ChainProof | OrphanProof;
export type Job = { job_id: string; storage_key: string; collection_id: string;
  state: 'flagged' | 'approved' | 'quarantining' | 'quarantined' | 'retained' | 'blocked';
  revision: number; reason: string; proof_json: string | null; references_json: string;
  review_note: string | null; approved_at: number | null; eligible_at: number | null;
  lease_until: number | null; lease_id: string | null; attempts: number; last_error: string | null; created_at: number; updated_at: number };
export type Verifier = (env: Env, object: StoredObject, snapshot: Snapshot, now: number) => Promise<Proof>;
const DAY = 86400000;
const audit = (env: Env, id: string, action: string, detail: string, now: number) =>
  db(env).prepare('INSERT INTO collection_cleanup_audit (job_id, action, detail, created_at) VALUES (?, ?, ?, ?)').bind(id, action, detail, now).run();
export const getJob = (env: Env, id: string) => first<Job>(env, 'SELECT * FROM collection_cleanup_jobs WHERE job_id = ?', [id]);
const getObject = async (env: Env, key: string) => {
  const object = await first<StoredObject>(env, 'SELECT * FROM collection_storage_objects WHERE storage_key = ?', [key]);
  if (!object) throw new Error('Storage record missing.');
  return object;
};
export const verifyCandidate: Verifier = async (env, object, snapshot, now) => {
  if (snapshot.assets.length === 0) {
    const grace = boundedInt(env.COLLECTION_CLEANUP_ORPHAN_GRACE_MS, 7 * DAY, DAY, 365 * DAY);
    if (now - object.created_at < grace) throw new Error('Unreferenced upload is still inside its recovery window.');
    const intent = await first(env, `SELECT upload_key FROM collection_upload_intents
      WHERE (upload_key = ? OR storage_key = ?) AND expires_at > ? LIMIT 1`, [object.storage_key, object.storage_key, now]);
    if (intent) throw new Error('Upload intent is still active.');
    return { kind: 'orphan', hash: object.content_hash, size: object.total_bytes, verifiedAt: now };
  }
  const collection = await first<Record<string, unknown>>(env, 'SELECT * FROM collections WHERE id = ?', [object.collection_id]);
  if (!collection) throw new Error('Collection record missing.');
  return verifySealedContent(env, targetFor(env, collection), object, snapshot, undefined, now);
};
async function verifyStaging(env: Env, object: StoredObject) {
  const source = await readObject(staging(env), object.storage_key);
  if (source.hash !== object.content_hash || source.bytes.length !== object.total_bytes || source.object.etag !== object.etag)
    throw new Error('Staging object changed or verification failed. Keep it for review.');
  return source;
}
export async function discoverObject(env: Env, collectionId: string, key: string, now = Date.now()) {
  if (!key.startsWith(`${collectionId}/`)) throw new Error('Storage key is outside this collection.');
  const existing = await first<StoredObject>(env, 'SELECT * FROM collection_storage_objects WHERE storage_key = ?', [key]);
  if (existing) {
    if (existing.state !== 'uploading') return existing;
    // Recover a successful immutable PUT whose database acknowledgement was
    // lost. Do not interfere with a live upload (including a deduplicated one).
    const live = await first(env, `SELECT upload_key FROM collection_upload_intents
      WHERE collection_id=? AND (upload_key=? OR storage_key=? OR content_hash=?) AND expires_at>? LIMIT 1`,
      [collectionId, key, key, existing.content_hash, now]);
    if (live) return existing;
    const uploaded = await readObject(staging(env), key);
    if (uploaded.hash !== existing.content_hash || uploaded.bytes.length !== existing.total_bytes)
      throw new Error('Interrupted upload bytes do not match their immutable claim.');
    await db(env).prepare(`UPDATE collection_storage_objects SET state='ready', etag=?, updated_at=?
      WHERE storage_key=? AND state='uploading' AND NOT EXISTS
      (SELECT 1 FROM collection_upload_intents WHERE collection_id=? AND
        (upload_key=? OR storage_key=? OR content_hash=?) AND expires_at>?)`)
      .bind(uploaded.object.etag, now, key, collectionId, key, key, existing.content_hash, now).run();
    return getObject(env, key);
  }
  const verified = await readObject(staging(env), key);
  // Existing signed URLs are short-lived; adoption never permits an immediate eviction.
  const created = verified.object.uploaded?.getTime() ?? now;
  await db(env).prepare(`INSERT OR IGNORE INTO collection_storage_objects
    (storage_key, collection_id, content_hash, total_bytes, total_chunks, etag, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'ready', ?, ?)`)
    .bind(key, collectionId, verified.hash, verified.bytes.length, Math.ceil(verified.bytes.length / CHUNK_SIZE), verified.object.etag, created, now).run();
  return getObject(env, key);
}
export async function scanObject(env: Env, collectionId: string, key: string, verify: Verifier = verifyCandidate, now = Date.now()) {
  const object = await discoverObject(env, collectionId, key, now);
  const previous = await first<Job>(env, 'SELECT * FROM collection_cleanup_jobs WHERE storage_key = ?', [key]);
  if (object.collection_id !== collectionId) throw new Error('Collection mismatch.');
  if (object.state !== 'ready' || (previous && ['retained', 'approved', 'quarantining', 'quarantined'].includes(previous.state))) return previous;
  const snapshot = await references(env, key);
  let proof: Proof | null = null;
  let error: string | null = null;
  try { await verifyStaging(env, object); proof = await verify(env, object, snapshot, now); }
  catch (cause) { error = cause instanceof Error ? cause.message : 'Verification failed.'; }
  const id = previous?.job_id ?? crypto.randomUUID();
  const grace = boundedInt(env.COLLECTION_CLEANUP_GRACE_MS, DAY, 3600000, 365 * DAY);
  // A routine rescan cannot erase the first verified observation. Evidence or
  // reference changes restart the waiting period instead of inheriting approval.
  const oldProof = previous?.proof_json ? JSON.parse(previous.proof_json) as Proof : null;
  const oldSnapshot = previous ? JSON.parse(previous.references_json) as Snapshot : null;
  const same = previous?.state === 'flagged' && proof && oldProof && oldSnapshot?.digest === snapshot.digest && oldSnapshot.version === snapshot.version &&
    proof.kind === oldProof.kind && proof.hash === oldProof.hash &&
    (proof.kind !== 'sealed-content' || (oldProof.kind === 'sealed-content' && proof.core === oldProof.core && proof.helper === oldProof.helper && proof.tokenId === oldProof.tokenId));
  const eligible = proof ? (same ? previous!.eligible_at! : now + grace) : null;
  await db(env).prepare(`INSERT INTO collection_cleanup_jobs
    (job_id, storage_key, collection_id, state, reason, proof_json, references_json, eligible_at, last_error, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(storage_key) DO UPDATE SET state=excluded.state, revision=collection_cleanup_jobs.revision+1,
      reason=excluded.reason, proof_json=excluded.proof_json, references_json=excluded.references_json,
      eligible_at=excluded.eligible_at, last_error=excluded.last_error, updated_at=excluded.updated_at
    WHERE collection_cleanup_jobs.state IN ('flagged','blocked')`)
    .bind(id, key, collectionId, proof ? 'flagged' : 'blocked', proof?.kind ?? 'verification-needed',
      proof ? JSON.stringify(same ? oldProof : proof) : null, JSON.stringify(snapshot), eligible, error, now, now).run();
  await audit(env, id, proof ? 'verified-first-pass' : 'held', error ?? 'Verified bytes; awaiting a separate pass after the grace period.', now);
  return getJob(env, id);
}
async function checkEvidence(env: Env, job: Job, object: StoredObject, verify: Verifier, now: number) {
  if (!job.proof_json) throw new Error('A verified first pass is required.');
  const previous = JSON.parse(job.proof_json) as Proof;
  const saved = JSON.parse(job.references_json) as Snapshot;
  const snapshot = await references(env, object.storage_key);
  if (snapshot.digest !== saved.digest || snapshot.version !== saved.version) throw new Error('References changed; rescan required.');
  if (previous.kind === 'sealed-content') {
    const collection = await first<Record<string, unknown>>(env, 'SELECT * FROM collections WHERE id = ?', [object.collection_id]);
    if (!collection) throw new Error('Collection missing.');
    const target = targetFor(env, collection);
    if (target.core !== previous.core || target.helper !== previous.helper) throw new Error('Collection target changed.');
    await makeChainReader(env, target).canonical(previous.blockHeight, previous.blockHash);
  }
  const current = await verify(env, object, snapshot, now);
  if (current.kind !== previous.kind || current.hash !== previous.hash || current.size !== previous.size ||
      (current.kind === 'sealed-content' && (previous.kind !== 'sealed-content' || current.tokenId !== previous.tokenId))) throw new Error('Chain evidence changed; rescan required.');
  return snapshot;
}
export async function approveJob(env: Env, id: string, revision: number, note: string, verify: Verifier = verifyCandidate, now = Date.now()) {
  const job = await getJob(env, id);
  if (!job || job.state !== 'flagged' || job.revision !== revision) throw new Error('Review state changed; refresh the queue.');
  if (!job.eligible_at || now < job.eligible_at) throw new Error('Verification waiting period has not elapsed.');
  const object = await getObject(env, job.storage_key);
  await verifyStaging(env, object);
  const snapshot = await checkEvidence(env, job, object, verify, now);
  const database = db(env);
  const result = await database.batch([
    database.prepare(`UPDATE collection_storage_objects SET state='held', updated_at=? WHERE storage_key=? AND state='ready' AND ref_version=?
      AND EXISTS (SELECT 1 FROM collection_cleanup_jobs WHERE job_id=? AND state='flagged' AND revision=?)`).bind(now, job.storage_key, snapshot.version, id, revision),
    database.prepare(`UPDATE collection_cleanup_jobs SET state='approved', revision=revision+1, approved_at=?, review_note=?, updated_at=?
      WHERE job_id=? AND state='flagged' AND revision=? AND EXISTS
      (SELECT 1 FROM collection_storage_objects WHERE storage_key=? AND state='held' AND ref_version=?)`)
      .bind(now, note.slice(0, 500), now, id, revision, job.storage_key, snapshot.version)
  ]);
  if (!changed(result[0]) || !changed(result[1])) throw new Error('Concurrent reference change; no cleanup was approved.');
  await audit(env, id, 'verified-second-pass', note.slice(0, 500), now);
  return getJob(env, id);
}
export async function retainJob(env: Env, id: string, revision: number, note: string, now = Date.now()) {
  const job = await getJob(env, id);
  if (!job || job.revision !== revision || !['flagged', 'blocked', 'approved'].includes(job.state)) throw new Error('Job cannot be retained in this state.');
  const database = db(env);
  const results = await database.batch([
    database.prepare("UPDATE collection_cleanup_jobs SET state='retained', revision=revision+1, review_note=?, updated_at=? WHERE job_id=? AND revision=? AND state IN ('flagged','blocked','approved')")
      .bind(note.slice(0, 500), now, id, revision),
    database.prepare("UPDATE collection_storage_objects SET state='ready', updated_at=? WHERE storage_key=? AND state='held' AND EXISTS (SELECT 1 FROM collection_cleanup_jobs WHERE job_id=? AND state='retained')")
      .bind(now, job.storage_key, id)
  ]);
  if (!changed(results[0])) throw new Error('Queue changed; refresh.');
  await audit(env, id, 'retained', note.slice(0, 500), now);
  return getJob(env, id);
}
export async function quarantineJob(env: Env, id: string, verify: Verifier = verifyCandidate, now = Date.now()) {
  if (!['auto-quarantine', 'quarantine'].includes(String(env.COLLECTION_CLEANUP_MODE))) throw new Error('Cleanup is in report-only mode.');
  if (env.COLLECTION_CLEANUP_WRITERS_LOCKED !== '1') throw new Error('Immutable writers must be enabled on every deployment before eviction.');
  const archive = recovery(env); // Required even on retries; never discard the last copy.
  const job = await getJob(env, id);
  if (!job || !['approved','quarantining'].includes(job.state) || !job.eligible_at || now < job.eligible_at ||
      (job.lease_until != null && job.lease_until > now)) throw new Error('Job is not eligible or another worker holds its lease.');
  const object = await getObject(env, job.storage_key);
  const lease = crypto.randomUUID();
  const archiveKey = `recovery/v1/${object.content_hash}`;
  const database = db(env);
  const claim = await database.batch([
    database.prepare(`UPDATE collection_cleanup_jobs SET state='quarantining', revision=revision+1, lease_id=?, lease_until=?, attempts=attempts+1, updated_at=?
      WHERE job_id=? AND revision=? AND state IN ('approved','quarantining') AND (lease_until IS NULL OR lease_until<=?)`)
      .bind(lease, now + 3600000, now, id, job.revision, now),
    database.prepare(`UPDATE collection_storage_objects SET state='quarantining', recovery_key=?, updated_at=? WHERE storage_key=? AND state IN ('held','quarantining')
      AND EXISTS (SELECT 1 FROM collection_cleanup_jobs WHERE job_id=? AND lease_id=?)`).bind(archiveKey, now, object.storage_key, id, lease)
  ]);
  if (!changed(claim[0]) || !changed(claim[1])) throw new Error('Cleanup lease was not acquired.');
  try {
    await checkEvidence(env, job, object, verify, now);
    const source = await staging(env).get(object.storage_key);
    if (source) {
      const verified = await verifyStaging(env, object);
      await archive.put(archiveKey, verified.bytes, { onlyIf: { etagDoesNotMatch: '*' },
        httpMetadata: { contentType: 'application/octet-stream' } });
    }
    const copy = await readObject(archive, archiveKey);
    if (copy.hash !== object.content_hash || copy.bytes.length !== object.total_bytes) throw new Error('Recovery copy verification failed.');
    // A lost acknowledgement is safe: the immutable recovery copy is verified
    // again even if the staging DELETE already succeeded on a previous attempt.
    const keepLease = await database.prepare("UPDATE collection_cleanup_jobs SET lease_until=? WHERE job_id=? AND lease_id=? AND state='quarantining'")
      .bind(Date.now() + 3600000, id, lease).run();
    if (!changed(keepLease)) throw new Error('Cleanup lease lost.');
    const latest = await staging(env).head(object.storage_key);
    if (latest && latest.etag !== object.etag) throw new Error('Staging object changed after verification.');
    await staging(env).delete(object.storage_key);
    const finished = await database.batch([
      database.prepare(`UPDATE collection_storage_objects SET state='quarantined', updated_at=? WHERE storage_key=? AND state='quarantining'
        AND EXISTS (SELECT 1 FROM collection_cleanup_jobs WHERE job_id=? AND lease_id=?)`).bind(now, object.storage_key, id, lease),
      database.prepare(`INSERT INTO collection_cleanup_audit (job_id, action, detail, created_at)
        SELECT job_id, 'quarantined', 'Staging removed after recovery verification; recovery retained indefinitely.', ?
        FROM collection_cleanup_jobs WHERE job_id=? AND lease_id=?`).bind(now, id, lease),
      database.prepare("UPDATE collection_cleanup_jobs SET state='quarantined', revision=revision+1, lease_until=NULL, lease_id=NULL, last_error=NULL, updated_at=? WHERE job_id=? AND lease_id=?")
        .bind(now, id, lease)
    ]);
    if (!changed(finished[0]) || !changed(finished[2])) throw new Error('Cleanup acknowledgement failed.');
  } catch (error) {
    await database.prepare("UPDATE collection_cleanup_jobs SET last_error=?, lease_until=NULL, lease_id=NULL, updated_at=? WHERE job_id=? AND lease_id=?")
      .bind(error instanceof Error ? error.message : 'Cleanup failed.', now, id, lease).run();
    throw error;
  }
  return getJob(env, id);
}
export async function advanceAutomaticJobs(env: Env, collectionId: string, verify: Verifier = verifyCandidate, now = Date.now()) {
  if (env.COLLECTION_CLEANUP_MODE !== 'auto-quarantine') return null;
  const jobs = await rows<Job>(env, `SELECT * FROM collection_cleanup_jobs WHERE collection_id=? AND
    ((state='flagged' AND eligible_at<=?) OR state='approved' OR (state='quarantining' AND (lease_until IS NULL OR lease_until<=?)))
    ORDER BY updated_at LIMIT 1`, [collectionId, now, now]);
  const job = jobs[0];
  if (!job) return null;
  try {
    if (job.state === 'flagged') await approveJob(env, job.job_id, job.revision, 'Automatic second verification after grace period.', verify, now);
    return await quarantineJob(env, job.job_id, verify, now);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Automatic verification failed.';
    // Failed evidence stays visible, rather than authorizing deletion on retry.
    await db(env).prepare(`UPDATE collection_cleanup_jobs SET state=CASE WHEN state='flagged' THEN 'blocked' ELSE state END,
      last_error=?, updated_at=? WHERE job_id=?`).bind(message, now, job.job_id).run();
    return getJob(env, job.job_id);
  }
}

import { describe, expect, it } from 'vitest';
import { advanceAutomaticJobs, approveJob, getJob, quarantineJob, retainJob, scanObject } from '../collection-storage/cleanup';
import { createUploadIntent, putVerifiedUpload, validateAssetStorage } from '../collection-storage/uploads';
import { first } from '../collection-storage/common';
import { onRequest } from '../../collections/[collectionId]/cleanup';
import { fixture, sqliteAvailable, BYTES, COLLECTION, HASH, KEY, NOW } from './storage/fixtures';

const DAY = 86400000;
async function approvedFixture() {
  const f = await fixture();
  const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
  const approved = (await approveJob(f.env, flagged.job_id, flagged.revision, 'second pass', undefined, NOW + DAY))!;
  return { ...f, flagged, approved };
}

describe.skipIf(!sqliteAvailable)('automatic collection quarantine with real SQLite guards', () => {
  it('automatically flags, waits, rechecks, archives and removes only staging', async () => {
    const f = await fixture();
    const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
    expect(flagged.state).toBe('flagged');
    expect(f.bucket.deletes).toEqual([]);
    expect(await advanceAutomaticJobs(f.env, COLLECTION, undefined, NOW + DAY - 1)).toBeNull();
    const result = await advanceAutomaticJobs(f.env, COLLECTION, undefined, NOW + DAY);
    expect(result?.state).toBe('quarantined');
    expect(f.bucket.files.has(KEY)).toBe(false);
    expect(f.archive.files.get(`recovery/v1/${HASH}`)?.bytes).toEqual(BYTES);
    expect(f.archive.deletes).toEqual([]);
    expect(await getJob(f.env, flagged.job_id)).not.toBeNull();
  });
  it('retains originals when the independent recovery PUT fails', async () => {
    const f = await approvedFixture(); f.archive.failPut = true;
    await expect(quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY)).rejects.toThrow('Recovery unavailable');
    expect(f.bucket.files.has(KEY)).toBe(true);
    expect((await getJob(f.env, f.approved.job_id))?.state).toBe('quarantining');
    f.archive.failPut = false;
    expect((await quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY + 1))?.state).toBe('quarantined');
  });
  it('rejects a corrupt pre-existing recovery copy without deleting staging', async () => {
    const f = await approvedFixture(); await f.archive.put(`recovery/v1/${HASH}`, new Uint8Array([1]));
    await expect(quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY)).rejects.toThrow('Recovery copy verification');
    expect(f.bucket.deletes).toEqual([]);
  });
  it('retries safely when R2 deletion succeeds but D1 acknowledgement fails', async () => {
    const f = await approvedFixture(); f.bucket.afterDelete = () => { f.DB.failBatch = true; };
    await expect(quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY)).rejects.toThrow('D1 unavailable');
    expect(f.bucket.files.has(KEY)).toBe(false);
    expect(f.archive.files.has(`recovery/v1/${HASH}`)).toBe(true);
    f.bucket.afterDelete = null;
    expect((await quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY + 1))?.state).toBe('quarantined');
  });
  it('protects against a second concurrent worker', async () => {
    const f = await approvedFixture();
    f.DB.sqlite.prepare("UPDATE collection_cleanup_jobs SET state='quarantining',lease_until=?,lease_id='other' WHERE job_id=?").run(NOW + 2 * DAY, f.approved.job_id);
    await expect(quarantineJob(f.env, f.approved.job_id, undefined, NOW + DAY)).rejects.toThrow('lease');
    expect(f.bucket.deletes).toEqual([]);
  });
  it('restarts verification after references change and freezes new references after approval', async () => {
    const f = await fixture(); const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
    f.DB.sqlite.prepare('INSERT INTO assets (asset_id,collection_id,storage_key,expected_hash,total_bytes,total_chunks) VALUES (?,?,?,?,?,?)')
      .run('a', COLLECTION, KEY, HASH, BYTES.length, 1);
    await expect(approveJob(f.env, flagged.job_id, flagged.revision, 'review', undefined, NOW + DAY)).rejects.toThrow('References changed');
    const g = await approvedFixture();
    expect(() => g.DB.sqlite.prepare('INSERT INTO assets (asset_id,collection_id,storage_key) VALUES (?,?,?)').run('a', COLLECTION, KEY)).toThrow('held');
    expect(() => g.DB.sqlite.prepare('DELETE FROM collections WHERE id=?').run(COLLECTION)).toThrow('audit');
  });
  it('blocks changed bytes, missing bytes and unconfirmed hashes', async () => {
    const f = await fixture(); const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
    await f.bucket.put(KEY, new Uint8Array([1]));
    await expect(approveJob(f.env, flagged.job_id, flagged.revision, 'review', undefined, NOW + DAY)).rejects.toThrow('changed');
    const g = await fixture();
    const blocked = await scanObject(g.env, COLLECTION, KEY, async () => { throw new Error('Hash has no confirmed inscription.'); }, NOW);
    expect(blocked?.state).toBe('blocked');
    expect(await advanceAutomaticJobs(g.env, COLLECTION, undefined, NOW + DAY)).toBeNull();
    expect(g.bucket.deletes).toEqual([]);
  });
  it('keeps report-only mode and writer-lock deployment guard fail closed', async () => {
    const f = await approvedFixture(); f.env.COLLECTION_CLEANUP_MODE = 'report-only';
    await expect(quarantineJob(f.env, f.approved.job_id)).rejects.toThrow('report-only');
    f.env.COLLECTION_CLEANUP_MODE = 'auto-quarantine'; f.env.COLLECTION_CLEANUP_WRITERS_LOCKED = '0';
    await expect(quarantineJob(f.env, f.approved.job_id)).rejects.toThrow('Immutable writers');
    expect(f.bucket.deletes).toEqual([]);
  });
  it('honours an explicit retention override and rejects stale approval', async () => {
    const f = await fixture(); const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
    await retainJob(f.env, flagged.job_id, flagged.revision, 'Keep original');
    expect((await scanObject(f.env, COLLECTION, KEY, undefined, NOW + DAY))?.state).toBe('retained');
    await expect(approveJob(f.env, flagged.job_id, flagged.revision, 'stale', undefined, NOW + DAY)).rejects.toThrow('changed');
  });
  it('requires backend auth and prevents cross-collection actions', async () => {
    const f = await fixture(); const flagged = (await scanObject(f.env, COLLECTION, KEY, undefined, NOW))!;
    const invoke = (token: string, collection = COLLECTION) => onRequest({ env: f.env, params: { collectionId: collection },
      request: new Request('https://local/cleanup', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retain', jobId: flagged.job_id, revision: flagged.revision, note: 'keep' }) }) } as any);
    expect((await invoke('wrong')).status).toBe(401);
    expect((await invoke('s'.repeat(32))).status).toBe(401);
    expect((await invoke('a'.repeat(32), 'other')).status).toBe(404);
    expect((await invoke('a'.repeat(32))).status).toBe(200);
  });
});

describe.skipIf(!sqliteAvailable)('verified upload lifecycle', () => {
  it('recovers an interrupted immutable PUT only after its upload intent expires', async () => {
    const f = await fixture();
    const intent = await createUploadIntent(f.env, COLLECTION, NOW - 8 * DAY);
    const uploaded = await putVerifiedUpload(f.env, COLLECTION, intent.key, BYTES, 'text/plain', NOW - 8 * DAY);
    f.DB.sqlite.prepare("UPDATE collection_storage_objects SET state='uploading',etag='' WHERE storage_key=?").run(uploaded.key);
    f.DB.sqlite.prepare("UPDATE collection_upload_intents SET state='uploading',expires_at=? WHERE upload_key=?").run(NOW + 1, intent.key);
    expect(await scanObject(f.env, COLLECTION, uploaded.key, undefined, NOW)).toBeNull();
    await expect(putVerifiedUpload(f.env, COLLECTION, intent.key, new Uint8Array([2]), 'text/plain', NOW)).rejects.toThrow('original');
    const job = await scanObject(f.env, COLLECTION, uploaded.key, undefined, NOW + 2);
    expect(job?.state).toBe('flagged');
    expect(f.bucket.deletes).toEqual([]);
  });
  it('deduplicates actual bytes and rejects an incorrect manifest or overwrite', async () => {
    const f = await fixture();
    const a = await createUploadIntent(f.env, COLLECTION, NOW);
    const firstUpload = await putVerifiedUpload(f.env, COLLECTION, a.key, BYTES, 'text/plain', NOW);
    const b = await createUploadIntent(f.env, COLLECTION, NOW);
    const second = await putVerifiedUpload(f.env, COLLECTION, b.key, BYTES, 'text/plain', NOW);
    expect(second.key).toBe(firstUpload.key);
    expect(second.expectedHash).toBe(HASH);
    await expect(putVerifiedUpload(f.env, COLLECTION, a.key, new Uint8Array([2]), 'text/plain', NOW)).rejects.toThrow('immutable');
    await expect(validateAssetStorage(f.env, 'other', firstUpload.key, HASH, BYTES.length, 1)).rejects.toThrow('manifest');
    await expect(validateAssetStorage(f.env, COLLECTION, firstUpload.key, HASH, BYTES.length + 1, 1)).rejects.toThrow('manifest');
    await expect(validateAssetStorage(f.env, COLLECTION, firstUpload.key, HASH, BYTES.length, 1)).resolves.toMatchObject({ content_hash: HASH });
  });
  it('serializes simultaneous equal-content uploads to one R2 key', async () => {
    const f = await fixture(); const a = await createUploadIntent(f.env, COLLECTION, NOW); const b = await createUploadIntent(f.env, COLLECTION, NOW);
    const results = await Promise.all([putVerifiedUpload(f.env, COLLECTION, a.key, BYTES, 'text/plain', NOW), putVerifiedUpload(f.env, COLLECTION, b.key, BYTES, 'text/plain', NOW)]);
    expect(results[0].key).toBe(results[1].key);
    expect(f.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM collection_storage_objects').get()?.n).toBe(1);
  });
  it('rejects unknown or expired upload intents', async () => {
    const f = await fixture();
    await expect(putVerifiedUpload(f.env, COLLECTION, KEY, BYTES, 'text/plain', NOW)).rejects.toThrow('intent');
    const a = await createUploadIntent(f.env, COLLECTION, NOW);
    await expect(putVerifiedUpload(f.env, COLLECTION, a.key, BYTES, 'text/plain', NOW + DAY)).rejects.toThrow('expired');
  });
});

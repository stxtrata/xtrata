import type { Env } from '../db';
import { CHUNK_SIZE, MAX_BYTES, changed, db, first, hashBytes, normalizeHash, readObject, staging, type StoredObject } from './common';

type Intent = { upload_key: string; collection_id: string; state: string; content_hash: string | null; storage_key: string | null; expires_at: number };
export async function createUploadIntent(env: Env, collectionId: string, now = Date.now()) {
  const key = `${collectionId}/${crypto.randomUUID()}`;
  await db(env).prepare('INSERT INTO collection_upload_intents (upload_key, collection_id, state, expires_at, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(key, collectionId, 'created', now + 3600000, now).run();
  return { key, mode: 'verified', uploadUrl: `/collections/${encodeURIComponent(collectionId)}/upload-url?key=${encodeURIComponent(key)}` };
}
export async function boundedBody(request: Request) {
  if (!request.body) throw new Error('Upload body missing.');
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error('Upload exceeds 32 MiB.');
      parts.push(value);
    }
  } catch (error) { await reader.cancel(); throw error; }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return bytes;
}
export async function putVerifiedUpload(env: Env, collectionId: string, key: string, bytes: Uint8Array, contentType: string, now = Date.now()) {
  const hash = hashBytes(bytes);
  const intent = await first<Intent>(env, 'SELECT * FROM collection_upload_intents WHERE upload_key = ? AND collection_id = ?', [key, collectionId]);
  if (!intent || (intent.state !== 'uploaded' && intent.expires_at < now)) throw new Error('Upload intent missing or expired. Request a new upload URL.');
  if (intent.state === 'uploaded') {
    const stored = await first<StoredObject>(env, 'SELECT * FROM collection_storage_objects WHERE storage_key = ?', [intent.storage_key]);
    if (!stored || stored.state !== 'ready' || stored.content_hash !== hash) throw new Error('Upload retry does not match the immutable stored file.');
    return { key: stored.storage_key, expectedHash: hash, reused: true };
  }
  if (intent.state === 'uploading' && intent.content_hash !== hash) throw new Error('Upload retry changed the original file.');
  if (intent.state === 'created') {
    const claim = await db(env).prepare("UPDATE collection_upload_intents SET state = 'uploading', content_hash = ? WHERE upload_key = ? AND state = 'created'").bind(hash, key).run();
    if (!changed(claim)) throw new Error('Upload is already being handled; retry the same request.');
  }
  const prior = await first<StoredObject>(env,
    'SELECT * FROM collection_storage_objects WHERE collection_id = ? AND content_hash = ? ORDER BY created_at LIMIT 1', [collectionId, hash]);
  // The unique claim serializes equal content, while legacy duplicate object
  // rows remain independently auditable and can each be quarantined.
  await db(env).prepare('INSERT OR IGNORE INTO collection_content_claims (collection_id, content_hash, storage_key) VALUES (?, ?, ?)')
    .bind(collectionId, hash, prior?.storage_key ?? key).run();
  const claim = await first<{ storage_key: string }>(env,
    'SELECT storage_key FROM collection_content_claims WHERE collection_id = ? AND content_hash = ?', [collectionId, hash]);
  if (!claim) throw new Error('Content claim unavailable.');
  await db(env).prepare(`INSERT OR IGNORE INTO collection_storage_objects
    (storage_key, collection_id, content_hash, total_bytes, total_chunks, etag, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, '', 'uploading', ?, ?)`)
    .bind(claim.storage_key, collectionId, hash, bytes.length, Math.ceil(bytes.length / CHUNK_SIZE), now, now).run();
  const existing = await first<StoredObject>(env,
    'SELECT * FROM collection_storage_objects WHERE storage_key = ?', [claim.storage_key]);
  if (!existing || existing.content_hash !== hash || existing.total_bytes !== bytes.length) throw new Error('Storage claim does not match these immutable bytes.');
  const storageKey = existing.storage_key;
  if (existing.state === 'uploading') {
    await staging(env).put(storageKey, bytes, { onlyIf: { etagDoesNotMatch: '*' }, httpMetadata: { contentType } });
    const verified = await readObject(staging(env), storageKey);
    if (verified.hash !== hash || verified.bytes.length !== bytes.length) throw new Error('Stored bytes do not match upload.');
    await db(env).prepare("UPDATE collection_storage_objects SET etag = ?, state = 'ready', updated_at = ? WHERE storage_key = ? AND state = 'uploading'")
      .bind(verified.object.etag, now, storageKey).run();
  } else {
    if (existing.state !== 'ready') throw new Error('This content is uploading or held for cleanup. Retry later or reuse its confirmed chain reference.');
    const verified = await readObject(staging(env), storageKey);
    if (verified.hash !== hash || verified.bytes.length !== bytes.length || verified.object.etag !== existing.etag) throw new Error('Existing content verification failed.');
  }
  await db(env).prepare("UPDATE collection_upload_intents SET state = 'uploaded', storage_key = ? WHERE upload_key = ?").bind(storageKey, key).run();
  return { key: storageKey, expectedHash: hash, reused: storageKey !== key };
}
export async function validateAssetStorage(env: Env, collectionId: string, key: string, hash: unknown, bytes: number, chunks: number) {
  const stored = await first<StoredObject>(env, 'SELECT * FROM collection_storage_objects WHERE storage_key = ?', [key]);
  if (!stored || stored.collection_id !== collectionId || stored.state !== 'ready' || stored.content_hash !== normalizeHash(hash) ||
      stored.total_bytes !== bytes || stored.total_chunks !== chunks) throw new Error('Asset manifest does not match its verified staging object.');
  return stored;
}

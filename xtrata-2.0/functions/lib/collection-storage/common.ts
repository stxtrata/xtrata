import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, concatBytes } from '@noble/hashes/utils';
import type { Env } from '../db';

export type StorageResult<T = Record<string, unknown>> = { results: T[]; meta: { changes: number }; success: boolean };
export interface StorageStatement {
  bind(...args: unknown[]): StorageStatement;
  all<T = Record<string, unknown>>(): Promise<StorageResult<T>>;
  run(): Promise<StorageResult>;
}
export interface StorageDatabase {
  prepare(sql: string): StorageStatement;
  batch(statements: StorageStatement[]): Promise<StorageResult[]>;
}
export type StorageBody = { body: ReadableStream<Uint8Array>; size: number; etag: string; uploaded: Date;
  httpMetadata?: { contentType?: string }; arrayBuffer(): Promise<ArrayBuffer> };
export interface StorageBucket {
  get(key: string): Promise<StorageBody | null>;
  head(key: string): Promise<{ etag: string; size: number } | null>;
  put(key: string, bytes: Uint8Array, options?: { onlyIf?: { etagDoesNotMatch: string }; httpMetadata?: { contentType: string } }): Promise<unknown>;
  delete(key: string): Promise<unknown>;
  list(options: { prefix: string; cursor?: string; limit?: number }): Promise<{ objects: { key: string; uploaded?: Date }[]; truncated: boolean; cursor?: string }>;
}

export const CHUNK_SIZE = 16384;
export const MAX_BYTES = 32 * 1024 * 1024;
export const storageEnabled = (env: Env) => env.COLLECTION_STORAGE_V2 === '1';
export const hashBytes = (bytes: Uint8Array) => {
  if (bytes.length < 1 || bytes.length > MAX_BYTES) throw new Error('File must contain 1 byte to 32 MiB.');
  let hash: Uint8Array = new Uint8Array(32);
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) hash = sha256(concatBytes(hash, bytes.subarray(i, i + CHUNK_SIZE)));
  return bytesToHex(hash);
};
export const digestJson = (value: unknown) => bytesToHex(sha256(new TextEncoder().encode(JSON.stringify(value))));
export const normalizeHash = (value: unknown) => {
  const hash = String(value ?? '').replace(/^0x/, '').toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid Xtrata content hash.');
  return hash;
};
export const db = (env: Env) => {
  const database = (env.DB ?? env.D1 ?? env.db) as unknown as StorageDatabase | undefined;
  if (!database) throw new Error('D1 storage binding missing.');
  return database;
};
export const staging = (env: Env) => {
  const bucket = (env.COLLECTION_ASSETS ?? env.R2 ?? env.ASSETS) as unknown as StorageBucket | undefined;
  if (!bucket) throw new Error('Collection staging bucket missing.');
  return bucket;
};
export const recovery = (env: Env) => {
  const bucket = env.COLLECTION_RECOVERY as unknown as StorageBucket | undefined;
  if (!bucket || bucket === staging(env)) throw new Error('A separate COLLECTION_RECOVERY bucket is required.');
  return bucket;
};
export const rows = async <T>(env: Env, sql: string, args: unknown[] = []): Promise<T[]> =>
  (await db(env).prepare(sql).bind(...args).all<T>()).results ?? [];
export const first = async <T>(env: Env, sql: string, args: unknown[] = []): Promise<T | null> =>
  (await rows<T>(env, sql, args))[0] ?? null;
export const changed = (result: StorageResult) => Number(result.meta?.changes ?? 0) === 1;
export const boundedInt = (value: unknown, fallback: number, min: number, max: number) => {
  if (value == null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min || n > max) throw new Error('Invalid storage safety configuration.');
  return n;
};
export type StoredObject = {
  storage_key: string; collection_id: string; content_hash: string; total_bytes: number;
  total_chunks: number; etag: string; state: 'uploading' | 'ready' | 'held' | 'quarantining' | 'quarantined';
  recovery_key: string | null; ref_version: number; created_at: number; updated_at: number;
};
export type Asset = { asset_id: string; collection_id: string; expected_hash: string; total_bytes: number;
  total_chunks: number; storage_key: string; state: string; edition_cap: number; updated_at: number };
export type Reservation = { reservation_id: string; collection_id: string; asset_id: string;
  buyer_address: string; hash_hex: string; status: string; tx_id: string | null; expires_at: number; updated_at: number };
export type Snapshot = { assets: Asset[]; reservations: Reservation[]; digest: string; version: number };
export async function references(env: Env, key: string): Promise<Snapshot> {
  const database = db(env);
  const result = await database.batch([
    database.prepare('SELECT * FROM assets WHERE storage_key = ? ORDER BY asset_id').bind(key),
    database.prepare('SELECT r.* FROM reservations r JOIN assets a ON a.asset_id = r.asset_id WHERE a.storage_key = ? ORDER BY r.reservation_id').bind(key),
    database.prepare('SELECT ref_version FROM collection_storage_objects WHERE storage_key = ?').bind(key)
  ]);
  const assets = result[0].results as unknown as Asset[];
  const reservations = result[1].results as unknown as Reservation[];
  const version = Number(result[2].results[0]?.ref_version);
  if (!Number.isSafeInteger(version)) throw new Error('Storage object was not registered.');
  return { assets, reservations, digest: digestJson({ assets, reservations }), version };
}
export async function readObject(bucket: StorageBucket, key: string) {
  const object = await bucket.get(key);
  if (!object) throw new Error('Stored bytes are unavailable.');
  if (object.size < 1 || object.size > MAX_BYTES) throw new Error('Unsupported stored object size.');
  const bytes = new Uint8Array(await object.arrayBuffer());
  return { object, bytes, hash: hashBytes(bytes) };
}

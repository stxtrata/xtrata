import { createRequire } from 'node:module';
const DatabaseSync = Number(process.versions.node.split('.')[0]) >= 22
  ? createRequire(import.meta.url)('node:sqlite').DatabaseSync : null;
export const sqliteAvailable = DatabaseSync !== null;
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { hashBytes } from '../../collection-storage/common';

export const NOW = 1900000000000;
export const COLLECTION = 'collection-a';
export const KEY = `${COLLECTION}/file-a`;
export const BYTES = new TextEncoder().encode('verified collection content');
export const HASH = hashBytes(BYTES);
export function memoryDb() {
  const sqlite = new DatabaseSync(':memory:');
  for (const filename of ['001_create_collections.sql', '010_collection_storage_review.sql']) {
    sqlite.exec(readFileSync(fileURLToPath(new URL(`../../../migrations/${filename}`, import.meta.url)), 'utf8'));
  }
  function prepare(sql: string) {
    let args: any[] = [];
    const statement = {
      sql,
      bind(...values: unknown[]) { args = values.map(x => x ?? null); return statement; },
      execute() {
        if (/^\s*(SELECT|WITH|PRAGMA)/i.test(sql)) return { results: sqlite.prepare(sql).all(...args), success: true, meta: { changes: 0 } };
        const result = sqlite.prepare(sql).run(...args);
        return { results: [], success: true, meta: { changes: Number(result.changes) } };
      },
      async all() { return statement.execute(); },
      async run() { return statement.execute(); }
    };
    return statement;
  }
  return { sqlite, prepare, failBatch: false,
    async batch(statements: ReturnType<typeof prepare>[]) {
      if (this.failBatch) { this.failBatch = false; throw new Error('D1 unavailable'); }
      sqlite.exec('BEGIN IMMEDIATE');
      try { const results = statements.map(s => s.execute()); sqlite.exec('COMMIT'); return results; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    }
  };
}
export function memoryBucket() {
  const files = new Map<string, { bytes: Uint8Array; contentType: string; uploaded: Date }>();
  const bucket = { files, deletes: [] as string[], failPut: false, failDelete: false, failRead: false, afterDelete: null as (() => void) | null,
    async get(key: string) {
      if (bucket.failRead) throw new Error('Bucket unavailable');
      const file = files.get(key);
      if (!file) return null;
      const bytes = file.bytes.slice();
      return { key, etag: createHash('sha256').update(bytes).digest('hex'), size: bytes.length,
        uploaded: file.uploaded, httpMetadata: { contentType: file.contentType }, body: new Blob([bytes]).stream(),
        async arrayBuffer() { return bytes.buffer; } };
    },
    async head(key: string) { return bucket.get(key); },
    async put(key: string, body: Uint8Array, options?: any) {
      if (bucket.failPut) throw new Error('Recovery unavailable');
      if (options?.onlyIf?.etagDoesNotMatch === '*' && files.has(key)) return null;
      files.set(key, { bytes: new Uint8Array(body).slice(), contentType: options?.httpMetadata?.contentType ?? 'text/plain', uploaded: new Date(NOW - 10 * 86400000) });
      return bucket.get(key);
    },
    async delete(key: string) {
      if (bucket.failDelete) throw new Error('R2 delete unavailable');
      bucket.deletes.push(key); files.delete(key); bucket.afterDelete?.();
    },
    async list({ prefix = '', cursor, limit = 1 }: { prefix?: string; cursor?: string; limit?: number }) {
      const keys = [...files.keys()].filter(key => key.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const objects = await Promise.all(keys.slice(start, start + limit).map(key => bucket.head(key)));
      return { objects, truncated: start + limit < keys.length, cursor: String(start + limit) };
    }
  };
  return bucket;
}
export async function fixture() {
  const DB = memoryDb(); const COLLECTION_ASSETS = memoryBucket(); const COLLECTION_RECOVERY = memoryBucket();
  const env: any = { DB, COLLECTION_ASSETS, COLLECTION_RECOVERY, COLLECTION_STORAGE_V2: '1',
    COLLECTION_CLEANUP_MODE: 'auto-quarantine', COLLECTION_CLEANUP_WRITERS_LOCKED: '1',
    COLLECTION_CLEANUP_ADMIN_TOKEN: 'a'.repeat(32), COLLECTION_CLEANUP_SCAN_TOKEN: 's'.repeat(32) };
  DB.sqlite.prepare('INSERT INTO collections (id,metadata,state) VALUES (?,?,?)').run(COLLECTION, '{}', 'draft');
  await COLLECTION_ASSETS.put(KEY, BYTES);
  return { env, DB, bucket: COLLECTION_ASSETS, archive: COLLECTION_RECOVERY };
}

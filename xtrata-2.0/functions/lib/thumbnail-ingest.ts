import { queryAll, run, type Env } from './db';
import {
  THUMBNAIL_SIZE,
  cleanThumbnailText,
  parseThumbnailRequest,
  thumbnailKey
} from './thumbnails';

// POST /thumb/<contract>/<tokenId>: the Inscription Wizard sends a small cover
// picture right after a song is minted, so the Explorer tile has its thumbnail
// at once instead of waiting for the next `npm run thumbnails:sync`.
//
// The browser is not trusted. This accepts a picture only when ALL of these hold:
//   - the token is already in the inscription index and is an HTML file (a song player),
//   - it has no ready thumbnail yet (a stored one is never replaced),
//   - the body is a real, small WebP.
// `npm run thumbnails:sync` only fills gaps. To replace uploaded pictures with ones
// read from the chain, run scripts/backfill-all-thumbnails.mjs --kinds html --force.

/** Hard cap on an uploaded thumbnail. Real ones are 1 to 20 KB. */
export const MAX_INGEST_BYTES = 40 * 1024;

type IngestBucket = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
};
export type IngestEnv = Env & { THUMBNAILS?: IngestBucket };

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });

/** True for a RIFF container whose form type is WEBP. */
export const looksLikeWebp = (bytes: Uint8Array): boolean =>
  bytes.length >= 16 &&
  String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' &&
  String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP';

const clampDimension = (value: string | null): number | null => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= THUMBNAIL_SIZE * 2 ? n : null;
};

const etagOf = async (bytes: Uint8Array): Promise<string> => {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes as unknown as BufferSource));
  return Array.from(digest.subarray(0, 8), (b) => b.toString(16).padStart(2, '0')).join('');
};

export const ingestThumbnail = async (
  request: Request,
  env: IngestEnv,
  contractParam: unknown,
  tokenParam: unknown
): Promise<Response> => {
  const parsed = parseThumbnailRequest(contractParam, tokenParam);
  if (!parsed) return json({ error: 'bad-request' }, 400);
  const bucket = env.THUMBNAILS;
  if (!bucket || typeof bucket.put !== 'function') return json({ error: 'unavailable' }, 503);

  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_INGEST_BYTES) return json({ error: 'too-large' }, 413);
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_INGEST_BYTES) return json({ error: 'too-large' }, 413);
  if (!looksLikeWebp(bytes)) return json({ error: 'not-webp' }, 415);

  try {
    const indexed = await queryAll(
      env,
      'SELECT mime FROM inscription_index WHERE contract = ? AND token_id = ?',
      [parsed.contractId, parsed.tokenId]
    );
    const row = (indexed.results ?? [])[0] as { mime?: string } | undefined;
    // New mints can take a moment to reach the index: the caller retries on 409.
    if (!row) return json({ error: 'not-indexed-yet' }, 409);
    if (!String(row.mime ?? '').toLowerCase().startsWith('text/html')) {
      return json({ error: 'not-a-song-player' }, 422);
    }
    const existing = await queryAll(
      env,
      'SELECT status FROM inscription_thumbnails WHERE contract_id = ? AND token_id = ?',
      [parsed.contractId, parsed.tokenId]
    );
    if (((existing.results ?? [])[0] as { status?: string } | undefined)?.status === 'ready') {
      return json({ status: 'exists' }, 200);
    }

    const url = new URL(request.url);
    const key = thumbnailKey(parsed.contractId, parsed.tokenId);
    const etag = await etagOf(bytes);
    await bucket.put(key, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer, {
      httpMetadata: { contentType: 'image/webp' }
    });
    // The row is written only after the upload, so it never points at a missing file.
    await run(
      env,
      `INSERT INTO inscription_thumbnails
         (contract_id, token_id, status, thumb_key, etag, width, height, bytes, title, artist, source, animated, updated_at)
       VALUES (?, ?, 'ready', ?, ?, ?, ?, ?, ?, ?, 'cover', NULL, ?)
       ON CONFLICT(contract_id, token_id) DO UPDATE SET
         status = 'ready', thumb_key = excluded.thumb_key, etag = excluded.etag,
         width = excluded.width, height = excluded.height, bytes = excluded.bytes,
         title = excluded.title, artist = excluded.artist, source = 'cover',
         updated_at = excluded.updated_at
       WHERE inscription_thumbnails.status <> 'ready'`,
      [
        parsed.contractId,
        parsed.tokenId,
        key,
        etag,
        clampDimension(url.searchParams.get('w')),
        clampDimension(url.searchParams.get('h')),
        bytes.length,
        cleanThumbnailText(url.searchParams.get('title')),
        cleanThumbnailText(url.searchParams.get('artist')),
        Date.now()
      ]
    );
    return json({ status: 'stored', etag }, 201);
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};

#!/usr/bin/env node
// Backfill stored Explorer thumbnails for every song in the radio catalogue.
//
// For each song with a cover this fetches the cover from /radio/artwork, resizes
// it to a small WebP, uploads it to the THUMBNAILS R2 bucket and records it in
// the inscription_thumbnails table, so the Explorer grid can show it without
// downloading the song. Songs with no cover are recorded as "none" together with
// their title and artist, so their tile can show text instead of a blank poster.
//
// Safe to re-run: finished songs are skipped, failed ones are retried, and a
// failure never overwrites a thumbnail that is already stored.
//
// Before the first run (once):
//   1. npx wrangler r2 bucket create xtrata-thumbnails
//   2. npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/021_inscription_thumbnails.sql
//   3. npx wrangler whoami           (must be logged in to the Cloudflare account)
//   4. npm i --no-save sharp         (only if `node -e "require('sharp')"` fails)
//
// Usage (from the repo root):
//   node scripts/backfill-thumbnails.mjs --dry-run --limit 5     # look, change nothing
//   node scripts/backfill-thumbnails.mjs --limit 20              # first real batch
//   node scripts/backfill-thumbnails.mjs                         # everything outstanding
//   node scripts/backfill-thumbnails.mjs --token 3058 --force    # redo one song
//
// Options: --dry-run  --limit N  --token ID  --force  --concurrency N (default 3)
//          --origin URL (default https://xtrata.xyz)
//          --db NAME (default xtrata-manage)  --bucket NAME (default xtrata-thumbnails)

import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

// The radio catalogue lives on this contract (functions/lib/radio-report.ts).
export const RADIO_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const THUMBNAIL_SIZE = 256;
export const MAX_TEXT = 120;
const MAX_COVER_BYTES = 8 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const CONTRACT_PATTERN = /^S[A-Z0-9]{30,50}\.[A-Za-z][A-Za-z0-9_-]{0,127}$/;

// --- Rules shared with functions/lib/thumbnails.ts (a test keeps them in step) ---

export const thumbKey = (contractId, tokenId) => `thumbs/${contractId}/${tokenId}.webp`;

export const cleanText = (value) => {
  if (typeof value !== 'string') return '';
  const cleaned = value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(cleaned).slice(0, MAX_TEXT).join('');
};

// --- SQL building. Wrangler cannot bind parameters, so every value is validated
// or escaped here. Titles and artists come from untrusted on-chain files. ---

export const sqlString = (value) => `'${String(value).replaceAll('\u0000', '').replaceAll("'", "''")}'`;
const sqlInt = (value) => (Number.isSafeInteger(value) ? String(value) : 'NULL');

export const buildUpsertSql = ({
  contractId,
  tokenId,
  status,
  key = null,
  etag = null,
  width = null,
  height = null,
  bytes = null,
  title = '',
  artist = '',
  source = 'cover',
  animated = null,
  now = Date.now()
}) => {
  if (!CONTRACT_PATTERN.test(contractId)) throw new Error(`Invalid contract id: ${contractId}`);
  if (!Number.isSafeInteger(tokenId) || tokenId < 0) throw new Error(`Invalid token id: ${tokenId}`);
  if (!['ready', 'none', 'failed'].includes(status)) throw new Error(`Invalid status: ${status}`);
  if (!['cover', 'render'].includes(source)) throw new Error(`Invalid source: ${source}`);
  if (![null, 0, 1].includes(animated)) throw new Error(`Invalid animated flag: ${animated}`);
  if (status === 'ready' && (!key || !/^[0-9a-f]{16}$/.test(etag ?? ''))) {
    throw new Error('A ready thumbnail needs a key and an etag');
  }
  const values = [
    sqlString(contractId),
    sqlInt(tokenId),
    sqlString(status),
    key ? sqlString(key) : 'NULL',
    etag ? sqlString(etag) : 'NULL',
    sqlInt(width),
    sqlInt(height),
    sqlInt(bytes),
    sqlString(cleanText(title)),
    sqlString(cleanText(artist)),
    sqlString(source),
    animated === null ? 'NULL' : String(animated),
    sqlInt(now)
  ].join(', ');
  // A failure must never replace a thumbnail that is already stored.
  const guard = status === 'failed' ? " WHERE inscription_thumbnails.status <> 'ready'" : '';
  return (
    'INSERT INTO inscription_thumbnails ' +
    '(contract_id, token_id, status, thumb_key, etag, width, height, bytes, title, artist, source, animated, updated_at) ' +
    `VALUES (${values}) ` +
    'ON CONFLICT(contract_id, token_id) DO UPDATE SET ' +
    'status = excluded.status, thumb_key = excluded.thumb_key, etag = excluded.etag, ' +
    'width = excluded.width, height = excluded.height, bytes = excluded.bytes, ' +
    'title = excluded.title, artist = excluded.artist, source = excluded.source, ' +
    // A song cover re-run must not wipe what the picture check learned.
    'animated = COALESCE(excluded.animated, inscription_thumbnails.animated), ' +
    `updated_at = excluded.updated_at${guard};`
  );
};

// --- Cover fetching and resizing ---

/**
 * Fetches a song's cover through the site's own /radio/artwork route, which
 * serves embedded covers directly and redirects to https artwork. Returns
 * { kind: 'none' } when the song has no cover.
 */
export const fetchCover = async (origin, tokenId, fetchImpl = fetch) => {
  let url = `${origin}/radio/artwork?id=${tokenId}`;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const response = await fetchImpl(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000)
    });
    if (response.status === 404) return { kind: 'none' };
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = new URL(response.headers.get('location') ?? '', url);
      if (next.protocol !== 'https:' || next.username || next.password) {
        throw new Error(`Refusing redirect to ${next.protocol}//${next.host}`);
      }
      url = next.href;
      continue;
    }
    if (!response.ok) throw new Error(`Cover request failed: HTTP ${response.status}`);
    const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
    if (!contentType.startsWith('image/') || contentType.startsWith('image/svg')) {
      throw new Error(`Unexpected cover type: ${contentType || 'none'}`);
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_COVER_BYTES) {
      throw new Error(`Cover size out of range: ${bytes.length} bytes`);
    }
    return { kind: 'image', bytes, contentType };
  }
  throw new Error('Too many redirects');
};

/**
 * Cover image bytes in, small WebP out. Re-encoding drops metadata and anything
 * unexpected inside the original file.
 */
export const makeThumbnail = async (input, sharp) => {
  const result = await sharp(input, { limitInputPixels: 40_000_000, failOn: 'error' })
    .rotate()
    .resize({
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: true
    })
    .webp({ quality: 78, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return {
    bytes: result.data,
    width: result.info.width,
    height: result.info.height,
    etag: createHash('sha256').update(result.data).digest('hex').slice(0, 16)
  };
};

// --- Wrangler ---

export const parseWranglerJson = (text) => {
  const start = text.search(/^\s*\[/m);
  if (start < 0) throw new Error('Wrangler returned no JSON');
  return JSON.parse(text.slice(start));
};

const wrangler = async (args) => {
  const { stdout } = await run('npx', ['wrangler', ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
  return stdout;
};

const d1Rows = async (db, sql) => {
  const out = parseWranglerJson(await wrangler(['d1', 'execute', db, '--remote', '--json', '--command', sql]));
  return out?.[0]?.results ?? [];
};

// --- CLI ---

export const parseArgs = (argv) => {
  const options = {
    dryRun: false,
    force: false,
    limit: Infinity,
    token: null,
    concurrency: 3,
    origin: 'https://xtrata.xyz',
    db: 'xtrata-manage',
    bucket: 'xtrata-thumbnails'
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--limit') options.limit = Number(next());
    else if (arg === '--token') options.token = Number(next());
    else if (arg === '--concurrency') options.concurrency = Number(next());
    else if (arg === '--origin') options.origin = next().replace(/\/+$/, '');
    else if (arg === '--db') options.db = next();
    else if (arg === '--bucket') options.bucket = next();
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.limit !== Infinity && !(Number.isInteger(options.limit) && options.limit > 0)) {
    throw new Error('--limit must be a positive whole number');
  }
  if (options.token !== null && !(Number.isInteger(options.token) && options.token > 0)) {
    throw new Error('--token must be a positive whole number');
  }
  if (!(Number.isInteger(options.concurrency) && options.concurrency >= 1 && options.concurrency <= 8)) {
    throw new Error('--concurrency must be between 1 and 8');
  }
  if (!/^https:\/\//.test(options.origin)) throw new Error('--origin must start with https://');
  return options;
};

const loadSharp = async () => {
  try {
    const mod = await import('sharp');
    return mod.default ?? mod;
  } catch {
    throw new Error('The sharp image library is not installed. Run: npm i --no-save sharp');
  }
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const sharp = await loadSharp();
  const tmp = mkdtempSync(join(tmpdir(), 'xtrata-thumbs-'));

  try {
    console.log(`Reading the song list from ${options.db}...`);
    const songs = await d1Rows(
      options.db,
      "SELECT token_id, title, artist FROM radio_metadata WHERE is_song = 1 AND status = 'ready' AND cover_checked = 1 ORDER BY token_id"
    );
    const done = new Map(
      (
        await d1Rows(
          options.db,
          `SELECT token_id, status FROM inscription_thumbnails WHERE contract_id = ${sqlString(RADIO_CONTRACT)}`
        )
      ).map((row) => [Number(row.token_id), row.status])
    );

    let todo = songs.filter((song) => {
      const id = Number(song.token_id);
      if (options.token !== null) return id === options.token;
      if (options.force) return true;
      const status = done.get(id);
      return status !== 'ready' && status !== 'none';
    });
    if (options.limit !== Infinity) todo = todo.slice(0, options.limit);
    console.log(
      `${songs.length} songs, ${songs.length - todo.length} already done or skipped, ${todo.length} to do` +
        (options.dryRun ? ' (dry run: nothing will be uploaded or saved)' : '')
    );

    const statements = [];
    const totals = { ready: 0, none: 0, failed: 0, bytes: 0 };
    const flush = async () => {
      if (options.dryRun || statements.length === 0) return;
      const file = join(tmp, `rows-${Date.now()}.sql`);
      writeFileSync(file, `${statements.join('\n')}\n`);
      statements.length = 0;
      await wrangler(['d1', 'execute', options.db, '--remote', '--file', file]);
    };

    const handle = async (song) => {
      const tokenId = Number(song.token_id);
      const text = { title: song.title ?? '', artist: song.artist ?? '' };
      try {
        const cover = await fetchCover(options.origin, tokenId);
        if (cover.kind === 'none') {
          statements.push(buildUpsertSql({ contractId: RADIO_CONTRACT, tokenId, status: 'none', ...text }));
          totals.none += 1;
          console.log(`  #${tokenId}: no cover`);
          return;
        }
        const thumb = await makeThumbnail(cover.bytes, sharp);
        const key = thumbKey(RADIO_CONTRACT, tokenId);
        if (!options.dryRun) {
          const file = join(tmp, `${tokenId}.webp`);
          writeFileSync(file, thumb.bytes);
          await wrangler([
            'r2', 'object', 'put', `${options.bucket}/${key}`,
            '--file', file, '--content-type', 'image/webp', '--remote'
          ]);
          // The row is written only after the upload succeeded, so an index row
          // never points at a missing picture.
          statements.push(
            buildUpsertSql({
              contractId: RADIO_CONTRACT,
              tokenId,
              status: 'ready',
              key,
              etag: thumb.etag,
              width: thumb.width,
              height: thumb.height,
              bytes: thumb.bytes.length,
              ...text
            })
          );
        }
        totals.ready += 1;
        totals.bytes += thumb.bytes.length;
        console.log(`  #${tokenId}: ${thumb.width}x${thumb.height}, ${(thumb.bytes.length / 1024).toFixed(1)} KB`);
      } catch (error) {
        totals.failed += 1;
        console.warn(`  #${tokenId}: FAILED (${error instanceof Error ? error.message : error})`);
        statements.push(buildUpsertSql({ contractId: RADIO_CONTRACT, tokenId, status: 'failed', ...text }));
      }
      if (statements.length >= 25) await flush();
    };

    const queue = [...todo];
    const workers = Array.from({ length: Math.min(options.concurrency, queue.length || 1) }, async () => {
      while (queue.length > 0) await handle(queue.shift());
    });
    await Promise.all(workers);
    await flush();

    console.log(
      `Done. ${totals.ready} thumbnails${options.dryRun ? ' (would be)' : ''}, ` +
        `${totals.none} without a cover, ${totals.failed} failed` +
        (totals.ready ? `, average ${(totals.bytes / totals.ready / 1024).toFixed(1)} KB` : '')
    );
    if (totals.failed > 0) process.exitCode = 1;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

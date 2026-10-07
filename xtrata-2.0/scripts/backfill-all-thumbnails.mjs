#!/usr/bin/env node
/**
 * Coverage report and backfill for stored grid thumbnails across EVERY contract in
 * the inscription index (v1, v2, v3, ...), not just the radio catalogue.
 *
 *   node scripts/backfill-all-thumbnails.mjs --plan              (read only: coverage table)
 *   node scripts/backfill-all-thumbnails.mjs --dry-run --limit 5 (fetch and resize, store nothing)
 *   node scripts/backfill-all-thumbnails.mjs                     (images and SVGs, whole chain)
 *
 * Images and SVGs are made here with sharp. Audio, video and HTML need other
 * sources (a song cover, a frame, a declared or rendered picture) and are only
 * counted in the coverage report; see docs/explorer-thumbnails.md.
 *
 * Safe to re-run: rows already 'ready' or 'none' are skipped, 'failed' rows are
 * retried, and a failure never overwrites a stored thumbnail.
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { buildUpsertSql, parseWranglerJson, sqlString, THUMBNAIL_SIZE, thumbKey } from './backfill-thumbnails.mjs';

const run = promisify(execFile);

export const DEFAULT_MAX_BYTES = 30 * 1024 * 1024;
export const ALL_KINDS = ['image', 'svg', 'html', 'audio', 'video', 'text', 'other'];
export const MAKEABLE_KINDS = ['image', 'svg'];

/** Group an inscription's mime type into the kind that decides how its thumbnail is made. */
export const classifyKind = (mime) => {
  const value = String(mime ?? '').split(';')[0].trim().toLowerCase();
  if (value.startsWith('image/svg')) return 'svg';
  if (value.startsWith('image/')) return 'image';
  if (value === 'text/html' || value === 'application/xhtml+xml') return 'html';
  if (value.startsWith('audio/')) return 'audio';
  if (value.startsWith('video/')) return 'video';
  if (
    value.startsWith('text/') ||
    value === 'application/json' ||
    value === 'application/javascript' ||
    value.endsWith('+json')
  ) {
    return 'text';
  }
  return 'other';
};

/**
 * An SVG is code. librsvg can read local files and fetch addresses named inside
 * it, so only a file with no outside references and no script is ever rasterised.
 */
export const isSafeSvg = (text) => {
  const source = String(text);
  if (/<\s*(script|foreignObject|iframe|embed|object)\b/i.test(source)) return false;
  if (/<!ENTITY/i.test(source)) return false;
  if (/\son[a-z]+\s*=/i.test(source)) return false;
  for (const match of source.matchAll(/(?:xlink:)?href\s*=\s*["']([^"']*)["']/gi)) {
    const value = match[1].trim();
    if (!(value.startsWith('#') || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value))) return false;
  }
  for (const match of source.matchAll(/url\(\s*["']?([^"')]*)/gi)) {
    if (!match[1].trim().startsWith('#')) return false;
  }
  if (/@import/i.test(source)) return false;
  return true;
};

/**
 * Picture in, small WebP out. Fits inside 256x256 without cropping or stretching.
 * Anything that already fits is kept at its own size and encoded losslessly with
 * nearest-neighbour scaling, so pixel art stays pixel art. Re-encoding also drops
 * metadata and anything unexpected inside the original file.
 */
export const makeImageThumbnail = async (input, sharp, { svg = false } = {}) => {
  const options = { limitInputPixels: 80_000_000, failOn: 'error', pages: 1 };
  if (svg) options.density = 144;
  const meta = await sharp(input, options).metadata();
  const small = (meta.width ?? 0) <= THUMBNAIL_SIZE && (meta.height ?? 0) <= THUMBNAIL_SIZE && !svg;
  const result = await sharp(input, options)
    .rotate()
    .resize({
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: small ? 'nearest' : 'lanczos3'
    })
    .webp(small ? { lossless: true, effort: 4 } : { quality: 80, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return {
    bytes: result.data,
    width: result.info.width,
    height: result.info.height,
    etag: createHash('sha256').update(result.data).digest('hex').slice(0, 16)
  };
};

export const contentUrl = (origin, contract, tokenId) =>
  `${origin}/runtime/content?contractId=${encodeURIComponent(contract)}&tokenId=${tokenId}&network=mainnet`;

export const fetchContent = async (origin, contract, tokenId, maxBytes, fetchImpl = fetch) => {
  const response = await fetchImpl(contentUrl(origin, contract, tokenId), {
    redirect: 'error',
    signal: AbortSignal.timeout(60_000)
  });
  if (!response.ok) throw new Error(`Content request failed: HTTP ${response.status}`);
  const declared = Number(response.headers.get('content-length') ?? 0);
  if (declared > maxBytes) throw new Error(`Too large: ${declared} bytes`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length === 0) throw new Error('Empty content');
  if (bytes.length > maxBytes) throw new Error(`Too large: ${bytes.length} bytes`);
  return bytes;
};

export const COVERAGE_SQL =
  'SELECT i.contract AS contract, i.mime AS mime, COUNT(*) AS total, ' +
  "SUM(CASE WHEN t.status = 'ready' THEN 1 ELSE 0 END) AS ready, " +
  "SUM(CASE WHEN t.status = 'none' THEN 1 ELSE 0 END) AS none, " +
  "SUM(CASE WHEN t.status = 'failed' THEN 1 ELSE 0 END) AS failed " +
  'FROM inscription_index i LEFT JOIN inscription_thumbnails t ' +
  'ON t.contract_id = i.contract AND t.token_id = i.token_id ' +
  'GROUP BY i.contract, i.mime';

/** Roll the per-mime rows up into one line per contract and kind. */
export const summariseCoverage = (rows) => {
  const table = new Map();
  for (const row of rows) {
    const key = `${row.contract}|${classifyKind(row.mime)}`;
    const entry = table.get(key) ?? {
      contract: row.contract,
      kind: classifyKind(row.mime),
      total: 0,
      ready: 0,
      none: 0,
      failed: 0
    };
    entry.total += Number(row.total) || 0;
    entry.ready += Number(row.ready) || 0;
    entry.none += Number(row.none) || 0;
    entry.failed += Number(row.failed) || 0;
    table.set(key, entry);
  }
  return [...table.values()]
    .map((entry) => ({ ...entry, missing: entry.total - entry.ready - entry.none }))
    .sort((a, b) => a.contract.localeCompare(b.contract) || ALL_KINDS.indexOf(a.kind) - ALL_KINDS.indexOf(b.kind));
};

export const formatCoverage = (summary) => {
  const shortName = (contract) => contract.split('.').pop();
  const lines = ['contract                     kind    total  ready   none  failed  missing'];
  const sums = { total: 0, ready: 0, none: 0, failed: 0, missing: 0 };
  for (const e of summary) {
    lines.push(
      `${shortName(e.contract).padEnd(28)} ${e.kind.padEnd(7)} ${String(e.total).padStart(5)} ` +
        `${String(e.ready).padStart(6)} ${String(e.none).padStart(6)} ${String(e.failed).padStart(7)} ${String(e.missing).padStart(8)}`
    );
    for (const k of Object.keys(sums)) sums[k] += e[k];
  }
  lines.push(
    `${'ALL'.padEnd(28)} ${''.padEnd(7)} ${String(sums.total).padStart(5)} ` +
      `${String(sums.ready).padStart(6)} ${String(sums.none).padStart(6)} ${String(sums.failed).padStart(7)} ${String(sums.missing).padStart(8)}`
  );
  return lines.join('\n');
};

const CONTRACT_FILTER = /^S[A-Z0-9]{30,50}\.[A-Za-z][A-Za-z0-9_-]{0,127}$/;

export const buildMissingSql = ({ contract = null, token = null, force = false } = {}) => {
  const where = [];
  if (!force) where.push("(t.status IS NULL OR t.status = 'failed')");
  where.push("(i.mime LIKE 'image/%')");
  if (contract) {
    if (!CONTRACT_FILTER.test(contract)) throw new Error(`Invalid contract id: ${contract}`);
    where.push(`i.contract = ${sqlString(contract)}`);
  }
  if (token !== null) {
    if (!Number.isSafeInteger(token) || token < 0) throw new Error(`Invalid token id: ${token}`);
    where.push(`i.token_id = ${token}`);
  }
  return (
    'SELECT i.contract AS contract, i.token_id AS token_id, i.mime AS mime, i.total_size AS total_size ' +
    'FROM inscription_index i LEFT JOIN inscription_thumbnails t ' +
    'ON t.contract_id = i.contract AND t.token_id = i.token_id ' +
    `WHERE ${where.join(' AND ')} ORDER BY i.contract, i.token_id`
  );
};

export const parseArgs = (argv) => {
  const options = {
    plan: false,
    dryRun: false,
    force: false,
    limit: Infinity,
    token: null,
    contract: null,
    kinds: [...MAKEABLE_KINDS],
    maxBytes: DEFAULT_MAX_BYTES,
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
    if (arg === '--plan') options.plan = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--limit') options.limit = Number(next());
    else if (arg === '--token') options.token = Number(next());
    else if (arg === '--contract') options.contract = next();
    else if (arg === '--kinds') options.kinds = next().split(',').map((k) => k.trim()).filter(Boolean);
    else if (arg === '--max-bytes') options.maxBytes = Number(next());
    else if (arg === '--concurrency') options.concurrency = Number(next());
    else if (arg === '--origin') options.origin = next().replace(/\/+$/, '');
    else if (arg === '--db') options.db = next();
    else if (arg === '--bucket') options.bucket = next();
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.limit !== Infinity && !(Number.isInteger(options.limit) && options.limit > 0)) {
    throw new Error('--limit must be a positive whole number');
  }
  if (options.token !== null && !(Number.isInteger(options.token) && options.token >= 0)) {
    throw new Error('--token must be a whole number, 0 or more');
  }
  if (!(Number.isInteger(options.concurrency) && options.concurrency >= 1 && options.concurrency <= 8)) {
    throw new Error('--concurrency must be between 1 and 8');
  }
  if (!(Number.isInteger(options.maxBytes) && options.maxBytes >= 1024)) {
    throw new Error('--max-bytes must be a whole number of bytes, at least 1024');
  }
  const unsupported = options.kinds.filter((k) => !MAKEABLE_KINDS.includes(k));
  if (unsupported.length > 0 || options.kinds.length === 0) {
    throw new Error(`--kinds supports: ${MAKEABLE_KINDS.join(', ')} (got ${options.kinds.join(',') || 'nothing'})`);
  }
  if (options.contract && !CONTRACT_FILTER.test(options.contract)) throw new Error('--contract is not a valid contract id');
  if (!/^https:\/\//.test(options.origin)) throw new Error('--origin must start with https://');
  return options;
};

const wrangler = async (args) => {
  const { stdout } = await run('npx', ['wrangler', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return stdout;
};

const d1Rows = async (db, sql) => {
  const out = parseWranglerJson(await wrangler(['d1', 'execute', db, '--remote', '--json', '--command', sql]));
  return out?.[0]?.results ?? [];
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

  console.log(`Reading coverage from ${options.db}...`);
  const summary = summariseCoverage(await d1Rows(options.db, COVERAGE_SQL));
  console.log(formatCoverage(summary));
  if (options.plan) {
    const open = summary.filter((e) => e.missing > 0 && !MAKEABLE_KINDS.includes(e.kind));
    if (open.length > 0) {
      console.log(
        `\nNot made by this script (need a cover, a frame or a render): ` +
          [...new Set(open.map((e) => e.kind))].join(', ')
      );
    }
    return;
  }

  const sharp = await loadSharp();
  const tmp = mkdtempSync(join(tmpdir(), 'xtrata-thumbs-all-'));
  try {
    let todo = (await d1Rows(options.db, buildMissingSql(options))).filter((row) =>
      options.kinds.includes(classifyKind(row.mime))
    );
    if (options.limit !== Infinity) todo = todo.slice(0, options.limit);
    console.log(`\n${todo.length} to do` + (options.dryRun ? ' (dry run: nothing will be uploaded or saved)' : ''));

    const statements = [];
    const totals = { ready: 0, skipped: 0, failed: 0, bytes: 0 };
    const flush = async () => {
      if (options.dryRun || statements.length === 0) return;
      const file = join(tmp, `rows-${Date.now()}.sql`);
      writeFileSync(file, `${statements.join('\n')}\n`);
      statements.length = 0;
      await wrangler(['d1', 'execute', options.db, '--remote', '--file', file]);
    };

    const handle = async (row) => {
      const contract = row.contract;
      const tokenId = Number(row.token_id);
      const label = `${contract.split('.').pop()} #${tokenId}`;
      try {
        if (Number(row.total_size) > options.maxBytes) {
          totals.skipped += 1;
          console.log(`  ${label}: skipped, ${row.total_size} bytes is over --max-bytes`);
          return;
        }
        const svg = classifyKind(row.mime) === 'svg';
        const bytes = await fetchContent(options.origin, contract, tokenId, options.maxBytes);
        if (svg && !isSafeSvg(new TextDecoder().decode(bytes))) {
          statements.push(buildUpsertSql({ contractId: contract, tokenId, status: 'none', source: 'render' }));
          totals.skipped += 1;
          console.log(`  ${label}: SVG has scripts or outside references, no thumbnail`);
          return;
        }
        const thumb = await makeImageThumbnail(bytes, sharp, { svg });
        const key = thumbKey(contract, tokenId);
        if (!options.dryRun) {
          const file = join(tmp, `${contract.replace(/[^A-Za-z0-9_.-]/g, '_')}-${tokenId}.webp`);
          writeFileSync(file, thumb.bytes);
          await wrangler([
            'r2', 'object', 'put', `${options.bucket}/${key}`,
            '--file', file, '--content-type', 'image/webp', '--remote'
          ]);
          statements.push(
            buildUpsertSql({
              contractId: contract,
              tokenId,
              status: 'ready',
              key,
              etag: thumb.etag,
              width: thumb.width,
              height: thumb.height,
              bytes: thumb.bytes.length,
              source: 'render'
            })
          );
        }
        totals.ready += 1;
        totals.bytes += thumb.bytes.length;
        console.log(`  ${label}: ${thumb.width}x${thumb.height}, ${(thumb.bytes.length / 1024).toFixed(1)} KB`);
      } catch (error) {
        totals.failed += 1;
        console.warn(`  ${label}: FAILED (${error instanceof Error ? error.message : error})`);
        try {
          statements.push(buildUpsertSql({ contractId: contract, tokenId, status: 'failed', source: 'render' }));
        } catch (sqlError) {
          // A row that cannot even be recorded must not stop the rest of the run.
          console.warn(`  ${label}: could not record the failure (${sqlError instanceof Error ? sqlError.message : sqlError})`);
        }
      }
      if (statements.length >= 25) await flush();
    };

    const queue = [...todo];
    try {
      await Promise.all(
        Array.from({ length: Math.min(options.concurrency, queue.length || 1) }, async () => {
          while (queue.length > 0) await handle(queue.shift());
        })
      );
    } finally {
      // Uploaded pictures get their rows even when something unexpected stops the run.
      await flush();
    }

    console.log(
      `Done. ${totals.ready} thumbnails${options.dryRun ? ' (would be)' : ''}, ` +
        `${totals.skipped} skipped, ${totals.failed} failed` +
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

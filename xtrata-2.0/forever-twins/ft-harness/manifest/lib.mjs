// Forever Twins manifest core. Isomorphic: runs in Node >= 20 and in a browser
// (WebCrypto + fetch only, no imports), so the same code builds a manifest from
// the command line or from a page. No keys, no signing, no network writes.
//
// Content hash = Xtrata rolling hash, exactly as xtrata-v3-2-3 mint-single-tx
// computes it: chunks of 16,384 bytes; h0 = 32 zero bytes; h = sha256(h || chunk).
// This is NOT a plain sha256 of the file; both are recorded.

export const CHUNK_SIZE = 16384;
export const MAX_SINGLE_TX_CHUNKS = 32;
export const MAX_BYTES = CHUNK_SIZE * MAX_SINGLE_TX_CHUNKS; // 524,288 = 512 KB
export const SEED_BATCH = 100;
export const SPEC = 'FT-SPEC-2';

const subtle = globalThis.crypto.subtle;
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

export async function sha256Hex(bytes) {
  return hex(await subtle.digest('SHA-256', bytes));
}

export function chunk(bytes) {
  const out = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) out.push(bytes.subarray(i, i + CHUNK_SIZE));
  return out;
}

export async function xtrataHashHex(bytes) {
  let h = new Uint8Array(32);
  for (const c of chunk(bytes)) {
    const buf = new Uint8Array(32 + c.length);
    buf.set(h, 0); buf.set(c, 32);
    h = new Uint8Array(await subtle.digest('SHA-256', buf));
  }
  return hex(h);
}

// Mime from magic bytes first; the server's content-type only as a fallback.
export function sniffMime(bytes, headerType = '') {
  const b = bytes, s = (n) => String.fromCharCode(...b.subarray(0, n));
  if (b[0] === 0x89 && s(4).slice(1) === 'PNG') return 'image/png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (s(6) === 'GIF87a' || s(6) === 'GIF89a') return 'image/gif';
  if (s(4) === 'RIFF' && String.fromCharCode(...b.subarray(8, 12)) === 'WEBP') return 'image/webp';
  const head = new TextDecoder().decode(b.subarray(0, 512)).trimStart().toLowerCase();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'image/svg+xml';
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) return 'text/html';
  const t = (headerType || '').split(';')[0].trim().toLowerCase();
  return t || 'application/octet-stream';
}

// ipfs://ipfs/CID/x, ipfs://CID/x, /ipfs/CID/x -> gateway URL. Other URLs unchanged.
export function toHttp(uri, gateway = 'https://gateway.pinata.cloud') {
  let u = String(uri).trim();
  if (u.startsWith('ipfs://')) u = u.slice(7).replace(/^ipfs\//, '');
  else if (u.startsWith('/ipfs/')) u = u.slice(6);
  else return u;
  return `${gateway.replace(/\/$/, '')}/ipfs/${u}`;
}

export const fill = (tpl, id) => String(tpl).split('{id}').join(String(id));

export function isAscii(s, max) {
  return typeof s === 'string' && s.length > 0 && s.length <= max && /^[\x20-\x7e]*$/.test(s);
}

// Pick the media URI from SIP-016 style metadata. `field` may be a dotted path.
export function pickMedia(meta, field = 'image') {
  const v = field.split('.').reduce((o, k) => (o == null ? o : o[k]), meta);
  if (typeof v !== 'string' || !v) throw new Error(`metadata has no "${field}"`);
  return v;
}

// fetcher(url) -> { bytes: Uint8Array, contentType: string, status: number }
export async function buildToken(cfg, id, fetcher) {
  const metadataUri = cfg.metadataUri ? fill(cfg.metadataUri, id) : null;
  let mediaUri, metaBytes = null;
  if (metadataUri) {
    const m = await fetcher(toHttp(metadataUri, cfg.gateway));
    if (m.status !== 200) throw new Error(`metadata HTTP ${m.status} at ${metadataUri}`);
    metaBytes = m.bytes;
    mediaUri = pickMedia(JSON.parse(new TextDecoder().decode(m.bytes)), cfg.mediaField || 'image');
  } else {
    mediaUri = fill(cfg.mediaUri, id);
  }
  const r = await fetcher(toHttp(mediaUri, cfg.gateway));
  if (r.status !== 200) throw new Error(`media HTTP ${r.status} at ${mediaUri}`);
  const bytes = r.bytes;
  const tokenUri = fill(cfg.twinTokenUri, id);
  if (!isAscii(tokenUri, 256)) throw new Error(`twin token-uri is not 1-256 printable ascii: ${tokenUri}`);
  const mime = sniffMime(bytes, r.contentType);
  const entry = {
    id,
    original: {
      metadataUri, metadataSha256: metaBytes ? await sha256Hex(metaBytes) : null,
      mediaUris: [mediaUri], mediaSha256: [await sha256Hex(bytes)],
    },
    twin: {
      contentHash: '0x' + (await xtrataHashHex(bytes)), sha256: await sha256Hex(bytes),
      mime, totalSize: bytes.length, tokenUri,
    },
  };
  if (bytes.length > MAX_BYTES) entry.oversize = true;
  if (!isAscii(mime, 64)) entry.badMime = true;
  return entry;
}

// Runs every id; never throws for one token. Returns { tokens, failures, oversize }.
export async function buildAll(cfg, ids, fetcher, { concurrency = 4, onProgress } = {}) {
  const tokens = [], failures = [];
  let next = 0, done = 0;
  async function worker() {
    while (next < ids.length) {
      const id = ids[next++];
      for (let attempt = 1; ; attempt++) {
        try { tokens.push(await buildToken(cfg, id, fetcher)); break; }
        catch (e) {
          if (attempt >= (cfg.retries ?? 3)) { failures.push({ id, error: String(e.message || e) }); break; }
          await new Promise((r) => setTimeout(r, 1500 * attempt));
        }
      }
      done++; if (onProgress) onProgress(done, ids.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker));
  tokens.sort((a, b) => a.id - b.id);
  failures.sort((a, b) => a.id - b.id);
  return { tokens, failures, oversize: tokens.filter((t) => t.oversize).map((t) => ({ id: t.id, bytes: t.twin.totalSize })) };
}

// Deterministic manifest document (key order fixed). The published file's bytes are
// what finalize-canonical commits to, so write this text exactly and hash that.
export function manifestDoc(cfg, tokens, snapshot) {
  return {
    spec: SPEC,
    collectionKey: cfg.collectionKey,
    source: cfg.source,
    sourceAsset: cfg.sourceAsset,
    scope: cfg.scope || 'minted-at-snapshot',
    snapshot: snapshot || null,
    reviewer: cfg.reviewer || null,
    hashRule: 'twin.contentHash = xtrata rolling hash: 16384-byte chunks, h0 = 32 zero bytes, h = sha256(h || chunk)',
    twinTokenUri: cfg.twinTokenUri,
    count: tokens.length,
    tokens: tokens.map((t) => ({ id: t.id, original: t.original, twin: t.twin, ...(t.notes ? { notes: t.notes } : {}) })),
    dependencies: [],
  };
}
export const manifestText = (doc) => JSON.stringify(doc, null, 2) + '\n';

// ids helper: { from, to } | { list: [...] }
export function idsFrom(spec) {
  if (Array.isArray(spec?.list)) return [...spec.list];
  const out = [];
  for (let i = spec.from; i <= spec.to; i++) out.push(i);
  return out;
}

// Record entries exactly as seed-canonical takes them (plain values; callers make CVs).
export function seedEntries(manifest) {
  return manifest.tokens.map((t) => ({
    id: t.id, contentHash: t.twin.contentHash, mime: t.twin.mime, totalSize: t.twin.totalSize, tokenUri: t.twin.tokenUri,
  }));
}
export function batches(list, n = SEED_BATCH) {
  const out = [];
  for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
  return out;
}

// Compare an on-chain get-canonical value (plain object or null) with a manifest token.
export function compareEntry(t, onchain) {
  if (!onchain) return ['missing on-chain'];
  const d = [];
  const norm = (h) => String(h).toLowerCase().replace(/^0x/, '');
  if (norm(onchain.contentHash) !== norm(t.twin.contentHash)) d.push(`content-hash ${onchain.contentHash} != ${t.twin.contentHash}`);
  if (onchain.mime !== t.twin.mime) d.push(`mime ${onchain.mime} != ${t.twin.mime}`);
  if (Number(onchain.totalSize) !== t.twin.totalSize) d.push(`total-size ${onchain.totalSize} != ${t.twin.totalSize}`);
  if (onchain.tokenUri !== t.twin.tokenUri) d.push(`token-uri ${onchain.tokenUri} != ${t.twin.tokenUri}`);
  return d;
}

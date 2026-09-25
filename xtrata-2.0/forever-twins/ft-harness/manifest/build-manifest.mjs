#!/usr/bin/env node
// Build a Forever Twins manifest for one collection.
//
//   node manifest/build-manifest.mjs manifest/configs/<key>.json [--out manifest/out]
//        [--ids 1-50 | --ids 3,7,9] [--concurrency 4] [--snapshot-api https://api.hiro.so]
//        [--api https://api.hiro.so]   (used when the config's metadataUri is "chain")
//
// For every token id: fetch the original metadata (if the config has metadataUri),
// then the media; record sha256, the Xtrata rolling hash, mime (from magic bytes),
// size and the fixed twin token-uri. Writes:
//   <out>/<key>.manifest.json        the manifest (hash these exact bytes)
//   <out>/<key>.manifest.sha256      "<sha256>  <key>.manifest.json"
//   <out>/<key>.report.json          counts, failures, oversize tokens, largest file
// REFUSES (exit 2, no manifest written) if any token is over 512 KB or any fetch
// failed: finalising is one-way, so a partial record can never be completed (D2).
// Read-only: GET requests only. No keys, no signing, nothing broadcast.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAll, manifestDoc, manifestText, idsFrom, MAX_BYTES } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const cfgPath = argv.find((a) => !a.startsWith('--') && a.endsWith('.json'));
if (!cfgPath) { console.error('usage: build-manifest.mjs <config.json> [--out dir] [--ids a-b|a,b,c]'); process.exit(1); }
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const out = resolve(opt('out', join(HERE, 'out')));
const idsArg = opt('ids');
const ids = idsArg
  ? (idsArg.includes('-') ? idsFrom({ from: +idsArg.split('-')[0], to: +idsArg.split('-')[1] }) : idsArg.split(',').map(Number))
  : idsFrom(cfg.ids);
const partial = Boolean(idsArg);

// metadataUri "chain": read each token's URI from the source's get-token-uri (read-only call-read).
if (cfg.metadataUri === 'chain') {
  const { Cl, cvToHex, hexToCV, cvToValue } = await import('@stacks/transactions');
  const API = (opt('api', process.env.FT_API || 'https://api.hiro.so')).replace(/\/$/, '');
  const [addr, name] = cfg.source.split('.');
  const KEY = process.env.HIRO_API_KEY;
  let gate = Promise.resolve();
  cfg.metadataUriFor = async (id) => {
    const turn = gate; let release; gate = new Promise((r) => (release = r)); await turn;
    try {
      for (let a = 0; a < 6; a++) {
        await new Promise((r) => setTimeout(r, KEY ? 150 : 1100));
        const res = await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/get-token-uri`, {
          method: 'POST', headers: { 'content-type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
          body: JSON.stringify({ sender: addr, arguments: [cvToHex(Cl.uint(id))] }) });
        if (res.status === 429 || res.status >= 500) continue;
        const j = await res.json();
        if (!j.okay) throw new Error(`get-token-uri(${id}): ${j.cause}`);
        const v = cvToValue(hexToCV(j.result), true);
        const uri = v?.value?.value ?? v?.value ?? v;
        if (typeof uri !== 'string') throw new Error(`get-token-uri(${id}) returned no string`);
        return uri.split('{id}').join(String(id));
      }
      throw new Error(`get-token-uri(${id}): gave up`);
    } finally { release(); }
  };
}

async function fetcher(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'forever-twins-manifest/1' } });
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { bytes, contentType: res.headers.get('content-type') || '', status: res.status };
}

async function snapshot(api) {
  if (!api) return null;
  const r = await fetch(`${api.replace(/\/$/, '')}/v2/info`);
  const j = await r.json();
  return { stacksTipHeight: j.stacks_tip_height, stacksTip: '0x' + j.stacks_tip, takenAt: new Date().toISOString() };
}

const t0 = Date.now();
const { tokens, failures, oversize } = await buildAll(cfg, ids, fetcher, {
  concurrency: Number(opt('concurrency', cfg.concurrency || 4)),
  onProgress: (d, n) => { if (d % 25 === 0 || d === n) process.stderr.write(`  ${d}/${n}\n`); },
});
const largest = tokens.reduce((m, t) => (t.twin.totalSize > (m?.bytes ?? -1) ? { id: t.id, bytes: t.twin.totalSize } : m), null);
const mimes = {};
for (const t of tokens) mimes[t.twin.mime] = (mimes[t.twin.mime] || 0) + 1;
const hosts = {};
for (const t of tokens) { try { const h = new URL(t.original.mediaUris[0].replace(/^ipfs:\/\//, 'https://ipfs/')).host; hosts[h] = (hosts[h] || 0) + 1; } catch { /* ignore */ } }
const dupes = {};
for (const t of tokens) (dupes[t.twin.contentHash] ||= []).push(t.id);
const report = {
  collectionKey: cfg.collectionKey, requested: ids.length, built: tokens.length, partial,
  failures, oversize, maxBytes: MAX_BYTES, largest, mimes, mediaHosts: hosts,
  identicalContent: Object.values(dupes).filter((v) => v.length > 1),
  seedingCalls: Math.ceil(tokens.length / 100), seconds: Math.round((Date.now() - t0) / 1000),
};
mkdirSync(out, { recursive: true });
writeFileSync(join(out, `${cfg.collectionKey}.report.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, failures: failures.length, oversize: oversize.length }, null, 2));

if (failures.length || oversize.length) {
  console.error(`REFUSED: ${failures.length} fetch failure(s), ${oversize.length} token(s) over ${MAX_BYTES} bytes. No manifest written. See ${cfg.collectionKey}.report.json`);
  process.exit(2);
}
const doc = manifestDoc(cfg, tokens, await snapshot(opt('snapshot-api')).catch(() => null));
if (partial) doc.scope = `declared-subset (${idsArg}) - NOT for finalisation`;
const text = manifestText(doc);
const name = `${cfg.collectionKey}.manifest${partial ? '.partial' : ''}.json`;
writeFileSync(join(out, name), text);
const sha = createHash('sha256').update(text).digest('hex');
writeFileSync(join(out, name.replace(/\.json$/, '.sha256')), `${sha}  ${basename(name)}\n`);
console.log(`wrote ${join(out, name)}\nsha256 ${sha}`);

#!/usr/bin/env node
// Forever Twins: public IPFS gateway availability check (read-only GET requests).
// Samples files from the published manifests and checks the bytes each gateway returns against the manifest sha256.
// Run from the repo root:
//   node "DeGrants/Forever Twins/evidence/2026-10-22/gateway-check.mjs"
// Options: --dry (print the sample, no network)   --timeout=40000   --gateways=ipfs.io,dweb.link
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const OUT = 'xtrata-2.0/forever-twins/ft-harness/manifest/out/';
const COLL = { 'nyc-degens': 'NYC Degens', 'megapont-ape-club': 'Megapont Ape Club', 'bitcoin-monkeys': 'Bitcoin Monkeys', 'bitcoin-birds': 'Bitcoin Birds' };
const ALL = {
  'ipfs.io': 'https://ipfs.io/ipfs/', 'dweb.link': 'https://dweb.link/ipfs/', 'w3s.link': 'https://w3s.link/ipfs/',
  'trustless-gateway.link': 'https://trustless-gateway.link/ipfs/', '4everland.io': 'https://4everland.io/ipfs/',
  'gateway.pinata.cloud': 'https://gateway.pinata.cloud/ipfs/', 'ipfs.filebase.io': 'https://ipfs.filebase.io/ipfs/',
  'stxnft.mypinata.cloud': 'https://stxnft.mypinata.cloud/ipfs/',
};
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || d;
const DRY = process.argv.includes('--dry');
const TIMEOUT = Number(arg('timeout', 40000));
const only = arg('gateways', '').split(',').filter(Boolean);
const GWS = Object.fromEntries(Object.entries(ALL).filter(([k]) => !only.length || only.includes(k)));

const sample = [];
for (const [key, name] of Object.entries(COLL)) {
  const m = JSON.parse(readFileSync(`${OUT}${key}.manifest.json`, 'utf8'));
  const toks = [...m.tokens].sort((a, b) => a.id - b.id), n = toks.length;
  const ids = new Set([0, n - 1, Math.floor(n / 5), Math.floor((2 * n) / 5), Math.floor((3 * n) / 5), Math.floor((4 * n) / 5)].map((i) => toks[i].id));
  if (key === 'bitcoin-monkeys') ids.add(378); // large-file route token
  for (const t of toks.filter((t) => ids.has(t.id))) {
    const o = t.original;
    for (const [kind, uri, sha] of [['art', o.mediaUris?.[0], o.mediaSha256?.[0]], ['meta', o.metadataUri, o.metadataSha256]]) {
      if (!uri || !sha) continue;
      const [cid, ...p] = uri.replace(/^ipfs:\/\/(ipfs\/)?/, '').split('/');
      sample.push({ coll: name, kind, id: t.id, cid, path: p.join('/'), sha });
    }
  }
}
console.log(`${sample.length} files in sample, ${Object.keys(GWS).length} gateways`);
if (DRY) { for (const s of sample) console.log(s.coll, s.kind, s.id, `${s.cid}/${s.path}`); process.exit(0); }

async function test(base, s) {
  const t0 = Date.now(), ac = new AbortController(), to = setTimeout(() => ac.abort(), TIMEOUT);
  const r = { ...s, t: new Date().toISOString() };
  try {
    const res = await fetch(`${base}${s.cid}/${s.path}`, { signal: ac.signal, cache: 'no-store' });
    r.status = res.status;
    if (res.ok) { const buf = Buffer.from(await res.arrayBuffer()); r.bytes = buf.length; r.result = createHash('sha256').update(buf).digest('hex') === s.sha ? 'match' : 'MISMATCH'; }
    else r.result = `http-${res.status}`;
  } catch (e) { r.result = e.name === 'AbortError' ? 'timeout' : `error(${e.cause?.code || e.message})`; }
  clearTimeout(to); r.ms = Date.now() - t0; return r;
}
const rows = [];
await Promise.all(Object.entries(GWS).map(async ([gw, base]) => {
  const q = [...sample];
  await Promise.all([0, 1, 2].map(async () => { while (q.length) { const s = q.shift(); rows.push({ gw, ...(await test(base, s)) }); } }));
}));
const agg = {};
for (const r of rows) { const k = `${r.coll} | ${r.kind} | ${r.cid}`; ((agg[k] ??= {})[r.gw] ??= { ok: 0, n: 0, other: {} }); const a = agg[k][r.gw]; a.n++; r.result === 'match' ? a.ok++ : (a.other[r.result] = (a.other[r.result] || 0) + 1); }
for (const [k, g] of Object.entries(agg)) { console.log(`\n${k}`); for (const [gw, a] of Object.entries(g)) console.log(`  ${gw.padEnd(24)} ${a.ok}/${a.n}${Object.keys(a.other).length ? '  ' + JSON.stringify(a.other) : ''}`); }
const file = `DeGrants/Forever Twins/evidence/2026-10-22/gateway-check-${new Date().toISOString().slice(0, 10)}-local.json`;
writeFileSync(file, JSON.stringify({ ran: new Date().toISOString(), rows }, null, 1)); console.log(`\nraw results: ${file}`);

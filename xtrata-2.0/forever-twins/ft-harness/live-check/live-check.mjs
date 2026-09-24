#!/usr/bin/env node
// Forever Twins read-only live check.
//
// READ-ONLY BY CONSTRUCTION: uses only GET requests and the node's
// /v2/contracts/call-read endpoint (read-only function evaluation). It holds no
// keys, signs nothing and cannot broadcast. Safe to run against mainnet.
//
//   node live-check/live-check.mjs [--targets live-check/targets.mainnet.json]
//        [--api https://api.hiro.so] [--delay-ms 1100] [--max-bindings 50 | --all]
//        [--only <helper-key>] [--skip-bindings] [--skip-census] [--out results/live-check-<ts>.json]
//
// HIRO_API_KEY (optional) is sent as x-api-key and lowers the default delay.
// Output: a JSON report plus a console summary. Findings are observations at a
// recorded chain tip, not audit conclusions (spec section 10).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl, cvToHex, hexToCV, cvToValue } from '@stacks/transactions';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };

const targetsPath = resolve(opt('targets', join(HERE, 'targets.mainnet.json')));
const T = JSON.parse(readFileSync(targetsPath, 'utf8'));
const API = (opt('api', process.env.FT_API || T.api || 'https://api.hiro.so')).replace(/\/$/, '');
const KEY = process.env.HIRO_API_KEY;
const DELAY = Number(opt('delay-ms', KEY ? 150 : 1100));
const MAX_BINDINGS = flag('all') ? Infinity : Number(opt('max-bindings', 50));
const refPath = (p) => (p ? resolve(dirname(targetsPath), p) : null);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requests = 0;

// ---------------------------------------------------------------- transport
async function http(method, path, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    await sleep(DELAY);
    requests++;
    const res = await fetch(API + path, {
      method,
      headers: { 'content-type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 404) return null;
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * 2 ** attempt); continue; }
    if (!res.ok) throw new Error(`${method} ${path} -> HTTP ${res.status}`);
    return res.json();
  }
  throw new Error(`${method} ${path} -> gave up after retries`);
}
const split = (id) => { const [a, n] = id.split('.'); return [a, n]; };
const plain = (cv) => JSON.parse(JSON.stringify(cvToValue(cv, true), (k, v) => (typeof v === 'bigint' ? v.toString() : v)));

async function readOnly(contractId, fn, args = []) {
  const [a, n] = split(contractId);
  const r = await http('POST', `/v2/contracts/call-read/${a}/${n}/${fn}`, { sender: a, arguments: args.map((x) => cvToHex(x)) });
  if (!r) return { error: 'not found' };
  if (!r.okay) return { error: r.cause || 'call-read failed' };
  return { cv: hexToCV(r.result) };
}
async function dataVar(contractId, name) {
  const [a, n] = split(contractId);
  const r = await http('GET', `/v2/data_var/${a}/${n}/${name}?proof=0`);
  return r ? plain(hexToCV(r.data)) : { absent: true };
}
async function deployedSource(contractId) {
  const [a, n] = split(contractId);
  return http('GET', `/v2/contracts/source/${a}/${n}?proof=0`);
}
async function contractEvents(contractId, wanted, cap) {
  const out = [];
  for (let offset = 0; out.length < cap; offset += 50) {
    const page = await http('GET', `/extended/v1/contract/${contractId}/events?limit=50&offset=${offset}`);
    const rows = page?.results ?? [];
    for (const e of rows) {
      const hex = e?.contract_log?.value?.hex;
      if (!hex) continue;
      const v = plain(hexToCV(hex));
      if (v?.event?.value === wanted) out.push({ tx_id: e.tx_id, value: v });
    }
    if (rows.length < 50) break;
  }
  return out;
}
async function mints(assetIdentifier, cap = 20000) {
  const ids = [];
  for (let offset = 0; ids.length < cap; offset += 50) {
    const page = await http('GET', `/extended/v1/tokens/nft/mints?asset_identifier=${encodeURIComponent(assetIdentifier)}&limit=50&offset=${offset}`);
    const rows = page?.results ?? [];
    for (const m of rows) { const v = plain(hexToCV(m.value.hex)); ids.push(Number(v?.value ?? v)); }
    if (rows.length < 50) break;
  }
  return [...new Set(ids)].sort((x, y) => x - y);
}

// ---------------------------------------------------------------- helpers
// Unwrap (ok (some principal)) | (ok none) | (some principal) | none -> "SP..." | null, on raw CVs.
const optPrincipal = (cv) => {
  let c = cv;
  while (c && (c.type === 'ok' || c.type === 'some')) c = c.value;
  if (!c || c.type === 'none') return null;
  if (c.type === 'address' || c.type === 'contract') return c.value;
  throw new Error(`unexpected owner value ${JSON.stringify(plain(cv))}`);
};
function compareSource(deployed, refFile) {
  if (!deployed) return { status: 'deployed-source-unavailable' };
  if (!refFile) return { status: 'no-repo-reference', deployedSha256: sha(deployed) };
  let ref;
  try { ref = readFileSync(refFile, 'utf8'); } catch { return { status: 'reference-file-missing', refFile }; }
  const norm = (s) => s.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim();
  const code = (s) => norm(s).split('\n').map((l) => l.replace(/;;.*$/, '').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ');
  return {
    status: deployed === ref ? 'byte-identical' : norm(deployed) === norm(ref) ? 'whitespace-only-differences'
      : code(deployed) === code(ref) ? 'comment-or-whitespace-differences' : 'CODE-DIFFERS',
    deployedSha256: sha(deployed), referenceSha256: sha(ref), refFile,
  };
}
const sha = (s) => createHash('sha256').update(s).digest('hex');
const tryRO = async (id, fn, args) => { const r = await readOnly(id, fn, args); return r.error ? { error: r.error } : plain(r.cv); };

// ---------------------------------------------------------------- main
const report = { tool: 'forever-twins live-check', readOnly: true, ranAt: new Date().toISOString(), api: API, targets: targetsPath,
  chainTip: null, core: {}, helpers: [], sources: [], anomalies: [], requests: 0 };
const anomaly = (where, kind, detail) => report.anomalies.push({ where, kind, detail });

const info = await http('GET', '/v2/info');
report.chainTip = { stacks_tip_height: info?.stacks_tip_height, stacks_tip: info?.stacks_tip, burn_block_height: info?.burn_block_height };
console.log(`chain tip ${report.chainTip.stacks_tip_height} (burn ${report.chainTip.burn_block_height}) via ${API}`);

// core
{
  const c = T.core;
  report.core = {
    id: c.id,
    paused: await dataVar(c.id, 'paused'),
    admin: await tryRO(c.id, 'get-admin'),
    royaltyRecipient: await tryRO(c.id, 'get-royalty-recipient'),
    quoteOneChunk5KB: await tryRO(c.id, 'quote-single-tx-fee', [Cl.uint(5000), Cl.uint(1)]),
    allowedCallers: {},
    source: compareSource((await deployedSource(c.id))?.source, refPath(c.reference)),
  };
  for (const h of T.helpers) report.core.allowedCallers[h.helper] = await tryRO(c.id, 'is-allowed-caller', [Cl.principal(h.helper)]);
  const paused = JSON.stringify(report.core.paused).includes('true');
  if (paused) for (const [h, v] of Object.entries(report.core.allowedCallers))
    if (!JSON.stringify(v).includes('true')) anomaly(h, 'core-paused-and-helper-not-allowlisted', 'inscribe through this helper would fail');
}

// helpers
for (const h of T.helpers) {
  if (opt('only') && opt('only') !== h.key) continue;
  console.log(`helper ${h.key}`);
  const H = { key: h.key, helper: h.helper, source: h.source, interface: h.interface };
  H.sourceCompare = compareSource((await deployedSource(h.helper))?.source, refPath(h.reference));
  if (H.sourceCompare.status === 'CODE-DIFFERS') anomaly(h.key, 'helper-source-differs-from-repo-reference', H.sourceCompare);
  const fns = h.interface === 'v2' ? ['get-twin-interface'] : ['get-owner', 'get-fee', 'get-free-threshold', 'get-inscribed-count', 'is-finalized', 'get-payouts'];
  H.state = {};
  for (const f of fns) H.state[f] = await tryRO(h.helper, f);
  if (JSON.stringify(H.state['is-finalized'] ?? '').includes('false')) anomaly(h.key, 'canonical-not-finalised', 'helper admin can still re-seed canonical hashes for unbound tokens (evidence P4)');

  if (!flag('skip-bindings')) {
    const evs = await contractEvents(h.helper, 'inscribed', MAX_BINDINGS);
    H.bindingsScanned = evs.length;
    H.mimeCounts = {}; H.uriHosts = {}; H.custody = { consistent: 0, inconsistent: 0, stranded: 0, unknown: 0 };
    for (const e of evs) {
      const tokenId = Number(e.value['token-id'].value), xid = Number(e.value['xtrata-id'].value);
      const where = `${h.key}#${tokenId} (xtrata ${xid})`;
      const b = await tryRO(h.helper, 'get-binding', [Cl.uint(tokenId)]);
      const bv = b?.value;
      if (!bv) { anomaly(where, 'event-without-binding', b); continue; }
      if (Number(bv['xtrata-id'].value) !== xid) anomaly(where, 'binding-xtrata-id-mismatch', bv);
      if (h.interface !== 'v2') {
        const canon = await tryRO(h.helper, 'get-canonical-hash', [Cl.uint(tokenId)]);
        const ch = canon?.value?.value ?? canon?.value;
        if (!ch) anomaly(where, 'no-canonical-hash-for-bound-token', canon);
        else if (ch !== bv['content-hash'].value) anomaly(where, 'canonical-hash-changed-after-binding', { canonical: ch, bound: bv['content-hash'].value });
      }
      const tOwner = optPrincipal((await readOnly(T.core.id, 'get-owner', [Cl.uint(xid)])).cv);
      const oRes = await readOnly(h.source, 'get-owner', [Cl.uint(tokenId)]);
      const oOwner = oRes.error ? undefined : optPrincipal(oRes.cv);
      const escrowed = bv['xtrata-escrowed'].value === true;
      let state;
      if (oOwner === undefined) state = 'unknown';
      else if (tOwner === h.helper && oOwner === h.helper) state = 'stranded';
      else if (escrowed ? (tOwner === h.helper && oOwner && oOwner !== h.helper) : (oOwner === h.helper && tOwner && tOwner !== h.helper)) state = 'consistent';
      else state = 'inconsistent';
      H.custody[state]++;
      if (state === 'stranded') anomaly(where, 'helper-holds-both-sides', { escrowedFlag: escrowed });
      if (state === 'inconsistent') anomaly(where, 'custody-disagrees-with-binding', { escrowedFlag: escrowed, twinOwner: tOwner, originalOwner: oOwner });
      const meta = await tryRO(T.core.id, 'get-inscription-meta', [Cl.uint(xid)]);
      const mime = meta?.value?.['mime-type']?.value ?? '?';
      H.mimeCounts[mime] = (H.mimeCounts[mime] ?? 0) + 1;
      if (h.expectedMimePattern && !new RegExp(h.expectedMimePattern).test(mime)) anomaly(where, 'unexpected-twin-mime', mime);
      const uri = (await tryRO(T.core.id, 'get-token-uri-raw', [Cl.uint(xid)]))?.value ?? '?';
      const host = String(uri).replace(/^([a-z]+:\/\/[^/]+).*$/i, '$1');
      H.uriHosts[host] = (H.uriHosts[host] ?? 0) + 1;
      if (h.expectedUriPattern && !new RegExp(h.expectedUriPattern).test(uri)) anomaly(where, 'unexpected-twin-token-uri', uri);
    }
  }
  report.helpers.push(H);
}

// sources
if (!opt('only')) for (const src of T.sources ?? []) {
  console.log(`source ${src.id}`);
  const S = { id: src.id, sourceCompare: compareSource((await deployedSource(src.id))?.source, refPath(src.reference)), dataVars: {}, readOnly: {} };
  if (S.sourceCompare.status === 'CODE-DIFFERS') anomaly(src.id, 'deployed-source-differs-from-archive', S.sourceCompare);
  for (const v of src.dataVars ?? []) S.dataVars[v] = await dataVar(src.id, v);
  for (const f of src.readOnly ?? []) S.readOnly[f] = await tryRO(src.id, f);
  if (src.census && !flag('skip-census')) {
    const ids = await mints(`${src.id}::${src.census.asset}`);
    const owners = {};
    let burned = 0, unknown = 0;
    for (const id of ids) {
      const r = await readOnly(src.id, 'get-owner', [Cl.uint(id)]);
      if (r.error) { unknown++; continue; }
      const o = optPrincipal(r.cv);
      if (!o) burned++; else owners[o] = (owners[o] ?? 0) + 1;
    }
    S.census = { mintedEver: ids.length, ids, burned, unknownOwner: unknown, distinctHolders: Object.keys(owners).length,
      heldByContracts: Object.fromEntries(Object.entries(owners).filter(([p]) => p.includes('.'))) };
  }
  report.sources.push(S);
}

report.requests = requests;
const out = resolve(opt('out', join(HERE, '..', 'results', `live-check-${report.ranAt.replace(/[:.]/g, '-')}.json`)));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 2));

console.log('\n--- summary');
console.log(`core ${report.core.id}: paused=${JSON.stringify(report.core.paused)} source=${report.core.source.status}`);
for (const H of report.helpers)
  console.log(`${H.key}: source=${H.sourceCompare.status} scanned=${H.bindingsScanned ?? '-'} custody=${JSON.stringify(H.custody ?? {})} mimes=${JSON.stringify(H.mimeCounts ?? {})}`);
for (const S of report.sources)
  console.log(`${S.id}: source=${S.sourceCompare.status}${S.census ? ` minted=${S.census.mintedEver} burned=${S.census.burned}` : ''} vars=${JSON.stringify(S.dataVars)}`);
console.log(`${report.anomalies.length} anomalies; ${requests} requests; report -> ${out}`);
if (MAX_BINDINGS !== Infinity) console.log(`note: binding scan capped at ${MAX_BINDINGS} per helper; use --all for full coverage`);

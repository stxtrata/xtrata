#!/usr/bin/env node
// Forever Twins evidence snapshot (read-only).
// Reads every helper in forever-twins/data/registry.v2.json from the chain (GET and read-only calls only)
// and writes a dated record: deployed-source hash vs the registry pin, finalised state, counts, fee,
// the helper's transactions, manifest hashes (repo file, live site, and the hash stored on chain) and a resolver spot check.
// Usage: node scripts/evidence-snapshot.mjs [--api https://xtrata.xyz/hiro/mainnet] [--site https://xtrata.xyz] [--out <dir>]
// Output: <out>/chain-evidence.json and <out>/chain-evidence.md (default out: DeGrants/Forever Twins/evidence/<UTC date>)
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileP = promisify(execFile);
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hexToCV, cvToJSON } from '@stacks/transactions';

const here = dirname(fileURLToPath(import.meta.url));
const FT = resolve(here, '../..');              // forever-twins/
const XTRATA = resolve(FT, '..');               // xtrata-2.0/
const ROOT = resolve(XTRATA, '..');             // repository root
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const API = arg('--api', 'https://xtrata.xyz/hiro/mainnet').replace(/\/$/, '');
const SITE = arg('--site', 'https://xtrata.xyz').replace(/\/$/, '');
const now = new Date();
const OUT = resolve(arg('--out', resolve(ROOT, 'DeGrants/Forever Twins/evidence', now.toISOString().slice(0, 10))));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');


// --curl routes requests through the curl binary. Use it where Node's fetch cannot reach the network
// (for example a sandbox that only exposes a proxy to curl); results are identical.
const USE_CURL = process.argv.includes('--curl');
async function curlFetch(url, init = {}) {
  const args = ['-sS', '-m', '60', '-w', '\n%{http_code}', '-X', init.method || 'GET'];
  for (const [k, v] of Object.entries(init.headers || {})) args.push('-H', `${k}: ${v}`);
  if (init.body) args.push('--data-binary', init.body);
  args.push(url);
  const { stdout } = await execFileP('curl', args, { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });
  const i = stdout.lastIndexOf(0x0a);
  const status = Number(stdout.subarray(i + 1).toString());
  const body = stdout.subarray(0, i);
  if (!status) throw new Error('curl failed');
  return { status, ok: status >= 200 && status < 300, json: async () => JSON.parse(body.toString('utf8')), arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.length), text: async () => body.toString('utf8') };
}

async function http(url, init) {
  if (process.env.FT_EVIDENCE_VERBOSE) console.error('GET', url.slice(0, 140));
  for (let i = 0; i < 5; i++) {
    const res = await (USE_CURL ? curlFetch(url, init) : fetch(url, { ...(init || {}), signal: AbortSignal.timeout(30000) })).catch(() => null);
    if (res && res.status !== 429 && res.status < 500) return res;
    await sleep(600 * (i + 1) ** 2);
  }
  throw new Error(`request failed: ${url}`);
}
const getJson = async (url) => { const r = await http(url); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); };

const plain = (j) => {
  if (j === null || typeof j !== 'object') return j;
  if (Array.isArray(j)) return j.map(plain);
  if ('type' in j && 'value' in j) {
    const t = String(j.type);
    if (t.startsWith('(tuple')) return Object.fromEntries(Object.entries(j.value).map(([k, v]) => [k, plain(v)]));
    if (t.startsWith('(optional') || t.startsWith('(response')) return j.value === null ? null : plain(j.value);
    if (t.startsWith('(list')) return j.value.map(plain);
    return plain(j.value);
  }
  return j;
};
async function readOnly(id, fn) {
  const [addr, name] = id.split('.');
  try {
    const r = await http(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: addr, arguments: [] }) });
    const j = await r.json();
    if (!j.okay) return { error: String(j.cause || j.error || r.status) };
    return { value: plain(cvToJSON(hexToCV(j.result))) };
  } catch (e) { return { error: e.message }; }
}

async function helperTxs(id) {
  const rows = []; let offset = 0, total = 0;
  do {
    const j = await getJson(`${API}/extended/v1/address/${id}/transactions?limit=50&offset=${offset}`);
    total = j.total; rows.push(...j.results); offset += 50;
  } while (offset < total && offset < 1000);
  const byFunction = {}; const calls = []; const seeds = [];
  for (const t of rows) {
    const fn = t.tx_type === 'smart_contract' ? 'deploy' : (t.contract_call && t.contract_call.function_name) || t.tx_type;
    byFunction[fn] = (byFunction[fn] || 0) + 1;
    const rec = { function: fn, txId: t.tx_id, status: t.tx_status, block: t.block_height, time: t.burn_block_time_iso, sender: t.sender_address };
    (fn === 'seed-canonical' ? seeds : calls).push(rec);
  }
  const byBlock = (a, b) => a.block - b.block;
  calls.sort(byBlock); seeds.sort(byBlock);
  return { total, byFunction, calls, seed: seeds.length ? { calls: seeds.length, first: seeds[0].txId, last: seeds[seeds.length - 1].txId, allSucceeded: seeds.every((s) => s.status === 'success') } : null };
}

const reg = JSON.parse(readFileSync(resolve(FT, 'data/registry.v2.json'), 'utf8'));
const results = [];
for (const c of reg.collections.filter((x) => x.helper)) {
  const [addr, name] = c.helper.split('.');
  const rec = { key: c.key, name: c.name, interface: c.interface, group: c.group, source: c.source, sourceAsset: c.sourceAsset, helper: c.helper, status: c.status };
  try { const ci = await getJson(`${API}/extended/v1/contract/${c.helper}`); rec.deploy = { txId: ci.tx_id, block: ci.block_height, canonical: ci.canonical }; } catch (e) { rec.deploy = { error: e.message }; }
  try {
    const src = await getJson(`${API}/v2/contracts/source/${addr}/${name}`);
    const h = sha256(Buffer.from(src.source, 'utf8'));
    rec.source = { sha256: h, bytes: Buffer.byteLength(src.source, 'utf8'), registryPin: c.helperSourceSha256 || null, matchesPin: c.helperSourceSha256 ? h === c.helperSourceSha256 : null };
  } catch (e) { rec.source = { error: e.message }; }
  const fns = c.interface === 'v3' ? ['is-finalized', 'get-inscribed-count', 'get-fee', 'get-large-unbound', 'get-twin-interface'] : ['get-inscribed-count', 'get-fee', 'get-free-threshold'];
  rec.reads = {};
  for (const fn of fns) { rec.reads[fn] = await readOnly(c.helper, fn); await sleep(120); }
  if (c.interface === 'v3') {
    try { rec.transactions = await helperTxs(c.helper); } catch (e) { rec.transactions = { error: e.message }; }
  }
  if (c.manifest) {
    const m = { registrySha256: c.manifest.sha256, count: c.manifest.count };
    const local = resolve(XTRATA, 'public' + c.manifest.url);
    m.repoFileSha256 = existsSync(local) ? sha256(readFileSync(local)) : null;
    try { const r = await http(SITE + c.manifest.url); m.liveSha256 = r.ok ? sha256(Buffer.from(await r.arrayBuffer())) : `HTTP ${r.status}`; } catch (e) { m.liveSha256 = e.message; }
    const iface = rec.reads['get-twin-interface'] && rec.reads['get-twin-interface'].value;
    m.onChainHash = iface ? String(iface['manifest-hash'] || '').replace(/^0x/, '') : null;
    m.allMatch = [m.registrySha256, m.repoFileSha256, m.liveSha256, m.onChainHash].every((x) => x === m.registrySha256);
    rec.manifest = m;
    try {
      const man = JSON.parse(readFileSync(local, 'utf8'));
      rec.snapshot = man.snapshot || null;
      const first = man.tokens[0].id;
      const r = await http(`${SITE}/ft/${c.key}/${first}.json`);
      const j = r.ok ? await r.json() : null;
      rec.resolver = { sampleToken: first, httpStatus: r.status, status: j && j.properties ? j.properties.status : null };
    } catch (e) { rec.resolver = { error: e.message }; }
  }
  if (c.coverage) rec.coverage = c.coverage;
  results.push(rec);
  console.error(`read ${c.key}`);
}

let tip = null; try { const info = await getJson(`${API}/v2/info`); tip = { stacksTipHeight: info.stacks_tip_height, stacksTip: info.stacks_tip }; } catch { /* optional */ }
const doc = { generatedAt: now.toISOString(), api: API, site: SITE, tip, registry: 'forever-twins/data/registry.v2.json', core: reg.core, collections: results };
mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, 'chain-evidence.json'), JSON.stringify(doc, null, 2) + '\n');

const val = (r, fn) => (r.reads[fn] && 'value' in r.reads[fn] ? r.reads[fn].value : '—');
const fee = (r) => { const v = val(r, 'get-fee'); return v === '—' ? v : `${Number(v) / 1e6} STX`; };
const md = [`# Forever Twins chain evidence`, ``, `Generated ${doc.generatedAt} from \`${API}\`${tip ? ` (Stacks tip ${tip.stacksTipHeight})` : ''}. Read-only. Reproduce with \`node scripts/evidence-snapshot.mjs\` in \`xtrata-2.0/forever-twins/ft-harness\`.`, ``,
  `| Collection | Helper | Group | Deployed (block) | Source = pinned template | Finalised | Inscribed twins | Fee | Large files unbound |`, `|---|---|---|---|---|---|---|---|---|`];
for (const r of results) md.push(`| ${r.name} | \`${r.helper}\` | ${r.interface} ${r.group} | ${r.deploy.block ?? '—'} | ${r.source.matchesPin === true ? 'yes' : r.source.matchesPin === false ? '**NO**' : 'n/a'} | ${val(r, 'is-finalized')} | ${val(r, 'get-inscribed-count')} | ${fee(r)} | ${val(r, 'get-large-unbound')} |`);
md.push('', '## Manifests', '', '| Collection | Tokens | Registry = repo = live site = on-chain hash | SHA-256 | Snapshot block | Resolver sample |', '|---|---|---|---|---|---|');
for (const r of results.filter((x) => x.manifest)) md.push(`| ${r.name} | ${r.manifest.count} | ${r.manifest.allMatch ? 'yes' : '**NO**'} | \`${r.manifest.registrySha256}\` | ${r.snapshot ? r.snapshot.stacksTipHeight : '—'} | #${r.resolver && r.resolver.sampleToken}: HTTP ${r.resolver && r.resolver.httpStatus}, ${r.resolver && r.resolver.status} |`);
for (const r of results.filter((x) => x.transactions && x.transactions.calls)) {
  md.push('', `## ${r.name}: transactions`, '', `Deploy \`${r.deploy.txId}\` · ${r.transactions.seed ? `seed-canonical x${r.transactions.seed.calls} (${r.transactions.seed.allSucceeded ? 'all succeeded' : 'some failed'}; first \`${r.transactions.seed.first}\`, last \`${r.transactions.seed.last}\`)` : 'no seed calls'}`, '', '| Function | Tx | Status | Block | Time (UTC) | Sender |', '|---|---|---|---|---|---|');
  for (const t of r.transactions.calls) md.push(`| ${t.function} | \`${t.txId}\` | ${t.status} | ${t.block} | ${String(t.time).slice(0, 16)} | \`${t.sender}\` |`);
}
writeFileSync(resolve(OUT, 'chain-evidence.md'), md.join('\n') + '\n');
console.error(`wrote ${OUT}`);

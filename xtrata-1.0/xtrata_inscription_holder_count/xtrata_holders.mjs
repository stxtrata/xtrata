#!/usr/bin/env node
/**
 * xtrata_holders.mjs
 * ------------------------------------------------------------------
 * Enumerates every Stacks wallet associated with an Xtrata inscription
 * across the v1/v2/v3 contracts, for an airdrop to early supporters.
 *
 * For each contract it:
 *   1. reads the contract interface to find the NFT asset + get-owner fn,
 *   2. enumerates all minted token ids via the NFT "mints" endpoint,
 *   3. calls get-owner (read-only) per token to get the CURRENT owner.
 *
 * Outputs (in --out dir, default ./out):
 *   holders_current.csv  -> CURRENT holders, wallets only, one per line   << primary airdrop list
 *   minters.csv          -> original minters, wallets only (the "early" set)
 *   detailed.csv         -> address,type,held_v1,held_v2,held_v3,held_total,minted_total
 *   And a summary to the console (per-contract counts, unique wallets,
 *   how many hold across all three, marketplace/contract-held tokens).
 *
 * Run:
 *   export HIRO_API_KEY=...        # optional but strongly recommended (faster, higher rate limit)
 *   node xtrata_holders.mjs        # uses the three contracts below
 *   node xtrata_holders.mjs SP....c1 SP....c2 SP....c3   # or pass your own
 *
 * Requires: Node 18+ (global fetch) and `npm i @stacks/transactions`.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { hexToCV, cvToString, ClarityType } from '@stacks/transactions';

const CONTRACTS = [
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1',
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0',
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
];

const API = process.env.HIRO_API_URL || 'https://api.hiro.so';
const KEY = process.env.HIRO_API_KEY || '';
const baseHeaders = KEY ? { 'x-api-key': KEY } : {};
const isContract = (p) => typeof p === 'string' && p.includes('.');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- resilient HTTP with backoff on 429 / 5xx ---------- */
async function req(url, opts = {}, tries = 7) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    let res;
    try {
      res = await fetch(url, { ...opts, headers: { ...baseHeaders, ...(opts.headers || {}) } });
    } catch (e) { lastErr = e; await sleep(Math.min(15000, 400 * 2 ** i)); continue; }
    if (res.status === 429 || res.status >= 500) {
      const ra = parseInt(res.headers.get('retry-after') || '0', 10);
      await sleep(ra > 0 ? ra * 1000 : Math.min(20000, 500 * 2 ** i));
      continue;
    }
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${url} :: ${t.slice(0, 180)}`);
    }
    return res;
  }
  throw lastErr || new Error('max retries exceeded: ' + url);
}
const getJSON = async (path) => (await req(API + path)).json();
const postJSON = async (path, body) =>
  (await req(API + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json();

/* ---------- decode a get-owner result -> { owner } | { none } | { err } ---------- */
export function decodeOwner(resultHex) {
  let cv;
  try { cv = hexToCV(resultHex); } catch (e) { return { err: true, cause: 'hexToCV' }; }
  if (cv.type === ClarityType.ResponseErr) return { err: true, cause: 'response-err' };
  let inner = cv.type === ClarityType.ResponseOk ? cv.value : cv;
  if (inner.type === ClarityType.OptionalNone) return { none: true };
  if (inner.type === ClarityType.OptionalSome) inner = inner.value;
  return { owner: cvToString(inner).replace(/^'/, '') };
}

/* ---------- per-contract metadata: nft asset name(s) + get-owner fn ---------- */
async function contractMeta(contractId) {
  const [addr, name] = contractId.split('.');
  const iface = await getJSON(`/v2/contracts/interface/${addr}/${name}`);
  const nfts = (iface.non_fungible_tokens || []).map((n) => n.name);
  const fns = iface.functions || [];
  let ownerFn = fns.find((f) => f.name === 'get-owner');
  if (!ownerFn) ownerFn = fns.find((f) => /owner/i.test(f.name) && (f.args || []).length === 1);
  return { addr, name, nfts, ownerFn: ownerFn ? ownerFn.name : 'get-owner' };
}

/* ---------- enumerate all minted tokens for an asset class ---------- */
async function enumTokens(contractId, asset) {
  const assetId = `${contractId}::${asset}`;
  let offset = 0; const limit = 200; const out = []; let total = Infinity;
  while (offset < total) {
    const d = await getJSON(
      `/extended/v1/tokens/nft/mints?asset_identifier=${encodeURIComponent(assetId)}&limit=${limit}&offset=${offset}`
    );
    total = Number.isFinite(d.total) ? d.total : (d.results ? d.results.length : 0);
    for (const r of (d.results || [])) out.push({ hex: r.value && r.value.hex, repr: r.value && r.value.repr, minter: r.recipient });
    if (!d.results || d.results.length === 0) break;
    offset += limit;
  }
  return out;
}

/* ---------- current owner of one token ---------- */
async function getOwner(addr, name, fn, valueHex) {
  const arg = valueHex.startsWith('0x') ? valueHex : '0x' + valueHex;
  const d = await postJSON(`/v2/contracts/call-read/${addr}/${name}/${fn}`, { sender: `${addr}.${name}`, arguments: [arg] });
  if (d.okay === false) return { err: true, cause: d.cause };
  return decodeOwner(d.result);
}

/* ---------- bounded-concurrency map with progress ---------- */
async function mapPool(items, fn, size, onProg) {
  const ret = new Array(items.length); let idx = 0, done = 0;
  async function worker() {
    while (true) {
      const i = idx++; if (i >= items.length) break;
      ret[i] = await fn(items[i], i); done++;
      if (onProg && (done % 25 === 0 || done === items.length)) onProg(done, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length || 1) }, worker));
  return ret;
}

const csvCell = (s) => /[",\n]/.test(String(s)) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s);

/* ================================ main ================================ */
export async function run({ contracts = CONTRACTS, outDir = 'out', concurrency = 6 } = {}) {
  const N = contracts.length;
  const perContractCurrent = contracts.map(() => new Set());     // wallets+contracts holding now, per contract
  const currentCount = new Map();   // principal -> # tokens currently held (all contracts)
  const minterCount = new Map();    // principal -> # tokens originally minted
  const heldVec = new Map();        // principal -> [v1,v2,v3] current counts
  let totalTokens = 0, burned = 0, contractHeldTokens = 0, ownerErrors = 0;

  for (let c = 0; c < N; c++) {
    const cid = contracts[c];
    process.stderr.write(`\n[${c + 1}/${N}] ${cid}\n`);
    const { addr, name, nfts, ownerFn } = await contractMeta(cid);
    const assets = nfts.length ? nfts : [name];
    process.stderr.write(`  nft asset(s): ${assets.join(', ')} | owner fn: ${ownerFn}\n`);

    let tokens = [];
    for (const a of assets) {
      const t = await enumTokens(cid, a);
      tokens.push(...t.map((x) => ({ ...x, asset: a })));
    }
    const seen = new Set();
    tokens = tokens.filter((t) => { const k = t.asset + '|' + t.hex; if (!t.hex || seen.has(k)) return false; seen.add(k); return true; });
    totalTokens += tokens.length;
    process.stderr.write(`  minted tokens: ${tokens.length}\n`);

    for (const t of tokens) if (t.minter) minterCount.set(t.minter, (minterCount.get(t.minter) || 0) + 1);

    const owners = await mapPool(
      tokens, (t) => getOwner(addr, name, ownerFn, t.hex), concurrency,
      (d, n) => process.stderr.write(`\r  current owners: ${d}/${n}   `)
    );
    process.stderr.write('\n');

    owners.forEach((o) => {
      if (!o) { ownerErrors++; return; }
      if (o.none) { burned++; return; }
      if (o.err) { ownerErrors++; return; }
      const p = o.owner;
      perContractCurrent[c].add(p);
      currentCount.set(p, (currentCount.get(p) || 0) + 1);
      if (!heldVec.has(p)) heldVec.set(p, new Array(N).fill(0));
      heldVec.get(p)[c]++;
      if (isContract(p)) contractHeldTokens++;
    });
  }

  // ----- derive sets -----
  const walletsCurrent = [...currentCount.keys()].filter((p) => !isContract(p)).sort();
  const contractsCurrent = [...currentCount.keys()].filter(isContract).sort();
  const walletsMinters = [...minterCount.keys()].filter((p) => !isContract(p)).sort();
  const inAllThree = walletsCurrent.filter((p) => perContractCurrent.every((s) => s.has(p)));
  const allPrincipals = [...new Set([...currentCount.keys(), ...minterCount.keys()])].sort();

  // ----- write files -----
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/holders_current.csv`, walletsCurrent.join('\n') + '\n');
  writeFileSync(`${outDir}/minters.csv`, walletsMinters.join('\n') + '\n');
  const tags = contracts.map((cid, i) => { const nm = (cid.split('.')[1] || ''); const m = nm.match(/v(\d+)/i); return m ? 'v' + m[1] : 'c' + (i + 1); });
  const tseen = {}; tags.forEach((t, i) => { if (tseen[t] != null) tags[i] = t + '_' + (i + 1); tseen[tags[i]] = i; });
  const head = `address,type,${tags.map((t) => 'held_' + t).join(',')},held_total,minted_total`;
  const rows = allPrincipals.map((p) => {
    const v = heldVec.get(p) || new Array(N).fill(0);
    const heldTotal = currentCount.get(p) || 0;
    return [p, isContract(p) ? 'contract' : 'wallet', ...v, heldTotal, minterCount.get(p) || 0].map(csvCell).join(',');
  });
  writeFileSync(`${outDir}/detailed.csv`, [head, ...rows].join('\n') + '\n');

  // ----- summary -----
  const L = [];
  L.push('');
  L.push('================ XTRATA HOLDERS SUMMARY ================');
  contracts.forEach((cid, i) => L.push(`  ${cid}\n      current holders: ${perContractCurrent[i].size}`));
  L.push(`  total inscriptions scanned : ${totalTokens}`);
  L.push(`  burned / no owner          : ${burned}`);
  L.push(`  owner lookup errors        : ${ownerErrors}`);
  L.push('  -----------------------------------------------------');
  L.push(`  UNIQUE WALLETS holding now  : ${walletsCurrent.length}   <- holders_current.csv (airdrop list)`);
  L.push(`  unique wallets that minted  : ${walletsMinters.length}   <- minters.csv`);
  L.push(`  wallets holding in ALL 3    : ${inAllThree.length}`);
  L.push(`  contract/escrow holders     : ${contractsCurrent.length} (holding ${contractHeldTokens} token(s) — e.g. marketplace listings)`);
  L.push('  -----------------------------------------------------');
  L.push(`  files written to ${outDir}/  (holders_current.csv, minters.csv, detailed.csv)`);
  L.push('=======================================================');
  console.log(L.join('\n'));

  return { walletsCurrent, walletsMinters, inAllThree, contractsCurrent, totalTokens, burned, ownerErrors };
}

/* run only when invoked directly (so tests can import without hitting the network) */
const isMain = (() => { try { return process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href; } catch { return false; } })();
if (isMain) {
  const args = process.argv.slice(2).filter((a) => a.includes('.'));
  run({ contracts: args.length ? args : CONTRACTS, outDir: process.env.OUT_DIR || 'out' })
    .catch((e) => { console.error('\nFATAL:', e.message); process.exit(1); });
}

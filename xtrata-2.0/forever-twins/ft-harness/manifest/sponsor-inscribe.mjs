#!/usr/bin/env node
// Sponsor-inscribe the twins of a finalised Forever Twins helper, in batches.
//
//   node manifest/sponsor-inscribe.mjs --manifest manifest/out/nyc-degens.manifest.json \
//        --helper SP...helper-name [--gateway http://127.0.0.1:8080] [--only 174 | 1-20,50]
//        [--batch 20] [--max-fee-ustx 500000] [--api https://api.hiro.so]
//        [--execute --confirm SP...helper-name]        (omit both for a DRY RUN)
//        [--offline]                                   (files only, no chain reads; no --helper needed)
//
// DRY RUN (default): fetches every selected file from the gateway, checks size, sha256 and the Xtrata
// rolling hash against the manifest, reads the helper (finalised? already bound?), quotes the helper fee
// and the core fee, and prints the plan and total. Nothing is signed or broadcast. No key is read.
//
// --execute: needs env SPONSOR_PRIVATE_KEY (hex private key of the wallet that pays; never printed, never
// logged, never passed on the command line) and --confirm <helper> equal to --helper. Sends `inscribe`
// calls with consecutive nonces, at most --batch (<= 25, the Stacks per-account pending limit) at a time,
// waits for every transaction in the batch to confirm, and stops at the first failure. Safe to re-run:
// bound tokens are skipped and unfinished transactions from an earlier run are awaited first.
// Each transaction carries a post-condition capping what the sponsor wallet can send (helper fee + core
// fee for that token); the helper contract itself can only spend what it receives (Clarity 4 allowances).
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, basename } from 'node:path';
import * as tx from '@stacks/transactions';
import { Cl, cvToJSON, hexToCV, cvToHex, Pc, PostConditionMode } from '@stacks/transactions';
import { chunk, sha256Hex, xtrataHashHex, toHttp, MAX_BYTES } from './lib.mjs';

const DEFAULT_MASTER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function parseIds(spec) {
  const out = new Set();
  for (const part of String(spec).split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!m) throw new Error(`bad --only value: ${part}`);
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
    if (b < a) throw new Error(`bad range: ${part}`);
    for (let i = a; i <= b; i++) out.add(i);
  }
  return [...out].sort((x, y) => x - y);
}

// Check the downloaded bytes against the manifest record. Throws with a specific reason.
export async function verifyToken(token, bytes) {
  const t = token.twin;
  if (bytes.length !== t.totalSize) throw new Error(`token ${token.id}: size ${bytes.length} != manifest ${t.totalSize}`);
  const sha = await sha256Hex(bytes);
  if (sha !== t.sha256) throw new Error(`token ${token.id}: sha256 ${sha} != manifest ${t.sha256}`);
  const rolling = '0x' + (await xtrataHashHex(bytes));
  if (rolling.toLowerCase() !== t.contentHash.toLowerCase()) throw new Error(`token ${token.id}: rolling hash ${rolling} != manifest ${t.contentHash}`);
  return chunk(bytes);
}

export async function fetchBytes(url, { retries = 5, timeoutMs = 120000 } = {}) {
  let last;
  for (let a = 0; a < retries; a++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (res.ok) return new Uint8Array(await res.arrayBuffer());
      last = new Error(`HTTP ${res.status} for ${url}`);
    } catch (e) { last = e; }
    await sleep(1000 * (a + 1));
  }
  throw last;
}

export async function buildInscribeTx({ helper, token, chunks, senderKey, senderAddress, nonce, capUstx, feeUstx }) {
  const [contractAddress, contractName] = helper.split('.');
  return tx.makeContractCall({
    contractAddress, contractName, functionName: 'inscribe',
    functionArgs: [Cl.uint(token.id), Cl.list(chunks.map((c) => Cl.buffer(c)))],
    senderKey, network: 'mainnet', nonce,
    // Cap what the sponsor wallet can send in this call. Allow mode is needed because the helper contract
    // itself pays the core fee out of what it received; the sender-side cap is what protects the wallet.
    postConditions: [Pc.principal(senderAddress).willSendLte(capUstx).ustx()],
    postConditionMode: PostConditionMode.Allow,
    ...(feeUstx !== undefined ? { fee: feeUstx } : {}),
  });
}

function makeApi(base, apiKey) {
  const headers = apiKey ? { 'x-api-key': apiKey } : {};
  const call = async (path, init = {}, tries = 6) => {
    let last;
    for (let a = 0; a < tries; a++) {
      const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
      if (res.status === 429 || res.status >= 500) { last = new Error(`HTTP ${res.status} ${path}`); await sleep(1500 * (a + 1)); continue; }
      if (res.status === 404) return { status: 404, body: null };
      if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
      return { status: res.status, body: await res.json() };
    }
    throw last;
  };
  const readOnly = async (contractId, fn, args, sender) => {
    const [a, n] = contractId.split('.');
    const { body } = await call(`/v2/contracts/call-read/${a}/${n}/${fn}`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sender, arguments: args.map(cvToHex) }) });
    if (!body?.okay) throw new Error(`${fn} failed: ${body?.cause}`);
    return cvToJSON(hexToCV(body.result));
  };
  return { call, readOnly };
}

const descend = (j, key) => { // find a tuple field anywhere under a cvToJSON value
  let cur = j;
  while (cur && typeof cur.value === 'object' && cur.value !== null) {
    if (key in cur.value) return cur.value[key];
    cur = cur.value;
  }
  return undefined;
};
const uintOf = (j) => { let c = j; while (c && typeof c.value === 'object' && c.value !== null) c = c.value; return BigInt(c.value); };

async function main() {
  const argv = process.argv.slice(2);
  const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
  const flag = (n) => argv.includes(`--${n}`);
  const manifestPath = opt('manifest');
  if (!manifestPath) { console.error('usage: sponsor-inscribe.mjs --manifest <file> --helper <SP...name> [--only ids] [--execute --confirm <helper>] [--offline]'); process.exit(1); }
  const offline = flag('offline'), execute = flag('execute');
  const helper = opt('helper');
  if (!offline && !helper) throw new Error('--helper is required (or --offline to check files only)');
  if (execute && offline) throw new Error('--execute cannot be combined with --offline');
  if (execute && opt('confirm') !== helper) throw new Error('--execute needs --confirm <helper> exactly equal to --helper');
  const gateway = opt('gateway', 'http://127.0.0.1:8080');
  const batchSize = Math.min(25, Math.max(1, Number(opt('batch', '20'))));
  const maxFee = BigInt(opt('max-fee-ustx', '500000'));
  const apiBase = opt('api', process.env.FT_API || 'https://api.hiro.so').replace(/\/$/, '');
  const { call, readOnly } = makeApi(apiBase, process.env.HIRO_API_KEY);

  const text = readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(text);
  const sha = createHash('sha256').update(text).digest('hex');
  const shaFile = manifestPath.replace(/\.json$/, '.sha256');
  if (existsSync(shaFile) && !readFileSync(shaFile, 'utf8').startsWith(sha)) throw new Error('manifest does not match its .sha256 file');
  if (/subset|NOT for finalisation/.test(manifest.scope || '')) throw new Error(`refusing a partial manifest (scope: ${manifest.scope})`);
  const master = manifest.core || DEFAULT_MASTER;
  const only = opt('only') ? new Set(parseIds(opt('only'))) : null;
  const all = manifest.tokens.filter((t) => !only || only.has(t.id));
  if (only) for (const id of only) if (!all.some((t) => t.id === id)) throw new Error(`token ${id} is not in the manifest`);
  const skippedLarge = all.filter((t) => t.twin.route === 'preinscribed' || t.twin.totalSize > MAX_BYTES);
  const todo = all.filter((t) => !skippedLarge.includes(t));
  console.log(`${execute ? 'EXECUTE' : 'DRY RUN'}: ${manifest.collectionKey}, manifest sha256 ${sha}`);
  console.log(`selected ${all.length}, large (pre-inscribe route, skipped) ${skippedLarge.length}, to inscribe ${todo.length}, gateway ${gateway}`);

  let sender = null, senderKey = null;
  if (execute) {
    senderKey = process.env.SPONSOR_PRIVATE_KEY;
    if (!senderKey || !/^[0-9a-fA-F]{64}(01)?$/.test(senderKey)) throw new Error('set SPONSOR_PRIVATE_KEY (64 hex chars, optionally followed by 01) in the environment');
    sender = (tx.privateKeyToAddress ?? tx.getAddressFromPrivateKey)(senderKey, 'mainnet');
    console.log(`sponsor wallet: ${sender}`);
  }
  const payer = sender || helper?.split('.')[0];

  if (!offline) {
    const fin = await readOnly(helper, 'is-finalized', [], payer);
    if (!(fin.value?.value === true || fin.value === true)) throw new Error('helper is not finalised: inscribe is refused until finalize-canonical');
    console.log('helper is finalised');
  }

  const logPath = join(dirname(manifestPath), `${manifest.collectionKey}.sponsor-log.jsonl`);
  const log = (o) => appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), ...o }) + '\n');
  const waitFor = async (txid) => {
    for (let i = 0; i < 160; i++) { // about 40 minutes
      const { status, body } = await call(`/extended/v1/tx/${txid}`);
      const s = status === 404 ? 'pending' : body.tx_status;
      if (s === 'success') return s;
      if (s !== 'pending' && !String(s).startsWith('pending')) return s;
      await sleep(15000);
    }
    return 'timeout';
  };

  // Await anything an earlier run left in flight.
  if (execute && existsSync(logPath)) {
    const last = new Map();
    for (const line of readFileSync(logPath, 'utf8').split('\n').filter(Boolean)) { const o = JSON.parse(line); if (o.txid) last.set(o.txid, o); }
    for (const [txid, o] of last) if (o.event === 'submitted') { const s = await waitFor(txid); log({ event: s === 'success' ? 'confirmed' : 'failed', id: o.id, txid, status: s }); if (s !== 'success') throw new Error(`earlier tx ${txid} (token ${o.id}) ended ${s}; resolve before re-running`); }
  }

  let totalHelperFee = 0n, totalCore = 0n, inscribed = 0, skippedBound = 0, spent = 0n;
  let nonce = null;
  if (execute) {
    const { body } = await call(`/extended/v1/address/${sender}/nonces`);
    nonce = BigInt(body.possible_next_nonce);
  }

  for (let i = 0; i < todo.length; i += batchSize) {
    const group = todo.slice(i, i + batchSize);
    const prepared = [];
    for (const token of group) {
      if (!offline) {
        const b = await readOnly(helper, 'get-binding', [Cl.uint(token.id)], payer);
        if (b.value) { skippedBound++; console.log(`  #${token.id} already inscribed, skipping`); continue; }
      }
      const url = toHttp(token.original.mediaUris[0], gateway);
      const chunks = await verifyToken(token, await fetchBytes(url));
      let feeFor = 0n, core = 0n;
      if (!offline) {
        feeFor = uintOf(await readOnly(helper, 'fee-for', [Cl.principal(payer)], payer));
        const q = await readOnly(master, 'quote-single-tx-fee', [Cl.uint(token.twin.totalSize), Cl.uint(chunks.length)], payer);
        core = BigInt(descend(q, 'total-fee').value);
      }
      totalHelperFee += feeFor; totalCore += core;
      prepared.push({ token, chunks, feeFor, core });
      console.log(`  #${token.id} ok: ${token.twin.totalSize} B, ${chunks.length} chunks, helper fee ${Number(feeFor) / 1e6} STX, core fee ${Number(core) / 1e6} STX`);
    }
    if (!execute) continue;
    if (prepared.length === 0) continue;
    const { body: acct } = await call(`/v2/accounts/${sender}?proof=0`);
    const balance = BigInt(acct.balance);
    const need = prepared.reduce((n, p) => n + p.feeFor + p.core, 0n) + maxFee * BigInt(prepared.length);
    if (balance < need) throw new Error(`balance ${Number(balance) / 1e6} STX is below the ${Number(need) / 1e6} STX this batch could need (fees capped at ${Number(maxFee) / 1e6} each)`);
    const sent = [];
    for (const p of prepared) {
      const t = await buildInscribeTx({ helper, token: p.token, chunks: p.chunks, senderKey, senderAddress: sender, nonce, capUstx: p.feeFor + p.core });
      const netFee = BigInt(t.auth.spendingCondition.fee);
      if (netFee > maxFee) throw new Error(`network fee ${netFee} exceeds --max-fee-ustx ${maxFee}; raise it or wait`);
      const res = await tx.broadcastTransaction({ transaction: t, network: 'mainnet' });
      if (res.error) throw new Error(`broadcast failed for #${p.token.id}: ${res.error} ${res.reason || ''}`);
      log({ event: 'submitted', id: p.token.id, txid: res.txid, nonce: String(nonce), networkFeeUstx: String(netFee), helperFeeUstx: String(p.feeFor), coreFeeUstx: String(p.core) });
      sent.push({ p, txid: res.txid, netFee });
      nonce += 1n;
    }
    for (const s of sent) {
      const st = await waitFor(s.txid);
      log({ event: st === 'success' ? 'confirmed' : 'failed', id: s.p.token.id, txid: s.txid, status: st });
      if (st !== 'success') throw new Error(`token ${s.p.token.id} tx ${s.txid} ended ${st}; stopping`);
      inscribed++; spent += s.p.feeFor + s.p.core + s.netFee;
    }
    console.log(`batch done: ${inscribed} inscribed so far, ~${Number(spent) / 1e6} STX spent`);
  }

  console.log('-----');
  console.log(`checked ${todo.length - skippedBound} file(s)${skippedBound ? `, ${skippedBound} already inscribed` : ''}`);
  if (!offline) console.log(`quoted helper fees ${Number(totalHelperFee) / 1e6} STX + core fees ${Number(totalCore) / 1e6} STX (network/mining fees come on top, roughly 1 STX per MB)`);
  console.log(execute ? `done: ${inscribed} inscribed, log ${basename(logPath)}` : 'dry run only: nothing was signed or broadcast');
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });

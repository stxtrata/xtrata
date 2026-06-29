/**
 * Xtrata Agent One — service core (single source of truth).
 * Importable by the CLI (deposit-service.mjs) and the HTTP API (server/server.mjs).
 * Deterministic, capped, resumable. Targets v3.2.3.
 *
 * MOCK mode (mock:true / XTRATA_MOCK=1): no network — fake quote/funding/txids so the
 * full create→status→run→deliver flow can be exercised offline (UI testing, CI).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import { bytesToHex } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import {
  makeContractCall, makeSTXTokenTransfer, broadcastTransaction, callReadOnlyFunction,
  uintCV, standardPrincipalCV, bufferCV, stringAsciiCV, listCV,
  makeStandardSTXPostCondition, FungibleConditionCode,
  PostConditionMode, AnchorMode, cvToJSON,
  getAddressFromPrivateKey, TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const CHUNK = 16384;
export const SINGLE_TX_MAX_CHUNKS = 32;
export const PERTX_MINER = 30000n;        // per-tx miner base (begin/batch/seal); a byte-rate term is added on top; all refunded if unused
export const DELIVERY_RESERVE = 200000n;  // deliver + refund tx headroom
const REFUND_TX_FEE = 5000n;
const MINT_PER_TX_CAP = BigInt(process.env.MINT_PER_TX_CAP_USTX || '2000000'); // single-tx mint miner-fee cap (2 STX)
const AGENT_FEE_PCT = Number(process.env.AGENT_FEE_PCT || '10');             // agent fee as % of the deposit
const AGENT_FEE_ADDRESS = process.env.AGENT_FEE_ADDRESS || DEPLOYER;          // agent treasury (receives the fee)
const AGENT_IDENTITY_ID = process.env.AGENT_IDENTITY_ID || null;              // agent identity NFT token-id; receipts depend on it (existence-only, never moved)
const RECEIPT_SIZE_EST = 9000;                                              // ~1-chunk receipt, for cost estimation

export const netOf = (net) => (net === 'testnet' ? new StacksTestnet() : new StacksMainnet());
const txVer = (net) => (net === 'testnet' ? TransactionVersion.Testnet : TransactionVersion.Mainnet);
const hfetch = (u, hiroKey, o = {}) => fetch(u, { ...o, headers: { ...(o.headers || {}), ...(hiroKey ? { 'x-api-key': hiroKey } : {}) } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function stxUsdPrice() {
  if (process.env.STX_USD) return Number(process.env.STX_USD);
  try { const d = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd')).json(); const p = d && d.blockstack && d.blockstack.usd; return p ? Number(p) : null; } catch { return null; }
}
const chunkBytes = (d) => { const o = []; for (let i = 0; i < d.length; i += CHUNK) o.push(d.slice(i, i + CHUNK)); return o; };
const incHash = (chunks) => { let h = new Uint8Array(32); for (const c of chunks) { const m = new Uint8Array(h.length + c.length); m.set(h, 0); m.set(c, h.length); h = sha256(m); } return h; };

export function deriveFrom(mnemonic, net = 'mainnet') {
  const c = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic.trim())).derive("m/44'/5757'/0'/0/0");
  const key = bytesToHex(c.privateKey) + '01';
  return { key, address: getAddressFromPrivateKey(key, txVer(net)) };
}
export function newWallet(net = 'mainnet') {
  const mnemonic = generateMnemonic(wordlist, 256);
  return { mnemonic, ...deriveFrom(mnemonic, net) };
}

export async function ro(core, network, fn, args = []) {
  return cvToJSON(await callReadOnlyFunction({ contractAddress: core[0], contractName: core[1], functionName: fn, functionArgs: args, senderAddress: DEPLOYER, network }));
}
async function getIdByHash(core, network, h) {
  const j = await ro(core, network, 'get-id-by-hash', [bufferCV(h)]);
  return j.value ? BigInt(j.value.value) : null;
}
export async function balance(network, addr, hiroKey) {
  const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/stx`, hiroKey)).json();
  return BigInt(d.balance || '0');
}
export async function quote(core, network, sizeBytes, chunks) {
  const single = chunks <= SINGLE_TX_MAX_CHUNKS;
  const mode = single ? 2 : 1; // MODE-SINGLE-TX=2, MODE-STAGED=1
  const t = (await ro(core, network, 'quote-inscription-fee', [uintCV(BigInt(sizeBytes)), uintCV(BigInt(chunks)), uintCV(mode)])).value.value;
  return { single, mode, protocolFee: BigInt(t['total-fee'].value), batches: Number(t['upload-batches'].value) };
}
async function waitTx(network, txid, hiroKey) {
  const u = `${network.coreApiUrl}/extended/v1/tx/${txid}`;
  for (let i = 0; i < 90; i++) {
    try { const d = await (await hfetch(u, hiroKey)).json(); if (d.tx_status === 'success') return; if (d.tx_status && d.tx_status.startsWith('abort')) throw new Error('TX ' + d.tx_status); }
    catch (e) { if (String(e).includes('TX abort')) throw e; }
    await sleep(10000);
  }
  throw new Error('not confirmed: ' + txid);
}
async function sendNft(core, network, key, fromAddr, tokenId, to, hiroKey) {
  const tx = await makeContractCall({ contractAddress: core[0], contractName: core[1], functionName: 'transfer', functionArgs: [uintCV(BigInt(tokenId)), standardPrincipalCV(fromAddr), standardPrincipalCV(to)], senderKey: key, network, postConditionMode: PostConditionMode.Allow, anchorMode: AnchorMode.Any });
  const res = await broadcastTransaction(tx, network); if (res.error) throw new Error('nft transfer: ' + res.error + ' ' + (res.reason || '')); const id = res.txid || res; await waitTx(network, id, hiroKey); return id;
}
async function sendStx(network, key, amount, to, hiroKey, fee) {
  const o = { recipient: to, amount, senderKey: key, network, anchorMode: AnchorMode.Any };
  if (fee != null) o.fee = fee;
  const tx = await makeSTXTokenTransfer(o);
  const res = await broadcastTransaction(tx, network); if (res.error) throw new Error('stx transfer: ' + res.error + ' ' + (res.reason || '')); const id = res.txid || res; await waitTx(network, id, hiroKey); return id;
}

// ---------- job state IO ----------
export const jobPath = (jobDir, id) => path.join(jobDir, `${id}.json`);
export const readJob = (jobDir, id) => JSON.parse(fs.readFileSync(jobPath(jobDir, id), 'utf8'));
export function writeJob(jobDir, j) { fs.mkdirSync(jobDir, { recursive: true }); fs.writeFileSync(jobPath(jobDir, j.jobId), JSON.stringify(j, null, 2)); return j; }
export function listJobs(jobDir) { try { return fs.readdirSync(jobDir).filter((f) => f.endsWith('.json')).map((f) => readJob(jobDir, f.replace(/\.json$/, ''))); } catch { return []; } }
/** Strip the ephemeral key before anything leaves the process (API responses, logs). */
export function publicJob(j) { const { ephemeralMnemonic, ...pub } = j; return { ...pub, hasKey: !!ephemeralMnemonic }; }

// ---------- estimate-only (no wallet, no write) ----------
export async function estimate(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', bytes, marginUstx = '0', mock = false, agentFeePct = AGENT_FEE_PCT } = opts;
  const chunks = Math.ceil(Number(bytes) / CHUNK) || 1;
  let q;
  if (mock) q = { single: chunks <= SINGLE_TX_MAX_CHUNKS, mode: chunks <= SINGLE_TX_MAX_CHUNKS ? 2 : 1, protocolFee: 100000n + BigInt(chunks) * 2000n, batches: Math.max(1, Math.ceil(chunks / SINGLE_TX_MAX_CHUNKS)) };  // mirrors single-tx-fee-unit(100000)+chunks*upload-chunk-fee-unit(2000)
  else q = await quote([DEPLOYER, coreName], netOf(net), bytes, chunks);
  // Miner reserve (auto-estimated per tx at runtime; surplus refunded). single-tx = 1 tx; staged = begin + batches + seal.
  const minerTxs = q.single ? 1 : (q.batches + 2);
  const minerReserve = BigInt(minerTxs) * PERTX_MINER + (BigInt(Math.ceil(Number(bytes))) * 3n) / 2n;
  // Second inscription: the receipt (a small ~1-chunk single-tx mint).
  const rq = mock ? { protocolFee: 102000n } : await quote([DEPLOYER, coreName], netOf(net), RECEIPT_SIZE_EST, 1);
  const receiptProtocol = rq.protocolFee;
  const receiptMiner = PERTX_MINER + (BigInt(RECEIPT_SIZE_EST) * 3n) / 2n;
  const baseCosts = q.protocolFee + minerReserve + receiptProtocol + receiptMiner + DELIVERY_RESERVE + BigInt(marginUstx);
  const pct = BigInt(agentFeePct);
  const feeExact = (pct > 0n && pct < 100n) ? (baseCosts * pct) / (100n - pct) : 0n;
  const requiredExact = baseCosts + feeExact;
  const required = ((requiredExact + 9999n) / 10000n) * 10000n;                 // round the deposit UP to the nearest 0.01 STX
  const agentFeeUstx = (pct > 0n && pct < 100n) ? (required * pct) / 100n : 0n;  // agent fee = pct% of the (rounded) deposit
  return { bytes: Number(bytes), chunks, single: q.single, batches: q.batches,
    protocolFee: q.protocolFee.toString(), minerReserve: minerReserve.toString(),
    receiptProtocol: receiptProtocol.toString(), receiptMiner: receiptMiner.toString(),
    deliveryReserve: DELIVERY_RESERVE.toString(), marginUstx: String(marginUstx),
    agentFeePct: Number(pct), agentFeeUstx: agentFeeUstx.toString(), requiredUstx: required.toString() };
}

// ---------- lifecycle ----------
export async function createJob(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', file, uri, mime = 'application/octet-stream', deps = [], user, marginUstx = '0', jobDir, mock = false, fastTrack = false, agentFeePct = AGENT_FEE_PCT, agentFeeAddress = AGENT_FEE_ADDRESS, agentIdentityId = AGENT_IDENTITY_ID } = opts;
  if (!file || !uri) throw new Error('file, uri required');
  if (!fastTrack && !user) throw new Error('delivery address (user) required unless fastTrack');
  const bytes = fs.statSync(file).size;
  const est = await estimate({ coreName, net, bytes, marginUstx, mock, agentFeePct });
  const w = newWallet(net);
  const job = {
    jobId: `job-${Date.now()}`, core: coreName, net, mock, fastTrack, file, uri, mime, deps, user: user || null,
    bytes, chunks: est.chunks, single: est.single, batches: est.batches,
    protocolFee: est.protocolFee, minerReserve: est.minerReserve,
    receiptProtocol: est.receiptProtocol, receiptMiner: est.receiptMiner,
    agentFeePct: est.agentFeePct, agentFeeAddress, agentFeeExpectedUstx: est.agentFeeUstx, agentIdentityId: agentIdentityId || null,
    margin: String(marginUstx), requiredUstx: est.requiredUstx,
    depositAddress: w.address, ephemeralMnemonic: w.mnemonic,
    status: 'AWAITING_DEPOSIT', createdAt: new Date().toISOString(),
  };
  return writeJob(jobDir, job);
}
export async function statusJob(opts) {
  const { job, hiroKey = '' } = opts; const net = job.net || 'mainnet';
  let bal = 0n;
  if (job.mock) bal = BigInt(job.requiredUstx);
  else if (job.depositAddress) bal = await balance(netOf(net), job.depositAddress, hiroKey);
  return { jobId: job.jobId, status: job.status, depositAddress: job.depositAddress, requiredUstx: job.requiredUstx, balanceUstx: bal.toString(), funded: bal >= BigInt(job.requiredUstx), tokenId: job.tokenId || null };
}
export async function runJob(opts) {
  const { job, enginePath, hiroKey = '', jobDir } = opts; const net = job.net || 'mainnet';
  if (job.mock) { const tokenId = Math.floor(1000 + Math.random() * 9000); job.tokenId = tokenId; job.depositReceivedUstx = job.requiredUstx; job.status = 'INSCRIBED'; writeJob(jobDir, job); return { tokenId, mock: true }; }
  const network = netOf(net);
  const bal = await balance(network, job.depositAddress, hiroKey);
  if (bal < BigInt(job.requiredUstx)) throw new Error(`not funded: need ${job.requiredUstx}, have ${bal}`);
  job.depositReceivedUstx = bal.toString();   // the agent fee is 10% of what actually arrived

  // Small files (<=32 chunks / ~512 KB) use the core-native single-tx mint — one cheap tx.
  if (job.single) {
    const dep = deriveFrom(job.ephemeralMnemonic, net);
    const m = await mintSingleTx({ job, network, key: dep.key, fromAddr: dep.address, hiroKey });
    job.tokenId = m.tokenId; job.mainMinerFee = m.minerFee.toString(); job.status = 'INSCRIBED'; writeJob(jobDir, job);
    return { tokenId: m.tokenId, route: 'single-tx' };
  }

  // Larger files stage through the runway engine (begin -> add-chunk-batch -> seal).
  const ep = path.resolve(enginePath);
  if (!fs.existsSync(ep)) throw new Error(`staged-upload engine not found at ${ep} — ensure agent-large-inscribe.mjs is in the project (or set ENGINE)`);
  const env = { ...process.env, WALLET_MNEMONIC: job.ephemeralMnemonic, DRY_RUN: '0', REQUIRE_CONFIRM: '0', LARGE_FILE: job.file, LARGE_URI: job.uri, LARGE_MIME: job.mime, LARGE_DEPS: (job.deps || []).join(','), HIRO_API_KEY: hiroKey };
  const r = spawnSync('node', [ep], { stdio: 'inherit', env, cwd: path.dirname(ep) });
  if (r.status !== 0) throw new Error('engine failed with status ' + r.status);
  const mapPath = path.join(path.dirname(ep), 'large-map.json');
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const tokenId = map[job.uri] && map[job.uri].tokenId;
  job.tokenId = tokenId; job.status = 'INSCRIBED'; writeJob(jobDir, job);
  return { tokenId, route: 'staged' };
}

export async function mintFile({ core, network, key, fromAddr, hiroKey, data, mime, uri, deps = [], spendCap }) {
  const chunks = chunkBytes(data);
  if (chunks.length === 0) throw new Error('empty file');
  if (chunks.length > SINGLE_TX_MAX_CHUNKS) throw new Error(`${chunks.length} chunks exceeds single-tx max ${SINGLE_TX_MAX_CHUNKS}`);
  const h = incHash(chunks);
  const depCVs = deps.map((d) => uintCV(BigInt(d)));
  const fn = depCVs.length ? 'mint-single-tx-recursive' : 'mint-single-tx';
  const args = [bufferCV(h), stringAsciiCV(mime), uintCV(BigInt(data.length)), listCV(chunks.map((c) => bufferCV(c))), stringAsciiCV(uri)];
  if (depCVs.length) args.push(listCV(depCVs));
  const tx = await makeContractCall({ contractAddress: core[0], contractName: core[1], functionName: fn, functionArgs: args, senderKey: key, network, postConditionMode: PostConditionMode.Deny, postConditions: [makeStandardSTXPostCondition(fromAddr, FungibleConditionCode.LessEqual, spendCap)], anchorMode: AnchorMode.Any });
  const usedFee = BigInt(tx.auth.spendingCondition.fee.toString());
  if (usedFee > MINT_PER_TX_CAP) throw new Error(`mint miner fee ${usedFee} exceeds cap ${MINT_PER_TX_CAP} (raise MINT_PER_TX_CAP_USTX if mempool is busy)`);
  const res = await broadcastTransaction(tx, network);
  if (res.error) throw new Error('mint broadcast: ' + res.error + ' ' + (res.reason || ''));
  const txid = res.txid || res;
  await waitTx(network, txid, hiroKey);
  const id = await getIdByHash(core, network, h);
  return { tokenId: id ? id.toString() : null, minerFee: usedFee, txid };
}
async function mintSingleTx({ job, network, key, fromAddr, hiroKey }) {
  const data = new Uint8Array(fs.readFileSync(job.file));
  return mintFile({ core: [DEPLOYER, job.core], network, key, fromAddr, hiroKey, data, mime: job.mime, uri: job.uri, deps: job.deps || [], spendCap: BigInt(job.protocolFee) });
}
async function inscribeReceipt({ core, network, key, fromAddr, hiroKey, html, uri, deps }) {
  const data = new TextEncoder().encode(html);
  const q = await quote(core, network, data.length, chunkBytes(data).length);   // exact single-tx fee for the receipt
  return mintFile({ core, network, key, fromAddr, hiroKey, data, mime: 'text/html', uri, deps, spendCap: q.protocolFee });
}
// ---------- receipt ----------
const ustxToStx = (u) => (Number(u) / 1e6).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
function receiptData(job, x) {
  const received = BigInt(x.received);
  const mainMiner = x.mainMinerFee != null ? BigInt(x.mainMinerFee) : (job.mainMinerFee ? BigInt(job.mainMinerFee) : BigInt(job.minerReserve));
  const fileProtocol = BigInt(job.protocolFee);
  const receiptProtocol = BigInt(job.receiptProtocol || '0');
  const receiptMiner = x.receiptMinerFee != null ? BigInt(x.receiptMinerFee) : BigInt(job.receiptMiner || '0');
  const agentFee = BigInt(x.agentFee);
  const change = x.change != null ? BigInt(x.change) : (received - fileProtocol - mainMiner - receiptProtocol - receiptMiner - agentFee);
  const changeR = change > 0n ? change : 0n;
  const totalPaid = received - changeR;
  // Network fee = everything left after protocol + receipt + agent + change, so the
  // receipt always reconciles (this captures ALL miner fees incl. the delivery/refund txs).
  let networkFee = received - fileProtocol - receiptProtocol - agentFee - changeR;
  if (networkFee < 0n) networkFee = 0n;
  const stxUsd = (x.stxUsd != null) ? Number(x.stxUsd) : null;
  const totalPaidUsd = stxUsd != null ? (Number(totalPaid) / 1e6 * stxUsd).toFixed(2) : null;
  return {
    jobId: job.jobId, core: job.core, date: new Date().toISOString(),
    uri: job.uri, mime: job.mime, bytes: job.bytes, chunks: job.chunks, single: job.single,
    tokenId: job.tokenId, receiptTokenId: x.receiptTokenId || null, recipient: job.user, agentIdentityId: job.agentIdentityId || null,
    depositReceived: received.toString(), xtrataProtocol: fileProtocol.toString(), receiptProtocol: receiptProtocol.toString(),
    networkFee: networkFee.toString(), agentFeePct: Number(job.agentFeePct ?? AGENT_FEE_PCT),
    agentFee: agentFee.toString(), changeReturned: changeR.toString(),
    totalPaid: totalPaid.toString(), stxUsd, totalPaidUsd,
  };
}
function buildReceiptHtml(d) {
  const row = (k, v) => `<div class="r"><span>${k}</span><span>${v}</span></div>`;
  const stxr = (u) => ustxToStx(u) + ' STX';
  const short = (s) => s ? (s.length > 18 ? s.slice(0, 9) + '…' + s.slice(-6) : s) : '—';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Xtrata Agent One — Receipt ${d.jobId}</title><style>
:root{--bg:#0b0e14;--pan:#121826;--line:#243044;--ink:#e9eff8;--mut:#8ea0bd;--acc:#3ea6ff;--acc2:#7c5cff;--ok:#3ddc97;--mono:ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(820px 420px at 80% -10%,rgba(124,92,255,.14),transparent),var(--bg);color:var(--ink);font:14px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:560px;margin:0 auto;padding:34px 20px}.card{background:var(--pan);border:1px solid var(--line);border-radius:16px;padding:24px}
.h{display:flex;align-items:center;justify-content:space-between;gap:10px}.logo{font-weight:800;letter-spacing:.4px}.logo b{color:var(--acc)}.logo i{color:var(--acc2);font-style:normal}
.badge{font-size:11px;color:var(--ok);border:1px solid #1f5a45;border-radius:999px;padding:3px 10px}
.sub{color:var(--mut);font-size:12px;margin:4px 0 18px}h1{font-size:15px;margin:18px 0 8px}
.r{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dashed var(--line);font-size:13px}
.r:last-child{border-bottom:0}.r span:first-child{color:var(--mut)}.r span:last-child{font-family:var(--mono);text-align:right;word-break:break-all}
.tot{margin-top:10px;padding-top:12px;border-top:1px solid var(--line)}.tot .r span:last-child{color:var(--acc);font-size:15px}
.fee span:last-child{color:var(--acc2)}.tok{color:var(--ok)}.foot{color:var(--mut);font-size:11px;margin-top:18px;text-align:center}
</style></head><body><div class="wrap"><div class="card">
<div class="h"><div class="logo"><b>XTRATA</b> <i>Agent One</i></div><span class="badge">✓ Inscribed</span></div>
<div class="sub">Inscription receipt · ${d.date.slice(0, 19).replace('T', ' ')} UTC</div>
<h1>What was inscribed</h1>
${row('Content URI', d.uri)}${row('Type', d.mime)}
${row('Size', (d.bytes / 1048576).toFixed(3) + ' MiB · ' + Number(d.bytes).toLocaleString() + ' B')}
${row('Chunks', d.chunks + (d.single ? ' · single-tx' : ' · staged'))}
${row('Inscription token', '<span class="tok">#' + (d.tokenId ?? '—') + '</span>')}
${row('Receipt token', d.receiptTokenId ? ('<span class="tok">#' + d.receiptTokenId + '</span>') : 'this inscription')}
${row('Delivered to', short(d.recipient))}
${d.agentIdentityId ? row('Issued by', 'Agent One · identity <span class="tok">#' + d.agentIdentityId + '</span>') : ''}
<h1>Cost breakdown</h1>
${row('Deposit received', stxr(d.depositReceived))}
${row('Xtrata protocol fee', stxr(d.xtrataProtocol))}
${row('Receipt inscription', stxr(d.receiptProtocol))}
${row('Network (miner) fee', stxr(d.networkFee))}
<div class="fee">${row('Agent fee (' + d.agentFeePct + '%)', stxr(d.agentFee))}</div>
${row('Change returned to you', stxr(d.changeReturned))}
<div class="tot">${row('Total paid', stxr(d.totalPaid) + (d.totalPaidUsd ? ' · ~$' + d.totalPaidUsd + ' USD' : ''))}</div>
<div class="foot">Core ${d.core} · job ${d.jobId}${d.stxUsd ? ' · STX $' + d.stxUsd : ''} · settled on Bitcoin via Stacks</div>
</div></div></body></html>`;
}
function saveReceiptHtml(receiptsDir, jobId, html) {
  if (!receiptsDir) return null;
  fs.mkdirSync(receiptsDir, { recursive: true });
  const p = path.join(receiptsDir, `${jobId}.html`);
  fs.writeFileSync(p, html); return p;
}

export async function deliverJob(opts) {
  const { job, hiroKey = '', jobDir, receiptsDir } = opts; const net = job.net || 'mainnet';
  if (!job.tokenId) throw new Error('no tokenId yet — run the inscribe step first');
  const pct = BigInt(job.agentFeePct ?? AGENT_FEE_PCT);
  const received = BigInt(job.depositReceivedUstx || job.requiredUstx);
  const agentFee = pct > 0n ? (received * pct) / 100n : 0n;
  const stxUsd = await stxUsdPrice();

  if (job.mock) {
    const receiptTokenId = String(Math.floor(1000 + Math.random() * 9000));
    const d = receiptData(job, { received, agentFee, receiptTokenId, stxUsd });
    saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(d));
    const receipt = { ...d, deliverTx: '0xMOCK_DELIVER', receiptDeliverTx: '0xMOCK_RECEIPT', agentFeeTx: '0xMOCK_FEE', refundTx: '0xMOCK_REFUND' };
    Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), refundedUstx: d.changeReturned, receipt });
    delete job.ephemeralMnemonic; job.status = 'COMPLETE'; writeJob(jobDir, job);
    return { receipt, mock: true };
  }

  const dep = deriveFrom(job.ephemeralMnemonic, net); const core = [DEPLOYER, job.core]; const network = netOf(net);
  const prelim = receiptData(job, { received, agentFee, receiptTokenId: null, stxUsd });
  const idDep = job.agentIdentityId || AGENT_IDENTITY_ID;
  const receiptDeps = idDep ? [job.tokenId, idDep] : [job.tokenId];   // file + agent identity (existence-only links, no transfers)
  const r = await inscribeReceipt({ core, network, key: dep.key, fromAddr: dep.address, hiroKey, html: buildReceiptHtml(prelim), uri: `xtrata:receipt/${job.jobId}`, deps: receiptDeps });
  const receiptTokenId = r.tokenId;
  const deliverTx = await sendNft(core, network, dep.key, dep.address, job.tokenId, job.user, hiroKey);
  const receiptDeliverTx = await sendNft(core, network, dep.key, dep.address, receiptTokenId, job.user, hiroKey);
  let agentFeeTx = null;
  if (agentFee > 0n) agentFeeTx = await sendStx(network, dep.key, agentFee, job.agentFeeAddress || AGENT_FEE_ADDRESS, hiroKey);
  const bal = await balance(network, job.depositAddress, hiroKey);
  const refund = bal > REFUND_TX_FEE ? bal - REFUND_TX_FEE : 0n;
  let refundTx = null;
  if (refund > 0n) refundTx = await sendStx(network, dep.key, refund, job.user, hiroKey, REFUND_TX_FEE);
  const finalD = receiptData(job, { received, agentFee, receiptTokenId, change: refund, mainMinerFee: job.mainMinerFee, receiptMinerFee: r.minerFee.toString(), stxUsd });
  saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(finalD));
  const receipt = { ...finalD, deliverTx, receiptDeliverTx, agentFeeTx, refundTx };
  Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), deliverTx, receiptDeliverTx, agentFeeTx, refundTx, refundedUstx: refund.toString(), receipt });
  delete job.ephemeralMnemonic; job.status = 'COMPLETE'; writeJob(jobDir, job);
  return { receipt };
}

// Who funded the deposit address? Returns the sender principal of the inbound STX.
export async function detectFunder(network, addr, hiroKey = '') {
  try {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/stx_inbound?limit=20`, hiroKey)).json();
    const inbound = (d.results || []).filter((r) => r.sender && BigInt(r.amount || '0') > 0n);
    if (inbound.length) return inbound[0].sender;
  } catch {}
  try {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/transactions?limit=20`, hiroKey)).json();
    for (const r of (d.results || [])) { const tx = r.tx || r; if (tx.token_transfer && tx.token_transfer.recipient_address === addr && tx.sender_address) return tx.sender_address; }
  } catch {}
  return null;
}

// Fast-track auto-pilot: detect funder -> inscribe -> deliver + refund + wipe, persisting each phase.
export async function autoRunJob(opts) {
  const { job, enginePath, hiroKey = '', jobDir, receiptsDir, onPhase } = opts;
  const net = job.net || 'mainnet'; const network = netOf(net);
  const phase = (status) => { job.status = status; writeJob(jobDir, job); if (onPhase) { try { onPhase(status, job); } catch {} } };
  if (!job.user) {
    const funder = job.mock ? 'SP_MOCK_SENDER' : await detectFunder(network, job.depositAddress, hiroKey);
    if (!funder) throw new Error('could not determine the sending address to return to');
    job.user = funder; writeJob(jobDir, job);
  }
  phase('INSCRIBING');
  await runJob({ job, enginePath, hiroKey, jobDir });   // sets tokenId + status INSCRIBED
  phase('DELIVERING');
  const r = await deliverJob({ job, hiroKey, jobDir, receiptsDir });  // receipt + deliver both + agent fee + refund + wipe
  return { tokenId: job.tokenId, receipt: r.receipt, user: job.user };
}

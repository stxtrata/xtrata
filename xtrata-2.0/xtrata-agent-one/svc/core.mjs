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
import { spawn } from 'node:child_process';
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
import { convertToOpusWebm, isConvertibleAudio } from './opus-convert.mjs';
import { buildSunoPlayer } from './suno-player.mjs';

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
const PARENT_RETURN_FEE = 30000n;                                            // per-parent NFT return-transfer reserve
const ITEM_DELIVERY_FEE = 30000n;                                            // per extra batch-item delivery transfer reserve
export const MAX_BATCH_ITEMS = 40;                                           // receipt deps cap 50 − parents/identity headroom
export const JOB_WINDOW_MS = Number(process.env.AGENT_JOB_WINDOW_MS || '300000');  // 5 min: commence-or-cancel + no-progress stall window
export const PARENT_WINDOW_MS = Number(process.env.AGENT_PARENT_WINDOW_MS || '900000'); // 15 min after funding for the parent NFT(s) to arrive, else full refund
export const EXPIRE_GRACE_MS = Number(process.env.AGENT_EXPIRE_GRACE_MS || String(48 * 3600 * 1000));  // 48 h: how long an EXPIRED (never-funded) job keeps its key so a late payment is never stranded

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
async function ownerOf(core, network, id) {
  try { const o = await ro(core, network, 'get-owner', [uintCV(BigInt(id))]); const v = o.value && o.value.value; return v ? (v.value ?? v) : null; } catch { return null; }
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
  // Nakamoto-aware: poll fast (2 s) for the first ~90 s, then 6 s. Same ~16-min ceiling as before.
  for (let i = 0; i < 210; i++) {
    try { const d = await (await hfetch(u, hiroKey)).json(); if (d.tx_status === 'success') return; if (d.tx_status && d.tx_status.startsWith('abort')) throw new Error('TX ' + d.tx_status); }
    catch (e) { if (String(e).includes('TX abort')) throw e; }
    await sleep(i < 45 ? 2000 : 6000);
  }
  throw new Error('not confirmed: ' + txid);
}
export async function sendNft(core, network, key, fromAddr, tokenId, to, hiroKey) {
  const tx = await makeContractCall({ contractAddress: core[0], contractName: core[1], functionName: 'transfer', functionArgs: [uintCV(BigInt(tokenId)), standardPrincipalCV(fromAddr), standardPrincipalCV(to)], senderKey: key, network, postConditionMode: PostConditionMode.Allow, anchorMode: AnchorMode.Any });
  const res = await broadcastTransaction(tx, network); if (res.error) throw new Error('nft transfer: ' + res.error + ' ' + (res.reason || '')); const id = res.txid || res; await waitTx(network, id, hiroKey); return id;
}
async function sendStx(network, key, amount, to, hiroKey, fee) {
  const o = { recipient: to, amount, senderKey: key, network, anchorMode: AnchorMode.Any };
  if (fee != null) o.fee = fee;
  const tx = await makeSTXTokenTransfer(o);
  const res = await broadcastTransaction(tx, network); if (res.error) throw new Error('stx transfer: ' + res.error + ' ' + (res.reason || '')); const id = res.txid || res; await waitTx(network, id, hiroKey); return id;
}
// Broadcast failures that are transient during the post-confirmation balance-settle window — worth retrying.
const TRANSIENT_TX = /NotEnoughFunds|ConflictingNonceInMempool|TooMuchChaining|too much chaining|bad nonce|NoSuchAccount/i;
const errMsg = (e) => String((e && e.message) || e);
const addrEq = (a, b) => !!a && !!b && String(a).trim() === String(b).trim();   // Stacks c32 addresses are case-sensitive → exact compare
// Source of truth for "who paid": the on-chain inbound sender. ALL refunds/change return here, never a
// preset delivery address — so money can only ever go back to the wallet it came from.
async function resolveFunder(job, network, hiroKey) {
  if (job.mock) return job.funder || 'SP_MOCK_SENDER';
  if (job.funder) return job.funder;
  try { return await detectFunder(network, job.depositAddress, hiroKey); } catch { return null; }
}
// Retry a FIXED-amount STX transfer through the settle race (e.g. NotEnoughFunds right after a confirm).
async function sendStxRetry(network, key, amount, to, hiroKey, fee, tries = 4) {
  let last; for (let i = 0; i < tries; i++) {
    try { return await sendStx(network, key, amount, to, hiroKey, fee); }
    catch (e) { last = e; if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e))) { await sleep(8000); continue; } throw e; }
  } throw last;
}
// Return ALL spendable STX (balance − fee) to `to`, retrying through the settle race. Never sends dust.
// This is the robust replacement for a one-shot "send balance−fee" that can race NotEnoughFunds.
async function sweepStxTo(network, key, fromAddr, to, hiroKey, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    let bal = 0n; try { bal = await balance(network, fromAddr, hiroKey); } catch (e) { last = e; await sleep(5000); continue; }
    if (bal <= REFUND_TX_FEE) return { sent: false, amount: '0', balance: bal.toString() };
    const amount = bal - REFUND_TX_FEE;
    try { const tx = await sendStx(network, key, amount, to, hiroKey, REFUND_TX_FEE); return { sent: true, tx, amount: amount.toString() }; }
    catch (e) { last = e; if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e))) { await sleep(8000); continue; } throw e; }
  }
  throw last || new Error('sweep failed');
}

// ---------- job state IO ----------
export const jobPath = (jobDir, id) => path.join(jobDir, `${id}.json`);
export const readJob = (jobDir, id) => JSON.parse(fs.readFileSync(jobPath(jobDir, id), 'utf8'));
export function writeJob(jobDir, j) { fs.mkdirSync(jobDir, { recursive: true }); fs.writeFileSync(jobPath(jobDir, j.jobId), JSON.stringify(j, null, 2)); return j; }
export function listJobs(jobDir) { try { return fs.readdirSync(jobDir).filter((f) => f.endsWith('.json')).map((f) => readJob(jobDir, f.replace(/\.json$/, ''))); } catch { return []; } }
/** Strip the ephemeral key before anything leaves the process (API responses, logs). */
export function publicJob(j) { const { ephemeralMnemonic, ...pub } = j; return { ...pub, hasKey: !!ephemeralMnemonic }; }
/**
 * Delete a finished job's state (and its receipt) so the UI can "forget" it.
 * SAFE-BY-DEFAULT: refuses if the job still holds a deposit key, or isn't in a
 * terminal/receipted state (COMPLETE or CANCELLED) — so an in-flight or funded job
 * (which may still control STX) can never be deleted from the UI.
 */
export function deleteJob({ jobDir, id, receiptsDir }) {
  const job = readJob(jobDir, id);                                          // throws if missing
  if (job.ephemeralMnemonic) throw new Error('refusing to delete: job still holds a deposit key — deliver or recover it first');
  if (!['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED'].includes(job.status)) throw new Error(`refusing to delete: job is ${job.status}, not a finished (receipted) job`);
  try { fs.unlinkSync(jobPath(jobDir, id)); } catch (e) { throw new Error('could not delete job state: ' + ((e && e.message) || e)); }
  if (receiptsDir) { try { fs.unlinkSync(path.join(receiptsDir, `${id}.html`)); } catch {} }
  return { deleted: true, jobId: id };
}

// ---------- estimate-only (no wallet, no write) ----------
export async function estimate(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', bytes, marginUstx = '0', mock = false, agentFeePct = AGENT_FEE_PCT, parentCount = 0 } = opts;
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
  // Parent escrow: one extra NFT-return transfer per parent (parent goes home to the sender at delivery).
  const parentReserve = BigInt(parentCount) * PARENT_RETURN_FEE;
  const baseCosts = q.protocolFee + minerReserve + receiptProtocol + receiptMiner + parentReserve + DELIVERY_RESERVE + BigInt(marginUstx);
  const pct = BigInt(agentFeePct);
  const feeExact = (pct > 0n && pct < 100n) ? (baseCosts * pct) / (100n - pct) : 0n;
  const requiredExact = baseCosts + feeExact;
  const required = ((requiredExact + 9999n) / 10000n) * 10000n;                 // round the deposit UP to the nearest 0.01 STX
  const agentFeeUstx = (pct > 0n && pct < 100n) ? (required * pct) / 100n : 0n;  // agent fee = pct% of the (rounded) deposit
  const stxUsd = await stxUsdPrice();   // live STX/USD so the quote can show $ alongside STX
  return { bytes: Number(bytes), chunks, single: q.single, batches: q.batches,
    protocolFee: q.protocolFee.toString(), minerReserve: minerReserve.toString(),
    receiptProtocol: receiptProtocol.toString(), receiptMiner: receiptMiner.toString(),
    deliveryReserve: DELIVERY_RESERVE.toString(), parentCount: Number(parentCount), parentReserve: parentReserve.toString(), marginUstx: String(marginUstx),
    agentFeePct: Number(pct), agentFeeUstx: agentFeeUstx.toString(), requiredUstx: required.toString(), stxUsd };
}

/**
 * Batch estimate: N files, ONE deposit, ONE receipt. Per-item protocol+miner quotes are
 * summed; shared overhead (receipt, parent returns, deliveries, agent fee) is added once.
 */
export async function estimateBatch(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', itemsBytes = [], parentCount = 0, marginUstx = '0', mock = false, agentFeePct = AGENT_FEE_PCT } = opts;
  if (!itemsBytes.length) throw new Error('itemsBytes required');
  if (itemsBytes.length > MAX_BATCH_ITEMS) throw new Error(`batch too large: ${itemsBytes.length} items (max ${MAX_BATCH_ITEMS})`);
  const network = netOf(net);
  const items = [];
  let sumProtocol = 0n, sumMiner = 0n;
  for (const bytes of itemsBytes) {
    const chunks = Math.ceil(Number(bytes) / CHUNK) || 1;
    let q;
    if (mock) q = { single: chunks <= SINGLE_TX_MAX_CHUNKS, batches: Math.max(1, Math.ceil(chunks / SINGLE_TX_MAX_CHUNKS)), protocolFee: 100000n + BigInt(chunks) * 2000n };
    else q = await quote([DEPLOYER, coreName], network, bytes, chunks);
    const minerTxs = q.single ? 1 : (q.batches + 2);
    const minerReserve = BigInt(minerTxs) * PERTX_MINER + (BigInt(Math.ceil(Number(bytes))) * 3n) / 2n;
    items.push({ bytes: Number(bytes), chunks, single: q.single, batches: q.batches, protocolFee: q.protocolFee.toString(), minerReserve: minerReserve.toString() });
    sumProtocol += q.protocolFee; sumMiner += minerReserve;
  }
  const rq = mock ? { protocolFee: 102000n } : await quote([DEPLOYER, coreName], network, RECEIPT_SIZE_EST, 1);
  const receiptProtocol = rq.protocolFee;
  const receiptMiner = PERTX_MINER + (BigInt(RECEIPT_SIZE_EST) * 3n) / 2n;
  const parentReserve = BigInt(parentCount) * PARENT_RETURN_FEE;
  const deliveryReserve = DELIVERY_RESERVE + BigInt(Math.max(0, itemsBytes.length - 1)) * ITEM_DELIVERY_FEE;   // N token sends + receipt + change
  const baseCosts = sumProtocol + sumMiner + receiptProtocol + receiptMiner + parentReserve + deliveryReserve + BigInt(marginUstx);
  const pct = BigInt(agentFeePct);
  const feeExact = (pct > 0n && pct < 100n) ? (baseCosts * pct) / (100n - pct) : 0n;
  const required = (((baseCosts + feeExact) + 9999n) / 10000n) * 10000n;
  const agentFeeUstx = (pct > 0n && pct < 100n) ? (required * pct) / 100n : 0n;
  const stxUsd = await stxUsdPrice();
  return { items, count: itemsBytes.length,
    sumProtocol: sumProtocol.toString(), sumMiner: sumMiner.toString(),
    receiptProtocol: receiptProtocol.toString(), receiptMiner: receiptMiner.toString(),
    parentCount: Number(parentCount), parentReserve: parentReserve.toString(), deliveryReserve: deliveryReserve.toString(),
    marginUstx: String(marginUstx), agentFeePct: Number(pct), agentFeeUstx: agentFeeUstx.toString(),
    requiredUstx: required.toString(), stxUsd };
}

// ---------- lifecycle ----------
export async function createJob(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', file, uri, mime = 'application/octet-stream', deps = [], parents = [], user, recipient = null, expectedFunder = null, marginUstx = '0', jobDir, mock = false, fastTrack = false, agentFeePct = AGENT_FEE_PCT, agentFeeAddress = AGENT_FEE_ADDRESS, agentIdentityId = AGENT_IDENTITY_ID, suno = false } = opts;
  if (!file || !uri) throw new Error('file, uri required');
  if (!fastTrack && !user) throw new Error('delivery address (user) required unless fastTrack');
  // PARENT LINKING (escrow model): the contract requires the MINTER to own the parents at mint/seal
  // (validate-parents → ERR-NOT-AUTHORIZED), so the user must send the parent inscription(s) to the
  // deposit wallet along with the STX payment. They are returned to the sender with the child + change.
  const parentIds = (parents || []).map((p) => String(p).trim()).filter(Boolean);
  if (parentIds.some((p) => !/^\d+$/.test(p))) throw new Error('parents must be token-id uints');
  if (new Set(parentIds).size !== parentIds.length) throw new Error('duplicate parent token ids');
  if (parentIds.length > 50) throw new Error('at most 50 parents');
  const bytes = fs.statSync(file).size;
  // DUPLICATE-HASH GUARD: the contract rejects re-inscribing an identical hash — check BEFORE creating
  // the job / taking payment, so identical content is never paid for twice.
  if (!mock) {
    const h = incHash(chunkBytes(new Uint8Array(fs.readFileSync(file))));
    const existing = await getIdByHash([DEPLOYER, coreName], netOf(net), h);
    if (existing != null) throw new Error(`this exact content is already inscribed on-chain as token #${existing} — inscribing an identical hash is blocked; no job was created`);
    // Parent sanity BEFORE taking payment: every declared parent must exist on-chain. Catches typos
    // up-front so the user is never asked to send a non-existent (or wrong-contract) inscription.
    for (const pid of parentIds) {
      const owner = await ownerOf([DEPLOYER, coreName], netOf(net), pid);
      if (!owner) throw new Error(`parent token #${pid} does not exist on ${coreName} — no job was created`);
    }
  }
  const est = await estimate({ coreName, net, bytes, marginUstx, mock, agentFeePct, parentCount: parentIds.length });
  // Staged (large-file) route seals via the engine, which supports a single parent per seal.
  if (!est.single && parentIds.length > 1) throw new Error('large (staged) inscriptions support at most 1 parent — split the job or use a file ≤ 512 KiB for multi-parent');
  const w = newWallet(net);
  const job = {
    jobId: `job-${Date.now()}`, core: coreName, net, mock, fastTrack, suno, file, uri, mime, deps, parents: parentIds, user: user || null, recipient: recipient || user || null,
    expectedFunder: expectedFunder || null, funder: null,
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
/**
 * BATCH job: N inscriptions, ONE payment, ONE receipt.
 *  - `items`: [{ file, uri, mime, deps, parents, suno, artworkFile }] (≤ MAX_BATCH_ITEMS)
 *  - `parents` (job-level) are linked to EVERY item; per-item parents merge on top.
 *    All distinct parents are escrowed once at the deposit wallet and returned after the batch.
 *  - deps may reference earlier batch items as '@k' (k < item index) — resolved to the
 *    real token id after item k mints, so whole dependency graphs ship in one payment.
 */
export async function createBatchJob(opts) {
  const { coreName = 'xtrata-v3-2-3', net = 'mainnet', items = [], parents = [], user, recipient = null, expectedFunder = null, marginUstx = '0', jobDir, mock = false, fastTrack = false, strict = false, agentFeePct = AGENT_FEE_PCT, agentFeeAddress = AGENT_FEE_ADDRESS, agentIdentityId = AGENT_IDENTITY_ID } = opts;
  if (!Array.isArray(items) || !items.length) throw new Error('items required');
  if (items.length > MAX_BATCH_ITEMS) throw new Error(`batch too large: ${items.length} items (max ${MAX_BATCH_ITEMS})`);
  if (!fastTrack && !user) throw new Error('delivery address (user) required unless fastTrack');
  const core = [DEPLOYER, coreName]; const network = netOf(net);
  const validIds = (list, what) => {
    const ids = (list || []).map((p) => String(p).trim()).filter(Boolean);
    if (ids.some((p) => !/^\d+$/.test(p))) throw new Error(`${what} must be token-id uints`);
    return ids;
  };
  const sharedParents = validIds(parents, 'parents');
  const seenHashes = new Set();
  const built = [];
  for (let i = 0; i < items.length; i += 1) {
    const it = items[i] || {};
    if (!it.file || !it.uri) throw new Error(`item ${i}: file, uri required`);
    if (!fs.existsSync(it.file)) throw new Error(`item ${i}: file not found: ${it.file}`);
    const itemParents = validIds(it.parents, `item ${i} parents`);
    // deps: plain token ids or '@k' intra-batch references (must point BACKWARD to keep order sane)
    const deps = (it.deps || []).map((d) => String(d).trim()).filter(Boolean);
    for (const d of deps) {
      if (/^@\d+$/.test(d)) { const k = Number(d.slice(1)); if (!(k >= 0 && k < i)) throw new Error(`item ${i}: dep '${d}' must reference an EARLIER item (0..${i - 1})`); }
      else if (!/^\d+$/.test(d)) throw new Error(`item ${i}: deps must be token-id uints or '@k' item refs`);
    }
    const bytes = fs.statSync(it.file).size;
    if (!mock) {
      const h = incHash(chunkBytes(new Uint8Array(fs.readFileSync(it.file))));
      const hHex = Buffer.from(h).toString('hex');
      if (seenHashes.has(hHex)) throw new Error(`item ${i}: duplicate content inside the batch — identical hashes cannot both inscribe`);
      seenHashes.add(hHex);
      const existing = await getIdByHash(core, network, h);
      if (existing != null) throw new Error(`item ${i}: this exact content is already inscribed as token #${existing} — no job was created`);
    }
    built.push({ idx: i, file: it.file, uri: String(it.uri), mime: it.mime || 'application/octet-stream', deps, parents: itemParents, suno: !!it.suno, artworkFile: it.artworkFile || null, bytes, status: 'PENDING', tokenId: null, error: null });
  }
  // Distinct parents across the whole batch — escrowed once, returned once.
  const allParents = [...new Set([...sharedParents, ...built.flatMap((b) => b.parents)])];
  if (allParents.length > 45) throw new Error('too many distinct parents for one batch (max 45)');
  if (!mock) for (const pid of allParents) {
    const owner = await ownerOf(core, network, pid);
    if (!owner) throw new Error(`parent token #${pid} does not exist on ${coreName} — no job was created`);
  }
  const est = await estimateBatch({ coreName, net, itemsBytes: built.map((b) => b.bytes), parentCount: allParents.length, marginUstx, mock, agentFeePct });
  for (let i = 0; i < built.length; i += 1) Object.assign(built[i], {
    chunks: est.items[i].chunks, single: est.items[i].single, batches: est.items[i].batches,
    protocolFee: est.items[i].protocolFee, minerReserve: est.items[i].minerReserve,
  });
  // Staged engine seals with a single parent — enforce per staged item (merged parent list).
  for (const b of built) {
    const merged = [...new Set([...sharedParents, ...b.parents])];
    if (!b.single && merged.length > 1) throw new Error(`item ${b.idx}: large (staged) inscriptions support at most 1 parent`);
  }
  const w = newWallet(net);
  const job = {
    jobId: `job-${Date.now()}`, core: coreName, net, mock, fastTrack, strict: !!strict,
    items: built, batchProgress: { current: 0, total: built.length },
    sharedParents, parents: allParents,               // job.parents = the ESCROW list (gates, returns, receipts)
    user: user || null, recipient: recipient || user || null, expectedFunder: expectedFunder || null, funder: null,
    bytes: built.reduce((s, b) => s + b.bytes, 0), chunks: built.reduce((s, b) => s + b.chunks, 0),
    sumProtocol: est.sumProtocol, sumMiner: est.sumMiner,
    protocolFee: est.sumProtocol, minerReserve: est.sumMiner,   // aliases so shared refund/receipt maths keep working
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
  const funded = bal >= BigInt(job.requiredUstx);
  // "Payment seen" (mempool) — UI signal only; money decisions still gate on the confirmed balance.
  let pending = false;
  if (!funded && !job.mock && job.depositAddress && job.status === 'AWAITING_DEPOSIT') {
    try { pending = await hasPendingInbound(netOf(net), job.depositAddress, hiroKey, false); } catch {}
  }
  // Parent escrow gate — a parented job is runnable only when funded AND all parents are held.
  let parents = null;
  if ((job.parents || []).length && ['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED'].includes(job.status)) {
    try { parents = await parentsStatus(job, hiroKey); } catch {}
  }
  const batch = job.items ? { current: (job.batchProgress || {}).current || 0, total: job.items.length, items: job.items.map((i) => ({ idx: i.idx, uri: i.uri, status: i.status, tokenId: i.tokenId || null, error: i.error || null })) } : null;
  return { jobId: job.jobId, status: job.status, depositAddress: job.depositAddress, requiredUstx: job.requiredUstx, balanceUstx: bal.toString(), funded, pending, parents, batch, tokenId: job.tokenId || null };
}
/** Adopt a prepared asset as the thing to inscribe and re-derive the chunk/route plan. */
function adoptAsset(job, file, mime, bytes) {
  job.file = file; job.mime = mime; job.bytes = bytes;
  job.chunks = Math.ceil(bytes / CHUNK) || 1;
  job.single = job.chunks <= SINGLE_TX_MAX_CHUNKS;
  job.batches = Math.max(1, Math.ceil(job.chunks / SINGLE_TX_MAX_CHUNKS));
}

/**
 * Audio asset preparation — the opus tool + player, automated. The instant a job is
 * funded (runJob), BEFORE inscription:
 *   1. transcode audio → Opus-in-WebM (Music HQ, svc/opus-convert.mjs);
 *   2. if job.suno, combine that Opus with the source's embedded cover art + title/
 *      artist into a self-contained HTML **player** (svc/suno-player.mjs — the exact
 *      opus-file-generator template) and inscribe THAT instead of the bare audio.
 * The adopted asset's chunk/route plan is re-derived from its new size. The deposit
 * was sized for the (larger) original, so any surplus returns as change on delivery.
 *
 * FAIL-SAFE layering (never throws): SUNO player → plain Opus → original file. Each
 * outcome is recorded on job.audioOptimize / job.sunoPlayer for the receipt + UI.
 * Idempotent via job.assetPrepared (resume-safe across restarts).
 */
async function optimizeAudioForInscription(job, jobDir, target = job) {
  // `target` = the job itself (single-item flow) or ONE batch item — same pipeline,
  // per-target bookkeeping (audioOptimize/sunoPlayer/assetPrepared live on the target).
  try {
    if (target.assetPrepared) return false;                                // already prepared (resume-safe)
    const isAudio = /^audio\//i.test(target.mime || '') || isConvertibleAudio(target.mime, target.file);
    if (!isAudio) return false;                                            // nothing to do for non-audio
    const origin = { file: target.file, bytes: target.bytes, mime: target.mime };
    const tag = target === job ? job.jobId : `${job.jobId} item ${target.idx}`;

    // 1) Opus optimise (skip if the input is already Opus-in-WebM).
    let webaPath = target.file, webaBytes = target.bytes, didOpus = false;
    if (isConvertibleAudio(target.mime, target.file)) {
      const r = await convertToOpusWebm(target.file, { outDir: path.dirname(target.file) });
      if (r.ok && r.bytes < target.bytes) {
        webaPath = r.path; webaBytes = r.bytes; didOpus = true;
        target.audioOptimize = { ok: true, preset: r.preset, bitrate: r.bitrate, codec: 'opus', container: 'webm',
          from: origin.bytes, to: r.bytes, savedPct: Math.round((1 - r.bytes / origin.bytes) * 100) };
        console.log(`[${tag}] audio optimised → Opus/WebM ${r.bitrate}: ${origin.bytes} → ${r.bytes} bytes (-${target.audioOptimize.savedPct}%)`);
      } else {
        if (r.ok) { try { fs.unlinkSync(r.path); } catch {} }
        target.audioOptimize = { ok: false, reason: r.ok ? 'no size gain' : r.reason };
      }
    }

    // 2) SUNO: build a self-contained player (Opus + cover + title/artist) and inscribe it.
    //    Batch items may carry their own artwork file — it overrides the embedded cover.
    if (target.suno) {
      const titleFallback = (target.uri && String(target.uri).split(/[:/]/).pop()) || path.basename(origin.file).replace(/\.[^.]+$/, '');
      const p = await buildSunoPlayer({ audioWebaPath: webaPath, sourcePath: origin.file, coverPath: target.artworkFile || undefined, outDir: path.dirname(target.file), titleFallback });
      if (p.ok) {
        target.audioOriginal = origin;
        target.sunoPlayer = { ok: true, title: p.title, artist: p.artist, album: p.album || '', hasCover: !!p.hasCover, coverMime: p.coverMime || null, isSuno: !!p.isSuno, audioBytes: webaBytes, playerBytes: p.bytes };
        adoptAsset(target, p.path, 'text/html', p.bytes);
        target.assetPrepared = 'suno-player';
        try { writeJob(jobDir, job); } catch {}
        console.log(`[${tag}] SUNO player built → ${p.bytes} bytes · "${p.title}"${p.artist ? ' — ' + p.artist : ''}${p.hasCover ? ' · cover' : ''}`);
        return true;
      }
      target.sunoPlayer = { ok: false, reason: p.reason };                 // fall through to plain Opus / original
      console.log(`[${tag}] SUNO player skipped (${p.reason}) — inscribing ${didOpus ? 'Opus' : 'original'} instead`);
    }

    // 3) Non-SUNO (or player failed): inscribe the optimised Opus if we made one.
    if (didOpus) {
      target.audioOriginal = origin;
      adoptAsset(target, webaPath, 'audio/webm; codecs=opus', webaBytes);
      target.assetPrepared = 'opus';
      try { writeJob(jobDir, job); } catch {}
      return true;
    }
    try { writeJob(jobDir, job); } catch {}
    return false;
  } catch (e) {
    try { target.audioOptimize = { ...(target.audioOptimize || {}), ok: false, reason: String((e && e.message) || e) }; writeJob(jobDir, job); } catch {}
    return false;
  }
}

export async function runJob(opts) {
  const { job, enginePath, hiroKey = '', jobDir } = opts; const net = job.net || 'mainnet';
  if (job.mock) {
    job.depositReceivedUstx = job.requiredUstx;
    if (job.items) return runBatchItems({ job, enginePath, hiroKey, jobDir });   // offline batch demo (incl. forced failures)
    await optimizeAudioForInscription(job, jobDir);   // offline-safe; the demo shows the shrunk asset + re-derived plan
    const tokenId = Math.floor(1000 + Math.random() * 9000); job.tokenId = tokenId; job.status = 'INSCRIBED'; writeJob(jobDir, job); return { tokenId, mock: true };
  }
  const network = netOf(net);
  // Funding gate — skipped on RESUME (a mid-flight job has already spent part of the deposit).
  if (!job.depositReceivedUstx) {
    const bal = await balance(network, job.depositAddress, hiroKey);
    if (bal < BigInt(job.requiredUstx)) throw new Error(`not funded: need ${job.requiredUstx}, have ${bal}`);
    job.depositReceivedUstx = bal.toString();   // the agent fee is 10% of what actually arrived
  }
  // PARENT GATE: the contract will abort the mint/seal (ERR-NOT-AUTHORIZED) unless the deposit wallet
  // owns every declared parent, and a mid-mint abort still burns miner fees. Verify BEFORE spending.
  if ((job.parents || []).length) {
    const ps = await parentsStatus(job, hiroKey);
    if (ps.unexpected && ps.unexpected.length) throw new Error(`wrong inscription received: deposit wallet holds unexpected token(s) #${ps.unexpected.join(', #')} — returning everything to sender`);
    if (ps.missing.length) throw new Error(`parents not yet received: waiting for token(s) #${ps.missing.join(', #')} to arrive at ${job.depositAddress}`);
  }
  if (job.items) return runBatchItems({ job, enginePath, hiroKey, jobDir });   // BATCH: N ordered mints from the one funded wallet

  await optimizeAudioForInscription(job, jobDir);   // funds are in → shrink audio to Opus/WebM before inscribing (smaller on-chain asset)

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
  // Parent (already escrowed at the deposit wallet — the gate above verified ownership): the engine
  // seals with seal-with-relationships. Delivery/return stays with deliverJob, NOT the engine.
  if ((job.parents || []).length) env.LARGE_PARENT = String(job.parents[0]);
  // Live progress: capture the engine's JSON event stream -> job.progress (shown in the UI + logged).
  const setProg = (msg) => { job.progress = msg; job.progressAt = new Date().toISOString(); try { writeJob(jobDir, job); } catch {} console.log(`[${job.jobId}] ${msg}`); };
  const onLine = (line) => { let e; try { e = JSON.parse(line); } catch { return; }
    if (e.event === 'plan') setProg(`planned · ${e.chunks} chunks / ${e.batches} batches`);
    else if (e.event === 'began') setProg(`upload started · 0/${job.chunks} chunks`);
    else if (e.event === 'batch') setProg(`uploading · ${e.to}/${job.chunks} chunks`);
    else if (e.event === 'sealed') setProg(`sealed · token #${e.tokenId}`);
    else if (e.event === 'already-inscribed') setProg(`already inscribed · #${e.tokenId}`);
    else if (e.event === 'await-parent') setProg('waiting for parent transfer');
    else if (e.event === 'fee-wait') setProg(`network fees are high right now — waiting for them to settle before the next batch (check ${e.poll}/${e.of})`);
    else if (e.event === 'fee-spike') setProg('fee estimator returned a spike — re-checking…');
    else if (e.event === 'fee-fallback') setProg('fees still elevated — proceeding at a capped fee'); };
  let outBuf = '', errBuf = '', lastActivity = Date.now();
  const code = await new Promise((resolve, reject) => {
    const child = spawn('node', [ep], { stdio: ['ignore', 'pipe', 'pipe'], env, cwd: path.dirname(ep) });
    const stall = setInterval(() => { if (Date.now() - lastActivity > JOB_WINDOW_MS) { clearInterval(stall); try { child.kill('SIGKILL'); } catch {} reject(new Error(`engine stalled — no progress for ${Math.round(JOB_WINDOW_MS / 60000)} min`)); } }, 15000);
    child.stdout.on('data', (d) => { lastActivity = Date.now(); outBuf += d.toString(); let i; while ((i = outBuf.indexOf('\n')) >= 0) { onLine(outBuf.slice(0, i)); outBuf = outBuf.slice(i + 1); } });
    child.stderr.on('data', (d) => { lastActivity = Date.now(); const s = d.toString(); errBuf = (errBuf + s).slice(-800); process.stderr.write(s); });
    child.on('error', (e) => { clearInterval(stall); reject(e); });
    child.on('close', (c) => { clearInterval(stall); resolve(c); });
  });
  if (code !== 0) throw new Error('engine exited ' + code + (errBuf.trim() ? ': ' + errBuf.trim().split('\n').filter(Boolean).pop() : ''));
  const mapPath = path.join(path.dirname(ep), 'large-map.json');
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const tokenId = map[job.uri] && map[job.uri].tokenId;
  job.tokenId = tokenId; job.status = 'INSCRIBED'; writeJob(jobDir, job);
  return { tokenId, route: 'staged' };
}

// ---------- batch mint loop ----------
// Failures that are the ITEM's fault (bad content, contract abort, unresolved intra-batch
// dep) mark that item FAILED and the batch continues — one bad track must not torpedo an
// album. Anything else (network, estimator, rate limits) is thrown so the job-level
// retry/backoff resumes the batch AT THIS ITEM (mints already made are resume-safe).
const ITEM_FATAL = /TX abort|empty file|exceeds single-tx|unresolved|duplicate|already inscribed|does not exist|file not found|ENOENT|mock forced/i;
async function runBatchItems({ job, enginePath, hiroKey = '', jobDir }) {
  const net = job.net || 'mainnet'; const network = netOf(net); const core = [DEPLOYER, job.core];
  const dep = job.mock ? null : deriveFrom(job.ephemeralMnemonic, net);
  const prog = (m) => { job.progress = m; job.progressAt = new Date().toISOString(); writeJob(jobDir, job); console.log(`[${job.jobId}] ${m}`); };
  const resolveDeps = (item) => (item.deps || []).map((d) => {
    if (!/^@\d+$/.test(d)) return d;
    const k = Number(d.slice(1)); const ref = job.items[k];
    if (!ref || !ref.tokenId) throw new Error(`dep '${d}' unresolved — item ${k} is ${ref ? ref.status : 'missing'}`);
    return String(ref.tokenId);
  });
  let minted = 0, failed = 0;
  for (let i = 0; i < job.items.length; i += 1) {
    const item = job.items[i];
    job.batchProgress = { current: i, total: job.items.length };
    if (item.status === 'INSCRIBED' && item.tokenId) { minted += 1; continue; }          // resume-safe: already on-chain
    if (item.status === 'FAILED' || item.status === 'SKIPPED') { failed += 1; continue; }
    try {
      prog(`batch ${i + 1}/${job.items.length} · preparing ${item.uri}`);
      await optimizeAudioForInscription(job, jobDir, item);                              // per-item Opus/player (+ artwork) prep
      const deps = resolveDeps(item);
      const parents = [...new Set([...(job.sharedParents || []), ...(item.parents || [])])];
      item.status = 'INSCRIBING'; writeJob(jobDir, job);
      if (job.mock) {
        if (/mockfail/i.test(item.uri)) throw new Error('TX abort_by_response (mock forced failure)');
        item.tokenId = String(Math.floor(1000 + Math.random() * 9000));
      } else if (item.single) {
        const data = new Uint8Array(fs.readFileSync(item.file));
        const m = await mintFile({ core, network, key: dep.key, fromAddr: dep.address, hiroKey, data, mime: item.mime, uri: item.uri, deps, parents, spendCap: BigInt(item.protocolFee) });
        item.tokenId = m.tokenId; item.itemMinerFee = m.minerFee.toString();
      } else {
        item.tokenId = await stagedInscribeViaEngine({ job, item, deps, parent: parents[0] || null, enginePath, hiroKey, jobDir, prog });
      }
      item.status = 'INSCRIBED'; item.error = null; minted += 1;
      prog(`batch ${i + 1}/${job.items.length} · inscribed ${item.uri} → #${item.tokenId}`);
    } catch (e) {
      const msg = errMsg(e);
      if (!ITEM_FATAL.test(msg)) { item.status = 'PENDING'; writeJob(jobDir, job); throw e; }   // transient → job retry resumes here
      item.status = 'FAILED'; item.error = msg; failed += 1;
      prog(`batch ${i + 1}/${job.items.length} · item FAILED (${msg}) — ${job.strict ? 'strict mode: stopping' : 'continuing with the rest'}`);
      if (job.strict) { for (let k = i + 1; k < job.items.length; k += 1) if (job.items[k].status === 'PENDING') job.items[k].status = 'SKIPPED'; writeJob(jobDir, job); break; }
    }
  }
  job.batchProgress = { current: job.items.length, total: job.items.length };
  if (!minted) { writeJob(jobDir, job); throw new Error('batch failed: no items inscribed — returning everything to sender'); }
  job.tokenId = job.items.find((it) => it.tokenId)?.tokenId || null;      // compat: "the" token = first minted
  job.status = 'INSCRIBED'; writeJob(jobDir, job);
  return { route: 'batch', minted, failed, tokenIds: job.items.map((it) => it.tokenId) };
}
// One staged (large-file) engine run for a single batch item — same engine, per-item env.
async function stagedInscribeViaEngine({ job, item, deps, parent, enginePath, hiroKey, jobDir, prog }) {
  const ep = path.resolve(enginePath);
  if (!fs.existsSync(ep)) throw new Error(`staged-upload engine not found at ${ep}`);
  const env = { ...process.env, WALLET_MNEMONIC: job.ephemeralMnemonic, DRY_RUN: '0', REQUIRE_CONFIRM: '0', LARGE_FILE: item.file, LARGE_URI: item.uri, LARGE_MIME: item.mime, LARGE_DEPS: deps.join(','), HIRO_API_KEY: hiroKey };
  if (parent) env.LARGE_PARENT = String(parent);
  let lastActivity = Date.now(); let outBuf = '', errBuf = '';
  const onLine = (line) => { let e; try { e = JSON.parse(line); } catch { return; }
    if (e.event === 'batch') prog(`item ${item.idx + 1}: uploading · ${e.to}/${item.chunks} chunks`);
    else if (e.event === 'sealed') prog(`item ${item.idx + 1}: sealed · token #${e.tokenId}`); };
  const code = await new Promise((resolve, reject) => {
    const child = spawn('node', [ep], { stdio: ['ignore', 'pipe', 'pipe'], env, cwd: path.dirname(ep) });
    const stall = setInterval(() => { if (Date.now() - lastActivity > JOB_WINDOW_MS) { clearInterval(stall); try { child.kill('SIGKILL'); } catch {} reject(new Error(`engine stalled — no progress for ${Math.round(JOB_WINDOW_MS / 60000)} min`)); } }, 15000);
    child.stdout.on('data', (d) => { lastActivity = Date.now(); outBuf += d.toString(); let i; while ((i = outBuf.indexOf('\n')) >= 0) { onLine(outBuf.slice(0, i)); outBuf = outBuf.slice(i + 1); } });
    child.stderr.on('data', (d) => { lastActivity = Date.now(); errBuf = (errBuf + d.toString()).slice(-800); });
    child.on('error', (e) => { clearInterval(stall); reject(e); });
    child.on('close', (c) => { clearInterval(stall); resolve(c); });
  });
  if (code !== 0) throw new Error('engine exited ' + code + (errBuf.trim() ? ': ' + errBuf.trim().split('\n').filter(Boolean).pop() : ''));
  const map = JSON.parse(fs.readFileSync(path.join(path.dirname(ep), 'large-map.json'), 'utf8'));
  const tokenId = map[item.uri] && map[item.uri].tokenId;
  if (!tokenId) throw new Error(`engine finished but no token id recorded for ${item.uri}`);
  return String(tokenId);
}

export async function mintFile({ core, network, key, fromAddr, hiroKey, data, mime, uri, deps = [], parents = [], spendCap }) {
  const chunks = chunkBytes(data);
  if (chunks.length === 0) throw new Error('empty file');
  if (chunks.length > SINGLE_TX_MAX_CHUNKS) throw new Error(`${chunks.length} chunks exceeds single-tx max ${SINGLE_TX_MAX_CHUNKS}`);
  const h = incHash(chunks);
  // IDEMPOTENT: if this exact content is already inscribed (e.g. a retry after a confirmation timeout),
  // return the existing token instead of re-minting — a resume can never double-inscribe or double-spend.
  const pre = await getIdByHash(core, network, h);
  if (pre != null) return { tokenId: pre.toString(), minerFee: 0n, txid: null, resumed: true };
  const depCVs = deps.map((d) => uintCV(BigInt(d)));
  const parentCVs = parents.map((p) => uintCV(BigInt(p)));
  // Parents require the -with-relationships entrypoint (contract checks tx-sender OWNS every parent).
  const fn = parentCVs.length ? 'mint-single-tx-with-relationships' : (depCVs.length ? 'mint-single-tx-recursive' : 'mint-single-tx');
  const args = [bufferCV(h), stringAsciiCV(mime), uintCV(BigInt(data.length)), listCV(chunks.map((c) => bufferCV(c))), stringAsciiCV(uri)];
  if (parentCVs.length) { args.push(listCV(depCVs), listCV(parentCVs)); }
  else if (depCVs.length) args.push(listCV(depCVs));
  // Fee-spike resilience: retry estimation, then fall back to the capped fee instead of failing the job.
  const mkOpts = { contractAddress: core[0], contractName: core[1], functionName: fn, functionArgs: args, senderKey: key, network, postConditionMode: PostConditionMode.Deny, postConditions: [makeStandardSTXPostCondition(fromAddr, FungibleConditionCode.LessEqual, spendCap)], anchorMode: AnchorMode.Any };
  let tx, usedFee;
  for (let attempt = 0; ; attempt++) {
    tx = await makeContractCall(mkOpts);
    usedFee = BigInt(tx.auth.spendingCondition.fee.toString());
    if (usedFee <= MINT_PER_TX_CAP) break;
    if (attempt < 3) { console.warn(`mint fee estimate ${usedFee} exceeds cap ${MINT_PER_TX_CAP} — estimator spike, retrying (${attempt + 1}/3)`); await sleep(6000); continue; }
    console.warn(`mint fee estimate still ${usedFee} after retries — using capped fee ${MINT_PER_TX_CAP}`);
    tx = await makeContractCall({ ...mkOpts, fee: MINT_PER_TX_CAP }); usedFee = MINT_PER_TX_CAP; break;
  }
  const res = await broadcastTransaction(tx, network);
  if (res.error) throw new Error('mint broadcast: ' + res.error + ' ' + (res.reason || ''));
  const txid = res.txid || res;
  await waitTx(network, txid, hiroKey);
  const id = await getIdByHash(core, network, h);
  return { tokenId: id ? id.toString() : null, minerFee: usedFee, txid };
}
async function mintSingleTx({ job, network, key, fromAddr, hiroKey }) {
  const data = new Uint8Array(fs.readFileSync(job.file));
  return mintFile({ core: [DEPLOYER, job.core], network, key, fromAddr, hiroKey, data, mime: job.mime, uri: job.uri, deps: job.deps || [], parents: job.parents || [], spendCap: BigInt(job.protocolFee) });
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
    tokenId: job.tokenId, receiptTokenId: x.receiptTokenId || null, recipient: x.recipient || job.recipient || job.user, agentIdentityId: job.agentIdentityId || null,
    parents: (job.parents || []).map(String),
    outcome: x.outcome || 'inscribed', note: x.note || null,
    depositReceived: received.toString(), xtrataProtocol: fileProtocol.toString(), receiptProtocol: receiptProtocol.toString(),
    networkFee: networkFee.toString(), agentFeePct: Number(job.agentFeePct ?? AGENT_FEE_PCT),
    agentFee: agentFee.toString(), changeReturned: changeR.toString(),
    totalPaid: totalPaid.toString(), stxUsd, totalPaidUsd,
    audioOpt: (job.audioOptimize && job.audioOptimize.ok)
      ? { from: job.audioOptimize.from, to: job.audioOptimize.to, preset: job.audioOptimize.preset, bitrate: job.audioOptimize.bitrate, savedPct: job.audioOptimize.savedPct }
      : null,
    player: (job.sunoPlayer && job.sunoPlayer.ok)
      ? { title: job.sunoPlayer.title, artist: job.sunoPlayer.artist || '', hasCover: !!job.sunoPlayer.hasCover, playerBytes: job.sunoPlayer.playerBytes }
      : null,
  };
}
function buildReceiptHtml(d) {
  const row = (k, v) => `<div class="r"><span>${k}</span><span>${v}</span></div>`;
  const escHtml = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const stxr = (u) => ustxToStx(u) + ' STX';
  const usd = (u) => d.stxUsd ? ' · ~$' + (Number(u) / 1e6 * d.stxUsd).toFixed(2) : '';
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
<div class="h"><div class="logo"><b>XTRATA</b> <i>Agent One</i></div><span class="badge"${d.outcome !== 'inscribed' ? ' style="color:#ffb454;border-color:#5a4620"' : ''}>${d.outcome === 'inscribed' ? '✓ Inscribed' : '↩︎ Refunded'}</span></div>
<div class="sub">${d.outcome === 'inscribed' ? 'Inscription receipt' : 'Refund receipt'} · ${d.date.slice(0, 19).replace('T', ' ')} UTC</div>
<h1>What was inscribed</h1>
${row('Content URI', escHtml(d.uri))}${row('Type', escHtml(d.mime))}
${row('Size', (d.bytes / 1048576).toFixed(3) + ' MiB · ' + Number(d.bytes).toLocaleString() + ' B')}
${row('Chunks', d.chunks + (d.single ? ' · single-tx' : ' · staged'))}
${d.audioOpt ? row('Audio optimised', `${(d.audioOpt.from / 1048576).toFixed(3)} → ${(d.audioOpt.to / 1048576).toFixed(3)} MiB · Opus ${d.audioOpt.bitrate} · −${d.audioOpt.savedPct}% (${d.audioOpt.preset})`) : ''}
${d.player ? row('Player', `${escHtml(d.player.title)}${d.player.artist ? ' — ' + escHtml(d.player.artist) : ''} · embedded Opus${d.player.hasCover ? ' + cover art' : ''}`) : ''}
${(d.parents && d.parents.length) ? row('Parent inscription' + (d.parents.length > 1 ? 's' : ''), d.parents.map((p) => '<span class="tok">#' + p + '</span>').join(' ') + ' · escrowed for the mint, returned to you with the child') : ''}
${row('Inscription token', '<span class="tok">#' + (d.tokenId ?? '—') + '</span>' + ((d.parents && d.parents.length) ? ' · child of #' + d.parents.join(', #') : ''))}
${row('Receipt token', d.receiptTokenId ? ('<span class="tok">#' + d.receiptTokenId + '</span>') : 'this inscription')}
${row('Delivered to', escHtml(short(d.recipient)))}
${d.agentIdentityId ? row('Issued by', 'Agent One · identity <span class="tok">#' + d.agentIdentityId + '</span>') : ''}
${d.outcome === 'inscribed' ? `<h1>Cost breakdown</h1>
${row('Deposit received', stxr(d.depositReceived) + usd(d.depositReceived))}
${row('Xtrata protocol fee', stxr(d.xtrataProtocol) + usd(d.xtrataProtocol))}
${row('Receipt inscription', stxr(d.receiptProtocol) + usd(d.receiptProtocol))}
${row('Network (miner) fee', stxr(d.networkFee) + usd(d.networkFee))}
<div class="fee">${row('Agent fee (' + d.agentFeePct + '%)', stxr(d.agentFee) + usd(d.agentFee))}</div>
${row('Change returned to you', stxr(d.changeReturned) + usd(d.changeReturned))}
${d.note ? row('Note', escHtml(d.note)) : ''}
<div class="tot">${row('Total paid', stxr(d.totalPaid) + usd(d.totalPaid))}</div>` : `<h1>Outcome</h1>
${row('Status', 'Not completed — all funds and inscriptions returned to sender')}
${d.note ? row('Reason', escHtml(d.note)) : ''}
${(d.parents && d.parents.length) ? row('Parent inscription' + (d.parents.length > 1 ? 's' : ''), d.parents.map((p) => '<span class="tok">#' + p + '</span>').join(' ') + ' · returned to sender') : ''}
${row('Deposit received', stxr(d.depositReceived) + usd(d.depositReceived))}
<div class="tot">${row('Returned to you', stxr(d.changeReturned) + usd(d.changeReturned))}</div>`}
<div class="foot">Core ${d.core} · job ${d.jobId}${d.stxUsd ? ' · STX $' + d.stxUsd : ''} · settled on Bitcoin via Stacks</div>
</div></div></body></html>`;
}
// ---------- batch receipt (ONE receipt covering every item) ----------
function batchReceiptData(job, x) {
  const received = BigInt(x.received);
  const minted = job.items.filter((i) => i.tokenId);
  const sumProtocol = minted.reduce((s, i) => s + BigInt(i.protocolFee || '0'), 0n);
  const receiptProtocol = BigInt(job.receiptProtocol || '0');
  const agentFee = BigInt(x.agentFee);
  const changeR = x.change != null && BigInt(x.change) > 0n ? BigInt(x.change) : 0n;
  let networkFee = received - sumProtocol - receiptProtocol - agentFee - changeR;
  if (networkFee < 0n) networkFee = 0n;
  const totalPaid = received - changeR;
  const stxUsd = (x.stxUsd != null) ? Number(x.stxUsd) : null;
  return {
    jobId: job.jobId, core: job.core, date: new Date().toISOString(), batch: true,
    outcome: x.outcome || 'inscribed', note: x.note || null,
    items: job.items.map((i) => ({ idx: i.idx, uri: i.uri, mime: i.mime, bytes: i.bytes, tokenId: i.tokenId || null, status: i.status, error: i.error || null,
      player: (i.sunoPlayer && i.sunoPlayer.ok) ? { title: i.sunoPlayer.title, artist: i.sunoPlayer.artist || '', hasCover: !!i.sunoPlayer.hasCover } : null })),
    counts: { total: job.items.length, minted: minted.length, failed: job.items.filter((i) => i.status === 'FAILED').length, skipped: job.items.filter((i) => i.status === 'SKIPPED').length },
    parents: (job.parents || []).map(String), receiptTokenId: x.receiptTokenId || null,
    recipient: x.recipient || job.recipient || job.user, agentIdentityId: job.agentIdentityId || null,
    depositReceived: received.toString(), xtrataProtocol: sumProtocol.toString(), receiptProtocol: receiptProtocol.toString(),
    networkFee: networkFee.toString(), agentFeePct: Number(job.agentFeePct ?? AGENT_FEE_PCT), agentFee: agentFee.toString(),
    changeReturned: changeR.toString(), totalPaid: totalPaid.toString(), stxUsd,
  };
}
function buildBatchReceiptHtml(d) {
  const row = (k, v) => `<div class="r"><span>${k}</span><span>${v}</span></div>`;
  const escHtml = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const stxr = (u) => ustxToStx(u) + ' STX';
  const usd = (u) => d.stxUsd ? ' · ~$' + (Number(u) / 1e6 * d.stxUsd).toFixed(2) : '';
  const short = (s) => s ? (s.length > 18 ? s.slice(0, 9) + '…' + s.slice(-6) : s) : '—';
  const ok = d.outcome === 'inscribed';
  const itemRow = (i) => {
    const mark = i.tokenId ? `<span class="tok">#${i.tokenId}</span> ✓` : (i.status === 'FAILED' ? `✗ failed${i.error ? ' — ' + escHtml(String(i.error).slice(0, 60)) : ''}` : '− skipped');
    const label = i.player ? `${escHtml(i.player.title)}${i.player.artist ? ' — ' + escHtml(i.player.artist) : ''}${i.player.hasCover ? ' · art' : ''}` : escHtml(i.uri);
    return row(`${i.idx + 1} · ${label}`, `${escHtml(i.mime)} · ${(i.bytes / 1048576).toFixed(2)} MiB · ${mark}`);
  };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Xtrata Agent One — Batch receipt ${d.jobId}</title><style>
:root{--bg:#0b0e14;--pan:#121826;--line:#243044;--ink:#e9eff8;--mut:#8ea0bd;--acc:#3ea6ff;--acc2:#7c5cff;--ok:#3ddc97;--mono:ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(820px 420px at 80% -10%,rgba(124,92,255,.14),transparent),var(--bg);color:var(--ink);font:14px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:640px;margin:0 auto;padding:34px 20px}.card{background:var(--pan);border:1px solid var(--line);border-radius:16px;padding:24px}
.h{display:flex;align-items:center;justify-content:space-between;gap:10px}.logo{font-weight:800;letter-spacing:.4px}.logo b{color:var(--acc)}.logo i{color:var(--acc2);font-style:normal}
.badge{font-size:11px;color:var(--ok);border:1px solid #1f5a45;border-radius:999px;padding:3px 10px}
.sub{color:var(--mut);font-size:12px;margin:4px 0 18px}h1{font-size:15px;margin:18px 0 8px}
.r{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dashed var(--line);font-size:13px}
.r:last-child{border-bottom:0}.r span:first-child{color:var(--mut)}.r span:last-child{font-family:var(--mono);text-align:right;word-break:break-all}
.tot{margin-top:10px;padding-top:12px;border-top:1px solid var(--line)}.tot .r span:last-child{color:var(--acc);font-size:15px}
.fee span:last-child{color:var(--acc2)}.tok{color:var(--ok)}.foot{color:var(--mut);font-size:11px;margin-top:18px;text-align:center}
</style></head><body><div class="wrap"><div class="card">
<div class="h"><div class="logo"><b>XTRATA</b> <i>Agent One</i></div><span class="badge"${!ok ? ' style="color:#ffb454;border-color:#5a4620"' : ''}>${ok ? `✓ Batch · ${d.counts.minted}/${d.counts.total} inscribed` : '↩︎ Refunded'}</span></div>
<div class="sub">Batch ${ok ? 'inscription' : 'refund'} receipt · ${d.counts.total} items · ${d.date.slice(0, 19).replace('T', ' ')} UTC</div>
<h1>What was inscribed</h1>
${d.items.map(itemRow).join('')}
${(d.parents && d.parents.length) ? `<h1>Parent inscription${d.parents.length > 1 ? 's' : ''}</h1>
${row('Escrowed for the batch', d.parents.map((p) => '<span class="tok">#' + p + '</span>').join(' ') + ` · linked to every item · returned to ${ok ? 'you' : 'sender'}`)}` : ''}
${row('Receipt token', d.receiptTokenId ? ('<span class="tok">#' + d.receiptTokenId + '</span>') : 'this inscription')}
${row('Delivered to', escHtml(short(d.recipient)))}
${d.agentIdentityId ? row('Issued by', 'Agent One · identity <span class="tok">#' + d.agentIdentityId + '</span>') : ''}
<h1>${ok ? 'Cost breakdown' : 'Outcome'}</h1>
${ok ? '' : row('Status', 'Not completed — all funds and inscriptions returned to sender')}
${d.note ? row(ok ? 'Note' : 'Reason', escHtml(d.note)) : ''}
${row('Deposit received', stxr(d.depositReceived) + usd(d.depositReceived))}
${row('Xtrata protocol fees (' + d.counts.minted + ' mints)', stxr(d.xtrataProtocol) + usd(d.xtrataProtocol))}
${row('Receipt inscription', stxr(d.receiptProtocol) + usd(d.receiptProtocol))}
${row('Network (miner) fee', stxr(d.networkFee) + usd(d.networkFee))}
<div class="fee">${row('Agent fee (' + d.agentFeePct + '%)', stxr(d.agentFee) + usd(d.agentFee))}</div>
${row('Change returned', stxr(d.changeReturned) + usd(d.changeReturned))}
<div class="tot">${row(ok ? 'Total paid' : 'Returned to you', stxr(ok ? d.totalPaid : d.changeReturned) + usd(ok ? d.totalPaid : d.changeReturned))}</div>
<div class="foot">Core ${d.core} · job ${d.jobId}${d.stxUsd ? ' · STX $' + d.stxUsd : ''} · one payment, ${d.counts.total} inscriptions · settled on Bitcoin via Stacks</div>
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

  if (job.items) return deliverBatch({ job, hiroKey, jobDir, receiptsDir, received, agentFee, stxUsd });

  if (job.mock) {
    const receiptTokenId = String(Math.floor(1000 + Math.random() * 9000));
    const d = receiptData(job, { received, agentFee, receiptTokenId, stxUsd });
    saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(d));
    const receipt = { ...d, deliverTx: '0xMOCK_DELIVER', receiptDeliverTx: '0xMOCK_RECEIPT', agentFeeTx: '0xMOCK_FEE', refundTx: '0xMOCK_REFUND' };
    if ((job.parents || []).length) { job.parentReturnTxs = job.parents.map((p) => ({ id: String(p), tx: '0xMOCK_PARENT_RETURN' })); receipt.parentReturnTxs = job.parentReturnTxs; }
    Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), refundedUstx: d.changeReturned, receipt });
    delete job.ephemeralMnemonic; job.status = 'COMPLETE'; writeJob(jobDir, job);
    return { receipt, mock: true };
  }

  const dep = deriveFrom(job.ephemeralMnemonic, net); const core = [DEPLOYER, job.core]; const network = netOf(net);
  const refundTo = (await resolveFunder(job, network, hiroKey)) || job.user;   // change ALWAYS returns to the payer, never a preset address
  // Realistic numbers for the ON-CHAIN receipt: read the wallet AFTER the inscription so we know the
  // real main-inscription miner spend and can estimate the change from what's actually left (not the
  // generous up-front reserve, which previously showed ~8.4 STX "miner fee" / 0.2 STX "change").
  let liveBal0 = null; try { liveBal0 = await balance(network, job.depositAddress, hiroKey); } catch {}
  let mainMinerForReceipt = BigInt(job.mainMinerFee || job.minerReserve || '0');
  let estChange;   // undefined ⇒ receiptData falls back to the reserve-based estimate
  if (liveBal0 != null && liveBal0 > 0n) {
    const spentSoFar = received > liveBal0 ? received - liveBal0 : 0n;                 // protocol + actual main-inscription miner fees
    if (spentSoFar > BigInt(job.protocolFee)) mainMinerForReceipt = spentSoFar - BigInt(job.protocolFee);
    const reserveAhead = BigInt(job.receiptProtocol || '0') + BigInt(job.receiptMiner || '0') + agentFee + BigInt((job.parents || []).length) * PARENT_RETURN_FEE + DELIVERY_RESERVE + REFUND_TX_FEE;
    estChange = liveBal0 > reserveAhead ? liveBal0 - reserveAhead : 0n;               // what should come back after the remaining steps
  }
  const prelim = receiptData(job, { received, agentFee, receiptTokenId: null, change: estChange, mainMinerFee: mainMinerForReceipt.toString(), stxUsd });
  const idDep = job.agentIdentityId || AGENT_IDENTITY_ID;
  const receiptDeps = idDep ? [job.tokenId, idDep] : [job.tokenId];   // file + agent identity (existence-only links, no transfers)
  const r = await inscribeReceipt({ core, network, key: dep.key, fromAddr: dep.address, hiroKey, html: buildReceiptHtml(prelim), uri: `xtrata:receipt/${job.jobId}`, deps: receiptDeps });
  const receiptTokenId = r.tokenId;

  // CRITICAL step: deliver the inscription itself to the user. If THIS fails the job genuinely failed → throw.
  const deliverTx = await sendNft(core, network, dep.key, dep.address, job.tokenId, job.recipient || job.user, hiroKey);
  // The inscription is now in the user's wallet → the job has SUCCEEDED. Record it BEFORE the best-effort
  // tail so no later hiccup can ever re-label this as a failure (see the refundAndClose guard).
  job.deliverTx = deliverTx; job.inscriptionDelivered = true; writeJob(jobDir, job);

  // Best-effort tail — receipt delivery, agent fee, change refund. None of these may throw or trip the
  // failsafe: any STX a step can't move stays in the wallet (key kept, flagged) and is swept by recovery,
  // so funds are never lost and a delivered inscription is never reported as a failure.
  let receiptDeliverTx = null, agentFeeTx = null, refundTx = null, refundedUstx = '0'; const notes = [];
  // Parent(s) go home FIRST — the user's own inscription(s) are the most valuable thing in this wallet.
  const parentReturnTxs = [];
  for (const pid of (job.parents || [])) {
    try {
      if ((await ownerOf(core, network, pid)) === dep.address) {
        const ptx = await sendNft(core, network, dep.key, dep.address, pid, refundTo, hiroKey);
        parentReturnTxs.push({ id: String(pid), tx: ptx });
      }
    } catch (e) { notes.push(`parent #${pid} return pending — recover-all will send it home (` + errMsg(e) + ')'); job.keepKey = true; }
  }
  if (parentReturnTxs.length) { job.parentReturnTxs = parentReturnTxs; writeJob(jobDir, job); }
  try { receiptDeliverTx = await sendNft(core, network, dep.key, dep.address, receiptTokenId, job.recipient || job.user, hiroKey); }
  catch (e) { notes.push('receipt delivery deferred (' + errMsg(e) + ')'); }
  try { if (agentFee > 0n) agentFeeTx = await sendStxRetry(network, dep.key, agentFee, job.agentFeeAddress || AGENT_FEE_ADDRESS, hiroKey); }
  catch (e) { notes.push('agent fee deferred (' + errMsg(e) + ')'); }
  try { const sw = await sweepStxTo(network, dep.key, dep.address, refundTo, hiroKey); if (sw.sent) { refundTx = sw.tx; refundedUstx = sw.amount; } }
  catch (e) { notes.push('change return pending — recover-all will sweep it (' + errMsg(e) + ')'); }

  const note = notes.length ? notes.join('; ') : null;
  const finalD = receiptData(job, { received, agentFee, receiptTokenId, change: BigInt(refundedUstx), mainMinerFee: mainMinerForReceipt.toString(), receiptMinerFee: r.minerFee.toString(), stxUsd, note });
  saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(finalD));
  const receipt = { ...finalD, deliverTx, receiptDeliverTx, agentFeeTx, refundTx, parentReturnTxs: parentReturnTxs.length ? parentReturnTxs : undefined };
  Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), deliverTx, receiptDeliverTx, agentFeeTx, refundTx, refundedUstx, receipt });
  // SAFETY: never wipe a key while the wallet still holds STX or ANY inscription (e.g. a parent whose
  // return transfer failed) — or while we can't confirm it's empty.
  let leftover = null; try { leftover = await balance(network, job.depositAddress, hiroKey); } catch {}
  let holdsNft = (job.parents || []).length > 0;   // assume the worst until proven empty
  try { holdsNft = (await heldInscriptions(network, core, job.depositAddress, hiroKey)).length > 0; } catch {}
  if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
  else { job.keepKey = true; job.keepKeyReason = leftover == null ? 'balance unconfirmed' : holdsNft ? 'wallet still holds an inscription — return it with recover-all' : `wallet still holds ${leftover} uSTX — sweep with recover-all`; }
  job.status = 'COMPLETE'; writeJob(jobDir, job);
  return { receipt };
}

/**
 * BATCH delivery: mint ONE receipt covering every item, deliver ALL minted tokens + the
 * receipt to the user, send every escrowed parent home, take the agent fee, sweep change.
 * The success commit point is the FIRST delivered token (job.inscriptionDelivered) — after
 * that, everything else is best-effort + recoverable, exactly like the single-item path.
 */
async function deliverBatch({ job, hiroKey = '', jobDir, receiptsDir, received, agentFee, stxUsd }) {
  const net = job.net || 'mainnet';
  const minted = job.items.filter((i) => i.tokenId);
  if (!minted.length) throw new Error('nothing to deliver — no batch items inscribed');

  if (job.mock) {
    const receiptTokenId = String(Math.floor(1000 + Math.random() * 9000));
    const sumProt = minted.reduce((s, i) => s + BigInt(i.protocolFee || '0'), 0n);
    const change = received - sumProt - BigInt(job.receiptProtocol || '0') - agentFee;
    const d = batchReceiptData(job, { received, agentFee, receiptTokenId, change: change > 0n ? change : 0n, stxUsd });
    saveReceiptHtml(receiptsDir, job.jobId, buildBatchReceiptHtml(d));
    const receipt = { ...d, deliverTxs: minted.map((i) => ({ id: i.tokenId, tx: '0xMOCK_DELIVER' })), receiptDeliverTx: '0xMOCK_RECEIPT', agentFeeTx: '0xMOCK_FEE', refundTx: '0xMOCK_REFUND' };
    if ((job.parents || []).length) { job.parentReturnTxs = job.parents.map((p) => ({ id: String(p), tx: '0xMOCK_PARENT_RETURN' })); receipt.parentReturnTxs = job.parentReturnTxs; }
    Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), refundedUstx: d.changeReturned, receipt });
    delete job.ephemeralMnemonic; job.status = job.items.some((i) => i.status !== 'INSCRIBED') ? 'COMPLETE_WITH_SKIPS' : 'COMPLETE'; writeJob(jobDir, job);
    return { receipt, mock: true };
  }

  const dep = deriveFrom(job.ephemeralMnemonic, net); const core = [DEPLOYER, job.core]; const network = netOf(net);
  const refundTo = (await resolveFunder(job, network, hiroKey)) || job.user;
  // Change estimate for the preliminary on-chain receipt (mirrors the single-item logic).
  let liveBal0 = null; try { liveBal0 = await balance(network, job.depositAddress, hiroKey); } catch {}
  let estChange;
  if (liveBal0 != null && liveBal0 > 0n) {
    const reserveAhead = BigInt(job.receiptProtocol || '0') + BigInt(job.receiptMiner || '0') + agentFee
      + BigInt((job.parents || []).length) * PARENT_RETURN_FEE + BigInt(minted.length) * ITEM_DELIVERY_FEE + DELIVERY_RESERVE + REFUND_TX_FEE;
    estChange = liveBal0 > reserveAhead ? liveBal0 - reserveAhead : 0n;
  }
  const prelim = batchReceiptData(job, { received, agentFee, receiptTokenId: null, change: estChange, stxUsd });
  // Receipt deps: every minted token + every parent + the agent identity (existence-only links).
  const idDep = job.agentIdentityId || AGENT_IDENTITY_ID;
  const receiptDeps = [...minted.map((i) => i.tokenId), ...(job.parents || []), ...(idDep ? [idDep] : [])].slice(0, 50);
  const r = await inscribeReceipt({ core, network, key: dep.key, fromAddr: dep.address, hiroKey, html: buildBatchReceiptHtml(prelim), uri: `xtrata:receipt/${job.jobId}`, deps: receiptDeps });
  const receiptTokenId = r.tokenId;

  // Deliver every minted token. First success = the job's commit point; later hiccups are
  // best-effort (never re-labelled a failure; recovery sweeps whatever is left).
  const deliverTxs = []; const notes = [];
  for (const item of minted) {
    try {
      const tx = await sendNft(core, network, dep.key, dep.address, item.tokenId, job.recipient || job.user, hiroKey);
      deliverTxs.push({ id: item.tokenId, tx }); item.deliverTx = tx;
      if (!job.inscriptionDelivered) { job.deliverTx = tx; job.inscriptionDelivered = true; writeJob(jobDir, job); }
    } catch (e) {
      notes.push(`item #${item.tokenId} delivery pending — recovery will send it (` + errMsg(e) + ')');
      job.keepKey = true;
      if (!job.inscriptionDelivered) throw e;   // nothing delivered yet → this is a genuine failure → failsafe
    }
  }

  // Best-effort tail: parents home FIRST, then receipt, agent fee, change.
  const parentReturnTxs = [];
  for (const pid of (job.parents || [])) {
    try { if ((await ownerOf(core, network, pid)) === dep.address) { const ptx = await sendNft(core, network, dep.key, dep.address, pid, refundTo, hiroKey); parentReturnTxs.push({ id: String(pid), tx: ptx }); } }
    catch (e) { notes.push(`parent #${pid} return pending — recover-all will send it home (` + errMsg(e) + ')'); job.keepKey = true; }
  }
  if (parentReturnTxs.length) { job.parentReturnTxs = parentReturnTxs; writeJob(jobDir, job); }
  let receiptDeliverTx = null, agentFeeTx = null, refundTx = null, refundedUstx = '0';
  try { receiptDeliverTx = await sendNft(core, network, dep.key, dep.address, receiptTokenId, job.recipient || job.user, hiroKey); }
  catch (e) { notes.push('receipt delivery deferred (' + errMsg(e) + ')'); }
  try { if (agentFee > 0n) agentFeeTx = await sendStxRetry(network, dep.key, agentFee, job.agentFeeAddress || AGENT_FEE_ADDRESS, hiroKey); }
  catch (e) { notes.push('agent fee deferred (' + errMsg(e) + ')'); }
  try { const sw = await sweepStxTo(network, dep.key, dep.address, refundTo, hiroKey); if (sw.sent) { refundTx = sw.tx; refundedUstx = sw.amount; } }
  catch (e) { notes.push('change return pending — recover-all will sweep it (' + errMsg(e) + ')'); }

  const note = notes.length ? notes.join('; ') : null;
  const finalD = batchReceiptData(job, { received, agentFee, receiptTokenId, change: BigInt(refundedUstx), stxUsd, note });
  saveReceiptHtml(receiptsDir, job.jobId, buildBatchReceiptHtml(finalD));
  const receipt = { ...finalD, deliverTxs, receiptDeliverTx, agentFeeTx, refundTx, parentReturnTxs: parentReturnTxs.length ? parentReturnTxs : undefined };
  Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), deliverTxs, receiptDeliverTx, agentFeeTx, refundTx, refundedUstx, receipt });
  // SAFETY: never wipe the key while the wallet holds STX or ANY inscription.
  let leftover = null; try { leftover = await balance(network, job.depositAddress, hiroKey); } catch {}
  let holdsNft = true; try { holdsNft = (await heldInscriptions(network, core, job.depositAddress, hiroKey)).length > 0; } catch {}
  if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
  else { job.keepKey = true; job.keepKeyReason = leftover == null ? 'balance unconfirmed' : holdsNft ? 'wallet still holds an inscription — return it with recover-all' : `wallet still holds ${leftover} uSTX — sweep with recover-all`; }
  job.status = job.items.some((i) => i.status !== 'INSCRIBED') ? 'COMPLETE_WITH_SKIPS' : 'COMPLETE'; writeJob(jobDir, job);
  return { receipt };
}

// Failsafe: return EVERYTHING to the funder, then discard the key. Used on error or timeout so a
// deposit wallet is guaranteed temporary — it never keeps a key while it still holds value.
export async function refundAndClose(opts) {
  const { job, hiroKey = '', jobDir, reason: reasonIn = 'cancelled', receiptsDir } = opts;
  // Batch jobs: the refund receipt/reason states exactly how far the batch got — and that
  // EVERYTHING (minted items, escrowed parents, funds) goes back to the sender.
  const reason = job.items
    ? `${reasonIn} · batch: ${job.items.filter((i) => i.tokenId).length}/${job.items.length} items inscribed — all inscriptions and funds returned`
    : reasonIn;
  const net = job.net || 'mainnet';
  if (job.mock) {
    const rid = String(Math.floor(1000 + Math.random() * 9000));
    const d = receiptData(job, { received: BigInt(job.depositReceivedUstx || job.requiredUstx), agentFee: 0n, change: BigInt(job.depositReceivedUstx || job.requiredUstx), receiptTokenId: rid, outcome: 'refunded', note: reason });
    if (receiptsDir) saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(d));
    job.status = 'CANCELLED'; job.cancelReason = reason; job.cancelledAt = new Date().toISOString(); job.receiptTokenId = rid; delete job.ephemeralMnemonic; writeJob(jobDir, job);
    return { cancelled: true, mock: true };
  }
  // GUARD: if the inscription was already delivered to the user, this job SUCCEEDED. An error/timeout in
  // the tail must NEVER mint a contradictory "refunded" receipt or mark it CANCELLED — only best-effort
  // sweep any leftover STX back to the user, then finalize COMPLETE. (Fixes the double-receipt / false-fail.)
  if (job.inscriptionDelivered || job.status === 'COMPLETE' || job.status === 'COMPLETE_WITH_SKIPS') {
    if (job.ephemeralMnemonic) {
      const network = netOf(net); const dep = deriveFrom(job.ephemeralMnemonic, net); const core = [DEPLOYER, job.core];
      const to = (await resolveFunder(job, network, hiroKey)) || job.user;
      const nftReturns = await returnAllHeldNfts(job, network, core, dep.key, dep.address, to, hiroKey);   // e.g. a parent whose return failed in the deliver tail
      if (nftReturns.length) job.nftReturns = [...(job.nftReturns || []), ...nftReturns];
      if (to) { try { const sw = await sweepStxTo(network, dep.key, dep.address, to, hiroKey); if (sw.sent) { job.refundTx = sw.tx; job.refundedUstx = sw.amount; } } catch {} }
      let leftover = null; try { leftover = await balance(network, dep.address, hiroKey); } catch {}
      let holdsNft = true; try { holdsNft = (await heldInscriptions(network, core, dep.address, hiroKey)).length > 0; } catch {}
      if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
      else if (leftover != null) { job.keepKey = true; job.keepKeyReason = holdsNft ? 'wallet still holds an inscription — return it with recover-all' : `~${leftover} uSTX leftover — sweep with recover-all`; }
    }
    if (job.status !== 'COMPLETE_WITH_SKIPS') job.status = 'COMPLETE';
    writeJob(jobDir, job);
    return { alreadyDelivered: true };
  }
  if (!job.ephemeralMnemonic) { writeJob(jobDir, job); return { noKey: true }; }
  const network = netOf(net); const core = [DEPLOYER, job.core]; const dep = deriveFrom(job.ephemeralMnemonic, net);
  // NEVER-STRAND GUARD: a job that was never funded must NOT have its key deleted on expiry — a slow
  // payment confirming after cancellation would land at a keyless address and be lost forever. Instead:
  // park it as EXPIRED (key kept), and only after EXPIRE_GRACE_MS with a confirmed-zero balance and an
  // empty mempool (opts.final, driven by the reaper) is the key discarded. If funds DID arrive by then,
  // fall through to the normal refund path below, which sweeps everything back to the payer.
  if (!job.depositReceivedUstx) {
    let bal = null; try { bal = await balance(network, dep.address, hiroKey); } catch {}
    const pending = (bal != null && bal === 0n) ? await hasPendingInbound(network, dep.address, hiroKey) : true;
    // NEVER-STRAND (NFT edition): the user may have sent the parent inscription but no (or not enough)
    // STX. Send any held inscription back to its sender before considering the wallet empty, and NEVER
    // discard the key while it still holds one.
    let heldNow = [];
    try { heldNow = await heldInscriptions(network, core, dep.address, hiroKey); } catch { heldNow = (job.parents || []).length ? ['?'] : []; }
    if (heldNow.length) {
      const to = (await resolveFunder(job, network, hiroKey)) || job.user;
      const returned = await returnAllHeldNfts(job, network, core, dep.key, dep.address, to, hiroKey);
      if (returned.length) { job.nftReturns = [...(job.nftReturns || []), ...returned]; writeJob(jobDir, job); }
      try { heldNow = await heldInscriptions(network, core, dep.address, hiroKey); } catch { heldNow = ['?']; }
      if (heldNow.length) { job.status = 'EXPIRED'; job.expiredAt = job.expiredAt || new Date().toISOString(); job.keepKey = true; job.keepKeyReason = 'wallet still holds an inscription — return it with recover-all'; writeJob(jobDir, job); return { expired: true, keyKept: true, holdsNft: true }; }
    }
    if (bal === 0n && !pending) {
      if (opts.final) { delete job.ephemeralMnemonic; job.status = 'CANCELLED'; job.cancelReason = reason; job.cancelledAt = new Date().toISOString(); writeJob(jobDir, job); return { cancelled: true, neverFunded: true }; }
      job.status = 'EXPIRED'; job.expiredAt = job.expiredAt || new Date().toISOString(); job.cancelReason = reason; writeJob(jobDir, job);
      return { expired: true, keyKept: true };
    }
    // balance unknown or funds present/pending → keep the key and let the normal path (or a later tick) handle it
    if (bal == null) { job.status = 'EXPIRED'; job.expiredAt = job.expiredAt || new Date().toISOString(); writeJob(jobDir, job); return { expired: true, keyKept: true, balanceUnconfirmed: true }; }
    if (bal === 0n && pending) { job.status = 'EXPIRED'; job.expiredAt = job.expiredAt || new Date().toISOString(); writeJob(jobDir, job); return { expired: true, keyKept: true, pendingInbound: true }; }
    job.depositReceivedUstx = bal.toString();   // funds arrived late → refund them via the normal path below
  }
  let returnTo = (await resolveFunder(job, network, hiroKey)) || job.user;   // prefer the actual payer; fall back to recipient only if undetectable
  const out = { reason, deliveredNfts: [], refundTx: null };
  // 1) hand back EVERY inscription this wallet holds: escrowed parents, anything it minted (token /
  //    receipt), and any WRONG inscription sent by mistake (strays return to whoever sent them).
  const nftReturns = await returnAllHeldNfts(job, network, core, dep.key, dep.address, returnTo, hiroKey);
  for (const r of nftReturns) { if (r.tx) out.deliveredNfts.push({ id: r.id, tx: r.tx, to: r.to }); else out.nftError = `#${r.id}: ${r.error || 'no return address'}`; }
  if (nftReturns.length) { job.nftReturns = [...(job.nftReturns || []), ...nftReturns]; writeJob(jobDir, job); }
  // 1b) best-effort: record a refund receipt on-chain (single-tx) so even an aborted job leaves a record
  if (returnTo) {
    try {
      const b0 = await balance(network, dep.address, hiroKey);
      const need = BigInt(job.receiptProtocol || '110000') + 80000n + REFUND_TX_FEE;
      if (b0 > need + 50000n) {
        const d = receiptData(job, { received: BigInt(job.depositReceivedUstx || job.requiredUstx), agentFee: 0n, change: b0 - need, receiptTokenId: null, recipient: returnTo, outcome: 'refunded', note: reason });
        const r = await inscribeReceipt({ core, network, key: dep.key, fromAddr: dep.address, hiroKey, html: buildReceiptHtml(d), uri: `xtrata:receipt/${job.jobId}`, deps: job.tokenId ? [job.tokenId] : [] });
        if (r.tokenId) { try { await sendNft(core, network, dep.key, dep.address, r.tokenId, returnTo, hiroKey); } catch {} job.receiptTokenId = r.tokenId; out.receiptTokenId = r.tokenId; if (receiptsDir) saveReceiptHtml(receiptsDir, job.jobId, buildReceiptHtml(d)); }
      }
    } catch (e) { out.receiptError = String((e && e.message) || e); }
  }
  // 2) sweep all remaining STX back to the funder (retry through the post-confirmation settle race)
  if (returnTo) { try { const sw = await sweepStxTo(network, dep.key, dep.address, returnTo, hiroKey); if (sw.sent) { out.refundTx = sw.tx; out.refundedUstx = sw.amount; } } catch (e) { out.refundError = String((e && e.message) || e); } }
  // 3) discard the key ONLY once the wallet is confirmed empty (no STX above dust AND no inscriptions);
  //    otherwise keep it for manual recovery
  let leftover = null; try { leftover = await balance(network, dep.address, hiroKey); } catch {}
  let holdsNft = true; try { holdsNft = (await heldInscriptions(network, core, dep.address, hiroKey)).length > 0; } catch {}
  if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) { delete job.ephemeralMnemonic; job.status = 'CANCELLED'; }
  else { job.keepKey = true; job.status = 'NEEDS_RECOVERY'; job.keepKeyReason = holdsNft ? 'wallet still holds an inscription — return it with recover-all' : `refund unconfirmed; ~${leftover ?? '?'} uSTX may remain`; }
  job.cancelReason = reason; job.cancelledAt = new Date().toISOString(); if (out.refundTx) job.refundTx = out.refundTx;
  writeJob(jobDir, job);
  return out;
}

// Is an inbound STX transfer to `addr` sitting in the mempool? (Payment sent but not yet confirmed.)
// Conservative: on API error returns true, so callers never treat "unknown" as "definitely empty".
export async function hasPendingInbound(network, addr, hiroKey = '', onError = true) {
  try {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/mempool?limit=20`, hiroKey)).json();
    return (d.results || []).some((tx) => tx.token_transfer && tx.token_transfer.recipient_address === addr);
  } catch { return onError; }   // default true = conservative for key-lifecycle decisions; pass false for UI signals
}

// Who funded the deposit address? Returns the sender principal that paid the MOST STX in total.
// DUST-RESISTANT: deposit addresses are public, so an attacker could send 1 uSTX first to try to
// register as the "funder" (and receive the fast-track inscription + all refunds). Taking the
// largest cumulative sender — not the first inbound — means the real payer always wins.
const topSender = (totals) => {
  let best = null, bestAmt = -1n;
  for (const [sender, amt] of totals) if (amt > bestAmt) { best = sender; bestAmt = amt; }
  return best;
};
export async function detectFunder(network, addr, hiroKey = '') {
  try {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/stx_inbound?limit=50`, hiroKey)).json();
    const totals = new Map();
    for (const r of (d.results || [])) {
      const amt = BigInt(r.amount || '0');
      if (r.sender && amt > 0n) totals.set(r.sender, (totals.get(r.sender) || 0n) + amt);
    }
    if (totals.size) return topSender(totals);
  } catch {}
  try {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/address/${addr}/transactions?limit=50`, hiroKey)).json();
    const totals = new Map();
    for (const r of (d.results || [])) {
      const tx = r.tx || r;
      if (tx.token_transfer && tx.token_transfer.recipient_address === addr && tx.sender_address) {
        const amt = BigInt(tx.token_transfer.amount || '0');
        if (amt > 0n) totals.set(tx.sender_address, (totals.get(tx.sender_address) || 0n) + amt);
      }
    }
    if (totals.size) return topSender(totals);
  } catch {}
  return null;
}

// ---------- parent escrow (send parent in → mint child with relationship → parent + child go home) ----------
// Every xtrata inscription NFT the deposit address currently holds (Hiro holdings API).
// Conservative: on API error throws — callers must not treat "unknown" as "holds nothing".
export async function heldInscriptions(network, core, addr, hiroKey = '') {
  const asset = `${core[0]}.${core[1]}::xtrata-inscription`;
  const ids = []; let offset = 0;
  for (;;) {
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${encodeURIComponent(asset)}&limit=50&offset=${offset}`, hiroKey)).json();
    const rs = d.results || [];
    for (const r of rs) { const m = /u?(\d+)/.exec(r.value && r.value.repr || ''); if (m) ids.push(m[1]); }
    offset += rs.length;
    if (rs.length < 50 || offset >= Number(d.total || 0)) break;
  }
  return ids;
}
// Who sent NFT `tokenId` to `addr`? (Last transfer event whose recipient is addr.) Best-effort → null.
export async function detectNftSender(network, core, addr, tokenId, hiroKey = '') {
  try {
    const asset = `${core[0]}.${core[1]}::xtrata-inscription`;
    const d = await (await hfetch(`${network.coreApiUrl}/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}&value=${encodeURIComponent('u' + tokenId)}&limit=20`, hiroKey)).json();
    for (const ev of (d.results || [])) if (ev.recipient === addr && ev.sender && ev.sender !== addr) return ev.sender;
  } catch {}
  return null;
}
/**
 * Parent gate: are all declared parents in the deposit wallet, and is anything UNEXPECTED there?
 * unexpected = an inscription the wallet holds that is neither a declared parent nor something this
 * job minted (token/receipt). A user who sends the WRONG inscription trips `unexpected`, and the
 * caller returns EVERYTHING (all NFTs + all STX) to the sender rather than inscribing.
 */
export async function parentsStatus(job, hiroKey = '') {
  const required = (job.parents || []).map(String);
  if (job.mock) return { required, held: required, missing: [], unexpected: [], ok: true };
  const network = netOf(job.net || 'mainnet'); const core = [DEPLOYER, job.core];
  const own = job.depositAddress;
  let heldAll = null;
  try { heldAll = await heldInscriptions(network, core, own, hiroKey); } catch {}
  if (heldAll == null) {   // holdings API down → fall back to per-parent owner checks (can't see strays)
    const held = [], missing = [];
    for (const pid of required) ((await ownerOf(core, network, pid)) === own ? held : missing).push(pid);
    return { required, held, missing, unexpected: [], ok: missing.length === 0, holdingsUnverified: true };
  }
  const mine = new Set([...(required), job.tokenId, job.receiptTokenId, ...((job.items || []).map((i) => i.tokenId))].filter(Boolean).map(String));
  const held = required.filter((p) => heldAll.includes(p));
  const missing = required.filter((p) => !heldAll.includes(p));
  const unexpected = heldAll.filter((id) => !mine.has(String(id)));
  return { required, held, missing, unexpected, ok: missing.length === 0 && unexpected.length === 0 };
}
/**
 * Return EVERY inscription the deposit wallet holds to its rightful home. Wrong/stray NFTs go back to
 * whoever sent them (NFT history) when detectable, else to `fallbackTo` (the STX funder). Never throws.
 */
async function returnAllHeldNfts(job, network, core, key, fromAddr, fallbackTo, hiroKey) {
  const out = [];
  let ids = [];
  try { ids = await heldInscriptions(network, core, fromAddr, hiroKey); } catch {}
  for (const extra of [...(job.parents || []), job.tokenId, job.receiptTokenId, ...((job.items || []).map((i) => i.tokenId))].filter(Boolean).map(String))
    if (!ids.includes(extra)) ids.push(extra);
  const itemTokenIds = new Set(((job.items || []).map((i) => i.tokenId)).filter(Boolean).map(String));
  for (const id of ids) {
    try {
      if ((await ownerOf(core, network, id)) !== fromAddr) continue;      // not (or no longer) ours to move
      const isDeclared = (job.parents || []).map(String).includes(String(id)) || String(id) === String(job.tokenId) || String(id) === String(job.receiptTokenId) || itemTokenIds.has(String(id));
      const sender = await detectNftSender(network, core, fromAddr, id, hiroKey);
      const to = isDeclared ? (fallbackTo || sender) : (sender || fallbackTo);   // strays go back to whoever sent them
      if (!to) continue;
      const tx = await sendNft(core, network, key, fromAddr, id, to, hiroKey);
      out.push({ id: String(id), to, tx });
    } catch (e) { out.push({ id: String(id), error: errMsg(e) }); }
  }
  return out;
}

// Fast-track auto-pilot: detect funder -> inscribe -> deliver + refund + wipe, persisting each phase.
export async function autoRunJob(opts) {
  const { job, enginePath, hiroKey = '', jobDir, receiptsDir, onPhase } = opts;
  const net = job.net || 'mainnet'; const network = netOf(net);
  const phase = (status) => { job.status = status; writeJob(jobDir, job); if (onPhase) { try { onPhase(status, job); } catch {} } };
  // Who actually paid? Source of truth for delivery (fast-track) AND refunds.
  const funder = job.mock ? 'SP_MOCK_SENDER' : await detectFunder(network, job.depositAddress, hiroKey);
  if (!funder) throw new Error('could not determine the paying address');
  job.funder = funder; writeJob(jobDir, job);
  // RAILROAD: if this job is locked to a specific funding wallet and a DIFFERENT wallet paid, do not
  // inscribe — return everything straight back to whoever actually paid. (No misdirected inscriptions.)
  if (job.fastTrack && job.expectedFunder && !addrEq(funder, job.expectedFunder)) {
    if (onPhase) { try { onPhase('CANCELLED', job); } catch {} }
    await refundAndClose({ job, hiroKey, jobDir, receiptsDir, reason: `paid from ${funder} but this job is locked to ${job.expectedFunder} — returned to sender` });
    return { rejected: true, funder, expected: job.expectedFunder };
  }
  // Fast-track = deposit-once, deliver-to-payer: the payer IS the recipient (overrides any preset).
  // The arbitrary-recipient "airdrop" case is the non-fast-track lane (job.user honoured; change still
  // returns to the funder via resolveFunder).
  if (job.fastTrack || !job.user) { job.user = funder; writeJob(jobDir, job); }
  // PARENT ESCROW GATE: a parented job also needs the parent inscription(s) in the deposit wallet.
  //  - wrong inscription sent → return EVERYTHING (all NFTs + all STX) to the sender, no inscribing;
  //  - parents not here yet   → park as AWAITING_PARENT and let the watcher re-poll (bounded by
  //    PARENT_WINDOW_MS from funding — after that, full refund).
  if ((job.parents || []).length) {
    if (!job.fundedAt) { job.fundedAt = new Date().toISOString(); writeJob(jobDir, job); }
    const ps = await parentsStatus(job, hiroKey);
    if (ps.unexpected && ps.unexpected.length) {
      if (onPhase) { try { onPhase('CANCELLED', job); } catch {} }
      await refundAndClose({ job, hiroKey, jobDir, receiptsDir, reason: `wrong inscription received (token #${ps.unexpected.join(', #')} is not a declared parent of this job) — all inscriptions and funds returned to sender` });
      return { rejected: true, unexpected: ps.unexpected };
    }
    if (ps.missing.length) {
      const waited = Date.now() - (Date.parse(job.fundedAt) || Date.now());
      if (waited > PARENT_WINDOW_MS) {
        if (onPhase) { try { onPhase('CANCELLED', job); } catch {} }
        await refundAndClose({ job, hiroKey, jobDir, receiptsDir, reason: `parent inscription #${ps.missing.join(', #')} not received within ${Math.round(PARENT_WINDOW_MS / 60000)} min of funding — everything returned to sender` });
        return { rejected: true, parentTimeout: true, missing: ps.missing };
      }
      job.status = 'AWAITING_PARENT';
      job.progress = `deposit received — now send parent inscription #${ps.missing.join(', #')} to ${job.depositAddress} (transfer on ${DEPLOYER}.${job.core}); it will be returned with your new inscription`;
      job.progressAt = new Date().toISOString(); writeJob(jobDir, job);
      if (onPhase) { try { onPhase('AWAITING_PARENT', job); } catch {} }
      return { awaitingParent: true, missing: ps.missing };
    }
  }
  phase('INSCRIBING');
  await runJob({ job, enginePath, hiroKey, jobDir });   // sets tokenId + status INSCRIBED
  phase('DELIVERING');
  const r = await deliverJob({ job, hiroKey, jobDir, receiptsDir });  // receipt + deliver both + agent fee + refund + wipe
  return { tokenId: job.tokenId, receipt: r.receipt, user: job.user };
}

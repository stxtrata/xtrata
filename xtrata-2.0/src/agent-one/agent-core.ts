// agent-core.ts — FULLY IN-BROWSER Agent One. No backend.
// Bundled by Vite into wizard/agent-one.js; exposes window.XtrataAgent for the wizard UI.
//
// - Reads/broadcasts via the same-origin /hiro Pages-Function proxy (HIRO_API_KEY stays server-side).
// - Ephemeral deposit wallet generated in-browser; key + job meta persisted to localStorage so the
//   user can always reclaim funds (resume-or-refund) even after a crash. File BYTES live in memory
//   only — on reload, a funded job whose bytes are gone is REFUNDED (never silently stranded).
// - Single-tx mint for <=32 chunks and for all receipts (incl. failure/refund receipts).
// - Guaranteed temporary: on success, error, OR timeout the wallet is emptied (deliver + refund),
//   then the key is discarded. The only time a key persists is if a refund can't confirm.
//
// UNTESTED IN THIS ENV — validate with XAO_CONFIG.mock=true in a browser first, then a small live job.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import {
  makeContractCall, makeSTXTokenTransfer, broadcastTransaction, callReadOnlyFunction,
  estimateTransaction, estimateTransactionByteLength,
  uintCV, standardPrincipalCV, bufferCV, stringAsciiCV, listCV,
  makeStandardSTXPostCondition, FungibleConditionCode, PostConditionMode, AnchorMode,
  cvToJSON, getAddressFromPrivateKey, TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const cfg: any = (window as any).XAO_CONFIG || {};
const MOCK: boolean = !!cfg.mock;
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE_NAME: string = cfg.core || 'xtrata-v3-2-3';
const CORE: [string, string] = [DEPLOYER, CORE_NAME];
const CHUNK = 16384, SINGLE_MAX = 32, BATCH = 32;
const HIRO_BASE: string = cfg.hiro || '/hiro/mainnet';         // same-origin proxy — reuses the site's existing /hiro/<network> Pages Function
const AGENT_FEE_PCT = BigInt(cfg.agentFeePct ?? 10);
const AGENT_FEE_ADDRESS: string = cfg.agentFeeAddress || DEPLOYER;
export const WINDOW_MS: number = Number(cfg.windowMs || 300000); // commence/stall window
export const PARENT_WINDOW_MS: number = Number(cfg.parentWindowMs || 900000); // 15 min after funding for parent NFT(s) to arrive, else full refund
const PERTX_MINER = 30000n, DELIVERY_RESERVE = 200000n, REFUND_TX_FEE = 5000n, MINT_CAP = 2000000n, RECEIPT_EST = 9000;
const PARENT_RETURN_FEE = 30000n;                                // per-parent NFT return-transfer reserve
const ITEM_DELIVERY_FEE = 30000n;                                // per extra batch-item delivery transfer reserve
export const MAX_BATCH_ITEMS = 40;                               // receipt deps cap 50 − parents/identity headroom

const network: any = new StacksMainnet();
network.coreApiUrl = location.origin + HIRO_BASE;   // routes read-only + broadcast through the proxy

const enc = new TextEncoder();
const hfetch = (p: string, init?: any) => fetch(location.origin + HIRO_BASE + p, init);
// Throttle-resistant sleep: window timers are throttled to ~1/min (and eventually frozen)
// in background tabs, which has stalled live uploads mid-run. Worker timers are exempt
// from tab timer throttling, so confirmation polls keep firing while the tab is hidden.
const sleepWorker: Worker | null = (() => { try { return new Worker(URL.createObjectURL(new Blob(['onmessage=(e)=>setTimeout(()=>postMessage(e.data.id),e.data.ms)'], { type: 'text/javascript' }))); } catch { return null; } })();
let sleepSeq = 0; const sleepWaiters = new Map<number, () => void>();
if (sleepWorker) sleepWorker.onmessage = (e: MessageEvent) => { const r = sleepWaiters.get(e.data); if (r) { sleepWaiters.delete(e.data); r(); } };
const sleep = (ms: number) => new Promise<void>((r) => { if (sleepWorker) { const id = ++sleepSeq; sleepWaiters.set(id, r); sleepWorker.postMessage({ id, ms }); } else setTimeout(r, ms); });
const chunkBytes = (d: Uint8Array) => { const o: Uint8Array[] = []; for (let i = 0; i < d.length; i += CHUNK) o.push(d.slice(i, i + CHUNK)); return o; };
const incHash = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) { const m = new Uint8Array(h.length + c.length); m.set(h, 0); m.set(c, h.length); h = sha256(m); } return h; };

function deriveFrom(mnemonic: string) {
  const c = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic.trim())).derive("m/44'/5757'/0'/0/0");
  const key = bytesToHex(c.privateKey as Uint8Array) + '01';
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
}
function newWallet() { const mnemonic = generateMnemonic(wordlist, 256); return { mnemonic, ...deriveFrom(mnemonic) }; }

async function ro(fn: string, args: any[] = []) {
  return cvToJSON(await callReadOnlyFunction({ contractAddress: CORE[0], contractName: CORE[1], functionName: fn, functionArgs: args, senderAddress: DEPLOYER, network } as any));
}
// A FAILED balance read must never look like an empty wallet. Defaulting the missing
// field to zero returned 0 for a rate-limited or errored response, and 0 is indistinguishable from
// "wallet is empty" — which broke two things at once on a wallet holding 11.66 STX:
// processFunded reported "not funded: need 11660000, have 0", and send() computed a
// fee cap of 0, so every estimate looked like a spike and the fallback broadcast a
// 0 µSTX fee that the node rejected as FeeTooLow. Throw instead; callers already
// treat a throw as transient and retry.
// v2, deliberately. Hiro has DEPRECATED /extended/v1/address/:addr/stx and now
// throttles it hard regardless of the API key — measured 10/10 429s on a burst
// through our keyed proxy, each carrying "Please update to the v2 endpoint". The
// key was never the problem; the endpoint was. Same response shape, so this is a
// drop-in swap. /extended/v2/addresses/:addr/balances/stx returned 10/10 200.
async function balance(addr: string): Promise<bigint> {
  const r = await hfetch(`/extended/v2/addresses/${addr}/balances/stx`);
  if (!r.ok) throw new Error(`balance lookup failed (HTTP ${r.status})`);
  const d: any = await r.json();
  if (d == null || d.balance == null) throw new Error('balance lookup returned no balance');
  return BigInt(d.balance);
}
// undefined = "let the tx builder pick its own nonce", which is a legitimate
// fallback rather than a wrong answer. But it used to be completely silent, so a
// nonce chosen from a different source — and the ConflictingNonceInMempool that
// can follow under load — had no trace in the log to explain it.
async function safeNonce(addr: string, logId: string | null = null): Promise<bigint | undefined> {
  if (MOCK) return undefined;
  try {
    const r = await hfetch(`/extended/v1/address/${addr}/nonces`);
    if (!r.ok) throw new Error(`nonce lookup ${r.status}`);
    const d: any = await r.json();
    const n = d && d.possible_next_nonce;
    if (n == null) throw new Error('nonce lookup returned no possible_next_nonce');
    return BigInt(n);
  } catch (e) {
    xaoLog(logId, `nonce lookup failed (${errMsg(e)}) — falling back to the wallet's own nonce`);
    return undefined;
  }
}
async function quoteFee(sizeBytes: number, chunks: number) {
  if (MOCK) return { single: chunks <= SINGLE_MAX, protocolFee: 100000n + BigInt(chunks) * 2000n, batches: Math.max(1, Math.ceil(chunks / SINGLE_MAX)) };
  const single = chunks <= SINGLE_MAX;
  const t: any = (await ro('quote-inscription-fee', [uintCV(BigInt(sizeBytes)), uintCV(BigInt(chunks)), uintCV(single ? 2 : 1)])).value.value;
  return { single, protocolFee: BigInt(t['total-fee'].value), batches: Number(t['upload-batches'].value) };
}
// Nakamoto-aware: poll 2 s for the first ~90 s (most blocks land in seconds), then 6 s. ~16 min ceiling.
async function waitTx(txid: string) {
  // Track whether we ever actually reached the API. Swallowing every read error and
  // then reporting "not confirmed" blames the transaction for what was an outage —
  // and the caller treats those two very differently.
  let reads = 0; let lastReadErr: unknown = null;
  for (let i = 0; i < 210; i++) {
    try {
      const r = await hfetch(`/extended/v1/tx/${txid}`);
      if (!r.ok) throw new Error(`tx lookup ${r.status}`);
      const d = await r.json();
      reads += 1;
      if (d.tx_status === 'success') return d;
      if (d.tx_status && String(d.tx_status).startsWith('abort')) throw new Error('TX ' + d.tx_status);
      // A dropped tx is never coming back — polling it for sixteen more minutes just
      // looks like a hang. Fail now, with the reason, so the retry can re-broadcast.
      if (d.tx_status && String(d.tx_status).startsWith('dropped')) throw new Error('TX ' + d.tx_status);
    } catch (e: any) {
      if (String(e).includes('TX abort') || String(e).includes('TX dropped')) throw e;
      lastReadErr = e;
    }
    await sleep(i < 45 ? 2000 : 6000);
  }
  if (!reads) throw new Error(`could not reach the API to confirm ${txid} (${errMsg(lastReadErr)}) — the transaction may well have landed`);
  throw new Error('not confirmed: ' + txid);
}
async function getIdByHash(h: Uint8Array) { const j: any = await ro('get-id-by-hash', [bufferCV(h)]); return j.value ? String(j.value.value) : null; }
async function ownerOf(id: string) { try { const o: any = await ro('get-owner', [uintCV(BigInt(id))]); const v = o.value && o.value.value; return v ? (v.value ?? v) : null; } catch { return null; } }

// ---- signed sends (browser) ----
// FEE POLICY — never crash a job on a fee estimate. The node's estimator returns absurd one-off spikes
// (observed: identical add-chunk-batch txs quoted 0.52 STX then 74–114 STX). Three stages:
//   1. 3 quick retries (6 s) — catches estimator glitches;
//   2. WAIT for fees to settle — up to 12 polls, 20 s apart, reported via onFeeWait so the UI can say
//      "network fees are high — waiting", not look stuck (our own ~512 KB batches can drive fees up);
//   3. bounded fallback — 2× the last successful fee for this fn, never above the cap.
const lastGoodFee = new Map<string, bigint>();

/**
 * Build the transaction at the node's LOW fee estimate rather than the middle one.
 *
 * @stacks/transactions defaults to `estimations[1]` — the middle of the node's
 * low/middle/high triple. Measured against mainnet:
 *
 *   seal-inscription   227 bytes    low 0.000227  mid 0.001191 (5.2x)  high 0.007937
 *   add-chunk-batch    524661 bytes low 0.524661  mid 0.524661         high 0.524661
 *
 * On small transactions the middle estimate is several times the low one, and the
 * low one is simply the network's 1 uSTX/byte relay floor — which is exactly what a
 * human picks by hand when they drop the wallet to its lowest setting. On a full
 * chunk batch all three collapse onto that same floor, so nothing changes there:
 * 512 KiB costs ~0.52 STX no matter what anyone chooses.
 *
 * Starting low is only safe because a rejection is now recoverable — the broadcast
 * path bumps 2x on FeeTooLow, up to three times, which is the same thing a human
 * does when the cheap fee bounces.
 */
async function quoteLowFee(opts: any) {
  if (opts.fee != null) return makeContractCall(opts);
  try {
    // fee: 1 keeps this local — no estimate request is made while building.
    const draft: any = await makeContractCall({ ...opts, fee: 1n });
    const est: any = await estimateTransaction(draft.payload, estimateTransactionByteLength(draft), network);
    const low = est && est[0] && est[0].fee != null ? BigInt(est[0].fee) : null;
    if (low != null && low > 0n) return makeContractCall({ ...opts, fee: low });
  } catch { /* estimator unavailable → fall back to the library's own default */ }
  return makeContractCall(opts);
}
async function send(key: string, from: string, fn: string, args: any[], spendCap: bigint | null, onFeeWait?: (m: string) => void, logId: string | null = null, feeCeiling: bigint | null = null) {
  const post = spendCap != null ? [makeStandardSTXPostCondition(from, FungibleConditionCode.LessEqual, spendCap)] : [];
  const opts: any = { contractAddress: CORE[0], contractName: CORE[1], functionName: fn, functionArgs: args, senderKey: key, network, postConditionMode: PostConditionMode.Deny, postConditions: post, anchorMode: AnchorMode.Any };
  try { opts.nonce = await safeNonce(from, logId); } catch {}
  // Cap the fee at the lesser of MINT_CAP and the balance minus what delivery+refund
  // still need, so NotEnoughFunds becomes a wait instead of a failure. A LOOKUP
  // failure must not lower the cap — a cap of 0 makes every estimate look like a
  // spike and ends in a 0 µSTX broadcast the node rejects as FeeTooLow.
  let effCap = MINT_CAP;
  let headroom: bigint | null = null;
  try {
    const bal = await balance(from);
    headroom = bal > (DELIVERY_RESERVE + REFUND_TX_FEE) ? bal - (DELIVERY_RESERVE + REFUND_TX_FEE) : 0n;
  } catch { headroom = null; }        // unknown → keep the safe default cap
  // Genuinely no headroom: say so instead of broadcasting something unpayable.
  if (headroom === 0n) throw new Error(`${fn}: deposit wallet has no headroom left for fees — nothing was broadcast`);
  if (headroom != null && headroom < effCap) effCap = headroom;
  // A caller that knows how much of the budget this one transaction may take (the
  // staged loop, which knows how many batches are left) tightens the ceiling further.
  if (feeCeiling != null && feeCeiling > 0n && feeCeiling < effCap) effCap = feeCeiling;
  let tx: any, fee: bigint;
  // The cheapest quote seen this run is the closest thing we have to the node's real
  // minimum. The fallback must never dip below it: a fee we KNOW will be rejected is
  // not a fallback, it is a guaranteed FeeTooLow.
  let cheapestQuote: bigint | null = null;
  for (let attempt = 0; ; attempt++) {
    tx = await quoteLowFee(opts);
    fee = BigInt(tx.auth.spendingCondition.fee.toString());
    if (cheapestQuote == null || fee < cheapestQuote) cheapestQuote = fee;
    xaoLog(logId, `${fn}: fee estimate ${fee} µSTX (cap ${effCap}, try ${attempt + 1})`);
    if (fee <= effCap) break;
    if (fee <= (effCap * 5n) / 4n) { tx = await makeContractCall({ ...opts, fee: effCap }); fee = effCap; break; }  // marginal overage: clamp to cap, don't burn retries
    if (attempt < 3) { xaoLog(logId, `${fn}: estimator spike — retrying (${attempt + 1}/3)`); await sleep(6000); continue; }
    if (attempt < 15) { const m = `network fees are high — waiting for them to settle (${attempt - 2}/12)`; xaoLog(logId, `${fn}: ${m}`); if (onFeeWait) try { onFeeWait(m); } catch {} await sleep(20000); continue; }
    // Out of patience. Reaching here means EVERY quote exceeded effCap * 5/4, so the
    // cheapest quote is necessarily above what this wallet can afford. The old
    // "bounded fallback" broadcast min(2 × last good fee, effCap) anyway — a fee
    // already known to be below every quote the node gave us, which is how a run
    // ended in "using bounded fallback fee 0" followed by FeeTooLow. There is no
    // affordable fee to fall back to; say so, spend nothing, and let the caller
    // retry later when either the fee market or the balance has moved.
    const floor = cheapestQuote ?? 0n;
    throw new Error(`${fn}: cannot afford the network fee — cheapest quote ${floor} µSTX, affordable ${effCap} µSTX. Nothing was broadcast.`);
  }
  let res: any = await broadcastTransaction(tx, network);
  // FeeTooLow is deterministic for a given fee — waiting cannot fix it, only a bigger
  // fee can. It used to fall out to the caller's retry, which re-ran the whole
  // estimate/wait cycle (up to four minutes) and arrived at the same rejected fee.
  for (let bump = 1; bump <= 3 && res?.error && /FeeTooLow/i.test(`${res.error} ${res.reason || ''}`); bump += 1) {
    const next = fee * 2n > effCap ? effCap : fee * 2n;
    if (next <= fee) { xaoLog(logId, `${fn}: FeeTooLow at ${fee} µSTX and already at the affordable ceiling — cannot bump further`); break; }
    xaoLog(logId, `${fn}: FeeTooLow at ${fee} µSTX — retrying at ${next} µSTX (bump ${bump}/3)`);
    tx = await makeContractCall({ ...opts, fee: next }); fee = next;
    res = await broadcastTransaction(tx, network);
  }
  if (res.error) { xaoLog(logId, `${fn}: broadcast REJECTED — ${res.error} ${res.reason || ''}`); throw new Error(`${fn}: ${res.error} ${res.reason || ''}`); }
  // Only a fee that ACTUALLY broadcast is "good". Recording it before the broadcast
  // meant a rejected fee seeded the next fallback, so one bad estimate poisoned
  // every later attempt for that function.
  lastGoodFee.set(fn, fee);
  const txid = res.txid || res;
  xaoLog(logId, `${fn}: broadcast 0x${String(txid).replace(/^0x/, '')} · fee ${fee} µSTX — awaiting confirmation`);
  const t0 = Date.now(); const d = await waitTx(txid);
  xaoLog(logId, `${fn}: confirmed in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { txid, d };
}
async function sendNft(key: string, from: string, id: string, to: string) {
  let nonce: bigint | undefined; try { nonce = await safeNonce(from); } catch {}
  const tx: any = await makeContractCall({ contractAddress: CORE[0], contractName: CORE[1], functionName: 'transfer', functionArgs: [uintCV(BigInt(id)), standardPrincipalCV(from), standardPrincipalCV(to)], senderKey: key, network, postConditionMode: PostConditionMode.Allow, anchorMode: AnchorMode.Any, nonce } as any);
  const res: any = await broadcastTransaction(tx, network); if (res.error) throw new Error('nft: ' + res.error + (res.reason ? ' ' + res.reason : '')); const txid = res.txid || res; await waitTx(txid); return txid;
}
async function sendStx(key: string, amount: bigint, to: string, fee: bigint) {
  let nonce: bigint | undefined; try { nonce = await safeNonce(getAddressFromPrivateKey(key, TransactionVersion.Mainnet)); } catch {}
  const tx: any = await makeSTXTokenTransfer({ recipient: to, amount, senderKey: key, network, fee, anchorMode: AnchorMode.Any, nonce } as any);
  const res: any = await broadcastTransaction(tx, network); if (res.error) throw new Error('stx: ' + res.error + (res.reason ? ' ' + res.reason : '')); const txid = res.txid || res; await waitTx(txid); return txid;
}
const tidFrom = (d: any) => { const r = d?.tx_result?.repr || ''; const m = /token-id u(\d+)/.exec(r) || /\(ok u(\d+)\)/.exec(r); return m ? m[1] : null; };

// ---- mint paths ----
async function mintSingle(key: string, from: string, data: Uint8Array, mime: string, uri: string, deps: string[], spendCap: bigint, parents: string[] = [], logId: string | null = null) {
  const chunks = chunkBytes(data); const h = incHash(chunks);
  const depCV = (deps || []).map((d) => uintCV(BigInt(d)));
  const parentCV = (parents || []).map((p) => uintCV(BigInt(p)));
  // Parents require the -with-relationships entrypoint (contract checks tx-sender OWNS every parent).
  const fn = parentCV.length ? 'mint-single-tx-with-relationships' : (depCV.length ? 'mint-single-tx-recursive' : 'mint-single-tx');
  const args: any[] = [bufferCV(h), stringAsciiCV(mime), uintCV(BigInt(data.length)), listCV(chunks.map((c) => bufferCV(c))), stringAsciiCV(uri)];
  if (parentCV.length) { args.push(listCV(depCV), listCV(parentCV)); }
  else if (depCV.length) args.push(listCV(depCV));
  // IDEMPOTENT: if this exact hash is already inscribed (e.g. retry after a confirmation timeout),
  // return the existing token — a resume can never double-mint or double-spend.
  const pre = await getIdByHash(h); if (pre) return pre;
  const { d } = await send(key, from, fn, args, spendCap, undefined, logId);
  return tidFrom(d) || (await getIdByHash(h));
}
async function stagedInscribe(job: any, key: string, from: string, data: Uint8Array, onProg: (m: string) => void, target: any = job) {
  // `target` = the job (single flow) or ONE batch item — supplies uri/mime/deps/parents.
  const chunks = chunkBytes(data); const total = chunks.length; const h = incHash(chunks);
  const existing = await getIdByHash(h); if (existing) { onProg(`already inscribed #${existing}`); return existing; }
  const q: any = (await ro('quote-inscription-fee', [uintCV(BigInt(data.length)), uintCV(BigInt(total)), uintCV(1)])).value.value;
  const beginFee = BigInt(q['begin-fee'].value), sealFee = BigInt(q['seal-fee'].value);
  onProg(`planned · ${total} chunks`);
  let idx: number | null = null;
  try { const st: any = (await ro('get-upload-state', [bufferCV(h), standardPrincipalCV(from)])); idx = st.value ? Number(st.value.value['current-index'].value) : null; } catch { idx = null; }
  if (idx === null) { await send(key, from, 'begin-or-get', [bufferCV(h), stringAsciiCV(target.mime), uintCV(BigInt(data.length)), uintCV(BigInt(total))], beginFee, onProg, job.jobId); idx = 0; onProg(`upload started · 0/${total}`); }
  else if (idx > 0) { onProg(`resuming upload · ${idx}/${total} chunks already on-chain`); }
  while (idx < total) {
    // Cancellation checkpoint. Only ever BETWEEN batches: the previous send() has
    // settled and the next has not started, so nothing is in flight when we stop.
    // Chunks already uploaded stay on-chain (harmless, unsealed); the deposit is
    // swept home by the refund that follows.
    assertNotCancelled(job.jobId);
    const batch = chunks.slice(idx, idx + BATCH);
    // Fee runway check (guide: ~1 STX/MB mining + 20% drift). If the balance can no
    // longer cover the projected remaining batches + seal + delivery, say so loudly —
    // send() will still clamp/wait, but the user sees WHY the job is crawling.
    // Fee ceiling for THIS batch, derived from what is actually left to spend.
    // MINT_CAP alone is 2 STX per transaction — over three times what the quote
    // budgets per batch — so a job could accept 1.5 STX batches against a 0.64 STX
    // budget and spend its way into a dead end: deposit gone, nothing sealed. The
    // runway was already computed here and only used to print a warning.
    let batchFeeCap: bigint | null = null;
    try {
      const remBatches = BigInt(Math.max(1, Math.ceil((total - idx) / BATCH)));
      const perBatch = lastGoodFee.get('add-chunk-batch') ?? (BigInt(BATCH * CHUNK) * 6n) / 5n;
      const runway = remBatches * perBatch + sealFee + DELIVERY_RESERVE + REFUND_TX_FEE;
      const bal = await balance(from);
      // Reserve what the tail still needs, then share the rest across the batches
      // left. Never let one batch eat the budget for the others.
      const tail = sealFee + DELIVERY_RESERVE + REFUND_TX_FEE;
      const spendable = bal > tail ? bal - tail : 0n;
      batchFeeCap = spendable / remBatches;
      if (bal < runway) { const m = `fee runway low — ${bal} µSTX left vs ~${runway} projected for ${remBatches} remaining batch(es); this batch is capped at ${batchFeeCap} µSTX`; xaoLog(job.jobId, m); onProg(m); }
    } catch { batchFeeCap = null; }
    await send(key, from, 'add-chunk-batch', [bufferCV(h), listCV(batch.map((c) => bufferCV(c)))], null, onProg, job.jobId, batchFeeCap);
    const st: any = (await ro('get-upload-state', [bufferCV(h), standardPrincipalCV(from)])); const ni = st.value ? Number(st.value.value['current-index'].value) : null; if (ni === null || ni <= idx) throw new Error(`upload stalled at ${idx}`); idx = ni; onProg(`uploading · ${idx}/${total}`);
  }
  // Last chance to stop: sealing is what MINTS. Past this point the token exists and
  // a cancel can no longer be honoured as a refund — it becomes a recovery instead.
  assertNotCancelled(job.jobId);
  const deps = ((target.resolvedDeps || target.deps) || []).map((d: string) => uintCV(BigInt(d)));
  const parents = ((target.mergedParents || target.parents) || []).map((p: string) => uintCV(BigInt(p)));
  // Parents: seal-with-relationships requires the sealer (deposit wallet) to OWN the parents.
  const sealFn = parents.length ? 'seal-with-relationships' : (deps.length ? 'seal-recursive' : 'seal-inscription');
  const sealArgs: any[] = parents.length ? [bufferCV(h), stringAsciiCV(target.uri), listCV(deps), listCV(parents)]
    : deps.length ? [bufferCV(h), stringAsciiCV(target.uri), listCV(deps)] : [bufferCV(h), stringAsciiCV(target.uri)];
  const { d } = await send(key, from, sealFn, sealArgs, sealFee, onProg, job.jobId); onProg('sealed'); return tidFrom(d) || (await getIdByHash(h));
}

// ============================================================================
// In-browser job lifecycle — ported from svc/core.mjs (same maths + invariants).
// I/O differs only: fs → localStorage, file bytes → in-memory Map, fetch → /hiro,
// the staged engine subprocess → the ported stagedInscribe() above. NOTE: audio/SUNO
// conversion happens in the UI BEFORE createJob (the File passed in is already the
// final artifact), so there is no server-side ffmpeg step here.
// ============================================================================
const ustxToStx = (u: any) => (Number(u) / 1e6).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
const errMsg = (e: any) => String((e && e.message) || e);
const addrEq = (a: any, b: any) => !!a && !!b && String(a).trim() === String(b).trim();
const TRANSIENT_TX = /NotEnoughFunds|ConflictingNonceInMempool|TooMuchChaining|too much chaining|bad nonce|NoSuchAccount/i;
let _stxUsd: { v: number | null; t: number } = { v: null, t: 0 };
async function stxUsdPrice(): Promise<number | null> {
  if (Date.now() - _stxUsd.t < 60000) return _stxUsd.v;          // 60s cache (used by estimate + receipt)
  try { const d: any = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd')).json(); const p = d && d.blockstack && d.blockstack.usd; _stxUsd = { v: p ? Number(p) : null, t: Date.now() }; } catch { _stxUsd = { v: _stxUsd.v, t: Date.now() }; }
  return _stxUsd.v;
}
const balOf = async (job: any): Promise<bigint> => (MOCK ? BigInt(job.requiredUstx) : balance(job.depositAddress));

// ---------- localStorage job-state + in-memory file bytes ----------
const JOB_PREFIX = 'xao-job-';
const BYTES = new Map<string, Uint8Array>();                 // jobId -> file bytes (hot copy; also persisted to IndexedDB below)
const jobKey = (id: string) => JOB_PREFIX + id;

// ---------- IndexedDB byte persistence (survives reloads — localStorage can't hold multi-MiB files) ----------
const idbOpen = () => new Promise<IDBDatabase>((res, rej) => {
  try { const r = indexedDB.open('xtrata-agent-one', 1);
    r.onupgradeneeded = () => { try { r.result.createObjectStore('files'); } catch {} };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  } catch (e) { rej(e); }
});
async function idbSaveBytes(id: string, bytes: Uint8Array) {
  try { const db = await idbOpen();
    await new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(bytes, id); tx.oncomplete = res as any; tx.onerror = () => rej(tx.error); });
    db.close();
  } catch (e) { console.warn('xao: could not persist file bytes (reload-resume disabled for this job):', e); }
}
async function idbLoadBytes(id: string): Promise<Uint8Array | null> {
  try { const db = await idbOpen();
    const r: any = await new Promise((res, rej) => { const q = db.transaction('files').objectStore('files').get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
    db.close(); return r ? (r instanceof Uint8Array ? r : new Uint8Array(r)) : null;
  } catch { return null; }
}
async function idbDeleteBytes(id: string) { try { const db = await idbOpen(); db.transaction('files', 'readwrite').objectStore('files').delete(id); db.close(); } catch {} }
async function restoreBytes(id: string): Promise<boolean> {
  if (BYTES.has(id)) return true;
  const b = await idbLoadBytes(id); if (b && b.length) { BYTES.set(id, b); return true; } return false;
}

// ---------- verbose agent log: console [xao] lines + persisted job.log (cap 200, survives reload) ----------
export const AGENT_BUILD = '2026-07-25.10';
function xaoLog(id: string | null, msg: string) {
  try { console.info(`[xao ${new Date().toISOString().slice(11, 19)}]${id ? ' ' + id + ' ·' : ''} ${msg}`); } catch {}
  if (!id) return;
  try { const j = readJob(id); j.log = ((j.log || []).slice(-199)).concat(new Date().toISOString() + ' ' + msg); writeJob(j); } catch {}
}
function writeJob(j: any) { try { localStorage.setItem(jobKey(j.jobId), JSON.stringify(j)); } catch {} return j; }
function readJob(id: string): any { const s = localStorage.getItem(jobKey(id)); if (!s) throw new Error('job not found: ' + id); return JSON.parse(s); }
function listJobsRaw(): any[] { const o: any[] = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(JOB_PREFIX)) { try { o.push(JSON.parse(localStorage.getItem(k) as string)); } catch {} } } return o; }
const publicJob = (j: any) => { const { ephemeralMnemonic, ...pub } = j; return { ...pub, hasKey: !!ephemeralMnemonic }; };

// ---------- estimate (mirror core.estimate) ----------
async function estimate(opts: any) {
  const { bytes, marginUstx = '0', agentFeePct = AGENT_FEE_PCT, parentCount = 0, receipt = true } = opts;
  const chunks = Math.ceil(Number(bytes) / CHUNK) || 1;
  const q = await quoteFee(Number(bytes), chunks);
  const minerTxs = q.single ? 1n : BigInt(q.batches + 2);
  // Single-tx flows budget the mint at the full fee cap so a spike can never underfund it
  // (unused escrow auto-refunds as change). Staged flows keep the per-batch reserve and
  // lean on the balance-coupled ceiling in send().
  // Staged mining budget follows the operational guide: ~1 STX per MB observed on
  // mainnet (0.52 STX per 512 KiB batch) + 20% drift headroom → 1.2 µSTX per byte.
  const minerReserve = q.single ? MINT_CAP : (minerTxs * PERTX_MINER + (BigInt(Math.ceil(Number(bytes))) * 6n) / 5n);
  // On-chain receipt is optional: when off, its protocol+miner cost is left out of
  // the deposit (the HTML receipt is still generated locally at delivery time).
  const rq = await quoteFee(RECEIPT_EST, 1);                 // quoteFee handles MOCK internally
  const receiptProtocol = receipt === false ? 0n : rq.protocolFee;
  const receiptMiner = receipt === false ? 0n : PERTX_MINER + (BigInt(RECEIPT_EST) * 3n) / 2n;
  const parentReserve = BigInt(parentCount) * PARENT_RETURN_FEE;   // one NFT-return tx per escrowed parent
  const baseCosts = q.protocolFee + minerReserve + receiptProtocol + receiptMiner + parentReserve + DELIVERY_RESERVE + BigInt(marginUstx);
  const pct = BigInt(agentFeePct);
  const feeExact = (pct > 0n && pct < 100n) ? (baseCosts * pct) / (100n - pct) : 0n;
  const requiredExact = baseCosts + feeExact;
  const required = ((requiredExact + 9999n) / 10000n) * 10000n;            // round deposit UP to 0.01 STX
  const agentFeeUstx = (pct > 0n && pct < 100n) ? (required * pct) / 100n : 0n;
  const stxUsd = await stxUsdPrice();
  return { bytes: Number(bytes), chunks, single: q.single, batches: q.batches,
    protocolFee: q.protocolFee.toString(), minerReserve: minerReserve.toString(),
    receiptProtocol: receiptProtocol.toString(), receiptMiner: receiptMiner.toString(),
    deliveryReserve: DELIVERY_RESERVE.toString(), parentCount: Number(parentCount), parentReserve: parentReserve.toString(), marginUstx: String(marginUstx),
    agentFeePct: Number(pct), agentFeeUstx: agentFeeUstx.toString(), requiredUstx: required.toString(), stxUsd };
}

// ---------- batch estimate (mirror svc/core.estimateBatch) ----------
async function estimateBatch(opts: any) {
  const { itemsBytes = [], parentCount = 0, marginUstx = '0', agentFeePct = AGENT_FEE_PCT, receipt = true } = opts;
  if (!itemsBytes.length) throw new Error('itemsBytes required');
  if (itemsBytes.length > MAX_BATCH_ITEMS) throw new Error(`batch too large: ${itemsBytes.length} items (max ${MAX_BATCH_ITEMS})`);
  const items: any[] = [];
  let sumProtocol = 0n, sumMiner = 0n;
  for (const bytes of itemsBytes) {
    const chunks = Math.ceil(Number(bytes) / CHUNK) || 1;
    const q = await quoteFee(Number(bytes), chunks);
    const minerTxs = q.single ? 1n : BigInt(q.batches + 2);
    const minerReserve = minerTxs * PERTX_MINER + (BigInt(Math.ceil(Number(bytes))) * 3n) / 2n;
    items.push({ bytes: Number(bytes), chunks, single: q.single, batches: q.batches, protocolFee: q.protocolFee.toString(), minerReserve: minerReserve.toString() });
    sumProtocol += q.protocolFee; sumMiner += minerReserve;
  }
  const rq = await quoteFee(RECEIPT_EST, 1);
  const receiptProtocol = receipt === false ? 0n : rq.protocolFee;
  const receiptMiner = receipt === false ? 0n : PERTX_MINER + (BigInt(RECEIPT_EST) * 3n) / 2n;
  const parentReserve = BigInt(parentCount) * PARENT_RETURN_FEE;
  const deliveryReserve = DELIVERY_RESERVE + BigInt(Math.max(0, itemsBytes.length - 1)) * ITEM_DELIVERY_FEE;
  const baseCosts = sumProtocol + sumMiner + receiptProtocol + receiptMiner + parentReserve + deliveryReserve + BigInt(marginUstx);
  const pct = BigInt(agentFeePct);
  const feeExact = (pct > 0n && pct < 100n) ? (baseCosts * pct) / (100n - pct) : 0n;
  const required = (((baseCosts + feeExact) + 9999n) / 10000n) * 10000n;
  const agentFeeUstx = (pct > 0n && pct < 100n) ? (required * pct) / 100n : 0n;
  const stxUsd = await stxUsdPrice();
  return { items, count: itemsBytes.length, sumProtocol: sumProtocol.toString(), sumMiner: sumMiner.toString(),
    receiptProtocol: receiptProtocol.toString(), receiptMiner: receiptMiner.toString(),
    parentCount: Number(parentCount), parentReserve: parentReserve.toString(), deliveryReserve: deliveryReserve.toString(),
    marginUstx: String(marginUstx), agentFeePct: Number(pct), agentFeeUstx: agentFeeUstx.toString(),
    requiredUstx: required.toString(), stxUsd };
}

// ---------- receipt (copied from core: success + refunded) ----------
function receiptData(job: any, x: any) {
  const received = BigInt(x.received);
  const mainMiner = x.mainMinerFee != null ? BigInt(x.mainMinerFee) : (job.mainMinerFee ? BigInt(job.mainMinerFee) : BigInt(job.minerReserve));
  const fileProtocol = BigInt(job.protocolFee);
  const receiptProtocol = BigInt(job.receiptProtocol || '0');
  const receiptMiner = x.receiptMinerFee != null ? BigInt(x.receiptMinerFee) : BigInt(job.receiptMiner || '0');
  const agentFee = BigInt(x.agentFee);
  const change = x.change != null ? BigInt(x.change) : (received - fileProtocol - mainMiner - receiptProtocol - receiptMiner - agentFee);
  const changeR = change > 0n ? change : 0n;
  const totalPaid = received - changeR;
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
      ? { from: job.audioOptimize.from, to: job.audioOptimize.to, preset: job.audioOptimize.preset, bitrate: job.audioOptimize.bitrate, savedPct: job.audioOptimize.savedPct } : null,
    player: (job.sunoPlayer && job.sunoPlayer.ok)
      ? { title: job.sunoPlayer.title, artist: job.sunoPlayer.artist || '', hasCover: !!job.sunoPlayer.hasCover, playerBytes: job.sunoPlayer.playerBytes } : null,
  };
}
function buildReceiptHtml(d: any) {
  const row = (k: string, v: string) => `<div class="r"><span>${k}</span><span>${v}</span></div>`;
  const escHtml = (s: any) => String(s ?? '').replace(/[&<>]/g, (c: string) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as any)[c]));
  const stxr = (u: any) => ustxToStx(u) + ' STX';
  const usd = (u: any) => d.stxUsd ? ' · ~$' + (Number(u) / 1e6 * d.stxUsd).toFixed(2) : '';
  const short = (s: any) => s ? (s.length > 18 ? s.slice(0, 9) + '…' + s.slice(-6) : s) : '—';
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
${(d.parents && d.parents.length) ? row('Parent inscription' + (d.parents.length > 1 ? 's' : ''), d.parents.map((p: string) => '<span class="tok">#' + p + '</span>').join(' ') + ' · escrowed for the mint, returned to you with the child') : ''}
${row('Inscription token', '<span class="tok">#' + (d.tokenId ?? '—') + '</span>' + ((d.parents && d.parents.length) ? ' · child of #' + d.parents.join(', #') : ''))}
${row('Receipt token', d.receiptTokenId ? ('<span class="tok">#' + d.receiptTokenId + '</span>') : 'this inscription')}
${row('Delivered to', short(d.recipient))}
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
${(d.parents && d.parents.length) ? row('Parent inscription' + (d.parents.length > 1 ? 's' : ''), d.parents.map((p: string) => '<span class="tok">#' + p + '</span>').join(' ') + ' · returned to sender') : ''}
${row('Deposit received', stxr(d.depositReceived) + usd(d.depositReceived))}
<div class="tot">${row('Returned to you', stxr(d.changeReturned) + usd(d.changeReturned))}</div>`}
<div class="foot">Core ${d.core} · job ${d.jobId}${d.stxUsd ? ' · STX $' + d.stxUsd : ''} · settled on Bitcoin via Stacks</div>
</div></div></body></html>`;
}

// ---------- funder + retrying STX sends (mirror core) ----------
// DUST-RESISTANT: funder = the sender with the LARGEST CUMULATIVE inbound STX, not the first inbound.
// Deposit addresses are public — a 1 µSTX dust tx must never claim fast-track delivery + refunds.
async function detectFunder(addr: string): Promise<string | null> {
  const top = (m: Map<string, bigint>) => { let best: string | null = null, bestAmt = -1n; for (const [k, v] of m) if (v > bestAmt) { best = k; bestAmt = v; } return best; };
  // /transactions FIRST. stx_inbound is throttled alongside the deprecated balance
  // endpoint (measured 10/10 429s on a burst through our keyed proxy), which is why
  // "could not determine the paying address" kept firing on wallets whose payment was
  // plainly on chain. /transactions measured 10/10 200s, so it leads now and
  // stx_inbound is only the backstop.
  try {
    const r = await hfetch(`/extended/v1/address/${addr}/transactions?limit=50`);
    if (!r.ok) throw new Error(`tx list ${r.status}`);
    const d: any = await r.json();
    const totals = new Map<string, bigint>();
    for (const e of (d.results || [])) { const tx = e.tx || e; if (tx.token_transfer && tx.token_transfer.recipient_address === addr && tx.sender_address) { const a = BigInt(tx.token_transfer.amount || '0'); if (a > 0n) totals.set(tx.sender_address, (totals.get(tx.sender_address) || 0n) + a); } }
    if (totals.size) return top(totals);
  } catch {}
  try {
    const r = await hfetch(`/extended/v1/address/${addr}/stx_inbound?limit=50`);
    if (!r.ok) throw new Error(`stx_inbound ${r.status}`);
    const d: any = await r.json();
    const totals = new Map<string, bigint>();
    for (const e of (d.results || [])) { const a = BigInt(e.amount || '0'); if (e.sender && a > 0n) totals.set(e.sender, (totals.get(e.sender) || 0n) + a); }
    if (totals.size) return top(totals);
  } catch {}
  return null;
}
async function resolveFunder(job: any): Promise<string | null> { if (job.mock) return job.funder || 'SP_MOCK_SENDER'; if (job.funder) return job.funder; try { return await detectFunder(job.depositAddress); } catch { return null; } }

// ---------- parent escrow (mirror svc/core.mjs) ----------
// The contract requires the MINTER to own every parent at mint/seal (validate-parents →
// ERR-NOT-AUTHORIZED), so the user sends the parent inscription(s) to the deposit address alongside
// the STX; they are returned to the payer together with the child + change.
async function heldInscriptions(addr: string): Promise<string[]> {
  const asset = `${CORE[0]}.${CORE[1]}::xtrata-inscription`;
  const ids: string[] = []; let offset = 0;
  for (;;) {
    // Must THROW on a bad read. Returning [] made a failed lookup indistinguishable
    // from "this wallet holds nothing" — and every caller below already wraps this in
    // a try/catch written on the assumption that it throws, so those safety nets were
    // dead code. The dangerous one is refundAndClose's never-strand guard: a failed
    // read reported no inscription held and the deposit key was discarded, which would
    // strand an escrowed parent at an address nobody can spend from again.
    const r = await hfetch(`/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${encodeURIComponent(asset)}&limit=50&offset=${offset}`);
    if (!r.ok) throw new Error(`holdings lookup failed (HTTP ${r.status})`);
    const d: any = await r.json();
    if (!Array.isArray(d?.results)) throw new Error('holdings lookup returned no results');
    const rs = d.results;
    for (const r of rs) { const m = /u?(\d+)/.exec((r.value && r.value.repr) || ''); if (m) ids.push(m[1]); }
    offset += rs.length;
    if (rs.length < 50 || offset >= Number(d.total || 0)) break;
  }
  return ids;
}
async function detectNftSender(addr: string, tokenId: string): Promise<string | null> {
  try {
    const asset = `${CORE[0]}.${CORE[1]}::xtrata-inscription`;
    const d: any = await (await hfetch(`/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}&value=${encodeURIComponent('u' + tokenId)}&limit=20`)).json();
    for (const ev of (d.results || [])) if (ev.recipient === addr && ev.sender && ev.sender !== addr) return ev.sender;
  } catch {}
  return null;
}
async function parentsStatus(job: any) {
  const required: string[] = (job.parents || []).map(String);
  if (job.mock || MOCK) return { required, held: required, missing: [], unexpected: [], ok: true };
  const own = job.depositAddress;
  // OWNERSHIP comes from the contract, never from the holdings index. The gate asks
  // "does the deposit wallet own this parent at seal time", and get-owner answers that
  // authoritatively; the NFT holdings index lags chain state by seconds to minutes.
  // Gating on the index left the job insisting the parent had not arrived while a
  // contract read showed the deposit wallet already owned it — the escrow checklist
  // said "arrived" on one line and "now send the parent" on the next.
  const held: string[] = [], missing: string[] = [];
  for (const pid of required) (((await ownerOf(pid)) === own) ? held : missing).push(pid);
  // The index is still the only way to SEE a stray nobody declared.
  let heldAll: string[] | null = null;
  try { heldAll = await heldInscriptions(own); } catch {}
  if (heldAll == null) {
    return { required, held, missing, unexpected: [], ok: missing.length === 0, holdingsUnverified: true };
  }
  const mine = new Set([...required, job.tokenId, job.receiptTokenId, ...((job.items || []).map((i: any) => i.tokenId))].filter(Boolean).map(String));
  const unexpected = heldAll.filter((id) => !mine.has(String(id)));
  return { required, held, missing, unexpected, ok: missing.length === 0 && unexpected.length === 0 };
}
// Return EVERY inscription the deposit wallet holds. Strays go back to whoever sent them; declared
// parents / minted tokens go to `fallbackTo` (the payer). Never throws.
async function returnAllHeldNfts(job: any, key: string, fromAddr: string, fallbackTo: string | null) {
  const out: any[] = [];
  let ids: string[] = [];
  try { ids = await heldInscriptions(fromAddr); } catch {}
  for (const extra of [...(job.parents || []), job.tokenId, job.receiptTokenId, ...((job.items || []).map((i: any) => i.tokenId))].filter(Boolean).map(String)) if (!ids.includes(extra)) ids.push(extra);
  const itemTokenIds = new Set(((job.items || []).map((i: any) => i.tokenId)).filter(Boolean).map(String));
  for (const id of ids) {
    try {
      if ((await ownerOf(String(id))) !== fromAddr) continue;
      const isDeclared = (job.parents || []).map(String).includes(String(id)) || String(id) === String(job.tokenId) || String(id) === String(job.receiptTokenId) || itemTokenIds.has(String(id));
      const sender = await detectNftSender(fromAddr, String(id));
      const to = isDeclared ? (fallbackTo || sender) : (sender || fallbackTo);
      if (!to) continue;
      const tx = await sendNftRetry(key, fromAddr, String(id), to);
      out.push({ id: String(id), to, tx });
      xaoLog(job.jobId, `inscription #${id} returned to ${to}`);
      try {
        const current = readJob(job.jobId);
        if (current.status === 'RECOVERING') {
          current.progress = `Returned ${out.filter((item: any) => item.tx).length}/${ids.length} inscriptions — #${id} confirmed`;
          current.progressAt = new Date().toISOString();
          writeJob(current);
        }
      } catch {}
    } catch (e) {
      const error = errMsg(e);
      out.push({ id: String(id), error });
      xaoLog(job.jobId, `inscription #${id} return failed · ${error}`);
      try {
        const current = readJob(job.jobId);
        if (current.status === 'RECOVERING') {
          current.progress = `Could not return #${id}; continuing inventory recovery`;
          current.progressAt = new Date().toISOString();
          writeJob(current);
        }
      } catch {}
    }
  }
  return out;
}

// D1 summaries are deliberately cached for fast grids, but ownership changes
// after a confirmed transfer. Refresh exactly the recovered ids so Xplorer does
// not keep showing the one-shot wallet as owner. This is display/index repair
// only: recovery success never depends on it once chain ownership is verified.
async function refreshIndexedOwners(idsIn: string[]) {
  const ids = [...new Set(idsIn.map(String).filter((id) => /^\d+$/.test(id)))];
  if (!ids.length) return { ok: true, refreshed: 0, ids };
  const contractId = `${CORE[0]}.${CORE[1]}`;
  let lastError = 'index refresh failed';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(
        `/index/${encodeURIComponent(contractId)}?id=${encodeURIComponent(ids.join(','))}`,
        { method: 'POST', signal: controller.signal, headers: { accept: 'application/json' } }
      );
      let body: any = null;
      try { body = await response.json(); } catch {}
      if (!response.ok) throw new Error(`index refresh HTTP ${response.status}${body?.error ? `: ${body.error}` : ''}`);
      return { ok: true, refreshed: Number(body?.refreshed ?? ids.length), ids };
    } catch (e) {
      lastError = errMsg(e);
      if (attempt === 0) await sleep(1500);
    } finally {
      clearTimeout(timeout);
    }
  }
  return { ok: false, refreshed: 0, ids, error: lastError };
}

// Job-scoped browser recovery. The ephemeral key exists only in this browser, so
// the server-side svc/recover-*.mjs scripts cannot recover backendless jobs.
// Inscriptions always move first. STX is swept only after a fresh holdings query
// positively confirms that the one-shot wallet contains zero inscriptions.
async function recoverJobAssets(jobIn: any) {
  let job = jobIn;
  if (job.status !== 'NEEDS_RECOVERY') throw new Error(`recovery is only available for NEEDS_RECOVERY jobs (this job is ${job.status})`);
  if (!job.ephemeralMnemonic) throw new Error('recovery key is missing from this browser — do not fund this deposit address again');

  const destination = (await resolveFunder(job)) || job.expectedFunder || job.user;
  if (!destination || !/^SP[0-9A-HJKMNP-Z]{37,41}$/.test(String(destination))) throw new Error('could not verify the mainnet wallet that funded this job');
  if (job.fastTrack && job.expectedFunder && !addrEq(destination, job.expectedFunder)) {
    throw new Error(`recovery destination ${destination} does not match the fast-track wallet ${job.expectedFunder}`);
  }

  const dep = deriveFrom(job.ephemeralMnemonic);
  if (dep.address !== job.depositAddress) throw new Error(`saved recovery key controls ${dep.address}, not deposit ${job.depositAddress}`);
  const knownTokenIds = [...new Set([
    ...(job.parents || []), job.tokenId, job.receiptTokenId,
    ...((job.items || []).map((item: any) => item.tokenId)),
  ].filter(Boolean).map(String))];

  if (job.mock) {
    const remainingItems = (job.items || []).filter((item: any) => !item.tokenId).map((item: any) => ({ idx: item.idx, file: item.file, uri: item.uri, mime: item.mime }));
    job.recovery = { destination, returnedTokenIds: knownTokenIds, remainingItems, completedAt: new Date().toISOString(), mock: true };
    job.recoveryCompletedAt = job.recovery.completedAt;
    job.cancelReason = `recovery complete — ${knownTokenIds.length} inscription${knownTokenIds.length === 1 ? '' : 's'} and remaining STX returned`;
    job.progress = job.cancelReason;
    job.status = 'CANCELLED';
    delete job.ephemeralMnemonic; delete job.keepKey; delete job.keepKeyReason; delete job.error;
    writeJob(job);
    return { recovered: true, ...job.recovery };
  }

  job.status = 'RECOVERING';
  job.progress = `Recovery started — returning ${knownTokenIds.length} known inscription${knownTokenIds.length === 1 ? '' : 's'} to ${destination}`;
  job.progressAt = new Date().toISOString();
  delete job.error;
  writeJob(job);
  xaoLog(job.jobId, `RECOVERY start · deposit ${dep.address} → ${destination} · known tokens ${knownTokenIds.join(', ') || 'none'}`);

  // Fail closed if holdings cannot be read: without a verified inventory it is
  // unsafe to sweep the STX needed to move any inscription we could not see.
  let heldBefore: string[];
  try { heldBefore = await heldInscriptions(dep.address); }
  catch (e) {
    job = readJob(job.jobId); job.status = 'NEEDS_RECOVERY'; job.keepKey = true;
    job.keepKeyReason = 'could not verify the escrow wallet inscription inventory — retry recovery';
    job.error = errMsg(e); job.progress = job.keepKeyReason; job.progressAt = new Date().toISOString(); writeJob(job);
    throw new Error(job.keepKeyReason);
  }
  job = readJob(job.jobId);
  job.progress = `Returning ${heldBefore.length} inscription${heldBefore.length === 1 ? '' : 's'} before the STX sweep`;
  job.progressAt = new Date().toISOString(); writeJob(job);

  const nftReturns = await returnAllHeldNfts(job, dep.key, dep.address, destination);
  job = readJob(job.jobId);
  job.nftReturns = [...(job.nftReturns || []), ...nftReturns];
  job.progressAt = new Date().toISOString(); writeJob(job);

  let heldAfter: string[];
  try { heldAfter = await heldInscriptions(dep.address); }
  catch (e) {
    job = readJob(job.jobId); job.status = 'NEEDS_RECOVERY'; job.keepKey = true;
    job.keepKeyReason = 'inscription transfers were submitted, but the empty wallet could not be verified — retry after confirmations';
    job.error = errMsg(e); job.progress = job.keepKeyReason; job.progressAt = new Date().toISOString(); writeJob(job);
    throw new Error(job.keepKeyReason);
  }
  if (heldAfter.length) {
    const failures = nftReturns.filter((item: any) => item.error).map((item: any) => `#${item.id}: ${item.error}`);
    job = readJob(job.jobId); job.status = 'NEEDS_RECOVERY'; job.keepKey = true;
    job.keepKeyReason = `wallet still holds inscription${heldAfter.length === 1 ? '' : 's'} #${heldAfter.join(', #')} — STX retained for transfer fees`;
    job.error = failures.join('; ') || job.keepKeyReason;
    job.progress = job.keepKeyReason; job.progressAt = new Date().toISOString(); writeJob(job);
    return { recovered: false, destination, returned: nftReturns.filter((item: any) => item.tx), pendingTokenIds: heldAfter, errors: failures };
  }

  job = readJob(job.jobId);
  job.progress = 'All inscriptions returned ✓ — sweeping remaining STX';
  job.progressAt = new Date().toISOString(); writeJob(job);
  const sweep = await sweepStxTo(dep.key, dep.address, destination);
  const finalBalance = await balance(dep.address);
  const finalHeld = await heldInscriptions(dep.address);
  if (finalHeld.length || finalBalance > REFUND_TX_FEE) {
    job = readJob(job.jobId); job.status = 'NEEDS_RECOVERY'; job.keepKey = true;
    job.keepKeyReason = finalHeld.length
      ? `wallet still holds inscription${finalHeld.length === 1 ? '' : 's'} #${finalHeld.join(', #')}`
      : `wallet still holds ${finalBalance} uSTX — retry recovery after the sweep confirms`;
    job.progress = job.keepKeyReason; job.progressAt = new Date().toISOString(); writeJob(job);
    return { recovered: false, destination, returned: nftReturns.filter((item: any) => item.tx), pendingTokenIds: finalHeld, balanceUstx: finalBalance.toString() };
  }

  job = readJob(job.jobId);
  // Include successful transfers from earlier recovery rounds too. A refresh can
  // legitimately split a ten-token recovery across multiple confirmed rounds.
  const returnedTokenIds = [...new Set((job.nftReturns || []).filter((item: any) => item.tx).map((item: any) => String(item.id)))];
  const remainingItems = (job.items || []).filter((item: any) => !item.tokenId).map((item: any) => ({ idx: item.idx, file: item.file, uri: item.uri, mime: item.mime }));
  const completedAt = new Date().toISOString();
  job.recovery = { destination, returnedTokenIds, remainingItems, refundTx: sweep.tx || null, refundedUstx: sweep.amount || '0', completedAt };
  job.recoveryCompletedAt = completedAt;
  job.refundTx = sweep.tx || job.refundTx;
  job.refundedUstx = sweep.amount || job.refundedUstx || '0';
  job.cancelReason = `recovery complete — ${returnedTokenIds.length} inscription${returnedTokenIds.length === 1 ? '' : 's'} and remaining STX returned`;
  job.progress = job.cancelReason;
  job.status = 'CANCELLED';
  delete job.ephemeralMnemonic; delete job.keepKey; delete job.keepKeyReason; delete job.error;
  writeJob(job);
  xaoLog(job.jobId, `RECOVERY complete · returned tokens ${returnedTokenIds.join(', ') || 'none'} · refund ${sweep.amount || '0'} uSTX`);

  // The key is already wiped and chain recovery is complete before this
  // best-effort index repair starts. A failed refresh is recorded for diagnosis
  // but must never turn a successful asset recovery back into NEEDS_RECOVERY.
  const indexRefresh = await refreshIndexedOwners(returnedTokenIds);
  job = readJob(job.jobId);
  job.recovery = { ...(job.recovery || {}), indexRefresh };
  if (!indexRefresh.ok) job.recoveryWarning = `Ownership index refresh pending: ${indexRefresh.error}`;
  else delete job.recoveryWarning;
  writeJob(job);
  xaoLog(job.jobId, indexRefresh.ok
    ? `ownership index refreshed for ${indexRefresh.refreshed} token${indexRefresh.refreshed === 1 ? '' : 's'}`
    : `ownership index refresh deferred · ${indexRefresh.error}`);
  return { recovered: true, ...job.recovery };
}
async function sendStxRetry(key: string, amount: bigint, to: string, fee: bigint, tries = 4) { let last: any; for (let i = 0; i < tries; i++) { try { return await sendStx(key, amount, to, fee); } catch (e) { last = e; if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e))) { await sleep(8000); continue; } throw e; } } throw last; }
async function sendNftRetry(key: string, from: string, id: string, to: string, tries = 5) { let last: any; for (let i = 0; i < tries; i++) { try { return await sendNft(key, from, id, to); } catch (e) { last = e; if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e))) { await sleep(Math.min(30000, 8000 * (i + 1))); continue; } throw e; } } throw last; }
async function sweepStxTo(key: string, fromAddr: string, to: string, tries = 5): Promise<any> { let last: any; for (let i = 0; i < tries; i++) { let bal = 0n; try { bal = await balance(fromAddr); } catch (e) { last = e; await sleep(5000); continue; } if (bal <= REFUND_TX_FEE) return { sent: false, amount: '0', balance: bal.toString() }; const amount = bal - REFUND_TX_FEE; try { const tx = await sendStx(key, amount, to, REFUND_TX_FEE); return { sent: true, tx, amount: amount.toString() }; } catch (e) { last = e; if (i < tries - 1 && TRANSIENT_TX.test(errMsg(e))) { await sleep(8000); continue; } throw e; } } throw last || new Error('sweep failed'); }
async function inscribeReceipt(key: string, from: string, html: string, uri: string, deps: string[]) { const data = enc.encode(html); const q = await quoteFee(data.length, chunkBytes(data).length); const tokenId = await mintSingle(key, from, data, 'text/html', uri, deps, q.protocolFee); return { tokenId }; }

// ---------- estimate→create→inscribe→deliver→refund (mirror core) ----------
async function createJob(opts: any) {
  const { file, uri, mime = 'application/octet-stream', deps = [], parents = [], user, recipient = null, expectedFunder = null, marginUstx = '0', fastTrack = false, agentFeePct = AGENT_FEE_PCT, receipt = true } = opts;
  if (!file || !uri) throw new Error('file, uri required');
  if (!fastTrack && !user) throw new Error('delivery address (user) required unless fastTrack');
  // PARENT LINKING (escrow): validate declared parents up-front, before payment is requested.
  const parentIds: string[] = (parents || []).map((p: any) => String(p).trim()).filter(Boolean);
  if (parentIds.some((p) => !/^\d+$/.test(p))) throw new Error('parents must be token-id uints');
  if (new Set(parentIds).size !== parentIds.length) throw new Error('duplicate parent token ids');
  if (parentIds.length > 50) throw new Error('at most 50 parents');
  const data = new Uint8Array(await (file as File).arrayBuffer());
  // DUPLICATE-HASH GUARD: the contract rejects re-inscribing an identical hash — refuse BEFORE creating
  // a job or taking payment, so identical content is never paid for twice.
  if (!MOCK) {
    const existing = await getIdByHash(incHash(chunkBytes(data)));
    if (existing) throw new Error(`This exact content is already inscribed on-chain as token #${existing}. Inscribing an identical hash is blocked by the contract — no payment was taken.`);
    // Parent sanity BEFORE taking payment: every declared parent must exist on-chain.
    for (const pid of parentIds) {
      const owner = await ownerOf(pid);
      if (!owner) throw new Error(`Parent token #${pid} does not exist on ${CORE_NAME} — check the token id. No job was created.`);
    }
  }
  const est = await estimate({ bytes: data.length, marginUstx, agentFeePct, parentCount: parentIds.length, receipt });
  const w = newWallet(); const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  BYTES.set(id, data); await idbSaveBytes(id, data);
  const job: any = {
    jobId: id, core: CORE_NAME, net: 'mainnet', mock: MOCK, fastTrack, file: (file as File).name || 'asset', uri, mime, deps, parents: parentIds, user: user || null, recipient: recipient || user || null,
    expectedFunder: expectedFunder || null, funder: null, receipt: receipt !== false,
    bytes: data.length, chunks: est.chunks, single: est.single, batches: est.batches,
    protocolFee: est.protocolFee, minerReserve: est.minerReserve, receiptProtocol: est.receiptProtocol, receiptMiner: est.receiptMiner,
    agentFeePct: est.agentFeePct, agentFeeAddress: AGENT_FEE_ADDRESS, agentFeeExpectedUstx: est.agentFeeUstx, agentIdentityId: cfg.agentIdentityId || null,
    margin: String(marginUstx), requiredUstx: est.requiredUstx, depositAddress: w.address, ephemeralMnemonic: w.mnemonic,
    status: 'AWAITING_DEPOSIT', createdAt: new Date().toISOString(),
  };
  writeJob(job); return publicJob(job);
}
/**
 * BATCH job (browser): N inscriptions, ONE payment, ONE receipt. Mirrors svc/core.
 * items: [{ file: File, uri, mime, deps, parents }] (≤ MAX_BATCH_ITEMS). Job-level
 * `parents` link to EVERY item; '@k' deps reference earlier items. Per-item bytes are
 * kept in memory AND IndexedDB (key `jobId:idx`) so a reload can resume mid-batch.
 * NOTE: audio→player conversion happens in the UI BEFORE createJob (as today) — batch
 * items are inscribed exactly as provided.
 */
async function createBatchJob(opts: any) {
  const { items = [], parents = [], user, recipient = null, expectedFunder = null, marginUstx = '0', fastTrack = false, strict = false, agentFeePct = AGENT_FEE_PCT, receipt = true } = opts;
  if (!Array.isArray(items) || !items.length) throw new Error('items required');
  if (items.length > MAX_BATCH_ITEMS) throw new Error(`batch too large: ${items.length} items (max ${MAX_BATCH_ITEMS})`);
  if (!fastTrack && !user) throw new Error('delivery address (user) required unless fastTrack');
  const validIds = (list: any[], what: string) => {
    const ids = (list || []).map((p: any) => String(p).trim()).filter(Boolean);
    if (ids.some((p) => !/^\d+$/.test(p))) throw new Error(`${what} must be token-id uints`);
    return ids;
  };
  const sharedParents = validIds(parents, 'parents');
  const datas: Uint8Array[] = []; const built: any[] = []; const seen = new Set<string>();
  for (let i = 0; i < items.length; i += 1) {
    const it = items[i] || {};
    if (!it.file || !it.uri) throw new Error(`item ${i}: file, uri required`);
    const itemParents = validIds(it.parents, `item ${i} parents`);
    const deps = (it.deps || []).map((d: any) => String(d).trim()).filter(Boolean);
    for (const d of deps) {
      if (/^@\d+$/.test(d)) { const k = Number(d.slice(1)); if (!(k >= 0 && k < i)) throw new Error(`item ${i}: dep '${d}' must reference an EARLIER item (0..${i - 1})`); }
      else if (!/^\d+$/.test(d)) throw new Error(`item ${i}: deps must be token-id uints or '@k' item refs`);
    }
    const data = new Uint8Array(await (it.file as File).arrayBuffer());
    if (!MOCK) {
      const h = incHash(chunkBytes(data)); const hHex = bytesToHex(h);
      if (seen.has(hHex)) throw new Error(`item ${i}: duplicate content inside the batch`);
      seen.add(hHex);
      const existing = await getIdByHash(h);
      if (existing) throw new Error(`item ${i}: this exact content is already inscribed as token #${existing} — no payment was taken`);
    }
    datas.push(data);
    built.push({ idx: i, file: (it.file as File).name || `item-${i}`, uri: String(it.uri), mime: it.mime || 'application/octet-stream', deps, parents: itemParents, bytes: data.length, status: 'PENDING', tokenId: null, error: null });
  }
  const allParents = [...new Set([...sharedParents, ...built.flatMap((b) => b.parents)])];
  if (allParents.length > 45) throw new Error('too many distinct parents for one batch (max 45)');
  if (!MOCK) for (const pid of allParents) { const owner = await ownerOf(pid); if (!owner) throw new Error(`Parent token #${pid} does not exist on ${CORE_NAME} — no job was created.`); }
  const est = await estimateBatch({ itemsBytes: built.map((b) => b.bytes), parentCount: allParents.length, marginUstx, agentFeePct, receipt });
  for (let i = 0; i < built.length; i += 1) Object.assign(built[i], {
    chunks: est.items[i].chunks, single: est.items[i].single, batches: est.items[i].batches,
    protocolFee: est.items[i].protocolFee, minerReserve: est.items[i].minerReserve,
  });
  for (const b of built) {
    const merged = [...new Set([...sharedParents, ...b.parents])];
    if (!b.single && merged.length > 1) throw new Error(`item ${b.idx}: large (staged) inscriptions support at most 1 parent`);
  }
  const w = newWallet(); const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  for (let i = 0; i < datas.length; i += 1) { BYTES.set(`${id}:${i}`, datas[i]); await idbSaveBytes(`${id}:${i}`, datas[i]); }
  const job: any = {
    jobId: id, core: CORE_NAME, net: 'mainnet', mock: MOCK, fastTrack, strict: !!strict,
    items: built, batchProgress: { current: 0, total: built.length },
    sharedParents, parents: allParents,            // job.parents = the ESCROW list (gates, returns, receipts)
    user: user || null, recipient: recipient || user || null, expectedFunder: expectedFunder || null, funder: null, receipt: receipt !== false,
    bytes: built.reduce((s, b) => s + b.bytes, 0), chunks: built.reduce((s, b) => s + b.chunks, 0),
    sumProtocol: est.sumProtocol, sumMiner: est.sumMiner,
    protocolFee: est.sumProtocol, minerReserve: est.sumMiner,   // aliases so shared maths keep working
    receiptProtocol: est.receiptProtocol, receiptMiner: est.receiptMiner,
    agentFeePct: est.agentFeePct, agentFeeAddress: AGENT_FEE_ADDRESS, agentFeeExpectedUstx: est.agentFeeUstx, agentIdentityId: cfg.agentIdentityId || null,
    margin: String(marginUstx), requiredUstx: est.requiredUstx, depositAddress: w.address, ephemeralMnemonic: w.mnemonic,
    status: 'AWAITING_DEPOSIT', createdAt: new Date().toISOString(),
  };
  writeJob(job); return publicJob(job);
}

async function statusJob(job: any) {
  const bal = await balOf(job);
  const funded = bal >= BigInt(job.requiredUstx);
  // "Payment seen" (mempool) — UI signal only; money decisions still gate on the confirmed balance.
  let pending = false;
  if (!funded && !MOCK && job.depositAddress && job.status === 'AWAITING_DEPOSIT') {
    // A throttled read here used to report "nothing pending", which is why the
    // status line flipped between "payment seen — confirming" and "waiting for
    // payment to land" while a deposit was in flight. Unknown is not the same as
    // none: leave `pending` false but do not pretend the mempool was empty.
    try {
      const r = await hfetch(`/extended/v1/address/${job.depositAddress}/mempool?limit=10`);
      if (!r.ok) throw new Error(`mempool ${r.status}`);
      const d: any = await r.json();
      if (!Array.isArray(d?.results)) throw new Error('mempool returned no results');
      pending = d.results.some((tx: any) => tx.token_transfer && tx.token_transfer.recipient_address === job.depositAddress);
    } catch (e) {
      xaoLog(job.jobId, `mempool check unavailable (${errMsg(e)}) — cannot say whether a payment is in flight`);
    }
  }
  // Parent escrow gate — a parented job is runnable only when funded AND all parents are held.
  let parents: any = null;
  // INSCRIBING included deliberately: the escrow checklist stays on screen while the
  // upload runs, and without live parent status it fell back to a stale owner lookup
  // and told the user to send a parent the job had already accepted and was minting
  // against. The gate has passed by then — the UI just needs to be told.
  if ((job.parents || []).length && ['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED', 'INSCRIBING'].includes(job.status)) {
    try { parents = await parentsStatus(job); } catch {}
  }
  const batch = job.items ? { current: (job.batchProgress || {}).current || 0, total: job.items.length, items: job.items.map((i: any) => ({ idx: i.idx, uri: i.uri, status: i.status, tokenId: i.tokenId || null, error: i.error || null })) } : null;
  return { jobId: job.jobId, status: job.status, depositAddress: job.depositAddress, requiredUstx: job.requiredUstx, balanceUstx: bal.toString(), funded, pending, parents, batch, tokenId: job.tokenId || null };
}

// ---------- batch mint loop (browser mirror of svc runBatchItems) ----------
const ITEM_FATAL = /TX abort|empty file|exceeds single-tx|unresolved|duplicate|already inscribed|does not exist|bytes missing|mock forced/i;
async function runBatchItems(job: any) {
  const dep = job.mock ? null : deriveFrom(job.ephemeralMnemonic);
  const prog = (m: string) => { job.progress = m; job.progressAt = new Date().toISOString(); writeJob(job); xaoLog(job.jobId, m); };
  const resolveDeps = (item: any) => (item.deps || []).map((d: string) => {
    if (!/^@\d+$/.test(d)) return d;
    const k = Number(d.slice(1)); const ref = job.items[k];
    if (!ref || !ref.tokenId) throw new Error(`dep '${d}' unresolved — item ${k} is ${ref ? ref.status : 'missing'}`);
    return String(ref.tokenId);
  });
  let minted = 0, failed = 0;
  for (let i = 0; i < job.items.length; i += 1) {
    const item = job.items[i];
    job.batchProgress = { current: i, total: job.items.length };
    if (item.status === 'INSCRIBED' && item.tokenId) { minted += 1; continue; }
    if (item.status === 'FAILED' || item.status === 'SKIPPED') { failed += 1; continue; }
    // Between items: stop before starting the next one rather than mid-upload.
    assertNotCancelled(job.jobId);
    try {
      const key = `${job.jobId}:${i}`;
      let data = BYTES.get(key);
      if (!data && await restoreBytes(key)) data = BYTES.get(key);
      if (!data && !job.mock) throw new Error(`item ${i}: bytes missing (storage cleared)`);
      item.resolvedDeps = resolveDeps(item);
      item.mergedParents = [...new Set([...(job.sharedParents || []), ...(item.parents || [])])];
      item.status = 'INSCRIBING'; prog(`batch ${i + 1}/${job.items.length} · inscribing ${item.uri}`);
      if (job.mock) {
        if (/mockfail/i.test(item.uri)) throw new Error('TX abort_by_response (mock forced failure)');
        item.tokenId = String(Math.floor(1000 + Math.random() * 9000));
      } else if (item.single) {
        item.tokenId = await mintSingle(dep!.key, dep!.address, data!, item.mime, item.uri, item.resolvedDeps, BigInt(item.protocolFee), item.mergedParents, job.jobId);
      } else {
        item.tokenId = await stagedInscribe(job, dep!.key, dep!.address, data!, prog, item);
      }
      item.status = 'INSCRIBED'; item.error = null; minted += 1;
      prog(`batch ${i + 1}/${job.items.length} · inscribed → #${item.tokenId}`);
    } catch (e) {
      const msg = errMsg(e);
      if (!ITEM_FATAL.test(msg)) { item.status = 'PENDING'; writeJob(job); throw e; }   // transient → resume at this item
      item.status = 'FAILED'; item.error = msg; failed += 1;
      prog(`batch ${i + 1}/${job.items.length} · item FAILED (${msg}) — ${job.strict ? 'strict: stopping' : 'continuing'}`);
      if (job.strict) { for (let k = i + 1; k < job.items.length; k += 1) if (job.items[k].status === 'PENDING') job.items[k].status = 'SKIPPED'; writeJob(job); break; }
    }
  }
  job.batchProgress = { current: job.items.length, total: job.items.length };
  if (!minted) { writeJob(job); throw new Error('batch failed: no items inscribed — returning everything to sender'); }
  job.tokenId = (job.items.find((it: any) => it.tokenId) || {}).tokenId || null;
  job.status = 'INSCRIBED'; writeJob(job);
  return job.tokenId;
}
async function runInscribe(job: any) {
  if (job.mock) {
    job.depositReceivedUstx = job.requiredUstx;
    if (job.items) return runBatchItems(job);
    const tokenId = String(Math.floor(1000 + Math.random() * 9000)); job.tokenId = tokenId; job.status = 'INSCRIBED'; writeJob(job); return tokenId;
  }
  // Funding gate — skipped on RESUME (a mid-flight job has already spent part of its deposit).
  if (!job.depositReceivedUstx) {
    // Hiro's API is load-balanced across nodes at different chain tips, so a single read can
    // lag behind a just-landed deposit. Take the best of a few reads before concluding a job
    // is unfunded, so a stale zero never triggers a spurious refund.
    // Track whether ANY read actually succeeded. Swallowing the errors and reporting
    // the resulting 0 as "not funded" is what made a rate-limited lookup look like an
    // unpaid deposit on a wallet that held the full amount.
    let bal = 0n; let reads = 0; let lastErr: unknown = null;
    for (let i = 0; i < 3; i++) {
      try { const b = await balance(job.depositAddress); reads += 1; if (b > bal) bal = b; } catch (e) { lastErr = e; }
      if (reads && bal >= BigInt(job.requiredUstx)) break;
      if (i < 2) await sleep(6000);
    }
    if (!reads) throw new Error(`could not read the deposit balance (${errMsg(lastErr)}) — nothing was spent, retrying`);
    if (bal < BigInt(job.requiredUstx)) throw new Error(`not funded: need ${job.requiredUstx}, have ${bal}`);
    job.depositReceivedUstx = bal.toString();
  }
  // PARENT GATE: the mint/seal aborts (ERR-NOT-AUTHORIZED) unless the deposit wallet owns every
  // declared parent, and a mid-mint abort still burns miner fees. Verify BEFORE spending.
  if ((job.parents || []).length) {
    const ps = await parentsStatus(job);
    if (ps.unexpected && ps.unexpected.length) throw new Error(`wrong inscription received: deposit wallet holds unexpected token(s) #${ps.unexpected.join(', #')} — returning everything to sender`);
    if (ps.missing.length) throw new Error(`parents not yet received: waiting for token(s) #${ps.missing.join(', #')} to arrive at ${job.depositAddress}`);
  }
  if (job.items) return runBatchItems(job);   // BATCH: N ordered mints from the one funded wallet
  let data = BYTES.get(job.jobId);
  if (!data && await restoreBytes(job.jobId)) data = BYTES.get(job.jobId);   // reload-proof: restore from IndexedDB
  if (!data) throw new Error('file bytes not in memory or on disk (storage cleared) — returning funds');
  const dep = deriveFrom(job.ephemeralMnemonic);
  let tokenId: string | null;
  const prog = (m: string) => { job.progress = m; job.progressAt = new Date().toISOString(); writeJob(job); xaoLog(job.jobId, m); };
  if (job.single) { tokenId = await mintSingle(dep.key, dep.address, data, job.mime, job.uri, job.deps || [], BigInt(job.protocolFee), job.parents || [], job.jobId); }
  else { tokenId = await stagedInscribe(job, dep.key, dep.address, data, prog); }
  job.tokenId = tokenId; job.status = 'INSCRIBED'; writeJob(job); return tokenId;
}
// ---------- batch receipt (browser mirror of svc batchReceiptData/buildBatchReceiptHtml) ----------
function batchReceiptData(job: any, x: any) {
  const received = BigInt(x.received);
  const minted = job.items.filter((i: any) => i.tokenId);
  const sumProtocol = minted.reduce((s: bigint, i: any) => s + BigInt(i.protocolFee || '0'), 0n);
  const receiptProtocol = BigInt(job.receiptProtocol || '0');
  const agentFee = BigInt(x.agentFee);
  const changeR = x.change != null && BigInt(x.change) > 0n ? BigInt(x.change) : 0n;
  let networkFee = received - sumProtocol - receiptProtocol - agentFee - changeR;
  if (networkFee < 0n) networkFee = 0n;
  const stxUsd = (x.stxUsd != null) ? Number(x.stxUsd) : null;
  return {
    jobId: job.jobId, core: job.core, date: new Date().toISOString(), batch: true,
    outcome: x.outcome || 'inscribed', note: x.note || null,
    items: job.items.map((i: any) => ({ idx: i.idx, uri: i.uri, mime: i.mime, bytes: i.bytes, tokenId: i.tokenId || null, status: i.status, error: i.error || null })),
    counts: { total: job.items.length, minted: minted.length, failed: job.items.filter((i: any) => i.status === 'FAILED').length, skipped: job.items.filter((i: any) => i.status === 'SKIPPED').length },
    parents: (job.parents || []).map(String), receiptTokenId: x.receiptTokenId || null,
    recipient: x.recipient || job.recipient || job.user, agentIdentityId: job.agentIdentityId || null,
    depositReceived: received.toString(), xtrataProtocol: sumProtocol.toString(), receiptProtocol: receiptProtocol.toString(),
    networkFee: networkFee.toString(), agentFeePct: Number(job.agentFeePct ?? AGENT_FEE_PCT), agentFee: agentFee.toString(),
    changeReturned: changeR.toString(), totalPaid: (received - changeR).toString(), stxUsd,
  };
}
function buildBatchReceiptHtml(d: any) {
  const row = (k: string, v: string) => `<div class="r"><span>${k}</span><span>${v}</span></div>`;
  const escHtml = (s: any) => String(s ?? '').replace(/[&<>]/g, (c: string) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as any)[c]));
  const stxr = (u: any) => ustxToStx(u) + ' STX';
  const usd = (u: any) => d.stxUsd ? ' · ~$' + (Number(u) / 1e6 * d.stxUsd).toFixed(2) : '';
  const short = (s: any) => s ? (s.length > 18 ? s.slice(0, 9) + '…' + s.slice(-6) : s) : '—';
  const ok = d.outcome === 'inscribed';
  const itemRow = (i: any) => {
    const mark = i.tokenId ? `<span class="tok">#${i.tokenId}</span> ✓` : (i.status === 'FAILED' ? `✗ failed${i.error ? ' — ' + escHtml(String(i.error).slice(0, 60)) : ''}` : '− skipped');
    return row(`${i.idx + 1} · ${escHtml(i.uri)}`, `${escHtml(i.mime)} · ${(i.bytes / 1048576).toFixed(2)} MiB · ${mark}`);
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
${row('Escrowed for the batch', d.parents.map((p: string) => '<span class="tok">#' + p + '</span>').join(' ') + ` · linked to every item · returned to ${ok ? 'you' : 'sender'}`)}` : ''}
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
async function deliverBatch(job: any, received: bigint, agentFee: bigint, stxUsd: number | null) {
  const minted = job.items.filter((i: any) => i.tokenId);
  if (!minted.length) throw new Error('nothing to deliver — no batch items inscribed');
  const doneStatus = () => job.items.some((i: any) => i.status !== 'INSCRIBED') ? 'COMPLETE_WITH_SKIPS' : 'COMPLETE';
  if (job.mock) {
    const receiptTokenId = job.receipt === false ? null : String(Math.floor(1000 + Math.random() * 9000));
    const sumProt = minted.reduce((s: bigint, i: any) => s + BigInt(i.protocolFee || '0'), 0n);
    const change = received - sumProt - BigInt(job.receiptProtocol || '0') - agentFee;
    const d = batchReceiptData(job, { received, agentFee, receiptTokenId, change: change > 0n ? change : 0n, stxUsd });
    job.receiptHtml = buildBatchReceiptHtml(d);
    const receipt: any = { ...d, deliverTxs: minted.map((i: any) => ({ id: i.tokenId, tx: '0xMOCK_DELIVER' })), receiptDeliverTx: receiptTokenId ? '0xMOCK_RECEIPT' : null, agentFeeTx: '0xMOCK_FEE', refundTx: '0xMOCK_REFUND' };
    if ((job.parents || []).length) { job.parentReturnTxs = job.parents.map((p: string) => ({ id: String(p), tx: '0xMOCK_PARENT_RETURN' })); receipt.parentReturnTxs = job.parentReturnTxs; }
    Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), refundedUstx: d.changeReturned, receipt });
    delete job.ephemeralMnemonic; job.status = doneStatus(); writeJob(job);
    job.items.forEach((_: any, i: number) => idbDeleteBytes(`${job.jobId}:${i}`));
    return { receipt };
  }
  const dep = deriveFrom(job.ephemeralMnemonic);
  const refundTo = (await resolveFunder(job)) || job.user;
  let liveBal0: bigint | null = null; try { liveBal0 = await balance(job.depositAddress); } catch {}
  let estChange: bigint | undefined;
  if (liveBal0 != null && liveBal0 > 0n) {
    const reserveAhead = BigInt(job.receiptProtocol || '0') + BigInt(job.receiptMiner || '0') + agentFee
      + BigInt((job.parents || []).length) * PARENT_RETURN_FEE + BigInt(minted.length) * ITEM_DELIVERY_FEE + DELIVERY_RESERVE + REFUND_TX_FEE;
    estChange = liveBal0 > reserveAhead ? liveBal0 - reserveAhead : 0n;
  }
  const prelim = batchReceiptData(job, { received, agentFee, receiptTokenId: null, change: estChange, stxUsd });
  const idDep = job.agentIdentityId;
  const receiptDeps = [...minted.map((i: any) => String(i.tokenId)), ...(job.parents || []).map(String), ...(idDep ? [String(idDep)] : [])].slice(0, 50);
  let receiptTokenId: string | null = null;
  if (job.receipt !== false) {
    const r = await inscribeReceipt(dep.key, dep.address, buildBatchReceiptHtml(prelim), `xtrata:receipt/${job.jobId}`, receiptDeps);
    receiptTokenId = r.tokenId;
  }
  const prog = (m: string) => { job.progress = m; job.progressAt = new Date().toISOString(); writeJob(job); xaoLog(job.jobId, m); };
  const deliverTxs: any[] = []; const notes: string[] = [];
  for (const item of minted) {
    try {
      prog(`delivering item ${deliverTxs.length + 1} of ${minted.length} to your wallet`);
      const tx = await sendNftRetry(dep.key, dep.address, String(item.tokenId), job.recipient || job.user);
      deliverTxs.push({ id: item.tokenId, tx }); item.deliverTx = tx;
      if (!job.inscriptionDelivered) { job.deliverTx = tx; job.inscriptionDelivered = true; writeJob(job); }
    } catch (e) {
      notes.push(`item #${item.tokenId} delivery pending — recovery will send it (` + errMsg(e) + ')'); job.keepKey = true;
      if (!job.inscriptionDelivered) throw e;
    }
  }
  const parentReturnTxs: any[] = [];
  for (const pid of (job.parents || [])) {
    try { if ((await ownerOf(String(pid))) === dep.address) { const ptx = await sendNftRetry(dep.key, dep.address, String(pid), refundTo); parentReturnTxs.push({ id: String(pid), tx: ptx }); xaoLog(job.jobId, `parent #${pid} returned home → ${refundTo}`); } }
    catch (e) { notes.push(`parent #${pid} return pending (` + errMsg(e) + ')'); job.keepKey = true; }
  }
  if (parentReturnTxs.length) { job.parentReturnTxs = parentReturnTxs; writeJob(job); }
  let receiptDeliverTx: any = null, agentFeeTx: any = null, refundTx: any = null, refundedUstx = '0';
  if (receiptTokenId) { try { prog('sending your on-chain receipt'); receiptDeliverTx = await sendNftRetry(dep.key, dep.address, receiptTokenId, job.recipient || job.user); } catch (e) { notes.push('receipt delivery deferred (' + errMsg(e) + ')'); } }
  try { if (agentFee > 0n) agentFeeTx = await sendStxRetry(dep.key, agentFee, job.agentFeeAddress || AGENT_FEE_ADDRESS, REFUND_TX_FEE); } catch (e) { notes.push('agent fee deferred (' + errMsg(e) + ')'); }
  prog('returning your change');
  try { const sw = await sweepStxTo(dep.key, dep.address, refundTo); if (sw.sent) { refundTx = sw.tx; refundedUstx = sw.amount; } } catch (e) { notes.push('change return pending (' + errMsg(e) + ')'); }
  const note = notes.length ? notes.join('; ') : null;
  const finalD = batchReceiptData(job, { received, agentFee, receiptTokenId, change: BigInt(refundedUstx), stxUsd, note });
  job.receiptHtml = buildBatchReceiptHtml(finalD);
  const receipt = { ...finalD, deliverTxs, receiptDeliverTx, agentFeeTx, refundTx, parentReturnTxs: parentReturnTxs.length ? parentReturnTxs : undefined };
  Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), deliverTxs, receiptDeliverTx, agentFeeTx, refundTx, refundedUstx, receipt });
  let leftover: bigint | null = null; try { leftover = await balance(job.depositAddress); } catch {}
  let holdsNft = (job.parents || []).length > 0;
  try { holdsNft = (await heldInscriptions(job.depositAddress)).length > 0; } catch {}
  if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
  else { job.keepKey = true; job.keepKeyReason = leftover == null ? 'balance unconfirmed' : holdsNft ? 'wallet still holds an inscription — return it via recovery' : `wallet still holds ${leftover} uSTX`; }
  job.status = doneStatus(); writeJob(job);
  job.items.forEach((_: any, i: number) => idbDeleteBytes(`${job.jobId}:${i}`));
  return { receipt };
}

async function deliver(job: any) {
  if (!job.tokenId) throw new Error('no tokenId yet — run the inscribe step first');
  const pct = BigInt(job.agentFeePct ?? AGENT_FEE_PCT);
  const received = BigInt(job.depositReceivedUstx || job.requiredUstx);
  const agentFee = pct > 0n ? (received * pct) / 100n : 0n;
  const stxUsd = await stxUsdPrice();
  if (job.items) return deliverBatch(job, received, agentFee, stxUsd);
  const prog = (m: string) => { job.progress = m; job.progressAt = new Date().toISOString(); writeJob(job); xaoLog(job.jobId, m); };
  if (job.mock) {
    // On-chain receipt optional: when off, no receipt token — but the HTML is still built + saved.
    const receiptTokenId = job.receipt === false ? null : String(Math.floor(1000 + Math.random() * 9000));
    const d = receiptData(job, { received, agentFee, receiptTokenId, stxUsd });
    job.receiptHtml = buildReceiptHtml(d);
    const receipt: any = { ...d, deliverTx: '0xMOCK_DELIVER', receiptDeliverTx: receiptTokenId ? '0xMOCK_RECEIPT' : null, agentFeeTx: '0xMOCK_FEE', refundTx: '0xMOCK_REFUND' };
    if ((job.parents || []).length) { job.parentReturnTxs = job.parents.map((p: string) => ({ id: String(p), tx: '0xMOCK_PARENT_RETURN' })); receipt.parentReturnTxs = job.parentReturnTxs; }
    Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), refundedUstx: d.changeReturned, receipt });
    delete job.ephemeralMnemonic; job.status = 'COMPLETE'; writeJob(job); return { receipt };
  }
  const dep = deriveFrom(job.ephemeralMnemonic);
  const refundTo = (await resolveFunder(job)) || job.user;
  let liveBal0: bigint | null = null; try { liveBal0 = await balance(job.depositAddress); } catch {}
  let mainMinerForReceipt = BigInt(job.mainMinerFee || job.minerReserve || '0');
  let estChange: bigint | undefined;
  if (liveBal0 != null && liveBal0 > 0n) {
    const spentSoFar = received > liveBal0 ? received - liveBal0 : 0n;
    if (spentSoFar > BigInt(job.protocolFee)) mainMinerForReceipt = spentSoFar - BigInt(job.protocolFee);
    const reserveAhead = BigInt(job.receiptProtocol || '0') + BigInt(job.receiptMiner || '0') + agentFee + BigInt((job.parents || []).length) * PARENT_RETURN_FEE + DELIVERY_RESERVE + REFUND_TX_FEE;
    estChange = liveBal0 > reserveAhead ? liveBal0 - reserveAhead : 0n;
  }
  const prelim = receiptData(job, { received, agentFee, receiptTokenId: null, change: estChange, mainMinerFee: mainMinerForReceipt.toString(), stxUsd });
  const idDep = job.agentIdentityId;
  const receiptDeps = idDep ? [String(job.tokenId), String(idDep)] : [String(job.tokenId)];
  // On-chain receipt is optional. When off we skip the extra mint entirely (saving its
  // protocol+miner cost, which then returns as change) but still build+save the HTML below.
  let receiptTokenId: string | null = null;
  if (job.receipt !== false) {
    prog('building your on-chain receipt');
    const r = await inscribeReceipt(dep.key, dep.address, buildReceiptHtml(prelim), `xtrata:receipt/${job.jobId}`, receiptDeps);
    receiptTokenId = r.tokenId;
  }
  prog('sending your inscription to your wallet');
  const deliverTx = await sendNftRetry(dep.key, dep.address, String(job.tokenId), job.recipient || job.user);   // inscription → recipient (defaults to payer); CRITICAL: if this fails the job failed → throw
  job.deliverTx = deliverTx; job.inscriptionDelivered = true; writeJob(job);              // SUCCESS commit point
  let receiptDeliverTx: any = null, agentFeeTx: any = null, refundTx: any = null, refundedUstx = '0'; const notes: string[] = [];
  // Parent(s) go home FIRST — the user's own inscription(s) are the most valuable thing in this wallet.
  const parentReturnTxs: any[] = [];
  for (const pid of (job.parents || [])) {
    try {
      if ((await ownerOf(String(pid))) === dep.address) {
        prog(`returning parent #${pid} to your wallet`);
        const ptx = await sendNftRetry(dep.key, dep.address, String(pid), refundTo);
        parentReturnTxs.push({ id: String(pid), tx: ptx });
        xaoLog(job.jobId, `parent #${pid} returned home → ${refundTo}`);
      }
    } catch (e) { notes.push(`parent #${pid} return pending — recovery will send it home (` + errMsg(e) + ')'); job.keepKey = true; }
  }
  if (parentReturnTxs.length) { job.parentReturnTxs = parentReturnTxs; writeJob(job); }
  if (receiptTokenId) { try { prog('sending your on-chain receipt'); receiptDeliverTx = await sendNftRetry(dep.key, dep.address, receiptTokenId, job.recipient || job.user); } catch (e) { notes.push('receipt delivery deferred (' + errMsg(e) + ')'); } }
  try { if (agentFee > 0n) agentFeeTx = await sendStxRetry(dep.key, agentFee, job.agentFeeAddress || AGENT_FEE_ADDRESS, REFUND_TX_FEE); } catch (e) { notes.push('agent fee deferred (' + errMsg(e) + ')'); }
  prog('returning your change');
  try { const sw = await sweepStxTo(dep.key, dep.address, refundTo); if (sw.sent) { refundTx = sw.tx; refundedUstx = sw.amount; } } catch (e) { notes.push('change return pending — recover-all will sweep it (' + errMsg(e) + ')'); }
  const note = notes.length ? notes.join('; ') : null;
  const finalD = receiptData(job, { received, agentFee, receiptTokenId, change: BigInt(refundedUstx), mainMinerFee: mainMinerForReceipt.toString(), stxUsd, note });
  job.receiptHtml = buildReceiptHtml(finalD);
  const receipt = { ...finalD, deliverTx, receiptDeliverTx, agentFeeTx, refundTx, parentReturnTxs: parentReturnTxs.length ? parentReturnTxs : undefined };
  Object.assign(job, { receiptTokenId, agentFeeUstx: agentFee.toString(), deliverTx, receiptDeliverTx, agentFeeTx, refundTx, refundedUstx, receipt });
  // SAFETY: never wipe the key while the wallet still holds STX or ANY inscription (e.g. a parent
  // whose return transfer failed) — or while we can't confirm it's empty.
  let leftover: bigint | null = null; try { leftover = await balance(job.depositAddress); } catch {}
  let holdsNft = (job.parents || []).length > 0;   // assume the worst until proven empty
  try { holdsNft = (await heldInscriptions(job.depositAddress)).length > 0; } catch {}
  if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
  else { job.keepKey = true; job.keepKeyReason = leftover == null ? 'balance unconfirmed' : holdsNft ? 'wallet still holds an inscription — return it via recovery' : `wallet still holds ${leftover} uSTX — sweep with recover-all`; }
  job.status = 'COMPLETE'; writeJob(job); idbDeleteBytes(job.jobId); return { receipt };
}
async function refundAndClose(job: any, reasonIn = 'cancelled') {
  const reason = job.items
    ? `${reasonIn} · batch: ${job.items.filter((i: any) => i.tokenId).length}/${job.items.length} items inscribed — all inscriptions and funds returned`
    : reasonIn;
  if (job.mock) {
    const rid = String(Math.floor(1000 + Math.random() * 9000));
    const d = receiptData(job, { received: BigInt(job.depositReceivedUstx || job.requiredUstx), agentFee: 0n, change: BigInt(job.depositReceivedUstx || job.requiredUstx), receiptTokenId: rid, outcome: 'refunded', note: reason });
    job.receiptHtml = buildReceiptHtml(d); job.status = 'CANCELLED'; job.cancelReason = reason; job.cancelledAt = new Date().toISOString(); job.receiptTokenId = rid; delete job.ephemeralMnemonic; writeJob(job);
    return { cancelled: true, mock: true };
  }
  if (job.inscriptionDelivered || job.status === 'COMPLETE' || job.status === 'COMPLETE_WITH_SKIPS') {   // GUARD: delivered jobs only sweep leftover; never a refund receipt/CANCELLED
    if (job.ephemeralMnemonic) {
      const dep = deriveFrom(job.ephemeralMnemonic); const to = (await resolveFunder(job)) || job.user;
      const nftReturns = await returnAllHeldNfts(job, dep.key, dep.address, to);   // e.g. a parent whose return failed in the deliver tail
      if (nftReturns.length) job.nftReturns = [...(job.nftReturns || []), ...nftReturns];
      if (to) { try { const sw = await sweepStxTo(dep.key, dep.address, to); if (sw.sent) { job.refundTx = sw.tx; job.refundedUstx = sw.amount; } } catch {} }
      let leftover: bigint | null = null; try { leftover = await balance(job.depositAddress); } catch {}
      let holdsNft = true; try { holdsNft = (await heldInscriptions(job.depositAddress)).length > 0; } catch {}
      if (leftover != null && leftover <= REFUND_TX_FEE && !holdsNft) delete job.ephemeralMnemonic;
      else if (leftover != null) { job.keepKey = true; job.keepKeyReason = holdsNft ? 'wallet still holds an inscription — return it via recovery' : `~${leftover} uSTX leftover — sweep with recover-all`; }
    }
    job.status = 'COMPLETE'; writeJob(job); return { alreadyDelivered: true };
  }
  if (!job.ephemeralMnemonic) {
    // No key means nothing can be swept or returned from here — so this job must
    // NOT be left re-runnable. Returning with the status untouched left it as
    // FUNDED, the watcher picked it up every few seconds, autoRun threw, and the
    // refund landed back here: an endless loop that hammered the API (and the
    // rate-limiting that caused made the original failure worse).
    job.status = job.depositReceivedUstx ? 'CANCELLED' : 'EXPIRED';
    job.cancelReason = `${reason} · deposit key already discarded — nothing left to return from this job`;
    job.cancelledAt = new Date().toISOString();
    writeJob(job);
    xaoLog(job.jobId, `closing without a key (${job.status}) — ${reason}`);
    return { noKey: true };
  }
  const dep = deriveFrom(job.ephemeralMnemonic);
  const returnTo = (await resolveFunder(job)) || job.user;
  const out: any = { reason, deliveredNfts: [], refundTx: null };
  // Hand back EVERY inscription this wallet holds: escrowed parents, anything it minted (token /
  // receipt), and any WRONG inscription sent by mistake (strays return to whoever sent them).
  const nftReturns = await returnAllHeldNfts(job, dep.key, dep.address, returnTo);
  for (const r of nftReturns) { if (r.tx) out.deliveredNfts.push({ id: r.id, tx: r.tx, to: r.to }); else out.nftError = `#${r.id}: ${r.error || 'no return address'}`; }
  if (nftReturns.length) { job.nftReturns = [...(job.nftReturns || []), ...nftReturns]; writeJob(job); }
  if (returnTo) {
    try {
      const b0 = await balance(dep.address);
      const need = BigInt(job.receiptProtocol || '110000') + 80000n + REFUND_TX_FEE;
      if (b0 > need + 50000n) {
        const d = receiptData(job, { received: BigInt(job.depositReceivedUstx || job.requiredUstx), agentFee: 0n, change: b0 - need, receiptTokenId: null, recipient: returnTo, outcome: 'refunded', note: reason });
        const r = await inscribeReceipt(dep.key, dep.address, buildReceiptHtml(d), `xtrata:receipt/${job.jobId}`, job.tokenId ? [String(job.tokenId)] : []);
        if (r.tokenId) { try { await sendNftRetry(dep.key, dep.address, r.tokenId, returnTo); } catch {} job.receiptTokenId = r.tokenId; out.receiptTokenId = r.tokenId; job.receiptHtml = buildReceiptHtml(d); }
      }
    } catch (e) { out.receiptError = errMsg(e); }
  }
  if (returnTo) { try { const sw = await sweepStxTo(dep.key, dep.address, returnTo); if (sw.sent) { out.refundTx = sw.tx; out.refundedUstx = sw.amount; } } catch (e) { out.refundError = errMsg(e); } }
  let leftover: bigint | null = null; try { leftover = await balance(dep.address); } catch {}
  // NEVER-STRAND (NFT edition): never discard the key while the wallet still holds an inscription
  // (e.g. a parent that arrived without enough STX to send it back yet).
  let holdsNftAfter = false; try { holdsNftAfter = (await heldInscriptions(dep.address)).length > 0; } catch { holdsNftAfter = (job.parents || []).length > 0; }
  if (holdsNftAfter) { job.keepKey = true; job.status = 'NEEDS_RECOVERY'; job.keepKeyReason = 'wallet still holds an inscription — return it via recovery'; }
  else if (leftover != null && leftover <= REFUND_TX_FEE) {
    // NEVER-STRAND GUARD: a never-funded job keeps its key (EXPIRED) — a slow payment confirming after
    // cancellation must never land at a keyless address.
    if (job.depositReceivedUstx || leftover > 0n) { delete job.ephemeralMnemonic; job.status = 'CANCELLED'; }
    // An explicit cancel must REST as cancelled. Landing on EXPIRED left the job
    // re-runnable by the watcher and still offering its own Stop button, so the
    // thing the user just stopped looked like it had not stopped at all. The key is
    // still kept, so a payment confirming late never lands at a keyless address.
    else if (job.cancelRequested) {
      job.keepKey = true; job.status = 'CANCELLED';
      job.keepKeyReason = 'cancelled before funding — key kept so a late payment is never stranded';
    }
    else { job.keepKey = true; job.status = 'EXPIRED'; job.keepKeyReason = 'never funded — key kept so a late payment is never stranded'; }
  }
  else { job.keepKey = true; job.status = 'NEEDS_RECOVERY'; job.keepKeyReason = `refund unconfirmed; ~${leftover ?? '?'} uSTX may remain`; }
  // Stamp progress on every exit. The fatal path never did, so the watcher's
  // "15 s × attempt" backoff was measured against a timestamp from minutes ago and
  // never held anything back — the job re-entered roughly every two seconds.
  job.progressAt = new Date().toISOString();
  job.cancelReason = reason; job.cancelledAt = new Date().toISOString(); if (out.refundTx) job.refundTx = out.refundTx;
  if (job.status === 'CANCELLED') idbDeleteBytes(job.jobId);
  writeJob(job); return out;
}
// Fast-track auto-pilot (mirror autoRunJob): detect funder → railroad → inscribe → deliver.
async function autoRun(job: any) {
  const funder = job.mock ? 'SP_MOCK_SENDER' : await detectFunder(job.depositAddress);
  if (!funder) throw new Error('could not determine the paying address');
  job.funder = funder; writeJob(job);
  if (job.fastTrack && job.expectedFunder && !addrEq(funder, job.expectedFunder)) {
    await refundAndClose(job, `paid from ${funder} but this job is locked to ${job.expectedFunder} — returned to sender`);
    return { rejected: true, funder, expected: job.expectedFunder };
  }
  if (job.fastTrack || !job.user) { job.user = funder; writeJob(job); }
  // PARENT ESCROW GATE: wrong inscription → return EVERYTHING; parents missing → park as
  // AWAITING_PARENT (the watcher re-polls), bounded by PARENT_WINDOW_MS from funding.
  if ((job.parents || []).length) {
    if (!job.fundedAt) { job.fundedAt = new Date().toISOString(); writeJob(job); }
    const ps = await parentsStatus(job);
    if (ps.unexpected && ps.unexpected.length) {
      await refundAndClose(job, `wrong inscription received (token #${ps.unexpected.join(', #')} is not a declared parent of this job) — all inscriptions and funds returned to sender`);
      return { rejected: true, unexpected: ps.unexpected };
    }
    if (ps.missing.length) {
      const waited = Date.now() - (Date.parse(job.fundedAt) || Date.now());
      if (waited > PARENT_WINDOW_MS) {
        await refundAndClose(job, `parent inscription #${ps.missing.join(', #')} not received within ${Math.round(PARENT_WINDOW_MS / 60000)} min of funding — everything returned to sender`);
        return { rejected: true, parentTimeout: true, missing: ps.missing };
      }
      job.status = 'AWAITING_PARENT';
      job.progress = `deposit received ✓ — now send parent inscription #${ps.missing.join(', #')} to the deposit address; it will be returned with your new inscription`;
      job.progressAt = new Date().toISOString(); writeJob(job);
      xaoLog(job.jobId, `funded but awaiting parent #${ps.missing.join(', #')} (${Math.round((PARENT_WINDOW_MS - waited) / 60000)} min left)`);
      return { awaitingParent: true, missing: ps.missing };
    }
    xaoLog(job.jobId, `parent${ps.required.length > 1 ? 's' : ''} #${ps.required.join(', #')} held ✓ — proceeding to inscribe`);
  }
  job.status = 'INSCRIBING'; writeJob(job);
  await runInscribe(job);
  job.status = 'DELIVERING'; writeJob(job);
  return await deliver(job);
}

// ---------- watcher + reaper (mirror server.mjs; run only while the tab is open) ----------
const PROCESSING = new Set<string>();
// Keep the device awake while a job is actively processing — a screen lock suspends
// the tab (and its Worker) even in the foreground. Best-effort: browsers without the
// Wake Lock API just skip it; the lock is re-acquired whenever the tab is visible.
let wakeLock: any = null;
async function syncWakeLock() {
  try {
    if (PROCESSING.size > 0 && !wakeLock && document.visibilityState === 'visible' && (navigator as any).wakeLock) {
      wakeLock = await (navigator as any).wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (PROCESSING.size === 0 && wakeLock) { const wl = wakeLock; wakeLock = null; await wl.release(); }
  } catch { wakeLock = null; }
}
// A tab returning to the foreground may have had its intervals frozen for hours:
// tick the watcher immediately so a stalled job resumes the moment the user is back,
// instead of waiting for the throttled interval to fire.
try {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { void syncWakeLock(); void watchTick(); } });
  window.addEventListener('focus', () => { void syncWakeLock(); void watchTick(); });
} catch {}
// AUTO-RESUME: transient failures (network, timeouts, rate limits) do NOT refund — the job parks back at
// FUNDED/INSCRIBED and the watcher resumes exactly where it left off. Resume is safe end-to-end: staged
// uploads continue from the on-chain index, single-tx mints are idempotent (get-id-by-hash pre-check).
// Only deterministic failures or exhausted retries (4, with 15 s × attempt backoff) hit the refund failsafe.
// "could not determine the paying address" was in here, which made a funder lookup
// failure a DETERMINISTIC failure and sent the job straight to a refund. It is
// almost always transient — a Hiro hiccup or a rate limit — so it now retries with
// backoff and only refunds once the retries are exhausted. Classing it as fatal is
// what turned one failed lookup into a refund attempt every few seconds.
const FATAL_ERR = /TX abort|locked to|unrecoverable|file bytes|empty file|wrong inscription received/i;
// ---------- cancellation ----------
// A cancel is a PERSISTED flag, not an in-memory one: the loop doing the work may
// be mid-tick in another call stack, and the request has to survive a reload. The
// running job aborts at its next checkpoint (between chunk batches) and the STX is
// swept home. Anything already minted is never cancelled — it is returned instead.
class JobCancelled extends Error {
  constructor() { super('cancelled by request'); this.name = 'JobCancelled'; }
}
const isCancelRequested = (id: string) => {
  try { return !!readJob(id).cancelRequested; } catch { return false; }
};
function assertNotCancelled(id: string) {
  if (isCancelRequested(id)) throw new JobCancelled();
}

const MAX_RETRIES = 4;
function background(id: string, fn: () => Promise<any>) {
  PROCESSING.add(id);
  void syncWakeLock();
  Promise.resolve().then(fn).then(() => {
    try { const j = readJob(id); if (j.retryCount && (j.status === 'COMPLETE' || j.status === 'COMPLETE_WITH_SKIPS')) { delete j.retryCount; writeJob(j); } } catch {}
    PROCESSING.delete(id);
  }).catch(async (e) => {
    const msg = errMsg(e);
    // A cancel is not an error: no retry, no NEEDS_RECOVERY, straight to the refund.
    if (e instanceof JobCancelled || isCancelRequested(id)) {
      xaoLog(id, 'cancelled by request — returning everything to the payer');
      try { await refundAndClose(readJob(id), 'cancelled by request — everything returned to the payer'); } catch {}
      PROCESSING.delete(id);
      return;
    }
    try {
      const j = readJob(id); j.error = msg;
      if (!FATAL_ERR.test(msg) && !/no items inscribed/.test(msg) && j.status !== 'AWAITING_DEPOSIT' && (j.retryCount = (j.retryCount || 0) + 1) <= MAX_RETRIES) {
        j.status = j.tokenId ? 'INSCRIBED' : 'FUNDED';
        j.progress = `recovered from a hiccup — resuming where it left off (attempt ${j.retryCount}/${MAX_RETRIES})`;
        j.progressAt = new Date().toISOString(); writeJob(j);
        xaoLog(id, `TRANSIENT error — auto-resume scheduled from ${j.status} (${j.retryCount}/${MAX_RETRIES}): ${msg}`);
        PROCESSING.delete(id); return;
      }
      // An already-minted token can't be un-minted, so never route it to a refund it can't honour.
      // Its delivery just needs recovery — park with the key retained instead of thrashing.
      if (j.tokenId && !FATAL_ERR.test(msg)) {
        j.status = 'NEEDS_RECOVERY'; j.keepKey = true;
        j.keepKeyReason = 'inscription minted but delivery did not finish — continue recovery to send it home';
        j.progress = j.keepKeyReason; j.progressAt = new Date().toISOString(); writeJob(j);
        xaoLog(id, `delivery incomplete for token #${j.tokenId} — parked as NEEDS_RECOVERY (not refunded): ${msg}`);
        PROCESSING.delete(id); return;
      }
      writeJob(j);
      xaoLog(id, `FATAL error (${FATAL_ERR.test(msg) ? 'deterministic failure' : 'retries exhausted'}) — refunding: ${msg}`);
    } catch {}
    try { await refundAndClose(readJob(id), 'error: ' + msg); } catch {}
    PROCESSING.delete(id);
  });
}
async function watchTick() {
  void syncWakeLock();
  for (const j of listJobsRaw()) {
    if (PROCESSING.has(j.jobId)) continue;
    // A cancel requested while the tab was closed. Honour it before any resume
    // logic below, or the watcher would happily restart the job we were asked to stop.
    if (j.cancelRequested && !['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED'].includes(j.status)) {
      background(j.jobId, () => refundAndClose(readJob(j.jobId), 'cancelled by request — everything returned to the payer'));
      continue;
    }
    // A page close/reload can interrupt the browser-held recovery between
    // transactions. Never strand the job in a non-actionable state: preserve
    // the key and require an explicit click to continue from a fresh inventory.
    if (j.status === 'RECOVERING') {
      j.status = 'NEEDS_RECOVERY';
      j.keepKey = true;
      j.keepKeyReason = 'recovery was interrupted — verify the latest holdings and continue';
      j.progress = j.keepKeyReason;
      j.progressAt = new Date().toISOString();
      writeJob(j);
      continue;
    }
    // Past the retry ceiling this job has ALREADY been through the fatal path and a
    // refund attempt. Re-running it just increments retryCount and burns API calls —
    // observed live climbing past attempt 18, two seconds apart. Park it where a
    // human can act instead, with the key kept so nothing is stranded.
    if ((j.retryCount || 0) > MAX_RETRIES && !['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED', 'NEEDS_RECOVERY'].includes(j.status)) {
      j.status = 'NEEDS_RECOVERY';
      j.keepKey = true;
      j.keepKeyReason = `stopped after ${j.retryCount} attempts — ${j.error || 'the job could not make progress'}. Use Recover to return anything left.`;
      j.progress = j.keepKeyReason;
      j.progressAt = new Date().toISOString();
      writeJob(j);
      xaoLog(j.jobId, `retry ceiling reached (${j.retryCount}) — parked as NEEDS_RECOVERY instead of resuming again`);
      continue;
    }
    // Backoff between auto-resume attempts: 15 s × attempt number.
    if (j.retryCount && j.status !== 'AWAITING_DEPOSIT' && Date.now() - (Date.parse(j.progressAt || '') || 0) < 15000 * j.retryCount) continue;
    // Deliver-only resume: inscribed but delivery was interrupted → finish delivery, never re-mint.
    if (j.status === 'INSCRIBED' && j.fastTrack && j.tokenId) {
      xaoLog(j.jobId, `inscribed (token #${j.tokenId}) but undelivered — resuming delivery`);
      background(j.jobId, async () => { const jj = readJob(j.jobId); jj.status = 'DELIVERING'; writeJob(jj); await deliver(jj); });
      continue;
    }
    // AWAITING_PARENT = funded, waiting for the parent inscription. Poll gently (~20 s): autoRun
    // re-checks the gate and either proceeds, keeps waiting, or (window over / wrong NFT) refunds all.
    if (j.status === 'AWAITING_PARENT' && Date.now() - (Date.parse(j.progressAt || '') || 0) < 20000) continue;
    if (!['AWAITING_DEPOSIT', 'FUNDED', 'EXPIRED', 'AWAITING_PARENT'].includes(j.status)) continue;
    // A job funded once counts as funded — mid-flight resumes have already spent part of the deposit.
    let funded = !!j.depositReceivedUstx;
    if (!funded) { try { funded = (await statusJob(j)).funded; } catch { continue; } }
    if (!funded) continue;
    // Reload-proof: restore bytes from IndexedDB; refund only after 3 consecutive failed restores.
    // Batch jobs keep bytes per item (`jobId:idx`) — every UNFINISHED item must restore.
    const restoreAll = async () => {
      if (!j.items) return restoreBytes(j.jobId);
      const pending = j.items.filter((it: any) => !it.tokenId && it.status !== 'FAILED' && it.status !== 'SKIPPED');
      const results = await Promise.all(pending.map((it: any) => restoreBytes(`${j.jobId}:${it.idx}`)));
      return results.every(Boolean);
    };
    if (!await restoreAll()) {
      j.bytesMisses = (j.bytesMisses || 0) + 1; writeJob(j);
      if (j.bytesMisses < 3) continue;
      background(j.jobId, () => refundAndClose(readJob(j.jobId), 'file bytes unrecoverable (browser storage cleared) — returning funds'));
      continue;
    }
    j.bytesMisses = 0;
    if (j.fastTrack) {
      xaoLog(j.jobId, j.retryCount ? `resuming inscription (attempt ${j.retryCount + 1})` : 'funded — starting auto-processing');
      background(j.jobId, () => autoRun(readJob(j.jobId)));
    }
  }
}
async function reapTick() {
  const now = Date.now();
  for (const j of listJobsRaw()) {
    if (PROCESSING.has(j.jobId)) continue;
    if (['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED', 'NEEDS_RECOVERY', 'EXPIRED'].includes(j.status)) continue;
    const last = Date.parse(j.progressAt || j.createdAt || '') || 0;
    // Payments can take many minutes to confirm — give AWAITING_DEPOSIT 12× the normal window.
    const win = j.status === 'AWAITING_DEPOSIT' ? WINDOW_MS * 12 : WINDOW_MS;
    if (!last || (now - last) < win) continue;
    background(j.jobId, () => refundAndClose(readJob(j.jobId), 'expired — no progress within window'));
  }
}

(window as any).XAO_AGENT_BUILD = AGENT_BUILD;   // version handshake — suno.html blocks live runs on mismatch
(window as any).XtrataAgent = {
  build: AGENT_BUILD,
  health: async () => ({ ok: true, mock: MOCK, core: CORE_NAME, net: 'mainnet', windowMs: WINDOW_MS, parentWindowMs: PARENT_WINDOW_MS, deployer: DEPLOYER, build: AGENT_BUILD }),
  // Live owner lookup for the UI (pre-job parent validation): read-only get-owner
  // on the core contract. Returns the owner principal string or null.
  ownerOf: async (id: string) => ownerOf(String(id)),
  // Parent checker for the UI: who owns each declared parent right now? (connected wallet / deposit / other)
  parentInfo: async (id: string) => {
    const job = readJob(id); const out: any[] = [];
    for (const pid of (job.parents || [])) out.push({ id: String(pid), owner: MOCK ? job.depositAddress : await ownerOf(String(pid)) });
    return { parents: out, depositAddress: job.depositAddress, core: `${CORE[0]}.${CORE[1]}` };
  },
  estimate: async (opts: any) => estimate({ ...opts, bytes: opts.bytes != null ? opts.bytes : (opts.file ? (opts.file as File).size : 0) }),
  createJob: async (opts: any) => (Array.isArray(opts?.items) && opts.items.length ? createBatchJob(opts) : createJob(opts)),
  estimateBatch: async (opts: any) => estimateBatch({ ...opts, itemsBytes: opts.itemsBytes ?? (opts.items || []).map((it: any) => (it.file ? (it.file as File).size : it.bytes || 0)) }),
  listJobs: async () => Promise.all(listJobsRaw().sort((a, b) => (b.jobId > a.jobId ? 1 : -1)).map(async (j) => { let funded = false, balanceUstx = '0'; if (j.status === 'AWAITING_DEPOSIT') { try { const s = await statusJob(j); funded = s.funded; balanceUstx = s.balanceUstx; } catch {} } return { ...publicJob(j), funded, balanceUstx }; })),
  getJob: async (id: string) => { const job = readJob(id); return { job: publicJob(job), status: await statusJob(job) }; },
  runJob: async (id: string) => { if (PROCESSING.has(id)) return { started: true, already: true }; const job = readJob(id); if (job.tokenId) return { error: 'already inscribed' }; const s = await statusJob(job); if (!s.funded) return { error: 'not funded yet' }; background(id, async () => { const j = readJob(id); j.status = 'INSCRIBING'; writeJob(j); await runInscribe(j); }); return { started: true }; },
  deliverJob: async (id: string) => { if (PROCESSING.has(id)) return { started: true, already: true }; const job = readJob(id); if (!job.tokenId) return { error: 'nothing to deliver yet' }; background(id, async () => { const j = readJob(id); j.status = 'DELIVERING'; writeJob(j); await deliver(j); }); return { started: true }; },
  /**
   * Stop a job and return everything to the payer. Safe to call whether or not the
   * job is currently running: the flag is persisted, a running upload aborts at its
   * next between-batch checkpoint, and the refund follows. Refuses once a token has
   * been minted — that cannot be un-minted, so recovery (which returns the token) is
   * the correct route, not a refund the job cannot honour.
   */
  cancelJob: async (id: string) => {
    const job = readJob(id);
    if (['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED'].includes(job.status)) return { error: `job is already ${job.status}` };
    if (job.tokenId || (job.items || []).some((i: any) => i.tokenId)) {
      return { error: 'this job has already minted an inscription — use recovery, which returns the token and the remaining STX' };
    }
    job.cancelRequested = true;
    job.progress = 'cancelling — returning everything to the payer';
    job.progressAt = new Date().toISOString();
    writeJob(job);
    xaoLog(id, 'cancel requested');
    // Already running: the loop aborts at its next checkpoint and background()'s
    // handler does the refund. Idle: refund right now.
    if (PROCESSING.has(id)) return { cancelling: true, jobId: id, wasRunning: true };
    background(id, () => refundAndClose(readJob(id), 'cancelled by request — everything returned to the payer'));
    return { cancelling: true, jobId: id, wasRunning: false };
  },
  recoverJob: async (id: string) => {
    if (PROCESSING.has(id)) return { started: true, already: true };
    const job = readJob(id);
    if (job.status !== 'NEEDS_RECOVERY') throw new Error(`job is ${job.status}, not NEEDS_RECOVERY`);
    PROCESSING.add(id);
    Promise.resolve().then(() => recoverJobAssets(readJob(id))).catch((e) => {
      try { const j = readJob(id); j.status = 'NEEDS_RECOVERY'; j.keepKey = true; j.error = errMsg(e); j.progress = `Recovery paused: ${errMsg(e)}`; j.progressAt = new Date().toISOString(); writeJob(j); } catch {}
    }).finally(() => PROCESSING.delete(id));
    return { started: true, jobId: id };
  },
  deleteJob: async (id: string) => { const job = readJob(id); if (job.ephemeralMnemonic) throw new Error('refusing to delete: job still holds a deposit key — deliver or recover it first'); if (!['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED'].includes(job.status)) throw new Error(`refusing to delete: job is ${job.status}, not finished`); localStorage.removeItem(jobKey(id)); BYTES.delete(id); idbDeleteBytes(id); (job.items || []).forEach((_: any, i: number) => { BYTES.delete(`${id}:${i}`); idbDeleteBytes(`${id}:${i}`); }); return { deleted: true, jobId: id }; },
  getReceiptHtml: (id: string) => { try { return readJob(id).receiptHtml || null; } catch { return null; } },
  getJobLog: (id: string) => { try { return readJob(id).log || []; } catch { return []; } },
};
// In-browser watcher + reaper — auto-run funded fast-track jobs; refund stalls/expiries. Tab-open only.
setInterval(watchTick, MOCK ? 2000 : 4000);
setInterval(reapTick, 20000);
// helpers already ported and available to the implementer/tester:
export { deriveFrom, newWallet, balance, quoteFee, mintSingle, stagedInscribe, getIdByHash, ownerOf, send, sendNft, sendStx, network, MOCK, CORE, DEPLOYER, AGENT_FEE_PCT, AGENT_FEE_ADDRESS, CHUNK, SINGLE_MAX, PERTX_MINER, DELIVERY_RESERVE, REFUND_TX_FEE, RECEIPT_EST, incHash, chunkBytes };
// Exported for the fault-injection harness. These two decide "who paid" and "has the
// parent arrived" — the questions behind the failures that shipped, and both are only
// meaningful when exercised against a degraded API rather than asserted on in source.
export { detectFunder, parentsStatus, heldInscriptions, waitTx, safeNonce, statusJob };

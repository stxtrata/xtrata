// engine.mjs — Forever Twins "large token" job engine.
//
// For a token whose art is over 512 KB the helper cannot take the file in one transaction. This
// engine does what Xtrata's own wizard (Agent One) does for a big file, then finishes with the
// helper's permissionless `inscribe-large (token-id, xtrata-id)`:
//
//   disposable wallet -> visitor funds it -> begin-inscription -> add-chunk-batch x N ->
//   seal-inscription -> helper.inscribe-large (twin goes into the helper's custody, fee 50/50 to the
//   payees) -> wait a grace period -> sweep what is left back to the address that paid.
//
// It deliberately has NO browser, Stacks or crypto dependency: every outside effect goes through the
// injected `io` object, so the same code is exercised against a simulated chain in
// ft-harness/sim/large-wizard-engine.mjs and against the real chain in the page (chain-io.ts).
//
// Differences from Agent One, on purpose:
//  * the 10% processing fee is the same rule as Agent One (a percentage of the request, grossed up so real costs
//    are covered, paid to the agent fee address) but is taken only after the twin is bound; a failed, cancelled or
//    lost job is refunded in full. The helper's own fee is a separate line in the quote
//  * NO duplicate-hash shortcut. The core lets several wallets seal identical bytes; Agent One would
//    skip the upload when the hash exists and then try to bind somebody else's inscription. This
//    engine only ever trusts its own wallet's upload session and its own sealed inscription
//  * it ends in `inscribe-large`, so the visitor receives STX change only, never an NFT, except a
//    stranded inscription if another wallet wins the token while the job runs
//  * the sweep is delayed (grace) and the stall rule is explicit (see CONFIG)

export const CHUNK = 16384;
export const BATCH = 32;                       // chunks per add-chunk-batch (core limit)
export const SINGLE_TX_MAX_BYTES = CHUNK * 32; // 524,288: above this a token needs this route

export const CONFIG = Object.freeze({
  // How long to wait after the twin is bound before sweeping the leftover STX home.
  graceMs: 0,                     // the sweep starts the moment the bind is confirmed; the stall rule below is the only timer
  // A running job with no progress for this long stops and sweeps what is left.
  stallMs: 2 * 60 * 60_000,
  // Replace a transaction at the same nonce with double the fee if it is not mined in this time.
  rbfAfterMs: 90_000,
  rbfMax: 3,
  // 2 s polls for the first 45, then 6 s: about 16 minutes of waiting per transaction.
  confirmPolls: 210,
  // Estimator spike handling (Agent One): 3 quick retries, then 12 polls 20 s apart.
  quickRetries: 3,
  feeWaitPolls: 12,
  feeWaitMs: 20_000,
  // Network read/broadcast hiccups: back off 15 s x attempt, capped.
  retryBackoffMs: 15_000,
  retryBackoffCapMs: 5 * 60_000,
  // Money (µSTX)
  mintCap: 2_000_000n,            // no single transaction may pay more than 2 STX in fees
  txOverheadBytes: 400n,          // signed tx bytes beyond the chunk payload
  smallTxReserve: 60_000n,        // begin / seal / bind, each, at a quiet network
  transferFeeFloor: 20_000n,      // transfers and sweeps: what we pay is what we reserve
  nftReturnReserve: 30_000n,      // returning a stranded inscription
  marginUstx: 250_000n,           // a little extra so a modest spike never strands the job
  batchMultX10: 20n,              // multi-tx upload fee reserve = 2.0 x the 1 µSTX/byte floor
  roundUstx: 10_000n,             // round the request up to 0.01 STX
  sweepFeeBudget: 60_000n,        // first sweep pass keeps 3x the floor fee so a fee bump never fails
  agentFeePct: 10n,               // processing fee: this % of EVERYTHING that was ever sent to the one-use wallet
  maxStepFailures: 12             // consecutive failures of one step before it is parked, not retried
});

const big = (v) => (typeof v === 'bigint' ? v : BigInt(String(v)));
const minB = (a, b) => (a < b ? a : b);
const maxB = (a, b) => (a > b ? a : b);
const ceilDiv = (a, b) => (a + b - 1n) / b;
const errMsg = (e) => String((e && e.message) || e);

export const TERMINAL = new Set(['COMPLETE', 'STOPPED', 'NEEDS_RECOVERY']);

// ---------------------------------------------------------------------------------------------
// Hashing / chunking (same rule as the core: running hash h = sha256(h || chunk), h0 = 32 zero bytes)
// ---------------------------------------------------------------------------------------------
export function chunkBytes(bytes) {
  const out = [];
  for (let i = 0; i < bytes.length; i += CHUNK) out.push(bytes.slice(i, i + CHUNK));
  return out;
}
export function rollingHashHex(chunks, sha256) {
  let h = new Uint8Array(32);
  for (const c of chunks) { const m = new Uint8Array(h.length + c.length); m.set(h, 0); m.set(c, h.length); h = sha256(m); }
  return Array.from(h, (b) => b.toString(16).padStart(2, '0')).join('');
}
export const normHex = (h) => String(h || '').toLowerCase().replace(/^0x/, '');

// ---------------------------------------------------------------------------------------------
// Funding: how much the visitor is asked to send. Pure, so it can be tested exhaustively.
// ---------------------------------------------------------------------------------------------
/**
 * @param {{bytes:number, chunks:number, core:{begin:bigint,seal:bigint,total:bigint}, helperFee:bigint, congestionX10?:bigint}} p
 *   congestionX10: how many tenths of the 1 µSTX/byte floor the node's LOW estimate currently asks (10 = quiet).
 */
export function planFunding(p, cfg = CONFIG) {
  const bytes = BigInt(p.bytes), chunks = BigInt(p.chunks);
  const batches = ceilDiv(chunks, BigInt(BATCH));
  const congestionX10 = maxB(10n, big(p.congestionX10 ?? 10n));
  const core = { begin: big(p.core.begin), seal: big(p.core.seal), total: big(p.core.total) };
  const helperFee = big(p.helperFee);

  // The network's own floor is 1 µSTX per byte, and a 512 KiB batch pays that floor whatever anyone
  // chooses. Everything above it is congestion, which is what the multiplier buys.
  const floorUpload = bytes + batches * cfg.txOverheadBytes;
  const multX10 = maxB(cfg.batchMultX10, (congestionX10 * 3n) / 2n);
  const minerUpload = (floorUpload * multX10) / 10n;
  const smallFees = (3n * cfg.smallTxReserve * congestionX10) / 10n;   // begin, seal, bind
  const sweepReserve = cfg.transferFeeFloor + cfg.sweepFeeBudget;      // the sweep itself, with room to bump
  const returnReserve = cfg.nftReturnReserve;                          // only used if the token is lost to another wallet
  const protocol = core.total;
  const helper = helperFee;

  const pct = big(cfg.agentFeePct ?? 0n);
  // Agent One's rule: the fee is pct% of the request, so the request is grossed up by pct/(100-pct) and the
  // real costs are still covered after the fee comes out. One extra transfer fee is reserved to pay it.
  const baseCosts = protocol + helper + minerUpload + smallFees + sweepReserve + returnReserve + cfg.marginUstx + cfg.transferFeeFloor;
  const exactRequired = pct > 0n && pct < 100n ? baseCosts + (baseCosts * pct) / (100n - pct) : baseCosts;
  const required = ceilDiv(exactRequired, cfg.roundUstx) * cfg.roundUstx;
  const agentFee = pct > 0n && pct < 100n ? (required * pct) / 100n : 0n;
  // What a quiet network is expected to actually cost, so the visitor sees both numbers.
  const expectedMiner = (floorUpload * 13n) / 10n + 3n * 10_000n;
  const expected = protocol + helper + expectedMiner + agentFee;
  return {
    bytes: Number(bytes), chunks: Number(chunks), batches: Number(batches), congestionX10: congestionX10.toString(),
    protocolFee: protocol, beginFee: core.begin, sealFee: core.seal, helperFee: helper,
    minerUpload, smallFees, sweepReserve, returnReserve, margin: cfg.marginUstx,
    agentFeePct: Number(pct), agentFee,
    required, expected, change: required - expected
  };
}

// ---------------------------------------------------------------------------------------------
// The engine
// ---------------------------------------------------------------------------------------------
/**
 * io contract (all async unless noted). Reads that can fail must THROW, never return an empty answer:
 * a failed balance read must not look like an empty wallet, a failed owner read must not look like
 * "nobody owns it".
 *
 *   now(): number, sleep(ms)
 *   sha256(Uint8Array): Uint8Array            (sync)
 *   newWallet(): {mnemonic, address}          (sync) ; walletFor(mnemonic): {address}
 *   balance(addr): bigint
 *   coreQuote(bytes, chunks): {begin, seal, total, batches}
 *   helperFee(addr?): bigint                  (helper fee for this payer; no addr = the public fee)
 *   congestionX10(): bigint
 *   helperReady(): {finalized:boolean, lod:boolean, mismatch?:string}   lod = the helper has inscribe-large
 *   canonical(token): {hash, totalSize, mime, tokenUri} | null
 *   binding(token): {xtrataId, escrowed, inscriber} | null
 *   uploadState(hash, owner): {index} | null
 *   held(addr): string[]                      ids of core inscriptions the wallet holds
 *   inscriptionOwner(xid): string | null
 *   pendingTxs(addr): [{nonce, fee, kind}]     this address's transactions still in the mempool, lowest nonce first
 *   funderOf(addr): string | null             the address that sent the deposit
 *   estimateLowFee(call, from): bigint | null the node's LOW estimate for this call
 *   broadcast(call, {from, fee, nonce, spendCap}): {txid, nonce}   (throws {kind:'FEE_TOO_LOW'|'REJECTED'})
 *   txStatus(txid): {state:'success'|'pending'|'abort'|'dropped'|'unknown', result?:string}
 *   nextNonce(addr): bigint
 *   loadBytes(job): Uint8Array | null  saveBytes(job, bytes)  dropBytes(job)
 *
 * A "call" is {kind:'core'|'helper', fn, args} or {kind:'stx', to, amount} or {kind:'nft', id, to}.
 */
export function createEngine({ io, store, cfg = CONFIG, onUpdate = () => {}, agentFeeAddress = null }) {
  const running = new Set();

  // ---- job persistence --------------------------------------------------------------------
  const get = (id) => { const j = store.get(id); if (!j) throw new Error(`job not found: ${id}`); return j; };
  // A cancel can arrive while a step is mid-flight holding its own copy of the job: never let that copy erase it.
  const save = (j) => { const cur = store.get(j.id); if (cur && cur.cancelRequested) j.cancelRequested = true; store.set(j.id, j); try { onUpdate(j); } catch { /* UI errors never touch money logic */ } return j; };
  const note = (j, m) => { j.log = (j.log || []).concat([{ t: io.now(), m }]).slice(-200); save(j); };
  const touch = (j) => { j.progressAt = io.now(); j.failStreak = 0; j.error = null; j.nextTryAt = 0; };
  const publicJob = (j) => { const { mnemonic, ...pub } = j; return { ...pub, hasKey: !!mnemonic }; };

  // ---- quoting ----------------------------------------------------------------------------
  async function quote({ bytes, chunks }) {
    const core = await io.coreQuote(bytes, chunks);
    const helperFee = await io.helperFee();
    let congestionX10 = 10n;
    try { congestionX10 = await io.congestionX10(); } catch { /* unknown = assume quiet; the per-tx caps still protect the wallet */ }
    return planFunding({ bytes, chunks, core, helperFee, congestionX10 }, cfg);
  }

  // ---- creating a job ---------------------------------------------------------------------
  /**
   * Refuses (spends and asks for nothing) unless every check passes:
   *   helper finalised and matching the registry, token in the record and large, not already twinned,
   *   bytes match the record's size and hash.
   */
  async function createJob({ token, bytes, expectedFunder = null, helper, core, label = null }) {
    const tid = String(token);
    const hs = await io.helperReady();
    if (hs.mismatch) throw new Error(`The deployed helper does not match the registry (${hs.mismatch}). Nothing was started.`);
    if (!hs.finalized) throw new Error('The collection record is not finalised yet, so nothing can be twinned. Nothing was started.');
    if (!hs.lod) throw new Error('This collection’s helper does not have the large-file route, so tokens over 512 KB cannot be twinned from this page. Nothing was started.');
    const c = await io.canonical(tid);
    if (!c) throw new Error('This token is not in the finalised record. Nothing was started.');
    if (Number(c.totalSize) <= SINGLE_TX_MAX_BYTES) throw new Error('This token is 512 KB or smaller: use the normal one-click twin button instead.');
    const b = await io.binding(tid);
    if (b) throw new Error(`This token already has a twin (inscription #${b.xtrataId}). Nothing was started.`);
    if (bytes.length !== Number(c.totalSize)) throw new Error(`The art is ${bytes.length} bytes; the record expects ${c.totalSize}. Not the canonical art, nothing was started.`);
    const chunks = chunkBytes(bytes);
    if (rollingHashHex(chunks, io.sha256) !== normHex(c.hash)) throw new Error('The art does not match the record (hash differs). Nothing was started.');
    const q = await quote({ bytes: bytes.length, chunks: chunks.length });
    const w = io.newWallet();
    const job = {
      id: `ftl-${tid}-${io.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      v: 1, kind: 'ft-large', token: tid, helper, core, label,
      hash: normHex(c.hash), size: Number(c.totalSize), mime: c.mime, tokenUri: c.tokenUri, chunks: chunks.length,
      address: w.address, mnemonic: w.mnemonic, expectedFunder,
      required: q.required.toString(), expected: q.expected.toString(),
      agentFee: q.agentFee.toString(), agentFeePct: q.agentFeePct, agentFeeAddress: q.agentFee > 0n ? agentFeeAddress : null, agentFeePaid: '0',
      plan: Object.fromEntries(Object.entries(q).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v])),
      status: 'AWAITING_FUNDS', step: 'preflight', createdAt: io.now(), progressAt: io.now(),
      uploaded: 0, begun: false, sealedId: null, bindTx: null, outcome: null, funder: null,
      failStreak: 0, retries: 0, log: []
    };
    await io.saveBytes(job, bytes);
    note(job, `job created for token #${tid}: ${job.chunks} chunks, ask ${job.required} µSTX`);
    return publicJob(job);
  }

  // ---- reads that must never lie ----------------------------------------------------------
  async function bestBalance(addr, tries = 3) {
    let best = null, lastErr = null;
    for (let i = 0; i < tries; i++) {
      try { const b = await io.balance(addr); if (best == null || b > best) best = b; } catch (e) { lastErr = e; }
      if (i < tries - 1) await io.sleep(2000);
    }
    if (best == null) throw Object.assign(new Error(`could not read the wallet balance (${errMsg(lastErr)})`), { kind: 'API' });
    return best;
  }
  async function waitMempoolClear(j, maxMs) {
    let t0 = io.now(), unsticks = 0;
    for (;;) {
      let q;
      try { q = await io.pendingTxs(j.address); } catch (e) { throw Object.assign(new Error(`could not read the mempool (${errMsg(e)})`), { kind: 'API' }); }
      if (!q.length) return;
      if (io.now() - t0 > maxMs) {
        // The queue is jammed: the front transaction is not being mined and everything behind it waits for it,
        // sweep included. Replace it (same nonce, higher fee) with a 1 µSTX payment to the payer. Agent One's
        // unstickQueue, restricted to the one transaction at the front. A self-transfer is rejected by the node.
        if (unsticks < 3 && await unstick(j, q[0])) { unsticks += 1; t0 = io.now(); continue; }
        throw Object.assign(new Error('a transaction from this wallet is still pending and could not be replaced; waiting'), { kind: 'PENDING' });
      }
      await io.sleep(6000);
    }
  }
  async function unstick(j, front) {
    const to = j.funder || await io.funderOf(j.address);
    if (!to) return false;
    const bal = await bestBalance(j.address, 1);
    const cap = minB(cfg.mintCap, bal / 3n);
    let fee = front.fee * 3n; if (fee < cfg.transferFeeFloor * 2n) fee = cfg.transferFeeFloor * 2n; if (fee > cap) fee = cap;
    if (fee <= front.fee) { note(j, `the stuck transaction (nonce ${front.nonce}, ${front.kind}) pays ${front.fee} µSTX and the wallet cannot afford a higher replacement`); return false; }
    note(j, `clearing stuck transaction at nonce ${front.nonce} (${front.kind}): replacing ${front.fee} µSTX with a 1 µSTX payment to the payer at ${fee} µSTX`);
    try {
      const r = await io.broadcast({ kind: 'stx', to, amount: 1n }, { from: j.address, fee, nonce: BigInt(front.nonce), spendCap: null });
      await confirmOrEscalate(j, { kind: 'stx', to, amount: 1n }, { txid: r.txid, fee, effCap: cap, nonce: BigInt(front.nonce), spendCap: null });
      return true;
    } catch (e) { note(j, `could not clear it: ${errMsg(e)}`); return false; }
  }

  // ---- sending, with the safeguards ---------------------------------------------------------
  // Mirrors Agent One's send(): low fee estimate, capped; waits out estimator spikes; never broadcasts a
  // fee it knows will be rejected; bumps FeeTooLow; replaces a transaction that is not being mined.
  async function sendCall(j, call, { spendCap = null, feeCeiling = null, minFee = 0n, reserveAfter = 0n, onWait = null, skipClear = false, nonceOverride = null, deferConfirm = false, track = null } = {}) {
    const from = j.address;
    if (!skipClear) await waitMempoolClear(j, 20 * 60_000);
    const bal = await bestBalance(from, 1);
    let effCap = cfg.mintCap;
    const headroom = bal > reserveAfter ? bal - reserveAfter : 0n;
    if (headroom === 0n) throw Object.assign(new Error(`${call.fn || call.kind}: the wallet has no headroom left for fees. Nothing was broadcast.`), { kind: 'UNAFFORDABLE', short: reserveAfter - bal + 1n });
    effCap = minB(effCap, headroom);
    if (feeCeiling != null && feeCeiling > 0n) effCap = minB(effCap, feeCeiling);
    let fee, cheapest = null;
    for (let attempt = 0; ; attempt++) {
      let est = await io.estimateLowFee(call, from);
      if (est == null) est = minFee > 0n ? minFee : cfg.smallTxReserve / 6n;
      if (est < minFee) est = minFee;
      fee = est;
      if (cheapest == null || fee < cheapest) cheapest = fee;
      if (fee <= effCap) break;
      if (fee <= (effCap * 5n) / 4n) { fee = effCap; break; }                       // marginal overage: clamp
      if (attempt < cfg.quickRetries) { await io.sleep(6000); continue; }
      if (attempt < cfg.quickRetries + cfg.feeWaitPolls) {
        const m = `network fees are high (${fee} µSTX asked, ${effCap} affordable). Waiting for them to settle (${attempt - cfg.quickRetries + 1}/${cfg.feeWaitPolls})`;
        note(j, m); if (onWait) onWait(m);
        await io.sleep(cfg.feeWaitMs); continue;
      }
      throw Object.assign(new Error(`${call.fn || call.kind}: cannot afford the network fee: cheapest quote ${cheapest} µSTX, affordable ${effCap} µSTX. Nothing was broadcast.`), { kind: 'FEE_HIGH', cheapest, effCap });
    }
    let nonce = nonceOverride != null ? nonceOverride : await io.nextNonce(from);
    let sent;
    for (let bump = 0; ; bump++) {
      try { sent = await io.broadcast(call, { from, fee, nonce, spendCap }); break; }
      catch (e) {
        if (e && e.kind === 'FEE_TOO_LOW' && bump < 3) {
          const next = fee * 2n > effCap ? effCap : fee * 2n;
          if (next <= fee) throw Object.assign(new Error(`${call.fn || call.kind}: FeeTooLow at ${fee} µSTX and already at the affordable ceiling`), { kind: 'FEE_HIGH', cheapest: fee, effCap });
          note(j, `${call.fn || call.kind}: FeeTooLow at ${fee} µSTX, retrying at ${next} µSTX`);
          fee = next; continue;
        }
        throw e;
      }
    }
    const usedNonce = sent.nonce != null ? sent.nonce : nonce;
    if (track) track(sent.txid);
    const pend = { txid: sent.txid, fee, effCap, nonce: usedNonce, spendCap, track };
    if (deferConfirm) return { ...pend, call };          // broadcast now, confirm later: lets two transfers ride in the same block
    return confirmOrEscalate(j, call, pend);
  }

  async function confirmOrEscalate(j, call, { txid, fee, effCap, nonce, spendCap, track = null }) {
    const txids = [txid];
    let bumps = 0, lastEscalate = io.now(), reads = 0, lastErr = null;
    note(j, `${call.fn || call.kind}: broadcast ${txid} at ${fee} µSTX`);
    for (let i = 0; i < cfg.confirmPolls; i++) {
      for (const id of txids) {
        try {
          const s = await io.txStatus(id);
          reads += 1;
          if (s.state === 'success') return { txid: id, result: s.result || '' };
          if (s.state === 'abort') throw Object.assign(new Error(`transaction aborted: ${s.result || 'unknown'}`), { kind: 'ABORT', result: s.result || '', txid: id });
          if (s.state === 'dropped' && txids.length === 1) throw Object.assign(new Error('transaction dropped from the mempool'), { kind: 'DROPPED', txid: id });
        } catch (e) {
          if (e && (e.kind === 'ABORT' || e.kind === 'DROPPED')) throw e;
          lastErr = e;
        }
      }
      if (bumps < cfg.rbfMax && io.now() - lastEscalate >= cfg.rbfAfterMs) {
        const next = fee * 2n > effCap ? effCap : fee * 2n;
        if (next > fee) {
          lastEscalate = io.now();
          try {
            const r = await io.broadcast(call, { from: j.address, fee: next, nonce, spendCap });
            bumps += 1; fee = next; txids.push(r.txid); if (track) track(r.txid);
            note(j, `${call.fn || call.kind}: not mined after ${Math.round(cfg.rbfAfterMs / 1000)} s, replaced nonce ${nonce} at ${fee} µSTX (${bumps}/${cfg.rbfMax})`);
          } catch (e) { note(j, `${call.fn || call.kind}: could not replace (${errMsg(e)}), still waiting`); }
        } else { lastEscalate = io.now(); }
      }
      await io.sleep(i < 45 ? 2000 : 6000);
    }
    if (!reads) throw Object.assign(new Error(`could not reach the API to confirm ${txids[0]} (${errMsg(lastErr)}); the transaction may well have landed`), { kind: 'API' });
    throw Object.assign(new Error(`not confirmed yet: ${txids.join(', ')}`), { kind: 'NOT_CONFIRMED' });
  }

  // ---- pipeline steps -----------------------------------------------------------------------
  // The art, from browser storage or a re-fetch, proven to be exactly the record's art. Anything else would fail at
  // the seal after the upload had already been paid for, so nothing is spent until this passes.
  async function loadVerified(j) {
    const bytes = await io.loadBytes(j);
    if (!bytes || bytes.length !== j.size) return null;
    return rollingHashHex(chunkBytes(bytes), io.sha256) === j.hash ? bytes : null;
  }

  async function stepFunding(j) {
    const bal = await bestBalance(j.address);
    j.balance = bal.toString();
    if (bal < big(j.required)) { save(j); return { sleep: 10_000 }; }
    // Who paid? That address gets the change, and nothing else ever does.
    const funder = j.funder || await io.funderOf(j.address);
    if (!funder) { note(j, 'funds have arrived but the paying address could not be read yet; retrying'); return { sleep: 10_000 }; }
    j.funder = funder; j.fundedAt = io.now(); j.fundedUstx = bal.toString();
    if (j.expectedFunder && j.expectedFunder !== funder) {
      note(j, `paid from ${funder} but this job is locked to ${j.expectedFunder}; returning everything to the sender`);
      return startStop(j, 'locked-funder', `Paid from a different address than the connected wallet; returned to the sender.`);
    }
    j.status = 'RUNNING'; j.step = 'preflight'; touch(j);
    note(j, `funded (${bal} µSTX) by ${funder}`);
    save(j); return { sleep: 0 };
  }

  // Cheap read-only checks, repeated before every costly step. Returns a reason string if the job must stop.
  async function raceCheck(j) {
    const hs = await io.helperReady();
    if (hs.mismatch) return `the helper no longer matches the registry (${hs.mismatch})`;
    if (!hs.finalized) return 'the collection record is no longer finalised';
    if (!hs.lod) return 'the helper no longer offers the large-file route';
    const b = await io.binding(j.token);
    if (b && String(b.xtrataId) !== String(j.sealedId)) return { lostRace: true, by: b };
    return null;
  }

  async function stepPreflight(j) {
    const r = await raceCheck(j);
    if (r && r.lostRace) return startStop(j, 'lost-race', `Another wallet twinned token #${j.token} first (inscription #${r.by.xtrataId}). Nothing more was spent.`);
    if (r) return startStop(j, 'blocked', `Stopped before spending: ${r}.`);
    // Re-quote at the moment of spending: the core fee and the helper fee can both have changed since the quote.
    if (!j.begun && !(await loadVerified(j))) return startStop(j, 'bytes-lost', 'The art could not be re-loaded and verified against the record, so nothing was spent. The funds are being returned.');
    const q = await quote({ bytes: j.size, chunks: j.chunks });
    const bal = await bestBalance(j.address);
    j.balance = bal.toString();
    // What is still ahead at today's prices (what was already spent is gone; only the rest matters).
    const ahead = await remainingCost(j, q);
    if (bal < ahead) return needFunds(j, ahead - bal, `the price moved or less is left than planned: ${ahead} µSTX needed from here, ${bal} in the wallet`);
    j.step = j.begun ? 'upload' : 'begin'; touch(j); save(j); return { sleep: 0 };
  }

  // What still has to be paid from the current point, at the live quote.
  async function remainingCost(j, q) {
    const uploadedChunks = j.uploaded || 0;
    const left = Math.max(0, j.chunks - uploadedChunks);
    const batchesLeft = BigInt(Math.ceil(left / BATCH));
    const floor = BigInt(left) * BigInt(CHUNK) + batchesLeft * cfg.txOverheadBytes;
    const multX10 = maxB(cfg.batchMultX10, (big(q.congestionX10) * 3n) / 2n);
    const miner = (floor * multX10) / 10n;
    const begin = j.begun ? 0n : q.beginFee;
    const seal = j.sealedId ? 0n : q.sealFee;
    const helper = j.bindTx ? 0n : q.helperFee;
    const small = ((j.begun ? 0n : 1n) + (j.sealedId ? 0n : 1n) + (j.bindTx ? 0n : 1n)) * (cfg.smallTxReserve * big(q.congestionX10)) / 10n;
    return begin + seal + helper + miner + small + cfg.transferFeeFloor + cfg.sweepFeeBudget;
  }

  function needFunds(j, shortfall, why) {
    j.status = 'NEEDS_FUNDS'; j.shortfall = shortfall.toString(); j.error = why;
    note(j, `paused: ${why}. Send at least ${shortfall} µSTX more to ${j.address} to continue`);
    save(j); return { sleep: 15_000 };
  }

  async function stepBegin(j) {
    const st = await io.uploadState(j.hash, j.address);
    if (st) { j.begun = true; j.uploaded = st.index; j.step = 'upload'; touch(j); save(j); return { sleep: 0 }; }
    if (j.begun) {
      // We began earlier but the session is gone: sealed already, or expired.
      const held = await io.held(j.address);
      if (held.length) { j.sealedId = held[0]; j.step = 'bind'; touch(j); save(j); return { sleep: 0 }; }
      return startStop(j, 'expired', 'The upload session expired on-chain (the core drops idle sessions), so the chunks already paid for are forfeit. The leftover STX is being returned.');
    }
    const q = await io.coreQuote(j.size, j.chunks);
    const r = await sendCall(j, { kind: 'core', fn: 'begin-inscription',
      args: [{ t: 'buff', hex: j.hash }, { t: 'ascii', v: j.mime }, { t: 'uint', v: String(j.size) }, { t: 'uint', v: String(j.chunks) }] },
      { spendCap: q.begin, reserveAfter: await laterReserve(j, 'begin') });
    j.begun = true; j.beginTx = r.txid; j.uploaded = 0; j.step = 'upload'; touch(j); note(j, 'upload session started'); save(j);
    return { sleep: 0 };
  }

  // What must remain in the wallet after a given step so the later steps stay payable.
  async function laterReserve(j, after) {
    const q = await io.coreQuote(j.size, j.chunks);
    const helperFee = await io.helperFee(j.address);
    const sweep = cfg.transferFeeFloor + cfg.sweepFeeBudget;
    const small = cfg.smallTxReserve;
    if (after === 'bind') return sweep;
    if (after === 'seal') return helperFee + small + sweep;
    if (after === 'batch') return q.seal + helperFee + small * 2n + sweep;
    return q.seal + helperFee + small * 2n + sweep;                                 // after begin: batches are capped separately
  }

  async function stepUpload(j) {
    const bytes = await loadVerified(j);
    if (!bytes) return startStop(j, 'bytes-lost', 'The art could not be re-loaded and verified against the record, so the job cannot continue safely. The leftover STX is being returned.');
    const chunks = chunkBytes(bytes);
    const q = await io.coreQuote(j.size, j.chunks);
    for (;;) {
      if (j.cancelRequested) return startStop(j, 'cancelled', 'Cancelled before sealing. The leftover STX is being returned.');
      const st = await io.uploadState(j.hash, j.address);
      if (!st) { j.step = 'begin'; save(j); return { sleep: 0 }; }
      j.uploaded = st.index; save(j);
      if (st.index >= j.chunks) break;
      // Do not pour money into an upload that can no longer win.
      const r = await raceCheck(j);
      if (r && r.lostRace) return startStop(j, 'lost-race', `Another wallet twinned token #${j.token} first (inscription #${r.by.xtrataId}). The upload was stopped; the remaining STX is being returned.`);
      if (r) return startStop(j, 'blocked', `Stopped: ${r}.`);
      const remBatches = BigInt(Math.ceil((j.chunks - st.index) / BATCH));
      const tail = await laterReserve(j, 'batch');
      const bal = await bestBalance(j.address, 2);
      const spendable = bal > tail ? bal - tail : 0n;
      // Share the runway by BYTES, not by batch count: the last batch is usually short, and an equal split
      // starves the big early batches (a batch paying under the market rate is simply not mined).
      const thisBytes = BigInt(chunks.slice(st.index, st.index + BATCH).reduce((a, c) => a + c.length, 0)) + cfg.txOverheadBytes;
      const remBytes = BigInt(j.size - st.index * CHUNK) + remBatches * cfg.txOverheadBytes;
      const share = (spendable * thisBytes) / remBytes;
      if (share < thisBytes) {
        const want = remBytes + tail;
        return needFunds(j, want > bal ? want - bal : 1n, `not enough left to pay the remaining ${remBatches} upload batch(es) at the network floor`);
      }
      const batch = chunks.slice(st.index, st.index + BATCH);
      const res = await sendCall(j, { kind: 'core', fn: 'add-chunk-batch', args: [{ t: 'buff', hex: j.hash }, { t: 'list-buff', bytes: batch }] },
        { spendCap: null, feeCeiling: share, reserveAfter: tail });
      void res;
      const st2 = await io.uploadState(j.hash, j.address);
      if (!st2 || st2.index <= st.index) throw Object.assign(new Error(`upload stalled at chunk ${st.index}`), { kind: 'STALLED_UPLOAD' });
      j.uploaded = st2.index; touch(j); save(j);
      note(j, `uploaded ${st2.index}/${j.chunks} chunks`);
    }
    j.step = 'seal'; touch(j); save(j); return { sleep: 0 };
  }

  async function stepSeal(j) {
    if (j.cancelRequested) return startStop(j, 'cancelled', 'Cancelled before sealing. The leftover STX is being returned.');
    // Last cheap exit: sealing is what mints, and a lost race makes the seal pointless.
    const r = await raceCheck(j);
    if (r && r.lostRace) return startStop(j, 'lost-race', `Another wallet twinned token #${j.token} first (inscription #${r.by.xtrataId}). Not sealing; the remaining STX is being returned.`);
    if (r) return startStop(j, 'blocked', `Stopped before sealing: ${r}.`);
    // Do not seal unless the helper fee and the bind transaction are also affordable: a sealed but unbound
    // inscription is valid but is not the twin the visitor came for.
    const q = await io.coreQuote(j.size, j.chunks);
    const helperFee = await io.helperFee(j.address);
    const bal = await bestBalance(j.address);
    const need = q.seal + helperFee + cfg.smallTxReserve * 2n + cfg.transferFeeFloor + cfg.sweepFeeBudget;
    if (bal < need) return needFunds(j, need - bal, `sealing needs ${need} µSTX (core seal fee, helper fee and miner fees) and the wallet holds ${bal}`);
    let id = null;
    const held0 = await io.held(j.address);
    if (!held0.length) {
      const res = await sendCall(j, { kind: 'core', fn: 'seal-inscription', args: [{ t: 'buff', hex: j.hash }, { t: 'ascii', v: j.tokenUri }] },
        { spendCap: q.seal, reserveAfter: await laterReserve(j, 'seal') });
      const m = /\(ok u(\d+)\)/.exec(res.result || '') || /token-id u(\d+)/.exec(res.result || '');
      id = m ? m[1] : null;
    }
    if (!id) { const held = await io.held(j.address); id = held.length ? held[0] : null; }
    if (!id) throw Object.assign(new Error('sealed, but the inscription id could not be read yet'), { kind: 'API' });
    j.sealedId = id; j.step = 'bind'; touch(j); note(j, `sealed as inscription #${id}`); save(j);
    return { sleep: 0 };
  }

  async function stepBind(j) {
    // Already bound to our inscription (a previous attempt landed)? Then we are done.
    const b0 = await io.binding(j.token);
    if (b0 && String(b0.xtrataId) === String(j.sealedId)) return bound(j);
    if (b0) return lostAfterSeal(j, b0);
    const owner = await io.inscriptionOwner(j.sealedId);
    if (owner !== j.address) {
      if (!owner) throw Object.assign(new Error('could not read who owns the sealed inscription'), { kind: 'API' });
      return startStop(j, 'inscription-moved', `Inscription #${j.sealedId} is no longer in the job wallet (owner ${owner}). Nothing more to do.`);
    }
    const helperFee = await io.helperFee(j.address);
    const bal = await bestBalance(j.address);
    const need = helperFee + cfg.smallTxReserve + cfg.transferFeeFloor;
    if (bal < need) return needFunds(j, need - bal, `the helper fee (${helperFee} µSTX) plus a miner fee is more than the wallet holds (${bal})`);
    let res;
    try {
      res = await sendCall(j, { kind: 'helper', fn: 'inscribe-large', args: [{ t: 'uint', v: j.token }, { t: 'uint', v: j.sealedId }], nft: { id: j.sealedId } },
        { spendCap: helperFee, reserveAfter: cfg.transferFeeFloor });
    } catch (e) {
      if (e && e.kind === 'ABORT') {
        const b = await io.binding(j.token);
        if (b && String(b.xtrataId) !== String(j.sealedId)) return lostAfterSeal(j, b);
        j.bindAborts = (j.bindAborts || 0) + 1;
        note(j, `bind aborted on-chain: ${e.result}`);
        if (j.bindAborts >= 2) return startStop(j, 'bind-failed', `The helper refused the final step (${e.result}). Your inscription #${j.sealedId} is a valid permanent copy and is being sent to you with the leftover STX.`);
        save(j); return { sleep: 5000 };
      }
      throw e;
    }
    j.bindTx = res.txid; save(j);
    const b = await io.binding(j.token);
    if (!b || String(b.xtrataId) !== String(j.sealedId)) throw Object.assign(new Error('bind confirmed but the binding cannot be read yet'), { kind: 'API' });
    return bound(j);
  }

  function bound(j) {
    j.outcome = 'twinned'; j.step = 'settle'; j.sweepAfter = io.now() + (cfg.graceMs || 0); touch(j);
    // Confirmed on-chain and read back: the sweep starts now. (A grace period is still honoured if one is configured.)
    j.status = cfg.graceMs > 0 ? 'SWEEP_PENDING' : 'STOPPING';
    note(j, `twinned: token #${j.token} is bound to inscription #${j.sealedId}. ${cfg.graceMs > 0 ? `Settling after a ${Math.round(cfg.graceMs / 60000)} min wait` : 'Settling now: the processing fee and your change go out together'}`);
    save(j); return { sleep: 5000 };
  }
  function lostAfterSeal(j, b) {
    return startStop(j, 'lost-race', `Another wallet twinned token #${j.token} first (inscription #${b.xtrataId}). Your inscription #${j.sealedId} is still a valid permanent copy of the art and is being sent to you with the leftover STX.`);
  }

  // ---- stopping and sweeping ---------------------------------------------------------------
  function startStop(j, outcome, message) {
    j.status = 'STOPPING'; j.outcome = outcome; j.message = message; j.step = 'sweep'; j.stopAt = io.now();
    // A half-finished upload is worth keeping the key for while the on-chain session can still be resumed.
    j.resumable = j.begun && !j.sealedId && !['lost-race', 'expired', 'blocked', 'locked-funder'].includes(outcome);
    note(j, message); save(j); return { sleep: 0 };
  }

  async function sweep(j) {
    const to = j.funder || await io.funderOf(j.address);
    if (!to) {
      // Nothing has arrived: there is nothing to return. The key is kept so a late payment is never stranded.
      const bal0 = await bestBalance(j.address);
      if (bal0 === 0n) { j.status = 'STOPPED'; keepKey(j, 'never funded: key kept so a late payment can still be returned'); note(j, 'closed: nothing was ever sent to the wallet'); save(j); return { done: true }; }
      throw Object.assign(new Error('funds are in the wallet but the paying address is not readable yet'), { kind: 'API' });
    }
    j.funder = to;
    await waitMempoolClear(j, 20 * 60_000);
    // 0. what the processing fee is, once, and whether a previous attempt already paid it
    const feeTo = j.outcome === 'twinned' ? j.agentFeeAddress : null;
    const trackFee = (id) => { j.agentFeeTxids = Array.from(new Set([...(j.agentFeeTxids || []), id])); save(j); };
    let feeLeft = 0n;
    if (feeTo && big(j.agentFeePct || 0) > 0n) {
      if (j.agentFeeDue == null) {
        // The twin must still be bound to OUR inscription: a fee is only ever charged on a job that produced the twin.
        const bnd = await io.binding(j.token);
        if (!bnd || String(bnd.xtrataId) !== String(j.sealedId)) { j.agentFeeDue = '0'; note(j, 'the binding could not be confirmed at settlement time: no processing fee is charged'); }
        else {
          // 10% of everything ever sent to this wallet. A stale read (lower than what funding saw) is refused, not trusted.
          const received = await io.totalReceived(j.address);
          if (received < big(j.fundedUstx || 0)) throw Object.assign(new Error('the total received could not be read reliably yet'), { kind: 'API' });
          j.receivedUstx = received.toString();
          j.agentFeeDue = ((received * big(j.agentFeePct)) / 100n).toString();
          note(j, `processing fee: ${j.agentFeePct}% of ${received} µSTX received = ${j.agentFeeDue} µSTX`);
        }
        save(j);
      }
      // A previous attempt may have broadcast it (possibly replaced by a higher-fee copy): any success counts as paid.
      if ((j.agentFeeTxids || []).length && big(j.agentFeePaid || 0) === 0n) {
        for (const id of j.agentFeeTxids) { const st = await io.txStatus(id); if (st.state === 'success') { j.agentFeePaid = j.agentFeeAmt || j.agentFeeDue; note(j, `processing fee already paid (${id})`); break; } }
        if (big(j.agentFeePaid || 0) === 0n) { j.agentFeeTxids = []; }
        save(j);
      }
      const due = big(j.agentFeeDue), paid = big(j.agentFeePaid || 0);
      feeLeft = due > paid ? due - paid : 0n;
    }
    // 1. any inscription in the wallet (a stranded seal, never the bound twin: that is in the helper)
    const held = await io.held(j.address);
    for (const id of held) {
      note(j, `returning inscription #${id} to ${to}`);
      await sendCall(j, { kind: 'nft', id, to }, { minFee: cfg.transferFeeFloor, reserveAfter: 0n });
      j.returnedInscription = id; save(j);
    }
    // 2. the STX, in up to two passes so a fee bump never leaves the first transfer unpayable.
    //    The first pass sends the processing fee and the change as two transfers at consecutive nonces, broadcast
    //    back to back, so both are mined in the same block. (A native STX transfer has one recipient.)
    let swept = 0n;
    for (let pass = 0; pass < 2; pass++) {
      const bal = await bestBalance(j.address);
      // Getting the money home outranks fee thrift: when there is real money to return, allow a bigger fee ceiling
      // (still at most about 4%), so a long fee spike cannot make a sweep impossible.
      const budget = bal >= 4_000_000n ? cfg.sweepFeeBudget * 4n : cfg.sweepFeeBudget;
      const keep = pass === 0 ? budget : cfg.transferFeeFloor;
      if (bal <= keep + cfg.transferFeeFloor) break;
      const avail = bal - keep;
      if (pass === 0 && feeLeft > 0n) {
        const feeAmt = minB(feeLeft, avail), change = avail - feeAmt;
        if (feeAmt < feeLeft) note(j, `processing fee reduced to ${feeAmt} µSTX: the wallet held less than the full fee after costs`);
        const half = keep / 2n;
        j.agentFeeAmt = feeAmt.toString(); save(j);
        const p1 = await sendCall(j, { kind: 'stx', to: feeTo, amount: feeAmt }, { minFee: cfg.transferFeeFloor, reserveAfter: 0n, feeCeiling: half, deferConfirm: true, track: trackFee });
        const p2 = change > 0n ? await sendCall(j, { kind: 'stx', to, amount: change }, { minFee: cfg.transferFeeFloor, reserveAfter: 0n, feeCeiling: half, deferConfirm: true, skipClear: true, nonceOverride: p1.nonce + 1n }) : null;
        await confirmOrEscalate(j, p1.call, p1);
        j.agentFeePaid = feeAmt.toString(); feeLeft = 0n; note(j, `processing fee ${feeAmt} µSTX paid to ${feeTo}`); save(j);
        if (p2) { await confirmOrEscalate(j, p2.call, p2); swept += change; note(j, `${change} µSTX returned to ${to}`); }
        continue;
      }
      await sendCall(j, { kind: 'stx', to, amount: avail }, { minFee: cfg.transferFeeFloor, reserveAfter: 0n, feeCeiling: keep });
      swept += avail;
    }
    j.sweptUstx = ((j.sweptUstx ? big(j.sweptUstx) : 0n) + swept).toString();
    // 3. only now decide whether the key may go
    const left = await bestBalance(j.address);
    const heldAfter = await io.held(j.address);
    let partial = null;
    try { partial = j.begun && !j.sealedId ? await io.uploadState(j.hash, j.address) : null; } catch { partial = { unknown: true }; }
    j.leftoverUstx = left.toString();
    if (heldAfter.length) { j.status = 'NEEDS_RECOVERY'; j.message = `The wallet still holds inscription(s) #${heldAfter.join(', #')}; recovery will send them to ${to}.`; save(j); return { done: true }; }
    if (partial && j.resumable) { j.status = 'STOPPED'; j.message = `${j.message} The upload session (${j.uploaded}/${j.chunks} chunks) is kept: add funds to ${j.address} and resume within about 6 hours, or leave it.`; keepKey(j, 'a paid-for upload session can still be resumed'); save(j); return { done: true }; }
    if (left > cfg.transferFeeFloor * 2n) { j.status = 'NEEDS_RECOVERY'; j.message = `${left} µSTX could not be returned yet; recovery will sweep it.`; save(j); return { done: true }; }
    j.status = j.outcome === 'twinned' ? 'COMPLETE' : 'STOPPED';
    j.mnemonic = null; j.keyWiped = true;                                            // nothing left to spend: the key goes
    await io.dropBytes(j);
    note(j, `done: ${swept} µSTX returned to ${to}; wallet key discarded`);
    save(j); return { done: true };
  }
  function keepKey(j, why) { j.keepKey = true; j.keepKeyReason = why; }

  // ---- the driver -----------------------------------------------------------------------------
  async function advance(j) {
    // Stall rule: a running job with no progress for stallMs stops and sweeps.
    if (['RUNNING', 'NEEDS_FUNDS'].includes(j.status) && io.now() - j.progressAt > cfg.stallMs) {
      return startStop(j, 'stalled', `No progress for ${Math.round(cfg.stallMs / 60000)} minutes. Stopping safely: ${j.begun ? 'the upload session is kept so it can be resumed, ' : ''}the leftover STX is being returned.`);
    }
    if (j.nextTryAt && io.now() < j.nextTryAt) return { sleep: Math.min(15_000, j.nextTryAt - io.now()) };
    switch (j.status) {
      case 'AWAITING_FUNDS': return stepFunding(j);
      case 'NEEDS_FUNDS': {
        const bal = await bestBalance(j.address); j.balance = bal.toString();
        const q = await quote({ bytes: j.size, chunks: j.chunks });
        if (bal >= await remainingCost(j, q)) { j.status = 'RUNNING'; j.step = 'preflight'; j.shortfall = null; touch(j); note(j, 'funds topped up, resuming'); save(j); return { sleep: 0 }; }
        save(j); return { sleep: 15_000 };
      }
      case 'RUNNING':
        if (j.step === 'preflight') return stepPreflight(j);
        if (j.step === 'begin') return stepBegin(j);
        if (j.step === 'upload') return stepUpload(j);
        if (j.step === 'seal') return stepSeal(j);
        if (j.step === 'bind') return stepBind(j);
        throw new Error(`unknown step ${j.step}`);
      case 'SWEEP_PENDING': {
        if (io.now() < j.sweepAfter) { save(j); return { sleep: Math.min(15_000, j.sweepAfter - io.now()) }; }
        j.status = 'STOPPING'; save(j); return { sleep: 0 };
      }
      case 'STOPPING': return sweep(j);
      default: return { done: true };
    }
  }

  async function run(id) {
    if (running.has(id)) return { already: true };
    running.add(id);
    { const j0 = get(id); if (j0.mnemonic && io.registerWallet) io.registerWallet(j0.mnemonic); }   // after a reload the key must be loaded again
    try {
      for (;;) {
        const j = get(id);
        if (TERMINAL.has(j.status)) return publicJob(j);
        let r;
        try { r = await advance(j); }
        catch (e) { r = await onStepError(get(id), e); }
        if (r && r.done) return publicJob(get(id));
        if (r && r.park) return publicJob(get(id));
        await io.sleep((r && r.sleep) || 0);
      }
    } finally { running.delete(id); }
  }

  async function onStepError(j, e) {
    const kind = (e && e.kind) || 'ERROR';
    j.failStreak = (j.failStreak || 0) + 1; j.retries = (j.retries || 0) + 1; j.error = errMsg(e);
    if (kind === 'UNAFFORDABLE') { return needFunds(j, e.short || 1n, errMsg(e)); }
    if (kind === 'ABORT') {
      // The chain refused it: retrying the same call only burns another miner fee. Twice is the limit.
      j.abortCount = (j.abortCount || 0) + 1;
      if (j.abortCount >= 2) return startStop(j, 'aborted', `The chain refused a step twice (${e.result || errMsg(e)}), so the job stopped rather than keep paying fees. ${j.sealedId ? `Inscription #${j.sealedId} is yours and is being sent to you. ` : ''}The leftover STX is being returned.`);
    }
    if (kind === 'FEE_HIGH') {
      // Fees stayed above what the wallet can pay. Not a failure: wait, and offer the shortfall as a top-up.
      j.feeWaitNote = `fees are above what this wallet can pay: cheapest ${e.cheapest} µSTX, affordable ${e.effCap} µSTX. Waiting; top up ${j.address} to proceed at the current price.`;
      note(j, j.feeWaitNote);
    }
    const wait = Math.min(cfg.retryBackoffCapMs, cfg.retryBackoffMs * j.failStreak);
    j.nextTryAt = io.now() + wait;
    note(j, `${kind}: ${errMsg(e)}. Retrying in ${Math.round(wait / 1000)} s (attempt ${j.failStreak})`);
    save(j);
    if (j.failStreak >= cfg.maxStepFailures && !['STOPPING', 'SWEEP_PENDING'].includes(j.status)) {
      // A step that keeps failing is parked, not hammered. The stall rule will sweep it if nothing changes.
      j.nextTryAt = io.now() + cfg.retryBackoffCapMs; save(j);
    }
    return { sleep: wait };
  }

  // ---- public controls ----------------------------------------------------------------------
  function cancel(id) {
    const j = get(id);
    if (TERMINAL.has(j.status)) return { error: `job is already ${j.status}` };
    if (j.sealedId) return { error: 'the inscription is already sealed; the job will finish and return the change' };
    j.cancelRequested = true; note(j, 'cancel requested');
    if (j.status === 'AWAITING_FUNDS' || j.status === 'NEEDS_FUNDS') startStop(j, 'cancelled', 'Cancelled. Anything sent to the wallet is being returned.');
    return { cancelling: true };
  }
  function resumeStopped(id) {
    const j = get(id);
    if (j.status !== 'STOPPED' || !j.resumable || !j.mnemonic) return { error: 'this job cannot be resumed' };
    j.status = 'NEEDS_FUNDS'; j.shortfall = '1'; j.outcome = null; j.cancelRequested = false; j.step = 'preflight'; touch(j);
    note(j, 'resuming: waiting for funds'); return { resuming: true };
  }
  /** Reopening the page: credit the time the tab was closed so a healthy job is paused, not stalled. */
  function attach(id) { const j = get(id); if (!TERMINAL.has(j.status)) { j.progressAt = io.now(); j.nextTryAt = 0; save(j); } return publicJob(j); }

  return { quote, createJob, run, cancel, resumeStopped, attach, get: (id) => publicJob(get(id)), list: () => store.list().map(publicJob), planFunding: (p) => planFunding(p, cfg) };
}

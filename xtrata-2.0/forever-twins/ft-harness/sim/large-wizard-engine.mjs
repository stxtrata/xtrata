// sim/large-wizard-engine.mjs — drives the large-token engine against a simulated chain.
//
// The engine moves real money, so every safeguard is exercised here: fee spikes, slow mining,
// rejected fees, API outages, a closed tab, another wallet winning the token (before spending, mid-upload,
// after sealing), a helper fee that changes mid-job, deterministic aborts, stalls, cancels, and the
// timing of the sweep. The chain model enforces the same rules the real core and helper do (fees at
// begin and seal, post-condition caps, per-owner upload sessions, first bind wins).
//
//   node sim/large-wizard-engine.mjs
//   FT_LARGE_ENGINE=/path/to/engine.mjs node sim/large-wizard-engine.mjs
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const enginePath = process.env.FT_LARGE_ENGINE || path.resolve(new URL('.', import.meta.url).pathname, '../../../src/forever-twins/large/engine.mjs');
const E = await import(pathToFileURL(enginePath).href);
const { createEngine, planFunding, CONFIG, CHUNK, BATCH, chunkBytes, rollingHashHex } = E;
const AGENT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

let passed = 0, failed = 0;
const ok = (c, m) => { if (c) passed++; else { failed++; console.log('  FAIL:', m); } };
const eq = (a, b, m) => ok(String(a) === String(b), `${m}: got ${a}, want ${b}`);
const sha = (u8) => new Uint8Array(createHash('sha256').update(u8).digest());
const STX = 1_000_000n;

// ------------------------------------------------------------------ the simulated chain
const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7', RAPHA = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const HELPER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-monkeys';

function makeArt(size, seed = 7) {
  const b = new Uint8Array(size); let x = seed;
  for (let i = 0; i < size; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; b[i] = x >> 16; }
  return b;
}

class Chain {
  constructor(o = {}) {
    this.time = 1_700_000_000_000;
    this.bal = new Map(); this.nonces = new Map();
    this.uploads = new Map(); this.nextId = 5000; this.owner = new Map(); this.insc = new Map();
    this.bindings = new Map(); this.helperFee = o.helperFee ?? 1_000_000n; this.finalized = o.finalized ?? true; this.lod = o.lod ?? true;
    this.canon = new Map(); this.txs = new Map(); this.mempool = []; this.events = []; this.log = [];
    this.estMult = o.estMult ?? (() => 1n);            // function(time) -> multiple of the 1 µSTX/byte floor the LOW estimate asks
    this.mineMinMult = o.mineMinMult ?? 1n;            // miners ignore transactions paying under this multiple of the floor
    this.mineDelay = o.mineDelay ?? 20_000;            // a realistic block-and-a-bit per transaction
    this.hooks = {};                                   // named callbacks fired the instant a call lands (to inject races)
    this.apiFail = new Map();                          // method -> remaining failures
    this.apiDown = o.apiDown ?? (() => false);         // function(time) -> true while the API is unreachable
    this.abortFn = o.abortFn ?? (() => null);          // function(call) -> result repr to abort with
    this.feeTooLowOnce = o.feeTooLowOnce ?? false;
    this.coreBroadcasts = []; this.stxMoves = []; this.broadcasts = [];
    this.paused = false; this.received = new Map();
  }
  credit(a, n) { this.bal.set(a, (this.bal.get(a) || 0n) + n); }
  balanceOf(a) { return this.bal.get(a) || 0n; }
  transfer(from, to, n) { if (this.balanceOf(from) < n) throw new Error('insufficient'); this.bal.set(from, this.balanceOf(from) - n); this.credit(to, n); this.stxMoves.push({ t: this.time, from, to, n }); this.received.set(to, (this.received.get(to) || 0n) + n); this.lastFunder = this.lastFunder || new Map(); if (!this.lastFunder.has(to)) this.lastFunder.set(to, from); }
  quoteCore(size, chunks) {
    const first = BigInt(Math.min(chunks, BATCH)) * 2000n, extra = BigInt(Math.max(0, Math.ceil((chunks - BATCH) / BATCH))) * 100_000n;
    const begin = 100_000n, seal = 100_000n + first + extra;
    return { begin, seal, total: begin + seal, batches: BigInt(Math.ceil(chunks / BATCH)) };
  }
  at(ms, fn) { this.events.push({ t: this.time + ms, fn }); this.events.sort((a, b) => a.t - b.t); }
  advanceTo(t) {
    while (true) {
      const ev = this.events.length && this.events[0].t <= t ? this.events[0] : null;
      const nm = this.nextMine();
      const mt = nm ? nm.minedAt : Infinity;
      if (ev && ev.t <= mt) { this.events.shift(); this.time = Math.max(this.time, ev.t); ev.fn(this); continue; }
      if (nm && mt <= t) { this.time = Math.max(this.time, mt); this.mine(nm); continue; }
      break;
    }
    this.time = Math.max(this.time, t);
  }
  sleep(ms) { this.advanceTo(this.time + ms); }
  nextMine() {
    // lowest nonce of each sender, if its fee clears the miners' bar
    let best = null;
    for (const tx of this.mempool) {
      const lowest = this.mempool.filter((x) => x.from === tx.from).reduce((a, b) => (b.nonce < a.nonce ? b : a));
      if (lowest !== tx) continue;
      if (tx.fee < BigInt(tx.bytes) * this.mineMinMult) continue;
      const m = tx.minedAt = tx.minedAt ?? (tx.sentAt + this.mineDelay);
      if (!best || m < best.minedAt) best = tx;
    }
    return best;
  }
  mine(tx) {
    this.mempool = this.mempool.filter((x) => x !== tx);
    const rec = this.txs.get(tx.id);
    const fail = (result) => { rec.state = 'abort'; rec.result = result; };
    const feeOk = this.balanceOf(tx.from) >= tx.fee;
    if (!feeOk) { rec.state = 'dropped'; return; }
    this.bal.set(tx.from, this.balanceOf(tx.from) - tx.fee);
    this.nonces.set(tx.from, tx.nonce + 1n);
    const c = tx.call;
    const forced = this.abortFn(c, this);
    if (forced) return fail(forced);
    // Post-condition emulation: STX leaving the sender may not exceed spendCap (null = nothing may move).
    const spend = (n) => { const used = (tx._spent || 0n) + n; if (tx.spendCap == null || used > tx.spendCap) { throw new Error('postcondition'); } tx._spent = used; };
    try {
      if (c.kind === 'stx') { if (c.to === tx.from) return fail('(TransferRecipientCannotEqualSender)'); this.transfer(tx.from, c.to, c.amount); rec.state = 'success'; rec.result = '(ok true)'; return; }
      if (c.kind === 'nft') { if (this.owner.get(String(c.id)) !== tx.from) return fail('(err u4)'); this.owner.set(String(c.id), c.to); rec.state = 'success'; rec.result = '(ok true)'; return; }
      if (c.kind === 'core') return this.core(tx, c, rec, spend, fail);
      if (c.kind === 'helper') return this.helper(tx, c, rec, spend, fail);
    } catch (e) { if (e.message === 'postcondition') return fail('(postcondition failed)'); throw e; }
  }
  core(tx, c, rec, spend, fail) {
    const key = (o, h) => `${o}:${h}`;
    if (this.paused) return fail('(err u100)');
    if (c.fn === 'begin-inscription') {
      const hash = c.args[0].hex, mime = c.args[1].v, size = Number(c.args[2].v), chunks = Number(c.args[3].v);
      const k = key(tx.from, hash);
      if (this.uploads.has(k)) { rec.state = 'success'; rec.result = '(ok true)'; return; }            // resume path
      const q = this.quoteCore(size, chunks); spend(q.begin); this.bal.set(tx.from, this.balanceOf(tx.from) - q.begin); this.credit('CORE', q.begin);
      this.uploads.set(k, { index: 0, total: chunks, size, mime, lastTouched: this.time, parts: [] });
      rec.state = 'success'; rec.result = '(ok true)'; this.coreBroadcasts.push('begin'); return;
    }
    if (c.fn === 'add-chunk-batch') {
      const k = key(tx.from, c.args[0].hex), u = this.uploads.get(k);
      if (!u) return fail('(err u3)');
      const chunks = c.args[1].bytes;
      if (!chunks.length || chunks.length > BATCH) return fail('(err u9)');
      u.parts.push(...chunks); u.index += chunks.length; u.lastTouched = this.time;
      rec.state = 'success'; rec.result = '(ok true)'; this.coreBroadcasts.push('batch'); return;
    }
    if (c.fn === 'seal-inscription') {
      const hash = c.args[0].hex, k = key(tx.from, hash), u = this.uploads.get(k);
      if (!u || u.index !== u.total) return fail('(err u8)');
      const q = this.quoteCore(u.size, u.total); spend(q.seal); this.bal.set(tx.from, this.balanceOf(tx.from) - q.seal); this.credit('CORE', q.seal);
      const id = String(this.nextId++); this.owner.set(id, tx.from); this.insc.set(id, { hash, size: u.size, mime: u.mime, uri: c.args[1].v });
      this.uploads.delete(k); rec.state = 'success'; rec.result = `(ok u${id})`; this.coreBroadcasts.push('seal'); if (this.hooks.afterSeal) { const h = this.hooks.afterSeal; this.hooks.afterSeal = null; h(this); } return;
    }
    fail('(err u1)');
  }
  helper(tx, c, rec, spend, fail) {
    if (c.fn !== 'inscribe-large') return fail('(err u1)');
    const token = String(c.args[0].v), xid = String(c.args[1].v);
    if (!this.finalized) return fail('(err u208)');
    const canon = this.canon.get(token); if (!canon) return fail('(err u206)');
    if (this.bindings.has(token)) return fail('(err u201)');
    const m = this.insc.get(xid);
    if (!m || m.hash !== canon.hash || m.size !== canon.totalSize || m.mime !== canon.mime || m.uri !== canon.tokenUri) return fail('(err u220)');
    if (this.owner.get(xid) !== tx.from) return fail('(err u210)');
    const fee = this.helperFee;
    spend(fee); const half = fee / 2n;
    this.bal.set(tx.from, this.balanceOf(tx.from) - fee); this.credit(JIM, half); this.credit(RAPHA, fee - half);
    if (!(tx.nftOk)) return fail('(postcondition failed)');
    this.owner.set(xid, HELPER); this.bindings.set(token, { xtrataId: xid, escrowed: true, inscriber: tx.from });
    rec.state = 'success'; rec.result = `(ok u${xid})`; this.helperPaid = (this.helperPaid || 0n) + fee; this.helperPaidAt = this.time;
  }
  // an unrelated wallet does the whole thing first, with its own bytes
  otherWalletTwins(token, other = 'SPOTHERWALLET') {
    const canon = this.canon.get(String(token));
    const id = String(this.nextId++);
    this.insc.set(id, { hash: canon.hash, size: canon.totalSize, mime: canon.mime, uri: canon.tokenUri });
    this.owner.set(id, HELPER); this.bindings.set(String(token), { xtrataId: id, escrowed: true, inscriber: other });
    return id;
  }
}

function makeIo(chain, { bytesStore, sleepKill } = {}) {
  const fail = (name) => { const n = chain.apiFail.get(name) || 0; if (n > 0) { chain.apiFail.set(name, n - 1); throw Object.assign(new Error(`${name} failed (HTTP 503)`), { kind: 'API' }); } if (chain.apiDown(chain.time)) throw Object.assign(new Error(`${name} unreachable`), { kind: 'API' }); };
  const walletCount = { n: 0 };
  const sizeOf = (call) => (call.kind === 'core' && call.fn === 'add-chunk-batch' ? call.args[1].bytes.reduce((a, c) => a + c.length, 0) : 0) + 400;
  return {
    now: () => chain.time,
    sleep: async (ms) => { await new Promise((r) => setImmediate(r)); if (sleepKill && sleepKill.dead) throw new Error('TAB CLOSED'); chain.sleep(ms); if (sleepKill && sleepKill.dead) throw new Error('TAB CLOSED'); if (sleepKill && sleepKill.at && chain.time >= sleepKill.at) { sleepKill.dead = true; throw new Error('TAB CLOSED'); } },
    sha256: sha,
    newWallet: () => { walletCount.n++; return { mnemonic: `mnemonic-${chain.time}-${walletCount.n}`, address: `SPWIZARD${chain.time}${walletCount.n}` }; },
    balance: async (a) => { fail('balance'); return chain.balanceOf(a); },
    coreQuote: async (bytes, chunks) => { fail('coreQuote'); return chain.quoteCore(bytes, chunks); },
    helperFee: async () => { fail('helperFee'); return chain.helperFee; },
    congestionX10: async () => chain.estMult(chain.time) * 10n,
    helperReady: async () => { fail('helperReady'); return { finalized: chain.finalized, lod: chain.lod }; },
    canonical: async (t) => { fail('canonical'); return chain.canon.get(String(t)) || null; },
    binding: async (t) => { fail('binding'); return chain.bindings.get(String(t)) || null; },
    uploadState: async (hash, owner) => { fail('uploadState'); const u = chain.uploads.get(`${owner}:${hash}`); return u ? { index: u.index } : null; },
    held: async (a) => { fail('held'); return [...chain.owner].filter(([, o]) => o === a).map(([id]) => id); },
    inscriptionOwner: async (id) => { fail('owner'); return chain.owner.get(String(id)) || null; },
    pendingTxs: async (a) => { fail('pending'); return chain.mempool.filter((x) => x.from === a).sort((x, y) => (x.nonce < y.nonce ? -1 : 1)).map((x) => ({ nonce: x.nonce, fee: x.fee, kind: x.call.fn || x.call.kind })); },
    totalReceived: async (a) => { fail('received'); return chain.received.get(a) || 0n; },
    funderOf: async (a) => { fail('funderOf'); return (chain.lastFunder && chain.lastFunder.get(a)) || null; },
    estimateLowFee: async (call) => { fail('estimate'); const f = BigInt(sizeOf(call)); if (chain.feeTooLowOnce) { chain.feeTooLowOnce = false; return 1n; } return f * chain.estMult(chain.time); },
    nextNonce: async (a) => { fail('nonce'); return chain.nonces.get(a) || 0n; },
    broadcast: async (call, { from, fee, nonce, spendCap }) => {
      fail('broadcast');
      const bytes = sizeOf(call);
      if (fee < BigInt(bytes)) throw Object.assign(new Error('FeeTooLow'), { kind: 'FEE_TOO_LOW' });
      const existing = chain.mempool.find((x) => x.from === from && x.nonce === nonce);
      if (nonce < (chain.nonces.get(from) || 0n)) throw Object.assign(new Error('BadNonce'), { kind: 'REJECTED' });
      const id = `0x${(chain.txs.size + 1).toString(16).padStart(6, '0')}`;
      if (existing) { if (fee <= existing.fee) throw Object.assign(new Error('ReplaceAcrossFee'), { kind: 'REJECTED' }); chain.mempool = chain.mempool.filter((x) => x !== existing); chain.txs.get(existing.id).state = 'dropped'; }
      const tx = { id, from, nonce, fee, call, spendCap, bytes, sentAt: chain.time, nftOk: !!call.nft && String(call.nft.id) === String(call.args?.[1]?.v) };
      chain.mempool.push(tx); chain.txs.set(id, { state: 'pending' });
      chain.broadcasts.push({ fn: call.fn || call.kind, fee, nonce, t: chain.time, from, to: call.to, amount: call.amount });
      if (call.kind === 'stx' && call.to === AGENT && chain.hooks.afterFeeBroadcast) { const h = chain.hooks.afterFeeBroadcast; chain.hooks.afterFeeBroadcast = null; h(chain); }
      return { txid: id, nonce };
    },
    txStatus: async (id) => { fail('txStatus'); const r = chain.txs.get(id); return r ? { state: r.state, result: r.result } : { state: 'unknown' }; },
    loadBytes: async (j) => (bytesStore.get(j.id) || null), saveBytes: async (j, b) => { bytesStore.set(j.id, b); }, dropBytes: async (j) => { bytesStore.delete(j.id); }
  };
}

// ------------------------------------------------------------------ scenario harness
function setup({ size = 1_411_407, token = '1', chainOpts = {}, cfg = {} } = {}) {
  const chain = new Chain(chainOpts);
  const art = makeArt(size);
  const chunks = chunkBytes(art);
  const hash = rollingHashHex(chunks, sha);
  chain.canon.set(String(token), { hash, totalSize: size, mime: 'image/png', tokenUri: `https://xtrata.xyz/ft/bitcoin-monkeys/${token}.json` });
  const store = new Map(); const bytesStore = new Map();
  const jobStore = { get: (id) => (store.has(id) ? JSON.parse(JSON.stringify(store.get(id))) : null), set: (id, j) => store.set(id, JSON.parse(JSON.stringify(j))), list: () => [...store.values()].map((j) => JSON.parse(JSON.stringify(j))) };
  const sleepKill = { dead: false, at: 0 };
  globalThis.__LAST = { chain, store };
  const mk = () => createEngine({ io: makeIo(chain, { bytesStore, sleepKill }), store: jobStore, cfg: { ...CONFIG, ...cfg }, agentFeeAddress: AGENT });
  return { chain, art, chunks, hash, store, bytesStore, jobStore, sleepKill, engine: mk(), mk, size, token: String(token) };
}
const fund = (S, job, funder = 'SPVISITOR', extra = 0n) => { S.chain.credit(funder, 100n * STX); S.chain.transfer(funder, job.address, BigInt(job.required) + extra); return funder; };
async function start(S, o = {}) { return S.engine.createJob({ token: S.token, bytes: S.art, helper: HELPER, core: 'xtrata-v3-2-3', expectedFunder: o.expectedFunder || null }); }

// ------------------------------------------------------------------ tests
async function T(name, fn) {
  if (process.env.ONLY && !name.startsWith(process.env.ONLY)) return;
  process.stdout.write(`${name}\n`);
  let timer; const dog = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('TEST TIMED OUT after 40 s of real time (the engine did not finish)')), 40_000); });
  try { await Promise.race([fn(), dog]); } catch (e) { failed++; console.log('  EXCEPTION:', e.stack || e); const L = globalThis.__LAST; if (L && /TIMED OUT/.test(String(e))) { const j = [...L.store.values()][0]; if (j) { console.log('   job:', j.status, j.step, 'uploaded', j.uploaded, 'err', j.error); for (const l of (j.log || []).slice(-6)) console.log('   log:', Math.round((l.t - 1_700_000_000_000) / 1000) + 's', l.m.slice(0, 120)); console.log('   broadcasts:', JSON.stringify(L.chain.broadcasts.slice(0, 8).map((b) => [b.fn, String(b.fee), String(b.nonce), Math.round((b.t - 1_700_000_000_000) / 1000)]))); console.log('   mempool:', JSON.stringify(L.chain.mempool.map((m) => [m.call.fn || m.call.kind, String(m.fee), String(m.nonce), m.bytes]))); } } } finally { clearTimeout(timer); }
}

await T('P-1 planFunding: covers worst case, rounds up, scales with size and congestion', async () => {
  const core = { begin: 100_000n, seal: 464_000n, total: 564_000n };
  const small = planFunding({ bytes: 600_000, chunks: 37, core, helperFee: STX });
  const big = planFunding({ bytes: 1_585_346, chunks: 97, core, helperFee: STX });
  ok(big.required > small.required, 'a bigger file needs more');
  eq(big.required % 10_000n, 0n, 'rounded up to 0.01 STX');
  ok(big.required > big.expected, 'request exceeds the expected cost');
  ok(big.required >= big.protocolFee + big.helperFee + BigInt(1_585_346) * 2n, 'covers 2x the byte floor plus fees');
  const busy = planFunding({ bytes: 1_585_346, chunks: 97, core, helperFee: STX, congestionX10: 40n });
  ok(busy.required > big.required, 'a congested network asks for more');
  ok(big.required < 10n * STX, 'a 1.5 MB file stays under 10 STX');
  eq(big.agentFee, big.required * 10n / 100n, 'processing fee is 10% of the request');
  const nofee = planFunding({ bytes: 1_585_346, chunks: 97, core, helperFee: STX }, { ...CONFIG, agentFeePct: 0n });
  ok(big.required - big.agentFee >= nofee.required, 'after the 10% comes out, the real costs are still covered');
  console.log(`   1.59 MB file: request ${Number(big.required) / 1e6} STX, expected cost ${Number(big.expected) / 1e6} STX`);
});

await T('C-1 createJob refuses (before any money) bad inputs', async () => {
  let S = setup(); let threw = '';
  const tryJob = async (S2, bytes = S2.art) => { try { await S2.engine.createJob({ token: S2.token, bytes, helper: HELPER, core: 'x' }); return ''; } catch (e) { return e.message; } };
  const wrong = S.art.slice(); wrong[100] ^= 1;
  threw = await tryJob(S, wrong); ok(/hash differs/.test(threw), 'wrong bytes refused: ' + threw);
  threw = await tryJob(S, S.art.slice(0, 1000)); ok(/expects/.test(threw), 'wrong size refused');
  S = setup({ chainOpts: { finalized: false } }); threw = await tryJob(S); ok(/not finalised/.test(threw), 'not finalised refused');
  S = setup({ chainOpts: { lod: false } }); threw = await tryJob(S); ok(/large-file route/.test(threw), 'helper without the route refused');
  S = setup(); S.chain.otherWalletTwins('1'); threw = await tryJob(S); ok(/already has a twin/.test(threw), 'already twinned refused');
  S = setup({ size: 400_000 }); threw = await tryJob(S); ok(/512 KB or smaller/.test(threw), 'small token refused');
  S = setup(); S.chain.canon.delete('1'); threw = await tryJob(S); ok(/not in the finalised record/.test(threw), 'unknown token refused');
});

await T('H-1 happy path: fund, upload, seal, bind, grace, sweep', async () => {
  const S = setup(); const job = await start(S); const funder = fund(S, job);
  const before = 100n * STX;                       // the funder's balance before paying anything
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'job status');
  const b = S.chain.bindings.get('1'); ok(b && S.chain.owner.get(b.xtrataId) === HELPER, 'token bound and the twin is in helper custody');
  eq(b.inscriber, job.address, 'inscriber is the wizard wallet');
  eq(S.chain.helperPaid, S.chain.helperFee, 'helper fee charged once');
  eq(S.chain.balanceOf(JIM), 500_000n, 'payee A got half'); eq(S.chain.balanceOf(RAPHA), 500_000n, 'payee B got half');
  const spent = before - S.chain.balanceOf(funder);
  ok(spent <= BigInt(job.required), `spent ${spent} within the request ${job.required}`);
  ok(spent >= BigInt(job.expected) * 85n / 100n, 'spend is in line with the expected cost');
  ok(S.chain.balanceOf(job.address) <= 60_000n, 'wizard wallet emptied (dust only: ' + S.chain.balanceOf(job.address) + ' µSTX)');
  eq(S.jobStore.get(job.id).mnemonic, null, 'key wiped after completion');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'batch').length, Math.ceil(S.chunks.length / BATCH), 'one add-chunk-batch per 32 chunks, none repeated');
  // the sweep starts the moment the bind is confirmed, with no waiting period
  const bindEvent = S.chain.broadcasts.find((x) => x.fn === 'inscribe-large');
  const helperMove = { t: S.chain.helperPaidAt };
  const sweepMoves = S.chain.stxMoves.filter((m) => m.from === job.address && m.to === funder);
  ok(sweepMoves.length >= 1, 'change returned to the paying address');
  ok(sweepMoves.every((m) => m.t >= helperMove.t), 'no STX left the wallet before the bind was mined');
  ok(sweepMoves[0].t - helperMove.t <= 2 * 20_000, `change went out within two blocks of the bind (${(sweepMoves[0].t - helperMove.t) / 1000} s)`);
  ok(S.chain.stxMoves.filter((m) => m.from === job.address).every((m) => m.to === funder || m.to === 'CORE' || m.to === JIM || m.to === RAPHA || m.to === AGENT), 'STX only went to the core, the payees, the agent fee address or the funder');
  eq(S.chain.balanceOf(AGENT), S.chain.received.get(job.address) * 10n / 100n, 'the 10% processing fee is 10% of everything the wallet received');
  const feeMove = S.chain.stxMoves.find((m) => m.to === AGENT); ok(feeMove && feeMove.t === sweepMoves[0].t, 'the fee and the change were mined in the same block');
  const feeTx = S.chain.broadcasts.find((x) => x.to === AGENT), chTx = S.chain.broadcasts.find((x) => x.to === funder && x.t >= bindEvent.t);
  ok(feeTx && chTx && chTx.nonce === feeTx.nonce + 1n && chTx.t === feeTx.t, 'broadcast back to back at consecutive nonces');
  console.log(`   request ${Number(job.required) / 1e6} STX, spent ${Number(spent) / 1e6} STX, ${S.chain.broadcasts.length} transactions`);
});

await T('H-2 an exact-minimum deposit is enough; one µSTX less is not started', async () => {
  const S = setup(); const job = await start(S);
  S.chain.credit('SPV', 100n * STX); S.chain.transfer('SPV', job.address, BigInt(job.required) - 1n);
  const p = S.engine.run(job.id); await Promise.race([p, new Promise((r) => setTimeout(r, 50))]);
  // the driver keeps sleeping virtual time; give it a few turns then check it never began
  for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r));
  eq(S.chain.coreBroadcasts.length, 0, 'nothing was sent while underfunded');
  S.chain.transfer('SPV', job.address, 1n);
  const final = await p; eq(final.status, 'COMPLETE', 'completes once fully funded');
});

await T('F-1 fee spike: waits it out instead of overpaying, then completes', async () => {
  const S = setup({ chainOpts: { estMult: (t) => (t < 1_700_000_000_000 + 4 * 60_000 ? 12n : 1n) } });
  const job = await start(S); fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes after the spike');
  const cap = CONFIG.mintCap;
  ok(S.chain.broadcasts.every((b) => b.fee <= cap), 'no transaction paid more than the 2 STX cap');
  ok(S.chain.broadcasts.filter((b) => b.t < 1_700_000_000_000 + 3 * 60_000).length <= 1, 'it did not rush a transaction through during the spike');
  ok(final.log.some((l) => /fees are high/.test(l.m)), 'the visitor was told fees are high');
});

await T('F-2 a spike that never ends stops after the stall window, returns the STX and keeps the resumable upload', async () => {
  const start0 = 1_700_000_000_000;
  const S = setup({ chainOpts: { estMult: (t) => (t > start0 + 70_000 && t < start0 + 3 * 3600_000 ? 400n : 1n) } });   // fine for begin, then a 3 hour spike
  const job = await start(S); const funder = fund(S, job);
  const before = S.chain.balanceOf(funder) + BigInt(job.required);
  const final = await S.engine.run(job.id);
  ok(['STOPPED', 'NEEDS_RECOVERY'].includes(final.status), 'job stopped: ' + final.status);
  eq(final.outcome, 'stalled', 'stalled');
  const back = S.chain.balanceOf(funder) - (before - BigInt(job.required));
  ok(back > BigInt(job.required) / 2n, `most of the STX came back (${back})`);
  ok(S.chain.stxMoves.filter((m) => m.from === job.address && m.to === funder).every((m) => m.t >= 1_700_000_000_000 + 2 * 3600_000), 'nothing was swept before the 2 hour stall window ended');
  ok(S.jobStore.get(job.id).mnemonic || final.status === 'STOPPED', 'key kept or job stopped cleanly');
  ok(!S.chain.bindings.has('1'), 'token not bound');
});

await T('F-3 a transaction ignored by miners is replaced at the same nonce with double the fee', async () => {
  const S = setup({ size: 600_000, chainOpts: { mineMinMult: 2n } });                        // miners want 2x the floor; the first fee is 1x
  const job = await start(S); fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  const byNonce = new Map(); for (const b of S.chain.broadcasts) { const k = b.from + ':' + b.nonce; byNonce.set(k, (byNonce.get(k) || 0) + 1); }
  ok([...byNonce.values()].some((n) => n >= 2), 'at least one nonce was replaced');
  ok(final.log.some((l) => /replaced nonce/.test(l.m)), 'replacement logged');
});

await T('F-5 the market demands more than the wallet can ever pay: the stuck transaction is replaced, the job stops at the stall window and everything returns', async () => {
  const S = setup({ size: 600_000, chainOpts: { mineMinMult: 12n } });                     // miners want 12x the floor for everything
  const job = await start(S); const funder = fund(S, job);
  const final = await S.engine.run(job.id);
  ok(['STOPPED', 'NEEDS_RECOVERY'].includes(final.status), 'stopped, not hung: ' + final.status);
  ok(S.chain.mempool.filter((m) => m.from === job.address).length === 0, 'no transaction left stuck in the mempool');
  ok(final.log.some((l) => /clearing stuck transaction/.test(l.m)), 'the stuck transaction was cleared by replacement');
  ok(S.chain.balanceOf(funder) > 100n * STX - BigInt(job.required) / 2n, 'most of the STX came back: ' + (S.chain.balanceOf(funder) - (100n * STX - BigInt(job.required))));
});

await T('F-4 FeeTooLow is bumped, not retried at the same fee', async () => {
  const S = setup({ size: 600_000, chainOpts: { feeTooLowOnce: true } });
  const job = await start(S); fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  ok(final.log.some((l) => /FeeTooLow/.test(l.m)), 'bump logged');
});

await T('N-1 API outages and failed reads: it retries, never mistakes a failed read for an empty wallet', async () => {
  const S = setup({ size: 600_000 });
  const job = await start(S); fund(S, job);
  for (const m of ['balance', 'uploadState', 'txStatus', 'binding', 'nonce', 'pending', 'held']) S.chain.apiFail.set(m, 4);
  const t0 = S.chain.time;
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes through the outages');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'seal').length, 1, 'sealed exactly once');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'begin').length, 1, 'began exactly once');
});

await T('N-2 a long API blackout in the middle: no money moves while blind, it resumes after', async () => {
  const t0 = 1_700_000_000_000;
  const S = setup({ size: 600_000, chainOpts: { apiDown: (t) => t > t0 + 2 * 60_000 && t < t0 + 25 * 60_000 } });
  const job = await start(S); fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes after the blackout');
  ok(S.chain.broadcasts.every((b) => !(b.t > t0 + 2 * 60_000 && b.t < t0 + 25 * 60_000)), 'nothing was broadcast during the blackout');
});

await T('R-1 tab closed mid-upload, reopened: resumes from the chain, no chunk paid twice', async () => {
  const S = setup();
  const job = await start(S); fund(S, job);
  S.sleepKill.at = S.chain.time + 75_000;
  let died = false; try { await S.engine.run(job.id); } catch (e) { died = /TAB CLOSED/.test(e.message); }
  ok(died, 'the first run was cut off');
  const mid = S.jobStore.get(job.id); ok(mid.begun && mid.uploaded > 0 && mid.uploaded < S.chunks.length, `stopped mid-upload (${mid.uploaded}/${S.chunks.length})`);
  S.chain.sleep(5 * 60_000);                                                                        // the tab stays closed for a while
  S.sleepKill.dead = false; S.sleepKill.at = 0;
  const e2 = S.mk(); e2.attach(job.id);
  const final = await e2.run(job.id);
  eq(final.status, 'COMPLETE', 'completes after reopening');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'begin').length, 1, 'session started once');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'batch').length, Math.ceil(S.chunks.length / BATCH), 'each batch sent once');
});

await T('R-2 tab closed after sealing, before the bind: reopened job binds the sealed inscription', async () => {
  const S = setup({ size: 600_000 });
  const job = await start(S); fund(S, job);
  const io = S.chain;
  io.hooks.afterSeal = () => { S.sleepKill.dead = true; };                     // the tab dies the instant the seal lands
  let died = false; try { await S.engine.run(job.id); } catch (e) { died = /TAB CLOSED/.test(e.message); }
  ok(died, 'the run was cut off right after the seal');
  ok(io.coreBroadcasts.includes('seal') && !S.jobStore.get(job.id).sealedId, 'sealed on-chain but the job had not recorded it yet');
  ok(io.bindings.size === 0, 'not bound yet');
  S.sleepKill.dead = false;
  const e2 = S.mk(); e2.attach(job.id);
  const final = await e2.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'seal').length, 1, 'never sealed twice');
  eq(S.chain.bindings.size, 1, 'bound once');
});

await T('X-1 another wallet twins the token before we spend: stop at once, return everything', async () => {
  const S = setup(); const job = await start(S); const funder = fund(S, job);
  S.chain.at(5_000, (c) => c.otherWalletTwins('1'));
  const before = S.chain.balanceOf(funder);
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'lost-race', 'outcome');
  ok(['STOPPED'].includes(final.status), 'stopped: ' + final.status);
  ok(S.chain.balanceOf(funder) > before - 100_000n, `almost everything returned (lost ${before - S.chain.balanceOf(funder)})`);
  eq(S.chain.coreBroadcasts.filter((x) => x === 'batch').length, 0, 'no upload money spent');
  eq(S.jobStore.get(job.id).mnemonic, null, 'key wiped (nothing left to recover)');
  eq(S.chain.balanceOf(AGENT), 0n, 'no processing fee on a lost job');
});

await T('X-2 another wallet twins it mid-upload: the upload stops, the rest comes back', async () => {
  const S = setup();
  const job = await start(S); const funder = fund(S, job);
  S.chain.at(60_000, (c) => c.otherWalletTwins('1'));
  const before = S.chain.balanceOf(funder);
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'lost-race', 'outcome');
  const lost = before - S.chain.balanceOf(funder);
  ok(lost < BigInt(job.required) * 6n / 10n, `lost only part of the request (${lost} of ${job.required})`);
  eq(S.chain.coreBroadcasts.filter((x) => x === 'seal').length, 0, 'never sealed');
  ok(final.uploaded < S.chunks.length, 'stopped before finishing the upload');
});

await T('X-3 another wallet wins between seal and bind: the visitor gets the valid inscription and the change', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job);
  S.chain.hooks.afterSeal = (c) => c.otherWalletTwins('1');
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'lost-race', 'outcome');
  const mine = [...S.chain.owner].filter(([id, o]) => o === funder).map(([id]) => id);
  eq(mine.length, 1, 'the visitor now holds exactly one inscription (their sealed copy)');
  ok(S.chain.insc.get(mine[0]).hash === S.hash, 'and it is the right art');
  eq(S.chain.helperPaid || 0n, 0n, 'no helper fee was charged'); eq(S.chain.balanceOf(AGENT), 0n, 'no processing fee when the token was lost');
  ok(S.chain.balanceOf(job.address) <= 60_000n, 'wallet emptied');
});

await T('X-4 someone already sealed the same bytes: we still upload our own and bind our own', async () => {
  const S = setup({ size: 600_000 });
  // a stranger sealed the identical art earlier and still holds it
  const sid = String(S.chain.nextId++); S.chain.insc.set(sid, { hash: S.hash, size: S.size, mime: 'image/png', uri: S.chain.canon.get('1').tokenUri }); S.chain.owner.set(sid, 'SPSTRANGER');
  const job = await start(S); fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  const b = S.chain.bindings.get('1'); ok(b && b.xtrataId !== sid, 'bound OUR inscription, not the stranger’s');
  eq(S.chain.owner.get(sid), 'SPSTRANGER', 'the stranger’s inscription was left alone');
});

await T('M-1 the helper fee rises mid-job: pauses for a top-up instead of failing, then finishes', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job);
  S.chain.at(30_000, (c) => { c.helperFee = 4n * STX; });
  let toppedUp = false;
  S.chain.at(30 * 60_000, (c) => { c.credit(funder, 20n * STX); c.transfer(funder, job.address, 5n * STX); toppedUp = true; });
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes after the top-up');
  ok(toppedUp, 'the top-up happened');
  eq(S.chain.helperPaid, 4n * STX, 'charged the new fee');
  ok(final.log.some((l) => /paused|Send at least/.test(l.m)), 'the visitor was asked for the shortfall');
});

await T('M-2 underfunded for the seal: it refuses to seal rather than strand an unbound inscription', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job);
  S.chain.at(30_000, (c) => { c.helperFee = 40n * STX; });
  const final = await S.engine.run(job.id);
  eq(S.chain.coreBroadcasts.filter((x) => x === 'seal').length, 0, 'never sealed while the bind was unaffordable');
  ok(['STOPPED', 'NEEDS_RECOVERY'].includes(final.status), 'stopped: ' + final.status);
});

await T('A-1 the chain refuses a step twice: stop, do not keep paying fees', async () => {
  const S = setup({ size: 600_000, chainOpts: { abortFn: (c) => (c.fn === 'add-chunk-batch' ? '(err u9)' : null) } });
  const job = await start(S); const funder = fund(S, job);
  const before = S.chain.balanceOf(funder);
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'aborted', 'outcome');
  eq(S.chain.broadcasts.filter((b) => b.fn === 'add-chunk-batch').length, 2, 'exactly two attempts');
  ok(S.chain.balanceOf(funder) > before - BigInt(job.required) / 2n, 'most of the money came back'); eq(S.chain.balanceOf(AGENT), 0n, 'no processing fee on an aborted job');
});

await T('A-2 the bind is refused by the helper twice: the visitor keeps the valid inscription', async () => {
  const S = setup({ size: 600_000, chainOpts: { abortFn: (c) => (c.fn === 'inscribe-large' ? '(err u208)' : null) } });
  const job = await start(S); const funder = fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'bind-failed', 'outcome');
  const mine = [...S.chain.owner].filter(([id, o]) => o === funder);
  eq(mine.length, 1, 'inscription sent to the visitor');
});

await T('S-1 a configured grace period is still honoured (default is none), and the sweep goes only to the payer', async () => {
  const S = setup({ size: 600_000, cfg: { graceMs: 30 * 60_000 } }); const job = await start(S); const funder = fund(S, job);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  const bind = S.chain.broadcasts.find((b) => b.fn === 'inscribe-large');
  const moves = S.chain.stxMoves.filter((m) => m.from === job.address && m.to === funder);
  ok(moves.length >= 1 && moves.every((m) => m.t - bind.t >= 30 * 60_000), 'sweep happened after the 30 minute grace');
});

await T('S-2 a different payer address is where the change goes (first sender, not the connected wallet)', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S);
  S.chain.credit('SPPAYER', 50n * STX); S.chain.transfer('SPPAYER', job.address, BigInt(job.required));
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  ok(S.chain.stxMoves.some((m) => m.from === job.address && m.to === 'SPPAYER'), 'change went to the payer');
});

await T('S-3 locked funder: a deposit from a different address is returned untouched', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S, { expectedFunder: 'SPEXPECTED' });
  S.chain.credit('SPSTRANGER2', 50n * STX); S.chain.transfer('SPSTRANGER2', job.address, BigInt(job.required));
  const final = await S.engine.run(job.id);
  eq(final.outcome, 'locked-funder', 'outcome'); eq(S.chain.coreBroadcasts.length, 0, 'nothing was spent');
  ok(S.chain.balanceOf('SPSTRANGER2') > 49n * STX, 'money returned');
});

await T('K-1 cancel before funding keeps the key and does not touch the chain; cancel mid-upload returns the rest', async () => {
  let S = setup(); let job = await start(S);
  S.engine.cancel(job.id);
  let final = await S.engine.run(job.id);
  eq(final.status, 'STOPPED', 'stopped'); ok(S.jobStore.get(job.id).mnemonic, 'key kept so a late payment is not stranded');
  S = setup(); job = await start(S); const funder = fund(S, job);
  S.chain.at(60_000, () => S.engine.cancel(job.id));
  final = await S.engine.run(job.id);
  eq(final.outcome, 'cancelled', 'cancelled'); eq(S.chain.coreBroadcasts.filter((x) => x === 'seal').length, 0, 'never sealed');
});

await T('K-2 cancel after sealing is refused (it finishes instead)', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); fund(S, job);
  let res = null; S.chain.hooks.afterSeal = () => { res = null; S.chain.at(5_000, () => { res = S.engine.cancel(job.id); }); };
  const final = await S.engine.run(job.id);
  ok(!res || res.error, 'cancel refused once sealed');
  eq(final.status, 'COMPLETE', 'still completed');
});

await T('B-1 tampered or missing stored art: verified before any money is spent', async () => {
  let S = setup(); let job = await start(S); const funder = fund(S, job);
  const bad = S.art.slice(); bad[5000] ^= 0xff; S.bytesStore.set(job.id, bad);
  let final = await S.engine.run(job.id);
  eq(final.outcome, 'bytes-lost', 'tampered bytes refused'); eq(S.chain.coreBroadcasts.length, 0, 'nothing was spent');
  ok(S.chain.balanceOf(funder) > 99n * STX, 'funds returned');
  S = setup(); job = await start(S); S.bytesStore.delete(job.id); fund(S, job);
  final = await S.engine.run(job.id); eq(final.outcome, 'bytes-lost', 'missing bytes with no refetch refused'); eq(S.chain.coreBroadcasts.length, 0, 'nothing spent');
});

await T('Z-1 a never-funded job never stalls and never wipes its key', async () => {
  const S = setup(); const job = await start(S);
  const p = S.engine.run(job.id);
  for (let i = 0; i < 30; i++) await new Promise((r) => setImmediate(r));
  const j = S.jobStore.get(job.id); eq(j.status, 'AWAITING_FUNDS', 'still waiting'); ok(j.mnemonic, 'key intact');
  S.engine.cancel(job.id); await p;
});

await T('Z-2 resumable stop: after a stall the upload session is kept and the job can be resumed with new funds', async () => {
  const t0 = 1_700_000_000_000;
  const S = setup({ chainOpts: { estMult: (t) => (t > t0 + 70_000 && t < t0 + 3 * 3600_000 ? 400n : 1n) } });
  const job = await start(S); const funder = fund(S, job);
  let final = await S.engine.run(job.id);
  eq(final.status, 'STOPPED', 'stopped'); ok(final.resumable, 'marked resumable'); ok(S.jobStore.get(job.id).mnemonic, 'key kept');
  S.chain.sleep(10 * 60_000);
  ok(S.engine.resumeStopped(job.id).resuming, 'resume accepted');
  S.chain.transfer(funder, job.address, BigInt(job.required));
  final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes after resuming');
  eq(S.chain.coreBroadcasts.filter((x) => x === 'begin').length, 1, 'the paid-for session was reused');
});

await T('Q-1 overpaying: the fee is 10% of everything that arrived, the rest comes back', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job, 'SPVISITOR', 10n * STX);
  const before = S.chain.balanceOf(funder);
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  const received = BigInt(job.required) + 10n * STX;
  eq(S.chain.balanceOf(AGENT), received * 10n / 100n, '10% of the full amount sent (' + Number(received) / 1e6 + ' STX)');
  ok(S.chain.balanceOf(funder) - before > 10n * STX - 100_000n - 0n, 'the extra STX came back to the payer');
  ok(S.chain.balanceOf(job.address) <= 60_000n, 'wallet emptied');
});

await T('Q-2 top-up mid-job counts toward the 10%', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job);
  S.chain.at(30_000, (c) => { c.helperFee = 4n * STX; });
  S.chain.at(30 * 60_000, (c) => { c.credit(funder, 20n * STX); c.transfer(funder, job.address, 5n * STX); });
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  eq(S.chain.balanceOf(AGENT), (BigInt(job.required) + 5n * STX) * 10n / 100n, '10% of the first payment plus the top-up');
});

await T('Q-3 tab closed right after the fee is broadcast: reopened job pays the fee once, not twice', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); const funder = fund(S, job);
  S.chain.hooks.afterFeeBroadcast = () => { S.sleepKill.dead = true; };
  let died = false; try { await S.engine.run(job.id); } catch (e) { died = /TAB CLOSED/.test(e.message); }
  ok(died, 'cut off mid-settlement');
  S.sleepKill.dead = false;
  const e2 = S.mk(); e2.attach(job.id);
  const final = await e2.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  eq(S.chain.balanceOf(AGENT), BigInt(job.required) * 10n / 100n, 'the fee was paid exactly once');
  ok(S.chain.balanceOf(job.address) <= 60_000n, 'wallet emptied');
});

await T('Q-4 the fee read is stale (less than funding saw): refused, retried, never undercharged silently', async () => {
  const S = setup({ size: 600_000 }); const job = await start(S); fund(S, job);
  const real = S.chain.received; let lies = 2;
  S.chain.received = { get: (a) => (lies > 0 && a === job.address ? (lies--, 1n) : real.get(a)), set: (a, v) => real.set(a, v) };
  const final = await S.engine.run(job.id);
  eq(final.status, 'COMPLETE', 'completes');
  eq(S.chain.balanceOf(AGENT), BigInt(job.required) * 10n / 100n, 'the full 10% after the read recovered');
});

console.log(`\n${passed} checks passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

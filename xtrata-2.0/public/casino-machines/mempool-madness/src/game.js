/* Mempool Madness — a ParallaX Casino machine. A 1970s mission-control console for Bitcoin's mempool, the waiting room where every
   transaction queues for a block and bids in fees to get in. Every symbol is real Bitcoin material read from the mempool: fee bands,
   a real recent whale transaction, a real stuck transaction, a real pending transaction (txid prefix and fee rate), real recent block
   fees and the real projected next block. Live figures come from the mempool.space API about every 30 seconds; with no connection the
   machine runs from the snapshot taken at build time and says SNAPSHOT. Nothing is invented. The maths is the shared Block Fortune v2
   engine (BF) unchanged: every outcome is fixed by BF before any art is chosen, and tiles are picked with Math.random, never the
   engine's generator, so no figure, tile or network read can change a result. The casino owns all 3D rendering and cameras; this frame
   only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='mempool-madness', LAYR=window.ParallaxLAYRAccount, E_REAL=LAYR.machine(GAME_ID,BF); let E=E_REAL;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E_REAL.bets, ACCENT = '#14f195', PHOS = '#14f195', PHOS_DIM = '#0b8a56', AMBER = '#ffb347', ALERT = '#ff4d4d', GOLD = '#ffd23f', INK = '#d8fff0';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: '1 SAT/VB', lemon: '5 SAT/VB', chip: '20 SAT/VB', block: '50 SAT/VB', artifact: 'WHALE', bitcoin: 'NEXT BLOCK', wild: 'RBF', scatter: 'FEE SPIKE', vault: 'STUCK TRANSACTION', chain: 'PENDING TRANSACTION' };
// What each reel symbol is. `rate` is the fee band in sat/vB for the four band symbols; `glow` is the tile's phosphor tint.
const COLS = {
  cherry:   { name: NAMES.cherry,   kind: 'band',    rate: 1,  label: 'NO PRIORITY',   glow: '#2f7bff' },
  lemon:    { name: NAMES.lemon,    kind: 'band',    rate: 5,  label: 'LOW',           glow: '#19c6c6' },
  chip:     { name: NAMES.chip,     kind: 'band',    rate: 20, label: 'MEDIUM',        glow: '#ffd23f' },
  block:    { name: NAMES.block,    kind: 'band',    rate: 50, label: 'HIGH PRIORITY', glow: '#ff8a2a' },
  artifact: { name: NAMES.artifact, kind: 'whale',   glow: '#5fd0ff' },
  bitcoin:  { name: NAMES.bitcoin,  kind: 'jackpot', glow: GOLD },
  wild:     { name: NAMES.wild,     kind: 'wild',    glow: '#ffb347' },
  scatter:  { name: NAMES.scatter,  kind: 'spike',   glow: ALERT },
  vault:    { name: NAMES.vault,    kind: 'stuck',   glow: '#ff7a59' },
  chain:    { name: NAMES.chain,    kind: 'pending', glow: AMBER }
};
let sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
// Bonus Lab runs use their own state and balance (see the Lab section). While one is active, nothing below reaches the real account.
let lab = null;
function save(){ if (lab) return; if(!sessionLock)LAYR.saveGame(state);}
let scene = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], jackpotShow = null;
// The room animates the cabinet's lever and spin button from these (see PX_CASINO_ENGINE.mechanics).
const lever = { name: 'px-lever' }; let leverStart = 0; const SPIN_Z = .19, spinPhysical = { position: { z: SPIN_Z } };
const feature = () => E.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- The mempool: the snapshot bundled at build time, topped up live from mempool.space ---------- */
// Every figure on a tile comes from here. With no connection the machine runs from the snapshot and says SNAPSHOT; it never invents a figure.
const SNAP = window.MM_SNAPSHOT;
if (!SNAP) throw Error('Mempool Madness: the bundled mempool snapshot is missing.');
const API = 'https://mempool.space/api', REFRESH_MS = 30000;
const copyJ = o => JSON.parse(JSON.stringify(o));
const D = { source: 'snapshot', takenAt: Date.parse(SNAP.takenAt) || 0, readAt: 0, fails: 0, version: 0, pulse: 0, everLive: false,
  tip: copyJ(SNAP.tip), fees: copyJ(SNAP.fees), mempool: copyJ(SNAP.mempool), blocks: copyJ(SNAP.blocks), recent: copyJ(SNAP.recentBlocks),
  whales: copyJ(SNAP.whales), stuck: copyJ(SNAP.stuck), pending: copyJ(SNAP.pending) };
const TIP_KEY = 'xtrata.parallax.mempool-madness.tip.v1';
try { const c = JSON.parse(localStorage.getItem(TIP_KEY) || 'null'); if (c && Number.isFinite(c.height) && c.height > D.tip.height) { D.tip = { height: c.height, hash: c.hash || null, time: c.time || null, cached: true }; } } catch (e) {}
const height = () => D.tip.height;
async function jget(path, ms = 9000) { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms); try { const r = await fetch(API + path, { cache: 'no-store', signal: ctl.signal }); if (!r.ok) throw Error('HTTP ' + r.status); return await r.json(); } finally { clearTimeout(t); } }
const num0 = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;
const r2 = v => Math.round(v * 100) / 100;
let refreshing = false, dataKey = '';
// Add (or refresh) the real transactions the pools draw from. Pending ones come from the newest unconfirmed transactions the API lists.
function mergeFront(list, fresh, cap) { const seen = new Set(fresh.map(x => x.txid)); return fresh.concat(list.filter(x => !seen.has(x.txid))).slice(0, cap); }
async function scanWhales(hash, h) {
  const found = [];
  for (let start = 0; start <= 75; start += 25) {
    let txs; try { txs = await jget(`/block/${hash}/txs/${start}`); } catch (e) { break; }
    if (!Array.isArray(txs)) break;
    for (const t of txs) { const sats = (t.vout || []).reduce((a, o) => a + num0(o.value), 0); if (sats >= 100 * 1e8 && t.txid) found.push({ txid: t.txid, btc: sats / 1e8, fee: num0(t.fee), vsize: Math.max(1, Math.ceil(num0(t.weight) / 4)), height: h }); }
    if (txs.length < 25) break;
  }
  return found;
}
async function refreshData() {
  if (refreshing) return; refreshing = true;
  try {
    const [fees, pb, mem, tip, recentTx] = await Promise.all([jget('/v1/fees/recommended'), jget('/v1/fees/mempool-blocks'), jget('/mempool'), jget('/blocks/tip/height'), jget('/mempool/recent').catch(() => null)]);
    if (!fees || !Number.isFinite(Number(fees.fastestFee)) || !Array.isArray(pb) || !pb.length || !mem || !Array.isArray(mem.fee_histogram) || !(Number(tip) > 0)) throw Error('unexpected reply');
    D.fees = { fastestFee: num0(fees.fastestFee), halfHourFee: num0(fees.halfHourFee), hourFee: num0(fees.hourFee), economyFee: num0(fees.economyFee), minimumFee: num0(fees.minimumFee) };
    D.blocks = pb.slice(0, 8).map(b => { const fr = Array.isArray(b.feeRange) && b.feeRange.length ? b.feeRange.map(Number).filter(Number.isFinite) : []; return { nTx: num0(b.nTx), blockVSize: num0(b.blockVSize), totalFees: num0(b.totalFees), medianFee: r2(num0(b.medianFee)), min: fr.length ? r2(Math.min(...fr)) : null, max: fr.length ? r2(Math.max(...fr)) : null }; });
    const atLeast = {}; for (const k of [0, 1, 2, 3, 5, 10]) atLeast[k] = mem.fee_histogram.reduce((a, row) => a + (num0(row[0]) >= k ? num0(row[1]) : 0), 0);
    D.mempool = { count: num0(mem.count), vsize: num0(mem.vsize), totalFee: num0(mem.total_fee), vsizeAtLeast: atLeast, note: SNAP.mempool.note };
    const newTip = Number(tip), isNew = newTip > D.tip.height, first = !D.everLive;
    if (isNew || first) {
      try { const bl = await jget('/v1/blocks'); if (Array.isArray(bl) && bl.length) { D.recent = bl.slice(0, 15).map(b => ({ height: b.height, id: b.id, time: b.timestamp, nTx: num0(b.tx_count), medianFee: r2(num0(b.extras && b.extras.medianFee)), pool: (b.extras && b.extras.pool && b.extras.pool.name) || '' })); D.tip = { height: D.recent[0].height, hash: D.recent[0].id, time: D.recent[0].time }; } else D.tip = { height: newTip, hash: null, time: null }; } catch (e) { D.tip = { height: newTip, hash: null, time: null }; }
      if (isNew) { D.pulse++; scanWhales(D.tip.hash, D.tip.height).then(w => { if (w.length) { D.whales = mergeFront(D.whales, w, 40); dataKey = ''; } }).catch(() => {}); }
      try { localStorage.setItem(TIP_KEY, JSON.stringify({ height: D.tip.height, hash: D.tip.hash, time: D.tip.time })); } catch (e) {}
    }
    if (Array.isArray(recentTx)) { const p = recentTx.filter(t => t && t.txid && num0(t.vsize) > 0).map(t => ({ txid: t.txid, feeRate: r2(num0(t.fee) / num0(t.vsize)), vsize: num0(t.vsize), fee: num0(t.fee) })); if (p.length) D.pending = mergeFront(D.pending, p, 40); }
    // Stuck transactions must still be waiting: re-check a few each read and drop any that have confirmed (always keeping nine for the crates).
    for (let k = 0; k < 3 && D.stuck.length > 9; k++) { const i = Math.floor(Math.random() * D.stuck.length), s = D.stuck[i]; try { const st = await jget(`/tx/${s.txid}/status`, 6000); if (st && st.confirmed === true) D.stuck.splice(i, 1); } catch (e) {} }
    D.source = 'live'; D.everLive = true; D.fails = 0; D.readAt = Date.now();
    if (isNew) { sfx('blockfound'); toast(`Block ${D.tip.height.toLocaleString('en-GB')} found. The mempool shuffles forward.`); }
  } catch (e) { D.fails++; if (D.fails >= 2) D.source = D.everLive ? 'stale' : 'snapshot'; }
  finally { refreshing = false; D.version++; if (typeof rebuildPools === 'function') rebuildPools(); screenDirty = true; }
}
const dataBadge = () => D.source === 'live' ? { text: 'LIVE', ok: true } : D.source === 'stale' ? { text: 'STALE', ok: false } : { text: 'SNAPSHOT', ok: false };
let dataTimer = 0;
function startData() { clearInterval(dataTimer); refreshData(); dataTimer = setInterval(() => { if (!document.hidden) refreshData(); }, REFRESH_MS); }
const stamp = ms => { const d = new Date(ms); return `${d.getUTCDate()} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const stampFull = ms => `${stamp(ms)} ${String(new Date(ms).getUTCHours()).padStart(2, '0')}:${String(new Date(ms).getUTCMinutes()).padStart(2, '0')} UTC`;
const vbText = v => v >= 1e6 ? `${(v / 1e6).toFixed(2)} MvB` : v >= 1e3 ? `${Math.round(v / 1e3).toLocaleString('en-GB')} kvB` : `${Math.round(v)} vB`;
const rateText = r => r >= 100 ? String(Math.round(r)) : r >= 10 ? r.toFixed(1) : r >= 1 ? r.toFixed(2) : r.toFixed(2);
const shortTx = t => `${t.slice(0, 8)}…${t.slice(-4)}`;
// Fee colour, cool blue at the bottom of the fee market to hot red at the top (log scale of sat/vB).
const FEE_STOPS = [[0.5, [47, 123, 255]], [2, [25, 198, 198]], [6, [61, 220, 132]], [15, [255, 210, 63]], [40, [255, 138, 42]], [120, [255, 59, 59]]];
function feeColor(rate, a = 1) {
  const x = Math.log(Math.max(.1, rate)); let lo = FEE_STOPS[0], hi = FEE_STOPS.at(-1);
  if (rate <= lo[0]) hi = lo; else if (rate >= hi[0]) lo = hi; else for (let i = 0; i < FEE_STOPS.length - 1; i++) if (rate >= FEE_STOPS[i][0] && rate <= FEE_STOPS[i + 1][0]) { lo = FEE_STOPS[i]; hi = FEE_STOPS[i + 1]; break; }
  const t = lo === hi ? 0 : (x - Math.log(lo[0])) / (Math.log(hi[0]) - Math.log(lo[0])), c = lo[1].map((v, i) => Math.round(v + (hi[1][i] - v) * t));
  return a >= 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

/* ---------- Holder layer, version 1: meters and display only ---------- */
// The Daily Pot is 1% of every paid bet, kept beside the jackpot meters. It is paid for out of the house edge: it is never taken from a
// stake or a win, so the player's 94.38% is untouched. It is split per forevered twin across every live Forever Twins collection and
// paid every 144 Bitcoin blocks (about a day). The period boundary is the block height, a multiple of 144, so nobody can argue about it.
const HOLDER_RATE = 0.01, DAY_BLOCKS = 144;
const potPeriod = () => Math.floor(height() / DAY_BLOCKS), blocksLeft = () => DAY_BLOCKS - (height() % DAY_BLOCKS);
function holderState() {
  const now = potPeriod(); let h = state.holder;
  if (lab) return h && typeof h === 'object' ? h : (state.holder = { period: now, pot: 0, last: null, cameos: 0 }); // the Lab keeps its own pot, never the real one
  if (!h || typeof h !== 'object' || typeof h.period !== 'number') h = state.holder = { period: now, pot: 0, last: null, cameos: 0 };
  if (now > h.period) { h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100 }; h.period = now; h.pot = 0; }
  return h;
}
function holderAdd(bet) { if (lab) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Twins counted from the Forever Twins helpers (checked reads: a failed read is "unknown", never "no twins"). Read-only, cached six hours.
const REG_URL = 'https://xtrata.xyz/forever-twins/data/registry.v2.json', TWIN_KEY = 'xtrata.parallax.mempool-madness.twins.v1';
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await new Promise(res => setTimeout(res, 400 + i * 600)); } throw last; }
async function helperCount(helper) { const q = `/extended/v1/contract/${helper}/events?limit=1&offset=0`; let j; try { j = await getJSON(`https://xtrata.xyz/hiro/mainnet${q}`); } catch (e) { j = await getJSON(`https://api.hiro.so${q}`, 1); }
  let n = 0; for (const e of (j && j.results) || []) { const m = /\(inscribed-count u(\d+)\)/.exec((e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''); if (m) n = Math.max(n, Number(m[1])); } return n; }
async function countTwins() {
  try { const c = JSON.parse(localStorage.getItem(TWIN_KEY) || 'null'); if (c && Date.now() - c.time < 6 * 3600e3 && Number.isFinite(c.total)) return { ok: true, value: c.total, collections: c.collections, cached: true }; } catch (e) {}
  const reg = await getJSON(REG_URL), cols = ((reg && reg.collections) || []).filter(c => c.status === 'live' && c.helper);
  if (!cols.length) return { ok: false, value: null, reason: 'registry lists no live collection' };
  const counts = await Promise.all(cols.map(c => helperCount(c.helper).then(n => ({ ok: true, n }), () => ({ ok: false, n: null }))));
  if (counts.some(c => !c.ok)) return { ok: false, value: null, reason: 'a helper read failed: unknown, not zero' };
  const total = counts.reduce((a, c) => a + c.n, 0); try { localStorage.setItem(TWIN_KEY, JSON.stringify({ time: Date.now(), total, collections: cols.length })); } catch (e) {}
  return { ok: true, value: total, collections: cols.length };
}
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): at each 144-block boundary, read every forevered twin of every live collection through its helper (checked read),
//   divide the finished period's pot by the twin count and credit each twin's current holder (an on-chain claim once LAYR is a token).
// TODO(holder-layer-v2): the Cameo royalty (1% of a line win to the holder of a twin on the line) needs NFT symbols on the reels; Mempool
//   Madness shows on-chain records only, so no cameo is recorded here. The Daily Pot is this machine's holder reward.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  countTwins,
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): the 144-block snapshot and payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): claims need an on-chain LAYR token.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): holder spins need the holder-link service.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): Forever Fund refunds need a contract.' })
});
let twinCount = { ok: false, value: null, reason: 'not read yet' };
HolderRewards.countTwins().then(r => { twinCount = r; screenDirty = true; }).catch(e => { twinCount = { ok: false, value: null, reason: String(e && e.message || e) }; });
function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = lab ? 'LAB · LAST WIN' : showFree ? 'RUSH HOUR WIN' : 'LAST WIN';
  $('freeCount').textContent = lab ? 'LAB BALANCE · NOT REAL LAYR' : state.free ? `${state.free} RUSH HOUR SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'BROADCASTING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-BUMP';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  updateFsBar(); screenDirty = true;
}

/* ---------- Procedural audio: console beeps, the radar sweep, relay clacks, the launch roar. No files. ---------- */
let ac = null, master = null, noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * .5; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
function noise(d = .05, freq = 2400, q = 2, v = .25, delay = 0, type = 'bandpass') { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; f.type = type; f.frequency.value = freq; f.Q.value = q; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t, Math.random() * .4); s.stop(t + d + .02); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// A deep console thump: a sine that falls in pitch with a soft low noise.
function drum(f = 70, v = .45, at = 0, d = .42) { const a = tone(f * 1.9, d, 'sine', v, at, .5); noise(.12, 180, .8, v * .6, at, 'lowpass'); return a; }
// A console beep: a short square-wave chirp with a relay tick under it. (Named hammer so every stop and lock below can share it.)
function hammer(at = 0, v = 1, f = 880) { return [noise(.03, 3600, 3, .2 * v, at), tone(f, .09, 'square', .06 * v, at), tone(f * 2, .05, 'sine', .03 * v, at + .005), tone(110, .1, 'triangle', .16 * v, at, .6)].filter(Boolean); }
// The radar sweep: filtered noise whose pass band slides up, then a ping.
function sweep(d = .9, at = 0, v = .12, from = 300, to = 3200) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + at; s.buffer = noiseBuf; s.loop = true; f.type = 'bandpass'; f.Q.value = 5; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + d); s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(v, t + d * .3); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t); s.stop(t + d + .05); }
function ping(f = 1480, at = 0, v = .1) { tone(f, .9, 'sine', v, at); tone(f * 2.01, .5, 'sine', v * .35, at); }
// The rocket launch: a rising roar of filtered noise whose cutoff and level climb.
function roar(d = 2.4, at = 0, v = .22) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + at; s.buffer = noiseBuf; s.loop = true; f.type = 'lowpass'; f.frequency.setValueAtTime(160, t); f.frequency.exponentialRampToValueAtTime(2600, t + d); s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(.01, t); g.gain.linearRampToValueAtTime(v, t + d * .9); g.gain.exponentialRampToValueAtTime(.001, t + d + .5); s.start(t); s.stop(t + d + .55); }
// A burst of console blips (the old "embers"): n quick high beeps.
function embers(n, at = 0) { for (let k = 0; k < n; k++) { const t = at + k * (.04 + Math.random() * .05); tone(1500 + Math.random() * 2000, .05, 'square', .02, t); noise(.02, 5200, 4, .04, t); } }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { sweep(.7, 0, .12); tone(520, .08, 'square', .05); tone(780, .08, 'square', .05, .09); tone(1040, .1, 'square', .05, .18); drum(58, .3); }
  if (kind === 'stop') return [...hammer(at, .7 + i * .05, 520 + i * 110), drum(70 + i * 4, .16, at, .2)].filter(Boolean); // a console beep as each reel locks
  if (kind === 'win') { [660, 880, 1100].forEach((n, k) => tone(n, .12, 'square', .05, k * .07)); embers(6, .22); }
  if (kind === 'big') { [523, 659, 784, 1047, 1319].forEach((n, k) => tone(n, .2, 'square', .05, k * .07)); sweep(.8, 0, .1); embers(24, .4); drum(60, .4); }
  if (kind === 'bonus') { ping(1480); ping(1480, .45); [440, 660].forEach((n, k) => tone(n, .5, 'sawtooth', .04, k * .22 + .2)); drum(52, .45); }
  if (kind === 'antic') sweep(1.6, 0, .1, 240, 2200);
  if (kind === 'tick') { noise(.02, 3200, 6, .08); tone(1400, .04, 'square', .02); }
  if (kind === 'lock') { hammer(i * .08, 1, 1200); embers(2, i * .08 + .05); }
  if (kind === 'respin') { noise(.1, 700, 1.2, .12); drum(64, .2); tone(300, .08, 'square', .04); }
  if (kind === 'pick') { tone(988 + i * 60, .22, 'sine', .1); embers(3, .05); }
  if (kind === 'click') noise(.02, 2500, 4, .1);
  if (kind === 'lose') { tone(220, .5, 'sawtooth', .07, 0, .4); tone(165, .6, 'square', .05, .12, .5); noise(.5, 300, .8, .08, 0, 'lowpass'); }
  if (kind === 'flip') { noise(.05, 4000, 3, .2); tone(1400, .2, 'sine', .05, .05, .8); }
  return [];
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
/* ---------- Canvas helpers ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
const num = n => `#${Number(n).toLocaleString('en-GB')}`;
const hashStr = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
for (const id of ['brandmark', 'loaderMark']) { const el = $(id); if (el) xtrataLogo(el.getContext('2d'), el.width / 2, el.height / 2, el.width * .9); }
// A small seeded generator for cosmetic texture only (cracks, stars, grain). Never the engine's generator.
function seeded(seed) { let h = hashStr(seed) || 1; return () => { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }; }

/* ---------- Reel tiles: original data tiles in a control-room style, drawn from the live figures ---------- */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px
const MONO = '"DejaVu Sans Mono","Liberation Mono","Courier New",monospace', SANS = 'Arial, "Liberation Sans", sans-serif';
function speckle(g, seed, x, y, w, h, n = 60) { const r = seeded('sp' + seed); g.save(); for (let i = 0; i < n; i++) { g.fillStyle = r() < .5 ? '#ffffff08' : '#00000022'; g.fillRect(x + r() * w, y + r() * h, 1 + r() * 3, 1); } g.restore(); }
function screws(g) { for (const [x, y] of [[24, 17], [216, 17], [24, 211], [216, 211]]) { g.beginPath(); g.arc(x, y, 4.2, 0, 7); g.fillStyle = lin(g, x - 4, y - 4, x + 4, y + 4, ['#8d9a94', '#2c3531']); g.fill(); g.strokeStyle = '#000a'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2.6, y + 1); g.lineTo(x + 2.6, y - 1); g.stroke(); } }
// The grey-steel console panel every tile is cut from. `frame` colours the bezel edge.
function steelBody(g, seed, glow, frame, fw, hot) {
  g.shadowColor = hot ? glow : '#000'; g.shadowBlur = hot ? 16 : 5;
  round(g, 12, 6, 216, 216, 14, lin(g, 0, 6, 0, 222, ['#2b3834', '#17221d', '#0d1612']));
  g.shadowBlur = 0; speckle(g, seed, 12, 6, 216, 216, 80);
  round(g, 12, 6, 216, 216, 14, null, frame, fw); round(g, 17, 11, 206, 206, 11, null, '#ffffff14', 2); screws(g);
}
// A phosphor display well: near-black green with a faint grid and a lit edge.
function well(g, x, y, w, h, glow) {
  round(g, x, y, w, h, 8, '#030c08'); g.save(); g.beginPath(); g.roundRect(x, y, w, h, 8); g.clip();
  g.strokeStyle = PHOS + '14'; g.lineWidth = 1; for (let gx = x + 16; gx < x + w; gx += 16) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx, y + h); g.stroke(); } for (let gy = y + 16; gy < y + h; gy += 16) { g.beginPath(); g.moveTo(x, gy); g.lineTo(x + w, gy); g.stroke(); }
  g.fillStyle = '#ffffff06'; for (let sy = y; sy < y + h; sy += 3) g.fillRect(x, sy, w, 1); g.restore();
  round(g, x, y, w, h, 8, null, (glow || PHOS) + '66', 2);
}
function tag(g, label, x, y, w, fill, ink, size = 14) { round(g, x, y, w, 26, 7, fill); text(g, label, x + w / 2, y + 14, size, ink, SANS, 'center', '900'); }
function headStrip(g, left, right, glow) { text(g, left, 30, 30, 15, glow, SANS, 'left', '900'); if (right) text(g, right, 210, 30, 12, '#9bb8aa', SANS, 'right', '800'); }
function footer(g, l1, l2, c1 = INK, c2 = '#8fb3a2') { round(g, 24, 172, 192, 42, 8, '#050d09'); round(g, 24, 172, 192, 42, 8, null, '#ffffff10', 1); fitText(g, l1, 120, 187, 188, 19, c1, MONO, '800'); if (l2) fitText(g, l2, 120, 204, 188, 13, c2, MONO, '700'); }
function fitText(g, s, x, y, maxW, size, color, font = SANS, weight = 'bold') { let sz = size; g.font = `${weight} ${sz}px ${font}`; while (sz > 8 && g.measureText(s).width > maxW) { sz--; g.font = `${weight} ${sz}px ${font}`; } text(g, s, x, y, sz, color, font, 'center', weight); }
function glowNum(g, s, x, y, size, color, glow) { g.save(); g.font = `900 ${size}px ${SANS}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000000b0'; g.fillText(s, x + 2, y + 3); g.shadowColor = glow || color; g.shadowBlur = 14; g.fillStyle = color; g.fillText(s, x, y); g.restore(); }

// The block shape (a fee-coloured square with a transaction grid and a lit top edge), used by the band tiles and the scenes.
function blockShape(g, x, y, s, rate, o = {}) {
  const col = feeColor(rate), dark = feeColor(rate, .35); g.save(); g.shadowColor = col; g.shadowBlur = o.glow ?? 14;
  round(g, x, y, s, s, s * .09, lin(g, x, y, x, y + s, [col, dark.replace('rgba', 'rgba')]), '#ffffffaa', 2); g.shadowBlur = 0;
  const n = o.grid || 4, cell = (s - s * .2) / n, r = seeded('blk' + (o.seed || rate)); g.globalAlpha = .55;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = r() < .5 ? '#00000040' : '#ffffff30'; g.fillRect(x + s * .1 + i * cell + 1.5, y + s * .1 + j * cell + 1.5, cell - 3, cell - 3); }
  g.globalAlpha = 1; g.restore();
}
function bandTile(sym, variant) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], rate = col.rate, fc = feeColor(rate); g.scale(TILE / 240, TILE / 240);
  steelBody(g, `${sym}${variant}`, fc, fc + 'cc', 3, false); headStrip(g, 'FEE BAND', col.label, fc); well(g, 24, 46, 192, 120, fc);
  if (variant === 0) { blockShape(g, 70, 56, 100, rate, { seed: sym }); glowNum(g, String(rate), 120, 96, rate >= 10 ? 52 : 62, '#041008', '#ffffff'); text(g, 'sat/vB', 120, 138, 17, '#041008cc', SANS, 'center', '900'); }
  if (variant === 1) { // a gauge: the whole fee market on a log dial, the needle on this band
    const cx = 120, cy = 140, R = 78; for (let a = 0; a < 60; a++) { const t = a / 59, ang = Math.PI * (1 + t), rt = Math.exp(Math.log(.5) + t * (Math.log(150) - Math.log(.5))); g.beginPath(); g.arc(cx, cy, R, ang, ang + Math.PI / 59 + .01); g.lineWidth = 12; g.strokeStyle = feeColor(rt); g.stroke(); }
    const t = (Math.log(rate) - Math.log(.5)) / (Math.log(150) - Math.log(.5)), ang = Math.PI * (1 + t); g.save(); g.shadowColor = '#fff'; g.shadowBlur = 8; g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + Math.cos(ang) * 22, cy + Math.sin(ang) * 22); g.lineTo(cx + Math.cos(ang) * (R + 8), cy + Math.sin(ang) * (R + 8)); g.stroke(); g.restore();
    g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fillStyle = '#d8fff0'; g.fill(); glowNum(g, String(rate), cx, 118, 46, fc, fc); text(g, 'sat/vB', cx, 154, 14, '#9bb8aa', SANS, 'center', '800'); }
  if (variant === 2) { // four slabs, this band lit
    [1, 5, 20, 50].forEach((rt, i) => { const y = 54 + i * 28, on = rt === rate; round(g, 36, y, 168, 22, 5, on ? lin(g, 36, y, 204, y, [feeColor(rt), feeColor(rt, .5)]) : '#16241d', on ? '#fff' : '#ffffff18', on ? 2 : 1); text(g, `${rt} sat/vB`, 48, y + 12, 13, on ? '#041008' : '#5f7d6e', SANS, 'left', '900'); if (on) { g.save(); g.shadowColor = feeColor(rt); g.shadowBlur = 16; round(g, 36, y, 168, 22, 5, null, feeColor(rt), 2); g.restore(); } });
  }
  const f = D.fees, m = D.mempool, nb = D.blocks[0] || {};
  if (rate === 1) footer(g, `QUEUED ≥1: ${vbText(m.vsizeAtLeast[1])}`, `ECONOMY FEE ${f.economyFee} sat/vB`);
  if (rate === 5) footer(g, `QUEUED ≥5: ${vbText(m.vsizeAtLeast[5])}`, `HOUR FEE ${f.hourFee} sat/vB`);
  if (rate === 20) footer(g, `HALF-HOUR FEE ${f.halfHourFee}`, nb.medianFee != null ? `NEXT BLOCK MEDIAN ${rateText(nb.medianFee)}` : 'sat/vB');
  if (rate === 50) footer(g, `FASTEST FEE ${f.fastestFee}`, nb.max != null ? `TOP BID ${rateText(nb.max)} sat/vB` : 'sat/vB');
  return c;
}
function whaleShape(g, cx, cy, s, col) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.fillStyle = col; g.strokeStyle = '#041008'; g.lineWidth = 1.5 / s;
  g.beginPath(); g.moveTo(-52, 4); g.bezierCurveTo(-54, -26, -14, -34, 20, -26); g.bezierCurveTo(40, -20, 50, -8, 60, -16); g.lineTo(76, -30); g.bezierCurveTo(72, -18, 74, -6, 80, 4); g.bezierCurveTo(70, 0, 62, 6, 58, 12); g.bezierCurveTo(44, 24, 4, 32, -24, 26); g.bezierCurveTo(-40, 22, -50, 14, -52, 4); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = '#ffffff55'; g.lineWidth = 2 / s; g.beginPath(); g.moveTo(-46, 12); g.bezierCurveTo(-20, 22, 20, 20, 44, 10); g.stroke();
  g.beginPath(); g.arc(-30, -4, 2.6, 0, 7); g.fillStyle = '#041008'; g.fill();
  g.strokeStyle = col; g.lineWidth = 2.2 / s; g.lineCap = 'round'; for (const dx of [-3, 3]) { g.beginPath(); g.moveTo(-12, -30); g.quadraticCurveTo(-12 + dx * 3, -44, -12 + dx * 6, -42); g.stroke(); }
  g.restore();
}
// A whale: a real transaction that moved 100 BTC or more.
function whaleTile(w) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS.artifact.glow; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'wh' + w.txid.slice(0, 6), col, col + 'cc', 3, false); headStrip(g, 'WHALE', '≥ 100 BTC', col); well(g, 24, 46, 192, 120, col);
  whaleShape(g, 120, 82, 1.05, col); glowNum(g, w.btc.toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 }), 120, 135, w.btc >= 1000 ? 34 : 38, INK, col); text(g, 'BTC MOVED', 120, 156, 12, '#9bb8aa', SANS, 'center', '800');
  footer(g, `TX ${shortTx(w.txid)}`, `BLOCK ${w.height.toLocaleString('en-GB')} · ${rateText(w.fee / Math.max(1, w.vsize))} sat/vB`);
  return c;
}
// The jackpot symbol: the real projected next block, with its transaction count and fee range.
function nextBlockTile() {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), nb = D.blocks[0] || { nTx: 0, blockVSize: 0, medianFee: 0, min: null, max: null }; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'nb', GOLD, lin(g, 0, 0, 0, 240, ['#fff1b8', GOLD, '#a87411']), 7, true); headStrip(g, 'NEXT BLOCK', null, GOLD); tag(g, 'JACKPOT', 134, 17, 82, GOLD, '#1a1400', 13); well(g, 24, 46, 192, 120, GOLD);
  const x = 72, y = 54, s = 96, n = 8, cell = s / n, r = seeded('nbgrid' + D.tip.height + nb.nTx), lo = Math.log(Math.max(.2, nb.min || nb.medianFee || 1)), hi = Math.log(Math.max(1, nb.max || nb.medianFee || 1)), med = Math.log(Math.max(.2, nb.medianFee || 1));
  const fill = Math.max(.1, Math.min(1, nb.blockVSize / 1e6)), rows = Math.round(n * fill);
  g.save(); g.shadowColor = GOLD; g.shadowBlur = 14; round(g, x - 4, y - 4, s + 8, s + 8, 8, '#0a1510', GOLD, 3); g.shadowBlur = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (n - 1 - j >= rows) continue; const u = Math.pow(r(), 2.2), lg = med + (u < .5 ? (lo - med) * (1 - u * 2) : (hi - med) * ((u - .5) * 2) * .55); g.fillStyle = feeColor(Math.exp(lg)); g.fillRect(x + i * cell + 1, y + j * cell + 1, cell - 2, cell - 2); }
  g.restore();
  footer(g, `${nb.nTx.toLocaleString('en-GB')} TX · ${(nb.blockVSize / 1e4).toFixed(0)}% FULL`, nb.min != null && nb.max != null ? `${rateText(nb.min)}–${rateText(nb.max)} sat/vB · MEDIAN ${rateText(nb.medianFee)}` : `MEDIAN ${rateText(nb.medianFee)} sat/vB`);
  return c;
}
// RBF, the wild: a replace-by-fee bump. Original art; it states no figure.
function rbfTile(variant) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS.wild.glow; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'rbf' + variant, col, lin(g, 0, 0, 0, 240, ['#ffe0a0', col, '#a8651a']), 7, true); headStrip(g, 'RBF', null, col); tag(g, 'WILD', 156, 17, 54, ACCENT, '#02140b', 13); well(g, 24, 46, 192, 120, col);
  const card = (x, y, w, h, fee, dim) => { round(g, x, y, w, h, 6, dim ? '#1b2a22' : '#223a2e', dim ? '#4c6a5c' : PHOS, 2); g.fillStyle = dim ? '#4c6a5c' : '#9bd9bd'; g.fillRect(x + 8, y + 9, w * .5, 4); g.fillRect(x + 8, y + 19, w * .7, 4); round(g, x + 8, y + h - 20, w - 16, 10, 3, '#06120c'); round(g, x + 8, y + h - 20, (w - 16) * fee, 10, 3, dim ? '#2f7bff' : '#ff8a2a'); };
  if (variant === 0) { card(34, 98, 80, 56, .25, true); g.strokeStyle = ALERT; g.lineWidth = 3; g.beginPath(); g.moveTo(34, 98); g.lineTo(114, 154); g.stroke(); card(118, 54, 86, 60, .95, false); g.fillStyle = PHOS; g.beginPath(); g.moveTo(112, 112); g.lineTo(124, 102); g.lineTo(124, 108); g.lineTo(134, 108); g.lineTo(134, 118); g.lineTo(124, 118); g.lineTo(124, 124); g.closePath(); g.fill(); }
  if (variant === 1) { for (let i = 0; i < 3; i++) { const y = 60 + i * 24; g.save(); g.shadowColor = PHOS; g.shadowBlur = 8 + i * 4; g.fillStyle = lin(g, 0, y, 0, y + 22, [i === 2 ? '#ff8a2a' : '#19c6c6', i === 2 ? '#ff3b3b' : '#14f195']); g.beginPath(); g.moveTo(120, y); g.lineTo(168, y + 20); g.lineTo(148, y + 20); g.lineTo(120, y + 8); g.lineTo(92, y + 20); g.lineTo(72, y + 20); g.closePath(); g.fill(); g.restore(); } }
  if (variant === 2) { card(40, 62, 78, 52, .2, true); card(122, 62, 78, 52, .95, false); g.fillStyle = PHOS; g.beginPath(); g.moveTo(112, 132); g.lineTo(128, 132); g.lineTo(128, 124); g.lineTo(146, 138); g.lineTo(128, 152); g.lineTo(128, 144); g.lineTo(112, 144); g.closePath(); g.fill(); }
  glowNum(g, 'RBF', 120, variant === 1 ? 148 : 140, 30, INK, col);
  footer(g, 'REPLACE-BY-FEE', 'A HIGHER FEE JUMPS THE QUEUE');
  return c;
}
// A fee spike: the median fee of each of the last blocks, with this block's bar lit.
function spikeTile(b, idx) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS.scatter.glow; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'sp' + b.height, col, col + 'cc', 5, true); headStrip(g, 'FEE SPIKE', `${D.recent.length} BLOCKS`, col); well(g, 24, 46, 192, 120, col);
  const list = D.recent.slice().reverse(), top = Math.max(2, ...list.map(x => x.medianFee)), n = list.length, bw = 176 / n, lg = v => Math.log(1 + v) / Math.log(1 + top);
  list.forEach((x, i) => { const h = Math.max(3, lg(x.medianFee) * 84), on = x.height === b.height; g.save(); if (on) { g.shadowColor = col; g.shadowBlur = 12; } g.fillStyle = on ? col : feeColor(x.medianFee, .8); g.fillRect(32 + i * bw + 1, 154 - h, bw - 3, h); g.restore(); });
  g.save(); g.setLineDash([3, 3]); g.strokeStyle = '#ffffff44'; g.beginPath(); g.moveTo(30, 154); g.lineTo(210, 154); g.stroke(); g.restore();
  const peak = list.reduce((a, x) => x.medianFee > a.medianFee ? x : a, list[0]); text(g, `PEAK ${rateText(peak.medianFee)}`, 208, 60, 11, '#9bb8aa', MONO, 'right', '800');
  footer(g, `BLOCK ${b.height.toLocaleString('en-GB')}`, `MEDIAN ${rateText(b.medianFee)} sat/vB · ${b.nTx.toLocaleString('en-GB')} TX`, INK);
  return c;
}
// A stuck transaction: a real low-fee transaction still waiting in the mempool, with the day it was first seen.
function stuckTile(s) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS.vault.glow; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'st' + s.txid.slice(0, 6), col, col + 'cc', 4, false); headStrip(g, 'STUCK', 'STILL WAITING', col); well(g, 24, 46, 192, 120, col);
  glowNum(g, rateText(s.feeRate), 120, 84, 52, feeColor(s.feeRate), feeColor(s.feeRate)); text(g, 'sat/vB', 120, 118, 15, '#9bb8aa', SANS, 'center', '800');
  g.save(); g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); g.arc(46, 146, 9, 0, 7); g.moveTo(46, 146); g.lineTo(46, 140); g.moveTo(46, 146); g.lineTo(51, 148); g.stroke(); g.restore();
  text(g, s.firstSeen ? `SINCE ${stamp(s.firstSeen * 1000)}` : 'WAITING', 130, 146, 14, '#ffb59f', MONO, 'center', '800');
  g.save(); g.beginPath(); g.rect(24, 160, 192, 6); g.clip(); for (let x = 20; x < 230; x += 16) { g.fillStyle = (x / 16) % 2 ? col : '#150a07'; g.beginPath(); g.moveTo(x, 166); g.lineTo(x + 8, 166); g.lineTo(x + 16, 160); g.lineTo(x + 8, 160); g.fill(); } g.restore();
  footer(g, `TX ${shortTx(s.txid)}`, `${s.vsize} vB · FEE ${s.fee} sats`);
  return c;
}
// Where a fee rate would land among the projected blocks right now (derived from the live projected blocks).
function projectedSlot(rate) { for (let i = 0; i < D.blocks.length; i++) if (D.blocks[i].min != null && rate >= D.blocks[i].min) return i + 1; return 0; }
// A pending transaction: a real txid prefix and its fee rate, with the projected block it would land in.
function pendingTile(p) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS.chain.glow; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'pd' + p.txid.slice(0, 6), col, col + 'cc', 4, false); headStrip(g, 'PENDING', 'UNCONFIRMED', col); well(g, 24, 46, 192, 120, col);
  glowNum(g, rateText(p.feeRate), 120, 82, 52, feeColor(p.feeRate), feeColor(p.feeRate)); text(g, 'sat/vB', 120, 116, 15, '#9bb8aa', SANS, 'center', '800');
  const slot = projectedSlot(p.feeRate); for (let i = 0; i < 6; i++) { round(g, 38 + i * 29, 134, 24, 18, 4, i + 1 === slot ? feeColor(p.feeRate) : '#14261d', i + 1 === slot ? '#fff' : '#ffffff1a', 1.5); }
  text(g, slot ? `LANDS IN PROJECTED BLOCK ${slot}` : 'BEYOND THE PROJECTED BLOCKS', 120, 160, 9.5, slot ? '#c9ffe6' : '#ffb59f', SANS, 'center', '800');
  footer(g, `TX ${shortTx(p.txid)}`, `${p.vsize} vB · FEE ${p.fee.toLocaleString('en-GB')} sats`);
  return c;
}
// Shown only until data exists: the name set in type on a panel. Never invented figures.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  steelBody(g, 'name' + sym, col.glow, col.glow + '99', 3, false); well(g, 24, 28, 192, 150, col.glow); fitText(g, col.name, 120, 100, 176, 26, INK, SANS, '900'); text(g, 'READING THE MEMPOOL', 120, 196, 12, '#9bb8aa');
  return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { bundled: 0, snapshotAt: SNAP.takenAt, done: true };
// The reel pools, rebuilt whenever the figures change. Which tile shows in a cell is chosen after the result, with Math.random only.
function rebuildPools() {
  const key = [D.source, D.tip.height, JSON.stringify(D.fees), D.mempool.count, D.mempool.vsize, JSON.stringify(D.blocks[0]), D.pending.length, D.pending[0] && D.pending[0].txid, D.whales.length, D.whales[0] && D.whales[0].txid, D.stuck.length].join('|');
  if (key === dataKey) return; dataKey = key;
  const bands = ['cherry', 'lemon', 'chip', 'block']; for (const s of bands) pools[s] = [0, 1, 2].map(v => ({ key: 'band', id: COLS[s].rate, num: COLS[s].rate, variant: v, tile: bandTile(s, v), bundled: true }));
  pools.artifact = D.whales.slice(0, 24).map(w => ({ key: 'whale', id: w.txid, num: w.btc, rec: w, tile: whaleTile(w), bundled: true }));
  pools.bitcoin = [{ key: 'next-block', id: D.tip.height + 1, num: D.blocks[0] ? D.blocks[0].nTx : 0, tile: nextBlockTile(), bundled: true }];
  pools.wild = [0, 1, 2].map(v => ({ key: 'rbf', id: v, num: v, tile: rbfTile(v), bundled: true }));
  pools.scatter = D.recent.map((b, i) => ({ key: 'fee-spike', id: b.height, num: b.height, rec: b, tile: spikeTile(b, i), bundled: true }));
  pools.vault = D.stuck.slice(0, 24).map(s => ({ key: 'stuck', id: s.txid, num: s.feeRate, rec: s, tile: stuckTile(s), bundled: true }));
  pools.chain = D.pending.slice(0, 40).map(p => ({ key: 'pending', id: p.txid, num: p.feeRate, rec: p, tile: pendingTile(p), bundled: true }));
  txTileCache.clear(); sources.bundled = Object.values(pools).reduce((a, p) => a + p.length, 0); screenDirty = true;
}
// Tiles for any stuck or pending record, cached: used by the boost and template scenes.
const txTileCache = new Map();
function tileForTx(rec, kind) { const k = `${kind}:${rec.txid}`; let t = txTileCache.get(k); if (!t) { t = kind === 'stuck' ? stuckTile(rec) : pendingTile(rec); txTileCache.set(k, t); if (txTileCache.size > 160) txTileCache.delete(txTileCache.keys().next().value); } return t; }
rebuildPools();

/* ---------- Faces: which tile a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: a green-phosphor radar display in a steel bezel ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3, FY = 866;
(function drawBase() { const g = baseLayer.getContext('2d'), r = seeded('radar');
  g.fillStyle = lin(g, 0, 0, 1400, 960, ['#031a10', '#02100a', '#04180e']); g.fillRect(0, 0, 1400, 960);
  // Radar: range rings, crosshair and bearing ticks centred behind the reels.
  g.save(); g.translate(700, RY + RH / 2); g.strokeStyle = PHOS; g.lineWidth = 1.2;
  for (let rr = 110; rr <= 880; rr += 110) { g.globalAlpha = rr % 220 ? .09 : .16; g.beginPath(); g.arc(0, 0, rr, 0, 7); g.stroke(); }
  g.globalAlpha = .12; g.beginPath(); g.moveTo(-760, 0); g.lineTo(760, 0); g.moveTo(0, -520); g.lineTo(0, 520); g.stroke();
  g.globalAlpha = .22; for (let a = 0; a < 72; a++) { const an = a * Math.PI / 36, l = a % 6 ? 8 : 18; g.beginPath(); g.moveTo(Math.cos(an) * 436, Math.sin(an) * 436); g.lineTo(Math.cos(an) * (436 + l), Math.sin(an) * (436 + l)); g.stroke(); }
  g.restore();
  g.fillStyle = '#ffffff05'; for (let y = 0; y < 960; y += 3) g.fillRect(0, y, 1400, 1);
  const panel = (x, y, w, h, hot) => { round(g, x, y, w, h, 12, '#020a06', hot ? PHOS : PHOS + '77', hot ? 3 : 2); round(g, x + 5, y + 5, w - 10, h - 10, 9, null, '#000000aa', 2); g.save(); g.beginPath(); g.roundRect(x + 6, y + 6, w - 12, h - 12, 8); g.clip(); g.strokeStyle = PHOS + '10'; g.lineWidth = 1; for (let gx = x + 20; gx < x + w; gx += 20) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx, y + h); g.stroke(); } for (let gy = y + 20; gy < y + h; gy += 20) { g.beginPath(); g.moveTo(x, gy); g.lineTo(x + w, gy); g.stroke(); } g.restore(); };
  panel(18, 14, 380, 172, false); panel(412, 14, 576, 172, true); panel(1002, 14, 380, 172, false);
  text(g, 'BITCOIN TIP', 208, 42, 18, '#7ee7b8', SANS, 'center', '800'); text(g, 'BLOCK FOUND JACKPOT', 700, 42, 22, '#c9ffe6', SANS, 'center', '800'); text(g, 'DAILY POT', 1192, 42, 18, '#7ee7b8', SANS, 'center', '800');
  // The reel window: set into a steel bezel, a phosphor line inside it.
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#010503', lin(g, 0, RY - 14, 0, RY + RH + 14, ['#9aa8a2', '#4a5752', '#7a8782', '#27312d']), 8);
  round(g, RX - 4, RY - 4, RW + 8, RH + 8, 12, null, PHOS + 'aa', 2);
  for (const [x, y] of [[RX - 20, RY - 20], [RX + RW + 20, RY - 20], [RX - 20, RY + RH + 20], [RX + RW + 20, RY + RH + 20]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fillStyle = lin(g, x - 9, y - 9, x + 9, y + 9, ['#b6c2bc', '#33403b']); g.fill(); g.strokeStyle = '#000a'; g.lineWidth = 2; g.stroke(); g.beginPath(); g.moveTo(x - 5, y + 2); g.lineTo(x + 5, y - 2); g.stroke(); }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#03120b99', '#05190f66', '#03120b99']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  // The live-fee readout well along the bottom.
  round(g, RX - 4, FY - 4, RW + 8, 50, 10, '#010603', PHOS + '66', 2);
  g.fillStyle = '#ffffff10'; g.fillRect(45, 912, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function highlightIndex(now) { return !spinning && !feature() && !scene && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;

// The radar sweep: a slow green wedge across the reel window, stepped like a real scope (about 10 frames a second, off with reduced motion).
function radarSweep(now) { if (!motionOK()) return; const a = ((Math.floor(now / 100) * 6) % 360) * Math.PI / 180 - Math.PI / 2, cx = 700, cy = RY + RH / 2;
  sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 14; k++) { sg.fillStyle = `rgba(20,241,149,${.05 * (1 - k / 14)})`; sg.beginPath(); sg.moveTo(cx, cy); sg.arc(cx, cy, 900, a - (k + 1) * .045, a - k * .045); sg.closePath(); sg.fill(); }
  sg.strokeStyle = 'rgba(20,241,149,.35)'; sg.lineWidth = 2; sg.beginPath(); sg.moveTo(cx, cy); sg.lineTo(cx + Math.cos(a) * 900, cy + Math.sin(a) * 900); sg.stroke(); sg.restore(); }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = AMBER; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#ffd27a', 5); sg.restore(); }
  }
  radarSweep(now);
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, '#c9ffe6', 4); sg.save(); sg.shadowColor = PHOS; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#c9ffe6c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = PHOS + '55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The last 21 rounds as a row of blocks, coloured by fee from cool blue to hot red by how well the round paid. It scrolls; it never fills or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 836;
  text(sg, 'LAST 21 BROADCASTS', x0 - 20, y + s / 2, 12, '#5f9c82', SANS, 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y, s, s, 2, e ? (e.win > 0 ? feeColor(1.5 + 8 * Math.min(8, e.win / Math.max(1, e.bet))) : '#17302a') : '#0b1812', i === n - 1 && e ? '#c9ffe6' : null, 1.5); } }
// The live-fee readout: the recommended fees, the queue and the projected next block, with the LIVE or SNAPSHOT badge.
function drawFeeStrip(now) { const f = D.fees, m = D.mempool, nb = D.blocks[0], b = dataBadge(), y = FY;
  const lamp = (label, v, x) => { sg.fillStyle = feeColor(v); sg.fillRect(x, y + 6, 6, 34); text(sg, label, x + 14, y + 14, 11, '#6fbf9d', SANS, 'left', '800'); text(sg, rateText(v), x + 14, y + 31, 22, feeColor(v), MONO, 'left', '900'); };
  lamp('FASTEST', f.fastestFee, 62); lamp('30 MIN', f.halfHourFee, 170); lamp('HOUR', f.hourFee, 270); lamp('ECONOMY', f.economyFee, 360); text(sg, 'sat/vB', 462, y + 31, 13, '#6fbf9d', SANS, 'left', '800');
  text(sg, `MEMPOOL  ${m.count.toLocaleString('en-GB')} TX · ${vbText(m.vsize)}`, 700, y + 14, 14, '#c9ffe6', MONO, 'left', '800'); text(sg, `QUEUED ≥10 sat/vB: ${vbText(m.vsizeAtLeast[10])}`, 700, y + 32, 12, '#6fbf9d', MONO, 'left', '700');
  if (nb) { text(sg, `NEXT BLOCK  ${nb.nTx.toLocaleString('en-GB')} TX`, 1040, y + 14, 14, GOLD, MONO, 'left', '800'); text(sg, nb.min != null ? `${rateText(nb.min)}–${rateText(nb.max)} sat/vB` : `MEDIAN ${rateText(nb.medianFee)} sat/vB`, 1040, y + 32, 12, '#d8c37a', MONO, 'left', '700'); }
  const bx = 1218; round(sg, bx, y + 8, 128, 30, 8, b.ok ? '#06361f' : '#3a2a06', b.ok ? PHOS : AMBER, 2); sg.beginPath(); sg.arc(bx + 18, y + 23, 5, 0, 7); sg.fillStyle = b.ok ? PHOS : AMBER; if (b.ok && motionOK() && Math.floor(now / 700) % 2) sg.fillStyle = '#0b8a56'; sg.fill(); text(sg, b.text, bx + 76, y + 24, 16, b.ok ? PHOS : AMBER, SANS, 'center', '900'); }

/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'RUSH HOUR', vault: 'ACCELERATE', chain: 'BLOCK TEMPLATE', jackpot: 'BLOCK FOUND', gamble: 'CONFIRM OR EVICT' };
const RULES = { free: 'Eight free spins. Every win pays 2×. Three more fee spikes add four spins.', vault: 'Nine real stuck transactions. Boost three. Each shoots into a block with a prize.', chain: 'Pending transactions pack into the block template. Any new one resets your three respins. Fill all fifteen to mine the block.', jackpot: 'Five NEXT BLOCK on the centre row. The block is mined and the whole meter is yours.', gamble: 'Will the transaction confirm or be evicted? Call it. Right doubles your win. Wrong evicts it.' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
// Accelerate prize tiers, named for fee urgency. Each prize is a multiple of the total bet.
const TIER = { 1: 'DUST', 2: 'ECONOMY', 3: 'STANDARD', 4: 'PRIORITY', 5: 'EXPRESS', 8: 'URGENT', 10: 'SURGE', 15: 'MAX FEE' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
const clamp01 = t => Math.max(0, Math.min(1, t));
let sceneQueue = [], hits = [], season = null, crateTx = [];
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { sweep(1.2, 0, .16, 200, 3000); [0, .18, .36, .54].forEach(t => { tone(660, .14, 'square', .05, t); tone(990, .14, 'square', .04, t + .07); }); drum(55, .5); [392, 523, 659, 784].forEach((n, k) => tone(n, .4, 'sawtooth', .03, .6 + k * .07)); }
  if (kind === 'sting-vault') { ping(1480); ping(1480, .35); ping(1976, .7); sweep(.9, 0, .1); drum(48, .4, .3); [196, 261, 329, 392].forEach((n, k) => tone(n, .5, 'triangle', .05, k * .09 + .2)); }
  if (kind === 'sting-chain') { for (let k = 0; k < 4; k++) hammer(k * .16, 1, 700 + k * 120); drum(52, .5, .5); [220, 277, 330, 440].forEach((n, k) => tone(n, .3, 'square', .03, k * .08 + .55)); }
  if (kind === 'sting-jackpot') { roar(2.1, 0, .22); drum(46, .6); drum(46, .6, .5); drum(46, .6, 1); drum(46, .7, 1.5); [262, 330, 392, 523, 659, 784, 1047].forEach((n, k) => { tone(n, .9, 'triangle', .09, 1.4 + k * .09); tone(n / 2, 1.1, 'sine', .05, 1.4 + k * .09); }); embers(40, 1.7); }
  if (kind === 'sting-gamble') { ping(880); tone(196, .6, 'sawtooth', .04, .3); tone(185, .6, 'sawtooth', .04, .3); sweep(.8, .1, .08); }
  if (kind === 'whoosh') { noise(.45, 1100, .7, .16); tone(240, .45, 'sine', .05, 0, 3); }
  if (kind === 'crack') { sweep(.35, 0, .2, 500, 4200); tone(700 + i * 50, .3, 'square', .05, .06, 2); drum(70, .25); }
  if (kind === 'reveal-big') { [784, 988, 1175, 1568].forEach((n, k) => tone(n, .4, 'triangle', .08, k * .06)); embers(18, .1); drum(60, .4); }
  if (kind === 'stamp') { hammer(0, 1.1, 300); drum(60, .35, .02); }
  if (kind === 'reset') { tone(1318.5, .15, 'sine', .07); tone(1760, .2, 'sine', .06, .08); }
  if (kind === 'tick') tone(1600 + (i % 6) * 60, .03, 'sine', .025);
  if (kind === 'roll') noise(.03, 2600, 5, .1);
  if (kind === 'land') { hammer(0, 1.2, 420); embers(8, .05); }
  if (kind === 'carve') { drum(80, .3); tone(300, .25, 'square', .04, 0, 2); noise(.2, 900, 2, .1); }
  if (kind === 'burn') { noise(1.1, 420, .8, .2, 0, 'lowpass'); tone(130, .9, 'sawtooth', .06, 0, .4); tone(90, 1, 'square', .04, .1, .5); }
  if (kind === 'launch') roar(5.5, 0, .26);
  if (kind === 'summary') { [659, 784, 1047].forEach((n, k) => tone(n, .35, 'triangle', .07, k * .08)); drum(62, .3); }
  if (kind === 'blockfound') { ping(1760, 0, .05); tone(220, .5, 'sine', .06); }
}
let musicTimer = 0;
// The Block Found theme: a slow thump underneath and a rising console arpeggio.
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [293.66, 349.23, 440, 587.33, 440, 349.23, 329.63, 392, 493.88, 659.25, 493.88, 392];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k++ % seq.length]; tone(n, .22, 'square', .035); if (k % 4 === 1) { drum(52, .35); tone(n / 4, .5, 'sine', .07); } if (k % 2) noise(.03, 6000, 4, .04); }, state.turbo ? 90 : 150); }
// The triggering cells, read from the settled grid.
function cellsOf(sym, centreOnly = false) { const out = []; state.grid.forEach((col, c) => col.forEach((s, r) => { if (s === sym && (!centreOnly || r === 1)) out.push([c, r]); })); return out; }
function startScene(kind, data = {}, stage = 'trigger') {
  stopAuto(); hideBar(); scene = { kind, stage, t0: performance.now(), data, reveal: {}, stampAt: {}, resetAt: 0, lastLeft: 3 };
  if (stage === 'trigger') { sfx(`sting-${kind}`); if (motionOK() && kind !== 'gamble') particles(kind === 'jackpot' ? 90 : 30); }
  if (kind === 'jackpot' && stage !== 'outro') jackpotMusic(false);
  status(`${TITLES[kind]}${stage === 'trigger' ? '!' : ''}`); renderBar(); update();
}
function nextScene() { scene = null; jackpotMusic(false); hideBar(); const n = sceneQueue.shift(); if (n) { startScene(n.kind, n.data || {}, n.stage || 'trigger'); return; }
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  // A spin still pending ends Rush Hour itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } seasonOutro(); return; }
  if (state.free > 0) { status(`${state.free} RUSH HOUR SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (stage === 'play' && scene.kind === 'jackpot') sfx('launch'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2600 : 1500) * speed();
// The first closed crate, so one big button can open them in order.
const nextCrate = f => [0, 1, 2, 3, 4, 5, 6, 7, 8].find(i => !f.picks.includes(i));
// The primary action: one button drives every stage (Spin, Space, the cabinet's ETCH, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { seasonOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage('intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { season = { t0: performance.now(), retriggers: 0, best: 0, etched: [], carve: null }; scene = null; renderBar(); update(); carve(); spin(); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else if (f) pickCrate(nextCrate(f)); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'RUSH' : broke ? 'GET LAYR' : 'BROADCAST'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'LAUNCH' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `BOOST · ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'STRIKING'; }
  return 'CONTINUE';
}
const canSkip = () => (!scene && state.freeActive && !spinning) || !!scene && scene.stage !== 'outro' && !(scene.kind === 'gamble' && scene.stage === 'play' && !scene.data.result);
// Skip: resolve everything the engine already dealt, instantly, and land on the outro with the same total.
function skipScene() {
  if (!scene && state.freeActive && !spinning && !locked()) { clearTimeout(scheduleFree.t); runFreeInstantly(); seasonOutro(true); return; }
  if (!scene || locked()) return; const { kind, stage } = scene;
  if (kind === 'gamble') { if (stage !== 'play') { keepWin(); return; } scene.t0 -= 99999; setStage('outro'); return; }
  if (kind === 'jackpot') { setStage('outro'); return; }
  if (kind === 'free') { if (spinning || state.pending) return; runFreeInstantly(); seasonOutro(true); return; }
  const f = feature(); if (!f) { nextScene(); return; }
  if (kind === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) { E.pick(state, i); scene.reveal[i] = 0; } save(); }
  if (kind === 'chain') { while (!E.featureDone(f)) E.respin(state); save(); }
  collectScene(true);
}
// Free spins played with no animation: each one is still a full engine round (start, settle, features), committed one by one.
function runFreeInstantly() {
  season = season || { t0: performance.now(), retriggers: 0, best: 0, etched: [], carve: null };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state, roundRng()); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordRoundCameos(r); carve(true);
    if (r.triggers.free) season.retriggers++; season.best = Math.max(season.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; save();
}
function seasonOutro(skipped = false) { const r = E.endFree(state); if (!r) { if (spinning || state.pending) { update(); return; } if (sceneQueue.length || feature()) nextScene(); else { scene = null; update(); } return; } save(); startScene('free', { total: r.total, count: r.count, retriggers: season ? season.retriggers : 0, best: season ? season.best : 0, etched: season ? season.etched.map(e => e.r) : [], skipped }, 'outro'); sfx('summary'); season = null; }
function collectScene(skipped = false) {
  const f = feature(); if (!f) return; const picks = f.type === 'vault' ? f.picks.map(i => f.awards[i]) : null, cells = f.type === 'chain' ? f.frames[f.index].cells.filter(Boolean).length : 0, respins = f.type === 'chain' ? f.frames.length - 1 : 0;
  const opened = f.type === 'vault' ? f.picks.map(i => crateTx[i] || null) : null, locked_ = f.type === 'chain' ? f.frames[f.index].cells.map((v, i) => v ? { v, tx: tabletTx(f, i) } : null) : null;
  const c = E.collect(state); if (!c) return; save(); winUntil = performance.now() + 4000;
  if (!skipped) { sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 30); }
  if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', data: { amount: c.jackpotWin, fromGrab: true } });
  crateTx = [];
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, opened, tablet: locked_, cells, respins, bet: f.bet, skipped }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { const nowT = performance.now(); if (scene.rollEnd && nowT < scene.rollEnd) return; const fr0 = f.frames[f.index], before = fr0.left, openBefore = []; fr0.cells.forEach((v, i) => { if (!v) openBefore.push(i); }); const fr = E.respin(state); save();
    // The result is already committed; the slots now roll real pending transactions and stop one by one (column by column, row by row), the winners stamping in as they stop.
    const mo = motionOK(), sp = speed(), stopAt = i => nowT + (mo ? 700 + (i % 5) * 120 + Math.floor(i / 5) * 70 : 250) * sp; let end = nowT + 250 * sp; scene.rollCells = {}; openBefore.forEach(i => { const st = stopAt(i); scene.rollCells[i] = st; if (st > end) end = st; });
    scene.rollAt = nowT; scene.rollEnd = end; scene.leftBefore = before; chainFlash = end; sound('respin');
    openBefore.forEach(i => { const d = Math.max(0, scene.rollCells[i] - nowT); if (fr.added.includes(i)) { scene.stampAt[i] = scene.rollCells[i]; setTimeout(() => sfx('stamp'), d); } else setTimeout(() => sfx('tick', i), d); });
    if (fr.added.length && before < 3) { scene.resetAt = end + 100; setTimeout(() => sfx('reset'), Math.max(0, end - nowT) + 250); }
    renderBar(); update(); }
  else toast('Boost three transactions first.'); }
function pickCrate(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f || i == null) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); sfx('crack', i); if (motionOK()) { const [x, y, w, h] = capsuleRect(i); spark(x + 100, y + h * .6, 22, { spread: Math.PI * 1.6, v: 340 }); shake(5); } if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), 520 * speed()); else setTimeout(() => sound('pick', i), 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
// Confirm or Evict. The call maps onto the engine's even/odd draw: etch = even, burn = odd. The engine's own 50/50 decides the fate.
const CALL = { etch: 'even', burn: 'odd' };
function callGamble(call) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, CALL[call], gambleRng(CALL[call])); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, call, fate: r.parity === 'even' ? 'etch' : 'burn' }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }
// Real stuck transactions for the Accelerate boosts. Cosmetic: chosen with Math.random after the prizes are fixed.
function pickStuck(except = []) { const all = D.stuck.length ? D.stuck : [{ txid: '0'.repeat(64), feeRate: 1, vsize: 141, fee: 141 }], pool = all.filter(r => !except.includes(r)), p = pool.length ? pool : all; return p[Math.floor(Math.random() * p.length)]; }
// Which real pending transaction sits in template cell i of a hold-and-respin round: a hash of the round id, so none repeats within one template.
const tabletOrders = new Map();
function tabletTx(f, i) { const all = D.pending.length ? D.pending : [{ txid: '0'.repeat(64), feeRate: 1, vsize: 141, fee: 141 }], id = f.roundId || 'template'; let order = tabletOrders.get(id);
  if (!order) { order = all.map((r, k) => [hashStr(`${id}:${k}`), r]).sort((a, b) => a[0] - b[0]).map(x => x[1]); tabletOrders.set(id, order); if (tabletOrders.size > 8) tabletOrders.delete(tabletOrders.keys().next().value); }
  return order[i % order.length]; }
// Rush Hour stacks a new projected block after every spin. The block's fee is the live next-block median, climbing as the rush builds.
function carve(quiet = false) { if (!season) return; const k = season.etched.length, nb = D.blocks[k % Math.max(1, D.blocks.length)] || { medianFee: 2 }, e = { t0: performance.now(), rate: Math.max(.4, nb.medianFee) * (1 + k * 1.6) }; season.etched.push(e); season.carve = e;
  if (!quiet) { sfx('carve'); spark(700, 820, 26, { spread: Math.PI * 1.4, v: 300 }); shake(3); } screenDirty = true; }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
// Sparks and the screen shake are cosmetic and use Math.random; they never touch the engine.
let sparks = [], shakeAmp = 0, shakeAt = 0;
function spark(x, y, n = 8, o = {}) { if (!motionOK()) return; const t = performance.now(); for (let i = 0; i < n; i++) { const a = (o.dir != null ? o.dir : -Math.PI / 2) + (Math.random() - .5) * (o.spread || Math.PI * 1.2), v = (o.v || 260) * (.4 + Math.random() * .9); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: t, life: (o.life || 750) * (.6 + Math.random() * .8), s: (o.s || 3) * (.6 + Math.random() * .8), c: o.c || (Math.random() < .5 ? PHOS : '#c9ffe6') }); } if (sparks.length > 420) sparks.splice(0, sparks.length - 420); }
function shake(a = 8) { if (!motionOK()) return; shakeAmp = a; shakeAt = performance.now(); }
function drawSparks(now) { if (!sparks.length) return; sparks = sparks.filter(p => now - p.t0 < p.life); sg.save(); sg.globalCompositeOperation = 'lighter';
  for (const p of sparks) { const t = (now - p.t0) / 1000, k = 1 - (now - p.t0) / p.life; sg.globalAlpha = Math.max(0, k); sg.fillStyle = p.c; sg.beginPath(); sg.arc(p.x + p.vx * t, p.y + p.vy * t + 350 * t * t, p.s * (.4 + k * .6), 0, 7); sg.fill(); } sg.restore(); }
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, ['#7dffc8', PHOS, '#0b8a56']) : '#0b1a13', primary ? '#d8fff0' : '#2f8f68', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#02140b' : '#c9ffe6', SANS, 'center', '900'); hits.push({ x, y, w, h, fn }); }
function skipChip() { if (canSkip()) button('SKIP ›', RX + RW - 150, RY + RH + 10, 130, 46, skipScene, false); }
function wrapText(s, x, y, maxW, lh, color, size, align = 'center') { sg.font = `700 ${size}px ${SANS}`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, SANS, align, '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, SANS, align, '700'); }
// A steel console panel with a phosphor edge.
function slab(x, y, w, h, o = {}) { const r = o.r ?? 14; sg.save(); sg.globalAlpha = o.alpha ?? 1; if (o.glow) { sg.shadowColor = o.glow; sg.shadowBlur = 26; }
  round(sg, x, y, w, h, r, lin(sg, x, y, x, y + h, ['#26342f', '#15211c', '#0c1511']), o.edge || '#5f7a6e', 3); sg.shadowBlur = 0; round(sg, x + 5, y + 5, w - 10, h - 10, Math.max(2, r - 4), null, '#000000aa', 2);
  if (o.seam !== false) { sg.strokeStyle = (o.seamColor || PHOS) + '66'; sg.lineWidth = 2; sg.beginPath(); sg.moveTo(x + r, y + h - 3); sg.lineTo(x + w - r, y + h - 3); sg.stroke(); } sg.restore(); }
// A dark phosphor field with a slow drifting grid and a glow rising from the bottom edge.
function field(x, y, w, h, now, tint = '20,241,149', k = 1) { const g = sg, t = motionOK() ? now : 0; g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = lin(g, 0, y, 0, y + h, ['#010503', '#03120b', '#062418']); g.fillRect(x, y, w, h);
  g.strokeStyle = `rgba(${tint},.07)`; g.lineWidth = 1; const off = (t / 40) % 40; for (let gx = x - 40 + off; gx < x + w; gx += 40) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx, y + h); g.stroke(); } for (let gy = y; gy < y + h; gy += 40) { g.beginPath(); g.moveTo(x, gy); g.lineTo(x + w, gy); g.stroke(); }
  g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const bx = x + (((i * .23 + .1 + Math.sin(t / 3200 + i * 2) * .04) % 1 + 1) % 1) * w, by = y + h + 10 + Math.sin(t / 1700 + i) * 14, rr = h * .6, rg = g.createRadialGradient(bx, by, 0, bx, by, rr); rg.addColorStop(0, `rgba(${tint},${.28 * k})`); rg.addColorStop(1, `rgba(${tint},0)`); g.fillStyle = rg; g.fillRect(x, y, w, h); } g.restore(); }
// Little transaction squares drifting up the screen, coloured by fee, from the clock only.
function txRain(now, n = 26, alpha = .6, x = RX, y = RY, w = RW, h = RH, hot = false) { if (!motionOK()) return; sg.save(); sg.beginPath(); sg.rect(x, y, w, h); sg.clip(); sg.globalCompositeOperation = 'lighter';
  for (let k = 0; k < n; k++) { const sp = 28 + (hashStr('es' + k) % 50), px = x + (hashStr('ex' + k) % w) + Math.sin(now / 900 + k) * 14, py = y + h - ((now / 1000 * sp + (hashStr('ey' + k) % h)) % (h + 40)) + 20, s = 4 + (k % 3) * 2; sg.globalAlpha = alpha * (.35 + .65 * ((k * 7) % 5) / 5); sg.fillStyle = feeColor(hot ? 25 + (k % 5) * 30 : .6 + (k % 7) * 3); sg.fillRect(px, py, s, s); } sg.restore(); }
// Glowing letters. p = how much has been revealed (0..1); the reveal edge is white-hot, like a scope trace.
function glowText(s, x, y, size, p = 1, now = 0, o = {}) {
  sg.save(); sg.font = `900 ${size}px ${o.font || SANS}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; const w = sg.measureText(s).width, x0 = x - w / 2;
  sg.fillStyle = '#000000aa'; sg.fillText(s, x + 2, y + 3); sg.fillStyle = o.ghost || '#0f2a20'; sg.fillText(s, x, y);
  if (p > 0) { sg.save(); sg.beginPath(); sg.rect(x0 - 12, y - size, w * p + 12, size * 2); sg.clip(); const gr = sg.createLinearGradient(0, y - size * .5, 0, y + size * .5); (o.stops || ['#e9fff6', '#14f195', '#0b9c62']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c));
    sg.shadowColor = o.glow || PHOS; sg.shadowBlur = o.blur ?? size * .35; sg.fillStyle = gr; sg.fillText(s, x, y);
    if (p < 1) { sg.shadowBlur = 0; const eg = sg.createLinearGradient(x0 + w * p - 150, 0, x0 + w * p, 0); eg.addColorStop(0, '#e9fff600'); eg.addColorStop(1, '#e9fffee0'); sg.fillStyle = eg; sg.fillText(s, x, y); } sg.restore(); }
  sg.restore();
  if (p > 0 && p < 1 && motionOK()) { const ex = x0 + w * p; sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(ex, y, 0, ex, y, size * .6); rg.addColorStop(0, 'rgba(220,255,240,.9)'); rg.addColorStop(1, 'rgba(20,241,149,0)'); sg.fillStyle = rg; sg.fillRect(ex - size, y - size, size * 2, size * 2); sg.restore(); if (Math.floor(now / 50) !== Math.floor((now - 17) / 50)) spark(ex, y + size * .2, 2, { v: 180, spread: Math.PI, dir: -Math.PI / 2, life: 450 }); }
}
// The fee chart: the median fee of the last blocks (real), then the climb. `heat` 0..1 is how far the rush has climbed.
function drawFeeChart(x, y, w, h, now, heat, o = {}) { const g = sg; g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.strokeStyle = '#ffffff12'; g.lineWidth = 1; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(x, y + h * i / 6); g.lineTo(x + w, y + h * i / 6); g.stroke(); }
  const list = D.recent.slice().reverse().map(b => b.medianFee), top = Math.max(4, ...list) * 1.15, n = list.length, realW = w * (o.realShare ?? .6), lgv = v => Math.log(1 + v) / Math.log(1 + top);
  const pts = list.map((v, i) => [x + i / Math.max(1, n - 1) * realW, y + h - 8 - lgv(v) * h * .5]); const [lx, ly] = pts[pts.length - 1];
  const ex = x + w - 6, ey = y + h * (1 - (.62 + .34 * heat)), climb = (t) => { const e = t * t * (3 - 2 * t); return [lx + (ex - lx) * t, ly + (ey - ly) * e]; };
  const grad = g.createLinearGradient(0, y + h, 0, y); [[0, 'rgba(47,123,255,.5)'], [.35, 'rgba(61,220,132,.5)'], [.6, 'rgba(255,210,63,.55)'], [1, 'rgba(255,59,59,.7)']].forEach(([s, c]) => grad.addColorStop(s, c));
  g.beginPath(); g.moveTo(pts[0][0], y + h); pts.forEach(([px, py]) => g.lineTo(px, py)); for (let k = 1; k <= 24; k++) { const [cx, cy] = climb(k / 24); g.lineTo(cx, cy); } g.lineTo(ex, y + h); g.closePath(); g.fillStyle = grad; g.globalAlpha = o.alpha ?? 1; g.fill(); g.globalAlpha = 1;
  g.lineWidth = 3; g.lineJoin = 'round'; g.strokeStyle = '#c9ffe6'; g.shadowColor = PHOS; g.shadowBlur = 8; g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke();
  g.setLineDash([8, 6]); g.strokeStyle = heat > 0 ? '#ff6b5a' : '#6fbf9d'; g.shadowColor = '#ff3b3b'; g.beginPath(); g.moveTo(lx, ly); for (let k = 1; k <= 24; k++) { const [cx, cy] = climb(k / 24); g.lineTo(cx, cy); } g.stroke(); g.setLineDash([]); g.shadowBlur = 0;
  g.beginPath(); g.arc(lx, ly, 5, 0, 7); g.fillStyle = '#fff'; g.fill();
  if (o.labels !== false) { text(g, 'MEDIAN FEE · LAST 15 BLOCKS (REAL)', x + 12, y + 14, 12, '#6fbf9d', SANS, 'left', '800'); text(g, `${rateText(list[list.length - 1])} sat/vB`, lx - 6, ly - 16, 13, '#e9fff6', MONO, 'right', '800'); if (heat > 0) text(g, 'RUSH ▲', ex - 8, ey - 14, 16, '#ff8a7a', SANS, 'right', '900'); }
  g.restore(); }
// A row of the projected blocks (from the live projected next blocks), blending toward red as the rush builds.
function drawBlockRow(x, y, s, count, now, heat, o = {}) { const nb = Math.max(count, 1), gap = o.gap ?? 12;
  for (let i = 0; i < count; i++) { const b = D.blocks[i % Math.max(1, D.blocks.length)] || { medianFee: 2 }, red = clamp01(heat * 1.6 - i * .08), rate = Math.max(.3, b.medianFee) * (1 + red * 40), drop = o.t0s && o.t0s[i] ? ease((now - o.t0s[i]) / 380) : 1, bx = x + i * (s + gap), by = y + (1 - drop) * -50;
    sg.save(); sg.globalAlpha = drop; blockShape(sg, bx, by, s, rate, { glow: red > .4 ? 16 : 6, seed: 'row' + i, grid: 3 }); sg.restore(); } }
// The block-shaped rocket: a steel rocket with the NEXT BLOCK tile set in its porthole.
function drawRocket(cx, cy, sc, now, flame = 1, tilt = 0) { sg.save(); sg.translate(cx, cy); sg.rotate(tilt); sg.scale(sc, sc);
  if (flame > 0) { const fl = 50 + flame * 110 + (motionOK() ? Math.sin(now / 40) * 16 : 0); sg.save(); sg.globalCompositeOperation = 'lighter'; const gr = sg.createLinearGradient(0, 76, 0, 76 + fl); gr.addColorStop(0, '#f0fff8'); gr.addColorStop(.3, '#14f195'); gr.addColorStop(1, 'rgba(20,241,149,0)'); sg.fillStyle = gr; sg.beginPath(); sg.moveTo(-28, 76); sg.quadraticCurveTo(-34, 76 + fl * .6, 0, 76 + fl); sg.quadraticCurveTo(34, 76 + fl * .6, 28, 76); sg.closePath(); sg.fill(); sg.restore(); }
  sg.fillStyle = lin(sg, -80, 0, -30, 0, ['#0b6e48', '#14b878']); sg.beginPath(); sg.moveTo(-38, 10); sg.lineTo(-84, 96); sg.lineTo(-32, 76); sg.closePath(); sg.fill(); sg.beginPath(); sg.moveTo(38, 10); sg.lineTo(84, 96); sg.lineTo(32, 76); sg.closePath(); sg.fill();
  sg.shadowColor = '#000'; sg.shadowBlur = 14; sg.beginPath(); sg.moveTo(0, -140); sg.bezierCurveTo(50, -92, 52, 0, 38, 80); sg.lineTo(-38, 80); sg.bezierCurveTo(-52, 0, -50, -92, 0, -140); sg.closePath(); sg.fillStyle = lin(sg, -50, 0, 50, 0, ['#5d6b65', '#eef4f1', '#b3c0ba', '#4a5651']); sg.fill(); sg.shadowBlur = 0;
  sg.save(); sg.clip(); sg.fillStyle = PHOS; sg.fillRect(-60, -150, 120, 62); sg.fillStyle = '#0b8a56'; sg.fillRect(-60, 44, 120, 14); sg.restore();
  sg.beginPath(); sg.arc(0, -34, 33, 0, 7); sg.fillStyle = '#1b2521'; sg.fill(); sg.save(); sg.beginPath(); sg.arc(0, -34, 28, 0, 7); sg.clip(); sg.drawImage(tileFor('bitcoin', 0), -32, -66, 64, 64); sg.restore(); sg.lineWidth = 5; sg.strokeStyle = '#a3b2ab'; sg.beginPath(); sg.arc(0, -34, 31, 0, 7); sg.stroke(); sg.restore(); }
const STARS = (() => { const r = seeded('sky'); return Array.from({ length: 110 }, () => ({ x: r() * 1400, y: r() * 960, s: .6 + r() * 1.8, z: .2 + r() })); })();
// The launch night over the console, with the gantry. scroll = how far the rocket has climbed (stars stream downward).
function skyAndPad(now, scroll) { const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#010406', '#03140d', '#06301f', '#0a4a30']); g.fillRect(0, 0, 1400, 960);
  g.strokeStyle = PHOS + '12'; g.lineWidth = 1; for (let rr = 150; rr <= 900; rr += 150) { g.beginPath(); g.arc(700, 960, rr, Math.PI, 0); g.stroke(); }
  g.fillStyle = '#fff'; for (const s of STARS) { g.globalAlpha = .3 + .5 * s.z; g.fillRect(s.x, (s.y + scroll * s.z * .6) % 960, s.s, s.s); } g.globalAlpha = 1;
  g.fillStyle = '#04100b'; g.fillRect(0, 880 + scroll * .5, 1400, 120); g.fillStyle = lin(g, 0, 880 + scroll * .5, 0, 960 + scroll * .5, [PHOS + '99', '#0b8a5600']); g.fillRect(0, 880 + scroll * .5, 1400, 6);
  g.strokeStyle = '#2c3f37'; g.lineWidth = 6; const gx = 1120; g.beginPath(); g.moveTo(gx, 880 + scroll * .5); g.lineTo(gx, 520 + scroll * .5); g.moveTo(gx + 40, 880 + scroll * .5); g.lineTo(gx + 40, 520 + scroll * .5); g.stroke(); g.lineWidth = 3; for (let yy = 540; yy < 880; yy += 40) { g.beginPath(); g.moveTo(gx, yy + scroll * .5); g.lineTo(gx + 40, yy + 40 + scroll * .5); g.stroke(); } }

const rushHeat = () => season ? clamp01((season.etched.length + (season.retriggers || 0) * 2) / 11) : .45;
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { field(RX, RY, RW, RH, now, '255,59,59', dim); drawFeeChart(RX, RY, RW, RH, now, rushHeat(), { alpha: .5 * dim }); txRain(now, 22, .5 * dim, RX, RY, RW, RH, true); }
  if (kind === 'vault') { field(RX, RY, RW, RH, now, '255,122,89', dim); g.save(); g.translate(700, RY + RH / 2); g.strokeStyle = PHOS; g.lineWidth = 1.2; for (let rr = 110; rr <= 660; rr += 110) { g.globalAlpha = .12 * dim; g.beginPath(); g.arc(0, 0, rr, 0, 7); g.stroke(); } g.restore(); }
  if (kind === 'chain') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#03101a', '#041c24']); g.fillRect(RX, RY, RW, RH); g.strokeStyle = '#2f9bff'; for (let gx = RX; gx < RX + RW; gx += 30) { g.globalAlpha = ((gx - RX) / 30) % 5 ? .07 * dim : .16 * dim; g.beginPath(); g.moveTo(gx, RY); g.lineTo(gx, RY + RH); g.stroke(); } for (let gy = RY; gy < RY + RH; gy += 30) { g.globalAlpha = ((gy - RY) / 30) % 5 ? .07 * dim : .16 * dim; g.beginPath(); g.moveTo(RX, gy); g.lineTo(RX + RW, gy); g.stroke(); } g.globalAlpha = 1; }
  if (kind === 'jackpot') skyAndPad(now, 0);
  if (kind === 'gamble') { field(RX, RY, RW, RH, now, '255,179,71', .9 * dim); for (let i = 0; i < 6; i++) { const b = D.blocks[i] || { medianFee: 2 }; g.save(); g.globalAlpha = .55 * dim; blockShape(g, RX + 70 + i * 120, RY + 24, 80, Math.max(.4, b.medianFee), { glow: 4, seed: 'q' + i, grid: 3 }); g.restore(); } }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.4) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 40 + (1 - k) * -140;
  slab(RX, y - 86, RW, 172, { r: 0, glow: ACCENT }); sg.fillStyle = ACCENT; sg.fillRect(RX, y - 90, RW, 5); sg.fillRect(RX, y + 85, RW, 5);
  const p = motionOK() ? clamp01((t - .08) / .62) : 1; glowText(title, 700, y - 14, 84, p, now); if (p >= 1 && !scene.struck) { scene.struck = true; shake(9); sfx('land'); spark(700, y, 40, { spread: Math.PI * 2, v: 420 }); }
  text(sg, sub, 700, y + 54, 23, '#c9ffe6', SANS, 'center', '800'); sg.restore(); }
function triggerSub(kind, cells) { const r = lastResult;
  if (kind === 'free') return `${cells.length} FEE SPIKES${r && r.scatterPay ? ` · PAY ${fmt(r.scatterPay)} LAYR` : ''} · 8 FREE SPINS AT 2×`;
  if (kind === 'vault') return `${cells.length} STUCK TRANSACTIONS · NINE ARE WAITING TO BE BOOSTED`;
  if (kind === 'chain') return `${cells.length} PENDING TRANSACTIONS · PACK THEM INTO THE TEMPLATE`;
  if (kind === 'jackpot') return 'FIVE NEXT BLOCKS ON THE CENTRE ROW';
  return `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL`; }
// A pending transaction card as the gamble's subject. mode: 'ready' (waiting in the queue), 'confirmed' (mined), 'evicted' (dropped).
function drawTxCard(cx, cy, s, now, mode, p = 1) { if (s <= 2) return; const tile = (pools.chain[0] && pools.chain[0].tile) || names.chain, mo = motionOK(); sg.save(); sg.translate(cx, cy);
  if (mode === 'ready') sg.translate(0, mo ? Math.sin(now / 420) * 5 : 0);
  if (mode === 'confirmed') { sg.shadowColor = PHOS; sg.shadowBlur = 40 + (mo ? 20 * Math.sin(now / 120) : 0); }
  if (mode === 'evicted') { sg.globalAlpha = 1 - clamp01(p) * .75; sg.translate(mo ? Math.sin(now / 30) * 6 * (1 - p) : 0, clamp01(p) * 90); sg.rotate(clamp01(p) * .35); }
  sg.drawImage(tile, -s / 2, -s / 2, s, s);
  if (mode === 'evicted') { sg.globalCompositeOperation = 'source-atop'; }
  sg.restore();
  sg.save(); sg.translate(cx, cy); if (mode === 'confirmed') { sg.strokeStyle = PHOS; sg.lineWidth = 12; sg.lineCap = 'round'; sg.lineJoin = 'round'; sg.shadowColor = PHOS; sg.shadowBlur = 20; sg.beginPath(); sg.moveTo(-s * .26, s * .02); sg.lineTo(-s * .06, s * .22); sg.lineTo(s * .3, -s * .2); sg.globalAlpha = clamp01(p * 2); sg.stroke(); }
  if (mode === 'evicted') { sg.globalAlpha = clamp01(p * 2) * (1 - clamp01(p - .6)); sg.strokeStyle = ALERT; sg.lineWidth = 12; sg.lineCap = 'round'; sg.shadowColor = ALERT; sg.shadowBlur = 20; sg.beginPath(); sg.moveTo(-s * .24, -s * .24 + clamp01(p) * 90); sg.lineTo(s * .24, s * .24 + clamp01(p) * 90); sg.moveTo(s * .24, -s * .24 + clamp01(p) * 90); sg.lineTo(-s * .24, s * .24 + clamp01(p) * 90); sg.stroke(); }
  sg.restore(); }

// stage 1: the trigger
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(1,8,5,${Math.min(.7, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  if (motionOK() && t < .5) { sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(700, RY + RH, 0, 700, RY + RH, 700); rg.addColorStop(0, `rgba(20,241,149,${.5 * t * 2})`); rg.addColorStop(1, 'rgba(20,241,149,0)'); sg.fillStyle = rg; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : kind === 'free' ? ALERT : PHOS; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore();
    if (!scene.lit) scene.lit = new Set(); if (!scene.lit.has(k)) { scene.lit.add(k); spark(RX + c * CW + CW / 2, RY + r * RHT + RHT / 2, 14, { spread: Math.PI * 2, v: 220 }); } });
  if (kind === 'gamble') drawTxCard(700, RY + RH / 2 - 40, 130 * ease(t * 2), now, 'ready');
  if (t > .45) titleCard(TITLES[kind], triggerSub(kind, cells), now, (t - .45) * 1.5);
  if (t >= 1) setStage('intro'); }

// stage 2: the intro (a short themed transition, one line of rules, a Start button)
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (700 * speed()), a = Math.min(1, t), mo = motionOK();
  backdrop(kind, now); sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.globalAlpha = a; const yIn = mo ? (1 - ease(t)) * 40 : 0, hx = 330, hy = RY + 250 + yIn;
  if (kind === 'free') { slab(hx - 190, hy - 150, 380, 290, { glow: ALERT, edge: '#a04a44' }); drawFeeChart(hx - 176, hy - 136, 352, 186, now, mo ? .5 + .3 * Math.sin(now / 500) : .6, { labels: false, realShare: .55 }); drawBlockRow(hx - 144, hy + 68, 38, 6, now, .8, { gap: 12 }); }
  if (kind === 'vault') { const sway = mo ? Math.sin(now / 520) * .05 : 0, pt = (pools.vault[0] && pools.vault[0].tile) || names.vault; sg.save(); sg.translate(hx, hy - 30); sg.rotate(sway); sg.save(); sg.globalCompositeOperation = 'lighter'; const fl = 70 + (mo ? Math.sin(now / 50) * 14 : 0), gr = sg.createLinearGradient(0, 96, 0, 96 + fl); gr.addColorStop(0, '#f0fff8'); gr.addColorStop(.3, PHOS); gr.addColorStop(1, 'rgba(20,241,149,0)'); sg.fillStyle = gr; sg.beginPath(); sg.moveTo(-40, 96); sg.quadraticCurveTo(-50, 96 + fl * .6, 0, 96 + fl); sg.quadraticCurveTo(50, 96 + fl * .6, 40, 96); sg.fill(); sg.restore(); sg.shadowColor = '#ff7a59'; sg.shadowBlur = 30; sg.drawImage(pt, -100, -100, 200, 200); sg.restore(); }
  if (kind === 'chain') { slab(hx - 190, hy - 150, 380, 290, { glow: '#2f9bff', edge: '#3a7fb0' }); const filled = mo ? Math.floor(now / 380) % 16 : 8; for (let i = 0; i < 15; i++) { const x = hx - 174 + (i % 5) * 70, y = hy - 134 + Math.floor(i / 5) * 86, on = i < filled, rate = (D.pending[i % Math.max(1, D.pending.length)] || { feeRate: 3 }).feeRate; round(sg, x, y, 62, 74, 6, on ? feeColor(rate, .85) : '#0a1a22', on ? '#e9fff6' : '#2f5f75', on ? 2 : 1.5); if (on) { sg.fillStyle = '#02140b'; sg.fillRect(x + 8, y + 10, 46, 5); sg.fillRect(x + 8, y + 22, 30, 5); text(sg, rateText(rate), x + 31, y + 56, 13, '#02140b', MONO, 'center', '900'); } } }
  if (kind === 'jackpot') { sg.fillStyle = '#04100b'; sg.fillRect(RX, RY + RH - 80, RW, 80); sg.fillStyle = PHOS + 'aa'; sg.fillRect(RX, RY + RH - 80, RW, 4); drawRocket(hx + (mo ? Math.sin(now / 35) * 1.5 : 0), hy - 20, 1.2, now, .35 + (mo ? .15 * Math.sin(now / 90) : 0)); }
  if (kind === 'gamble') { sg.save(); sg.translate(hx, hy - 10); sg.strokeStyle = AMBER; sg.lineWidth = 2; for (let k = 0; k < 3; k++) { const ph = mo ? ((now / 1400 + k / 3) % 1) : k / 3; sg.globalAlpha = (1 - ph) * .5; sg.beginPath(); sg.arc(0, 0, 90 + ph * 130, 0, 7); sg.stroke(); } sg.restore(); drawTxCard(hx, hy - 10, 170, now, 'ready'); }
  glowText(TITLES[kind], 890, RY + 150 + yIn, kind === 'gamble' ? 56 : kind === 'chain' ? 58 : 62, mo ? clamp01(t * 1.6) : 1, now);
  wrapText(RULES[kind], 890, RY + 232 + yIn, 640, 30, '#c9ffe6', 26);
  sg.restore();
  if (kind === 'gamble') { text(sg, `${fmt(scene.data.stake)} LAYR RIDES ON IT`, 890, RY + 330, 24, AMBER, SANS, 'center', '900'); button('CONFIRM', 640, RY + 380, 190, 84, () => callGamble('etch')); button('EVICT', 850, RY + 380, 170, 84, () => callGamble('burn')); button('KEEP WIN', 1040, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'LAUNCH' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }

/* --- Accelerate: nine real stuck transactions, boost three --- */
function drawBoostCard(x, y, w, h, rec, t, now) { // t: 0..1 of the lift-off
  const u = ease(t), size = h - 24, ty = y + 12 - u * (h + 50); sg.save(); sg.beginPath(); sg.rect(x, y - 70, w, h + 70); sg.clip();
  sg.save(); sg.globalCompositeOperation = 'lighter'; const fl = 30 + 110 * u, fx = x + 12 + size / 2, gr = sg.createLinearGradient(0, ty + size, 0, ty + size + fl); gr.addColorStop(0, '#f0fff8'); gr.addColorStop(.3, PHOS); gr.addColorStop(1, 'rgba(20,241,149,0)'); sg.fillStyle = gr; sg.beginPath(); sg.moveTo(fx - 36, ty + size - 6); sg.quadraticCurveTo(fx - 44, ty + size + fl * .6, fx, ty + size + fl); sg.quadraticCurveTo(fx + 44, ty + size + fl * .6, fx + 36, ty + size - 6); sg.fill();
  sg.strokeStyle = '#c9ffe6'; sg.lineWidth = 2; for (let k = 0; k < 7; k++) { const sx = x + 14 + (k / 6) * (size), sy = ty + size + 10 + (k % 3) * 14; sg.globalAlpha = .5 * (1 - u * .6); sg.beginPath(); sg.moveTo(sx, sy); sg.lineTo(sx, sy + 40 + 40 * u); sg.stroke(); } sg.restore();
  sg.shadowColor = PHOS; sg.shadowBlur = 24; sg.drawImage(tileForTx(rec, 'stuck'), x + 12, ty, size, size); sg.restore(); }
function drawCheck(cx, cy, s, col) { sg.save(); sg.strokeStyle = col; sg.lineWidth = Math.max(3, s * .12); sg.lineCap = 'round'; sg.lineJoin = 'round'; sg.beginPath(); sg.moveTo(cx - s * .28, cy + s * .02); sg.lineTo(cx - s * .08, cy + s * .22); sg.lineTo(cx + s * .3, cy - s * .2); sg.stroke(); sg.restore(); }
function drawAcceleratePlay(f, now) {
  backdrop('vault', now, .8); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, mo = motionOK();
  if (crateTx.length !== 9) { const used = []; crateTx = Array.from({ length: 9 }, () => { const r = pickStuck(used); used.push(r); return r; }); }
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], big = m >= 8, rec = crateTx[i];
    if (picked) { const t = at ? (now - at) / (900 * speed()) : 9, open = mo ? clamp01(t / .5) : 1;
      if (t < .5 && mo) { slab(x, y, w, h, { seam: false }); drawBoostCard(x, y, w, h, rec, open, now); round(sg, x + w - 120, y + 14, 106, h - 28, 8, null, PHOS + (Math.floor(now / 90) % 2 ? 'ff' : '66'), 3); continue; }
      const k = mo ? ease((t - .5) / .5) : 1; sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      slab(x, y, w, h, { edge: big ? GOLD : PHOS, seamColor: big ? GOLD : PHOS }); sg.restore();
      const bs = (h - 30) * (mo ? .5 + .5 * k : 1), bx = x + 16 + (h - 30 - bs) / 2, by = y + 15 + (h - 30 - bs) / 2; blockShape(sg, bx, by, bs, 2 + m * 5, { glow: big ? 26 : 10, seed: 'pk' + i, grid: 4 }); drawCheck(bx + bs / 2, by + bs / 2, bs * .6, '#02140b');
      const cxm = x + h + (w - h) / 2, shown = Math.max(1, Math.round(m * Math.min(1, k * 1.2)));
      text(sg, TIER[m] || '', cxm, y + h / 2 - 50, 22, big ? '#fff1b8' : AMBER, SANS, 'center', '900'); text(sg, `${shown}×`, cxm, y + h / 2 - 8, 54, '#ffffff', SANS, 'center', '900'); text(sg, `${fmt(shown * f.bet)} LAYR`, cxm, y + h / 2 + 36, 20, '#c9ffe6', SANS, 'center', '800'); text(sg, `IN A BLOCK · TX ${rec.txid.slice(0, 8)}…`, cxm, y + h / 2 + 62, 12, '#6fbf9d', MONO, 'center', '700'); }
    else if (done && now - doneAt > 900 * speed()) { slab(x, y, w, h, { alpha: .55, seam: false }); text(sg, TIER[m] || '', x + w / 2, y + h / 2 - 22, 18, '#4f7a68', SANS, 'center', '900'); text(sg, `${m}×`, x + w / 2, y + h / 2 + 14, 38, '#4f7a68', SANS, 'center', '900'); }
    else { const bob = mo ? Math.sin(now / 420 + i) * 3 : 0; slab(x, y, w, h, { seam: false }); sg.drawImage(tileForTx(rec, 'stuck'), x + 12, y + 12 + bob, h - 24, h - 24); text(sg, `BOOST ${i + 1}`, x + w * .7, y + h / 2 - 30, 30, PHOS, SANS, 'center', '900'); text(sg, 'STUCK TRANSACTION', x + w * .7, y + h / 2 + 4, 15, '#c9ffe6', SANS, 'center', '800'); text(sg, 'TAP TO BOOST', x + w * .7, y + h / 2 + 36, 15, '#6fbf9d', SANS, 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickCrate(i) }); } }
  if (done && now - doneAt > 900 * speed()) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }

/* --- Block Template: each lock packs a real pending transaction into the template --- */
/* --- A Block Template respin: every open slot rolls real pending transactions, slows, and stops one by one --- */
function drawRollCell(i, x, y, w, h, now, stop) {
  const mo = motionOK(), left = Math.max(0, stop - now), T = 136, pool = D.pending.length ? D.pending : [{ txid: '0'.repeat(64), feeRate: 1, vsize: 141, fee: 141 }];
  slab(x, y, w, h, { alpha: .95, seam: false, edge: '#5fb8ee', glow: mo ? '#2f9bff' : null });
  sg.save(); sg.beginPath(); sg.roundRect(x + 5, y + 5, w - 10, h - 10, 10); sg.clip();
  const p = mo ? 2400 * (left / 1000) * (left / 1000) + 0 : 0, idx = Math.floor(p / T), frac = p - idx * T, vel = mo ? Math.min(1, left / 380) : 0, base = y + 8 + (h - 16 - 128) / 2;
  for (let k = -1; k <= 1; k++) { const ty = base + k * T - frac, tx = pool[(((idx + k + i * 3) % pool.length) + pool.length) % pool.length]; sg.globalAlpha = .55 + .45 * (1 - Math.min(1, Math.abs(ty - base) / T)); sg.drawImage(tileForTx(tx, 'pending'), x + 8, ty, 128, 128);
    if (vel > .15) { sg.globalAlpha *= .35 * vel; sg.drawImage(tileForTx(tx, 'pending'), x + 8, ty + 14 * vel, 128, 128); } }
  sg.globalAlpha = 1; const vx = x + 128 + (w - 128 + 8) / 2, ghost = [2, 3, 5, 8, 10, 15, 25, 50];
  sg.globalAlpha = .35 + .35 * vel; text(sg, `${ghost[(Math.floor(now / 70) + i * 3) % ghost.length]}×`, vx, y + h / 2 - 6, 36, '#8fd0ff', SANS, 'center', '900'); sg.globalAlpha = .6; text(sg, mo ? 'PACKING…' : 'PACKING', vx, y + h / 2 + 30, 13, '#6fbfe0', SANS, 'center', '800');
  if (mo) { sg.globalAlpha = .5; sg.fillStyle = '#9fdcff'; sg.fillRect(x, y + ((now / 4 + i * 43) % (h + 20)) - 10, w, 6); }
  sg.restore(); }

function drawTemplatePlay(f, now) {
  backdrop('chain', now, .9); const fr = f.frames[f.index], tot = fr.cells.reduce((a, v) => a + v, 0), mo = motionOK(), n = fr.cells.filter(Boolean).length, full = n === 15;
  sg.save(); round(sg, RX + 4, RY + 4, RW - 8, RH - 8, 12, null, full ? GOLD : '#3a7fb0', full ? 5 : 3); round(sg, RX + 12, RY + 12, RW - 24, RH - 24, 8, null, '#2f9bff55', 2); sg.restore();
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 10, y = RY + Math.floor(i / 5) * RHT + 10, w = CW - 23, h = RHT - 20, at = scene.stampAt[i], rollStop = scene.rollCells && scene.rollCells[i];
    if (rollStop && now < rollStop) { drawRollCell(i, x, y, w, h, now, rollStop); return; }
    if (v) { const t = at ? (now - at) / (420 * speed()) : 9; if (t < 0) { slab(x, y, w, h, { seam: false, alpha: .8 }); return; }
      if (!scene.carved) scene.carved = {}; if (!scene.carved[i]) { scene.carved[i] = 1; if (at) { shake(4); spark(x + 80, y + h / 2, 22, { spread: Math.PI * 2, v: 300 }); } }
      const tx = tabletTx(f, i), s = mo ? 1 + .7 * (1 - ease(t)) : 1; slab(x, y, w, h, { edge: t < 1.5 ? '#c9ffe6' : '#3a8f6c', seamColor: PHOS, glow: t < 1.5 && mo ? PHOS : null });
      sg.save(); sg.globalAlpha = Math.min(1, t * 3); const ts = 128 * s; sg.drawImage(tileForTx(tx, 'pending'), x + 8 + (128 - ts) / 2, y + 8 + (h - 16 - ts) / 2 + (h - 16 - 128) / 2, ts, ts);
      if (t > .5) { const vx = x + 128 + (w - 128 + 8) / 2; glowText(`${v}×`, vx, y + h / 2 - 20, 40, mo ? clamp01((t - .5) * 3) : 1, now); text(sg, `${fmt(v * f.bet)}`, vx, y + h / 2 + 18, 18, '#c9ffe6', SANS, 'center', '800'); text(sg, 'LAYR', vx, y + h / 2 + 38, 11, '#6fbf9d', SANS, 'center', '800'); } sg.restore(); }
    else { slab(x, y, w, h, { alpha: .6, seam: false, edge: '#2f5f75' }); sg.save(); sg.setLineDash([8, 6]); sg.lineDashOffset = mo ? -now / 45 : 0; round(sg, x + 14, y + 14, w - 28, h - 28, 6, null, '#2f9bff99', 2); sg.restore();
      if (mo) { sg.save(); sg.beginPath(); sg.roundRect(x + 14, y + 14, w - 28, h - 28, 6); sg.clip(); const sx = x + ((now / 11 + i * 61) % (w + 90)) - 45; const gr = sg.createLinearGradient(sx, 0, sx + 40, 0); gr.addColorStop(0, '#78c8ff00'); gr.addColorStop(.5, '#78c8ff26'); gr.addColorStop(1, '#78c8ff00'); sg.fillStyle = gr; sg.fillRect(sx, y, 40, h); sg.restore(); } text(sg, 'OPEN SLOT', x + w / 2, y + h / 2 - 8, 17, '#4a7a93', SANS, 'center', '900'); text(sg, 'FOR A TX', x + w / 2, y + h / 2 + 14, 13, '#34596b', SANS, 'center', '800'); } });
  // Respins left: three lamps that visibly refill whenever a new transaction is packed.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0; sg.save(); round(sg, RX + 14, RY - 30, 300, 48, 12, '#020a06e6', rs ? '#c9ffe6' : '#2f8f68', rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, RY - 6, 20, '#c9ffe6', SANS, 'center', '900');
  const leftShown = scene.rollEnd && now < scene.rollEnd ? scene.leftBefore : fr.left; for (let k = 0; k < 3; k++) { const on = k < leftShown; sg.beginPath(); sg.arc(RX + 180 + k * 44, RY - 7, 15, 0, 7); sg.fillStyle = on ? (rs ? '#e9fff6' : PHOS) : '#10241c'; if (on && rs) { sg.shadowColor = PHOS; sg.shadowBlur = 22; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 400, RY - 30, 386, 48, 12, '#020a06e6', full ? GOLD : '#2f8f68', 2); text(sg, `PACKED ${n}/15 · ${fmt(tot * f.bet)} LAYR`, RX + RW - 207, RY - 6, 21, full ? GOLD : '#c9ffe6', SANS, 'center', '900');
  if (E.featureDone(f) && now - chainFlash > 700) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  else if (!E.featureDone(f)) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }

/* --- Rush Hour: the reels re-skinned as a climbing fee chart, projected blocks stacking up red --- */
function drawRushPlay(now) {
  backdrop('free', now, 1); const w = drawReels(now); txRain(now, 16, .35, RX, RY, RW, RH, true);
  const wy = 782, wh = 74; slab(RX, wy, RW, wh, { edge: '#a04a44', seamColor: ALERT }); const sn = season ? season.etched : [], mo = motionOK();
  text(sg, 'PROJECTED BLOCKS', RX + 20, wy + 14, 12, '#d98a7e', SANS, 'left', '900');
  const t0s = {}; sn.forEach((e, i) => { t0s[i] = e.t0; }); const cnt = Math.min(8, Math.max(3, sn.length)); drawBlockRow(RX + 150, wy + 14, 46, cnt, now, clamp01(sn.length / 8) + .1, { gap: 14, t0s });
  text(sg, `${sn.length} BLOCK${sn.length === 1 ? '' : 'S'} STACKED`, RX + RW - 20, wy + 14, 12, '#d98a7e', SANS, 'right', '900');
  if (!sn.length) text(sg, 'THE RUSH BEGINS WITH THE FIRST SPIN', 700, wy + 52, 16, '#a56a62', SANS, 'center', '800');
  const left = state.free, total = state.freeTotal;
  slab(300, RY - 36, 800, 46, { r: 12, edge: ALERT, seam: false }); text(sg, `RUSH HOUR · ${left} SPIN${left === 1 ? '' : 'S'} LEFT · ${fmt(total)} LAYR · ALL WINS 2×`, 700, RY - 12, 20, '#ffd0c9', SANS, 'center', '900');
  return w; }

/* --- Block Found: the block is mined and launches; the mempool shuffles forward --- */
function drawBlockFoundPlay(now) { const T = (motionOK() ? 7200 : 2400) * speed(), u = clamp01((now - scene.t0) / T), amt = scene.data.amount * ease((u - .12) / .72), mo = motionOK();
  const count = u < .12 ? Math.ceil(3 - u / .04) : 0, climb = mo ? clamp01((u - .12) / .66) : 1, k = Math.pow(climb, 2.2), arrive = clamp01((u - .78) / .22);
  skyAndPad(now, mo ? u * 1800 * (u > .12 ? 1 : 0) : 0);
  if (mo && u > .12 && u < .85) { sg.save(); sg.globalAlpha = .12; sg.fillStyle = '#9ff0cb'; for (let i = 0; i < 8; i++) { const cx = 120 + (hashStr('cl' + i) % 1160), cy = ((now / 3 + hashStr('cy' + i) % 960) % 1100) - 80; sg.beginPath(); sg.ellipse(cx, cy, 120, 30, 0, 0, 7); sg.fill(); } sg.restore(); }
  const rx = 1010 + (mo ? Math.sin(now / 60) * (1 - k) * 4 : 0), ry = 660 - k * 440 + (mo && u < .12 ? Math.sin(now / 30) * 3 : 0), flame = u < .12 ? (.2 + u * 5) : u > .9 ? 0.3 : 1;
  drawRocket(rx, ry, .85 - .12 * k, now, mo ? flame : 0, mo ? Math.sin(now / 400) * .02 : 0);
  if (mo && u > .1 && u < .9 && Math.floor(now / 40) !== Math.floor((now - 17) / 40)) spark(rx + (Math.random() - .5) * 20, ry + 110, 3, { dir: Math.PI / 2, spread: .5, v: 360, life: 900, c: PHOS });
  if (u < .12) { if (mo) shake(3 + u * 40); if (Math.ceil(3 - u / .04) !== scene.lastCount) { scene.lastCount = Math.ceil(3 - u / .04); sfx('crack', 3); } text(sg, String(count || 1), 400, 480, 220, '#e9fff6', SANS, 'center', '900'); }
  if (arrive > 0 && mo && Math.floor(now / 260) !== Math.floor((now - 17) / 260)) { const bx = 560 + Math.random() * 700, by = 120 + Math.random() * 420; spark(bx, by, 26, { spread: Math.PI * 2, v: 320, life: 1100, c: [PHOS, GOLD, '#e9fff6', '#7ee7b8'][Math.floor(Math.random() * 4)] }); if (Math.random() < .5) drum(70, .3); }
  const nb = D.blocks[0];
  if (u >= .1) { glowText('BLOCK FOUND', 420, 300, 82, mo ? clamp01((u - .1) / .35) : 1, now, { stops: ['#fffbe0', '#ffe27a', '#e0a820'], glow: GOLD });
    text(sg, 'JACKPOT', 400, 375, 26, PHOS, SANS, 'center', '900'); sg.save(); sg.shadowColor = PHOS; sg.shadowBlur = 30; text(sg, `${fmt(Math.round(amt))}`, 400, 480, 120, '#ffffff', SANS, 'center', '900'); sg.restore(); text(sg, 'LAYR', 400, 560, 34, '#c9ffe6', SANS, 'center', '900');
    if (nb) text(sg, `NEXT BLOCK · ${nb.nTx.toLocaleString('en-GB')} TX${nb.min != null ? ` · ${rateText(nb.min)}–${rateText(nb.max)} sat/vB` : ''}`, 400, 620, 18, '#7ee7b8', MONO, 'center', '800'); }
  // The mempool queue along the foot: when the block is found it joins the chain and the queue shuffles one place forward.
  const qy = 822; round(sg, 40, qy - 18, 1320, 110, 14, '#020a06cc', PHOS + '55', 2); text(sg, 'MEMPOOL', 96, qy + 38, 14, '#6fbf9d', SANS, 'center', '900'); text(sg, 'CHAIN', 1300, qy + 38, 14, '#6fbf9d', SANS, 'center', '900');
  for (let i = 0; i < 6; i++) { const b = D.blocks[i] || { medianFee: 2 }, shift = ease(arrive) * 150, bx = 160 + i * 150 - shift + (i === 0 ? 0 : 0); sg.save(); sg.globalAlpha = i === 0 ? 1 - arrive : 1; if (bx > 140) blockShape(sg, bx, qy - 6, 84, Math.max(.4, b.medianFee), { glow: 4, seed: 'mq' + i, grid: 3 }); sg.restore(); }
  if (arrive > 0) { const gs = 84 * ease(arrive * 1.4); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 30; blockShape(sg, 1180 - gs / 2 + 42 - 42, qy - 6 + 42 - gs / 2, gs, 400, { glow: 30, seed: 'found', grid: 4 }); sg.restore(); }
  for (let k2 = 0; k2 < 56; k2++) { const p = k2 / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = mo ? (k2 + Math.floor(now / 90)) % 3 === 0 : k2 % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#e9fff6' : '#0f3a28'; sg.fill(); }
  if (u < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (u >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }

/* --- Confirm or Evict: three radar sweeps, then the transaction confirms or is evicted --- */
function drawConfirmEvictPlay(now) { backdrop('gamble', now); const r = scene.data.result, T = 3400 * speed(), t = clamp01((now - scene.t0) / T), mo = motionOK(), conf = r.fate === 'etch', cx = 500, cy = RY + 300;
  const sweeps = [.0, .22, .44], reveal = .66;
  if (mo && t < reveal) { const s = sweeps.reduce((a, st) => t >= st ? st : a, sweeps[0]), u = (t - s) / .22; if (!scene.hit) scene.hit = {}; if (u > .5 && !scene.hit[s]) { scene.hit[s] = 1; sfx('land'); shake(5); spark(cx, cy, 14, { spread: Math.PI * 2, v: 300 }); }
    sg.save(); sg.strokeStyle = AMBER; sg.lineWidth = 3; sg.globalAlpha = 1 - u; sg.beginPath(); sg.arc(cx, cy, 80 + u * 260, 0, 7); sg.stroke(); sg.restore(); }
  const pr = t >= reveal ? clamp01((t - reveal) / .2) : 0, mode = t < reveal ? 'ready' : conf ? 'confirmed' : 'evicted', jolt = mo && t < reveal ? Math.max(0, Math.sin(((t % .22) / .22) * Math.PI)) * 4 : 0;
  // The first projected block waits at the top; a confirmed transaction rises into it.
  const bx = cx - 50, by = RY + 40, rise = conf && t >= reveal ? ease(pr) : 0;
  blockShape(sg, bx, by, 100, conf && t >= reveal ? 60 : (D.blocks[0] ? Math.max(.4, D.blocks[0].medianFee) : 2), { glow: conf && t >= reveal ? 36 : 6, seed: 'ce', grid: 4 });
  drawTxCard(cx, cy + 40 + jolt - rise * 180, 170 * (1 - rise * .5), now, mode, pr);
  if (t >= reveal + .05) { if (!scene.data.landed) { scene.data.landed = true; sfx(conf ? 'land' : 'burn'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) { particles(25); spark(cx, cy - 60, 40, { spread: Math.PI * 2, v: 420 }); } else shake(6); }
    const k = mo ? ease((t - reveal - .05) / .12) : 1; sg.save(); sg.globalAlpha = k; glowText(conf ? 'CONFIRMED' : 'EVICTED', 1040, RY + 150, 70, 1, now, conf ? {} : { stops: ['#ffd0c9', '#ff4d4d', '#8a1c1c'], glow: ALERT, ghost: '#2a0f0f' });
    text(sg, `YOU CALLED ${r.call === 'etch' ? 'CONFIRM' : 'EVICT'}. THE TRANSACTION WAS ${conf ? 'CONFIRMED' : 'EVICTED'}.`, 1040, RY + 232, 22, r.win ? '#c9ffe6' : '#c9a8a0', SANS, 'center', '900');
    text(sg, r.win ? `${fmt(r.amount)} LAYR` : '0 LAYR', 1040, RY + 316, 70, r.win ? '#ffffff' : '#7a6a6a', SANS, 'center', '900'); text(sg, r.win ? `YOUR ${fmt(r.stake)} LAYR WIN IS DOUBLED` : `YOUR ${fmt(r.stake)} LAYR WIN IS EVICTED`, 1040, RY + 372, 20, '#b6d6c8', SANS, 'center', '700'); sg.restore();
    button('CONTINUE', 910, RY + 430, 260, 78, () => setStage('outro')); }
  else text(sg, 'WAITING FOR THE NEXT BLOCK…', 1040, RY + 250, 30, AMBER, SANS, 'center', '900');
  skipChip(); }

/* --- The outro: one summary card per bonus --- */
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed())), mo = motionOK();
  backdrop(kind === 'jackpot' ? 'vault' : kind, now, .5); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'RUSH HOUR OVER'; total = data.total; lines = [`${data.count} free spins at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''} · ${(data.etched || []).length} blocks stacked`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any bonus or jackpot won during the rush', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'TRANSACTIONS BOOSTED'; total = data.total; lines = [`3 boosts: ${(data.picks || []).map(m => `${TIER[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = data.jackpot ? 'TEMPLATE FULL' : 'BLOCK TEMPLATE PACKED'; total = data.total; lines = [`${data.cells}/15 transactions packed · ${data.respins} respins`, data.jackpot ? `All 15 packed: Block Found jackpot +${fmt(data.jackpot)} next` : 'Fill all 15 to find the block'] }
  if (kind === 'jackpot') { title = 'BLOCK FOUND'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', state.lastWin > total + .5 ? `Plus ${fmt(Math.round((state.lastWin - total) * 100) / 100)} LAYR in line wins on the same spin` : 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'CONFIRMED' : 'EVICTED') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`You called ${r.call === 'etch' ? 'confirm' : 'evict'}; the transaction was ${r.fate === 'etch' ? 'confirmed' : 'evicted'}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  slab(RX + 90, RY + 14, RW - 180, RH - 28, { r: 18, glow: ACCENT });
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); glowText(title, 700, RY + 84, title.length > 18 ? 52 : 62, mo ? clamp01(t * 1.8) : 1, now);
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 178, 80, '#ffffff', SANS, 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 246 + i * 32, 22, '#b6e8d0', SANS, 'center', '700'));
  // What made it up.
  if (kind === 'free') { const n = Math.min(10, (data.etched || []).length); for (let i = 0; i < n; i++) { const e = data.etched[data.etched.length - n + i]; blockShape(sg, RX + 120 + i * 122, RY + 330, 96, e && e.rate ? e.rate : 6 + i * 4, { glow: 8, seed: 'out' + i, grid: 3 }); } }
  if (kind === 'vault') (data.picks || []).forEach((m, i) => { const x = RX + 150 + i * 360; slab(x, RY + 316, 330, 138, { r: 10, seam: false }); const r = (data.opened || [])[i]; if (r) sg.drawImage(tileForTx(r, 'stuck'), x + 10, RY + 324, 122, 122); text(sg, `${m}×`, x + 232, RY + 372, 48, '#fff', SANS, 'center', '900'); text(sg, `${TIER[m]} · ${fmt(m * (data.bet || 0))}`, x + 232, RY + 420, 17, AMBER, SANS, 'center', '800'); });
  if (kind === 'chain') (data.tablet || []).forEach((c, i) => { const x = 700 - 5 * 62 + (i % 5) * 124 + 4, y = RY + 318 + Math.floor(i / 5) * 46; round(sg, x, y, 116, 40, 6, c ? '#073a24' : '#0a1612', c ? PHOS : '#24403a', 2); if (c) text(sg, `${shortTx(c.tx.txid).slice(0, 6)} ${c.v}×`, x + 58, y + 21, 17, '#c9ffe6', MONO, 'center', '900'); });
  if (kind === 'jackpot') drawRocket(700, RY + 392, .36, now, .3);
  if (kind === 'gamble' && data.result) drawTxCard(700, RY + 392, 82, now, data.result.fate === 'etch' ? 'confirmed' : 'evicted', 1);
  sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 100, 260, 70, nextScene); }

/* --- The screen: header panels, then the reel window or the scene, then the history row and the three-figure foot --- */
function drawScreen(now) {
  hits = []; const sh = shakeAmp > 0 && motionOK() ? shakeAmp * Math.exp(-(now - shakeAt) / 180) : 0; sg.save(); if (sh > .3) sg.translate((Math.random() - .5) * sh * 2, (Math.random() - .5) * sh * 2);
  sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState(), bd = dataBadge(), tip = height();
  // Left panel: the Bitcoin tip and when the data was read.
  text(sg, tip ? tip.toLocaleString('en-GB') : '—', 208, 102, 46, PHOS, MONO, 'center', '900');
  text(sg, bd.ok ? 'BITCOIN TIP · LIVE' : bd.text === 'STALE' ? 'LAST READ · STALE' : 'SNAPSHOT TIP', 208, 148, 15, bd.ok ? '#7ee7b8' : AMBER, SANS, 'center', '800');
  text(sg, D.takenAt || D.readAt ? `READ ${stamp(D.source === 'live' ? D.readAt : D.takenAt)}` : '', 208, 168, 12, '#5f9c82', MONO, 'center', '700');
  // Centre panel: the Block Found jackpot for the bet level.
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', SANS, 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, '#7ee7b8', SANS, 'center', '700');
  // Right panel: the Daily Pot, the blocks left to the payout and the share per twin.
  text(sg, fmt(hs.pot), 1192, 98, 40, '#c9ffe6', SANS, 'center', '300'); text(sg, `${blocksLeft()} BLOCKS LEFT  ·  1% OF PAID BETS`, 1192, 136, 14, '#7ee7b8', SANS, 'center', '800');
  text(sg, twinCount.ok ? (twinCount.value ? `≈ ${fmt(hs.pot / twinCount.value)} PER TWIN · ${twinCount.value.toLocaleString('en-GB')} TWINS` : 'NO TWINS COUNTED YET') : 'SHARE PER TWIN: COUNT UNKNOWN', 1192, 162, 13, '#5f9c82', SANS, 'center', '700');
  if (lab) { round(sg, 18, 818, 300, 30, 8, '#d6454599'); text(sg, 'LAB · TEST BALANCE · NOT REAL LAYR', 168, 834, 13, '#e9fff6', SANS, 'center', '900'); }
  let msg, msgColor = '#9ff5cf';
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawBlockFoundPlay(now); drawSparks(now); sg.restore(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawAcceleratePlay(f, now); else if (k === 'chain' && f) drawTemplatePlay(f, now); else if (k === 'gamble' && scene.data.result) drawConfirmEvictPlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'CONFIRM OR EVICT? CALL IT' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `ACCELERATE · BOOST ${f ? 3 - f.picks.length : 0} MORE · TAP A TRANSACTION`) : scene.kind === 'chain' ? (scene.rollEnd && now < scene.rollEnd ? 'PACKING THE BLOCK TEMPLATE…' : f && E.featureDone(f) ? '' : `BLOCK TEMPLATE · ${f ? f.frames[f.index].left : 0} RESPIN${f && f.frames[f.index].left === 1 ? '' : 'S'} LEFT`) : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawRushPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction);
    msg = state.freeActive ? '' : spinning ? 'BROADCASTING…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol]} × ${w.count}  ·  +${fmt(w.amount)}` : state.gamble ? `WIN ${fmt(state.gamble)} · CONFIRM OR EVICT?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : (D.pulse && now - D.pulse < 4000 ? 'A BLOCK WAS JUST FOUND · THE QUEUE MOVES' : 'EVERYONE WAITS FOR THE NEXT BLOCK'); }
  if (msg) text(sg, msg, 700, 822, msg.length > 60 ? 21 : 25, msgColor, SANS, 'center', '800');
  if (!scene && !state.freeActive) drawBlocks();
  drawFeeStrip(now);
  text(sg, `${lab ? 'LAB' : 'LAYR'}  ${fmt(state.balance)}`, 68, 940, 24, '#c9ffe6', SANS, 'left', '800'); text(sg, `BET  ${fmt(shownBet)}`, 700, 940, 24, '#c9ffe6', SANS, 'center', '800'); text(sg, `WIN  ${fmt(scene && scene.kind === 'free' && scene.stage === 'outro' ? scene.data.total : state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 940, 24, PHOS, SANS, 'right', '800');
  drawSparks(now); sg.restore();
  screenTexture.needsUpdate = true; screenDirty = false;
}
function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
// Celebration: drops of green and gold light falling over the page (CSS .coin, recoloured in the build).
function particles(n = 35) { if (!motionOK()) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }
/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (!scene && !feature() && !state.free && state.balance < state.bet) { if (lab) { labTopUp(); return; } openAccount(); return; } primaryAction(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null, testStops = null;
// The generator handed to the engine for the next round: nothing in normal play, a scripted one inside a Bonus Lab run.
const roundRng = () => lab ? lab.nextRng() : undefined, gambleRng = parity => lab ? lab.gambleRng(parity) : undefined;
function spin() {
  if (spinning || $('modal').open || locked() || scene) return;
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  // Test hooks only: forced reel stops for the first five draws (see MempoolMadness.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : roundRng();
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) { if (lab) labTopUp(); else openAccount(); } return; }
  // The result is committed to the shared account before anything moves. The Daily Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now(); crateTx = [];
  if (p.free) sound('tick');
  status(p.free ? 'RUSH HOUR SPIN · ALL WINS 2×' : 'BROADCASTING…');
  // Now, and only now, choose which tiles show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Mempool Madness shows on-chain records only, so no symbol pays a cameo.
function recordRoundCameos() { return []; }
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; save(); update();
  if (season && r.round.free) { season.best = Math.max(season.best, r.total); carve(); }
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'BLOCK FOUND · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · FEE SPIKES' : ''}` : (r.round.free ? 'RUSH HOUR SPIN COMPLETE' : 'NOT IN THIS BLOCK · BROADCAST AGAIN');
  if (state.gamble) msg += ' · CONFIRM OR EVICT?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Rush Hour.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (season) season.retriggers++; toast(`More fee spikes! +${r.freeAward} spins.`); sfx('sting-free'); } else toast('Rush Hour cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); setTimeout(() => startScene(q[0].kind, q[0].data || {}), 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(seasonOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once Rush Hour has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-bump stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-BUMP STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-bump.', `<p>Auto-bump broadcasts at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-BUMP again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), etch: () => callGamble('etch'), burn: () => callGamble('burn'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('RUSH HOUR', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ▲</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="etch">Confirm</button><button class="bar-cta" data-act="burn">Evict</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Launch' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Boost ${3 - f.picks.length} of 9 stuck transactions`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Transaction ${i + 1}${f.picks.includes(i) ? `, ${TIER[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 transactions · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 packed`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ▲'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Waiting for the next block…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickCrate(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'MEMPOOL MADNESS') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
const dataLine = () => { const b = dataBadge(); return b.ok ? `LIVE from mempool.space, read ${stampFull(D.readAt)} (tip ${D.tip.height.toLocaleString('en-GB')})` : `${b.text}: bundled mempool snapshot taken ${stampFull(D.takenAt)} (tip ${SNAP.tip.height.toLocaleString('en-GB')})${D.everLive ? ', last live read ' + stampFull(D.readAt) : ''}. The machine keeps trying every 30 seconds.`; };
function openCollections() {
  const m = D.mempool, nb = D.blocks[0], w0 = D.whales[0], s0 = D.stuck[0], p0 = D.pending[0], f = D.fees;
  const row = (s, what, fig) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(NAMES[s])}${s === 'wild' ? ' (wild)' : s === 'bitcoin' ? ' (jackpot)' : ''}</td><td>${what}</td><td>${fig}</td></tr>`;
  const rows = [
    row('cherry', 'Fee band: 1 sat/vB, the cheapest the network relays', `${vbText(m.vsizeAtLeast[1])} queued at 1 sat/vB or more`),
    row('lemon', 'Fee band: 5 sat/vB', `${vbText(m.vsizeAtLeast[5])} queued at 5 sat/vB or more`),
    row('chip', 'Fee band: 20 sat/vB', `recommended now: ${rateText(f.halfHourFee)} (30 min) · ${rateText(f.fastestFee)} (fastest)`),
    row('block', 'Fee band: 50 sat/vB', `top bid in the next block: ${nb && nb.max != null ? rateText(nb.max) : 'not read'} sat/vB`),
    row('artifact', 'Whale: a real transaction moving 100 BTC or more, found by reading recent blocks', `${D.whales.length} on file${w0 ? ` · latest <code>${esc(w0.txid.slice(0, 8))}…</code> ${w0.btc.toLocaleString('en-GB', { maximumFractionDigits: 2 })} BTC` : ''}`),
    row('bitcoin', 'The next block as projected by mempool.space', nb ? `${nb.nTx.toLocaleString('en-GB')} tx${nb.min != null ? ` · ${rateText(nb.min)}–${rateText(nb.max)} sat/vB` : ''}` : 'not read'),
    row('wild', 'Replace By Fee: the trick of re-sending a transaction with a higher fee. Original artwork, no data', '—'),
    row('scatter', 'Fee spike: the median fee of each of the last blocks, drawn as a chart', `${D.recent.length} blocks, ending at ${D.tip.height.toLocaleString('en-GB')}`),
    row('vault', 'A real transaction stuck at a low fee rate', `${D.stuck.length} on file${s0 ? ` · e.g. <code>${esc(s0.txid.slice(0, 8))}…</code> at ${rateText(s0.feeRate)} sat/vB` : ''}`),
    row('chain', 'A real unconfirmed transaction with its fee rate', `${D.pending.length} on file${p0 ? ` · e.g. <code>${esc(p0.txid.slice(0, 8))}…</code> at ${rateText(p0.feeRate)} sat/vB` : ''}`)].join('');
  showModal('collections', 'The data on the reels.', `<p>Every figure on every tile comes from the Bitcoin network through the public mempool.space API. Nothing is made up. ${esc(dataLine())}</p>
  <table class="paytable"><thead><tr><th>REEL SYMBOL</th><th>WHAT IT SHOWS</th><th>THE NUMBERS NOW</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="fine"><b>A note on the fee bands.</b> The API gives the queued size (vbytes) at each fee level, not a count of transactions per band, and its histogram stops at 10 sat/vB. So the 1 and 5 tiles show queued size, and the 20 and 50 tiles show the live recommended fees. Whale transactions are those that move 100 BTC or more in total outputs, which is not the same as the value that changed hands. The badge on the screen says LIVE when the figures were read in the last minute and SNAPSHOT when the machine is running from its bundled copy. Which tile shows in a cell is chosen after the result is fixed, using a separate random draw, so it never changes your odds. Sources, endpoints and counts are in <code>art/sources.json</code>.</p><button class="outline" id="colHolders">Daily Pot ↗</button>`, 'THE DATA');
  $('colHolders').onclick = openHolders;
}
function openHolders() {
  const h = holderState(), p = h.period, left = blocksLeft();
  showModal('holders', 'The Daily Pot.', `<p>1% of every paid bet on Mempool Madness goes into the Daily Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players. Each pot is split per twin and paid every 144 Bitcoin blocks, about a day, so nobody can argue about when a day ends: it is the block height.</p>
  <div class="stat-cards"><div><span>THIS POT · BLOCKS ${(p * DAY_BLOCKS).toLocaleString('en-GB')}–${(p * DAY_BLOCKS + DAY_BLOCKS - 1).toLocaleString('en-GB')}</span><strong>${fmt(h.pot)}</strong></div><div><span>BLOCKS LEFT</span><strong>${left}</strong></div><div><span>LAST POT</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div></div>
  <p><b>Per twin.</b> ${twinCount.ok ? (twinCount.value ? `${twinCount.value.toLocaleString('en-GB')} forevered twins were counted across ${twinCount.collections || 'the live'} Forever Twins collections, so this pot would be worth about ${fmt(h.pot / twinCount.value)} LAYR per twin.` : 'No twins were counted yet.') : `The share per twin is unknown, not zero: the twin count could not be read (${esc(twinCount.reason || 'unavailable')}).`}</p>
  <p class="fine">Version 1 shows the meters and the countdown only. The 144-block snapshot, the per-twin split and the payout need a server or an on-chain contract and are not built yet (they are named stubs in the code, marked TODO). The pot meter is kept with this browser's LAYR session. The block height comes from ${esc(dataBadge().text)} data.</p>`, 'DAILY POT');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The manual: pays and rules.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. <b>RBF</b> is wild: it replaces every paying symbol and has its own pays, but never replaces a Fee spike, a Stuck transaction or a Pending transaction.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(NAMES[s])}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five NEXT BLOCK on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>RUSH HOUR</h3><p>3, 4 or 5 Fee spikes anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. The reels turn into a climbing fee chart, a new projected block stacks up red after every spin, and every win pays <b>2×</b>. More Fee spikes add 4 spins, up to 24 per feature. Your bet is locked for the feature. Accelerate and Block Template can trigger during it and pay at 1×.</p>
  <h3>ACCELERATE</h3><p>3 or more Stuck transactions anywhere show nine real stuck transactions. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you boost any. Boost three; each shoots into a block and reveals its prize. The transaction shown is decoration: the prize was fixed when the nine appeared. Tiers: Dust 1×, Economy 2×, Standard 3×, Priority 4×, Express 5×, Urgent 8×, Surge 10×, Max fee 15×.</p>
  <h3>BLOCK TEMPLATE</h3><p>5 or more Pending transactions start a hold-and-respin. Each locks as a real pending transaction packed into the block template, worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new lock resets the count to 3. Fill all 15 to win the Block Found jackpot as well.</p>
  <h3>BLOCK FOUND JACKPOT</h3><p>Five NEXT BLOCK on the centre row (wilds don't count), or all 15 template cells filled, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players. The jackpot symbol shows the real projected next block.</p>
  <h3>CONFIRM OR EVICT</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call. A pending transaction is either confirmed or evicted from the mempool: call it. Right doubles the win; wrong evicts that win only. It is an even bet.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Mempool Madness runs on the same engine as Block Fortune, Forever Twins and Rune Pit: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no live data can ever change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, Fee spike scatter pays 1.5%, Rush Hour 8.5%, Accelerate 11.9%, Block Template 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. Rush Hour and Accelerate each arrive about 1 in 140 spins, Block Template about 1 in 290, the Block Found jackpot about 1 in 113,000. Confirm or Evict is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Daily Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The data on the reels ↗</button> <button class="outline" id="rulesHolders">Daily Pot ↗</button>`, 'THE MANUAL');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['Rush Hour', 'Three Fee spikes anywhere pay a scatter prize and award 8 free spins. The reels become a climbing fee chart and a projected block stacks up red after every spin. Every win is doubled, and more Fee spikes add 4 spins, up to 24 per feature.'], vault: ['Accelerate', 'Three Stuck transactions show nine real low-fee transactions. Boost three: each shoots into a block with a prize from 1× to 15× your total bet.'], chain: ['Block Template', 'Five Pending transactions start a hold-and-respin. Real pending transactions pack into the block template with their values, any new one resets your three respins, and filling all 15 wins the Block Found jackpot.'], genesis: ['Block Found Jackpot', 'A progressive meter for each bet level. Land five NEXT BLOCK on the centre row, or fill the whole template, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'BLOCK FOUND').replace('CHAIN', 'BLOCK TEMPLATE').replace('VAULT', 'ACCELERATE').replace('FREE SPINS', 'RUSH HOUR').replace('RETRIGGER', 'MORE FEE SPIKES');
function openHistory(){
 const rows = (list, tagLab) => list.map(h=>`<tr><td>${tagLab || h.lab ? '<b>LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Rush Hour spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td></tr>`).join('');
 const head = '<thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th></tr></thead>';
 const body=`<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut)}</strong></div></div><p>${lab ? 'These are LAB rounds on the lab balance. They are not part of your real history.' : 'Latest 50 rounds. All amounts use the shared LAYR account.'}</p><table class="paytable">${head}<tbody>${rows(state.history)}</tbody></table>${!lab && labStore.history && labStore.history.length ? `<h3>LAB RUNS (not real LAYR, not counted above)</h3><table class="paytable">${head}<tbody>${rows(labStore.history.slice(0, 20), true)}</tbody></table>` : ''}<button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history','The log.',body,'LOG');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,currency:'LAYR',lab:!!lab,wagered:state.wagered,paidOut:state.paidOut,holder:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no sparks, shake, radar sweep or rocket)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space spins, respins and collects. 1–9 boost stuck transactions. M mutes. F is fullscreen.${LAB_OK ? ' L opens the Bonus Lab.' : ''}</p><button class="outline" id="setCols">The data on the reels</button><button class="outline" id="setHolders">Daily Pot</button><button class="outline" id="setHistory">The log</button>`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory;
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Mempool Madness runs on the same engine as Block Fortune, Forever Twins and Rune Pit: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no art and no live mempool figure can ever change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>Fee spike scatter pays</td><td>1.5%</td><td>with Rush Hour</td></tr><tr><td>Rush Hour (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>Accelerate (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>Block Template (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Block Found jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Confirm or Evict is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Daily Pot (1% of paid bets) is funded from the house edge and never reduces a win. The live mempool data only decides what the tiles look like.</p>`, 'FAIR PLAY');
}
/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'BROADCAST', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['etch', 'CONFIRM', 'call confirm', 'fb gold'], ['burn', 'EVICT', 'call evict', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'CONFIRM/EVICT?', 'gamble win', 'fb gold'], ['collect', 'COLLECT', 'take the prize', 'fb gold'],
  ['betDown', '−FEE', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+FEE', 'bet up', 'fb'], ['max', 'MAX FEE', 'max bet', 'fb'], ['auto', 'AUTO-BUMP', 'auto', 'fb'],
  ['pays', 'FEES', 'pays & rules', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'LOG', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), etch: () => callGamble('etch'), burn: () => callGamble('burn'), keep: () => keepWin(), gamble: () => openGamble(), collect: () => { const f = feature(); if (scene && f && E.featureDone(f)) collectScene(); }, betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => openLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 7).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(7).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free, f = feature();
  q('primary').querySelector('b').textContent = spinning ? 'BROADCASTING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('etch', gambleIntro); show('burn', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0); show('collect', !!(scene && scene.stage === 'play' && f && E.featureDone(f)));
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance); q('balance').querySelector('small').textContent = lab ? 'LAB balance' : 'LAYR balance';
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-BUMP';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); q('lab').setAttribute('aria-pressed', String(!!lab));
}
function fitFs() { if (!fsOn) return; const st = $('fsStage'), w = st.clientWidth - 16, h = st.clientHeight - 16, k = Math.max(.1, Math.min(w / 1400, h / 960)); screen.style.width = `${Math.floor(1400 * k)}px`; screen.style.height = `${Math.floor(960 * k)}px`; }
// Show or hide the fullscreen layout. Hosts call this through PX_CASINO_ENGINE.fullscreen(on) once they have made the frame visible.
function setFullscreenLayout(on) { fsOn = !!on; $('fs').hidden = !fsOn; document.body.classList.toggle('fs-on', fsOn);
  if (fsOn) { $('fsStage').appendChild(screen); fitFs(); updateFsBar(); } else if (screen.parentNode) screen.remove(); screenDirty = true; return fsOn; }
async function requestFullscreen(on) { if (fsHost) { fsHost(!!on); return; }
  if (on) { setFullscreenLayout(true); fsSelf = true; try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* the fixed full-viewport layer stays as the fallback */ } }
  else { fsSelf = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} setFullscreenLayout(false); } }
document.addEventListener('fullscreenchange', () => { if (fsSelf && !document.fullscreenElement) { fsSelf = false; setFullscreenLayout(false); } fitFs(); });
addEventListener('resize', fitFs);

/* ---------- Test hooks: only on a local development host, or when a standalone test page declares itself ---------- */
// The casino never sets PX_STANDALONE_TEST, so on the public casino MempoolMadness.test is null.
const TEST_OK = (() => { try { const w = window.parent; return w.PX_STANDALONE_TEST === true || /^(localhost|127\.0\.0\.1|\[::1\])$|\.(localhost|test)$/.test(w.location.hostname); } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it shows only with ?lab=1 in the room's address and only on the
// local (testnet) LAYR account: never for players on a production, on-chain account.
const LAB_OK = TEST_OK || (() => { try { return new URLSearchParams(window.parent.location.search).get('lab') === '1' && LAYR.onChainConnected === false; } catch (e) { return false; } })();
// Forced reel stops for the next spin. 'win' is a plain line win (1× bet) so the gamble can be tested.
const TEST_STOPS = { free: [9, 9, 9, 9, 9], vault: [20, 20, 20, 20, 20], chain: [0, 0, 0, 0, 0], jackpot: [8, 3, 14, 0, 15], win: [15, 8, 23, 30, 4] };
const LINKED_TEST = { none: 0, some: 1240, all: 158000 }; // test values for the twin count only
function engineSource() { const s = [...document.scripts].find(x => x.text.includes('Block Fortune v2 engine')); return s ? s.text : ''; }
// Seeded RTP simulation of this exact engine, in a worker so the machine stays responsive.
function simulate(spins = 1e6, seed = 20261101, onProgress) { return new Promise((resolve, reject) => {
  const src = `${engineSource()}\nlet x=BigInt(${Number(seed) >>> 0})&0xffffffffffffffffn;function next(){x=(x+0x9e3779b97f4a7c15n)&0xffffffffffffffffn;let z=x;z=((z^(z>>30n))*0xbf58476d1ce4e5b9n)&0xffffffffffffffffn;z=((z^(z>>27n))*0x94d049bb133111ebn)&0xffffffffffffffffn;return Number((z^(z>>31n))>>11n)/2**53;}
const rng=n=>Math.floor(next()*n),N=${Math.floor(spins)},st=BF.fresh();st.balance=1e15;st.bet=100;let paid=0,fr=0,va=0,ch=0,jk=0;
while(paid<N){const free=st.free>0;if(!free)paid++;BF.start(st,rng);const r=BF.settle(st);if(r.jackpotWin)jk++;if(r.triggers.free&&!free)fr++;while(BF.feature(st)){const f=BF.feature(st);if(f.type==='vault'){if(!f.free)va++;[0,1,2,3,4,5,6,7,8].sort(()=>next()-.5).slice(0,3).forEach(i=>BF.pick(st,i));}else{if(!f.free)ch++;while(BF.respin(st));}if(BF.collect(st).jackpotWin)jk++;}if(!st.free&&st.freeActive)BF.endFree(st);st.history.length=0;if(paid%250000===0&&!free)postMessage({progress:paid/N});}
postMessage({done:true,spins:N,seed:${Number(seed) >>> 0},rtp:100*st.paidOut/st.wagered,freeEvery:N/fr,pickEvery:N/va,holdEvery:N/ch,jackpots:jk});`;
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), w = new Worker(url);
  w.onmessage = e => { if (e.data.done) { w.terminate(); URL.revokeObjectURL(url); resolve(e.data); } else if (onProgress) onProgress(e.data.progress); };
  w.onerror = e => { w.terminate(); reject(Error(e.message || 'simulation failed')); }; }); }

/* ---------- Bonus Lab: pick any bonus or special event and play it now, on a separate lab balance ---------- */
// A Lab run is a real engine round: BF.start(state, rng) with a SCRIPTED rng that picks the reel stops (and, for the pick and hold
// and respin, the wanted values). The engine is neither edited nor bypassed, so the Lab shows exactly what real play would. It runs on
// its own state object and balance; it never reaches the real LAYR account, the jackpot meters, the Daily Pot or the RTP statistics.
const LAB_KEY = 'xtrata.parallax.mempool-madness.lab.v1';
const labStore = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem(LAB_KEY) || '{}') || {}; } catch (e) {} return Object.assign({ balance: 100000, history: [], item: 'free', bet: 100, mode: 'seeded', seed: '20261101', auto: true, last: null }, o); })();
function labPersist() { try { if (lab) { labStore.balance = state.balance; labStore.history = state.history.slice(0, 50); } localStorage.setItem(LAB_KEY, JSON.stringify(labStore)); } catch (e) {} }
const mulberry = seed => { let a = (typeof seed === 'number' ? seed : hashStr(String(seed))) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const windowOf = (c, s) => BF.windowAt(c, s);
const stopsWhere = (c, pred) => { const out = []; for (let s = 0; s < BF.strips[c].length; s++) if (pred(windowOf(c, s))) out.push(s); return out; };
const noBonus = w => !w.includes('scatter') && !w.includes('vault') && !w.includes('chain') && w[1] !== 'bitcoin';
const choose = (arr, prng) => arr[Math.floor(prng() * arr.length)];
const plain = prng => ({ stops: [0, 1, 2, 3, 4].map(c => choose(stopsWhere(c, noBonus), prng)) });
// A reel group where `reels` show the wanted symbol and every other reel shows nothing that could trigger a bonus.
const withSymbol = (reels, sym, prng) => ({ stops: [0, 1, 2, 3, 4].map(c => reels.includes(c) ? choose(stopsWhere(c, w => w.includes(sym) && !(sym !== 'scatter' && w.includes('scatter')) && !(sym !== 'vault' && w.includes('vault')) && !(sym !== 'chain' && w.includes('chain')) && w[1] !== 'bitcoin'), prng) : choose(stopsWhere(c, noBonus), prng)) });
const chainPlan = prng => ({ stops: [0, 1, 2, 3, 4].map(c => { const ok = stopsWhere(c, w => !w.includes('scatter') && !w.includes('vault') && w[1] !== 'bitcoin' && w.includes('chain')), best = Math.max(...ok.map(s => windowOf(c, s).filter(x => x === 'chain').length)); return choose(ok.filter(s => windowOf(c, s).filter(x => x === 'chain').length === best), prng); }) });
const jackpotPlan = prng => ({ stops: [0, 1, 2, 3, 4].map(c => choose(stopsWhere(c, w => w[1] === 'bitcoin' && !w.includes('scatter') && !w.includes('vault') && !w.includes('chain')), prng)) });
// A plain paid line win with no bonus, so the gamble is offered.
function winPlan(prng) { for (let t = 0; t < 3000; t++) { const p = plain(prng), g = p.stops.map((s, c) => windowOf(c, s)), ev = BF.evaluate(g, 100); if (ev.lineTotal > 0 && !ev.triggers.free && !ev.triggers.vault && !ev.triggers.chain && !ev.jackpot) return p; } return { stops: TEST_STOPS.win }; }
const SCATTER_REELS = { 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4] };
const AWARD_ORDER = [4, 8, 0, 6, 3, 7, 1, 5, 2]; // indices into the engine's prize list: 4, 15, 1, 8, 3, 10, 2, 5, 2 times the bet
const LAB_ITEMS = [
  { id: 'free', name: 'Rush Hour', note: '3 Fee spikes: 8 free spins at 2×, a projected block stacks up after every spin', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'free-retrigger', name: 'Rush Hour with a retrigger', note: 'a second set of Fee spikes in spin 2 adds 4 spins', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p), plain(p), withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'pick', name: 'Accelerate', note: '3 Stuck transactions: nine to boost, boost three; the mix holds a big prize', plans: p => [withSymbol([0, 2, 4], 'vault', p)], awards: AWARD_ORDER },
  { id: 'hold', name: 'Block Template', note: '5+ Pending transactions: locks land, the respin lamps reset', plans: p => [chainPlan(p)], lockOdds: .2 },
  { id: 'hold-full', name: 'Block Template, full grid', note: 'forced full-grid run: all 15 pack and win Block Found too', plans: p => [chainPlan(p)], fullGrid: true },
  { id: 'jackpot', name: 'Block Found (centre row)', note: 'five NEXT BLOCK on the centre row', plans: p => [jackpotPlan(p)] },
  { id: 'gamble-win', name: 'Confirm or Evict: a win', note: 'a plain win, then the call lands on a win', plans: p => [winPlan(p)], gamble: 'win' },
  { id: 'gamble-loss', name: 'Confirm or Evict: a loss', note: 'a plain win, then the call lands on a loss', plans: p => [winPlan(p)], gamble: 'loss' },
  { id: 'scatter3', name: 'Scatter pays 3', note: '3 Fee spikes pay 2× the bet and start Rush Hour', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'scatter4', name: 'Scatter pays 4', note: '4 Fee spikes pay 5× the bet and start Rush Hour', plans: p => [withSymbol(SCATTER_REELS[4], 'scatter', p)] },
  { id: 'scatter5', name: 'Scatter pays 5', note: '5 Fee spikes pay 10× the bet and start Rush Hour', plans: p => [withSymbol(SCATTER_REELS[5], 'scatter', p)] }
];
// The scripted generator for one round: the first five draws choose the reel stops, the rest follow the item's script, then the seeded generator.
function planRng(plan, prng, item) { let k = 0, a = 0; return n => {
  if (k < 5 && n === BF.strips[0].length) return plan.stops[k++];
  if (n === BF.CHAIN_ODDS) return item.fullGrid ? 0 : item.lockOdds ? (prng() < item.lockOdds ? 0 : 1) : Math.floor(prng() * n);
  if (n === BF.vaultPrizes.length && item.awards) return item.awards[a++ % 9];
  return Math.floor(prng() * n); }; }
function labTopUp() { if (!lab) { labStore.balance = 100000; labPersist(); return; } state.balance = 100000; labPersist(); toast('Lab balance reset to 100,000.'); update(); }
function labEnter() { if (lab) return; const saved = { state, E, faces: faces.map(c => c.slice()), linked: twinCount }, s = BF.fresh();
  s.balance = labStore.balance > 1000 ? labStore.balance : 100000; s.history = (labStore.history || []).slice(0, 50); for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) s[k] = state[k]; s.holder = { period: potPeriod(), pot: 0, last: null, cameos: 0 };
  lab = { saved, run: null, queue: [], auto: !!labStore.auto, botAt: 0, nextRng() { const run = lab.run, prng = run ? run.prng : Math.random, plan = (run && run.plans[run.spinNo++]) || plain(prng); return planRng(plan, prng, run ? run.item : {}); },
    gambleRng(parity) { const run = lab.run, prng = run ? run.prng : Math.random, win = run && run.item.gamble ? run.item.gamble === 'win' : prng() < .5, odd = win ? parity === 'odd' : parity !== 'odd'; return n => n === 2 ? (odd ? 1 : 0) : Math.floor(prng() * n); } };
  state = s; E = BF; faces = state.grid.map(col => col.map(pickFace)); stopAuto(); status('BONUS LAB · TEST BALANCE'); update(); }
function labLeave() { if (!lab) return; labPersist(); const { saved } = lab; for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) saved.state[k] = state[k]; lab = null; state = saved.state; E = saved.E; faces = saved.faces; twinCount = saved.linked; if (!sessionLock) LAYR.saveGame(state); lastResult = null; status('BACK TO THE REAL MACHINE'); update(); screenDirty = true; }
function labAbort() { if (!lab) return; clearTimeout(scheduleFree.t); scene = null; hideBar(); sceneQueue = []; jackpotMusic(false); spinning = false; animations = []; season = null; crateTx = []; state.pending = null; state.features = []; state.free = 0; state.freeActive = false; state.gamble = 0; lab.queue = []; lab.run = null; labLeave(); }
const labBusy = () => !!(scene || spinning || feature() || state.free > 0 || state.freeActive || state.pending || sceneQueue.length);
function labRunItem(id, o = {}) { if (!LAB_OK) return false; const item = LAB_ITEMS.find(i => i.id === id); if (!item) throw Error('Unknown Lab item: ' + id);
  if (labBusy()) { toast('Finish the current spin or bonus first.'); return false; }
  labEnter(); const bet = o.bet || labStore.bet, mode = o.mode || labStore.mode, seed = mode === 'random' && o.seed == null ? String(crypto.getRandomValues(new Uint32Array(1))[0]) : String(o.seed != null ? o.seed : labStore.seed);
  if (state.balance < bet * 3) labTopUp(); if (o.auto != null) lab.auto = !!o.auto;
  const prng = mulberry(seed); lab.run = { item, bet, seed, prng, spinNo: 0, plans: item.plans(prng), gambled: false };
  state.bet = bet; state.freeBet = bet; state.gamble = 0; labStore.last = { id, bet, seed, mode }; labPersist(); closeModal(); sceneQueue = []; spin(); return true; }
function labRunAll(o = {}) { if (!LAB_OK) return false; if (!labRunItem(LAB_ITEMS[0].id, { ...o, auto: true })) return false; lab.queue = LAB_ITEMS.slice(1).map(i => ({ id: i.id, o: { ...o, auto: true } })); return true; }
function labReplay() { const l = labStore.last; if (!l) { toast('Nothing to replay yet.'); return false; } return labRunItem(l.id, { bet: l.bet, seed: l.seed, mode: 'seeded' }); }
// Hands-free: the Lab presses the buttons a player would, at a watchable pace.
function labBot(now) { const s = scene, since = now - s.t0, d = speed(); if (s.stage === 'trigger') return;
  if (s.stage === 'intro') { if (since > 1100 * d) { if (s.kind === 'gamble') callGamble('etch'); else primaryAction(); } return; }
  if (s.stage === 'play') { const f = feature();
    if (s.kind === 'vault' && f) { if (!E.featureDone(f)) { if (now - lab.botAt > 650 * d) { lab.botAt = now; pickCrate([1, 3, 5, 7, 0, 2, 4, 6, 8].find(i => !f.picks.includes(i))); } } else if (now - lab.botAt > 2000 * d) { lab.botAt = now; collectScene(); } }
    else if (s.kind === 'chain' && f) { if (now - lab.botAt > (E.featureDone(f) ? 1700 : 1700) * d) { lab.botAt = now; featureAction(); } }
    else if (s.kind === 'jackpot') { if (since > ((motionOK() ? 7200 : 2400) * d + 900)) setStage('outro'); }
    else if (s.kind === 'gamble' && s.data.landed) { if (!s.data.landedAt) s.data.landedAt = now; else if (now - s.data.landedAt > 1500 * d) setStage('outro'); }
    return; }
  if (s.stage === 'outro' && since > 2500 * d) nextScene(); }
function labTick() { if (!lab || !pxEngineActive) return; const now = performance.now(), run = lab.run; if (spinning || $('modal').open) { lab.idleAt = 0; return; }
  // Between runs the Lab waits a moment, then hands the machine back (a queued run or a scene cancels the wait).
  if (!run && lab.next && now >= lab.nextAt && !labBusy()) { const n = lab.next; lab.next = null; labRunItem(n.id, n.o); return; }
  if (!run && !scene && !lab.next && !lab.queue.length && !feature() && !state.pending) { lab.idleAt = lab.idleAt || now; if (now - lab.idleAt > 1200) { labLeave(); return; } } else lab.idleAt = 0;
  if (!scene && run && run.item.gamble && state.gamble > 0 && !feature() && !state.free && !run.gambled) { run.gambled = true; openGamble(); return; }
  if (scene) { if (lab.auto) labBot(now); return; }
  if (run && run.spinNo > 0 && !feature() && !state.free && !state.freeActive && !state.pending && !sceneQueue.length && !(run.item.gamble && !run.gambled)) {
    labPersist(); const next = lab.queue.shift(); lab.run = null; if (next) { lab.next = next; lab.nextAt = now + 800; } } }
setInterval(labTick, 250);
function openLab() { if (!LAB_OK) return; const bal = lab ? state.balance : labStore.balance;
  showModal('lab', 'Bonus Lab.', `<p class="fine">Pick a bonus or special event, a bet and press Run: it plays at once through all four stages. Each run is a real engine round (the engine's own start with scripted reel stops; nothing is edited or bypassed) on a separate lab balance. Lab rounds are marked LAB in the chronicle and never touch your LAYR, the jackpot meters, the Daily Pot or the RTP figures.</p>
  <div class="stat-cards"><div><span>LAB BALANCE</span><strong>${fmt(bal)}</strong></div><div><span>LAST RUN</span><strong>${labStore.last ? esc(labStore.last.id) : '—'}</strong></div><div><span>LAST SEED</span><strong>${labStore.last ? esc(labStore.last.seed) : '—'}</strong></div></div>
  <h3>ITEM</h3><div class="lab-list">${LAB_ITEMS.map(i => `<button type="button" class="lab-item" data-lab-item="${i.id}" aria-pressed="${i.id === labStore.item}"><b>${esc(i.name)}</b><small>${esc(i.note)}</small></button>`).join('')}</div>
  <h3>BET</h3><div class="ab">${bets.map(b => `<button type="button" class="outline" data-lab-bet="${b}" aria-pressed="${b === labStore.bet}">${b}</button>`).join('')}</div>
  <h3>RANDOMNESS</h3><div class="ab"><button type="button" class="outline" data-lab-mode="seeded" aria-pressed="${labStore.mode === 'seeded'}">Seeded</button><button type="button" class="outline" data-lab-mode="random" aria-pressed="${labStore.mode === 'random'}">Random</button></div>
  <label class="setting">Seed (a seeded run repeats exactly)<input type="text" id="labSeed" value="${esc(labStore.seed)}" maxlength="12" style="width:9em"></label>
  <label class="setting">Hands-free (the Lab presses the buttons)<input type="checkbox" id="labAuto" ${labStore.auto ? 'checked' : ''}></label>
  <div class="ab"><button type="button" class="cta" id="labRunBtn">Run</button><button type="button" class="outline" id="labReplayBtn" ${labStore.last ? '' : 'disabled'}>Replay last</button><button type="button" class="outline" id="labAllBtn">Run all</button></div>
  <div class="ab"><button type="button" class="outline" id="labTopBtn">Reset lab balance</button><button type="button" class="outline" id="labExitBtn">Leave the Lab</button></div>`, 'BONUS LAB');
  const press = (sel, attr, val) => document.querySelectorAll(sel).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === String(val))));
  document.querySelectorAll('[data-lab-item]').forEach(b => b.onclick = () => { labStore.item = b.dataset.labItem; press('[data-lab-item]', 'data-lab-item', labStore.item); labPersist(); });
  document.querySelectorAll('[data-lab-bet]').forEach(b => b.onclick = () => { labStore.bet = Number(b.dataset.labBet); press('[data-lab-bet]', 'data-lab-bet', labStore.bet); labPersist(); });
  document.querySelectorAll('[data-lab-mode]').forEach(b => b.onclick = () => { labStore.mode = b.dataset.labMode; press('[data-lab-mode]', 'data-lab-mode', labStore.mode); labPersist(); });
  $('labSeed').oninput = e => { labStore.seed = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 12) || '1'; labPersist(); }; $('labAuto').onchange = e => { labStore.auto = e.target.checked; if (lab) lab.auto = labStore.auto; labPersist(); };
  $('labRunBtn').onclick = () => labRunItem(labStore.item, { auto: labStore.auto }); $('labReplayBtn').onclick = () => labReplay(); $('labAllBtn').onclick = () => labRunAll({ bet: labStore.bet, mode: labStore.mode, seed: labStore.seed });
  $('labTopBtn').onclick = () => { labTopUp(); openLab(); }; $('labExitBtn').onclick = () => { if (lab) labAbort(); closeModal(); }; }
const labApi = LAB_OK ? Object.freeze({ items: () => LAB_ITEMS.map(i => ({ id: i.id, name: i.name, note: i.note })), run: (id, o) => labRunItem(id, o), runAll: o => labRunAll(o), replay: () => labReplay(), abort: () => labAbort(), active: () => !!lab, auto: on => { if (lab) lab.auto = !!on; labStore.auto = !!on; }, state: () => lab ? JSON.parse(JSON.stringify(state)) : null, store: () => JSON.parse(JSON.stringify(labStore)), open: () => openLab() }) : null;

const testApi = TEST_OK ? Object.freeze({
  kinds: Object.keys(TEST_STOPS),
  force(kind) { if (!TEST_STOPS[kind]) throw Error('Unknown test feature: ' + kind); testStops = TEST_STOPS[kind].slice(); return true; },
  // Force, then spin straight away (the gamble needs a paid win first, so 'gamble' forces a plain win and opens the call).
  play(kind) { if (scene || spinning || feature() || state.free) return false; if (kind === 'gamble') { testStops = TEST_STOPS.win.slice(); spin(); const t = setInterval(() => { if (!spinning) { clearInterval(t); if (state.gamble) openGamble(); } }, 100); return true; } this.force(kind); spin(); return true; },
  twins(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); twinCount = { ok: true, value: LINKED_TEST[mode], test: true, collections: 3 }; screenDirty = true; update(); return twinCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage, total: scene.data ? (scene.data.total || scene.data.amount || 0) : 0 } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on)
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops on the test LAYR balance; nothing here exists on the public casino. The Bonus Lab runs on its own balance.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">Rush Hour</button><button class="cta" data-t="vault">Accelerate</button><button class="cta" data-t="chain">Block Template</button><button class="cta" data-t="jackpot">Block Found</button><button class="cta" data-t="gamble">Confirm or Evict</button></div>
  <h3>BONUS LAB</h3><div class="ab"><button class="outline" id="tLab">Open the Bonus Lab (L)</button></div>
  <h3>TWIN COUNT</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div><p class="fine">Switches the twin count the Daily Pot is split by (none, some or all). Test values only; the real count is read from the Forever Twins helpers.</p>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  $('tLab').onclick = () => openLab();
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.h); toast(`Twin count: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked);
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Rush Hour 1 in ${r.freeEvery.toFixed(0)} · Accelerate 1 in ${r.pickEvery.toFixed(0)} · Block Template 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return; const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickCrate(Number(e.key) - 1);
  else if (k === 'm') $('sound').click(); else if (k === 'f') requestFullscreen(!fsOn); else if (k === 's' && canSkip()) skipScene(); else if (k === 'l' && LAB_OK) openLab();
  else if (k === 'c' && scene?.kind === 'gamble') callGamble('etch'); else if (k === 'e' && scene?.kind === 'gamble') callGamble('burn');
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-BUMP STOPPED'); } } updateFsBar(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted && pxEngineActive) ac.resume().catch(() => {}); });

/* ---------- Frame loop: the screen only; idle frames capped near 30 fps ---------- */
let lastHl = -1, lastPoolSize = 0, lastTick = 0, lastSweep = 0;
const perf = { frames: 0, drawn: 0 }; let lastPulse = 0;
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); perf.frames++;
  if (spinning) spinPhysical.position.z = SPIN_Z - (1 + Math.sin(now / 170)) * .006; else spinPhysical.position.z = SPIN_Z;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || scene) screenDirty = true; // scenes animate continuously
  if (sparks.length || (shakeAmp && now - shakeAt < 900)) screenDirty = true;
  if (state.freeActive && motionOK()) screenDirty = true; // the climbing chart and the stacking blocks
  if (motionOK() && now - lastSweep > 100) { lastSweep = now; screenDirty = true; } // the radar sweep steps about ten times a second
  if (D.pulse !== lastPulse) { lastPulse = D.pulse; screenDirty = true; }
  if (state.freeActive && !spinning && !scene && now - lastTick > 2400) { lastTick = now; if (state.free) sound('tick'); }
  const ps = Object.values(pools).reduce((a, p) => a + p.length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw > 32)) { drawScreen(now); lastDraw = now; perf.drawn++; if (fsOn && perf.drawn % 10 === 0) updateFsBar(); }
}

/* ---------- Boot ---------- */
function resume() {
  if (lab) labAbort(); state=LAYR.openGame(GAME_ID,E); holderState();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startScene(feature().type, {}, 'intro'); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { renderBar(); status(`${state.free} SAVED RUSH HOUR SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(seasonOutro, 800);
}
update(); drawScreen(0);
// The bundled mempool snapshot is already on the tiles; live data starts when the cabinet is activated (startData) and says LIVE once it lands.
refaceIdle(); screenDirty = true;
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.MempoolMadness = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), height: () => ({ value: D.tip.height, source: D.source }), data: () => JSON.parse(JSON.stringify({ source: D.source, takenAt: D.takenAt, readAt: D.readAt, fails: D.fails, version: D.version, pulse: D.pulse, tip: D.tip, fees: D.fees, mempool: D.mempool, blocks: D.blocks, recent: D.recent, whales: D.whales.length, stuck: D.stuck.length, pending: D.pending.length })), refresh: () => refreshData(), twins: () => ({ ...twinCount }), scene: () => scene ? { kind: scene.kind, stage: scene.stage, total: scene.data ? (scene.data.total || scene.data.amount || 0) : 0 } : null, fullscreen: () => fsOn,
  soundLog: () => soundLog.map(e => ({ ...e })), perf: () => ({ ...perf }), screen: () => screen,
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, lab: !!lab })), rules: { lines: E_REAL.lines, pays: E_REAL.pays, strips: E_REAL.stripCodes },
  test: testApi, lab: labApi });
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const clicks={sound:'sound',turbo:'turbo',max:'maxBet'};
  if(action==='spin')spinClick();else if(action==='betDown')changeBet(-1);else if(action==='betUp')changeBet(1);else if(action==='auto')autoClick();
  else if(action==='pays')openRules();else if(action==='fair')openFair();else if(action==='gamble')openGamble();else if(action==='skip')skipScene();else if(action==='fullscreen')requestFullscreen(!fsOn);
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();else if(action==='lab')openLab();
  else if(clicks[action])document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // show: the scene on screen now, so a host can light the cabinet (topper speed, floor glow) during bonuses.
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,pulse:D.pulse,blocksLeft:blocksLeft(),dayBlocks:DAY_BLOCKS,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());startData();if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab)labAbort();stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;clearInterval(dataTimer);if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  // Fullscreen hand-over: the host shows this frame full-viewport (and in browser fullscreen), then calls fullscreen(true).
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
  // The Bonus Lab is offered to the host only when the game allows it (always on the test page; in the casino only with ?lab=1 on testnet).
  labAvailable:()=>LAB_OK,
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'BROADCAST',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!lab,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();


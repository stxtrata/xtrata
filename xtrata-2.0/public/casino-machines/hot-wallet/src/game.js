/* Hot Wallet — a ParallaX Casino machine. The Heist Museum: a little window back in time through crypto's most notorious exchange hacks,
   from Mt. Gox in 2014 to the record $6.3 billion Binance hack of October 2026 (as reported). Every symbol is an exhibit: a real hack with its
   date, place and what was taken, and the lesson the industry learned from it. The museum names no individual hackers, shows no faces, and
   explains each hack in one plain line, never as instructions. Every figure comes from art/facts.json (each with its sources) and is
   "at the time". The maths is the shared Block Fortune v2 engine (BF) unchanged: every outcome is fixed by BF before any art is chosen, and
   tiles are picked with Math.random, never the engine's generator, so no exhibit, figure or network read can change a result. The casino
   owns all 3D rendering and cameras; this frame only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='hot-wallet', LAYR=window.ParallaxLAYRAccount, E_REAL=LAYR.machine(GAME_ID,BF); let E=E_REAL;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E_REAL.bets, ACCENT = '#e11d48', ACCENT_HI = '#ff5c7c', BRASS = '#c9a46a', BRASS_HI = '#ecd29a', BRASS_DIM = '#7d6238', PAPER = '#efe6d0', INK = '#1d1712', ALERT = '#ff3b3b', GOLD = '#ffd23f', COLD = '#8cc8ff', HOT = '#ff8a2a', WALNUT = '#1a100b', CREAM = '#fff4dc';
const F = window.HW_FACTS; if (!F || !F.exhibits || !F.timeline) throw Error('Hot Wallet needs art/facts.js (built from art/facts.json).');
const EX = F.exhibits, LESSONS = F.lessons || [], TL = F.timeline.slice().sort((a, b) => a.year - b.year || (a.month || 0) - (b.month || 0));
// The Timeline bonus pins one headline to each of its fifteen cells in date order; the sixteenth row (an unverified one first) sits out.
const dropRow = TL.length > 15 ? (TL.find(r => r.verified === false) || TL.find(r => /bithumb/i.test(r.exchange)) || TL[TL.length - 1]) : null, TL15 = TL.filter(r => r !== dropRow).slice(0, 15);
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'BITSTAMP', lemon: 'CRYPTOPIA', chip: 'BITFINEX', block: 'COINCHECK', artifact: 'BYBIT', bitcoin: 'BINANCE 2026', wild: 'COLD STORAGE', scatter: 'MT. GOX', vault: 'QUADRIGACX', chain: 'HEADLINE' };
// What each reel symbol is. `frame` is the exhibit's plaque colour; the bigger the hack, the higher it pays.
const COLS = {
  cherry:   { name: NAMES.cherry,   kind: 'hack',     frame: '#a8743a', glow: '#d99a55' },
  lemon:    { name: NAMES.lemon,    kind: 'hack',     frame: '#5fae9a', glow: '#7be0c4' },
  chip:     { name: NAMES.chip,     kind: 'hack',     frame: '#b7c0c8', glow: '#dfe8f0' },
  block:    { name: NAMES.block,    kind: 'hack',     frame: '#e0b04a', glow: '#ffd57a' },
  artifact: { name: NAMES.artifact, kind: 'hack',     frame: ACCENT,    glow: ACCENT_HI },
  bitcoin:  { name: NAMES.bitcoin,  kind: 'jackpot',  frame: GOLD,      glow: '#ff6a4d' },
  wild:     { name: NAMES.wild,     kind: 'wild',     frame: COLD,      glow: '#bfe4ff' },
  scatter:  { name: NAMES.scatter,  kind: 'scatter',  frame: BRASS,     glow: BRASS_HI },
  vault:    { name: NAMES.vault,    kind: 'vault',    frame: '#8a8f99', glow: '#c5cad4' },
  chain:    { name: NAMES.chain,    kind: 'headline', frame: PAPER,     glow: '#fff4dc' }
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
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const stamp = ms => { const d = new Date(ms); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/* ---------- Holder layer, version 1: meters and display only ---------- */
// The Cold Storage Pot is 1% of every paid bet, kept beside the jackpot meters. It is paid for out of the house edge: it is never taken from a
// stake or a win, so the player's 94.38% is untouched. In the spirit of the lesson (art kept on someone's server can vanish; art inscribed on
// chain can't), HALF is split per forevered twin across every live Forever Twins collection and HALF goes to the Forever Fund, which pays the
// inscription fee of twinning collections whose art is still at risk. The period is one week (Monday 00:00 UTC to Monday 00:00 UTC), so nobody can
// argue about when it ends.
const HOLDER_RATE = 0.01, WEEK_MS = 604800000, WEEK0 = 345600000;
const potPeriod = () => Math.floor((Date.now() - WEEK0) / WEEK_MS), weekStart = p => p * WEEK_MS + WEEK0, msLeft = () => weekStart(potPeriod() + 1) - Date.now();
const timeLeftText = () => { const m = msLeft(), d = m / 86400000; return d >= 1 ? `${Math.floor(d)} DAY${Math.floor(d) === 1 ? '' : 'S'} ${Math.floor((m % 86400000) / 3600000)} H LEFT` : `${Math.max(1, Math.ceil(m / 3600000))} HOURS LEFT`; };
const weekText = p => `WEEK OF ${stamp(weekStart(p))}`;
function holderState() {
  const now = potPeriod(); let h = state.holder;
  if (lab) return h && typeof h === 'object' ? h : (state.holder = { period: now, pot: 0, last: null }); // the Lab keeps its own pot, never the real one
  if (!h || typeof h !== 'object' || typeof h.period !== 'number') h = state.holder = { period: now, pot: 0, last: null };
  if (now > h.period) { h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100, perTwin: twinCount && twinCount.ok && twinCount.value ? Math.round(h.pot / 2 / twinCount.value * 100) / 100 : null }; h.period = now; h.pot = 0; }
  return h;
}
function holderAdd(bet) { if (lab) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Twins counted from the Forever Twins helpers (checked reads: a failed read is "unknown", never "no twins"). Read-only, cached six hours.
const REG_URL = 'https://xtrata.xyz/forever-twins/data/registry.v2.json', TWIN_KEY = 'xtrata.parallax.hot-wallet.twins.v1';
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
// TODO(holder-layer-v2): at each Monday 00:00 UTC boundary, read every forevered twin of every live collection through its helper (checked
//   read), divide the finished week's twin half by the twin count and credit each twin's current holder (an on-chain claim once LAYR is a
//   token), and send the other half to the Forever Fund contract.
// TODO(holder-layer-v2): the Cameo royalty (1% of a line win to the holder of a twin on the line) needs NFT symbols on the reels; Hot Wallet
//   shows exhibits and records only, so no cameo is recorded here. The Cold Storage Pot is this machine's holder reward.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  countTwins,
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): the weekly snapshot and payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): claims need an on-chain LAYR token.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): holder spins need the holder-link service.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): Forever Fund refunds need a contract.' })
});
let twinCount = { ok: false, value: null, reason: 'not read yet' };
HolderRewards.countTwins().then(r => { twinCount = r; screenDirty = true; }).catch(e => { twinCount = { ok: false, value: null, reason: String(e && e.message || e) }; });
const perTwinText = pot => twinCount.ok ? (twinCount.value ? `≈ ${fmt(pot / 2 / twinCount.value)} PER TWIN · ${twinCount.value.toLocaleString('en-GB')} TWINS` : 'NO TWINS COUNTED YET') : 'SHARE PER TWIN: COUNT UNKNOWN';
function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = lab ? 'LAB · LAST WIN' : showFree ? 'TIME MACHINE WIN' : 'LAST WIN';
  $('freeCount').textContent = lab ? 'LAB BALANCE · NOT REAL LAYR' : state.free ? `${state.free} TIME MACHINE SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'TRAVELLING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TOUR';
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

// A museum thunk: a woody low tone with a dull noise knock under it (reel stops and stamps).
function thunk(at = 0, v = 1, f = 150) { return [noise(.05, 900, 1.2, .16 * v, at, 'lowpass'), tone(f, .14, 'triangle', .13 * v, at, .55), tone(f * 2.7, .06, 'sine', .035 * v, at)].filter(Boolean); }
// A brass bell strike: a bright sine with inharmonic partials and a long tail.
function bell(f = 880, at = 0, v = .09) { tone(f, 1.3, 'sine', v, at); tone(f * 2.76, .8, 'sine', v * .4, at); tone(f * 5.4, .35, 'sine', v * .16, at); }
// A newsroom teletype: n rapid key clacks and a carriage-return ding.
function teletype(n = 8, at = 0, v = 1) { for (let k = 0; k < n; k++) { const t = at + k * (.045 + ((k * 7) % 5) * .008); noise(.02, 2600 + ((k * 13) % 7) * 220, 5, .1 * v, t); tone(180 + ((k * 31) % 9) * 14, .025, 'square', .018 * v, t); } tone(2093, .35, 'sine', .035 * v, at + n * .055 + .05); }
// The alarm: a run of fast bell strikes that swell and fade (the jackpot).
function alarmBells(d = 3, at = 0, v = .08) { const gap = .13; for (let k = 0; k < Math.floor(d / gap); k++) { const e = Math.sin(Math.PI * k * gap / d); tone(k % 2 ? 1175 : 988, .22, 'triangle', v * (.35 + .65 * e), at + k * gap); noise(.04, 3400, 4, .05 * e, at + k * gap); } }
// A vault door clank: a low drum, a ringing metal knock and a short grind.
function clank(at = 0, v = 1) { drum(48, .5 * v, at, .5); noise(.5, 1900, 9, .2 * v, at); tone(142, .5, 'square', .05 * v, at, .7); tone(1480, .6, 'sine', .04 * v, at + .01); noise(.35, 500, 1.4, .07 * v, at + .06, 'lowpass'); }
// A frost crackle for the cold side of Hot or Cold, a fire whoosh for the hot side.
function frost(at = 0) { for (let k = 0; k < 9; k++) { const t = at + k * (.03 + (k % 3) * .02); tone(3200 + k * 260, .05, 'sine', .035, t); noise(.015, 7000, 6, .05, t); } tone(660, .7, 'sine', .04, at + .1, .6); }
function fire(at = 0) { noise(.8, 700, .8, .16, at, 'lowpass'); noise(.5, 2400, 1.5, .08, at + .05); tone(120, .7, 'sawtooth', .04, at, 2); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { sweep(.8, 0, .1, 200, 2200); thunk(0, .9, 120); [0, .1, .2].forEach((t, k) => tone(392 * (1 + k * .25), .09, 'triangle', .04, t + .05)); }
  if (kind === 'stop') return [...thunk(at, .6 + i * .06, 110 + i * 18), tone(1568 + i * 140, .12, 'sine', .018, at)].filter(Boolean); // a brass thunk as each reel locks
  if (kind === 'win') { [659, 784, 988].forEach((n, k) => bell(n, k * .08, .06)); }
  if (kind === 'big') { [523, 659, 784, 1047, 1319].forEach((n, k) => bell(n, k * .08, .07)); teletype(10, .45); drum(60, .35); }
  if (kind === 'bonus') { bell(880); bell(1320, .3); [330, 440].forEach((n, k) => tone(n, .6, 'triangle', .05, k * .25 + .15)); clank(.5, .7); }
  if (kind === 'antic') sweep(1.6, 0, .08, 240, 2000);
  if (kind === 'tick') { noise(.02, 3200, 6, .08); tone(1400, .04, 'square', .02); }
  if (kind === 'lock') { thunk(i * .08, 1.2, 100); bell(1568, i * .08 + .03, .04); }
  if (kind === 'respin') { teletype(5, 0, .8); drum(64, .18); }
  if (kind === 'pick') { bell(988 + i * 40, 0, .07); }
  if (kind === 'click') noise(.02, 2500, 4, .1);
  if (kind === 'lose') { tone(196, .6, 'triangle', .07, 0, .5); tone(147, .7, 'triangle', .05, .15, .6); noise(.5, 260, .8, .07, 0, 'lowpass'); }
  if (kind === 'flip') { noise(.05, 4000, 3, .2); tone(1400, .2, 'sine', .05, .05, .8); }
  return [];
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
/* ---------- Reel tiles: original museum exhibits (newspaper front pages, brass plaques, evidence bags), drawn from art/facts.json ---------- */
// Each company's own logo (the files Jim supplied, art/logos) sits on its tile, shown as supplied on a plate of its own background colour, with the
// name in type, the year, the amount (at the time) and a small coin mark. None of the companies has endorsed the machine. Nothing here depicts a person.
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px
const MONO = '"DejaVu Sans Mono","Liberation Mono","Courier New",monospace', SANS = 'Arial, "Liberation Sans", sans-serif', SERIF = 'Georgia, "DejaVu Serif", "Liberation Serif", serif';
const EXNO = { scatter: 1, cherry: 2, chip: 3, block: 4, lemon: 5, vault: 6, artifact: 7, bitcoin: 8, wild: 0 }; // exhibit numbers, in date order
const up = s => String(s == null ? '' : s).toUpperCase();
function speckle(g, seed, x, y, w, h, n = 60, a = '#00000018', b = '#ffffff10') { const r = seeded('sp' + seed); g.save(); for (let i = 0; i < n; i++) { g.fillStyle = r() < .5 ? b : a; g.fillRect(x + r() * w, y + r() * h, 1 + r() * 3, 1 + (r() < .2 ? 1 : 0)); } g.restore(); }
function fitText(g, s, x, y, maxW, size, color, font = SANS, weight = 'bold', align = 'center') { let sz = size; g.font = `${weight} ${sz}px ${font}`; s = String(s); while (sz > 7 && g.measureText(s).width > maxW) { sz--; g.font = `${weight} ${sz}px ${font}`; } if (g.measureText(s).width > maxW) { while (s.length > 2 && g.measureText(s + '…').width > maxW) s = s.slice(0, -1); s = s.trimEnd() + '…'; } text(g, s, x, y, sz, color, font, align, weight); return sz; }
function wrapG(g, s, x, y, maxW, lh, size, color, align = 'left', maxLines = 3, font = SANS, weight = '600') { g.font = `${weight} ${size}px ${font}`; const words = String(s || '').split(/\s+/), lines = []; let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; } if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; let l = lines[maxLines - 1]; while (l.length > 3 && g.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[maxLines - 1] = l.replace(/[\s,.;:]+$/, '') + '…'; }
  lines.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, weight)); return lines.length; }
// Official coin symbol files (art/coins) when the build found them; otherwise the coin's ticker set in type. Never a hand-drawn logo.
const COIN_GLYPH = { BTC: '₿', ETH: 'Ξ', NEM: 'XEM', NZD: 'NZ$', USD: '$', FIAT: '$', MULTI: 'ALT' };
const coinImgs = {};
for (const [k, v] of Object.entries(F.coins || {})) if (v && v.svg) { const im = new Image(); im.onload = () => { coinImgs[k] = im; if (typeof rebuildPools === 'function' && poolsReady) { rebuildPools(); refaceIdle(); } }; im.src = v.svg; }
function coinBadge(g, cx, cy, r, coin, dark = false) {
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = lin(g, cx - r, cy - r, cx + r, cy + r, dark ? ['#4a3a1c', '#241a0c'] : ['#fff1c4', '#c9a15b']); g.fill(); g.lineWidth = 2; g.strokeStyle = dark ? BRASS : '#6e4f1c'; g.stroke();
  const im = coinImgs[coin]; if (im) { g.beginPath(); g.arc(cx, cy, r - 2.5, 0, 7); g.clip(); g.fillStyle = '#ffffffee'; g.fillRect(cx - r, cy - r, r * 2, r * 2); g.drawImage(im, cx - r * .75, cy - r * .75, r * 1.5, r * 1.5); }
  else { const gl = COIN_GLYPH[coin] || String(coin || '').slice(0, 4); fitText(g, gl, cx, cy + 1, r * 1.45, r * (gl.length > 1 ? 1 : 1.35), dark ? BRASS_HI : '#3b2a12', SANS, '900'); }
  g.restore(); }
// Company logos: the files Jim supplied (art/logos), embedded by tools/build-art.mjs. A logo is drawn as supplied (never redrawn,
// recoloured or stretched) on a plate of its own background colour; until it has loaded the plate shows the name in type.
const logoImgs = {}; let logosPending = 0;
for (const [k, v] of Object.entries(F.logos || {})) { logosPending++; const im = new Image(); const done = () => { if (--logosPending === 0 && typeof rebuildPools === 'function' && poolsReady) { rebuildPools(); refaceIdle(); } }; im.onload = () => { logoImgs[k] = im; done(); }; im.onerror = done; im.src = v.src; }
function logoPlate(g, key, x, y, w, h, opt = {}) {
  const L = (F.logos || {})[key]; if (!L) return false; const im = logoImgs[key], pad = opt.pad == null ? Math.min(6, h * .16) : opt.pad;
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, opt.r == null ? 4 : opt.r); g.fillStyle = L.bg; g.fill(); if (opt.edge !== false) { g.lineWidth = 1.5; g.strokeStyle = opt.edge || '#00000055'; g.stroke(); } g.clip();
  if (im) { const k = Math.min((w - pad * 2) / L.w, (h - pad * 2) / L.h); const dw = L.w * k, dh = L.h * k; g.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); }
  else fitText(g, up(L.name), x + w / 2, y + h / 2 + 1, w - 8, h * .5, L.bg === '#ffffff' ? '#222' : '#eee', SANS, '900');
  g.restore(); return true; }
const coLogo = key => { const L = (F.logos || {})[key]; return L ? `<span class="co-logo" style="background:${L.bg}"><img src="${L.src}" alt="${esc(L.name)} logo" height="${Math.min(26, Math.round(L.h * 110 / L.w) || 26)}"></span>` : ''; };
function stampText(g, s, x, y, ang, color, size = 16, alpha = .88) { g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha = alpha; g.font = `900 ${size}px ${SANS}`; const w = g.measureText(s).width + 16; g.lineWidth = 3; g.strokeStyle = color; g.fillStyle = color; g.beginPath(); g.roundRect(-w / 2, -size * .8, w, size * 1.6, 4); g.stroke(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, 1); g.restore(); }
function ribbon(g, s, x, y, w, fill, ink, size = 11) { round(g, x, y, w, 20, 4, fill); text(g, s, x + w / 2, y + 11, size, ink, SANS, 'center', '900'); }
function snowflake(g, x, y, r, col = '#d8f0ff', a = .8) { g.save(); g.translate(x, y); g.strokeStyle = col; g.globalAlpha = a; g.lineWidth = 1.6; g.lineCap = 'round'; for (let k = 0; k < 6; k++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, r); g.moveTo(0, r * .55); g.lineTo(r * .22, r * .8); g.moveTo(0, r * .55); g.lineTo(-r * .22, r * .8); g.stroke(); } g.restore(); }
// Engraved brass lettering: a light edge below and a dark cut above.
function engraved(g, s, x, y, maxW, size, weight = '900', font = SERIF) { let sz = size; g.font = `${weight} ${sz}px ${font}`; s = String(s); while (sz > 7 && g.measureText(s).width > maxW) { sz--; g.font = `${weight} ${sz}px ${font}`; } if (g.measureText(s).width > maxW) { while (s.length > 2 && g.measureText(s + '…').width > maxW) s = s.slice(0, -1); s = s.trimEnd() + '…'; } text(g, s, x + 1, y + 1.5, sz, '#fff0c0aa', font, 'center', weight); text(g, s, x, y, sz, '#3a2a10', font, 'center', weight); return sz; }
function paperBody(g, seed, frame, fw, glow) {
  g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 6; round(g, 12, 6, 216, 216, 6, lin(g, 0, 6, 0, 222, ['#f4ecd6', '#e8dcbc', '#d6c7a0'])); g.shadowBlur = 0;
  speckle(g, seed, 12, 6, 216, 216, 160, '#5a481c1c', '#ffffff30'); g.fillStyle = '#00000012'; g.fillRect(12, 113, 216, 2); g.fillStyle = '#ffffff55'; g.fillRect(12, 115, 216, 1);
  round(g, 12, 6, 216, 216, 6, null, frame, fw); round(g, 17, 11, 206, 206, 3, null, '#5a481c33', 1.5); }
function brassPlate(g, seed, frame, fw, glow) {
  g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 6; round(g, 12, 6, 216, 216, 12, lin(g, 12, 6, 228, 222, ['#f0d9a0', '#bd9350', '#8a6530', '#d2aa62', '#9a7438'])); g.shadowBlur = 0;
  speckle(g, seed, 12, 6, 216, 216, 120, '#3a2a1030', '#fff3c855'); round(g, 19, 13, 202, 202, 8, null, '#fff0c077', 2); round(g, 21, 15, 198, 198, 7, null, '#3a2a1088', 1.5);
  for (const [x, y] of [[28, 22], [212, 22], [28, 206], [212, 206]]) { g.beginPath(); g.arc(x, y, 4.6, 0, 7); g.fillStyle = lin(g, x - 4, y - 4, x + 4, y + 4, ['#fff0c0', '#6e4f1c']); g.fill(); g.strokeStyle = '#2a1c08aa'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2.8, y + 1); g.lineTo(x + 2.8, y - 1); g.stroke(); }
  round(g, 12, 6, 216, 216, 12, null, frame, fw); }

const shortUsd = s => String(s || '').replace(/\s*\(.*?\)/g, '').replace(/ at the time$/i, '');
// Variant 0: a dated newspaper front page.
function newsTile(g, sym, e, col) {
  paperBody(g, sym + 'n', col.frame, 4, sym === 'bitcoin' ? GOLD : null);
  text(g, sym === 'bitcoin' ? 'THE HEIST MUSEUM' : 'THE HEIST MUSEUM GAZETTE', sym === 'bitcoin' ? 108 : 120, 24, 11, INK, SERIF, 'center', '900'); g.fillStyle = INK; g.fillRect(24, 33, 192, 2); g.fillRect(24, 37, 192, 1);
  text(g, up(e.dateText), 26, 47, 9.5, '#5a4a30', SANS, 'left', '800'); text(g, `EXHIBIT ${String(EXNO[sym]).padStart(2, '0')}`, 214, 47, 9.5, '#5a4a30', SANS, 'right', '800');
  if (e.logo) { fitText(g, up(e.name), 120, 64, 188, 26, INK, SERIF, '900'); logoPlate(g, e.logo, 24, 76, 192, 32); g.fillStyle = INK; g.fillRect(24, 113, 192, 1.5);
    coinBadge(g, 46, 134, 15, e.coin); fitText(g, e.taken || '', 140, 134, 140, 30, '#9d1236', SANS, '900');
    fitText(g, up(shortUsd(e.usdText)), 120, 157, 188, 10.5, '#4a3a22', SANS, '800'); wrapG(g, e.how, 26, 173, 188, 11.5, 9.5, '#2a2218', 'left', 3, SERIF, '600'); return; }
  fitText(g, up(e.name), 120, 76, 188, 36, INK, SERIF, '900'); g.fillStyle = INK; g.fillRect(24, 97, 192, 1.5);
  coinBadge(g, 48, 124, 17, e.coin); fitText(g, e.taken || '', 142, 124, 140, 36, '#9d1236', SANS, '900');
  fitText(g, up(shortUsd(e.usdText)), 120, 151, 188, 11, '#4a3a22', SANS, '800');
  wrapG(g, e.how, 26, 168, 188, 12, 10, '#2a2218', 'left', 3, SERIF, '600'); }
// Variant 1: a brass exhibit plaque.
function plaqueTile(g, sym, e, col) {
  brassPlate(g, sym + 'p', col.frame, 4, sym === 'bitcoin' ? GOLD : null);
  if (e.logo) { engraved(g, `EXHIBIT No. ${String(EXNO[sym]).padStart(2, '0')}`, 120, 29, 150, 10, '800', SANS); engraved(g, up(e.name), 120, 50, 176, 22); logoPlate(g, e.logo, 38, 62, 164, 34, { edge: '#3a2a10aa' }); engraved(g, String(e.year), 120, 122, 150, 40);
    g.fillStyle = '#3a2a1088'; g.fillRect(40, 148, 160, 1.5); coinBadge(g, 56, 171, 14, e.coin); engraved(g, e.taken || '', 140, 171, 120, 26, '900', SANS); engraved(g, up(shortUsd(e.usdText) + ' · AT THE TIME'), 120, 200, 170, 9, '800', SANS); return; }
  engraved(g, `EXHIBIT No. ${String(EXNO[sym]).padStart(2, '0')}`, 120, 31, 150, 11, '800', SANS); engraved(g, up(e.name), 120, 62, 176, 28); engraved(g, String(e.year), 120, 108, 150, 50);
  g.fillStyle = '#3a2a1088'; g.fillRect(40, 138, 160, 1.5); coinBadge(g, 56, 164, 16, e.coin); engraved(g, e.taken || '', 140, 164, 120, 30, '900', SANS);
  engraved(g, up(shortUsd(e.usdText) + ' · AT THE TIME'), 120, 196, 170, 9, '800', SANS); }
// Variant 2: a sealed evidence bag with a paper tag.
function bagTile(g, sym, e, col) {
  g.shadowColor = sym === 'bitcoin' ? GOLD : '#000'; g.shadowBlur = sym === 'bitcoin' ? 18 : 6; round(g, 12, 6, 216, 216, 8, lin(g, 0, 6, 0, 222, ['#2a1b12', '#1a100b', '#120a07'])); g.shadowBlur = 0; speckle(g, sym + 'b', 12, 6, 216, 216, 90);
  const bx = 30, by = 18, bw = 180, bh = 186; round(g, bx, by, bw, bh, 10, lin(g, bx, by, bx + bw, by + bh, ['#ffffff26', '#ffffff0a', '#ffffff1c']), '#ffffff40', 2);
  g.save(); g.beginPath(); g.roundRect(bx, by, bw, bh, 10); g.clip(); g.fillStyle = '#ffffff10'; g.beginPath(); g.moveTo(bx + 20, by); g.lineTo(bx + 70, by); g.lineTo(bx + 20, by + bh); g.lineTo(bx - 30, by + bh); g.fill();
  g.fillStyle = '#c4162c'; g.fillRect(bx, by + 8, bw, 22); g.fillStyle = '#ffffffd0'; g.font = `900 9px ${SANS}`; g.textAlign = 'left'; g.textBaseline = 'middle'; for (let x = bx + 8; x < bx + bw; x += 94) g.fillText('EVIDENCE · SEALED', x, by + 19); g.restore();
  g.save(); g.translate(120, 118); g.rotate(-.05); round(g, -76, -58, 152, 116, 3, lin(g, 0, -58, 0, 58, ['#f4ecd6', '#d9ccaa']), '#5a481c88', 1.5); g.fillStyle = '#5a481c'; g.beginPath(); g.arc(-62, -46, 4, 0, 7); g.fill();
  if (e.logo) { text(g, `${e.year}`, 0, -46, 10, '#9d1236', MONO, 'center', '900'); fitText(g, up(e.name), 0, -32, 140, 14, INK, SERIF, '900'); logoPlate(g, e.logo, -62, -22, 124, 34, { pad: 4, r: 3, edge: '#5a481caa' }); coinBadge(g, -42, 31, 11, e.coin); fitText(g, e.taken || '', 28, 31, 90, 20, '#9d1236', SANS, '900'); fitText(g, up(e.dateText), 0, 50, 140, 8.5, '#5a4a30', SANS, '800'); }
  else { text(g, `${e.year}`, 0, -34, 11, '#9d1236', MONO, 'center', '900'); fitText(g, up(e.name), 0, -14, 140, 22, INK, SERIF, '900'); coinBadge(g, -42, 22, 14, e.coin); fitText(g, e.taken || '', 28, 22, 90, 26, '#9d1236', SANS, '900'); fitText(g, up(e.dateText), 0, 50, 140, 9, '#5a4a30', SANS, '800'); } g.restore();
  g.strokeStyle = '#d8c9a0'; g.lineWidth = 2; g.beginPath(); g.moveTo(98, 68); g.quadraticCurveTo(70, 40, 108, 38); g.stroke(); }
// The Cold Storage wild: original art, three ways of keeping keys offline (a safe, a sealed device, a key frozen in ice).
function coldTile(g, e, v) {
  g.shadowColor = '#9fd2ff'; g.shadowBlur = 16; round(g, 12, 6, 216, 216, 14, lin(g, 0, 6, 0, 222, ['#1b3350', '#0f2036', '#0a1626'])); g.shadowBlur = 0; speckle(g, 'cold' + v, 12, 6, 216, 216, 100, '#00000030', '#bfe4ff18');
  round(g, 12, 6, 216, 216, 14, null, COLD, 4); round(g, 17, 11, 206, 206, 11, null, '#ffffff22', 2);
  for (const [x, y, r] of [[40, 46, 12], [200, 52, 9], [34, 150, 8], [204, 140, 13], [120, 40, 7]]) snowflake(g, x, y, r);
  text(g, 'COLD STORAGE', 120, 25, 15, '#e6f4ff', SANS, 'center', '900');
  if (v === 0) { round(g, 58, 56, 124, 104, 8, lin(g, 58, 56, 182, 160, ['#8aa2bd', '#41566f', '#6c829c']), '#d8ecff', 3); round(g, 66, 64, 108, 88, 5, null, '#ffffff44', 2); g.beginPath(); g.arc(120, 108, 24, 0, 7); g.fillStyle = lin(g, 96, 84, 144, 132, ['#cfe3f6', '#4d637c']); g.fill(); g.strokeStyle = '#1b2a3c'; g.lineWidth = 2; g.stroke(); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; g.beginPath(); g.moveTo(120 + Math.cos(a) * 17, 108 + Math.sin(a) * 17); g.lineTo(120 + Math.cos(a) * 22, 108 + Math.sin(a) * 22); g.stroke(); } g.fillStyle = '#1b2a3c'; g.fillRect(118, 90, 4, 18);
    g.strokeStyle = '#d8ecff'; g.lineWidth = 6; g.beginPath(); g.arc(120, 54, 17, Math.PI, 0); g.stroke(); round(g, 106, 52, 28, 16, 3, lin(g, 0, 52, 0, 68, ['#e6f4ff', '#7f98b3']), '#1b2a3c', 1.5); }
  if (v === 1) { g.save(); g.translate(120, 108); g.rotate(-.06); round(g, -46, -58, 92, 116, 12, lin(g, -46, -58, 46, 58, ['#33465e', '#16222f']), '#bfe4ff', 3); round(g, -36, -48, 72, 42, 6, '#06101a', '#7fc8ff88', 1.5); text(g, 'SEALED', 0, -27, 15, '#9fe3ff', MONO, 'center', '900');
    for (let k = 0; k < 3; k++) { g.fillStyle = '#ffffff22'; g.beginPath(); g.arc(-18 + k * 18, 22, 7, 0, 7); g.fill(); } g.fillStyle = '#c4162c'; g.fillRect(-46, 42, 92, 14); g.fillStyle = '#fff'; g.font = `900 8px ${SANS}`; g.textAlign = 'center'; g.fillText('TAMPER SEAL · NOT ON A SERVER', 0, 50); g.restore(); }
  if (v === 2) { round(g, 52, 54, 136, 108, 14, lin(g, 52, 54, 188, 162, ['#e9f7ff99', '#8ccaf099', '#d4efffaa']), '#ffffffcc', 3); g.save(); g.translate(120, 108); g.rotate(-.5); g.strokeStyle = '#e6c46b'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(-34, 0, 14, 0, 7); g.moveTo(-20, 0); g.lineTo(44, 0); g.moveTo(26, 0); g.lineTo(26, 14); g.moveTo(38, 0); g.lineTo(38, 12); g.stroke(); g.restore(); g.fillStyle = '#ffffff88'; g.beginPath(); g.moveTo(62, 64); g.lineTo(100, 60); g.lineTo(72, 100); g.fill(); }
  round(g, 24, 176, 192, 36, 8, '#06101acc'); fitText(g, 'KEYS KEPT OFFLINE', 120, 189, 180, 15, '#e6f4ff', SANS, '900'); fitText(g, 'THE DEFENCE · WILD', 120, 205, 180, 11, '#8cc8ff', SANS, '800'); }
function exhibitTile(sym, v) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], e = EX[sym]; g.scale(TILE / 240, TILE / 240);
  if (sym === 'wild') { coldTile(g, e, v); return c; }
  [newsTile, plaqueTile, bagTile][v % 3](g, sym, e, col);
  if (sym === 'bitcoin') { g.save(); g.beginPath(); g.arc(205, 25, 19, 0, 7); g.fillStyle = ALERT; g.shadowColor = '#000'; g.shadowBlur = 6; g.fill(); g.shadowBlur = 0; g.lineWidth = 2; g.strokeStyle = '#ffe9a8'; g.stroke(); text(g, 'RECORD', 205, 26, 7.5, '#fff', SANS, 'center', '900'); g.restore(); if (e.caveat) { round(g, 24, 197, 192, 16, 4, '#2a0a0ae6'); fitText(g, up(e.caveat), 120, 205, 184, 10, '#ffd0c8', SANS, '900'); } round(g, 15, 9, 210, 210, 8, null, GOLD + 'cc', 2); }
  if (sym === 'vault') stampText(g, 'NOT A HACK', 120, 120, -.22, '#c4162c', 21);
  if (sym === 'scatter') ribbon(g, 'WHERE IT BEGAN', 8, 0, 112, BRASS_DIM, BRASS_HI, 10);
  return c; }
// A newspaper clipping with torn edges: one real headline from the full timeline.
function headlineTile(row, i) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240); const r = seeded('hl' + row.year + row.exchange);
  g.shadowColor = '#000'; g.shadowBlur = 8; g.beginPath(); g.moveTo(14, 22); for (let x = 14; x <= 226; x += 10) g.lineTo(x, 22 + (r() - .5) * 7); g.lineTo(226, 218); for (let x = 226; x >= 14; x -= 10) g.lineTo(x, 218 + (r() - .5) * 7); g.closePath(); g.fillStyle = lin(g, 0, 20, 0, 220, ['#efe3c0', '#e2d3a8', '#d2c192']); g.fill(); g.shadowBlur = 0;
  speckle(g, 'hl' + i, 14, 22, 212, 196, 170, '#5a481c1e', '#ffffff30'); g.strokeStyle = PAPER + 'cc'; g.lineWidth = 3; g.stroke();
  fitText(g, `THE HEIST MUSEUM GAZETTE · ${row.month ? MONTHS[row.month - 1] + ' ' : ''}${row.year}`, 120, 38, 188, 9, '#5a4a30', SERIF, '900'); g.fillStyle = INK; g.fillRect(28, 46, 184, 1.5);
  wrapG(g, up(row.headline), 28, 70, 184, 21, 18, INK, 'left', 5, SERIF, '900');
  if (row.logo && logoPlate(g, row.logo, 28, 170, 96, 34, { pad: 4, r: 3, edge: '#5a481caa' })) { /* the company named in the clipping */ } else { g.fillStyle = '#5a481c88'; for (let k = 0; k < 3; k++) g.fillRect(28, 176 + k * 7, 184 - k * 36, 2); }
  stampText(g, String(row.year), 178, 196, -.14, '#b4122f', 18, .82); return c; }
// Shown only if a pool is somehow empty: the name set in type on a panel. Never invented figures.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  brassPlate(g, 'name' + sym, col.frame, 3); engraved(g, col.name, 120, 110, 176, 26); engraved(g, 'EXHIBIT CLOSED', 120, 190, 150, 11, '800', SANS); return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { bundled: 0, factsAsOf: F.asOf, done: true };
let poolsReady = false;
// The reel pools. Which tile shows in a cell is chosen after the result, with Math.random only.
function rebuildPools() {
  for (const s of Object.keys(COLS)) if (s !== 'chain') pools[s] = [0, 1, 2].map(v => ({ key: s === 'wild' ? 'cold-storage' : 'exhibit', id: `${s}${v}`, num: EX[s].year || 0, slot: s, fact: EX[s], variant: v, tile: exhibitTile(s, v), bundled: true }));
  pools.chain = TL.map((row, i) => ({ key: 'headline', id: `${row.year}-${row.exchange}`, num: row.year, slot: 'chain', fact: row, row, tile: headlineTile(row, i), bundled: true }));
  sources.bundled = Object.values(pools).reduce((a, p) => a + p.length, 0); screenDirty = true;
}
rebuildPools(); poolsReady = true;

/* ---------- Faces: which tile a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
/* ---------- The cabinet screen: a museum display wall, the reels set in a brass frame ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3, FY = 866;
(function drawBase() { const g = baseLayer.getContext('2d'), r = seeded('museum');
  g.fillStyle = lin(g, 0, 0, 1400, 960, ['#1d110b', '#130a07', '#1b0f09']); g.fillRect(0, 0, 1400, 960);
  // Dark walnut panelling: tall boards with a little grain.
  for (let x = 0; x < 1400; x += 70) { g.fillStyle = (x / 70) % 2 ? '#ffffff05' : '#00000016'; g.fillRect(x, 0, 70, 960); g.fillStyle = '#00000045'; g.fillRect(x, 0, 2, 960); for (let k = 0; k < 22; k++) { g.fillStyle = '#ffffff07'; g.fillRect(x + 4 + r() * 60, r() * 960, 1, 20 + r() * 90); } }
  const sp = g.createRadialGradient(700, 90, 40, 700, 300, 760); sp.addColorStop(0, '#ffe2a822'); sp.addColorStop(1, '#00000000'); g.fillStyle = sp; g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#ffffff05'; for (let y = 0; y < 960; y += 3) g.fillRect(0, y, 1400, 1);
  // Three brass-edged placards across the top: the pot, the jackpot, the timeline.
  const panel = (x, y, w, h, hot) => { round(g, x, y, w, h, 12, '#0b0605', hot ? BRASS_HI : BRASS + '99', hot ? 3 : 2); round(g, x + 5, y + 5, w - 10, h - 10, 9, null, '#000000aa', 2); g.save(); g.beginPath(); g.roundRect(x + 6, y + 6, w - 12, h - 12, 8); g.clip(); const gl = g.createLinearGradient(0, y, 0, y + h); gl.addColorStop(0, hot ? '#e11d4824' : '#c9a46a12'); gl.addColorStop(1, '#00000000'); g.fillStyle = gl; g.fillRect(x, y, w, h); g.restore(); for (const [px, py] of [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]]) { g.beginPath(); g.arc(px, py, 3, 0, 7); g.fillStyle = BRASS_DIM; g.fill(); } };
  panel(18, 14, 380, 172, false); panel(412, 14, 576, 172, true); panel(1002, 14, 380, 172, false);
  text(g, 'COLD STORAGE POT', 208, 42, 18, BRASS_HI, SANS, 'center', '800'); text(g, 'HEIST OF THE CENTURY', 700, 42, 22, CREAM, SANS, 'center', '800'); text(g, 'THE TIMELINE · 2011 TO 2026', 1192, 42, 16, BRASS_HI, SANS, 'center', '800');
  // The reel window: a brass frame with a crimson line inside it, and velvet behind each reel.
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#050302', lin(g, 0, RY - 14, 0, RY + RH + 14, ['#f0d9a0', '#a67c3c', '#e2c27d', '#6e4f1c']), 8);
  round(g, RX - 4, RY - 4, RW + 8, RH + 8, 12, null, ACCENT + 'bb', 2);
  for (const [x, y] of [[RX - 20, RY - 20], [RX + RW + 20, RY - 20], [RX - 20, RY + RH + 20], [RX + RW + 20, RY + RH + 20]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fillStyle = lin(g, x - 9, y - 9, x + 9, y + 9, ['#fff0c0', '#5a3f14']); g.fill(); g.strokeStyle = '#000a'; g.lineWidth = 2; g.stroke(); g.beginPath(); g.moveTo(x - 5, y + 2); g.lineTo(x + 5, y - 2); g.stroke(); }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#1d0a0fd0', '#2e0c15a0', '#1d0a0fd0']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  // The caption well along the bottom: the fact card of the exhibit on show.
  round(g, RX - 4, FY - 4, RW + 8, 50, 10, '#050302', BRASS + '77', 2);
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
// The exhibit on show: the order the museum walks you through, one every few seconds (fixed when motion is reduced).
const EXHIBIT_ORDER = ['scatter', 'cherry', 'chip', 'block', 'lemon', 'vault', 'artifact', 'bitcoin'];
const showIdx = now => motionOK() ? Math.floor(now / 7000) % EXHIBIT_ORDER.length : state.spins % EXHIBIT_ORDER.length;
// The museum spotlight: a slow warm wash across the reel window, stepped like a lamp on a track (about 10 frames a second, off with reduced motion).
function museumSweep(now) { if (!motionOK()) return; const x = RX + ((now / 9) % (RW + 600)) - 300;
  sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.globalCompositeOperation = 'lighter'; const gr = sg.createLinearGradient(x - 160, 0, x + 160, 0); gr.addColorStop(0, 'rgba(255,226,168,0)'); gr.addColorStop(.5, 'rgba(255,226,168,.07)'); gr.addColorStop(1, 'rgba(255,226,168,0)'); sg.fillStyle = gr; sg.fillRect(x - 160, RY, 320, RH); sg.restore(); }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) { sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176); if (!scene && !state.freeActive && !feature()) hits.push({ x: cellX(c), y: RY + r * RHT + 7, w: 176, h: 176, fn: () => openFact(state.grid[c][r], faces[c][r]) }); }
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = ALERT; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#ff8a7a', 5); sg.restore(); }
  }
  museumSweep(now);
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, BRASS_HI, 4); sg.save(); sg.shadowColor = BRASS_HI; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#fff0c0c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = BRASS + '55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The last 21 rounds as a row of visitor tickets: crimson by how well the round paid, dark for a miss. It scrolls; it never fills or builds towards anything.
function drawVisits() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 836;
  text(sg, 'LAST 21 VISITS', x0 - 20, y + s / 2, 12, '#9c8458', SANS, 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)], k = e && e.win > 0 ? Math.min(1, e.win / Math.max(1, e.bet) / 8) : 0; round(sg, x0 + i * (s + gap), y, s, s, 2, e ? (e.win > 0 ? `rgb(${Math.round(150 + 105 * k)},${Math.round(40 + 30 * k)},${Math.round(60 - 20 * k)})` : '#2a1d14') : '#140c08', i === n - 1 && e ? BRASS_HI : null, 1.5); } }
// The caption well: the fact card of the exhibit under the winning line, or the exhibit now on show. A teletype types it out.
function factFor(sym) { return sym === 'chain' ? null : EX[sym]; }
function drawFactStrip(now, winSym) {
  const y = FY, sym = winSym || EXHIBIT_ORDER[showIdx(now)], e = factFor(sym) || EX.scatter, key = sym + (winSym ? 'w' : 's') + (winSym ? lastResult && lastResult.wins.length : 0);
  if (drawFactStrip.key !== key) { drawFactStrip.key = key; drawFactStrip.t0 = now; }
  const shown = motionOK() ? Math.floor((now - drawFactStrip.t0) / 16) : 999;
  round(sg, RX + 8, y + 6, 92, 34, 6, ACCENT); text(sg, String(e.year), RX + 54, y + 24, 22, '#fff', MONO, 'center', '900');
  const head = `${up(e.name)} · ${up(e.dateText)} · ${e.taken || ''}${e.caveat ? ' · ' + up(e.caveat) : ''}`, lesson = `LESSON: ${e.lesson || ''}`;
  sg.save(); sg.beginPath(); sg.rect(RX + 108, y, RW - 120, 46); sg.clip();
  let t1 = head.slice(0, shown), t2 = lesson.slice(0, Math.max(0, shown - head.length)); const sz1 = 15; sg.font = `800 ${sz1}px ${MONO}`; sg.textAlign = 'left'; sg.textBaseline = 'middle';
  let fs1 = sz1; while (fs1 > 10 && sg.measureText(head).width > RW - 130) { fs1--; sg.font = `800 ${fs1}px ${MONO}`; }
  sg.fillStyle = BRASS_HI; sg.fillText(t1, RX + 114, y + 14); let fs2 = 13; sg.font = `700 ${fs2}px ${SANS}`; while (fs2 > 9 && sg.measureText(lesson).width > RW - 130) { fs2--; sg.font = `700 ${fs2}px ${SANS}`; } sg.fillStyle = '#e9d9b4'; sg.fillText(t2, RX + 114, y + 33); sg.restore(); }
/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'TIME MACHINE', vault: 'THE EMPTY VAULTS', chain: 'THE TIMELINE', jackpot: 'HEIST OF THE CENTURY', gamble: 'HOT OR COLD' };
const RULES = { free: 'Eight free spins. Every win pays 2×. Each spin moves the museum forward a year. Three more Mt. Gox exhibits add four spins.', vault: 'Nine cold-storage vaults, each sealed with a prize. Open three. Each also teaches a security lesson.', chain: 'Headlines pin to the museum wall by year. Any new one resets your three respins. Fill all fifteen for the jackpot.', jackpot: 'Five Binance 2026 exhibits on the centre row. The alarms ring, the vault door swings open and the whole meter is yours.', gamble: 'Is the wallet hot or cold? Call it. Right doubles your win. Wrong loses that win only.' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
// The vault prize tiers, named for how much sits in the vault. Each prize is a multiple of the total bet.
const TIER = { 1: 'DUST', 2: 'POCKET', 3: 'STASH', 4: 'RESERVE', 5: 'TREASURY', 8: 'DEEP COLD', 10: 'COLD HOARD', 15: 'MOTHERLODE' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
const clamp01 = t => Math.max(0, Math.min(1, t));
let sceneQueue = [], hits = [], season = null, vaultLessons = [];
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { sweep(1.3, 0, .14, 1800, 200); [0, .22, .44, .66].forEach((t, k) => { thunk(t, 1, 160 - k * 20); bell(440 * (1 + k * .25), t + .04, .05); }); clank(.9, .7); [330, 392, 494, 659].forEach((n, k) => tone(n, .5, 'triangle', .04, .9 + k * .09)); }
  if (kind === 'sting-vault') { clank(0, 1); clank(.35, .8); bell(988, .55); bell(1480, .9, .06); [196, 247, 294, 392].forEach((n, k) => tone(n, .6, 'triangle', .05, k * .09 + .3)); }
  if (kind === 'sting-chain') { teletype(14, 0); thunk(.8, 1.1, 90); bell(1175, .85, .06); [220, 277, 330, 440].forEach((n, k) => tone(n, .35, 'triangle', .035, k * .08 + .7)); }
  if (kind === 'sting-jackpot') { alarmBells(3.4, 0, .09); drum(46, .6); drum(46, .6, .6); clank(1.4, 1.2); [262, 330, 392, 523, 659, 784, 1047].forEach((n, k) => { tone(n, .9, 'triangle', .08, 1.9 + k * .09); bell(n * 2, 1.9 + k * .09, .03); }); }
  if (kind === 'sting-gamble') { bell(880); tone(147, .7, 'triangle', .05, .25); tone(139, .7, 'triangle', .05, .25); sweep(.7, .1, .06); }
  if (kind === 'whoosh') { noise(.45, 1100, .7, .16); tone(240, .45, 'sine', .05, 0, 3); }
  if (kind === 'crack') { clank(0, .6 + i * .03); bell(784 + i * 50, .15, .04); }
  if (kind === 'reveal-big') { [784, 988, 1175, 1568].forEach((n, k) => bell(n, k * .07, .07)); teletype(9, .15); drum(60, .4); }
  if (kind === 'stamp') { thunk(0, 1.3, 90); noise(.06, 1500, 2, .1); }
  if (kind === 'reset') { bell(1318.5, 0, .06); bell(1760, .1, .05); }
  if (kind === 'tick') tone(1600 + (i % 6) * 60, .03, 'sine', .025);
  if (kind === 'roll') noise(.03, 2600, 5, .1);
  if (kind === 'land') { thunk(0, 1.4, 100); bell(660, .02, .05); }
  if (kind === 'dial') { thunk(0, 1, 130); tone(900, .05, 'square', .03, 0); noise(.12, 1400, 3, .08, .02); }
  if (kind === 'cold') frost(0);
  if (kind === 'hot') fire(0);
  if (kind === 'vaultopen') { clank(0, 1.3); noise(2.2, 380, 1.2, .12, .2, 'lowpass'); drum(40, .5, .4); bell(523, 1.4, .06); }
  if (kind === 'summary') { [659, 784, 1047].forEach((n, k) => bell(n, k * .08, .06)); drum(62, .25); }
}
let musicTimer = 0;
// The Heist of the Century theme: a slow thump, a falling minor line on a bell and, now and then, the alarm.
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [293.66, 349.23, 440, 587.33, 440, 349.23, 329.63, 392, 493.88, 659.25, 493.88, 392];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k++ % seq.length]; tone(n, .3, 'triangle', .05); bell(n * 2, 0, .02); if (k % 4 === 1) { drum(52, .35); tone(n / 4, .5, 'sine', .07); } if (k % 12 === 6) alarmBells(1, 0, .05); }, state.turbo ? 90 : 160); }
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
  // A spin still pending ends the Time Machine itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } seasonOutro(); return; }
  if (state.free > 0) { status(`${state.free} TIME MACHINE SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (stage === 'play' && scene.kind === 'jackpot') sfx('vaultopen'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2600 : 1500) * speed();
// The first closed vault, so one big button can open them in order.
const nextCrate = f => [0, 1, 2, 3, 4, 5, 6, 7, 8].find(i => !f.picks.includes(i));
// The primary action: one button drives every stage (Spin, Space, the cabinet's TIME TRAVEL button, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { seasonOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage('intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { season = { t0: performance.now(), retriggers: 0, best: 0, years: [], carve: null }; scene = null; renderBar(); update(); spin(); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else if (f) pickCrate(nextCrate(f)); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'NEXT YEAR' : broke ? 'GET LAYR' : 'TIME TRAVEL'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'OPEN THE VAULT' : kind === 'free' ? 'DIAL BACK' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `OPEN · ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'FLIPPING'; }
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
  season = season || { t0: performance.now(), retriggers: 0, best: 0, years: [], carve: null };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state, roundRng()); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); advanceYear(true);
    if (r.triggers.free) season.retriggers++; season.best = Math.max(season.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; save();
}
function seasonOutro(skipped = false) { const r = E.endFree(state); if (!r) { if (spinning || state.pending) { update(); return; } if (sceneQueue.length || feature()) nextScene(); else { scene = null; update(); } return; } save(); startScene('free', { total: r.total, count: r.count, retriggers: season ? season.retriggers : 0, best: season ? season.best : 0, years: season ? season.years.map(y => y.row) : [], skipped }, 'outro'); sfx('summary'); season = null; }
function collectScene(skipped = false) {
  const f = feature(); if (!f) return; const picks = f.type === 'vault' ? f.picks.map(i => f.awards[i]) : null, cells = f.type === 'chain' ? f.frames[f.index].cells.filter(Boolean).length : 0, respins = f.type === 'chain' ? f.frames.length - 1 : 0;
  const opened = f.type === 'vault' ? f.picks.map(i => lessonFor(i)) : null, locked_ = f.type === 'chain' ? f.frames[f.index].cells.map((v, i) => v ? { v, row: pinnedRow(i) } : null) : null;
  const c = E.collect(state); if (!c) return; save(); winUntil = performance.now() + 4000;
  if (!skipped) { sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 30); }
  if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', data: { amount: c.jackpotWin, fromGrab: true } });
  vaultLessons = [];
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, opened, tablet: locked_, cells, respins, bet: f.bet, skipped }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { const nowT = performance.now(); if (scene.rollEnd && nowT < scene.rollEnd) return; const fr0 = f.frames[f.index], before = fr0.left, openBefore = []; fr0.cells.forEach((v, i) => { if (!v) openBefore.push(i); }); const fr = E.respin(state); save();
    // The result is already committed; the open slots now roll real headlines and stop one by one (column by column, row by row), the winners stamping in as they stop.
    const mo = motionOK(), sp = speed(), stopAt = i => nowT + (mo ? 700 + (i % 5) * 120 + Math.floor(i / 5) * 70 : 250) * sp; let end = nowT + 250 * sp; scene.rollCells = {}; openBefore.forEach(i => { const st = stopAt(i); scene.rollCells[i] = st; if (st > end) end = st; });
    scene.rollAt = nowT; scene.rollEnd = end; scene.leftBefore = before; chainFlash = end; sound('respin');
    openBefore.forEach(i => { const d = Math.max(0, scene.rollCells[i] - nowT); if (fr.added.includes(i)) { scene.stampAt[i] = scene.rollCells[i]; setTimeout(() => sfx('stamp'), d); } else setTimeout(() => sfx('tick', i), d); });
    if (fr.added.length && before < 3) { scene.resetAt = end + 100; setTimeout(() => sfx('reset'), Math.max(0, end - nowT) + 250); }
    renderBar(); update(); }
  else toast('Open three vaults first.'); }
function pickCrate(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f || i == null) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); sfx('crack', i); if (motionOK()) { const [x, y, w, h] = capsuleRect(i); spark(x + w / 2, y + h * .5, 22, { spread: Math.PI * 1.6, v: 340 }); shake(5); } if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), 520 * speed()); else setTimeout(() => sound('pick', i), 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
// Hot or Cold. The call maps onto the engine's even/odd draw: hot = even, cold = odd. The engine's own 50/50 decides the fate.
const CALL = { hot: 'even', cold: 'odd' };
function callGamble(call) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, CALL[call], gambleRng(CALL[call])); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, call, fate: r.parity === 'even' ? 'hot' : 'cold' }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }
// Which security lesson sits in vault i (the nine are shuffled each round). Cosmetic: chosen with Math.random after the prizes are fixed.
function lessonFor(i) { if (vaultLessons.length !== 9) { const pool = LESSONS.length ? LESSONS.slice() : [{ title: 'COLD STORAGE', line: 'Keys kept offline cannot be taken from a server.', from: '' }]; for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; } vaultLessons = Array.from({ length: 9 }, (_, k) => pool[k % pool.length]); } return vaultLessons[i]; }
// The headline pinned in timeline cell i of The Timeline: cell i is the i-th hack in date order, so the wall reads as a timeline left to right, top to bottom.
const pinnedRow = i => TL15[i % TL15.length];
// The Time Machine moves the museum forward a year after every spin: step k shows the k-th hack in date order.
function advanceYear(quiet = false) { if (!season) return; const k = season.years.length, row = TL[k % TL.length], e = { t0: performance.now(), row, k }; season.years.push(e); season.carve = e;
  if (!quiet) { sfx('dial'); spark(700, 820, 22, { spread: Math.PI * 1.4, v: 300, c: BRASS_HI }); shake(3); } screenDirty = true; }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
// Sparks and the screen shake are cosmetic and use Math.random; they never touch the engine.
let sparks = [], shakeAmp = 0, shakeAt = 0;
function spark(x, y, n = 8, o = {}) { if (!motionOK()) return; const t = performance.now(); for (let i = 0; i < n; i++) { const a = (o.dir != null ? o.dir : -Math.PI / 2) + (Math.random() - .5) * (o.spread || Math.PI * 1.2), v = (o.v || 260) * (.4 + Math.random() * .9); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: t, life: (o.life || 750) * (.6 + Math.random() * .8), s: (o.s || 3) * (.6 + Math.random() * .8), c: o.c || (Math.random() < .5 ? BRASS_HI : '#fff4dc') }); } if (sparks.length > 420) sparks.splice(0, sparks.length - 420); }
function shake(a = 8) { if (!motionOK()) return; shakeAmp = a; shakeAt = performance.now(); }
function drawSparks(now) { if (!sparks.length) return; sparks = sparks.filter(p => now - p.t0 < p.life); sg.save(); sg.globalCompositeOperation = 'lighter';
  for (const p of sparks) { const t = (now - p.t0) / 1000, k = 1 - (now - p.t0) / p.life; sg.globalAlpha = Math.max(0, k); sg.fillStyle = p.c; sg.beginPath(); sg.arc(p.x + p.vx * t, p.y + p.vy * t + 350 * t * t, p.s * (.4 + k * .6), 0, 7); sg.fill(); } sg.restore(); }
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, [ACCENT_HI, ACCENT, '#8f0f2c']) : '#160d09', primary ? BRASS_HI : BRASS_DIM, 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? CREAM : BRASS_HI, SANS, 'center', '900'); hits.push({ x, y, w, h, fn }); }
function skipChip() { if (canSkip()) button('SKIP ›', RX + RW - 150, RY + RH + 10, 130, 46, skipScene, false); }
function wrapText(s, x, y, maxW, lh, color, size, align = 'center') { sg.font = `700 ${size}px ${SANS}`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, SANS, align, '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, SANS, align, '700'); return yy; }
// A walnut display plaque with a brass edge.
function slab(x, y, w, h, o = {}) { const r = o.r ?? 14; sg.save(); sg.globalAlpha = o.alpha ?? 1; if (o.glow) { sg.shadowColor = o.glow; sg.shadowBlur = 26; }
  round(sg, x, y, w, h, r, lin(sg, x, y, x, y + h, ['#34200f', '#1d1209', '#120a06']), o.edge || BRASS_DIM, 3); sg.shadowBlur = 0; round(sg, x + 5, y + 5, w - 10, h - 10, Math.max(2, r - 4), null, '#000000aa', 2);
  if (o.seam !== false) { sg.strokeStyle = (o.seamColor || BRASS) + '66'; sg.lineWidth = 2; sg.beginPath(); sg.moveTo(x + r, y + h - 3); sg.lineTo(x + w - r, y + h - 3); sg.stroke(); } sg.restore(); }
// Glowing engraved letters. p = how much has been revealed (0..1); the reveal edge is white-hot, like a lamp sweeping a plaque.
function glowText(s, x, y, size, p = 1, now = 0, o = {}) {
  sg.save(); sg.font = `900 ${size}px ${o.font || SANS}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; const w = sg.measureText(s).width, x0 = x - w / 2;
  sg.fillStyle = '#000000aa'; sg.fillText(s, x + 2, y + 3); sg.fillStyle = o.ghost || '#2a1b10'; sg.fillText(s, x, y);
  if (p > 0) { sg.save(); sg.beginPath(); sg.rect(x0 - 12, y - size, w * p + 12, size * 2); sg.clip(); const gr = sg.createLinearGradient(0, y - size * .5, 0, y + size * .5); (o.stops || ['#fff4dc', '#ecd29a', '#a67c3c']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c));
    sg.shadowColor = o.glow || BRASS_HI; sg.shadowBlur = o.blur ?? size * .3; sg.fillStyle = gr; sg.fillText(s, x, y); sg.restore(); }
  sg.restore();
  if (p > 0 && p < 1 && motionOK()) { const ex = x0 + w * p; sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(ex, y, 0, ex, y, size * .6); rg.addColorStop(0, 'rgba(255,240,200,.9)'); rg.addColorStop(1, 'rgba(255,210,120,0)'); sg.fillStyle = rg; sg.fillRect(ex - size, y - size, size * 2, size * 2); sg.restore(); if (Math.floor(now / 50) !== Math.floor((now - 17) / 50)) spark(ex, y + size * .2, 2, { v: 180, spread: Math.PI, dir: -Math.PI / 2, life: 450 }); }
}
const tileForRow = row => { const it = pools.chain.find(x => x.row === row) || pools.chain[0]; return it ? it.tile : names.chain; };
const yearOfRow = row => row ? row.year : '';
// Steel rivets round a rectangle (the vault, the cases).
function rivets(x, y, w, h, step = 46, col = '#8b8f98') { sg.save(); sg.fillStyle = col; for (let xx = x + 12; xx < x + w; xx += step) { for (const yy of [y + 10, y + h - 10]) { sg.beginPath(); sg.arc(xx, yy, 2.4, 0, 7); sg.fill(); } } sg.restore(); }
// The vault wheel: a steel door with a spoked handle, turning. open: 0..1 swings the door away on its hinge.
function drawVaultDoor(cx, cy, r, turn, open = 0, glow = null) { sg.save(); sg.translate(cx, cy); if (glow) { sg.shadowColor = glow; sg.shadowBlur = 30; }
  if (open > 0) { sg.fillStyle = lin(sg, 0, -r, 0, r, ['#fff0b8', '#c9a04a', '#4a3410']); sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fill(); sg.shadowBlur = 0; }
  sg.save(); sg.scale(Math.max(.04, 1 - open * .96), 1); sg.translate(-open * r * .3, 0);
  sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fillStyle = lin(sg, -r, -r, r, r, ['#9aa1ab', '#4b515b', '#22262c']); sg.fill(); sg.shadowBlur = 0; sg.lineWidth = Math.max(2, r * .06); sg.strokeStyle = '#0d0f12'; sg.stroke();
  sg.beginPath(); sg.arc(0, 0, r * .82, 0, 7); sg.strokeStyle = '#c3c8d0aa'; sg.lineWidth = Math.max(1.5, r * .03); sg.stroke();
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; sg.beginPath(); sg.arc(Math.cos(a) * r * .9, Math.sin(a) * r * .9, Math.max(1.5, r * .035), 0, 7); sg.fillStyle = '#d6dae0'; sg.fill(); }
  sg.rotate(turn); sg.strokeStyle = lin(sg, -r, 0, r, 0, ['#7d6238', '#ecd29a', '#7d6238']); sg.lineCap = 'round'; sg.lineWidth = Math.max(3, r * .1); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; sg.beginPath(); sg.moveTo(-Math.cos(a) * r * .62, -Math.sin(a) * r * .62); sg.lineTo(Math.cos(a) * r * .62, Math.sin(a) * r * .62); sg.stroke(); }
  sg.beginPath(); sg.arc(0, 0, r * .2, 0, 7); sg.fillStyle = lin(sg, -r * .2, -r * .2, r * .2, r * .2, ['#fff0c0', '#8a6a2a']); sg.fill(); sg.strokeStyle = '#2a1c08'; sg.lineWidth = 2; sg.stroke(); sg.restore(); sg.restore(); }
// The museum hall behind each bonus.
const STARS = (() => { const r = seeded('hall'); return Array.from({ length: 70 }, () => ({ x: r() * 1400, y: r() * 960, s: .6 + r() * 1.6, z: .2 + r() })); })();
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  const X = kind === 'jackpot' && scene && scene.stage === 'play' ? 0 : RX, Y = X ? RY : 0, W = X ? RW : 1400, H = X ? RH : 960;
  if (kind === 'free') { g.fillStyle = lin(g, 0, Y, 0, Y + H, ['#0c0a14', '#14101c', '#0a0810']); g.fillRect(X, Y, W, H); const t = motionOK() ? now : 0; g.save(); g.translate(700, RY + RH / 2); g.globalAlpha = .22 * dim; g.strokeStyle = BRASS; for (const rr of [250, 200, 140]) { g.lineWidth = 2; g.beginPath(); g.arc(0, 0, rr, 0, 7); g.stroke(); } g.rotate(t / 9000); g.lineWidth = 6; for (let k = 0; k < 16; k++) { g.beginPath(); g.moveTo(0, -262); g.lineTo(0, -k % 4 ? 242 : 226); g.stroke(); g.rotate(Math.PI / 8); } g.restore(); }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, Y, 0, Y + H, ['#2b3038', '#171a1f', '#0c0e11']); g.fillRect(X, Y, W, H); g.save(); g.globalAlpha = .1 * dim; g.strokeStyle = '#c3c8d0'; g.lineWidth = 1; for (let gx = X; gx < X + W; gx += 70) { g.beginPath(); g.moveTo(gx, Y); g.lineTo(gx, Y + H); g.stroke(); } g.restore(); rivets(RX, RY, RW, RH, 60); }
  if (kind === 'chain') { g.fillStyle = lin(g, 0, Y, 0, Y + H, ['#1b120b', '#241710', '#140c07']); g.fillRect(X, Y, W, H); g.save(); g.globalAlpha = .1 * dim; g.strokeStyle = BRASS; for (let gx = X; gx < X + W; gx += 30) { g.beginPath(); g.moveTo(gx, Y); g.lineTo(gx, Y + H); g.stroke(); } g.restore(); }
  if (kind === 'jackpot') { const pulse = motionOK() ? .5 + .5 * Math.sin(now / 140) : .6; g.fillStyle = lin(g, 0, Y, 0, Y + H, ['#1a0306', '#3a0710', '#12030a']); g.fillRect(X, Y, W, H); g.save(); g.globalCompositeOperation = 'lighter'; for (const sx of [X + 40, X + W - 40]) { const rg = g.createRadialGradient(sx, Y + 40, 0, sx, Y + 40, 560); rg.addColorStop(0, `rgba(255,40,70,${.35 * pulse})`); rg.addColorStop(1, 'rgba(255,40,70,0)'); g.fillStyle = rg; g.fillRect(X, Y, W, H); } g.restore(); g.fillStyle = '#fff'; for (const s of STARS) { g.globalAlpha = (.15 + .25 * s.z) * dim; g.fillRect(s.x, s.y, s.s, s.s); } g.globalAlpha = 1; }
  if (kind === 'gamble') { g.fillStyle = lin(g, X, 0, X + W, 0, ['#0d2433', '#0a1822', '#2a0f06', '#3d1706']); g.fillRect(X, Y, W, H); const t = motionOK() ? now : 0; g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { const sx = X + ((hashStr('sn' + i) % (W / 2 - 20)) + Math.sin(t / 900 + i) * 8), sy = Y + (((t / 25 + hashStr('sy' + i)) % (H + 20)) - 10); g.globalAlpha = .35 * dim; g.fillRect(sx, sy, 3, 3); } g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const fx = X + W / 2 + 80 + (hashStr('fx' + i) % (W / 2 - 160)), rg = g.createRadialGradient(fx, Y + H + 10, 0, fx, Y + H + 10, 260 + (motionOK() ? Math.sin(t / 200 + i) * 30 : 0)); rg.addColorStop(0, 'rgba(255,138,42,.4)'); rg.addColorStop(1, 'rgba(255,138,42,0)'); g.fillStyle = rg; g.fillRect(X, Y, W, H); } }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.4) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 40 + (1 - k) * -140;
  slab(RX, y - 86, RW, 172, { r: 0, glow: ACCENT }); sg.fillStyle = ACCENT; sg.fillRect(RX, y - 90, RW, 5); sg.fillRect(RX, y + 85, RW, 5);
  const p = motionOK() ? clamp01((t - .08) / .62) : 1; glowText(title, 700, y - 14, title.length > 16 ? 72 : 84, p, now); if (p >= 1 && !scene.struck) { scene.struck = true; shake(9); sfx('land'); spark(700, y, 40, { spread: Math.PI * 2, v: 420 }); }
  text(sg, sub, 700, y + 54, 22, BRASS_HI, SANS, 'center', '800'); sg.restore(); }
function triggerSub(kind, cells) { const r = lastResult;
  if (kind === 'free') return `${cells.length} × MT. GOX${r && r.scatterPay ? ` · PAY ${fmt(r.scatterPay)} LAYR` : ''} · 8 SPINS BACK THROUGH 2011–2026 AT 2×`;
  if (kind === 'vault') return `${cells.length} × QUADRIGACX · NINE COLD-STORAGE VAULTS · OPEN THREE`;
  if (kind === 'chain') return `${cells.length} × HEADLINE · PIN THEM TO THE MUSEUM WALL`;
  if (kind === 'jackpot') return 'FIVE BINANCE 2026 EXHIBITS ON THE CENTRE ROW';
  return `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL`; }
// The gamble's subject: a wallet that flips between hot (flame orange, online) and cold (ice blue, offline). mode: 'ready' | 'hot' | 'cold'. p: 0..1 of the final settle.
function drawWallet(cx, cy, s, now, mode, spinT = 0) { const mo = motionOK(); const flip = mode === 'ready' ? (mo ? Math.cos(spinT * Math.PI * 6) : 1) : 1; const hot = mode === 'hot' || (mode === 'ready' && flip < 0), col = hot ? HOT : COLD, col2 = hot ? '#ffd27a' : '#e8f6ff';
  sg.save(); sg.translate(cx, cy + (mode === 'ready' && mo ? Math.sin(now / 420) * 4 : 0)); sg.scale(Math.max(.08, Math.abs(flip)), 1);
  sg.shadowColor = col; sg.shadowBlur = 36; round(sg, -s / 2, -s * .34, s, s * .68, s * .09, lin(sg, 0, -s * .34, 0, s * .34, hot ? ['#5a2410', '#2b0f06'] : ['#183347', '#0b1a26']), col, Math.max(3, s * .03)); sg.shadowBlur = 0;
  round(sg, -s / 2 + s * .06, -s * .34 + s * .06, s - s * .12, s * .14, s * .04, col + '55', null); round(sg, s * .14, -s * .09, s * .36, s * .2, s * .05, col2 + '33', col2, 3);
  sg.beginPath(); sg.arc(s * .27, s * .01, s * .045, 0, 7); sg.fillStyle = col2; sg.fill();
  if (hot) { sg.fillStyle = HOT; sg.beginPath(); sg.moveTo(-s * .26, s * .2); sg.quadraticCurveTo(-s * .38, -s * .02, -s * .22, -s * .16); sg.quadraticCurveTo(-s * .22, s * .0, -s * .12, -s * .06); sg.quadraticCurveTo(-s * .06, s * .06, -s * .12, s * .2); sg.closePath(); sg.fill(); sg.fillStyle = '#ffd27a'; sg.beginPath(); sg.moveTo(-s * .2, s * .2); sg.quadraticCurveTo(-s * .26, s * .06, -s * .17, -s * .02); sg.quadraticCurveTo(-s * .12, s * .08, -s * .14, s * .2); sg.closePath(); sg.fill(); }
  else { sg.strokeStyle = col2; sg.lineWidth = Math.max(2, s * .02); sg.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; sg.beginPath(); sg.moveTo(-s * .2 - Math.cos(a) * s * .1, s * .06 - Math.sin(a) * s * .1); sg.lineTo(-s * .2 + Math.cos(a) * s * .1, s * .06 + Math.sin(a) * s * .1); sg.stroke(); } }
  sg.restore(); if (mode === 'ready') text(sg, hot ? 'HOT' : 'COLD', cx, cy + s * .5, Math.max(14, s * .13), col2, SANS, 'center', '900'); }

// stage 1: the trigger
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(8,3,3,${Math.min(.72, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  if (motionOK() && t < .5) { sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(700, RY + RH, 0, 700, RY + RH, 700); rg.addColorStop(0, `rgba(225,29,72,${.5 * t * 2})`); rg.addColorStop(1, 'rgba(225,29,72,0)'); sg.fillStyle = rg; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : ACCENT_HI; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore();
    if (!scene.lit) scene.lit = new Set(); if (!scene.lit.has(k)) { scene.lit.add(k); spark(RX + c * CW + CW / 2, RY + r * RHT + RHT / 2, 14, { spread: Math.PI * 2, v: 220 }); } });
  if (kind === 'gamble') drawWallet(700, RY + RH / 2 - 40, 150 * ease(t * 2), now, 'ready', 0);
  if (t > .45) titleCard(TITLES[kind], triggerSub(kind, cells), now, (t - .45) * 1.5);
  if (t >= 1) setStage('intro'); }

// stage 2: the intro (a short themed transition, one line of rules, a Start button)
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (700 * speed()), a = Math.min(1, t), mo = motionOK();
  backdrop(kind, now); sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.globalAlpha = a; const yIn = mo ? (1 - ease(t)) * 40 : 0, hx = 330, hy = RY + 250 + yIn;
  if (kind === 'free') { drawTimeDial(hx, hy - 10, 150, mo ? Math.floor((now / 420) % 16) : 0, now, true); }
  if (kind === 'vault') { drawVaultDoor(hx, hy - 10, 135, mo ? now / 1400 : 0, 0, ACCENT); }
  if (kind === 'chain') { slab(hx - 190, hy - 150, 380, 290, { glow: BRASS, edge: BRASS_DIM }); const filled = mo ? Math.floor(now / 380) % 16 : 8; for (let i = 0; i < 15; i++) { const x = hx - 174 + (i % 5) * 70, y = hy - 134 + Math.floor(i / 5) * 86, on = i < filled; round(sg, x, y, 62, 74, 6, on ? PAPER : '#140c07', on ? BRASS_HI : BRASS_DIM, on ? 2 : 1.5); if (on) { sg.fillStyle = INK; sg.fillRect(x + 8, y + 10, 46, 5); sg.fillRect(x + 8, y + 22, 30, 5); text(sg, String(TL15[i] ? TL15[i].year : ''), x + 31, y + 56, 14, '#8f0f2c', MONO, 'center', '900'); } } }
  if (kind === 'jackpot') { drawVaultDoor(hx, hy - 10, 150, mo ? Math.sin(now / 300) * .08 : 0, 0, ALERT); if (mo && Math.floor(now / 300) % 2) { sg.fillStyle = '#ff3b3b33'; sg.fillRect(RX, RY, RW, RH); } }
  if (kind === 'gamble') { sg.save(); sg.translate(hx, hy - 10); for (let k = 0; k < 3; k++) { const ph = mo ? ((now / 1400 + k / 3) % 1) : k / 3; sg.globalAlpha = (1 - ph) * .45; sg.strokeStyle = k % 2 ? HOT : COLD; sg.lineWidth = 2; sg.beginPath(); sg.arc(0, 0, 90 + ph * 130, 0, 7); sg.stroke(); } sg.restore(); drawWallet(hx, hy - 10, 170, now, 'ready', mo ? (now % 2400) / 2400 : 0); }
  glowText(TITLES[kind], 890, RY + 150 + yIn, kind === 'gamble' ? 60 : kind === 'chain' ? 56 : kind === 'vault' ? 56 : kind === 'jackpot' ? 50 : 62, mo ? clamp01(t * 1.6) : 1, now);
  wrapText(RULES[kind], 890, RY + 232 + yIn, 640, 30, CREAM, 25);
  sg.restore();
  if (kind === 'gamble') { text(sg, `${fmt(scene.data.stake)} LAYR RIDES ON IT`, 890, RY + 330, 24, GOLD, SANS, 'center', '900'); button('HOT', 640, RY + 380, 190, 84, () => callGamble('hot')); button('COLD', 850, RY + 380, 170, 84, () => callGamble('cold')); button('KEEP WIN', 1040, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'OPEN THE VAULT' : kind === 'free' ? 'DIAL BACK' : 'START', 710, RY + 380, 360, 88, primaryAction);
  skipChip(); }

/* --- Time Machine: a brass dial, sixteen years round it (2011 to 2026) --- */
const YEARS = Array.from({ length: 16 }, (_, i) => 2011 + i);
function drawTimeDial(cx, cy, r, idx, now, big = false) { const mo = motionOK(); sg.save(); sg.translate(cx, cy);
  sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fillStyle = lin(sg, -r, -r, r, r, ['#3a2a14', '#1a1209', '#2c1f0e']); sg.fill(); sg.lineWidth = Math.max(3, r * .06); sg.strokeStyle = lin(sg, -r, -r, r, r, ['#f0d9a0', '#a67c3c', '#e2c27d']); sg.stroke();
  for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + k / 16 * Math.PI * 2, lit = k <= idx; sg.beginPath(); sg.moveTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8); sg.lineTo(Math.cos(a) * r * .92, Math.sin(a) * r * .92); sg.lineWidth = lit ? Math.max(3, r * .04) : 2; sg.strokeStyle = k === idx ? ACCENT_HI : lit ? BRASS_HI : BRASS_DIM; sg.stroke();
    if (big || k % 5 === 0 || k === idx) text(sg, String(YEARS[k]).slice(2), Math.cos(a) * r * .66, Math.sin(a) * r * .66, Math.max(9, r * (big ? .11 : .15)), k === idx ? ACCENT_HI : lit ? BRASS_HI : '#6b5632', MONO, 'center', '900'); }
  const a = -Math.PI / 2 + idx / 16 * Math.PI * 2 + (mo ? Math.sin(now / 90) * .015 : 0); sg.save(); sg.rotate(a + Math.PI / 2); sg.fillStyle = ACCENT; sg.shadowColor = ACCENT_HI; sg.shadowBlur = 14; sg.beginPath(); sg.moveTo(0, -r * .76); sg.lineTo(r * .06, 0); sg.lineTo(-r * .06, 0); sg.closePath(); sg.fill(); sg.restore();
  sg.beginPath(); sg.arc(0, 0, r * .09, 0, 7); sg.fillStyle = BRASS_HI; sg.fill();
  text(sg, String(YEARS[Math.max(0, Math.min(15, idx))]), 0, r * .3, Math.max(14, r * .22), CREAM, MONO, 'center', '900'); sg.restore(); }
// During the Time Machine the foot of the reel window becomes a rail of sixteen years, lit as you travel; the caption under it tells that year's exhibit.
function drawTimePlay(now) {
  const w = drawReels(now), wy = 782, wh = 74, yrs = season ? season.years : [], cur = yrs.length ? yrs[yrs.length - 1] : null, mo = motionOK();
  slab(RX, wy, RW, wh, { edge: BRASS_DIM, seamColor: ACCENT }); const rowIdx = cur ? TL.indexOf(cur.row) : -1, lastIdx = rowIdx < 0 ? -1 : YEARS.indexOf(cur.row.year);
  drawTimeDial(RX + 52, wy + wh / 2, 30, Math.max(0, lastIdx), now);
  for (let k = 0; k < 16; k++) { const x = RX + 118 + k * 71, seen = yrs.some(y => y.row.year === YEARS[k]), on = k === lastIdx, pulse = on && cur && mo ? clamp01(1 - (now - cur.t0) / 900) : 0;
    round(sg, x, wy + 12, 62, 28, 5, on ? ACCENT : seen ? '#4a3418' : '#120b07', on ? ACCENT_HI : seen ? BRASS_HI : '#4a3a22', on ? 3 : 1.5); if (pulse) { sg.save(); sg.shadowColor = ACCENT_HI; sg.shadowBlur = 24 * pulse; round(sg, x, wy + 12, 62, 28, 5, null, ACCENT_HI, 3); sg.restore(); }
    text(sg, String(YEARS[k]), x + 31, wy + 27, 15, on ? '#fff' : seen ? BRASS_HI : '#6b5632', MONO, 'center', '900'); }
  text(sg, cur ? `${cur.row.year} · ${up(cur.row.exchange)} · ${cur.row.taken}` : 'DIAL BACK TO 2011 · EACH SPIN MOVES THE MUSEUM ON A YEAR', RX + 118 + 8 * 71, wy + 56, 15, cur ? CREAM : '#a58a58', MONO, 'center', '800');
  const left = state.free, total = state.freeTotal;
  slab(300, RY - 36, 800, 46, { r: 12, edge: ACCENT, seam: false }); text(sg, `TIME MACHINE · ${left} SPIN${left === 1 ? '' : 'S'} LEFT · ${fmt(total)} LAYR · ALL WINS 2×`, 700, RY - 12, 20, CREAM, SANS, 'center', '900');
  return w; }
// The caption well in the Time Machine: the year just reached, in the strip under the rail.
function drawYearCaption(now) { const yrs = season ? season.years : [], cur = yrs.length ? yrs[yrs.length - 1].row : null, y = FY;
  if (!cur) { text(sg, 'EVERY SPIN MOVES THE MUSEUM ON A YEAR · WINS PAY 2×', 700, y + 22, 17, BRASS_HI, SANS, 'center', '800'); return; }
  round(sg, RX + 8, y + 6, 92, 34, 6, ACCENT); text(sg, String(cur.year), RX + 54, y + 24, 22, '#fff', MONO, 'center', '900');
  sg.save(); sg.beginPath(); sg.rect(RX + 108, y, RW - 120, 46); sg.clip(); const head = `${up(cur.exchange)} · ${cur.taken}`, how = `${cur.how || ''}`; text(sg, head, RX + 114, y + 14, 15, BRASS_HI, MONO, 'left', '800'); let fs = 13; sg.font = `700 ${fs}px ${SANS}`; while (fs > 9 && sg.measureText(how).width > RW - 130) { fs--; sg.font = `700 ${fs}px ${SANS}`; } text(sg, how, RX + 114, y + 33, fs, '#e9d9b4', SANS, 'left', '700'); sg.restore(); }

/* --- The Empty Vaults: nine cold-storage vault doors, open three --- */
function drawVaultsPlay(f, now) {
  backdrop('vault', now, .8); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, mo = motionOK();
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], big = m >= 8, lesson = lessonFor(i), dr = (h - 26) / 2, dcx = x + 16 + dr + 4, dcy = y + h / 2;
    if (picked) { const t = at ? (now - at) / (900 * speed()) : 9, open = mo ? clamp01(t / .55) : 1;
      sg.save(); if (big && t > .5) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); } slab(x, y, w, h, { edge: big ? GOLD : BRASS_HI, seamColor: big ? GOLD : BRASS, seam: false }); sg.restore();
      drawVaultDoor(dcx, dcy, dr, 0, open, big && t > .5 ? GOLD : null);
      if (t > .45) { const k = mo ? ease((t - .45) / .45) : 1, shown = Math.max(1, Math.round(m * Math.min(1, k * 1.2))), cxm = x + 16 + dr * 2 + 12 + (w - 16 - dr * 2 - 20) / 2; sg.save(); sg.globalAlpha = k;
        text(sg, TIER[m] || '', cxm, y + 22, 14, big ? '#fff1b8' : GOLD, SANS, 'center', '900'); text(sg, `${shown}×  ${fmt(shown * f.bet)}`, cxm, y + 58, 34, '#ffffff', SANS, 'center', '900');
        sg.fillStyle = '#00000066'; sg.fillRect(cxm - 112, y + 82, 224, 1); text(sg, lesson.title, cxm, y + 98, 13, ACCENT_HI, SANS, 'center', '900'); sg.font = `700 12px ${SANS}`; wrapText(lesson.line, cxm, y + 116, 226, 15, '#e9d9b4', 12); sg.restore(); } }
    else if (done && now - doneAt > 900 * speed()) { slab(x, y, w, h, { alpha: .55, seam: false }); sg.save(); sg.globalAlpha = .5; drawVaultDoor(dcx, dcy, dr, 0, 0); sg.restore(); text(sg, TIER[m] || '', x + w * .68, y + h / 2 - 20, 15, '#7a6a52', SANS, 'center', '900'); text(sg, `${m}×`, x + w * .68, y + h / 2 + 16, 36, '#7a6a52', SANS, 'center', '900'); }
    else { const turn = mo ? Math.sin(now / 700 + i) * .15 : 0; slab(x, y, w, h, { seam: false }); drawVaultDoor(dcx, dcy, dr, turn, 0); text(sg, `VAULT ${i + 1}`, x + w * .68, y + h / 2 - 30, 28, BRASS_HI, SANS, 'center', '900'); text(sg, 'COLD STORAGE', x + w * .68, y + h / 2 + 2, 14, CREAM, SANS, 'center', '800'); text(sg, 'TAP TO OPEN', x + w * .68, y + h / 2 + 32, 14, '#a58a58', SANS, 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickCrate(i) }); } }
  if (done && now - doneAt > 900 * speed()) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }

/* --- The Timeline: fifteen cases on the museum wall, one per year-headline; every lock pins a real headline --- */
function drawRollCell(i, x, y, w, h, now, stop) {
  const mo = motionOK(), left = Math.max(0, stop - now), T = 136, pool = pools.chain.length ? pools.chain : [{ tile: names.chain }];
  slab(x, y, w, h, { alpha: .95, seam: false, edge: BRASS_HI, glow: mo ? BRASS : null });
  sg.save(); sg.beginPath(); sg.roundRect(x + 5, y + 5, w - 10, h - 10, 10); sg.clip();
  const p = mo ? 2400 * (left / 1000) * (left / 1000) : 0, idx = Math.floor(p / T), frac = p - idx * T, vel = mo ? Math.min(1, left / 380) : 0, base = y + 8 + (h - 16 - 128) / 2;
  for (let k = -1; k <= 1; k++) { const ty = base + k * T - frac, it = pool[(((idx + k + i * 3) % pool.length) + pool.length) % pool.length]; sg.globalAlpha = .55 + .45 * (1 - Math.min(1, Math.abs(ty - base) / T)); sg.drawImage(it.tile, x + 8, ty, 128, 128);
    if (vel > .15) { sg.globalAlpha *= .35 * vel; sg.drawImage(it.tile, x + 8, ty + 14 * vel, 128, 128); } }
  sg.globalAlpha = 1; const vx = x + 128 + (w - 128 + 8) / 2, ghost = [2, 3, 5, 8, 10, 15, 25, 50];
  sg.globalAlpha = .35 + .35 * vel; text(sg, `${ghost[(Math.floor(now / 70) + i * 3) % ghost.length]}×`, vx, y + h / 2 - 6, 36, BRASS_HI, SANS, 'center', '900'); sg.globalAlpha = .6; text(sg, 'SEARCHING…', vx, y + h / 2 + 30, 11, '#c9a46a', SANS, 'center', '800');
  if (mo) { sg.globalAlpha = .4; sg.fillStyle = '#fff0c0'; sg.fillRect(x, y + ((now / 4 + i * 43) % (h + 20)) - 10, w, 5); }
  sg.restore(); }
function drawTimelinePlay(f, now) {
  backdrop('chain', now, .9); const fr = f.frames[f.index], tot = fr.cells.reduce((a, v) => a + v, 0), mo = motionOK(), n = fr.cells.filter(Boolean).length, full = n === 15;
  sg.save(); round(sg, RX + 4, RY + 4, RW - 8, RH - 8, 12, null, full ? GOLD : BRASS_DIM, full ? 5 : 3); sg.restore();
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 10, y = RY + Math.floor(i / 5) * RHT + 10, w = CW - 23, h = RHT - 20, at = scene.stampAt[i], rollStop = scene.rollCells && scene.rollCells[i], row = pinnedRow(i);
    if (rollStop && now < rollStop) { drawRollCell(i, x, y, w, h, now, rollStop); return; }
    if (v) { const t = at ? (now - at) / (420 * speed()) : 9; if (t < 0) { slab(x, y, w, h, { seam: false, alpha: .8 }); return; }
      if (!scene.carved) scene.carved = {}; if (!scene.carved[i]) { scene.carved[i] = 1; if (at) { shake(4); spark(x + 80, y + h / 2, 22, { spread: Math.PI * 2, v: 300 }); } }
      const s = mo ? 1 + .7 * (1 - ease(t)) : 1; slab(x, y, w, h, { edge: t < 1.5 ? CREAM : BRASS_HI, seamColor: ACCENT, glow: t < 1.5 && mo ? BRASS_HI : null });
      sg.save(); sg.globalAlpha = Math.min(1, t * 3); const ts = 128 * s; sg.drawImage(tileForRow(row), x + 8 + (128 - ts) / 2, y + 8 + (h - 16 - ts) / 2 + (h - 16 - 128) / 2, ts, ts);
      if (t > .5) { const vx = x + 128 + (w - 128 + 8) / 2; text(sg, String(row.year), vx, y + 24, 14, ACCENT_HI, MONO, 'center', '900'); glowText(`${v}×`, vx, y + h / 2 - 6, 40, mo ? clamp01((t - .5) * 3) : 1, now); text(sg, `${fmt(v * f.bet)}`, vx, y + h / 2 + 30, 17, CREAM, SANS, 'center', '800'); text(sg, 'LAYR', vx, y + h / 2 + 48, 10, '#c9a46a', SANS, 'center', '800'); } sg.restore(); }
    else { slab(x, y, w, h, { alpha: .6, seam: false, edge: '#4a3a22' }); sg.save(); sg.setLineDash([8, 6]); sg.lineDashOffset = mo ? -now / 45 : 0; round(sg, x + 14, y + 14, w - 28, h - 28, 6, null, BRASS + '99', 2); sg.restore();
      text(sg, String(row.year), x + w / 2, y + h / 2 - 12, 30, '#6b5632', MONO, 'center', '900'); text(sg, 'EMPTY CASE', x + w / 2, y + h / 2 + 18, 14, '#8a6f40', SANS, 'center', '900'); } });
  // Respins left: three lamps that visibly refill whenever a new headline is pinned.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0; sg.save(); round(sg, RX + 14, RY - 26, 300, 36, 12, '#0b0605e6', rs ? CREAM : BRASS_DIM, rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, RY - 8, 20, CREAM, SANS, 'center', '900');
  const leftShown = scene.rollEnd && now < scene.rollEnd ? scene.leftBefore : fr.left; for (let k = 0; k < 3; k++) { const on = k < leftShown; sg.beginPath(); sg.arc(RX + 180 + k * 44, RY - 8, 12, 0, 7); sg.fillStyle = on ? (rs ? '#fff' : ACCENT) : '#2a1812'; if (on) { sg.shadowColor = ACCENT_HI; sg.shadowBlur = rs ? 22 : 8; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 400, RY - 26, 386, 36, 12, '#0b0605e6', full ? GOLD : BRASS_DIM, 2); text(sg, `PINNED ${n}/15 · ${fmt(tot * f.bet)} LAYR`, RX + RW - 207, RY - 8, 21, full ? GOLD : CREAM, SANS, 'center', '900');
  if (E.featureDone(f) && now - chainFlash > 700) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  else if (!E.featureDone(f)) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }

/* --- Heist of the Century: the alarms ring, the vault door swings open, the meter counts up --- */
function drawHeistPlay(now) { const T = (motionOK() ? 7200 : 2400) * speed(), u = clamp01((now - scene.t0) / T), amt = scene.data.amount * ease((u - .25) / .6), mo = motionOK(), open = mo ? ease((u - .12) / .4) : 1;
  backdrop('jackpot', now, 1);
  // Alarm beacons sweep the hall.
  if (mo && u < .9) { sg.save(); sg.globalCompositeOperation = 'lighter'; for (const [bx, dir] of [[90, 1], [1310, -1]]) { const a = now / 260 * dir; sg.fillStyle = 'rgba(255,40,70,.16)'; sg.beginPath(); sg.moveTo(bx, 70); sg.arc(bx, 70, 900, a - .22, a + .22); sg.closePath(); sg.fill(); sg.beginPath(); sg.arc(bx, 70, 22, 0, 7); sg.fillStyle = '#ff3b3b'; sg.shadowColor = '#ff3b3b'; sg.shadowBlur = 40; sg.fill(); } sg.restore(); }
  if (mo && u < .12) { shake(2 + u * 30); if (Math.floor(now / 160) !== Math.floor((now - 17) / 160)) sfx('crack', 4); }
  drawVaultDoor(430, 520, 330, mo ? now / 700 * (1 - open) : 0, open, GOLD);
  if (mo && u > .22 && u < .85 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) spark(430 + (Math.random() - .5) * 160, 520, 4, { spread: Math.PI * 2, v: 380, life: 1000, c: [GOLD, '#fff4dc', ACCENT_HI][Math.floor(Math.random() * 3)] });
  const x0 = 960; glowText('HEIST OF THE CENTURY', x0, 150, 40, mo ? clamp01((u - .08) / .3) : 1, now, { stops: ['#fffbe0', '#ffe27a', '#e0a820'], glow: GOLD });
  if (u >= .2) { text(sg, 'JACKPOT', x0, 236, 26, ACCENT_HI, SANS, 'center', '900'); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, `${fmt(Math.round(amt))}`, x0, 350, 108, '#ffffff', SANS, 'center', '900'); sg.restore(); text(sg, 'LAYR', x0, 430, 34, CREAM, SANS, 'center', '900');
    text(sg, `BINANCE · OCTOBER 2026 · ${EX.bitcoin.taken || ''}`, x0, 500, 18, BRASS_HI, MONO, 'center', '800'); text(sg, up(EX.bitcoin.caveat || 'as reported'), x0, 528, 15, '#e9d9b4', SANS, 'center', '800'); wrapText(`Lesson: ${EX.bitcoin.lesson || ''}`, x0, 568, 700, 24, CREAM, 18); }
  for (let k2 = 0; k2 < 56; k2++) { const p = k2 / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = mo ? (k2 + Math.floor(now / 90)) % 3 === 0 : k2 % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#ff6a7c' : '#3a0710'; sg.fill(); }
  if (u < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (u >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }

/* --- Hot or Cold: the wallet flips three times, then settles hot or cold --- */
function drawHotColdPlay(now) { backdrop('gamble', now); const r = scene.data.result, T = 3400 * speed(), t = clamp01((now - scene.t0) / T), mo = motionOK(), hot = r.fate === 'hot', cx = 500, cy = RY + 290, reveal = .66;
  const spinT = mo ? clamp01(t / reveal) : 1;
  if (t < reveal) { if (!scene.hit) scene.hit = {}; const flips = Math.floor(spinT * 3); if (mo && flips > 0 && !scene.hit[flips]) { scene.hit[flips] = 1; sfx(flips % 2 ? 'hot' : 'cold'); shake(4); } drawWallet(cx, cy, 220, now, 'ready', spinT); }
  else drawWallet(cx, cy, 220 + (mo ? 12 * Math.sin((t - reveal) * 14) * (1 - clamp01((t - reveal) / .3)) : 0), now, hot ? 'hot' : 'cold');
  if (t >= reveal + .05) { if (!scene.data.landed) { scene.data.landed = true; sfx(hot ? 'hot' : 'cold'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) { particles(25); spark(cx, cy - 60, 40, { spread: Math.PI * 2, v: 420, c: hot ? HOT : COLD }); } else shake(6); }
    const k = mo ? ease((t - reveal - .05) / .12) : 1; sg.save(); sg.globalAlpha = k; glowText(hot ? 'HOT WALLET' : 'COLD WALLET', 1040, RY + 150, 58, 1, now, hot ? { stops: ['#fff0c0', HOT, '#a03a08'], glow: HOT, ghost: '#2a0f06' } : { stops: ['#ffffff', COLD, '#2f6a96'], glow: COLD, ghost: '#0a1822' });
    text(sg, `YOU CALLED ${r.call.toUpperCase()}. THE WALLET WAS ${hot ? 'HOT' : 'COLD'}.`, 1040, RY + 232, 21, r.win ? CREAM : '#c9a8a0', SANS, 'center', '900');
    text(sg, r.win ? `${fmt(r.amount)} LAYR` : '0 LAYR', 1040, RY + 316, 70, r.win ? '#ffffff' : '#7a6a6a', SANS, 'center', '900'); text(sg, r.win ? `YOUR ${fmt(r.stake)} LAYR WIN IS DOUBLED` : `YOUR ${fmt(r.stake)} LAYR WIN IS LOST`, 1040, RY + 372, 20, '#e9d9b4', SANS, 'center', '700'); sg.restore();
    button('CONTINUE', 910, RY + 430, 260, 78, () => setStage('outro')); }
  else text(sg, 'FLIPPING THE WALLET…', 1040, RY + 250, 30, GOLD, SANS, 'center', '900');
  skipChip(); }

/* --- The outro: one summary card per bonus --- */
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed())), mo = motionOK();
  backdrop(kind === 'jackpot' ? 'vault' : kind, now, .5); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'BACK TO THE PRESENT'; total = data.total; lines = [`${data.count} spins at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''} · ${(data.years || []).length} years visited`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any bonus or jackpot won on the tour', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'VAULTS OPENED'; total = data.total; lines = [`3 vaults: ${(data.picks || []).map(m => `${TIER[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = data.jackpot ? 'THE WALL IS FULL' : 'TIMELINE PINNED'; total = data.total; lines = [`${data.cells}/15 headlines pinned · ${data.respins} respins`, data.jackpot ? `All 15 pinned: Heist of the Century jackpot +${fmt(data.jackpot)} next` : 'Pin all 15 to open the vault'] }
  if (kind === 'jackpot') { title = 'HEIST OF THE CENTURY'; total = data.amount; lines = [`${NAMES.bitcoin} · ${EX.bitcoin.taken || ''} · ${EX.bitcoin.caveat || 'as reported'}`, `Lesson: ${EX.bitcoin.lesson || ''}`, state.lastWin > total + .5 ? `Plus ${fmt(Math.round((state.lastWin - total) * 100) / 100)} LAYR in line wins on the same spin` : 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.fate === 'hot' ? 'HOT WALLET' : 'COLD WALLET') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`You called ${r.call}; the wallet was ${r.fate}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  slab(RX + 90, RY + 14, RW - 180, RH - 28, { r: 18, glow: ACCENT });
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); glowText(title, 700, RY + 84, title.length > 18 ? 50 : 62, mo ? clamp01(t * 1.8) : 1, now);
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 178, 80, '#ffffff', SANS, 'center', '900');
  lines.filter(Boolean).forEach((l, i) => { sg.font = `700 22px ${SANS}`; let fs = 22; while (fs > 13 && sg.measureText(l).width > RW - 260) { fs--; sg.font = `700 ${fs}px ${SANS}`; } text(sg, l, 700, RY + 246 + i * 32, fs, '#e9d9b4', SANS, 'center', '700'); });
  // What made it up.
  if (kind === 'free') { const ys = (data.years || []).slice(-8); ys.forEach((row, i) => { if (row) sg.drawImage(tileForRow(row), RX + 140 + i * 134, RY + 346, 118, 118); }); }
  if (kind === 'vault') (data.picks || []).forEach((m, i) => { const x = RX + 150 + i * 360; slab(x, RY + 316, 330, 138, { r: 10, seam: false }); const l = (data.opened || [])[i]; text(sg, `${m}×`, x + 80, RY + 366, 48, '#fff', SANS, 'center', '900'); fitText(sg, `${TIER[m]} · ${fmt(m * (data.bet || 0))}`, x + 80, RY + 414, 140, 14, GOLD, SANS, '800'); if (l) { fitText(sg, l.title, x + 238, RY + 342, 150, 13, ACCENT_HI, SANS, '900'); wrapText(l.line, x + 238, RY + 366, 150, 16, '#e9d9b4', 12); } });
  if (kind === 'chain') (data.tablet || []).forEach((c, i) => { const x = 700 - 5 * 62 + (i % 5) * 124 + 4, y = RY + 318 + Math.floor(i / 5) * 46; round(sg, x, y, 116, 40, 6, c ? '#3a2410' : '#140c07', c ? BRASS_HI : '#3a2e1c', 2); if (c) text(sg, `${c.row.year} ${c.v}×`, x + 58, y + 21, 17, CREAM, MONO, 'center', '900'); });
  if (kind === 'jackpot') drawVaultDoor(700, RY + 410, 56, 0, 1, GOLD);
  if (kind === 'gamble' && data.result) drawWallet(700, RY + 400, 92, now, data.result.fate);
  sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 100, 260, 70, nextScene); }

/* --- The screen: header plaques, then the reel window or the scene, then the visits row and the fact strip --- */
function drawScreen(now) {
  hits = []; const sh = shakeAmp > 0 && motionOK() ? shakeAmp * Math.exp(-(now - shakeAt) / 180) : 0; sg.save(); if (sh > .3) sg.translate((Math.random() - .5) * sh * 2, (Math.random() - .5) * sh * 2);
  sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState();
  // Left plaque: the Cold Storage Pot, its week and the share per twin.
  text(sg, fmt(hs.pot), 208, 90, 44, CREAM, SANS, 'center', '300'); text(sg, `${weekText(potPeriod())} · ${timeLeftText()}`, 208, 124, 12, BRASS_HI, SANS, 'center', '800');
  text(sg, '1% OF PAID BETS · HALF TO TWINS · HALF TO THE FOREVER FUND', 208, 146, 10, '#c9a46a', SANS, 'center', '700'); text(sg, perTwinText(hs.pot), 208, 168, 12, '#a58a58', SANS, 'center', '700');
  // Centre plaque: the Heist of the Century jackpot for the bet level.
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', SANS, 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, ACCENT_HI, SANS, 'center', '700');
  // Right plaque: the timeline 2011 to 2026, lit where the exhibit on show (or the Time Machine) stands.
  { const cur = season && season.years.length ? season.years[season.years.length - 1].row.year : (scene || state.freeActive ? null : (EX[EXHIBIT_ORDER[showIdx(now)]] || {}).year), have = new Set(TL.map(r => r.year));
    for (let k = 0; k < 16; k++) { const x = 1024 + (k % 8) * 44, y = 74 + Math.floor(k / 8) * 50, yr = YEARS[k], on = yr === cur, seen = season && season.years.some(e => e.row.year === yr); round(sg, x, y, 38, 34, 5, on ? ACCENT : seen ? '#4a3418' : '#120b07', on ? ACCENT_HI : have.has(yr) ? BRASS_DIM : '#2a2014', on ? 3 : 1.5); text(sg, `’${String(yr).slice(2)}`, x + 19, y + 17, 15, on ? '#fff' : have.has(yr) ? BRASS_HI : '#4a3a22', MONO, 'center', '900'); }
    text(sg, cur ? `NOW SHOWING · ${cur}` : 'EVERY TILE IS A REAL HACK', 1192, 172, 12, '#c9a46a', SANS, 'center', '800'); }
  if (lab) { round(sg, 18, 818, 300, 30, 8, '#d6454599'); text(sg, 'LAB · TEST BALANCE · NOT REAL LAYR', 168, 834, 13, '#fff', SANS, 'center', '900'); }
  let msg, msgColor = BRASS_HI;
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawHeistPlay(now); drawSparks(now); sg.restore(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultsPlay(f, now); else if (k === 'chain' && f) drawTimelinePlay(f, now); else if (k === 'gamble' && scene.data.result) drawHotColdPlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'HOT OR COLD? CALL IT' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `THE EMPTY VAULTS · OPEN ${f ? 3 - f.picks.length : 0} MORE · TAP A VAULT`) : scene.kind === 'chain' ? (scene.rollEnd && now < scene.rollEnd ? 'SEARCHING THE ARCHIVE…' : f && E.featureDone(f) ? '' : `THE TIMELINE · ${f ? f.frames[f.index].left : 0} RESPIN${f && f.frames[f.index].left === 1 ? '' : 'S'} LEFT`) : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawTimePlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction);
    msg = state.freeActive ? '' : spinning ? 'TRAVELLING…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol]} × ${w.count}  ·  +${fmt(w.amount)}` : state.gamble ? `WIN ${fmt(state.gamble)} · HOT OR COLD?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'THE MUSEUM IS OPEN · EVERY EXHIBIT IS A REAL HACK';
    scene2 = w; }
  if (msg) text(sg, msg, 700, 822, msg.length > 60 ? 21 : 25, msgColor, SANS, 'center', '800');
  if (!scene && !state.freeActive) drawVisits();
  if (state.freeActive && !scene) drawYearCaption(now); else if (!scene || scene.stage === 'trigger') drawFactStrip(now, !scene && !state.freeActive && !spinning && scene2 ? scene2.symbol : null);
  text(sg, `${lab ? 'LAB' : 'LAYR'}  ${fmt(state.balance)}`, 68, 940, 24, CREAM, SANS, 'left', '800'); text(sg, `BET  ${fmt(shownBet)}`, 700, 940, 24, CREAM, SANS, 'center', '800'); text(sg, `WIN  ${fmt(scene && scene.kind === 'free' && scene.stage === 'outro' ? scene.data.total : state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 940, 24, BRASS_HI, SANS, 'right', '800');
  drawSparks(now); sg.restore();
  screenTexture.needsUpdate = true; screenDirty = false;
}
let scene2 = null;
function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
// Celebration: drops of brass and crimson light falling over the page (CSS .coin, recoloured in the build).
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
  // Test hooks only: forced reel stops for the first five draws (see HotWallet.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : roundRng();
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) { if (lab) labTopUp(); else openAccount(); } return; }
  // The result is committed to the shared account before anything moves. The Cold Storage Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now();
  if (p.free) { sound('tick'); if (!season) season = { t0: performance.now(), retriggers: 0, best: 0, years: [], carve: null }; advanceYear(); }
  status(p.free ? 'TIME MACHINE SPIN · ALL WINS 2×' : 'TRAVELLING…');
  // Now, and only now, choose which tiles show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; save(); update();
  if (season && r.round.free) season.best = Math.max(season.best, r.total);
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'HEIST OF THE CENTURY · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · MT. GOX' : ''}` : (r.round.free ? 'TIME MACHINE SPIN COMPLETE' : 'THE VAULT HELD · TRAVEL AGAIN');
  if (state.gamble) msg += ' · HOT OR COLD?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Time Machine.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (season) season.retriggers++; toast(`More Mt. Gox exhibits! +${r.freeAward} spins.`); sfx('sting-free'); } else toast('Time Machine cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); setTimeout(() => startScene(q[0].kind, q[0].data || {}), 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(seasonOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once the Time Machine has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-tour stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-TOUR STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-tour.', `<p>Auto-tour travels at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-TOUR again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), hot: () => callGamble('hot'), cold: () => callGamble('cold'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('TIME MACHINE', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next year ▲</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="hot">Hot</button><button class="bar-cta" data-act="cold">Cold</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Open the vault' : kind === 'free' ? 'Dial back' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Open ${3 - f.picks.length} of 9 cold-storage vaults`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Vault ${i + 1}${f.picks.includes(i) ? `, ${TIER[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 headlines · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 pinned`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ▲'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Flipping the wallet…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickCrate(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'HOT WALLET') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
const safeUrl = u => /^https?:\/\//i.test(String(u || '')) ? esc(u) : '#';
const srcList = list => (list || []).length ? `<ul class="srcs">${list.map(s => `<li><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title || s.url)}</a>${s.retrieved ? ` <span class="fine">read ${esc(s.retrieved)}</span>` : ''}</li>`).join('')}</ul>` : '<p class="fine">No source listed.</p>';
const asOfLine = () => `Facts checked ${esc(F.asOf || '2 November 2026')}. Amounts are the figure reported at the time; the Binance 2026 hack is shown as reported on 2 November 2026 and may change.`;
const SYM_NOTE = { cherry: 'Pays low', lemon: 'Pays low', chip: 'Pays mid', block: 'Pays mid', artifact: 'Pays high', bitcoin: 'JACKPOT symbol', wild: 'Wild', scatter: 'Scatter: Time Machine', vault: 'Bonus: The Empty Vaults' };
// The exhibits and what they pay.
function openCollections() {
  const row = s => { const e = EX[s]; return `<tr><td>${e.logo ? coLogo(e.logo) + '<br>' : ''}<img class="pay-icon" src="${icon(s)}" alt="">${esc(NAMES[s])}<br><span class="fine">${esc(SYM_NOTE[s] || '')}</span></td><td>${esc(e.dateText || e.year)}${e.caveat ? `<br><span class="fine">${esc(e.caveat)}</span>` : ''}</td><td>${esc(e.takenLong || e.taken)}<br><span class="fine">${esc(e.usdText || '')}</span></td><td>${esc(e.how)}<br><b>Lesson:</b> ${esc(e.lesson)}</td></tr>`; };
  showModal('collections', 'The exhibits.', `<p>Every tile on the reels is an exhibit in The Heist Museum: a real event, with its date, the figure reported at the time, one plain line on how it happened and what the industry learned. The museum names no attackers and shows no faces. It does not explain how to do anything. The tiles are original museum-style pieces; each company's own logo is shown as supplied, on a plate of its own colour. ${asOfLine()}</p>
  <table class="paytable"><thead><tr><th>EXHIBIT</th><th>WHEN</th><th>WHAT WAS TAKEN</th><th>HOW, AND THE LESSON</th></tr></thead><tbody>${['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault'].filter(s => EX[s]).map(row).join('')}</tbody></table>
  <h3>THE COMPANIES IN THE MUSEUM</h3><p class="fine">Every company named anywhere in the game, with its own logo. The exchanges are the exhibits and timeline entries; BitGo is the security provider named on the Bitfinex card and EY is the firm whose findings the QuadrigaCX entry cites. The logos are the companies' own and are shown for identification only; no company has given permission or endorsed this game.</p>
  <div class="co-grid">${(F.companies || []).map(k => { const L = F.logos[k]; const rows = TL.filter(r => r.logo === k).map(r => (r.month ? MONTHS[r.month - 1] + ' ' : '') + r.year); const role = k === 'bitgo' ? 'named on the Bitfinex card' : k === 'ey' ? 'cited in the QuadrigaCX entry' : rows.join(' · '); return `<div class="co-cell">${coLogo(k)}<b>${esc(L.name)}</b><span class="fine">${esc(role)}</span></div>`; }).join('')}</div>
  <p class="fine"><b>QuadrigaCX (2019) was not a hack.</b> Its founder died and its cold wallets were found empty; the Ontario Securities Commission later called it a fraud. It sits in the museum for the lesson: proof of reserves. <b>Cold Storage</b> (the wild) is the answer to every other exhibit and shows no figure. Which tile shows in a cell is chosen after the result is fixed, with a separate random draw, so it never changes your odds. Sources for every figure are one tap away on each exhibit and in <code>art/sources.json</code>.</p>
  <button class="outline" id="colTl">The timeline ↗</button> <button class="outline" id="colLes">Lessons and words ↗</button> <button class="outline" id="colPot">Cold Storage Pot ↗</button>`, 'THE EXHIBITS');
  $('colTl').onclick = openTimeline; $('colLes').onclick = openLessons; $('colPot').onclick = openHolders;
}
// The full timeline, 2011 to 2026, with a source for every row.
function openTimeline() {
  const rows = TL.map(r => `<tr><td><b>${r.month ? MONTHS[r.month - 1] + ' ' : ''}${r.year}</b></td><td>${r.logo ? coLogo(r.logo) + '<br>' : ''}${esc(r.exchange)}${r.verified === false ? '<br><span class="fine">not fully verified</span>' : ''}</td><td>${esc(r.usdText || r.taken)}</td><td>${esc(r.how)}<br><b>Lesson:</b> ${esc(r.lesson)}</td><td>${srcList(r.sources)}</td></tr>`).join('');
  showModal('timeline', 'The timeline, 2011 to 2026.', `<p>${TL.length} entries. These are the headlines The Timeline bonus pins to the museum wall (fifteen of the sixteen; the one that sits out is ${dropRow ? esc(dropRow.exchange) : 'none'}). ${asOfLine()}</p><table class="paytable"><thead><tr><th>WHEN</th><th>WHO</th><th>WHAT</th><th>HOW, AND THE LESSON</th><th>SOURCES</th></tr></thead><tbody>${rows}</tbody></table>`, 'THE TIMELINE');
}
function openLessons() {
  showModal('lessons', 'Lessons and words.', `<h3>WHAT THE EXHIBITS TEACH</h3><table class="paytable"><thead><tr><th>LESSON</th><th>IN SHORT</th><th>FROM</th></tr></thead><tbody>${LESSONS.map(l => `<tr><td><b>${esc(l.title)}</b></td><td>${esc(l.line)}</td><td>${esc(l.from || '')}</td></tr>`).join('')}</tbody></table>
  <h3>WORDS</h3><table class="paytable"><tbody>${(F.glossary || []).map(g => `<tr><td><b>${esc(g.term)}</b></td><td>${esc(g.line)}</td></tr>`).join('')}</tbody></table><p class="fine">Plain definitions only. Nothing here explains how to attack anything.</p>`, 'LESSONS');
}
// A tapped exhibit: its fact card with the sources. face is the pool index of the tile that was tapped.
function openFact(sym, face) {
  const it = itemFor(sym, face), e = sym === 'chain' ? (it && it.row) : EX[sym]; if (!e) return;
  const tile = it ? it.tile : names[sym], c = canvas(160, 160); c.getContext('2d').drawImage(tile, 0, 0, 160, 160);
  const nm = sym === 'chain' ? e.exchange : e.name;
  showModal('fact', `${esc(nm)} · ${esc(e.dateText || (e.month ? MONTHS[e.month - 1] + ' ' : '') + e.year)}`, `<div class="fact"><img class="fact-tile" src="${c.toDataURL()}" alt="${esc(nm)} exhibit tile" width="160" height="160"><div>${e.logo ? `<p>${coLogo(e.logo)}</p>` : ''}<p><b>${esc(e.takenLong || e.usdText || e.taken || '')}</b>${e.caveat ? ` <span class="fine">(${esc(e.caveat)})</span>` : ''}</p><p>${esc(e.how)}</p><p><b>Lesson:</b> ${esc(e.lesson)}</p>${e.outcome ? `<p>${esc(e.outcome)}</p>` : ''}</div></div>${sym === 'vault' ? '<p class="fine"><b>Not a hack.</b> This exhibit is about missing funds, not an attack.</p>' : ''}<h3>SOURCES</h3>${srcList(e.sources)}<p class="fine">${asOfLine()}</p>`, 'THE HEIST MUSEUM');
}
// The Cold Storage Pot: what is built (the meter and the countdown) and what is not (the snapshot and the payout).
function openHolders() {
  const h = holderState(), p = h.period;
  showModal('holders', 'The Cold Storage Pot.', `<p>1% of every paid bet on Hot Wallet goes into the Cold Storage Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players. Each week's pot is split in half. <b>Half</b> goes to every forevered twin in every live Forever Twins collection, an equal share per twin. <b>Half</b> goes to the Forever Fund, for twin collections whose art is still at risk. The week turns over every Monday at 00:00 UTC.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(weekText(p))}</span><strong>${fmt(h.pot)}</strong></div><div><span>TIME LEFT</span><strong>${esc(timeLeftText())}</strong></div><div><span>LAST WEEK'S POT</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div></div>
  <p><b>Twin half.</b> ${fmt(h.pot / 2)} LAYR. ${esc(perTwinText(h.pot).replace('≈ ', 'About ').toLowerCase())}.</p><p><b>Forever Fund half.</b> ${fmt(h.pot / 2)} LAYR.</p>
  <p>${twinCount.ok ? (twinCount.value ? `${twinCount.value.toLocaleString('en-GB')} forevered twins were counted across ${twinCount.collections || 'the live'} Forever Twins collections.` : 'No twins were counted yet.') : `The share per twin is unknown, not zero: the twin count could not be read (${esc(twinCount.reason || 'unavailable')}).`}</p>
  <p class="fine">Version 1 shows the meters, the weekly countdown and the split only. The weekly snapshot, the per-twin payout and the Forever Fund transfer need a server or an on-chain contract and are not built yet (they are named stubs in the code, marked TODO). The pot meter is kept with this browser's LAYR session. Hot Wallet puts no twin on its reels, so there are no cameos.</p>`, 'COLD STORAGE POT');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The guide: pays and rules.', `<p>Match 3, 4 or 5 exhibits from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. <b>Cold Storage</b> is wild: it replaces every paying exhibit and has its own pays, but never replaces Mt. Gox, QuadrigaCX or a Headline.</p>
  <table class="paytable"><thead><tr><th>EXHIBIT</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(NAMES[s])}${EX[s] && EX[s].year && !String(NAMES[s]).includes(String(EX[s].year)) ? ` <span class="fine">${esc(EX[s].year)}</span>` : ''}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five BINANCE 2026 on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>TIME MACHINE</h3><p>3, 4 or 5 Mt. Gox exhibits anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. The dial goes back to 2011 and every spin moves the museum forward a year; that year's exhibit lights up. Every win pays <b>2×</b>. More Mt. Gox exhibits add 4 spins, up to 24 per feature. Your bet is locked for the feature. The Empty Vaults and The Timeline can trigger during it and pay at 1×.</p>
  <h3>THE EMPTY VAULTS</h3><p>3 or more QuadrigaCX exhibits anywhere show nine cold-storage vaults. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three. Each vault also holds a security lesson card; the lesson is decoration, the prize was fixed when the nine appeared. Tiers: Dust 1×, Pocket 2×, Stash 3×, Reserve 4×, Treasury 5×, Deep Cold 8×, Cold Hoard 10×, Motherlode 15×.</p>
  <h3>THE TIMELINE</h3><p>5 or more Headlines start a hold-and-respin on the museum wall. Each lock pins a real headline (2011 to 2026) worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty case has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new lock resets the count to 3. Pin all 15 to win the Heist of the Century jackpot as well.</p>
  <h3>HEIST OF THE CENTURY JACKPOT</h3><p>Five BINANCE 2026 on the centre row (wilds don't count), or all 15 cases pinned, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players. The jackpot exhibit is the October 2026 Binance hack, shown as reported on 2 November 2026.</p>
  <h3>HOT OR COLD</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call. The wallet is either hot (online) or cold (offline): call it. Right doubles the win; wrong loses that win only. It is an even bet.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Hot Wallet runs on the same Block Fortune v2 engine as the rest of the series: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no exhibit, headline or figure can ever change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, Mt. Gox scatter pays 1.5%, Time Machine 8.5%, The Empty Vaults 11.9%, The Timeline 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. The Time Machine and The Empty Vaults each arrive about 1 in 140 spins, The Timeline about 1 in 290, the jackpot about 1 in 113,000. Hot or Cold is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Cold Storage Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The exhibits ↗</button> <button class="outline" id="rulesTl">The timeline ↗</button> <button class="outline" id="rulesLes">Lessons ↗</button> <button class="outline" id="rulesHolders">Cold Storage Pot ↗</button>`, 'THE GUIDE');
  $('rulesCols').onclick = openCollections; $('rulesTl').onclick = openTimeline; $('rulesLes').onclick = openLessons; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['Time Machine', 'Three Mt. Gox exhibits anywhere pay a scatter prize and award 8 free spins. The dial goes back to 2011 and each spin moves the museum forward a year, lighting that year\'s exhibit. Every win is doubled, and more Mt. Gox exhibits add 4 spins, up to 24 per feature.'], vault: ['The Empty Vaults', 'Three QuadrigaCX exhibits show nine cold-storage vaults. Open three: each holds a prize from 1× to 15× your total bet and a security lesson.'], chain: ['The Timeline', 'Five Headlines start a hold-and-respin on the museum wall. Real headlines from 2011 to 2026 pin to their year with their values, any new one resets your three respins, and pinning all 15 wins the Heist of the Century jackpot.'], genesis: ['Heist of the Century', 'A progressive meter for each bet level. Land five BINANCE 2026 on the centre row, or pin the whole timeline, to win it. It starts at 500× your bet and grows with every paid spin at that level. The exhibit is shown as reported on 2 November 2026.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'HEIST OF THE CENTURY').replace('CHAIN', 'THE TIMELINE').replace('VAULT', 'THE EMPTY VAULTS').replace('FREE SPINS', 'TIME MACHINE').replace('RETRIGGER', 'MORE MT. GOX');
function openHistory(){
 const rows = (list, tagLab) => list.map(h=>`<tr><td>${tagLab || h.lab ? '<b>LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Time Machine spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td></tr>`).join('');
 const head = '<thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th></tr></thead>';
 const body=`<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut)}</strong></div></div><p>${lab ? 'These are LAB rounds on the lab balance. They are not part of your real history.' : 'Latest 50 rounds. All amounts use the shared LAYR account.'}</p><table class="paytable">${head}<tbody>${rows(state.history)}</tbody></table>${!lab && labStore.history && labStore.history.length ? `<h3>LAB RUNS (not real LAYR, not counted above)</h3><table class="paytable">${head}<tbody>${rows(labStore.history.slice(0, 20), true)}</tbody></table>` : ''}<button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history','The visitors’ log.',body,'LOG');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,currency:'LAYR',lab:!!lab,wagered:state.wagered,paidOut:state.paidOut,holder:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no sparks, shake, alarm sweep or vault swing)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space travels, respins and collects. 1–9 open vaults. M mutes. F is fullscreen.${LAB_OK ? ' L opens the Bonus Lab.' : ''} Tap any exhibit on the reels for its fact card.</p><button class="outline" id="setCols">The exhibits</button><button class="outline" id="setTl">The timeline</button><button class="outline" id="setHolders">Cold Storage Pot</button><button class="outline" id="setHistory">The log</button>`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setTl').onclick = openTimeline; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory;
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Hot Wallet runs on the same Block Fortune v2 engine as the rest of the series: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no exhibit, headline or figure can ever change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>Mt. Gox scatter pays</td><td>1.5%</td><td>with the Time Machine</td></tr><tr><td>Time Machine (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>The Empty Vaults (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>The Timeline (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Heist of the Century jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Hot or Cold is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Cold Storage Pot (1% of paid bets) is funded from the house edge and never reduces a win. The museum's facts only decide what the tiles look like.</p>`, 'FAIR PLAY');
}
/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'TIME TRAVEL', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['hot', 'HOT', 'call hot', 'fb gold'], ['cold', 'COLD', 'call cold', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'HOT OR COLD?', 'gamble win', 'fb gold'], ['collect', 'COLLECT', 'take the prize', 'fb gold'],
  ['betDown', '−YEARS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+YEARS', 'bet up', 'fb'], ['max', 'MAX YEARS', 'max bet', 'fb'], ['auto', 'AUTO-TOUR', 'auto', 'fb'],
  ['pays', 'GUIDE', 'pays & rules', 'fb'], ['exhibits', 'EXHIBITS', 'every tile, sourced', 'fb'], ['timeline', 'TIMELINE', '2011 to 2026', 'fb'], ['lessons', 'LESSONS', 'and words', 'fb'], ['pot', 'POT', 'cold storage pot', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'LOG', 'rounds', 'fb'],
  ['account', 'ACCOUNT', 'LAYR account', 'fb'], ['settings', 'SETTINGS', 'make it yours', 'fb'], ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), hot: () => callGamble('hot'), cold: () => callGamble('cold'), keep: () => keepWin(), gamble: () => openGamble(), collect: () => { const f = feature(); if (scene && f && E.featureDone(f)) collectScene(); }, betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), exhibits: () => openCollections(), timeline: () => openTimeline(), lessons: () => openLessons(), pot: () => openHolders(), account: () => openAccount(), settings: () => openSettings(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => openLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 7).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(7).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free, f = feature();
  q('primary').querySelector('b').textContent = spinning ? 'TRAVELLING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('hot', gambleIntro); show('cold', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0); show('collect', !!(scene && scene.stage === 'play' && f && E.featureDone(f)));
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance); q('balance').querySelector('small').textContent = lab ? 'LAB balance' : 'LAYR balance';
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TOUR';
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
// The casino never sets PX_STANDALONE_TEST, so on the public casino HotWallet.test is null.
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
// its own state object and balance; it never reaches the real LAYR account, the jackpot meters, the Cold Storage Pot or the RTP statistics.
const LAB_KEY = 'xtrata.parallax.hot-wallet.lab.v1';
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
  { id: 'free', name: 'Time Machine', note: '3 Mt. Gox: 8 free spins at 2×; the dial goes back to 2011 and each spin moves the museum on a year', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'free-retrigger', name: 'Time Machine with a retrigger', note: 'a second set of Mt. Gox exhibits in spin 2 adds 4 spins', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p), plain(p), withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'free-tour', name: 'Time Machine: the full tour', note: 'two retriggers make 16 spins, one for every year from 2011 to 2026', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p), plain(p), withSymbol(SCATTER_REELS[3], 'scatter', p), plain(p), withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'pick', name: 'The Empty Vaults', note: '3 QuadrigaCX: nine cold-storage vaults, open three; the mix holds a big prize and a lesson card each', plans: p => [withSymbol([0, 2, 4], 'vault', p)], awards: AWARD_ORDER },
  { id: 'hold', name: 'The Timeline', note: '5+ Headlines: locks pin real headlines to the wall, the respin lamps reset', plans: p => [chainPlan(p)], lockOdds: .2 },
  { id: 'hold-full', name: 'The Timeline, full wall', note: 'forced full-grid run: all 15 headlines pin and win Heist of the Century too', plans: p => [chainPlan(p)], fullGrid: true },
  { id: 'jackpot', name: 'Heist of the Century (centre row)', note: 'five BINANCE 2026 on the centre row: alarms, the vault door, the count-up', plans: p => [jackpotPlan(p)] },
  { id: 'gamble-win', name: 'Hot or Cold: a win', note: 'a plain win, then the wallet lands on your call', plans: p => [winPlan(p)], gamble: 'win' },
  { id: 'gamble-loss', name: 'Hot or Cold: a loss', note: 'a plain win, then the wallet lands against your call', plans: p => [winPlan(p)], gamble: 'loss' },
  { id: 'scatter3', name: 'Scatter pays 3', note: '3 Mt. Gox pay 2× the bet and start the Time Machine', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'scatter4', name: 'Scatter pays 4', note: '4 Mt. Gox pay 5× the bet and start the Time Machine', plans: p => [withSymbol(SCATTER_REELS[4], 'scatter', p)] },
  { id: 'scatter5', name: 'Scatter pays 5', note: '5 Mt. Gox pay 10× the bet and start the Time Machine', plans: p => [withSymbol(SCATTER_REELS[5], 'scatter', p)] }
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
function labAbort() { if (!lab) return; clearTimeout(scheduleFree.t); scene = null; hideBar(); sceneQueue = []; jackpotMusic(false); spinning = false; animations = []; season = null; vaultLessons = []; state.pending = null; state.features = []; state.free = 0; state.freeActive = false; state.gamble = 0; lab.queue = []; lab.run = null; labLeave(); }
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
  if (s.stage === 'intro') { if (since > 1100 * d) { if (s.kind === 'gamble') callGamble('hot'); else primaryAction(); } return; }
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
  showModal('lab', 'Bonus Lab.', `<p class="fine">Pick a bonus or special event, a bet and press Run: it plays at once through all four stages. Each run is a real engine round (the engine's own start with scripted reel stops; nothing is edited or bypassed) on a separate lab balance. Lab rounds are marked LAB in the log and never touch your LAYR, the jackpot meters, the Cold Storage Pot or the RTP figures.</p>
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
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">Time Machine</button><button class="cta" data-t="vault">The Empty Vaults</button><button class="cta" data-t="chain">The Timeline</button><button class="cta" data-t="jackpot">Heist of the Century</button><button class="cta" data-t="gamble">Hot or Cold</button></div>
  <h3>BONUS LAB</h3><div class="ab"><button class="outline" id="tLab">Open the Bonus Lab (L)</button></div>
  <h3>TWIN COUNT</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div><p class="fine">Switches the twin count the Cold Storage Pot is split by (none, some or all). Test values only; the real count is read from the Forever Twins helpers.</p>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  $('tLab').onclick = () => openLab();
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.h); toast(`Twin count: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked);
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Time Machine 1 in ${r.freeEvery.toFixed(0)} · Empty Vaults 1 in ${r.pickEvery.toFixed(0)} · Timeline 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('timelineInfo').onclick = openTimeline; $('lessonsInfo').onclick = openLessons; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return; const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickCrate(Number(e.key) - 1);
  else if (k === 'm') $('sound').click(); else if (k === 'f') requestFullscreen(!fsOn); else if (k === 's' && canSkip()) skipScene(); else if (k === 'l' && LAB_OK) openLab();
  else if (k === 'h' && scene?.kind === 'gamble') callGamble('hot'); else if (k === 'c' && scene?.kind === 'gamble') callGamble('cold');
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-TOUR STOPPED'); } } updateFsBar(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted && pxEngineActive) ac.resume().catch(() => {}); });

/* ---------- Frame loop: the screen only; idle frames capped near 30 fps ---------- */
let lastHl = -1, lastPoolSize = 0, lastTick = 0, lastSweep = 0;
const perf = { frames: 0, drawn: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); perf.frames++;
  if (spinning) spinPhysical.position.z = SPIN_Z - (1 + Math.sin(now / 170)) * .006; else spinPhysical.position.z = SPIN_Z;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || scene) screenDirty = true; // scenes animate continuously
  if (sparks.length || (shakeAmp && now - shakeAt < 900)) screenDirty = true;
  if (state.freeActive && motionOK()) screenDirty = true; // the dial and the year rail
  if (motionOK() && now - lastSweep > 100) { lastSweep = now; screenDirty = true; } // the museum spotlight steps about ten times a second
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
  else if (state.free) { renderBar(); status(`${state.free} SAVED TIME MACHINE SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(seasonOutro, 800);
}
update(); drawScreen(0);
// Every tile comes from art/facts.js, bundled with the machine: nothing is read from the network, so nothing can change a result.
refaceIdle(); screenDirty = true;
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.HotWallet = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), twins: () => ({ ...twinCount }),
  facts: () => ({ asOf: F.asOf, exhibits: Object.keys(EX), timeline: TL.length, timelineCells: TL15.map(r => r.year), lessons: LESSONS.length, glossary: (F.glossary || []).length }),
  scene: () => scene ? { kind: scene.kind, stage: scene.stage, total: scene.data ? (scene.data.total || scene.data.amount || 0) : 0 } : null, fullscreen: () => fsOn,
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
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,pulse:0,potMsLeft:msLeft(),weekMs:WEEK_MS,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab)labAbort();stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
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
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'TIME TRAVEL',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!lab,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();

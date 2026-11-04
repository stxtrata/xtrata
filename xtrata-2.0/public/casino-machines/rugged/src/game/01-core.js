/* Rugged — a ParallaX Casino machine. A bazaar rug shop for the oldest joke in crypto, turned into a rescue story: Stacks art whose
   own links went dark is woven back into rugs, and the machine's pot pays to put that art on chain for good. Every symbol is real
   material: Bitcoin Birds twins inscribed on Xtrata (the art the collection's own link no longer serves), the WELSH token's official
   logo, the dead art link read from the collection's contract, and the Xtrata mark. The weave is a canvas effect on the real image;
   nothing is redrawn. The maths is the shared Block Fortune v2 engine (BF) unchanged: every outcome is fixed by BF before any art is
   chosen, and art is picked with Math.random, never the engine's generator, so loaded art can never change a result. The casino owns
   all 3D rendering and cameras; this frame only draws the cabinet screen and handles the controls. No listed project is ever called
   a scam: on this machine every listed collection is "Rescued". */
(() => {
'use strict';let pxEngineActive=false;
let GAME_ID='rugged', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
const E0 = E; // the Bonus Lab swaps E for the raw engine and back; nothing else ever does
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, ACCENT = '#b5532c', WOOL = '#f1e4c6', BRASS = '#d9a441', BRASS_HI = '#f6dc94', WOOD = '#22130b', MADDER = '#7c1d14', INDIGO = '#1f2a4a', GOLD = '#f2c14e';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'Rescued rug, Tier IV', lemon: 'Rescued rug, Tier III', chip: 'Rescued rug, Tier II', block: 'Rescued rug, Tier I', artifact: 'Forever Twins ∞', bitcoin: 'Flying Carpet', wild: 'WELSH', scatter: '404', vault: 'Rolled rug', chain: 'Knot' };
const SHORT = { cherry: 'TIER IV', lemon: 'TIER III', chip: 'TIER II', block: 'TIER I', artifact: 'FOREVER ∞', bitcoin: 'FLYING CARPET', wild: 'WELSH', scatter: '404', vault: 'ROLLED RUG', chain: 'KNOT' };
// Rugs are tiered by mint order (the birds carry no trait metadata, so rarity cannot be computed): Tier I is the first hundred.
// Each tier has its own dye for the rug's border so the tiers read at a glance.
const COLS = {
  cherry:   { key: 'tier-iv',  name: 'Rescued rug, Tier IV',  color: '#4f6bd8', kind: 'rug', tier: 'IV',  lo: 300, hi: 399 },
  lemon:    { key: 'tier-iii', name: 'Rescued rug, Tier III', color: '#2b8a7e', kind: 'rug', tier: 'III', lo: 200, hi: 299 },
  chip:     { key: 'tier-ii',  name: 'Rescued rug, Tier II',  color: '#e09a2d', kind: 'rug', tier: 'II',  lo: 100, hi: 199 },
  block:    { key: 'tier-i',   name: 'Rescued rug, Tier I',   color: '#c8322a', kind: 'rug', tier: 'I',   lo: 0,   hi: 99 },
  artifact: { key: 'forever-twins', name: 'Forever Twins ∞',  color: '#6593cf', kind: 'mark' },
  bitcoin:  { key: 'flying-carpet', name: 'Flying Carpet',    color: GOLD,      kind: 'carpet', lo: 0, hi: 399 },
  wild:     { key: 'welsh',    name: 'WELSH',                 color: '#f08c00', kind: 'logo' },
  scatter:  { key: 'dead-link', name: '404',                  color: '#e8e2d6', kind: 'record' },
  vault:    { key: 'rolled-rug', name: 'Rolled rug',          color: ACCENT,    kind: 'roll', lo: 0, hi: 399 },
  chain:    { key: 'knot',     name: 'Knot',                  color: BRASS,     kind: 'knot', lo: 0, hi: 399 }
};
const ART = window.RUG_ART || { collections: [], logos: {} }, MANIFEST = window.RUG_MANIFEST || { collections: [] };
const RESCUED = ART.collections || [], MAIN = RESCUED[0] || { key: 'bitcoin-birds', name: 'Bitcoin Birds', supply: 400, twinned: null, deadLinks: [], birds: [] };
// The dead link shown on the 404 tiles: the one the collection's own contract returns for its tokens (read at build time).
const DEAD = (MAIN.deadLinks || []).find(d => /\.json$/.test(d.uri || '')) || (MAIN.deadLinks || [])[0] || { uri: 'art link unavailable', call: '' };
const deadHost = u => String(u || '').replace(/^https?:\/\//, '');
const TEST_OK = (() => { try { const w = window.parent; return w.PX_STANDALONE_TEST === true || /^(localhost|127\.0\.0\.1|\[::1\])$|\.(localhost|test)$/.test(w.location.hostname); } catch (e) { return false; } })();
// The Bonus Lab is always there on the standalone test page; in the casino only behind the developer flag ?lab=1.
const LAB_OK = TEST_OK || (() => { try { return /[?&]lab=1(&|$)/.test(window.parent.location.search); } catch (e) { return false; } })();
let sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
// Bonus Lab: a practice sandbox with its own state and the raw engine. While lab.on is set nothing here touches the LAYR account,
// the saved game, the jackpot meters, the Rescue Pot or the RTP statistics (see the Bonus Lab section).
const lab = { on: false, real: null, last: null, script: [], auto: null, queue: [], seed: 20261102, bank: 100000 };
function save(){if(!sessionLock&&!lab.on)LAYR.saveGame(state);}
let scene = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], jackpotShow = null;
// The room animates the cabinet's lever (the loom beater) and spin button from these (see PX_CASINO_ENGINE.mechanics).
const lever = { name: 'px-lever' }; let leverStart = 0; const SPIN_Z = .19, spinPhysical = { position: { z: SPIN_Z } };
const feature = () => E.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}


/* ---------- Holder layer, version 1: the Rescue Pot (meters and display only) ---------- */
// 1% of every paid bet goes into the Rescue Pot, kept beside the jackpot meters. It is paid for out of the house edge: it is never
// taken from a stake or a win, so the player's 94.38% is untouched. The period is one week (UTC, Monday to Sunday).
// Half the pot is shared per twin among the twin holders of rescued collections; half goes to the Forever Fund, earmarked for
// twinning collections on the rescued list that are not yet saved.
const HOLDER_RATE = 0.01, TWIN_SHARE = 0.5;
function weekId(t = Date.now()) { const d = new Date(t), day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day + 3); const y = d.getUTCFullYear(), jan4 = new Date(Date.UTC(y, 0, 4)); const w = 1 + Math.round(((d - jan4) / 864e5 - 3 + (jan4.getUTCDay() + 6) % 7) / 7); return `${y}-W${String(w).padStart(2, '0')}`; }
function holderState() {
  const now = weekId(); let h = state.holder;
  if (!h || typeof h !== 'object') h = state.holder = { period: now, pot: 0, last: null, cameos: 0 };
  if (h.period !== now) { h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100 }; h.period = now; h.pot = 0; }
  return h;
}
function holderAdd(bet) { if (lab.on) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): snapshot the twin holders of every rescued collection at the period's end (checked read through each
//   helper: a failed read is "unknown", never "no twins"), split half the pot per twin, pay the cameo royalty and holder spins.
// TODO(holder-layer-v2): Forever Fund: pay inscription fees for twinning not-yet-saved collections on the rescued list.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO: weekly snapshot and payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO: claims need an on-chain LAYR token.' }),
  payCameo: async () => ({ ok: false, value: null, reason: 'TODO: the 1% cameo royalty needs the snapshot service.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO: weekly holder spins need the holder snapshot.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO: Forever Fund refunds for twinning listed collections need a contract.' })
});
// Twins counted from the helper (inscribed-count). Until a live read lands, the count read at build time is shown, marked as such.
// A failed read keeps the last known count marked stale; it is never shown as "no twins".
const TWIN_KEY = 'xtrata.parallax.rugged.twins';
let twinCount = { value: Number.isFinite(MAIN.twinned) ? MAIN.twinned : null, at: MAIN.twinnedAsOf ? Date.parse(MAIN.twinnedAsOf) : 0, live: false, stale: true };
try { const c = JSON.parse(localStorage.getItem(TWIN_KEY) || 'null'); if (c && Number.isFinite(c.value) && c.at > twinCount.at) twinCount = { value: c.value, at: c.at, live: false, stale: true }; } catch (e) {}
// The rescued list: art saved (twinned) and still at risk (approved collections whose art is not yet on chain).
function rescueLedger() { let saved = 0, risk = 0; for (const c of RESCUED) { const tw = c.key === MAIN.key && Number.isFinite(twinCount.value) ? twinCount.value : Number.isFinite(c.twinned) ? c.twinned : 0; saved += Math.min(tw, c.supply || tw); risk += Math.max(0, (c.supply || 0) - tw); } return { saved, risk }; }
const linkedTest = { on: false, value: null }; // the test panel's holder-count switch

function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? '404 WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} 404 SPINS · 2×` : lab.on ? 'LAB LAYR' : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'WEAVING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-WEAVE';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  document.body.classList.toggle('lab-on', !!lab.on); updateFsBar(); screenDirty = true;
}

/* ---------- Procedural audio: loom clacks, the beater's thud, bazaar hubbub, an oud-like pluck. No files. ---------- */
let ac = null, master = null, noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * .5; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
function noise(d = .05, freq = 2400, q = 2, v = .25, delay = 0, sweep = 0) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; s.loop = d > .45; f.type = 'bandpass'; f.frequency.setValueAtTime(freq, t); if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * sweep), t + d); f.Q.value = q; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + Math.min(.01, d / 4)); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t, Math.random() * .4); s.stop(t + d + .02); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// An oud-like pluck: a bright sawtooth through a low-pass filter that closes fast, over a soft triangle body.
function pluck(f, d = .5, v = .07, delay = 0) { if (!ac || state.muted) return; const t = ac.currentTime + delay, o = ac.createOscillator(), b = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth'; b.type = 'triangle'; o.frequency.setValueAtTime(f, t); b.frequency.setValueAtTime(f, t); o.detune.setValueAtTime(-6, t); fl.type = 'lowpass'; fl.Q.value = 3; fl.frequency.setValueAtTime(f * 9, t); fl.frequency.exponentialRampToValueAtTime(Math.max(120, f * 1.2), t + d * .6);
  o.connect(fl); b.connect(fl); fl.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .003); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); b.start(t); o.stop(t + d + .02); b.stop(t + d + .02); }
// The Hijaz scale on D, the sound of a bazaar.
const HIJAZ = [293.66, 311.13, 369.99, 392, 440, 466.16, 523.25, 587.33, 622.25, 739.99, 783.99, 880];
const phrase = (idx, step = .09, d = .4, v = .06, at = 0) => idx.forEach((n, k) => pluck(HIJAZ[n % HIJAZ.length] * (n >= HIJAZ.length ? 2 : 1), d, v, at + k * step));
// Darbuka: the low "dum" and the bright "tek".
function dum(at = 0, v = .22) { tone(95, .22, 'sine', v, at, .55); noise(.08, 420, 1.2, v * .5, at); }
function tek(at = 0, v = .12) { noise(.04, 4200, 3, v, at); tone(1250, .03, 'triangle', v * .25, at); }
// The loom: a wooden clack as a reel stops (the heddle dropping), and the soft thud of the beater packing the weave tight.
function clack(at = 0, i = 0) { return [noise(.035, 1700 + i * 110, 5, .32, at), tone(180 + i * 14, .07, 'triangle', .09, at), noise(.02, 5200, 6, .08, at + .012)].filter(Boolean); }
function thud(at = 0, v = 1) { tone(70, .26, 'sine', .3 * v, at, .7); noise(.12, 260, 1.4, .3 * v, at); noise(.05, 900, 2, .07 * v, at + .01); }
// Bazaar hubbub: a murmur of voices made from noise through drifting vowel formants, with a few calls rising out of it.
function hubbub(d = 1.6, v = 1, at = 0) { if (!ac || state.muted) return; for (let k = 0; k < 7; k++) { const t = at + Math.random() * d * .5, f = 350 + Math.random() * 900; noise(d * (.4 + Math.random() * .5), f, 7, .035 * v, t, .8 + Math.random() * .5); } for (let k = 0; k < 3; k++) { const t = at + .2 + Math.random() * d * .6; tone(180 + Math.random() * 120, .35, 'sawtooth', .012 * v, t, 1.18); } }
function whoosh(d = .9, v = 1, at = 0) { noise(d, 500, .9, .2 * v, at, 6); noise(d * .7, 2400, 1.5, .08 * v, at + d * .2, .4); }
function coins(n, at = 0) { for (let k = 0; k < n; k++) { const t = at + k * (.045 + Math.random() * .05); tone(2400 + Math.random() * 1400, .09, 'sine', .045, t); noise(.03, 6000, 4, .07, t); } }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { thud(0, 1); noise(.3, 1400, .8, .08, .05, 1.8); } // the lever packs the weave: a soft thud
  if (kind === 'stop') return clack(at, i);
  if (kind === 'win') { phrase([4, 6, 7, 9], .06, .3, .06); coins(5, .22); }
  if (kind === 'big') { phrase([0, 2, 3, 4, 6, 7, 9, 11], .07, .45, .07); dum(0); tek(.18); dum(.36); tek(.48); tek(.6); coins(22, .25); hubbub(1.6, 1.1, .2); }
  if (kind === 'bonus') phrase([0, 1, 2, 3, 4], .1, .5, .07);
  if (kind === 'antic') { noise(1.5, 700, 1, .05); for (let k = 0; k < 6; k++) tek(k * .22, .06 + k * .012); phrase([0, 1, 2, 3, 4, 5], .22, .3, .03); }
  if (kind === 'tick') { tek(0, .06); pluck(1174.7, .12, .025); }
  if (kind === 'lock') { thud(i * .08, .7); pluck(587.33 + i * 40, .3, .05, i * .08); coins(3, i * .08 + .05); }
  if (kind === 'respin') { noise(.3, 900, 1, .1, 0, 3); clack(.02, 2); }
  if (kind === 'pick') { phrase([4 + (i % 3), 7 + (i % 3)], .07, .35, .07); coins(4, .08); }
  if (kind === 'click') noise(.02, 3200, 4, .1);
  if (kind === 'lose') phrase([7, 5, 4, 1, 0], .11, .4, .06);
  if (kind === 'flip') { noise(.12, 1600, 1.4, .18, 0, .5); tone(240, .1, 'triangle', .05, .02); }
  return [];
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));

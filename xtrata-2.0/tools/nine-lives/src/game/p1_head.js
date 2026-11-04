/* Nine Lives — a ParallaX Casino machine for LEO Cats, the 10,000-cat Stacks collection, alongside $LEO.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any cat is chosen for a cell, so the art can never change a result.
   The "nine" is the pick bonus's nine boxes. It is not a lives counter and nothing here suggests a win is due. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='nine-lives', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.ninelives.twins.v1', bets = E.bets, THRESHOLD = 100, POT_RATE = .01;
const MAG = '#12b5a6', MAG2 = '#5fe8d9', MAG3 = '#a6f3ec', CY = '#8fc7ff', MOON = '#f6e7b0', GOLD = '#ffc83d', INK = '#070a13';
const SLOT_ORDER = ['lemon', 'chip', 'block', 'artifact', 'bitcoin'];
// Five cat tiers by trait rarity (information content over the six traits: Background, Base, Cloth, Eyes, Hat, Mouth).
// The rarest 1% are Gold, the next 4% Silver, then three equal tiers. The $LEO token (cherry) is a logo, not a cat.
const TIER = { lemon: { k: '1', name: 'TIER III', col: '#12b5a6' }, chip: { k: '2', name: 'TIER II', col: '#4a90ff' }, block: { k: '3', name: 'TIER I', col: '#a875ff' }, artifact: { k: 'S', name: 'SILVER', col: '#d5dbe3' }, bitcoin: { k: 'G', name: 'GOLD', col: '#ffc83d' } };
const NAMES = { cherry: '$LEO token', lemon: 'Tier III cat', chip: 'Tier II cat', block: 'Tier I cat', artifact: 'Silver cat', bitcoin: 'Gold cat', wild: 'Full Moon', scatter: 'Fak.fun logo', vault: 'Forever Twin logo', chain: 'Lit window' };
const TESTBUILD = (() => { try { return !!window.parent.NL_TEST_PAGE; } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account, the saved game, the jackpot meters or the Holder Pot.
const lab = { on: false, real: null, twins: null };
let state = LAYR.openGame(GAME_ID,E);
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0')}`; }
const r2 = n => Math.round(n * 100) / 100;
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  if (typeof state.powered !== 'boolean') state.powered = false;
  if (!Array.isArray(state.cameos)) state.cameos = [];
  const wk = weekKey();
  if (!state.potKey) state.potKey = wk;
  if (state.potKey !== wk) { state.lastPot = { key: state.potKey, pot: r2(state.pot), twins: Number.isFinite(sources.twins) ? sources.twins : null }; state.potKey = wk; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, crash = null;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Standby: the cabinet ships dark until LEO Cats has a Forever Twins helper with enough twins ---------- */
const sources = { registry: 'pending', helper: 'pending', twins: null, twinsFailed: false, stale: false, images: 0, imageFailures: 0, untwinned: 0, untwinnedStarted: false, bundled: 0, cached: false, done: false };
// The twin count only ever goes up, so if Xtrata cannot be read the bundled snapshot (ART.twinCount, taken 2 Nov 2026) is a safe floor: it can keep a cabinet open, never close one.
const twinCount = () => Number.isFinite(sources.twins) ? sources.twins : ((sources.helper === 'unknown' || sources.helper === 'pending') && Number.isFinite(ART.twinCount) ? ART.twinCount : null);
const liveOpen = () => (sources.helper === 'live' || sources.helper === 'unknown' || sources.helper === 'pending') && Number.isFinite(twinCount()) && twinCount() >= THRESHOLD;
const dark = () => !(state.powered || liveOpen());
function standbyLines() {
  const n = twinCount();
  if (sources.helper === 'live') return ['THE CATS ARE ASLEEP · COMING SOON', Number.isFinite(n) ? `${n} / ${THRESHOLD} TWINS TO WAKE THE ROOFTOPS` : 'TWIN COUNT UNAVAILABLE'];
  if (sources.helper === 'none') return ['THE CATS ARE ASLEEP · COMING SOON', 'NO LEO CATS HELPER CONTRACT YET'];
  if (sources.helper === 'unknown') return ['THE CATS ARE ASLEEP · COMING SOON', Number.isFinite(n) ? `${n} / ${THRESHOLD} TWINS (LAST KNOWN)` : 'TWIN COUNT UNAVAILABLE'];
  return ['THE CATS ARE ASLEEP · COMING SOON', 'CONNECTING TO XTRATA…'];
}
function powerUp() { if (!dark() || sessionLock || !LAYR.ready()) return; state.powered = true; save(); sound('power'); status('POWERED UP · TESTNET MODE'); toast('Testnet power-up: the cabinet runs before the 100-twin switch-on. Turn this off in Settings.'); update(); }
function potShare() { const n = twinCount(), t = Number.isFinite(n) && n > 0 ? n : 0; return t ? state.pot / t : null; }

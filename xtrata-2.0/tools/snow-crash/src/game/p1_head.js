/* Snow Crash — a ParallaX Casino machine for Crash Punks (grace.btc, minted on This Is #1, 12 Dec 2021).
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any punk is chosen for a cell, so the art can never change a result. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='snow-crash', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.snowcrash.twins', bets = E.bets, THRESHOLD = 100, POT_RATE = .01;
const MAG = '#ff3ea5', MAG2 = '#ff9bd2', MAG3 = '#ffb6dc', CY = '#39d8ff', INK = '#0a0614';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
// Six tiers by trait rarity, each with its own frame colour. Rarest 1% Legendary, next 4% Rare, then four equal tiers.
const TIER = { cherry: { k: '4', name: 'TIER IV', col: '#39d8ff' }, lemon: { k: '3', name: 'TIER III', col: '#4ade80' }, chip: { k: '2', name: 'TIER II', col: '#a78bfa' }, block: { k: '1', name: 'TIER I', col: '#ff4d5e' }, artifact: { k: 'R', name: 'RARE', col: '#d5dbe3' }, bitcoin: { k: 'L', name: 'LEGENDARY', col: '#ffc83d' } };
const NAMES = { cherry: 'Tier IV punk', lemon: 'Tier III punk', chip: 'Tier II punk', block: 'Tier I punk', artifact: 'Rare punk', bitcoin: 'Legendary punk', wild: 'Hologram avatar', scatter: 'Crash Punks logo', vault: '#1 mark', chain: 'Forever tile' };
const TESTBUILD = (() => { try { return !!window.parent.SC_TEST_PAGE; } catch (e) { return false; } })();
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

/* ---------- Standby: the cabinet ships dark until Crash Punks has a Forever Twins helper with enough twins ---------- */
const sources = { registry: 'pending', helper: 'pending', twins: null, twinsFailed: false, images: 0, imageFailures: 0, bundled: 0, cached: false, done: false };
const liveOpen = () => sources.helper === 'live' && Number.isFinite(sources.twins) && sources.twins >= THRESHOLD;
const dark = () => !(state.powered || liveOpen());
function standbyLines() {
  if (sources.helper === 'live') return ['COMING SOON TO FOREVER TWINS', Number.isFinite(sources.twins) ? `${sources.twins} / ${THRESHOLD} TWINS TO SWITCH ON` : 'TWIN COUNT UNAVAILABLE'];
  if (sources.helper === 'none') return ['COMING TO FOREVER TWINS', 'NO HELPER CONTRACT YET'];
  if (sources.helper === 'unknown') return ['COMING TO FOREVER TWINS', 'TWIN COUNT UNAVAILABLE'];
  return ['COMING TO FOREVER TWINS', 'CONNECTING TO XTRATA…'];
}
function powerUp() { if (!dark() || sessionLock || !LAYR.ready()) return; state.powered = true; save(); sound('power'); status('POWERED UP · TESTNET MODE'); toast('Testnet power-up: the cabinet runs before the 100-twin switch-on. Turn this off in Settings.'); update(); }
function potShare() { const t = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : 0; return t ? state.pot / t : null; }

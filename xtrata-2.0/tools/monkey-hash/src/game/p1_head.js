/* Monkey Hash — a ParallaX Casino machine for Bitcoin Monkeys (the 2,500-monkey Stacks collection), their BANANA token,
   the Serums sold in the Monkey Store and the Mutant Monkeys made from them.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any monkey is chosen for a cell, so the art can never change a result. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='monkey-hash', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.monkeyhash.twins', bets = E.bets, POT_RATE = .01;
// Palette: temple gold (the accent), moss, jungle night, torch orange, waterfall teal.
const GOLD = '#d9a300', GOLD2 = '#ffd34d', GOLD3 = '#ffe9a6', MOSS = '#6fbf73', TORCH = '#ff8a2b', TEAL = '#6fe3c8', INK = '#050d09', LEAF = '#12301f', STONE = '#26352d', STONE2 = '#3a4d42';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
// The ten engine slots, mapped as the treatment says. The engine's own ids (cherry, lemon…) never appear on screen.
//   cherry BANANA · lemon Serum MM1 · chip Serum (second batch) · block Mutant Monkey · artifact Bitcoin Monkey (stone frame)
//   bitcoin Bitcoin Monkey (gold frame, the rarest 5%, jackpot symbol) · wild Idol Monkey · scatter Bitcoin Monkeys logo · vault Monkey Store · chain Forever vine
const TIER = { cherry: { k: 'B', name: 'BANANA', col: '#ffd23f' }, lemon: { k: 'S1', name: 'SERUM MM1', col: '#7ee081' }, chip: { k: 'S2', name: 'SERUM MM2', col: '#59d0ff' }, block: { k: 'MU', name: 'MUTANT', col: '#c28bff' }, artifact: { k: '1', name: 'STONE FRAME', col: '#a9bdb0' }, bitcoin: { k: '2', name: 'GOLD FRAME', col: '#ffc83d' } };
const NAMES = { cherry: 'BANANA', lemon: 'Serum MM1', chip: 'Serum MM2', block: 'Mutant Monkey', artifact: 'Bitcoin Monkey (stone)', bitcoin: 'Bitcoin Monkey (gold)', wild: 'Idol Monkey', scatter: 'Bitcoin Monkeys logo', vault: 'Monkey Store', chain: 'Forever vine' };
const TESTBUILD = (() => { try { return !!window.parent.MH_TEST_PAGE; } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account, the saved game, the jackpot meters or the Holder Pot.
const lab = { on: false, real: null, twins: null, last: null };
let state = LAYR.openGame(GAME_ID,E);
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0')}`; }
const r2 = n => Math.round(n * 100) / 100;
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win. The period is one week.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
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

/* The helper is live and every Bitcoin Monkeys record is sealed, so this cabinet never ships dark: it runs as soon as the LAYR account is connected. */
const sources = { registry: 'pending', helper: 'pending', twins: null, twinsFailed: false, images: 0, imageFailures: 0, bundled: 0, cached: false, done: false };
const dark = () => false;
function potShare() { const t = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : 0; return t ? state.pot / t : null; }

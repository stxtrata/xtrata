/* Xtrata Originals — the ParallaX Casino's house machine: work made and inscribed on Xtrata itself.
   Audionauts, cicadas sung from their own seeds, Astro Blaster 3, Audionals, Forever Twins and real Xtrata layers.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any artwork is chosen for a cell, so the art can never change a result. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='xtrata-originals', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.originals.audionauts', bets = E.bets, POT_RATE = .01, STAR_SPLIT = .2;
// The Xtrata palette, taken from the brand mark: matte black, the blue and orange strata, the white top band.
const BLUE = '#4675b6', BLUE2 = '#6593cf', BLUE3 = '#a9c6ee', OR = '#e28c3b', OR2 = '#f2aa5a', WHITE = '#e2e3e1', INK = '#05070b', MUTE = '#8f9bb0';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
const NAMES = { cherry: 'Astro Blaster 3', lemon: 'Audionals', chip: 'Cicada', block: 'Forever Twins', artifact: 'Audionaut', bitcoin: 'The Xtrata mark', wild: 'CALLISTO', scatter: 'The Audionaut work-space-station', vault: 'Cicada call', chain: 'Layer' };
const SHORT = { cherry: 'ASTRO BLASTER', lemon: 'AUDIONALS', chip: 'CICADA', block: 'FOREVER TWINS', artifact: 'AUDIONAUT', bitcoin: 'XTRATA', wild: 'CALLISTO', scatter: 'WORK-SPACE-STATION', vault: 'CICADA CALL', chain: 'LAYER' };
const FRAME = { cherry: '#4fd2ff', lemon: '#ef7410', chip: '#9bcf6a', block: '#39d8ff', artifact: BLUE2, bitcoin: OR2, wild: '#c9b6ff', scatter: OR, vault: '#b6e07a', chain: BLUE3 };
const TESTBUILD = (() => { try { return !!window.parent.XO_TEST_PAGE; } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page; in the casino only with ?lab=1 on a testnet or local host, never for players in production.
const LAB_ALLOWED = TESTBUILD || (() => { try { const w = window.parent, q = w.location.search; return /[?&]lab=1\b/.test(q) && (w.PX_NETWORK === 'testnet' || /testnet|localhost|127\.0\.0\.1|\.local\b/.test(w.location.host)); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account, the saved game, the jackpot meters or the Holder Pot.
const lab = { on: false, real: null, holders: null, last: null, runAll: null };
let state = LAYR.openGame(GAME_ID,E);
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0')}`; }
const r2 = n => Math.round(n * 100) / 100;
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  if (!Array.isArray(state.cameos)) state.cameos = [];
  const wk = weekKey();
  if (!state.potKey) state.potKey = wk;
  if (state.potKey !== wk) { state.lastPot = { key: state.potKey, pot: r2(state.pot), holders: Number.isFinite(sources.minted) ? sources.minted : null }; state.potKey = wk; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
/* ---------- Live sources. Everything here was born on chain, so nothing needs twinning and the cabinet never runs dark. ---------- */
const sources = { registry: 'pending', minted: null, mintRead: 'pending', layers: 'pending', liveLayers: 0, images: 0, imageFailures: 0, bundled: 0, cached: false, done: false };
const dark = () => false;
function potShare() { const n = Number.isFinite(sources.minted) && sources.minted > 0 ? sources.minted : 0; return n ? state.pot / n : null; }

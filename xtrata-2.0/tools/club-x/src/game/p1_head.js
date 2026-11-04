/* Club X — a ParallaX Casino machine for Chemical X, the anonymous British artist who co-founded This Is Number One.
   London, 1991: the only way to find the night was a chalk X on a warehouse door. The machine is that warehouse.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any artwork is chosen for a cell, so the art can never change a result.
   Symbols: Chemical X's own works on Stacks (loaded from the chain, never redrawn), and the X marks, the door, the wristband
   and the tag, which are this machine's agreed exception: original club-flyer art in his spirit, drawn here in code. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='club-x', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.clubx.twins', bets = E.bets, POT_RATE = .01, CAUSE_RATE = .1;
// Palette: acid yellow, warehouse steel, chalk white, laser green and the hot pink of a flyposted flyer.
const ACID = '#e6ff00', ACID2 = '#f4ff7a', ACID3 = '#7f8c00', INK = '#0a0b0c', STEEL = '#15171a', STEEL2 = '#22262a', STEEL3 = '#3a3f44', PAPER = '#f2efe6', CHALK = '#f7f5ef', PINK = '#ff2e88', PINK2 = '#ff86bb', LASER = '#37ff7a', LASER2 = '#b4ffd0', CYAN = '#31e1ff', RED = '#e5322b', RED2 = '#ff6a5e', SMOKE = '#9b9a90', CONC = '#8b8a84', CONC2 = '#6b6a65';
const COND = '"DIN Condensed","Bahnschrift Condensed","Barlow Condensed","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif', MONO = '"SF Mono",Menlo,"DejaVu Sans Mono",Consolas,"Liberation Mono",monospace', SANS = '"Helvetica Neue",Helvetica,Arial,"DejaVu Sans",sans-serif';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
const NAMES = { cherry: 'Chalk X', lemon: 'Stencil X', chip: 'Neon X', block: 'Laser X', artifact: 'Chemical X work', bitcoin: 'This Is Number One', wild: 'The Mask', scatter: 'Midnight', vault: 'Wristband', chain: 'Tag' };
const WORKS = window.CLUBX_WORKS || { works: [] };   // the manifest (art/works.json), embedded at build time
const TESTBUILD = (() => { try { return !!window.parent.CLUBX_TEST_PAGE; } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it appears only behind a developer flag (?lab=1, testnet LAYR).
const LAB_ALLOWED = TESTBUILD || (() => { try { return /[?&]lab=1\b/.test(window.parent.location.search) || /[?&]lab=1\b/.test(location.search); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account,
// the saved game, the jackpot meters, the Holder Pot or the RTP statistics.
const lab = { on: false, real: null, queue: [], autoplay: false, runAll: null, last: null, seedRng: null, item: null };
let state = LAYR.openGame(GAME_ID,E);
const r2 = n => Math.round(n * 100) / 100;
const mul32 = a => () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
/* ---------- The Holder Pot (version 1: a meter and a display only). 1% of every paid bet is added from the house edge; it never
   reduces a player's win. The period is one week (ISO week, UTC). When a week closes, 10% of the pot is set aside for the cause
   Chemical X chooses (This Is Number One's founding rule: at least 10% to causes the artist picks) and 90% is shared per
   forevered twin of the collection, once the collection has a Forever Twins helper. Nothing is paid out in v1. ---------- */
const period = { test: null };
function periodKey(t = Date.now()) {
  if (period.test) return period.test;
  const d = new Date(Date.UTC(new Date(t).getUTCFullYear(), new Date(t).getUTCMonth(), new Date(t).getUTCDate())), dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow); const y0 = Date.UTC(d.getUTCFullYear(), 0, 1), wk = Math.ceil(((d - y0) / 864e5 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(wk).padStart(2, '0')}`;
}
function periodLeftMs(t = Date.now()) { const d = new Date(t), dow = d.getUTCDay() || 7, next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (8 - dow)); return Math.max(0, next - t); }
function leftText() { const ms = periodLeftMs(), d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); return d ? `${d}D ${h}H` : `${h}H ${m}M`; }
// Twins: the collection has no Forever Twins helper yet, so by default every work shows desaturated with NOT YET FOREVER.
const sources = { registry: 'pending', collections: [], twins: null, unknown: 0, done: false, test: null, forever: new Map(), helperFor: {} };
const potTwins = () => Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : null;
function closePot() {
  const tw = potTwins(), cause = r2(state.pot * CAUSE_RATE), share = r2(state.pot - cause);
  state.lastPot = { key: state.potKey, pot: r2(state.pot), cause, share, twins: tw, perTwin: tw ? r2(share / tw) : null };
  state.cause = r2((state.cause || 0) + cause); return state.lastPot;
}
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0; if (!Number.isFinite(state.cause)) state.cause = 0;
  const key = periodKey(); if (!state.potKey) state.potKey = key;
  // A failed twin read never changes who is owed: the period closes on the clock, the share per twin stays "unknown" until the read succeeds.
  if (state.potKey !== key) { closePot(); state.potKey = key; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, ledPulse = 0, kickAt = 0, strobeAt = 0;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
function potShare() { const t = potTwins(); return t ? state.pot * (1 - CAUSE_RATE) / t : null; }
function poolText() {
  if (sources.registry === 'pending') return 'READING THE TWIN REGISTER…'; if (sources.registry === 'unreachable') return 'TWIN COUNT UNKNOWN';
  if (!Number.isFinite(sources.twins)) return 'TWIN COUNT UNKNOWN';
  if (sources.noHelper && !sources.twins) return 'NO FOREVER TWINS HELPER YET · THE POT BUILDS';
  return `${sources.unknown ? '≥ ' : ''}${fmt(sources.twins)} TWINS SHARE IT`;
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = COND, align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = COND, align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; let k = Math.min(1, maxW / Math.max(1, ctx.measureText(s).width)); text(ctx, s, x, y, Math.floor(size * k), color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = COND) { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * ([...s].length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function wrapLines(g, s, maxW, size, font = SANS, weight = '400') { g.font = `${weight} ${size}px ${font}`; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// A rubber stamp: a stencilled word in a double box with worn ink, as stamped on a wristband or a door list.
function rubberStamp(g, s, cx, cy, size, col = ACID, rot = -.08, alpha = .92, sub = '') {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.font = `900 ${size}px ${COND}`; const w = g.measureText(s).width + size * .9, h = size * (sub ? 2.05 : 1.4);
  g.strokeStyle = col; g.lineWidth = Math.max(2, size * .09); g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = Math.max(1, size * .035); g.strokeRect(-w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3);
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, sub ? -size * .26 : 2); if (sub) { g.font = `700 ${Math.round(size * .4)}px ${MONO}`; g.fillText(sub, 0, size * .55); }
  g.globalCompositeOperation = 'destination-out'; let seed = s.length * 97 + 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 22; i++) { g.fillRect((rnd() - .5) * w, (rnd() - .5) * h, 1 + rnd() * 3, 1 + rnd() * 2); }
  g.restore();
}
// Warehouse surfaces (procedural, not anyone's artwork): rivets, brushed steel, board-formed concrete and gaffer-tape hazard stripes.
function rivet(g, x, y, r = 4) { g.fillStyle = lin(g, x - r, y - r, x + r, y + r, ['#9aa1aa', '#3a3f46']); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = '#ffffff55'; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .35, 0, 7); g.fill(); }
function brushed(g, x, y, w, h, base = STEEL2, seed = 3) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 9301 + 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < h; i += 2) { g.fillStyle = `rgba(255,255,255,${r() * .035})`; g.fillRect(x, y + i, w, 1); } g.restore(); }
function concrete(g, x, y, w, h, seed = 5, base = CONC2) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 7919 + 17; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < w * h / 90; i++) { const v = r(); g.fillStyle = v < .5 ? `rgba(0,0,0,${.05 + r() * .1})` : `rgba(255,255,255,${.03 + r() * .06})`; g.fillRect(x + r() * w, y + r() * h, 1 + r() * 2.2, 1 + r() * 2.2); }
  for (let k = 0; k < 6; k++) { const px = x + r() * w, py = y + r() * h, rr = 2 + r() * 4; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(px, py, rr, 0, 7); g.fill(); }
  g.restore(); }
function hazard(g, x, y, w, h, a = 1) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha = a; g.fillStyle = ACID; g.fillRect(x, y, w, h); g.fillStyle = INK; for (let k = -h; k < w + h; k += h * 1.6) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + h * .8, y + h); g.lineTo(x + k + h * .8 + h, y); g.lineTo(x + k + h, y); g.closePath(); g.fill(); } g.restore(); }

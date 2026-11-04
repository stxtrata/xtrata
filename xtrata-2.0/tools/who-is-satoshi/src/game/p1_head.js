/* Who Is Satoshi? — a ParallaX Casino machine: a noir detective's office built around Bitcoin's great mystery.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any record is chosen for a cell, so the art can never change a result.
   No real person's photo appears anywhere, and nobody is named as Satoshi. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='who-is-satoshi', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.whoissatoshi.giftpool', bets = E.bets, POT_RATE = .01;
// Palette: brass, manila, typewriter ink, the green banker's lamp and the red string of the cork board.
const BRASS = '#e0b04a', BRASS2 = '#f6d98f', BRASS3 = '#8a6420', PAPER = '#f1e6c8', MANILA = '#d8bd85', INK = '#211a12', RED = '#b8261d', RED2 = '#e2483c', GREEN = '#3f8a5c', GREEN2 = '#9fd8a8', NOIR = '#0c0a08', SMOKE = '#a99a7e';
const SERIF = 'Georgia, "TeX Gyre Pagella", "Palatino Linotype", serif', TYPE = '"Courier New", Courier, "Liberation Mono", monospace';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
const NAMES = { cherry: 'The Forgery', lemon: 'RPOW', chip: 'Bit Gold', block: 'b-money', artifact: 'Hashcash', bitcoin: "Satoshi's Key", wild: 'The Whitepaper', scatter: 'Forum post', vault: 'Sealed envelope', chain: 'Patoshi block' };
// Pay-tier tab colours on the case-file cards (lowest to highest).
const TAB = { cherry: '#9a8b6a', lemon: '#6f97b3', chip: '#7f9f5c', block: '#c28440', artifact: '#b55348', bitcoin: BRASS, wild: '#f3d38a' };
const REC = window.WIS_RECORDS || { documents: {}, posts: [], patoshi: { heights: [] }, key: {}, forgery: { findings: [] }, clues: [] };
const TESTBUILD = (() => { try { return !!window.parent.WIS_TEST_PAGE; } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it appears only behind a developer flag (?lab=1, testnet LAYR).
const LAB_ALLOWED = TESTBUILD || (() => { try { return /[?&]lab=1\b/.test(window.parent.location.search) || /[?&]lab=1\b/.test(location.search); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account,
// the saved game, the jackpot meters, the Holder Pot or the RTP statistics.
const lab = { on: false, real: null, queue: [], autoplay: false, runAll: null, last: null, seedRng: null, item: null };
let state = LAYR.openGame(GAME_ID,E);
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0')}`; }
const r2 = n => Math.round(n * 100) / 100;
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
// Satoshi's Gift: the whole pot of each weekly period goes to ONE twin, drawn from every live Forever Twins collection.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  const wk = weekKey();
  if (!state.potKey) state.potKey = wk;
  if (state.potKey !== wk) { state.lastPot = { key: state.potKey, pot: r2(state.pot), twins: Number.isFinite(sources.twins) ? sources.twins : null }; state.potKey = wk; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, fake = null, stringGlow = 0;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Satoshi's Gift pool: every twin in every live Forever Twins collection (read live; a failed read is "unknown") ---------- */
const sources = { registry: 'pending', collections: [], twins: null, unknown: 0, done: false, test: null };
function potShare() { const t = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : 0; return t ? state.pot / t : null; }
function poolText() { if (sources.registry === 'pending') return 'READING THE TWIN REGISTER…'; if (!Number.isFinite(sources.twins)) return 'TWIN COUNT UNKNOWN'; return `${sources.unknown ? '≥ ' : ''}${fmt(sources.twins)} TWINS IN THE DRAW`; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = SERIF, align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = SERIF, align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; let k = Math.min(1, maxW / Math.max(1, ctx.measureText(s).width)); text(ctx, s, x, y, Math.floor(size * k), color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = SERIF) { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function wrapLines(g, s, maxW, size, font = SERIF, weight = '400') { g.font = `${weight} ${size}px ${font}`; const out = []; let line = ''; for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// A rubber stamp: rotated, rough-edged ink in a double box.
function rubberStamp(g, s, cx, cy, size, col = RED, rot = -.22, alpha = .9, sub = '') {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.font = `900 ${size}px ${TYPE}`; const w = g.measureText(s).width + size * .9, h = size * (sub ? 2.1 : 1.45);
  g.strokeStyle = col; g.lineWidth = Math.max(2, size * .09); g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = Math.max(1, size * .04); g.strokeRect(-w / 2 + size * .16, -h / 2 + size * .16, w - size * .32, h - size * .32);
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, sub ? -size * .28 : 2); if (sub) { g.font = `700 ${Math.round(size * .42)}px ${TYPE}`; g.fillText(sub, 0, size * .55); }
  g.globalCompositeOperation = 'destination-out'; let seed = s.length * 97; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 26; i++) { g.fillRect((rnd() - .5) * w, (rnd() - .5) * h, 1 + rnd() * 3, 1 + rnd() * 2); }
  g.restore();
}
// The ₿ glyph (the public-domain Bitcoin symbol), set in type.
function btcGlyph(g, cx, cy, size, col) { text(g, '₿', cx, cy, size, col, SERIF, 'center', '700'); }

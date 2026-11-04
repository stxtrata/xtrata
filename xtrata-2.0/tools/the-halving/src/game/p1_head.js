/* The Halving — a ParallaX Casino machine: a brutalist mining rig for Bitcoin's heartbeat. Every 210,000 blocks the
   block subsidy halves, from 50 BTC down towards the 21 million cap.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any record is chosen for a cell, so the art can never change a result.
   Every symbol is a real record: a halving block, a subsidy, a coinbase message, a live block, the supply cap, or ₿. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='the-halving', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.thehalving.epochpot', LIVE_KEY = 'xtrata.thehalving.live', bets = E.bets, POT_RATE = .01;
// Palette: raw concrete, black steel, amber LEDs, the halving gold, and the red of the breaker.
const AMBER = '#ffd23f', AMBER2 = '#ffe88a', AMBER3 = '#9c7a0c', LED = '#ffb020', CONC = '#8e8b85', CONC2 = '#6f6c67', CONC3 = '#4b4946', STEEL = '#16181b', STEEL2 = '#25282d', STEEL3 = '#3b4047', INK = '#0b0c0e', PAPER = '#ece6d6', RED = '#d6312a', RED2 = '#ff5a4e', ORANGE = '#f7931a', GREEN = '#46c37b', GREEN2 = '#9cf0bd', SMOKE = '#a7a39a';
const COND = '"DIN Condensed","Bahnschrift Condensed","Barlow Condensed","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif', MONO = '"SF Mono",Menlo,"DejaVu Sans Mono",Consolas,"Liberation Mono",monospace', SANS = '"Helvetica Neue",Helvetica,Arial,"DejaVu Sans",sans-serif';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
const NAMES = { cherry: 'Block 210,000', lemon: 'Block 420,000', chip: 'Block 630,000', block: 'Block 840,000', artifact: 'Block 1,050,000', bitcoin: '21,000,000', wild: '₿', scatter: 'Subsidy coin', vault: 'Coinbase message', chain: 'Mined block' };
// Pay-tier stripes on the data tiles (lowest to highest): one colour per halving era.
const TAB = { cherry: '#9aa3ad', lemon: '#4fb3b5', chip: '#79b956', block: '#e07a2f', artifact: AMBER, bitcoin: AMBER2, wild: ORANGE };
const REC = window.HALVING_RECORDS || { halvings: [], next: { height: 1050000, leftAtBuild: null }, subsidies: [], messages: [], recent: [], epoch: { length: 2016 }, logo: '' };
const TESTBUILD = (() => { try { return !!window.parent.HALVING_TEST_PAGE; } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it appears only behind a developer flag (?lab=1, testnet LAYR).
const LAB_ALLOWED = TESTBUILD || (() => { try { return /[?&]lab=1\b/.test(window.parent.location.search) || /[?&]lab=1\b/.test(location.search); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account,
// the saved game, the jackpot meters, the Epoch Pot or the RTP statistics.
const lab = { on: false, real: null, queue: [], autoplay: false, runAll: null, last: null, seedRng: null, item: null };
let state = LAYR.openGame(GAME_ID,E);
const r2 = n => Math.round(n * 100) / 100;
/* ---------- The chain as this machine sees it: the tip height and the latest blocks, read live; on a failed read the last
   known values are shown marked STALE, never a guess ---------- */
const chain = { tip: null, tipTime: 0, stale: true, status: 'pending', recent: [], recentLive: false, readAt: 0, test: null };
(function loadCachedChain() { try { const c = JSON.parse(localStorage.getItem(LIVE_KEY) || 'null'); if (c && Number.isFinite(c.tip)) { chain.tip = c.tip; chain.readAt = c.readAt || 0; chain.status = 'cached'; if (Array.isArray(c.recent) && c.recent.length) chain.recent = c.recent; } } catch (e) { storageOK = false; }
  if (!Number.isFinite(chain.tip) && REC.next && Number.isFinite(REC.next.tipAtBuild)) { chain.tip = REC.next.tipAtBuild; chain.readAt = Date.parse(REC.next.buildTime) || 0; chain.status = 'build'; }
  if (!chain.recent.length) chain.recent = (REC.recent || []).slice(); })();
const tipNow = () => chain.test && Number.isFinite(chain.test.tip) ? chain.test.tip : chain.tip;
const blocksLeft = () => Number.isFinite(tipNow()) ? Math.max(0, (REC.next.height || 1050000) - tipNow()) : null;
const EPOCH = (REC.epoch && REC.epoch.length) || 2016;
const epochOf = h => Math.floor(h / EPOCH), epochLeft = () => Number.isFinite(tipNow()) ? EPOCH - (tipNow() % EPOCH) : null;
const staleTag = () => chain.test ? 'TEST' : chain.stale ? 'STALE' : 'LIVE';
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
// The Epoch Pot: the period is one Bitcoin difficulty epoch (2,016 blocks), read from the live tip. A failed read never
// rolls the period over: the pot keeps filling until the chain can be read again.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  const tip = tipNow(); if (!Number.isFinite(tip)) return;
  const ep = 'E' + epochOf(tip);
  if (!state.potKey) state.potKey = ep;
  if (state.potKey !== ep && !chain.stale) { const tw = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : null; state.lastPot = { key: state.potKey, pot: r2(state.pot), twins: tw, perTwin: tw ? r2(state.pot / tw) : null }; state.potKey = ep; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, ledPulse = 0, flapKick = 0, halvingDay = null;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Epoch Pot: every twin in every live Forever Twins collection (read live; a failed read is "unknown") ---------- */
const sources = { registry: 'pending', collections: [], twins: null, unknown: 0, done: false, test: null };
function potShare() { const t = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : 0; return t ? state.pot / t : null; }
function poolText() { if (sources.registry === 'pending') return 'READING THE TWIN REGISTER…'; if (!Number.isFinite(sources.twins)) return 'TWIN COUNT UNKNOWN'; return `${sources.unknown ? '≥ ' : ''}${fmt(sources.twins)} TWINS SHARE IT`; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = COND, align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = COND, align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; let k = Math.min(1, maxW / Math.max(1, ctx.measureText(s).width)); text(ctx, s, x, y, Math.floor(size * k), color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = COND) { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * ([...s].length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function wrapLines(g, s, maxW, size, font = SANS, weight = '400') { g.font = `${weight} ${size}px ${font}`; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// An inspection stamp: a stencilled word in a double box, as sprayed on a rig.
function rubberStamp(g, s, cx, cy, size, col = AMBER, rot = -.08, alpha = .92, sub = '') {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.font = `900 ${size}px ${COND}`; const w = g.measureText(s).width + size * .9, h = size * (sub ? 2.05 : 1.4);
  g.strokeStyle = col; g.lineWidth = Math.max(2, size * .09); g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = Math.max(1, size * .035); g.strokeRect(-w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3);
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, sub ? -size * .26 : 2); if (sub) { g.font = `700 ${Math.round(size * .4)}px ${MONO}`; g.fillText(sub, 0, size * .55); }
  g.globalCompositeOperation = 'destination-out'; let seed = s.length * 97 + 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 22; i++) { g.fillRect((rnd() - .5) * w, (rnd() - .5) * h, 1 + rnd() * 3, 1 + rnd() * 2); }
  g.restore();
}
// The Bitcoin mark: the public-domain logo file from Bitcoin.org (bundled as a data URI), drawn as supplied.
const btcMark = new Image(); let btcMarkReady = false; btcMark.onload = () => { btcMarkReady = true; if (typeof rebuildPools === 'function') { rebuildPools(); screenDirty = true; } }; if (REC.logo) btcMark.src = REC.logo;
function btcLogo(g, cx, cy, size) { if (btcMarkReady) { const w = size * 39 / 40.2; g.drawImage(btcMark, cx - w / 2, cy - size / 2, w, size); } else { g.save(); g.fillStyle = ORANGE; g.beginPath(); g.arc(cx, cy, size / 2, 0, 7); g.fill(); g.restore(); text(g, '₿', cx, cy + size * .03, size * .62, '#fff', SANS, 'center', '700'); } }
// Rivets, brushed steel and concrete: the rig's own surfaces (procedural, not anyone's artwork).
function rivet(g, x, y, r = 4) { g.fillStyle = lin(g, x - r, y - r, x + r, y + r, ['#9aa1aa', '#3a3f46']); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = '#ffffff55'; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .35, 0, 7); g.fill(); }
function brushed(g, x, y, w, h, base = STEEL2, seed = 3) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 9301 + 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < h; i += 2) { g.fillStyle = `rgba(255,255,255,${r() * .035})`; g.fillRect(x, y + i, w, 1); } g.restore(); }
function concrete(g, x, y, w, h, seed = 5, base = CONC2) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 7919 + 17; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < w * h / 90; i++) { const v = r(); g.fillStyle = v < .5 ? `rgba(0,0,0,${.05 + r() * .1})` : `rgba(255,255,255,${.03 + r() * .06})`; g.fillRect(x + r() * w, y + r() * h, 1 + r() * 2.2, 1 + r() * 2.2); }
  for (let k = 0; k < 6; k++) { const px = x + r() * w, py = y + r() * h, rr = 2 + r() * 4; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(px, py, rr, 0, 7); g.fill(); }
  g.restore(); }
function hazard(g, x, y, w, h, a = 1) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha = a; g.fillStyle = AMBER; g.fillRect(x, y, w, h); g.fillStyle = INK; for (let k = -h; k < w + h; k += h * 1.6) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + h * .8, y + h); g.lineTo(x + k + h * .8 + h, y); g.lineTo(x + k + h, y); g.closePath(); g.fill(); } g.restore(); }

/* SAT HUNTER — a ParallaX Casino machine: a Victorian assay lab for Bitcoin's ordinal sats. Every sat has a story.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any record is chosen for a cell, so the art can never change a result.
   Every symbol is a real record (window.SAT_RECORDS): a sat number, its block, rarity, degree and name, or a real fact
   (the 22 May 2010 pizza transaction, the genesis block). Nothing here reads the network. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='sat-hunter', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, POT_RATE = .01;
// Palette: a warm assay lab. Dark oak and brushed brass, a sheet of specimen glass, and one cold blue lamp (the accent).
const ACCENT = '#00a6fb', ACCENT2 = '#6fd3ff', ACCENT3 = '#05689c';          // glass blue: floor glow, trim, focus
const BRASS = '#d9a441', BRASS2 = '#f3cf7a', BRASS3 = '#8a6224', BRASS4 = '#4d3612';
const OAK = '#2a1a10', OAK2 = '#3d2616', OAK3 = '#5a3a22';
const INK = '#07090c', PAPER = '#f1e9d6', GLASS = '#0b1a24', RED = '#d6312a', GREEN = '#46c37b';
const RED2 = '#ff5a4e', GREEN2 = '#9cf0bd', SMOKE = '#a99f8a', ORANGE = '#ff8a3d';
// Names the scene, flow and panel files still use for the same roles (brass in place of amber, the blue lamp in place of the LED).
const AMBER = BRASS, AMBER2 = BRASS2, AMBER3 = BRASS3, LED = ACCENT;
const COND = '"DIN Condensed","Bahnschrift Condensed","Barlow Condensed","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif', MONO = '"SF Mono",Menlo,"DejaVu Sans Mono",Consolas,"Liberation Mono",monospace', SANS = '"Helvetica Neue",Helvetica,Arial,"DejaVu Sans",sans-serif', SERIF = 'Georgia,"Times New Roman",serif';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
// What each engine slot is on the reels (engine ids never appear on screen).
const NAMES = { cherry: 'Uncommon sat', lemon: 'Black sat', chip: 'Palindrome sat', block: 'Vintage sat', artifact: 'Pizza sat', bitcoin: 'Epic sat', wild: 'Rare sat', scatter: 'Nakamoto sat', vault: 'Block 9 sat', chain: 'Sat range' };
const EMPTY_RECORDS = { types: {}, hunts: [], mythic: null, gamble: [], exotic: [], timeline: [], notes: {}, supply: 2099999997690000 };
const SAT_RECORDS = window.SAT_RECORDS || EMPTY_RECORDS, REC = SAT_RECORDS;
const TESTBUILD = (() => { try { return !!(window.parent.SAT_TEST_PAGE || window.parent.HALVING_TEST_PAGE); } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it appears only behind a developer flag (?lab=1, testnet LAYR).
const LAB_ALLOWED = TESTBUILD || (() => { try { return /[?&]lab=1\b/.test(window.parent.location.search) || /[?&]lab=1\b/.test(location.search); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account,
// the saved game, the jackpot meters, the Holder Pot or the RTP statistics.
const lab = { on: false, real: null, queue: [], autoplay: false, runAll: null, last: null, seedRng: null, item: null };
let state = LAYR.openGame(GAME_ID,E);
const r2 = n => Math.round(n * 100) / 100;
/* ---------- No network. The machine reads nothing live: these stand-ins keep the older call sites inert and honest. ---------- */
const chain = { tip: null, tipTime: 0, stale: false, status: 'local', recent: [], recentLive: false, readAt: 0, test: null };
const tipNow = () => null, blocksLeft = () => null, staleTag = () => 'LOCAL';
/* ---------- The Holder Pot period: one UTC week, Monday 00:00 UTC to Monday 00:00 UTC (a clock, no chain read) ---------- */
const PERIOD_MS = 7 * 864e5, EPOCH = PERIOD_MS;
function periodStart(t = Date.now()) { const d = new Date(t), back = (d.getUTCDay() + 6) % 7; return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back); }
const periodKey = (t = Date.now()) => 'W' + new Date(periodStart(t)).toISOString().slice(0, 10);
const periodLeft = (t = Date.now()) => periodStart(t) + PERIOD_MS - t;
function durText(ms) { ms = Math.max(0, ms); const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`; }
const periodText = t => durText(periodLeft(t));
const epochOf = t => periodKey(t), epochLeft = () => periodLeft();
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
// The period rolls on the clock alone; a clock set back never empties the pot.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  const key = periodKey(); if (!state.potKey) state.potKey = key;
  if (key > state.potKey) { const w = walletCount(); state.lastPot = { key: state.potKey, pot: r2(state.pot), wallets: w, perWallet: w ? r2(state.pot / w) : null }; state.potKey = key; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, ledPulse = 0, flapKick = 0, halvingDay = null; // halvingDay = the lab's Rare find event {n, at}: the side counter holds on a rare sat
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Holder Pot shares: linked wallets holding uncommon or rarer sats share it, one share per wallet. Wallet linking and
   the sat index need a server, so the count is UNKNOWN (never zero) until then. sources.twins keeps its old name and now means the
   linked-wallet count; sources.test is the Test panel's sample: none / some / many. ---------- */
const sources = { registry: 'not-live', collections: [], twins: null, unknown: 0, done: true, test: null };
const WALLET_SAMPLES = { none: null, some: 12, many: 480 };
function walletCount() { if (sources.test && sources.test in WALLET_SAMPLES) return WALLET_SAMPLES[sources.test]; return Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : null; }
function setWalletSample(kind) { sources.test = kind in WALLET_SAMPLES ? kind : null; sources.twins = sources.test ? WALLET_SAMPLES[sources.test] : null; screenDirty = true; }
function potShare() { const w = walletCount(); return w ? state.pot / w : null; }
function poolText() { return 'WALLET LINKING: NOT LIVE YET'; }
function shareText() { const s = potShare(); return s == null ? 'SHARE PER WALLET: UNKNOWN' : `SHARE PER WALLET: ≈ ${fmt(s)} LAYR${sources.test ? ' (SAMPLE)' : ''}`; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = COND, align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = COND, align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; let k = Math.min(1, maxW / Math.max(1, ctx.measureText(s).width)); text(ctx, s, x, y, Math.floor(size * k), color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = COND) { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * ([...s].length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function wrapLines(g, s, maxW, size, font = SANS, weight = '400') { g.font = `${weight} ${size}px ${font}`; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// Type set on a circle. top: reads left to right over the top of the circle; otherwise left to right along the bottom (upright).
function arcText(g, s, cx, cy, r, size, color, top = true, font = MONO, weight = '700', gap = 0) {
  g.save(); g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; const chars = [...String(s)], ws = chars.map(ch => g.measureText(ch).width + gap), span = ws.reduce((a, b) => a + b, 0) / r; let acc = 0;
  chars.forEach((ch, i) => { const mid = acc + ws[i] / 2; acc += ws[i]; const a = top ? -Math.PI / 2 - span / 2 + mid / r : Math.PI / 2 + span / 2 - mid / r; g.save(); g.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.rotate(top ? a + Math.PI / 2 : a - Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); });
  g.restore(); return span;
}
// A brass inspection stamp: a serif word in a double box, pressed into the page with a little wear.
function rubberStamp(g, s, cx, cy, size, col = BRASS2, rot = -.08, alpha = .92, sub = '') {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.font = `900 ${size}px ${SERIF}`; const w = g.measureText(s).width + size * .9, h = size * (sub ? 2.05 : 1.4);
  g.strokeStyle = col; g.lineWidth = Math.max(2, size * .09); g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = Math.max(1, size * .035); g.strokeRect(-w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3);
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, sub ? -size * .26 : 2); if (sub) { g.font = `700 ${Math.round(size * .4)}px ${MONO}`; g.fillText(sub, 0, size * .55); }
  g.globalCompositeOperation = 'destination-out'; let seed = s.length * 97 + 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 22; i++) { g.fillRect((rnd() - .5) * w, (rnd() - .5) * h, 1 + rnd() * 3, 1 + rnd() * 2); }
  g.restore();
}
// Rivets, brushed brass and oak grain: the lab's own surfaces (procedural, not anyone's artwork).
function rivet(g, x, y, r = 4) { g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [BRASS2, BRASS3]); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = '#00000066'; g.lineWidth = Math.max(.6, r * .18); g.stroke(); g.fillStyle = '#ffffff88'; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .32, 0, 7); g.fill(); }
function brushed(g, x, y, w, h, base = BRASS3, seed = 3) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 9301 + 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < h; i += 2) { g.fillStyle = r() < .5 ? `rgba(255,236,180,${r() * .07})` : `rgba(0,0,0,${r() * .06})`; g.fillRect(x, y + i, w, 1); } g.restore(); }
function oak(g, x, y, w, h, seed = 5, base = OAK2) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); let s = seed * 7919 + 17; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const n = Math.max(8, Math.floor(h / 3));
  for (let i = 0; i < n; i++) { const yy = y + (i + r()) * h / n, amp = 1 + r() * 4, ph = r() * 6.28, fr = .004 + r() * .01, dark = r() < .62; g.strokeStyle = dark ? `rgba(0,0,0,${.05 + r() * .13})` : `rgba(255,208,150,${.02 + r() * .05})`; g.lineWidth = .6 + r() * 1.6; g.beginPath(); for (let xx = 0; xx <= w + 24; xx += 24) { const py = yy + Math.sin(xx * fr + ph) * amp; xx ? g.lineTo(x + xx, py) : g.moveTo(x, py); } g.stroke(); }
  for (let k = 0; k < Math.max(1, Math.floor(w * h / 120000)); k++) { const px = x + r() * w, py = y + r() * h; for (let q = 1; q < 5; q++) { g.strokeStyle = `rgba(0,0,0,${.14 - q * .02})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(px, py, 4 + q * 5, 2 + q * 2.4, 0, 0, 7); g.stroke(); } }
  g.restore(); }
// A brass hatch band (the old hazard tape, now engraved hatching on brass).
function hazard(g, x, y, w, h, a = 1) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha = a; g.fillStyle = lin(g, x, y, x, y + h, [BRASS2, BRASS, BRASS3]); g.fillRect(x, y, w, h); g.strokeStyle = BRASS4; g.lineWidth = Math.max(1, h * .12); const step = Math.max(4, h * .55); for (let k = -h; k < w + h; k += step) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + h, y); g.stroke(); } g.restore(); }

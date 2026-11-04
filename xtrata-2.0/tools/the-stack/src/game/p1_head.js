/* The Stack — a ParallaX Casino machine about Stacks as it is now: the wallets, the apps, sBTC, stacking and fast blocks.
   It runs the Block Fortune v2 engine unchanged; this file is only the theme: names, art, sound, copy and the screen.
   Every outcome comes from BF before any logo or record is chosen for a cell, so the art can never change a result.
   Every symbol is a real project's official logo file or a real record read from the chain (the Hiro API). */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='the-stack', LAYR=window.ParallaxLAYRAccount, E0=LAYR.machine(GAME_ID,BF); let E=E0;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const CACHE_KEY = 'xtrata.thestack.floorpot', LIVE_KEY = 'xtrata.thestack.live', bets = E.bets, POT_RATE = .01;
// Palette: black glass, the Stacks purple and the Stacks orange (#fc6432, the machine's accent), with Bitcoin's own orange for anchors.
const PURPLE = '#5546ff', PURPLE2 = '#8f84ff', PURPLE3 = '#2a1fb0', VIOLET = '#9a5ce6', ORANGE = '#fc6432', ORANGE2 = '#ff9d72', ORANGE3 = '#b23d14', BTC = '#f7931a',
  INK = '#06060a', GLASS = '#0b0b12', GLASS2 = '#14141f', GLASS3 = '#1d1d2c', LINE = '#2a2a3d', TXT = '#e7e5ff', MUTED = '#9d9bbd', DIM = '#5f5d7a', GREEN = '#3ddc97', GREEN2 = '#9ff2cf', RED = '#ff5a6e', WHITE = '#ffffff';
const COND = '"DIN Condensed","Bahnschrift Condensed","Barlow Condensed","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif', MONO = '"SF Mono",Menlo,"DejaVu Sans Mono",Consolas,"Liberation Mono",monospace', SANS = '"Inter","Helvetica Neue",Helvetica,Arial,"DejaVu Sans",sans-serif';
const SLOT_ORDER = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin'];
const NAMES = { cherry: 'Leather', lemon: 'Xverse', chip: 'Bitflow', block: 'Zest Protocol', artifact: 'sBTC', bitcoin: 'Bitcoin ₿', wild: 'Stacks (STX)', scatter: 'Stacking cycle', vault: 'StackingDAO', chain: 'Fast block' };
// Which official logo file stands for each slot (art/logos, bundled as data URIs), and what the project is.
const LOGO_OF = { cherry: 'leather', lemon: 'xverse', chip: 'bitflow', block: 'zest', artifact: 'sbtc', wild: 'stacks', vault: 'stackingdao' };
const WHAT = { cherry: 'BITCOIN & STACKS WALLET', lemon: 'BITCOIN & STACKS WALLET', chip: 'DEX ON STACKS', block: 'LENDING ON STACKS', artifact: '1:1 BITCOIN ON STACKS', wild: 'THE STACKS TOKEN', vault: 'LIQUID STACKING' };
// The project's own colour, for the type tile shown until (or if) its logo file can't be drawn.
const BRAND = { leather: '#12100f', xverse: '#111420', bitflow: '#f78116', zest: '#ff6702', stackingdao: '#1c3830', sbtc: '#fc6432', stacks: '#fc6432' };
// Pay-tier stripes on the tiles (lowest to highest).
const TAB = { cherry: '#6f6d8c', lemon: '#7b74c9', chip: '#8f84ff', block: '#a874ff', artifact: ORANGE, bitcoin: BTC, wild: PURPLE };
const REC = window.STACK_RECORDS || { pox: { cycle: null, firstBurnHeight: 666050, rewardCycleLength: 2100, prepareLength: 100 }, tip: {}, blocks: [], cycles: [], burn: [], logos: {}, logo: '' };
const TESTBUILD = (() => { try { return !!window.parent.STACK_TEST_PAGE; } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it appears only behind a developer flag (?lab=1, testnet LAYR).
const LAB_ALLOWED = TESTBUILD || (() => { try { return /[?&]lab=1\b/.test(window.parent.location.search) || /[?&]lab=1\b/.test(location.search); } catch (e) { return false; } })();
let storageOK = true, sessionLock = true;
// Bonus Lab: a practice sandbox with its own state and the raw engine. While it is on, nothing touches the LAYR account,
// the saved game, the jackpot meters, the Floor Pot or the RTP statistics.
const lab = { on: false, real: null, queue: [], autoplay: false, runAll: null, last: null, seedRng: null, item: null };
let state = LAYR.openGame(GAME_ID,E);
const r2 = n => Math.round(n * 100) / 100;
/* ---------- The chain as this machine sees it: the Bitcoin tip (which sets the stacking cycle), the latest Stacks blocks
   and the PoX state, read live from the Hiro API; on a failed read the last known values are shown marked STALE, never a guess ---------- */
const POX = { first: REC.pox.firstBurnHeight || 666050, len: REC.pox.rewardCycleLength || 2100, prep: REC.pox.prepareLength || 100 };
const chain = { burn: null, stacks: null, stale: true, status: 'pending', recent: [], recentLive: false, burnRecent: [], readAt: 0, pox: null, test: null, newAt: 0, newCount: 0 };
(function loadCachedChain() { try { const c = JSON.parse(localStorage.getItem(LIVE_KEY) || 'null'); if (c && Number.isFinite(c.burn)) { chain.burn = c.burn; chain.stacks = c.stacks; chain.readAt = c.readAt || 0; chain.status = 'cached'; if (Array.isArray(c.recent) && c.recent.length) chain.recent = c.recent; if (Array.isArray(c.burnRecent) && c.burnRecent.length) chain.burnRecent = c.burnRecent; } } catch (e) { storageOK = false; }
  if (!Number.isFinite(chain.burn) && REC.tip && Number.isFinite(REC.tip.burn)) { chain.burn = REC.tip.burn; chain.stacks = REC.tip.stacks; chain.readAt = Date.parse(REC.tip.time) || 0; chain.status = 'build'; }
  if (!chain.recent.length) chain.recent = (REC.blocks || []).slice();
  if (!chain.burnRecent.length) chain.burnRecent = (REC.burn || []).slice(); })();
const burnNow = () => chain.test && Number.isFinite(chain.test.burn) ? chain.test.burn : chain.burn;
const stacksNow = () => chain.test && Number.isFinite(chain.test.stacks) ? chain.test.stacks : chain.stacks;
// A stacking cycle is 2,100 Bitcoin blocks from the PoX first burn height; its last 100 are the prepare phase.
const cycleOf = h => Math.floor((h - POX.first) / POX.len), cycleStart = c => POX.first + c * POX.len, cycleEnd = c => cycleStart(c + 1);
const cycleNow = () => Number.isFinite(burnNow()) ? cycleOf(burnNow()) : (chain.pox && chain.pox.cycle) || REC.pox.cycle || null;
const cycleLeft = () => Number.isFinite(burnNow()) ? cycleEnd(cycleOf(burnNow())) - burnNow() : null;
const cycleDone = () => Number.isFinite(burnNow()) ? (burnNow() - cycleStart(cycleOf(burnNow()))) / POX.len : null;
const inPrepare = () => { const l = cycleLeft(); return Number.isFinite(l) && l <= POX.prep; };
const endsIn = () => { const l = cycleLeft(); if (!Number.isFinite(l)) return '—'; const m = l * 10, d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60), mm = Math.round(m % 60); return d ? `${d}d ${h}h` : h ? `${h}h ${mm}m` : `${mm}m`; };
const staleTag = () => chain.test ? 'TEST' : chain.stale ? 'STALE' : 'LIVE';
// Holder Pot (version 1: a meter only). 1% of every paid bet is added from the house edge; it never reduces a player's win.
// The Floor Pot: the period is one stacking cycle, read from the live Bitcoin tip. A failed read never rolls the period over:
// the pot keeps filling until the chain can be read again.
function ensureExtras() {
  if (!Number.isFinite(state.pot)) state.pot = 0;
  const c = cycleNow(); if (!Number.isFinite(c)) return;
  const key = 'C' + c;
  if (!state.potKey) state.potKey = key;
  if (state.potKey !== key && !chain.stale) { const tw = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : null; state.lastPot = { key: state.potKey, pot: r2(state.pot), twins: tw, perTwin: tw ? r2(state.pot / tw) : null }; state.potKey = key; state.pot = 0; }
}
function save() { if (!sessionLock && !lab.on) LAYR.saveGame(state); }
let pres = null, spinForced = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], leverStart = 0, ledPulse = 0, tickKick = 0, turnover = null;
const feature = () => E.feature(state);
const busy = () => spinning || !!pres || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Floor Pot: every twin in every live Forever Twins collection (read live; a failed read is "unknown") ---------- */
const sources = { registry: 'pending', collections: [], twins: null, unknown: 0, done: false, test: null };
function potShare() { const t = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : 0; return t ? state.pot / t : null; }
function poolText() { if (sources.registry === 'pending') return 'READING THE TWIN REGISTER…'; if (!Number.isFinite(sources.twins)) return 'TWIN COUNT UNKNOWN'; return `${sources.unknown ? '≥ ' : ''}${fmt(sources.twins)} TWINS SHARE IT`; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = SANS, align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, font = SANS, align = 'center', weight = 'bold') { ctx.font = `${weight} ${size}px ${font}`; let k = Math.min(1, maxW / Math.max(1, ctx.measureText(s).width)); text(ctx, s, x, y, Math.floor(size * k), color, font, align, weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = SANS) { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * ([...s].length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function wrapLines(g, s, maxW, size, font = SANS, weight = '400') { g.font = `${weight} ${size}px ${font}`; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// A confirmation stamp: a clean word in a rounded double frame, set down at a slight angle.
function rubberStamp(g, s, cx, cy, size, col = ORANGE, rot = -.08, alpha = .92, sub = '') {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.font = `800 ${size}px ${SANS}`; const w = g.measureText(s).width + size * .9, h = size * (sub ? 2.05 : 1.45);
  g.strokeStyle = col; g.lineWidth = Math.max(2, size * .08); g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, size * .3); g.stroke(); g.lineWidth = Math.max(1, size * .03); g.beginPath(); g.roundRect(-w / 2 + size * .14, -h / 2 + size * .14, w - size * .28, h - size * .28, size * .22); g.stroke();
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, sub ? -size * .26 : 2); if (sub) { g.font = `700 ${Math.round(size * .4)}px ${MONO}`; g.fillText(sub, 0, size * .55); }
  g.restore();
}
/* ---------- The official logo files (art/logos, as bundled in @leather.io/ui; data URIs in STACK_RECORDS.logos), drawn as
   supplied: uniform scale, never recoloured, stretched or cropped. Until a file has loaded, its name is set in type on a tile
   in the project's colour. The Bitcoin mark is the public-domain file from Bitcoin.org. ---------- */
const logoImg = {}, logoReady = {};
function loadLogo(key, url) { if (!url) return; const im = new Image(); im.onload = () => { logoReady[key] = true; if (typeof rebuildPools === 'function') { rebuildPools(); screenDirty = true; } }; im.src = url; logoImg[key] = im; }
for (const [k, u] of Object.entries(REC.logos || {})) loadLogo(k, u);
loadLogo('bitcoin', REC.logo);
const LOGO_NAME = { leather: 'Leather', xverse: 'Xverse', bitflow: 'Bitflow', zest: 'Zest', stackingdao: 'StackingDAO', sbtc: 'sBTC', stacks: 'Stacks', bitcoin: '₿' };
function drawLogo(g, key, cx, cy, size) {
  const im = logoImg[key];
  if (logoReady[key] && im) { const k = size / Math.max(im.width || 40, im.height || 40), w = (im.width || 40) * k, h = (im.height || 40) * k; g.drawImage(im, cx - w / 2, cy - h / 2, w, h); return; }
  round(g, cx - size / 2, cy - size / 2, size, size, size * .2, BRAND[key] || GLASS3, '#ffffff33', 2); fitText(g, LOGO_NAME[key] || key, cx, cy, size * .26, size * .86, '#fff', SANS, 'center', '800');
}
function btcLogo(g, cx, cy, size) { drawLogo(g, 'bitcoin', cx, cy, size); }
// The machine's own surfaces: black glass with a soft sheen, hairline purple edges, stacked light bars (procedural, nobody's artwork).
function glassPanel(g, x, y, w, h, r = 12, edge = LINE, lw = 2, fill) { round(g, x, y, w, h, r, fill || lin(g, x, y, x, y + h, ['#16162299', '#0b0b12e6', '#07070bf2'])); g.save(); g.beginPath(); g.roundRect(x, y, w, h, r); g.clip(); g.fillStyle = lin(g, x, y, x + w * .6, y + h, ['#ffffff10', '#ffffff00']); g.fillRect(x, y, w, h * .5); g.restore(); if (edge) round(g, x, y, w, h, r, null, edge, lw); }
function stackBars(g, cx, cy, w, n = 4, col = PURPLE, col2 = ORANGE, h = 10, gap = 6) { for (let k = 0; k < n; k++) { const t = n > 1 ? k / (n - 1) : 0, ww = w * (1 - t * .3), y = cy + (n - 1 - k) * (h + gap) - (n * (h + gap)) / 2; round(g, cx - ww / 2, y, ww, h, h / 2, k >= n / 2 ? col2 : col); } }

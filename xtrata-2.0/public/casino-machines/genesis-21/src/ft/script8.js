/* Forever Twins — an Xtrata Arcade machine. Only forevered NFTs spin here: Bitcoin Pepes and Bitcoin Birds pay,
   and every other permanent twin is a wild card. Art is loaded live from Xtrata and is purely cosmetic: every outcome
   comes from BF (shared/engine.js) before any image is chosen, so the maths never depends on how many twins exist. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='forever-twins', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const KEY='xtrata.parallax.layr.forever-twins.v1', CACHE_KEY = 'xtrata.forevertwins.twins', bets = E.bets;
const NAMES = { cherry: 'Cherry', lemon: 'Bell', chip: 'BAR', block: 'Lucky 7', artifact: 'Bitcoin Bird', bitcoin: 'Bitcoin Pepe', wild: 'Forever Wild', scatter: 'Inscribe', vault: 'Bind', chain: 'Hash' };
let storageOK = true, sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);if(GAME_ID==='deep-strata'&&!Number.isFinite(state.deepest))state.deepest=0;
function save(){if(!sessionLock)LAYR.saveGame(state);}
let spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, view = 'cabinet', chainFlash = 0, animations = [];
const feature = () => E.feature(state);
const busy = () => spinning || !!feature() || state.free > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'INSCRIBE WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} INSCRIBE SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet));
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'SPINNING…' : f ? (E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`) : state.free ? 'INSCRIBE' : broke ? 'GET LAYR' : 'SPIN';
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 7);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock; 
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  screenDirty = true;
}

/* ---------- Procedural audio: glassy tones, no files ---------- */
let ac = null, master = null, ambNodes = [];
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const PENT = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { tone(220, .5, 'sine', .08, 0, 2); tone(330, .5, 'sine', .05, .04, 2); }
  if (kind === 'stop') return [tone(140 + i * 18, .12, 'triangle', .22, at), tone(1568 + i * 196, .09, 'sine', .05, at), tone(2093 + i * 260, .14, 'sine', .025, at + .01)].filter(Boolean);
  if (kind === 'win') PENT.slice(0, 5).forEach((n, k) => { tone(n, .5, 'sine', .12, k * .09); tone(n * 2, .35, 'sine', .03, k * .09 + .01); });
  if (kind === 'big') PENT.forEach((n, k) => { tone(n, .7, 'triangle', .11, k * .09); tone(n / 2, .9, 'sine', .06, k * .09); });
  if (kind === 'bonus') [392, 523.25, 659.25, 783.99, 1046.5].forEach((n, k) => tone(n, .7, 'sine', .13, k * .11));
  if (kind === 'antic') tone(180, 1.6, 'sawtooth', .03, 0, 3);
  if (kind === 'lock') { tone(1318.5 + i * 90, .3, 'sine', .11, i * .08); tone(659.25 + i * 45, .25, 'triangle', .06, i * .08); }
  if (kind === 'respin') tone(420, .25, 'triangle', .16, 0, .7);
  if (kind === 'pick') { tone(784 + i * 60, .35, 'sine', .15); tone(1568 + i * 120, .25, 'sine', .04, .02); }
  if (kind === 'click') tone(880, .05, 'sine', .06);
  if (kind === 'lose') tone(150, .4, 'triangle', .12, 0, .6);
  if (kind === 'swap') { tone(600, .25, 'sine', .1, 0, 1.6); tone(960, .25, 'sine', .1, .12, .6); }
  return [];
}
function ambient() { ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return; [65.4, 98, 130.8, 196].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.detune.value = i * 3; g.gain.value = .011 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); }); }
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));

/* ---------- Canvas helpers, the Forever Twins mark and standard symbols ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function spaced(ctx, s, x, y, size, gap, color, weight = '600') { ctx.font = `${weight} ${size}px Arial`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
// The Forever Twins ∞: a figure-of-eight band built from two loops and crossing tangents, cut into horizontal light bars.
function infinityPath(g, cx, cy, w) { const d = w * .27, r = w * .2, s = r / d, c = Math.sqrt(1 - s * s), px = d - r * s, py = r * c; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + px, cy - py); g.arc(cx + d, cy, r, Math.atan2(-c, -s), Math.atan2(c, -s), false); g.lineTo(cx - px, cy - py); g.arc(cx - d, cy, r, Math.atan2(-c, s), Math.atan2(c, s), true); g.closePath(); }
function drawInfinity(g, cx, cy, w, color = '#39d8ff', stripes = true) {
  const W = Math.ceil(w * 1.1), H = Math.ceil(w * .62), off = canvas(W, H), o = off.getContext('2d');
  o.lineWidth = w * .09; o.lineJoin = 'round'; o.strokeStyle = '#fff'; infinityPath(o, W / 2, H / 2, w); o.stroke();
  o.globalCompositeOperation = 'source-in'; o.fillStyle = lin(o, 0, 0, 0, H, ['#bff8ff', color, '#0f8fc4']); o.fillRect(0, 0, W, H);
  if (stripes) { o.globalCompositeOperation = 'destination-out'; const step = Math.max(4, w * .033); for (let y = step * .7; y < H; y += step) o.fillRect(0, y, W, step * .3); }
  g.save(); g.shadowColor = color; g.shadowBlur = w * .06; g.drawImage(off, cx - W / 2, cy - H / 2); g.restore();
}
function drawForeverMark(g, cx, cy, w, color = '#39d8ff') { g.save(); g.shadowColor = color; g.shadowBlur = w * .03; spaced(g, 'FOREVER', cx, cy - w * .4, w * .09, w * .045, '#9ff3ff'); spaced(g, 'TWINS', cx, cy + w * .4, w * .09, w * .07, '#9ff3ff'); g.restore(); drawInfinity(g, cx, cy, w * .78, color); }
const tag = (g, s, color) => { g.shadowBlur = 0; g.shadowOffsetY = 0; text(g, s, 0, 102, 22, color); };
const symbolImages = {};
for (const s of ['cherry', 'lemon', 'chip', 'block', 'scatter', 'vault', 'chain']) {
  const c=canvas(480,480),g=c.getContext('2d');g.scale(2,2);g.translate(120,120); g.lineCap = 'round'; g.lineJoin = 'round';
  const neon = (col, blur = 16) => { g.shadowColor = col; g.shadowBlur = blur; g.strokeStyle = col; g.fillStyle = col; };
  if (s === 'cherry') { neon('#ff4d7a'); g.lineWidth = 7; g.beginPath(); g.moveTo(-36, 18); g.quadraticCurveTo(-24, -44, 30, -76); g.quadraticCurveTo(6, -24, 40, 30); g.stroke(); for (const [x, y] of [[-38, 40], [42, 50]]) { g.lineWidth = 8; g.beginPath(); g.arc(x, y, 38, 0, 7); g.stroke(); g.globalAlpha = .25; g.fill(); g.globalAlpha = 1; } }
  if (s === 'lemon') { neon('#ffd166'); g.lineWidth = 8; g.beginPath(); g.moveTo(-70, 50); g.quadraticCurveTo(-58, 40, -56, -6); g.bezierCurveTo(-54, -78, 54, -78, 56, -6); g.quadraticCurveTo(58, 40, 70, 50); g.closePath(); g.stroke(); g.globalAlpha = .2; g.fill(); g.globalAlpha = 1; g.beginPath(); g.arc(0, 64, 13, 0, 7); g.fill(); g.lineWidth = 6; g.beginPath(); g.moveTo(-8, -78); g.lineTo(8, -78); g.stroke(); }
  if (s === 'chip') { neon('#5ff0ff'); g.lineWidth = 7; round(g, -94, -40, 188, 80, 16, null, '#5ff0ff', 7); g.shadowBlur = 20; text(g, 'BAR', 0, 3, 58, '#d9fbff', 'Arial', 'center', '900'); }
  if (s === 'block') { neon('#c77dff', 22); g.font = 'italic 900 190px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 8; g.strokeText('7', 4, 6); g.globalAlpha = .3; g.fillText('7', 4, 6); g.globalAlpha = 1; }
  if (s === 'scatter') { neon('#7fffd4'); g.save(); g.translate(0, -12); g.rotate(-.65); g.lineWidth = 7; g.beginPath(); g.moveTo(0, -78); g.lineTo(34, -18); g.quadraticCurveTo(30, 30, 0, 76); g.quadraticCurveTo(-30, 30, -34, -18); g.closePath(); g.stroke(); g.globalAlpha = .22; g.fill(); g.globalAlpha = 1; g.beginPath(); g.moveTo(0, 74); g.lineTo(0, 4); g.stroke(); g.beginPath(); g.arc(0, -6, 10, 0, 7); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(-26, -40); g.lineTo(26, -40); g.stroke(); g.restore(); tag(g, 'INSCRIBE', '#b9ffe9'); }
  if (s === 'vault') { neon('#39d8ff'); g.save(); g.translate(0, -8); g.scale(1, 1); g.lineWidth = 9; for (const x of [-30, 30]) { g.beginPath(); g.ellipse(x, 0, 46, 34, 0, 0, 7); g.stroke(); } g.restore(); g.fillStyle = '#39d8ff'; round(g, -12, -14, 24, 22, 4, '#39d8ff'); tag(g, 'BIND', '#bff6ff'); }
  if (s === 'chain') { neon('#4cc9f0'); g.lineWidth = 6; const hx = (r) => { g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(Math.cos(a) * r, -10 + Math.sin(a) * r); } g.closePath(); }; hx(76); g.stroke(); g.globalAlpha = .18; g.fill(); g.globalAlpha = 1; g.shadowBlur = 8; text(g, '0x', 0, -24, 40, '#e6fbff', 'Courier New', 'center', '900'); text(g, 'a7e0', 0, 14, 26, '#9fefff', 'Courier New', 'center', '700'); tag(g, 'HASH', '#bfefff'); }
  symbolImages[s] = c;
}
for (const id of ['brandmark', 'loaderMark']) { const el = $(id); if (!el) continue; const g = el.getContext('2d'); if (id === 'brandmark') xtrataLogo(g, el.width / 2, el.height / 2, el.width * .9); else drawForeverMark(g, el.width / 2, el.height / 2, el.width * .9); }

/* ---------- Live twins: read the Forever Twins registry and helpers, load the art from Xtrata ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const PAYING = { bitcoin: 'bitcoin-pepes', artifact: 'bitcoin-birds' };
// Used only if the registry can't be read: the helpers live on 23 Oct 2026.
const KNOWN = [
  { key: 'bitcoin-pepes', name: 'Bitcoin Pepes', itemNoun: 'Bitcoin Pepe', helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun', accent: '#2f9e44' },
  { key: 'bitcoin-birds', name: 'Bitcoin Birds', itemNoun: 'Bitcoin Bird', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-birds', accent: '#f08c00' },
  { key: 'leo-cats', name: 'LEO Cats', itemNoun: 'LEO Cat', helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata', accent: '#e8590c' },
  { key: 'miami-degens', name: 'Miami Degens', itemNoun: 'Miami Degen', helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata', accent: '#e64980' },
  { key: 'nyc-degens', name: 'NYC Degens', itemNoun: 'NYC Degen', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens', accent: '#1f5fe0' },
  { key: 'megapont-ape-club', name: 'Megapont Ape Club', itemNoun: 'Megapont Ape', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club', accent: '#7048e8' },
  { key: 'bitcoin-monkeys', name: 'Bitcoin Monkeys', itemNoun: 'Bitcoin Monkey', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-monkeys', accent: '#d9a300' }];
const pools = { bitcoin: [], artifact: [], wild: [] }, collections = new Map(), sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, cached: false, done: false, bundled: 0 };
const poolOf = key => key === PAYING.bitcoin ? 'bitcoin' : key === PAYING.artifact ? 'artifact' : 'wild';
const shortName = col => (col.name || col.key).replace(/^Bitcoin /, '').toUpperCase();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// A random sample of each helper's twins: the newest page, plus two pages from random points in its history.
async function sampleTwins(col) {
  const first = parseEvents(await eventsPage(col.helper, 0)), found = new Map(first.list.map(t => [t.tokenId, t]));
  col.inscribed = first.count || found.size;
  if (first.rows === 50 && col.inscribed > 50) for (const o of [1, 2].map(() => 50 + Math.floor(Math.random() * Math.max(1, col.inscribed - 50)))) { try { parseEvents(await eventsPage(col.helper, o)).list.forEach(t => found.set(t.tokenId, t)); } catch (e) {} }
  return [...found.values()];
}
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
const twinUrl = xid => { const [a, n] = SRC.core.split('.'); return `${SRC.origin}/inscription/mainnet/${a}/${n}/${xid}`; };
// Each twin becomes a framed reel tile: the art, its token number and a ∞ badge in the collection's colour.
function twinTile(img, col, item, wild) {
  const c = canvas(240, 240), g = c.getContext('2d'), accent = col.accent || '#39d8ff';
  g.shadowColor = wild ? '#39d8ff' : accent; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#050a10', wild ? '#7ff3ff' : accent, wild ? 6 : 4); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.fillStyle = '#0b1219'; g.fillRect(24, 16, 192, 160);
  const fit = Math.min(192 / img.width, 160 / img.height), k = img.width <= 200 && fit >= 1 ? Math.floor(fit) : fit, w = img.width * k, h = img.height * k; g.imageSmoothingEnabled = img.width > 200; g.drawImage(img, 24 + (192 - w) / 2, 16 + (160 - h) / 2, w, h); g.restore();
  round(g, 24, 180, 192, 30, 7, wild ? '#39d8ff' : '#0b1219'); text(g, wild ? `WILD · ${shortName(col)}` : `#${item.tokenId}`, 120, 196, wild ? 15 : 19, wild ? '#001521' : '#e6fbff');
  g.fillStyle = '#05080c'; g.beginPath(); g.arc(204, 30, 17, 0, 7); g.fill(); drawInfinity(g, 204, 30, 30, wild ? '#7ff3ff' : '#39d8ff', false);
  return c;
}
function placeholderTile(sym) {
  const c = canvas(240, 240), g = c.getContext('2d'), wild = sym === 'wild', col = wild ? '#39d8ff' : sym === 'bitcoin' ? '#2f9e44' : '#f08c00';
  g.shadowColor = col; g.shadowBlur = 16; round(g, 14, 6, 212, 212, 16, '#050a10', col, wild ? 6 : 4); g.shadowBlur = 0;
  drawInfinity(g, 120, wild ? 86 : 74, 150, wild ? '#7ff3ff' : col);
  if (wild) { round(g, 24, 180, 192, 30, 7, '#39d8ff'); text(g, 'FOREVER WILD', 120, 196, 17, '#001521'); }
  else { text(g, 'BITCOIN', 120, 150, 20, '#e6fbff'); text(g, sym === 'bitcoin' ? 'PEPES' : 'BIRDS', 120, 178, 30, col, 'Arial', 'center', '900'); text(g, 'TWIN LOADING', 120, 206, 13, '#7f95a5'); }
  return c;
}
const placeholders = { bitcoin: placeholderTile('bitcoin'), artifact: placeholderTile('artifact'), wild: placeholderTile('wild') };
function liveLabel() {
  const n = pools.bitcoin.length + pools.artifact.length + pools.wild.length;
  const txt = sources.images ? `LIVE FROM XTRATA · ${n} TWINS ON THE REELS` : sources.done ? `XTRATA UNREACHABLE · ${sources.bundled} BUNDLED TWINS` : 'CONNECTING TO XTRATA…';
  $('liveSrc').textContent = txt; $('twinsSmall').textContent = `${n} forevered twins on the reels`; screenDirty = true;
}
// Real Pepes and Birds bundled in the file (art.js): genuine inscribed art on the reels from the first frame, even offline.
async function loadBundled() {
  const art = window.FT_ART || [];
  await Promise.all(art.map(async a => { const col = KNOWN.find(k => k.key === a.key); if (!col) return; try { const img = await loadImage(a.src, 8000); const twin = { key: a.key, name: col.itemNoun, tokenId: a.tokenId, xtrataId: a.xtrataId, tile: twinTile(img, col, a, false), img, bundled: true }; pools[poolOf(a.key)].push(twin); sources.bundled++; placeWall(twin); } catch (e) {} }));
  liveLabel();
}
async function loadTwins() {
  await loadBundled();
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = (reg.collections || []).filter(c => c.status === 'live' && c.helper).map(c => ({ key: c.key, name: c.name, itemNoun: c.itemNoun || c.name, helper: c.helper, accent: (c.theme && c.theme.accent) || null })); sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; }
  if (!cols || !cols.length) { cols = KNOWN.map(c => ({ ...c })); if (sources.registry === 'live') sources.registry = 'fallback'; }
  KNOWN.forEach(k => { const c = cols.find(x => x.key === k.key); if (c && !c.accent) c.accent = k.accent; });
  // Twin lists are cached for six hours so a reload doesn't re-read every helper.
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core;
  await Promise.all(cols.map(async col => {
    collections.set(col.key, { ...col, inscribed: 0, found: 0, loaded: 0, pool: poolOf(col.key) });
    try { const list = fresh && cache.lists[col.key] ? cache.lists[col.key] : await sampleTwins(col); const m = collections.get(col.key); m.list = list; m.found = list.length; m.inscribed = col.inscribed || (fresh && cache.counts && cache.counts[col.key]) || list.length; sources.lists++; }
    catch (e) { sources.listFailures++; collections.get(col.key).list = []; }
  }));
  sources.cached = !!fresh;
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, lists: Object.fromEntries([...collections].map(([k, c]) => [k, c.list])), counts: Object.fromEntries([...collections].map(([k, c]) => [k, c.inscribed])) })); } catch (e) {}
  // Load a random selection: 18 each for the paying collections, up to 6 from every wild collection.
  const queue = [];
  for (const c of collections.values()) { const have = new Set(pools[c.pool].filter(t => t.key === c.key).map(t => t.tokenId)); c.bundled = have.size; const pick = c.list.filter(t => !have.has(t.tokenId)).sort(() => Math.random() - .5).slice(0, c.pool === 'wild' ? 6 : 18); pick.forEach(item => queue.push({ c, item })); }
  queue.sort(() => Math.random() - .5);
  let i = 0; const worker = async () => { while (i < queue.length) { const { c, item } = queue[i++]; try { const img = await loadImage(twinUrl(item.xtrataId)); const tile = twinTile(img, c, item, c.pool === 'wild'); const twin = { key: c.key, name: c.itemNoun, tokenId: item.tokenId, xtrataId: item.xtrataId, tile, img }; pools[c.pool].push(twin); c.loaded++; sources.images++; placeWall(twin); liveLabel(); } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 6 }, worker));
  sources.done = true; liveLabel();
}

/* ---------- Faces: which twin a reel cell shows. Chosen after the result, cosmetic only. ---------- */
const TWIN = s => s === 'bitcoin' || s === 'artifact' || s === 'wild';
const pickFace = s => TWIN(s) && pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const tileFor = (s, f) => TWIN(s) ? (f >= 0 && pools[s][f] ? pools[s][f].tile : placeholders[s]) : symbolImages[s];
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 ? faces[c][r] : pickFace(s))); }

/* ---------- Renderer and scene ---------- */
let renderer, glInfo = '';
renderer=new CasinoCanvasEngineRenderer();
const softwareGL = !!renderer.software || (() => { try { const gl = renderer.getContext && renderer.getContext(), ext = gl && gl.getExtension('WEBGL_debug_renderer_info'); glInfo = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''; return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(glInfo); } catch (e) { return false; } })();
renderer.setClearColor(0x05080c); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; $('scene').appendChild(renderer.domElement);
let tier = 'high', needsRender = true;
const invalidate = () => { needsRender = true; };
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x05080c, .045);
const camera = new THREE.PerspectiveCamera(38, 1, .1, 80);
const machine = new THREE.Group(); scene.add(machine);
const env = canvas(1024, 512), eg = env.getContext('2d'); eg.fillStyle = lin(eg, 0, 0, 0, 512, ['#b9e9ff', '#18303f', '#070c12', '#10283a']); eg.fillRect(0, 0, 1024, 512); eg.fillStyle = '#7ff3ff'; eg.fillRect(150, 90, 70, 290); eg.fillRect(700, 90, 70, 290); eg.fillStyle = '#ffffff'; eg.fillRect(400, 10, 220, 60);
const envTex = new THREE.CanvasTexture(env); envTex.mapping = THREE.EquirectangularReflectionMapping; envTex.colorSpace = THREE.SRGBColorSpace; scene.environment = envTex;
const mat = (color, metal = 0, rough = .4) => new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
const lacquer = mat('#0a0e13', .7, .18), glass = mat('#0d1620', .85, .08), steel = mat('#9fb3c2', .92, .18), dark = mat('#05080c', .4, .35), rubber = mat('#030507', .05, .75);
const geoCache = new Map(), glowCache = new Map();
const cached = (key, make) => { let g = geoCache.get(key); if (!g) { g = make(); geoCache.set(key, g); } return g; };
function glow(color, opacity = 1) { const k = color + opacity; let m = glowCache.get(k); if (!m) { m = new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: opacity < 1, opacity }); glowCache.set(k, m); } return m; }
function box(w, h, d, x, y, z, m, parent = machine, r = .03) { const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const shape = new THREE.Shape(); const a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); shape.moveTo(a + R, b); shape.lineTo(a + w - R, b); shape.quadraticCurveTo(a + w, b, a + w, b + R); shape.lineTo(a + w, b + h - R); shape.quadraticCurveTo(a + w, b + h, a + w - R, b + h); shape.lineTo(a + R, b + h); shape.quadraticCurveTo(a, b + h, a, b + h - R); shape.lineTo(a, b + R); shape.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(shape, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 6 }); g.translate(0, 0, -d / 2 + R); return g; }); const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; }
function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 40) { const mesh = new THREE.Mesh(cached(`c${r1}|${r2}|${h}|${seg}`, () => new THREE.CylinderGeometry(r1, r2, h, seg)), m); mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh; }
function plane(c, w, h, x, y, z, parent = machine, transparent = false) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); const m = new THREE.MeshBasicMaterial({ map: t, toneMapped: false, transparent, alphaTest: transparent ? .02 : 0, side: THREE.DoubleSide }); const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
function label(s, w, h, size = 48, color = '#001521', bg = '#39d8ff') { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); text(g, s, w / 2, h / 2, size, color); return c; }

/* ---------- Cabinet: "the twin" — two mirrored light towers joined by the screen ---------- */
box(3.3, .2, 1.45, 0, .1, 0, glass); box(3.24, .03, 1.4, 0, .215, 0, glow('#39d8ff'));
const barsOn = glow('#7ff3ff'), barsOff = glow('#1a6f8c'), bars = [];
for (const side of [-1, 1]) {
  const x = side * 1.31;
  box(.5, 3.95, 1.12, x, 2.2, 0, lacquer); box(.44, 3.85, .02, x, 2.2, .57, glass, machine, 0);
  // Horizontal light bars in the logo's stripe style, narrowing towards the outer edge like the ∞ loops.
  for (let j = 0; j < 23; j++) { const y = .55 + j * .155, w = .34 - Math.abs(Math.sin(j * .5)) * .1; const b = box(w, .045, .02, x + side * (.34 - w) / 2 * -1, y, .585, barsOff, machine, 0); bars.push(b); }
  box(.52, .05, 1.14, x, 4.17, 0, steel); box(.52, .05, 1.14, x, .24, 0, steel);
}
box(2.14, 1.55, 1.02, 0, .99, 0, lacquer); box(2.14, 2.2, .95, 0, 2.95, -.04, lacquer); box(2.18, .08, 1.08, 0, 1.79, .02, steel);
// Lower door: the Xtrata mark, the promise and the partnership line.
const lower = canvas(860, 520), lg = lower.getContext('2d'); lg.fillStyle = lin(lg, 0, 0, 0, 520, ['#0b1620', '#04070a']); lg.fillRect(0, 0, 860, 520);
lg.strokeStyle = '#39d8ff22'; lg.lineWidth = 2; for (let y = 20; y < 520; y += 18) { lg.beginPath(); lg.moveTo(0, y); lg.lineTo(860, y); lg.stroke(); }
round(lg, 18, 18, 824, 484, 14, null, '#39d8ff88', 3); xtrataLogo(lg, 430, 150, 170);
spaced(lg, 'POWERED BY THE XTRATA PROTOCOL', 430, 290, 24, 5, '#cfefff'); spaced(lg, 'BUILT WITH FAK.FUN', 430, 334, 20, 6, '#7fdfff');
lg.save(); lg.shadowColor = '#39d8ff'; lg.shadowBlur = 16; spaced(lg, 'DON’T BE PART OF THE 20%', 430, 420, 30, 4, '#7ff3ff', '800'); lg.restore();
plane(lower, 1.72, 1.04, 0, 1.02, .515);
box(.46, .11, .07, -.45, .38, .52, steel); box(.36, .045, .02, -.45, .38, .56, rubber);
box(.5, .11, .07, .45, .38, .52, steel); box(.4, .026, .02, .45, .38, .56, rubber);
for (let j = 0; j < 12; j++) box(1.7, .028, .025, 0, 2.2 + j * .1, -.52, rubber);
const rear1 = plane(label('F O R E V E R   T W I N S', 900, 120, 46, '#7ff3ff', '#05080c'), 1.65, .22, 0, 3.6, -.525); rear1.rotation.y = Math.PI;
const rear2 = plane(label('XTRATA ARCADE  /  FT-003  /  ONLY FOREVERED ART', 900, 90, 24, '#7f95a5', '#05080c'), 1.65, .17, 0, 2.0, -.525); rear2.rotation.y = Math.PI;
// Screen.
box(2.12, 1.52, .08, 0, 2.88, .39, steel); box(2.06, 1.46, .06, 0, 2.88, .42, rubber);
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0); const screenMesh = plane(screen, 1.98, 1.36, 0, 2.88, .456), screenTexture = screenMesh.material.map; screenMesh.material.side = THREE.FrontSide;
const screenGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.36), new THREE.MeshPhysicalMaterial({ color: '#cfefff', transparent: true, opacity: .05, metalness: .2, roughness: .05, depthWrite: false })); screenGlass.position.set(0, 2.88, .459); screenGlass.raycast = () => {}; machine.add(screenGlass);
// Header across both towers: FOREVER on the left, TWINS on the right.
box(3.14, .52, 1.24, 0, 3.98, -.02, lacquer); box(3.16, .04, 1.26, 0, 4.26, -.02, glow('#39d8ff'));
const header = canvas(1600, 260), hg = header.getContext('2d'); hg.fillStyle = '#04070a'; hg.fillRect(0, 0, 1600, 260);
hg.save(); hg.shadowColor = '#39d8ff'; hg.shadowBlur = 22; spaced(hg, 'FOREVER', 370, 130, 78, 20, '#9ff3ff', '600'); spaced(hg, 'TWINS', 1230, 130, 78, 34, '#9ff3ff', '600'); hg.restore();
drawInfinity(hg, 800, 130, 230, '#39d8ff');
plane(header, 3.0, .49, 0, 3.98, .606);
// The striped ∞ on top, turning on its own clock.
const crest = new THREE.Group(); crest.position.set(0, 4.92, -.02); machine.add(crest);
const crestArt = canvas(1024, 640), cg2 = crestArt.getContext('2d'); drawInfinity(cg2, 512, 320, 880, '#39d8ff');
plane(crestArt, 1.7, 1.06, 0, 0, 0, crest, true);
cyl(.03, .05, .3, 0, 4.4, -.02, steel);
// Deck and buttons.
const deck = new THREE.Group(); deck.position.set(0, 1.72, .6); deck.rotation.x = -.72; machine.add(deck); box(2.1, .5, .16, 0, 0, 0, glass, deck); box(2.04, .44, .02, 0, 0, .09, dark, deck);
function button3D(title, x, w, color, ink, action) { const base = box(w, .22, .07, x, -.02, .13, steel, deck, .025); const top = box(w - .025, .2, .065, x, -.02, .18, mat(color, .3, .25), deck, .025); const face = plane(label(title, 400, 160, title === 'SPIN' ? 64 : 40, ink, color), w - .05, .17, x, -.02, .216, deck); face.material.side = THREE.FrontSide; [base, top, face].forEach((m, i) => { m.userData.action = action; m.userData.softwareLayer = 1 + i * .2; }); return top; }
button3D('PAYS', -.74, .34, '#cfe2ee', '#05080c', () => openRules()); button3D('BET −', -.36, .32, '#cfe2ee', '#05080c', () => changeBet(-1)); button3D('BET +', -.01, .32, '#cfe2ee', '#05080c', () => changeBet(1)); button3D('AUTO', .35, .32, '#9fefff', '#05080c', () => autoClick()); const spinPhysical = button3D('SPIN', .8, .5, '#39d8ff', '#001521', () => spinClick());
// Souvenir ticket.


/* ---------- Room: the Hall of Twins, a wall of live forevered art ---------- */
scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x0a1218, 1.7)); const key = new THREE.SpotLight(0xe6f6ff, 90, 20, .55, .6, 1.4); key.position.set(3.2, 8, 5); key.target.position.set(0, 2, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0003; scene.add(key, key.target);
const rimL = new THREE.PointLight(0x39d8ff, 30, 12, 2); rimL.position.set(-3.2, 4, -1); scene.add(rimL); const rimR = new THREE.PointLight(0x39d8ff, 30, 12, 2); rimR.position.set(3.2, 4, -1); scene.add(rimR);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), mat('#04070a', .5, .25)); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const gridC = canvas(512, 512), gc = gridC.getContext('2d'); gc.fillStyle = '#04070a'; gc.fillRect(0, 0, 512, 512); gc.strokeStyle = '#39d8ff'; gc.globalAlpha = .35; gc.lineWidth = 2; for (let x = 0; x <= 512; x += 64) { gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, 512); gc.moveTo(0, x); gc.lineTo(512, x); gc.stroke(); }
const gridTex = new THREE.CanvasTexture(gridC); gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping; gridTex.repeat.set(7, 7); gridTex.colorSpace = THREE.SRGBColorSpace;
const tiles = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({ map: gridTex, roughness: .22, metalness: .3 })); tiles.rotation.x = -Math.PI / 2; tiles.position.y = .006; tiles.receiveShadow = true; scene.add(tiles);
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, .01, 8, 120), glow('#39d8ff')); ring.rotation.x = Math.PI / 2; ring.position.y = .014; scene.add(ring);
const decor = new THREE.Group(); scene.add(decor);
box(22, 10, .2, 0, 5, -5, mat('#070b10', .3, .6), decor, 0);
const hallSign = canvas(1800, 200), hs = hallSign.getContext('2d'); hs.fillStyle = '#070b10'; hs.fillRect(0, 0, 1800, 200); hs.save(); hs.shadowColor = '#39d8ff'; hs.shadowBlur = 18; spaced(hs, 'THE HALL OF TWINS', 900, 80, 64, 22, '#9ff3ff'); hs.restore(); spaced(hs, 'EVERY PIECE HERE IS PERMANENT ON-CHAIN ART · LOADED LIVE FROM XTRATA', 900, 160, 24, 6, '#5f8fa6');
for (const sx of [-1, 1]) plane(hallSign, 4.4, .49, sx * 4.72, 5.3, -4.85, decor);
// 2 rows of framed twins either side of the machine; frames fill in as twins load and rotate slowly after.
const wall = [];
for (const side of [-1, 1]) for (let row = 0; row < 2; row++) for (let k = 0; k < 4; k++) {
  const x = side * (3.0 + k * 1.15), y = 3.1 + row * 1.25, c = canvas(256, 256), g = c.getContext('2d');
  g.fillStyle = '#05080c'; g.fillRect(0, 0, 256, 256); drawInfinity(g, 128, 128, 150, '#1a6f8c');
  box(1.0, 1.0, .05, x, y, -4.86, steel, decor, .01); const p = plane(c, .9, .9, x, y, -4.83, decor); p.material.side = THREE.FrontSide;
  box(.9, .02, .02, x, y - .58, -4.84, glow('#39d8ff'), decor, 0);
  wall.push({ c, g, tex: p.material.map, item: null });
}
function paintFrame(fr, item) { fr.item = item; const g = fr.g; g.fillStyle = '#05080c'; g.fillRect(0, 0, 256, 256); const img = item.img, fit = Math.min(236 / img.width, 236 / img.height), k = img.width <= 200 && fit >= 1 ? Math.floor(fit) : fit, w = img.width * k, h = img.height * k; g.imageSmoothingEnabled = img.width > 200; g.drawImage(img, (256 - w) / 2, (256 - h) / 2, w, h); fr.tex.needsUpdate = true; invalidate(); }
function allTwins() { return [...pools.bitcoin, ...pools.artifact, ...pools.wild]; }
function placeWall(item) { const empty = wall.find(f => !f.item); if (empty) paintFrame(empty, item); }
let lastWallSwap = 0;
function rotateWall(now) { const all = allTwins(); if (all.length <= wall.length || now - lastWallSwap < 7000) return; lastWallSwap = now; const shown = new Set(wall.map(f => f.item)); const fresh = all.filter(t => !shown.has(t)); if (fresh.length) paintFrame(wall[Math.floor(Math.random() * wall.length)], fresh[Math.floor(Math.random() * fresh.length)]); }

/* ---------- Camera, views and input ---------- */
const orbit = { yaw: .22, pitch: .075, distance: 10, target: new THREE.Vector3(0, 2.8, 0) }, goal = { yaw: .22, pitch: .075, distance: 10, target: new THREE.Vector3(0, 2.8, 0) };
const stageEl = $('scene');
function baseDistance() { const a = stageEl.clientWidth / stageEl.clientHeight; return a < .8 ? 14 : a < 1.1 ? 12.2 : a < 1.5 ? 10.9 : 10; }
function playDistance() { return Math.max(4.6, 4.0 / Math.min(1.05, camera.aspect / 1.05)); }
function setView(v) { view = v; if (decor.visible !== (v !== 'orbit')) { decor.visible = v !== 'orbit'; renderer.shadowMap.needsUpdate = true; } document.body.classList.toggle('close-view', v !== 'cabinet'); document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === v)); goal.yaw = v === 'play' ? 0 : v === 'orbit' ? .52 : .22; goal.pitch = v === 'play' ? .03 : .075; goal.distance = v === 'play' ? playDistance() : baseDistance(); goal.target.set(0, v === 'play' ? 3.0 : 2.8, 0); invalidate(); }
let lastW = 0, lastH = 0, resizeQueued = false;
function resize() { const w = stageEl.clientWidth, h = stageEl.clientHeight; if (!w || !h) return; if (w !== lastW || h !== lastH) { lastW = w; lastH = h; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); } if (view === 'cabinet' || view === 'orbit') goal.distance = baseDistance(); else if (view === 'play') goal.distance = playDistance(); invalidate(); }
addEventListener('resize', () => { if (resizeQueued) return; resizeQueued = true; requestAnimationFrame(() => { resizeQueued = false; resize(); }); }); resize(); orbit.distance = goal.distance;
let pointer = null, dragging = false, previousPinch = 0; const activePointers = new Map(), ray = new THREE.Raycaster();
renderer.domElement.addEventListener('pointerdown', e => { audioInit(); activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (activePointers.size === 2) { const ps = [...activePointers.values()]; previousPinch = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y); dragging = true; } pointer = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY }; renderer.domElement.setPointerCapture(e.pointerId); });
renderer.domElement.addEventListener('pointermove', e => { if (!activePointers.has(e.pointerId)) return; activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (activePointers.size === 2) { const ps = [...activePointers.values()], d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y); goal.distance = Math.max(3.5, Math.min(18, goal.distance + (previousPinch - d) * .02)); previousPinch = d; return; } if (!pointer) return; const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y; if (Math.hypot(e.clientX - pointer.startX, e.clientY - pointer.startY) > 6) dragging = true; if (dragging) { goal.yaw -= dx * .006; goal.pitch = Math.max(-.18, Math.min(.65, goal.pitch + dy * .004)); if (view !== 'manual') { view = 'manual'; if (decor.visible) { decor.visible = false; renderer.shadowMap.needsUpdate = true; } document.body.classList.add('close-view'); document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active')); } } pointer.x = e.clientX; pointer.y = e.clientY; });
renderer.domElement.addEventListener('pointerup', e => { activePointers.delete(e.pointerId); if (!dragging && pointer && !$('modal').open) { const r = renderer.domElement.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera); const hit = ray.intersectObjects(machine.children, true).find(h => h.object.visible); if (hit) { if (hit.object === screenMesh && hit.uv) screenTap(hit.uv.x * 1400, (1 - hit.uv.y) * 960); else if (hit.object.userData.action) hit.object.userData.action(); } } if (!activePointers.size) { pointer = null; dragging = false; } });
renderer.domElement.addEventListener('pointercancel', () => { activePointers.clear(); pointer = null; dragging = false; });
renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); goal.distance = Math.max(3.5, Math.min(18, goal.distance + e.deltaY * .006)); }, { passive: false });
function resolveTier() { return state.quality === 'high' ? 'high' : state.quality === 'low' ? 'low' : (softwareGL ? 'low' : 'high'); }
function applyTier(t) { tier = t; const low = t === 'low'; renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio || 1, 1.75)); renderer.shadowMap.enabled = !low; key.castShadow = !low; scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.needsUpdate = true; }); }); renderer.shadowMap.needsUpdate = true; lastW = 0; resize(); invalidate(); }
renderer.domElement.addEventListener('webglcontextrestored', () => { screenTexture.needsUpdate = true; renderer.shadowMap.needsUpdate = true; invalidate(); });

/* ---------- The cabinet screen ---------- */
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#0b1a26', '#05080c', '#081723']); g.fillRect(0, 0, 1400, 960);
  g.strokeStyle = '#39d8ff10'; g.lineWidth = 2; for (let y = 8; y < 960; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); }
  text(g, '20 LINES', 125, 82, 30, '#e6fbff'); text(g, 'FOREVER TWINS', 125, 122, 16, '#7f95a5');
  text(g, 'FOREVER JACKPOT', 700, 40, 24, '#7ff3ff');
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 18, '#03060a', '#39d8ff', 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#07111a', '#0c1c28', '#07111a']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff16'; g.fillRect(45, 880, 1310, 1);
  text(g, '3 INSCRIBE = FREE SPINS   ·   3 BIND = TWIN BIND   ·   5 HASH = FINALIZE', 700, 852, 20, '#7f95a5'); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function highlightIndex(now) { return !spinning && !feature() && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = '#39d8ff'; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#7ff3ff', 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, '#7ff3ff', 4); sg.save(); sg.shadowColor = '#39d8ff'; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#7ff3ffc0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#39d8ff55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// Finalize: each locked cell is a sealed content hash with its value.
const hashFor = (f, i) => { const id = String(f.roundId || 'f0rever'); let h = 2166136261; for (const ch of id + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0).toString(16).padStart(8, '0'); };
function drawFinalize(f, now) {
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16;
    if (v) { sg.save(); sg.shadowColor = '#39d8ff'; sg.shadowBlur = fresh.includes(i) ? 30 : 12; round(sg, x, y, w, h, 14, fresh.includes(i) ? '#0f4c66' : '#082636', '#7ff3ff', fresh.includes(i) ? 5 : 3); sg.restore(); text(sg, `0x${hashFor(f, i)}`, x + w / 2, y + 34, 22, '#9fefff', 'Courier New', 'center', '700'); text(sg, `${v}×`, x + w / 2, y + 86, 46, '#ffffff', 'Arial'); text(sg, fmt(v * f.bet), x + w / 2, y + 134, 20, '#7ff3ff'); }
    else { round(sg, x, y, w, h, 14, '#04090e', '#1a3a4a', 2); text(sg, 'UNSEALED', x + w / 2, y + h / 2, 15, '#2a5468'); } });
}
let capsuleFaces = [];
function drawBind(f) {
  const done = f.picks.length === 3;
  if (capsuleFaces.length !== 9) capsuleFaces = Array.from({ length: 9 }, (_, i) => { const p = i % 2 ? 'artifact' : 'bitcoin'; return { s: p, f: pickFace(p) }; });
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i);
    if (picked) { round(sg, x, y, w, h, 14, '#082636', '#7ff3ff', 4); sg.drawImage(tileFor(capsuleFaces[i].s, capsuleFaces[i].f), x + 8, y + 8, h - 16, h - 16); text(sg, `${f.awards[i]}×`, x + h + (w - h) / 2, y + h / 2 - 18, 52, '#ffffff', 'Arial'); text(sg, `${fmt(f.awards[i] * f.bet)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, '#7ff3ff'); }
    else if (done) { round(sg, x, y, w, h, 14, '#04090e', '#1a3a4a', 2); text(sg, `${f.awards[i]}×`, x + w / 2, y + h / 2, 34, '#2f5f74'); }
    else { round(sg, x, y, w, h, 14, lin(sg, x, y, x, y + h, ['#0d2a3a', '#050c12']), '#39d8ff', 3); drawInfinity(sg, x + 90, y + h / 2, 120, '#39d8ff', false); text(sg, `ESCROW ${i + 1}`, x + w / 2 + 70, y + h / 2 - 14, 24, '#cfefff'); text(sg, 'SEALED TWIN', x + w / 2 + 70, y + h / 2 + 20, 16, '#5f8fa6'); } }
}
function drawScreen(now) {
  sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  text(sg, fmt(E.meter(state, shownBet)), 700, 106, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 160, 17, '#7f95a5');
  const n = pools.bitcoin.length + pools.artifact.length + pools.wild.length;
  if (state.free || state.freeActive) { text(sg, `${state.free} INSCRIBE`, 1275, 82, 30, '#7fffd4'); text(sg, 'ALL WINS 2×', 1275, 122, 17, '#7fffd4'); }
  else { text(sg, n ? `${n} TWINS` : 'LAYR PLAY', 1275, 82, 30, '#e6fbff'); text(sg, n ? (sources.images ? 'LIVE FROM XTRATA' : 'ON-CHAIN ART') : 'LAYR', 1275, 122, 17, '#7f95a5'); }
  let msg, msgColor = '#7ff3ff';
  if (f && !spinning && f.type === 'chain') { drawFinalize(f, now); const fr = f.frames[f.index], k = fr.cells.filter(Boolean).length; msg = E.featureDone(f) ? `FINALIZED  ·  ${k}/15 HASHES  ·  ${fmt(f.sum * f.bet)}${f.full ? '  ·  ALL 15: FOREVER JACKPOT!' : ''}` : `FINALIZE  ·  ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT  ·  ${k}/15 SEALED`; }
  else if (f && !spinning && f.type === 'vault') { drawBind(f); const total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; msg = f.picks.length === 3 ? `TWIN BIND  ·  ${fmt(total)} LAYR` : `TWIN BIND  ·  OPEN ${3 - f.picks.length} MORE  ·  ${fmt(total)}`; }
  else { const w = drawReels(now); const wt = w && TWIN(w.symbol) ? (() => { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = state.grid[c][line[c]], fc = faces[c][line[c]]; if (s === w.symbol && fc >= 0 && pools[s][fc]) return pools[s][fc]; } return null; })() : null;
    msg = spinning ? 'SPINNING FOREVER…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${wt ? `  ·  #${wt.tokenId} · XTRATA #${wt.xtrataId}` : ''}` : state.free ? `${state.free} INSCRIBE SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'ONLY FOREVERED ART SPINS HERE.'; if (state.free && !spinning) msgColor = '#7fffd4'; }
  text(sg, msg, 700, 812, 26, msgColor);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#e6fbff', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 920, 26, '#e6fbff'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, '#7ff3ff', 'Arial', 'right');
  screenTexture.needsUpdate = true; screenDirty = false; invalidate();
}
function screenTap(x, y) { const f = feature(); if (!f || spinning) return; if (f.type === 'vault') { for (let i = 0; i < 9; i++) { const [rx, ry, w, h] = capsuleRect(i); if (x >= rx && x <= rx + w && y >= ry && y <= ry + h) return pickBind(i); } } else featureAction(); }
function particles(n = 35) { if (state.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin inf'; p.textContent = '∞'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }

/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning||(typeof seqRemix!=='undefined'&&!!seqRemix)||(typeof seamSpin!=='undefined'&&!!seamSpin);}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (feature()) { featureAction(); return; } if (!state.free && state.balance < state.bet) { openAccount(); return; } spin(); }
// Each reel's stop sound is booked on the audio clock for the moment it lands, so it stays in sync at any frame rate.
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }

let nextFaces = null;
function spin() {
  if (spinning || $('modal').open || locked()) return;
  if (feature()) { featureAction(); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  try { p = E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); renderer.shadowMap.needsUpdate = true; capsuleFaces = [];
  status(p.free ? 'INSCRIBE SPIN · ALL WINS 2×' : 'SPINNING FOREVER…');
  // The result is already fixed; now pick which forevered twins will show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null; save(); update();
  const r = lastResult, bet = r.round.bet;
  if (r.total) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  if (r.jackpotWin) { particles(110); toast(`FOREVER JACKPOT! ${fmt(r.jackpotWin)} LAYR.`); }
  let msg = r.total ? `${r.jackpotWin ? 'FOREVER JACKPOT · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · INSCRIBE' : ''}` : (r.round.free ? 'INSCRIBE SPIN COMPLETE' : 'NO WIN THIS TIME · SPIN AGAIN');
  if (state.gamble) msg += ' · SWAP OR KEEP?';
  status(msg);
  if (feature()) { stopAuto(); setTimeout(beginFeature, 550); return; }
  if (r.triggers.free) { stopAuto(); if (r.freeAward) setTimeout(() => showFreeBar(r.round.free), 450); else toast('Inscribe cap reached: 24 spins awarded this feature.'); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(showFreeSummary, 600); return; }
  scheduleAuto();
}
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature()) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Autoplay stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTOPLAY STOPPED'); return; } if (spinning || feature() || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Let the twins spin.', `<p>Autoplay spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- Bonus features ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
function beginFeature(quiet = false) { const f = feature(); if (!f) return; if (!quiet) { sound('bonus'); toast(f.type === 'chain' ? 'Finalize! Seal hashes and respin.' : 'Twin Bind! Open three escrow capsules.'); } if (view === 'cabinet' && innerWidth < 1000) setView('play'); renderBar(); update(); }
function renderBar() {
  const f = feature(); if (!f) { hideBar(); return; }
  const pre = '';
  if (f.type === 'chain') { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f);
    setBar(`${pre}FEATURE 03`, 'Finalize', done ? `${n}/15 hashes · ${fmt(f.sum * f.bet)} LAYR${f.full ? ' + Forever Jackpot' : ''}` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 sealed · ${fmt(f.sum * f.bet)} so far`, `<button class="bar-cta" id="fbGo">${done ? 'Collect ↗' : 'Respin ∞'}</button>`);
    $('fbGo').onclick = featureAction; status(done ? 'FINALIZED · COLLECT YOUR LAYR' : 'FINALIZE · PRESS RESPIN'); }
  else { const total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet, done = f.picks.length === 3;
    setBar(`${pre}FEATURE 02`, 'Twin Bind', done ? `${fmt(total)} LAYR released` : `Open ${3 - f.picks.length} of 9 · tap the screen or a number`, Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Escrow capsule ${i + 1}${f.picks.includes(i) ? `, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" id="fbGo">Collect ↗</button>' : ''));
    document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => pickBind(Number(b.dataset.pick))); if ($('fbGo')) $('fbGo').onclick = featureAction; status(done ? 'TWINS BOUND · COLLECT YOUR LAYR' : 'TWIN BIND · OPEN THREE CAPSULES'); }
  screenDirty = true;
}
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (E.featureDone(f)) { collectFeature(); return; } if (f.type === 'chain') { const fr = E.respin(state); save(); chainFlash = performance.now(); if (fr.added.length) fr.added.forEach((_, k) => sound('lock', k)); else sound('respin'); renderBar(); update(); } else toast('Open three capsules first.'); }
function pickBind(i) { if (locked()) return; const r = E.pick(state, i); if (!r) return; save(); sound('pick', i); renderBar(); update(); }
function collectFeature() {
  const f = feature(); const c = E.collect(state); if (!c) return; save();
  sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 35); winUntil = performance.now() + 4000;
  if (c.jackpotWin) toast(`ALL 15 SEALED! Forever Jackpot pays ${fmt(c.jackpotWin)} LAYR.`);
  status(`${c.type === 'chain' ? 'FINALIZE' : 'TWIN BIND'} · ${fmt(c.amount)} LAYR COLLECTED`);
  hideBar(); lastResult = null; capsuleFaces = []; update();
  if (feature()) { setTimeout(beginFeature, 500); return; }
  if (state.free > 0 && state.freeCount === 0 && !spinning) { setTimeout(() => showFreeBar(false), 400); return; }
  if (state.freeActive && !state.free) setTimeout(showFreeSummary, 600);
}
function showFreeBar(retrigger) { if (!state.free) return; sound('bonus'); setBar(`FEATURE 01`, retrigger ? 'More inscribed' : 'Inscribe', `${state.free} free spins · all wins 2× · ${fmt(state.freeBet)} bet locked`, `<button class="bar-cta" id="fbGo">${retrigger ? 'Keep inscribing ∞' : 'Start inscribing ∞'}</button>`); $('fbGo').onclick = () => { hideBar(); spin(); }; status(`${state.free} INSCRIBE SPINS · ALL WINS 2×`); update(); }
function showFreeSummary() { if ($('modal').open || feature()) return; const r = E.endFree(state); if (!r) return; save(); update(); showModal('feature', 'Inscribed forever.', `<p>Your ${r.count} inscribe spins paid out</p><div class="bonus-total">${fmt(r.total)} <small style="font-size:14px">LAYR</small></div><p>Including any Twin Bind or Finalize awards won during the feature. All prizes are in your shared LAYR balance.</p><button class="cta" id="featureDone">Back to the machine</button>`, 'FEATURE 01 / INSCRIBE'); $('featureDone').onclick = closeModal; status('INSCRIBE COMPLETE'); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'XTRATA ARCADE') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => TWIN(s) ? (pools[s][0] ? pools[s][0].tile : placeholders[s]).toDataURL() : (iconURL[s] || (iconURL[s] = symbolImages[s].toDataURL()));
function openTwins() {
  const rows = [...collections.values()].map(c => `<tr><td><span class="swatch" style="background:${esc(c.accent || '#39d8ff')}"></span>${esc(c.name)}</td><td>${c.pool === 'wild' ? 'Wild card' : `Pays as ${esc(NAMES[c.pool])}`}</td><td>${fmt(c.inscribed || 0)}</td><td>${fmt(c.loaded + (c.bundled || 0))}</td><td><a href="https://xtrata.xyz/forever-twins/collection/${encodeURIComponent(c.key)}" target="_blank" rel="noopener" style="color:#7ff3ff">Forever yours ↗</a></td></tr>`).join('');
  showModal('twins', 'The twins on the reels.', `<p>Every piece of art on these reels is a <b>forevered NFT</b>: a permanent twin inscribed fully on-chain through Xtrata and bound 1:1 to its original. The machine reads the Forever Twins helpers when it starts and loads a fresh random selection each visit. As more twins are inscribed, they join the reels automatically.</p>
  ${collections.size ? `<table class="paytable twins-table"><thead><tr><th>COLLECTION</th><th>ON THE REELS</th><th>TWINNED</th><th>LOADED</th><th></th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="fine">Xtrata could not be reached, so the reels are showing built-in art for now. The game plays exactly the same.</p>'}
  <p><b>Not forevered yet?</b> A token only appears on this machine once its permanent twin exists. Make yours permanent and it can turn up on the reels.</p><a class="cta" href="https://xtrata.xyz/forever-twins/" target="_blank" rel="noopener">Forever your NFT ↗</a>
  <p class="fine">Art is chosen after each result is fixed, so which twins load never changes your odds. Source: ${esc(SRC.origin)} (registry ${esc(sources.registry)}, ${fmt(sources.images)} images loaded live, ${fmt(sources.bundled)} bundled in the machine${sources.imageFailures ? `, ${sources.imageFailures} skipped` : ''}). Artwork belongs to each collection.</p>`, 'FOREVER TWINS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'How the twins pay.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. Every Bitcoin Pepe and Bitcoin Bird on the reels is a real forevered twin, shown with its token number. Any twin from another Forever Twins collection is a <b>Forever Wild</b>: it replaces every paying symbol and has its own pays, but never replaces Inscribe, Bind or Hash.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five Bitcoin Pepes on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>INSCRIBE</h3><p>3, 4 or 5 Inscribe symbols anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. Every win in the feature pays <b>2×</b>. More Inscribe symbols add 4 spins, up to 24 awarded per feature. Your bet is locked for the feature. Twin Bind and Finalize can trigger during it and pay at 1×.</p>
  <h3>TWIN BIND</h3><p>3 or more Bind symbols anywhere put nine escrow capsules on the screen. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three.</p>
  <h3>FINALIZE</h3><p>5 or more Hash symbols start a hold-and-respin. Each locks as a sealed hash worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each unsealed cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to seal per respin, and any new seal resets the count to 3. Seal all 15 to win the Forever Jackpot as well.</p>
  <h3>FOREVER JACKPOT</h3><p>Five Bitcoin Pepes on the centre row (wilds don't count), or all 15 hashes sealed, win the Forever Jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>SWAP OR KEEP</h3><p>Forever Twins pairs can be swapped but never split. After a paid base-game win with no bonus, you may stake that win on one 50/50 call: does the record land on the <b>Original</b> or the <b>Twin</b>? The side is the last character of a fresh content hash (odd is Twin, even is Original). Right doubles the win; wrong loses that win only.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="#39d8ff" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Forever Twins runs on the same engine as Block Fortune and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which forevered twins to show, so the art loaded from Xtrata can never change a result.</p><p>Long-run return to player is <b>94.38%</b>, worked out exactly from the strips and confirmed by 5-million-spin simulations. Inscribe and Twin Bind each arrive about 1 in 140 spins, Finalize about 1 in 290, the Forever Jackpot about 1 in 113,000. Swap or Keep is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">Uses the existing casino LAYR balance on this browser origin. On-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesTwins">The twins on the reels ↗</button>`, 'HOW TO PLAY');
  $('rulesTwins').onclick = openTwins;
}


const info = { free: ['Inscribe', 'Three Inscribe symbols anywhere pay a scatter prize and award 8 free spins. Every win is doubled, and more Inscribe symbols add 4 spins, up to 24 per feature.'], vault: ['Twin Bind', 'Three Bind symbols put nine escrow capsules on the screen. Open three to release a forevered twin and a prize from 1× to 15× your total bet each.'], chain: ['Finalize', 'Five Hash symbols start a hold-and-respin. Sealed hashes lock with values, any new seal resets your three respins, and sealing all 15 wins the Forever Jackpot.'], genesis: ['Forever Jackpot', 'A progressive meter for each bet level. Land five Bitcoin Pepes on the centre row, or seal all 15 hashes in Finalize, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const KIND = { 'Free spin': 'Inscribe spin' }, FEAT = s => String(s || '').replace('GENESIS BLOCK', 'FOREVER JACKPOT').replace('CHAIN', 'FINALIZE').replace('VAULT', 'TWIN BIND').replace('FREE SPINS', 'INSCRIBE');
function openHistory(){
 const body=`<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut ?? state.won)}</strong></div></div><p>Latest 50 rounds. All amounts use the shared LAYR account.</p><table class="paytable"><thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th></tr></thead><tbody>${state.history.map(h=>`<tr><td>${new Date(h.time).toLocaleTimeString()} · ${h.kind || (h.free?'Free spin':'Spin')}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td></tr>`).join('')}</tbody></table><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 if(GAME_ID==='neon-vault')showModal('history',`<h2>Your LAYR session.</h2>${body}`);else showModal('history','Your LAYR session.',body,'LAYR HISTORY');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,currency:'LAYR',wagered:state.wagered,paidOut:state.paidOut ?? state.won,history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openGamble() { if(locked())return;if(state.gamble>state.balance){toast('Insufficient LAYR in the shared account.');return;} if (!state.gamble || busy() || locked()) return; showModal('gamble', 'Swap or keep.', `<p>Your <b>${fmt(state.gamble)}</b>-credit win rides on one call. Will the pair land on the Original or the Twin? Right doubles this win; wrong loses it. Your other LAYR are untouched.</p><div class="ab"><button class="cta" data-call="even">ORIGINAL</button><button class="cta" data-call="odd">TWIN</button></div><button class="outline" id="keepWin">Keep my win</button>`, 'SWAP OR KEEP'); document.querySelectorAll('[data-call]').forEach(b => b.onclick = () => { const r = E.gamble(state, b.dataset.call); if (!r) return closeModal(); save(); update(); sound('swap'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 260); if (r.win) particles(25); const side = r.parity === 'odd' ? 'Twin' : 'Original'; showModal('gambleResult', r.win ? `${side}. Doubled.` : `${side}. Not this time.`, `<div class="hash">${r.hash.slice(0, -1)}<b>${r.hash.at(-1)}</b></div><p>The content hash ends in an ${r.parity} character, so it landed on <b>${side.toLowerCase()}</b>. ${r.win ? `${fmt(r.amount)} LAYR are yours.` : 'That win is lost; your other LAYR are unchanged.'}</p><p class="fine">Fictional hash generated with the same cryptographic randomness as the reels.</p><button class="cta" id="gambleDone">Back to the machine</button>`, 'SWAP OR KEEP'); $('gambleDone').onclick = closeModal; status(r.win ? `DOUBLED · ${fmt(r.amount)} LAYR` : 'SWAP LOST'); }); $('keepWin').onclick = () => { state.gamble = 0; save(); closeModal(); toast('Win kept in your balance.'); }; }
function openAccount() {
  if (spinning || (typeof seamSpin !== 'undefined' && seamSpin) || (typeof seqRemix !== 'undefined' && seqRemix)) return;
  showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>All five machines use the same existing casino LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT');
}



function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Low ambient hum<input type="checkbox" id="setAmbient" ${state.ambient ? 'checked' : ''}></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no particles)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><label class="setting">Graphics quality<select id="setQuality"><option value="auto" ${state.quality === 'auto' ? 'selected' : ''}>Auto</option><option value="high" ${state.quality === 'high' ? 'selected' : ''}>High</option><option value="low" ${state.quality === 'low' ? 'selected' : ''}>Lite</option></select></label><p>Space spins, respins and collects. Extra presses are ignored until the round finishes. 1–9 open capsules. M mutes. F toggles fullscreen. Drag the machine to orbit; scroll or pinch to zoom.</p><p class="fine">${storageOK ? 'Your LAYR session is saved in this browser.' : 'This browser is blocking storage. Keep this tab open to keep your session.'}${sessionLock ? ' This tab is read-only because the session is open elsewhere.' : ''}</p><button class="outline" id="setTwins">The twins on the reels</button><button class="outline" id="setHistory">Session history</button>`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=e=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();ambient();update();};};
  bind('setSound', 'muted', true); bind('setAmbient', 'ambient'); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setQuality').onchange = e => { state.quality = e.target.value; save(); slowFrames = 0; applyTier(resolveTier()); toast(resolveTier() === 'low' ? 'Lite graphics: no shadows, standard resolution.' : 'High quality graphics.'); };
  $('setTwins').onclick = openTwins; $('setHistory').onclick = openHistory; 
  }
function fullscreen() { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else document.documentElement.requestFullscreen?.().catch(() => toast('Fullscreen isn’t available here.')); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo reels on.' : 'Normal reel speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('fullscreen').onclick = fullscreen; $('twinsInfo').onclick = openTwins;
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => setView(b.dataset.view)); document.querySelector('.brand').onclick = e => { e.preventDefault(); setView('cabinet'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return; if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickBind(Number(e.key) - 1); else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') fullscreen(); else if (e.key === 'Escape') { if (autoLeft) { stopAuto(); status('AUTOPLAY STOPPED'); } } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted) ac.resume().catch(() => {}); });

/* ---------- Frame loop ---------- */
let lastIdleFrame = 0, slowFrames = 0, prevRendered = false, barsLit = false, lastHl = -1, lastPoolSize = 0;
function placeCamera() { const cp = Math.cos(orbit.pitch); camera.position.set(orbit.target.x + Math.sin(orbit.yaw) * orbit.distance * cp, orbit.target.y + Math.sin(orbit.pitch) * orbit.distance, orbit.target.z + Math.cos(orbit.yaw) * orbit.distance * cp); camera.lookAt(orbit.target); }
const perf = { frames: 0, rendered: 0, drawn: 0, avgMs: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate);
  const raw = now - (animate.last || now), dt = Math.min(.06, raw / 1000); animate.last = now; perf.frames++;
  const k = 1 - Math.exp(-dt * 7), y0 = orbit.yaw, p0 = orbit.pitch, d0 = orbit.distance, x0 = orbit.target.x, t0 = orbit.target.y;
  orbit.yaw += (goal.yaw - orbit.yaw) * k; orbit.pitch += (goal.pitch - orbit.pitch) * k; orbit.distance += (goal.distance - orbit.distance) * k; orbit.target.lerp(goal.target, k); if (view === 'orbit' && !pointer) goal.yaw += dt * .15;
  placeCamera();
  if (Math.abs(orbit.yaw - y0) + Math.abs(orbit.pitch - p0) + Math.abs(orbit.distance - d0) + Math.abs(orbit.target.x - x0) + Math.abs(orbit.target.y - t0) > 1e-5) needsRender = true;
  if (spinning) { spinPhysical.position.z = .18 - (1 + Math.sin(now / 170)) * .006; needsRender = true; } else if (spinPhysical.position.z !== .18) { spinPhysical.position.z = .18; needsRender = true; }
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000) screenDirty = true;
  // As twins arrive, cells still showing built-in art pick up real art while the reels are at rest.
  const ps = pools.bitcoin.length + pools.artifact.length + pools.wild.length; if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : screenDirty) { drawScreen(now); lastDraw = now; perf.drawn++; }
  // Light bars: a slow shimmer at rest, a fast sweep while spinning or celebrating.
  const bright = spinning || now < winUntil || !!feature();
  if (bright || barsLit || Math.floor(now / 120) !== Math.floor((now - raw) / 120)) { const n = bars.length / 2; bars.forEach((b, i) => { const j = i % n; b.material = bright ? (Math.sin(now * .014 - j * .55) > 0 ? barsOn : barsOff) : (Math.sin(now * .002 - j * .3) > .6 ? barsOn : barsOff); }); needsRender = true; }
  barsLit = bright;
  if (view === 'orbit') needsRender = true;
  rotateWall(now);
  // The ∞ crest turns at one steady speed on its own clock; idle frames are capped near 30 fps.
  crest.rotation.y = (now / 1000 * .8) % (Math.PI * 2);
  if (now - lastIdleFrame >= 32) needsRender = true; if (needsRender) lastIdleFrame = now;
  if (needsRender) {
    renderer.render(scene, camera); needsRender = false; perf.rendered++;
    if (prevRendered && raw > 0 && raw < 1000) { perf.avgMs = perf.avgMs ? perf.avgMs * .9 + raw * .1 : raw; slowFrames = raw > 40 ? slowFrames + 1 : Math.max(0, slowFrames - 2); }
    prevRendered = true;
    if (slowFrames >= 45 && tier === 'high' && state.quality === 'auto') { applyTier('low'); slowFrames = 0; toast('Switched to Lite graphics for smoother play. Change this in Settings.'); }
  } else prevRendered = false;
}

/* ---------- Boot ---------- */
function resume() {
  state=LAYR.openGame(GAME_ID,E);if(GAME_ID==='deep-strata'&&!Number.isFinite(state.deepest))state.deepest=0;
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { beginFeature(true); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { showFreeBar(false); status(`${state.free} SAVED INSCRIBE SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(showFreeSummary, 800);
}
// Shared LAYR account is attached on cabinet activation.
update(); liveLabel(); drawScreen(0); applyTier(resolveTier());
loadTwins().catch(() => { sources.done = true; liveLabel(); });
let started = false;
function go() { if (started) return; started = true; try { placeCamera(); renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); needsRender = false; } catch (e) {} requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550); }); }
placeCamera();
const compiling = typeof renderer.compileAsync === 'function' ? renderer.compileAsync(scene, camera) : Promise.resolve();
Promise.race([compiling.catch(() => {}), new Promise(r => setTimeout(r, 4000))]).then(go);
// Read-only diagnostics for automated tests of the self-contained build.
window.ForeverTwins = Object.freeze({ version: '1.0.0', machine: 'forever-twins',
  camera: () => ({ view, yaw: goal.yaw, pitch: goal.pitch, distance: goal.distance }),
  sources: () => ({ ...sources, core: SRC.core, collections: [...collections.values()].map(c => ({ key: c.key, pool: c.pool, inscribed: c.inscribed, found: c.found, loaded: c.loaded })) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, tokenId: t.tokenId, xtrataId: t.xtrataId, bundled: !!t.bundled }))])),
  wall: () => wall.filter(f => f.item).map(f => `${f.item.key}#${f.item.tokenId}`),
  faces: () => faces.map(c => c.slice()), reels: () => animations.map(a => ({ landAt: a.start + a.land, endAt: a.start + a.duration })),
  soundLog: () => soundLog.map(e => ({ ...e })), clearSoundLog: () => { soundLog.length = 0; }, crest: () => crest.rotation.y,
  perf: () => ({ tier, quality: state.quality, avgFrameMs: +perf.avgMs.toFixed(1), rendered: perf.rendered, frames: perf.frames, screenDraws: perf.drawn, gl: glInfo, software: softwareGL, geometries: geoCache.size, drawCalls: renderer.info.render.calls }),
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, view, sessionLock, webgl: !renderer.software })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes } });
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML.replace(/Drag the (?:machine|jukebox|scene) to orbit; scroll or pinch to zoom\./g,'Use the casino’s Screen view and Full screen controls.').replace(/Use Play view for a straight-on close-up\./g,'').replace(/Auto graphics drops to Lite[^<]*/g,'');}
function pxControl(action){
  const clicks={sound:'sound',turbo:'turbo',max:'maxBet',gamble:'gamble'};
  if(action==='spin')spinClick();else if(action==='betDown')changeBet(-1);else if(action==='betUp')changeBet(1);else if(action==='auto')autoClick();
  else if(action==='pays'){if(typeof openRules==='function')openRules();else openPaytable();}
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();
  else if(clicks[action]){const id=action==='max'&&typeof NV!=='undefined'?'maxbet':clicks[action];document.getElementById(id)?.click();}
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:typeof armPivot!=='undefined'?armPivot.rotation.z:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;animate.last=performance.now();screenDirty=true;update();drawScreen(performance.now());},
  deactivate(){if(spinning||(typeof seqRemix!=='undefined'&&seqRemix)||(typeof seamSpin!=='undefined'&&seamSpin))return false;if(typeof stopAuto==='function')stopAuto();if(typeof seqStop==='function')seqStop();if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){if(typeof stopAuto==='function')stopAuto();},
  tap(x,y){if(typeof screenTap==='function')screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){if(typeof closeModal==='function')closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning:spinning||(typeof seqRemix!=='undefined'&&!!seqRemix)||(typeof seamSpin!=='undefined'&&!!seamSpin),button:$('spinText')?.textContent||'SPIN',spinDisabled:$('spin').disabled,betDownDisabled:($('minus')||$('betDown'))?.disabled,betUpDisabled:($('plus')||$('betUp'))?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:typeof state.muted==='boolean'?state.muted:!state.sound,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();

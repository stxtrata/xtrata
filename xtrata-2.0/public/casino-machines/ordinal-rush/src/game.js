/* Ordinal Rush — a ParallaX Casino machine. Every symbol is a real Bitcoin inscription loaded from ordinals.com (bundled as
   small tiles in OR_ART, topped up live), or a real on-chain Bitmap record. The maths is the shared Block Fortune v2 engine
   (BF) unchanged: every outcome is fixed by BF before any art is chosen, and art is picked with Math.random, never the
   engine's generator, so loaded inscriptions can never change a result. The casino owns all 3D rendering and cameras; this
   frame only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='ordinal-rush', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, ACCENT = '#f7931a';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'Bitcoin Frog', lemon: 'Pizza Ninja', chip: 'OnChainMonkey', block: 'Ordinal Maxi Biz', artifact: 'Quantum Cat', bitcoin: 'NodeMonke', wild: 'Bitcoin Puppet', scatter: 'Runestone', vault: 'Taproot Wizard', chain: 'Bitmap' };
const SHORT = { cherry: 'FROG', lemon: 'NINJA', chip: 'OCM', block: 'OMB', artifact: 'QUANTUM CAT', bitcoin: 'NODEMONKE', wild: 'WILD', scatter: 'RUNESTONE', vault: 'WIZARD', chain: 'BITMAP' };
const COLS = {
  cherry:   { key: 'bitcoin-frogs',   name: 'Bitcoin Frogs',   color: '#47a447', live: true,  pixel: true },
  lemon:    { key: 'pizza-ninjas',    name: 'Pizza Ninjas',    color: '#ff5400', live: false },
  chip:     { key: 'ocm-genesis',     name: 'OnChainMonkey',   color: '#d9a300', live: false },
  block:    { key: 'omb',             name: 'Ordinal Maxi Biz',color: '#e03131', live: true },
  artifact: { key: 'quantum-cats',    name: 'Quantum Cats',    color: '#c84bff', live: false },
  bitcoin:  { key: 'nodemonkes',      name: 'NodeMonkes',      color: '#f2c14e', live: true,  pixel: true },
  wild:     { key: 'bitcoin-puppets', name: 'Bitcoin Puppets', color: ACCENT,    live: true },
  scatter:  { key: 'runestone',       name: 'Runestone',       color: '#9aa7b8', live: false },
  vault:    { key: 'taproot-wizards', name: 'Taproot Wizards', color: '#4f7cff', live: true },
  chain:    { key: 'bitmap',          name: 'Bitmap',          color: ACCENT,    live: false }
};
const ART = window.OR_ART || { tiles: [], runestone: null, zero: null }, MANIFEST = window.OR_MANIFEST || {};
const ORD = 'https://ordinals.com', ZERO_ID = '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0';
let sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
function save(){if(!sessionLock)LAYR.saveGame(state);}
let scene = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], jackpotShow = null;
// The room animates the cabinet's lever and spin button from these (see PX_CASINO_ENGINE.mechanics).
const lever = { name: 'px-lever' }; let leverStart = 0; const SPIN_Z = .19, spinPhysical = { position: { z: SPIN_Z } };
const feature = () => E.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}

/* ---------- Holder layer, version 1: meters and display only ---------- */
// The Holder Pot is 1% of every paid bet, kept beside the jackpot meters. It is paid for out of the house edge: it is never
// taken from a stake or a win, so the player's 94.38% is untouched. The period is one week (UTC, Monday to Sunday).
const HOLDER_RATE = 0.01;
function weekId(t = Date.now()) { const d = new Date(t), day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day + 3); const y = d.getUTCFullYear(), jan4 = new Date(Date.UTC(y, 0, 4)); const w = 1 + Math.round(((d - jan4) / 864e5 - 3 + (jan4.getUTCDay() + 6) % 7) / 7); return `${y}-W${String(w).padStart(2, '0')}`; }
function holderState() {
  const now = weekId(); let h = state.holder;
  if (!h || typeof h !== 'object') h = state.holder = { period: now, pot: 0, last: null, cameos: 0 };
  if (h.period !== now) { h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100 }; h.period = now; h.pot = 0; }
  return h;
}
function holderAdd(bet) { const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): link a Bitcoin address by signing a message from it (Leather and Xverse hold Bitcoin and Stacks accounts).
// TODO(holder-layer-v2): count the linked inscriptions from the reel collections at the period's snapshot (checked read: a failed
//   read is "unknown", never "none"), split the pot per inscription, pay the cameo royalty, holder spins and the Forever Fund.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  linkBitcoinAddress: async () => ({ ok: false, value: null, reason: 'TODO: Bitcoin address linking (signed message) is not built yet.' }),
  countLinkedInscriptions: async () => ({ ok: false, value: null, reason: 'TODO: needs the holder-link service; unknown, not zero.' }),
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO: weekly snapshot and payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO: claims need an on-chain LAYR token.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO: weekly holder spins need linked holders.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO: Forever Fund refunds apply to Stacks twins, not Ordinals.' })
});
let linkedCount = { ok: false, value: null };
HolderRewards.countLinkedInscriptions().then(r => { linkedCount = r; screenDirty = true; }).catch(() => {});

/* ---------- Bitcoin block height, read live (shown on the screen header) ---------- */
const HEIGHT_KEY = 'xtrata.parallax.ordinal-rush.height';
let height = { value: null, stale: true, at: 0 };
try { const c = JSON.parse(localStorage.getItem(HEIGHT_KEY) || 'null'); if (c && Number.isFinite(c.value)) height = { value: c.value, stale: true, at: c.at }; } catch (e) {}
async function readHeight() {
  for (const url of ['https://xtrata.xyz/hiro/mainnet/v2/info', 'https://api.hiro.so/v2/info']) {
    try { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) continue; const j = await r.json(); const v = Number(j.burn_block_height); if (Number.isFinite(v) && v > 0) { height = { value: v, stale: false, at: Date.now() }; try { localStorage.setItem(HEIGHT_KEY, JSON.stringify(height)); } catch (e) {} screenDirty = true; return; } } catch (e) {}
  }
  height.stale = true; screenDirty = true; // a failed read keeps the last known height, marked stale; never a guess
}
let heightTimer = 0;

function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'AIRDROP WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} AIRDROP SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'MINING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MINE';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  updateFsBar(); screenDirty = true;
}

/* ---------- Procedural audio: reel clacks, coin pours, block ticks. No files. ---------- */
let ac = null, master = null, noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * .5; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
function noise(d = .05, freq = 2400, q = 2, v = .25, delay = 0) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t, Math.random() * .4); s.stop(t + d + .02); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
function coins(n, at = 0) { for (let k = 0; k < n; k++) { const t = at + k * (.045 + Math.random() * .05); tone(2600 + Math.random() * 1400, .09, 'sine', .05, t); noise(.03, 6000, 4, .08, t); } }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.18, 900, 1, .18); tone(110, .25, 'triangle', .12, 0, .7); }
  if (kind === 'stop') return [noise(.06, 1800 + i * 150, 3, .35, at), tone(95 + i * 9, .09, 'triangle', .25, at), tone(1200, .03, 'square', .02, at)].filter(Boolean); // mechanical clack
  if (kind === 'win') { coins(10); tone(784, .3, 'triangle', .06); }
  if (kind === 'big') { coins(34); [523.25, 659.25, 783.99, 1046.5].forEach((n, k) => tone(n, .5, 'triangle', .08, k * .1)); }
  if (kind === 'bonus') [392, 523.25, 659.25, 783.99, 1046.5].forEach((n, k) => tone(n, .6, 'triangle', .1, k * .1));
  if (kind === 'antic') noise(1.5, 500, 1, .05);
  if (kind === 'tick') { noise(.025, 3200, 6, .12); tone(1760, .05, 'sine', .03); } // soft block-arrival tick
  if (kind === 'lock') { noise(.08, 700, 2, .3, i * .08); tone(330 + i * 40, .2, 'square', .04, i * .08); coins(3, i * .08 + .05); }
  if (kind === 'respin') { noise(.12, 900, 1, .15); tone(180, .2, 'triangle', .1, 0, .7); }
  if (kind === 'pick') { tone(988 + i * 60, .3, 'sine', .12); coins(4, .05); }
  if (kind === 'click') noise(.02, 2500, 4, .1);
  if (kind === 'lose') tone(150, .4, 'triangle', .12, 0, .6);
  if (kind === 'flip') { noise(.05, 4000, 3, .2); tone(1400, .2, 'sine', .05, .05, .8); }
  return [];
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));

/* ---------- Canvas helpers ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
const num = n => `#${Number(n).toLocaleString('en-GB')}`;
const hashStr = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
for (const id of ['brandmark', 'loaderMark']) { const el = $(id); if (el) xtrataLogo(el.getContext('2d'), el.width / 2, el.height / 2, el.width * .9); }

/* ---------- Reel tiles: real inscriptions, each with its inscription number ---------- */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px, which keeps ~150 tiles within phone canvas-memory limits
// A tile is the inscription's own art in a frame: gold for NodeMonkes (the jackpot symbol), orange for the Puppet wild.
function artTile(img, sym, item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], wild = sym === 'wild', gold = sym === 'bitcoin'; g.scale(TILE / 240, TILE / 240);
  const frame = gold ? lin(g, 0, 0, 0, 240, ['#fff1b8', '#f2c14e', '#a87411']) : wild ? lin(g, 0, 0, 0, 240, ['#ffc56b', ACCENT, '#a8550a']) : '#3a3a40';
  g.shadowColor = gold ? '#f2c14e' : wild ? ACCENT : '#000'; g.shadowBlur = gold || wild ? 14 : 4;
  round(g, 12, 6, 216, 216, 14, '#141417'); g.shadowBlur = 0; round(g, 12, 6, 216, 216, 14, null, frame, gold || wild ? 7 : 3);
  g.save(); g.beginPath(); g.roundRect(24, 18, 192, 158, 8); g.clip(); g.fillStyle = '#0d0d10'; g.fillRect(24, 18, 192, 158);
  const pixel = !!col.pixel || item.px, w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, fit = Math.min(192 / w, 158 / h), k = pixel && fit >= 1 ? Math.floor(fit) : fit;
  g.imageSmoothingEnabled = !pixel; g.drawImage(img, 24 + (192 - w * k) / 2, 18 + (158 - h * k) / 2, w * k, h * k); g.restore();
  round(g, 24, 180, 192, 32, 7, wild ? ACCENT : gold ? '#f2c14e' : '#0d0d10');
  text(g, wild ? `WILD · ${num(item.num)}` : num(item.num), 120, 197, wild || String(item.num).length > 8 ? 17 : 20, wild || gold ? '#1a0d00' : '#f3e6d0');
  return c;
}
// Bitmap parcels: the real block number from a real `.bitmap` inscription, drawn as a data tile over a district grid.
function bitmapTile(b, value) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240); g.shadowColor = ACCENT; g.shadowBlur = 10; round(g, 12, 6, 216, 216, 14, '#151006', ACCENT, 4); g.shadowBlur = 0;
  let h = hashStr(b.block); for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; const on = h % 5; round(g, 30 + x * 30, 22 + y * 22, 26, 18, 3, on === 0 ? '#f7931a55' : on === 1 ? '#f7931a2a' : '#ffffff0d'); }
  g.fillStyle = '#151006d0'; g.fillRect(24, 70, 192, 60);
  text(g, String(b.block), 120, 100, 44, '#ffd18a', 'Courier New', 'center', '900');
  round(g, 24, 180, 192, 32, 7, '#0d0d10'); text(g, value ? `${value}×` : '.BITMAP', 120, 196, value ? 22 : 18, value ? '#ffffff' : ACCENT);
  return c;
}
// Shown only until art exists: the collection's name set in type, in its colour. Never a drawing.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  round(g, 12, 6, 216, 216, 14, '#141417', col.color, 4);
  const words = col.name.toUpperCase().split(' '); words.forEach((w, i) => text(g, w, 120, 110 - (words.length - 1) * 18 + i * 36, w.length > 9 ? 22 : 30, col.color, 'Arial', 'center', '900'));
  text(g, 'LOADING INSCRIPTION', 120, 196, 13, '#8a8f99');
  return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { bundled: 0, live: 0, liveFailures: 0, done: false };
const BITMAPS = (MANIFEST.bitmap || []).map(([id, n, block]) => ({ id, num: n, block }));
pools.chain = BITMAPS.map(b => ({ key: 'bitmap', id: b.id, num: b.num, block: b.block, tile: bitmapTile(b) }));
let zeroImg = null;
async function loadBundled() {
  const keyToSym = Object.fromEntries(Object.entries(COLS).map(([s, c]) => [c.key, s]));
  await Promise.all(ART.tiles.map(async t => { const sym = keyToSym[t.key]; if (!sym) return; try { const img = await loadImage(t.src, 8000); pools[sym].push({ key: t.key, id: t.id, num: t.num, img, tile: artTile(img, sym, t), bundled: true }); sources.bundled++; } catch (e) {} }));
  if (ART.runestone) { try { const img = await loadImage(ART.runestone.src, 8000); const kids = (MANIFEST.runestone || []).slice(0, 8).map(([id, n]) => ({ id, num: n })); (kids.length ? kids : [{ id: ART.runestone.id, num: ART.runestone.num }]).forEach(k => pools.scatter.push({ key: 'runestone', id: k.id, num: k.num, delegate: ART.runestone.id, img, tile: artTile(img, 'scatter', k), bundled: true })); sources.bundled++; } catch (e) {} }
  if (ART.zero) { try { zeroImg = await loadImage(ART.zero.src, 8000); } catch (e) {} }
  screenDirty = true;
}
// Image inscriptions top up live from ordinals.com (served with CORS, so the canvas stays readable) to about 18 per symbol.
async function loadLive() {
  const queue = [];
  for (const [sym, col] of Object.entries(COLS)) { if (!col.live) continue; const have = new Set(pools[sym].map(t => t.id)); (MANIFEST[col.key] || []).filter(([id]) => !have.has(id)).sort(() => Math.random() - .5).slice(0, Math.max(0, 16 - have.size)).forEach(([id, n]) => queue.push({ sym, id, num: n })); }
  let i = 0; const worker = async () => { while (i < queue.length) { const q = queue[i++]; try { const img = await loadImage(`${ORD}/content/${q.id}`); pools[q.sym].push({ key: COLS[q.sym].key, id: q.id, num: q.num, img, tile: artTile(img, q.sym, q) }); sources.live++; } catch (e) { sources.liveFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker)); sources.done = true; screenDirty = true;
  loadImage(`${ORD}/content/${ZERO_ID}`).then(img => { zeroImg = img; }).catch(() => {});
}

/* ---------- Faces: which inscription a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: brass bezel on the cabinet, dark slate behind the reels ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#1d2023', '#121416', '#1a1c1f']); g.fillRect(0, 0, 1400, 960);
  g.strokeStyle = '#ffffff07'; g.lineWidth = 1; for (let x = 0; x < 1400; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 960); g.stroke(); } for (let y = 0; y < 960; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); }
  round(g, 18, 14, 380, 172, 12, '#0f1012', '#f7931a44', 2); round(g, 412, 14, 576, 172, 12, '#0f1012', '#f7931a88', 2); round(g, 1002, 14, 380, 172, 12, '#0f1012', '#f7931a44', 2);
  text(g, 'BLOCK HEIGHT', 208, 46, 18, '#c9a46a', 'Arial', 'center', '700'); text(g, 'INSCRIPTION #0 JACKPOT', 700, 42, 22, ACCENT, 'Arial', 'center', '800'); text(g, 'HOLDER POT', 1192, 46, 18, '#c9a46a', 'Arial', 'center', '700');
  round(g, RX - 12, RY - 12, RW + 24, RH + 24, 16, '#0b0c0e', lin(g, 0, RY - 12, 0, RY + RH + 12, ['#f5d38c', '#a77a2e', '#e6bd6b', '#7a5520']), 6);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#16181b', '#22252a', '#16181b']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff12'; g.fillRect(45, 893, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function highlightIndex(now) { return !spinning && !feature() && !scene && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
// The inscription shown in the first paying cell of a winning line: its cameo (and, later, its holder's royalty).
function cameoFor(w, grid = state.grid, fc = faces) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = grid[c][line[c]]; if (s === w.symbol || s === 'wild') { const it = itemFor(s, fc[c][line[c]]); if (it) return it; } } return null; }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = ACCENT; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#ffc56b', 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, '#ffc56b', 4); sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#ffc56bc0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#f7931a55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The Airdrop: Runestones rain down the screen while the free spins run. Positions come from the clock only.
function drawAirdrop(now) {
  const it = pools.scatter[0]; if (!it || !motionOK()) return;
  sg.save(); sg.globalAlpha = .7; sg.shadowColor = ACCENT; sg.shadowBlur = 18;
  for (let k = 0; k < 14; k++) { const sp = 90 + (hashStr('r' + k) % 70), x = RX + 20 + (hashStr('x' + k) % (RW - 80)), y = ((now / 1000 * sp + (hashStr('y' + k) % 900)) % (RH + 120)) + RY - 90, s = 40 + (k % 3) * 12; sg.drawImage(it.img, x, y, s, s); }
  sg.restore();
}
// Bitmap Land Grab: each locked cell is a real Bitmap parcel. Which parcel is cosmetic (a hash of the round id), never the engine.
const parcelOrder = new Map();
function parcelFor(f, i) { if (!BITMAPS.length) return { block: 0 }; const id = f.roundId || 'grab'; let order = parcelOrder.get(id);
  if (!order) { order = BITMAPS.map((b, k) => [hashStr(`${id}:${k}`), b]).sort((x, y) => x[0] - y[0]).map(x => x[1]); parcelOrder.set(id, order); if (parcelOrder.size > 8) parcelOrder.delete(parcelOrder.keys().next().value); }
  return order[i % order.length]; } // 15 cells, 19 parcels: no parcel appears twice in one Land Grab
const parcelCache = new Map();
function parcelTile(f, i, v) { const b = parcelFor(f, i), k = `${b.block}:${v}`; let t = parcelCache.get(k); if (!t) { t = bitmapTile(b, v); parcelCache.set(k, t); if (parcelCache.size > 60) parcelCache.delete(parcelCache.keys().next().value); } return t; }
// Wizard Vault: nine sealed sats. Their rarity shows only when opened; a Taproot Wizard reveals each one.
const RARITY = { 1: 'COMMON', 2: 'UNCOMMON', 3: 'BLACK', 4: 'PIZZA', 5: 'VINTAGE', 8: 'RARE', 10: 'EPIC', 15: 'LEGENDARY' };
const satFor = (f, i) => { const a = hashStr(`${f.roundId || 'vault'}#${i}`), b = hashStr(`${i}:${f.roundId || 'vault'}`); return (a % 2099999) * 1e9 + (b % 1e9); };
let wizardFaces = [];
// The last 21 rounds as a row of blocks: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 870;
  text(sg, 'LAST 21 BLOCKS', x0 - 20, y + s / 2, 12, '#7d6a4f', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y, s, s, 2, e ? (e.win > 0 ? ACCENT : '#3a3328') : '#1b1b1d', i === n - 1 && e ? '#ffd18a' : null, 1.5); } }

/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'THE AIRDROP', vault: 'WIZARD VAULT', chain: 'BITMAP LAND GRAB', jackpot: 'INSCRIPTION #0', gamble: 'ODD SAT / EVEN SAT' };
const RULES = { free: 'Eight free spins. Runestones rain; every win pays 2×. More Runestones add four.', vault: 'Nine sealed sats. Open three: a Wizard reveals each one’s rarity and prize.', chain: 'Claim Bitmap parcels. Any new parcel resets your three respins. All 15 wins Inscription #0.', jackpot: 'The first inscription on Bitcoin. Five NodeMonkes on the centre row found it.', gamble: '' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
let sceneQueue = [], hits = [], airdrop = null;
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { noise(.7, 700, .8, .14); [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((n, k) => tone(n, .5, 'triangle', .09, k * .07)); }
  if (kind === 'sting-vault') { [196, 261.63, 329.63, 392, 523.25].forEach((n, k) => tone(n, .7, 'sawtooth', .03, k * .09)); tone(1046.5, .9, 'sine', .06, .45); }
  if (kind === 'sting-chain') { noise(.15, 500, 1, .3); noise(.15, 500, 1, .3, .18); [220, 277.18, 329.63, 440].forEach((n, k) => tone(n, .35, 'square', .035, k * .08 + .3)); }
  if (kind === 'sting-jackpot') { [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5].forEach((n, k) => { tone(n, .9, 'triangle', .09, k * .09); tone(n / 2, 1.1, 'sine', .05, k * .09); }); coins(40, .5); }
  if (kind === 'sting-gamble') { noise(.25, 3000, 2, .15); tone(988, .3, 'sine', .07, .1); }
  if (kind === 'whoosh') { noise(.45, 1100, .7, .16); tone(240, .45, 'sine', .05, 0, 3); }
  if (kind === 'crack') { noise(.09, 3600, 3, .35); tone(700 + i * 50, .3, 'triangle', .08, .06); }
  if (kind === 'reveal-big') { [784, 988, 1175, 1568].forEach((n, k) => tone(n, .4, 'triangle', .08, k * .06)); coins(14, .1); }
  if (kind === 'stamp') { noise(.1, 380, 1.5, .5); tone(85, .2, 'sine', .3); }
  if (kind === 'reset') { tone(1318.5, .15, 'sine', .07); tone(1760, .2, 'sine', .06, .08); }
  if (kind === 'tick') tone(1600 + (i % 6) * 60, .03, 'sine', .025);
  if (kind === 'roll') noise(.03, 2600, 5, .1);
  if (kind === 'land') { noise(.06, 1500, 2, .3); tone(660, .16, 'triangle', .09); }
  if (kind === 'summary') { [659.25, 783.99, 1046.5].forEach((n, k) => tone(n, .35, 'triangle', .07, k * .08)); }
}
let musicTimer = 0;
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 739.99, 880, 1174.66, 880, 739.99];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k++ % seq.length]; tone(n, .22, 'triangle', .06); if (k % 4 === 1) tone(n / 4, .5, 'sine', .07); if (k % 2) noise(.03, 6000, 4, .05); }, state.turbo ? 90 : 150); }
// The triggering cells, read from the settled grid.
function cellsOf(sym, centreOnly = false) { const out = []; state.grid.forEach((col, c) => col.forEach((s, r) => { if (s === sym && (!centreOnly || r === 1)) out.push([c, r]); })); return out; }
function startScene(kind, data = {}, stage = 'trigger') {
  stopAuto(); hideBar(); scene = { kind, stage, t0: performance.now(), data, reveal: {}, stampAt: {}, resetAt: 0, lastLeft: 3 };
  if (stage === 'trigger') { sfx(`sting-${kind}`); if (motionOK() && kind !== 'gamble') particles(kind === 'jackpot' ? 90 : 30); }
  if (kind === 'jackpot' && stage !== 'outro') jackpotMusic(false);
  status(`${TITLES[kind]}${stage === 'trigger' ? '!' : ''}`); renderBar(); update();
}
function nextScene() { scene = null; jackpotMusic(false); hideBar(); const n = sceneQueue.shift(); if (n) { startScene(n.kind, n.data || {}, n.stage || 'trigger'); return; }
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  // A spin still pending ends the Airdrop itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } airdropOutro(); return; }
  if (state.free > 0) { status(`${state.free} AIRDROP SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2300 : 1400) * speed();
// The primary action: one button drives every stage (Spin, Space, the cabinet's INSCRIBE, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { airdropOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage(kind === 'gamble' ? 'intro' : 'intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { airdrop = { t0: performance.now(), retriggers: 0, best: 0 }; scene = null; renderBar(); update(); spin(); return; } if (kind === 'jackpot') { setStage('play'); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else toast('Open three sealed sats.'); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'AIRDROP' : broke ? 'GET LAYR' : 'INSCRIBE'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'CLAIM' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `OPEN ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'REVEALING'; }
  return 'CONTINUE';
}
const canSkip = () => (!scene && state.freeActive && !spinning) || !!scene && scene.stage !== 'outro' && !(scene.kind === 'gamble' && scene.stage === 'play' && !scene.data.result);
// Skip: resolve everything the engine already dealt, instantly, and land on the outro with the same total.
function skipScene() {
  if (!scene && state.freeActive && !spinning && !locked()) { clearTimeout(scheduleFree.t); runFreeInstantly(); airdropOutro(true); return; }
  if (!scene || locked()) return; const { kind, stage } = scene;
  if (kind === 'gamble') { if (stage !== 'play') { keepWin(); return; } scene.t0 -= 99999; setStage('outro'); return; }
  if (kind === 'jackpot') { setStage('outro'); return; }
  if (kind === 'free') { if (spinning || state.pending) return; runFreeInstantly(); airdropOutro(true); return; }
  const f = feature(); if (!f) { nextScene(); return; }
  if (kind === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) { E.pick(state, i); scene.reveal[i] = 0; } save(); }
  if (kind === 'chain') { while (!E.featureDone(f)) E.respin(state); save(); }
  collectScene(true);
}
// Free spins played with no animation: each one is still a full engine round (start, settle, features), committed one by one.
function runFreeInstantly() {
  airdrop = airdrop || { t0: performance.now(), retriggers: 0, best: 0 };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordCameos(r);
    if (r.triggers.free) airdrop.retriggers++; airdrop.best = Math.max(airdrop.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; save();
}
function airdropOutro(skipped = false) { const r = E.endFree(state); if (!r) { if (spinning || state.pending) { update(); return; } if (sceneQueue.length || feature()) nextScene(); else { scene = null; update(); } return; } save(); startScene('free', { total: r.total, count: r.count, retriggers: airdrop ? airdrop.retriggers : 0, best: airdrop ? airdrop.best : 0, skipped }, 'outro'); sfx('summary'); airdrop = null; }
function collectScene(skipped = false) {
  const f = feature(); if (!f) return; const picks = f.type === 'vault' ? f.picks.map(i => f.awards[i]) : null, cells = f.type === 'chain' ? f.frames[f.index].cells.filter(Boolean).length : 0, respins = f.type === 'chain' ? f.frames.length - 1 : 0;
  const c = E.collect(state); if (!c) return; save(); winUntil = performance.now() + 4000;
  if (!skipped) { sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 30); }
  if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', data: { amount: c.jackpotWin, fromGrab: true } });
  wizardFaces = [];
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, cells, respins, bet: f.bet, skipped }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { const before = f.frames[f.index].left; const fr = E.respin(state); save(); chainFlash = performance.now(); const now = performance.now(); fr.added.forEach((i, k) => { scene.stampAt[i] = now + k * 120 * speed(); setTimeout(() => sfx('stamp'), k * 120 * speed()); }); if (fr.added.length) { if (before < 3) { scene.resetAt = now; setTimeout(() => sfx('reset'), 200); } } else sound('respin'); renderBar(); update(); }
  else toast('Open three sealed sats first.'); }
function pickVault(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); sfx('crack', i); if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), 520 * speed()); else setTimeout(() => sound('pick', i), 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
function callGamble(choice) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, choice); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, choice, sat: satNumber(r.parity) }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, ['#ffc56b', '#f7931a', '#d9770f']) : '#1d1a16', primary ? '#fff1b8' : '#86603f', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#1a0d00' : '#f3e6d0', 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
function skipChip() { if (canSkip()) button('SKIP ›', RX + RW - 150, RY + 14, 136, 50, skipScene, false); }
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#05070c', '#1b1208', '#2a1606']); g.fillRect(RX, RY, RW, RH); if (pools.scatter[0] && motionOK()) for (let k = 0; k < 18; k++) { const sp = 70 + (hashStr('i' + k) % 80), x = RX + (hashStr('ix' + k) % RW), y = ((now / 1000 * sp + (hashStr('iy' + k) % 700)) % (RH + 160)) + RY - 120, s = 46 + (k % 4) * 14; g.globalAlpha = .35 * dim; g.drawImage(pools.scatter[0].img, x, y, s, s); } }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#140d06', '#1f1408', '#0d0905']); g.fillRect(RX, RY, RW, RH); g.globalAlpha = .12 * dim; for (let k = 0; k < 9; k++) { const [x, y, w, h] = capsuleRect(k); g.beginPath(); g.arc(x + w / 2, y + h / 2, h * .42, 0, 7); g.fillStyle = ACCENT; g.fill(); } }
  if (kind === 'chain') { g.fillStyle = '#100c07'; g.fillRect(RX, RY, RW, RH); const off = motionOK() ? (now / 40) % 250 : 0; g.globalAlpha = .28 * dim; BITMAPS.forEach((b, k) => { const t = parcelTile({ roundId: 'map' }, k, 0); const x = RX + (k % 7) * 190 - off + 20, y = RY + Math.floor(k / 7) * 190 + 10; g.drawImage(t, x, y, 170, 170); g.drawImage(t, x + 1330, y, 170, 170); }); }
  if (kind === 'jackpot') { g.fillStyle = '#0b0703'; g.fillRect(0, 0, 1400, 960); const a = motionOK() ? now / 2400 : 0; g.translate(700, 480); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.globalAlpha = .12 * dim; g.fillStyle = k % 2 ? '#f7931a' : '#f2c14e'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1200, a, a + Math.PI / 18); g.closePath(); g.fill(); } }
  if (kind === 'gamble') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0e0e10', '#1a1307']); g.fillRect(RX, RY, RW, RH); }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.2) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 60 + (1 - k) * -140;
  sg.fillStyle = '#0b0b0dd8'; sg.fillRect(RX, y - 78, RW, 156); sg.fillStyle = ACCENT; sg.fillRect(RX, y - 80, RW, 4); sg.fillRect(RX, y + 76, RW, 4);
  sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, title, 700, y - 12, 76, '#ffd18a', 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0; text(sg, sub, 700, y + 46, 22, '#f3e6d0', 'Arial', 'center', '800'); sg.restore(); }
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(0,0,0,${Math.min(.62, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? '#f2c14e' : ACCENT; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore(); });
  if (kind === 'gamble') drawSatCoin(700, RY + RH / 2, 150 * ease(t * 2), now, '?');
  if (t > .5) titleCard(TITLES[kind], kind === 'jackpot' ? 'FIVE NODEMONKES ON THE CENTRE ROW' : kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL` : `${cells.length} ${NAMES[TRIGGER_SYM[kind]].toUpperCase()}S`, now, (t - .5) * 1.4);
  if (t >= 1) setStage('intro'); }
function drawSatCoin(cx, cy, r, now, face) { if (r <= 1) return; const spin = motionOK() ? Math.cos(now / 220) : 1; sg.save(); sg.translate(cx, cy); sg.scale(Math.max(.08, Math.abs(spin)), 1); sg.shadowColor = ACCENT; sg.shadowBlur = 30; sg.fillStyle = lin(sg, -r, -r, r, r, ['#ffd18a', ACCENT, '#a8550a']); sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fill(); sg.shadowBlur = 0; sg.lineWidth = 8; sg.strokeStyle = '#7a3e06'; sg.beginPath(); sg.arc(0, 0, r * .86, 0, 7); sg.stroke(); text(sg, 'SAT', 0, -r * .32, r * .26, '#3a1f05', 'Arial', 'center', '900'); text(sg, face, 0, r * .18, r * .62, '#3a1f05', 'Arial', 'center', '900'); sg.restore(); }
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (600 * speed()), a = Math.min(1, t);
  backdrop(kind, now); sg.save(); sg.globalAlpha = a; const yIn = motionOK() ? (1 - ease(t)) * 40 : 0;
  if (kind === 'free' && pools.scatter[0]) { sg.shadowColor = ACCENT; sg.shadowBlur = 40; sg.drawImage(pools.scatter[0].img, 330 - 120, RY + 120 + yIn, 240, 240); sg.shadowBlur = 0; }
  if (kind === 'vault') { const w = tileFor('vault', wizardFaces[0] ?? pickFace('vault')); sg.drawImage(w, 210, RY + 110 + yIn, 250, 250); }
  if (kind === 'chain') { sg.drawImage(parcelTile({ roundId: 'intro' }, 0, 0), 215, RY + 115 + yIn, 230, 230); }
  if (kind === 'jackpot' && zeroImg) { sg.shadowColor = '#f2c14e'; sg.shadowBlur = 50; round(sg, 190, RY + 100 + yIn, 280, 280, 18, '#111', '#f2c14e', 8); sg.shadowBlur = 0; sg.imageSmoothingEnabled = false; sg.drawImage(zeroImg, 200, RY + 110 + yIn, 260, 260); sg.imageSmoothingEnabled = true; }
  if (kind === 'gamble') drawSatCoin(330, RY + 240, 130, now, '?');
  sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, TITLES[kind], 890, RY + 150 + yIn, kind === 'chain' ? 58 : 66, '#ffd18a', 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  const rule = kind === 'gamble' ? `Call the sat number's last digit. Right doubles your ${fmt(scene.data.stake)} LAYR win; wrong loses it.` : RULES[kind];
  wrapText(rule, 890, RY + 232 + yIn, 640, 30, '#f3e6d0', 26);
  sg.restore();
  if (kind === 'gamble') { button('ODD', 600, RY + 380, 180, 84, () => callGamble('odd')); button('EVEN', 800, RY + 380, 180, 84, () => callGamble('even')); button('KEEP WIN', 1000, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'CLAIM' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }
function wrapText(s, x, y, maxW, lh, color, size) { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); }
function drawVaultPlay(f, now) {
  backdrop('vault', now, .6); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0;
  if (wizardFaces.length !== 9) wizardFaces = Array.from({ length: 9 }, () => pickFace('vault'));
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i];
    if (picked) { const t = at ? (now - at) / (700 * speed()) : 9;
      if (t < .45 && motionOK()) { const u = t / .45, split = ease(u) * 46; sg.save(); sg.beginPath(); sg.rect(x - 60, y - 10, w + 120, h + 20); sg.clip();
        sg.save(); sg.shadowColor = '#fff1b8'; sg.shadowBlur = 60 * u; sg.fillStyle = `rgba(255,241,184,${.9 * u})`; sg.fillRect(x + w / 2 - split, y + 4, split * 2, h - 8); sg.restore();
        for (const side of [-1, 1]) { const ox = side * split, hx = side < 0 ? x : x + w / 2; sg.save(); sg.translate(ox, 0); sg.beginPath(); sg.rect(hx, y, w / 2, h); sg.clip(); round(sg, x, y, w, h, 14, lin(sg, x, y, x, y + h, ['#2a1c0b', '#130d06']), ACCENT, 3); sg.beginPath(); sg.arc(x + 70, y + h / 2, 44, 0, 7); sg.fillStyle = '#a8550a'; sg.fill(); text(sg, 'SEALED SAT', x + w / 2 + 50, y + h / 2 - 22, 24, '#ffd18a'); sg.restore(); }
        sg.restore(); continue; }
      const k = motionOK() ? ease((t - .45) / .55) : 1, big = m >= 8; sg.save(); if (big) { sg.shadowColor = '#f2c14e'; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      round(sg, x, y, w, h, 14, big ? '#3a240c' : '#1f1407', big ? '#f2c14e' : ACCENT, big ? 6 : 4); sg.restore();
      const s = (h - 16) * (motionOK() ? .6 + .4 * k : 1); sg.drawImage(tileFor('vault', wizardFaces[i]), x + 8 + (h - 16 - s) / 2, y + 8 + (h - 16 - s) / 2, s, s);
      const shown = Math.round(m * Math.min(1, k * 1.2)); text(sg, RARITY[m] || '', x + h + (w - h) / 2, y + h / 2 - 34, 22, big ? '#fff1b8' : '#ffd18a'); text(sg, `${Math.max(1, shown)}×`, x + h + (w - h) / 2, y + h / 2 + 4, 46, '#ffffff', 'Arial'); text(sg, `${fmt(Math.max(1, shown) * f.bet)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 44, 18, '#ffc56b'); }
    else if (done && now - doneAt > 900 * speed()) { round(sg, x, y, w, h, 14, '#121315', '#3a2a14', 2); text(sg, RARITY[m] || '', x + w / 2, y + h / 2 - 16, 16, '#6b5232'); text(sg, `${m}×`, x + w / 2, y + h / 2 + 14, 30, '#6b5232'); }
    else { const hover = motionOK() ? Math.sin(now / 400 + i) * 3 : 0; round(sg, x, y + hover, w, h, 14, lin(sg, x, y, x, y + h, ['#2a1c0b', '#130d06']), ACCENT, 3); sg.beginPath(); sg.arc(x + 70, y + h / 2 + hover, 44, 0, 7); sg.fillStyle = '#a8550a'; sg.fill(); sg.lineWidth = 4; sg.strokeStyle = '#ffd18a'; sg.stroke(); text(sg, String(i + 1), x + 70, y + h / 2 + hover + 2, 38, '#1a0d00', 'Arial', 'center', '900'); text(sg, 'SEALED SAT', x + w / 2 + 50, y + h / 2 - 22 + hover, 24, '#ffd18a'); text(sg, satFor(f, i).toLocaleString('en-GB'), x + w / 2 + 50, y + h / 2 + 12 + hover, 16, '#9c7a4a', 'Courier New', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickVault(i) }); } }
  if (done && now - doneAt > 900 * speed()) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }
function drawGrabPlay(f, now) {
  backdrop('chain', now, .35); const fr = f.frames[f.index], tot = fr.cells.reduce((a, v) => a + v, 0);
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, at = scene.stampAt[i];
    if (v) { const t = at ? (now - at) / (320 * speed()) : 9; if (t < 0) { round(sg, x, y, w, h, 14, '#101113', '#3a2a14', 2); return; } const s = motionOK() ? 1 + .7 * (1 - ease(t)) : 1; sg.save(); sg.globalAlpha = Math.min(1, t * 3); if (t < 1.5) { sg.shadowColor = ACCENT; sg.shadowBlur = 40 * (1.5 - Math.min(1.5, t)); } const hh = h * s; sg.drawImage(parcelTile(f, i, v), x + (w - hh) / 2, y + (h - hh) / 2, hh, hh); sg.restore(); if (t > .6) text(sg, fmt(v * f.bet), x + w / 2, y + h - 4, 16, '#ffd18a'); }
    else { round(sg, x, y, w, h, 14, '#101113cc', '#3a2a14', 2); text(sg, 'UNCLAIMED', x + w / 2, y + h / 2 - 10, 15, '#6b5232'); text(sg, 'PARCEL', x + w / 2, y + h / 2 + 12, 13, '#4d3b24'); } });
  // Respins left: three lamps that visibly refill whenever a new parcel lands.
  const rs = scene.resetAt && now - scene.resetAt < 900 ? 1 : 0; sg.save(); round(sg, RX + 14, RY + 14, 290, 52, 12, '#0b0b0de6', rs ? '#ffd18a' : '#86603f', rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, RY + 41, 20, '#ffd18a', 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const on = k < fr.left; sg.beginPath(); sg.arc(RX + 170 + k * 44, RY + 40, 15, 0, 7); sg.fillStyle = on ? (rs ? '#fff1b8' : ACCENT) : '#2a2420'; if (on && rs) { sg.shadowColor = ACCENT; sg.shadowBlur = 20; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 340, RY + RH - 66, 326, 52, 12, '#0b0b0de6', '#86603f', 2); text(sg, `CLAIMED ${fmt(tot * f.bet)} LAYR`, RX + RW - 177, RY + RH - 40, 22, '#ffd18a', 'Arial', 'center', '900');
  if (E.featureDone(f) && now - chainFlash > 700) button('COLLECT', 570, RY + RH / 2 - 37, 260, 74, collectScene);
  else if (!E.featureDone(f)) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }
function drawJackpotPlay(now) { backdrop('jackpot', now); const t = Math.min(1, (now - scene.t0) / (4200 * speed())), amt = scene.data.amount * ease(t);
  // Chasing bulbs round the whole screen.
  for (let k = 0; k < 56; k++) { const p = k / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = motionOK() ? (k + Math.floor(now / 90)) % 3 === 0 : k % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#fff1b8' : '#5a3a14'; sg.fill(); }
  const s = 300 + (motionOK() ? 20 * Math.sin(now / 300) : 0); sg.save(); sg.shadowColor = '#f2c14e'; sg.shadowBlur = 60; round(sg, 700 - s / 2 - 16, 120 - 16, s + 32, s + 32, 20, '#111', '#f2c14e', 10); sg.restore(); if (zeroImg) { sg.imageSmoothingEnabled = false; sg.drawImage(zeroImg, 700 - s / 2, 120, s, s); sg.imageSmoothingEnabled = true; }
  sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, 'INSCRIPTION #0 JACKPOT', 700, 500, 64, '#ffd18a', 'Georgia, serif', 'center', '900'); sg.restore();
  text(sg, `${fmt(Math.round(amt))} LAYR`, 700, 600, 90, '#ffffff', 'Arial', 'center', '900'); text(sg, 'THE FIRST INSCRIPTION ON BITCOIN · FROM ORDINALS.COM', 700, 680, 20, '#c9a46a', 'Arial', 'center', '800');
  if (t < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (t >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }
function drawGamblePlay(now) { backdrop('gamble', now); const r = scene.data.result, t = (now - scene.t0) / (1500 * speed()), digits = String(r.sat), shown = [...digits].map((d, k) => { const lockAt = .25 + .7 * k / digits.length; return t >= lockAt || !motionOK() ? d : String(Math.floor(Math.random() * 10)); }).join('');
  if (motionOK() && t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('roll');
  text(sg, 'THE SAT', 700, RY + 90, 26, '#c9a46a', 'Arial', 'center', '900'); const body = Number(shown.slice(0, -1) || 0).toLocaleString('en-GB'), last = shown.at(-1);
  sg.font = '900 74px Courier New'; const bw = sg.measureText(body + ',').width, lw = sg.measureText(last).width, x0 = 700 - (bw + lw) / 2; text(sg, body + (digits.length > 3 && digits.length % 3 === 1 ? ',' : ''), x0, RY + 220, 74, '#f3e6d0', 'Courier New', 'left', '900');
  const landed = t >= .95 || !motionOK(); round(sg, x0 + bw - 6, RY + 168, lw + 12, 104, 10, landed ? (r.win ? '#f7931a' : '#3a2a14') : '#2a1c0b', '#ffd18a', 4); text(sg, last, x0 + bw, RY + 220, 74, landed ? '#1a0d00' : '#ffd18a', 'Courier New', 'left', '900');
  if (landed) { if (!scene.data.landed) { scene.data.landed = true; sfx('land'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) particles(25); } text(sg, `${r.parity.toUpperCase()} · YOU CALLED ${r.choice.toUpperCase()}`, 700, RY + 340, 34, r.win ? '#ffd18a' : '#a8977f', 'Arial', 'center', '900'); button('CONTINUE', 570, RY + 420, 260, 78, () => setStage('outro')); }
  skipChip(); }
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed()));
  backdrop(kind, now, .4); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'AIRDROP CLAIMED'; total = data.total; lines = [`${data.count} free spins played at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''}`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any Vault or Land Grab won during the Airdrop', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'VAULT OPENED'; total = data.total; lines = [`3 sats opened: ${(data.picks || []).map(m => `${RARITY[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = 'LAND GRABBED'; total = data.total; lines = [`${data.cells}/15 parcels claimed · ${data.respins} respins`, data.jackpot ? `All 15 claimed: Inscription #0 Jackpot +${fmt(data.jackpot)} next` : 'Fill all 15 to win Inscription #0'] }
  if (kind === 'jackpot') { title = 'INSCRIPTION #0'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'DOUBLED' : 'NOT THIS TIME') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`Sat ${r.sat.toLocaleString('en-GB')} is ${r.parity}; you called ${r.choice}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, title, 700, RY + 110, 64, '#ffd18a', 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 220, 84, '#ffffff', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 300 + i * 36, 23, '#d0c0a8', 'Arial', 'center', '700')); sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 110, 260, 78, nextScene); }
function drawAirdropPlay(now) { // the reels, re-skinned: night sky, falling Runestones, spins left and the running total
  sg.save(); sg.fillStyle = lin(sg, 0, RY, 0, RY + RH, ['#07080d', '#1b1208', '#2a1606']); sg.fillRect(RX, RY, RW, RH); sg.restore();
  const w = drawReels(now); drawAirdrop(now);
  round(sg, 300, RY - 30, 800, 46, 12, '#1a0d00', ACCENT, 3); text(sg, `THE AIRDROP · ${state.free} SPIN${state.free === 1 ? '' : 'S'} LEFT · ${fmt(state.freeTotal)} LAYR · ALL WINS 2×`, 700, RY - 6, 20, '#ffd18a', 'Arial', 'center', '900');
  return w; }
function drawScreen(now) {
  hits = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState();
  text(sg, height.value ? height.value.toLocaleString('en-GB') : '—', 208, 102, 46, '#ffe2ad', 'Courier New', 'center', '900');
  text(sg, height.value ? (height.stale ? 'LAST KNOWN · STALE' : 'BITCOIN · LIVE') : 'UNAVAILABLE', 208, 148, 15, height.stale ? '#8a6e45' : '#c9a46a');
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, '#8f8a80');
  text(sg, fmt(hs.pot), 1192, 98, 40, '#ffe2ad', 'Arial', 'center', '300'); text(sg, `${hs.period.replace('-W', ' · WEEK ')}  ·  1% OF PAID BETS`, 1192, 136, 14, '#c9a46a');
  text(sg, linkedCount.ok ? (linkedCount.value ? `≈ ${fmt(hs.pot / linkedCount.value)} PER LINKED INSCRIPTION${linkedCount.test ? ' (TEST)' : ''}` : `NO LINKED INSCRIPTIONS YET${linkedCount.test ? ' (TEST)' : ''}`) : 'SHARE PER INSCRIPTION: COUNT UNKNOWN', 1192, 162, 13, '#8a6e45');
  let msg, msgColor = '#ffc56b';
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawJackpotPlay(now); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultPlay(f, now); else if (k === 'chain' && f) drawGrabPlay(f, now); else if (k === 'gamble' && scene.data.result) drawGamblePlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'ODD OR EVEN? CALL THE LAST DIGIT' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `WIZARD VAULT · OPEN ${f ? 3 - f.picks.length : 0} MORE · TAP A SEALED SAT`) : scene.kind === 'chain' ? `BITMAP LAND GRAB · ${f ? f.frames[f.index].left : 0} RESPIN${f && f.frames[f.index].left === 1 ? '' : 'S'} LEFT` : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawAirdropPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction); const it = w ? cameoFor(w) : null;
    msg = spinning ? 'MINING THE NEXT BLOCK…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  INSCRIPTION ${num(it.num)}` : ''}` : state.free ? `${state.free} AIRDROP SPINS  ·  ALL WINS 2×` : state.gamble ? `WIN ${fmt(state.gamble)} · ODD OR EVEN SAT?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'EVERY SAT HAS A NUMBER.'; if (state.free && !spinning) msgColor = '#ffd18a'; }
  text(sg, msg, 700, 822, 25, msgColor);
  drawBlocks();
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 926, 26, '#f3e6d0', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 926, 26, '#f3e6d0'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 926, 26, '#ffc56b', 'Arial', 'right');
  screenTexture.needsUpdate = true; screenDirty = false;
}
function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
function particles(n = 35) { if (!motionOK()) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }

/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (!scene && !feature() && !state.free && state.balance < state.bet) { openAccount(); return; } primaryAction(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null, testStops = null;
function spin() {
  if (spinning || $('modal').open || locked() || scene) return;
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  // Test hooks only: forced reel stops for the first five draws (see OrdinalRush.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : undefined;
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  // The result is committed to the shared account before anything moves. The Holder Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now(); wizardFaces = [];
  if (p.free) sound('tick');
  status(p.free ? 'AIRDROP SPIN · ALL WINS 2×' : 'MINING THE NEXT BLOCK…');
  // Now, and only now, choose which inscriptions show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Cameos: the inscription on each winning line, kept in the round's history for the future holder royalty.
function recordCameos(r) { const cameos = r.wins.map(w => { const it = cameoFor(w); return it ? { tokenId: it.id, number: it.num, collection: it.key, lineWin: w.amount } : null; }).filter(Boolean); const h = state.history[0]; if (h && h.id === r.round.id) h.cameos = cameos; if (cameos.length) holderState().cameos = (holderState().cameos || 0) + cameos.length; return cameos; }
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; recordCameos(r); save(); update();
  if (airdrop && r.round.free) airdrop.best = Math.max(airdrop.best, r.total);
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'INSCRIPTION #0 · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · RUNESTONES' : ''}` : (r.round.free ? 'AIRDROP SPIN COMPLETE' : 'NO WIN THIS BLOCK · INSCRIBE AGAIN');
  if (state.gamble) msg += ' · ODD OR EVEN SAT?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Airdrop.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (airdrop) airdrop.retriggers++; toast(`More Runestones! +${r.freeAward} Airdrop spins.`); sfx('sting-free'); } else toast('Airdrop cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); setTimeout(() => startScene(q[0].kind, q[0].data || {}), 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(airdropOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once the Airdrop has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-mine stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-MINE STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-mine.', `<p>Auto-mine spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-MINE again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('THE AIRDROP', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ⛏</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="odd">Odd sat</button><button class="bar-cta" data-act="even">Even sat</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Claim' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Open ${3 - f.picks.length} of 9 sealed sats`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Sealed sat ${i + 1}${f.picks.includes(i) ? `, ${RARITY[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 parcels · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 claimed`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ⛏'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Revealing the sat…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickVault(Number(b.dataset.pick))); }
/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'ORDINAL RUSH') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
function openCollections() {
  const rows = Object.entries(COLS).map(([s, c]) => { const n = pools[s].length, b = pools[s].filter(t => t.bundled).length; return `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(c.name)}</td><td>${s === 'wild' ? 'Wild' : esc(NAMES[s])}</td><td>${fmt(n)}</td><td>${s === 'chain' ? 'on-chain text' : `${fmt(b)} bundled · ${fmt(n - b)} live`}</td></tr>`; }).join('');
  showModal('collections', 'The inscriptions on the reels.', `<p>Every symbol here is a real Bitcoin inscription, shown with its inscription number. Ordinals are already permanent: <b>already forever</b>. Small copies are bundled into the machine so the reels show real art from the first frame, and image inscriptions top up live from <b>ordinals.com</b>. Recursive inscriptions (Pizza Ninjas, Quantum Cats, OnChainMonkey) and the 3D Runestone are shown as stills taken from their own render. Bitmap parcels are real <code>.bitmap</code> inscriptions; each tile shows the block number read from its text.</p>
  <table class="paytable"><thead><tr><th>COLLECTION</th><th>SYMBOL</th><th>ON THE REELS</th><th>SOURCE</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="fine">Art is chosen after each result is fixed, using a separate random draw, so which inscription loads never changes your odds. ${fmt(sources.bundled)} bundled, ${fmt(sources.live)} loaded live${sources.liveFailures ? `, ${sources.liveFailures} skipped` : ''}. Artwork belongs to each collection and its holders. Testnet build: shown pending each community's OK.</p><button class="outline" id="colHolders">Holder Pot ↗</button>`, 'THE INSCRIPTIONS');
  $('colHolders').onclick = openHolders;
}
function openHolders() {
  const h = holderState();
  showModal('holders', 'The Holder Pot.', `<p>1% of every paid bet on Ordinal Rush goes into this week's Holder Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(h.period)}</span><strong>${fmt(h.pot)}</strong></div><div><span>LAST WEEK${h.last ? ` · ${esc(h.last.period)}` : ''}</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div><div><span>CAMEOS RECORDED</span><strong>${fmt(h.cameos || 0)}</strong></div></div>
  <p><b>How it will pay.</b> Holders link a Bitcoin address by signing a message from it (Leather and Xverse both hold a Bitcoin and a Stacks account). At the end of each week the pot is split per inscription held from the reel collections. When your inscription lands on a winning line, its number shows in the win message and the round records it for a 1% cameo royalty.</p>
  <p class="fine">Version 1 shows the meters only. Address linking, the linked-inscription count, snapshots and payouts need a server or contract and are not built yet, so the share per inscription shows as unknown rather than a guess. The pot meter is kept with this browser's LAYR session.</p><button class="outline" disabled>Link a Bitcoin address · coming soon</button>`, 'HOLDER REWARDS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'Rarity and pays.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. A <b>Bitcoin Puppet</b> is wild: it replaces every paying symbol and has its own pays, but never replaces a Runestone, Taproot Wizard or Bitmap.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five NodeMonkes on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>THE AIRDROP</h3><p>3, 4 or 5 Runestones anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. Runestones rain down the screen and every win pays <b>2×</b>. More Runestones add 4 spins, up to 24 per feature. Your bet is locked for the feature. Wizard Vault and Land Grab can trigger during it and pay at 1×.</p>
  <h3>WIZARD VAULT</h3><p>3 or more Taproot Wizards anywhere put nine sealed sats on the screen. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three; a Wizard reveals each sat's rarity: Common 1×, Uncommon 2×, Black 3×, Pizza 4×, Vintage 5×, Rare 8×, Epic 10×, Legendary 15×.</p>
  <h3>BITMAP LAND GRAB</h3><p>5 or more Bitmaps start a hold-and-respin. Each locks as a real Bitmap parcel worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new parcel resets the count to 3. Claim all 15 to win the Inscription #0 Jackpot as well.</p>
  <h3>INSCRIPTION #0 JACKPOT</h3><p>Five NodeMonkes on the centre row (wilds don't count), or all 15 parcels claimed, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>ODD SAT / EVEN SAT</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call. The machine shows a sat number: call its parity. Right doubles the win; wrong loses that win only.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Ordinal Rush runs on the same engine as Block Fortune, Forever Twins and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which inscriptions to show, using a separate random draw, so the art loaded from ordinals.com can never change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, Runestone scatter pays 1.5%, the Airdrop 8.5%, the Wizard Vault 11.9%, Bitmap Land Grab 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. The Airdrop and the Wizard Vault each arrive about 1 in 140 spins, Land Grab about 1 in 290, the Inscription #0 Jackpot about 1 in 113,000. Odd Sat / Even Sat is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The inscriptions on the reels ↗</button> <button class="outline" id="rulesHolders">Holder Pot ↗</button>`, 'RARITY · HOW TO PLAY');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['The Airdrop', 'Three Runestones anywhere pay a scatter prize and award 8 free spins. Every win is doubled, and more Runestones add 4 spins, up to 24 per feature.'], vault: ['Wizard Vault', 'Three Taproot Wizards put nine sealed sats on the screen. Open three: each reveals a rarity and a prize from 1× to 15× your total bet.'], chain: ['Bitmap Land Grab', 'Five Bitmaps start a hold-and-respin. Parcels lock with values, any new parcel resets your three respins, and claiming all 15 wins the Inscription #0 Jackpot.'], genesis: ['Inscription #0 Jackpot', 'A progressive meter for each bet level. Land five NodeMonkes on the centre row, or claim all 15 Bitmap parcels, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'INSCRIPTION #0').replace('CHAIN', 'LAND GRAB').replace('VAULT', 'WIZARD VAULT').replace('FREE SPINS', 'AIRDROP').replace('RETRIGGER', 'MORE RUNESTONES');
function openHistory(){
 const body=`<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut)}</strong></div></div><p>Latest 50 rounds. All amounts use the shared LAYR account. Inscriptions on winning lines are recorded with each round.</p><table class="paytable"><thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th><th>ON THE LINE</th></tr></thead><tbody>${state.history.map(h=>`<tr><td>${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Airdrop spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${(h.cameos||[]).slice(0,2).map(c=>esc(num(c.number))).join(', ')}</td></tr>`).join('')}</tbody></table><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history','Your LAYR session.',body,'LAYR HISTORY');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,currency:'LAYR',wagered:state.wagered,paidOut:state.paidOut,holder:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
// Odd Sat / Even Sat. The engine's 50/50 draw sets the parity; the rest of the sat number is decoration with that parity.
function satNumber(parity) { let n = Math.floor(Math.random() * 2099999997) * 1e6 + Math.floor(Math.random() * 1e6); if ((n % 2 === 1) !== (parity === 'odd')) n += n % 10 === 9 ? -1 : 1; return n; }
function openAccount() {
  if (spinning) return;
  showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no particles or Runestone rain)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space spins, respins and collects. 1–9 open sealed sats. M mutes.</p><button class="outline" id="setCols">The inscriptions on the reels</button><button class="outline" id="setHolders">Holder Pot</button><button class="outline" id="setHistory">Session history</button>`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory;
}

function openFair() {
  showModal('fair', 'Fair play.', `<p>Ordinal Rush runs on the same engine as Block Fortune, Forever Twins and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which inscriptions to show, using a separate random draw, so art loaded from ordinals.com can never change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>Runestone scatter pays</td><td>1.5%</td><td>with the Airdrop</td></tr><tr><td>The Airdrop (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>Wizard Vault (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>Bitmap Land Grab (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Inscription #0 Jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Odd Sat / Even Sat is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win.</p>`, 'FAIR PLAY');
}

/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'INSCRIBE', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['odd', 'ODD SAT', 'call odd', 'fb gold'], ['even', 'EVEN SAT', 'call even', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'ODD/EVEN?', 'gamble win', 'fb gold'],
  ['betDown', '−SATS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+SATS', 'bet up', 'fb'], ['max', 'MAX SATS', 'max bet', 'fb'], ['auto', 'AUTO-MINE', 'auto', 'fb'],
  ['pays', 'RARITY', 'pays', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'HISTORY', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), gamble: () => openGamble(), betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 6).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(6).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free;
  q('primary').querySelector('b').textContent = spinning ? 'MINING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('odd', gambleIntro); show('even', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0);
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance);
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MINE';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK);
}
function fitFs() { if (!fsOn) return; const st = $('fsStage'), w = st.clientWidth - 16, h = st.clientHeight - 16, k = Math.max(.1, Math.min(w / 1400, h / 960)); screen.style.width = `${Math.floor(1400 * k)}px`; screen.style.height = `${Math.floor(960 * k)}px`; }
// Show or hide the fullscreen layout. Hosts call this through PX_CASINO_ENGINE.fullscreen(on) once they have made the frame visible.
function setFullscreenLayout(on) { fsOn = !!on; $('fs').hidden = !fsOn; document.body.classList.toggle('fs-on', fsOn);
  if (fsOn) { $('fsStage').appendChild(screen); fitFs(); updateFsBar(); } else if (screen.parentNode) screen.remove(); screenDirty = true; return fsOn; }
async function requestFullscreen(on) { if (fsHost) { fsHost(!!on); return; }
  if (on) { setFullscreenLayout(true); fsSelf = true; try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* the fixed full-viewport layer stays as the fallback */ } }
  else { fsSelf = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} setFullscreenLayout(false); } }
document.addEventListener('fullscreenchange', () => { if (fsSelf && !document.fullscreenElement) { fsSelf = false; setFullscreenLayout(false); } fitFs(); });
addEventListener('resize', fitFs);

/* ---------- Test hooks: only on a local development host, or when a standalone test page declares itself ---------- */
// The casino never sets PX_STANDALONE_TEST, so on the public casino OrdinalRush.test is null.
const TEST_OK = (() => { try { const w = window.parent; return w.PX_STANDALONE_TEST === true || /^(localhost|127\.0\.0\.1|\[::1\])$|\.(localhost|test)$/.test(w.location.hostname); } catch (e) { return false; } })();
// Forced reel stops for the next spin. 'win' is a plain line win (1× bet) so the gamble can be tested.
const TEST_STOPS = { free: [9, 9, 9, 9, 9], vault: [20, 20, 20, 20, 20], chain: [0, 0, 0, 0, 0], jackpot: [8, 3, 14, 0, 15], win: [15, 8, 23, 30, 4] };
const LINKED_TEST = { none: 0, some: 1240, all: 158000 };
function engineSource() { const s = [...document.scripts].find(x => x.text.includes('Block Fortune v2 engine')); return s ? s.text : ''; }
// Seeded RTP simulation of this exact engine, in a worker so the machine stays responsive.
function simulate(spins = 1e6, seed = 20261101, onProgress) { return new Promise((resolve, reject) => {
  const src = `${engineSource()}\nlet x=BigInt(${Number(seed) >>> 0})&0xffffffffffffffffn;function next(){x=(x+0x9e3779b97f4a7c15n)&0xffffffffffffffffn;let z=x;z=((z^(z>>30n))*0xbf58476d1ce4e5b9n)&0xffffffffffffffffn;z=((z^(z>>27n))*0x94d049bb133111ebn)&0xffffffffffffffffn;return Number((z^(z>>31n))>>11n)/2**53;}
const rng=n=>Math.floor(next()*n),N=${Math.floor(spins)},st=BF.fresh();st.balance=1e15;st.bet=100;let paid=0,fr=0,va=0,ch=0,jk=0;
while(paid<N){const free=st.free>0;if(!free)paid++;BF.start(st,rng);const r=BF.settle(st);if(r.jackpotWin)jk++;if(r.triggers.free&&!free)fr++;while(BF.feature(st)){const f=BF.feature(st);if(f.type==='vault'){if(!f.free)va++;[0,1,2,3,4,5,6,7,8].sort(()=>next()-.5).slice(0,3).forEach(i=>BF.pick(st,i));}else{if(!f.free)ch++;while(BF.respin(st));}if(BF.collect(st).jackpotWin)jk++;}if(!st.free&&st.freeActive)BF.endFree(st);st.history.length=0;if(paid%250000===0&&!free)postMessage({progress:paid/N});}
postMessage({done:true,spins:N,seed:${Number(seed) >>> 0},rtp:100*st.paidOut/st.wagered,freeEvery:N/fr,pickEvery:N/va,holdEvery:N/ch,jackpots:jk});`;
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), w = new Worker(url);
  w.onmessage = e => { if (e.data.done) { w.terminate(); URL.revokeObjectURL(url); resolve(e.data); } else if (onProgress) onProgress(e.data.progress); };
  w.onerror = e => { w.terminate(); reject(Error(e.message || 'simulation failed')); }; }); }
const testApi = TEST_OK ? Object.freeze({
  kinds: Object.keys(TEST_STOPS),
  force(kind) { if (!TEST_STOPS[kind]) throw Error('Unknown test feature: ' + kind); testStops = TEST_STOPS[kind].slice(); return true; },
  // Force, then spin straight away (the gamble needs a paid win first, so 'gamble' forces a plain win and opens the call).
  play(kind) { if (scene || spinning || feature() || state.free) return false; if (kind === 'gamble') { testStops = TEST_STOPS.win.slice(); spin(); const t = setInterval(() => { if (!spinning) { clearInterval(t); if (state.gamble) openGamble(); } }, 100); return true; } this.force(kind); spin(); return true; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); linkedCount = { ok: true, value: LINKED_TEST[mode], test: true }; screenDirty = true; update(); return linkedCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on)
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops; nothing here exists on the public casino.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">The Airdrop</button><button class="cta" data-t="vault">Wizard Vault</button><button class="cta" data-t="chain">Bitmap Land Grab</button><button class="cta" data-t="jackpot">Inscription #0</button><button class="cta" data-t="gamble">Odd / Even Sat</button></div>
  <h3>LINKED HOLDERS</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div><p class="fine">Ordinals are already permanent, so no symbol here is ever NOT YET FOREVER; this switches the Holder Pot's linked-inscription count instead.</p>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.linkedHolders(b.dataset.h); toast(`Linked holders: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked);
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Airdrop 1 in ${r.freeEvery.toFixed(0)} · Vault 1 in ${r.pickEvery.toFixed(0)} · Land Grab 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return;
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickVault(Number(e.key) - 1);
  else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') requestFullscreen(!fsOn); else if (e.key.toLowerCase() === 's' && canSkip()) skipScene();
  else if (e.key.toLowerCase() === 'o' && scene?.kind === 'gamble') callGamble('odd'); else if (e.key.toLowerCase() === 'e' && scene?.kind === 'gamble') callGamble('even');
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-MINE STOPPED'); } } updateFsBar(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted && pxEngineActive) ac.resume().catch(() => {}); });

/* ---------- Frame loop: the screen only; idle frames capped near 30 fps ---------- */
let lastHl = -1, lastPoolSize = 0, lastTick = 0;
const perf = { frames: 0, drawn: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); perf.frames++;
  if (spinning) spinPhysical.position.z = SPIN_Z - (1 + Math.sin(now / 170)) * .006; else spinPhysical.position.z = SPIN_Z;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || scene) screenDirty = true; // scenes animate continuously
  if (state.freeActive && motionOK()) screenDirty = true; // the Runestone rain
  if (state.freeActive && !spinning && !scene && now - lastTick > 2400) { lastTick = now; if (state.free) sound('tick'); }
  const ps = Object.values(pools).reduce((a, p) => a + p.length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw > 32)) { drawScreen(now); lastDraw = now; perf.drawn++; if (fsOn && perf.drawn % 10 === 0) updateFsBar(); }
}

/* ---------- Boot ---------- */
function resume() {
  state=LAYR.openGame(GAME_ID,E); holderState();
  if (state.pending) { lastResult = E.settle(state); recordCameos(lastResult); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startScene(feature().type, {}, 'intro'); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { renderBar(); status(`${state.free} SAVED AIRDROP SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(airdropOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; live top-ups start only after the frame has loaded and a player connects, so a slow
// network can never hold up the cabinet becoming ready.
let liveStarted = false; const startLive = () => { if (liveStarted) return; liveStarted = true; loadLive().catch(() => { sources.done = true; }); };
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.OrdinalRush = Object.freeze({ version: '1.1.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), height: () => ({ ...height }), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
  soundLog: () => soundLog.map(e => ({ ...e })), perf: () => ({ ...perf }), screen: () => screen,
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes },
  test: testApi });
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
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const clicks={sound:'sound',turbo:'turbo',max:'maxBet'};
  if(action==='spin')spinClick();else if(action==='betDown')changeBet(-1);else if(action==='betUp')changeBet(1);else if(action==='auto')autoClick();
  else if(action==='pays')openRules();else if(action==='fair')openFair();else if(action==='gamble')openGamble();else if(action==='skip')skipScene();else if(action==='fullscreen')requestFullscreen(!fsOn);
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();
  else if(clicks[action])document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // show: the scene on screen now, so a host can light the cabinet (topper speed, floor glow) during bonuses.
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());readHeight();clearInterval(heightTimer);heightTimer=setInterval(readHeight,120000);setTimeout(startLive,0);if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;clearInterval(heightTimer);if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  // Fullscreen hand-over: the host shows this frame full-viewport (and in browser fullscreen), then calls fullscreen(true).
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'INSCRIBE',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();

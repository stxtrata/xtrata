/* Rune Pit — a ParallaX Casino machine. A volcanic forge for Bitcoin Runes (launched at block 840,000, April 2024). Every symbol is
   real Bitcoin material: runes drawn from their own on-chain data (number, spaced name, symbol, etching block and transaction), real
   etchings, Runestone inscriptions, and the official DOG•GO•TO•THE•MOON logo where a file is bundled. The maths is the shared Block
   Fortune v2 engine (BF) unchanged: every outcome is fixed by BF before any art is chosen, and art is picked with Math.random,
   never the engine's generator, so nothing loaded or drawn can change a result. The casino owns all 3D rendering and cameras; this
   frame only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='rune-pit', LAYR=window.ParallaxLAYRAccount, E_REAL=LAYR.machine(GAME_ID,BF); let E=E_REAL;
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E_REAL.bets, ACCENT = '#d64545', LAVA = '#ff7a1a', EMBER = '#ff9a3c', GOLD = '#f2c14e';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'Z•Z•Z•Z•Z•FEHU•Z•Z•Z•Z•Z', lemon: 'MEME•ECONOMICS', chip: 'DECENTRALIZED', block: 'RSIC•GENESIS•RUNE', artifact: 'SATOSHI•NAKAMOTO', bitcoin: 'DOG•GO•TO•THE•MOON', wild: 'UNCOMMON•GOODS', scatter: 'Etching', vault: 'Runestone', chain: 'Rune number' };
// What each reel symbol is. `rune` is its number in the Runes protocol (null = looked up by name), `glow` is the tile's lava tint.
const COLS = {
  cherry:   { name: NAMES.cherry,   kind: 'rune',     rune: 1,    glow: '#ff6a3c' },
  lemon:    { name: NAMES.lemon,    kind: 'rune',     rune: 7,    glow: '#ffb03c' },
  chip:     { name: NAMES.chip,     kind: 'rune',     rune: 2,    glow: '#ff5a7a' },
  block:    { name: NAMES.block,    kind: 'rune',     rune: 8,    glow: '#e08a4a' },
  artifact: { name: NAMES.artifact, kind: 'rune',     rune: null, glow: '#f2c14e' },
  bitcoin:  { name: NAMES.bitcoin,  kind: 'jackpot',  rune: null, glow: GOLD },
  wild:     { name: NAMES.wild,     kind: 'wild',     rune: 0,    glow: '#ffb347' },
  scatter:  { name: 'Etching',      kind: 'etching',  glow: ACCENT },
  vault:    { name: 'Runestone',    kind: 'runestone',glow: '#9aa7b8' },
  chain:    { name: 'Rune number',  kind: 'number',   glow: LAVA }
};
const ART = window.RP_ART || { runestone: null, dog: null }, MANIFEST = window.RP_MANIFEST || { runes: [], runestone: [] };
let sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
// Bonus Lab runs use their own state and balance (see the Lab section). While one is active, nothing below reaches the real account.
let lab = null;
function save(){ if (lab) return; if(!sessionLock)LAYR.saveGame(state);}
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
  if (lab) return h && typeof h === 'object' ? h : (state.holder = { period: now, pot: 0, last: null, cameos: 0 }); // the Lab keeps its own pot, never the real one
  if (!h || typeof h !== 'object') h = state.holder = { period: now, pot: 0, last: null, cameos: 0 };
  if (h.period !== now) { h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100 }; h.period = now; h.pot = 0; }
  return h;
}
function holderAdd(bet) { if (lab) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): link a Bitcoin address by signing a message from it (Leather and Xverse hold Bitcoin and Stacks accounts).
// TODO(holder-layer-v2): at the period's snapshot, find every linked wallet that holds any reel rune or any Runestone inscription
//   (checked read: a failed read is "unknown", never "none"), give one share of the pot per wallet, pay the Runestone cameo royalty.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  linkBitcoinAddress: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): Bitcoin address linking (signed message) is not built yet.' }),
  countLinkedWallets: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): needs the holder-link service and a Runes balance index; unknown, not zero.' }),
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): weekly snapshot and payout need a server or contract.' }),
  payCameo: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): Runestone cameo royalties need the holder-link service.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO(holder-layer-v2): claims need an on-chain LAYR token.' })
});
let linkedCount = { ok: false, value: null };
HolderRewards.countLinkedWallets().then(r => { linkedCount = r; screenDirty = true; }).catch(() => {});

/* ---------- Bitcoin block height, read live (shown on the screen header) ---------- */
const HEIGHT_KEY = 'xtrata.parallax.rune-pit.height', RUNES_BLOCK = 840000;
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
  $('winLabel').textContent = lab ? 'LAB · LAST WIN' : showFree ? 'ETCHING WIN' : 'LAST WIN';
  $('freeCount').textContent = lab ? 'LAB BALANCE · NOT REAL LAYR' : state.free ? `${state.free} ETCHING SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'ETCHING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MINT';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  updateFsBar(); screenDirty = true;
}

/* ---------- Procedural audio: drums, hammer strikes on the anvil, the roar. No files. ---------- */
let ac = null, master = null, noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * .5; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
function noise(d = .05, freq = 2400, q = 2, v = .25, delay = 0, type = 'bandpass') { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; f.type = type; f.frequency.value = freq; f.Q.value = q; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t, Math.random() * .4); s.stop(t + d + .02); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// A deep forge drum: a sine that falls in pitch, with a soft low thump of noise.
function drum(f = 70, v = .45, at = 0, d = .42) { const a = tone(f * 1.9, d, 'sine', v, at, .5); noise(.12, 180, .8, v * .6, at, 'lowpass'); return a; }
// A hammer strike on the anvil: a hard click, a low knock and two inharmonic rings.
function hammer(at = 0, v = 1) { return [noise(.05, 3200, 2.5, .38 * v, at), tone(150, .14, 'triangle', .3 * v, at, .6), tone(1318, .5, 'sine', .05 * v, at), tone(2093, .35, 'sine', .035 * v, at + .005)].filter(Boolean); }
// A rising roar: filtered noise whose cutoff and level climb.
function roar(d = 2.4, at = 0, v = .22) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + at; s.buffer = noiseBuf; s.loop = true; f.type = 'lowpass'; f.frequency.setValueAtTime(160, t); f.frequency.exponentialRampToValueAtTime(2600, t + d); s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(.01, t); g.gain.linearRampToValueAtTime(v, t + d * .9); g.gain.exponentialRampToValueAtTime(.001, t + d + .5); s.start(t); s.stop(t + d + .55); }
function embers(n, at = 0) { for (let k = 0; k < n; k++) { const t = at + k * (.04 + Math.random() * .05); tone(1800 + Math.random() * 2200, .06, 'sine', .035, t); noise(.025, 5200, 4, .06, t); } }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { drum(58, .4); noise(.22, 700, 1, .16); tone(96, .3, 'triangle', .1, .02, .7); }
  if (kind === 'stop') return [...hammer(at, .75 + i * .05), drum(52 + i * 4, .3, at, .3)].filter(Boolean); // hammer strike on the reel
  if (kind === 'win') { embers(10); tone(392, .4, 'triangle', .07); tone(587.33, .4, 'triangle', .05, .08); }
  if (kind === 'big') { embers(30); drum(60, .5); [392, 523.25, 659.25, 783.99].forEach((n, k) => tone(n, .6, 'triangle', .08, k * .1)); }
  if (kind === 'bonus') { drum(52, .55); hammer(.12); [293.66, 392, 440, 587.33].forEach((n, k) => tone(n, .6, 'sawtooth', .04, k * .1 + .2)); }
  if (kind === 'antic') noise(1.5, 300, 1, .07, 0, 'lowpass');
  if (kind === 'tick') { noise(.025, 3200, 6, .1); tone(1400, .05, 'sine', .03); }
  if (kind === 'lock') { hammer(i * .08); embers(3, i * .08 + .05); }
  if (kind === 'respin') { noise(.14, 500, 1, .16); drum(64, .25); }
  if (kind === 'pick') { tone(988 + i * 60, .3, 'sine', .1); embers(4, .05); }
  if (kind === 'click') noise(.02, 2500, 4, .1);
  if (kind === 'lose') { tone(110, .6, 'triangle', .14, 0, .5); noise(.6, 260, .8, .12, 0, 'lowpass'); }
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
// A small seeded generator for cosmetic texture only (cracks, stars, grain). Never the engine's generator.
function seeded(seed) { let h = hashStr(seed) || 1; return () => { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }; }

/* ---------- The runes: real data, bundled (number, spaced name, symbol, supply, etching block, etching transaction) ---------- */
// A field the data source could not confirm is null and shown as UNVERIFIED. Nothing here is invented.
const normName = s => String(s || '').replace(/[•·.\s_-]+/g, '').toUpperCase();
// `confirmed` is false where the rune's number was inferred rather than read from a Runes index: those show a ? beside the number.
const RUNES = (MANIFEST.runes || []).map(r => ({ n: r.n, name: r.name, symbol: r.symbol == null ? null : r.symbol, supply: r.supply == null ? null : r.supply, premineOnly: !!r.premineOnly, mint: r.mint || null, block: r.block == null ? null : r.block, txid: r.txid || null, confirmed: !!r.confirmed }));
const nTag = r => r ? `#${r.n}${r.confirmed ? '' : '?'}` : '#?';
const runeByNum = new Map(RUNES.map(r => [r.n, r])), runeByName = new Map(RUNES.map(r => [normName(r.name), r]));
const runeOf = sym => { const c = COLS[sym]; return c.rune != null ? runeByNum.get(c.rune) : runeByName.get(normName(c.name)); };
const EARLY = RUNES.filter(r => r.n < 100 && r.confirmed && r.symbol != null).sort((a, b) => a.n - b.n); // first-hundred runes whose number AND symbol were read from an index (the data reaches #44)
const ETCHED = EARLY.filter(r => r.txid);                                  // runes whose full etching transaction we hold
const SYMBOL_FONT = '"Noto Sans Symbols", "Noto Sans Symbols 2", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Symbol", "Segoe UI Emoji", serif';
const hasLogo = !!(ART.dog && ART.dog.src);

/* ---------- Reel tiles, drawn from data in a carved-stone, lava-lit style ---------- */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px
function cracks(g, seed, x, y, w, h, col, n = 3) {
  const r = seeded('crack' + seed); g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (let i = 0; i < n; i++) { let px = x + r() * w, py = y + r() * h; const pts = [[px, py]]; for (let k = 0; k < 5; k++) { px = Math.max(x, Math.min(x + w, px + (r() - .5) * 64)); py = Math.max(y, Math.min(y + h, py + (r() - .5) * 64)); pts.push([px, py]); }
    for (const [lw, a] of [[5, '22'], [1.6, 'aa']]) { g.beginPath(); pts.forEach(([a1, b1], k) => k ? g.lineTo(a1, b1) : g.moveTo(a1, b1)); g.lineWidth = lw; g.strokeStyle = col + a; g.stroke(); } }
  g.restore();
}
function grain(g, seed, x, y, w, h, n = 70) { const r = seeded('grain' + seed); g.save(); for (let i = 0; i < n; i++) { g.fillStyle = r() < .5 ? '#ffffff0a' : '#0000001a'; g.fillRect(x + r() * w, y + r() * h, 1 + r() * 3, 1 + r() * 2); } g.restore(); }
// The stone the tile is cut from: basalt, a bevel, cracks lit from inside. `frame` colours the iron edge.
function stoneBody(g, seed, glow, frame, fw, hot) {
  g.shadowColor = hot ? glow : '#000'; g.shadowBlur = hot ? 16 : 5;
  round(g, 12, 6, 216, 216, 14, lin(g, 0, 6, 0, 222, ['#3a2d2f', '#211719', '#150e10']));
  g.shadowBlur = 0; grain(g, seed, 12, 6, 216, 216); cracks(g, seed, 16, 10, 208, 208, glow, 3);
  round(g, 12, 6, 216, 216, 14, null, frame, fw); round(g, 17, 11, 206, 206, 11, null, '#ffffff10', 2);
}
// Carved text: cut into the stone (shadow below-right, lip above-left) and filled with lava.
function carved(g, s, x, y, size, glow, weight = '800', font = 'Arial', fill) {
  g.save(); g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#000000b0'; g.fillText(s, x + 2, y + 3); g.fillStyle = '#ffffff22'; g.fillText(s, x - 1, y - 1);
  g.shadowColor = glow; g.shadowBlur = 12; g.fillStyle = fill || lin(g, 0, y - size / 2, 0, y + size / 2, ['#fff1d0', '#ffb347', '#e0501a']); g.fillText(s, x, y); g.restore();
}
// Split a spaced rune name over at most two lines at a • boundary, as evenly as possible.
function nameLines(name) {
  if (name.length <= 15) return [name]; const cuts = []; for (let i = 0; i < name.length; i++) if (name[i] === '•') cuts.push(i + 1);
  if (!cuts.length) return [name]; const mid = name.length / 2, cut = cuts.reduce((a, c) => Math.abs(c - mid) < Math.abs(a - mid) ? c : a);
  return [name.slice(0, cut), name.slice(cut)];
}
function nameBlock(g, name, cx, cy, maxW, size, color = '#f0d9b5') {
  const lines = nameLines(name); let s = size; g.font = `800 ${s}px Arial`; while (s > 11 && lines.some(l => g.measureText(l).width > maxW)) { s--; g.font = `800 ${s}px Arial`; }
  lines.forEach((l, i) => { const y = cy + (i - (lines.length - 1) / 2) * (s + 3); g.fillStyle = '#000000b0'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `800 ${s}px Arial`; g.fillText(l, cx + 1, y + 2); g.fillStyle = color; g.fillText(l, cx, y); });
}
function symbolGlyph(g, sym, cx, cy, size, glow) {
  if (sym == null) return; const ch = sym; // a rune with no symbol on record gets none: we never assume one
  g.save(); g.font = `700 ${size}px ${SYMBOL_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#000000c0'; g.fillText(ch, cx + 3, cy + 4); g.fillStyle = '#ffffff1c'; g.fillText(ch, cx - 1.5, cy - 1.5);
  g.shadowColor = glow; g.shadowBlur = 22; g.fillStyle = lin(g, 0, cy - size / 2, 0, cy + size / 2, ['#fff1d0', '#ffb347', '#e0501a']); g.fillText(ch, cx, cy); g.restore();
}
function numberPill(g, label, x, y, w, glow) { round(g, x, y, w, 28, 8, '#0b0708d0', glow, 2); text(g, label, x + w / 2, y + 15, 16, '#ffe2ad', 'Courier New', 'center', '900'); }
function tag(g, label, x, y, w, fill, ink) { round(g, x, y, w, 26, 8, fill); text(g, label, x + w / 2, y + 14, 14, ink, 'Arial', 'center', '900'); }
// A rune tile: the symbol large, the spaced name beneath, the rune number in the corner.
function runeTile(r, sym, variant = 0) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], wild = sym === 'wild', frame = wild ? lin(g, 0, 0, 0, 240, ['#ffd18a', '#ff9a3c', '#a8421a']) : '#54464a'; g.scale(TILE / 240, TILE / 240);
  stoneBody(g, `${r ? r.n : sym}:${variant}`, col.glow, frame, wild ? 7 : 3, wild);
  round(g, 24, 18, 192, 142, 9, '#0e090a'); round(g, 24, 18, 192, 142, 9, null, '#00000099', 2); cracks(g, `in${r ? r.n : sym}${variant}`, 26, 20, 188, 138, col.glow, 2);
  const nm = r ? r.name : NAMES[sym];
  if (r && r.symbol != null) symbolGlyph(g, r.symbol, 120, 90, 96, col.glow);
  else { // no symbol on record (UNCOMMON•GOODS): the name is typeset large instead of a glyph we do not know
    nm.split('•').forEach((w, i, a) => carved(g, w, 120, 90 + (i - (a.length - 1) / 2) * 34, 30, col.glow, '900', 'Georgia, serif')); text(g, 'SYMBOL UNVERIFIED', 120, 148, 11, '#c9a46a', 'Arial', 'center', '800'); }
  round(g, 24, 166, 192, 50, 9, '#0b0708'); nameBlock(g, nm, 120, 191, 180, 21);
  numberPill(g, nTag(r), 30, 24, r && String(r.n).length > 2 ? 66 : 56, col.glow);
  if (wild) tag(g, 'WILD', 156, 24, 54, ACCENT, '#fff1d0');
  if (!r) text(g, 'UNVERIFIED', 120, 150, 12, '#c9a46a', 'Arial', 'center', '800');
  return c;
}
// The jackpot symbol: the official DOG•GO•TO•THE•MOON logo when a file is bundled, otherwise its name set in type on a gold tile.
function dogTile(r, img) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  stoneBody(g, 'dog', GOLD, lin(g, 0, 0, 0, 240, ['#fff1b8', GOLD, '#a87411']), 7, true);
  round(g, 24, 18, 192, 142, 9, '#0e090a');
  if (img) { const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.min(184 / w, 134 / h); g.drawImage(img, 120 - w * k / 2, 89 - h * k / 2, w * k, h * k); }
  else { const words = ['DOG•GO•', 'TO•THE•', 'MOON']; words.forEach((w, i) => carved(g, w, 120, 80 + i * 31, 27, GOLD, '900', 'Georgia, serif', lin(g, 0, 66 + i * 31, 0, 94 + i * 31, ['#fff1b8', '#f2c14e', '#a87411']))); }
  round(g, 24, 166, 192, 50, 9, '#0b0708'); nameBlock(g, NAMES.bitcoin, 120, 191, 180, 21, '#ffe9a8');
  numberPill(g, nTag(r), 30, 24, 52, GOLD); tag(g, 'JACKPOT', 134, 24, 82, GOLD, '#1a0d00');
  return c;
}
// An etching: the transaction that created a rune. Shows the name, the block and the start of the txid, or UNVERIFIED.
function etchingTile(r) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  stoneBody(g, `etch${r.n}`, ACCENT, ACCENT, 5, true);
  round(g, 24, 18, 192, 30, 8, lin(g, 0, 18, 0, 48, ['#e85a4a', '#a82a2a'])); text(g, 'ETCHING', 120, 34, 18, '#fff1d0', 'Arial', 'center', '900');
  round(g, 24, 54, 192, 160, 9, '#0e090a'); cracks(g, `ein${r.n}`, 26, 56, 188, 156, ACCENT, 2);
  nameBlock(g, r.name, 120, 92, 178, 26, '#ffe2ad');
  g.fillStyle = lin(g, 24, 0, 216, 0, ['#ff7a1a00', '#ff7a1a', '#ff7a1a00']); g.fillRect(24, 126, 192, 2);
  text(g, r.block != null ? `BLOCK ${r.block.toLocaleString('en-GB')}` : 'BLOCK UNVERIFIED', 120, 148, r.block != null ? 22 : 18, r.block != null ? '#ffd18a' : '#c9a46a', 'Courier New', 'center', '900');
  text(g, r.txid ? `TX ${r.txid.slice(0, 8)}…` : 'TX UNVERIFIED', 120, 178, r.txid ? 19 : 16, r.txid ? '#f0d9b5' : '#c9a46a', 'Courier New', 'center', '700');
  text(g, `RUNE ${nTag(r)}`, 120, 202, 13, '#8a7a72', 'Arial', 'center', '800');
  return c;
}
// Rune Number: one of the first hundred, with its number, symbol and spaced name.
function numberTile(r) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  stoneBody(g, `num${r.n}`, LAVA, LAVA, 5, false);
  round(g, 24, 18, 192, 198, 9, '#0e090a'); cracks(g, `nin${r.n}`, 26, 20, 188, 194, LAVA, 2);
  text(g, 'RUNE', 120, 34, 15, '#c9a46a', 'Arial', 'center', '900');
  carved(g, nTag(r), 120, 78, String(r.n).length > 1 ? 62 : 70, LAVA, '900', 'Courier New');
  symbolGlyph(g, r.symbol, 120, 138, 56, LAVA);
  round(g, 24, 172, 192, 44, 9, '#0b0708'); nameBlock(g, r.name, 120, 194, 182, 18);
  return c;
}
// A Runestone: the inscription's own still on a stone plate, with its inscription number.
function runestoneTile(img, item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  stoneBody(g, 'rs' + item.num, '#9aa7b8', '#8a96a8', 4, false);
  g.save(); g.beginPath(); g.roundRect(24, 18, 192, 150, 9); g.clip(); g.fillStyle = '#0b0a0c'; g.fillRect(24, 18, 192, 150);
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.min(192 / w, 150 / h); g.drawImage(img, 120 - w * k / 2, 93 - h * k / 2, w * k, h * k); g.restore();
  tag(g, 'RUNESTONE', 24, 22, 98, '#0b0708d0', '#c8d2e0');
  round(g, 24, 174, 192, 40, 8, '#0b0708'); text(g, num(item.num), 120, 194, String(item.num).length > 9 ? 19 : 22, '#e6edf6', 'Courier New', 'center', '900');
  return c;
}
// Shown only until art exists: the name set in type on a stone tile. Never a drawing of someone's logo.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  stoneBody(g, 'name' + sym, col.glow, '#54464a', 3, false); round(g, 24, 18, 192, 198, 9, '#0e090a');
  nameBlock(g, col.name.toUpperCase(), 120, 100, 176, 26, '#ffe2ad'); text(g, sym === 'vault' ? 'LOADING INSCRIPTION' : 'READING THE CHAIN', 120, 196, 12, '#8a7a72');
  return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { bundled: 0, runes: RUNES.length, unverified: 0, logo: hasLogo, done: true };
const reelRunes = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild'];
// Fungible runes (cherry, lemon, chip, block, artifact, wild) get three cut variants of the same stone: same data, different cracks.
for (const s of ['cherry', 'lemon', 'chip', 'block', 'artifact', 'wild']) { const r = runeOf(s); if (!r) sources.unverified++; for (let v = 0; v < 3; v++) pools[s].push({ key: 'rune', id: r ? r.n : null, num: r ? r.n : null, rune: r, tile: runeTile(r, s, v), bundled: true }); }
{ const r = runeOf('bitcoin'); if (!r) sources.unverified++; pools.bitcoin.push({ key: 'rune', id: r ? r.n : null, num: r ? r.n : null, rune: r, tile: dogTile(r, null), bundled: true, logo: false }); }
(ETCHED.length ? ETCHED : EARLY).slice(0, 24).forEach(r => pools.scatter.push({ key: 'etching', id: r.txid, num: r.n, rune: r, tile: etchingTile(r), bundled: true }));
EARLY.slice(0, 100).forEach(r => pools.chain.push({ key: 'rune-number', id: r.n, num: r.n, rune: r, tile: numberTile(r), bundled: true }));
if (!pools.scatter.length) pools.scatter.push({ key: 'etching', id: null, num: 0, rune: { n: 0, name: NAMES.wild, symbol: null, block: null, txid: null, confirmed: false }, tile: etchingTile({ n: 0, name: NAMES.wild, symbol: null, block: null, txid: null, confirmed: false }), bundled: true });
if (!pools.chain.length) pools.chain.push({ key: 'rune-number', id: 0, num: 0, rune: { n: 0, name: NAMES.wild, symbol: null, confirmed: false }, tile: numberTile({ n: 0, name: NAMES.wild, symbol: null, confirmed: false }), bundled: true });
let runestoneImg = null, dogImg = null;
async function loadBundled() {
  if (ART.runestone) { try { runestoneImg = await loadImage(ART.runestone.src, 8000); const kids = (MANIFEST.runestone || []).slice(0, 19).map(([id, n]) => ({ id, num: n })); (kids.length ? kids : [{ id: ART.runestone.id, num: ART.runestone.num }]).forEach(k => pools.vault.push({ key: 'runestone', id: k.id, num: k.num, delegate: ART.runestone.id, img: runestoneImg, tile: runestoneTile(runestoneImg, k), bundled: true })); sources.bundled++; } catch (e) {} }
  if (hasLogo) { try { dogImg = await loadImage(ART.dog.src, 8000); const r = runeOf('bitcoin'); pools.bitcoin.length = 0; pools.bitcoin.push({ key: 'rune', id: r ? r.n : null, num: r ? r.n : null, rune: r, tile: dogTile(r, dogImg), bundled: true, logo: true }); sources.bundled++; } catch (e) {} }
  screenDirty = true;
}
// Tiles for any rune record, cached: used by the crates and the tablet scenes (a real rune, cosmetic choice).
const runeTileCache = new Map();
function tileForRune(r, style = 'rune') { if (style === 'rune') return runeTileTinted(r); const k = `${style}:${r.n}`; let t = runeTileCache.get(k); if (!t) { t = style === 'number' ? numberTile(r) : etchingTile(r); runeTileCache.set(k, t); if (runeTileCache.size > 160) runeTileCache.delete(runeTileCache.keys().next().value); } return t; }
// Each real rune gets its own lava tint by number, so a handful of tiles look distinct.
const TINTS = ['#ff6a3c', '#ffb03c', '#ff5a7a', '#e08a4a', '#f2c14e', '#ff8a5a', '#d6753c'];
function runeTileTinted(r) { const k = `t:${r.n}`; let t = runeTileCache.get(k); if (!t) { const c = canvas(TILE, TILE), g = c.getContext('2d'), glow = TINTS[r.n % TINTS.length]; g.scale(TILE / 240, TILE / 240); stoneBody(g, `rt${r.n}`, glow, '#54464a', 3, false); round(g, 24, 18, 192, 142, 9, '#0e090a'); cracks(g, `rti${r.n}`, 26, 20, 188, 138, glow, 2); if (r.symbol != null) symbolGlyph(g, r.symbol, 120, 90, 96, glow); else nameBlock(g, r.name, 120, 90, 176, 30, '#ffe2ad'); round(g, 24, 166, 192, 50, 9, '#0b0708'); nameBlock(g, r.name, 120, 191, 180, 21); numberPill(g, nTag(r), 30, 24, String(r.n).length > 2 ? 66 : 56, glow); t = c; runeTileCache.set(k, t); } return t; }
// The run of real runes available to the scenes. If the data is thin, scenes cycle what exists; they never invent a rune.
const sceneRunes = () => (EARLY.length ? EARLY : RUNES.length ? RUNES : [{ n: 0, name: NAMES.wild, symbol: null, supply: null, block: null, txid: null, confirmed: false }]);

/* ---------- Faces: which tile a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: set in a carved basalt tablet, lava in the seams ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
(function drawBase() { const g = baseLayer.getContext('2d'), r = seeded('tablet');
  g.fillStyle = lin(g, 0, 0, 1400, 960, ['#241a1d', '#120c0e', '#1e1618']); g.fillRect(0, 0, 1400, 960);
  grain(g, 'base', 0, 0, 1400, 960, 900);
  // Cracked basalt: faint facet lines, and a few veins of lava running through the seams.
  g.strokeStyle = '#ffffff08'; g.lineWidth = 1; for (let i = 0; i < 26; i++) { g.beginPath(); g.moveTo(r() * 1400, r() * 960); g.lineTo(r() * 1400, r() * 960); g.stroke(); }
  for (let v = 0; v < 6; v++) { let x = r() * 1400, y = r() < .5 ? 0 : 960; const pts = [[x, y]]; for (let k = 0; k < 9; k++) { x = Math.max(0, Math.min(1400, x + (r() - .5) * 220)); y = Math.max(0, Math.min(960, y + (y < 480 ? 1 : -1) * (20 + r() * 70))); pts.push([x, y]); }
    for (const [lw, a] of [[7, '18'], [2, '88']]) { g.beginPath(); pts.forEach(([a1, b1], k) => k ? g.lineTo(a1, b1) : g.moveTo(a1, b1)); g.lineWidth = lw; g.strokeStyle = LAVA + a; g.lineJoin = 'round'; g.stroke(); } }
  const panel = (x, y, w, h, hot) => { round(g, x, y, w, h, 12, '#0b0708', hot ? ACCENT : '#ff7a1a55', hot ? 3 : 2); round(g, x + 5, y + 5, w - 10, h - 10, 9, null, '#00000099', 2); };
  panel(18, 14, 380, 172, false); panel(412, 14, 576, 172, true); panel(1002, 14, 380, 172, false);
  text(g, 'BLOCK HEIGHT', 208, 46, 18, '#d9a07a', 'Arial', 'center', '700'); text(g, 'TO THE MOON JACKPOT', 700, 42, 22, '#ff9a6b', 'Arial', 'center', '800'); text(g, 'HOLDER POT', 1192, 46, 18, '#d9a07a', 'Arial', 'center', '700');
  // The reel window: set into iron, with an ember line inside.
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#080506', lin(g, 0, RY - 14, 0, RY + RH + 14, ['#9a8e92', '#4a4044', '#7a6e72', '#2a2326']), 8);
  round(g, RX - 4, RY - 4, RW + 8, RH + 8, 12, null, LAVA + 'aa', 2);
  for (const [x, y] of [[RX - 20, RY - 20], [RX + RW + 20, RY - 20], [RX - 20, RY + RH + 20], [RX + RW + 20, RY + RH + 20]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fillStyle = lin(g, x - 9, y - 9, x + 9, y + 9, ['#b8aeb2', '#3a3236']); g.fill(); g.strokeStyle = '#000a'; g.lineWidth = 2; g.stroke(); }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#171012', '#241a1c', '#171012']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
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
// Runes are fungible, so a rune on a winning line pays no cameo. Runestone inscriptions are one of a kind and do: but a Runestone
// never sits on a payline (it is the Airdrop's trigger symbol), so its cameo is recorded when it triggers an Airdrop (recordRunestoneCameos).
function cameoFor() { return null; }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = LAVA; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#ffc56b', 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, '#ffc56b', 4); sg.save(); sg.shadowColor = LAVA; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#ffc56bc0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#ff7a1a55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The last 21 rounds as a row of blocks: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 870;
  text(sg, 'LAST 21 BLOCKS', x0 - 20, y + s / 2, 12, '#8a6a5a', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y, s, s, 2, e ? (e.win > 0 ? ACCENT : '#3a2a2c') : '#1b1415', i === n - 1 && e ? '#ffd18a' : null, 1.5); } }

/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'ETCHING SEASON', vault: 'THE AIRDROP', chain: 'FIRST HUNDRED', jackpot: 'TO THE MOON', gamble: 'ETCH OR BURN' };
const RULES = { free: 'Eight free spins. Every win pays 2×. Three more etchings add four spins.', vault: 'Nine sealed crates. Open three. Each holds a real rune and a prize.', chain: 'Runes lock onto the tablet. Any new lock resets your three respins. Fill all fifteen to win To the Moon.', jackpot: 'Five DOG•GO•TO•THE•MOON on the centre row. The dog launches, and the whole meter is yours.', gamble: 'Call the plate in the forge. Right doubles your win. Wrong burns it.' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
// Airdrop crate tiers, named for what the forge makes. Each crate's prize is a multiple of the total bet.
const TIER = { 1: 'DUST', 2: 'ASH', 3: 'EMBER', 4: 'COAL', 5: 'FLAME', 8: 'MAGMA', 10: 'LAVA', 15: 'ERUPTION' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
const clamp01 = t => Math.max(0, Math.min(1, t));
let sceneQueue = [], hits = [], season = null, crateRunes = [];
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { drum(55, .55); hammer(.14); hammer(.5, .8); roar(.9, 0, .1); [293.66, 349.23, 440, 587.33, 698.46].forEach((n, k) => tone(n, .5, 'sawtooth', .035, k * .08 + .3)); }
  if (kind === 'sting-vault') { noise(.9, 900, .7, .1, 0, 'lowpass'); drum(48, .4, .3); [196, 261.63, 329.63, 392, 523.25].forEach((n, k) => tone(n, .7, 'triangle', .05, k * .09 + .1)); tone(1046.5, .9, 'sine', .05, .55); }
  if (kind === 'sting-chain') { hammer(0); hammer(.22); hammer(.44, 1.2); drum(52, .5, .44); [220, 277.18, 329.63, 440].forEach((n, k) => tone(n, .35, 'square', .03, k * .08 + .5)); }
  if (kind === 'sting-jackpot') { roar(2.1, 0, .22); drum(46, .6); drum(46, .6, .5); drum(46, .6, 1); drum(46, .7, 1.5); [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5].forEach((n, k) => { tone(n, .9, 'triangle', .09, 1.4 + k * .09); tone(n / 2, 1.1, 'sine', .05, 1.4 + k * .09); }); embers(40, 1.7); }
  if (kind === 'sting-gamble') { hammer(0); hammer(.3, 1.1); tone(196, .6, 'sawtooth', .04, .6); tone(185, .6, 'sawtooth', .04, .6); }
  if (kind === 'whoosh') { noise(.45, 1100, .7, .16); tone(240, .45, 'sine', .05, 0, 3); }
  if (kind === 'crack') { noise(.09, 3600, 3, .35); tone(700 + i * 50, .3, 'triangle', .08, .06); drum(70, .3); }
  if (kind === 'reveal-big') { [784, 988, 1175, 1568].forEach((n, k) => tone(n, .4, 'triangle', .08, k * .06)); embers(18, .1); drum(60, .4); }
  if (kind === 'stamp') { hammer(0, 1.1); drum(60, .4, .02); }
  if (kind === 'reset') { tone(1318.5, .15, 'sine', .07); tone(1760, .2, 'sine', .06, .08); }
  if (kind === 'tick') tone(1600 + (i % 6) * 60, .03, 'sine', .025);
  if (kind === 'roll') noise(.03, 2600, 5, .1);
  if (kind === 'land') { hammer(0, 1.2); embers(8, .05); }
  if (kind === 'carve') { noise(.5, 1800, 2, .12); tone(220, .35, 'sawtooth', .03, 0, 2); hammer(.05, .8); }
  if (kind === 'burn') { noise(1.1, 420, .8, .2, 0, 'lowpass'); tone(130, .9, 'sawtooth', .06, 0, .4); }
  if (kind === 'launch') roar(5.5, 0, .26);
  if (kind === 'summary') { [659.25, 783.99, 1046.5].forEach((n, k) => tone(n, .35, 'triangle', .07, k * .08)); drum(62, .3); }
}
let musicTimer = 0;
// The jackpot theme: a slow drum underneath and a rising arpeggio.
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [293.66, 349.23, 440, 587.33, 440, 349.23, 329.63, 392, 493.88, 659.25, 493.88, 392];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k++ % seq.length]; tone(n, .22, 'triangle', .055); if (k % 4 === 1) { drum(52, .35); tone(n / 4, .5, 'sine', .07); } if (k % 2) noise(.03, 6000, 4, .04); }, state.turbo ? 90 : 150); }
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
  // A spin still pending ends Etching Season itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } seasonOutro(); return; }
  if (state.free > 0) { status(`${state.free} ETCHING SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (stage === 'play' && scene.kind === 'jackpot') sfx('launch'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2600 : 1500) * speed();
// The first closed crate, so one big button can open them in order.
const nextCrate = f => [0, 1, 2, 3, 4, 5, 6, 7, 8].find(i => !f.picks.includes(i));
// The primary action: one button drives every stage (Spin, Space, the cabinet's ETCH, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { seasonOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage('intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { season = { t0: performance.now(), retriggers: 0, best: 0, etched: [], carve: null }; scene = null; renderBar(); update(); carve(); spin(); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else if (f) pickCrate(nextCrate(f)); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'ETCHING' : broke ? 'GET LAYR' : 'ETCH'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'LAUNCH' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `OPEN CRATE · ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'STRIKING'; }
  return 'CONTINUE';
}
const canSkip = () => (!scene && state.freeActive && !spinning) || !!scene && scene.stage !== 'outro' && !(scene.kind === 'gamble' && scene.stage === 'play' && !scene.data.result);
// Skip: resolve everything the engine already dealt, instantly, and land on the outro with the same total.
function skipScene() {
  if (!scene && state.freeActive && !spinning && !locked()) { clearTimeout(scheduleFree.t); runFreeInstantly(); seasonOutro(true); return; }
  if (!scene || locked()) return; const { kind, stage } = scene;
  if (kind === 'gamble') { if (stage !== 'play') { keepWin(); return; } scene.t0 -= 99999; setStage('outro'); return; }
  if (kind === 'jackpot') { setStage('outro'); return; }
  if (kind === 'free') { if (spinning || state.pending) return; runFreeInstantly(); seasonOutro(true); return; }
  const f = feature(); if (!f) { nextScene(); return; }
  if (kind === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) { E.pick(state, i); scene.reveal[i] = 0; } save(); }
  if (kind === 'chain') { while (!E.featureDone(f)) E.respin(state); save(); }
  collectScene(true);
}
// Free spins played with no animation: each one is still a full engine round (start, settle, features), committed one by one.
function runFreeInstantly() {
  season = season || { t0: performance.now(), retriggers: 0, best: 0, etched: [], carve: null };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state, roundRng()); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordRoundCameos(r); carve(true);
    if (r.triggers.free) season.retriggers++; season.best = Math.max(season.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; save();
}
function seasonOutro(skipped = false) { const r = E.endFree(state); if (!r) { if (spinning || state.pending) { update(); return; } if (sceneQueue.length || feature()) nextScene(); else { scene = null; update(); } return; } save(); startScene('free', { total: r.total, count: r.count, retriggers: season ? season.retriggers : 0, best: season ? season.best : 0, etched: season ? season.etched.map(e => e.r) : [], skipped }, 'outro'); sfx('summary'); season = null; }
function collectScene(skipped = false) {
  const f = feature(); if (!f) return; const picks = f.type === 'vault' ? f.picks.map(i => f.awards[i]) : null, cells = f.type === 'chain' ? f.frames[f.index].cells.filter(Boolean).length : 0, respins = f.type === 'chain' ? f.frames.length - 1 : 0;
  const opened = f.type === 'vault' ? f.picks.map(i => crateRunes[i] || null) : null, locked_ = f.type === 'chain' ? f.frames[f.index].cells.map((v, i) => v ? { v, r: tabletRune(f, i) } : null) : null;
  const c = E.collect(state); if (!c) return; save(); winUntil = performance.now() + 4000;
  if (f.type === 'vault') recordRunestoneCameos(c.amount);
  if (!skipped) { sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 30); }
  if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', data: { amount: c.jackpotWin, fromGrab: true } });
  crateRunes = [];
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, opened, tablet: locked_, cells, respins, bet: f.bet, skipped }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { const before = f.frames[f.index].left; const fr = E.respin(state); save(); chainFlash = performance.now(); const now = performance.now(); fr.added.forEach((i, k) => { scene.stampAt[i] = now + k * 140 * speed(); setTimeout(() => sfx('stamp'), k * 140 * speed()); }); if (fr.added.length) { if (before < 3) { scene.resetAt = now; setTimeout(() => sfx('reset'), 200); } } else sound('respin'); renderBar(); update(); }
  else toast('Open three crates first.'); }
function pickCrate(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f || i == null) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); sfx('crack', i); if (motionOK()) { const [x, y, w, h] = capsuleRect(i); spark(x + 100, y + h * .6, 22, { spread: Math.PI * 1.6, v: 340 }); shake(5); } if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), 520 * speed()); else setTimeout(() => sound('pick', i), 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
// Etch or Burn. The call maps onto the engine's even/odd draw: etch = even, burn = odd. The engine's own 50/50 decides the fate.
const CALL = { etch: 'even', burn: 'odd' };
function callGamble(call) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, CALL[call], gambleRng(CALL[call])); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, call, fate: r.parity === 'even' ? 'etch' : 'burn', rune: pickRune() }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }
// A real rune for decoration (the plate's face, the crates' contents). Cosmetic: chosen with Math.random after the result is fixed.
function pickRune(except = []) { const all = sceneRunes(), pool = all.filter(r => !except.includes(r)); const p = pool.length ? pool : all; return p[Math.floor(Math.random() * p.length)]; }
// Which early rune sits in tablet cell i of a hold-and-respin round: a hash of the round id, so no rune repeats within one tablet.
const tabletOrders = new Map();
function tabletRune(f, i) { const all = sceneRunes(), id = f.roundId || 'tablet'; let order = tabletOrders.get(id);
  if (!order) { order = all.map((r, k) => [hashStr(`${id}:${k}`), r]).sort((a, b) => a[0] - b[0]).map(x => x[1]); tabletOrders.set(id, order); if (tabletOrders.size > 8) tabletOrders.delete(tabletOrders.keys().next().value); }
  return order[i % order.length]; }
// Etching Season carves a new rune name into the pit wall after every spin.
let carvePool = [];
function carve(quiet = false) { if (!season) return; if (!carvePool.length) carvePool = sceneRunes().slice().sort(() => Math.random() - .5); const r = carvePool.pop(), e = { r, t0: performance.now() }; season.etched.push(e); season.carve = e;
  if (!quiet) { sfx('carve'); spark(700, 820, 26, { spread: Math.PI * 1.4, v: 300 }); shake(3); } screenDirty = true; }
// Runestone cameos. A Runestone never sits on a payline, so the inscriptions that triggered an Airdrop are the ones recorded.
function recordRunestoneCameos(amount) { if (lab) return; const shown = []; state.grid.forEach((col, c) => col.forEach((s, r) => { if (s === 'vault') { const it = itemFor('vault', faces[c][r]); if (it && !shown.includes(it)) shown.push(it); } }));
  const cameos = shown.map(it => ({ tokenId: it.id, number: it.num, collection: 'runestone', lineWin: amount, source: 'airdrop' })); const h = state.history[0]; if (h && cameos.length) h.cameos = (h.cameos || []).concat(cameos); if (cameos.length) holderState().cameos = (holderState().cameos || 0) + cameos.length; return cameos; }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
// Sparks and the screen shake are cosmetic and use Math.random; they never touch the engine.
let sparks = [], shakeAmp = 0, shakeAt = 0;
function spark(x, y, n = 8, o = {}) { if (!motionOK()) return; const t = performance.now(); for (let i = 0; i < n; i++) { const a = (o.dir != null ? o.dir : -Math.PI / 2) + (Math.random() - .5) * (o.spread || Math.PI * 1.2), v = (o.v || 260) * (.4 + Math.random() * .9); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: t, life: (o.life || 750) * (.6 + Math.random() * .8), s: (o.s || 3) * (.6 + Math.random() * .8), c: o.c || (Math.random() < .5 ? '#ffb347' : '#ff6a1a') }); } if (sparks.length > 420) sparks.splice(0, sparks.length - 420); }
function shake(a = 8) { if (!motionOK()) return; shakeAmp = a; shakeAt = performance.now(); }
function drawSparks(now) { if (!sparks.length) return; sparks = sparks.filter(p => now - p.t0 < p.life); sg.save(); sg.globalCompositeOperation = 'lighter';
  for (const p of sparks) { const t = (now - p.t0) / 1000, k = 1 - (now - p.t0) / p.life; sg.globalAlpha = Math.max(0, k); sg.fillStyle = p.c; sg.beginPath(); sg.arc(p.x + p.vx * t, p.y + p.vy * t + 350 * t * t, p.s * (.4 + k * .6), 0, 7); sg.fill(); } sg.restore(); }
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, ['#ffb36b', LAVA, '#c43a1a']) : '#1d1517', primary ? '#fff1d0' : '#86503f', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#2a0d00' : '#f0d9b5', 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
function skipChip() { if (canSkip()) button('SKIP ›', RX + RW - 150, RY + RH + 10, 130, 46, skipScene, false); }
function wrapText(s, x, y, maxW, lh, color, size, align = 'center') { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', align, '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', align, '700'); }
// A slab of carved basalt with an iron lip and a lava seam.
function slab(x, y, w, h, o = {}) { const r = o.r ?? 14; sg.save(); sg.globalAlpha = o.alpha ?? 1; if (o.glow) { sg.shadowColor = o.glow; sg.shadowBlur = 26; }
  round(sg, x, y, w, h, r, lin(sg, x, y, x, y + h, ['#3a2d2f', '#1e1517', '#130c0e']), o.edge || '#6a5a5e', 3); sg.shadowBlur = 0; round(sg, x + 5, y + 5, w - 10, h - 10, Math.max(2, r - 4), null, '#00000099', 2);
  if (o.seam !== false) { sg.strokeStyle = (o.seamColor || LAVA) + '77'; sg.lineWidth = 2; sg.beginPath(); sg.moveTo(x + r, y + h - 3); sg.lineTo(x + w - r, y + h - 3); sg.stroke(); } sg.restore(); }
// Lava light rising from the bottom of a rectangle, with slow drifting glows.
function lavaGlow(x, y, w, h, now, k = 1) { const g = sg, t = motionOK() ? now : 0; g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = lin(g, 0, y, 0, y + h, ['#0a0607', '#1a0b0b', '#3a1308']); g.fillRect(x, y, w, h); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) { const bx = x + (((i * .19 + .08 + Math.sin(t / 3200 + i * 2) * .04) % 1 + 1) % 1) * w, by = y + h + 10 + Math.sin(t / 1700 + i) * 14, rr = h * .62, rg = g.createRadialGradient(bx, by, 0, bx, by, rr); rg.addColorStop(0, `rgba(255,100,20,${.36 * k})`); rg.addColorStop(1, 'rgba(255,100,20,0)'); g.fillStyle = rg; g.fillRect(x, y, w, h); } g.restore(); }
// Embers drifting up the screen, from the clock only.
function emberRain(now, n = 26, alpha = .6, x = RX, y = RY, w = RW, h = RH) { if (!motionOK()) return; sg.save(); sg.beginPath(); sg.rect(x, y, w, h); sg.clip(); sg.globalCompositeOperation = 'lighter';
  for (let k = 0; k < n; k++) { const sp = 28 + (hashStr('es' + k) % 50), px = x + (hashStr('ex' + k) % w) + Math.sin(now / 900 + k) * 18, py = y + h - ((now / 1000 * sp + (hashStr('ey' + k) % h)) % (h + 40)) + 20, s = 2 + (k % 3); sg.globalAlpha = alpha * (.4 + .6 * ((k * 7) % 5) / 5); sg.fillStyle = k % 3 ? '#ff9a3c' : '#ffd18a'; sg.beginPath(); sg.arc(px, py, s, 0, 7); sg.fill(); } sg.restore(); }
// Molten letters. p = how much has been carved (0..1); the cut edge is white-hot, cooling to orange and ember red behind it.
function molten(s, x, y, size, p = 1, now = 0, o = {}) {
  sg.save(); sg.font = `900 ${size}px ${o.font || 'Georgia, serif'}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; const w = sg.measureText(s).width, x0 = x - w / 2;
  sg.fillStyle = '#000000aa'; sg.fillText(s, x + 2, y + 3); sg.fillStyle = o.ghost || '#3a2a2c'; sg.fillText(s, x, y);
  if (p > 0) { sg.save(); sg.beginPath(); sg.rect(x0 - 12, y - size, w * p + 12, size * 2); sg.clip(); const gr = sg.createLinearGradient(0, y - size * .5, 0, y + size * .5); (o.stops || ['#fff6dc', '#ffb347', '#d64545']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c));
    sg.shadowColor = o.glow || LAVA; sg.shadowBlur = o.blur ?? size * .35; sg.fillStyle = gr; sg.fillText(s, x, y);
    if (p < 1) { sg.shadowBlur = 0; const eg = sg.createLinearGradient(x0 + w * p - 150, 0, x0 + w * p, 0); eg.addColorStop(0, '#fff6dc00'); eg.addColorStop(1, '#fff6dce0'); sg.fillStyle = eg; sg.fillText(s, x, y); } sg.restore(); }
  sg.restore();
  if (p > 0 && p < 1 && motionOK()) { const ex = x0 + w * p; sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(ex, y, 0, ex, y, size * .6); rg.addColorStop(0, 'rgba(255,240,200,.9)'); rg.addColorStop(1, 'rgba(255,120,30,0)'); sg.fillStyle = rg; sg.fillRect(ex - size, y - size, size * 2, size * 2); sg.restore(); if (Math.floor(now / 50) !== Math.floor((now - 17) / 50)) spark(ex, y + size * .2, 2, { v: 180, spread: Math.PI, dir: -Math.PI / 2, life: 450 }); }
}
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { lavaGlow(RX, RY, RW, RH, now, dim); emberRain(now, 24, .5 * dim); }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#05060d', '#160c14', '#3a1208']); g.fillRect(RX, RY, RW, RH); const r = seeded('stars'); g.fillStyle = '#fff'; for (let k = 0; k < 70; k++) { g.globalAlpha = (.25 + .6 * r()) * dim * (motionOK() ? .7 + .3 * Math.sin(now / 500 + k) : 1); g.fillRect(RX + r() * RW, RY + r() * RH * .8, 1.6, 1.6); } g.globalAlpha = 1;
    g.fillStyle = '#0c0708'; g.beginPath(); g.moveTo(RX, RY + RH); for (let x = 0; x <= RW; x += 70) g.lineTo(RX + x, RY + RH - 50 - 40 * Math.abs(Math.sin(x * .013 + 1))); g.lineTo(RX + RW, RY + RH); g.fill(); lavaGlow(RX, RY + RH - 90, RW, 90, now, .8 * dim); }
  if (kind === 'chain') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#1a1214', '#100a0c']); g.fillRect(RX, RY, RW, RH); g.globalAlpha = .5 * dim; grain(g, 'tab', RX, RY, RW, RH, 300); g.globalAlpha = .35 * dim; cracks(g, 'tablet', RX, RY, RW, RH, LAVA, 6); g.globalAlpha = 1; }
  if (kind === 'jackpot') { skyAndMoon(now, 0); }
  if (kind === 'gamble') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0a0607', '#1c0e0c', '#3a1308']); g.fillRect(RX, RY, RW, RH); lavaGlow(RX, RY + RH - 220, RW, 220, now, .9); emberRain(now, 18, .5); }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.4) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 40 + (1 - k) * -140;
  slab(RX, y - 86, RW, 172, { r: 0, glow: ACCENT }); sg.fillStyle = ACCENT; sg.fillRect(RX, y - 90, RW, 5); sg.fillRect(RX, y + 85, RW, 5);
  const p = motionOK() ? clamp01((t - .08) / .62) : 1; molten(title, 700, y - 14, 84, p, now); if (p >= 1 && !scene.struck) { scene.struck = true; shake(9); sfx('land'); spark(700, y, 40, { spread: Math.PI * 2, v: 420 }); }
  text(sg, sub, 700, y + 54, 23, '#f0d9b5', 'Arial', 'center', '800'); sg.restore(); }
function triggerSub(kind, cells) { const r = lastResult;
  if (kind === 'free') return `${cells.length} ETCHINGS${r && r.scatterPay ? ` · PAY ${fmt(r.scatterPay)} LAYR` : ''} · 8 FREE SPINS AT 2×`;
  if (kind === 'vault') return `${cells.length} RUNESTONES · NINE CRATES FALL FROM THE SKY`;
  if (kind === 'chain') return `${cells.length} RUNE NUMBERS · CARVE THEM INTO THE TABLET`;
  if (kind === 'jackpot') return 'FIVE DOG•GO•TO•THE•MOON ON THE CENTRE ROW';
  return `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL`; }
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(8,3,3,${Math.min(.68, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  if (motionOK() && t < .5) { sg.save(); sg.globalCompositeOperation = 'lighter'; const rg = sg.createRadialGradient(700, RY + RH, 0, 700, RY + RH, 700); rg.addColorStop(0, `rgba(255,100,20,${.5 * t * 2})`); rg.addColorStop(1, 'rgba(255,100,20,0)'); sg.fillStyle = rg; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : LAVA; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore();
    if (!scene.lit) scene.lit = new Set(); if (!scene.lit.has(k)) { scene.lit.add(k); spark(RX + c * CW + CW / 2, RY + r * RHT + RHT / 2, 14, { spread: Math.PI * 2, v: 220 }); } });
  if (kind === 'gamble') drawPlate(700, RY + RH / 2 - 40, 130 * ease(t * 2), now, null, 'ready');
  if (t > .45) titleCard(TITLES[kind], triggerSub(kind, cells), now, (t - .45) * 1.5);
  if (t >= 1) setStage('intro'); }

/* --- shared props: the plate on the anvil, the rocket, the sky --- */
// A stone rune plate. face: a real rune whose glyph shows on it; mode 'ready' (cold), 'etched' (molten), 'burned' (cracked and black).
function drawPlate(cx, cy, s, now, rune, mode, p = 1) { if (s <= 2) return; sg.save(); sg.translate(cx, cy); const w = s * 1.15, h = s * 1.35;
  if (mode === 'etched') { sg.shadowColor = '#ffb347'; sg.shadowBlur = 40 + 20 * Math.sin(now / 120); }
  round(sg, -w / 2, -h / 2, w, h, s * .09, lin(sg, 0, -h / 2, 0, h / 2, mode === 'burned' ? ['#1a1213', '#0c0708'] : mode === 'etched' ? ['#6a3a22', '#2c1610'] : ['#4a3a3c', '#241a1c', '#150e10']), mode === 'etched' ? '#ffd18a' : mode === 'burned' ? '#2a2022' : '#7a686c', 4); sg.shadowBlur = 0;
  round(sg, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, s * .06, null, '#00000099', 2);
  const glyph = rune && rune.symbol != null ? rune.symbol : null;
  if (mode === 'ready') { sg.fillStyle = '#ff7a1a22'; sg.font = `900 ${s * .7}px ${SYMBOL_FONT}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; sg.fillText('?', 0, -h * .04); }
  if (mode === 'etched') { if (glyph != null) { sg.font = `700 ${s * .62}px ${SYMBOL_FONT}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; sg.save(); sg.beginPath(); sg.rect(-w / 2, -h / 2, w * p, h); sg.clip(); sg.shadowColor = '#ffb347'; sg.shadowBlur = 24; sg.fillStyle = lin(sg, 0, -s * .3, 0, s * .3, ['#fff6dc', '#ffb347', '#e0501a']); sg.fillText(glyph, 0, -h * .08); sg.restore(); } if (rune) { sg.save(); sg.translate(0, h * .32); sg.restore(); } }
  if (mode === 'burned') { sg.strokeStyle = '#000'; sg.lineWidth = 3; const r = seeded('burn'); for (let i = 0; i < 6; i++) { let x = (r() - .5) * w * .8, y = -h * .45; sg.beginPath(); sg.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - .5) * 40; y += h * .18; sg.lineTo(x, y); } sg.globalAlpha = clamp01(p * 1.5); sg.stroke(); } sg.globalAlpha = 1;
    if (glyph != null) { sg.font = `700 ${s * .62}px ${SYMBOL_FONT}`; sg.textAlign = 'center'; sg.textBaseline = 'middle'; sg.fillStyle = '#00000088'; sg.fillText(glyph, 0, -h * .08); } }
  sg.restore(); }
function drawAnvil(cx, cy, sc) { sg.save(); sg.translate(cx, cy); sg.scale(sc, sc); sg.shadowColor = '#000'; sg.shadowBlur = 16;
  sg.beginPath(); sg.moveTo(-150, -34); sg.lineTo(100, -34); sg.lineTo(100, -10); sg.quadraticCurveTo(46, -4, 44, 22); sg.lineTo(78, 60); sg.lineTo(-78, 60); sg.lineTo(-44, 22); sg.quadraticCurveTo(-46, -4, -96, -12); sg.lineTo(-150, -22); sg.closePath(); sg.fillStyle = lin(sg, 0, -34, 0, 60, ['#8a7e82', '#4a4044', '#241d20']); sg.fill(); sg.shadowBlur = 0; sg.strokeStyle = '#0008'; sg.lineWidth = 3; sg.stroke(); sg.fillStyle = '#ffffff22'; sg.fillRect(-110, -34, 200, 4);
  sg.fillStyle = lin(sg, 0, 60, 0, 90, ['#3a3034', '#150e10']); sg.fillRect(-100, 60, 200, 26); sg.restore(); }
// A forge hammer. angle 0 = head down on the anvil face; negative = raised.
function drawHammer(px, py, ang, sc = 1) { sg.save(); sg.translate(px, py); sg.rotate(ang); sg.scale(sc, sc); sg.fillStyle = lin(sg, 0, 0, 90, 0, ['#6a4a2e', '#3a2616']); sg.fillRect(0, -7, 230, 14); sg.strokeStyle = '#0008'; sg.lineWidth = 2; sg.strokeRect(0, -7, 230, 14);
  sg.shadowColor = '#000'; sg.shadowBlur = 10; sg.fillStyle = lin(sg, 0, -34, 0, 34, ['#a89ca0', '#5a4e52', '#2a2226']); sg.beginPath(); sg.roundRect(-62, -34, 80, 68, 6); sg.fill(); sg.shadowBlur = 0; sg.strokeStyle = '#0009'; sg.stroke(); sg.fillStyle = '#ffffff30'; sg.fillRect(-58, -30, 72, 5); sg.restore(); }
const STARS = (() => { const r = seeded('sky'); return Array.from({ length: 110 }, () => ({ x: r() * 1400, y: r() * 960, s: .6 + r() * 1.8, z: .2 + r() })); })();
// The night sky over the pit, with the moon. scroll = how far the rocket has climbed (stars stream downward).
function skyAndMoon(now, scroll, moonK = 1, full = true) { const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#04050c', '#0e0a1a', '#2a0f12', '#5a1a0c']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#fff'; for (const s of STARS) { g.globalAlpha = .35 + .5 * s.z; g.fillRect(s.x, (s.y + scroll * s.z * .6) % 960, s.s, s.s); } g.globalAlpha = 1;
  const mx = 1010, my = 150 + (1 - moonK) * -260, mr = 112; g.save(); g.shadowColor = '#fff1d0'; g.shadowBlur = 60 * moonK; g.fillStyle = lin(g, mx - mr, my - mr, mx + mr, my + mr, ['#fff8e8', '#e6d9c0', '#b8a888']); g.beginPath(); g.arc(mx, my, mr, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = '#00000018'; for (const [dx, dy, r] of [[-36, -24, 26], [30, 18, 34], [-10, 52, 18], [48, -46, 14], [-58, 30, 12]]) { g.beginPath(); g.arc(mx + dx, my + dy, r, 0, 7); g.fill(); } g.restore();
  // The pit horizon: dark rock and a river of lava.
  g.fillStyle = '#0a0506'; g.beginPath(); g.moveTo(0, 960); for (let x = 0; x <= 1400; x += 70) g.lineTo(x, 850 + scroll * .5 - 36 * Math.abs(Math.sin(x * .011 + 2))); g.lineTo(1400, 960); g.fill(); g.fillStyle = lin(g, 0, 880, 0, 960, ['#ff7a1a', '#c43a1a']); g.globalAlpha = .55; g.fillRect(0, 930 + scroll * .5, 1400, 40); g.globalAlpha = 1; }
// The dog rocket: a rocket with the DOG•GO•TO•THE•MOON tile set in its porthole. The rocket is a plain vehicle; the tile is the project's own.
function drawRocket(cx, cy, sc, now, flame = 1, tilt = 0) { sg.save(); sg.translate(cx, cy); sg.rotate(tilt); sg.scale(sc, sc);
  if (flame > 0) { const fl = 50 + flame * 110 + (motionOK() ? Math.sin(now / 40) * 16 : 0); sg.save(); sg.globalCompositeOperation = 'lighter'; const gr = sg.createLinearGradient(0, 76, 0, 76 + fl); gr.addColorStop(0, '#fff6dc'); gr.addColorStop(.3, '#ffb347'); gr.addColorStop(1, 'rgba(255,58,26,0)'); sg.fillStyle = gr; sg.beginPath(); sg.moveTo(-28, 76); sg.quadraticCurveTo(-34, 76 + fl * .6, 0, 76 + fl); sg.quadraticCurveTo(34, 76 + fl * .6, 28, 76); sg.closePath(); sg.fill(); sg.restore(); }
  sg.fillStyle = lin(sg, -80, 0, -30, 0, ['#8a2a2a', '#c43a3a']); sg.beginPath(); sg.moveTo(-38, 10); sg.lineTo(-84, 96); sg.lineTo(-32, 76); sg.closePath(); sg.fill(); sg.beginPath(); sg.moveTo(38, 10); sg.lineTo(84, 96); sg.lineTo(32, 76); sg.closePath(); sg.fill();
  sg.shadowColor = '#000'; sg.shadowBlur = 14; sg.beginPath(); sg.moveTo(0, -140); sg.bezierCurveTo(50, -92, 52, 0, 38, 80); sg.lineTo(-38, 80); sg.bezierCurveTo(-52, 0, -50, -92, 0, -140); sg.closePath(); sg.fillStyle = lin(sg, -50, 0, 50, 0, ['#6a6064', '#f0e8e4', '#b8aeb2', '#5a5054']); sg.fill(); sg.shadowBlur = 0;
  sg.save(); sg.clip(); sg.fillStyle = ACCENT; sg.fillRect(-60, -150, 120, 62); sg.fillStyle = '#8a2a2a'; sg.fillRect(-60, 44, 120, 14); sg.restore();
  sg.beginPath(); sg.arc(0, -34, 33, 0, 7); sg.fillStyle = '#2a2226'; sg.fill(); sg.save(); sg.beginPath(); sg.arc(0, -34, 28, 0, 7); sg.clip(); sg.drawImage(tileFor('bitcoin', 0), -32, -66, 64, 64); sg.restore(); sg.lineWidth = 5; sg.strokeStyle = '#a89ca0'; sg.beginPath(); sg.arc(0, -34, 31, 0, 7); sg.stroke(); sg.restore(); }

/* --- stage 2: the intro (a short themed transition, one line of rules, a Start button) --- */
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (700 * speed()), a = Math.min(1, t), mo = motionOK();
  backdrop(kind, now); sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.globalAlpha = a; const yIn = mo ? (1 - ease(t)) * 40 : 0, hx = 330, hy = RY + 250 + yIn;
  if (kind === 'free') { drawAnvil(hx, hy + 120, 1.1); const et = pools.scatter[0]; const sc = 210; sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 40; sg.drawImage(et.tile, hx - sc / 2, hy - sc / 2 - 20, sc, sc); sg.restore(); const ang = mo ? -.9 + Math.max(0, Math.sin(now / 260)) * .9 : -.4; drawHammer(hx + 150, hy - 120, ang, .8); if (mo && Math.floor(now / 520) !== Math.floor((now - 17) / 520)) { spark(hx, hy - 20, 8, { spread: Math.PI, v: 220 }); sfx('crack', 1); } }
  if (kind === 'vault') { const sway = mo ? Math.sin(now / 520) * .06 : 0; sg.save(); sg.translate(hx, hy - 100); sg.rotate(sway); drawCrate(0, 40, 130, 0, now, true); sg.restore(); }
  if (kind === 'chain') { slab(hx - 130, hy - 150, 260, 270, { glow: ACCENT }); const r = pools.chain[0], sz = 190; sg.drawImage(r.tile, hx - sz / 2, hy - 120, sz, sz); drawHammer(hx + 140, hy - 140, mo ? -.7 + Math.max(0, Math.sin(now / 300)) * .7 : -.3, .6); if (mo && Math.floor(now / 600) !== Math.floor((now - 17) / 600)) { spark(hx + 50, hy - 40, 10, { v: 240 }); sfx('crack', 2); } }
  if (kind === 'jackpot') { sg.fillStyle = '#0a0506'; sg.fillRect(RX, RY + RH - 80, RW, 80); lavaGlow(RX, RY + RH - 70, RW, 70, now, 1); drawRocket(hx + (mo ? Math.sin(now / 35) * 1.5 : 0), hy - 20, 1.2, now, .35 + (mo ? .15 * Math.sin(now / 90) : 0)); }
  if (kind === 'gamble') { drawAnvil(hx, hy + 130, 1.1); drawPlate(hx, hy - 20, 150, now, null, 'ready'); drawHammer(hx + 150, hy - 120, mo ? -.9 + Math.max(0, Math.sin(now / 400)) * .5 : -.5, .75); }
  molten(TITLES[kind], 890, RY + 150 + yIn, kind === 'chain' || kind === 'jackpot' ? 58 : 60, mo ? clamp01(t * 1.6) : 1, now);
  wrapText(RULES[kind], 890, RY + 232 + yIn, 640, 30, '#f0d9b5', 26);
  sg.restore();
  if (kind === 'gamble') { text(sg, `${fmt(scene.data.stake)} LAYR RIDES ON IT`, 890, RY + 330, 24, '#ffd18a', 'Arial', 'center', '900'); button('ETCH', 640, RY + 380, 170, 84, () => callGamble('etch')); button('BURN', 830, RY + 380, 170, 84, () => callGamble('burn')); button('KEEP WIN', 1030, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'LAUNCH' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }

/* --- The Airdrop: nine crates on parachutes --- */
// One airdrop crate. open 0..1 lifts the lid and drops the canopy; lone draws a standalone crate (the intro's hero).
function drawCrate(cx, cy, s, open, now, lone) { const w = s * .62, h = s * .5, top = cy - h, mo = motionOK();
  // canopy and strings (they slump when the crate opens)
  const cr = s * .52, cby = top - s * .26, cy2 = cby - cr * .62 * (1 - open * .85), slump = open * 12; sg.save(); sg.globalAlpha = 1 - open * .55;
  sg.strokeStyle = '#d9c8b8aa'; sg.lineWidth = 1.4; for (const dx of [-cr, -cr * .45, cr * .45, cr]) { sg.beginPath(); sg.moveTo(cx + dx, cby + slump); sg.lineTo(cx + dx * .26, top); sg.stroke(); }
  for (let i = 0; i < 5; i++) { const a0 = Math.PI + i * Math.PI / 5, a1 = a0 + Math.PI / 5; sg.beginPath(); sg.moveTo(cx + Math.cos(a0) * cr, cby + slump + Math.sin(a0) * cr * .62 * (1 - open * .85)); sg.ellipse(cx, cby + slump, cr, cr * .62 * (1 - open * .85), 0, a0, a1); sg.lineTo(cx, cby + slump + 4); sg.closePath(); sg.fillStyle = i % 2 ? '#e8dccb' : ACCENT; sg.fill(); sg.strokeStyle = '#00000055'; sg.lineWidth = 1; sg.stroke(); } sg.restore();
  // body: an iron-banded stone crate with a lava seam
  const shakeX = open > 0 && open < .45 && mo ? Math.sin(now / 22) * 3 : 0; sg.save(); sg.translate(shakeX, 0);
  round(sg, cx - w / 2, top, w, h, 5, lin(sg, 0, top, 0, cy, ['#4a3c3e', '#2a2022']), '#0009', 2); sg.fillStyle = '#6b5f64'; sg.fillRect(cx - w / 2, top + h * .18, w, 5); sg.fillRect(cx - w / 2, top + h * .72, w, 5); sg.fillRect(cx - w / 2 + 6, top, 6, h); sg.fillRect(cx + w / 2 - 12, top, 6, h);
  sg.strokeStyle = LAVA + 'aa'; sg.lineWidth = 2; sg.beginPath(); sg.moveTo(cx - w * .3, top + h * .35); sg.lineTo(cx - w * .08, top + h * .52); sg.lineTo(cx + w * .2, top + h * .4); sg.lineTo(cx + w * .32, top + h * .6); sg.stroke();
  text(sg, 'AIRDROP', cx, top + h * .87, Math.max(8, s * .09), '#c9a46a', 'Arial', 'center', '900');
  // lid
  const lift = ease(open / .45) * s * .5, rot = ease(open / .45) * -.5; sg.save(); sg.translate(cx - w / 2, top); sg.translate(0, -lift); sg.rotate(rot); round(sg, -3, -s * .09, w + 6, s * .09, 3, lin(sg, 0, -s * .09, 0, 0, ['#8a7e82', '#4a4044']), '#0009', 2); sg.restore();
  sg.restore();
  if (open > .12 && open < .8) { sg.save(); sg.globalCompositeOperation = 'lighter'; const bw = w * (.5 + open), gr = sg.createLinearGradient(0, top - s * 1.1, 0, top); gr.addColorStop(0, 'rgba(255,200,120,0)'); gr.addColorStop(1, `rgba(255,200,120,${.7 * (1 - open)})`); sg.fillStyle = gr; sg.fillRect(cx - bw / 2, top - s * 1.1, bw, s * 1.1); sg.restore(); } }
function drawAirdropPlay(f, now) {
  backdrop('vault', now, .8); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, mo = motionOK();
  if (crateRunes.length !== 9) { const used = []; crateRunes = Array.from({ length: 9 }, () => { const r = pickRune(used); used.push(r); return r; }); }
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], big = m >= 8;
    if (picked) { const t = at ? (now - at) / (900 * speed()) : 9, open = mo ? clamp01(t / .5) : 1;
      if (t < .5 && mo) { slab(x, y, w, h, { seam: false }); sg.save(); sg.beginPath(); sg.rect(x, y - 40, w, h + 40); sg.clip(); drawCrate(x + w / 2, y + h - 18, 128, open, now); sg.restore(); continue; }
      const k = mo ? ease((t - .5) / .5) : 1; sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      slab(x, y, w, h, { edge: big ? GOLD : ACCENT, seamColor: big ? GOLD : LAVA }); sg.restore();
      const s = (h - 20) * (mo ? .5 + .5 * k : 1); sg.drawImage(tileForRune(crateRunes[i]), x + 12 + (h - 20 - s) / 2, y + 10 + (h - 20 - s) / 2, s, s);
      const cxm = x + h + (w - h) / 2, shown = Math.max(1, Math.round(m * Math.min(1, k * 1.2)));
      text(sg, TIER[m] || '', cxm, y + h / 2 - 48, 22, big ? '#fff1b8' : '#ffb347', 'Arial', 'center', '900'); text(sg, `${shown}×`, cxm, y + h / 2 - 6, 54, '#ffffff', 'Arial', 'center', '900'); text(sg, `${fmt(shown * f.bet)} LAYR`, cxm, y + h / 2 + 40, 20, '#ffc56b', 'Arial', 'center', '800'); }
    else if (done && now - doneAt > 900 * speed()) { slab(x, y, w, h, { alpha: .55, seam: false }); text(sg, TIER[m] || '', x + w / 2, y + h / 2 - 22, 18, '#7a6258'); text(sg, `${m}×`, x + w / 2, y + h / 2 + 14, 38, '#7a6258', 'Arial', 'center', '900'); }
    else { const bob = mo ? Math.sin(now / 420 + i) * 3 : 0; slab(x, y, w, h, { seam: false }); sg.save(); sg.beginPath(); sg.rect(x, y, w, h); sg.clip(); drawCrate(x + 88, y + h - 16 + bob, 128, 0, now); sg.restore(); text(sg, `CRATE ${i + 1}`, x + w * .66, y + h / 2 - 28, 32, '#ffb347', 'Arial', 'center', '900'); text(sg, 'SEALED', x + w * .66, y + h / 2 + 8, 20, '#f0d9b5', 'Arial', 'center', '800'); text(sg, 'TAP TO OPEN', x + w * .66, y + h / 2 + 40, 15, '#9c7a6a', 'Arial', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickCrate(i) }); } }
  if (done && now - doneAt > 900 * speed()) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }

/* --- First Hundred: a stone tablet, each lock carves a real early rune into it --- */
function drawTabletPlay(f, now) {
  backdrop('chain', now, .9); const fr = f.frames[f.index], tot = fr.cells.reduce((a, v) => a + v, 0), mo = motionOK();
  sg.save(); round(sg, RX + 4, RY + 4, RW - 8, RH - 8, 12, null, '#6a5a5e', 4); round(sg, RX + 12, RY + 12, RW - 24, RH - 24, 8, null, LAVA + '55', 2); sg.restore();
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 10, y = RY + Math.floor(i / 5) * RHT + 10, w = CW - 23, h = RHT - 20, at = scene.stampAt[i];
    if (v) { const t = at ? (now - at) / (420 * speed()) : 9; if (t < 0) { slab(x, y, w, h, { seam: false, alpha: .8 }); return; }
      if (!scene.carved) scene.carved = {}; if (!scene.carved[i]) { scene.carved[i] = 1; if (at) { shake(4); spark(x + 80, y + h / 2, 22, { spread: Math.PI * 2, v: 300 }); } }
      const s = mo ? 1 + .7 * (1 - ease(t)) : 1; slab(x, y, w, h, { edge: t < 1.5 ? '#ffb347' : '#7a686c', seamColor: LAVA, glow: t < 1.5 && mo ? LAVA : null });
      sg.save(); sg.globalAlpha = Math.min(1, t * 3); const ts = (h - 18) * s; sg.drawImage(tileForRune(tabletRune(f, i), 'number'), x + 8 + (h - 18 - ts) / 2, y + 9 + (h - 18 - ts) / 2, ts, ts);
      if (t > .5) { const vx = x + h + (w - h + 8) / 2 - 4; molten(`${v}×`, vx, y + h / 2 - 12, 52, mo ? clamp01((t - .5) * 3) : 1, now, { font: 'Arial' }); text(sg, `${fmt(v * f.bet)}`, vx, y + h / 2 + 34, 20, '#ffc56b', 'Arial', 'center', '800'); } sg.restore(); }
    else { slab(x, y, w, h, { alpha: .62, seam: false }); text(sg, 'EMPTY', x + w / 2, y + h / 2 - 8, 18, '#6b5252', 'Arial', 'center', '900'); text(sg, 'SLOT', x + w / 2, y + h / 2 + 14, 14, '#4d3b3b', 'Arial', 'center', '800'); } });
  // Respins left: three ember lamps that visibly refill whenever a new rune is carved.
  const rs = scene.resetAt && now - scene.resetAt < 900 ? 1 : 0; sg.save(); round(sg, RX + 14, RY - 30, 300, 48, 12, '#0b0708e6', rs ? '#ffd18a' : '#86503f', rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, RY - 6, 20, '#ffd18a', 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const on = k < fr.left; sg.beginPath(); sg.arc(RX + 180 + k * 44, RY - 7, 15, 0, 7); sg.fillStyle = on ? (rs ? '#fff1d0' : LAVA) : '#2a2024'; if (on && rs) { sg.shadowColor = LAVA; sg.shadowBlur = 22; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 360, RY - 30, 346, 48, 12, '#0b0708e6', '#86503f', 2); text(sg, `LOCKED ${fmt(tot * f.bet)} LAYR · ${fr.cells.filter(Boolean).length}/15`, RX + RW - 187, RY - 6, 21, '#ffd18a', 'Arial', 'center', '900');
  if (E.featureDone(f) && now - chainFlash > 700) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  else if (!E.featureDone(f)) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }

/* --- Etching Season: the reels re-skinned as the pit, with names carved into the wall after every spin --- */
function drawSeasonPlay(now) {
  sg.save(); sg.beginPath(); sg.rect(RX - 14, RY - 14, RW + 28, RH + 28); sg.clip(); lavaGlow(RX - 14, RY - 14, RW + 28, RH + 28, now, 1); sg.restore();
  const w = drawReels(now); emberRain(now, 22, .55);
  // The pit wall: the newest name molten and being cut, the two before it cooling at either side.
  const wy = 782, wh = 72; slab(RX, wy, RW, wh, { edge: '#6a5a5e' }); const sn = season ? season.etched : [], last = sn[sn.length - 1], mo = motionOK();
  text(sg, 'THE PIT WALL', RX + 20, wy + 14, 12, '#9c7a6a', 'Arial', 'left', '900');
  if (!last) text(sg, 'THE FIRST NAME IS CARVED WHEN THE SPINS BEGIN', 700, wy + 38, 20, '#7a6258', 'Arial', 'center', '800');
  else { const age = (now - last.t0) / (1300 * speed()), p = mo ? clamp01(age) : 1; molten(last.r.name, 700, wy + 40, last.r.name.length > 16 ? 34 : 42, p, now);
    sn.slice(-3, -1).forEach((e, i, a) => { const side = a.length === 2 ? (i === 0 ? -1 : 1) : -1; sg.save(); sg.globalAlpha = .55; const x = 700 + side * 470; sg.font = '800 19px Georgia, serif'; const tw = sg.measureText(e.r.name).width, sc2 = Math.min(1, 300 / tw); sg.translate(x, wy + 40); sg.scale(sc2, sc2); text(sg, e.r.name, 0, 0, 19, '#c9714a', 'Georgia, serif', 'center', '800'); sg.restore(); });
    text(sg, `${sn.length} CARVED`, RX + RW - 20, wy + 14, 12, '#9c7a6a', 'Arial', 'right', '900'); }
  const left = state.free, total = state.freeTotal;
  slab(300, RY - 36, 800, 46, { r: 12, edge: ACCENT, seam: false }); text(sg, `ETCHING SEASON · ${left} SPIN${left === 1 ? '' : 'S'} LEFT · ${fmt(total)} LAYR · ALL WINS 2×`, 700, RY - 12, 20, '#ffd18a', 'Arial', 'center', '900');
  return w; }

/* --- To the Moon: the dog launches, the biggest celebration the machine has --- */
function drawMoonPlay(now) { const T = (motionOK() ? 7200 : 2400) * speed(), u = clamp01((now - scene.t0) / T), amt = scene.data.amount * ease((u - .12) / .72), mo = motionOK();
  const count = u < .12 ? Math.ceil(3 - u / .04) : 0, climb = mo ? clamp01((u - .12) / .66) : 1, k = Math.pow(climb, 2.2), arrive = clamp01((u - .78) / .22);
  skyAndMoon(now, mo ? u * 1800 * (u > .12 ? 1 : 0) : 0, 1);
  // Ash clouds streaming past during the climb.
  if (mo && u > .12 && u < .85) { sg.save(); sg.globalAlpha = .22; sg.fillStyle = '#c9b8b0'; for (let i = 0; i < 8; i++) { const cx = 120 + (hashStr('cl' + i) % 1160), cy = ((now / 3 + hashStr('cy' + i) % 960) % 1100) - 80; sg.beginPath(); sg.ellipse(cx, cy, 120, 36, 0, 0, 7); sg.fill(); } sg.restore(); }
  const rx = 1010 + (mo ? Math.sin(now / 60) * (1 - k) * 4 : 0), ry = 660 - k * 440 + (mo && u < .12 ? Math.sin(now / 30) * 3 : 0), flame = u < .12 ? (.2 + (.12 - u) * 0 + u * 5) : u > .9 ? 0.3 : 1;
  if (mo || true) drawRocket(rx, ry, .85 - .12 * k, now, mo ? flame : 0, mo ? Math.sin(now / 400) * .02 : 0);
  if (mo && u > .1 && u < .9 && Math.floor(now / 40) !== Math.floor((now - 17) / 40)) spark(rx + (Math.random() - .5) * 20, ry + 110, 3, { dir: Math.PI / 2, spread: .5, v: 360, life: 900, c: '#ff9a3c' });
  if (u < .12) { if (mo) shake(3 + u * 40); if (Math.ceil(3 - u / .04) !== scene.lastCount) { scene.lastCount = Math.ceil(3 - u / .04); sfx('crack', 3); } text(sg, String(count || 1), 400, 480, 220, '#fff1d0', 'Georgia, serif', 'center', '900'); }
  // The arrival: fireworks over the moon and the carved title.
  if (arrive > 0 && mo && Math.floor(now / 260) !== Math.floor((now - 17) / 260)) { const bx = 560 + Math.random() * 700, by = 120 + Math.random() * 420; spark(bx, by, 26, { spread: Math.PI * 2, v: 320, life: 1100, c: ['#ffd18a', '#ff7a3c', '#fff1d0', GOLD][Math.floor(Math.random() * 4)] }); if (Math.random() < .5) drum(70, .3); }
  if (u >= .1) { molten('TO THE MOON', 400, 330, 92, mo ? clamp01((u - .1) / .35) : 1, now, { stops: ['#fff6dc', '#ffe08a', '#f2a21a'], glow: GOLD });
    text(sg, 'JACKPOT', 400, 405, 26, '#ffb347', 'Arial', 'center', '900'); sg.save(); sg.shadowColor = LAVA; sg.shadowBlur = 30; text(sg, `${fmt(Math.round(amt))}`, 400, 510, 120, '#ffffff', 'Arial', 'center', '900'); sg.restore(); text(sg, 'LAYR', 400, 590, 34, '#ffd18a', 'Arial', 'center', '900');
    text(sg, 'DOG•GO•TO•THE•MOON · RUNE #3', 400, 650, 18, '#c9a46a', 'Arial', 'center', '800'); }
  // Chasing bulbs round the whole screen.
  for (let k2 = 0; k2 < 56; k2++) { const p = k2 / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = mo ? (k2 + Math.floor(now / 90)) % 3 === 0 : k2 % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#fff1d0' : '#5a2a14'; sg.fill(); }
  if (u < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (u >= 1) button('SUMMARY', 570, 760, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }

/* --- Etch or Burn: three hammer strikes, then the plate etches or burns --- */
function drawEtchBurnPlay(now) { backdrop('gamble', now); const r = scene.data.result, T = 3400 * speed(), t = clamp01((now - scene.t0) / T), mo = motionOK(), etch = r.fate === 'etch', cx = 500, cy = RY + 300;
  drawAnvil(cx, cy + 150, 1.1);
  const strikes = [.0, .22, .44], reveal = .66; let hang = 0;
  const hPhase = mo ? (t < reveal ? (() => { const s = strikes.reduce((a, st) => t >= st ? st : a, strikes[0]), u = (t - s) / .22; if (!scene.hit) scene.hit = {}; if (u > .8 && !scene.hit[s]) { scene.hit[s] = 1; sfx('land'); shake(7); spark(cx, cy - 36, 18, { spread: Math.PI * 1.1, v: 360 }); } return u < .8 ? -(1.05 - u * 1.3) : -.0; })() : -.35) : -.35;
  // The plate takes the strikes, then is revealed.
  const pr = t >= reveal ? clamp01((t - reveal) / .2) : 0, mode = t < reveal ? 'ready' : etch ? 'etched' : 'burned', rune = r.rune;
  const jolt = mo && t < reveal ? Math.max(0, Math.sin(((t % .22) / .22) * Math.PI)) * 3 : 0;
  drawPlate(cx, cy - 52 + jolt, 160, now, rune, mode, pr);
  if (t >= reveal && etch) { const p = mo ? clamp01((t - reveal) / .24) : 1; molten(rune.name, cx, cy + 82, rune.name.length > 15 ? 24 : 28, p, now); }
  if (t >= reveal && !etch && mo) { for (let i = 0; i < 6; i++) { const ph = ((now / 1400 + i / 6) % 1), sx = cx + Math.sin(i * 2.1 + now / 500) * 40, sy = cy - 20 - ph * 220; sg.save(); sg.globalAlpha = (1 - ph) * .35; sg.fillStyle = '#8a8084'; sg.beginPath(); sg.arc(sx, sy, 14 + ph * 22, 0, 7); sg.fill(); sg.restore(); } }
  if (t < reveal || !etch) drawHammer(cx + 170, cy - 170 + (t < reveal ? 0 : -40), t < reveal ? hPhase : -.9, .8);
  // The verdict.
  if (t >= reveal + .05) { if (!scene.data.landed) { scene.data.landed = true; sfx(etch ? 'land' : 'burn'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) { particles(25); spark(cx, cy - 60, 40, { spread: Math.PI * 2, v: 420 }); } else shake(6); }
    const k = mo ? ease((t - reveal - .05) / .12) : 1; sg.save(); sg.globalAlpha = k; molten(etch ? 'ETCHED' : 'BURNED', 1040, RY + 150, 78, 1, now, etch ? {} : { stops: ['#a89ca0', '#5a4e52', '#241c1e'], glow: '#000', ghost: '#2a2022' });
    text(sg, `YOU CALLED ${r.call.toUpperCase()}. THE PLATE ${etch ? 'ETCHED' : 'BURNED'}.`, 1040, RY + 232, 24, r.win ? '#ffd18a' : '#b8a8a0', 'Arial', 'center', '900');
    text(sg, r.win ? `${fmt(r.amount)} LAYR` : '0 LAYR', 1040, RY + 316, 70, r.win ? '#ffffff' : '#7a6a6a', 'Arial', 'center', '900'); text(sg, r.win ? `YOUR ${fmt(r.stake)} LAYR WIN IS DOUBLED` : `YOUR ${fmt(r.stake)} LAYR WIN IS BURNED`, 1040, RY + 372, 20, '#d0c0a8', 'Arial', 'center', '700'); sg.restore();
    button('CONTINUE', 910, RY + 430, 260, 78, () => setStage('outro')); }
  else text(sg, 'THE FORGE DECIDES…', 1040, RY + 250, 30, '#ffb347', 'Arial', 'center', '900');
  skipChip(); }

/* --- stage 4: the summary --- */
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed())), mo = motionOK();
  backdrop(kind === 'jackpot' ? 'vault' : kind, now, .5); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'SEASON ENDED'; total = data.total; lines = [`${data.count} free spins at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''} · ${(data.etched || []).length} names carved`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any Airdrop or First Hundred won during the season', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'CRATES OPENED'; total = data.total; lines = [`3 crates opened: ${(data.picks || []).map(m => `${TIER[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = data.jackpot ? 'TABLET FILLED' : 'TABLET CARVED'; total = data.total; lines = [`${data.cells}/15 runes carved · ${data.respins} respins`, data.jackpot ? `All 15 carved: To the Moon jackpot +${fmt(data.jackpot)} next` : 'Fill all 15 to win To the Moon'] }
  if (kind === 'jackpot') { title = 'TO THE MOON'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', state.lastWin > total + .5 ? `Plus ${fmt(Math.round((state.lastWin - total) * 100) / 100)} LAYR in line wins on the same spin` : 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'ETCHED' : 'BURNED') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`You called ${r.call}; the plate ${r.fate === 'etch' ? 'etched' : 'burned'}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  slab(RX + 90, RY + 14, RW - 180, RH - 28, { r: 18, glow: ACCENT });
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); molten(title, 700, RY + 84, 62, mo ? clamp01(t * 1.8) : 1, now);
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 178, 80, '#ffffff', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 246 + i * 32, 22, '#d9c4b0', 'Arial', 'center', '700'));
  // What made it up.
  if (kind === 'free') (data.etched || []).slice(-10).forEach((r, i) => { const col = i % 5, row = Math.floor(i / 5), x = RX + 115 + col * 218, y = RY + 322 + row * 50; round(sg, x, y, 208, 42, 8, '#120c0e', '#6a4a40', 2); sg.font = '800 14px Arial'; let nm = r.name; while (sg.measureText(nm).width > 164 && nm.length > 6) nm = nm.slice(0, -2); text(sg, `${r.symbol || ''} ${nm}`, x + 104, y + 22, 15, '#f0d9b5', SYMBOL_FONT.replace(/^/, 'Arial, '), 'center', '800'); });
  if (kind === 'vault') (data.picks || []).forEach((m, i) => { const x = RX + 150 + i * 360; slab(x, RY + 316, 330, 138, { r: 10, seam: false }); const r = (data.opened || [])[i]; if (r) sg.drawImage(tileForRune(r), x + 10, RY + 324, 122, 122); text(sg, `${m}×`, x + 232, RY + 372, 48, '#fff', 'Arial', 'center', '900'); text(sg, `${TIER[m]} · ${fmt(m * (data.bet || 0))}`, x + 232, RY + 420, 17, '#ffb347', 'Arial', 'center', '800'); });
  if (kind === 'chain') (data.tablet || []).forEach((c, i) => { const x = 700 - 5 * 62 + (i % 5) * 124 + 4, y = RY + 318 + Math.floor(i / 5) * 46; round(sg, x, y, 116, 40, 6, c ? '#2a1c1a' : '#120c0e', c ? LAVA : '#3a2a2a', 2); if (c) text(sg, `${c.r.symbol || ''} ${c.v}×`, x + 58, y + 21, 18, '#ffd18a', SYMBOL_FONT, 'center', '900'); });
  if (kind === 'jackpot') drawRocket(700, RY + 392, .36, now, .3);
  if (kind === 'gamble' && data.result) drawPlate(700, RY + 392, 82, now, data.result.rune, data.result.fate === 'etch' ? 'etched' : 'burned', 1);
  sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 100, 260, 70, nextScene); }

function drawScreen(now) {
  hits = []; const sh = shakeAmp > 0 && motionOK() ? shakeAmp * Math.exp(-(now - shakeAt) / 180) : 0; sg.save(); if (sh > .3) sg.translate((Math.random() - .5) * sh * 2, (Math.random() - .5) * sh * 2);
  sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState();
  text(sg, height.value ? height.value.toLocaleString('en-GB') : '—', 208, 102, 46, '#ffe2ad', 'Courier New', 'center', '900');
  text(sg, height.value ? (height.stale ? 'LAST KNOWN · STALE' : 'BITCOIN · LIVE') : 'UNAVAILABLE', 208, 148, 15, height.stale ? '#8a6a55' : '#d9a07a');
  if (height.value) text(sg, `RUNES SINCE BLOCK ${RUNES_BLOCK.toLocaleString('en-GB')}`, 208, 168, 12, '#8a6a55');
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, '#9a8a84');
  text(sg, fmt(hs.pot), 1192, 98, 40, '#ffe2ad', 'Arial', 'center', '300'); text(sg, `${hs.period.replace('-W', ' · WEEK ')}  ·  1% OF PAID BETS`, 1192, 136, 14, '#d9a07a');
  text(sg, linkedCount.ok ? (linkedCount.value ? `≈ ${fmt(hs.pot / linkedCount.value)} PER LINKED WALLET${linkedCount.test ? ' (TEST)' : ''}` : `NO LINKED WALLETS YET${linkedCount.test ? ' (TEST)' : ''}`) : 'SHARE PER LINKED WALLET: COUNT UNKNOWN', 1192, 162, 13, '#8a6a55');
  if (lab) { round(sg, 18, 818, 300, 30, 8, '#d6454599'); text(sg, 'LAB · TEST BALANCE · NOT REAL LAYR', 168, 834, 13, '#fff1d0', 'Arial', 'center', '900'); }
  let msg, msgColor = '#ffc56b';
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawMoonPlay(now); drawSparks(now); sg.restore(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawAirdropPlay(f, now); else if (k === 'chain' && f) drawTabletPlay(f, now); else if (k === 'gamble' && scene.data.result) drawEtchBurnPlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'ETCH OR BURN? CALL THE PLATE' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `THE AIRDROP · OPEN ${f ? 3 - f.picks.length : 0} MORE · TAP A CRATE`) : scene.kind === 'chain' ? `FIRST HUNDRED · ${f ? f.frames[f.index].left : 0} RESPIN${f && f.frames[f.index].left === 1 ? '' : 'S'} LEFT` : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawSeasonPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction);
    msg = state.freeActive ? '' : spinning ? 'THE FORGE IS HOT…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol]} × ${w.count}  ·  +${fmt(w.amount)}` : state.gamble ? `WIN ${fmt(state.gamble)} · ETCH OR BURN?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'RUNES · SINCE BLOCK 840,000'; }
  if (msg) text(sg, msg, 700, 822, msg.length > 60 ? 21 : 25, msgColor);
  if (!(state.freeActive && !scene)) drawBlocks();
  text(sg, `${lab ? 'LAB' : 'LAYR'}  ${fmt(state.balance)}`, 68, 926, 26, '#f0d9b5', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 926, 26, '#f0d9b5'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 926, 26, '#ffc56b', 'Arial', 'right');
  drawSparks(now); sg.restore();
  screenTexture.needsUpdate = true; screenDirty = false;
}
function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
function particles(n = 35) { if (!motionOK()) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }

/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (!scene && !feature() && !state.free && state.balance < state.bet) { if (lab) { labTopUp(); return; } openAccount(); return; } primaryAction(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null, testStops = null;
// The generator handed to the engine for the next round: nothing in normal play, a scripted one inside a Bonus Lab run.
const roundRng = () => lab ? lab.nextRng() : undefined, gambleRng = parity => lab ? lab.gambleRng(parity) : undefined;
function spin() {
  if (spinning || $('modal').open || locked() || scene) return;
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  // Test hooks only: forced reel stops for the first five draws (see RunePit.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : roundRng();
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) { if (lab) labTopUp(); else openAccount(); } return; }
  // The result is committed to the shared account before anything moves. The Holder Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now(); crateRunes = [];
  if (p.free) sound('tick');
  status(p.free ? 'ETCHING SPIN · ALL WINS 2×' : 'THE FORGE IS HOT…');
  // Now, and only now, choose which tiles show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Rune tiles pay no cameo (runes are fungible). Runestone cameos are recorded when an Airdrop is collected (recordRunestoneCameos).
function recordRoundCameos() { return []; }
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; save(); update();
  if (season && r.round.free) { season.best = Math.max(season.best, r.total); carve(); }
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'TO THE MOON · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · ETCHINGS' : ''}` : (r.round.free ? 'ETCHING SPIN COMPLETE' : 'NO WIN THIS STRIKE · ETCH AGAIN');
  if (state.gamble) msg += ' · ETCH OR BURN?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Etching Season.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (season) season.retriggers++; toast(`More etchings! +${r.freeAward} spins.`); sfx('sting-free'); } else toast('Etching Season cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); setTimeout(() => startScene(q[0].kind, q[0].data || {}), 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(seasonOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once Etching Season has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-mint stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-MINT STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-mint.', `<p>Auto-mint etches at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-MINT again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), etch: () => callGamble('etch'), burn: () => callGamble('burn'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('ETCHING SEASON', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ⚒</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="etch">Etch</button><button class="bar-cta" data-act="burn">Burn</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Launch' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Open ${3 - f.picks.length} of 9 sealed crates`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Crate ${i + 1}${f.picks.includes(i) ? `, ${TIER[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 runes · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 carved`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ⚒'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'The forge decides…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickCrate(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'RUNE PIT') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
// What the data says about a rune's supply: never more. A premine is not the total supply, and a mint cap is not a current supply.
function supplyText(r) { if (!r || r.supply == null) return 'unverified'; let s = r.supply; if (r.premineOnly) s += ' at etching (mints may add more)'; if (r.mint && r.mint.cap) s += `; open mint: cap ${Number(r.mint.cap).toLocaleString('en-GB')} × ${r.mint.amountPerMint}, minted amount not confirmed`; return s; }
function openCollections() {
  const rows = reelRunes.map(s => { const r = runeOf(s); return `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(COLS[s].name)}${s === 'wild' ? ' (wild)' : s === 'bitcoin' ? ' (jackpot)' : ''}</td><td>${r ? esc(nTag(r)) + (r.confirmed ? '' : ' <small>number unverified</small>') : 'unverified'}</td><td>${r && r.symbol != null ? esc(r.symbol) : 'none on record'}</td><td>${esc(supplyText(r))}</td><td>${r && r.block != null ? r.block.toLocaleString('en-GB') : 'unverified'}</td><td>${r && r.txid ? `<code>${r.txid.slice(0, 8)}…</code>` : 'none on record'}</td></tr>`; }).join('');
  const other = [['scatter', 'Etching', `${pools.scatter.length} real etching transactions: name, block, txid prefix`], ['vault', 'Runestone', `${pools.vault.length} Runestone inscriptions, each with its inscription number`], ['chain', 'Rune number', `${pools.chain.length} runes from the first hundred (#${EARLY.length ? EARLY[0].n : '?'} to #${EARLY.length ? EARLY.at(-1).n : '?'}), each with number, symbol and name`]].map(([s, n, d]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${n}</td><td colspan="5">${esc(d)}</td></tr>`).join('');
  showModal('collections', 'The runes on the reels.', `<p>Every symbol is real Bitcoin material. Rune tiles are drawn from the rune's own on-chain data: its symbol, its spaced name and its number. Etching tiles show the transaction that created a rune. Runestones are inscriptions, shown with their inscription numbers. A field the data source could not confirm says <b>unverified</b>; nothing is filled in by guesswork. Runes are fungible, so a rune on a winning line pays no cameo; a Runestone inscription is one of a kind and does.</p>
  <table class="paytable"><thead><tr><th>REEL SYMBOL</th><th>RUNE</th><th>SYMBOL</th><th>SUPPLY (FROM THE DATA)</th><th>ETCHED AT BLOCK</th><th>ETCHING TX</th></tr></thead><tbody>${rows}${other}</tbody></table>
  <p class="fine">${hasLogo ? 'The DOG•GO•TO•THE•MOON tile uses the project\'s official logo file.' : 'The official DOG•GO•TO•THE•MOON logo is not bundled yet, so its tile is the name set in type on gold; it ships with the project\'s OK.'} A number marked ? was inferred from the etching order, not read from a Runes index. Art is chosen after each result is fixed, using a separate random draw, so which tile shows never changes your odds. Testnet build: shown pending each community's OK.</p><button class="outline" id="colHolders">Holder Pot ↗</button>`, 'THE RUNES');
  $('colHolders').onclick = openHolders;
}
function openHolders() {
  const h = holderState();
  showModal('holders', 'The Holder Pot.', `<p>1% of every paid bet on Rune Pit goes into this week's Holder Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(h.period)}</span><strong>${fmt(h.pot)}</strong></div><div><span>LAST WEEK${h.last ? ` · ${esc(h.last.period)}` : ''}</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div><div><span>CAMEOS RECORDED</span><strong>${fmt(h.cameos || 0)}</strong></div></div>
  <p><b>How it will pay.</b> Players link a Bitcoin address by signing a message from it. At the end of each week the pot is split with one share per linked wallet that holds any of the reel runes or any Runestone inscription at the snapshot. Rune tiles on winning lines pay no cameo, since runes are fungible. Runestone inscriptions are one of a kind: when Runestones trigger an Airdrop, their inscription numbers are recorded for a 1% cameo royalty.</p>
  <p class="fine">Version 1 shows the meters only. Address linking, the wallet count, snapshots and payouts need a server or contract and are not built yet, so the share per wallet shows as unknown rather than a guess. The pot meter is kept with this browser's LAYR session.</p><button class="outline" disabled>Link a Bitcoin address · coming soon</button>`, 'HOLDER REWARDS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The ledger: pays and rules.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. <b>UNCOMMON•GOODS</b> is wild: it replaces every paying symbol and has its own pays, but never replaces an Etching, a Runestone or a Rune number.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(NAMES[s])}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five DOG•GO•TO•THE•MOON on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>ETCHING SEASON</h3><p>3, 4 or 5 Etchings anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. Molten letters carve a new rune name into the pit wall as the spins play, and every win pays <b>2×</b>. More Etchings add 4 spins, up to 24 per feature. Your bet is locked for the feature. The Airdrop and First Hundred can trigger during it and pay at 1×.</p>
  <h3>THE AIRDROP</h3><p>3 or more Runestones anywhere drop nine sealed crates. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three; each crate reveals a real rune and its prize. The rune is decoration: the prize was fixed when the crates dropped. Tiers: Dust 1×, Ash 2×, Ember 3×, Coal 4×, Flame 5×, Magma 8×, Lava 10×, Eruption 15×.</p>
  <h3>FIRST HUNDRED</h3><p>5 or more Rune numbers start a hold-and-respin. Each locks as a real early rune carved into a stone tablet, worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new lock resets the count to 3. Fill all 15 to win the To the Moon jackpot as well.</p>
  <h3>TO THE MOON JACKPOT</h3><p>Five DOG•GO•TO•THE•MOON on the centre row (wilds don't count), or all 15 tablet cells filled, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>ETCH OR BURN</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call. The plate in the forge either etches or burns: call it. Right doubles the win; wrong burns that win only. It is an even bet.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Rune Pit runs on the same engine as Block Fortune, Forever Twins and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no art can ever change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, Etching scatter pays 1.5%, Etching Season 8.5%, The Airdrop 11.9%, First Hundred 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. Etching Season and The Airdrop each arrive about 1 in 140 spins, First Hundred about 1 in 290, the To the Moon jackpot about 1 in 113,000. Etch or Burn is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The runes on the reels ↗</button> <button class="outline" id="rulesHolders">Holder Pot ↗</button>`, 'THE LEDGER');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['Etching Season', 'Three Etchings anywhere pay a scatter prize and award 8 free spins. Molten letters carve rune names into the pit wall as you play. Every win is doubled, and more Etchings add 4 spins, up to 24 per feature.'], vault: ['The Airdrop', 'Three Runestones drop nine sealed crates. Open three: each reveals a real rune and a prize from 1× to 15× your total bet.'], chain: ['First Hundred', 'Five Rune numbers start a hold-and-respin. Real early runes lock onto a stone tablet with their values, any new lock resets your three respins, and filling all 15 wins the To the Moon jackpot.'], genesis: ['To the Moon Jackpot', 'A progressive meter for each bet level. Land five DOG•GO•TO•THE•MOON on the centre row, or fill the whole tablet, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'TO THE MOON').replace('CHAIN', 'FIRST HUNDRED').replace('VAULT', 'THE AIRDROP').replace('FREE SPINS', 'ETCHING SEASON').replace('RETRIGGER', 'MORE ETCHINGS');
function openHistory(){
 const rows = (list, tagLab) => list.map(h=>`<tr><td>${tagLab || h.lab ? '<b>LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Etching spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${(h.cameos||[]).slice(0,2).map(c=>esc(num(c.number))).join(', ')}</td></tr>`).join('');
 const head = '<thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th><th>RUNESTONES</th></tr></thead>';
 const body=`<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut)}</strong></div></div><p>${lab ? 'These are LAB rounds on the lab balance. They are not part of your real history.' : 'Latest 50 rounds. All amounts use the shared LAYR account. Runestone inscriptions that triggered an Airdrop are recorded with the round.'}</p><table class="paytable">${head}<tbody>${rows(state.history)}</tbody></table>${!lab && labStore.history && labStore.history.length ? `<h3>LAB RUNS (not real LAYR, not counted above)</h3><table class="paytable">${head}<tbody>${rows(labStore.history.slice(0, 20), true)}</tbody></table>` : ''}<button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history','The chronicle.',body,'CHRONICLE');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,currency:'LAYR',lab:!!lab,wagered:state.wagered,paidOut:state.paidOut,holder:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no sparks, shake or embers)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space spins, respins and collects. 1–9 open crates. M mutes. F is fullscreen.${LAB_OK ? ' L opens the Bonus Lab.' : ''}</p><button class="outline" id="setCols">The runes on the reels</button><button class="outline" id="setHolders">Holder Pot</button><button class="outline" id="setHistory">The chronicle</button>`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory;
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Rune Pit runs on the same engine as Block Fortune, Forever Twins and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which tiles to show, using a separate random draw, so no art can ever change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>Etching scatter pays</td><td>1.5%</td><td>with Etching Season</td></tr><tr><td>Etching Season (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>The Airdrop (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>First Hundred (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>To the Moon jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Etch or Burn is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win.</p>`, 'FAIR PLAY');
}

/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'ETCH', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['etch', 'ETCH', 'call etch', 'fb gold'], ['burn', 'BURN', 'call burn', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'ETCH/BURN?', 'gamble win', 'fb gold'], ['collect', 'COLLECT', 'take the prize', 'fb gold'],
  ['betDown', '−SATS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+SATS', 'bet up', 'fb'], ['max', 'MAX SATS', 'max bet', 'fb'], ['auto', 'AUTO-MINT', 'auto', 'fb'],
  ['pays', 'LEDGER', 'pays & rules', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'CHRONICLE', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), etch: () => callGamble('etch'), burn: () => callGamble('burn'), keep: () => keepWin(), gamble: () => openGamble(), collect: () => { const f = feature(); if (scene && f && E.featureDone(f)) collectScene(); }, betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => openLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 7).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(7).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free, f = feature();
  q('primary').querySelector('b').textContent = spinning ? 'ETCHING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('etch', gambleIntro); show('burn', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0); show('collect', !!(scene && scene.stage === 'play' && f && E.featureDone(f)));
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance); q('balance').querySelector('small').textContent = lab ? 'LAB balance' : 'LAYR balance';
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MINT';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); q('lab').setAttribute('aria-pressed', String(!!lab));
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
// The casino never sets PX_STANDALONE_TEST, so on the public casino RunePit.test is null.
const TEST_OK = (() => { try { const w = window.parent; return w.PX_STANDALONE_TEST === true || /^(localhost|127\.0\.0\.1|\[::1\])$|\.(localhost|test)$/.test(w.location.hostname); } catch (e) { return false; } })();
// The Bonus Lab is always on the standalone test page. In the casino it shows only with ?lab=1 in the room's address and only on the
// local (testnet) LAYR account: never for players on a production, on-chain account.
const LAB_OK = TEST_OK || (() => { try { return new URLSearchParams(window.parent.location.search).get('lab') === '1' && LAYR.onChainConnected === false; } catch (e) { return false; } })();
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

/* ---------- Bonus Lab: pick any bonus or special event and play it now, on a separate lab balance ---------- */
// A Lab run is a real engine round: BF.start(state, rng) with a SCRIPTED rng that picks the reel stops (and, for the pick and hold
// and respin, the wanted values). The engine is neither edited nor bypassed, so the Lab shows exactly what real play would. It runs on
// its own state object and balance; it never reaches the real LAYR account, the jackpot meters, the Holder Pot or the RTP statistics.
const LAB_KEY = 'xtrata.parallax.rune-pit.lab.v1';
const labStore = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem(LAB_KEY) || '{}') || {}; } catch (e) {} return Object.assign({ balance: 100000, history: [], item: 'free', bet: 100, mode: 'seeded', seed: '20261101', auto: true, last: null }, o); })();
function labPersist() { try { if (lab) { labStore.balance = state.balance; labStore.history = state.history.slice(0, 50); } localStorage.setItem(LAB_KEY, JSON.stringify(labStore)); } catch (e) {} }
const mulberry = seed => { let a = (typeof seed === 'number' ? seed : hashStr(String(seed))) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const windowOf = (c, s) => BF.windowAt(c, s);
const stopsWhere = (c, pred) => { const out = []; for (let s = 0; s < BF.strips[c].length; s++) if (pred(windowOf(c, s))) out.push(s); return out; };
const noBonus = w => !w.includes('scatter') && !w.includes('vault') && !w.includes('chain') && w[1] !== 'bitcoin';
const choose = (arr, prng) => arr[Math.floor(prng() * arr.length)];
const plain = prng => ({ stops: [0, 1, 2, 3, 4].map(c => choose(stopsWhere(c, noBonus), prng)) });
// A reel group where `reels` show the wanted symbol and every other reel shows nothing that could trigger a bonus.
const withSymbol = (reels, sym, prng) => ({ stops: [0, 1, 2, 3, 4].map(c => reels.includes(c) ? choose(stopsWhere(c, w => w.includes(sym) && !(sym !== 'scatter' && w.includes('scatter')) && !(sym !== 'vault' && w.includes('vault')) && !(sym !== 'chain' && w.includes('chain')) && w[1] !== 'bitcoin'), prng) : choose(stopsWhere(c, noBonus), prng)) });
const chainPlan = prng => ({ stops: [0, 1, 2, 3, 4].map(c => { const ok = stopsWhere(c, w => !w.includes('scatter') && !w.includes('vault') && w[1] !== 'bitcoin' && w.includes('chain')), best = Math.max(...ok.map(s => windowOf(c, s).filter(x => x === 'chain').length)); return choose(ok.filter(s => windowOf(c, s).filter(x => x === 'chain').length === best), prng); }) });
const jackpotPlan = prng => ({ stops: [0, 1, 2, 3, 4].map(c => choose(stopsWhere(c, w => w[1] === 'bitcoin' && !w.includes('scatter') && !w.includes('vault') && !w.includes('chain')), prng)) });
// A plain paid line win with no bonus, so the gamble is offered.
function winPlan(prng) { for (let t = 0; t < 3000; t++) { const p = plain(prng), g = p.stops.map((s, c) => windowOf(c, s)), ev = BF.evaluate(g, 100); if (ev.lineTotal > 0 && !ev.triggers.free && !ev.triggers.vault && !ev.triggers.chain && !ev.jackpot) return p; } return { stops: TEST_STOPS.win }; }
const SCATTER_REELS = { 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4] };
const AWARD_ORDER = [4, 8, 0, 6, 3, 7, 1, 5, 2]; // indices into the engine's prize list: 4, 15, 1, 8, 3, 10, 2, 5, 2 times the bet
const LAB_ITEMS = [
  { id: 'free', name: 'Etching Season', note: '3 Etchings: 8 free spins at 2×, names carved into the pit wall', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'free-retrigger', name: 'Etching Season with a retrigger', note: 'a second set of Etchings in spin 2 adds 4 spins', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p), plain(p), withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'pick', name: 'The Airdrop', note: '3 Runestones: nine crates, open three; the mix holds a big drop', plans: p => [withSymbol([0, 2, 4], 'vault', p)], awards: AWARD_ORDER },
  { id: 'hold', name: 'First Hundred', note: '5+ Rune numbers: locks land, the respin lamps reset', plans: p => [chainPlan(p)], lockOdds: .2 },
  { id: 'hold-full', name: 'First Hundred, full tablet', note: 'forced full-grid run: all 15 lock and win To the Moon too', plans: p => [chainPlan(p)], fullGrid: true },
  { id: 'jackpot', name: 'To the Moon (centre row)', note: 'five DOG•GO•TO•THE•MOON on the centre row', plans: p => [jackpotPlan(p)] },
  { id: 'gamble-win', name: 'Etch or Burn: a win', note: 'a plain win, then the call lands on a win', plans: p => [winPlan(p)], gamble: 'win' },
  { id: 'gamble-loss', name: 'Etch or Burn: a loss', note: 'a plain win, then the call lands on a loss', plans: p => [winPlan(p)], gamble: 'loss' },
  { id: 'scatter3', name: 'Scatter pays 3', note: '3 Etchings pay 2× the bet and start the season', plans: p => [withSymbol(SCATTER_REELS[3], 'scatter', p)] },
  { id: 'scatter4', name: 'Scatter pays 4', note: '4 Etchings pay 5× the bet and start the season', plans: p => [withSymbol(SCATTER_REELS[4], 'scatter', p)] },
  { id: 'scatter5', name: 'Scatter pays 5', note: '5 Etchings pay 10× the bet and start the season', plans: p => [withSymbol(SCATTER_REELS[5], 'scatter', p)] }
];
// The scripted generator for one round: the first five draws choose the reel stops, the rest follow the item's script, then the seeded generator.
function planRng(plan, prng, item) { let k = 0, a = 0; return n => {
  if (k < 5 && n === BF.strips[0].length) return plan.stops[k++];
  if (n === BF.CHAIN_ODDS) return item.fullGrid ? 0 : item.lockOdds ? (prng() < item.lockOdds ? 0 : 1) : Math.floor(prng() * n);
  if (n === BF.vaultPrizes.length && item.awards) return item.awards[a++ % 9];
  return Math.floor(prng() * n); }; }
function labTopUp() { if (!lab) { labStore.balance = 100000; labPersist(); return; } state.balance = 100000; labPersist(); toast('Lab balance reset to 100,000.'); update(); }
function labEnter() { if (lab) return; const saved = { state, E, faces: faces.map(c => c.slice()), linked: linkedCount }, s = BF.fresh();
  s.balance = labStore.balance > 1000 ? labStore.balance : 100000; s.history = (labStore.history || []).slice(0, 50); for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) s[k] = state[k]; s.holder = { period: weekId(), pot: 0, last: null, cameos: 0 };
  lab = { saved, run: null, queue: [], auto: !!labStore.auto, botAt: 0, nextRng() { const run = lab.run, prng = run ? run.prng : Math.random, plan = (run && run.plans[run.spinNo++]) || plain(prng); return planRng(plan, prng, run ? run.item : {}); },
    gambleRng(parity) { const run = lab.run, prng = run ? run.prng : Math.random, win = run && run.item.gamble ? run.item.gamble === 'win' : prng() < .5, odd = win ? parity === 'odd' : parity !== 'odd'; return n => n === 2 ? (odd ? 1 : 0) : Math.floor(prng() * n); } };
  state = s; E = BF; faces = state.grid.map(col => col.map(pickFace)); stopAuto(); status('BONUS LAB · TEST BALANCE'); update(); }
function labLeave() { if (!lab) return; labPersist(); const { saved } = lab; for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) saved.state[k] = state[k]; lab = null; state = saved.state; E = saved.E; faces = saved.faces; linkedCount = saved.linked; if (!sessionLock) LAYR.saveGame(state); lastResult = null; status('BACK TO THE REAL MACHINE'); update(); screenDirty = true; }
function labAbort() { if (!lab) return; clearTimeout(scheduleFree.t); scene = null; hideBar(); sceneQueue = []; jackpotMusic(false); spinning = false; animations = []; season = null; crateRunes = []; state.pending = null; state.features = []; state.free = 0; state.freeActive = false; state.gamble = 0; lab.queue = []; lab.run = null; labLeave(); }
const labBusy = () => !!(scene || spinning || feature() || state.free > 0 || state.freeActive || state.pending || sceneQueue.length);
function labRunItem(id, o = {}) { if (!LAB_OK) return false; const item = LAB_ITEMS.find(i => i.id === id); if (!item) throw Error('Unknown Lab item: ' + id);
  if (labBusy()) { toast('Finish the current spin or bonus first.'); return false; }
  labEnter(); const bet = o.bet || labStore.bet, mode = o.mode || labStore.mode, seed = mode === 'random' && o.seed == null ? String(crypto.getRandomValues(new Uint32Array(1))[0]) : String(o.seed != null ? o.seed : labStore.seed);
  if (state.balance < bet * 3) labTopUp(); if (o.auto != null) lab.auto = !!o.auto;
  const prng = mulberry(seed); lab.run = { item, bet, seed, prng, spinNo: 0, plans: item.plans(prng), gambled: false };
  state.bet = bet; state.freeBet = bet; state.gamble = 0; labStore.last = { id, bet, seed, mode }; labPersist(); closeModal(); sceneQueue = []; spin(); return true; }
function labRunAll(o = {}) { if (!LAB_OK) return false; if (!labRunItem(LAB_ITEMS[0].id, { ...o, auto: true })) return false; lab.queue = LAB_ITEMS.slice(1).map(i => ({ id: i.id, o: { ...o, auto: true } })); return true; }
function labReplay() { const l = labStore.last; if (!l) { toast('Nothing to replay yet.'); return false; } return labRunItem(l.id, { bet: l.bet, seed: l.seed, mode: 'seeded' }); }
// Hands-free: the Lab presses the buttons a player would, at a watchable pace.
function labBot(now) { const s = scene, since = now - s.t0, d = speed(); if (s.stage === 'trigger') return;
  if (s.stage === 'intro') { if (since > 1100 * d) { if (s.kind === 'gamble') callGamble('etch'); else primaryAction(); } return; }
  if (s.stage === 'play') { const f = feature();
    if (s.kind === 'vault' && f) { if (!E.featureDone(f)) { if (now - lab.botAt > 650 * d) { lab.botAt = now; pickCrate([1, 3, 5, 7, 0, 2, 4, 6, 8].find(i => !f.picks.includes(i))); } } else if (now - lab.botAt > 2000 * d) { lab.botAt = now; collectScene(); } }
    else if (s.kind === 'chain' && f) { if (now - lab.botAt > (E.featureDone(f) ? 1700 : 850) * d) { lab.botAt = now; featureAction(); } }
    else if (s.kind === 'jackpot') { if (since > ((motionOK() ? 7200 : 2400) * d + 900)) setStage('outro'); }
    else if (s.kind === 'gamble' && s.data.landed) { if (!s.data.landedAt) s.data.landedAt = now; else if (now - s.data.landedAt > 1500 * d) setStage('outro'); }
    return; }
  if (s.stage === 'outro' && since > 2500 * d) nextScene(); }
function labTick() { if (!lab || !pxEngineActive) return; const now = performance.now(), run = lab.run; if (spinning || $('modal').open) { lab.idleAt = 0; return; }
  // Between runs the Lab waits a moment, then hands the machine back (a queued run or a scene cancels the wait).
  if (!run && lab.next && now >= lab.nextAt && !labBusy()) { const n = lab.next; lab.next = null; labRunItem(n.id, n.o); return; }
  if (!run && !scene && !lab.next && !lab.queue.length && !feature() && !state.pending) { lab.idleAt = lab.idleAt || now; if (now - lab.idleAt > 1200) { labLeave(); return; } } else lab.idleAt = 0;
  if (!scene && run && run.item.gamble && state.gamble > 0 && !feature() && !state.free && !run.gambled) { run.gambled = true; openGamble(); return; }
  if (scene) { if (lab.auto) labBot(now); return; }
  if (run && run.spinNo > 0 && !feature() && !state.free && !state.freeActive && !state.pending && !sceneQueue.length && !(run.item.gamble && !run.gambled)) {
    labPersist(); const next = lab.queue.shift(); lab.run = null; if (next) { lab.next = next; lab.nextAt = now + 800; } } }
setInterval(labTick, 250);
function openLab() { if (!LAB_OK) return; const bal = lab ? state.balance : labStore.balance;
  showModal('lab', 'Bonus Lab.', `<p class="fine">Pick a bonus or special event, a bet and press Run: it plays at once through all four stages. Each run is a real engine round (the engine's own start with scripted reel stops; nothing is edited or bypassed) on a separate lab balance. Lab rounds are marked LAB in the chronicle and never touch your LAYR, the jackpot meters, the Holder Pot or the RTP figures.</p>
  <div class="stat-cards"><div><span>LAB BALANCE</span><strong>${fmt(bal)}</strong></div><div><span>LAST RUN</span><strong>${labStore.last ? esc(labStore.last.id) : '—'}</strong></div><div><span>LAST SEED</span><strong>${labStore.last ? esc(labStore.last.seed) : '—'}</strong></div></div>
  <h3>ITEM</h3><div class="lab-list">${LAB_ITEMS.map(i => `<button type="button" class="lab-item" data-lab-item="${i.id}" aria-pressed="${i.id === labStore.item}"><b>${esc(i.name)}</b><small>${esc(i.note)}</small></button>`).join('')}</div>
  <h3>BET</h3><div class="ab">${bets.map(b => `<button type="button" class="outline" data-lab-bet="${b}" aria-pressed="${b === labStore.bet}">${b}</button>`).join('')}</div>
  <h3>RANDOMNESS</h3><div class="ab"><button type="button" class="outline" data-lab-mode="seeded" aria-pressed="${labStore.mode === 'seeded'}">Seeded</button><button type="button" class="outline" data-lab-mode="random" aria-pressed="${labStore.mode === 'random'}">Random</button></div>
  <label class="setting">Seed (a seeded run repeats exactly)<input type="text" id="labSeed" value="${esc(labStore.seed)}" maxlength="12" style="width:9em"></label>
  <label class="setting">Hands-free (the Lab presses the buttons)<input type="checkbox" id="labAuto" ${labStore.auto ? 'checked' : ''}></label>
  <div class="ab"><button type="button" class="cta" id="labRunBtn">Run</button><button type="button" class="outline" id="labReplayBtn" ${labStore.last ? '' : 'disabled'}>Replay last</button><button type="button" class="outline" id="labAllBtn">Run all</button></div>
  <div class="ab"><button type="button" class="outline" id="labTopBtn">Reset lab balance</button><button type="button" class="outline" id="labExitBtn">Leave the Lab</button></div>`, 'BONUS LAB');
  const press = (sel, attr, val) => document.querySelectorAll(sel).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === String(val))));
  document.querySelectorAll('[data-lab-item]').forEach(b => b.onclick = () => { labStore.item = b.dataset.labItem; press('[data-lab-item]', 'data-lab-item', labStore.item); labPersist(); });
  document.querySelectorAll('[data-lab-bet]').forEach(b => b.onclick = () => { labStore.bet = Number(b.dataset.labBet); press('[data-lab-bet]', 'data-lab-bet', labStore.bet); labPersist(); });
  document.querySelectorAll('[data-lab-mode]').forEach(b => b.onclick = () => { labStore.mode = b.dataset.labMode; press('[data-lab-mode]', 'data-lab-mode', labStore.mode); labPersist(); });
  $('labSeed').oninput = e => { labStore.seed = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 12) || '1'; labPersist(); }; $('labAuto').onchange = e => { labStore.auto = e.target.checked; if (lab) lab.auto = labStore.auto; labPersist(); };
  $('labRunBtn').onclick = () => labRunItem(labStore.item, { auto: labStore.auto }); $('labReplayBtn').onclick = () => labReplay(); $('labAllBtn').onclick = () => labRunAll({ bet: labStore.bet, mode: labStore.mode, seed: labStore.seed });
  $('labTopBtn').onclick = () => { labTopUp(); openLab(); }; $('labExitBtn').onclick = () => { if (lab) labAbort(); closeModal(); }; }
const labApi = LAB_OK ? Object.freeze({ items: () => LAB_ITEMS.map(i => ({ id: i.id, name: i.name, note: i.note })), run: (id, o) => labRunItem(id, o), runAll: o => labRunAll(o), replay: () => labReplay(), abort: () => labAbort(), active: () => !!lab, auto: on => { if (lab) lab.auto = !!on; labStore.auto = !!on; }, state: () => lab ? JSON.parse(JSON.stringify(state)) : null, store: () => JSON.parse(JSON.stringify(labStore)), open: () => openLab() }) : null;

const testApi = TEST_OK ? Object.freeze({
  kinds: Object.keys(TEST_STOPS),
  force(kind) { if (!TEST_STOPS[kind]) throw Error('Unknown test feature: ' + kind); testStops = TEST_STOPS[kind].slice(); return true; },
  // Force, then spin straight away (the gamble needs a paid win first, so 'gamble' forces a plain win and opens the call).
  play(kind) { if (scene || spinning || feature() || state.free) return false; if (kind === 'gamble') { testStops = TEST_STOPS.win.slice(); spin(); const t = setInterval(() => { if (!spinning) { clearInterval(t); if (state.gamble) openGamble(); } }, 100); return true; } this.force(kind); spin(); return true; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); linkedCount = { ok: true, value: LINKED_TEST[mode], test: true }; screenDirty = true; update(); return linkedCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on)
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops on the test LAYR balance; nothing here exists on the public casino. The Bonus Lab runs on its own balance.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">Etching Season</button><button class="cta" data-t="vault">The Airdrop</button><button class="cta" data-t="chain">First Hundred</button><button class="cta" data-t="jackpot">To the Moon</button><button class="cta" data-t="gamble">Etch or Burn</button></div>
  <h3>BONUS LAB</h3><div class="ab"><button class="outline" id="tLab">Open the Bonus Lab (L)</button></div>
  <h3>LINKED WALLETS</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div><p class="fine">Runes are fungible and Ordinals are already permanent, so no symbol here is ever NOT YET FOREVER; this switches the Holder Pot's linked-wallet count (data none, some or all) instead.</p>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  $('tLab').onclick = () => openLab();
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.linkedHolders(b.dataset.h); toast(`Linked wallets: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked);
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Etching Season 1 in ${r.freeEvery.toFixed(0)} · Airdrop 1 in ${r.pickEvery.toFixed(0)} · First Hundred 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return; const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickCrate(Number(e.key) - 1);
  else if (k === 'm') $('sound').click(); else if (k === 'f') requestFullscreen(!fsOn); else if (k === 's' && canSkip()) skipScene(); else if (k === 'l' && LAB_OK) openLab();
  else if (k === 'e' && scene?.kind === 'gamble') callGamble('etch'); else if (k === 'b' && scene?.kind === 'gamble') callGamble('burn');
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-MINT STOPPED'); } } updateFsBar(); });
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
  if (sparks.length || (shakeAmp && now - shakeAt < 900)) screenDirty = true;
  if (state.freeActive && motionOK()) screenDirty = true; // the pit's embers and the carving wall
  if (state.freeActive && !spinning && !scene && now - lastTick > 2400) { lastTick = now; if (state.free) sound('tick'); }
  const ps = Object.values(pools).reduce((a, p) => a + p.length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw > 32)) { drawScreen(now); lastDraw = now; perf.drawn++; if (fsOn && perf.drawn % 10 === 0) updateFsBar(); }
}

/* ---------- Boot ---------- */
function resume() {
  if (lab) labAbort(); state=LAYR.openGame(GAME_ID,E); holderState();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startScene(feature().type, {}, 'intro'); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { renderBar(); status(`${state.free} SAVED ETCHING SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(seasonOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; there is nothing to top up live (runes are drawn from data), so the cabinet is ready as soon as the frame loads.
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.RunePit = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), height: () => ({ ...height }), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
  soundLog: () => soundLog.map(e => ({ ...e })), perf: () => ({ ...perf }), screen: () => screen,
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, lab: !!lab })), rules: { lines: E_REAL.lines, pays: E_REAL.pays, strips: E_REAL.stripCodes },
  test: testApi, lab: labApi });
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
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();else if(action==='lab')openLab();
  else if(clicks[action])document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // show: the scene on screen now, so a host can light the cabinet (topper speed, floor glow) during bonuses.
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());readHeight();clearInterval(heightTimer);heightTimer=setInterval(readHeight,120000);if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab)labAbort();stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;clearInterval(heightTimer);if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
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
  // The Bonus Lab is offered to the host only when the game allows it (always on the test page; in the casino only with ?lab=1 on testnet).
  labAvailable:()=>LAB_OK,
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'ETCH',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!lab,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();

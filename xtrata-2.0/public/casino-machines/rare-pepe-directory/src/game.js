/* Rare Pepe Directory — a ParallaX Casino machine. Every symbol is real Bitcoin-culture material: Counterparty asset names from
   the Rare Pepe Directory (1,774 cards in 36 series) and the Fake Rares, the Bitcoin Pepes twins on Stacks (inscribed through
   Xtrata), and the Ordinal Pepe. The maths is the shared Block Fortune v2 engine (BF) unchanged: every outcome is fixed by BF
   before any art is chosen, and art is picked with Math.random, never the engine's generator, so loaded art can never change a
   result. The casino owns all 3D rendering and cameras; this frame only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
let GAME_ID='rare-pepe-directory', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
const E0 = E; // the Bonus Lab swaps E for the raw engine and back; nothing else ever does
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, ACCENT = '#3fb950', CREAM = '#f4ecd2', GOLD = '#f2c14e';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'Fake Rare', lemon: 'Rare Pepe (Series 26–36)', chip: 'Rare Pepe (Series 13–25)', block: 'Rare Pepe (Series 2–12)', artifact: 'Bitcoin Pepe', bitcoin: 'Series 1 Rare Pepe', wild: 'Ordinal Pepe', scatter: 'PEPECASH', vault: 'Rare Pepe Wallet', chain: 'Directory card' };
const SHORT = { cherry: 'FAKE RARE', lemon: 'SERIES 26–36', chip: 'SERIES 13–25', block: 'SERIES 2–12', artifact: 'BITCOIN PEPE', bitcoin: 'SERIES 1', wild: 'ORDINAL PEPE', scatter: 'PEPECASH', vault: 'WALLET', chain: 'DIRECTORY' };
// Series ranges are the ones in the machine treatment; the card edge colour tells the group at a glance.
const COLS = {
  cherry:   { key: 'fake-rares',       name: 'Fake Rares',                color: '#b07cff', kind: 'fake' },
  lemon:    { key: 'rare-pepe-26-36',  name: 'Rare Pepe, Series 26 to 36', color: '#4c9bff', kind: 'rare', lo: 26, hi: 36 },
  chip:     { key: 'rare-pepe-13-25',  name: 'Rare Pepe, Series 13 to 25', color: '#3fb950', kind: 'rare', lo: 13, hi: 25 },
  block:    { key: 'rare-pepe-2-12',   name: 'Rare Pepe, Series 2 to 12',  color: '#ff5a5f', kind: 'rare', lo: 2, hi: 12 },
  artifact: { key: 'bitcoin-pepes',    name: 'Bitcoin Pepes',             color: '#2f9e44', kind: 'twin' },
  bitcoin:  { key: 'rare-pepe-1',      name: 'Rare Pepe, Series 1',        color: GOLD,      kind: 'rare', lo: 1, hi: 1, foil: true },
  wild:     { key: 'ordinal-pepe',     name: 'Ordinal Pepe',              color: CREAM,     kind: 'twin' },
  scatter:  { key: 'pepecash',         name: 'PEPECASH',                  color: ACCENT,    kind: 'logo' },
  vault:    { key: 'rare-pepe-wallet', name: 'Rare Pepe Wallet',          color: '#d8f5d9', kind: 'logo' },
  chain:    { key: 'directory',        name: 'Directory card',            color: GOLD,      kind: 'rare', lo: 1, hi: 36 }
};
const ART = window.RPD_ART || { pepes: [], cards: {}, logos: {} }, MANIFEST = window.RPD_MANIFEST || { rare: [], fake: [] };
const RARE = MANIFEST.rare || [], FAKE = MANIFEST.fake || [], SERIES_SIZE = 50;
// Real Counterparty asset names in Rare Pepe Directory order: 50 cards a series (Series 36 holds the last 24).
const cardOf = i => ({ name: RARE[i], series: Math.floor(i / SERIES_SIZE) + 1, card: i % SERIES_SIZE + 1, idx: i });
const rangeOf = (lo, hi) => [(lo - 1) * SERIES_SIZE, Math.min(RARE.length, hi * SERIES_SIZE)];
const TEST_OK = (() => { try { const w = window.parent; return w.PX_STANDALONE_TEST === true || /^(localhost|127\.0\.0\.1|\[::1\])$|\.(localhost|test)$/.test(w.location.hostname); } catch (e) { return false; } })();
// The Bonus Lab is always there on the standalone test page; in the casino only behind the developer flag ?lab=1.
const LAB_OK = TEST_OK || (() => { try { return /[?&]lab=1(&|$)/.test(window.parent.location.search); } catch (e) { return false; } })();
let sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
// Bonus Lab: a practice sandbox with its own state and the raw engine. While lab.on is set nothing here touches the LAYR account,
// the saved game, the jackpot meters, the Holder Pot or the RTP statistics (see the Bonus Lab section).
const lab = { on: false, real: null, last: null, script: [], auto: null, queue: [], seed: 20261101, bank: 100000 };
function save(){if(!sessionLock&&!lab.on)LAYR.saveGame(state);}
let scene = null, spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, chainFlash = 0, animations = [], jackpotShow = null;
// The room animates the cabinet's lever and spin button from these (see PX_CASINO_ENGINE.mechanics).
const lever = { name: 'px-lever' }; let leverStart = 0; const SPIN_Z = .19, spinPhysical = { position: { z: SPIN_Z } };
const feature = () => E.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(lab.on)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}


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
function holderAdd(bet) { if (lab.on) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): link a Bitcoin address by signing a message from it (Leather and Xverse hold Bitcoin and Stacks accounts).
// TODO(holder-layer-v2): count the linked twins from the reel collections at the period's snapshot (checked read: a failed
//   read is "unknown", never "none"), split the pot per inscription, pay the cameo royalty, holder spins and the Forever Fund.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  linkBitcoinAddress: async () => ({ ok: false, value: null, reason: 'TODO: Bitcoin address linking (signed message) is not built yet.' }),
  countLinkedTwins: async () => ({ ok: false, value: null, reason: 'TODO: needs the holder-link service; unknown, not zero.' }),
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO: weekly snapshot and payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO: claims need an on-chain LAYR token.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO: weekly holder spins need linked holders.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO: Forever Fund refunds apply to Stacks twins.' })
});
let linkedCount = { ok: false, value: null };
HolderRewards.countLinkedTwins().then(r => { linkedCount = r; screenDirty = true; }).catch(() => {});

/* ---------- Bitcoin block height, read live (shown on the screen header) ---------- */
const HEIGHT_KEY = 'xtrata.parallax.rare-pepe-directory.height';
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
  $('winLabel').textContent = showFree ? 'RAIN WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} RAIN SPINS · 2×` : lab.on ? 'LAB LAYR' : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'TRADING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TRADE';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  document.body.classList.toggle('lab-on', !!lab.on); updateFsBar(); screenDirty = true;
}

/* ---------- Procedural audio: reel clacks, coin pours, block ticks. No files. ---------- */
let ac = null, master = null, noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * .5; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + d); o.start(t); o.stop(t + d + .02); return o; }
function noise(d = .05, freq = 2400, q = 2, v = .25, delay = 0) { if (!ac || state.muted || !noiseBuf) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t, Math.random() * .4); s.stop(t + d + .02); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
function coins(n, at = 0) { for (let k = 0; k < n; k++) { const t = at + k * (.045 + Math.random() * .05); tone(2600 + Math.random() * 1400, .09, 'sine', .05, t); noise(.03, 6000, 4, .08, t); } }

// Chiptune voice: a short square or triangle note, as on a 2016 arcade board.
const bleep = (f, d = .1, v = .07, delay = 0, type = 'square') => tone(f, d, type, v, delay);
const arp = (notes, step = .06, d = .09, v = .06, type = 'square', at = 0) => notes.forEach((n, k) => bleep(n, d, v, at + k * step, type));
// "RARE!": a small crowd chanting one long vowel (ah opening to eh), made from detuned sawtooth voices through two formant filters.
function crowdRare(at = 0, loud = 1) {
  if (!ac || state.muted) return; const t0 = ac.currentTime + at;
  for (let k = 0; k < 7; k++) {
    const o = ac.createOscillator(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), g = ac.createGain(), base = 140 + Math.random() * 120, d = Math.random() * .06;
    o.type = 'sawtooth'; o.frequency.setValueAtTime(base, t0 + d); o.frequency.linearRampToValueAtTime(base * 1.1, t0 + d + .6);
    for (const f of [f1, f2]) { f.type = 'bandpass'; f.Q.value = 6; }
    f1.frequency.setValueAtTime(820, t0 + d); f1.frequency.linearRampToValueAtTime(560, t0 + d + .6);
    f2.frequency.setValueAtTime(1180, t0 + d); f2.frequency.linearRampToValueAtTime(1950, t0 + d + .6);
    o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(master);
    g.gain.setValueAtTime(0, t0 + d); g.gain.linearRampToValueAtTime(.045 * loud, t0 + d + .07); g.gain.setValueAtTime(.045 * loud, t0 + d + .38); g.gain.exponentialRampToValueAtTime(.001, t0 + d + .75);
    o.start(t0 + d); o.stop(t0 + d + .8);
  }
  noise(.7, 1500, .6, .06 * loud, at); noise(.18, 4200, 2, .05 * loud, at + .02); // the roar and the first clap
}
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.22, 3200, .8, .16); noise(.16, 2200, 1.2, .1, .06); arp([196, 262, 330], .05, .07, .05, 'square'); }
  if (kind === 'stop') return [noise(.03, 5200 + i * 160, 5, .34, at), noise(.06, 2100 + i * 90, 2, .2, at + .012), tone(240 + i * 26, .05, 'square', .04, at), tone(1400, .02, 'square', .02, at)].filter(Boolean); // the card-flip snap
  if (kind === 'win') { arp([523.25, 659.25, 783.99, 1046.5], .055, .08, .06); coins(6, .25); }
  if (kind === 'big') { arp([392, 523.25, 659.25, 783.99, 1046.5, 1318.5], .06, .12, .06); arp([196, 261.63, 329.63, 392], .12, .3, .05, 'triangle'); coins(26, .2); crowdRare(.15, 1); }
  if (kind === 'bonus') arp([392, 523.25, 659.25, 783.99, 1046.5], .1, .22, .07, 'square');
  if (kind === 'antic') { noise(1.5, 700, 1, .05); arp([330, 349.23, 370, 392, 415.3, 440], .22, .2, .03, 'triangle'); }
  if (kind === 'tick') { noise(.025, 3600, 6, .1); bleep(1760, .04, .03); }
  if (kind === 'lock') { noise(.08, 1100, 2, .3, i * .08); bleep(330 + i * 40, .16, .05, i * .08); coins(3, i * .08 + .05); }
  if (kind === 'respin') { noise(.14, 2800, 1, .14); arp([196, 247, 294], .05, .08, .05); }
  if (kind === 'pick') { arp([988 + i * 60, 1318.5 + i * 60], .07, .2, .08, 'square'); coins(4, .08); }
  if (kind === 'click') noise(.02, 3200, 4, .1);
  if (kind === 'lose') arp([294, 247, 196, 147], .1, .18, .06, 'triangle');
  if (kind === 'flip') { noise(.05, 4800, 3, .22); bleep(1400, .08, .04, .03); }
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

/* ---------- Reel tiles: real Counterparty cards, the Bitcoin Pepes twins, PEPECASH and the Wallet ---------- */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px, which keeps ~150 tiles within phone canvas-memory limits
function fitSize(g, s, maxW, size, min = 9, weight = '900', font = 'Arial') { g.font = `${weight} ${size}px ${font}`; while (g.measureText(s).width > maxW && size > min) { size--; g.font = `${weight} ${size}px ${font}`; } return size; }
function drawInfinity(g, cx, cy, w, color, lw = 3.4) { const h = w * .26; g.save(); g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx, cy); g.bezierCurveTo(cx + w * .1, cy - h * 1.5, cx + w * .5, cy - h * 1.3, cx + w * .5, cy); g.bezierCurveTo(cx + w * .5, cy + h * 1.3, cx + w * .1, cy + h * 1.5, cx, cy); g.bezierCurveTo(cx - w * .1, cy - h * 1.5, cx - w * .5, cy - h * 1.3, cx - w * .5, cy); g.bezierCurveTo(cx - w * .5, cy + h * 1.3, cx - w * .1, cy + h * 1.5, cx, cy); g.stroke(); g.restore(); }
// The text-only art window shown until a card's own picture is bundled: the asset name set big on a green card face.
function cardFace(g, x, y, w, h, info, gold) {
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, 6); g.clip();
  g.fillStyle = lin(g, x, y, x + w, y + h, gold ? ['#2a2108', '#6b520f', '#2a2108'] : ['#0d2a15', '#1f6a34', '#0d2a15']); g.fillRect(x, y, w, h);
  g.fillStyle = gold ? '#ffe9a022' : '#8be28f1c'; for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) if ((r + c + hashStr(info.name)) % 2 === 0) g.fillRect(x + c * 17, y + r * 17, 17, 17); // 8-bit checker, no drawing of a character
  const name = info.name, lines = []; for (let i = 0; i < name.length; i += name.length > 14 ? 8 : 7) lines.push(name.slice(i, i + (name.length > 14 ? 8 : 7)));
  const longest = lines.reduce((a, b) => a.length > b.length ? a : b, ''), size = Math.min(26, (w - 14) / (longest.length * .62)), top = y + h / 2 - ((lines.length - 1) * size * .55) - 4;
  g.shadowColor = '#000'; g.shadowBlur = 4; lines.forEach((l, k) => text(g, l, x + w / 2, top + k * size * 1.1, size, gold ? '#fff1b8' : '#dff7df', 'Courier New', 'center', '900')); g.shadowBlur = 0;
  text(g, 'COUNTERPARTY', x + w / 2, y + h - 10, 9, gold ? '#e9cf7a' : '#7fcf8a', 'Arial', 'center', '800');
  g.restore();
}
// A Rare Pepe or Fake Rare as a card. The edge colour is the series group (red 2-12, green 13-25, blue 26-36, gold foil for Series 1).
function cardTile(sym, info, img) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], gold = !!col.foil, fake = col.kind === 'fake', dir = sym === 'chain';
  g.scale(TILE / 240, TILE / 240);
  const x = 42, y = 5, w = 156, h = 230, edge = gold ? lin(g, x, y, x + w, y + h, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']) : dir ? lin(g, x, y, x + w, y + h, ['#f4ecd2', '#c9b46a', '#f4ecd2']) : col.color;
  g.shadowColor = gold || dir ? GOLD : col.color; g.shadowBlur = gold ? 16 : 7; round(g, x, y, w, h, 12, '#0a140c'); g.shadowBlur = 0; round(g, x, y, w, h, 12, null, edge, gold ? 9 : 7);
  round(g, x + 11, y + 11, w - 22, 22, 5, gold ? '#3a2d08' : dir ? '#2a2308' : '#0f2a17');
  text(g, fake ? 'FAKE RARE' : dir ? `DIRECTORY · S${info.series}` : `SERIES ${info.series} · CARD ${info.card}`, x + w / 2, y + 22.5, fake ? 14 : dir ? 12 : 12.5, gold || dir ? '#ffe9a0' : '#cfeacf', 'Arial', 'center', '900');
  if (dir) text(g, `CARD ${info.card}`, x + w / 2, y + 44, 10, '#c9b46a', 'Arial', 'center', '800');
  const ay = y + (dir ? 52 : 40), ah = h - (dir ? 52 : 40) - 44, ax = x + 12, aw = w - 24;
  if (img) { g.save(); g.beginPath(); g.roundRect(ax, ay, aw, ah, 6); g.clip(); g.fillStyle = '#0b140d'; g.fillRect(ax, ay, aw, ah); const k = Math.max(aw / img.width, ah / img.height); g.drawImage(img, ax + (aw - img.width * k) / 2, ay + (ah - img.height * k) / 2, img.width * k, img.height * k); g.restore(); }
  else cardFace(g, ax, ay, aw, ah, info, gold);
  round(g, x + 11, y + h - 38, w - 22, 28, 6, gold ? '#f2c14e' : '#0f2a17');
  const label = info.name, ls = fitSize(g, label, w - 36, 17, 8); text(g, label, x + w / 2, y + h - 23.5, ls, gold ? '#2a1d00' : '#eaf6e6', 'Arial', 'center', '900');
  if (gold) { g.save(); g.beginPath(); g.roundRect(x, y, w, h, 12); g.clip(); g.fillStyle = '#ffffff2a'; g.beginPath(); g.moveTo(x - 20, y + h * .64); g.lineTo(x + w * .5, y - 10); g.lineTo(x + w * .72, y - 10); g.lineTo(x - 20, y + h * .96); g.closePath(); g.fill(); g.restore(); }
  if (fake) { g.save(); g.beginPath(); g.roundRect(x, y, w, h, 12); g.clip(); g.translate(x + 26, y + 70); g.rotate(-Math.PI / 4); g.fillStyle = '#b07cff'; g.fillRect(-50, -9, 100, 18); text(g, 'FAKE', 0, 1, 12, '#17082b', 'Arial', 'center', '900'); g.restore(); }
  return c;
}
// Desaturate a pixel image onto a small canvas (manual, because ctx.filter is missing in Safari).
function greyscale(img, w, h, smooth) { const t = canvas(w, h), tg = t.getContext('2d'); tg.imageSmoothingEnabled = smooth; const fit = Math.min(w / img.width, h / img.height), k = !smooth && fit >= 1 ? Math.floor(fit) : fit; tg.drawImage(img, (w - img.width * k) / 2, (h - img.height * k) / 2, img.width * k, img.height * k);
  try { const d = tg.getImageData(0, 0, w, h), p = d.data; for (let i = 0; i < p.length; i += 4) { const v = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = v * .82 + 18; } tg.putImageData(d, 0, 0); } catch (e) { tg.fillStyle = '#808080cc'; tg.globalCompositeOperation = 'saturation'; tg.fillRect(0, 0, w, h); }
  return t; }
// The "NOT YET FOREVER" stamp for a Stacks NFT with no permanent twin.
function notYetStamp(g, cx, cy, size = 1) { g.save(); g.translate(cx, cy); g.rotate(-.32); const w = 188 * size, h = 40 * size; g.fillStyle = '#2a0c0ce8'; g.fillRect(-w / 2, -h / 2, w, h); g.lineWidth = 3; g.strokeStyle = '#ff5a5f'; g.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); text(g, 'NOT YET FOREVER', 0, 1, 20 * size, '#ff7a7e', 'Arial', 'center', '900'); g.restore(); }
// A twin (Bitcoin Pepe) as a framed pixel tile: full colour with token number and the ∞ badge when forevered; grey with the stamp when not.
function twinTile(item, sym = 'artifact') {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], wild = sym === 'wild', forever = item.forever !== false; g.scale(TILE / 240, TILE / 240);
  const edge = forever ? col.color : '#7d8a80';
  g.shadowColor = forever ? col.color : '#000'; g.shadowBlur = forever ? 14 : 4; round(g, 12, 6, 216, 216, 14, '#0a140c'); g.shadowBlur = 0; round(g, 12, 6, 216, 216, 14, null, edge, wild ? 7 : 4);
  g.save(); g.beginPath(); g.roundRect(24, 18, 192, 158, 8); g.clip(); g.fillStyle = '#0d1a10'; g.fillRect(24, 18, 192, 158);
  if (item.img) { if (forever) { const w = item.img.naturalWidth || item.img.width, h = item.img.naturalHeight || item.img.height, fit = Math.min(192 / w, 158 / h), k = fit >= 1 ? Math.floor(fit) : fit; g.imageSmoothingEnabled = !(w <= 200); g.drawImage(item.img, 24 + (192 - w * k) / 2, 18 + (158 - h * k) / 2, w * k, h * k); } else g.drawImage(greyscale(item.img, 192, 158, (item.img.naturalWidth || item.img.width) > 200), 24, 18); }
  else { // Ordinal Pepe until its picture is bundled: the name set in type, never a drawing
    g.fillStyle = forever ? lin(g, 24, 18, 216, 176, ['#10301a', '#235a35', '#10301a']) : '#2a2f2b'; g.fillRect(24, 18, 192, 158);
    text(g, 'ORDINAL', 120, 78, 34, forever ? CREAM : '#9aa59d', 'Arial', 'center', '900'); text(g, 'PEPE', 120, 118, 44, forever ? '#8be28f' : '#8a948c', 'Arial', 'center', '900'); text(g, 'ALL 100 SHARE ONE GIF', 120, 156, 12, forever ? '#bfe9c0' : '#7a847c', 'Arial', 'center', '800'); }
  g.restore();
  round(g, 24, 180, 192, 32, 7, wild ? (forever ? CREAM : '#3a403b') : '#0a140c'); text(g, wild ? 'WILD · ORDINAL PEPE' : `#${item.id}`, 120, 196, wild ? 14 : 20, wild && forever ? '#0b2a14' : '#e6f5e6', 'Arial', 'center', '900');
  if (forever) { g.fillStyle = '#05100a'; g.beginPath(); g.arc(204, 32, 17, 0, 7); g.fill(); drawInfinity(g, 204, 32, 28, '#8be28f'); } else notYetStamp(g, 120, 96);
  return c;
}
// PEPECASH and the Rare Pepe Wallet: their own logo file if one has been bundled, otherwise the name set in type in the project's colour.
function logoTile(sym, img) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  if (sym === 'scatter') { g.shadowColor = ACCENT; g.shadowBlur = 16; g.beginPath(); g.arc(120, 112, 98, 0, 7); g.fillStyle = lin(g, 30, 14, 210, 210, ['#7ee787', '#2f9e44', '#0f5a28']); g.fill(); g.shadowBlur = 0; g.lineWidth = 6; g.strokeStyle = '#d8f5d9'; g.beginPath(); g.arc(120, 112, 84, 0, 7); g.stroke();
    if (img) { g.save(); g.beginPath(); g.arc(120, 112, 78, 0, 7); g.clip(); const k = Math.max(156 / img.width, 156 / img.height); g.drawImage(img, 120 - img.width * k / 2, 112 - img.height * k / 2, img.width * k, img.height * k); g.restore(); }
    else { text(g, 'PEPE', 120, 84, 44, '#04140a', 'Arial', 'center', '900'); text(g, 'CASH', 120, 134, 52, '#04140a', 'Arial', 'center', '900'); text(g, 'ON BITCOIN', 120, 166, 13, '#073b1a', 'Arial', 'center', '800'); } }
  else { g.shadowColor = '#8be28f'; g.shadowBlur = 12; round(g, 14, 14, 212, 200, 20, '#0b1e12', '#d8f5d9', 5); g.shadowBlur = 0;
    if (img) { g.save(); g.beginPath(); g.roundRect(28, 28, 184, 172, 12); g.clip(); const k = Math.min(184 / img.width, 172 / img.height); g.drawImage(img, 120 - img.width * k / 2, 114 - img.height * k / 2, img.width * k, img.height * k); g.restore(); }
    else { text(g, 'RARE PEPE', 120, 78, 30, '#d8f5d9', 'Arial', 'center', '900'); text(g, 'WALLET', 120, 124, 44, '#8be28f', 'Arial', 'center', '900'); g.fillStyle = '#8be28f'; g.fillRect(48, 158, 144, 4); text(g, 'ON BITCOIN SINCE 2016', 120, 182, 11, '#9bd4a2', 'Arial', 'center', '800'); } }
  return c;
}
// Shown only until art exists: the symbol's name set in type, in its colour. Never a drawing.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  round(g, 12, 6, 216, 216, 14, '#0a140c', col.color, 4);
  const words = col.name.toUpperCase().replace(',', '').split(' '); words.forEach((w, i) => text(g, w, 120, 110 - (words.length - 1) * 18 + i * 36, w.length > 9 ? 22 : 30, col.color, 'Arial', 'center', '900'));
  text(g, 'LOADING', 120, 196, 13, '#8aa28e'); return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, cached: false, done: false, bundled: 0, cards: 0 };
const cardImages = new Map(), logoImages = {};
// Wherever the game picks a card just for show (pools, pack reveals, binder cards, the gamble), it prefers cards that have a real picture.
// Purely cosmetic: it is never read by the engine. With no pictures bundled, nothing changes.
let artRare = null, artFake = null;
// Preferred only when there are enough pictures to avoid showing the same few cards over and over (24 Rare Pepes / 12 Fake Rares / 6 in a series range).
const artRareIdx = () => artRare || (artRare = ((l) => l.length >= 24 ? l : [])(RARE.map((n, i) => cardImages.has(n) ? i : -1).filter(i => i >= 0))), artFakeNames = () => artFake || (artFake = ((l) => l.length >= 12 ? l : [])(FAKE.filter(n => cardImages.has(n))));
const pickPreferArt = (all, art, n) => art.length >= n ? sample(art, n) : art.concat(sample(all.filter(k => !art.includes(k)), n - art.length));
const sample = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
const infoLabel = it => it.series ? `${it.name} · SERIES ${it.series} CARD ${it.card}` : it.name;
function cardItem(sym, info) { return { key: COLS[sym].key, id: info.name, num: infoLabel(info), name: info.name, series: info.series, card: info.card, tile: cardTile(sym, info, cardImages.get(info.name)), info, collection: COLS[sym].kind === 'fake' ? 'fake-rares' : 'rare-pepe' }; }
function buildCardPools() {
  for (const sym of ['cherry', 'lemon', 'chip', 'block', 'bitcoin', 'chain']) {
    const col = COLS[sym]; let infos;
    if (col.kind === 'fake') infos = pickPreferArt(FAKE, artFakeNames(), 18).map(name => ({ name, series: 0, card: 0 }));
    else { const [a, b] = rangeOf(col.lo, col.hi), all = Array.from({ length: b - a }, (_, k) => a + k); let pick = pickPreferArt(all, all.filter(k => cardImages.has(RARE[k])), sym === 'chain' ? 24 : 18); if (sym === 'bitcoin' && !pick.includes(0)) pick[0] = 0; infos = pick.map(cardOf); }
    pools[sym] = infos.filter(i => i.name).map(info => cardItem(sym, info));
  }
}
const FAKE_INFO = name => ({ name, series: 0, card: 0 });
// A card for a reveal, chosen from the round id alone (cosmetic): same round, same card, never touching the engine.
const REVEAL_SYM = { 15: 'bitcoin', 10: 'block', 8: 'chip', 5: 'lemon', 4: 'lemon', 3: 'lemon', 2: 'cherry', 1: 'cherry' };
const revealCache = new Map();
function revealCard(prize, roundId, k) { const sym = REVEAL_SYM[prize] || 'lemon', col = COLS[sym], seed = hashStr(`${roundId}:${k}:${prize}`), key = `${sym}:${seed}`; let t = revealCache.get(key);
  if (!t) { let info; if (col.kind === 'fake') { const af = artFakeNames(); info = FAKE_INFO(af.length ? af[seed % af.length] : FAKE[seed % FAKE.length] || 'FAKERARE'); } else { const [a, b] = rangeOf(col.lo, col.hi), ar = ((l) => l.length >= 6 ? l : [])(artRareIdx().filter(k => k >= a && k < b)); info = cardOf(ar.length ? ar[seed % ar.length] : a + seed % Math.max(1, b - a)); } t = { info, tile: cardTile(sym, info, cardImages.get(info.name)), sym }; revealCache.set(key, t); if (revealCache.size > 80) revealCache.delete(revealCache.keys().next().value); } return t; }
const DIR_TILE = new Map();
// The Directory binder: a pocket's card, taken from the whole directory by the round id (each page shows 15 different cards).
function directoryCard(f, i, v) { const id = f.roundId || 'dir', seed = hashStr(`${id}:pocket:${i}`), ar = artRareIdx(), idx = ar.length ? ar[seed % ar.length] : seed % Math.max(1, RARE.length), key = `${idx}:${v}`; let t = DIR_TILE.get(key);
  if (!t) { const info = cardOf(idx); t = { info, tile: cardTile('chain', info, cardImages.get(info.name)) }; DIR_TILE.set(key, t); if (DIR_TILE.size > 90) DIR_TILE.delete(DIR_TILE.keys().next().value); } return t; }

// Bundled Bitcoin Pepes (real twins, art/img) and any bundled card pictures decode at once; registry top-ups follow once a player connects.
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const CACHE_KEY = 'xtrata.rare-pepe-directory.twins';
const PEPES = { key: 'bitcoin-pepes', name: 'Bitcoin Pepes', itemNoun: 'Bitcoin Pepe', helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun' };
const ordinalCol = { key: 'ordinal-pepe', name: 'Ordinal Pepe', itemNoun: 'Ordinal Pepe', helper: null, status: 'helper not deployed yet' };
// The Ordinal Pepe wild shows as a not-yet-forevered placeholder until its helper is live and twins load from Xtrata.
pools.wild = [{ key: 'ordinal-pepe', id: 'ordinal', num: 'ORDINAL PEPE', forever: false, baseForever: false, placeholder: true, tile: null }];
pools.wild[0].tile = twinTile(pools.wild[0], 'wild');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// A random sample of a helper's twins: the newest page, plus two pages from random points in its history.
async function sampleTwins(col) { const first = parseEvents(await eventsPage(col.helper, 0)), found = new Map(first.list.map(t => [t.tokenId, t])); col.inscribed = first.count || found.size;
  if (first.rows === 50 && col.inscribed > 50) for (const o of [1, 2].map(() => 50 + Math.floor(Math.random() * Math.max(1, col.inscribed - 50)))) { try { parseEvents(await eventsPage(col.helper, o)).list.forEach(t => found.set(t.tokenId, t)); } catch (e) {} }
  return [...found.values()]; }
const twinUrl = xid => { const [a, n] = SRC.core.split('.'); return `${SRC.origin}/inscription/mainnet/${a}/${n}/${xid}`; };
const twinCols = new Map();
let twinMode = 'default'; // the test page's twins switch: default | none | some | all
const foreverFor = (item, k) => twinMode === 'none' ? false : twinMode === 'all' ? true : twinMode === 'some' ? k % 3 === 0 : item.baseForever !== false;
function retile(sym) { pools[sym].forEach((it, k) => { it.forever = foreverFor(it, k); it.tile = twinTile(it, sym); }); screenDirty = true; }
function pushTwin(sym, t) { const it = { key: t.key, id: t.tokenId, xtrataId: t.xtrataId, num: `#${t.tokenId}`, img: t.img, bundled: !!t.bundled, baseForever: true, collection: t.key }; if (sym === 'wild') pools.wild = pools.wild.filter(x => !x.placeholder); pools[sym].push(it); retile(sym); }
async function loadBundled() {
  await Promise.all((ART.pepes || []).map(async a => { try { const img = await loadImage(a.src, 8000); pushTwinQuiet('artifact', { key: PEPES.key, tokenId: a.tokenId, xtrataId: a.xtrataId, img, bundled: true }); sources.bundled++; } catch (e) {} }));
  retile('artifact');
  await Promise.all(Object.entries(ART.cards || {}).map(async ([name, src]) => { try { cardImages.set(name, await loadImage(src, 8000)); sources.cards++; } catch (e) {} }));
  for (const [k, src] of Object.entries(ART.logos || {})) { try { logoImages[k] = await loadImage(src, 8000); } catch (e) {} }
  artRare = artFake = null;
  if (sources.cards || Object.keys(logoImages).length) { buildCardPools(); revealCache.clear(); DIR_TILE.clear(); }
  pools.scatter = [{ key: 'pepecash', id: 'PEPECASH', num: 'PEPECASH', img: logoImages.pepecash || null, tile: logoTile('scatter', logoImages.pepecash) }];
  pools.vault = [{ key: 'rare-pepe-wallet', id: 'WALLET', num: 'RARE PEPE WALLET', img: logoImages.wallet || null, tile: logoTile('vault', logoImages.wallet) }];
  screenDirty = true;
}
function pushTwinQuiet(sym, t) { pools[sym].push({ key: t.key, id: t.tokenId, xtrataId: t.xtrataId, num: `#${t.tokenId}`, img: t.img, bundled: !!t.bundled, baseForever: true, collection: t.key, forever: true, tile: null }); }
// Registry and helper reads top the twins up live. A failed read leaves the bundled twins as they were: "unknown", never "none".
async function loadLive() {
  let cols = [];
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = (reg.collections || []).filter(c => c.status === 'live' && c.helper); sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; cols = [PEPES]; }
  const pepes = cols.find(c => c.key === PEPES.key) || PEPES, ord = cols.find(c => /ordinal.?pepe/i.test(c.key + ' ' + c.name));
  const todo = [{ col: { key: PEPES.key, name: pepes.name || PEPES.name, helper: pepes.helper || PEPES.helper }, sym: 'artifact', n: 18 }]; if (ord) todo.push({ col: { key: ord.key, name: ord.name, helper: ord.helper }, sym: 'wild', n: 6 }); else twinCols.set('ordinal-pepe', ordinalCol);
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core; sources.cached = !!fresh; const queue = [];
  await Promise.all(todo.map(async ({ col, sym, n }) => { twinCols.set(col.key, { ...col, sym, inscribed: 0, loaded: 0 }); const m = twinCols.get(col.key);
    try { const list = fresh && cache.lists[col.key] ? cache.lists[col.key] : await sampleTwins(col); m.list = list; m.inscribed = col.inscribed || (fresh && cache.counts && cache.counts[col.key]) || list.length; sources.lists++; const have = new Set(pools[sym].map(t => t.id)); sample(list.filter(t => !have.has(t.tokenId)), n).forEach(item => queue.push({ m, item })); }
    catch (e) { sources.listFailures++; m.list = []; } }));
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, lists: Object.fromEntries([...twinCols].map(([k, c]) => [k, c.list || []])), counts: Object.fromEntries([...twinCols].map(([k, c]) => [k, c.inscribed])) })); } catch (e) {}
  queue.sort(() => Math.random() - .5); let i = 0;
  const worker = async () => { while (i < queue.length) { const { m, item } = queue[i++]; try { const img = await loadImage(twinUrl(item.xtrataId)); pushTwin(m.sym, { key: m.key, tokenId: item.tokenId, xtrataId: item.xtrataId, img }); m.loaded++; sources.images++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 5 }, worker)); sources.done = true; screenDirty = true;
}
const twinCount = () => pools.artifact.length + pools.wild.filter(t => !t.placeholder).length;
buildCardPools();
pools.artifact.forEach(t => { t.tile = twinTile(t, 'artifact'); });
pools.scatter = [{ key: 'pepecash', id: 'PEPECASH', num: 'PEPECASH', img: null, tile: logoTile('scatter') }];
pools.vault = [{ key: 'rare-pepe-wallet', id: 'WALLET', num: 'RARE PEPE WALLET', img: null, tile: logoTile('vault') }];


/* ---------- Faces: which inscription a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: a green leather binder page with cream index tabs and a card-sleeve window for the reels ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const PAPER = '#efe6c8', INK = '#0d2a14', LEAF = '#8be28f';
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#0f2d1a', '#0a1d11', '#0e2817']); g.fillRect(0, 0, 1400, 960);
  for (let k = 0; k < 1100; k++) { const h = hashStr('g' + k); g.fillStyle = (h & 1) ? '#ffffff06' : '#00000016'; g.fillRect(h % 1400, (h >>> 11) % 960, 2, 2); } // leather grain
  g.save(); g.setLineDash([11, 8]); round(g, 8, 8, 1384, 944, 20, null, '#d7c98f70', 2); g.restore(); // the binder's stitching
  for (const x of [20, 1380]) for (const y of [196, 486, 776]) { g.beginPath(); g.arc(x, y, 8, 0, 7); g.fillStyle = '#050e08'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#c9cfc7'; g.stroke(); } // punched binder holes
  // index tabs
  round(g, 18, 14, 380, 172, 12, PAPER, '#c9b46a', 3); round(g, 1002, 14, 380, 172, 12, PAPER, '#c9b46a', 3);
  g.fillStyle = '#d9ceaa'; for (const x0 of [18, 1002]) for (let y = 62; y < 186; y += 26) g.fillRect(x0 + 14, y, 352, 1); // ruled lines
  g.shadowColor = GOLD; g.shadowBlur = 12; round(g, 412, 14, 576, 172, 12, '#0b1f10', lin(g, 412, 14, 988, 186, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']), 6); g.shadowBlur = 0;
  text(g, 'BITCOIN BLOCK', 208, 44, 17, '#2f6a3d', 'Arial', 'center', '900'); text(g, 'SERIES 1, CARD 1 JACKPOT', 700, 44, 23, GOLD, 'Arial', 'center', '900'); text(g, 'HOLDER POT', 1192, 44, 17, '#2f6a3d', 'Arial', 'center', '900');
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#07140b', lin(g, 0, RY - 14, 0, RY + RH + 14, ['#f4ecd2', '#b9ad82', '#e9dfba', '#7f754f']), 7);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0a1c10', '#14301c', '#0a1c10']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
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
// The card shown in the first paying cell of a winning line: its cameo (and, later, its holder's royalty).
function cameoFor(w, grid = state.grid, fc = faces) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = grid[c][line[c]]; if (s === w.symbol || s === 'wild') { const it = itemFor(s, fc[c][line[c]]); if (it) return it; } } return null; }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = GOLD; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, GOLD, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, GOLD, 4); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#f2c14ec0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#3fb95066'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// PEPECASH Rain: coins fall down the screen while the free spins run. Positions come from the clock only.
function drawRain(now) {
  const it = pools.scatter[0]; if (!it || !motionOK()) return;
  sg.save(); sg.globalAlpha = .75; sg.shadowColor = ACCENT; sg.shadowBlur = 18;
  for (let k = 0; k < 14; k++) { const sp = 90 + (hashStr('r' + k) % 70), x = RX + 20 + (hashStr('x' + k) % (RW - 80)), y = ((now / 1000 * sp + (hashStr('y' + k) % 900)) % (RH + 120)) + RY - 90, s = 40 + (k % 3) * 12, w = Math.max(.15, Math.abs(Math.cos(now / 420 + k))); sg.save(); sg.translate(x + s / 2, y + s / 2); sg.scale(w, 1); sg.drawImage(it.tile, -s / 2, -s / 2, s, s); sg.restore(); }
  sg.restore();
}
// Open a Pack: the nine face-down cards. Their rarity shows only when flipped; which card is shown is cosmetic (the round id).
const RARITY = { 1: 'FAKE RARE', 2: 'FAKE RARE', 3: 'SERIES 26–36', 4: 'SERIES 26–36', 5: 'SERIES 26–36', 8: 'SERIES 13–25', 10: 'SERIES 2–12', 15: 'SERIES 1' };
let packFaces = [];
// The last 21 rounds as a row of card backs: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 870;
  text(sg, 'LAST 21 ROUNDS', x0 - 20, y + s / 2, 12, '#6f9a77', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y + 0, s * .72, s, 2, e ? (e.win > 0 ? ACCENT : '#25402c') : '#12201a', i === n - 1 && e ? CREAM : null, 1.5); } }


/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'PEPECASH RAIN', vault: 'OPEN A PACK', chain: 'THE DIRECTORY', jackpot: 'SERIES 1, CARD 1', gamble: 'RARE OR FAKE' };
const RULES = { free: 'Eight free spins. PEPECASH rains down the binder; every win pays 2×. More PEPECASH adds four.', vault: 'A booster pack fans out into nine face-down cards. Flip three: each is a Rare Pepe with a prize.', chain: 'Directory cards lock into the 15-pocket binder. Any new card resets your three respins. Fill the binder to win Series 1, Card 1.', jackpot: 'The first card of the first series. Five Series 1 Rare Pepes on the centre row found it.', gamble: '' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
let sceneQueue = [], hits = [], airdrop = null;
// Chiptune stings for the scenes; every one is built from the same square/triangle voices as the reels.
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { noise(.5, 5200, 1.2, .1); arp([523.25, 659.25, 783.99, 1046.5, 1318.5, 1568], .07, .16, .06, 'square'); coins(10, .3); }
  if (kind === 'sting-vault') { noise(.2, 3800, 3, .22); arp([196, 261.63, 329.63, 392, 523.25], .09, .22, .05, 'square'); bleep(1046.5, .5, .05, .45, 'triangle'); } // the foil wrapper tearing, then the fanfare
  if (kind === 'sting-chain') { noise(.1, 1200, 1, .3); noise(.1, 1200, 1, .3, .18); arp([220, 277.18, 329.63, 440], .08, .2, .05, 'square', .3); }
  if (kind === 'sting-jackpot') { arp([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5], .09, .5, .07, 'square'); arp([130.8, 164.8, 196, 261.6], .18, .9, .06, 'triangle'); coins(40, .5); crowdRare(.7, 1.2); }
  if (kind === 'sting-gamble') { noise(.25, 4200, 2, .15); bleep(988, .3, .06, .1, 'triangle'); }
  if (kind === 'whoosh') { noise(.4, 2800, .8, .14); bleep(240, .4, .05, 0, 'triangle'); }
  if (kind === 'crack') { sound('flip'); bleep(700 + i * 50, .3, .07, .06, 'triangle'); }
  if (kind === 'reveal-big') { arp([784, 988, 1175, 1568], .06, .35, .07, 'square'); coins(14, .1); crowdRare(.15, .7); }
  if (kind === 'stamp') { noise(.1, 1500, 1.5, .5); bleep(110, .2, .25, 0, 'triangle'); }
  if (kind === 'reset') { bleep(1318.5, .15, .06); bleep(1760, .2, .05, .08); }
  if (kind === 'tick') bleep(1600 + (i % 6) * 60, .03, .025, 0, 'square');
  if (kind === 'roll') noise(.03, 3600, 5, .1);
  if (kind === 'land') { noise(.06, 2400, 2, .3); bleep(660, .16, .08, 0, 'triangle'); }
  if (kind === 'summary') arp([659.25, 783.99, 1046.5], .08, .3, .06, 'square');
  if (kind === 'miss') { noise(.07, 900, 2, .22); bleep(180 - i * 6, .18, .08, 0, 'triangle'); } // a pocket rolls and comes up empty: a soft thud
  if (kind === 'beat') { bleep(82, .12, .16, 0, 'triangle'); bleep(70, .12, .12, .13, 'triangle'); } // the held pocket: a heartbeat
  if (kind === 'charge') { arp([392, 440, 494, 554, 622, 698].slice(0, 3 + (i > 0 ? 3 : 0)), .07, .1 + .02 * i, .04, 'triangle'); noise(.3 + .12 * i, 1800, 1.5, .05); } // a pack card building up before it turns
}
let musicTimer = 0;
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 739.99, 880, 1174.66, 880, 739.99];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k++ % seq.length]; bleep(n, .2, .05); if (k % 4 === 1) bleep(n / 4, .45, .07, 0, 'triangle'); if (k % 2) noise(.03, 6000, 4, .05); }, state.turbo ? 90 : 150); }

// The triggering cells, read from the settled grid.
function cellsOf(sym, centreOnly = false) { const out = []; state.grid.forEach((col, c) => col.forEach((s, r) => { if (s === sym && (!centreOnly || r === 1)) out.push([c, r]); })); return out; }
function startScene(kind, data = {}, stage = 'trigger') {
  stopAuto(); hideBar(); scene = { kind, stage, t0: performance.now(), data, reveal: {}, stampAt: {}, resetAt: 0, lastLeft: 3 };
  if (stage === 'trigger') { sfx(`sting-${kind}`); if (motionOK() && kind !== 'gamble') particles(kind === 'jackpot' ? 90 : 30); }
  if (kind === 'jackpot' && stage !== 'outro') jackpotMusic(false);
  labSeen(kind, stage); status(`${TITLES[kind]}${stage === 'trigger' ? '!' : ''}`); renderBar(); update();
}
function nextScene() { scene = null; jackpotMusic(false); hideBar(); const n = sceneQueue.shift(); if (n) { startScene(n.kind, n.data || {}, n.stage || 'trigger'); return; }
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  // A spin still pending ends the Airdrop itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } airdropOutro(); return; }
  if (state.free > 0) { status(`${state.free} PEPECASH RAIN SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); labSeen(scene.kind, stage); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2300 : 1400) * speed();
// The primary action: one button drives every stage (Spin, Space, the cabinet's INSCRIBE, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { airdropOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage(kind === 'gamble' ? 'intro' : 'intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { airdrop = { t0: performance.now(), retriggers: 0, best: 0 }; scene = null; renderBar(); update(); spin(); return; } if (kind === 'jackpot') { setStage('play'); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else toast('Flip three cards.'); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'RAIN' : broke ? 'GET LAYR' : 'TRADE'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'CLAIM' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `FLIP ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return chainBusy() ? 'RESPINNING…' : f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'REVEALING'; }
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
  if (kind === 'chain') { scene.spin = null; while (!E.featureDone(f)) E.respin(state); save(); }
  collectScene(true);
}
// Free spins played with no animation: each one is still a full engine round (start, settle, features), committed one by one.
function runFreeInstantly() {
  airdrop = airdrop || { t0: performance.now(), retriggers: 0, best: 0 };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state, lab.on ? labRng() : undefined); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordCameos(r);
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
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, cells, respins, bet: f.bet, skipped }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// ---------- The Directory: every respin is an event, not just a result ----------
// The engine has already dealt the respin. The scene then plays it out: the empty pockets roll a strip of Directory cards, stop one by one
// (a hit stamps in with a shockwave, a miss thuds back to empty), the last pocket holds longer when it matters, and the respin lamps follow.
const chainBusy = () => !!(scene && scene.spin && performance.now() < scene.spin.end);
function startRespin(f, prevCells, before, fr) {
  const now = performance.now(), sp = speed(), mo = motionOK(), added = new Set(fr.added), empties = prevCells.map((v, i) => v ? -1 : i).filter(i => i >= 0);
  const after = empties.length - added.size, tense = mo && (before === 1 || empties.length <= 2), fill = after === 0 && added.size > 0;
  const base = (mo ? 760 : 240) * sp, gap = (mo ? 85 : 0) * sp, landAt = {};
  empties.forEach((i, k) => { landAt[i] = now + base + k * gap; });
  if (tense && empties.length) landAt[empties[empties.length - 1]] += (empties.length === 1 ? 1000 : 650) * sp; // the last pocket holds its roll
  const lastLand = Math.max(...Object.values(landAt), now), hitTimes = [...added].map(i => landAt[i]), firstHit = hitTimes.length ? Math.min(...hitTimes) : 0;
  const RS = { t0: now, landAt, added, prevCells, before, n: f.frames.length - 1, tense, fill, firstHit, lastLand, end: lastLand + (mo ? (fill ? 900 : 480) : 200) * sp, left: fr.left };
  scene.spin = RS; scene.resetAt = added.size ? firstHit : scene.resetAt; added.forEach(i => { scene.stampAt[i] = landAt[i]; });
  const live = fn => (delay) => setTimeout(() => { if (scene && scene.spin === RS) fn(); }, Math.max(0, delay)), later = live;
  sound('respin'); if (tense) later(() => sound('antic'))(80);
  empties.forEach((i, k) => later(() => sfx(added.has(i) ? 'stamp' : 'miss', k))(landAt[i] - now));
  if (tense && mo) for (let t = base * .7; now + t < lastLand; t += 260 * sp) later(() => sfx('beat'))(t);
  if (added.size) { if (before < 3) later(() => sfx('reset'))(firstHit - now + 220 * sp); if (mo) later(() => particles(added.size * 5))(firstHit - now); }
  if (fill) later(() => { sfx('reveal-big'); if (mo) particles(60); })(lastLand - now + 120 * sp);
  later(() => { renderBar(); update(); })(RS.end - now + 30);
}
function chainMsg(f, now) { const RS = scene.spin, fr = f.frames[f.index];
  if (!RS) return `THE DIRECTORY · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`;
  if (now < RS.lastLand) return RS.before === 1 ? 'FINAL RESPIN · HOLD ON…' : `RESPIN ${RS.n} · ROLLING…`;
  if (RS.fill) return 'BINDER FULL · SERIES 1, CARD 1!';
  if (RS.added.size) return `+${RS.added.size} NEW CARD${RS.added.size > 1 ? 'S' : ''}${RS.before < 3 ? ' · RESPINS RESET TO 3' : ''}`;
  return E.featureDone(f) ? 'NO NEW CARD · BINDER CLOSED' : `NO NEW CARD · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`; }
// One rolling pocket: a strip of Directory cards drops through the pocket, easing to rest on the card it lands (or a face-down card for a miss).
function drawRollPocket(f, i, x, y, w, h, now, S, tile) {
  const p = Math.min(1, (now - S.t0) / Math.max(1, S.landAt[i] - S.t0)), N = 7, th = h - 16, stride = th + 14, rem = (1 - ease(p)) * N, cx = x + w / 2, cy = y + h / 2, blur = Math.min(1, (1 - p) * 1.5);
  if (!scene.pool) scene.pool = Array.from({ length: 8 }, (_, k) => directoryCard(f, 100 + k * 13, 1 + (k % 5)).tile);
  sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 14); sg.clip(); sg.fillStyle = '#081509'; sg.fillRect(x, y, w, h);
  for (let k = -1; k <= N + 1; k++) { const yy = cy - (rem - k) * stride; if (Math.abs(yy - cy) > h / 2 + th / 2) continue; sg.globalAlpha = 1 - .4 * blur;
    if (k === 0 && !tile) drawCardBack(cx - th * .36, yy - th / 2, th * .72, th, ''); else sg.drawImage(k === 0 ? tile : scene.pool[(k * 3 + i + 8) % 8], cx - th / 2, yy - th / 2, th, th); }
  sg.globalAlpha = 1; if (blur > .25) { sg.fillStyle = `rgba(139,226,143,${.07 * blur})`; for (let b = 0; b < 7; b++) sg.fillRect(x + 12 + b * (w - 24) / 7, y, 3, h); }
  const g = sg.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(4,16,8,.75)'); g.addColorStop(.28, 'rgba(4,16,8,0)'); g.addColorStop(.72, 'rgba(4,16,8,0)'); g.addColorStop(1, 'rgba(4,16,8,.75)'); sg.fillStyle = g; sg.fillRect(x, y, w, h);
  sg.restore();
  const hold = S.tense && now > S.t0 + 700 * speed() && p < 1, pulse = hold ? .55 + .45 * Math.sin(now / 90) : 0;
  sg.save(); if (hold) { sg.shadowColor = GOLD; sg.shadowBlur = 24 * pulse; } round(sg, x, y, w, h, 14, null, hold ? GOLD : '#3fb950', hold ? 4 : 3); sg.restore(); }
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { if (chainBusy()) return; const prev = f.frames[f.index], before = prev.left, prevCells = prev.cells.slice(); const fr = E.respin(state); save(); chainFlash = performance.now(); startRespin(f, prevCells, before, fr); renderBar(); update(); }
  else toast('Flip three cards first.'); }
const vaultCharge = m => motionOK() ? (m >= 8 ? 650 : 280) * speed() : 0; // a pack card builds up before it turns; the big ones hold longer
function pickVault(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); const ch = vaultCharge(r.multiple); sfx('crack', i); if (ch) sfx('charge', r.multiple >= 8 ? 1 : 0); if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), ch + 520 * speed()); else setTimeout(() => sound('pick', i), ch + 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
function callGamble(choice) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, choice, lab.on ? labGambleRng(choice) : undefined); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, choice }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, ['#8be28f', '#3fb950', '#23863a']) : '#10241a', primary ? CREAM : '#2f7a45', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#04140a' : '#eaf6e6', 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
// On the full-width card grids (the pack and the binder) the chip sits just under the screen so it never covers a card.
function skipChip() { if (!canSkip()) return; const low = scene && scene.stage === 'play' && (scene.kind === 'vault' || scene.kind === 'chain'); button('SKIP ›', RX + RW - 150, low ? RY + RH + 8 : RY + 14, 136, low ? 48 : 50, skipScene, false); }
const cameoLabel = it => !it ? '' : it.series ? `${it.name} · S${it.series} CARD ${it.card}` : it.collection === 'fake-rares' ? `${it.name} · FAKE RARE` : it.placeholder ? 'ORDINAL PEPE' : `BITCOIN PEPE #${it.id}`;
// A card seen from the back: pepe-green with a cream border and the permanence loop in the middle.
function drawCardBack(x, y, w, h, label, glow) { sg.save(); if (glow) { sg.shadowColor = glow; sg.shadowBlur = 22; } round(sg, x, y, w, h, 10, lin(sg, x, y, x + w, y + h, ['#1a6b34', '#0f3d1f', '#1a6b34']), CREAM, 4); sg.restore();
  sg.save(); sg.beginPath(); sg.roundRect(x + 8, y + 8, w - 16, h - 16, 6); sg.clip(); sg.fillStyle = '#ffffff10'; for (let r = 0; r < h / 14; r++) for (let c = 0; c < w / 14; c++) if ((r + c) % 2) sg.fillRect(x + 8 + c * 14, y + 8 + r * 14, 14, 14); sg.restore();
  drawInfinity(sg, x + w / 2, y + h / 2 - 6, w * .5, CREAM, 4); if (label) text(sg, label, x + w / 2, y + h - 22, 20, CREAM, 'Arial', 'center', '900'); }
// A booster pack: foil with a crimped top and bottom edge.
function drawPack(cx, cy, w, h, tilt = 0) { sg.save(); sg.translate(cx, cy); sg.rotate(tilt); sg.shadowColor = ACCENT; sg.shadowBlur = 30;
  sg.fillStyle = lin(sg, -w / 2, -h / 2, w / 2, h / 2, ['#8be28f', '#2f9e44', '#0f5a28', '#3fb950']); sg.beginPath(); sg.moveTo(-w / 2, -h / 2 + 14); for (let k = 0; k <= 10; k++) sg.lineTo(-w / 2 + k * w / 10, -h / 2 + (k % 2 ? 0 : 14)); sg.lineTo(w / 2, h / 2 - 14); for (let k = 10; k >= 0; k--) sg.lineTo(-w / 2 + k * w / 10, h / 2 - (k % 2 ? 0 : 14)); sg.closePath(); sg.fill(); sg.shadowBlur = 0;
  sg.lineWidth = 4; sg.strokeStyle = CREAM; sg.stroke(); sg.fillStyle = '#ffffff30'; sg.fillRect(-w / 2 + 14, -h / 2 + 26, 14, h - 52);
  text(sg, 'RARE', 0, -h * .2, w * .26, CREAM, 'Georgia, serif', 'center', '900'); text(sg, 'PEPES', 0, -h * .2 + w * .28, w * .26, CREAM, 'Georgia, serif', 'center', '900'); drawInfinity(sg, 0, h * .24, w * .5, '#04140a', 5); text(sg, 'BOOSTER · 9 CARDS', 0, h * .38, 14, '#04140a', 'Arial', 'center', '900'); sg.restore(); }
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#03120a', '#0b2a16', '#12401f']); g.fillRect(RX, RY, RW, RH); if (pools.scatter[0] && motionOK()) for (let k = 0; k < 18; k++) { const sp = 70 + (hashStr('i' + k) % 80), x = RX + (hashStr('ix' + k) % RW), y = ((now / 1000 * sp + (hashStr('iy' + k) % 700)) % (RH + 160)) + RY - 120, s = 46 + (k % 4) * 14; g.globalAlpha = .35 * dim; g.drawImage(pools.scatter[0].tile, x, y, s, s); } }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#07180d', '#0f2c19', '#06120a']); g.fillRect(RX, RY, RW, RH); g.globalAlpha = .1 * dim; for (let k = 0; k < 9; k++) { const [x, y, w, h] = capsuleRect(k); round(g, x + w / 2 - 60, y + 10, 120, h - 20, 12, ACCENT); } }
  if (kind === 'chain') { g.fillStyle = '#07140b'; g.fillRect(RX, RY, RW, RH); const off = motionOK() ? (now / 40) % 250 : 0; g.globalAlpha = .26 * dim; for (let k = 0; k < 14; k++) { const t = directoryCard({ roundId: 'map' }, k, 0).tile, x = RX + (k % 7) * 190 - off + 20, y = RY + Math.floor(k / 7) * 190 + 10; g.drawImage(t, x, y, 170, 170); g.drawImage(t, x + 1330, y, 170, 170); } }
  if (kind === 'jackpot') { g.fillStyle = '#050f08'; g.fillRect(0, 0, 1400, 960); const a = motionOK() ? now / 2400 : 0; g.translate(700, 480); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.globalAlpha = .13 * dim; g.fillStyle = k % 2 ? '#3fb950' : GOLD; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1200, a, a + Math.PI / 18); g.closePath(); g.fill(); } }
  if (kind === 'gamble') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0a1a10', '#12301b']); g.fillRect(RX, RY, RW, RH); }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.2) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 60 + (1 - k) * -140;
  sg.fillStyle = '#04120ad8'; sg.fillRect(RX, y - 78, RW, 156); sg.fillStyle = ACCENT; sg.fillRect(RX, y - 80, RW, 4); sg.fillRect(RX, y + 76, RW, 4);
  sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, title, 700, y - 12, 76, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0; text(sg, sub, 700, y + 46, 22, '#cfeacf', 'Arial', 'center', '800'); sg.restore(); }
let gold1 = null; const series1Card = () => gold1 || (gold1 = cardTile('bitcoin', cardOf(0), cardImages.get(cardOf(0).name)));
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(0,0,0,${Math.min(.62, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : ACCENT; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore(); });
  if (kind === 'gamble') { const k = ease(t * 2); drawCardBack(700 - 70 * k, RY + RH / 2 - 100 * k, 140 * k, 200 * k, '?', GOLD); }
  if (kind === 'jackpot' && !cells.length) { const k = ease(t * 2); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; sg.drawImage(series1Card(), 700 - 120 * k, RY + RH / 2 - 120 * k, 240 * k, 240 * k); sg.restore(); }
  const sub = kind === 'jackpot' ? (cells.length ? 'FIVE SERIES 1 RARE PEPES ON THE CENTRE ROW' : 'THE BINDER IS FULL · ALL 15 POCKETS') : kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL` : `${cells.length} ${kind === 'free' ? 'PEPECASH' : kind === 'vault' ? 'RARE PEPE WALLETS' : 'DIRECTORY CARDS'}`;
  if (t > .5) titleCard(TITLES[kind], sub, now, (t - .5) * 1.4);
  if (t >= 1) setStage('intro'); }
function wrapText(s, x, y, maxW, lh, color, size) { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); }
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (600 * speed()), a = Math.min(1, t);
  backdrop(kind, now); sg.save(); sg.globalAlpha = a; const yIn = motionOK() ? (1 - ease(t)) * 40 : 0;
  if (kind === 'free' && pools.scatter[0]) { sg.shadowColor = ACCENT; sg.shadowBlur = 40; sg.drawImage(pools.scatter[0].tile, 330 - 120, RY + 120 + yIn, 240, 240); sg.shadowBlur = 0; }
  if (kind === 'vault') drawPack(330, RY + 250 + yIn, 190, 290, motionOK() ? Math.sin(now / 500) * .06 : 0);
  if (kind === 'chain') { sg.drawImage(directoryCard({ roundId: 'intro' }, 0, 0).tile, 215, RY + 115 + yIn, 230, 230); }
  if (kind === 'jackpot') { sg.shadowColor = GOLD; sg.shadowBlur = 50; sg.drawImage(series1Card(), 190, RY + 100 + yIn, 280, 280); sg.shadowBlur = 0; }
  if (kind === 'gamble') drawCardBack(262, RY + 120 + yIn, 136, 200, '?', GOLD);
  sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, TITLES[kind], 890, RY + 150 + yIn, kind === 'chain' || kind === 'free' ? 58 : 66, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  const rule = kind === 'gamble' ? `Call RARE or FAKE. Right doubles your ${fmt(scene.data.stake)} LAYR win; wrong loses it.` : RULES[kind];
  wrapText(rule, 890, RY + 232 + yIn, 640, 30, '#e3f3df', 26);
  sg.restore();
  if (kind === 'gamble') { button('RARE', 600, RY + 380, 180, 84, () => callGamble('odd')); button('FAKE', 800, RY + 380, 180, 84, () => callGamble('even')); button('KEEP WIN', 1000, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'CLAIM' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }
function drawVaultPlay(f, now) {
  backdrop('vault', now, .6); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, doneDelay = 900 * speed() + (done ? Math.max(...f.picks.map(i => vaultCharge(f.awards[i]))) : 0);
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], cardH = h - 16, cardW = 118, rv = revealCard(m, f.roundId || 'pack', i);
    const infoX = x + cardW + 28 + (w - cardW - 28) / 2;
    if (picked) { const ch = vaultCharge(m), el = at ? now - at : 1e9;
      if (el < ch) { const k = el / ch, jit = Math.sin(el / 22) * (1.5 + 5 * k), big = m >= 8; sg.save(); sg.shadowColor = big ? GOLD : '#8be28f'; sg.shadowBlur = (big ? 30 : 14) + 26 * k; round(sg, x, y, w, h, 14, '#0d2314', big ? GOLD : ACCENT, 3 + 2 * k); sg.restore(); drawCardBack(x + 12 + jit, y + 8 - k * 4, cardW, cardH, String(i + 1), big ? GOLD : '#8be28f'); text(sg, big ? 'SOMETHING BIG…' : 'TURNING…', infoX, y + h / 2, 17, big ? '#fff1b8' : CREAM, 'Arial', 'center', '900'); continue; }
      const t = at ? (el - ch) / (700 * speed()) : 9;
      if (t < .45 && motionOK()) { const u = t / .45, sx = Math.max(.04, 1 - ease(u)); sg.save(); sg.translate(x + 12 + cardW / 2, 0); sg.scale(sx, 1); sg.translate(-(x + 12 + cardW / 2), 0); drawCardBack(x + 12, y + 8, cardW, cardH, String(i + 1), '#fff1b8'); sg.restore(); round(sg, x, y, w, h, 14, null, '#2f7a45', 2); continue; }
      const k = motionOK() ? ease((t - .45) / .55) : 1, big = m >= 8; sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      round(sg, x, y, w, h, 14, big ? '#2a2308' : '#0d2314', big ? GOLD : ACCENT, big ? 6 : 4); sg.restore();
      const sw = Math.max(.05, k), s = cardH; sg.save(); sg.translate(x + 12 + cardW / 2, y + 8 + cardH / 2); sg.scale(sw, 1); sg.drawImage(rv.tile, -s / 2 + 0, -s / 2, s, s); sg.restore();
      const shown = Math.round(m * Math.min(1, k * 1.2)); text(sg, RARITY[m] || '', infoX, y + h / 2 - 40, 20, big ? '#fff1b8' : '#cfeacf'); text(sg, `${Math.max(1, shown)}×`, infoX, y + h / 2 - 2, 46, '#ffffff', 'Arial'); text(sg, `${fmt(Math.max(1, shown) * f.bet)} LAYR`, infoX, y + h / 2 + 40, 18, GOLD); text(sg, rv.info.name, infoX, y + h / 2 + 62, 13, '#8fbf98', 'Arial', 'center', '700'); }
    else if (done && now - doneAt > doneDelay) { round(sg, x, y, w, h, 14, '#0a1710', '#1d3a26', 2); text(sg, RARITY[m] || '', infoX, y + h / 2 - 16, 16, '#4d7a58'); text(sg, `${m}×`, infoX, y + h / 2 + 14, 30, '#4d7a58'); sg.save(); sg.globalAlpha = .45; sg.drawImage(rv.tile, x + 12 - (s0(cardH) - cardW) / 2, y + 8, cardH, cardH); sg.restore(); }
    else { const hover = motionOK() ? Math.sin(now / 400 + i) * 3 : 0; round(sg, x, y + hover, w, h, 14, '#0d2314', '#2f7a45', 2); drawCardBack(x + 12, y + 8 + hover, cardW, cardH, String(i + 1)); text(sg, 'FACE DOWN', infoX, y + h / 2 - 18 + hover, 22, CREAM); text(sg, 'TAP TO FLIP', infoX, y + h / 2 + 16 + hover, 15, '#6f9a77', 'Arial', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickVault(i) }); } }
  if (done && now - doneAt > doneDelay) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }
const s0 = h => h; // card tiles are square, so a revealed pack card is centred on the back it replaced
function drawGrabPlay(f, now) {
  backdrop('chain', now, .35); const fr = f.frames[f.index], S = scene.spin, mo = motionOK();
  const landed = i => !(S && S.landAt[i] !== undefined && now < S.landAt[i]), tot = fr.cells.reduce((a, v, i) => a + (landed(i) ? v : 0), 0);
  if (S && now < S.lastLand && mo && Math.floor(now / 80) !== Math.floor((now - 17) / 80)) sfx('roll');
  fr.cells.forEach((v, i) => { const x0 = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, at = scene.stampAt[i];
    if (!landed(i)) { drawRollPocket(f, i, x0, y, w, h, now, S, v ? directoryCard(f, i, v).tile : null); return; }
    const miss = !v && S && S.landAt[i] !== undefined ? (now - S.landAt[i]) / (520 * speed()) : 9, x = x0 + (mo && miss < 1 ? Math.sin(miss * 38) * 5 * (1 - miss) : 0);
    if (v) { const t = at ? (now - at) / (320 * speed()) : 9; const s = mo ? 1 + .7 * (1 - ease(t)) : 1; sg.save(); sg.globalAlpha = Math.min(1, .35 + t * 3); if (t < 1.5) { sg.shadowColor = GOLD; sg.shadowBlur = 40 * (1.5 - Math.min(1.5, t)); } const hh = h * s; sg.drawImage(directoryCard(f, i, v).tile, x + (w - hh) / 2, y + (h - hh) / 2, hh, hh); sg.restore();
      if (mo && at && t >= 0 && t < 1.6) { const k = t / 1.6; sg.save(); sg.globalAlpha = (1 - k) * .9; sg.strokeStyle = '#fff1b8'; sg.lineWidth = 6 * (1 - k) + 1; sg.beginPath(); sg.roundRect(x - k * 26, y - k * 26, w + k * 52, h + k * 52, 14 + k * 20); sg.stroke(); sg.restore(); }
      if (t > .6) { round(sg, x + w - 78, y + h - 34, 74, 30, 8, '#04140ad8', GOLD, 2); text(sg, `${v}× ${fmt(v * f.bet)}`, x + w - 41, y + h - 19, 14, '#fff1b8', 'Arial', 'center', '900'); } }
    else { round(sg, x, y, w, h, 14, '#0a1710f6', miss < 1 ? `rgba(224,150,70,${1 - miss})` : '#2f7a45', miss < 1 ? 4 : 2); sg.save(); sg.setLineDash([6, 6]); round(sg, x + 10, y + 10, w - 20, h - 20, 10, null, '#2f7a4577', 2); sg.restore();
      if (miss < 1) { text(sg, 'NO CARD', x + w / 2, y + h / 2 - 10, 18, `rgba(240,170,90,${1 - miss})`, 'Arial', 'center', '900'); text(sg, `POCKET ${i + 1}`, x + w / 2, y + h / 2 + 12, 13, '#3a6246'); }
      else { text(sg, 'EMPTY', x + w / 2, y + h / 2 - 10, 15, '#4d7a58', 'Arial', 'center', '900'); text(sg, `POCKET ${i + 1}`, x + w / 2, y + h / 2 + 12, 13, '#3a6246'); } } });
  // Respin banner sweeping over the binder as the pockets start to roll.
  if (S && mo && now - S.t0 < 520 * speed()) { const k = (now - S.t0) / (520 * speed()); sg.save(); sg.globalAlpha = Math.sin(Math.min(1, k) * Math.PI) * .9; round(sg, 470, RY + RH / 2 - 44, 460, 88, 18, '#04120af0', GOLD, 4); text(sg, S.before === 1 ? 'FINAL RESPIN' : `RESPIN ${S.n}`, 700, RY + RH / 2 + 1, 46, '#fff1b8', 'Arial', 'center', '900'); sg.restore(); }
  // Binder full: the whole page flashes gold.
  if (S && S.fill && mo && now > S.lastLand && now - S.lastLand < 700) { sg.save(); sg.globalAlpha = (1 - (now - S.lastLand) / 700) * .5; sg.fillStyle = '#fff1b8'; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  // Respins left: three lamps. The one just spent goes out as the pockets roll; a new card refills them one by one.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0, by = RY + RH + 8; sg.save(); round(sg, RX + 14, by, 290, 48, 12, '#04120ae6', rs ? CREAM : '#2f7a45', rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, by + 25, 20, CREAM, 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const spent = S && now < S.end && !(S.added.size && now >= S.firstHit) ? S.before - 1 : fr.left, refill = S && S.added.size && now >= S.firstHit && k >= S.before - 1 ? now >= S.firstHit + (k - (S.before - 1) + 1) * 130 * speed() : true;
    const on = k < (S && S.added.size && now >= S.firstHit ? fr.left : spent) && refill, used = S && now < S.lastLand && k === S.before - 1 && !(S.added.size && now >= S.firstHit);
    sg.beginPath(); sg.arc(RX + 170 + k * 44, by + 24, 14, 0, 7); sg.fillStyle = on ? (rs ? '#fff1b8' : ACCENT) : used ? (Math.floor(now / 110) % 2 ? '#e0964a' : '#4a2c12') : '#1d2a22'; if (on && rs) { sg.shadowColor = ACCENT; sg.shadowBlur = 20; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 440, by, 280, 48, 12, '#04120ae6', '#2f7a45', 2); text(sg, `FILED ${fmt(tot * f.bet)} LAYR`, RX + RW - 300, by + 25, 21, CREAM, 'Arial', 'center', '900');
  const busy = chainBusy();
  if (E.featureDone(f) && !busy && now - chainFlash > 700) button('COLLECT', 570, RY + RH / 2 - 37, 260, 74, collectScene);
  else if (!E.featureDone(f) && !busy) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }
function drawJackpotPlay(now) { backdrop('jackpot', now); const t = Math.min(1, (now - scene.t0) / (4200 * speed())), amt = scene.data.amount * ease(t);
  // Chasing bulbs round the whole screen.
  for (let k = 0; k < 56; k++) { const p = k / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = motionOK() ? (k + Math.floor(now / 90)) % 3 === 0 : k % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#fff1b8' : '#1d4a2a'; sg.fill(); }
  // The gold-foil card turns on its vertical axis.
  const s = 300, turn = motionOK() ? Math.cos(now / 650) : 1, sw = Math.max(.06, Math.abs(turn)); sg.save(); sg.translate(700, 120 + s / 2); sg.scale(sw, 1); sg.shadowColor = GOLD; sg.shadowBlur = 60; sg.drawImage(series1Card(), -s / 2, -s / 2, s, s); sg.restore();
  sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, 'SERIES 1, CARD 1 JACKPOT', 700, 500, 64, CREAM, 'Georgia, serif', 'center', '900'); sg.restore();
  text(sg, `${fmt(Math.round(amt))} LAYR`, 700, 600, 90, '#ffffff', 'Arial', 'center', '900'); text(sg, `SERIES 1 · CARD 1 · ${cardOf(0).name || 'THE FIRST RARE PEPE'}`, 700, 680, 20, '#9bd4a2', 'Arial', 'center', '800');
  if (t < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (t >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }
function gambleFace(r) { if (r.face) return r.face; const seed = hashStr(r.hash); if (r.parity === 'odd') { const ar = artRareIdx(), info = cardOf(ar.length ? ar[seed % ar.length] : seed % Math.max(1, RARE.length)); r.face = { tile: cardTile('chain', info, cardImages.get(info.name)), name: info.name }; } else { const info = FAKE_INFO(FAKE[seed % Math.max(1, FAKE.length)] || 'FAKERARE'); r.face = { tile: cardTile('cherry', info, cardImages.get(info.name)), name: info.name }; } return r.face; }
function drawGamblePlay(now) { backdrop('gamble', now); const r = scene.data.result, t = (now - scene.t0) / (1500 * speed()), landed = t >= .95 || !motionOK(), face = gambleFace(r);
  if (motionOK() && t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('roll');
  text(sg, 'THE CARD', 700, RY + 60, 26, '#9bd4a2', 'Arial', 'center', '900');
  // The card spins on its axis, slowing, and lands face up.
  const turn = landed ? 1 : Math.cos(t * Math.PI * (6 - 5 * t)), sw = Math.max(.05, Math.abs(turn)), cw = 220; sg.save(); sg.translate(700, RY + 195); sg.scale(sw, 1); if (turn >= 0 && landed || turn > 0 && !landed) sg.drawImage(face.tile, -cw / 2, -cw / 2, cw, cw); else drawCardBack(-cw * .35, -cw / 2, cw * .7, cw, '?', GOLD); sg.restore();
  // The proof: the last digit of the hash decides rare (odd) or fake (even).
  const tail = r.hash.slice(-14, -1), last = r.hash.slice(-1); sg.font = '900 30px Courier New'; const tw = sg.measureText('…' + tail).width, lw = 40, x0 = 700 - (tw + lw + 6) / 2;
  text(sg, 'PROOF', 700, RY + 338, 15, '#6f9a77', 'Arial', 'center', '900'); text(sg, '…' + tail, x0, RY + 372, 30, '#cfeacf', 'Courier New', 'left', '900'); round(sg, x0 + tw + 6, RY + 350, lw, 44, 8, landed ? (r.win ? ACCENT : '#25402c') : '#12301b', CREAM, 3); text(sg, landed ? last : '?', x0 + tw + 6 + lw / 2, RY + 373, 30, landed ? '#04140a' : CREAM, 'Courier New', 'center', '900');
  if (landed) { if (!scene.data.landed) { scene.data.landed = true; sfx('land'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) particles(25); } text(sg, `${r.parity === 'odd' ? 'RARE' : 'FAKE'} · ${face.name} · YOU CALLED ${r.choice === 'odd' ? 'RARE' : 'FAKE'}`, 700, RY + 428, 26, r.win ? CREAM : '#8fa595', 'Arial', 'center', '900'); button('CONTINUE', 570, RY + 462, 260, 66, () => setStage('outro')); }
  skipChip(); }
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed()));
  backdrop(kind, now, .4); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'PEPECASH CAUGHT'; total = data.total; lines = [`${data.count} free spins played at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''}`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any pack or Directory won during the Rain', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'PACK OPENED'; total = data.total; lines = [`3 cards flipped: ${(data.picks || []).map(m => `${RARITY[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = 'BINDER FILED'; total = data.total; lines = [`${data.cells}/15 pockets filled · ${data.respins} respins`, data.jackpot ? `Binder full: Series 1, Card 1 jackpot +${fmt(data.jackpot)} next` : 'Fill all 15 pockets to win Series 1, Card 1'] }
  if (kind === 'jackpot') { title = 'SERIES 1, CARD 1'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'DOUBLED' : 'FAKE OUT') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`The card was ${r.parity === 'odd' ? 'RARE' : 'FAKE'}; you called ${r.choice === 'odd' ? 'RARE' : 'FAKE'}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, title, 700, RY + 110, 64, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 220, 84, '#ffffff', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 300 + i * 36, 23, '#cfe3cc', 'Arial', 'center', '700')); sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 110, 260, 78, nextScene); }
function drawRainPlay(now) { // the reels, re-skinned: night green, falling PEPECASH, spins left and the running total
  sg.save(); sg.fillStyle = lin(sg, 0, RY, 0, RY + RH, ['#03120a', '#0b2a16', '#12401f']); sg.fillRect(RX, RY, RW, RH); sg.restore();
  const w = drawReels(now); drawRain(now);
  round(sg, 300, RY - 30, 800, 46, 12, '#04140a', ACCENT, 3); text(sg, `PEPECASH RAIN · ${state.free} SPIN${state.free === 1 ? '' : 'S'} LEFT · ${fmt(state.freeTotal)} LAYR · ALL WINS 2×`, 700, RY - 6, 20, CREAM, 'Arial', 'center', '900');
  return w; }
function drawScreen(now) {
  hits = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState();
  text(sg, height.value ? height.value.toLocaleString('en-GB') : '—', 208, 102, 46, INK, 'Courier New', 'center', '900');
  text(sg, height.value ? (height.stale ? 'LAST KNOWN · STALE' : 'BITCOIN · LIVE') : 'UNAVAILABLE', 208, 148, 15, height.stale ? '#6f8a73' : '#2f6a3d');
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, '#8fbf98');
  text(sg, fmt(hs.pot), 1192, 98, 40, INK, 'Arial', 'center', '700'); text(sg, `${hs.period.replace('-W', ' · WEEK ')}  ·  1% OF PAID BETS`, 1192, 136, 14, '#2f6a3d');
  text(sg, linkedCount.ok ? (linkedCount.value ? `≈ ${fmt(hs.pot / linkedCount.value)} PER LINKED TWIN${linkedCount.test ? ' (TEST)' : ''}` : `NO LINKED TWINS YET${linkedCount.test ? ' (TEST)' : ''}`) : 'SHARE PER TWIN: COUNT UNKNOWN', 1192, 162, 13, '#4d7a58');
  let msg, msgColor = CREAM;
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawJackpotPlay(now); labBanner(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultPlay(f, now); else if (k === 'chain' && f) drawGrabPlay(f, now); else if (k === 'gamble' && scene.data.result) drawGamblePlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'RARE OR FAKE? CALL THE CARD' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `OPEN A PACK · FLIP ${f ? 3 - f.picks.length : 0} MORE · TAP A CARD`) : scene.kind === 'chain' ? (f ? chainMsg(f, now) : 'THE DIRECTORY') : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawRainPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction); const it = w ? cameoFor(w) : null;
    msg = spinning ? 'SHUFFLING THE DIRECTORY…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  ${cameoLabel(it)}` : ''}` : state.free ? `${state.free} PEPECASH RAIN SPINS  ·  ALL WINS 2×` : state.gamble ? `WIN ${fmt(state.gamble)} · RARE OR FAKE?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'RARE PEPES · ON BITCOIN SINCE 2016'; if (state.free && !spinning) msgColor = '#fff1b8'; }
  text(sg, msg, 700, 822, 25, msgColor);
  drawBlocks();
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 926, 26, '#e3f3df', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 926, 26, '#e3f3df'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 926, 26, CREAM, 'Arial', 'right');
  labBanner(); screenTexture.needsUpdate = true; screenDirty = false;
}
// The Bonus Lab says so on the screen itself, in every view.
function labBanner() { if (!lab.on) return; sg.save(); sg.fillStyle = '#f2c14e'; sg.fillRect(0, 0, 1400, 24); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL · YOUR REAL GAME IS UNTOUCHED${lab.seedShown != null ? ` · SEED ${lab.seedShown}` : ''}`, 700, 13, 15, '#2a1d00', 'Arial', 'center', '900'); sg.restore(); }
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
  const rng = lab.on ? labRng() : forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : undefined;
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  // The result is committed to the shared account before anything moves. The Holder Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now();
  if (p.free) sound('tick');
  status(p.free ? 'PEPECASH RAIN SPIN · ALL WINS 2×' : 'SHUFFLING THE DIRECTORY…');
  // Now, and only now, choose which inscriptions show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Cameos: the card on each winning line, kept in the round's history for the future holder royalty.
function recordCameos(r) { const cameos = r.wins.map(w => { const it = cameoFor(w); return it ? { tokenId: it.id, collection: it.collection || it.key, lineWin: w.amount } : null; }).filter(Boolean); const h = state.history[0]; if (h && h.id === r.round.id) h.cameos = cameos; if (cameos.length) holderState().cameos = (holderState().cameos || 0) + cameos.length; return cameos; }
let spinEndAt = 0, sceneDue = false; // the Lab autopilot waits for the scenes a finished spin queues (they start 350 ms later)
function finishSpin() {
  spinEndAt = performance.now(); spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; recordCameos(r); save(); update();
  if (airdrop && r.round.free) airdrop.best = Math.max(airdrop.best, r.total);
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'SERIES 1, CARD 1 · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · PEPECASH' : ''}` : (r.round.free ? 'RAIN SPIN COMPLETE' : 'NO WIN THIS DEAL · TRADE AGAIN');
  if (state.gamble) msg += ' · RARE OR FAKE?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Rain.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (airdrop) airdrop.retriggers++; toast(`More PEPECASH! +${r.freeAward} Rain spins.`); sfx('sting-free'); } else toast('PEPECASH Rain cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); sceneDue = true; setTimeout(() => { sceneDue = false; startScene(q[0].kind, q[0].data || {}); }, 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(airdropOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once the Rain has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-trade stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-TRADE STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-trade.', `<p>Auto-trade spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-TRADE again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('PEPECASH RAIN', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="odd">Rare</button><button class="bar-cta" data-act="even">Fake</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Claim' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Flip ${3 - f.picks.length} of 9 cards`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Card ${i + 1}${f.picks.includes(i) ? `, ${RARITY[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 pockets · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 filled`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ›'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Turning the card…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickVault(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'RARE PEPE DIRECTORY') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
function openCollections() {
  const where = { cherry: 'Fake Rares (Counterparty)', lemon: 'Rare Pepe Directory · Series 26–36 (blue edge)', chip: 'Rare Pepe Directory · Series 13–25 (green edge)', block: 'Rare Pepe Directory · Series 2–12 (red edge)', artifact: 'Stacks NFTs, forevered through Xtrata', bitcoin: 'Rare Pepe Directory · Series 1 (gold foil)', wild: 'Ordinal Pepe, all 100 share one GIF', scatter: 'PEPECASH, a Counterparty token', vault: 'The Rare Pepe Wallet', chain: 'Any card in the Directory, real asset name' };
  const rows = Object.entries(COLS).map(([s, c]) => { const n = pools[s].filter(t => !t.placeholder).length; return `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(c.name)}</td><td>${s === 'wild' ? 'Wild' : esc(NAMES[s])}</td><td>${esc(where[s])}</td><td>${fmt(n)}</td></tr>`; }).join('');
  const arts = sources.cards || Object.keys(logoImages).length;
  showModal('collections', 'The cards on the reels.', `<p>Every symbol is Bitcoin-culture material. The <b>Rare Pepe Directory</b> is ${fmt(RARE.length)} cards in 36 series (50 a series; Series 36 holds the last 24), each a Counterparty asset on Bitcoin since 2016. Each card here carries its real asset name, series and card number; the edge colour tells the series group: gold foil for Series 1, red 2–12, green 13–25, blue 26–36. <b>Fake Rares</b> carry a purple FAKE ribbon.</p>
  <p><b>Bitcoin Pepes</b> are Stacks NFTs. One with a permanent Xtrata twin shows in full colour with a ∞ badge and its token number; one without is greyed out with a <b>NOT YET FOREVER</b> stamp. The <b>Ordinal Pepe</b> wild shows the same stamp until its Xtrata helper contract is live.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>ROLE</th><th>SOURCE</th><th>ON THE REELS</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="fine">${arts ? `${fmt(sources.cards)} card pictures and ${fmt(Object.keys(logoImages).length)} logos are bundled.` : 'Card and logo pictures are not bundled in this test build: each card shows its real asset name set in type on the card face, never a drawing. The numbers and names are real; the pictures wait for each artist and project to agree.'} Art is chosen after each result is fixed, using a separate random draw, so what loads can never change your odds. ${fmt(sources.bundled)} Bitcoin Pepes bundled, ${fmt(sources.images)} loaded live${sources.listFailures || sources.imageFailures ? `, ${sources.listFailures + sources.imageFailures} skipped` : ''}. Artwork belongs to each artist and project; test build, shown pending their OK.</p><button class="outline" id="colHolders">Holder Pot ↗</button>`, 'THE CARDS');
  $('colHolders').onclick = openHolders;
}
function openHolders() {
  const h = holderState();
  showModal('holders', 'The Holder Pot.', `<p>1% of every paid bet on Rare Pepe Directory goes into this week's Holder Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(h.period)}</span><strong>${fmt(h.pot)}</strong></div><div><span>LAST WEEK${h.last ? ` · ${esc(h.last.period)}` : ''}</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div><div><span>CAMEOS RECORDED</span><strong>${fmt(h.cameos || 0)}</strong></div></div>
  <p><b>How it will pay.</b> Holders link a Bitcoin address by signing a message from it (Leather and Xverse both hold a Bitcoin and a Stacks account). At the end of each week the pot is split per twin held from the reel collections. When your Bitcoin Pepe lands on a winning line, its token number shows in the win message and the round records it as a cameo for a 1% royalty.</p>
  <p class="fine">Version 1 shows the meters only. Address linking, the linked-twin count, snapshots and payouts need a server or contract and are not built yet, so the share per twin shows as unknown rather than a guess. The pot meter is kept with this browser's LAYR session.${lab.on ? ' In the Bonus Lab the pot is not touched.' : ''}</p><button class="outline" disabled>Link a Bitcoin address · coming soon</button>`, 'HOLDER REWARDS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The Directory: pays.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. An <b>Ordinal Pepe</b> is wild: it replaces every paying symbol and has its own pays, but never replaces PEPECASH, a Rare Pepe Wallet or a Directory card.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five Series 1 Rare Pepes on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>PEPECASH RAIN</h3><p>3, 4 or 5 PEPECASH anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. PEPECASH rains down the binder and every win pays <b>2×</b>. More PEPECASH adds 4 spins, up to 24 per feature. Your bet is locked for the feature. Open a Pack and The Directory can trigger during it and pay at 1×.</p>
  <h3>OPEN A PACK</h3><p>3 or more Rare Pepe Wallets put a booster pack on the screen, fanned into nine face-down cards. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you flip any. Flip three; each shows a card from its rarity: Fake Rare 1× to 2×, Series 26–36 3× to 5×, Series 13–25 8×, Series 2–12 10×, Series 1 15×.</p>
  <h3>THE DIRECTORY</h3><p>5 or more Directory cards start a hold-and-respin. Each locks into the 15-pocket binder as a real card worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty pocket has a 1 in ${E.CHAIN_ODDS} (4%) chance to fill per respin, and any new card resets the count to 3. Fill all 15 to win the Series 1, Card 1 Jackpot as well.</p>
  <h3>SERIES 1, CARD 1 JACKPOT</h3><p>Five Series 1 Rare Pepes on the centre row (wilds don't count), or all 15 pockets filled, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>RARE OR FAKE</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call: is the card about to turn a Rare Pepe or a Fake Rare? Right doubles the win; wrong loses that win only. The proof shown is the hash whose last digit decides it: odd is Rare, even is Fake.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Rare Pepe Directory runs on the same engine as Block Fortune, Ordinal Rush and Snow Crash: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which cards to show, using a separate random draw, so the pictures can never change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, PEPECASH scatter pays 1.5%, the Rain 8.5%, Open a Pack 11.9%, The Directory 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. The Rain and Open a Pack each arrive about 1 in 140 spins, The Directory about 1 in 290, the Series 1, Card 1 Jackpot about 1 in 113,000. Rare or Fake is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The cards on the reels ↗</button> <button class="outline" id="rulesHolders">Holder Pot ↗</button>`, 'THE DIRECTORY · HOW TO PLAY');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['PEPECASH Rain', 'Three PEPECASH anywhere pay a scatter prize and award 8 free spins. Every win is doubled, and more PEPECASH adds 4 spins, up to 24 per feature.'], vault: ['Open a Pack', 'Three Rare Pepe Wallets put a booster pack on the screen, fanned into nine face-down cards. Flip three: each reveals a card and a prize from 1× to 15× your total bet.'], chain: ['The Directory', 'Five Directory cards start a hold-and-respin. Cards lock into a 15-pocket binder, any new card resets your three respins, and filling the binder wins the Series 1, Card 1 Jackpot.'], genesis: ['Series 1, Card 1 Jackpot', 'A progressive meter for each bet level. Land five Series 1 Rare Pepes on the centre row, or fill all 15 Directory pockets, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'SERIES 1, CARD 1').replace('CHAIN', 'THE DIRECTORY').replace('VAULT', 'OPEN A PACK').replace('FREE SPINS', 'PEPECASH RAIN').replace('RETRIGGER', 'MORE PEPECASH');
function openHistory(){
 const body=`${lab.on ? '<p class="lab-note"><b>BONUS LAB.</b> These rounds are practice only. They are not part of your real history, balance or RTP statistics.</p>' : ''}<div class="stat-cards"><div><span>WAGERED · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.paidOut)}</strong></div></div><p>Latest 50 rounds. All amounts use the shared LAYR account${lab.on ? ' (here: the Lab\'s own practice balance)' : ''}. The card on a winning line is recorded with each round.</p><table class="paytable"><thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th><th>ON THE LINE</th></tr></thead><tbody>${state.history.map(h=>`<tr><td>${lab.on ? '<b class="lab-tag">LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Rain spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${(h.cameos||[]).slice(0,2).map(c=>esc(String(c.tokenId))).join(', ')}</td></tr>`).join('')}</tbody></table><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history',lab.on ? 'Lab session (practice LAYR).' : 'Your LAYR session.',body,lab.on ? 'LAB · LAYR HISTORY' : 'LAYR HISTORY');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,lab:lab.on,currency:'LAYR',wagered:state.wagered,paidOut:state.paidOut,holder:lab.on?null:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+(lab.on?'-LAB':'')+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', lab.on ? 'Lab practice LAYR.' : 'Your LAYR account.', `<div class="stat-cards"><div><span>${lab.on ? 'LAB PRACTICE LAYR' : 'AVAILABLE LAYR'}</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>${lab.on ? 'This is the Bonus Lab\'s own practice balance. Your real LAYR is untouched.' : 'Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.'}</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, lab.on ? 'BONUS LAB' : 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no particles or PEPECASH rain)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space trades, respins and collects. 1–9 flip pack cards. R calls Rare, K calls Fake. M mutes. F is full screen.${LAB_OK ? ' L opens the Bonus Lab.' : ''}</p><button class="outline" id="setCols">The cards on the reels</button><button class="outline" id="setHolders">Holder Pot</button><button class="outline" id="setHistory">Session history</button>${LAB_OK ? `<button class="outline" id="setLab">${lab.on ? 'Bonus Lab (open)' : 'Bonus Lab'}</button>` : ''}`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory; if ($('setLab')) $('setLab').onclick = () => { closeModal(); openLab(); };
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Rare Pepe Directory runs on the same engine as Block Fortune, Ordinal Rush and Snow Crash: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which cards to show, using a separate random draw, so the card art can never change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>PEPECASH scatter pays</td><td>1.5%</td><td>with the Rain</td></tr><tr><td>PEPECASH Rain (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>Open a Pack (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>The Directory (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Series 1, Card 1 Jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Rare or Fake is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win.</p>`, 'FAIR PLAY');
}


/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'TRADE', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['odd', 'RARE', 'call rare', 'fb gold'], ['even', 'FAKE', 'call fake', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'RARE/FAKE?', 'gamble win', 'fb gold'],
  ['betDown', '−PEPECASH', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+PEPECASH', 'bet up', 'fb'], ['max', 'MAX BET', 'max bet', 'fb'], ['auto', 'AUTO-TRADE', 'auto', 'fb'],
  ['pays', 'DIRECTORY', 'pays', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'HISTORY', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), gamble: () => openGamble(), betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => enterLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 6).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(6).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free;
  q('primary').querySelector('b').textContent = spinning ? 'TRADING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('odd', gambleIntro); show('even', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0);
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance);
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TRADE';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); if (LAB_OK) q('lab').querySelector('b').textContent = lab.on ? 'LAB ●' : 'LAB';
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
// The casino never sets PX_STANDALONE_TEST, so on the public casino RarePepeDirectory.test is null.
// Forced reel stops. Each is a real engine round; only the stop positions are chosen. Verified against the engine (see tools/check-lab-plans.cjs).
const S = { win: [15, 8, 23, 30, 4], s3: [9, 9, 9, 0, 0], s4: [9, 9, 9, 9, 0], s5: [9, 9, 9, 9, 9], vault: [20, 20, 20, 20, 20], chain: [0, 0, 0, 0, 0], jackpot: [8, 3, 14, 0, 15] };
const TEST_STOPS = { free: S.s3, vault: S.vault, chain: S.chain, jackpot: S.jackpot, win: S.win };
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

/* ---------- Bonus Lab: every bonus on demand, without touching anything real ----------
   The Lab swaps in the raw Block Fortune engine and a fresh state of its own, so the LAYR account, the saved game, the jackpot meters,
   the Holder Pot and the RTP statistics are never read or written (save(), locked() and holderAdd() all step aside while lab.on).
   Each item hands the engine's own start(state, rng) a scripted generator: the reel stops (and, for the full binder, the locks) are
   set, every other draw comes from a seeded generator, so a seed replays the same round exactly. Nothing in the engine is replaced. */
const LAB_ITEMS = [
  { id: 'free', label: 'PEPECASH Rain', sub: '3 PEPECASH · 8 free spins at 2×', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'retrigger', label: 'More PEPECASH', sub: 'Rain, then 3 PEPECASH on the first free spin: +4 spins', kind: 'free', plan: [{ stops: S.s3 }, { stops: S.s3 }] },
  { id: 'pick', label: 'Open a Pack', sub: '3 Rare Pepe Wallets · flip three of nine', kind: 'vault', plan: [{ stops: S.vault }] },
  { id: 'hold', label: 'The Directory', sub: '9 Directory cards · hold and respin', kind: 'chain', plan: [{ stops: S.chain }] },
  { id: 'fullgrid', label: 'Full binder', sub: 'Every pocket fills: Series 1, Card 1 jackpot', kind: 'chain', also: 'jackpot', plan: [{ stops: S.chain, lockAll: true }] },
  { id: 'centre', label: 'Centre-row jackpot', sub: 'Five Series 1 Rare Pepes on the centre row', kind: 'jackpot', plan: [{ stops: S.jackpot }] },
  { id: 'gamble-win', label: 'Rare or Fake: win', sub: 'A plain win, then a correct call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'win' },
  { id: 'gamble-loss', label: 'Rare or Fake: loss', sub: 'A plain win, then a wrong call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'loss' },
  { id: 'scatter3', label: '3 PEPECASH', sub: 'Pays 2× bet and starts the Rain', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'scatter4', label: '4 PEPECASH', sub: 'Pays 5× bet and starts the Rain', kind: 'free', plan: [{ stops: S.s4 }] },
  { id: 'scatter5', label: '5 PEPECASH', sub: 'Pays 10× bet and starts the Rain', kind: 'free', plan: [{ stops: S.s5 }] }
];
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Object.assign(lab, { mode: 'seeded', rand: mulberry(lab.seed), seen: [], results: null, running: null, gambleWant: null, seedShown: null, autopilot: false, bet: 100 });
// The engine's own start(state, rng) gets this: the plan's stops (and locks) first, then the seeded stream (or crypto in random play).
function labRng() {
  const plan = lab.script.shift() || null; let k = 0, scripted = !!plan;
  return n => {
    if (plan) { if (n === 32 && plan.stops && k < 5) return plan.stops[k++]; if (plan.lockAll && n === 25) return 0; }
    return scripted || lab.mode === 'seeded' ? Math.floor(lab.rand() * n) : BF.randomInt(n);
  };
}
// Rare or Fake in the Lab: the first draw is the parity, so a win or a loss can be set after the player has called.
function labGambleRng(choice) { let first = true; return n => { if (first && n === 2) { first = false; const odd = lab.gambleWant === 'loss' ? choice !== 'odd' : choice === 'odd'; return odd ? 1 : 0; } return Math.floor(lab.rand() * n); }; }
function labSeen(kind, stage) { if (lab.on) lab.seen.push(`${kind}:${stage}`); }
const labBusy = () => spinning || scene || feature() || state.free > 0 || state.freeActive || state.pending;
function labClean() { if (spinning) return false; scene = null; sceneQueue = []; airdrop = null; hideBar(); jackpotMusic(false); stopAuto(); clearTimeout(scheduleFree.t);
  state.features = []; state.pending = null; state.free = 0; state.freeActive = false; state.freeAwarded = 0; state.freeTotal = 0; state.freeCount = 0; state.gamble = 0; lastResult = null; return true; }
function enterLab() {
  if (!LAB_OK) return false;
  if (lab.on) { openLab(); return true; }
  if (sessionLock || !LAYR.ready()) { toast('Connect your LAYR account first, then open the Bonus Lab.'); return false; }
  if (spinning || scene || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus Lab.'); return false; }
  stopAuto(); closeModal();
  lab.real = state; const s = BF.fresh(); s.balance = lab.bank; for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; lab.rand = mulberry(lab.seed); lab.results = null; lab.seen = []; lab.last = null; lab.seedShown = null;
  refaceIdle(); screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); toast('Bonus Lab: practice LAYR only. Your real balance and game are untouched.');
  openLab(); return true;
}
function exitLab() {
  if (!lab.on) return true;
  if (spinning) { toast('Wait for the reels to stop, then leave the Bonus Lab.'); return false; }
  stopAP(); labClean(); closeModal();
  state = lab.real; E = E0; lab.on = false; lab.real = null; lab.seedShown = null; lab.script = []; lastResult = null;
  refaceIdle(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
function runLabItem(item, opts = {}) {
  if (!lab.on) return 'not-in-lab'; if (spinning) return 'busy'; labClean(); closeModal();
  const seed = opts.seed != null ? opts.seed >>> 0 : lab.mode === 'random' ? (Math.random() * 4294967296) >>> 0 : lab.seed >>> 0;
  lab.rand = mulberry(seed); lab.seedShown = seed; lab.last = { id: item.id, seed }; lab.seen = []; lab.running = item.id; lab.gambleWant = item.gamble || null;
  lab.script = item.plan.map(p => ({ ...p })); state.jackpots = BF.fresh().jackpots; state.bet = lab.bet; state.freeBet = lab.bet; if (state.balance < 5000) state.balance = lab.bank;
  lab.startBalance = state.balance; screenDirty = true; spin(); return 'ok';
}
const labItem = id => LAB_ITEMS.find(i => i.id === id);
function labReplay() { if (!lab.last) { toast('Nothing to replay yet: run an item first.'); return 'none'; } return runLabItem(labItem(lab.last.id), { seed: lab.last.seed }); }
// Autopilot: drives the scenes like a player would. Run all uses it with turbo on and skips the free-spin animation.
const AP = { on: false, timer: 0, fast: false, queue: [], item: null, deadline: 0, results: [], restoreTurbo: null };
function stopAP() { clearInterval(AP.timer); AP.timer = 0; AP.on = false; AP.queue = []; AP.item = null; if (AP.restoreTurbo !== null) { state.turbo = AP.restoreTurbo; AP.restoreTurbo = null; } }
function apStart(fast) { AP.on = true; AP.fast = fast; clearInterval(AP.timer); AP.timer = setInterval(apStep, 140); }
function apFinish(ok, why) {
  const it = AP.item; if (!it) return; const stages = [...new Set(lab.seen)], need = [it.kind, it.also].filter(Boolean);
  const complete = need.every(k => ['trigger', 'intro', 'outro'].every(s => stages.includes(`${k}:${s}`)));
  const rec = { id: it.id, label: it.label, seed: lab.seedShown, ok: ok && complete, why: ok && complete ? '' : (why || 'missing stages'), net: Math.round((state.balance - lab.startBalance) * 100) / 100, stages };
  AP.results.push(rec); lab.results = AP.results.slice(); AP.item = null; state.gamble = 0;
  if (AP.queue.length) { setTimeout(() => { if (!AP.on) return; const next = AP.queue.shift(); AP.item = next; AP.deadline = performance.now() + 90000; runLabItem(next); }, 350); return; }
  const all = AP.results.slice(); stopAP(); update(); status(`LAB · RAN ${all.length} ITEMS`); openLab();
}
function apStep() {
  if (!lab.on || !AP.on) { stopAP(); return; } if (!AP.item) return; if (performance.now() > AP.deadline) { apFinish(false, 'timed out'); return; }
  if (spinning || $('modal').open || sceneDue || performance.now() - spinEndAt < 400) return;
  if (scene) { const { kind, stage } = scene;
    if (stage === 'trigger') return;
    if (stage === 'intro') { if (kind === 'gamble') callGamble('odd'); else primaryAction(); return; }
    if (stage === 'play') {
      if (kind === 'vault') { const f = feature(); if (f && !E.featureDone(f)) { const i = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(j => !f.picks.includes(j)); pickVault(i); } else if (f) collectScene(); return; }
      if (kind === 'chain') { featureAction(); return; }
      if (kind === 'jackpot') { if (AP.fast || performance.now() - scene.t0 > 4600 * speed()) setStage('outro'); return; }
      if (kind === 'gamble') { if (scene.data.landed) setStage('outro'); return; }
      return; }
    if (stage === 'outro') { if (performance.now() - scene.t0 > 1500 * speed()) nextScene(); return; }
    return; }
  if (sceneQueue.length || feature()) { nextScene(); return; }
  if (state.freeActive && !state.free) { airdropOutro(); return; }
  if (state.free > 0) { if (AP.fast) { skipScene(); } else if (!spinning) spin(); return; }
  if (state.gamble > 0 && AP.item.gamble) { openGamble(); return; }
  apFinish(true);
}
function labRunAll() {
  if (!lab.on) return 'not-in-lab'; if (spinning) return 'busy'; stopAP(); closeModal();
  AP.results = []; lab.results = null; AP.restoreTurbo = !!state.turbo; state.turbo = true; AP.queue = LAB_ITEMS.slice(); AP.item = AP.queue.shift(); AP.deadline = performance.now() + 90000; apStart(true); runLabItem(AP.item); return 'ok';
}
function labRunOne(item, opts = {}) { const r = runLabItem(item, opts); if (r === 'ok' && (lab.autopilot || opts.autopilot)) { stopAP(); AP.results = []; AP.item = item; AP.deadline = performance.now() + 120000; apStart(false); } return r; }
function openLab() {
  if (!LAB_OK) return;
  const rows = (lab.results || []).map(r => `<tr><td>${esc(r.label)}</td><td>${r.ok ? '<b class="lab-ok">PASS</b>' : `<b class="lab-bad">${esc(r.why)}</b>`}</td><td>${fmt(r.net)}</td><td>${r.seed}</td></tr>`).join('');
  showModal('lab', 'Bonus Lab.', `<p class="lab-note">Practice play: your own LAYR, saved game, jackpot meters, Holder Pot and RTP statistics are not touched, and nothing here is saved. Each item deals a real round through the real engine with its own scripted reel stops, then plays the scene. The Lab has its own practice balance and the screen says so.</p>
  <div class="lab-ctl"><label class="setting">Seeded (the same seed always replays the same round)<input type="radio" name="labMode" value="seeded" ${lab.mode === 'seeded' ? 'checked' : ''}></label><label class="setting">Random (a new seed each run, shown on the screen)<input type="radio" name="labMode" value="random" ${lab.mode === 'random' ? 'checked' : ''}></label><label class="setting">Seed<input type="number" id="labSeed" min="0" max="4294967295" value="${lab.seed}"></label><label class="setting">Autopilot (play the scenes for me)<input type="checkbox" id="labAuto" ${lab.autopilot ? 'checked' : ''}></label></div>
  <div class="test-grid">${LAB_ITEMS.map(i => `<button class="cta" data-lab="${i.id}"><b>${esc(i.label)}</b><br><small>${esc(i.sub)}</small></button>`).join('')}</div>
  <div class="lab-row"><button class="outline" id="labReplay" ${lab.last ? '' : 'disabled'}>Replay last${lab.last ? ` (${esc(labItem(lab.last.id).label)}, seed ${lab.last.seed})` : ''}</button><button class="outline" id="labAll">Run all ${LAB_ITEMS.length}</button><button class="outline" id="labReset">Reset practice balance (${fmt(lab.bank)})</button><button class="outline" id="labLeave">Leave the Lab</button></div>
  ${rows ? `<h3>LAST RUN</h3><table class="paytable"><thead><tr><th>ITEM</th><th>RESULT</th><th>NET · LAB LAYR</th><th>SEED</th></tr></thead><tbody>${rows}</tbody></table>` : ''}`, 'BONUS LAB');
  document.querySelectorAll('[name=labMode]').forEach(r => r.onchange = () => { lab.mode = r.value; });
  $('labSeed').onchange = e => { const v = Number(e.target.value); if (Number.isFinite(v) && v >= 0) lab.seed = Math.floor(v) >>> 0; lab.rand = mulberry(lab.seed); };
  $('labAuto').onchange = e => { lab.autopilot = e.target.checked; };
  document.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => labRunOne(labItem(b.dataset.lab)));
  $('labReplay').onclick = () => labReplay(); $('labAll').onclick = () => labRunAll(); $('labLeave').onclick = () => { closeModal(); exitLab(); };
  $('labReset').onclick = () => { if (spinning) return; labClean(); state.balance = lab.bank; state.jackpots = BF.fresh().jackpots; state.bet = lab.bet; update(); toast(`Practice balance reset to ${fmt(lab.bank)}.`); };
}
const labApi = LAB_OK ? Object.freeze({
  items: () => LAB_ITEMS.map(i => ({ id: i.id, label: i.label, kind: i.kind })), on: () => lab.on, enter: () => enterLab(), exit: () => exitLab(),
  run: (id, o = {}) => { const it = labItem(id); if (!it) throw Error('Unknown Lab item: ' + id); return labRunOne(it, o); },
  replay: () => labReplay(), runAll: () => labRunAll(), abort: () => { stopAP(); return labClean(); }, results: () => (lab.results || []).map(r => ({ ...r })), last: () => lab.last && { ...lab.last }, running: () => AP.on,
  setMode: (mode, seed) => { lab.mode = mode === 'random' ? 'random' : 'seeded'; if (seed != null) { lab.seed = seed >>> 0; lab.rand = mulberry(lab.seed); } return { mode: lab.mode, seed: lab.seed }; },
  state: () => lab.on ? { balance: state.balance, spins: state.spins, wagered: state.wagered, paidOut: state.paidOut, seed: lab.seedShown, seen: [...lab.seen] } : null,
  open: () => openLab(), plans: () => LAB_ITEMS.map(i => ({ id: i.id, plan: i.plan.map(p => ({ ...p })), gamble: i.gamble || null }))
}) : null;
const testApi = TEST_OK ? Object.freeze({
  kinds: Object.keys(TEST_STOPS),
  force(kind) { if (!TEST_STOPS[kind]) throw Error('Unknown test feature: ' + kind); testStops = TEST_STOPS[kind].slice(); return true; },
  // Force, then spin straight away (the gamble needs a paid win first, so 'gamble' forces a plain win and opens the call).
  play(kind) { if (lab.on || scene || spinning || feature() || state.free) return false; if (kind === 'gamble') { testStops = TEST_STOPS.win.slice(); spin(); const t = setInterval(() => { if (!spinning) { clearInterval(t); if (state.gamble) openGamble(); } }, 100); return true; } this.force(kind); spin(); return true; },
  twins(mode) { if (!['default', 'none', 'some', 'all'].includes(mode)) throw Error('default, none, some or all'); twinMode = mode; retile('artifact'); retile('wild'); update(); return { mode, forever: pools.artifact.filter(t => t.forever).length, of: pools.artifact.length, wild: pools.wild.map(t => !!t.forever) }; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); linkedCount = { ok: true, value: LINKED_TEST[mode], test: true }; screenDirty = true; update(); return linkedCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on), lab: labApi
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops; nothing here exists on the public casino.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">PEPECASH Rain</button><button class="cta" data-t="vault">Open a Pack</button><button class="cta" data-t="chain">The Directory</button><button class="cta" data-t="jackpot">Series 1, Card 1</button><button class="cta" data-t="gamble">Rare or Fake</button></div>
  <h3>TWINS (BITCOIN PEPES AND ORDINAL PEPE)</h3><div class="ab"><button class="outline" data-w="default">As loaded</button><button class="outline" data-w="none">None</button><button class="outline" data-w="some">Some</button><button class="outline" data-w="all">All</button></div><p class="fine">Switches how many twins show as forevered. The rest are greyed with NOT YET FOREVER.</p>
  <h3>LINKED HOLDERS</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>${LAB_OK ? '<h3>BONUS LAB</h3><button class="outline" id="tLab">Open the Bonus Lab</button>' : ''}`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  document.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.w); toast(`Twins: ${b.dataset.w}.`); });
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.linkedHolders(b.dataset.h); toast(`Linked holders: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked); if ($('tLab')) $('tLab').onclick = () => { closeModal(); enterLab(); };
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Rain 1 in ${r.freeEvery.toFixed(0)} · Pack 1 in ${r.pickEvery.toFixed(0)} · Directory 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }


/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return;
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickVault(Number(e.key) - 1);
  else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') requestFullscreen(!fsOn); else if (e.key.toLowerCase() === 's' && canSkip()) skipScene();
  else if (e.key.toLowerCase() === 'r' && scene?.kind === 'gamble') callGamble('odd'); else if (e.key.toLowerCase() === 'k' && scene?.kind === 'gamble') callGamble('even');
  else if (e.key.toLowerCase() === 'l' && LAB_OK) { if (lab.on) openLab(); else enterLab(); }
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-TRADE STOPPED'); } } updateFsBar(); });
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
  if (lab.on) { labClean(); lab.on = false; E = E0; lab.real = null; }
  state=LAYR.openGame(GAME_ID,E); holderState();
  if (state.pending) { lastResult = E.settle(state); recordCameos(lastResult); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startScene(feature().type, {}, 'intro'); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { renderBar(); status(`${state.free} SAVED PEPECASH RAIN SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(airdropOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; live top-ups start only after the frame has loaded and a player connects, so a slow
// network can never hold up the cabinet becoming ready.
let liveStarted = false; const startLive = () => { if (liveStarted) return; liveStarted = true; loadLive().catch(() => { sources.done = true; }); };
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.RarePepeDirectory = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), height: () => ({ ...height }), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
  soundLog: () => soundLog.map(e => ({ ...e })), perf: () => ({ ...perf }), screen: () => screen,
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes },
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
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();else if(action==='lab'&&LAB_OK)enterLab();
  else if(clicks[action])document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // show: the scene on screen now, so a host can light the cabinet (topper speed, floor glow) during bonuses.
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());readHeight();clearInterval(heightTimer);heightTimer=setInterval(readHeight,120000);setTimeout(startLive,0);if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab.on&&!exitLab())return false;stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;clearInterval(heightTimer);if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
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
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'TRADE',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();

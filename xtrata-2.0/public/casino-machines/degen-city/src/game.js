/* Degen City — a ParallaX Casino machine. A split cabinet for the CityCoins-era rivalry: Miami Degens (left, orange) against NYC Degens
   (right, blue). Every symbol is real: the MiamiCoin, NYCCoin and CityCoins logos, the two Degens collections' Forever Twins on Xtrata
   (and, greyed with NOT YET FOREVER, their untwinned tokens), the collection logos, and Xtrata inscription IDs. The maths is the shared
   Block Fortune v2 engine (BF) unchanged: every outcome is fixed by BF before any art is chosen, and art is picked with Math.random,
   never the engine's generator, so loaded art can never change a result. The casino owns all 3D rendering and cameras; this frame only
   draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
let GAME_ID='degen-city', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
const E0 = E; // the Bonus Lab swaps E for the raw engine and back; nothing else ever does
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, MIA = '#e8590c', NYC = '#1f5fe0', ACCENT = MIA, CREAM = '#f4ecd2', GOLD = '#f2c14e', SILVER = '#c3cad6';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'MiamiCoin', lemon: 'NYCCoin', chip: 'Miami Degen', block: 'NYC Degen', artifact: 'Trailing-city Degen', bitcoin: 'Leading-city Degen', wild: 'Split Degen', scatter: 'CityCoins', vault: 'Safe-deposit box', chain: 'City block' };
const SHORT = { cherry: 'MIA', lemon: 'NYC', chip: 'MIAMI DEGEN', block: 'NYC DEGEN', artifact: 'TRAILING DEGEN', bitcoin: 'LEADING DEGEN', wild: 'SPLIT DEGEN', scatter: 'CITYCOINS', vault: 'VAULT BOX', chain: 'CITY BLOCK' };
// Which city each frame belongs to. The frames of `artifact` (silver) and `bitcoin` (gold) follow the city race: see rebuildCityPools().
const COLS = {
  cherry:   { key: 'miamicoin',      name: 'MiamiCoin (MIA)',            color: MIA,    kind: 'logo', logo: 'mia' },
  lemon:    { key: 'nycoin',         name: 'NYCCoin (NYC)',              color: NYC,    kind: 'logo', logo: 'nyc' },
  chip:     { key: 'miami-degens',   name: 'Miami Degens',               color: MIA,    kind: 'twin', city: 'miami' },
  block:    { key: 'nyc-degens',     name: 'NYC Degens',                 color: NYC,    kind: 'twin', city: 'nyc' },
  artifact: { key: 'trailing-city',  name: "Trailing city's Degens",     color: SILVER, kind: 'twin' },
  bitcoin:  { key: 'leading-city',   name: "Leading city's Degens",      color: GOLD,   kind: 'twin', foil: true },
  wild:     { key: 'split-degen',    name: 'Split Degen',                color: CREAM,  kind: 'twin', split: true },
  scatter:  { key: 'citycoins',      name: 'CityCoins',                  color: '#f6f7fb', kind: 'logo', logo: 'citycoins' },
  vault:    { key: 'degens-logos',   name: 'Degens collection logos',    color: '#dfe6f5', kind: 'logo' },
  chain:    { key: 'city-block',     name: 'City block',                 color: '#8fa3c7', kind: 'block' }
};
const CITY = { miami: { id: 'miami', name: 'MIAMI', long: 'Miami Degens', col: MIA, coin: 'MIA', slot: 'chip', key: 'miami-degens', dark: '#1e0d05' }, nyc: { id: 'nyc', name: 'NEW YORK', long: 'NYC Degens', col: NYC, coin: 'NYC', slot: 'block', key: 'nyc-degens', dark: '#06122e' } };
const CITIES = ['miami', 'nyc'], other = c => c === 'miami' ? 'nyc' : 'miami';
const ART = window.DC_ART || { twins: { miami: [], nyc: [] }, logos: {} }, MANIFEST = window.DC_MANIFEST || { miami: {}, nyc: {} };
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
// The pot is split 60% to the twins of the leading city and 40% to the twins of the other city.
const HOLDER_RATE = 0.01, SPLIT_LEAD = 0.6, SPLIT_OTHER = 0.4;
function weekId(t = Date.now()) { const d = new Date(t), day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day + 3); const y = d.getUTCFullYear(), jan4 = new Date(Date.UTC(y, 0, 4)); const w = 1 + Math.round(((d - jan4) / 864e5 - 3 + (jan4.getUTCDay() + 6) % 7) / 7); return `${y}-W${String(w).padStart(2, '0')}`; }
// The city race. `raceCounts` are the twins counted from each city's helper (the helper's inscribed-count): null means unknown, never zero.
// At each snapshot (the weekly rollover) the city whose collection gained more new twins in the period becomes the leading city for the next one.
// This changes only which art fills the gold and silver frames, never the maths.
const raceCounts = { miami: null, nyc: null };
function holderState() {
  const now = weekId(); let h = state.holder;
  if (!h || typeof h !== 'object') h = state.holder = { period: now, pot: 0, last: null, cameos: 0 };
  if (h.leader !== 'miami' && h.leader !== 'nyc') h.leader = 'miami'; // before the first snapshot, Miami (the first city on the cabinet) leads
  if (h.period !== now) {
    const gm = raceGain('miami', h), gn = raceGain('nyc', h); let lead = h.leader;
    if (gm != null && gn != null && gm !== gn) lead = gm > gn ? 'miami' : 'nyc'; // a tie, or an unknown read, keeps the current leader
    h.last = { period: h.period, pot: Math.round(h.pot * 100) / 100, leader: h.leader, gain: { miami: gm, nyc: gn } };
    h.period = now; h.pot = 0; h.leader = lead; h.base = null;
  }
  if (!h.base && raceCounts.miami != null && raceCounts.nyc != null) h.base = { miami: raceCounts.miami, nyc: raceCounts.nyc }; // the period's starting line, set the first time both reads succeed
  return h;
}
function raceGain(city, h = holderState()) { return h.base && raceCounts[city] != null && h.base[city] != null ? Math.max(0, raceCounts[city] - h.base[city]) : null; }
let raceOverride = null; // the test page can pin the leader; real play never sets it
const leader = () => raceOverride || holderState().leader;
const trailer = () => other(leader());
function holderAdd(bet) { if (lab.on) return; const h = holderState(); h.pot = Math.round((h.pot + bet * HOLDER_RATE) * 1e4) / 1e4; }
const potShare = city => holderState().pot * (city === leader() ? SPLIT_LEAD : SPLIT_OTHER);
const perTwin = city => raceCounts[city] ? potShare(city) / raceCounts[city] : null;
// Everything that needs a server or a contract is out of scope for version 1. These stubs are the named seams for it.
// TODO(holder-layer-v2): link a Bitcoin address by signing a message from it (Leather and Xverse hold Bitcoin and Stacks accounts).
// TODO(holder-layer-v2): at the snapshot, read every twin of each city from its helper (a checked read: a failed read is "unknown", never "none"),
//   split the pot 60/40 between the leading and the other city, divide by twins per city, pay the cameo royalty, holder spins and the Forever Fund.
const HolderRewards = Object.freeze({
  status: 'v1-display-only',
  linkBitcoinAddress: async () => ({ ok: false, value: null, reason: 'TODO: Bitcoin address linking (signed message) is not built yet.' }),
  countLinkedTwins: async () => ({ ok: false, value: null, reason: 'TODO: needs the holder-link service; unknown, not zero.' }),
  snapshotPot: async () => ({ ok: false, value: null, reason: 'TODO: weekly snapshot, city-race result and 60/40 payout need a server or contract.' }),
  claim: async () => ({ ok: false, value: null, reason: 'TODO: claims need an on-chain LAYR token.' }),
  holderSpins: async () => ({ ok: false, value: null, reason: 'TODO: weekly holder spins need linked holders.' }),
  foreverFund: async () => ({ ok: false, value: null, reason: 'TODO: Forever Fund refunds apply to Stacks twins.' })
});
let linkedCount = { ok: false, value: null };
HolderRewards.countLinkedTwins().then(r => { linkedCount = r; screenDirty = true; }).catch(() => {});

/* ---------- Bitcoin block height, read live (shown on the screen header) ---------- */
const HEIGHT_KEY = 'xtrata.parallax.degen-city.height';
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
  $('winLabel').textContent = showFree ? 'MINING WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} MINING SPINS · 2×` : lab.on ? 'LAB LAYR' : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'DRIVING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-PILOT';
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
// A cheer: a small crowd chanting one long vowel (ah opening to eh), made from detuned sawtooth voices through two formant filters.
function crowdCheer(at = 0, loud = 1) {
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
  if (kind === 'win') { arp([523.25, 659.25, 783.99, 1046.5], .055, .08, .06); coins(6, .25); cityFlavor(0); }
  if (kind === 'big') { arp([392, 523.25, 659.25, 783.99, 1046.5, 1318.5], .06, .12, .06); arp([196, 261.63, 329.63, 392], .12, .3, .05, 'triangle'); coins(26, .2); crowdCheer(.15, 1); cityFlavor(.1, true); }
  if (kind === 'bonus') { arp([392, 523.25, 659.25, 783.99, 1046.5], .1, .22, .07, 'square'); cityFlavor(.05, true); }
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

/* ---------- Reel tiles: the Degens in their frames, the city coins and logos, and the city blocks ---------- */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px, which keeps ~150 tiles within phone canvas-memory limits
function fitSize(g, s, maxW, size, min = 9, weight = '900', font = 'Arial') { g.font = `${weight} ${size}px ${font}`; while (g.measureText(s).width > maxW && size > min) { size--; g.font = `${weight} ${size}px ${font}`; } return size; }
function drawInfinity(g, cx, cy, w, color, lw = 3.4) { const h = w * .26; g.save(); g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx, cy); g.bezierCurveTo(cx + w * .1, cy - h * 1.5, cx + w * .5, cy - h * 1.3, cx + w * .5, cy); g.bezierCurveTo(cx + w * .5, cy + h * 1.3, cx + w * .1, cy + h * 1.5, cx, cy); g.bezierCurveTo(cx - w * .1, cy - h * 1.5, cx - w * .5, cy - h * 1.3, cx - w * .5, cy); g.bezierCurveTo(cx - w * .5, cy + h * 1.3, cx - w * .1, cy + h * 1.5, cx, cy); g.stroke(); g.restore(); }
function greyscale(img, w, h, smooth) { const t = canvas(w, h), tg = t.getContext('2d'); tg.imageSmoothingEnabled = smooth; const fit = Math.min(w / img.width, h / img.height), k = !smooth && fit >= 1 ? Math.floor(fit) : fit; tg.drawImage(img, (w - img.width * k) / 2, (h - img.height * k) / 2, img.width * k, img.height * k);
  try { const d = tg.getImageData(0, 0, w, h), p = d.data; for (let i = 0; i < p.length; i += 4) { const v = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = v * .82 + 18; } tg.putImageData(d, 0, 0); } catch (e) { tg.fillStyle = '#808080cc'; tg.globalCompositeOperation = 'saturation'; tg.fillRect(0, 0, w, h); }
  return t; }
// The "NOT YET FOREVER" stamp for a Stacks NFT with no permanent twin.
function notYetStamp(g, cx, cy, size = 1) { g.save(); g.translate(cx, cy); g.rotate(-.32); const w = 188 * size, h = 40 * size; g.fillStyle = '#2a0c0ce8'; g.fillRect(-w / 2, -h / 2, w, h); g.lineWidth = 3; g.strokeStyle = '#ff5a5f'; g.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); text(g, 'NOT YET FOREVER', 0, 1, 20 * size, '#ff7a7e', 'Arial', 'center', '900'); g.restore(); }
// A twinned (or not yet twinned) Degen as a framed tile. The frame says the symbol: orange = Miami Degen, blue = NYC Degen, silver = the trailing
// city, gold = the leading city (the jackpot symbol), half orange / half blue = the Split Degen wild. A Degen with a permanent Xtrata twin shows in full
// colour with an infinity badge and its token number; one without is greyed out with the NOT YET FOREVER stamp.
function frameStyle(g, sym, x, y, w, h) {
  if (sym === 'bitcoin') return lin(g, x, y, x + w, y + h, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']);
  if (sym === 'artifact') return lin(g, x, y, x + w, y + h, ['#f4f6fb', '#aeb6c5', '#e7eaf1', '#8993a6']);
  return COLS[sym].color;
}
function degenTile(item, sym = 'chip') {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], wild = sym === 'wild', gold = sym === 'bitcoin', forever = item.forever !== false, city = item.city || 'miami'; g.scale(TILE / 240, TILE / 240);
  const glow = forever ? (gold ? GOLD : wild ? CREAM : sym === 'artifact' ? SILVER : col.color) : '#000';
  g.shadowColor = glow; g.shadowBlur = forever ? (gold ? 18 : 12) : 4; round(g, 12, 6, 216, 216, 14, '#070b16'); g.shadowBlur = 0;
  if (wild) { // the Split Degen: the frame is half Miami orange, half NYC blue
    for (const [x0, col2] of [[0, MIA], [120, NYC]]) { g.save(); g.beginPath(); g.rect(x0, 0, 120, 240); g.clip(); round(g, 12, 6, 216, 216, 14, null, forever ? col2 : '#7d8796', 8); g.restore(); }
    g.fillStyle = forever ? '#f4f6fb' : '#7d8796'; g.fillRect(118, 6, 4, 216); // the chrome seam
  } else round(g, 12, 6, 216, 216, 14, null, forever ? frameStyle(g, sym, 12, 6, 216, 216) : '#7d8796', gold ? 9 : 7);
  g.save(); g.beginPath(); g.roundRect(24, 18, 192, 158, 8); g.clip(); g.fillStyle = '#0d1424'; g.fillRect(24, 18, 192, 158);
  if (item.img) { const w = item.img.naturalWidth || item.img.width, h = item.img.naturalHeight || item.img.height;
    if (forever) { const fit = Math.min(192 / w, 158 / h), k = fit >= 1 && w <= 200 ? Math.floor(fit) : fit; g.imageSmoothingEnabled = !(w <= 200); g.drawImage(item.img, 24 + (192 - w * k) / 2, 18 + (158 - h * k) / 2, w * k, h * k); }
    else g.drawImage(greyscale(item.img, 192, 158, w > 200), 24, 18); }
  else { text(g, CITY[city].name, 120, 70, 30, forever ? CITY[city].col : '#9aa3b4', 'Arial', 'center', '900'); text(g, 'DEGEN', 120, 112, 44, forever ? CREAM : '#8a93a4', 'Arial', 'center', '900'); text(g, `#${item.id}`, 120, 152, 24, forever ? '#c8d3ee' : '#7a8394', 'Arial', 'center', '900'); }
  g.restore();
  round(g, 28, 22, 54, 22, 6, forever ? CITY[city].col : '#4a5262'); text(g, CITY[city].coin, 55, 33.5, 14, '#fff', 'Arial', 'center', '900'); // city tag
  round(g, 24, 180, 192, 32, 7, wild ? (forever ? CREAM : '#3a404c') : '#070b16'); text(g, `#${item.id}`, 120, 196, 21, wild && forever ? '#0b1430' : '#eef2ff', 'Arial', 'center', '900');
  if (gold && forever) { g.save(); g.beginPath(); g.roundRect(12, 6, 216, 216, 14); g.clip(); g.fillStyle = '#ffffff2a'; g.beginPath(); g.moveTo(-8, 150); g.lineTo(110, -6); g.lineTo(150, -6); g.lineTo(-8, 205); g.closePath(); g.fill(); g.restore(); }
  if (forever) { g.fillStyle = '#050810'; g.beginPath(); g.arc(204, 32, 17, 0, 7); g.fill(); drawInfinity(g, 204, 32, 28, '#bcd0ff'); } else notYetStamp(g, 120, 96);
  return c;
}
// City block: the on-chain record. A twinned Degen's Xtrata inscription ID, set big on a lit block in its city's colour.
function blockTile(item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), city = item.city || 'miami', cc = CITY[city].col, forever = item.forever !== false && item.xtrataId; g.scale(TILE / 240, TILE / 240);
  g.shadowColor = cc; g.shadowBlur = 12; round(g, 12, 6, 216, 216, 14, lin(g, 0, 6, 0, 222, [CITY[city].dark, '#0a0f1f']), null); g.shadowBlur = 0; round(g, 12, 6, 216, 216, 14, null, cc, 6);
  g.fillStyle = cc + '33'; for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) if ((r * 7 + k * 3 + hashStr(String(item.id))) % 3) g.fillRect(34 + k * 29, 20 + r * 11, 17, 6); // lit windows
  text(g, 'CITY BLOCK', 120, 74, 17, CREAM, 'Arial', 'center', '900');
  g.save(); g.beginPath(); g.roundRect(70, 88, 100, 74, 8); g.clip(); g.fillStyle = '#0d1424'; g.fillRect(70, 88, 100, 74);
  if (item.img) { const w = item.img.naturalWidth || item.img.width, h = item.img.naturalHeight || item.img.height; if (forever) g.drawImage(item.img, 70 + (100 - Math.min(100, 74 * w / h)) / 2, 88, Math.min(100, 74 * w / h), 74); else g.drawImage(greyscale(item.img, 100, 74, w > 200), 70, 88); } g.restore();
  round(g, 70, 88, 100, 74, 8, null, cc, 3);
  round(g, 24, 168, 192, 46, 8, '#050810', cc, 2);
  if (forever) { text(g, 'XTRATA ID', 120, 180, 11, '#9fb0d6', 'Arial', 'center', '800'); text(g, `#${item.xtrataId}`, 120, 199, fitSize(g, `#${item.xtrataId}`, 176, 26, 14), '#ffffff', 'Arial', 'center', '900'); }
  else { text(g, 'NO XTRATA ID', 120, 184, 14, '#ff7a7e', 'Arial', 'center', '900'); text(g, 'NOT YET FOREVER', 120, 202, 12, '#ff7a7e', 'Arial', 'center', '900'); }
  return c;
}
// Coin and plate logos: MiamiCoin, NYCCoin, CityCoins (round) and the two collection logos (square). The project's own file when bundled,
// otherwise the name set in type on a tile in the project's colour. Never a drawing of a logo.
function logoTile(sym, img, label, color, square = false) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], clr = color || col.color; g.scale(TILE / 240, TILE / 240);
  g.shadowColor = clr; g.shadowBlur = 16;
  if (square) { round(g, 14, 14, 212, 200, 20, '#0a0f1d', clr, 6); g.shadowBlur = 0; g.save(); g.beginPath(); g.roundRect(28, 28, 184, 172, 12); g.clip(); g.fillStyle = '#f6f7fb'; g.fillRect(28, 28, 184, 172);
    if (img) { const k = Math.min(184 / img.width, 172 / img.height); g.drawImage(img, 120 - img.width * k / 2, 114 - img.height * k / 2, img.width * k, img.height * k); } else { g.fillStyle = clr; g.fillRect(28, 28, 184, 172); (label || '').split(' ').forEach((w, i, a) => text(g, w, 120, 114 + (i - (a.length - 1) / 2) * 38, 30, '#fff', 'Arial', 'center', '900')); } g.restore(); }
  else { g.beginPath(); g.arc(120, 112, 98, 0, 7); g.fillStyle = '#0a0f1d'; g.fill(); g.shadowBlur = 0; g.lineWidth = 9; g.strokeStyle = clr; g.stroke(); g.lineWidth = 2; g.strokeStyle = '#ffffff55'; g.beginPath(); g.arc(120, 112, 88, 0, 7); g.stroke();
    g.save(); g.beginPath(); g.arc(120, 112, 82, 0, 7); g.clip(); g.fillStyle = '#f6f7fb'; g.fillRect(30, 22, 180, 180);
    if (img) { const k = Math.max(164 / img.width, 164 / img.height); g.drawImage(img, 120 - img.width * k / 2, 112 - img.height * k / 2, img.width * k, img.height * k); } else { g.fillStyle = clr; g.fillRect(30, 22, 180, 180); text(g, label || col.name, 120, 112, fitSize(g, label || col.name, 150, 46, 14), '#fff', 'Arial', 'center', '900'); } g.restore(); }
  return c;
}
// Shown only until art exists: the symbol's name set in type, in its colour. Never a drawing.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  round(g, 12, 6, 216, 216, 14, '#0a0f1d', col.color, 4);
  const words = col.name.toUpperCase().replace(/[(),]/g, '').split(' '); words.forEach((w, i) => text(g, w, 120, 110 - (words.length - 1) * 18 + i * 36, w.length > 9 ? 22 : 30, col.color, 'Arial', 'center', '900'));
  text(g, 'LOADING', 120, 196, 13, '#8a93b0'); return c;
}
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, cached: false, done: false, bundled: 0, logos: 0, counts: 'unknown' };
const logoImages = {};
const sample = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
// Every Degen the machine has: cityItems.<city> holds one base record per token (art, Xtrata ID, whether it has a permanent twin).
// The reel pools below are views of these records in a frame: orange (Miami), blue (NYC), gold (leading city), silver (trailing city), split (wild).
const cityItems = { miami: [], nyc: [] };
let twinMode = 'default'; // the test page's twins switch: default | none | some | all
const foreverFor = base => twinMode === 'none' ? false : twinMode === 'all' ? true : twinMode === 'some' ? base.ord % 3 === 0 : base.baseForever !== false;
const MAX_PER_CITY = 28;
function addDegen(city, t, bundled = false) {
  if (cityItems[city].some(b => b.id === t.tokenId)) return null;
  const base = { city, key: CITY[city].key, id: t.tokenId, xtrataId: t.xtrataId || null, num: `#${t.tokenId}`, img: t.img, bundled, baseForever: !!(t.forever && t.xtrataId), ord: cityItems[city].length, collection: CITY[city].key };
  cityItems[city].push(base); return base;
}
function poolItem(base, sym) { const it = { base, city: base.city, key: base.key, id: base.id, xtrataId: base.xtrataId, num: base.num, img: base.img, bundled: base.bundled, forever: foreverFor(base), collection: base.key }; it.tile = sym === 'chain' ? blockTile(it) : degenTile(it, sym); return it; }
// The city race decides which city's Degens wear the gold (leading) and silver (trailing) frames. Art only: the engine never knows.
let rebuildTimer = 0;
function rebuildCityPools() {
  const L = leader(), T = other(L), pick = list => list.slice(0, MAX_PER_CITY);
  pools.chip = pick(cityItems.miami).map(b => poolItem(b, 'chip')); pools.block = pick(cityItems.nyc).map(b => poolItem(b, 'block'));
  pools.bitcoin = pick(cityItems[L]).map(b => poolItem(b, 'bitcoin')); pools.artifact = pick(cityItems[T]).map(b => poolItem(b, 'artifact'));
  const mix = []; for (let i = 0; i < 14; i++) for (const c of CITIES) if (cityItems[c][i]) mix.push(poolItem(cityItems[c][i], 'wild')); pools.wild = mix;
  const blocks = []; for (let i = 0; i < 12; i++) for (const c of CITIES) { const f = cityItems[c].filter(b => b.xtrataId); if (f[i]) blocks.push(poolItem(f[i], 'chain')); } pools.chain = blocks;
  if (!pools.chain.length) for (const c of CITIES) cityItems[c].slice(0, 4).forEach(b => pools.chain.push(poolItem(b, 'chain'))); // no twin yet: the block says NO XTRATA ID, never a made-up one
  revealCache.clear(); BLOCK_TILE.clear(); screenDirty = true;
}
const rebuildSoon = () => { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(rebuildCityPools, 120); };
function setLogoPools() {
  const L = logoImages, one = (sym, k, id, num, img, label, color, sq, extra = {}) => ({ key: k, id, num, img: img || null, tile: logoTile(sym, img, label, color, sq), ...extra });
  pools.cherry = [one('cherry', 'miamicoin', 'MIA', 'MIAMICOIN (MIA)', L.mia, 'MIA', MIA)]; pools.lemon = [one('lemon', 'nycoin', 'NYC', 'NYCCOIN (NYC)', L.nyc, 'NYC', NYC)];
  pools.scatter = [one('scatter', 'citycoins', 'CITYCOINS', 'CITYCOINS', L.citycoins, 'CITYCOINS', '#f6f7fb')];
  pools.vault = [one('vault', 'miami-degens-logo', 'MIAMI DEGENS', 'MIAMI DEGENS', L.miamiDegens, 'MIAMI DEGENS', MIA, true, { city: 'miami' }), one('vault', 'nyc-degens-logo', 'NYC DEGENS', 'NYC DEGENS', L.nycDegens, 'NYC DEGENS', NYC, true, { city: 'nyc' })];
  screenDirty = true;
}
const FAKE_NONE = null;
// A Degen for a reveal or a map block, chosen from the round id alone (cosmetic): same round, same Degen, never touching the engine.
// It prefers a Degen with a permanent twin; where a city has none, the untwinned Degen shows greyed with its stamp.
function pickBase(city, seed) { const all = cityItems[city], fo = all.filter(foreverFor); const list = fo.length ? fo : all; return list.length ? list[seed % list.length] : null; }
const REVEAL_SYM = { 15: 'bitcoin', 10: 'bitcoin', 8: 'artifact' };
const revealCache = new Map();
const boxCity = k => k % 2 ? 'nyc' : 'miami'; // the nine boxes alternate Miami and New York
function revealCard(prize, roundId, k) { const city = boxCity(k), sym = REVEAL_SYM[prize] || CITY[city].slot, seed = hashStr(`${roundId}:${k}:${prize}`), key = `${sym}:${city}:${seed}`; let t = revealCache.get(key);
  if (!t) { const base = pickBase(city, seed), it = base ? poolItem(base, sym) : null; t = { city, sym, base, info: { name: base ? `${CITY[city].long} #${base.id}` : CITY[city].long }, tile: it ? it.tile : names[CITY[city].slot] }; revealCache.set(key, t); if (revealCache.size > 80) revealCache.delete(revealCache.keys().next().value); } return t; }
const BLOCK_TILE = new Map();
const blockCity = i => { const col = i % 5; return col < 2 ? 'miami' : col > 2 ? 'nyc' : (Math.floor(i / 5) % 2 ? 'nyc' : 'miami'); }; // the 15 cells are a map: Miami left, New York right, the bridge between
// Block Party: a lit block's Degen and Xtrata ID, taken from its half of the map by the round id (cosmetic).
function blockCard(f, i, v) { const id = f.roundId || 'map', city = blockCity(i), seed = hashStr(`${id}:block:${i}`), key = `${id}:${i}:${v}:${twinMode}`; let t = BLOCK_TILE.get(key);
  if (!t) { const base = pickBase(city, seed); t = { city, base, tile: base ? poolItem(base, 'chain').tile : names.chain }; BLOCK_TILE.set(key, t); if (BLOCK_TILE.size > 90) BLOCK_TILE.delete(BLOCK_TILE.keys().next().value); } return t; }

// Bundled Degens (real tokens, art/) and the logos decode at once; registry top-ups follow once a player connects.
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const CACHE_KEY = 'xtrata.degen-city.twins';
const HELPERS = { miami: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata', nyc: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens' };
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
function retile() { rebuildCityPools(); update(); }
async function loadBundled() {
  for (const city of CITIES) {
    const m = MANIFEST[city] || {}; if (Number.isFinite(m.inscribedCount)) { raceCounts[city] = m.inscribedCount; sources.counts = 'build time (stale)'; } // the last value read at build time, marked stale until a live read replaces it
    await Promise.all(((ART.twins || {})[city] || []).map(async a => { try { const img = await loadImage(a.src, 8000); if (addDegen(city, { tokenId: a.tokenId, xtrataId: a.xtrataId, forever: a.forever, img }, true)) sources.bundled++; } catch (e) {} }));
  }
  for (const [k, src] of Object.entries(ART.logos || {})) { try { logoImages[k] = await loadImage(src, 8000); sources.logos++; } catch (e) {} }
  setLogoPools(); rebuildCityPools(); holderState(); screenDirty = true;
}
// Registry and helper reads top the Degens up live. A failed read leaves the bundled Degens and last known counts as they were: "unknown", never "none".
async function loadLive() {
  let cols = {};
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; for (const c of reg.collections || []) if (c.status === 'live' && c.helper && CITY[c.key.replace('-degens', '') === 'nyc' ? 'nyc' : c.key === 'miami-degens' ? 'miami' : 'none']) cols[c.key === 'miami-degens' ? 'miami' : 'nyc'] = { key: c.key, name: c.name, helper: c.helper }; sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; }
  for (const c of CITIES) if (!cols[c]) cols[c] = { key: CITY[c].key, name: CITY[c].long, helper: HELPERS[c] };
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core; sources.cached = !!fresh; const queue = [];
  await Promise.all(CITIES.map(async city => { const col = cols[city]; twinCols.set(city, { ...col, city, inscribed: 0, loaded: 0 }); const m = twinCols.get(city);
    try { const list = fresh && cache.lists[city] ? cache.lists[city] : await sampleTwins(col); m.list = list; m.inscribed = col.inscribed || (fresh && cache.counts && cache.counts[city]) || list.length;
      if (m.inscribed) { raceCounts[city] = m.inscribed; sources.counts = 'live'; holderState(); } sources.lists++;
      const have = new Set(cityItems[city].map(t => t.id)); sample(list.filter(t => !have.has(t.tokenId)), 12).forEach(item => queue.push({ m, item })); }
    catch (e) { sources.listFailures++; m.list = []; } }));
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, lists: Object.fromEntries([...twinCols].map(([k, c]) => [k, c.list || []])), counts: Object.fromEntries([...twinCols].map(([k, c]) => [k, c.inscribed])) })); } catch (e) {}
  screenDirty = true; queue.sort(() => Math.random() - .5); let i = 0;
  const worker = async () => { while (i < queue.length) { const { m, item } = queue[i++]; try { const img = await loadImage(twinUrl(item.xtrataId)); if (addDegen(m.city, { tokenId: item.tokenId, xtrataId: item.xtrataId, forever: true, img })) { m.loaded++; sources.images++; rebuildSoon(); } } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 5 }, worker)); await fillUntwinned().catch(() => {}); sources.done = true; screenDirty = true;
}
// Untwinned Degens fill the gaps, from the token's own art (the source contract's metadata names an IPFS folder). They show greyed with NOT YET FOREVER.
const ORIGINALS = { miami: 'QmStnniaoVgxzDiNmqhQR66wMLRH9wMAC62P5RcUFNttGd', nyc: 'QmSpu1tFB4zamGqKp9urEQsYpZ3ztq64vigXSdpBAFS4qi' };
const GATEWAYS = ['https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/', 'https://cloudflare-ipfs.com/ipfs/', 'https://gateway.pinata.cloud/ipfs/'];
async function loadOriginal(city, id) { for (const gw of GATEWAYS) { try { return await loadImage(`${gw}${ORIGINALS[city]}/${id}.png`, 9000); } catch (e) {} } throw Error('no gateway'); }
async function fillUntwinned() {
  const jobs = []; for (const city of CITIES) { const have = new Set(cityItems[city].map(b => b.id)), twinned = new Set((twinCols.get(city)?.list || []).map(t => t.tokenId)); let n = 0, need = Math.max(0, 22 - cityItems[city].length);
    for (let k = 0; n < need && k < 420; k++) { const id = 1 + (k * 37 + hashStr(city) % 400) % 420; if (!have.has(id) && !twinned.has(id)) { have.add(id); jobs.push({ city, id }); n++; } } }
  let i = 0; const worker = async () => { while (i < jobs.length) { const { city, id } = jobs[i++]; try { const img = await loadOriginal(city, id); if (addDegen(city, { tokenId: id, xtrataId: null, forever: false, img })) { sources.images++; rebuildSoon(); } } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker));
}
const twinCount = () => cityItems.miami.length + cityItems.nyc.length;
setLogoPools(); rebuildCityPools();


/* ---------- Faces: which inscription a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: two cities side by side. Miami orange on the left, New York blue on the right, a chrome seam between ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const INK = '#f3f6ff';
(function drawBase() { const g = baseLayer.getContext('2d');
  g.fillStyle = lin(g, 0, 0, 700, 960, ['#2e1408', '#1b0b05', '#2a1207']); g.fillRect(0, 0, 700, 960);
  g.fillStyle = lin(g, 700, 0, 1400, 960, ['#081a4a', '#050c26', '#0a1d52']); g.fillRect(700, 0, 700, 960);
  for (let k = 0; k < 1100; k++) { const h = hashStr('g' + k); g.fillStyle = (h & 1) ? '#ffffff06' : '#00000018'; g.fillRect(h % 1400, (h >>> 11) % 960, 2, 2); }
  // Miami sunset bands low on the left; New York windows low on the right (plain shapes, no logos)
  for (let k = 0; k < 7; k++) { g.fillStyle = `rgba(255,${120 + k * 14},40,${.07 - k * .005})`; g.fillRect(0, 786 + k * 8, 700, 4 + k); }
  for (let k = 0; k < 34; k++) { const h = hashStr('b' + k), bx = 712 + (k * 20) % 668, bh = 18 + (h % 70); g.fillStyle = '#0c1f55'; g.fillRect(bx, 860 - bh, 16, bh + 40); g.fillStyle = '#7fa6ff30'; for (let w = 0; w < bh / 9; w++) if ((h >> w) & 1) g.fillRect(bx + 3, 864 - bh + w * 9, 4, 4); }
  // the two halves of the bezel
  for (const [x0, col, dk] of [[0, MIA, '#ff9a4d'], [700, NYC, '#5d92ff']]) { g.save(); g.beginPath(); g.rect(x0, 0, 700, 960); g.clip();
    g.save(); g.setLineDash([11, 8]); round(g, 8, 8, 1384, 944, 20, null, col + '99', 2); g.restore();
    round(g, 18, 14, 380, 172, 12, '#0a0d19e6', col, 4); round(g, 1002, 14, 380, 172, 12, '#0a0d19e6', col, 4);
    g.shadowColor = col; g.shadowBlur = 16; round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, null, lin(g, 0, RY - 14, 0, RY + RH + 14, [dk, col, dk]), 8); g.shadowBlur = 0; g.restore(); }
  g.shadowColor = GOLD; g.shadowBlur = 12; round(g, 412, 14, 576, 172, 12, '#080b16', lin(g, 412, 14, 988, 186, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']), 6); g.shadowBlur = 0;
  for (let c = 0; c < 5; c++) { g.fillStyle = c < 2 ? lin(g, 0, RY, 0, RY + RH, ['#190a05', '#2c1307', '#190a05']) : c > 2 ? lin(g, 0, RY, 0, RY + RH, ['#050d24', '#0b1d4d', '#050d24']) : lin(g, 0, RY, 0, RY + RH, ['#0d1018', '#1c212e', '#0d1018']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  // (no seam drawn over the screen: Miami and New York meet in the middle)
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
// The card shown in the first paying cell of a winning line: its cameo (and, later, its holder's royalty). Only a Degen counts, never a coin or a logo.
function cameoFor(w, grid = state.grid, fc = faces) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = grid[c][line[c]]; if (s === w.symbol || s === 'wild') { const it = itemFor(s, fc[c][line[c]]); if (it && it.base) return it; } } return null; }
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
  else if (state.showLines && !spinning) { sg.strokeStyle = '#f2c14e55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// Mining Season: the two cities mine side by side. MiamiCoin falls on the left, NYCCoin on the right. Positions come from the clock only.
function drawMiningRain(now) {
  const a = pools.cherry[0], b = pools.lemon[0]; if (!a || !b || !motionOK()) return;
  sg.save(); sg.globalAlpha = .8;
  for (let k = 0; k < 16; k++) { const left = k % 2 === 0, it = left ? a : b, sp = 90 + (hashStr('r' + k) % 70), x = (left ? RX + 20 : 720) + (hashStr('x' + k) % 590), y = ((now / 1000 * sp + (hashStr('y' + k) % 900)) % (RH + 120)) + RY - 90, s = 40 + (k % 3) * 12, w = Math.max(.15, Math.abs(Math.cos(now / 420 + k)));
    sg.shadowColor = left ? MIA : NYC; sg.shadowBlur = 16; sg.save(); sg.translate(x + s / 2, y + s / 2); sg.scale(w, 1); sg.drawImage(it.tile, -s / 2, -s / 2, s, s); sg.restore(); }
  sg.restore();
}
// Vault prize tiers (the engine's pick prizes, named for the city): shown when a box opens.
const RARITY = { 1: 'PETTY CASH', 2: 'PETTY CASH', 3: 'STACKS', 4: 'STACKS', 5: 'STACKS', 8: 'BIG BAG', 10: 'VAULT HAUL', 15: 'KEY TO THE CITY' };
// The last 21 rounds as a row of card backs: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 870;
  text(sg, 'LAST 21 ROUNDS', x0 - 20, y + s / 2, 12, '#6f7c9a', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y + 0, s * .72, s, 2, e ? (e.win > 0 ? ACCENT : '#252c40') : '#121520', i === n - 1 && e ? CREAM : null, 1.5); } }


/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'MINING SEASON', vault: 'CITY VAULT', chain: 'BLOCK PARTY', jackpot: 'KEY TO THE CITY', gamble: 'MIAMI OR NEW YORK' };
const RULES = { free: 'Eight free spins. Both cities mine side by side; every win pays 2×. More CityCoins add four.', vault: 'Nine safe-deposit boxes, Miami and New York in turn. Open three: a Degen and a prize inside each.', chain: 'City blocks light up on the map, Miami on the left, New York on the right. Any new block resets your three respins. Light the whole map to win the Key to the City.', jackpot: 'The Key to the City. Five leading-city Degens on the centre row turned it.', gamble: '' };
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
  if (kind === 'sting-jackpot') { arp([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5], .09, .5, .07, 'square'); arp([130.8, 164.8, 196, 261.6], .18, .9, .06, 'triangle'); coins(40, .5); crowdCheer(.7, 1.2); }
  if (kind === 'sting-gamble') { noise(.25, 4200, 2, .15); bleep(988, .3, .06, .1, 'triangle'); }
  if (kind === 'whoosh') { noise(.4, 2800, .8, .14); bleep(240, .4, .05, 0, 'triangle'); }
  if (kind === 'crack') { sound('flip'); bleep(700 + i * 50, .3, .07, .06, 'triangle'); }
  if (kind === 'reveal-big') { arp([784, 988, 1175, 1568], .06, .35, .07, 'square'); coins(14, .1); crowdCheer(.15, .7); }
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
// The leading city sets the music: Miami bass (a tresillo sub line and clave ticks) or New York boom-bap (kick, snare and a swung hat).
function cityFlavor(at = 0, big = false) { if (!ac || state.muted) return;
  if (leader() === 'miami') { [0, .1875, .375].forEach((d, k) => { bleep([55, 55, 73.4][k], .2, big ? .16 : .1, at + d, 'triangle'); noise(.02, 5200, 6, .09, at + d + .02); }); if (big) arp([220, 261.63, 329.63, 392], .09, .12, .04, 'triangle', at + .1); }
  else { tone(120, .14, 'sine', big ? .26 : .18, at, .4); noise(.12, 1800, 1, .13, at + .22); tone(120, .12, 'sine', .14, at + .34, .4); noise(.03, 7000, 6, .06, at + .11); noise(.03, 7000, 6, .06, at + .33); if (big) arp([261.63, 311.13, 392, 466.16], .1, .14, .035, 'triangle', at + .15); } }
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const mi = [587.33, 698.46, 880, 1046.5, 880, 698.46, 659.25, 783.99], ny = [523.25, 622.25, 783.99, 932.33, 783.99, 622.25, 587.33, 698.46];
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const miami = leader() === 'miami', seq = miami ? mi : ny, n = seq[k++ % seq.length], st = k % 8;
    bleep(n, .2, .045); if (miami) { if (st === 1 || st === 4 || st === 7) bleep(n / 8, .2, .1, 0, 'triangle'); if (st % 2) noise(.02, 5200, 6, .05); }
    else { if (st === 1 || st === 4) tone(110, .14, 'sine', .16, 0, .4); if (st === 5 || st === 0) noise(.1, 1800, 1, .09); if (st % 2) noise(.02, 7000, 6, .04); } }, state.turbo ? 90 : 150); }

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
  if (state.free > 0) { status(`${state.free} MINING SEASON SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
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
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else toast('Open three boxes.'); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'MINE' : broke ? 'GET LAYR' : 'DRIVE'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'CLAIM' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `OPEN ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return chainBusy() ? 'RESPINNING…' : f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'REVEALING'; }
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
  if (!RS) return `BLOCK PARTY · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`;
  if (now < RS.lastLand) return RS.before === 1 ? 'FINAL RESPIN · HOLD ON…' : `RESPIN ${RS.n} · ROLLING…`;
  if (RS.fill) return 'MAP LIT · KEY TO THE CITY!';
  if (RS.added.size) return `+${RS.added.size} NEW BLOCK${RS.added.size > 1 ? 'S' : ''}${RS.before < 3 ? ' · RESPINS RESET TO 3' : ''}`;
  return E.featureDone(f) ? 'NO NEW BLOCK · PARTY OVER' : `NO NEW BLOCK · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`; }
// One rolling pocket: a strip of Directory cards drops through the pocket, easing to rest on the card it lands (or a face-down card for a miss).
function drawRollPocket(f, i, x, y, w, h, now, S, tile) {
  const p = Math.min(1, (now - S.t0) / Math.max(1, S.landAt[i] - S.t0)), N = 7, th = h - 16, stride = th + 14, rem = (1 - ease(p)) * N, cx = x + w / 2, cy = y + h / 2, blur = Math.min(1, (1 - p) * 1.5);
  if (!scene.pool) scene.pool = Array.from({ length: 8 }, (_, k) => blockCard(f, 100 + k * 13, 1 + (k % 5)).tile);
  sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 14); sg.clip(); sg.fillStyle = '#080b15'; sg.fillRect(x, y, w, h);
  for (let k = -1; k <= N + 1; k++) { const yy = cy - (rem - k) * stride; if (Math.abs(yy - cy) > h / 2 + th / 2) continue; sg.globalAlpha = 1 - .4 * blur;
    if (k === 0 && !tile) round(sg, cx - th * .36, yy - th / 2, th * .72, th, 10, '#0a0d19', '#8fa3c7', 3); else sg.drawImage(k === 0 ? tile : scene.pool[(k * 3 + i + 8) % 8], cx - th / 2, yy - th / 2, th, th); }
  sg.globalAlpha = 1; if (blur > .25) { sg.fillStyle = `rgba(255,178,122,${.07 * blur})`; for (let b = 0; b < 7; b++) sg.fillRect(x + 12 + b * (w - 24) / 7, y, 3, h); }
  const g = sg.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(4,16,8,.75)'); g.addColorStop(.28, 'rgba(4,16,8,0)'); g.addColorStop(.72, 'rgba(4,16,8,0)'); g.addColorStop(1, 'rgba(4,16,8,.75)'); sg.fillStyle = g; sg.fillRect(x, y, w, h);
  sg.restore();
  const hold = S.tense && now > S.t0 + 700 * speed() && p < 1, pulse = hold ? .55 + .45 * Math.sin(now / 90) : 0;
  sg.save(); if (hold) { sg.shadowColor = GOLD; sg.shadowBlur = 24 * pulse; } round(sg, x, y, w, h, 14, null, hold ? GOLD : CITY[blockCity(i)].col, hold ? 4 : 3); sg.restore(); }
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { if (chainBusy()) return; const prev = f.frames[f.index], before = prev.left, prevCells = prev.cells.slice(); const fr = E.respin(state); save(); chainFlash = performance.now(); startRespin(f, prevCells, before, fr); renderBar(); update(); }
  else toast('Open three boxes first.'); }
const vaultCharge = m => motionOK() ? (m >= 8 ? 650 : 280) * speed() : 0; // a pack card builds up before it turns; the big ones hold longer
function pickVault(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); const ch = vaultCharge(r.multiple); sfx('crack', i); if (ch) sfx('charge', r.multiple >= 8 ? 1 : 0); if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), ch + 520 * speed()); else setTimeout(() => sound('pick', i), ch + 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
function callGamble(choice) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, choice, lab.on ? labGambleRng(choice) : undefined); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, choice }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y, ['#ff8a3d', MIA, '#2c5fe8', '#5d92ff']) : '#0f1526', primary ? '#f1f4fa' : '#6b7a99', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#ffffff' : '#e8ecf8', 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
// On the full-width card grids (the pack and the binder) the chip sits just under the screen so it never covers a card.
function skipChip() { if (!canSkip()) return; const low = scene && scene.stage === 'play' && (scene.kind === 'vault' || scene.kind === 'chain'); button('SKIP ›', RX + RW - 150, low ? RY + RH + 8 : RY + 14, 136, low ? 48 : 50, skipScene, false); }
const cameoLabel = it => !it || !it.base ? '' : `${CITY[it.city].long.toUpperCase().replace(/S$/, '')} #${it.id}${it.xtrataId ? ` · XTRATA #${it.xtrataId}` : ''}`;
// A safe-deposit box door: brushed steel, four rivets, a combination dial and the box number. The box's city colours its frame.
let curBoxCity = null;
function drawBoxDoor(x, y, w, h, label, glow) { const cc = curBoxCity ? CITY[curBoxCity].col : '#9aa6bf'; sg.save(); if (glow) { sg.shadowColor = glow; sg.shadowBlur = 22; }
  round(sg, x, y, w, h, 10, lin(sg, x, y, x + w, y + h, ['#d3d9e6', '#7f8aa0', '#e0e5ef', '#6b7690']), cc, 4); sg.restore();
  sg.fillStyle = '#4b556b'; for (const [rx, ry] of [[x + 9, y + 9], [x + w - 9, y + 9], [x + 9, y + h - 9], [x + w - 9, y + h - 9]]) { sg.beginPath(); sg.arc(rx, ry, 3.2, 0, 7); sg.fill(); }
  round(sg, x + 14, y + 14, w - 28, h - 28, 6, null, '#ffffff55', 1.5);
  const cx = x + w / 2, cy = y + h / 2 - 6, r = Math.min(w, h) * .26; sg.beginPath(); sg.arc(cx, cy, r, 0, 7); sg.fillStyle = lin(sg, cx - r, cy - r, cx + r, cy + r, ['#f1f4fa', '#8a93a5', '#323a4d']); sg.fill(); sg.lineWidth = 3; sg.strokeStyle = cc; sg.stroke();
  sg.lineWidth = 2; sg.strokeStyle = '#2a3144'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; sg.beginPath(); sg.moveTo(cx + Math.cos(a) * r * .72, cy + Math.sin(a) * r * .72); sg.lineTo(cx + Math.cos(a) * r * .94, cy + Math.sin(a) * r * .94); sg.stroke(); }
  sg.lineWidth = 4; sg.beginPath(); sg.moveTo(cx, cy); sg.lineTo(cx + r * .5, cy - r * .5); sg.stroke();
  if (label) text(sg, label, x + w / 2, y + h - 24, 20, '#10192e', 'Arial', 'center', '900'); }
// The big round vault door (intro of the City Vault): steel face, a split Miami/New York ring, bolts and a turning wheel.
function drawBigVault(cx, cy, r, now) { sg.save(); sg.translate(cx, cy); sg.shadowColor = GOLD; sg.shadowBlur = 36;
  for (const [a0, a1, col] of [[Math.PI / 2, Math.PI * 1.5, MIA], [-Math.PI / 2, Math.PI / 2, NYC]]) { sg.beginPath(); sg.arc(0, 0, r, a0, a1); sg.lineWidth = 16; sg.strokeStyle = col; sg.stroke(); } sg.shadowBlur = 0;
  sg.beginPath(); sg.arc(0, 0, r - 12, 0, 7); sg.fillStyle = lin(sg, -r, -r, r, r, ['#e6ebf5', '#8591a8', '#d9dfeb', '#5d6880']); sg.fill();
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; sg.beginPath(); sg.arc(Math.cos(a) * (r - 30), Math.sin(a) * (r - 30), 6, 0, 7); sg.fillStyle = '#39425a'; sg.fill(); }
  sg.rotate(motionOK() ? now / 1400 : 0); sg.strokeStyle = '#2a3144'; sg.lineWidth = 10; sg.lineCap = 'round'; for (let k = 0; k < 4; k++) { sg.rotate(Math.PI / 2); sg.beginPath(); sg.moveTo(0, 0); sg.lineTo(0, r * .6); sg.stroke(); sg.beginPath(); sg.arc(0, r * .66, 9, 0, 7); sg.fillStyle = '#2a3144'; sg.fill(); }
  sg.beginPath(); sg.arc(0, 0, r * .16, 0, 7); sg.fillStyle = GOLD; sg.fill(); sg.restore(); }
// The two-sided city coin of the topper: MiamiCoin on one face, NYCCoin on the other. face: 0 Miami, 1 New York, -1 unknown.
function drawCityCoin(cx, cy, r, face, sx = 1) { sg.save(); sg.translate(cx, cy); sg.scale(Math.max(.05, Math.abs(sx)), 1); sg.shadowColor = GOLD; sg.shadowBlur = 30;
  if (face < 0) { sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fillStyle = lin(sg, -r, -r, r, r, ['#fff3c2', '#f2c14e', '#a87411']); sg.fill(); sg.lineWidth = 6; sg.strokeStyle = CREAM; sg.stroke(); sg.shadowBlur = 0; text(sg, '?', 0, 4, r * 1.2, '#4a3500', 'Arial', 'center', '900'); }
  else { const it = (face ? pools.lemon : pools.cherry)[0]; sg.drawImage(it ? it.tile : names[face ? 'lemon' : 'cherry'], -r, -r, r * 2, r * 2); } sg.restore(); }
const splitBg = (g, y0, h, a, b) => { g.fillStyle = lin(g, 0, y0, 0, y0 + h, a); g.fillRect(RX, y0, 700 - RX, h); g.fillStyle = lin(g, 0, y0, 0, y0 + h, b); g.fillRect(700, y0, RX + RW - 700, h); };
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { splitBg(g, RY, RH, ['#1a0b05', '#35160a', '#4a1f0a'], ['#050c26', '#0a1d52', '#10307d']); if (pools.scatter[0] && motionOK()) for (let k = 0; k < 18; k++) { const sp = 70 + (hashStr('i' + k) % 80), x = RX + (hashStr('ix' + k) % RW), y = ((now / 1000 * sp + (hashStr('iy' + k) % 700)) % (RH + 160)) + RY - 120, s = 46 + (k % 4) * 14; g.globalAlpha = .35 * dim; g.drawImage(pools.scatter[0].tile, x, y, s, s); } }
  if (kind === 'vault') { splitBg(g, RY, RH, ['#140a05', '#2a1409', '#120804'], ['#04091c', '#0a1840', '#040918']); g.globalAlpha = .1 * dim; for (let k = 0; k < 9; k++) { const [x, y, w, h] = capsuleRect(k); round(g, x + w / 2 - 60, y + 10, 120, h - 20, 12, CITY[boxCity(k)].col); } }
  if (kind === 'chain') { splitBg(g, RY, RH, ['#1a0b05', '#2a1307', '#1a0b05'], ['#050c26', '#0a1a48', '#050c26']); g.globalAlpha = .12 * dim; g.strokeStyle = '#ffffff'; g.lineWidth = 2; for (let k = 1; k < 8; k++) { g.beginPath(); g.moveTo(RX + k * 164, RY); g.lineTo(RX + k * 164, RY + RH); g.stroke(); } for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(RX, RY + k * 142); g.lineTo(RX + RW, RY + k * 142); g.stroke(); } }
  if (kind === 'jackpot') { g.fillStyle = '#04060f'; g.fillRect(0, 0, 1400, 960); const a = motionOK() ? now / 2400 : 0; g.translate(700, 480); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.globalAlpha = .15 * dim; g.fillStyle = k % 2 ? NYC : MIA; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1200, a, a + Math.PI / 18); g.closePath(); g.fill(); } }
  if (kind === 'gamble') splitBg(g, RY, RH, ['#1a0b05', '#35160a'], ['#050c26', '#0e2a6e']);
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.2) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 60 + (1 - k) * -140;
  sg.fillStyle = '#05081ad8'; sg.fillRect(RX, y - 78, RW, 156); for (const yy of [y - 80, y + 76]) { sg.fillStyle = MIA; sg.fillRect(RX, yy, RW / 2, 4); sg.fillStyle = NYC; sg.fillRect(RX + RW / 2, yy, RW / 2, 4); }
  sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, title, 700, y - 12, 76, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0; text(sg, sub, 700, y + 46, 22, '#dbe4fb', 'Arial', 'center', '800'); sg.restore(); }
const jackpotTile = () => pools.bitcoin[0] ? pools.bitcoin[0].tile : names.bitcoin;
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(0,0,0,${Math.min(.62, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : (c < 2 ? MIA : c > 2 ? NYC : CREAM); sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore(); });
  if (kind === 'gamble') { const k = ease(t * 2); drawCityCoin(700, RY + RH / 2, 100 * k, -1, motionOK() ? Math.cos(now / 160) : 1); }
  if (kind === 'jackpot' && !cells.length) { const k = ease(t * 2); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; sg.drawImage(jackpotTile(), 700 - 120 * k, RY + RH / 2 - 120 * k, 240 * k, 240 * k); sg.restore(); }
  const sub = kind === 'jackpot' ? (cells.length ? 'FIVE LEADING-CITY DEGENS ON THE CENTRE ROW' : 'THE WHOLE MAP IS LIT · ALL 15 BLOCKS') : kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR RIDES ON ONE CALL` : `${cells.length} ${kind === 'free' ? 'CITYCOINS' : kind === 'vault' ? 'DEGENS COLLECTION LOGOS' : 'CITY BLOCKS'}`;
  if (t > .5) titleCard(TITLES[kind], sub, now, (t - .5) * 1.4);
  if (t >= 1) setStage('intro'); }
function wrapText(s, x, y, maxW, lh, color, size) { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); }
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (600 * speed()), a = Math.min(1, t);
  backdrop(kind, now); sg.save(); sg.globalAlpha = a; const yIn = motionOK() ? (1 - ease(t)) * 40 : 0;
  if (kind === 'free' && pools.scatter[0]) { sg.shadowColor = '#ffffff'; sg.shadowBlur = 40; sg.drawImage(pools.scatter[0].tile, 330 - 120, RY + 120 + yIn, 240, 240); sg.shadowBlur = 0; }
  if (kind === 'vault') drawBigVault(330, RY + 250 + yIn, 130, now);
  if (kind === 'chain') { sg.drawImage(blockCard({ roundId: 'intro' }, 0, 0).tile, 215, RY + 115 + yIn, 230, 230); }
  if (kind === 'jackpot') { sg.shadowColor = GOLD; sg.shadowBlur = 50; sg.drawImage(jackpotTile(), 190, RY + 100 + yIn, 280, 280); sg.shadowBlur = 0; }
  if (kind === 'gamble') drawCityCoin(330, RY + 240 + yIn, 110, -1, motionOK() ? Math.cos(now / 500) : 1);
  sg.shadowColor = GOLD; sg.shadowBlur = 24; text(sg, TITLES[kind], 890, RY + 150 + yIn, kind === 'chain' || kind === 'free' || kind === 'gamble' ? 56 : 62, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  const rule = kind === 'gamble' ? `Call Miami or New York. Right doubles your ${fmt(scene.data.stake)} LAYR win; wrong loses it.` : RULES[kind];
  wrapText(rule, 890, RY + 232 + yIn, 640, 30, '#e8eeff', 26);
  sg.restore();
  if (kind === 'gamble') { button('MIAMI', 560, RY + 380, 190, 84, () => callGamble('odd')); button('NEW YORK', 770, RY + 380, 210, 84, () => callGamble('even')); button('KEEP WIN', 1000, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'CLAIM' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }
function drawVaultPlay(f, now) {
  backdrop('vault', now, .6); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, doneDelay = 900 * speed() + (done ? Math.max(...f.picks.map(i => vaultCharge(f.awards[i]))) : 0);
  for (let i = 0; i < 9; i++) { curBoxCity = boxCity(i); const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], cardH = h - 16, cardW = 118, rv = revealCard(m, f.roundId || 'pack', i);
    const infoX = x + cardW + 28 + (w - cardW - 28) / 2;
    if (picked) { const ch = vaultCharge(m), el = at ? now - at : 1e9;
      if (el < ch) { const k = el / ch, jit = Math.sin(el / 22) * (1.5 + 5 * k), big = m >= 8; sg.save(); sg.shadowColor = big ? GOLD : (boxCity(i) === 'miami' ? '#ffb27a' : '#9fbcff'); sg.shadowBlur = (big ? 30 : 14) + 26 * k; round(sg, x, y, w, h, 14, CITY[boxCity(i)].dark, big ? GOLD : CITY[boxCity(i)].col, 3 + 2 * k); sg.restore(); drawBoxDoor(x + 12 + jit, y + 8 - k * 4, cardW, cardH, String(i + 1), big ? GOLD : (boxCity(i) === 'miami' ? '#ffb27a' : '#9fbcff')); text(sg, big ? 'SOMETHING BIG…' : 'CRACKING…', infoX, y + h / 2, 17, big ? '#fff1b8' : CREAM, 'Arial', 'center', '900'); continue; }
      const t = at ? (el - ch) / (700 * speed()) : 9;
      if (t < .45 && motionOK()) { const u = t / .45, sx = Math.max(.04, 1 - ease(u)); sg.save(); sg.translate(x + 12 + cardW / 2, 0); sg.scale(sx, 1); sg.translate(-(x + 12 + cardW / 2), 0); drawBoxDoor(x + 12, y + 8, cardW, cardH, String(i + 1), '#fff1b8'); sg.restore(); round(sg, x, y, w, h, 14, null, CITY[boxCity(i)].col + 'aa', 2); continue; }
      const k = motionOK() ? ease((t - .45) / .55) : 1, big = m >= 8; sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      round(sg, x, y, w, h, 14, big ? '#2a2308' : CITY[boxCity(i)].dark, big ? GOLD : CITY[boxCity(i)].col, big ? 6 : 4); sg.restore();
      const sw = Math.max(.05, k), s = cardH; sg.save(); sg.translate(x + 12 + cardW / 2, y + 8 + cardH / 2); sg.scale(sw, 1); sg.drawImage(rv.tile, -s / 2 + 0, -s / 2, s, s); sg.restore();
      const shown = Math.round(m * Math.min(1, k * 1.2)); text(sg, RARITY[m] || '', infoX, y + h / 2 - 40, 20, big ? '#fff1b8' : '#d2d8e7'); text(sg, `${Math.max(1, shown)}×`, infoX, y + h / 2 - 2, 46, '#ffffff', 'Arial'); text(sg, `${fmt(Math.max(1, shown) * f.bet)} LAYR`, infoX, y + h / 2 + 40, 18, GOLD); text(sg, rv.info.name, infoX, y + h / 2 + 62, 13, '#8f9dbf', 'Arial', 'center', '700'); }
    else if (done && now - doneAt > doneDelay) { round(sg, x, y, w, h, 14, '#0a0d17', '#1d243a', 2); text(sg, RARITY[m] || '', infoX, y + h / 2 - 16, 16, '#4d5a7a'); text(sg, `${m}×`, infoX, y + h / 2 + 14, 30, '#4d5a7a'); sg.save(); sg.globalAlpha = .45; sg.drawImage(rv.tile, x + 12 - (s0(cardH) - cardW) / 2, y + 8, cardH, cardH); sg.restore(); }
    else { const hover = motionOK() ? Math.sin(now / 400 + i) * 3 : 0; round(sg, x, y + hover, w, h, 14, CITY[boxCity(i)].dark, CITY[boxCity(i)].col + 'aa', 2); drawBoxDoor(x + 12, y + 8 + hover, cardW, cardH, String(i + 1)); text(sg, `${CITY[boxCity(i)].name} BOX`, infoX, y + h / 2 - 18 + hover, 22, CREAM); text(sg, 'TAP TO OPEN', infoX, y + h / 2 + 16 + hover, 15, '#6f7c9a', 'Arial', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickVault(i) }); } }
  if (done && now - doneAt > doneDelay) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  curBoxCity = null; skipChip(); }
const s0 = h => h; // card tiles are square, so a revealed pack card is centred on the back it replaced
function drawGrabPlay(f, now) {
  backdrop('chain', now, .35); const fr = f.frames[f.index], S = scene.spin, mo = motionOK();
  const landed = i => !(S && S.landAt[i] !== undefined && now < S.landAt[i]), tot = fr.cells.reduce((a, v, i) => a + (landed(i) ? v : 0), 0);
  if (S && now < S.lastLand && mo && Math.floor(now / 80) !== Math.floor((now - 17) / 80)) sfx('roll');
  fr.cells.forEach((v, i) => { const x0 = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, at = scene.stampAt[i];
    if (!landed(i)) { drawRollPocket(f, i, x0, y, w, h, now, S, v ? blockCard(f, i, v).tile : null); return; }
    const miss = !v && S && S.landAt[i] !== undefined ? (now - S.landAt[i]) / (520 * speed()) : 9, x = x0 + (mo && miss < 1 ? Math.sin(miss * 38) * 5 * (1 - miss) : 0);
    if (v) { const t = at ? (now - at) / (320 * speed()) : 9; const s = mo ? 1 + .7 * (1 - ease(t)) : 1; sg.save(); sg.globalAlpha = Math.min(1, .35 + t * 3); if (t < 1.5) { sg.shadowColor = GOLD; sg.shadowBlur = 40 * (1.5 - Math.min(1.5, t)); } const hh = h * s; sg.drawImage(blockCard(f, i, v).tile, x + (w - hh) / 2, y + (h - hh) / 2, hh, hh); sg.restore();
      if (mo && at && t >= 0 && t < 1.6) { const k = t / 1.6; sg.save(); sg.globalAlpha = (1 - k) * .9; sg.strokeStyle = '#fff1b8'; sg.lineWidth = 6 * (1 - k) + 1; sg.beginPath(); sg.roundRect(x - k * 26, y - k * 26, w + k * 52, h + k * 52, 14 + k * 20); sg.stroke(); sg.restore(); }
      if (t > .6) { round(sg, x + w - 78, y + h - 34, 74, 30, 8, '#070911d8', GOLD, 2); text(sg, `${v}× ${fmt(v * f.bet)}`, x + w - 41, y + h - 19, 14, '#fff1b8', 'Arial', 'center', '900'); } }
    else { round(sg, x, y, w, h, 14, CITY[blockCity(i)].dark + 'f6', miss < 1 ? `rgba(224,150,70,${1 - miss})` : CITY[blockCity(i)].col, miss < 1 ? 4 : 2); sg.save(); sg.setLineDash([6, 6]); round(sg, x + 10, y + 10, w - 20, h - 20, 10, null, CITY[blockCity(i)].col + '77', 2); sg.restore();
      if (miss < 1) { text(sg, 'DARK BLOCK', x + w / 2, y + h / 2 - 10, 18, `rgba(240,170,90,${1 - miss})`, 'Arial', 'center', '900'); text(sg, `BLOCK ${i + 1}`, x + w / 2, y + h / 2 + 12, 13, '#3a4462'); }
      else { text(sg, 'EMPTY LOT', x + w / 2, y + h / 2 - 10, 15, '#4d5a7a', 'Arial', 'center', '900'); text(sg, `BLOCK ${i + 1}`, x + w / 2, y + h / 2 + 12, 13, '#3a4462'); } } });
  // Respin banner sweeping over the binder as the pockets start to roll.
  if (S && mo && now - S.t0 < 520 * speed()) { const k = (now - S.t0) / (520 * speed()); sg.save(); sg.globalAlpha = Math.sin(Math.min(1, k) * Math.PI) * .9; round(sg, 470, RY + RH / 2 - 44, 460, 88, 18, '#060910f0', GOLD, 4); text(sg, S.before === 1 ? 'FINAL RESPIN' : `RESPIN ${S.n}`, 700, RY + RH / 2 + 1, 46, '#fff1b8', 'Arial', 'center', '900'); sg.restore(); }
  // Binder full: the whole page flashes gold.
  if (S && S.fill && mo && now > S.lastLand && now - S.lastLand < 700) { sg.save(); sg.globalAlpha = (1 - (now - S.lastLand) / 700) * .5; sg.fillStyle = '#fff1b8'; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  // Respins left: three lamps. The one just spent goes out as the pockets roll; a new card refills them one by one.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0, by = RY + RH + 8; sg.save(); round(sg, RX + 14, by, 290, 48, 12, '#060910e6', rs ? CREAM : GOLD, rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, by + 25, 20, CREAM, 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const spent = S && now < S.end && !(S.added.size && now >= S.firstHit) ? S.before - 1 : fr.left, refill = S && S.added.size && now >= S.firstHit && k >= S.before - 1 ? now >= S.firstHit + (k - (S.before - 1) + 1) * 130 * speed() : true;
    const on = k < (S && S.added.size && now >= S.firstHit ? fr.left : spent) && refill, used = S && now < S.lastLand && k === S.before - 1 && !(S.added.size && now >= S.firstHit);
    sg.beginPath(); sg.arc(RX + 170 + k * 44, by + 24, 14, 0, 7); sg.fillStyle = on ? (rs ? '#fff1b8' : ACCENT) : used ? (Math.floor(now / 110) % 2 ? '#e0964a' : '#4a2c12') : '#1d202a'; if (on && rs) { sg.shadowColor = ACCENT; sg.shadowBlur = 20; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 440, by, 280, 48, 12, '#060910e6', GOLD, 2); text(sg, `LIT ${fmt(tot * f.bet)} LAYR`, RX + RW - 300, by + 25, 21, CREAM, 'Arial', 'center', '900');
  const busy = chainBusy();
  if (E.featureDone(f) && !busy && now - chainFlash > 700) button('COLLECT', 570, RY + RH / 2 - 37, 260, 74, collectScene);
  else if (!E.featureDone(f) && !busy) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }
function drawJackpotPlay(now) { backdrop('jackpot', now); const t = Math.min(1, (now - scene.t0) / (4200 * speed())), amt = scene.data.amount * ease(t);
  // Chasing bulbs round the whole screen, Miami orange on the left half and New York blue on the right.
  for (let k = 0; k < 56; k++) { const p = k / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = motionOK() ? (k + Math.floor(now / 90)) % 3 === 0 : k % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? (x < 700 ? '#ffc58f' : '#a9c4ff') : (x < 700 ? '#4a2208' : '#122251'); sg.fill(); }
  // The leading city's gold Degen turns on its vertical axis between the two city coins.
  const s = 300, turn = motionOK() ? Math.cos(now / 650) : 1, sw = Math.max(.06, Math.abs(turn)); sg.save(); sg.translate(700, 120 + s / 2); sg.scale(sw, 1); sg.shadowColor = GOLD; sg.shadowBlur = 60; sg.drawImage(jackpotTile(), -s / 2, -s / 2, s, s); sg.restore();
  const bob = motionOK() ? Math.sin(now / 500) * 8 : 0; if (pools.cherry[0]) sg.drawImage(pools.cherry[0].tile, 230, 190 + bob, 170, 170); if (pools.lemon[0]) sg.drawImage(pools.lemon[0].tile, 1000, 190 - bob, 170, 170);
  sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, 'KEY TO THE CITY', 700, 500, 70, CREAM, 'Georgia, serif', 'center', '900'); sg.restore();
  text(sg, `${fmt(Math.round(amt))} LAYR`, 700, 600, 90, '#ffffff', 'Arial', 'center', '900'); text(sg, `${CITY[leader()].long.toUpperCase()} HOLD THE KEY THIS PERIOD`, 700, 680, 20, '#cfd9f5', 'Arial', 'center', '800');
  if (t < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (t >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }
// The gamble's result face: the coin of the city that came up (odd = Miami, even = New York).
function gambleFace(r) { if (r.face) return r.face; const miami = r.parity === 'odd', it = (miami ? pools.cherry : pools.lemon)[0]; r.face = { tile: it ? it.tile : names[miami ? 'cherry' : 'lemon'], name: miami ? 'MIAMI' : 'NEW YORK' }; return r.face; }
const callName = c => c === 'odd' ? 'MIAMI' : 'NEW YORK';
function drawGamblePlay(now) { backdrop('gamble', now); const r = scene.data.result, t = (now - scene.t0) / (1500 * speed()), landed = t >= .95 || !motionOK(), face = gambleFace(r);
  if (motionOK() && t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('roll');
  text(sg, 'THE COIN', 700, RY + 60, 26, '#cfd9f5', 'Arial', 'center', '900');
  // The coin spins on its axis, slowing, showing Miami and New York in turn, and lands on one.
  const turn = landed ? 1 : Math.cos(t * Math.PI * (6 - 5 * t)), cw = 220, spinTile = turn >= 0 ? pools.cherry[0] : pools.lemon[0]; sg.save(); sg.translate(700, RY + 195); sg.scale(Math.max(.05, Math.abs(turn)), 1); sg.shadowColor = GOLD; sg.shadowBlur = 30; sg.drawImage(landed ? face.tile : (spinTile ? spinTile.tile : face.tile), -cw / 2, -cw / 2, cw, cw); sg.restore();
  // The proof: the last digit of the hash decides Miami (odd) or New York (even).
  const tail = r.hash.slice(-14, -1), last = r.hash.slice(-1); sg.font = '900 30px Courier New'; const tw = sg.measureText('…' + tail).width, lw = 40, x0 = 700 - (tw + lw + 6) / 2;
  text(sg, 'PROOF', 700, RY + 338, 15, '#9aa8c9', 'Arial', 'center', '900'); text(sg, '…' + tail, x0, RY + 372, 30, '#dbe4fb', 'Courier New', 'left', '900'); round(sg, x0 + tw + 6, RY + 350, lw, 44, 8, landed ? (r.win ? (r.parity === 'odd' ? MIA : NYC) : '#2a3144') : '#141b30', CREAM, 3); text(sg, landed ? last : '?', x0 + tw + 6 + lw / 2, RY + 373, 30, '#ffffff', 'Courier New', 'center', '900');
  if (landed) { if (!scene.data.landed) { scene.data.landed = true; sfx('land'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) particles(25); } text(sg, `${face.name} · YOU CALLED ${callName(r.choice)}`, 700, RY + 428, 26, r.win ? CREAM : '#9aa4bd', 'Arial', 'center', '900'); button('CONTINUE', 570, RY + 462, 260, 66, () => setStage('outro')); }
  skipChip(); }
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed()));
  backdrop(kind, now, .4); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'MINING SEASON OVER'; total = data.total; lines = [`${data.count} free spins played at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''}`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any vault or block party won during the season', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'VAULT CRACKED'; total = data.total; lines = [`3 boxes opened: ${(data.picks || []).map(m => `${RARITY[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = 'BLOCK PARTY OVER'; total = data.total; lines = [`${data.cells}/15 blocks lit · ${data.respins} respins`, data.jackpot ? `The whole map is lit: Key to the City +${fmt(data.jackpot)} next` : 'Light all 15 blocks to win the Key to the City'] }
  if (kind === 'jackpot') { title = 'KEY TO THE CITY'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'DOUBLED' : 'WRONG CITY') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`The coin landed ${r.parity === 'odd' ? 'MIAMI' : 'NEW YORK'}; you called ${callName(r.choice)}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); sg.shadowColor = GOLD; sg.shadowBlur = 24; text(sg, title, 700, RY + 110, 64, CREAM, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 220, 84, '#ffffff', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 300 + i * 36, 23, '#dbe4fb', 'Arial', 'center', '700')); sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 110, 260, 78, nextScene); }
function drawRainPlay(now) { // the reels, re-skinned: Miami and New York mining side by side, MiamiCoin and NYCCoin falling
  splitBg(sg, RY, RH, ['#1a0b05', '#35160a', '#4a1f0a'], ['#050c26', '#0a1d52', '#10307d']);
  const w = drawReels(now); drawMiningRain(now);
  round(sg, 260, RY - 30, 880, 46, 12, '#05081a', GOLD, 3); text(sg, `MINING SEASON · ${state.free} SPIN${state.free === 1 ? '' : 'S'} LEFT · ${fmt(state.freeTotal)} LAYR · ALL WINS 2×`, 700, RY - 6, 20, CREAM, 'Arial', 'center', '900');
  return w; }
function drawScreen(now) {
  hits = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState(), L = leader(), liveCounts = sources.counts === 'live';
  // The two city tabs: this period's twin race. "+n" is new twins since the period began; unknown reads show a dash, never a zero.
  for (const [c, x0] of [['miami', 208], ['nyc', 1192]]) { const gain = raceGain(c, hs), col = CITY[c].col, lead = L === c;
    text(sg, CITY[c].long.toUpperCase(), x0, 42, 19, c === 'miami' ? '#ffb27a' : '#9fbcff', 'Arial', 'center', '900');
    if (lead) { round(sg, x0 - 56, 56, 112, 20, 10, GOLD); text(sg, 'LEADING CITY', x0, 66.5, 12, '#2a1d00', 'Arial', 'center', '900'); }
    text(sg, gain == null ? '—' : `+${gain}`, x0, lead ? 108 : 98, lead ? 40 : 50, INK, 'Courier New', 'center', '900');
    text(sg, gain == null ? 'NEW TWINS · COUNT UNKNOWN' : 'NEW TWINS THIS PERIOD', x0, 140, 14, '#aab6d6');
    text(sg, raceCounts[c] == null ? 'TWINS UNKNOWN' : `${fmt(raceCounts[c])} TWINNED${liveCounts ? '' : ' · LAST KNOWN'}`, x0, 164, 14, col === MIA ? '#ff9a4d' : '#7fa6ff'); }
  text(sg, 'KEY TO THE CITY JACKPOT', 700, 44, 23, GOLD, 'Arial', 'center', '900');
  text(sg, fmt(E.meter(state, shownBet)), 700, 96, 56, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 160, 17, '#aab6d6');
  text(sg, height.value ? `BITCOIN BLOCK ${height.value.toLocaleString('en-GB')} · ${height.stale ? 'LAST KNOWN' : 'LIVE'}` : 'BITCOIN BLOCK UNAVAILABLE', 700, 132, 13, height.stale ? '#7d88a8' : '#8fb4ff');
  // The race bar: orange for Miami, blue for New York, sized by new twins this period (an even bar when either count is unknown).
  const gm = raceGain('miami', hs), gn = raceGain('nyc', hs), pm = gm != null && gn != null && gm + gn > 0 ? gm / (gm + gn) : .5;
  round(sg, RX, 788, RW, 14, 7, '#0a0d19'); sg.save(); sg.beginPath(); sg.roundRect(RX, 788, RW, 14, 7); sg.clip(); sg.fillStyle = MIA; sg.fillRect(RX, 788, RW * pm, 14); sg.fillStyle = NYC; sg.fillRect(RX + RW * pm, 788, RW * (1 - pm), 14); sg.fillStyle = '#e6eaf2'; sg.fillRect(RX + RW * pm - 2, 786, 4, 18); sg.restore();
  const share = c => perTwin(c) == null ? 'SHARE PER TWIN UNKNOWN' : `≈ ${fmt(perTwin(c))} LAYR PER TWIN${linkedCount.test ? ' (TEST)' : ''}`;
  text(sg, `${CITY.miami.name} TWINS ${L === 'miami' ? '60' : '40'}%  ·  ${share('miami')}`, 370, 852, 14, '#ffb27a'); text(sg, `${CITY.nyc.name} TWINS ${L === 'nyc' ? '60' : '40'}%  ·  ${share('nyc')}`, 1030, 852, 14, '#9fbcff');
  text(sg, `HOLDER POT ${fmt(hs.pot)} · ${hs.period.replace('-W', ' W')}`, 700, 852, 17, INK, 'Arial', 'center', '900');
  let msg, msgColor = CREAM;
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawJackpotPlay(now); labBanner(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultPlay(f, now); else if (k === 'chain' && f) drawGrabPlay(f, now); else if (k === 'gamble' && scene.data.result) drawGamblePlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'MIAMI OR NEW YORK? CALL THE COIN' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `CRACK A BOX · OPEN ${f ? 3 - f.picks.length : 0} MORE · TAP A BOX`) : scene.kind === 'chain' ? (f ? chainMsg(f, now) : 'BLOCK PARTY') : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawRainPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction); const it = w ? cameoFor(w) : null;
    msg = spinning ? 'DRIVING THROUGH THE CITY…' : w ? `LINE ${w.line + 1}  ·  ${w.symbol === 'bitcoin' ? CITY[L].long.toUpperCase() : w.symbol === 'artifact' ? CITY[other(L)].long.toUpperCase() : NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  ${cameoLabel(it)}` : ''}` : state.free ? `${state.free} MINING SEASON SPINS  ·  ALL WINS 2×` : state.gamble ? `WIN ${fmt(state.gamble)} · MIAMI OR NEW YORK?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'MIAMI DEGENS VS NYC DEGENS · FOREVER ON STACKS'; if (state.free && !spinning) msgColor = '#fff1b8'; }
  text(sg, msg, 700, 822, 25, msgColor);
  drawBlocks();
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 926, 26, '#e8eeff', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 926, 26, '#e8eeff'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 926, 26, CREAM, 'Arial', 'right');
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
  // Test hooks only: forced reel stops for the first five draws (see DegenCity.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = lab.on ? labRng() : forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : undefined;
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  // The result is committed to the shared account before anything moves. The Holder Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  hideBar(); spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now();
  if (p.free) sound('tick');
  status(p.free ? 'MINING SEASON SPIN · ALL WINS 2×' : 'DRIVING THROUGH THE CITY…');
  // Now, and only now, choose which inscriptions show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Cameos: the card on each winning line, kept in the round's history for the future holder royalty.
function recordCameos(r) { const cameos = r.wins.map(w => { const it = cameoFor(w); return it ? { tokenId: it.id, xtrataId: it.xtrataId || null, collection: it.collection || it.key, lineWin: w.amount } : null; }).filter(Boolean); const h = state.history[0]; if (h && h.id === r.round.id) h.cameos = cameos; if (cameos.length) holderState().cameos = (holderState().cameos || 0) + cameos.length; return cameos; }
let spinEndAt = 0, sceneDue = false; // the Lab autopilot waits for the scenes a finished spin queues (they start 350 ms later)
function finishSpin() {
  spinEndAt = performance.now(); spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; recordCameos(r); save(); update();
  if (airdrop && r.round.free) airdrop.best = Math.max(airdrop.best, r.total);
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'KEY TO THE CITY · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · CITYCOINS' : ''}` : (r.round.free ? 'MINING SPIN COMPLETE' : 'NO WIN THIS DEAL · DRIVE AGAIN');
  if (state.gamble) msg += ' · MIAMI OR NEW YORK?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Rain.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (airdrop) airdrop.retriggers++; toast(`More CityCoins! +${r.freeAward} Mining Season spins.`); sfx('sting-free'); } else toast('Mining Season cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); sceneDue = true; setTimeout(() => { sceneDue = false; startScene(q[0].kind, q[0].data || {}); }, 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(airdropOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}
// Free spins run on their own once the Rain has started, one after another; Skip or the bar can hurry them.
function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-pilot stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-PILOT STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-pilot.', `<p>Auto-pilot spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-PILOT again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('MINING SEASON', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="odd">Miami</button><button class="bar-cta" data-act="even">New York</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Claim' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Open ${3 - f.picks.length} of 9 boxes`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Box ${i + 1}${f.picks.includes(i) ? `, ${RARITY[f.awards[i]]}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 blocks lit · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 lit`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ›'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Flipping the coin…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickVault(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'DEGEN CITY') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
function openCollections() {
  const L = leader(), T = other(L), where = { cherry: 'MiamiCoin (MIA), official token logo', lemon: 'NYCCoin (NYC), official token logo', chip: 'Miami Degens (orange frame)', block: 'NYC Degens (blue frame)', artifact: `${CITY[T].long} (silver frame), the trailing city`, bitcoin: `${CITY[L].long} (gold frame), the leading city`, wild: 'Both collections, frame half orange and half blue', scatter: 'CityCoins logo', vault: 'Miami Degens and NYC Degens collection logos', chain: "A twinned Degen's Xtrata inscription ID" };
  const rows = Object.entries(COLS).map(([s, c]) => { const n = pools[s].length; return `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(s === 'bitcoin' ? `Leading-city Degen · ${CITY[L].long}` : s === 'artifact' ? `Trailing-city Degen · ${CITY[T].long}` : c.name)}</td><td>${s === 'wild' ? 'Wild' : esc(NAMES[s])}</td><td>${esc(where[s])}</td><td>${fmt(n)}</td></tr>`; }).join('');
  showModal('collections', 'The Degens on the reels.', `<p>Every symbol is real. <b>Miami Degens</b> and <b>NYC Degens</b> are Stacks NFT collections of 420 each; a Degen with a permanent Xtrata twin shows in full colour with a ∞ badge and its token number, and one without is greyed out with a <b>NOT YET FOREVER</b> stamp. <b>MiamiCoin</b>, <b>NYCCoin</b> and the <b>CityCoins</b> logo are the official token logos. A <b>city block</b> is a twinned Degen's Xtrata inscription ID.</p>
  <p><b>The city race.</b> At each snapshot the city whose collection gained more new twins in the period becomes the leading city for the next one: its Degens take the gold frames and the jackpot symbol, the other city's Degens the silver frames. Right now <b>${esc(CITY[L].long)}</b> lead${hs0().raceNote}. This changes only which art fills the two slots, never the maths.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>ROLE</th><th>SOURCE</th><th>ON THE REELS</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="fine">${fmt(sources.bundled)} Degens bundled, ${fmt(sources.images)} loaded live${sources.listFailures || sources.imageFailures ? `, ${sources.listFailures + sources.imageFailures} skipped` : ''}; ${fmt(sources.logos)} logos bundled. The NYC Degens collection logo has no public file yet, so it shows the name set in type. Art is chosen after each result is fixed, using a separate random draw, so what loads can never change your odds. Artwork belongs to each artist and project; test build, shown pending their OK.</p><button class="outline" id="colHolders">Holder Pot ↗</button>`, 'THE DEGENS');
  $('colHolders').onclick = openHolders;
}
function hs0() { const hs = holderState(); const gm = raceGain('miami', hs), gn = raceGain('nyc', hs); return { raceNote: gm == null || gn == null ? ' (new-twin counts not read yet)' : ` (this period: Miami +${gm}, New York +${gn})` }; }
function openHolders() {
  const h = holderState(), L = leader(), T = other(L), line = c => `<tr><td>${esc(CITY[c].long)}${c === L ? ' · leading' : ''}</td><td>${c === L ? '60%' : '40%'}</td><td>${fmt(potShare(c))}</td><td>${raceCounts[c] == null ? 'unknown' : fmt(raceCounts[c])}</td><td>${perTwin(c) == null ? 'unknown' : fmt(perTwin(c))}</td></tr>`;
  showModal('holders', 'The Holder Pot.', `<p>1% of every paid bet on Degen City goes into this week's Holder Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players. The pot splits <b>60% to the twins of the leading city</b> and <b>40% to the other city's twins</b>.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(h.period)}</span><strong>${fmt(h.pot)}</strong></div><div><span>LAST WEEK${h.last ? ` · ${esc(h.last.period)}` : ''}</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div><div><span>CAMEOS RECORDED</span><strong>${fmt(h.cameos || 0)}</strong></div></div>
  <table class="paytable"><thead><tr><th>CITY</th><th>SPLIT</th><th>SHARE · LAYR</th><th>TWINS</th><th>PER TWIN</th></tr></thead><tbody>${line('miami')}${line('nyc')}</tbody></table>
  <p><b>The city race.</b> Each community has a reason to rally every period: twin more Degens than the other city. Twins gained since the period began: Miami ${raceGain('miami') == null ? 'unknown' : '+' + raceGain('miami')}, New York ${raceGain('nyc') == null ? 'unknown' : '+' + raceGain('nyc')}. ${h.last && h.last.gain ? `Last period: Miami ${h.last.gain.miami == null ? '—' : '+' + h.last.gain.miami}, New York ${h.last.gain.nyc == null ? '—' : '+' + h.last.gain.nyc}.` : ''}</p>
  <p><b>How it will pay.</b> Holders link a Bitcoin address by signing a message from it (Leather and Xverse both hold a Bitcoin and a Stacks account). At the end of each week the pot is split per twin held. When your Degen lands on a winning line, its token number and Xtrata ID show in the win message and the round records it as a cameo for a 1% royalty.</p>
  <p class="fine">Version 1 shows the meters only. Address linking, snapshots and payouts need a server or contract and are not built yet, so a share per twin shows as unknown rather than a guess. Twin counts come from each collection's helper contract; a failed read is "unknown", never "none". The pot meter is kept with this browser's LAYR session.${lab.on ? ' In the Bonus Lab the pot is not touched.' : ''}</p><button class="outline" disabled>Link a Bitcoin address · coming soon</button>`, 'HOLDER REWARDS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · '), L = leader();
  showModal('rules', 'The rates.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. A <b>Split Degen</b> is wild: it replaces every paying symbol and has its own pays, but never replaces CityCoins, a Degens collection logo or a city block. The leading city's gold Degen (${esc(CITY[L].long)}) is the top symbol.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${s === 'bitcoin' ? `Gold Degen · ${esc(CITY[L].long)}` : s === 'artifact' ? `Silver Degen · ${esc(CITY[other(L)].long)}` : NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five gold Degens on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3>MINING SEASON</h3><p>3, 4 or 5 CityCoins logos anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. The screen splits into the two cities mining side by side, and every win pays <b>2×</b>. More CityCoins adds 4 spins, up to 24 per feature. Your bet is locked for the feature. City Vault and Block Party can trigger during it and pay at 1×.</p>
  <h3>CITY VAULT</h3><p>3 or more Degens collection logos open a vault of nine safe-deposit boxes, alternating Miami and New York. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three; a Degen sits inside each.</p>
  <h3>BLOCK PARTY</h3><p>5 or more city blocks start a hold-and-respin. The 15 cells form a map, Miami on the left and New York on the right. Each lock lights a block with a twinned Degen, its Xtrata ID and a value of ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each dark block has a 1 in ${E.CHAIN_ODDS} (4%) chance to light per respin, and any new block resets the count to 3. Light the whole map to win the Key to the City as well.</p>
  <h3>KEY TO THE CITY</h3><p>Five gold leading-city Degens on the centre row (wilds don't count), or all 15 blocks lit, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>MIAMI OR NEW YORK</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call: will the coin land Miami or New York? Right doubles the win; wrong loses that win only. The proof shown is the hash whose last digit decides it: odd is Miami, even is New York.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Degen City runs on the same engine as Block Fortune and the other ParallaX Casino machines: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which Degens to show, using a separate random draw, so the pictures, and the city race, can never change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins 59.7%, CityCoins scatter pays 1.5%, Mining Season 8.5%, City Vault 11.9%, Block Party 10.3% and the jackpot 2.4%, worked out exactly from the strips and confirmed by 5-million-spin simulations. Mining Season and City Vault each arrive about 1 in 140 spins, Block Party about 1 in 290, the Key to the City about 1 in 113,000. Miami or New York is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">The Degens on the reels ↗</button> <button class="outline" id="rulesHolders">Holder Pot ↗</button>`, 'THE RATES · HOW TO PLAY');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['Mining Season', 'Three CityCoins anywhere pay a scatter prize and award 8 free spins. The screen splits into Miami and New York mining side by side. Every win is doubled, and more CityCoins adds 4 spins, up to 24 per feature.'], vault: ['City Vault', 'Three Degens collection logos open nine safe-deposit boxes, alternating Miami and New York. Open three: each holds a Degen and a prize from 1× to 15× your total bet.'], chain: ['Block Party', 'Five city blocks start a hold-and-respin. The 15 cells are a map, Miami on the left and New York on the right; each lock lights a block with a twinned Degen. Any new block resets your three respins, and lighting the whole map wins the Key to the City.'], genesis: ['Key to the City', 'A progressive meter for each bet level. Land five gold leading-city Degens on the centre row, or light all 15 Block Party cells, to win it. It starts at 500× your bet and grows with every paid spin at that level.'] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'KEY TO THE CITY').replace('CHAIN', 'BLOCK PARTY').replace('VAULT', 'CITY VAULT').replace('FREE SPINS', 'MINING SEASON').replace('RETRIGGER', 'MORE CITYCOINS');
function openHistory(){
 const body=`${lab.on ? '<p class="lab-note"><b>BONUS LAB.</b> These rounds are practice only. They are not part of your real history, balance or RTP statistics.</p>' : ''}<div class="stat-cards"><div><span>WAGERED · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.paidOut)}</strong></div></div><p>Latest 50 rounds. All amounts use the shared LAYR account${lab.on ? ' (here: the Lab\'s own practice balance)' : ''}. The card on a winning line is recorded with each round.</p><table class="paytable"><thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th><th>ON THE LINE</th></tr></thead><tbody>${state.history.map(h=>`<tr><td>${lab.on ? '<b class="lab-tag">LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Rain spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${(h.cameos||[]).slice(0,2).map(c=>esc(String(c.tokenId))).join(', ')}</td></tr>`).join('')}</tbody></table><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history',lab.on ? 'Lab session (practice LAYR).' : 'Your LAYR session.',body,lab.on ? 'LAB · LAYR HISTORY' : 'LAYR HISTORY');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,lab:lab.on,currency:'LAYR',wagered:state.wagered,paidOut:state.paidOut,holder:lab.on?null:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+(lab.on?'-LAB':'')+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', lab.on ? 'Lab practice LAYR.' : 'Your LAYR account.', `<div class="stat-cards"><div><span>${lab.on ? 'LAB PRACTICE LAYR' : 'AVAILABLE LAYR'}</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>${lab.on ? 'This is the Bonus Lab\'s own practice balance. Your real LAYR is untouched.' : 'Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.'}</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, lab.on ? 'BONUS LAB' : 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Make it yours.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no particles or falling coins)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space drives, respins and collects. 1–9 open vault boxes. A calls Miami, N calls New York. M mutes. F is full screen.${LAB_OK ? ' L opens the Bonus Lab.' : ''}</p><button class="outline" id="setCols">The Degens on the reels</button><button class="outline" id="setHolders">Holder Pot</button><button class="outline" id="setHistory">Session history</button>${LAB_OK ? `<button class="outline" id="setLab">${lab.on ? 'Bonus Lab (open)' : 'Bonus Lab'}</button>` : ''}`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory; if ($('setLab')) $('setLab').onclick = () => { closeModal(); openLab(); };
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Degen City runs on the same engine as Block Fortune and the other ParallaX Casino machines: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which Degens to show, using a separate random draw, so the art, and the city race that decides which city wears the gold frames, can never change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td><td>every spin</td></tr><tr><td>CityCoins scatter pays</td><td>1.5%</td><td>with Mining Season</td></tr><tr><td>Mining Season (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>City Vault (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>Block Party (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Key to the City (jackpot)</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Miami or New York is an even bet and doesn't change the return. The figures are worked out exactly from the strips across all 33,554,432 reel positions and confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Holder Pot (1% of paid bets, split 60% to the leading city's twins and 40% to the other's) is funded from the house edge and never reduces a win.</p>`, 'FAIR PLAY');
}
/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'DRIVE', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['odd', 'MIAMI', 'call Miami', 'fb gold'], ['even', 'NEW YORK', 'call New York', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'MIAMI OR NYC?', 'gamble win', 'fb gold'],
  ['betDown', '−STAKE', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+STAKE', 'bet up', 'fb'], ['max', 'MAX STAKE', 'max bet', 'fb'], ['auto', 'AUTO-PILOT', 'auto', 'fb'],
  ['pays', 'RATES', 'pays', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'HISTORY', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), gamble: () => openGamble(), betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => enterLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 6).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(6).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free;
  q('primary').querySelector('b').textContent = spinning ? 'DRIVING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('odd', gambleIntro); show('even', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0);
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance);
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-PILOT';
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
// The casino never sets PX_STANDALONE_TEST, so on the public casino DegenCity.test is null.
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
  { id: 'free', label: 'Mining Season', sub: '3 CityCoins · 8 free spins at 2×', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'retrigger', label: 'More CityCoins', sub: 'Mining Season, then 3 CityCoins on the first free spin: +4 spins', kind: 'free', plan: [{ stops: S.s3 }, { stops: S.s3 }] },
  { id: 'pick', label: 'City Vault', sub: '3 collection logos · open three of nine boxes', kind: 'vault', plan: [{ stops: S.vault }] },
  { id: 'hold', label: 'Block Party', sub: '9 city blocks · hold and respin', kind: 'chain', plan: [{ stops: S.chain }] },
  { id: 'fullgrid', label: 'Whole map lit', sub: 'Every block lights: Key to the City jackpot', kind: 'chain', also: 'jackpot', plan: [{ stops: S.chain, lockAll: true }] },
  { id: 'centre', label: 'Centre-row jackpot', sub: 'Five gold leading-city Degens on the centre row', kind: 'jackpot', plan: [{ stops: S.jackpot }] },
  { id: 'gamble-win', label: 'Miami or New York: win', sub: 'A plain win, then a correct call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'win' },
  { id: 'gamble-loss', label: 'Miami or New York: loss', sub: 'A plain win, then a wrong call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'loss' },
  { id: 'scatter3', label: '3 CityCoins', sub: 'Pays 2× bet and starts Mining Season', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'scatter4', label: '4 CityCoins', sub: 'Pays 5× bet and starts Mining Season', kind: 'free', plan: [{ stops: S.s4 }] },
  { id: 'scatter5', label: '5 CityCoins', sub: 'Pays 10× bet and starts Mining Season', kind: 'free', plan: [{ stops: S.s5 }] },
  { id: 'race-miami', label: 'City race: Miami leads', sub: 'Gold frames go to Miami Degens, silver to NYC; one plain spin', kind: 'race', race: 'miami', plan: [{ stops: S.win }] },
  { id: 'race-nyc', label: 'City race: New York leads', sub: 'Gold frames go to NYC Degens, silver to Miami; one plain spin', kind: 'race', race: 'nyc', plan: [{ stops: S.win }] }
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
  state = lab.real; E = E0; lab.on = false; lab.real = null; lab.seedShown = null; lab.script = []; lastResult = null; raceOverride = null; rebuildCityPools();
  refaceIdle(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
function runLabItem(item, opts = {}) {
  if (!lab.on) return 'not-in-lab'; if (spinning) return 'busy'; labClean(); closeModal();
  const seed = opts.seed != null ? opts.seed >>> 0 : lab.mode === 'random' ? (Math.random() * 4294967296) >>> 0 : lab.seed >>> 0;
  lab.rand = mulberry(seed); lab.seedShown = seed; lab.last = { id: item.id, seed }; lab.seen = []; lab.running = item.id; lab.gambleWant = item.gamble || null; { const want = item.race || null; if (want !== raceOverride) { raceOverride = want; rebuildCityPools(); } }
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
  const complete = it.kind === 'race' || need.every(k => ['trigger', 'intro', 'outro'].every(s => stages.includes(`${k}:${s}`)));
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
  twins(mode) { if (!['default', 'none', 'some', 'all'].includes(mode)) throw Error('default, none, some or all'); twinMode = mode; rebuildCityPools(); update(); return { mode, forever: Object.fromEntries(CITIES.map(c => [c, cityItems[c].filter(foreverFor).length])), of: Object.fromEntries(CITIES.map(c => [c, cityItems[c].length])) }; },
  race(city) { if (city !== null && !CITY[city]) throw Error('miami, nyc or null'); raceOverride = city; rebuildCityPools(); update(); return leader(); },
  raceGains(m, n) { const h = holderState(); h.base = { miami: 1000, nyc: 1000 }; raceCounts.miami = 1000 + m; raceCounts.nyc = 1000 + n; sources.counts = 'live'; screenDirty = true; update(); return { miami: raceGain('miami'), nyc: raceGain('nyc') }; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); linkedCount = { ok: true, value: LINKED_TEST[mode], test: true }; screenDirty = true; update(); return linkedCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on), lab: labApi
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops; nothing here exists on the public casino.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">Mining Season</button><button class="cta" data-t="vault">City Vault</button><button class="cta" data-t="chain">Block Party</button><button class="cta" data-t="jackpot">Key to the City</button><button class="cta" data-t="gamble">Miami or New York</button></div>
  <h3>TWINS (MIAMI DEGENS AND NYC DEGENS)</h3><div class="ab"><button class="outline" data-w="default">As loaded</button><button class="outline" data-w="none">None</button><button class="outline" data-w="some">Some</button><button class="outline" data-w="all">All</button></div><p class="fine">Switches how many Degens show as forevered. The rest are greyed with NOT YET FOREVER.</p>
  <h3>CITY RACE</h3><div class="ab"><button class="outline" data-r="miami">Miami leads</button><button class="outline" data-r="nyc">New York leads</button><button class="outline" data-r="auto">As computed</button></div><div class="ab"><button class="outline" data-g="40,10">Miami +40 · NY +10</button><button class="outline" data-g="5,25">Miami +5 · NY +25</button></div><p class="fine">Pins the leading city (which city wears the gold and silver frames and sets the music) or sets this period's new-twin counts. The maths never changes.</p>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>${LAB_OK ? '<h3>BONUS LAB</h3><button class="outline" id="tLab">Open the Bonus Lab</button>' : ''}`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  document.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.w); toast(`Twins: ${b.dataset.w}.`); });
  document.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { testApi.race(b.dataset.r === 'auto' ? null : b.dataset.r); toast(b.dataset.r === 'auto' ? 'City race: as computed.' : `${CITY[b.dataset.r].long} lead.`); });
  document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const [m, n] = b.dataset.g.split(',').map(Number); testApi.raceGains(m, n); toast(`New twins this period: Miami +${m}, New York +${n}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked); if ($('tLab')) $('tLab').onclick = () => { closeModal(); enterLab(); };
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Mining Season 1 in ${r.freeEvery.toFixed(0)} · Vault 1 in ${r.pickEvery.toFixed(0)} · Block Party 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }
/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return;
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickVault(Number(e.key) - 1);
  else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') requestFullscreen(!fsOn); else if (e.key.toLowerCase() === 's' && canSkip()) skipScene();
  else if (e.key.toLowerCase() === 'a' && scene?.kind === 'gamble') callGamble('odd'); else if (e.key.toLowerCase() === 'n' && scene?.kind === 'gamble') callGamble('even');
  else if (e.key.toLowerCase() === 'l' && LAB_OK) { if (lab.on) openLab(); else enterLab(); }
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-PILOT STOPPED'); } } updateFsBar(); });
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
  if (state.freeActive && motionOK()) screenDirty = true; // the falling coins
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
  else if (state.free) { renderBar(); status(`${state.free} SAVED MINING SEASON SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(airdropOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; live top-ups start only after the frame has loaded and a player connects, so a slow
// network can never hold up the cabinet becoming ready.
let liveStarted = false; const startLive = () => { if (liveStarted) return; liveStarted = true; loadLive().catch(() => { sources.done = true; }); };
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.DegenCity = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), leader: () => leader(), race: () => ({ counts: { ...raceCounts }, gains: { miami: raceGain('miami'), nyc: raceGain('nyc') }, leader: leader() }), height: () => ({ ...height }), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
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
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'DRIVE',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();


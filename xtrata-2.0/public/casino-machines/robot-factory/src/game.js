/* Robot Factory — a ParallaX Casino machine (machine 6 of 20, accent #7048e8). Every symbol is real Megapont material on Stacks:
   Megapont Ape Club apes (Forever Twins on Xtrata where they exist), Megapont Robots, Robot Components and Space Agency NFTs, and the
   official Megapont logo. The maths is Deep Strata's engine, byte for byte: Block Fortune v2 with the Layer Cascade rule (the Assembly
   Line here), BF.create(DEEP_STRATA_RULES), 94.38% return. Every outcome, including the whole cascade, is fixed by the engine before any
   art is chosen, and art is picked with Math.random, never the engine's generator, so loaded art can never change a result. The casino
   owns all 3D rendering and cameras; this frame only draws the cabinet screen and handles the controls. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='robot-factory', LAYR=window.ParallaxLAYRAccount, RAW=BF.create(DEEP_STRATA_RULES);
let E=LAYR.machine(GAME_ID,BF.create(DEEP_STRATA_RULES));
const E0 = E; // the Bonus Lab swaps E for the raw engine and back; nothing else ever does
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, ACCENT = '#7048e8', YEL = '#ffc910', AMB = '#ffb020', CREAM = '#f4efe0', GOLD = '#f2c14e';
// Engine slot ids are internal only; the player only ever sees these names.
const NAMES = { cherry: 'Megapont Ape · Tier III', lemon: 'Megapont Ape · Tier II', chip: 'Megapont Ape · Tier I', block: 'Megapont Space Agency', artifact: 'Megapont Robot', bitcoin: 'Gold-frame Megapont Ape', wild: 'Mech Suit', scatter: 'Megapont', vault: 'Robot Crate', chain: 'Robot Component' };
const SHORT = { cherry: 'TIER III', lemon: 'TIER II', chip: 'TIER I', block: 'SPACE AGENCY', artifact: 'ROBOT', bitcoin: 'GOLD APE', wild: 'MECH SUIT', scatter: 'MEGAPONT', vault: 'CRATE', chain: 'COMPONENT' };
// Tier colours tell the group at a glance: purple III, blue II, red I, gold for the rarest 2%.
const COLS = {
  cherry:   { key: 'megapont-ape-club',     name: 'Megapont Ape, Tier III', color: '#8b5cf6', kind: 'ape', tag: 'TIER III' },
  lemon:    { key: 'megapont-ape-club',     name: 'Megapont Ape, Tier II',  color: '#4c9bff', kind: 'ape', tag: 'TIER II' },
  chip:     { key: 'megapont-ape-club',     name: 'Megapont Ape, Tier I',   color: '#ff5a5f', kind: 'ape', tag: 'TIER I' },
  block:    { key: 'megapont-space-agency', name: 'Megapont Space Agency',  color: '#6fd3ff', kind: 'msa', tag: 'SPACE AGENCY' },
  artifact: { key: 'megapont-robots',       name: 'Megapont Robot',         color: '#d9dde3', kind: 'robot', tag: 'ROBOT' },
  bitcoin:  { key: 'megapont-ape-club',     name: 'Gold-frame Megapont Ape', color: GOLD, kind: 'ape', tag: 'GOLD' },
  wild:     { key: 'mech-suit',             name: 'Mech Suit',              color: YEL, kind: 'mech', tag: 'MECH SUIT' },
  scatter:  { key: 'megapont',              name: 'Megapont',               color: ACCENT, kind: 'logo', tag: 'MEGAPONT' },
  vault:    { key: 'robot-crate',           name: 'Robot Crate',            color: YEL, kind: 'prop', tag: 'CRATE' },
  chain:    { key: 'megapont-robot-components', name: 'Robot Component',    color: '#b9a6ff', kind: 'component', tag: 'COMPONENT' }
};
// Where the live twin reads go: the Xtrata site's own proxy for the Stacks API, and its inscription endpoint for the twin images.
const SRC = { origin: 'https://xtrata.xyz', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club' };
const ART = window.RF_ART || { apes: [], robots: [], components: [], msa: [], logos: {}, tiers: null }, APES = window.RF_APES || {};
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
// Deck-button press: a fast plunge, a brief bottom-out, then a snappy spring back (about 200 ms in all). The PRESS cap reports it through spinZ,
// so a host that already moves spinPhysical gets it for free; mechanics().press says which button and how far down (0..1) for the rest.
const PRESS_T = { down: 45, hold: 25, up: 130 }, PRESS_DEPTH = .034, PRESS_ACTIONS = ['spin', 'betUp', 'betDown', 'auto', 'pays']; let pressAt = -1e9, pressAction = '';
function pressDepth(now) { const e = now - pressAt; if (e < 0) return 0;
  if (e < PRESS_T.down) { const u = e / PRESS_T.down; return 1 - Math.pow(1 - u, 3); }
  if (e < PRESS_T.down + PRESS_T.hold) return 1;
  const u = (e - PRESS_T.down - PRESS_T.hold) / PRESS_T.up; return u >= 1 ? 0 : Math.pow(1 - u, 2); }
function spinCapZ(now) { const bob = spinning ? (1 + Math.sin(now / 170)) * .006 : 0; return SPIN_Z - Math.max(bob, PRESS_DEPTH * (pressAction === 'spin' ? pressDepth(now) : 0)); }
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
function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'OVERDRIVE WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} OVERDRIVE SPINS · 2×` : lab.on ? 'LAB LAYR' : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(holderState().pot);
  $('gamble').hidden = !canGamble;
  const label = spinning ? 'BUILDING…' : primaryLabel(broke);
  $('spinText').textContent = label; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy();$('spin').setAttribute('aria-busy',String(spinInputBusy()));$('turbo').disabled=spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-BUILD';
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
  if (kind === 'spin') { hiss(.28, .16); clank(.05, .18, 420); whine(150, 420, .45, .035, .05); }
  if (kind === 'stop') return [noise(.03, 5200 + i * 160, 5, .34, at), noise(.06, 2100 + i * 90, 2, .2, at + .012), tone(240 + i * 26, .05, 'square', .04, at), tone(1400, .02, 'square', .02, at)].filter(Boolean); // the card-flip snap
  if (kind === 'win') { arp([523.25, 659.25, 783.99, 1046.5], .055, .08, .06); coins(6, .25); }
  if (kind === 'big') { arp([392, 523.25, 659.25, 783.99, 1046.5, 1318.5], .06, .12, .06); arp([196, 261.63, 329.63, 392], .12, .3, .05, 'triangle'); coins(26, .2); siren(.15); }
  if (kind === 'bonus') arp([392, 523.25, 659.25, 783.99, 1046.5], .1, .22, .07, 'square');
  if (kind === 'antic') { noise(1.5, 700, 1, .05); arp([330, 349.23, 370, 392, 415.3, 440], .22, .2, .03, 'triangle'); }
  if (kind === 'tick') { noise(.025, 3600, 6, .1); bleep(1760, .04, .03); }
  if (kind === 'lock') { noise(.08, 1100, 2, .3, i * .08); bleep(330 + i * 40, .16, .05, i * .08); coins(3, i * .08 + .05); }
  if (kind === 'respin') { noise(.14, 2800, 1, .14); arp([196, 247, 294], .05, .08, .05); }
  if (kind === 'pick') { arp([988 + i * 60, 1318.5 + i * 60], .07, .2, .08, 'square'); coins(4, .08); }
  if (kind === 'click') noise(.02, 3200, 4, .1);
  if (kind === 'lose') arp([294, 247, 196, 147], .1, .18, .06, 'triangle');
  if (kind === 'rung') { whine(220 + i * 110, 520 + i * 260, .38, .05); clank(0, .18 + .04 * i, 380 + i * 90); }
  if (kind === 'crumble') { clank(0, .26, 300); noise(.22, 900, 1, .14, .03); }
  if (kind === 'drop') { noise(.12, 600, 1.2, .18); tone(130, .14, 'triangle', .1, 0, .6); hiss(.2, .08, .05); }
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

/* ---------- Reel tiles: real Megapont art only ----------
   Megapont Ape Club apes are Stacks NFTs with Forever Twins on Xtrata: shown in full colour with an ∞ badge. Megapont Robots,
   Robot Components and Space Agency NFTs have no Xtrata twin yet: shown greyed out with a NOT YET FOREVER stamp. The scatter is the
   official Megapont logo. Nothing here draws an ape, a robot or a logo: where a picture is missing the tile carries only the name,
   set in type, and says the art is pending. */
const TILE = 192; // tiles are drawn on a 240-unit grid at 192 px, which keeps ~150 tiles within phone canvas-memory limits
function fitSize(g, s, maxW, size, min = 9, weight = '900', font = 'Arial') { g.font = `${weight} ${size}px ${font}`; while (g.measureText(s).width > maxW && size > min) { size--; g.font = `${weight} ${size}px ${font}`; } return size; }
function drawInfinity(g, cx, cy, w, color, lw = 3.4) { const h = w * .26; g.save(); g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx, cy); g.bezierCurveTo(cx + w * .1, cy - h * 1.5, cx + w * .5, cy - h * 1.3, cx + w * .5, cy); g.bezierCurveTo(cx + w * .5, cy + h * 1.3, cx + w * .1, cy + h * 1.5, cx, cy); g.bezierCurveTo(cx - w * .1, cy - h * 1.5, cx - w * .5, cy - h * 1.3, cx - w * .5, cy); g.bezierCurveTo(cx - w * .5, cy + h * 1.3, cx - w * .1, cy + h * 1.5, cx, cy); g.stroke(); g.restore(); }
// Desaturate a pixel image onto a small canvas (manual, because ctx.filter is missing in Safari).
function greyscale(img, w, h, smooth) { const t = canvas(w, h), tg = t.getContext('2d'); tg.imageSmoothingEnabled = smooth; const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, fit = Math.min(w / iw, h / ih), k = !smooth && fit >= 1 ? Math.floor(fit) : fit; tg.drawImage(img, (w - iw * k) / 2, (h - ih * k) / 2, iw * k, ih * k);
  try { const d = tg.getImageData(0, 0, w, h), p = d.data; for (let i = 0; i < p.length; i += 4) { const v = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = v * .82 + 18; } tg.putImageData(d, 0, 0); } catch (e) { tg.fillStyle = '#808080cc'; tg.globalCompositeOperation = 'saturation'; tg.fillRect(0, 0, w, h); }
  return t; }
// The "NOT YET FOREVER" stamp for a Stacks NFT with no permanent twin.
function notYetStamp(g, cx, cy, size = 1) { g.save(); g.translate(cx, cy); g.rotate(-.32); const w = 188 * size, h = 40 * size; g.fillStyle = '#2a0c0ce8'; g.fillRect(-w / 2, -h / 2, w, h); g.lineWidth = 3; g.strokeStyle = '#ff5a5f'; g.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); text(g, 'NOT YET FOREVER', 0, 1, 20 * size, '#ff7a7e', 'Arial', 'center', '900'); g.restore(); }
// A picture drawn into the art window of a tile: full colour when forevered, greyscale when not. Pixel art snaps to whole-number scales.
function artWindow(g, item, forever, x, y, w, h, fill = '#171326') {
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, 8); g.clip(); g.fillStyle = fill; g.fillRect(x, y, w, h);
  if (item.img) { const iw = item.img.naturalWidth || item.img.width, ih = item.img.naturalHeight || item.img.height, fit = Math.min(w / iw, h / ih), k = fit >= 1 ? Math.floor(fit) : fit, small = iw <= 200;
    if (forever) { g.imageSmoothingEnabled = !small; g.drawImage(item.img, x + (w - iw * k) / 2, y + (h - ih * k) / 2, iw * k, ih * k); } else g.drawImage(greyscale(item.img, w, h, !small), x, y); }
  g.restore(); }
const foreverBadge = (g, forever, cx = 204, cy = 32) => { if (!forever) return; g.fillStyle = '#0d0a1c'; g.beginPath(); g.arc(cx, cy, 17, 0, 7); g.fill(); drawInfinity(g, cx, cy, 28, '#b9a6ff'); };
// A Megapont Ape Club ape (a Forever Twin). The frame colour is the tier: purple III, blue II, red I, gold for the rarest 2%.
function apeTile(item, sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], gold = sym === 'bitcoin', forever = item.forever !== false, known = !!item.tier; g.scale(TILE / 240, TILE / 240);
  const edge = !forever ? '#7d7a8a' : gold ? lin(g, 12, 6, 228, 222, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']) : col.color;
  g.shadowColor = forever ? col.color : '#000'; g.shadowBlur = forever ? (gold ? 20 : 14) : 4; round(g, 12, 6, 216, 216, 14, '#0d0a1c'); g.shadowBlur = 0; round(g, 12, 6, 216, 216, 14, null, edge, gold ? 9 : 6);
  artWindow(g, item, forever, 24, 18, 192, 158);
  round(g, 24, 180, 192, 32, 7, gold && forever ? '#f2c14e' : '#0d0a1c'); text(g, known ? `${col.tag} · #${item.id}` : `APE #${item.id}`, 120, 196, known ? 17 : 20, gold && forever ? '#2a1d00' : '#efeaff', 'Arial', 'center', '900');
  foreverBadge(g, forever); if (!forever) notYetStamp(g, 120, 96);
  if (gold && forever) { g.save(); g.beginPath(); g.roundRect(12, 6, 216, 216, 14); g.clip(); g.fillStyle = '#ffffff2a'; g.beginPath(); g.moveTo(-10, 150); g.lineTo(110, -10); g.lineTo(150, -10); g.lineTo(-10, 200); g.closePath(); g.fill(); g.restore(); }
  return c; }
// Mech Suit (the wild): a twinned ape sitting in the cockpit of a steel frame with shoulder armour and a safety-yellow roll bar.
function mechTile(item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), forever = item.forever !== false; g.scale(TILE / 240, TILE / 240);
  g.shadowColor = forever ? YEL : '#000'; g.shadowBlur = forever ? 18 : 4;
  round(g, 6, 40, 52, 70, 10, '#5b6070', '#9aa0ad', 4); round(g, 182, 40, 52, 70, 10, '#5b6070', '#9aa0ad', 4); // shoulder pads
  round(g, 22, 8, 196, 212, 16, '#2c2a3c', forever ? YEL : '#7d7a8a', 8); g.shadowBlur = 0;
  g.fillStyle = YEL; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(34 + k * 22, 14); g.lineTo(48 + k * 22, 14); g.lineTo(38 + k * 22, 26); g.lineTo(24 + k * 22, 26); g.closePath(); if (k < 7) g.fill(); }
  round(g, 36, 34, 168, 138, 10, '#0d0a1c', '#aab0ba', 4); artWindow(g, item, forever, 40, 38, 160, 130);
  g.save(); g.globalAlpha = .18; g.fillStyle = '#9fd0ff'; g.beginPath(); g.moveTo(40, 38); g.lineTo(120, 38); g.lineTo(60, 168); g.lineTo(40, 168); g.closePath(); g.fill(); g.restore(); // the cockpit glass
  for (const [x, y] of [[44, 44], [196, 44], [44, 164], [196, 164]]) { g.fillStyle = '#d9dde3'; g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }
  round(g, 36, 182, 168, 32, 7, forever ? YEL : '#3a3948'); text(g, 'WILD · MECH SUIT', 120, 198, 17, forever ? '#15131c' : '#9a98a8', 'Arial', 'center', '900');
  foreverBadge(g, forever, 204, 22); if (!forever) notYetStamp(g, 120, 100);
  return c; }
// Robots, Robot Components and Space Agency NFTs: unforevered by default, so greyed with the stamp until a twin exists.
// Real token numbers show as #123; recovered archive pictures (token id unknown) show their archive label, e.g. A03.
const idLabel = id => /^\d+$/.test(String(id)) ? `#${id}` : String(id);
function nftTile(item, sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], forever = item.forever === true; g.scale(TILE / 240, TILE / 240);
  const edge = forever ? col.color : '#7d7a8a';
  g.shadowColor = forever ? col.color : '#000'; g.shadowBlur = forever ? 14 : 4; round(g, 12, 6, 216, 216, 14, '#0d0a1c'); g.shadowBlur = 0; round(g, 12, 6, 216, 216, 14, null, edge, 6);
  artWindow(g, item, forever, 24, 18, 192, 158);
  round(g, 24, 180, 192, 32, 7, '#0d0a1c'); text(g, `${col.tag} ${idLabel(item.id)}`, 120, 196, 17, '#efeaff', 'Arial', 'center', '900');
  foreverBadge(g, forever); if (!forever) notYetStamp(g, 120, 96);
  return c; }
// The official Megapont logo (the scatter): its own file if bundled, otherwise the name set in type.
function logoTile(img) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  g.shadowColor = ACCENT; g.shadowBlur = 20; g.beginPath(); for (let t = 0; t < 6; t++) { const a = t / 6 * Math.PI * 2 + Math.PI / 6; g.lineTo(120 + Math.cos(a) * 106, 112 + Math.sin(a) * 106); } g.closePath(); g.fillStyle = lin(g, 20, 10, 220, 214, ['#9d7dff', '#7048e8', '#3a2478']); g.fill(); g.shadowBlur = 0; g.lineWidth = 7; g.strokeStyle = '#e8e1ff'; g.stroke();
  if (img) { round(g, 28, 56, 184, 112, 14, '#17181a', '#e8e1ff', 4); g.imageSmoothingEnabled = false; const k = Math.min(160 / img.width, 88 / img.height); g.drawImage(img, 120 - img.width * k / 2, 112 - img.height * k / 2, img.width * k, img.height * k); g.imageSmoothingEnabled = true; }
  else { text(g, 'MEGAPONT', 120, 100, 34, '#ffffff', 'Arial', 'center', '900'); g.fillStyle = YEL; g.fillRect(52, 124, 136, 6); text(g, 'LOGO PENDING', 120, 150, 14, '#e8e1ff', 'Arial', 'center', '800'); }
  return c; }
// The Robot Crate (the pick symbol): a stencilled steel shipping crate. A prop, not an NFT.
function crateTile() {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  g.shadowColor = YEL; g.shadowBlur = 14; round(g, 20, 30, 200, 170, 12, '#3b3850', '#aab0ba', 6); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.roundRect(26, 36, 188, 158, 8); g.clip(); g.fillStyle = YEL; for (let x = -160; x < 260; x += 44) { g.beginPath(); g.moveTo(x, 194); g.lineTo(x + 22, 194); g.lineTo(x + 22 + 158, 36); g.lineTo(x + 158, 36); g.closePath(); g.fill(); } g.fillStyle = '#2c2a3c'; g.fillRect(26, 88, 188, 56); g.restore();
  round(g, 20, 30, 200, 38, 8, '#4a4762', '#aab0ba', 4); round(g, 100, 40, 40, 16, 5, '#15131c');
  text(g, 'ROBOT', 120, 106, 30, YEL, 'Arial', 'center', '900'); text(g, 'CRATE', 120, 134, 26, '#ffffff', 'Arial', 'center', '900');
  for (const [x, y] of [[34, 44], [206, 44], [34, 186], [206, 186]]) { g.fillStyle = '#d9dde3'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  return c; }
// Shown only until art exists: the symbol's name set in type, in its colour. Never a drawing.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  round(g, 12, 6, 216, 216, 14, '#0d0a1c', col.color, 4);
  const words = col.name.toUpperCase().replace(/[()]/g, '').split(' ').filter(w => w.length > 1); words.slice(0, 3).forEach((w, i, a) => text(g, w, 120, 104 - (a.length - 1) * 18 + i * 36, w.length > 9 ? 22 : 30, col.color, 'Arial', 'center', '900'));
  text(g, 'ART PENDING', 120, 196, 13, '#9a98a8'); return c; }

const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { registry: 'bundled list', images: 0, imageFailures: 0, bundled: 0, apesKnown: 0, tiersKnown: false, done: false, robots: 0, components: 0, msa: 0, logo: false };
const logoImages = {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sample = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
let twinMode = 'default'; // the test page's twins switch: default | none | some | all
// Apes are twins (forevered) unless the test switch says otherwise; Robots, Components and Space Agency NFTs have no twin yet.
const foreverFor = (item, k) => twinMode === 'none' ? false : twinMode === 'all' ? true : twinMode === 'some' ? k % 3 === 0 : item.baseForever !== false && !!item.baseForever;
const tileOf = (sym, it) => sym === 'wild' ? mechTile(it) : (COLS[sym].kind === 'ape') ? apeTile(it, sym) : nftTile(it, sym);
function retile(sym) { pools[sym].forEach((it, k) => { it.forever = foreverFor(it, k); it.tile = tileOf(sym, it); }); screenDirty = true; }
const TIER_SYM = { III: 'cherry', II: 'lemon', I: 'chip', G: 'bitcoin' };
function tierOf(id) { const t = ART.tiers && ART.tiers[id]; return t || null; }
// With a rarity map every ape goes into its tier's slot. Without one (the map comes from the fetch script) they are dealt out in the
// 2% / 32.7% / 32.7% / 32.7% proportions and the tile says only "APE #id", never a tier it cannot prove.
const dealSym = i => i % 50 === 0 ? 'bitcoin' : ['cherry', 'lemon', 'chip'][i % 3];
let apeCount = 0;
function pushApe(a, img, bundled) {
  const t = tierOf(a.id), sym = t ? TIER_SYM[t] : dealSym(apeCount++), item = { key: 'megapont-ape-club', id: a.id, xtrataId: a.x, num: `#${a.id}`, img, bundled: !!bundled, baseForever: a.x > 0, collection: 'megapont-ape-club', tier: t, forever: a.x > 0, tile: null };
  item.tile = apeTile(item, sym); pools[sym].push(item);
  if (pools.wild.length < 40 && (apeCount % 3 === 0 || t)) { const w = { ...item, tile: null }; w.tile = mechTile(w); pools.wild.push(w); } }
const twinUrl = xid => `${SRC.origin}/inscription/mainnet/${SRC.core.replace('.', '/')}/${xid}`;
function pushNft(sym, a, img, key) { const item = { key, id: a.id, num: idLabel(a.id), archive: !!a.archive, img, bundled: true, baseForever: false, collection: key, forever: false, tile: null }; item.tile = nftTile(item, sym); pools[sym].push(item); }
function rebuildStatic() {
  pools.scatter = [{ key: 'megapont', id: 'MEGAPONT', num: 'MEGAPONT', img: logoImages.megapont || null, tile: logoTile(logoImages.megapont) }];
  pools.vault = [{ key: 'robot-crate', id: 'CRATE', num: 'ROBOT CRATE', img: null, tile: crateTile() }]; }
async function loadBundled() {
  const batches = []; for (const a of ART.apes || []) batches.push(loadImage(a.src, 8000).then(img => { pushApe(a, img, true); sources.bundled++; }).catch(() => {}));
  await Promise.all(batches);
  for (const [list, sym, key, field] of [[ART.robots, 'artifact', 'megapont-robots', 'robots'], [ART.msa, 'block', 'megapont-space-agency', 'msa'], [ART.components, 'chain', 'megapont-robot-components', 'components']]) {
    await Promise.all((list || []).map(a => loadImage(a.src, 8000).then(img => { pushNft(sym, a, img, key); sources[field]++; }).catch(() => {}))); }
  for (const [k, src] of Object.entries(ART.logos || {})) { try { logoImages[k] = await loadImage(src, 8000); } catch (e) {} }
  sources.logo = !!logoImages.megapont; sources.tiersKnown = !!(ART.tiers && Object.keys(ART.tiers).length);
  rebuildStatic(); screenDirty = true;
}
// Live top-up: the helper contract's newest inscribed twins are read through the Xtrata Hiro proxy, and any twin the bundle does not
// already hold is loaded from the Xtrata inscription endpoint. A failed read leaves what is bundled exactly as it was ("unknown", never "none").
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr); if (t && x) out.push({ id: Number(t[1]), x: Number(x[1]) }); } return out; }
async function loadLive() {
  const have = new Set([...pools.cherry, ...pools.lemon, ...pools.chip, ...pools.bitcoin].map(t => t.id));
  try { const list = parseEvents(await getJSON(`${SRC.origin}/hiro/mainnet/extended/v1/contract/${SRC.helper}/events?limit=50&offset=0`)); sources.registry = 'live'; sources.twinsOnChain = list.length;
    const queue = list.filter(t => !have.has(t.id)); let i = 0;
    const worker = async () => { while (i < queue.length) { const a = queue[i++]; try { const img = await loadImage(twinUrl(a.x)); pushApe(a, img, false); sources.images++; } catch (e) { sources.imageFailures++; } } };
    await Promise.all(Array.from({ length: 4 }, worker)); } catch (e) { sources.registry = 'unavailable'; }
  sources.done = true; screenDirty = true; }
rebuildStatic();

/* ---------- Faces: which inscription a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }

/* ---------- The cabinet screen: a factory control panel. Steel plates, a pressure gauge, hazard stripes and a window for the reels ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const PAPER = '#c9ced6', INK = '#14121f', LEAF = '#b9a6ff', PLATE = '#aeb3bc';
function hazardFill(g, x, y, w, h, size = 14) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = YEL; g.fillRect(x, y, w, h); g.fillStyle = '#15131c'; for (let k = -h; k < w + h; k += size * 2) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + size, y + h); g.lineTo(x + k + size + h, y); g.lineTo(x + k + h, y); g.closePath(); g.fill(); } g.restore(); }
function plate(g, x, y, w, h, r = 12) { round(g, x, y, w, h, r, lin(g, x, y, x, y + h, ['#cfd4dc', '#a3a9b3', '#bcc1ca']), '#15131c', 4); for (const [px, py] of [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]]) { g.fillStyle = '#6d727b'; g.beginPath(); g.arc(px, py, 5, 0, 7); g.fill(); g.fillStyle = '#e8ebf0'; g.beginPath(); g.arc(px - 1, py - 1, 2, 0, 7); g.fill(); } }
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#1d1636', '#130f25', '#1e1738']); g.fillRect(0, 0, 1400, 960);
  for (let k = 0; k < 1300; k++) { const h = hashStr('g' + k); g.fillStyle = (h & 1) ? '#ffffff06' : '#00000018'; g.fillRect(h % 1400, (h >>> 11) % 960, 2, 2); } // brushed grain
  hazardFill(g, 0, 0, 1400, 8); hazardFill(g, 0, 952, 1400, 8);
  for (const x of [20, 1380]) for (const y of [196, 486, 776]) { g.beginPath(); g.arc(x, y, 8, 0, 7); g.fillStyle = '#0a0814'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#8a8fa0'; g.stroke(); } // bolts
  plate(g, 18, 14, 380, 172); plate(g, 1002, 14, 380, 172);
  g.shadowColor = ACCENT; g.shadowBlur = 16; round(g, 412, 14, 576, 172, 12, '#0d0a1c', YEL, 6); g.shadowBlur = 0; hazardFill(g, 424, 22, 552, 7, 10); hazardFill(g, 424, 171, 552, 7, 10);
  text(g, 'PRESSURE', 118, 36, 15, '#3a2478', 'Arial', 'center', '900'); text(g, 'MEGAPONT PRIME', 700, 46, 23, YEL, 'Arial', 'center', '900'); text(g, 'HOLDER POT', 1192, 36, 17, '#3a2478', 'Arial', 'center', '900');
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#0a0814', lin(g, 0, RY - 14, 0, RY + RH + 14, ['#ffd84d', '#d4a30e', '#ffc910', '#8a6a06']), 7);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#120e22', '#251d40', '#120e22']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff12'; g.fillRect(45, 893, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function highlightIndex(now) { return !spinning && !feature() && !scene && lastResult && lastResult.cascade == null && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2, cellY = r => RY + r * RHT + 7;
// The tile shown in the first paying cell of a winning line: its cameo (and, later, its holder's royalty).
function cameoFor(w, grid = state.grid, fc = faces) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = grid[c][line[c]]; if (s === w.symbol || s === 'wild') { const it = itemFor(s, fc[c][line[c]]); if (it) return it; } } return null; }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), cellY(r), 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = YEL; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, YEL, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, YEL, 4); sg.save(); sg.shadowColor = YEL; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#ffc910c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#7048e888'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- The Assembly Line cascade: every win is shipped out, the strip above drops in, and the next win pays the next rung ----------
   The engine's cascade for a landed spin is fixed before anything moves (E.cascadeOf); this only reveals it. */
const LADDER = E.cascade.ladder, STAGES = ['STATION 1', 'STATION 2', 'STATION 3', 'STATION 4'];
let cas = null, plan = null, lastCascade = null, gaugeHold = null;
const debrisCache = new Map();
function debrisFor(i) { let d = debrisCache.get(i); if (!d) { d = Array.from({ length: 8 }, (_, k) => { const h = hashStr(`d${i}:${k}`); return { x: 20 + (h % 136), y: 20 + ((h >>> 8) % 136), s: 6 + (h % 9), vx: ((h >>> 4) % 120) - 60, c: ['#ffc910', '#ffb020', '#aeb3bc', '#7048e8', '#ffffff'][h % 5] }; }); debrisCache.set(i, d); } return d; }
// The faces (which real NFT shows in each cell) follow their cells down the cascade: kept cells keep their picture, new cells pick one.
function planFaces(pl, base) {
  const out = [base.map(c => c.slice())];
  for (let k = 0; k < pl.steps.length - 1; k++) { const st = pl.steps[k], nx = pl.steps[k + 1], gone = new Set(st.removed.map(([c, r]) => c * 3 + r));
    out.push(nx.grid.map((col, c) => { const keep = [0, 1, 2].filter(r => !gone.has(c * 3 + r)).map(r => out[k][c][r]), n = 3 - keep.length; return [...Array.from({ length: n }, (_, i) => pickFace(col[i])), ...keep]; })); }
  return out; }
function drawCascade(now) {
  const st = cas.steps[cas.k], fs = cas.faces[cas.k], t = now - cas.t0, ph = cas.phase, dur = cas.dur[ph];
  const p = Math.min(1, t / dur), gone = new Set(st.removed.map(([c, r]) => c * 3 + r));
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (ph === 'drop') {
      const next = cas.steps[cas.k + 1].grid[c], nf = cas.faces[cas.k + 1][c], keepRows = [0, 1, 2].filter(r => !gone.has(c * 3 + r)), n = 3 - keepRows.length;
      const e = p < .8 ? (p / .8) ** 2 : 1 + Math.sin((p - .8) / .2 * Math.PI) * .05;
      for (let r = 0; r < 3; r++) { const from = r < n ? r - n : keepRows[r - n], y = from + (r - from) * Math.min(e, 1.05); sg.drawImage(tileFor(next[r], nf[r]), cellX(c), RY + y * RHT + 7, 176, 176); }
    } else for (let r = 0; r < 3; r++) {
      const i = c * 3 + r, s = st.grid[c][r];
      if (ph === 'crumble' && gone.has(i)) { const sc = 1 - p; if (sc > .02) { sg.save(); sg.globalAlpha = 1 - p; sg.translate(cellX(c) + 88, cellY(r) + 88); sg.scale(sc, sc); sg.drawImage(tileFor(s, fs[c][r]), -88, -88, 176, 176); sg.restore(); } if (motionOK()) debrisFor(i).forEach(d => { sg.fillStyle = d.c; sg.globalAlpha = 1 - p * .8; sg.fillRect(cellX(c) + d.x + d.vx * p, cellY(r) + d.y + 380 * p * p, d.s, d.s); }); sg.globalAlpha = 1; }
      else sg.drawImage(tileFor(s, fs[c][r]), cellX(c), cellY(r), 176, 176);
    }
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
  }
  if (ph === 'flash') {
    const pulse = .6 + .4 * Math.sin(t / 70);
    gone.forEach(i => { const c = Math.floor(i / 3), r = i % 3; sg.save(); sg.globalAlpha = pulse; sg.shadowColor = YEL; sg.shadowBlur = 24; round(sg, RX + c * CW + 9, RY + r * RHT + 7, CW - 21, RHT - 14, 12, null, YEL, 5); sg.restore(); });
    st.wins.forEach(w => { const line = E.lines[w.line]; sg.save(); sg.globalAlpha = .55; sg.lineWidth = 4; sg.strokeStyle = '#ffe48a'; sg.beginPath(); for (let x = 0; x < w.count; x++) { const X = RX + (x + .5) * CW, Y = RY + (line[x] + .5) * RHT; x ? sg.lineTo(X, Y) : sg.moveTo(X, Y); } sg.stroke(); sg.restore(); });
    sg.save(); sg.globalAlpha = Math.min(1, t / 150); round(sg, 700 - 230, RY + RH / 2 - 52, 460, 104, 18, '#0d0a1cdd', YEL, 3); text(sg, `+${fmt(st.pay)}`, 700, RY + RH / 2 - 10, 52, '#fff0b8', 'Arial', 'center', '900'); text(sg, `${STAGES[Math.min(cas.k, 3)]} · ${st.multiplier}×`, 700, RY + RH / 2 + 32, 18, '#e8dcff'); sg.restore();
  }
}
// The pressure gauge in the top-left plate: the needle climbs one rung per cascade step (1×, 2×, 3×, 5×).
function gaugeK(now) { if (cas) return Math.min(cas.k + (cas.phase === 'drop' ? Math.min(1, (now - cas.t0) / cas.dur.drop) : 0), 3); if (gaugeHold && now < gaugeHold.until) return gaugeHold.k; return 0; }
function drawGauge(now) {
  const k = gaugeK(now), cx = 112, cy = 108, R = 64, a0 = Math.PI * .8, span = Math.PI * 1.4, ang = a0 + span * Math.min(1, k / 3) + (motionOK() && !cas ? Math.sin(now / 700) * .015 : 0);
  sg.save(); sg.fillStyle = '#f4efe0'; sg.beginPath(); sg.arc(cx, cy, R, 0, 7); sg.fill(); sg.lineWidth = 6; sg.strokeStyle = '#15131c'; sg.stroke();
  for (let i = 0; i <= 12; i++) { const a = a0 + span * i / 12, r2 = i % 4 === 0 ? R - 18 : R - 11; sg.strokeStyle = i > 9 ? '#e03131' : '#15131c'; sg.lineWidth = i % 4 === 0 ? 4 : 2; sg.beginPath(); sg.moveTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); sg.lineTo(cx + Math.cos(a) * (R - 5), cy + Math.sin(a) * (R - 5)); sg.stroke(); }
  LADDER.forEach((m, i) => { const a = a0 + span * (i / 3); text(sg, `${m}×`, cx + Math.cos(a) * (R - 31), cy + Math.sin(a) * (R - 31), 12, '#15131c', 'Arial', 'center', '900'); });
  sg.strokeStyle = '#e03131'; sg.lineWidth = 4; sg.lineCap = 'round'; sg.beginPath(); sg.moveTo(cx, cy); sg.lineTo(cx + Math.cos(ang) * (R - 14), cy + Math.sin(ang) * (R - 14)); sg.stroke(); sg.fillStyle = '#15131c'; sg.beginPath(); sg.arc(cx, cy, 6, 0, 7); sg.fill(); sg.restore();
  // The four rungs as lamps beside the dial.
  const rung = Math.floor(k + .001);
  LADDER.forEach((m, i) => { const x = 208 + i * 46, on = cas || (gaugeHold && now < gaugeHold.until) ? i <= rung : false; round(sg, x, 80, 40, 44, 7, on ? lin(sg, x, 80, x, 124, ['#ffe48a', '#ffc910']) : '#2a2540', '#15131c', 3); text(sg, `${m}×`, x + 20, 103, 20, on ? '#15131c' : '#6d6a85', 'Arial', 'center', '900'); });
  text(sg, cas ? `${STAGES[Math.min(cas.k, 3)]}` : 'ASSEMBLY LINE', 298, 150, 15, '#2a1f5a', 'Arial', 'center', '900'); }
// A conveyor along the top and bottom of the reel window. It runs slowly at rest, faster while spinning and flat out in Overdrive.
function drawBelts(now) {
  const sp = state.freeActive ? 3.2 : spinning ? 1.5 : .45, off = motionOK() ? (now / 1000 * 60 * sp) % 64 : 0, tc = ['#8b5cf6', '#4c9bff', '#ff5a5f', '#f2c14e'];
  for (const y of [RY - 22, RY + RH + 8]) { sg.save(); sg.beginPath(); sg.rect(RX - 14, y, RW + 28, 14); sg.clip(); sg.fillStyle = '#0a0814'; sg.fillRect(RX - 14, y, RW + 28, 14);
    sg.fillStyle = '#2c2848'; for (let x = -64 + off; x < RW + 64; x += 16) sg.fillRect(RX - 14 + x, y + 2, 5, 10);
    for (let x = -64 + off; x < RW + 64; x += 64) { const k = Math.floor((x - off) / 64); sg.fillStyle = tc[((k % 4) + 4) % 4]; sg.beginPath(); sg.arc(RX - 14 + x + 28, y + 7, 5, 0, 7); sg.fill(); }
    sg.restore(); } }
// Overdrive: amber beacons sweep the screen corners and the reel window glows.
function drawOverdriveLights(now) {
  if (!state.freeActive) return; sg.save(); sg.fillStyle = 'rgba(255,176,32,.07)'; sg.fillRect(RX, RY, RW, RH);
  const a = motionOK() ? now / 380 : 0; for (const [x, y] of [[26, 205], [1374, 205], [26, 778], [1374, 778]]) { sg.save(); sg.translate(x, y); const g = sg.createRadialGradient(0, 0, 2, 0, 0, 56); g.addColorStop(0, '#ffb020ee'); g.addColorStop(1, '#ffb02000'); sg.fillStyle = g; sg.beginPath(); sg.arc(0, 0, 56, 0, 7); sg.fill(); sg.rotate(a); sg.fillStyle = '#ffd36a55'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 90, -.25, .25); sg.closePath(); sg.fill(); sg.restore(); }
  sg.restore(); }
// The last 21 rounds as a row of bolt heads: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 14, gap = 5, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 870;
  text(sg, 'LAST 21 ROUNDS', x0 - 20, y + s / 2, 12, '#8a7ac8', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)]; round(sg, x0 + i * (s + gap), y + 0, s * .72, s, 2, e ? (e.win > 0 ? YEL : '#3a3356') : '#1b1630', i === n - 1 && e ? CREAM : null, 1.5); } }


/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: 'OVERDRIVE', vault: 'ROBOT CRATES', chain: 'FULL BUILD', jackpot: 'MEGAPONT PRIME', gamble: 'RED WIRE OR BLUE WIRE' };
const RULES = { free: 'Eight free spins with the factory floor in Overdrive: the lights go amber, the conveyors race, and every win pays 2×. More Megapont logos add four.', vault: 'Nine stencilled crates slide in. Open three: each holds a Megapont Robot and a prize.', chain: 'Robot Components bolt into the 15 bays of a robot. Any new part resets your three respins. Fill every bay for Megapont Prime.', jackpot: 'The rarest ape on the line. Five gold-frame Megapont Apes on the centre row won the Prime jackpot.', gamble: '' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
const PARTS = ['HEAD', 'VISOR', 'ANTENNA', 'TORSO', 'POWER CORE', 'LEFT ARM', 'RIGHT ARM', 'LEFT HAND', 'RIGHT HAND', 'HIPS', 'LEFT LEG', 'RIGHT LEG', 'LEFT FOOT', 'RIGHT FOOT', 'BACKPACK'];
const crateClass = m => m >= 15 ? 'PRIME BOT' : m >= 10 ? 'HEAVY BOT' : m >= 8 ? 'GUARD BOT' : m >= 3 ? 'WORKER BOT' : 'SCOUT BOT';
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
let sceneQueue = [], hits = [], airdrop = null;
// Which real Robot a crate shows, and which Robot Component a bay holds: cosmetic, picked from the round id after the result is fixed.
const revealCache = new Map();
function revealCard(prize, roundId, k) { const seed = hashStr(`${roundId}:${k}:${prize}`), pool = pools.artifact, key = `${roundId}:${k}`; let t = revealCache.get(key);
  if (!t) { const it = pool.length ? pool[seed % pool.length] : null; t = { tile: it ? it.tile : names.artifact, name: it ? `ROBOT ${idLabel(it.id)}` : 'MEGAPONT ROBOT' }; revealCache.set(key, t); } return t; }
const partCache = new Map();
function componentCard(f, i, v) { const seed = hashStr(`${f.roundId || 'build'}:part:${i}`), pool = pools.chain, key = `${f.roundId || 'build'}:${i}:${v}`; let t = partCache.get(key);
  if (!t) { const it = pool.length ? pool[seed % pool.length] : null; t = { tile: it ? it.tile : names.chain, name: it ? `COMPONENT ${idLabel(it.id)}` : 'ROBOT COMPONENT' }; partCache.set(key, t); } return t; }
const goldApe = () => (pools.bitcoin[0] && pools.bitcoin[0].tile) || names.bitcoin;
// Chiptune voices for the scenes, built from the same noise and oscillator helpers as the reels, now with hydraulic hiss, clank and a rising whine.
const hiss = (d = .25, v = .12, at = 0) => noise(d, 5200, .6, v, at);
const clank = (at = 0, v = .3, f = 520) => { noise(.05, 1800, 3, v, at); tone(f, .14, 'square', .06, at, .55); tone(f * 1.51, .1, 'triangle', .05, at, .6); };
const whine = (f0, f1, d = .6, v = .05, at = 0) => tone(f0, d, 'sawtooth', v, at, f1 / f0);
const siren = (at = 0) => { for (let k = 0; k < 4; k++) { tone(660, .2, 'square', .045, at + k * .4, 1.25); tone(880, .2, 'square', .04, at + k * .4 + .2, .8); } };
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { hiss(.5, .12); whine(180, 900, .9, .05, .05); arp([392, 523.25, 659.25, 783.99, 1046.5], .08, .16, .06, 'square', .35); clank(.35); coins(8, .45); }
  if (kind === 'sting-vault') { clank(0); clank(.18, .25, 420); hiss(.3, .14, .2); arp([196, 261.63, 329.63, 392, 523.25], .09, .22, .05, 'square', .25); }
  if (kind === 'sting-chain') { clank(0); clank(.2); clank(.4, .3, 640); whine(120, 520, .6, .04, .5); }
  if (kind === 'sting-jackpot') { siren(0); arp([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5], .09, .5, .07, 'square', .3); arp([130.8, 164.8, 196, 261.6], .18, .9, .06, 'triangle', .3); coins(40, .5); }
  if (kind === 'sting-gamble') { hiss(.25, .12); bleep(988, .3, .06, .1, 'triangle'); clank(.2, .2, 780); }
  if (kind === 'whoosh') { hiss(.35, .14); whine(200, 640, .4, .04); }
  if (kind === 'crack') { sound('flip'); clank(.02, .25, 600 + i * 40); bleep(700 + i * 50, .3, .07, .06, 'triangle'); } // a crate lid breaking its seal
  if (kind === 'reveal-big') { arp([784, 988, 1175, 1568], .06, .35, .07, 'square'); coins(14, .1); siren(.1); }
  if (kind === 'stamp') { clank(0, .4, 360); hiss(.1, .1); bleep(110, .2, .25, 0, 'triangle'); } // a part bolting on
  if (kind === 'reset') { bleep(1318.5, .15, .06); bleep(1760, .2, .05, .08); }
  if (kind === 'tick') bleep(1600 + (i % 6) * 60, .03, .025, 0, 'square');
  if (kind === 'roll') noise(.03, 3600, 5, .1);
  if (kind === 'land') { clank(0, .3, 480); bleep(660, .16, .08, 0, 'triangle'); }
  if (kind === 'summary') arp([659.25, 783.99, 1046.5], .08, .3, .06, 'square');
  if (kind === 'miss') { noise(.07, 900, 2, .22); bleep(180 - i * 6, .18, .08, 0, 'triangle'); } // a bay comes up empty: a soft thud
  if (kind === 'beat') { bleep(82, .12, .16, 0, 'triangle'); bleep(70, .12, .12, .13, 'triangle'); } // the held bay: a heartbeat
  if (kind === 'charge') { whine(240 + i * 100, 700 + i * 300, .3 + .12 * i, .04); hiss(.3 + .12 * i, .06); } // a crate building up before it opens
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
  if (state.free > 0) { status(`${state.free} OVERDRIVE SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
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
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else toast('Open three crates.'); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'OVERDRIVE' : broke ? 'GET LAYR' : 'PRESS'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'CLAIM' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `OPEN ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return chainBusy() ? 'RESPINNING…' : f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'REVEALING'; }
  return 'CONTINUE';
}
const canSkip = () => !!cas || (!scene && state.freeActive && !spinning) || !!scene && scene.stage !== 'outro' && !(scene.kind === 'gamble' && scene.stage === 'play' && !scene.data.result);
// Skip: resolve everything the engine already dealt, instantly, and land on the outro with the same total.
function skipScene() {
  if (cas) { cas = null; finishSpin(); return; } // the cascade is already fixed; jump to its end
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
    const p = E.start(state, lab.on ? labRng() : undefined); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordCameos(r, { grid: p.grid, faces });
    if (r.triggers.free) airdrop.retriggers++; airdrop.best = Math.max(airdrop.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; refaceIdle(); save();
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
  if (!RS) return `FULL BUILD · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`;
  if (now < RS.lastLand) return RS.before === 1 ? 'FINAL RESPIN · HOLD ON…' : `RESPIN ${RS.n} · ROLLING…`;
  if (RS.fill) return 'ROBOT COMPLETE · MEGAPONT PRIME!';
  if (RS.added.size) return `+${RS.added.size} NEW PART${RS.added.size > 1 ? 'S' : ''}${RS.before < 3 ? ' · RESPINS RESET TO 3' : ''}`;
  return E.featureDone(f) ? 'NO NEW PART · BUILD CLOSED' : `NO NEW PART · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`; }
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { if (chainBusy()) return; const prev = f.frames[f.index], before = prev.left, prevCells = prev.cells.slice(); const fr = E.respin(state); save(); chainFlash = performance.now(); startRespin(f, prevCells, before, fr); renderBar(); update(); }
  else toast('Open three crates first.'); }
const vaultCharge = m => motionOK() ? (m >= 8 ? 650 : 280) * speed() : 0; // a pack card builds up before it turns; the big ones hold longer
function pickVault(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); const ch = vaultCharge(r.multiple); sfx('crack', i); if (ch) sfx('charge', r.multiple >= 8 ? 1 : 0); if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), ch + 520 * speed()); else setTimeout(() => sound('pick', i), ch + 450 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
function callGamble(choice) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, choice, lab.on ? labGambleRng(choice) : undefined); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, choice }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble }); }

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x + w, y + h, ['#ffe48a', '#ffc910', '#d49a00']) : '#1b1630', primary ? '#15131c' : '#7048e8', 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#15131c' : '#efeaff', 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
// On the full-width crate and bay grids the chip sits just under the screen so it never covers a tile.
function skipChip() { if (!canSkip()) return; const low = scene && scene.stage === 'play' && (scene.kind === 'vault' || scene.kind === 'chain'); button('SKIP ›', RX + RW - 150, low ? RY + RH + 8 : RY + 14, 136, low ? 48 : 50, skipScene, false); }
const cameoLabel = it => !it ? '' : it.collection === 'megapont-ape-club' ? `APE #${it.id}${it.tier ? ` · TIER ${it.tier}` : ''}` : it.collection === 'megapont-space-agency' ? `SPACE AGENCY ${idLabel(it.id)}` : it.collection === 'megapont-robots' ? `ROBOT ${idLabel(it.id)}` : it.collection === 'megapont-robot-components' ? `COMPONENT ${idLabel(it.id)}` : it.key === 'megapont' ? 'MEGAPONT' : String(it.id);
function drawInfinityLoopSafe() {}
// A closed crate, seen from the front: the crate tile with a stencilled number.
function drawCrate(x, y, w, h, label, glow, lift = 0) { sg.save(); if (glow) { sg.shadowColor = glow; sg.shadowBlur = 24; } const s = Math.min(w, h); sg.drawImage(pools.vault[0].tile, x + (w - s) / 2, y - lift + (h - s) / 2, s, s); sg.restore(); if (label) text(sg, label, x + w / 2, y - lift + h - 10, 18, '#ffffff', 'Arial', 'center', '900'); }
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#140a02', '#3a2305', '#5a3608']); g.fillRect(RX, RY, RW, RH); if (motionOK()) for (let k = 0; k < 22; k++) { const sp = 260 + (hashStr('i' + k) % 220), x = ((now / 1000 * sp + (hashStr('ix' + k) % 1500)) % (RW + 300)) + RX - 150, y = RY + (hashStr('iy' + k) % RH); g.globalAlpha = .28 * dim; g.fillStyle = '#ffc910'; g.fillRect(x, y, 90, 4); } }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0e0b1c', '#1f1838', '#0b0916']); g.fillRect(RX, RY, RW, RH); g.globalAlpha = .1 * dim; for (let k = 0; k < 9; k++) { const [x, y, w, h] = capsuleRect(k); round(g, x + w / 2 - 60, y + 10, 120, h - 20, 12, YEL); } }
  if (kind === 'chain') { g.fillStyle = '#0a0d24'; g.fillRect(RX, RY, RW, RH); g.globalAlpha = .22 * dim; g.strokeStyle = '#7fa8ff'; g.lineWidth = 1; for (let x = RX; x < RX + RW; x += 40) { g.beginPath(); g.moveTo(x, RY); g.lineTo(x, RY + RH); g.stroke(); } for (let y = RY; y < RY + RH; y += 40) { g.beginPath(); g.moveTo(RX, y); g.lineTo(RX + RW, y); g.stroke(); } g.globalAlpha = .35 * dim; g.strokeStyle = '#7fa8ff'; g.lineWidth = 2; g.setLineDash([10, 8]); g.beginPath(); g.arc(RX + RW / 2, RY + RH / 2, 220, 0, 7); g.stroke(); g.setLineDash([]); }
  if (kind === 'jackpot') { g.fillStyle = '#0a0716'; g.fillRect(0, 0, 1400, 960); const a = motionOK() ? now / 2400 : 0; g.translate(700, 480); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.globalAlpha = .14 * dim; g.fillStyle = k % 2 ? '#7048e8' : GOLD; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1200, a, a + Math.PI / 18); g.closePath(); g.fill(); } }
  if (kind === 'gamble') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0e0b1c', '#241a44']); g.fillRect(RX, RY, RW, RH); }
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.2) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 60 + (1 - k) * -140;
  sg.fillStyle = '#0d0a1cdc'; sg.fillRect(RX, y - 78, RW, 156); hazardFill(sg, RX, y - 84, RW, 8, 12); hazardFill(sg, RX, y + 76, RW, 8, 12);
  sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, title, 700, y - 12, title.length > 16 ? 62 : 76, '#ffffff', 'Arial', 'center', '900'); sg.shadowBlur = 0; text(sg, sub, 700, y + 46, 22, '#ffe48a', 'Arial', 'center', '800'); sg.restore(); }
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(0,0,0,${Math.min(.62, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : YEL; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore(); });
  if (kind === 'gamble') { const k = ease(t * 2); drawJunction(700, RY + RH / 2 - 10, k, now, null); }
  if (kind === 'jackpot' && !cells.length) { const k = ease(t * 2); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; sg.drawImage(goldApe(), 700 - 120 * k, RY + RH / 2 - 120 * k, 240 * k, 240 * k); sg.restore(); }
  const sub = kind === 'jackpot' ? (cells.length ? 'FIVE GOLD-FRAME APES ON THE CENTRE ROW' : 'THE ROBOT IS COMPLETE · ALL 15 BAYS') : kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR RIDES ON ONE WIRE` : `${cells.length} ${kind === 'free' ? 'MEGAPONT LOGOS' : kind === 'vault' ? 'ROBOT CRATES' : 'ROBOT COMPONENTS'}`;
  if (t > .5) titleCard(TITLES[kind], sub, now, (t - .5) * 1.4);
  if (t >= 1) setStage('intro'); }
function wrapText(s, x, y, maxW, lh, color, size) { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); }
// The junction box of Red Wire or Blue Wire: a steel box, a lamp, and two wires. `live` is 'odd' (red) or 'even' (blue) once the result is shown.
function drawJunction(cx, cy, k, now, live, called, cutT = 0) {
  sg.save(); sg.translate(cx, cy); sg.scale(Math.max(.05, k), Math.max(.05, k));
  round(sg, -150, -110, 300, 150, 16, lin(sg, 0, -110, 0, 40, ['#4a4762', '#2c2a3c']), '#aab0ba', 4); for (const [x, y] of [[-134, -94], [134, -94], [-134, 24], [134, 24]]) { sg.fillStyle = '#d9dde3'; sg.beginPath(); sg.arc(x, y, 5, 0, 7); sg.fill(); }
  text(sg, 'JUNCTION 6', 0, -86, 17, '#aab0ba', 'Arial', 'center', '900'); const lampOn = live != null;
  sg.beginPath(); sg.arc(0, -40, 22, 0, 7); sg.fillStyle = !lampOn ? '#3a3356' : '#3fd16b'; if (lampOn) { sg.shadowColor = '#3fd16b'; sg.shadowBlur = 24; } sg.fill(); sg.shadowBlur = 0;
  for (const [i, col, x] of [[0, '#ff5a5f', -70], [1, '#4c9bff', 70]]) { const isLive = lampOn && ((i === 0) === (live === 'odd')), cut = called != null && (i === 0) === (called === 'odd') && cutT > 0;
    sg.strokeStyle = col; sg.lineWidth = 9; sg.lineCap = 'round'; sg.beginPath(); sg.moveTo(x, 40); sg.bezierCurveTo(x * 1.9, 120, x * 1.2 + (i ? 40 : -40), 150 + Math.sin(now / 400 + i) * 3, x * 1.4, 230); if (cut) { sg.setLineDash([60, 40 * cutT]); } sg.stroke(); sg.setLineDash([]);
    if (isLive) { sg.save(); sg.shadowColor = col; sg.shadowBlur = 26; sg.strokeStyle = '#ffffffcc'; sg.lineWidth = 3; sg.stroke(); sg.restore(); }
    text(sg, i ? 'BLUE' : 'RED', x * 1.4, 252, 20, col, 'Arial', 'center', '900'); }
  sg.restore(); }
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (600 * speed()), a = Math.min(1, t);
  backdrop(kind, now); sg.save(); sg.globalAlpha = a; const yIn = motionOK() ? (1 - ease(t)) * 40 : 0;
  if (kind === 'free' && pools.scatter[0]) { sg.shadowColor = YEL; sg.shadowBlur = 40; sg.drawImage(pools.scatter[0].tile, 330 - 120, RY + 120 + yIn, 240, 240); sg.shadowBlur = 0; }
  if (kind === 'vault') { sg.save(); sg.translate(330, RY + 250 + yIn); sg.rotate(motionOK() ? Math.sin(now / 500) * .05 : 0); sg.shadowColor = YEL; sg.shadowBlur = 30; sg.drawImage(pools.vault[0].tile, -125, -125, 250, 250); sg.restore(); }
  if (kind === 'chain') { sg.drawImage(componentCard({ roundId: 'intro' }, 0, 0).tile, 215, RY + 115 + yIn, 230, 230); }
  if (kind === 'jackpot') { sg.shadowColor = GOLD; sg.shadowBlur = 50; sg.drawImage(goldApe(), 190, RY + 100 + yIn, 280, 280); sg.shadowBlur = 0; }
  if (kind === 'gamble') { sg.save(); sg.translate(0, yIn); drawJunction(330, RY + 170, .8, now, null); sg.restore(); }
  sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, TITLES[kind], 890, RY + 150 + yIn, kind === 'gamble' ? 46 : 62, '#ffffff', 'Arial', 'center', '900'); sg.shadowBlur = 0;
  const rule = kind === 'gamble' ? `One wire is live. Call RED or BLUE. Right doubles your ${fmt(scene.data.stake)} LAYR win; wrong loses it.` : RULES[kind];
  wrapText(rule, 890, RY + 232 + yIn, 640, 30, '#efeaff', 26);
  sg.restore();
  if (kind === 'gamble') { button('RED WIRE', 600, RY + 380, 180, 84, () => callGamble('odd')); button('BLUE WIRE', 800, RY + 380, 180, 84, () => callGamble('even')); button('KEEP WIN', 1000, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'CLAIM' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }
function drawVaultPlay(f, now) {
  backdrop('vault', now, .6); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, doneDelay = 900 * speed() + (done ? Math.max(...f.picks.map(i => vaultCharge(f.awards[i]))) : 0);
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], cs = h - 16, rv = revealCard(m, f.roundId || 'crates', i);
    const infoX = x + cs + 28 + (w - cs - 28) / 2, big = m >= 8;
    if (picked) { const ch = vaultCharge(m), el = at ? now - at : 1e9;
      if (el < ch) { const k = el / ch, jit = Math.sin(el / 22) * (1.5 + 5 * k); sg.save(); sg.shadowColor = big ? GOLD : YEL; sg.shadowBlur = (big ? 30 : 14) + 26 * k; round(sg, x, y, w, h, 14, '#17122c', big ? GOLD : YEL, 3 + 2 * k); sg.restore(); drawCrate(x + 12 + jit, y + 8, cs, cs, '', big ? GOLD : YEL); text(sg, big ? 'HEAVY LIFT…' : 'UNSEALING…', infoX, y + h / 2, 17, big ? '#fff1b8' : CREAM, 'Arial', 'center', '900'); continue; }
      const t = at ? (el - ch) / (700 * speed()) : 9;
      if (t < .45 && motionOK()) { const u = t / .45; sg.save(); sg.globalAlpha = 1 - u * .5; drawCrate(x + 12, y + 8 - u * 26, cs, cs, '', '#fff1b8'); sg.restore(); sg.save(); sg.globalAlpha = (1 - u) * .8; sg.fillStyle = '#fff1b8'; sg.fillRect(x + 12, y + 8, cs, cs); sg.restore(); round(sg, x, y, w, h, 14, null, '#7048e8', 2); continue; }
      const k = motionOK() ? ease((t - .45) / .55) : 1; sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); }
      round(sg, x, y, w, h, 14, big ? '#2a2308' : '#17122c', big ? GOLD : YEL, big ? 6 : 4); sg.restore();
      const sw = Math.max(.05, k); sg.save(); sg.translate(x + 12 + cs / 2, y + 8 + cs / 2); sg.scale(sw, sw); sg.drawImage(rv.tile, -cs / 2, -cs / 2, cs, cs); sg.restore();
      const shown = Math.round(m * Math.min(1, k * 1.2)); text(sg, crateClass(m), infoX, y + h / 2 - 40, 20, big ? '#fff1b8' : '#e8dcff'); text(sg, `${Math.max(1, shown)}×`, infoX, y + h / 2 - 2, 46, '#ffffff', 'Arial'); text(sg, `${fmt(Math.max(1, shown) * f.bet)} LAYR`, infoX, y + h / 2 + 40, 18, YEL); text(sg, rv.name, infoX, y + h / 2 + 62, 13, '#b9a6ff', 'Arial', 'center', '700'); }
    else if (done && now - doneAt > doneDelay) { round(sg, x, y, w, h, 14, '#100c20', '#2c2548', 2); text(sg, crateClass(m), infoX, y + h / 2 - 16, 16, '#5d5486'); text(sg, `${m}×`, infoX, y + h / 2 + 14, 30, '#5d5486'); sg.save(); sg.globalAlpha = .4; drawCrate(x + 12, y + 8, cs, cs, ''); sg.restore(); }
    else { const hover = motionOK() ? Math.sin(now / 400 + i) * 3 : 0; round(sg, x, y + hover, w, h, 14, '#17122c', '#4a3d82', 2); drawCrate(x + 12, y + 8 + hover, cs, cs, `CRATE ${i + 1}`); text(sg, 'SEALED', infoX, y + h / 2 - 18 + hover, 22, CREAM); text(sg, 'TAP TO OPEN', infoX, y + h / 2 + 16 + hover, 15, '#8a7ac8', 'Arial', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickVault(i) }); } }
  if (done && now - doneAt > doneDelay) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }
// One rolling bay: a strip of Robot Components drops through the bay, easing to rest on the part it lands (or an empty bay for a miss).
function drawRollPocket(f, i, x, y, w, h, now, S, tile) {
  const p = Math.min(1, (now - S.t0) / Math.max(1, S.landAt[i] - S.t0)), N = 7, th = h - 16, stride = th + 14, rem = (1 - ease(p)) * N, cx = x + w / 2, cy = y + h / 2, blur = Math.min(1, (1 - p) * 1.5);
  if (!scene.pool) scene.pool = Array.from({ length: 8 }, (_, k) => componentCard({ roundId: 'roll' }, 100 + k * 13, 1 + (k % 5)).tile);
  sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 14); sg.clip(); sg.fillStyle = '#080614'; sg.fillRect(x, y, w, h);
  for (let k = -1; k <= N + 1; k++) { const yy = cy - (rem - k) * stride; if (Math.abs(yy - cy) > h / 2 + th / 2) continue; sg.globalAlpha = 1 - .4 * blur;
    if (k === 0 && !tile) { round(sg, cx - th * .4, yy - th / 2, th * .8, th, 10, '#14102a', '#4a3d82', 3); text(sg, 'EMPTY', cx, yy, 15, '#5d5486', 'Arial', 'center', '900'); } else sg.drawImage(k === 0 ? tile : scene.pool[(k * 3 + i + 8) % 8], cx - th / 2, yy - th / 2, th, th); }
  sg.globalAlpha = 1; if (blur > .25) { sg.fillStyle = `rgba(185,166,255,${.07 * blur})`; for (let b = 0; b < 7; b++) sg.fillRect(x + 12 + b * (w - 24) / 7, y, 3, h); }
  const g = sg.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(8,6,20,.75)'); g.addColorStop(.28, 'rgba(8,6,20,0)'); g.addColorStop(.72, 'rgba(8,6,20,0)'); g.addColorStop(1, 'rgba(8,6,20,.75)'); sg.fillStyle = g; sg.fillRect(x, y, w, h);
  sg.restore();
  const hold = S.tense && now > S.t0 + 700 * speed() && p < 1, pulse = hold ? .55 + .45 * Math.sin(now / 90) : 0;
  sg.save(); if (hold) { sg.shadowColor = YEL; sg.shadowBlur = 24 * pulse; } round(sg, x, y, w, h, 14, null, hold ? YEL : '#7048e8', hold ? 4 : 3); sg.restore(); }
function drawGrabPlay(f, now) {
  backdrop('chain', now, .35); const fr = f.frames[f.index], S = scene.spin, mo = motionOK();
  const landed = i => !(S && S.landAt[i] !== undefined && now < S.landAt[i]), tot = fr.cells.reduce((a, v, i) => a + (landed(i) ? v : 0), 0);
  if (S && now < S.lastLand && mo && Math.floor(now / 80) !== Math.floor((now - 17) / 80)) sfx('roll');
  fr.cells.forEach((v, i) => { const x0 = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, at = scene.stampAt[i];
    if (!landed(i)) { drawRollPocket(f, i, x0, y, w, h, now, S, v ? componentCard(f, i, v).tile : null); return; }
    const miss = !v && S && S.landAt[i] !== undefined ? (now - S.landAt[i]) / (520 * speed()) : 9, x = x0 + (mo && miss < 1 ? Math.sin(miss * 38) * 5 * (1 - miss) : 0);
    if (v) { const t = at ? (now - at) / (320 * speed()) : 9; const s = mo ? 1 + .7 * (1 - ease(t)) : 1; sg.save(); sg.globalAlpha = Math.min(1, .35 + t * 3); if (t < 1.5) { sg.shadowColor = YEL; sg.shadowBlur = 40 * (1.5 - Math.min(1.5, t)); } const hh = h * s; sg.drawImage(componentCard(f, i, v).tile, x + (w - hh) / 2, y + (h - hh) / 2, hh, hh); sg.restore();
      for (const [bx, by] of [[x + 10, y + 10], [x + w - 10, y + 10], [x + 10, y + h - 10], [x + w - 10, y + h - 10]]) { sg.fillStyle = '#d9dde3'; sg.beginPath(); sg.arc(bx, by, 4, 0, 7); sg.fill(); }
      text(sg, PARTS[i], x + w / 2, y + 17, 11, '#ffe48a', 'Arial', 'center', '900');
      if (mo && at && t >= 0 && t < 1.6) { const k = t / 1.6; sg.save(); sg.globalAlpha = (1 - k) * .9; sg.strokeStyle = '#fff1b8'; sg.lineWidth = 6 * (1 - k) + 1; sg.beginPath(); sg.roundRect(x - k * 26, y - k * 26, w + k * 52, h + k * 52, 14 + k * 20); sg.stroke(); sg.restore(); }
      if (t > .6) { round(sg, x + w - 78, y + h - 34, 74, 30, 8, '#0d0a1cd8', YEL, 2); text(sg, `${v}× ${fmt(v * f.bet)}`, x + w - 41, y + h - 19, 14, '#fff1b8', 'Arial', 'center', '900'); } }
    else { round(sg, x, y, w, h, 14, '#0e0b1cf6', miss < 1 ? `rgba(224,150,70,${1 - miss})` : '#3a3356', miss < 1 ? 4 : 2); sg.save(); sg.setLineDash([6, 6]); round(sg, x + 10, y + 10, w - 20, h - 20, 10, null, '#7048e877', 2); sg.restore();
      if (miss < 1) { text(sg, 'NO PART', x + w / 2, y + h / 2 - 10, 18, `rgba(240,170,90,${1 - miss})`, 'Arial', 'center', '900'); text(sg, PARTS[i], x + w / 2, y + h / 2 + 12, 13, '#5d5486'); }
      else { text(sg, 'EMPTY BAY', x + w / 2, y + h / 2 - 10, 15, '#6d6495', 'Arial', 'center', '900'); text(sg, PARTS[i], x + w / 2, y + h / 2 + 12, 13, '#5d5486'); } } });
  if (S && mo && now - S.t0 < 520 * speed()) { const k = (now - S.t0) / (520 * speed()); sg.save(); sg.globalAlpha = Math.sin(Math.min(1, k) * Math.PI) * .9; round(sg, 470, RY + RH / 2 - 44, 460, 88, 18, '#0d0a1cf0', YEL, 4); text(sg, S.before === 1 ? 'FINAL RESPIN' : `RESPIN ${S.n}`, 700, RY + RH / 2 + 1, 46, '#fff1b8', 'Arial', 'center', '900'); sg.restore(); }
  if (S && S.fill && mo && now > S.lastLand && now - S.lastLand < 700) { sg.save(); sg.globalAlpha = (1 - (now - S.lastLand) / 700) * .5; sg.fillStyle = '#fff1b8'; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  // Respins left: three lamps. The one just spent goes out as the bays roll; a new part refills them one by one.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0, by = RY + RH + 8; sg.save(); round(sg, RX + 14, by, 290, 48, 12, '#0d0a1ce6', rs ? CREAM : '#4a3d82', rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, by + 25, 20, CREAM, 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const spent = S && now < S.end && !(S.added.size && now >= S.firstHit) ? S.before - 1 : fr.left, refill = S && S.added.size && now >= S.firstHit && k >= S.before - 1 ? now >= S.firstHit + (k - (S.before - 1) + 1) * 130 * speed() : true;
    const on = k < (S && S.added.size && now >= S.firstHit ? fr.left : spent) && refill, used = S && now < S.lastLand && k === S.before - 1 && !(S.added.size && now >= S.firstHit);
    sg.beginPath(); sg.arc(RX + 170 + k * 44, by + 24, 14, 0, 7); sg.fillStyle = on ? (rs ? '#fff1b8' : YEL) : used ? (Math.floor(now / 110) % 2 ? '#e0964a' : '#4a2c12') : '#27213f'; if (on && rs) { sg.shadowColor = YEL; sg.shadowBlur = 20; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 440, by, 280, 48, 12, '#0d0a1ce6', '#4a3d82', 2); text(sg, `BUILT ${fmt(tot * f.bet)} LAYR`, RX + RW - 300, by + 25, 21, CREAM, 'Arial', 'center', '900');
  const busy = chainBusy();
  if (E.featureDone(f) && !busy && now - chainFlash > 700) button('COLLECT', 570, RY + RH / 2 - 37, 260, 74, collectScene);
  else if (!E.featureDone(f) && !busy) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }
function drawJackpotPlay(now) { backdrop('jackpot', now); const t = Math.min(1, (now - scene.t0) / (4200 * speed())), amt = scene.data.amount * ease(t);
  // Chasing bulbs round the whole screen.
  for (let k = 0; k < 56; k++) { const p = k / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = motionOK() ? (k + Math.floor(now / 90)) % 3 === 0 : k % 2 === 0; sg.beginPath(); sg.arc(x, y, 9, 0, 7); sg.fillStyle = on ? '#fff1b8' : '#3a2f66'; sg.fill(); }
  // The gold-frame ape turns on its vertical axis.
  const s = 300, turn = motionOK() ? Math.cos(now / 650) : 1, sw = Math.max(.06, Math.abs(turn)); sg.save(); sg.translate(700, 120 + s / 2); sg.scale(sw, 1); sg.shadowColor = GOLD; sg.shadowBlur = 60; sg.drawImage(goldApe(), -s / 2, -s / 2, s, s); sg.restore();
  sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 30; text(sg, 'MEGAPONT PRIME JACKPOT', 700, 500, 64, '#ffffff', 'Arial', 'center', '900'); sg.restore();
  text(sg, `${fmt(Math.round(amt))} LAYR`, 700, 600, 90, '#ffe48a', 'Arial', 'center', '900'); text(sg, 'FIVE GOLD-FRAME APES · THE RAREST 2% OF THE CLUB', 700, 680, 20, '#b9a6ff', 'Arial', 'center', '800');
  if (t < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (t >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }
function drawGamblePlay(now) { backdrop('gamble', now); const r = scene.data.result, t = (now - scene.t0) / (1500 * speed()), landed = t >= .95 || !motionOK(), cut = Math.min(1, Math.max(0, (t - .15) / .55));
  if (motionOK() && t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('roll');
  text(sg, 'THE LIVE WIRE', 700, RY + 46, 26, '#b9a6ff', 'Arial', 'center', '900');
  sg.save(); sg.translate(0, -36); drawJunction(700, RY + 150, 1, now, landed ? r.parity : null, r.choice, landed ? 1 : cut); sg.restore();
  // The proof: the last digit of the hash decides the live wire (odd is red, even is blue).
  const tail = r.hash.slice(-14, -1), last = r.hash.slice(-1); sg.font = '900 30px Courier New'; const tw = sg.measureText('…' + tail).width, lw = 40, x0 = 700 - (tw + lw + 6) / 2;
  text(sg, 'PROOF', 700, RY + 438, 15, '#8a7ac8', 'Arial', 'center', '900'); text(sg, '…' + tail, x0, RY + 472, 30, '#e8dcff', 'Courier New', 'left', '900'); round(sg, x0 + tw + 6, RY + 450, lw, 44, 8, landed ? (r.win ? '#3fd16b' : '#3a3356') : '#241a44', CREAM, 3); text(sg, landed ? last : '?', x0 + tw + 6 + lw / 2, RY + 473, 30, landed ? '#04140a' : CREAM, 'Courier New', 'center', '900');
  if (landed) { if (!scene.data.landed) { scene.data.landed = true; sfx('land'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) particles(25); } text(sg, `${r.parity === 'odd' ? 'RED' : 'BLUE'} WIRE WAS LIVE · YOU CALLED ${r.choice === 'odd' ? 'RED' : 'BLUE'}`, 700, RY + 528, 24, r.win ? CREAM : '#a39bc4', 'Arial', 'center', '900'); button('CONTINUE', 570, RY + RH - 8, 260, 52, () => setStage('outro')); }
  skipChip(); }
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed()));
  backdrop(kind, now, .4); sg.fillStyle = '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'OVERDRIVE COMPLETE'; total = data.total; lines = [`${data.count} free spins played at 2×${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''}`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any crates or builds won during Overdrive', data.skipped ? 'Skipped: same total, no animation' : ''] }
  if (kind === 'vault') { title = 'CRATES OPENED'; total = data.total; lines = [`3 crates opened: ${(data.picks || []).map(m => `${crateClass(m)} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = 'BUILD FINISHED'; total = data.total; lines = [`${data.cells}/15 bays filled · ${data.respins} respins`, data.jackpot ? `Robot complete: Megapont Prime +${fmt(data.jackpot)} next` : 'Fill all 15 bays to win Megapont Prime'] }
  if (kind === 'jackpot') { title = 'MEGAPONT PRIME'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'CIRCUIT LIVE · DOUBLED' : 'FUSE BLOWN') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`The ${r.parity === 'odd' ? 'red' : 'blue'} wire was live; you called ${r.choice === 'odd' ? 'red' : 'blue'}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; other LAYR untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); sg.shadowColor = ACCENT; sg.shadowBlur = 24; text(sg, title, 700, RY + 110, title.length > 18 ? 54 : 64, '#ffffff', 'Arial', 'center', '900'); sg.shadowBlur = 0;
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 220, 84, '#ffe48a', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 300 + i * 36, 23, '#e0d8ff', 'Arial', 'center', '700')); sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 110, 260, 78, nextScene); }
function drawOverdrivePlay(now) { // the reels, re-skinned: amber factory lights and a conveyor at full speed, spins left and the running total
  sg.save(); sg.fillStyle = lin(sg, 0, RY, 0, RY + RH, ['#140a02', '#3a2305', '#4d2e06']); sg.fillRect(RX, RY, RW, RH); sg.restore();
  const w = drawReels(now); drawOverdriveLights(now);
  round(sg, 300, RY - 56, 800, 34, 10, '#1a0f02', AMB, 3); text(sg, `OVERDRIVE · ${state.free} SPIN${state.free === 1 ? '' : 'S'} LEFT · ${fmt(state.freeTotal)} LAYR · ALL WINS 2×`, 700, RY - 39, 18, '#ffe48a', 'Arial', 'center', '900');
  return w; }
function drawScreen(now) {
  hits = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState();
  drawGauge(now);
  text(sg, fmt(E.meter(state, shownBet)), 700, 104, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 17, '#b9a6ff');
  text(sg, fmt(hs.pot), 1192, 98, 40, INK, 'Arial', 'center', '700'); text(sg, `${hs.period.replace('-W', ' · WEEK ')}  ·  1% OF PAID BETS`, 1192, 136, 14, '#3a2478');
  text(sg, linkedCount.ok ? (linkedCount.value ? `≈ ${fmt(hs.pot / linkedCount.value)} PER LINKED TWIN${linkedCount.test ? ' (TEST)' : ''}` : `NO LINKED TWINS YET${linkedCount.test ? ' (TEST)' : ''}`) : 'SHARE PER TWIN: COUNT UNKNOWN', 1192, 162, 13, '#4a3d82');
  drawBelts(now);
  let msg, msgColor = CREAM;
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawJackpotPlay(now); labBanner(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultPlay(f, now); else if (k === 'chain' && f) drawGrabPlay(f, now); else if (k === 'gamble' && scene.data.result) drawGamblePlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'RED OR BLUE? CALL THE LIVE WIRE' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `ROBOT CRATES · OPEN ${f ? 3 - f.picks.length : 0} MORE · TAP A CRATE`) : scene.kind === 'chain' ? (f ? chainMsg(f, now) : 'FULL BUILD') : TITLES[scene.kind]; }
  else if (cas) { drawCascade(now); const sum = cas.steps.slice(0, cas.k + 1).reduce((a, s) => a + s.pay, 0); msg = `${STAGES[Math.min(cas.k, 3)]}  ·  ${cas.steps[cas.k].multiplier}×  ·  BUILT ${fmt(sum)}`; if (state.freeActive) drawOverdriveLights(now); }
  else { const w = state.freeActive ? drawOverdrivePlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction); const it = w ? cameoFor(w) : null;
    msg = spinning ? 'THE LINE IS RUNNING…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  ${cameoLabel(it)}` : ''}` : state.free ? `${state.free} OVERDRIVE SPINS  ·  ALL WINS 2×` : state.gamble ? `WIN ${fmt(state.gamble)} · RED WIRE OR BLUE WIRE?` : lastResult && lastResult.cascade && lastResult.lineTotal ? `${lastResult.cascade.drops ? `${lastResult.cascade.drops} STATION${lastResult.cascade.drops === 1 ? '' : 'S'} DEEP · ` : ''}${fmt(lastResult.total)} LAYR` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'MEGAPONT ROBOT FACTORY · PRESS TO BUILD'; if (state.free && !spinning) msgColor = '#ffe48a'; }
  text(sg, msg, 700, 822, 25, msgColor);
  drawBlocks();
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 926, 26, '#efeaff', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 926, 26, '#efeaff'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 926, 26, '#ffe48a', 'Arial', 'right');
  labBanner(); screenTexture.needsUpdate = true; screenDirty = false;
}
// The Bonus Lab says so on the screen itself, in every view.
function labBanner() { if (!lab.on) return; sg.save(); sg.fillStyle = '#f2c14e'; sg.fillRect(0, 0, 1400, 24); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL · YOUR REAL GAME IS UNTOUCHED${lab.seedShown != null ? ` · SEED ${lab.seedShown}` : ''}`, 700, 13, 15, '#2a1d00', 'Arial', 'center', '900'); sg.restore(); }

function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
function particles(n = 35) { if (!motionOK()) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }


/* ---------- Spinning, then the Assembly Line cascade ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (!scene && !feature() && !state.free && state.balance < state.bet) { openAccount(); return; } primaryAction(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null, testStops = null;
function spin() {
  if (spinning || $('modal').open || locked() || scene) return;
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  // Test hooks only: forced reel stops for the first five draws (see RobotFactory.test). Normal play passes no generator.
  const forced = testStops; testStops = null;
  const rng = lab.on ? labRng() : forced ? (() => { let k = 0; return n => (k < 5 && n === E.strips[0].length) ? forced[k++] : E.randomInt(n); })() : undefined;
  try { p = rng ? E.start(state, rng) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  // The result is committed to the shared account before anything moves. The Holder Pot meter grows by 1% of a paid bet.
  if (!p.free) holderAdd(p.bet);
  // The engine's cascade for this landed spin is fixed now; the animation only reveals it.
  plan = E.cascadeOf(p.stops, p.grid, p.bet, p.free ? E.FREE_MULT : 1);
  hideBar(); spinning = true; cas = null; lastResult = null; save(); sound('spin'); leverStart = performance.now();
  if (p.free) sound('tick');
  status(p.free ? 'OVERDRIVE SPIN · ALL WINS 2×' : 'THE LINE IS RUNNING…');
  // Now, and only now, choose which NFTs show in each cell, for every step of the cascade.
  const baseFaces = p.grid.map(col => col.map(pickFace)); planFacesList = planFaces(plan, baseFaces); nextFaces = planFacesList.at(-1); lastCascade = { grid: p.grid.map(c => c.slice()), faces: baseFaces.map(c => c.slice()) };
  const now = performance.now(), quick = state.turbo || state.reduced, antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, baseFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
let planFacesList = null;
function cascadeDur() { const q = state.turbo || state.reduced ? .45 : 1; return { flash: 700 * q, crumble: 380 * q, drop: 460 * q }; }
function startCascade(now) {
  if (!plan || !plan.steps[0].wins.length) { finishSpin(); return; }
  cas = { steps: plan.steps, faces: planFacesList, k: 0, phase: 'flash', t0: now, dur: cascadeDur() }; sound('rung', 0); labSeen('cascade', 'flash'); update();
}
function stepCascade(now) {
  if (!cas || now - cas.t0 < cas.dur[cas.phase]) return;
  if (cas.phase === 'flash') { cas.phase = 'crumble'; cas.t0 = now; sound('crumble'); labSeen('cascade', 'crumble'); }
  else if (cas.phase === 'crumble') { cas.phase = 'drop'; cas.t0 = now; sound('drop'); labSeen('cascade', 'drop'); }
  else { cas.k++; cas.t0 = now; if (cas.steps[cas.k].wins.length) { cas.phase = 'flash'; sound('rung', cas.k); } else { gaugeHold = { k: Math.min(cas.k - 1, 3), until: now + 2600 }; cas = null; finishSpin(); return; } }
  screenDirty = true;
}
// Cameos: the NFT on each winning line of the first (landed) grid, kept in the round's history for the future holder royalty.
function recordCameos(r, ctx) { const g = ctx || lastCascade || { grid: state.grid, faces }, wins = r.firstWins || r.wins; const cameos = wins.map(w => { const it = cameoFor(w, g.grid, g.faces); return it && !it.archive ? { tokenId: it.id, collection: it.collection || it.key, lineWin: w.amount } : null; }).filter(Boolean); const h = state.history[0]; if (h && h.id === r.round.id) h.cameos = cameos; if (cameos.length) holderState().cameos = (holderState().cameos || 0) + cameos.length; return cameos; }
let spinEndAt = 0, sceneDue = false; // the Lab autopilot waits for the scenes a finished spin queues (they start 350 ms later)
function finishSpin() {
  spinEndAt = performance.now(); spinning = false; cas = null; plan = null; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet; recordCameos(r); lastCascade = null; save();
  const drops = r.cascade ? r.cascade.drops : 0; if (drops && !gaugeHold) gaugeHold = { k: Math.min(drops, 3), until: performance.now() + 2600 };
  update();
  if (airdrop && r.round.free) airdrop.best = Math.max(airdrop.best, r.total);
  if (r.total && !r.jackpotWin) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'MEGAPONT PRIME · ' : ''}${fmt(r.total)} LAYR WON${drops ? ` · ${drops} STATION${drops === 1 ? '' : 'S'} DEEP` : ''}${r.scatterPay ? ' · MEGAPONT' : ''}` : (r.round.free ? 'OVERDRIVE SPIN COMPLETE' : 'NOTHING ON THE LINE · PRESS AGAIN');
  if (state.gamble) msg += ' · RED WIRE OR BLUE WIRE?'; status(msg);
  // Queue the scenes this round earned: the jackpot first, then each feature in the engine's order, then a new Overdrive.
  const q = [];
  if (r.jackpotWin) q.push({ kind: 'jackpot', data: { amount: r.jackpotWin } });
  r.round.features.forEach(f => q.push({ kind: f.type }));
  if (r.triggers.free) { if (!r.round.free) q.push({ kind: 'free' }); else if (r.freeAward) { if (airdrop) airdrop.retriggers++; toast(`More Megapont! +${r.freeAward} Overdrive spins.`); sfx('sting-free'); } else toast('Overdrive cap reached: 24 spins awarded this feature.'); }
  if (q.length) { stopAuto(); sceneQueue.push(...q.slice(1)); sceneDue = true; setTimeout(() => { sceneDue = false; startScene(q[0].kind, q[0].data || {}); }, 350); return; }
  if (state.freeActive && !state.free) { stopAuto(); setTimeout(airdropOutro, 700); return; }
  if (state.free) { scheduleFree(); return; }
  scheduleAuto();
}

function scheduleFree() { clearTimeout(scheduleFree.t); scheduleFree.t = setTimeout(() => { if (state.free > 0 && !spinning && !scene && !feature() && !$('modal').open && pxEngineActive) spin(); }, state.turbo ? 450 : 1100); }
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || $('modal').open || feature() || scene) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-build stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-BUILD STOPPED'); return; } if (spinning || feature() || scene || locked()) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'Auto-build.', `<p>Auto-build spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-BUILD again at any time to stop.</p>`); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- The feature bar: the scene's buttons as HTML too, so the casino can show them beside the cabinet ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const BAR_ACTS = { primary: () => primaryAction(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), cont: () => nextScene() };
function renderBar() {
  if (!scene) { if (state.free > 0 && state.freeActive) { setBar('OVERDRIVE', `${state.free} spins left`, `${fmt(state.freeTotal)} LAYR so far · all wins 2×`, '<button class="bar-cta" data-act="primary">Next spin ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); bindBar(); } else hideBar(); return; }
  const { kind, stage } = scene, f = feature(), tag = { free: 'FEATURE 01', vault: 'FEATURE 02', chain: 'FEATURE 03', jackpot: 'JACKPOT', gamble: 'GAMBLE' }[kind];
  let html = '', info = '';
  if (stage === 'trigger') { info = 'Triggered'; html = '<button class="bar-cta" data-act="primary">Continue ›</button>'; }
  else if (stage === 'intro') { info = kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR on one call` : RULES[kind]; html = kind === 'gamble' ? '<button class="bar-cta" data-act="odd">Red wire</button><button class="bar-cta" data-act="even">Blue wire</button><button class="pick" data-act="keep">Keep win</button>' : `<button class="bar-cta" data-act="primary">${kind === 'jackpot' ? 'Claim' : 'Start'} ›</button><button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>`; }
  else if (stage === 'play' && kind === 'vault' && f) { const done = f.picks.length === 3, total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = done ? `${fmt(total)} LAYR revealed` : `Open ${3 - f.picks.length} of 9 crates`; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || done ? 'disabled' : ''} aria-label="Crate ${i + 1}${f.picks.includes(i) ? `, ${crateClass(f.awards[i])}, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + (done ? '<button class="bar-cta" data-act="primary">Collect ↗</button>' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'); }
  else if (stage === 'play' && kind === 'chain' && f) { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${n}/15 bays · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 filled`; html = `<button class="bar-cta" data-act="primary">${done ? 'Collect ↗' : 'Respin ›'}</button>${done ? '' : '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'}`; }
  else if (stage === 'play') { info = kind === 'jackpot' ? `${fmt(scene.data.amount)} LAYR` : 'Working…'; html = '<button class="pick" data-act="skip" aria-label="Skip to the summary">Skip</button>'; }
  else { info = 'Summary'; html = '<button class="bar-cta" data-act="cont">Continue ›</button>'; }
  setBar(tag, TITLES[kind], info, html); bindBar(); screenDirty = true;
}
function bindBar() { document.querySelectorAll('#fbBody [data-act]').forEach(b => b.onclick = () => BAR_ACTS[b.dataset.act]()); document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickVault(Number(b.dataset.pick))); }

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'ROBOT FACTORY') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const iconURL = {}, icon = s => iconURL[s] || (iconURL[s] = (() => { const c = canvas(64, 64); c.getContext('2d').drawImage(tileFor(s, pools[s].length ? 0 : -1), 0, 0, 64, 64); return c.toDataURL(); })());
function openCollections() {
  const where = { cherry: 'Megapont Ape Club · tier III (purple frame)', lemon: 'Megapont Ape Club · tier II (blue frame)', chip: 'Megapont Ape Club · tier I (red frame)', block: 'Megapont Space Agency NFTs on Stacks', artifact: 'Megapont Robots on Stacks', bitcoin: 'Megapont Ape Club · the rarest 2% (gold frame)', wild: 'A twinned ape in a mech-suit frame', scatter: 'The official Megapont logo', vault: 'A stencilled shipping crate (a prop, not an NFT)', chain: 'Megapont Robot Components on Stacks' };
  const rows = Object.entries(COLS).map(([s, c]) => { const n = pools[s].filter(t => !t.placeholder).length; return `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc(c.name)}</td><td>${s === 'wild' ? 'Wild' : esc(SHORT[s])}</td><td>${esc(where[s])}</td><td>${fmt(n)}</td></tr>`; }).join('');
  showModal('collections', 'What is on the reels.', `<p>Every symbol is real Megapont material. The <b>Megapont Ape Club</b> (2,500 apes on Stacks) fills four slots by rarity tier: purple frame tier III, blue tier II, red tier I, and a gold frame for the rarest 2%. Five gold-frame apes on the centre row win <b>Megapont Prime</b>. The <b>Mech Suit</b> wild is a twinned ape in a mech frame. <b>Megapont Robots</b>, <b>Space Agency</b> NFTs and <b>Robot Components</b> fill three more slots, and the scatter is the <b>official Megapont logo</b>.</p>
  <p>An ape with a permanent Xtrata <b>Forever Twin</b> shows in full colour with a ∞ badge and its token number; one without is greyed out with a <b>NOT YET FOREVER</b> stamp. Robots, Components and Space Agency NFTs have no twin yet, so they always carry the stamp. Their pictures are recovered historic Megapont images labelled A01, A02… (their token numbers were not recovered), plus any fetched later. ${sources.tiersKnown ? 'Each ape sits in the slot of its rarity tier.' : '<b>The rarity map is not bundled in this build</b>, so apes are dealt across the slots in the tier proportions and each tile says only its token number, never a tier it cannot prove.'}</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>ROLE</th><th>SOURCE</th><th>ON THE REELS</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="fine">Art is chosen after each result is fixed, using a separate random draw, so what loads can never change your odds. ${fmt(sources.bundled)} apes bundled${sources.twinsOnChain != null ? `, ${fmt(sources.twinsOnChain)} twins read live from the Forever Twins helper` : ''}${sources.images ? `, ${fmt(sources.images)} loaded live` : ''}; ${fmt(sources.robots)} robots, ${fmt(sources.components)} components and ${fmt(sources.msa)} Space Agency NFTs bundled; Megapont logo ${sources.logo ? 'bundled' : 'not bundled yet (name tile shown)'}. Artwork belongs to each artist and project; test build, shown pending their OK.</p><button class="outline" id="colHolders">Holder Pot ↗</button>`, 'THE REELS');
  $('colHolders').onclick = openHolders;
}
function openHolders() {
  const h = holderState();
  showModal('holders', 'The Holder Pot.', `<p>1% of every paid bet on Robot Factory goes into this week's Holder Pot. It comes out of the house edge, never out of a stake or a win: the machine still returns 94.38% to players.</p>
  <div class="stat-cards"><div><span>THIS WEEK · ${esc(h.period)}</span><strong>${fmt(h.pot)}</strong></div><div><span>LAST WEEK${h.last ? ` · ${esc(h.last.period)}` : ''}</span><strong>${h.last ? fmt(h.last.pot) : '—'}</strong></div><div><span>CAMEOS RECORDED</span><strong>${fmt(h.cameos || 0)}</strong></div></div>
  <p><b>How it will pay.</b> Holders link a Bitcoin address by signing a message from it (Leather and Xverse both hold a Bitcoin and a Stacks account). At the end of each week the pot is split per twin held from the reel collections. When your Megapont NFT lands on a winning line, its token number shows in the win message and the round records it as a cameo for a 1% royalty.</p>
  <p class="fine">Version 1 shows the meters only. Address linking, the linked-twin count, snapshots and payouts need a server or contract and are not built yet, so the share per twin shows as unknown rather than a guess. The pot meter is kept with this browser's LAYR session.${lab.on ? ' In the Bonus Lab the pot is not touched.' : ''}</p><button class="outline" disabled>Link a Bitcoin address · coming soon</button>`, 'HOLDER REWARDS');
}
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The blueprint: pays.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; all line wins add up. Line bet = total bet ÷ 20. A <b>Mech Suit</b> is wild: it replaces every paying symbol and has its own pays, but never replaces the Megapont logo, a Robot Crate or a Robot Component.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet, then to the Assembly Line rung. Five gold-frame apes on one line at a 100 total bet pays 400 × 5 = 2,000 LAYR on the first station.</p>
  <h3>THE ASSEMBLY LINE</h3><p>Every winning symbol is shipped out of its cell, the symbols above drop down and the strip above the window feeds new ones in. Each new win pays the next rung of the pressure gauge: ${LADDER.map(x => x + '×').join(', ')}, then 5× for every station below, up to ${E.cascade.maxDrops} drops. Scatters, bonus triggers and the jackpot are read from the landed spin only.</p>
  <h3>OVERDRIVE</h3><p>3, 4 or 5 Megapont logos anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. The factory lights go amber, the conveyors race and every win pays <b>2×</b>, on every station of every cascade. More logos add 4 spins, up to 24 per feature. Your bet is locked for the feature. Robot Crates and Full Build can trigger during it and pay at 1×.</p>
  <h3>ROBOT CRATES</h3><p>3 or more Robot Crates slide in as nine stencilled crates. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn independently with equal chance and sealed before you open any. Open three; each reveals a real Megapont Robot with its prize.</p>
  <h3>FULL BUILD</h3><p>5 or more Robot Components start a hold-and-respin. Each bolts into one of the 15 bays of a robot as a part worth ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty bay has a 1 in ${E.CHAIN_ODDS} (4%) chance to fill per respin, and any new part resets the count to 3. Fill all 15 to win Megapont Prime as well.</p>
  <h3>MEGAPONT PRIME</h3><p>Five gold-frame apes on the centre row (wilds don't count), or all 15 bays filled, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. It is not shared with other players.</p>
  <h3>RED WIRE OR BLUE WIRE</h3><p>After a paid base-game win with no bonus, you may stake that win on one 50/50 call: which wire is live? Right doubles the win; wrong loses that win only. The proof shown is the hash whose last digit decides it: odd is red, even is blue.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3><p>Robot Factory runs on the same engine as Deep Strata: Block Fortune v2 with the Layer Cascade rule on, weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. The whole cascade is worked out from the landed spin before anything moves. Only after the result is fixed does the machine choose which NFTs to show, using a separate random draw, so the pictures can never change a result.</p><p>Long-run return to player is <b>94.38%</b>: line wins (cascade included) 59.7%, Megapont scatter pays 1.5%, Overdrive 8.5%, Robot Crates 11.9%, Full Build 10.3% and the jackpot 2.4%, modelled from the strips and rules and confirmed by 5-million-spin simulations. Overdrive and Robot Crates each arrive about 1 in 140 spins, Full Build about 1 in 290, Megapont Prime about 1 in 113,000. Red Wire or Blue Wire is an even bet and doesn't change the return. This is a mathematical design estimate, not an independently certified RTP.</p>
  <p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win. Uses the existing casino LAYR balance on this browser origin; on-chain verification and settlement are not connected. Symbols per strip, reels 1 to 5: ${counts}.</p><button class="outline" id="rulesCols">What is on the reels ↗</button> <button class="outline" id="rulesHolders">Holder Pot ↗</button>`, 'THE BLUEPRINT · HOW TO PLAY');
  $('rulesCols').onclick = openCollections; $('rulesHolders').onclick = openHolders;
}
const info = { free: ['Overdrive', 'Three Megapont logos anywhere pay a scatter prize and award 8 free spins. The factory goes amber, every win is doubled, and more logos add 4 spins, up to 24 per feature.'], vault: ['Robot Crates', 'Three Robot Crates slide in as nine sealed crates. Open three: each reveals a real Megapont Robot and a prize from 1× to 15× your total bet.'], chain: ['Full Build', 'Five Robot Components start a hold-and-respin. Parts bolt into the 15 bays of a robot, any new part resets your three respins, and filling every bay wins Megapont Prime.'], genesis: ['Megapont Prime', 'A progressive meter for each bet level. Land five gold-frame Megapont Apes on the centre row, or fill all 15 bays of the robot, to win it. It starts at 500× your bet and grows with every paid spin at that level.'], cascade: ['The Assembly Line', `Every winning symbol is shipped out, the symbols above drop in and a new win pays the next rung of the pressure gauge: ${LADDER.map(x => x + '×').join(', ')}, then 5× for every station below.`] };
document.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { const t = b.dataset.info, [title, body] = info[t]; showModal('info', title, `<p>${body}</p>${t === 'genesis' ? `<div class="bonus-total">${fmt(E.meter(state, state.bet))}</div><p class="fine">Current meter at your ${fmt(state.bet)} bet.</p>` : '<p class="fine">Earn this feature through LAYR play.</p>'}`); });
const FEAT = s => String(s || '').replace('GENESIS BLOCK', 'MEGAPONT PRIME').replace('CHAIN', 'FULL BUILD').replace('VAULT', 'ROBOT CRATES').replace('FREE SPINS', 'OVERDRIVE').replace('RETRIGGER', 'MORE MEGAPONT');
function openHistory(){
 const body=`${lab.on ? '<p class="lab-note"><b>BONUS LAB.</b> These rounds are practice only. They are not part of your real history, balance or RTP statistics.</p>' : ''}<div class="stat-cards"><div><span>WAGERED · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR${lab.on ? ' · LAB' : ''}</span><strong>${fmt(state.paidOut)}</strong></div></div><p>Latest 50 rounds. All amounts use the shared LAYR account${lab.on ? ' (here: the Lab\'s own practice balance)' : ''}. The NFT on a winning line is recorded with each round.</p><table class="paytable"><thead><tr><th>ROUND</th><th>BET · LAYR</th><th>WIN · LAYR</th><th>ON THE LINE</th></tr></thead><tbody>${state.history.map(h=>`<tr><td>${lab.on ? '<b class="lab-tag">LAB</b> · ' : ''}${new Date(h.time).toLocaleTimeString()} · ${h.kind==='Free spin'?'Overdrive spin':'Spin'}${h.feature?` · ${esc(FEAT(h.feature))}`:''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${(h.cameos||[]).slice(0,2).map(c=>esc(String(c.tokenId))).join(', ')}</td></tr>`).join('')}</tbody></table><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
 showModal('history',lab.on ? 'Lab session (practice LAYR).' : 'Your LAYR session.',body,lab.on ? 'LAB · LAYR HISTORY' : 'LAYR HISTORY');
 $('exportHistory').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({game:GAME_ID,lab:lab.on,currency:'LAYR',wagered:state.wagered,paidOut:state.paidOut,holder:lab.on?null:holderState(),history:state.history},null,2)],{type:'application/json'}));a.href=url;a.download=GAME_ID+(lab.on?'-LAB':'')+'-layr-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function openAccount() {
  if (spinning) return;
  showModal('account', lab.on ? 'Lab practice LAYR.' : 'Your LAYR account.', `<div class="stat-cards"><div><span>${lab.on ? 'LAB PRACTICE LAYR' : 'AVAILABLE LAYR'}</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>${lab.on ? 'This is the Bonus Lab\'s own practice balance. Your real LAYR is untouched.' : 'Every machine in the casino uses the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.'}</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, lab.on ? 'BONUS LAB' : 'SHARED LAYR ACCOUNT');
}
function openSettings() { showModal('settings', 'Tune the line.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (quick spins, no particles, sparks or conveyor motion)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space presses, respins and collects. 1–9 open crates. R calls the red wire, B calls the blue wire. S skips. M mutes. F is full screen.${LAB_OK ? ' L opens the Bonus Lab.' : ''}</p><button class="outline" id="setCols">What is on the reels</button><button class="outline" id="setHolders">Holder Pot</button><button class="outline" id="setHistory">Session history</button>${LAB_OK ? `<button class="outline" id="setLab">${lab.on ? 'Bonus Lab (open)' : 'Bonus Lab'}</button>` : ''}`, 'SETTINGS');
  const bind = (id,k,invert=false) => {const el=$(id);el.disabled=(k==='turbo'||k==='reduced')&&spinInputBusy();el.onchange=()=>{if((k==='turbo'||k==='reduced')&&spinInputBusy()){el.checked=invert?!state[k]:!!state[k];return;}state[k]=invert?!el.checked:el.checked;save();audioInit();update();};};
  bind('setSound', 'muted', true); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setCols').onclick = openCollections; $('setHolders').onclick = openHolders; $('setHistory').onclick = openHistory; if ($('setLab')) $('setLab').onclick = () => { closeModal(); openLab(); };
}
function openFair() {
  showModal('fair', 'Fair play.', `<p>Robot Factory runs on the same engine as Deep Strata: Block Fortune v2 with the Layer Cascade rule (the Assembly Line) on, weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at the same moment. The result, including every station of the cascade, is committed before anything animates; the bonus scenes only reveal it. Only after the result is fixed does the machine choose which NFTs to show, using a separate random draw, so the art can never change a result.</p>
  <div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT</span><strong>1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>PART</th><th>SHARE</th><th>HOW OFTEN</th></tr></thead><tbody><tr><td>Line wins (Assembly Line included)</td><td>59.7%</td><td>every spin</td></tr><tr><td>Megapont scatter pays</td><td>1.5%</td><td>with Overdrive</td></tr><tr><td>Overdrive (free spins)</td><td>8.5%</td><td>1 in 140</td></tr><tr><td>Robot Crates (pick)</td><td>11.9%</td><td>1 in 140</td></tr><tr><td>Full Build (hold and respin)</td><td>10.3%</td><td>1 in 290</td></tr><tr><td>Megapont Prime jackpot</td><td>2.4%</td><td>about 1 in 113,000</td></tr></tbody></table>
  <p>Red Wire or Blue Wire is an even bet and doesn't change the return. The figures come from the design model of these strips and rules (the Deep Strata engine, unchanged) and are confirmed by 5-million-spin simulations. This is a mathematical design estimate, not an independently certified RTP.</p><p class="fine">The Holder Pot (1% of paid bets) is funded from the house edge and never reduces a win.</p>`, 'FAIR PLAY');
}

/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'PRESS', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['odd', 'RED WIRE', 'call red', 'fb gold'], ['even', 'BLUE WIRE', 'call blue', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'RED/BLUE?', 'gamble win', 'fb gold'],
  ['betDown', '−VOLTS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+VOLTS', 'bet up', 'fb'], ['max', 'MAX BET', 'max bet', 'fb'], ['auto', 'AUTO-BUILD', 'auto', 'fb'],
  ['pays', 'BLUEPRINT', 'pays', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'HISTORY', 'rounds', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), gamble: () => openGamble(), betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => enterLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 6).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(6).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free;
  q('primary').querySelector('b').textContent = spinning ? 'BUILDING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('odd', gambleIntro); show('even', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0);
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance);
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-BUILD';
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
// The casino never sets PX_STANDALONE_TEST, so on the public casino RobotFactory.test is null.
// Forced reel stops. Each is a real engine round; only the stop positions are chosen. Verified against the engine (see tools/check-lab-plans.cjs).
const S = { win: [15, 8, 23, 30, 4], s3: [9, 9, 9, 0, 0], s4: [9, 9, 9, 9, 0], s5: [9, 9, 9, 9, 9], vault: [20, 20, 20, 20, 20], chain: [0, 0, 0, 0, 0], jackpot: [8, 3, 14, 0, 15], cascade: [18, 19, 17, 0, 17] };
const TEST_STOPS = { free: S.s3, vault: S.vault, chain: S.chain, jackpot: S.jackpot, win: S.win, cascade: S.cascade };
const LINKED_TEST = { none: 0, some: 1240, all: 158000 };
function engineSource() { const s = [...document.scripts].filter(x => x.text.includes('Block Fortune v2 engine') || x.text.includes('DEEP_STRATA_RULES = ')).map(x => x.text); return s.join('\n'); }
// Seeded RTP simulation of this exact engine, in a worker so the machine stays responsive.
function simulate(spins = 1e6, seed = 20261101, onProgress) { return new Promise((resolve, reject) => {
  const src = `${engineSource()}\nlet x=BigInt(${Number(seed) >>> 0})&0xffffffffffffffffn;function next(){x=(x+0x9e3779b97f4a7c15n)&0xffffffffffffffffn;let z=x;z=((z^(z>>30n))*0xbf58476d1ce4e5b9n)&0xffffffffffffffffn;z=((z^(z>>27n))*0x94d049bb133111ebn)&0xffffffffffffffffn;return Number((z^(z>>31n))>>11n)/2**53;}
const rng=n=>Math.floor(next()*n),N=${Math.floor(spins)},BFX=BF.create(DEEP_STRATA_RULES),st=BFX.fresh();st.balance=1e15;st.bet=100;let paid=0,fr=0,va=0,ch=0,jk=0;
while(paid<N){const free=st.free>0;if(!free)paid++;BFX.start(st,rng);const r=BFX.settle(st);if(r.jackpotWin)jk++;if(r.triggers.free&&!free)fr++;while(BFX.feature(st)){const f=BFX.feature(st);if(f.type==='vault'){if(!f.free)va++;[0,1,2,3,4,5,6,7,8].sort(()=>next()-.5).slice(0,3).forEach(i=>BFX.pick(st,i));}else{if(!f.free)ch++;while(BFX.respin(st));}if(BFX.collect(st).jackpotWin)jk++;}if(!st.free&&st.freeActive)BFX.endFree(st);st.history.length=0;if(paid%250000===0&&!free)postMessage({progress:paid/N});}
postMessage({done:true,spins:N,seed:${Number(seed) >>> 0},rtp:100*st.paidOut/st.wagered,freeEvery:N/fr,pickEvery:N/va,holdEvery:N/ch,jackpots:jk});`;
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), w = new Worker(url);
  w.onmessage = e => { if (e.data.done) { w.terminate(); URL.revokeObjectURL(url); resolve(e.data); } else if (onProgress) onProgress(e.data.progress); };
  w.onerror = e => { w.terminate(); reject(Error(e.message || 'simulation failed')); }; }); }

/* ---------- Bonus Lab: every bonus on demand, without touching anything real ----------
   The Lab swaps in the raw Block Fortune engine (BF.create(DEEP_STRATA_RULES), the same engine bytes) and a fresh state of its own, so the LAYR account, the saved game, the jackpot meters,
   the Holder Pot and the RTP statistics are never read or written (save(), locked() and holderAdd() all step aside while lab.on).
   Each item hands the engine's own start(state, rng) a scripted generator: the reel stops (and, for the full binder, the locks) are
   set, every other draw comes from a seeded generator, so a seed replays the same round exactly. Nothing in the engine is replaced. */
const LAB_ITEMS = [
  { id: 'free', label: 'Overdrive', sub: '3 Megapont logos · 8 free spins at 2×', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'retrigger', label: 'More Megapont', sub: 'Overdrive, then 3 logos on the first free spin: +4 spins', kind: 'free', plan: [{ stops: S.s3 }, { stops: S.s3 }] },
  { id: 'pick', label: 'Robot Crates', sub: '3 Robot Crates · open three of nine', kind: 'vault', plan: [{ stops: S.vault }] },
  { id: 'hold', label: 'Full Build', sub: '5 Robot Components · hold and respin', kind: 'chain', plan: [{ stops: S.chain }] },
  { id: 'fullgrid', label: 'Complete robot', sub: 'Every bay fills: Megapont Prime', kind: 'chain', also: 'jackpot', plan: [{ stops: S.chain, lockAll: true }] },
  { id: 'centre', label: 'Centre-row jackpot', sub: 'Five gold-frame apes on the centre row', kind: 'jackpot', plan: [{ stops: S.jackpot }] },
  { id: 'gamble-win', label: 'Red or Blue Wire: win', sub: 'A plain win, then a correct call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'win' },
  { id: 'gamble-loss', label: 'Red or Blue Wire: loss', sub: 'A plain win, then a wrong call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'loss' },
  { id: 'cascade', label: 'Assembly Line chain', sub: 'A winning spin that keeps cascading: rungs 1×, 2×, 3×, 5×', kind: 'cascade', plan: [{ stops: S.cascade }] },
  { id: 'scatter3', label: '3 Megapont', sub: 'Pays 2× bet and starts Overdrive', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'scatter4', label: '4 Megapont', sub: 'Pays 5× bet and starts Overdrive', kind: 'free', plan: [{ stops: S.s4 }] },
  { id: 'scatter5', label: '5 Megapont', sub: 'Pays 10× bet and starts Overdrive', kind: 'free', plan: [{ stops: S.s5 }] }
];
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Object.assign(lab, { mode: 'seeded', rand: mulberry(lab.seed), seen: [], results: null, running: null, gambleWant: null, seedShown: null, autopilot: false, bet: 100 });
// The engine's own start(state, rng) gets this: the plan's stops (and locks) first, then the seeded stream (or crypto in random play).
function labRng() {
  const plan = lab.script.shift() || null; let k = 0, scripted = !!plan;
  return n => {
    if (plan) { if (n === E.strips[0].length && plan.stops && k < 5) return plan.stops[k++]; if (plan.lockAll && n === 25) return 0; }
    return scripted || lab.mode === 'seeded' ? Math.floor(lab.rand() * n) : RAW.randomInt(n);
  };
}
// Red Wire or Blue Wire in the Lab: the first draw is the parity, so a win or a loss can be set after the player has called.
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
  lab.real = state; const s = RAW.fresh(); s.balance = lab.bank; for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = RAW; lab.rand = mulberry(lab.seed); lab.results = null; lab.seen = []; lab.last = null; lab.seedShown = null;
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
  lab.script = item.plan.map(p => ({ ...p })); state.jackpots = RAW.fresh().jackpots; state.bet = lab.bet; state.freeBet = lab.bet; if (state.balance < 5000) state.balance = lab.bank;
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
  const complete = need.every(k => (k === 'cascade' ? ['flash', 'crumble', 'drop'] : ['trigger', 'intro', 'outro']).every(s => stages.includes(`${k}:${s}`)));
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
  $('labReset').onclick = () => { if (spinning) return; labClean(); state.balance = lab.bank; state.jackpots = RAW.fresh().jackpots; state.bet = lab.bet; update(); toast(`Practice balance reset to ${fmt(lab.bank)}.`); };
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
  twins(mode) { if (!['default', 'none', 'some', 'all'].includes(mode)) throw Error('default, none, some or all'); twinMode = mode; ['cherry', 'lemon', 'chip', 'bitcoin', 'wild'].forEach(retile); refaceIdle(); update(); return { mode, forever: pools.bitcoin.filter(t => t.forever).length + pools.cherry.filter(t => t.forever).length, of: pools.bitcoin.length + pools.cherry.length, wild: pools.wild.map(t => !!t.forever) }; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); linkedCount = { ok: true, value: LINKED_TEST[mode], test: true }; screenDirty = true; update(); return linkedCount; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, cascade: () => cas ? { phase: cas.phase, k: cas.k, of: cas.steps.length } : null, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on), lab: labApi
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops; nothing here exists on the public casino.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">Overdrive</button><button class="cta" data-t="vault">Robot Crates</button><button class="cta" data-t="chain">Full Build</button><button class="cta" data-t="jackpot">Megapont Prime</button><button class="cta" data-t="cascade">Assembly Line</button><button class="cta" data-t="gamble">Red or Blue Wire</button></div>
  <h3>TWINS (MEGAPONT APES)</h3><div class="ab"><button class="outline" data-w="default">As loaded</button><button class="outline" data-w="none">None</button><button class="outline" data-w="some">Some</button><button class="outline" data-w="all">All</button></div><p class="fine">Switches how many twins show as forevered. The rest are greyed with NOT YET FOREVER. Robots, Components and Space Agency NFTs have no twin yet.</p>
  <h3>LINKED HOLDERS</h3><div class="ab"><button class="outline" data-h="none">None</button><button class="outline" data-h="some">Some</button><button class="outline" data-h="all">All</button></div>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Design model: 94.38%.</p>${LAB_OK ? '<h3>BONUS LAB</h3><button class="outline" id="tLab">Open the Bonus Lab</button>' : ''}`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  document.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.w); toast(`Twins: ${b.dataset.w}.`); });
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.linkedHolders(b.dataset.h); toast(`Linked holders: ${b.dataset.h}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked); if ($('tLab')) $('tLab').onclick = () => { closeModal(); enterLab(); };
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · Overdrive 1 in ${r.freeEvery.toFixed(0)} · Crates 1 in ${r.pickEvery.toFixed(0)} · Full Build 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Design model: 94.38%.`; } catch (e) { el.textContent = e.message; } }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) return;
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickVault(Number(e.key) - 1);
  else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') requestFullscreen(!fsOn); else if (e.key.toLowerCase() === 's' && canSkip()) skipScene();
  else if (e.key.toLowerCase() === 'r' && scene?.kind === 'gamble') callGamble('odd'); else if ((e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'k') && scene?.kind === 'gamble') callGamble('even');
  else if (e.key.toLowerCase() === 'l' && LAB_OK) { if (lab.on) openLab(); else enterLab(); }
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-BUILD STOPPED'); } } updateFsBar(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted && pxEngineActive) ac.resume().catch(() => {}); });

/* ---------- Frame loop: the screen only; idle frames capped near 30 fps ---------- */
let lastHl = -1, lastPoolSize = 0, lastTick = 0;
const perf = { frames: 0, drawn: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); perf.frames++;
  spinPhysical.position.z = spinCapZ(now);
  if (spinning && !cas && plan && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); startCascade(now); }
  const hl = cas ? -1 : highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || scene) screenDirty = true; // scenes animate continuously
  if (state.freeActive && motionOK()) screenDirty = true; // Overdrive: conveyors and amber lights
  if (cas) { stepCascade(now); screenDirty = true; } // the Assembly Line
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
  else if (state.free) { renderBar(); status(`${state.free} SAVED OVERDRIVE SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(airdropOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; live top-ups start only after the frame has loaded and a player connects, so a slow
// network can never hold up the cabinet becoming ready.
let liveStarted = false; const startLive = () => { if (liveStarted) return; liveStarted = true; loadLive().catch(() => { sources.done = true; }); };
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.RobotFactory = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!t.bundled }))])),
  faces: () => faces.map(c => c.slice()), cascade: () => cas ? { phase: cas.phase, k: cas.k, of: cas.steps.length } : null, holder: () => JSON.parse(JSON.stringify(holderState())), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
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
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinCapZ(performance.now()):null,press:pressAction&&performance.now()-pressAt<PRESS_T.down+PRESS_T.hold+PRESS_T.up+40?{action:pressAction,id:pressAt,depth:pressDepth(performance.now())}:null,armZ:null,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());setTimeout(startLive,0);if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab.on&&!exitLab())return false;stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name,opts){if(pxEngineActive){if(PRESS_ACTIONS.includes(name)&&!(opts&&opts.noPress)){pressAt=performance.now();pressAction=name;}pxControl(name);}},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  // Fullscreen hand-over: the host shows this frame full-viewport (and in browser fullscreen), then calls fullscreen(true).
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'PRESS',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();
/* Mooneeb — a ParallaX Casino machine on the word ladder M → MOO → MOON → MOONEY → MOONEEB.
   Every result comes from BF (the Block Fortune v2 engine, copied unchanged) before any art, sound or scene is chosen,
   so the presentation can only reveal a result, never change one. Lab runs use the raw engine on a separate lab state. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='mooneeb', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
const bets = E.bets, ACCENT = '#c084fc', GOLD = '#ffd76a', STX = '#5546ff', INK = '#2a1150';
const HOSTED = (() => { try { return window.parent !== window && !!window.frameElement; } catch (e) { return window.parent !== window; } })();
// Bonus Lab and the test panel: always on the standalone test page; in the casino only with ?lab=1 on testnet (the host sets PX_DEV_LAB).
const DEV = (() => { try { if (window.parent !== window && window.parent.PX_DEV_LAB === true) return true; } catch (e) {} return /[?&]lab=1\b/.test(location.search); })();
const RM = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
// Player-facing names. The engine's slot ids (cherry, lemon, …) are internal and never shown.
const NAMES = { cherry: 'M', lemon: 'Moo', chip: 'Moon', block: 'Mooney', artifact: 'Leopold ($LEO)', bitcoin: 'Mooneeb', wild: 'STX Wild', scatter: 'Moonshot', vault: 'Mooney bag', chain: 'Letter tile' };
const RUNG = { cherry: 0, lemon: 1, chip: 2, block: 3, bitcoin: 4 }, RUNGS = ['M', 'MOO', 'MOON', 'MOONEY', 'MOONEEB'];
const SPELL = 'MOONEEBMOONEEB';           // Spell It: cells 0-13 spell MOONEEB twice, cell 14 is the Stacks wild.
let storageOK = true, sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
let G = E;                                 // the engine in use: E (LAYR-wrapped) for real play, raw BF in a Lab run
let realState = null, labRun = null, labBalance = 100000, labHistory = [], labLast = null, labAll = null;
function save(){if(!sessionLock&&!labRun)LAYR.saveGame(state);}
let spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, leverStart = 0, view = 'cabinet', chainFlash = 0, animations = [], screenRev = 0;
let scene = null, sceneQueue = [], freeMode = false, freeTimer = 0, excite = 0, ladderGlow = [0, 0, 0, 0, 0], fsOn = false, twinsMode = 'live';
const feature = () => G.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene || sceneQueue.length > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(labRun)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
const quick = () => !!(state.turbo || RM());
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Procedural audio: bright synth pop, a moo and a rocket roar. No files. ---------- */
let ac = null, master = null, ambNodes = [], noiseBuf = null, musicNodes = [];
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * 2; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function env(g, t, a, d, v) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + a + d); }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, cutoff = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); let out = o; if (cutoff) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff; o.connect(lp); out = lp; } out.connect(g); g.connect(master); env(g, t, .006, d, v); o.start(t); o.stop(t + d + .05); return o; }
function noise(d, v, f0, f1, delay = 0, q = .8) { if (!ac || state.muted) return; const s = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; s.loop = true; bp.type = 'lowpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d * .6); bp.frequency.exponentialRampToValueAtTime(Math.max(80, f0 * .7), t + d); s.connect(bp); bp.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .35); g.gain.exponentialRampToValueAtTime(.0008, t + d); s.start(t); s.stop(t + d + .05); }
// A moo: a sawtooth voice gliding down, shaped by two formant filters, with a slow vibrato.
// The moo is kept for cows: it only sounds when a winning line is made of the cow (Moo) or the cow jumping over the moon (Mooney).
function moo(pitch = 1, delay = 0, v = .22, len = .95) {
  soundLog.push({ kind: 'moo', t: performance.now() + delay * 1000 });
  if (!ac || state.muted) return; const t = ac.currentTime + delay, o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), g = ac.createGain(), mix = ac.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(150 * pitch, t); o.frequency.linearRampToValueAtTime(175 * pitch, t + len * .25); o.frequency.exponentialRampToValueAtTime(108 * pitch, t + len);
  lfo.frequency.value = 5.2; lg.gain.value = 4 * pitch; lfo.connect(lg); lg.connect(o.frequency);
  f1.type = 'bandpass'; f1.Q.value = 6; f1.frequency.setValueAtTime(520, t); f1.frequency.linearRampToValueAtTime(760, t + len * .3); f1.frequency.linearRampToValueAtTime(430, t + len);
  f2.type = 'bandpass'; f2.Q.value = 9; f2.frequency.setValueAtTime(1050, t); f2.frequency.linearRampToValueAtTime(820, t + len);
  o.connect(f1); o.connect(f2); f1.connect(mix); f2.connect(mix); mix.gain.value = 1.6; mix.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .09); g.gain.setValueAtTime(v, t + len * .7); g.gain.exponentialRampToValueAtTime(.0008, t + len);
  o.start(t); lfo.start(t); o.stop(t + len + .05); lfo.stop(t + len + .05);
}
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const POP = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
function stab(notes, at = 0, v = .07) { notes.forEach((n, k) => { tone(n, .32, 'sawtooth', v, at + k * .012, 1, 2600); tone(n * 2, .2, 'square', v * .3, at + k * .012, 1, 3200); }); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { tone(196, .45, 'sawtooth', .05, 0, 2.2, 1800); tone(392, .4, 'triangle', .05, .05, 2); }
  if (kind === 'stop') return [tone(150 + i * 22, .14, 'triangle', .2, at), tone(1046.5 + i * 131, .1, 'square', .025, at, 1, 3000), tone(2093 + i * 262, .12, 'sine', .03, at + .01)].filter(Boolean);
  if (kind === 'win') { POP.slice(0, 4).forEach((n, k) => tone(n, .28, 'square', .045, k * .07, 1, 2400)); if (i) moo(1.12, .3, .16, .7); }   // i: a cow is on a winning line
  if (kind === 'big') { stab([392, 493.88, 587.33], 0); stab([523.25, 659.25, 783.99], .22); stab([659.25, 830.61, 987.77], .44, .08); if (i) moo(1, .7, .2); }
  if (kind === 'bonus') [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((n, k) => { tone(n, .5, 'square', .05, k * .08, 1, 2600); tone(n / 2, .5, 'triangle', .05, k * .08); });
  if (kind === 'roar') { noise(2.2, .32, 220, 1600, 0, .9); tone(48, 2, 'sine', .25, 0, 1.6); tone(96, 1.6, 'sawtooth', .04, .1, 2.4, 600); }
  if (kind === 'antic') tone(180, 1.6, 'sawtooth', .025, 0, 3, 1400);
  if (kind === 'lock') { tone(90, .18, 'triangle', .28, i * .06); noise(.12, .12, 1800, 600, i * .06, .5); tone(1318.5 + i * 90, .32, 'square', .04, i * .06 + .03, 1, 3000); }
  if (kind === 'respin') tone(420, .25, 'triangle', .14, 0, .7);
  if (kind === 'reset') [784, 988, 1175].forEach((n, k) => tone(n, .2, 'square', .04, k * .05, 1, 3000));
  if (kind === 'pick') { for (let k = 0; k < 6; k++) tone(1800 + Math.random() * 1600, .18, 'sine', .05, k * .045); tone(392 + i * 40, .3, 'triangle', .1); }
  if (kind === 'thud') { tone(70, .25, 'sine', .3); noise(.15, .1, 500, 200); }
  if (kind === 'click') tone(880, .05, 'sine', .06);
  if (kind === 'lose') tone(150, .5, 'triangle', .12, 0, .6);
  if (kind === 'flip') for (let k = 0; k < 8; k++) tone(1600 + (k % 2) * 300, .05, 'sine', .04, k * .09);
  if (kind === 'letters') 'MOONEEB'.split('').forEach((_, k) => tone(POP[k % POP.length], .16, 'square', .045, k * .07, 1, 2800));
  if (kind === 'crescendo') { [0.82, 0.92, 1.03, 1.16, 1.3].forEach((p, k) => stab([261.63 * p, 329.63 * p, 392 * p], k * .55, .05 + k * .012)); stab([523.25, 659.25, 783.99, 1046.5], 2.9, .09); }
  return [];
}
function ambient() { ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return; [65.4, 98, 130.8, 196].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.detune.value = i * 3; g.gain.value = .011 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); }); }
// Moonshot's synth-pop bed: a gentle arpeggio loop that runs only while the free spins play.
let musicTimer = 0;
function music(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [392, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 587.33]; musicTimer = setInterval(() => { if (!ac || state.muted || document.hidden) return; const n = seq[k++ % seq.length]; tone(n, .22, 'square', .025, 0, 1, 2200); if (k % 4 === 1) tone(n / 4, .4, 'triangle', .05); }, 210); }
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));

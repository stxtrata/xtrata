/* DOG Army — ParallaX Casino machine 24: an army parade ground under a full moon, for $DOG (DOG•GO•TO•THE•MOON, Rune #3).
   Every result comes from BF (the Block Fortune v2 engine, copied unchanged) before any art, sound or scene is chosen,
   so the presentation can only reveal a result, never change one. Lab runs use the raw engine on a separate lab state. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='dog-army', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
// Palette: military black and white, khaki and brass (the accent is the machine's floor-glow stone #e7e5e4).
const bets = E.bets, ACCENT = '#e7e5e4', BRASS = '#dcb95e', BRASS_D = '#9a7a2c', KHAKI = '#a39a6e', OLIVE = '#59613a', INK = '#14110d', MOONC = '#f4efe0', CRIM = '#b3402f', STEEL = '#b9bcbd';
const HOSTED = (() => { try { return window.parent !== window && !!window.frameElement; } catch (e) { return window.parent !== window; } })();
// Bonus Lab and the test panel: always on the standalone test page; in the casino only with ?lab=1 on testnet (the host sets PX_DEV_LAB).
const DEV = (() => { try { if (window.parent !== window && window.parent.PX_DEV_LAB === true) return true; } catch (e) {} return /[?&]lab=1\b/.test(location.search); })();
const RM = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
// Player-facing names. The engine's slot ids (cherry, lemon, …) are internal and never shown.
const NAMES = { cherry: 'Block 840,000', lemon: 'Rune #3', chip: '889,806', block: 'DOG on Stacks', artifact: 'Runestone', bitcoin: '$DOG', wild: 'Leonidas', scatter: 'Snapshot', vault: 'Dog tag', chain: 'March' };
const MARCH_CELLS = 14;            // March of the Army: cells 0-13 are marching ranks; cell 14, the last rank, is Leonidas leading the parade.
let storageOK = true, sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
let G = E;                                 // the engine in use: E (LAYR-wrapped) for real play, raw BF in a Lab run
let realState = null, labRun = null, labBalance = 100000, labHistory = [], labLast = null, labAll = null;
function save(){if(!sessionLock&&!labRun)LAYR.saveGame(state);}
let spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, winStart = 0, leverStart = 0, view = 'cabinet', chainFlash = 0, animations = [], screenRev = 0;
let scene = null, sceneQueue = [], freeMode = false, freeTimer = 0, excite = 0, tagGlow = [0, 0, 0, 0, 0, 0, 0, 0], fsOn = false, holderMode = 'live';
const feature = () => G.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene || sceneQueue.length > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(labRun)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
const PRESS = {}, markPress = n => { PRESS[n] = performance.now(); }, pressing = n => performance.now() - (PRESS[n] || -1e9) < 150 ? 1 : 0;
const quick = () => !!(state.turbo || RM());
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Procedural audio: marching snare drums, a bugle on bonuses, a howl at the moon. No files, no samples. ---------- */
let ac = null, master = null, ambNodes = [], noiseBuf = null;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); const n = ac.sampleRate * 2; noiseBuf = ac.createBuffer(1, n, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; } catch (e) { ac = null; return; } loadSamples(); ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function env(g, t, a, d, v) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + a + d); }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, cutoff = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); let out = o; if (cutoff) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff; o.connect(lp); out = lp; } out.connect(g); g.connect(master); env(g, t, .006, d, v); o.start(t); o.stop(t + d + .05); return o; }
function noise(d, v, f0, f1, delay = 0, q = .8) { if (!ac || state.muted) return; const s = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = noiseBuf; s.loop = true; bp.type = 'lowpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d * .6); bp.frequency.exponentialRampToValueAtTime(Math.max(80, f0 * .7), t + d); s.connect(bp); bp.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .35); g.gain.exponentialRampToValueAtTime(.0008, t + d); s.start(t); s.stop(t + d + .05); }
/* Real recordings (CC0, VS Chamber Orchestra: Community Edition): snare hits and rolls, a concert bass drum and a trumpet, bundled as small mp3s in
   DOGARMY_ART.files['audio/<name>.mp3'] (sources and licence: art/audio/sources.json). They are decoded after the first sound unlock; until then, or if
   anything fails, the code-made drums and bugle below play exactly as before. The same call signatures are used, so no scene changes. */
const SMP = { buf: {}, loading: false, n: 0 };
async function loadSamples() {
  if (SMP.loading || !ac) return; SMP.loading = true;
  const files = (window.DOGARMY_ART && window.DOGARMY_ART.files) || {};
  await Promise.all(Object.keys(files).filter(k => /^audio\/.+\.mp3$/.test(k)).map(async k => {
    try { const b64 = files[k].slice(files[k].indexOf(',') + 1), raw = atob(b64), u = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) u[i] = raw.charCodeAt(i);
      SMP.buf[k.slice(6, -4)] = await new Promise((res, rej) => { const p = ac.decodeAudioData(u.buffer, res, rej); if (p && p.catch) p.catch(rej); }); SMP.n++; } catch (e) {} }));
}
let smpRR = 0;
// One-shot: sample `name`, peak gain g, delay s, playback rate, cut after `dur` seconds (0 = let it ring).
function smpPlay(name, g, delay = 0, rate = 1, dur = 0, fadeIn = .002) {
  const b = SMP.buf[name]; if (!b || !ac || state.muted) return false;
  const t = ac.currentTime + delay, s = ac.createBufferSource(), gn = ac.createGain(); s.buffer = b; s.playbackRate.value = rate; s.connect(gn); gn.connect(master);
  gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(g, t + fadeIn);
  if (dur) { gn.gain.setValueAtTime(g, t + Math.max(fadeIn + .01, dur - .08)); gn.gain.linearRampToValueAtTime(0, t + dur); s.start(t); s.stop(t + dur + .02); } else s.start(t);
  return true;
}
// Snare: the velocity layer follows the old synth level (v), a little random variation in level and pitch so no two hits are identical.
function smpSnare(v, delay, pitch, len) {
  if (!SMP.buf.snare0) return false; const rate = (1 + (pitch - 1) * .4) * (1 + (Math.random() - .5) * .03), jit = .88 + Math.random() * .24;
  if (len <= .06 && SMP.buf.tap0) return smpPlay('tap' + ((smpRR++) & 1), Math.min(1, v * 3.2) * jit, delay, rate, .22);
  const layer = v < .06 ? 0 : v < .09 ? 1 : v < .125 ? 2 : v < .165 ? 3 : 4;
  return smpPlay('snare' + layer, .42 * jit, delay, rate, Math.max(.22, len * 3.4));
}
function smpKick(v, delay) { return !!SMP.buf.kick0 && smpPlay(v < .22 ? 'kick0' : 'kick1', Math.min(1, v * 1.9), delay, 1, v < .22 ? .75 : 1.25); }
// A real snare roll, shaped by the old crescendo (v0 to v1); long rolls use the long recording, short ones the short one.
function smpRoll(n, span, v0, v1, delay, pitch) {
  const name = span <= 1.35 ? 'roll1' : 'roll0'; const b = SMP.buf[name]; if (!b || !ac || state.muted) return false;
  const t = ac.currentTime + delay, s = ac.createBufferSource(), gn = ac.createGain(), rate = 1 + (pitch - 1) * .3, dur = Math.min(span, b.duration / rate - .02);
  s.buffer = b; s.playbackRate.value = rate; s.connect(gn); gn.connect(master);
  gn.gain.setValueAtTime(Math.min(.9, v0 * 3.4), t); gn.gain.linearRampToValueAtTime(Math.min(.9, v1 * 3.4), t + dur - .06); gn.gain.linearRampToValueAtTime(0, t + dur); s.start(t); s.stop(t + dur + .02); return true;
}
// Trumpet: the nearest recorded note, shifted in pitch to the bugle note. A short tongued attack (staccato take) leads every note; longer notes add the sustained take.
const TPT = { stac: [[349.23, 'tpt_stac_F4'], [523.25, 'tpt_stac_C5']], sus: [[293.66, 'tpt_sus_D4'], [440, 'tpt_sus_A4'], [523.25, 'tpt_sus_C5']] };
const nearestNote = (list, f) => list.reduce((a, b) => Math.abs(Math.log(f / b[0])) < Math.abs(Math.log(f / a[0])) ? b : a);
function smpBrass(f, d, delay, v) {
  if (!SMP.buf.tpt_stac_C5) return false; const g = Math.min(.9, v * 3.1), [bf, bn] = nearestNote(TPT.stac, f), dur = Math.min(1.35, Math.max(.16, d));
  smpPlay(bn, g * (d > .3 ? .85 : 1), delay, f / bf, d > .3 ? .5 : dur + .05, .004);
  if (d > .3) { const [sf, sn] = nearestNote(TPT.sus, f); smpPlay(sn, g * .8, delay + .02, f / sf, dur, .05); }
  return true;
}
// A snare drum: a burst of high-passed noise (the wires) over a short tuned shell, with a tight decay.
function snare(v = .16, delay = 0, pitch = 1, len = .13) {
  if (!ac || state.muted) return; if (smpSnare(v, delay, pitch, len)) return; const t = ac.currentTime + delay, s = ac.createBufferSource(), hp = ac.createBiquadFilter(), bp = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; s.loop = true; hp.type = 'highpass'; hp.frequency.value = 1400 * pitch; bp.type = 'peaking'; bp.frequency.value = 3600; bp.gain.value = 6; s.connect(hp); hp.connect(bp); bp.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .002); g.gain.exponentialRampToValueAtTime(.0008, t + len); s.start(t, Math.random()); s.stop(t + len + .03);
  tone(205 * pitch, .09, 'triangle', v * .85, delay, .55);
}
function kick(v = .3, delay = 0) { if (smpKick(v, delay)) { tone(70, .12, 'sine', v * .35, delay, .5); return; } tone(95, .22, 'sine', v, delay, .38); noise(.06, v * .2, 700, 160, delay, .5); }
function roll(n = 10, span = .8, v0 = .05, v1 = .16, delay = 0, pitch = 1) { if (smpRoll(n, span, v0, v1, delay, pitch)) return; for (let k = 0; k < n; k++) snare(v0 + (v1 - v0) * (k / Math.max(1, n - 1)), delay + k * (span / n), pitch, .07); }
// A bugle: brass-like (two slightly detuned sawtooths through a lowpass that opens), with a small scoop into each note.
function brass(f, d = .3, delay = 0, v = .07) {
  if (!ac || state.muted) return; if (smpBrass(f, d, delay, v)) return; const t = ac.currentTime + delay, o1 = ac.createOscillator(), o2 = ac.createOscillator(), lp = ac.createBiquadFilter(), g = ac.createGain();
  o1.type = 'sawtooth'; o2.type = 'sawtooth'; o2.detune.value = 7; for (const o of [o1, o2]) { o.frequency.setValueAtTime(f * .955, t); o.frequency.exponentialRampToValueAtTime(f, t + .05); }
  lp.type = 'lowpass'; lp.Q.value = 1.4; lp.frequency.setValueAtTime(700, t); lp.frequency.exponentialRampToValueAtTime(2600, t + .09); lp.frequency.linearRampToValueAtTime(1500, t + d);
  o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .035); g.gain.setValueAtTime(v * .85, t + Math.max(.04, d - .09)); g.gain.exponentialRampToValueAtTime(.0008, t + d + .04);
  o1.start(t); o2.start(t); o1.stop(t + d + .08); o2.stop(t + d + .08);
}
// Bugle calls use the instrument's natural notes (G4 C5 E5 G5).
const BUGLE = { g4: 392, c5: 523.25, e5: 659.25, g5: 783.99, c6: 1046.5 };
function charge(at = 0, v = .07) { [[BUGLE.g4, .13, 0], [BUGLE.g4, .13, .16], [BUGLE.c5, .2, .32], [BUGLE.e5, .2, .56], [BUGLE.g5, .62, .8]].forEach(([f, d, a]) => brass(f, d, at + a, v)); }
// A howl at the moon: a sawtooth voice gliding up and down through two moving formant filters, with breath noise and a late vibrato. No samples.
function howl(delay = 0, v = .24, len = 3.2) {
  soundLog.push({ kind: 'howl', t: performance.now() + delay * 1000 });
  if (!ac || state.muted) return; const t = ac.currentTime + delay, o = ac.createOscillator(), o2 = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), f3 = ac.createBiquadFilter(), g = ac.createGain(), mix = ac.createGain();
  o.type = 'sawtooth'; o2.type = 'square'; o2.detune.value = -1200; o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(500, t + len * .26); o.frequency.linearRampToValueAtTime(585, t + len * .52); o.frequency.exponentialRampToValueAtTime(300, t + len);
  o2.frequency.setValueAtTime(230, t); o2.frequency.exponentialRampToValueAtTime(500, t + len * .26); o2.frequency.linearRampToValueAtTime(585, t + len * .52); o2.frequency.exponentialRampToValueAtTime(300, t + len);
  lfo.frequency.value = 5.4; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(0, t + len * .3); lg.gain.linearRampToValueAtTime(11, t + len * .6); lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
  f1.type = 'bandpass'; f1.Q.value = 7; f1.frequency.setValueAtTime(760, t); f1.frequency.linearRampToValueAtTime(560, t + len * .35); f1.frequency.linearRampToValueAtTime(330, t + len);          // "aw" closing to "oo"
  f2.type = 'bandpass'; f2.Q.value = 9; f2.frequency.setValueAtTime(1150, t); f2.frequency.linearRampToValueAtTime(980, t + len * .4); f2.frequency.linearRampToValueAtTime(760, t + len);
  f3.type = 'bandpass'; f3.Q.value = 10; f3.frequency.value = 2500; const o2g = ctxGain(.22);
  o.connect(f1); o.connect(f2); o2.connect(o2g); o2g.connect(f1); o.connect(f3); f1.connect(mix); f2.connect(mix); f3.connect(mix); mix.gain.value = 1.5; mix.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + len * .2); g.gain.setValueAtTime(v, t + len * .68); g.gain.exponentialRampToValueAtTime(.0008, t + len);
  o.start(t); o2.start(t); lfo.start(t); o.stop(t + len + .05); o2.stop(t + len + .05); lfo.stop(t + len + .05);
  noise(len * .8, v * .18, 3200, 1800, delay, .6);
}
function ctxGain(v) { const g = ac.createGain(); g.gain.value = v; return g; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { roll(7, .5, .03, .1, 0, .9); kick(.18, 0); }
  if (kind === 'stop') { snare(.12 + i * .01, at, .85 + i * .06, .1); return [tone(120 + i * 18, .1, 'triangle', .13, at)].filter(Boolean); }
  if (kind === 'win') { [BUGLE.c5, BUGLE.e5, BUGLE.g5].forEach((f, k) => brass(f, .16 + (k === 2 ? .2 : 0), k * .12, .05)); snare(.12, 0); snare(.1, .12); }
  if (kind === 'big') { charge(0, .07); roll(14, .8, .05, .17, 0); kick(.3, 0); }
  if (kind === 'bonus') { charge(0, .075); roll(10, .8, .04, .15, 0); kick(.28, .8); }
  if (kind === 'airdrop') { charge(0, .07); for (let k = 0; k < 6; k++) { noise(.5, .1, 2200, 500, .9 + k * .13, .7); } roll(12, 1.1, .04, .16, 0.2); }
  if (kind === 'lock') { snare(.2, i * .09, .9); kick(.26, i * .09); brass(BUGLE.g4 * (1 + (i % 3) * .26), .18, i * .09 + .02, .045); }
  if (kind === 'respin') { snare(.09, 0, 1.1); snare(.07, .12, 1.2); kick(.14, 0); }
  if (kind === 'spinCells') { const sp = Math.max(.4, i / 1000); roll(16, sp, .05, .16, 0); kick(.2, sp); }
  if (kind === 'tension') { const sp = Math.max(.6, i / 1000); roll(22, sp, .04, .2, 0, 1); for (let k = 0; k * .62 < sp; k++) { kick(.2, k * .62); kick(.13, k * .62 + .18); } brass(BUGLE.g4 * .5, sp, 0, .035); }
  if (kind === 'celltap') { snare(.05 + (i % 5) * .012, 0, .9 + (i % 7) * .04, .05); }
  if (kind === 'reset') { [BUGLE.g4, BUGLE.c5, BUGLE.e5].forEach((f, k) => brass(f, .13, k * .08, .045)); }
  if (kind === 'pick') { tone(1500 + Math.random() * 500, .08, 'sine', .05); tone(2300 + Math.random() * 500, .1, 'sine', .04, .04); snare(.12, .02, 1.3, .08); tone(392 + i * 40, .24, 'triangle', .1, .02); }
  if (kind === 'thud') { kick(.3); }
  if (kind === 'click') tone(880, .05, 'sine', .06);
  if (kind === 'lose') { tone(150, .5, 'triangle', .12, 0, .6); roll(5, .4, .08, .02); }
  if (kind === 'flip') { for (let k = 0; k < 9; k++) snare(.06 + k * .006, k * .085, 1.2 + (k % 2) * .25, .05); }
  if (kind === 'march') { roll(8, .6, .05, .13, 0, 1); }
  if (kind === 'crescendo') { roll(22, 2.4, .04, .2, 0); [0.82, 0.92, 1.03, 1.16].forEach((p, k) => { brass(BUGLE.g4 * p, .5, k * .55, .06); brass(BUGLE.c5 * p, .5, k * .55, .05); }); charge(2.4, .09); kick(.35, 2.4); }
  if (kind === 'howl') howl(0, .26, 3.4);
  return [];
}
function ambient() { ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return; [65.4, 98, 130.8, 196].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.detune.value = i * 3; g.gain.value = .011 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); }); }
// The Airdrop's bed: a quiet marching cadence on the snare (tap-tap-TAP) that runs only while the free spins play.
let musicTimer = 0;
function music(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const acc = [1, 0, 1, 0, 1, 0, 1, 2]; musicTimer = setInterval(() => { if (!ac || state.muted || document.hidden) return; const s = k++ % 8, a = acc[s]; if (a === 1) snare(.045, 0, 1, .09); else if (a === 2) { snare(.05, 0, 1, .08); snare(.045, .066, 1.1, .07); } else snare(.018, 0, 1.2, .05); if (s === 0 || s === 4) kick(.09); }, 135); }
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));

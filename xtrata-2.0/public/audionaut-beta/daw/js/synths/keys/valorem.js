// jiVALOREM — layered sample instrument (a nod to Nu Valorem, Marek's indie alias).
// Up to four layers, each playing a multisampled source through synth-style shaping: shared
// filter with envelope, drive, ADSR and stereo spread. Layer A can play a custom pack (key and
// velocity zones of imported or Xtrata-linked samples); every layer can play the starter pack.
// The starter pack is ORIGINAL and modelled in code (no recordings): keys, pluck, guitar,
// strings, pad, choir and bell, rendered once per root and cached per audio context.
import { defaultInstrumentConfig, resolveInstrumentBuffer, selectPianoZone } from '../../pro-instruments-config.js';
import { sourceSample, frequency, clamp } from '../../pro-instruments-runtime.js';
import { pianoStarterSample } from './concertpiano.js';

export const VALOREM_FAMILIES = ['keys', 'pluck', 'guitar', 'strings', 'pad', 'choir', 'bell'];
const SUSTAINED = new Set(['strings', 'pad', 'choir']);
const LAYERS = ['a', 'b', 'c', 'd'];
const range = (key, label, min, max, step, def) => ({ key, label, type: 'range', min, max, step, def });
const select = (key, label, options, def) => ({ key, label, type: 'select', options, def });
const layerParams = (l, type, level, tune) => [
  select(`${l}Type`, `Layer ${l.toUpperCase()} source`, ['off', ...VALOREM_FAMILIES], type),
  range(`${l}Level`, `Layer ${l.toUpperCase()} level`, 0, 1, 0.01, level),
  range(`${l}Tune`, `Layer ${l.toUpperCase()} tune (st)`, -24, 24, 1, tune)
];
const params = [
  ...layerParams('a', 'keys', 0.9, 0),
  ...layerParams('b', 'pad', 0.32, 0),
  ...layerParams('c', 'off', 0.4, 12),
  ...layerParams('d', 'off', 0.4, -12),
  range('width', 'Layer spread', 0, 1, 0.01, 0.5),
  range('start', 'Sample start (s)', 0, 0.3, 0.001, 0),
  range('cutoff', 'Cutoff (Hz)', 200, 18000, 1, 14000),
  range('reso', 'Resonance', 0.3, 10, 0.1, 0.7),
  range('fEnv', 'Filter envelope (oct)', 0, 4, 0.05, 0),
  range('fDecay', 'Filter decay', 0.01, 3, 0.01, 0.5),
  range('drive', 'Drive', 0, 1, 0.01, 0),
  range('velocityCurve', 'Velocity curve', 0.5, 2, 0.05, 1.1),
  range('attack', 'Attack', 0.001, 2, 0.001, 0.003),
  range('decay', 'Decay', 0.01, 4, 0.01, 1.2),
  range('sustain', 'Sustain', 0, 1, 0.01, 1),
  range('release', 'Release', 0.02, 4, 0.01, 0.45),
  range('level', 'Level', 0, 1.5, 0.01, 0.9)
];

// ---------------------------------------------------------------- starter pack
// Seamless loop: crossfade the end of the loop into the material just before its start.
function seamLoop(data, sr, startSec, endSec, fadeSec = 0.12) {
  const start = Math.floor(startSec * sr), end = Math.floor(endSec * sr), fade = Math.min(Math.floor(fadeSec * sr), start - 1);
  for (let j = 0; j < fade; j++) {
    const x = j / fade, w = Math.sin((x * Math.PI) / 2);
    data[end - fade + j] = data[end - fade + j] * Math.cos((x * Math.PI) / 2) + data[start - fade + j] * w;
  }
  return { start: start / sr, end: end / sr };
}
const LOOPS = new Map();
function osc(f, sr) { const a = (2 * Math.PI * f) / sr; return { s: 0, c: 1, ds: Math.sin(a), dc: Math.cos(a) }; }
function step(o) { const n = o.s * o.dc + o.c * o.ds; o.c = o.c * o.dc - o.s * o.ds; o.s = n; return n; }
function karplus(data, sr, f, random, damping, bright, body) {
  const n = Math.max(2, Math.round(sr / f)), line = new Float32Array(n);
  for (let i = 0; i < n; i++) line[i] = (random() * 2 - 1) * (0.6 + 0.4 * Math.sin((Math.PI * i) / n));
  let lp = 0;
  for (let i = 0; i < n; i++) { lp += bright * (line[i] - lp); line[i] = lp; }
  let k = 0, prev = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const v = line[k], next = line[(k + 1) % n];
    line[k] = damping * (0.5 * (v + next));
    k = (k + 1) % n;
    let y = v;
    if (body) { // a soft wooden-body resonance near 110 Hz and 230 Hz
      b1 += 0.004 * (y - b1); b2 += 0.012 * (y - b2);
      y = y + 0.6 * b1 - 0.25 * b2 + 0.15 * (y - prev);
    }
    prev = v;
    data[i] = Math.tanh(y * 0.9) * 0.8 * Math.min(1, i / 8);
  }
}
function ensemble(data, sr, f, random, { voices, harmonics, tilt, detune, vibrato, attack, formants }) {
  const parts = [];
  for (let v = 0; v < voices; v++) {
    const d = ((v / Math.max(1, voices - 1)) * 2 - 1) * detune, fv = f * 2 ** (d / 1200);
    const count = Math.min(harmonics, Math.floor((sr * 0.45) / fv));
    for (let h = 1; h <= count; h++) {
      let amp = 1 / h ** tilt;
      if (formants) amp *= formants.reduce((sum, [c, w, g]) => sum + g * Math.exp(-(((h * f) - c) ** 2) / (2 * w * w)), 0.04);
      parts.push({ o: osc(fv * h, sr), amp: amp / Math.sqrt(voices), rate: 4.6 + random() * 1.2, phase: random() * 6.28, h });
    }
  }
  let peak = 1e-9;
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (const p of parts) sum += step(p.o) * p.amp;
    data[i] = sum * Math.min(1, i / (attack * sr));
    peak = Math.max(peak, Math.abs(data[i]));
  }
  // Gentle per-voice amplitude shimmer stands in for vibrato without phase drift at the loop.
  for (let i = 0; i < data.length; i++) data[i] = (data[i] / peak) * 0.7 * (1 + vibrato * Math.sin((2 * Math.PI * 5.2 * i) / sr));
}
export function valoremStarterSample(ctx, family, root) {
  if (family === 'keys') return pianoStarterSample(ctx, root, 1);
  const f = frequency(root), key = `audionaut-valorem-v1:${family}:${root}`;
  const seconds = SUSTAINED.has(family) ? 3 : family === 'bell' ? 4.5 : family === 'guitar' ? 3.5 : 2.4;
  const buffer = sourceSample(ctx, key, seconds, (data, sr, random) => {
    if (family === 'pluck') karplus(data, sr, f, random, 0.996 - Math.min(0.006, f / 400000), 0.55, false);
    else if (family === 'guitar') karplus(data, sr, f, random, 0.9985 - Math.min(0.004, f / 600000), 0.35, true);
    else if (family === 'bell') {
      const ratios = [1, 2.01, 2.76, 4.07, 5.43, 6.8], parts = ratios.map((r, i) => ({ o: osc(f * r, sr), amp: 1 / (1 + i * 0.9), decay: Math.exp(-1 / (sr * (2.6 / (1 + i * 0.7)))) }));
      for (let i = 0; i < data.length; i++) { let s = 0; for (const p of parts) { s += step(p.o) * p.amp; p.amp *= p.decay; } data[i] = s * 0.42 * Math.min(1, i / 16); }
    } else if (family === 'strings') ensemble(data, sr, f, random, { voices: 5, harmonics: 24, tilt: 1, detune: 9, vibrato: 0.03, attack: 0.18 });
    else if (family === 'pad') ensemble(data, sr, f, random, { voices: 4, harmonics: 10, tilt: 1.8, detune: 12, vibrato: 0.05, attack: 0.35 });
    else ensemble(data, sr, f, random, { voices: 3, harmonics: 30, tilt: 0.6, detune: 7, vibrato: 0.04, attack: 0.25, formants: [[700, 130, 1], [1150, 160, 0.6], [2600, 240, 0.25]] });
    if (SUSTAINED.has(family)) LOOPS.set(key, seamLoop(data, sr, 1.1, seconds - 0.08));
  });
  buffer.valoremLoop = SUSTAINED.has(family) ? LOOPS.get(key) : null;
  return buffer;
}
const rootFor = (pitch) => clamp(Math.round(pitch / 6) * 6, 24, 102);

// ---------------------------------------------------------------- voice
export function createValoremVoice(ctx, destination, instrument, config, note, P, onEnded, options = {}) {
  const time = Math.max(ctx.currentTime, note.time), velocity = clamp(note.vel, 0, 1) ** (P.velocityCurve ?? 1.1);
  const attack = Math.max(0.001, P.attack ?? 0.003), release = Math.max(0.005, P.release ?? 0.45);
  const nodes = [], sources = [];
  const sum = ctx.createGain(), filter = ctx.createBiquadFilter(), body = ctx.createGain(), env = ctx.createGain(), level = ctx.createGain();
  nodes.push(sum, filter, body, env, level);
  filter.type = 'lowpass'; filter.Q.value = P.reso ?? 0.7;
  const nyq = ctx.sampleRate * 0.45, cut = Math.min(nyq, P.cutoff ?? 14000);
  filter.frequency.setValueAtTime(Math.min(nyq, cut * 2 ** (P.fEnv || 0)), time);
  if (P.fEnv > 0) filter.frequency.setTargetAtTime(cut, time + 0.001, Math.max(0.004, P.fDecay ?? 0.5) / 3);
  level.gain.value = (P.level ?? 0.9) * velocity;
  let tail = sum;
  sum.connect(filter);
  tail = filter;
  if (P.drive > 0) {
    const shaper = ctx.createWaveShaper(), trim = ctx.createGain(), k = 1 + P.drive * 8, curve = new Float32Array(513);
    for (let i = 0; i < 513; i++) curve[i] = Math.tanh((i / 256 - 1) * k) / Math.tanh(k);
    shaper.curve = curve; shaper.oversample = '2x'; trim.gain.value = 1 / (1 + P.drive * 0.8);
    tail.connect(shaper).connect(trim); tail = trim; nodes.push(shaper, trim);
  }
  tail.connect(body).connect(env).connect(level).connect(destination);
  const age = Math.max(0, note.offset || 0);
  env.gain.setValueAtTime(Math.min(1, age / attack), time);
  if (age < attack) env.gain.linearRampToValueAtTime(1, time + attack - age);
  const sus = clamp(P.sustain ?? 1, 0, 1);
  body.gain.setValueAtTime(1, time);
  if (sus < 1) body.gain.setTargetAtTime(sus, time + attack, Math.max(0.005, P.decay ?? 1.2) / 3);
  let looped = false, endTime = time;
  const spreadOf = { a: 0, b: -0.6, c: 0.6, d: 0.3 };
  for (const l of LAYERS) {
    const type = P[`${l}Type`], layerLevel = P[`${l}Level`] ?? 0;
    if (type === 'off' || layerLevel <= 0) continue;
    let buffer, rootMidi, gain = 1, loop = null;
    const pitch = clamp(note.pitch + (P[`${l}Tune`] || 0), 0, 127);
    if (l === 'a' && config.zones?.length) {
      const zone = selectPianoZone(config, pitch, clamp(note.vel, 0, 1));
      if (!zone) throw new Error('No custom pack zone covers this note and velocity. Add a matching key/velocity zone.');
      buffer = resolveInstrumentBuffer(config, zone.sourceId, options.bufferForSource); rootMidi = zone.rootMidi; gain = zone.gain;
      if (zone.loopEndSeconds != null) loop = { start: zone.loopStartSeconds, end: Math.min(buffer.duration, zone.loopEndSeconds) };
    } else {
      rootMidi = rootFor(pitch);
      buffer = valoremStarterSample(ctx, type, rootMidi);
      loop = buffer.valoremLoop;
    }
    const source = ctx.createBufferSource(), g = ctx.createGain(), pan = ctx.createStereoPanner();
    source.buffer = buffer;
    const rate = 2 ** ((pitch - rootMidi) / 12);
    source.playbackRate.value = rate;
    if (loop) { source.loop = true; source.loopStart = loop.start; source.loopEnd = loop.end; looped = true; }
    g.gain.value = layerLevel * gain; pan.pan.value = clamp(spreadOf[l] * (P.width ?? 0.5), -1, 1);
    source.connect(g).connect(pan).connect(sum);
    nodes.push(source, g, pan); sources.push(source);
    const raw = (P.start || 0) + age * rate;
    const offset = loop && raw >= loop.end ? loop.start + ((raw - loop.start) % (loop.end - loop.start)) : Math.min(raw, Math.max(0, buffer.duration - 1 / buffer.sampleRate));
    source.start(time, offset);
    if (!loop) endTime = Math.max(endTime, time + (buffer.duration - offset) / rate);
  }
  if (looped) endTime = Infinity;
  let ended = false, released = false, releaseAt = null, live = sources.length;
  const finish = () => { if (ended) return; ended = true; for (const n of nodes) { try { n.disconnect(); } catch { /* gone */ } } onEnded?.(); };
  const fade = (at, seconds) => {
    if (ended || (releaseAt != null && releaseAt <= at)) return;
    released = true; releaseAt = at;
    const start = Math.max(ctx.currentTime, at), d = Math.max(0.003, seconds);
    const amp = Math.min(1, Math.max(0, age + start - time) / attack);
    env.gain.cancelScheduledValues(start); env.gain.setValueAtTime(amp, start); env.gain.linearRampToValueAtTime(0, start + d);
    endTime = Math.min(endTime, start + d);
    for (const s of sources) { try { s.stop(endTime + 1 / ctx.sampleRate); } catch { /* stopped */ } }
  };
  for (const s of sources) s.onended = () => { if (--live <= 0) finish(); };
  const voice = {
    get ended() { return ended; }, get released() { return released; }, get endTime() { return endTime; }, get sources() { return sources; },
    ready: Promise.resolve(true), oneShot: false, latencySeconds: 0, tailSeconds: release,
    release(at = ctx.currentTime, seconds = release) { fade(at, seconds); },
    choke(at = ctx.currentTime) { fade(at, 0.004); },
    stop(at = ctx.currentTime) { fade(at, 0.003); },
    setBend(semitones, at = ctx.currentTime) { for (const s of sources) s.detune.setValueAtTime(clamp(semitones, -48, 48) * 100, at); },
    setParameters(patch, at = ctx.currentTime) {
      if (Number.isFinite(patch.level)) level.gain.setTargetAtTime(patch.level * velocity, at, 0.008);
      if (Number.isFinite(patch.cutoff)) filter.frequency.setTargetAtTime(Math.min(nyq, patch.cutoff), at, 0.008);
      if (Number.isFinite(patch.reso)) filter.Q.setTargetAtTime(patch.reso, at, 0.008);
      return true;
    }
  };
  if (!sources.length) { queueMicrotask(finish); return voice; }
  if (!note.held) fade(time + Math.max(0.001, note.dur), release);
  return voice;
}

const radio = (key, label, options) => ({ type: 'radio', key, label, options: options.map((v) => [v, v.toUpperCase()]) });
const knob = (key, label, fmt, extra = {}) => ({ type: 'knob', key, label, fmt, ...extra });
const layerSection = (l) => ({ title: `LAYER ${l.toUpperCase()}`, items: [radio(`${l}Type`, 'Source', ['off', ...VALOREM_FAMILIES]), { type: 'row', items: [knob(`${l}Level`, 'LEVEL', 'pct'), knob(`${l}Tune`, 'TUNE', 'int')] }] });

export const VALOREM_SYNTHS = {
  valorem: {
    name: 'jiVALOREM',
    tagline: 'Layered sample instrument · four layers, synth shaping, custom packs · for Nu Valorem',
    color: '#9be27a', category: 'keys',
    live: { naturalDecay: true, release: (p) => p.release }, sampleInstrument: true,
    params,
    voice(ctx, destination, note, p) { return createValoremVoice(ctx, destination, { id: 'starter' }, defaultInstrumentConfig('valorem'), note, p); },
    ui: {
      theme: { accent: '#9be27a', lcd: '#e2f9d6', lcdBg: '#0c160a', edge: '#35512b', bg: '#132010' },
      logo: ['ji', 'VALOREM'],
      sub: 'LAYERED SAMPLE INSTRUMENT · FOR NU VALOREM',
      cc: { 74: 'cutoff', 71: 'reso', 73: 'attack', 72: 'release', 7: 'level', 1: 'bLevel' },
      sections: [
        layerSection('a'), layerSection('b'), layerSection('c'), layerSection('d'),
        { title: 'SHAPE', items: [{ type: 'xy', x: { key: 'cutoff', label: 'CUTOFF', fmt: 'hz' }, y: { key: 'bLevel', label: 'BLEND', fmt: 'pct' } }, { type: 'row', items: [knob('reso', 'RESO', 'num1'), knob('fEnv', 'ENV', 'num1'), knob('fDecay', 'F.DECAY', 'ms'), knob('drive', 'DRIVE', 'pct')] }, { type: 'row', items: [knob('width', 'SPREAD', 'pct'), knob('start', 'START', 'ms'), knob('velocityCurve', 'VEL', 'num2')] }] },
        { title: 'AMP', items: [{ type: 'row', items: [
          { type: 'fader', key: 'attack', label: 'A', fmt: 'ms' },
          { type: 'fader', key: 'decay', label: 'D', fmt: 'ms' },
          { type: 'fader', key: 'sustain', label: 'S', fmt: 'pct' },
          { type: 'fader', key: 'release', label: 'R', fmt: 'ms' },
          { type: 'fader', key: 'level', label: 'LEVEL', fmt: 'pct', rand: false }
        ] }] }
      ],
      adsr: { a: 'attack', d: 'decay', s: 'sustain', r: 'release' }
    },
    presets: [
      { name: 'Indie Keys', params: {} },
      { name: 'Felt Piano', params: { bType: 'off', cutoff: 3200, velocityCurve: 1.4, release: 0.6 } },
      { name: 'Crunch Guitar', params: { aType: 'guitar', bType: 'off', drive: 0.55, cutoff: 6000, release: 0.25 } },
      { name: 'Warm Strings', params: { aType: 'strings', bType: 'pad', bLevel: 0.25, attack: 0.25, release: 1.2, cutoff: 7000 } },
      { name: 'Air Choir', params: { aType: 'choir', bType: 'pad', bLevel: 0.2, attack: 0.3, release: 1.4, width: 0.8 } },
      { name: 'Pop Pluck Layer', params: { aType: 'pluck', bType: 'bell', bLevel: 0.25, bTune: 12, fEnv: 1.5, fDecay: 0.25, cutoff: 4000, release: 0.3 } },
      { name: 'Piano + Pad', params: { bLevel: 0.45, cType: 'strings', cLevel: 0.2, cTune: 0, release: 0.9 } },
      { name: 'Lo-fi Keys', params: { bType: 'off', cutoff: 1800, reso: 1.6, drive: 0.35, start: 0.015, release: 0.35 } }
    ],
    lines: [
      { name: 'Indie progression', dsl: '0:C3:16:92 0:G3:16:84 0:E4:16:88 16:A2:16:92 16:E3:16:84 16:C4:16:88 32:F2:16:92 32:C3:16:84 32:A3:16:88 48:G2:16:92 48:D3:16:84 48:B3:16:88' },
      { name: 'Piano ballad', dsl: '0:C3:8:80 4:G3:4:64 8:E4:8:76 16:A2:8:80 20:E3:4:64 24:C4:8:76 32:F2:8:80 36:C3:4:64 40:A3:8:76 48:G2:8:80 52:D3:4:64 56:B3:8:76' },
      { name: 'Pluck hook', dsl: '0:E4:2:110 2:G4:2:96 4:A4:2:104 6:G4:2:92 8:E4:4:108 12:D4:4:96 16:C4:2:110 18:D4:2:96 20:E4:4:104 24:G4:8:100' },
      { name: 'String swell', dsl: '0:C3:32:70 0:G3:32:70 0:E4:32:76 32:F3:32:70 32:A3:32:70 32:C4:32:76' }
    ],
    starterDescription: 'Original modelled starter pack (keys, pluck, guitar, strings, pad, choir, bell), rendered in code. It is not a recording. Add your own key/velocity zones to play a custom pack on layer A.'
  }
};

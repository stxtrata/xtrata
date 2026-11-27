// ELEMENT — multi-frame wavetable synth (a nod to Lost Element, Marek's prog alias).
// Six frames per table are generated in the time domain, warped (bend, mirror, sync, fold,
// squash), and turned into band-limited periodic waves. A note scans from a start to an end
// position: each frame's oscillator gets an exact piecewise-linear gain curve, so the sweep is
// a phase-coherent interpolation between neighbouring frames, as in a hardware wavetable.
import { nativeNote, range } from '../performance-voice.js';
import { select, cachedLru, spread, bodyStage, cutoffEnvelope, noiseBuffer } from '../marek-kit.js';

export const ELEMENT_TABLES = ['analog', 'formant', 'digital', 'glass', 'growl', 'organ'];
export const ELEMENT_WARPS = ['none', 'bend', 'mirror', 'sync', 'fold', 'squash'];
const FRAMES = 6, N = 512, H = 64;

const params = [
  select('table', 'Wavetable', ELEMENT_TABLES, 'analog'),
  range('posStart', 'Start position', 0, 1, 0.01, 0.1),
  range('posEnd', 'End position', 0, 1, 0.01, 0.62),
  range('posTime', 'Scan time', 0.01, 6, 0.01, 1.6),
  select('warp', 'Warp mode', ELEMENT_WARPS, 'none'),
  range('warpAmt', 'Warp amount', 0, 1, 0.01, 0.35),
  range('voices', 'Unison voices', 1, 4, 1, 2),
  range('detune', 'Unison detune (cents)', 0, 40, 0.5, 9),
  range('width', 'Stereo width', 0, 1, 0.01, 0.6),
  range('sub', 'Sub sine', 0, 1, 0.01, 0.15),
  range('noise', 'Noise', 0, 1, 0.01, 0),
  select('filterType', 'Filter type', ['lp12', 'lp24', 'hp', 'bp'], 'lp12'),
  range('cutoff', 'Cutoff (Hz)', 40, 18000, 1, 6500),
  range('reso', 'Resonance', 0.3, 14, 0.1, 1.2),
  range('fEnv', 'Filter envelope (oct)', 0, 6, 0.05, 1),
  range('fDecay', 'Filter decay', 0.01, 3, 0.01, 0.6),
  range('decay', 'Decay', 0.01, 3, 0.01, 0.8),
  range('sustain', 'Sustain', 0, 1, 0.01, 0.75),
  range('attack', 'Attack', 0.002, 1.5, 0.001, 0.01),
  range('release', 'Release', 0.02, 2.5, 0.01, 0.45),
  range('level', 'Level', 0, 1, 0.01, 0.75)
];

// ---------------------------------------------------------------- table generation
const tri = (p) => 1 - 4 * Math.abs(p - 0.5);
const saw = (p) => 2 * p - 1;
const sqr = (p) => (p < 0.5 ? 1 : -1);
const gauss = (k, c, w) => Math.exp(-((k - c) ** 2) / (2 * w * w));
function additive(amp, p) {
  let v = 0;
  for (let k = 1; k < amp.length; k++) if (amp[k]) v += amp[k] * Math.sin(2 * Math.PI * k * p);
  return v;
}
const ampCache = new Map();
function amps(key, fill) {
  if (!ampCache.has(key)) { const a = new Float32Array(48); fill(a); ampCache.set(key, a); }
  return ampCache.get(key);
}
function shapeAt(table, x, p) {
  if (table === 'analog') {
    // Every shape is shifted so its fundamental is in sine phase; otherwise neighbouring
    // frames partly cancel and the fundamental dips mid-scan.
    const wrap = (q) => q - Math.floor(q);
    const seq = [(q) => Math.sin(2 * Math.PI * q), (q) => tri(wrap(q + 0.25)), (q) => saw(wrap(q + 0.5)), sqr, (q) => { const u = wrap(q - 0.16); return u < 0.18 ? 1 : -0.22; }];
    const s = x * 4, i = Math.min(3, Math.floor(s)), f = s - i;
    const a = seq[i](p), b = seq[i + 1](p);
    return a * (1 - f) + b * f;
  }
  if (table === 'formant') {
    const c1 = 2 + x * 7, c2 = 8 + x * 16;
    return additive(amps(`f${x}`, (a) => { for (let k = 1; k < a.length; k++) a[k] = gauss(k, c1, 1.6) + 0.55 * gauss(k, c2, 2.8) + 0.12 / k; }), p);
  }
  if (table === 'digital') {
    const d = 1 + x * 7;
    return additive(amps(`d${x}`, (a) => { for (let k = 1; k < a.length; k++) a[k] = (0.5 + 0.5 * Math.cos((2 * Math.PI * k * d) / 16)) / k; }), p);
  }
  if (table === 'glass') {
    const ks = [1, 3 + Math.round(x * 4), 7 + Math.round(x * 9), 13 + Math.round(x * 15), 22 + Math.round(x * 20)];
    return additive(amps(`g${x}`, (a) => ks.forEach((k, i) => { if (k < a.length) a[k] += 1 / (1 + i * 1.3); })), p);
  }
  if (table === 'growl') {
    const s = Math.sin(2 * Math.PI * p), k = 1 + x * 6;
    return Math.tanh(k * s + x * 1.4 * Math.sin(4 * Math.PI * p + 1) + x * 0.6 * saw(p)) / Math.tanh(k + 0.4);
  }
  // organ: drawbar registrations slide from flute to full
  const bars = [[1, 0.6, 0, 0, 0, 0], [1, 0.8, 0.5, 0.2, 0, 0], [1, 0.9, 0.7, 0.6, 0.3, 0.1], [0.8, 1, 0.8, 0.8, 0.6, 0.4], [0.6, 0.9, 1, 0.9, 0.9, 0.8], [0.5, 0.7, 0.9, 1, 1, 1]];
  const s = x * 5, i = Math.min(4, Math.floor(s)), f = s - i;
  const h = [1, 2, 3, 4, 6, 8];
  let v = 0;
  for (let j = 0; j < 6; j++) v += ((bars[i][j] * (1 - f) + bars[i + 1][j] * f) * Math.sin(2 * Math.PI * h[j] * p)) / (1 + j * 0.25);
  return v;
}
function warpPhase(warp, a, p) {
  if (warp === 'bend') { const e = 1 + 3 * a; return p < 0.5 ? 0.5 * (2 * p) ** e : 1 - 0.5 * (2 * (1 - p)) ** e; }
  if (warp === 'mirror') { const m = p < 0.5 ? 2 * p : 2 - 2 * p; return p * (1 - a) + m * a; }
  if (warp === 'sync') { const r = 1 + a * 5, q = p * r; return q - Math.floor(q); }
  if (warp === 'squash') { const w = 0.5 - a * 0.45; return p < w ? (p / w) * 0.5 : 0.5 + ((p - w) / (1 - w)) * 0.5; }
  return p;
}
// Time-domain single cycle for (table, frame position, warp).
export function elementCycle(table, x, warp, amount, n = N) {
  const a = Math.max(0, Math.min(1, amount)), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let v = shapeAt(table, x, warpPhase(warp, a, i / n));
    if (warp === 'fold') v = Math.sin((Math.PI / 2) * v * (1 + a * 5));
    if (warp === 'sync') v *= 1 - 0.35 * a * (i / n);
    out[i] = v;
  }
  let mean = 0;
  for (const v of out) mean += v / n;
  for (let i = 0; i < n; i++) out[i] -= mean;
  return out;
}
const spectra = new Map();
function frameSpectra(table, warp, amount) {
  const a = warp === 'none' ? 0 : Math.round(amount * 20) / 20; // 21 steps keep the wave cache small
  const key = `${table}|${warp}|${a}`;
  if (!spectra.has(key)) {
    if (spectra.size > 64) spectra.delete(spectra.keys().next().value);
    spectra.set(key, Array.from({ length: FRAMES }, (_, f) => {
      const y = elementCycle(table, f / (FRAMES - 1), warp, a), real = new Float32Array(H), imag = new Float32Array(H);
      for (let k = 1; k < H; k++) {
        let re = 0, im = 0;
        for (let i = 0; i < N; i++) { const w = (2 * Math.PI * k * i) / N; re += y[i] * Math.cos(w); im += y[i] * Math.sin(w); }
        real[k] = (2 * re) / N; imag[k] = (2 * im) / N;
      }
      return { real, imag };
    }));
  }
  return { key, frames: spectra.get(key) };
}
function frameWave(ctx, table, warp, amount, f) {
  const { key, frames } = frameSpectra(table, warp, amount);
  return cachedLru(ctx, 'element', `${key}:${f}`, () => ctx.createPeriodicWave(frames[f].real, frames[f].imag), FRAMES * 24);
}

// Exact piecewise-linear gain schedule of frame f while the position moves start → end.
function scheduleFrame(param, f, time, p0, p1, span, resumeAt) {
  const w = (p) => Math.max(0, 1 - Math.abs(p * (FRAMES - 1) - f));
  const pos = (u) => p0 + (p1 - p0) * u;
  const marks = [0, 1];
  const lo = Math.min(p0, p1) * (FRAMES - 1), hi = Math.max(p0, p1) * (FRAMES - 1);
  for (let k = Math.ceil(lo); k <= Math.floor(hi); k++) if (p1 !== p0) marks.push((k / (FRAMES - 1) - p0) / (p1 - p0));
  const us = [...new Set(marks.filter((u) => u >= 0 && u <= 1))].sort((a, b) => a - b);
  // A rebuilt voice joins the scan at its true age instead of restarting it.
  const u0 = resumeAt != null && resumeAt > time ? Math.min(1, (resumeAt - time) / span) : 0;
  param.setValueAtTime(w(pos(u0)), time + u0 * span);
  for (const u of us) if (u > u0) param.linearRampToValueAtTime(w(pos(u)), time + u * span);
}

function voice(ctx, dest, note, patch) {
  const { P, time, frequency, amp, play, osc, bind } = nativeNote(ctx, dest, note, patch, params, 0.5);
  const vel = Math.max(0, Math.min(1, note.vel ?? 1));
  const p0 = Math.min(1, P.posStart + vel * 0.08), p1 = P.posEnd, span = Math.max(0.01, P.posTime);
  const lo = Math.min(p0, p1) * (FRAMES - 1), hi = Math.max(p0, p1) * (FRAMES - 1);
  const used = [];
  for (let f = Math.max(0, Math.floor(lo)); f <= Math.min(FRAMES - 1, Math.ceil(hi)); f++) used.push(f);
  // Filter
  const filters = [];
  const kind = P.filterType;
  const f1 = ctx.createBiquadFilter();
  f1.type = kind === 'hp' ? 'highpass' : kind === 'bp' ? 'bandpass' : 'lowpass';
  const nyq = ctx.sampleRate * 0.45;
  bind('reso', f1.Q, (v) => (kind === 'lp24' ? Math.max(0.3, v * 0.75) : v));
  bind('cutoff', f1.frequency, (v) => Math.min(nyq, v));
  cutoffEnvelope(f1, note, kind === 'hp' ? 0 : P.fEnv, P.fDecay);
  filters.push(f1);
  if (kind === 'lp24') {
    const f2 = ctx.createBiquadFilter();
    f2.type = 'lowpass'; f2.Q.setValueAtTime(0.54, time);
    bind('cutoff', f2.frequency, (v) => Math.min(nyq, v));
    cutoffEnvelope(f2, note, P.fEnv, P.fDecay);
    f1.connect(f2); filters.push(f2);
  }
  const body = bodyStage(ctx, note, P.attack, P.decay, P.sustain);
  filters.at(-1).connect(body).connect(amp);
  // Oscillators: every unison voice runs the used frames phase-coherently.
  const n = Math.max(1, Math.round(P.voices)), norm = 1 / Math.sqrt(n);
  for (const s of spread(n)) {
    const pan = ctx.createStereoPanner(), sum = ctx.createGain();
    pan.pan.setValueAtTime(s * P.width, time);
    sum.gain.setValueAtTime(norm, time);
    sum.connect(pan).connect(f1);
    for (const f of used) {
      const o = osc('sine', Math.min(ctx.sampleRate * 0.45, frequency));
      o.setPeriodicWave(frameWave(ctx, P.table, P.warp, P.warpAmt, f));
      o.detune.setValueAtTime(s * P.detune, time);
      const g = ctx.createGain();
      scheduleFrame(g.gain, f, time, p0, p1, span, note.resumeAt);
      o.connect(g).connect(sum);
      play(o);
    }
  }
  if (P.sub > 0) {
    const o = osc('sine', frequency / 2), g = ctx.createGain();
    g.gain.setValueAtTime(P.sub * 0.8, time);
    o.connect(g).connect(f1); play(o);
  }
  if (P.noise > 0) {
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = noiseBuffer(ctx); src.loop = true;
    g.gain.setValueAtTime(P.noise * 0.35, time);
    src.connect(g).connect(f1); play(src);
  }
}

const radio = (key, label, options) => ({ type: 'radio', key, label, options: options.map((v) => [v, v.toUpperCase()]) });
const knob = (key, label, fmt, extra = {}) => ({ type: 'knob', key, label, fmt, ...extra });

export const ELEMENT_SYNTHS = {
  element: {
    name: 'ELEMENT',
    tagline: 'Wavetable synth · six-frame tables scanned per note, five warp modes, unison',
    color: '#5fd4ff',
    params,
    voice,
    // Live display: the frame at the start position, warped, two cycles.
    scope: (P) => {
      const x = Math.round((P.posStart ?? 0.1) * (FRAMES - 1)) / (FRAMES - 1);
      const one = elementCycle(P.table || 'analog', x, P.warp || 'none', P.warpAmt ?? 0.35, 1024);
      const out = new Float32Array(2048);
      let peak = 1e-9;
      for (const v of one) peak = Math.max(peak, Math.abs(v));
      for (let i = 0; i < 2048; i++) out[i] = (one[i % 1024] / peak) * 0.62;
      return out;
    },
    ui: {
      theme: { accent: '#5fd4ff', lcd: '#c9f1ff', lcdBg: '#06141c', edge: '#21485a', bg: '#0d1d26' },
      logo: ['', 'ELEMENT'],
      sub: 'WAVETABLE SYNTHESIZER',
      cc: { 74: 'cutoff', 71: 'reso', 73: 'attack', 72: 'release', 7: 'level', 1: 'posEnd' },
      sections: [
        { title: 'WAVETABLE', items: [radio('table', 'Table', ELEMENT_TABLES), { type: 'viz', id: 'scope' }] },
        { title: 'SCAN', items: [{ type: 'xy', x: { key: 'posStart', label: 'START', fmt: 'pct' }, y: { key: 'posEnd', label: 'END', fmt: 'pct' } }, knob('posTime', 'TIME', 'ms')] },
        { title: 'WARP', items: [radio('warp', 'Warp', ELEMENT_WARPS), knob('warpAmt', 'AMOUNT', 'pct', { big: true })] },
        { title: 'UNISON & MIX', items: [{ type: 'row', items: [knob('voices', 'VOICES', 'int'), knob('detune', 'DETUNE', 'cents'), knob('width', 'WIDTH', 'pct')] }, { type: 'row', items: [knob('sub', 'SUB', 'pct'), knob('noise', 'NOISE', 'pct')] }] },
        { title: 'FILTER', items: [radio('filterType', 'Type', ['lp12', 'lp24', 'hp', 'bp']), { type: 'row', items: [knob('cutoff', 'CUTOFF', 'hz', { curve: 'log', big: true }), knob('reso', 'RESO', 'num1')] }, { type: 'row', items: [knob('fEnv', 'ENV', 'num1'), knob('fDecay', 'F.DECAY', 'ms')] }] },
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
      { name: 'Init Scan', params: {} },
      { name: 'Prog Pad', params: { table: 'formant', posStart: 0, posEnd: 1, posTime: 5.5, voices: 4, detune: 14, width: 1, attack: 0.6, decay: 2, sustain: 0.85, release: 1.8, cutoff: 4200, fEnv: 0.3 } },
      { name: 'Reese Bass', params: { table: 'analog', posStart: 0.5, posEnd: 0.5, voices: 4, detune: 22, width: 0.35, sub: 0.45, cutoff: 900, reso: 2, fEnv: 1.2, fDecay: 0.6, filterType: 'lp24', release: 0.2 } },
      { name: 'Growl', params: { table: 'growl', posStart: 0.2, posEnd: 1, posTime: 0.45, warp: 'fold', warpAmt: 0.45, voices: 2, detune: 7, cutoff: 2600, reso: 4, fEnv: 2.2, fDecay: 0.3, sub: 0.35, filterType: 'lp24' } },
      { name: 'Glass Pluck', params: { table: 'glass', posStart: 0.8, posEnd: 0.1, posTime: 0.35, voices: 1, cutoff: 7000, fEnv: 1.5, fDecay: 0.2, decay: 0.45, sustain: 0, release: 0.5, sub: 0 } },
      { name: 'Formant Lead', params: { table: 'formant', posStart: 0.15, posEnd: 0.9, posTime: 0.9, warp: 'bend', warpAmt: 0.4, voices: 2, detune: 6, cutoff: 5200, attack: 0.02 } },
      { name: 'Sync Lead', params: { table: 'analog', posStart: 0.5, posEnd: 0.55, warp: 'sync', warpAmt: 0.15, voices: 3, detune: 11, cutoff: 9000, fEnv: 0.6 } },
      { name: 'Digital Organ', params: { table: 'organ', posStart: 0.3, posEnd: 0.8, posTime: 2.5, warp: 'squash', warpAmt: 0.25, voices: 1, sub: 0, cutoff: 12000, fEnv: 0, attack: 0.005, sustain: 1, release: 0.15 } }
    ],
    lines: [
      { name: 'Prog arp (Dm)', dsl: '0:D4:2:104 2:A4:2:84 4:F4:2:96 6:A4:2:80 8:D4:2:104 10:C5:2:84 12:A4:2:96 14:F4:2:80 16:Bb3:2:104 18:F4:2:84 20:D4:2:96 22:F4:2:80 24:C4:2:104 26:G4:2:84 28:E4:2:96 30:G4:2:80' },
      { name: 'Reese bassline', dsl: '0:D2:6:110 8:D2:4:100 12:F2:4:104 16:Bb1:8:110 24:C2:8:104' },
      { name: 'Pad chords', dsl: '0:D3:16:96 0:F3:16:90 0:A3:16:90 16:Bb2:16:96 16:D3:16:90 16:F3:16:90 32:F3:16:96 32:A3:16:90 32:C4:16:90 48:C3:16:96 48:E3:16:90 48:G3:16:90' },
      { name: 'Growl stabs', dsl: '0:D2:2:120 4:D2:1:100 6:F2:2:110 10:D2:2:120 14:C2:2:110 16:D2:2:120 20:A1:3:116 26:C2:4:110' }
    ]
  }
};

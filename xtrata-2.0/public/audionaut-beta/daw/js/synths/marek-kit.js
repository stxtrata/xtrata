// Shared building blocks for the Marek collection (jiMVREK, jiELEMENT, jiLOSTWAVE).
// Everything cached here belongs to the canonical AudioContext, never to a voice host.
import { canonicalContext } from './resources.js';

export const select = (key, label, options, def) => ({ key, label, type: 'select', options, def });
export const OSC_TYPES = { saw: 'sawtooth', square: 'square', triangle: 'triangle', sine: 'sine' };

const banks = new WeakMap();
function bank(ctx) {
  const owner = canonicalContext(ctx);
  if (!banks.has(owner)) banks.set(owner, new Map());
  return banks.get(owner);
}
export function cached(ctx, key, build) {
  const b = bank(ctx);
  if (!b.has(key)) b.set(key, build());
  return b.get(key);
}

// Band-limited pulse of the given duty cycle as a periodic wave (cosine series).
export function pulseWave(ctx, duty = 0.25) {
  const width = Math.round(duty * 100) / 100;
  return cached(ctx, `pulse:${width}`, () => {
    const real = new Float32Array(97), imag = new Float32Array(97);
    for (let k = 1; k < real.length; k++) real[k] = (2 * Math.sin(Math.PI * k * width)) / (Math.PI * k);
    return ctx.createPeriodicWave(real, imag);
  });
}

// Harmonic arrays (sine coefficients at index k) to a periodic wave, cached by key.
export function harmonicWave(ctx, key, imag, real = new Float32Array(imag.length)) {
  return cached(ctx, `wave:${key}`, () => ctx.createPeriodicWave(real, imag, { disableNormalization: false }));
}

// Applies an oscillator choice. Returns the oscillator (already pitched/marked).
export function shapeOsc(ctx, o, wave) {
  if (wave === 'pulse') o.setPeriodicWave(pulseWave(ctx, 0.25));
  else o.type = OSC_TYPES[wave] || 'sawtooth';
  return o;
}

// Symmetric unison spread: n values from -1 to 1 (0 for a single voice).
export function spread(n) {
  if (n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => (i / (n - 1)) * 2 - 1);
}

// Decay to sustain after the attack, on a gain stage that sits after the host envelope.
// The host envelope (performance-voice) owns attack and release; this adds the D and S.
export function bodyStage(ctx, time, attack, decay, sustain, gate) {
  const g = ctx.createGain();
  const s = Math.max(0, Math.min(1, sustain));
  g.gain.setValueAtTime(1, time);
  const from = time + Math.max(0.001, attack);
  if (gate > attack && s < 1) {
    g.gain.setValueAtTime(1, from);
    g.gain.setTargetAtTime(s, from, Math.max(0.005, decay) / 3);
  } else if (!Number.isFinite(gate) && s < 1) {
    g.gain.setValueAtTime(1, from);
    g.gain.setTargetAtTime(s, from, Math.max(0.005, decay) / 3);
  }
  return g;
}

// A filter-cutoff envelope: starts envOct octaves above the base and falls back.
export function cutoffEnvelope(ctx, param, time, base, envOct, decay) {
  const nyq = ctx.sampleRate * 0.45;
  const lo = Math.min(nyq, Math.max(20, base));
  const peak = Math.min(nyq, lo * 2 ** Math.max(0, envOct));
  param.setValueAtTime(peak, time);
  if (peak > lo) param.setTargetAtTime(lo, time + 0.001, Math.max(0.004, decay) / 3);
}

// tanh drive curve with roughly constant loudness; null for no drive (exact pass-through).
export function driveCurve(ctx, amount) {
  const a = Math.round(Math.max(0, Math.min(1, amount)) * 50) / 50;
  if (a <= 0) return null;
  return cached(ctx, `drive:${a}`, () => {
    const k = 1 + a * 9, c = new Float32Array(1025), norm = Math.tanh(k);
    for (let i = 0; i < c.length; i++) {
      const x = i / 512 - 1;
      c[i] = Math.tanh(x * k) / norm;
    }
    return c;
  });
}

// Seeded white noise, two seconds, looped by the caller.
export function noiseBuffer(ctx) {
  return cached(ctx, 'noise', () => {
    const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 2), ctx.sampleRate), d = b.getChannelData(0);
    let s = 0x9e3779b9;
    for (let i = 0; i < d.length; i++) {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      d[i] = ((s >>> 0) / 4294967296) * 2 - 1;
    }
    return b;
  });
}

// Trance gate patterns (16 steps). 1 = open.
export const GATE_PATTERNS = {
  straight: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  offbeat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  anthem: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
  rolling: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
  dotted: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  stutter: [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0]
};
export const GATE_RATES = { '1/8': 0.5, '1/16': 0.25, '1/32': 0.125 };

// One loop of a 16-step gate as a control buffer (0..1, 3 ms open, 10 ms close).
export function gateBuffer(ctx, bpm, rate, pattern) {
  const tempo = Math.max(20, Math.min(420, Number(bpm) || 128));
  const beats = GATE_RATES[rate] ?? 0.25, steps = GATE_PATTERNS[pattern] || GATE_PATTERNS.straight;
  return cached(ctx, `gate:${tempo}:${beats}:${pattern}`, () => {
    const sr = ctx.sampleRate, step = (60 / tempo) * beats, per = Math.max(32, Math.round(step * sr));
    const b = ctx.createBuffer(1, per * 16, sr), d = b.getChannelData(0);
    const rise = Math.max(1, Math.round(0.003 * sr)), fall = Math.max(1, Math.min(per / 2, Math.round(0.01 * sr)));
    for (let s = 0; s < 16; s++) {
      if (!steps[s]) continue;
      const nextOpen = steps[(s + 1) % 16];
      for (let j = 0; j < per; j++) {
        let v = Math.min(1, j / rise);
        if (!nextOpen && j > per - fall) v *= (per - j) / fall;
        d[s * per + j] = v;
      }
    }
    return b;
  });
}

// Classic wavetable-style visual for a scope: n samples of one waveform shape over 2 cycles.
export function cyclesFromHarmonics(imag, n = 2048, cycles = 2) {
  const out = new Float32Array(n);
  let peak = 1e-9;
  for (let i = 0; i < n; i++) {
    const ph = (2 * Math.PI * cycles * i) / n;
    let v = 0;
    for (let k = 1; k < imag.length; k++) if (imag[k]) v += imag[k] * Math.sin(k * ph);
    out[i] = v;
    peak = Math.max(peak, Math.abs(v));
  }
  for (let i = 0; i < n; i++) out[i] = (out[i] / peak) * 0.62;
  return out;
}

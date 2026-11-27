// Shared building blocks for the Marek collection (MAVREKT, ELEMENT, LOSTWAVE).
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
// Bounded variant for families with many possible keys (waves per warp amount, gate buffers per
// tempo): least-recently-used entries are dropped. Sounding nodes keep their own references.
export function cachedLru(ctx, group, key, build, max) {
  const b = bank(ctx), id = `lru:${group}`;
  if (!b.has(id)) b.set(id, new Map());
  const m = b.get(id);
  if (m.has(key)) { const v = m.get(key); m.delete(key); m.set(key, v); return v; }
  const v = build();
  m.set(key, v);
  while (m.size > max) m.delete(m.keys().next().value);
  return v;
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

// A voice rebuilt mid-note (an unbound control changed) keeps note.time and gets note.resumeAt.
// Web Audio clamps events scheduled in the past to "now", which would restart every envelope.
// decayTo() schedules an exponential approach from its true age instead.
export function decayTo(param, from, to, start, seconds, resumeAt) {
  const tau = Math.max(0.004, seconds) / 3;
  if (resumeAt != null && resumeAt > start) {
    param.setValueAtTime(to + (from - to) * Math.exp(-(resumeAt - start) / tau), resumeAt);
    if (from !== to) param.setTargetAtTime(to, resumeAt, tau);
    return;
  }
  param.setValueAtTime(from, start);
  if (from !== to) param.setTargetAtTime(to, start, tau);
}

// Decay to sustain after the attack, on a gain stage that sits after the host envelope.
// The host envelope (performance-voice) owns attack and release; this adds the D and S.
export function bodyStage(ctx, note, attack, decay, sustain) {
  const g = ctx.createGain(), s = Math.max(0, Math.min(1, sustain));
  decayTo(g.gain, 1, s, note.time + Math.max(0.001, attack), decay, note.resumeAt);
  return g;
}

// Filter-cutoff envelope on the filter's detune (cents): starts envOct octaves above the cutoff
// and falls back to it. The cutoff itself stays on `frequency`, so it can be bound and moved live.
export function cutoffEnvelope(filter, note, envOct, decay) {
  decayTo(filter.detune, Math.max(0, envOct) * 1200, 0, note.time, decay, note.resumeAt);
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
  return cachedLru(ctx, 'gate', `${tempo}:${beats}:${pattern}`, () => {
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
  }, 6);
}

// synths/wave/morph.js — jiMORPH: wavetable morph + phase-distortion tables + West-Coast fold (Audionaut synth module).
//
// A different kind of oscillator from everything else in the bank: the sound is a WAVE that moves.
//   * TABLES: twelve single-cycle waves built in code (sine, saw, pulse, square, three Casio-CZ style
//     phase-distortion resonances, two vowel formant waves, drawbar-organ stack, comb, random spectrum).
//     Pick table A and table B; MORPH crossfades equal-power from A to B during the note
//     (start position, end position, glide time) and a MORPH WOBBLE LFO keeps it moving.
//   * WAVEFOLDER (West Coast): a sine-fold transfer curve. FOLD sets how hard the wave is folded;
//     FOLD ENV adds a decaying spike of extra folding at the strike (the "lighting up" of a Buchla voice)
//   * FM: a sine modulator at a chosen ratio, index decaying with the MOD DECAY
//   * LOW-PASS GATE: one decaying envelope opens filter and amplitude together (LPG), then the amp ADSR
//   * UNISON: a second morphing pair detuned against the first
// Tables are computed once (DFT of the time-domain definition) and cached as PeriodicWaves per context.
// Per-note node graph (~25 nodes), fully self-cleaning. Plain ES module, no imports.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001;
const GAIN = 0.24; // master voice scale (calibrated against the harness RMS band)
const HARMS = 48;
const FOLD_N = 5; // fold curve: sin(x * pi/2 * FOLD_N)

// ---- table definitions: name -> time-domain fn(phase 0..1) or {harm: n => amp}
const TWO_PI = Math.PI * 2;
const gauss = (n, c, w) => Math.exp(-((n - c) * (n - c)) / (2 * w * w));
const rnd = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const rr = rnd(9137);
const RANDOM_AMP = Array.from({ length: HARMS + 1 }, (_, n) => (n === 1 ? 1 : (0.25 + 0.75 * rr()) / Math.pow(Math.max(1, n), 0.8)));
const pd = (k) => (ph) => (1 - ph) * Math.cos(TWO_PI * k * ph); // CZ-style resonant saw: window x resonance cosine

const TABLES = {
  sine: { td: (ph) => Math.sin(TWO_PI * ph) },
  saw: { harm: (n) => 1 / n },
  pulse: { td: (ph) => (ph < 0.25 ? 1 : -1) },
  square: { harm: (n) => (n % 2 ? 1 / n : 0) },
  pdLow: { td: pd(2.6) },
  pdMid: { td: pd(6.4) },
  pdHigh: { td: pd(13.5) },
  ah: { harm: (n) => (n === 1 ? 1 : 0.15) * 0 + (n === 1 ? 0.8 : 0) + 1.1 * gauss(n, 5, 1.6) + 0.8 * gauss(n, 9, 2) + 0.3 / n },
  oo: { harm: (n) => (n === 1 ? 1 : 0) + 1.0 * gauss(n, 2, 0.9) + 0.35 * gauss(n, 4, 1.2) },
  organ: { harm: (n) => ({ 1: 1, 2: 0.8, 3: 0.65, 4: 0.5, 6: 0.4, 8: 0.3 }[n] || 0) },
  comb: { harm: (n) => (n === 1 ? 1 : n % 3 === 0 ? 0.9 / Math.sqrt(n) : 0.12 / n) },
  random: { harm: (n) => RANDOM_AMP[n] || 0 },
};
const TABLE_NAMES = Object.keys(TABLES);

// coefficient cache (module-level, immutable): name -> {re, im}
const coefCache = new Map();
function coefs(name) {
  let c = coefCache.get(name);
  if (c) return c;
  const def = TABLES[name] || TABLES.sine;
  const re = new Float32Array(HARMS + 1);
  const im = new Float32Array(HARMS + 1);
  if (def.harm) {
    for (let n = 1; n <= HARMS; n++) im[n] = def.harm(n);
  } else {
    const N = 1024;
    const w = new Float64Array(N);
    let mean = 0;
    for (let i = 0; i < N; i++) {
      w[i] = def.td(i / N);
      mean += w[i];
    }
    mean /= N;
    for (let k = 1; k <= HARMS; k++) {
      let a = 0;
      let b = 0;
      for (let i = 0; i < N; i++) {
        const x = w[i] - mean;
        a += x * Math.cos((TWO_PI * k * i) / N);
        b += x * Math.sin((TWO_PI * k * i) / N);
      }
      // gentle high-end roll-off (Lanczos-ish) so jagged tables don't alias at the top
      const sigma = Math.sin((Math.PI * k) / (HARMS + 1)) / ((Math.PI * k) / (HARMS + 1));
      re[k] = ((2 * a) / N) * sigma;
      im[k] = ((2 * b) / N) * sigma;
    }
  }
  c = { re, im };
  coefCache.set(name, c);
  return c;
}
const waveCache = new WeakMap();
function tableWave(ctx, name) {
  let m = waveCache.get(ctx);
  if (!m) {
    m = new Map();
    waveCache.set(ctx, m);
  }
  let w = m.get(name);
  if (!w) {
    const c = coefs(name);
    w = ctx.createPeriodicWave(c.re, c.im, { disableNormalization: false });
    m.set(name, w);
  }
  return w;
}

// ---- shaper curves
let foldCurveC = null;
function foldCurve() {
  if (!foldCurveC) {
    const n = 2049;
    foldCurveC = new Float32Array(n);
    for (let i = 0; i < n; i++) foldCurveC[i] = Math.sin(((i * 2) / (n - 1) - 1) * (Math.PI / 2) * FOLD_N);
  }
  return foldCurveC;
}
let clipCurve = null;
function safetyCurve() {
  if (!clipCurve) {
    const n = 513;
    clipCurve = new Float32Array(n);
    for (let i = 0; i < n; i++) clipCurve[i] = Math.tanh((i * 2) / (n - 1) - 1);
  }
  return clipCurve;
}

const paramDefs = [
  { key: "tableA", label: "Table A", type: "select", def: "pdMid", options: TABLE_NAMES },
  { key: "tableB", label: "Table B", type: "select", def: "saw", options: TABLE_NAMES },
  { key: "morph", label: "Morph Start (A -> B)", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "morphEnd", label: "Morph End", type: "range", min: 0, max: 1, step: 0.01, def: 1 },
  { key: "morphTime", label: "Morph Time", type: "range", min: 0.02, max: 4, step: 0.01, def: 0.9 },
  { key: "wobble", label: "Morph Wobble", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "wobbleRate", label: "Wobble Rate (Hz)", type: "range", min: 0.1, max: 12, step: 0.1, def: 3 },
  { key: "fold", label: "Fold", type: "range", min: 0, max: 1, step: 0.01, def: 0.25 },
  { key: "foldEnv", label: "Fold Env (strike)", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "fmRatio", label: "FM Ratio", type: "select", def: "2", options: ["0.5", "1", "2", "3", "4", "7"] },
  { key: "fmIndex", label: "FM Index", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "modDecay", label: "Mod Decay (fold / FM / LPG)", type: "range", min: 0.03, max: 3, step: 0.01, def: 0.5 },
  { key: "unison", label: "Unison Detune (cents)", type: "range", min: 0, max: 40, step: 0.5, def: 8 },
  { key: "cutoff", label: "Cutoff", type: "range", min: 150, max: 16000, step: 10, def: 3000 },
  { key: "reso", label: "Resonance", type: "range", min: 0, max: 14, step: 0.1, def: 1.5 },
  { key: "lpg", label: "LPG Amount", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "attack", label: "Attack", type: "range", min: 0.002, max: 2, step: 0.002, def: 0.01 },
  { key: "decay", label: "Decay", type: "range", min: 0.02, max: 3, step: 0.01, def: 0.6 },
  { key: "sustain", label: "Sustain", type: "range", min: 0, max: 1, step: 0.01, def: 0.55 },
  { key: "release", label: "Release", type: "range", min: 0.02, max: 3, step: 0.01, def: 0.35 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

// equal-power crossfade curves for the morph (A falls, B rises), `n` points
function morphCurves(m0, m1, n) {
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const s = i / (n - 1);
    const e = s * s * (3 - 2 * s); // smoothstep glide
    const m = m0 + (m1 - m0) * e;
    a[i] = Math.cos((Math.PI / 2) * m);
    b[i] = Math.sin((Math.PI / 2) * m);
  }
  return [a, b];
}

function morphVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const vq = Math.min(v, 1.4);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);
  const A = Math.max(0.002, P.attack);
  const D = Math.max(0.02, P.decay);
  const R = Math.max(0.02, P.release);
  const stopAt = time + gate + R + 0.1;

  const nodes = [];
  const sources = [];
  const track = (n) => {
    nodes.push(n);
    return n;
  };

  // ---------- oscillator pairs (A/B tables), unison = second pair detuned the other way
  const waveA = tableWave(ctx, P.tableA);
  const waveB = tableWave(ctx, P.tableB);
  const mix = track(ctx.createGain());
  const pairs = P.unison > 0.4 ? 2 : 1;
  mix.gain.value = 0.8 / pairs;
  const morphGains = []; // [gainA, gainB] per pair
  const freqParams = [];
  const mt = Math.max(0.02, P.morphTime);
  const [curveA, curveB] = morphCurves(P.morph, P.morphEnd, 32);
  for (let p = 0; p < pairs; p++) {
    const cents = pairs === 1 ? 0 : (p === 0 ? -1 : 1) * P.unison * 0.5;
    const gA = track(ctx.createGain());
    const gB = track(ctx.createGain());
    gA.gain.setValueAtTime(curveA[0], time);
    gB.gain.setValueAtTime(curveB[0], time);
    if (Math.abs(P.morphEnd - P.morph) > 0.001) {
      gA.gain.setValueCurveAtTime(curveA, time, mt);
      gB.gain.setValueCurveAtTime(curveB, time, mt);
    }
    for (const [w, g] of [[waveA, gA], [waveB, gB]]) {
      const o = ctx.createOscillator();
      o.setPeriodicWave(w);
      o.frequency.setValueAtTime(f0, time);
      o.detune.setValueAtTime(cents, time);
      o.connect(g);
      sources.push(o);
      track(o);
      freqParams.push(o.frequency);
    }
    gA.connect(mix);
    gB.connect(mix);
    morphGains.push(gA, gB);
  }

  // morph wobble: LFO pushes A up while pushing B down (and vice versa)
  if (P.wobble > 0.01) {
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(P.wobbleRate, time);
    const up = track(ctx.createGain());
    const down = track(ctx.createGain());
    up.gain.value = 0.5 * P.wobble;
    down.gain.value = -0.5 * P.wobble;
    lfo.connect(up);
    lfo.connect(down);
    for (let i = 0; i < morphGains.length; i += 2) {
      up.connect(morphGains[i].gain); // A
      down.connect(morphGains[i + 1].gain); // B
    }
    sources.push(lfo);
    track(lfo);
  }

  // FM: sine modulator into every oscillator's frequency, index decays with MOD DECAY
  if (P.fmIndex > 0.01) {
    const ratio = parseFloat(P.fmRatio) || 2;
    const mod = ctx.createOscillator();
    mod.type = "sine";
    mod.frequency.setValueAtTime(f0 * ratio, time);
    const mg = track(ctx.createGain());
    const beta = P.fmIndex * 5 * (0.5 + 0.5 * vq);
    const g0 = beta * f0 * ratio;
    mg.gain.setValueAtTime(g0, time);
    mg.gain.setTargetAtTime(g0 * 0.18, time, Math.max(0.01, P.modDecay / 3));
    mod.connect(mg);
    for (const fp of freqParams) mg.connect(fp);
    sources.push(mod);
    track(mod);
  }

  // ---------- wavefolder (g: pre-gain into the sine-fold curve; extra spike at the strike)
  const pre = track(ctx.createGain());
  const gEnd = 0.2 + 0.8 * P.fold;
  const gStart = clamp(gEnd + P.foldEnv * (1 - gEnd) * (0.6 + 0.4 * vq), gEnd, 1);
  pre.gain.setValueAtTime(gStart, time);
  if (gStart > gEnd + 0.001) pre.gain.setTargetAtTime(gEnd, time, Math.max(0.01, P.modDecay / 3));
  else pre.gain.setValueAtTime(gEnd, time);
  mix.connect(pre);
  const folder = track(ctx.createWaveShaper());
  folder.curve = foldCurve();
  folder.oversample = "2x";
  pre.connect(folder);

  // ---------- low-pass gate: filter opens with the same decaying envelope
  const lp = track(ctx.createBiquadFilter());
  lp.type = "lowpass";
  lp.Q.value = P.reso;
  const kt = Math.pow(2, ((pitch - 60) / 12) * 0.5);
  const base = clamp(P.cutoff * kt, 100, 18000);
  const open = clamp(base * (1 + P.lpg * 7 * (0.5 + 0.5 * vq)), base, 19000);
  lp.frequency.setValueAtTime(open, time);
  if (open > base * 1.001) lp.frequency.setTargetAtTime(base, time, Math.max(0.01, P.modDecay / 3));
  folder.connect(lp);

  // ---------- amp ADSR (exp), then safety clip
  const amp = track(ctx.createGain());
  const top = Math.max(FLOOR, v * GAIN * P.level);
  const sus = Math.max(FLOOR, top * P.sustain);
  amp.gain.setValueAtTime(0, time);
  const atk = gate < A ? gate : A;
  amp.gain.linearRampToValueAtTime(top * (atk / A), time + atk);
  let lvl = top * (atk / A);
  if (gate > A) {
    const dEnd = Math.min(gate, A + D);
    const frac = (dEnd - A) / D;
    lvl = top * Math.pow(sus / top, frac);
    amp.gain.exponentialRampToValueAtTime(Math.max(FLOOR, lvl), time + dEnd);
  }
  amp.gain.setValueAtTime(Math.max(FLOOR, lvl), time + gate);
  amp.gain.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  amp.gain.setValueAtTime(0, time + gate + R + 0.001);
  lp.connect(amp);
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  amp.connect(clip);
  clip.connect(dest);

  for (const s of sources) {
    s.start(time);
    s.stop(stopAt);
  }
  sources[0].onended = () => {
    try {
      for (const n of nodes) n.disconnect();
    } catch {
      /* already disconnected */
    }
  };
}

// JS model for the panel scope: one cycle of the (start-position) morph through the fold, tiled over 0.4 s of A3
function morphScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const cA = coefs(P.tableA);
  const cB = coefs(P.tableB);
  const L = 512;
  const cyc = new Float32Array(L);
  const wa = Math.cos((Math.PI / 2) * P.morph);
  const wb = Math.sin((Math.PI / 2) * P.morph);
  const g = 0.2 + 0.8 * P.fold;
  let pk = 1e-9;
  for (let i = 0; i < L; i++) {
    const ph = (TWO_PI * i) / L;
    let y = 0;
    for (let k = 1; k <= HARMS; k++) {
      const c = Math.cos(k * ph);
      const s = Math.sin(k * ph);
      y += wa * (cA.re[k] * c + cA.im[k] * s) + wb * (cB.re[k] * c + cB.im[k] * s);
    }
    cyc[i] = y;
    pk = Math.max(pk, Math.abs(y));
  }
  for (let i = 0; i < L; i++) cyc[i] = Math.sin((cyc[i] / pk) * 0.8 * g * (Math.PI / 2) * FOLD_N);
  const f0 = 220;
  for (let i = 0; i < N; i++) {
    const x = ((i / sr) * f0) % 1;
    out[i] = cyc[Math.floor(x * L) % L] * 0.85;
  }
  return out;
}

const svgs = {
  sine: '<path d="M2 12 C6 2 10 2 12 12 S18 22 22 12"/>',
  saw: '<path d="M2 18 L12 6 L12 18 L22 6"/>',
  pulse: '<path d="M2 18 V6 H8 V18 H22"/>',
  square: '<path d="M2 18 V6 H12 V18 H22 V6"/>',
  pdLow: '<path d="M2 18 C5 2 9 22 12 6 L22 18"/>',
  pdMid: '<path d="M2 12 C4 3 6 21 8 5 C9 17 10 8 12 14 L22 18"/>',
  pdHigh: '<path d="M2 12 C3 4 4 20 5 6 C6 18 7 8 8 15 C9 11 10 13 11 12 L22 12"/>',
  ah: '<path d="M2 12 C4 5 6 5 8 12 S12 19 14 8 S20 12 22 12"/>',
  oo: '<path d="M2 12 C6 4 10 4 12 12 S18 20 22 12"/>',
  organ: '<path d="M3 20 V8 M7 20 V5 M11 20 V12 M15 20 V9 M19 20 V14"/>',
  comb: '<path d="M3 20 V8 M6 20 V16 M9 20 V10 M12 20 V16 M15 20 V6 M18 20 V16 M21 20 V12"/>',
  random: '<path d="M2 12 L5 5 L8 17 L11 8 L14 19 L17 7 L22 14"/>',
};

const tableRadio = (key) => ({
  type: "radio",
  key,
  cls: "wave-btns",
  options: TABLE_NAMES.map((n) => [n, n.replace("pd", "PD ").toUpperCase(), svgs[n], "0 0 24 24"]),
});

const morph = {
  name: "jiMORPH",
  tagline: "Wavetable morph - phase-distortion tables, sine wavefolder, FM and a low-pass gate",
  color: "#9d7bff",
  params: paramDefs,
  voice: morphVoice,
  scope: morphScope,
  lines: [
    { name: "Morph Bass (Em)", dsl: "0:E2:3 4:E2:2:90 6:G2:2 8:B2:3:110 12:A2:2 14:G2:2:90 16:E2:3 20:E2:2:90 22:D3:2 24:B2:3:110 28:A2:2 30:G2:2:90" },
    { name: "Pluck Arp (Am)", dsl: "0:A3:2 2:C4:2 4:E4:2 6:A4:2 8:E4:2 10:C4:2 12:A3:2 14:C4:2:90 16:G3:2 18:B3:2 20:D4:2 22:G4:2 24:D4:2 26:B3:2 28:G3:2 30:B3:2:90" },
    { name: "Evolving Pad (Dm9)", dsl: "0:D3:30 0:F3:30 0:A3:30 0:C4:30 0:E4:30 32:Bb2:30 32:D3:30 32:F3:30 32:A3:30 32:C4:30" },
    { name: "Lead Line (G)", dsl: "0:G4:3 4:B4:2 6:D5:4 12:C5:2 14:B4:2 16:A4:3 20:F#4:2 22:G4:8 32:D5:3 36:E5:2 38:G5:4 44:F#5:2 46:E5:2 48:D5:4 52:B4:2 54:G4:8" },
  ],
  presets: [
    { name: "Init (PD to Saw)", params: {} },
    { name: "Resonant Sweep Lead", params: { tableA: "pdLow", tableB: "pdHigh", morph: 0, morphEnd: 1, morphTime: 1.4, wobble: 0, fold: 0.1, foldEnv: 0.2, unison: 10, cutoff: 6500, reso: 1.2, lpg: 0.2, attack: 0.02, decay: 0.8, sustain: 0.8, release: 0.3 } },
    { name: "Vowel Morph Pad", params: { tableA: "ah", tableB: "oo", morph: 0, morphEnd: 1, morphTime: 3, wobble: 0.3, wobbleRate: 0.4, fold: 0.1, foldEnv: 0, unison: 16, cutoff: 5000, reso: 0.8, lpg: 0, attack: 0.7, decay: 1.5, sustain: 0.9, release: 1.5 } },
    { name: "Buchla Pluck", params: { tableA: "sine", tableB: "sine", morph: 0, morphEnd: 0, fold: 0.7, foldEnv: 1, modDecay: 0.35, unison: 0, cutoff: 1800, reso: 3, lpg: 0.9, attack: 0.002, decay: 0.35, sustain: 0, release: 0.25, level: 1.5 } },
    { name: "Folded Bass", params: { tableA: "saw", tableB: "pulse", morph: 0.2, morphEnd: 0.6, morphTime: 0.5, fold: 0.85, foldEnv: 0.6, modDecay: 0.4, unison: 0, cutoff: 900, reso: 4, lpg: 0.5, attack: 0.004, decay: 0.5, sustain: 0.7, release: 0.18 } },
    { name: "FM Chime", params: { tableA: "sine", tableB: "organ", morph: 0.3, morphEnd: 0.3, fold: 0, foldEnv: 0, fmRatio: "3", fmIndex: 0.55, modDecay: 0.7, unison: 4, cutoff: 9000, reso: 0.7, lpg: 0.3, attack: 0.003, decay: 1.1, sustain: 0, release: 0.8, level: 1.5 } },
    { name: "Digital Wobble", params: { tableA: "comb", tableB: "random", morph: 0, morphEnd: 1, morphTime: 0.1, wobble: 0.8, wobbleRate: 5.5, fold: 0.4, foldEnv: 0.2, unison: 6, cutoff: 4500, reso: 2.5, lpg: 0.2, attack: 0.005, decay: 0.7, sustain: 0.75, release: 0.3 } },
    { name: "Hollow Keys", params: { tableA: "square", tableB: "organ", morph: 0.1, morphEnd: 0.9, morphTime: 0.25, fold: 0.2, foldEnv: 0.3, unison: 3, cutoff: 3600, reso: 1, lpg: 0.55, attack: 0.004, decay: 0.45, sustain: 0.25, release: 0.3 } },
  ],
  ui: {
    theme: { accent: "#9d7bff", lcd: "#ddd0ff", lcdBg: "#1b1530", edge: "#3a2f66", bg: "#150f26" },
    logo: ["ji", "MORPH"],
    sub: "WAVETABLE · PD · FOLD · FM · LPG",
    cc: { 74: "cutoff", 71: "reso", 73: "attack", 72: "release", 75: "morphEnd", 76: "fold", 77: "wobble", 78: "fmIndex", 7: "level" },
    sections: [
      {
        title: "TABLE A",
        cls: "mp-ta",
        items: [tableRadio("tableA")],
      },
      {
        title: "TABLE B",
        cls: "mp-tb",
        items: [tableRadio("tableB")],
      },
      {
        title: "MORPH",
        cls: "mp-morph",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "morph", label: "START", fmt: "pct", big: true },
              { type: "knob", key: "morphEnd", label: "END", fmt: "pct", big: true },
              { type: "knob", key: "morphTime", label: "TIME", fmt: "num2" },
              { type: "knob", key: "wobble", label: "WOBBLE", fmt: "pct" },
              { type: "knob", key: "wobbleRate", label: "W RATE", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "FOLD · FM",
        cls: "mp-fold",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "fold", label: "FOLD", fmt: "pct", big: true },
              { type: "knob", key: "foldEnv", label: "STRIKE", fmt: "pct" },
              { type: "knob", key: "fmIndex", label: "FM IDX", fmt: "pct" },
              { type: "knob", key: "modDecay", label: "MOD DEC", fmt: "num2" },
            ],
          },
          {
            type: "radio",
            key: "fmRatio",
            cls: "wave-btns",
            options: ["0.5", "1", "2", "3", "4", "7"].map((r) => [r, "×" + r, '<path d="M2 12 H22"/>', "0 0 24 24"]),
          },
        ],
      },
      {
        title: "LOW-PASS GATE",
        cls: "mp-lpg",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "cutoff", label: "CUTOFF", curve: "log", fmt: "hz", big: true },
              { type: "knob", key: "reso", label: "RESO", fmt: "num1" },
              { type: "knob", key: "lpg", label: "LPG", fmt: "pct" },
              { type: "knob", key: "unison", label: "UNISON", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "AMP ENVELOPE",
        cls: "mp-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms" },
              { type: "fader", key: "decay", label: "D", fmt: "ms" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-morph" },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
    scopeLabel: "WAVEFORM · A3",
  },
};

export const MORPH_SYNTHS = { morph };

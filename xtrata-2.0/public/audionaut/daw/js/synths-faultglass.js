// synths-faultglass.js — FAULTGLASS, "a fracture instrument" (port of the standalone GlassEngine).
//
// Seven sine "modes" (harmonics 1 2 3 4 6 8 10) share one FM modulator. A note starts as a
// clear, nearly pure core; over `bloom` seconds the upper modes fade up out of near-silence,
// slide from true harmonics to a warped (uneven) spacing, and FM stress + slow per-mode drift
// make the halo restless. A short tap therefore stays clean, a held note "unfolds" — the note
// length (dur) and velocity keep that meaning because the whole thing is per-note automation.
//
// Kept from the page: modes, shared FM, bloom opening + frequency slide, drift, Light lowpass,
// velocity -> upper-mode energy, ADSR, pitch-dependent pan, soft clip.
// Dropped (host FX): Space (convolver/echo), 25 Hz highpass, compressor, master. Dropped (live
// only): voice stealing, sustain pedal, mod wheel (== more Fracture/Drift), pitch bend,
// XY-pad gesture (== the Fracture/Light XY control). Turned per-note: Strain (a bend that
// relaxes into tune as the note blooms) and Touch (how strongly velocity drives the halo).
//
// Node graph per note (~25 nodes): fm osc, <=7 x (osc, gain[, fmGain]), env, lowpass,
// waveshaper, panner. No imports, no assets.

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const HARM = [1, 2, 3, 4, 6, 8, 10];
const OFFSET = [0, 0.014, 0.09, 0.71, 0.83, 1.49, 2.27]; // x warp, in units of f0
const WEIGHT = [1, 0.3, 0.2, 0.13, 0.105, 0.07, 0.045];
const NOTE_GAIN = 1.8; // calibrates default A3 into the host's 0.04-0.12 RMS window

// gentle tanh soft clip (shared, read-only); input is clamped to [-1,1] by the shaper
const CLIP = (() => {
  const c = new Float32Array(1025);
  for (let i = 0; i < c.length; i++) c[i] = 0.8 * Math.tanh(1.6 * ((i / 1024) * 2 - 1));
  return c;
})();

const params = [
  range("body", "Body", 0, 1, 0.01, 0.72),
  range("fracture", "Fracture", 0, 1, 0.01, 0.48),
  range("warp", "Warp", 0, 1, 0.005, 0.27),
  range("bloom", "Bloom", 0.05, 6, 0.01, 1.4),
  range("drift", "Drift", 0, 1, 0.01, 0.24),
  range("light", "Light", 0, 1, 0.01, 0.62),
  range("touch", "Touch", 0, 1, 0.01, 1),
  range("strain", "Strain", -2, 2, 0.05, 0),
  range("attack", "Attack", 0.003, 3, 0.001, 0.015),
  range("decay", "Decay", 0.05, 4, 0.01, 1.2),
  range("sustain", "Sustain", 0, 1, 0.01, 0.52),
  range("release", "Release", 0.04, 5, 0.01, 1.8),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

function voice(ctx, dest, { pitch, vel, time, dur }, P) {
  const t = time;
  const f = midiToFreq(pitch);
  const v = clamp(vel, 0, 1.4);
  const nyq = ctx.sampleRate * 0.39;
  const A = Math.max(0.003, P.attack);
  const D = Math.max(0.05, P.decay);
  const S = clamp(P.sustain, 0, 1);
  const R = Math.max(0.04, P.release);
  const B = Math.max(0.05, P.bloom);
  const g = Math.max(0.02, dur); // gate
  const T = g + R + 0.03; // everything stops here
  const stress = clamp(P.fracture, 0, 1);
  const warp = clamp(P.warp, 0, 1);
  const touch = clamp(P.touch, 0, 1);
  const vh = 1 - touch + touch * v; // velocity as the halo sees it
  const bend = Math.pow(2, (P.strain || 0) / 12);
  const strained = Math.abs(P.strain || 0) > 0.001;
  const settle = clamp(A + B * 0.12, 0.05, 1.5); // strain relaxes this fast

  // ---- amplitude envelope (linear, as the page) with the gate cutting it wherever it is
  const peak = 0.14 * Math.pow(v, 0.8) * NOTE_GAIN * P.level;
  const envAt = (a) => (a < A ? (peak * a) / A : a < A + D ? peak * (1 - (1 - S) * ((a - A) / D)) : peak * S);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  if (A < g - 1e-4) env.gain.linearRampToValueAtTime(envAt(A), t + A);
  if (A + D < g - 1e-4) env.gain.linearRampToValueAtTime(envAt(A + D), t + A + D);
  env.gain.linearRampToValueAtTime(envAt(g), t + g);
  env.gain.linearRampToValueAtTime(0, t + g + R);

  // ---- Light lowpass -> soft clip -> pan -> dest
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = 0.45;
  lp.frequency.value = Math.min(nyq, 280 * Math.pow(50, clamp(P.light, 0, 1)));
  const clip = ctx.createWaveShaper();
  clip.curve = CLIP;
  const pan = ctx.createStereoPanner();
  pan.pan.value = clamp((pitch - 60) / 90, -0.3, 0.3);
  env.connect(lp);
  lp.connect(clip);
  clip.connect(pan);
  pan.connect(dest);

  // ---- shared FM modulator
  const fmF = f * (1.5 + warp * 0.118);
  const fm = ctx.createOscillator();
  fm.type = "sine";
  fm.frequency.setValueAtTime(fmF * (strained ? bend : 1), t);
  if (strained) fm.frequency.linearRampToValueAtTime(fmF, t + settle);
  const srcs = [fm];

  // ---- the seven modes
  for (let i = 0; i < 7; i++) {
    const base = f * HARM[i];
    if (base > nyq) continue;
    const target = Math.min(nyq, f * (HARM[i] + OFFSET[i] * warp));
    const high = i >= 3;
    const osc = ctx.createOscillator();
    osc.type = "sine";

    // frequency: harmonic at the strike -> warped spacing once bloomed (core stays in tune)
    const T1 = A + B * (i === 0 ? 0.01 : 1);
    if (strained) {
      osc.frequency.setValueAtTime(base * bend, t);
      const s = Math.min(settle, T1);
      osc.frequency.linearRampToValueAtTime(base + (target - base) * (s / T1), t + s);
      if (T1 > s) osc.frequency.linearRampToValueAtTime(target, t + T1);
    } else {
      osc.frequency.setValueAtTime(base, t);
      if (Math.abs(target - base) > 1e-3) osc.frequency.linearRampToValueAtTime(target, t + T1);
    }

    // level (+ the opening of the upper modes: near-silent -> dip -> full over bloom)
    const amp =
      WEIGHT[i] *
      (i === 0 ? 0.65 + P.body * 0.65 : i < 3 ? 0.25 + P.body * 0.75 : 0.035 + stress * 1.6) *
      (high ? 0.2 + 0.8 * vh : 1);
    const lvl = ctx.createGain();
    if (high) {
      lvl.gain.setValueAtTime(amp * 0.045, t);
      lvl.gain.linearRampToValueAtTime(amp * 0.22, t + A + B * 0.24);
      lvl.gain.linearRampToValueAtTime(amp, t + A + B);
    } else lvl.gain.value = amp;
    osc.connect(lvl);
    lvl.connect(env);

    // FM stress (Hz of deviation) from the shared modulator
    const fmDepth = i === 0 ? 0 : f * stress * stress * (high ? 0.16 : 0.035) * (i + 1);
    if (fmDepth > 0.02) {
      const fg = ctx.createGain();
      fg.gain.value = fmDepth;
      fm.connect(fg);
      fg.connect(osc.frequency);
    }

    // slow independent drift (cents), baked as a sine curve on detune
    const cents = i === 0 ? 0 : P.drift * Math.min(28, i * 5);
    if (cents > 0.05) {
      const rate = 0.07 + i * 0.053 + clamp(v, 0, 1) * 0.09;
      const n = clamp(Math.ceil(T * 14), 16, 400);
      const curve = new Float32Array(n);
      for (let k = 0; k < n; k++) curve[k] = cents * Math.sin(2 * Math.PI * rate * ((k / (n - 1)) * T));
      osc.detune.setValueCurveAtTime(curve, t, T);
    }
    srcs.push(osc);
  }

  for (const s of srcs) {
    s.start(t);
    s.stop(t + T);
  }
  fm.onended = () => {
    try {
      pan.disconnect();
    } catch {
      /* already gone */
    }
  };
}

// Waveform of A3 with the bloom compressed into the first 0.6 s so the panel shows the
// fracture opening (modes fade up and slide into the warped spacing). 16 kHz, 1 s.
function scope(P) {
  const sr = 16000;
  const N = 16000;
  const out = new Float32Array(N);
  const f = 220;
  const Tw = 0.6;
  const stress = clamp(P.fracture, 0, 1);
  const warp = clamp(P.warp, 0, 1);
  const fmF = f * (1.5 + warp * 0.118);
  const idxSrc = [];
  const lowSrc = [];
  for (let i = 0; i < 7; i++) {
    const high = i >= 3;
    const amp = WEIGHT[i] * (i === 0 ? 0.65 + P.body * 0.65 : i < 3 ? 0.25 + P.body * 0.75 : 0.035 + stress * 1.6) * (high ? 0.2 + 0.8 * P.touch : 1);
    const dev = i === 0 ? 0 : f * stress * stress * (high ? 0.16 : 0.035) * (i + 1);
    lowSrc.push({ i, high, amp, beta: dev / fmF, b: f * HARM[i], d: f * OFFSET[i] * warp });
  }
  idxSrc.push(...lowSrc);
  let peak = 1e-6;
  for (let n = 0; n < N; n++) {
    const tt = n / sr;
    const prog = tt < Tw ? (tt * tt) / (2 * Tw) : Tw / 2 + (tt - Tw); // integral of glide progress
    const p = Math.min(1, tt / Tw);
    const open = p < 0.24 ? 0.045 + (0.22 - 0.045) * (p / 0.24) : 0.22 + (1 - 0.22) * ((p - 0.24) / 0.76);
    const mc = Math.cos(2 * Math.PI * fmF * tt);
    let s = 0;
    for (const m of idxSrc) {
      const ph = 2 * Math.PI * (m.b * tt + m.d * (m.i === 0 ? 0 : prog)) - m.beta * mc;
      s += m.amp * (m.high ? open : 1) * Math.sin(ph);
    }
    out[n] = s;
    const a = Math.abs(s);
    if (a > peak) peak = a;
  }
  const k = 0.9 / peak;
  for (let n = 0; n < N; n++) out[n] *= k;
  return out;
}

const faultglass = {
  name: "FAULTGLASS",
  tagline: "A fracture instrument — a clear core that opens into a restless halo of glass",
  color: "#ecb984",
  params,
  presets: [
    { name: "First Fracture", params: {} },
    { name: "Porcelain Rain", params: { body: 0.42, fracture: 0.67, warp: 0.6, bloom: 0.06, drift: 0.04, light: 0.8, attack: 0.004, decay: 0.38, sustain: 0.04, release: 0.27 } },
    { name: "Pocket Stars", params: { body: 0.58, fracture: 0.28, warp: 0.04, bloom: 0.12, drift: 0.09, light: 0.92, attack: 0.007, decay: 0.72, sustain: 0.1, release: 0.9 } },
    { name: "Molten Choir", params: { body: 0.85, fracture: 0.32, warp: 0.18, bloom: 2.6, drift: 0.55, light: 0.37, attack: 1.3, decay: 2.5, sustain: 0.78, release: 3.5 } },
    { name: "Black Prism", params: { body: 0.94, fracture: 0.8, warp: 0.48, bloom: 0.24, drift: 0.16, light: 0.24, attack: 0.006, decay: 0.23, sustain: 0.42, release: 0.25 } },
    { name: "Slow Fault", params: { body: 0.65, fracture: 0.84, warp: 0.88, bloom: 5.5, drift: 0.76, light: 0.68, attack: 0.18, decay: 2, sustain: 0.7, release: 4.2 } },
    { name: "Wire Orchard", params: { body: 0.27, fracture: 0.93, warp: 0.72, bloom: 0.34, drift: 0.39, light: 0.88, attack: 0.01, decay: 0.62, sustain: 0.6, release: 0.7, strain: 0.5 } },
    { name: "Frost Organ", params: { body: 0.76, fracture: 0.18, warp: 0.015, bloom: 0.5, drift: 0.03, light: 0.54, attack: 0.035, decay: 0.22, sustain: 0.88, release: 0.6 } },
  ],
  lines: [
    { name: "Shard Arpeggio (Am9)", dsl: "0:A3:3 2:C4:3 4:E4:3 6:G4:3 8:B4:3 10:E4:3 12:C4:3 14:A3:2 16:F3:3 18:A3:3 20:C4:3 22:E4:3 24:G4:3 26:C5:3 28:A4:3 30:E4:2" },
    { name: "Held Fault (Dm - Bb)", dsl: "0:D3:16 0:A3:16 0:F4:16 0:E4:16 16:A#2:16 16:F3:16 16:D4:16 16:C4:16" },
    { name: "Black Prism Bass (Em)", dsl: "0:E2:3 4:E2:1 6:G2:3 8:A2:3 12:B2:3 16:E2:3 20:E2:1 22:D3:3 24:B2:3 28:A2:3" },
    { name: "Pocket Stars", dsl: "0:E5:4:100 5:B5:4:70 9:G#5:4:85 14:B4:4:60 18:E5:4:95 23:F#5:4:65 27:B5:5:90" },
  ],
  ui: {
    theme: { accent: "#ecb984", lcd: "#b8d5ce", lcdBg: "#0d1214", edge: "#3a3d3f", bg: "#1d2022" },
    logo: ["FAULT", "GLASS"],
    sub: "A FRACTURE INSTRUMENT",
    cc: { 74: "light", 71: "fracture", 73: "attack", 72: "release", 75: "bloom", 76: "warp", 77: "drift", 7: "level" },
    sections: [
      {
        title: "GLASS FIELD",
        cls: "fg-field",
        items: [
          { type: "xy", x: { key: "fracture", label: "FRACTURE", fmt: "pct" }, y: { key: "light", label: "LIGHT", fmt: "pct" }, cls: "fg-pad", ticks: ["WHOLE", "SHATTERED"] },
          { type: "viz", id: "scope", cls: "viz-glass" },
        ],
      },
      {
        title: "CORE",
        cls: "fg-core",
        items: [
          { type: "row", items: [{ type: "knob", key: "body", label: "BODY", fmt: "pct", big: true }, { type: "knob", key: "warp", label: "WARP", fmt: "pct", big: true }] },
          { type: "knob", key: "drift", label: "DRIFT", fmt: "pct" },
        ],
      },
      {
        title: "BLOOM",
        cls: "fg-bloom",
        items: [
          { type: "row", items: [{ type: "knob", key: "bloom", label: "BLOOM", fmt: "ms", curve: "log", big: true }, { type: "knob", key: "strain", label: "STRAIN", fmt: "num2", center: true }] },
          { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" },
        ],
      },
      {
        title: "ENVELOPE",
        cls: "fg-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms", curve: "log" },
              { type: "fader", key: "decay", label: "D", fmt: "ms" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms", curve: "log" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
  scope,
  voice,
};

export const FAULTGLASS_SYNTHS = { faultglass };

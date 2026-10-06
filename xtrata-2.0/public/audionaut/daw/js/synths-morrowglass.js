// synths-morrowglass.js — Morrowglass, "an instrument of changing matter".
// Port of the standalone MorrowEngine voice: eight sine resonances that begin
// on an inharmonic "glass" series and MIGRATE toward a tuned harmonic series at
// staggered speeds after the strike, while BLOOM grows the upper modes in,
// FRACTURE adds a velocity-sensitive FM burst at the strike, CONTACT redistributes
// energy with a virtual strike position and DRIFT adds slow per-mode pitch motion.
//
// Everything that the live page did with a 25 ms control tick (updateVoice) is
// pre-computed here as per-note automation curves, so a note evolves exactly as
// a held note did in the original. Node graph per note (27 nodes), no imports.

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, Number.isFinite(+v) ? +v : a));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

// inharmonic glass series the modes start from (mode n -> GLASS[n-1] x f0)
const GLASS_RATIOS = [1, 2.32, 3.84, 5.42, 7.01, 8.95, 11.2, 13.86];
const FM_RATIO = Math.SQRT2; // fixed modulator ratio in the original
const CURVE_RATE = 120; // automation points per second
const CURVE_MAX_S = 12; // evolution is automated for this long, then holds

// state of mode i (0..7) at `age` seconds after the strike -> { f, amp }.
// Straight port of MorrowEngine.updateVoice (minus pitch-bend / mod-wheel).
function modeAt(P, i, age, base, v, sr) {
  const limit = sr * 0.43;
  const n = i + 1;
  const F = Math.min(1, P.fracture);
  const fmDepth = base * F * F * (0.025 + 0.72 * P.strike * v * Math.exp(-age / 0.14));
  const shape = P.glass * (0.12 + 0.88 * Math.exp(-age / (P.flow * (0.65 + i * 0.14))));
  const ratio = n + (GLASS_RATIOS[i] - n) * shape;
  const cents = i ? Math.sin(age * (0.8 + i * 0.17) + i) * (P.drift * 9) : 0;
  const f = base * ratio * Math.pow(2, cents / 1200);
  const contact = i ? 0.22 + 0.78 * Math.abs(Math.sin(Math.PI * n * P.contact)) : 1;
  const transient = i ? 0.45 * Math.exp(-age / (0.1 + i * 0.035)) : 0.85;
  const bloom = i ? (0.1 + P.bloom * 1.7) * (1 - Math.exp(-age / (0.035 + i * 0.065 * P.flow))) : 0.15;
  const anti = clamp((limit - f - fmDepth * 2) / (sr * 0.08), 0, 1);
  return { f: Math.min(limit, f), amp: ((transient + bloom) * contact * anti) / Math.pow(n, 1.25) };
}

// amplitude envelope breakpoints [time, level], gate off at `dur`, linear release
function envPoints(P, peak, dur) {
  const a = Math.max(0.003, P.attack);
  const d = Math.max(0.01, P.decay);
  const sus = peak * P.sustain;
  const off = Math.max(0.01, dur);
  const at = (t) => (t < a ? (peak * t) / a : t < a + d ? peak + ((sus - peak) * (t - a)) / d : sus);
  const pts = [[0, 0]];
  if (off > a) pts.push([a, peak]);
  if (off > a + d) pts.push([a + d, sus]);
  pts.push([off, at(off)]);
  pts.push([off + Math.max(0.025, P.release), 0]);
  // strictly increasing times
  return pts.filter((p, k) => k === 0 || p[0] > pts[k - 1][0] + 1e-6);
}

// shared soft-clip curve: ~unity for small signals, ceiling ~0.78
const CLIP = (() => {
  const c = new Float32Array(2049);
  for (let i = 0; i < c.length; i++) {
    const x = (i / (c.length - 1)) * 2 - 1;
    c[i] = 1.1 * Math.tanh(x / 1.1);
  }
  return c;
})();

const OUT_GAIN = 0.8; // calibrated so defaults land at ~0.09 RMS, peak < 0.4

const params = [
  range("glass", "Glass", 0, 1, 0.01, 0.46),
  range("bloom", "Bloom", 0, 1, 0.01, 0.62),
  range("flow", "Migration", 0.15, 8, 0.01, 2.8),
  range("fracture", "Fracture", 0, 1, 0.01, 0.2),
  range("contact", "Contact", 0.05, 0.95, 0.01, 0.32),
  range("drift", "Drift", 0, 1, 0.01, 0.18),
  range("strike", "Strike → FM", 0, 2, 0.01, 1),
  range("width", "Width", 0, 1.5, 0.01, 1),
  range("attack", "Attack", 0.003, 2.5, 0.001, 0.012),
  range("decay", "Decay", 0.05, 4, 0.01, 1.2),
  range("sustain", "Hold Level", 0, 1, 0.01, 0.58),
  range("release", "Release", 0.025, 6, 0.005, 2.2),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

function voice(ctx, dest, { pitch, vel, time, dur }, P) {
  const sr = ctx.sampleRate;
  const v = clamp(vel, 0, 1.5);
  const base = midiToFreq(pitch);
  const peak = 0.3 * Math.pow(v, 1.25) * P.level * OUT_GAIN;
  const pts = envPoints(P, peak, dur);
  const life = pts[pts.length - 1][0]; // gate + release
  const stopAt = time + life + 0.04;

  // output chain: modes -> pan -> env -> soft clip -> dest
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, time);
  for (let k = 1; k < pts.length; k++) env.gain.linearRampToValueAtTime(pts[k][1], time + pts[k][0]);
  const clip = ctx.createWaveShaper();
  clip.curve = CLIP;
  env.connect(clip);
  clip.connect(dest);

  // shared FM strike: bursts at note-on, decays to a small standing depth
  const F = Math.min(1, P.fracture);
  const fmAmt = base * F * F;
  let fm = null;
  let fmGain = null;
  if (fmAmt > 1e-4) {
    fm = ctx.createOscillator();
    fm.type = "sine";
    fm.frequency.value = Math.min(sr * 0.43, base * FM_RATIO);
    fmGain = ctx.createGain();
    fmGain.gain.setValueAtTime(fmAmt * (0.025 + 0.72 * P.strike * v), time);
    fmGain.gain.setTargetAtTime(fmAmt * 0.025, time, 0.14);
    fm.connect(fmGain);
    fm.start(time);
    fm.stop(stopAt);
  }

  // time-varying frequency / amplitude curves for the seven upper modes
  const T = Math.min(life, CURVE_MAX_S);
  const N = Math.max(3, Math.ceil(T * CURVE_RATE) + 1);
  const curveDur = (N - 1) / CURVE_RATE;
  const oscs = [];
  for (let i = 0; i < 8; i++) {
    const o = ctx.createOscillator();
    o.type = "sine";
    const g = ctx.createGain();
    o.connect(g);
    if (i === 0) {
      o.frequency.value = Math.min(sr * 0.43, base);
      g.gain.value = modeAt(P, 0, 0, base, v, sr).amp;
      g.connect(env);
    } else {
      const fr = new Float32Array(N);
      const am = new Float32Array(N);
      for (let k = 0; k < N; k++) {
        const m = modeAt(P, i, k / CURVE_RATE, base, v, sr);
        fr[k] = m.f;
        am[k] = m.amp;
      }
      o.frequency.value = fr[0];
      o.frequency.setValueCurveAtTime(fr, time, curveDur);
      g.gain.value = am[0];
      g.gain.setValueCurveAtTime(am, time, curveDur);
      const pan = ctx.createStereoPanner();
      pan.pan.value = clamp((i % 2 ? -1 : 1) * (0.15 + i * 0.07) * P.width, -1, 1);
      g.connect(pan);
      pan.connect(env);
      if (fmGain) fmGain.connect(o.frequency);
    }
    o.start(time);
    o.stop(stopAt);
    oscs.push(o);
  }
  oscs[0].onended = () => {
    try {
      env.disconnect();
      clip.disconnect();
    } catch {
      /* already gone */
    }
  };
}

// Display waveform of A3: gate 0.5 s, 1 s total, rendered at 16 kHz, mono sum.
function scope(P) {
  const sr = 16000;
  const n = sr;
  const out = new Float32Array(n);
  const base = 220;
  const v = 1;
  const peak = 0.3 * P.level;
  const pts = envPoints(P, peak, 0.5);
  const envAt = (t) => {
    for (let k = 1; k < pts.length; k++) {
      if (t <= pts[k][0]) {
        const a = pts[k - 1];
        const b = pts[k];
        return a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0]);
      }
    }
    return 0;
  };
  const F = Math.min(1, P.fracture);
  const fmAmt = base * F * F;
  const wFm = (2 * Math.PI * Math.min(sr * 0.43, base * FM_RATIO)) / sr;
  const ph = new Float64Array(8);
  let fph = 0;
  const f = new Float64Array(8);
  const a = new Float64Array(8);
  const BLOCK = 32;
  for (let s = 0; s < n; s++) {
    const age = s / sr;
    if (s % BLOCK === 0) for (let i = 0; i < 8; i++) {
      const m = modeAt(P, i, age, base, v, sr);
      f[i] = (2 * Math.PI * m.f) / sr;
      a[i] = m.amp;
    }
    const e = envAt(age);
    let sum = a[0] * Math.sin(ph[0]);
    ph[0] += f[0];
    if (fmAmt > 1e-4) {
      const depth = fmAmt * (0.025 + 0.72 * P.strike * v * Math.exp(-age / 0.14));
      const mod = ((2 * Math.PI * depth) / sr) * Math.sin(fph);
      fph += wFm;
      for (let i = 1; i < 8; i++) {
        sum += a[i] * Math.sin(ph[i]);
        ph[i] += f[i] + mod;
      }
    } else {
      for (let i = 1; i < 8; i++) {
        sum += a[i] * Math.sin(ph[i]);
        ph[i] += f[i];
      }
    }
    out[s] = 1.1 * Math.tanh((sum * e) / 1.1) * 1.6;
  }
  return out;
}

const presets = [
  { name: "First Light", params: {} },
  { name: "Copper Orchard", params: { glass: 0.7, bloom: 0.22, flow: 0.44, fracture: 0.34, contact: 0.73, drift: 0.06, attack: 0.003, decay: 0.3, sustain: 0.14, release: 0.38, level: 1.25 } },
  { name: "Porcelain Rain", params: { glass: 0.92, bloom: 0.1, flow: 5.2, fracture: 0.48, contact: 0.18, drift: 0.03, attack: 0.003, decay: 0.16, sustain: 0, release: 0.35, level: 1.5 } },
  { name: "Velvet Mineral", params: { glass: 0.08, bloom: 0.53, flow: 1.4, fracture: 0.06, contact: 0.49, drift: 0.38, attack: 0.6, decay: 2.2, sustain: 0.8, release: 3.4, level: 0.85 } },
  { name: "Fault Choir", params: { glass: 1, bloom: 0.9, flow: 6.6, fracture: 0.78, contact: 0.6, drift: 0.63, attack: 0.09, decay: 2.1, sustain: 0.69, release: 2.9, level: 0.85 } },
  { name: "Slow Thaw", params: { glass: 0.8, bloom: 1, flow: 8, fracture: 0.12, contact: 0.27, drift: 0.25, attack: 1.5, decay: 3.2, sustain: 0.9, release: 4.8, level: 0.75 } },
  { name: "Pocket Gravity", params: { glass: 0.26, bloom: 0.07, flow: 0.15, fracture: 0.23, contact: 0.54, drift: 0, attack: 0.006, decay: 0.5, sustain: 0.46, release: 0.16, level: 1.1 } },
  { name: "Prism Engine", params: { glass: 0.61, bloom: 0.85, flow: 0.7, fracture: 0.64, contact: 0.11, drift: 0.8, attack: 0.008, decay: 0.45, sustain: 0.42, release: 0.7 } },
];

const lines = [
  { name: "Slow Thaw Intervals (Dm)", dsl: "0:D2:15 0:A2:15 16:A#1:15 16:F2:15 32:F2:15 32:C3:15 48:C2:15 48:G2:15" },
  { name: "Glass Figure (Dm)", dsl: "0:D4:2:96 2:F4:2:80 4:A4:2:88 6:G4:3:72 10:F4:2:84 12:E4:2:76 14:D4:2:100 16:A4:2:92 18:C5:2:78 20:A4:2:84 22:G4:3:70 26:F4:2:88 28:D4:4:96 32:A#4:2:90 34:G4:2:76 36:F4:2:84 38:D4:3:72 42:F4:2:80 44:A4:2:92 46:G4:2:74 48:E4:2:84 50:G4:2:80 52:A#4:2:96 54:A4:3:78 58:G4:2:84 60:D4:4:100" },
  { name: "Porcelain Taps", dsl: "0:D5:1:120 3:A5:1:60 5:F5:1:96 8:C6:1:50 10:D5:1:110 13:G5:1:70 16:A5:1:124 19:F5:1:56 21:D6:1:84 24:C5:1:100 27:A5:1:64 29:E5:1:90 32:D5:1:118 35:F6:1:48 37:G5:1:100 40:A5:1:76 43:C6:1:112 45:E5:1:58 48:F5:1:104 51:A5:1:66 53:D6:1:92 56:G5:1:80 59:A5:1:120 61:D5:1:70" },
  { name: "Pocket Gravity Bass (Dm)", dsl: "0:D2:3:110 4:D2:1:70 6:F2:2:96 8:A2:3:104 12:G2:2:90 14:F2:2:84 16:A#1:3:110 20:A#1:1:70 22:C2:2:96 24:D2:3:104 28:F2:2:90 30:E2:2:84 32:F2:3:110 36:F2:1:70 38:A2:2:96 40:C3:3:104 44:A2:2:90 46:G2:2:84 48:C2:3:110 52:C2:1:70 54:E2:2:96 56:G2:3:104 60:A2:2:90 62:A#2:2:84" },
];

const THEME = { accent: "#f3a672", lcd: "#bce7c8", lcdBg: "#0d201a", edge: "#2f5446", bg: "#142b25" };

const morrowglass = {
  name: "Morrowglass",
  tagline: "An instrument of changing matter — eight resonances migrating from glass to tone",
  color: "#f3a672",
  params,
  presets,
  voice,
  scope,
  lines,
  ui: {
    theme: THEME,
    logo: ["Morrow", "glass"],
    sub: "AN INSTRUMENT OF CHANGING MATTER",
    cc: { 74: "glass", 71: "bloom", 75: "flow", 76: "fracture", 77: "contact", 73: "attack", 72: "release", 7: "level" },
    sections: [
      {
        title: "THE MATERIAL",
        cls: "mg-field",
        items: [
          { type: "xy", x: { key: "glass", label: "GLASS", fmt: "pct" }, y: { key: "bloom", label: "BLOOM", fmt: "pct" }, cls: "mg-xy", ticks: ["HARMONIC", "GLASS"] },
          { type: "viz", id: "scope", cls: "mg-viz" },
        ],
      },
      {
        title: "CHANGE",
        cls: "mg-change",
        items: [
          { type: "row", items: [{ type: "knob", key: "flow", label: "MIGRATION", curve: "log", fmt: "ms", big: true }, { type: "knob", key: "contact", label: "CONTACT", fmt: "pct", big: true }] },
          { type: "row", items: [{ type: "knob", key: "fracture", label: "FRACTURE", fmt: "pct" }, { type: "knob", key: "drift", label: "DRIFT", fmt: "pct" }] },
        ],
      },
      {
        title: "STRIKE",
        cls: "mg-strike",
        items: [
          { type: "row", items: [{ type: "knob", key: "strike", label: "VEL→FM", fmt: "num2" }, { type: "knob", key: "width", label: "WIDTH", fmt: "pct" }] },
        ],
      },
      {
        title: "THE GESTURE",
        cls: "mg-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATTACK", curve: "log", fmt: "ms" },
              { type: "fader", key: "decay", label: "DECAY", curve: "log", fmt: "ms" },
              { type: "fader", key: "sustain", label: "HOLD", fmt: "pct" },
              { type: "fader", key: "release", label: "RELEASE", curve: "log", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
};

export const MORROWGLASS_SYNTHS = { morrowglass };

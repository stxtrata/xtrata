// basic-panels.js — front panels, factory presets and waveform displays for the five original
// "basic" synths that used to open with no panel: Acidals 303, Stacker, SubZero, FMonad, Chip-8.
//
// Their sound engines are unchanged and live in ../synths.js (params, voice, lines). This module
// only adds what the synth dock needs to show them like the other synths: a `ui` spec (knobs,
// faders, radio buttons — the same spec format synth-panel.js builds jiMS10 and the glass synths
// from), a `scope` that draws the waveform the current settings make, and a set of presets.
// synths.js merges PANELS into SYNTH_BANK. Everything a control writes is an existing param key,
// so saved projects and the MIDI-roll sliders are unaffected.

const N = 1024;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;

// ---- waveform helpers (display only) ---------------------------------------------------------
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));
const sqr = (ph) => (ph - Math.floor(ph) < 0.5 ? 1 : -1);
const tri = (ph) => 4 * Math.abs(ph - Math.floor(ph + 0.75) + 0.25) - 1;
const normalise = (a) => {
  let m = 0;
  for (const v of a) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < a.length; i++) a[i] /= m / 0.9;
  return a;
};
// One-pole low-pass; `fc` and `f0` in Hz (f0 = the fundamental the picture is drawn at).
function onePole(a, fc, f0, cycles) {
  const spc = N / cycles;
  const k = 1 - Math.exp((-TAU * (fc / f0)) / spc);
  let y = 0;
  const out = new Float32Array(a.length);
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < a.length; i++) out[i] = y += k * (a[i] - y);
  return out;
}
// Resonant 2-pole (state-variable) low-pass, run twice round so the picture is the steady state.
function svf(a, fc, q, f0, cycles) {
  const fs = f0 * (N / cycles);
  const f = clamp(2 * Math.sin((Math.PI * Math.min(fc, fs * 0.2)) / fs), 0.001, 1.2);
  const damp = clamp(1 / Math.max(0.5, q), 0.04, 2);
  let lo = 0, band = 0;
  const out = new Float32Array(a.length);
  for (let pass = 0; pass < 2; pass++)
    for (let i = 0; i < a.length; i++) {
      lo += f * band;
      const hi = a[i] - lo - damp * band;
      band += f * hi;
      out[i] = lo;
    }
  return out;
}

const scopes = {
  acidals(P) {
    const cycles = 3;
    const a = new Float32Array(N);
    for (let i = 0; i < N; i++) a[i] = (P.wave === "square" ? sqr : saw)((i / N) * cycles);
    return normalise(svf(a, P.cutoff + P.envMod * 0.35, 0.7 + P.reso * 0.55, 55, cycles));
  },
  stacker(P) {
    const cycles = 6;
    const voices = Math.max(1, Math.round(P.voices));
    const a = new Float32Array(N);
    for (let v = 0; v < voices; v++) {
      const cents = (v - (voices - 1) / 2) * P.detune * 5; // exaggerated so the beating shows in six cycles
      const r = Math.pow(2, cents / 1200);
      for (let i = 0; i < N; i++) a[i] += saw(((i / N) * cycles * r + v * 0.137) % 1);
    }
    return normalise(onePole(a, P.cutoff, 220, cycles));
  },
  subzero(P) {
    const cycles = 2;
    const k = 1 + P.drive * 8;
    const a = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = P.wave === "triangle" ? tri((i / N) * cycles) : Math.sin(TAU * (i / N) * cycles);
      a[i] = P.drive > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
    }
    return a;
  },
  fmonad(P) {
    const cycles = 3;
    const beta = clamp(P.index / (110 * P.ratio), 0, 9);
    const a = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = (i / N) * cycles;
      a[i] = Math.sin(TAU * t + beta * Math.sin(TAU * t * P.ratio));
    }
    return a;
  },
  chip8(P) {
    const cycles = 8;
    const a = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = (i / N) * cycles;
      a[i] = sqr(t) + sqr(t * (1 + P.width * 0.02 * 8)); // detune exaggerated so the hollow beating shows
    }
    return normalise(a);
  },
};

// ---- panel layout helpers ------------------------------------------------------------------
const knob = (key, label, fmt, extra = {}) => ({ type: "knob", key, label, fmt, ...extra });
const fader = (key, label, fmt, extra = {}) => ({ type: "fader", key, label, fmt, ...extra });
const row = (...items) => ({ type: "row", items });
const SVG = {
  saw: '<path d="M3 18 L12 6 V18 L21 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  sqr: '<path d="M3 18 V6 H12 V18 H21 V6" fill="none" stroke="currentColor" stroke-width="2"/>',
  sin: '<path d="M3 12 C6 2 9 2 12 12 S18 22 21 12" fill="none" stroke="currentColor" stroke-width="2"/>',
  tri: '<path d="M3 18 L8 6 L16 18 L21 6" fill="none" stroke="currentColor" stroke-width="2"/>',
};

// ---- the five panels -------------------------------------------------------------------------
const PANELS = {
  acidals: {
    scope: scopes.acidals,
    presets: [
      { name: "Classic 303", params: { wave: "sawtooth", cutoff: 500, reso: 18, envMod: 1800, decay: 0.25 } },
      { name: "Squelchy", params: { wave: "sawtooth", cutoff: 300, reso: 26, envMod: 3000, decay: 0.18 } },
      { name: "Square Bleep", params: { wave: "square", cutoff: 700, reso: 12, envMod: 1200, decay: 0.2 } },
      { name: "Dub Acid", params: { wave: "sawtooth", cutoff: 200, reso: 22, envMod: 2400, decay: 0.5 } },
      { name: "Fat Roll", params: { wave: "sawtooth", cutoff: 900, reso: 8, envMod: 800, decay: 0.12 } },
      { name: "Screamer", params: { wave: "sawtooth", cutoff: 1400, reso: 29, envMod: 3800, decay: 0.3 } },
    ],
    ui: {
      theme: { accent: "#feca57", lcd: "#ffe08a", lcdBg: "#1a1405", edge: "#4a3d1c", bg: "#1c1710" },
      logo: ["", "ACIDALS"],
      sub: "BASS LINE · 303",
      scopeLabel: "WAVEFORM · FILTERED",
      cc: { 74: "cutoff", 71: "reso", 12: "envMod", 75: "decay" },
      sections: [
        {
          title: "OSCILLATOR",
          items: [
            {
              type: "radio",
              key: "wave",
              cls: "wave-btns",
              options: [
                ["sawtooth", "SAW", SVG.saw],
                ["square", "SQR", SVG.sqr],
              ],
            },
          ],
        },
        {
          title: "FILTER",
          items: [
            row(
              knob("cutoff", "CUTOFF", "hz", { curve: "log", big: true }),
              knob("reso", "RESO", "num1", { big: true }),
              knob("envMod", "ENV MOD", "hz", { big: true }),
            ),
          ],
        },
        { title: "ENVELOPE", items: [row(fader("decay", "DECAY", "ms"))] },
      ],
    },
  },

  stacker: {
    scope: scopes.stacker,
    presets: [
      { name: "Rave Stab", params: { voices: 7, detune: 22, cutoff: 6500, attack: 0.005, release: 0.25 } },
      { name: "Trance Pad", params: { voices: 5, detune: 14, cutoff: 4500, attack: 0.4, release: 1.8 } },
      { name: "Hoover Dark", params: { voices: 7, detune: 38, cutoff: 1800, attack: 0.05, release: 0.9 } },
      { name: "Supersoft", params: { voices: 3, detune: 8, cutoff: 2500, attack: 0.6, release: 2.5 } },
      { name: "Anthem Lead", params: { voices: 7, detune: 18, cutoff: 9000, attack: 0.01, release: 0.5 } },
      { name: "Mono Saw", params: { voices: 1, detune: 0, cutoff: 3000, attack: 0.01, release: 0.2 } },
    ],
    ui: {
      theme: { accent: "#c084fc", lcd: "#e4c6ff", lcdBg: "#150d1f", edge: "#3f2d57", bg: "#1b1326" },
      logo: ["", "STACKER"],
      sub: "SUPERSAW STACK",
      scopeLabel: "WAVEFORM · STACK",
      cc: { 74: "cutoff", 71: "detune", 73: "attack", 72: "release" },
      sections: [
        {
          title: "STACK",
          items: [
            row(
              knob("voices", "VOICES", "int", { big: true }),
              knob("detune", "DETUNE", "cents", { big: true }),
            ),
          ],
        },
        { title: "FILTER", items: [row(knob("cutoff", "CUTOFF", "hz", { curve: "log", big: true }))] },
        {
          title: "ENVELOPE",
          items: [row(fader("attack", "ATTACK", "ms"), fader("release", "RELEASE", "ms"))],
        },
      ],
    },
  },

  subzero: {
    scope: scopes.subzero,
    presets: [
      { name: "808 Classic", params: { wave: "sine", drive: 0.25, glideUp: 0.04, release: 0.4 } },
      { name: "Heavy Drive", params: { wave: "sine", drive: 0.8, glideUp: 0.06, release: 0.5 } },
      { name: "Pure Sub", params: { wave: "sine", drive: 0, glideUp: 0.005, release: 0.6 } },
      { name: "Tri Growl", params: { wave: "triangle", drive: 0.55, glideUp: 0.03, release: 0.35 } },
      { name: "Long 808", params: { wave: "sine", drive: 0.35, glideUp: 0.05, release: 1.6 } },
      { name: "Clicky Kick Bass", params: { wave: "triangle", drive: 0.2, glideUp: 0.12, release: 0.15 } },
    ],
    ui: {
      theme: { accent: "#54a0ff", lcd: "#b5d6ff", lcdBg: "#07111f", edge: "#25405f", bg: "#0d1724" },
      logo: ["", "SUBZERO"],
      sub: "SUB BASS · 808",
      scopeLabel: "WAVEFORM · DRIVEN",
      cc: { 74: "drive", 75: "glideUp", 72: "release" },
      sections: [
        {
          title: "OSCILLATOR",
          items: [
            {
              type: "radio",
              key: "wave",
              cls: "wave-btns",
              options: [
                ["sine", "SINE", SVG.sin],
                ["triangle", "TRI", SVG.tri],
              ],
            },
          ],
        },
        {
          title: "TONE",
          items: [row(knob("drive", "DRIVE", "pct", { big: true }), knob("glideUp", "PITCH SNAP", "ms", { big: true }))],
        },
        { title: "ENVELOPE", items: [row(fader("release", "RELEASE", "ms"))] },
      ],
    },
  },

  fmonad: {
    scope: scopes.fmonad,
    presets: [
      { name: "Glass Bell", params: { ratio: 3.5, index: 600, modDecay: 1.2, attack: 0.002, release: 2 } },
      { name: "Electric Piano", params: { ratio: 1, index: 250, modDecay: 0.6, attack: 0.002, release: 0.8 } },
      { name: "Metal Pluck", params: { ratio: 5, index: 800, modDecay: 0.15, attack: 0.002, release: 0.5 } },
      { name: "Soft Bell", params: { ratio: 2, index: 150, modDecay: 0.8, attack: 0.005, release: 1.6 } },
      { name: "Clav", params: { ratio: 3, index: 400, modDecay: 0.1, attack: 0.002, release: 0.25 } },
      { name: "Hollow Pad", params: { ratio: 1.5, index: 350, modDecay: 1.6, attack: 0.25, release: 1.8 } },
    ],
    ui: {
      theme: { accent: "#22d3ee", lcd: "#a8f0fb", lcdBg: "#06171b", edge: "#1f4a54", bg: "#0b1a1f" },
      logo: ["", "FMONAD"],
      sub: "2-OPERATOR FM",
      scopeLabel: "WAVEFORM · FM",
      cc: { 74: "index", 71: "ratio", 75: "modDecay", 72: "release" },
      sections: [
        {
          title: "MODULATOR",
          items: [
            row(
              knob("ratio", "RATIO", "ratio", { big: true }),
              knob("index", "INDEX", "int", { big: true }),
              knob("modDecay", "MOD DECAY", "ms", { big: true }),
            ),
          ],
        },
        {
          title: "ENVELOPE",
          items: [row(fader("attack", "ATTACK", "ms"), fader("release", "RELEASE", "ms"))],
        },
      ],
    },
  },

  chip8: {
    scope: scopes.chip8,
    presets: [
      { name: "Hero Lead", params: { width: 0.25, vibRate: 5, vibDepth: 12, decay: 0.3 } },
      { name: "Hollow", params: { width: 0.5, vibRate: 0, vibDepth: 0, decay: 0.5 } },
      { name: "Wobble", params: { width: 0.15, vibRate: 8, vibDepth: 35, decay: 0.4 } },
      { name: "Pluck Arp", params: { width: 0.3, vibRate: 0, vibDepth: 0, decay: 0.08 } },
      { name: "Coin", params: { width: 0.4, vibRate: 11, vibDepth: 5, decay: 0.12 } },
      { name: "Siren", params: { width: 0.2, vibRate: 6, vibDepth: 50, decay: 0.8 } },
    ],
    ui: {
      theme: { accent: "#fb7185", lcd: "#fecdd3", lcdBg: "#1f0b10", edge: "#5a2530", bg: "#22121a" },
      logo: ["", "CHIP-8"],
      sub: "PWM CHIPTUNE",
      scopeLabel: "WAVEFORM · PULSE",
      cc: { 74: "width", 76: "vibRate", 77: "vibDepth", 75: "decay" },
      sections: [
        { title: "PULSE", items: [row(knob("width", "WIDTH", "pct", { big: true }))] },
        {
          title: "VIBRATO",
          items: [row(knob("vibRate", "RATE", "num1", { big: true }), knob("vibDepth", "DEPTH", "cents", { big: true }))],
        },
        { title: "ENVELOPE", items: [row(fader("decay", "DECAY", "ms"))] },
      ],
    },
  },
};

export const BASIC_PANELS = PANELS;

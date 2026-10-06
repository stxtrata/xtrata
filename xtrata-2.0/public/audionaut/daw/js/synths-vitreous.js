// synths-vitreous.js — VITREOUS, "a crystallising instrument" (phase-change synthesis).
//
// Ported from the standalone vitreous.html. Six sine modes share one pitched
// fundamental. On arrival the upper modes are dispersed (pulled away from their lattice
// ratios), frequency-modulated by a shared "stress" driver and amplitude-rippled by a
// slow "flow" LFO. Over GROWTH seconds every mode settles exponentially towards a
// material lattice (harmonic -> glass ratios 1 : 2.32 : 4.25 : 5.43 : 7.61 : 10.27 as
// FRACTURE rises) while the FM recedes and the upper-mode energy rises. A short note
// is the liquid phase; a held note reveals the glass. Velocity brightens the upper
// modes and deepens the liquid FM sidebands.
//
// This is a per-note node graph (6 oscillators + the shared modulators, ~40 nodes):
// the original used native AudioParam curves too, so the crystallisation is the very
// same setTargetAtTime trajectory, scheduled once at note start.
//
// Live-only gestures of the page: THAW (hold to liquefy sounding notes) became the
// per-note MELT parameter (the lattice liquefies again from note-off, through the
// release); mod wheel / pressure / bend / sustain pedal / stress-field dragging on
// sounding notes are omitted (no live modulation exists in the host). The shared
// echo + convolver room and compressor/limiter chain are the host's job and are
// not rebuilt; a safe soft-clip is kept.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const HARM = [1, 2, 3, 4, 6, 8];
const GLASS = [1, 2.32, 4.25, 5.43, 7.61, 10.27];
const WEIGHT = [1, 0.38, 0.27, 0.2, 0.15, 0.11];
const PEAK = 0.55; // overall scale (calibrated so defaults sit at RMS ~0.07)

// shared, never mutated: tanh-style soft clip (input is clamped to +-1 by the WaveShaper)
const SOFT_CURVE = (() => {
  const c = new Float32Array(1024);
  for (let i = 0; i < c.length; i++) {
    const x = (i / (c.length - 1)) * 2 - 1;
    c[i] = 0.9 * Math.tanh(x / 0.9);
  }
  return c;
})();

// Everything a single mode needs at lock-state l (0 = liquid ... 1 = lattice).
// Shared by voice() and scope() so the display follows the same maths.
function modeAt(P, i, l, f, vk, ny) {
  const ratio = HARM[i] + P.fracture * (GLASS[i] - HARM[i]);
  const liquid = ratio + (i === 0 ? 0 : P.fracture * (i % 2 ? -0.12 : 0.17) * (i + 1));
  const audible = f * ratio < ny * 0.95 ? 1 : Math.max(0, 1 - (f * ratio - ny * 0.95) / (ny * 0.12));
  const stress = clamp(P.stress, 0, 1) * (0.45 + 0.55 * vk);
  const w = (WEIGHT[i] * (i === 0 ? 1 : (0.12 + P.crystal * (0.3 + 0.58 * l)) * (0.55 + 0.45 * vk)) * audible) / 2.1;
  const dev =
    Math.min(f * 0.75, ny * 0.1) * stress * (i === 0 ? 0.28 : 0.75 + i * 0.16) * (1 - 0.91 * l) * (1 + P.fracture * 0.5);
  return {
    freq: Math.min(ny, f * (liquid + (ratio - liquid) * l)),
    gain: w,
    dev,
    motion: w * P.current * 0.72 * (i % 2 ? 1 : -1),
  };
}

function voice(ctx, dest, { pitch, vel, time, dur }, P) {
  const level = clamp(P.level, 0, 1.5);
  const peak = PEAK * level * Math.pow(Math.max(0, vel), 1.25);
  if (!(peak > 1e-5)) return;
  const sr = ctx.sampleRate;
  const ny = sr * 0.43;
  const f = 440 * Math.pow(2, (pitch - 69) / 12);
  const touch = clamp(P.touch, 0, 1);
  const vk = 1 - touch * (1 - clamp(vel, 0, 1.4)); // velocity-as-brightness (0..1.4)
  const att = Math.max(0.003, P.attack);
  const dec = Math.max(0.04, P.decay);
  const rel = Math.max(0.03, P.release);
  const growth = Math.max(0.06, P.growth);
  const tau = Math.max(0.02, growth / 3);
  const off = time + Math.max(0.02, dur); // gate end
  const end = off + rel;
  const stopAt = end + 0.04;
  const melt = clamp(P.melt, 0, 1);
  const meltL = 1 - melt; // lock-state the lattice is thawed towards at note-off
  const meltTau = clamp(rel * 0.25, 0.04, 1.2);

  // ---- amplitude: linear attack, exponential decay to sustain, linear release
  const amp = ctx.createGain();
  const sus = Math.max(1e-4, P.sustain);
  const envAt = (t) => {
    const x = t - time;
    if (x <= att) return (peak * x) / att;
    if (x <= att + dec) return peak * Math.pow(sus, (x - att) / dec);
    return peak * sus;
  };
  const g = amp.gain;
  g.setValueAtTime(0, time);
  if (off <= time + att) {
    g.linearRampToValueAtTime(envAt(off), off);
  } else {
    g.linearRampToValueAtTime(peak, time + att);
    if (off <= time + att + dec) g.exponentialRampToValueAtTime(Math.max(1e-6, envAt(off)), off);
    else g.exponentialRampToValueAtTime(Math.max(1e-6, peak * sus), time + att + dec);
  }
  g.setValueAtTime(Math.max(1e-6, envAt(off)), off);
  g.linearRampToValueAtTime(0, end);

  const shaper = ctx.createWaveShaper();
  shaper.curve = SOFT_CURVE;
  amp.connect(shaper);
  shaper.connect(dest);

  // ---- shared modulators: FM driver (pitched, tied to the fundamental) and flow LFO
  const mod = ctx.createOscillator();
  mod.frequency.value = Math.min(ny * 0.6, f * (1.02 + P.fracture * 0.57));
  const flow = ctx.createOscillator();
  flow.frequency.value = 0.17 + clamp(P.current, 0, 1) * 6.1;
  const srcs = [mod, flow];

  const width = clamp(P.width, 0, 1);
  const sched = (param, from, to, toMelt, t) => {
    param.setValueAtTime(from, time);
    param.setTargetAtTime(to, time, t);
    if (melt > 0.005) param.setTargetAtTime(toMelt, off, meltTau);
  };

  for (let i = 0; i < 6; i++) {
    const m0 = modeAt(P, i, 0, f, vk, ny);
    const m1 = modeAt(P, i, 1, f, vk, ny);
    const mm = modeAt(P, i, meltL, f, vk, ny);
    if (m1.gain < 1e-5 && m0.gain < 1e-5) continue; // fully above Nyquist / silent
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const mg = ctx.createGain(); // mode gain (+ flow motion added to it)
    const fm = ctx.createGain(); // FM deviation in Hz
    const mo = ctx.createGain(); // flow LFO -> mode amplitude ripple
    const pan = ctx.createStereoPanner();
    mod.connect(fm);
    fm.connect(osc.frequency);
    flow.connect(mo);
    mo.connect(mg.gain);
    osc.connect(mg);
    mg.connect(pan);
    pan.connect(amp);
    // upper modes spread alternately left/right, the fundamental stays centred
    pan.pan.value = i === 0 ? 0 : (i % 2 ? -1 : 1) * width * (0.25 + 0.15 * i);
    sched(osc.frequency, m0.freq, m1.freq, mm.freq, tau);
    sched(fm.gain, m0.dev, m1.dev, mm.dev, tau);
    sched(mg.gain, m0.gain, m1.gain, mm.gain, tau);
    sched(mo.gain, m0.motion, m1.motion, mm.motion, tau);
    srcs.push(osc);
  }

  for (const s of srcs) {
    s.start(time);
    s.stop(stopAt);
  }
  srcs[0].onended = () => {
    try {
      amp.disconnect();
      shaper.disconnect();
    } catch {
      /* already gone */
    }
  };
}

// Waveform display: the whole liquid -> lattice life of an A3-ish note squeezed into one
// screen (time axis = 0..~1.5 x growth), fundamental drawn at 12 cycles so the stripes read.
function scope(P) {
  const N = 16000;
  const sr = 44100;
  const ny = sr * 0.43;
  const f = 220;
  const out = new Float32Array(N);
  const cyc = 12; // fundamental cycles across the display
  const modRatio = 1.02 + P.fracture * 0.57;
  const flowCycles = 0.5 + P.current * 7;
  const ph = [0, 0, 0, 0, 0, 0];
  let phMod = 0;
  let peak = 1e-6;
  const STEP = 32; // mode parameters are refreshed every STEP samples (they move slowly)
  const mm = [null, null, null, null, null, null];
  for (let n = 0; n < N; n++) {
    const x = n / N;
    if (n % STEP === 0) {
      const l = 1 - Math.exp(-3 * x * 1.5);
      for (let i = 0; i < 6; i++) {
        const m = modeAt(P, i, l, f, 1, ny);
        mm[i] = { w: m.gain, mo: m.motion, inc: (2 * Math.PI * (m.freq / f) * cyc) / N, beta: (m.dev / (f * modRatio)) * 1.4 };
      }
    }
    const flow = Math.sin(2 * Math.PI * flowCycles * x);
    let s = 0;
    phMod += (2 * Math.PI * cyc * modRatio) / N;
    const sm = Math.sin(phMod);
    for (let i = 0; i < 6; i++) {
      const m = mm[i];
      if (m.w < 1e-6) continue;
      ph[i] += m.inc;
      s += Math.sin(ph[i] + m.beta * sm) * (m.w + m.mo * flow);
    }
    out[n] = s;
    const a = Math.abs(s);
    if (a > peak) peak = a;
  }
  const k = 0.85 / peak;
  for (let n = 0; n < N; n++) out[n] *= k;
  return out;
}

const PRESETS = [
  { name: "Mercury Bloom", params: {} },
  {
    name: "Bell Orchard",
    params: { crystal: 1, fracture: 0.88, growth: 0.09, current: 0.08, stress: 0.18, attack: 0.003, decay: 0.85, sustain: 0.06, release: 1.9, level: 1.35 },
  },
  {
    name: "Submerged Reed",
    params: { crystal: 0.17, fracture: 0.04, growth: 5.5, current: 0.12, stress: 0.73, attack: 0.024, decay: 0.27, sustain: 0.77, release: 0.2 },
  },
  {
    name: "Glacier Choir",
    params: { crystal: 0.85, fracture: 0.49, growth: 7.2, current: 0.35, stress: 0.45, attack: 1.35, decay: 1.8, sustain: 0.86, release: 4.2, width: 0.8, melt: 0.3 },
  },
  {
    name: "Rubber Stars",
    params: { crystal: 0.35, fracture: 0.2, growth: 1.8, current: 0.18, stress: 0.95, attack: 0.004, decay: 0.42, sustain: 0, release: 0.16, level: 1.5 },
  },
  {
    name: "Salt Engine",
    params: { crystal: 0.88, fracture: 0.66, growth: 0.62, current: 0.96, stress: 0.59, attack: 0.012, decay: 0.55, sustain: 0.67, release: 0.45, width: 0.7 },
  },
  {
    name: "Porcelain Wire",
    params: { crystal: 0.67, fracture: 0.96, growth: 0.2, current: 0.04, stress: 0.05, attack: 0.045, decay: 1.7, sustain: 0.3, release: 2.6 },
  },
  {
    name: "Night Aquarium",
    params: { crystal: 0.57, fracture: 0, growth: 4.1, current: 0.61, stress: 0.4, attack: 0.36, decay: 1.1, sustain: 0.72, release: 2.8, width: 0.75, melt: 0.6 },
  },
];

const vitreous = {
  name: "VITREOUS",
  tagline: "A crystallising instrument — notes start liquid and freeze into glass the longer you hold them",
  color: "#8cdebc",
  params: [
    range("crystal", "Crystal", 0, 1, 0.01, 0.72),
    range("fracture", "Fracture", 0, 1, 0.01, 0.28),
    range("growth", "Growth", 0.06, 8, 0.01, 2.4),
    range("current", "Current", 0, 1, 0.01, 0.32),
    range("stress", "Stress", 0, 1, 0.01, 0.32),
    range("melt", "Melt (thaw on release)", 0, 1, 0.01, 0),
    range("touch", "Velocity Touch", 0, 1, 0.01, 1),
    range("width", "Glass Width", 0, 1, 0.01, 0.5),
    range("attack", "Attack", 0.003, 3, 0.001, 0.016),
    range("decay", "Decay", 0.04, 3, 0.01, 0.8),
    range("sustain", "Sustain", 0, 1, 0.01, 0.65),
    range("release", "Release", 0.03, 6, 0.01, 1.5),
    range("level", "Output Level", 0, 1.5, 0.01, 1),
  ],
  voice,
  scope,
  presets: PRESETS,
  lines: [
    {
      name: "Hold & Thaw (Dm9 → Bbmaj7)",
      dsl: "0:D3:32 0:A3:32 0:F4:32 0:E5:32 32:Bb2:32 32:F3:32 32:A3:32 32:D4:32",
    },
    {
      name: "Liquid → Lattice (E)",
      dsl: "0:E4:1:70 2:E4:1:90 4:E4:2:80 8:E4:24:100 32:B3:1:70 34:B3:2:90 36:B3:4:80 40:B3:24:100",
    },
    {
      name: "Bell Orchard Run (A)",
      dsl: "0:A4:3 4:E5:3 8:C#5:3 12:B4:3 16:A4:3 20:F#5:3 24:E5:3 28:C#5:4 40:A3:12:80 40:E5:12:60",
    },
    {
      name: "Salt Engine Pulse (Dm)",
      dsl: "0:D2:6 8:D2:4 12:A2:4 16:D2:6 24:F2:4 28:C3:4 32:D2:6 40:D2:4 44:A2:4 48:G2:6 56:A2:3 60:C3:3",
    },
  ],
  ui: {
    theme: { accent: "#8cdebc", lcd: "#bdedc5", lcdBg: "#0d1a16", edge: "#33433e", bg: "#172221" },
    logo: ["", "VITREOUS"],
    sub: "A CRYSTALLISING INSTRUMENT · NO. 01",
    cc: { 74: "crystal", 71: "fracture", 75: "growth", 76: "current", 77: "stress", 73: "attack", 72: "release", 7: "level" },
    sections: [
      {
        title: "THE MATERIAL",
        cls: "vt-material",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "crystal", label: "CRYSTAL", fmt: "pct", big: true },
              { type: "knob", key: "growth", label: "GROWTH", curve: "log", fmt: "ms", big: true },
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "current", label: "CURRENT", fmt: "pct" },
              { type: "knob", key: "melt", label: "MELT", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "STRESS FIELD",
        cls: "vt-field",
        items: [
          { type: "xy", x: { key: "fracture", label: "FRACTURE", fmt: "pct" }, y: { key: "stress", label: "STRESS", fmt: "pct" }, cls: "vt-xy", ticks: ["HARMONIC", "GLASS"] },
          { type: "viz", id: "scope", cls: "vt-lattice" },
        ],
      },
      {
        title: "CONTOUR",
        cls: "vt-contour",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms" },
              { type: "fader", key: "decay", label: "D", fmt: "ms" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" },
              { type: "knob", key: "width", label: "WIDTH", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "OUT",
        cls: "vt-out",
        items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
};

export const VITREOUS_SYNTHS = { vitreous };

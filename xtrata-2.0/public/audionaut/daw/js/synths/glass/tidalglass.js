// synths/glass/tidalglass.js — TIDAL GLASS · Harmonic Observatory (Audionaut synth-bank module)
// Ported from the standalone tidal-glass.html. A six-mode "glass" spectrum that morphs from
// harmonic to inharmonic (Fracture), excited by one shared FM modulator (Tide), with the upper
// modes brought forward (Bow), slow per-mode drift, a wide stereo scatter and two fading
// reflections (Afterglow). Web Audio node graph, one call per note, no imports, no assets.
//
// What the standalone page did live and what became of it:
//   Fracture / Tide pad drag, drift, held-chord evolution -> per-note: the strike starts "shattered"
//     (extra fracture + FM + brightness, scaled by velocity) and SETTLES to the panel values;
//     held notes SWELL (upper modes bloom in, filter opens) over a time derived from the gate length.
//   Live update() of held voices, release() on key-up -> replaced by dur (gate) and the ADSR.
//   Page limiter / master / analyser -> dropped (host has per-channel FX); a soft-clip is baked in.

const tgClamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const tgFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TG_MODES = [1, 2.01, 2.76, 4.08, 5.43, 7.21];
const TG_OUT = 0.34; // overall voice gain (tuned so defaults land at rms ~0.075, peak ~0.3)

// constant lookup table (never mutated): soft clip, |y| < 0.95 for any |x| >= 1
let TG_CURVE = null;
function tgCurve() {
  if (TG_CURVE) return TG_CURVE;
  const n = 2049;
  const c = new Float32Array(n);
  const k = 1.5;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = (0.95 * Math.tanh(k * x)) / Math.tanh(k);
  }
  TG_CURVE = c;
  return c;
}

const R = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });
const TG_PARAMS = [
  R("fracture", "Fracture", 0, 1, 0.01, 0.22),
  R("tide", "Tide", 0, 1, 0.01, 0.28),
  R("bow", "Bow", 0, 1, 0.01, 0.38),
  R("drift", "Drift", 0, 1, 0.01, 0.3),
  R("spread", "Width", 0, 1, 0.01, 0.75),
  R("cutoff", "Clarity", 200, 14000, 10, 7000),
  R("echo", "Afterglow", 0, 1, 0.01, 0.35),
  R("settle", "Settle", 0, 1, 0.01, 0.35),
  R("swell", "Swell", 0, 1, 0.01, 0.25),
  R("touch", "Touch", 0, 1, 0.01, 0.5),
  R("level", "Output", 0, 1, 0.01, 0.7),
  R("attack", "Attack", 0.005, 3, 0.005, 0.16),
  R("decay", "Decay", 0.02, 3, 0.01, 0.8),
  R("sustain", "Sustain", 0, 1, 0.01, 0.6),
  R("release", "Release", 0.02, 5, 0.01, 1.6),
];

function tgParams(P) {
  const out = {};
  for (const d of TG_PARAMS) out[d.key] = Number.isFinite(P?.[d.key]) ? tgClamp(P[d.key], d.min, d.max) : d.def;
  return out;
}

// piecewise-linear gate envelope [time, value] breakpoints, truncated at note-off
function tgEnv(t, A, D, S, off) {
  const pts = [[t, 0]];
  for (const [kt, kv] of [[t + A, 1], [t + A + D, S]]) {
    if (kt <= off) pts.push([kt, kv]);
    else {
      const [pt, pv] = pts[pts.length - 1];
      pts.push([off, pv + (kv - pv) * ((off - pt) / (kt - pt))]);
      return pts;
    }
  }
  pts.push([off, S]);
  return pts;
}

// quick additive picture of the A3 spectrum for the panel's scope (no FM envelope, steady state)
function tgScope(P) {
  const p = tgParams(P);
  const sr = 16000, n = 2400, f0 = 220;
  const out = new Float32Array(n);
  const e = Math.max(0.3, 1.8 - p.bow * 1.2);
  const fmod = f0 * (1.5 + 0.5 * p.fracture);
  for (let i = 0; i < 6; i++) {
    const f = f0 * ((i + 1) * (1 - p.fracture) + TG_MODES[i] * p.fracture);
    if (f > sr * 0.45) continue;
    const g = Math.pow(i + 1, -e);
    const beta = (f0 * p.tide * 1.8 * (0.09 + i * 0.045)) / fmod;
    const w = 2 * Math.PI * f / sr, wm = 2 * Math.PI * fmod / sr;
    for (let s = 0; s < n; s++) out[s] += g * Math.sin(w * s + beta * Math.sin(wm * s));
  }
  let pk = 1e-6;
  for (let s = 0; s < n; s++) pk = Math.max(pk, Math.abs(out[s]));
  for (let s = 0; s < n; s++) out[s] = (out[s] / pk) * 0.8;
  return out;
}

export const TIDALGLASS_SYNTHS = {
  tidalglass: {
    name: "TIDAL GLASS",
    tagline: "Bowed light and submerged bells",
    color: "#e66746",
    params: TG_PARAMS,

    voice(ctx, dest, note, P) {
      const p = tgParams(P);
      const sr = ctx.sampleRate;
      const t = Number.isFinite(note.time) ? note.time : 0;
      const vel = tgClamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
      if (vel < 0.002 || p.level <= 0) return;
      const pitch = tgClamp(Number.isFinite(note.pitch) ? note.pitch : 60, 0, 127);
      const freq = tgFreq(pitch);
      const d = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
      const off = t + d;
      const A = p.attack, Dn = p.decay, S = p.sustain, Rl = p.release;
      // velocity: loudness, and (Touch) a harder strike is brighter and more FM-excited
      const hard = tgClamp(1 + p.touch * 1.2 * (Math.min(vel, 1.4) - 1), 0.35, 1.5);
      // how long the held note takes to "bow in" its upper modes (scales with the gate)
      const bowT = tgClamp(0.25 + d * 0.75, 0.3, 4.5);

      const nodes = [];
      const mk = (n) => (nodes.push(n), n);
      const amp = mk(ctx.createGain());
      const out = mk(ctx.createGain());
      const clip = mk(ctx.createWaveShaper());
      const filter = mk(ctx.createBiquadFilter());
      clip.curve = tgCurve();
      filter.type = "lowpass";
      filter.Q.value = 0.55;
      filter.connect(amp);
      amp.connect(out);
      out.connect(clip);
      clip.connect(dest);
      out.gain.value = vel * p.level * TG_OUT;

      // gate envelope
      const pts = tgEnv(t, A, Dn, S, off);
      amp.gain.setValueAtTime(0, t);
      for (let k = 1; k < pts.length; k++) amp.gain.linearRampToValueAtTime(pts[k][1], pts[k][0]);
      amp.gain.linearRampToValueAtTime(0, off + Rl);

      // Afterglow: two fading reflections (intrinsic to the timbre)
      const hasEcho = p.echo > 0.01;
      if (hasEcho) {
        [0.233, 0.467].forEach((time, i) => {
          const dl = mk(ctx.createDelay(1));
          const g = mk(ctx.createGain());
          dl.delayTime.value = time;
          g.gain.value = p.echo * (i ? 0.17 : 0.32);
          amp.connect(dl);
          dl.connect(g);
          g.connect(out);
        });
      }

      // brightness: strike flash -> rest, then (Swell) the held note opens up
      const fcRest = Math.min(p.cutoff * (0.55 + 0.45 * Math.min(hard, 1.3)), sr * 0.45, 16000);
      const fcStrike = Math.min(fcRest * (1 + p.settle * 0.7), sr * 0.45);
      const fcLow = Math.max(120, fcRest * (1 - p.swell * 0.55));
      filter.frequency.setValueAtTime(fcStrike, t);
      filter.frequency.setTargetAtTime(fcLow, t + 0.01, 0.3);
      if (p.swell > 0.01) filter.frequency.setTargetAtTime(fcRest, t + bowT * 0.35, bowT * 0.3);

      // shared modulators: FM surface + two drift LFOs (decorrelated rates)
      const mod = mk(ctx.createOscillator());
      const lfoA = mk(ctx.createOscillator());
      const lfoB = mk(ctx.createOscillator());
      const sources = [mod, lfoA, lfoB];
      const fRest = p.fracture;
      mod.frequency.value = freq * (1.5 + 0.5 * fRest);
      const lr = (0.08 + p.drift * 1.5) * (1 + 0.04 * ((pitch * 7) % 5));
      lfoA.frequency.value = lr;
      lfoB.frequency.value = lr * 1.37;

      // strike: fracture opens up, then settles back to the panel value
      const fStart = Math.min(1, fRest + (1 - fRest) * p.settle * 0.9 * Math.min(vel, 1.2));

      for (let i = 0; i < 6; i++) {
        const o = mk(ctx.createOscillator());
        const g = mk(ctx.createGain());
        const fm = mk(ctx.createGain());
        const wander = mk(ctx.createGain());
        o.type = "sine";
        sources.push(o);
        const hzRest = freq * ((i + 1) * (1 - fRest) + TG_MODES[i] * fRest);
        const hzStart = freq * ((i + 1) * (1 - fStart) + TG_MODES[i] * fStart);
        const ok = hzRest < sr * 0.4 && hzStart < sr * 0.4;
        o.frequency.setValueAtTime(Math.min(hzStart, sr * 0.4), t);
        if (ok && i > 0) o.frequency.setTargetAtTime(hzRest, t + 0.01, 0.45);
        else o.frequency.setValueAtTime(Math.min(hzRest, sr * 0.4), t + 0.01);

        // spectrum: Bow flattens the slope; a hard strike flattens it a little more
        const slope = Math.max(0.3, 1.8 - p.bow * 1.2 - (hard - 1) * 0.5);
        const gRest = ok ? Math.pow(i + 1, -slope) * 0.55 : 0;
        const gStart = gRest * (1 - p.swell * 0.85 * (i / 5));
        g.gain.setValueAtTime(gStart, t);
        if (gStart !== gRest) g.gain.linearRampToValueAtTime(gRest, t + bowT);

        // Tide: shared-modulator index, flashing on the strike then settling
        const fmRest = Math.min(freq * p.tide * 1.8 * (0.09 + i * 0.045) * hard, sr * 0.02);
        const fmStart = Math.min(fmRest * (1 + p.settle * 1.8 * Math.min(hard, 1.3)), sr * 0.03);
        fm.gain.setValueAtTime(fmStart, t);
        fm.gain.setTargetAtTime(fmRest, t + 0.01, 0.35);

        // Drift: slow detune wander, sign alternates by mode
        wander.gain.value = (i % 2 ? 1 : -1) * p.drift * (1 + i * 1.7);

        o.connect(g);
        if (i === 0) g.connect(filter);
        else {
          const pan = mk(ctx.createStereoPanner());
          pan.pan.value = (i % 2 ? 1 : -1) * p.spread * (i / 5);
          g.connect(pan);
          pan.connect(filter);
        }
        mod.connect(fm);
        fm.connect(o.frequency);
        (i % 2 ? lfoB : lfoA).connect(wander);
        wander.connect(o.detune);
      }

      const stopAt = off + Rl + (hasEcho ? 0.52 : 0.05);
      for (const s of sources) {
        s.start(t);
        s.stop(stopAt);
      }
      mod.onended = () => nodes.forEach((n) => { try { n.disconnect(); } catch { /* gone */ } });
    },

    lines: [
      { name: "Sea of glass (Dm)", dsl: "0:D3:6:100 8:A3:3:76 12:F4:3:85 16:E4:6:82 24:A3:3:78 28:C4:3:90 32:Bb3:6:95 40:F4:3:80 44:D4:3:84 48:A3:6:95 56:E4:3:78 60:C4:3:88" },
      { name: "Submerged chords", dsl: "0:D3:14:80 0:F3:14:75 0:A3:14:75 16:Bb2:14:80 16:D3:14:75 16:F3:14:75 32:F3:14:80 32:A3:14:75 32:C4:14:75 48:C3:14:80 48:E3:14:75 48:G3:14:75" },
      { name: "Salt crystal peal", dsl: "0:D5:3:105 4:A4:3:80 7:F5:3:92 12:E5:4:84 18:C5:3:78 22:A5:3:100 28:F5:4:76 36:D5:3:98 40:G4:3:72 44:Bb4:3:86 48:A4:6:90 58:D5:4:70" },
      { name: "Undertow pulse", dsl: "0:D2:3:110 4:D2:2:70 6:A2:3:90 10:F2:2:72 16:C2:3:108 20:C2:2:70 22:G2:3:88 26:E2:2:74 32:Bb1:3:110 36:Bb1:2:70 38:F2:3:90 42:D2:2:72 48:A1:3:108 52:A1:2:70 54:E2:3:88 58:G2:2:74" },
    ],

    presets: [
      { name: "01 · Sea of Glass", params: {} },
      { name: "02 · Submerged Cathedral", params: { fracture: 0.08, tide: 0.12, bow: 0.2, attack: 1.1, decay: 1.6, sustain: 0.8, release: 3.8, cutoff: 3200, echo: 0.65, drift: 0.25, swell: 0.5, settle: 0.15 } },
      { name: "03 · Salt Crystal", params: { fracture: 0.72, tide: 0.16, bow: 0.78, attack: 0.005, decay: 0.65, sustain: 0.06, release: 1.8, cutoff: 11500, echo: 0.55, drift: 0.12, settle: 0.7, swell: 0, touch: 0.8 } },
      { name: "04 · Undertow", params: { fracture: 0.12, tide: 0.66, bow: 0.35, attack: 0.02, decay: 0.28, sustain: 0.45, release: 0.3, cutoff: 1600, echo: 0.08, drift: 0.45, settle: 0.5, swell: 0.1 } },
      { name: "05 · Broken Lighthouse", params: { fracture: 0.95, tide: 0.83, bow: 0.8, attack: 0.04, decay: 0.9, sustain: 0.3, release: 2.3, cutoff: 6800, echo: 0.6, drift: 0.75, settle: 0.6, swell: 0.2 } },
      { name: "06 · Slow Phosphor", params: { fracture: 0.43, tide: 0.45, bow: 0.5, attack: 2, decay: 1.3, sustain: 0.7, release: 4.6, cutoff: 5600, echo: 0.8, drift: 0.6, swell: 0.85, settle: 0.2 } },
      { name: "07 · Struck Prism", params: { fracture: 0.55, tide: 0.35, bow: 0.65, attack: 0.005, decay: 0.45, sustain: 0.18, release: 1.2, cutoff: 9500, echo: 0.3, drift: 0.2, settle: 1, swell: 0, touch: 1, spread: 0.9 } },
      { name: "08 · Bowed Aurora", params: { fracture: 0.3, tide: 0.2, bow: 0.9, attack: 0.9, decay: 0.8, sustain: 0.85, release: 2.8, cutoff: 8000, echo: 0.45, drift: 0.5, swell: 1, settle: 0.1, touch: 0.3 } },
    ],

    ui: {
      theme: { accent: "#e66746", lcd: "#b6f0d2", lcdBg: "#0b272b", edge: "#3a4a47", bg: "#18232a" },
      logo: ["TIDAL", "GLASS"],
      sub: "HARMONIC OBSERVATORY",
      cc: { 1: "tide", 71: "fracture", 74: "cutoff", 73: "attack", 72: "release", 75: "swell", 76: "settle", 7: "level" },
      sections: [
        {
          title: "HARMONIC FIELD",
          items: [
            { type: "xy", x: { key: "fracture", label: "FRACTURE", fmt: "pct" }, y: { key: "tide", label: "TIDE", fmt: "pct" }, ticks: ["PURE", "FRACTURED"] },
            { type: "row", items: [{ type: "knob", key: "bow", label: "BOW", fmt: "pct" }, { type: "knob", key: "drift", label: "DRIFT", fmt: "pct" }, { type: "knob", key: "spread", label: "WIDTH", fmt: "pct" }] },
          ],
        },
        {
          title: "SHORELINE",
          items: [
            { type: "row", items: [{ type: "knob", key: "settle", label: "SETTLE", fmt: "pct" }, { type: "knob", key: "swell", label: "SWELL", fmt: "pct" }, { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" }] },
            { type: "row", items: [{ type: "knob", key: "cutoff", label: "CLARITY", fmt: "hz", curve: "log" }, { type: "knob", key: "echo", label: "AFTERGLOW", fmt: "pct" }] },
          ],
        },
        {
          title: "ENVELOPE",
          items: [{ type: "row", items: [{ type: "fader", key: "attack", label: "A", fmt: "ms" }, { type: "fader", key: "decay", label: "D", fmt: "ms" }, { type: "fader", key: "sustain", label: "S", fmt: "pct" }, { type: "fader", key: "release", label: "R", fmt: "ms" }] }],
        },
        { title: "OUTPUT", items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }] },
      ],
      adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
    },

    scope: tgScope,
  },
};

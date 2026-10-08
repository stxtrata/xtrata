// synths-voices.js — three character synths with their own front panels:
//   Coinbase   4-operator FM (glass keys, bells, FM bass)         — rendered sample-by-sample
//   Gm   formant / vowel voice (choirs, talking leads)       — Web Audio node graph
//   Taproot Karplus–Strong strings & mallets                    — rendered sample-by-sample
// Each entry matches the SYNTH_BANK shape (name, tagline, color, params, lines,
// voice) plus `ui` (front-panel layout, read by synth-panel.js), `presets`, and
// `scope`/helpers the panel uses for its live displays. No imports from synths.js
// (synths.js imports this file), so the few helpers below are local.

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

// A rendered mono buffer → one-shot BufferSource → optional chain → dest.
function playData(ctx, dest, data, time, chain = []) {
  const buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
  buf.getChannelData(0).set(data);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  let node = src;
  for (const n of chain) {
    node.connect(n);
    node = n;
  }
  node.connect(dest);
  src.start(time);
  src.onended = () => {
    try {
      node.disconnect();
    } catch {
      /* already gone */
    }
  };
}

// ============================================================ Coinbase
export const FM_ALGOS = ["stack", "twin", "fork", "organ"];
// MOD[a][k] = ops (0-based) that phase-modulate op k; CARRIERS[a] = ops heard.
export const FM_MOD = [
  [[1], [2], [3], []], // stack: 4→3→2→1
  [[1], [], [3], []], // twin : 2→1  and  4→3
  [[1, 2, 3], [], [], []], // fork : 2,3,4 → 1
  [[], [], [], []], // organ: four parallel sines
];
export const FM_CARRIERS = [[0], [0, 2], [0], [0, 1, 2, 3]];
export const fmRoles = (algo) => {
  const a = Math.max(0, FM_ALGOS.indexOf(algo));
  return [0, 1, 2, 3].map((k) => (FM_CARRIERS[a].includes(k) ? "carrier" : "mod"));
};

export function renderFm(P, pitch, vel, dur, sr) {
  const f0 = midiToFreq(pitch);
  const rel = Math.max(0.02, P.release);
  const total = Math.min(8, Math.max(0.05, dur) + rel * 1.2 + 0.03);
  const n = Math.floor(total * sr);
  const out = new Float32Array(n);
  const a = Math.max(0.001, P.attack) * sr;
  const algo = Math.max(0, FM_ALGOS.indexOf(P.algo));
  const mods = FM_MOD[algo];
  const cars = FM_CARRIERS[algo];
  const ratio = [P.r1, P.r2, P.r3, P.r4];
  const level = [P.l1, P.l2, P.l3, P.l4];
  const w = ratio.map((r) => (2 * Math.PI * f0 * r) / sr);
  const dec = [P.d1, P.d2, P.d3, P.d4].map((d) => Math.exp(-4.6 / (Math.max(0.02, d) * sr)));
  const env = [1, 1, 1, 1];
  const ph = [0, 0, 0, 0];
  const sus = clamp(P.sustain, 0, 1);
  const velMod = 1 - P.vel + P.vel * vel;
  const MI = 4; // radians of phase modulation at level 1
  const fbAmt = P.fb * 3;
  const gain = (0.5 * P.level * (0.55 + 0.45 * vel)) / Math.sqrt(cars.length);
  const rg = Math.exp(-6.9 / (rel * sr));
  const nOff = Math.floor(dur * sr);
  const fade = Math.floor(0.01 * sr);
  let relGain = 1;
  let fb1 = 0;
  let fb2 = 0;
  const o = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    if (i >= nOff) relGain *= rg;
    for (let k = 3; k >= 0; k--) {
      let pm = 0;
      for (const j of mods[k]) pm += o[j];
      pm *= MI * velMod;
      if (k === 3) pm += fbAmt * 0.5 * (fb1 + fb2);
      const e = level[k] * (sus + (1 - sus) * env[k]);
      env[k] *= dec[k];
      o[k] = Math.sin(ph[k] + pm) * e;
      ph[k] += w[k];
    }
    fb2 = fb1;
    fb1 = o[3];
    let s = 0;
    for (const c of cars) s += o[c];
    const att = i < a ? i / a : 1;
    const tail = i > n - fade ? (n - i) / fade : 1;
    out[i] = Math.tanh(s * gain * 2.2 * att * relGain) * 0.55 * tail;
  }
  return out;
}

const fmParams = [
  { key: "algo", label: "Algorithm", type: "select", def: "twin", options: FM_ALGOS },
  range("fb", "Op4 Feedback", 0, 1, 0.01, 0.05),
  range("r1", "Op1 Ratio", 0.25, 16, 0.25, 1),
  range("l1", "Op1 Level", 0, 1, 0.01, 0.85),
  range("d1", "Op1 Decay", 0.05, 4, 0.01, 2.2),
  range("r2", "Op2 Ratio", 0.25, 16, 0.25, 14),
  range("l2", "Op2 Level", 0, 1, 0.01, 0.22),
  range("d2", "Op2 Decay", 0.05, 4, 0.01, 0.15),
  range("r3", "Op3 Ratio", 0.25, 16, 0.25, 1),
  range("l3", "Op3 Level", 0, 1, 0.01, 0.55),
  range("d3", "Op3 Decay", 0.05, 4, 0.01, 1.4),
  range("r4", "Op4 Ratio", 0.25, 16, 0.25, 1),
  range("l4", "Op4 Level", 0, 1, 0.01, 0.35),
  range("d4", "Op4 Decay", 0.05, 4, 0.01, 0.9),
  range("sustain", "Sustain", 0, 1, 0.01, 0.2),
  range("attack", "Attack", 0.002, 0.5, 0.002, 0.003),
  range("release", "Release", 0.02, 2.5, 0.01, 0.35),
  range("vel", "Velocity→Index", 0, 1, 0.01, 0.6),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

// small SVG diagrams for the algorithm buttons (viewBox 0 0 48 30)
const box = (x, y, n) =>
  `<rect x="${x}" y="${y}" width="9" height="9" rx="1.5"/><text x="${x + 4.5}" y="${y + 7}" text-anchor="middle">${n}</text>`;
const FM_ICONS = {
  stack: `${box(3, 19, 1)}${box(14, 19, 2)}${box(25, 19, 3)}${box(36, 19, 4)}<path d="M36 23.5H34M25 23.5H23M14 23.5H12"/><path d="M7.5 19V9"/>`,
  twin: `${box(5, 19, 1)}${box(5, 4, 2)}${box(30, 19, 3)}${box(30, 4, 4)}<path d="M9.5 13V19M34.5 13V19"/>`,
  fork: `${box(19, 19, 1)}${box(4, 3, 2)}${box(19, 3, 3)}${box(34, 3, 4)}<path d="M8.5 12L22 19M23.5 12V19M38.5 12L26 19"/>`,
  organ: `${box(3, 10, 1)}${box(14, 10, 2)}${box(25, 10, 3)}${box(36, 10, 4)}`,
};

const FM_PRESETS = [
  { name: "Glass Keys", params: {} },
  {
    name: "Tubular Bell",
    params: { algo: "twin", fb: 0, r1: 1, l1: 0.8, d1: 3.5, r2: 3.5, l2: 0.55, d2: 2.5, r3: 2.76, l3: 0.45, d3: 2.4, r4: 5.4, l4: 0.3, d4: 1.2, sustain: 0, release: 1.4, vel: 0.5 },
  },
  {
    name: "FM Bass",
    params: { algo: "stack", fb: 0.35, r1: 1, l1: 0.9, d1: 0.7, r2: 1, l2: 0.7, d2: 0.25, r3: 2, l3: 0.3, d3: 0.15, r4: 1, l4: 0.2, d4: 0.2, sustain: 0.6, attack: 0.003, release: 0.12, vel: 0.5 },
  },
  {
    name: "Brass Section",
    params: { algo: "fork", fb: 0.1, r1: 1, l1: 0.9, d1: 1.4, r2: 1, l2: 0.5, d2: 0.9, r3: 2, l3: 0.25, d3: 0.5, r4: 3, l4: 0.15, d4: 0.4, sustain: 0.7, attack: 0.04, release: 0.2, vel: 0.7 },
  },
  {
    name: "Drawbar Organ",
    params: { algo: "organ", fb: 0.12, r1: 0.5, l1: 0.7, d1: 4, r2: 1, l2: 0.8, d2: 4, r3: 2, l3: 0.5, d3: 4, r4: 4, l4: 0.3, d4: 4, sustain: 1, attack: 0.012, release: 0.08, vel: 0.2 },
  },
  {
    name: "Metal Hit",
    params: { algo: "stack", fb: 0.7, r1: 1, l1: 0.8, d1: 0.9, r2: 1.41, l2: 0.8, d2: 0.5, r3: 3.7, l3: 0.6, d3: 0.3, r4: 7.2, l4: 0.5, d4: 0.2, sustain: 0, attack: 0.002, release: 0.5, vel: 0.8 },
  },
];

const fm4 = {
  name: "Coinbase",
  tagline: "4-operator FM — glass keys, bells, brass and FM bass",
  color: "#22d3ee",
  params: fmParams,
  presets: FM_PRESETS,
  live: { hold: 2.5 }, // offline-rendered: held notes render a 2.5 s gate, key-up fades
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    playData(ctx, dest, renderFm(P, pitch, vel, dur, ctx.sampleRate), time);
  },
  scope: (P) => renderFm(P, 57, 1, 0.5, 16000),
  lines: [
    { name: "Glass Keys (Am7 → Fmaj7)", dsl: "0:A3:2 2:C4:2 4:E4:2 6:G4:2 8:A3:2 10:C4:2 12:E4:2 14:G4:2 16:F3:2 18:A3:2 20:C4:2 22:E4:2 24:G3:2 26:B3:2 28:D4:2 30:F4:2" },
    { name: "Bell Chimes", dsl: "0:E5:4 6:B4:4 12:G#5:4 18:B4:4 24:E5:6" },
    { name: "FM Bassline (Em)", dsl: "0:E2:2 3:E2:1 4:G2:2 8:A2:2 11:A2:1 12:B2:2 16:E2:2 19:E2:1 20:D3:2 24:B2:2 28:A2:2" },
  ],
  ui: {
    theme: { accent: "#22d3ee", lcd: "#7df3ff", lcdBg: "#04141a", edge: "#1d3b46", bg: "#10202a" },
    logo: ["", "Coinbase"],
    sub: "4-OPERATOR FM SYNTHESIZER",
    cc: { 74: "r2", 71: "fb", 73: "attack", 72: "release", 75: "d1", 76: "l2", 77: "l3", 7: "level" },
    sections: [
      {
        title: "ALGORITHM",
        cls: "fm-algo",
        items: [
          { type: "radio", key: "algo", cls: "algo-btns", options: FM_ALGOS.map((a) => [a, a.toUpperCase(), FM_ICONS[a], "0 0 48 30"]) },
          { type: "knob", key: "fb", label: "FEEDBACK", fmt: "pct" },
          { type: "viz", id: "fmroute", cls: "viz-route" },
        ],
      },
      ...[1, 2, 3, 4].map((n) => ({
        title: `OP ${n}`,
        cls: `fm-op`,
        op: n,
        items: [
          { type: "knob", key: `r${n}`, label: "RATIO", fmt: "ratio", big: true },
          { type: "row", items: [{ type: "fader", key: `l${n}`, label: "LEVEL", fmt: "pct" }, { type: "knob", key: `d${n}`, label: "DECAY", fmt: "ms" }] },
        ],
      })),
      {
        title: "OUTPUT",
        cls: "fm-out",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "knob", key: "vel", label: "VEL→IDX", fmt: "pct" },
        ],
      },
    ],
    scopeLabel: "WAVEFORM · A3",
  },
};

// ============================================================ Gm
// formant frequencies (Hz) for A E I O U, plus relative gains and bandwidths
const VOWELS = [
  [800, 1150, 2900],
  [400, 1600, 2700],
  [270, 2140, 2950],
  [450, 800, 2830],
  [325, 700, 2530],
];
const VGAIN = [
  [1, 0.5, 0.15],
  [1, 0.45, 0.2],
  [1, 0.35, 0.2],
  [1, 0.4, 0.15],
  [1, 0.3, 0.1],
];
const BW = [80, 90, 120];
export const VOWEL_NAMES = ["A", "E", "I", "O", "U"];

// {f, g, q} for the three formants at vowel position x (0 = A … 4 = U)
export function voxFormants(P, x) {
  x = clamp(x, 0, 4);
  const i = Math.min(3, Math.floor(x));
  const t = x - i;
  return [0, 1, 2].map((k) => {
    const f = Math.exp(Math.log(VOWELS[i][k]) * (1 - t) + Math.log(VOWELS[i + 1][k]) * t) * P.shift;
    const g = VGAIN[i][k] * (1 - t) + VGAIN[i + 1][k] * t;
    return { f, g, q: Math.max(1, (f / BW[k]) * P.sharp) };
  });
}

const noiseCache = new WeakMap();
function noiseBuffer(ctx) {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseCache.set(ctx, b);
  }
  return b;
}

const voxParams = [
  range("vowel", "Vowel (A–U)", 0, 4, 0.01, 0),
  range("vowelTo", "Morph To", 0, 4, 0.01, 3),
  range("morph", "Morph Time", 0, 2, 0.01, 0),
  range("shift", "Voice Size", 0.7, 1.4, 0.01, 1),
  range("sharp", "Formant Sharpness", 0.5, 2, 0.01, 1),
  range("bright", "Source Brightness", 800, 9000, 50, 4500),
  range("choir", "Choir Detune", 0, 40, 1, 12),
  range("vibRate", "Vibrato Rate", 0.5, 9, 0.1, 5.2),
  range("vibDepth", "Vibrato Depth", 0, 60, 1, 14),
  range("breath", "Breath", 0, 1, 0.01, 0.12),
  range("attack", "Attack", 0.01, 1.5, 0.01, 0.12),
  range("release", "Release", 0.05, 3, 0.01, 0.6),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

const vox = {
  name: "Gm",
  tagline: "Formant voice — vowel choirs, talking leads and breathy pads",
  color: "#f472b6",
  params: voxParams,
  presets: [
    { name: "Ahh Choir", params: {} },
    { name: "Ooo Pad", params: { vowel: 4, morph: 0, shift: 0.92, choir: 20, breath: 0.2, attack: 0.5, release: 1.2, vibDepth: 10 } },
    { name: "Wah Lead", params: { vowel: 0, vowelTo: 4, morph: 0.45, choir: 4, breath: 0.05, attack: 0.03, release: 0.25, vibDepth: 22, bright: 6500 } },
    { name: "Whisper", params: { vowel: 1, choir: 0, breath: 0.95, bright: 2500, attack: 0.15, release: 0.5, vibDepth: 0 } },
    { name: "Robot Vox", params: { vowel: 2, vowelTo: 1, morph: 0, shift: 1.1, sharp: 1.9, choir: 0, vibDepth: 0, breath: 0, attack: 0.01, release: 0.1, bright: 7000 } },
    { name: "Yoy Talker", params: { vowel: 2, vowelTo: 3, morph: 0.3, choir: 6, vibDepth: 8, attack: 0.02, release: 0.2 } },
  ],
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const f0 = midiToFreq(pitch);
    const end = time + Math.max(dur, P.attack + 0.05);
    const stopAt = end + P.release + 0.1;
    // source: three detuned saws → brightness lowpass
    const src = ctx.createGain();
    src.gain.value = 0.3;
    const oscs = [-1, 0, 1].map((d) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f0;
      o.detune.value = d * P.choir;
      o.connect(src);
      return o;
    });
    // vibrato fades in after a short delay
    const lfo = ctx.createOscillator();
    lfo.frequency.value = P.vibRate;
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0, time);
    lfoGain.gain.linearRampToValueAtTime(P.vibDepth, time + 0.35 + P.attack);
    lfo.connect(lfoGain);
    oscs.forEach((o) => lfoGain.connect(o.detune));
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = Math.min(P.bright, 18000);
    src.connect(lp);
    // breath noise joins the same formant bank
    let noise = null;
    if (P.breath > 0.01) {
      noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer(ctx);
      noise.loop = true;
      const ng = ctx.createGain();
      ng.gain.value = P.breath * 0.55;
      noise.connect(ng).connect(lp);
    }
    // three parallel band-pass formants
    const bank = ctx.createGain();
    const from = voxFormants(P, P.vowel);
    const to = P.morph > 0.005 ? voxFormants(P, P.vowelTo) : from;
    from.forEach((fm, k) => {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(fm.f, time);
      bp.Q.setValueAtTime(fm.q, time);
      if (to !== from) {
        bp.frequency.linearRampToValueAtTime(to[k].f, time + P.morph);
        bp.Q.linearRampToValueAtTime(to[k].q, time + P.morph);
      }
      const g = ctx.createGain();
      g.gain.setValueAtTime(fm.g * 3.2, time);
      if (to !== from) g.gain.linearRampToValueAtTime(to[k].g * 3.2, time + P.morph);
      lp.connect(bp).connect(g).connect(bank);
    });
    // amplitude envelope
    const g = ctx.createGain();
    const peak = Math.max(0.001, vel * 2.4 * P.level);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + Math.max(0.01, P.attack));
    g.gain.setValueAtTime(peak, Math.max(end, time + P.attack + 0.001));
    g.gain.exponentialRampToValueAtTime(0.0001, end + Math.max(0.05, P.release));
    bank.connect(g).connect(dest);
    oscs.forEach((o) => {
      o.start(time);
      o.stop(stopAt);
    });
    lfo.start(time);
    lfo.stop(stopAt);
    if (noise) {
      noise.start(time);
      noise.stop(stopAt);
    }
    oscs[0].onended = () => g.disconnect();
  },
  lines: [
    { name: "Choir Chords (Am – F)", dsl: "0:A3:16 0:C4:16 0:E4:16 16:F3:16 16:A3:16 16:C4:16" },
    { name: "Talking Lead", dsl: "0:E4:3 4:G4:3 8:A4:4 12:G4:2 14:E4:2 16:D4:3 20:E4:3 24:G4:6" },
    { name: "Ooh Stabs (Dm)", dsl: "0:D4:2 0:F4:2 0:A4:2 6:D4:2 6:F4:2 6:A4:2 8:C4:2 8:E4:2 8:G4:2 14:C4:1 14:E4:1 14:G4:1" },
  ],
  ui: {
    theme: { accent: "#f472b6", lcd: "#ffb3da", lcdBg: "#1a0713", edge: "#4a2038", bg: "#26121e" },
    logo: ["", "Gm"],
    sub: "FORMANT VOICE SYNTHESIZER",
    cc: { 74: "vowel", 71: "shift", 73: "attack", 72: "release", 75: "choir", 76: "breath", 77: "vibDepth", 7: "level" },
    sections: [
      {
        title: "VOWEL PAD",
        cls: "vox-pad",
        items: [
          { type: "xy", x: { key: "vowel", label: "VOWEL", fmt: "vowel" }, y: { key: "shift", label: "VOICE SIZE", fmt: "num2" }, cls: "vowel-xy", ticks: VOWEL_NAMES },
          { type: "radio", key: "vowel", cls: "vowel-btns", options: VOWEL_NAMES.map((v, i) => [i, v]) },
        ],
      },
      {
        title: "FORMANTS",
        cls: "vox-formants",
        items: [{ type: "viz", id: "formants", cls: "viz-formants" }, { type: "row", items: [{ type: "knob", key: "sharp", label: "SHARP", fmt: "num2" }, { type: "knob", key: "bright", label: "BRIGHT", curve: "log", fmt: "hz" }] }],
      },
      {
        title: "MORPH",
        cls: "vox-morph",
        items: [{ type: "row", items: [{ type: "knob", key: "vowelTo", label: "TO VOWEL", fmt: "vowel", big: true }, { type: "knob", key: "morph", label: "TIME", fmt: "ms" }] }],
      },
      {
        title: "VOICE",
        cls: "vox-voice",
        items: [
          { type: "row", items: [{ type: "knob", key: "choir", label: "CHOIR", fmt: "cents" }, { type: "knob", key: "breath", label: "BREATH", fmt: "pct" }] },
          { type: "row", items: [{ type: "knob", key: "vibRate", label: "VIB RATE", fmt: "num1" }, { type: "knob", key: "vibDepth", label: "VIB DEPTH", fmt: "cents" }] },
        ],
      },
      {
        title: "ENVELOPE",
        cls: "vox-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATTACK", fmt: "ms" },
              { type: "fader", key: "release", label: "RELEASE", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
        ],
      },
    ],
    adsr: { a: "attack", r: "release" },
  },
};

// ============================================================ Taproot
export function renderPluck(P, pitch, vel, dur, sr) {
  const f0 = midiToFreq(pitch);
  const tone = clamp(P.tone * (0.55 + 0.45 * vel), 0, 1);
  const b = 0.5 * (1 - tone); // loop low-pass: (1-b)·x[n] + b·x[n-1]
  const decay = Math.max(0.1, P.decay);
  const length = Math.floor(
    sr * (Math.min(8, Math.min(decay * 1.1, dur + P.damp * 1.5)) + 0.05),
  );
  const out = new Float32Array(Math.max(64, length));

  // One string: delay-line length N + loop low-pass + all-pass for the fractional part.
  const string = (T, amp) => {
    const x = T - b;
    let N = Math.floor(x);
    let frac = x - N;
    if (frac < 0.1) {
      N -= 1;
      frac += 1;
    }
    N = Math.max(4, N);
    const c = (1 - frac) / (1 + frac);
    const rho = Math.pow(0.001, T / (sr * decay)); // −60 dB after `decay` seconds
    const ring = new Float32Array(N);
    // excitation: noise burst, softened by `pick`, comb-filtered by pick position
    let s = 0;
    const k = P.pick * 0.92;
    for (let i = 0; i < N; i++) {
      s = k * s + (1 - k) * (Math.random() * 2 - 1);
      ring[i] = s;
    }
    const p = Math.max(1, Math.round(P.pos * N));
    const copy = ring.slice();
    let mean = 0;
    for (let i = 0; i < N; i++) {
      ring[i] = copy[i] - copy[(i - p + N) % N];
      mean += ring[i];
    }
    mean /= N;
    let peak = 1e-9;
    for (let i = 0; i < N; i++) {
      ring[i] -= mean;
      peak = Math.max(peak, Math.abs(ring[i]));
    }
    for (let i = 0; i < N; i++) ring[i] /= peak;
    let idx = 0;
    let lpPrev = 0;
    let apX = 0;
    let apY = 0;
    for (let i = 0; i < out.length; i++) {
      const v = ring[idx];
      out[i] += v * amp;
      const lp = (1 - b) * v + b * lpPrev;
      lpPrev = v;
      const ap = c * lp + apX - c * apY;
      apX = lp;
      apY = ap;
      ring[idx] = ap * rho;
      if (++idx >= N) idx = 0;
    }
  };
  const T = sr / f0;
  string(T, 1);
  // a second string a few cents sharp gives the slow chorus of a 12-string
  if (P.twin > 0.02) string(T / Math.pow(2, 7 / 1200), P.twin * 0.8);

  // pick snap, note-off damping, level, soft clip
  const amp = (0.8 * P.level * (0.35 + 0.65 * vel)) / (1 + P.twin * 0.5);
  const nOff = dur * sr;
  const damp = Math.max(0.02, P.damp);
  const fade = Math.floor(0.01 * sr);
  for (let i = 0; i < out.length; i++) {
    const t = i / sr;
    let v = out[i];
    if (P.snap > 0 && t < 0.012) v += (Math.random() * 2 - 1) * P.snap * 0.6 * Math.exp(-t / 0.0025);
    if (i > nOff) v *= Math.exp((-6.9 * (i - nOff)) / (damp * sr));
    const tail = i > out.length - fade ? (out.length - i) / fade : 1;
    out[i] = Math.tanh(v * amp * 2) * 0.75 * tail;
  }
  return out;
}

const pluckParams = [
  range("decay", "String Decay", 0.2, 8, 0.05, 2.4),
  range("tone", "Tone", 0, 1, 0.01, 0.55),
  range("pick", "Pick Softness", 0, 1, 0.01, 0.35),
  range("pos", "Pick Position", 0.05, 0.5, 0.01, 0.2),
  range("snap", "Pick Snap", 0, 1, 0.01, 0.25),
  range("damp", "Note-off Damping", 0.03, 3, 0.01, 0.6),
  range("twin", "Twin String", 0, 1, 0.01, 0.3),
  range("body", "Body Resonance", 0, 12, 0.5, 5),
  range("bodyFreq", "Body Frequency", 80, 1200, 5, 220),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

const pluck = {
  name: "Taproot",
  tagline: "Karplus–Strong strings — nylon, harp, koto, mallets and muted bass",
  color: "#fbbf24",
  params: pluckParams,
  presets: [
    { name: "Nylon Guitar", params: {} },
    { name: "Steel Harp", params: { decay: 4, tone: 0.82, pick: 0.2, pos: 0.12, snap: 0.2, twin: 0.45, body: 3, bodyFreq: 300, damp: 1.2 } },
    { name: "Koto", params: { decay: 1.8, tone: 0.65, pick: 0.15, pos: 0.08, snap: 0.5, twin: 0.1, body: 6, bodyFreq: 420, damp: 0.5 } },
    { name: "Soft Mallet", params: { decay: 1.5, tone: 0.28, pick: 1, pos: 0.3, snap: 0, twin: 0.15, body: 4, bodyFreq: 160, damp: 0.4 } },
    { name: "Muted Bass", params: { decay: 0.7, tone: 0.3, pick: 0.5, pos: 0.25, snap: 0.2, twin: 0, body: 8, bodyFreq: 110, damp: 0.08 } },
    { name: "Dulcimer Shimmer", params: { decay: 5.5, tone: 0.9, pick: 0, pos: 0.15, snap: 0.15, twin: 0.8, body: 2, bodyFreq: 520, damp: 1.8 } },
  ],
  live: { oneShot: true, gate: 0.6 }, // plucked strings ring out
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const data = renderPluck(P, pitch, vel, dur, ctx.sampleRate);
    const chain = [];
    if (P.body > 0.1) {
      const body = ctx.createBiquadFilter();
      body.type = "peaking";
      body.frequency.value = P.bodyFreq;
      body.Q.value = 1.4;
      body.gain.value = P.body;
      chain.push(body);
    }
    playData(ctx, dest, data, time, chain);
  },
  scope: (P) => renderPluck(P, 52, 1, 0.12, 16000),
  lines: [
    { name: "Harp Arpeggio (Cm)", dsl: "0:C3:2 1:G3:2 2:C4:2 3:D#4:2 4:G4:2 5:D#4:2 6:C4:2 7:G3:2 8:G#2:2 9:D#3:2 10:G#3:2 11:C4:2 12:D#4:2 13:C4:2 14:G#3:2 15:D#3:2" },
    { name: "Koto Run (D)", dsl: "0:D4:2 2:F#4:2 4:A4:2 6:B4:2 8:A4:2 10:F#4:2 12:E4:2 14:D4:4 20:A3:2 22:D4:2 24:E4:2 26:F#4:6" },
    { name: "Folk Bass (G)", dsl: "0:G2:2 4:D3:2 6:G2:2 8:C3:2 12:G3:2 14:D3:2 16:G2:2 20:D3:2 22:B2:2 24:C3:2 28:D3:3" },
  ],
  ui: {
    theme: { accent: "#fbbf24", lcd: "#ffd97a", lcdBg: "#1b1204", edge: "#4c3a14", bg: "#2a1f0e" },
    logo: ["", "Taproot"],
    sub: "KARPLUS–STRONG STRING SYNTHESIZER",
    cc: { 74: "tone", 71: "decay", 73: "snap", 72: "damp", 75: "twin", 76: "body", 77: "bodyFreq", 7: "level" },
    sections: [
      {
        title: "STRING",
        cls: "pl-string",
        items: [
          { type: "viz", id: "scope", cls: "viz-string" },
          { type: "row", items: [{ type: "knob", key: "decay", label: "DECAY", fmt: "ms", big: true }, { type: "knob", key: "tone", label: "TONE", fmt: "pct", big: true }, { type: "knob", key: "damp", label: "DAMPING", fmt: "ms" }] },
        ],
      },
      {
        title: "PICK",
        cls: "pl-pick",
        items: [
          { type: "xy", x: { key: "pos", label: "POSITION", fmt: "pct" }, y: { key: "pick", label: "SOFTNESS", fmt: "pct" }, cls: "pick-xy", ticks: ["BRIDGE", "SOUNDHOLE"] },
          { type: "knob", key: "snap", label: "SNAP", fmt: "pct" },
        ],
      },
      {
        title: "BODY",
        cls: "pl-body",
        items: [
          { type: "row", items: [{ type: "fader", key: "body", label: "RESO", fmt: "db" }, { type: "knob", key: "bodyFreq", label: "FREQ", curve: "log", fmt: "hz" }] },
          { type: "knob", key: "twin", label: "TWIN STRING", fmt: "pct" },
        ],
      },
      {
        title: "OUTPUT",
        cls: "pl-out",
        items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }],
      },
    ],
  },
};

export const NEW_SYNTHS = { fm4, vox, pluck };

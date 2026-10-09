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

// Sine lookup table (linear interpolation) shared by every render: 4096 points is
// ~-130 dB error, far below the tanh stage, and several times cheaper than Math.sin.
const SIN_N = 4096;
const SIN = new Float32Array(SIN_N + 1);
for (let i = 0; i <= SIN_N; i++) SIN[i] = Math.sin((2 * Math.PI * i) / SIN_N);
const SIN_OFF = SIN_N * 64; // keeps (phase + modulation) positive so `|0` floors
const PH = SIN_N / (2 * Math.PI); // radians → table units

// Tiny LRU of rendered notes (immutable Float32Arrays), capped by entries and samples.
function lru(max, maxSamples) {
  const m = new Map();
  let tot = 0;
  return (key, make) => {
    let v = m.get(key);
    if (v) {
      m.delete(key);
      m.set(key, v);
      return v;
    }
    v = make();
    m.set(key, v);
    tot += v.length;
    while (m.size > max || tot > maxSamples) {
      const [k0, v0] = m.entries().next().value;
      m.delete(k0);
      tot -= v0.length;
    }
    return v;
  };
}

export function renderFm(P, pitch, vel, dur, sr) {
  const f0 = midiToFreq(pitch);
  const rel = Math.max(0.02, P.release);
  let total = Math.min(8, Math.max(0.05, dur) + rel * 1.2 + 0.03);
  const algo = Math.max(0, FM_ALGOS.indexOf(P.algo));
  const mods = FM_MOD[algo];
  const cars = FM_CARRIERS[algo];
  const level = [P.l1, P.l2, P.l3, P.l4];
  const dsec = [P.d1, P.d2, P.d3, P.d4].map((d) => Math.max(0.02, d));
  const sus = clamp(P.sustain, 0, 1);
  // no sustain: stop rendering once every carrier envelope is below -74 dB
  if (sus < 0.001) {
    let tEnd = 0;
    for (const c of cars) if (level[c] > 2e-4) tEnd = Math.max(tEnd, (dsec[c] * Math.log(level[c] / 2e-4)) / 4.6);
    total = Math.min(total, Math.max(P.attack, tEnd) + 0.03);
  }
  const n = Math.max(16, Math.floor(total * sr));
  const out = new Float32Array(n);
  const a = Math.max(0.001, P.attack) * sr;
  const [w0, w1, w2, w3] = [P.r1, P.r2, P.r3, P.r4].map((r) => (SIN_N * f0 * r) / sr);
  const [k0, k1, k2, k3] = dsec.map((d) => Math.exp(-4.6 / (d * sr)));
  const [A0, A1, A2, A3] = level.map((l) => l * sus);
  const [B0, B1, B2, B3] = level.map((l) => l * (1 - sus));
  const has = (k, j) => (mods[k].includes(j) ? 1 : 0);
  const velMod = 1 - P.vel + P.vel * vel;
  const mi = 4 * velMod * PH; // 4 rad of phase modulation at level 1
  const c01 = has(0, 1) * mi, c02 = has(0, 2) * mi, c03 = has(0, 3) * mi, c12 = has(1, 2) * mi, c23 = has(2, 3) * mi;
  const [g0, g1, g2, g3] = [0, 1, 2, 3].map((k) => (cars.includes(k) ? 1 : 0));
  const fbk = P.fb * 3 * 0.5 * PH;
  const gain = (0.5 * P.level * (0.55 + 0.45 * vel) * 2.2) / Math.sqrt(cars.length);
  const rg = Math.exp(-6.9 / (rel * sr));
  const nOff = Math.floor(dur * sr);
  const fade = Math.floor(0.01 * sr);
  let e0 = 1, e1 = 1, e2 = 1, e3 = 1;
  let p0 = 0, p1 = 0, p2 = 0, p3 = 0;
  let fb1 = 0, fb2 = 0, relGain = 1;
  let x, i0, o3, o2, o1, o0;
  for (let i = 0; i < n; i++) {
    if (i >= nOff) relGain *= rg;
    x = p3 + fbk * (fb1 + fb2) + SIN_OFF; i0 = x | 0;
    o3 = (SIN[i0 & 4095] + (SIN[(i0 & 4095) + 1] - SIN[i0 & 4095]) * (x - i0)) * (A3 + B3 * e3);
    x = p2 + c23 * o3 + SIN_OFF; i0 = x | 0;
    o2 = (SIN[i0 & 4095] + (SIN[(i0 & 4095) + 1] - SIN[i0 & 4095]) * (x - i0)) * (A2 + B2 * e2);
    x = p1 + c12 * o2 + SIN_OFF; i0 = x | 0;
    o1 = (SIN[i0 & 4095] + (SIN[(i0 & 4095) + 1] - SIN[i0 & 4095]) * (x - i0)) * (A1 + B1 * e1);
    x = p0 + c01 * o1 + c02 * o2 + c03 * o3 + SIN_OFF; i0 = x | 0;
    o0 = (SIN[i0 & 4095] + (SIN[(i0 & 4095) + 1] - SIN[i0 & 4095]) * (x - i0)) * (A0 + B0 * e0);
    e0 *= k0; e1 *= k1; e2 *= k2; e3 *= k3;
    p0 += w0; p1 += w1; p2 += w2; p3 += w3;
    if (p0 >= SIN_N) p0 %= SIN_N;
    if (p1 >= SIN_N) p1 %= SIN_N;
    if (p2 >= SIN_N) p2 %= SIN_N;
    if (p3 >= SIN_N) p3 %= SIN_N;
    fb2 = fb1;
    fb1 = o3;
    const att = i < a ? i / a : 1;
    const tail = i > n - fade ? (n - i) / fade : 1;
    x = (g0 * o0 + g1 * o1 + g2 * o2 + g3 * o3) * gain * att * relGain;
    x = x > 3 ? 1 : x < -3 ? -1 : (x * (27 + x * x)) / (27 + 9 * x * x); // fast tanh
    out[i] = x * 0.55 * tail;
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

// Presets as data. Row: [name, algo#, fb, r1,l1,d1, r2,l2,d2, r3,l3,d3, r4,l4,d4, sustain, attack, release, vel, level?]
// algo# indexes FM_ALGOS (0 stack, 1 twin, 2 fork, 3 organ). A row with only a name = the default patch.
const FM_KEYS = ["algo", "fb", "r1", "l1", "d1", "r2", "l2", "d2", "r3", "l3", "d3", "r4", "l4", "d4", "sustain", "attack", "release", "vel", "level"];
const FM_PRESETS = Object.entries({
  Keys: [
    ["Glass Keys"],
    ["Rhodes Dream", 1, 0.08, 1, 0.85, 3, 14, 0.12, 0.1, 1, 0.4, 2, 1, 0.25, 1.2, 0.25, 0.004, 0.6, 0.75, 0.68],
    ["DX Tine EP", 1, 0, 1, 0.9, 2.8, 14, 0.3, 0.08, 1, 0.5, 2.2, 1, 0.35, 1.4, 0.15, 0.002, 0.5, 0.8, 0.72],
    ["Wurly Bark", 1, 0.15, 1, 0.9, 1.8, 1, 0.55, 0.5, 1, 0.4, 1.2, 3, 0.2, 0.3, 0.3, 0.003, 0.3, 0.85, 0.86],
    ["Soft EP", 1, 0, 1, 0.8, 3.5, 1, 0.25, 1.5, 1, 0.4, 2.5, 7, 0.08, 0.2, 0.3, 0.006, 0.8, 0.6, 0.65],
    ["Digital Piano", 1, 0.05, 1, 0.9, 3, 1, 0.45, 0.9, 2, 0.4, 1.6, 5, 0.25, 0.4, 0.1, 0.002, 0.6, 0.7, 1],
    ["Harpsichord", 0, 0.2, 1, 0.85, 1.5, 3, 0.5, 0.6, 5, 0.35, 0.3, 1, 0.2, 0.2, 0, 0.002, 0.4, 0.5, 1.36],
  ],
  Bells: [
    ["Tubular Bell", 1, 0, 1, 0.8, 3.5, 3.5, 0.55, 2.5, 2.76, 0.45, 2.4, 5.4, 0.3, 1.2, 0, 0.003, 1.4, 0.5],
    ["Glockenspiel", 1, 0, 1, 0.85, 2.2, 3.5, 0.4, 1.2, 4, 0.35, 1.5, 11, 0.2, 0.4, 0, 0.002, 1.2, 0.5, 1],
    ["Celesta", 1, 0, 1, 0.85, 1.6, 4, 0.3, 0.4, 2, 0.3, 1.2, 8, 0.15, 0.2, 0, 0.002, 0.8, 0.6, 1.31],
    ["Church Bell", 2, 0.1, 1, 0.9, 3.5, 1.5, 0.55, 3, 2.75, 0.4, 2.5, 5.5, 0.3, 1.5, 0, 0.002, 2, 0.5, 0.58],
    ["Music Box", 1, 0, 2, 0.8, 1.5, 7, 0.2, 0.3, 4, 0.3, 1, 1, 0.1, 0.2, 0, 0.002, 0.7, 0.4, 1.47],
    ["Crystal Chime", 1, 0, 1, 0.7, 3, 7.25, 0.45, 2, 3, 0.35, 2.5, 13.5, 0.3, 1, 0, 0.002, 1.6, 0.5, 1],
    ["Gamelan", 2, 0, 1, 0.9, 3, 2.75, 0.4, 2, 5.25, 0.3, 1.2, 1.5, 0.2, 0.8, 0, 0.002, 1.5, 0.6, 0.58],
  ],
  Mallets: [
    ["Marimba Wood", 1, 0, 1, 0.9, 0.9, 4, 0.35, 0.1, 1, 0.3, 0.35, 10, 0.15, 0.06, 0, 0.002, 0.3, 0.6, 1.5],
    ["Vibraphone", 1, 0, 1, 0.9, 3, 4, 0.12, 0.4, 4, 0.25, 1.2, 1, 0.05, 0.3, 0, 0.002, 1, 0.5, 0.84],
    ["Xylophone", 1, 0, 1, 0.9, 0.5, 3, 0.4, 0.08, 3, 0.35, 0.25, 7, 0.2, 0.05, 0, 0.002, 0.25, 0.7, 1.5],
    ["Kalimba Tine", 1, 0, 1, 0.9, 1.2, 5, 0.3, 0.06, 6, 0.2, 0.3, 1, 0.1, 0.1, 0, 0.002, 0.4, 0.6, 1.5],
    ["Steel Pan", 2, 0.05, 1, 0.9, 1.2, 2, 0.35, 0.5, 3, 0.2, 0.3, 1, 0.15, 0.2, 0, 0.004, 0.4, 0.6, 0.9],
    ["Wood Block", 0, 0, 1, 0.9, 0.15, 1.75, 0.5, 0.06, 4.25, 0.3, 0.05, 1, 0.1, 0.05, 0, 0.002, 0.1, 0.5, 1.5],
  ],
  Bass: [
    ["FM Bass", 0, 0.35, 1, 0.9, 0.7, 1, 0.7, 0.25, 2, 0.3, 0.15, 1, 0.2, 0.2, 0.6, 0.003, 0.12, 0.5, 0.63],
    ["Lately Bass", 0, 0.2, 1, 0.9, 1.2, 1, 0.6, 0.45, 1, 0.3, 0.3, 1, 0.2, 0.2, 0.5, 0.002, 0.12, 0.6, 0.79],
    ["Solid Bass", 2, 0.1, 1, 0.95, 0.9, 1, 0.5, 0.3, 2, 0.25, 0.15, 3, 0.15, 0.1, 0.6, 0.002, 0.1, 0.6, 0.66],
    ["Rubber Bass", 1, 0, 0.5, 0.95, 1.4, 0.5, 0.5, 0.3, 1, 0.25, 0.6, 1, 0.2, 0.2, 0.5, 0.004, 0.15, 0.5, 0.86],
    ["Slap Bass", 0, 0.15, 1, 0.9, 0.8, 3, 0.5, 0.12, 1, 0.4, 0.08, 7, 0.3, 0.05, 0.35, 0.002, 0.12, 0.8, 0.88],
    ["Sub Pluck Bass", 1, 0, 1, 0.95, 0.6, 2, 0.4, 0.12, 0.5, 0.6, 0.5, 1, 0.2, 0.1, 0.1, 0.002, 0.1, 0.6, 1.5],
    ["Growl Bass", 0, 0.6, 1, 0.9, 1, 1, 0.7, 0.8, 1.5, 0.4, 0.6, 0.5, 0.35, 0.5, 0.7, 0.01, 0.12, 0.6, 0.54],
  ],
  Brass: [
    ["Brass Section", 2, 0.1, 1, 0.9, 1.4, 1, 0.5, 0.9, 2, 0.25, 0.5, 3, 0.15, 0.4, 0.7, 0.04, 0.2, 0.7],
    ["Synth Brass", 2, 0.2, 1, 0.9, 2, 1, 0.6, 1.5, 1, 0.3, 1, 2, 0.2, 0.8, 0.75, 0.06, 0.3, 0.7, 0.48],
    ["Solo Trumpet", 0, 0.15, 1, 0.9, 2, 1, 0.55, 1.6, 2, 0.3, 0.8, 1, 0.2, 0.5, 0.8, 0.03, 0.15, 0.75, 0.48],
    ["French Horn", 2, 0.05, 1, 0.9, 2, 1, 0.35, 1.5, 0.5, 0.25, 1, 2, 0.1, 0.6, 0.85, 0.07, 0.3, 0.6, 0.43],
    ["Brass Stab", 2, 0.25, 1, 0.95, 0.5, 1, 0.7, 0.25, 3, 0.3, 0.15, 1, 0.2, 0.1, 0.25, 0.008, 0.15, 0.8, 1.25],
    ["Reed Lead", 0, 0.25, 1, 0.9, 2, 2, 0.4, 1.6, 1, 0.35, 1, 3, 0.15, 0.6, 0.75, 0.04, 0.15, 0.6, 0.41],
  ],
  Organ: [
    ["Drawbar Organ", 3, 0.12, 0.5, 0.7, 4, 1, 0.8, 4, 2, 0.5, 4, 4, 0.3, 4, 1, 0.012, 0.08, 0.2, 0.56],
    ["Percussive Organ", 3, 0.1, 0.5, 0.7, 4, 1, 0.8, 4, 3, 0.6, 0.25, 2, 0.45, 4, 0.65, 0.006, 0.08, 0.2, 0.61],
    ["Church Organ", 3, 0.05, 0.5, 0.8, 4, 1, 0.7, 4, 2, 0.55, 4, 4, 0.4, 4, 1, 0.06, 0.6, 0.1, 0.54],
    ["Rock Organ", 3, 0.35, 1, 0.85, 4, 2, 0.6, 4, 3, 0.45, 4, 0.5, 0.6, 4, 1, 0.008, 0.1, 0.2, 0.45],
    ["Harmonium", 2, 0.1, 1, 0.85, 4, 1, 0.3, 4, 2, 0.25, 4, 3, 0.15, 4, 1, 0.04, 0.2, 0.2, 0.45],
    ["Flute Organ", 3, 0, 1, 0.85, 4, 2, 0.4, 4, 4, 0.15, 4, 8, 0.05, 4, 1, 0.02, 0.1, 0.1, 0.66],
  ],
  Plucks: [
    ["Clav Snap", 2, 0.2, 1, 0.9, 0.6, 3, 0.45, 0.2, 5, 0.25, 0.1, 1, 0.4, 0.3, 0.2, 0.002, 0.12, 0.7, 0.85],
    ["FM Harp", 1, 0, 1, 0.9, 2, 2, 0.3, 0.3, 1, 0.35, 1.4, 3, 0.25, 0.2, 0, 0.002, 0.8, 0.6, 0.76],
    ["Koto Pluck", 2, 0.1, 1, 0.9, 1.2, 3, 0.4, 0.15, 5, 0.2, 0.08, 1, 0.3, 0.3, 0, 0.002, 0.4, 0.7, 1],
    ["Nylon Pick", 1, 0, 1, 0.9, 1.5, 1, 0.5, 0.25, 2, 0.3, 0.6, 4, 0.2, 0.1, 0, 0.002, 0.4, 0.7, 1.33],
    ["Sitar Buzz", 0, 0.4, 1, 0.9, 2.5, 1, 0.6, 1.8, 3, 0.3, 1.5, 1, 0.2, 1, 0.05, 0.002, 0.6, 0.5, 0.64],
    ["Pizz Strings", 2, 0, 1, 0.9, 0.4, 1, 0.4, 0.12, 2, 0.25, 0.08, 3, 0.15, 0.05, 0, 0.003, 0.2, 0.6, 1.5],
    ["Glass Pluck", 1, 0.1, 1, 0.9, 0.7, 7, 0.25, 0.08, 2, 0.4, 0.4, 1, 0.2, 0.15, 0, 0.002, 0.3, 0.8, 1.5],
  ],
  Pads: [
    ["Glass Pad", 1, 0, 1, 0.8, 4, 2, 0.2, 4, 1, 0.6, 4, 3, 0.15, 4, 1, 0.4, 1.6, 0.3, 0.33],
    ["Warm FM Pad", 2, 0, 1, 0.9, 4, 1, 0.3, 4, 2, 0.15, 4, 0.5, 0.2, 4, 1, 0.35, 1.8, 0.2, 0.4],
    ["Bell Pad", 1, 0, 1, 0.8, 4, 3.5, 0.3, 3, 1, 0.6, 4, 1, 0.25, 4, 0.5, 0.3, 2, 0.3, 0.56],
    ["Vowel Pad", 2, 0.1, 1, 0.85, 4, 2, 0.2, 4, 3, 0.15, 4, 5, 0.08, 4, 1, 0.4, 2, 0.2, 0.35],
    ["FM Strings", 0, 0.15, 1, 0.9, 4, 1, 0.35, 4, 1, 0.25, 4, 3, 0.15, 4, 1, 0.25, 1.2, 0.3, 0.43],
    ["Shimmer Swell", 1, 0.05, 1, 0.8, 4, 4, 0.4, 3.5, 0.5, 0.6, 4, 7, 0.3, 2.5, 0.3, 0.5, 2.2, 0.3, 0.89],
  ],
  "FX Hits": [
    ["Metal Hit", 0, 0.7, 1, 0.8, 0.9, 1.41, 0.8, 0.5, 3.7, 0.6, 0.3, 7.2, 0.5, 0.2, 0, 0.002, 0.5, 0.8],
    ["Anvil", 2, 0.2, 1, 0.9, 1.5, 1.75, 0.7, 1, 4.25, 0.5, 0.6, 6.5, 0.4, 0.3, 0, 0.002, 0.8, 0.6, 0.9],
    ["Gong", 2, 0.3, 1, 0.9, 3, 1.25, 0.6, 2.5, 2.75, 0.4, 2, 4.25, 0.35, 1.2, 0, 0.004, 2, 0.5, 0.61],
    ["Laser Zap", 0, 0.9, 1, 0.8, 0.6, 8, 0.9, 0.3, 16, 0.6, 0.15, 1, 0.8, 0.2, 0, 0.002, 0.2, 0.8, 1.5],
    ["Noise Burst", 0, 1, 1, 0.8, 0.4, 1, 0.9, 0.3, 1, 0.9, 0.25, 1, 1, 0.2, 0, 0.002, 0.2, 0.6, 1.5],
    ["Robot Blip", 2, 0.3, 1, 0.8, 0.2, 13, 0.6, 0.1, 9.5, 0.4, 0.08, 4.75, 0.5, 0.06, 0, 0.002, 0.08, 0.7, 1.5],
  ],
}).flatMap(([cat, rows]) =>
  rows.map(([name, ...v]) => ({ name, cat, params: Object.fromEntries(v.map((x, i) => [FM_KEYS[i], i ? x : FM_ALGOS[x]])) })),
);

const fmCache = lru(96, 6e6); // ≈24 MB worst case
const fm4 = {
  name: "Coinbase",
  tagline: "4-operator FM — glass keys, bells, brass and FM bass",
  color: "#22d3ee",
  params: fmParams,
  presets: FM_PRESETS,
  live: { hold: 2.5 }, // offline-rendered: held notes render a 2.5 s gate, key-up fades
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const v = Math.round(vel * 32) / 32;
    const d = Math.round(dur * 500) / 500;
    const sr = ctx.sampleRate;
    const key = `${fmParams.map((p) => P[p.key]).join()}|${pitch}|${v}|${d}|${sr}`;
    playData(ctx, dest, fmCache(key, () => renderFm(P, pitch, v, d, sr)), time);
  },
  scope: (P) => renderFm(P, 57, 1, 0.5, 16000),
  lines: [
    { name: "Glass Keys (Am7 → Fmaj7)", dsl: "0:A3:2 2:C4:2 4:E4:2 6:G4:2 8:A3:2 10:C4:2 12:E4:2 14:G4:2 16:F3:2 18:A3:2 20:C4:2 22:E4:2 24:G3:2 26:B3:2 28:D4:2 30:F4:2" },
    { name: "Bell Chimes", dsl: "0:E5:4 6:B4:4 12:G#5:4 18:B4:4 24:E5:6" },
    { name: "FM Bassline (Em)", dsl: "0:E2:2 3:E2:1 4:G2:2 8:A2:2 11:A2:1 12:B2:2 16:E2:2 19:E2:1 20:D3:2 24:B2:2 28:A2:2" },
    { name: "Brass Riff (F)", dsl: "0:F3:2 2:F3:1 3:A3:2 6:C4:2 8:A#3:4 12:A3:2 14:G3:2 16:F3:4 22:C4:1 23:D4:1 24:F4:6" },
    { name: "Mallet Ostinato (C)", dsl: "0:C5:1 1:G4:1 2:E5:1 3:G4:1 4:D5:1 5:G4:1 6:E5:1 7:G4:1 8:C5:1 9:A4:1 10:E5:1 11:A4:1 12:F5:1 13:A4:1 14:E5:1 15:D5:1" },
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

// Estimated RMS of the voice source (3 saws + breath noise → brightness low-pass) through the
// formant bank `fm`, before the 3.2 bank gain. Used to level-match vowels, voice sizes, sharpness,
// breath and pitch so every patch sits at the same loudness. Harmonic power is averaged over a
// small pitch spread (choir / vibrato wobble) so narrow formants don't make it jumpy.
function voxRms(P, fm, f0, sr) {
  const lp = (f) => 1 / (1 + Math.pow(f / P.bright, 4)); // |H|² of the source low-pass
  const coh = Math.exp(-P.choir / 3); // 3 saws add coherently when un-detuned
  const saw2 = 0.09 * (3 + 6 * coh) * 0.2026; // (0.3·Σsaws)² · (2/π)² ; ÷n² per harmonic
  const top = Math.min(sr * 0.45, 12000);
  const spread = Math.max(8, P.choir, P.vibDepth * 0.7) / 1200;
  let pw = 0;
  for (const s of [-1, 0, 1]) {
    const f1 = f0 * Math.pow(2, s * spread);
    for (let n = 1; n * f1 < top; n++) {
      const f = n * f1;
      let re = 0;
      let im = 0;
      for (const o of fm) {
        const r = f / o.f;
        const d = r / o.q;
        const u = 1 - r * r;
        const den = u * u + d * d;
        re += (o.g * d * d) / den;
        im += (o.g * d * u) / den;
      }
      pw += ((re * re + im * im) * lp(f) * saw2) / (2 * n * n);
    }
  }
  pw /= 3;
  const nb = P.breath * 0.55;
  if (nb > 0.0055) for (const o of fm) pw += ((nb * nb) / 3) * o.g * o.g * lp(o.f) * ((Math.PI * o.f) / o.q / sr);
  return Math.sqrt(pw) * 3.2;
}
const VOX_RMS = 0.11; // target note RMS (before velocity / level)

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

// Presets as data: [name, vowel, vowelTo, morph, shift, sharp, bright, choir, vibRate, vibDepth,
// breath, attack, release, level?] grouped by category (expanded by presetTable below).
const VOX_KEYS = ["vowel", "vowelTo", "morph", "shift", "sharp", "bright", "choir", "vibRate", "vibDepth", "breath", "attack", "release", "level"];
const presetTable = (keys, groups) =>
  Object.entries(groups).flatMap(([cat, rows]) =>
    rows.map(([name, ...v]) => ({ name, cat, params: Object.fromEntries(v.map((x, i) => [keys[i], x])) })),
  );
const VOX_PRESETS = presetTable(VOX_KEYS, {
  Choir: [
    ["Ahh Choir", 0, 3, 0, 1, 1, 4500, 12, 5.2, 14, 0.12, 0.12, 0.6],
    ["Cathedral", 3, 0, 1.2, 0.85, 0.8, 3200, 32, 4.6, 18, 0.15, 0.9, 2.4],
    ["Child Choir", 1, 2, 0.6, 1.35, 1.2, 6000, 16, 5.2, 8, 0.1, 0.2, 0.8],
    ["Monks Ooh", 4, 3, 0, 0.74, 1.1, 2400, 9, 4.2, 6, 0.08, 0.35, 1.4],
    ["Gospel Oh", 3, 0, 0.5, 0.95, 1, 5200, 22, 5.8, 24, 0.1, 0.08, 0.9],
    ["Chamber Eh", 1, 3, 0, 1.05, 1.3, 5000, 10, 5.4, 12, 0.06, 0.18, 0.7],
    ["Soprano Ee", 2, 3, 0, 1.22, 1.4, 7500, 14, 6, 28, 0.05, 0.15, 0.9],
    ["Mass Choir", 0.5, 3, 0, 0.9, 0.9, 4200, 40, 4.9, 20, 0.18, 0.4, 1.6],
    ["Staccato Choir", 0, 3, 0, 1, 1, 5500, 18, 5.2, 0, 0.08, 0.01, 0.18],
    ["Om Chant", 3, 4, 1.2, 0.76, 1.3, 2600, 8, 0.8, 3, 0.12, 0.6, 2],
  ],
  Pads: [
    ["Ooo Pad", 4, 3, 0, 0.92, 1, 4500, 20, 5.2, 10, 0.2, 0.5, 1.2],
    ["Vowel Drift", 0, 4, 2, 0.9, 0.9, 3600, 26, 3.2, 10, 0.14, 1.2, 2.5, 1.2],
    ["Glass Ee Pad", 2, 1, 1.6, 1.3, 1.8, 8500, 30, 2.4, 6, 0.04, 0.8, 2.2],
    ["Warm Oh Pad", 3, 3, 0, 0.8, 0.7, 2200, 20, 3.8, 8, 0.12, 0.7, 2],
    ["Dusk Aah", 0, 3, 1.8, 0.82, 0.6, 2800, 36, 4.4, 14, 0.22, 1.1, 2.8],
    ["Angel Pad", 1.5, 3, 0, 1.18, 1.5, 7000, 38, 5, 16, 0.1, 1, 3],
    ["Wide Mmm", 4, 3, 0, 0.72, 0.55, 1200, 28, 3, 4, 0.05, 0.6, 1.8],
  ],
  Leads: [
    ["Diva Lead", 0, 3, 0, 1.12, 1.3, 7500, 3, 5.6, 34, 0.06, 0.06, 0.5],
    ["Tenor Lead", 3, 0, 0.25, 0.88, 1.2, 5500, 2, 5.2, 22, 0.05, 0.05, 0.4],
    ["Synth Vox Lead", 1, 3, 0, 1, 1.6, 9000, 7, 6.5, 10, 0, 0.02, 0.25],
    ["Ee Saw Lead", 2, 3, 0, 1.05, 0.6, 9000, 10, 5, 8, 0, 0.02, 0.3],
    ["Soul Oh", 3, 3, 0, 0.96, 1.1, 4800, 4, 4.8, 40, 0.1, 0.1, 0.6],
    ["Yodel Lead", 4, 2, 0.12, 1.08, 1, 6500, 3, 7, 18, 0.12, 0.02, 0.3],
    ["Siren Lead", 0, 2, 0.8, 1.25, 1.5, 8000, 5, 8.5, 50, 0.03, 0.05, 0.5],
  ],
  Talk: [
    ["Wah Lead", 0, 4, 0.45, 1, 1, 6500, 4, 5.2, 22, 0.05, 0.03, 0.25],
    ["Yoy Talker", 2, 3, 0.3, 1, 1, 4500, 6, 5.2, 8, 0.12, 0.02, 0.2],
    ["Talkbox Wow", 4, 0, 0.18, 1, 1.5, 7000, 0, 5.2, 0, 0, 0.01, 0.12],
    ["Yeah Talk", 2, 0, 0.22, 1, 1.3, 6000, 2, 5.2, 6, 0.12, 0.02, 0.2],
    ["Oy Funk", 3, 2, 0.15, 0.95, 1.6, 8000, 0, 5.2, 0, 0, 0.01, 0.1],
    ["Ooh-Wee", 4, 2, 0.4, 1.1, 1.4, 7000, 6, 6, 12, 0.12, 0.03, 0.35],
    ["Vocoder Wow", 4, 0, 1, 0.95, 1.8, 9000, 8, 5.2, 0, 0.02, 0.05, 0.6],
  ],
  Breath: [
    ["Whisper", 1, 3, 0, 1, 1, 2500, 0, 5.2, 0, 0.95, 0.15, 0.5],
    ["Breathy Aah", 0, 3, 0, 1, 1, 3500, 10, 5.2, 6, 0.6, 0.25, 1],
    ["Hush Pad", 4, 3, 1.5, 0.9, 0.8, 2200, 24, 5.2, 4, 0.8, 0.9, 2.4],
    ["Sigh", 0, 4, 1.2, 0.92, 1, 3000, 6, 5.2, 0, 0.7, 0.3, 1.4],
    ["Airy Ee", 2, 3, 0, 1.2, 1.6, 8000, 16, 5.2, 10, 0.5, 0.4, 1.5],
    ["Ghost Hiss", 1, 4, 2, 1.3, 2, 9000, 0, 5.2, 0, 1, 0.6, 2],
  ],
  Robot: [
    ["Robot Vox", 2, 1, 0, 1.1, 1.9, 7000, 0, 5.2, 0, 0, 0.01, 0.1],
    ["Toy Speaker", 1, 3, 0.08, 1.05, 2, 4000, 0, 5.2, 0, 0, 0.01, 0.06],
    ["Droid Ah", 0, 3, 0, 0.78, 2, 9000, 0, 9, 4, 0, 0.01, 0.15],
    ["Vocoder Pad", 3, 1, 1.4, 1, 1.9, 9000, 3, 5.2, 0, 0.03, 0.3, 1.2],
    ["Cyborg Choir", 2, 0, 0.6, 0.9, 1.8, 8000, 1, 5.2, 0, 0, 0.1, 0.8],
    ["Circuit Ee", 2, 3, 0, 1.4, 2, 9000, 0, 9, 60, 0, 0.01, 0.2],
  ],
  Bass: [
    ["Bass Vox", 4, 3, 0, 0.72, 1.2, 2400, 4, 5.2, 0, 0, 0.01, 0.15],
    ["Oh Bass", 3, 4, 0.2, 0.75, 1.4, 3000, 6, 5.2, 0, 0.02, 0.01, 0.2],
    ["Wow Bass", 4, 0, 0.3, 0.8, 1.7, 4500, 2, 5.2, 0, 0, 0.01, 0.12],
    ["Throat Drone", 0, 3, 0, 0.7, 1.9, 3500, 3, 0.5, 6, 0.1, 0.5, 1.5],
    ["Basso Profundo", 3, 3, 0, 0.7, 0.9, 1800, 12, 4.5, 12, 0.08, 0.2, 1],
  ],
  FX: [
    ["Alien Chant", 2, 4, 2, 1.4, 2, 6000, 40, 0.7, 60, 0.2, 0.8, 2.5],
    ["Haunted Hall", 4, 3, 2, 0.72, 0.5, 1500, 40, 1.2, 45, 0.4, 1.5, 3, 1.4],
    ["Laughing Gas", 0, 1, 0.05, 1.4, 1.2, 7000, 20, 9, 60, 0.12, 0.01, 0.3],
    ["Tape Choir", 0, 3, 0, 0.95, 1, 2000, 6, 0.6, 35, 0.25, 0.3, 1.2],
    ["Crowd Murmur", 1, 3, 1.5, 0.9, 0.6, 2500, 40, 2, 40, 0.5, 0.5, 1.5],
    ["Gargle Bot", 0, 4, 0.1, 1.15, 2, 9000, 30, 9, 45, 0.3, 0.01, 0.4],
  ],
});

const vox = {
  name: "Gm",
  tagline: "Formant voice — vowel choirs, talking leads and breathy pads",
  color: "#f472b6",
  params: voxParams,
  presets: VOX_PRESETS,
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
    // level-match: each formant set is scaled to the same estimated RMS (clamped so a
    // note with nothing in its formants is not boosted into noise)
    // (low notes are spikier pulse trains, so they get a little less RMS to keep peaks in check)
    const target = 3.2 * VOX_RMS * Math.min(1, Math.pow(f0 / 160, 0.3));
    const norm = (fm) => target / clamp(voxRms(P, fm, f0, ctx.sampleRate), 0.02, 3);
    // the bank gain follows the morph path (formants glide linearly in Hz, as the filters do)
    bank.gain.setValueAtTime(norm(from), time);
    const SEG = 8;
    if (to !== from)
      for (let j = 1; j <= SEG; j++) {
        const t = j / SEG;
        const mid = from.map((a, k) => ({ f: a.f + (to[k].f - a.f) * t, g: a.g + (to[k].g - a.g) * t, q: a.q + (to[k].q - a.q) * t }));
        bank.gain.linearRampToValueAtTime(norm(mid), time + P.morph * t);
      }
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
      g.gain.setValueAtTime(fm.g, time);
      if (to !== from) g.gain.linearRampToValueAtTime(to[k].g, time + P.morph);
      lp.connect(bp).connect(g).connect(bank);
    });
    // amplitude envelope
    const g = ctx.createGain();
    const peak = Math.max(0.001, vel * P.level);
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
    { name: "Vox Bass Groove (Cm)", dsl: "0:C2:2 3:C2:1 4:D#2:2 6:C2:1 8:G2:2 11:F2:1 12:D#2:2 14:C2:2 16:G#1:2 19:G#1:1 20:C2:2 24:A#1:2 27:A#1:1 28:D2:3" },
    { name: "Monk Chant (D)", dsl: "0:D3:8 8:E3:4 12:F3:4 16:E3:8 24:D3:8 32:A2:8 40:C3:4 44:D3:12" },
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
export function renderPluck(P, pitch, vel, dur, sr, seed = 1) {
  const f0 = midiToFreq(pitch);
  const tone = clamp(P.tone * (0.55 + 0.45 * vel), 0, 1);
  const b = 0.5 * (1 - tone); // loop low-pass: (1-b)·x[n] + b·x[n-1]
  const decay = Math.max(0.1, P.decay);
  const length = Math.floor(
    sr * (Math.min(8, Math.min(decay * 1.1, dur + P.damp * 1.5)) + 0.05),
  );
  const out = new Float32Array(Math.max(64, length));
  // seeded noise (mulberry32) so a cached note is reproducible
  let st = (seed * 0x9e3779b9) >>> 0;
  const rnd = () => {
    st = (st + 0x6d2b79f5) >>> 0;
    let t = Math.imul(st ^ (st >>> 15), 1 | st);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 2147483648 - 1;
  };

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
      s = k * s + (1 - k) * rnd();
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
    const g = amp / peak;
    for (let i = 0; i < N; i++) ring[i] *= g;
    let idx = 0;
    let lpPrev = 0;
    let apX = 0;
    let apY = 0;
    const L = out.length;
    for (let i = 0; i < L; i++) {
      const v = ring[idx];
      out[i] += v;
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

  // pick snap, onset softening, note-off damping, level, soft clip
  const amp = (0.92 * P.level * (0.35 + 0.65 * vel)) / (1 + P.twin * 0.5);
  const nOff = Math.floor(dur * sr);
  const dk = Math.exp(-6.9 / (Math.max(0.02, P.damp) * sr));
  const L = out.length;
  const fade = Math.floor(0.01 * sr);
  const on = Math.max(1, Math.floor(0.0015 * sr)); // 1.5 ms raised-cosine onset: no step, keeps the attack
  const snapN = Math.floor(0.012 * sr);
  const snapK = Math.exp(-1 / (0.0025 * sr));
  let snapE = P.snap * 0.6;
  let sLp = 0;
  let off = 1;
  let lpY = 0;
  const g15 = 0.0015 * sr;
  const glideN = Math.floor(0.007 * sr);
  for (let i = 0; i < L; i++) {
    let v = out[i];
    if (i < snapN && snapE > 0) {
      sLp += 0.6 * (rnd() - sLp); // snap noise, gently low-passed so it ticks rather than spits
      v += sLp * snapE;
      snapE *= snapK;
    }
    if (i > nOff) v *= off *= dk;
    if (i < on) v *= 0.5 - 0.5 * Math.cos((Math.PI * i) / on);
    if (i < glideN) {
      // pick-onset softening: a low-pass that glides open over the first ~6 ms,
      // so the raw noise burst does not spit; the ringing string is untouched
      lpY += (1 - Math.exp((-2 * Math.PI * Math.min(sr * 0.45, 1500 * Math.pow(2, i / g15))) / sr)) * (v - lpY);
      v = lpY;
    }
    if (i > L - fade) v *= (L - i) / fade;
    v *= amp * 2;
    out[i] = (v > 3 ? 1 : v < -3 ? -1 : (v * (27 + v * v)) / (27 + 9 * v * v)) * 0.75;
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

const PLUCK_KEYS = ["decay", "tone", "pick", "pos", "snap", "damp", "twin", "level"]; // body EQ is a node, not baked in
const plCache = lru(128, 6e6);
const PLUCK_PK = ["decay", "tone", "pick", "pos", "snap", "damp", "twin", "body", "bodyFreq", "level"];
const pluck = {
  name: "Taproot",
  tagline: "Karplus–Strong strings — nylon, harp, koto, mallets and muted bass",
  color: "#fbbf24",
  params: pluckParams,
  // Row: [name, decay, tone, pick, pos, snap, damp, twin, body, bodyFreq, level?]; a lone name = the default patch.
  presets: Object.entries({
    "Guitar Pluck": [
      ["Nylon Guitar"],
      ["Steel String", 3.2, 0.75, 0.2, 0.15, 0.3, 0.7, 0.15, 4, 180],
      ["Twelve String", 3.5, 0.78, 0.2, 0.15, 0.25, 0.8, 0.7, 3.5, 200],
      ["Palm Muted", 0.9, 0.4, 0.4, 0.2, 0.35, 0.05, 0, 6, 140],
      ["Jazz Archtop", 1.8, 0.35, 0.6, 0.3, 0.1, 0.4, 0.05, 7, 160],
      ["Funk Scratch", 0.5, 0.85, 0.1, 0.1, 0.6, 0.04, 0, 3, 600],
      ["Clean Electric", 4, 0.6, 0.3, 0.18, 0.15, 0.5, 0.1, 2, 350],
      ["Ukulele", 1.2, 0.6, 0.4, 0.25, 0.2, 0.3, 0.1, 8, 420],
      ["Flamenco Strum", 2, 0.8, 0.1, 0.1, 0.7, 0.25, 0.3, 6, 260],
    ],
    "Harp Pluck": [
      ["Steel Harp", 4, 0.82, 0.2, 0.12, 0.2, 1.2, 0.45, 3, 300],
      ["Concert Harp", 5, 0.55, 0.5, 0.3, 0.05, 1.5, 0.1, 3, 250],
      ["Celtic Harp", 3.5, 0.7, 0.3, 0.2, 0.15, 1, 0.2, 4, 330],
      ["Dulcimer Shimmer", 5.5, 0.9, 0, 0.15, 0.15, 1.8, 0.8, 2, 520],
      ["Hammered Dulcimer", 4.5, 0.85, 0, 0.1, 0.4, 1.2, 0.6, 3, 600],
      ["Zither", 5, 0.8, 0.15, 0.12, 0.2, 1.5, 0.4, 4, 450],
      ["Lyre", 3, 0.5, 0.5, 0.35, 0.05, 1, 0.15, 5, 300],
    ],
    "World Pluck": [
      ["Koto", 1.8, 0.65, 0.15, 0.08, 0.5, 0.5, 0.1, 6, 420],
      ["Shamisen", 1.2, 0.8, 0.05, 0.06, 0.8, 0.3, 0, 9, 500],
      ["Sitar Drone", 6, 0.95, 0.05, 0.07, 0.35, 1.5, 0.9, 5, 700],
      ["Oud", 1.8, 0.5, 0.3, 0.18, 0.4, 0.4, 0.2, 8, 200],
      ["Banjo", 1.1, 0.9, 0.05, 0.1, 0.7, 0.3, 0.1, 6, 700],
      ["Mandolin", 1.6, 0.85, 0.1, 0.12, 0.45, 0.4, 0.85, 6, 550],
      ["Pipa", 1.5, 0.75, 0.1, 0.1, 0.6, 0.35, 0.05, 7, 450],
      ["Guzheng", 3.5, 0.7, 0.15, 0.1, 0.4, 0.9, 0.15, 5, 380],
    ],
    "Bass Pluck": [
      ["Muted Bass", 0.7, 0.3, 0.5, 0.25, 0.2, 0.08, 0, 8, 110],
      ["Upright Bass", 2.2, 0.3, 0.6, 0.3, 0.25, 0.25, 0, 9, 95],
      ["Fingered Bass", 2.5, 0.45, 0.45, 0.25, 0.2, 0.15, 0, 6, 120],
      ["Picked Bass", 2, 0.7, 0.15, 0.12, 0.45, 0.15, 0, 5, 160],
      ["Fretless Bass", 3, 0.35, 0.7, 0.35, 0.05, 0.3, 0.05, 6, 110],
      ["Dub Sub Pluck", 1.4, 0.15, 0.9, 0.4, 0, 0.12, 0, 10, 85],
      ["Slap Pop", 1.2, 0.9, 0, 0.06, 0.9, 0.1, 0, 4, 250],
    ],
    "Mallet Pluck": [
      ["Soft Mallet", 1.5, 0.28, 1, 0.3, 0, 0.4, 0.15, 4, 160],
      ["Kalimba", 1.4, 0.6, 0.6, 0.25, 0.4, 0.3, 0, 5, 600],
      ["Mbira Buzz", 1.6, 0.75, 0.4, 0.2, 0.5, 0.4, 0.35, 3.5, 500],
      ["Felt Piano", 2.2, 0.3, 0.95, 0.35, 0, 0.3, 0.1, 4, 200],
      ["Music Box Tine", 1.8, 0.85, 0.3, 0.08, 0.3, 0.6, 0.05, 3, 900],
      ["Wood Pluck", 0.4, 0.5, 0.5, 0.3, 0.6, 0.1, 0, 10, 350],
    ],
    "Orch Pluck": [
      ["Pizzicato Violin", 0.8, 0.6, 0.4, 0.2, 0.3, 0.2, 0.1, 5, 450],
      ["Pizz Cello", 1.4, 0.45, 0.5, 0.22, 0.25, 0.25, 0.1, 9, 180],
      ["Pizz Ensemble", 1, 0.55, 0.45, 0.2, 0.25, 0.25, 0.8, 7, 300],
      ["Harpsichord Quill", 2.5, 0.95, 0, 0.07, 0.5, 0.6, 0.5, 3, 800],
      ["Clavinet", 0.7, 0.95, 0.1, 0.06, 0.7, 0.06, 0, 5, 700],
      ["Piano String", 4, 0.65, 0.2, 0.12, 0.35, 0.8, 0.3, 5, 240],
    ],
    "Ambient Pluck": [
      ["Glass Drops", 6, 0.9, 0.2, 0.05, 0.1, 2.5, 0.6, 2, 1100],
      ["Rain Harp", 7, 0.65, 0.5, 0.25, 0, 3, 0.5, 3, 500],
      ["Dream Pluck", 5, 0.45, 0.8, 0.4, 0, 2, 0.9, 4, 350],
      ["Frozen Lake", 8, 0.8, 0.4, 0.07, 0.05, 3, 1, 2, 900],
      ["Lofi Dust", 1.5, 0.25, 0.85, 0.3, 0.15, 0.5, 0.25, 8, 250],
      ["Night Bells", 6.5, 0.95, 0.1, 0.05, 0.2, 2.5, 0.35, 1, 1200, 0.7],
      ["Echo Seeds", 4, 0.55, 0.6, 0.33, 0.05, 1.5, 0.7, 4, 280],
    ],
  }).flatMap(([cat, rows]) => rows.map(([name, ...v]) => ({ name, cat, params: Object.fromEntries(v.map((x, i) => [PLUCK_PK[i], x])) }))),
  live: { oneShot: true, gate: 0.6 }, // plucked strings ring out
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const v = Math.round(vel * 32) / 32;
    const d = Math.round(dur * 500) / 500;
    const sr = ctx.sampleRate;
    const seed = 1 + (Math.floor(time * 1000) & 3); // 4 noise takes, picked by start time (no shared state)
    const key = `${PLUCK_KEYS.map((k) => P[k]).join()}|${pitch}|${v}|${d}|${sr}|${seed}`;
    const data = plCache(key, () => renderPluck(P, pitch, v, d, sr, seed));
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
    { name: "Banjo Roll (G)", dsl: "0:G3:1 1:B3:1 2:D4:1 3:G4:1 4:B3:1 5:D4:1 6:G4:1 7:B3:1 8:C4:1 9:E4:1 10:G4:1 11:C5:1 12:D4:1 13:F#4:1 14:A4:1 15:D5:1" },
    { name: "Ambient Drops (Em9)", dsl: "0:E4:4 6:B4:4 10:F#5:4 16:G4:4 22:D5:6 32:C5:4 38:G4:4 44:B4:8" },
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

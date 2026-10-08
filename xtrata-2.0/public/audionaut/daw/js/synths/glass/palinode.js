// synths/glass/palinode.js — PALINODE, a "memory-metal" additive synthesiser, ported from the
// standalone palinode.html for the Audionaut synth bank.
//
// Idea: a strike creates twelve partials in a deformed, non-harmonic arrangement. While the
// note is held they "remember" their harmonic ratios and recover at different speeds (the
// fundamental stays anchored to the played pitch). On release the pattern recoils the other
// way by an amount that depends on how much memory the note stored, so HOW LONG a note is
// held changes how it falls away. Gate length (dur) and velocity keep exactly that meaning
// here: the whole annealing history is computed per note from dur/vel.
//
// Rendered sample-by-sample (stereo) into one AudioBuffer: no AudioWorklet, no shared state
// except an LRU cache of finished buffers. No imports.

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const N_PART = 12;
const TWO_PI = Math.PI * 2;
// each overtone's fixed "direction" of deformation, in semitones per unit deformation
const SIGNATURE = [0, 3.05, -2.1, 5.2, -3.2, 3.6, -4.1, 6.3, -2.3, 7.1, -5.2, 8.2];
const MEM_EXP = Array.from({ length: N_PART }, (_, j) => 0.68 + j * 0.095);
const PAN_BASE = Array.from({ length: N_PART }, (_, j) => (j === 0 ? 0 : Math.sin(j * 2.399963) * 0.67));
const LN2_12 = Math.LN2 / 12;

const MAX_TOTAL = 8; // seconds, hard cap on rendered buffer
const OUT_GAIN = 1.6; // the standalone page ran quiet (master 68%); bring it to host level

/**
 * Render one PALINODE note. Returns { L, R } Float32Arrays at `sr`.
 * pitch = MIDI note, vel = 0..~1.5, dur = gate length (s).
 * opts.maxLen (s) stops the render early (used by the panel scope).
 */
export function renderPalinode(P, pitch, vel, dur, sr, opts = {}) {
  if (!(vel > 0) || !Number.isFinite(vel) || !Number.isFinite(pitch)) {
    return { L: new Float32Array(64), R: new Float32Array(64) };
  }
  sr = clamp(sr || 44100, 8000, 192000);
  pitch = clamp(pitch, 0, 127);
  dur = Number.isFinite(dur) ? Math.max(0.01, dur) : 0.5;
  const va = Math.pow(Math.min(vel, 1.5), 1.25); // loudness
  const vs = clamp(vel, 0, 1); // spectral shaping (the original's velocity is 0..1)

  const deform = clamp(P.deform, 0, 1);
  const recall = clamp(P.recall, 0, 1);
  const memoryT = clamp(P.memory, 0.06, 8);
  const edge = clamp(P.edge, 0, 1);
  const contact = clamp(P.contact, 0.06, 0.94);
  const orbit = clamp(P.orbit, 0, 1);
  const recoil = clamp(P.recoil, 0, 1);
  const strain = clamp(P.strain, -1, 1);
  const heat = clamp(P.heat, 0, 1);
  const mod = clamp(P.mod, 0, 1);
  const level = clamp(P.level, 0, 1.5);
  const sustain = clamp(P.sustain, 0, 1);
  const attack = clamp(P.attack, 0.002, 3);
  const decay = clamp(P.decay, 0.03, 4);
  const releaseReq = clamp(P.release, 0.015, 8);
  const widthScale = 0.4 + 1.2 * clamp(P.space, 0, 1);

  const f0 = midiToFreq(pitch);

  // timeline: the gate is held for `hold`, then the cubic release runs for `rel`
  const hold = Math.min(dur, MAX_TOTAL - 0.3);
  const rel = Math.max(0.1, Math.min(releaseReq, (MAX_TOTAL - hold) / 0.93));
  const relSamples = Math.round(rel * sr);
  const nOff = Math.round(hold * sr);
  let total = nOff + Math.round(relSamples * 0.93);
  if (opts.maxLen) total = Math.min(total, Math.round(opts.maxLen * sr));
  const L = new Float32Array(total);
  const R = new Float32Array(total);

  // note-constant partial data
  const brightness = clamp(edge + (vs - 0.5) * 0.23 + (heat - 0.25) * 0.18, 0, 1);
  const slope = 2.0 - brightness * 1.48;
  const baseW = new Float64Array(N_PART); // strike comb * spectral tilt
  const panL = new Float64Array(N_PART);
  const panR = new Float64Array(N_PART);
  for (let j = 0; j < N_PART; j++) {
    const h = j + 1;
    const s = Math.sin(Math.PI * h * contact);
    baseW[j] = j === 0 ? 0 : Math.pow(h, -slope) * (0.18 + 0.82 * s * s);
    const pan = clamp(PAN_BASE[j] * widthScale, -0.95, 0.95);
    panL[j] = Math.sqrt((1 - pan) * 0.5);
    panR[j] = Math.sqrt((1 + pan) * 0.5);
  }
  // how fast the note gathers itself: heat speeds recovery, hard strikes slow it a little
  const tau = memoryT * Math.pow(2, (0.25 - heat) * 3) * (1.18 - 0.36 * vs);
  const tauRel = 0.16 + memoryT * 0.045;
  const memOff = 1 - Math.exp(-hold / tau); // memory stored when the gate closes
    const nyq = sr * 0.465;
  const nyqW = sr * 0.075;
  const incMax = sr * 0.47;

  // envelope state (per-sample, as in the original)
  const attackInc = 1 / (attack * sr);
  const decayCoef = 1 - Math.exp(-6.9 / (decay * sr));
  let decayLeft = Math.round(decay * sr);
  const sustainK = 1 - Math.exp(-1 / (0.012 * sr));
  let env = 0;
  let stage = 0; // 0 attack, 1 decay, 2 sustain, 3 release
  let relPos = 0;
  let relStart = 0;
  const relInc = 1 / (rel * sr);

  // oscillator state: one rotating phasor (x = cos, y = sin) per partial
  const px = new Float64Array(N_PART);
  const py = new Float64Array(N_PART);
  const inc = new Float64Array(N_PART); // radians / sample at the end of the previous block
  const amp = new Float64Array(N_PART);
  const tInc = new Float64Array(N_PART);
  const tAmp = new Float64Array(N_PART);
  const weights = new Float64Array(N_PART);
  for (let j = 0; j < N_PART; j++) {
    const ph0 = (((j * 0.137 + vs * 0.071) % 1) * TWO_PI);
    px[j] = Math.cos(ph0);
    py[j] = Math.sin(ph0);
  }
  const act = new Int32Array(N_PART);

  let rng = (Math.round(pitch) * 374761393) | 0 || 1;
  let noiseLast = 0;
  const gain = level * OUT_GAIN;

  // Per-block targets (values at time te). Fills weights[] and tInc[]; returns summed weight.
  function target(te, held) {
    const mem = held ? 1 - Math.exp(-te / tau) : memOff;
    const relax = held ? 0 : 1 - Math.exp(-(te - hold) / tauRel);
    const vib = mod > 0 ? Math.sin(te * TWO_PI * 4.7) * mod * 0.24 : 0; // semitones
    const base = vib ? f0 * Math.exp(vib * LN2_12) : f0;
    const bloom = 0.35 * mem * recall;
    const defBase = deform * (0.55 + 0.7 * vs);
    const defStrain = strain * 0.64 - recoil * 0.76 * mem * relax;
    const flutAmt = orbit * 0.045 + mod * 0.035;
    const logMem = mem > 0 ? Math.log(mem) : -Infinity;
    let sum = 0;
    for (let j = 0; j < N_PART; j++) {
      let ratio = 1;
      if (j > 0) {
        const mm = mem > 0 ? Math.exp(MEM_EXP[j] * logMem) : 0;
        const deformation = defBase * (1 - recall * mm) + defStrain;
        const flutter = flutAmt > 0 ? flutAmt * Math.sin(te * (1.1 + j * 0.083) * TWO_PI + j * 1.79) : 0;
        ratio = (j + 1) * Math.exp((SIGNATURE[j] * deformation + flutter) * LN2_12);
      }
      const frequency = base * ratio;
      const aa = clamp((nyq - frequency) / nyqW, 0, 1);
      let w;
      if (j === 0) w = 1.72;
      else if (aa <= 0) w = 0;
      else {
        const ring = 0.29 + 0.71 * Math.exp(-te * (0.85 + j * 0.31));
        const orb = orbit > 0 ? 1 + orbit * 0.55 * Math.sin(te * (0.9 + j * 0.061) * TWO_PI + j * 1.11) : 1;
        w = baseW[j] * (ring + bloom) * orb;
      }
      w *= aa;
      weights[j] = w;
      sum += w;
      tInc[j] = (Math.min(incMax, frequency) * TWO_PI) / sr;
    }
    return sum;
  }

  const B = Math.max(32, Math.round(sr / 350));
  const bl = new Float64Array(B);
  const br = new Float64Array(B);
  target(0, true); // start deformed; amplitudes ramp up from silence over the first block
  for (let j = 0; j < N_PART; j++) inc[j] = tInc[j];

  let pos = 0;
  const normK = 0.46 * va;
  while (pos < total) {
    let n = Math.min(B, total - pos);
    if (pos < nOff) n = Math.min(n, nOff - pos);
    if (pos >= nOff && stage !== 3) {
      stage = 3;
      relStart = env;
      relPos = 0;
    }
    const te = (pos + n) / sr;
    const held = pos + n <= nOff;
    const sum = target(te, held);
    const norm = normK / Math.max(1.5, sum);
    let na = 0;
    for (let j = 0; j < N_PART; j++) {
      tAmp[j] = weights[j] * norm;
      if (amp[j] > 1e-9 || tAmp[j] > 1e-9) act[na++] = j;
    }
    bl.fill(0, 0, n);
    br.fill(0, 0, n);
    const invN = 1 / n;
    for (let a = 0; a < na; a++) {
      const j = act[a];
      const w = 0.5 * (inc[j] + tInc[j]); // mean of the linear frequency ramp
      const c = Math.cos(w);
      const sn = Math.sin(w);
      let x = px[j];
      let y = py[j];
      let am = amp[j];
      const ad = (tAmp[j] - am) * invN;
      const pl = panL[j];
      const pr = panR[j];
      for (let k = 0; k < n; k++) {
        const nx = x * c - y * sn;
        y = x * sn + y * c;
        x = nx;
        am += ad;
        const v = y * am;
        bl[k] += v * pl;
        br[k] += v * pr;
      }
      const rn = 1 / Math.sqrt(x * x + y * y); // keep the phasor on the unit circle
      px[j] = x * rn;
      py[j] = y * rn;
      amp[j] = tAmp[j];
      inc[j] = tInc[j];
    }
    for (let j = 0; j < N_PART; j++) {
      if (!(amp[j] > 1e-9 || tAmp[j] > 1e-9)) {
        amp[j] = 0;
        inc[j] = tInc[j];
      }
    }
    const noiseLevel = 0.004 * edge * vs * Math.exp(-te / 0.009);
    for (let k = 0; k < n; k++) {
      // envelope
      if (stage === 0) {
        env += attackInc;
        if (env >= 1) {
          env = 1;
          stage = 1;
        }
      } else if (stage === 1) {
        env += (sustain - env) * decayCoef;
        if (--decayLeft <= 0) stage = 2;
      } else if (stage === 2) env += (sustain - env) * sustainK;
      else {
        relPos += relInc;
        const t = Math.max(0, 1 - relPos);
        env = relStart * t * t * t;
      }
      let vl = bl[k];
      let vr = br[k];
      if (noiseLevel > 1e-7) {
        let r = rng;
        r ^= r << 13;
        r ^= r >>> 17;
        r ^= r << 5;
        rng = r;
        const noise = r / 2147483648;
        const hit = (noise - noiseLast) * noiseLevel;
        noiseLast = noise;
        vl += hit;
        vr += hit;
      }
      const g = env * gain;
      let l = vl * g;
      let r2 = vr * g;
      // soft ceiling (as in the original): knee at 0.75, asymptote 0.95
      if (l > 0.75) l = 0.75 + 0.2 * (1 - Math.exp(-(l - 0.75) * 5));
      else if (l < -0.75) l = -0.75 - 0.2 * (1 - Math.exp(-(-l - 0.75) * 5));
      if (r2 > 0.75) r2 = 0.75 + 0.2 * (1 - Math.exp(-(r2 - 0.75) * 5));
      else if (r2 < -0.75) r2 = -0.75 - 0.2 * (1 - Math.exp(-(-r2 - 0.75) * 5));
      L[pos + k] = l;
      R[pos + k] = r2;
    }
    pos += n;
  }
  // tail fade (a few ms) so a truncated render never ends on a step
  const fade = Math.min(total, Math.floor(0.012 * sr));
  for (let i = 0; i < fade; i++) {
    const f = i / fade;
    L[total - 1 - i] *= f;
    R[total - 1 - i] *= f;
  }
  return { L, R };
}

// ------------------------------------------------------------------ cache
const CACHE_BUDGET = 5_000_000; // frames (~40 MB of stereo float32)
const cache = new Map();
let cacheFrames = 0;
function renderCached(P, pitch, vel, dur, sr) {
  const key =
    sr + "|" + pitch + "|" + vel.toFixed(3) + "|" + dur.toFixed(3) + "|" +
    PARAM_KEYS.map((k) => P[k]).join(",");
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit); // refresh LRU position
    return hit;
  }
  const r = renderPalinode(P, pitch, vel, dur, sr);
  cache.set(key, r);
  cacheFrames += r.L.length;
  while (cacheFrames > CACHE_BUDGET && cache.size > 1) {
    const oldest = cache.keys().next().value;
    cacheFrames -= cache.get(oldest).L.length;
    cache.delete(oldest);
  }
  return r;
}

// ------------------------------------------------------------------ definition
const params = [
  range("deform", "Deformation", 0, 1, 0.01, 0.64),
  range("recall", "Recall", 0, 1, 0.01, 0.97),
  range("memory", "Memory Time", 0.06, 8, 0.01, 1.8),
  range("edge", "Edge", 0, 1, 0.01, 0.62),
  range("contact", "Strike Point", 0.06, 0.94, 0.01, 0.27),
  range("orbit", "Orbit", 0, 1, 0.01, 0.18),
  range("recoil", "Recoil", 0, 1, 0.01, 0.6),
  range("space", "Space (Width)", 0, 1, 0.01, 0.22),
  range("strain", "Strain", -1, 1, 0.01, 0),
  range("heat", "Heat", 0, 1, 0.01, 0.25),
  range("mod", "Modulation", 0, 1, 0.01, 0),
  range("attack", "Attack", 0.002, 3, 0.001, 0.006),
  range("decay", "Decay", 0.03, 4, 0.01, 0.65),
  range("sustain", "Sustain", 0, 1, 0.01, 0.42),
  range("release", "Release", 0.015, 8, 0.01, 2.8),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];
const PARAM_KEYS = params.map((p) => p.key);
const DEFAULTS = Object.fromEntries(params.map((p) => [p.key, p.def]));
const withDefaults = (P) => ({ ...DEFAULTS, ...(P || {}) });

const palinode = {
  name: "PALINODE",
  tagline: "Memory-metal additive synth — struck, deformed overtones that remember their way home",
  color: "#d9825a",
  params,
  presets: [
    { name: "Quicksilver", params: {} },
    { name: "Folded Brass", params: { deform: 0.34, recall: 0.96, memory: 0.25, edge: 0.91, contact: 0.48, orbit: 0.07, recoil: 0.14, space: 0.08, attack: 0.055, decay: 0.22, sustain: 0.72, release: 0.35, heat: 0.62 } },
    { name: "Porcelain Rain", params: { deform: 0.94, recall: 0.42, memory: 3.5, edge: 0.88, contact: 0.16, orbit: 0.48, recoil: 0.72, space: 0.48, attack: 0.002, decay: 0.26, sustain: 0.08, release: 1.5, strain: 0.1, heat: 0.15, level: 1.4 } },
    { name: "Slow Return", params: { deform: 1, recall: 0.99, memory: 4.8, edge: 0.52, contact: 0.22, orbit: 0.33, recoil: 0.82, space: 0.62, attack: 1.1, decay: 1.6, sustain: 0.8, release: 5.2, strain: 0.12, heat: 0.3, level: 0.7 } },
    { name: "Molten Bass", params: { deform: 0.24, recall: 0.92, memory: 0.16, edge: 0.27, contact: 0.47, orbit: 0.05, recoil: 0.1, space: 0.04, attack: 0.008, decay: 0.18, sustain: 0.32, release: 0.24, heat: 0.4 } },
    { name: "Unwound Bells", params: { deform: 0.72, recall: 1, memory: 0.7, edge: 0.84, contact: 0.18, orbit: 0.1, recoil: 1, space: 0.42, attack: 0.002, decay: 1, sustain: 0.38, release: 4.3, heat: 0.38 } },
    { name: "Clockwork Pollen", params: { deform: 0.88, recall: 0.76, memory: 0.09, edge: 0.77, contact: 0.39, orbit: 0.95, recoil: 0.25, space: 0.21, attack: 0.002, decay: 0.1, sustain: 0.28, release: 0.16, heat: 0.2, level: 1.3 } },
    { name: "Weightless Wire", params: { deform: 0.12, recall: 0.85, memory: 2.5, edge: 0.62, contact: 0.12, orbit: 0.8, recoil: 0.35, space: 0.5, attack: 0.35, decay: 0.8, sustain: 0.6, release: 3.2, heat: 0.25 } },
  ],
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const sr = ctx.sampleRate;
    const p = Number.isFinite(pitch) ? pitch : 57;
    const v = Number.isFinite(vel) ? vel : 1;
    const d = Number.isFinite(dur) ? Math.max(0.01, dur) : 0.5;
    const r = renderCached(withDefaults(P), p, v, d, sr);
    const buf = ctx.createBuffer(2, r.L.length, sr);
    buf.getChannelData(0).set(r.L);
    buf.getChannelData(1).set(r.R);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(dest);
    src.start(time);
    src.onended = () => {
      try {
        src.disconnect();
      } catch {
        /* already gone */
      }
    };
  },
  // A3 strike → settle: ~1 s rendered at 16 kHz (watch the overtones gather)
  scope: (P) => {
    const { L, R } = renderPalinode(withDefaults(P), 57, 1, 0.7, 16000, { maxLen: 1 });
    const out = new Float32Array(16000);
    const n = Math.min(out.length, L.length);
    for (let i = 0; i < n; i++) out[i] = (L[i] + R[i]) * 0.5;
    return out;
  },
  lines: [
    { name: "Held Chord Recall (Am9)", dsl: "0:A2:32 0:E3:32 0:C4:32 0:G4:32 0:B4:32" },
    { name: "Struck Study (A min)", dsl: "0:A3:2 2:E4:2 4:C5:2 6:B4:2 8:A4:4 14:E4:2 16:F4:2 18:C4:2 20:A3:4 24:G3:2 26:B3:2 28:D4:4" },
    { name: "Long Hold / Short Tap", dsl: "0:E3:12 12:E3:1 14:E3:1 16:G3:12 28:G3:1 30:G3:1 32:A3:16 36:E4:1 40:C5:1 44:E5:1" },
    { name: "Molten Walk (low)", dsl: "0:A1:3 4:A1:2 6:C2:2 8:E2:3 12:D2:2 14:E2:2 16:A1:3 20:G1:2 22:A1:2 24:B1:3 28:E2:3" },
  ],
  ui: {
    theme: { accent: "#e08a5c", lcd: "#b4d4b1", lcdBg: "#0f1f1b", edge: "#34554b", bg: "#1c302c" },
    logo: ["PALI", "NODE"],
    sub: "MEMORY-METAL SYNTHESISER",
    cc: { 74: "edge", 71: "recall", 73: "attack", 72: "release", 75: "deform", 76: "memory", 77: "orbit", 1: "mod", 7: "level" },
    sections: [
      {
        title: "01 / ANNEALING FIELD",
        cls: "pal-field",
        items: [
          { type: "viz", id: "scope" },
          { type: "xy", x: { key: "strain", label: "STRAIN", fmt: "num2" }, y: { key: "heat", label: "HEAT", fmt: "pct" }, cls: "pal-xy", ticks: ["COMPRESS", "STRETCH"] },
          { type: "row", items: [{ type: "knob", key: "mod", label: "MODULATION", fmt: "pct" }, { type: "knob", key: "space", label: "SPACE", fmt: "pct" }] },
        ],
      },
      {
        title: "02 / MATERIAL",
        cls: "pal-material",
        items: [
          { type: "row", items: [{ type: "knob", key: "deform", label: "DEFORM", fmt: "pct", big: true }, { type: "knob", key: "recall", label: "RECALL", fmt: "pct", big: true }, { type: "knob", key: "memory", label: "MEMORY", fmt: "ms", curve: "log", big: true }] },
          { type: "row", items: [{ type: "knob", key: "edge", label: "EDGE", fmt: "pct" }, { type: "knob", key: "contact", label: "STRIKE PT", fmt: "pct" }, { type: "knob", key: "orbit", label: "ORBIT", fmt: "pct" }, { type: "knob", key: "recoil", label: "RECOIL", fmt: "pct" }] },
        ],
      },
      {
        title: "03 / EXCITATION",
        cls: "pal-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATTACK", fmt: "ms" },
              { type: "fader", key: "decay", label: "DECAY", fmt: "ms" },
              { type: "fader", key: "sustain", label: "SUSTAIN", fmt: "pct" },
              { type: "fader", key: "release", label: "RELEASE", fmt: "ms" },
            ],
          },
        ],
      },
      {
        title: "OUT",
        cls: "pal-out",
        items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
};

export const PALINODE_SYNTHS = { palinode };

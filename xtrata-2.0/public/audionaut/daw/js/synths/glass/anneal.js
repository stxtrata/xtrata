// synths/glass/anneal.js — ANNEAL, the crystallising synthesiser, ported for the Audionaut synth bank.
//
// The idea (from the standalone ANNEAL page): every note is a steady fundamental plus twelve upper
// modes. The upper modes are born *displaced* from the harmonic lattice (Grain x strike velocity,
// in semitones) and are pulled into tune over time by Order, each at its own moment (Settle; higher
// modes capture later). Heat loosens the pull and makes the modes wander. Colour tilts the
// amplitude spectrum, Orbit sweeps a revolving window across the modes (Rate), Spread pans the
// upper modes around the fixed, centred fundamental. A short tap is the scattered attack; a held
// note is the settled constellation. Nothing is a filter: the partial *frequencies* really move.
//
// Host port: one note is rendered offline, sample by sample, into a stereo AudioBuffer (one
// AudioBufferSourceNode, no worklet). Rendered buffers are kept in an LRU cache keyed by
// params + pitch + velocity + duration. Dropped from the page: the master reverb ("Space"),
// pedal, pitch bend, polyphony/voice stealing, the demo and the field visualiser. Mod wheel became
// the per-note "Mod" param (extra heat + orbit, as on the page). Gate length = key-held time, so
// the note's `dur` is the point where Release begins and the modes keep settling through the tail.

const TAU = Math.PI * 2;
const NM = 13;
const HARM = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18];
const OFFS = [0, 5.2, -3.4, 2.6, -4.2, 3.8, -2.7, 4.6, -3.3, 2.1, -3.9, 3.4, -2.2]; // semitones
const TBL = 8192;
const SIN = (() => {
  const t = new Float32Array(TBL + 1);
  for (let i = 0; i <= TBL; i++) t[i] = Math.sin((i * TAU) / TBL);
  return t;
})();

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const PARAMS = [
  range("order", "Order", 0, 1, 0.01, 0.96),
  range("heat", "Heat", 0, 1, 0.01, 0.07),
  range("grain", "Grain", 0, 1, 0.01, 0.59),
  range("settle", "Settle", 0.03, 9, 0.01, 1.55),
  range("colour", "Colour", 0, 1, 0.01, 0.66),
  range("body", "Body", 0, 1, 0.01, 0.65),
  range("orbit", "Orbit", 0, 1, 0.01, 0.18),
  range("rate", "Orbit Rate", 0.05, 9, 0.01, 0.65),
  range("attack", "Attack", 0.002, 4, 0.002, 0.007),
  range("decay", "Decay", 0.02, 5, 0.01, 1.3),
  range("sustain", "Sustain", 0, 1, 0.01, 0.55),
  range("release", "Release", 0.015, 7, 0.005, 1.5),
  range("spread", "Spread", 0, 1, 0.01, 0.67),
  range("mod", "Mod (heat+orbit)", 0, 1, 0.01, 0),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];
const PDEF = Object.fromEntries(PARAMS.map((p) => [p.key, p.def]));
const PMAP = Object.fromEntries(PARAMS.map((p) => [p.key, p]));

const G_OUT = 3.2; // output drive into the soft clip (calibrated so the default patch sits ~RMS 0.07)
const CEIL = 0.85; // soft-clip ceiling

// Render one note. Returns { l, r } Float32Arrays (trimmed to the audible length).
// opts.block: control-block length in samples (default 32 @ 44.1k); opts.raw: skip level/clip stage; opts.limit: stop after N samples (scope).
export function renderAnneal(Pin, pitch, vel, dur, sr, opts = {}) {
  const P = {};
  for (const k in PMAP) {
    const v = Number(Pin?.[k]);
    P[k] = Number.isFinite(v) ? clamp(v, PMAP[k].min, PMAP[k].max) : PDEF[k];
  }
  const v = clamp(Number.isFinite(vel) ? vel : 1, 0, 1.4);
  if (!(v > 0) || P.level <= 0) return { l: new Float32Array(64), r: new Float32Array(64) };
  dur = clamp(Number.isFinite(dur) ? dur : 0.5, 0.01, 30);
  const base = 440 * Math.pow(2, (pitch - 69) / 12);
  const seed = (pitch * 1.783 + v * 0.51) % TAU;
  const BL = opts.block || Math.max(16, Math.round(sr / 1378)); // 32 @ 44.1k, as on the page

  // per-mode state
  const phase = new Float64Array(NM);
  const inc = new Float64Array(NM);
  const incD = new Float64Array(NM);
  const lv = new Float64Array(NM);
  const rv = new Float64Array(NM);
  const lD = new Float64Array(NM);
  const rD = new Float64Array(NM);
  const pan = new Float64Array(NM);
  const raw = new Float64Array(NM);
  const tInc = new Float64Array(NM);
  for (let i = 0; i < NM; i++) {
    phase[i] = i === 0 ? 0 : (((i * 0.61803398875 + pitch * 0.071) % 1) + 1) % 1 * TBL;
    pan[i] = i === 0 ? 0 : Math.sin(i * 2.399963 + pitch * 0.021);
  }

  // envelope (linear attack, exponential decay to sustain, exponential release)
  const attackStep = 1 / (P.attack * sr);
  const decaySamples = Math.max(1, Math.round(P.decay * sr));
  const decayC = Math.exp(-7 / decaySamples);
  const sus = P.sustain;
  let env = 0;
  let stage = 0;
  let counter = 0;
  let releaseC = 1;
  const nOff = Math.max(1, Math.round(dur * sr));

  const capSec = Math.min(8, dur + P.release + 0.1);
  const cap = Math.max(BL, opts.limit ? Math.min(opts.limit, Math.ceil(capSec * sr)) : Math.ceil(capSec * sr));
  const outL = new Float32Array(cap);
  const outR = new Float32Array(cap);
  const accL = new Float64Array(BL);
  const accR = new Float64Array(BL);
  const dcCoef = Math.exp((-TAU * 12) / sr);
  let dcL = 0;
  let dcR = 0;
  let prevL = 0;
  let prevR = 0;
  const gain = opts.raw ? 1 : G_OUT * P.level;
  const heatBase = Math.min(1, P.heat + P.mod * 0.44);
  const orbit = Math.min(1, P.orbit + P.mod * 0.3);
  const phaseRate = P.rate * TAU;
  const nyq = sr * 0.47;
  const settle = P.settle;
  const velW = 1 + v * 0.5;
  const velOff = 0.4 + v * 0.74;
  const slope = Math.max(0.45, 3.05 - P.colour * 2.22 - v * 0.31 - heatBase * 0.12);
  const bodyW = 0.25 + P.body * 1.8;
  const norm0 = 0.29 * Math.pow(v, 0.88);
  const lastFade = Math.floor(0.02 * sr);

  let n = 0; // samples written
  let first = true;
  let done = false;
  while (n < cap && !done) {
    const len = Math.min(BL, cap - n);
    const age = n / sr;
    // ---- per-block control update (the page's prepare())
    let sum = 0;
    for (let j = 0; j < NM; j++) {
      const h = HARM[j];
      let capt = clamp((age - settle * j * 0.078) / (settle * (0.32 + j * 0.015) + 0.005), 0, 1);
      capt = capt * capt * (3 - 2 * capt);
      const bind = P.order * capt * (1 - heatBase * 0.86);
      let ratio = h;
      if (j > 0) {
        let off = OFFS[j] * P.grain * velOff * (1 - bind);
        if (heatBase > 0) {
          const wander =
            heatBase *
            (Math.sin(age * (0.71 + j * 0.137) * TAU + seed + j) * 0.55 + Math.sin(age * (0.13 + j * 0.039) * TAU + j) * 0.19);
          off += wander * (1 - bind * 0.85);
        }
        if (off !== 0) ratio = h * Math.pow(2, off / 12);
      }
      const f = base * ratio;
      const anti = clamp((nyq - f) / (sr * 0.045), 0, 1);
      let w;
      if (j === 0) w = bodyW;
      else w = Math.pow(h, -slope) * velW * (0.5 + 0.5 * Math.exp(-age / (0.18 + j * 0.052))) * (0.8 + 0.2 * capt);
      w *= anti;
      raw[j] = w;
      sum += w;
      tInc[j] = (Math.min(f, sr * 0.49) * TBL) / sr;
    }
    const norm = norm0 / Math.max(1.2, sum);
    const wph = age * phaseRate + seed;
    for (let j = 0; j < NM; j++) {
      let gate = 1;
      if (j > 0 && orbit > 0) {
        let wv = 0.5 + 0.5 * Math.cos(wph - j * 0.79);
        wv *= wv;
        wv *= wv;
        gate = 1 - orbit + orbit * (0.035 + 0.965 * wv);
      }
      const amp = raw[j] * norm * gate;
      const pn = pan[j] * P.spread * 0.92;
      const tl = amp * Math.sqrt((1 - pn) * 0.5);
      const tr = amp * Math.sqrt((1 + pn) * 0.5);
      if (first) {
        inc[j] = tInc[j];
        incD[j] = 0;
      } else incD[j] = (tInc[j] - inc[j]) / BL;
      lD[j] = (tl - lv[j]) / BL;
      rD[j] = (tr - rv[j]) / BL;
    }
    first = false;
    // ---- additive oscillator bank, mode-outer for tight loops
    accL.fill(0, 0, len);
    accR.fill(0, 0, len);
    for (let j = 0; j < NM; j++) {
      let l = lv[j];
      let r = rv[j];
      let ph = phase[j];
      let ic = inc[j];
      const dI = incD[j];
      const dl = lD[j];
      const dr = rD[j];
      if (Math.abs(l) + Math.abs(r) + Math.abs(l + dl * BL) + Math.abs(r + dr * BL) < 2e-5) {
        // inaudible this block (orbit gap / anti-alias / ~-94 dB mode): just advance
        ph = (ph + (ic + 0.5 * dI * len) * len) % TBL;
        phase[j] = ph;
        inc[j] = ic + dI * len;
        lv[j] = rv[j] = 0;
        continue;
      }
      for (let i = 0; i < len; i++) {
        ph += ic;
        if (ph >= TBL) ph -= TBL;
        const idx = ph | 0;
        const a = SIN[idx];
        const s = a + (SIN[idx + 1] - a) * (ph - idx);
        ic += dI;
        l += dl;
        r += dr;
        accL[i] += s * l;
        accR[i] += s * r;
      }
      phase[j] = ph;
      inc[j] = ic;
      lv[j] = l;
      rv[j] = r;
    }
    // ---- envelope, DC block, soft clip
    for (let i = 0; i < len; i++) {
      const gi = n + i;
      if (gi === nOff && stage !== 3) {
        stage = 3;
        counter = Math.max(1, Math.round(P.release * sr));
        releaseC = Math.exp(Math.log(0.00001) / counter);
      }
      if (stage === 0) {
        env += attackStep;
        if (env >= 1) {
          env = 1;
          stage = 1;
          counter = decaySamples;
        }
      } else if (stage === 1) {
        env = sus + (env - sus) * decayC;
        if (--counter <= 0) {
          env = sus;
          stage = 2;
        }
      } else if (stage === 3) {
        env *= releaseC;
        if (--counter <= 0 || env < 1e-4) {
          done = true;
          n += i;
          break;
        }
      }
      const l = accL[i] * env;
      const r = accR[i] * env;
      const dL = l - prevL + dcCoef * dcL;
      const dR = r - prevR + dcCoef * dcR;
      prevL = l;
      prevR = r;
      dcL = dL;
      dcR = dR;
      if (opts.raw) {
        outL[gi] = dL;
        outR[gi] = dR;
      } else {
        let xl = clamp(dL * gain, -3, 3);
        let xr = clamp(dR * gain, -3, 3);
        const x2l = xl * xl;
        const x2r = xr * xr;
        outL[gi] = (CEIL * xl * (27 + x2l)) / (27 + 9 * x2l);
        outR[gi] = (CEIL * xr * (27 + x2r)) / (27 + 9 * x2r);
      }
    }
    if (!done) n += len;
  }
  if (n < 64) n = Math.min(cap, 64);
  // if the 8 s cap (not the release) ended the note, fade out so it never clicks
  if (!done) {
    const fl = Math.min(lastFade, n);
    for (let i = 0; i < fl; i++) {
      const g = 1 - (i + 1) / fl;
      outL[n - fl + i] *= g;
      outR[n - fl + i] *= g;
    }
  }
  return { l: outL.slice(0, n), r: outR.slice(0, n) };
}

// ---------------------------------------------------------------- LRU cache of rendered notes
const CACHE_MAX_BYTES = 40 * 1024 * 1024;
const cache = new Map();
let cacheBytes = 0;
const KEYS = PARAMS.map((p) => p.key);
function cacheKey(P, pitch, vel, dur, sr) {
  let k = `${sr}|${pitch}|${Math.round(vel * 1000)}|${Math.round(dur * 1000)}`;
  for (const key of KEYS) k += `|${P[key]}`;
  return k;
}
function rendered(P, pitch, vel, dur, sr) {
  const key = cacheKey(P, pitch, vel, dur, sr);
  let hit = cache.get(key);
  if (hit) {
    cache.delete(key); // refresh recency
    cache.set(key, hit);
    return hit;
  }
  hit = renderAnneal(P, pitch, vel, dur, sr);
  cache.set(key, hit);
  cacheBytes += (hit.l.length + hit.r.length) * 4;
  for (const [k, e] of cache) {
    if (cacheBytes <= CACHE_MAX_BYTES || cache.size <= 1) break;
    cache.delete(k);
    cacheBytes -= (e.l.length + e.r.length) * 4;
  }
  return hit;
}

const PRESETS = [
  { name: "First Light", params: {} },
  { name: "Mercury Bells", params: { order: 0.16, heat: 0.21, grain: 0.94, settle: 3.2, colour: 0.94, orbit: 0.07, rate: 0.28, body: 0.15, attack: 0.002, decay: 2.5, sustain: 0, release: 2.8, spread: 0.78 } },
  { name: "Velvet Lattice", params: { order: 1, heat: 0.02, grain: 0.2, settle: 0.33, colour: 0.37, orbit: 0.13, rate: 0.16, body: 0.8, attack: 0.9, decay: 2.1, sustain: 0.85, release: 3.8, spread: 0.81 } },
  { name: "Basalt", params: { order: 0.98, heat: 0, grain: 0.35, settle: 0.13, colour: 0.28, orbit: 0, rate: 0.4, body: 0.98, attack: 0.003, decay: 0.23, sustain: 0.48, release: 0.17, spread: 0.04 } },
  { name: "Clockwork Rain", params: { order: 1, heat: 0.015, grain: 0.23, settle: 0.28, colour: 0.98, orbit: 0.98, rate: 1.45, body: 0.03, attack: 0.035, decay: 0.35, sustain: 0.91, release: 0.8, spread: 0.96 } },
  { name: "Frozen Choir", params: { order: 1, heat: 0, grain: 0, settle: 0.08, colour: 0.76, orbit: 0.04, rate: 0.1, body: 0.29, attack: 0.17, decay: 1.2, sustain: 0.95, release: 1.85, spread: 0.85 } },
  { name: "Fault Line", params: { order: 0.32, heat: 0.74, grain: 0.83, settle: 0.7, colour: 0.95, orbit: 0.62, rate: 5.2, body: 0.45, attack: 0.006, decay: 0.4, sustain: 0.77, release: 0.36, spread: 0.45 } },
  { name: "Slow Aurora", params: { order: 0.94, heat: 0.26, grain: 0.97, settle: 5.8, colour: 0.83, orbit: 0.42, rate: 0.19, body: 0.35, attack: 1.7, decay: 2.8, sustain: 0.84, release: 5.6, spread: 1 } },
];

const anneal = {
  name: "ANNEAL",
  tagline: "Crystallising synth — twelve displaced modes that settle into tune as the note lives",
  color: "#b3edce",
  params: PARAMS,
  presets: PRESETS,
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const sr = ctx.sampleRate;
    const d = rendered({ ...PDEF, ...P }, pitch, vel, dur, sr);
    const buf = ctx.createBuffer(2, d.l.length, sr);
    buf.getChannelData(0).set(d.l);
    buf.getChannelData(1).set(d.r);
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
  // A3, first ~1 s of a struck note (displaced modes settling into tune), mono, 16 kHz
  scope: (P) => {
    const d = renderAnneal({ ...PDEF, ...P }, 57, 1, 0.9, 16000, { block: 64, limit: 16000 });
    const out = new Float32Array(16000);
    const n = Math.min(16000, d.l.length);
    for (let i = 0; i < n; i++) out[i] = 0.5 * (d.l[i] + d.r[i]);
    return out;
  },
  lines: [
    { name: "Formations (Dm9 - Bbmaj7 - Fmaj9 - C7sus)", dsl: "0:D3:16 0:A3:16 0:C4:16 0:E4:16 16:A#2:16 16:F3:16 16:A3:16 16:C4:16 32:F3:16 32:C4:16 32:E4:16 32:G4:16 48:C3:16 48:G3:16 48:A#3:16 48:D4:16" },
    { name: "Struck Fragments", dsl: "0:D4:1:110 2:C5:1:58 4:A4:1:84 6:E5:1:65 8:C5:1:96 10:A4:1:54 12:E5:1:77 14:C5:1:70 16:A#3:1:110 18:A4:1:58 20:F4:1:84 22:C5:1:65 24:A4:1:96 26:F4:1:54 28:C5:1:77 30:A4:1:70 32:F4:1:110 34:E5:1:58 36:C5:1:84 38:G5:1:65 40:E5:1:96 42:C5:1:54 44:G5:1:77 46:E5:1:70 48:C4:1:110 50:A#4:1:58 52:G4:1:84 54:D5:1:65 56:A#4:1:96 58:G4:1:54 60:D5:1:77 62:A#4:1:70" },
    { name: "Root and Pulse", dsl: "0:D2:12 12:D3:3:70 16:A#1:12 28:A#2:3:70 32:F2:12 44:F3:3:70 48:C2:12 60:C3:3:70" },
    { name: "Slow Constellation", dsl: "0:A4:14:90 6:E5:12:70 16:F4:20:90 22:C5:10:70 32:C5:20:90 38:G5:14:70 48:D5:16:90 56:A4:8:70" },
  ],
  ui: {
    theme: { accent: "#b3edce", lcd: "#d8fbe6", lcdBg: "#08130f", edge: "#2a383b", bg: "#131b1d" },
    logo: ["AN", "NEAL"],
    sub: "CRYSTALLISING SYNTHESISER",
    cc: { 1: "mod", 74: "colour", 71: "order", 73: "attack", 72: "release", 75: "heat", 76: "grain", 77: "settle", 7: "level" },
    sections: [
      {
        title: "01 THERMAL FIELD",
        cls: "an-field",
        items: [
          { type: "xy", x: { key: "order", label: "ORDER", fmt: "pct" }, y: { key: "heat", label: "HEAT", fmt: "pct" }, cls: "thermal-xy", ticks: ["DISORDER", "HARMONIC ORDER"] },
          { type: "viz", id: "scope", cls: "viz-ribbon" },
        ],
      },
      {
        title: "02 THE MATERIAL",
        cls: "an-material",
        items: [
          { type: "row", items: [{ type: "knob", key: "grain", label: "GRAIN", fmt: "pct", big: true }, { type: "knob", key: "settle", label: "SETTLE", fmt: "ms", curve: "log", big: true }, { type: "knob", key: "colour", label: "COLOUR", fmt: "pct", big: true }] },
          { type: "row", items: [{ type: "knob", key: "body", label: "BODY", fmt: "pct" }, { type: "knob", key: "orbit", label: "ORBIT", fmt: "pct" }, { type: "knob", key: "rate", label: "RATE", fmt: "num2", curve: "log" }] },
        ],
      },
      {
        title: "03 THE GESTURE",
        cls: "an-gesture",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms", curve: "log" },
              { type: "fader", key: "decay", label: "D", fmt: "ms", curve: "log" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms", curve: "log" },
            ],
          },
        ],
      },
      {
        title: "STEREO / OUTPUT",
        cls: "an-out",
        items: [
          { type: "row", items: [{ type: "knob", key: "spread", label: "SPREAD", fmt: "pct" }, { type: "knob", key: "mod", label: "MOD", fmt: "pct" }] },
          { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
};

export const ANNEAL_SYNTHS = { anneal };

// synths/glass/lantern.js — Lightnode, the "Harmonic Bloom" synthesizer, as a SYNTH_BANK module.
// A struck, slightly detuned spectrum retunes into pure integer harmonics (the "bloom")
// while a second, slowly swelling layer of the same partials (the "halo") fades in beneath
// it. Ported from the standalone Lightnode page: the note is rendered sample-by-sample into
// one stereo AudioBuffer (a rotating-phasor sine bank, per-partial hit/halo envelopes,
// opposing drift LFO, bloom-swept low-pass, tick burst and the 8-tap damped ping-pong echo),
// so a note costs 2 audio nodes however rich it is. Results are kept in a small LRU cache,
// so repeated notes in a loop render once. No imports.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const EPS = 1e-6;
const MATERIALS = ["glass", "reed", "prism"];
// partial ratios, strike weights and the "skew" (semitones per unit of tension at note start)
const SPECTRA = {
  glass: { ratios: [1, 2, 3, 4, 5, 6, 8], weights: [1, 0.52, 0.34, 0.23, 0.14, 0.1, 0.065], skew: [0, 0.85, -0.65, 1.2, -0.8, 1.4, -0.9] },
  reed: { ratios: [1, 2, 3, 4, 5, 7, 9], weights: [1, 0.13, 0.46, 0.1, 0.24, 0.14, 0.07], skew: [0, -0.3, 0.35, -0.55, 0.7, -0.85, 1] },
  prism: { ratios: [1, 2, 3, 5, 7, 9, 12], weights: [1, 0.65, 0.39, 0.25, 0.16, 0.1, 0.07], skew: [0, 1.6, -1.4, 2.4, -1.8, 2.8, -2.2] },
};
const PEAK_K = 0.46; // output scaling (calibrated so the default patch sits at ~0.07 RMS)

const PARAMS = [
  { key: "material", label: "Material", type: "select", def: "glass", options: MATERIALS },
  range("strike", "Strike", 0, 1, 0.01, 0.58),
  range("tension", "Tension", 0, 1, 0.01, 0.36),
  range("cutoff", "Brightness", 180, 16000, 10, 6400),
  range("touch", "Velocity → Brightness", 0, 1, 0.01, 0.35),
  range("bloom", "Bloom Time", 0.04, 4, 0.01, 1.15),
  range("halo", "Halo", 0, 1, 0.01, 0.64),
  range("drift", "Drift", 0, 1, 0.01, 0.24),
  range("width", "Stereo Width", 0, 1, 0.01, 0.78),
  range("space", "Space (echo)", 0, 1, 0.01, 0.32),
  range("attack", "Attack", 0.002, 3, 0.002, 0.008),
  range("decay", "Decay", 0.01, 3, 0.01, 0.8),
  range("sustain", "Sustain", 0, 1, 0.01, 0.68),
  range("release", "Release", 0.02, 6, 0.01, 1.9),
  range("level", "Output Level", 0, 1.5, 0.01, 0.85),
];
const DEFAULTS = Object.fromEntries(PARAMS.map((p) => [p.key, p.def]));

function settings(input = {}) {
  const p = {};
  for (const d of PARAMS) {
    p[d.key] = d.type === "select" ? (d.options.includes(input[d.key]) ? input[d.key] : d.def) : clamp(num(input[d.key], d.def), d.min, d.max);
  }
  return p;
}

// ------------------------------------------------------------------ DSP helpers
// Web Audio flavoured RBJ low-pass (Q given in dB, as BiquadFilterNode does) → [b0,b1,b2,a1,a2]
function lowpass(fc, qDb, sr) {
  const w = (2 * Math.PI * clamp(fc, 20, sr * 0.45)) / sr;
  const cs = Math.cos(w);
  const al = Math.sin(w) / (2 * Math.pow(10, qDb / 20));
  const a0 = 1 + al;
  return [(1 - cs) / 2 / a0, (1 - cs) / a0, (1 - cs) / 2 / a0, (-2 * cs) / a0, (1 - al) / a0];
}
function bandpass(fc, q, sr) {
  const w = (2 * Math.PI * clamp(fc, 20, sr * 0.45)) / sr;
  const al = Math.sin(w) / (2 * q);
  const a0 = 1 + al;
  return [al / a0, 0, -al / a0, (-2 * Math.cos(w)) / a0, (1 - al) / a0];
}
function panGains(pan) {
  const x = (clamp(pan, -1, 1) + 1) * 0.5 * (Math.PI / 2);
  return [Math.cos(x), Math.sin(x)];
}

// the page's strike "tick": 90 ms of exponentially fading xorshift noise, band-passed
function tickBurst(sr, fc) {
  const len = Math.ceil(sr * 0.09);
  const x = new Float32Array(len);
  let seed = 0x14a1c83;
  for (let i = 0; i < len; i++) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    x[i] = ((seed >>> 0) / 2147483648 - 1) * Math.exp(-i / (sr * 0.012));
  }
  const [b0, b1, b2, a1, a2] = bandpass(fc, 0.65, sr);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < len; i++) {
    const v = x[i];
    const y = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = v;
    y2 = y1;
    y1 = y;
    x[i] = y;
  }
  return x;
}

function echoField(cur, L, R, n, na, sr, space, width, damp) {
  const send = space * 0.48;
  const [c0, c1, c2, d1, d2] = lowpass(damp, 0.5, sr);
  const live = Math.min(n, na + 4096); // beyond this the cascade holds only inaudible ring-down
  let off = 0;
  let fbGain = 1;
  for (let i = 0; i < 8; i++) {
    off += Math.round((i % 2 === 0 ? 0.173 : 0.277) * sr);
    const [gl, gr] = panGains((i % 2 ? 0.8 : -0.8) * width);
    const tg = (i % 2 ? 0.65 : 0.75) * fbGain;
    const wl = gl * tg;
    const wr = gr * tg;
    const gin = i === 0 ? send : 1;
    const stop = Math.min(live, n - off);
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    for (let k = 0; k < stop; k++) {
      const v = cur[k] * gin;
      let y = c0 * v + c1 * x1 + c2 * x2 - d1 * y1 - d2 * y2;
      if (y < 1e-18 && y > -1e-18) y = 0;
      x2 = x1;
      x1 = v;
      y2 = y1;
      y1 = y;
      cur[k] = y;
      L[k + off] += y * wl;
      R[k + off] += y * wr;
    }
    for (let k = Math.max(0, stop); k < live; k++) cur[k] = 0;
    if (i % 2 === 1 && i < 7) fbGain *= 0.31;
  }
}

// ------------------------------------------------------------------ the renderer
// Returns { L, R } Float32Arrays (or { L } mono for the scope). `o.maxSec` caps the length,
// `o.noEcho` drops the echo field (used by the scope).
export function renderLantern(Pin, pitch, velIn, durIn, sr, o = {}) {
  const p = settings(Pin);
  const vel = clamp(num(velIn, 0.8), 0, 1.5);
  const gate = clamp(num(durIn, 0.5), 0.01, 60);
  const f0 = 440 * Math.pow(2, (clamp(num(pitch, 60), 0, 127) - 69) / 12);
  if (vel < 0.002 || p.level === 0 || (p.strike === 0 && p.halo === 0)) return null;

  const nyqG = sr * 0.44;
  const space = o.noEcho ? 0 : p.space;
  const peak = PEAK_K * Math.pow(vel, 1.25) * p.level;
  const sus = Math.max(EPS, peak * p.sustain);
  const susR = sus / peak;
  const A = p.attack;
  const D = p.decay;
  const R = p.release;

  // amplitude envelope exactly as the page schedules it (linear attack, exp decay, exp release)
  const ungated = (x) => (x < A ? (peak * x) / A : x < A + D ? peak * Math.pow(susR, (x - A) / D) : sus);
  const relStart = Math.max(EPS, ungated(gate));
  const ampAt = (x) => {
    if (x <= gate) return x <= 0 ? 0 : ungated(x);
    if (x >= gate + R) return 0;
    return relStart * Math.pow(EPS / relStart, (x - gate) / R);
  };
  // audible end of the dry note: where the release has fallen ~ -100 dB
  const tEnd = relStart > 2e-5 ? gate + (R * Math.log(relStart / 2e-5)) / Math.log(relStart / EPS) : gate + 0.02;
  const tail = space > 0.004 ? 1.85 : 0.01;
  const maxSec = o.maxSec || 8;
  const n = Math.max(64, Math.min(Math.floor(maxSec * sr), Math.ceil((tEnd + tail) * sr)));
  const na = Math.min(n, Math.ceil(tEnd * sr) + 1); // samples that carry dry signal
  const L = new Float32Array(n);
  const Rr = new Float32Array(n);

  // velocity opens the filter a little (the page was velocity→level only; this is the "touch" amount)
  const cutoff = clamp(p.cutoff * Math.pow(2, p.touch * 2.5 * (Math.min(vel, 1.4) - 1)), 180, 18000);

  // ---- partial bank: rotating phasors, gains/frequencies updated per block
  const spec = SPECTRA[p.material];
  const lfoHz = 0.11 + p.drift * 0.53;
  const lfoW = 2 * Math.PI * lfoHz;
  for (let i = 0; i < spec.ratios.length; i++) {
    const target = f0 * spec.ratios[i];
    const start = target * Math.pow(2, (spec.skew[i] * p.tension) / 12);
    if (Math.max(target, start) * 1.02 >= nyqG) continue; // never fold back
    const glideT = p.bloom * (0.65 + i * 0.12);
    const lnRatio = Math.log(target / start);
    const detCents = i > 0 ? p.drift * (2 + i * 1.15) * (i % 2 ? 1 : -1) : 0;
    const panBase = i === 0 ? 0 : (i % 2 ? -1 : 1) * (0.25 + i * 0.105) * p.width;
    const panMove = i > 0 && p.drift > 0 ? p.drift * p.width * 0.065 * (i % 2 ? -1 : 1) : 0;
    const hitPeak = spec.weights[i] * p.strike * (i === 0 ? 1 : 0.8 + p.tension * 0.6);
    const hitT = (0.22 + p.bloom * 0.25) / (1 + i * 0.12);
    const lightPeak = spec.weights[i] * p.halo * (i === 0 ? 0.92 : 1.18);
    const lightT = Math.max(0.012, p.bloom * (0.3 + i * 0.115));
    const hitLn = hitPeak > 0 ? Math.log(EPS / hitPeak) : 0;
    const gainAt = (t) => {
      let g = lightPeak * (t >= lightT ? 1 : t / lightT);
      if (hitPeak > 0 && t < hitT) g += t < 0.003 ? (hitPeak * t) / 0.003 : hitPeak * Math.exp((hitLn * (t - 0.003)) / (hitT - 0.003));
      return g;
    };
    let [pl, pr] = panGains(panBase);
    let x = 1;
    let y = 0;
    let c = 1;
    let s = 0;
    let lastF = -1;
    let pos = 0;
    while (pos < na) {
      const t0 = pos / sr;
      const B = Math.min(t0 < 0.15 ? 16 : 64, na - pos);
      const tm = (pos + B * 0.5) / sr;
      let f = tm < glideT ? start * Math.exp((lnRatio * tm) / glideT) : target;
      if (detCents !== 0) f *= Math.pow(2, (detCents * Math.sin(lfoW * tm)) / 1200);
      if (f !== lastF) {
        const w = (2 * Math.PI * f) / sr;
        c = Math.cos(w);
        s = Math.sin(w);
        lastF = f;
      }
      if (panMove !== 0) [pl, pr] = panGains(panBase + panMove * Math.sin(lfoW * tm));
      const g0 = gainAt(t0);
      const g1 = gainAt((pos + B) / sr);
      const dg = (g1 - g0) / B;
      if (g0 > 1e-7 || g1 > 1e-7) {
        let g = g0;
        for (let j = 0; j < B; j++) {
          const nx = x * c - y * s;
          y = y * c + x * s;
          x = nx;
          const v = y * g;
          L[pos + j] += v * pl;
          Rr[pos + j] += v * pr;
          g += dg;
        }
      } else {
        // silent block: keep the phasor turning without writing
        for (let j = 0; j < B; j++) {
          const nx = x * c - y * s;
          y = y * c + x * s;
          x = nx;
        }
      }
      const mag = Math.sqrt(x * x + y * y) || 1;
      x /= mag;
      y /= mag;
      pos += B;
    }
  }

  // ---- strike tick joins the mix ahead of the filter
  if (p.strike > 0) {
    const tk = tickBurst(sr, Math.min(nyqG, 800 + cutoff * 0.45));
    const tg = p.strike * (p.material === "reed" ? 0.15 : 0.07);
    const m = Math.min(tk.length, na);
    for (let i = 0; i < m; i++) {
      L[i] += tk[i] * tg;
      Rr[i] += tk[i] * tg;
    }
  }

  // ---- bloom-swept low-pass + amplitude envelope (+ mono feed for the echo field)
  const fc0 = Math.min(nyqG, cutoff * (0.65 + p.strike * 0.35));
  const fc1 = Math.min(nyqG, cutoff);
  const lnSweep = Math.log(fc1 / fc0);
  let [b0, b1, b2, a1, a2] = lowpass(fc0, 0.6, sr);
  let lx1 = 0;
  let lx2 = 0;
  let ly1 = 0;
  let ly2 = 0;
  let rx1 = 0;
  let rx2 = 0;
  let ry1 = 0;
  let ry2 = 0;
  const dry = 1 - 0.22 * space;
  const mono = space > 0.004 ? new Float32Array(n) : null;
  let swept = false;
  for (let pos = 0; pos < na; ) {
    const t0 = pos / sr;
    const B = Math.min(32, na - pos);
    if (!swept) {
      const tm = (pos + B * 0.5) / sr;
      if (tm >= p.bloom) {
        [b0, b1, b2, a1, a2] = lowpass(fc1, 0.6, sr);
        swept = true;
      } else [b0, b1, b2, a1, a2] = lowpass(fc0 * Math.exp((lnSweep * tm) / p.bloom), 0.6, sr);
    }
    const e0 = ampAt(t0);
    const e1 = ampAt((pos + B) / sr);
    const de = (e1 - e0) / B;
    let e = e0;
    for (let j = 0; j < B; j++) {
      const k = pos + j;
      const xl = L[k];
      const yl = b0 * xl + b1 * lx1 + b2 * lx2 - a1 * ly1 - a2 * ly2;
      lx2 = lx1;
      lx1 = xl;
      ly2 = ly1;
      ly1 = yl;
      const xr = Rr[k];
      const yr = b0 * xr + b1 * rx1 + b2 * rx2 - a1 * ry1 - a2 * ry2;
      rx2 = rx1;
      rx1 = xr;
      ry2 = ry1;
      ry1 = yr;
      const ol = yl * e;
      const or = yr * e;
      if (mono) mono[k] = (ol + or) * 0.5;
      L[k] = ol * dry;
      Rr[k] = or * dry;
      e += de;
    }
    pos += B;
  }

  // ---- space: eight alternating damped echoes (0.173 / 0.277 s), panned left/right.
  // Delay and low-pass commute, so the chain is run as an in-place low-pass cascade over the
  // mono feed and each stage is added to the mix at its cumulative delay.
  if (mono) echoField(mono, L, Rr, n, na, sr, space, p.width, Math.min(4800, cutoff));

  // ---- safe soft-clip, head/tail fades
  const fade = Math.min(n >> 1, Math.floor(0.03 * sr));
  const head = Math.min(n >> 2, Math.floor(0.0015 * sr));
  for (let k = 0; k < n; k++) {
    let f = 1;
    if (k > n - fade) f = (n - k) / fade;
    if (k < head) f *= k / head;
    L[k] = 0.98 * Math.tanh((L[k] * f) / 0.98);
    Rr[k] = 0.98 * Math.tanh((Rr[k] * f) / 0.98);
  }
  return { L, R: Rr };
}

// ------------------------------------------------------------------ LRU cache of rendered notes
const CACHE = new Map();
let cacheFloats = 0;
const CACHE_MAX_FLOATS = 8e6; // ~32 MB
function cached(P, pitch, vel, dur, sr) {
  const key = [sr, pitch, vel.toFixed(3), dur.toFixed(3), ...PARAMS.map((q) => P[q.key])].join("|");
  let hit = CACHE.get(key);
  if (hit !== undefined) {
    CACHE.delete(key); // refresh recency
    CACHE.set(key, hit);
    return hit;
  }
  hit = renderLantern(P, pitch, vel, dur, sr);
  const size = hit ? hit.L.length * 2 : 0;
  CACHE.set(key, hit);
  cacheFloats += size;
  for (const [k, v] of CACHE) {
    if (cacheFloats <= CACHE_MAX_FLOATS && CACHE.size <= 64) break;
    if (k === key) continue;
    CACHE.delete(k);
    cacheFloats -= v ? v.L.length * 2 : 0;
  }
  return hit;
}

// ------------------------------------------------------------------ SVG glyphs for the material buttons
const MAT_ICONS = {
  glass: '<path d="M6 3h12l-3 12H9L6 3Zm6 12v6m-4 0h8"/>',
  reed: '<path d="M5 20 10 4m2 16 3-16m4 16 1-16"/>',
  prism: '<path d="m12 3 10 18H2L12 3Zm0 0v18"/>',
};

const lantern = {
  name: "Lightnode",
  tagline: "A struck spectrum that opens into a living harmonic halo",
  color: "#eeb978",
  params: PARAMS,
  voice(ctx, dest, note, P) {
    const { pitch, vel, time, dur } = note;
    const r = cached(settings({ ...DEFAULTS, ...P }), num(pitch, 60), clamp(num(vel, 0.8), 0, 1.5), clamp(num(dur, 0.5), 0.01, 60), ctx.sampleRate);
    if (!r) return;
    const buf = ctx.createBuffer(2, r.L.length, ctx.sampleRate);
    buf.getChannelData(0).set(r.L);
    buf.getChannelData(1).set(r.R);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(dest);
    src.onended = () => {
      try {
        src.disconnect();
      } catch {
        /* already gone */
      }
    };
    src.start(time);
  },
  // bloom silhouette of an A3 (no echo field): the strike flash, the retuning and the halo swell
  scope: (P) => {
    const r = renderLantern({ ...DEFAULTS, ...P }, 57, 1, 0.75, 16000, { noEcho: true, maxSec: 1.2 });
    if (!r) return new Float32Array(64);
    const out = new Float32Array(r.L.length);
    for (let i = 0; i < out.length; i++) out[i] = (r.L[i] + r.R[i]) * 0.5;
    return out;
  },
  lines: [
    { name: "Lantern Walk · D minor", dsl: "0:D3:3:100 4:A3:3:83 8:C4:3:90 12:F4:3:78 16:D4:3:96 20:A3:3:83 24:F3:3:87 28:C4:3:75 32:G3:3:97 36:D4:3:82 40:F4:3:89 44:A4:3:72 48:A3:3:94 52:E4:3:83 56:C4:3:88 60:A3:3:76" },
    { name: "Suspended Light · chords", dsl: "0:D3:14:88 0:F3:14:78 0:A3:14:73 16:Bb2:14:87 16:F3:14:76 16:A3:14:72 32:G3:14:85 32:A3:14:75 32:D4:14:70 48:A2:14:89 48:E3:14:77 48:G3:14:73" },
    { name: "Firefly Code · pulses", dsl: "0:D4:1:102 3:A4:1:74 6:F4:2:88 10:E4:1:70 12:C4:2:92 16:D4:1:99 19:F4:1:78 22:A4:2:89 26:C5:1:69 28:A4:2:93 32:G4:1:101 35:D5:1:75 38:Bb4:2:85 42:A4:1:72 44:F4:2:91 48:A4:1:98 51:E4:1:75 54:C4:2:88 58:E4:1:70 60:A3:2:89" },
    { name: "Low Embers · bass", dsl: "0:D2:6:107 8:D3:3:81 12:A2:2:91 16:Bb1:6:104 24:F2:3:83 28:Bb2:2:87 32:G2:6:105 40:D3:3:81 44:F2:2:88 48:A1:6:108 56:E2:3:85 60:A2:2:93" },
  ],
  presets: [
    { name: "Amber Glass", params: {} },
    { name: "Paper Sun", params: { material: "reed", strike: 0.18, tension: 0.21, cutoff: 3700, bloom: 1.75, halo: 0.9, drift: 0.37, width: 0.74, space: 0.36, attack: 0.38, decay: 1.4, sustain: 0.82, release: 3.1 } },
    { name: "Rain in Reverse", params: { material: "prism", strike: 0.08, tension: 0.83, bloom: 2.75, halo: 0.94, cutoff: 10500, drift: 0.43, width: 1, space: 0.64, attack: 0.08, decay: 2.2, sustain: 0.9, release: 3.8 } },
    { name: "Midnight Bells", params: { level: 1.2, strike: 0.94, tension: 0.72, cutoff: 4100, bloom: 1.4, halo: 0.24, drift: 0.08, width: 0.92, space: 0.68, attack: 0.004, decay: 1.8, sustain: 0.22, release: 2.8 } },
    { name: "Orbit Seeds", params: { level: 1.3, material: "prism", strike: 0.88, tension: 0.9, bloom: 0.17, halo: 0.48, cutoff: 12000, drift: 0.18, width: 0.96, space: 0.38, attack: 0.002, decay: 0.26, sustain: 0.18, release: 0.62 } },
    { name: "Unstruck Light", params: { strike: 0, tension: 0.68, bloom: 3.2, halo: 1, cutoff: 8500, drift: 0.65, width: 1, space: 0.58, attack: 0.2, decay: 2.1, sustain: 0.95, release: 4.6 } },
    { name: "Low Embers", params: { material: "reed", strike: 0.86, tension: 0.15, bloom: 0.12, halo: 0.58, cutoff: 1350, drift: 0.06, width: 0.15, space: 0.06, attack: 0.004, decay: 0.3, sustain: 0.48, release: 0.48 } },
    { name: "Prism Weather", params: { material: "prism", strike: 0.72, tension: 1, bloom: 1.9, halo: 0.78, cutoff: 11500, drift: 0.9, width: 1, space: 0.7, attack: 0.006, decay: 0.9, sustain: 0.64, release: 3.2 } },
  ],
  ui: {
    theme: { accent: "#eeb978", lcd: "#ffdda7", lcdBg: "#131411", edge: "#494335", bg: "#242521" },
    logo: ["", "Lightnode"],
    sub: "HARMONIC BLOOM SYNTHESIZER",
    cc: { 74: "cutoff", 71: "tension", 73: "attack", 72: "release", 1: "drift", 7: "level", 91: "space", 75: "bloom", 76: "halo", 77: "strike" },
    sections: [
      {
        title: "EXCITATION",
        cls: "ln-excite",
        items: [
          { type: "radio", key: "material", cls: "ln-material", options: MATERIALS.map((m) => [m, m.toUpperCase(), MAT_ICONS[m], "0 0 24 24"]) },
          { type: "row", items: [{ type: "knob", key: "strike", label: "STRIKE", fmt: "pct" }, { type: "knob", key: "tension", label: "TENSION", fmt: "pct" }] },
          { type: "row", items: [{ type: "knob", key: "cutoff", label: "BRIGHTNESS", curve: "log", fmt: "hz" }, { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" }] },
        ],
      },
      {
        title: "BLOOM",
        cls: "ln-bloom",
        items: [
          { type: "viz", id: "scope", cls: "viz-bloom" },
          { type: "row", items: [{ type: "knob", key: "bloom", label: "BLOOM", curve: "log", fmt: "ms", big: true }, { type: "knob", key: "halo", label: "HALO", fmt: "pct" }] },
        ],
      },
      {
        title: "HALO FIELD",
        cls: "ln-field",
        items: [{ type: "row", items: [{ type: "knob", key: "drift", label: "DRIFT", fmt: "pct" }, { type: "knob", key: "width", label: "WIDTH", fmt: "pct" }, { type: "knob", key: "space", label: "SPACE", fmt: "pct" }] }],
      },
      {
        title: "AMP ENVELOPE",
        cls: "ln-env",
        items: [{ type: "row", items: ["attack", "decay", "sustain", "release"].map((key) => ({ type: "fader", key, label: key[0].toUpperCase(), fmt: key === "sustain" ? "pct" : "ms" })) }],
      },
      {
        title: "OUTPUT",
        cls: "ln-out",
        items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
  },
};

export const LANTERN_SYNTHS = { lantern };

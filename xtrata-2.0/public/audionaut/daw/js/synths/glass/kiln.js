// synths/glass/kiln.js — KILN, "a synthesiser that cools" (port of KILN.html's DSP engine).
//
// Every note is a crystal that cools. A voice is an additive bank of up to 24 partials
// (rotating phasors). At the strike the partials sit on a *lattice* (bell, bar, plate,
// glass, random shards, minor-mode) — a deliberately inharmonic arrangement — and then
// relax toward the true harmonic series k·f0 with a per-partial time constant:
//   anneal  = how long the slowest-to-relax partial 1 takes (seconds)
//   cascade = whether the high partials settle before (+) or after (−) the low ones
//   touch   = how much velocity drives the initial disorder (soft = near-pure, hard = shattered)
//   quench  = how much the release freezes the relaxation (1 = the note-off freezes it)
//   melt    = relaxation TARGET (0 = crystal/harmonic, 1 = stay on the lattice) — was the mod wheel
//   heat    = thermal shimmer on the partials above the fundamental                — was live
// A tap is frozen mid-way (glassy, metallic); a held note crystallises to a pure tone.
//
// Host-side the note is one-shot: the whole note (dur gate + release tail) is rendered
// sample-by-sample in JS into a stereo AudioBuffer (partials are panned individually),
// exactly the maths of the original engine but evaluated in closed form per control
// block (relaxation m(t)=T+(m0−T)e^(−t/τ), struck-decay, envelope) instead of a stepped
// state machine, so the render cost is only the phasor inner loop.
//
// Dropped from the original: its FDN reverb (space/decay — the host has reverb), the
// polyphony/voice-steal logic, pitch bend / sustain pedal / reheat events.
// No imports; renders are cached (LRU, 3 variants per key so Shatter keeps varying).

const KMAX = 24;
const TWO_PI = Math.PI * 2;
const LATTICES = ["Bell", "Bar", "Plate", "Glass", "Shatter", "Minor"];
const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* Church-bell partials relative to the lowest (hum) partial. */
const BELL_R = [1, 2, 2.366, 3.012, 4, 5.028, 5.324, 6.022, 8.332, 10.866, 13.592, 16.43];
const MODE = [0, 3, 5, 7, 10, 12];

/* Lattice stretch factor f_n for partial n (1-based): lattice ratio = n·f_n; f_1 is always 1
   so the fundamental — and therefore pitch — is exact. */
export function kilnLatticeFactors(type, out, rnd) {
  out[0] = 1;
  let prev = BELL_R[11];
  for (let i = 1; i < KMAX; i++) {
    const n = i + 1;
    let f = 1;
    switch (type) {
      case 0: {
        let r;
        if (i < 12) r = BELL_R[i];
        else {
          r = prev + 2.9 * (1 + 0.02 * (n - 12));
          prev = r;
        }
        f = r / n;
        break;
      }
      case 1: {
        const raw = ((n + 0.5) * (n + 0.5)) / 2.25;
        f = Math.pow(raw / n, 0.42);
        break;
      }
      case 2: {
        const raw = 1 + 1.35 * Math.pow(n - 1, 0.72);
        f = (raw / n) * (1 + 0.08 * Math.sin(n * 1.7 + 0.5));
        break;
      }
      case 3:
        f = Math.sqrt(1 + 0.0045 * n * n);
        break;
      case 4: {
        const spanAmt = n === 2 ? 0.25 : 0.62;
        f = Math.exp((rnd() * 2 - 1) * spanAmt);
        break;
      }
      case 5: {
        const s = 12 * Math.log2(n);
        const oct = Math.floor(s / 12);
        const fr = s - oct * 12;
        let best = 0;
        let bd = 99;
        for (let j = 0; j < MODE.length; j++) {
          const dd = Math.abs(MODE[j] - fr);
          if (dd < bd) {
            bd = dd;
            best = MODE[j];
          }
        }
        f = Math.pow(2, (best - fr) / 12);
        break;
      }
    }
    out[i] = f;
  }
}

// ------------------------------------------------------------------ renderer
const MAX_LEN = 8; // seconds, hard cap on a rendered note
const LEVEL_K = 1.0; // output calibration (tuned against the harness: default A3 → rms ≈ 0.07)

const xorshift = (seed) => {
  let x = (seed >>> 0) || 0x9e3779b9;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
};

/**
 * Render one KILN note. Returns { L, R, mono } (Float32Array).
 * opts.maxSamples truncates the render (used by scope()).
 */
export function renderKiln(P, pitch, vel, dur, sr, seed = 1, opts = {}) {
  const f0 = 440 * Math.pow(2, (pitch - 69) / 12);
  const rnd = xorshift(seed * 2654435761 + pitch * 40503 + 12345);
  const nP = clamp(Math.round(P.partials), 1, KMAX);
  const vt = clamp(vel, 0, 1); // timbral velocity (accents above 1 only add level)
  const gain = 0.2 * Math.pow(Math.max(0, vel), 1.15);

  // ---- per-note constants (engine _start)
  const lat = Math.max(0, LATTICES.indexOf(P.lattice));
  const fac = new Float64Array(KMAX);
  kilnLatticeFactors(lat, fac, rnd);
  const m0 = Math.min(1.6, P.shatter * (1 - P.touch + P.touch * (0.25 + 1.5 * vt)));
  const vtilt = P.touch * (0.5 - vt);
  const ksc = Math.pow(2, (-P.track * (pitch - 60)) / 24);
  const T = clamp(P.melt, 0, 1);
  const panOff = pitch * 0.137;
  // spectral weights (tilt / odd-even), normalised over the active partials
  const base = new Float64Array(KMAX);
  {
    let sum = 0;
    for (let k = 0; k < KMAX; k++) {
      const num = k + 1;
      let w = Math.pow(num, -P.tilt);
      if (k > 0) w *= 1 + P.odd * ((num & 1) === 0 ? -0.92 : 0.92);
      else w *= P.odd < 0 ? 1 + P.odd * 0.75 : 1 + P.odd * 0.92;
      base[k] = w;
      if (k < nP) sum += w * w;
    }
    const norm = sum > 1e-9 ? 1 / Math.sqrt(sum) : 0;
    for (let k = 0; k < KMAX; k++) base[k] *= norm;
  }
  const tauM = new Float64Array(KMAX); // relaxation time constants
  const tauD = new Float64Array(KMAX); // struck-decay time constants
  const vtk = new Float64Array(KMAX);
  const glk = new Float64Array(KMAX);
  const grk = new Float64Array(KMAX);
  let stereo = false;
  for (let k = 0; k < KMAX; k++) {
    tauM[k] = Math.max(0.01, P.anneal * Math.pow(2, P.cascade * 3 * (k / (KMAX - 1))));
    tauD[k] = Math.max(0.005, (P.body * ksc) / (1 + P.damp * 0.4 * Math.pow(k, 0.7)));
    vtk[k] = Math.exp(-vtilt * Math.log(k + 1));
    let pan = 0;
    if (k > 0) pan = ((((k * 0.6180339 + panOff) % 1) * 2) - 1) * P.spread;
    const th = (pan + 1) * Math.PI * 0.25;
    glk[k] = Math.cos(th) * 1.4142136;
    grk[k] = Math.sin(th) * 1.4142136;
    if (Math.abs(glk[k] - grk[k]) > 1e-6) stereo = true;
  }

  // ---- timeline
  const attack = Math.max(0.002, P.attack);
  const tOff = clamp(dur, 0.02, MAX_LEN - 0.4);
  const relBase = Math.max(0.02, P.release);
  const rel = Math.min(relBase, (MAX_LEN - tOff) / 1.334); // env reaches 1e-4 inside the cap
  const relCoef = 6.9078 / rel;
  const envOff = Math.min(1, tOff / attack);
  let tEnd = Math.min(MAX_LEN, tOff + rel * 1.334 + 0.01);
  // when nothing is held (hold≈0) the struck decay ends the note on its own
  const tSil = new Float64Array(KMAX);
  let tSilMax = 0;
  const holdOn = P.hold > 0.002;
  for (let k = 0; k < nP; k++) {
    const a = gain * base[k] * vtk[k] * 1.6;
    tSil[k] = a > 1e-5 ? tauD[k] * Math.log((a * (1 - P.hold)) / 1e-5) + 0.02 : 0;
    if (tSil[k] > tSilMax) tSilMax = tSil[k];
  }
  if (!holdOn) tEnd = Math.min(tEnd, Math.max(tSilMax + 0.02, 0.05));
  let N = Math.max(64, Math.ceil(tEnd * sr));
  if (opts.maxSamples) N = Math.min(N, opts.maxSamples);
  const L = new Float32Array(N);
  const R = stereo ? new Float32Array(N) : null;

  // ---- partials (outer loop) × control blocks × samples
  const B1 = Math.max(8, Math.round(sr / 1378)); // fine blocks for the strike / attack
  const B2 = B1 * 4;
  const fineUntil = Math.min(N, Math.ceil(Math.min(attack, 0.25) * sr + 0.04 * sr));
  const nyqFade0 = 0.4 * sr;
  const nyqFadeW = 0.08 * sr;
  const quenchMul = Math.max(0, 1 - P.quench);
  const heat = clamp(P.heat, 0, 1);
  const refreshN = Math.max(1, Math.round(0.0058 * sr));
  const dt0 = 32 / 44100;
  const hold = P.hold;
  const w0 = (TWO_PI * f0) / sr;

  for (let k = 0; k < nP; k++) {
    const gk = gain * base[k] * vtk[k];
    if (gk < 1e-9) continue;
    const kEnd = holdOn ? N : Math.min(N, Math.ceil((tSil[k] + 0.02) * sr));
    const num = k + 1;
    const fk = fac[k] - 1;
    const jamp = heat > 0.001 && k > 0 ? heat * 0.0233 * Math.sqrt(k / (KMAX - 1)) : 0;
    const tauMk = tauM[k];
    const tauDk = tauD[k];
    const invTauM = 1 / tauMk;
    const invTauD = 1 / tauDk;
    const rateRel = invTauM * quenchMul;
    const gl = glk[k];
    const gr = grk[k];
    const ph = rnd() * TWO_PI;
    let c = Math.cos(ph);
    let s = Math.sin(ph);
    let amp = 0;
    let jt = 0;
    let rt = 0;
    let jtNext = 0; // sample at which the jitter target is refreshed
    // relaxation state at note-off (m is continuous across it)
    const mOff = T + (m0 - T) * Math.exp(-tOff * invTauM);
    let pos = 0;
    while (pos < kEnd) {
      const len = Math.min(pos < fineUntil ? B1 : B2, kEnd - pos);
      const tMid = (pos + len * 0.5) / sr;
      const tEndB = (pos + len) / sr;
      // relaxation toward the melt target (slows after note-off by quench)
      const m = tMid <= tOff ? T + (m0 - T) * Math.exp(-tMid * invTauM) : T + (mOff - T) * Math.exp(-(tMid - tOff) * rateRel);
      let ratio = num * (1 + fk * m);
      if (ratio < 0.05) ratio = 0.05;
      if (jamp > 0) {
        while (jtNext <= pos) {
          rt = rnd() * 2 - 1;
          jtNext += refreshN;
        }
        jt += (rt - jt) * (1 - Math.pow(0.92, len / sr / dt0));
        ratio *= 1 + jamp * jt;
      }
      let w = w0 * ratio;
      const fr = f0 * ratio;
      let fade = 1;
      if (fr > nyqFade0) {
        fade = (nyqFade0 + nyqFadeW - fr) / nyqFadeW;
        if (fade < 0) fade = 0;
      }
      if (w > 3) w = 3;
      // amplitude at the block end: envelope × struck decay (continues through the release)
      let env;
      if (tEndB <= tOff) env = tEndB < attack ? tEndB / attack : 1;
      else env = envOff * Math.exp(-(tEndB - tOff) * relCoef);
      const lvl = hold + (1 - hold) * Math.exp(-tEndB * invTauD);
      const target = gk * env * lvl * fade;
      const da = (target - amp) / len;
      if (amp === 0 && da === 0) {
        pos += len;
        continue; // silent and staying silent: phase is arbitrary, skip the rotation
      }
      const cr = Math.cos(w);
      const sn = Math.sin(w);
      let a = amp;
      if (R) {
        for (let i = 0; i < len; i++) {
          const nc = c * cr - s * sn;
          s = c * sn + s * cr;
          c = nc;
          a += da;
          const y = a * c;
          L[pos + i] += y * gl;
          R[pos + i] += y * gr;
        }
      } else {
        const g1 = gl;
        for (let i = 0; i < len; i++) {
          const nc = c * cr - s * sn;
          s = c * sn + s * cr;
          c = nc;
          a += da;
          L[pos + i] += a * c * g1;
        }
      }
      const g = 1.5 - 0.5 * (c * c + s * s); // phasor renormalisation
      c *= g;
      s *= g;
      amp = a;
      pos += len;
    }
  }

  // ---- drive (soft saturation), level, final soft clip, end fade
  const drive = P.drive;
  const dg = 1 + 3 * drive;
  const dcomp = 1 / (1 + 0.55 * drive * 3);
  const master = 0.7 * LEVEL_K * P.level;
  const fadeN = Math.min(N, Math.max(8, Math.floor(0.01 * sr)));
  const sat = (x) => {
    x *= dg;
    x = x > 3 ? 3 : x < -3 ? -3 : x;
    x = (x * (27 + x * x)) / (27 + 9 * x * x) * dcomp * master;
    x = x > 3 ? 3 : x < -3 ? -3 : x;
    return (0.98 * x * (27 + x * x)) / (27 + 9 * x * x);
  };
  for (let i = 0; i < N; i++) {
    const tail = i > N - fadeN ? (N - i) / fadeN : 1;
    L[i] = sat(L[i]) * tail;
    if (R) R[i] = sat(R[i]) * tail;
  }
  return { L, R: R || L, mono: !R };
}

// ------------------------------------------------------------------ cache
const CACHE_BYTES = 64 * 1024 * 1024;
const VARIANTS = 3; // repeated notes cycle through renders with different phases / shards
const cache = new Map(); // key -> { variants: [{L,R,mono}], next, bytes }
let cacheBytes = 0;

const KEYS = ["lattice", "partials", "shatter", "touch", "anneal", "cascade", "quench", "melt", "heat", "tilt", "odd", "damp", "attack", "body", "hold", "release", "track", "spread", "drive", "level"];

function cachedNote(P, pitch, vel, dur, sr) {
  const q = (v) => Math.round(v * 1000) / 1000;
  const dq = Math.round(dur * 100) / 100; // gate quantised to 10 ms
  const vq = Math.round(vel * 100) / 100;
  const key = `${sr}|${pitch}|${vq}|${dq}|` + KEYS.map((k) => (typeof P[k] === "number" ? q(P[k]) : P[k])).join(",");
  let e = cache.get(key);
  if (e) {
    cache.delete(key); // refresh LRU position
    cache.set(key, e);
  } else {
    e = { variants: [], next: 0, bytes: 0 };
    cache.set(key, e);
  }
  const vi = e.next % VARIANTS;
  e.next++;
  if (!e.variants[vi]) {
    const r = renderKiln(P, pitch, vq, dq, sr, vi + 1);
    e.variants[vi] = r;
    const b = (r.mono ? 1 : 2) * r.L.length * 4;
    e.bytes += b;
    cacheBytes += b;
    for (const [k, v] of cache) {
      if (cacheBytes <= CACHE_BYTES || k === key) break;
      cache.delete(k);
      cacheBytes -= v.bytes;
    }
  }
  return e.variants[vi];
}

let scopeMemo = { sig: "", out: null }; // last scope() result (the panel redraws on every knob move)

const DEFAULTS = {
  lattice: "Bell", partials: 16, shatter: 0.9, touch: 0.6, anneal: 2.6, cascade: 0.5, quench: 0.6, melt: 0,
  heat: 0.25, tilt: 1.15, odd: 0, damp: 0.5, attack: 0.004, body: 3, hold: 0.4, release: 1.1, track: 0.5,
  spread: 0.55, drive: 0.12, level: 1,
};

// ------------------------------------------------------------------ module
const params = [
  { key: "lattice", label: "Lattice", type: "select", def: "Bell", options: LATTICES },
  range("partials", "Partials", 4, 24, 1, 16),
  range("shatter", "Shatter", 0, 1, 0.01, 0.9),
  range("touch", "Touch (vel→disorder)", 0, 1, 0.01, 0.6),
  range("anneal", "Anneal Time", 0.05, 16, 0.01, 2.6),
  range("cascade", "Cascade", -1, 1, 0.01, 0.5),
  range("quench", "Quench", 0, 1, 0.01, 0.6),
  range("melt", "Melt", 0, 1, 0.01, 0),
  range("heat", "Heat", 0, 1, 0.01, 0.25),
  range("tilt", "Tilt", 0.2, 2.6, 0.01, 1.15),
  range("odd", "Odd / Even", -1, 1, 0.01, 0),
  range("damp", "Damp", 0, 2, 0.01, 0.5),
  range("attack", "Attack", 0.002, 3, 0.001, 0.004),
  range("body", "Body", 0.08, 10, 0.01, 3),
  range("hold", "Hold", 0, 1, 0.01, 0.4),
  range("release", "Release", 0.02, 8, 0.01, 1.1),
  range("track", "Key Track", 0, 1, 0.01, 0.5),
  range("spread", "Spread", 0, 1, 0.01, 0.55),
  range("drive", "Drive", 0, 1, 0.01, 0.12),
  range("level", "Output Level", 0, 1.5, 0.01, 1),
];

const kiln = {
  name: "KILN",
  tagline: "A synth that cools — metallic strikes that crystallise into pure tone the longer you hold",
  color: "#ff7a2e",
  params,
  presets: [
    { name: "First Frost", params: {} },
    { name: "Marimba Quench", params: { lattice: "Bar", partials: 14, shatter: 1, touch: 0.5, anneal: 0.22, cascade: -0.2, quench: 0, heat: 0, tilt: 1.5, odd: 0, damp: 1.1, attack: 0.002, body: 1.3, hold: 0, release: 0.25, track: 0.7, spread: 0.4, drive: 0.05 } },
    { name: "Gong Weather", params: { lattice: "Plate", partials: 22, shatter: 1, touch: 0.7, anneal: 9, cascade: 0.8, quench: 0.2, heat: 0.55, tilt: 0.85, odd: 0, damp: 0.25, attack: 0.02, body: 9, hold: 0.25, release: 4, track: 0.3, spread: 1, drive: 0.1 } },
    { name: "Hollow Choir", params: { lattice: "Glass", partials: 18, shatter: 0.35, touch: 0.3, anneal: 5, cascade: -0.3, quench: 0.3, heat: 0.5, tilt: 1.7, odd: 0.8, damp: 0.2, attack: 0.55, body: 4, hold: 1, release: 2.2, track: 0.2, spread: 0.9, drive: 0.08 } },
    { name: "Minor Dawn", params: { lattice: "Minor", partials: 20, shatter: 1, touch: 0.35, anneal: 3.6, cascade: 0.2, quench: 0.5, heat: 0.2, tilt: 1.2, odd: 0.1, damp: 0.3, attack: 0.12, body: 5, hold: 0.85, release: 1.6, track: 0.3, spread: 0.7, drive: 0.1 } },
    { name: "Shard Pluck", params: { lattice: "Shatter", partials: 20, shatter: 1, touch: 0.8, anneal: 0.18, cascade: 0.6, quench: 0.9, heat: 0.1, tilt: 0.7, odd: 0, damp: 1.2, attack: 0.002, body: 0.55, hold: 0, release: 0.12, track: 0.6, spread: 0.8, drive: 0.25 } },
    { name: "Magma Bass", params: { lattice: "Glass", partials: 12, shatter: 0.6, touch: 0.5, anneal: 1, cascade: -0.8, quench: 0.4, heat: 0.12, tilt: 0.55, odd: 0.3, damp: 0.5, attack: 0.005, body: 1.6, hold: 0.7, release: 0.3, track: 0.2, spread: 0.15, drive: 0.55 } },
    { name: "Aurora Lead", params: { lattice: "Glass", partials: 14, shatter: 0.5, touch: 0.6, anneal: 0.7, cascade: -0.4, quench: 0.2, heat: 0.85, tilt: 1, odd: 0.2, damp: 0.3, attack: 0.03, body: 2, hold: 1, release: 0.5, track: 0.2, spread: 0.6, drive: 0.18, melt: 0.12 } },
  ],
  voice(ctx, dest, { pitch, vel, time, dur }, P) {
    const p = { ...DEFAULTS, ...P };
    const r = cachedNote(p, pitch, vel, Math.max(0.02, dur), ctx.sampleRate);
    const buf = ctx.createBuffer(r.mono ? 1 : 2, r.L.length, ctx.sampleRate);
    buf.getChannelData(0).set(r.L);
    if (!r.mono) buf.getChannelData(1).set(r.R);
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
  // live waveform of an A3 strike (1 s at 16 kHz): shows the metallic strike settling to a tone
  scope(P) {
    const p = { ...DEFAULTS, ...P };
    p.partials = Math.min(p.partials, 12); // display only: keeps it well under 10 ms
    const sig = KEYS.map((k) => p[k]).join(",");
    if (scopeMemo.sig === sig) return scopeMemo.out;
    const r = renderKiln(p, 57, 1, 0.45, 16000, 7, { maxSamples: 16000 });
    const out = new Float32Array(16000);
    for (let i = 0; i < r.L.length; i++) out[i] = Math.max(-1, Math.min(1, (r.L[i] + r.R[i]) * 0.5 * 1.8));
    scopeMemo = { sig, out };
    return out;
  },
  lines: [
    { name: "Frost Bells (Am pent.)", dsl: "0:A4:3:100 4:C5:3:84 8:E5:3:110 12:G5:3:76 16:E5:3:96 20:D5:3:70 24:C5:3:104 28:A4:6:88 36:E5:3:112 40:G5:3:80 44:A5:10:120" },
    { name: "Crystallise (held chords)", dsl: "0:A2:30 0:E3:30 0:C4:30 0:G4:30 32:F2:30 32:C3:30 32:A3:30 32:E4:30" },
    { name: "Shard Marimba (Dm)", dsl: "0:D4:2:110 2:F4:2:70 4:A4:2:96 6:C5:2:64 8:A4:2:104 10:F4:2:72 12:E4:2:92 14:D4:2:66 16:D4:2:112 18:G4:2:74 20:Bb4:2:98 22:D5:2:68 24:C5:4:108 28:A4:4:80" },
    { name: "Magma Bass (A)", dsl: "0:A1:6:120 8:A1:3:80 12:C2:4:100 16:E2:6:118 24:G1:4:96 28:D2:4:90" },
  ],
  ui: {
    theme: { accent: "#ff7a2e", lcd: "#9fe0ff", lcdBg: "#07090d", edge: "#4a2a1a", bg: "#0c090b" },
    logo: ["", "KILN"],
    sub: "ADDITIVE CRYSTAL THAT COOLS",
    cc: { 74: "anneal", 71: "melt", 73: "attack", 72: "release", 75: "heat", 76: "touch", 77: "cascade", 7: "level" },
    sections: [
      {
        title: "CRYSTAL",
        cls: "kiln-crystal",
        items: [
          { type: "radio", key: "lattice", cls: "kiln-lattice", options: LATTICES.map((l) => [l, l.toUpperCase()]) },
          { type: "row", items: [{ type: "knob", key: "partials", label: "PARTIALS", fmt: "int" }, { type: "knob", key: "shatter", label: "SHATTER", fmt: "pct" }] },
        ],
      },
      {
        title: "COOLING",
        cls: "kiln-cooling",
        items: [
          { type: "xy", x: { key: "anneal", label: "ANNEAL", fmt: "ms", curve: "log" }, y: { key: "melt", label: "MELT", fmt: "pct" }, cls: "kiln-xy", ticks: ["QUICK", "SLOW"] },
          { type: "row", items: [{ type: "knob", key: "cascade", label: "CASCADE", fmt: "num2" }, { type: "knob", key: "quench", label: "QUENCH", fmt: "pct" }] },
        ],
      },
      {
        title: "SPECTRUM",
        cls: "kiln-spectrum",
        items: [
          { type: "viz", id: "scope", cls: "kiln-scope" },
          { type: "row", items: [{ type: "knob", key: "tilt", label: "TILT", fmt: "num2" }, { type: "knob", key: "odd", label: "ODD/EVEN", fmt: "num2", center: true }, { type: "knob", key: "damp", label: "DAMP", fmt: "num2" }] },
        ],
      },
      {
        title: "OUT",
        cls: "kiln-out",
        items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }],
      },
      {
        title: "STRIKE",
        cls: "kiln-strike",
        items: [{ type: "row", items: [{ type: "knob", key: "touch", label: "TOUCH", fmt: "pct", big: true }, { type: "knob", key: "heat", label: "HEAT", fmt: "pct" }] }],
      },
      {
        title: "BODY",
        cls: "kiln-body",
        items: [
          { type: "row", items: [{ type: "knob", key: "body", label: "BODY", curve: "log", fmt: "ms", big: true }, { type: "knob", key: "hold", label: "HOLD", fmt: "pct" }] },
          { type: "row", items: [{ type: "knob", key: "track", label: "KEY TRACK", fmt: "pct" }, { type: "knob", key: "spread", label: "SPREAD", fmt: "pct" }] },
        ],
      },
      {
        title: "ENVELOPE",
        cls: "kiln-env",
        items: [{ type: "row", items: [{ type: "knob", key: "attack", label: "ATTACK", curve: "log", fmt: "ms" }, { type: "knob", key: "release", label: "RELEASE", curve: "log", fmt: "ms", big: true }] }],
      },
      {
        title: "DRIVE",
        cls: "kiln-drive",
        items: [{ type: "knob", key: "drive", label: "DRIVE", fmt: "pct" }],
      },
    ],
  },
};

export const KILN_SYNTHS = { kiln };

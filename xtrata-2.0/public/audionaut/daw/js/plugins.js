// plugins.js — the one registry for every chain plugin (inserts and FX alike).
// Each type: { name, kind, category, color, params: [schema], create(ctx, env) → nodes,
//              apply(ctx, nodes, P), service?(ctx, nodes), dispose?(nodes) }.
//  - kind: "insert" | "fx" — which panel's Add list offers it. Any registered type can
//    still sit in either chain (old projects keep whatever they had).
//  - category: groups the Add dropdown.
//  - params: { key, label, min, max, step, def, log? } for sliders, or
//            { key, label, options: [[value, label]…], def } for a choice.
//  - create() must return { input, output } plus whatever internals apply() needs.
//    env = { delayBus, reverbBus } — the project's shared delay/reverb returns.
//  - dispose() is optional: the engine already stops every oscillator and disconnects
//    every node it finds in the returned object.
//  - meter(nodes) → plain object of live values (cheap; called at screen refresh by a face).
//  - response(nodes, freqs: Float32Array) → Float32Array of dB magnitudes (EQ types only).
// Adding a plugin = adding one entry here. All are basic-but-real Web Audio units.
// Option values are always strings (the generic UI hands back <select>.value strings and
// cleanSlot() compares with ===), so numeric options are parsed with Number() in apply().

import { ensureWorklets } from "./plugin-worklets.js";
import { voxFormants } from "./synths-voices.js";

function makeDriveCurve(amount, steps = 0) {
  const curve = new Float32Array(1025);
  const k = 1 + amount * 20;
  for (let i = 0; i < 1025; i++) {
    let x = i / 512 - 1;
    let y = amount > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
    if (steps > 1) y = Math.round(y * steps) / steps; // bit-crush quantize
    curve[i] = y;
  }
  return curve;
}

// The original channel-FX drive curve (257 points, k = 1 + 12·amount).
function softClipCurve(amount) {
  const curve = new Float32Array(257);
  const k = 1 + amount * 12;
  for (let i = 0; i < 257; i++) {
    const x = i / 128 - 1;
    curve[i] = amount > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
  }
  return curve;
}

function makeSend(ctx, bus) {
  const thru = ctx.createGain();
  const send = ctx.createGain();
  send.gain.value = 0;
  thru.connect(send);
  if (bus) send.connect(bus);
  return { input: thru, output: thru, send };
}

// ------------------------------------------------------------------ shared returns
// The delay and the reverb every send feeds are project-wide, so their settings live in
// project.returns (saved with the song) rather than in any one slot. A send plugin names its
// return in `shared`, and the panels show these params next to the slot's own Send amount.
// Defaults are the fixed values the buses always had: a dotted-8th echo at 35% feedback
// through a 4 kHz low-pass, and a 2.2 s noise-burst reverb. Nothing saved changes sound.
export const BEAT_DIVS = [
  ["1/16", 0.25],
  ["1/8", 0.5],
  ["1/8.", 0.75],
  ["1/4", 1],
  ["1/4.", 1.5],
  ["1/2", 2],
  ["1 bar", 4],
];
export const RETURN_SCHEMA = {
  delay: [
    { key: "time", label: "Echo time", options: BEAT_DIVS.map(([v]) => [v, v]), def: "1/8." },
    { key: "feedback", label: "Feedback", min: 0, max: 0.92, step: 0.01, def: 0.35 },
    { key: "tone", label: "Tone (Hz)", log: true, min: 500, max: 16000, step: 50, def: 4000 },
    { key: "spread", label: "Ping-pong", min: 0, max: 1, step: 0.01, def: 0 },
    { key: "ret", label: "Return", min: 0, max: 1.5, step: 0.01, def: 1 },
  ],
  reverb: [
    { key: "decay", label: "Decay (s)", min: 0.3, max: 8, step: 0.1, def: 2.2 },
    { key: "shape", label: "Shape", min: 1.5, max: 6, step: 0.1, def: 3 },
    { key: "predelay", label: "Pre-delay (ms)", min: 0, max: 250, step: 1, def: 0 },
    { key: "damp", label: "Damping (Hz)", log: true, min: 800, max: 20000, step: 100, def: 20000 },
    { key: "width", label: "Width", min: 0, max: 1, step: 0.01, def: 1 },
    { key: "ret", label: "Return", min: 0, max: 1.5, step: 0.01, def: 1 },
  ],
};

function cleanParamSet(schema, raw) {
  const out = {};
  for (const p of schema) {
    const v = raw?.[p.key];
    if (p.options) out[p.key] = p.options.some(([o]) => o === v) ? v : p.def;
    else out[p.key] = Number.isFinite(+v) && v !== null && v !== "" ? Math.max(p.min, Math.min(p.max, +v)) : p.def;
  }
  return out;
}
export const returnDefaults = () => ({
  delay: cleanParamSet(RETURN_SCHEMA.delay, null),
  reverb: cleanParamSet(RETURN_SCHEMA.reverb, null),
});
export const cleanReturns = (raw) => ({
  delay: cleanParamSet(RETURN_SCHEMA.delay, raw?.delay),
  reverb: cleanParamSet(RETURN_SCHEMA.reverb, raw?.reverb),
});
// The project's return settings, created on first use so older projects need no migration.
export function returnsOf(project) {
  if (!project.returns) project.returns = returnDefaults();
  return project.returns;
}
// Every param a plugin's panel shows: its own, then its shared return's.
export const typeParams = (t) => [...(t?.params || []), ...(RETURN_SCHEMA[t?.shared] || [])];
// Which keys of a mixed param object belong to the shared return
export const sharedKeys = (t) => new Set((RETURN_SCHEMA[t?.shared] || []).map((p) => p.key));


// ------------------------------------------------------------------ shared DSP helpers
const dbToLin = (db) => Math.pow(10, db / 20);
const linToDb = (x) => 20 * Math.log10(Math.max(x, 1e-12));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// Biquad lowpass/highpass take Q in dB in the Web Audio spec: 20·log10(Q).
// 2nd-order Butterworth Q = 1/√2; 4th-order = two stages with Q 0.5412 and 1.3066.
const Q_DB = {
  bw2: linToDb(Math.SQRT1_2),
  bw4a: linToDb(0.5411961),
  bw4b: linToDb(1.3065630),
};

// A filter that does nothing: peaking at 0 dB has b === a, so it is exactly unity.
// Used instead of rewiring when a band is "off".
function setIdentity(f) {
  f.type = "peaking";
  f.frequency.value = 1000;
  f.Q.value = 1;
  f.gain.value = 0;
}

// Level taps: unity input node + analysers (read-only side branches, never in the
// signal path). Analysers are plain properties of `nodes` so the engine's dispose
// walk disconnects them.
function addMeters(ctx, nodes, inNode, outNode) {
  const mk = (src) => {
    const an = ctx.createAnalyser();
    an.fftSize = 1024;
    an.smoothingTimeConstant = 0;
    src.connect(an);
    return an;
  };
  nodes.anIn = mk(inNode);
  nodes.anOut = mk(outNode);
  nodes.mbuf = new Float32Array(1024);
  return nodes;
}
function peakOf(an, buf) {
  an.getFloatTimeDomainData(buf);
  let m = 0;
  for (let i = 0; i < buf.length; i++) {
    const a = buf[i] < 0 ? -buf[i] : buf[i];
    if (a > m) m = a;
  }
  return m;
}
function peakMeter(n) {
  if (!n.anIn) return { inPeak: 0, outPeak: 0 };
  return { inPeak: peakOf(n.anIn, n.mbuf), outPeak: peakOf(n.anOut, n.mbuf) };
}
const reductionOf = (c) => {
  const r = c.reduction;
  return typeof r === "number" ? r : r && typeof r.value === "number" ? r.value : 0;
};

// DynamicsCompressorNode applies a hidden, non-defeatable "makeup" gain:
// (1 / curve(1.0))^0.6, where curve() is the node's static compression curve. This
// re-implements that curve (same maths as Chromium's DynamicsCompressorKernel) so
// plugins can know it: autoMakeup tops it up, opto cancels it. Returns linear gain.
function nativeCompMakeup(thrDb, kneeDb, ratio) {
  const linThr = dbToLin(thrDb);
  const kneeThrDb = thrDb + kneeDb;
  const kneeThr = dbToLin(kneeThrDb);
  const slope = 1 / Math.max(1, ratio);
  const kneeCurve = (x, k) => (x < linThr ? x : linThr + (1 - Math.exp(-k * (x - linThr))) / k);
  const slopeAt = (x, k) => {
    if (x < linThr) return 1;
    const x2 = x * 1.001;
    const y = kneeCurve(x, k);
    const y2 = kneeCurve(x2, k);
    return (linToDb(y2) - linToDb(y)) / (linToDb(x2) - linToDb(x));
  };
  let lo = 0.1;
  let hi = 10000;
  let k = 5;
  for (let i = 0; i < 15; i++) {
    if (slopeAt(kneeThr, k) < slope) hi = k;
    else lo = k;
    k = Math.sqrt(lo * hi);
  }
  const yKneeDb = linToDb(kneeCurve(kneeThr, k));
  const sat = (x) => (x < kneeThr ? kneeCurve(x, k) : dbToLin(yKneeDb + slope * (linToDb(x) - kneeThrDb)));
  return { makeup: Math.pow(1 / sat(1), 0.6), full: 1 / sat(1) };
}
const COMP_LATENCY = 0.006; // DynamicsCompressorNode look-ahead (s), measured: 288 samples @ 48 kHz

// Shelf from two half-gain biquads staggered ±spread octaves around f: a wider spread
// gives a gentler slope (Web Audio shelves have a fixed slope, so this is how
// "bandwidth" is made).
function setShelfPair(a, b, f, gainDb, spreadOct, sr) {
  const hi = sr * 0.45;
  a.frequency.value = clamp(f * Math.pow(2, -spreadOct), 10, hi);
  b.frequency.value = clamp(f * Math.pow(2, spreadOct), 10, hi);
  a.gain.value = gainDb / 2;
  b.gain.value = gainDb / 2;
}

// dB response of a biquad chain (+ extra gain in dB) at freqs. Exact: uses the
// filters' own getFrequencyResponse.
function chainResponse(n, freqs, filters, extraDb) {
  const len = freqs.length;
  if (!n._rs || n._rs.len !== len) {
    n._rs = { len, f: new Float32Array(len), m: new Float32Array(len), p: new Float32Array(len) };
  }
  const { f, m, p } = n._rs;
  const nyq = n.sr / 2;
  for (let i = 0; i < len; i++) f[i] = clamp(freqs[i], 1, nyq * 0.9999);
  const out = new Float32Array(len);
  for (const filt of filters) {
    filt.getFrequencyResponse(f, m, p);
    for (let i = 0; i < len; i++) out[i] += 20 * Math.log10(Math.max(m[i], 1e-9));
  }
  for (let i = 0; i < len; i++) out[i] += extraDb;
  return out;
}

// Optional worklet attach: builds the AudioWorkletNode once ensureWorklets() resolves.
// `n.ready` resolves true when the node is live (false if unsupported / disposed).
function attachWorklet(ctx, n, name, getOptions, onReady) {
  n.ready = ensureWorklets(ctx).then((ok) => {
    if (!ok || n.disposed) return false;
    try {
      const wk = new AudioWorkletNode(ctx, name, {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        channelCount: 2,
        channelCountMode: "explicit",
        channelInterpretation: "speakers",
        // initial params go in as construction options, not a port message
        processorOptions: getOptions(),
      });
      n.wk = wk;
      onReady(wk);
      return true;
    } catch {
      n.wk = null;
      return false;
    }
  });
}
function killWorklet(n) {
  n.disposed = true;
  try {
    if (n.wk) {
      n.wk.port.onmessage = null;
      n.wk.port.postMessage({ type: "kill" });
    }
  } catch {
    /* noop */
  }
}

// Clipper transfer shapes. Each maps u ≥ 0 (input ÷ ceiling) to a magnitude ≤ 1.
// knee 0 → corner as hard as the shape allows, 1 → bends from ~0.15 × ceiling.
function clipShape(shape, knee) {
  const k = clamp(knee, 0, 1);
  const a = 1 - 0.85 * k; // linear region ends here (soft, cubic, fold)
  const d = 1 - a;
  const soft = (u) => (d < 1e-6 ? Math.min(u, 1) : u <= a ? u : a + d * Math.tanh((u - a) / d));
  if (shape === "cubic") {
    const L = 1.5 * d;
    return (u) => {
      if (L < 1e-6) return Math.min(u, 1);
      if (u <= a) return u;
      if (u >= a + L) return 1;
      const z = (u - a) / L;
      return a + d * (1.5 * z - 0.5 * z * z * z);
    };
  }
  if (shape === "hard") {
    const w = k * 0.5;
    return (u) => {
      if (w < 1e-6) return Math.min(u, 1);
      if (u <= 1 - w) return u;
      if (u >= 1 + w) return 1;
      return u - ((u - 1 + w) * (u - 1 + w)) / (4 * w);
    };
  }
  if (shape === "fold") {
    return (u) => {
      const m = (((u + 1) % 4) + 4) % 4;
      const t = 1 - Math.abs(m - 2); // triangle fold, ±1
      return Math.sign(t) * soft(Math.abs(t));
    };
  }
  return soft;
}
// Opto gain computer: envelope u (0..1 on the WaveShaper input) ↔ level π·u (a rectified
// sine's mean × π/2 = its peak). Returns gain ≤ 1 from a soft-knee curve in dB
// (threshold t, knee width w, ratio r).
function optoCurve(t, w, r, N = 16385) {
  const c = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const u = Math.abs((i / (N - 1)) * 2 - 1);
    const L = linToDb(Math.max(u * Math.PI, 1e-5));
    const over = L - t;
    let y = L;
    if (2 * over >= w) y = t + over / r;
    else if (2 * over > -w) y = L + (1 / r - 1) * Math.pow(over + w / 2, 2) / (2 * w);
    c[i] = dbToLin(y - L);
  }
  return c;
}

const DRY_RANGE = 8; // the clipper's dry path carries ±8 full scale

const gateWorkletParams = (P) => ({
  threshold: P.threshold,
  hysteresis: P.hysteresis ?? 0,
  attack: P.attack,
  hold: P.hold ?? 0,
  release: P.release,
  range: P.range ?? -80,
  detHp: P.detHp ?? 20,
  detLp: P.detLp ?? 20000,
});
const transWorkletParams = (P) => ({ attack: P.attack, sustain: P.sustain, speed: P.speed });
function polOutFade(n, t) {
  n.polOut.gain.cancelScheduledValues(t);
  n.polOut.gain.setTargetAtTime(0, t, 0.004);
  n.wkOut.gain.cancelScheduledValues(t);
  n.wkOut.gain.setTargetAtTime(1, t, 0.004);
}


// ------------------------------------------------------------------ wave B helpers
// Every node of a wave-B plugin is pushed into `n.all` (the engine's dispose walk
// stops + disconnects arrays of nodes one level deep; lazily built nodes are covered too).
const track = (n, node) => {
  n.all.push(node);
  return node;
};
const mkGain = (ctx, n, v = 1) => {
  const g = track(n, ctx.createGain());
  g.gain.value = v;
  return g;
};
// 32-sample analyser: the newest sample of a control signal (LFO phase, cents, …).
function tapLast(ctx, n, src) {
  const an = track(n, ctx.createAnalyser());
  an.fftSize = 32;
  an.smoothingTimeConstant = 0;
  src.connect(an);
  return an;
}
function lastOf(an, buf) {
  an.getFloatTimeDomainData(buf);
  return buf[buf.length - 1];
}
// sine + cosine oscillators started on the same tick: any phase offset φ is
// cos φ·sine + sin φ·cos, so phases can be changed instantly and live.
function makeQuad(ctx, n) {
  const s = track(n, ctx.createOscillator());
  const c = track(n, ctx.createOscillator());
  c.setPeriodicWave(ctx.createPeriodicWave(new Float32Array([0, 1]), new Float32Array([0, 0]), { disableNormalization: true }));
  const t = ctx.currentTime;
  s.start(t);
  c.start(t);
  return { s, c };
}
function setFreqBoth(q, hz) {
  q.s.frequency.value = hz;
  q.c.frequency.value = hz;
}
// Feedback loops are connected the first time they are non-zero (a loop through a
// DelayNode is legal but clamps that delay to >= 128 samples, so a chorus keeps no
// loop until it needs one). The flanger registers its loop as already connected.
function addFb(ctx, n, dl, connected = false) {
  const g = mkGain(ctx, n, 0);
  const e = { dl, g, on: false };
  if (connected) {
    dl.connect(g).connect(dl);
    e.on = true;
  }
  n.fbs.push(e);
  return e;
}
function setFb(n, v) {
  for (const e of n.fbs) {
    if (!e.on && v !== 0) {
      e.dl.connect(e.g).connect(e.dl);
      e.on = true;
    }
    e.g.gain.value = v;
  }
}
const fade = (ctx, param, v, tc = 0.006) => param.setTargetAtTime(v, ctx.currentTime, tc);

// interpolating evaluator for a WaveShaper curve over [-1, 1]
function curveFn(curve) {
  const N = curve.length - 1;
  return (x) => {
    const p = (clamp(x, -1, 1) + 1) * 0.5 * N;
    const i = Math.min(N - 1, Math.floor(p));
    return curve[i] + (curve[i + 1] - curve[i]) * (p - i);
  };
}
// "how much shaping" 0..1 from a window of pre-shaper samples: the biggest drop of
// the local gain |f(u)|/|u| relative to the small-signal gain.
function shapingOf(fn, buf, scale = 1, g0 = null) {
  if (g0 === null) g0 = fn(1e-3) / 1e-3;
  if (!(g0 > 1e-6)) return 0;
  let m = 0;
  for (let i = 0; i < buf.length; i++) {
    const u = Math.abs(buf[i]) * scale;
    if (u > 2e-3) {
      const r = 1 - Math.abs(fn(u)) / (u * g0);
      if (r > m) m = r;
    }
  }
  return clamp(m, 0, 1);
}
// RMS-matching gain for auto level: a sine peaking at 0.5 through fn
function autoGainOf(fn) {
  let si = 0;
  let so = 0;
  const M = 256;
  for (let i = 0; i < M; i++) {
    const x = 0.5 * Math.sin((2 * Math.PI * (i + 0.5)) / M);
    si += x * x;
    const y = fn(x);
    so += y * y;
  }
  return clamp(Math.sqrt(si / Math.max(so, 1e-12)), 0.25, 4);
}

// ---- drive / dist curves (all odd-ish maps of [-1,1], 0 -> 0)
function blend(amountMix, f) {
  // amountMix 0 -> identity, 1 -> f, so amount 0 is always a clean pass
  return (x) => (1 - amountMix) * x + amountMix * f(x);
}
function curveFrom(N, fn) {
  const c = new Float32Array(N);
  for (let i = 0; i < N; i++) c[i] = fn((i / (N - 1)) * 2 - 1);
  return c;
}
function driveCurveFor(character, amount) {
  if (character === "tube") {
    // asymmetric tanh: even + odd harmonics. norm so +-1 maps to ~+-1.
    const k = 1 + amount * 8;
    const b = 0.3 * Math.min(1, amount * 2);
    const t0 = Math.tanh(k * b);
    const norm = (Math.tanh(k * (1 + b)) - Math.tanh(k * (-1 + b))) / 2;
    const f = (x) => (Math.tanh(k * (x + b)) - t0) / norm;
    const m = Math.min(1, amount * 6);
    return curveFrom(1025, blend(m, f));
  }
  if (character === "tape") {
    // softer, longer knee: arctangent
    const k = 1 + amount * 6;
    const norm = (2 / Math.PI) * Math.atan((k * Math.PI) / 2);
    const m = Math.min(1, amount * 6);
    return curveFrom(1025, blend(m, (x) => ((2 / Math.PI) * Math.atan((k * x * Math.PI) / 2)) / norm));
  }
  return softClipCurve(amount); // "soft": today's curve, bit for bit
}
function distCurveFor(type, drive) {
  if (type === "fuzz") {
    // asymmetric: the top half saturates hard, the bottom half stays soft (4x lower gain)
    // -> unequal waveform halves = even harmonics (+ a little DC, removed by the blocker)
    const k = 3 + drive * 40;
    return curveFrom(2049, (x) => (x >= 0 ? Math.tanh(k * x) / Math.tanh(k) : Math.tanh(0.25 * k * x) / Math.tanh(0.25 * k)));
  }
  if (type === "hard") {
    const k = 1 + drive * 30;
    return curveFrom(2049, (x) => clamp(x * k, -1, 1));
  }
  if (type === "rectify") {
    const k = 1 + drive * 8;
    const th = Math.tanh(k);
    const r = drive;
    return curveFrom(2049, (x) => {
      const t = Math.tanh(k * x) / th;
      return (1 - r) * t + r * Math.abs(t);
    });
  }
  if (type === "fold") {
    const k = 1 + drive * 7;
    return curveFrom(2049, (x) => Math.sin(x * k * (Math.PI / 2)));
  }
  return makeDriveCurve(drive); // "overdrive": today's shaper
}
const noiseBufs = new WeakMap();
function noiseBuf(ctx) {
  let b = noiseBufs.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, Math.round(ctx.sampleRate * 2), ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseBufs.set(ctx, b);
  }
  return b;
}

const FORMANT_MAKEUP = 3; // +9.5 dB: three narrow bands pass little of a broadband input
const TAPE_RANGE = 16; // tape shaper curve covers |input x drive| up to 16 (24 dB drive x full scale)
const TAPE_DELAY = 0.007; // wow/flutter base delay (s)
const VOICE_BASE = [1, 1.12, 0.88]; // chorus voice delay multipliers
const chorusPhases = (N) => (N >= 3 ? [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3] : N === 2 ? [0, Math.PI, 0] : [0, 0, 0]);

// a gain that always sees 2 channels (mono is up-mixed to L=R) so a ChannelSplitter
// behind it (discrete interpretation) gets both
function stereoGate(ctx, n, v) {
  const g = mkGain(ctx, n, v);
  g.channelCount = 2;
  g.channelCountMode = "explicit";
  g.channelInterpretation = "speakers";
  return g;
}

function buildChorusStereo(ctx, n) {
  const sEn = stereoGate(ctx, n, 0);
  const split = track(n, ctx.createChannelSplitter(2));
  const merge = track(n, ctx.createChannelMerger(2));
  n.inT.connect(sEn).connect(split);
  const sp = { sEn, dl: [[], []], vg: [[], []], gS: [[], []], gC: [[], []] };
  for (let c = 0; c < 2; c++) {
    const bus = mkGain(ctx, n);
    bus.connect(merge, 0, c);
    for (let k = 0; k < 3; k++) {
      const dl = track(n, ctx.createDelay(0.1));
      split.connect(dl, c, 0);
      const vg = mkGain(ctx, n, 0);
      dl.connect(vg).connect(bus);
      const a = mkGain(ctx, n, 0);
      const b = mkGain(ctx, n, 0);
      n.q.s.connect(a).connect(dl.delayTime);
      n.q.c.connect(b).connect(dl.delayTime);
      addFb(ctx, n, dl);
      sp.dl[c].push(dl);
      sp.vg[c].push(vg);
      sp.gS[c].push(a);
      sp.gC[c].push(b);
    }
  }
  merge.connect(n.vsum);
  n.sp = sp;
}

function buildFlangerStereo(ctx, n) {
  const sEn = stereoGate(ctx, n, 0);
  const split = track(n, ctx.createChannelSplitter(2));
  const merge = track(n, ctx.createChannelMerger(2));
  n.inT.connect(sEn).connect(split);
  const dlL = track(n, ctx.createDelay(0.05));
  const dlR = track(n, ctx.createDelay(0.05));
  split.connect(dlL, 0, 0);
  split.connect(dlR, 1, 0);
  dlL.connect(merge, 0, 0);
  dlR.connect(merge, 0, 1);
  const lgL = mkGain(ctx, n, 0);
  const gS = mkGain(ctx, n, 0);
  const gC = mkGain(ctx, n, 0);
  n.q.s.connect(lgL).connect(dlL.delayTime);
  n.q.s.connect(gS).connect(dlR.delayTime);
  n.q.c.connect(gC).connect(dlR.delayTime);
  addFb(ctx, n, dlL, true);
  addFb(ctx, n, dlR, true);
  merge.connect(n.wet);
  n.sp = { sEn, dlL, dlR, lgL, gS, gC };
}

// 12 all-pass stages that are wired in place to the stage count wanted (unused stages
// are simply left out of the chain, so the CPU cost is that of the stages in use).
function makeApChain(ctx, n, lfoS, lfoC) {
  const head = mkGain(ctx, n);
  const raw = mkGain(ctx, n);
  const tail = mkGain(ctx, n);
  const stages = [];
  for (let i = 0; i < 12; i++) {
    const ap = track(n, ctx.createBiquadFilter());
    ap.type = "allpass";
    ap.Q.value = 0.6;
    stages.push(ap);
  }
  const lgS = mkGain(ctx, n);
  lfoS.connect(lgS);
  stages.forEach((s) => lgS.connect(s.frequency));
  let lgC = null;
  if (lfoC) {
    lgC = mkGain(ctx, n, 0);
    lfoC.connect(lgC);
    stages.forEach((s) => lgC.connect(s.frequency));
  }
  raw.connect(tail);
  const fbG = mkGain(ctx, n, 0);
  const fbD = track(n, ctx.createDelay(0.01));
  fbD.delayTime.value = 0; // inside a loop the delay is at least one render quantum
  return { head, raw, tail, stages, lgS, lgC, fbG, fbD, fbOn: false, N: 0 };
}
function wireChain(ch, N) {
  if (ch.N === N) return;
  ch.head.disconnect();
  ch.stages.forEach((s) => s.disconnect());
  let node = ch.head;
  for (let i = 0; i < N; i++) {
    node.connect(ch.stages[i]);
    node = ch.stages[i];
  }
  node.connect(ch.raw);
  ch.N = N;
}
function setChainFb(ch, v) {
  if (!ch.fbOn && v !== 0) {
    ch.raw.connect(ch.fbG);
    ch.fbG.connect(ch.fbD);
    ch.fbD.connect(ch.head);
    ch.fbOn = true;
  }
  ch.fbG.gain.value = v;
  ch.tail.gain.value = Math.sqrt(1 - v * v); // keeps the level of noise-like input roughly constant
}
function buildPhaserStereo(ctx, n) {
  const sEn = stereoGate(ctx, n, 0);
  const split = track(n, ctx.createChannelSplitter(2));
  const merge = track(n, ctx.createChannelMerger(2));
  n.inT.connect(sEn).connect(split);
  const L = makeApChain(ctx, n, n.q.s, n.q.c);
  const R = makeApChain(ctx, n, n.q.s, n.q.c);
  split.connect(L.head, 0, 0);
  split.connect(R.head, 1, 0);
  L.tail.connect(merge, 0, 0);
  R.tail.connect(merge, 0, 1);
  merge.connect(n.wet);
  n.sp = { sEn, L, R };
}
function buildTremStereo(ctx, n) {
  const sEn = stereoGate(ctx, n, 0);
  const split = track(n, ctx.createChannelSplitter(2));
  const merge = track(n, ctx.createChannelMerger(2));
  const gL = mkGain(ctx, n, 0);
  const gR = mkGain(ctx, n, 0);
  const lgL = mkGain(ctx, n, 0);
  const lgR = mkGain(ctx, n, 0);
  const dly = track(n, ctx.createDelay(5.5));
  dly.delayTime.value = 0;
  n.mixL.connect(lgL).connect(gL.gain);
  n.mixL.connect(dly).connect(lgR).connect(gR.gain);
  n.inT.connect(sEn).connect(split);
  split.connect(gL, 0, 0);
  split.connect(gR, 1, 0);
  gL.connect(merge, 0, 0);
  gR.connect(merge, 0, 1);
  merge.connect(n.pan);
  n.sp = { sEn, gL, gR, lgL, lgR, dly };
}

const crushWorkletParams = (P) => ({
  bits: P.bits,
  downsample: Math.max(1, Math.round(P.downsample)),
  jitter: clamp(P.jitter, 0, 1),
  dither: P.dither === "on",
});
function crushRoute(ctx, n) {
  const P = n.P;
  if (!P) return;
  const want = !!n.wk && (Math.round(P.downsample) > 1 || P.jitter > 0 || P.dither === "on");
  if (want !== n.useWk) {
    n.useWk = want;
    fade(ctx, n.natG.gain, want ? 0 : 1, 0.004);
    fade(ctx, n.wkG.gain, want ? 1 : 0, 0.004);
  }
}

export const PLUGIN_TYPES = {
  eq3: {
    name: "Orderbook",
    role: "EQ — 6 Band",
    kind: "insert",
    category: "Tone",
    color: "#22d3ee",
    params: [
      { key: "low", label: "Low (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "lowFreq",
        label: "Low Freq",
        log: true,
        min: 40,
        max: 600,
        step: 5,
        def: 120,
      },
      { key: "mid", label: "Mid (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "midFreq",
        label: "Mid Freq",
        log: true,
        min: 200,
        max: 6000,
        step: 10,
        def: 1000,
      },
      { key: "high", label: "High (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "highFreq",
        label: "High Freq",
        log: true,
        min: 1500,
        max: 16000,
        step: 50,
        def: 6000,
      },
      {
        key: "lowCutSlope",
        label: "Low Cut",
        options: [
          ["off", "Off"],
          ["12", "12 dB/oct"],
          ["24", "24 dB/oct"],
        ],
        def: "off",
      },
      { key: "lowCut", label: "Low Cut Freq", log: true, min: 20, max: 500, step: 1, def: 80 },
      {
        key: "highCutSlope",
        label: "High Cut",
        options: [
          ["off", "Off"],
          ["12", "12 dB/oct"],
          ["24", "24 dB/oct"],
        ],
        def: "off",
      },
      { key: "highCut", label: "High Cut Freq", log: true, min: 2000, max: 20000, step: 50, def: 12000 },
      { key: "midQ", label: "Mid Q", log: true, min: 0.3, max: 8, step: 0.05, def: 0.9 },
      { key: "mid2", label: "Mid 2 (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      { key: "mid2Freq", label: "Mid 2 Freq", log: true, min: 200, max: 10000, step: 10, def: 3000 },
      { key: "mid2Q", label: "Mid 2 Q", log: true, min: 0.3, max: 8, step: 0.05, def: 0.9 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    // inT → lowcut(2) → low shelf → mid → mid2 → high shelf → highcut(2) → outG
    // A cut that is "off" (or 12 dB for its second stage) is a 0 dB peaking filter, i.e.
    // exactly unity — nothing is rewired when slopes change.
    create(ctx) {
      const mk = (type) => {
        const f = ctx.createBiquadFilter();
        f.type = type;
        return f;
      };
      const inT = ctx.createGain();
      const hp1 = mk("highpass");
      const hp2 = mk("highpass");
      const lo = mk("lowshelf");
      const mid = mk("peaking");
      mid.Q.value = 0.9;
      const mid2 = mk("peaking");
      mid2.Q.value = 0.9;
      const hi = mk("highshelf");
      const lp1 = mk("lowpass");
      const lp2 = mk("lowpass");
      const outG = ctx.createGain();
      const chain = [hp1, hp2, lo, mid, mid2, hi, lp1, lp2];
      let prev = inT;
      for (const f of chain) {
        prev.connect(f);
        prev = f;
      }
      prev.connect(outG);
      const nodes = { input: inT, output: outG, inT, hp1, hp2, lo, mid, mid2, hi, lp1, lp2, outG, chain, sr: ctx.sampleRate, outDb: 0 };
      addMeters(ctx, nodes, inT, outG);
      return nodes;
    },
    apply(ctx, n, P) {
      n.lo.gain.value = P.low;
      n.lo.frequency.value = P.lowFreq;
      n.mid.gain.value = P.mid;
      n.mid.frequency.value = P.midFreq;
      n.mid.Q.value = P.midQ;
      n.mid2.gain.value = P.mid2;
      n.mid2.frequency.value = P.mid2Freq;
      n.mid2.Q.value = P.mid2Q;
      n.hi.gain.value = P.high;
      n.hi.frequency.value = P.highFreq;
      const cut = (a, b, type, slope, freq) => {
        if (slope === "off") {
          setIdentity(a);
          setIdentity(b);
          return;
        }
        a.type = type;
        a.frequency.value = freq;
        if (slope === "24") {
          a.Q.value = Q_DB.bw4a;
          b.type = type;
          b.frequency.value = freq;
          b.Q.value = Q_DB.bw4b;
        } else {
          a.Q.value = Q_DB.bw2;
          setIdentity(b);
        }
      };
      cut(n.hp1, n.hp2, "highpass", String(P.lowCutSlope), P.lowCut);
      cut(n.lp1, n.lp2, "lowpass", String(P.highCutSlope), P.highCut);
      n.outDb = P.out ?? 0;
      n.outG.gain.value = dbToLin(n.outDb);
    },
    meter: (n) => peakMeter(n),
    response: (n, freqs) => chainResponse(n, freqs, n.chain, n.outDb),
  },

  // Tilt / shelf tone: broad, gentle, passive-style curves.
  //  - tilt: low shelf −tilt/2 and high shelf +tilt/2 around `pivot` (+ = brighter).
  //  - low boost + low attenuate on the SAME frequency both apply: the boost shelf
  //    turns over higher than the attenuation shelf, so together they give a bump with a
  //    tight bottom end (the classic trick) instead of cancelling.
  //  - high boost is a broad bell at highFreq, high attenuate a shelf at attFreq.
  //  - bandwidth widens every shelf by staggering two half-gain shelves further apart
  //    (gentler slope) and lowers the bell's Q.
  tilt: {
    name: "Rugpull",
    role: "Tilt / Shelf EQ",
    kind: "insert",
    category: "Tone",
    color: "#2dd4bf",
    params: [
      { key: "tilt", label: "Tilt (dB)", min: -12, max: 12, step: 0.1, def: 0 },
      { key: "pivot", label: "Pivot (Hz)", log: true, min: 200, max: 4000, step: 10, def: 800 },
      { key: "lowBoost", label: "Low Boost (dB)", min: 0, max: 10, step: 0.1, def: 0 },
      { key: "lowAtten", label: "Low Atten (dB)", min: 0, max: 10, step: 0.1, def: 0 },
      {
        key: "lowFreq",
        label: "Low Freq",
        options: [
          ["20", "20 Hz"],
          ["30", "30 Hz"],
          ["60", "60 Hz"],
          ["100", "100 Hz"],
        ],
        def: "60",
      },
      { key: "highBoost", label: "High Boost (dB)", min: 0, max: 10, step: 0.1, def: 0 },
      { key: "highAtten", label: "High Atten (dB)", min: 0, max: 10, step: 0.1, def: 0 },
      {
        key: "highFreq",
        label: "High Boost Freq",
        options: [
          ["3000", "3 kHz"],
          ["4000", "4 kHz"],
          ["5000", "5 kHz"],
          ["8000", "8 kHz"],
          ["10000", "10 kHz"],
          ["12000", "12 kHz"],
          ["16000", "16 kHz"],
        ],
        def: "8000",
      },
      {
        key: "attFreq",
        label: "High Atten Freq",
        options: [
          ["5000", "5 kHz"],
          ["10000", "10 kHz"],
          ["20000", "20 kHz"],
        ],
        def: "10000",
      },
      { key: "bandwidth", label: "Bandwidth", min: 0, max: 1, step: 0.01, def: 0.5 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const mk = (type) => {
        const f = ctx.createBiquadFilter();
        f.type = type;
        return f;
      };
      const inT = ctx.createGain();
      const outG = ctx.createGain();
      const tl = [mk("lowshelf"), mk("lowshelf")];
      const th = [mk("highshelf"), mk("highshelf")];
      const lb = [mk("lowshelf"), mk("lowshelf")];
      const la = [mk("lowshelf"), mk("lowshelf")];
      const hb = mk("peaking");
      const ha = [mk("highshelf"), mk("highshelf")];
      const chain = [...tl, ...th, ...lb, ...la, hb, ...ha];
      let prev = inT;
      for (const f of chain) {
        prev.connect(f);
        prev = f;
      }
      prev.connect(outG);
      const nodes = { input: inT, output: outG, inT, outG, tl, th, lb, la, hb, ha, chain, sr: ctx.sampleRate, outDb: 0 };
      addMeters(ctx, nodes, inT, outG);
      return nodes;
    },
    apply(ctx, n, P) {
      const sr = n.sr;
      const bw = clamp(P.bandwidth, 0, 1);
      const spread = bw * 1.2; // octaves each side
      setShelfPair(n.tl[0], n.tl[1], P.pivot, -P.tilt / 2, spread, sr);
      setShelfPair(n.th[0], n.th[1], P.pivot, P.tilt / 2, spread, sr);
      const lf = Number(P.lowFreq) || 60;
      setShelfPair(n.lb[0], n.lb[1], lf * 1.5, P.lowBoost, spread * 0.6, sr);
      setShelfPair(n.la[0], n.la[1], lf * 0.7, -P.lowAtten, spread * 0.6, sr);
      n.hb.frequency.value = clamp(Number(P.highFreq) || 8000, 20, sr * 0.45);
      n.hb.Q.value = 2 * Math.pow(0.3 / 2, bw); // 2.0 (focused) → 0.3 (very broad)
      n.hb.gain.value = P.highBoost;
      setShelfPair(n.ha[0], n.ha[1], Number(P.attFreq) || 10000, -P.highAtten, spread * 0.6, sr);
      n.outDb = P.out ?? 0;
      n.outG.gain.value = dbToLin(n.outDb);
    },
    meter: (n) => peakMeter(n),
    response: (n, freqs) => chainResponse(n, freqs, n.chain, n.outDb),
  },

  comp: {
    name: "Hashpool",
    role: "Compressor",
    kind: "insert",
    category: "Dynamics",
    color: "#2edb84",
    params: [
      {
        key: "threshold",
        label: "Threshold (dB)",
        min: -60,
        max: 0,
        step: 1,
        def: -24,
      },
      { key: "ratio", label: "Ratio", min: 1, max: 20, step: 0.5, def: 4 },
      {
        key: "attack",
        label: "Attack (s)",
        min: 0.001,
        max: 0.3,
        step: 0.001,
        def: 0.01,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 1,
        step: 0.01,
        def: 0.25,
      },
      { key: "makeup", label: "Makeup", min: 0, max: 4, step: 0.05, def: 1 },
      { key: "knee", label: "Knee (dB)", min: 0, max: 30, step: 0.5, def: 6 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      {
        key: "autoMakeup",
        label: "Auto Makeup",
        options: [
          ["off", "Off"],
          ["on", "On"],
        ],
        def: "off",
      },
    ],
    // inT → comp → makeup → wet ─┐
    // inT → delay(look-ahead) → dry ─┴→ out        (dry is delayed to line up with the wet)
    create(ctx) {
      const inT = ctx.createGain();
      const c = ctx.createDynamicsCompressor();
      const g = ctx.createGain();
      const wet = ctx.createGain();
      const dd = ctx.createDelay(0.05);
      dd.delayTime.value = COMP_LATENCY;
      const dry = ctx.createGain();
      dry.gain.value = 0;
      const out = ctx.createGain();
      inT.connect(c);
      c.connect(g).connect(wet).connect(out);
      inT.connect(dd).connect(dry).connect(out);
      const nodes = { input: inT, output: out, inT, c, g, wet, dd, dry, out };
      addMeters(ctx, nodes, inT, out);
      return nodes;
    },
    apply(ctx, n, P) {
      n.c.threshold.value = P.threshold;
      n.c.ratio.value = P.ratio;
      n.c.attack.value = P.attack;
      n.c.release.value = P.release;
      n.c.knee.value = P.knee ?? 6;
      // Auto makeup: the node already applies (1/curve(1))^0.6 on its own; this adds the
      // remaining ^0.4 so a 0 dBFS input leaves at 0 dBFS. The Makeup slider stacks on top.
      let auto = 1;
      if (P.autoMakeup === "on") {
        const { full } = nativeCompMakeup(P.threshold, P.knee ?? 6, P.ratio);
        auto = Math.pow(full, 0.4);
      }
      n.g.gain.value = P.makeup * auto;
      const mix = clamp(P.mix ?? 1, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
    },
    meter: (n) => ({ reduction: Math.min(0, reductionOf(n.c)), ...peakMeter(n) }),
  },

  // Opto leveller: a feed-forward compressor built from native nodes with its own
  // side-chain, so (unlike DynamicsCompressorNode) the release can remember how long it
  // has been compressing. There is no look-ahead, so no latency.
  //
  //   detector : inT → mono (L+R)/2 → [HF shelf = "hf" emphasis, side-chain only] → |x|
  //              → LP 24 Hz (fast envelope)  ──────────────→ gain curve F ─→ vcaF.gain
  //                       └→ feedback-comb one-pole, τ ≈ 1.2 s (slow envelope)
  //                                                        → gain curve S ─→ vcaS.gain
  //   audio    : inT → vcaF → vcaS → makeup → wet ─┐
  //              inT ───────────────────────→ dry ─┴→ out
  // * Fast envelope (~15 ms) takes the peaks; the slow envelope is a long memory of the
  //   level: after a short burst it has hardly moved, so the gain recovers in tens of ms;
  //   after a long push it holds the gain down and lets go over seconds. That is the
  //   program-dependent release (and slow attack of the slow stage).
  // * A WaveShaper maps each envelope to a gain (soft-knee curve in dB, built from
  //   peakRed / mode); the gain signal is added to a GainNode's gain AudioParam (base 0).
  // * The slow smoother cannot be a native BiquadFilter (float32 coefficients break down
  //   at fractions of a Hz), so it is a one-pole built from a DelayNode feedback loop
  //   (loop delay 129 samples; the 24 Hz biquad in front removes the ripple it would alias).
  opto: {
    name: "Stablecoin",
    role: "Opto Leveler",
    kind: "insert",
    category: "Dynamics",
    color: "#e8a33d",
    params: [
      { key: "peakRed", label: "Peak Reduction", min: 0, max: 100, step: 1, def: 40 },
      { key: "gain", label: "Gain", min: 0, max: 100, step: 1, def: 50 },
      {
        key: "mode",
        label: "Mode",
        options: [
          ["compress", "Compress"],
          ["limit", "Limit"],
        ],
        def: "compress",
      },
      { key: "hf", label: "HF Emphasis", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const sr = ctx.sampleRate;
      const inT = ctx.createGain();
      // audio path
      const vcaF = ctx.createGain();
      vcaF.gain.value = 0; // gain comes entirely from the connected curve signal
      const vcaS = ctx.createGain();
      vcaS.gain.value = 0;
      const mk = ctx.createGain();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      dry.gain.value = 0;
      const out = ctx.createGain();
      inT.connect(vcaF).connect(vcaS).connect(mk).connect(wet).connect(out);
      inT.connect(dry).connect(out);
      // detector
      const det = ctx.createGain();
      det.gain.value = 0.5; // headroom for |x| up to 2
      det.channelCount = 1;
      det.channelCountMode = "explicit";
      det.channelInterpretation = "speakers";
      const emph = ctx.createBiquadFilter();
      emph.type = "highshelf";
      emph.frequency.value = Math.min(2000, sr * 0.4);
      emph.gain.value = 0;
      const rect = ctx.createWaveShaper();
      rect.curve = new Float32Array([1, 0, 1]); // |x|
      const lpF = ctx.createBiquadFilter();
      lpF.type = "lowpass";
      lpF.frequency.value = 24;
      lpF.Q.value = linToDb(0.5); // critically damped
      const wsF = ctx.createWaveShaper();
      const wsS = ctx.createWaveShaper();
      // slow one-pole: y[n] = (1−a)·x[n] + a·y[n−D]
      const D = 129;
      const slowA = Math.exp(-D / (sr * 1.2));
      const cIn = ctx.createGain();
      cIn.gain.value = 1 - slowA;
      const cSum = ctx.createGain();
      const cDel = ctx.createDelay(0.1);
      cDel.delayTime.value = D / sr;
      const cFb = ctx.createGain();
      cFb.gain.value = slowA;
      inT.connect(det).connect(emph).connect(rect).connect(lpF);
      lpF.connect(wsF);
      lpF.connect(cIn).connect(cSum);
      cSum.connect(cDel).connect(cFb).connect(cSum);
      cSum.connect(wsS);
      wsF.connect(vcaF.gain);
      wsS.connect(vcaS.gain);
      const mkAn = (src) => {
        const an = ctx.createAnalyser();
        an.fftSize = 32;
        src.connect(an);
        return an;
      };
      const nodes = {
        input: inT, output: out, inT, vcaF, vcaS, mk, wet, dry, out, det, emph, rect, lpF, wsF, wsS,
        cIn, cSum, cDel, cFb, anGF: mkAn(wsF), anGS: mkAn(wsS), gbuf: new Float32Array(32), sig: "",
      };
      addMeters(ctx, nodes, inT, out);
      return nodes;
    },
    apply(ctx, n, P) {
      const pr = clamp(P.peakRed, 0, 100);
      const lim = P.mode === "limit";
      // threshold of the slow stage: off at 0 (+20 dB) down to −45 dB at 100
      const tS = 20 - 65 * Math.sqrt(pr / 100);
      const sig = `${Math.round(pr * 10)}|${lim ? 1 : 0}`;
      if (sig !== n.sig) {
        n.sig = sig;
        // The two stages multiply, so their ratios are chosen so the combined slope stays
        // positive: reduction slopes (1−1/r) add to ≈ 0.70 (≈ 3.3:1) or ≈ 0.95 (≈ 20:1).
        const slow = lim ? { t: tS, w: 10, r: 2.2 } : { t: tS, w: 18, r: 1.7 };
        const fast = lim ? { t: tS + 4, w: 6, r: 1.7 } : { t: tS + 4, w: 12, r: 1.4 };
        n.wsF.curve = optoCurve(fast.t, fast.w, fast.r);
        n.wsS.curve = optoCurve(slow.t, slow.w, slow.r);
      }
      n.emph.gain.value = clamp(P.hf, 0, 1) * 12;
      // gain 50 = neutral; ±12 dB across the knob, plus a little automatic make-up as
      // peak reduction goes up.
      n.mk.gain.value = dbToLin((P.gain - 50) * 0.24 + pr * 0.05);
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
      n.out.gain.value = dbToLin(P.out);
    },
    meter(n) {
      const last = (an) => {
        an.getFloatTimeDomainData(n.gbuf);
        return n.gbuf[n.gbuf.length - 1];
      };
      const g = Math.max(1e-4, last(n.anGF)) * Math.max(1e-4, last(n.anGS));
      return { reduction: Math.min(0, linToDb(g)), ...peakMeter(n) };
    },
  },

  limiter: {
    name: "Stoploss",
    role: "Limiter",
    kind: "insert",
    category: "Dynamics",
    color: "#a3e635",
    params: [
      {
        key: "ceiling",
        label: "Ceiling (dB)",
        min: -24,
        max: 0,
        step: 0.5,
        def: -3,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 0.5,
        step: 0.01,
        def: 0.1,
      },
      { key: "input", label: "Input (dB)", min: 0, max: 24, step: 0.1, def: 0 },
      {
        key: "safety",
        label: "Safety Clip",
        options: [
          ["off", "Off"],
          ["on", "On"],
        ],
        def: "off",
      },
    ],
    // inT → input gain → compressor → [safety soft-clip] → out
    // Safety: gain-scaled WaveShaper that is linear up to 0.89 × ceiling and then bends
    // asymptotically to the ceiling (never above it), catching the peaks the native
    // limiter lets through.
    create(ctx) {
      const inT = ctx.createGain();
      const inG = ctx.createGain();
      const c = ctx.createDynamicsCompressor();
      const sPre = ctx.createGain();
      const ws = ctx.createWaveShaper();
      const out = ctx.createGain();
      inT.connect(inG).connect(c).connect(sPre).connect(ws).connect(out);
      const nodes = { input: inT, output: out, inT, inG, c, sPre, ws, out, sig: "" };
      addMeters(ctx, nodes, inT, out);
      return nodes;
    },
    apply(ctx, n, P) {
      n.inG.gain.value = dbToLin(P.input ?? 0);
      n.c.threshold.value = P.ceiling;
      n.c.ratio.value = 20;
      n.c.attack.value = 0.001;
      n.c.release.value = P.release;
      n.c.knee.value = 0;
      if (P.safety === "on") {
        const ceil = dbToLin(P.ceiling);
        const H = 2; // curve covers ±2 × ceiling; anything beyond lands on the ceiling
        const sig = `on|${P.ceiling}`;
        if (sig !== n.sig) {
          n.sig = sig;
          const N = 4097;
          const a = 0.89;
          const curve = new Float32Array(N);
          for (let i = 0; i < N; i++) {
            const u = ((i / (N - 1)) * 2 - 1) * H;
            const m = Math.abs(u);
            const y = m <= a ? m : a + (1 - a) * Math.tanh((m - a) / (1 - a));
            curve[i] = Math.sign(u) * y * ceil;
          }
          n.ws.curve = curve;
        }
        // no oversampling here on purpose: a band-limiting filter around a clipped peak
        // rings above the clip level, and this stage exists to guarantee the ceiling
        n.ws.oversample = "none";
        n.sPre.gain.value = 1 / (ceil * H);
      } else {
        n.sig = "off";
        n.ws.curve = null; // null curve = straight through
        n.ws.oversample = "none";
        n.sPre.gain.value = 1;
      }
    },
    meter: (n) => ({ reduction: Math.min(0, reductionOf(n.c)), ...peakMeter(n) }),
  },

  // Soft clipper / maximiser. u = input × drive ÷ ceiling; the curve maps u to ±1 and
  // the result is scaled by the ceiling, so the output can never pass the ceiling
  // (mix = 1) and quiet material passes at drive gain regardless of ceiling.
  //   inT → drive/scale → WaveShaper (4× oversampled when hq) → tone LP → clamp → wet ─┐
  //   inT → identity WaveShaper (same oversampler = same latency) → dry ───────┴→ out
  clipper: {
    name: "Wick",
    role: "Soft Clipper",
    kind: "insert",
    category: "Dynamics",
    color: "#f43f5e",
    params: [
      { key: "drive", label: "Drive (dB)", min: 0, max: 24, step: 0.1, def: 6 },
      { key: "ceiling", label: "Ceiling (dB)", min: -12, max: 0, step: 0.1, def: -1 },
      { key: "knee", label: "Knee", min: 0, max: 1, step: 0.01, def: 0.5 },
      {
        key: "shape",
        label: "Shape",
        options: [
          ["soft", "Soft"],
          ["cubic", "Cubic"],
          ["hard", "Hard"],
          ["fold", "Fold"],
        ],
        def: "soft",
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "tone", label: "Tone (Hz)", log: true, min: 1000, max: 20000, step: 50, def: 20000 },
      {
        key: "hq",
        label: "Oversampling",
        options: [
          ["off", "Off"],
          ["on", "4×"],
        ],
        def: "on",
      },
    ],
    create(ctx) {
      const inT = ctx.createGain();
      const drv = ctx.createGain();
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter();
      setIdentity(lp);
      // final hard clamp at ±1 (= the ceiling): the oversampler's and the tone filter's
      // ringing can push clipped peaks a little past it. Sample-wise, no oversampling.
      const fin = ctx.createWaveShaper();
      fin.curve = new Float32Array([-1, 1]);
      const wet = ctx.createGain();
      const dPre = ctx.createGain();
      dPre.gain.value = 1 / DRY_RANGE;
      const dws = ctx.createWaveShaper();
      dws.curve = new Float32Array([-1, 1]);
      const dPost = ctx.createGain();
      dPost.gain.value = DRY_RANGE;
      const dry = ctx.createGain();
      dry.gain.value = 0;
      const out = ctx.createGain();
      inT.connect(drv).connect(ws).connect(lp).connect(fin).connect(wet).connect(out);
      inT.connect(dPre).connect(dws).connect(dPost).connect(dry).connect(out);
      const nodes = { input: inT, output: out, inT, drv, ws, lp, fin, wet, dPre, dws, dPost, dry, out, sig: "", fn: null, U: 4 };
      addMeters(ctx, nodes, inT, out);
      nodes.anPre = ctx.createAnalyser();
      nodes.anPre.fftSize = 1024;
      nodes.anPre.smoothingTimeConstant = 0;
      drv.connect(nodes.anPre);
      return nodes;
    },
    apply(ctx, n, P) {
      const ceil = dbToLin(P.ceiling);
      const drive = dbToLin(P.drive);
      // curve covers inputs up to ±2.0 full scale
      const U = clamp((2 * drive) / ceil, 2, 128);
      const sig = `${P.shape}|${P.knee}|${U.toFixed(3)}`;
      if (sig !== n.sig) {
        n.sig = sig;
        const fn = clipShape(P.shape, P.knee);
        const N = 16385;
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          const u = ((i / (N - 1)) * 2 - 1) * U;
          curve[i] = Math.sign(u) * fn(Math.abs(u));
        }
        n.ws.curve = curve;
        n.fn = fn;
      }
      n.U = U;
      n.drv.gain.value = drive / (ceil * U);
      n.out_ceil = ceil;
      // post-curve scale to the ceiling lives in `wet`
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix * ceil;
      n.dry.gain.value = 1 - mix;
      const os = P.hq === "off" ? "none" : "4x";
      n.ws.oversample = os;
      n.dws.oversample = os;
      if (P.tone >= 19990) setIdentity(n.lp);
      else {
        n.lp.type = "lowpass";
        n.lp.frequency.value = clamp(P.tone, 1000, ctx.sampleRate * 0.45);
        n.lp.Q.value = Q_DB.bw2;
      }
    },
    meter(n) {
      const m = peakMeter(n);
      let clip = 0;
      if (n.fn) {
        n.anPre.getFloatTimeDomainData(n.mbuf);
        for (let i = 0; i < n.mbuf.length; i++) {
          const u = Math.abs(n.mbuf[i]) * n.U;
          if (u > 1e-3) {
            const r = 1 - Math.max(0, n.fn(u)) / u;
            if (r > clip) clip = r;
          }
        }
      }
      return { ...m, clip: clamp(clip, 0, 1) };
    },
  },

  gate: {
    name: "Gatekeep",
    role: "Noise Gate",
    kind: "insert",
    category: "Dynamics",
    color: "#feca57",
    params: [
      {
        key: "threshold",
        label: "Threshold (dB)",
        min: -80,
        max: 0,
        step: 1,
        def: -45,
      },
      {
        key: "attack",
        label: "Attack (s)",
        min: 0.001,
        max: 0.1,
        step: 0.001,
        def: 0.005,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 1,
        step: 0.01,
        def: 0.12,
      },
      { key: "hold", label: "Hold (s)", min: 0, max: 0.5, step: 0.005, def: 0 },
      { key: "hysteresis", label: "Hysteresis (dB)", min: 0, max: 12, step: 0.5, def: 0 },
      { key: "range", label: "Range (dB)", min: -80, max: 0, step: 1, def: -80 },
      { key: "detHp", label: "Detector HP (Hz)", log: true, min: 20, max: 2000, step: 1, def: 20 },
      { key: "detLp", label: "Detector LP (Hz)", log: true, min: 500, max: 20000, step: 50, def: 20000 },
    ],
    // Two gain paths share one input:
    //   inT → gate(GainNode, driven by service() from the analyser)  → polOut ─┐
    //   inT → an-gate worklet (once ready)                          → wkOut  ─┴→ out
    // Until the worklet is ready (or without AudioWorklet) the control-rate analyser path
    // gates; when it is ready the worklet takes over (short crossfade) and service() idles.
    create(ctx) {
      const inT = ctx.createGain();
      const dHp = ctx.createBiquadFilter();
      const dLp = ctx.createBiquadFilter();
      setIdentity(dHp);
      setIdentity(dLp);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      const gate = ctx.createGain();
      const polOut = ctx.createGain();
      const wkOut = ctx.createGain();
      wkOut.gain.value = 0;
      const out = ctx.createGain();
      inT.connect(dHp).connect(dLp).connect(an);
      inT.connect(gate).connect(polOut).connect(out);
      wkOut.connect(out);
      const nodes = {
        input: inT,
        output: out,
        inT,
        dHp,
        dLp,
        an,
        gate,
        polOut,
        wkOut,
        out,
        open: false,
        buf: new Float32Array(an.fftSize),
        sr: ctx.sampleRate,
        level: -120,
        gEst: 1,
        lastT: 0,
        holdUntil: 0,
        force: false,
        m: null,
        wk: null,
      };
      addMeters(ctx, nodes, inT, out);
      attachWorklet(ctx, nodes, "an-gate", () => ({
        p: nodes.P ? gateWorkletParams(nodes.P) : undefined,
        init: { gain: nodes.gEst, open: nodes.open }, // hand over from the polling gate's state
      }), (wk) => {
        wk.port.onmessage = (e) => {
          nodes.m = e.data;
        };
        inT.connect(wk);
        wk.connect(wkOut);
        polOutFade(nodes, ctx.currentTime);
      });
      return nodes;
    },
    apply(ctx, n, P) {
      n.P = P;
      n.force = true; // re-assert the gain target on the next service tick (range may have moved)
      if (P.detHp > 20.5) {
        n.dHp.type = "highpass";
        n.dHp.frequency.value = P.detHp;
        n.dHp.Q.value = Q_DB.bw2;
      } else setIdentity(n.dHp);
      if (P.detLp < 19999) {
        n.dLp.type = "lowpass";
        n.dLp.frequency.value = P.detLp;
        n.dLp.Q.value = Q_DB.bw2;
      } else setIdentity(n.dLp);
      if (n.wk) n.wk.port.postMessage({ type: "params", p: gateWorkletParams(P) });
    },
    // called by the engine's service loop (~30 Hz). Idle once the worklet is live.
    service(ctx, n) {
      if (!n.P || n.wk) return;
      const P = n.P;
      n.an.getFloatTimeDomainData(n.buf);
      let sum = 0;
      for (let i = 0; i < n.buf.length; i++) sum += n.buf[i] * n.buf[i];
      const db = 20 * Math.log10(Math.sqrt(sum / n.buf.length) + 1e-8);
      n.level = db;
      const t = ctx.currentTime;
      const hys = P.hysteresis ?? 0;
      const hold = P.hold ?? 0;
      const rangeLin = dbToLin(Math.min(0, P.range ?? -80));
      const aboveClose = db > P.threshold - (n.open ? hys : 0);
      let shouldOpen = db > P.threshold || (n.open && aboveClose);
      if (shouldOpen) n.holdUntil = t + hold;
      else if (n.open && t < n.holdUntil) shouldOpen = true;
      if (shouldOpen !== n.open || n.force) {
        n.open = shouldOpen;
        n.force = false;
        n.gate.gain.setTargetAtTime(shouldOpen ? 1 : rangeLin, t, shouldOpen ? P.attack : P.release);
      }
      // estimate of the gate's gain for the meter (target smoothing, same time constants)
      const dt = Math.max(0, t - n.lastT);
      n.lastT = t;
      const tgt = n.open ? 1 : rangeLin;
      const tc = Math.max(1e-3, n.open ? P.attack : P.release);
      n.gEst += (tgt - n.gEst) * (1 - Math.exp(-dt / tc));
    },
    meter(n) {
      if (n.wk && n.m) return { open: !!n.m.open, level: n.m.level, gain: n.m.gain };
      return { open: n.open, level: n.level, gain: clamp(n.gEst, 0, 1) };
    },
    dispose: killWorklet,
  },

  // Level-independent transient shaper (an-trans worklet). Passthrough until the
  // worklet is ready or if AudioWorklet is missing.
  transient: {
    name: "Breakout",
    role: "Transient Shaper",
    kind: "insert",
    category: "Dynamics",
    color: "#d946ef",
    params: [
      { key: "attack", label: "Attack (%)", min: -100, max: 100, step: 1, def: 0 },
      { key: "sustain", label: "Sustain (%)", min: -100, max: 100, step: 1, def: 0 },
      { key: "speed", label: "Speed", min: 0, max: 1, step: 0.01, def: 0.5 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const inT = ctx.createGain();
      const pass = ctx.createGain();
      const wkOut = ctx.createGain();
      wkOut.gain.value = 0;
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      dry.gain.value = 0;
      const out = ctx.createGain();
      inT.connect(pass).connect(wet);
      wkOut.connect(wet);
      wet.connect(out);
      inT.connect(dry).connect(out);
      const nodes = { input: inT, output: out, inT, pass, wkOut, wet, dry, out, m: null, wk: null };
      addMeters(ctx, nodes, inT, out);
      attachWorklet(ctx, nodes, "an-trans", () => ({ p: nodes.P ? transWorkletParams(nodes.P) : undefined }), (wk) => {
        wk.port.onmessage = (e) => {
          nodes.m = e.data;
        };
        inT.connect(wk);
        wk.connect(wkOut);
        const t = ctx.currentTime;
        pass.gain.cancelScheduledValues(t);
        pass.gain.setTargetAtTime(0, t, 0.004);
        wkOut.gain.cancelScheduledValues(t);
        wkOut.gain.setTargetAtTime(1, t, 0.004);
      });
      return nodes;
    },
    apply(ctx, n, P) {
      n.P = P;
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
      n.out.gain.value = dbToLin(P.out);
      if (n.wk) n.wk.port.postMessage({ type: "params", p: transWorkletParams(P) });
    },
    meter(n) {
      const m = n.m || {};
      return {
        attackGain: m.attackGain || 0,
        sustainGain: m.sustainGain || 0,
        ...peakMeter(n),
      };
    },
    dispose: killWorklet,
  },

  // ---------------------------------------------------------------- FX: filter
  // Wave B: multimode (lp hp bp notch peak), 12/24 dB, pre-drive, LFO + envelope follower
  // on the cutoff (both audio-rate through the biquads' `detune`, no service loop).
  filter: {
    name: "Coinjoin",
    role: "Multimode Filter",
    kind: "fx",
    category: "Filter",
    color: "#38bdf8",
    params: [
      {
        key: "mode",
        label: "Mode",
        options: [
          ["lp", "Low-pass"],
          ["hp", "High-pass"],
          ["bp", "Band-pass"],
          ["notch", "Notch"],
          ["peak", "Peak"],
        ],
        def: "lp",
      },
      {
        key: "cutoff",
        label: "Cutoff (Hz)",
        min: 20,
        max: 20000,
        step: 1,
        def: 8000,
        log: true,
      },
      { key: "q", label: "Resonance", min: 0.1, max: 18, step: 0.1, def: 0.9 },
      {
        key: "slope",
        label: "Slope (dB/oct)",
        options: [
          ["12", "12"],
          ["24", "24"],
        ],
        def: "12",
      },
      { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "lfoRate", label: "LFO rate (Hz)", min: 0.05, max: 20, step: 0.01, def: 1, log: true },
      { key: "lfoDepth", label: "LFO depth", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "follow", label: "Follow", min: -1, max: 1, step: 0.01, def: 0 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, lbuf: new Float32Array(32), cutoff: 8000 };
      const inT = mkGain(ctx, n);
      const drv = track(n, ctx.createWaveShaper());
      const f1 = track(n, ctx.createBiquadFilter());
      const f2 = track(n, ctx.createBiquadFilter());
      setIdentity(f2);
      const out = mkGain(ctx, n);
      inT.connect(drv).connect(f1).connect(f2).connect(out);
      // cutoff modulation (cents) = LFO·depth·2400 + follower·follow·4800
      const mod = mkGain(ctx, n);
      mod.connect(f1.detune);
      mod.connect(f2.detune);
      const lfo = track(n, ctx.createOscillator());
      lfo.frequency.value = 1;
      const lfoG = mkGain(ctx, n, 0);
      lfo.connect(lfoG).connect(mod);
      lfo.start();
      // envelope follower: |x| -> 14 Hz low-pass -> log map (-50 dBFS..0 dBFS -> 0..1)
      const rect = track(n, ctx.createWaveShaper());
      rect.curve = new Float32Array([1, 0, 1]);
      const envLp = track(n, ctx.createBiquadFilter());
      envLp.type = "lowpass";
      envLp.frequency.value = 14;
      envLp.Q.value = Q_DB.bw2;
      const envMap = track(n, ctx.createWaveShaper());
      envMap.curve = curveFrom(8193, (x) => (x <= 0 ? 0 : clamp((20 * Math.log10(x) + 50) / 50, 0, 1)));
      const folG = mkGain(ctx, n, 0);
      inT.connect(rect).connect(envLp).connect(envMap).connect(folG).connect(mod);
      Object.assign(n, { input: inT, output: out, inT, drv, f1, f2, out, mod, lfo, lfoG, folG });
      // unconnected probes: getFrequencyResponse at the live (modulated) cutoff
      n.p1 = ctx.createBiquadFilter();
      n.p2 = ctx.createBiquadFilter();
      addMeters(ctx, n, inT, out);
      n.anMod = tapLast(ctx, n, mod);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      n.cutoff = P.cutoff;
      const two = P.slope === "24";
      const type = P.mode === "hp" ? "highpass" : P.mode === "bp" ? "bandpass" : P.mode === "notch" ? "notch" : P.mode === "peak" ? "peaking" : "lowpass";
      if (n.f1.type !== type) n.f1.type = type;
      n.f1.frequency.value = P.cutoff;
      n.f1.Q.value = P.q; // lp/hp: Web Audio takes dB here (today's behaviour); bp/notch/peak: linear Q
      n.f1.gain.value = type === "peaking" ? (two ? 6 : 12) : 0;
      if (two) {
        if (n.f2.type !== type) n.f2.type = type;
        n.f2.frequency.value = P.cutoff;
        n.f2.Q.value = type === "lowpass" || type === "highpass" ? Q_DB.bw2 : P.q;
        n.f2.gain.value = type === "peaking" ? 6 : 0;
      } else if (n.f2.type !== "peaking" || n.f2.gain.value !== 0) setIdentity(n.f2);
      n.out.gain.value = dbToLin(P.out);
      const d = clamp(P.drive, 0, 1);
      if (d > 0) {
        const k = 1 + d * 9;
        const s = Math.min(1, d * 8);
        n.drv.curve = curveFrom(4097, (x) => (1 - s) * x + (s * Math.tanh(k * x)) / Math.sqrt(k));
        n.drv.oversample = "2x";
      } else {
        n.drv.curve = null; // bypass-exact
        n.drv.oversample = "none";
      }
      n.lfo.frequency.value = P.lfoRate;
      n.lfoG.gain.value = P.lfoDepth * 2400;
      n.folG.gain.value = P.follow * 4800;
    },
    meter(n) {
      const cents = n.anMod ? lastOf(n.anMod, n.lbuf) : 0;
      return { ...peakMeter(n), cutoffNow: clamp(n.cutoff * Math.pow(2, cents / 1200), 1, n.sr * 0.499) };
    },
    // dB magnitude of the (linear) filter at the live cutoff, + output gain. The drive
    // curve is not included (it is a waveshaper).
    response(n, freqs) {
      const P = n.P;
      const len = freqs.length;
      const out = new Float32Array(len);
      if (!P) return out;
      const nyq = n.sr / 2;
      const f = new Float32Array(len);
      for (let i = 0; i < len; i++) f[i] = clamp(freqs[i], 1, nyq * 0.9999);
      const cut = clamp(P.cutoff * Math.pow(2, (n.anMod ? lastOf(n.anMod, n.lbuf) : 0) / 1200), 1, nyq * 0.9999);
      const probes = [[n.p1, n.f1]];
      if (P.slope === "24") probes.push([n.p2, n.f2]);
      const m = new Float32Array(len);
      const ph = new Float32Array(len);
      for (const [p, src] of probes) {
        p.type = src.type;
        p.frequency.value = cut;
        p.Q.value = src.Q.value;
        p.gain.value = src.gain.value;
        p.getFrequencyResponse(f, m, ph);
        for (let i = 0; i < len; i++) out[i] += 20 * Math.log10(Math.max(m[i], 1e-9));
      }
      for (let i = 0; i < len; i++) out[i] += P.out;
      return out;
    },
  },

  // ---------------------------------------------------------------- FX: formant (new)
  // 3 parallel band-passes at the VOX vowel formants. Frequency, Q and gain of each band
  // are driven audio-rate by an LFO through WaveShapers whose curves are the exact vowel
  // path (so the sweep passes through the vowels between `vowel` and `vowelTo`).
  formant: {
    name: "Anon",
    role: "Vowel Filter",
    kind: "fx",
    category: "Filter",
    color: "#f59e0b",
    params: [
      { key: "vowel", label: "Vowel (A–U)", min: 0, max: 4, step: 0.01, def: 0 },
      { key: "vowelTo", label: "Vowel to", min: 0, max: 4, step: 0.01, def: 2 },
      { key: "sweep", label: "Sweep", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "rate", label: "Sweep rate (Hz)", min: 0.05, max: 10, step: 0.01, def: 0.5, log: true },
      { key: "shift", label: "Shift (st)", min: -12, max: 12, step: 0.1, def: 0 },
      { key: "reso", label: "Resonance", min: 0.5, max: 3, step: 0.01, def: 1 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, lbuf: new Float32Array(32), bands: [] };
      const inT = mkGain(ctx, n);
      const sum = mkGain(ctx, n);
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n, 0);
      const out = mkGain(ctx, n);
      const lfo = track(n, ctx.createOscillator());
      lfo.frequency.value = 0.5;
      lfo.start();
      for (let k = 0; k < 3; k++) {
        const bp = track(n, ctx.createBiquadFilter());
        bp.type = "bandpass";
        bp.frequency.value = 0; // all three AudioParams are driven entirely by the LFO shapers
        bp.Q.value = 0;
        const g = mkGain(ctx, n, 0);
        const wf = track(n, ctx.createWaveShaper());
        const wq = track(n, ctx.createWaveShaper());
        const wg = track(n, ctx.createWaveShaper());
        lfo.connect(wf).connect(bp.frequency);
        lfo.connect(wq).connect(bp.Q);
        lfo.connect(wg).connect(g.gain);
        inT.connect(bp).connect(g).connect(sum);
        n.bands.push({ bp, g, wf, wq, wg });
      }
      sum.connect(wet).connect(out);
      inT.connect(dry).connect(out);
      Object.assign(n, { input: inT, output: out, inT, sum, wet, dry, out, lfo });
      addMeters(ctx, n, inT, out);
      n.anLfo = tapLast(ctx, n, lfo);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      n.lfo.frequency.value = P.rate;
      const vp = { shift: Math.pow(2, P.shift / 12), sharp: P.reso };
      const N = 513;
      const cf = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
      const cq = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
      const cg = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * 2 - 1;
        const v = P.vowel + (P.vowelTo - P.vowel) * P.sweep * (0.5 + 0.5 * x);
        const fm = voxFormants(vp, v);
        for (let k = 0; k < 3; k++) {
          cf[k][i] = clamp(fm[k].f, 20, n.sr * 0.45);
          cq[k][i] = fm[k].q;
          cg[k][i] = fm[k].g * FORMANT_MAKEUP;
        }
      }
      n.bands.forEach((b, k) => {
        b.wf.curve = cf[k];
        b.wq.curve = cq[k];
        b.wg.curve = cg[k];
      });
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
      n.out.gain.value = dbToLin(P.out);
    },
    meter(n) {
      const P = n.P || { vowel: 0, vowelTo: 2, sweep: 0, shift: 0, reso: 1 };
      const x = n.anLfo ? lastOf(n.anLfo, n.lbuf) : -1;
      const v = P.vowel + (P.vowelTo - P.vowel) * P.sweep * (0.5 + 0.5 * x);
      const fm = voxFormants({ shift: Math.pow(2, P.shift / 12), sharp: P.reso }, v);
      return { ...peakMeter(n), vowelNow: v, f1: fm[0].f, f2: fm[1].f, f3: fm[2].f };
    },
  },

  // ---------------------------------------------------------------- FX: drive
  // `soft` is the old channel-FX drive curve, so converted projects sound identical.
  drive: {
    name: "Hotwallet",
    role: "Tube Drive",
    kind: "fx",
    category: "Saturation",
    color: "#f97316",
    params: [
      { key: "amount", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.3 },
      {
        key: "character",
        label: "Character",
        options: [
          ["soft", "Soft"],
          ["tube", "Tube"],
          ["tape", "Tape"],
        ],
        def: "soft",
      },
      { key: "tone", label: "Tone", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "level", label: "Level (dB)", min: -12, max: 12, step: 0.1, def: 0 },
      {
        key: "auto",
        label: "Auto gain",
        options: [
          ["off", "Off"],
          ["on", "On"],
        ],
        def: "off",
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      {
        key: "hq",
        label: "Oversampling",
        options: [
          ["off", "Off"],
          ["on", "4×"],
        ],
        def: "off",
      },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, fn: null, g0: 1 };
      const inT = mkGain(ctx, n);
      const ws = track(n, ctx.createWaveShaper());
      const dcb = track(n, ctx.createBiquadFilter());
      setIdentity(dcb);
      const lp = track(n, ctx.createBiquadFilter());
      setIdentity(lp);
      const lvl = mkGain(ctx, n);
      const wet = mkGain(ctx, n);
      const dPre = mkGain(ctx, n, 1 / DRY_RANGE);
      const dws = track(n, ctx.createWaveShaper());
      dws.curve = new Float32Array([-1, 1]);
      const dPost = mkGain(ctx, n, DRY_RANGE);
      const dry = mkGain(ctx, n, 0);
      const out = mkGain(ctx, n);
      inT.connect(ws).connect(dcb).connect(lp).connect(lvl).connect(wet).connect(out);
      inT.connect(dPre).connect(dws).connect(dPost).connect(dry).connect(out);
      Object.assign(n, { input: inT, output: out, inT, ws, dcb, lp, lvl, wet, dws, dry, out, sig: "" });
      addMeters(ctx, n, inT, out);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      const sig = `${P.character}|${P.amount}`;
      if (sig !== n.sig) {
        n.sig = sig;
        const c = driveCurveFor(P.character, P.amount);
        n.ws.curve = c;
        n.fn = curveFn(c);
        n.g0 = n.fn(1e-3) / 1e-3;
        n.comp = autoGainOf(n.fn);
      }
      // asymmetric characters make DC: block it (soft is symmetric: exact unity)
      if (P.character === "soft") {
        if (n.dcb.type !== "peaking") setIdentity(n.dcb);
      } else {
        n.dcb.type = "highpass";
        n.dcb.frequency.value = 12;
        n.dcb.Q.value = Q_DB.bw2;
      }
      if (P.tone >= 0.999) {
        if (n.lp.type !== "peaking") setIdentity(n.lp);
      } else {
        n.lp.type = "lowpass";
        n.lp.frequency.value = Math.min(400 * Math.pow(50, P.tone), n.sr * 0.45);
        n.lp.Q.value = Q_DB.bw2;
      }
      n.lvl.gain.value = dbToLin(P.level) * (P.auto === "on" ? n.comp : 1);
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
      const os = P.hq === "on" ? "4x" : "none";
      n.ws.oversample = os;
      n.dws.oversample = os;
    },
    meter(n) {
      const m = peakMeter(n);
      let harm = 0;
      if (n.fn) {
        n.anIn.getFloatTimeDomainData(n.mbuf);
        harm = shapingOf(n.fn, n.mbuf, 1, n.g0);
      }
      return { ...m, harm };
    },
  },

  // ---------------------------------------------------------------- FX: tape (new)
  tape: {
    name: "Immutable",
    role: "Tape Saturator",
    kind: "fx",
    category: "Saturation",
    color: "#d9a066",
    params: [
      { key: "drive", label: "Drive (dB)", min: 0, max: 24, step: 0.1, def: 6 },
      { key: "bias", label: "Bias", min: 0, max: 1, step: 0.01, def: 0.5 },
      { key: "bump", label: "Head bump (dB)", min: 0, max: 6, step: 0.1, def: 2 },
      {
        key: "bumpFreq",
        label: "Bump freq (Hz)",
        options: [
          ["40", "40"],
          ["60", "60"],
          ["100", "100"],
        ],
        def: "60",
      },
      { key: "hfLoss", label: "HF loss (Hz)", min: 3000, max: 20000, step: 100, def: 14000, log: true },
      {
        key: "speed",
        label: "Speed (ips)",
        options: [
          ["7.5", "7.5"],
          ["15", "15"],
          ["30", "30"],
        ],
        def: "15",
      },
      { key: "wow", label: "Wow", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "flutter", label: "Flutter", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "hiss", label: "Hiss", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, fn: null, g: 1 };
      const inT = mkGain(ctx, n);
      const pre = mkGain(ctx, n);
      const ws = track(n, ctx.createWaveShaper());
      ws.oversample = "2x";
      const post = mkGain(ctx, n);
      const dcb = track(n, ctx.createBiquadFilter());
      dcb.type = "highpass";
      dcb.frequency.value = 8;
      dcb.Q.value = Q_DB.bw2;
      const bump = track(n, ctx.createBiquadFilter());
      setIdentity(bump);
      const lp = track(n, ctx.createBiquadFilter());
      lp.type = "lowpass";
      lp.Q.value = Q_DB.bw2;
      // wow/flutter: a short modulated delay, switched in only when used (so the default
      // path has no latency). The dry path gets the same delay while it is in.
      const direct = mkGain(ctx, n);
      const mdl = track(n, ctx.createDelay(0.05));
      mdl.delayTime.value = TAPE_DELAY;
      const mdlG = mkGain(ctx, n, 0);
      const bus = mkGain(ctx, n);
      const wet = mkGain(ctx, n);
      const out = mkGain(ctx, n);
      inT.connect(pre).connect(ws).connect(post).connect(dcb).connect(bump).connect(lp);
      lp.connect(direct).connect(bus);
      lp.connect(mdl).connect(mdlG).connect(bus);
      bus.connect(wet).connect(out);
      // hiss: looped noise -> HP 800 -> LP 12k -> gain -> bus
      const src = track(n, ctx.createBufferSource());
      src.buffer = noiseBuf(ctx);
      src.loop = true;
      const hh = track(n, ctx.createBiquadFilter());
      hh.type = "highpass";
      hh.frequency.value = 800;
      hh.Q.value = Q_DB.bw2;
      const hl = track(n, ctx.createBiquadFilter());
      hl.type = "lowpass";
      hl.frequency.value = Math.min(12000, ctx.sampleRate * 0.45);
      hl.Q.value = Q_DB.bw2;
      const hg = mkGain(ctx, n, 0);
      src.connect(hh).connect(hl).connect(hg).connect(bus);
      src.start();
      // dry, aligned with the oversampled wet path (identity shaper, same oversample)
      const dPre = mkGain(ctx, n, 1 / DRY_RANGE);
      const dws = track(n, ctx.createWaveShaper());
      dws.curve = new Float32Array([-1, 1]);
      dws.oversample = "2x";
      const dPost = mkGain(ctx, n, DRY_RANGE);
      const dDirect = mkGain(ctx, n);
      const ddl = track(n, ctx.createDelay(0.05));
      ddl.delayTime.value = TAPE_DELAY;
      const ddlG = mkGain(ctx, n, 0);
      const dry = mkGain(ctx, n, 0);
      inT.connect(dPre).connect(dws).connect(dPost);
      dPost.connect(dDirect).connect(dry);
      dPost.connect(ddl).connect(ddlG).connect(dry);
      dry.connect(out);
      // modulators: two wow LFOs, two flutter LFOs -> delay time
      const mods = [];
      for (const [hz, amt] of [
        [0.55, 0.0035],
        [1.4, 0.0015],
        [9, 0.00012],
        [14.3, 0.00007],
      ]) {
        const o = track(n, ctx.createOscillator());
        o.frequency.value = hz;
        const g = mkGain(ctx, n, 0);
        o.connect(g).connect(mdl.delayTime);
        o.start();
        mods.push({ o, g, amt, hz });
      }
      Object.assign(n, { input: inT, output: out, inT, pre, ws, post, bump, lp, direct, mdlG, wet, hg, dDirect, ddlG, dry, out, mods, sig: "", modOn: false });
      addMeters(ctx, n, inT, out);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      const speed = Number(P.speed) || 15;
      const sv = speed <= 7.5 ? 1.6 : speed >= 30 ? 0.6 : 1; // wow/flutter/hiss scale with speed
      const hs = speed <= 7.5 ? 0.7 : speed >= 30 ? 1.4 : 1; // HF / bump scale with speed
      const g = dbToLin(P.drive);
      n.g = g;
      const sig = `${P.bias}`;
      if (sig !== n.sig) {
        n.sig = sig;
        const beta = (P.bias - 0.5) * 0.8;
        const t0 = Math.tanh(beta);
        const sl = 1 - t0 * t0;
        const A = TAPE_RANGE;
        n.f = (a) => (Math.tanh(a + beta) - t0) / sl;
        n.ws.curve = curveFrom(16385, (u) => n.f(u * A));
      }
      n.pre.gain.value = g / TAPE_RANGE;
      n.post.gain.value = 1 / Math.sqrt(g);
      // head bump (frequency follows tape speed)
      const bf = clamp(Number(P.bumpFreq) * (speed / 15), 20, n.sr * 0.4);
      if (P.bump <= 0) {
        if (n.bump.type !== "peaking" || n.bump.gain.value !== 0) setIdentity(n.bump);
      } else {
        n.bump.type = "peaking";
        n.bump.frequency.value = bf;
        n.bump.Q.value = 1.1;
        n.bump.gain.value = P.bump;
      }
      n.lp.frequency.value = clamp(P.hfLoss * hs, 200, n.sr * 0.45);
      // wow / flutter
      const wf = P.wow + P.flutter;
      n.mods[0].g.gain.value = P.wow * n.mods[0].amt * sv;
      n.mods[1].g.gain.value = P.wow * n.mods[1].amt * sv;
      n.mods[2].g.gain.value = P.flutter * n.mods[2].amt * sv;
      n.mods[3].g.gain.value = P.flutter * n.mods[3].amt * sv;
      const on = wf > 0.001;
      if (on !== n.modOn) {
        n.modOn = on;
        fade(ctx, n.direct.gain, on ? 0 : 1, 0.01);
        fade(ctx, n.mdlG.gain, on ? 1 : 0, 0.01);
        fade(ctx, n.dDirect.gain, on ? 0 : 1, 0.01);
        fade(ctx, n.ddlG.gain, on ? 1 : 0, 0.01);
      }
      n.hg.gain.value = P.hiss * 0.012 * Math.sqrt(15 / speed);
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
      n.out.gain.value = dbToLin(P.out);
    },
    meter(n) {
      const m = peakMeter(n);
      let sat = 0;
      if (n.f) {
        n.anIn.getFloatTimeDomainData(n.mbuf);
        sat = shapingOf(n.f, n.mbuf, n.g, 1);
      }
      return { ...m, sat };
    },
  },

  dist: {
    name: "Degen",
    role: "Distortion",
    kind: "fx",
    category: "Saturation",
    color: "#ff4d4d",
    params: [
      { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.4 },
      {
        key: "tone",
        label: "Tone (Hz)",
        min: 500,
        max: 12000,
        step: 50,
        def: 5000,
      },
      { key: "level", label: "Level", min: 0, max: 1.5, step: 0.01, def: 0.7 },
      {
        key: "type",
        label: "Type",
        options: [
          ["overdrive", "Overdrive"],
          ["fuzz", "Fuzz"],
          ["hard", "Hard clip"],
          ["rectify", "Rectify"],
          ["fold", "Fold"],
        ],
        def: "overdrive", // = today's shaper: tanh(k·x)/tanh(k), k = 1 + 20·drive
      },
      { key: "mid", label: "Mid hump", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, fn: null, g0: 1 };
      const inT = mkGain(ctx, n);
      const midEq = track(n, ctx.createBiquadFilter());
      setIdentity(midEq);
      const ws = track(n, ctx.createWaveShaper());
      const dcb = track(n, ctx.createBiquadFilter());
      setIdentity(dcb);
      const lp = track(n, ctx.createBiquadFilter());
      lp.type = "lowpass";
      const g = mkGain(ctx, n);
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n, 0);
      const out = mkGain(ctx, n);
      inT.connect(midEq).connect(ws).connect(dcb).connect(lp).connect(g).connect(wet).connect(out);
      inT.connect(dry).connect(out);
      Object.assign(n, { input: inT, output: out, inT, midEq, ws, dcb, lp, g, wet, dry, out, sig: "" });
      addMeters(ctx, n, inT, out);
      n.anPre = ctx.createAnalyser();
      n.anPre.fftSize = 1024;
      n.anPre.smoothingTimeConstant = 0;
      midEq.connect(n.anPre);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      const sig = `${P.type}|${P.drive}`;
      if (sig !== n.sig) {
        n.sig = sig;
        const c = distCurveFor(P.type, P.drive);
        n.ws.curve = c;
        n.fn = curveFn(c);
        n.g0 = n.fn(1e-3) / 1e-3;
      }
      if (P.type === "overdrive" || P.type === "hard") {
        if (n.dcb.type !== "peaking") setIdentity(n.dcb);
      } else {
        n.dcb.type = "highpass";
        n.dcb.frequency.value = 12;
        n.dcb.Q.value = Q_DB.bw2;
      }
      if (P.mid > 0) {
        n.midEq.type = "peaking";
        n.midEq.frequency.value = 800;
        n.midEq.Q.value = 0.7;
        n.midEq.gain.value = P.mid * 14;
      } else if (n.midEq.gain.value !== 0) setIdentity(n.midEq);
      n.lp.frequency.value = P.tone;
      n.g.gain.value = P.level;
      const mix = clamp(P.mix, 0, 1);
      n.wet.gain.value = mix;
      n.dry.gain.value = 1 - mix;
    },
    meter(n) {
      const m = peakMeter(n);
      let clip = 0;
      if (n.fn) {
        n.anPre.getFloatTimeDomainData(n.mbuf);
        clip = shapingOf(n.fn, n.mbuf, 1, n.g0);
      }
      return { ...m, clip };
    },
  },

  crush: {
    name: "Dust",
    role: "Bitcrusher",
    kind: "fx",
    category: "Saturation",
    color: "#fb7185",
    params: [
      { key: "bits", label: "Bits", min: 2, max: 12, step: 0.1, def: 6 },
      {
        key: "tone",
        label: "Tone (Hz)",
        min: 500,
        max: 12000,
        step: 50,
        def: 7000,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
      { key: "downsample", label: "Downsample (×)", min: 1, max: 64, step: 1, def: 1 },
      { key: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01, def: 0 },
      {
        key: "dither",
        label: "Dither",
        options: [
          ["off", "Off"],
          ["on", "On"],
        ],
        def: "off",
      },
      { key: "out", label: "Output (dB)", min: -12, max: 12, step: 0.1, def: 0 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, wk: null, useWk: false, ready: null };
      const inG = mkGain(ctx, n);
      const natG = mkGain(ctx, n);
      const ws = track(n, ctx.createWaveShaper());
      const wkG = mkGain(ctx, n, 0);
      const lp = track(n, ctx.createBiquadFilter());
      lp.type = "lowpass";
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n);
      const sum = mkGain(ctx, n);
      const out = mkGain(ctx, n);
      inG.connect(natG).connect(ws).connect(lp);
      wkG.connect(lp);
      lp.connect(wet).connect(sum);
      inG.connect(dry).connect(sum);
      sum.connect(out);
      Object.assign(n, { input: inG, output: out, inT: inG, inG, natG, ws, wkG, lp, wet, dry, out });
      addMeters(ctx, n, inG, out);
      // the worklet takes over only when downsample/jitter/dither are in use; until it is
      // ready (or without AudioWorklet) the native quantiser path above is all there is.
      attachWorklet(ctx, n, "an-crush", () => ({ p: n.P ? crushWorkletParams(n.P) : undefined }), (wk) => {
        n.wk = wk;
        inG.connect(wk);
        wk.connect(wkG);
        crushRoute(ctx, n);
      });
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      n.ws.curve = makeDriveCurve(0, Math.pow(2, P.bits) / 2);
      n.lp.frequency.value = P.tone;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
      n.out.gain.value = dbToLin(P.out);
      if (n.wk) n.wk.port.postMessage({ type: "params", p: crushWorkletParams(P) });
      crushRoute(ctx, n);
    },
    meter(n) {
      const P = n.P;
      const ds = P ? Math.max(1, Math.round(P.downsample)) : 1;
      return { ...peakMeter(n), rate: n.useWk ? n.sr / ds : n.sr, active: n.useWk };
    },
    dispose: killWorklet,
  },

  chorus: {
    name: "Replica",
    role: "Chorus",
    kind: "fx",
    category: "Modulation",
    color: "#c084fc",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 6,
        step: 0.05,
        def: 0.8,
      },
      {
        key: "depth",
        label: "Depth (ms)",
        min: 0.5,
        max: 12,
        step: 0.1,
        def: 3.5,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
      {
        key: "voices",
        label: "Voices",
        options: [
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
        ],
        def: "1",
      },
      { key: "base", label: "Base delay (ms)", min: 5, max: 30, step: 0.5, def: 20 },
      { key: "width", label: "Width", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "feedback", label: "Feedback", min: 0, max: 0.6, step: 0.01, def: 0 },
      { key: "tone", label: "Wet low-cut (Hz)", min: 100, max: 8000, step: 10, def: 100, log: true },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, fbs: [], lbuf: new Float32Array(32), sp: null };
      const inT = mkGain(ctx, n);
      const cEn = mkGain(ctx, n);
      const vsum = mkGain(ctx, n);
      const hp = track(n, ctx.createBiquadFilter());
      setIdentity(hp);
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n);
      const out = mkGain(ctx, n);
      const q = makeQuad(ctx, n);
      const lfo = q.s;
      // voice 1 is the old chorus, node for node (sine LFO -> gain -> delayTime)
      const dls = [];
      const vgs = [];
      for (let k = 0; k < 3; k++) {
        const dl = track(n, ctx.createDelay(0.1));
        dl.delayTime.value = 0.02;
        const vg = mkGain(ctx, n, k === 0 ? 1 : 0);
        cEn.connect(dl).connect(vg).connect(vsum);
        dls.push(dl);
        vgs.push(vg);
      }
      const lg = mkGain(ctx, n);
      lfo.connect(lg).connect(dls[0].delayTime);
      const lgS = [null];
      const lgC = [null];
      for (let k = 1; k < 3; k++) {
        const a = mkGain(ctx, n, 0);
        const b = mkGain(ctx, n, 0);
        q.s.connect(a).connect(dls[k].delayTime);
        q.c.connect(b).connect(dls[k].delayTime);
        lgS.push(a);
        lgC.push(b);
      }
      inT.connect(cEn);
      vsum.connect(hp).connect(wet).connect(out);
      inT.connect(dry).connect(out);
      dls.forEach((dl) => addFb(ctx, n, dl));
      Object.assign(n, { input: inT, output: out, inT, cEn, vsum, hp, wet, dry, out, q, lfo, lfoC: q.c, lg, dls, vgs, lgS, lgC });
      addMeters(ctx, n, inT, out);
      n.anS = tapLast(ctx, n, q.s);
      n.anC = tapLast(ctx, n, q.c);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      const N = Number(P.voices) || 1;
      const base = P.base / 1000;
      const depth = P.depth / 1000;
      const w = clamp(P.width, 0, 1);
      setFreqBoth(n.q, P.rate);
      const phases = chorusPhases(N);
      n.phases = phases;
      const vg = 1 / Math.sqrt(N);
      n.lg.gain.value = depth;
      for (let k = 0; k < 3; k++) {
        n.dls[k].delayTime.value = base * VOICE_BASE[k];
        n.vgs[k].gain.value = k < N ? vg : 0;
        if (k > 0) {
          const ph = phases[k] || 0;
          n.lgS[k].gain.value = depth * Math.cos(ph);
          n.lgC[k].gain.value = depth * Math.sin(ph);
        }
      }
      // stereo: separate L / R delay lines whose LFO is offset by width·180°, built the
      // first time width > 0 (the default path never touches a splitter or merger)
      if (w > 0.001 && !n.sp) buildChorusStereo(ctx, n);
      if (n.sp) {
        const sp = n.sp;
        for (let c = 0; c < 2; c++) {
          for (let k = 0; k < 3; k++) {
            const ph = (phases[k] || 0) + (c === 1 ? w * Math.PI : 0);
            sp.dl[c][k].delayTime.value = base * VOICE_BASE[k];
            sp.vg[c][k].gain.value = k < N ? vg : 0;
            sp.gS[c][k].gain.value = depth * Math.cos(ph);
            sp.gC[c][k].gain.value = depth * Math.sin(ph);
          }
        }
        const stereo = w > 0.001;
        fade(ctx, n.cEn.gain, stereo ? 0 : 1);
        fade(ctx, sp.sEn.gain, stereo ? 1 : 0);
      }
      setFb(n, P.feedback);
      if (P.tone <= 100.5) {
        if (n.hp.type !== "peaking") setIdentity(n.hp);
      } else {
        n.hp.type = "highpass";
        n.hp.frequency.value = P.tone;
        n.hp.Q.value = Q_DB.bw2;
      }
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
    meter(n) {
      const s = lastOf(n.anS, n.lbuf);
      const c = lastOf(n.anC, n.lbuf);
      const N = n.P ? Number(n.P.voices) || 1 : 1;
      const ph = n.phases || [0, 0, 0];
      const lfo = [0, 1, 2].map((k) => (k < N ? Math.cos(ph[k] || 0) * s + Math.sin(ph[k] || 0) * c : 0));
      return { ...peakMeter(n), lfo };
    },
  },

  flanger: {
    name: "Slippage",
    role: "Flanger",
    kind: "fx",
    category: "Modulation",
    color: "#818cf8",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 4,
        step: 0.05,
        def: 0.3,
      },
      {
        key: "depth",
        label: "Depth (ms)",
        min: 0.2,
        max: 5,
        step: 0.1,
        def: 2,
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        def: 0.4,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
      { key: "manual", label: "Manual (ms)", min: 0.1, max: 10, step: 0.1, def: 4 },
      { key: "stereo", label: "Stereo", min: 0, max: 1, step: 0.01, def: 0 },
      {
        key: "polarity",
        label: "Polarity",
        options: [
          ["pos", "Positive"],
          ["neg", "Negative"],
        ],
        def: "pos",
      },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, fbs: [], lbuf: new Float32Array(32), sp: null };
      const inT = mkGain(ctx, n);
      const cEn = mkGain(ctx, n);
      const dl = track(n, ctx.createDelay(0.05));
      dl.delayTime.value = 0.004;
      const q = makeQuad(ctx, n);
      const lg = mkGain(ctx, n);
      q.s.connect(lg).connect(dl.delayTime);
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n);
      const out = mkGain(ctx, n);
      inT.connect(cEn).connect(dl).connect(wet).connect(out);
      addFb(ctx, n, dl, true); // the old flanger's loop: always connected
      inT.connect(dry).connect(out);
      Object.assign(n, { input: inT, output: out, inT, cEn, dl, q, lfo: q.s, lfoC: q.c, lg, wet, dry, out });
      addMeters(ctx, n, inT, out);
      n.anS = tapLast(ctx, n, q.s);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      setFreqBoth(n.q, P.rate);
      const depth = P.depth / 1000;
      const man = P.manual / 1000;
      n.lg.gain.value = depth;
      n.dl.delayTime.value = man;
      const s = clamp(P.stereo, 0, 1);
      if (s > 0.001 && !n.sp) buildFlangerStereo(ctx, n);
      if (n.sp) {
        const sp = n.sp;
        const ph = s * Math.PI;
        sp.dlL.delayTime.value = man;
        sp.dlR.delayTime.value = man;
        sp.lgL.gain.value = depth;
        sp.gS.gain.value = depth * Math.cos(ph);
        sp.gC.gain.value = depth * Math.sin(ph);
        fade(ctx, n.cEn.gain, s > 0.001 ? 0 : 1);
        fade(ctx, sp.sEn.gain, s > 0.001 ? 1 : 0);
      }
      setFb(n, (P.polarity === "neg" ? -1 : 1) * P.feedback);
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
    meter(n) {
      const lfo = lastOf(n.anS, n.lbuf);
      const P = n.P || { manual: 4, depth: 2 };
      const floorMs = (128 / n.sr) * 1000; // delay inside a feedback loop cannot go below 1 render quantum
      return { ...peakMeter(n), lfo, delay: Math.max(floorMs, P.manual + P.depth * lfo) };
    },
  },

  phaser: {
    name: "Retarget",
    role: "Phaser",
    kind: "fx",
    category: "Modulation",
    color: "#f472b6",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 6,
        step: 0.05,
        def: 0.5,
      },
      { key: "depth", label: "Depth", min: 100, max: 2000, step: 10, def: 800 },
      {
        key: "base",
        label: "Base (Hz)",
        min: 200,
        max: 2000,
        step: 10,
        def: 500,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
      {
        key: "stages",
        label: "Stages",
        options: [
          ["2", "2"],
          ["4", "4"],
          ["6", "6"],
          ["8", "8"],
          ["12", "12"],
        ],
        def: "4",
      },
      { key: "feedback", label: "Feedback", min: -0.9, max: 0.9, step: 0.01, def: 0 },
      { key: "stereo", label: "Stereo", min: 0, max: 1, step: 0.01, def: 0 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, lbuf: new Float32Array(32), sp: null };
      const inT = mkGain(ctx, n);
      const cEn = mkGain(ctx, n);
      const q = makeQuad(ctx, n);
      const wet = mkGain(ctx, n);
      const dry = mkGain(ctx, n);
      const out = mkGain(ctx, n);
      const ch = makeApChain(ctx, n, q.s, null);
      wireChain(ch, 4);
      inT.connect(cEn).connect(ch.head);
      ch.tail.connect(wet).connect(out);
      inT.connect(dry).connect(out);
      Object.assign(n, { input: inT, output: out, inT, cEn, q, lfo: q.s, lfoC: q.c, ch, wet, dry, out });
      addMeters(ctx, n, inT, out);
      n.anS = tapLast(ctx, n, q.s);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      setFreqBoth(n.q, P.rate);
      const N = Number(P.stages) || 4;
      const s = clamp(P.stereo, 0, 1);
      if (s > 0.001 && !n.sp) buildPhaserStereo(ctx, n);
      const chains = [[n.ch, 0]];
      if (n.sp) chains.push([n.sp.L, 0], [n.sp.R, s * Math.PI]);
      for (const [ch, ph] of chains) {
        wireChain(ch, N);
        ch.stages.forEach((st) => {
          st.frequency.value = P.base;
        });
        ch.lgS.gain.value = P.depth * Math.cos(ph);
        if (ch.lgC) ch.lgC.gain.value = P.depth * Math.sin(ph);
        setChainFb(ch, P.feedback);
      }
      if (n.sp) {
        fade(ctx, n.cEn.gain, s > 0.001 ? 0 : 1);
        fade(ctx, n.sp.sEn.gain, s > 0.001 ? 1 : 0);
      }
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
    meter(n) {
      const lfo = lastOf(n.anS, n.lbuf);
      const P = n.P || { base: 500, depth: 800 };
      return { ...peakMeter(n), lfo, centre: clamp(P.base + P.depth * lfo, 0, n.sr * 0.5) };
    },
  },

  trem: {
    name: "Whipsaw",
    role: "Tremolo / AutoPan",
    kind: "fx",
    category: "Modulation",
    color: "#54a0ff",
    params: [
      { key: "rate", label: "Rate (Hz)", min: 0.1, max: 16, step: 0.1, def: 5 },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.6 },
      { key: "pan", label: "AutoPan amt", min: 0, max: 1, step: 0.01, def: 0 },
      {
        key: "shape",
        label: "Shape",
        options: [
          ["sine", "Sine"],
          ["triangle", "Triangle"],
          ["square", "Square"],
          ["saw", "Saw"],
        ],
        def: "sine",
      },
      { key: "stereo", label: "Stereo", min: 0, max: 1, step: 0.01, def: 0 },
      { key: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01, def: 0.2 },
    ],
    create(ctx) {
      const n = { all: [], sr: ctx.sampleRate, lbuf: new Float32Array(32), sp: null };
      const inT = mkGain(ctx, n);
      const cEn = mkGain(ctx, n);
      const g = track(n, ctx.createGain());
      const pan = track(n, ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain());
      const lfo = track(n, ctx.createOscillator());
      const lg = mkGain(ctx, n, 0);
      const plg = mkGain(ctx, n, 0);
      const dG = mkGain(ctx, n);
      const sLp = track(n, ctx.createBiquadFilter());
      sLp.type = "lowpass";
      sLp.Q.value = Q_DB.bw2;
      const sG = mkGain(ctx, n, 0);
      const mixL = mkGain(ctx, n);
      lfo.connect(dG).connect(mixL);
      lfo.connect(sLp).connect(sG).connect(mixL);
      mixL.connect(lg).connect(g.gain);
      if (pan.pan) mixL.connect(plg).connect(pan.pan);
      lfo.start();
      inT.connect(cEn).connect(g).connect(pan);
      Object.assign(n, { input: inT, output: pan, inT, cEn, g, pan, lfo, lg, plg, dG, sLp, sG, mixL });
      addMeters(ctx, n, inT, pan);
      n.anL = tapLast(ctx, n, mixL);
      return n;
    },
    apply(ctx, n, P) {
      n.P = P;
      const shape = P.shape === "saw" ? "sawtooth" : P.shape === "square" || P.shape === "triangle" ? P.shape : "sine";
      if (n.lfo.type !== shape) n.lfo.type = shape;
      n.lfo.frequency.value = P.rate;
      n.g.gain.value = 1 - P.depth / 2;
      n.lg.gain.value = P.depth / 2;
      n.plg.gain.value = P.pan;
      const soft = shape === "square" || shape === "sawtooth";
      n.dG.gain.value = soft ? 0 : 1;
      n.sG.gain.value = soft ? 1 : 0;
      // smooth: LFO low-pass at 90× rate (0) … 1.5× rate (1)
      n.sLp.frequency.value = clamp(P.rate * 90 * Math.pow(1.5 / 90, clamp(P.smooth, 0, 1)), 0.5, 20000);
      const s = clamp(P.stereo, 0, 1);
      if (s > 0.001 && !n.sp) buildTremStereo(ctx, n);
      if (n.sp) {
        const sp = n.sp;
        sp.gL.gain.value = 1 - P.depth / 2;
        sp.gR.gain.value = 1 - P.depth / 2;
        sp.lgL.gain.value = P.depth / 2;
        sp.lgR.gain.value = P.depth / 2;
        // R lags L by stereo·180°: a delayed copy of the LFO (exact for every shape)
        sp.dly.delayTime.setTargetAtTime((s * 0.5) / P.rate, ctx.currentTime, 0.05);
        fade(ctx, n.cEn.gain, s > 0.001 ? 0 : 1);
        fade(ctx, sp.sEn.gain, s > 0.001 ? 1 : 0);
      }
    },
    meter(n) {
      return { ...peakMeter(n), lfo: lastOf(n.anL, n.lbuf) };
    },
  },

  // ---------------------------------------------------------------- FX: sends
  // Pass the signal straight through and tap a copy into the project's shared delay
  // or reverb. Where the send sits in the chain decides what it taps.
  delaySend: {
    name: "Blocktime",
    role: "Delay send",
    shared: "delay",
    kind: "fx",
    category: "Space",
    color: "#facc15",
    params: [
      { key: "amount", label: "Send", min: 0, max: 1, step: 0.01, def: 0.25 },
    ],
    create(ctx, env) {
      return makeSend(ctx, env?.delayBus);
    },
    apply(ctx, n, P) {
      n.send.gain.value = P.amount;
    },
  },

  reverbSend: {
    name: "Liquidity",
    role: "Reverb send",
    shared: "reverb",
    kind: "fx",
    category: "Space",
    color: "#a78bfa",
    params: [
      { key: "amount", label: "Send", min: 0, max: 1, step: 0.01, def: 0.25 },
    ],
    create(ctx, env) {
      return makeSend(ctx, env?.reverbBus);
    },
    apply(ctx, n, P) {
      n.send.gain.value = P.amount;
    },
  },
};

export const CHAIN_KINDS = ["inserts", "fx"]; // signal order: fader → inserts → FX
export const KIND_OF_CHAIN = { inserts: "insert", fx: "fx" };

export function pluginDefaults(type) {
  const out = {};
  (PLUGIN_TYPES[type]?.params || []).forEach((p) => {
    out[p.key] = p.def;
  });
  return out;
}

// Plugins offered by a chain's Add list, grouped by category in registry order.
export function pluginsFor(chain) {
  const kind = KIND_OF_CHAIN[chain];
  const groups = new Map();
  for (const [id, t] of Object.entries(PLUGIN_TYPES)) {
    if (t.kind !== kind) continue;
    if (!groups.has(t.category)) groups.set(t.category, []);
    groups.get(t.category).push([id, t]);
  }
  return groups;
}

// Short "EQ, Compressor, …" list for button tooltips.
export function pluginNames(chain) {
  return [...pluginsFor(chain).values()]
    .flat()
    .map(([, t]) => t.name)
    .join(", ");
}

let idSeq = 0;
export function slotId() {
  idSeq = (idSeq + 1) % 1e6;
  return `s${Date.now().toString(36)}${idSeq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function makeSlot(type, params) {
  return {
    id: slotId(),
    type,
    enabled: true,
    params: { ...pluginDefaults(type), ...(params || {}) },
  };
}
// Back-compat name used by older call sites.
export const makeInsert = makeSlot;

const MAX_SLOTS = 32; // per chain — a sanity bound for loaded files, not a UI limit

function cleanSlot(raw) {
  if (!raw || typeof raw !== "object" || !PLUGIN_TYPES[raw.type]) return null;
  const t = PLUGIN_TYPES[raw.type];
  const params = {};
  for (const p of t.params) {
    const v = raw.params?.[p.key];
    if (p.options)
      params[p.key] = p.options.some(([o]) => o === v) ? v : p.def;
    else
      params[p.key] = Number.isFinite(+v)
        ? Math.max(p.min, Math.min(p.max, +v))
        : p.def;
  }
  return {
    id: typeof raw.id === "string" && /^[\w-]{1,40}$/.test(raw.id) ? raw.id : slotId(),
    type: raw.type,
    enabled: raw.enabled !== false,
    params,
  };
}

export function cleanChain(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const s = cleanSlot(raw);
    if (!s) continue; // drops the empty (null) slots of the old 4-slot layout
    if (seen.has(s.id)) s.id = slotId();
    seen.add(s.id);
    out.push(s);
    if (out.length >= MAX_SLOTS) break;
  }
  return out;
}

const isLegacyFx = (fx) => !!fx && typeof fx === "object" && !Array.isArray(fx);

// Convert the old fixed channel FX object ({ filter, cutoff, drive, delay, reverb })
// into chain slots. Only settings that did something become slots.
// Returns { pre, post }: filter + drive ran BEFORE the old inserts, the sends after.
export function legacyFxSlots(fx) {
  const pre = [];
  const post = [];
  if (!isLegacyFx(fx)) return { pre, post };
  if (fx.filter === "lp" || fx.filter === "hp")
    pre.push(
      makeSlot("filter", {
        mode: fx.filter,
        cutoff: Math.max(
          20,
          Math.min(20000, +fx.cutoff || (fx.filter === "hp" ? 200 : 8000)),
        ),
        q: 0.9,
      }),
    );
  if (+fx.drive > 0)
    pre.push(makeSlot("drive", { amount: Math.min(1, +fx.drive) }));
  if (+fx.delay > 0)
    post.push(makeSlot("delaySend", { amount: Math.min(1, +fx.delay) }));
  if (+fx.reverb > 0)
    post.push(makeSlot("reverbSend", { amount: Math.min(1, +fx.reverb) }));
  return { pre, post };
}

// ------------------------------------------------------------------ strip sends
// A strip's delay and reverb sends are two values on the strip, owner.sends:
//   { delay: { amount, enabled }, reverb: { amount, enabled } }   (a bus is absent when unused)
// They tap the signal after the LAST plugin, which is where every shipped song already had
// them. Older files stored each send as a plugin slot at the end of the FX list; normalizeOwner
// folds those into owner.sends. A send that sits before another plugin stays a slot, so the
// tap point (and the sound) never moves.
export const SEND_BUSES = ["delay", "reverb"];
export const SEND_TYPE = { delay: "delaySend", reverb: "reverbSend" };
const SEND_BUS_OF = { delaySend: "delay", reverbSend: "reverb" };
export const sendBusOf = (type) => SEND_BUS_OF[type] || null;

export function cleanSends(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const bus of SEND_BUSES) {
    const r = raw[bus];
    if (!r || typeof r !== "object") continue;
    const a = +r.amount;
    out[bus] = {
      amount: Number.isFinite(a) ? Math.max(0, Math.min(1, a)) : 0.25,
      enabled: r.enabled !== false,
    };
  }
  return out;
}

// The strip's sends dressed as slots, so a list of plugin rows can show and edit them the same
// way. Reads and writes go straight to owner.sends. Ids look like "send:delay".
export function sendRows(owner) {
  if (!owner?.sends) return [];
  return SEND_BUSES.filter((bus) => owner.sends[bus]).map((bus) => {
    const rec = owner.sends[bus];
    return {
      id: `send:${bus}`,
      type: SEND_TYPE[bus],
      synthetic: bus,
      get enabled() {
        return rec.enabled !== false;
      },
      set enabled(v) {
        rec.enabled = !!v;
      },
      get params() {
        return { amount: rec.amount };
      },
      set params(p) {
        const a = +p?.amount;
        if (Number.isFinite(a)) rec.amount = Math.max(0, Math.min(1, a));
      },
    };
  });
}

// Add a send to a strip, or return false if it already has one for that bus.
export function addSend(owner, bus, amount = 0.25) {
  if (!SEND_TYPE[bus]) return false;
  owner.sends = cleanSends(owner.sends);
  if (owner.sends[bus]) return false;
  owner.sends[bus] = { amount, enabled: true };
  return true;
}

// Bring a channel or synth to the current shape, in place: fx and inserts become
// clean slot arrays. A legacy fx object converts with the same signal order it had:
// if there were inserts, its filter/drive go to the front of the insert chain
// (they ran before the inserts); otherwise everything lands in the FX chain.
// Returns true if anything changed.
export function normalizeOwner(owner) {
  if (!owner) return false;
  const beforeIns = owner.inserts;
  const beforeFx = owner.fx;
  const beforeSends = owner.sends;
  let inserts = cleanChain(owner.inserts);
  let fx;
  if (isLegacyFx(owner.fx)) {
    const { pre, post } = legacyFxSlots(owner.fx);
    if (inserts.some((s) => s.enabled)) {
      inserts = [...pre, ...inserts];
      fx = post;
    } else fx = [...pre, ...post];
  } else fx = cleanChain(owner.fx);
  // ids key live plugin instances, so they must be unique across both chains
  const insIds = new Set(inserts.map((s) => s.id));
  for (const s of fx) if (insIds.has(s.id)) s.id = slotId();
  // Fold the send slots at the very end of the signal path into owner.sends. A bus the strip
  // already has a send for keeps its extra slot (still audible, still in the list).
  const sends = cleanSends(owner.sends);
  const tail = [...inserts, ...fx];
  let end = tail.length;
  while (end > 0 && SEND_BUS_OF[tail[end - 1].type]) end--;
  const folded = new Set();
  for (const s of tail.slice(end)) {
    const bus = SEND_BUS_OF[s.type];
    if (sends[bus]) continue;
    sends[bus] = { amount: s.params.amount, enabled: s.enabled };
    folded.add(s.id);
  }
  if (folded.size) {
    inserts = inserts.filter((s) => !folded.has(s.id));
    fx = fx.filter((s) => !folded.has(s.id));
  }
  const changed =
    JSON.stringify(inserts) !== JSON.stringify(beforeIns) ||
    JSON.stringify(fx) !== JSON.stringify(beforeFx) ||
    JSON.stringify(sends) !== JSON.stringify(beforeSends);
  if (changed) {
    owner.inserts = inserts;
    owner.fx = fx;
    owner.sends = sends;
  }
  return changed;
}

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
  filter: {
    name: "Filter",
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
    ],
    create(ctx) {
      const f = ctx.createBiquadFilter();
      return { input: f, output: f, f };
    },
    apply(ctx, n, P) {
      n.f.type =
        P.mode === "hp" ? "highpass" : P.mode === "bp" ? "bandpass" : "lowpass";
      n.f.frequency.value = P.cutoff;
      n.f.Q.value = P.q;
    },
  },

  // ---------------------------------------------------------------- FX: drive
  // Same soft-clip curve as the old channel FX drive, so converted projects sound identical.
  drive: {
    name: "Drive",
    kind: "fx",
    category: "Saturation",
    color: "#f97316",
    params: [
      { key: "amount", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.3 },
    ],
    create(ctx) {
      const ws = ctx.createWaveShaper();
      return { input: ws, output: ws, ws };
    },
    apply(ctx, n, P) {
      n.ws.curve = softClipCurve(P.amount);
    },
  },

  dist: {
    name: "Distortion",
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
    ],
    create(ctx) {
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      const g = ctx.createGain();
      ws.connect(lp).connect(g);
      return { input: ws, output: g, ws, lp, g };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(P.drive);
      n.lp.frequency.value = P.tone;
      n.g.gain.value = P.level;
    },
  },

  crush: {
    name: "Bitcrusher (lo-fi)",
    kind: "fx",
    category: "Saturation",
    color: "#fb7185",
    params: [
      { key: "bits", label: "Bits", min: 2, max: 12, step: 1, def: 6 },
      {
        key: "tone",
        label: "Tone (Hz)",
        min: 500,
        max: 12000,
        step: 50,
        def: 7000,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(ws).connect(lp).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, ws, lp, wet, dry };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(0, Math.pow(2, P.bits) / 2);
      n.lp.frequency.value = P.tone;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  chorus: {
    name: "Chorus",
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
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.1);
      dl.delayTime.value = 0.02;
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime);
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(dl).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, dl, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth / 1000;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  flanger: {
    name: "Flanger",
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
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.05);
      dl.delayTime.value = 0.004;
      const fb = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime);
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(dl).connect(wet).connect(out);
      dl.connect(fb).connect(dl);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, dl, fb, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth / 1000;
      n.fb.gain.value = P.feedback;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  phaser: {
    name: "Phaser",
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
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const stages = [];
      let node = inG;
      for (let i = 0; i < 4; i++) {
        const ap = ctx.createBiquadFilter();
        ap.type = "allpass";
        ap.Q.value = 0.6;
        node.connect(ap);
        node = ap;
        stages.push(ap);
      }
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg);
      stages.forEach((s) => lg.connect(s.frequency));
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      node.connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, stages, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth;
      n.stages.forEach((s) => {
        s.frequency.value = P.base;
      });
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  trem: {
    name: "Tremolo / AutoPan",
    kind: "fx",
    category: "Modulation",
    color: "#54a0ff",
    params: [
      { key: "rate", label: "Rate (Hz)", min: 0.1, max: 16, step: 0.1, def: 5 },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.6 },
      { key: "pan", label: "AutoPan amt", min: 0, max: 1, step: 0.01, def: 0 },
    ],
    create(ctx) {
      const g = ctx.createGain();
      const pan = ctx.createStereoPanner
        ? ctx.createStereoPanner()
        : ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      const plg = ctx.createGain();
      lfo.connect(lg).connect(g.gain);
      if (pan.pan) lfo.connect(plg).connect(pan.pan);
      lfo.start();
      g.connect(pan);
      return { input: g, output: pan, g, pan, lfo, lg, plg };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.g.gain.value = 1 - P.depth / 2;
      n.lg.gain.value = P.depth / 2;
      n.plg.gain.value = P.pan;
    },
  },

  // ---------------------------------------------------------------- FX: sends
  // Pass the signal straight through and tap a copy into the project's shared delay
  // or reverb. Where the send sits in the chain decides what it taps.
  delaySend: {
    name: "Delay send",
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
    name: "Reverb send",
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

// Bring a channel or synth to the current shape, in place: fx and inserts become
// clean slot arrays. A legacy fx object converts with the same signal order it had:
// if there were inserts, its filter/drive go to the front of the insert chain
// (they ran before the inserts); otherwise everything lands in the FX chain.
// Returns true if anything changed.
export function normalizeOwner(owner) {
  if (!owner) return false;
  const beforeIns = owner.inserts;
  const beforeFx = owner.fx;
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
  const changed =
    JSON.stringify(inserts) !== JSON.stringify(beforeIns) ||
    JSON.stringify(fx) !== JSON.stringify(beforeFx);
  if (changed) {
    owner.inserts = inserts;
    owner.fx = fx;
  }
  return changed;
}

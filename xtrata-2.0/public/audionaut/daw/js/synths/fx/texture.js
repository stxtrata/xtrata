// synths/fx/texture.js — jiTEXTURE: noise, drones, risers, grain clouds and impacts (Audionaut synth module).
//
// A sound-design instrument for the things that are NOT notes: five models that all follow the pitch you play, so
// a riser can land on the key of the track and a drone can sit under a chord.
//   WIND    stereo band-passed noise (two resonant bands) with slow gusts; RESONANCE turns it into a whistle
//   RISER   noise band + saw pair that sweep up across the WHOLE note length (the note length IS the riser length),
//           with a tremolo that accelerates; arrives on the played pitch
//   DRONE   five detuned saws + sub, low-pass with a slow wandering cutoff, slow attack — a pad made of weather
//   CLOUD   granular: grains of sine / filtered noise scattered over the note, optionally snapped to a chord
//           (offline-rendered into a stereo buffer, cached; three variants so repeats are never identical)
//   IMPACT  sub boom with a pitch drop + noise crack + rumble tail; ignores the gate, DECAY sets the tail
// Shared: NOISE COLOUR (white -> pink -> brown), TONE / RESONANCE / KEY TRACKING for the filter, TONAL (noise vs
// pitched balance), MOTION + RATE (LFO depth and speed), SPREAD (stereo width / detune / grain scatter).
// Plain ES module, no imports. WIND/RISER/DRONE/IMPACT are node graphs; CLOUD is a JS render.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001;
const GAIN = 0.4; // master voice scale (calibrated against the harness RMS band)

const MODELS = ["wind", "riser", "drone", "cloud", "impact"];
const CHORDS = {
  free: null,
  octaves: [0],
  fifths: [0, 7],
  major: [0, 4, 7, 11],
  minor: [0, 3, 7, 10],
  cluster: [0, 1, 2, 3, 5],
};

// ---------------------------------------------------------------- noise buffers (4 s, per context and colour)
const noiseCache = new WeakMap();
function noiseBuf(ctx, kind) {
  let m = noiseCache.get(ctx);
  if (!m) {
    m = {};
    noiseCache.set(ctx, m);
  }
  if (m[kind]) return m[kind];
  const n = Math.round(ctx.sampleRate * 4);
  const b = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = b.getChannelData(0);
  let s = 1234567 + kind.length * 7919;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1;
  };
  if (kind === "white") {
    for (let i = 0; i < n; i++) d[i] = rnd();
  } else if (kind === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const w = rnd();
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
      b6 = w * 0.115926;
    }
  } else {
    let y = 0;
    for (let i = 0; i < n; i++) {
      y = (y + 0.02 * rnd()) / 1.02;
      d[i] = y;
    }
  }
  // equal RMS for all three colours, and remove DC
  let mean = 0;
  for (let i = 0; i < n; i++) mean += d[i];
  mean /= n;
  let e = 0;
  for (let i = 0; i < n; i++) {
    d[i] -= mean;
    e += d[i] * d[i];
  }
  const g = 0.25 / Math.sqrt(e / n);
  for (let i = 0; i < n; i++) d[i] *= g;
  m[kind] = b;
  return b;
}

// white/pink/brown crossfade driven by COLOUR (0..1). Returns the mix gain node; sources get pushed for start/stop.
function noiseMix(ctx, color, sources, track) {
  const out = track(ctx.createGain());
  const w = [Math.max(0, 1 - 2 * color), 1 - Math.abs(2 * color - 1), Math.max(0, 2 * color - 1)];
  ["white", "pink", "brown"].forEach((kind, i) => {
    if (w[i] < 0.02) return;
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf(ctx, kind);
    s.loop = true;
    const g = track(ctx.createGain());
    g.gain.value = w[i];
    s.connect(g);
    g.connect(out);
    sources.push(s);
    track(s);
  });
  return out;
}

let clipCurve = null;
function safetyCurve() {
  if (!clipCurve) {
    const n = 513;
    clipCurve = new Float32Array(n);
    for (let i = 0; i < n; i++) clipCurve[i] = Math.tanh((i * 2) / (n - 1) - 1);
  }
  return clipCurve;
}

const paramDefs = [
  { key: "model", label: "Model", type: "select", def: "wind", options: MODELS },
  { key: "tone", label: "Tone (filter position)", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "res", label: "Resonance", type: "range", min: 0, max: 1, step: 0.01, def: 0.3 },
  { key: "track", label: "Key Tracking", type: "range", min: 0, max: 1, step: 0.01, def: 0.8 },
  { key: "color", label: "Noise Colour (white-pink-brown)", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "tonal", label: "Tonal (noise -> pitched)", type: "range", min: 0, max: 1, step: 0.01, def: 0.3 },
  { key: "motion", label: "Motion", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "rate", label: "Motion Rate (Hz)", type: "range", min: 0.05, max: 12, step: 0.05, def: 0.6 },
  { key: "sweep", label: "Sweep / Drop (oct)", type: "range", min: 0, max: 6, step: 0.1, def: 3 },
  { key: "spread", label: "Spread", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "density", label: "Grain Density (/s)", type: "range", min: 2, max: 120, step: 1, def: 30 },
  { key: "grain", label: "Grain Length (s)", type: "range", min: 0.01, max: 0.4, step: 0.005, def: 0.09 },
  { key: "chord", label: "Grain Pitches", type: "select", def: "fifths", options: Object.keys(CHORDS) },
  { key: "decay", label: "Impact Decay (s)", type: "range", min: 0.2, max: 6, step: 0.05, def: 1.8 },
  { key: "attack", label: "Attack", type: "range", min: 0.005, max: 4, step: 0.005, def: 0.4 },
  { key: "release", label: "Release", type: "range", min: 0.02, max: 6, step: 0.01, def: 0.8 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

// key-tracked filter centre: TRACK blends a fixed 220 Hz reference with the played pitch; TONE moves it +-2 octaves
function centre(f0, P) {
  return clamp(Math.pow(f0, P.track) * Math.pow(220, 1 - P.track) * Math.pow(2, P.tone * 4 - 1), 40, 16000);
}
// band-passed noise loses power as Q rises / the band narrows: make up the difference so TONE and RES stay usable
const bandComp = (Q, fc) => clamp(Math.sqrt(Q) * Math.pow(1000 / fc, 0.3), 0.8, 7);

// attack / hold / exponential release on a gain param
function envelope(g, top, A, gate, R, time) {
  g.setValueAtTime(0, time);
  let lvl;
  if (gate <= A) {
    lvl = (top * gate) / A;
    g.linearRampToValueAtTime(lvl, time + gate);
  } else {
    g.linearRampToValueAtTime(top, time + A);
    lvl = top;
  }
  g.setValueAtTime(Math.max(FLOOR, lvl), time + gate);
  g.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  g.setValueAtTime(0, time + gate + R + 0.001);
}

// ---------------------------------------------------------------- CLOUD: offline grain render
const cloudCache = new Map();
let cloudCounter = 0;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function renderCloud(sr, f0, gate, A, R, P, variant, seed) {
  const grainMax = P.grain * 1.4;
  const body = gate + R * 0.6;
  const L = Math.min(8, gate + R + grainMax + 0.05);
  const n = Math.ceil(L * sr);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const rng = mulberry32(seed + variant * 7919);
  const count = Math.max(1, Math.round(P.density * body));
  const intervals = CHORDS[P.chord] || null;
  const Q = 3 + P.res * 30;
  for (let gi = 0; gi < count; gi++) {
    const t0 = ((gi + rng()) / count) * Math.min(body, L - grainMax);
    // envelope of the whole cloud at the grain's start
    let e;
    if (t0 < A) e = t0 / A;
    else if (t0 <= gate) e = 1;
    else e = Math.exp((-(t0 - gate) / Math.max(0.02, R)) * 4.6);
    if (e < 0.003) continue;
    // pitch
    let semis;
    if (intervals) {
      const oct = Math.round((rng() * 2 - 1) * P.spread * 2);
      semis = intervals[Math.floor(rng() * intervals.length)] + 12 * oct;
    } else {
      semis = (rng() * 2 - 1) * P.spread * 24;
    }
    const fr = clamp(f0 * Math.pow(2, semis / 12), 30, 7000);
    const len = Math.max(64, Math.round(P.grain * (0.6 + 0.8 * rng()) * sr));
    const amp = (0.45 + 0.55 * rng()) * e;
    const pan = (rng() * 2 - 1) * P.spread;
    const gl = Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = Math.sin(((pan + 1) * Math.PI) / 4);
    // noise component through a state-variable band-pass at (a tone-shifted) grain frequency, level-matched to a sine
    const nz = new Float32Array(len);
    if (P.tonal < 0.98) {
      const fcn = clamp(fr * Math.pow(2, P.tone * 2), 60, 6000);
      const ff = 2 * Math.sin((Math.PI * fcn) / sr);
      const qq = 1 / Q;
      let low = 0, band = 0, ss = 0;
      for (let i = 0; i < len; i++) {
        const x = rng() * 2 - 1;
        low += ff * band;
        const high = x - low - qq * band;
        band += ff * high;
        nz[i] = band;
        ss += band * band;
      }
      const k = 0.5 / Math.max(1e-6, Math.sqrt(ss / len));
      for (let i = 0; i < len; i++) nz[i] *= k;
    }
    const w = (2 * Math.PI * fr) / sr;
    const h2 = 0.3 * P.tone;
    const start = Math.round(t0 * sr);
    for (let i = 0; i < len && start + i < n; i++) {
      const win = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (len - 1));
      const p = w * i;
      const s = (Math.sin(p) + h2 * Math.sin(2 * p)) * 0.6 * P.tonal + nz[i] * (1 - P.tonal);
      const y = s * win * amp;
      left[start + i] += y * gl;
      right[start + i] += y * gr;
    }
  }
  // level-normalise (so DENSITY changes texture, not loudness) then soft-clip
  let e = 0;
  for (let i = 0; i < n; i++) e += left[i] * left[i] + right[i] * right[i];
  const rms = Math.sqrt(e / (2 * n));
  const g = rms > 1e-6 ? 0.22 / rms : 0;
  for (let i = 0; i < n; i++) {
    left[i] = Math.tanh(left[i] * g);
    right[i] = Math.tanh(right[i] * g);
  }
  return { left, right };
}

function cloudBuffer(ctx, f0, gate, A, R, P, pitch) {
  const sr = ctx.sampleRate;
  const variant = cloudCounter++ % 3;
  const key = [pitch, Math.round(gate * 20), sr, P.density, P.grain, P.spread, P.tone, P.res, P.tonal, P.chord, Math.round(A * 100), Math.round(R * 100), variant].join("|");
  let r = cloudCache.get(key);
  if (r) {
    cloudCache.delete(key);
  } else {
    r = renderCloud(sr, f0, gate, A, R, P, variant, pitch * 977 + 13);
    if (cloudCache.size >= 12) cloudCache.delete(cloudCache.keys().next().value);
  }
  cloudCache.set(key, r);
  const buf = ctx.createBuffer(2, r.left.length, sr);
  buf.copyToChannel(r.left, 0);
  buf.copyToChannel(r.right, 1);
  return buf;
}

// ---------------------------------------------------------------- voice
function textureVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const vq = Math.min(v, 1.4);
  const gate = Math.max(0.03, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);
  const model = MODELS.includes(P.model) ? P.model : "wind";
  const A = Math.min(Math.max(0.005, P.attack), Math.max(0.01, gate * 0.9));
  const R = Math.max(0.02, P.release);
  const top = Math.max(FLOOR, vq * GAIN * P.level);
  const fc = centre(f0, P);
  const Qres = 0.6 + P.res * 18;
  const tonal = P.tonal;

  const nodes = [];
  const sources = [];
  const track = (n) => {
    nodes.push(n);
    return n;
  };
  const mkGain = (val) => {
    const g = track(ctx.createGain());
    g.gain.value = val;
    return g;
  };
  const mkOsc = (type, freq) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, time);
    sources.push(o);
    track(o);
    return o;
  };
  const lfoTo = (param, freq, depth) => {
    const o = mkOsc("sine", freq);
    const g = mkGain(depth);
    o.connect(g);
    g.connect(param);
    return o;
  };

  const amp = track(ctx.createGain());
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  amp.connect(clip);
  clip.connect(dest);
  let stopAt = time + gate + R + 0.15;

  if (model === "wind") {
    envelope(amp.gain, top, A, gate, R, time);
    for (const side of [-1, 1]) {
      const nz = noiseMix(ctx, P.color, sources, track);
      const sum = track(ctx.createGain());
      const bands = [
        [fc, 1],
        [clamp(fc * 2.02, 60, 16000), 0.5],
      ];
      for (const [hz, lv] of bands) {
        const bp = track(ctx.createBiquadFilter());
        bp.type = "bandpass";
        bp.frequency.value = hz;
        bp.Q.value = Qres;
        bp.detune.value = (Math.random() * 2 - 1) * 500 * P.motion; // so notes don't all start at the same spot
        lfoTo(bp.detune, P.rate * (side < 0 ? 0.87 : 1.13), P.motion * 1500);
        const cg = mkGain(lv * bandComp(Qres, hz) * 1.6);
        nz.connect(bp);
        bp.connect(cg);
        cg.connect(sum);
      }
      if (tonal > 0.02) {
        const w = mkOsc("sine", fc);
        const wl = mkGain(tonal * 0.5);
        w.connect(wl);
        wl.connect(sum);
        lfoTo(w.detune, P.rate * 1.7, 18 * P.motion);
      }
      // gusts: slow level swell, different per side
      const gust = track(ctx.createGain());
      gust.gain.value = 1 - 0.4 * P.motion;
      lfoTo(gust.gain, P.rate * (side < 0 ? 0.41 : 0.53), 0.4 * P.motion);
      const pan = track(ctx.createStereoPanner());
      pan.pan.value = side * P.spread;
      sum.connect(gust);
      gust.connect(pan);
      pan.connect(amp);
    }
  } else if (model === "riser") {
    // amplitude climbs across the whole note, then releases
    amp.gain.setValueAtTime(0, time);
    amp.gain.linearRampToValueAtTime(top * 0.15, time + 0.01);
    amp.gain.exponentialRampToValueAtTime(top, time + gate);
    amp.gain.setValueAtTime(top, time + gate);
    amp.gain.exponentialRampToValueAtTime(FLOOR, time + gate + R);
    amp.gain.setValueAtTime(0, time + gate + R + 0.001);
    const fS = clamp(fc * Math.pow(2, -P.sweep * 0.5), 60, 16000);
    const fE = clamp(fc * Math.pow(2, P.sweep * 0.5), 60, 16000);
    const nz = noiseMix(ctx, P.color, sources, track);
    const bp = track(ctx.createBiquadFilter());
    bp.type = "bandpass";
    bp.Q.value = Qres;
    bp.frequency.setValueAtTime(fS, time);
    bp.frequency.exponentialRampToValueAtTime(fE, time + gate);
    const nl = mkGain((1 - tonal * 0.7) * bandComp(Qres, Math.sqrt(fS * fE)) * 3);
    nz.connect(bp);
    bp.connect(nl);
    // tremolo that speeds up
    const trem = track(ctx.createGain());
    trem.gain.value = 1 - 0.45 * P.motion;
    const tl = mkOsc("sine", P.rate);
    tl.frequency.exponentialRampToValueAtTime(clamp(P.rate * 10, 0.5, 40), time + gate);
    const td = mkGain(0.45 * P.motion);
    tl.connect(td);
    td.connect(trem.gain);
    nl.connect(trem);
    const pan = track(ctx.createStereoPanner());
    pan.pan.value = 0;
    trem.connect(pan);
    pan.connect(amp);
    if (tonal > 0.02) {
      const lp = track(ctx.createBiquadFilter());
      lp.type = "lowpass";
      lp.Q.value = 0.7;
      lp.frequency.setValueAtTime(clamp(fS * 2, 100, 14000), time);
      lp.frequency.exponentialRampToValueAtTime(clamp(fE * 2, 100, 14000), time + gate);
      const tg = mkGain(tonal * 0.9);
      for (const c of [-1, 1]) {
        const o = mkOsc("sawtooth", clamp(f0 * Math.pow(2, -P.sweep * 0.25), 20, 8000));
        o.frequency.exponentialRampToValueAtTime(f0, time + gate);
        o.detune.value = c * P.spread * 25;
        o.connect(lp);
      }
      lp.connect(tg);
      tg.connect(trem);
    }
  } else if (model === "drone") {
    envelope(amp.gain, top, A, gate, R, time);
    const lp = track(ctx.createBiquadFilter());
    lp.type = "lowpass";
    lp.Q.value = 0.5 + P.res * 9;
    lp.frequency.value = clamp(fc * 2.2, 80, 15000);
    lfoTo(lp.detune, P.rate, P.motion * 1800);
    lfoTo(lp.detune, P.rate * 0.37, P.motion * 900);
    const mix = track(ctx.createGain());
    const cents = [-1, -0.45, 0, 0.5, 1];
    const sawLv = (0.1 + 0.4 * tonal) * 0.6;
    for (const c of cents) {
      const o = mkOsc("sawtooth", f0);
      o.detune.value = c * P.spread * 40;
      const g = mkGain(sawLv);
      o.connect(g);
      g.connect(mix);
    }
    const sub = mkOsc("sine", f0 * 0.5);
    const sg = mkGain(0.3 * (0.3 + tonal));
    sub.connect(sg);
    sg.connect(mix);
    if (tonal < 0.95) {
      const nz = noiseMix(ctx, P.color, sources, track);
      const ng = mkGain((1 - tonal) * 0.9);
      nz.connect(ng);
      ng.connect(mix);
    }
    mix.connect(lp);
    const pan = track(ctx.createStereoPanner());
    pan.pan.value = 0;
    lp.connect(pan);
    pan.connect(amp);
  } else if (model === "cloud") {
    const buf = cloudBuffer(ctx, f0, gate, A, R, P, pitch);
    const s = ctx.createBufferSource();
    s.buffer = buf;
    sources.push(s);
    track(s);
    amp.gain.value = top * 1.2;
    s.connect(amp);
    stopAt = time + buf.duration + 0.05;
  } else {
    // IMPACT: sub boom (dropping pitch) + noise crack + rumble tail; the gate is ignored
    const D = P.decay;
    stopAt = time + D + 0.2;
    amp.gain.setValueAtTime(top * 1.1, time);
    // boom
    const boomHz = clamp(f0 * 0.5, 25, 400);
    const bo = mkOsc("sine", boomHz * Math.pow(2, P.sweep));
    bo.frequency.exponentialRampToValueAtTime(boomHz, time + 0.05 + 0.03 * P.sweep);
    const bg = track(ctx.createGain());
    bg.gain.setValueAtTime(0, time);
    bg.gain.linearRampToValueAtTime((0.35 + 0.65 * tonal) * 0.9, time + 0.004);
    bg.gain.exponentialRampToValueAtTime(FLOOR, time + D * 0.9);
    bg.gain.setValueAtTime(0, time + D * 0.9 + 0.001);
    bo.connect(bg);
    bg.connect(amp);
    // crack: noise through a low-pass that closes quickly
    const nz = noiseMix(ctx, P.color, sources, track);
    const lp = track(ctx.createBiquadFilter());
    lp.type = "lowpass";
    lp.Q.value = 0.7 + P.res * 8;
    lp.frequency.setValueAtTime(clamp(fc * 6, 200, 16000), time);
    lp.frequency.exponentialRampToValueAtTime(clamp(fc * 0.6, 40, 8000), time + D * 0.5);
    const ng = track(ctx.createGain());
    ng.gain.setValueAtTime(0, time);
    ng.gain.linearRampToValueAtTime((1.2 - tonal * 0.6) * 0.8, time + 0.002);
    ng.gain.exponentialRampToValueAtTime(FLOOR, time + D * 0.5);
    ng.gain.setValueAtTime(0, time + D * 0.5 + 0.001);
    nz.connect(lp);
    lp.connect(ng);
    // rumble tail: low brown noise, long decay
    const rn = ctx.createBufferSource();
    rn.buffer = noiseBuf(ctx, "brown");
    rn.loop = true;
    sources.push(rn);
    track(rn);
    const rl = track(ctx.createBiquadFilter());
    rl.type = "lowpass";
    rl.frequency.value = clamp(f0 * 1.5, 50, 600);
    rl.Q.value = 0.8;
    const rg = track(ctx.createGain());
    rg.gain.setValueAtTime(0, time);
    rg.gain.linearRampToValueAtTime(1.4 * (0.4 + 0.6 * P.motion), time + 0.02);
    rg.gain.exponentialRampToValueAtTime(FLOOR, time + D);
    rg.gain.setValueAtTime(0, time + D + 0.001);
    rn.connect(rl);
    rl.connect(rg);
    rg.connect(amp);
    const pan = track(ctx.createStereoPanner());
    pan.pan.value = 0;
    ng.connect(pan);
    pan.connect(amp);
  }

  for (const s of sources) {
    if (s.buffer && s.loop) s.start(time, Math.random() * 3);
    else s.start(time);
    s.stop(stopAt);
  }
  sources[0].onended = () => {
    try {
      for (const n of nodes) n.disconnect();
    } catch {
      /* already disconnected */
    }
  };
}

// JS model for the panel scope: seeded noise through the same band-pass idea, plus the tonal sine
function textureScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const f0 = 220;
  const fc = clamp(centre(f0, P), 60, 8000);
  const ff = 2 * Math.sin((Math.PI * fc) / sr);
  const qq = 1 / (0.6 + P.res * 18);
  const rng = mulberry32(99);
  let low = 0, band = 0;
  for (let i = 0; i < N; i++) {
    const x = rng() * 2 - 1;
    low += ff * band;
    const high = x - low - qq * band;
    band += ff * high;
    out[i] = band;
  }
  let pk = 1e-6;
  for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(out[i]));
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    out[i] = Math.tanh(((out[i] / pk) * (1 - P.tonal) * 0.9 + Math.sin(2 * Math.PI * f0 * t) * P.tonal * 0.8) * 1.1);
  }
  return out;
}

const svg = {
  wind: '<path d="M3 8 H14 C18 8 18 3 14.5 3 M3 13 H19 C22 13 22 18 19 18 M3 18 H10"/>',
  riser: '<path d="M2 20 C8 20 12 16 14 10 C15 7 17 5 22 4 M17 4 H22 V9"/>',
  drone: '<path d="M2 12 C5 6 8 6 12 12 C16 18 19 18 22 12 M2 7 H22 M2 17 H22"/>',
  cloud: '<circle cx="6" cy="8" r="1.4"/><circle cx="12" cy="5" r="1.4"/><circle cx="17" cy="9" r="1.4"/><circle cx="9" cy="13" r="1.4"/><circle cx="15" cy="15" r="1.4"/><circle cx="5" cy="18" r="1.4"/><circle cx="19" cy="19" r="1.4"/>',
  impact: '<path d="M12 2 L14 9 L21 7 L16 12 L22 16 L14 15 L12 22 L10 15 L2 16 L8 12 L3 7 L10 9 Z"/>',
  free: '<circle cx="5" cy="15" r="1.5"/><circle cx="11" cy="6" r="1.5"/><circle cx="14" cy="17" r="1.5"/><circle cx="20" cy="9" r="1.5"/>',
  octaves: '<circle cx="12" cy="19" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/>',
  fifths: '<circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="9" r="1.5"/><circle cx="8" cy="5" r="1.5"/>',
  major: '<circle cx="6" cy="19" r="1.5"/><circle cx="10" cy="14" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="19" cy="4" r="1.5"/>',
  minor: '<circle cx="6" cy="19" r="1.5"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="19" cy="5" r="1.5"/>',
  cluster: '<circle cx="9" cy="18" r="1.4"/><circle cx="14" cy="14" r="1.4"/><circle cx="9" cy="10" r="1.4"/><circle cx="14" cy="6" r="1.4"/><circle cx="11" cy="3" r="1.4"/>',
};

const texture = {
  name: "jiTEXTURE",
  tagline: "Weather for your tracks - wind, risers, drones, grain clouds and impacts that follow the key",
  color: "#7fb7c4",
  params: paramDefs,
  voice: textureVoice,
  scope: textureScope,
  lines: [
    { name: "Drone Chords (Am F G Em)", dsl: "0:A2:16 0:E3:16 0:A3:16 16:F2:16 16:C3:16 16:A3:16 32:G2:16 32:D3:16 32:B3:16 48:E2:16 48:B2:16 48:G#3:16" },
    { name: "Riser + Hit (A)", dsl: "0:A2:16 16:A1:6:127 32:A2:16 48:A1:6:127 56:E2:4:90" },
    { name: "Cloud Chords (Dm)", dsl: "0:D3:16 0:F3:16 0:A3:16 16:Bb2:16 16:D3:16 16:F3:16 32:C3:16 32:E3:16 32:G3:16 48:A2:16 48:E3:16 48:A3:16" },
    { name: "Gusts (C)", dsl: "0:C3:6 8:G3:8:90 20:C3:6 28:D3:10:100 44:A2:8 54:C4:10:80" },
  ],
  presets: [
    { name: "Init (Wind)", params: {} },
    { name: "Desert Wind", params: { model: "wind", tone: 0.35, res: 0.55, track: 0.5, color: 0.65, tonal: 0.05, motion: 0.75, rate: 0.35, spread: 0.85, attack: 0.9, release: 1.5 } },
    { name: "Whistling Gale", params: { model: "wind", tone: 0.55, res: 0.9, track: 1, color: 0.25, tonal: 0.4, motion: 0.55, rate: 0.8, spread: 0.7, attack: 0.5, release: 1.2 } },
    { name: "Tension Riser", params: { model: "riser", tone: 0.5, res: 0.45, track: 0.7, color: 0.25, tonal: 0.45, motion: 0.7, rate: 2, sweep: 4, spread: 0.5, release: 0.5 } },
    { name: "White Noise Sweep", params: { model: "riser", tone: 0.55, res: 0.2, track: 0.3, color: 0, tonal: 0, motion: 0.2, rate: 1, sweep: 5, spread: 0.3, release: 0.35 } },
    { name: "Dark Drone", params: { model: "drone", tone: 0.3, res: 0.3, track: 1, color: 0.8, tonal: 0.8, motion: 0.55, rate: 0.15, spread: 0.55, attack: 1.2, release: 2.2 } },
    { name: "Glass Cloud", params: { model: "cloud", tone: 0.7, res: 0.6, track: 1, tonal: 0.92, density: 55, grain: 0.12, chord: "fifths", spread: 0.5, attack: 0.5, release: 1.6 } },
    { name: "Grain Dust", params: { model: "cloud", tone: 0.55, res: 0.7, track: 0.8, tonal: 0.1, density: 90, grain: 0.03, chord: "free", spread: 0.6, attack: 0.15, release: 0.8 } },
    { name: "Sub Impact", params: { model: "impact", tone: 0.3, res: 0.2, track: 1, color: 0.9, tonal: 0.85, motion: 0.8, sweep: 2.5, decay: 3.2 } },
  ],
  ui: {
    theme: { accent: "#7fb7c4", lcd: "#d4f1f7", lcdBg: "#102228", edge: "#27444d", bg: "#0d1b20" },
    logo: ["ji", "TEXTURE"],
    sub: "WIND · RISER · DRONE · CLOUD · IMPACT",
    cc: { 74: "tone", 71: "res", 73: "attack", 72: "release", 75: "motion", 76: "rate", 77: "tonal", 78: "spread", 7: "level" },
    sections: [
      {
        title: "MODEL",
        cls: "tx-model",
        items: [
          {
            type: "radio",
            key: "model",
            cls: "wave-btns",
            options: [
              ["wind", "WIND", svg.wind, "0 0 24 24"],
              ["riser", "RISER", svg.riser, "0 0 24 24"],
              ["drone", "DRONE", svg.drone, "0 0 24 24"],
              ["cloud", "CLOUD", svg.cloud, "0 0 24 24"],
              ["impact", "IMPACT", svg.impact, "0 0 24 24"],
            ],
          },
        ],
      },
      {
        title: "FILTER · NOISE",
        cls: "tx-filter",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "tone", label: "TONE", fmt: "pct", big: true },
              { type: "knob", key: "res", label: "RES", fmt: "pct" },
              { type: "knob", key: "track", label: "KEYTRK", fmt: "pct" },
              { type: "knob", key: "color", label: "COLOUR", fmt: "pct" },
              { type: "knob", key: "tonal", label: "TONAL", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "MOTION",
        cls: "tx-motion",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "motion", label: "MOTION", fmt: "pct", big: true },
              { type: "knob", key: "rate", label: "RATE", fmt: "num2" },
              { type: "knob", key: "sweep", label: "SWEEP", fmt: "num1" },
              { type: "knob", key: "spread", label: "SPREAD", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "GRAINS · IMPACT",
        cls: "tx-grain",
        items: [
          {
            type: "radio",
            key: "chord",
            cls: "wave-btns",
            options: [
              ["free", "FREE", svg.free, "0 0 24 24"],
              ["octaves", "OCT", svg.octaves, "0 0 24 24"],
              ["fifths", "5THS", svg.fifths, "0 0 24 24"],
              ["major", "MAJ", svg.major, "0 0 24 24"],
              ["minor", "MIN", svg.minor, "0 0 24 24"],
              ["cluster", "CLUST", svg.cluster, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "density", label: "DENSITY", fmt: "int", big: true },
              { type: "knob", key: "grain", label: "GRAIN", fmt: "num2" },
              { type: "knob", key: "decay", label: "DECAY", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "ENVELOPE · OUT",
        cls: "tx-out",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATT", fmt: "ms" },
              { type: "fader", key: "release", label: "REL", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-texture" },
        ],
      },
    ],
    scopeLabel: "FILTERED NOISE · A3",
  },
};

export const TEXTURE_SYNTHS = { texture };

// synths/mallet/modal.js — Ordinal: struck bars, bells, bowls and tines (Audionaut synth module).
//
// Modal synthesis: a struck object is a handful of decaying sinusoidal modes whose frequency
// ratios, strengths and decay times are what make a marimba sound like a marimba and not a bell.
// Nine BODIES carry real mode tables (marimba 1:4:10, xylophone 1:3:6, vibes 1:4:10, glockenspiel
// free-bar ratios, kalimba cantilever tines, tubular bell, singing bowl, steel pan, wood block).
// What the player controls is the STRIKE, not a filter:
//   HARDNESS  mallet stiffness - low-passes the excitation, so soft felt = few modes, hard = bright
//             (velocity does the same: harder hits ring brighter) + the contact noise
//   STRIKE    strike position along the bar - which overtones the hit excites
//   DAMPING   material loss - higher modes die faster the more you turn it up
//   PURITY    pulls inharmonic modes toward the nearest harmonic (0 = real object, 1 = pitched/tuned)
//   BEAT      each mode is split in two slightly detuned twins (bowl shimmer, pan warble)
//   RESONATOR tube / body resonance under the bar (marimba, vibes, kalimba boxes)
// TREMOLO is the vibraphone's motor fans, phase-locked in the graph so chords share one phase.
// Every note is rendered sample-by-sample into an AudioBuffer (complex-rotation oscillators),
// LRU-cached so repeated loop notes cost nothing. Plain ES module, no imports.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TWO_PI = Math.PI * 2;

const GAIN = 0.38; // master voice scale (buffers are peak-normalised; calibrated against the harness RMS band)
const MAX_LEN = 8;
const CACHE_MAX = 64;

// body tables: base decay time constant T0 (s, of the fundamental at A4; -60 dB takes ~7x that), modes [ratio, amplitude], resonator affinity
const BODIES = {
  marimba: { T0: 0.3, res: 0.9, modes: [[1, 1], [3.99, 0.48], [9.9, 0.2], [18.4, 0.07]] },
  xylophone: { T0: 0.11, res: 0.3, modes: [[1, 1], [3, 0.58], [6, 0.3], [10, 0.13]] },
  vibes: { T0: 1.1, res: 0.6, modes: [[1, 1], [3.99, 0.42], [10, 0.15], [17.9, 0.05]] },
  glock: { T0: 0.55, res: 0, modes: [[1, 1], [2.756, 0.55], [5.404, 0.36], [8.933, 0.2], [13.34, 0.1]] },
  kalimba: { T0: 0.36, res: 0.8, modes: [[1, 1], [6.27, 0.36], [17.55, 0.1]] },
  bell: { T0: 1.4, res: 0, modes: [[1, 1], [2, 0.7], [2.4, 0.5], [3, 0.45], [4.07, 0.3], [5.4, 0.2], [6.8, 0.12]] },
  bowl: { T0: 1.6, res: 0, modes: [[1, 1], [2.71, 0.7], [5.15, 0.4], [8.4, 0.22]] },
  pan: { T0: 0.46, res: 0.4, modes: [[1, 1], [2, 0.75], [3, 0.4], [4.01, 0.22], [5, 0.1]] },
  wood: { T0: 0.035, res: 0.5, modes: [[1, 1], [2.4, 0.55], [3.9, 0.3]] },
};
const BODY_NAMES = Object.keys(BODIES);

// ---- LRU cache of rendered notes (immutable Float32Arrays; the only cross-note state)
const cache = new Map();
function cacheGet(k) {
  const v = cache.get(k);
  if (v) {
    cache.delete(k);
    cache.set(k, v);
  }
  return v;
}
function cachePut(k, v) {
  cache.set(k, v);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
}

function rng(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// one or two (beating twin) exponentially decaying sinusoids with a soft onset, added into out[]
// in a single pass; stops once it has decayed below -60 dB of full scale (ring(amp, tau)), so long
// buffers only pay for the modes still ringing. Pass a2 = 0 for a single mode.
const ring = (amp, tau) => tau * Math.log(Math.max(1, amp * 1000));
function addMode(out, sr, f, a, ph, tau, rise, f2 = f, a2 = 0, ph2 = 0, tau2 = tau) {
  const w = (TWO_PI * f) / sr, w2 = (TWO_PI * f2) / sr;
  const wr = Math.cos(w), wi = Math.sin(w), vr = Math.cos(w2), vi = Math.sin(w2);
  let cr = Math.cos(ph), ci = Math.sin(ph), dr = Math.cos(ph2), di = Math.sin(ph2);
  let e = a, e2 = a2;
  const r = Math.exp(-1 / (tau * sr)), r2 = Math.exp(-1 / (tau2 * sr));
  const end = Math.min(out.length, Math.ceil(Math.max(ring(a, tau), ring(a2, tau2)) * sr));
  const riseN = Math.min(end, Math.max(1, Math.floor(rise * sr)));
  if (!a2) {
    for (let i = 0; i < end; i++) {
      out[i] += i < riseN ? (e * ci * i) / riseN : e * ci;
      const nr = cr * wr - ci * wi;
      ci = cr * wi + ci * wr;
      cr = nr;
      e *= r;
    }
    return;
  }
  for (let i = 0; i < end; i++) {
    const v = e * ci + e2 * di;
    out[i] += i < riseN ? (v * i) / riseN : v;
    const nr = cr * wr - ci * wi;
    ci = cr * wi + ci * wr;
    cr = nr;
    e *= r;
    const mr = dr * vr - di * vi;
    di = dr * vi + di * vr;
    dr = mr;
    e2 *= r2;
  }
}

function renderModal(P, pitch, vel, gate, sr) {
  const f0 = mtof(pitch);
  const vq = clamp(vel, 0, 1.5);
  const B = BODIES[P.body] || BODIES.marimba;
  const R = Math.max(0.02, P.release);
  const rand = rng(pitch * 977 + 3);
  const ny = 0.45 * sr;

  // excitation bandwidth: stiff mallet / hard hit = high corner
  const fc = 650 * Math.pow(2, P.hardness * 5.4 + (Math.min(vq, 1.4) - 0.7) * 2.2);
  const dampExp = 0.3 + 1.2 * P.damping;
  const pitchScale = clamp(Math.pow(2, -(pitch - 69) / 34), 0.2, 3.5);
  const strike = P.strike;
  const rise = 0.0003 + (1 - P.hardness) * 0.0025; // soft mallets have a slower contact

  // build the mode list first so the buffer length can follow the longest-ringing mode
  const modes = [];
  let tEnd = 0.02; // when the last mode falls below -60 dB
  B.modes.forEach(([ratio0, a0], k) => {
    const ratio = ratio0 + (Math.max(1, Math.round(ratio0)) - ratio0) * P.purity;
    const f = f0 * ratio;
    if (f > ny || f > 16000) return;
    const w =
      k === 0 ? 1 : (0.2 + 0.8 * strike) * (0.6 + 0.4 * Math.abs(Math.cos(Math.PI * strike * k * 0.7)));
    const lowpass = 1 / Math.sqrt(1 + Math.pow(f / fc, 2));
    const amp = a0 * w * lowpass;
    if (k > 0 && amp < 0.012) return; // inaudible under the fundamental: skip (most high-pitch / soft-mallet modes)
    const tau = clamp((B.T0 * P.decay * pitchScale) / Math.pow(ratio, dampExp), 0.008, 14);
    modes.push({ f, amp, tau, k });
    tEnd = Math.max(tEnd, ring(amp, tau * (P.beat > 0.01 ? 1.08 : 1)));
  });

  const resAmp = P.resonator * B.res;
  if (resAmp > 0.001 && modes[0]) tEnd = Math.max(tEnd, ring(resAmp * 0.85, modes[0].tau * 1.6));
  const len = Math.max(64, Math.floor(sr * Math.min(MAX_LEN, gate + R * 1.15 + 0.03, tEnd + 0.05)));
  const out = new Float32Array(len);

  const split = P.beat > 0.01;
  for (const m of modes) {
    const ph = rand() * TWO_PI;
    if (split && m.amp > 0.05) {
      const d = 1 + P.beat * 0.0032 * (1 + 0.5 * m.k);
      addMode(out, sr, m.f, m.amp * 0.62, ph, m.tau, rise, m.f * d, m.amp * 0.62, ph + 1.3, m.tau * 1.08);
    } else {
      addMode(out, sr, m.f, m.amp, ph, m.tau, rise);
    }
  }
  if (resAmp > 0.001 && modes[0]) {
    addMode(out, sr, f0, resAmp * 0.85, rand() * TWO_PI, modes[0].tau * 1.6, rise * 2);
  }

  // mallet contact noise: a few ms of low-passed noise, brighter and stronger with hard mallets
  if (P.noise > 0.005) {
    const amp = P.noise * (0.12 + 0.55 * P.hardness) * (0.4 + 0.6 * Math.min(vq, 1.4));
    const lp = clamp(fc * 1.5, 300, 14000);
    const k = 1 - Math.exp((-TWO_PI * lp) / sr);
    const tauN = (0.0022 + (1 - P.hardness) * 0.006) * sr;
    const nN = Math.min(len, Math.ceil(tauN * 6));
    let y = 0;
    for (let i = 0; i < nN; i++) {
      y += k * (rand() * 2 - 1 - y);
      out[i] += amp * y * Math.exp(-i / tauN);
    }
  }

  // damper (release after the gate) + edge fades, then normalise and gently compress
  const gi = Math.min(len, Math.floor(gate * sr));
  const relR = Math.exp((-3 * Math.LN10) / (R * sr));
  const fadeAt = len - 192;
  let peak = 0;
  for (let i = 0; i < gi; i++) {
    const a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  let m = 1;
  for (let i = gi; i < len; i++) {
    m *= relR;
    out[i] *= m;
    const a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  for (let i = Math.max(0, fadeAt); i < len; i++) out[i] *= (len - i) / 192;
  if (peak > 1e-9) {
    // soft knee ~ tanh(1.5x)/tanh(1.5) as a cheap rational tanh, normalised to peak 1
    const g = 1.5 / peak;
    const nrm = 47.25 / 43.875;
    for (let i = 0; i < len; i++) {
      const x = out[i] * g;
      const x2 = x * x;
      out[i] = ((x * (27 + x2)) / (27 + 9 * x2)) * nrm;
    }
  }
  return out;
}

function keyFor(P, pitch, vel, gate, sr) {
  return [P.body, pitch, Math.round(vel * 20), Math.round(gate * 20), P.release.toFixed(2), P.hardness, P.strike, P.damping, P.decay, P.purity, P.resonator, P.beat, P.noise, sr].join("|");
}

// ---- phase-locked vibraphone tremolo
const lfoCache = new WeakMap();
function lfoBuffer(ctx) {
  let b = lfoCache.get(ctx);
  if (!b) {
    const n = Math.max(2048, Math.round(ctx.sampleRate));
    b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.sin((2 * Math.PI * i) / n);
    lfoCache.set(ctx, b);
  }
  return b;
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
  { key: "body", label: "Body", type: "select", def: "marimba", options: BODY_NAMES },
  { key: "hardness", label: "Mallet Hardness", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "strike", label: "Strike Position", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "damping", label: "Damping (material)", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "decay", label: "Ring Length", type: "range", min: 0.2, max: 3, step: 0.01, def: 1 },
  { key: "purity", label: "Purity (inharmonic -> tuned)", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "resonator", label: "Resonator", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "beat", label: "Shimmer (mode beating)", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "noise", label: "Mallet Noise", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "tremolo", label: "Tremolo (motor)", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "tremRate", label: "Tremolo Rate (Hz)", type: "range", min: 0.5, max: 9, step: 0.1, def: 5.2 },
  { key: "release", label: "Damper Release", type: "range", min: 0.03, max: 4, step: 0.01, def: 3 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

function modalVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const sr = ctx.sampleRate;
  const k = keyFor(P, pitch, v, gate, sr);
  let data = cacheGet(k);
  if (!data) {
    data = renderModal(P, pitch, v, gate, sr);
    cachePut(k, data);
  }
  const buf = ctx.createBuffer(1, data.length, sr);
  buf.copyToChannel(data, 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = GAIN * P.level * Math.pow(v, 1.15);
  src.connect(g);

  let tail = g;
  let trem = null;
  let lfo = null;
  let lfoG = null;
  const dur = buf.duration;
  if (P.tremolo > 0.01) {
    trem = ctx.createGain();
    trem.gain.value = 1 - P.tremolo * 0.5;
    lfo = ctx.createBufferSource();
    const lb = lfoBuffer(ctx);
    lfo.buffer = lb;
    lfo.loop = true;
    lfo.playbackRate.value = P.tremRate;
    lfoG = ctx.createGain();
    lfoG.gain.value = P.tremolo * 0.5;
    lfo.connect(lfoG);
    lfoG.connect(trem.gain);
    g.connect(trem);
    tail = trem;
    const cyc = (((time * P.tremRate) % 1) + 1) % 1;
    lfo.start(time, cyc * lb.duration);
    lfo.stop(time + dur + 0.05);
  }
  const clip = ctx.createWaveShaper();
  clip.curve = safetyCurve();
  tail.connect(clip);
  clip.connect(dest);
  src.start(time);
  src.stop(time + dur + 0.02);
  src.onended = () => {
    try {
      src.disconnect();
      g.disconnect();
      if (trem) trem.disconnect();
      if (lfoG) lfoG.disconnect();
      if (lfo) lfo.disconnect();
      clip.disconnect();
    } catch {
      /* already disconnected */
    }
  };
}

// scope: the real engine on a 0.4 s slice of A3 (40 kHz)
function modalScope(P) {
  const sr = 40000;
  const d = renderModal({ ...P, release: 0.1 }, 57, 1, 0.38, sr);
  const out = new Float32Array(16000);
  for (let i = 0; i < out.length; i++) out[i] = i < d.length ? d[i] * 0.8 : 0;
  return out;
}

const svg = {
  marimba: '<path d="M3 8 H21 V13 H3 Z M7 13 V19 M17 13 V19"/>',
  xylophone: '<path d="M3 10 H21 V14 H3 Z M8 14 V18 M16 14 V18"/>',
  vibes: '<path d="M3 7 H21 V11 H3 Z M12 11 V20 M8 20 H16"/>',
  glock: '<path d="M4 6 H20 V9 H4 Z M4 12 H20 V15 H4 Z M12 15 V19"/>',
  kalimba: '<path d="M4 4 V15 M8 4 V17 M12 4 V19 M16 4 V17 M20 4 V15 M3 19 H21"/>',
  bell: '<path d="M12 3 V6 M7 17 C7 9 9 6 12 6 C15 6 17 9 17 17 Z M10 20 H14"/>',
  bowl: '<path d="M3 11 H21 C21 17 16 20 12 20 C8 20 3 17 3 11 Z"/>',
  pan: '<ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="12" r="1.5"/>',
  wood: '<path d="M4 9 H20 V16 H4 Z M8 9 V16"/>',
};

// presets as data: "name|cat|body|hardness strike damping decay purity resonator beat noise tremolo tremRate release level"
const CATS = ["Marimba Perc", "Xylo & Wood Hit", "Vibes", "Bells & Glock", "Kalimba Pluck", "Steel Pan Perc", "Bowls & Drones", "FX Hit"];
const PKEYS = ["hardness", "strike", "damping", "decay", "purity", "resonator", "beat", "noise", "tremolo", "tremRate", "release", "level"];
const PRESETS = [
  "Init (Marimba)|0|marimba|.5 .4 .5 1 0 .5 0 .5 0 5.2 3 1",
  "Rosewood Marimba|0|marimba|.4 .45 .5 1.2 0 .8 0 .4 0 5.2 3 1.4",
  "Soft Felt Marimba|0|marimba|.15 .35 .6 1.1 0 .9 0 .2 0 5.2 3 .75",
  "Hard Rubber Marimba|0|marimba|.75 .5 .45 1 0 .5 0 .6 0 5.2 3 1.25",
  "Bass Marimba|0|marimba|.3 .3 .65 1.6 0 1 0 .25 0 5.2 3 1.25",
  "Dead-Stroke Marimba|0|marimba|.6 .4 .8 .4 0 .5 0 .5 0 5.2 .08 1.5",
  "Tuned Marimba|0|marimba|.45 .4 .5 1 .8 .7 0 .35 0 5.2 3 1.3",
  "Edge-Struck Marimba|0|marimba|.55 .9 .4 1 0 .6 0 .45 0 5.2 3 1.5",
  "Bright Xylophone|1|xylophone|.85 .6 .55 1 .2 .3 0 .7 0 5.2 .5 1.5",
  "Orchestral Xylo|1|xylophone|.7 .5 .5 1.3 0 .4 0 .55 0 5.2 1 1.5",
  "Soft Xylo|1|xylophone|.35 .4 .5 1.2 0 .5 0 .3 0 5.2 1 1.5",
  "Woodblock|1|wood|.7 .5 .5 1 0 .5 0 .7 0 5.2 .3 1.5",
  "Temple Block|1|wood|.5 .4 .5 2.2 .3 .9 0 .5 0 5.2 .6 1.5",
  "Log Drum|1|wood|.3 .4 .3 3 .6 1 0 .3 0 5.2 .8 1.4",
  "Claves|1|wood|.95 .6 .5 1.6 .5 .1 0 .9 0 5.2 .4 1.5",
  "Soft Vibes|2|vibes|.3 .35 .35 1.1 0 .6 .1 .35 .55 5.1 3 1",
  "Dry Vibes|2|vibes|.45 .4 .45 1 0 .6 0 .4 0 5.2 1.5 .8",
  "Fast Motor Vibes|2|vibes|.4 .4 .4 1 0 .6 .05 .35 .7 7.5 3 1.1",
  "Slow Motor Vibes|2|vibes|.25 .4 .35 1.3 0 .6 0 .25 .5 2.5 3 .9",
  "Hard Mallet Vibes|2|vibes|.8 .5 .45 1 0 .5 0 .6 .3 5.5 3 .95",
  "Long Vibes Halo|2|vibes|.1 .3 .2 2.4 0 .7 .15 .05 .35 3.5 4 .65",
  "Jazz Vibes|2|vibes|.5 .4 .5 1 0 .7 .05 .4 .4 4.5 2 .95",
  "Glockenspiel|3|glock|.8 .5 .4 1.1 0 0 .15 .45 0 5.2 2.5 1.1",
  "Tubular Bell|3|bell|.65 .4 .3 1.2 .15 0 .25 .5 0 5.2 4 1",
  "Music Box|3|glock|.9 .3 .55 .7 .4 0 0 .2 0 5.2 1.5 1.25",
  "Celesta|3|glock|.4 .35 .6 .8 .7 0 0 .25 0 5.2 1.5 1.15",
  "Church Bell|3|bell|.8 .4 .2 2.5 0 0 .4 .6 0 5.2 4 .95",
  "Handbell|3|bell|.5 .4 .45 1 .5 0 .15 .35 0 5.2 2 .95",
  "Chime Tree|3|glock|1 .6 .25 2 0 0 .6 .3 0 5.2 4 1.05",
  "Toy Glock|3|glock|1 .45 .8 .4 .2 0 0 .8 0 5.2 .6 1.5",
  "Kalimba Box|4|kalimba|.45 .3 .5 1.2 0 .85 .1 .35 0 5.2 1.5 .65",
  "Bright Kalimba|4|kalimba|.75 .4 .45 1 0 .6 0 .5 0 5.2 1.5 .8",
  "Mbira Buzz|4|kalimba|.6 .35 .45 1 0 .7 .7 .6 0 5.2 1.5 .9",
  "Soft Thumb Piano|4|kalimba|.2 .3 .55 1.4 0 .9 0 .2 0 5.2 1.5 .6",
  "Tuned Kalimba|4|kalimba|.5 .3 .5 1 .8 .8 0 .35 0 5.2 1.5 .7",
  "Tine Keys|4|kalimba|.35 .25 .4 1.8 .9 .6 0 .15 .25 4 3 .6",
  "Steel Pan|5|pan|.55 .45 .55 1 0 .4 .5 .5 0 5.2 1.5 1",
  "Tenor Pan|5|pan|.7 .55 .5 1.2 0 .4 .35 .55 0 5.2 1.5 .95",
  "Double Second Pan|5|pan|.45 .4 .45 1.4 0 .5 .65 .4 0 5.2 2 .85",
  "Muted Pan|5|pan|.5 .4 .8 .4 0 .3 .3 .6 0 5.2 .2 1.3",
  "Pan Roll|5|pan|.4 .45 .4 2 0 .4 .5 .3 .6 8 3 1",
  "Singing Bowl|6|bowl|.35 .3 .25 1.4 0 0 .75 .15 0 5.2 4 .7",
  "Deep Tibetan Bowl|6|bowl|.2 .25 .15 2.5 0 0 .9 .05 0 5.2 4 .65",
  "Crystal Bowl|6|bowl|.25 .3 .2 2.2 .85 0 .4 .05 0 5.2 4 .8",
  "Bell Drone|6|bell|.25 .35 .1 3 .3 0 .6 .05 0 5.2 4 .75",
  "Breathing Bowl|6|bowl|.3 .3 .2 2 0 0 .6 .1 .4 1.2 4 .85",
  "Metal Pipe Hit|7|bell|1 .9 .7 .5 0 0 0 1 0 5.2 1 .8",
  "Glass Tick|7|glock|1 .8 .9 .25 0 0 0 .9 0 5.2 .3 1.5",
  "Alien Bowl|7|bowl|.6 .7 .3 1.5 0 0 1 .2 .8 9 3 .75",
  "Wood Clack|7|wood|1 .7 .6 .2 0 .2 0 1 0 5.2 .1 1.5",
  "Wobble Pan|7|pan|.5 .5 .3 1.6 0 .4 1 .3 .5 6.5 3 1",
].map((row) => {
  const [name, c, body, nums] = row.split("|");
  const params = { body };
  nums.split(" ").forEach((x, i) => (params[PKEYS[i]] = +x));
  return { name, cat: CATS[+c], params };
});

const modal = {
  name: "Ordinal",
  tagline: "Modal percussion - marimba, xylophone, vibes, glockenspiel, kalimba, tubular bell, singing bowl, steel pan, wood block",
  color: "#e0c24a",
  params: paramDefs,
  live: { oneShot: true, gate: 0.6 }, // struck bars ring out over their own decay
  voice: modalVoice,
  scope: modalScope,
  lines: [
    { name: "Marimba Ostinato (Am pent)", dsl: "0:A3:2 2:C4:2 4:E4:2 6:A4:2:90 8:G4:2 10:E4:2 12:C4:2 14:E4:2:90 16:A3:2 18:C4:2 20:E4:2 22:G4:2:100 24:A4:2:120 26:G4:2 28:E4:2 30:C4:2:90 32:D4:2 34:F4:2 36:A4:2 38:C5:2:100 40:A4:2 42:F4:2 44:D4:2 46:F4:2:90 48:E4:2 50:G4:2 52:B4:2 54:E5:2:110 56:B4:2 58:G4:2 60:E4:2 62:G4:2:90" },
    { name: "Vibes Ballad (Cmaj7 Am7)", dsl: "0:C3:14 0:E4:14 0:G4:14 0:B4:14 16:A2:14 16:C4:14 16:E4:14 16:G4:14 32:F3:14 32:A3:14 32:C4:14 32:E4:14 48:G2:14 48:B3:14 48:D4:14 48:F4:14" },
    { name: "Bell Tune (Glock, C)", dsl: "0:C5:4 4:E5:4 8:G5:4 12:E5:2 14:D5:2 16:C5:4 20:G4:4 24:E5:6:110 32:F5:4 36:A5:4 40:C6:6:120 46:A5:2 48:G5:4 52:E5:4 56:D5:3 60:C5:4:80" },
    { name: "Kalimba Loop (Dm)", dsl: "0:D4:3 3:F4:3 6:A4:3 9:D5:3 12:C5:3 15:A4:3 16:E4:3 19:G4:3 22:Bb4:3 25:E5:3 28:D5:3 31:Bb4:3 32:F4:3 35:A4:3 38:C5:3 41:F5:3 44:E5:3 47:C5:3 48:D4:3 51:A4:3 54:D5:3 57:F5:3 60:D5:3" },
    { name: "Steel Pan Calypso (C F G)", dsl: "0:C5:2 2:E5:1 3:G5:2:110 6:E5:2 8:C5:1 9:D5:2 12:E5:2:90 14:G4:2 16:F4:2 18:A4:1 19:C5:2:110 22:A4:2 24:F5:2:120 26:E5:2 28:D5:2 30:C5:2 32:G4:2 34:B4:1 35:D5:2:110 38:B4:2 40:G5:2:120 42:F5:2 44:D5:2 46:B4:2 48:C5:3 51:E5:3 54:G5:2 56:C6:4:120 60:G5:2:80 62:E5:2:80" },
    { name: "Bowl Meditation (D)", dsl: "0:D3:16:110 12:A3:12:80 24:F#4:10:70 32:D4:16:100 44:E4:12:70 52:A4:12:80" },
  ],
  presets: PRESETS,
  ui: {
    theme: { accent: "#e0c24a", lcd: "#fff0b0", lcdBg: "#2a2410", edge: "#4a3f1a", bg: "#1d190c" },
    logo: ["", "Ordinal"],
    sub: "MODAL PERCUSSION",
    cc: { 74: "hardness", 71: "damping", 73: "noise", 72: "release", 75: "decay", 76: "strike", 77: "tremolo", 78: "beat", 7: "level" },
    sections: [
      {
        title: "BODY",
        cls: "md-body",
        items: [
          {
            type: "radio",
            key: "body",
            cls: "wave-btns",
            options: BODY_NAMES.map((b) => [b, b === "glock" ? "GLOCK" : b === "xylophone" ? "XYLO" : b === "kalimba" ? "KALIMBA" : b.toUpperCase(), svg[b], "0 0 24 24"]),
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "decay", label: "RING", fmt: "num2", big: true },
              { type: "knob", key: "damping", label: "DAMPING", fmt: "pct" },
              { type: "knob", key: "purity", label: "PURITY", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "STRIKE",
        cls: "md-strike",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "hardness", label: "HARDNESS", fmt: "pct", big: true },
              { type: "knob", key: "strike", label: "POSITION", fmt: "pct" },
              { type: "knob", key: "noise", label: "NOISE", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "RESONANCE",
        cls: "md-res",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "resonator", label: "RESONATOR", fmt: "pct" },
              { type: "knob", key: "beat", label: "SHIMMER", fmt: "pct" },
              { type: "knob", key: "tremolo", label: "TREMOLO", fmt: "pct" },
              { type: "knob", key: "tremRate", label: "TREM RATE", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "OUTPUT",
        cls: "md-out",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "release", label: "DAMPER", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-modal" },
        ],
      },
    ],
    scopeLabel: "WAVEFORM · A3",
  },
};

export const MODAL_SYNTHS = { modal };

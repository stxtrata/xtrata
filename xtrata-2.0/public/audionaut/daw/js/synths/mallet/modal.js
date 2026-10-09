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

// one exponentially decaying sinusoid with a soft onset, added into out[]
function addMode(out, sr, freq, amp, phase, tau, rise) {
  const n = out.length;
  const w = (TWO_PI * freq) / sr;
  const wr = Math.cos(w);
  const wi = Math.sin(w);
  let cr = Math.cos(phase);
  let ci = Math.sin(phase);
  let e = 1;
  const r = Math.exp(-1 / (tau * sr));
  const end = Math.min(n, Math.ceil(tau * 11.5 * sr)); // stop below -100 dB
  const riseN = Math.max(1, Math.floor(rise * sr));
  for (let i = 0; i < end; i++) {
    const ramp = i < riseN ? i / riseN : 1;
    out[i] += amp * e * ramp * ci;
    const nr = cr * wr - ci * wi;
    ci = cr * wi + ci * wr;
    cr = nr;
    e *= r;
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
  let tauMax = 0.02;
  B.modes.forEach(([ratio0, a0], k) => {
    const ratio = ratio0 + (Math.max(1, Math.round(ratio0)) - ratio0) * P.purity;
    const f = f0 * ratio;
    if (f > ny || f > 19000) return;
    const w =
      k === 0 ? 1 : (0.2 + 0.8 * strike) * (0.6 + 0.4 * Math.abs(Math.cos(Math.PI * strike * k * 0.7)));
    const lowpass = 1 / Math.sqrt(1 + Math.pow(f / fc, 2));
    const amp = a0 * w * lowpass;
    const tau = clamp((B.T0 * P.decay * pitchScale) / Math.pow(ratio, dampExp), 0.008, 14);
    modes.push({ f, amp, tau, k });
    tauMax = Math.max(tauMax, tau);
  });

  const resAmp = P.resonator * B.res;
  if (resAmp > 0.001) tauMax = Math.max(tauMax, (modes[0] ? modes[0].tau : 0.2) * 1.6);
  const len = Math.max(64, Math.floor(sr * Math.min(MAX_LEN, gate + R * 1.15 + 0.03, tauMax * 9.5 + 0.05)));
  const out = new Float32Array(len);

  const split = P.beat > 0.01;
  for (const m of modes) {
    const ph = rand() * TWO_PI;
    if (split) {
      const d = 1 + P.beat * 0.0032 * (1 + 0.5 * m.k);
      addMode(out, sr, m.f, m.amp * 0.62, ph, m.tau, rise);
      addMode(out, sr, m.f * d, m.amp * 0.62, ph + 1.3, m.tau * 1.08, rise);
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
  const gi = Math.floor(gate * sr);
  const relK = (3 * Math.LN10) / (R * sr);
  let peak = 0;
  for (let i = 0; i < len; i++) {
    let m = 1;
    if (i > gi) m = Math.exp(-(i - gi) * relK);
    const tail = len - i;
    if (tail < 192) m *= tail / 192;
    out[i] *= m;
    const a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  if (peak > 1e-9) {
    const c = 1.5;
    const g = 1 / peak;
    const nrm = 1 / Math.tanh(c);
    for (let i = 0; i < len; i++) out[i] = Math.tanh(out[i] * g * c) * nrm;
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

const modal = {
  name: "Ordinal",
  tagline: "Modal percussion - marimba, xylophone, vibes, glockenspiel, kalimba, tubular bell, singing bowl, steel pan, wood block",
  color: "#e0c24a",
  params: paramDefs,
  voice: modalVoice,
  scope: modalScope,
  lines: [
    { name: "Marimba Ostinato (Am pent)", dsl: "0:A3:2 2:C4:2 4:E4:2 6:A4:2:90 8:G4:2 10:E4:2 12:C4:2 14:E4:2:90 16:A3:2 18:C4:2 20:E4:2 22:G4:2:100 24:A4:2:120 26:G4:2 28:E4:2 30:C4:2:90 32:D4:2 34:F4:2 36:A4:2 38:C5:2:100 40:A4:2 42:F4:2 44:D4:2 46:F4:2:90 48:E4:2 50:G4:2 52:B4:2 54:E5:2:110 56:B4:2 58:G4:2 60:E4:2 62:G4:2:90" },
    { name: "Vibes Ballad (Cmaj7 Am7)", dsl: "0:C3:14 0:E4:14 0:G4:14 0:B4:14 16:A2:14 16:C4:14 16:E4:14 16:G4:14 32:F3:14 32:A3:14 32:C4:14 32:E4:14 48:G2:14 48:B3:14 48:D4:14 48:F4:14" },
    { name: "Bell Tune (Glock, C)", dsl: "0:C5:4 4:E5:4 8:G5:4 12:E5:2 14:D5:2 16:C5:4 20:G4:4 24:E5:6:110 32:F5:4 36:A5:4 40:C6:6:120 46:A5:2 48:G5:4 52:E5:4 56:D5:3 60:C5:4:80" },
    { name: "Kalimba Loop (Dm)", dsl: "0:D4:3 3:F4:3 6:A4:3 9:D5:3 12:C5:3 15:A4:3 16:E4:3 19:G4:3 22:Bb4:3 25:E5:3 28:D5:3 31:Bb4:3 32:F4:3 35:A4:3 38:C5:3 41:F5:3 44:E5:3 47:C5:3 48:D4:3 51:A4:3 54:D5:3 57:F5:3 60:D5:3" },
  ],
  presets: [
    { name: "Init (Marimba)", params: {} },
    { name: "Soft Vibes", params: { body: "vibes", hardness: 0.3, strike: 0.35, damping: 0.35, decay: 1.1, purity: 0, resonator: 0.6, beat: 0.1, noise: 0.35, tremolo: 0.55, tremRate: 5.1, release: 3 } },
    { name: "Bright Xylophone", params: { body: "xylophone", hardness: 0.85, strike: 0.6, damping: 0.55, decay: 1, purity: 0.2, resonator: 0.3, noise: 0.7, release: 0.5 } },
    { name: "Glockenspiel", params: { body: "glock", hardness: 0.8, strike: 0.5, damping: 0.4, decay: 1.1, resonator: 0, beat: 0.15, noise: 0.45, release: 2.5 } },
    { name: "Kalimba Box", params: { body: "kalimba", hardness: 0.45, strike: 0.3, damping: 0.5, decay: 1.2, resonator: 0.85, beat: 0.1, noise: 0.35, release: 1.5 } },
    { name: "Tubular Bell", params: { body: "bell", hardness: 0.65, strike: 0.5, damping: 0.3, decay: 1.2, purity: 0.15, resonator: 0, beat: 0.25, noise: 0.5, release: 4 } },
    { name: "Singing Bowl", params: { body: "bowl", hardness: 0.35, strike: 0.3, damping: 0.25, decay: 1.4, resonator: 0, beat: 0.75, noise: 0.15, release: 4 } },
    { name: "Steel Pan", params: { body: "pan", hardness: 0.55, strike: 0.45, damping: 0.55, decay: 1, resonator: 0.4, beat: 0.5, noise: 0.5, release: 1.5 } },
  ],
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

// synths/keys/tine.js — Privkey: electric & acoustic keys (Audionaut synth module).
//
// Four keyboard models in one instrument, all rendered per note into an AudioBuffer
// (sample-by-sample JS DSP, LRU-cached so repeated loop notes cost nothing):
//   TINE   Rhodes-style electric piano: self-modulated FM "tine" (bark rises with touch), a fast
//          high "ping" at the strike, then a pure ringing tone; pickup asymmetry adds the growl.
//   REED   Wurlitzer-style reed piano: harmonic reed spectrum, nasal 2nd, hard pickup bark.
//   PIANO  Acoustic piano: inharmonic stretched partials (B grows up the keyboard), hammer-position
//          comb, two-stage decay (prompt sound + aftersound), 2-string beating, hammer thump.
//   CLAV   Clavinet: plucked-string harmonics shaped by a pickup-position comb, fast decay, felt-damped.
// TOUCH makes velocity change timbre as well as level (hard = brighter / more bark / more thump).
// A phase-locked TREMOLO (suitcase vibrato) is applied in the node graph, so every note of a chord
// shares one tremolo phase. Plain ES module, no imports. One AudioBufferSource per note.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TWO_PI = Math.PI * 2;

const GAIN = 0.34; // master voice scale (buffers are peak-normalised; calibrated against the harness RMS band)
const MAX_LEN = 7.0; // longest rendered note (s)
const CACHE_MAX = 64;

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

// one decaying sinusoid, added into out[]: amplitude a * (w1*exp(-t/t1) + w2*exp(-t/t2)), complex rotation
function addPartial(out, sr, freq, a, phase, t1, w1, t2, w2) {
  const n = out.length;
  const w = (TWO_PI * freq) / sr;
  const wr = Math.cos(w);
  const wi = Math.sin(w);
  let cr = Math.cos(phase);
  let ci = Math.sin(phase);
  let e1 = w1;
  let e2 = w2;
  const r1 = Math.exp(-1 / (t1 * sr));
  const r2 = t2 > 0 ? Math.exp(-1 / (t2 * sr)) : 0;
  const tMax = Math.max(t1, t2 > 0 && w2 > 0 ? t2 : 0);
  const end = Math.min(n, Math.ceil(tMax * 11.5 * sr)); // stop below -100 dB
  for (let i = 0; i < end; i++) {
    out[i] += a * (e1 + e2) * ci;
    const nr = cr * wr - ci * wi;
    ci = cr * wi + ci * wr;
    cr = nr;
    e1 *= r1;
    e2 *= r2;
  }
}

// short filtered noise burst (hammer thump / pluck click)
function addBurst(out, sr, amp, ms, lpHz, rand) {
  const n = Math.min(out.length, Math.ceil((ms / 1000) * sr * 5));
  const k = 1 - Math.exp((-TWO_PI * lpHz) / sr);
  const tau = (ms / 1000) * sr;
  let y = 0;
  for (let i = 0; i < n; i++) {
    y += k * ((rand() * 2 - 1) - y);
    out[i] += amp * y * Math.exp(-i / tau);
  }
}

// pickup asymmetry: y + k*y^2, DC removed (one-pole blocker)
function pickup(out, k) {
  if (k <= 0.001) return;
  let xp = 0;
  let yp = 0;
  for (let i = 0; i < out.length; i++) {
    const x = out[i];
    const s = x + k * x * x;
    const y = s - xp + 0.995 * yp;
    xp = s;
    yp = y;
    out[i] = y;
  }
}

const MODELS = ["tine", "reed", "piano", "clav"];

// returns a peak-normalised Float32Array for one note (damper release and edge fades included)
function renderKey(P, pitch, vel, gate, sr) {
  const f0 = mtof(pitch);
  const vq = clamp(vel, 0, 1.5);
  const R = Math.max(0.02, P.release);
  const len = Math.max(64, Math.floor(sr * Math.min(MAX_LEN, gate + R * 1.15 + 0.02)));
  const out = new Float32Array(len);
  const rand = rng(pitch * 131 + 7);
  // touch: velocity colours the timbre (0.7 is the neutral velocity)
  const bright = clamp(P.brightness + (Math.min(vq, 1.4) - 0.7) * P.touch * 0.9, 0, 1);
  const pitchDecay = (ref, k) => Math.pow(2, -(pitch - ref) / k); // high notes die faster, low ones ring
  const ny = 0.45 * sr;

  if (P.model === "tine") {
    const tauA = clamp(2.6 * P.decay * pitchDecay(60, 24), 0.25, 12);
    const tauI = clamp(0.32 * P.decay * pitchDecay(60, 30), 0.05, 3);
    const idx0 = (0.12 + (0.35 + 2.4 * P.bark) * (0.25 + 0.95 * bright)) * (0.55 + 0.45 * Math.min(vq, 1.4));
    const pingAmp = P.ping * (0.15 + 0.5 * bright) * (0.4 + 0.6 * Math.min(vq, 1.4));
    const tauP = 0.045;
    const w = (TWO_PI * f0) / sr;
    const ratio = 14;
    const pingOk = f0 * (ratio + 1) < ny; // keep the 15th sideband below Nyquist
    let ph = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const idx = idx0 * (Math.exp(-t / tauI) * 0.88 + 0.12);
      const sn = Math.sin(ph);
      let y = Math.exp(-t / tauA) * Math.sin(ph + idx * sn);
      y += 0.18 * Math.exp(-t / (tauA * 1.4)) * Math.sin(2 * ph + 0.6 * idx * sn); // tonebar warmth
      if (pingOk && pingAmp > 0.001) y += pingAmp * Math.exp(-t / tauP) * Math.sin(ph + 1.4 * Math.sin(ratio * ph));
      out[i] = y;
      ph += w;
    }
    pickup(out, 0.35 * P.bark * (0.4 + 0.6 * Math.min(vq, 1.4)));
  } else if (P.model === "reed") {
    const tau1 = clamp(1.7 * P.decay * pitchDecay(60, 22), 0.2, 8);
    const s = 1.5 - 1.0 * bright;
    const N = Math.max(1, Math.min(16, Math.floor(Math.min(ny, 3500 + 9000 * bright) / f0)));
    for (let n = 1; n <= N; n++) {
      let a = Math.pow(n, -s);
      if (n === 2) a *= 1.35;
      if (n === 4) a *= 0.55;
      const comb = 0.3 + 0.7 * Math.abs(Math.sin(n * Math.PI * (0.18 + 0.5 * P.pickup)));
      a *= comb;
      const tau = tau1 / (1 + 0.55 * (n - 1));
      addPartial(out, sr, f0 * n, a, rand() * TWO_PI, tau, 1, 0, 0);
    }
    addBurst(out, sr, 0.22 * P.hammer, 3, f0 * 6, rand);
    pickup(out, 0.15 + 0.9 * P.bark);
  } else if (P.model === "clav") {
    const tau1 = clamp(0.95 * P.decay * pitchDecay(60, 26), 0.1, 5);
    const s = 1.1 - 0.7 * bright;
    const pos = clamp(P.pickup, 0.06, 0.5);
    const N = Math.max(1, Math.min(28, Math.floor(Math.min(ny, 4500 + 12000 * bright) / f0)));
    for (let n = 1; n <= N; n++) {
      const comb = Math.max(0.04, Math.abs(Math.sin(n * Math.PI * pos)));
      const a = Math.pow(n, -s) * comb;
      const tau = tau1 / Math.pow(n, 0.8);
      addPartial(out, sr, f0 * n, a, rand() * TWO_PI, tau, 1, 0, 0);
    }
    addBurst(out, sr, 0.5 * P.hammer, 2.5, Math.min(ny, f0 * 10), rand);
    pickup(out, 0.1 + 0.4 * P.bark);
  } else {
    // PIANO: inharmonic stretched partials, hammer comb, two-stage decay, 2-string beating
    const B = 0.00018 * Math.pow(2, (pitch - 60) / 13) * (0.15 + 2.2 * P.stretch);
    const s = 1.95 - 1.55 * bright;
    const maxF = Math.min(ny, 2200 + 12500 * bright);
    const tau1 = clamp(4.4 * P.decay * pitchDecay(48, 19), 0.35, 14);
    const x0 = 0.115; // strike point along the string
    for (let n = 1; n <= 24; n++) {
      const fn = n * f0 * Math.sqrt(1 + B * n * n);
      if (fn > maxF) break;
      const a = Math.pow(n, -s) * (0.22 + 0.78 * Math.abs(Math.sin(n * Math.PI * x0)));
      const tauA = tau1 / (1 + 0.22 * Math.pow(n - 1, 1.25));
      const ph = rand() * TWO_PI;
      const strings = n <= 6 && P.beat > 0.01 ? 2 : 1;
      const share = strings === 2 ? 0.62 : 1;
      if (n <= 10) {
        addPartial(out, sr, fn, a * share, ph, tauA * 0.2, 0.55, tauA, 0.45);
      } else {
        addPartial(out, sr, fn, a * share, ph, tauA * 0.4, 1, 0, 0);
      }
      if (strings === 2) {
        const cents = P.beat * (1.2 + 0.5 * n);
        addPartial(out, sr, fn * Math.pow(2, cents / 1200), a * share * 0.9, ph + 1.1, tauA * 0.2, 0.55, tauA * 1.15, 0.45);
      }
    }
    addBurst(out, sr, 0.3 * P.hammer * (0.3 + 0.7 * Math.min(vq, 1.4)), 6, f0 * 3.5 + 200, rand);
  }

  // damper (key release) + edge fades, then peak-normalise
  const gi = Math.floor(gate * sr);
  const relK = (3 * Math.LN10) / (R * sr); // -60 dB over R
  let peak = 0;
  for (let i = 0; i < len; i++) {
    let m = 1;
    if (i > gi) m = Math.exp(-(i - gi) * relK);
    if (i < 48) m *= i / 48;
    const tail = len - i;
    if (tail < 144) m *= tail / 144;
    out[i] *= m;
    const a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  if (peak > 1e-9) {
    // normalise, then a gentle tanh compressor (strike transients are tamed, the body comes up)
    const c = { tine: 1.3, reed: 2.4, piano: 1.9, clav: 3.2 }[P.model] || 1.5;
    const g = 1 / peak;
    const nrm = 1 / Math.tanh(c);
    for (let i = 0; i < len; i++) out[i] = Math.tanh(out[i] * g * c) * nrm;
  }
  return out;
}

// cache key: only the params that shape the rendered buffer (not level / tremolo)
function keyFor(P, pitch, vel, gate, sr) {
  return [P.model, pitch, Math.round(vel * 20), Math.round(gate * 20), P.release.toFixed(2), P.brightness, P.touch, P.decay, P.stretch, P.bark, P.ping, P.hammer, P.pickup, P.beat, sr].join("|");
}

// ---- phase-locked tremolo LFO (one sine cycle in one second, looped)
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
  { key: "model", label: "Model", type: "select", def: "tine", options: MODELS },
  { key: "brightness", label: "Brightness", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "touch", label: "Touch (velocity -> timbre)", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "decay", label: "Sustain Length", type: "range", min: 0.2, max: 2.5, step: 0.01, def: 1 },
  { key: "release", label: "Release (damper)", type: "range", min: 0.03, max: 2.5, step: 0.01, def: 0.35 },
  { key: "bark", label: "Bark / Pickup Growl", type: "range", min: 0, max: 1, step: 0.01, def: 0.45 },
  { key: "ping", label: "Tine Ping", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "hammer", label: "Hammer / Click", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "pickup", label: "Pickup Position", type: "range", min: 0.06, max: 0.5, step: 0.01, def: 0.2 },
  { key: "stretch", label: "Stretch (piano inharmonicity)", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "beat", label: "String Beat (piano)", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "tremolo", label: "Tremolo Depth", type: "range", min: 0, max: 1, step: 0.01, def: 0 },
  { key: "tremRate", label: "Tremolo Rate (Hz)", type: "range", min: 0.5, max: 9, step: 0.1, def: 4.8 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

function tineVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const sr = ctx.sampleRate;
  const k = keyFor(P, pitch, v, gate, sr);
  let data = cacheGet(k);
  if (!data) {
    data = renderKey(P, pitch, v, gate, sr);
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
  let lfo = null;
  let lfoG = null;
  let trem = null;
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

// scope: the real engine on a short 0.4 s slice of A3 (40 kHz), cheap because it is short
function tineScope(P) {
  const sr = 40000;
  const d = renderKey({ ...P, release: 0.1 }, 57, 1, 0.38, sr);
  const out = new Float32Array(16000);
  for (let i = 0; i < out.length; i++) out[i] = i < d.length ? d[i] * 0.8 : 0;
  return out;
}

const svg = {
  tine: '<path d="M12 3 V16 M9 16 H15 M12 16 V21 M6 8 C9 6 15 6 18 8"/>',
  reed: '<path d="M3 17 H21 M4 17 C6 8 12 5 20 6 M8 17 V12 M12 17 V9"/>',
  piano: '<path d="M3 6 H21 V18 H3 Z M8 6 V18 M13 6 V18 M18 6 V18 M6 6 V12 M11 6 V12 M16 6 V12"/>',
  clav: '<path d="M3 8 H21 M3 12 H21 M3 16 H21 M7 5 V19 M17 5 V19"/>',
};

const tine = {
  name: "Privkey",
  tagline: "Electric & acoustic keys - Rhodes tine, Wurli reed, piano and clav models with touch-sensitive timbre",
  color: "#f5a65b",
  params: paramDefs,
  voice: tineVoice,
  scope: tineScope,
  lines: [
    { name: "Rhodes Chords (Fmaj7 Em7)", dsl: "0:F3:12 0:A3:12 0:C4:12 0:E4:12 16:E3:14 16:G3:14 16:B3:14 16:D4:14 32:D3:12 32:F3:12 32:A3:12 32:C4:12 48:G3:8 48:B3:8 48:D4:8 48:F4:8 56:C4:6:80 58:E4:6:80 60:G4:4:80" },
    { name: "Soul Comping (Dm9)", dsl: "0:D3:3 0:F3:3 0:A3:3 0:C4:3 4:D3:2:80 4:F3:2:80 4:A3:2:80 4:C4:2:80 7:E4:1:110 8:D3:3 8:F3:3 8:A3:3 8:C4:3 14:F4:1:127 15:E4:1:90 16:G3:3 16:Bb3:3 16:D4:3 16:F4:3 20:G3:2:80 20:Bb3:2:80 20:D4:2:80 20:F4:2:80 24:A3:3 24:C4:3 24:E4:3 24:G4:3 30:A4:1:127 31:G4:1:90" },
    { name: "Ballad Arpeggio (C)", dsl: "0:C3:6 2:G3:6 4:C4:6 6:E4:6 8:G4:8 16:A2:6 18:E3:6 20:A3:6 22:C4:6 24:E4:8 32:F2:6 34:C3:6 36:F3:6 38:A3:6 40:C4:8 48:G2:6 50:D3:6 52:G3:6 54:B3:6 56:D4:8" },
    { name: "Clav Riff (Em)", dsl: "0:E3:1 2:E3:1:80 3:G3:1 4:E3:1:127 6:A3:1:80 7:B3:1 8:E3:1:127 10:E3:1:80 11:D4:1 12:B3:1:127 14:G3:1:80 16:E3:1 18:E3:1:80 19:G3:1 20:E3:1:127 22:A3:1:80 23:B3:1 24:E4:1:127 26:D4:1:80 27:B3:1 28:A3:1:127 30:G3:1:80" },
  ],
  presets: [
    { name: "Init (Suitcase Tine)", params: {} },
    { name: "Mellow Rhodes", params: { model: "tine", brightness: 0.28, touch: 0.5, decay: 1.3, release: 0.45, bark: 0.2, ping: 0.35, tremolo: 0.25, tremRate: 4.2 } },
    { name: "Barking Rhodes", params: { model: "tine", brightness: 0.7, touch: 0.9, decay: 1, release: 0.3, bark: 0.95, ping: 0.7 } },
    { name: "Wurli 200", params: { model: "reed", brightness: 0.5, touch: 0.7, decay: 0.9, release: 0.25, bark: 0.6, hammer: 0.5, pickup: 0.28, tremolo: 0.5, tremRate: 5.6 } },
    { name: "Upright Piano", params: { model: "piano", brightness: 0.35, touch: 0.6, decay: 0.9, release: 0.3, hammer: 0.55, stretch: 0.7, beat: 0.5 } },
    { name: "Bright Grand", params: { model: "piano", brightness: 0.72, touch: 0.85, decay: 1.3, release: 0.5, hammer: 0.35, stretch: 0.45, beat: 0.35 } },
    { name: "Clav Funk", params: { model: "clav", brightness: 0.65, touch: 0.8, decay: 0.8, release: 0.08, bark: 0.5, hammer: 0.7, pickup: 0.14 } },
    { name: "Muted Clav", params: { model: "clav", brightness: 0.3, touch: 0.4, decay: 0.45, release: 0.05, bark: 0.2, hammer: 0.4, pickup: 0.42 } },
  ],
  ui: {
    theme: { accent: "#f5a65b", lcd: "#ffe0b8", lcdBg: "#2a1c0f", edge: "#4d3620", bg: "#1f1710" },
    logo: ["", "Privkey"],
    sub: "ELECTRIC & ACOUSTIC KEYS",
    cc: { 74: "brightness", 71: "bark", 73: "hammer", 72: "release", 75: "decay", 76: "touch", 77: "tremolo", 78: "ping", 7: "level" },
    sections: [
      {
        title: "MODEL",
        cls: "tn-model",
        items: [
          {
            type: "radio",
            key: "model",
            cls: "wave-btns",
            options: [
              ["tine", "TINE", svg.tine, "0 0 24 24"],
              ["reed", "REED", svg.reed, "0 0 24 24"],
              ["piano", "PIANO", svg.piano, "0 0 24 24"],
              ["clav", "CLAV", svg.clav, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "brightness", label: "BRIGHT", fmt: "pct", big: true },
              { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" },
              { type: "knob", key: "decay", label: "SUSTAIN", fmt: "num2" },
            ],
          },
        ],
      },
      {
        title: "CHARACTER",
        cls: "tn-char",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "bark", label: "BARK", fmt: "pct" },
              { type: "knob", key: "ping", label: "PING", fmt: "pct" },
              { type: "knob", key: "hammer", label: "HAMMER", fmt: "pct" },
              { type: "knob", key: "pickup", label: "PICKUP", fmt: "num2" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "stretch", label: "STRETCH", fmt: "pct" },
              { type: "knob", key: "beat", label: "BEAT", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "TREMOLO",
        cls: "tn-trem",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "tremolo", label: "DEPTH", fmt: "pct", big: true },
              { type: "knob", key: "tremRate", label: "RATE", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "RELEASE",
        cls: "tn-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "release", label: "DAMPER", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-tine" },
        ],
      },
    ],
    scopeLabel: "WAVEFORM · A3",
  },
};

export const TINE_SYNTHS = { tine };

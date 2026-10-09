// synths/reed/winds.js — Muneeb: brass, flute, reed and bowed strings (Audionaut synth module).
//
// One breath-and-bow instrument with four models, all per-note node graphs:
//   BRASS   detuned sawtooth pair through a resonant low-pass that BLOOMS open as the "lips" speak,
//           an accent blat at the start that settles, chest/bell resonances, pitch SCOOP into the note
//   FLUTE   near-sine tone (PeriodicWave with a little 2nd/3rd), a band of BREATH noise that follows
//           the pitch, and a short chiff at the attack
//   REED    clarinet <-> oboe: NASAL morphs a hollow odd-harmonic wave into a rich all-harmonic one and
//           brings in the nasal formant
//   BOWED   sawtooth pair with violin/cello body resonances, bow-scrape noise (strong at the attack,
//           lighter while sustaining), slow-ish bow attack
// All four share a DELAYED VIBRATO (it fades in after the note starts, like a player's), an ATTACK that
// can be long enough to feel played, and a release. DETUNE turns a solo into a section.
// Plain ES module, no imports. ~15-20 nodes per note, self-cleaning.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001;
const GAIN = 0.2; // master voice scale (calibrated against the harness RMS band)

const MODELS = ["brass", "flute", "reed", "bowed"];
// body resonances per model: [Hz, Q, max dB at BODY = 1]
const BODY = {
  brass: [[850, 1.1, 7], [2300, 1.4, 5]],
  flute: [[1800, 0.8, 2], [4200, 1.2, 2]],
  reed: [[1250, 1.3, 7], [3100, 1.5, 4]],
  bowed: [[450, 1.4, 7], [1150, 1.6, 6], [2800, 1.8, 4]],
};

// ---- noise (one second, shared per context) and PeriodicWave cache
const noiseCache = new WeakMap();
function noiseBuf(ctx) {
  let b = noiseCache.get(ctx);
  if (!b) {
    const n = Math.round(ctx.sampleRate);
    b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    let s = 424242;
    for (let i = 0; i < n; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      d[i] = (s / 4294967296) * 2 - 1;
    }
    noiseCache.set(ctx, b);
  }
  return b;
}

// harmonic amplitudes for the PeriodicWave models (index = harmonic number)
function fluteHarm() {
  return [0, 1, 0.22, 0.07, 0.03, 0.012];
}
function reedHarm(nasal) {
  const N = 24;
  const a = [0];
  for (let n = 1; n <= N; n++) {
    const clar = n % 2 === 1 ? 1 / Math.pow(n, 0.85) : 0.04 / n; // hollow: odd harmonics only
    const oboe = 1 / Math.pow(n, 0.75) * (n <= 3 ? 1 : 0.9); // rich: all harmonics
    a.push(clar * (1 - nasal) + oboe * nasal);
  }
  return a;
}
const waveCache = new WeakMap();
function periodic(ctx, key, harm) {
  let m = waveCache.get(ctx);
  if (!m) {
    m = new Map();
    waveCache.set(ctx, m);
  }
  let w = m.get(key);
  if (!w) {
    const re = new Float32Array(harm.length);
    const im = Float32Array.from(harm);
    w = ctx.createPeriodicWave(re, im, { disableNormalization: false });
    if (m.size > 32) m.clear();
    m.set(key, w);
  }
  return w;
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
  { key: "model", label: "Model", type: "select", def: "brass", options: MODELS },
  { key: "brightness", label: "Brightness", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "swell", label: "Bloom (filter swell)", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "accent", label: "Attack Accent", type: "range", min: 0, max: 1, step: 0.01, def: 0.35 },
  { key: "attack", label: "Attack", type: "range", min: 0.005, max: 1.5, step: 0.005, def: 0.07 },
  { key: "release", label: "Release", type: "range", min: 0.02, max: 2.5, step: 0.01, def: 0.18 },
  { key: "breath", label: "Breath / Bow Noise", type: "range", min: 0, max: 1, step: 0.01, def: 0.25 },
  { key: "nasal", label: "Nasal (clarinet -> oboe)", type: "range", min: 0, max: 1, step: 0.01, def: 0.3 },
  { key: "body", label: "Body Resonance", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "detune", label: "Section Detune (cents)", type: "range", min: 0, max: 30, step: 0.5, def: 7 },
  { key: "scoop", label: "Pitch Scoop (st)", type: "range", min: 0, max: 2, step: 0.05, def: 0.3 },
  { key: "vibrato", label: "Vibrato (cents)", type: "range", min: 0, max: 60, step: 0.5, def: 10 },
  { key: "vibRate", label: "Vibrato Rate (Hz)", type: "range", min: 2, max: 8, step: 0.1, def: 5.2 },
  { key: "vibDelay", label: "Vibrato Delay (s)", type: "range", min: 0, max: 1.5, step: 0.01, def: 0.25 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

function windsVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const vq = Math.min(v, 1.4);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);
  const model = MODELS.includes(P.model) ? P.model : "brass";
  const A = gate < 0.2 ? Math.min(Math.max(0.005, P.attack), gate * 0.7) : Math.max(0.005, P.attack);
  const R = Math.max(0.02, P.release);
  const stopAt = time + gate + R + 0.1;

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

  // ---------- amp envelope: attack (overshoots by ACCENT, settles), hold, release
  const amp = track(ctx.createGain());
  const top = Math.max(FLOOR, v * GAIN * P.level);
  const over = 1 + 0.55 * P.accent;
  const settle = Math.min(gate, A + 0.14);
  amp.gain.setValueAtTime(0, time);
  if (gate <= A) {
    amp.gain.linearRampToValueAtTime(top * over * (gate / A), time + gate);
  } else {
    amp.gain.linearRampToValueAtTime(top * over, time + A);
    amp.gain.linearRampToValueAtTime(top, time + settle + 0.001);
  }
  const lvlGate = gate <= A ? top * over * (gate / A) : top;
  amp.gain.setValueAtTime(Math.max(FLOOR, lvlGate), time + gate);
  amp.gain.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  amp.gain.setValueAtTime(0, time + gate + R + 0.001);

  // ---------- tone sources
  const mix = track(ctx.createGain());
  const pitchParams = []; // detune AudioParams the scoop and vibrato drive
  const mkOsc = (typeOrWave, cents, level) => {
    const o = ctx.createOscillator();
    if (typeof typeOrWave === "string") o.type = typeOrWave;
    else o.setPeriodicWave(typeOrWave);
    o.frequency.setValueAtTime(f0, time);
    o.detune.setValueAtTime(cents, time);
    const g = mkGain(level);
    o.connect(g);
    g.connect(mix);
    sources.push(o);
    track(o);
    pitchParams.push(o.detune);
    return o;
  };

  const sec = P.detune;
  if (model === "brass") {
    mkOsc("sawtooth", -sec * 0.5, 0.55);
    mkOsc("sawtooth", sec * 0.5, 0.55);
  } else if (model === "flute") {
    const w = periodic(ctx, "flute", fluteHarm());
    mkOsc(w, -sec * 0.25, 0.85);
    if (sec > 0.5) mkOsc(w, sec * 0.25, 0.45);
  } else if (model === "reed") {
    const nb = Math.round(P.nasal * 10);
    const w = periodic(ctx, "reed" + nb, reedHarm(nb / 10));
    mkOsc(w, -sec * 0.4, 0.75);
    if (sec > 0.5) mkOsc(w, sec * 0.4, 0.45);
  } else {
    mkOsc("sawtooth", -sec * 0.5, 0.5);
    mkOsc("sawtooth", sec * 0.5, 0.5);
    mkOsc("sawtooth", sec * 1.4, 0.18);
  }

  // scoop: start flat, glide up into the pitch
  if (P.scoop > 0.02) {
    const sc = -P.scoop * 100;
    for (const d of pitchParams) {
      const base = d.value;
      d.cancelScheduledValues(time);
      d.setValueAtTime(base + sc, time);
      d.linearRampToValueAtTime(base, time + 0.07 + 0.02 * P.scoop);
    }
  }

  // delayed vibrato (depth fades in after VIB DELAY)
  const vib = P.vibrato;
  if (vib > 0.05) {
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(P.vibRate, time);
    const vg = track(ctx.createGain());
    vg.gain.setValueAtTime(0, time);
    vg.gain.setValueAtTime(0, time + P.vibDelay);
    vg.gain.linearRampToValueAtTime(vib, time + P.vibDelay + 0.4);
    lfo.connect(vg);
    for (const d of pitchParams) vg.connect(d);
    sources.push(lfo);
    track(lfo);
  }

  // ---------- breath / bow noise
  if (P.breath > 0.01) {
    const n = ctx.createBufferSource();
    n.buffer = noiseBuf(ctx);
    n.loop = true;
    const bp = track(ctx.createBiquadFilter());
    bp.type = "bandpass";
    const noiseF = model === "flute" ? clamp(f0 * 2.5, 500, 7000) : model === "bowed" ? clamp(f0 * 6, 1200, 8000) : clamp(f0 * 3, 600, 6000);
    bp.frequency.value = noiseF;
    bp.Q.value = model === "flute" ? 1.4 : 0.7;
    const ng = track(ctx.createGain());
    const nl = P.breath * (model === "flute" ? 0.55 : model === "bowed" ? 0.22 : 0.12) * Math.min(vq, 1.2);
    // chiff / scrape: strong at the start, relaxing to a lighter sustained level
    ng.gain.setValueAtTime(0, time);
    ng.gain.linearRampToValueAtTime(nl * 2.2, time + Math.min(A, 0.03) + 0.004);
    ng.gain.exponentialRampToValueAtTime(Math.max(FLOOR, nl * (model === "bowed" ? 0.35 : 0.8)), time + A + 0.12);
    n.connect(bp);
    bp.connect(ng);
    ng.connect(mix);
    sources.push(n);
    track(n);
  }

  // ---------- filter: blooms open from a muted start
  const lp = track(ctx.createBiquadFilter());
  lp.type = "lowpass";
  const mult = { brass: 2 + 14 * P.brightness, flute: 3 + 9 * P.brightness, reed: 3 + 15 * P.brightness, bowed: 3 + 13 * P.brightness }[model];
  const base = clamp(f0 * mult, 300, 15000);
  const bloom = 1 + P.swell * 3.2 * (0.5 + 0.5 * vq);
  const peak = clamp(base * bloom, base, 18000);
  lp.Q.value = model === "brass" ? 1.6 : model === "bowed" ? 1.0 : 0.7;
  lp.frequency.setValueAtTime(clamp(base * (1 - 0.7 * P.swell), 250, 15000), time);
  lp.frequency.exponentialRampToValueAtTime(peak, time + A + 0.06);
  lp.frequency.exponentialRampToValueAtTime(clamp(base * (1 + 0.45 * (bloom - 1)), base * 0.9, 18000), time + A + 0.5);
  mix.connect(lp);

  // body resonances
  let tail = lp;
  for (const [hz, q, db] of BODY[model]) {
    const pk = track(ctx.createBiquadFilter());
    pk.type = "peaking";
    pk.frequency.value = hz;
    pk.Q.value = q;
    pk.gain.value = db * P.body;
    tail.connect(pk);
    tail = pk;
  }
  tail.connect(amp);
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  amp.connect(clip);
  clip.connect(dest);

  for (const s of sources) {
    if (s.buffer) s.start(time, Math.random() * 0.5);
    else s.start(time);
    s.stop(stopAt);
  }
  const first = sources[0];
  first.onended = () => {
    try {
      for (const n of nodes) n.disconnect();
    } catch {
      /* already disconnected */
    }
  };
}

// JS model for the panel scope: A3 harmonics for the chosen model through the settled filter
function windsScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const f0 = 220;
  const model = MODELS.includes(P.model) ? P.model : "brass";
  const mult = { brass: 2 + 14 * P.brightness, flute: 3 + 9 * P.brightness, reed: 3 + 15 * P.brightness, bowed: 3 + 13 * P.brightness }[model];
  const fc = clamp(f0 * mult * (1 + 0.45 * P.swell * 3.2 * 0.7), 300, 15000);
  const amps = [];
  for (let n = 1; n <= 20; n++) {
    let a;
    if (model === "flute") a = fluteHarm()[n] || 0;
    else if (model === "reed") a = reedHarm(P.nasal)[n] || 0;
    else a = 1 / n;
    a /= Math.sqrt(1 + Math.pow((f0 * n) / fc, 4)); // 2nd-order low-pass slope
    amps.push(a);
  }
  const vib = (P.vibrato / 1200) * Math.LN2;
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    const ph = 2 * Math.PI * f0 * t * (1 + vib * 0.5 * Math.sin(2 * Math.PI * P.vibRate * t));
    let y = 0;
    for (let n = 1; n <= 20; n++) if (amps[n - 1] > 1e-4 && f0 * n < sr / 2) y += amps[n - 1] * Math.sin(n * ph);
    out[i] = Math.tanh(y * 0.9);
  }
  return out;
}

const svg = {
  brass: '<path d="M3 12 H9 M9 12 C9 6 15 6 15 12 C15 18 9 18 9 12 M15 12 H21 L24 9 M21 12 L24 15"/>',
  flute: '<path d="M2 11 H22 V13 H2 Z M6 11 V13 M10 11 V13 M14 11 V13"/>',
  reed: '<path d="M7 3 L12 8 L17 21 M9 8 H15 M12 12 H14 M13 16 H15"/>',
  bowed: '<path d="M3 17 C8 8 16 8 21 17 M12 5 V19 M4 8 L20 19"/>',
};

const winds = {
  name: "Muneeb",
  tagline: "Breath & bow - brass, flute, reed and bowed strings with a blooming filter and delayed vibrato",
  color: "#d97f5a",
  params: paramDefs,
  voice: windsVoice,
  scope: windsScope,
  lines: [
    { name: "Brass Stabs (Am)", dsl: "0:A3:3 0:C4:3 0:E4:3 0:A4:3 6:A3:2 6:C4:2 6:E4:2 6:A4:2 10:G3:3 10:B3:3 10:D4:3 10:G4:3 16:F3:3 16:A3:3 16:C4:3 16:F4:3 22:F3:2 22:A3:2 22:C4:2 22:F4:2 26:E3:4:110 26:G#3:4:110 26:B3:4:110 26:E4:4:110 32:A3:3 32:C4:3 32:E4:3 32:A4:3 38:C4:2 38:E4:2 38:G4:2 38:C5:2 42:B3:6:120 42:D4:6:120 42:F#4:6:120 42:B4:6:120" },
    { name: "Flute Melody (G)", dsl: "0:G4:4 4:B4:2 6:D5:6 12:C5:2 14:B4:2 16:A4:4 20:F#4:2 22:G4:10 32:B4:4 36:D5:2 38:G5:6 44:F#5:2 46:E5:2 48:D5:4 52:B4:2 54:G4:10" },
    { name: "Reed Duet (C)", dsl: "0:E4:8 0:C4:8 8:F4:4 8:D4:4 12:G4:4 12:E4:4 16:A4:8 16:F4:8 24:G4:6 24:E4:6 30:E4:2 32:C5:8 32:G4:8 40:B4:4 40:F4:4 44:A4:4 44:E4:4 48:G4:12 48:D4:12" },
    { name: "Cello Line (Dm)", dsl: "0:D2:8 8:A2:4 12:F2:4 16:G2:8 24:D2:4 28:E2:4 32:F2:8 40:C3:4 44:A2:4 48:D2:14 62:D2:2:80" },
  ],
  presets: [
    { name: "Init (Brass Section)", params: {} },
    { name: "Solo Trumpet", params: { model: "brass", brightness: 0.68, swell: 0.85, accent: 0.6, attack: 0.035, release: 0.12, breath: 0.15, body: 0.75, detune: 0, scoop: 0.45, vibrato: 7, vibRate: 5.6, vibDelay: 0.35 } },
    { name: "Mellow Horn", params: { model: "brass", brightness: 0.22, swell: 0.45, accent: 0.1, attack: 0.14, release: 0.3, breath: 0.2, body: 0.5, detune: 4, scoop: 0.15, vibrato: 4, vibRate: 5, vibDelay: 0.5 } },
    { name: "Concert Flute", params: { model: "flute", brightness: 0.5, swell: 0.15, accent: 0.15, attack: 0.07, release: 0.12, breath: 0.45, body: 0.3, detune: 2, scoop: 0.05, vibrato: 16, vibRate: 5.4, vibDelay: 0.3 } },
    { name: "Clarinet", params: { model: "reed", nasal: 0, brightness: 0.4, swell: 0.3, accent: 0.2, attack: 0.04, release: 0.12, breath: 0.2, body: 0.5, detune: 2, scoop: 0.1, vibrato: 5, vibRate: 5, vibDelay: 0.5 } },
    { name: "Oboe", params: { model: "reed", nasal: 0.85, brightness: 0.55, swell: 0.35, accent: 0.25, attack: 0.05, release: 0.12, breath: 0.15, body: 0.8, detune: 2, scoop: 0.1, vibrato: 14, vibRate: 5.8, vibDelay: 0.25 } },
    { name: "Solo Violin", params: { model: "bowed", brightness: 0.6, swell: 0.5, accent: 0.3, attack: 0.09, release: 0.2, breath: 0.35, body: 0.7, detune: 4, scoop: 0.25, vibrato: 22, vibRate: 5.8, vibDelay: 0.3 } },
    { name: "Cello", params: { model: "bowed", brightness: 0.32, swell: 0.4, accent: 0.2, attack: 0.16, release: 0.3, breath: 0.3, body: 0.85, detune: 3, scoop: 0.12, vibrato: 14, vibRate: 5, vibDelay: 0.5 } },
  ],
  ui: {
    theme: { accent: "#d97f5a", lcd: "#ffd2bd", lcdBg: "#2a1610", edge: "#4c2a1d", bg: "#1f130e" },
    logo: ["", "Muneeb"],
    sub: "BRASS · FLUTE · REED · BOWED",
    cc: { 74: "brightness", 71: "swell", 73: "attack", 72: "release", 75: "breath", 76: "vibrato", 77: "body", 78: "detune", 7: "level" },
    sections: [
      {
        title: "MODEL",
        cls: "wd-model",
        items: [
          {
            type: "radio",
            key: "model",
            cls: "wave-btns",
            options: [
              ["brass", "BRASS", svg.brass, "0 0 24 24"],
              ["flute", "FLUTE", svg.flute, "0 0 24 24"],
              ["reed", "REED", svg.reed, "0 0 24 24"],
              ["bowed", "BOWED", svg.bowed, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "brightness", label: "BRIGHT", fmt: "pct", big: true },
              { type: "knob", key: "swell", label: "BLOOM", fmt: "pct" },
              { type: "knob", key: "body", label: "BODY", fmt: "pct" },
              { type: "knob", key: "nasal", label: "NASAL", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "BREATH · BOW",
        cls: "wd-breath",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "breath", label: "NOISE", fmt: "pct" },
              { type: "knob", key: "accent", label: "ACCENT", fmt: "pct" },
              { type: "knob", key: "scoop", label: "SCOOP", fmt: "num2" },
              { type: "knob", key: "detune", label: "SECTION", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "VIBRATO",
        cls: "wd-vib",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "vibrato", label: "DEPTH", fmt: "num1", big: true },
              { type: "knob", key: "vibRate", label: "RATE", fmt: "num1" },
              { type: "knob", key: "vibDelay", label: "DELAY", fmt: "num2" },
            ],
          },
        ],
      },
      {
        title: "ENVELOPE · OUT",
        cls: "wd-out",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATT", fmt: "ms" },
              { type: "fader", key: "release", label: "REL", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-winds" },
        ],
      },
    ],
    scopeLabel: "WAVEFORM · A3",
  },
};

export const WINDS_SYNTHS = { winds };

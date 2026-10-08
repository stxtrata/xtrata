// synths/drums/kit.js — ASIC: a synthesised drum kit played as notes (Audionaut synth module).
//
// One instrument = one whole kit. The MIDI note picks the drum (General-MIDI layout, so GM beats work):
//   C1/B0 (35,36) kick   C#2 (37) rim   D2/E2 (38,40) snare   D#2 (39) clap
//   F2,G2 (41,43) low tom   A2,B2 (45,47) mid tom   C3,D3 (48,50) high tom
//   F#2 (42) closed hat   G#2 (44) pedal hat   A#2 (46) open hat
//   C#3/A3 (49,57) crash   D#3/B3 (51,59) ride   G#3 (56) cowbell
// Notes outside 35-59 fold onto the same drums by pitch class, so a loop on any octave still plays.
// Three KITS share one engine: 808 (analog: sine kick, squares for metal), 909 (punchier, brighter
// noise, triangle in the kick) and LOFI (dusty: noisy metal, band-limited, bit-crushed).
// Each voice has its own few knobs (tune / decay / snap...) plus kit-wide DRIVE and TONE.
// One-shot drum hits, so chokes (closed cutting open hat) are not possible; velocity changes level
// and brightness (snares and hats snap harder). Per-hit node graph (<= ~25 nodes), self-cleaning.
// Plain ES module, no imports.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const FLOOR = 0.0001;
const GAIN = 0.42; // master drum scale (calibrated against the harness RMS band)

// MIDI note -> drum
const GM = {
  35: "kick", 36: "kick", 37: "rim", 38: "snare", 39: "clap", 40: "snare", 41: "tomL", 42: "hatC", 43: "tomL",
  44: "hatP", 45: "tomM", 46: "hatO", 47: "tomM", 48: "tomH", 49: "crash", 50: "tomH", 51: "ride", 52: "crash",
  53: "ride", 54: "hatC", 55: "crash", 56: "cow", 57: "crash", 58: "ride", 59: "ride",
};
const FOLD = ["kick", "rim", "snare", "clap", "snare", "tomL", "hatC", "tomM", "hatP", "tomH", "hatO", "crash"];
const drumFor = (pitch) => GM[pitch] || FOLD[((pitch % 12) + 12) % 12];

// per-kit voicing tables
const KITS = {
  "808": {
    kickRise: 3.0, kickDrop: 0.05, kickTri: 0, kickClick: 0.22, kickLen: 1,
    snRatio: 1.78, snBodyDec: 0.11, snNoiseHP: 1500, snNoiseBP: 0, snNoise: 1,
    hatFreq: 205.3, hatNoise: 0, hatHP: 6500, hatBP: 9000,
    clapBP: 1150, clapQ: 1.6, clapBursts: 4, clapSpace: 1,
    cow: [540, 800], tomDrop: 1.5, tomLen: 1, crush: 0, lp: 0,
  },
  "909": {
    kickRise: 4.6, kickDrop: 0.032, kickTri: 0.5, kickClick: 0.5, kickLen: 0.8,
    snRatio: 1.9, snBodyDec: 0.09, snNoiseHP: 2400, snNoiseBP: 0, snNoise: 1.25,
    hatFreq: 240, hatNoise: 0.55, hatHP: 8000, hatBP: 10500,
    clapBP: 1500, clapQ: 1.3, clapBursts: 3, clapSpace: 0.75,
    cow: [587, 845], tomDrop: 1.9, tomLen: 0.85, crush: 0, lp: 0,
  },
  lofi: {
    kickRise: 2.1, kickDrop: 0.06, kickTri: 0.15, kickClick: 0.12, kickLen: 0.7,
    snRatio: 1.62, snBodyDec: 0.14, snNoiseHP: 900, snNoiseBP: 3200, snNoise: 0.95,
    hatFreq: 180, hatNoise: 1, hatHP: 5000, hatBP: 6500,
    clapBP: 950, clapQ: 1.1, clapBursts: 3, clapSpace: 1.4,
    cow: [500, 750], tomDrop: 1.4, tomLen: 1.2, crush: 1, lp: 5600,
  },
};
const METAL = [1, 1.4471, 1.617, 1.9265, 2.5028, 2.6637]; // classic 808-style square-wave metal ratios

// ---- shared noise (one second of white noise per context) and shaper curves
const noiseCache = new WeakMap();
function noiseBuf(ctx) {
  let b = noiseCache.get(ctx);
  if (!b) {
    const n = Math.round(ctx.sampleRate);
    b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    let s = 22222;
    for (let i = 0; i < n; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      d[i] = (s / 4294967296) * 2 - 1;
    }
    noiseCache.set(ctx, b);
  }
  return b;
}
const curves = new Map();
function driveCurve(drive, crush) {
  const key = Math.round(drive * 50) + (crush ? 1000 : 0);
  let c = curves.get(key);
  if (!c) {
    const n = 1025;
    c = new Float32Array(n);
    const k = 1 + (key % 1000) / 50 * 6;
    const norm = 1 / Math.tanh(k);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / (n - 1) - 1;
      let y = Math.tanh(x * k) * norm;
      if (crush) y = Math.round(y * 48) / 48; // ~6-bit staircase
      c[i] = y;
    }
    if (curves.size > 64) curves.clear();
    curves.set(key, c);
  }
  return c;
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
  { key: "kit", label: "Kit", type: "select", def: "808", options: ["808", "909", "lofi"] },
  { key: "kickTune", label: "Kick Tune (Hz)", type: "range", min: 32, max: 100, step: 1, def: 50 },
  { key: "kickDecay", label: "Kick Decay", type: "range", min: 0.08, max: 1.4, step: 0.01, def: 0.5 },
  { key: "kickPunch", label: "Kick Punch (pitch drop)", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "kickClick", label: "Kick Click", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "snareTune", label: "Snare Tune (Hz)", type: "range", min: 120, max: 320, step: 1, def: 185 },
  { key: "snareSnap", label: "Snare Snap (noise)", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "snareDecay", label: "Snare Decay", type: "range", min: 0.05, max: 0.6, step: 0.01, def: 0.2 },
  { key: "hatTone", label: "Hat Tone", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "hatDecay", label: "Closed Hat Decay", type: "range", min: 0.02, max: 0.3, step: 0.005, def: 0.06 },
  { key: "openDecay", label: "Open Hat Decay", type: "range", min: 0.15, max: 1.4, step: 0.01, def: 0.45 },
  { key: "clapDecay", label: "Clap Decay", type: "range", min: 0.06, max: 0.7, step: 0.01, def: 0.22 },
  { key: "clapSpread", label: "Clap Spread", type: "range", min: 0, max: 1, step: 0.01, def: 0.5 },
  { key: "tomTune", label: "Tom Tune (st)", type: "range", min: -12, max: 12, step: 0.5, def: 0 },
  { key: "tomDecay", label: "Tom Decay", type: "range", min: 0.12, max: 1, step: 0.01, def: 0.4 },
  { key: "cymDecay", label: "Cymbal Decay", type: "range", min: 0.4, max: 3.2, step: 0.05, def: 1.6 },
  { key: "drive", label: "Drive", type: "range", min: 0, max: 1, step: 0.01, def: 0.2 },
  { key: "tone", label: "Tone (low-pass)", type: "range", min: 800, max: 18000, step: 50, def: 16000 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

function kitVoice(ctx, dest, note, P) {
  const { pitch, time: t } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const K = KITS[P.kit] || KITS["808"];
  const what = drumFor(pitch);
  const vb = 0.55 + 0.45 * Math.min(v, 1.4); // hard hits are brighter / snappier

  // everything for this hit ends by `end`; every source is stopped there so one onended can clean up
  const nodes = [];
  const sources = [];
  let end = t + 0.1;
  const track = (n) => {
    nodes.push(n);
    return n;
  };
  const osc = (type, freq) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    sources.push(o);
    return track(o);
  };
  const noise = () => {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf(ctx);
    s.loop = true;
    sources.push(s);
    return track(s);
  };
  const filt = (type, f, q = 0.707) => {
    const b = ctx.createBiquadFilter();
    b.type = type;
    b.frequency.value = clamp(f, 20, 20000);
    b.Q.value = q;
    return track(b);
  };
  const gain = (val = 1) => {
    const g = ctx.createGain();
    g.gain.value = val;
    return track(g);
  };
  // exponential-decay envelope (1 ms attack to `peak`), returns the gain node
  const env = (peak, decay, attack = 0.001) => {
    const g = gain(0);
    const d = Math.max(0.01, decay);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(Math.max(FLOOR, peak), t + attack);
    g.gain.exponentialRampToValueAtTime(FLOOR, t + attack + d);
    end = Math.max(end, t + attack + d + 0.02);
    return g;
  };

  // ---- output chain: bus -> drive -> tone -> safety clip -> dest
  const bus = track(ctx.createGain());
  bus.gain.value = GAIN * P.level;
  let tail = bus;
  if (P.drive > 0.01 || K.crush) {
    const sh = track(ctx.createWaveShaper());
    sh.curve = driveCurve(P.drive, K.crush);
    sh.oversample = "2x";
    tail.connect(sh);
    tail = sh;
  }
  const lpF = K.lp ? Math.min(P.tone, K.lp) : P.tone;
  if (lpF < 17000) {
    const lp = filt("lowpass", lpF, 0.707);
    tail.connect(lp);
    tail = lp;
  }
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  tail.connect(clip);
  clip.connect(dest);

  // metallic square cluster -> highpass -> bandpass (hats, cymbals, cowbell share it)
  const metal = (base, hp, bp, bpQ, out, mult = 1, mg = 0.16) => {
    const hpf = filt("highpass", hp, 0.8);
    const bpf = filt("bandpass", bp, bpQ);
    hpf.connect(bpf);
    bpf.connect(out);
    for (const r of METAL) {
      const o = osc("square", base * r * mult);
      const og = gain(mg);
      o.connect(og);
      og.connect(hpf);
    }
    return hpf;
  };

  if (what === "kick") {
    const f0 = P.kickTune;
    const startF = f0 * (1 + (K.kickRise - 1) * (0.12 + 0.88 * P.kickPunch));
    const body = osc("sine", startF);
    body.frequency.exponentialRampToValueAtTime(f0, t + K.kickDrop * (0.7 + 0.6 * P.kickPunch));
    const eg = env(0.95 * Math.min(v, 1.4), P.kickDecay * K.kickLen);
    body.connect(eg);
    eg.connect(bus);
    if (K.kickTri > 0) {
      const tri = osc("triangle", startF);
      tri.frequency.exponentialRampToValueAtTime(f0, t + K.kickDrop * 0.8);
      const tg = env(0.55 * K.kickTri * Math.min(v, 1.4), P.kickDecay * K.kickLen * 0.5);
      tri.connect(tg);
      tg.connect(bus);
    }
    if (P.kickClick > 0.01) {
      const n = noise();
      const bp = filt("bandpass", 2600 + 1600 * vb, 0.9);
      const cg = env(0.7 * P.kickClick * K.kickClick * 2 * vb, 0.012, 0.0005);
      n.connect(bp);
      bp.connect(cg);
      cg.connect(bus);
    }
  } else if (what === "snare") {
    const f = P.snareTune;
    for (const [fr, amp] of [[f, 0.62], [f * K.snRatio, 0.34]]) {
      const o = osc("sine", fr * 1.12);
      o.frequency.exponentialRampToValueAtTime(fr, t + 0.025);
      const g = env(amp * Math.min(v, 1.4), K.snBodyDec * (0.7 + 1.6 * P.snareDecay));
      o.connect(g);
      g.connect(bus);
    }
    const n = noise();
    const hp = filt("highpass", K.snNoiseHP * (0.8 + 0.4 * vb), 0.7);
    n.connect(hp);
    let src = hp;
    if (K.snNoiseBP) {
      const bp = filt("bandpass", K.snNoiseBP, 0.9);
      hp.connect(bp);
      src = bp;
    }
    const ng = env((0.2 + 0.7 * P.snareSnap) * K.snNoise * Math.min(v, 1.4), P.snareDecay * (0.8 + 0.4 * vb));
    src.connect(ng);
    ng.connect(bus);
  } else if (what === "clap") {
    const n = noise();
    const bp = filt("bandpass", K.clapBP * (0.85 + 0.3 * vb), K.clapQ);
    const g = gain(0);
    n.connect(bp);
    bp.connect(g);
    g.connect(bus);
    const nb = K.clapBursts;
    const sp = (0.005 + 0.017 * P.clapSpread) * K.clapSpace;
    const pk = 1.7 * Math.min(v, 1.4);
    g.gain.setValueAtTime(0, t);
    let tt = t;
    for (let i = 0; i < nb - 1; i++) {
      g.gain.setValueAtTime(pk * (0.7 + 0.3 * (i % 2)), tt + 0.0005);
      g.gain.exponentialRampToValueAtTime(pk * 0.08, tt + sp * 0.9);
      tt += sp;
    }
    g.gain.setValueAtTime(pk, tt + 0.0005);
    g.gain.exponentialRampToValueAtTime(FLOOR, tt + Math.max(0.05, P.clapDecay));
    end = Math.max(end, tt + P.clapDecay + 0.03);
  } else if (what === "hatC" || what === "hatP" || what === "hatO") {
    const dec = what === "hatO" ? P.openDecay : what === "hatP" ? P.hatDecay * 0.7 : P.hatDecay;
    const g = env(0.5 * Math.min(v, 1.4) * (0.8 + 0.2 * vb), dec * (0.85 + 0.3 * vb), 0.0007);
    g.connect(bus);
    const hp = K.hatHP * (0.7 + 0.7 * P.hatTone);
    const bp = K.hatBP * (0.8 + 0.5 * P.hatTone);
    if (K.hatNoise < 1) metal(K.hatFreq, hp, bp, 0.8, g, 1, 0.95 * (1 - 0.5 * K.hatNoise));
    if (K.hatNoise > 0) {
      const n = noise();
      const nh = filt("highpass", hp * 0.8, 0.7);
      const ng = gain(K.hatNoise * 1.6);
      n.connect(nh);
      nh.connect(ng);
      ng.connect(g);
    }
  } else if (what === "tomL" || what === "tomM" || what === "tomH") {
    const base = { tomL: 98, tomM: 140, tomH: 198 }[what] * Math.pow(2, P.tomTune / 12);
    const o = osc("sine", base * K.tomDrop);
    o.frequency.exponentialRampToValueAtTime(base, t + 0.06);
    const g = env(0.9 * Math.min(v, 1.4), P.tomDecay * K.tomLen * { tomL: 1.2, tomM: 1, tomH: 0.85 }[what]);
    o.connect(g);
    g.connect(bus);
    const n = noise();
    const bp = filt("bandpass", base * 5, 1);
    const cg = env(0.18 * vb, 0.02, 0.0005);
    n.connect(bp);
    bp.connect(cg);
    cg.connect(bus);
  } else if (what === "crash") {
    const g = env(0.62 * Math.min(v, 1.4), P.cymDecay, 0.002);
    g.connect(bus);
    metal(K.hatFreq * 1.25, 4200, 7500, 0.5, g, 1.3, 0.8);
    const n = noise();
    const bp = filt("bandpass", 7000, 0.45);
    const ng = gain(K.hatNoise * 1.1 + 0.9);
    n.connect(bp);
    bp.connect(ng);
    ng.connect(g);
  } else if (what === "ride") {
    const g = env(0.3 * Math.min(v, 1.4), P.cymDecay * 0.75, 0.001);
    g.connect(bus);
    metal(K.hatFreq * 1.6, 5200, 6200, 0.9, g, 1.2, 0.9);
    for (const fr of [2310, 3290]) {
      const o = osc("sine", fr);
      const bg = env(0.1 * Math.min(v, 1.4), 0.5, 0.001);
      o.connect(bg);
      bg.connect(bus);
    }
  } else if (what === "cow") {
    const bp = filt("bandpass", 2400, 1.1);
    const g = gain(0);
    const pk = 0.55 * Math.min(v, 1.4);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(pk, t + 0.001);
    g.gain.exponentialRampToValueAtTime(pk * 0.28, t + 0.014);
    g.gain.exponentialRampToValueAtTime(FLOOR, t + 0.42);
    end = Math.max(end, t + 0.45);
    for (const fr of K.cow) {
      const o = osc("square", fr);
      const og = gain(0.5);
      o.connect(og);
      og.connect(bp);
    }
    bp.connect(g);
    g.connect(bus);
  } else {
    // rim shot: two stiff sines + a short noise tick
    for (const [fr, amp] of [[455, 0.5], [1750, 0.42]]) {
      const o = osc("sine", fr);
      const g = env(amp * Math.min(v, 1.4), 0.03, 0.0005);
      o.connect(g);
      g.connect(bus);
    }
    const n = noise();
    const bp = filt("bandpass", 4200, 1.2);
    const g = env(0.3 * vb, 0.018, 0.0004);
    n.connect(bp);
    bp.connect(g);
    g.connect(bus);
  }

  // start every source (noise at a varied offset so repeated hits are not identical), stop together
  for (const s of sources) {
    if (s.buffer) s.start(t, Math.random() * 0.6);
    else s.start(t);
    s.stop(end);
  }
  const last = sources[sources.length - 1];
  if (last) {
    last.onended = () => {
      try {
        for (const n of nodes) n.disconnect();
        clip.disconnect();
      } catch {
        /* already disconnected */
      }
    };
  }
}

// scope: the kick (C2) as a small JS model, 0.4 s at 40 kHz
function kitScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const K = KITS[P.kit] || KITS["808"];
  const f0 = P.kickTune;
  const startF = f0 * (1 + (K.kickRise - 1) * (0.12 + 0.88 * P.kickPunch));
  const drop = K.kickDrop * (0.7 + 0.6 * P.kickPunch);
  const dec = Math.max(0.05, P.kickDecay * K.kickLen);
  const k = 1 + P.drive * 6;
  let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    const f = t < drop ? startF * Math.pow(f0 / startF, t / drop) : f0;
    ph += (2 * Math.PI * f) / sr;
    const a = Math.min(1, t / 0.001) * Math.exp((-t / dec) * 4.6);
    out[i] = Math.tanh(Math.sin(ph) * a * k) / Math.tanh(k);
  }
  return out;
}

const svg = {
  k808: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  k909: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 12 H16"/>',
  lofi: '<path d="M3 17 L7 7 L11 17 L15 7 L19 17 L21 12"/>',
};

const kit = {
  name: "ASIC",
  tagline: "Synth drum kit - 808 / 909 / lo-fi voicings, GM note map: kick, snare, clap, hats, toms, cymbals, cowbell",
  color: "#ff6b5a",
  params: paramDefs,
  voice: kitVoice,
  scope: kitScope,
  lines: [
    {
      name: "House (kick clap hats)",
      dsl: "0:C2:1 4:C2:1 8:C2:1 12:C2:1 16:C2:1 20:C2:1 24:C2:1 28:C2:1 32:C2:1 36:C2:1 40:C2:1 44:C2:1 48:C2:1 52:C2:1 56:C2:1 60:C2:1 4:D#2:1 12:D#2:1 20:D#2:1 28:D#2:1 36:D#2:1 44:D#2:1 52:D#2:1 60:D#2:1 2:A#2:1:100 6:A#2:1:100 10:A#2:1:100 14:A#2:1:100 18:A#2:1:100 22:A#2:1:100 26:A#2:1:100 30:A#2:1:100 34:A#2:1:100 38:A#2:1:100 42:A#2:1:100 46:A#2:1:100 50:A#2:1:100 54:A#2:1:100 58:A#2:1:100 62:A#2:1:100 0:F#2:1:70 1:F#2:1:50 3:F#2:1:50 5:F#2:1:50 7:F#2:1:50 8:F#2:1:70 9:F#2:1:50 11:F#2:1:50 13:F#2:1:50 15:F#2:1:50",
    },
    {
      name: "Boom Bap (kick snare hats)",
      dsl: "0:C2:1 6:C2:1:90 10:C2:1 16:C2:1 22:C2:1:90 26:C2:1:110 32:C2:1 38:C2:1:90 42:C2:1 48:C2:1 54:C2:1:90 58:C2:1:110 4:D2:1 12:D2:1 20:D2:1 28:D2:1 36:D2:1 44:D2:1 52:D2:1 60:D2:1:127 0:F#2:1:90 2:F#2:1:60 4:F#2:1:90 6:F#2:1:60 8:F#2:1:90 10:F#2:1:60 12:F#2:1:90 14:F#2:1:60 16:F#2:1:90 18:F#2:1:60 20:F#2:1:90 22:F#2:1:60 24:F#2:1:90 26:F#2:1:60 28:F#2:1:90 30:A#2:1:80",
    },
    {
      name: "Trap Half-Time",
      dsl: "0:C2:2 7:C2:1:90 11:C2:2:110 16:C2:1 22:C2:2:90 28:C2:1:100 8:D2:1 8:D#2:1:90 24:D2:1 24:D#2:1:90 0:F#2:1:100 2:F#2:1:60 4:F#2:1:90 6:F#2:1:60 8:F#2:1:100 10:F#2:1:60 12:F#2:1:90 13:F#2:1:50 14:F#2:1:70 15:F#2:1:50 16:F#2:1:100 18:F#2:1:60 20:F#2:1:90 22:F#2:1:60 24:F#2:1:100 26:F#2:1:60 28:A#2:1:90 30:F#2:1:70 31:F#2:1:50",
    },
    {
      name: "Fill & Cymbals",
      dsl: "0:C#3:8:110 0:C2:1 8:D2:1 12:D2:1:100 16:G2:2:100 18:A2:2:105 20:C3:2:110 22:D3:2:120 24:D#3:8:90 32:C2:1 34:G#3:2:100 36:D2:1 38:G#3:2:90 40:C2:1 42:C2:1:90 44:D2:1 46:G#3:2:100 48:F2:1:100 49:G2:1:100 50:A2:1:105 51:B2:1:105 52:C3:1:110 53:D3:1:115 54:D#2:1:120 55:D2:1:120 56:C2:2:127 56:C#3:8:127",
    },
  ],
  presets: [
    { name: "Init (808 Kit)", params: {} },
    { name: "909 Punch", params: { kit: "909", kickTune: 56, kickDecay: 0.38, kickPunch: 0.7, kickClick: 0.6, snareTune: 200, snareSnap: 0.75, snareDecay: 0.19, hatTone: 0.6, hatDecay: 0.05, openDecay: 0.38, clapDecay: 0.2, clapSpread: 0.35, tomDecay: 0.33, cymDecay: 1.9, drive: 0.35 } },
    { name: "Lo-Fi Dust", params: { kit: "lofi", kickTune: 46, kickDecay: 0.42, kickPunch: 0.4, kickClick: 0.2, snareTune: 170, snareSnap: 0.5, snareDecay: 0.24, hatTone: 0.3, hatDecay: 0.07, openDecay: 0.3, clapDecay: 0.26, clapSpread: 0.7, tomDecay: 0.45, cymDecay: 1.3, drive: 0.3, tone: 5200 } },
    { name: "Deep Sub Kit", params: { kit: "808", kickTune: 38, kickDecay: 1.1, kickPunch: 0.35, kickClick: 0.15, snareTune: 160, snareSnap: 0.35, snareDecay: 0.28, hatTone: 0.35, hatDecay: 0.05, openDecay: 0.5, clapDecay: 0.3, clapSpread: 0.6, tomTune: -4, tomDecay: 0.7, cymDecay: 2.2, drive: 0.15, tone: 9000 } },
    { name: "Tight Trap", params: { kit: "808", kickTune: 44, kickDecay: 0.9, kickPunch: 0.5, kickClick: 0.3, snareTune: 210, snareSnap: 0.85, snareDecay: 0.14, hatTone: 0.8, hatDecay: 0.035, openDecay: 0.25, clapDecay: 0.16, clapSpread: 0.25, tomDecay: 0.25, cymDecay: 1.4, drive: 0.25 } },
    { name: "House Machine", params: { kit: "909", kickTune: 52, kickDecay: 0.3, kickPunch: 0.55, kickClick: 0.5, snareTune: 190, snareSnap: 0.55, snareDecay: 0.17, hatTone: 0.7, hatDecay: 0.04, openDecay: 0.55, clapDecay: 0.28, clapSpread: 0.5, tomDecay: 0.3, cymDecay: 2.4, drive: 0.4 } },
    { name: "Boom Bap Break", params: { kit: "lofi", kickTune: 54, kickDecay: 0.3, kickPunch: 0.55, kickClick: 0.35, snareTune: 190, snareSnap: 0.7, snareDecay: 0.22, hatTone: 0.4, hatDecay: 0.06, openDecay: 0.28, clapDecay: 0.2, clapSpread: 0.5, tomDecay: 0.35, cymDecay: 1.1, drive: 0.5, tone: 6800 } },
    { name: "Dub Toms & Rims", params: { kit: "808", kickTune: 60, kickDecay: 0.3, kickPunch: 0.8, kickClick: 0.2, snareTune: 150, snareSnap: 0.25, snareDecay: 0.12, hatTone: 0.2, hatDecay: 0.06, openDecay: 0.7, clapDecay: 0.4, clapSpread: 0.8, tomTune: 3, tomDecay: 0.95, cymDecay: 2.8, drive: 0.1, tone: 7500 } },
  ],
  ui: {
    theme: { accent: "#ff6b5a", lcd: "#ffc9c2", lcdBg: "#2b1210", edge: "#4a2320", bg: "#1f1211" },
    logo: ["", "ASIC"],
    sub: "SYNTH DRUM KIT · GM NOTE MAP",
    cc: { 74: "tone", 71: "drive", 73: "kickClick", 72: "snareDecay", 75: "kickDecay", 76: "snareSnap", 77: "hatTone", 78: "clapDecay", 7: "level" },
    sections: [
      {
        title: "KIT",
        cls: "kt-kit",
        items: [
          {
            type: "radio",
            key: "kit",
            cls: "wave-btns",
            options: [
              ["808", "808", svg.k808, "0 0 24 24"],
              ["909", "909", svg.k909, "0 0 24 24"],
              ["lofi", "LO-FI", svg.lofi, "0 0 24 24"],
            ],
          },
          { type: "row", items: [{ type: "knob", key: "drive", label: "DRIVE", fmt: "pct" }, { type: "knob", key: "tone", label: "TONE", curve: "log", fmt: "hz" }] },
        ],
      },
      {
        title: "KICK  (C1 / B0)",
        cls: "kt-kick",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "kickTune", label: "TUNE", fmt: "int", big: true },
              { type: "knob", key: "kickDecay", label: "DECAY", fmt: "num2" },
              { type: "knob", key: "kickPunch", label: "PUNCH", fmt: "pct" },
              { type: "knob", key: "kickClick", label: "CLICK", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "SNARE · CLAP",
        cls: "kt-snare",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "snareTune", label: "TUNE", fmt: "int" },
              { type: "knob", key: "snareSnap", label: "SNAP", fmt: "pct" },
              { type: "knob", key: "snareDecay", label: "DECAY", fmt: "num2" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "clapDecay", label: "CLAP DEC", fmt: "num2" },
              { type: "knob", key: "clapSpread", label: "SPREAD", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "HATS · TOMS · CYMBALS",
        cls: "kt-metal",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "hatTone", label: "HAT TONE", fmt: "pct" },
              { type: "knob", key: "hatDecay", label: "CLOSED", fmt: "num2" },
              { type: "knob", key: "openDecay", label: "OPEN", fmt: "num2" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "tomTune", label: "TOM TUNE", fmt: "num1" },
              { type: "knob", key: "tomDecay", label: "TOM DEC", fmt: "num2" },
              { type: "knob", key: "cymDecay", label: "CYMBAL", fmt: "num2" },
            ],
          },
        ],
      },
      {
        title: "OUTPUT",
        cls: "kt-out",
        items: [
          { type: "row", items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }] },
          { type: "viz", id: "scope", cls: "viz-kit" },
        ],
      },
    ],
    scopeLabel: "KICK · C2",
  },
};

export const KIT_SYNTHS = { kit };

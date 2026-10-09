// synths/drums/kit.js — ASIC: a synthesised drum kit played as notes (Audionaut synth module).
//
// One instrument = one whole kit. The MIDI note picks the drum (General-MIDI layout, so GM beats work;
// note names use the app's C4 = 60, so the GM kick 36 is C2):
//   B1/C2 (35,36) kick   C#2 (37) rim   D2/E2 (38,40) snare   D#2 (39) clap
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
// per-drum mix trims so a kit is balanced out of the box (kick > snare/toms > clap > cymbals > hats)
const MIX = { kick: 1, rim: 1.15, snare: 1.15, clap: 1.4, hatC: 1.1, hatP: 1.1, hatO: 1.1, tomL: 0.85, tomM: 0.85, tomH: 0.85, crash: 0.6, ride: 0.85, cow: 1.8 };

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
    cow: [540, 800], tomDrop: 1.5, tomLen: 1, crush: 0, lp: 0, hatLvl: 1.6,
  },
  "909": {
    kickRise: 4.6, kickDrop: 0.032, kickTri: 0.5, kickClick: 0.5, kickLen: 0.8,
    snRatio: 1.9, snBodyDec: 0.09, snNoiseHP: 2400, snNoiseBP: 0, snNoise: 1.25,
    hatFreq: 240, hatNoise: 0.55, hatHP: 8000, hatBP: 10500,
    clapBP: 1500, clapQ: 1.3, clapBursts: 3, clapSpace: 0.75,
    cow: [587, 845], tomDrop: 1.9, tomLen: 0.85, crush: 0, lp: 0, hatLvl: 1,
  },
  lofi: {
    kickRise: 2.1, kickDrop: 0.06, kickTri: 0.15, kickClick: 0.12, kickLen: 0.7,
    snRatio: 1.62, snBodyDec: 0.14, snNoiseHP: 900, snNoiseBP: 3200, snNoise: 0.95,
    hatFreq: 180, hatNoise: 1, hatHP: 5000, hatBP: 6500,
    clapBP: 950, clapQ: 1.1, clapBursts: 3, clapSpace: 1.4,
    cow: [500, 750], tomDrop: 1.4, tomLen: 1.2, crush: 1, lp: 5600, hatLvl: 1,
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
// output safety: linear up to 0.6, soft knee to a 0.86 ceiling; the curve spans +-CLIP_IN (input pre-scaled)
const CLIP_IN = 3;
let clipCurve = null;
function safetyCurve() {
  if (!clipCurve) {
    const n = 1025;
    clipCurve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = ((i * 2) / (n - 1) - 1) * CLIP_IN;
      const a = Math.abs(x);
      clipCurve[i] = Math.sign(x) * (a < 0.6 ? a : 0.6 + 0.26 * Math.tanh((a - 0.6) / 0.26));
    }
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
  const hat = what === "hatC" || what === "hatP" || what === "hatO";
  bus.gain.value = GAIN * P.level * MIX[what] * (hat ? K.hatLvl : 1);
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
  // pre-scale into the safety curve; drive gets a makeup trim so it adds grit, not just level
  // (without the shaper, 1.31 = its small-signal gain at drive 0, so the DRIVE knob has no level jump near 0)
  const pre = gain((tail !== bus ? 1 / (1 + 0.9 * P.drive) : 1.31) / CLIP_IN);
  tail.connect(pre);
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  pre.connect(clip);
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
    // each burst: 0.6 ms rise (no hard step), fast decay to 8 %; the last burst rings out
    for (let i = 0; i < nb - 1; i++) {
      g.gain.linearRampToValueAtTime(pk * (0.7 + 0.3 * (i % 2)), tt + 0.0006);
      g.gain.exponentialRampToValueAtTime(pk * 0.08, tt + sp * 0.9);
      tt += sp;
      g.gain.setValueAtTime(pk * 0.08, tt);
    }
    g.gain.linearRampToValueAtTime(pk, tt + 0.0006);
    g.gain.exponentialRampToValueAtTime(FLOOR, tt + Math.max(0.05, P.clapDecay));
    end = Math.max(end, tt + P.clapDecay + 0.03);
  } else if (hat) {
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
    const ng = gain(K.hatNoise * 0.5 + 0.9);
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

// ---- preset library: every preset is a whole kit. Row = [name, kit, kickTune, kickDecay, kickPunch, kickClick,
// snareTune, snareSnap, snareDecay, clapDecay, clapSpread, hatTone, hatDecay, openDecay, tomTune, tomDecay,
// cymDecay, drive, tone, level?] grouped by category (expanded by a tiny helper below).
const PK = ["kickTune", "kickDecay", "kickPunch", "kickClick", "snareTune", "snareSnap", "snareDecay", "clapDecay", "clapSpread",
  "hatTone", "hatDecay", "openDecay", "tomTune", "tomDecay", "cymDecay", "drive", "tone", "level"];
const BANK = {
  "808 Drums": [
    ["Deep Sub Kit", "808", 38, 1.1, 0.35, 0.15, 160, 0.35, 0.28, 0.3, 0.6, 0.35, 0.05, 0.5, -4, 0.7, 2.2, 0.15, 9000],
    ["Miami Bass 808", "808", 42, 1.3, 0.3, 0.2, 230, 0.7, 0.18, 0.25, 0.45, 0.6, 0.045, 0.4, 2, 0.6, 1.8, 0.2, 14000],
    ["808 Dry Room", "808", 54, 0.22, 0.65, 0.5, 200, 0.65, 0.1, 0.14, 0.3, 0.55, 0.03, 0.22, 0, 0.2, 0.7, 0.1, 12000],
    ["Freestyle 808", "808", 68, 0.35, 0.75, 0.5, 265, 0.8, 0.15, 0.18, 0.4, 0.75, 0.04, 0.35, 7, 0.35, 1.2, 0.25, 16000],
    ["808 Warm Tape", "808", 48, 0.6, 0.55, 0.25, 175, 0.5, 0.22, 0.24, 0.55, 0.35, 0.06, 0.5, -2, 0.45, 1.8, 0.35, 6000],
    ["808 Ballad", "808", 45, 0.7, 0.35, 0.1, 165, 0.3, 0.32, 0.35, 0.75, 0.25, 0.07, 0.7, -3, 0.6, 2.8, 0.05, 8000],
    ["808 Crunch", "808", 52, 0.55, 0.8, 0.6, 215, 0.85, 0.2, 0.2, 0.4, 0.65, 0.05, 0.4, 0, 0.35, 1.5, 0.75, 13000],
  ],
  "909 Drums": [
    ["909 Punch", "909", 56, 0.38, 0.7, 0.6, 200, 0.75, 0.19, 0.2, 0.35, 0.6, 0.05, 0.38, 0, 0.33, 1.9, 0.35, 16000],
    ["House Machine", "909", 52, 0.3, 0.55, 0.5, 190, 0.55, 0.17, 0.28, 0.5, 0.7, 0.04, 0.55, 0, 0.3, 2.4, 0.4, 16000],
    ["Techno Warehouse", "909", 47, 0.45, 0.85, 0.8, 195, 0.7, 0.2, 0.3, 0.45, 0.65, 0.045, 0.6, -2, 0.4, 2.6, 0.6, 11000],
    ["Deep House Soft", "909", 50, 0.55, 0.45, 0.25, 180, 0.45, 0.22, 0.32, 0.6, 0.45, 0.05, 0.8, -1, 0.45, 2.8, 0.1, 9500],
    ["Garage Swing", "909", 58, 0.28, 0.6, 0.55, 230, 0.8, 0.13, 0.18, 0.7, 0.8, 0.03, 0.3, 2, 0.3, 1.6, 0.3, 16000],
    ["Acid Tight", "909", 60, 0.22, 0.7, 0.7, 210, 0.65, 0.12, 0.16, 0.3, 0.85, 0.025, 0.25, 4, 0.25, 1.2, 0.45, 16000],
    ["Minimal Click", "909", 55, 0.18, 0.5, 1, 250, 0.5, 0.08, 0.12, 0.2, 0.9, 0.02, 0.18, 6, 0.18, 0.8, 0.15, 16000],
    ["Hardgroove Crunch", "909", 53, 0.35, 0.75, 0.65, 185, 0.75, 0.24, 0.26, 0.55, 0.55, 0.06, 0.5, -3, 0.5, 2.2, 0.8, 8500],
  ],
  "Trap Drums": [
    ["Tight Trap", "808", 44, 0.9, 0.5, 0.3, 210, 0.85, 0.14, 0.16, 0.25, 0.8, 0.035, 0.25, 0, 0.25, 1.4, 0.25, 16000],
    ["Trap Long 808", "808", 36, 1.4, 0.45, 0.2, 220, 0.9, 0.13, 0.18, 0.3, 0.85, 0.03, 0.25, -2, 0.35, 1.6, 0.3, 16000],
    ["UK Drill", "808", 41, 1.2, 0.6, 0.35, 245, 0.95, 0.12, 0.15, 0.2, 0.9, 0.025, 0.22, 3, 0.3, 1.3, 0.35, 16000],
    ["Phonk Memphis", "lofi", 45, 1, 0.7, 0.4, 200, 0.8, 0.16, 0.2, 0.45, 0.6, 0.04, 0.3, 0, 0.4, 1.4, 0.65, 7000],
    ["Rage Distorted", "808", 40, 1.25, 0.75, 0.5, 225, 0.9, 0.15, 0.2, 0.35, 0.75, 0.035, 0.3, 0, 0.3, 1.5, 0.9, 15000],
    ["Cloud Trap", "808", 43, 1.1, 0.35, 0.1, 190, 0.55, 0.25, 0.3, 0.65, 0.45, 0.05, 1, -4, 0.6, 3, 0.1, 8000],
    ["Atlanta Snap", "808", 47, 0.8, 0.55, 0.4, 280, 1, 0.09, 0.1, 0.15, 0.85, 0.03, 0.2, 0, 0.25, 1.2, 0.3, 16000],
    ["Plugg Bounce", "808", 49, 0.75, 0.4, 0.25, 300, 0.65, 0.11, 0.2, 0.35, 0.7, 0.035, 0.35, 5, 0.35, 1.4, 0.15, 12000],
  ],
  "Lo-fi Drums": [
    ["Lo-Fi Dust", "lofi", 46, 0.42, 0.4, 0.2, 170, 0.5, 0.24, 0.26, 0.7, 0.3, 0.07, 0.3, 0, 0.45, 1.3, 0.3, 5200],
    ["Boom Bap Break", "lofi", 54, 0.3, 0.55, 0.35, 190, 0.7, 0.22, 0.2, 0.5, 0.4, 0.06, 0.28, 0, 0.35, 1.1, 0.5, 6800],
    ["Dusty Jazz Kit", "lofi", 58, 0.25, 0.25, 0.15, 220, 0.85, 0.38, 0.3, 0.8, 0.25, 0.08, 0.6, 2, 0.5, 2.6, 0.15, 3800],
    ["Chillhop Study", "lofi", 52, 0.35, 0.45, 0.2, 185, 0.6, 0.2, 0.24, 0.6, 0.35, 0.05, 0.35, 0, 0.4, 1.6, 0.2, 4600],
    ["SP Crunch", "lofi", 56, 0.3, 0.65, 0.45, 195, 0.75, 0.18, 0.2, 0.45, 0.5, 0.05, 0.3, 0, 0.3, 1, 0.8, 9000],
    ["Basement Tape", "lofi", 50, 0.4, 0.5, 0.3, 175, 0.55, 0.26, 0.26, 0.55, 0.3, 0.06, 0.35, -2, 0.45, 1.4, 0.45, 2600],
    ["Dilla Swing Kit", "lofi", 60, 0.28, 0.6, 0.4, 178, 0.65, 0.2, 0.22, 0.55, 0.45, 0.055, 0.32, 1, 0.35, 1.2, 0.55, 6000],
    ["Muffled Next Door", "lofi", 44, 0.5, 0.4, 0.1, 160, 0.4, 0.25, 0.28, 0.6, 0.2, 0.06, 0.4, -3, 0.5, 1.5, 0.3, 1400, 1.2],
  ],
  "Electro Drums": [
    ["Electro Funk", "808", 62, 0.35, 0.9, 0.5, 240, 0.8, 0.14, 0.18, 0.4, 0.7, 0.035, 0.3, 5, 0.4, 1.3, 0.3, 16000],
    ["Robot Boogie", "909", 57, 0.3, 0.8, 0.6, 220, 0.6, 0.15, 0.2, 0.35, 0.75, 0.03, 0.3, 9, 0.5, 1.4, 0.3, 16000],
    ["Breakdance Toms", "808", 58, 0.4, 0.85, 0.45, 205, 0.7, 0.17, 0.22, 0.5, 0.6, 0.04, 0.4, 12, 0.75, 1.5, 0.25, 16000],
    ["Detroit Electro", "808", 55, 0.45, 0.7, 0.35, 190, 0.6, 0.18, 0.26, 0.55, 0.6, 0.045, 0.5, -5, 0.5, 1, 0.35, 11000],
    ["Synth Pop 80s", "909", 54, 0.4, 0.6, 0.5, 175, 0.7, 0.45, 0.45, 0.6, 0.55, 0.05, 0.45, -3, 0.8, 2.4, 0.25, 14000],
    ["Zapp Click", "808", 70, 0.15, 1, 0.9, 290, 0.4, 0.07, 0.1, 0.15, 0.95, 0.02, 0.16, 10, 0.2, 0.6, 0.2, 16000],
    ["Industrial EBM", "909", 49, 0.4, 0.75, 0.6, 150, 0.85, 0.35, 0.35, 0.6, 0.4, 0.06, 0.45, -6, 0.55, 2, 0.7, 7000],
    ["Pocket Calculator", "808", 65, 0.2, 0.5, 0.3, 310, 0.2, 0.1, 0.12, 0.1, 0.9, 0.025, 0.2, 8, 0.25, 0.9, 0, 16000, 1.2],
  ],
  "Acoustic Drums": [
    ["Studio Rock Kit", "909", 58, 0.35, 0.45, 0.7, 210, 0.7, 0.3, 0.3, 0.6, 0.45, 0.06, 0.55, -2, 0.55, 2.4, 0.15, 12000],
    ["Jazz Brushes", "lofi", 62, 0.22, 0.2, 0.1, 235, 0.9, 0.45, 0.4, 0.9, 0.3, 0.09, 0.7, 3, 0.45, 3.2, 0.05, 7000],
    ["Funk Pocket", "909", 62, 0.25, 0.4, 0.6, 245, 0.6, 0.14, 0.18, 0.4, 0.6, 0.045, 0.3, 1, 0.35, 1.5, 0.2, 13000],
    ["Arena Rock", "909", 50, 0.5, 0.5, 0.75, 170, 0.8, 0.55, 0.5, 0.7, 0.5, 0.07, 0.7, -5, 0.9, 3, 0.35, 11000],
    ["Garage Indie", "lofi", 55, 0.35, 0.5, 0.5, 195, 0.75, 0.28, 0.28, 0.6, 0.45, 0.06, 0.5, -1, 0.5, 2, 0.45, 8000],
    ["Reggae One Drop", "808", 56, 0.4, 0.4, 0.3, 285, 0.3, 0.12, 0.2, 0.5, 0.5, 0.05, 0.4, 2, 0.45, 1.8, 0.1, 10000],
    ["Motown Room", "lofi", 52, 0.3, 0.4, 0.3, 200, 0.8, 0.33, 0.3, 0.7, 0.35, 0.06, 0.4, -2, 0.4, 1.8, 0.25, 5000],
    ["Bebop High Tune", "909", 76, 0.3, 0.3, 0.4, 265, 0.75, 0.3, 0.25, 0.7, 0.4, 0.07, 0.6, 6, 0.5, 2.8, 0.1, 10000],
  ],
  "FX Drums": [
    ["Dub Toms & Rims", "808", 60, 0.3, 0.8, 0.2, 150, 0.25, 0.12, 0.4, 0.8, 0.2, 0.06, 0.7, 3, 0.95, 2.8, 0.1, 7500],
    ["Gabber Distortion", "909", 62, 0.6, 1, 1, 200, 0.9, 0.2, 0.25, 0.4, 0.8, 0.04, 0.35, 0, 0.35, 1.5, 1, 16000],
    ["Telephone Kit", "909", 70, 0.25, 0.6, 0.6, 250, 0.7, 0.18, 0.2, 0.4, 0, 0.04, 0.3, 4, 0.3, 1, 0.6, 2800],
    ["Bit Crusher", "lofi", 50, 0.4, 0.7, 0.6, 200, 0.8, 0.2, 0.22, 0.5, 0.6, 0.05, 0.4, 0, 0.4, 1.2, 1, 18000],
    ["Laser Toms", "808", 100, 0.3, 1, 0.2, 320, 0.3, 0.1, 0.15, 0.3, 0.9, 0.04, 0.3, 12, 1, 0.8, 0.2, 16000],
    ["Underwater", "808", 40, 1, 0.6, 0.4, 150, 0.6, 0.4, 0.5, 0.8, 0.5, 0.08, 0.9, -8, 0.8, 3, 0.3, 800, 1.1],
    ["Glitch Ticks", "909", 80, 0.08, 1, 1, 320, 1, 0.05, 0.06, 0, 1, 0.02, 0.15, 12, 0.12, 0.4, 0.3, 16000],
    ["Long Tails", "808", 34, 1.4, 0.5, 0.2, 140, 0.5, 0.6, 0.7, 1, 0.3, 0.3, 1.4, -12, 1, 3.2, 0.15, 10000],
  ],
};
const PRESETS = [{ name: "Init (808 Kit)", cat: "808 Drums", params: {} }];
for (const [cat, rows] of Object.entries(BANK))
  for (const [name, kit, ...v] of rows) {
    const params = { kit };
    v.forEach((x, i) => (params[PK[i]] = x));
    PRESETS.push({ name, cat, params });
  }

const kit = {
  name: "ASIC",
  tagline: "Synth drum kit - 808 / 909 / lo-fi voicings, GM note map: kick, snare, clap, hats, toms, cymbals, cowbell",
  color: "#ff6b5a",
  params: paramDefs,
  live: { oneShot: true, gate: 0.35 }, // drums ring out; key-up does not cut them
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
    {
      name: "Electro Breakbeat (toms, cowbell)",
      dsl: "0:C2:1 6:C2:1 10:C2:1:110 4:D2:1 12:D2:1 0:F#2:1:90 2:F#2:1:60 4:F#2:1:90 6:F#2:1:60 8:F#2:1:90 10:F#2:1:60 12:F#2:1:90 14:A#2:1:90 16:C2:1 22:C2:1 26:C2:1:110 27:C2:1:80 20:D2:1 28:D2:1 16:F#2:1:90 18:F#2:1:60 20:F#2:1:90 22:F#2:1:60 24:F#2:1:90 26:F#2:1:60 28:F#2:1:90 30:A#2:1:90 19:G#3:1:80 23:G#3:1:70 32:C2:1 38:C2:1 42:C2:1:110 36:D2:1 44:D2:1 32:F#2:1:90 34:F#2:1:60 36:F#2:1:90 38:F#2:1:60 40:F#2:1:90 42:F#2:1:60 44:F#2:1:90 46:A#2:1:90 48:C2:1 54:C2:1 52:D2:1 48:F#2:1:90 50:F#2:1:60 52:F#2:1:90 56:C3:1:110 58:A2:1:110 60:G2:1:115 62:F2:1:120",
    },
    {
      name: "Rock Beat & Fill (crash)",
      dsl: "0:C2:1 8:C2:1 10:C2:1:100 4:D2:1 12:D2:1:120 2:F#2:1:70 4:F#2:1:100 6:F#2:1:70 8:F#2:1:100 10:F#2:1:70 12:F#2:1:100 14:F#2:1:70 0:C#3:1:110 16:C2:1 24:C2:1 26:C2:1:100 20:D2:1 28:D2:1:120 16:F#2:1:100 18:F#2:1:70 20:F#2:1:100 22:F#2:1:70 24:F#2:1:100 26:F#2:1:70 28:F#2:1:100 30:F#2:1:70 32:C2:1 40:C2:1 42:C2:1:100 36:D2:1 44:D2:1:120 32:F#2:1:100 34:F#2:1:70 36:F#2:1:100 38:F#2:1:70 40:F#2:1:100 42:F#2:1:70 44:F#2:1:100 46:F#2:1:70 48:C2:1 56:C2:1 52:D2:1 55:D2:1:60 48:F#2:1:100 50:F#2:1:70 52:F#2:1:100 54:F#2:1:70 56:D3:1:110 57:D3:1:90 58:C3:1:110 59:C3:1:90 60:A2:1:115 61:F2:1:115 62:F2:1:120 63:E2:1:127",
    },
  ],
  presets: PRESETS,
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
        title: "KICK  (C2 / B1)",
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

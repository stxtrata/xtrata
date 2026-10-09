// synths/organ/tonewheel.js — Cathedral: drawbar tonewheel organ (Audionaut synth module).
//
// The classic electromechanical organ, one note = one tiny graph:
//   * NINE DRAWBARS (16' 5 1/3' 8' 4' 2 2/3' 2' 1 3/5' 1 1/3' 1'), each 0-8 in 3 dB steps like the
//     real thing. They are folded into ONE oscillator running at half the note frequency with a
//     custom PeriodicWave (the nine footages are harmonics 1,3,2,4,6,8,10,12,16 of that sub-pitch),
//     so the nine pipes are exactly phase-locked, like tonewheels on a shared shaft.
//   * PERCUSSION: a decaying 2nd or 3rd harmonic on the attack (fast / slow via PERC DECAY)
//   * KEY CLICK on press and a softer one on release (the contact noise everybody loves)
//   * SCANNER vibrato / chorus (V1-V3 vibrato, C1-C3 chorus = dry + vibrato blend)
//   * ROTARY speaker approximation: phase-locked amplitude + doppler wobble, OFF / SLOW / FAST
//   * DRIVE: tube-style overdrive after the tone filter
// The scanner/rotary LFOs are looped table players started at a phase derived from the absolute note
// time, so every note of a chord (and all later notes) wobble together. Plain ES module, no imports.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001;
const GAIN = 0.26; // master voice scale (calibrated against the harness RMS band)
const CLICK = 1; // key-click level (bypasses the amp envelope)

// drawbar order, footage labels, harmonic number relative to the half-pitch oscillator
const BARS = [
  { key: "d16", harm: 1 },
  { key: "d513", harm: 3 },
  { key: "d8", harm: 2 },
  { key: "d4", harm: 4 },
  { key: "d223", harm: 6 },
  { key: "d2", harm: 8 },
  { key: "d135", harm: 10 },
  { key: "d113", harm: 12 },
  { key: "d1", harm: 16 },
];
const barAmp = (n) => (n <= 0 ? 0 : Math.pow(10, (-(8 - n) * 3) / 20)); // 3 dB per step

// ---- PeriodicWave cache (immutable per ctx+drawbar setting+foldback; the only cross-note state)
// FOLDBACK: the real generator has no tonewheels above ~5.9 kHz, so a high footage that would go
// past the top wheel repeats an octave lower (as on the real console). Keeps the top octaves sweet.
const TOP_WHEEL = 5950;
const foldHarms = (f0) =>
  BARS.map((b) => {
    let h = b.harm;
    while (h > 3 && h % 2 === 0 && (h * f0) / 2 > TOP_WHEEL) h /= 2;
    return h;
  });
const waveCache = new WeakMap();
function drawbarWave(ctx, P, f0) {
  let m = waveCache.get(ctx);
  if (!m) {
    m = new Map();
    waveCache.set(ctx, m);
  }
  const hs = foldHarms(f0);
  const key = BARS.map((b) => Math.round(P[b.key])).join("") + hs.join(",");
  let w = m.get(key);
  if (w) {
    m.delete(key); // LRU: most recent last
    m.set(key, w);
  } else {
    const re = new Float32Array(17);
    const im = new Float32Array(17);
    BARS.forEach((b, i) => (im[hs[i]] += barAmp(Math.round(P[b.key])))); // sine phase
    let e = 0;
    for (let i = 0; i < 17; i++) e += im[i] * im[i];
    const scale = e > 0 ? 0.7 / Math.sqrt(e) : 0; // constant loudness whatever the registration
    for (let i = 0; i < 17; i++) im[i] *= scale;
    w = ctx.createPeriodicWave(re, im, { disableNormalization: true });
    if (m.size >= 96) m.delete(m.keys().next().value);
    m.set(key, w);
  }
  return w;
}

// ---- phase-locked LFO (one sine cycle in one second, looped)
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
function lfoSource(ctx, time, rate, phase, stopAt) {
  const s = ctx.createBufferSource();
  const buf = lfoBuffer(ctx);
  s.buffer = buf;
  s.loop = true;
  s.playbackRate.value = rate;
  const cyc = (((time * rate + phase) % 1) + 1) % 1;
  s.start(time, cyc * buf.duration);
  s.stop(stopAt);
  return s;
}

const noiseCache = new WeakMap();
function noiseBuf(ctx) {
  let b = noiseCache.get(ctx);
  if (!b) {
    const n = Math.round(ctx.sampleRate / 2);
    b = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = b.getChannelData(0);
    let s = 7919;
    for (let i = 0; i < n; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      d[i] = (s / 4294967296) * 2 - 1;
    }
    noiseCache.set(ctx, b);
  }
  return b;
}

const driveCurves = new Map();
function driveCurve(drive) {
  const key = Math.round(drive * 50);
  let c = driveCurves.get(key);
  if (!c) {
    const n = 1025;
    c = new Float32Array(n);
    const k = 1 + (key / 50) * 9;
    const norm = 1 / Math.tanh(k);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / (n - 1) - 1;
      // slightly asymmetric: tubes add even harmonics
      c[i] = (Math.tanh(x * k + 0.12 * k * x * x) - Math.tanh(0.12 * k * 0)) * norm;
    }
    if (driveCurves.size > 64) driveCurves.clear();
    driveCurves.set(key, c);
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

const bar = (key, label, def) => ({ key, label, type: "range", min: 0, max: 8, step: 1, def });
const paramDefs = [
  bar("d16", "16' Sub", 4),
  bar("d513", "5 1/3' Quint", 0),
  bar("d8", "8' Fundamental", 8),
  bar("d4", "4' Octave", 6),
  bar("d223", "2 2/3' Nazard", 0),
  bar("d2", "2' Super Octave", 4),
  bar("d135", "1 3/5' Tierce", 0),
  bar("d113", "1 1/3' Larigot", 0),
  bar("d1", "1' Fife", 0),
  { key: "perc", label: "Percussion", type: "select", def: "off", options: ["off", "2nd", "3rd"] },
  { key: "percDecay", label: "Perc Decay", type: "range", min: 0.05, max: 1, step: 0.01, def: 0.16 },
  { key: "percLevel", label: "Perc Level", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "keyClick", label: "Key Click", type: "range", min: 0, max: 1, step: 0.01, def: 0.35 },
  { key: "scanner", label: "Scanner", type: "select", def: "off", options: ["off", "v1", "v2", "v3", "c1", "c2", "c3"] },
  { key: "rotary", label: "Rotary Speaker", type: "select", def: "off", options: ["off", "slow", "fast"] },
  { key: "rotaryDepth", label: "Rotary Depth", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "cutoff", label: "Tone (low-pass)", type: "range", min: 600, max: 16000, step: 50, def: 9000 },
  { key: "drive", label: "Overdrive", type: "range", min: 0, max: 1, step: 0.01, def: 0.15 },
  { key: "attack", label: "Attack", type: "range", min: 0.002, max: 0.4, step: 0.001, def: 0.005 },
  { key: "release", label: "Release", type: "range", min: 0.01, max: 1.5, step: 0.01, def: 0.07 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

// scanner depths in cents at 6.8 Hz (V1/V2/V3), chorus = dry + the vibrato copy at the same depth
const SCAN = { v1: 7, v2: 14, v3: 24, c1: 7, c2: 14, c3: 24 };
const SCAN_RATE = 6.8;
// rotary: the treble horn and the bass drum spin at different speeds (Hz) - that beat is the sound
const ROT = { slow: [0.83, 0.67], fast: [6.75, 5.7] };
const XOVER = 800; // horn / drum crossover

function organVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);
  const A = Math.max(0.002, P.attack);
  const R = Math.max(0.01, P.release);
  const stopAt = time + gate + R + 0.08;
  const wave = drawbarWave(ctx, P, f0);

  const nodes = [];
  const track = (n) => {
    nodes.push(n);
    return n;
  };
  const gain = (g) => {
    const n = track(ctx.createGain());
    n.gain.value = g;
    return n;
  };

  // ---------- amp envelope: organ keys are on/off; A and R only smooth the contacts
  const amp = track(ctx.createGain());
  const top = Math.max(FLOOR, v * GAIN * P.level);
  amp.gain.setValueAtTime(0, time);
  if (gate <= A) amp.gain.linearRampToValueAtTime(top * (gate / A), time + gate);
  else amp.gain.linearRampToValueAtTime(top, time + A);
  const lvl = gate <= A ? top * (gate / A) : top;
  amp.gain.setValueAtTime(Math.max(FLOOR, lvl), time + gate);
  amp.gain.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  amp.gain.setValueAtTime(0, time + gate + R + 0.001);

  const lp = track(ctx.createBiquadFilter());
  lp.type = "lowpass";
  lp.frequency.value = clamp(P.cutoff, 200, 20000);
  lp.Q.value = 0.6;
  amp.connect(lp);

  // ---------- the pipes: one half-pitch oscillator (+ a vibrato copy for the chorus settings)
  const mix = track(ctx.createGain());
  const sources = [];
  const vibTargets = []; // detune AudioParams the scanner vibrato drives
  const allTargets = []; // ... and the rotary doppler drives
  const mkPipe = (level) => {
    const o = track(ctx.createOscillator());
    o.setPeriodicWave(wave);
    o.frequency.setValueAtTime(f0 / 2, time);
    o.connect(gain(level)).connect(mix);
    sources.push(o);
    allTargets.push(o.detune);
    return o;
  };
  const scan = P.scanner;
  const isChorus = scan[0] === "c";
  const depth = SCAN[scan] || 0;
  if (isChorus) {
    mkPipe(0.55);
    vibTargets.push(mkPipe(0.55).detune);
  } else {
    const o = mkPipe(1);
    if (depth > 0) vibTargets.push(o.detune);
  }

  // percussion: decaying 2nd / 3rd harmonic on the attack (through the vibrato too, like the console)
  if (P.perc !== "off" && P.percLevel > 0.001) {
    const h = P.perc === "3rd" ? 3 : 2;
    const po = track(ctx.createOscillator());
    po.type = "sine";
    po.frequency.setValueAtTime(f0 * h, time);
    const pg = track(ctx.createGain());
    const pk = Math.max(FLOOR, 0.9 * P.percLevel * Math.min(v, 1.4));
    pg.gain.setValueAtTime(0, time);
    pg.gain.linearRampToValueAtTime(pk, time + 0.002);
    pg.gain.exponentialRampToValueAtTime(FLOOR, time + 0.002 + Math.max(0.05, P.percDecay));
    po.connect(pg);
    pg.connect(mix);
    sources.push(po);
    allTargets.push(po.detune);
    if (depth > 0 && !isChorus) vibTargets.push(po.detune);
  }

  // vibrato LFO (phase-locked) -> detune of the vibrato pipe(s), in cents
  const lfo = (rate, phase, amount, targets) => {
    const l = track(lfoSource(ctx, time, rate, phase, stopAt));
    const lg = gain(amount);
    l.connect(lg);
    for (const t of targets) lg.connect(t);
    return lg;
  };
  if (depth > 0) lfo(SCAN_RATE, 0, depth, vibTargets);

  // key click: a few ms of band-passed noise at the press and a softer one at the release
  if (P.keyClick > 0.01) {
    const click = (t0, amp0) => {
      const n = track(ctx.createBufferSource());
      n.buffer = noiseBuf(ctx);
      const bp = track(ctx.createBiquadFilter());
      bp.type = "bandpass";
      bp.frequency.value = 2400;
      bp.Q.value = 0.9;
      const g = track(ctx.createGain());
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(amp0, t0 + 0.0008);
      g.gain.exponentialRampToValueAtTime(FLOOR, t0 + 0.012);
      g.gain.setValueAtTime(0, t0 + 0.013);
      n.connect(bp);
      bp.connect(g);
      g.connect(lp); // contact noise bypasses the (slow) amp envelope
      n.start(t0, Math.random() * 0.3);
      n.stop(t0 + 0.02);
    };
    const ck = CLICK * P.keyClick * Math.min(v, 1.4);
    click(time, ck);
    click(time + gate, ck * 0.45);
  }
  mix.connect(amp);

  // ---------- tone filter -> drive -> rotary -> safety clip
  let tail = lp;
  if (P.drive > 0.01) {
    // the curve's small-signal gain is ~k; the make-up keeps the clean level steady so DRIVE adds
    // grit, not volume (it used to double the level the moment it left 0)
    const k = 1 + P.drive * 9;
    const sh = track(ctx.createWaveShaper());
    sh.curve = driveCurve(P.drive);
    sh.oversample = "2x";
    const dc = track(ctx.createBiquadFilter()); // the asymmetric curve makes DC: block it
    dc.type = "highpass";
    dc.frequency.value = 20;
    tail.connect(sh);
    sh.connect(dc);
    tail = dc.connect(gain(Math.pow(k, -0.8)));
  }
  if (P.rotary !== "off" && P.rotaryDepth > 0.01) {
    const [hr, dr] = ROT[P.rotary];
    const d = P.rotaryDepth;
    const out = gain(Math.SQRT2); // equal-power panners sit -3 dB per side at centre: make it up
    // Linkwitz-Riley style split (Q 0.5, horn inverted) sums flat when the rotors stand still
    const band = (type, polarity, rate, amDepth, panDepth) => {
      const f = track(ctx.createBiquadFilter());
      f.type = type;
      f.frequency.value = XOVER;
      f.Q.value = 0.5;
      const am = gain(polarity * (1 - amDepth));
      const pan = track(ctx.createStereoPanner());
      tail.connect(f).connect(am).connect(pan).connect(out);
      lfo(rate, 0, polarity * amDepth, [am.gain]);
      lfo(rate, 0.25, panDepth, [pan.pan]);
    };
    band("highpass", -1, hr, d * 0.35, d * 0.7); // horn
    band("lowpass", 1, dr, d * 0.2, d * 0.35); // drum
    // horn doppler: a quarter cycle ahead of the horn's loudness, in cents
    lfo(hr, 0.25, d * (P.rotary === "fast" ? 7 : 11), allTargets);
    tail = out;
  }
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  tail.connect(clip);
  clip.connect(dest);

  for (const s of sources) {
    s.start(time);
    s.stop(stopAt);
  }
  const cleanup = () => {
    for (const n of nodes) {
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    }
  };
  sources[0].onended = cleanup;
}

// JS model for the panel scope: the nine drawbars summed at A3 (sub-pitch 110 Hz), 0.4 s at 40 kHz
function organScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  let e = 0;
  const amps = BARS.map((b) => {
    const a = barAmp(Math.round(P[b.key]));
    e += a * a;
    return a;
  });
  const sc = e > 0 ? 0.7 / Math.sqrt(e) : 0;
  const f = 110;
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    let y = 0;
    for (let k = 0; k < 9; k++) y += amps[k] * Math.sin(2 * Math.PI * f * BARS[k].harm * t);
    out[i] = Math.tanh(y * sc * 1.1);
  }
  return out;
}

const svg = {
  off: '<path d="M4 12 H20"/>',
  v: '<path d="M2 12 C5 4 8 4 11 12 S17 20 22 12"/>',
  c: '<path d="M2 9 C5 3 8 3 11 9 S17 15 22 9 M2 16 C5 10 8 10 11 16 S17 22 22 16"/>',
  slow: '<circle cx="12" cy="12" r="7"/><path d="M12 12 L12 6"/>',
  fast: '<circle cx="12" cy="12" r="7"/><path d="M12 12 L17 9 M12 12 L7 15"/>',
  p2: '<path d="M2 18 C4 4 10 4 12 18 C14 4 20 4 22 18"/>',
  p3: '<path d="M2 18 C3 6 6 6 8 18 C9 6 12 6 14 18 C15 6 18 6 20 18"/>',
};

const bars = (label, ...items) => ({ type: "row", items: items.map(([key, lab]) => ({ type: "fader", key, label: lab, fmt: "int", rand: true })), label });

// ---- presets as data: "drawbars(9 digits) token token ..." expanded by a tiny helper.
// tokens: p0/p2/p3 percussion off/2nd/3rd, v0 scanner off, v1-v3 / c1-c3 scanner, ro/rs/rf rotary
// off/slow/fast, and number keys: pd perc decay, pl perc level, k key click, rd rotary depth,
// t tone (Hz), d drive, a attack, rl release, l level.
const PK = { pd: "percDecay", pl: "percLevel", k: "keyClick", rd: "rotaryDepth", t: "cutoff", d: "drive", a: "attack", rl: "release", l: "level" };
const RK = { ro: "off", rs: "slow", rf: "fast" };
function reg(spec) {
  const p = {};
  for (const tok of spec.split(" ")) {
    const [, k, n] = /^([a-z]*)([\d.]*)$/.exec(tok);
    if (!k) BARS.forEach((b, i) => (p[b.key] = +n[i]));
    else if (k === "p") p.perc = n === "0" ? "off" : n === "2" ? "2nd" : "3rd";
    else if (k === "v" || k === "c") p.scanner = n === "0" ? "off" : k + n;
    else if (RK[k]) p.rotary = RK[k];
    else p[PK[k]] = +n;
  }
  return p;
}
const BANK = {
  Ballad: [
    ["Procession 68 8600", "688600000 c3 rs rd.6 t7000 d.12 a.01 rl.25"],
    ["Velvet Ballad 80 0800", "800800000 c3 rs rd.5 t4500 d0 k.2 a.012 rl.3"],
    ["Warm Pad 86 8600", "868600000 c2 rs rd.45 t5500 d.05 k.1 a.04 rl.5"],
    ["Sunday Soul 84 8500", "848500000 c3 rs rd.65 t7500 d.18 k.35"],
    ["Glass Chorus 00 4664", "004664000 c1 rs rd.4 t6000 d0 k.15 a.02 rl.35 l.85"],
  ],
  Jazz: [
    ["Jimmy Smith", "888000000 p3 pd.14 pl.8 k.5 c3 rf rd.55 t8500 d.35"],
    ["Trio Comping 83 8000", "838000000 p3 pd.18 pl.6 k.4 c3 rs rd.5 t7000 d.18"],
    ["Bebop Lines 88 8400", "888400000 p2 pd.12 pl.7 k.6 v3 ro t9000 d.25"],
    ["Smoke Room 80 8000 008", "808000008 c3 rs rd.55 t6000 d.1 k.3"],
    ["Soul Jazz 8' + Perc", "008000000 p3 pd.16 pl.9 k.45 c3 rs rd.5 t8000 d.15"],
    ["Swing Shuffle 88 6600", "886600000 p2 pd.2 pl.5 k.4 c2 rf rd.45 t8500 d.25"],
    ["Hard Bop Scream", "888000008 c3 rf rd.7 t11000 d.55 k.5"],
  ],
  Gospel: [
    ["Gospel Full", "888888888 p0 k.4 v2 rs rd.7 t7500 d.3"],
    ["Praise Shout 88 8800", "888800000 c3 rf rd.65 t9000 d.4 k.5"],
    ["Testify 80 0008 888", "800008888 c3 rs rd.6 t8000 d.25 k.4"],
    ["Altar Call 86 8600 008", "868600008 c3 rs rd.7 t6500 d.15 k.25 a.02 rl.3"],
    ["Choir Stabs", "888800008 p2 pd.12 pl.6 k.55 c3 rf rd.6 t9000 d.35 rl.08"],
    ["Hallelujah Climb", "888888000 c3 rf rd.8 t10000 d.45 k.5"],
    ["Deacon Slow Burn", "878600004 c3 rs rd.65 t7000 d.3 k.35"],
  ],
  Rock: [
    ["Rock Overdrive", "808000005 p0 k.35 c1 rf rd.4 t10000 d.85"],
    ["Highway Growl 88 8000", "888000000 v0 rf rd.6 t11000 d.8 k.5"],
    ["Prog Wall 88 8800", "888800000 v0 rs rd.5 t9000 d.9 k.4"],
    ["Screaming Full Organ", "888888888 c3 rf rd.8 t9000 d.95 k.45"],
    ["Blues Rock Perc", "868000000 p3 pd.2 pl.7 k.5 v0 rf rd.5 t10000 d.6"],
    ["Garage Grit 80 8808", "808808000 v1 ro t7500 d.7 k.6"],
    ["Psych Swirl 00 8888", "008888000 c3 rs rd.9 t8000 d.4 k.3"],
  ],
  Combo: [
    ["Reggae Bubble", "008800000 p2 pd.08 pl.7 k.6 v0 ro t6000 d.15 a.002 rl.04"],
    ["Ska Upstroke", "008800808 p3 pd.07 pl.6 k.7 v0 ro t8000 d.2 a.002 rl.03"],
    ["Dub Bubble 00 6800", "006800000 p0 k.5 v0 ro t3500 d.1 a.002 rl.03"],
    ["Transistor Combo", "008888800 v3 ro t14000 d.35 k.15"],
    ["Mod Combo 00 8686 868", "008686868 v1 ro t15000 d.2 k.1"],
    ["Fairground Calliope", "008888888 v3 ro t12000 d.15 k.2 a.006"],
  ],
  Church: [
    ["Church Pipes", "807605030 p0 k.1 v0 ro t6000 d0 a.03 rl.4"],
    ["Full Organ Plenum", "888888888 v0 ro t7000 d0 k.05 a.05 rl.9"],
    ["Principal Chorus 8-4-2", "008808000 v0 ro t5500 d0 k.05 a.04 rl.6"],
    ["Cornet Solo", "008888800 v0 ro t5000 d0 k.05 a.04 rl.6"],
    ["Quiet Evensong", "406400000 v0 ro t3500 d0 k.03 a.06 rl.8"],
    ["Celeste 00 8600", "008600000 c1 ro t4000 d0 k.03 a.08 rl.9"],
  ],
  Orchestral: [
    ["Mellow Flute", "008400000 p0 k.15 v0 ro t4500 d0"],
    ["Whistle & Reed", "006008640 p3 pd.1 pl.4 k.3 v3 ro t9500 d.1"],
    ["Tibia 00 8000", "008000000 v3 ro t3500 d0 k.1 a.015 rl.25"],
    ["Clarinet 00 8080 800", "008080800 v1 ro t5000 d0 k.1 a.02"],
    ["Piccolo 00 0806", "000806000 v2 ro t9000 d0 k.15 a.01"],
    ["Oboe 00 4685 300", "004685300 v1 ro t6000 d.05 k.1 a.015"],
    ["Strings 00 2465 432", "002465432 c2 ro t7000 d0 k0 a.06 rl.4"],
    ["French Horn 00 8740", "008740000 v1 ro t2500 d.05 k.05 a.03 rl.2"],
    ["Trumpet 00 6876 540", "006876540 v1 ro t9000 d.15 k.1 a.015"],
  ],
  "Perc Keys": [
    ["Percussion Marimba", "000000000 p2 pd.35 pl1 k.2 v0 ro t6000 d0 l1.5"],
    ["Percussion Chime", "000000000 p3 pd.9 pl1 k.1 c1 rs rd.3 t9000 d0 l1.3"],
    ["Toy Bells 1' + Perc", "000000008 p3 pd.5 pl.7 k.15 v0 ro t12000 d0 rl.3"],
    ["Jazz Stab", "888000000 p3 pd.1 pl.9 k.7 c3 rf rd.5 t9000 d.3 rl.03"],
    ["Funk Chop 80 8800", "808800000 p3 pd.08 pl.8 k.8 v0 ro t7000 d.4 a.002 rl.02"],
    ["Soft Perc Keys", "008400000 p2 pd.5 pl.7 k.25 c3 rs rd.4 t6500 d.05 rl.2"],
  ],
  Bass: [
    ["Walking Bass 80 8000", "808000000 p2 pd.12 pl.5 k.4 v0 ro t2500 d.1 rl.05"],
    ["Resultant Pedal 32'", "880000000 v0 ro t1200 d0 k.05 a.03 rl.4"],
    ["Sub Bass 16'", "800000000 v0 ro t2000 d0 k.3 rl.06"],
    ["Driven Bass 86 8000", "868000000 p2 pd.1 pl.4 k.5 v0 ro t3000 d.6 rl.06"],
  ],
};
const PRESETS = [{ name: "Init (40 8604 000)", cat: "Ballad", params: {} }];
for (const cat in BANK) for (const [name, spec] of BANK[cat]) PRESETS.push({ name, cat, params: reg(spec) });

const tonewheel = {
  name: "Cathedral",
  tagline: "Drawbar tonewheel organ - nine drawbars, key click, percussion, scanner vibrato/chorus and rotary speaker",
  color: "#c98a3d",
  params: paramDefs,
  voice: organVoice,
  scope: organScope,
  lines: [
    { name: "Gospel Chords (C F G)", dsl: "0:C3:14 0:E3:14 0:G3:14 0:C4:14 16:F3:14 16:A3:14 16:C4:14 16:F4:14 32:G3:14 32:B3:14 32:D4:14 32:G4:14 48:C3:12 48:E3:12 48:G3:12 48:C4:12 60:D4:2:90 62:E4:2:90" },
    { name: "Blues Walk (A)", dsl: "0:A2:2 2:A3:1:90 4:C#3:2 6:E3:2 8:A3:2 10:G#3:1:90 11:G3:2 14:E3:1 16:D3:2 18:D4:1:90 20:F#3:2 22:A3:2 24:D4:2 26:C#4:1:90 27:C4:2 30:A3:1 32:E3:2 34:E4:1:90 36:G#3:2 38:B3:2 40:E4:2 42:D4:1:90 43:C#4:2 46:B3:1 48:A2:4 52:E3:4 56:A3:6" },
    { name: "Reggae Bubble (Dm)", dsl: "2:D3:1 2:F3:1 2:A3:1 6:D3:1 6:F3:1 6:A3:1 10:D3:1 10:F3:1 10:A3:1 14:D3:1 14:F3:1 14:A3:1 18:G2:1 18:Bb3:1 18:D4:1 22:G2:1 22:Bb3:1 22:D4:1 26:A2:1 26:C#4:1 26:E4:1 30:A2:1 30:C#4:1 30:E4:1" },
    { name: "Church Hold (Cm)", dsl: "0:C2:32 0:G3:32 0:Eb4:32 0:C5:32 32:Ab2:32 32:Eb4:32 32:C5:32 32:Ab4:32" },
    { name: "Jazz ii-V-I (Bb)", dsl: "0:Eb3:6 0:G3:6 0:Bb3:6 0:D4:6 7:Eb3:2:90 7:G3:2:90 7:Bb3:2:90 7:D4:2:90 16:Eb3:6 16:A3:6 16:D4:6 23:Eb3:2:90 23:A3:2:90 23:D4:2:90 32:D3:14 32:F3:14 32:A3:14 32:C4:14 48:F4:2 50:G4:2 52:A4:3 56:C5:6" },
    { name: "Rock Riff (E)", dsl: "0:E3:3 0:B3:3 0:E4:3 4:E3:2 4:B3:2 4:E4:2 8:G3:3 8:D4:3 8:G4:3 12:A3:4 12:E4:4 12:A4:4 16:E3:3 16:B3:3 16:E4:3 20:E3:2 20:B3:2 20:E4:2 24:D4:2:100 24:A4:2:100 26:C#4:2 26:G#4:2 28:A3:4 28:E4:4 28:A4:4 32:E3:3 32:B3:3 32:E4:3 36:E3:2 36:B3:2 36:E4:2 40:G3:3 40:D4:3 40:G4:3 44:A3:4 44:E4:4 44:A4:4 48:C4:6 48:G4:6 48:C5:6 56:D4:8 56:A4:8 56:D5:8" },
  ],
  presets: PRESETS,
  live: { hold: 30 }, // organs sustain: a held key keeps sounding for 30 s
  ui: {
    theme: { accent: "#c98a3d", lcd: "#ffd9a0", lcdBg: "#241a0e", edge: "#463018", bg: "#1b140c" },
    logo: ["", "Cathedral"],
    sub: "DRAWBAR ORGAN",
    cc: { 74: "cutoff", 71: "drive", 73: "keyClick", 72: "release", 75: "percDecay", 76: "percLevel", 77: "rotaryDepth", 7: "level" },
    sections: [
      {
        title: "DRAWBARS  16' 5⅓' 8' 4' 2⅔' 2' 1⅗' 1⅓' 1'",
        cls: "tw-bars",
        items: [
          bars(
            "bars",
            ["d16", "16'"],
            ["d513", "5⅓'"],
            ["d8", "8'"],
            ["d4", "4'"],
            ["d223", "2⅔'"],
            ["d2", "2'"],
            ["d135", "1⅗'"],
            ["d113", "1⅓'"],
            ["d1", "1'"],
          ),
        ],
      },
      {
        title: "PERCUSSION",
        cls: "tw-perc",
        items: [
          {
            type: "radio",
            key: "perc",
            cls: "wave-btns",
            options: [
              ["off", "OFF", svg.off, "0 0 24 24"],
              ["2nd", "2ND", svg.p2, "0 0 24 24"],
              ["3rd", "3RD", svg.p3, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "percDecay", label: "DECAY", fmt: "num2" },
              { type: "knob", key: "percLevel", label: "LEVEL", fmt: "pct" },
              { type: "knob", key: "keyClick", label: "CLICK", fmt: "pct" },
            ],
          },
        ],
      },
      {
        title: "SCANNER · ROTARY",
        cls: "tw-mod",
        items: [
          {
            type: "radio",
            key: "scanner",
            cls: "wave-btns",
            options: [
              ["off", "OFF", svg.off, "0 0 24 24"],
              ["v1", "V1", svg.v, "0 0 24 24"],
              ["v2", "V2", svg.v, "0 0 24 24"],
              ["v3", "V3", svg.v, "0 0 24 24"],
              ["c1", "C1", svg.c, "0 0 24 24"],
              ["c2", "C2", svg.c, "0 0 24 24"],
              ["c3", "C3", svg.c, "0 0 24 24"],
            ],
          },
          {
            type: "radio",
            key: "rotary",
            cls: "wave-btns",
            options: [
              ["off", "ROT OFF", svg.off, "0 0 24 24"],
              ["slow", "SLOW", svg.slow, "0 0 24 24"],
              ["fast", "FAST", svg.fast, "0 0 24 24"],
            ],
          },
          { type: "row", items: [{ type: "knob", key: "rotaryDepth", label: "ROT DEPTH", fmt: "pct" }] },
        ],
      },
      {
        title: "TONE · DRIVE",
        cls: "tw-tone",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "cutoff", label: "TONE", curve: "log", fmt: "hz", big: true },
              { type: "knob", key: "drive", label: "DRIVE", fmt: "pct", big: true },
            ],
          },
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "ATT", fmt: "ms" },
              { type: "fader", key: "release", label: "REL", fmt: "ms" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-tonewheel" },
        ],
      },
    ],
    scopeLabel: "WAVEFORM · A3",
  },
};

export const TONEWHEEL_SYNTHS = { tonewheel };

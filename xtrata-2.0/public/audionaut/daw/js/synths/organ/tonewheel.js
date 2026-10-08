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
const GAIN = 0.13; // master voice scale (calibrated against the harness RMS band)

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

// ---- PeriodicWave cache (immutable per ctx+drawbar setting; the only cross-note state)
const waveCache = new WeakMap();
function drawbarWave(ctx, P) {
  let m = waveCache.get(ctx);
  if (!m) {
    m = new Map();
    waveCache.set(ctx, m);
  }
  const key = BARS.map((b) => Math.round(P[b.key])).join("");
  let w = m.get(key);
  if (!w) {
    const re = new Float32Array(17);
    const im = new Float32Array(17);
    let e = 0;
    for (const b of BARS) {
      const a = barAmp(Math.round(P[b.key]));
      im[b.harm] += a; // sine phase
      e += a * a;
    }
    const scale = e > 0 ? 0.7 / Math.sqrt(e) : 0; // constant loudness whatever the registration
    for (let i = 0; i < 17; i++) im[i] *= scale;
    w = ctx.createPeriodicWave(re, im, { disableNormalization: true });
    if (m.size > 64) m.clear();
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
const ROT = { slow: 0.8, fast: 6.7 };

function organVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);
  const A = Math.max(0.002, P.attack);
  const R = Math.max(0.01, P.release);
  const stopAt = time + gate + R + 0.08;
  const wave = drawbarWave(ctx, P);

  const nodes = [];
  const track = (n) => {
    nodes.push(n);
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
  const detuneTargets = []; // AudioParams the vibrato / rotary doppler LFOs drive
  const mkPipe = (level) => {
    const o = ctx.createOscillator();
    o.setPeriodicWave(wave);
    o.frequency.setValueAtTime(f0 / 2, time);
    const og = ctx.createGain();
    og.gain.value = level;
    o.connect(og);
    og.connect(mix);
    sources.push(o);
    track(o);
    track(og);
    return o;
  };
  const scan = P.scanner;
  const isChorus = scan[0] === "c";
  const depth = SCAN[scan] || 0;
  let dry = null;
  if (isChorus) {
    dry = mkPipe(0.55);
    const vibPipe = mkPipe(0.55);
    detuneTargets.push(vibPipe.detune);
  } else {
    const o = mkPipe(1);
    if (depth > 0) detuneTargets.push(o.detune);
    dry = o;
  }

  // vibrato LFO (phase-locked) -> detune of the vibrato pipe(s), in cents
  const lfos = [];
  if (depth > 0) {
    const l = lfoSource(ctx, time, SCAN_RATE, 0, stopAt);
    const lg = track(ctx.createGain());
    lg.gain.value = depth;
    l.connect(lg);
    for (const d of detuneTargets) lg.connect(d);
    lfos.push(l);
    track(l);
  }

  // percussion: decaying harmonic on the attack
  if (P.perc !== "off" && P.percLevel > 0.001) {
    const h = P.perc === "3rd" ? 3 : 2;
    const po = ctx.createOscillator();
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
    track(po);
    detuneTargets.push(po.detune);
  }

  // key click: a few ms of band-passed noise at the press and a softer one at the release
  if (P.keyClick > 0.01) {
    const click = (t0, amp0) => {
      const n = ctx.createBufferSource();
      n.buffer = noiseBuf(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2400;
      bp.Q.value = 0.9;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(amp0, t0 + 0.0008);
      g.gain.exponentialRampToValueAtTime(FLOOR, t0 + 0.012);
      g.gain.setValueAtTime(0, t0 + 0.013);
      n.connect(bp);
      bp.connect(g);
      g.connect(lp); // contact noise bypasses the (slow) amp envelope
      n.start(t0, Math.random() * 0.3);
      n.stop(t0 + 0.02);
      sources.push(n);
      track(n);
      track(bp);
      track(g);
    };
    const ck = 0.5 * P.keyClick * Math.min(v, 1.4);
    click(time, ck);
    click(time + gate, ck * 0.45);
  }
  mix.connect(amp);

  // ---------- tone filter -> drive -> rotary -> safety clip
  let tail = lp;
  if (P.drive > 0.01) {
    const sh = track(ctx.createWaveShaper());
    sh.curve = driveCurve(P.drive);
    sh.oversample = "2x";
    const cmp = track(ctx.createGain());
    cmp.gain.value = 1 / (1 + 1.2 * P.drive);
    tail.connect(sh);
    sh.connect(cmp);
    tail = cmp;
  }
  if (P.rotary !== "off" && P.rotaryDepth > 0.01) {
    const rate = ROT[P.rotary];
    const d = P.rotaryDepth;
    // amplitude wobble
    const am = track(ctx.createGain());
    am.gain.value = 1 - d * 0.35;
    const l1 = lfoSource(ctx, time, rate, 0, stopAt);
    const l1g = track(ctx.createGain());
    l1g.gain.value = d * 0.35;
    l1.connect(l1g);
    l1g.connect(am.gain);
    tail.connect(am);
    tail = am;
    lfos.push(l1);
    track(l1);
    // doppler wobble: a quarter cycle apart, in cents
    const l2 = lfoSource(ctx, time, rate, 0.25, stopAt);
    const l2g = track(ctx.createGain());
    l2g.gain.value = d * (P.rotary === "fast" ? 7 : 11);
    l2.connect(l2g);
    for (const t of detuneTargets) l2g.connect(t);
    lfos.push(l2);
    track(l2);
  }
  const clip = track(ctx.createWaveShaper());
  clip.curve = safetyCurve();
  tail.connect(clip);
  clip.connect(dest);

  for (const s of sources) {
    if (!s.buffer) s.start(time);
    if (!s.buffer) s.stop(stopAt);
  }
  const first = sources[0];
  const cleanup = () => {
    try {
      for (const n of nodes) n.disconnect();
    } catch {
      /* already disconnected */
    }
  };
  if (first) first.onended = cleanup;
  else cleanup();
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
  ],
  presets: [
    { name: "Init (40 8604 000)", params: {} },
    { name: "Jimmy Smith", params: { d16: 8, d513: 8, d8: 8, d4: 0, d223: 0, d2: 0, d135: 0, d113: 0, d1: 0, perc: "3rd", percDecay: 0.14, percLevel: 0.8, keyClick: 0.5, scanner: "c3", rotary: "fast", rotaryDepth: 0.55, cutoff: 8500, drive: 0.35 } },
    { name: "Gospel Full", params: { d16: 8, d513: 8, d8: 8, d4: 8, d223: 8, d2: 8, d135: 8, d113: 8, d1: 8, perc: "off", keyClick: 0.4, scanner: "v2", rotary: "slow", rotaryDepth: 0.7, cutoff: 7500, drive: 0.3 } },
    { name: "Mellow Flute", params: { d16: 0, d513: 0, d8: 8, d4: 4, d223: 0, d2: 0, d135: 0, d113: 0, d1: 0, perc: "off", keyClick: 0.15, scanner: "off", rotary: "off", cutoff: 4500, drive: 0 } },
    { name: "Reggae Bubble", params: { d16: 0, d513: 0, d8: 8, d4: 8, d223: 0, d2: 0, d135: 0, d113: 0, d1: 0, perc: "2nd", percDecay: 0.08, percLevel: 0.7, keyClick: 0.6, scanner: "off", rotary: "off", cutoff: 6000, drive: 0.15, attack: 0.002, release: 0.04 } },
    { name: "Rock Overdrive", params: { d16: 8, d513: 0, d8: 8, d4: 0, d223: 0, d2: 0, d135: 0, d113: 0, d1: 5, perc: "off", keyClick: 0.35, scanner: "c1", rotary: "fast", rotaryDepth: 0.4, cutoff: 10000, drive: 0.85 } },
    { name: "Church Pipes", params: { d16: 8, d513: 0, d8: 7, d4: 6, d223: 0, d2: 5, d135: 0, d113: 3, d1: 0, perc: "off", keyClick: 0.1, scanner: "off", rotary: "off", cutoff: 6000, drive: 0, attack: 0.03, release: 0.4 } },
    { name: "Whistle & Reed", params: { d16: 0, d513: 0, d8: 6, d4: 0, d223: 0, d2: 8, d135: 6, d113: 4, d1: 0, perc: "3rd", percDecay: 0.1, percLevel: 0.4, keyClick: 0.3, scanner: "v3", rotary: "off", cutoff: 9500, drive: 0.1 } },
  ],
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

// synths/pad/ensemble.js — jiENSEMBLE: string machine / pad / choir (Audionaut synth module).
//
// The classic 70s "string machine" recipe, built for one-shot Audionaut notes:
//   * three REGISTERS (16' / 8' / 4') of detuned sawtooth (or square / triangle) voices
//   * a resonant low-pass whose cutoff swells open over the note (the "bow" opening)
//   * the signature three-phase ENSEMBLE: three delay lines modulated by one slow LFO at
//     0 / 120 / 240 degrees, summed with the dry signal (BBD-style chorus) + a faster vibrato
//   * three TONES: STRINGS (bright, thin-edged), PAD (extra centre voice, slower sweep feel),
//     CHOIR (the filtered sum is pushed through parallel vowel formants)
// LFOs are looped table players started at a phase derived from the absolute note time, so
// every note of a chord (and every later note) shares the same ensemble phase - they move together
// like a real instrument, instead of each note wobbling on its own.
// Per-note node graph (<= ~40 nodes), fully self-cleaning. Plain ES module, no imports.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001;
const GAIN = 0.62; // master voice scale (calibrated against the harness RMS band)
const DELAY_BASE = 0.0125; // centre delay of each ensemble tap (s)
const DELAY_SWING = 0.0035; // max delay modulation at depth 1 (s)

// ---- shared LFO table: one sine cycle in exactly one second, looped; cache is per context only
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
// a free-running LFO at `rate` Hz whose phase is locked to absolute time (+ a fixed phase offset)
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

// soft safety clip: |y| <= tanh(1) ~ 0.76, nearly linear for small signals
let clipCurve = null;
function safetyCurve() {
  if (!clipCurve) {
    const n = 513;
    clipCurve = new Float32Array(n);
    for (let i = 0; i < n; i++) clipCurve[i] = Math.tanh((i * 2) / (n - 1) - 1);
  }
  return clipCurve;
}

// vowel formants (F1, F2, F3 in Hz and relative gains) - rough sung-vowel values
const VOWELS = {
  ah: [[800, 1.0], [1150, 0.55], [2800, 0.25]],
  oh: [[450, 1.0], [800, 0.45], [2830, 0.15]],
  ee: [[300, 1.0], [2300, 0.5], [3000, 0.3]],
  oo: [[325, 1.0], [700, 0.35], [2700, 0.1]],
};

// Amp envelope maths shared by voice() and scope(): level (0..1 of top) of the A-D-S curve at time t.
function ampShape(t, A, D, sus) {
  if (t <= 0) return 0;
  if (t < A) return t / A;
  if (t < A + D) return 1 + (sus - 1) * ((t - A) / D);
  return sus;
}

const paramDefs = [
  { key: "tone", label: "Tone", type: "select", def: "strings", options: ["strings", "pad", "choir"] },
  { key: "wave", label: "Wave", type: "select", def: "sawtooth", options: ["sawtooth", "square", "triangle"] },
  { key: "reg16", label: "16' Register", type: "range", min: 0, max: 1, step: 0.01, def: 0.45 },
  { key: "reg8", label: "8' Register", type: "range", min: 0, max: 1, step: 0.01, def: 1 },
  { key: "reg4", label: "4' Register", type: "range", min: 0, max: 1, step: 0.01, def: 0.55 },
  { key: "detune", label: "Detune (cents)", type: "range", min: 0, max: 40, step: 0.5, def: 11 },
  { key: "cutoff", label: "Cutoff", type: "range", min: 200, max: 12000, step: 10, def: 3200 },
  { key: "reso", label: "Resonance", type: "range", min: 0, max: 12, step: 0.1, def: 1.2 },
  { key: "sweep", label: "Sweep Amount", type: "range", min: 0, max: 8000, step: 10, def: 2200 },
  { key: "sweepIn", label: "Sweep In", type: "range", min: 0.02, max: 4, step: 0.01, def: 0.9 },
  { key: "sweepOut", label: "Sweep Settle", type: "range", min: 0.05, max: 6, step: 0.01, def: 2.2 },
  { key: "vowel", label: "Choir Vowel", type: "select", def: "ah", options: ["ah", "oh", "ee", "oo"] },
  { key: "ensemble", label: "Ensemble Depth", type: "range", min: 0, max: 1, step: 0.01, def: 0.75 },
  { key: "ensRate", label: "Ensemble Rate (Hz)", type: "range", min: 0.1, max: 2.5, step: 0.01, def: 0.62 },
  { key: "vibrato", label: "Vibrato (cents)", type: "range", min: 0, max: 40, step: 0.5, def: 5 },
  { key: "vibRate", label: "Vibrato Rate (Hz)", type: "range", min: 2, max: 9, step: 0.1, def: 5.4 },
  { key: "attack", label: "Attack", type: "range", min: 0.005, max: 4, step: 0.005, def: 0.45 },
  { key: "decay", label: "Decay", type: "range", min: 0.01, max: 4, step: 0.01, def: 0.8 },
  { key: "sustain", label: "Sustain", type: "range", min: 0, max: 1, step: 0.01, def: 0.85 },
  { key: "release", label: "Release", type: "range", min: 0.02, max: 6, step: 0.01, def: 1.1 },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

function ensembleVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);

  // a very short note still reaches full level: the swell is compressed to fit gates under a quarter second
  const A = gate < 0.25 ? Math.min(Math.max(0.005, P.attack), gate * 0.8) : Math.max(0.005, P.attack);
  const D = Math.max(0.01, P.decay);
  const R = Math.max(0.02, P.release);
  const sus = clamp(P.sustain, 0, 1);
  const stopAt = time + gate + R + 0.1;

  // ---------- amp envelope: linear swell (bow), settle to sustain, exponential release from wherever the gate ends
  const amp = ctx.createGain();
  const top = Math.max(FLOOR, v * GAIN * P.level);
  const g = amp.gain;
  g.setValueAtTime(0, time);
  if (gate <= A) {
    g.linearRampToValueAtTime(top * ampShape(gate, A, D, sus), time + gate);
  } else {
    g.linearRampToValueAtTime(top, time + A);
    if (gate <= A + D) g.linearRampToValueAtTime(top * ampShape(gate, A, D, sus), time + gate);
    else {
      g.linearRampToValueAtTime(Math.max(FLOOR, top * sus), time + A + D);
    }
  }
  const lvlAtGate = Math.max(FLOOR, top * ampShape(gate, A, D, sus));
  g.setValueAtTime(lvlAtGate, time + gate);
  g.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  g.setValueAtTime(0, time + gate + R + 0.001);

  // ---------- oscillators: registers x two detuned voices (PAD adds a centre voice)
  const mix = ctx.createGain();
  const regs = [
    [0.5, P.reg16],
    [1, P.reg8],
    [2, P.reg4],
  ].filter(([, lv]) => lv > 0.005);
  const type = ["sawtooth", "square", "triangle"].includes(P.wave) ? P.wave : "sawtooth";
  const pad = P.tone === "pad";
  const spread = pad ? [-0.75, 0, 0.75] : [-0.5, 0.5];
  const oscs = [];
  let norm = 0;
  for (const [, lv] of regs) norm += lv;
  norm = norm > 0 ? 1 / Math.max(1, norm) : 0;
  // a square carries ~ -3 dB more power than a saw of the same amplitude; triangle far less
  const waveTrim = type === "square" ? 0.8 : type === "triangle" ? 1.6 : 1;
  for (const [mult, lv] of regs) {
    const voices = spread.length;
    for (let k = 0; k < voices; k++) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f0 * mult, time);
      o.detune.setValueAtTime(spread[k] * P.detune * 2, time);
      const og = ctx.createGain();
      og.gain.value = (lv * norm * waveTrim) / voices;
      o.connect(og);
      og.connect(mix);
      oscs.push({ o, og });
    }
  }

  // vibrato: one time-locked LFO scaled to cents, into every oscillator's detune
  const lfos = [];
  let vibGain = null;
  if (P.vibrato > 0.01) {
    const vl = lfoSource(ctx, time, P.vibRate, 0, stopAt);
    vibGain = ctx.createGain();
    vibGain.gain.value = P.vibrato;
    vl.connect(vibGain);
    for (const { o } of oscs) vibGain.connect(o.detune);
    lfos.push(vl);
  }

  // ---------- filter: cutoff swells base -> base+sweep over sweepIn, settles back over sweepOut
  const vb = 0.75 + 0.25 * Math.min(v, 1.4); // harder = a touch brighter
  const base = clamp(P.cutoff, 60, 16000);
  const peak = clamp(base + P.sweep * vb, base, 18000);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = P.reso;
  lp.frequency.setValueAtTime(base, time);
  if (peak > base * 1.001) {
    const t1 = time + Math.max(0.02, P.sweepIn);
    lp.frequency.exponentialRampToValueAtTime(peak, t1);
    lp.frequency.exponentialRampToValueAtTime(clamp(base + (peak - base) * 0.35, base, 18000), t1 + Math.max(0.05, P.sweepOut));
  }
  mix.connect(lp);

  // ---------- CHOIR: parallel vowel formants; otherwise straight through
  const body = ctx.createGain();
  const fmts = [];
  if (P.tone === "choir") {
    const vow = VOWELS[P.vowel] || VOWELS.ah;
    for (const [fc, fg] of vow) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = fc;
      bp.Q.value = 7;
      const bg = ctx.createGain();
      bg.gain.value = fg * 2.6;
      lp.connect(bp);
      bp.connect(bg);
      bg.connect(body);
      fmts.push(bp, bg);
    }
  } else {
    lp.connect(body);
  }
  body.connect(amp);

  // ---------- ensemble: dry + three delay taps modulated 120 degrees apart
  const clip = ctx.createWaveShaper();
  clip.curve = safetyCurve();
  const out = ctx.createGain();
  const taps = [];
  if (P.ensemble > 0.005) {
    const dry = ctx.createGain();
    dry.gain.value = 0.55;
    amp.connect(dry);
    dry.connect(out);
    taps.push(dry);
    for (let k = 0; k < 3; k++) {
      const d = ctx.createDelay(0.05);
      d.delayTime.value = DELAY_BASE;
      const lf = lfoSource(ctx, time, P.ensRate, k / 3, stopAt);
      const lg = ctx.createGain();
      lg.gain.value = DELAY_SWING * P.ensemble;
      lf.connect(lg);
      lg.connect(d.delayTime);
      const wg = ctx.createGain();
      wg.gain.value = 0.3 * (0.5 + 0.5 * P.ensemble);
      amp.connect(d);
      d.connect(wg);
      wg.connect(out);
      lfos.push(lf);
      taps.push(d, lg, wg);
    }
  } else {
    amp.connect(out);
  }
  out.connect(clip);
  clip.connect(dest);

  for (const { o } of oscs) {
    o.start(time);
    o.stop(stopAt);
  }
  const first = oscs[0] ? oscs[0].o : lfos[0];
  const cleanup = () => {
    try {
      clip.disconnect();
      out.disconnect();
      amp.disconnect();
      body.disconnect();
      lp.disconnect();
      mix.disconnect();
      if (vibGain) vibGain.disconnect();
      for (const { o, og } of oscs) {
        o.disconnect();
        og.disconnect();
      }
      for (const n of taps) n.disconnect();
      for (const n of fmts) n.disconnect();
      for (const l of lfos) l.disconnect();
    } catch {
      /* already disconnected */
    }
  };
  if (first) first.onended = cleanup;
  else cleanup();
}

// JS model for the panel scope: A3, the 8'+4'+16' saw sum through a one-pole low-pass at the
// settled cutoff, shown as a short 0.4 s window starting after the swell (approximate by design).
function ensembleScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const f0 = 220;
  const regs = [[0.5, P.reg16], [1, P.reg8], [2, P.reg4]];
  const ph = regs.map(() => [Math.random() * 0, 0.25, 0.6]);
  const dm = Math.pow(2, P.detune / 1200);
  const fc = clamp(P.cutoff + P.sweep * 0.35, 60, 16000);
  const a = 1 - Math.exp((-2 * Math.PI * fc) / sr);
  const wav = (p) => (P.wave === "square" ? (p < 0.5 ? 1 : -1) : P.wave === "triangle" ? 4 * Math.abs(p - 0.5) - 1 : 2 * p - 1);
  let y = 0;
  let sum = 0;
  for (const [, lv] of regs) sum += lv;
  const norm = sum > 0 ? 1 / Math.max(1, sum) : 0;
  for (let i = 0; i < N; i++) {
    let x = 0;
    for (let r = 0; r < 3; r++) {
      const [m, lv] = regs[r];
      for (let k = 0; k < 2; k++) {
        const fr = f0 * m * (k ? dm : 1 / dm);
        ph[r][k] = (ph[r][k] + fr / sr) % 1;
        x += wav(ph[r][k]) * lv * 0.5;
      }
    }
    y += a * (x * norm - y);
    out[i] = Math.tanh(y * 1.1);
  }
  return out;
}

const svg = {
  saw: '<path d="M2 18 L12 6 L12 18 L22 6 L22 18"/>',
  sqr: '<path d="M2 18 L2 6 L12 6 L12 18 L22 18 L22 6"/>',
  tri: '<path d="M2 18 L8 6 L16 18 L22 8"/>',
  strings: '<path d="M2 8 C8 4 16 12 22 8 M2 13 C8 9 16 17 22 13 M2 18 C8 14 16 22 22 18"/>',
  pad: '<path d="M2 18 C6 18 8 6 12 6 C16 6 18 18 22 18"/>',
  choir: '<ellipse cx="12" cy="12" rx="5" ry="8"/>',
  ah: '<ellipse cx="12" cy="12" rx="6" ry="8"/>',
  oh: '<ellipse cx="12" cy="12" rx="5" ry="6"/>',
  ee: '<ellipse cx="12" cy="12" rx="9" ry="3"/>',
  oo: '<ellipse cx="12" cy="12" rx="3" ry="3"/>',
};

const ensemble = {
  name: "jiENSEMBLE",
  tagline: "String machine, pad and choir - registers, three-phase ensemble chorus, swelling filter",
  color: "#7dd3c0",
  params: paramDefs,
  voice: ensembleVoice,
  scope: ensembleScope,
  lines: [
    { name: "Swell Chords (Am F C G)", dsl: "0:A3:16 0:C4:16 0:E4:16 16:F3:16 16:A3:16 16:C4:16 32:C3:16 32:G3:16 32:E4:16 48:G3:16 48:B3:16 48:D4:16" },
    { name: "Slow Fifths (Dm)", dsl: "0:D3:32 0:A3:32 0:F4:32 32:C3:32 32:G3:32 32:E4:32" },
    { name: "Choir Line (Em)", dsl: "0:E4:8 8:G4:8 16:B4:12 28:A4:4 32:G4:8 40:E4:8 48:D4:12 60:E4:4" },
    { name: "Stab Pulse (Cm)", dsl: "0:C4:2 0:Eb4:2 0:G4:2 4:C4:2 4:Eb4:2 4:G4:2 10:Bb3:2 10:D4:2 10:F4:2 16:C4:2 16:Eb4:2 16:G4:2 20:Ab3:2 20:C4:2 20:Eb4:2 26:Bb3:2 26:D4:2 26:F4:2" },
  ],
  presets: [
    { name: "Init (String Machine)", params: {} },
    {
      name: "Solina Strings",
      params: { tone: "strings", wave: "sawtooth", reg16: 0.35, reg8: 1, reg4: 0.8, detune: 9, cutoff: 4200, reso: 0.8, sweep: 1200, sweepIn: 0.5, sweepOut: 1.5, ensemble: 1, ensRate: 0.55, vibrato: 4, vibRate: 5.6, attack: 0.32, decay: 0.6, sustain: 0.9, release: 0.7 },
    },
    {
      name: "Warm Analog Pad",
      params: { tone: "pad", wave: "sawtooth", reg16: 0.7, reg8: 1, reg4: 0.2, detune: 18, cutoff: 1100, reso: 2.5, sweep: 3800, sweepIn: 2.2, sweepOut: 3.5, ensemble: 0.55, ensRate: 0.35, vibrato: 0, vibRate: 5, attack: 1.1, decay: 1.5, sustain: 0.85, release: 2.2 },
    },
    {
      name: "Choir Ah",
      params: { tone: "choir", vowel: "ah", wave: "sawtooth", reg16: 0.3, reg8: 1, reg4: 0.35, detune: 7, cutoff: 3600, reso: 1, sweep: 800, sweepIn: 0.6, sweepOut: 1.2, ensemble: 0.7, ensRate: 0.5, vibrato: 10, vibRate: 5.2, attack: 0.55, decay: 0.8, sustain: 0.85, release: 1.2 },
    },
    {
      name: "Hollow Oo Choir",
      params: { tone: "choir", vowel: "oo", wave: "square", reg16: 0.5, reg8: 1, reg4: 0.1, detune: 10, cutoff: 2400, reso: 0.5, sweep: 600, sweepIn: 1.4, sweepOut: 2, ensemble: 0.8, ensRate: 0.42, vibrato: 14, vibRate: 5, attack: 0.8, decay: 1, sustain: 0.8, release: 1.6 },
    },
    {
      name: "Slow Swell Drone",
      params: { tone: "pad", wave: "sawtooth", reg16: 1, reg8: 0.7, reg4: 0, detune: 26, cutoff: 500, reso: 4, sweep: 5200, sweepIn: 3.5, sweepOut: 5, ensemble: 0.4, ensRate: 0.2, vibrato: 3, vibRate: 3.5, attack: 2.4, decay: 2, sustain: 1, release: 3.5 },
    },
    {
      name: "Bright Ensemble Stab",
      params: { tone: "strings", wave: "sawtooth", reg16: 0.15, reg8: 1, reg4: 1, detune: 14, cutoff: 6500, reso: 1.8, sweep: 3800, sweepIn: 0.05, sweepOut: 0.35, ensemble: 0.9, ensRate: 0.9, vibrato: 0, vibRate: 5, attack: 0.012, decay: 0.28, sustain: 0.35, release: 0.28 },
    },
    {
      name: "Triangle Glow",
      params: { tone: "pad", wave: "triangle", reg16: 0.5, reg8: 1, reg4: 0.6, detune: 12, cutoff: 5200, reso: 0.5, sweep: 0, sweepIn: 0.5, sweepOut: 1, ensemble: 0.6, ensRate: 0.7, vibrato: 6, vibRate: 5.8, attack: 0.7, decay: 1, sustain: 0.9, release: 1.4 },
    },
  ],
  ui: {
    theme: { accent: "#7dd3c0", lcd: "#c9f5ea", lcdBg: "#0d2623", edge: "#274944", bg: "#101e1d" },
    logo: ["ji", "ENSEMBLE"],
    sub: "STRING MACHINE / PAD / CHOIR",
    cc: { 74: "cutoff", 71: "reso", 73: "attack", 72: "release", 75: "sweep", 76: "ensemble", 77: "detune", 78: "vibrato", 7: "level" },
    sections: [
      {
        title: "TONE",
        cls: "en-tone",
        items: [
          {
            type: "radio",
            key: "tone",
            cls: "wave-btns",
            options: [
              ["strings", "STRINGS", svg.strings, "0 0 24 24"],
              ["pad", "PAD", svg.pad, "0 0 24 24"],
              ["choir", "CHOIR", svg.choir, "0 0 24 24"],
            ],
          },
          {
            type: "radio",
            key: "wave",
            cls: "wave-btns",
            options: [
              ["sawtooth", "SAW", svg.saw, "0 0 24 24"],
              ["square", "SQR", svg.sqr, "0 0 24 24"],
              ["triangle", "TRI", svg.tri, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "reg16", label: "16'", fmt: "pct" },
              { type: "knob", key: "reg8", label: "8'", fmt: "pct" },
              { type: "knob", key: "reg4", label: "4'", fmt: "pct" },
              { type: "knob", key: "detune", label: "DETUNE", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "FILTER SWELL",
        cls: "en-filter",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "cutoff", label: "CUTOFF", curve: "log", fmt: "hz", big: true },
              { type: "knob", key: "reso", label: "RESO", fmt: "num1" },
              { type: "knob", key: "sweep", label: "SWEEP", fmt: "hz" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "fader", key: "sweepIn", label: "IN", fmt: "ms" },
              { type: "fader", key: "sweepOut", label: "SETTLE", fmt: "ms" },
            ],
          },
          {
            type: "radio",
            key: "vowel",
            cls: "wave-btns",
            options: [
              ["ah", "AH", svg.ah, "0 0 24 24"],
              ["oh", "OH", svg.oh, "0 0 24 24"],
              ["ee", "EE", svg.ee, "0 0 24 24"],
              ["oo", "OO", svg.oo, "0 0 24 24"],
            ],
          },
        ],
      },
      {
        title: "ENSEMBLE",
        cls: "en-ens",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "ensemble", label: "DEPTH", fmt: "pct", big: true },
              { type: "knob", key: "ensRate", label: "RATE", fmt: "num2" },
              { type: "knob", key: "vibrato", label: "VIBRATO", fmt: "num1" },
              { type: "knob", key: "vibRate", label: "VIB RATE", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "AMP ENVELOPE",
        cls: "en-env",
        items: [
          {
            type: "row",
            items: [
              { type: "fader", key: "attack", label: "A", fmt: "ms" },
              { type: "fader", key: "decay", label: "D", fmt: "ms" },
              { type: "fader", key: "sustain", label: "S", fmt: "pct" },
              { type: "fader", key: "release", label: "R", fmt: "ms" },
            ],
          },
        ],
      },
      {
        title: "OUTPUT",
        cls: "en-out",
        items: [
          { type: "row", items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }] },
          { type: "viz", id: "scope", cls: "viz-ensemble" },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
    scopeLabel: "WAVEFORM · A3",
  },
};

export const ENSEMBLE_SYNTHS = { ensemble };

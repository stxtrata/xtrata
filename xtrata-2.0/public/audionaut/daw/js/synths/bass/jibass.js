// synths/bass/jibass.js — Whale: analog bass synth (module for the Audionaut synth bank).
//
// Ported from the standalone Whale page. What makes it different from the host's
// jiMS10 / Acidals / SubZero:
//   * TWIN detuned main oscillators (THICKEN) + a selectable -1 octave sub (SQR/SIN/TRI)
//   * DRIVE is a tanh shaper that sits BEFORE the resonant filter (the filter then
//     tames / sings over the grit) - the host's drive is a post-chain insert. A DRIVE
//     POSITION switch also allows post-filter grit.
//   * Filter envelope has an ATTACK stage (rise, then fall back to cutoff) so it can
//     "yow"/"wow", not just snap down like a 303 / MS-10 decay.
//   * Amp envelope is a genuine exponential A-D-S-R with the gate = note length.
// Per-note additions (not in the page, because glide can't cross one-shot notes):
//   PUNCH (pitch drop at note start) and KEY TRACK (cutoff follows pitch).
// Plain ES module, no imports. Per-note node graph (~12 nodes), fully self-cleaning.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FLOOR = 0.0001; // never ramp to exactly 0 with exponentialRamp
const GAIN = 0.3; // master voice scale (calibrated against the harness RMS band)
const IN_TRIM = 0.5; // oscillator sum trim before the drive stage
const DROP_TIME = 0.06; // seconds for the PUNCH pitch drop
const REF_NOTE = 36; // C2: cutoff is "as written" here, KEY TRACK moves it from there

// shared, immutable shaper curves (cache is the only cross-note state)
const driveCurves = new Map();
function driveCurve(drive) {
  const key = Math.round(drive * 100);
  let c = driveCurves.get(key);
  if (!c) {
    const k = 1 + (key / 100) * 12; // same law as the original: tanh(x * (1 + drive*12))
    const n = 513;
    c = new Float32Array(n);
    const norm = 1 / Math.tanh(k);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / (n - 1) - 1;
      c[i] = Math.tanh(x * k) * norm;
    }
    if (driveCurves.size > 128) driveCurves.clear();
    driveCurves.set(key, c);
  }
  return c;
}
// final safety soft-clip: |y| <= tanh(1) ~ 0.76, nearly linear for small signals
let clipCurve = null;
function safetyCurve() {
  if (!clipCurve) {
    const n = 513;
    clipCurve = new Float32Array(n);
    for (let i = 0; i < n; i++) clipCurve[i] = Math.tanh((i * 2) / (n - 1) - 1);
  }
  return clipCurve;
}

// Amp envelope maths shared by voice() and scope(): level of the A-D-S curve at time t.
function ampLevel(t, top, A, D, sus) {
  if (t <= 0) return FLOOR;
  if (t < A) return FLOOR * Math.pow(top / FLOOR, t / A);
  if (t < A + D) return top * Math.pow(sus / top, (t - A) / D);
  return sus;
}
const susOf = (top, s) => Math.max(FLOOR, top * s);

const paramDefs = [
  { key: "wave", label: "Main Wave", type: "select", def: "sawtooth", options: ["sawtooth", "square"] },
  { key: "subWave", label: "Sub Wave (-12 st)", type: "select", def: "square", options: ["square", "sine", "triangle"] },
  { key: "root", label: "Note = (pitch reference)", type: "select", def: "sub", options: ["sub", "main"] },
  { key: "subLevel", label: "Sub Mix", type: "range", min: 0, max: 1, step: 0.01, def: 0.8 },
  { key: "detune", label: "Thicken (cents)", type: "range", min: 0, max: 50, step: 1, def: 15 },
  { key: "punch", label: "Punch (pitch drop, st)", type: "range", min: 0, max: 12, step: 0.5, def: 0 },
  { key: "cutoff", label: "Cutoff", type: "range", min: 40, max: 8000, step: 10, def: 150 },
  { key: "reso", label: "Resonance", type: "range", min: 0, max: 20, step: 0.1, def: 6 },
  { key: "envMod", label: "Env Mod Amount", type: "range", min: 0, max: 8000, step: 10, def: 3500 },
  { key: "fAttack", label: "Filter Attack", type: "range", min: 0.002, max: 1, step: 0.002, def: 0.02 },
  { key: "fDecay", label: "Filter Decay", type: "range", min: 0.01, max: 2, step: 0.01, def: 0.35 },
  { key: "keyTrack", label: "Key Track", type: "range", min: 0, max: 1, step: 0.01, def: 0.4 },
  { key: "attack", label: "Amp Attack", type: "range", min: 0.002, max: 1, step: 0.002, def: 0.01 },
  { key: "decay", label: "Amp Decay", type: "range", min: 0.01, max: 2, step: 0.01, def: 0.4 },
  { key: "sustain", label: "Amp Sustain", type: "range", min: 0, max: 1, step: 0.01, def: 0.3 },
  { key: "release", label: "Amp Release", type: "range", min: 0.01, max: 2, step: 0.01, def: 0.15 },
  { key: "drive", label: "Drive", type: "range", min: 0, max: 1, step: 0.01, def: 0.6 },
  { key: "driveAt", label: "Drive Position", type: "select", def: "pre", options: ["pre", "post"] },
  { key: "level", label: "Output Level", type: "range", min: 0, max: 1.5, step: 0.01, def: 1 },
];

// velocity also opens the filter envelope a little (accents bite harder)
const velBite = (v) => 0.6 + 0.4 * Math.min(v, 1.4);

function jibassVoice(ctx, dest, note, P) {
  const { pitch, time } = note;
  const v = clamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
  const gate = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
  const f0 = mtof(pitch);

  // ---------- amp envelope (exponential A-D-S, gate = note length, then R)
  const A = Math.max(0.002, P.attack);
  const D = Math.max(0.01, P.decay);
  const R = Math.max(0.01, P.release);
  const top = Math.max(FLOOR, v * GAIN * P.level);
  const sus = susOf(top, P.sustain);
  const amp = ctx.createGain();
  const g = amp.gain;
  g.setValueAtTime(FLOOR, time);
  if (gate <= A) {
    g.exponentialRampToValueAtTime(ampLevel(gate, top, A, D, sus), time + gate);
  } else {
    g.exponentialRampToValueAtTime(top, time + A);
    if (gate <= A + D) g.exponentialRampToValueAtTime(ampLevel(gate, top, A, D, sus), time + gate);
    else g.exponentialRampToValueAtTime(sus, time + A + D);
  }
  const lvlAtGate = ampLevel(gate, top, A, D, sus);
  g.setValueAtTime(lvlAtGate, time + gate);
  g.exponentialRampToValueAtTime(FLOOR, time + gate + R);
  const stopAt = time + gate + R + 0.05;

  // ---------- filter (cutoff base -> base+envMod over fAttack -> back to base over fDecay)
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.Q.value = P.reso;
  const kt = Math.pow(2, ((pitch - REF_NOTE) / 12) * P.keyTrack);
  const base = clamp(P.cutoff * kt, 20, 18000);
  const peak = clamp(base + P.envMod * kt * velBite(v), base, 20000);
  f.frequency.setValueAtTime(base, time);
  if (peak > base * 1.001) {
    f.frequency.exponentialRampToValueAtTime(peak, time + Math.max(0.002, P.fAttack));
    f.frequency.exponentialRampToValueAtTime(base, time + Math.max(0.002, P.fAttack) + Math.max(0.01, P.fDecay));
  }

  // ---------- oscillators: main, thickened twin, sub
  const osc1 = ctx.createOscillator();
  osc1.type = P.wave === "square" ? "square" : "sawtooth";
  const osc3 = ctx.createOscillator();
  osc3.type = osc1.type;
  // THICKEN spreads the twins symmetrically around the note so wide detune stays in tune
  osc1.detune.value = -P.detune / 2;
  osc3.detune.value = P.detune / 2;
  const sub = ctx.createOscillator();
  sub.type = ["square", "sine", "triangle"].includes(P.subWave) ? P.subWave : "square";
  const subGain = ctx.createGain();
  subGain.gain.value = P.subLevel;
  // ROOT: which oscillator sits on the written pitch. "sub" (default) = the played note is the
  // lowest fundamental you hear (main oscs one octave up); "main" = original page behaviour
  // (main on the note, sub an octave below it).
  const fMain = P.root === "main" ? f0 : f0 * 2;
  const fSub = fMain / 2;
  const oscs = [[osc1, fMain], [osc3, fMain], [sub, fSub]];
  const dropMul = P.punch > 0 ? Math.pow(2, P.punch / 12) : 1;
  for (const [o, fr] of oscs) {
    if (dropMul > 1) {
      o.frequency.setValueAtTime(fr * dropMul, time);
      o.frequency.exponentialRampToValueAtTime(fr, time + DROP_TIME);
    } else o.frequency.setValueAtTime(fr, time);
  }

  // ---------- routing: oscs -> trim -> [drive] -> filter -> [drive] -> amp -> safety clip -> dest
  const trim = ctx.createGain();
  trim.gain.value = IN_TRIM;
  osc1.connect(trim);
  osc3.connect(trim);
  sub.connect(subGain);
  subGain.connect(trim);

  let shaper = null;
  if (P.drive > 0) {
    shaper = ctx.createWaveShaper();
    shaper.curve = driveCurve(P.drive);
    shaper.oversample = "2x";
  }
  const post = P.driveAt === "post";
  // compensate the loudness a driven (squarer) signal gains, so DRIVE sweeps stay in a similar level range
  const comp = ctx.createGain();
  comp.gain.value = 1 / (1 + 0.6 * P.drive);

  if (shaper && !post) {
    trim.connect(shaper);
    shaper.connect(f);
    f.connect(comp);
  } else if (shaper && post) {
    trim.connect(f);
    f.connect(shaper);
    shaper.connect(comp);
  } else {
    trim.connect(f);
    f.connect(comp);
  }
  comp.connect(amp);

  const clip = ctx.createWaveShaper();
  clip.curve = safetyCurve();
  amp.connect(clip);
  clip.connect(dest);

  osc1.start(time);
  osc3.start(time);
  sub.start(time);
  osc1.stop(stopAt);
  osc3.stop(stopAt);
  sub.stop(stopAt);
  osc1.onended = () => {
    try {
      clip.disconnect();
      amp.disconnect();
      comp.disconnect();
      f.disconnect();
      if (shaper) shaper.disconnect();
      trim.disconnect();
      subGain.disconnect();
    } catch {
      /* already disconnected */
    }
  };
}

// Small JS model of the voice (twin osc + sub -> drive -> resonant LP with env -> amp)
// for the panel's scope: A3 at 40 kHz, 16000 samples (0.4 s). Approximate by design.
function jibassScope(P) {
  const sr = 40000;
  const N = 16000;
  const out = new Float32Array(N);
  const f0 = P.root === "main" ? 220 : 440; // main-osc frequency for A3
  const gate = 0.3;
  const A = Math.max(0.002, P.attack);
  const D = Math.max(0.01, P.decay);
  const R = Math.max(0.01, P.release);
  const top = Math.max(FLOOR, GAIN * P.level);
  const sus = susOf(top, P.sustain);
  const kt = Math.pow(2, ((57 - REF_NOTE) / 12) * P.keyTrack);
  const base = clamp(P.cutoff * kt, 20, 18000);
  const peak = clamp(base + P.envMod * kt * velBite(1), base, 20000);
  const fA = Math.max(0.002, P.fAttack);
  const fD = Math.max(0.01, P.fDecay);
  const k = 1 + P.drive * 12;
  const norm = 1 / Math.tanh(k);
  const gq = Math.pow(10, P.reso / 20);
  const dm = Math.pow(2, P.detune / 2400);
  const sq = P.wave === "square";
  const wav = (ph) => (sq ? (ph < 0.5 ? 1 : -1) : 2 * ph - 1);
  const subw = (ph) =>
    P.subWave === "sine" ? Math.sin(2 * Math.PI * ph) : P.subWave === "triangle" ? 4 * Math.abs(ph - 0.5) - 1 : ph < 0.5 ? 1 : -1;
  const post = P.driveAt === "post";
  const comp = 1 / (1 + 0.6 * P.drive);
  let p1 = 0, p3 = 0, ps = 0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  let b0 = 0, b1 = 0, b2 = 0, a1 = 0, a2 = 0;
  const shape = (x) => (P.drive > 0 ? Math.tanh(clamp(x, -1, 1) * k) * norm : x);
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    if ((i & 15) === 0) {
      let fc;
      if (t < fA) fc = base * Math.pow(peak / base, t / fA);
      else if (t < fA + fD) fc = peak * Math.pow(base / peak, (t - fA) / fD);
      else fc = base;
      const w0 = (2 * Math.PI * clamp(fc, 20, sr * 0.45)) / sr;
      const cs = Math.cos(w0);
      const al = Math.sin(w0) / (2 * gq);
      const a0 = 1 + al;
      b0 = (1 - cs) / 2 / a0;
      b1 = (1 - cs) / a0;
      b2 = b0;
      a1 = (-2 * cs) / a0;
      a2 = (1 - al) / a0;
    }
    p1 = (p1 + f0 / dm / sr) % 1;
    p3 = (p3 + (f0 * dm) / sr) % 1;
    ps = (ps + f0 / 2 / sr) % 1;
    let x = (wav(p1) + wav(p3) + subw(ps) * P.subLevel) * IN_TRIM;
    if (!post) x = shape(x);
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    let s = y;
    if (post) s = shape(s);
    let env;
    if (t < gate) env = ampLevel(t, top, A, D, sus);
    else env = ampLevel(gate, top, A, D, sus) * Math.pow(FLOOR / Math.max(FLOOR, ampLevel(gate, top, A, D, sus)), Math.min(1, (t - gate) / R));
    out[i] = Math.tanh(s * comp * env * 3.2); // scope is shown ~3x larger than the real signal
  }
  return out;
}

const svg = {
  saw: '<path d="M2 18 L12 6 L12 18 L22 6 L22 18"/>',
  sqr: '<path d="M2 18 L2 6 L12 6 L12 18 L22 18 L22 6"/>',
  sin: '<path d="M2 12 C6 2 10 2 12 12 S18 22 22 12"/>',
  tri: '<path d="M2 18 L8 6 L16 18 L22 8"/>',
  pre: '<path d="M2 12 H6 M6 7 H12 V17 H6 Z M12 12 H22"/>',
  post: '<path d="M2 12 H12 M12 7 H18 V17 H12 Z M18 12 H22"/>',
};

// ---------- preset library, stored as data: one row = name + 19 values in PK order.
// Selects are option indices: wave 0 saw 1 sqr | subWave 0 sqr 1 sin 2 tri | root 0 sub 1 main | driveAt 0 pre 1 post
//          wave sub root subLv det punch cut  reso env  fAtk fDec kTrk  att  dec  sus  rel  drive dAt level
const PK = "wave subWave root subLevel detune punch cutoff reso envMod fAttack fDecay keyTrack attack decay sustain release drive driveAt level".split(" ");
const OPT = { wave: ["sawtooth", "square"], subWave: ["square", "sine", "triangle"], root: ["sub", "main"], driveAt: ["pre", "post"] };
const BANK = {
  Sub: [
    ["Sub Thump", "1 1 0 1 4 5 120 1 500 .004 .2 .3 .004 .3 .75 .2 .25 0 1"],
    ["808 Boom", "1 1 0 1 0 12 70 0 150 .002 .15 1 .002 1.2 .45 .6 .3 0 1.5"],
    ["808 Crunch", "1 1 0 1 0 7 80 0 300 .002 .1 1 .002 1 .5 .5 .55 1 1"],
    ["Pure Sub", "1 1 0 1 0 0 70 0 0 .002 .1 1 .008 .3 1 .25 0 0 1"],
    ["Kick Bass", "1 1 0 1 2 12 110 2 900 .002 .08 1 .002 .35 .15 .2 .35 0 1.5"],
    ["Trap Sub", "1 1 0 1 0 4 80 0 200 .002 .2 1 .004 1.5 .55 .5 .45 1 1"],
    ["Round Sub", "1 2 0 1 2 0 90 1 400 .004 .25 .8 .006 .4 .85 .3 .15 0 1"],
  ],
  Pluck: [
    ["Rubber Pluck", "0 2 0 .8 8 0 220 8 2800 .004 .2 .5 .004 .3 .18 .12 .5 0 1"],
    ["Funk Slap", "0 2 0 .7 6 1 300 9 4000 .002 .12 .5 .002 .25 .25 .1 .45 0 1"],
    ["Finger Bass", "0 2 0 .8 4 0 220 2 1200 .004 .3 .4 .006 .6 .4 .15 .2 0 1"],
    ["Pick Bass", "0 0 0 .5 8 0 480 4 3000 .002 .08 .5 .002 .4 .35 .12 .5 0 1"],
    ["Disco Pluck", "1 1 0 .7 5 0 260 12 3500 .002 .15 .5 .002 .22 .3 .08 .35 0 .63"],
    ["Muted Thumb", "0 1 0 1 3 1 150 3 900 .002 .08 .3 .002 .25 .15 .1 .3 0 1.5"],
    ["Wah Pluck", "0 2 0 .6 10 0 200 14 3200 .06 .2 .5 .004 .4 .3 .12 .4 0 1"],
    ["Bubble Bass", "1 1 0 .8 4 0 120 16 2500 .002 .1 1 .002 .3 .2 .1 .3 0 .64"],
  ],
  Acid: [
    ["Acid Squelch", "0 0 0 .25 3 0 260 18 5200 .003 .22 .6 .003 .3 .2 .07 .5 0 1"],
    ["Acid Screamer", "0 0 0 .2 2 0 140 20 7000 .002 .3 1 .002 .35 .3 .07 .9 0 .76"],
    ["Acid Square", "1 0 0 .2 0 0 150 17 4500 .002 .18 1 .002 .3 .25 .06 .5 0 .65"],
    ["Dark Acid", "0 1 0 .5 4 0 90 16 2200 .002 .4 .8 .002 .5 .35 .1 .3 0 .76"],
    ["Acid Fuzz", "0 0 0 .3 6 0 240 15 5000 .002 .25 .6 .002 .3 .3 .08 .8 1 1.5"],
    ["Acid Yawn", "0 0 0 .3 5 0 150 18 4000 .08 .6 .5 .004 .6 .5 .12 .45 0 .69"],
    ["Acid Blip", "0 0 0 .4 3 0 300 19 6000 .002 .1 .6 .002 .3 .15 .05 .6 0 1.5"],
  ],
  Reese: [
    ["Reese Growl", "0 1 0 .7 40 0 380 3 1500 .3 1.2 .4 .02 .8 .8 .4 .7 0 1"],
    ["Classic Reese", "0 1 0 .6 25 0 500 2 0 .002 .1 .4 .01 .5 1 .3 .3 0 .62"],
    ["Neuro Reese", "0 1 0 .5 35 0 900 6 600 .1 .5 .3 .01 .5 .9 .25 .9 1 .78"],
    ["Liquid Reese", "0 1 0 .7 18 0 350 1 300 .2 .8 .3 .03 .6 .9 .4 .2 0 .72"],
    ["Dark Reese", "0 1 0 .7 50 0 220 4 400 .05 .6 .3 .015 .8 .9 .35 .5 0 .7"],
    ["Rolling Reese", "0 1 0 .6 30 0 200 5 1800 .5 1.5 .4 .02 1 .8 .4 .6 0 .68"],
    ["Square Reese", "1 1 0 .6 30 0 600 3 500 .05 .4 .3 .01 .6 .9 .3 .6 0 .66"],
  ],
  Dub: [
    ["Deep Dub", "1 1 0 1 3 2 90 2 300 .01 .5 .2 .008 .5 .9 .45 .1 0 1"],
    ["Roots Bass", "1 1 0 1 2 0 90 1 200 .01 .4 .8 .01 .8 .8 .3 .15 0 .77"],
    ["Steppers", "1 2 0 1 3 0 100 2 600 .004 .15 .8 .006 .4 .85 .25 .2 0 1"],
    ["Rockers Pluck", "1 1 0 .9 2 1 130 3 800 .004 .2 .8 .004 .5 .4 .2 .2 0 1"],
    ["Sound System", "1 1 0 1 4 1.5 110 3 400 .01 .3 .7 .006 .6 .95 .5 .35 0 .63"],
    ["Lovers Round", "0 2 0 1 5 0 160 2 400 .03 .3 .3 .016 .5 .7 .35 .1 0 1"],
    ["Digi Dub", "1 0 0 .7 0 0 180 5 300 .006 .2 .6 .004 .4 .6 .15 .3 0 .64"],
  ],
  Analog: [
    ["Wow Bass", "0 0 0 .5 20 0 130 10 4500 .14 .35 .5 .012 .5 .55 .2 .55 0 1"],
    ["Night Drive", "0 0 0 .6 12 0 260 7 3000 .002 .18 .5 .002 .2 .35 .08 .3 0 1"],
    ["Classic Mono", "0 0 0 .8 6 0 300 4 2000 .004 .4 .4 .004 .5 .6 .15 .35 0 .83"],
    ["Brass Bass", "0 1 0 .6 18 0 200 3 3000 .05 .5 .5 .01 .6 .8 .2 .3 0 .77"],
    ["Velvet Mono", "1 1 0 .8 8 0 220 2 900 .02 .4 .3 .02 .6 .85 .35 .1 0 .81"],
    ["Italo Pulse", "1 0 0 .6 6 0 350 8 2000 .002 .1 .5 .002 .15 .3 .08 .3 0 1.25"],
    ["Synthwave Saw", "0 0 0 .5 14 0 400 5 2500 .004 .25 .5 .004 .3 .5 .1 .3 0 1"],
  ],
  Growl: [
    ["Dirty Fuzz", "1 0 0 .6 12 0 700 4 1800 .01 .25 .3 .006 .35 .6 .12 1 1 1"],
    ["Growler", "0 0 0 .5 30 0 500 10 3000 .15 .5 .5 .01 .5 .8 .2 1 0 .66"],
    ["Grit Square", "1 1 0 .7 10 0 300 6 2000 .004 .3 .4 .004 .4 .7 .15 .85 1 1"],
    ["Industrial", "0 0 0 .4 22 0 200 14 4000 .004 .3 .5 .004 .4 .6 .1 1 1 1"],
    ["Tear-Out", "0 1 0 .6 45 0 1200 8 1500 .25 .4 .3 .01 .5 .85 .25 1 0 .73"],
    ["Fuzz Pedal", "1 0 0 1 4 0 1500 2 0 .002 .1 .2 .004 .5 .8 .15 1 1 .83"],
    ["Overdriven Pick", "0 2 0 .6 8 0 800 3 2500 .002 .15 .4 .002 .35 .45 .12 .75 1 1.3"],
  ],
  Hollow: [
    ["Hollow Square", "1 2 0 .7 4 0 350 3 800 .01 .3 1 .006 .5 .7 .2 .1 0 .77"],
    ["Wooden Bass", "1 1 0 .9 2 0 200 12 1500 .002 .06 1 .002 .35 .15 .12 .15 0 1.36"],
    ["Glass Bass", "1 1 0 .8 3 0 900 20 2500 .002 .08 1 .002 .5 .2 .2 .1 0 1"],
    ["Hollow Tube", "1 1 1 .3 2 0 600 9 0 .002 .1 1 .01 .5 .85 .25 .1 0 .63"],
    ["Vowel Bass", "1 2 0 .7 6 0 250 13 900 .12 .5 1 .01 .5 .8 .2 .2 0 .56"],
    ["Clank", "1 0 1 .3 0 .5 1200 7 3000 .002 .04 .6 .002 .18 .12 .08 .2 0 1.5"],
    ["Upright Thump", "1 2 0 1 2 .5 120 5 1200 .002 .09 .9 .002 .7 .1 .2 .1 0 1.1"],
  ],
};
const row = (name, cat, vals) => ({
  name,
  cat,
  params: Object.fromEntries(vals.split(" ").map((x, i) => [PK[i], OPT[PK[i]] ? OPT[PK[i]][+x] : +x])),
});
// Init first, then grouped by category
const PRESETS = [{ name: "Init (Whale)", cat: "Analog", params: {} }];
for (const cat in BANK) for (const [n, v] of BANK[cat]) PRESETS.push(row(n, cat, v));

const jibass = {
  name: "Whale",
  tagline: "Analog bass - twin detuned saws + sub, drive into a resonant filter with a rise-and-fall envelope",
  color: "#ef4444",
  params: paramDefs,
  voice: jibassVoice,
  scope: jibassScope,
  lines: [
    { name: "Funk Pocket (Em)", dsl: "0:E2:2 3:E2:1:90 4:G2:2 6:A2:1:127 8:B2:2 11:A2:1:90 12:G2:2 14:E2:1 16:E2:2 19:E2:1:90 20:D3:2 22:B2:1:127 24:A2:2 27:G2:1:90 28:E2:2 30:D2:1" },
    { name: "Sub Pressure (F)", dsl: "0:F1:6 8:F1:2 10:Ab1:2 12:C2:4 16:F1:6 24:Eb1:4 28:C2:2 30:Bb1:2" },
    { name: "Acid Roller (Am)", dsl: "0:A1:1 1:A1:1:80 2:A2:1:127 3:A1:1 4:C2:1 5:A1:1:80 6:G2:1:127 7:E2:1 8:A1:1 9:A1:1:80 10:A2:1:127 11:A1:1 12:C2:1 13:E2:1 14:G2:1:127 15:A2:1 16:A1:1 17:A1:1:80 18:A2:1:127 19:A1:1 20:D2:1 21:A1:1:80 22:C3:1:127 23:A2:1 24:A1:1 25:G1:1:80 26:A1:1 27:E2:1:127 28:G1:1 29:A1:1 30:C2:1:127 31:E2:1" },
    { name: "Reese Walk (Dm)", dsl: "0:D2:8 8:F2:4 12:G2:4 16:D2:8 24:C2:4 28:A1:4" },
    { name: "Dub Steppers (Gm)", dsl: "0:G1:3 4:G1:1:90 6:Bb1:2 8:D2:3 12:C2:2 14:Bb1:2 16:G1:3 20:G1:1:90 22:F1:2 24:D1:4 28:F1:2 30:G1:2" },
    { name: "Night Drive (Am)", dsl: "0:A1:1 2:A1:1:90 4:A2:1:127 6:A1:1:90 8:A1:1 10:A1:1:90 12:A2:1:127 14:A1:1:90 16:F1:1 18:F1:1:90 20:F2:1:127 22:F1:1:90 24:G1:1 26:G1:1:90 28:G2:1:127 30:E2:1:90" },
  ],
  presets: PRESETS,
  ui: {
    theme: { accent: "#ef4444", lcd: "#fca5a5", lcdBg: "#2a1215", edge: "#3d1c1c", bg: "#1f1212" },
    logo: ["", "Whale"],
    sub: "ANALOG BASS SYNTH",
    cc: { 74: "cutoff", 71: "reso", 73: "attack", 72: "release", 75: "fDecay", 76: "subLevel", 77: "envMod", 7: "level", 1: "drive", 78: "detune" },
    sections: [
      {
        title: "OSCILLATORS",
        cls: "jb-osc",
        items: [
          {
            type: "radio",
            key: "wave",
            cls: "wave-btns",
            options: [
              ["sawtooth", "SAW", svg.saw, "0 0 24 24"],
              ["square", "SQR", svg.sqr, "0 0 24 24"],
            ],
          },
          {
            type: "radio",
            key: "root",
            cls: "root-sw",
            options: [
              ["sub", "NOTE = SUB", svg.sin, "0 0 24 24"],
              ["main", "NOTE = MAIN", svg.saw, "0 0 24 24"],
            ],
          },
          {
            type: "radio",
            key: "subWave",
            cls: "wave-btns",
            options: [
              ["square", "SUB SQR", svg.sqr, "0 0 24 24"],
              ["sine", "SUB SIN", svg.sin, "0 0 24 24"],
              ["triangle", "SUB TRI", svg.tri, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "knob", key: "subLevel", label: "SUB MIX", fmt: "pct" },
              { type: "knob", key: "detune", label: "THICKEN", fmt: "int" },
              { type: "knob", key: "punch", label: "PUNCH", fmt: "num1" },
            ],
          },
        ],
      },
      {
        title: "FILTER",
        cls: "jb-filter",
        items: [
          {
            type: "row",
            items: [
              { type: "knob", key: "cutoff", label: "CUTOFF", curve: "log", fmt: "hz", big: true },
              { type: "knob", key: "reso", label: "RESO", fmt: "num1", big: true },
              { type: "knob", key: "envMod", label: "ENV MOD", fmt: "hz" },
              { type: "knob", key: "keyTrack", label: "KEY TRK", fmt: "pct" },
            ],
          },
          {
            type: "row",
            items: [
              { type: "fader", key: "fAttack", label: "ATT", fmt: "ms" },
              { type: "fader", key: "fDecay", label: "DEC", fmt: "ms" },
            ],
          },
        ],
      },
      {
        title: "AMP ENVELOPE",
        cls: "jb-env",
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
        cls: "jb-out",
        items: [
          {
            type: "radio",
            key: "driveAt",
            cls: "drive-pos",
            options: [
              ["pre", "PRE-FILT", svg.pre, "0 0 24 24"],
              ["post", "POST-FILT", svg.post, "0 0 24 24"],
            ],
          },
          {
            type: "row",
            items: [
              { type: "fader", key: "drive", label: "DRIVE", fmt: "pct" },
              { type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false },
            ],
          },
          { type: "viz", id: "scope", cls: "viz-jibass" },
        ],
      },
    ],
    adsr: { a: "attack", d: "decay", s: "sustain", r: "release" },
    scopeLabel: "WAVEFORM · A3",
  },
};

export const JIBASS_SYNTHS = { jibass };

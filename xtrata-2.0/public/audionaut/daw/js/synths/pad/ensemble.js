// synths/pad/ensemble.js — Layers: string machine / pad / choir (Audionaut synth module).
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
const GAIN = 0.84; // master voice scale (calibrated against the harness RMS band)
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
      og.gain.value = (lv * norm * waveTrim * 0.7071) / Math.sqrt(voices); // power-sum of detuned voices: 2 -> 1/2 as before
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
  // a cutoff close to the fundamental strips most harmonic power: make up part of it (saw power below
  // harmonic N ~ 1 - 0.61/N), so dark patches sit near the level of bright ones
  const nPass = Math.max(1, clamp(base + P.sweep * 0.35, base, 18000) / f0);
  mix.gain.value = Math.min(1.6, 1 / Math.sqrt(1 - 0.61 / nPass));

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
      bg.gain.value = fg * 3.4;
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

// ---- preset library, stored as data: "Cat|Name|tone wave 16' 8' 4' detune cutoff reso sweep sweepIn sweepOut
// vowel ensemble ensRate vibrato vibRate attack decay sustain release [level]".
// tone s/p/c = strings/pad/choir, wave s/q/t = saw/square/triangle, vowel a/o/e/u, "-" = leave at default.
const PK = "tone wave reg16 reg8 reg4 detune cutoff reso sweep sweepIn sweepOut vowel ensemble ensRate vibrato vibRate attack decay sustain release level".split(" ");
const PC = { tone: { s: "strings", p: "pad", c: "choir" }, wave: { s: "sawtooth", q: "square", t: "triangle" }, vowel: { a: "ah", o: "oh", e: "ee", u: "oo" } };
const PRESETS = `Strings|Init (String Machine)|
Strings|Solina Strings|s s .35 1 .8 9 4200 .8 1200 .5 1.5 - 1 .55 4 5.6 .32 .6 .9 .7
Strings|Cello Section|s s .9 1 0 8 1800 .9 900 .4 1.2 - .8 .5 6 5.2 .25 .7 .9 .9
Strings|Violin Ensemble|s s 0 .6 1 7 5200 .7 1500 .3 1 - 1 .65 7 5.8 .2 .5 .9 .8
Strings|Disco Strings|s s .2 1 1 12 6000 1.2 2500 .15 .6 - 1 .8 3 6 .08 .4 .85 .5
Strings|Staccato Strings|s s .3 1 .6 9 3800 1 2000 .05 .25 - .9 .6 0 5 .01 .22 .3 .2 1.5
Strings|Tape Strings|s t .5 1 .4 16 2200 .6 600 .8 2 - .9 .3 9 4.6 .5 .9 .85 1.3 0.5
Strings|Dark Strings|s s .8 1 .2 10 900 1.5 1400 1.2 2.5 - .85 .45 4 5 .6 1 .9 1.4
Strings|Square Strings|s q .3 1 .7 10 3000 1 1500 .4 1.4 - .9 .6 4 5.4 .3 .7 .9 .9 0.65
Pads|Warm Analog Pad|p s .7 1 .2 18 1100 2.5 3800 2.2 3.5 - .55 .35 0 5 1.1 1.5 .85 2.2 1.5
Pads|Triangle Glow|p t .5 1 .6 12 5200 .5 0 .5 1 - .6 .7 6 5.8 .7 1 .9 1.4
Pads|Velvet Pad|p s .5 1 .3 14 1600 1.5 2400 1.4 2.5 - .7 .4 0 5 .9 1.2 .9 1.8
Pads|Glass Pad|p t 0 .7 1 9 8000 .5 0 .5 1 - .8 .9 4 6 .8 1 .85 2 0.55
Pads|Warm Square Pad|p q .6 1 .2 15 1300 2 2000 1.5 3 - .6 .35 0 5 1 1.4 .85 2
Pads|Airy Pad|p s 0 .6 1 20 6500 .4 3000 2 3 - 1 .3 2 5 1.2 1.5 .8 2.5
Pads|Hazy Pad|p s .4 1 .5 30 1400 .8 1800 2.5 4 - 1 .18 6 3.2 1.4 2 .9 3 1.5
Pads|Soft Felt Pad|p t .6 1 .3 8 1200 .3 400 1 2 - .5 .5 0 5 .6 1 .8 1.5 0.7
Choirs|Choir Ah|c s .3 1 .35 7 3600 1 800 .6 1.2 a .7 .5 10 5.2 .55 .8 .85 1.2
Choirs|Hollow Oo Choir|c q .5 1 .1 10 2400 .5 600 1.4 2 u .8 .42 14 5 .8 1 .8 1.6
Choirs|Choir Oh|c s .3 1 .3 8 3000 .8 700 .6 1.2 o .7 .45 9 5 .6 .9 .85 1.3
Choirs|Bright Ee Choir|c s .1 1 .6 6 5000 .6 1000 .4 1 e .65 .55 8 5.4 .4 .8 .85 1 1.5
Choirs|Cathedral Choir|c s .6 1 .3 12 2800 1 600 1.5 3 a 1 .3 7 4.8 1.1 1.5 .9 3
Choirs|Ghost Voices|c t .3 1 .5 18 3200 .5 500 2 3 u 1 .2 16 4.2 1.3 2 .8 3.5
Choirs|Male Ensemble Oh|c q .8 1 0 9 2000 .6 500 .8 1.5 o .7 .4 8 5 .5 1 .85 1.2 1.5
Choirs|Robot Choir|c q .2 1 .4 3 4000 2 0 .5 1 a .3 .9 0 5 .05 .4 .9 .4
Choirs|Angel Ee|c t 0 .8 1 10 6000 .4 800 1.2 2 e .9 .5 12 5.6 1 1.4 .85 2.4 0.75
Brass|Ensemble Brass|s s .4 1 .3 8 900 2 4200 .08 .6 - .5 .7 3 5.5 .05 .4 .8 .4
Brass|Soft Horns|p s .5 1 0 6 700 1.5 2600 .2 .9 - .4 .5 4 5.2 .12 .6 .8 .5
Brass|Synth Brass Stab|s s .3 1 .5 12 1100 3 5500 .04 .3 - .6 .8 0 5 .01 .3 .55 .3 1.5
Brass|Square Brass|s q .5 1 .2 7 800 2.5 3500 .1 .7 - .5 .6 2 5.4 .06 .5 .75 .45
Brass|Fanfare Swell|p s .4 1 .6 10 1000 2 6000 .5 1.5 - .7 .55 5 5.6 .4 .8 .85 .8 1.5
Brass|Low Tuba Section|p q 1 .6 0 6 500 1.5 1500 .15 .8 - .4 .4 0 5 .06 .5 .8 .4
Organ|Combo Organ|s q .3 1 .8 2 5000 .3 0 .5 1 - .35 1.4 0 5 .005 .1 1 .08 0.7
Organ|Drawbar Flutes|p t .8 1 .7 1 6000 0 0 .5 1 - .5 1.8 0 5 .005 .1 1 .1 0.5
Organ|Chorale Organ|s s .6 1 .6 4 2400 .5 0 .5 1 - .8 .9 0 5 .02 .1 1 .3
Organ|Church Reed|p q 1 .8 .5 3 3000 1 0 .5 1 - .3 .6 0 5 .03 .2 .95 .6
Organ|Rotary Organ|p q .4 1 .6 2 4000 .5 0 .5 1 - 1 2.5 6 6.8 .005 .1 1 .15 0.6
Drones|Slow Swell Drone|p s 1 .7 0 26 500 4 5200 3.5 5 - .4 .2 3 3.5 2.4 2 1 3.5 1.5
Drones|Deep Bed|p s 1 .4 0 22 350 2 800 3 5 - .6 .15 2 3 1.2 2 1 4
Drones|Dark Choir Drone|c s 1 .7 0 15 1200 1 400 3 5 u .8 .15 6 3.5 1.2 2 1 4
Drones|Iron Drone|p q 1 .8 .3 30 600 6 1600 4 6 - .5 .12 0 5 1 2 1 4
Drones|Shimmer Drone|p t .6 .8 1 35 4000 .5 2000 4 6 - 1 .1 4 2.5 1.4 2 1 5 0.6
Drones|Sub Hum|p t 1 .3 0 12 400 .5 200 2 4 - .3 .2 0 5 .8 2 1 3 0.6
Sweeps|Bright Sweep|s s .3 1 .8 14 400 6 7000 1.5 3 - .9 .5 0 5 .3 1 .9 1.5
Sweeps|Reso Bloom|p s .5 1 .4 16 300 9 6000 2 4 - .7 .35 0 5 .6 1.5 .9 2
Sweeps|Quick Zip Sweep|s s .2 1 .6 10 600 7 7500 .15 .5 - .8 .7 0 5 .02 .4 .7 .5
Sweeps|Choir Rise|c s .4 1 .5 10 500 2 5000 2.5 3 e .9 .4 8 5 .8 1.5 .9 2 1.5
Sweeps|Slow Tide Sweep|p q .4 1 .5 20 500 5 4500 3.5 5 - 1 .15 0 5 .8 2 .9 2.5 0.6
Sweeps|Dawn Sweep|s s 0 1 1 9 800 4 6500 3 4 - 1 .5 3 5 1.2 2 .9 2
Poly|Bright Ensemble Stab|s s .15 1 1 14 6500 1.8 3800 .05 .35 - .9 .9 0 5 .012 .28 .35 .28 1.5
Poly|Juno Pad|p s .3 1 .3 12 1800 2 1800 .6 1.5 - 1 .5 0 5 .3 1 .8 1.2
Poly|OB Sweep Pad|p s .6 1 .4 16 900 3 4000 .8 2 - .6 .4 2 5 .4 1.2 .85 1.4
Poly|Jump Poly Stab|s s .3 1 .6 12 2500 2 3000 .03 .3 - .8 .7 0 5 .005 .35 .6 .25 1.5
Poly|80s Pulse Pad|p q .4 1 .5 14 2000 1.5 1500 .7 1.8 - .9 .55 3 5.5 .35 1 .85 1.3 0.7
Poly|Dream Poly|p s 0 1 .8 18 3500 1 2000 1 2 - 1 .7 4 6 .5 1.2 .8 1.8
Poly|Unison Keys|s s .5 1 .5 25 2200 1.5 2000 .1 .6 - .5 .6 0 5 .01 .8 .5 .6 1.5`
  .split("\n")
  .map((row) => {
    const [cat, name, vals = ""] = row.split("|");
    const params = {};
    vals.split(" ").forEach((v, i) => {
      if (v && v !== "-") params[PK[i]] = PC[PK[i]] ? PC[PK[i]][v] : +v;
    });
    return { name, cat, params };
  });

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
  name: "Layers",
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
    { name: "Brass Swells (Bb)", dsl: "0:Bb3:12 0:D4:12 0:F4:12 16:Eb4:12 16:G4:12 16:Bb3:12 32:F3:8 32:A3:8 32:C4:8 40:F3:20 40:Bb3:20 40:D4:20" },
    { name: "Drone Pedal (E)", dsl: "0:E2:60 0:B2:60 8:E3:20 32:G3:14 48:F#3:12" },
  ],
  presets: PRESETS,
  ui: {
    theme: { accent: "#7dd3c0", lcd: "#c9f5ea", lcdBg: "#0d2623", edge: "#274944", bg: "#101e1d" },
    logo: ["", "Layers"],
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

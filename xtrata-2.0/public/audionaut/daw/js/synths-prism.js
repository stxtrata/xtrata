// synths-prism.js — jiPRISM, "Spectral Bloom Instrument".
// One tuned fundamental plus six refracting partials. Each partial blooms in
// after the strike (staggered onset + attack), glides from a "refracted"
// (inharmonic) ratio toward the pure harmonic series ("gravity"), decays faster
// the higher it sits ("damping"), and drifts across the stereo field ("orbit").
// A short strike transient FMs only the overtones. Everything is per-note:
// velocity drives strike depth, overtone weight and level; the gate length (dur)
// decides how much of the bloom is heard before every partial is released.
// Node graph per note: ~38 nodes (7+1+1 oscillators), soft-clipped, cleaned on end.
// No imports, samples, fetches or randomness. Ported from the standalone jiPRISM page.

const range = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });

const PRISM_MATERIALS = {
  glass: [1, 2.01, 2.756, 4.08, 5.404, 6.71, 8.21],
  ceramic: [1, 1.593, 2.135, 2.918, 4.167, 5.431, 6.789],
  bronze: [1, 2.32, 3.18, 4.76, 6.27, 7.91, 9.63],
};
const PRISM_WEIGHTS = [1, 0.46, 0.32, 0.23, 0.17, 0.12, 0.085];
const MATERIALS = ["glass", "ceramic", "bronze"];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const num = (n, d) => (typeof n === "number" && Number.isFinite(n) ? n : d);
const KGAIN = 0.2; // per-note headroom constant (tuned for default RMS)

// soft clip: ~linear below 0.5, asymptote 0.92 — never reaches 1.0
let clipCurve = null;
const softClipCurve = () => {
  if (!clipCurve) {
    clipCurve = new Float32Array(2049);
    for (let i = 0; i < clipCurve.length; i++) {
      const x = (i / 1024 - 1) * 2; // -2..2
      clipCurve[i] = 0.92 * Math.tanh(x / 0.92);
    }
  }
  return clipCurve;
};

// Envelope on an AudioParam with explicit segments, so the gate-release can
// start from the exact (analytic) value even in the middle of attack/decay.
function prismEnvelope(param, onset, peak, attack, decay, sustain) {
  const segs = [];
  let lastT = onset;
  let lastV = 0;
  param.setValueAtTime(0, 0);
  param.setValueAtTime(0, onset);
  const append = (to, value, kind = "linear") => {
    segs.push({ a: lastT, b: to, x: lastV, y: value, kind });
    param[kind === "exp" ? "exponentialRampToValueAtTime" : "linearRampToValueAtTime"](value, to);
    lastT = to;
    lastV = value;
  };
  append(onset + attack, peak);
  append(lastT + decay, peak * Math.max(0.00001, sustain), "exp");
  if (sustain === 0) append(lastT + 0.006, 0);

  const stateAt = (time) => {
    if (time <= onset) return { value: 0, kind: "linear" };
    let value = 0;
    for (const s of segs) {
      if (time < s.a) break;
      if (time <= s.b) {
        const q = clamp((time - s.a) / (s.b - s.a), 0, 1);
        return { value: s.kind === "exp" ? s.x * (s.y / s.x) ** q : s.x + (s.y - s.x) * q, kind: s.kind };
      }
      value = s.y;
    }
    return { value, kind: "hold" };
  };
  return {
    release(time, seconds) {
      const { value, kind } = stateAt(time);
      param.cancelScheduledValues(time);
      if (kind === "exp" && value > 0) param.exponentialRampToValueAtTime(value, time);
      else if (kind === "linear" && time > onset) param.linearRampToValueAtTime(value, time);
      else param.setValueAtTime(value, time);
      for (let i = segs.length - 1; i >= 0; --i) {
        if (segs[i].a >= time) segs.splice(i, 1);
        else if (segs[i].b > time) {
          segs[i].b = time;
          segs[i].y = value;
        }
      }
      lastT = time;
      lastV = value;
      if (value > 0) {
        append(time + Math.max(0.002, seconds - 0.006), value * 0.00001, "exp");
        append(time + seconds, 0);
      } else {
        param.setValueAtTime(0, time + seconds);
      }
    },
  };
}

const prismParams = [
  { key: "material", label: "Material", type: "select", def: "glass", options: MATERIALS },
  range("refraction", "Refraction", 0, 1, 0.01, 0.48),
  range("bloom", "Bloom", 0, 2, 0.01, 0.42),
  range("gravity", "Gravity", 0, 1, 0.01, 0.65),
  range("strike", "Strike", 0, 1, 0.01, 0.32),
  range("damping", "Damping", 0, 1, 0.01, 0.4),
  range("orbit", "Orbit", 0, 1, 0.01, 0.24),
  range("rate", "Orbit Rate", 0.03, 6, 0.01, 0.17),
  range("width", "Stereo Width", 0, 1, 0.01, 0.72),
  range("cutoff", "Cutoff", 100, 14000, 10, 7200),
  range("attack", "Attack", 0.002, 3, 0.002, 0.006),
  range("decay", "Decay", 0.03, 4, 0.01, 1.4),
  range("sustain", "Sustain", 0, 1, 0.01, 0.2),
  range("release", "Release", 0.02, 6, 0.01, 2.2),
  range("level", "Output Level", 0, 1.5, 0.01, 0.9),
];

// Additive sketch of the note shape (A3, 1 s at 16 kHz) for the panel display:
// shows bloom stagger, per-partial decay and the gravity glide as an envelope.
function prismScope(P) {
  const sr = 16000;
  const n = sr;
  const out = new Float32Array(n);
  const base = 220;
  const pal = PRISM_MATERIALS[MATERIALS.includes(P.material) ? P.material : "glass"];
  const gate = 0.55;
  const TAU = 2 * Math.PI;
  for (let i = 0; i < pal.length; i++) {
    const spread = i / (pal.length - 1);
    const harmonic = i + 1;
    const r0 = harmonic + (pal[i] - harmonic) * P.refraction;
    const r1 = harmonic + (r0 - harmonic) * (1 - P.gravity);
    const onset = i ? P.bloom * spread ** 1.15 : 0;
    if (onset >= gate) continue;
    const att = Math.max(0.002, P.attack + (i ? P.bloom * spread * 0.26 : 0));
    const dec = Math.max(0.02, P.decay / (1 + P.damping * i * 0.6));
    const sus = P.sustain * (i ? 1 - P.damping * 0.65 : 1);
    const rel = Math.max(0.02, P.release / (1 + P.damping * spread));
    const glideT = onset + 0.12 + P.bloom * 1.5 + P.decay * 0.3;
    const amp = PRISM_WEIGHTS[i] * (i ? 1.1 : 1);
    const f0 = base * r0;
    const fRatio = r1 / r0;
    const start = Math.floor(onset * sr);
    const decK = Math.exp((-9.2 / dec) / sr); // per 2-sample step
    const relK = Math.exp((-13.8 / rel) / sr);
    const gateIdx = Math.floor(gate * sr);
    const attN = Math.max(1, Math.floor(att * sr));
    let decayPart = 1; // (1 - sus) * exp(...) term
    let relGain = 1;
    let atGate = 0;
    let ph = 0;
    for (let k = start & ~1; k < n; k += 2) { // half-rate, interpolated below (display only)
      const t = k / sr;
      const f = f0 * (fRatio === 1 ? 1 : fRatio ** Math.min(1, t / glideT));
      if (f > sr * 0.45) break;
      ph += (TAU * f * 2) / sr;
      const j = Math.max(0, k - start);
      let e;
      if (j < attN) e = j / attN;
      else {
        decayPart *= decK;
        e = sus + (1 - sus) * decayPart;
      }
      if (k >= gateIdx) {
        if (k === gateIdx) atGate = e;
        relGain *= relK;
        e = atGate * relGain;
      }
      out[k] += Math.sin(ph) * e * amp;
    }
  }
  for (let k = 1; k < n - 1; k += 2) out[k] = 0.5 * (out[k - 1] + out[k + 1]);
  for (let k = 0; k < n; k++) out[k] = Math.tanh(out[k] * 0.55) * 0.9;
  return out;
}

const ICON_GLASS = '<path d="M12 2 L22 12 L12 22 L2 12 Z M12 2 L8 12 L12 22 M2 12 H22"/>';
const ICON_CERAMIC = '<path d="M5 4 H19 L17 19 Q12 23 7 19 Z M4 4 H20"/>';
const ICON_BRONZE = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>';

export const PRISM_SYNTHS = {
  prism: {
    name: "jiPRISM",
    tagline: "Spectral bloom — strike a note, watch its harmonics unfold",
    color: "#73e0db",
    params: prismParams,

    voice(ctx, dest, note = {}, input = {}) {
      const P = {};
      for (const p of prismParams)
        P[p.key] = p.type === "select" ? (p.options.includes(input[p.key]) ? input[p.key] : p.def) : clamp(num(+input[p.key], p.def), p.min, p.max);
      const pitch = clamp(num(note.pitch, 60), 0, 127);
      const vel = clamp(num(note.vel, 1), 0, 1.5);
      const time = num(note.time, 0);
      const dur = Math.max(0, num(note.dur, 0.5));
      if (vel < 0.002 || P.level === 0 || dur < 0.005) return;
      const gate = time + dur;
      const stopAt = gate + P.release + 0.025;

      const base = 440 * 2 ** ((pitch - 69) / 12);
      const nyquist = ctx.sampleRate * 0.5;
      if (base >= nyquist * 0.8) return;

      const nodes = [];
      const sources = [];
      const own = (n) => (nodes.push(n), n);
      const gain = (value) => {
        const n = own(ctx.createGain());
        n.gain.value = value;
        return n;
      };
      const osc = (frequency) => {
        const n = own(ctx.createOscillator());
        n.frequency.setValueAtTime(frequency, time);
        sources.push(n);
        return n;
      };

      // output chain: lowpass -> level -> soft clip -> dest
      const clip = own(ctx.createWaveShaper());
      clip.curve = softClipCurve();
      const output = gain(KGAIN * vel * P.level);
      const filter = own(ctx.createBiquadFilter());
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(P.cutoff, nyquist * 0.92), time);
      filter.Q.value = -3.0103; // Butterworth-ish, non-resonant (Q is dB for lowpass)
      filter.connect(output);
      output.connect(clip);
      clip.connect(dest);

      // shared strike modulator: FM burst on the overtones only; harder hits (vel) = more
      let strike = null;
      if (P.strike > 0) {
        const mod = osc(Math.min(base * Math.SQRT2, nyquist * 0.15));
        strike = gain(0);
        const depth = Math.min(base * (0.12 + Math.min(vel, 1.2) * 0.38) * P.strike, nyquist * 0.012);
        strike.gain.setValueAtTime(depth, time);
        strike.gain.exponentialRampToValueAtTime(Math.max(1e-6, depth * 1e-5), time + 0.03 + P.strike * 0.27);
        strike.gain.linearRampToValueAtTime(0, time + 0.05 + P.strike * 0.27);
        mod.connect(strike);
      }
      const orbit = P.orbit > 0 && P.width > 0 ? osc(P.rate) : null;

      const palette = PRISM_MATERIALS[P.material];
      for (let i = 0; i < palette.length; i++) {
        const spread = i / (palette.length - 1);
        const harmonic = i + 1;
        const startRatio = harmonic + (palette[i] - harmonic) * P.refraction;
        const endRatio = harmonic + (startRatio - harmonic) * (1 - P.gravity);
        // fade partials out as they approach Nyquist instead of aliasing
        const maxFreq = base * Math.max(startRatio, endRatio);
        const guard = clamp((nyquist * 0.8 - maxFreq) / (nyquist * 0.2), 0, 1);
        if (guard === 0) continue;
        // late bloom can be inaudible on a short gate — those partials are skipped
        const onset = time + (i ? P.bloom * spread ** 1.15 : 0);
        if (onset >= gate) continue;
        const o = osc(base * startRatio);
        if (i && startRatio !== endRatio)
          o.frequency.exponentialRampToValueAtTime(base * endRatio, onset + 0.12 + P.bloom * 1.5 + P.decay * 0.3);
        if (i && strike) strike.connect(gain(0.3 + 0.7 * spread)).connect(o.frequency);
        const mode = gain(0);
        const peak = PRISM_WEIGHTS[i] * guard * (i ? 0.62 + 0.48 * Math.min(vel, 1.2) : 1);
        const attack = P.attack + (i ? P.bloom * spread * 0.26 : 0);
        const decay = Math.max(0.02, P.decay / (1 + P.damping * i * 0.6));
        const sustain = P.sustain * (i ? 1 - P.damping * 0.65 : 1);
        const env = prismEnvelope(mode.gain, onset, peak, attack, decay, sustain);
        env.release(gate, Math.max(0.012, P.release / (1 + P.damping * spread)));
        o.connect(mode);
        if (i && P.width > 0) {
          const pan = own(ctx.createStereoPanner());
          const sign = i % 2 ? -1 : 1;
          pan.pan.value = sign * P.width * spread * 0.62;
          if (orbit) orbit.connect(gain(sign * P.width * P.orbit * 0.36)).connect(pan.pan);
          mode.connect(pan);
          pan.connect(filter);
        } else mode.connect(filter); // fundamental stays centred
      }

      let pending = sources.length;
      let ended = false;
      const cleanup = () => {
        if (--pending > 0 || ended) return;
        ended = true;
        for (const n of nodes) {
          try {
            n.disconnect();
          } catch {
            /* already gone */
          }
        }
        nodes.length = sources.length = 0;
      };
      for (const s of sources) {
        s.onended = cleanup;
        s.start(time);
        s.stop(stopAt);
      }
    },

    scope: prismScope,

    lines: [
      { name: "Prism Garden (Am)", dsl: "0:A3:6:105 6:E4:4:78 10:B4:3:69 16:C4:6:94 22:G4:4:75 26:E5:3:66 32:F3:6:99 38:C4:4:79 42:G4:3:70 48:E3:6:95 54:B3:4:78 58:D4:6:71" },
      { name: "Glass Architecture", dsl: "0:A3:14:90 0:C4:14:76 0:E4:14:81 16:F3:14:87 16:A3:14:73 16:C4:14:78 32:C4:14:87 32:E4:14:75 32:G4:14:79 48:G3:16:90 48:B3:16:72 48:D4:16:80" },
      { name: "Bronze Footsteps", dsl: "0:A2:2:118 6:A3:2:71 10:E3:3:87 16:A2:3:107 22:C4:2:67 28:G3:3:82 32:F2:3:112 38:C3:2:84 44:E3:3:76 48:E2:3:118 54:B3:2:68 60:E3:4:94" },
      { name: "Tiny Machines", dsl: "0:A4:2:110 3:E5:2:65 8:C5:2:85 11:B4:2:67 16:A4:2:108 20:E5:2:81 24:G5:2:73 27:E5:2:63 32:F4:2:111 35:C5:2:66 40:A4:2:86 43:G4:2:68 48:E4:2:113 52:B4:2:82 56:D5:2:74 60:B4:3:70" },
    ],

    presets: [
      { name: "Prism Garden", params: {} },
      { name: "Pocket Planet", params: { material: "ceramic", refraction: 0.22, bloom: 0.07, gravity: 0.86, strike: 0.18, damping: 0.75, decay: 0.58, sustain: 0, release: 0.85, cutoff: 4800, orbit: 0.1, level: 1.3 } },
      { name: "Glass Cathedral", params: { refraction: 0.74, bloom: 1.25, gravity: 0.27, attack: 0.34, decay: 2.6, sustain: 0.55, release: 4.8, orbit: 0.56, rate: 0.08, width: 1, damping: 0.14, strike: 0.08, cutoff: 9200, level: 0.78 } },
      { name: "Bronze Afterimage", params: { material: "bronze", refraction: 0.9, bloom: 0.16, gravity: 0.14, strike: 0.78, decay: 2.2, sustain: 0, release: 3.2, cutoff: 8900, damping: 0.25, width: 0.8 } },
      { name: "Event Horizon", params: { material: "bronze", refraction: 0.82, bloom: 1.7, gravity: 1, attack: 0.16, decay: 3.4, sustain: 0.62, release: 4.6, strike: 0.06, orbit: 0.86, rate: 0.09, cutoff: 3900, damping: 0.08, width: 1, level: 0.8 } },
      { name: "Ceramic Teeth", params: { material: "ceramic", refraction: 0.8, bloom: 0, gravity: 0.1, strike: 0.9, decay: 0.19, sustain: 0, release: 0.25, damping: 0.8, orbit: 0, width: 0.3, cutoff: 6700, level: 1.5 } },
      { name: "Velvet Satellite", params: { material: "ceramic", refraction: 0.09, bloom: 0.85, gravity: 0.85, strike: 0, attack: 0.8, decay: 2.1, sustain: 0.64, release: 3.9, cutoff: 2400, orbit: 0.38, rate: 0.11, damping: 0.65, level: 0.82 } },
      { name: "Unstable Jewellery", params: { material: "bronze", refraction: 1, bloom: 0.31, gravity: 0.52, strike: 0.68, decay: 1.05, sustain: 0.12, release: 1.9, orbit: 1, rate: 2.4, width: 1, cutoff: 10300, damping: 0.2, level: 0.8 } },
    ],

    ui: {
      theme: { accent: "#73e0db", lcd: "#b6f8ef", lcdBg: "#081817", edge: "#304344", bg: "#152023" },
      logo: ["ji", "PRISM"],
      sub: "SPECTRAL BLOOM INSTRUMENT",
      cc: { 1: "refraction", 16: "bloom", 17: "gravity", 18: "strike", 19: "orbit", 74: "cutoff", 73: "attack", 75: "decay", 70: "sustain", 72: "release", 7: "level" },
      sections: [
        {
          title: "LATTICE",
          items: [
            {
              type: "radio",
              key: "material",
              options: [
                ["glass", "GLASS", ICON_GLASS, "0 0 24 24"],
                ["ceramic", "CERAMIC", ICON_CERAMIC, "0 0 24 24"],
                ["bronze", "BRONZE", ICON_BRONZE, "0 0 24 24"],
              ],
            },
            {
              type: "row",
              items: [
                { type: "knob", key: "refraction", label: "REFRACTION", fmt: "pct", big: true },
                { type: "knob", key: "strike", label: "STRIKE", fmt: "pct" },
              ],
            },
          ],
        },
        {
          title: "SPECTRUM",
          items: [
            { type: "xy", x: { key: "refraction", label: "REFRACTION", fmt: "pct" }, y: { key: "gravity", label: "GRAVITY", fmt: "pct" }, ticks: ["INHARMONIC", "HARMONIC"] },
          ],
        },
        {
          title: "UNFOLD",
          items: [
            {
              type: "row",
              items: [
                { type: "knob", key: "bloom", label: "BLOOM", fmt: "ms", big: true },
                { type: "knob", key: "gravity", label: "GRAVITY", fmt: "pct", big: true },
              ],
            },
          ],
        },
        {
          title: "ORBIT",
          items: [
            {
              type: "row",
              items: [
                { type: "knob", key: "orbit", label: "MOTION", fmt: "pct" },
                { type: "knob", key: "rate", label: "RATE", curve: "log", fmt: "hz" },
                { type: "knob", key: "width", label: "WIDTH", fmt: "pct" },
              ],
            },
          ],
        },
        {
          title: "COLOUR",
          items: [
            {
              type: "row",
              items: [
                { type: "knob", key: "cutoff", label: "CUTOFF", curve: "log", fmt: "hz", big: true },
                { type: "knob", key: "damping", label: "DAMPING", fmt: "pct" },
              ],
            },
          ],
        },
        {
          title: "AMP ENVELOPE",
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
        { title: "OUTPUT", items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }] },
      ],
      scopeLabel: "BLOOM · A3 · 1s",
    },
  },
};

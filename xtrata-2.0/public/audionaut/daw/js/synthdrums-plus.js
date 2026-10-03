// synthdrums-plus.js — the expanded Studio kit: extra kicks, snares, toms, hats,
// cymbals, claps and shakers, synthesised offline in the browser exactly like the
// original kit (no downloads). Keys are stable: they are stored in saved projects.
//
// Kept separate from SYNTH_KIT on purpose: the original 24 kit sounds are frozen
// (the versioned onboard bank is derived from them), so new sounds never touch them.
// Every sound is peak-normalised so a beat doesn't need per-sound level fixes.

const SR = 44100;
const offline = (duration) =>
  new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
    1,
    Math.ceil(SR * duration),
    SR,
  );
const noiseBuffer = (ctx, duration, seed = 1) => {
  const buf = ctx.createBuffer(1, Math.ceil(SR * duration), SR);
  const d = buf.getChannelData(0);
  let s = seed;
  for (let i = 0; i < d.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0; // deterministic: renders are reproducible
    d[i] = s / 2147483648 - 1;
  }
  return buf;
};
const env = (node, t0, peak, decay, curve = 0.0001) => {
  node.gain.setValueAtTime(peak, t0);
  node.gain.exponentialRampToValueAtTime(curve, t0 + decay);
};
const filter = (ctx, type, frequency, Q = 0.7) => {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = Q;
  return f;
};
const shaper = (ctx, drive) => {
  const ws = ctx.createWaveShaper(),
    curve = new Float32Array(257);
  for (let i = 0; i < 257; i++) curve[i] = Math.tanh((i / 128 - 1) * (1 + drive * 6));
  ws.curve = curve;
  return ws;
};
// Output stage shared by every voice: optional drive and low-pass, then out.
const output = (ctx, { drive = 0, lpf = 0 } = {}) => {
  const sum = ctx.createGain();
  let tail = sum;
  if (drive) {
    const ws = shaper(ctx, drive);
    tail.connect(ws);
    tail = ws;
  }
  if (lpf) {
    const lp = filter(ctx, "lowpass", lpf);
    tail.connect(lp);
    tail = lp;
  }
  tail.connect(ctx.destination);
  return sum;
};
const noiseBurst = (ctx, out, { start = 0, length, seed, amount, decay, hpf, lpf, bp, bpQ }) => {
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, length ?? decay + 0.05, seed);
  const g = ctx.createGain();
  env(g, start, amount, decay);
  let node = n;
  for (const f of [
    hpf && filter(ctx, "highpass", hpf),
    lpf && filter(ctx, "lowpass", lpf),
    bp && filter(ctx, "bandpass", bp, bpQ ?? 1),
  ].filter(Boolean)) {
    node.connect(f);
    node = f;
  }
  node.connect(g).connect(out);
  n.start(start);
};

// --- generators -------------------------------------------------------------

async function kick({
  freq = 120, end = 0.28, drop = 0.08, decay = 0.35, click = 0.4, clickHz = 1500,
  thump = 0, wave = "sine", drive = 0, lpf = 0,
}) {
  const ctx = offline(decay + 0.12);
  const out = output(ctx, { drive, lpf });
  const osc = ctx.createOscillator();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, 0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(28, freq * end), drop);
  const g = ctx.createGain();
  env(g, 0, 1, decay);
  osc.connect(g).connect(out);
  osc.start(0);
  osc.stop(decay + 0.08);
  if (click > 0)
    noiseBurst(ctx, out, { length: 0.03, seed: 7, amount: click * 0.6, decay: 0.02, hpf: clickHz });
  if (thump > 0)
    noiseBurst(ctx, out, { length: 0.12, seed: 9, amount: thump, decay: Math.min(0.1, decay), lpf: 220 });
  return ctx.startRendering();
}

async function snare({
  tone = 190, shell = 0, decay = 0.2, noise = 0.9, body = 0.5, hpf = 900, lpf = 0,
  bp = 0, bpQ = 1, attack = 0, drive = 0, ring = 0.6,
}) {
  const ctx = offline(decay + 0.15);
  const out = output(ctx, { drive });
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, decay + 0.1, 3);
  const ng = ctx.createGain();
  if (attack) {
    ng.gain.setValueAtTime(0.001, 0);
    ng.gain.exponentialRampToValueAtTime(noise, attack);
    ng.gain.exponentialRampToValueAtTime(0.0001, decay);
  } else env(ng, 0, noise, decay);
  let node = n;
  for (const f of [
    hpf && filter(ctx, "highpass", hpf),
    lpf && filter(ctx, "lowpass", lpf),
    bp && filter(ctx, "bandpass", bp, bpQ),
  ].filter(Boolean)) {
    node.connect(f);
    node = f;
  }
  node.connect(ng).connect(out);
  n.start(0);
  for (const [f, amt] of [[tone, body], [shell, body * 0.6]]) {
    if (!f || !amt) continue;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, 0);
    osc.frequency.exponentialRampToValueAtTime(f * ring, 0.1);
    const og = ctx.createGain();
    env(og, 0, amt, decay * 0.55);
    osc.connect(og).connect(out);
    osc.start(0);
    osc.stop(decay + 0.05);
  }
  return ctx.startRendering();
}

// A rim/side-stick: short bright click plus a low "knock".
async function stick({ freq = 1750, bpHz = 3800, Q = 2, decay = 0.03, knock = 0, knockHz = 400, wave = "square" }) {
  const ctx = offline(0.14);
  const out = output(ctx);
  const o = ctx.createOscillator();
  o.type = wave;
  o.frequency.value = freq;
  const g = ctx.createGain();
  env(g, 0, 0.6, decay);
  o.connect(filter(ctx, "bandpass", bpHz, Q)).connect(g).connect(out);
  o.start(0);
  o.stop(0.08);
  if (knock) {
    const k = ctx.createOscillator();
    k.type = "sine";
    k.frequency.setValueAtTime(knockHz, 0);
    k.frequency.exponentialRampToValueAtTime(knockHz * 0.7, 0.05);
    const kg = ctx.createGain();
    env(kg, 0, knock, 0.06);
    k.connect(kg).connect(out);
    k.start(0);
    k.stop(0.1);
  }
  noiseBurst(ctx, out, { length: 0.03, seed: 5, amount: 0.25, decay: 0.012, hpf: 2500 });
  return ctx.startRendering();
}

async function tom({ freq = 140, end = 0.55, decay = 0.35, skin = 0.3, wave = "sine", drive = 0 }) {
  const ctx = offline(decay + 0.12);
  const out = output(ctx, { drive });
  const osc = ctx.createOscillator();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, 0);
  osc.frequency.exponentialRampToValueAtTime(freq * end, decay);
  const g = ctx.createGain();
  env(g, 0, 0.9, decay);
  osc.connect(g).connect(out);
  osc.start(0);
  osc.stop(decay + 0.08);
  // a touch of stick on skin so toms read as drums, not blips
  if (skin > 0)
    noiseBurst(ctx, out, { length: 0.04, seed: 13, amount: skin, decay: 0.025, bp: 1800, bpQ: 0.8 });
  return ctx.startRendering();
}

async function hat({ decay = 0.06, hpf = 7000, bpHz = 10000, Q = 0.8, pitch = 1, tail = 0, tailDecay = 0 }) {
  const ctx = offline(Math.max(decay, tailDecay) + 0.12);
  const out = output(ctx);
  const freqs = [263, 400, 421, 474, 587, 845];
  const g = ctx.createGain();
  env(g, 0, 0.5, decay);
  const bp = filter(ctx, "bandpass", bpHz, Q);
  freqs.forEach((f) => {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f * 4 * pitch;
    o.connect(bp);
    o.start(0);
    o.stop(Math.max(decay, tailDecay) + 0.08);
  });
  bp.connect(filter(ctx, "highpass", hpf)).connect(g).connect(out);
  // two-stage decay for sizzle: a quieter, longer ring behind the strike
  if (tail > 0) {
    const g2 = ctx.createGain();
    env(g2, 0, tail, tailDecay);
    const bp2 = filter(ctx, "bandpass", bpHz, Q);
    freqs.forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f * 4 * pitch;
      o.connect(bp2);
      o.start(0);
      o.stop(tailDecay + 0.08);
    });
    bp2.connect(filter(ctx, "highpass", hpf)).connect(g2).connect(out);
  }
  return ctx.startRendering();
}

async function cymbal({
  decay = 1.2, hpf = 5000, lpf = 0, attack = 0, bell = [], bellGain = 0.3, bellDecay = 0.4,
  tail = 0, tailDecay = 0, bp = 0, bpQ = 0.6,
}) {
  const length = Math.max(decay, tailDecay, bellDecay);
  const ctx = offline(length + 0.15);
  const out = output(ctx);
  noiseBurst(ctx, out, { length: length + 0.1, seed: 31, amount: 0.7, decay, hpf, lpf, bp, bpQ });
  if (tail > 0)
    noiseBurst(ctx, out, { length: length + 0.1, seed: 33, amount: tail, decay: tailDecay, hpf: hpf * 0.8, lpf });
  // metallic "ping" partials: gives ride bow/bell their stick definition
  bell.forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f;
    const g = ctx.createGain();
    env(g, 0, bellGain / (1 + i * 0.4), bellDecay);
    o.connect(filter(ctx, "bandpass", f * 1.6, 2)).connect(g).connect(out);
    o.start(0);
    o.stop(bellDecay + 0.08);
  });
  return ctx.startRendering();
}

async function clap({ decay = 0.25, bursts = [0, 0.012, 0.026, 0.042], bpHz = 1400, Q = 1.4, hpf = 0 }) {
  const ctx = offline(decay + 0.2);
  const out = output(ctx);
  bursts.forEach((t, i) => {
    const last = i === bursts.length - 1;
    noiseBurst(ctx, out, {
      start: t, length: 0.5, seed: 11 + i, amount: last ? 0.9 : 0.5,
      decay: last ? decay : 0.012, bp: bpHz, bpQ: Q, hpf,
    });
  });
  return ctx.startRendering();
}

async function shaker({ decay = 0.09, hpf = 9000, attack = 0.02, jingle = 0, bpHz = 0 }) {
  const ctx = offline(decay + 0.1);
  const out = output(ctx);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, decay + 0.08, 21);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, 0);
  g.gain.exponentialRampToValueAtTime(0.5, attack);
  g.gain.exponentialRampToValueAtTime(0.0001, decay);
  let node = n.connect(filter(ctx, "highpass", hpf));
  if (bpHz) node = node.connect(filter(ctx, "bandpass", bpHz, 0.9));
  node.connect(g).connect(out);
  n.start(0);
  // tambourine jingles: a few short, bright metallic partials
  if (jingle > 0)
    [5200, 6900, 8400, 9800].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      const jg = ctx.createGain();
      env(jg, 0.003 * i, jingle / (1 + i * 0.3), decay * 0.7);
      o.connect(filter(ctx, "bandpass", f, 4)).connect(jg).connect(out);
      o.start(0);
      o.stop(decay + 0.08);
    });
  return ctx.startRendering();
}

async function bell({ freqs = [540, 800], decay = 0.3, bpHz = 800, Q = 3 }) {
  const ctx = offline(decay + 0.12);
  const out = output(ctx);
  freqs.forEach((f) => {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f;
    const g = ctx.createGain();
    env(g, 0, 0.35, decay);
    o.connect(filter(ctx, "bandpass", bpHz, Q)).connect(g).connect(out);
    o.start(0);
    o.stop(decay + 0.08);
  });
  return ctx.startRendering();
}

// Every sound is scaled to a common peak so the kit is level-matched.
const normalised = (gen, target) => async (params) => {
  const buffer = await gen(params);
  const data = buffer.getChannelData(0);
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  const scale = peak > 0 ? target / peak : 1;
  for (let i = 0; i < data.length; i++) data[i] *= scale;
  return buffer;
};
const def = (label, gen, params, target = 0.9) => ({
  label,
  gen: normalised(gen, target),
  params,
  plus: true,
});

export const SYNTH_KIT_PLUS = {
  // ------------------------------------------------------------------ kicks
  "kick-tight": def("Kick — Tight", kick, { freq: 130, end: 0.3, drop: 0.04, decay: 0.2, click: 0.5 }),
  "kick-boom": def("Kick — Boom", kick, { freq: 72, end: 0.55, drop: 0.2, decay: 0.95, click: 0.1 }),
  "kick-909": def("Kick — 909 Punch", kick, { freq: 165, end: 0.27, drop: 0.05, decay: 0.38, click: 0.65 }),
  "kick-dry": def("Kick — Dry", kick, { freq: 110, end: 0.4, drop: 0.035, decay: 0.2, click: 0.35, lpf: 3500 }),
  "kick-thump": def("Kick — Thump", kick, { freq: 90, end: 0.45, drop: 0.06, decay: 0.3, click: 0, thump: 0.5 }),
  "kick-lofi": def("Kick — Lo-Fi", kick, { freq: 95, end: 0.4, drop: 0.07, decay: 0.3, click: 0.15, lpf: 1800, drive: 0.25 }),
  "kick-ac-soft": def("Kick — Acoustic Soft", kick, { freq: 78, end: 0.55, drop: 0.05, decay: 0.28, click: 0.25, clickHz: 2500, thump: 0.6, wave: "triangle", lpf: 5000 }),
  "kick-ac-big": def("Kick — Acoustic Big", kick, { freq: 66, end: 0.6, drop: 0.07, decay: 0.45, click: 0.35, clickHz: 2200, thump: 0.8, wave: "triangle", lpf: 6000 }),
  "kick-gabber": def("Kick — Distorted", kick, { freq: 150, end: 0.25, drop: 0.09, decay: 0.5, click: 0.5, drive: 0.9 }),
  "kick-trap": def("Kick — Long Sub", kick, { freq: 58, end: 0.6, drop: 0.12, decay: 1.1, click: 0 }),

  // ----------------------------------------------------------------- snares
  "snare-909": def("Snare — 909", snare, { tone: 185, shell: 330, decay: 0.2, noise: 1, body: 0.45, hpf: 1100 }),
  "snare-piccolo": def("Snare — Piccolo", snare, { tone: 340, shell: 520, decay: 0.12, noise: 0.9, body: 0.4, hpf: 1800 }),
  "snare-crack": def("Snare — Crack", snare, { tone: 240, decay: 0.17, noise: 1, body: 0.35, hpf: 1600, drive: 0.15 }),
  "snare-lofi": def("Snare — Lo-Fi", snare, { tone: 170, decay: 0.26, noise: 0.8, body: 0.55, hpf: 450, lpf: 5500, drive: 0.2 }),
  "snare-brush": def("Snare — Brush", snare, { tone: 0, decay: 0.28, noise: 0.8, body: 0, hpf: 2200, lpf: 9000, attack: 0.012 }),
  "snare-gated": def("Snare — Gated", snare, { tone: 200, shell: 360, decay: 0.13, noise: 1, body: 0.6, hpf: 800 }),
  "snare-electro": def("Snare — Electro", snare, { tone: 280, shell: 420, decay: 0.17, noise: 0.7, body: 0.9, hpf: 1400, ring: 0.45 }),
  "snare-deep": def("Snare — Deep", snare, { tone: 140, shell: 230, decay: 0.34, noise: 0.9, body: 0.8, hpf: 500 }),
  "snare-open": def("Snare — Open Wire", snare, { tone: 210, shell: 340, decay: 0.38, noise: 1, body: 0.5, hpf: 900, bp: 4500, bpQ: 0.4 }),
  "snare-ghost": def("Snare — Ghost", snare, { tone: 200, decay: 0.09, noise: 0.7, body: 0.35, hpf: 1300 }, 0.5),
  "sidestick": def("Side Stick", stick, { freq: 1150, bpHz: 2000, Q: 1.4, decay: 0.045, knock: 0.35, knockHz: 420 }),
  "sidestick-hi": def("Side Stick — Bright", stick, { freq: 1900, bpHz: 3200, Q: 1.6, decay: 0.035, knock: 0.2, knockHz: 520 }),
  "rim-tick": def("Rim — Tick", stick, { freq: 2600, bpHz: 4500, Q: 2.5, decay: 0.02, wave: "square" }, 0.7),

  // ------------------------------------------------------------------- toms
  "tom-rack-1": def("Tom — Rack 1 (High)", tom, { freq: 250, end: 0.7, decay: 0.28, skin: 0.35 }),
  "tom-rack-2": def("Tom — Rack 2 (Mid)", tom, { freq: 200, end: 0.68, decay: 0.32, skin: 0.35 }),
  "tom-rack-3": def("Tom — Rack 3 (Low)", tom, { freq: 160, end: 0.66, decay: 0.38, skin: 0.35 }),
  "tom-floor-1": def("Tom — Floor 1", tom, { freq: 118, end: 0.62, decay: 0.5, skin: 0.3 }),
  "tom-floor-2": def("Tom — Floor 2 (Low)", tom, { freq: 92, end: 0.6, decay: 0.6, skin: 0.3 }),
  "tom-elec-hi": def("Tom — Electro High", tom, { freq: 330, end: 0.35, decay: 0.22, skin: 0, wave: "sine" }),
  "tom-elec-mid": def("Tom — Electro Mid", tom, { freq: 230, end: 0.35, decay: 0.26, skin: 0 }),
  "tom-elec-lo": def("Tom — Electro Low", tom, { freq: 150, end: 0.35, decay: 0.32, skin: 0 }),

  // ------------------------------------------------------------------- hats
  "hat-closed-tight": def("Hat — Closed Tight", hat, { decay: 0.035, hpf: 8500 }, 0.7),
  "hat-closed-soft": def("Hat — Closed Soft", hat, { decay: 0.045, hpf: 7500, bpHz: 8500 }, 0.5),
  "hat-closed-bright": def("Hat — Closed Bright", hat, { decay: 0.07, hpf: 6500, Q: 1.2 }, 0.8),
  "hat-pedal": def("Hat — Pedal Chick", hat, { decay: 0.055, hpf: 3500, bpHz: 6500, pitch: 0.75 }, 0.6),
  "hat-tap": def("Hat — Tap", hat, { decay: 0.022, hpf: 9500 }, 0.45),
  "hat-half": def("Hat — Half Open", hat, { decay: 0.17, hpf: 6500, Q: 1.5 }, 0.75),
  "hat-open-short": def("Hat — Open Short", hat, { decay: 0.24, hpf: 6500, Q: 2 }, 0.8),
  "hat-open-long": def("Hat — Open Long", hat, { decay: 0.5, hpf: 6000, Q: 2.5 }, 0.8),
  "hat-sizzle": def("Hat — Sizzle", hat, { decay: 0.2, hpf: 6000, Q: 2, tail: 0.18, tailDecay: 0.7 }, 0.75),

  // --------------------------------------------------------------- cymbals
  "ride-bow": def("Ride — Bow", cymbal, { decay: 0.9, hpf: 6500, bell: [1180, 1670], bellGain: 0.18, bellDecay: 0.18 }, 0.8),
  "ride-bell": def("Ride — Bell", cymbal, { decay: 0.6, hpf: 7500, bell: [1190, 1840, 2790], bellGain: 0.5, bellDecay: 0.7, tail: 0.1, tailDecay: 0.9 }, 0.8),
  "ride-soft": def("Ride — Soft", cymbal, { decay: 1.1, hpf: 7000, lpf: 12000, bell: [1180], bellGain: 0.1, bellDecay: 0.15 }, 0.55),
  "crash-1": def("Crash — Bright", cymbal, { decay: 1.7, hpf: 4200, tail: 0.25, tailDecay: 2.2 }, 0.85),
  "crash-2": def("Crash — Dark", cymbal, { decay: 1.4, hpf: 3000, lpf: 11000, tail: 0.25, tailDecay: 1.9 }, 0.85),
  "crash-short": def("Crash — Short", cymbal, { decay: 0.7, hpf: 4500 }, 0.8),
  "splash": def("Splash", cymbal, { decay: 0.4, hpf: 6000 }, 0.75),
  "china": def("China", cymbal, { decay: 0.9, hpf: 3200, bp: 3500, bpQ: 0.35, tail: 0.2, tailDecay: 1.2 }, 0.8),

  // ------------------------------------------------------------------ claps
  "clap-tight": def("Clap — Tight", clap, { decay: 0.11, bursts: [0, 0.009, 0.018], bpHz: 1600 }, 0.8),
  "clap-wide": def("Clap — Wide", clap, { decay: 0.34, bursts: [0, 0.014, 0.03, 0.05, 0.07], bpHz: 1200, Q: 1 }, 0.8),
  "clap-lofi": def("Clap — Lo-Fi", clap, { decay: 0.22, bursts: [0, 0.015, 0.032], bpHz: 900, Q: 0.9 }, 0.8),

  // ----------------------------------------------------------------- shakers
  "tambourine": def("Tambourine", shaker, { decay: 0.16, hpf: 6000, attack: 0.004, jingle: 0.5 }, 0.7),
  "tambourine-open": def("Tambourine — Open", shaker, { decay: 0.32, hpf: 5500, attack: 0.004, jingle: 0.6 }, 0.7),
  "shaker-egg": def("Shaker — Egg", shaker, { decay: 0.1, hpf: 5500, attack: 0.012, bpHz: 7000 }, 0.55),
  "shaker-soft": def("Shaker — Soft", shaker, { decay: 0.14, hpf: 7000, attack: 0.03 }, 0.5),
  "cabasa": def("Cabasa", shaker, { decay: 0.08, hpf: 4500, attack: 0.008, bpHz: 5500 }, 0.55),

  // ------------------------------------------------------------------ bells
  "cowbell-hi": def("Cowbell — High", bell, { freqs: [760, 1130], decay: 0.22, bpHz: 1100 }, 0.6),
  "cowbell-lo": def("Cowbell — Low", bell, { freqs: [400, 600], decay: 0.34, bpHz: 600 }, 0.6),
};

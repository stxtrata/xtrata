// synthdrums.js — on-board generative drum synthesis rendered with OfflineAudioContext.
// No samples on disk: every hit is synthesized deterministically from parameters,
// so kits work fully offline and can be pitched/filtered/driven like any sample.

const SR = 44100;

function offline(duration) {
  return new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, Math.ceil(SR * duration), SR);
}

function noiseBuffer(ctx, duration, seed = 1) {
  const buf = ctx.createBuffer(1, Math.ceil(SR * duration), SR);
  const d = buf.getChannelData(0);
  let s = seed;
  for (let i = 0; i < d.length; i++) {
    // deterministic LCG noise so renders are reproducible
    s = (s * 1664525 + 1013904223) >>> 0;
    d[i] = (s / 2147483648) - 1;
  }
  return buf;
}

function env(ctx, node, t0, peak, decay, curve = 0.0001) {
  node.gain.setValueAtTime(peak, t0);
  node.gain.exponentialRampToValueAtTime(curve, t0 + decay);
}

// --- generators -------------------------------------------------------------

async function kick({ freq = 120, drop = 0.08, decay = 0.4, click = 0.5, gain = 1 }) {
  const ctx = offline(decay + 0.1);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, 0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.28), drop);
  const g = ctx.createGain();
  env(ctx, g, 0, gain, decay);
  osc.connect(g).connect(ctx.destination);
  osc.start(0); osc.stop(decay + 0.05);
  if (click > 0) {
    const n = ctx.createBufferSource();
    n.buffer = noiseBuffer(ctx, 0.02, 7);
    const ng = ctx.createGain();
    env(ctx, ng, 0, click * 0.6, 0.02);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
    n.connect(hp).connect(ng).connect(ctx.destination);
    n.start(0);
  }
  return ctx.startRendering();
}

async function snare({ tone = 190, decay = 0.22, noiseAmt = 0.9, bodyAmt = 0.5, hpf = 900 }) {
  const ctx = offline(decay + 0.1);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, decay + 0.05, 3);
  const ng = ctx.createGain();
  env(ctx, ng, 0, noiseAmt, decay);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpf;
  n.connect(hp).connect(ng).connect(ctx.destination);
  n.start(0);
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(tone, 0);
  osc.frequency.exponentialRampToValueAtTime(tone * 0.6, 0.1);
  const og = ctx.createGain();
  env(ctx, og, 0, bodyAmt, decay * 0.6);
  osc.connect(og).connect(ctx.destination);
  osc.start(0); osc.stop(decay);
  return ctx.startRendering();
}

async function hat({ decay = 0.06, hpf = 7000, ring = 0 }) {
  const ctx = offline(decay + 0.1);
  // six detuned squares approximate the classic metallic hat
  const freqs = [263, 400, 421, 474, 587, 845];
  const g = ctx.createGain();
  env(ctx, g, 0, 0.5, decay);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 10000; bp.Q.value = ring ? 3 : 0.8;
  freqs.forEach(f => {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f * 4;
    o.connect(bp); o.start(0); o.stop(decay + 0.05);
  });
  bp.connect(hp).connect(g).connect(ctx.destination);
  return ctx.startRendering();
}

async function clap({ decay = 0.25 }) {
  const ctx = offline(decay + 0.15);
  const bursts = [0, 0.012, 0.026, 0.042];
  bursts.forEach((t, i) => {
    const n = ctx.createBufferSource();
    n.buffer = noiseBuffer(ctx, 0.4, 11 + i);
    const g = ctx.createGain();
    env(ctx, g, t, i === bursts.length - 1 ? 0.9 : 0.5, i === bursts.length - 1 ? decay : 0.012);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 1.4;
    n.connect(bp).connect(g).connect(ctx.destination);
    n.start(t);
  });
  return ctx.startRendering();
}

async function tom({ freq = 140, decay = 0.35 }) {
  const ctx = offline(decay + 0.1);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, 0);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.55, decay);
  const g = ctx.createGain();
  env(ctx, g, 0, 0.9, decay);
  osc.connect(g).connect(ctx.destination);
  osc.start(0); osc.stop(decay + 0.05);
  return ctx.startRendering();
}

async function cowbell({ decay = 0.3 }) {
  const ctx = offline(decay + 0.1);
  [540, 800].forEach(f => {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
    const g = ctx.createGain(); env(ctx, g, 0, 0.35, decay);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 3;
    o.connect(bp).connect(g).connect(ctx.destination);
    o.start(0); o.stop(decay + 0.05);
  });
  return ctx.startRendering();
}

async function rim() {
  const ctx = offline(0.1);
  const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 1750;
  const g = ctx.createGain(); env(ctx, g, 0, 0.5, 0.03);
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 2;
  o.connect(bp).connect(g).connect(ctx.destination);
  o.start(0); o.stop(0.06);
  return ctx.startRendering();
}

async function shaker({ decay = 0.09 }) {
  const ctx = offline(decay + 0.05);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, decay + 0.05, 21);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, 0);
  g.gain.exponentialRampToValueAtTime(0.5, 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, decay);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 9000;
  n.connect(hp).connect(g).connect(ctx.destination);
  n.start(0);
  return ctx.startRendering();
}

async function cymbal({ decay = 1.2, hpf = 5000 }) {
  const ctx = offline(decay + 0.1);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, decay + 0.1, 31);
  const g = ctx.createGain(); env(ctx, g, 0, 0.7, decay);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpf;
  n.connect(hp).connect(g).connect(ctx.destination);
  n.start(0);
  return ctx.startRendering();
}

async function bass808({ note = 41.2, decay = 0.6, drive = 0 }) { // default E1
  const ctx = offline(decay + 0.1);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(note * 2.2, 0);
  osc.frequency.exponentialRampToValueAtTime(note, 0.05);
  const g = ctx.createGain(); env(ctx, g, 0, 0.95, decay);
  let node = osc;
  if (drive > 0) {
    const ws = ctx.createWaveShaper();
    const curve = new Float32Array(257);
    for (let i = 0; i < 257; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * (1 + drive * 6)); }
    ws.curve = curve;
    osc.connect(ws); node = ws;
  }
  node.connect(g).connect(ctx.destination);
  osc.start(0); osc.stop(decay + 0.05);
  return ctx.startRendering();
}

async function zap({ decay = 0.2 }) {
  const ctx = offline(decay + 0.05);
  const o = ctx.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(2200, 0);
  o.frequency.exponentialRampToValueAtTime(60, decay);
  const g = ctx.createGain(); env(ctx, g, 0, 0.6, decay);
  o.connect(g).connect(ctx.destination);
  o.start(0); o.stop(decay + 0.02);
  return ctx.startRendering();
}

// --- kit registry -----------------------------------------------------------
// key → { label, gen, params }. Keys are stored in projects (source.type='synth').

export const SYNTH_KIT = {
  'kick-808':      { label: 'Kick — 808 Deep',        gen: kick,    params: { freq: 100, drop: 0.1, decay: 0.55, click: 0.2 } },
  'kick-punch':    { label: 'Kick — Punchy',          gen: kick,    params: { freq: 150, drop: 0.05, decay: 0.25, click: 0.8 } },
  'kick-hard':     { label: 'Kick — Hard Techno',     gen: kick,    params: { freq: 180, drop: 0.04, decay: 0.3, click: 1 } },
  'kick-sub':      { label: 'Kick — Sub Boom',        gen: kick,    params: { freq: 80, drop: 0.15, decay: 0.8, click: 0 } },
  'snare-tight':   { label: 'Snare — Tight',          gen: snare,   params: { tone: 200, decay: 0.15, noiseAmt: 0.8, bodyAmt: 0.4 } },
  'snare-fat':     { label: 'Snare — Fat',            gen: snare,   params: { tone: 165, decay: 0.3, noiseAmt: 1, bodyAmt: 0.7, hpf: 600 } },
  'snare-rock':    { label: 'Snare — Rock Crack',     gen: snare,   params: { tone: 220, decay: 0.24, noiseAmt: 1, bodyAmt: 0.5, hpf: 1200 } },
  'clap-909':      { label: 'Clap — 909 Style',       gen: clap,    params: { decay: 0.28 } },
  'hat-closed':    { label: 'Hat — Closed',           gen: hat,     params: { decay: 0.05 } },
  'hat-tight':     { label: 'Hat — Tight Tick',       gen: hat,     params: { decay: 0.03, hpf: 9000 } },
  'hat-open':      { label: 'Hat — Open',             gen: hat,     params: { decay: 0.35, ring: 1 } },
  'ride':          { label: 'Ride Cymbal',            gen: cymbal,  params: { decay: 0.8, hpf: 6500 } },
  'crash':         { label: 'Crash Cymbal',           gen: cymbal,  params: { decay: 1.6, hpf: 4500 } },
  'tom-lo':        { label: 'Tom — Low',              gen: tom,     params: { freq: 110, decay: 0.4 } },
  'tom-mid':       { label: 'Tom — Mid',              gen: tom,     params: { freq: 165, decay: 0.32 } },
  'tom-hi':        { label: 'Tom — High',             gen: tom,     params: { freq: 240, decay: 0.25 } },
  'cowbell-808':   { label: 'Cowbell — 808',          gen: cowbell, params: {} },
  'rimshot':       { label: 'Rimshot',                gen: rim,     params: {} },
  'shaker':        { label: 'Shaker',                 gen: shaker,  params: {} },
  'bass-808-e':    { label: '808 Bass — E1',          gen: bass808, params: { note: 41.2 } },
  'bass-808-g':    { label: '808 Bass — G1',          gen: bass808, params: { note: 49 } },
  'bass-808-a':    { label: '808 Bass — A1',          gen: bass808, params: { note: 55 } },
  'bass-808-dist': { label: '808 Bass — E1 Distorted',gen: bass808, params: { note: 41.2, drive: 0.8, decay: 0.5 } },
  'zap':           { label: 'Zap / Laser',            gen: zap,     params: {} }
};

const cache = new Map();

export async function renderSynthSample(key) {
  if (cache.has(key)) return cache.get(key);
  const def = SYNTH_KIT[key];
  if (!def) throw new Error(`Unknown synth sample "${key}"`);
  const buffer = await def.gen({ ...def.params });
  cache.set(key, buffer);
  return buffer;
}

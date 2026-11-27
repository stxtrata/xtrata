// elements-fx.js — the ELEMENTS mixing suite (a nod to Lost Element): six effects that share
// one visual language in their faces. NEON (EQ), IRON (compressor), TITANIUM (limiter), CARBON
// (multiband saturation), HELIUM (reverb) and MERCURY (tempo delay). Same plugin contract as
// plugins.js: { name, role, kind, category, color, params, create, apply, meter?, response?,
// latencySamples?, tailSeconds?, dispose? }. New type ids only, so no saved project changes.
import { PRO_EFFECT_TYPES } from './pro-effects.js';
import { seededRandom } from './synths/resources.js';

const dbToLin = (db) => Math.pow(10, db / 20);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const r = (key, label, min, max, step, def, log = false) => ({ key, label, min, max, step, def, ...(log ? { log: true } : {}) });
const o = (key, label, options, def) => ({ key, label, options: options.map((v) => (Array.isArray(v) ? v : [v, v])), def });
const CATEGORY = 'Elements';
const COMP_LATENCY = 0.006; // DynamicsCompressorNode look-ahead (matches plugins.js)

function biquad(ctx, type) { const f = ctx.createBiquadFilter(); f.type = type; return f; }
// Peaking at 0 dB has b === a, so it is exactly unity: used for "off" bands.
function identity(f) { f.type = 'peaking'; f.frequency.value = 1000; f.Q.value = 1; f.gain.value = 0; }
function chainResponse(filters, freqs, sr, extraDb = 0) {
  const len = freqs.length, f = new Float32Array(len), m = new Float32Array(len), p = new Float32Array(len), out = new Float32Array(len);
  for (let i = 0; i < len; i++) f[i] = clamp(freqs[i], 1, sr * 0.49995);
  for (const filt of filters) { filt.getFrequencyResponse(f, m, p); for (let i = 0; i < len; i++) out[i] += 20 * Math.log10(Math.max(m[i], 1e-9)); }
  for (let i = 0; i < len; i++) out[i] += extraDb;
  return out;
}
const reductionOf = (c) => { const v = c?.reduction; return typeof v === 'number' ? v : v && typeof v.value === 'number' ? v.value : 0; };

// ------------------------------------------------------------------ NEON · parametric EQ
const neon = {
  name: 'NEON', role: 'Elements · Parametric EQ', kind: 'insert', category: CATEGORY, color: '#ff4fd8',
  params: [
    r('hpFreq', 'Low cut (Hz)', 10, 1000, 1, 10, true),
    o('hpSlope', 'Low cut slope', [['12', '12 dB/oct'], ['24', '24 dB/oct']], '12'),
    r('lsFreq', 'Low shelf (Hz)', 30, 1000, 1, 100, true),
    r('lsGain', 'Low shelf gain (dB)', -18, 18, 0.1, 0),
    r('p1Freq', 'Bell 1 (Hz)', 40, 16000, 1, 250, true), r('p1Gain', 'Bell 1 gain (dB)', -18, 18, 0.1, 0), r('p1Q', 'Bell 1 Q', 0.2, 12, 0.01, 1),
    r('p2Freq', 'Bell 2 (Hz)', 40, 16000, 1, 1000, true), r('p2Gain', 'Bell 2 gain (dB)', -18, 18, 0.1, 0), r('p2Q', 'Bell 2 Q', 0.2, 12, 0.01, 1),
    r('p3Freq', 'Bell 3 (Hz)', 40, 16000, 1, 4000, true), r('p3Gain', 'Bell 3 gain (dB)', -18, 18, 0.1, 0), r('p3Q', 'Bell 3 Q', 0.2, 12, 0.01, 1),
    r('hsFreq', 'High shelf (Hz)', 1000, 18000, 1, 8000, true),
    r('hsGain', 'High shelf gain (dB)', -18, 18, 0.1, 0),
    r('lpFreq', 'High cut (Hz)', 1000, 22000, 1, 22000, true),
    r('out', 'Output (dB)', -18, 18, 0.1, 0)
  ],
  create(ctx) {
    const input = ctx.createGain(), outG = ctx.createGain();
    const hp = [biquad(ctx, 'highpass'), biquad(ctx, 'highpass')], ls = biquad(ctx, 'lowshelf');
    const bells = [biquad(ctx, 'peaking'), biquad(ctx, 'peaking'), biquad(ctx, 'peaking')], hs = biquad(ctx, 'highshelf'), lp = biquad(ctx, 'lowpass');
    const chain = [...hp, ls, ...bells, hs, lp];
    let prev = input;
    for (const f of chain) { prev.connect(f); prev = f; }
    prev.connect(outG);
    return { input, output: outG, outG, hp, ls, bells, hs, lp, chain, sr: ctx.sampleRate, outDb: 0 };
  },
  apply(ctx, n, P) {
    const nyq = n.sr * 0.45;
    if (P.hpFreq <= 10.5) { identity(n.hp[0]); identity(n.hp[1]); }
    else {
      const two = String(P.hpSlope) === '24';
      for (const [i, f] of n.hp.entries()) {
        if (i === 1 && !two) { identity(f); continue; }
        f.type = 'highpass'; f.frequency.value = clamp(P.hpFreq, 10, nyq);
        f.Q.value = two ? (i === 0 ? -5.33 : 2.32) : -3.01; // Butterworth Q in dB (spec units)
      }
    }
    n.ls.frequency.value = clamp(P.lsFreq, 10, nyq); n.ls.gain.value = P.lsGain;
    [1, 2, 3].forEach((b, i) => { const f = n.bells[i]; f.frequency.value = clamp(P[`p${b}Freq`], 10, nyq); f.Q.value = P[`p${b}Q`]; f.gain.value = P[`p${b}Gain`]; });
    n.hs.frequency.value = clamp(P.hsFreq, 10, nyq); n.hs.gain.value = P.hsGain;
    if (P.lpFreq >= 21999 || P.lpFreq >= nyq) identity(n.lp);
    else { n.lp.type = 'lowpass'; n.lp.frequency.value = P.lpFreq; n.lp.Q.value = -3.01; }
    n.outDb = P.out; n.outG.gain.value = dbToLin(P.out);
  },
  response: (n, freqs) => chainResponse(n.chain, freqs, n.sr, n.outDb),
  latencySamples: () => 0, tailSeconds: () => 0.05
};

// ------------------------------------------------------------------ IRON · compressor
const CHARACTER = {
  clean: { attack: 1, release: 1, knee: 0, drive: 0 },
  punch: { attack: 2.5, release: 0.7, knee: 0, drive: 0.12 },
  opto: { attack: 1.6, release: 2.4, knee: 10, drive: 0 },
  vintage: { attack: 1.2, release: 1.2, knee: 4, drive: 0.35 }
};
// Unity small-signal gain (slope 1 at zero), so engaging drive never jumps the level;
// peaks are rounded off instead. asym adds even harmonics.
function satCurve(amount, asym = 0) {
  const c = new Float32Array(1025), k = 1 + amount * 6, b = asym * amount * 0.3, slope = k * (1 - Math.tanh(b) ** 2);
  for (let i = 0; i < c.length; i++) { const x = i / 512 - 1; c[i] = (Math.tanh(x * k + b) - Math.tanh(b)) / slope; }
  return c;
}
const iron = {
  name: 'IRON', role: 'Elements · Compressor', kind: 'insert', category: CATEGORY, color: '#9fb4c8',
  params: [
    r('threshold', 'Threshold (dB)', -60, 0, 0.5, -18),
    r('ratio', 'Ratio', 1, 20, 0.1, 3),
    r('attack', 'Attack (s)', 0.0005, 0.2, 0.0005, 0.01),
    r('release', 'Release (s)', 0.02, 1.5, 0.01, 0.2),
    r('knee', 'Knee (dB)', 0, 30, 0.5, 6),
    o('character', 'Character', [['clean', 'Clean'], ['punch', 'Punch'], ['opto', 'Opto'], ['vintage', 'Vintage']], 'clean'),
    r('makeup', 'Makeup (dB)', -12, 24, 0.1, 0),
    r('mix', 'Mix', 0, 1, 0.01, 1),
    r('out', 'Output (dB)', -18, 18, 0.1, 0)
  ],
  create(ctx) {
    const input = ctx.createGain(), output = ctx.createGain(), pre = ctx.createWaveShaper(), c = ctx.createDynamicsCompressor();
    const makeup = ctx.createGain(), wet = ctx.createGain(), dry = ctx.createGain(), dryDelay = ctx.createDelay(0.05), outG = ctx.createGain();
    dryDelay.delayTime.value = Math.floor(ctx.sampleRate * COMP_LATENCY) / ctx.sampleRate; // keep parallel mix phase-aligned
    input.connect(pre).connect(c).connect(makeup).connect(wet).connect(outG);
    input.connect(dryDelay).connect(dry).connect(outG);
    outG.connect(output);
    return { input, output, pre, c, makeup, wet, dry, dryDelay, outG, grHistory: [] };
  },
  apply(ctx, n, P) {
    const ch = CHARACTER[P.character] || CHARACTER.clean;
    n.c.threshold.value = P.threshold; n.c.ratio.value = P.ratio;
    n.c.attack.value = clamp(P.attack * ch.attack, 0, 1); n.c.release.value = clamp(P.release * ch.release, 0, 1);
    n.c.knee.value = clamp(P.knee + ch.knee, 0, 40);
    n.pre.curve = ch.drive > 0 ? satCurve(ch.drive, 1) : null;
    n.makeup.gain.value = dbToLin(P.makeup);
    n.wet.gain.value = P.mix; n.dry.gain.value = 1 - P.mix; n.outG.gain.value = dbToLin(P.out);
  },
  meter: (n) => ({ reduction: reductionOf(n.c) }),
  latencySamples: (sr) => Math.floor(sr * COMP_LATENCY), tailSeconds: (p) => Math.max(0.05, (p.release ?? 0.2) * 2.4)
};

// ------------------------------------------------------------------ TITANIUM · limiter
const ML = PRO_EFFECT_TYPES.masteringLimiter;
const STYLE = { transparent: 1.6, punchy: 0.7, loud: 0.35 };
const titanium = {
  name: 'TITANIUM', role: 'Elements · Lookahead limiter', kind: 'insert', category: CATEGORY, color: '#d8e4ee',
  params: [
    r('gain', 'Input gain (dB)', -12, 24, 0.1, 0),
    r('ceiling', 'Ceiling (dB)', -12, 0, 0.1, -1),
    r('release', 'Release (s)', 0.01, 1, 0.01, 0.12),
    o('style', 'Style', [['transparent', 'Transparent'], ['punchy', 'Punchy'], ['loud', 'Loud']], 'transparent')
  ],
  map: (P) => ({ input: P.gain, ceiling: P.ceiling, release: clamp(P.release * (STYLE[P.style] || 1), 0.02, 2) }),
  create(ctx) {
    const inner = ML.create(ctx);
    return { input: inner.input, output: inner.output, inner, get ready() { return inner.ready; }, get wk() { return inner.wk; }, get workletError() { return inner.workletError; } };
  },
  apply(ctx, n, P) { ML.apply(ctx, n.inner, titanium.map(P)); },
  meter: (n) => n.inner.meter || {},
  dispose: (n) => ML.dispose(n.inner),
  latencySamples: (sr, p = {}) => ML.latencySamples(sr, titanium.map({ gain: 0, ceiling: -1, release: 0.12, style: 'transparent', ...p })),
  tailSeconds: (p = {}) => ML.tailSeconds(titanium.map({ gain: 0, ceiling: -1, release: 0.12, style: 'transparent', ...p }))
};

// ------------------------------------------------------------------ CARBON · multiband saturation
// CARBON band curves over the shaper's [-1, 1] input. Each band scales its signal by 1/2 into
// the shaper and by 2 out of it, so the curve covers ±2 (6 dB of headroom) at unity
// small-signal gain.
function bandCurve(style, drive) {
  if (drive <= 0) return null;
  const c = new Float32Array(2049), k = 1 + drive * (style === 'hard' ? 9 : 6), b = style === 'tube' ? 0.2 * drive : 0, slope = k * (1 - Math.tanh(b) ** 2);
  for (let i = 0; i < c.length; i++) {
    const x = i / 1024 - 1;
    if (style === 'tape') c[i] = Math.atan(x * k) / k;
    else if (style === 'hard') c[i] = (0.85 * clamp(x * k, -1, 1) + 0.15 * Math.tanh(x * k)) / k;
    else c[i] = (Math.tanh(x * k + b) - Math.tanh(b)) / slope;
  }
  return c;
}
function lr4(ctx, type) { const a = biquad(ctx, type), b = biquad(ctx, type); a.Q.value = -3.01; b.Q.value = -3.01; a.connect(b); return [a, b]; }
const carbon = {
  name: 'CARBON', role: 'Elements · Multiband saturation', kind: 'insert', category: CATEGORY, color: '#ff7a3d',
  params: [
    r('xLow', 'Low / mid split (Hz)', 60, 800, 1, 200, true),
    r('xHigh', 'Mid / high split (Hz)', 1000, 10000, 1, 3000, true),
    r('lowDrive', 'Low drive', 0, 1, 0.01, 0), r('midDrive', 'Mid drive', 0, 1, 0.01, 0), r('highDrive', 'High drive', 0, 1, 0.01, 0),
    r('lowGain', 'Low level (dB)', -12, 12, 0.1, 0), r('midGain', 'Mid level (dB)', -12, 12, 0.1, 0), r('highGain', 'High level (dB)', -12, 12, 0.1, 0),
    o('style', 'Style', [['tube', 'Tube'], ['tape', 'Tape'], ['hard', 'Hard']], 'tube'),
    r('mix', 'Mix', 0, 1, 0.01, 1),
    r('out', 'Output (dB)', -18, 18, 0.1, 0)
  ],
  create(ctx) {
    const input = ctx.createGain(), output = ctx.createGain(), wet = ctx.createGain(), dry = ctx.createGain(), sum = ctx.createGain();
    // Linkwitz-Riley 4th-order bands. The low band also passes an LR4 all-pass at the upper
    // split, so the three bands sum back to a flat magnitude response.
    const lowLp = lr4(ctx, 'lowpass'), restHp = lr4(ctx, 'highpass'), midLp = lr4(ctx, 'lowpass'), highHp = lr4(ctx, 'highpass');
    const apLp = lr4(ctx, 'lowpass'), apHp = lr4(ctx, 'highpass'), ap = ctx.createGain();
    input.connect(lowLp[0]); lowLp[1].connect(apLp[0]); lowLp[1].connect(apHp[0]); apLp[1].connect(ap); apHp[1].connect(ap);
    input.connect(restHp[0]); restHp[1].connect(midLp[0]); restHp[1].connect(highHp[0]);
    // Oversampling stays off: its group delay would only apply to driven bands and smear the sum.
    const bands = [ap, midLp[1], highHp[1]].map((src) => {
      const pre = ctx.createGain(), sh = ctx.createWaveShaper(), g = ctx.createGain();
      pre.gain.value = 0.5; sh.oversample = 'none';
      src.connect(pre).connect(sh).connect(g).connect(sum);
      return { pre, sh, g };
    });
    sum.connect(wet).connect(output); input.connect(dry).connect(output);
    return { input, output, wet, dry, bands, splits: { lowLp, restHp, midLp, highHp, apLp, apHp }, sr: ctx.sampleRate, outDb: 0 };
  },
  apply(ctx, n, P) {
    const nyq = n.sr * 0.45, lo = clamp(P.xLow, 20, nyq), hi = clamp(Math.max(P.xHigh, P.xLow * 1.5), 20, nyq);
    for (const f of [...n.splits.lowLp, ...n.splits.restHp]) f.frequency.value = lo;
    for (const f of [...n.splits.midLp, ...n.splits.highHp, ...n.splits.apLp, ...n.splits.apHp]) f.frequency.value = hi;
    const out = dbToLin(P.out);
    ['low', 'mid', 'high'].forEach((b, i) => { n.bands[i].sh.curve = bandCurve(P.style, P[`${b}Drive`]); n.bands[i].g.gain.value = 2 * dbToLin(P[`${b}Gain`]); });
    n.wet.gain.value = P.mix * out; n.dry.gain.value = (1 - P.mix) * out;
    n.P = P;
  },
  latencySamples: () => 0, tailSeconds: () => 0.05
};

// ------------------------------------------------------------------ HELIUM · reverb
const SPACES = {
  room: { early: [0.004, 0.007, 0.011, 0.016, 0.021, 0.027, 0.034], gain: 0.55, density: 1 },
  hall: { early: [0.012, 0.019, 0.027, 0.041, 0.055, 0.072, 0.09], gain: 0.4, density: 0.8 },
  plate: { early: [], gain: 0, density: 1.4 },
  chamber: { early: [0.007, 0.012, 0.018, 0.024, 0.033, 0.045], gain: 0.5, density: 1.1 }
};
// A seeded stereo impulse: early reflections for the space, then an exponentially decaying
// noise tail whose brightness falls over time (frequency-dependent decay).
export function heliumImpulse(sr, P) {
  const space = SPACES[P.space] || SPACES.hall, size = clamp(P.size ?? 1, 0.5, 2), decay = clamp(P.decay ?? 2.4, 0.2, 10);
  const len = Math.ceil(sr * Math.min(12, decay * 1.35 + 0.08)), out = [new Float32Array(len), new Float32Array(len)];
  const random = seededRandom(`helium:${P.space}:${size}`);
  const damp = clamp(P.damping ?? 7000, 500, sr * 0.45);
  for (let ch = 0; ch < 2; ch++) {
    const d = out[ch];
    let lp = 0, energy = 0;
    const onset = Math.floor(sr * (space.early.length ? 0.004 : 0.001) * size);
    const envStep = Math.pow(10, -3 / (decay * sr)), fadeLen = sr * 0.012 * size;
    let env = Math.pow(10, (-3 * onset) / (decay * sr)), a = 0;
    for (let i = onset; i < len; i++) {
      if ((i - onset) % 32 === 0) { const fc = Math.max(300, damp * Math.exp(-i / sr / (decay * 0.7))); a = 1 - Math.exp((-2 * Math.PI * fc) / sr); }
      lp += a * ((random() * 2 - 1) * space.density - lp);
      d[i] = lp * env * Math.min(1, (i - onset) / fadeLen);
      env *= envStep;
    }
    space.early.forEach((tap, k) => { const i = Math.floor((tap * size + (ch ? 0.0013 : 0)) * sr); if (i < len) d[i] += space.gain * (random() > 0.5 ? 1 : -1) / (1 + k * 0.35); });
    for (let i = 0; i < len; i++) energy += d[i] * d[i];
    const scale = 0.6 / Math.sqrt(Math.max(1e-9, energy));
    for (let i = 0; i < len; i++) d[i] *= scale;
  }
  return out;
}
const helium = {
  name: 'HELIUM', role: 'Elements · Reverb', kind: 'fx', category: CATEGORY, color: '#7ef0ff',
  params: [
    o('space', 'Space', [['room', 'Room'], ['hall', 'Hall'], ['plate', 'Plate'], ['chamber', 'Chamber']], 'hall'),
    r('size', 'Size', 0.5, 2, 0.01, 1),
    r('decay', 'Decay (s)', 0.2, 10, 0.05, 2.4),
    r('predelay', 'Pre-delay (ms)', 0, 200, 1, 18),
    r('damping', 'Damping (Hz)', 1000, 20000, 10, 7000, true),
    r('lowcut', 'Low cut (Hz)', 20, 800, 1, 120, true),
    r('width', 'Width', 0, 1, 0.01, 1),
    r('mix', 'Mix', 0, 1, 0.01, 0.3),
    r('out', 'Output (dB)', -18, 18, 0.1, 0)
  ],
  create(ctx) {
    const input = ctx.createGain(), output = ctx.createGain(), dry = ctx.createGain(), wet = ctx.createGain();
    const hp = biquad(ctx, 'highpass'), pre = ctx.createDelay(0.25);
    const convs = [ctx.createConvolver(), ctx.createConvolver()], fades = [ctx.createGain(), ctx.createGain()];
    const split = ctx.createChannelSplitter(2), merge = ctx.createChannelMerger(2), ll = ctx.createGain(), lr = ctx.createGain(), rr = ctx.createGain(), rl = ctx.createGain(), sum = ctx.createGain();
    input.channelCount = 2; input.channelCountMode = 'explicit';
    hp.Q.value = -3.01;
    input.connect(dry).connect(output);
    input.connect(hp).connect(pre);
    convs.forEach((c, i) => { c.normalize = false; pre.connect(c).connect(fades[i]).connect(sum); fades[i].gain.value = i ? 0 : 1; });
    sum.connect(split); split.connect(ll, 0); split.connect(lr, 0); split.connect(rr, 1); split.connect(rl, 1);
    ll.connect(merge, 0, 0); rl.connect(merge, 0, 0); rr.connect(merge, 0, 1); lr.connect(merge, 0, 1);
    merge.connect(wet).connect(output);
    return { input, output, dry, wet, hp, pre, convs, fades, ll, lr, rr, rl, active: 0, irKey: '', sr: ctx.sampleRate };
  },
  apply(ctx, n, P) {
    const key = [P.space, P.size, P.decay, P.damping].join('|');
    if (key !== n.irKey) {
      n.irKey = key;
      const data = heliumImpulse(n.sr, P), buffer = ctx.createBuffer(2, data[0].length, n.sr);
      buffer.copyToChannel(data[0], 0); buffer.copyToChannel(data[1], 1);
      n.irDuration = buffer.duration;
      const live = n.convs[n.active].buffer && typeof ctx.startRendering !== 'function' && ctx.state === 'running';
      const next = live ? 1 - n.active : n.active, t = ctx.currentTime;
      n.convs[next].buffer = buffer;
      if (live) { // crossfade so a parameter drag never clicks
        n.fades[next].gain.setValueAtTime(0, t); n.fades[next].gain.linearRampToValueAtTime(1, t + 0.04);
        n.fades[n.active].gain.setValueAtTime(n.fades[n.active].gain.value, t); n.fades[n.active].gain.linearRampToValueAtTime(0, t + 0.04);
        n.active = next;
      }
    }
    n.hp.frequency.value = clamp(P.lowcut, 10, n.sr * 0.45);
    n.pre.delayTime.value = P.predelay / 1000;
    const w = P.width; n.ll.gain.value = n.rr.gain.value = (1 + w) / 2; n.lr.gain.value = n.rl.gain.value = (1 - w) / 2;
    const out = dbToLin(P.out); n.wet.gain.value = P.mix * out; n.dry.gain.value = (1 - P.mix) * out;
    n.P = P;
  },
  meter: (n) => ({ irDuration: n.irDuration }),
  latencySamples: () => 0,
  tailSeconds: (p = {}) => (p.predelay ?? 18) / 1000 + (p.decay ?? 2.4) * 1.35 + 0.08
};

// ------------------------------------------------------------------ MERCURY · tempo delay
export const MERCURY_DIVS = [['1/16', 0.25], ['1/8', 0.5], ['1/8.', 0.75], ['1/4', 1], ['1/4.', 1.5], ['1/2', 2], ['1 bar', 4], ['free', 0]];
const mercuryTime = (P) => {
  const div = MERCURY_DIVS.find(([k]) => k === P.time);
  return clamp(!div || div[1] === 0 ? (P.ms ?? 375) / 1000 : (60 / (P.bpm || 120)) * div[1], 0.005, 3.9);
};
const mercury = {
  name: 'MERCURY', role: 'Elements · Tempo delay', kind: 'fx', category: CATEGORY, color: '#c3c9d6', tempoSync: true,
  params: [
    o('time', 'Time', MERCURY_DIVS.map(([k]) => [k, k === 'free' ? 'Free (ms)' : k]), '1/8.'),
    r('ms', 'Free time (ms)', 10, 2000, 1, 375),
    r('feedback', 'Feedback', 0, 0.95, 0.01, 0.4),
    r('pingpong', 'Ping-pong', 0, 1, 0.01, 0.5),
    r('hp', 'Feedback low cut (Hz)', 20, 2000, 1, 120, true),
    r('lp', 'Feedback high cut (Hz)', 500, 20000, 10, 6000, true),
    r('wow', 'Wow & flutter', 0, 1, 0.01, 0),
    r('drive', 'Feedback drive', 0, 1, 0.01, 0),
    r('mix', 'Mix', 0, 1, 0.01, 0.3),
    r('out', 'Output (dB)', -18, 18, 0.1, 0)
  ],
  create(ctx) {
    const input = ctx.createGain(), output = ctx.createGain(), dry = ctx.createGain(), wet = ctx.createGain();
    input.channelCount = 2; input.channelCountMode = 'explicit';
    const split = ctx.createChannelSplitter(2), merge = ctx.createChannelMerger(2);
    const side = () => {
      const d = ctx.createDelay(4), hp = biquad(ctx, 'highpass'), lp = biquad(ctx, 'lowpass'), sat = ctx.createWaveShaper(), self = ctx.createGain(), cross = ctx.createGain(), inG = ctx.createGain();
      hp.Q.value = -3.01; lp.Q.value = -3.01;
      inG.connect(d); d.connect(hp).connect(lp).connect(sat);
      sat.connect(self).connect(d);
      return { d, hp, lp, sat, self, cross, inG };
    };
    const L = side(), R = side();
    L.sat.connect(L.cross).connect(R.d); R.sat.connect(R.cross).connect(L.d);
    const rToL = ctx.createGain(); rToL.gain.value = 0;
    input.connect(split); split.connect(L.inG, 0); split.connect(R.inG, 1); split.connect(rToL, 1); rToL.connect(L.inG);
    L.d.connect(merge, 0, 0); R.d.connect(merge, 0, 1);
    merge.connect(wet).connect(output); input.connect(dry).connect(output);
    // Wow (slow) and flutter (fast) modulate both delay times.
    const wow = ctx.createOscillator(), flutter = ctx.createOscillator(), wowG = ctx.createGain(), flG = ctx.createGain();
    wow.frequency.value = 0.55; flutter.frequency.value = 6.3; wowG.gain.value = 0; flG.gain.value = 0;
    wow.connect(wowG); flutter.connect(flG);
    for (const g of [wowG, flG]) { g.connect(L.d.delayTime); g.connect(R.d.delayTime); }
    wow.start(); flutter.start();
    return { input, output, dry, wet, L, R, rToL, wow, flutter, wowG, flG, sr: ctx.sampleRate };
  },
  apply(ctx, n, P) {
    const time = mercuryTime(P), fb = clamp(P.feedback, 0, 0.95), pp = clamp(P.pingpong, 0, 1), nyq = n.sr * 0.45;
    n.seconds = time;
    for (const s of [n.L, n.R]) {
      s.d.delayTime.value = time;
      s.hp.frequency.value = clamp(P.hp, 10, nyq); s.lp.frequency.value = clamp(P.lp, 100, nyq);
      s.self.gain.value = fb * (1 - pp); s.cross.gain.value = fb * pp;
      s.sat.curve = P.drive > 0 ? satCurve(P.drive * 0.8, 0.4) : null;
    }
    // Ping-pong folds the input into the left line, so repeats alternate left, right, left…
    n.R.inG.gain.value = 1 - pp; n.L.inG.gain.value = 1 - pp / 2; n.rToL.gain.value = pp / 2;
    n.wowG.gain.value = P.wow * 0.0035; n.flG.gain.value = P.wow * 0.0004;
    const out = dbToLin(P.out); n.wet.gain.value = P.mix * out; n.dry.gain.value = (1 - P.mix) * out;
    n.P = P;
  },
  meter: (n) => ({ seconds: n.seconds }),
  latencySamples: () => 0,
  tailSeconds: (p = {}) => {
    const time = mercuryTime({ time: '1/8.', ms: 375, bpm: 120, ...p }), fb = clamp(p.feedback ?? 0.4, 0, 0.95);
    return Math.min(30, time * (fb > 0.001 ? Math.ceil(Math.log(1e-4) / Math.log(fb)) : 1));
  }
};

export const ELEMENT_EFFECT_TYPES = { neon, iron, titanium, carbon, helium, mercury };
export const ELEMENT_IDS = Object.keys(ELEMENT_EFFECT_TYPES);

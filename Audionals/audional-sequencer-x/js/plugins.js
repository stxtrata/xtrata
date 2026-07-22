// plugins.js — insert-slot plugin prototypes: EQ, dynamics, gate, and FX units.
// Each type: { name, color, params: [schema], create(ctx) → nodes, apply(ctx, nodes, P) }.
// create() must return { input, output } plus whatever internals apply() needs.
// All are basic-but-real Web Audio implementations meant as default prototypes.

function makeDriveCurve(amount, steps = 0) {
  const curve = new Float32Array(1025);
  const k = 1 + amount * 20;
  for (let i = 0; i < 1025; i++) {
    let x = i / 512 - 1;
    let y = amount > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
    if (steps > 1) y = Math.round(y * steps) / steps; // bit-crush quantize
    curve[i] = y;
  }
  return curve;
}

export const PLUGIN_TYPES = {

  eq3: {
    name: 'EQ — 3 Band', color: '#22d3ee',
    params: [
      { key: 'low', label: 'Low (dB)', min: -18, max: 18, step: 0.5, def: 0 },
      { key: 'lowFreq', label: 'Low Freq', min: 40, max: 600, step: 5, def: 120 },
      { key: 'mid', label: 'Mid (dB)', min: -18, max: 18, step: 0.5, def: 0 },
      { key: 'midFreq', label: 'Mid Freq', min: 200, max: 6000, step: 10, def: 1000 },
      { key: 'high', label: 'High (dB)', min: -18, max: 18, step: 0.5, def: 0 },
      { key: 'highFreq', label: 'High Freq', min: 1500, max: 16000, step: 50, def: 6000 }
    ],
    create(ctx) {
      const lo = ctx.createBiquadFilter(); lo.type = 'lowshelf';
      const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.Q.value = 0.9;
      const hi = ctx.createBiquadFilter(); hi.type = 'highshelf';
      lo.connect(mid).connect(hi);
      return { input: lo, output: hi, lo, mid, hi };
    },
    apply(ctx, n, P) {
      n.lo.gain.value = P.low; n.lo.frequency.value = P.lowFreq;
      n.mid.gain.value = P.mid; n.mid.frequency.value = P.midFreq;
      n.hi.gain.value = P.high; n.hi.frequency.value = P.highFreq;
    }
  },

  comp: {
    name: 'Compressor', color: '#2edb84',
    params: [
      { key: 'threshold', label: 'Threshold (dB)', min: -60, max: 0, step: 1, def: -24 },
      { key: 'ratio', label: 'Ratio', min: 1, max: 20, step: 0.5, def: 4 },
      { key: 'attack', label: 'Attack (s)', min: 0.001, max: 0.3, step: 0.001, def: 0.01 },
      { key: 'release', label: 'Release (s)', min: 0.02, max: 1, step: 0.01, def: 0.25 },
      { key: 'makeup', label: 'Makeup', min: 0, max: 4, step: 0.05, def: 1 }
    ],
    create(ctx) {
      const c = ctx.createDynamicsCompressor();
      const g = ctx.createGain();
      c.connect(g);
      return { input: c, output: g, c, g };
    },
    apply(ctx, n, P) {
      n.c.threshold.value = P.threshold; n.c.ratio.value = P.ratio;
      n.c.attack.value = P.attack; n.c.release.value = P.release;
      n.c.knee.value = 6;
      n.g.gain.value = P.makeup;
    }
  },

  limiter: {
    name: 'Limiter', color: '#a3e635',
    params: [
      { key: 'ceiling', label: 'Ceiling (dB)', min: -24, max: 0, step: 0.5, def: -3 },
      { key: 'release', label: 'Release (s)', min: 0.02, max: 0.5, step: 0.01, def: 0.1 }
    ],
    create(ctx) {
      const c = ctx.createDynamicsCompressor();
      return { input: c, output: c, c };
    },
    apply(ctx, n, P) {
      n.c.threshold.value = P.ceiling; n.c.ratio.value = 20;
      n.c.attack.value = 0.001; n.c.release.value = P.release; n.c.knee.value = 0;
    }
  },

  gate: {
    name: 'Noise Gate', color: '#feca57',
    params: [
      { key: 'threshold', label: 'Threshold (dB)', min: -80, max: 0, step: 1, def: -45 },
      { key: 'attack', label: 'Attack (s)', min: 0.001, max: 0.1, step: 0.001, def: 0.005 },
      { key: 'release', label: 'Release (s)', min: 0.02, max: 1, step: 0.01, def: 0.12 }
    ],
    create(ctx) {
      // control-rate gate: analyser watches level, gain node opens/closes
      const inG = ctx.createGain();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      const gate = ctx.createGain();
      inG.connect(an); inG.connect(gate);
      const nodes = { input: inG, output: gate, an, gate, open: false, buf: new Float32Array(an.fftSize) };
      return nodes;
    },
    apply(ctx, n, P) { n.P = P; },
    // called by the engine's service loop
    service(ctx, n) {
      if (!n.P) return;
      n.an.getFloatTimeDomainData(n.buf);
      let sum = 0;
      for (let i = 0; i < n.buf.length; i++) sum += n.buf[i] * n.buf[i];
      const db = 20 * Math.log10(Math.sqrt(sum / n.buf.length) + 1e-8);
      const shouldOpen = db > n.P.threshold;
      if (shouldOpen !== n.open) {
        n.open = shouldOpen;
        n.gate.gain.setTargetAtTime(shouldOpen ? 1 : 0.0001, ctx.currentTime,
          shouldOpen ? n.P.attack : n.P.release);
      }
    }
  },

  dist: {
    name: 'Distortion', color: '#ff4d4d',
    params: [
      { key: 'drive', label: 'Drive', min: 0, max: 1, step: 0.01, def: 0.4 },
      { key: 'tone', label: 'Tone (Hz)', min: 500, max: 12000, step: 50, def: 5000 },
      { key: 'level', label: 'Level', min: 0, max: 1.5, step: 0.01, def: 0.7 }
    ],
    create(ctx) {
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      const g = ctx.createGain();
      ws.connect(lp).connect(g);
      return { input: ws, output: g, ws, lp, g };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(P.drive);
      n.lp.frequency.value = P.tone;
      n.g.gain.value = P.level;
    }
  },

  crush: {
    name: 'Bitcrusher (lo-fi)', color: '#fb7185',
    params: [
      { key: 'bits', label: 'Bits', min: 2, max: 12, step: 1, def: 6 },
      { key: 'tone', label: 'Tone (Hz)', min: 500, max: 12000, step: 50, def: 7000 },
      { key: 'mix', label: 'Mix', min: 0, max: 1, step: 0.01, def: 1 }
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      const wet = ctx.createGain(); const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(ws).connect(lp).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, ws, lp, wet, dry };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(0, Math.pow(2, P.bits) / 2);
      n.lp.frequency.value = P.tone;
      n.wet.gain.value = P.mix; n.dry.gain.value = 1 - P.mix;
    }
  },

  chorus: {
    name: 'Chorus', color: '#c084fc',
    params: [
      { key: 'rate', label: 'Rate (Hz)', min: 0.05, max: 6, step: 0.05, def: 0.8 },
      { key: 'depth', label: 'Depth (ms)', min: 0.5, max: 12, step: 0.1, def: 3.5 },
      { key: 'mix', label: 'Mix', min: 0, max: 1, step: 0.01, def: 0.5 }
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.1); dl.delayTime.value = 0.02;
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime); lfo.start();
      const wet = ctx.createGain(); const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(dl).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, dl, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth / 1000;
      n.wet.gain.value = P.mix; n.dry.gain.value = 1 - P.mix;
    }
  },

  flanger: {
    name: 'Flanger', color: '#818cf8',
    params: [
      { key: 'rate', label: 'Rate (Hz)', min: 0.05, max: 4, step: 0.05, def: 0.3 },
      { key: 'depth', label: 'Depth (ms)', min: 0.2, max: 5, step: 0.1, def: 2 },
      { key: 'feedback', label: 'Feedback', min: 0, max: 0.9, step: 0.01, def: 0.4 },
      { key: 'mix', label: 'Mix', min: 0, max: 1, step: 0.01, def: 0.5 }
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.05); dl.delayTime.value = 0.004;
      const fb = ctx.createGain();
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime); lfo.start();
      const wet = ctx.createGain(); const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(dl).connect(wet).connect(out);
      dl.connect(fb).connect(dl);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, dl, fb, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth / 1000;
      n.fb.gain.value = P.feedback;
      n.wet.gain.value = P.mix; n.dry.gain.value = 1 - P.mix;
    }
  },

  phaser: {
    name: 'Phaser', color: '#f472b6',
    params: [
      { key: 'rate', label: 'Rate (Hz)', min: 0.05, max: 6, step: 0.05, def: 0.5 },
      { key: 'depth', label: 'Depth', min: 100, max: 2000, step: 10, def: 800 },
      { key: 'base', label: 'Base (Hz)', min: 200, max: 2000, step: 10, def: 500 },
      { key: 'mix', label: 'Mix', min: 0, max: 1, step: 0.01, def: 0.5 }
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const stages = [];
      let node = inG;
      for (let i = 0; i < 4; i++) {
        const ap = ctx.createBiquadFilter(); ap.type = 'allpass'; ap.Q.value = 0.6;
        node.connect(ap); node = ap; stages.push(ap);
      }
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.connect(lg); stages.forEach(s => lg.connect(s.frequency)); lfo.start();
      const wet = ctx.createGain(); const dry = ctx.createGain();
      const out = ctx.createGain();
      node.connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, stages, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth;
      n.stages.forEach(s => { s.frequency.value = P.base; });
      n.wet.gain.value = P.mix; n.dry.gain.value = 1 - P.mix;
    }
  },

  trem: {
    name: 'Tremolo / AutoPan', color: '#54a0ff',
    params: [
      { key: 'rate', label: 'Rate (Hz)', min: 0.1, max: 16, step: 0.1, def: 5 },
      { key: 'depth', label: 'Depth', min: 0, max: 1, step: 0.01, def: 0.6 },
      { key: 'pan', label: 'AutoPan amt', min: 0, max: 1, step: 0.01, def: 0 }
    ],
    create(ctx) {
      const g = ctx.createGain();
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      const plg = ctx.createGain();
      lfo.connect(lg).connect(g.gain);
      if (pan.pan) lfo.connect(plg).connect(pan.pan);
      lfo.start();
      g.connect(pan);
      return { input: g, output: pan, g, pan, lfo, lg, plg };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.g.gain.value = 1 - P.depth / 2;
      n.lg.gain.value = P.depth / 2;
      n.plg.gain.value = P.pan;
    }
  }
};

export const MAX_INSERTS = 4;

export function pluginDefaults(type) {
  const out = {};
  (PLUGIN_TYPES[type]?.params || []).forEach(p => { out[p.key] = p.def; });
  return out;
}

export function makeInsert(type) {
  return { type, enabled: true, params: pluginDefaults(type) };
}

// plugins.js — the one registry for every chain plugin (inserts and FX alike).
// Each type: { name, kind, category, color, params: [schema], create(ctx, env) → nodes,
//              apply(ctx, nodes, P), service?(ctx, nodes), dispose?(nodes) }.
//  - kind: "insert" | "fx" — which panel's Add list offers it. Any registered type can
//    still sit in either chain (old projects keep whatever they had).
//  - category: groups the Add dropdown.
//  - params: { key, label, min, max, step, def, log? } for sliders, or
//            { key, label, options: [[value, label]…], def } for a choice.
//  - create() must return { input, output } plus whatever internals apply() needs.
//    env = { delayBus, reverbBus } — the project's shared delay/reverb returns.
//  - dispose() is optional: the engine already stops every oscillator and disconnects
//    every node it finds in the returned object.
// Adding a plugin = adding one entry here. All are basic-but-real Web Audio units.

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

// The original channel-FX drive curve (257 points, k = 1 + 12·amount).
function softClipCurve(amount) {
  const curve = new Float32Array(257);
  const k = 1 + amount * 12;
  for (let i = 0; i < 257; i++) {
    const x = i / 128 - 1;
    curve[i] = amount > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
  }
  return curve;
}

function makeSend(ctx, bus) {
  const thru = ctx.createGain();
  const send = ctx.createGain();
  send.gain.value = 0;
  thru.connect(send);
  if (bus) send.connect(bus);
  return { input: thru, output: thru, send };
}

export const PLUGIN_TYPES = {
  eq3: {
    name: "EQ — 3 Band",
    kind: "insert",
    category: "Tone",
    color: "#22d3ee",
    params: [
      { key: "low", label: "Low (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "lowFreq",
        label: "Low Freq",
        log: true,
        min: 40,
        max: 600,
        step: 5,
        def: 120,
      },
      { key: "mid", label: "Mid (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "midFreq",
        label: "Mid Freq",
        log: true,
        min: 200,
        max: 6000,
        step: 10,
        def: 1000,
      },
      { key: "high", label: "High (dB)", min: -18, max: 18, step: 0.5, def: 0 },
      {
        key: "highFreq",
        label: "High Freq",
        log: true,
        min: 1500,
        max: 16000,
        step: 50,
        def: 6000,
      },
    ],
    create(ctx) {
      const lo = ctx.createBiquadFilter();
      lo.type = "lowshelf";
      const mid = ctx.createBiquadFilter();
      mid.type = "peaking";
      mid.Q.value = 0.9;
      const hi = ctx.createBiquadFilter();
      hi.type = "highshelf";
      lo.connect(mid).connect(hi);
      return { input: lo, output: hi, lo, mid, hi };
    },
    apply(ctx, n, P) {
      n.lo.gain.value = P.low;
      n.lo.frequency.value = P.lowFreq;
      n.mid.gain.value = P.mid;
      n.mid.frequency.value = P.midFreq;
      n.hi.gain.value = P.high;
      n.hi.frequency.value = P.highFreq;
    },
  },

  comp: {
    name: "Compressor",
    kind: "insert",
    category: "Dynamics",
    color: "#2edb84",
    params: [
      {
        key: "threshold",
        label: "Threshold (dB)",
        min: -60,
        max: 0,
        step: 1,
        def: -24,
      },
      { key: "ratio", label: "Ratio", min: 1, max: 20, step: 0.5, def: 4 },
      {
        key: "attack",
        label: "Attack (s)",
        min: 0.001,
        max: 0.3,
        step: 0.001,
        def: 0.01,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 1,
        step: 0.01,
        def: 0.25,
      },
      { key: "makeup", label: "Makeup", min: 0, max: 4, step: 0.05, def: 1 },
    ],
    create(ctx) {
      const c = ctx.createDynamicsCompressor();
      const g = ctx.createGain();
      c.connect(g);
      return { input: c, output: g, c, g };
    },
    apply(ctx, n, P) {
      n.c.threshold.value = P.threshold;
      n.c.ratio.value = P.ratio;
      n.c.attack.value = P.attack;
      n.c.release.value = P.release;
      n.c.knee.value = 6;
      n.g.gain.value = P.makeup;
    },
  },

  limiter: {
    name: "Limiter",
    kind: "insert",
    category: "Dynamics",
    color: "#a3e635",
    params: [
      {
        key: "ceiling",
        label: "Ceiling (dB)",
        min: -24,
        max: 0,
        step: 0.5,
        def: -3,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 0.5,
        step: 0.01,
        def: 0.1,
      },
    ],
    create(ctx) {
      const c = ctx.createDynamicsCompressor();
      return { input: c, output: c, c };
    },
    apply(ctx, n, P) {
      n.c.threshold.value = P.ceiling;
      n.c.ratio.value = 20;
      n.c.attack.value = 0.001;
      n.c.release.value = P.release;
      n.c.knee.value = 0;
    },
  },

  gate: {
    name: "Noise Gate",
    kind: "insert",
    category: "Dynamics",
    color: "#feca57",
    params: [
      {
        key: "threshold",
        label: "Threshold (dB)",
        min: -80,
        max: 0,
        step: 1,
        def: -45,
      },
      {
        key: "attack",
        label: "Attack (s)",
        min: 0.001,
        max: 0.1,
        step: 0.001,
        def: 0.005,
      },
      {
        key: "release",
        label: "Release (s)",
        min: 0.02,
        max: 1,
        step: 0.01,
        def: 0.12,
      },
    ],
    create(ctx) {
      // control-rate gate: analyser watches level, gain node opens/closes
      const inG = ctx.createGain();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      const gate = ctx.createGain();
      inG.connect(an);
      inG.connect(gate);
      const nodes = {
        input: inG,
        output: gate,
        an,
        gate,
        open: false,
        buf: new Float32Array(an.fftSize),
      };
      return nodes;
    },
    apply(ctx, n, P) {
      n.P = P;
    },
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
        n.gate.gain.setTargetAtTime(
          shouldOpen ? 1 : 0.0001,
          ctx.currentTime,
          shouldOpen ? n.P.attack : n.P.release,
        );
      }
    },
  },

  // ---------------------------------------------------------------- FX: filter
  filter: {
    name: "Filter",
    kind: "fx",
    category: "Filter",
    color: "#38bdf8",
    params: [
      {
        key: "mode",
        label: "Mode",
        options: [
          ["lp", "Low-pass"],
          ["hp", "High-pass"],
          ["bp", "Band-pass"],
        ],
        def: "lp",
      },
      {
        key: "cutoff",
        label: "Cutoff (Hz)",
        min: 20,
        max: 20000,
        step: 1,
        def: 8000,
        log: true,
      },
      { key: "q", label: "Resonance", min: 0.1, max: 18, step: 0.1, def: 0.9 },
    ],
    create(ctx) {
      const f = ctx.createBiquadFilter();
      return { input: f, output: f, f };
    },
    apply(ctx, n, P) {
      n.f.type =
        P.mode === "hp" ? "highpass" : P.mode === "bp" ? "bandpass" : "lowpass";
      n.f.frequency.value = P.cutoff;
      n.f.Q.value = P.q;
    },
  },

  // ---------------------------------------------------------------- FX: drive
  // Same soft-clip curve as the old channel FX drive, so converted projects sound identical.
  drive: {
    name: "Drive",
    kind: "fx",
    category: "Saturation",
    color: "#f97316",
    params: [
      { key: "amount", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.3 },
    ],
    create(ctx) {
      const ws = ctx.createWaveShaper();
      return { input: ws, output: ws, ws };
    },
    apply(ctx, n, P) {
      n.ws.curve = softClipCurve(P.amount);
    },
  },

  dist: {
    name: "Distortion",
    kind: "fx",
    category: "Saturation",
    color: "#ff4d4d",
    params: [
      { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01, def: 0.4 },
      {
        key: "tone",
        label: "Tone (Hz)",
        min: 500,
        max: 12000,
        step: 50,
        def: 5000,
      },
      { key: "level", label: "Level", min: 0, max: 1.5, step: 0.01, def: 0.7 },
    ],
    create(ctx) {
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      const g = ctx.createGain();
      ws.connect(lp).connect(g);
      return { input: ws, output: g, ws, lp, g };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(P.drive);
      n.lp.frequency.value = P.tone;
      n.g.gain.value = P.level;
    },
  },

  crush: {
    name: "Bitcrusher (lo-fi)",
    kind: "fx",
    category: "Saturation",
    color: "#fb7185",
    params: [
      { key: "bits", label: "Bits", min: 2, max: 12, step: 1, def: 6 },
      {
        key: "tone",
        label: "Tone (Hz)",
        min: 500,
        max: 12000,
        step: 50,
        def: 7000,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 1 },
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const ws = ctx.createWaveShaper();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(ws).connect(lp).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, ws, lp, wet, dry };
    },
    apply(ctx, n, P) {
      n.ws.curve = makeDriveCurve(0, Math.pow(2, P.bits) / 2);
      n.lp.frequency.value = P.tone;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  chorus: {
    name: "Chorus",
    kind: "fx",
    category: "Modulation",
    color: "#c084fc",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 6,
        step: 0.05,
        def: 0.8,
      },
      {
        key: "depth",
        label: "Depth (ms)",
        min: 0.5,
        max: 12,
        step: 0.1,
        def: 3.5,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.1);
      dl.delayTime.value = 0.02;
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime);
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      inG.connect(dl).connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, dl, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth / 1000;
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  flanger: {
    name: "Flanger",
    kind: "fx",
    category: "Modulation",
    color: "#818cf8",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 4,
        step: 0.05,
        def: 0.3,
      },
      {
        key: "depth",
        label: "Depth (ms)",
        min: 0.2,
        max: 5,
        step: 0.1,
        def: 2,
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        def: 0.4,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const dl = ctx.createDelay(0.05);
      dl.delayTime.value = 0.004;
      const fb = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg).connect(dl.delayTime);
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
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
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  phaser: {
    name: "Phaser",
    kind: "fx",
    category: "Modulation",
    color: "#f472b6",
    params: [
      {
        key: "rate",
        label: "Rate (Hz)",
        min: 0.05,
        max: 6,
        step: 0.05,
        def: 0.5,
      },
      { key: "depth", label: "Depth", min: 100, max: 2000, step: 10, def: 800 },
      {
        key: "base",
        label: "Base (Hz)",
        min: 200,
        max: 2000,
        step: 10,
        def: 500,
      },
      { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01, def: 0.5 },
    ],
    create(ctx) {
      const inG = ctx.createGain();
      const stages = [];
      let node = inG;
      for (let i = 0; i < 4; i++) {
        const ap = ctx.createBiquadFilter();
        ap.type = "allpass";
        ap.Q.value = 0.6;
        node.connect(ap);
        node = ap;
        stages.push(ap);
      }
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.connect(lg);
      stages.forEach((s) => lg.connect(s.frequency));
      lfo.start();
      const wet = ctx.createGain();
      const dry = ctx.createGain();
      const out = ctx.createGain();
      node.connect(wet).connect(out);
      inG.connect(dry).connect(out);
      return { input: inG, output: out, stages, lfo, lg, wet, dry };
    },
    apply(ctx, n, P) {
      n.lfo.frequency.value = P.rate;
      n.lg.gain.value = P.depth;
      n.stages.forEach((s) => {
        s.frequency.value = P.base;
      });
      n.wet.gain.value = P.mix;
      n.dry.gain.value = 1 - P.mix;
    },
  },

  trem: {
    name: "Tremolo / AutoPan",
    kind: "fx",
    category: "Modulation",
    color: "#54a0ff",
    params: [
      { key: "rate", label: "Rate (Hz)", min: 0.1, max: 16, step: 0.1, def: 5 },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, def: 0.6 },
      { key: "pan", label: "AutoPan amt", min: 0, max: 1, step: 0.01, def: 0 },
    ],
    create(ctx) {
      const g = ctx.createGain();
      const pan = ctx.createStereoPanner
        ? ctx.createStereoPanner()
        : ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
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
    },
  },

  // ---------------------------------------------------------------- FX: sends
  // Pass the signal straight through and tap a copy into the project's shared delay
  // or reverb. Where the send sits in the chain decides what it taps.
  delaySend: {
    name: "Delay send",
    kind: "fx",
    category: "Space",
    color: "#facc15",
    params: [
      { key: "amount", label: "Send", min: 0, max: 1, step: 0.01, def: 0.25 },
    ],
    create(ctx, env) {
      return makeSend(ctx, env?.delayBus);
    },
    apply(ctx, n, P) {
      n.send.gain.value = P.amount;
    },
  },

  reverbSend: {
    name: "Reverb send",
    kind: "fx",
    category: "Space",
    color: "#a78bfa",
    params: [
      { key: "amount", label: "Send", min: 0, max: 1, step: 0.01, def: 0.25 },
    ],
    create(ctx, env) {
      return makeSend(ctx, env?.reverbBus);
    },
    apply(ctx, n, P) {
      n.send.gain.value = P.amount;
    },
  },
};

export const CHAIN_KINDS = ["inserts", "fx"]; // signal order: fader → inserts → FX
export const KIND_OF_CHAIN = { inserts: "insert", fx: "fx" };

export function pluginDefaults(type) {
  const out = {};
  (PLUGIN_TYPES[type]?.params || []).forEach((p) => {
    out[p.key] = p.def;
  });
  return out;
}

// Plugins offered by a chain's Add list, grouped by category in registry order.
export function pluginsFor(chain) {
  const kind = KIND_OF_CHAIN[chain];
  const groups = new Map();
  for (const [id, t] of Object.entries(PLUGIN_TYPES)) {
    if (t.kind !== kind) continue;
    if (!groups.has(t.category)) groups.set(t.category, []);
    groups.get(t.category).push([id, t]);
  }
  return groups;
}

// Short "EQ, Compressor, …" list for button tooltips.
export function pluginNames(chain) {
  return [...pluginsFor(chain).values()]
    .flat()
    .map(([, t]) => t.name)
    .join(", ");
}

let idSeq = 0;
export function slotId() {
  idSeq = (idSeq + 1) % 1e6;
  return `s${Date.now().toString(36)}${idSeq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function makeSlot(type, params) {
  return {
    id: slotId(),
    type,
    enabled: true,
    params: { ...pluginDefaults(type), ...(params || {}) },
  };
}
// Back-compat name used by older call sites.
export const makeInsert = makeSlot;

const MAX_SLOTS = 32; // per chain — a sanity bound for loaded files, not a UI limit

function cleanSlot(raw) {
  if (!raw || typeof raw !== "object" || !PLUGIN_TYPES[raw.type]) return null;
  const t = PLUGIN_TYPES[raw.type];
  const params = {};
  for (const p of t.params) {
    const v = raw.params?.[p.key];
    if (p.options)
      params[p.key] = p.options.some(([o]) => o === v) ? v : p.def;
    else
      params[p.key] = Number.isFinite(+v)
        ? Math.max(p.min, Math.min(p.max, +v))
        : p.def;
  }
  return {
    id: typeof raw.id === "string" && /^[\w-]{1,40}$/.test(raw.id) ? raw.id : slotId(),
    type: raw.type,
    enabled: raw.enabled !== false,
    params,
  };
}

export function cleanChain(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const s = cleanSlot(raw);
    if (!s) continue; // drops the empty (null) slots of the old 4-slot layout
    if (seen.has(s.id)) s.id = slotId();
    seen.add(s.id);
    out.push(s);
    if (out.length >= MAX_SLOTS) break;
  }
  return out;
}

const isLegacyFx = (fx) => !!fx && typeof fx === "object" && !Array.isArray(fx);

// Convert the old fixed channel FX object ({ filter, cutoff, drive, delay, reverb })
// into chain slots. Only settings that did something become slots.
// Returns { pre, post }: filter + drive ran BEFORE the old inserts, the sends after.
export function legacyFxSlots(fx) {
  const pre = [];
  const post = [];
  if (!isLegacyFx(fx)) return { pre, post };
  if (fx.filter === "lp" || fx.filter === "hp")
    pre.push(
      makeSlot("filter", {
        mode: fx.filter,
        cutoff: Math.max(
          20,
          Math.min(20000, +fx.cutoff || (fx.filter === "hp" ? 200 : 8000)),
        ),
        q: 0.9,
      }),
    );
  if (+fx.drive > 0)
    pre.push(makeSlot("drive", { amount: Math.min(1, +fx.drive) }));
  if (+fx.delay > 0)
    post.push(makeSlot("delaySend", { amount: Math.min(1, +fx.delay) }));
  if (+fx.reverb > 0)
    post.push(makeSlot("reverbSend", { amount: Math.min(1, +fx.reverb) }));
  return { pre, post };
}

// Bring a channel or synth to the current shape, in place: fx and inserts become
// clean slot arrays. A legacy fx object converts with the same signal order it had:
// if there were inserts, its filter/drive go to the front of the insert chain
// (they ran before the inserts); otherwise everything lands in the FX chain.
// Returns true if anything changed.
export function normalizeOwner(owner) {
  if (!owner) return false;
  const beforeIns = owner.inserts;
  const beforeFx = owner.fx;
  let inserts = cleanChain(owner.inserts);
  let fx;
  if (isLegacyFx(owner.fx)) {
    const { pre, post } = legacyFxSlots(owner.fx);
    if (inserts.some((s) => s.enabled)) {
      inserts = [...pre, ...inserts];
      fx = post;
    } else fx = [...pre, ...post];
  } else fx = cleanChain(owner.fx);
  // ids key live plugin instances, so they must be unique across both chains
  const insIds = new Set(inserts.map((s) => s.id));
  for (const s of fx) if (insIds.has(s.id)) s.id = slotId();
  const changed =
    JSON.stringify(inserts) !== JSON.stringify(beforeIns) ||
    JSON.stringify(fx) !== JSON.stringify(beforeFx);
  if (changed) {
    owner.inserts = inserts;
    owner.fx = fx;
  }
  return changed;
}

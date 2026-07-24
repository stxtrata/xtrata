/* Proof of Free — Living Synth v4 · deterministic genome module.
 *
 * v4 upgrades over v3:
 *  - Colour is driven by an embedded 32×32 Xtrata logo mask (dark / white /
 *    blue / orange families) instead of a rainbow hue permutation, so the
 *    assembled 1,024-tile mosaic reproduces the logo composition.
 *  - Each family carries a musical ROLE (bell / lead / pad / bass / pulse /
 *    drone / atmos) with its own register, waveforms, envelope and melodic
 *    density — far more sonic variety and a real orchestration map.
 *  - Richer synthesis genome: dual osc + sub, LFO, drive, tempo-synced delay,
 *    reverb send, stereo pan.
 *  - Every tile gets a themed animation (0 / ZERO / PROOF / FREE / NOTHING /
 *    OPEN / BLOCK / CLAIM / SIGNAL / WITNESS / FOREVER / X · spectral-bars ·
 *    scope · orbit) around the "proof of free / nothing / zero" vocabulary.
 *
 * ENGINE_VERSION is baked into every genome. A version-2 genome must sound and
 * render identically under any future v4 engine or be refused.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ProofOfFreeGenome = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ENGINE_VERSION = 2;
  const COLLECTION_ID = "xtrata-living-synth-v4";
  const COLLECTION_SIZE = 1024;
  const GRID = 32;

  /* One global musical framework shared by all 1,024 instruments. */
  const MUSIC = Object.freeze({
    root: "D",
    rootMidi: 50,                                  // D3
    scale: Object.freeze([0, 2, 3, 5, 7, 9, 10]),  // D Dorian
    bpm: 132,
    barsPerLoop: 4,
    stepsPerBar: 16,
    ppq: 96,
    tuningHz: 440
  });
  const STEPS_PER_LOOP = MUSIC.barsPerLoop * MUSIC.stepsPerBar;   // 64
  const TICKS_PER_STEP = (MUSIC.ppq * 4) / MUSIC.stepsPerBar;     // 24
  const TICKS_PER_LOOP = STEPS_PER_LOOP * TICKS_PER_STEP;         // 1536

  const WAVEFORMS = Object.freeze(["sine", "triangle", "sawtooth", "square"]);
  const WORDS = Object.freeze([
    "0", "ZERO", "PROOF", "FREE", "NOTHING", "OPEN",
    "BLOCK", "CLAIM", "SIGNAL", "WITNESS", "FOREVER", "X"
  ]);
  const ANIM_KINDS = Object.freeze(["glyph", "bars", "scope", "orbit"]);
  const ROLES = Object.freeze(["bell", "lead", "pad", "bass", "pulse", "drone", "atmos"]);
  const FAMILIES = Object.freeze(["dark", "white", "blue", "orange"]);

  /* Embedded Xtrata logo mask. '.' dark ground · 'W' white/head ·
   * 'B' blue field · 'O' orange core. Regenerate from a real PNG with
   * scripts/sample-logo.mjs; keep it exactly 32×32. */
  const LOGO_MASK = Object.freeze([
    "................................",
    "................................",
    "................................",
    ".......WWWWWWW........WWWWWWWWWW",
    "...WWWWWWWWWWWWWWW....WWWWWWWWWW",
    "...WWWWWWWWWWWWWWW....WWWWWWWWWW",
    "...WWWWWWWWWWWWWWW......WWWWWWWW",
    "..WWWWWWWWWWWWWWWWW.....WWWWWWWW",
    "..WWWWWWWWWWWWWWWWW.....WWWWWWWW",
    "..WWWWWWWWWWWWWWWWW.B.....WWWWWW",
    "..WWWWWWWWWWWWWWWWWBBBBBB.WWWWWW",
    "..WWWWWWWWWWWWWWWWWBBBBBBBWWWWWW",
    "..BWWWWWWWWWWWWWWWBBBBBBBBBB....",
    "..BWWWWWWWWWWWWWWWBBBBBBBBBBB...",
    "..BWWWWWWWWWWWWWWWBBBBBBBBBBBB..",
    "..BBBBBWWWWWWWBBBBBBBBBBBBBBBB..",
    "..BBBBBWWWWWWWBBBBBBBBBBBBBBBB..",
    "..BBBBBBBOOOOOBBBBBBBBBBBBBBBBB.",
    "..BBBBBOOOOOOOOOBBBBBBBBBBBBBB..",
    "..BBOOOOOOOOOOOOOOBBBBBBBBBBBB..",
    "..BBOOOOOOOOOOOOOOBBBBBBBBBBBB..",
    "..BBOOOOOOOOOOOOOOOBBBBBBBBBB...",
    "..BBOOOOOOOOOOOOOOOBBBBBBBBBB...",
    "..BBOOOOOOOOOOOOOOOBBBBBBBBBB...",
    "..BOOOOOOOOOOOOOOOOOBBBBBBBBB...",
    "..BBOOOOOOOOOOOOOOOBBBBBBBBBB...",
    "..BBOOOOOOOOOOOOOOO.............",
    "..BBOOOOOOOOOOOOOOO.............",
    "....OOOOOOOOOOOOOO..............",
    "....OOOOOOOOOOOOOO..............",
    "....OOOOOOOOOOOOOO..............",
    ".........OOOOO.................."
  ]);
  if (LOGO_MASK.length !== GRID || LOGO_MASK.some(r => r.length !== GRID)) {
    throw new Error("LOGO_MASK must be exactly 32×32.");
  }
  const FAMILY_OF = { ".": "dark", W: "white", B: "blue", O: "orange" };

  /* Deterministic PRNG: splitmix32. No Math.random anywhere. */
  function splitmix32(a) {
    let s = a >>> 0;
    return function () {
      s = (s + 0x9e3779b9) >>> 0;
      let t = s ^ (s >>> 16);
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ (t >>> 15);
      t = Math.imul(t, 0x735a2d97);
      t = t ^ (t >>> 15);
      return (t >>> 0) / 4294967296;
    };
  }
  const q = (v, p) => Number(v.toFixed(p));
  const pick = (rand, arr) => arr[(rand() * arr.length) | 0];
  const lerp = (a, b, t) => a + (b - a) * t;

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    const to = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
    return "#" + to(r) + to(g) + to(b);
  }

  /* Family → palette ramp (deterministic per edition inside the family). */
  function paletteFor(family, rand) {
    switch (family) {
      case "white": {
        const h = lerp(196, 224, rand()), s = lerp(4, 16, rand()), l = lerp(58, 90, rand());
        return { h, s, l, hex: hslToHex(h, s, l), accent: hslToHex(h + 6, s + 20, Math.min(96, l + 10)) };
      }
      case "blue": {
        const h = lerp(202, 224, rand()), s = lerp(48, 72, rand()), l = lerp(24, 54, rand());
        return { h, s, l, hex: hslToHex(h, s, l), accent: hslToHex(h - 8, Math.min(90, s + 18), Math.min(78, l + 26)) };
      }
      case "orange": {
        const h = lerp(22, 40, rand()), s = lerp(58, 82, rand()), l = lerp(34, 60, rand());
        return { h, s, l, hex: hslToHex(h, s, l), accent: hslToHex(h + 10, Math.min(95, s + 12), Math.min(80, l + 24)) };
      }
      default: {
        const h = lerp(210, 236, rand()), s = lerp(10, 30, rand()), l = lerp(4, 15, rand());
        return { h, s, l, hex: hslToHex(h, s, l), accent: hslToHex(h, s + 30, l + 30) };
      }
    }
  }

  /* Family → musical role + synthesis character (the orchestration map). */
  function roleFor(family, rand) {
    if (family === "white") return rand() < 0.5 ? "bell" : "lead";
    if (family === "blue") return rand() < 0.5 ? "pad" : "bass";
    if (family === "orange") return rand() < 0.55 ? "pulse" : "lead";
    return rand() < 0.6 ? "drone" : "atmos";
  }
  const ROLE_SPEC = {
    bell:  { reg: 12,  waves: ["sine", "triangle"],     density: 0.5,  octaves: 2, atk: [0.002, 0.02],  rel: [0.6, 1.8],  cut: [3000, 9000], res: [2, 7],  drive: [0, 0.12],    sub: 0.0 },
    lead:  { reg: 12,  waves: ["triangle", "sawtooth"], density: 0.6,  octaves: 2, atk: [0.004, 0.05],  rel: [0.3, 1.2],  cut: [2200, 7000], res: [3, 9],  drive: [0.05, 0.3],  sub: 0.1 },
    pad:   { reg: -5,  waves: ["sawtooth", "triangle"], density: 0.28, octaves: 1, atk: [0.15, 0.7],    rel: [1.4, 3.2],  cut: [900, 3600],  res: [1, 5],  drive: [0, 0.1],     sub: 0.15 },
    bass:  { reg: -12, waves: ["sawtooth", "square"],   density: 0.42, octaves: 1, atk: [0.005, 0.03],  rel: [0.2, 0.7],  cut: [500, 2200],  res: [3, 8],  drive: [0.08, 0.35], sub: 0.5 },
    pulse: { reg: 0,   waves: ["square", "sawtooth"],   density: 0.72, octaves: 1, atk: [0.002, 0.015], rel: [0.08, 0.4], cut: [1400, 6000], res: [4, 11], drive: [0.15, 0.55], sub: 0.2 },
    drone: { reg: -12, waves: ["sine", "sawtooth"],     density: 0.14, octaves: 1, atk: [0.4, 1.2],     rel: [2.5, 5],    cut: [400, 1800],  res: [1, 4],  drive: [0, 0.08],    sub: 0.4 },
    atmos: { reg: 0,   waves: ["triangle", "sine"],     density: 0.2,  octaves: 2, atk: [0.2, 0.9],     rel: [1.6, 4],    cut: [800, 4200],  res: [1, 6],  drive: [0, 0.12],    sub: 0.1 }
  };

  function animationFor(family, role, rand) {
    const r = rand();
    let kind, word = null;
    if (family === "dark") {
      kind = r < 0.45 ? "orbit" : r < 0.75 ? "scope" : "glyph";
      if (kind === "glyph") word = rand() < 0.7 ? "0" : pick(rand, ["ZERO", "NOTHING", "FOREVER", "X"]);
    } else {
      if (r < 0.46) { kind = "glyph"; word = "0"; }
      else if (r < 0.64) { kind = "glyph"; word = pick(rand, WORDS.slice(1)); }
      else if (r < 0.84) kind = "bars";
      else if (r < 0.94) kind = "scope";
      else kind = "orbit";
    }
    return { kind, word, speed: q(lerp(0.5, 1.8, rand()), 3), seed: (rand() * 0xffffffff) >>> 0 };
  }

  function deriveGenome(edition) {
    if (!Number.isInteger(edition) || edition < 1 || edition > COLLECTION_SIZE) {
      throw new Error(`Edition must be 1–${COLLECTION_SIZE}.`);
    }
    const rand = splitmix32(0x50f0f3ee ^ Math.imul(edition, 2654435761));
    const gridX = (edition - 1) % GRID;
    const gridY = ((edition - 1) / GRID) | 0;
    const family = FAMILY_OF[LOGO_MASK[gridY][gridX]];

    const palette = paletteFor(family, rand);
    const role = roleFor(family, rand);
    const spec = ROLE_SPEC[role];

    const baseBright = { dark: 0.06, blue: 0.34, orange: 0.46, white: 0.72 }[family];
    const brightness = q(Math.max(0.02, Math.min(1, baseBright + (rand() - 0.5) * 0.34)), 4);

    const rootNote = MUSIC.rootMidi + spec.reg + (rand() < 0.3 ? 12 : 0);
    const typeA = spec.waves[0], typeB = pick(rand, spec.waves);
    const patternSeed = (Math.imul(edition, 0x85ebca6b) ^ Math.imul(gridX * 32 + gridY + 1, 0xc2b2ae35)) >>> 0;

    return {
      collectionId: COLLECTION_ID,
      engineVersion: ENGINE_VERSION,
      edition,
      tokenId: edition,
      mosaic: {
        gridX, gridY, family, role,
        hue: q(palette.h, 3), sat: q(palette.s, 2), light: q(palette.l, 2),
        color: palette.hex, accent: palette.accent, brightness
      },
      animation: animationFor(family, role, rand),
      rootNote,
      oscillator: {
        typeA, typeB,
        detune: q(lerp(3, 14, rand()), 2),
        mix: q(lerp(0.3, 0.62, rand()), 3),
        sub: q(spec.sub * lerp(0.6, 1.1, rand()), 3)
      },
      lfo: { rate: q(lerp(0.05, 6, rand() * rand()), 3), depth: q(lerp(0, 0.5, rand()), 3), target: pick(rand, ["cutoff", "pitch", "amp"]) },
      filter: {
        type: role === "bass" || role === "drone" ? "lowpass" : pick(rand, ["lowpass", "lowpass", "bandpass"]),
        cutoff: Math.round(lerp(spec.cut[0], spec.cut[1], rand())),
        resonance: q(lerp(spec.res[0], spec.res[1], rand()), 2)
      },
      envelope: {
        attack: q(lerp(spec.atk[0], spec.atk[1], rand()), 4),
        decay: q(lerp(0.05, 0.5, rand()), 4),
        sustain: q(lerp(0.25, 0.75, rand()), 3),
        release: q(lerp(spec.rel[0], spec.rel[1], rand()), 4)
      },
      effects: {
        delaySteps: pick(rand, [2, 3, 4, 6, 8]),
        feedback: q(lerp(0.15, 0.5, rand()), 3),
        delayWet: q(lerp(0.08, 0.36, rand()), 3),
        reverb: q(lerp(0.08, 0.5, rand()), 3),
        distortion: q(lerp(spec.drive[0], spec.drive[1], rand()), 3),
        pan: q(lerp(-0.6, 0.6, rand()), 3)
      },
      melody: {
        patternSeed,
        length: STEPS_PER_LOOP,
        density: q(Math.min(0.85, spec.density + (rand() - 0.5) * 0.18), 3),
        octaveRange: spec.octaves,
        swing: q(lerp(0, 0.18, rand()), 3)
      },
      padBehaviour: { xAxis: "scaleDegree", yAxis: "filterCutoff", pressureAxis: "distortion" }
    };
  }

  /* Deterministic melody: same genome → same notes forever. */
  function deriveMelody(genome) {
    const rand = splitmix32(genome.melody.patternSeed);
    const degrees = MUSIC.scale.length;
    const span = degrees * genome.melody.octaveRange;
    const swingTicks = Math.round(genome.melody.swing * TICKS_PER_STEP);
    const steps = [];
    let degree = (rand() * span) | 0;
    for (let i = 0; i < genome.melody.length; i++) {
      const strong = i % 8 === 0, offbeat = i % 2 === 1;
      if (rand() < genome.melody.density + (strong ? 0.22 : 0)) {
        degree = Math.min(span - 1, Math.max(0, degree + (((rand() * 5) | 0) - 2)));
        const midi = genome.rootNote + 12 * ((degree / degrees) | 0) + MUSIC.scale[degree % degrees];
        steps.push({
          step: i,
          tick: i * TICKS_PER_STEP + (offbeat ? swingTicks : 0),
          midi,
          velocity: q(0.5 + rand() * 0.4 + (strong ? 0.1 : 0), 3),
          gateSteps: 1 + ((rand() * 3) | 0)
        });
      }
    }
    if (steps.length === 0) steps.push({ step: 0, tick: 0, midi: genome.rootNote, velocity: 0.7, gateSteps: 4 });
    return steps;
  }

  const midiToHz = midi => MUSIC.tuningHz * 2 ** ((midi - 69) / 12);
  function quantiseX(genome, x, octaves) {
    const span = MUSIC.scale.length * (octaves || 2);
    const degree = Math.min(span - 1, (Math.max(0, Math.min(1, x)) * span) | 0);
    return genome.rootNote + 12 * ((degree / MUSIC.scale.length) | 0) + MUSIC.scale[degree % MUSIC.scale.length];
  }

  function stableStringify(value) {
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (value && typeof value === "object") {
      return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
    }
    return JSON.stringify(value);
  }
  function genomeHash(genome) {
    const text = stableStringify(genome);
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return "0x" + (h >>> 0).toString(16).padStart(8, "0");
  }

  return Object.freeze({
    ENGINE_VERSION, COLLECTION_ID, COLLECTION_SIZE, GRID,
    MUSIC, WAVEFORMS, WORDS, ANIM_KINDS, ROLES, FAMILIES, LOGO_MASK, FAMILY_OF,
    TICKS_PER_STEP, TICKS_PER_LOOP, STEPS_PER_LOOP,
    splitmix32, hslToHex, deriveGenome, deriveMelody, midiToHz, quantiseX,
    stableStringify, genomeHash
  });
});

/* Proof of Free — Living Synth v3 · performance codec.
 * Gestures, not audio: a tick-based event stream is the canonical work.
 * Merges v2's living-recording validation rigour with the v3 tick transport.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ProofOfFreePerformance = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const FORMAT = "xtrata-performance";
  const VERSION = 1;
  const MAX_EVENTS = 4096;
  const MAX_BYTES = 262144;
  const MAX_DURATION_TICKS = 1536 * 64;      // 64 loops of the shared transport
  const GATES = ["down", "move", "up"];

  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));
  const round3 = v => Math.round(v * 1000) / 1000;

  function create(parent, events, durationTicks) {
    return {
      format: FORMAT,
      version: VERSION,
      parentEdition: parent.edition,
      instrumentGenomeHash: parent.genomeHash,
      engineVersion: parent.engineVersion,
      bpm: parent.bpm,
      durationTicks: Math.max(1, Math.round(durationTicks)),
      events: events.map(e => ({
        tick: Math.max(0, Math.round(e.tick)),
        type: e.type,
        ...(e.type !== "up" ? { x: round3(clamp01(e.x)), y: round3(clamp01(e.y)), pressure: round3(clamp01(e.pressure)) } : {})
      }))
    };
  }

  /* Throws with a precise reason; dashboards fall back to the genesis melody. */
  function validate(value, expected) {
    if (!value || typeof value !== "object") throw new Error("Performance must be a JSON object.");
    const p = value;
    if (p.format !== FORMAT || p.version !== VERSION) throw new Error("Unsupported performance format or version.");
    if (!Number.isInteger(p.parentEdition) || p.parentEdition < 1 || p.parentEdition > 1024) throw new Error("Parent edition is invalid.");
    if (typeof p.instrumentGenomeHash !== "string" || !/^0x[0-9a-f]{8}$/.test(p.instrumentGenomeHash)) throw new Error("Genome hash is invalid.");
    if (!Number.isInteger(p.engineVersion) || p.engineVersion < 1) throw new Error("Engine version is invalid.");
    if (!Number.isInteger(p.durationTicks) || p.durationTicks < 1 || p.durationTicks > MAX_DURATION_TICKS) throw new Error("Duration is out of bounds.");
    if (!Array.isArray(p.events) || p.events.length < 1 || p.events.length > MAX_EVENTS) throw new Error(`Performance must contain 1–${MAX_EVENTS} events.`);
    let last = -1;
    for (const e of p.events) {
      if (!Number.isInteger(e.tick) || e.tick < last || e.tick > p.durationTicks) throw new Error("Event ticks must be ordered inside the duration.");
      if (!GATES.includes(e.type)) throw new Error("Event type is invalid.");
      if (e.type !== "up" && ![e.x, e.y, e.pressure].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) {
        throw new Error("Event coordinates and pressure must be between 0 and 1.");
      }
      last = e.tick;
    }
    if (expected) {
      if (p.parentEdition !== expected.edition) throw new Error("Performance targets a different edition.");
      if (expected.genomeHash && p.instrumentGenomeHash !== expected.genomeHash) throw new Error("Performance genome hash does not match this instrument.");
      if (expected.engineVersion && p.engineVersion !== expected.engineVersion) throw new Error("Performance engine version is unsupported.");
    }
    if (JSON.stringify(p).length > MAX_BYTES) throw new Error("Performance exceeds the inscription size bound.");
    return p;
  }

  return Object.freeze({ FORMAT, VERSION, MAX_EVENTS, MAX_BYTES, MAX_DURATION_TICKS, create, validate });
});

/* Proof of Free — Living Synth v4 · universal engine core.
 * One engine, 1,024 instruments. Requires ProofOfFreeGenome and
 * ProofOfFreePerformance (concatenated ahead of this file in the artifact).
 *
 * v4 over v3:
 *  - Higher-quality voice: dual osc + sub, waveshaper drive, resonant filter,
 *    LFO, tempo-synced feedback delay, a shared convolver reverb bus, stereo
 *    pan, soft-clip master limiter, and a per-voice analyser for visuals.
 *  - Square Kaoss-pad instrument with high-resolution themed animation
 *    (glyph 0/ZERO/PROOF/FREE/…, spectral bars from the FFT, oscilloscope
 *    from the time-domain buffer, orbiting particles).
 *  - A data-driven living-mosaic renderer: one shared canvas, a pre-rendered
 *    glyph atlas, a lightweight animated draw per tile, zero audio graphs
 *    while dormant; tiles promote to preview/instrument on demand.
 */
(() => {
  "use strict";
  const G = globalThis.ProofOfFreeGenome;
  const P = globalThis.ProofOfFreePerformance;
  const PROTOCOL = "proof-of-free/engine-api-v4";

  const TICK_SECONDS = 60 / (G.MUSIC.bpm * G.MUSIC.ppq);
  const MAX_ACTIVE = 6;
  const active = [];
  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));

  /* ---------- shared audio graph ---------- */
  let ctx = null, master = null, reverbBus = null;
  function lcg(seed) { let s = seed >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
  function buildReverbImpulse(context) {
    const rate = context.sampleRate, len = (rate * 2.6) | 0;
    const buf = context.createBuffer(2, len, rate), rnd = lcg(0x9e3779b9);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }
  async function audio() {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain(); master.gain.value = 0.9;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -6; limiter.knee.value = 24; limiter.ratio.value = 12;
      limiter.attack.value = 0.003; limiter.release.value = 0.2;
      const conv = ctx.createConvolver(); conv.buffer = buildReverbImpulse(ctx);
      const revGain = ctx.createGain(); revGain.gain.value = 0.9;
      conv.connect(revGain).connect(master);
      reverbBus = conv;
      master.connect(limiter).connect(ctx.destination);
    }
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  }

  function makeDriveCurve(amount) {
    const k = amount * 80, curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; curve[i] = amount <= 0 ? x : ((1 + k) * x) / (1 + k * Math.abs(x)); }
    return curve;
  }

  class Voice {
    constructor(context, genome) {
      this.context = context; this.genome = genome;
      const g = genome;
      this.oscA = context.createOscillator();
      this.oscB = context.createOscillator();
      this.sub = context.createOscillator();
      this.mixA = context.createGain();
      this.mixB = context.createGain();
      this.subGain = context.createGain();
      this.shaper = context.createWaveShaper();
      this.filter = context.createBiquadFilter();
      this.env = context.createGain();
      this.panner = context.createStereoPanner();
      this.out = context.createGain();
      this.delay = context.createDelay(2);
      this.feedback = context.createGain();
      this.delayWet = context.createGain();
      this.reverbSend = context.createGain();
      this.lfo = context.createOscillator();
      this.lfoGain = context.createGain();
      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 512; this.analyser.smoothingTimeConstant = 0.75;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.wave = new Uint8Array(this.analyser.fftSize);

      this.oscA.type = g.oscillator.typeA;
      this.oscB.type = g.oscillator.typeB;
      this.sub.type = "sine";
      this.oscB.detune.value = g.oscillator.detune;
      this.mixA.gain.value = (1 - g.oscillator.mix) * 0.9;
      this.mixB.gain.value = g.oscillator.mix * 0.9;
      this.subGain.gain.value = g.oscillator.sub;
      this.baseDrive = g.effects.distortion;
      this.shaper.curve = makeDriveCurve(this.baseDrive);
      this.filter.type = g.filter.type;
      this.filter.frequency.value = g.filter.cutoff;
      this.filter.Q.value = g.filter.resonance;
      this.env.gain.value = 0;
      this.panner.pan.value = g.effects.pan;
      this.out.gain.value = 0.24;
      this.delay.delayTime.value = g.effects.delaySteps * G.TICKS_PER_STEP * TICK_SECONDS;
      this.feedback.gain.value = g.effects.feedback;
      this.delayWet.gain.value = g.effects.delayWet;
      this.reverbSend.gain.value = g.effects.reverb * 0.6;

      this.oscA.connect(this.mixA).connect(this.shaper);
      this.oscB.connect(this.mixB).connect(this.shaper);
      this.sub.connect(this.subGain).connect(this.shaper);
      this.shaper.connect(this.filter).connect(this.env).connect(this.panner).connect(this.out);
      this.out.connect(this.analyser);
      this.out.connect(master);
      this.out.connect(this.delay).connect(this.delayWet).connect(master);
      this.delay.connect(this.feedback).connect(this.delay);
      this.out.connect(this.reverbSend).connect(reverbBus);

      // LFO modulation
      const lfoTarget = g.lfo.target;
      this.lfo.frequency.value = g.lfo.rate;
      this.lfoGain.gain.value = lfoTarget === "cutoff" ? g.filter.cutoff * g.lfo.depth
        : lfoTarget === "pitch" ? g.lfo.depth * 30 : g.lfo.depth * 0.12;
      this.lfo.connect(this.lfoGain);
      if (lfoTarget === "cutoff") this.lfoGain.connect(this.filter.frequency);
      else if (lfoTarget === "amp") this.lfoGain.connect(this.out.gain);
      else { this.lfoGain.connect(this.oscA.detune); this.lfoGain.connect(this.oscB.detune); }

      this.oscA.start(); this.oscB.start(); this.sub.start(); this.lfo.start();
    }
    setPitch(midi, when, glide = 0.012) {
      const hz = G.midiToHz(midi), t = when ?? this.context.currentTime;
      this.oscA.frequency.setTargetAtTime(hz, t, glide);
      this.oscB.frequency.setTargetAtTime(hz, t, glide);
      this.sub.frequency.setTargetAtTime(hz / 2, t, glide);
    }
    noteOn(midi, velocity, when) {
      const e = this.genome.envelope, t = when ?? this.context.currentTime;
      this.setPitch(midi, t, 0.001);
      const peak = 0.05 + 0.26 * clamp01(velocity);
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(peak, t, Math.max(0.003, e.attack / 3));
      this.env.gain.setTargetAtTime(peak * e.sustain, t + e.attack, Math.max(0.01, e.decay / 3));
    }
    noteOff(when) {
      const t = when ?? this.context.currentTime;
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(0, t, Math.max(0.02, this.genome.envelope.release / 3));
    }
    setCutoffNorm(y, t) { this.filter.frequency.setTargetAtTime(160 + (y * y) * 11500, t, 0.02); }
    setDrive(pressure) { this.shaper.curve = makeDriveCurve(Math.min(1, this.baseDrive + pressure * 0.5)); }
    level() { this.analyser.getByteFrequencyData(this.freq); let s = 0; for (let i = 0; i < 24; i++) s += this.freq[i]; return s / (24 * 255); }
    dispose() { try { this.oscA.stop(); this.oscB.stop(); this.sub.stop(); this.lfo.stop(); } catch { /* stopped */ } this.out.disconnect(); }
  }

  /* ---------- glyph atlas for the mosaic ---------- */
  let atlas = null;
  function buildAtlas() {
    if (atlas) return atlas;
    const cell = 64, cols = 4, rows = Math.ceil(G.WORDS.length / cols);
    const cvs = (typeof OffscreenCanvas !== "undefined") ? new OffscreenCanvas(cell * cols, cell * rows) : Object.assign(document.createElement("canvas"), { width: cell * cols, height: cell * rows });
    const c = cvs.getContext("2d");
    c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#fff";
    const map = {};
    G.WORDS.forEach((w, i) => {
      const cx = (i % cols) * cell + cell / 2, cy = ((i / cols) | 0) * cell + cell / 2;
      const fs = w.length <= 1 ? 44 : Math.max(11, Math.floor(58 / w.length));
      c.font = `700 ${fs}px ui-monospace, Menlo, monospace`;
      c.fillText(w, cx, cy);
      map[w] = { sx: (i % cols) * cell, sy: ((i / cols) | 0) * cell, cell };
    });
    atlas = { canvas: cvs, map };
    return atlas;
  }

  /* ---------- living mosaic renderer (data-driven, shared canvas) ---------- */
  function createMosaic(canvas, opts = {}) {
    const N = G.GRID;
    const genomes = [];
    for (let e = 1; e <= G.COLLECTION_SIZE; e++) genomes.push(G.deriveGenome(e));
    const a = buildAtlas();
    const c = canvas.getContext("2d");
    let raf = 0, t0 = null, live = new Set(), running = true, lastDraw = 0;
    const MIN_FRAME_MS = 32; // ~30fps is plenty for 1,024 dormant tiles

    function resize() {
      const ratio = Math.min(2, devicePixelRatio || 1);
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.max(N, Math.round(box.width * ratio));
      canvas.height = canvas.width;
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      c._cssW = canvas.width / ratio;
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < MIN_FRAME_MS) return;
      lastDraw = now;
      t0 ??= now; const time = (now - t0) / 1000;
      const W = c._cssW, T = W / N;
      c.fillStyle = "#050507"; c.fillRect(0, 0, W, W);
      for (const g of genomes) {
        const m = g.mosaic, an = g.animation;
        const px = m.gridX * T, py = m.gridY * T, s = T - 1;
        const isLive = live.has(g.edition);
        const pulse = 0.5 + 0.5 * Math.sin(time * an.speed + (an.seed & 255) / 40);
        // base tile
        let bright = m.brightness * (0.72 + 0.28 * pulse) + (isLive ? 0.25 : 0);
        c.globalAlpha = 1;
        c.fillStyle = m.family === "dark" ? m.color : shade(m.color, bright);
        c.fillRect(px, py, s, s);
        if (m.family === "dark" && m.brightness < 0.09 && !isLive) continue; // sparse ground
        drawTileMotif(c, an, m, px, py, s, time, isLive ? 1 : 0.85);
        if (isLive) { c.strokeStyle = m.accent; c.lineWidth = 1.5; c.globalAlpha = 0.9; c.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1); c.globalAlpha = 1; }
      }
    }
    function shade(hex, b) {
      const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, gg = (n >> 8) & 255, bl = n & 255;
      const f = Math.max(0.15, Math.min(1.35, b + 0.35));
      r = Math.min(255, r * f) | 0; gg = Math.min(255, gg * f) | 0; bl = Math.min(255, bl * f) | 0;
      return `rgb(${r},${gg},${bl})`;
    }
    function drawTileMotif(c, an, m, px, py, s, time, alpha) {
      const cx = px + s / 2, cy = py + s / 2;
      c.globalAlpha = alpha;
      if (an.kind === "glyph") {
        const sp = a.map[an.word] || a.map["0"];
        const pad = s * 0.16, sz = s - pad * 2;
        c.globalAlpha = alpha * (0.5 + 0.5 * Math.abs(Math.sin(time * an.speed * 0.8 + an.seed)));
        c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, px + pad, py + pad, sz, sz);
      } else if (an.kind === "bars") {
        const n = 4, bw = s / (n * 1.6); c.fillStyle = m.accent;
        for (let i = 0; i < n; i++) {
          const h = s * (0.2 + 0.6 * Math.abs(Math.sin(time * an.speed + i * 0.7 + an.seed)));
          c.fillRect(px + s * 0.14 + i * bw * 1.5, py + s - h - s * 0.12, bw, h);
        }
      } else if (an.kind === "scope") {
        c.strokeStyle = m.accent; c.lineWidth = 1.4; c.beginPath();
        for (let i = 0; i <= 10; i++) {
          const xx = px + s * (0.1 + 0.8 * i / 10);
          const yy = cy + Math.sin(time * an.speed * 2 + i * 0.9 + an.seed) * s * 0.22;
          i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
        }
        c.stroke();
      } else { // orbit
        c.fillStyle = m.accent;
        for (let i = 0; i < 2; i++) {
          const ang = time * an.speed * (i ? -1 : 1) + an.seed + i * Math.PI;
          const rad = s * (0.16 + i * 0.1);
          c.beginPath(); c.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, Math.max(1, s * 0.06), 0, 7); c.fill();
        }
        c.strokeStyle = m.accent; c.globalAlpha = alpha * 0.35;
        c.beginPath(); c.arc(cx, cy, s * 0.22, 0, 7); c.stroke();
      }
      c.globalAlpha = 1;
    }

    const editionAt = ev => {
      const box = canvas.getBoundingClientRect();
      const gx = Math.min(N - 1, Math.max(0, ((ev.clientX - box.left) / box.width * N) | 0));
      const gy = Math.min(N - 1, Math.max(0, ((ev.clientY - box.top) / box.height * N) | 0));
      return gy * N + gx + 1;
    };
    if (opts.onHover) canvas.addEventListener("pointermove", ev => opts.onHover(genomes[editionAt(ev) - 1], ev));
    if (opts.onSelect) canvas.addEventListener("click", ev => opts.onSelect(editionAt(ev)));
    if (opts.onOpen) canvas.addEventListener("dblclick", ev => opts.onOpen(editionAt(ev)));

    raf = requestAnimationFrame(frame);
    return {
      genomes,
      setLive(editions) { live = new Set(editions); },
      stop() { running = false; cancelAnimationFrame(raf); ro.disconnect(); },
      editionAt
    };
  }

  /* ---------- instrument (square pad + rich animation) ---------- */
  class Instrument {
    constructor(container, options) {
      const opts = options || {};
      this.edition = opts.edition;
      this.engineId = opts.engineId ?? 0;
      this.mode = opts.mode || "instrument";
      this.genome = G.deriveGenome(this.edition);
      this.genomeHash = G.genomeHash(this.genome);
      this.melody = G.deriveMelody(this.genome);
      this.container = container;
      this.voice = null; this.timers = []; this.schedulerTimer = null;
      this.recording = null; this.performance = null; this.pointerDown = false;
      this.pointer = { x: 0.5, y: 0.5, active: false };
      this.renderShell();
      if (this.mode === "instrument") this.bindPad();
      this.animate = this.animate.bind(this);
      this.raf = requestAnimationFrame(this.animate);
    }
    async ensureVoice() {
      const context = await audio();
      if (!this.voice) {
        while (active.length >= MAX_ACTIVE) active.shift().silence();
        this.voice = new Voice(context, this.genome);
        active.push(this);
      }
      return this.voice;
    }
    silence() {
      this.stopTransport();
      if (this.voice) { this.voice.noteOff(); const v = this.voice; setTimeout(() => v.dispose(), 800); this.voice = null; }
      const i = active.indexOf(this); if (i >= 0) active.splice(i, 1);
      this.setStatus("idle");
    }
    destroy() { cancelAnimationFrame(this.raf); this.silence(); this.container.replaceChildren(); }

    stopTransport() { this.timers.forEach(clearTimeout); this.timers = []; if (this.schedulerTimer) { clearInterval(this.schedulerTimer); this.schedulerTimer = null; } if (this.voice) this.voice.noteOff(); this.playing = null; }

    async playMelody() {
      const voice = await this.ensureVoice();
      this.stopTransport(); this.playing = "melody"; this.setStatus("genesis loop");
      const context = voice.context, loopSeconds = G.TICKS_PER_LOOP * TICK_SECONDS;
      let loopStart = context.currentTime + 0.06, index = 0; const horizon = 0.12;
      this.schedulerTimer = setInterval(() => {
        while (true) {
          if (index >= this.melody.length) { index = 0; loopStart += loopSeconds; }
          const note = this.melody[index], when = loopStart + note.tick * TICK_SECONDS;
          if (when > context.currentTime + horizon) break;
          voice.noteOn(note.midi, note.velocity, when);
          voice.noteOff(when + note.gateSteps * G.TICKS_PER_STEP * TICK_SECONDS * 0.9);
          index++;
        }
      }, 25);
    }

    async gesture(point) {
      const type = ["down", "move", "up"].includes(point?.type) ? point.type : "move";
      const x = clamp01(point?.x), y = clamp01(point?.y), pressure = clamp01(point?.pressure ?? 0.65);
      if (this.recording) { this.recording.events.push({ tick: this.nowTick(), type, x, y, pressure }); if (this.recording.events.length >= P.MAX_EVENTS) this.stopRecording(); }
      this.pointer = { x, y, active: type !== "up" };
      if (type === "up") { this.voice?.noteOff(); return; }
      const voice = await this.ensureVoice(), t = voice.context.currentTime;
      const midi = G.quantiseX(this.genome, x, 2);
      if (type === "down") voice.noteOn(midi, 0.4 + pressure * 0.6, t); else voice.setPitch(midi, t);
      voice.setCutoffNorm(1 - y, t); voice.setDrive(pressure);
    }

    nowTick() { return Math.round((performance.now() - this.recordStartMs) / 1000 / TICK_SECONDS); }
    startRecording() { this.recordStartMs = performance.now(); this.recording = { events: [] }; this.setStatus("recording"); }
    stopRecording() {
      if (!this.recording) return null;
      const events = this.recording.events; this.recording = null;
      if (events.length === 0) { this.setStatus("idle"); return null; }
      if (events[events.length - 1].type !== "up") events.push({ tick: this.nowTick(), type: "up" });
      const durationTicks = Math.max(G.TICKS_PER_LOOP, Math.ceil(events[events.length - 1].tick / G.TICKS_PER_LOOP) * G.TICKS_PER_LOOP);
      this.performance = P.validate(P.create({ edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion, bpm: G.MUSIC.bpm }, events, durationTicks));
      this.setStatus(`captured ${events.length} events`); return this.performance;
    }
    loadPerformance(json) { this.performance = P.validate(typeof json === "string" ? JSON.parse(json) : json, { edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion }); return this.performance; }
    exportPerformance() { if (!this.performance) throw new Error("No performance captured yet."); return JSON.stringify(this.performance); }
    async playPerformance(perf) {
      const target = perf ? this.loadPerformance(perf) : this.performance;
      if (!target) throw new Error("No performance to play.");
      await this.ensureVoice(); this.stopTransport(); this.playing = "performance"; this.setStatus("replaying performance");
      const loopMs = target.durationTicks * TICK_SECONDS * 1000;
      const schedule = () => { for (const e of target.events) this.timers.push(setTimeout(() => { void this.gesture(e); }, e.tick * TICK_SECONDS * 1000)); this.timers.push(setTimeout(schedule, loopMs)); };
      schedule();
    }

    renderShell() {
      const g = this.genome, m = g.mosaic, compact = this.mode === "preview";
      const hue = m.hue;
      this.container.innerHTML = `
        <div class="pof-instrument" data-protocol="${PROTOCOL}" data-edition="${this.edition}" data-family="${m.family}"
             style="height:100%;display:grid;grid-template-rows:${compact ? "1fr" : "auto 1fr auto"};gap:10px;color:#fff;font-family:ui-monospace,monospace">
          ${compact ? "" : `
          <header style="display:flex;justify-content:space-between;align-items:end">
            <div><small style="opacity:.6;letter-spacing:.08em">PROOF OF FREE · LIVING SYNTH v4</small>
              <h1 style="font-size:clamp(16px,3vw,26px);margin:2px 0 0">Edition ${String(this.edition).padStart(4, "0")}</h1></div>
            <small style="opacity:.6;text-align:right">ENGINE #${this.engineId} · v${g.engineVersion}<br>${this.genomeHash}</small>
          </header>`}
          <div class="pof-pad" role="application" aria-label="Chaos pad, edition ${this.edition}"
            style="position:relative;width:100%;aspect-ratio:1/1;max-height:${compact ? "100%" : "min(58vh,520px)"};margin:0 auto;overflow:hidden;border:1px solid ${m.accent}99;border-radius:14px;touch-action:none;cursor:crosshair;background:#060608">
            <canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas>
          </div>
          ${compact ? "" : `
          <footer style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:11px;opacity:.75">
            <span>${m.family.toUpperCase()} · ${m.role.toUpperCase()} · TILE ${m.gridX},${m.gridY}</span>
            <span>${g.oscillator.typeA.toUpperCase()}+${g.oscillator.typeB.toUpperCase()} · ROOT ${g.rootNote} · ${G.MUSIC.root} DORIAN ${G.MUSIC.bpm}BPM</span>
            <span class="pof-status">idle</span>
          </footer>`}
        </div>`;
      this.pad = this.container.querySelector(".pof-pad");
      this.canvas = this.container.querySelector("canvas");
      this.c = this.canvas.getContext("2d");
      this.statusEl = this.container.querySelector(".pof-status");
      this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this.canvas); this.resize();
      buildAtlas();
    }
    resize() {
      const ratio = Math.min(2, devicePixelRatio || 1), box = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.max(1, Math.round(box.width * ratio));
      this.canvas.height = Math.max(1, Math.round(box.height * ratio));
      this.c.setTransform(ratio, 0, 0, ratio, 0, 0);
      this._w = this.canvas.width / ratio; this._h = this.canvas.height / ratio;
    }
    setStatus(t) { if (this.statusEl) this.statusEl.textContent = t; }

    animate(now) {
      this.raf = requestAnimationFrame(this.animate);
      const c = this.c, W = this._w, H = this._h; if (!W) return;
      const g = this.genome, m = g.mosaic, an = g.animation, time = now / 1000;
      const v = this.voice, lvl = v ? v.level() : 0;
      // background wash
      const grd = c.createRadialGradient(W * (0.3 + m.gridX / 64), H * 0.4, 8, W / 2, H / 2, W * 0.8);
      grd.addColorStop(0, mix(m.color, "#000000", 0.35 - lvl * 0.2));
      grd.addColorStop(1, "#050507");
      c.fillStyle = grd; c.fillRect(0, 0, W, H);
      // trails
      c.fillStyle = "rgba(5,5,7,0.18)"; c.fillRect(0, 0, W, H);

      if (v && (this.playing || this.pointer.active)) {
        if (an.kind === "bars" || m.role === "bass" || m.role === "pad") this.drawSpectrum(c, W, H, v, m);
        else if (an.kind === "scope" || m.role === "lead") this.drawScope(c, W, H, v, m);
        else this.drawGlyphLive(c, W, H, m, an, time, lvl);
      } else {
        this.drawIdle(c, W, H, m, an, time);
      }
      // pointer cursor
      if (this.pointer.active) {
        c.strokeStyle = m.accent; c.lineWidth = 2; c.globalAlpha = 0.8;
        c.beginPath(); c.arc(this.pointer.x * W, this.pointer.y * H, 12 + lvl * 30, 0, 7); c.stroke();
        c.globalAlpha = 1;
      }
    }
    drawSpectrum(c, W, H, v, m) {
      v.analyser.getByteFrequencyData(v.freq); const n = 40, bw = W / n;
      for (let i = 0; i < n; i++) {
        const val = v.freq[i] / 255, h = val * H * 0.9;
        c.fillStyle = mix(m.color, m.accent, val);
        c.fillRect(i * bw, H - h, bw - 1, h);
      }
    }
    drawScope(c, W, H, v, m) {
      v.analyser.getByteTimeDomainData(v.wave); c.strokeStyle = m.accent; c.lineWidth = 2; c.beginPath();
      for (let i = 0; i < v.wave.length; i += 2) { const x = i / v.wave.length * W, y = (v.wave[i] / 255) * H; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
    }
    drawGlyphLive(c, W, H, m, an, time, lvl) {
      const a = buildAtlas(), sp = a.map[an.word] || a.map["0"], word = an.word || "0";
      c.save(); c.translate(W / 2, H / 2);
      const scale = 0.6 + lvl * 0.5 + 0.05 * Math.sin(time * 3);
      c.globalAlpha = 0.9;
      if (word === "0") {
        c.rotate(time * 0.4);
        c.strokeStyle = m.accent; c.lineWidth = 4 + lvl * 10;
        c.beginPath(); c.arc(0, 0, Math.min(W, H) * 0.28 * (0.8 + lvl), 0, 7); c.stroke();
        c.setLineDash([6, 10]); c.globalAlpha = 0.5;
        c.beginPath(); c.arc(0, 0, Math.min(W, H) * 0.36, time, time + 5.6); c.stroke(); c.setLineDash([]);
      } else {
        const sz = Math.min(W, H) * 0.7 * scale;
        c.globalAlpha = 0.85; c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, -sz / 2, -sz / 2, sz, sz);
        c.globalAlpha = 0.25; c.fillStyle = m.accent; c.fillRect(-W / 2, (Math.sin(time * 2) * 0.4) * H, W, 2);
      }
      c.restore();
    }
    drawIdle(c, W, H, m, an, time) {
      const a = buildAtlas();
      if (an.kind === "glyph") {
        const sp = a.map[an.word] || a.map["0"], sz = Math.min(W, H) * 0.62;
        c.globalAlpha = 0.35 + 0.3 * Math.abs(Math.sin(time * an.speed));
        c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, (W - sz) / 2, (H - sz) / 2, sz, sz);
        c.globalAlpha = 1;
      } else if (an.kind === "bars") {
        const n = 12, bw = W / n; c.fillStyle = m.accent; c.globalAlpha = 0.7;
        for (let i = 0; i < n; i++) { const h = H * (0.15 + 0.5 * Math.abs(Math.sin(time * an.speed + i * 0.5))); c.fillRect(i * bw + 2, H - h, bw - 4, h); }
        c.globalAlpha = 1;
      } else if (an.kind === "scope") {
        c.strokeStyle = m.accent; c.lineWidth = 2; c.globalAlpha = 0.7; c.beginPath();
        for (let i = 0; i <= 48; i++) { const x = i / 48 * W, y = H / 2 + Math.sin(time * an.speed * 2 + i * 0.3) * H * 0.24; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.globalAlpha = 1;
      } else {
        c.fillStyle = m.accent;
        for (let i = 0; i < 5; i++) { const ang = time * an.speed * (1 + i * 0.2) + i, r = Math.min(W, H) * (0.1 + i * 0.06); c.globalAlpha = 0.7 - i * 0.1; c.beginPath(); c.arc(W / 2 + Math.cos(ang) * r, H / 2 + Math.sin(ang) * r, 4, 0, 7); c.fill(); }
        c.globalAlpha = 1;
      }
    }

    bindPad() {
      const pointOf = (e, type) => { const b = this.pad.getBoundingClientRect(); return { type, x: clamp01((e.clientX - b.left) / b.width), y: clamp01((e.clientY - b.top) / b.height), pressure: clamp01(e.pressure || 0.65) }; };
      this.pad.addEventListener("pointerdown", e => { this.pointerDown = true; this.pad.setPointerCapture?.(e.pointerId); void this.gesture(pointOf(e, "down")); });
      this.pad.addEventListener("pointermove", e => { if (this.pointerDown) void this.gesture(pointOf(e, "move")); });
      const up = e => { if (!this.pointerDown) return; this.pointerDown = false; void this.gesture(pointOf(e, "up")); };
      this.pad.addEventListener("pointerup", up); this.pad.addEventListener("pointercancel", up);
    }
  }

  function mix(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16 & 255) * (1 - t) + (pb >> 16 & 255) * t));
    const g = Math.round(((pa >> 8 & 255) * (1 - t) + (pb >> 8 & 255) * t));
    const bl = Math.round(((pa & 255) * (1 - t) + (pb & 255) * t));
    return `rgb(${r},${g},${bl})`;
  }

  const api = Object.freeze({
    protocol: PROTOCOL, engineVersion: G.ENGINE_VERSION, music: G.MUSIC, genome: G, performance: P,
    mount(container, options) { return new Instrument(container, options); },
    createMosaic, buildAtlas,
    activeCount() { return active.length; },
    stopAll() { [...active].forEach(i => i.silence()); }
  });
  globalThis.ProofOfFree = api;

  /* Recursive-inscription auto-boot. */
  const seedNode = document.getElementById("pof-seed");
  if (seedNode) {
    const seed = JSON.parse(seedNode.textContent || "{}");
    const genome = G.deriveGenome(seed.edition);
    if (seed.protocol !== "proof-of-free/seed" || seed.version !== 4 || !Number.isSafeInteger(seed.engineId) || seed.engineId < 0 || seed.engineVersion !== G.ENGINE_VERSION || seed.genomeHash !== G.genomeHash(genome)) {
      throw new Error("Invalid Proof of Free v4 seed");
    }
    document.documentElement.style.cssText = "height:100%;background:#050507";
    document.body.style.cssText = "height:100%;margin:0;padding:14px;box-sizing:border-box;overflow:hidden;background:#050507";
    const rootEl = document.createElement("div"); rootEl.style.height = "100%"; document.body.appendChild(rootEl);
    const instrument = api.mount(rootEl, { edition: seed.edition, engineId: seed.engineId });
    dispatchEvent(new CustomEvent("proof-of-free:ready", { detail: { protocol: PROTOCOL, edition: seed.edition, engineId: seed.engineId, genomeHash: instrument.genomeHash } }));
  }
})();

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

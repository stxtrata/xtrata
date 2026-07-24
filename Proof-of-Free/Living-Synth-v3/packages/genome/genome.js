/* Proof of Free — Living Synth v3 · deterministic genome module.
 *
 * Single source of truth for how an edition number becomes an instrument.
 * Included verbatim inside the immutable engine artifact and imported by the
 * collection builder, so browser and build pipeline can never disagree.
 *
 * ENGINE_VERSION is baked into every genome. Future engines must reproduce
 * version-1 behaviour bit-for-bit for version-1 genomes or refuse to run them.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ProofOfFreeGenome = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ENGINE_VERSION = 1;
  const COLLECTION_ID = "xtrata-living-synth-v3";
  const COLLECTION_SIZE = 1024;
  const GRID = 32;

  /* One global musical framework shared by all 1,024 instruments. */
  const MUSIC = Object.freeze({
    root: "D",
    rootMidi: 50,                       // D3
    scale: Object.freeze([0, 2, 3, 5, 7, 9, 10]), // D Dorian
    bpm: 132,
    barsPerLoop: 4,
    stepsPerBar: 16,
    ppq: 96,                            // ticks per quarter note
    tuningHz: 440
  });
  const STEPS_PER_LOOP = MUSIC.barsPerLoop * MUSIC.stepsPerBar;      // 64
  const TICKS_PER_STEP = (MUSIC.ppq * 4) / MUSIC.stepsPerBar;        // 24
  const TICKS_PER_LOOP = STEPS_PER_LOOP * TICKS_PER_STEP;            // 1536

  const WAVEFORMS = Object.freeze(["sine", "triangle", "sawtooth", "square"]);
  const PALETTES = Object.freeze([
    "Infrared", "Ember", "Amber", "Solar",
    "Lime", "Verdant", "Aqua", "Cyan",
    "Azure", "Cobalt", "Violet", "Ultraviolet",
    "Magenta", "Rose", "Silver", "Lunar"
  ]);

  /* Orchestration roles keyed off mosaic position — the logo is the score. */
  const ROLES = Object.freeze(["texture", "lead", "bass", "pulse", "drone", "motif"]);

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
  const q = (v, places) => Number(v.toFixed(places)); // stable JSON output

  /* v2's bijective 10-bit permutation, kept: every edition gets a unique
   * (palette, register, waveform) tuple and a unique hue. */
  function slotOf(edition) { return (((edition - 1) * 733) + 421) & 1023; }

  function deriveGenome(edition) {
    if (!Number.isInteger(edition) || edition < 1 || edition > COLLECTION_SIZE) {
      throw new Error(`Edition must be 1–${COLLECTION_SIZE}.`);
    }
    const slot = slotOf(edition);
    const rand = splitmix32(0x50f0f3ee ^ (edition * 2654435761));

    const gridX = (edition - 1) % GRID;
    const gridY = ((edition - 1) / GRID) | 0;

    /* Region → musical role (orchestration map over the 32×32 logo). */
    const cx = (gridX - 15.5) / 15.5, cy = (gridY - 15.5) / 15.5;
    const r = Math.sqrt(cx * cx + cy * cy);
    const onDiagonal = Math.abs(Math.abs(cx) - Math.abs(cy)) < 0.28; // "X" strokes
    let role;
    if (onDiagonal && r < 0.9) role = r < 0.3 ? "motif" : "lead";
    else if (gridY < 8) role = "texture";
    else if (gridY >= 24) role = "bass";
    else role = rand() < 0.5 ? "drone" : "pulse";

    /* Bijective trait axes from disjoint slot bits (kept from v2): waveform
     * (2 bits), toneClass (4 bits), palette (4 bits) — every edition owns a
     * unique categorical tuple. Register additionally follows the role. */
    const toneClass = (slot >>> 2) & 15;
    const registerOffset = { bass: -12, drone: -12, pulse: 0, motif: 0, lead: 12, texture: 24 }[role];
    const rootNote = MUSIC.rootMidi + registerOffset + (toneClass >= 8 ? 12 : 0);

    /* Deterministic 64-step melody pattern seed (uint32). */
    const patternSeed = (Math.imul(slot + 1, 0x85ebca6b) ^ Math.imul(edition, 0xc2b2ae35)) >>> 0;

    return {
      collectionId: COLLECTION_ID,
      engineVersion: ENGINE_VERSION,
      edition,
      tokenId: edition,
      seedSlot: slot + 1,
      mosaic: {
        gridX, gridY,
        role,
        palette: PALETTES[(slot >>> 6) & 15],
        hue: q((slot * 360) / COLLECTION_SIZE, 6),
        brightness: q(0.35 + 0.55 * (onDiagonal ? 1 : Math.max(0, 1 - r)), 4)
      },
      rootNote,
      toneClass,
      oscillator: {
        typeA: WAVEFORMS[slot & 3],
        typeB: WAVEFORMS[(toneClass >>> 2) & 3],
        detune: q(2 + (toneClass & 3) * 3 + rand() * 3, 2),
        mix: q(0.35 + rand() * 0.4, 3)
      },
      filter: {
        type: "lowpass",
        cutoff: Math.round(500 + rand() * rand() * 7000),
        resonance: q(0.5 + rand() * 8, 2)
      },
      envelope: {
        attack: q(0.004 + rand() * (role === "drone" ? 0.6 : 0.08), 4),
        decay: q(0.05 + rand() * 0.4, 4),
        sustain: q(0.2 + rand() * 0.6, 3),
        release: q(0.08 + rand() * (role === "texture" ? 2.5 : 1.2), 4)
      },
      effects: {
        delaySteps: [2, 3, 4, 6][(rand() * 4) | 0],  // tempo-synced subdivisions
        feedback: q(0.15 + rand() * 0.45, 3),
        wet: q(0.1 + rand() * 0.35, 3),
        distortion: q(rand() * (role === "pulse" ? 0.6 : 0.25), 3)
      },
      melody: {
        patternSeed,
        length: STEPS_PER_LOOP,
        density: q({ drone: 0.12, texture: 0.25, bass: 0.4, motif: 0.5, lead: 0.55, pulse: 0.7 }[role] + rand() * 0.12, 3),
        octaveRange: role === "lead" || role === "texture" ? 2 : 1
      },
      padBehaviour: { xAxis: "scaleDegree", yAxis: "filterCutoff", pressureAxis: "distortion" }
    };
  }

  /* Deterministic melody: same genome → same notes forever. */
  function deriveMelody(genome) {
    const rand = splitmix32(genome.melody.patternSeed);
    const degrees = MUSIC.scale.length;
    const span = degrees * genome.melody.octaveRange;
    const steps = [];
    let degree = (rand() * span) | 0;
    for (let i = 0; i < genome.melody.length; i++) {
      const strong = i % 8 === 0;
      if (rand() < genome.melody.density + (strong ? 0.2 : 0)) {
        degree = Math.min(span - 1, Math.max(0, degree + (((rand() * 5) | 0) - 2)));
        const midi = genome.rootNote + 12 * ((degree / degrees) | 0) + MUSIC.scale[degree % degrees];
        steps.push({
          step: i,
          tick: i * TICKS_PER_STEP,
          midi,
          velocity: q(0.5 + rand() * 0.4 + (strong ? 0.1 : 0), 3),
          gateSteps: 1 + ((rand() * 3) | 0)
        });
      }
    }
    if (steps.length === 0) {
      steps.push({ step: 0, tick: 0, midi: genome.rootNote, velocity: 0.7, gateSteps: 4 });
    }
    return steps;
  }

  const midiToHz = midi => MUSIC.tuningHz * 2 ** ((midi - 69) / 12);
  /* Quantise pad x (0–1) to the shared scale around the genome register. */
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
  /* FNV-1a over the canonical genome string — cheap sync integrity check. */
  function genomeHash(genome) {
    const text = stableStringify(genome);
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return "0x" + (h >>> 0).toString(16).padStart(8, "0");
  }

  return Object.freeze({
    ENGINE_VERSION, COLLECTION_ID, COLLECTION_SIZE, GRID,
    MUSIC, WAVEFORMS, PALETTES, ROLES,
    TICKS_PER_STEP, TICKS_PER_LOOP, STEPS_PER_LOOP,
    splitmix32, deriveGenome, deriveMelody, midiToHz, quantiseX,
    stableStringify, genomeHash
  });
});

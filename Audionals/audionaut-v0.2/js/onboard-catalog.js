// Frozen v2 recipes. Legacy kit keys remain independent and unchanged.
import { SYNTH_BANK, synthDefaults } from "./synths.js";
import { SYNTH_KIT } from "./synthdrums.js";
export const LIBRARY_VERSION = "2.0.0";
export const FAMILY_LABELS = {
  kit: "Studio kit",
  bass: "Bass",
  plucks: "Plucks",
  keys: "Keys",
  bells: "Bells & mallets",
  leads: "Leads",
  pads: "Pads",
  chords: "Chord stabs",
  percussion: "New percussion",
};
const names = {
  bass: [
    "Pure Sub",
    "Rounded Triangle",
    "Rubber Mono",
    "Warm Ladder",
    "Short Acid",
    "Square Acid",
    "FM Growl",
    "Hollow FM",
    "Muted String Bass",
    "Woody Bass",
    "Reese Narrow",
    "Saw Foundation",
    "Chip Octave",
    "Pulse Bass",
    "Saturated Sub",
    "Digital Bite",
  ],
  plucks: [
    "Sine Droplet",
    "Glass Pin",
    "Copper FM",
    "Digital Harp",
    "Muted Nylon",
    "Wood String",
    "Bright Steel",
    "Low Kalimba",
    "Soft Triangle",
    "Filter Ping",
    "Acid Pluck",
    "Square Pizzicato",
    "Chip Spark",
    "Octave Pick",
    "Hollow Wood",
    "Resonant Wire",
  ],
  keys: [
    "Soft Electric",
    "Bright Tine",
    "Dusty Reed",
    "Crystal EP",
    "Warm Drawbar",
    "Jazz Organ",
    "Percussive Organ",
    "Hollow Organ",
    "Felt Piano-like",
    "Bright Piano-like",
    "Toy Piano-like",
    "Digital Piano-like",
    "Soft Digital",
    "Round Triangle Keys",
    "Square Clav",
    "FM Clav",
  ],
  bells: [
    "Round Bell",
    "Glass Bell",
    "Church Metal",
    "Tiny Glock-like",
    "Wood Marimba-like",
    "Soft Vibraphone-like",
    "Copper Bowl",
    "Gamelan-inspired",
    "Celeste-like",
    "Tubular Chime",
    "Low Metallophone",
    "Ice Mallet",
  ],
  leads: [
    "Rounded Mono",
    "Open Saw",
    "Narrow Pulse",
    "Chip Square",
    "Octave Chip",
    "Acid Ribbon",
    "Resonant Square",
    "FM Whistle",
    "Glass Lead",
    "Triangle Solo",
    "Vowel-like",
    "Detuned Mono",
  ],
  pads: [
    "Warm Horizon",
    "Dark Velvet",
    "Glass Cloud",
    "Air Harmonics",
    "Wide Dawn",
    "Slow Brass",
    "Hollow Drift",
    "Fifth Mist",
    "Soft Choir-like",
    "Night Organ",
    "Silver Haze",
    "Deep Aurora",
  ],
  chords: [
    "Major House",
    "Minor House",
    "Sus2 Glass",
    "Sus4 Warm",
    "Major Seventh",
    "Minor Seventh",
    "Dominant Seventh",
    "Open Fifth",
    "Minor Ninth",
    "Major Ninth",
    "Diminished Spark",
    "Quartal Air",
  ],
  percussion: [
    "Kick Modern",
    "Kick Soft",
    "Kick Click",
    "Kick Broken",
    "Snare Modern",
    "Snare Brush",
    "Snare Wood",
    "Snare Metallic",
    "Clap Dry",
    "Clap Wide",
    "Clap Dust",
    "Hat Silk",
    "Hat Grain",
    "Hat Metal",
    "Wood Knock C3",
    "Metal Hit C4",
    "Tuned Bongo C3",
    "Low Ceramic C3",
    "Shaker Fine",
    "Noise Shuffle",
    "Sand Rattle",
    "Impact Sub",
    "Reverse Spark",
    "Digital Fill",
  ],
};
const slugs = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const voicings = [
  [0, 4, 7],
  [0, 3, 7],
  [0, 2, 7],
  [0, 5, 7],
  [0, 4, 7, 11],
  [0, 3, 7, 10],
  [0, 4, 7, 10],
  [0, 7, 12],
  [0, 3, 7, 10, 14],
  [0, 4, 7, 11, 14],
  [0, 3, 6],
  [0, 5, 10],
];
const bassEngines = [
  "additive",
  "additive",
  "subzero",
  "jims10",
  "acidals",
  "acidals",
  "fmonad",
  "fmonad",
  "string",
  "string",
  "stacker",
  "jims10",
  "chip8",
  "chip8",
  "subzero",
  "fmonad",
];
const pluckEngines = [
  "additive",
  "partials",
  "fmonad",
  "fmonad",
  "string",
  "string",
  "string",
  "partials",
  "subzero",
  "jims10",
  "acidals",
  "jims10",
  "chip8",
  "chip8",
  "partials",
  "string",
];
const keysEngines = [
  "fmonad",
  "fmonad",
  "partials",
  "fmonad",
  "additive",
  "additive",
  "additive",
  "additive",
  "partials",
  "partials",
  "partials",
  "partials",
  "fmonad",
  "subzero",
  "jims10",
  "fmonad",
];
const leadsEngines = [
  "jims10",
  "jims10",
  "chip8",
  "chip8",
  "chip8",
  "acidals",
  "acidals",
  "fmonad",
  "fmonad",
  "subzero",
  "jims10",
  "stacker",
];
function recipe(family, i) {
  const rootMidi =
    family === "bass"
      ? 36
      : family === "leads"
        ? 60
        : family === "pads"
          ? 48
          : family === "chords"
            ? 48
            : 60;
  const engine =
    family === "bass"
      ? bassEngines[i]
      : family === "plucks"
        ? pluckEngines[i]
        : family === "keys"
          ? keysEngines[i]
          : family === "leads"
            ? leadsEngines[i]
            : family === "pads"
              ? "sustain"
              : family === "percussion"
                ? "percussion"
                : family === "bells"
                  ? "partials"
                  : "chord";
  let gate =
    family === "bass"
      ? 0.27
      : family === "leads"
        ? 0.55
        : family === "keys"
          ? 0.32
          : family === "chords"
            ? 0.26
            : 0.08;
  let release =
    family === "bells"
      ? 1.0 + (i % 4) * 0.2
      : family === "plucks"
        ? 0.35 + (i % 4) * 0.15
        : family === "keys"
          ? 0.65 + (i % 3) * 0.2
          : 0.22 + (i % 3) * 0.14;
  if (family === "keys" && i === 15) {
    gate = 0.07;
    release = 0.22;
  }
  return {
    engine,
    octave:
      (family === "bass" && i === 12) ||
      (family === "plucks" && i === 13) ||
      (family === "leads" && i === 4)
        ? 12
        : null,
    rootMidi:
      family === "percussion"
        ? i >= 14 && i < 18
          ? i === 15
            ? 60
            : 48
          : null
        : rootMidi,
    seed: 421337 + i * 7919 + family.length * 101,
    gate,
    release,
    attack: family === "pads" ? 0.3 + (i % 3) * 0.1 : 0.003 + (i % 3) * 0.003,
    brightness: 0.25 + (i % 4) * 0.18,
    partials:
      family === "bells"
        ? [1, 2 + (i % 3) * 0.19, 3 + (i % 4) * 0.33, 4.8 + (i % 3) * 0.41, 6.1]
        : [1, 2, 3, 4, 5, 7],
    damping: 0.985 + (i % 4) * 0.003,
    voicing: family === "chords" ? voicings[i] : null,
    stereo: family === "pads" && i >= 4,
    synthParams: {
      ...(SYNTH_BANK[engine] ? synthDefaults(engine) : {}),
      wave:
        engine === "subzero"
          ? family === "bass" && i === 14
            ? "sine"
            : "triangle"
          : engine === "jims10"
            ? family === "leads" && i === 0
              ? "triangle"
              : (family === "plucks" && i === 11) ||
                  (family === "keys" && i === 14)
                ? "square"
                : "sawtooth"
            : i % 2
              ? "square"
              : "sawtooth",
      width: 0.06 + (i % 6) * 0.065,
      vibRate: family === "leads" ? 3 + (i % 4) : 0,
      vibDepth: family === "leads" ? (i % 3) * 4 : 0,
      decay: 0.075 + (i % 7) * 0.035,
      modDecay: family === "keys" && i === 15 ? 0.035 : 0.12 + i * 0.035,
      glideUp: family === "bass" ? 0.015 + (i % 5) * 0.013 : 0.005,
      cutoff: family === "bass" ? 350 + i * 155 : 900 + i * 285,
      reso: 1 + (i % 4) * 1.6,
      sub: 0.12 + (i % 3) * 0.1,
      attack: 0.004 + (i % 3) * 0.006,
      release,
      index: 50 + (i % 5) * 90,
      ratio: [1, 2, 3, 1.5, 4][i % 5],
      detune: 3 + (i % 4) * 3,
      voices: 3,
      drive:
        engine === "subzero"
          ? family === "bass" && i === 14
            ? 0.78
            : family === "bass"
              ? 0.12
              : 0
          : 0.12 + (i % 4) * 0.13,
    },
    index: i,
  };
}
export const ONBOARD_SOUNDS = [
  ...Object.entries(SYNTH_KIT).map(([key, def], i) => ({
    soundId: slugs(key),
    key: `onboard:v2:${slugs(key)}`,
    label: def.label,
    family: "kit",
    version: LIBRARY_VERSION,
    tags: ["dry", "studio", "one-shot"],
    rootMidi: key.startsWith("bass-808")
      ? {
          "bass-808-e": 28,
          "bass-808-g": 31,
          "bass-808-a": 33,
          "bass-808-dist": 28,
        }[key]
      : null,
    roots: [],
    velocities: [1],
    recipe: { engine: "legacy", legacyKey: key, seed: 0, index: i },
  })),
  ...Object.entries(names).flatMap(([family, list]) =>
    list.map((label, i) => {
      const r = recipe(family, i);
      return {
        soundId: `${family}-${slugs(label)}`,
        key: `onboard:v2:${family}-${slugs(label)}`,
        label,
        family,
        version: LIBRARY_VERSION,
        rootMidi: r.rootMidi,
        roots:
          r.rootMidi == null
            ? []
            : ["bass", "plucks", "keys"].includes(family) && i < 4
              ? [r.rootMidi - 12, r.rootMidi, r.rootMidi + 12]
              : [r.rootMidi],
        velocities:
          ["keys", "bells"].includes(family) && i < 4 ? [0.55, 1] : [1],
        tags: [
          family,
          "dry",
          family === "pads" ? "sustain" : "one-shot",
          ...(family === "keys" ? ["synthesized"] : []),
          ...(r.stereo ? ["stereo"] : ["mono"]),
        ],
        recipe: r,
      };
    }),
  ),
];
for (const s of ONBOARD_SOUNDS)
  if (s.rootMidi != null && !s.roots.length) s.roots = [s.rootMidi];
export const SOUND_BY_KEY = Object.fromEntries(
  ONBOARD_SOUNDS.map((s) => [s.key, s]),
);
export const midiName = (midi) =>
  midi == null
    ? "Unpitched"
    : ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"][
        midi % 12
      ] +
      (Math.floor(midi / 12) - 1);
export function noteRate(note, root) {
  if (
    !Number.isInteger(note) ||
    note < 0 ||
    note > 127 ||
    !Number.isInteger(root)
  )
    throw new Error("Choose a valid sample note.");
  return 2 ** ((note - root) / 12);
}
export function assetKey(sound, root = sound.rootMidi, velocity = 1) {
  return `${sound.soundId}@${root ?? "hit"}@${velocity}`;
}

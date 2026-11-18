// Voices the drum-beat catalogue (drum-catalogue.js) with two sound sets and builds the
// preset objects for the "Drum beats" collections:
//   · Studio kit  — the embedded synthesised drums (original 24 + the 58-sound Studio kit+)
//   · Bitcoin L1  — OB1/OG single-hit drums only (toms/rims/shakers are retunes of those)
// Drum beats contain no tonal sounds, except the few flagged beats where an 808 bass hit
// is part of the style (trap, Miami bass, dub): those carry a BA channel and "With bass".
//
// Imports only data modules (never l1-beats.js / beats.js) to avoid import cycles.
import { OB1 } from "./legacy-beats.js";
import { SAMPLE_LIBRARY } from "./library.js";
import { ALL_SYNTH_DRUMS } from "./synthdrums.js";
import { ROLES, expandRole, recipeRoles } from "./percussion-recipes.js";
import { DRUM_RECIPES, GENRE_RECIPES, START_HERE_IDS, kitFor } from "./drum-catalogue.js";

// ------------------------------------------------------------------ Studio sounds
// Useful body length (s) of each Studio kit+ sound: its measured decay ×1.4 + 50 ms, so
// dense patterns don't smear. Every Studio kit+ sound is peak-normalised, so gain is 1.
const TAIL = {
  "kick-tight": 0.15, "kick-boom": 0.56, "kick-909": 0.24, "kick-dry": 0.16, "kick-thump": 0.21,
  "kick-lofi": 0.25, "kick-ac-soft": 0.2, "kick-ac-big": 0.3, "kick-gabber": 0.46, "kick-trap": 0.64,
  "snare-909": 0.15, "snare-piccolo": 0.12, "snare-crack": 0.17, "snare-lofi": 0.22, "snare-brush": 0.22,
  "snare-gated": 0.12, "snare-electro": 0.13, "snare-deep": 0.2, "snare-open": 0.24, "snare-ghost": 0.11,
  sidestick: 0.08, "sidestick-hi": 0.08, "rim-tick": 0.06,
  "tom-rack-1": 0.2, "tom-rack-2": 0.22, "tom-rack-3": 0.25, "tom-floor-1": 0.32, "tom-floor-2": 0.38,
  "tom-elec-hi": 0.17, "tom-elec-mid": 0.19, "tom-elec-lo": 0.22,
  "hat-closed-tight": 0.07, "hat-closed-soft": 0.08, "hat-closed-bright": 0.09, "hat-pedal": 0.08,
  "hat-tap": 0.06, "hat-half": 0.15, "hat-open-short": 0.19, "hat-open-long": 0.34, "hat-sizzle": 0.32,
  "ride-bow": 0.55, "ride-bell": 0.43, "ride-soft": 0.67, "crash-1": 1.16, "crash-2": 0.93,
  "crash-short": 0.44, splash: 0.27, china: 0.65,
  "clap-tight": 0.14, "clap-wide": 0.34, "clap-lofi": 0.21,
  tambourine: 0.12, "tambourine-open": 0.18, "shaker-egg": 0.12, "shaker-soft": 0.15, cabasa: 0.11,
  "cowbell-hi": 0.19, "cowbell-lo": 0.27,
};
// The original frozen kit sounds that still appear (tail s, gain to level them with the rest).
const LEGACY = {
  "kick-808": [0.45, 1], "kick-sub": [0.6, 0.9], "kick-hard": [0.35, 0.85], "kick-punch": [0.3, 1],
  "snare-fat": [0.3, 0.7], "snare-rock": [0.3, 0.65], "snare-tight": [0.25, 1],
  "clap-909": [0.3, 2.2], rimshot: [0.1, 2.8], shaker: [0.14, 1.4], "cowbell-808": [0.35, 1.6],
  "bass-808-e": [0.6, 0.8], "bass-808-g": [0.6, 0.8], "bass-808-a": [0.6, 0.8],
};

// s(key, pitch, gain, fx, trimSeconds)
const s = (key, p = 1, g = 1, fx, t) => {
  if (!ALL_SYNTH_DRUMS[key]) throw new Error(`Unknown Studio kit sound: ${key}`);
  const legacy = LEGACY[key];
  return { key, p, g: g * (legacy ? legacy[1] : 1), t: t ?? legacy?.[0] ?? TAIL[key], fx, studio: true };
};

// Default voice options per role (rotated across the beats of a genre for variety).
const BASE = {
  K: [s("kick-tight"), s("kick-thump")],
  K2: [s("tom-floor-2"), s("kick-boom", 1, 0.9)],
  S: [s("snare-crack"), s("snare-deep")],
  S2: [s("snare-ghost"), s("snare-brush", 1, 0.8)],
  SS: [s("sidestick"), s("sidestick-hi")],
  C: [s("clap-tight"), s("clap-wide")],
  H: [s("hat-closed-tight"), s("hat-closed-soft")],
  HP: [s("hat-pedal")],
  HT: [s("hat-tap"), s("rim-tick", 1, 0.7)],
  HH: [s("hat-half")],
  O: [s("hat-open-short"), s("hat-open-long", 1, 0.9)],
  RD: [s("ride-bow"), s("ride-soft")],
  RB: [s("ride-bell")],
  CR: [s("crash-1"), s("crash-2")],
  SP: [s("splash")],
  CH: [s("china")],
  B: [s("cowbell-lo"), s("cowbell-hi", 0.9)],
  B2: [s("cowbell-hi"), s("tambourine-open", 1, 0.9)],
  R: [s("sidestick-hi"), s("rim-tick")],
  T3: [s("tom-rack-1")],
  T2: [s("tom-rack-2")],
  T1: [s("tom-rack-3")],
  F1: [s("tom-floor-1")],
  F2: [s("tom-floor-2")],
  SH: [s("shaker-egg"), s("shaker-soft")],
  TB: [s("tambourine"), s("tambourine-open", 1, 0.9)],
  TK: [s("rim-tick"), s("hat-tap")],
  BA: [s("bass-808-e"), s("bass-808-g"), s("bass-808-a")],
};

// Per-kit overrides: any role not listed falls back to BASE.
const KITS = {
  rock: {
    K: [s("kick-ac-big"), s("kick-thump")],
    S: [s("snare-crack"), s("snare-deep"), s("snare-piccolo")],
    H: [s("hat-closed-bright"), s("hat-closed-tight")],
    O: [s("hat-open-long", 1, 0.9), s("hat-open-short")],
  },
  pop: {
    K: [s("kick-tight"), s("kick-ac-big")],
    S: [s("snare-piccolo"), s("snare-crack")],
    C: [s("clap-wide"), s("clap-tight")],
    H: [s("hat-closed-soft"), s("hat-closed-tight")],
    SS: [s("sidestick"), s("sidestick-hi")],
  },
  funk: {
    K: [s("kick-dry"), s("kick-ac-soft")],
    S: [s("snare-crack"), s("snare-piccolo")],
    H: [s("hat-closed-tight"), s("hat-closed-bright")],
    O: [s("hat-open-short")],
  },
  hiphop: {
    K: [s("kick-dry"), s("kick-lofi")],
    S: [s("snare-lofi"), s("snare-crack")],
    C: [s("clap-lofi"), s("clap-tight")],
    H: [s("hat-closed-soft"), s("hat-closed-tight")],
  },
  lofi: {
    K: [s("kick-lofi"), s("kick-ac-soft")],
    S: [s("snare-lofi")],
    SS: [s("sidestick"), s("sidestick-hi")],
    C: [s("clap-lofi")],
    H: [s("hat-closed-soft")],
    SH: [s("shaker-soft")],
  },
  house: {
    K: [s("kick-909"), s("kick-tight")],
    S: [s("snare-909"), s("snare-crack")],
    C: [s("clap-tight"), s("clap-wide")],
    H: [s("hat-closed-tight"), s("hat-closed-bright")],
    O: [s("hat-open-short"), s("hat-open-long", 1, 0.9)],
    R: [s("rim-tick"), s("sidestick-hi")],
  },
  techno: {
    K: [s("kick-909"), s("kick-boom", 1, 0.9)],
    S: [s("snare-909")],
    C: [s("clap-tight")],
    H: [s("hat-closed-tight"), s("hat-closed-bright")],
    R: [s("rim-tick")],
  },
  disco: {
    K: [s("kick-909"), s("kick-tight")],
    S: [s("snare-909"), s("snare-crack")],
    H: [s("hat-closed-bright"), s("hat-closed-tight")],
    O: [s("hat-open-long", 1, 0.9), s("hat-open-short")],
  },
  electro: {
    K: [s("kick-808"), s("kick-909")],
    S: [s("snare-electro"), s("snare-909")],
    T3: [s("tom-elec-hi")], T2: [s("tom-elec-mid")], T1: [s("tom-elec-lo")],
    B: [s("cowbell-hi")],
  },
  trap: {
    K: [s("kick-trap"), s("kick-808")],
    S: [s("snare-crack"), s("snare-electro")],
    C: [s("clap-tight"), s("clap-wide")],
    T3: [s("tom-elec-hi")], T2: [s("tom-elec-mid")], T1: [s("tom-elec-lo")],
  },
  garage: {
    K: [s("kick-tight"), s("kick-909")],
    S: [s("snare-crack"), s("snare-909")],
    H: [s("hat-closed-bright"), s("hat-closed-tight")],
    T3: [s("tom-elec-hi")], T2: [s("tom-elec-mid")], T1: [s("tom-elec-lo")],
  },
  dnb: {
    K: [s("kick-tight"), s("kick-thump")],
    S: [s("snare-crack"), s("snare-electro")],
    H: [s("hat-closed-bright"), s("hat-closed-tight")],
  },
  jungle: {
    K: [s("kick-tight"), s("kick-dry")],
    S: [s("snare-crack"), s("snare-piccolo"), s("snare-deep")],
    H: [s("hat-closed-bright")],
  },
  breaks: {
    K: [s("kick-dry"), s("kick-thump")],
    S: [s("snare-crack"), s("snare-deep")],
    H: [s("hat-closed-bright"), s("hat-closed-tight")],
  },
  dubstep: {
    K: [s("kick-boom", 1, 0.9), s("kick-trap")],
    S: [s("snare-electro"), s("snare-deep")],
    C: [s("clap-wide"), s("clap-tight")],
  },
  footwork: {
    K: [s("kick-808"), s("kick-tight")],
    C: [s("clap-tight")],
    T3: [s("tom-elec-hi")], T2: [s("tom-elec-mid")], T1: [s("tom-elec-lo")],
  },
  reggae: {
    K: [s("kick-ac-soft"), s("kick-dry")],
    SS: [s("sidestick-hi"), s("sidestick")],
    S: [s("snare-deep"), s("snare-crack")],
    H: [s("hat-closed-soft")],
    O: [s("hat-half")],
    R: [s("sidestick-hi")],
  },
  dubkit: {
    K: [s("kick-boom", 1, 0.9), s("kick-ac-soft")],
    R: [s("sidestick-hi")],
    S: [s("snare-deep")],
    O: [s("hat-half"), s("hat-open-short")],
    T3: [s("tom-elec-hi")],
  },
  dancehall: {
    K: [s("kick-909"), s("kick-tight")],
    S: [s("snare-electro"), s("snare-crack")],
    C: [s("clap-tight")],
    H: [s("hat-closed-tight")],
  },
  afrodance: {
    K: [s("kick-tight"), s("kick-909")],
    S: [s("snare-electro"), s("snare-crack")],
    C: [s("clap-wide"), s("clap-tight")],
    SH: [s("shaker-egg"), s("cabasa")],
    T3: [s("tom-elec-hi")], T2: [s("tom-elec-mid")], T1: [s("tom-elec-lo")],
  },
  // Hand-percussion traditions on a drum-kit palette: toms as congas/drums, rims as clave.
  world: {
    K: [s("kick-ac-soft"), s("kick-ac-big")],
    K2: [s("tom-floor-2"), s("kick-boom", 1, 0.9)],
    S: [s("snare-brush"), s("snare-crack")],
    S2: [s("snare-brush", 1, 0.8), s("snare-ghost")],
    C: [s("clap-wide")],
    H: [s("hat-closed-soft")],
    R: [s("sidestick-hi"), s("rim-tick")],
    SH: [s("shaker-egg"), s("cabasa"), s("shaker-soft")],
    TB: [s("tambourine")],
  },
  marching: {
    K: [s("kick-ac-big"), s("kick-ac-soft")],
    K2: [s("tom-floor-2")],
    S: [s("snare-piccolo"), s("snare-crack")],
    S2: [s("snare-crack", 1.1, 0.7), s("snare-piccolo", 1, 0.7)],
    H: [s("hat-closed-bright")],
    C: [s("clap-wide"), s("clap-tight")],
  },
  jazz: {
    K: [s("kick-ac-soft")],
    S: [s("snare-brush"), s("snare-ghost")],
    S2: [s("snare-ghost"), s("snare-brush", 1, 0.8)],
    RD: [s("ride-bow"), s("ride-soft")],
    H: [s("hat-closed-soft")],
    HP: [s("hat-pedal")],
  },
  blues: {
    K: [s("kick-ac-soft"), s("kick-ac-big")],
    S: [s("snare-deep"), s("snare-crack")],
    RD: [s("ride-soft"), s("ride-bow")],
    H: [s("hat-closed-soft")],
  },
  punk: {
    K: [s("kick-ac-big"), s("kick-thump")],
    S: [s("snare-crack"), s("snare-piccolo")],
    H: [s("hat-closed-bright")],
  },
  metal: {
    K: [s("kick-tight"), s("kick-thump")],
    S: [s("snare-piccolo"), s("snare-crack")],
    H: [s("hat-closed-bright")],
    CR: [s("crash-2"), s("crash-1")],
  },
  indie: {
    K: [s("kick-dry"), s("kick-ac-big")],
    S: [s("snare-crack"), s("snare-lofi")],
    H: [s("hat-closed-tight")],
  },
  industrial: {
    K: [s("kick-thump"), s("kick-gabber", 1, 0.85)],
    S: [s("snare-gated"), s("snare-electro")],
    CH: [s("china")],
    F1: [s("tom-floor-1")],
  },
  minimal: {
    K: [s("kick-tight"), s("kick-909")],
    R: [s("rim-tick"), s("sidestick-hi")],
    TK: [s("rim-tick"), s("hat-tap")],
    H: [s("hat-closed-tight")],
    SH: [s("shaker-soft")],
  },
};

// ---------------------------------------------------------------------- L1 sounds
const L1_IDS = {
  ...OB1,
  ogKick: "a511d79317efac68fea3b14070bebe208aefde07ce1c55d6f4cfe42e8273cbdbi0",
  ogKick2: "5b2dc7be28ad70c233b06d0ba23888aa38eb8711c24f8462d2774ac5fb7e7212i0",
  ogSnare: "6c01b1214fc4d4016d683380d066849e6bc645276b102604c098bd35fd77f791i0",
};
const curated = SAMPLE_LIBRARY.flatMap((group) => group.items);
const l1Source = (key) => {
  const id = L1_IDS[key],
    entry = curated.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown L1 percussion sample: ${key}`);
  return { type: "ordinal", value: id, label: entry.label };
};
// l(sample, pitch, trimSeconds, gain, fx)
const l = (key, p = 1, t = 0.3, g = 1, fx) => ({ key, p, g, t, fx, studio: false });
const HP = (cutoff) => ({ filter: "hp", cutoff });
const LP = (cutoff) => ({ filter: "lp", cutoff });

// Only single-hit drums exist on-chain, so toms, rims, shakers and cymbal variants are
// retuned/trimmed/filtered versions of the kick, snare, hat, click, crash and cowbell.
const L1_KIT = {
  K: [l("kick808", 1, 0.4), l("kickHard", 1, 0.3), l("ogKick", 1, 0.35), l("ogKick2", 1, 0.35)],
  K2: [l("kick808", 0.62, 0.5), l("ogKick2", 0.7, 0.45), l("kickHard", 0.6, 0.4)],
  S: [l("snare808", 1, 0.3), l("snareHard", 1, 0.3), l("ogSnare", 1, 0.3)],
  S2: [l("snare808", 1.3, 0.12, 0.5), l("snareHard", 1.3, 0.1, 0.5), l("ogSnare", 1.3, 0.12, 0.5)],
  SS: [l("click", 0.8, 0.08, 1.1), l("cowbell", 2.2, 0.06, 0.8)],
  C: [l("clap808", 1, 0.25)],
  H: [l("hatClosed", 1, 0.12)],
  HP: [l("hatClosed", 0.8, 0.09, 0.7)],
  HT: [l("hatClosed", 1.4, 0.04, 0.7), l("click", 1.6, 0.04)],
  HH: [l("crash", 1.7, 0.16, 0.55, HP(5000))],
  O: [l("crash", 1.5, 0.28, 0.8, HP(3500))],
  RD: [l("crash", 1.9, 0.45, 0.45, HP(5500))],
  RB: [l("cowbell", 2, 0.3, 0.7)],
  CR: [l("crash", 1, 1, 0.9)],
  SP: [l("crash", 1.8, 0.22, 0.6, HP(4500))],
  CH: [l("crash", 0.8, 0.5, 0.7, HP(1500))],
  B: [l("cowbell", 1, 0.28), l("cowbell", 0.8, 0.3)],
  B2: [l("cowbell", 1.5, 0.18)],
  R: [l("click", 0.9, 0.1), l("cowbell", 2.4, 0.07)],
  T3: [l("snare808", 0.88, 0.18, 1, LP(2800))],
  T2: [l("snare808", 0.62, 0.25, 1, LP(1800))],
  T1: [l("kickHard", 0.85, 0.25, 1, LP(1000))],
  F1: [l("kickHard", 0.7, 0.3, 1, LP(700))],
  F2: [l("kick808", 0.55, 0.4, 1, LP(500))],
  SH: [l("hatClosed", 0.85, 0.14, 0.75)],
  TB: [l("hatClosed", 1.15, 0.1, 0.85)],
  TK: [l("click", 1.6, 0.05)],
  BA: [l("bass1", 1, 0.5, 0.9)],
};

// ------------------------------------------------------------------------- build
const ROLE_ORDER = Object.keys(ROLES);
const SHORT_NAMES = {
  K: "Kick", K2: "Low Drum", S: "Snare", S2: "Ghost Snare", SS: "Side Stick", C: "Clap",
  H: "Hat", HP: "Pedal Hat", HT: "Hat Tap", HH: "Half-Open Hat", O: "Open Hat", RD: "Ride",
  RB: "Ride Bell", CR: "Crash", SP: "Splash", CH: "China", B: "Bell", B2: "High Bell",
  R: "Rim / Clave", T3: "Rack Tom 1", T2: "Rack Tom 2", T1: "Rack Tom 3", F1: "Floor Tom 1",
  F2: "Floor Tom 2", SH: "Shaker", TB: "Tambourine", TK: "Tick", BA: "808 Bass",
};
const ROLE_VOLUME = {
  K: 0.72, K2: 0.62, S: 0.56, S2: 0.26, SS: 0.5, C: 0.5, H: 0.3, HP: 0.28, HT: 0.24, HH: 0.3,
  O: 0.3, RD: 0.3, RB: 0.28, CR: 0.34, SP: 0.28, CH: 0.32, B: 0.32, B2: 0.28, R: 0.42,
  T3: 0.46, T2: 0.46, T1: 0.48, F1: 0.5, F2: 0.5, SH: 0.3, TB: 0.3, TK: 0.26, BA: 0.6,
};

const studioOptions = (kit, role) => KITS[kit]?.[role] || BASE[role];

function channelFor(recipe, role, voice, source, hits) {
  const crowded = hits / 64 > 0.6 ? 0.78 : 1;
  return {
    source,
    name: SHORT_NAMES[role],
    role,
    kind: "hit",
    pattern: expandRole(recipe, role),
    // Studio hits can sum above 1.0 when several coincide, so they sit a little lower.
    volume: +Math.min(1, ROLE_VOLUME[role] * voice.g * crowded * (voice.studio ? 0.85 : 1)).toFixed(3),
    pitch: voice.p,
    trimSeconds: [0, voice.t],
    fx: { ...voice.fx, ...recipe.fx[role] },
  };
}

function buildPreset(recipe, mode, variant) {
  const kit = kitFor(recipe);
  const roles = ROLE_ORDER.filter(
    (role) => recipeRoles(recipe).includes(role) && /[xX]/.test(expandRole(recipe, role)),
  );
  const channels = roles.map((role) => {
    const options = mode === "l1" ? L1_KIT[role] : studioOptions(kit, role);
    const voice = options[variant % options.length];
    const hits = expandRole(recipe, role).replace(/\./g, "").length;
    const source = mode === "l1"
      ? l1Source(voice.key)
      : { type: "synth", value: voice.key, label: ALL_SYNTH_DRUMS[voice.key].label };
    return channelFor(recipe, role, voice, source, hits);
  });
  const withBass = roles.includes("BA");
  const parts = channels.filter((c) => c.role !== "BA").map((c) => c.name.toLowerCase());
  const startHere = START_HERE_IDS.includes(recipe.id);
  return {
    id: `drums-${mode}-${recipe.id}`,
    name: recipe.name,
    genre: recipe.genre,
    bpm: recipe.bpm,
    swing: recipe.swing,
    bars: 4,
    collection: mode === "l1" ? "l1" : "original",
    percussion: true,
    drumBeat: true,
    startHere,
    withBass,
    world: !!recipe.world,
    soundFamilies: [mode === "l1" ? "percussion" : "drums"],
    channels,
    description: `${recipe.world ? "World rhythm" : "Drum beat"} at ${recipe.bpm} BPM with ${parts.join(", ")}${withBass ? ", plus an 808 bass hit because the style calls for it" : " — drums only, no bass or melody"}; four bars with a fill in the last. ${mode === "l1" ? "Bitcoin L1 single hits" : "Studio kit"}.`,
  };
}

// Rotate each genre's voice options so its beats don't all share one kick/snare.
const build = (mode) =>
  DRUM_RECIPES.map((recipe) => {
    // The essentials always get their genre's primary voices.
    const variant = START_HERE_IDS.includes(recipe.id)
      ? 0
      : GENRE_RECIPES(recipe.genre).findIndex((r) => r.id === recipe.id);
    return buildPreset(recipe, mode, Math.max(0, variant));
  });

export const DRUM_BEATS_STUDIO = build("studio");
export const DRUM_BEATS_L1 = build("l1");

// Analog Kit drum beats: the drum-beat catalogue (139 existing grooves + the new Analog grooves)
// voiced with the Analog Kit recordings (sample pack id "analogkit", CC0). The three beats that
// carry an 808 bass hit take it from the Electronic Kit's sub kicks (pack id "electronic", CC0).
//
// How a beat is voiced
//   · A recipe is abstract drum ROLES on a 16th grid (see percussion-recipes.js). Here each role
//     is mapped to recordings by a PERSONA (Jazz Club, Rusty, Unruly, Swirly, Concert, Modern Mix).
//   · Levels come from analog-calibration.js (measured loudness), not from hand-set gains, and
//     tails are trimmed per role and tempo so long recordings (kicks ~1 s, hats ~0.4 s) don't smear.
//   · Dynamics: a step is only normal (x) or accent (X, +1.9 dB). Roles that use both are split
//     into a medium-layer channel and a hard-layer channel, so accents are real harder hits.
//   · A beat has at most 16 channels; splits are undone, least important first, to fit.
//   · Within a genre no two beats share the same kick + snare + hat recordings (when options allow).
//
// Imports only data modules (never beat collections) to avoid import cycles.
import { PACKS } from "./pack-catalogue.js";
import { CAL } from "./analog-calibration.js";
import { clean, expandRole, recipeRoles } from "./percussion-recipes.js";
import { DRUM_RECIPES, GENRE_ORDER, START_HERE_IDS } from "./drum-catalogue.js";
import { ANALOG_GROOVES, ANALOG_GENRES_NEW, ANALOG_START_IDS } from "./analog-grooves.js";
import { ANALOG_ADDS } from "./analog-adds.js";
import { ANALOG_PINS } from "./analog-pins.js";
import { HEADROOM } from "./analog-headroom.js";
import { ANALOG_PACK_ID } from "./analog-pack.js";

// ------------------------------------------------------------------ sound resolution
const catalogue = (packId) => {
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) throw new Error(`Sample pack not in the catalogue: ${packId}`);
  const prefix = new RegExp(`^${packId}-`);
  return new Map(pack.sounds.map((row) => [row[0].replace(prefix, "").replace(/@hit@1$/, ""), row]));
};
const CATALOGUES = { [ANALOG_PACK_ID]: catalogue(ANALOG_PACK_ID), electronic: catalogue("electronic") };

// A name is an exact short id ("kicks-jazz-club-jazz-kick-medium") or a suffix that matches exactly
// one sound ("jazz-kick-medium"). Anything else throws at import, so a typo can never ship.
function snd(name, packId = ANALOG_PACK_ID) {
  const map = CATALOGUES[packId];
  let key = map.has(name) ? name : null;
  if (!key) {
    const hits = [...map.keys()].filter((k) => k.endsWith(`-${name}`));
    if (hits.length !== 1)
      throw new Error(
        `Analog Kit sound "${name}" is ${hits.length ? `ambiguous (${hits.slice(0, 4).join(", ")})` : "unknown"}.`,
      );
    key = hits[0];
  }
  const row = map.get(key);
  const cal = CAL[`${packId}/${row[0]}`];
  if (!cal) throw new Error(`No calibration for ${packId}/${row[0]}; run build-analog-calibration.mjs.`);
  return {
    pack: packId,
    assetId: row[0],
    label: row[1],
    loud: cal[0],
    tail: cal[1],
    clarity: cal[2],
    dur: cal[4],
    pcm: cal[5],
  };
}

// V(medium, hard, soft, overrides): one voice = three velocity layers of the same instrument.
const V = (m, h = m, s = m, o = {}) => ({ m: snd(m), h: snd(h), s: snd(s), p: 1, g: 1, ...o });
const SUB = (name) => {
  const x = snd(name, "electronic");
  return { m: x, h: x, s: x, p: 1, g: 1 };
};

// ------------------------------------------------------------------------ roles
// Existing roles first (same codes as percussion-recipes.js), then the Analog hand-percussion
// and articulation roles used by the new grooves.
export const ANALOG_ROLE_ORDER = [
  "K", "K2", "BA", "S", "S2", "SS", "RS", "SB", "C", "H", "HP", "HT", "HH", "O", "RD", "RB",
  "CR", "SP", "CH", "SC", "CC", "GO", "B", "B2", "R", "T3", "T2", "T1", "F1", "F2", "SH", "TB",
  "TK", "CG", "CS", "QU", "BH", "BL", "DJ", "DB", "FD", "CJ", "CM", "CP", "WB", "CV", "TR", "BD",
];
const NAMES = {
  K: "Kick", K2: "Low Drum", BA: "808 Bass", S: "Snare", S2: "Ghost Snare", SS: "Side Stick",
  RS: "Rimshot", SB: "Brush Snare", C: "Clap", H: "Hat", HP: "Pedal Hat", HT: "Hat Tap",
  HH: "Half-Open Hat", O: "Open Hat", RD: "Ride", RB: "Ride Bell", CR: "Crash", SP: "Splash",
  CH: "China", SC: "Suspended Cymbal", CC: "Clash Cymbal", GO: "Gong", B: "Bell", B2: "High Bell",
  R: "Rim / Clave", T3: "Rack Tom 1", T2: "Rack Tom 2", T1: "Rack Tom 3", F1: "Floor Tom 1",
  F2: "Floor Tom 2", SH: "Shaker", TB: "Tambourine", TK: "Tick", CG: "Conga", CS: "Conga Slap",
  QU: "Quinto", BH: "Bongo Hi", BL: "Bongo Lo", DJ: "Djembe", DB: "Darbuka", FD: "Frame Drum",
  CJ: "Cajon Bass", CM: "Cajon Mid", CP: "Cajon Slap", WB: "Wood Block", CV: "Claves",
  TR: "Triangle", BD: "Brake Drum",
};
export const ANALOG_ROLE_NAMES = NAMES;

// Target loudness per role (dB RMS over the first 150 ms of the played recording). Channel volume
// is the gain that takes the medium-layer recording to this target, so a hard layer stays louder
// than its medium layer exactly as recorded. Chosen to sit with the Studio kit's output level.
const TARGET = {
  K: -18, K2: -20, BA: -13, S: -19, S2: -26, SS: -22, RS: -20, SB: -21, C: -22, H: -25, HP: -26,
  HT: -29, HH: -24, O: -24, RD: -26, RB: -23, CR: -22, SP: -24, CH: -22, SC: -23, CC: -22,
  GO: -20, B: -22, B2: -25, R: -23, T3: -21, T2: -21, T1: -20, F1: -20, F2: -20, SH: -27,
  TB: -25, TK: -29, CG: -20, CS: -21, QU: -21, BH: -22, BL: -21, DJ: -21, DB: -20, FD: -20,
  CJ: -19, CM: -21, CP: -21, WB: -24, CV: -25, TR: -27, BD: -22,
};
// Longest useful body (seconds) per role at a mid tempo; scaled for slow and fast tempos.
const CAP = {
  K: 0.48, K2: 0.6, BA: 0.9, S: 0.3, S2: 0.16, SS: 0.2, RS: 0.28, SB: 0.3, C: 0.26, H: 0.1,
  HP: 0.12, HT: 0.06, HH: 0.28, O: 0.34, RD: 0.5, RB: 0.42, CR: 1.1, SP: 0.5, CH: 0.9, SC: 1.4,
  CC: 1.0, GO: 2.0, B: 0.3, B2: 0.35, R: 0.15, T3: 0.5, T2: 0.5, T1: 0.55, F1: 0.65, F2: 0.7,
  SH: 0.14, TB: 0.2, TK: 0.05, CG: 0.5, CS: 0.4, QU: 0.45, BH: 0.3, BL: 0.32, DJ: 0.5, DB: 0.4,
  FD: 0.7, CJ: 0.25, CM: 0.25, CP: 0.2, WB: 0.2, CV: 0.2, TR: 0.9, BD: 0.45,
};
const DENSE = new Set(["H", "HP", "HT", "SH", "TB", "TK", "B2", "R", "CV", "WB", "TR"]);
const SOFT_ROLES = new Set(["S2", "HT", "TK", "HP"]);
// When a beat needs more than 16 channels, layer splits are undone in this order (first = first).
const UNSPLIT_FIRST = ["HT", "TK", "SH", "TB", "B2", "R", "CV", "WB", "B", "HP", "H", "HH", "O", "C", "RD", "RB", "CR", "SS", "RS", "S2", "S", "K"];

// ---------------------------------------------------------------------- personas
// Role defaults every persona inherits unless it lists its own voices.
const COMMON = {
  K: [V("rusty-24in-medium", "rusty-24in-hard", "rusty-24in-soft")],
  K2: [V("rusty-22in-mallet", "rusty-22in-tom-hard", "rusty-22in-mallet"), V("rusty-18in-mallet")],
  S: [V("rusty-14in-center-medium", "rusty-14in-center-hard", "rusty-14in-center-soft")],
  S2: [V("rusty-14in-center-soft", "rusty-14in-center-medium", "rusty-14in-center-soft")],
  SS: [V("rusty-side-stick")],
  RS: [V("rusty-rimshot-hard", "rusty-rimshot-hard", "rusty-rimshot-medium")],
  SB: [V("rusty-14in-brush")],
  C: [V("clap-a"), V("clap-b")],
  H: [V("rusty-closed-medium", "rusty-closed-hard", "rusty-closed-soft")],
  HP: [V("rusty-chick")],
  HT: [V("rusty-tight", "rusty-tight", "rusty-closed-soft")],
  HH: [V("rusty-half-open")],
  O: [V("rusty-open-medium", "rusty-open-hard", "rusty-open-medium")],
  RD: [V("rusty-ride-22in-medium", "rusty-ride-22in-hard", "rusty-ride-22in-medium")],
  RB: [V("rusty-ride-22in-bell")],
  CR: [V("rusty-crash-17in-medium", "rusty-crash-17in-hard", "rusty-crash-17in-medium")],
  SP: [V("swirly-splash")],
  CH: [V("rusty-china-18in")],
  SC: [V("suspended-cymbal")],
  CC: [V("clash-crash-short")],
  GO: [V("gong")],
  B: [V("metal-and-wood-cowbell"), V("swirly-cowbell")],
  B2: [V("triangle-muted"), V("cowbell-muted")],
  R: [V("claves"), V("woodblock-soft")],
  T3: [V("rusty-14in-tom-soft", "rusty-14in-tom-hard", "rusty-14in-tom-soft")],
  T2: [V("rusty-15in-tom-soft", "rusty-15in-tom-hard", "rusty-15in-tom-soft")],
  T1: [V("rusty-18in-tom-soft", "rusty-18in-tom-hard", "rusty-18in-tom-soft")],
  F1: [V("rusty-22in-tom-soft", "rusty-22in-tom-hard", "rusty-22in-tom-soft")],
  F2: [V("rusty-22in-tom-hard", "rusty-22in-tom-hard", "rusty-22in-tom-soft", { p: 0.85 })],
  SH: [V("shaker-small"), V("shaker-large")],
  TB: [V("shakers-and-tambourines-tambourine"), V("tambourine-shake")],
  TK: [V("stick-click", "stick-click", "stick-click"), V("claves-b")],
  CG: [V("conga-open")],
  CS: [V("conga-slap")],
  QU: [V("quinto")],
  BH: [V("hand-percussion-bongo-high"), V("hand-percussion-swirly-bongo-high")],
  BL: [V("hand-percussion-bongo-low"), V("hand-percussion-swirly-bongo-low")],
  DJ: [V("swirly-djembe-medium", "swirly-djembe-hard", "swirly-djembe-medium")],
  DB: [V("darbuka"), V("darbuka-b"), V("swirly-darbouka-medium", "swirly-darbouka-hard", "swirly-darbouka-medium")],
  FD: [V("frame-drum")],
  CJ: [V("cajon-bass"), V("cajon-kick")],
  CM: [V("cajon-mid")],
  CP: [V("cajon-slap")],
  WB: [V("metal-and-wood-woodblock", "metal-and-wood-woodblock", "woodblock-soft"), V("unruly-woodblock-high")],
  CV: [V("claves"), V("claves-b")],
  TR: [V("metal-and-wood-triangle"), V("triangle-muted")],
  BD: [V("brake-drum")],
  BA: [SUB("sub-kicks-808-sub-kick-root"), SUB("sub-kicks-808-sub-kick-down-2"), SUB("sub-kicks-808-sub-kick-up-3")],
};

const PERSONAS = {
  jazz: {
    label: "Jazz Club",
    roles: {
      K: [
        V("jazz-kick-medium", "jazz-kick-hard", "jazz-kick-soft"),
        V("jazz-kick-soft", "jazz-kick-medium", "jazz-kick-soft", { g: 1.1 }),
        V("kicks-concert-legacy-muted", "kicks-concert-legacy-mid", "kicks-concert-legacy-muted"),
      ],
      K2: [V("jazz-floor-tom-muted", "jazz-floor-tom-medium", "jazz-floor-tom-muted"), V("jazz-floor-tom-soft")],
      S: [
        V("jazz-snare-center-medium", "jazz-snare-center-hard", "jazz-snare-center-soft"),
        V("jazz-snare-off-center", "jazz-snare-center-hard", "jazz-snare-center-soft"),
        V("jazz-snare-muted", "jazz-snare-center-medium", "jazz-snare-center-soft"),
      ],
      S2: [V("jazz-snare-center-soft", "jazz-snare-center-medium", "jazz-snare-center-soft"), V("jazz-snare-muted", "jazz-snare-muted", "jazz-snare-muted")],
      SS: [V("jazz-cross-stick-hard", "jazz-cross-stick-hard", "jazz-cross-stick-soft"), V("jazz-cross-stick-soft")],
      RS: [V("jazz-rimshot"), V("jazz-stickshot")],
      H: [
        V("jazz-closed-soft", "jazz-closed-hard", "jazz-closed-soft"),
        V("jazz-closed-hard", "jazz-closed-hard", "jazz-closed-soft", { g: 0.85 }),
        V("concert-closed-soft", "concert-closed", "concert-closed-soft"),
      ],
      HP: [V("jazz-pedal")],
      HT: [V("jazz-closed-soft", "jazz-closed-soft", "jazz-closed-soft", { g: 0.9 })],
      HH: [V("jazz-half-open")],
      O: [V("jazz-open", "jazz-open", "jazz-three-quarter-open"), V("jazz-three-quarter-open")],
      RD: [V("jazz-ride"), V("jazz-flat-ride")],
      RB: [V("jazz-ride-bell")],
      CR: [V("jazz-crash")],
      SP: [V("hi-hats-pedal-and-foot-jazz-splash")],
      T3: [V("jazz-high-tom-soft", "jazz-high-tom-hard", "jazz-high-tom-soft")],
      T2: [V("jazz-high-tom-hard", "jazz-high-tom-hard", "jazz-high-tom-soft", { p: 0.86 })],
      T1: [V("jazz-floor-tom-soft", "jazz-floor-tom-medium", "jazz-floor-tom-soft")],
      F1: [V("jazz-floor-tom-medium", "jazz-floor-tom-hard", "jazz-floor-tom-soft", { p: 0.9 })],
      F2: [V("jazz-floor-tom-hard", "jazz-floor-tom-hard", "jazz-floor-tom-medium", { p: 0.8 })],
    },
  },
  rusty: {
    label: "Rusty",
    roles: {
      K: [
        V("rusty-24in-medium", "rusty-24in-hard", "rusty-24in-soft"),
        V("rusty-24in-open-medium", "rusty-24in-open-hard", "rusty-24in-soft"),
        V("rusty-24in-hard", "rusty-24in-hard", "rusty-24in-medium"),
      ],
      S: [
        V("rusty-14in-center-medium", "rusty-14in-center-hard", "rusty-14in-center-soft"),
        V("rusty-14in-edge", "rusty-14in-edge", "rusty-14in-center-soft"),
        V("unruly-14in-center-medium", "unruly-14in-center-hard", "unruly-14in-center-soft"),
      ],
      SS: [V("rusty-side-stick"), V("piccolo-side-stick")],
      H: [
        V("rusty-closed-medium", "rusty-closed-hard", "rusty-closed-soft"),
        V("rusty-tight", "rusty-closed-hard", "rusty-closed-soft"),
        V("rusty-closed-hard", "rusty-closed-hard", "rusty-closed-soft", { g: 0.85 }),
      ],
      O: [V("rusty-open-medium", "rusty-open-hard", "rusty-open-medium"), V("rusty-open-hard", "rusty-open-hard", "rusty-open-medium", { g: 0.85 })],
      HH: [V("rusty-half-open"), V("rusty-quarter-open"), V("rusty-loose-closed")],
      RD: [V("rusty-ride-22in-medium", "rusty-ride-22in-hard", "rusty-ride-22in-medium"), V("rusty-sizzle-ride-19in")],
      CR: [V("rusty-crash-17in-medium", "rusty-crash-17in-hard", "rusty-crash-17in-medium"), V("rusty-sizzle-crash-17in")],
      SP: [V("hi-hats-pedal-and-foot-rusty-foot-splash")],
    },
  },
  unruly: {
    label: "Unruly",
    roles: {
      K: [
        V("unruly-20in-clean-hard", "unruly-20in-clean-hard", "unruly-20in-clean-soft"),
        V("unruly-20in-dirty", "unruly-20in-dirtiest", "unruly-20in-clean-soft"),
        V("unruly-20in-dirtiest", "unruly-20in-dirtiest", "unruly-20in-dirty", { g: 0.9 }),
      ],
      K2: [V("rusty-22in-tom-hard", "rusty-22in-tom-hard", "rusty-22in-tom-soft")],
      S: [
        V("unruly-14in-center-medium", "unruly-14in-center-hard", "unruly-14in-center-soft"),
        V("modern-a", "modern-a", "modern-a-soft"),
        V("piccolo-13in-center-medium", "piccolo-13in-center-hard", "piccolo-13in-center-soft"),
      ],
      S2: [V("unruly-14in-center-soft", "unruly-14in-center-medium", "unruly-14in-center-soft"), V("modern-a-soft", "modern-a-soft", "modern-a-soft", { g: 1.2 })],
      SS: [V("unruly-14in-side-stick")],
      RS: [V("unruly-14in-rimshot")],
      H: [
        V("unruly-closed-tip-soft", "unruly-closed-tip-hard", "unruly-closed-tip-soft"),
        V("unruly-tight-tip", "unruly-closed-tip-hard", "unruly-closed-tip-soft"),
        V("unruly-closed-brush", "unruly-closed-brush", "unruly-closed-tip-soft", { g: 0.8 }),
      ],
      HP: [V("unruly-foot-chick")],
      HT: [V("unruly-tight-tip", "unruly-tight-tip", "unruly-closed-tip-soft", { g: 0.8 })],
      HH: [V("unruly-half-tip"), V("unruly-loose-tip")],
      O: [V("unruly-open-tip")],
      RD: [V("unruly-ride-bow")],
      RB: [V("unruly-ride-bell")],
      CR: [V("unruly-crash-bow"), V("unruly-crash-edge")],
      T3: [V("piccolo-tom")],
      T2: [V("deep-22in-tom-clean")],
      T1: [V("deep-22in-tom-dirty")],
    },
  },
  swirly: {
    label: "Swirly",
    roles: {
      K: [
        V("marching-kick-medium", "marching-kick-hard", "marching-kick-medium"),
        V("cajon-kick", "cajon-kick", "cajon-kick"),
        V("marching-kick-hard", "marching-kick-hard", "marching-kick-medium"),
      ],
      K2: [V("rusty-22in-mallet"), V("rusty-18in-mallet"), V("kicks-swirly-marching-kick-hard", "kicks-swirly-marching-kick-hard", "kicks-swirly-marching-kick-medium", { p: 0.82 })],
      S: [
        V("swirly-snare-medium", "swirly-snare-hard", "swirly-snare-medium"),
        V("rope-snare", "rope-snare", "rope-snare-low"),
        V("marching-snare", "marching-snare", "old-snare"),
      ],
      S2: [V("old-snare", "marching-snare", "old-snare"), V("swirly-snare-medium", "swirly-snare-medium", "swirly-snare-medium", { g: 1.4 })],
      SS: [V("rusty-side-stick"), V("jazz-cross-stick-soft")],
      H: [V("swirly-closed", "swirly-closed", "swirly-tight"), V("swirly-tight", "swirly-closed", "swirly-tight")],
      HP: [V("swirly-foot")],
      HT: [V("swirly-tight", "swirly-tight", "swirly-tight", { g: 0.8 })],
      HH: [V("swirly-half")],
      O: [V("swirly-open"), V("swirly-sizzling")],
      RD: [V("swirly-ride")],
      CR: [V("swirly-crash"), V("swirly-broken-crash")],
      CH: [V("swirly-china")],
      T3: [V("hand-percussion-swirly-bongo-high"), V("hand-percussion-bongo-high")],
      T2: [V("conga-slap"), V("quinto")],
      T1: [V("conga-open")],
      F1: [V("swirly-djembe-medium", "swirly-djembe-hard", "swirly-djembe-medium")],
      F2: [V("swirly-djembe-hard", "swirly-djembe-hard", "swirly-djembe-medium", { p: 0.85 })],
    },
  },
  concert: {
    label: "Concert",
    roles: {
      K: [
        V("kicks-concert-concert-hard", "kicks-concert-concert-hard", "kicks-concert-concert-soft"),
        V("kicks-concert-orchestral", "kicks-concert-concert-hard", "kicks-concert-orchestral-soft"),
        V("kicks-concert-legacy-big", "kicks-concert-legacy-big", "kicks-concert-legacy-mid"),
      ],
      K2: [V("toms-concert-and-tenor-tom-low-soft", "toms-concert-and-tenor-tom-low", "toms-concert-and-tenor-tom-low-soft"), V("kicks-concert-legacy-mid")],
      S: [
        V("marching-snare", "marching-snare", "old-snare"),
        V("rope-snare", "rope-snare", "rope-snare-low"),
        V("piccolo-13in-center-medium", "piccolo-13in-center-hard", "piccolo-13in-center-soft"),
      ],
      SS: [V("cross-stick-concert-a"), V("cross-stick-concert-b")],
      RS: [V("rimshot-concert")],
      H: [V("concert-closed-soft", "concert-closed", "concert-closed-soft")],
      HP: [V("concert-pedal")],
      HT: [V("concert-closed-soft", "concert-closed-soft", "concert-closed-soft", { g: 0.85 })],
      HH: [V("concert-loose")],
      O: [V("concert-open")],
      RD: [V("cymbals-orchestral-suspended-cymbal-b")],
      RB: [V("suspended-cymbal-bell")],
      CR: [V("clash-crash"), V("clash-crash-short")],
      SP: [V("clash-crash-short")],
      CH: [V("gong")],
      T3: [V("toms-concert-and-tenor-tom-high", "toms-concert-and-tenor-tom-high", "toms-concert-and-tenor-tom-high-soft")],
      T2: [V("toms-concert-and-tenor-tenor-tom-high", "toms-concert-and-tenor-tenor-tom-high", "toms-concert-and-tenor-tom-high-soft", { p: 0.92 })],
      T1: [V("toms-concert-and-tenor-tom-low", "toms-concert-and-tenor-tom-low", "toms-concert-and-tenor-tom-low-soft")],
      F1: [V("toms-concert-and-tenor-tenor-tom-low", "toms-concert-and-tenor-tenor-tom-low", "toms-concert-and-tenor-tom-low-soft", { p: 0.9 })],
    },
  },
  modern: {
    label: "Modern Mix",
    roles: {
      K: [
        V("unruly-20in-clean-hard", "unruly-20in-clean-hard", "unruly-20in-clean-soft"),
        V("rusty-24in-medium", "rusty-24in-hard", "rusty-24in-soft"),
        V("unruly-20in-dirty", "unruly-20in-dirtiest", "unruly-20in-clean-soft"),
      ],
      S: [
        V("modern-a", "modern-a", "modern-a-soft"),
        V("modern-b", "modern-b", "modern-a-soft", { g: 0.9 }),
        V("modern-c", "modern-c", "modern-a-soft"),
        V("piccolo-13in-center-medium", "piccolo-13in-center-hard", "piccolo-13in-center-soft"),
        V("deep-22in-center-medium", "deep-22in-center-hard", "deep-22in-center-soft"),
      ],
      S2: [V("modern-a-soft", "modern-a-soft", "modern-a-soft", { g: 1.2 }), V("piccolo-13in-center-soft", "piccolo-13in-center-medium", "piccolo-13in-center-soft")],
      SS: [V("piccolo-side-stick"), V("unruly-14in-side-stick")],
      RS: [V("piccolo-rimshot")],
      H: [
        V("rusty-closed-medium", "rusty-closed-hard", "rusty-closed-soft"),
        V("rusty-tight", "rusty-closed-hard", "rusty-closed-soft"),
        V("unruly-closed-tip-soft", "unruly-closed-tip-hard", "unruly-closed-tip-soft"),
      ],
      O: [V("rusty-open-medium", "rusty-open-hard", "rusty-open-medium"), V("unruly-open-tip")],
      RD: [V("unruly-ride-bow")],
      RB: [V("unruly-ride-bell")],
      CR: [V("unruly-crash-bow"), V("unruly-crash-edge")],
      T3: [V("piccolo-tom")],
      T2: [V("deep-22in-tom-clean")],
      T1: [V("deep-22in-tom-dirty")],
    },
  },
};
for (const [key, persona] of Object.entries(PERSONAS)) {
  persona.key = key;
  persona.voices = { ...COMMON, ...persona.roles };
}
export const ANALOG_PERSONAS = Object.values(PERSONAS).map((p) => ({ key: p.key, label: p.label }));

// "Auto" cycles through these per genre so a genre's beats don't all share one drummer.
const GENRE_PERSONAS = {
  Rock: ["rusty", "unruly", "rusty", "modern"], Pop: ["modern", "unruly"], Funk: ["rusty", "unruly"],
  "Hip-Hop": ["unruly", "modern"], "Lo-Fi": ["unruly", "jazz"], House: ["modern", "unruly"],
  Techno: ["modern", "unruly", "rusty"], Disco: ["modern", "rusty"], Electro: ["modern", "unruly"],
  "Trap & Drill": ["unruly", "modern"], "UK Garage": ["modern", "unruly"],
  "Drum & Bass": ["unruly", "modern", "rusty"], Jungle: ["unruly", "rusty"],
  Breakbeat: ["unruly", "rusty"], Dubstep: ["unruly", "modern"], "Footwork & Jersey": ["unruly", "modern"],
  "Reggae & Dub": ["rusty", "jazz", "unruly"], "Dancehall & Reggaeton": ["modern", "swirly", "unruly"],
  "Afrobeat & African": ["swirly"], Latin: ["swirly"], Brazilian: ["swirly", "jazz"],
  "Middle Eastern": ["swirly"], Indian: ["swirly"], "East Asian & Pacific": ["swirly", "concert"],
  "Folk & Marching": ["swirly", "concert", "rusty"], Jazz: ["jazz"], "Blues & Shuffle": ["jazz", "rusty"],
  Punk: ["rusty", "unruly"], Metal: ["rusty", "modern"], "Indie & Post-Punk": ["unruly", "rusty"],
  Industrial: ["unruly", "rusty", "concert"], "Minimal & Glitch": ["unruly", "modern"],
  "Country & Americana": ["rusty", "jazz"], "Soul, Motown & Gospel": ["jazz", "rusty"],
  "R&B & Neo-Soul": ["unruly", "jazz"], "Ska & Rocksteady": ["rusty", "jazz"],
  "Surf, Garage & Rockabilly": ["rusty", "unruly"], "New Orleans & Second Line": ["swirly", "jazz"],
  "Orchestral & Cinematic": ["concert"], Celtic: ["swirly", "rusty"],
  "Krautrock & Post-Rock": ["unruly", "rusty"], "Live Electronic": ["unruly", "modern"],
};
// Existing recipes whose style is better served by a specific persona than by the genre cycle.
const RECIPE_PERSONA = {
  "bossa-nova-clave": "jazz", "jazz-swing-ride": "jazz", "blues-shuffle": "jazz", "lofi-head-nod": "unruly",
  "samba-batucada": "swirly", afrobeat: "swirly", "rock-basic": "rusty", "pop-four-square": "modern",
  "classic-house": "modern", "warehouse-techno": "modern", "funk-break": "rusty", "boom-bap": "unruly",
  "trap-halftime": "unruly", "dnb-two-step": "unruly", "uk-garage-2step": "modern", dembow: "modern",
  "reggae-one-drop": "rusty", "disco-four": "modern",
};

// --------------------------------------------------------------------- recipes
export const ANALOG_GENRE_ORDER = [...GENRE_ORDER, ...ANALOG_GENRES_NEW];
// Analog-only extra hits (analog-adds.js) are merged into a copy of the recipe.
const withAdds = (recipe) => {
  const add = ANALOG_ADDS[recipe.id];
  if (!add) return recipe;
  const v = { ...recipe.v };
  for (const [role, pattern] of Object.entries(add)) v[role] = clean(pattern);
  return { ...recipe, v };
};
const all = [...DRUM_RECIPES, ...ANALOG_GROOVES].map(withAdds);
{
  const known = new Set([...DRUM_RECIPES, ...ANALOG_GROOVES].map((r) => r.id));
  for (const id of [...Object.keys(ANALOG_ADDS), ...Object.keys(ANALOG_PINS)])
    if (!known.has(id)) throw new Error(`Analog coverage names an unknown groove: ${id}`);
}
{
  const ids = new Set();
  for (const r of all) {
    if (ids.has(r.id)) throw new Error(`Duplicate Analog beat id: ${r.id}`);
    ids.add(r.id);
    if (!ANALOG_GENRE_ORDER.includes(r.genre)) throw new Error(`Unlisted Analog genre: ${r.genre}`);
    if (r.persona && !PERSONAS[r.persona]) throw new Error(`${r.id}: unknown persona ${r.persona}`);
  }
}
const startIds = [...START_HERE_IDS, ...ANALOG_START_IDS];
const rank = (r) => ANALOG_GENRE_ORDER.indexOf(r.genre);
const startRank = (r) => startIds.indexOf(r.id);
const ordered = [...all].sort(
  (a, b) =>
    (startRank(a) < 0) - (startRank(b) < 0) ||
    (startRank(a) >= 0 && startRank(b) >= 0 ? startRank(a) - startRank(b) : 0) ||
    rank(a) - rank(b) ||
    (a.tonal ? 1 : 0) - (b.tonal ? 1 : 0) ||
    all.indexOf(a) - all.indexOf(b),
);
export const ANALOG_RECIPES = ordered;

// ------------------------------------------------------------------------ build
const EMPTY = /^\.*$/;
// The three roles that define a beat's sound: kick, backbone (snare/clap) and time-keeper (hat/ride).
const AXES = [
  ["K", "K2"],
  ["S", "SS", "RS", "SB", "C"],
  ["H", "RD", "O", "SH", "HT", "TB"],
];
const OFFSET = { O: 1, CR: 2, HH: 1, HP: 1, RB: 1, SP: 1 };

// `bump` walks the kick × backbone × time-keeper combinations like an odometer, so a genre's beats
// can each get a different combination before any repeats.
function plan(recipe, persona, seed, bump, pins = null) {
  const present = ANALOG_ROLE_ORDER.filter((role) => {
    if (!recipeRoles(recipe).includes(role)) return false;
    return !EMPTY.test(expandRole(recipe, role));
  });
  for (const role of recipeRoles(recipe))
    if (!ANALOG_ROLE_ORDER.includes(role)) throw new Error(`${recipe.id}: unknown role ${role}`);
  const axisRole = AXES.map((axis) => axis.find((role) => present.includes(role)));
  const radix = axisRole.map((role) => (role ? persona.voices[role].length : 1));
  const digit = [
    bump % radix[0],
    Math.floor(bump / radix[0]) % radix[1],
    Math.floor(bump / (radix[0] * radix[1])) % radix[2],
  ];
  return present.map((role) => {
    const options = persona.voices[role];
    if (!options?.length) throw new Error(`${persona.key}: no voice for role ${role} (${recipe.id})`);
    const axis = axisRole.indexOf(role);
    const pinned = pins?.[role];
    const voice = pinned
      ? pinVoice(pinned)
      : options[(seed + (axis >= 0 ? digit[axis] : (OFFSET[role] ?? 0))) % options.length];
    return { role, voice, pattern: expandRole(recipe, role), split: false };
  });
}

// A pinned recording plays on one layer (no medium/hard split) at its own measured level.
const pinVoices = new Map();
const pinVoice = (name) => {
  if (!pinVoices.has(name)) pinVoices.set(name, V(name));
  return pinVoices.get(name);
};

function build(recipe, persona, index, pins = null) {
  const used = build.used;
  const genreUsed = used.get(recipe.genre) || new Set();
  used.set(recipe.genre, genreUsed);
  let items,
    signature;
  for (let bump = 0; bump < 40; bump++) {
    items = plan(recipe, persona, index, bump, pins);
    const pick = (...roles) => items.find((i) => roles.includes(i.role))?.voice.m.assetId ?? "-";
    signature = `${pick("K", "K2")}|${pick("S", "SS", "RS", "SB", "C")}|${pick("H", "RD", "O", "SH", "HT", "TB")}`;
    if (!genreUsed.has(signature)) break;
    // Out of options: keep the last tried combination.
  }
  genreUsed.add(signature);

  // Decide layer splits (medium channel for x, hard channel for X) and fit 16 channels.
  for (const item of items) {
    const hasX = /X/.test(item.pattern),
      hasx = /x/.test(item.pattern);
    item.split = hasX && hasx && item.voice.h.assetId !== item.voice.m.assetId;
  }
  const count = () => items.reduce((n, i) => n + (i.split ? 2 : 1), 0);
  for (const role of UNSPLIT_FIRST) {
    if (count() <= 16) break;
    const item = items.find((i) => i.role === role && i.split);
    if (item) item.split = false;
  }
  while (count() > 16) {
    // More than 16 distinct roles: drop the quietest accessory (never kick, snare or hat).
    const drop = [...items].reverse().find((i) => !["K", "S", "H", "BA"].includes(i.role));
    items.splice(items.indexOf(drop), 1);
  }

  const channels = [];
  for (const item of items) {
    const { role, voice } = item;
    const soft = SOFT_ROLES.has(role);
    const ref = soft ? voice.s : voice.m;
    const gain = 10 ** ((TARGET[role] - ref.loud) / 20) * voice.g * (recipe.level?.[role] ?? 1);
    const hitsOf = (pat) => pat.replace(/\./g, "").length;
    const mk = (sound, pattern, suffix) => {
      const hits = hitsOf(pattern);
      const crowded = hits / 64 > 0.6 ? 0.78 : 1;
      const felt = recipe.felt ?? recipe.bpm;
      const scale = felt <= 85 ? 1.4 : felt >= 150 ? 0.75 : 1;
      let tail = CAP[role] * scale;
      const stepSec = 60 / recipe.bpm / 4;
      if (DENSE.has(role) && hits / 64 > 0.4) tail = Math.min(tail, stepSec * 1.6);
      // Never let a role ring across more than ~2.5 of its own median gaps, so dense patterns
      // don't pile up voices and clip.
      const gaps = gapsOf(pattern);
      if (gaps.length) tail = Math.min(tail, Math.max(0.08, 2.5 * gaps[gaps.length >> 1] * stepSec));
      tail = Math.max(0.03, Math.min(tail, sound.tail + 0.02, sound.dur));
      return {
        source: {
          type: "pack",
          value: `${sound.pack}/${sound.assetId}`,
          label: sound.label,
          audioSha256: sound.pcm,
        },
        name: NAMES[role] + suffix,
        role,
        kind: "hit",
        pattern,
        volume: +Math.min(1, Math.max(0.05, gain * crowded)).toFixed(3),
        pitch: voice.p,
        trimSeconds: [0, +tail.toFixed(2)],
        fx: { ...voice.fx, ...recipe.fx[role] },
      };
    };
    if (item.split) {
      channels.push(mk(voice.m, item.pattern.replace(/X/g, "."), ""));
      channels.push(mk(voice.h, item.pattern.replace(/x/g, ".").replace(/X/g, "x"), " Hard"));
    } else if (/^[.X]+$/.test(item.pattern) && voice.h.assetId !== voice.m.assetId) {
      // Accent-only role: play it on the hard layer.
      channels.push(mk(voice.h, item.pattern.replace(/X/g, "x"), ""));
    } else if (soft) {
      channels.push(mk(voice.s, item.pattern, ""));
    } else {
      channels.push(mk(voice.m, item.pattern, ""));
    }
  }

  const withBass = items.some((i) => i.role === "BA");
  const parts = [...new Set(channels.filter((c) => c.role !== "BA").map((c) => c.name.replace(/ Hard$/, "").toLowerCase()))];
  const feel = recipe.felt
    ? ` Triplet-swing feel at ♩=${recipe.felt}: each step is a swung 8th note, so the tempo shown (${recipe.bpm}) is the grid rate, half the felt tempo.`
    : "";
  return {
    id: `drums-analog-${recipe.id}`,
    recipeId: recipe.id,
    name: recipe.name,
    genre: recipe.genre,
    bpm: recipe.bpm,
    swing: recipe.swing,
    ...(recipe.felt && { feltBpm: recipe.felt }),
    bars: 4,
    collection: "analog",
    percussion: true,
    drumBeat: true,
    analog: true,
    persona: persona.key,
    startHere: startIds.includes(recipe.id),
    withBass,
    world: !!recipe.world,
    soundFamilies: ["analog"],
    channels,
    description: `${recipe.world ? "World rhythm" : "Drum beat"} at ${recipe.felt ?? recipe.bpm} BPM on the ${persona.label} kit with ${parts.join(", ")}${withBass ? ", plus an 808 bass hit (Electronic Kit sub kick) because the style calls for it" : " — drums only, no bass or melody"}; four bars with a fill in the last.${feel} Analog Kit recordings (CC0).`,
  };
}

// Sorted gaps (in steps) between consecutive hits of a 64-step pattern, wrapping around the loop.
function gapsOf(pattern) {
  const at = [];
  for (let i = 0; i < pattern.length; i++) if (pattern[i] !== ".") at.push(i);
  if (at.length < 2) return [];
  return at.map((p, i) => (at[(i + 1) % at.length] - p + pattern.length) % pattern.length || pattern.length).sort((a, b) => a - b);
}

const cache = new Map();
// kit: "auto" (each beat's own persona) or a persona key to voice every beat on that kit.
// options.raw: skip the headroom trims (used by render-analog-beats.mjs to measure the true peaks).
export function analogBeats(kit = "auto", options = {}) {
  if (kit !== "auto" && !PERSONAS[kit]) throw new Error(`Unknown Analog kit: ${kit}`);
  const cacheKey = options.raw ? `${kit}:raw` : kit;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  build.used = new Map();
  const seen = new Map();
  const trims = options.raw ? {} : HEADROOM[kit] || {};
  const beats = ordered.map((recipe) => {
    const genreIndex = seen.get(recipe.genre) ?? 0;
    seen.set(recipe.genre, genreIndex + 1);
    const key =
      kit !== "auto"
        ? kit
        : recipe.persona ||
          RECIPE_PERSONA[recipe.id] ||
          GENRE_PERSONAS[recipe.genre][genreIndex % GENRE_PERSONAS[recipe.genre].length];
    const beat = build(recipe, PERSONAS[key], genreIndex, kit === "auto" ? ANALOG_PINS[recipe.id] : null);
    const trim = trims[recipe.id];
    if (trim && trim < 1) for (const ch of beat.channels) ch.volume = +Math.max(0.01, ch.volume * trim).toFixed(3);
    return beat;
  });
  cache.set(cacheKey, beats);
  return beats;
}
export const DRUM_BEATS_ANALOG = analogBeats("auto");

// Shared helpers for the Analog Kit grooves (analog-grooves-a.js … d.js).
//
// A groove is a recipe like those in drum-grooves.js: abstract drum roles on a 16th grid
// (16 steps = one bar, 32 = two bars; x hit, X accent, . rest; spaces and | are ignored) with a
// bar-4 fill. See analog-kits.js for the role list and how roles are voiced.
//
// Swing note: the engine delays every odd 16th by the swing amount, so swung 16th-note feels
// (hip-hop, R&B, funk) are written with hats on 16ths. Triplet-swing styles (jazz swing, blues
// and country shuffles) are written on a DOUBLE GRID: each step is one swung 8th note, so the
// tempo is the grid rate (HALF the felt tempo), swing is about 33 and `felt` carries the real tempo.
import { R, all16, eighths, four, backbeat } from "./percussion-recipes.js";

export { all16, eighths, four, backbeat };

// N(id, name, genre, bpm, swing, persona, roles, fill, fx, extra)
//   persona: "jazz" | "rusty" | "unruly" | "swirly" | "concert" | "modern" | null (genre default)
//   extra:   { world, felt, level, lint }
//              level: { ROLE: multiplier } scales a role's measured level (feathered jazz kick 0.45)
//              lint:  names a rule checked by the tests
export const N = (id, name, genre, bpm, swing, persona, v, fill = {}, fx = {}, extra = {}) =>
  Object.assign(
    R(id, name, genre, bpm, swing, "ac", !!extra.world, v, fill, fx),
    { analog: true },
    persona ? { persona } : {},
    extra,
  );

// Reusable patterns (grouped per beat for readability).
export const Q8 = "x.x. x.x. x.x. x.x."; // straight 8ths
export const OFF = "..x. ..x. ..x. ..x."; // off-beat 8ths
export const QTR = "x... x... x... x..."; // quarter notes
export const BB = ".... x... .... x..."; // backbeat on 2 and 4
export const HLF = ".... .... x... ...."; // half-time snare on 3
export const A16 = "Xxxx Xxxx Xxxx Xxxx"; // 16ths, accented on the beat
export const OFF16 = ".x.x .x.x .x.x .x.x"; // off 16ths

// Bar-4 fills.
export const FS = { S: ".... x... x.x. xxxx" }; // snare build
export const FT = { T3: ".... .... ..x. ....", T2: ".... .... ...x ....", T1: ".... .... .... x...", F1: ".... .... .... ..x.", F2: ".... .... .... ...x" }; // tom run down
export const FT2 = { T3: ".... .... .... x...", T2: ".... .... .... ..x.", T1: ".... .... .... ...x" }; // short tom turnaround
export const FC = { C: ".... x... x.x. xxxx" }; // clap build

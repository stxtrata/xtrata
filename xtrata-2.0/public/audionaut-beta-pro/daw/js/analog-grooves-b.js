// Analog Kit grooves, batch B: Jazz, Blues & Shuffle, New Orleans, Ska & Rocksteady,
// Reggae & Dub, Celtic, Folk & Marching (42 grooves).
//
// Triplet-swing grooves are written on the DOUBLE GRID (see analog-groove-helpers.js): each step is
// a swung 8th, the project tempo is HALF the felt tempo and `felt` carries the real one. 16 steps
// are therefore two bars of 4/4. Names of those grooves show the felt tempo (♩=).
import { N, Q8, OFF, QTR, BB, HLF, A16, OFF16, FS, FT, FT2, FC } from "./analog-groove-helpers.js";

const NOLA = "New Orleans & Second Line";
const SKA = "Ska & Rocksteady";

const SWING_RIDE = "x.xx x.xx x.xx x.xx"; // ding, ding-a, ding, ding-a
const TWO_FOUR = "..x. ..x. ..x. ..x."; // beats 2 and 4 of each bar on the double grid
const FEATHER = "x.x. x.x. x.x. x.x."; // feathered kick on every beat

export const GROOVES_B = [
  // ------------------------------------------------------------------------- Jazz (+10)
  N("jazz-medium-swing", "Medium Swing (♩=120)", "Jazz", 60, 33, "jazz", {
    RD: SWING_RIDE, HP: TWO_FOUR, K: FEATHER, S2: "...x .... ...x .x..",
  }, { S2: "...x ..x. .x.x x.xx", T3: ".... .... .... ..x." }, {}, { felt: 120, level: { K: 0.45 } }),
  N("jazz-uptempo-swing", "Up-Tempo Swing (♩=180)", "Jazz", 90, 27, "jazz", {
    RD: SWING_RIDE, HP: TWO_FOUR, K: FEATHER, S2: ".... ..x. .... .x.x",
  }, { S2: "..x. .x.x ..x. xxxx" }, {}, { felt: 180, level: { K: 0.4 } }),
  N("jazz-ballad-brushes", "Ballad Brushes (♩=62)", "Jazz", 31, 30, "jazz", {
    SB: "x.x. x.x. x.x. x.x.", HP: TWO_FOUR, K: "x... .... x... ....", RD: "x.xx .... x.xx ....",
  }, { SB: "x.x. x.x. x.xx xxxx" }, {}, { felt: 62, level: { K: 0.4, RD: 0.6 } }),
  N("jazz-latin-clave", "Latin Jazz Clave", "Jazz", 126, 0, "jazz", {
    R: "x..x ..x. ..x. x...", RD: Q8, K: "x... ..x. x... ..x.", CG: "..xx ..x. ..xx ..x.", HP: ".... x... .... x...",
  }, { CG: "xxxx xxxx xxxx xxxx" }, {}, { world: true, level: { K: 0.55 } }),
  N("jazz-brush-swing", "Brush Swing (♩=140)", "Jazz", 70, 31, "jazz", {
    SB: SWING_RIDE, HP: TWO_FOUR, K: FEATHER, S2: ".... ...x .... ...x",
  }, { SB: "x.xx x.xx x.xx xxxx" }, {}, { felt: 140, level: { K: 0.4 } }),
  N("jazz-hard-bop", "Hard Bop (♩=132)", "Jazz", 66, 36, "jazz", {
    RD: SWING_RIDE, HP: TWO_FOUR, K: FEATHER, S: "x... ..X. ...X ..x.", S2: "...x .... .x.. ....",
  }, { S: "..x. .x.x ..x. xXxX" }, {}, { felt: 132, level: { K: 0.6, S: 0.8 } }),
  N("jazz-fusion-ghosts", "Fusion Ghost Notes", "Jazz", 108, 12, "unruly", {
    K: "x..x ..x. .x.. x...", S: ".... x... .... x...", S2: ".x.x ...x .x.. ...x", H: "x.xx x.xx x.xx x.xx",
  }, { S: ".... x... x.x. xxxx" }),
  N("jazz-modal-ride", "Modal Ride Pulse (♩=96)", "Jazz", 48, 28, "jazz", {
    RD: "x.xx x.x. x.xx x.xx", RB: "x... .... .... ....", HP: TWO_FOUR, K2: "x... .... x... ....", SC: "x... .... .... ....",
  }, { K2: "x... .... x.x. x..." }, {}, { felt: 96, level: { K2: 0.7 } }),
  N("jazz-big-band-shout", "Big Band Shout (♩=150)", "Jazz", 75, 33, "jazz", {
    RD: SWING_RIDE, HP: TWO_FOUR, K: FEATHER, S: "x... ..X. ...X ..x.", CR: "x... .... .... ....",
  }, { S: "x.x. xxxx x.x. xXxX" }, {}, { felt: 150, level: { K: 0.6, S: 0.85 } }),
  N("jazz-slow-burn", "Slow Burn Swing (♩=72)", "Jazz", 36, 38, "jazz", {
    HT: SWING_RIDE, SS: TWO_FOUR, K: "x... .... x... ....", RB: "x... .... .... ....",
  }, { SS: "..x. ..x. ..x. xxxx" }, {}, { felt: 72, level: { K: 0.7 } }),

  // ---------------------------------------------------------------- Blues & Shuffle (+7)
  N("blues-chicago-shuffle", "Chicago Shuffle (♩=120)", "Blues & Shuffle", 60, 33, "jazz", {
    K: QTR, S: TWO_FOUR, H: "XxXx XxXx XxXx XxXx",
  }, { S: "..x. ..x. ..x. xxxx" }, {}, { felt: 120 }),
  N("blues-slow-shuffle", "Slow Blues Shuffle (♩=66)", "Blues & Shuffle", 33, 33, "jazz", {
    K: "x... .... x... ....", S: TWO_FOUR, RD: "XxXx XxXx XxXx XxXx",
  }, { S: "..x. ..x. xxxx xxxx" }, {}, { felt: 66, level: { RD: 0.8 } }),
  N("blues-texas-shuffle", "Texas Shuffle (♩=138)", "Blues & Shuffle", 69, 36, "rusty", {
    K: FEATHER, S: TWO_FOUR, H: "x.xx x.xx x.xx x.xx", CR: "x... .... .... ....",
  }, FS, {}, { felt: 138, level: { K: 0.8 } }),
  N("blues-slow-drag", "Slow Drag (♩=54)", "Blues & Shuffle", 27, 30, "jazz", {
    K: "x... .... x... x...", SS: TWO_FOUR, RD: "x.x. x.x. x.x. x.x.",
  }, { SS: "..x. ..x. ..x. xxxx" }, {}, { felt: 54, level: { RD: 0.8 } }),
  N("blues-rock-shuffle", "Blues-Rock Shuffle (♩=112)", "Blues & Shuffle", 56, 33, "rusty", {
    K: "x..x ..x. x... ..x.", S: TWO_FOUR, H: "x.xx x.xx x.xx x.xx", O: ".... .... .... ..x.",
  }, FS, {}, { felt: 112 }),
  N("blues-boogie-woogie", "Boogie-Woogie (♩=150)", "Blues & Shuffle", 75, 33, "rusty", {
    K: FEATHER, S: TWO_FOUR, TB: "x.xx x.xx x.xx x.xx", RD: "x... .... x... ....",
  }, { S: "..x. xxxx ..x. xxxx" }, {}, { felt: 150, level: { K: 0.85 } }),
  N("blues-funky-delta", "Funky Delta Stomp", "Blues & Shuffle", 96, 14, "rusty", {
    K2: "x..x ..x. ..x. ....", S: BB, H: "x.x. x.x. x.xx x.x.", TB: OFF,
  }, FT2),

  // ------------------------------------------------- New Orleans & Second Line (5)
  N("nola-second-line", "Second Line", NOLA, 104, 14, "swirly", {
    K: "x... ..x. x... ..x.", S: "x..x ..x. .x.x ..x.", R: "x..x ..x. ..x. ..x.", TB: OFF,
  }, { S: "x.x. xxxx x.x. xxxx" }, {}, { world: true }),
  N("nola-bounce", "Bounce Beat", NOLA, 98, 10, "unruly", {
    K: "x..x .x.. x... ..x.", C: BB, H: Q8, TB: OFF,
  }, FC, {}, { world: true }),
  N("nola-street-parade", "Street Parade", NOLA, 116, 8, "swirly", {
    K2: "x... .... x... ....", S: "x.xx x.xx x.xx x.xx", CR: "x... .... .... ....", TB: OFF,
  }, { S: "xxxx xxxx xxxx XXXX" }, {}, { world: true }),
  N("nola-funeral-cadence", "Funeral Dirge Cadence", NOLA, 64, 0, "jazz", {
    K2: "x... .... x... ....", S2: "..x. ..x. ..x. ..x.", B: "x... .... .... ....",
  }, { S2: "..x. ..x. xxxx xxxx" }, {}, { world: true }),
  N("nola-meters-funk", "Meters-Style Funk", NOLA, 100, 18, "rusty", {
    K: "x..x ..x. ..x. x...", S: BB, S2: "..x. .x.. ..x. ...x", H: "x.xx x.xx x.xx x.xx",
  }, FS, {}, { world: true }),

  // ---------------------------------------------------------------- Ska & Rocksteady (5)
  N("ska-two-tone", "Two-Tone Ska", SKA, 168, 0, "rusty", {
    K: QTR, S: BB, O: OFF, H: "x... x... x... x...",
  }, FS),
  N("ska-first-wave", "First-Wave Ska", SKA, 150, 0, "jazz", {
    K: "x... .... x... ....", SB: BB, TB: OFF, RD: "x.x. x.x. x.x. x.x.",
  }, { SB: ".... x... x.x. xxxx" }),
  N("ska-rocksteady", "Rocksteady", SKA, 76, 0, "jazz", {
    K: "x... ..x. x... ....", SS: "...x ..x. ...x ..x.", H: Q8, TB: OFF,
  }, FT2),
  N("ska-punk-rush", "Ska-Punk Rush", SKA, 188, 0, "unruly", {
    K: "x.x. x.x. x.x. x.x.", S: OFF, H: Q8, CR: "x... .... .... ....",
  }, FS),
  N("ska-third-wave", "Third-Wave Stomp", SKA, 176, 0, "unruly", {
    K: "x... x... x.x. x...", C: BB, TB: OFF, O: ".... .... .... ..x.",
  }, FC),

  // ------------------------------------------------------------- Reggae & Dub (+4)
  N("reggae-rockers-drive", "Rockers Drive", "Reggae & Dub", 96, 0, "rusty", {
    K: QTR, SS: BB, H: OFF16, O: ".... .... .... ..x.",
  }, FT2),
  N("reggae-lovers-sway", "Lovers Rock Sway", "Reggae & Dub", 70, 14, "jazz", {
    K: ".... .... x... ....", SS: "x... ..x. x... ..x.", H: "x.xx x.xx x.xx x.xx", TB: OFF,
  }),
  N("reggae-dub-echo", "Dub Echo Drop", "Reggae & Dub", 72, 0, "unruly", {
    K: ".... .... x... ....", R: ".... .... x... ....", H: Q8, O: ".... ..x. .... ....",
  }, FT2, { R: { delay: 0.4, reverb: 0.2 }, O: { delay: 0.3 } }),
  N("reggae-steppers-skank", "Steppers Skank", "Reggae & Dub", 140, 0, "rusty", {
    K: QTR, SS: HLF, H: OFF, TB: Q8,
  }, FS),

  // ------------------------------------------------------------------------ Celtic (5)
  N("celtic-reel-bodhran", "Reel Bodhrán", "Celtic", 112, 0, "swirly", {
    FD: "X.xx x.x. X.xx x.xx", K2: "x... .... x... ....",
  }, { FD: "x.xx x.xx x.xx xxxx" }, {}, { world: true }),
  N("celtic-hornpipe", "Hornpipe Lilt", "Celtic", 100, 30, "swirly", {
    FD: "X.x. x.x. X.x. x.x.", K2: "x... .... x... ....", R: TWO_FOUR,
  }, { FD: "X.x. x.x. x.xx xxxx" }, {}, { world: true }),
  N("celtic-march", "Pipe-Band March", "Celtic", 96, 0, "rusty", {
    S: "x.xx x.xx x.xx x.xx", K2: "x... .... x... ....", FD: "x... x.x. x... x.xx",
  }, { S: "xxxx xxxx xxxx XXXX" }, {}, { world: true }),
  N("celtic-slow-air", "Slow Air Pulse", "Celtic", 60, 0, "swirly", {
    FD: "x... .... x... ....", SH: TWO_FOUR, K2: ".... .... x... ....",
  }, FT2, {}, { world: true }),
  N("celtic-folk-rock", "Celtic Folk-Rock", "Celtic", 132, 0, "rusty", {
    K: "x... ..x. x... ....", S: BB, FD: "x.x. x.xx x.x. x.xx", TB: OFF,
  }, FS, {}, { world: true }),

  // ------------------------------------------------------------ Folk & Marching (+6)
  N("folk-campfire-stomp", "Campfire Stomp", "Folk & Marching", 96, 0, "rusty", {
    K2: QTR, C: BB, TB: OFF,
  }, FC),
  N("folk-parade-cadence", "Parade Cadence", "Folk & Marching", 116, 0, "concert", {
    S: "Xxx. Xxx. Xxx. Xx.x", K2: "x... .... x... x...", CR: "x... .... .... ....",
  }, { S: "xxxx xxxx xxxx XXXX" }),
  N("folk-processional", "Processional", "Folk & Marching", 72, 0, "concert", {
    K2: "x... .... .... ....", FD: ".... x... .... x...", GO: "x... .... .... ....",
  }, FT2),
  N("folk-polka", "Folk Polka", "Folk & Marching", 132, 0, "swirly", {
    K: QTR, S: TWO_FOUR, TB: Q8,
  }, FS, {}, { world: true }),
  N("folk-skiffle", "Skiffle Washboard (♩=128)", "Folk & Marching", 64, 33, "rusty", {
    SB: "XxXx XxXx XxXx XxXx", K2: QTR, WB: TWO_FOUR,
  }, { SB: "XxXx XxXx xxxx xxxx" }, {}, { felt: 128 }),
  N("folk-drum-circle", "Drum Circle", "Folk & Marching", 90, 0, "swirly", {
    DJ: "x.xx .x.. x.xx .x..", CG: "..x. x... ..x. x...", FD: "x... .... x... ....", SH: "x.xx x.xx x.xx x.xx",
  }, { DJ: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
];

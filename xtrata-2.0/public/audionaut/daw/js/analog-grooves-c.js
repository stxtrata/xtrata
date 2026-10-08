// Analog Kit grooves, batch C: Disco, Breakbeat, Dancehall & Reggaeton, Afrobeat & African, Latin,
// Brazilian, Middle Eastern, Indian, East Asian & Pacific (28 grooves). The world rhythms are
// written as respectful sketches of each tradition's core pattern, played on the kit's hand drums,
// bells and shakers, for sketching ideas rather than as definitive transcriptions.
import { N, Q8, OFF, QTR, BB, HLF, A16, OFF16, FS, FT, FT2, FC } from "./analog-groove-helpers.js";

const AFRO = "Afrobeat & African";
const DANCEHALL = "Dancehall & Reggaeton";
const EAST = "East Asian & Pacific";
const DEMBOW = "...x ..x. ...x ..x."; // 3+3+2 snare/clap accent

export const GROOVES_C = [
  // ------------------------------------------------------------------------ Disco (+3)
  N("disco-hustle", "Hustle Disco", "Disco", 124, 0, "modern", {
    K: QTR, C: BB, H: "x.xx x.xx x.xx x.xx", O: OFF, TB: Q8,
  }, FC),
  N("disco-chic-sixteenths", "Chic Sixteenths", "Disco", 114, 0, "rusty", {
    K: QTR, S: BB, S2: ".x.. ...x .x.. ..x.", H: A16, O: OFF,
  }, FS),
  N("disco-hi-nrg", "Hi-NRG Pulse", "Disco", 134, 0, "modern", {
    K: QTR, S: BB, H: OFF, TB: "xxxx xxxx xxxx xxxx",
  }, FS),

  // -------------------------------------------------------------------- Breakbeat (+3)
  N("breaks-classic-chop", "Classic Break Chop", "Breakbeat", 132, 0, "unruly", {
    K: "x.x. ..xx .... x...", S: ".... x..x .x.. x...", H: Q8, O: ".... .... ..x. ....",
  }, FS),
  N("breaks-ghost-note", "Ghost-Note Break", "Breakbeat", 104, 8, "rusty", {
    K: "x.x. ..x. .xx. ..x.", S: ".... x..x .x.x x...", H: A16,
  }, FS),
  N("breaks-skank", "Skank Breaks", "Breakbeat", 124, 0, "unruly", {
    K: "x... ..x. ..x. ....", C: BB, O: OFF, H: Q8,
  }, FC),

  // --------------------------------------------------------- Dancehall & Reggaeton (+3)
  N("reggaeton-classic-boom", "Boom-Ch-Boom-Chick", DANCEHALL, 94, 0, "modern", {
    K: QTR, S: DEMBOW, H: Q8, CS: "...x ..x. ...x ..x.",
  }, FC, {}, { world: true }),
  N("dancehall-bashment-pulse", "Bashment Pulse", DANCEHALL, 104, 0, "unruly", {
    K: "x..x ..x. ..x. ....", RS: BB, TB: OFF, SH: Q8,
  }, FS, {}, { world: true }),
  N("dancehall-perreo-trap", "Perreo Trap Swing", DANCEHALL, 90, 6, "modern", {
    K: "x... ..x. ..x. ....", C: DEMBOW, H: "x.xx x.xx x.xx x.xx", SH: OFF16,
  }, FC, {}, { world: true }),

  // --------------------------------------------------------------- Afrobeat & African (+4)
  N("afro-fela-drive", "Fela Drive", AFRO, 112, 8, "swirly", {
    K: "x..x ..x. x... ..x.", S: BB, S2: ".x.. ...x .x.. ....", SH: A16, CG: "..x. x... ..x. x...", BD: "x.x. x.x. x..x ..x.",
  }, { CG: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
  N("afro-talking-drum", "Talking Drum Fuji", AFRO, 118, 0, "swirly", {
    DJ: "x.xx .x.x x.xx .x.x", K2: "x... .... x... ....", B: "x.x. x.x. x.x. x.x.", SH: Q8,
  }, { DJ: "x.x. xxxx x.x. xxxx" }, {}, { world: true }),
  N("afro-juju-swing", "Juju Swing", AFRO, 108, 12, "swirly", {
    K2: QTR, R: "x..x ..x. ..x. x...", CP: BB, SH: A16, TR: "x.xx x.xx x.xx x.xx",
  }, FT2, {}, { world: true }),
  N("afrobeats-lagos-pop", "Afrobeats Lagos Pop", AFRO, 100, 0, "modern", {
    K: "x... ..x. ..x. ....", C: DEMBOW, H: Q8, SH: OFF16, CS: ".x.. ...x .x.. ....",
  }, FC, {}, { world: true }),

  // ----------------------------------------------------------------------- Latin (+4)
  N("latin-rumba-guaguanco", "Guaguancó", "Latin", 108, 0, "swirly", {
    R: "x..x ...x ..x. x...", CG: "..xx ..x. ..xx ..x.", QU: "x... ..x. x... ..x.", SH: Q8,
  }, { QU: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
  N("latin-mambo-bell", "Mambo Bell", "Latin", 112, 0, "swirly", {
    B: "x.x. x.x. x.x. x.x.", CV: "x..x ..x. ..x. x...", K2: "...x .... ...x ....", BH: "x.xx x.xx x.xx x.xx",
  }, { BH: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
  N("latin-salsa-cascara", "Salsa Cascara", "Latin", 98, 0, "swirly", {
    WB: "x.xx .x.x x.xx .x.x", CG: "..x. x.x. ..x. x.x.", K2: "...x .... ...x ....", B2: QTR, SH: Q8,
  }, { CG: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
  N("latin-bolero", "Bolero Heartbeat", "Latin", 72, 0, "swirly", {
    BH: "x.xx x.xx x.xx x.xx", SH: Q8, K2: "x... .... x... ....", CV: "x..x ..x. .... ....",
  }, FT2, {}, { world: true }),

  // -------------------------------------------------------------------- Brazilian (+4)
  N("brazil-pagode", "Pagode Roda", "Brazilian", 96, 0, "swirly", {
    K2: ".... x... .... x...", TB: "x.xx x.xx x.xx x.xx", R: "x.x. .x.x x.x. .x.x", FD: "x... ..x. x... ..x.",
  }, { TB: "xxxx xxxx xxxx xxxx" }, {}, { world: true }),
  N("brazil-samba-reggae", "Samba-Reggae", "Brazilian", 100, 0, "swirly", {
    K2: "x... .x.. x... .x..", S2: "..x. x.x. ..x. x.x.", CS: ".... x... .... x...", SH: A16,
  }, { S2: "..x. xxxx ..x. xxxx" }, {}, { world: true }),
  N("brazil-forro", "Forró Zabumba", "Brazilian", 128, 0, "swirly", {
    K2: "x..x ..x. x..x ..x.", S2: ".... x... .... x...", TR: "x.xx x.xx x.xx x.xx", SH: Q8,
  }, FT2, {}, { world: true }),
  N("brazil-afoxe", "Afoxé Candomblé", "Brazilian", 90, 0, "swirly", {
    FD: "x... ..x. x... ..x.", B: "x.x. xx.. x.x. xx..", B2: "..x. ..x. ..x. ..x.", SH: A16,
  }, { FD: "x.x. xxxx x.x. xxxx" }, {}, { world: true }),

  // ------------------------------------------------------------------ Middle Eastern (+3)
  N("me-ayyoub", "Ayyoub Pulse", "Middle Eastern", 112, 0, "swirly", {
    DB: "x..x ..x. x..x ..x.", K2: "x... .... x... ....", SH: Q8,
  }, { DB: "x..x ..x. xxxx xxxx" }, {}, { world: true }),
  N("me-malfuf", "Malfuf Run", "Middle Eastern", 128, 0, "swirly", {
    DB: "x.x. ..x. x.x. ..x.", K2: "x... .... x... ....", TB: "x.xx x.xx x.xx x.xx",
  }, { DB: "x.x. ..x. xxxx xxxx" }, {}, { world: true }),
  N("me-wahda-slow", "Wahda Slow Pulse", "Middle Eastern", 70, 0, "swirly", {
    DB: "x... ..x. ..x. ....", K2: "x... .... .... ....", FD: ".... .... x... ....", SH: Q8,
  }, FT2, {}, { world: true }),

  // ----------------------------------------------------------------------- Indian (+2)
  N("india-garba-dandiya", "Garba Dandiya", "Indian", 130, 0, "swirly", {
    DJ: "x.x. x.x. x.x. x.x.", R: "..x. ..x. ..x. ..x.", B2: Q8, K2: "x... .... x... ....",
  }, { DJ: "x.x. xxxx x.x. xxxx" }, {}, { world: true }),
  N("india-dadra-lilt", "Dadra Lilt", "Indian", 90, 0, "swirly", {
    T1: "x... .x.. x... ....", T3: "..x. x.x. ..x. x.x.", B2: "x... .... x... ....", SH: Q8,
  }, FT2, {}, { world: true }),

  // ------------------------------------------------------------- East Asian & Pacific (+2)
  N("taiko-miyake-rolls", "Miyake Taiko Rolls", EAST, 126, 0, "concert", {
    F1: "X... ..x. x... ..x.", T2: ".... x.x. .... x.x.", B2: QTR,
  }, { T2: "x.x. xxxx x.x. xxxx" }, {}, { world: true }),
  N("korea-jangu-pulse", "Jangu Pulse", EAST, 96, 0, "swirly", {
    FD: "x... ..x. x... ..x.", T3: ".x.. x.x. .x.. x.x.", B: "x... .... x... ....", TK: Q8,
  }, FT2, {}, { world: true }),
];

// Analog Kit grooves, batch D: Punk, Metal, Indie & Post-Punk, Orchestral & Cinematic,
// Krautrock & Post-Rock, Live Electronic (41 grooves).
import { N, Q8, OFF, QTR, BB, HLF, A16, OFF16, FS, FT, FT2, FC } from "./analog-groove-helpers.js";

const ORCH = "Orchestral & Cinematic";
const KRAUT = "Krautrock & Post-Rock";
const LIVE = "Live Electronic";
const INDIE = "Indie & Post-Punk";

export const GROOVES_D = [
  // ------------------------------------------------------------------------ Punk (+5)
  N("punk-street", "Street Punk", "Punk", 164, 0, "rusty", {
    K: "x... ..x. x... ..x.", S: BB, H: Q8, CR: "x... .... .... ....",
  }, FS),
  N("punk-pop-drive", "Pop-Punk Drive", "Punk", 176, 0, "rusty", {
    K: "x... x... x.x. x...", S: BB, O: Q8,
  }, FS),
  N("punk-oi-stomp", "Oi! Stomp", "Punk", 145, 0, "unruly", {
    K2: QTR, S: BB, TB: Q8,
  }, FS),
  N("punk-crust-d-beat", "Crust D-Beat", "Punk", 188, 0, "unruly", {
    K: "x.xx ..x. x.xx ..x.", S: BB, H: Q8,
  }, FS),
  N("punk-garage-pogo", "Garage Pogo", "Punk", 154, 0, "unruly", {
    K: "x.x. x.x. x.x. x.x.", S: OFF, CR: "x... .... .... ....",
  }, FS),

  // ----------------------------------------------------------------------- Metal (+5)
  N("metal-heavy-gallop", "Heavy Metal Gallop", "Metal", 140, 0, "rusty", {
    K: "x.xx x.xx x.xx x.xx", S: BB, RD: Q8, CR: "x... .... .... ....",
  }, FT),
  N("metal-doom-crawl", "Doom Crawl", "Metal", 58, 0, "rusty", {
    K: "x... .... x... ....", S: ".... .... x... ....", CH: "x... .... .... ....", RD: "x... .... x... ....",
  }, FT2),
  N("metal-groove", "Groove Metal Chug", "Metal", 96, 0, "modern", {
    K: "x..x ..x. ..x. x...", S: BB, H: Q8, CH: "x... .... .... ....",
  }, FT),
  N("metal-power-double-bass", "Power Metal Double Bass", "Metal", 168, 0, "modern", {
    K: "xxxx xxxx xxxx xxxx", S: BB, RD: Q8, CR: "x... .... .... ....",
  }, FT),
  N("metal-black-blast", "Black Metal Blast", "Metal", 196, 0, "rusty", {
    K: "x.x. x.x. x.x. x.x.", S: ".x.x .x.x .x.x .x.x", CR: "x... .... .... ....", RD: Q8,
  }, FS),

  // ------------------------------------------------------- Indie & Post-Punk (+6)
  N("indie-britpop-stomp", "Britpop Stomp", INDIE, 118, 0, "rusty", {
    K: "x... ..x. x... ....", S: BB, H: Q8, TB: OFF,
  }, FS),
  N("indie-disco-hats", "Indie Disco Hats", INDIE, 128, 0, "unruly", {
    K: QTR, S: BB, H: "x.xx x.xx x.xx x.xx", O: OFF,
  }, FC),
  N("indie-jangle-pop", "Jangle Pop", INDIE, 148, 0, "rusty", {
    K: "x... ..x. x... ..x.", S: BB, TB: Q8, RD: "x... .... x... ....",
  }, FS),
  N("indie-shoegaze-wash", "Shoegaze Wash", INDIE, 92, 0, "unruly", {
    K: "x... .... x.x. ....", S: HLF, RD: Q8, CR: "x... .... x... ....",
  }, FT2),
  N("indie-dream-sway", "Dream-Pop Sway", INDIE, 76, 0, "unruly", {
    K: "x... .... x... ..x.", SS: HLF, TB: Q8, SH: OFF16,
  }, FT2),
  N("indie-post-punk-drive", "Post-Punk Bass Drive", INDIE, 152, 0, "rusty", {
    K: "x... x... x.x. x...", S: BB, T2: ".... .x.. .... .x..", H: Q8,
  }, FT),

  // ------------------------------------------------------------ Orchestral & Cinematic (8)
  N("orch-cinematic-pulse", "Cinematic Pulse", ORCH, 100, 0, "concert", {
    F1: "x.xx x.xx x.xx x.xx", CR: "x... .... .... ....", TR: "..x. ..x. ..x. ..x.",
  }, { F1: "xxxx xxxx xxxx XXXX" }),
  N("orch-trailer-hits", "Trailer Hits", ORCH, 80, 0, "concert", {
    F1: "X... .... X... ....", GO: "X... .... .... ....", CC: ".... .... X... ....", F2: ".... ..x. .... ..x.",
  }, { F1: "x.x. x.x. xxxx XXXX" }),
  N("orch-heroic-march", "Heroic March", ORCH, 110, 0, "concert", {
    S: "x.xx x.xx x.xx x.xx", F1: "x... .... x... ....", CR: "x... .... x... ....",
  }, { S: "xxxx xxxx xxxx XXXX" }),
  N("orch-suspense-ticks", "Suspense Ticks", ORCH, 90, 0, "concert", {
    TK: Q8, TR: "x... .... .... ....", F1: "x... .... .... ....", SC: ".... .... x... ....",
  }, { TK: "x.x. x.x. xxxx xxxx" }),
  N("orch-timpani-gallop", "Timpani Gallop", ORCH, 130, 0, "concert", {
    F1: "x.xx x.xx x.xx x.xx", F2: ".... ..x. .... ..x.", S: ".... x... .... x...", CC: "x... .... .... ....",
  }, { F1: "xxxx xxxx xxxx XXXX" }),
  N("orch-epic-slow-build", "Epic Slow Build", ORCH, 60, 0, "concert", {
    F1: "x... .... x... ....", GO: "x... .... .... ....", SC: ".... .... x... ....", S2: ".... .... .... x.x.",
  }, { S2: "x.x. x.x. xxxx xxxx" }),
  N("orch-battle-charge", "Battle Charge", ORCH, 150, 0, "concert", {
    S: "Xxxx Xxxx Xxxx Xxxx", F1: "x... x... x... x...", CR: "x... .... x... ....",
  }, { S: "xxxx xxxx xxxx XXXX" }),
  N("orch-fanfare-cadence", "Fanfare Cadence", ORCH, 120, 0, "concert", {
    S: "x... x.xx x... x.xx", F1: "x... .... x... ....", B: "x... .... .... ....", CC: "x... .... .... ....",
  }, { S: "x... x.xx xxxx XXXX" }),

  // ----------------------------------------------------------- Krautrock & Post-Rock (5)
  N("kraut-motorik-classic", "Motorik Classic", KRAUT, 140, 0, "rusty", {
    K: "x... x... x... x...", S: BB, H: Q8, O: ".... .... .... ..x.",
  }, FS),
  N("kraut-motorik-hat-drive", "Motorik Hat Drive", KRAUT, 132, 0, "unruly", {
    K: "x... x... x... x...", S: BB, H: A16, O: OFF,
  }, FS),
  N("post-rock-swell", "Post-Rock Swell", KRAUT, 84, 0, "unruly", {
    K: "x... .... x... ....", S: HLF, T2: ".x.. .... .x.. ....", F1: ".... ..x. .... ..x.", RD: "x... .... .... ....", CR: ".... .... .... x...",
  }, { F1: "x.x. x.x. xxxx XXXX" }),
  N("kraut-kosmische-pulse", "Kosmische Pulse", KRAUT, 112, 0, "unruly", {
    K: QTR, TB: Q8, SH: OFF16, R: ".... .... x... ....",
  }, FT2),
  N("kraut-math-lurch", "Math-Rock Lurch", KRAUT, 150, 0, "rusty", {
    K: "x..x ..x. ...x ..x.", S: ".... x... .x.. ..x.", H: Q8, CR: "x... .... .... ....",
  }, FT),

  // ------------------------------------------------------------------ Live Electronic (12)
  N("live-trip-hop", "Live Trip-Hop", LIVE, 82, 20, "unruly", {
    K: "x... ..x. .x.. ....", S: HLF, H: "x.x. x.x. x.x. x.xx", O: ".... .... ..x. ....",
  }, FC),
  N("live-dub-techno", "Live Dub Techno", LIVE, 118, 0, "modern", {
    K: QTR, RS: ".... .... ..x. ....", H: OFF, SH: OFF16,
  }, FT2, { RS: { delay: 0.4, reverb: 0.2 } }),
  N("live-synthwave", "Live Synthwave", LIVE, 100, 0, "modern", {
    K: "x... x... x... x...", S: BB, H: Q8, T1: ".... .... .... ....",
  }, FT),
  N("live-house", "Live House", LIVE, 122, 0, "modern", {
    K: QTR, C: BB, O: OFF, H: Q8,
  }, FC),
  N("live-electro-pop", "Live Electro-Pop", LIVE, 110, 0, "modern", {
    K: QTR, C: BB, TB: Q8, H: OFF16,
  }, FC),
  N("live-breakbeat", "Live Breakbeat", LIVE, 128, 0, "unruly", {
    K: "x... ..x. ..x. x...", S: BB, S2: "...x .... .x.. ...x", H: Q8,
  }, FS),
  N("live-techno", "Live Techno", LIVE, 134, 0, "unruly", {
    K: QTR, O: OFF, RS: "..x. ...x ..x. .x..", H: A16,
  }, FS),
  N("live-two-step", "Live 2-Step", LIVE, 134, 24, "modern", {
    K: "x... .... ..x. ....", S: BB, H: "x.xx x.xx x.xx x.xx", SH: OFF16,
  }, FS),
  N("live-halftime-dnb", "Live Half-Time DnB", LIVE, 87, 0, "unruly", {
    K: "x... .... ..x. ....", S: HLF, H: A16, O: ".... .... .... ..x.",
  }, FS),
  N("live-dnb", "Live Drum & Bass", LIVE, 172, 0, "unruly", {
    K: "x... ..x. .... ....", S: BB, H: Q8, S2: "...x .... ...x ..x.",
  }, FS),
  N("live-dubstep", "Live Dubstep Half-Step", LIVE, 140, 0, "unruly", {
    K: "x... .... .... ....", C: HLF, S: HLF, H: "x.x. x.x. x.x. x.xx", O: ".... .... ...x ....",
  }, FC),
  N("live-footwork", "Live Footwork", LIVE, 160, 0, "unruly", {
    K: "x..x ..x. x..x ..x.", C: ".x.. .x.. .x.. ....", H: Q8, T3: ".... ..x. .... ..x.",
  }, FT2),
];

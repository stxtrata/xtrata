// Additional drum-only grooves (drum kits, not tonal) that fill out each genre so every
// style has several useful beats, not just one. Patterns are 16-step bars (or 32 for two
// bars); bar 4 can carry a fill. See percussion-recipes.js for the role vocabulary.
//
// Beats flagged tonal:true include an 808 bass hit because it is part of the style
// (trap, Miami bass, dub); they are tagged "with bass" and are never the first in a genre.
import { R, all16, eighths, four, backbeat, euclid } from "./percussion-recipes.js";

// Kit names are voiced in percussion-kits.js.
const G = (id, name, genre, bpm, swing, kit, v, fill = {}, fx = {}, extra = {}) =>
  Object.assign(R(id, name, genre, bpm, swing, kit, false, v, fill, fx), extra);

const OFFBEAT = "..x...x...x...x.";
const SIXTEENTHS_ACCENT = "XxxxXxxxXxxxXxxx";
// Reusable bar-4 fills
const F_SNARE = { S: "....x...x.x.xxxx" };
const F_TOMS = { T3: "............x...", T2: "..............x.", T1: "...............x" };
const F_TOMS_DOWN = { T3: "..........x.....", T2: "...........x....", T1: "............x...", F1: "..............x.", F2: "...............x" };

export const GROOVES = [
  // ------------------------------------------------------------------- Rock
  G("rock-basic", "Basic Rock", "Rock", 100, 0, "rock", {
    K: "x.......x.x.....", S: backbeat, H: eighths, CR: "x...............",
  }, { S: "....x...x.x.x.x.", ...F_TOMS_DOWN }),
  G("rock-driving-8ths", "Driving 8ths", "Rock", 124, 0, "rock", {
    K: four, S: backbeat, H: eighths, CR: "x...............",
  }, F_SNARE),
  G("rock-half-time", "Half-Time Rock", "Rock", 80, 0, "rock", {
    K: "x.......x.......", S: "........x.......", H: eighths, CR: "x...............",
  }, { ...F_TOMS_DOWN, S: "........x.......", K: "x...............", }),
  G("rock-16th-hats", "16th-Hat Rock", "Rock", 96, 0, "rock", {
    K: "x..x..x...x.....", S: backbeat, H: SIXTEENTHS_ACCENT,
  }, F_SNARE),
  G("rock-ride-crash", "Ride & Crash Rock", "Rock", 110, 0, "rock", {
    K: "x.....x.x.......", S: backbeat, RD: eighths, CR: "x...............",
  }, { ...F_TOMS_DOWN }),

  // -------------------------------------------------------------------- Pop
  G("pop-four-square", "Four-Square Pop", "Pop", 108, 0, "pop", {
    K: "x.......x.......", S: backbeat, H: eighths, TB: OFFBEAT,
  }, F_SNARE),
  G("pop-clap-backbeat", "Clap Backbeat", "Pop", 100, 0, "pop", {
    K: "x.....x.x.......", C: backbeat, H: eighths, SH: ".x.x.x.x.x.x.x.x",
  }),
  G("pop-dance", "Dance Pop", "Pop", 120, 0, "pop", {
    K: four, C: backbeat, O: OFFBEAT, HT: ".x.x.x.x.x.x.x.x",
  }),
  G("pop-ballad", "Pop Ballad", "Pop", 70, 0, "pop", {
    K: "x.....x.........", SS: "........x.......", H: "x...x...x...x...", TB: "....x.......x...",
  }, { SS: "........x...x.x.", ...F_TOMS }),

  // ------------------------------------------------------------------- Funk
  G("funk-ghost-notes", "Ghost-Note Funk", "Funk", 104, 0, "funk", {
    K: "x..x..x...x.x...", S: backbeat, S2: ".x....x.x..x...x", H: SIXTEENTHS_ACCENT,
  }, F_SNARE),
  G("funk-sixteenth-hats", "16th-Hat Funk", "Funk", 100, 0, "funk", {
    K: "x..x...x..x.....", S: backbeat, H: SIXTEENTHS_ACCENT, O: "......x.......x.",
  }),
  G("funk-go-go", "Go-Go Pocket", "Funk", 100, 10, "funk", {
    K: "x..x....x.x.....", S: backbeat, T2: "..x...x...x...x.", B: "x.....x.x.......", H: eighths,
  }, { T2: "..x...x.x.x.x.xx" }),
  G("funk-half-time-shuffle", "Half-Time Funk Shuffle", "Funk", 96, 40, "funk", {
    K: "x.......x....x..", S: "........x.......", S2: "......x.......x.", H: eighths,
  }, F_SNARE),

  // ---------------------------------------------------------------- Hip-Hop
  G("boom-bap-swing", "Boom Bap Swing", "Hip-Hop", 88, 24, "hiphop", {
    K: "x....x..x.x.....", S: backbeat, H: eighths, HT: "...x.......x....",
  }, F_SNARE),
  G("dusty-break", "Dusty Break", "Hip-Hop", 92, 10, "hiphop", {
    K: "x.x.....x..x....", S: backbeat, S2: "...x.....x......", H: "x.x.x.x.x.x.x.xx",
  }),
  G("west-coast-bounce", "West Coast Bounce", "Hip-Hop", 94, 0, "hiphop", {
    K: "x..x....x.x.....", C: backbeat, H: eighths, SH: ".x.x.x.x.x.x.x.x",
  }),
  G("east-coast-hardcore", "East Coast Hardcore", "Hip-Hop", 96, 6, "hiphop", {
    K: "x.x...x.x.x.....", S: backbeat, H: eighths, HP: "....x.......x...",
  }, F_SNARE),

  // ----------------------------------------------------------------- Lo-Fi
  G("lofi-shuffle", "Lo-Fi Shuffle", "Lo-Fi", 80, 40, "lofi", {
    K: "x.....x...x.....", SS: backbeat, H: eighths,
  }),
  G("lofi-dusty-rim", "Dusty Rim", "Lo-Fi", 72, 30, "lofi", {
    K: "x.......x.x.....", SS: backbeat, HT: ".x.x.x.x.x.x.x.x", H: "x...x...x...x...",
  }),
  G("chillhop-tap", "Chillhop Tap", "Lo-Fi", 84, 20, "lofi", {
    K: "x..x....x.....x.", S: backbeat, H: eighths, SH: OFFBEAT,
  }, F_SNARE),

  // ------------------------------------------------------------------ House
  G("tech-house-percs", "Tech House Percs", "House", 126, 0, "house", {
    K: four, C: backbeat, R: "..x..x..x..x..x.", SH: ".x.x.x.x.x.x.x.x", O: OFFBEAT, T2: "......x.......x.",
  }),
  G("jackin-house", "Jackin' House", "House", 124, 0, "house", {
    K: four, S: backbeat, C: backbeat, H: "x.xxx.xxx.xxx.xx",
  }, F_SNARE),
  G("chicago-house", "Chicago House", "House", 122, 0, "house", {
    K: four, C: backbeat, H: SIXTEENTHS_ACCENT, O: OFFBEAT,
  }),
  G("afro-house-drive", "Afro House Drive", "House", 122, 0, "house", {
    K: four, TB: eighths, T1: "...x..x...x..x..", SH: ".x.x.x.x.x.x.x.x", R: "..x...x...x...x.",
  }, { T1: "...x..x...x.xxxx" }),

  // ----------------------------------------------------------------- Techno
  G("hard-techno-16ths", "Hard Techno", "Techno", 140, 0, "techno", {
    K: four, H: all16, O: OFFBEAT, C: backbeat,
  }),
  G("peak-time-techno", "Peak-Time Techno", "Techno", 132, 0, "techno", {
    K: four, O: OFFBEAT, C: backbeat, R: "..x...x...x...x.", H: ".x.x.x.x.x.x.x.x",
  }, { C: "....x...x.x.xxxx" }),

  // ----------------------------------------------------------------- Disco
  G("philly-disco", "Philly Disco", "Disco", 116, 0, "disco", {
    K: four, S: backbeat, H: all16, O: "......x.......x.",
  }),
  G("italo-disco", "Italo Disco", "Disco", 122, 0, "disco", {
    K: four, C: backbeat, H: eighths, B: "..x.....x.......",
  }, F_TOMS),
  G("disco-funk-bounce", "Disco Funk Bounce", "Disco", 112, 0, "disco", {
    K: "x..x..x..x.x....", S: backbeat, O: OFFBEAT, H: SIXTEENTHS_ACCENT,
  }),

  // ---------------------------------------------------------------- Electro
  G("electro-funk", "Electro Funk", "Electro", 114, 0, "electro", {
    K: "x..x..x...x..x..", S: backbeat, H: eighths, B: "..x.....x.......",
  }),
  G("robot-electro", "Robot Electro", "Electro", 112, 0, "electro", {
    K: "x.......x.......", S: backbeat, H: all16, T3: "............x.x.",
  }, { T3: "..........x.x.x.", T2: "...........x.x.x" }),
  G("miami-bass-808", "Miami Bass (with 808 bass)", "Electro", 130, 0, "electro", {
    K: "x..x..x...x..x..", C: backbeat, B: "..x...x...x...x.", BA: "x..x..x...x..x..",
  }, {}, {}, { tonal: true }),

  // ------------------------------------------------------------ Trap & Drill
  G("trap-hat-rolls", "Trap Hat Rolls", "Trap & Drill", 140, 0, "trap", {
    K: "x.........x.....", C: "........x.......", S: "........x.......", H: "x.x.x.x.x.xxxxxx", HT: "..x...x.x...x...",
  }, { H: all16 }),
  G("trap-808-bass", "Trap (with 808 bass)", "Trap & Drill", 140, 0, "trap", {
    K: "x.........x.....", S: "........x.......", H: "x.x.x.xxx.x.x.xx", BA: "x.........x.....",
  }, {}, {}, { tonal: true }),

  // ------------------------------------------------------------- UK Garage
  G("speed-garage", "Speed Garage", "UK Garage", 130, 10, "garage", {
    K: "x.....x...x.....", S: backbeat, H: all16, O: OFFBEAT,
  }),

  // ------------------------------------------------------------ Drum & Bass
  G("liquid-roller", "Liquid Roller", "Drum & Bass", 172, 0, "dnb", {
    K: "x.........x.....", S: backbeat, H: eighths, O: "..x.......x.....",
  }, F_SNARE),
  G("neurofunk-stomp", "Neurofunk Stomp", "Drum & Bass", 174, 0, "dnb", {
    K: "x.....x...x.....", S: backbeat, H: SIXTEENTHS_ACCENT,
  }),

  // ----------------------------------------------------------------- Jungle
  G("ragga-jungle", "Ragga Jungle", "Jungle", 165, 0, "jungle", {
    K: "x.x.......x.....", S: "....x.......x..x", H: eighths, T3: "..............x.",
  }),
  G("jungle-tom-roll", "Jungle Tom Roll", "Jungle", 168, 0, "jungle", {
    K: "x.......x.......", S: backbeat, H: eighths,
  }, F_TOMS_DOWN),
  G("amen-style-break", "Amen-Style Break", "Jungle", 160, 0, "jungle", {
    K: "x.x.......xx....", S: backbeat, S2: ".......x.x.....x", RD: eighths,
  }),

  // -------------------------------------------------------------- Breakbeat
  G("big-beat", "Big Beat", "Breakbeat", 128, 0, "breaks", {
    K: "x..x..x...x.....", S: backbeat, C: backbeat, H: eighths, CR: "x...............",
  }, F_SNARE),
  G("breakbeat-funk", "Breakbeat Funk", "Breakbeat", 118, 0, "breaks", {
    K: "x.x......xx.....", S: backbeat, S2: ".......x.x.....x", H: eighths,
  }),
  G("nu-skool-breaks", "Nu-Skool Breaks", "Breakbeat", 135, 0, "breaks", {
    K: "x...x.....x.....", C: backbeat, H: "x.x.x.x.x.x.x.x.", O: "..............x.",
  }),

  // ---------------------------------------------------------------- Dubstep
  G("brostep-stomp", "Brostep Stomp", "Dubstep", 140, 0, "dubstep", {
    K: "x.........x.....", S: "........x.......", C: "........x.......", H: eighths,
  }, { S: "........x.x.x.xx" }),
  G("deep-dubstep", "Deep Dubstep", "Dubstep", 140, 0, "dubstep", {
    K: "x.......x.......", SS: "........x.......", O: "......x.......x.", HT: "..x...x...x...x.",
  }, {}, { SS: { reverb: 0.3 } }),
  G("wonky-halftime", "Wonky Half-Time", "Dubstep", 140, 0, "dubstep", {
    K: "x..x......x.....", S: "........x.......", H: eighths, T2: "..........x.....",
  }),

  // --------------------------------------------------------- Reggae & Dub
  G("reggae-rockers", "Rockers", "Reggae & Dub", 80, 14, "reggae", {
    K: four, SS: "........x.......", H: eighths, TB: OFFBEAT,
  }),
  G("dub-bass-drop", "Dub Drop (with bass)", "Reggae & Dub", 76, 14, "reggae", {
    K: "........x.......", SS: "........x.......", H: eighths, BA: "x.......x.......",
  }, {}, { SS: { delay: 0.35 } }, { tonal: true }),

  // ------------------------------------------------------ Dancehall
  G("reggaeton-perreo", "Reggaeton Perreo", "Dancehall & Reggaeton", 96, 0, "dancehall", {
    K: four, C: "...x..x.x..x..x.", H: eighths, SH: ".x.x.x.x.x.x.x.x",
  }),

  // ------------------------------------------------------------------ Jazz
  G("jazz-brushes-ballad", "Brushes Ballad", "Jazz", 70, 55, "jazz", {
    K: "x...............", S2: backbeat, HP: backbeat, RD: "x..x..x..x..x..x",
  }),
  G("latin-jazz", "Latin Jazz", "Jazz", 140, 0, "jazz", {
    K: "x..x....x..x....", SS: "x..x..x...x.x...", RD: eighths, HP: backbeat,
  }),
  G("jazz-funk-groove", "Jazz-Funk Groove", "Jazz", 110, 20, "jazz", {
    K: "x..x..x...x.....", S: backbeat, S2: ".x....x.x......x", H: SIXTEENTHS_ACCENT,
  }),
  G("hard-bop-shuffle", "Hard Bop Shuffle", "Jazz", 140, 62, "jazz", {
    RD: "x..x.x..x..x.x..", HP: backbeat, K: "x.......x.......", S2: "..x.......x.x...",
  }),

  // ------------------------------------------------------------------ Blues
  G("slow-blues", "Slow Blues", "Blues & Shuffle", 60, 60, "blues", {
    K: "x.......x.......", S: backbeat, H: eighths,
  }, F_SNARE),
  G("rock-shuffle", "Rock Shuffle", "Blues & Shuffle", 120, 62, "blues", {
    K: "x.......x.......", S: backbeat, RD: eighths,
  }),

  // ------------------------------------------------------------------ Punk
  G("skate-punk", "Skate Punk", "Punk", 190, 0, "punk", {
    K: "x...x...x.x.x...", S: backbeat, H: eighths, CR: "x...............",
  }),
  G("hardcore-blast", "Hardcore Blast Beat", "Punk", 200, 0, "punk", {
    K: "x.x.x.x.x.x.x.x.", S: ".x.x.x.x.x.x.x.x", CR: "x...............",
  }),

  // ------------------------------------------------------------------ Metal
  G("metal-double-kick", "Double-Kick Metal", "Metal", 160, 0, "metal", {
    K: all16, S: backbeat, CH: "x...............", RD: eighths,
  }),
  G("thrash-gallop", "Thrash Gallop", "Metal", 180, 0, "metal", {
    K: "x.xxx.xxx.xxx.xx", S: backbeat, H: eighths, CR: "x...............",
  }),
  G("metal-breakdown", "Breakdown", "Metal", 100, 0, "metal", {
    K: "x..x..x...x.....", S: "........x.......", CH: "x...............", F1: "..............x.",
  }, { F1: "..........x.x.x.", K: "x.x.x.x.x.x.x.x." }),

  // ---------------------------------------------------- Indie & Post-Punk
  G("indie-dance", "Indie Dance", "Indie & Post-Punk", 120, 0, "indie", {
    K: four, S: backbeat, H: eighths, TB: OFFBEAT,
  }, F_SNARE),
  G("post-punk-toms", "Post-Punk Toms", "Indie & Post-Punk", 140, 0, "indie", {
    K: "x.......x.......", S: backbeat, T1: "..x...x...x...x.", H: eighths,
  }, F_TOMS),

  // ------------------------------------------------------------ Industrial
  G("industrial-stomp", "Industrial Stomp", "Industrial", 100, 0, "industrial", {
    K: "x.......x.......", S: backbeat, CH: "x...............", F1: "..x.......x.....",
  }, { F1: "..x...x...x.x.x." }),

  // -------------------------------------------------------- Latin / world
  G("euclid-7-16-groove", "Euclidean 7/16", "Minimal & Glitch", 118, 0, "minimal", {
    K: euclid(7), R: euclid(5), HT: euclid(11),
  }),

  // ------------------------------------------------------------ Footwork & Jersey
  G("footwork-roll", "Footwork Roll", "Footwork & Jersey", 160, 0, "footwork", {
    K: "x..x..x...x..x..", C: "....x.......x...", HT: "..x.x...x.x.x...", T3: "x.x...x.....x.x.",
  }, { T3: "x.x.x.x.x.x.xxxx" }),

  // ------------------------------------------------------------------ Industrial
  G("ebm-pulse", "EBM Pulse", "Industrial", 120, 0, "industrial", {
    K: four, TK: OFFBEAT, R: "..x...x...x...x.", S: "........x.......",
  }, F_SNARE),
  G("crush-half-time", "Crush Half-Time", "Industrial", 90, 0, "industrial", {
    K: "x.....x.........", S: "........x.......", F1: "..x...x...x...x.", F2: "......x.......x.", CH: "x...............",
  }, F_TOMS_DOWN),
];

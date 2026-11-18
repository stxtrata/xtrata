// Analog Kit grooves, batch A: Rock, Pop, Funk, Hip-Hop, Lo-Fi, Country & Americana,
// Soul/Motown/Gospel, R&B & Neo-Soul, Surf/Garage/Rockabilly (57 grooves).
import { N, Q8, OFF, QTR, BB, HLF, A16, OFF16, FS, FT, FT2, FC } from "./analog-groove-helpers.js";

const COUNTRY = "Country & Americana";
const SOUL = "Soul, Motown & Gospel";
const RNB = "R&B & Neo-Soul";
const SURF = "Surf, Garage & Rockabilly";

export const GROOVES_A = [
  // ------------------------------------------------------------------------ Rock (+7)
  N("rock-four-floor", "Four-on-the-Floor Rock", "Rock", 132, 0, "rusty", {
    K: QTR, S: BB, H: Q8, O: ".... .... .... ..x.", CR: "x... .... .... ....",
  }, FS, {}, { lint: "fourfloor" }),
  N("rock-stomp-clap", "Stomp Stomp Clap", "Rock", 82, 0, "rusty", {
    K2: "x... x... .... ....", C: ".... .... x... ....",
  }, { C: ".... .... x... x.x." }),
  N("rock-classic-open", "Classic Rock Open Hat", "Rock", 118, 0, "rusty", {
    K: "x.x. ..x. x.x. ....", S: BB, H: Q8, O: ".... .... .... ..x.",
  }, FT),
  N("rock-arena-toms", "Arena Toms", "Rock", 74, 0, "rusty", {
    K: "x... .... x.x. ....", S: HLF, T2: ".... x... .... x.x.", T1: ".... ..x. .... ..x.", H: Q8, CR: "x... .... .... ....",
  }, FT),
  N("rock-garage-gallop", "Garage Rock Gallop", "Rock", 140, 0, "unruly", {
    K: "x... ..x. x... ....", S: BB, O: QTR,
  }, FS),
  N("rock-power-ballad", "Power Ballad", "Rock", 66, 0, "rusty", {
    K: "x... ..x. .... x...", S: HLF, H: QTR, CR: "x... .... .... ....", T3: ".... .... .... ....",
  }, FT2),
  N("rock-heartland-drive", "Heartland Drive", "Rock", 152, 0, "modern", {
    K: "x.x. ..x. x.x. ..x.", S: BB, H: Q8, TB: BB,
  }, FS),

  // ------------------------------------------------------------------------- Pop (+6)
  N("pop-side-stick", "Side-Stick Pop", "Pop", 96, 0, "modern", {
    K: "x... ..x. .... ....", SS: BB, H: Q8, SH: OFF16,
  }),
  N("pop-stomp-clap", "Stomp-Clap Pop", "Pop", 112, 0, "modern", {
    K: QTR, C: BB, TB: OFF, H: Q8,
  }, FC),
  N("pop-synth-drive", "Synth-Pop Drive", "Pop", 118, 0, "unruly", {
    K: "x... x... x... x.x.", S: BB, H: A16,
  }, FS),
  N("pop-modern-half-time", "Modern Half-Time Pop", "Pop", 78, 0, "modern", {
    K: "x... .... x.x. ....", C: HLF, H: "x.x. x.x. x.x. x.xx", SH: OFF16,
  }, FC),
  N("pop-piano-ballad", "Piano Ballad Pop", "Pop", 72, 0, "jazz", {
    K: "x... .... x... ....", SS: HLF, H: QTR, TB: BB,
  }, FT2),
  N("pop-uptempo-clap", "Uptempo Pop Clap", "Pop", 128, 0, "modern", {
    K: QTR, C: BB, O: OFF, H: "x.xx x.xx x.xx x.xx",
  }, FC),

  // ------------------------------------------------------------------------ Funk (+6)
  N("funk-half-time-ghost", "Half-Time Ghost Groove", "Funk", 96, 22, "rusty", {
    K: "x... .... x..x ....", S: HLF, S2: "..x. .x.x .x.. x..x", H: A16,
  }, FS),
  N("funk-sly-pocket", "Sly Sixteenth Pocket", "Funk", 108, 0, "rusty", {
    K: "x..x ...x ..x. ....", S: BB, S2: ".x.. ...x ..x. ...x", H: A16, O: ".... ..x. .... ..x.",
  }),
  N("funk-on-the-one", "On The One", "Funk", 112, 0, "rusty", {
    K: "X..x ..x. ..x. ..x.", S: "..X. ...x .x.. X...", H: "x.xx x.xx x.xx x.xx",
  }, FS),
  N("funk-stripped-pocket", "Stripped Funk Pocket", "Funk", 98, 0, "unruly", {
    K: "x..x ...x ..x. ....", S: BB, H: Q8, B: "..x. .... ..x. ....",
  }),
  N("funk-slap-bounce", "Slap Funk Bounce", "Funk", 114, 0, "rusty", {
    K: "x.x. .x.. x.x. .x..", C: BB, H: "x.xx x.xx x.xx x.xx", TB: OFF,
  }, FC),
  N("funk-fatback-break", "Fatback Break", "Funk", 100, 8, "unruly", {
    K: "x.x. ..x. .x.x ....", S: BB, S2: "...x ..x. ...x ..x.", H: "x.x. x.xx x.x. x.xx",
  }, FS),

  // --------------------------------------------------------------------- Hip-Hop (+5)
  N("hh-dilla-drag", "Dilla Drag", "Hip-Hop", 86, 54, "unruly", {
    K: "x..x ..x. ...x ..x.", S: BB, H: A16, S2: ".... .x.. .... ....",
  }),
  N("hh-crunk-stomp", "Crunk Stomp", "Hip-Hop", 74, 0, "unruly", {
    K: "x... .... x..x ....", C: HLF, H: Q8, O: ".... ..x. .... ..x.",
  }, FC),
  N("hh-g-funk-bounce", "G-Funk Bounce", "Hip-Hop", 92, 10, "modern", {
    K: "x..x .... x.x. ....", S: BB, H: Q8, TB: OFF,
  }, FS),
  N("hh-golden-era-break", "Golden Era Break", "Hip-Hop", 94, 16, "unruly", {
    K: "x.x. ...x ..x. ....", S: BB, S2: "...x .... ...x ....", H: "x.x. x.x. x.x. x.xx",
  }, FS),
  N("hh-cloud-sway", "Cloud Rap Sway", "Hip-Hop", 70, 12, "unruly", {
    K: "x... ..x. ..x. ....", C: HLF, H: "x.x. x.x. x.x. xxx.", SH: "...x ...x ...x ...x",
  }),

  // --------------------------------------------------------------------- Lo-Fi (+5)
  N("lofi-rainy-window", "Rainy Window", "Lo-Fi", 68, 30, "unruly", {
    K: "x... .... x.x. ....", SS: BB, H: Q8, SH: ".x.. .x.. .x.. .x..",
  }),
  N("lofi-study-nod", "Study Break Nod", "Lo-Fi", 76, 26, "jazz", {
    K: "x..x .... ..x. ....", SS: HLF, H: QTR, HT: OFF16,
  }),
  N("lofi-vinyl-brush", "Vinyl Brush", "Lo-Fi", 74, 22, "jazz", {
    K: "x... ..x. .... x...", SB: BB, RD: QTR, HP: BB,
  }, FT2),
  N("lofi-late-night-clap", "Late Night Clap", "Lo-Fi", 82, 18, "unruly", {
    K: "x..x ..x. .... ....", C: ".... ..x. .... ..x.", H: "x.x. x.x. x.x. x.xx", TB: OFF,
  }),
  N("lofi-coffee-shop", "Coffee Shop Tap", "Lo-Fi", 88, 34, "jazz", {
    K: "x..x .... x... x...", SS: BB, HT: OFF16, R: ".... .... ..x. ....",
  }),

  // -------------------------------------------------------------- Country & Americana (8)
  N("country-train-beat", "Train Beat", COUNTRY, 120, 0, "rusty", {
    K: "x... .... x... ....", S: "x.x. X.x. x.x. X.x.",
  }, { S: "x.x. X.x. x.xx xxxx" }),
  N("country-honky-tonk", "Honky-Tonk Backbeat", COUNTRY, 118, 0, "rusty", {
    K: "x... ..x. x... ....", S: BB, TB: BB, H: Q8,
  }, FS),
  N("country-bluegrass-chug", "Bluegrass Brush Chug", COUNTRY, 140, 0, "jazz", {
    K: "x... .... x... ....", SB: "x.x. X.x. x.x. X.x.",
  }),
  N("country-outlaw-shuffle", "Outlaw Shuffle (♩=110)", COUNTRY, 55, 33, "rusty", {
    K: QTR, S: "..x. ..x. ..x. ..x.", H: "x.x. x.x. x.x. x.x.",
  }, FS, {}, { felt: 110 }),
  N("country-ballad-brush", "Country Ballad Brush", COUNTRY, 68, 0, "jazz", {
    K: "x... .... x.x. ....", SB: QTR, HP: ".... x... .... x...",
  }, FT2),
  N("country-americana-stomp", "Americana Stomp", COUNTRY, 100, 0, "rusty", {
    K2: QTR, SS: BB, TB: OFF,
  }, FT2),
  N("country-nashville-pop", "Nashville Pop-Country", COUNTRY, 104, 0, "modern", {
    K: "x... ..x. x... ....", S: BB, H: Q8, TB: "..x. ..x. ..x. ..x.",
  }, FS),
  N("country-fast-freight", "Fast Freight", COUNTRY, 160, 0, "rusty", {
    K: "x... .... x... ....", S: "x.x. X.x. x.x. X.x.",
  }, { S: "x.x. X.x. xxxx xxxx" }),

  // ------------------------------------------------------------ Soul, Motown & Gospel (8)
  N("soul-motown-four", "Motown Four Snare", SOUL, 112, 0, "rusty", {
    K: "x.x. ...x x.x. ....", S: QTR, TB: Q8,
  }, FS),
  N("soul-stax-backbeat", "Stax Backbeat", SOUL, 98, 0, "rusty", {
    K: "x... ..x. ..x. ....", S: BB, H: Q8, O: ".... .... .... ..x.",
  }, FS),
  N("soul-gospel-shout", "Gospel Shout", SOUL, 128, 0, "rusty", {
    K: "x..x ..x. x..x ..x.", S: BB, C: BB, TB: Q8,
  }, FS),
  N("soul-gospel-slow-burn", "Gospel Slow Burn", SOUL, 62, 0, "jazz", {
    K: "x... ..x. .... x...", S: HLF, H: QTR, RB: "x... .... .... ....",
  }, FT2),
  N("soul-memphis-pocket", "Memphis Pocket", SOUL, 90, 14, "jazz", {
    K: "x... ..x. .x.. ....", S: BB, S2: "..x. .... .x.. x...", H: "x.xx x.xx x.xx x.xx",
  }),
  N("soul-northern-stomper", "Northern Soul Stomper", SOUL, 138, 0, "rusty", {
    K: QTR, S: BB, TB: Q8, O: OFF,
  }, FS),
  N("soul-philly-sweep", "Philly Soul Sweep", SOUL, 104, 0, "jazz", {
    K: "x..x .... x..x ....", S: BB, H: A16,
  }),
  N("soul-sweet-ballad", "Sweet Soul Ballad", SOUL, 76, 20, "jazz", {
    K: "x... .... x..x ....", SS: HLF, H: Q8, TB: BB,
  }, FT2),

  // --------------------------------------------------------------- R&B & Neo-Soul (6)
  N("rnb-slow-jam", "Slow Jam", RNB, 68, 16, "unruly", {
    K: "x... ..x. ..x. ....", C: HLF, H: "x.x. x.x. x.x. x.xx", SH: ".x.. .x.. .x.. .x..",
  }),
  N("rnb-neo-soul-drag", "Neo-Soul Drag", RNB, 84, 48, "unruly", {
    K: "x..x .... x.x. ..x.", S: BB, S2: "..x. .x.. ..x. .x..", H: "x.xx x.xx x.xx x.xx",
  }),
  N("rnb-new-jack", "New Jack Swing", RNB, 108, 26, "modern", {
    K: "x..x ..x. x..x ....", S: BB, C: BB, H: A16,
  }, FS),
  N("rnb-quiet-storm", "Quiet Storm Brush", RNB, 72, 12, "jazz", {
    K: "x... .... x.x. ....", SB: BB, RD: QTR,
  }, FT2),
  N("rnb-contemporary-skip", "Contemporary R&B Skip", RNB, 90, 10, "unruly", {
    K: "x... .x.. x.x. ....", C: BB, H: "x.x. xxx. x.x. xx.x", O: ".... .... ..x. ....",
  }),
  N("rnb-90s-bounce", "90s R&B Bounce", RNB, 94, 20, "modern", {
    K: "x..x .x.. x..x .x..", S: BB, H: Q8, TB: ".... ...x .... ...x",
  }, FS),

  // ----------------------------------------------------- Surf, Garage & Rockabilly (6)
  N("surf-tom-gallop", "Surf Tom Gallop", SURF, 150, 0, "rusty", {
    K: QTR, S: BB, T2: "x.xx x.x. x.xx x.x.",
  }, FT),
  N("surf-wipeout-roll", "Wipeout Roll", SURF, 138, 0, "rusty", {
    K: QTR, S: "Xxxx Xxxx Xxxx Xxxx",
  }, FT),
  N("rockabilly-brush-shuffle", "Rockabilly Brush Shuffle (♩=140)", SURF, 70, 33, "jazz", {
    K: QTR, SB: "..x. ..x. ..x. ..x.",
  }, FS, {}, { felt: 140 }),
  N("garage-60s-stomp", "60s Garage Stomp", SURF, 142, 0, "unruly", {
    K: "x.x. ..x. x.x. ..x.", S: BB, TB: Q8, O: OFF,
  }, FS),
  N("surf-pipeline-drive", "Pipeline Drive", SURF, 160, 0, "rusty", {
    K: "x... ..x. x... ..x.", S: BB, H: Q8, T1: ".... .... .... ....",
  }, FT),
  N("rockabilly-rock-n-roll", "Rock 'n' Roll Backbeat", SURF, 176, 0, "rusty", {
    K: QTR, SS: BB, O: Q8,
  }, FS),
];

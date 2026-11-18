// Percussion-only rhythm templates shared by every beat collection.
//
// A recipe describes a groove as abstract drum ROLES (kick, snare, shaker, congas…)
// with 16-step (one bar) or 32-step (two bar) patterns: x = hit, X = accent, . = rest.
// Each collection maps the roles onto its own sounds (embedded kit, Bitcoin L1 hits,
// or a mix), so the same rhythm library gives three differently-voiced sets.
// There are no bass, chord, melody or pad roles: these are percussion templates.
//
// The patterns are stylised, playable templates in a 16th-note grid — not scholarly
// transcriptions. Triplet-based traditions (6/8, 12/8) are deliberately left out
// rather than faked, because the sequencer grid is straight 16ths.

export const ROLES = {
  K: "Kick",
  K2: "Low drum (surdo / bombo / dhol)",
  S: "Snare / backbeat",
  S2: "Ghost snare / second snare",
  SS: "Side stick",
  C: "Clap",
  H: "Closed hat",
  HP: "Pedal hat",
  HT: "Hat tap / tick",
  HH: "Half-open hat",
  O: "Open hat",
  RD: "Ride",
  RB: "Ride bell",
  CR: "Crash",
  SP: "Splash",
  CH: "China",
  B: "Bell (cowbell / agogô)",
  B2: "High bell / finger cymbal",
  R: "Rim / clave / wood block",
  T3: "Rack tom 1 / high drum",
  T2: "Rack tom 2 / mid drum",
  T1: "Rack tom 3 / low drum",
  F1: "Floor tom 1",
  F2: "Floor tom 2",
  SH: "Shaker / ganzá / güira",
  TB: "Tambourine",
  TK: "Tick / tiny click",
  BA: "808 bass hit (tonal)",
};

export const clean = (s) => s.replace(/[\s|]/g, "");
// Euclidean-style spread of k hits over n steps (rotation fixed so step 0 is a hit).
export const euclid = (k, n = 16) =>
  Array.from({ length: n }, (_, i) => ((i * k) % n < k ? "x" : ".")).join("");
// Indian-tala style: 1-based beat numbers → a 32-step pattern, two steps per beat.
export const matras = (beats, accents = []) =>
  Array.from({ length: 32 }, (_, i) =>
    i % 2
      ? "."
      : accents.includes(i / 2 + 1)
        ? "X"
        : beats.includes(i / 2 + 1)
          ? "x"
          : ".",
  ).join("");
export const all16 = "xxxxxxxxxxxxxxxx";
export const eighths = "x.x.x.x.x.x.x.x.";
export const four = "x...x...x...x...";
export const backbeat = "....x.......x...";

// kit: "ac" acoustic hand-percussion voices · "el" drum-machine voices ·
//      "hy" machine kick/snare/hats with hand-percussion colour.
// world: true for regional/traditional styles.
// fill (optional): bar-4 additions/replacements per role (16 chars).
// fx (optional): per-role {delay,reverb,drive,filter,cutoff}.
export const R = (id, name, genre, bpm, swing, kit, world, v, fill = {}, fx = {}) => ({
  id,
  name,
  genre,
  bpm,
  swing,
  kit,
  world,
  v: Object.fromEntries(Object.entries(v).map(([k, p]) => [k, clean(p)])),
  fill: Object.fromEntries(Object.entries(fill).map(([k, p]) => [k, clean(p)])),
  fx,
});

export const RECIPES = [
  // ------------------------------------------------------------ Latin & Caribbean
  R("samba-batucada", "Samba Batucada", "Brazilian", 100, 0, "ac", true, {
    K2: "x...X...x...X...", // surdo
    S2: "XxxxXxxxXxxxXxxx", // caixa
    R: "x.xx.x.xx.xx.x.x", // tamborim
    B: "x.x.x..xx.x.x..x", // agogô low
    B2: "..x..x....x..x..", // agogô high
    SH: all16, // ganzá
  }, { S2: "xxxxxxxxxxxxXXXX" }),
  R("bossa-nova-clave", "Bossa Nova Clave", "Brazilian", 128, 6, "ac", true, {
    R: "x..x..x...x..x..", // cross-stick clave
    K: "x..x....x..x....",
    H: eighths,
    S2: "......x.......x.", // brush
  }),
  R("son-clave-3-2", "Son Clave 3-2", "Latin", 96, 0, "ac", true, {
    R: "x..x..x...x.x...", // clave
    B: eighths, // campana
    T1: "....x.......x...", // conga open tones
    T3: "..x...x...x...x.", // conga slaps
    K2: "...x.......x....", // bombo
    SH: "X.x.X.x.X.x.X.x.", // maracas
  }, { T3: "..x...x.x.x.xxxx" }),
  R("rumba-clave-cascara", "Rumba Clave & Cascara", "Latin", 100, 0, "hy", true, {
    R: "x..x...x..x.x...", // rumba clave
    B2: "x.xx.x.x.x.xx.x.", // cascara on the shell
    K: "x.......x.......",
    T3: "..x...x...x...x.",
    H: "..x...x...x...x.",
  }),
  R("cha-cha-cha", "Cha-Cha-Chá", "Latin", 118, 0, "ac", true, {
    K2: "x.......x.......",
    R: "........x...x.x.", // "cha-cha-chá"
    S2: "x.xxx.xxx.xxx.xx", // güiro
    B: four,
  }),
  R("cumbia", "Cumbia Colombiana", "Latin", 92, 6, "ac", true, {
    SH: "x.xxx.xxx.xxx.xx", // guacharaca
    K2: "x.......x.......", // bombo
    R: backbeat, // llamador
    T3: "x..x..x.x..x..x.", // alegre
    B: eighths, // campana
  }, { T3: "x.x.x.x.xxxxxxxx" }),
  R("merengue-tambora", "Merengue Tambora", "Latin", 130, 0, "ac", true, {
    K2: four,
    T2: "..xx..xx..xx..xx", // tambora
    SH: "XxxxXxxxXxxxXxxx", // güira
    R: "x...x...x...x...",
  }, { T2: "..xx..xxxxxxxxxx" }),
  R("bachata-bongos", "Bachata Bongos", "Latin", 126, 0, "ac", true, {
    T3: "x.x.xxx.x.x.xxx.", // bongo martillo
    T2: "..x...x...x...x.",
    K2: "x.......x.......",
    SH: "x.xxx.xxx.xxx.xx", // güira
    B: four,
  }),
  R("dembow", "Dembow", "Dancehall & Reggaeton", 96, 0, "hy", true, {
    K: four,
    S: "...x..x....x..x.",
    H: eighths,
    SH: "..x...x...x...x.",
    C: "........x.......",
  }),
  R("dancehall-riddim", "Dancehall Riddim", "Dancehall & Reggaeton", 100, 0, "hy", true, {
    K: "x.......x.x.....",
    S: "...x......x.....",
    H: eighths,
    R: "......x.......x.",
    T3: ".............x.x",
  }),
  R("soca-power", "Soca Power", "Dancehall & Reggaeton", 128, 0, "hy", true, {
    K: four,
    S2: "..x...x...x...x.",
    B: "x..x..x.x..x..x.",
    SH: all16,
    C: "........x.......",
  }, { S2: "..x...x.xxxxxxxx" }),
  R("reggae-one-drop", "Reggae One Drop", "Reggae & Dub", 76, 22, "hy", true, {
    K: "........x.......",
    R: "........x.......",
    H: eighths,
    T3: ".......x.......x", // akete accents
    O: "..x.........x...",
  }, {}, { O: { delay: 0.25 } }),
  R("roots-steppers", "Roots Steppers", "Reggae & Dub", 84, 12, "hy", true, {
    K: four,
    R: "........x.......",
    H: eighths,
    O: "..x...x...x...x.",
    T2: "....x.......x...",
  }),
  R("nyabinghi-heartbeat", "Nyabinghi Heartbeat", "Reggae & Dub", 72, 0, "ac", true, {
    K2: four, // bass drum "thunder"
    T2: "..x...x...x...x.", // fundeh
    T3: "x.xx.xx.x.xx.xx.", // akete
    SH: eighths,
  }),
  // ------------------------------------------------------------------- Africa
  R("afrobeat", "Afrobeat Groove", "Afrobeat & African", 108, 10, "ac", true, {
    K: "x..x....x..x....",
    S: backbeat,
    H: eighths,
    SH: all16,
    T2: "..x..x..x..x.x..",
    B: "x.x.x..x..x.x..x",
  }, { T2: "..x.x.x.xxxxxxxx" }),
  R("highlife-bounce", "Highlife Bounce", "Afrobeat & African", 112, 8, "ac", true, {
    K2: "x.......x.......",
    S2: "..x...x...x...x.",
    R: "x..x..x...x..x..",
    SH: "x.xxx.xxx.xxx.xx",
    B: four,
  }),
  R("soukous-sebene", "Soukous Sebene", "Afrobeat & African", 120, 0, "ac", true, {
    K: "x.....x.x.......",
    S: backbeat,
    H: "x.xxx.xxx.xxx.xx",
    R: "x..x..x.x..x..x.",
    B2: "..x...x...x...x.",
  }),
  R("mbalax-sabar", "Mbalax Sabar", "Afrobeat & African", 110, 0, "ac", true, {
    T1: "x..x....x..x....",
    T2: "..x..x.x..x..x.x",
    T3: "x.xx.xx.x.xx.xx.",
    K2: "x.......x.......",
    R: "..x...x...x...x.",
  }, { T3: "xxxxxxxxxxxxxxxx" }),
  R("amapiano-log-shaker", "Amapiano Log & Shaker", "Afrobeat & African", 112, 12, "hy", true, {
    K: "x.......x.......",
    C: "........x.......",
    SH: "XxxxXxxxXxxxXxxx",
    T1: "..x..x..x...x.x.", // log-drum style hits
    S2: "......x.......x.",
    O: "..x...x...x...x.",
  }),
  R("gqom-dark-pulse", "Gqom Dark Pulse", "Afrobeat & African", 126, 0, "el", true, {
    K: "x..x..x.x..x..x.",
    C: backbeat,
    O: "..x...x...x...x.",
    TK: "x.xx.xx.x.xx.xx.",
    T1: "......x.......x.",
  }),
  R("kuduro-rush", "Kuduro Rush", "Afrobeat & African", 140, 0, "el", true, {
    K: four,
    S: "...x..x....x..x.",
    H: all16,
    C: backbeat,
    R: "x..x..x.x..x..x.",
  }, { S: "...x..x.x.x.xxxx" }),
  // ------------------------------------------------------- South America & Iberia
  R("baile-funk-tamborzao", "Baile Funk Tamborzão", "Brazilian", 130, 0, "hy", true, {
    K: "x..x..x.x..x..x.",
    T1: "x.x...x.x.x.....", // atabaque
    S: backbeat,
    R: "..x...x...x...x.",
    SH: eighths,
  }),
  R("maracatu-nacao", "Maracatu Nação", "Brazilian", 100, 0, "ac", true, {
    K2: "x..x....x..x....", // alfaia
    S2: "x.xxx.xxx.xxx.xx", // caixa
    B: "x.x..x.x..x.x...", // gonguê
    SH: all16, // mineiro
    T3: "....x.......x...",
  }, { K2: "x..x..x.x.x.xxxx" }),
  R("baiao-zabumba", "Baião Zabumba", "Brazilian", 100, 0, "ac", true, {
    K2: "x..x..x.x..x..x.",
    S2: backbeat,
    TK: "x.xxx.xxx.xxx.xx", // triangle
    SH: eighths,
  }),
  R("candombe-llamadas", "Candombe Llamadas", "Latin", 120, 0, "ac", true, {
    T1: "x...x.x.x...x.x.", // piano
    T2: "..xx..x...xx..x.", // repique
    T3: eighths, // chico
    R: "x.......x.......",
  }, { T2: "..xx..xxxxxxxxxx" }),
  R("flamenco-rumba-cajon", "Rumba Flamenca Cajón", "Latin", 100, 0, "ac", true, {
    K2: "x..x....x..x....", // cajón bass
    S: "..x...x...x...x.", // cajón slap
    C: "x.xx.xx.x.xx.xx.", // palmas
    TK: "x.......x.......",
  }),
  // ------------------------------------------------- Middle East & South Asia
  R("maqsum-darbuka", "Maqsum Darbuka", "Middle Eastern", 100, 0, "ac", true, {
    K2: "x.......x.......", // doum
    R: "..x...x.....x...", // tek
    S2: "....x.....x...x.", // ka
    SH: eighths,
  }),
  R("baladi-darbuka", "Baladi Darbuka", "Middle Eastern", 96, 0, "ac", true, {
    K2: "x.x.....x.......",
    R: "......x.....x...",
    S2: "....x.....x...x.",
    SH: eighths,
  }),
  R("saidi-darbuka", "Saidi Darbuka", "Middle Eastern", 104, 0, "ac", true, {
    K2: "x.....x.x.......",
    R: "..x.........x...",
    S2: "....x.....x...x.",
    SH: eighths,
  }),
  R("tabla-teental", "Tabla Teental", "Indian", 100, 0, "ac", true, {
    // 16-beat tala, two steps per matra: bayan on the open bols, dayan on all
    T1: matras([1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16], [1, 5]),
    T3: matras([2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [1, 5, 13]),
    B2: matras([1, 5, 9, 13], [1]), // tala markers on a finger cymbal
  }),
  R("dholak-keherwa", "Dholak Keherwa", "Indian", 110, 0, "ac", true, {
    T1: "x.x.......x.x...", // bass side
    T3: "x...x.x.x...x.x.",
    B2: "x.......x.......",
    SH: eighths,
  }),
  R("bhangra-dhol", "Bhangra Dhol", "Indian", 120, 0, "ac", true, {
    K2: "x.x...x.x.x...x.",
    R: "..x.x.x...x.x.x.", // treble stick
    B2: eighths, // chimta
    T3: "....x.......x...",
  }, { R: "..x.x.x.xxxxxxxx" }),
  // ------------------------------------------------ East Asia, Pacific & folk
  R("taiko-matsuri", "Taiko Matsuri", "East Asian & Pacific", 110, 0, "ac", true, {
    K2: "X.......x.......", // odaiko
    T1: "..x...x...x...x.", // chu-daiko
    T3: eighths, // shime
    B2: four, // kane
  }, { T1: "..x...x.xxxxxxxx" }),
  R("lion-dance-drums", "Lion Dance Drums", "East Asian & Pacific", 128, 0, "ac", true, {
    K2: "x.x.x.x.xxx.xxx.",
    CR: eighths,
    B: "x.......x.......", // gong
    R: "..x.x.x...x.x.x.",
  }),
  R("tahitian-toere", "Tahitian Tōere", "East Asian & Pacific", 140, 0, "ac", true, {
    R: "x.xx.xx.x.xx.xx.", // log drum
    K2: "x.......x.......",
    T3: "..x...x...x...x.",
    SH: all16,
  }),
  R("powwow-heartbeat", "Powwow Heartbeat", "Folk & Marching", 90, 0, "ac", true, {
    K2: "X...x...X...x...",
    T2: "X...x...X...x...",
    SH: eighths,
  }),
  R("bodhran-reel", "Bodhrán Reel", "Folk & Marching", 112, 20, "ac", true, {
    T1: "x.xx.x.xx.xx.x.x",
    R: "..x...x...x...x.",
    B2: "x...x...x...x...",
  }),
  R("second-line", "Second Line", "Folk & Marching", 100, 14, "hy", true, {
    K: "x..x...x...x....",
    S: "..x.x.xx..x.x.x.",
    B: four,
    CR: "x...............",
  }),
  R("drumline-paradiddle", "Drumline Paradiddle", "Folk & Marching", 120, 0, "hy", true, {
    S: "x.xx.x..x.xx.x..", // right hand RLRR LRLL
    T3: ".x..x.xx.x..x.xx", // left hand
    K2: "x.......x.......",
    CR: "x...............",
  }, { S: "x.xx.x..xxxxxxxx" }),
  R("stomp-and-clap", "Stomp & Clap", "Folk & Marching", 100, 0, "hy", true, {
    K: "x...x...........",
    C: "........x.......",
    B2: eighths,
  }),
  // ------------------------------------------------------------ Drum-kit styles
  R("classic-house", "Classic House", "House", 124, 0, "el", false, {
    K: four,
    C: backbeat,
    O: "..x...x...x...x.",
    H: all16,
    TK: "...x.......x...x",
  }),
  R("deep-house-shuffle", "Deep House Shuffle", "House", 120, 20, "el", false, {
    K: four,
    C: backbeat,
    H: eighths,
    SH: "..x..x..x..x..x.",
    R: "......x.........",
  }),
  R("disco-four", "Disco Four", "Disco", 118, 0, "el", false, {
    K: four,
    S: backbeat,
    H: all16,
    O: "..x...x...x...x.",
    CR: "x...............",
    C: backbeat,
  }),
  R("warehouse-techno", "Warehouse Techno", "Techno", 132, 0, "el", false, {
    K: four,
    O: "..x...x...x...x.",
    H: all16,
    C: backbeat,
    R: "...x.....x..x...",
    TK: "x.xx.x.xx.x.xx.x",
  }),
  R("rumble-techno", "Rumble Techno", "Techno", 138, 0, "el", false, {
    K: four,
    T1: "x.xx.xx.x.xx.xx.",
    H: "..x...x...x...x.",
    TK: all16,
  }),
  R("electro-808", "Electro 808", "Electro", 128, 0, "el", false, {
    K: "x.....x...x.....",
    S: backbeat,
    H: "x.x.x.x.xxx.x.x.",
    B: "..x......x....x.",
    C: backbeat,
  }),
  R("funk-break", "Funk Break", "Funk", 108, 0, "el", false, {
    K: "x.x.......xx....",
    S: "....X.......X...",
    S2: "..x..x.x.x.x..x.",
    H: eighths,
    O: "......x.........",
  }),
  R("chopped-break", "Chopped Break", "Breakbeat", 136, 0, "el", false, {
    K: "x.x.......xx.... ..xx......x.....",
    S: "....x.......x... ....x.......x.x.",
    S2: ".......x.x.....x .......x.x......",
    H: "x.x.x.x.x.x.x.x. x.x.x.x.x.x.x.x.",
  }),
  R("jungle-rollers", "Jungle Rollers", "Jungle", 170, 6, "el", false, {
    K: "x.........x.....",
    S: backbeat,
    S2: ".......x.x.....x",
    H: "x.xxx.xxx.xxx.xx",
    R: "..x.......x...x.",
  }, { S2: "..x.x.x.xxxxxxxx" }),
  R("dnb-two-step", "DnB Two-Step", "Drum & Bass", 174, 0, "el", false, {
    K: "x.........x.....",
    S: backbeat,
    H: eighths,
    S2: ".......x...x..x.",
    O: "......x.......x.",
  }),
  R("halftime-roller", "Halftime Roller", "Drum & Bass", 170, 8, "el", false, {
    K: "x.....x.........",
    S: "........x.......",
    H: all16,
    O: "..............x.",
  }),
  R("uk-garage-2step", "UK Garage 2-Step", "UK Garage", 132, 24, "el", false, {
    K: "x.........x.....",
    S: backbeat,
    H: "x.xxx.xxx.xxx.xx",
    R: "..x...x...x...x.",
    C: ".......x.......x",
  }),
  R("grime-sparse", "Grime Sparse", "UK Garage", 140, 0, "el", false, {
    K: "x.......x..x....",
    S: backbeat,
    H: eighths,
    O: "......x.........",
    TK: "x.xx.x.xx.x.xx.x",
  }),
  R("dubstep-halfstep", "Dubstep Half-Step", "Dubstep", 140, 0, "el", false, {
    K: "x...........x...",
    S: "........x.......",
    H: eighths,
    O: "..............x.",
  }),
  R("trap-halftime", "Trap Halftime", "Trap & Drill", 140, 0, "el", false, {
    K: "x......x..x.....",
    S: "........x.......",
    C: "........x.......",
    H: "x.x.xxx.x.x.x.xx x.x.x.x.xxxxxxxx",
    O: "..............x.",
  }),
  R("drill-slide", "Drill Slide", "Trap & Drill", 144, 10, "el", false, {
    K: "x..x..x.x.......",
    S: "........x...x...",
    H: "x.xx.xx.x.xx.xx.",
    O: "......x.........",
  }),
  R("boom-bap", "Boom Bap", "Hip-Hop", 90, 18, "el", false, {
    K: "x.....x...x.....",
    S: backbeat,
    H: eighths,
    O: "......x.........",
    S2: "..........x....x",
  }),
  R("lofi-head-nod", "Lo-Fi Head Nod", "Lo-Fi", 78, 28, "el", false, {
    K: "x.....x...x.....",
    S: backbeat,
    H: eighths,
    SH: ".x...x...x...x..",
  }),
  R("footwork-160", "Footwork 160", "Footwork & Jersey", 160, 0, "el", false, {
    K: "x..x..x...x..x..",
    C: backbeat,
    H: eighths,
    R: "..x...x...x...x.",
  }, { C: "....x...x.x.xxxx" }),
  R("jersey-club", "Jersey Club", "Footwork & Jersey", 138, 0, "el", false, {
    K: "x..x..x.x..x..x.",
    C: backbeat,
    H: eighths,
    R: "..x.....x.x.....",
  }),
  R("uk-funky-toms", "UK Funky Toms", "UK Garage", 130, 10, "hy", false, {
    K: "x..x....x..x....",
    S: backbeat,
    H: eighths,
    T1: "......x.......x.",
    T3: "..x..x..x..x..x.",
  }, { T1: "........xxxx.x.x" }),
  R("rock-steady", "Rock Steady", "Rock", 120, 0, "el", false, {
    K: "x.......x.x.....",
    S: backbeat,
    H: eighths,
    CR: "x...............",
  }, { T3: "............xxx.", T2: "..............xx" }),
  R("punk-d-beat", "Punk D-Beat", "Punk", 180, 0, "el", false, {
    K: "x.xx..x.x.xx..x.",
    S: backbeat,
    H: eighths,
    CR: "x...............",
  }),
  R("motorik", "Motorik", "Indie & Post-Punk", 124, 0, "el", false, {
    K: four,
    S: backbeat,
    H: eighths,
    O: "......x.......x.",
    CR: "x...............",
  }),
  R("blues-shuffle", "Blues Shuffle", "Blues & Shuffle", 100, 62, "el", false, {
    K: "x.......x.......",
    S: backbeat,
    H: eighths,
    S2: "..............x.",
  }),
  R("jazz-swing-ride", "Jazz Swing Ride", "Jazz", 126, 62, "el", false, {
    O: "x...x.x.x...x.x.", // ride
    H: backbeat, // foot hi-hat
    K: four, // feathered kick
    S2: "..x.......x.x...", // comping
  }),
  R("euclidean-machine", "Euclidean Machine", "Minimal & Glitch", 120, 0, "el", false, {
    K: euclid(5),
    S: euclid(3, 8) + euclid(3, 8),
    H: euclid(11),
    R: euclid(7),
    TK: euclid(9),
  }),
  R("minimal-click-grid", "Minimal Click Grid", "Minimal & Glitch", 124, 0, "el", false, {
    K: four,
    TK: euclid(7),
    R: euclid(5),
    H: "..x...x...x...x.",
    SH: euclid(11),
  }),
  R("ebm-machine-march", "EBM Machine March", "Industrial", 126, 0, "el", false, {
    K: "x..x..x.x..x..x.",
    S: backbeat,
    R: eighths,
    CR: "x...............",
    TK: "..x...x...x...x.",
  }),
  R("dub-steppers", "Dub Steppers", "Reggae & Dub", 140, 0, "el", false, {
    K: four,
    R: backbeat,
    O: "..x...x...x...x.",
    T3: "......x.......x.",
  }, {}, { R: { delay: 0.3 }, T3: { delay: 0.35, reverb: 0.2 } }),
  R("glitch-fragments", "Glitch Fragments", "Minimal & Glitch", 102, 0, "el", false, {
    K: "x..x.....x.x..x.",
    S: "....x....x..x...",
    H: "x.xx.x..xx.x.xx.",
    R: "..x....x.....x.x",
    TK: "x...x..x..x....x",
  }),
  R("gabber-kick", "Gabber Stomp", "Techno", 190, 0, "el", false, {
    K: four,
    S: backbeat,
    O: "..x...x...x...x.",
    C: backbeat,
  }, {}, { K: { drive: 0.3 } }),
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

// Expand a role's pattern to the 64-step sequence, applying the bar-4 fill.
export function expandRole(recipe, role) {
  const base = recipe.v[role];
  const steps = Array.from({ length: 64 }, (_, i) =>
    base ? base[i % base.length] : ".",
  );
  const fill = recipe.fill[role];
  if (fill) for (let i = 0; i < 16; i++) steps[48 + i] = fill[i];
  return steps.join("");
}

// Roles used by a recipe (including roles that only appear in the bar-4 fill).
export const recipeRoles = (recipe) => [
  ...new Set([...Object.keys(recipe.v), ...Object.keys(recipe.fill)]),
];

export const pick = (ids) =>
  ids.map((id) => {
    if (!RECIPE_BY_ID[id]) throw new Error(`Unknown percussion recipe: ${id}`);
    return RECIPE_BY_ID[id];
  });

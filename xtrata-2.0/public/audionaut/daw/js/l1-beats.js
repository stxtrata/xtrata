// L1-only beat collection. Every sound is a curated Bitcoin audio inscription.
import { OB1 } from "./beats.js";
import { SAMPLE_LIBRARY } from "./library.js";

const curated = SAMPLE_LIBRARY.flatMap((group) => group.items);
const sample = (id, kind = "hit", extra = {}) => {
  const entry = curated.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown L1 beat sample: ${id}`);
  return {
    source: { type: "ordinal", value: id, label: entry.label },
    kind,
    ...extra,
  };
};
export const L1_SAMPLES = Object.fromEntries(
  Object.entries(OB1).map(([key, id]) => [key, sample(id)]),
);
Object.assign(L1_SAMPLES, {
  ogKick: sample(
    "a511d79317efac68fea3b14070bebe208aefde07ce1c55d6f4cfe42e8273cbdbi0",
  ),
  ogKick2: sample(
    "5b2dc7be28ad70c233b06d0ba23888aa38eb8711c24f8462d2774ac5fb7e7212i0",
  ),
  ogSnare: sample(
    "6c01b1214fc4d4016d683380d066849e6bc645276b102604c098bd35fd77f791i0",
  ),
  ogBass: sample(
    "0b8eff3f39f4095d0f129bb8dd75f29159f8725c7e66046bf41f70ebb9f60d93i0",
  ),
  wobble: sample(
    "fef956676f3cbd6019a03d75c1a4a295c25b33653644b8f6ebde387971f9a677i0",
  ),
  woop: sample(
    "752bd66406185690c6f14311060785170df91a887b42740e1dde27e5fbf351cbi0",
  ),
  eightBit: sample(
    "3364803cb3032ce95f4138a214c15a9b36dcb70f574a477f27615d448e1cdeb8i0",
    "loop",
    { sourceBpm: 105, loopBeats: 4 },
  ),
  stepDrums: sample(
    "ccf99852fb85d63b5f65124fe506b08c11eb400a7b1da75cd3e0c9538fc49977i0",
    "loop",
    { sourceBpm: 105, loopBeats: 2 },
  ),
  stepMelody: sample(
    "e4cb3caff3b4a5192adf0f2ab5cd9da378bacfbafce56c3d4fb678a313607970i0",
    "loop",
    { sourceBpm: 105, loopBeats: 2 },
  ),
});

// Six lanes: kick, backbeat, hats, bass, percussion, colour. Indices are 16ths.
const GROOVES = {
  four: [
    [0, 4, 8, 12],
    [4, 12],
    [2, 6, 10, 14],
    [0, 6, 10],
    [3, 7, 11, 15],
    [14],
  ],
  disco: [
    [0, 4, 8, 12],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 3, 6, 8, 11, 14],
    [2, 6, 10, 14],
    [7, 15],
  ],
  broken: [
    [0, 6, 10],
    [4, 12],
    [0, 2, 5, 6, 8, 10, 13, 14],
    [0, 6, 11],
    [3, 7, 15],
    [10],
  ],
  garage: [
    [0, 7, 10],
    [4, 12],
    [0, 2, 3, 6, 8, 10, 11, 14],
    [0, 7, 10, 15],
    [3, 6, 11, 14],
    [15],
  ],
  electro: [
    [0, 3, 6, 10, 13],
    [4, 12],
    [0, 2, 4, 6, 7, 8, 10, 12, 14],
    [0, 3, 10, 13],
    [7, 14],
    [12],
  ],
  hiphop: [
    [0, 6, 10],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 6, 10],
    [7, 15],
    [14],
  ],
  halftime: [
    [0, 6, 12],
    [8],
    [0, 2, 4, 6, 10, 12, 14, 15],
    [0, 6, 12],
    [3, 11],
    [15],
  ],
  drill: [
    [0, 6, 9, 14],
    [8, 14],
    [0, 3, 6, 8, 11, 14],
    [0, 6, 9, 14],
    [7, 13],
    [15],
  ],
  jungle: [
    [0, 10, 13],
    [4, 7, 12, 15],
    [0, 2, 3, 6, 8, 10, 11, 14],
    [0, 10],
    [5, 9, 14],
    [15],
  ],
  dnb: [
    [0, 10],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 10, 15],
    [3, 7, 11, 15],
    [14],
  ],
  footwork: [
    [0, 3, 6, 10, 13],
    [8],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 3, 10, 13],
    [2, 5, 11, 14],
    [7, 15],
  ],
  dembow: [
    [0, 4, 8, 12],
    [3, 6, 11, 14],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 6, 8, 14],
    [2, 7, 10, 15],
    [15],
  ],
  dancehall: [
    [0, 8, 10],
    [3, 10],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 7, 10],
    [6, 14],
    [15],
  ],
  afro: [
    [0, 3, 8, 11],
    [4, 7, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 3, 7, 10, 14],
    [2, 6, 11, 15],
    [7, 14],
  ],
  log: [
    [0, 8],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 3, 6, 10, 13],
    [2, 7, 11, 14],
    [15],
  ],
  clave: [
    [0, 6, 8, 14],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 6, 8, 14],
    [0, 3, 6, 10, 12],
    [7, 15],
  ],
  samba: [
    [2, 6, 10, 14],
    [0, 3, 5, 8, 11, 13],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [0, 8],
    [0, 3, 6, 9, 10, 13],
    [15],
  ],
  funk: [
    [0, 2, 10, 13],
    [4, 7, 9, 12, 15],
    [0, 2, 4, 6, 7, 8, 10, 12, 14],
    [0, 2, 10],
    [3, 6, 11, 14],
    [15],
  ],
  rock: [
    [0, 8, 10],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 8, 10],
    [6, 14],
    [0],
  ],
  punk: [
    [0, 3, 9, 12],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 3, 9, 12],
    [7, 15],
    [0],
  ],
  dub: [[8], [4, 12], [2, 6, 10, 14], [0, 7, 10], [3, 11], [14]],
  jazz: [
    [0, 10],
    [4, 11],
    [0, 4, 6, 8, 12, 14],
    [0, 4, 8, 12],
    [3, 7, 11, 15],
    [14],
  ],
  sparse: [[0], [8], [2, 10], [0, 11], [7], [14]],
  glitch: [
    [0, 3, 10, 14],
    [5, 12],
    [0, 1, 6, 9, 10, 15],
    [0, 6, 13],
    [2, 7, 11, 15],
    [3, 14],
  ],
  tresillo: [
    [0, 6, 12],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 6, 12],
    [0, 6, 12],
    [15],
  ],
  motorik: [
    [0, 4, 8, 12],
    [4, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 4, 8, 12],
    [3, 11],
    [15],
  ],
  euclid: [
    [0, 6, 11],
    [3, 9, 14],
    [0, 3, 6, 9, 12],
    [0, 5, 10, 15],
    [0, 4, 8, 12],
    [7, 13],
  ],
};
const PALETTES = {
  classic: ["kick808", "clap808", "hatClosed", "bass1", "cowbell", "glock"],
  hard: ["kickHard", "snareHard", "hatClosed", "bassDrop", "click", "scratch"],
  og: ["ogKick", "ogSnare", "hatClosed", "wobble", "cowbell", "woop"],
  minimal: ["kick808", "clap808", "hatClosed", "bass2", "click", "glock"],
  wood: ["kick808", "snare808", "hatClosed", "bass3", "cowbell", "glock"],
  industrial: ["kickHard", "snareHard", "click", "bass2", "cowbell", "scratch"],
  soft: ["ogKick2", "ogSnare", "hatClosed", "bass1", "click", "glock"],
  electro: ["kick808", "snare808", "hatClosed", "bass3", "clap808", "woop"],
  dub: ["ogKick", "snare808", "hatClosed", "ogBass", "cowbell", "scratch"],
  live: ["kickHard", "ogSnare", "hatClosed", "bass1", "cowbell", "crash"],
};

// name | genre | BPM | groove | palette | swing | optional short loop
const STYLES = `
Ordinal House|House|124|four|classic|0
Deep Block Shuffle|House|120|four|soft|20
Jackin Inscription|House|126|funk|og|12
Microhouse Clicks|Microhouse|122|glitch|minimal|15
Dub House Echoes|Dub House|118|four|dub|8
Outsider Loft|House|115|broken|wood|18
French Chain Disco|Disco|118|disco|classic|0
Cosmic Disco Drift|Disco|110|disco|soft|6|stepMelody
Nu Disco Cowbell|Disco|116|funk|wood|8
Italo Neon|Italo Disco|122|four|electro|0
Balearic Sunset|Balearic|100|tresillo|soft|8|stepMelody
Slow Motion Boogie|Boogie|106|funk|og|12
Warehouse Proof|Techno|134|four|hard|0
Detroit Circuit|Techno|130|electro|electro|4
Dub Techno Cathedral|Dub Techno|124|four|dub|0
Hypnotic Click Tunnel|Minimal Techno|132|euclid|minimal|0
Industrial Furnace|Industrial|142|motorik|industrial|0
Hardgroove Cowbell|Hardgroove|145|funk|hard|6
Acid Inscription|Acid|128|electro|og|0
Acid Break Transmission|Acid Breaks|136|broken|electro|0|eightBit
Trance Gate|Trance|138|four|classic|0
Psytrance Clockwork|Psytrance|146|motorik|electro|0
Goa Bell Spiral|Goa|144|euclid|wood|0
Hardcore Blockstorm|Hardcore|180|four|hard|0
Gabber Foundry|Gabber|190|motorik|industrial|0
Electro Ledger|Electro|128|electro|electro|0
Miami Inscription Bass|Miami Bass|132|electro|hard|0
Freestyle Bell Radio|Freestyle|116|clave|classic|6
Synthwave Night Drive|Synthwave|98|rock|electro|0
EBM Machine March|EBM|126|motorik|industrial|0
New Beat Basement|New Beat|108|four|hard|0
Boom Bap Archive|Hip-Hop|90|hiphop|hard|14
Dusty Head Nod|Lo-Fi|76|hiphop|soft|28
Jazz Hop Lantern|Jazz Hop|84|jazz|wood|22
Instrumental MPC Swing|Hip-Hop|94|funk|og|18
Abstract Scratch Collage|Abstract Hip-Hop|82|glitch|dub|16
Trip Hop Subterranean|Trip-Hop|72|broken|dub|15
Trap Inscription|Trap|140|halftime|hard|0
Southern Roll Call|Trap|136|halftime|classic|6
Drill Dark Corners|Drill|144|drill|hard|10
Cloud Rap Glass|Cloud Rap|130|halftime|soft|0
Memphis Cowbell|Phonk|150|halftime|wood|6
Drift Phonk Hardline|Phonk|165|four|hard|0
Grime Square Wave|Grime|140|electro|og|0
UK Garage Shuffle|UK Garage|132|garage|classic|24
Speed Garage Pressure|Speed Garage|138|four|dub|18
Bassline Night Bus|Bassline|136|garage|og|16
UK Funky Lanterns|UK Funky|130|afro|wood|10
Dubstep Halfstep|Dubstep|140|halftime|dub|0
Future Garage Rain|Future Garage|130|garage|soft|22
Jungle Inscription Chop|Jungle|170|jungle|hard|6|eightBit
Ragga Jungle Signal|Jungle|172|jungle|dub|8|stepDrums
Liquid Chain Flow|Drum & Bass|174|dnb|soft|0
Neurofunk Machine|Neurofunk|176|dnb|industrial|0
Autonomic Halftime|Halftime DnB|170|halftime|minimal|10
Breakcore Fragments|Breakcore|188|glitch|hard|0|eightBit
Big Beat Scratch Attack|Big Beat|128|broken|hard|0|stepDrums
Nu Skool Breaks|Breakbeat|134|broken|electro|0
Florida Electro Breaks|Breakbeat|132|electro|og|0
8 Bit Break Lab|Chiptune|105|broken|classic|0|eightBit
Chip Rave Protocol|Chiptune|150|jungle|electro|0|eightBit
Footwork Block Dance|Footwork|160|footwork|classic|0
Juke Scratch Grid|Juke|158|footwork|hard|0
Jersey Club Bounce|Jersey Club|138|tresillo|og|0
Baltimore Club Cut|Baltimore Club|130|broken|hard|0|stepDrums
Baile Funk Tambor|Baile Funk|130|tresillo|wood|0
Dembow Ordinal|Reggaeton|96|dembow|classic|0
Slow Perreo|Reggaeton|88|dembow|dub|4
Dancehall Chain Riddim|Dancehall|100|dancehall|dub|10
Dub One Drop|Dub|76|dub|dub|12
Roots Steppers|Reggae|84|four|wood|8
Digital Dub Laboratory|Dub|68|sparse|dub|0
Afrobeats Block Party|Afrobeats|108|afro|og|12
Afro House Cowbell|Afro House|122|afro|wood|6
Amapiano Log Conversations|Amapiano|112|log|wood|14
Gqom Shadow Pulse|Gqom|126|tresillo|industrial|0
Kuduro Circuit|Kuduro|140|afro|hard|0
Kwaito Late Night|Kwaito|104|four|dub|12
Samba Chain Parade|Samba|105|samba|live|6
Bossa Click Terrace|Bossa Nova|128|clave|soft|8
Salsa Bell Exchange|Salsa|100|clave|wood|0
Cumbia Digital|Cumbia|96|tresillo|wood|12
Mambo Ordinal Club|Mambo|110|clave|classic|4
Latin Broken Soul|Latin Fusion|116|broken|og|12
Funky Inscription Drummer|Funk|104|funk|live|10
Neo Soul Pocket|Neo-Soul|82|funk|soft|26
Jazz Ride Reimagined|Jazz|126|jazz|wood|28
Rock Blockchain|Rock|120|rock|live|0
Punk D Block|Punk|180|punk|hard|0
Krautrock Motorik|Krautrock|124|motorik|live|0
Ambient Glock Constellation|Ambient|64|sparse|soft|0
Downtempo Ordinal Garden|Downtempo|88|broken|wood|16|stepMelody
IDM Broken Geometry|IDM|118|glitch|minimal|12
Glitch Click Orchestra|Glitch|102|glitch|industrial|0
Euclidean Bell Weave|Polymetric|116|euclid|wood|0
Experimental Scratch Ritual|Experimental|92|euclid|dub|18
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));

function lanePattern(positions, lane, variant) {
  const steps = Array(64).fill(".");
  for (let bar = 0; bar < 4; bar++)
    for (const step of positions)
      steps[bar * 16 + step] =
        (lane === 0 && step % 4 === 0) ||
        (lane === 1 && [4, 8, 12].includes(step))
          ? "X"
          : "x";
  // Individual four-bar turnarounds, with quiet ghost notes left unaccented.
  if (lane === 0) {
    steps[48 + (variant % 4) * 3 + 1] = "x";
  }
  if (lane === 1) {
    steps[48 + ((variant * 3 + 5) % 16)] = "x";
  }
  if (lane === 2) {
    steps[60 + (variant % 4)] = "x";
    if (variant % 3 === 0) steps[62] = "x";
  }
  if (lane === 3) {
    steps[32 + ((variant * 5) % 16)] = "x";
  }
  if (lane === 4) {
    steps[16 + ((variant * 7) % 16)] = "x";
  }
  if (lane === 5) {
    steps.fill(".");
    steps[16 + Math.floor(variant / 16)] = "x";
    steps[48 + ((variant * 3) % 16)] = "x";
  }
  return steps.join("");
}

// L1 grooves: 96 full tracks (kick, backbeat, hats, bass, percussion and colour lanes).
export const L1_BEAT_PRESETS = STYLES.map(
  ([name, genre, bpmText, groove, palette, swingText, loop], variant) => {
    const bpm = Number(bpmText),
      swing = Number(swingText),
      keys = PALETTES[palette];
    const dark = ["hard", "industrial"].includes(palette),
      space = ["dub", "soft", "minimal"].includes(palette);
    const channels = keys.map((key, lane) => {
      const sound = L1_SAMPLES[key];
      const channel = {
        ...sound,
        pattern: lanePattern(GROOVES[groove][lane], lane, variant),
        volume: [0.8, 0.62, 0.3, 0.46, 0.3, 0.25][lane],
        pitch: 1,
        fx: {},
      };
      if (lane === 0 && key === "kick808") channel.trimSeconds = [0, 0.45];
      if (lane === 3) {
        channel.trimSeconds = key === "bassDrop" ? [1.5, 2.15] : [0, 0.28];
        channel.pitch = [1, Math.pow(2, -5 / 12), Math.pow(2, 3 / 12)][
          variant % 3
        ];
        channel.fx = {
          filter: "lp",
          cutoff: dark ? 700 : 1500,
          drive: dark ? 0.25 : 0.08,
        };
        channel.notes = [0, 0, 7, 3, 0, -5, 7, 0];
      }
      if (lane === 5) {
        channel.trimSeconds = [
          0,
          key === "crash"
            ? 1.2
            : key === "scratch"
              ? 0.3
              : key === "glock"
                ? 0.6
                : 0.35,
        ];
        channel.fx = { delay: space ? 0.25 : 0.1, reverb: space ? 0.3 : 0.08 };
        channel.reverse = key === "scratch" && variant % 2 === 1;
      }
      if (lane === 4) channel.fx = { delay: space ? 0.14 : 0 };
      if (lane === 1 && dark) channel.fx = { drive: 0.18 };
      return channel;
    });
    if (loop) {
      const sound = L1_SAMPLES[loop];
      const interval = sound.loopBeats * 4;
      channels.push({
        ...sound,
        pattern: Array.from({ length: 64 }, (_, i) =>
          i % interval === 0 ? "x" : ".",
        ).join(""),
        volume: loop === "stepMelody" ? 0.23 : 0.2,
        pitch: bpm / sound.sourceBpm,
        fx: { filter: "hp", cutoff: loop === "stepMelody" ? 200 : 500 },
      });
    }
    return {
      id: `l1-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      genre,
      bpm,
      swing,
      bars: 4,
      collection: "l1",
      channels,
      description: `${groove === "sparse" ? "Spacious" : groove === "euclid" ? "Interlocking" : swing ? "Swung" : "Straight"} four-bar ${genre.toLowerCase()} groove · ${loop ? "tempo-matched short loop + " : ""}OB1 and OG single hits · editable bass notes and turnaround.`,
    };
  },
);


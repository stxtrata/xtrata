// starter-mix.mjs — the production side of the starter songs: which plugins sit on which part,
// by genre family. Pure data, no browser. tools/make-starters.mjs applies it after the parts are
// loaded and before the levels are measured.
//
//   drums   a chain for each kind of drum channel (kick, snare/clap, hats/shakers, other percussion)
//   parts   a chain for lead, keys, pad and bass
//   returns the project's shared delay / reverb settings (the sends' own amounts stay in
//           starter-songs.mjs, per part)
//
// A chain is a list of [pluginType, params]. Plugin ids and parameters are those in
// daw/js/plugins.js (eq3 Orderbook, comp Hashpool, opto Stablecoin, clipper Wick, tape Immutable,
// transient Breakout, chorus Replica ...). What each chain is for:
//   kick    low shelf for weight, scoop the boxy 300 Hz, a little click, then compress + soft-clip the
//           peak so the kick can be loud without eating the headroom
//   snare   punch (transient), body + snap EQ, compress, soft-clip
//   hats    high-pass so they stop adding mud, a touch of top
//   bass    high-pass the rumble, shelf up the low end, tape saturation (adds harmonics and the
//           60-100 Hz "head bump"), then compress so every note is the same weight
//   keys/pad/lead  high-pass out of the bass's way, compress the lead, chorus for width
const FAMILY = {
  "deep-house": "club", "peak-techno": "club", "uk-garage": "club", trap: "club", amapiano: "club",
  dubstep: "club", reggaeton: "club", jungle: "club", synthpop: "club", disco: "club",
  dub: "dub", "boom-bap": "hiphop", "lofi-rain": "hiphop",
  rock: "band", gospel: "band", afrobeat: "band", welcome: "band",
  jazz: "acoustic", bossa: "acoustic", cinematic: "acoustic",
};
// knobs per family: weight of the low end, how hard the drums are squeezed, saturation, width
const FAM = {
  club:     { kickLow: 4,   kickBox: -3, kickClip: 9, snareClip: 8, bassLow: 4,   bassTape: 8, bump: 3,   bassThr: -22, width: 1,   delaySpread: 0.55, hatCut: 350 },
  dub:      { kickLow: 4,   kickBox: -2, kickClip: 7, snareClip: 7, bassLow: 5,   bassTape: 9, bump: 4,   bassThr: -22, width: 0.8, delaySpread: 0.8,  hatCut: 400 },
  hiphop:   { kickLow: 4,   kickBox: -3, kickClip: 8, snareClip: 8, bassLow: 4.5, bassTape: 9, bump: 3.5, bassThr: -22, width: 0.7, delaySpread: 0.4,  hatCut: 400 },
  band:     { kickLow: 3.5, kickBox: -3, kickClip: 8, snareClip: 8, bassLow: 4.5, bassTape: 7, bump: 3,   bassThr: -22, width: 0.8, delaySpread: 0.4,  hatCut: 300 },
  acoustic: { kickLow: 3,   kickBox: -2, kickClip: 6, snareClip: 6, bassLow: 5,   bassTape: 6, bump: 3,   bassThr: -22, width: 0.7, delaySpread: 0.3,  hatCut: 250 },
};

export const familyOf = (song) => FAMILY[song.id] || "band";

const kickChain = (f) => [
  ["eq3", { lowCutSlope: "12", lowCut: 28, low: f.kickLow, lowFreq: 60, mid: f.kickBox, midFreq: 320, midQ: 1.2, high: 1.5, highFreq: 3500 }],
  ["comp", { threshold: -16, ratio: 4, attack: 0.02, release: 0.12, knee: 6, autoMakeup: "on" }],
  ["clipper", { drive: f.kickClip, ceiling: -3, knee: 0.5, shape: "soft" }],
];
const snareChain = (f) => [
  ["transient", { attack: 25, sustain: 0, speed: 0.5 }],
  ["eq3", { lowCutSlope: "12", lowCut: 110, mid: 2, midFreq: 220, midQ: 1, high: 2.5, highFreq: 6000 }],
  ["comp", { threshold: -18, ratio: 3, attack: 0.01, release: 0.15, knee: 6, autoMakeup: "on" }],
  ["clipper", { drive: f.snareClip, ceiling: -4, knee: 0.5, shape: "soft" }],
];
const hatChain = (f) => [
  ["eq3", { lowCutSlope: "12", lowCut: f.hatCut, high: 1.5, highFreq: 9000 }],
];
const percChain = () => [
  ["eq3", { lowCutSlope: "12", lowCut: 160, high: 1, highFreq: 6000 }],
];
const lowPercChain = () => [
  ["eq3", { lowCutSlope: "12", lowCut: 70, low: 1.5, lowFreq: 100 }],
];

// channel role -> chain. Roles come from the Analog Kit grooves (K kick, S/S2/SS/C snares and claps,
// H/HH/HT/O hats, SH/TB shakers, R rim, CG/BD/T*/F* toms and congas, CR crash).
export function drumChain(song, role) {
  const f = FAM[familyOf(song)];
  if (/^K\d*$/.test(role)) return kickChain(f);
  if (/^(S|S\d|SS|C|C\d|RS)$/.test(role)) return snareChain(f);
  if (/^(H|HH|HT|O|CR|SH|TB)$/.test(role)) return hatChain(f);
  if (/^(T\d|F\d|CG|BD)$/.test(role)) return lowPercChain();
  return percChain();
}

export function partChain(song, role) {
  const f = FAM[familyOf(song)];
  switch (role) {
    case "bass":
      return [
        ["eq3", { lowCutSlope: "12", lowCut: 28, low: f.bassLow, lowFreq: 80, mid: -2, midFreq: 300, midQ: 1, high: -2, highFreq: 4000 }],
        ["tape", { drive: f.bassTape, bump: f.bump, bumpFreq: "60", hfLoss: 9000, mix: 0.7 }],
        ["comp", { threshold: f.bassThr, ratio: 4, attack: 0.02, release: 0.15, knee: 6, autoMakeup: "on" }],
      ];
    case "keys":
      return [
        ["eq3", { lowCutSlope: "12", lowCut: 180, mid2: -1.5, mid2Freq: 450, mid2Q: 1 }],
        ["chorus", { rate: 0.6, depth: 3, mix: 0.3 * f.width, voices: "2", width: f.width }],
      ];
    case "pad":
      return [
        ["eq3", { lowCutSlope: "24", lowCut: 220 }],
        ["chorus", { rate: 0.3, depth: 5, mix: 0.4 * f.width, voices: "3", width: f.width }],
      ];
    case "lead":
      return [
        ["eq3", { lowCutSlope: "12", lowCut: 200, high: 1.5, highFreq: 5000 }],
        ["opto", { peakRed: 30, gain: 50, mode: "compress", mix: 1 }],
      ];
    default:
      return [];
  }
}

export function returnsFor(song) {
  const f = FAM[familyOf(song)];
  return { delay: { spread: f.delaySpread } };
}

// Reverb sends on the drum channels (the parts' own sends stay in starter-songs.mjs). Snares and claps
// get a short room so they sit in the track instead of on top of it; toms and congas a little less.
const DRUM_VERB = { club: 0.14, dub: 0.2, hiphop: 0.1, band: 0.14, acoustic: 0.18 };
export function drumSends(song, role) {
  const v = DRUM_VERB[familyOf(song)];
  if (/^(S|S\d|SS|C|C\d|RS)$/.test(role)) return { reverb: v };
  if (/^(T\d|F\d|CG|BD)$/.test(role)) return { reverb: v * 0.6 };
  return {};
}

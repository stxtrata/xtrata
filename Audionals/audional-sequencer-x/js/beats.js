// beats.js — pre-programmed drum patterns across genres/styles/tempos.
// Each preset defines a kit (OB1 on-chain samples and/or on-board synth drums,
// with optional per-channel volume/pitch/fx) plus step patterns.
//
// Pattern DSL: strings of 16 chars per bar; '.'=off, 'x'=on, 'X'=accent.
// 1/2/4-bar patterns are tiled to fill the 64-step sequence.

import { NUM_STEPS } from './state.js';

// OB1 inscription IDs (Ordinal Based 1s)
export const OB1 = {
  kick808:   'e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0',
  snare808:  'ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0',
  hatClosed: 'd030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0',
  clap808:   '3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0',
  crash:     '5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0',
  bass1:     'ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0',
  bass2:     '91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0',
  bass3:     '1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0',
  kickHard:  '437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0',
  snareHard: '3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0',
  click:     '1bda678460ef08fb64435b57c9b69fd78fd4556822ccd8e9839b4eb71b3621edi0',
  scratch:   '228947e9fc52e44d3a22e84aed7bbaeff08d60c5f925aa6be7e265d210425c28i0',
  glock:     '578aa9d3b29ceceafc659ecee22cb7ef1a063ba5b71474db8fe84949746cdeefi0',
  cowbell:   '3e5fe7bc10e37a145a75f7ddd71debd9079b05568c5b9c5e6b4de3d959a4c46bi0',
  bassDrop:  'b77fb3b299477ca55ab2626dbbc12c0d5fa9d4cf51ae00850caae6e36baef745i0'
};

const ob1 = (id, label) => ({ type: 'ordinal', value: id, label });
const syn = (key, label) => ({ type: 'synth', value: key, label });

// Expand pattern string(s) to a NUM_STEPS array of 0/1/2.
export function expandPattern(str) {
  const flat = str.replace(/[\s|]/g, '');
  const out = new Array(NUM_STEPS).fill(0);
  if (!flat.length) return out;
  for (let i = 0; i < NUM_STEPS; i++) {
    const c = flat[i % flat.length];
    out[i] = c === 'X' ? 2 : c === 'x' ? 1 : 0;
  }
  return out;
}

// ch: { source, pattern, name?, volume?, pitch?, fx? }
export const BEAT_PRESETS = [
  // ---------------------------------------------------------------- HOUSE / DISCO
  {
    name: 'Classic House', genre: 'House', bpm: 124, bars: 1,
    channels: [
      { source: ob1(OB1.kick808, '808 Kick'), pattern: 'X...x...X...x...' },
      { source: ob1(OB1.clap808, '808 Clap'), pattern: '....x.......x...' },
      { source: ob1(OB1.hatClosed, 'Closed Hat'), pattern: '..x...x...x...x.' },
      { source: syn('hat-open', 'Open Hat'), pattern: '..x...x...x...x.', volume: 0.5 }
    ]
  },
  {
    name: 'Deep House Shuffle', genre: 'House', bpm: 122, swing: 18, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X...x...X...x...|X...x...X...x.x.' },
      { source: syn('clap-909', 'Clap'), pattern: '....x.......x...', fx: { reverb: 0.25 } },
      { source: syn('hat-tight', 'Hat'), pattern: 'x.xxx.x.x.xxx.x.' },
      { source: syn('shaker', 'Shaker'), pattern: '..x...x...x...xx', volume: 0.6 },
      { source: syn('bass-808-a', 'Bass A'), pattern: '..x.....x....x..', fx: { filter: 'lp', cutoff: 900 } }
    ]
  },
  {
    name: 'French Filter Disco', genre: 'Disco', bpm: 118, bars: 1,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X...x...X...x...' },
      { source: ob1(OB1.snare808, 'Snare'), pattern: '....x.......x...', fx: { filter: 'hp', cutoff: 500 } },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.' },
      { source: syn('hat-open', 'Open Hat'), pattern: '..x...x...x...x.', volume: 0.55, fx: { filter: 'lp', cutoff: 6000 } },
      { source: syn('cowbell-808', 'Bell'), pattern: '.......x.......x', volume: 0.35, fx: { delay: 0.3 } }
    ]
  },
  // ---------------------------------------------------------------- TECHNO / ELECTRO
  {
    name: 'Warehouse Techno', genre: 'Techno', bpm: 132, bars: 1,
    channels: [
      { source: syn('kick-hard', 'Kick'), pattern: 'X...X...X...X...', fx: { drive: 0.3 } },
      { source: syn('hat-closed', 'Hat'), pattern: '..x...x...x...x.' },
      { source: syn('clap-909', 'Clap'), pattern: '....x.......x...', fx: { reverb: 0.35 } },
      { source: syn('ride', 'Ride'), pattern: 'x...x...x...x...', volume: 0.4 },
      { source: syn('zap', 'Zap'), pattern: '..............x.', volume: 0.5, fx: { delay: 0.45 } }
    ]
  },
  {
    name: 'Rumble Techno', genre: 'Techno', bpm: 138, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Sub Kick'), pattern: 'X...X...X...X...', fx: { drive: 0.5 } },
      { source: syn('kick-punch', 'Rumble'), pattern: '.xxx.xxx.xxx.xxx', volume: 0.35, fx: { filter: 'lp', cutoff: 300, reverb: 0.3 } },
      { source: syn('hat-tight', 'Hat'), pattern: '..x...x...x...x.' },
      { source: syn('rimshot', 'Rim'), pattern: '......x.......x.|....x.......x...', volume: 0.6, fx: { delay: 0.3 } }
    ]
  },
  {
    name: 'Electro 808', genre: 'Electro', bpm: 128, bars: 2,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X..x..x...X..x..|X..x..x...x.X...' },
      { source: ob1(OB1.snare808, 'Snare'), pattern: '....x.......x...' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.xxx.x.x.x.' },
      { source: ob1(OB1.cowbell, 'Cowbell'), pattern: '.......x......x.', volume: 0.5 },
      { source: syn('zap', 'Laser'), pattern: '............x...', volume: 0.6, fx: { delay: 0.4 } }
    ]
  },
  {
    name: 'Miami Bass', genre: 'Electro', bpm: 130, bars: 2,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X......x..x.....|X....x....x...x.' },
      { source: ob1(OB1.clap808, 'Clap'), pattern: '....x.......x...' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.xxx.x.xx.xx.xx' },
      { source: syn('bass-808-e', '808 Bass'), pattern: 'x......x..x.....', fx: { drive: 0.35 } },
      { source: ob1(OB1.scratch, 'Scratch'), pattern: '..........x.....', volume: 0.7 }
    ]
  },
  {
    name: 'Acid Line Groove', genre: 'Electro', bpm: 126, bars: 1,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X...x..X..x.X...' },
      { source: syn('snare-tight', 'Snare'), pattern: '....x.......x...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'xxxxxxxxxxxxxxxx', volume: 0.45 },
      { source: syn('bass-808-dist', 'Acid Bass'), pattern: 'x..x..x.x..x.x..', fx: { filter: 'lp', cutoff: 1400, drive: 0.5 } }
    ]
  },
  // ---------------------------------------------------------------- HIP-HOP / TRAP
  {
    name: 'Boom Bap', genre: 'Hip-Hop', bpm: 90, swing: 12, bars: 2,
    channels: [
      { source: ob1(OB1.kickHard, 'Kick'), pattern: 'X.....x...x.....|X...x.....x.....' },
      { source: ob1(OB1.snareHard, 'Snare'), pattern: '....X.......X...' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.' },
      { source: ob1(OB1.scratch, 'Scratch'), pattern: '..............x.', volume: 0.6 }
    ]
  },
  {
    name: 'Lo-Fi Head Nod', genre: 'Hip-Hop', bpm: 78, swing: 25, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X......x..x.....|X.....x...x.....', fx: { filter: 'lp', cutoff: 2500 } },
      { source: syn('snare-fat', 'Snare'), pattern: '....X.......X...', fx: { filter: 'lp', cutoff: 4000, reverb: 0.2 } },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.x.x.x.x.xx', volume: 0.5, fx: { filter: 'lp', cutoff: 6000 } },
      { source: syn('shaker', 'Shaker'), pattern: '..x...x...x...x.', volume: 0.4 }
    ]
  },
  {
    name: 'Trap 808', genre: 'Trap', bpm: 140, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Kick'), pattern: 'X.....x.....x...|X.......x.x.....' },
      { source: syn('snare-tight', 'Snare'), pattern: '........X.......' },
      { source: syn('hat-closed', 'Hats'), pattern: 'x.x.x.x.x.x.xxxx|x.x.xxx.x.x.x.x.' },
      { source: syn('hat-open', 'Open'), pattern: '......x.........', volume: 0.5 },
      { source: syn('bass-808-e', '808'), pattern: 'x.....x.....x...', fx: { drive: 0.4 } }
    ]
  },
  {
    name: 'Drill Slide', genre: 'Trap', bpm: 144, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Kick'), pattern: 'X.....x..x......|X.....x......x..' },
      { source: syn('snare-tight', 'Snare'), pattern: '........X.....X.|........X.......' },
      { source: syn('hat-closed', 'Hats'), pattern: 'x..x..x.x..x.x..' },
      { source: syn('bass-808-g', '808 G'), pattern: 'x.....x..x......', fx: { drive: 0.3 } }
    ]
  },
  // ---------------------------------------------------------------- DNB / JUNGLE / BREAKS
  {
    name: 'DnB Two-Step', genre: 'Drum & Bass', bpm: 174, bars: 2,
    channels: [
      { source: syn('kick-punch', 'Kick'), pattern: 'X.........x.....|X.......x.......' },
      { source: syn('snare-tight', 'Snare'), pattern: '....X.......X...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 },
      { source: syn('shaker', 'Shaker'), pattern: '.x.x.x.x.x.x.x.x', volume: 0.35 },
      { source: ob1(OB1.bassDrop, 'Sub Drop'), pattern: 'x...............', fx: { filter: 'lp', cutoff: 400 } }
    ]
  },
  {
    name: 'Jungle Chop', genre: 'Jungle', bpm: 170, bars: 2,
    channels: [
      { source: syn('kick-punch', 'Kick'), pattern: 'X.........x..x..|X.....x.........' },
      { source: syn('snare-tight', 'Snare'), pattern: '....X..x....X..x|....X.x...x.X...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.xxx.x.xx.xx.x.', volume: 0.45 },
      { source: syn('ride', 'Ride'), pattern: '..x...x...x...x.', volume: 0.3 }
    ]
  },
  {
    name: 'Big Beat Break', genre: 'Breakbeat', bpm: 128, bars: 2,
    channels: [
      { source: ob1(OB1.kickHard, 'Kick'), pattern: 'X.....x...x.....|X..x......x.....', fx: { drive: 0.3 } },
      { source: ob1(OB1.snareHard, 'Snare'), pattern: '....X.......X..x' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.' },
      { source: ob1(OB1.crash, 'Crash'), pattern: 'x...............', volume: 0.6 },
      { source: ob1(OB1.scratch, 'Scratch'), pattern: '..........x...x.', volume: 0.7 }
    ]
  },
  {
    name: 'UK Garage 2-Step', genre: 'Garage', bpm: 132, swing: 20, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X.......x.x.....|X.....x.........' },
      { source: syn('snare-tight', 'Snare'), pattern: '....X.......X...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.xxx.x.x.x.', volume: 0.55 },
      { source: syn('hat-open', 'Open'), pattern: '..x.......x.....', volume: 0.4 },
      { source: syn('rimshot', 'Rim'), pattern: '.......x......x.', volume: 0.5 }
    ]
  },
  {
    name: 'Dubstep Half-Time', genre: 'Dubstep', bpm: 140, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Kick'), pattern: 'X.........x.....|X......x........' },
      { source: syn('snare-fat', 'Snare'), pattern: '........X.......', fx: { reverb: 0.3 } },
      { source: syn('hat-closed', 'Hat'), pattern: '..x...x...x...x.', volume: 0.5 },
      { source: ob1(OB1.bassDrop, 'Wub'), pattern: 'x.......x.......', fx: { filter: 'lp', cutoff: 700, drive: 0.4 } }
    ]
  },
  {
    name: 'Footwork 160', genre: 'Footwork', bpm: 160, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X..X..X...X..X..|X..X..X.X...X...' },
      { source: syn('clap-909', 'Clap'), pattern: '........x.......' },
      { source: syn('hat-tight', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.45 },
      { source: syn('bass-808-a', 'Bass'), pattern: 'x..x......x.....', fx: { filter: 'lp', cutoff: 800 } }
    ]
  },
  // ---------------------------------------------------------------- LATIN / WORLD
  {
    name: 'Reggaeton Dembow', genre: 'Reggaeton', bpm: 95, bars: 1,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X...X...X...X...' },
      { source: ob1(OB1.snare808, 'Snare'), pattern: '...x..x....x..x.' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.55 },
      { source: syn('shaker', 'Shaker'), pattern: '..x...x...x...x.', volume: 0.4 }
    ]
  },
  {
    name: 'Dancehall Riddim', genre: 'Dancehall', bpm: 100, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X.......x.X.....|X.......x.X...x.' },
      { source: syn('rimshot', 'Rim'), pattern: '...x......x.....', volume: 0.8 },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 },
      { source: syn('clap-909', 'Clap'), pattern: '..........X.....', fx: { reverb: 0.3 } }
    ]
  },
  {
    name: 'Afrobeats Bounce', genre: 'Afrobeats', bpm: 108, swing: 10, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X..x....x..x....|X..x....x...x...' },
      { source: syn('rimshot', 'Rim'), pattern: '....x..x....x...', volume: 0.8 },
      { source: syn('shaker', 'Shaker'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 },
      { source: syn('tom-mid', 'Tom'), pattern: '.......x......x.', volume: 0.55 },
      { source: syn('cowbell-808', 'Bell'), pattern: '..x.......x.....', volume: 0.35 }
    ]
  },
  {
    name: 'Amapiano Log Drum', genre: 'Amapiano', bpm: 112, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Kick'), pattern: '........x.......|....x.......x...', volume: 0.8 },
      { source: syn('shaker', 'Shaker'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 },
      { source: syn('rimshot', 'Rim'), pattern: '....x.......x...', volume: 0.7 },
      { source: syn('bass-808-g', 'Log Drum'), pattern: 'x..x..x...x..x..', pitch: 1.5, fx: { drive: 0.35, filter: 'lp', cutoff: 1200 } }
    ]
  },
  {
    name: 'Samba Batucada', genre: 'Latin', bpm: 105, bars: 2,
    channels: [
      { source: syn('kick-sub', 'Surdo'), pattern: '..X...X...X...X.' },
      { source: syn('tom-lo', 'Surdo 2'), pattern: 'X...............', volume: 0.8 },
      { source: syn('shaker', 'Ganza'), pattern: 'xxxxxxxxxxxxxxxx', volume: 0.4 },
      { source: syn('rimshot', 'Tamborim'), pattern: 'x..x..x..xx..x..', volume: 0.7 },
      { source: syn('snare-tight', 'Caixa'), pattern: 'x.xx.x.xx.xx.x.x', volume: 0.45 }
    ]
  },
  {
    name: 'Bossa Nova Rim', genre: 'Latin', bpm: 130, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X..x..X.X..x..X.', volume: 0.7 },
      { source: syn('rimshot', 'Rim Clave'), pattern: 'x..x..x...x..x..|..x..x..x..x....', volume: 0.85 },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.4 },
      { source: syn('shaker', 'Shaker'), pattern: '.x.x.x.x.x.x.x.x', volume: 0.3 }
    ]
  },
  {
    name: 'Latin Freestyle Bell', genre: 'Latin', bpm: 115, bars: 1,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X..x..x.X...x...' },
      { source: ob1(OB1.clap808, 'Clap'), pattern: '....x.......x...' },
      { source: ob1(OB1.cowbell, 'Cowbell'), pattern: 'x..x.x..x..x.x..', volume: 0.6 },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.45 }
    ]
  },
  // ---------------------------------------------------------------- ROCK / FUNK
  {
    name: 'Rock Steady', genre: 'Rock', bpm: 120, bars: 1,
    channels: [
      { source: syn('kick-punch', 'Kick'), pattern: 'X.......x.x.....' },
      { source: syn('snare-rock', 'Snare'), pattern: '....X.......X...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.' },
      { source: syn('crash', 'Crash'), pattern: 'x...............', volume: 0.5 }
    ]
  },
  {
    name: 'Punk D-Beat', genre: 'Punk', bpm: 180, bars: 1,
    channels: [
      { source: syn('kick-punch', 'Kick'), pattern: 'X..x.....X..x...', fx: { drive: 0.4 } },
      { source: syn('snare-rock', 'Snare'), pattern: '....X.......X...', fx: { drive: 0.3 } },
      { source: syn('hat-open', 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 }
    ]
  },
  {
    name: 'Funky Drummer', genre: 'Funk', bpm: 105, swing: 8, bars: 2,
    channels: [
      { source: syn('kick-punch', 'Kick'), pattern: 'X.x.......x..x..|X.x.....x.x.....' },
      { source: syn('snare-tight', 'Snare'), pattern: '....X..x.x..X..x|....X..x.x..X...' },
      { source: syn('hat-closed', 'Hat'), pattern: 'xxxxxxxxxxxxxxxx', volume: 0.4 },
      { source: syn('hat-open', 'Open'), pattern: '.......x........', volume: 0.45 }
    ]
  },
  {
    name: 'Disco Funk Glock', genre: 'Funk', bpm: 112, bars: 2,
    channels: [
      { source: ob1(OB1.kick808, 'Kick'), pattern: 'X...x...X...x...' },
      { source: ob1(OB1.snare808, 'Snare'), pattern: '....x.......x...' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.' },
      { source: ob1(OB1.glock, 'Glock'), pattern: 'x.......x....x..', volume: 0.5, fx: { delay: 0.35, reverb: 0.2 } }
    ]
  },
  // ---------------------------------------------------------------- SPARSE / EXPERIMENTAL
  {
    name: 'Ambient Pulse', genre: 'Ambient', bpm: 70, bars: 4,
    channels: [
      { source: syn('kick-sub', 'Pulse'), pattern: 'X.......|........|X.......|....x...'.replace(/\|/g, ''), volume: 0.7, fx: { reverb: 0.5 } },
      { source: syn('shaker', 'Texture'), pattern: '....x.......x...', volume: 0.3, fx: { delay: 0.5, reverb: 0.4 } },
      { source: ob1(OB1.glock, 'Glock'), pattern: '..x.............', volume: 0.4, fx: { delay: 0.6, reverb: 0.5 } }
    ]
  },
  {
    name: 'Minimal Click', genre: 'Minimal', bpm: 125, bars: 2,
    channels: [
      { source: syn('kick-808', 'Kick'), pattern: 'X...x...X...x...' },
      { source: ob1(OB1.click, 'Click'), pattern: '..x..x....x...x.', volume: 0.8, fx: { delay: 0.3 } },
      { source: syn('rimshot', 'Rim'), pattern: '....x.......x...', volume: 0.5 },
      { source: syn('hat-tight', 'Hat'), pattern: '.x.x.x.x.x.x.x.x', volume: 0.35 }
    ]
  },
  {
    name: 'Bitcoin Step Skank', genre: 'Experimental', bpm: 105, bars: 2,
    channels: [
      { source: ob1(OB1.kickHard, 'Kick'), pattern: 'X.....x...x.....' },
      { source: ob1(OB1.snareHard, 'Snare'), pattern: '....X.......X...' },
      { source: ob1(OB1.hatClosed, 'Hat'), pattern: 'x.x.x.x.x.x.x.x.', volume: 0.5 },
      { source: ob1(OB1.bassDrop, 'Drop'), pattern: 'x...............', fx: { filter: 'lp', cutoff: 500 } },
      { source: ob1(OB1.scratch, 'Scratch'), pattern: '..........x...x.', volume: 0.6, fx: { delay: 0.3 } }
    ]
  }
];

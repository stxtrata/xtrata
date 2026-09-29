/*
 * Xtrata Arcade cartridge #9 - ROAD HOPPER (v2)
 *
 * Hop forward through five biomes that cycle as you advance (40 rows each):
 *   SUBURBS -> HIGHWAY -> DOCKS -> RAIL YARD -> WINTER -> (again, a lap faster)
 * Every biome has its own palette, ground art, decorations, lane mix and song.
 *
 * Lane kinds
 *   ground  safe; decorations (trees, houses, crates, snowmen...) block hops
 *   road    cars, vans, trucks, buses, forklifts, snow ploughs
 *   river   ride the logs; SINKING logs bob and go under on a visible cycle;
 *           CROCODILES can be ridden, but not on the head while the jaws open
 *   pads    static lily pads over water; some pads are croc heads
 *   rail    crossing lights + bell for 1.6 s, then a TRAIN comes through
 *   ice     (Winter) you slide one extra tile in the hop direction unless
 *           something blocks it - arrows show where you will end up
 * Every generated row is checked against the row before it, so there is
 * always at least one way forward (see "fairness" below).
 *
 * Coins sit on lanes (quick pickups build a combo). Coins and distance unlock
 * new hopper looks during the run (Z / X cycles through unlocked looks).
 * Close calls with cars and trains earn a bonus. Your best row is marked.
 *
 * Music: one song per biome, crossfaded on entry. Hops walk the scale, road
 * and rail zones force the drums in, water drops them and closes the filter,
 * ice opens a pad. Every 10th row plays a stinger, every 50th a fanfare.
 *
 * Score: 10 per new row + coins (25 + combo) + close-call bonuses.
 * Contract game-id: xa_road_hopper (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-road-hopper');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ constants */
  var W = 420, H = 600;
  var C = 42, COLS = 10;            // tile size / columns
  var HOP = 0.11;                   // seconds per hop
  var SLIDE = 0.1;                  // seconds for the extra ice slide tile
  var HOP_LIFT = 15;                // hop arc height (px)
  var LAND_SQUASH = 0.12;           // seconds of squash after landing
  var BIOME_ROWS = 40;              // rows per biome
  var START_ROWS = 4;               // gentle rows at the start (no hazards, no coins)
  var GENTLE_ROWS = 12;             // no sinking logs / crocs before this row
  var ACCENT = '#39ff88', COIN = '#ffd23f';
  var SINK_CYCLE = 4.8;             // float 0-2.4, bob 2.4-3.4, under 3.4-4.4, rise 4.4-4.8
  var CROC_CYCLE = 3.2;             // closed 0-1.8, warn 1.8-2.3, open (danger) 2.3-3.1
  var TRAIN_WARN = 1.6;             // seconds of lights + bell before a train
  var CLOSE_WINDOW = 0.5;           // seconds after leaving a lane that a pass counts
  var COMBO_WINDOW = 2.5;           // seconds between coins to keep a combo
  var MAX_DUST = 60, MAX_SNOW = 46;
  var FONT = 'ui-monospace, Menlo, Consolas, monospace';

  /* ================================================================ biomes
     mix: [laneKind, weight, minGroup, maxGroup] - a hazard group is followed
     by groundRun ground rows. deco: decoration kinds for ground rows. */
  var BIOMES = [
    { id: 'suburbs', name: 'SUBURBS', sub: 'MIND THE CARS - RIDE THE LOGS',
      mix: [['road', 0.46, 1, 3], ['river', 0.3, 1, 2], ['pads', 0.14, 1, 1], ['rail', 0.1, 1, 1]],
      groundRun: [1, 2], deco: ['tree', 'tree', 'bush', 'house', 'mailbox'], decoMax: 3,
      vehicles: ['car', 'car', 'van', 'sport'], roadSpeed: 1, riverSpeed: 1,
      sink: 0, croc: 0, padCroc: 0, floe: false, song: 0, hopInst: 'marimba',
      pal: { bg: '#0d2416', accent: '#39ff88', groundA: '#4aa35a', groundB: '#439852', groundSide: '#2b6a3a',
        dotA: '#5cbf6c', dotB: '#3a8a48', road: '#3a3c48', roadDot: '#474a57', roadSide: '#24252e', line: '#e9e9ef', edge: '#e9e9ef',
        water: '#2f86c9', waterDark: '#236aa6', shimmer: '#bfe8ff', rail: '#6d6258', railTie: '#4a3b30', railSteel: '#c9ced9',
        railSide: '#453d36', ice: '#bfe3f7', iceSide: '#86b4d4', log: '#8a5a31', logTop: '#a8703f', logEnd: '#d9a86b', pad: '#46b85a', padDark: '#2d8a40' } },
    { id: 'highway', name: 'HIGHWAY', sub: 'FOUR LANES - TRUCKS AND BUSES',
      mix: [['road', 0.76, 2, 5], ['river', 0.1, 1, 1], ['rail', 0.14, 1, 1]],
      groundRun: [1, 2], deco: ['cone', 'barrier', 'lamp', 'sign', 'bush'], decoMax: 3,
      vehicles: ['car', 'truck', 'bus', 'sport', 'van', 'car'], roadSpeed: 1.2, riverSpeed: 1.1,
      sink: 0.2, croc: 0, padCroc: 0, floe: false, song: 1, hopInst: 'pluck',
      pal: { bg: '#141416', accent: '#ffb347', groundA: '#7f9a6a', groundB: '#77915f', groundSide: '#4f6642',
        dotA: '#94ad7d', dotB: '#667f55', road: '#2b2d36', roadDot: '#363945', roadSide: '#1b1c22', line: '#f2f2f2', edge: '#ffd23f',
        water: '#3b7fae', waterDark: '#2c6690', shimmer: '#cfe9ff', rail: '#6d6258', railTie: '#4a3b30', railSteel: '#c9ced9',
        railSide: '#453d36', ice: '#bfe3f7', iceSide: '#86b4d4', log: '#8a5a31', logTop: '#a8703f', logEnd: '#d9a86b', pad: '#46b85a', padDark: '#2d8a40' } },
    { id: 'docks', name: 'DOCKS', sub: 'SINKING LOGS - WATCH THE CROCS',
      mix: [['river', 0.5, 1, 3], ['pads', 0.2, 1, 1], ['road', 0.3, 1, 2]],
      groundRun: [1, 2], deco: ['crate', 'crate', 'bollard', 'bollard', 'container', 'crane'], decoMax: 3,
      vehicles: ['forklift', 'truck', 'van'], roadSpeed: 0.9, riverSpeed: 1.1,
      sink: 0.35, croc: 0.35, padCroc: 0.6, floe: false, song: 2, hopInst: 'marimba',
      pal: { bg: '#07161d', accent: '#3ff0ff', groundA: '#9a6b43', groundB: '#91643e', groundSide: '#5d3d22',
        dotA: '#b07d50', dotB: '#6e4a2b', road: '#5a5f66', roadDot: '#666b73', roadSide: '#3a3e44', line: '#ffd23f', edge: '#ffd23f',
        water: '#1f6f8b', waterDark: '#185a72', shimmer: '#a8f0ff', rail: '#6d6258', railTie: '#4a3b30', railSteel: '#c9ced9',
        railSide: '#453d36', ice: '#bfe3f7', iceSide: '#86b4d4', log: '#7a5030', logTop: '#94643b', logEnd: '#c99a62', pad: '#4fbf62', padDark: '#2f8f45' } },
    { id: 'railyard', name: 'RAIL YARD', sub: 'LIGHTS FLASH - TRAINS FOLLOW',
      mix: [['rail', 0.55, 1, 3], ['road', 0.25, 1, 2], ['river', 0.2, 1, 1]],
      groundRun: [1, 2], deco: ['drum', 'signal', 'crate', 'container', 'drum'], decoMax: 3,
      vehicles: ['van', 'truck', 'car'], roadSpeed: 1, riverSpeed: 1,
      sink: 0.25, croc: 0, padCroc: 0, floe: false, song: 3, hopInst: 'arp',
      pal: { bg: '#18120f', accent: '#ff4d6d', groundA: '#8a7f73', groundB: '#827769', groundSide: '#5a5249',
        dotA: '#a0968a', dotB: '#6a6056', road: '#3a3a40', roadDot: '#45454c', roadSide: '#25252a', line: '#e9e9ef', edge: '#e9e9ef',
        water: '#35708f', waterDark: '#2a5c77', shimmer: '#c2e6ff', rail: '#6b5f55', railTie: '#3e3128', railSteel: '#d3d8e2',
        railSide: '#40372f', ice: '#bfe3f7', iceSide: '#86b4d4', log: '#7a5030', logTop: '#94643b', logEnd: '#c99a62', pad: '#46b85a', padDark: '#2d8a40' } },
    { id: 'winter', name: 'WINTER', sub: 'ICE SLIDES YOU AN EXTRA TILE',
      mix: [['ice', 0.34, 1, 2], ['road', 0.36, 1, 2], ['river', 0.3, 1, 2]],
      groundRun: [1, 2], deco: ['snowman', 'pine', 'pine', 'rock', 'igloo'], decoMax: 3,
      vehicles: ['plow', 'car', 'van'], roadSpeed: 0.9, riverSpeed: 0.95,
      sink: 0.35, croc: 0, padCroc: 0, floe: true, song: 4, hopInst: 'bell',
      pal: { bg: '#0b1624', accent: '#9fe8ff', groundA: '#eef4fb', groundB: '#e3edf7', groundSide: '#a9bfd6',
        dotA: '#ffffff', dotB: '#c7d8ea', road: '#6f7a88', roadDot: '#7d8896', roadSide: '#4d5663', line: '#ffffff', edge: '#ffb347',
        water: '#2d5f8a', waterDark: '#234c70', shimmer: '#e6f6ff', rail: '#6d6258', railTie: '#4a3b30', railSteel: '#c9ced9',
        railSide: '#453d36', ice: '#c4e8fa', iceSide: '#86b4d4', log: '#dfeefa', logTop: '#f4faff', logEnd: '#b5d3ea', pad: '#46b85a', padDark: '#2d8a40' } }
  ];
  function biomeIndexAt(r) { return Math.floor(Math.max(0, r) / BIOME_ROWS) % BIOMES.length; }
  function lapAt(r) { return Math.floor(Math.max(0, r) / (BIOME_ROWS * BIOMES.length)); }
  function difficulty(r) { return 1 + Math.min(1.4, r / 150); }

  /* ================================================================ vehicles */
  var VEHICLES = {
    car: { len: 1.2, h: 10, cabin: 0.5, colors: ['#ff4d6d', '#3ff0ff', '#ffd23f', '#b04dff', '#ff9f1c', '#4d7bff'] },
    sport: { len: 1.3, h: 7, cabin: 0.36, colors: ['#ff2e4d', '#ffe14d', '#2ef0a0'] },
    van: { len: 1.5, h: 16, cabin: 0.26, colors: ['#e8ecf2', '#7fd6ff', '#ffb347'] },
    truck: { len: 2.4, h: 22, cabin: 0.3, colors: ['#4d7bff', '#ff6a3d', '#2fbf71', '#d9d9e0'] },
    bus: { len: 2.8, h: 20, cabin: 0, colors: ['#ffc83d', '#ff5a5a'] },
    forklift: { len: 1.05, h: 11, cabin: 0.45, colors: ['#ffb000', '#ff7a1a'] },
    plow: { len: 1.7, h: 15, cabin: 0.35, colors: ['#ff8c1a', '#ffd23f'] }
  };
  var CONTAINER_COLORS = ['#d9483b', '#2f7fd1', '#2fbf71', '#e8a02e', '#8a55d9', '#d9d9e0'];

  /* ================================================================ characters
     need: unlock rule for this run ({ coins: n } or { row: n }). */
  var CHARACTERS = [
    { id: 'chick', name: 'BLOCK CHICK', need: null, top: '#ffffff', side: '#e2dfcf' },
    { id: 'cat', name: 'ALLEY CAT', need: { coins: 5 }, top: '#ffb86b', side: '#e0802f' },
    { id: 'robot', name: 'HOP-BOT', need: { row: 50 }, top: '#cfd8ea', side: '#8e9ab3' },
    { id: 'frog', name: 'FROGGO', need: { coins: 12 }, top: '#72e072', side: '#3fa84a' },
    { id: 'astro', name: 'ASTRONAUT', need: { row: 100 }, top: '#f4f6fb', side: '#c3cad8' },
    { id: 'penguin', name: 'PENGUIN', need: { row: 170 }, top: '#2f3542', side: '#1c212b' }
  ];
  function charById(id) { for (var i = 0; i < CHARACTERS.length; i++) if (CHARACTERS[i].id === id) return CHARACTERS[i]; return CHARACTERS[0]; }
  function needText(n) { return n.coins ? n.coins + ' COINS' : 'ROW ' + n.row; }

  /* ================================================================ music
     One song per biome. Every song has tracks named kick / hat / clap / pad
     so the lane-zone logic (drums on roads, off on water) works everywhere. */
  function buildSongs() {
    return [
      // SUBURBS: bouncy Bb mixolydian marimba tune (the v1 song)
      { bpm: 112, key: 58, scale: 'mixolydian', chords: [0, 6, 0, 3], seed: 31, swing: 0.12, tracks: [
        { name: 'marimba', inst: 'marimba', layer: 0, gain: 0.34, chord: true, pattern: '0 . 2 4 . 2 7 . 4 . 2 . 4 5 4 2' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.4, chord: true, octave: -2, params: { cutoff: 800, q: 3 },
          pattern: '0 . . 0 . . 4 . 0 . . 0 . . 4 .' },
        { name: 'shaker', inst: 'shaker', layer: 0.12, gain: 0.32, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'kick', inst: 'kick', layer: 0.3, gain: 0.5, pattern: 'x.....x.x.......' },
        { name: 'hat', inst: 'hat', layer: 0.4, gain: 0.26, pattern: '..x...x...x...x.' },
        { name: 'clap', inst: 'clap', layer: 0.5, gain: 0.34, pattern: '....x.......x...' },
        { name: 'bells', inst: 'bell', layer: 0.72, gain: 0.22, chord: true, octave: 1, pattern: '. . . . 4 . . . . . 7 . . . 6 .' },
        { name: 'pad', inst: 'pad', layer: 2, gain: 0.4, chord: true, octave: -1, params: { cutoff: 1500, attack: 0.6 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }, { deg: 6, steps: 16 }] : null; } }
      ] },
      // HIGHWAY: straight-eight A dorian drive, pluck arps, four-on-the-floor
      { bpm: 124, key: 57, scale: 'dorian', chords: [0, 6, 3, 0], seed: 32, tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.4, chord: true, octave: -2, params: { cutoff: 1000, q: 4 },
          pattern: '0 . 0 . ^0 . 0 . 0 . 0 . ^0 . 4 .' },
        { name: 'pluck', inst: 'pluck', layer: 0, gain: 0.26, chord: true, octave: 1, params: { cutoff: 3600, decay: 0.2 },
          fn: function (i) { return i.step % 2 ? null : [0, 2, 4, 2, 7, 4, 2, 4][(i.step / 2) % 8]; } },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.55, pattern: 'x...x...x...x...' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.26, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.32, pattern: '....x.......x...' },
        { name: 'lead', inst: 'lead', layer: 0.62, gain: 0.2, octave: 1, params: { wave: 'square', cutoff: 2400 },
          pattern: '4 - 2 - 0 - 2 4 7 - - 6 4 - 2 - 4 - 5 - 7 - 9 - 7 - 5 4 2 - - -' },
        { name: 'pad', inst: 'pad', layer: 0.82, gain: 0.3, chord: true, params: { cutoff: 1600 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } }
      ] },
      // DOCKS: D dorian sea shanty in 3/4 (12 steps per bar), oom-pah-pah
      { bpm: 104, key: 62, scale: 'dorian', stepsPerBar: 12, chords: [0, 6, 0, 3], seed: 33, tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.42, chord: true, octave: -2, params: { cutoff: 700, q: 3 },
          fn: function (i) { return i.stepInBar === 0 ? { deg: i.bar % 2 ? 4 : 0, steps: 4 } : null; } },
        { name: 'pahs', inst: 'marimba', layer: 0, gain: 0.3, chord: true,
          fn: function (i) { return i.stepInBar === 4 || i.stepInBar === 8 ? [{ deg: 2, vel: 0.6 }, { deg: 4, vel: 0.6 }] : null; } },
        { name: 'shaker', inst: 'shaker', layer: 0.1, gain: 0.3, pattern: 'x.x.x.x.x.x.' },
        { name: 'kick', inst: 'kick', layer: 0.2, gain: 0.5, pattern: 'x...........' },
        { name: 'hat', inst: 'hat', layer: 0.34, gain: 0.24, pattern: '..x...x...x.' },
        { name: 'tune', inst: 'pluck', layer: 0.3, gain: 0.3, octave: 1, params: { wave: 'triangle', cutoff: 3000, decay: 0.3 },
          pattern: '0 . 2 . 4 . 4 . 3 . 2 . 1 . 2 . 3 . 4 - - - . . 0 . 2 . 4 . 7 . 6 . 4 . 3 . 2 . 1 . 0 - - - . .' },
        { name: 'clap', inst: 'clap', layer: 0.5, gain: 0.28, pattern: '....x...x...' },
        { name: 'gulls', inst: 'bell', layer: 0.75, gain: 0.2, chord: true, octave: 2,
          fn: function (i) { return i.stepInBar === 6 && i.rng() < 0.5 ? { deg: [0, 4, 2][i.bar % 3], vel: 0.5 } : null; } },
        { name: 'pad', inst: 'pad', layer: 2, gain: 0.38, chord: true, octave: -1, params: { cutoff: 1300, attack: 0.7 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 12 }, { deg: 2, steps: 12 }, { deg: 4, steps: 12 }] : null; } }
      ] },
      // RAIL YARD: G minor freight-train chug, harmonica-ish whistle lead
      { bpm: 118, key: 55, scale: 'minor', chords: [0, 0, 5, 6], seed: 34, tracks: [
        { name: 'chug', inst: 'shaker', layer: 0, gain: 0.42, pattern: 'XxxxXxxxXxxxXxxx' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.4, chord: true, octave: -2, params: { cutoff: 900, q: 4 },
          pattern: '0 . 0 0 . 0 0 . 0 . 0 0 . 0 4 .' },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.55, pattern: 'x.....x.x.....x.' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.22, pattern: 'x.x.x.x.x.x.x.x.' },
        { name: 'clap', inst: 'clap', layer: 0.42, gain: 0.32, pattern: '....x.......x...' },
        { name: 'whistle', inst: 'lead', layer: 0.6, gain: 0.2, octave: 1, params: { wave: 'triangle', cutoff: 2600 },
          pattern: '4 - - 3 2 - 0 - . . 2 - 3 - 4 - 7 - - 6 4 - 2 - . . 0 - - - . .' },
        { name: 'signal', inst: 'bell', layer: 0.8, gain: 0.2, chord: true, octave: 1, pattern: '. . . . . . . . . . . . 4 . 4 .' },
        { name: 'pad', inst: 'pad', layer: 2, gain: 0.36, chord: true, octave: -1, params: { cutoff: 1200, attack: 0.6 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } }
      ] },
      // WINTER: C lydian sleigh-bell waltz-ish celesta, soft drums
      { bpm: 96, key: 60, scale: 'lydian', chords: [0, 1, 5, 4], seed: 35, tracks: [
        { name: 'sleigh', inst: 'shaker', layer: 0, gain: 0.22, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'celesta', inst: 'bell', layer: 0, gain: 0.24, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 ? null : { deg: [0, 2, 4, 7, 4, 2, 4, 6][(i.step / 2) % 8], vel: 0.55 }; } },
        { name: 'bass', inst: 'sub', layer: 0, gain: 0.45, chord: true, octave: -2, pattern: '0 - - - - - - - 4 - - - - - - -' },
        { name: 'kick', inst: 'kick', layer: 0.2, gain: 0.42, pattern: 'x.......x.......' },
        { name: 'hat', inst: 'hat', layer: 0.4, gain: 0.2, pattern: '..x...x...x...x.' },
        { name: 'clap', inst: 'clap', layer: 0.55, gain: 0.26, pattern: '........x.......' },
        { name: 'melody', inst: 'pluck', layer: 0.65, gain: 0.26, octave: 1, params: { wave: 'triangle', cutoff: 2800, decay: 0.35 },
          pattern: '4 - 3 - 4 - 7 - 6 - 4 - 2 - - - 1 - 2 - 4 - 3 - 2 - 0 - - -' },
        { name: 'pad', inst: 'pad', layer: 0.85, gain: 0.34, chord: true, params: { cutoff: 1800, attack: 0.9, release: 1.4 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } }
      ] }
    ];
  }
  var SONGS = buildSongs();
  var LAP_KEYS = [0, 2, -3, 5];     // key offset per lap so later laps sound fresh

  /* ================================================================ small helpers */
  function mod(a, n) { return ((a % n) + n) % n; }
  var SHADES = {};
  // shade('#rrggbb', f): f > 0 lightens towards white, f < 0 darkens (cached).
  function shade(hex, f) {
    var k = hex + f;
    if (SHADES[k]) return SHADES[k];
    var n = parseInt(hex.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    for (var i = 0; i < 3; i++) c[i] = Math.round(f >= 0 ? c[i] + (255 - c[i]) * f : c[i] * (1 + f));
    SHADES[k] = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    return SHADES[k];
  }
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  // An extruded block in the 3/4 view. Footprint x..x+w, y..y+d on the ground;
  // it rises h px and floats e px above the ground.
  function box(ctx, x, y, w, d, h, top, side, e) {
    e = e || 0;
    ctx.fillStyle = side; ctx.fillRect(x, y + d - h - e, w, h);
    ctx.fillStyle = top; ctx.fillRect(x, y - h - e, w, d);
  }
  function groundShadow(ctx, x, y, w, d, alpha) {
    ctx.fillStyle = 'rgba(0,0,0,' + (alpha || 0.26) + ')';
    ctx.fillRect(x + 4, y + 4, w, d);
  }
  function ellipse(ctx, x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2); ctx.fill();
  }
  // Soft round glow. Each colour is pre-rendered once to a small sprite.
  var GLOWS = {};
  function glowSprite(color) {
    if (GLOWS[color]) return GLOWS[color];
    var cv = makeCanvas(64, 64), g = cv.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, color); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    GLOWS[color] = cv;
    return cv;
  }
  function glow(ctx, x, y, r, color, alpha) {
    var a = ctx.globalAlpha;
    if (alpha != null) ctx.globalAlpha = a * alpha;
    ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a;
  }
  // Vertical fade-out shadow strip (kerbs and river banks), pre-rendered.
  var SHADOW_STRIP = null;
  function shadowStrip() {
    if (SHADOW_STRIP) return SHADOW_STRIP;
    SHADOW_STRIP = makeCanvas(8, 16);
    var g = SHADOW_STRIP.getContext('2d'), grd = g.createLinearGradient(0, 0, 0, 16);
    grd.addColorStop(0, 'rgba(0,0,0,0.32)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 8, 16);
    return SHADOW_STRIP;
  }
  // Headlight cone pointing right (flipped for left-moving vehicles).
  var CONE = null;
  function coneSprite() {
    if (CONE) return CONE;
    CONE = makeCanvas(60, 40);
    var g = CONE.getContext('2d'), grd = g.createLinearGradient(0, 0, 60, 0);
    grd.addColorStop(0, 'rgba(255,240,180,0.28)'); grd.addColorStop(1, 'rgba(255,240,180,0)');
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(0, 12); g.lineTo(60, 0); g.lineTo(60, 40); g.lineTo(0, 28); g.closePath(); g.fill();
    return CONE;
  }
  function allColumns(v) { var a = []; for (var c = 0; c < COLS; c++) a[c] = v; return a; }

  /* ---- hazard cycles (shared by the game and the attract preview) ---- */
  function sinkPhase(it, t) { return mod(t + it.ph, SINK_CYCLE); }
  function sinkRideable(it, t) { return it.kind !== 'sink' || sinkPhase(it, t) < 3.4; }
  function crocPhase(ph, t) { return mod(t + ph, CROC_CYCLE); }
  function crocDanger(ph, t) { var p = crocPhase(ph, t); return p >= 2.3 && p < 3.1; }
  // How far the jaws are open, 0..1 (a small twitch during the warning).
  function crocOpen(ph, t) {
    var p = crocPhase(ph, t);
    if (p < 1.8) return 0;
    if (p < 2.3) return 0.12 + 0.06 * Math.sin(p * 40);
    if (p < 2.45) return 0.12 + (p - 2.3) / 0.15 * 0.88;
    if (p < 3.0) return 1;
    if (p < 3.2) return 1 - (p - 3.0) / 0.2;
    return 0;
  }
  function crocWarn(ph, t) { var p = crocPhase(ph, t); return p >= 1.8 && p < 3.1; }

  /* ================================================================ lane textures
     Static lane art is pre-rendered once per biome/kind/parity (visual-only
     seeded noise, never api.rng) and blitted each frame. */
  var TEX = {};
  var TEX_KINDS = ['ground', 'road', 'water', 'rail', 'ice'];
  function laneTexture(bi, kind, parity) {
    var key = bi + ':' + kind + ':' + parity;
    if (TEX[key]) return TEX[key];
    var cv = makeCanvas(W, C), g = cv.getContext('2d');
    var B = BIOMES[bi], P = B.pal;
    var r = U.rng(4242 + bi * 101 + TEX_KINDS.indexOf(kind) * 13 + parity * 7);
    if (kind === 'ground') paintGround(g, B, P, r, parity);
    else if (kind === 'road') paintRoad(g, B, P, r);
    else if (kind === 'water') paintWater(g, P);
    else if (kind === 'rail') paintRail(g, B, P, r);
    else paintIce(g, P, r);
    TEX[key] = cv;
    return cv;
  }
  function paintGround(g, B, P, r, parity) {
    var c, k;
    for (c = 0; c < COLS; c++) {
      g.fillStyle = (c + parity) % 2 ? P.groundA : P.groundB;
      g.fillRect(c * C, 0, C, C);
    }
    if (B.id === 'docks') {                     // wooden planks with nails
      for (k = 0; k < 4; k++) {
        g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(0, k * 10.5 + 9, W, 1.5);
        for (c = 0; c < 7; c++) {
          var px = (c * 64 + k * 23 + parity * 31) % W;
          g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(px, k * 10.5, 1.5, 10);
          g.fillStyle = 'rgba(255,230,190,0.35)'; g.fillRect(px + 4, k * 10.5 + 4, 2, 2);
        }
      }
      return;
    }
    var n = B.id === 'railyard' ? 260 : B.id === 'winter' ? 90 : 120;
    for (k = 0; k < n; k++) {
      g.fillStyle = r() < 0.5 ? P.dotA : P.dotB;
      var s = B.id === 'railyard' ? 2 + Math.floor(r() * 2) : 2;
      g.fillRect(Math.floor(r() * W), Math.floor(r() * (C - 3)), s, B.id === 'suburbs' || B.id === 'highway' ? s + 1 : s);
    }
    if (B.id === 'winter') {                    // snow sparkle
      for (k = 0; k < 14; k++) { g.fillStyle = 'rgba(150,200,255,0.5)'; g.fillRect(Math.floor(r() * W), Math.floor(r() * C), 1, 1); }
    }
  }
  function paintRoad(g, B, P, r) {
    g.fillStyle = P.road; g.fillRect(0, 0, W, C);
    for (var k = 0; k < 160; k++) {
      g.fillStyle = r() < 0.5 ? P.roadDot : 'rgba(0,0,0,0.12)';
      g.fillRect(Math.floor(r() * W), Math.floor(r() * C), 2, 1);
    }
    if (B.id === 'winter') {                    // packed snow + tyre tracks
      g.fillStyle = 'rgba(255,255,255,0.22)';
      g.fillRect(0, 9, W, 5); g.fillRect(0, C - 14, W, 5);
      g.fillStyle = 'rgba(255,255,255,0.35)';
      for (k = 0; k < 40; k++) g.fillRect(Math.floor(r() * W), r() < 0.5 ? 1 : C - 3, 4 + Math.floor(r() * 8), 2);
    }
  }
  function paintWater(g, P) {
    var grd = g.createLinearGradient(0, 0, 0, C);
    grd.addColorStop(0, P.waterDark); grd.addColorStop(1, P.water);
    g.fillStyle = grd; g.fillRect(0, 0, W, C);
  }
  function paintRail(g, B, P, r) {
    g.fillStyle = P.rail; g.fillRect(0, 0, W, C);
    for (var k = 0; k < 200; k++) {
      g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.16)';
      g.fillRect(Math.floor(r() * W), Math.floor(r() * C), 2, 2);
    }
    for (var x = 3; x < W; x += 14) {           // sleepers
      g.fillStyle = P.railTie; g.fillRect(x, 5, 8, C - 10);
      g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x, 5, 8, 2);
    }
    [11, C - 16].forEach(function (ry) {         // two steel rails
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, ry + 3, W, 3);
      g.fillStyle = P.railSteel; g.fillRect(0, ry, W, 3);
      g.fillStyle = '#ffffff'; g.globalAlpha = 0.55; g.fillRect(0, ry, W, 1); g.globalAlpha = 1;
    });
  }
  function paintIce(g, P, r) {
    var grd = g.createLinearGradient(0, 0, W, C);
    grd.addColorStop(0, P.ice); grd.addColorStop(0.5, '#e4f6ff'); grd.addColorStop(1, P.ice);
    g.fillStyle = grd; g.fillRect(0, 0, W, C);
    g.strokeStyle = 'rgba(120,170,210,0.6)'; g.lineWidth = 1;
    for (var k = 0; k < 9; k++) {               // cracks
      var x = r() * W, y = r() * C;
      g.beginPath(); g.moveTo(x, y);
      for (var s = 0; s < 3; s++) { x += (r() - 0.5) * 30; y += (r() - 0.5) * 14; g.lineTo(x, y); }
      g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,0.7)';
    for (k = 0; k < 10; k++) g.fillRect(Math.floor(r() * W), Math.floor(r() * C), 6 + Math.floor(r() * 10), 1);
  }
  function laneTexKind(type) { return type === 'river' || type === 'pads' ? 'water' : type; }

  // Height of each lane's top surface (used for the kerbs / banks between lanes).
  var ELEVATION = { ground: 7, ice: 6, rail: 4, road: 2, river: 0, pads: 0 };
  function lipColor(rw) {
    var P = BIOMES[rw.bi].pal;
    return rw.type === 'ground' ? P.groundSide : rw.type === 'ice' ? P.iceSide : rw.type === 'rail' ? P.railSide : P.roadSide;
  }

  /* ================================================================ lane drawing */
  function drawLaneBase(ctx, rw, r, y) {
    ctx.drawImage(laneTexture(rw.bi, laneTexKind(rw.type), r % 2), 0, y);
  }
  // Front face of a raised lane, drawn over the top edge of the lane below.
  function drawLaneLip(ctx, rw, below, y) {
    var e = ELEVATION[rw.type] - (below ? ELEVATION[below.type] : 0);
    if (e <= 0) return;
    ctx.fillStyle = lipColor(rw);
    ctx.fillRect(0, y + C, W, e);
    ctx.drawImage(shadowStrip(), 0, y + C + e, W, 9);
  }
  // Animated / contextual lane detail: road markings, water shimmer, rail warning, ice glints.
  function drawLaneDetail(ctx, rw, above, below, y, t) {
    var P = BIOMES[rw.bi].pal, i, x;
    if (rw.type === 'road') {
      if (below && below.type === 'road') {
        ctx.fillStyle = P.line; ctx.globalAlpha = 0.55;
        for (x = 8; x < W; x += 42) ctx.fillRect(x, y + C - 1, 22, 2);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = P.edge; ctx.globalAlpha = 0.7;
      if (!below || below.type !== 'road') ctx.fillRect(0, y + C - 4, W, 2);
      if (!above || above.type !== 'road') ctx.fillRect(0, y + 2, W, 2);
      ctx.globalAlpha = 1;
    } else if (rw.type === 'river' || rw.type === 'pads') {
      ctx.save();
      ctx.strokeStyle = P.shimmer; ctx.lineWidth = 2; ctx.lineCap = 'round';
      var dir = rw.dir || 1;
      for (i = 0; i < 9; i++) {
        var sx = mod(i * 61 + rw.hash * 3 + t * 16 * dir, W + 60) - 30;
        var sy = y + 7 + mod(i * 13 + rw.hash, 28);
        ctx.globalAlpha = 0.18 + 0.16 * Math.sin(t * 2.2 + i * 1.7 + rw.hash);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 10 + (i % 3) * 5, sy); ctx.stroke();
      }
      ctx.restore();
      // bank shadow from a higher lane above
      if (above && ELEVATION[above.type] > 0) {
        ctx.drawImage(shadowStrip(), 0, y, W, 10);
      }
    } else if (rw.type === 'rail') {
      var R = rw.rail;
      if (R && R.state !== 'idle') {
        var on = Math.floor(t * 8) % 2 === 0;
        ctx.fillStyle = 'rgba(255,40,70,' + (on ? 0.22 : 0.1) + ')';
        ctx.fillRect(0, y, W, C);
        if (R.state === 'warn') {                // chevrons pointing where the train will go
          ctx.fillStyle = 'rgba(255,230,120,' + (on ? 0.8 : 0.35) + ')';
          for (x = 30; x < W; x += 70) {
            var cx = x + (rw.dir > 0 ? 0 : 10), d = rw.dir;
            ctx.beginPath();
            ctx.moveTo(cx, y + C / 2 - 7); ctx.lineTo(cx + 8 * d, y + C / 2); ctx.lineTo(cx, y + C / 2 + 7);
            ctx.lineTo(cx - 4 * d, y + C / 2 + 7); ctx.lineTo(cx + 4 * d, y + C / 2); ctx.lineTo(cx - 4 * d, y + C / 2 - 7);
            ctx.closePath(); ctx.fill();
          }
        }
      }
    } else if (rw.type === 'ice') {
      ctx.fillStyle = '#ffffff';
      for (i = 0; i < 5; i++) {
        var gx = mod(rw.hash * 7 + i * 97, W), gy = y + 6 + mod(rw.hash + i * 11, 30);
        var a = Math.max(0, Math.sin(t * 3 + i * 2.1 + rw.hash));
        ctx.globalAlpha = a * 0.9;
        ctx.fillRect(gx - 4 * a, gy, 8 * a + 1, 1); ctx.fillRect(gx, gy - 4 * a, 1, 8 * a + 1);
      }
      ctx.globalAlpha = 1;
    }
    if (rw.gate) {                               // "welcome" paint on the first row of a biome
      var B = BIOMES[rw.bi];
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = B.pal.accent;
      ctx.font = '800 15px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(B.name, W / 2, y + C / 2 + 1);
      ctx.fillRect(60, y + C / 2 - 1, 50, 2); ctx.fillRect(W - 110, y + C / 2 - 1, 50, 2);
      ctx.restore();
    }
  }

  /* ================================================================ decorations
     draw(ctx, tx, ty, t): tx/ty = the tile's top-left on screen. */
  var DECO = {
    tree: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 6, ty + 16, 30, 18);
      box(ctx, tx + 17, ty + 25, 8, 6, 10, '#8a5a31', '#6b4424');
      box(ctx, tx + 6, ty + 14, 30, 18, 18, '#4cc56a', '#2f8f47', 10);
      box(ctx, tx + 11, ty + 16, 20, 12, 10, '#6ddc86', '#3fa85a', 28);
    },
    bush: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 8, ty + 18, 26, 14);
      box(ctx, tx + 8, ty + 16, 26, 16, 14, '#57c46b', '#35904a');
      ctx.fillStyle = '#ff6fa8'; ctx.fillRect(tx + 13, ty + 4, 3, 3); ctx.fillRect(tx + 25, ty + 7, 3, 3);
    },
    house: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 3, ty + 12, 36, 24);
      box(ctx, tx + 4, ty + 12, 34, 22, 18, '#f1e4cf', '#d8c3a2');
      ctx.fillStyle = '#6b4424'; ctx.fillRect(tx + 18, ty + 22, 7, 12);           // door
      ctx.fillStyle = '#9fd8ff'; ctx.fillRect(tx + 7, ty + 20, 7, 6); ctx.fillRect(tx + 29, ty + 20, 7, 6);
      ctx.fillStyle = '#c4473a';                                                    // roof
      ctx.beginPath(); ctx.moveTo(tx + 1, ty + 18); ctx.lineTo(tx + 41, ty + 18); ctx.lineTo(tx + 37, ty - 10); ctx.lineTo(tx + 5, ty - 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e0604f'; ctx.fillRect(tx + 5, ty - 10, 32, 3);
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; for (var k = 0; k < 4; k++) ctx.fillRect(tx + 3, ty - 3 + k * 6, 36, 1);
      box(ctx, tx + 28, ty - 8, 6, 4, 8, '#8b8f9c', '#6b6f7c', 4);                 // chimney
    },
    mailbox: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 17, ty + 24, 10, 6);
      box(ctx, tx + 20, ty + 26, 3, 3, 14, '#8a5a31', '#6b4424');
      box(ctx, tx + 14, ty + 22, 14, 8, 8, '#4d7bff', '#2f55c4', 12);
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(tx + 27, ty + 2, 2, 7);
    },
    cone: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 13, ty + 24, 16, 8);
      ctx.fillStyle = '#3a3a40'; ctx.fillRect(tx + 12, ty + 26, 18, 5);
      ctx.fillStyle = '#ff7a1a';
      ctx.beginPath(); ctx.moveTo(tx + 14, ty + 27); ctx.lineTo(tx + 28, ty + 27); ctx.lineTo(tx + 22, ty + 3); ctx.lineTo(tx + 20, ty + 3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(tx + 17, ty + 14, 8, 3);
    },
    barrier: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 2, ty + 20, 38, 10);
      box(ctx, tx + 2, ty + 20, 38, 10, 14, '#e2e2e6', '#b3b3ba');
      ctx.fillStyle = '#ff4d6d';
      for (var k = 0; k < 4; k++) ctx.fillRect(tx + 4 + k * 10, ty + 18, 5, 8);
    },
    lamp: function (ctx, tx, ty, t) {
      groundShadow(ctx, tx + 18, ty + 26, 8, 6);
      box(ctx, tx + 19, ty + 26, 4, 4, 44, '#9aa0ad', '#6e7482');
      box(ctx, tx + 14, ty + 24, 14, 6, 4, '#d9dde6', '#9aa0ad', 44);
      glow(ctx, tx + 21, ty - 14, 26, 'rgba(255,230,150,0.55)');
      ctx.fillStyle = '#fff3c2'; ctx.fillRect(tx + 16, ty - 15, 10, 2);
    },
    sign: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 4, ty + 26, 34, 6);
      box(ctx, tx + 8, ty + 27, 3, 3, 28, '#8b8f9c', '#6b6f7c');
      box(ctx, tx + 31, ty + 27, 3, 3, 28, '#8b8f9c', '#6b6f7c');
      box(ctx, tx + 3, ty + 26, 36, 4, 18, '#2f7a4a', '#1f5a34', 22);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tx + 7, ty - 6, 20, 2); ctx.fillRect(tx + 7, ty - 1, 26, 2); ctx.fillRect(tx + 7, ty + 4, 14, 2);
    },
    crate: function (ctx, tx, ty) {
      groundShadow(ctx, tx + 7, ty + 12, 28, 22);
      box(ctx, tx + 7, ty + 12, 28, 20, 20, '#d49a58', '#a8733b');
      ctx.strokeStyle = 'rgba(80,45,15,0.6)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(tx + 8, ty + 13, 26, 18);
      ctx.beginPath(); ctx.moveTo(tx + 8, ty + 13); ctx.lineTo(tx + 34, ty + 31); ctx.moveTo(tx + 34, ty + 13); ctx.lineTo(tx + 8, ty + 31); ctx.stroke();
      ctx.fillStyle = 'rgba(80,45,15,0.35)'; ctx.fillRect(tx + 7, ty - 2, 28, 2);
    },
    bollard: function (ctx, tx, ty) {                 // mooring bollard: short iron post, yellow cap
      ellipse(ctx, tx + 23, ty + 30, 10, 4, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = '#23262d'; ctx.fillRect(tx + 14, ty + 16, 14, 14);
      ellipse(ctx, tx + 21, ty + 30, 7, 3, '#23262d');
      ellipse(ctx, tx + 21, ty + 16, 7, 3, '#3b3f48');
      ellipse(ctx, tx + 21, ty + 12, 10, 4, '#c9a020');
      ellipse(ctx, tx + 21, ty + 10, 10, 4, '#ffd23f');
    },
    container: function (ctx, tx, ty, t, seed) {
      var col = CONTAINER_COLORS[(seed || 0) % CONTAINER_COLORS.length];
      groundShadow(ctx, tx + 1, ty + 8, 40, 28);
      box(ctx, tx + 1, ty + 8, 40, 26, 26, shade(col, 0.15), shade(col, -0.2));
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (var k = 0; k < 8; k++) ctx.fillRect(tx + 3 + k * 5, ty + 10, 2, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(tx + 1, ty - 18, 40, 2);
    },
    crane: function (ctx, tx, ty) {                   // dock crane base (kept low so lanes stay readable)
      groundShadow(ctx, tx + 4, ty + 26, 34, 8, 0.3);
      box(ctx, tx + 5, ty + 26, 5, 5, 38, '#ffc21a', '#c99208');
      box(ctx, tx + 32, ty + 26, 5, 5, 38, '#ffc21a', '#c99208');
      ctx.strokeStyle = '#c99208'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (var k = 0; k < 2; k++) { ctx.moveTo(tx + 8, ty + 24 - k * 14); ctx.lineTo(tx + 34, ty + 10 - k * 14); }
      ctx.stroke();
      box(ctx, tx + 1, ty + 24, 40, 7, 6, '#ffd84d', '#c99208', 38);
      ctx.fillStyle = '#20242c'; ctx.fillRect(tx + 18, ty - 8, 6, 5);
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(tx + 3, ty - 20, 3, 3);
    },
    drum: function (ctx, tx, ty, t, seed) {
      var col = (seed || 0) % 2 ? '#2f7fd1' : '#d9483b';
      groundShadow(ctx, tx + 12, ty + 20, 18, 12);
      ctx.fillStyle = shade(col, -0.25); ctx.fillRect(tx + 12, ty + 8, 18, 22);
      ellipse(ctx, tx + 21, ty + 30, 9, 3, shade(col, -0.25));
      ellipse(ctx, tx + 21, ty + 8, 9, 3.5, shade(col, 0.2));
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(tx + 12, ty + 15, 18, 2); ctx.fillRect(tx + 12, ty + 23, 18, 2);
    },
    signal: function (ctx, tx, ty, t, seed) {
      groundShadow(ctx, tx + 18, ty + 26, 8, 6);
      box(ctx, tx + 19, ty + 27, 4, 4, 38, '#5a5f6b', '#3a3e48');
      box(ctx, tx + 15, ty + 22, 12, 6, 18, '#2a2d35', '#15171c', 30);
      var green = Math.floor(t * 0.5 + (seed || 0)) % 2 === 0;
      ellipse(ctx, tx + 21, ty - 20, 3, 3, green ? '#233' : '#ff4d6d');
      ellipse(ctx, tx + 21, ty - 12, 3, 3, green ? '#46ff8a' : '#233');
      glow(ctx, tx + 21, green ? ty - 12 : ty - 20, 12, green ? 'rgba(70,255,138,0.6)' : 'rgba(255,77,109,0.6)');
    },
    snowman: function (ctx, tx, ty) {
      ellipse(ctx, tx + 24, ty + 30, 14, 5, 'rgba(60,90,130,0.3)');
      ellipse(ctx, tx + 21, ty + 22, 12, 10, '#d9e6f2');
      ellipse(ctx, tx + 21, ty + 20, 11, 9, '#ffffff');
      ellipse(ctx, tx + 21, ty + 6, 8, 7, '#d9e6f2');
      ellipse(ctx, tx + 21, ty + 5, 7, 6, '#ffffff');
      ctx.fillStyle = '#20242c'; ctx.fillRect(tx + 18, ty + 3, 2, 2); ctx.fillRect(tx + 23, ty + 3, 2, 2);
      ctx.fillStyle = '#ff8c1a'; ctx.fillRect(tx + 21, ty + 6, 6, 2);
      box(ctx, tx + 14, ty - 2, 14, 4, 2, '#20242c', '#20242c');
      box(ctx, tx + 16, ty - 4, 10, 3, 7, '#2a2f3a', '#20242c', 2);
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(tx + 14, ty + 11, 14, 3);
    },
    pine: function (ctx, tx, ty) {
      ellipse(ctx, tx + 24, ty + 30, 14, 5, 'rgba(60,90,130,0.3)');
      box(ctx, tx + 18, ty + 26, 6, 5, 8, '#6b4424', '#4a2e18');
      var tiers = [[16, 24], [12, 12], [8, 1]];
      tiers.forEach(function (tr) {
        ctx.fillStyle = '#1f6b44';
        ctx.beginPath(); ctx.moveTo(tx + 21 - tr[0], ty + tr[1]); ctx.lineTo(tx + 21 + tr[0], ty + tr[1]); ctx.lineTo(tx + 21, ty + tr[1] - 18); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(tx + 21 - tr[0] * 0.45, ty + tr[1] - 10); ctx.lineTo(tx + 21 + tr[0] * 0.45, ty + tr[1] - 10); ctx.lineTo(tx + 21, ty + tr[1] - 18); ctx.closePath(); ctx.fill();
      });
    },
    rock: function (ctx, tx, ty) {                    // snow-capped boulder
      ellipse(ctx, tx + 23, ty + 30, 16, 5, 'rgba(60,90,130,0.3)');
      ellipse(ctx, tx + 21, ty + 22, 15, 10, '#7b8697');
      ellipse(ctx, tx + 21, ty + 18, 14, 10, '#a8b3c2');
      ellipse(ctx, tx + 19, ty + 13, 9, 5, '#ffffff');
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(tx + 26, ty + 19, 6, 2);
    },
    igloo: function (ctx, tx, ty) {
      ellipse(ctx, tx + 23, ty + 31, 19, 5, 'rgba(60,90,130,0.3)');
      ctx.fillStyle = '#f4faff';
      ctx.beginPath(); ctx.arc(tx + 21, ty + 30, 18, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(120,160,200,0.6)'; ctx.lineWidth = 1;
      for (var k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(tx + 5 + k * 2, ty + 30 - k * 6); ctx.lineTo(tx + 37 - k * 2, ty + 30 - k * 6); ctx.stroke(); }
      ctx.fillStyle = '#2a3a52';
      ctx.beginPath(); ctx.arc(tx + 21, ty + 31, 6, Math.PI, 0); ctx.closePath(); ctx.fill();
    },
    post: function (ctx, tx, ty, t, seed, rw) {        // biome gate flag
      var P = BIOMES[rw ? rw.bi : 0].pal;
      groundShadow(ctx, tx + 19, ty + 26, 6, 6);
      box(ctx, tx + 19, ty + 27, 4, 4, 50, '#e9e9ef', '#a9a9b2');
      var wave = Math.sin(t * 5 + tx) * 3;
      ctx.fillStyle = P.accent;
      ctx.beginPath(); ctx.moveTo(tx + 23, ty - 23); ctx.lineTo(tx + 41, ty - 19 + wave); ctx.lineTo(tx + 23, ty - 11); ctx.closePath(); ctx.fill();
      glow(ctx, tx + 30, ty - 17, 18, P.accent, 0.35);
    }
  };

  /* ================================================================ lane objects */
  function drawCoin(ctx, cx, cy, t) {
    var bob = Math.sin(t * 4 + cx * 0.05) * 2;
    ellipse(ctx, cx + 2, cy + 8, 7, 3, 'rgba(0,0,0,0.25)');
    var wdt = Math.max(1.5, 8 * Math.abs(Math.cos(t * 3 + cx * 0.02)));
    ctx.save();
    ctx.shadowColor = COIN; ctx.shadowBlur = 10;
    ellipse(ctx, cx, cy - 6 + bob + 1.5, wdt, 8, '#c9971a');
    ellipse(ctx, cx, cy - 6 + bob, wdt, 8, COIN);
    ctx.restore();
    if (wdt > 4) { ctx.fillStyle = '#fff6c2'; ctx.fillRect(cx - 1, cy - 11 + bob, 2, 9); }
  }

  function drawVehicle(ctx, rw, it, y, t) {
    var V = VEHICLES[it.kind], x = it.x, w = it.w, dir = rw.dir;
    var top = y + 9, d = C - 18;
    var front = dir > 0 ? x + w : x;
    // headlight cone on the road ahead
    if (dir > 0) ctx.drawImage(coneSprite(), front, top - 7, 60, d + 14);
    else { ctx.save(); ctx.translate(front, 0); ctx.scale(-1, 1); ctx.drawImage(coneSprite(), 0, top - 7, 60, d + 14); ctx.restore(); }
    groundShadow(ctx, x, top + 2, w, d, 0.32);
    // wheels peek out under the front face
    ctx.fillStyle = '#111318';
    ctx.fillRect(x + 5, top + d - 2, 9, 4); ctx.fillRect(x + w - 14, top + d - 2, 9, 4);
    if (it.kind === 'truck') drawTruck(ctx, it, x, top, w, d, dir, V);
    else if (it.kind === 'bus') drawBus(ctx, it, x, top, w, d, dir, V);
    else if (it.kind === 'forklift') drawForklift(ctx, it, x, top, w, d, dir, V);
    else if (it.kind === 'plow') drawPlow(ctx, it, x, top, w, d, dir, V, t);
    else drawCar(ctx, it, x, top, w, d, dir, V);
    // lights on the front face: headlights at the front, tail lights at the back
    var hy = top + d - V.h + 3;
    ctx.fillStyle = '#fff6c2';
    ctx.fillRect(dir > 0 ? x + w - 3 : x, hy, 3, 4);
    ctx.fillStyle = '#ff3355';
    ctx.fillRect(dir > 0 ? x : x + w - 3, hy, 3, 3);
    glow(ctx, dir > 0 ? x + w : x, hy + 2, 10, 'rgba(255,240,180,0.9)', 0.6);
  }
  function drawCar(ctx, it, x, top, w, d, dir, V) {
    box(ctx, x, top, w, d, V.h, it.top, it.side);
    var cw = w * V.cabin, cx = x + (w - cw) / 2 - dir * w * 0.06;
    box(ctx, cx, top + 3, cw, d - 6, 8, '#3a4566', '#26304a', V.h);
    ctx.fillStyle = 'rgba(160,210,255,0.55)';
    ctx.fillRect(dir > 0 ? cx + cw - 5 : cx + 1, top + 3 - V.h - 8, 4, d - 6);  // windscreen
    if (it.kind === 'sport') { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 2, top - V.h + d / 2 - 1, w - 4, 2); }
    if (it.kind === 'van') { ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(x + w * 0.3, top + d - V.h + 2, 1, V.h - 4); }
  }
  function drawTruck(ctx, it, x, top, w, d, dir, V) {
    var cab = C * 0.72, tx = dir > 0 ? x : x + cab, cx = dir > 0 ? x + w - cab : x;
    box(ctx, tx, top - 1, w - cab - 2, d + 2, V.h, it.cargoTop, it.cargoSide);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (var k = tx + 4; k < tx + w - cab - 4; k += 6) ctx.fillRect(k, top + d - V.h + 2, 2, V.h - 4);
    box(ctx, cx, top + 1, cab, d - 2, 16, it.top, it.side);
    ctx.fillStyle = 'rgba(160,210,255,0.6)';
    ctx.fillRect(dir > 0 ? cx + cab - 7 : cx + 2, top + 1 - 16 + 2, 5, d - 6);
  }
  function drawBus(ctx, it, x, top, w, d, dir, V) {
    box(ctx, x, top - 1, w, d + 2, V.h, it.top, it.side);
    ctx.fillStyle = '#26304a';
    for (var k = x + 8; k < x + w - 12; k += 14) ctx.fillRect(k, top + d + 1 - V.h + 3, 10, 7);
    ctx.fillStyle = 'rgba(160,210,255,0.35)';
    for (k = x + 8; k < x + w - 12; k += 14) ctx.fillRect(k, top + d + 1 - V.h + 3, 10, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(x + 4, top - 1 - V.h + 3, w - 8, 3);
  }
  function drawForklift(ctx, it, x, top, w, d, dir, V) {
    box(ctx, x, top + 2, w, d - 4, V.h, it.top, it.side);
    var mx = dir > 0 ? x + w - 4 : x;
    box(ctx, mx, top + 2, 4, d - 4, 26, '#3a3e48', '#23262d');
    ctx.fillStyle = '#8b8f9c';
    ctx.fillRect(dir > 0 ? x + w : x - 10, top + d - 6, 10, 2);
    ctx.fillRect(dir > 0 ? x + w : x - 10, top + 4, 10, 2);
    box(ctx, x + w * 0.25, top + 4, w * 0.4, d - 8, 10, '#2a2d35', '#15171c', V.h);
  }
  function drawPlow(ctx, it, x, top, w, d, dir, V, t) {
    box(ctx, x, top + 1, w, d - 2, V.h, it.top, it.side);
    box(ctx, x + w * 0.35, top + 3, w * 0.3, d - 6, 9, '#3a4566', '#26304a', V.h);
    var bx = dir > 0 ? x + w : x - 7;
    box(ctx, bx, top - 3, 7, d + 6, 12, '#d9dde6', '#9aa0ad');
    var on = Math.floor(t * 6) % 2 === 0;
    ellipse(ctx, x + w / 2, top - V.h - 10, 3, 3, on ? '#ffb000' : '#8a5a00');
    if (on) glow(ctx, x + w / 2, top - V.h - 10, 16, 'rgba(255,176,0,0.7)');
  }

  // Logs, sinking logs, ice floes and crocodiles all ride the river.
  function drawRiverItem(ctx, rw, it, y, t) {
    var P = BIOMES[rw.bi].pal, floe = BIOMES[rw.bi].floe;
    if (it.kind === 'croc') { drawCroc(ctx, rw, it, y, t); return; }
    var top = y + 9, d = C - 18, lift = 5, alpha = 1, bob = Math.sin(t * 2 + it.x * 0.01) * 0.8;
    if (it.kind === 'sink') {
      var p = sinkPhase(it, t);
      if (p >= 2.4 && p < 3.4) {                       // warning: wobble + bubbles
        var k = (p - 2.4) / 1.0;
        bob = Math.sin(t * 22) * (1 + k * 2.5) + k * 3;
        lift = 5 - k * 3;
        drawBubbles(ctx, it.x, it.w, y, t, 4);
      } else if (p >= 3.4 && p < 4.4) {                // under water: a dark shape + bubbles
        ctx.fillStyle = 'rgba(0,20,40,0.28)';
        U.roundRect(ctx, it.x + 4, top + 3, it.w - 8, d - 4, 8); ctx.fill();
        drawBubbles(ctx, it.x, it.w, y, t, 3);
        return;
      } else if (p >= 4.4) {                           // rising back
        alpha = (p - 4.4) / 0.4; lift = 2 + alpha * 3;
      }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,15,35,0.3)';
    U.roundRect(ctx, it.x + 3, top + 5, it.w, d, 8); ctx.fill();          // shadow on water
    var sinkTint = it.kind === 'sink' && !floe;
    var side = floe ? '#9cc3e0' : sinkTint ? '#5b3a20' : P.log;
    var topC = floe ? P.logTop : sinkTint ? '#7a5030' : P.logTop;
    ctx.fillStyle = side;
    U.roundRect(ctx, it.x, top + bob, it.w, d, 8); ctx.fill();
    ctx.fillStyle = topC;
    U.roundRect(ctx, it.x, top - lift + bob, it.w, d - 3, 8); ctx.fill();
    if (floe) {
      ctx.strokeStyle = 'rgba(120,170,210,0.7)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(it.x + 10, top - lift + bob + 6); ctx.lineTo(it.x + it.w * 0.5, top - lift + bob + 12); ctx.lineTo(it.x + it.w - 14, top - lift + bob + 5); ctx.stroke();
      if (it.kind === 'sink') { ctx.fillStyle = 'rgba(40,90,140,0.35)'; U.roundRect(ctx, it.x + 4, top - lift + bob + 2, it.w - 8, d - 8, 6); ctx.fill(); }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (var bx = it.x + 12; bx < it.x + it.w - 10; bx += 17) ctx.fillRect(bx, top - lift + bob + 4, 8, 2);
      ellipse(ctx, it.x + 5, top - lift + bob + (d - 3) / 2, 4, (d - 3) / 2 - 1, P.logEnd);
      ellipse(ctx, it.x + it.w - 5, top - lift + bob + (d - 3) / 2, 4, (d - 3) / 2 - 1, P.logEnd);
      ctx.strokeStyle = 'rgba(90,50,20,0.6)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(it.x + it.w - 5, top - lift + bob + (d - 3) / 2, 2, 5, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    if (it.coin >= 0) drawCoin(ctx, it.x + (it.coin + 0.5) * C, y + C / 2 - 2, t);
  }
  function drawBubbles(ctx, x, w, y, t, n) {
    ctx.fillStyle = 'rgba(220,245,255,0.7)';
    for (var i = 0; i < n; i++) {
      var p = mod(t * 1.6 + i * 0.37, 1);
      var bx = x + (i + 0.5) / n * w + Math.sin(t * 5 + i) * 3;
      ctx.beginPath(); ctx.arc(bx, y + C / 2 + 6 - p * 12, 1.5 + p * 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  /* Crocodiles are drawn facing right in "local" space and mirrored for
     left-moving lanes, so every shape below only has to be written once. */
  var CROC = { back: '#3f9a4a', side: '#27632f', belly: '#2f7a3a', scute: '#6fc27a', jaw: '#4aa856', jawSide: '#2f6e37',
    mouth: '#d8344a', mouthDark: '#8e1c2c', tooth: '#ffffff', eye: '#ffe14d', eyeWarn: '#ff3355' };
  function mirrorAround(ctx, cx, dir) {
    if (dir < 0) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  }
  // A croc floating downstream: rideable body + tail, head at the leading end.
  function drawCroc(ctx, rw, it, y, t) {
    var cy = y + C / 2 + 2, bodyX = it.x + C * 0.7, headX = it.x + it.w - C;
    ctx.save();
    mirrorAround(ctx, it.x + it.w / 2, rw.dir);
    ctx.fillStyle = 'rgba(0,15,35,0.3)';                                  // shadow on water
    U.roundRect(ctx, it.x + 6, cy - 6, it.w - 6, 20, 9); ctx.fill();
    // tail: tapered wedge with scutes
    ctx.fillStyle = CROC.side;
    ctx.beginPath(); ctx.moveTo(it.x, cy + 3); ctx.lineTo(bodyX + 4, cy - 6); ctx.lineTo(bodyX + 4, cy + 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = CROC.back;
    ctx.beginPath(); ctx.moveTo(it.x, cy); ctx.lineTo(bodyX + 4, cy - 10); ctx.lineTo(bodyX + 4, cy + 8); ctx.closePath(); ctx.fill();
    // legs paddling at the sides
    var kick = Math.sin(t * 6 + it.x * 0.1) * 2;
    ctx.fillStyle = CROC.side;
    ctx.fillRect(bodyX + 8 + kick, cy - 15, 8, 5); ctx.fillRect(headX - 16 - kick, cy - 15, 8, 5);
    ctx.fillRect(bodyX + 8 - kick, cy + 9, 8, 5); ctx.fillRect(headX - 16 + kick, cy + 9, 8, 5);
    // body: raised back with a lighter spine of scutes
    var bw = headX - bodyX + 6;
    ctx.fillStyle = CROC.side; U.roundRect(ctx, bodyX, cy - 8, bw, 20, 8); ctx.fill();
    ctx.fillStyle = CROC.back; U.roundRect(ctx, bodyX, cy - 12, bw, 19, 8); ctx.fill();
    ctx.fillStyle = CROC.scute;
    for (var k = bodyX + 6; k < headX - 2; k += 8) { ctx.fillRect(k, cy - 7, 4, 3); ctx.fillRect(k + 4, cy - 1, 4, 3); }
    drawCrocHeadLocal(ctx, headX, cy, it.ph, t);
    ctx.restore();
  }
  // Croc lurking in a lily-pad lane: only the head shows, with ripples.
  function drawCrocHead(ctx, hx, y, dir, ph, t) {
    var cy = y + C / 2 + 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(200,240,255,0.35)'; ctx.lineWidth = 1.5;
    var rr = 16 + mod(t * 10, 8);
    ctx.beginPath(); ctx.ellipse(hx + C / 2, cy + 4, rr, rr * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
    mirrorAround(ctx, hx + C / 2, dir);
    ctx.fillStyle = CROC.side; U.roundRect(ctx, hx - 4, cy - 9, 14, 20, 7); ctx.fill();    // neck in the water
    drawCrocHeadLocal(ctx, hx + 2, cy, ph, t);
    ctx.restore();
  }
  // Head facing right, from hx (back of the skull) to hx + C (snout tip).
  // The upper jaw lifts by `open`; open jaws show a red mouth and teeth.
  function drawCrocHeadLocal(ctx, hx, cy, ph, t) {
    var open = crocOpen(ph, t), warn = crocWarn(ph, t), lift = open * 14;
    var tip = hx + C - 2, k;
    // lower jaw (sits on the water)
    ctx.fillStyle = CROC.jawSide;
    ctx.beginPath(); ctx.moveTo(hx, cy - 7); ctx.lineTo(tip - 6, cy - 3); ctx.quadraticCurveTo(tip + 1, cy + 2, tip - 6, cy + 9); ctx.lineTo(hx, cy + 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = CROC.jaw;
    ctx.beginPath(); ctx.moveTo(hx, cy - 9); ctx.lineTo(tip - 6, cy - 5); ctx.quadraticCurveTo(tip + 1, cy, tip - 6, cy + 6); ctx.lineTo(hx, cy + 8); ctx.closePath(); ctx.fill();
    if (open > 0.05) {
      // mouth interior between the jaws
      ctx.fillStyle = CROC.mouthDark;
      ctx.beginPath(); ctx.moveTo(hx + 2, cy - 7); ctx.lineTo(tip - 6, cy - 4); ctx.lineTo(tip - 6, cy - 4 - lift); ctx.lineTo(hx + 2, cy - 9 - lift * 0.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = CROC.mouth;
      ctx.beginPath(); ctx.moveTo(hx + 4, cy - 6); ctx.lineTo(tip - 8, cy - 3); ctx.lineTo(tip - 8, cy + 3); ctx.lineTo(hx + 4, cy + 5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = CROC.tooth;                                            // bottom teeth
      for (k = hx + 7; k < tip - 8; k += 5) { ctx.beginPath(); ctx.moveTo(k, cy - 5); ctx.lineTo(k + 2, cy - 10); ctx.lineTo(k + 4, cy - 5); ctx.fill(); }
    }
    // upper jaw, lifted
    var uy = cy - 5 - lift;
    ctx.fillStyle = CROC.jawSide;
    ctx.beginPath(); ctx.moveTo(hx, uy - 4); ctx.lineTo(tip - 5, uy); ctx.quadraticCurveTo(tip + 2, uy + 4, tip - 5, uy + 8); ctx.lineTo(hx, uy + 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = CROC.back;
    ctx.beginPath(); ctx.moveTo(hx, uy - 7); ctx.lineTo(tip - 5, uy - 3); ctx.quadraticCurveTo(tip + 2, uy + 1, tip - 5, uy + 5); ctx.lineTo(hx, uy + 8); ctx.closePath(); ctx.fill();
    if (open > 0.05) {                                                       // top teeth hang down
      ctx.fillStyle = CROC.tooth;
      for (k = hx + 9; k < tip - 8; k += 5) { ctx.beginPath(); ctx.moveTo(k, uy + 9); ctx.lineTo(k + 2, uy + 13); ctx.lineTo(k + 4, uy + 9); ctx.fill(); }
    }
    ctx.fillStyle = '#1d4a24';                                               // nostrils
    ctx.fillRect(tip - 10, uy - 3, 2, 2); ctx.fillRect(tip - 10, uy + 2, 2, 2);
    // eye bumps at the back of the head (rise with the jaw a little)
    var ey = cy - 12 - lift * 0.4;
    ctx.fillStyle = CROC.back;
    ctx.beginPath(); ctx.arc(hx + 6, ey, 5, 0, Math.PI * 2); ctx.arc(hx + 6, ey + 11, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = warn ? CROC.eyeWarn : CROC.eye;
    ctx.fillRect(hx + 5, ey - 2, 4, 3); ctx.fillRect(hx + 5, ey + 9, 4, 3);
    ctx.fillStyle = '#05060f';
    ctx.fillRect(hx + 7, ey - 2, 1, 3); ctx.fillRect(hx + 7, ey + 9, 1, 3);
    if (warn) { glow(ctx, hx + 7, ey, 12, 'rgba(255,51,85,0.8)', 0.9); glow(ctx, hx + 7, ey + 11, 12, 'rgba(255,51,85,0.8)', 0.9); }
  }
  function drawPad(ctx, cx, y, t, P, seed) {
    var cy = y + C / 2 + 2 + Math.sin(t * 1.8 + seed) * 1.2;
    ellipse(ctx, cx + 2, cy + 4, 16, 8, 'rgba(0,15,35,0.3)');
    ellipse(ctx, cx, cy + 2, 16, 9, P.padDark);
    ellipse(ctx, cx, cy, 16, 9, P.pad);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 13, cy - 7); ctx.lineTo(cx + 16, cy - 1); ctx.closePath();
    ctx.fillStyle = P.water; ctx.fill();                                   // notch cut out of the pad
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 10, cy + 2); ctx.lineTo(cx, cy); ctx.lineTo(cx - 4, cy - 6); ctx.stroke();
    if (seed % 3 === 0) {
      ellipse(ctx, cx - 6, cy - 2, 3, 2.5, '#ff8fc0');
      ellipse(ctx, cx - 6, cy - 3, 1.5, 1.2, '#ffe14d');
    }
  }

  function drawTrain(ctx, rw, y) {
    var tr = rw.rail && rw.rail.train;
    if (!tr) return;
    var top = y + 6, d = C - 13, n = tr.cars.length, cw = tr.w / n;
    groundShadow(ctx, tr.x, top + 2, tr.w, d, 0.35);
    for (var i = 0; i < n; i++) {
      var cx = tr.x + i * cw;
      var engine = rw.dir > 0 ? i === n - 1 : i === 0;
      if (cx > W + 10 || cx + cw < -10) continue;
      if (engine) {
        box(ctx, cx + 1, top, cw - 2, d, 26, '#ff6b6b', '#c43b44');
        ctx.fillStyle = '#ffd23f'; ctx.fillRect(cx + 1, top + d - 12, cw - 2, 3);
        var wx = rw.dir > 0 ? cx + cw - 16 : cx + 4;
        ctx.fillStyle = '#26304a'; ctx.fillRect(wx, top + d - 24, 12, 8);
        ctx.fillStyle = 'rgba(160,210,255,0.5)'; ctx.fillRect(wx, top + d - 24, 12, 2);
        var fx = rw.dir > 0 ? cx + cw - 1 : cx + 1;
        glow(ctx, fx, top + d - 8, 26, 'rgba(255,245,200,0.95)');
        ctx.fillStyle = '#fff6c2'; ctx.fillRect(rw.dir > 0 ? fx - 3 : fx, top + d - 10, 3, 4);
      } else {
        var col = tr.cars[i];
        box(ctx, cx + 2, top + 1, cw - 4, d - 2, 24, shade(col, 0.12), shade(col, -0.25));
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (var k = cx + 6; k < cx + cw - 6; k += 6) ctx.fillRect(k, top + d - 22, 2, 18);
      }
      ctx.fillStyle = '#111318';
      ctx.fillRect(cx + 5, top + d - 1, 8, 3); ctx.fillRect(cx + cw - 13, top + d - 1, 8, 3);
    }
  }
  // Crossing signal at the end of the rail lane the train comes from.
  function drawCrossing(ctx, rw, y, t) {
    var R = rw.rail, x = rw.dir > 0 ? 4 : W - 16;
    var active = R && R.state !== 'idle';
    var on = Math.floor(t * 8) % 2 === 0;
    box(ctx, x + 4, y + C - 10, 3, 3, 24, '#d9dde6', '#9aa0ad');
    ctx.fillStyle = '#20242c'; U.roundRect(ctx, x - 2, y + 2, 16, 9, 3); ctx.fill();
    var l1 = active && on, l2 = active && !on;
    ellipse(ctx, x + 2, y + 6, 3, 3, l1 ? '#ff3355' : '#4a1822');
    ellipse(ctx, x + 10, y + 6, 3, 3, l2 ? '#ff3355' : '#4a1822');
    if (l1) glow(ctx, x + 2, y + 6, 16, 'rgba(255,51,85,0.9)');
    if (l2) glow(ctx, x + 10, y + 6, 16, 'rgba(255,51,85,0.9)');
  }

  // All the objects standing in one lane (drawn far-to-near, lane by lane).
  function drawLaneObjects(ctx, rw, y, t) {
    var P = BIOMES[rw.bi].pal, i, c;
    if (rw.type === 'pads') {
      for (c = 0; c < COLS; c++) {
        if (rw.pads[c] === 'pad') drawPad(ctx, c * C + C / 2, y, t, P, c + rw.hash);
        else if (rw.pads[c] === 'croc') drawCrocHead(ctx, c * C, y, rw.padDir[c], rw.padPh[c], t);
      }
    }
    if (rw.type === 'river') for (i = 0; i < rw.items.length; i++) {
      var it = rw.items[i];
      if (it.x > W + 10 || it.x + it.w < -10) continue;
      drawRiverItem(ctx, rw, it, y, t);
    }
    if (rw.type === 'rail') drawCrossing(ctx, rw, y, t);
    if (rw.deco) for (c = 0; c < COLS; c++) if (rw.deco[c]) DECO[rw.deco[c]](ctx, c * C, y, t, c + rw.hash, rw);
    if (rw.coins) for (c = 0; c < COLS; c++) if (rw.coins[c]) drawCoin(ctx, c * C + C / 2, y + C / 2 + 2, t);
    if (rw.type === 'road') for (i = 0; i < rw.items.length; i++) {
      var v = rw.items[i];
      if (v.x > W + 70 || v.x + v.w < -70) continue;
      drawVehicle(ctx, rw, v, y, t);
    }
    if (rw.type === 'rail') drawTrain(ctx, rw, y);
  }

  /* ================================================================ characters
     Drawn around the feet point (0,0). Body: 24 wide, 18 tall front face,
     12 deep top face. `face` is 'up' | 'down' | 'left' | 'right'. */
  var BW = 24, BH = 18, BD = 12;
  function drawBody(ctx, ch) {
    ctx.fillStyle = ch.side; ctx.fillRect(-BW / 2, -BH, BW, BH);
    ctx.fillStyle = ch.top; ctx.fillRect(-BW / 2, -BH - BD, BW, BD);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-BW / 2, -BH - BD, BW, 2);
  }
  function eyeX(face) { return face === 'left' ? [-11, -4] : face === 'right' ? [2, 8] : [-7, 4]; }
  function drawEyes(ctx, face, y, color, size) {
    if (face === 'up') return;
    var ex = eyeX(face);
    ctx.fillStyle = color || '#05060f';
    ctx.fillRect(ex[0], y, size || 3, size || 3); ctx.fillRect(ex[1], y, size || 3, size || 3);
  }
  function drawBeak(ctx, face, y, color) {
    ctx.fillStyle = color;
    if (face === 'down') ctx.fillRect(-2, y, 5, 4);
    else if (face === 'left') ctx.fillRect(-BW / 2 - 4, y - 1, 5, 4);
    else if (face === 'right') ctx.fillRect(BW / 2 - 1, y - 1, 5, 4);
    else ctx.fillRect(-2, -BH - BD - 3, 5, 4);
  }
  var CHAR_DRAW = {
    chick: function (ctx, ch, face) {
      ctx.fillStyle = '#ff9f1c'; ctx.fillRect(-7, -1, 4, 2); ctx.fillRect(3, -1, 4, 2);
      drawBody(ctx, ch);
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-3, -BH - BD - 4, 6, 5); ctx.fillRect(-1, -BH - BD - 7, 3, 3);
      ctx.fillStyle = '#d4d0bb'; ctx.fillRect(-BW / 2 - 2, -12, 3, 7); ctx.fillRect(BW / 2 - 1, -12, 3, 7);
      drawEyes(ctx, face, -BH + 3);
      drawBeak(ctx, face, -BH + 8, '#ff9f1c');
    },
    cat: function (ctx, ch, face) {
      ctx.fillStyle = '#c96a20';
      if (face !== 'up') { ctx.fillRect(BW / 2 - 4, -BH - BD - 10, 3, 12); ctx.fillRect(BW / 2 - 4, -BH - BD - 12, 6, 3); }
      drawBody(ctx, ch);
      ctx.fillStyle = '#c96a20';
      ctx.fillRect(-6, -BH - BD + 2, 3, 8); ctx.fillRect(1, -BH - BD + 2, 3, 8);
      ctx.fillStyle = ch.top;
      ctx.beginPath(); ctx.moveTo(-12, -BH - BD); ctx.lineTo(-12, -BH - BD - 7); ctx.lineTo(-5, -BH - BD); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -BH - BD); ctx.lineTo(12, -BH - BD - 7); ctx.lineTo(5, -BH - BD); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff8fb0'; ctx.fillRect(-11, -BH - BD - 3, 2, 3); ctx.fillRect(9, -BH - BD - 3, 2, 3);
      if (face === 'up') { ctx.fillStyle = '#c96a20'; ctx.fillRect(-1, -6, 3, 8); return; }
      drawEyes(ctx, face, -BH + 3, '#1a3a12');
      var nx = face === 'left' ? -8 : face === 'right' ? 5 : -1;
      ctx.fillStyle = '#ff6f91'; ctx.fillRect(nx, -BH + 8, 3, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(nx - 7, -BH + 9, 6, 1); ctx.fillRect(nx + 4, -BH + 9, 6, 1);
    },
    robot: function (ctx, ch, face, t) {
      ctx.fillStyle = '#6e7482'; ctx.fillRect(-8, -1, 5, 2); ctx.fillRect(3, -1, 5, 2);
      drawBody(ctx, ch);
      ctx.fillStyle = '#6e7482'; ctx.fillRect(-1, -BH - BD - 8, 2, 8);
      var blink = Math.floor(t * 3) % 2 === 0;
      ellipse(ctx, 0, -BH - BD - 9, 2.5, 2.5, blink ? '#ff4d6d' : '#7a2030');
      ctx.fillStyle = '#5a6376';
      ctx.fillRect(-BW / 2 + 1, -BH - BD + 3, 2, 2); ctx.fillRect(BW / 2 - 3, -BH - BD + 3, 2, 2);
      if (face === 'up') { ctx.fillStyle = '#5a6376'; ctx.fillRect(-6, -14, 12, 8); ctx.fillStyle = '#3ff0ff'; ctx.fillRect(-4, -12, 2, 2); return; }
      var vx = face === 'left' ? -BW / 2 : face === 'right' ? -BW / 2 + 5 : -BW / 2 + 2;
      ctx.fillStyle = '#1b2240'; ctx.fillRect(vx, -BH + 2, BW - 5, 7);
      ctx.save(); ctx.shadowColor = '#3ff0ff'; ctx.shadowBlur = 6;
      drawEyes(ctx, face, -BH + 4, '#3ff0ff');
      ctx.restore();
      ctx.fillStyle = '#6e7482'; ctx.fillRect(-5, -6, 10, 2);
    },
    frog: function (ctx, ch, face) {
      drawBody(ctx, ch);
      ctx.fillStyle = '#b8f0a0'; ctx.fillRect(-8, -9, 16, 7);
      box(ctx, -11, -BH - BD + 1, 8, 5, 5, ch.top, ch.side);
      box(ctx, 3, -BH - BD + 1, 8, 5, 5, ch.top, ch.side);
      if (face !== 'up') {
        var off = face === 'left' ? -1 : face === 'right' ? 1 : 0;
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-10, -BH - BD - 3, 6, 4); ctx.fillRect(4, -BH - BD - 3, 6, 4);
        ctx.fillStyle = '#05060f'; ctx.fillRect(-8 + off, -BH - BD - 2, 3, 3); ctx.fillRect(6 + off, -BH - BD - 2, 3, 3);
        ctx.fillStyle = '#1f6b2a'; ctx.fillRect(-6 + off * 3, -BH + 6, 12, 1.5);
      }
      ctx.fillStyle = '#3fa84a'; ctx.fillRect(-BW / 2 - 3, -3, 5, 3); ctx.fillRect(BW / 2 - 2, -3, 5, 3);
    },
    astro: function (ctx, ch, face) {
      ctx.fillStyle = '#9aa2b3'; ctx.fillRect(-8, -1, 5, 2); ctx.fillRect(3, -1, 5, 2);
      if (face === 'up') box(ctx, -8, -BH - 3, 16, 5, 13, '#d9dde6', '#9aa2b3', 2);
      drawBody(ctx, ch);
      ctx.fillStyle = ACCENT; ctx.fillRect(-BW / 2, -8, BW, 2);
      if (face === 'up') { box(ctx, -8, -BH - BD + 1, 16, 5, 6, '#e8ebf2', '#aeb5c4'); return; }
      var vx = face === 'left' ? -BW / 2 + 1 : face === 'right' ? -BW / 2 + 7 : -BW / 2 + 4;
      ctx.fillStyle = '#20263a'; U.roundRect(ctx, vx, -BH + 1, 16, 9, 3); ctx.fill();
      ctx.fillStyle = 'rgba(160,220,255,0.7)'; ctx.fillRect(vx + 2, -BH + 2, 6, 2);
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(vx + 11, -BH + 6, 3, 2);
    },
    penguin: function (ctx, ch, face) {
      ctx.fillStyle = '#ff9f1c'; ctx.fillRect(-8, -1, 5, 2); ctx.fillRect(3, -1, 5, 2);
      drawBody(ctx, ch);
      if (face !== 'up') {
        var bx = face === 'left' ? -9 : face === 'right' ? -5 : -7;
        ctx.fillStyle = '#f4f6fb'; U.roundRect(ctx, bx, -BH + 2, 14, BH - 3, 5); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillRect(-7, -BH - BD + 3, 14, 5);
      }
      drawEyes(ctx, face, -BH - 1, '#05060f', 2);
      drawBeak(ctx, face, -BH + 4, '#ff9f1c');
      ctx.fillStyle = ch.side; ctx.fillRect(-BW / 2 - 2, -13, 3, 8); ctx.fillRect(BW / 2 - 1, -13, 3, 8);
    }
  };
  function drawCharacter(ctx, id, face, t) {
    var ch = charById(id);
    CHAR_DRAW[ch.id](ctx, ch, face, t || 0);
  }

  /* ================================================================ fixed overlays */
  var VIGNETTE = null;
  function vignette() {
    if (VIGNETTE) return VIGNETTE;
    VIGNETTE = makeCanvas(W, H);
    var g = VIGNETTE.getContext('2d');
    var grd = g.createRadialGradient(W / 2, H * 0.55, H * 0.3, W / 2, H * 0.55, H * 0.78);
    grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.42)');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    return VIGNETTE;
  }

  /* ================================================================ the game */
  function create(api) {
    var rng = api.rng;
    var rows = [];
    var plan = [];                 // queued lane kinds for the next rows
    var player = { row: 0, x: C * 4.5, face: 'up', lastDir: 'up',
      hop: 0, slide: 0, fromRow: 0, fromX: C * 4.5, landT: 0, slid: false };
    var queued = null;
    var camRow = 0, started = false;
    var maxRow = 0, coins = 0, coinPts = 0, bonus = 0;
    var combo = 0, comboT = 0;
    var dead = false, deadT = 0, deathKind = '', death = null;
    var lastLeft = null;           // lane the player just hopped off (close-call bonus)
    var curBiome = 0, curLap = 0, banner = null, popup = null;
    var unlocked = { chick: true }, look = 'chick';
    var bestRow = U.store('road_hopper_best_row') || 0, recordShown = bestRow < 5;
    var dust = [], snow = [];
    var hopDeg = 0, mZone = '', mInt = -1, mBpm = -1, mFilt = 18000;
    var t = 0;

    /* ---------------------------------------------------------- row generation */
    function planGroup(r) {
      var B = BIOMES[biomeIndexAt(r)];
      var total = 0, i, pick = B.mix[0];
      for (i = 0; i < B.mix.length; i++) total += B.mix[i][1];
      var roll = rng() * total;
      for (i = 0; i < B.mix.length; i++) { roll -= B.mix[i][1]; if (roll <= 0) { pick = B.mix[i]; break; } }
      var n = pick[2] + rng.int(pick[3] - pick[2] + 1);
      if (r < GENTLE_ROWS) n = Math.min(n, 2);
      for (i = 0; i < n; i++) plan.push(pick[0]);
      var g = B.groundRun[0] + rng.int(B.groundRun[1] - B.groundRun[0] + 1);
      for (i = 0; i < g; i++) plan.push('ground');
    }
    function makeRow(r) {
      var prev = r > 0 ? rows[r - 1] : null;
      var prevReach = prev ? prev.reach : allColumns(true);
      var gate = r > 0 && r % BIOME_ROWS === 0;
      var type;
      if (r < START_ROWS) type = 'ground';
      else if (gate) { plan.length = 0; type = 'ground'; }
      else { if (!plan.length) planGroup(r); type = plan.shift(); }
      var rw = { type: type, bi: biomeIndexAt(r), lap: lapAt(r), dir: rng() < 0.5 ? -1 : 1, items: [],
        deco: null, coins: {}, gate: gate, hash: Math.floor(Math.random() * 997) };
      var B = BIOMES[rw.bi];
      if (type === 'ground') buildGround(rw, r, B, prevReach);
      else if (type === 'road') buildRoad(rw, r, B);
      else if (type === 'river') buildRiver(rw, r, B);
      else if (type === 'pads') buildPads(rw, r, B, prevReach);
      else if (type === 'rail') buildRail(rw, r);
      else buildIce(rw, r);
      if (!rw.reach) rw.reach = allColumns(true);
      return rw;
    }
    function row(r) {
      while (rows.length <= r) rows.push(makeRow(rows.length));
      return rows[r];
    }

    /* Fairness: `reach` marks the columns a player can stand on in a row.
       Moving lanes (road, river, rail, ice) let you reach any column. Ground
       and pads rows must share at least one column with the previous row's
       reach - if not, an obstacle is removed or a pad is added. */
    function floodReach(free, entry) {
      var reach = allColumns(false);
      for (var c = 0; c < COLS; c++) {
        if (!entry[c] || reach[c]) continue;
        var a = c, b = c;
        while (a > 0 && free[a - 1]) a--;
        while (b < COLS - 1 && free[b + 1]) b++;
        for (var k = a; k <= b; k++) reach[k] = true;
      }
      return reach;
    }
    function openColumns(prevReach) {
      var out = [];
      for (var c = 0; c < COLS; c++) if (prevReach[c]) out.push(c);
      return out.length ? out : [4, 5];
    }
    function buildGround(rw, r, B, prevReach) {
      rw.deco = {};
      var c, k;
      if (r > 0 && r < START_ROWS) { rw.deco[0] = B.deco[0]; rw.deco[COLS - 1] = B.deco[0]; }
      else if (rw.gate) { rw.deco[0] = 'post'; rw.deco[COLS - 1] = 'post'; }
      else if (r >= START_ROWS) {
        var n = rng.int(B.decoMax + 1);
        for (k = 0; k < n; k++) rw.deco[rng.int(COLS)] = B.deco[rng.int(B.deco.length)];
        if (rng() < 0.2) { c = rng.int(COLS); if (!rw.deco[c]) rw.coins[c] = true; }
      }
      var free = [], entry = [], any = false;
      for (c = 0; c < COLS; c++) { free[c] = !rw.deco[c]; entry[c] = free[c] && prevReach[c]; any = any || entry[c]; }
      if (!any) {
        var open = openColumns(prevReach);
        c = open[rng.int(open.length)];
        delete rw.deco[c]; free[c] = true; entry[c] = true;
      }
      rw.reach = floodReach(free, entry);
    }
    function buildRoad(rw, r, B) {
      var gentle = r < GENTLE_ROWS ? 0.8 : 1;
      rw.speed = Math.min(330, (55 + rng() * 85) * B.roadSpeed * difficulty(r) * gentle);
      rw.start = -4 * C;
      var x = rw.start;
      while (x < W + 4 * C) {
        var kind = B.vehicles[rng.int(B.vehicles.length)], V = VEHICLES[kind];
        rw.items.push(makeVehicle(kind, x, V.len * C));
        x += V.len * C + Math.max(C * (1.9 + rng() * 3.2), rw.speed * 0.6);
      }
      rw.span = x - rw.start;
      if (r >= 6 && rng() < 0.14) rw.coins[rng.int(COLS)] = true;
    }
    function makeVehicle(kind, x, w) {
      var V = VEHICLES[kind];
      var col = V.colors[Math.floor(Math.random() * V.colors.length)];          // visual only
      var cargo = CONTAINER_COLORS[Math.floor(Math.random() * CONTAINER_COLORS.length)];
      return { kind: kind, x: x, w: w, top: shade(col, 0.2), side: shade(col, -0.28),
        cargoTop: shade(cargo, 0.12), cargoSide: shade(cargo, -0.28) };
    }
    function buildRiver(rw, r, B) {
      var hazards = r >= GENTLE_ROWS;
      rw.speed = Math.min(150, (34 + rng() * 56) * B.riverSpeed * Math.min(1.8, difficulty(r)));
      rw.start = -4 * C;
      var x = rw.start, idx = 0, hasCroc = false, lastKind = '';
      while (x < W + 4 * C) {
        var kind = 'log';
        if (hazards && idx > 0) {
          if (B.croc && !hasCroc && rng() < B.croc) { kind = 'croc'; hasCroc = true; }
          else if (B.sink && lastKind !== 'sink' && rng() < B.sink) kind = 'sink';
        }
        var w = kind === 'croc' ? 3 * C : C * (2 + rng.int(3));
        var it = { kind: kind, x: x, w: w, ph: rng() * (kind === 'croc' ? CROC_CYCLE : SINK_CYCLE), coin: -1 };
        if (kind === 'log' && r >= 6 && rng() < 0.18) it.coin = rng.int(Math.floor(w / C));
        rw.items.push(it);
        lastKind = kind;
        x += w + C * (1.1 + rng() * 1.6);
        idx++;
      }
      rw.span = x - rw.start;
      // Fairness: keep at least two plain logs in every river lane.
      var plain = rw.items.filter(function (i) { return i.kind === 'log'; }).length;
      for (var k = rw.items.length - 1; k >= 0 && plain < 2; k--) {
        if (rw.items[k].kind !== 'log') { rw.items[k].kind = 'log'; plain++; }
      }
    }
    function buildPads(rw, r, B, prevReach) {
      rw.pads = {}; rw.padPh = {}; rw.padDir = {};
      var c, k, n = 3 + rng.int(3);
      for (k = 0; k < n; k++) rw.pads[rng.int(COLS)] = 'pad';
      var open = openColumns(prevReach), ok = false;
      for (k = 0; k < open.length; k++) if (rw.pads[open[k]]) ok = true;
      if (!ok) rw.pads[open[rng.int(open.length)]] = 'pad';
      if (B.padCroc && r >= GENTLE_ROWS && rng() < B.padCroc) {
        c = rng.int(COLS);
        if (!rw.pads[c]) { rw.pads[c] = 'croc'; rw.padPh[c] = rng() * CROC_CYCLE; rw.padDir[c] = rng() < 0.5 ? -1 : 1; }
      }
      var free = [], entry = [];
      for (c = 0; c < COLS; c++) { free[c] = rw.pads[c] === 'pad'; entry[c] = free[c] && prevReach[c]; }
      rw.reach = floodReach(free, entry);
      if (r >= 6 && rng() < 0.25) {
        var padCols = [];
        for (c = 0; c < COLS; c++) if (rw.pads[c] === 'pad') padCols.push(c);
        rw.coins[padCols[rng.int(padCols.length)]] = true;
      }
    }
    function buildRail(rw, r) {
      rw.rail = { state: 'idle', timer: 1 + rng() * 4, warn: 0, train: null, bellT: 0 };
      if (r >= 6 && rng() < 0.12) rw.coins[rng.int(COLS)] = true;
    }
    function buildIce(rw, r) {
      if (rng() < 0.22) rw.coins[rng.int(COLS)] = true;
    }
    row(0);

    /* ---------------------------------------------------------- lane queries */
    function screenY(r) { return Math.round(H - (r - camRow + 1) * C - 10); }
    function colOf(x) { return U.clamp(Math.floor(x / C), 0, COLS - 1); }
    function laneZone(type) { return type === 'river' || type === 'pads' ? 'water' : type === 'road' || type === 'rail' ? 'road' : type; }
    function riverItemAt(rw, x) {
      for (var i = 0; i < rw.items.length; i++) {
        var it = rw.items[i];
        if (x > it.x + 4 && x < it.x + it.w - 4) return it;
      }
      return null;
    }
    function onCrocHead(rw, it, x) {
      var hx = rw.dir > 0 ? it.x + it.w - C : it.x;
      return x > hx && x < hx + C;
    }
    function blockedAt(rw, x) { return rw.type === 'ground' && !!rw.deco[colOf(x)]; }
    // Where a hop in direction d from (r, x) lands, or null when it can't go.
    function hopTarget(r, x, d) {
      var nr = r, nx = x;
      if (d === 'up') nr++;
      else if (d === 'down') nr--;
      else if (d === 'left') nx -= C;
      else if (d === 'right') nx += C;
      if (nr < 0 || nr < Math.floor(camRow)) return null;
      if (nx < C / 2 - 1 || nx > W - C / 2 + 1) return null;
      var target = row(nr);
      var landX = target.type === 'river' ? nx : (colOf(nx) + 0.5) * C;
      if (blockedAt(target, landX)) return null;
      return { row: nr, x: landX };
    }

    /* ---------------------------------------------------------- movement */
    function tryMove(d) {
      if (dead) return;
      if (player.hop > 0 || player.slide > 0) { queued = d; return; }
      if (d === 'tap') d = 'up';
      player.face = d;
      var tg = hopTarget(player.row, player.x, d);
      if (!tg) {
        var nr = player.row + (d === 'up' ? 1 : d === 'down' ? -1 : 0);
        if (nr >= 0) api.audio.tone(120, 0.04, { type: 'square', vol: 0.06 });   // bump
        return;
      }
      if (!started) { started = true; showBanner(0, 0); }
      var from = row(player.row);
      if ((from.type === 'road' || from.type === 'rail') && tg.row !== player.row) lastLeft = { row: player.row, x: player.x, t: CLOSE_WINDOW };
      player.fromRow = player.row; player.fromX = player.x;
      player.row = tg.row; player.x = tg.x;
      player.hop = HOP; player.lastDir = d; player.slid = false;
      hopNote(tg.row - player.fromRow);
    }
    function hopNote(dr) {
      var m = M();
      if (m) {
        if (dr > 0) hopDeg = hopDeg >= 9 ? 3 : hopDeg + 1;          // forward climbs the scale
        else if (dr < 0) hopDeg = hopDeg <= -3 ? 3 : hopDeg - 1;    // back steps down
        m.note(BIOMES[curBiome].hopInst, hopDeg, { quantize: '16', octave: 1, gain: dr === 0 ? 0.35 : 0.6 });
      } else api.audio.tone(dr < 0 ? 360 : 480, 0.045, { type: 'triangle', vol: 0.1 });
    }
    // Ice: slide one more tile in the hop direction unless something blocks it.
    function slideTarget(r, x, d) {
      var tg = hopTarget(r, x, d);
      if (!tg) return null;
      return tg;
    }
    function startSlide() {
      var tg = slideTarget(player.row, player.x, player.lastDir);
      if (!tg) { spawnDust(player.x, screenY(player.row) + C / 2 + 8, '#ffffff', 4); return; }
      player.fromRow = player.row; player.fromX = player.x;
      player.row = tg.row; player.x = tg.x;
      player.slide = SLIDE; player.slid = true;
      api.audio.noise(0.12, { vol: 0.08, cutoff: 5000 });
      for (var i = 0; i < 6; i++) spawnDust(player.fromX, screenY(player.fromRow) + C / 2 + 8, '#e6f6ff', 1);
    }

    function land() {
      var rw = row(player.row);
      player.landT = LAND_SQUASH;
      spawnDust(player.x, screenY(player.row) + C / 2 + 9, dustColor(rw), 5);
      onProgress();
      musicZone(rw);
      if (rw.type === 'river') {
        var it = riverItemAt(rw, player.x);
        if (!it || !sinkRideable(it, t)) { die('splash'); return; }
        if (it.kind === 'croc' && onCrocHead(rw, it, player.x) && crocDanger(it.ph, t)) { die('chomp'); return; }
      } else if (rw.type === 'pads') {
        var c = colOf(player.x), pad = rw.pads[c];
        if (!pad) { die('splash'); return; }
        if (pad === 'croc' && crocDanger(rw.padPh[c], t)) { die('chomp'); return; }
      }
      collectTileCoin(rw);
      if (rw.type === 'ice' && !player.slid) startSlide();
    }
    function dustColor(rw) {
      var P = BIOMES[rw.bi].pal;
      return rw.type === 'river' || rw.type === 'pads' ? '#cfefff' : rw.type === 'ground' ? P.dotA : rw.type === 'ice' ? '#ffffff' : '#9aa0ad';
    }

    /* ---------------------------------------------------------- scoring + unlocks */
    function onProgress() {
      if (player.row <= maxRow) return;
      maxRow = player.row;
      var m = M();
      if (maxRow % 50 === 0) {
        api.fx.text(W / 2, 150, maxRow + ' ROWS', BIOMES[curBiome].pal.accent, 16);
        if (m) m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4 }, { deg: 9, at: 6, steps: 6 }],
          { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.6 });
        else api.audio.arp([523, 659, 784], 0.06, { type: 'triangle', vol: 0.16 });
      } else if (maxRow % 10 === 0 && m) {
        m.stinger([{ deg: 4 }, { deg: 7, at: 2, steps: 2 }], { inst: BIOMES[curBiome].hopInst, quantize: '8', octave: 1, gain: 0.55 });
      }
      if (!recordShown && maxRow > bestRow) {
        recordShown = true;
        api.fx.text(W / 2, 185, 'NEW BEST ROW!', COIN, 14);
        if (m) m.stinger([{ deg: 7 }, { deg: 9, at: 1 }, { deg: 11, at: 2, steps: 3 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.5 });
      }
      var bi = biomeIndexAt(maxRow), lap = lapAt(maxRow);
      if (bi !== curBiome || lap !== curLap) enterBiome(bi, lap);
      checkUnlocks();
      musicProgress();
    }
    function collectTileCoin(rw) {
      var c = colOf(player.x);
      if (rw.coins[c]) { rw.coins[c] = false; gotCoin(); }
    }
    function collectLogCoin(rw, it) {
      if (!it || it.coin < 0) return;
      var cx = it.x + (it.coin + 0.5) * C;
      if (Math.abs(player.x - cx) < C * 0.55) { it.coin = -1; gotCoin(); }
    }
    function gotCoin() {
      coins++;
      combo = comboT > 0 ? combo + 1 : 1;
      comboT = COMBO_WINDOW;
      var pts = 25 + 10 * Math.min(4, combo - 1);
      coinPts += pts;
      var y = screenY(player.row) + C / 2;
      api.fx.burst(player.x, y, COIN, 14, 120);
      api.fx.text(player.x, y - 24, '+' + pts + (combo > 1 ? ' x' + combo : ''), COIN, 11);
      var m = M();
      if (m) m.stinger([{ deg: 7 + Math.min(4, combo - 1) }, { deg: 9 + Math.min(4, combo - 1), at: 1 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.5 });
      else api.audio.arp([988, 1319], 0.04, { type: 'square', vol: 0.12 });
      checkUnlocks();
    }
    function checkUnlocks() {
      for (var i = 0; i < CHARACTERS.length; i++) {
        var ch = CHARACTERS[i];
        if (unlocked[ch.id] || !ch.need) continue;
        if ((ch.need.coins && coins >= ch.need.coins) || (ch.need.row && maxRow >= ch.need.row)) {
          unlocked[ch.id] = true;
          look = ch.id;
          popup = { id: ch.id, title: 'NEW HOPPER!', name: ch.name, t: 0 };
          var m = M();
          if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 11, at: 3, steps: 4 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.55 });
          else api.audio.arp([660, 880, 1100], 0.06, { type: 'triangle', vol: 0.14 });
          api.fx.burst(player.x, screenY(player.row) + C / 2, '#ffffff', 22, 160);
        }
      }
    }
    function cycleLook(step) {
      var ids = CHARACTERS.filter(function (ch) { return unlocked[ch.id]; }).map(function (ch) { return ch.id; });
      if (ids.length < 2) return;
      var i = ids.indexOf(look);
      look = ids[mod(i + step, ids.length)];
      popup = { id: look, title: 'HOPPER', name: charById(look).name, t: 0.9 };
      api.audio.tone(760, 0.05, { type: 'triangle', vol: 0.1 });
    }
    function checkCloseCall(dt) {
      if (!lastLeft) return;
      lastLeft.t -= dt;
      if (lastLeft.t <= 0) { lastLeft = null; return; }
      var rw = row(lastLeft.row), x = lastLeft.x, hit = false, train = false;
      if (rw.type === 'road') {
        for (var i = 0; i < rw.items.length; i++) { var it = rw.items[i]; if (x + 14 > it.x && x - 14 < it.x + it.w) hit = true; }
      } else if (rw.type === 'rail' && rw.rail.train) {
        var tr = rw.rail.train;
        if (x + 14 > tr.x && x - 14 < tr.x + tr.w) { hit = true; train = true; }
      }
      if (!hit) return;
      var pts = train ? 40 : 15;
      bonus += pts;
      api.fx.text(x, screenY(lastLeft.row) + 6, (train ? 'WHOOSH +' : 'CLOSE CALL +') + pts, train ? '#ff6b6b' : '#fff4b8', 11);
      api.audio.tone(train ? 1400 : 1200, 0.07, { type: 'triangle', vol: 0.1, slide: 1.3 });
      lastLeft = null;
    }
    function totalScore() { return maxRow * 10 + coinPts + bonus; }

    /* ---------------------------------------------------------- death */
    function die(kind) {
      if (dead) return;
      dead = true; deathKind = kind;
      death = { kind: kind, x: player.x, row: player.row, t: 0 };
      var y = screenY(player.row) + C / 2;
      if (kind === 'splash') {
        api.fx.burst(player.x, y, '#7fd6ff', 30, 160, 0.8);
        api.audio.noise(0.4, { vol: 0.25, cutoff: 1200 });
      } else if (kind === 'chomp') {
        api.fx.burst(player.x, y, '#ff3355', 24, 170, 0.7);
        api.fx.text(player.x, y - 30, 'CHOMP!', '#ff3355', 14);
        api.audio.tone(90, 0.25, { type: 'sawtooth', slide: 0.5, vol: 0.3 });
      } else {
        api.fx.burst(player.x, y, '#ffffff', 28, 200, 0.8);
        api.fx.burst(player.x, y, charById(look).top, 16, 160, 0.6);
        api.audio.tone(140, 0.3, { type: 'square', slide: 0.4, vol: 0.28 });
      }
      if (kind === 'caught') api.fx.text(W / 2, H - 80, 'TOO SLOW!', '#ff4d6d', 16);
      api.shake(kind === 'train' ? 16 : 9);
      if (maxRow > bestRow) U.store('road_hopper_best_row', maxRow);
    }

    /* ---------------------------------------------------------- biomes + music */
    function showBanner(bi, lap) {
      var B = BIOMES[bi];
      banner = { name: B.name, sub: (lap ? 'LAP ' + (lap + 1) + ' - ' : '') + B.sub, color: B.pal.accent, t: 0 };
    }
    function enterBiome(bi, lap) {
      curBiome = bi; curLap = lap;
      showBanner(bi, lap);
      var m = M();
      if (!m) { api.audio.arp([392, 523, 659, 784], 0.07, { type: 'triangle', vol: 0.14 }); return; }
      var song = SONGS[BIOMES[bi].song];
      m.play(song, { fade: 2, intensity: 0.15, keepFilter: true });
      m.setKey(song.key + LAP_KEYS[lap % LAP_KEYS.length]);
      m.note('riser', 0, { dur: 1.2, gain: 0.25 });
      mZone = ''; mBpm = -1; mInt = -1;
      musicZone(row(player.row));
      musicProgress();
    }
    function musicZone(rw) {
      var m = M();
      var zone = laneZone(rw.type);
      if (!m || zone === mZone) return;
      mZone = zone;
      var drums = zone === 'water' ? false : zone === 'road' ? true : null;
      m.setTrack('kick', drums); m.setTrack('hat', drums);
      m.setTrack('clap', zone === 'water' ? false : null);
      m.setTrack('pad', zone === 'water' || zone === 'ice' ? true : null);
      var f = zone === 'water' ? 1500 : zone === 'ice' ? 4200 : 18000;
      if (f !== mFilt) { m.setFilter(f, f > mFilt ? 0.5 : 0.8); mFilt = f; }
    }
    function musicProgress() {
      var m = M();
      if (!m) return;
      var into = maxRow % BIOME_ROWS;
      var iv = Math.round(U.clamp(0.15 + into / BIOME_ROWS * 0.8 + curLap * 0.05, 0, 1) * 20) / 20;
      if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
      var bpm = SONGS[BIOMES[curBiome].song].bpm + curLap * 4 + (into >= BIOME_ROWS / 2 ? 2 : 0);
      if (bpm !== mBpm) { m.setTempo(bpm, mBpm < 0 ? 0.01 : 2); mBpm = bpm; }
    }

    /* ---------------------------------------------------------- world update */
    function moveItems(rw, dt) {
      for (var i = 0; i < rw.items.length; i++) {
        var it = rw.items[i];
        it.x = rw.start + mod(it.x + rw.dir * rw.speed * dt - rw.start, rw.span);
      }
    }
    function updateRail(rw, r, dt) {
      var R = rw.rail, near = Math.abs(r - player.row) <= 6;
      if (R.state === 'idle') {
        R.timer -= dt;
        if (R.timer <= 0) { R.state = 'warn'; R.warn = Math.max(1.2, TRAIN_WARN - rw.lap * 0.1); R.bellT = 0; }
      } else if (R.state === 'warn') {
        R.warn -= dt;
        R.bellT -= dt;
        if (R.bellT <= 0) {
          R.bellT = 0.26;
          if (near && !dead) api.audio.tone(1568, 0.08, { type: 'square', vol: 0.05 });
        }
        if (R.warn <= 0) spawnTrain(rw, r, near);
      } else {
        var tr = R.train;
        tr.x += rw.dir * tr.speed * dt;
        if (tr.x > W + C * 2 || tr.x + tr.w < -C * 2) { R.state = 'idle'; R.train = null; R.timer = 2.5 + rng() * 4.5; }
      }
    }
    function spawnTrain(rw, r, near) {
      var n = 4 + rng.int(3), w = n * C * 1.5;
      var cars = [];
      for (var i = 0; i < n; i++) cars.push(CONTAINER_COLORS[Math.floor(Math.random() * CONTAINER_COLORS.length)]);
      rw.rail.train = { x: rw.dir > 0 ? -w - C : W + C, w: w, cars: cars,
        speed: Math.min(1100, (760 + rng() * 140) * Math.min(1.3, difficulty(r))) };
      rw.rail.state = 'pass';
      if (near && !dead) {
        api.audio.tone(233, 0.4, { type: 'sawtooth', vol: 0.06 });
        api.audio.tone(294, 0.4, { type: 'sawtooth', vol: 0.05 });
        api.shake(4);
      }
    }
    function updateWorld(dt) {
      var lo = Math.max(0, Math.floor(camRow) - 1), hi = Math.floor(camRow) + 16;
      for (var r = lo; r <= hi; r++) {
        var rw = row(r);
        if (rw.type === 'road' || rw.type === 'river') moveItems(rw, dt);
        else if (rw.type === 'rail') updateRail(rw, r, dt);
      }
    }
    function updateHopAndSlide(dt) {
      if (player.landT > 0) player.landT = Math.max(0, player.landT - dt);
      if (player.hop > 0) {
        player.hop -= dt;
        if (player.hop <= 0) { player.hop = 0; land(); }
      } else if (player.slide > 0) {
        player.slide -= dt;
        if (player.slide <= 0) { player.slide = 0; land(); }
      }
      if (!dead && player.hop === 0 && player.slide === 0 && queued) { var q = queued; queued = null; tryMove(q); }
    }
    // Riding, drowning, croc jaws, cars and trains.
    function checkHazards(dt) {
      var cur = row(player.row);
      var settled = player.hop === 0 && player.slide === 0;
      if (settled && cur.type === 'river') {
        var it = riverItemAt(cur, player.x);
        if (!it || !sinkRideable(it, t)) { die('splash'); return; }
        if (it.kind === 'croc' && onCrocHead(cur, it, player.x) && crocDanger(it.ph, t)) { die('chomp'); return; }
        player.x += cur.dir * cur.speed * dt;
        if (player.x < 4 || player.x > W - 4) { die('splash'); return; }
        collectLogCoin(cur, it);
      }
      if (settled && cur.type === 'pads') {
        var c = colOf(player.x);
        if (cur.pads[c] === 'croc' && crocDanger(cur.padPh[c], t)) { die('chomp'); return; }
      }
      var inLane = (player.hop === 0 || player.hop < HOP * 0.5) && (player.slide === 0 || player.slide < SLIDE * 0.5);
      if (!inLane) return;
      if (cur.type === 'road') {
        for (var i = 0; i < cur.items.length; i++) {
          var v = cur.items[i];
          if (player.x + 12 > v.x && player.x - 12 < v.x + v.w) { die('squash'); return; }
        }
      } else if (cur.type === 'rail' && cur.rail.train) {
        var tr = cur.rail.train;
        if (player.x + 12 > tr.x && player.x - 12 < tr.x + tr.w) die('train');
      }
    }
    function updateCamera(dt) {
      var target = Math.max(0, player.row - 4);
      if (target > camRow) camRow += (target - camRow) * Math.min(1, dt * 5);
      if (started) camRow += Math.min(0.9, 0.16 + maxRow * 0.004) * dt;
      if (!dead && player.row < camRow - 0.6) die('caught');
    }

    /* ---------------------------------------------------------- particles (visual only) */
    function spawnDust(x, y, color, n) {
      for (var i = 0; i < n; i++) {
        if (dust.length >= MAX_DUST) dust.shift();
        var a = Math.random() * Math.PI;
        dust.push({ x: x + (Math.random() - 0.5) * 16, y: y, vx: Math.cos(a) * (20 + Math.random() * 40), vy: -Math.random() * 25,
          life: 0.45, max: 0.45, r: 2 + Math.random() * 3, color: color });
      }
    }
    function updateParticles(dt) {
      for (var i = dust.length - 1; i >= 0; i--) {
        var p = dust[i];
        p.life -= dt;
        if (p.life <= 0) { dust.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.9; p.vy *= 0.9;
      }
      var winter = BIOMES[biomeIndexAt(Math.floor(camRow) + 6)].id === 'winter';
      if (winter && snow.length < MAX_SNOW && Math.random() < 0.6) snow.push({ x: Math.random() * W, y: -6, s: 1 + Math.random() * 2, v: 25 + Math.random() * 35, ph: Math.random() * 6 });
      for (i = snow.length - 1; i >= 0; i--) {
        var f = snow[i];
        f.y += f.v * dt; f.x += Math.sin(t + f.ph) * 12 * dt;
        if (f.y > H + 6) snow.splice(i, 1);
      }
    }

    /* ---------------------------------------------------------- input */
    function readMoves() {
      var inp = api.input, moves = [];
      ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d)) moves.push(d); });
      if (inp.hit('a')) moves.push('up');
      inp.takeSwipes().forEach(function (s) { moves.push(s); });
      if (inp.hit('b')) cycleLook(-1);
      if (inp.hit('c')) cycleLook(1);
      return moves;
    }

    if (M()) M().play(SONGS[0], { fade: 1.2, intensity: 0 });

    /* ---------------------------------------------------------- rendering */
    function playerView() {
      var k, r = player.row, x = player.x, lift = 0, sx = 1, sy = 1;
      if (player.hop > 0) {
        k = 1 - player.hop / HOP;
        r = player.fromRow + (player.row - player.fromRow) * k;
        x = player.fromX + (player.x - player.fromX) * k;
        lift = Math.sin(k * Math.PI) * HOP_LIFT;
        sy = 1 + 0.2 * Math.sin(k * Math.PI); sx = 1 - 0.1 * Math.sin(k * Math.PI);
      } else if (player.slide > 0) {
        k = 1 - player.slide / SLIDE;
        r = player.fromRow + (player.row - player.fromRow) * k;
        x = player.fromX + (player.x - player.fromX) * k;
        sx = 1.08; sy = 0.92;
      } else if (player.landT > 0) {
        var q = player.landT / LAND_SQUASH;
        sy = 1 - 0.26 * q; sx = 1 + 0.2 * q;
      }
      return { row: r, x: x, lift: lift, sx: sx, sy: sy, y: screenY(r) + C / 2 + 10 };
    }
    function drawPlayer(ctx, pv) {
      ellipse(ctx, pv.x + 2, pv.y - 1, 14 - pv.lift * 0.3, 5 - pv.lift * 0.1, 'rgba(0,0,0,0.3)');
      ctx.save();
      ctx.translate(pv.x, pv.y - pv.lift);
      ctx.scale(pv.sx, pv.sy);
      drawCharacter(ctx, look, player.face, t);
      ctx.restore();
    }
    function drawDeath(ctx) {
      var y = screenY(death.row) + C / 2 + 10;
      if (death.kind === 'squash' || death.kind === 'caught') {
        ctx.save(); ctx.translate(death.x, y); ctx.scale(1.4, 0.28);
        drawCharacter(ctx, look, 'down', t);
        ctx.restore();
      } else if (death.kind === 'splash') {
        ctx.strokeStyle = 'rgba(220,245,255,0.8)'; ctx.lineWidth = 2;
        for (var i = 0; i < 3; i++) {
          var rr = 6 + (deadT * 40 + i * 9) % 30;
          ctx.globalAlpha = Math.max(0, 1 - rr / 36);
          ctx.beginPath(); ctx.ellipse(death.x, y - 8, rr, rr * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    }
    // Slide cue: when a hop would land on ice, mark that ice tile with an
    // arrow and outline the tile the slide will end on (red bar = blocked).
    var ICE_CUE = '#1669c9';
    function drawSlideCues(ctx) {
      if (dead || player.hop > 0 || player.slide > 0) return;
      var pulse = 0.65 + 0.3 * Math.sin(t * 6);
      ['up', 'left', 'right', 'down'].forEach(function (d) {
        var tg = hopTarget(player.row, player.x, d);
        if (!tg || row(tg.row).type !== 'ice') return;
        var ax = tg.x, ay = screenY(tg.row) + C / 2;
        var end = slideTarget(tg.row, tg.x, d);
        var ang = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 }[d];
        ctx.save();
        ctx.globalAlpha = pulse * (d === 'down' ? 0.55 : 1);
        ctx.fillStyle = 'rgba(22,105,201,0.22)';
        U.roundRect(ctx, ax - C / 2 + 3, ay - C / 2 + 3, C - 6, C - 6, 6); ctx.fill();
        ctx.strokeStyle = end ? ICE_CUE : '#ff3355'; ctx.lineWidth = 2;
        U.roundRect(ctx, ax - C / 2 + 3, ay - C / 2 + 3, C - 6, C - 6, 6); ctx.stroke();
        if (!end) {                                   // blocked: stop bar on the far side
          ctx.fillStyle = '#ff3355';
          ctx.translate(ax, ay); ctx.rotate(ang);
          ctx.fillRect(10, -11, 5, 22);
          ctx.restore();
          return;
        }
        // double chevron pointing along the slide
        ctx.save();
        ctx.translate(ax, ay); ctx.rotate(ang);
        ctx.fillStyle = ICE_CUE; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
        [-7, 3].forEach(function (o) {
          ctx.beginPath(); ctx.moveTo(o, -8); ctx.lineTo(o + 8, 0); ctx.lineTo(o, 8); ctx.lineTo(o - 4, 8); ctx.lineTo(o + 4, 0); ctx.lineTo(o - 4, -8); ctx.closePath();
          ctx.fill(); ctx.stroke();
        });
        ctx.restore();
        // destination tile: dashed outline
        var bx = end.x, by = screenY(end.row) + C / 2;
        ctx.setLineDash([5, 4]); ctx.strokeStyle = ICE_CUE; ctx.lineWidth = 2.5;
        U.roundRect(ctx, bx - C / 2 + 5, by - C / 2 + 5, C - 10, C - 10, 6); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });
    }
    function drawBestMarker(ctx) {
      if (bestRow < 5) return;
      var y = screenY(bestRow);
      if (y < -C || y > H) return;
      ctx.save();
      ctx.strokeStyle = COIN; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(0, y + C); ctx.lineTo(W, y + C); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(10,10,20,0.7)'; ctx.fillRect(W - 76, y + C - 16, 72, 14);
      ctx.fillStyle = COIN; ctx.font = '700 10px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('BEST ' + bestRow, W - 40, y + C - 9);
      ctx.restore();
    }
    function drawHud(ctx) {
      var B = BIOMES[curBiome], into = maxRow % BIOME_ROWS;
      ctx.save();
      ctx.fillStyle = 'rgba(5,8,16,0.62)';
      U.roundRect(ctx, 8, 8, 132, 30, 7); ctx.fill();
      ctx.font = '800 11px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = B.pal.accent; ctx.fillText(B.name + (curLap ? ' ' + (curLap + 1) : ''), 16, 19);
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(16, 28, 116, 4);
      ctx.fillStyle = B.pal.accent; ctx.fillRect(16, 28, 116 * into / BIOME_ROWS, 4);
      ctx.fillStyle = 'rgba(5,8,16,0.62)';
      U.roundRect(ctx, W - 92, 8, 84, 30, 7); ctx.fill();
      ellipse(ctx, W - 76, 23, 7, 8, COIN);
      ctx.fillStyle = '#fff6c2'; ctx.fillRect(W - 77, 18, 2, 10);
      ctx.fillStyle = '#ffffff'; ctx.font = '800 13px ' + FONT; ctx.textAlign = 'left';
      ctx.fillText(String(coins), W - 62, 23);
      if (combo > 1 && comboT > 0) {
        ctx.fillStyle = COIN; ctx.font = '800 10px ' + FONT; ctx.textAlign = 'right';
        ctx.fillText('x' + combo, W - 14, 23);
      }
      ctx.restore();
    }
    function drawBanner(ctx) {
      if (!banner) return;
      var a = Math.min(1, banner.t * 3, (2.8 - banner.t) * 2);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = 'rgba(5,8,16,0.55)'; ctx.fillRect(0, 104, W, 58);
      ctx.fillStyle = banner.color; ctx.fillRect(0, 104, W, 2); ctx.fillRect(0, 160, W, 2);
      U.glowText(ctx, banner.name, W / 2, 126, 20, banner.color);
      ctx.font = '700 10px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText(banner.sub, W / 2, 148);
      ctx.restore();
    }
    function drawPopup(ctx) {
      if (!popup) return;
      var a = Math.max(0, Math.min(1, popup.t * 4, (2.6 - popup.t) * 2));
      var x0 = W / 2 - 104, y0 = H - 70, w = 208, h = 60;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(5,8,16,0.8)'; U.roundRect(ctx, x0, y0, w, h, 10); ctx.fill();
      ctx.strokeStyle = COIN; ctx.lineWidth = 2; U.roundRect(ctx, x0, y0, w, h, 10); ctx.stroke();
      ctx.save(); ctx.translate(x0 + 34, y0 + 50); ctx.scale(1.3, 1.3);
      drawCharacter(ctx, popup.id, 'down', t);
      ctx.restore();
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = COIN; ctx.font = '800 10px ' + FONT; ctx.fillText(popup.title, x0 + 70, y0 + 15);
      ctx.fillStyle = '#ffffff'; ctx.font = '800 13px ' + FONT; ctx.fillText(popup.name, x0 + 70, y0 + 32);
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '700 9px ' + FONT; ctx.fillText('Z / X TO SWAP', x0 + 70, y0 + 48);
      ctx.restore();
    }
    function nextUnlockText() {
      for (var i = 0; i < CHARACTERS.length; i++) {
        var ch = CHARACTERS[i];
        if (!unlocked[ch.id] && ch.need) return ch.name + ' AT ' + needText(ch.need);
      }
      return '';
    }

    return {
      update: function (dt) {
        t += dt;
        var moves = readMoves();
        if (!dead) moves.forEach(tryMove);
        row(player.row + 22);                      // keep generation ahead of the camera
        updateWorld(dt);
        updateParticles(dt);
        if (banner) { banner.t += dt; if (banner.t > 2.8) banner = null; }
        if (popup) { popup.t += dt; if (popup.t > 2.6) popup = null; }
        if (dead) { deadT += dt; if (death) death.t += dt; if (deadT > 1.2) api.gameOver(); return; }
        updateHopAndSlide(dt);
        if (!dead) checkHazards(dt);
        if (!dead) checkCloseCall(dt);
        if (comboT > 0) { comboT -= dt; if (comboT <= 0) combo = 0; }
        updateCamera(dt);
        api.setScore(totalScore());
        api.setStatus('ROW ' + maxRow + '  ·  ' + BIOMES[curBiome].name + (coins ? '  ·  COINS ' + coins : ''));
      },

      render: function (ctx) {
        var first = Math.max(0, Math.floor(camRow) - 1), last = Math.floor(camRow) + 15, r, rw, y;
        ctx.fillStyle = BIOMES[biomeIndexAt(first)].pal.bg;
        ctx.fillRect(0, 0, W, H);
        for (r = first; r <= last; r++) drawLaneBase(ctx, row(r), r, screenY(r));
        for (r = first; r <= last; r++) drawLaneLip(ctx, row(r), r > 0 ? row(r - 1) : null, screenY(r));
        for (r = first; r <= last; r++) {
          drawLaneDetail(ctx, row(r), row(r + 1), r > 0 ? row(r - 1) : null, screenY(r), t);
        }
        drawBestMarker(ctx);
        var pv = playerView(), pRow = Math.round(pv.row);
        for (r = last; r >= first; r--) {
          rw = row(r); y = screenY(r);
          if (y > H + C || y < -C * 2) continue;
          if (dead && death && r === death.row && death.kind !== 'squash' && death.kind !== 'caught') drawDeath(ctx);
          drawLaneObjects(ctx, rw, y, t);
          if (dead && death && r === death.row && (death.kind === 'squash' || death.kind === 'caught')) drawDeath(ctx);
          if (!dead && r === pRow) drawPlayer(ctx, pv);
        }
        drawSlideCues(ctx);
        for (var i = 0; i < dust.length; i++) {
          var p = dust[i];
          ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.8;
          ellipse(ctx, p.x, p.y, p.r, p.r * 0.8, p.color);
        }
        ctx.globalAlpha = 1;
        if (snow.length) {
          ctx.fillStyle = '#ffffff';
          for (i = 0; i < snow.length; i++) { ctx.globalAlpha = 0.75; ctx.fillRect(snow[i].x, snow[i].y, snow[i].s, snow[i].s); }
          ctx.globalAlpha = 1;
        }
        ctx.drawImage(vignette(), 0, 0);
        drawHud(ctx);
        drawBanner(ctx);
        drawPopup(ctx);
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'HOP FORWARD TO START', W / 2, 96, 14, '#c9ffe0');
          ctx.restore();
          ctx.save();
          ctx.font = '700 10px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText('COINS + DISTANCE UNLOCK NEW HOPPERS', W / 2, 124);
          ctx.restore();
        }
      },

      // Read-only test hook.
      debug: function () {
        var cur = row(player.row), kind = cur.type;
        if (cur.type === 'river') { var it = riverItemAt(cur, player.x); kind += ':' + (it ? it.kind : 'water'); }
        if (cur.type === 'pads') kind += ':' + (cur.pads[colOf(player.x)] || 'water');
        return { row: player.row, maxRow: maxRow, x: player.x, col: colOf(player.x), biome: BIOMES[curBiome].name, biomeIndex: curBiome, lap: curLap,
          character: look, unlocked: Object.keys(unlocked), nextUnlock: nextUnlockText(), coins: coins, combo: combo,
          lane: cur.type, laneKind: kind, hopping: player.hop > 0, sliding: player.slide > 0, dead: dead, deathKind: deathKind,
          started: started, camRow: camRow, bestRow: bestRow, score: totalScore(), rowPoints: maxRow * 10, coinPoints: coinPts, bonus: bonus };
      }
    };
  }

  /* ================================================================ attract preview
     A looping mini scene that cycles through the biomes and hopper looks,
     drawn with the same lane/vehicle/character art as the game. */
  var ATTRACT_LANES = {
    suburbs: ['ground', 'road', 'road', 'ground', 'river', 'river', 'ground', 'pads', 'ground', 'road', 'ground'],
    highway: ['ground', 'road', 'road', 'road', 'road', 'ground', 'rail', 'ground', 'road', 'road', 'ground'],
    docks: ['ground', 'river', 'river', 'ground', 'pads', 'ground', 'road', 'ground', 'river', 'river', 'ground'],
    railyard: ['ground', 'rail', 'rail', 'ground', 'road', 'ground', 'rail', 'rail', 'ground', 'river', 'ground'],
    winter: ['ground', 'ice', 'ground', 'road', 'road', 'ground', 'river', 'river', 'ground', 'ice', 'ground']
  };
  var ATTRACT_CACHE = {};
  function attractRow(bi, i, kind) {
    var key = bi + ':' + i;
    if (ATTRACT_CACHE[key]) return ATTRACT_CACHE[key];
    var B = BIOMES[bi], vr = U.rng(700 + bi * 31 + i * 7);
    var rw = { type: kind, bi: bi, dir: i % 2 ? 1 : -1, items: [], deco: null, coins: {}, hash: i * 37 + bi * 11, start: -4 * C };
    var x, c;
    if (kind === 'ground') {
      rw.deco = {};
      if (i > 0) for (c = 0; c < 2; c++) { var dc = Math.floor(vr() * COLS); if (dc !== 4 && dc !== 5) rw.deco[dc] = B.deco[Math.floor(vr() * B.deco.length)]; }
      if (vr() < 0.3) rw.coins[Math.floor(vr() * 3) + 6] = true;
    } else if (kind === 'road') {
      rw.speed = 60 + vr() * 70;
      for (x = rw.start; x < W + 4 * C;) {
        var vk = B.vehicles[Math.floor(vr() * B.vehicles.length)], V = VEHICLES[vk], col = V.colors[Math.floor(vr() * V.colors.length)];
        var cg = CONTAINER_COLORS[Math.floor(vr() * CONTAINER_COLORS.length)];
        rw.items.push({ kind: vk, x: x, w: V.len * C, top: shade(col, 0.2), side: shade(col, -0.28), cargoTop: shade(cg, 0.12), cargoSide: shade(cg, -0.28) });
        x += V.len * C + C * (2.2 + vr() * 2.5);
      }
      rw.span = x - rw.start;
    } else if (kind === 'river') {
      rw.speed = 30 + vr() * 30;
      for (x = rw.start; x < W + 4 * C;) {
        var rk = B.croc && vr() < 0.4 ? 'croc' : B.sink && vr() < 0.4 ? 'sink' : 'log';
        var w = rk === 'croc' ? 3 * C : C * (2 + Math.floor(vr() * 2));
        rw.items.push({ kind: rk, x: x, w: w, ph: vr() * 4, coin: -1 });
        x += w + C * (1.2 + vr() * 1.2);
      }
      rw.span = x - rw.start;
    } else if (kind === 'pads') {
      rw.pads = {}; rw.padPh = {}; rw.padDir = {};
      for (c = 0; c < COLS; c += 2) rw.pads[c + (i % 2)] = 'pad';
      rw.pads[4] = 'pad'; rw.pads[5] = 'pad';
      if (B.padCroc) { rw.pads[8] = 'croc'; rw.padPh[8] = 0.5; rw.padDir[8] = -1; }
    } else if (kind === 'rail') {
      rw.rail = { state: 'idle', train: null, period: 4 + i % 3, offset: i * 1.3 };
    }
    ATTRACT_CACHE[key] = rw;
    return rw;
  }
  function attractAnimate(rw, t) {
    if (rw.type === 'road' || rw.type === 'river') {
      if (rw.t0 == null) { rw.t0 = t; rw.x0 = rw.items.map(function (it) { return it.x; }); }
      for (var i = 0; i < rw.items.length; i++) rw.items[i].x = rw.start + mod(rw.x0[i] + rw.dir * rw.speed * (t - rw.t0) - rw.start, rw.span);
    } else if (rw.type === 'rail') {
      var p = mod(t + rw.rail.offset, rw.rail.period);
      if (p < 1.4) { rw.rail.state = 'idle'; rw.rail.train = null; }
      else if (p < 2.6) { rw.rail.state = 'warn'; rw.rail.train = null; }
      else {
        var w = 5 * C * 1.5, k = (p - 2.6) / (rw.rail.period - 2.6);
        rw.rail.state = 'pass';
        rw.rail.train = { x: rw.dir > 0 ? -w + k * (W + w * 1.2) : W - k * (W + w * 1.2), w: w,
          cars: ['#d9483b', '#2f7fd1', '#2fbf71', '#e8a02e', '#8a55d9'] };
      }
    }
  }
  function attract(ctx, w, h, t) {
    var s = w / W, vh = h / s;
    var bi = Math.floor(t / 6) % BIOMES.length, B = BIOMES[bi], lanes = ATTRACT_LANES[B.id];
    ctx.save();
    ctx.scale(s, s);
    ctx.fillStyle = B.pal.bg; ctx.fillRect(0, 0, W, vh);
    var n = Math.min(lanes.length, Math.ceil(vh / C) + 1);
    var rowsA = [], i;
    for (i = 0; i < n; i++) { rowsA.push(attractRow(bi, i, lanes[i])); attractAnimate(rowsA[i], t); }
    function yOf(i) { return Math.round(vh - (i + 1) * C); }
    for (i = 0; i < n; i++) drawLaneBase(ctx, rowsA[i], i, yOf(i));
    for (i = 0; i < n; i++) drawLaneLip(ctx, rowsA[i], i > 0 ? rowsA[i - 1] : null, yOf(i));
    for (i = 0; i < n; i++) drawLaneDetail(ctx, rowsA[i], rowsA[i + 1] || null, i > 0 ? rowsA[i - 1] : null, yOf(i), t);
    // the hopper bounces up the safe ground rows in the middle column
    var safe = [];
    for (i = 0; i < n; i++) if (lanes[i] === 'ground' && yOf(i) > 0) safe.push(i);
    var hopT = t * 1.2, si = Math.floor(hopT) % safe.length, k = hopT % 1;
    var from = safe[si], to = safe[(si + 1) % safe.length];
    var arc = k < 0.35 && to > from ? k / 0.35 : 1;
    var pr = to > from ? from + (to - from) * arc : from;
    var lift = to > from && k < 0.35 ? Math.sin(arc * Math.PI) * 26 : 0;
    var pRow = Math.round(pr);
    var chars = CHARACTERS.map(function (ch) { return ch.id; });
    var look = chars[Math.floor(t / 3) % chars.length];
    for (i = n - 1; i >= 0; i--) {
      drawLaneObjects(ctx, rowsA[i], yOf(i), t);
      if (i === pRow) {
        var px = W / 2 - C / 2, py = vh - (pr + 1) * C + C / 2 + 10;
        ellipse(ctx, px + 2, py - 1, 14, 5, 'rgba(0,0,0,0.3)');
        ctx.save(); ctx.translate(px, py - lift); ctx.scale(1.25, 1.25);
        drawCharacter(ctx, look, 'up', t);
        ctx.restore();
      }
    }
    ctx.drawImage(vignette(), 0, 0, W, vh);
    ctx.font = '800 13px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(5,8,16,0.6)'; ctx.fillRect(10, 10, ctx.measureText(B.name).width + 20, 26);
    ctx.fillStyle = B.pal.accent; ctx.fillText(B.name, 20, 24);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_road_hopper',
    order: 9,
    title: 'Road Hopper',
    tagline: 'Five biomes. Trains, crocs and ice.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD to hop · Z / X swap hopper · swipe or tap on mobile',
    create: create,
    attract: attract
  });
})(window);

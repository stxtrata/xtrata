/*
 * Xtrata Arcade cartridge #13 - MAZE MUNCHER (v2)
 *
 * Clear every data pellet from the maze while four glitches hunt you.
 * Grab a power core and the glitches turn vulnerable for a few seconds;
 * eat them back to back for 200 / 400 / 800 / 1600. Three lives, an extra
 * life at 10,000.
 *
 * v2 adds:
 *   - five hand-drawn mazes (ASCII art below) that rotate per level, each
 *     with its own name, neon colour theme and soundtrack arrangement;
 *     every maze is validated when this file loads
 *   - four glitch personalities with their own targeting rule, look,
 *     hem animation and faces that change with their mode
 *   - scatter / chase phases on a per-level timer table
 *   - bonus items (twice per level, rising values) plus BOOST / FREEZE
 *   - edge tunnels (glitches crawl through them) and warp gates (muncher only)
 *   - SPACE toggles target markers so you can read each glitch's intent
 *
 * Music: chirpy chiptune; each maze sets key, mode, progression and tune.
 * The emptier the maze, the more layers play. A power core flips to
 * phrygian, speeds up and forces a frantic arp; glitches eaten in one power
 * run climb a note ladder; items play a jingle, gates whoosh, FREEZE drops a
 * filter over the mix, and each cleared maze plays a fanfare before the next
 * maze's arrangement fades in.
 *
 * Contract game-id: xa_maze_muncher (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-maze-muncher');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ==================================================================
   * 1. PLAYFIELD CONSTANTS
   * ================================================================== */
  var COLS = 19, ROWS = 21, T = 22, TOP = 30;
  var W = COLS * T, H = ROWS * T + TOP + 8;
  var ACCENT = '#ffd23f';                         // the muncher
  var FRIGHT_BLUE = '#2a3cff', FRIGHT_FLASH = '#f4f4ff';
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
  var ORDER = ['up', 'left', 'down', 'right'];    // tie-break order for glitch turns
  var EXTRA_LIFE_AT = 10000;
  var DEATH_TIME = 1.8, CLEAR_TIME = 2.2;

  /* ==================================================================
   * 2. MAZES
   *
   * Legend (every maze is 19 x 21):
   *   #  wall                     .  data pellet (10)
   *   o  power core (50)          (space) empty floor
   *   P  muncher start            F  bonus item spot
   *   =  tunnel: the row wraps at the screen edge; glitches crawl inside
   *   -  pen door (glitches only) H  glitch pen (three cells under the door)
   *   1 2  warp gates: step into one and come out of its twin. Gates sit in
   *        one-cell pockets and only carry the muncher - glitches never
   *        enter them, so a gate is always an escape hatch.
   *
   * Rules the validator enforces (see validateMaze):
   *   - every pellet, the item spot and the pen exit reachable by the muncher
   *   - every pellet reachable by the glitches (no glitch-free safe zones)
   *   - no dead ends for glitches, gates have exactly one exit
   *   - tunnel rows open on both edges, gates come in pairs
   * ================================================================== */
  var MAZES = [
    {
      name: 'BOOT SECTOR',
      theme: { wall: '#4d7bff', inner: '#a9c1ff', bg: '#04040f', pellet: '#ffe9a8', gate: '#ff3fa4' },
      music: { key: 60, scale: 'dorian', chords: [0, 3, 0, 6], bpm: 120, wave: 'square', arp: [0, 2, 4, 2],
        bass: '0 . ^0 . 0 . ^0 . 0 . ^0 . 4 . ^0 .', kick: 'x.......x.x.....', hat: 'x.x.x.x.x.x.x.x.',
        tune: '4 . 2 . 4 . 5 . 4 . 2 . 0 . . . 3 . 5 . 6 - 5 . 4 . 3 . 2 . . .' },
      map: [
        '###################',
        '#........#........#',
        '#o##.###.#.###.##o#',
        '#.................#',
        '#.##.#.#####.#.##.#',
        '#....#...#...#....#',
        '####.###.#.###.####',
        '####.#.......#.####',
        '####.#.##-##.#.####',
        '==.....#HHH#.....==',
        '####.#.#####.#.####',
        '####.#...F...#.####',
        '####.#.#####.#.####',
        '#........#........#',
        '#.##.###.#.###.##.#',
        '#o.#.....P.....#.o#',
        '##.#.#.#####.#.#.##',
        '#....#...#...#....#',
        '#.######.#.######.#',
        '#.................#',
        '###################'
      ]
    },
    {
      name: 'CIRCUIT BOARD',
      theme: { wall: '#27e88a', inner: '#b6ffd9', bg: '#020d08', pellet: '#eaffb8', gate: '#ffd23f' },
      music: { key: 62, scale: 'mixolydian', chords: [0, 6, 3, 4], bpm: 124, wave: 'triangle', arp: [0, 4, 2, 4, 7, 4],
        bass: '0 . 0 ^0 . 0 . ^0 0 . 0 ^0 . 4 . 3', kick: 'x...x...x...x...', hat: '..x...x...x...xx',
        tune: '0 . 2 . 4 . 2 . 5 . 4 . 2 . . . 4 . 5 . 7 . 5 . 4 - 2 . 0 . . .' },
      map: [
        '###################',
        '#o.......#.......o#',
        '#.#.##.#.#.#.##.#.#',
        '#.................#',
        '#.#.##.##-##.##.#.#',
        '=...##.#HHH#.##...=',
        '#.#.##.#####.##.#.#',
        '#.#......#......#.#',
        '#.#.#.##.#.##.#.#.#',
        '#...#....#....#...#',
        '#.#1#.##.#.##.#1#.#',
        '#.###.........###.#',
        '#.###.###.###.###.#',
        '#o.......F.......o#',
        '#.##.#.#####.#.##.#',
        '=....#.......#....=',
        '#.##.#.##.##.#.##.#',
        '#....#...P...#....#',
        '#.#.##.#.#.#.##.#.#',
        '#.................#',
        '###################'
      ]
    },
    {
      name: 'CACHE LINES',
      theme: { wall: '#ff3fa4', inner: '#ffc2e6', bg: '#0d0410', pellet: '#ffe0f4', gate: '#3ff0ff' },
      music: { key: 65, scale: 'minor', chords: [0, 5, 3, 4], bpm: 118, wave: 'sawtooth', arp: [0, 2, 4, 7],
        bass: '0 . . 0 . . 0 . 3 . . 3 . . 4 .', kick: 'x.....x...x.....', hat: 'x.x.x.x.x.x.x.xx',
        tune: '7 . 6 . 4 . 2 . 4 - - . 2 . 4 . 5 . 4 . 2 . 0 . 1 . 2 - - .' },
      map: [
        '###################',
        '#........P........#',
        '#.##.#.##.##.#.##.#',
        '#o...#.......#...o#',
        '##.#.#.##.##.#.#.##',
        '#1.....##.##.....1#',
        '###.##.##.##.##.###',
        '==...#.......#...==',
        '##.#.#.#.#.#.#.#.##',
        '#.................#',
        '#.##.#.##-##.#.##.#',
        '#....#.#HHH#.#....#',
        '##.#.#.#####.#.#.##',
        '#2...#...F...#...2#',
        '###.##.#.#.#.##.###',
        '#o...............o#',
        '#.##.#.##.##.#.##.#',
        '#....#.......#....#',
        '#.#.##.##.##.##.#.#',
        '#.................#',
        '###################'
      ]
    },
    {
      name: 'KERNEL',
      theme: { wall: '#b04dff', inner: '#e2c4ff', bg: '#07040f', pellet: '#fff1b8', gate: '#39ff88' },
      music: { key: 63, scale: 'harmonic', chords: [0, 3, 4, 0], bpm: 126, wave: 'square', arp: [0, 2, 4, 6, 4, 2],
        bass: '0 . 0 . ^0 . 0 . 0 . 0 . ^0 . 6 .', kick: 'x...x...x...x.x.', hat: 'x.xxx.x.x.xxx.x.',
        tune: '0 . 4 . 3 . 4 . 6 . 4 . 3 . 1 . 0 . 4 . 7 - 6 . 4 . 3 . 2 . . .' },
      map: [
        '###################',
        '#o...............o#',
        '#.#######.#######.#',
        '#.#.............#.#',
        '#.#.###.###.###.#.#',
        '#...##.......##...#',
        '#.#.##.#1#2#.##.#.#',
        '#.#.##.#####.##.#.#',
        '#.#.##.......##.#.#',
        '#.#.##.##-##.##.#.#',
        '=...##.#HHH#.##...=',
        '#.#.##.#####.##.#.#',
        '#.#.##...F...##.#.#',
        '#.#.##.#####.##.#.#',
        '#.#.##.#2#1#.##.#.#',
        '#...##.......##...#',
        '#.#.###.###.###.#.#',
        '#.#......P......#.#',
        '#.#######.#######.#',
        '#o...............o#',
        '###################'
      ]
    },
    {
      name: 'DEEP STORAGE',
      theme: { wall: '#ffb13b', inner: '#ffe4b8', bg: '#0c0703', pellet: '#fff6d8', gate: '#3ff0ff' },
      music: { key: 67, scale: 'lydian', chords: [0, 1, 4, 5], bpm: 122, wave: 'triangle', arp: [0, 4, 7, 4],
        bass: '0 . . ^0 0 . . ^0 0 . . ^0 0 . 4 .', kick: 'x.......x...x...', hat: '.x.x.x.x.x.x.x.x',
        tune: '4 - 3 . 4 . 7 . 6 - 4 . 2 . . . 3 . 4 . 6 . 7 - 9 . 7 . 6 . 4 .' },
      map: [
        '###################',
        '#o...............o#',
        '#.##.##.#1#.##.##.#',
        '#........#........#',
        '#.###.##.#.##.###.#',
        '#.....#.....#.....#',
        '###.#.#.#.#.#.#.###',
        '=.................=',
        '#.#.##.##-##.##.#.#',
        '#...##.#HHH#.##...#',
        '#.#.##.#####.##.#.#',
        '#........F........#',
        '#.##.#.##.##.#.##.#',
        '=....#.......#....=',
        '#.##.#.#.#.#.#.##.#',
        '#....#...P...#....#',
        '#.##.#.#.#.#.#.##.#',
        '#....#...#...#....#',
        '#.#.##.##1##.##.#.#',
        '#o...............o#',
        '###################'
      ]
    }
  ];

  /* ==================================================================
   * 3. MAZE PARSING + VALIDATION
   * ================================================================== */
  var LEGEND = '#.o PF=-H';
  function isGate(c) { return c >= '1' && c <= '9'; }
  function isPellet(c) { return c === '.' || c === 'o'; }
  // Can something stand on this tile? Glitches never use warp gates.
  function walkable(c, forGlitch) {
    if (c === '#' || c === '-' || c === 'H') return false;
    return forGlitch ? !isGate(c) : true;
  }
  function tileAt(m, x, y) {
    if (y < 0 || y >= ROWS) return '#';
    x = ((x % COLS) + COLS) % COLS;               // rows wrap (only tunnel rows are open at the edge)
    return m.grid[y].charAt(x);
  }
  function cellKey(x, y) { return x + ',' + y; }

  function parseMaze(def, index) {
    var m = {
      index: index, name: def.name, theme: def.theme, music: def.music, grid: def.map,
      pellets: 0, start: null, fruit: null, door: null, exit: null, pen: [],
      twin: {}, gates: [], tunnelRows: [], problems: []
    };
    if (def.map.length !== ROWS) { m.problems.push('needs ' + ROWS + ' rows, has ' + def.map.length); return m; }
    var x, y, c, gateCells = {};
    for (y = 0; y < ROWS; y++) {
      if (def.map[y].length !== COLS) { m.problems.push('row ' + y + ' is ' + def.map[y].length + ' wide'); continue; }
      for (x = 0; x < COLS; x++) {
        c = def.map[y].charAt(x);
        if (LEGEND.indexOf(c) < 0 && !isGate(c)) m.problems.push('unknown tile "' + c + '" at ' + cellKey(x, y));
        if (isPellet(c)) m.pellets++;
        if (c === 'P') { if (m.start) m.problems.push('two starts'); m.start = { x: x, y: y }; }
        if (c === 'F') { if (m.fruit) m.problems.push('two item spots'); m.fruit = { x: x, y: y }; }
        if (c === '-') { if (m.door) m.problems.push('two pen doors'); m.door = { x: x, y: y }; }
        if (isGate(c)) (gateCells[c] = gateCells[c] || []).push({ x: x, y: y });
      }
      if ((def.map[y].charAt(0) === '=') !== (def.map[y].charAt(COLS - 1) === '=')) m.problems.push('tunnel row ' + y + ' is open on one side only');
      else if (def.map[y].charAt(0) === '=') m.tunnelRows.push(y);
    }
    if (m.problems.length) return m;
    if (!m.start) m.problems.push('no muncher start P');
    if (!m.fruit) m.problems.push('no item spot F');
    if (!m.door) { m.problems.push('no pen door'); return m; }
    // the pen: three H cells straight under the door, the exit straight above it
    m.exit = { x: m.door.x, y: m.door.y - 1 };
    m.pen = [{ x: m.door.x, y: m.door.y + 1 }, { x: m.door.x - 1, y: m.door.y + 1 }, { x: m.door.x + 1, y: m.door.y + 1 }];
    m.pen.forEach(function (p) { if (tileAt(m, p.x, p.y) !== 'H') m.problems.push('pen cell ' + cellKey(p.x, p.y) + ' is not H'); });
    if (!walkable(tileAt(m, m.exit.x, m.exit.y), true)) m.problems.push('pen exit is blocked');
    // warp gates: exactly two of each digit, each with exactly one way out
    Object.keys(gateCells).forEach(function (d) {
      var pair = gateCells[d];
      if (pair.length !== 2) { m.problems.push('gate ' + d + ' needs exactly two ends'); return; }
      pair.forEach(function (g) {
        var outs = ORDER.filter(function (dir) { return walkable(tileAt(m, g.x + DIRS[dir][0], g.y + DIRS[dir][1]), false); });
        if (outs.length !== 1) m.problems.push('gate ' + d + ' at ' + cellKey(g.x, g.y) + ' has ' + outs.length + ' exits');
        g.out = outs[0];
        g.id = d;
      });
      m.twin[cellKey(pair[0].x, pair[0].y)] = pair[1];
      m.twin[cellKey(pair[1].x, pair[1].y)] = pair[0];
      m.gates.push(pair[0], pair[1]);
    });
    return m;
  }

  // Breadth-first flood over walkable tiles (tunnels wrap, gates teleport the muncher).
  function flood(m, sx, sy, forGlitch) {
    var seen = {}, queue = [{ x: sx, y: sy }];
    seen[cellKey(sx, sy)] = true;
    while (queue.length) {
      var p = queue.shift();
      var next = ORDER.map(function (d) { return { x: (p.x + DIRS[d][0] + COLS) % COLS, y: p.y + DIRS[d][1] }; });
      var tw = !forGlitch && m.twin[cellKey(p.x, p.y)];
      if (tw) next.push({ x: tw.x, y: tw.y });
      next.forEach(function (n) {
        var k = cellKey(n.x, n.y);
        if (seen[k] || !walkable(tileAt(m, n.x, n.y), forGlitch)) return;
        seen[k] = true;
        queue.push(n);
      });
    }
    return seen;
  }

  function validateMaze(m) {
    if (m.problems.length) return m.problems;
    var mine = flood(m, m.start.x, m.start.y, false);
    var theirs = flood(m, m.exit.x, m.exit.y, true);
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var c = tileAt(m, x, y), k = cellKey(x, y);
      if (isPellet(c) && !mine[k]) m.problems.push('pellet ' + k + ' unreachable for the muncher');
      if (isPellet(c) && !theirs[k]) m.problems.push('pellet ' + k + ' unreachable for glitches');
      if (walkable(c, true)) {
        var exits = ORDER.filter(function (d) { return walkable(tileAt(m, x + DIRS[d][0], y + DIRS[d][1]), true); }).length;
        if (exits < 2) m.problems.push('dead end at ' + k);
      }
    }
    if (!mine[cellKey(m.exit.x, m.exit.y)]) m.problems.push('pen exit unreachable');
    if (!mine[cellKey(m.fruit.x, m.fruit.y)]) m.problems.push('item spot unreachable');
    if (!theirs[cellKey(m.start.x, m.start.y)]) m.problems.push('glitches cannot reach the start');
    return m.problems;
  }

  // Parse + validate once at load. A broken maze is skipped (and reported),
  // never allowed to break the cabinet.
  var MAZE_LIST = [];
  MAZES.forEach(function (def) {
    var m = parseMaze(def, MAZE_LIST.length);
    var problems = validateMaze(m);
    if (problems.length) {
      if (root.console) root.console.warn('[maze muncher] maze "' + def.name + '" skipped: ' + problems.slice(0, 6).join('; '));
      return;
    }
    MAZE_LIST.push(m);
  });
  if (!MAZE_LIST.length) throw new Error('maze muncher: no valid mazes');

  /* ==================================================================
   * 4. GLITCH PERSONALITIES
   *
   * Each glitch has a scatter home (a spot just outside a corner it loops
   * around), a chase rule, a colour, a hem animation and an accessory.
   * ================================================================== */
  var HOMES = {
    topRight: { x: COLS - 2, y: -3 }, topLeft: { x: 1, y: -3 },
    bottomRight: { x: COLS - 1, y: ROWS + 1 }, bottomLeft: { x: 0, y: ROWS + 1 }
  };
  var GLITCHES = [
    { id: 'byter', name: 'BYTER', color: '#ff4d6d', hem: 'saw', home: 'topRight',
      rule: 'goes straight for your tile; gets faster when few pellets remain' },
    { id: 'prefetch', name: 'PREFETCH', color: '#ff8fd8', hem: 'sine', home: 'topLeft',
      rule: 'aims four tiles ahead of where you are heading' },
    { id: 'mirror', name: 'MIRROR', color: '#3ff0ff', hem: 'square', home: 'bottomRight',
      rule: 'reflects BYTER through the tile two ahead of you - a pincer' },
    { id: 'static', name: 'STATIC', color: '#ff8a1c', hem: 'noise', home: 'bottomLeft',
      rule: 'chases from afar, loses its nerve within 7 tiles and runs home' }
  ];
  var SHY_RANGE = 7;

  // Chase targets. `s` = { px, py, dir, byter } snapshot of the board.
  function aheadOf(s, n) { var v = DIRS[s.dir] || [0, 0]; return { x: s.px + v[0] * n, y: s.py + v[1] * n }; }
  var CHASE_RULES = {
    byter: function (g, s) { return { x: s.px, y: s.py }; },
    prefetch: function (g, s) { return aheadOf(s, 4); },
    mirror: function (g, s) {
      var pivot = aheadOf(s, 2);
      return { x: pivot.x * 2 - s.byter.x, y: pivot.y * 2 - s.byter.y };
    },
    static: function (g, s) {
      g.shy = Math.hypot(g.x - s.px, g.y - s.py) <= SHY_RANGE;
      return g.shy ? HOMES[g.p.home] : { x: s.px, y: s.py };
    }
  };

  /* ==================================================================
   * 5. LEVEL TABLES
   * ================================================================== */
  // Speeds in tiles per second. `phases` alternates scatter, chase, scatter...
  // in seconds; after the last entry the glitches chase for good. `release`
  // is how long each glitch waits in the pen. BYTER speeds up at `rageAt`
  // pellets left.
  var TUNING = [
    { player: 6.6, glitch: 5.9, fright: 7.0, release: [0, 1.5, 4.5, 8.0], rageAt: 20, phases: [7, 18, 7, 18, 5] },
    { player: 6.8, glitch: 6.2, fright: 6.0, release: [0, 1.2, 3.5, 6.5], rageAt: 25, phases: [7, 20, 6, 20, 5] },
    { player: 7.0, glitch: 6.5, fright: 5.0, release: [0, 1.0, 3.0, 5.5], rageAt: 30, phases: [6, 22, 5, 22, 4] },
    { player: 7.2, glitch: 6.8, fright: 4.2, release: [0, 0.8, 2.5, 4.5], rageAt: 35, phases: [5, 25, 5, 30, 3] },
    { player: 7.5, glitch: 7.2, fright: 3.4, release: [0, 0.6, 2.0, 3.6], rageAt: 40, phases: [5, 30, 4, 40, 2] },
    { player: 7.8, glitch: 7.6, fright: 2.6, release: [0, 0.5, 1.6, 3.0], rageAt: 45, phases: [4, 40, 3, 60, 1] },
    { player: 8.0, glitch: 7.9, fright: 2.0, release: [0, 0.4, 1.2, 2.4], rageAt: 50, phases: [3, 60, 2, 90, 1] }
  ];
  var FRIGHT_SPEED = 0.55, TUNNEL_SPEED = 0.5, EYES_SPEED = 13, PEN_SPEED = 4, RAGE_BOOST = 1.08;

  // Bonus items: one per level (index = level - 1, last entry repeats),
  // shown twice per level at the maze's F spot.
  var ITEMS = [
    { name: 'BIT', value: 100, color: '#39ff88', icon: 'bit' },
    { name: 'CHIP', value: 300, color: '#3ff0ff', icon: 'chip' },
    { name: 'DISK', value: 500, color: '#ff8fd8', icon: 'disk' },
    { name: 'KEY', value: 700, color: '#ffd23f', icon: 'key' },
    { name: 'CART', value: 1000, color: '#ff9f1c', icon: 'cart' },
    { name: 'ORB', value: 2000, color: '#b98cff', icon: 'orb' },
    { name: 'CROWN', value: 3000, color: '#ffd23f', icon: 'crown' },
    { name: 'LAYERS', value: 5000, color: '#ffffff', icon: 'layers' }
  ];
  // From level 2 one power-up appears mid-level (odd levels FREEZE, even BOOST).
  var POWERUPS = {
    boost: { label: 'BOOST', color: '#ffffff', dur: 5, icon: 'boost' },
    freeze: { label: 'FREEZE', color: '#9fe8ff', dur: 3.5, icon: 'freeze' }
  };
  var ITEM_LIFE = 9.5;
  function itemPlan(level) {
    var plan = [{ at: 0.3, kind: 'fruit' }];
    if (level >= 2) plan.push({ at: 0.52, kind: level % 2 ? 'freeze' : 'boost' });
    plan.push({ at: 0.75, kind: 'fruit' });
    return plan;
  }

  /* ==================================================================
   * 6. MUSIC
   * ================================================================== */
  function mazeSong(m, loop) {
    var mu = m.music;
    return {
      bpm: mu.bpm + loop * 4, key: mu.key + (loop % 3) * 2, scale: mu.scale, chords: mu.chords, seed: 13 + m.index,
      tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.38, chord: true, octave: -2, params: { cutoff: 700, q: 3 }, pattern: mu.bass },
        { name: 'hat', inst: 'hat', layer: 0.1, gain: 0.3, pattern: mu.hat },
        { name: 'kick', inst: 'kick', layer: 0.22, gain: 0.55, pattern: mu.kick },
        { name: 'snare', inst: 'snare', layer: 0.35, gain: 0.38, pattern: '....x.......x...' },
        { name: 'chip', inst: 'arp', layer: 0.48, gain: 0.28, chord: true, octave: 1, params: { cutoff: 3000 },
          fn: function (i) { return i.step % 2 ? null : mu.arp[(i.step >> 1) % mu.arp.length]; } },
        { name: 'tune', inst: 'pluck', layer: 0.62, gain: 0.32, octave: 1, params: { wave: mu.wave, cutoff: 2600, decay: 0.2 },
          pattern: mu.tune },
        { name: 'counter', inst: 'marimba', layer: 0.8, gain: 0.3, chord: true, octave: 2, rate: 2,
          fn: function (i) { return i.rng() < 0.45 ? { deg: [0, 2, 4, 6][Math.floor(i.rng() * 4)], vel: 0.6 } : null; } },
        // forced on by the game, never by intensity (layer 2)
        { name: 'frantic', inst: 'arp', layer: 2, gain: 0.3, chord: true, octave: 2, params: { cutoff: 4200 },
          fn: function (i) { return [0, 1, 2, 4, 2, 1][i.step % 6]; } },
        { name: 'ice', inst: 'bell', layer: 2, gain: 0.32, chord: true, octave: 1, rate: 4,
          fn: function (i) { return [0, 4, 2, 7][(i.step >> 2) % 4]; } },
        { name: 'turbo', inst: 'hat', layer: 2, gain: 0.22, pattern: 'xxxxxxxxxxxxxxxx' }
      ]
    };
  }

  /* ==================================================================
   * 7. DRAWING HELPERS (shared by the game and the attract preview)
   * ================================================================== */
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function makeCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  // --- walls: outline every wall face that touches open floor, `d` px inside
  // the wall. Ends are trimmed at convex corners and extended at concave ones
  // so neighbouring faces join into one continuous neon line.
  function wallTile(m, x, y) { return x < 0 || x >= COLS || y < 0 || y >= ROWS || m.grid[y].charAt(x) === '#'; }
  function traceWalls(g, m, d) {
    g.beginPath();
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      if (!wallTile(m, x, y)) continue;
      var X = x * T, Y = y * T;
      var up = wallTile(m, x, y - 1), dn = wallTile(m, x, y + 1), lf = wallTile(m, x - 1, y), rt = wallTile(m, x + 1, y);
      if (!up) {
        g.moveTo(!lf ? X + d : wallTile(m, x - 1, y - 1) ? X - d : X, Y + d);
        g.lineTo(!rt ? X + T - d : wallTile(m, x + 1, y - 1) ? X + T + d : X + T, Y + d);
      }
      if (!dn) {
        g.moveTo(!lf ? X + d : wallTile(m, x - 1, y + 1) ? X - d : X, Y + T - d);
        g.lineTo(!rt ? X + T - d : wallTile(m, x + 1, y + 1) ? X + T + d : X + T, Y + T - d);
      }
      if (!lf) {
        g.moveTo(X + d, !up ? Y + d : wallTile(m, x - 1, y - 1) ? Y - d : Y);
        g.lineTo(X + d, !dn ? Y + T - d : wallTile(m, x - 1, y + 1) ? Y + T + d : Y + T);
      }
      if (!rt) {
        g.moveTo(X + T - d, !up ? Y + d : wallTile(m, x + 1, y - 1) ? Y - d : Y);
        g.lineTo(X + T - d, !dn ? Y + T - d : wallTile(m, x + 1, y + 1) ? Y + T + d : Y + T);
      }
    }
  }
  // Pre-rendered once per maze (and once more in white for the clear flash).
  var wallCache = {};
  function wallLayer(m, flash) {
    var key = m.index + (flash ? 'f' : 'n');
    if (wallCache[key]) return wallCache[key];
    var c = makeCanvas(W, ROWS * T), g = c.getContext('2d');
    var outer = flash ? '#ffffff' : m.theme.wall, inner = flash ? '#ffffff' : m.theme.inner;
    g.lineCap = 'round'; g.lineJoin = 'round';
    // faint body between the lines
    g.fillStyle = hexA(flash ? '#ffffff' : m.theme.wall, flash ? 0.12 : 0.06);
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (wallTile(m, x, y)) g.fillRect(x * T, y * T, T, T);
    // outer line: wide soft glow, then a crisp core
    g.save(); g.shadowColor = outer; g.shadowBlur = 12; g.strokeStyle = outer; g.lineWidth = 2.6;
    traceWalls(g, m, 3); g.stroke(); g.restore();
    g.strokeStyle = outer; g.lineWidth = 1.6; traceWalls(g, m, 3); g.stroke();
    // inner line: thinner and paler, the second rail of the double line
    g.save(); g.shadowColor = outer; g.shadowBlur = 6; g.strokeStyle = inner; g.globalAlpha = 0.75; g.lineWidth = 1;
    traceWalls(g, m, 7); g.stroke(); g.restore();
    // tunnel floors get a faint tint so the wrap reads as a passage
    m.tunnelRows.forEach(function (ty) {
      for (var tx = 0; tx < COLS; tx++) if (m.grid[ty].charAt(tx) === '=') {
        var grd = g.createLinearGradient(0, ty * T, 0, ty * T + T);
        grd.addColorStop(0, hexA(outer, 0)); grd.addColorStop(0.5, hexA(outer, 0.12)); grd.addColorStop(1, hexA(outer, 0));
        g.fillStyle = grd; g.fillRect(tx * T, ty * T, T, T);
      }
    });
    wallCache[key] = c;
    return c;
  }

  // --- pellets: a small glow sprite per colour, stamped with drawImage
  var dotCache = {};
  function dotSprite(color) {
    if (dotCache[color]) return dotCache[color];
    var c = makeCanvas(14, 14), g = c.getContext('2d');
    g.shadowColor = color; g.shadowBlur = 6; g.fillStyle = color;
    g.fillRect(5, 5, 4, 4);
    g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(6, 6, 2, 2);
    dotCache[color] = c;
    return c;
  }

  // --- the muncher: a block with two trap jaws hinged at the back, drawn
  // facing right and turned (mirrored for left so its eye stays on top).
  function drawMuncher(ctx, x, y, s, dir, open, color) {
    ctx.save();
    ctx.translate(x, y);
    if (dir === 'left') ctx.scale(-1, 1);
    else if (dir === 'up') ctx.rotate(-Math.PI / 2);
    else if (dir === 'down') ctx.rotate(Math.PI / 2);
    ctx.scale(s / 20, s / 20);
    ctx.translate(-7, 0);                          // the hinge
    ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12;
    U.roundRect(ctx, -2.5, -7, 8, 14, 3); ctx.fill();   // hinge block keeps the back closed
    jaw(-1, -open);
    jaw(1, open);
    ctx.restore();
    function jaw(side, ang) {
      ctx.save();
      ctx.rotate(ang);
      U.roundRect(ctx, -2.5, side < 0 ? -9.5 : 0, 19, 9.5, 4); ctx.fill();
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';     // teeth along the biting edge, interleaved
      for (var tx = side < 0 ? 5 : 7; tx < 15; tx += 4) {
        ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx + 2.4, 0); ctx.lineTo(tx + 1.2, -side * 2.4); ctx.fill();
      }
      if (side < 0) {                              // the eye rides the upper jaw
        ctx.fillStyle = '#ffffff'; ctx.fillRect(4, -7.5, 4.5, 4.5);
        ctx.fillStyle = '#05060f'; ctx.fillRect(6.3, -6.5, 2.2, 2.4);
      }
      ctx.restore();
      ctx.restore();
    }
  }

  // --- glitch body: a squared-off block with an animated hem whose shape
  // is part of each personality.
  function glitchBody(ctx, hem, t, ph) {
    ctx.beginPath();
    ctx.moveTo(-9, 5);
    ctx.lineTo(-9, -6);
    ctx.quadraticCurveTo(-9, -10, -5, -10);
    ctx.lineTo(5, -10);
    ctx.quadraticCurveTo(9, -10, 9, -6);
    ctx.lineTo(9, 5);
    var i, f;
    if (hem === 'saw') {                           // BYTER: marching teeth
      f = Math.floor(t * 8 + ph);
      for (i = 0; i <= 6; i++) ctx.lineTo(9 - i * 3, 5 + ((i + f) % 2 ? 4.5 : 0));
    } else if (hem === 'square') {                 // MIRROR: square wave
      f = Math.floor(t * 6 + ph);
      for (i = 0; i < 6; i++) { var hy = 5 + ((i + f) % 2) * 4; ctx.lineTo(9 - i * 3, hy); ctx.lineTo(6 - i * 3, hy); }
    } else if (hem === 'noise') {                  // STATIC: never the same twice (visual only)
      for (i = 0; i <= 9; i++) ctx.lineTo(9 - i * 2, 5 + Math.random() * 4.5);
    } else {                                       // PREFETCH / frightened: soft ripple
      for (i = 0; i <= 12; i++) ctx.lineTo(9 - i * 1.5, 6.5 + 2.2 * Math.sin(i * 1.1 + t * 9 + ph));
    }
    ctx.closePath();
  }

  // look: 'scatter' | 'chase' | 'shy' | 'pen' | 'fright' | 'flash' | 'eyes' | 'frozen'
  function drawGlitch(ctx, x, y, s, p, look, dir, t, ph) {
    var v = DIRS[dir] || [0, 0];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 20, s / 20);
    if (look !== 'eyes') {
      var fr = look === 'fright' || look === 'flash';
      var col = look === 'fright' ? FRIGHT_BLUE : look === 'flash' ? FRIGHT_FLASH : p.color;
      // tearing: every so often the body slips sideways for a frame or two
      var tear = !fr && ((t * 1.7 + ph) % 3) < 0.06 ? 3 : 0;
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.save(); ctx.translate(tear, 0);
      glitchBody(ctx, fr ? 'sine' : p.hem, t, ph);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(-6, -9, 7, 1.6);
      if (fr) { frightFace(ctx, look, t); ctx.restore(); return; }
      accessory(ctx, p, t, col);
      if (p.id === 'static' || tear) {             // scanline slices
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(-9, -2 + Math.sin(t * 23 + ph) * 5, 18, 1.5);
        ctx.fillStyle = col;
        ctx.fillRect(-9 + (Math.random() < 0.3 ? 2 : 0), 1 + Math.sin(t * 17) * 3, 18, 1.5);
      }
      if (look === 'frozen') {
        ctx.fillStyle = 'rgba(190,240,255,0.5)';
        glitchBody(ctx, 'square', 0, 0); ctx.fill();
        ctx.strokeStyle = '#e8fbff'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    eyes(ctx, p, look, v, t);
    ctx.restore();
  }
  function accessory(ctx, p, t, col) {
    ctx.fillStyle = col;
    if (p.id === 'byter') {                        // two horn pixels
      ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(-5.5, -14); ctx.lineTo(-3.5, -9.5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(7, -9); ctx.lineTo(5.5, -14); ctx.lineTo(3.5, -9.5); ctx.fill();
    } else if (p.id === 'prefetch') {              // antenna with a blinking tip
      ctx.strokeStyle = col; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(1, -10); ctx.lineTo(3, -15); ctx.stroke();
      ctx.fillStyle = Math.floor(t * 4) % 2 ? '#ffffff' : col;
      ctx.fillRect(2, -17, 3, 3);
    } else if (p.id === 'mirror') {                // a small fin on each side
      ctx.fillRect(-11, -3, 2, 5); ctx.fillRect(9, -3, 2, 5);
    }
  }
  function eyes(ctx, p, look, v, t) {
    var mood = look;
    if (p.id === 'mirror' && look !== 'eyes') {    // MIRROR wears a visor instead of eyes
      ctx.fillStyle = '#0a0a1c';
      U.roundRect(ctx, -8, -7, 16, 6, 2.5); ctx.fill();
      ctx.fillStyle = mood === 'chase' ? '#ffffff' : '#bff8ff';
      var sw = mood === 'chase' ? 4 : 3, sh = mood === 'chase' ? 1.4 : 2.2;
      ctx.fillRect(-5 + v[0] * 2 - sw / 2 + 1, -4.6 + v[1] - sh / 2 + 0.5, sw, sh);
      ctx.fillRect(3 + v[0] * 2 - sw / 2 + 1, -4.6 + v[1] - sh / 2 + 0.5, sw, sh);
      if (mood === 'pen') { ctx.fillStyle = p.color; ctx.fillRect(-8, -7, 16, 3); }
      return;
    }
    var big = p.id === 'prefetch' ? 1 : 0;          // PREFETCH squints with one oversized scope eye
    var jit = p.id === 'static' && look !== 'eyes' ? (Math.random() - 0.5) * 1.2 : 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -7, 5, 6);
    ctx.fillRect(1, -7 - big, 5 + big, 6 + big);
    ctx.fillStyle = look === 'eyes' ? '#2a3cff' : '#05060f';
    ctx.fillRect(-5.5 + v[0] * 1.6 + jit, -5 + v[1] * 1.6, 2.5, 3);
    ctx.fillRect(2.5 + v[0] * 1.6 + jit + big * 0.5, -5 - big * 0.5 + v[1] * 1.6, 2.5, 3);
    if (big && look !== 'eyes') { ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8; ctx.strokeRect(0.5, -8.5, 7, 8); }
    if (look === 'eyes') return;
    ctx.strokeStyle = '#05060f'; ctx.lineWidth = 1.4;
    if (mood === 'pen') {                           // sleepy lids
      ctx.fillStyle = p.color; ctx.fillRect(-7, -7.5, 5, 3.4); ctx.fillRect(1, -8.5, 6, 3.6);
    } else if (mood === 'chase') {                  // angry brows
      ctx.beginPath(); ctx.moveTo(-8, -9.5); ctx.lineTo(-2.5, -7.4); ctx.moveTo(7.5, -9.5); ctx.lineTo(1.5, -7.4); ctx.stroke();
      if (p.id === 'byter') {                       // and a jagged grin
        ctx.beginPath(); ctx.moveTo(-5, 2);
        for (var i = 1; i <= 5; i++) ctx.lineTo(-5 + i * 2, i % 2 ? 0.5 : 2);
        ctx.stroke();
      }
    } else if (mood === 'shy') {                    // worried brows + an 'o'
      ctx.beginPath(); ctx.moveTo(-7.5, -8); ctx.lineTo(-2.5, -9.8); ctx.moveTo(6.5, -8); ctx.lineTo(1.5, -9.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 2.2, 1.5, 0, 7); ctx.stroke();
    }
  }
  function frightFace(ctx, look, t) {
    var ink = look === 'flash' ? '#ff3355' : '#ffe9c8';
    ctx.fillStyle = ink;
    ctx.fillRect(-5, -5, 3, 3); ctx.fillRect(2, -5, 3, 3);
    ctx.strokeStyle = ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-7, 2.5);
    for (var i = 1; i <= 7; i++) ctx.lineTo(-7 + i * 2, 2.5 + (i % 2 ? -1.6 : 0) + Math.sin(t * 20) * 0.3);
    ctx.stroke();
  }

  // --- bonus items and power-ups: small vector icons
  function drawIcon(ctx, icon, x, y, s, color, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 20, s / 20);
    ctx.fillStyle = color; ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.lineWidth = 2;
    var i;
    if (icon === 'bit') {
      ctx.rotate(Math.sin(t * 3) * 0.2);
      ctx.strokeRect(-6, -6, 12, 12); ctx.fillRect(-2.5, -2.5, 5, 5);
    } else if (icon === 'chip') {
      ctx.fillRect(-6, -6, 12, 12);
      for (i = -1; i <= 1; i++) { ctx.fillRect(-9, i * 4 - 0.8, 3, 1.6); ctx.fillRect(6, i * 4 - 0.8, 3, 1.6); ctx.fillRect(i * 4 - 0.8, -9, 1.6, 3); ctx.fillRect(i * 4 - 0.8, 6, 1.6, 3); }
      ctx.shadowBlur = 0; ctx.fillStyle = '#05060f'; ctx.fillRect(-3, -3, 6, 6);
    } else if (icon === 'disk') {
      ctx.beginPath(); ctx.moveTo(-7, -8); ctx.lineTo(5, -8); ctx.lineTo(8, -5); ctx.lineTo(8, 8); ctx.lineTo(-7, 8); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#05060f'; ctx.fillRect(-4, -8, 8, 5); ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, 2, 9, 5);
    } else if (icon === 'key') {
      ctx.beginPath(); ctx.arc(-4, 0, 4, 0, 7); ctx.stroke();
      ctx.fillRect(0, -1, 9, 2.4); ctx.fillRect(5, 1, 1.8, 3); ctx.fillRect(8, 1, 1.8, 4);
    } else if (icon === 'cart') {
      ctx.fillRect(-7, -6, 14, 14); ctx.fillRect(-5, -9, 10, 3);
      ctx.shadowBlur = 0; ctx.fillStyle = '#05060f'; ctx.fillRect(-5, -3, 10, 6);
      ctx.fillStyle = color; for (i = 0; i < 4; i++) ctx.fillRect(-5 + i * 3, 5, 1.5, 3);
    } else if (icon === 'orb') {
      ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, 7); ctx.fill();
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(0, 0, 9.5, 3, -0.4 + Math.sin(t * 2) * 0.1, 0, 7); ctx.stroke();
    } else if (icon === 'crown') {
      ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(-8, -5); ctx.lineTo(-4, 0); ctx.lineTo(0, -7); ctx.lineTo(4, 0); ctx.lineTo(8, -5); ctx.lineTo(8, 6); ctx.closePath(); ctx.fill();
    } else if (icon === 'layers') {
      for (i = 2; i >= 0; i--) {
        ctx.globalAlpha = 1 - i * 0.25;
        ctx.beginPath(); ctx.moveTo(0, -8 + i * 5); ctx.lineTo(8, -4 + i * 5); ctx.lineTo(0, 0 + i * 5); ctx.lineTo(-8, -4 + i * 5); ctx.closePath(); ctx.fill();
      }
    } else if (icon === 'boost') {
      ctx.beginPath(); ctx.moveTo(2, -9); ctx.lineTo(-6, 1); ctx.lineTo(-1, 1); ctx.lineTo(-3, 9); ctx.lineTo(6, -2); ctx.lineTo(1, -2); ctx.closePath(); ctx.fill();
    } else if (icon === 'freeze') {
      ctx.rotate(t * 0.8); ctx.lineWidth = 1.8;
      for (i = 0; i < 3; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
        ctx.moveTo(5, 0); ctx.lineTo(7, -2.5); ctx.moveTo(5, 0); ctx.lineTo(7, 2.5);
        ctx.moveTo(-5, 0); ctx.lineTo(-7, -2.5); ctx.moveTo(-5, 0); ctx.lineTo(-7, 2.5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // --- warp gate: counter-rotating rings; `hot` flares right after a jump
  function drawGate(ctx, x, y, color, t, hot, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10 + hot * 16;
    ctx.lineWidth = 2;
    for (var r = 0; r < 3; r++) {
      ctx.beginPath();
      var a = t * (r % 2 ? -3 : 3) * spin + r;
      ctx.arc(0, 0, 3 + r * 2.8 + hot * 2, a, a + 4.2);
      ctx.stroke();
    }
    ctx.fillStyle = hexA(color, 0.35 + hot * 0.5);
    ctx.beginPath(); ctx.arc(0, 0, 2.2, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ==================================================================
   * 8. THE GAME
   * ================================================================== */
  function create(api) {
    var rng = api.rng;                             // gameplay randomness only
    var level = 1, lives = 3, loop = 0, maze = MAZE_LIST[0];
    var dots = [], left = 0, total = 1;
    var player, glitches = [];
    var phaseIdx = 0, phaseT = 0, chase = false;
    var frightT = 0, eatChain = 0, freezeT = 0, boostT = 0;
    var item = null, plan = [], planIdx = 0, itemsTaken = [];
    var dying = 0, readyT = 1.2, clearT = 0, over = false, overT = 0;
    var showTargets = false, extraGiven = false, munchFlip = false;
    var gateFlash = {}, t = 0;

    function tuning() { return TUNING[Math.min(level, TUNING.length) - 1]; }
    function itemFor(lv) { return ITEMS[Math.min(lv, ITEMS.length) - 1]; }
    function px(x) { return x * T + T / 2; }
    function py(y) { return TOP + y * T + T / 2; }

    /* ---------------------------------------------------- level setup */
    function resetDots() {
      dots = []; left = 0;
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var c = maze.grid[y].charAt(x);
        dots.push(c === '.' ? 1 : c === 'o' ? 2 : 0);
        if (isPellet(c)) left++;
      }
      total = Math.max(1, left);
    }
    function resetActors() {
      player = { x: maze.start.x, y: maze.start.y, dir: 'left', want: 'left', mouth: 0, warpCd: 0, warpLock: null };
      var rel = tuning().release;
      glitches = GLITCHES.map(function (p, i) {
        var home = i === 0 ? maze.exit : maze.pen[i - 1];
        return { i: i, p: p, x: home.x, y: home.y, dir: i === 0 ? 'left' : 'up',
          state: i === 0 ? 'active' : 'pen', release: rel[i], scared: false, shy: false, target: null, ph: i * 1.7 };
      });
      phaseIdx = 0; phaseT = 0; chase = false;
      frightT = 0; freezeT = 0; boostT = 0; eatChain = 0;
      item = null;
    }
    function startLevel(n) {
      level = n;
      maze = MAZE_LIST[(n - 1) % MAZE_LIST.length];
      loop = Math.floor((n - 1) / MAZE_LIST.length);
      resetDots();
      resetActors();
      plan = itemPlan(n); planIdx = 0;
      readyT = n === 1 ? 1.2 : 1.9;
      playSong(n === 1 ? 1.2 : 0.9);
    }

    /* ---------------------------------------------------------- music */
    var powerOn = false, freezeOn = false, boostOn = false, lastInt = -1;
    function baseBpm() { return maze.music.bpm + loop * 4; }
    function playSong(fade) {
      var m = M();
      if (!m) return;
      m.play(mazeSong(maze, loop), { fade: fade, intensity: 0.08 });
      powerOn = false; freezeOn = false; boostOn = false; lastInt = -1;
    }
    // Everything here is guarded so the engine only hears about changes.
    function syncMusic() {
      var m = M();
      if (!m) return;
      var pw = frightT > 0 && dying <= 0;
      if (pw !== powerOn) {
        powerOn = pw;
        m.setScale(pw ? 'phrygian' : maze.music.scale);
        m.setTempo(pw ? baseBpm() + 24 : baseBpm(), 0.4);
        m.setTrack('frantic', pw ? true : null);
      }
      var fz = freezeT > 0 && dying <= 0;
      if (fz !== freezeOn) {
        freezeOn = fz;
        m.setFilter(fz ? 1200 : 18000, fz ? 0.25 : 0.6);
        m.setTrack('ice', fz ? true : null);
      }
      var bs = boostT > 0 && dying <= 0;
      if (bs !== boostOn) { boostOn = bs; m.setTrack('turbo', bs ? true : null); }
      var it = Math.round(U.clamp(0.08 + (1 - left / total) * 0.95, 0, 1) * 20) / 20;
      if (it !== lastInt) { lastInt = it; m.setIntensity(it); }
    }
    function jingle(seq, inst, fallback) {
      if (M()) M().stinger(seq, { inst: inst, quantize: '16', octave: 1, gain: 0.6 });
      else api.audio.arp(fallback, 0.05, { type: 'square', vol: 0.15 });
    }

    startLevel(1);

    /* ------------------------------------------------------- movement */
    function speedPlayer() {
      return tuning().player * (boostT > 0 ? 1.28 : 1) * (frightT > 0 ? 1.06 : 1);
    }
    function speedGlitch(g) {
      var tu = tuning();
      if (g.state === 'eyes') return EYES_SPEED;
      var s = tu.glitch;
      if (g.scared) s *= FRIGHT_SPEED;
      else if (g.p.id === 'byter' && left <= tu.rageAt) s *= RAGE_BOOST;
      if (tileAt(maze, Math.round(g.x), Math.round(g.y)) === '=') s *= TUNNEL_SPEED;
      return s;
    }
    function atCenter(e) { return Math.abs(e.x - Math.round(e.x)) < 1e-6 && Math.abs(e.y - Math.round(e.y)) < 1e-6; }
    function canGo(e, d, forGlitch) {
      var v = DIRS[d];
      return !!v && walkable(tileAt(maze, Math.round(e.x) + v[0], Math.round(e.y) + v[1]), forGlitch);
    }
    // Move an actor `dist` tiles along the grid; `decide(e)` runs at each tile centre.
    function advance(e, dist, decide, forGlitch) {
      for (var guard = 0; guard < 12 && dist > 1e-6; guard++) {
        if (atCenter(e)) {
          e.x = Math.round(e.x); e.y = Math.round(e.y);
          if (e.x < 0) e.x += COLS; else if (e.x >= COLS) e.x -= COLS;   // tunnel wrap
          decide(e);
          if (!e.dir || !canGo(e, e.dir, forGlitch)) return;
        }
        var v = DIRS[e.dir], s = v[0] || v[1];
        var cur = v[0] ? e.x : e.y;
        var target = s > 0 ? Math.floor(cur + 1e-9) + 1 : Math.ceil(cur - 1e-9) - 1;
        var toNext = Math.abs(target - cur);
        var step = Math.min(dist, toNext);
        if (v[0]) e.x += s * step; else e.y += s * step;
        dist -= step;
        if (Math.abs(e.x - Math.round(e.x)) < 1e-6) e.x = Math.round(e.x);
        if (Math.abs(e.y - Math.round(e.y)) < 1e-6) e.y = Math.round(e.y);
        if (step < toNext) return;
      }
    }
    function wrapDist(a, b) {
      var dx = Math.abs(a.x - b.x);
      if (dx > COLS / 2) dx = COLS - dx;
      return Math.hypot(dx, a.y - b.y);
    }

    /* --------------------------------------------------------- player */
    function decidePlayer(p) {
      var twin = maze.twin[cellKey(p.x, p.y)];
      if (twin && p.warpCd <= 0) { warp(p, twin); return; }
      if (p.want && canGo(p, p.want, false)) p.dir = p.want;
      eatAt(p.x, p.y);
    }
    function warp(p, twin) {
      var fromX = px(p.x), fromY = py(p.y);
      // Come out facing away from the gate. A key still held from the way
      // in is ignored until released, so holding it can't bounce you back.
      p.warpLock = p.dir;
      p.x = twin.x; p.y = twin.y; p.dir = twin.out; p.want = twin.out; p.warpCd = 0.6;
      gateFlash[cellKey(twin.x, twin.y)] = 1;
      api.fx.burst(fromX, fromY, maze.theme.gate, 12, 120, 0.4);
      api.fx.burst(px(p.x), py(p.y), '#ffffff', 12, 120, 0.4);
      api.audio.noise(0.32, { cutoff: 2600, vol: 0.14 });
      api.audio.tone(200, 0.3, { type: 'sine', slide: 4, vol: 0.12 });
      if (M()) M().note('bell', 7, { chord: true, gain: 0.4, quantize: '16' });
    }
    function eatAt(x, y) {
      var i = y * COLS + x, kind = dots[i];
      if (!kind) return;
      dots[i] = 0;
      left--;
      if (kind === 2) {
        api.addScore(50);
        startFright();
      } else {
        api.addScore(10);
        munchFlip = !munchFlip;
        api.audio.tone(munchFlip ? 520 : 440, 0.03, { type: 'triangle', vol: 0.07 });
      }
      maybeSpawnItem();
      syncMusic();
      if (left <= 0) mazeCleared();
    }

    /* ---------------------------------------------------- fright mode */
    function startFright() {
      frightT = tuning().fright;
      eatChain = 0;
      glitches.forEach(function (g) {
        if (g.state === 'eyes' || g.state === 'entering') return;
        g.scared = true;
        if (g.state === 'active') g.dir = OPP[g.dir] || g.dir;
      });
      api.audio.arp([392, 523, 392, 523], 0.05, { type: 'square', vol: 0.14 });
    }
    function eatGlitch(g) {
      eatChain++;
      var pts = 100 * Math.pow(2, Math.min(eatChain, 4));
      api.addScore(pts);
      api.fx.text(px(g.x), py(g.y), String(pts), '#3ff0ff', 12);
      api.fx.burst(px(g.x), py(g.y), g.p.color, 16, 140);
      if (M()) {
        // a ladder that climbs with every glitch eaten in this power run
        var b0 = (eatChain - 1) * 2;
        M().stinger([{ deg: b0 }, { deg: b0 + 2, at: 1 }, { deg: b0 + 4, at: 2, steps: 3 }], { inst: 'arp', quantize: '16', octave: 1, gain: 0.6 });
      } else api.audio.arp([800, 1200, 1600], 0.04, { type: 'square', vol: 0.16 });
      g.state = 'eyes';
      g.scared = false;
    }

    /* ------------------------------------------------ glitch behaviour */
    function scatterOrChase(dt) {
      if (frightT > 0) return;                     // the phase clock pauses while frightened
      var seq = tuning().phases;
      if (phaseIdx >= seq.length) return;          // final chase: no more scatters
      phaseT += dt;
      if (phaseT < seq[phaseIdx]) return;
      phaseT -= seq[phaseIdx];
      phaseIdx++;
      var was = chase;
      chase = phaseIdx % 2 === 1 || phaseIdx >= seq.length;
      // every phase change makes the glitches turn around - the tell to watch for
      if (chase !== was) glitches.forEach(function (g) { if (g.state === 'active' && !g.scared) g.dir = OPP[g.dir] || g.dir; });
    }
    function targetFor(g) {
      if (g.state === 'eyes') return maze.exit;
      if (!chase) { g.shy = false; return HOMES[g.p.home]; }
      var b = glitches[0];
      return CHASE_RULES[g.p.id](g, { px: Math.round(player.x), py: Math.round(player.y), dir: player.dir, byter: { x: Math.round(b.x), y: Math.round(b.y) } });
    }
    function decideGlitch(g) {
      var x = g.x, y = g.y;
      if (g.state === 'eyes' && x === maze.exit.x && y === maze.exit.y) { g.state = 'entering'; g.dir = 'down'; return; }
      var options = ORDER.filter(function (d) { return d !== OPP[g.dir] && canGo(g, d, true); });
      if (!options.length) options = ORDER.filter(function (d) { return canGo(g, d, true); });
      if (!options.length) return;
      if (g.scared) { g.dir = options[rng.int(options.length)]; g.target = null; return; }
      var tg = targetFor(g), best = options[0], bestD = 1e9;
      g.target = tg;
      options.forEach(function (d) {
        var v = DIRS[d], dd = Math.pow(x + v[0] - tg.x, 2) + Math.pow(y + v[1] - tg.y, 2);
        if (dd < bestD) { bestD = dd; best = d; }
      });
      g.dir = best;
    }
    // Pen choreography is scripted: slide to the door column, rise out, and
    // (as eyes) sink back to the middle of the pen.
    function moveToward(g, tx, ty, dist) {
      var dx = tx - g.x, dy = ty - g.y;
      if (Math.abs(dx) > 1e-6) { var sx = Math.min(Math.abs(dx), dist); g.x += Math.sign(dx) * sx; g.dir = dx < 0 ? 'left' : 'right'; dist -= sx; }
      if (dist > 0 && Math.abs(dy) > 1e-6) { var sy = Math.min(Math.abs(dy), dist); g.y += Math.sign(dy) * sy; g.dir = dy < 0 ? 'up' : 'down'; }
      return Math.abs(tx - g.x) < 1e-6 && Math.abs(ty - g.y) < 1e-6;
    }
    function updateGlitch(g, dt) {
      if (g.state === 'pen') {
        g.release -= dt;
        if (g.release <= 0) g.state = 'leaving';
        return;
      }
      if (g.state === 'leaving') {
        if (moveToward(g, maze.exit.x, maze.exit.y, PEN_SPEED * (g.scared ? 0.7 : 1) * dt)) {
          g.x = maze.exit.x; g.y = maze.exit.y; g.state = 'active'; g.dir = 'left';
        }
        return;
      }
      if (g.state === 'entering') {
        var mid = maze.pen[0];
        if (moveToward(g, mid.x, mid.y, EYES_SPEED * 0.6 * dt)) { g.state = 'pen'; g.release = 0.6; g.dir = 'up'; }
        return;
      }
      if (freezeT > 0 && g.state === 'active') return;
      advance(g, speedGlitch(g) * dt, decideGlitch, true);
    }
    function lookOf(g) {
      if (g.state === 'eyes' || g.state === 'entering') return 'eyes';
      if (g.scared) return frightT < 2 && Math.floor(t * 8) % 2 ? 'flash' : 'fright';
      if (g.state === 'pen') return 'pen';
      if (freezeT > 0 && g.state === 'active') return 'frozen';
      if (g.state === 'leaving') return 'scatter';
      if (chase && g.shy) return 'shy';
      return chase ? 'chase' : 'scatter';
    }
    function modeOf(g) {
      if (g.state !== 'active') return g.state;
      if (g.scared) return 'fright';
      if (freezeT > 0) return 'frozen';
      return chase ? (g.shy ? 'shy' : 'chase') : 'scatter';
    }
    function checkContacts() {
      for (var i = 0; i < glitches.length; i++) {
        var g = glitches[i];
        var live = g.state === 'active' || (g.state === 'leaving' && g.y <= maze.door.y);
        if (!live || wrapDist(g, player) >= 0.65) continue;
        if (g.scared) eatGlitch(g);
        else { loseLife(); return; }
      }
    }

    /* ---------------------------------------------------------- items */
    function maybeSpawnItem() {
      if (item || planIdx >= plan.length) return;
      if (1 - left / total < plan[planIdx].at) return;
      item = { kind: plan[planIdx].kind, x: maze.fruit.x, y: maze.fruit.y, life: ITEM_LIFE };
      planIdx++;
    }
    function takeItem() {
      var x = px(item.x), y = py(item.y);
      if (item.kind === 'fruit') {
        var it = itemFor(level);
        api.addScore(it.value);
        itemsTaken.push(it.icon);
        if (itemsTaken.length > 6) itemsTaken.shift();
        api.fx.text(x, y - 6, '+' + it.value, it.color, 12);
        api.fx.burst(x, y, it.color, 18, 150);
        jingle([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 9, at: 3, steps: 3 }], 'bell', [659, 784, 988]);
      } else {
        var pu = POWERUPS[item.kind];
        api.fx.text(x, y - 6, pu.label, pu.color, 12);
        api.fx.burst(x, y, pu.color, 22, 170);
        if (item.kind === 'freeze') {
          freezeT = pu.dur;
          jingle([{ deg: 7 }, { deg: 4, at: 1 }, { deg: 2, at: 2 }, { deg: 0, at: 3, steps: 4 }], 'bell', [988, 784, 659, 523]);
        } else {
          boostT = pu.dur;
          jingle([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 3 }], 'lead', [523, 659, 784, 1047]);
        }
        syncMusic();
      }
      item = null;
    }

    /* --------------------------------------------------- life + death */
    function loseLife() {
      dying = DEATH_TIME;
      api.shake(8);
      api.audio.tone(500, 0.9, { type: 'sawtooth', slide: 0.15, vol: 0.25, delay: 0.35 });
      if (M()) M().duck(0.6, 1.6);
      syncMusic();
    }
    function mazeCleared() {
      clearT = CLEAR_TIME;
      item = null;
      frightT = 0; freezeT = 0; boostT = 0;
      glitches.forEach(function (g) { g.scared = false; });
      syncMusic();
      api.fx.text(W / 2, py(maze.fruit.y), 'MAZE CLEAR', ACCENT, 18);
      if (M()) M().stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 6, at: 6 }, { deg: 7, at: 7, steps: 6 }],
        { inst: 'pluck', quantize: 'beat', octave: 1, gain: 0.55, params: { wave: 'square', decay: 0.3 } });
      else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.2 });
    }

    /* ----------------------------------------------------------- input */
    function readInput() {
      var inp = api.input;
      // Buffered: the wanted direction is kept until a junction allows it.
      if (player.warpLock && !inp.held(player.warpLock)) player.warpLock = null;
      ['up', 'down', 'left', 'right'].forEach(function (d) {
        if (inp.hit(d) || (inp.held(d) && d !== player.warpLock)) player.want = d;
      });
      inp.takeSwipes().forEach(function (s) { if (DIRS[s]) player.want = s; });
      if (inp.hit('a')) showTargets = !showTargets;
    }

    /* ----------------------------------------------------------- update */
    function update(dt) {
      t += dt;
      readInput();
      for (var k in gateFlash) { gateFlash[k] -= dt * 2; if (gateFlash[k] <= 0) delete gateFlash[k]; }
      if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }
      syncMusic();
      if (dying > 0) {
        dying -= dt;
        if (dying <= 0) {
          lives--;
          if (lives <= 0) { over = true; return; }
          resetActors(); readyT = 1.4;
        }
        return;
      }
      if (clearT > 0) {
        clearT -= dt;
        if (clearT <= 0) startLevel(level + 1);
        return;
      }
      if (readyT > 0) { readyT -= dt; return; }

      // muncher (instant reverse between tiles, buffered turns at centres)
      if (player.want === OPP[player.dir]) player.dir = player.want;
      if (player.warpCd > 0) player.warpCd -= dt;
      advance(player, speedPlayer() * dt, decidePlayer, false);
      player.mouth += dt * 16;
      if (clearT > 0) return;                      // the last pellet ends the frame

      // timers
      if (frightT > 0) {
        frightT -= dt;
        if (frightT <= 0) { frightT = 0; glitches.forEach(function (g) { g.scared = false; }); }
      }
      if (freezeT > 0) freezeT = Math.max(0, freezeT - dt);
      if (boostT > 0) boostT = Math.max(0, boostT - dt);
      scatterOrChase(dt);

      checkContacts();
      if (dying <= 0) {
        glitches.forEach(function (g) { updateGlitch(g, dt); });
        checkContacts();
      }

      if (item) {
        item.life -= dt;
        if (wrapDist(item, player) < 0.6) takeItem();
        else if (item.life <= 0) item = null;
      }
      if (!extraGiven && api.getScore() >= EXTRA_LIFE_AT) {
        extraGiven = true; lives++;
        api.fx.text(W / 2, TOP + 40, 'EXTRA LIFE', ACCENT, 14);
        jingle([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 11, at: 3 }, { deg: 14, at: 4, steps: 4 }], 'pluck', [523, 659, 784, 988, 1047]);
      }
      var extra = frightT > 0 ? '  \u00b7  POWER ' + frightT.toFixed(1) : freezeT > 0 ? '  \u00b7  FREEZE ' + freezeT.toFixed(1) : boostT > 0 ? '  \u00b7  BOOST ' + boostT.toFixed(1) : '';
      api.setStatus('LEVEL ' + level + '  \u00b7  ' + maze.name + '  \u00b7  LIVES ' + lives + '  \u00b7  PELLETS ' + left + extra);
    }

    /* ----------------------------------------------------------- render */
    // Draw something at column x, plus its wrapped twin when it pokes
    // through a tunnel mouth.
    function wrapped(x, fn) {
      fn(px(x));
      if (x < 0.6) fn(px(x + COLS));
      if (x > COLS - 1.6) fn(px(x - COLS));
    }
    function render(ctx) {
      var th = maze.theme;
      var pulse = M() ? M().pulse(6) : 0;
      ctx.fillStyle = th.bg;
      ctx.fillRect(0, 0, W, H);
      var flash = clearT > 0 && clearT < CLEAR_TIME - 0.3 && Math.floor(t * 7) % 2;
      ctx.drawImage(wallLayer(maze, flash), 0, TOP);
      renderDoorAndGates(ctx, th);
      renderDots(ctx, th, pulse);
      if (item) renderItem(ctx);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, TOP, W, ROWS * T); ctx.clip();
      var hideGlitches = (dying > 0 && dying < DEATH_TIME - 0.45) || (clearT > 0 && clearT < CLEAR_TIME - 0.4) || over;
      if (!hideGlitches) {
        if (showTargets) renderTargets(ctx);
        glitches.forEach(function (g) { renderGlitch(ctx, g); });
      }
      renderPlayer(ctx);
      ctx.restore();
      renderHud(ctx, th);
    }
    function renderDoorAndGates(ctx, th) {
      ctx.fillStyle = '#ff8fd8';
      ctx.fillRect(maze.door.x * T + 2, TOP + maze.door.y * T + T / 2 - 1.5, T - 4, 3);
      maze.gates.forEach(function (g) {
        var hot = gateFlash[cellKey(g.x, g.y)] || 0;
        drawGate(ctx, px(g.x), py(g.y), th.gate, t, hot, g.id === '2' ? -1 : 1);
      });
    }
    function renderDots(ctx, th, pulse) {
      var spr = dotSprite(th.pellet);
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var k = dots[y * COLS + x];
        if (k === 1) ctx.drawImage(spr, px(x) - 7, py(y) - 7);
        else if (k === 2) {
          var r = 4.5 + pulse * 2.5;
          ctx.save();
          ctx.translate(px(x), py(y)); ctx.rotate(t * 1.5);
          ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10 + pulse * 10;
          ctx.fillRect(-r, -r, r * 2, r * 2);
          ctx.shadowBlur = 0; ctx.fillStyle = '#fff8d8'; ctx.fillRect(-r * 0.4, -r * 0.4, r * 0.8, r * 0.8);
          ctx.restore();
        }
      }
    }
    function renderItem(ctx) {
      if (item.life < 2.5 && Math.floor(t * 8) % 2) return;       // blink before vanishing
      var bob = Math.sin(t * 4) * 1.5;
      if (item.kind === 'fruit') { var it = itemFor(level); drawIcon(ctx, it.icon, px(item.x), py(item.y) + bob, 18, it.color, t); }
      else { var pu = POWERUPS[item.kind]; drawIcon(ctx, pu.icon, px(item.x), py(item.y) + bob, 18, pu.color, t); }
    }
    function renderGlitch(ctx, g) {
      var look = lookOf(g);
      var bob = g.state === 'pen' ? Math.sin(t * 6 + g.i) * 3 : 0;
      wrapped(g.x, function (x) { drawGlitch(ctx, x, py(g.y) + bob, 20, g.p, look, g.dir, t, g.ph); });
    }
    function renderTargets(ctx) {
      glitches.forEach(function (g) {
        if (g.state !== 'active' || g.scared) return;
        g.target = targetFor(g);                   // live, so the marker never lags
        var tx = U.clamp(px(g.target.x), 4, W - 4), ty = U.clamp(py(g.target.y), TOP + 4, TOP + ROWS * T - 4);
        ctx.save();
        ctx.strokeStyle = hexA(g.p.color, 0.45); ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(px(g.x), py(g.y)); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = g.p.color; ctx.lineWidth = 2; ctx.shadowColor = g.p.color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(tx - 5, ty - 5); ctx.lineTo(tx + 5, ty + 5); ctx.moveTo(tx + 5, ty - 5); ctx.lineTo(tx - 5, ty + 5); ctx.stroke();
        ctx.restore();
      });
    }
    function renderPlayer(ctx) {
      var open = Math.abs(Math.sin(player.mouth)) * 0.45;
      if (readyT > 0 && !dying) open = 0.25;
      if (dying > 0) {
        if (dying > DEATH_TIME - 0.45) { wrapped(player.x, function (x) { drawMuncher(ctx, x, py(player.y), 20, player.dir, 0.1, ACCENT); }); return; }
        renderDerez(ctx);
        return;
      }
      if (over) return;
      wrapped(player.x, function (x) { drawMuncher(ctx, x, py(player.y), 20, player.dir, open, boostT > 0 ? '#fff4b8' : ACCENT); });
      if (boostT > 0 && Math.random() < 0.6) {
        var v = DIRS[player.dir];
        api.fx.trail(px(player.x) - v[0] * 9, py(player.y) - v[1] * 9, ACCENT, -v[0] * 30, -v[1] * 30);
      }
    }
    // Death: the muncher splits into scanline slices that drift apart and fade.
    function renderDerez(ctx) {
      var prog = U.clamp(1 - dying / (DEATH_TIME - 0.45), 0, 1);
      if (prog >= 1) return;
      var cx = px(player.x), cy = py(player.y);
      for (var k = 0; k < 7; k++) {
        ctx.save();
        ctx.beginPath(); ctx.rect(cx - 14, cy - 10 + k * 3, 28, 3); ctx.clip();
        ctx.globalAlpha = 1 - prog;
        ctx.translate((k % 2 ? 1 : -1) * prog * (6 + k * 3), -prog * k * 2);
        drawMuncher(ctx, cx, cy, 20, player.dir, 0.2 + prog * 1.2, prog > 0.5 ? '#ffffff' : ACCENT);
        ctx.restore();
      }
    }
    function renderHud(ctx, th) {
      for (var l = 0; l < Math.min(lives, 6); l++) drawMuncher(ctx, 14 + l * 20, 15, 13, 'right', 0.35, ACCENT);
      U.glowText(ctx, maze.name, W / 2, showTargets ? 12 : 15, 10, th.wall, 'center', 700);
      ctx.fillStyle = 'rgba(200,210,255,0.65)';
      ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText('LV ' + level, W - 8, 16);
      for (var i = 0; i < itemsTaken.length; i++) {
        var it = ITEMS.filter(function (x) { return x.icon === itemsTaken[i]; })[0];
        drawIcon(ctx, it.icon, W - 52 - i * 16, 15, 12, it.color, 0);
      }
      if (showTargets) {
        ctx.fillStyle = 'rgba(200,210,255,0.55)'; ctx.font = '700 8px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
        ctx.fillText('TARGET VIEW', W / 2, 27);
      }
      var cy = py(maze.fruit.y);
      if (readyT > 0 && !over && !dying && !clearT) {
        ctx.save();
        ctx.fillStyle = hexA(th.bg, 0.8); ctx.fillRect(W / 2 - 90, cy - 30, 180, 44);
        ctx.restore();
        U.glowText(ctx, 'LEVEL ' + level, W / 2, cy - 17, 12, th.wall);
        U.glowText(ctx, 'READY!', W / 2, cy + 2, 14, ACCENT);
      }
      if (over) U.glowText(ctx, 'GAME OVER', W / 2, cy, 18, '#ff4d6d');
    }

    return {
      // Read-only test hook: what is on screen right now.
      debug: function () {
        return {
          level: level, maze: maze.name, mazeIndex: maze.index, mazes: MAZE_LIST.length, pellets: left, lives: lives,
          mode: frightT > 0 ? 'fright' : chase ? 'chase' : 'scatter', phase: phaseIdx,
          player: { x: player.x, y: player.y, dir: player.dir, want: player.want },
          item: item ? { kind: item.kind, x: item.x, y: item.y } : null, freeze: freezeT > 0, boost: boostT > 0,
          glitches: glitches.map(function (g) { return { name: g.p.name, mode: modeOf(g), x: +g.x.toFixed(2), y: +g.y.toFixed(2), dir: g.dir }; }),
          ready: readyT > 0, dead: dying > 0 || over, cleared: clearT > 0, over: over
        };
      },
      update: update,
      render: render
    };
  }

  /* ==================================================================
   * 9. ATTRACT PREVIEW: muncher chased along a neon corridor, grabs the
   *    core, turns and chases the glitches back.
   * ================================================================== */
  function attract(ctx, w, h, t) {
    var bg = '#04040f', wall = '#4d7bff';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    var cell = Math.max(10, Math.min(h / 5, w / 11));
    var cy = h * 0.52, half = cell * 0.95;
    // double-line corridor
    ctx.save();
    ctx.lineCap = 'round';
    [[half, 2.2, wall, 10], [half + 5, 1, '#a9c1ff', 4]].forEach(function (L) {
      ctx.strokeStyle = L[2]; ctx.lineWidth = L[1]; ctx.shadowColor = wall; ctx.shadowBlur = L[3];
      ctx.beginPath(); ctx.moveTo(4, cy - L[0]); ctx.lineTo(w - 4, cy - L[0]); ctx.moveTo(4, cy + L[0]); ctx.lineTo(w - 4, cy + L[0]); ctx.stroke();
    });
    ctx.restore();
    var cyc = t % 9, coreX = w * 0.86, gap = cell * 1.15;
    var mx, dir, gx = [], looks = [];
    if (cyc < 4.5) {                               // chased: glitches hot on the muncher's heels
      var u = cyc / 4.5;
      mx = -cell + u * (coreX + cell);
      dir = 'right';
      for (var i = 0; i < 4; i++) { gx.push(mx - cell * 1.5 - i * gap + Math.sin(t * 5 + i) * 1.5); looks.push('chase'); }
      ctx.fillStyle = '#ffe9a8';                   // pellets ahead of the muncher, then the core
      for (var p = cell * 0.5; p < coreX - cell * 0.5; p += cell * 0.7) if (p > mx + cell * 0.3) ctx.fillRect(p - 2, cy - 2, 4, 4);
      var pulse = 1 + Math.sin(t * 8) * 0.25;
      ctx.save(); ctx.translate(coreX, cy); ctx.rotate(t * 1.5);
      ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12;
      ctx.fillRect(-cell * 0.22 * pulse, -cell * 0.22 * pulse, cell * 0.44 * pulse, cell * 0.44 * pulse);
      ctx.restore();
    } else {                                       // powered up: turn and eat them one by one
      var v = (cyc - 4.5) / 4.5, fleeK = 0.55 * coreX, chaseK = coreX + 2 * cell;
      mx = coreX - v * chaseK;
      dir = 'left';
      for (var j = 0; j < 4; j++) {
        var start = coreX - cell * 1.5 - j * gap;
        var vEat = (cell * 1.2 + j * gap) / (chaseK - fleeK);
        if (v < vEat) { gx.push(start - v * fleeK); looks.push(v > 0.7 && Math.floor(t * 8) % 2 ? 'flash' : 'fright'); }
        else { gx.push(start - vEat * fleeK + (v - vEat) * w * 1.3); looks.push('eyes'); }   // eyes race home
      }
    }
    GLITCHES.forEach(function (gp, k) {
      drawGlitch(ctx, gx[k], cy, cell * 0.9, gp, looks[k], looks[k] === 'eyes' ? 'right' : dir, t, k * 1.7);
    });
    drawMuncher(ctx, mx, cy, cell * 0.9, dir, Math.abs(Math.sin(t * 12)) * 0.45, ACCENT);
    // roll call: one name at a time, under its glitch
    var tag = Math.floor(t / 1.1) % GLITCHES.length;
    if (cyc < 4.5 && gx[tag] > cell * 0.8) {
      ctx.save();
      ctx.font = '700 ' + Math.max(8, Math.round(cell * 0.3)) + 'px ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = GLITCHES[tag].color;
      ctx.fillText(GLITCHES[tag].name, gx[tag], cy + half + cell * 0.45);
      ctx.restore();
    }
  }

  XA.registerGame({
    id: 'xa_maze_muncher',
    order: 13,
    title: 'Maze Muncher',
    tagline: 'Five mazes. Four glitches. One appetite.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD to steer \u00b7 swipe on mobile \u00b7 Space shows glitch targets',
    create: create,
    attract: attract
  });
})(window);

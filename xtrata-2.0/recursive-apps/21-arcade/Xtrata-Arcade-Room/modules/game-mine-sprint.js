/*
 * Xtrata Arcade cartridge #20 -- MINE SPRINT (v2)
 *
 * Minesweeper, built for speed runs:
 *   - SPRINT (score mode): a run of boards that grow in size and density.
 *     Every revealed cell scores, every cleared board banks a speed bonus,
 *     one mine ends the run and everything banked so far counts.
 *   - CLASSIC (time variant): one 16x16 / 40-mine board. The timer starts on
 *     the first click, the score is the clear time in centiseconds (lower
 *     wins), a mine is a DNF.
 *
 * Every board is NO-GUESS: it is generated on the first click (when the safe
 * opening is known) and handed to a built-in logic SOLVER. A board is only
 * accepted if the solver can clear it from that first click using pure
 * deduction, so a good player never has to flip a coin.
 *
 * Fairness rules this file keeps:
 *   - debug() never exposes mine positions or unrevealed cell contents.
 *   - Music, visuals and timing only react to REVEALED cells. Hidden mines are
 *     never drawn, heard or timed until the board is lost or cleared.
 *   - api.rng (seeded) drives board generation; Math.random is visuals only.
 *
 * Contract game-id: xa_mine_sprint
 *   base mode 'score' (label "Sprint"), variant 'classic' in mode 'time'.
 *
 * File map:
 *   1. Layout + constants
 *   2. Data tables (levels, classic board, themes, animation timing)
 *   3. Music
 *   4. BOARD + SOLVER  (pure functions: generation, deduction, repair)
 *   5. Sprites (cached per theme and cell size)
 *   6. The game (create): state, rules, input, animation, rendering
 *   7. Attract loop
 *   8. Registration
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-mine-sprint');
  var U = XA.util;

  /* ================================================================
   * 1. LAYOUT + CONSTANTS
   * ================================================================ */
  var W = 420, H = 500;
  var TOP = 64;            // the board area starts below the HUD strip
  var AREA = 396;          // square board area (TOP .. TOP + AREA)
  var MAX_CS = 46;         // biggest cell size in playfield units
  var SPR = 3;             // sprites are drawn at 3x so they stay crisp when scaled
  var GEN_BUDGET_MS = 6;   // max generator work per frame (keeps 60 fps)
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var ACCENT = '#39ff88';
  var BTN = { x: W - 118, y: 14, w: 106, h: 34 };   // flag-mode toggle
  var M = function () { return XA.music; };
  var ARP = [0, 2, 4, 7, 9, 11, 14, 16];             // flood-reveal arpeggio degrees
  var X = '\u00d7', DOT = ' \u00b7 ';

  /* ================================================================
   * 2. DATA TABLES
   * ================================================================ */

  // SPRINT board progression. One row per board; after the table runs out
  // the last size repeats with LATE_STEP more mines per board (up to LATE_CAP).
  var LEVELS = [
    { cols: 8,  rows: 8,  mines: 10 },   // 16%
    { cols: 9,  rows: 9,  mines: 13 },
    { cols: 10, rows: 10, mines: 17 },
    { cols: 11, rows: 11, mines: 21 },
    { cols: 12, rows: 12, mines: 26 },   // 18%
    { cols: 13, rows: 13, mines: 31 },
    { cols: 14, rows: 14, mines: 37 },
    { cols: 15, rows: 15, mines: 43 },
    { cols: 16, rows: 16, mines: 50 }    // 19.5%
  ];
  var LATE_STEP = 2, LATE_CAP = 56;      // 16x16 tops out at ~22% mines

  // CLASSIC variant: one fixed board (the traditional "intermediate").
  var CLASSIC = { cols: 16, rows: 16, mines: 40 };

  function levelSpec(level) {
    if (level <= LEVELS.length) return LEVELS[level - 1];
    var last = LEVELS[LEVELS.length - 1];
    var extra = (level - LEVELS.length) * LATE_STEP;
    return { cols: last.cols, rows: last.rows, mines: Math.min(LATE_CAP, last.mines + extra) };
  }
  // Par time for the Sprint clear bonus (the v1 formula, kept as-is).
  function parTime(level) { return 40 + level * 20; }
  function clearBonus(level, secs) {
    return 150 * level + Math.max(0, Math.round((parTime(level) - secs) * 8 * level));
  }

  // THEMES cycle per Sprint board (Classic always uses the first one).
  //   style  picks the tile painter in section 5
  //   hidden / open: [even, odd] checker colours
  //   num[1..8]: number colours, chosen for contrast on that theme's open tile
  var THEMES = [
    { key: 'grey', name: 'CLASSIC GREY', style: 'bevel',
      bg: '#14161b', frame: '#808080', hud: '#e8e8e8', timer: '#ff3b30',
      hidden: ['#c6c6c6', '#c6c6c6'], hi: '#ffffff', lo: '#7b7b7b',
      open: ['#bdbdbd', '#bdbdbd'], line: '#8c8c8c',
      num: ['', '#0000f0', '#007b00', '#e00000', '#000080', '#800000', '#007b7b', '#000000', '#555555'],
      flag: '#e00000', pole: '#111111', mine: '#111111', hit: '#ff2a2a',
      accent: '#ffd23f', cursor: '#ffd23f', sweep: '255,255,255', glow: false },
    { key: 'neon', name: 'NEON', style: 'neon',
      bg: '#05070f', frame: '#0a0f1f', hud: '#c8ffe0', timer: '#39ff88',
      hidden: ['#1b2446', '#1f2a52'], hi: 'rgba(120,170,255,0.45)', lo: '#0c1128',
      open: ['#0d1422', '#0f1726'], line: '#1c2a48',
      num: ['', '#3ff0ff', '#39ff88', '#ffd23f', '#ff9f1c', '#ff4d6d', '#ff3fa4', '#b04dff', '#ffffff'],
      flag: '#ffd23f', pole: '#ffe98a', mine: '#ff4d6d', hit: '#5a0f1f',
      accent: '#39ff88', cursor: '#39ff88', sweep: '57,255,136', glow: true },
    { key: 'garden', name: 'GARDEN', style: 'flat',
      bg: '#0e1a0b', frame: '#4a8a2c', hud: '#e9ffd0', timer: '#c5f36b',
      hidden: ['#8ecc39', '#a7d948'], hi: 'rgba(255,255,255,0.22)', lo: 'rgba(0,0,0,0.10)',
      open: ['#e5c29f', '#d7b899'], line: 'rgba(0,0,0,0.05)',
      num: ['', '#1565c0', '#2e7d32', '#d32f2f', '#6a1b9a', '#e65100', '#00838f', '#37474f', '#5d4037'],
      flag: '#f23607', pole: '#4e342e', mine: '#2b1d16', hit: '#db3236',
      accent: '#c5f36b', cursor: '#ffffff', sweep: '255,255,210', glow: false },
    { key: 'ice', name: 'ICE', style: 'frost',
      bg: '#061426', frame: '#14375a', hud: '#dff6ff', timer: '#8fe3ff',
      hidden: ['#79c3ec', '#8accf0'], hi: 'rgba(255,255,255,0.85)', lo: '#3a86b8',
      open: ['#eaf7ff', '#dcf0fb'], line: '#b8dcef',
      num: ['', '#0b5fa5', '#0f7b6c', '#c2185b', '#283593', '#6a1b9a', '#00838f', '#263238', '#546e7a'],
      flag: '#ff3d67', pole: '#1d3b57', mine: '#14375a', hit: '#ff8fa3',
      accent: '#8fe3ff', cursor: '#ff3d67', sweep: '220,245,255', glow: false }
  ];

  // Animation timing (seconds unless noted). Purely visual: game state always
  // updates immediately, these only decide how the change is shown.
  var ANIM = {
    intro: 0.012,      // new board: per-diagonal delay as tiles pop in
    introPop: 0.18,
    ripple: 0.028,     // cascade: delay per step of flood distance
    rippleMax: 0.6,    // ...capped so huge floods still land quickly
    flip: 0.14,        // cover shrinking off a revealed tile
    flagDrop: 0.2,     // flag plant: fall time
    flagWave: 0.9,     // flag plant: wobble settle time
    unflag: 0.22,      // unflag pop
    boomHold: 0.45,    // pause after the blast before other mines appear
    mineGap: 0.075,    // max gap between revealed mines after a loss
    mineSpan: 1.5,     // ...all remaining mines appear within this window
    deadHold: 1.0,     // hold after the last mine before GAME OVER / DNF
    sweep: 24,         // win sweep speed, in diagonals per second
    clearHold: 2.4,    // Sprint: celebration before the next board
    finishHold: 1.9    // Classic: celebration before api.finish()
  };

  /* ================================================================
   * 3. MUSIC
   * Tense B harmonic-minor clock. Music only ever reacts to cells already
   * revealed (public info) -- never to hidden mines.
   * ================================================================ */
  function song() {
    return {
      bpm: 96, key: 59, scale: 'harmonic', chords: [0, 5, 3, 4], seed: 20,
      tracks: [
        { name: 'tick', inst: 'hat', layer: 0, gain: 0.26, pattern: 'X.x.x.x.X.x.x.x.' },
        { name: 'pulse', inst: 'bass', layer: 0, gain: 0.34, chord: true, octave: -2, params: { cutoff: 380, q: 3 },
          pattern: '0 . . . 0 . . . 0 . . . 0 . . .' },
        { name: 'tock', inst: 'shaker', layer: 0.15, gain: 0.32, pattern: '..x...x...x...xx' },
        { name: 'pad', inst: 'pad', layer: 0.3, gain: 0.28, chord: true, octave: -1, params: { cutoff: 700 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0.5, gain: 0.45, pattern: 'x.....x...x.....' },
        { name: 'arp', inst: 'arp', layer: 0.7, gain: 0.2, chord: true, octave: 1, rate: 2, params: { cutoff: 1400 },
          fn: function (i) { return [0, 2, 4, 2][(i.step / 2) % 4]; } },
        { name: 'glint', inst: 'bell', layer: 0.88, gain: 0.24, chord: true, octave: 2, rate: 4,
          fn: function (i) { return i.rng() < 0.4 ? { deg: [0, 2, 4][Math.floor(i.rng() * 3)], vel: 0.5 } : null; } }
      ]
    };
  }

  /* ================================================================
   * 4. BOARD + SOLVER
   *
   * Everything in this section is a pure function of its arguments: no game
   * state, no drawing, no clock (except the generator's per-frame budget,
   * which only decides WHEN work happens, never WHAT the result is).
   *
   * A board is { cols, rows, size, mines, mine: Uint8Array, num: Uint8Array,
   * nb: neighbour table }. Cells are indexed i = r * cols + c.
   *
   * How a no-guess board is made (Generator):
   *   1. Scatter mines at random, keeping the 3x3 around the first click
   *      clear so the first click always opens a patch.
   *   2. Ask the SOLVER to clear it from that click by deduction only.
   *   3. Solved -> done. Stuck -> REPAIR: move one mine that sits on the
   *      solver's frontier to a random spot away from it, and solve again.
   *   4. Too many repairs -> scatter a fresh board. A hard cap on total work
   *      falls back to the last board (flagged noGuess = false) so the game
   *      can never hang; in testing the cap is never reached.
   * ================================================================ */

  var NB_CACHE = {};
  // For every cell, the list of indices of its (up to 8) neighbours.
  function neighbourTable(cols, rows) {
    var key = cols + 'x' + rows;
    if (NB_CACHE[key]) return NB_CACHE[key];
    var table = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var list = [];
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        var nc = c + dc, nr = r + dr;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) list.push(nr * cols + nc);
      }
      table.push(list);
    }
    NB_CACHE[key] = table;
    return table;
  }

  function emptyBoard(spec) {
    var size = spec.cols * spec.rows;
    return { cols: spec.cols, rows: spec.rows, size: size, mines: spec.mines,
      mine: new Uint8Array(size), num: new Uint8Array(size), nb: neighbourTable(spec.cols, spec.rows) };
  }

  function computeNumbers(b) {
    for (var i = 0; i < b.size; i++) {
      var list = b.nb[i], k = 0;
      for (var j = 0; j < list.length; j++) k += b.mine[list[j]];
      b.num[i] = k;
    }
  }

  // The first click and its neighbours never hold a mine.
  function safeZone(b, start) {
    var zone = new Uint8Array(b.size);
    zone[start] = 1;
    for (var j = 0; j < b.nb[start].length; j++) zone[b.nb[start][j]] = 1;
    return zone;
  }

  // Place b.mines mines uniformly outside the safe zone (partial Fisher-Yates).
  function scatterMines(b, zone, rng) {
    var pool = [], i;
    for (i = 0; i < b.size; i++) { b.mine[i] = 0; if (!zone[i]) pool.push(i); }
    for (var k = 0; k < b.mines && k < pool.length; k++) {
      var j = k + Math.floor(rng() * (pool.length - k));
      var tmp = pool[k]; pool[k] = pool[j]; pool[j] = tmp;
      b.mine[pool[k]] = 1;
    }
    computeNumbers(b);
  }

  /* ---------------------------------------------------------------- SOLVER
   * solve(board, start) plays the board the way a careful human would: it
   * opens `start`, then repeatedly applies three deduction rules, only ever
   * opening cells it has PROVEN safe and marking cells it has PROVEN to be
   * mines. It reads a number only after "opening" that cell, exactly like a
   * player. If no rule makes progress the board would need a guess.
   *
   * Knowledge per cell: UNKNOWN, OPEN (proven safe and opened), MINE (proven).
   *
   * A CONSTRAINT comes from an open number: "exactly `rem` mines among these
   * unknown neighbours" (rem = the number minus mines already proven).
   *
   *  Rule 1  SINGLE   rem == 0            -> every unknown neighbour is safe
   *                   rem == unknowns     -> every unknown neighbour is a mine
   *
   *  Rule 2  PAIR     Two overlapping constraints A and B. Split into
   *          (subset) onlyA, shared, onlyB. Mines in `shared` lie in
   *                   [ max(0, A.rem - |onlyA|), min(A.rem, |shared|) ] = [lo, hi]
   *                   so onlyB holds between B.rem - hi and B.rem - lo mines:
   *                     B.rem - hi == |onlyB|  -> all of onlyB are mines
   *                     B.rem - lo == 0        -> all of onlyB are safe
   *                   This covers the classic subset rule (onlyA empty) and
   *                   the 1-2 / 1-2-1 edge patterns.
   *
   *  Rule 3  COUNT    Mines left == 0 -> every unknown is safe;
   *                   mines left == unknowns -> every unknown is a mine.
   *
   * Cheap rules run first; a pass that makes progress restarts the loop.
   * Returns { solved, opened, stats } -- stats count how often each rule
   * fired, handy for tuning and for the solver test.
   * -------------------------------------------------------------------- */
  var UNKNOWN = 0, OPEN = 1, KNOWN_MINE = 2;

  function solve(b, start) {
    var nb = b.nb, n = b.size;
    var st = new Uint8Array(n);
    var opened = 0, provenMines = 0, broken = false;
    var safeTotal = n - b.mines;
    var stats = { single: 0, pair: 0, count: 0, passes: 0 };

    // Open a proven-safe cell; zeros flood exactly like the game does.
    function open(i) {
      var stack = [i];
      while (stack.length) {
        var j = stack.pop();
        if (st[j] !== UNKNOWN) continue;
        if (b.mine[j]) { broken = true; return; }   // impossible unless a rule is wrong
        st[j] = OPEN; opened++;
        if (b.num[j] === 0) for (var k = 0; k < nb[j].length; k++) stack.push(nb[j][k]);
      }
    }
    function markMine(i) {
      if (st[i] !== UNKNOWN) return;
      if (!b.mine[i]) broken = true;                 // same sanity check
      st[i] = KNOWN_MINE; provenMines++;
    }
    function openAll(list) { for (var k = 0; k < list.length; k++) open(list[k]); }
    function markAll(list) { for (var k = 0; k < list.length; k++) markMine(list[k]); }

    // The constraint an open number puts on its unknown neighbours, or null.
    function constraintOf(i) {
      var cells = [], rem = b.num[i], list = nb[i];
      for (var k = 0; k < list.length; k++) {
        var s = st[list[k]];
        if (s === UNKNOWN) cells.push(list[k]);
        else if (s === KNOWN_MINE) rem--;
      }
      return cells.length ? { cells: cells, rem: rem } : null;
    }

    // Rule 1: a number that is already satisfied, or that needs every unknown.
    function ruleSingle() {
      var progress = false;
      for (var i = 0; i < n; i++) {
        if (st[i] !== OPEN || !b.num[i]) continue;
        var con = constraintOf(i);
        if (!con) continue;
        if (con.rem === 0) { openAll(con.cells); progress = true; }
        else if (con.rem === con.cells.length) { markAll(con.cells); progress = true; }
      }
      if (progress) stats.single++;
      return progress;
    }

    // Rule 2: compare every pair of constraints that share an unknown cell.
    // (A constraint stays TRUE even after some of its cells become known, so
    // applying several deductions from one snapshot is safe.)
    function rulePairs() {
      var cons = [], byCell = {}, i, k;
      for (i = 0; i < n; i++) {
        if (st[i] !== OPEN || !b.num[i]) continue;
        var con = constraintOf(i);
        if (!con) continue;
        con.id = cons.length;
        cons.push(con);
        for (k = 0; k < con.cells.length; k++) (byCell[con.cells[k]] = byCell[con.cells[k]] || []).push(con.id);
      }
      var progress = false;
      for (var a = 0; a < cons.length; a++) {
        var A = cons[a], inA = {};
        for (k = 0; k < A.cells.length; k++) inA[A.cells[k]] = true;
        // partners: every constraint touching one of A's cells
        var partners = {};
        for (k = 0; k < A.cells.length; k++) {
          var ids = byCell[A.cells[k]];
          for (var q = 0; q < ids.length; q++) if (ids[q] !== a) partners[ids[q]] = true;
        }
        for (var pid in partners) {
          var B = cons[pid], shared = 0, onlyB = [];
          for (k = 0; k < B.cells.length; k++) {
            if (inA[B.cells[k]]) shared++; else onlyB.push(B.cells[k]);
          }
          if (!onlyB.length) continue;
          var onlyA = A.cells.length - shared;
          var hi = Math.min(A.rem, shared);            // most mines the overlap can hold
          var lo = Math.max(0, A.rem - onlyA);         // fewest mines the overlap can hold
          if (B.rem - hi === onlyB.length) { markAll(onlyB); progress = true; }
          else if (B.rem - lo === 0) { openAll(onlyB); progress = true; }
        }
      }
      if (progress) stats.pair++;
      return progress;
    }

    // Rule 3: the global mine counter.
    function ruleCount() {
      var unknown = [];
      for (var i = 0; i < n; i++) if (st[i] === UNKNOWN) unknown.push(i);
      if (!unknown.length) return false;
      var left = b.mines - provenMines;
      if (left === 0) openAll(unknown);
      else if (left === unknown.length) markAll(unknown);
      else return false;
      stats.count++;
      return true;
    }

    open(start);
    while (opened < safeTotal && !broken) {
      stats.passes++;
      if (ruleSingle() || rulePairs() || ruleCount()) continue;
      break;   // stuck: the next move would be a guess
    }
    return { solved: !broken && opened === safeTotal, opened: opened, broken: broken, stats: stats, state: st };
  }

  /* REPAIR: the solver got stuck. Take one mine sitting on the frontier (an
   * unknown cell touching an opened cell) and move it to a random unknown
   * cell that touches nothing opened. The board changes a little, and the
   * solver re-runs from the first click. Returns false if no move exists. */
  function repair(b, st, zone, rng) {
    var frontierMines = [], far = [];
    for (var i = 0; i < b.size; i++) {
      if (st[i] !== UNKNOWN) continue;
      var touchesOpen = false, list = b.nb[i];
      for (var k = 0; k < list.length; k++) if (st[list[k]] === OPEN) { touchesOpen = true; break; }
      if (touchesOpen && b.mine[i]) frontierMines.push(i);
      else if (!touchesOpen && !b.mine[i] && !zone[i]) far.push(i);
    }
    if (!frontierMines.length || !far.length) return false;
    b.mine[frontierMines[Math.floor(rng() * frontierMines.length)]] = 0;
    b.mine[far[Math.floor(rng() * far.length)]] = 1;
    computeNumbers(b);
    return true;
  }

  /* GENERATOR: builds one no-guess board, a slice of work per frame.
   *   var g = createGenerator(spec, startIndex, rng);
   *   g.step(ms)  -> true once g.board is ready (g.noGuess says if verified)
   * The sequence of rng calls depends only on the work done, never on the
   * clock, so a seed always produces the same board however it is sliced. */
  var MAX_REPAIRS = 40;    // repairs per scattered board before reshuffling
  var MAX_SOLVES = 2400;   // hard cap on total solver runs (fallback after)

  function createGenerator(spec, start, rng) {
    var b = emptyBoard(spec);
    var zone = safeZone(b, start);
    var fresh = true, repairs = 0;
    var clock = root.performance && root.performance.now ? function () { return root.performance.now(); } : Date.now;
    var g = { board: b, done: false, noGuess: false, solves: 0, shuffles: 0, repairs: 0, ms: 0 };

    // One unit of work: (maybe scatter) + one solve (+ maybe one repair).
    function unit() {
      if (fresh) { scatterMines(b, zone, rng); fresh = false; repairs = 0; g.shuffles++; }
      var res = solve(b, start);
      g.solves++;
      if (res.solved) { g.done = true; g.noGuess = true; g.stats = res.stats; return; }
      if (g.solves >= MAX_SOLVES) { g.done = true; g.noGuess = false; return; }   // graceful fallback
      if (repairs < MAX_REPAIRS && repair(b, res.state, zone, rng)) { repairs++; g.repairs++; }
      else fresh = true;
    }
    g.step = function (budgetMs) {
      var t0 = clock();
      do { unit(); } while (!g.done && clock() - t0 < budgetMs);
      g.ms += clock() - t0;
      return g.done;
    };
    return g;
  }

  /* ================================================================
   * 5. SPRITES
   * Every tile face, number, flag and mine is painted once per theme and
   * cell size into a small offscreen canvas (at SPR x resolution) and then
   * blitted with drawImage.
   * ================================================================ */
  var SPRITE_CACHE = {};

  function paint(size, fn) {
    var cv = root.document.createElement('canvas');
    cv.width = cv.height = size;
    fn(cv.getContext('2d'), size);
    return cv;
  }
  function rr(g, x, y, w, h, r) { U.roundRect(g, x, y, w, h, r); }

  // Covered tile, painted per theme style.
  function paintHidden(g, s, th, alt) {
    var fill = th.hidden[alt], b;
    if (th.style === 'bevel') {                       // Win-95 raised square
      b = Math.max(2, s * 0.12);
      g.fillStyle = fill; g.fillRect(0, 0, s, s);
      g.fillStyle = th.hi;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(s, 0); g.lineTo(s - b, b); g.lineTo(b, b); g.lineTo(b, s - b); g.lineTo(0, s); g.closePath(); g.fill();
      g.fillStyle = th.lo;
      g.beginPath(); g.moveTo(s, s); g.lineTo(0, s); g.lineTo(b, s - b); g.lineTo(s - b, s - b); g.lineTo(s - b, b); g.lineTo(s, 0); g.closePath(); g.fill();
    } else if (th.style === 'neon') {                 // dark glass with a lit rim
      b = SPR * 1.2;
      rr(g, b, b, s - b * 2, s - b * 2, s * 0.14); g.fillStyle = fill; g.fill();
      g.lineWidth = SPR; g.strokeStyle = th.hi; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(b * 2, b * 2, s - b * 4, s * 0.1);
    } else if (th.style === 'flat') {                 // lawn checkerboard
      g.fillStyle = fill; g.fillRect(0, 0, s, s);
      g.fillStyle = th.hi; g.fillRect(0, 0, s, s * 0.08);
      g.fillStyle = th.lo; g.fillRect(0, s * 0.9, s, s * 0.1);
    } else {                                          // frost: icy block
      b = SPR;
      var grad = g.createLinearGradient(0, 0, s, s);
      grad.addColorStop(0, '#d8f2ff'); grad.addColorStop(0.35, fill); grad.addColorStop(1, th.lo);
      rr(g, b, b, s - b * 2, s - b * 2, s * 0.12); g.fillStyle = grad; g.fill();
      g.lineWidth = SPR * 0.8; g.strokeStyle = 'rgba(255,255,255,0.55)'; g.stroke();
      g.strokeStyle = th.hi; g.lineWidth = s * 0.06;
      g.beginPath(); g.moveTo(s * 0.22, s * 0.52); g.lineTo(s * 0.5, s * 0.22); g.stroke();
      g.lineWidth = s * 0.035;
      g.beginPath(); g.moveTo(s * 0.3, s * 0.68); g.lineTo(s * 0.66, s * 0.3); g.stroke();
    }
  }

  // Opened tile (the number is a separate sprite on top).
  function paintOpen(g, s, th, alt) {
    var fill = th.open[alt];
    if (th.style === 'bevel') {
      g.fillStyle = fill; g.fillRect(0, 0, s, s);
      g.fillStyle = th.line; g.fillRect(0, 0, s, SPR); g.fillRect(0, 0, SPR, s);
    } else if (th.style === 'neon') {
      rr(g, SPR, SPR, s - SPR * 2, s - SPR * 2, s * 0.1); g.fillStyle = fill; g.fill();
      g.lineWidth = SPR * 0.8; g.strokeStyle = th.line; g.stroke();
    } else if (th.style === 'flat') {
      g.fillStyle = fill; g.fillRect(0, 0, s, s);
    } else {
      rr(g, SPR * 0.7, SPR * 0.7, s - SPR * 1.4, s - SPR * 1.4, s * 0.08); g.fillStyle = fill; g.fill();
      g.lineWidth = SPR * 0.6; g.strokeStyle = th.line; g.stroke();
    }
  }

  function paintNumber(g, s, th, n) {
    g.font = '900 ' + Math.round(s * 0.64) + 'px ' + MONO;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (th.glow) { g.shadowColor = th.num[n]; g.shadowBlur = s * 0.2; }
    g.fillStyle = th.num[n];
    g.fillText(String(n), s / 2, s / 2 + s * 0.04);
    if (th.glow) { g.shadowBlur = 0; g.globalAlpha = 0.35; g.fillStyle = '#ffffff'; g.fillText(String(n), s / 2, s / 2 + s * 0.04); g.globalAlpha = 1; }
  }

  // Flag: the pole's foot sits at (0.48s, 0.8s) -- the plant animation pivots there.
  function paintFlag(g, s, th) {
    if (th.glow) { g.shadowColor = th.flag; g.shadowBlur = s * 0.2; }
    g.fillStyle = th.pole;
    g.fillRect(s * 0.3, s * 0.76, s * 0.4, s * 0.08);                 // base
    g.fillRect(s * 0.45, s * 0.18, s * 0.06, s * 0.6);                // pole
    g.fillStyle = th.flag;
    g.beginPath(); g.moveTo(s * 0.51, s * 0.16); g.lineTo(s * 0.8, s * 0.32); g.lineTo(s * 0.51, s * 0.5); g.closePath(); g.fill();
  }

  // `color` overrides the theme's mine colour (the HUD counter uses the HUD colour).
  function paintMine(g, s, th, color) {
    var cx = s / 2, cy = s / 2, r = s * 0.22, col = color || th.mine;
    if (th.glow) { g.shadowColor = col; g.shadowBlur = s * 0.25; }
    g.strokeStyle = col; g.lineWidth = s * 0.07; g.lineCap = 'round';
    for (var k = 0; k < 4; k++) {
      var a = k * Math.PI / 4;
      g.beginPath();
      g.moveTo(cx - Math.cos(a) * r * 1.55, cy - Math.sin(a) * r * 1.55);
      g.lineTo(cx + Math.cos(a) * r * 1.55, cy + Math.sin(a) * r * 1.55);
      g.stroke();
    }
    g.fillStyle = col;
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.beginPath(); g.arc(cx - r * 0.35, cy - r * 0.35, r * 0.28, 0, Math.PI * 2); g.fill();
  }

  function paintCross(g, s) {
    g.strokeStyle = '#ff2040'; g.lineWidth = s * 0.09; g.lineCap = 'round';
    g.beginPath(); g.moveTo(s * 0.2, s * 0.2); g.lineTo(s * 0.8, s * 0.8);
    g.moveTo(s * 0.8, s * 0.2); g.lineTo(s * 0.2, s * 0.8); g.stroke();
  }

  function sprites(th, cs) {
    var key = th.key + ':' + cs;
    if (SPRITE_CACHE[key]) return SPRITE_CACHE[key];
    var s = Math.max(4, Math.round(cs * SPR));
    var set = {
      hidden: [0, 1].map(function (alt) { return paint(s, function (g) { paintHidden(g, s, th, alt); }); }),
      open: [0, 1].map(function (alt) { return paint(s, function (g) { paintOpen(g, s, th, alt); }); }),
      num: [null],
      flag: paint(s, function (g) { paintFlag(g, s, th); }),
      mine: paint(s, function (g) { paintMine(g, s, th); }),
      hudMine: paint(s, function (g) { paintMine(g, s, th, th.hud); }),
      cross: paint(s, function (g) { paintCross(g, s); })
    };
    for (var n = 1; n <= 8; n++) set.num.push(paint(s, (function (k) { return function (g) { paintNumber(g, s, th, k); }; })(n)));
    SPRITE_CACHE[key] = set;
    return set;
  }

  // Draw a sprite into cell (x, y, cs) scaled by k about its centre.
  function blitScaled(ctx, img, x, y, cs, k) {
    if (k <= 0) return;
    var d = cs * k;
    ctx.drawImage(img, x + (cs - d) / 2, y + (cs - d) / 2, d, d);
  }

  /* ================================================================
   * 6. THE GAME
   * ================================================================ */
  function create(api) {
    var rng = api.rng;
    var CLASSIC_MODE = api.mode === 'time';

    /* ---------------- state ---------------- */
    var level = 0;              // Sprint board number (Classic: always 1)
    var spec, cols, rows, nb;   // current board shape
    var cs, ox, oy;             // cell size + board origin
    var theme, spr;             // current theme + its sprites
    var cells;                  // per cell: { mine, n, open, flag, visT, flagT, shownT }
    var placed = false;         // mines exist (after the first click)
    var gen = null, genT = 0;   // running generator + when it started
    var pending = -1;           // index of the first click waiting on the generator
    var noGuess = false, genInfo = null;
    var opened = 0, flags = 0;
    var time = 0, running = false;
    var flagMode = false, cursor = { c: 0, r: 0 }, press = null;
    var t = 0;
    var dead = false, deadT = 0, boom = -1, mineQueue = [], mineShown = 0, gameOverAt = 0, overSent = false;
    var cleared = false, clearT = 0, finished = false, clearInfo = null;
    var flashA = 0, flashCol = '#ffffff';
    var introT0 = 0, banner = null, pops = [], chordFlash = null;
    var noteBudget = 4, lastI = -1;

    function idx(c, r) { return r * cols + c; }
    function colOf(i) { return i % cols; }
    function rowOf(i) { return Math.floor(i / cols); }
    function cellX(i) { return ox + colOf(i) * cs; }
    function cellY(i) { return oy + rowOf(i) * cs; }
    function safeCount() { return cols * rows - spec.mines; }

    /* ---------------- board lifecycle ---------------- */
    function newBoard() {
      level++;
      spec = CLASSIC_MODE ? CLASSIC : levelSpec(level);
      cols = spec.cols; rows = spec.rows;
      nb = neighbourTable(cols, rows);
      cs = Math.min(MAX_CS, Math.floor(Math.min(AREA / cols, AREA / rows)));
      ox = Math.floor((W - cs * cols) / 2);
      oy = TOP + Math.floor((AREA - cs * rows) / 2);
      theme = CLASSIC_MODE ? THEMES[0] : THEMES[(level - 1) % THEMES.length];
      spr = null;   // built lazily on first render (needs a document)
      cells = [];
      for (var i = 0; i < cols * rows; i++) cells.push({ mine: false, n: 0, open: false, flag: false, visT: 0, flagT: 0, shownT: -1 });
      placed = false; gen = null; pending = -1; noGuess = false; genInfo = null;
      opened = 0; flags = 0; time = 0; running = false;
      cleared = false; clearT = 0; clearInfo = null; pops = []; chordFlash = null;
      cursor = { c: Math.floor(cols / 2), r: Math.floor(rows / 2) };
      introT0 = t;
      banner = CLASSIC_MODE
        ? { a: 'CLASSIC ' + cols + X + rows, b: spec.mines + ' MINES' + DOT + 'NO GUESS', t: t }
        : { a: 'BOARD ' + level, b: theme.name + DOT + cols + X + rows + DOT + spec.mines + ' MINES', t: t };
    }

    // First click: start the no-guess generator around it.
    function startGenerator(i) {
      gen = createGenerator(spec, i, rng);
      genT = t;
      pending = i;
      stepGenerator();
    }
    function stepGenerator() {
      if (!gen || !gen.step(GEN_BUDGET_MS)) return;
      // Board ready: copy it into the live cells (hidden until revealed).
      var b = gen.board;
      for (var i = 0; i < cells.length; i++) { cells[i].mine = !!b.mine[i]; cells[i].n = b.num[i]; }
      noGuess = gen.noGuess;
      genInfo = { solves: gen.solves, shuffles: gen.shuffles, repairs: gen.repairs, ms: Math.round(gen.ms * 10) / 10 };
      gen = null;
      placed = true;
      running = true;             // the clock starts with the first reveal
      var start = pending;
      pending = -1;
      if (cells[start].flag) { cells[start].flag = false; flags--; }
      reveal(colOf(start), rowOf(start));
    }

    /* ---------------- music ---------------- */
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    function syncMusic() {
      var m = M();
      if (!m) return;
      var v = Math.round(Math.pow(U.clamp(opened / Math.max(1, safeCount()), 0, 1), 1.6) * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
    }
    // Revealed-cell sound: one number -> its marimba degree IS the number;
    // a flood -> a quick arpeggio. Only ever called for revealed cells.
    function revealSound(gained, n) {
      var m = M();
      if (!m) { api.audio.tone(gained > 1 ? 660 : 520, 0.04, { type: 'triangle', vol: 0.1 }); return; }
      if (noteBudget <= 0) return;
      noteBudget--;
      if (gained === 1) m.note('marimba', n, { quantize: '16', octave: 1, gain: 0.8 });
      else {
        var t0 = m.nextGrid('16'), sps = 15 / Math.max(40, m.tempo() || 96);
        for (var a = 0; a < Math.min(8, gained); a++) m.note('marimba', ARP[a], { at: t0 + a * sps * 0.5, chord: true, octave: 1, gain: 0.65 });
      }
    }

    /* ---------------- rules ---------------- */

    // Reveal one cell. Game state changes NOW; the ripple is visual only
    // (each cell gets a visT = when its cover flips off).
    function reveal(c, r) {
      var i = idx(c, r), cell = cells[i];
      if (cell.open || cell.flag || dead || cleared) return;
      if (!placed) { if (!gen) startGenerator(i); return; }
      if (cell.mine) { explode(i); return; }
      // Breadth-first flood so every cell knows its distance from the click.
      var queue = [i], dist = {}, head = 0, gained = 0;
      dist[i] = 0;
      while (head < queue.length) {
        var j = queue[head++], cj = cells[j];
        if (cj.open || cj.flag || cj.mine) continue;
        cj.open = true; opened++; gained++;
        cj.visT = t + Math.min(ANIM.rippleMax, dist[j] * ANIM.ripple);
        if (cj.n === 0) {
          for (var k = 0; k < nb[j].length; k++) {
            var q = nb[j][k];
            if (dist[q] === undefined) { dist[q] = dist[j] + 1; queue.push(q); }
          }
        }
      }
      if (!CLASSIC_MODE) api.addScore(gained * 2);
      revealSound(gained, cell.n);
      syncMusic();
      if (opened === safeCount()) boardClear();
    }

    // Chord: on a number whose flags are all placed, open the other neighbours.
    function chord(c, r) {
      var i = idx(c, r), cell = cells[i];
      if (!cell.open || !cell.n) return;
      var f = 0, k;
      for (k = 0; k < nb[i].length; k++) if (cells[nb[i][k]].flag) f++;
      if (f !== cell.n) { chordFlash = { i: i, t: t }; return; }   // not satisfied: show the neighbours
      for (k = 0; k < nb[i].length; k++) {
        var q = nb[i][k];
        if (!dead && !cleared) reveal(colOf(q), rowOf(q));
      }
    }

    function toggleFlag(c, r) {
      var i = idx(c, r), cell = cells[i];
      if (cell.open || dead || cleared) return;
      cell.flag = !cell.flag;
      flags += cell.flag ? 1 : -1;
      if (cell.flag) cell.flagT = t;
      else pops.push({ i: i, t: t });
      if (M()) M().note('bell', cell.flag ? 0 : -3, { octave: -1, quantize: '16', gain: 0.45 });
      else api.audio.tone(cell.flag ? 880 : 440, 0.04, { type: 'square', vol: 0.08 });
    }

    function act(c, r, flag) {
      cursor = { c: c, r: r };
      var cell = cells[idx(c, r)];
      if (cell.open) chord(c, r);
      else if (flag) toggleFlag(c, r);
      else reveal(c, r);
    }

    function explode(i) {
      dead = true; running = false; deadT = 0; boom = i;
      cells[i].open = true; cells[i].visT = t;
      flashA = 1; flashCol = '#ffffff';
      var x = cellX(i) + cs / 2, y = cellY(i) + cs / 2;
      api.fx.burst(x, y, '#ffffff', 24, 320, 0.5);
      api.fx.burst(x, y, '#ff4d6d', 50, 260, 1);
      api.fx.burst(x, y, '#ffd23f', 30, 180, 0.8);
      api.shake(16);
      api.audio.noise(0.7, { vol: 0.35, cutoff: 800 });
      var m = M();
      if (m && m.tapeStop) m.tapeStop(0.9);
      // Queue the other unflagged mines, nearest first, for the one-by-one reveal.
      var bc = colOf(i), br = rowOf(i), list = [];
      for (var j = 0; j < cells.length; j++) {
        if (j === i || !cells[j].mine || cells[j].flag) continue;
        list.push({ i: j, d: Math.max(Math.abs(colOf(j) - bc), Math.abs(rowOf(j) - br)) + Math.random() * 0.5 });
      }
      list.sort(function (a, b) { return a.d - b.d; });
      var gap = list.length ? Math.min(ANIM.mineGap, ANIM.mineSpan / list.length) : 0;
      for (var k = 0; k < list.length; k++) cells[list[k].i].shownT = t + ANIM.boomHold + k * gap;
      mineQueue = list; mineShown = 0;
      gameOverAt = ANIM.boomHold + list.length * gap + ANIM.deadHold;
    }

    function boardClear() {
      cleared = true; running = false; clearT = 0;
      var m = M();
      if (CLASSIC_MODE) {
        api.setScore(Math.round(time * 100));
        clearInfo = { a: 'CLEARED!', b: time.toFixed(2) + 's' };
      } else {
        var bonus = clearBonus(level, time);
        api.addScore(bonus);
        clearInfo = { a: 'BOARD ' + level + ' CLEAR', b: time.toFixed(1) + 's' + DOT + '+' + bonus };
      }
      if (m) {
        m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 4, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
        m.setKey(59 + [0, 3, 5, -4, -2][level % 5]);
      } else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
      // Win sweep: flags plant themselves on every mine as the light passes.
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.mine && !cell.flag) { cell.flag = true; flags++; cell.flagT = t + (colOf(i) + rowOf(i)) / ANIM.sweep; }
      }
      flashA = 0.3; flashCol = theme.accent;
      api.shake(4);
    }

    /* ---------------- per-frame phases ---------------- */
    function updateDead(dt) {
      deadT += dt;
      // mines pop in one by one (visual; the queue was fixed at the blast)
      while (mineShown < mineQueue.length && t >= cells[mineQueue[mineShown].i].shownT) {
        var j = mineQueue[mineShown].i;
        api.fx.burst(cellX(j) + cs / 2, cellY(j) + cs / 2, theme.hit, 8, 90, 0.4);
        api.audio.tone(140 + Math.random() * 60, 0.05, { type: 'square', vol: 0.05, slide: 0.5 });
        mineShown++;
      }
      if (deadT >= gameOverAt && !overSent) { overSent = true; api.gameOver(); }
    }

    function updateCleared(dt) {
      clearT += dt;
      // celebration fireworks over the board (Math.random: visuals only)
      if (clearT < 1.6 && Math.random() < dt * 9) {
        var fx = ox + Math.random() * cs * cols, fy = oy + Math.random() * cs * rows;
        var cols4 = [theme.accent, theme.flag, theme.num[1], theme.num[2], theme.num[3]];
        api.fx.burst(fx, fy, cols4[Math.floor(Math.random() * cols4.length)], 20, 200, 0.8);
      }
      if (CLASSIC_MODE) {
        if (clearT > ANIM.finishHold && !finished) { finished = true; api.finish(); }
      } else if (clearT > ANIM.clearHold) {
        newBoard();
        syncMusic();
      }
    }

    function cellAt(x, y) {
      var c = Math.floor((x - ox) / cs), r = Math.floor((y - oy) / cs);
      return c >= 0 && c < cols && r >= 0 && r < rows ? { c: c, r: r } : null;
    }
    function inBtn(x, y) { return x >= BTN.x && x <= BTN.x + BTN.w && y >= BTN.y && y <= BTN.y + BTN.h; }

    // Pointer: tap = reveal / chord (or flag in flag mode), long-press = flag.
    function handlePointer() {
      var inp = api.input, p = api.pointer();
      if (inp.hit('hold')) press = { x: p.x, y: p.y, t: t, done: false };
      if (press && !press.done && p.down && t - press.t > 0.38) {
        var lc = cellAt(press.x, press.y);
        if (lc && !cells[idx(lc.c, lc.r)].open) { cursor = lc; toggleFlag(lc.c, lc.r); api.shake(1.5); }
        press.done = true;
      }
      if (inp.hit('release') && press) {
        if (!press.done) {
          if (inBtn(press.x, press.y)) { flagMode = !flagMode; api.audio.tone(700, 0.05, { type: 'triangle', vol: 0.1 }); }
          else { var pc = cellAt(press.x, press.y); if (pc) act(pc.c, pc.r, flagMode); }
        }
        press = null;
      }
    }
    // Keyboard: arrows move, Space reveals / chords, F (or C / Shift) flags.
    function handleKeys() {
      var inp = api.input;
      if (inp.hit('left')) cursor.c = Math.max(0, cursor.c - 1);
      if (inp.hit('right')) cursor.c = Math.min(cols - 1, cursor.c + 1);
      if (inp.hit('up')) cursor.r = Math.max(0, cursor.r - 1);
      if (inp.hit('down')) cursor.r = Math.min(rows - 1, cursor.r + 1);
      if (inp.hit('a')) act(cursor.c, cursor.r, false);
      if (inp.hit('f') || inp.hit('d')) act(cursor.c, cursor.r, true);
    }

    function statusText() {
      var head = CLASSIC_MODE ? 'CLASSIC' : 'BOARD ' + level;
      var secs = CLASSIC_MODE ? time.toFixed(2) : time.toFixed(1);
      return head + DOT + cols + X + rows + DOT + 'MINES ' + (spec.mines - flags) + DOT + secs + 's' + (noGuess ? DOT + 'NO GUESS \u2713' : '');
    }

    /* ---------------- rendering ---------------- */
    function drawHud(ctx) {
      var th = theme;
      var grad = ctx.createLinearGradient(0, 0, 0, TOP);
      grad.addColorStop(0, 'rgba(255,255,255,0.06)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, TOP);
      // timer (the Classic Grey theme gets red LED digits)
      var secs = CLASSIC_MODE ? time.toFixed(2) : time.toFixed(1);
      U.glowText(ctx, secs + 's', 16, 26, 16, th.timer, 'left');
      ctx.save();
      ctx.font = '800 10px ' + MONO; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = th.hud; ctx.globalAlpha = 0.7;
      ctx.fillText(CLASSIC_MODE ? 'CLASSIC ' + cols + X + rows : 'BOARD ' + level + DOT + cols + X + rows, 16, 50);
      ctx.restore();
      // mines left
      var mx = W / 2 - 14;
      ctx.save();
      if (!spr) spr = sprites(theme, cs);
      ctx.drawImage(spr.hudMine, mx - 30, 13, 22, 22);
      ctx.font = '900 18px ' + MONO; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = th.hud;
      ctx.fillText(String(spec.mines - flags), mx - 2, 25);
      ctx.restore();
      // NO GUESS badge: a promise before the first click, a verified tick after
      if (!placed || noGuess) {
        ctx.save();
        var bw = 86, bx = W / 2 - bw / 2 - 10, by = 40;
        rr(ctx, bx, by, bw, 16, 8);
        ctx.fillStyle = 'rgba(57,255,136,0.12)'; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(57,255,136,0.7)'; ctx.stroke();
        ctx.fillStyle = '#7dffb2'; ctx.font = '800 9px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText((placed ? '\u2713 ' : '') + 'NO GUESS', bx + bw / 2, by + 8.5);
        ctx.restore();
      }
      // flag-mode toggle
      ctx.save();
      ctx.fillStyle = flagMode ? 'rgba(255,210,63,0.2)' : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = flagMode ? '#ffd23f' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
      rr(ctx, BTN.x, BTN.y, BTN.w, BTN.h, 8); ctx.fill(); ctx.stroke();
      ctx.drawImage(spr.flag, BTN.x + 6, BTN.y + 5, 24, 24);
      ctx.fillStyle = flagMode ? '#ffd23f' : 'rgba(255,255,255,0.75)';
      ctx.font = '800 12px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(flagMode ? 'FLAG ON' : 'FLAG OFF', BTN.x + BTN.w / 2 + 12, BTN.y + BTN.h / 2 + 1);
      ctx.restore();
    }

    // Flag with plant animation: drops in, bounces, then waves and settles.
    function drawFlag(ctx, x, y, age) {
      if (age >= ANIM.flagDrop + ANIM.flagWave) { ctx.drawImage(spr.flag, x, y, cs, cs); return; }
      var dropK = Math.min(1, age / ANIM.flagDrop);
      var fall = (1 - dropK) * (1 - dropK) * cs * 0.9;
      var waveK = Math.max(0, age - ANIM.flagDrop) / ANIM.flagWave;
      var angle = dropK < 1 ? 0 : Math.sin(waveK * 18) * 0.35 * (1 - waveK);
      var squash = dropK < 1 ? 1 : 1 - Math.sin(Math.min(1, waveK * 6) * Math.PI) * 0.12;
      var px = x + cs * 0.48, py = y + cs * 0.8;
      ctx.save();
      ctx.globalAlpha = 0.4 + dropK * 0.6;
      ctx.translate(px, py - fall);
      ctx.rotate(angle);
      ctx.scale(1 / squash, squash);
      ctx.drawImage(spr.flag, -cs * 0.48, -cs * 0.8, cs, cs);
      ctx.restore();
    }

    function drawCell(ctx, i) {
      var cell = cells[i], c = colOf(i), r = rowOf(i);
      var x = ox + c * cs, y = oy + r * cs, alt = (c + r) & 1;
      // new board: tiles pop in along the diagonals
      var introK = (t - introT0 - (c + r) * ANIM.intro) / ANIM.introPop;
      if (introK < 1) { blitScaled(ctx, spr.hidden[alt], x, y, cs, Math.max(0, introK)); return; }

      var showMine = dead && cell.mine && !cell.flag && cell.shownT >= 0 && t >= cell.shownT;
      var isOpen = (cell.open && t >= cell.visT) || showMine;
      if (isOpen) {
        ctx.drawImage(spr.open[alt], x, y, cs, cs);
        if (cell.mine) {
          if (i === boom) { ctx.fillStyle = theme.hit; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2); }
          var mAge = t - (i === boom ? cell.visT : cell.shownT);
          blitScaled(ctx, spr.mine, x, y, cs, Math.min(1.25, mAge / 0.08) - Math.max(0, Math.min(0.25, (mAge - 0.08) * 2)));
        } else if (cell.n) ctx.drawImage(spr.num[cell.n], x, y, cs, cs);
        // cascade: the cover flips off (shrinks + fades) as the ripple arrives
        var age = t - cell.visT;
        if (cell.open && age < ANIM.flip) {
          var k = age / ANIM.flip;
          ctx.save(); ctx.globalAlpha = 1 - k;
          blitScaled(ctx, spr.hidden[alt], x, y, cs, 1 - k * 0.6);
          ctx.restore();
        }
      } else {
        ctx.drawImage(spr.hidden[alt], x, y, cs, cs);
        if (cell.flag && t >= cell.flagT) drawFlag(ctx, x, y, t - cell.flagT);
        // after a loss, flags that were wrong get crossed out
        if (dead && cell.flag && !cell.mine && mineShown >= mineQueue.length) ctx.drawImage(spr.cross, x, y, cs, cs);
      }
    }

    function drawBoard(ctx) {
      var bw = cs * cols, bh = cs * rows;
      ctx.save();
      rr(ctx, ox - 5, oy - 5, bw + 10, bh + 10, 8);
      ctx.fillStyle = theme.frame; ctx.fill();
      ctx.restore();
      for (var i = 0; i < cells.length; i++) drawCell(ctx, i);

      // unflag pops: the flag jumps up, grows and fades
      for (var p = pops.length - 1; p >= 0; p--) {
        var pk = (t - pops[p].t) / ANIM.unflag;
        if (pk >= 1) { pops.splice(p, 1); continue; }
        ctx.save(); ctx.globalAlpha = 1 - pk;
        var px = cellX(pops[p].i), py = cellY(pops[p].i) - pk * cs * 0.5;
        blitScaled(ctx, spr.flag, px, py, cs, 1 + pk * 0.6);
        ctx.restore();
      }
      // failed chord: flash the unknown neighbours of that number
      if (chordFlash && t - chordFlash.t < 0.25) {
        ctx.save(); ctx.fillStyle = 'rgba(255,255,255,' + (0.3 * (1 - (t - chordFlash.t) / 0.25)).toFixed(3) + ')';
        var list = nb[chordFlash.i];
        for (var q = 0; q < list.length; q++) {
          var nc = cells[list[q]];
          if (!nc.open && !nc.flag) ctx.fillRect(cellX(list[q]) + 2, cellY(list[q]) + 2, cs - 4, cs - 4);
        }
        ctx.restore();
      }
      // win sweep: a diagonal band of light rolls across the board
      if (cleared) {
        var band = clearT * ANIM.sweep;
        if (band < cols + rows + 4) {
          ctx.save();
          for (var j = 0; j < cells.length; j++) {
            var dd = band - (colOf(j) + rowOf(j));
            if (dd < 0 || dd > 4) continue;
            ctx.fillStyle = 'rgba(' + theme.sweep + ',' + (0.5 * (1 - dd / 4)).toFixed(3) + ')';
            ctx.fillRect(cellX(j), cellY(j), cs, cs);
          }
          ctx.restore();
        }
      }
      // keyboard cursor
      if (!dead) {
        ctx.save();
        ctx.strokeStyle = theme.cursor; ctx.lineWidth = 2; ctx.globalAlpha = 0.65 + 0.3 * Math.sin(t * 6);
        ctx.strokeRect(ox + cursor.c * cs + 1.5, oy + cursor.r * cs + 1.5, cs - 3, cs - 3);
        ctx.restore();
      }
    }

    function drawOverlays(ctx) {
      var cx = W / 2, cy = oy + cs * rows / 2;
      // long-press progress ring
      if (press && !press.done && api.pointer().down) {
        var k = Math.min(1, (t - press.t) / 0.38);
        if (k > 0.2) {
          ctx.save(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(press.x, press.y, 18, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.stroke();
          ctx.restore();
        }
      }
      // board banner (fades out as play starts)
      if (banner) {
        var ba = 1.6 - (t - banner.t);
        if (ba <= 0 || placed) banner = null;
        else panel(ctx, cx, cy, banner.a, banner.b, Math.min(1, ba), theme.accent);
      }
      // generator still working (rare): show that we're shuffling
      if (gen && t - genT > 0.03) panel(ctx, cx, cy, 'SHUFFLING' + '...'.slice(0, 1 + Math.floor(t * 6) % 3), 'building a no-guess board', 1, theme.accent);
      // board-clear celebration
      if (cleared && clearInfo && clearT > 0.35) panel(ctx, cx, cy, clearInfo.a, clearInfo.b, Math.min(1, (clearT - 0.35) * 4), theme.accent);
      // flash (explosion white-out / clear glow)
      if (flashA > 0.01) {
        ctx.save(); ctx.globalAlpha = flashA * 0.8; ctx.fillStyle = flashCol; ctx.fillRect(0, 0, W, H); ctx.restore();
      }
      // footer hint before the first click
      if (!placed && !gen) {
        ctx.save();
        ctx.fillStyle = 'rgba(220,255,235,0.75)'; ctx.font = '700 11px ' + MONO; ctx.textAlign = 'center';
        ctx.fillText('FIRST TAP IS ALWAYS SAFE' + DOT + 'HOLD TO FLAG' + DOT + 'TAP A NUMBER TO CHORD', W / 2, H - 14);
        ctx.restore();
      }
    }

    function panel(ctx, cx, cy, a, b, alpha, col) {
      ctx.save();
      ctx.globalAlpha = alpha;
      rr(ctx, cx - 150, cy - 40, 300, 80, 14);
      ctx.fillStyle = 'rgba(4,6,14,0.82)'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.globalAlpha = alpha;
      U.glowText(ctx, a, cx, cy - 12, 17, col);
      ctx.font = '800 12px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#e8f0ff'; ctx.fillText(b, cx, cy + 17);
      ctx.restore();
    }

    newBoard();

    /* ---------------- the cartridge interface ---------------- */
    return {
      // Read-only test hook. Mine positions and unrevealed contents are
      // deliberately NOT exposed -- only counts and public state.
      debug: function () {
        return {
          mode: CLASSIC_MODE ? 'classic' : 'sprint', variant: api.variant || null,
          level: level, cols: cols, rows: rows, mines: spec.mines, theme: theme.name,
          placed: placed, generating: !!gen, opened: opened, flags: flags,
          cursor: { c: cursor.c, r: cursor.r }, flagMode: flagMode,
          noGuess: noGuess, gen: genInfo, dead: dead, cleared: cleared,
          time: Math.round(time * 100) / 100
        };
      },

      update: function (dt) {
        t += dt;
        flashA = Math.max(0, flashA - dt * 2.5);
        api.input.takeSwipes();
        if (dead) { updateDead(dt); return; }
        if (cleared) { updateCleared(dt); return; }
        if (gen) stepGenerator();
        noteBudget = 4;
        if (running) {
          time += dt;
          if (CLASSIC_MODE) api.setScore(Math.round(time * 100));
        }
        handlePointer();
        handleKeys();
        api.setStatus(statusText());
      },

      render: function (ctx) {
        if (!spr) spr = sprites(theme, cs);
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, W, H);
        drawHud(ctx);
        drawBoard(ctx);
        drawOverlays(ctx);
      }
    };
  }

  /* ================================================================
   * 7. ATTRACT LOOP
   * A fixed 8x8 demo board (not a real game) cycles through the themes:
   * tiles pop in, a cascade ripples out from the centre, flags plant on the
   * mines, and a win sweep rolls across before the next theme.
   * ================================================================ */
  var DEMO = (function () {
    var n = 8, mines = [2, 13, 22, 31, 40, 47, 49, 58, 61], b = emptyBoard({ cols: n, rows: n, mines: mines.length });
    for (var k = 0; k < mines.length; k++) b.mine[mines[k]] = 1;
    computeNumbers(b);
    return b;
  })();
  var DEMO_LOOP = 6.5;

  function attract(ctx, w, h, t) {
    var loop = Math.floor(t / DEMO_LOOP), lt = t - loop * DEMO_LOOP;
    var th = THEMES[loop % THEMES.length];
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, w, h);
    var n = DEMO.cols, cs = Math.max(4, Math.floor(Math.min(w, h) * 0.86 / n));
    var ox = Math.floor((w - cs * n) / 2), oy = Math.floor((h - cs * n) / 2);
    var sp = sprites(th, cs);
    rr(ctx, ox - 3, oy - 3, cs * n + 6, cs * n + 6, 5); ctx.fillStyle = th.frame; ctx.fill();
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var i = r * n + c, x = ox + c * cs, y = oy + r * cs, alt = (c + r) & 1;
      var intro = (lt - (c + r) * 0.03) / 0.2;
      if (intro < 1) { blitScaled(ctx, sp.hidden[alt], x, y, cs, Math.max(0, intro)); continue; }
      var d = Math.max(Math.abs(c - 3.5), Math.abs(r - 3.5));
      var openAt = 0.9 + d * 0.22 + ((i * 7) % 5) * 0.03;
      if (!DEMO.mine[i] && lt >= openAt) {
        ctx.drawImage(sp.open[alt], x, y, cs, cs);
        if (DEMO.num[i]) ctx.drawImage(sp.num[DEMO.num[i]], x, y, cs, cs);
        var k = (lt - openAt) / ANIM.flip;
        if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; blitScaled(ctx, sp.hidden[alt], x, y, cs, 1 - k * 0.6); ctx.restore(); }
      } else {
        ctx.drawImage(sp.hidden[alt], x, y, cs, cs);
        var flagAt = 2.3 + d * 0.25;
        if (DEMO.mine[i] && lt >= flagAt) {
          var fk = Math.min(1, (lt - flagAt) / 0.2);
          ctx.save(); ctx.globalAlpha = 0.4 + 0.6 * fk;
          ctx.drawImage(sp.flag, x, y - (1 - fk) * (1 - fk) * cs * 0.8, cs, cs);
          ctx.restore();
        }
      }
      var band = (lt - 4.4) * 9 - (c + r);
      if (band > 0 && band < 3) { ctx.fillStyle = 'rgba(' + th.sweep + ',' + (0.45 * (1 - band / 3)).toFixed(3) + ')'; ctx.fillRect(x, y, cs, cs); }
    }
    ctx.save();
    ctx.fillStyle = th.accent; ctx.font = '800 ' + Math.max(8, Math.round(h / 20)) + 'px ' + MONO;
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText('NO GUESS', w - 6, 6);
    ctx.restore();
  }

  /* ================================================================
   * 8. REGISTRATION
   * ================================================================ */
  XA.registerGame({
    id: 'xa_mine_sprint',
    order: 20,
    title: 'Mine Sprint',
    tagline: 'Sweep fast. Never guess.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP TO REVEAL \u00b7 HOLD (OR FLAG MODE) TO FLAG \u00b7 TAP A NUMBER TO CHORD',
    controls: 'Click reveal \u00b7 hold to flag \u00b7 click a number to chord \u00b7 or arrows + Space, F to flag',
    modeLabel: 'Sprint',
    variants: [{ key: 'classic', label: 'Classic', mode: 'time', tagline: 'One no-guess board. Fastest clear wins.' }],
    create: create,
    attract: attract,
    // Pure board logic (no live game state) for the solver test harness.
    logic: { LEVELS: LEVELS, CLASSIC: CLASSIC, THEMES: THEMES, levelSpec: levelSpec,
      emptyBoard: emptyBoard, scatterMines: scatterMines, safeZone: safeZone,
      solve: solve, createGenerator: createGenerator }
  });
})(window);

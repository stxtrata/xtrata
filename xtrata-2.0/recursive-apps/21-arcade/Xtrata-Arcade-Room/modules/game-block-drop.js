/*
 * Xtrata Arcade cartridge #2 - BLOCK DROP (v2)
 * Falling-block line clearer: 7-bag randomiser, SRS rotation + wall kicks,
 * hold, ghost piece, lock delay, combos, back-to-back, T-spins (3-corner
 * rule, mini vs full), perfect clears and a visual theme per level.
 *
 * Contract game-id: xa_block_drop
 *   Marathon  (score mode, higher is better)
 *   Sprint 40 (variant 'sprint', time mode: clear 40 lines, lowest time wins)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-drop');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 440, H = 580;
  var COLS = 10, ROWS = 22, HIDDEN = 2, CELL = 27;
  var BX = 16, BY = 20;                 // board origin (visible rows)
  var BW = COLS * CELL, BH = (ROWS - HIDDEN) * CELL;
  var PX = BX + BW + 16;                // side panel x
  var PW = W - PX - 12;
  var ACCENT = '#3ff0ff';
  var SPRINT_LINES = 40;
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';

  var SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
  };
  var TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  // SRS kicks in (x, y-up). Converted to screen coords (y-down) when applied.
  var KICKS = {
    '0>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '1>0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '1>2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '2>1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '2>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    '3>2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '3>0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '0>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
  };
  var KICKS_I = {
    '0>1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '1>0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '1>2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    '2>1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '2>3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '3>2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '3>0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '0>3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
  };
  // T-spin corners relative to the T centre, and which two are "front"
  // (the side the T points at) for each rotation state.
  var TCORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];   // TL TR BR BL
  var TFRONT = [[0, 1], [1, 2], [2, 3], [3, 0]];

  function rotateCW(m) {
    var n = m.length, out = [];
    for (var y = 0; y < n; y++) { out.push([]); for (var x = 0; x < n; x++) out[y][x] = m[n - 1 - x][y]; }
    return out;
  }
  var ROT = {};
  TYPES.forEach(function (t) {
    var r = [SHAPES[t]];
    for (var i = 1; i < 4; i++) r.push(rotateCW(r[i - 1]));
    ROT[t] = r;
  });

  function gravity(level) {
    return Math.max(0.012, Math.pow(0.8 - (level - 1) * 0.007, level - 1));
  }
  function fmtTime(cs) {
    cs = Math.max(0, Math.round(cs));
    var m = Math.floor(cs / 6000), s = Math.floor(cs / 100) % 60, c = cs % 100;
    return m + ':' + (s < 10 ? '0' : '') + s + '.' + (c < 10 ? '0' : '') + c;
  }

  /* ------------------------------------------------------------ themes */
  // Marathon cycles the first five by level; Sprint has its own.
  function theme(name, bg0, bg1, board, grid, gridStyle, accent, acc2, glow, pat, p) {
    return { name: name, bg0: bg0, bg1: bg1, board: board, grid: grid, gridStyle: gridStyle, accent: accent, acc2: acc2,
      glow: glow, pat: pat, pieces: { I: p[0], O: p[1], T: p[2], S: p[3], Z: p[4], J: p[5], L: p[6] } };
  }
  var THEMES = [
    theme('NEON', '#05060f', '#0d1238', 'rgba(10,13,30,0.86)', 'rgba(63,240,255,0.07)', 'lines', '#3ff0ff', '#ffd23f', 8, 'neon',
      ['#3ff0ff', '#ffd23f', '#b04dff', '#39ff88', '#ff4d6d', '#4d7bff', '#ff9a3f']),
    theme('SUNSET', '#1b0626', '#56142e', 'rgba(30,8,28,0.82)', 'rgba(255,154,63,0.16)', 'dots', '#ff9a3f', '#ff4f8b', 7, 'sunset',
      ['#ffe066', '#fff5d6', '#ff3864', '#ff9147', '#c2189e', '#7b5cff', '#ffb3c6']),
    theme('OCEAN', '#01121f', '#03405a', 'rgba(2,20,36,0.84)', 'rgba(77,227,255,0.08)', 'lines', '#4de3ff', '#7dffcf', 8, 'ocean',
      ['#4de3ff', '#e8fbff', '#8f7dff', '#3dffb5', '#ff6f61', '#2e6bff', '#ffc26b']),
    theme('FOREST', '#030d07', '#11301a', 'rgba(6,20,11,0.85)', 'rgba(140,255,107,0.05)', 'checker', '#8cff6b', '#ffcf5a', 6, 'forest',
      ['#8cff6b', '#ffe27a', '#c38bff', '#2fc463', '#ff7b54', '#4fc3b9', '#d9a45b']),
    theme('GOLD', '#0b0803', '#2a1e09', 'rgba(14,11,5,0.86)', 'rgba(255,210,63,0.14)', 'dots', '#ffd23f', '#fff4cc', 10, 'gold',
      ['#fff4cc', '#ffd23f', '#f2a93b', '#e6c35c', '#c7823a', '#fffbe8', '#b8963e'])
  ];
  var SPRINT_THEME = theme('VELOCITY', '#040406', '#15121f', 'rgba(8,8,14,0.9)', 'rgba(255,255,255,0.05)', 'lines', '#ff3fa4', '#3ff0ff', 9, 'speed',
    ['#5ef1ff', '#fff27a', '#ff5cf0', '#6bff9e', '#ff5c7a', '#7a8cff', '#ffb35c']);
  var ALL_THEMES = THEMES.concat([SPRINT_THEME]);
  function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  ALL_THEMES.forEach(function (th) {
    th.rgb = { accent: hexRgb(th.accent), acc2: hexRgb(th.acc2) };
    TYPES.forEach(function (k) { th.rgb[k] = hexRgb(th.pieces[k]); });
  });
  function mixRgb(a, b, k) {
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * k) + ',' + Math.round(a[1] + (b[1] - a[1]) * k) + ',' + Math.round(a[2] + (b[2] - a[2]) * k) + ')';
  }

  // Background patterns: a handful of cheap primitives each, drawn under the board.
  var PATTERNS = {
    neon: function (ctx, th, t, w, h) {
      var hz = h * 0.58;
      ctx.strokeStyle = th.accent; ctx.lineWidth = 1;
      ctx.globalAlpha *= 0.16;
      ctx.beginPath();
      for (var i = 0; i < 10; i++) {
        var p = ((i + t * 0.6) % 10) / 10, y = hz + p * p * (h - hz);
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      for (var k = -7; k <= 7; k++) { ctx.moveTo(w / 2 + k * 18, hz); ctx.lineTo(w / 2 + k * 110, h); }
      ctx.stroke();
    },
    sunset: function (ctx, th, t, w, h) {
      var cx = w * 0.36, cy = h * 0.7, r = w * 0.24;
      ctx.globalAlpha *= 0.5;
      ctx.fillStyle = th.accent;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = th.bg1;
      for (var i = 0; i < 6; i++) {
        var y = cy + r * (0.05 + i * 0.17) + ((t * 6) % (r * 0.17));
        ctx.fillRect(cx - r - 2, y, r * 2 + 4, 2 + i * 1.3);
      }
      ctx.fillStyle = th.acc2; ctx.globalAlpha *= 0.3;
      ctx.beginPath(); ctx.moveTo(0, h);
      for (var x = 0; x <= w; x += w / 8) ctx.lineTo(x, h - h * 0.07 - Math.sin(x * 0.02 + 1) * h * 0.03);
      ctx.lineTo(w, h); ctx.fill();
    },
    ocean: function (ctx, th, t, w, h) {
      ctx.strokeStyle = th.accent; ctx.lineWidth = 1;
      ctx.globalAlpha *= 0.28;
      ctx.beginPath();
      for (var i = 0; i < 18; i++) {
        var r = 2 + (i % 4) * 1.5;
        var y = h + 20 - ((t * 18 * (1 + i % 3) + i * 61) % (h + 40));
        var x = (i * 97) % w + Math.sin(t * 1.5 + i) * 6;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      for (var j = 0; j < 3; j++) {
        var by = h * (0.25 + j * 0.28);
        ctx.moveTo(0, by);
        for (var xx = 0; xx <= w; xx += w / 20) ctx.lineTo(xx, by + Math.sin(xx * 0.03 + t * (1 + j * 0.3) + j) * 6);
      }
      ctx.stroke();
    },
    forest: function (ctx, th, t, w, h) {
      ctx.globalAlpha *= 0.55;
      ctx.fillStyle = '#021006';
      ctx.beginPath();
      for (var i = 0; i < 9; i++) {
        var x = i * w / 8 - 10, th2 = h * (0.2 + (i * 37 % 5) * 0.04);
        ctx.moveTo(x - w / 14, h); ctx.lineTo(x, h - th2); ctx.lineTo(x + w / 14, h);
      }
      ctx.fill();
      ctx.fillStyle = th.acc2; ctx.globalAlpha *= 0.6;
      for (var k = 0; k < 16; k++) {
        var lx = ((k * 131) % w) + Math.sin(t * 0.9 + k) * 18;
        var ly = (t * (14 + k % 4 * 6) + k * 71) % h;
        var s = 2 + k % 3;
        ctx.fillRect(lx, ly, s, s);
      }
    },
    gold: function (ctx, th, t, w, h) {
      ctx.strokeStyle = th.accent; ctx.lineWidth = 1;
      var ga = ctx.globalAlpha;
      ctx.globalAlpha = ga * 0.1;
      ctx.beginPath();
      var off = (t * 8) % 32;
      for (var x = -h; x < w; x += 32) { ctx.moveTo(x + off, 0); ctx.lineTo(x + off + h, h); }
      ctx.stroke();
      ctx.fillStyle = th.acc2;
      for (var i = 0; i < 12; i++) {
        var a = 0.5 + 0.5 * Math.sin(t * 2.3 + i * 1.7);
        var sx = (i * 173) % w, sy = (i * 89) % h, s = 1 + a * 3;
        ctx.globalAlpha = ga * a * 0.5;
        ctx.fillRect(sx - s, sy - 0.5, s * 2, 1); ctx.fillRect(sx - 0.5, sy - s, 1, s * 2);
      }
    },
    speed: function (ctx, th, t, w, h) {
      ctx.globalAlpha *= 0.35;
      for (var i = 0; i < 22; i++) {
        var sp = 300 * (0.5 + (i % 5) / 4);
        var len = 30 + (i % 4) * 25;
        var x = w + 40 - ((t * sp + i * 173) % (w + 200));
        var y = (i * 53 + 7) % h;
        ctx.fillStyle = i % 3 ? th.accent : th.acc2;
        ctx.fillRect(x, y, len, 1 + (i % 2));
      }
    }
  };

  function drawBg(ctx, th, t, w, h, alpha, cache) {
    ctx.save();
    ctx.globalAlpha = alpha;
    var g = cache && cache[th.name];
    if (!g) {
      g = ctx.createLinearGradient(0, 0, w * 0.3, h);
      g.addColorStop(0, th.bg0); g.addColorStop(1, th.bg1);
      if (cache) cache[th.name] = g;
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    PATTERNS[th.pat](ctx, th, t, w, h);
    ctx.restore();
  }
  function drawBoardBg(ctx, th, alpha, bx, by, cols, rows, cell) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = th.board;
    ctx.fillRect(bx, by, cols * cell, rows * cell);
    ctx.fillStyle = ctx.strokeStyle = th.grid;
    var x, y;
    if (th.gridStyle === 'lines') {
      ctx.beginPath();
      for (x = 1; x < cols; x++) { ctx.moveTo(bx + x * cell + 0.5, by); ctx.lineTo(bx + x * cell + 0.5, by + rows * cell); }
      for (y = 1; y < rows; y++) { ctx.moveTo(bx, by + y * cell + 0.5); ctx.lineTo(bx + cols * cell, by + y * cell + 0.5); }
      ctx.stroke();
    } else if (th.gridStyle === 'dots') {
      for (y = 1; y < rows; y++) for (x = 1; x < cols; x++) ctx.fillRect(bx + x * cell - 1, by + y * cell - 1, 2, 2);
    } else {
      for (y = 0; y < rows; y++) for (x = (y & 1); x < cols; x += 2) ctx.fillRect(bx + x * cell, by + y * cell, cell, cell);
    }
    ctx.restore();
  }

  function drawCell(ctx, x, y, size, color, alpha, glow) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow == null ? 8 : glow;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(x + 1, y + 1, size - 2, Math.max(2, size * 0.18));
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x + 1, y + size - 1 - size * 0.14, size - 2, size * 0.14);
    ctx.restore();
  }

  /* ------------------------------------------------------------- music */
  // Marathon: a minor-key folk dance (harmonic minor, oom-pah bass, fiddle line).
  var FIDDLE = [
    '4 - 2 4 5 - 4 2 1 - 0 1 2 - . .',
    '3 - 2 3 4 - 3 2 0 - _6 0 1 - . .',
    '4 - 2 4 5 - 7 5 4 - 2 1 0 - . .',
    '1 - 2 3 4 - 2 1 0 - - - . . . .'
  ].join(' ');
  function song() {
    return {
      bpm: 118, key: 50, scale: 'harmonic', chords: [0, 3, 4, 0], seed: 23,
      tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.45, chord: true, octave: -2, params: { cutoff: 650 },
          pattern: '0 . . . 4 . . . 0 . . . 4 . 2 .' },
        { name: 'chop', inst: 'pluck', layer: 0, gain: 0.26, chord: true, params: { decay: 0.12, cutoff: 2600 },
          fn: function (i) { return i.stepInBar % 4 === 2 ? [0, 2, 4] : null; } },
        { name: 'kick', inst: 'kick', layer: 0.18, gain: 0.55, pattern: 'x...x...x...x...' },
        { name: 'snare', inst: 'snare', layer: 0.32, gain: 0.35, pattern: '....x.......x..x' },
        { name: 'hat', inst: 'hat', layer: 0.4, maxLayer: 0.72, gain: 0.3, pattern: '..x...x...x...x.' },
        { name: 'fiddle', inst: 'lead', layer: 0.5, gain: 0.28, octave: 1, params: { wave: 'triangle', cutoff: 2200 }, pattern: FIDDLE },
        { name: 'ohat', inst: 'hat', layer: 0.72, gain: 0.32, params: { open: true }, pattern: '..x...x...x...xx' },
        { name: 'tense', inst: 'arp', layer: 0.8, gain: 0.24, chord: true, octave: 1, params: { cutoff: 1800 },
          fn: function (i) { return [0, 2, 4, 2, 0, 4, 7, 4][i.step % 8]; } }
      ]
    };
  }
  // Sprint: the same tune pushed into a driving four-on-the-floor race cut.
  function sprintSong() {
    return {
      bpm: 146, key: 50, scale: 'harmonic', chords: [0, 5, 3, 4], seed: 41,
      tracks: [
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.6, pattern: 'x...x...x...x...' },
        { name: 'pump', inst: 'bass', layer: 0, gain: 0.42, chord: true, octave: -2, params: { cutoff: 900 },
          pattern: '0 . ^0 . 0 . ^0 . 0 . ^0 . 0 . ^0 .' },
        { name: 'hat', inst: 'hat', layer: 0.15, gain: 0.28, pattern: '..x...x...x...x.' },
        { name: 'snare', inst: 'snare', layer: 0.3, gain: 0.34, pattern: '....x.......x...' },
        { name: 'arp', inst: 'arp', layer: 0.42, gain: 0.2, chord: true, octave: 1, params: { cutoff: 2400 },
          fn: function (i) { return [0, 2, 4, 7, 4, 2, 0, 2][i.step % 8]; } },
        { name: 'fiddle', inst: 'lead', layer: 0.6, gain: 0.26, octave: 1, params: { wave: 'sawtooth', cutoff: 2600 }, pattern: FIDDLE },
        { name: 'shaker', inst: 'shaker', layer: 0.72, gain: 0.22, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'final', inst: 'arp', layer: 0.9, gain: 0.2, chord: true, octave: 2, params: { cutoff: 3200 },
          fn: function (i) { return [7, 4, 2, 0][i.step % 4]; } },
        { name: 'roll', inst: 'clap', layer: 0.9, gain: 0.22, pattern: '........x.x.xxxx' }
      ]
    };
  }
  // Line-clear stingers grow with the number of lines.
  var CLEAR_STINGS = [null,
    [{ deg: 4 }, { deg: 7, at: 2, steps: 2 }],
    [{ deg: 2 }, { deg: 4, at: 1 }, { deg: 7, at: 2, steps: 2 }],
    [{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 3 }],
    [{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4 }, { deg: 9, at: 6 }, { deg: 11, at: 8 }, { deg: 14, at: 10, steps: 6 }]
  ];
  // T-spin "twist": down-and-back-up figure; the full version climbs higher.
  var TSPIN_STING = [{ deg: 7 }, { deg: 6, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 9, at: 4 }, { deg: 11, at: 5, steps: 3 }];
  var TSPIN_MINI_STING = [{ deg: 4 }, { deg: 3, at: 1 }, { deg: 6, at: 2, steps: 2 }];
  var PC_STING = [{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 11, at: 3 }, { deg: 14, at: 4 }, { deg: 11, at: 5 }, { deg: 14, at: 6 }, { deg: 18, at: 8, steps: 8 }];

  function create(api) {
    var rng = api.rng;
    var SPRINT = api.mode === 'time';
    var grid = [];
    for (var r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill(null));
    var shift = new Array(ROWS);
    var bag = [];
    var queue = [];
    var cur = null;
    var hold = null, holdUsed = false;
    var level = 1, lines = 0, combo = -1, b2b = false;
    var fallT = 0, lockT = 0, lockResets = 0;
    var dasDir = null, dasT = 0, arrT = 0;
    var lastRot = false, lastKick = 0, lastTspin = '', pcs = 0;
    var clearing = null;       // { rows:[], t, flash, dur, quad }
    var over = false, overT = 0;
    var done = false, doneT = 0, finished = false, fwT = 0;
    var elapsed = 0, splits = [], bestSplits = SPRINT ? U.store('bd_sprint_splits') : null;
    var tempoStage = 0;
    var t = 0;
    // visuals
    var thA = SPRINT ? SPRINT_THEME : THEMES[0], thB = thA, thK = 1;
    var pal = {}, col = { accent: thA.accent, acc2: thA.acc2 };
    TYPES.forEach(function (k) { pal[k] = thA.pieces[k]; });
    var gcache = {};
    var popups = [], waves = [];
    var flashA = 0, banner = null;
    var lockCells = [[0, 0], [0, 0], [0, 0], [0, 0]], lockN = 0, lockFlash = 0;
    var trail = { cols: [], top: 0, bot: 0, color: '#fff', t: 0 };
    if (!(bestSplits instanceof Array) || bestSplits.length !== 4) bestSplits = null;

    function pts(n) { if (!SPRINT) api.addScore(n); }
    function popup(str, color, size, y, life) {
      if (popups.length > 3) popups.shift();
      popups.push({ str: str, color: color, size: size, y: y, age: 0, life: life || 1.3 });
    }
    function wave(x, y, color, max) { if (waves.length < 6) waves.push({ x: x, y: y, r: 6, max: max || 220, color: color, age: 0 }); }

    // --- music hooks (never touch gameplay RNG) ---
    function stackRows() {
      for (var y = HIDDEN; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (grid[y][x]) return ROWS - y;
      return 0;
    }
    function syncMusic() {
      var m = M();
      if (!m) return;
      var h = stackRows(), v;
      if (SPRINT) {
        v = 0.2 + Math.min(lines, SPRINT_LINES) / SPRINT_LINES * 0.6 + Math.max(0, h - 6) / 14 * 0.2;
        if (lines >= SPRINT_LINES - 10) v = Math.max(v, 0.94);
      } else v = 0.05 + Math.max(0, h - 2) / 13 * 0.8 + (level - 1) * 0.06;
      m.setIntensity(Math.round(U.clamp(v, 0, 1) * 20) / 20);
    }
    function levelMusic() {
      var m = M();
      if (!m) return;
      m.setTempo(Math.min(162, 118 + (level - 1) * 4), 2);
      m.setKey(45 + ((level - 1) * 5 + 5) % 12);
      m.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 9, at: 6, steps: 6 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.5 });
    }
    function sprintMusic() {
      var m = M();
      var stage = lines >= SPRINT_LINES - 5 ? 2 : lines >= SPRINT_LINES - 10 ? 1 : 0;
      if (stage === tempoStage) return;
      tempoStage = stage;
      popup(stage === 1 ? 'FINAL 10!' : 'LAST 5!', col.accent, stage === 1 ? 17 : 15, BY + BH * 0.42 + 112, 1.6);
      if (!m) return;
      m.setTempo(stage === 1 ? 156 : 164, 3);
      m.note('riser', 0, { dur: stage === 1 ? 2.2 : 1.6, gain: 0.5 });
    }

    function nextType() {
      if (!bag.length) {
        bag = TYPES.slice();
        for (var i = bag.length - 1; i > 0; i--) { var j = rng.int(i + 1); var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp; }
      }
      return bag.pop();
    }
    while (queue.length < 4) queue.push(nextType());

    function cells(p, rot, ox, oy) {
      var m = ROT[p.type][rot == null ? p.rot : rot];
      var out = [];
      for (var y = 0; y < m.length; y++) for (var x = 0; x < m.length; x++) {
        if (m[y][x]) out.push([x + (ox == null ? p.x : ox), y + (oy == null ? p.y : oy)]);
      }
      return out;
    }
    function fits(p, rot, ox, oy) {
      var cs = cells(p, rot, ox, oy);
      for (var i = 0; i < cs.length; i++) {
        var x = cs[i][0], y = cs[i][1];
        if (x < 0 || x >= COLS || y >= ROWS) return false;
        if (y >= 0 && grid[y][x]) return false;
      }
      return true;
    }
    function spawn(type) {
      var size = ROT[type][0].length;
      cur = { type: type, rot: 0, x: Math.floor((COLS - size) / 2), y: 0 };
      fallT = 0; lockT = 0; lockResets = 0; lastRot = false;
      syncMusic();
      if (!fits(cur)) { topOut(); return; }
      // Drop one row immediately if possible so the piece enters view promptly.
      if (fits(cur, cur.rot, cur.x, cur.y + 1)) cur.y++;
    }
    function spawnNext() { spawn(queue.shift()); queue.push(nextType()); }
    function topOut() {
      over = true;
      api.shake(12);
      api.audio.tone(330, 0.5, { type: 'sawtooth', slide: 0.2, vol: 0.3 });
      api.audio.noise(0.4, { vol: 0.2 });
      for (var y = HIDDEN; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        if (grid[y][x]) api.fx.burst(BX + x * CELL + CELL / 2, BY + (y - HIDDEN) * CELL + CELL / 2, pal[grid[y][x]], 2, 90);
      }
      popup(SPRINT ? 'TOPPED OUT' : 'GAME OVER', '#ff4d6d', 18, BY + BH / 2, 2);
    }
    function grounded() { return !fits(cur, cur.rot, cur.x, cur.y + 1); }
    function touchLock() {
      if (grounded() && lockResets < 15) { lockT = 0; lockResets++; }
    }
    function move(dx) {
      if (cur && fits(cur, cur.rot, cur.x + dx, cur.y)) {
        cur.x += dx;
        lastRot = false;
        touchLock();
        api.audio.tone(180, 0.03, { type: 'square', vol: 0.08 });
        return true;
      }
      return false;
    }
    function rotate(dirn) {
      if (!cur || cur.type === 'O') return;
      var from = cur.rot, to = (cur.rot + dirn + 4) % 4;
      var table = cur.type === 'I' ? KICKS_I : KICKS;
      var kicks = table[from + '>' + to];
      for (var i = 0; i < kicks.length; i++) {
        var nx = cur.x + kicks[i][0], ny = cur.y - kicks[i][1];
        if (fits(cur, to, nx, ny)) {
          cur.x = nx; cur.y = ny; cur.rot = to;
          lastRot = true; lastKick = i;
          touchLock();
          api.audio.tone(420, 0.04, { type: 'triangle', vol: 0.12 });
          return;
        }
      }
    }
    function ghostY() {
      var y = cur.y;
      while (fits(cur, cur.rot, cur.x, y + 1)) y++;
      return y;
    }
    function filled(x, y) { return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && !!grid[y][x]); }
    // 0 = none, 1 = mini, 2 = full. 3-corner rule; the 5th SRS kick upgrades a mini.
    function tspinKind() {
      if (!cur || cur.type !== 'T' || !lastRot) return 0;
      var cx = cur.x + 1, cy = cur.y + 1, n = 0, occ = [];
      for (var i = 0; i < 4; i++) { occ[i] = filled(cx + TCORNERS[i][0], cy + TCORNERS[i][1]); if (occ[i]) n++; }
      if (n < 3) return 0;
      var f = TFRONT[cur.rot];
      return (occ[f[0]] && occ[f[1]]) || lastKick === 4 ? 2 : 1;
    }
    function lock() {
      var ts = tspinKind();
      var cs = cells(cur);
      var above = true;
      lockN = 0;
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        if (c[1] >= 0) grid[c[1]][c[0]] = cur.type;
        if (c[1] >= HIDDEN) above = false;
        if (lockN < 4) { lockCells[lockN][0] = c[0]; lockCells[lockN][1] = c[1]; lockN++; }
      }
      lockFlash = 0.18;
      api.audio.tone(140, 0.06, { type: 'square', vol: 0.12 });
      if (above) { cur = null; topOut(); return; }
      var full = [];
      for (var y = 0; y < ROWS; y++) if (grid[y].every(Boolean)) full.push(y);
      cur = null;
      holdUsed = false;
      if (full.length) {
        var quad = full.length === 4;
        clearing = { rows: full, t: 0, flash: quad ? 0.2 : 0.12, dur: quad ? 0.42 : 0.3 };
        for (y = 0; y < ROWS; y++) {
          var k = 0;
          for (var j = 0; j < full.length; j++) if (full[j] > y) k++;
          shift[y] = full.indexOf(y) >= 0 ? -1 : k;
        }
        award(full.length, ts);
        full.forEach(function (row) {
          var sy = BY + (row - HIDDEN) * CELL + CELL / 2;
          for (var x = 0; x < COLS; x++) {
            var sx = BX + x * CELL + CELL / 2;
            api.fx.burst(sx, sy, pal[grid[row][x]], quad ? 6 : 3, quad ? 280 : 170, quad ? 0.8 : 0.5);
            api.fx.trail(sx, sy, '#ffffff', (x - 4.5) * 40, 0);
          }
        });
      } else {
        if (ts) award(0, ts);
        combo = -1;
        spawnNext();
      }
    }
    function isPerfect(full) {
      for (var y = 0; y < ROWS; y++) {
        if (full.indexOf(y) >= 0) continue;
        for (var x = 0; x < COLS; x++) if (grid[y][x]) return false;
      }
      return true;
    }
    // Marathon scoring (x level): lines 100/300/500/800; T-spin 400/800/1200/1600;
    // T-spin mini 100/200/400; B2B x1.5 for quads and line-clearing T-spins;
    // combo +50 per step; perfect clear +800/1200/1800/2000 (3200 B2B quad).
    function award(n, ts) {
      var cx = BX + BW / 2;
      var cy = clearing ? BY + (clearing.rows[0] - HIDDEN) * CELL : BY + BH * 0.4;
      var pc = n > 0 && isPerfect(clearing.rows);
      var difficult = n === 4 || (ts > 0 && n > 0);
      var base = ts === 2 ? [400, 800, 1200, 1600][n] : ts === 1 ? [100, 200, 400, 400][n] : [0, 100, 300, 500, 800][n];
      var b2bHit = difficult && b2b;
      if (b2bHit) base = Math.floor(base * 1.5);
      if (n > 0) { b2b = difficult; combo++; }
      var bonus = combo > 0 && n > 0 ? 50 * combo : 0;
      var pcPts = pc ? (n === 4 && b2bHit ? 3200 : [0, 800, 1200, 1800, 2000][n]) : 0;
      var total = (base + bonus + pcPts) * level;
      pts(total);
      lines += n;
      var label = ts === 2 ? 'T-SPIN' + (n ? ' ' + ['', 'SINGLE', 'DOUBLE', 'TRIPLE'][n] : '')
        : ts === 1 ? 'T-SPIN MINI' + (n ? ' ' + ['', 'SINGLE', 'DOUBLE', 'TRIPLE'][n] : '')
        : ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'BLOCK DROP!'][n];
      if (ts) lastTspin = label;
      var py = U.clamp(cy - 30, BY + 60, BY + BH - 130);
      var color = ts ? pal.T : n === 4 ? col.acc2 : col.accent, oy = py + (n === 4 ? 30 : 24);
      popup(label, color, n === 4 ? 22 : ts === 2 ? 15 : ts ? 12 : 13, py, n === 4 || ts ? 1.5 : 1.0);
      if (n === 4) { popup('QUAD', '#ffffff', 12, oy, 1.4); oy += 22; }
      if (b2bHit) { popup('BACK-TO-BACK', col.acc2, 11, oy, 1.3); oy += 22; }
      if (!SPRINT && total > 0) { api.fx.text(cx, oy, '+' + U.fmt(total), '#ffffff', 11); oy += 20; }
      if (combo > 0 && n > 0) api.fx.text(cx, oy, 'COMBO ' + combo, '#ff3fa4', 11);
      var m = M();
      if (n > 0) {
        api.shake(n === 4 ? 14 : n * 2.5);
        if (n === 4) {
          flashA = 0.55;
          wave(cx, cy + CELL * 2, col.acc2, 320);
          wave(cx, cy + CELL * 2, '#ffffff', 220);
        }
        if (m) {
          m.stinger(CLEAR_STINGS[n], { inst: n === 4 ? 'lead' : 'pluck', quantize: n === 4 ? 'beat' : '8', octave: 1, gain: n === 4 ? 0.45 : 0.6,
            params: n === 4 ? { wave: 'triangle', cutoff: 2800 } : null });
          if (n === 4) m.note('riser', 0, { dur: 1, gain: 0.45 });
        } else api.audio.arp(n === 4 ? [523, 659, 784, 1047] : [440, 554, 659].slice(0, n + 1), 0.05, { type: 'square', vol: 0.18 });
      }
      if (ts) {
        wave(cx, py, pal.T, 160);
        if (m) {
          m.stinger(ts === 2 ? TSPIN_STING : TSPIN_MINI_STING, { inst: 'bell', quantize: '16', octave: 1, gain: 0.5 });
          m.note('snare', 0, { quantize: '16', gain: 0.4 });
        } else api.audio.arp([392, 330, 494, 587], 0.045, { type: 'triangle', vol: 0.18 });
      }
      if (pc) {
        pcs++;
        flashA = 0.8;
        api.shake(16);
        popup('PERFECT CLEAR', '#ffffff', 17, BY + BH * 0.55, 2.2);
        if (!SPRINT) api.fx.text(cx, BY + BH * 0.55 + 26, '+' + U.fmt(pcPts * level), col.acc2, 12);
        wave(cx, BY + BH * 0.55, col.accent, 380);
        for (var i = 0; i < 12; i++) api.fx.burst(BX + (i + 0.5) * BW / 12, BY + BH - 20 - (i % 3) * 30, i % 2 ? col.accent : col.acc2, 10, 260, 1.1);
        if (m) { m.stinger(PC_STING, { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 }); m.note('riser', 0, { dur: 1.4, gain: 0.5 }); }
        else api.audio.arp([523, 659, 784, 1047, 1319], 0.07, { type: 'triangle', vol: 0.22 });
      }
      if (SPRINT) {
        for (var s = splits.length; s < 4 && lines >= (s + 1) * 10; s++) {
          var cs = Math.round(elapsed * 100);
          splits.push(cs);
          if (s < 3) {
            var d = bestSplits ? cs - bestSplits[s] : null;
            api.fx.text(PX + PW / 2, BY + 536, (s + 1) * 10 + ' ' + fmtTime(cs), '#ffffff', 9);
            if (d != null) api.fx.text(PX + PW / 2, BY + 552, (d <= 0 ? '-' : '+') + (Math.abs(d) / 100).toFixed(2), d <= 0 ? '#39ff88' : '#ff4d6d', 10);
          }
        }
        if (lines >= SPRINT_LINES) completeSprint();
        else if (n > 0) sprintMusic();
        return;
      }
      var newLevel = 1 + Math.floor(lines / 10);
      if (newLevel > level) {
        level = newLevel;
        setTheme(THEMES[(level - 1) % THEMES.length]);
        banner = { str: 'LEVEL ' + level, sub: thB.name, t: 0 };
        if (m) levelMusic();
        else api.audio.arp([392, 523, 659, 784], 0.07, { type: 'triangle', vol: 0.2 });
      }
    }
    function setTheme(th) {
      if (th === thB) return;
      thA = thB; thB = th; thK = 0;
    }
    function completeSprint() {
      done = true;
      var cs = Math.round(elapsed * 100);
      api.setScore(cs);
      if (splits.length === 4 && (!bestSplits || cs < bestSplits[3])) U.store('bd_sprint_splits', splits);
      banner = { str: 'FINISHED!', sub: fmtTime(cs), t: 0, hold: true };
      flashA = 0.9;
      api.shake(12);
      wave(BX + BW / 2, BY + BH / 2, col.accent, 420);
      wave(BX + BW / 2, BY + BH / 2, col.acc2, 300);
      var m = M();
      if (m) {
        m.stinger(PC_STING, { inst: 'lead', quantize: '8', octave: 1, gain: 0.5, params: { wave: 'triangle', cutoff: 3000 } });
        m.note('riser', 0, { dur: 1.2, gain: 0.5 });
        m.setIntensity(1);
      } else api.audio.arp([523, 659, 784, 1047, 1319], 0.07, { type: 'triangle', vol: 0.22 });
    }
    function hardDrop() {
      var gy = ghostY();
      var dist = gy - cur.y;
      var cs = cells(cur);
      trail.cols.length = 0;
      for (var i = 0; i < cs.length; i++) if (trail.cols.indexOf(cs[i][0]) < 0) trail.cols.push(cs[i][0]);
      trail.top = cur.y; trail.bot = gy; trail.color = pal[cur.type]; trail.t = dist > 0 ? 0.22 : 0;
      for (i = 0; i < 4; i++) {
        api.fx.trail(BX + (cur.x + 1 + Math.random() * 2) * CELL, BY + (gy - HIDDEN) * CELL, pal[cur.type], 0, -120);
      }
      if (dist > 0) lastRot = false;
      cur.y = gy;
      pts(dist * 2);
      api.shake(3);
      var m = M();
      if (m) m.note('kick', 0, { quantize: '16', gain: dist > 8 ? 0.8 : 0.55 });
      lock();
    }
    function doHold() {
      if (!cur || holdUsed) return;
      var t0 = cur.type;
      if (hold) spawn(hold); else spawnNext();
      hold = t0;
      holdUsed = true;
      api.audio.tone(300, 0.06, { type: 'triangle', vol: 0.12 });
    }

    // Visual timers: theme blend, popups, waves, flashes.
    function animate(dt) {
      var i;
      if (thK < 1) {
        thK = Math.min(1, thK + dt / 1.2);
        var a = thA.rgb, b = thB.rgb;
        if (thK >= 1) {
          thA = thB;
          col.accent = thB.accent; col.acc2 = thB.acc2;
          for (i = 0; i < 7; i++) pal[TYPES[i]] = thB.pieces[TYPES[i]];
        } else {
          col.accent = mixRgb(a.accent, b.accent, thK); col.acc2 = mixRgb(a.acc2, b.acc2, thK);
          for (i = 0; i < 7; i++) pal[TYPES[i]] = mixRgb(a[TYPES[i]], b[TYPES[i]], thK);
        }
      }
      for (i = popups.length - 1; i >= 0; i--) { popups[i].age += dt; if (popups[i].age > popups[i].life) popups.splice(i, 1); }
      for (i = waves.length - 1; i >= 0; i--) { var w = waves[i]; w.age += dt; w.r += (w.max - w.r) * Math.min(1, dt * 5); if (w.age > 0.7) waves.splice(i, 1); }
      if (flashA > 0) flashA = Math.max(0, flashA - dt * 2.2);
      if (lockFlash > 0) lockFlash = Math.max(0, lockFlash - dt);
      if (trail.t > 0) trail.t = Math.max(0, trail.t - dt);
      if (banner) { banner.t += dt; if (banner.t > 1.8 && !banner.hold) banner = null; }
    }

    if (M()) M().play(SPRINT ? sprintSong() : song(), { fade: 1.2, intensity: SPRINT ? 0.2 : 0 });
    spawnNext();

    function drawMini(ctx, type, cx, cy, size, dim) {
      if (!type) return;
      var m = ROT[type][0];
      var minX = 9, maxX = -1, minY = 9, maxY = -1, xx, yy;
      for (yy = 0; yy < m.length; yy++) for (xx = 0; xx < m.length; xx++) if (m[yy][xx]) {
        minX = Math.min(minX, xx); maxX = Math.max(maxX, xx); minY = Math.min(minY, yy); maxY = Math.max(maxY, yy);
      }
      var w = (maxX - minX + 1) * size, h = (maxY - minY + 1) * size;
      for (yy = 0; yy < m.length; yy++) for (xx = 0; xx < m.length; xx++) if (m[yy][xx]) {
        drawCell(ctx, cx - w / 2 + (xx - minX) * size, cy - h / 2 + (yy - minY) * size, size, pal[type], dim ? 0.35 : 1, thB.glow);
      }
    }
    function label(ctx, text, yy) {
      ctx.fillStyle = 'rgba(220,230,255,0.7)';
      ctx.font = '700 11px ' + MONO;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(text, PX, yy);
    }
    function panelBox(ctx, y, h) {
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(PX, y, PW, h);
      ctx.strokeStyle = col.accent;
      ctx.globalAlpha = 0.3;
      ctx.strokeRect(PX + 0.5, y + 0.5, PW - 1, h - 1);
      ctx.globalAlpha = 1;
    }

    return {
      debug: function () {
        return { mode: api.mode, variant: api.variant, lines: lines, level: level, piece: cur ? cur.type : null,
          rot: cur ? cur.rot : null, x: cur ? cur.x : null, y: cur ? cur.y : null, hold: hold, next: queue.slice(0, 3),
          tspin: lastTspin, b2b: b2b, combo: combo, perfectClears: pcs, theme: thB.name,
          timeCs: SPRINT ? Math.round(elapsed * 100) : 0, left: SPRINT ? Math.max(0, SPRINT_LINES - lines) : null,
          clearing: !!clearing, done: done, dead: over };
      },
      update: function (dt) {
        t += dt;
        animate(dt);
        api.setStatus(SPRINT ? 'SPRINT 40  LINES ' + Math.min(lines, SPRINT_LINES) + '/' + SPRINT_LINES : 'LV ' + level + '  LINES ' + lines + '  ' + thB.name);
        var inp = api.input;
        if (SPRINT && !over && !done) { elapsed += dt; api.setScore(Math.round(elapsed * 100)); }
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); inp.takeSwipes(); return; }

        if (clearing) {
          clearing.t += dt;
          if (clearing.t >= clearing.dur) {
            clearing.rows.forEach(function (row) {
              grid.splice(row, 1);
              grid.unshift(new Array(COLS).fill(null));
            });
            clearing = null;
            if (!done) spawnNext();
          }
        }
        if (done) {
          doneT += dt; fwT -= dt;
          if (fwT <= 0 && doneT < 1.5) {
            fwT = 0.18;
            var fx = BX + 30 + Math.random() * (BW - 60), fy = BY + 60 + Math.random() * (BH * 0.6);
            api.fx.burst(fx, fy, Math.random() < 0.5 ? col.accent : pal[TYPES[Math.floor(Math.random() * 7)]], 26, 240, 0.9);
            api.audio.noise(0.12, { vol: 0.08, cutoff: 3000 });
          }
          if (doneT > 1.7 && !finished) { finished = true; api.finish(); }
          inp.takeSwipes();
          return;
        }
        if (clearing) { inp.takeSwipes(); return; }
        if (!cur) return;

        // Rotation / hold / hard drop (edge triggered)
        if (inp.hit('up') || inp.hit('c')) rotate(1);
        if (inp.hit('b')) rotate(-1);
        if (inp.hit('d')) doHold();
        if (!cur) return;
        if (inp.hit('a')) { hardDrop(); return; }

        // Swipe / tap controls on the canvas
        var sw = inp.takeSwipes();
        for (var i = 0; i < sw.length && cur; i++) {
          if (sw[i] === 'tap') rotate(1);
          else if (sw[i] === 'left') move(-1);
          else if (sw[i] === 'right') move(1);
          else if (sw[i] === 'down') { hardDrop(); return; }
          else if (sw[i] === 'up') doHold();
        }
        if (!cur) return;

        // DAS / ARR horizontal movement
        var L = inp.held('left'), R = inp.held('right');
        var want = L && !R ? -1 : R && !L ? 1 : 0;
        if (inp.hit('left')) { dasDir = -1; dasT = 0; arrT = 0; move(-1); }
        else if (inp.hit('right')) { dasDir = 1; dasT = 0; arrT = 0; move(1); }
        else if (want && want === dasDir) {
          dasT += dt;
          if (dasT > 0.16) { arrT += dt; while (arrT > 0.045) { arrT -= 0.045; if (!move(want)) break; } }
        } else if (want) { dasDir = want; dasT = 0; } else dasDir = null;

        // Gravity (soft drop while down is held). Sprint uses fixed gravity.
        var g = SPRINT ? 0.8 : gravity(level);
        var soft = inp.held('down');
        var interval = soft ? Math.min(g, 0.035) : g;
        if (grounded()) {
          lockT += dt;
          if (lockT >= 0.5) lock();
        } else {
          fallT += dt;
          while (fallT >= interval && cur && !grounded()) {
            fallT -= interval;
            cur.y++;
            lastRot = false;
            if (soft) pts(1);
          }
          if (cur && grounded()) fallT = 0;
        }
      },

      render: function (ctx) {
        var x, y, i, m = M();
        var beat = m && m.isPlaying() ? m.pulse(6) : 0;
        drawBg(ctx, thA, t, W, H, 1, gcache);
        if (thK < 1) drawBg(ctx, thB, t, W, H, thK, gcache);
        drawBoardBg(ctx, thA, 1, BX, BY, COLS, ROWS - HIDDEN, CELL);
        if (thK < 1) drawBoardBg(ctx, thB, thK, BX, BY, COLS, ROWS - HIDDEN, CELL);
        ctx.save();
        ctx.strokeStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = 10 + beat * 10; ctx.lineWidth = 2;
        ctx.strokeRect(BX - 2, BY - 2, BW + 4, BH + 4);
        ctx.restore();

        // Sprint: lines-left numeral behind the stack + progress rail.
        if (SPRINT) {
          var left = Math.max(0, SPRINT_LINES - lines);
          var hot = left <= 10;
          ctx.save();
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.globalAlpha = hot ? 0.22 + beat * 0.12 : 0.14;
          ctx.fillStyle = hot ? col.accent : '#ffffff';
          ctx.font = '900 112px ' + MONO;
          ctx.fillText(String(left), BX + BW / 2, BY + BH * 0.42);
          ctx.font = '800 22px ' + MONO;
          ctx.fillText('LEFT', BX + BW / 2, BY + BH * 0.42 + 72);
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.fillRect(BX + BW + 4, BY, 4, BH);
          var prog = Math.min(1, lines / SPRINT_LINES);
          ctx.fillStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = 8;
          ctx.fillRect(BX + BW + 4, BY + BH * (1 - prog), 4, BH * prog);
          ctx.restore();
        }

        // Cells (clipped to the board so collapsing rows slide in cleanly).
        ctx.save();
        ctx.beginPath(); ctx.rect(BX, BY, BW, BH); ctx.clip();
        var coll = 0, flashing = false;
        if (clearing) {
          flashing = clearing.t < clearing.flash;
          if (!flashing) { coll = (clearing.t - clearing.flash) / (clearing.dur - clearing.flash); coll = 1 - (1 - coll) * (1 - coll); }
        }
        for (y = 0; y < ROWS; y++) {
          var isClear = clearing && shift[y] < 0;
          var sy = BY + (y - HIDDEN) * CELL + (clearing && !isClear ? shift[y] * CELL * coll : 0);
          if (sy < BY - CELL) continue;
          if (isClear) {
            if (flashing) {
              var fl = (Math.floor(clearing.t * 30) & 1) ? 1 : 0.7;
              for (x = 0; x < COLS; x++) drawCell(ctx, BX + x * CELL, sy, CELL, '#ffffff', fl, 16);
            } else {
              var bh = CELL * (1 - coll);
              ctx.save();
              ctx.globalAlpha = 1 - coll * 0.6;
              ctx.fillStyle = '#ffffff'; ctx.shadowColor = col.accent; ctx.shadowBlur = 20;
              ctx.fillRect(BX + BW * coll * 0.5, sy + (CELL - bh) / 2, BW * (1 - coll), Math.max(1, bh));
              ctx.restore();
            }
            continue;
          }
          for (x = 0; x < COLS; x++) if (grid[y][x]) drawCell(ctx, BX + x * CELL, sy, CELL, pal[grid[y][x]], 1, thB.glow);
        }
        // lock flash
        if (lockFlash > 0 && !clearing) {
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = lockFlash / 0.18 * 0.7;
          for (i = 0; i < lockN; i++) if (lockCells[i][1] >= HIDDEN) ctx.fillRect(BX + lockCells[i][0] * CELL + 1, BY + (lockCells[i][1] - HIDDEN) * CELL + 1, CELL - 2, CELL - 2);
          ctx.globalAlpha = 1;
        }
        // hard-drop streak
        if (trail.t > 0) {
          var ty0 = BY + (Math.max(HIDDEN, trail.top) - HIDDEN) * CELL, ty1 = BY + (trail.bot - HIDDEN) * CELL + CELL;
          if (ty1 > ty0) {
            var tg = ctx.createLinearGradient(0, ty0, 0, ty1);
            tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, trail.color);
            ctx.globalAlpha = trail.t / 0.22 * 0.55;
            ctx.fillStyle = tg;
            for (i = 0; i < trail.cols.length; i++) ctx.fillRect(BX + trail.cols[i] * CELL + 4, ty0, CELL - 8, ty1 - ty0);
            ctx.globalAlpha = 1;
          }
        }
        if (cur && !over) {
          var gy = ghostY(), gc = cells(cur, cur.rot, cur.x, gy), pc = pal[cur.type];
          ctx.save();
          ctx.strokeStyle = pc; ctx.fillStyle = pc; ctx.lineWidth = 1.5;
          ctx.shadowColor = pc; ctx.shadowBlur = 10;
          for (i = 0; i < gc.length; i++) {
            if (gc[i][1] < HIDDEN) continue;
            var gx0 = BX + gc[i][0] * CELL, gy0 = BY + (gc[i][1] - HIDDEN) * CELL;
            ctx.globalAlpha = 0.1; ctx.fillRect(gx0 + 2, gy0 + 2, CELL - 4, CELL - 4);
            ctx.globalAlpha = 0.55 + beat * 0.2; ctx.strokeRect(gx0 + 2.5, gy0 + 2.5, CELL - 5, CELL - 5);
          }
          ctx.restore();
          var cc = cells(cur);
          for (i = 0; i < cc.length; i++) if (cc[i][1] >= HIDDEN) drawCell(ctx, BX + cc[i][0] * CELL, BY + (cc[i][1] - HIDDEN) * CELL, CELL, pc, 1, thB.glow + 4);
        }
        ctx.restore();

        // shockwaves
        for (i = 0; i < waves.length; i++) {
          var wv = waves[i];
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - wv.age / 0.7);
          ctx.strokeStyle = wv.color; ctx.lineWidth = 3 + (1 - wv.age / 0.7) * 5;
          ctx.shadowColor = wv.color; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.arc(wv.x, wv.y, wv.r, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }

        // side panel
        label(ctx, 'NEXT', BY + 10);
        panelBox(ctx, BY + 18, 200);
        drawMini(ctx, queue[0], PX + PW / 2, BY + 62, 20);
        drawMini(ctx, queue[1], PX + PW / 2, BY + 130, 15);
        drawMini(ctx, queue[2], PX + PW / 2, BY + 186, 15);
        label(ctx, 'HOLD', BY + 246);
        panelBox(ctx, BY + 254, 76);
        drawMini(ctx, hold, PX + PW / 2, BY + 292, 18, holdUsed);
        if (SPRINT) {
          var lft = Math.max(0, SPRINT_LINES - lines);
          label(ctx, 'LEFT', BY + 360);
          U.glowText(ctx, String(lft), PX + PW / 2, BY + 390, 24, lft <= 10 ? col.accent : '#ffffff');
          label(ctx, 'TIME', BY + 424);
          U.glowText(ctx, fmtTime(elapsed * 100), PX + PW / 2, BY + 444, 11, col.acc2);
          if (lines > 0 && !done) {
            label(ctx, 'PACE', BY + 474);
            U.glowText(ctx, fmtTime(elapsed / lines * SPRINT_LINES * 100), PX + PW / 2, BY + 492, 10, '#ffffff');
            ctx.fillStyle = 'rgba(220,230,255,0.55)'; ctx.font = '700 10px ' + MONO; ctx.textAlign = 'center';
            ctx.fillText((lines / Math.max(0.01, elapsed) * 60).toFixed(1) + ' LPM', PX + PW / 2, BY + 512);
          }
        } else {
          label(ctx, 'LEVEL', BY + 360);
          U.glowText(ctx, String(level), PX + PW / 2, BY + 388, 20, col.acc2);
          label(ctx, 'LINES', BY + 426);
          U.glowText(ctx, String(lines), PX + PW / 2, BY + 454, 20, col.accent);
          ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(PX, BY + 472, PW, 4);
          ctx.fillStyle = col.accent; ctx.fillRect(PX, BY + 472, PW * (lines % 10) / 10, 4);
          label(ctx, thB.name, BY + 494);
          if (b2b) U.glowText(ctx, 'B2B', PX + PW / 2, BY + 520, 11, col.acc2);
          if (combo > 0) U.glowText(ctx, 'COMBO x' + combo, PX + PW / 2, BY + 542, 9, '#ff3fa4');
        }

        // popups
        for (i = 0; i < popups.length; i++) {
          var p = popups[i];
          var pa = p.age > p.life - 0.35 ? Math.max(0, (p.life - p.age) / 0.35) : 1;
          var ps = p.age < 0.14 ? 1.6 - 0.6 * (p.age / 0.14) : 1;
          ctx.save();
          ctx.globalAlpha = pa;
          U.glowText(ctx, p.str, BX + BW / 2, p.y - p.age * 28, p.size * ps, p.color);
          ctx.restore();
        }
        // level / finish banner
        if (banner) {
          var bt = banner.t, slide = bt < 0.25 ? 1 - bt / 0.25 : 0;
          var ba = banner.hold ? 1 : bt > 1.5 ? Math.max(0, (1.8 - bt) / 0.3) : 1;
          var by0 = BY + BH * 0.34;
          ctx.save();
          ctx.globalAlpha = ba;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(BX, by0 - 34, BW, 74);
          ctx.fillStyle = col.accent;
          ctx.fillRect(BX, by0 - 34, BW, 2); ctx.fillRect(BX, by0 + 38, BW, 2);
          U.glowText(ctx, banner.str, BX + BW / 2 - slide * 300, by0 - 6, 22, col.acc2);
          U.glowText(ctx, banner.sub, BX + BW / 2 + slide * 300, by0 + 22, 12, col.accent);
          ctx.restore();
        }
        if (flashA > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = flashA * 0.6;
          ctx.fillRect(0, 0, W, H);
          ctx.globalAlpha = 1;
        }
      }
    };
  }

  // Attract loop: cycles the five Marathon themes with a falling piece + ghost.
  function attract(ctx, w, h, t) {
    var ti = Math.floor(t / 4) % THEMES.length;
    var th = THEMES[ti];
    drawBg(ctx, th, t, w, h, 1, null);
    var size = Math.max(6, Math.floor(h / 14));
    var cols = Math.floor(w / size);
    var ox = (w - cols * size) / 2;
    var rows = Math.floor(h / size);
    drawBoardBg(ctx, th, 0.6, ox, h - rows * size, cols, rows, size);
    var stack = [3, 4, 2, 5, 5, 3, 1, 4, 6, 2, 3, 5, 4, 2];
    var flashRow = ((t % 4) > 3.4) ? 0 : -1;
    for (var x = 0; x < cols; x++) {
      var hgt = stack[x % stack.length];
      for (var y = 0; y < hgt; y++) {
        var c = y === flashRow ? '#ffffff' : th.pieces[TYPES[(x * 3 + y) % 7]];
        drawCell(ctx, ox + x * size, h - (y + 1) * size, size, c, 0.92, th.glow);
      }
    }
    var cyc = (t * 0.7) % 1;
    var type = TYPES[Math.floor(t * 0.7) % 7];
    var m = ROT[type][Math.floor(t * 1.4) % 4];
    var c0 = Math.floor(cols / 2 - 1), n = m.length, land = h, xx, yy;
    for (xx = 0; xx < n; xx++) for (yy = n - 1; yy >= 0; yy--) if (m[yy][xx]) {
      land = Math.min(land, h - stack[(c0 + xx) % stack.length] * size - (yy + 1) * size); break;
    }
    var px = ox + c0 * size;
    var py = Math.min(land, -size * 2 + cyc * (land + size * 3));
    var col = th.pieces[type];
    ctx.save();
    ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.globalAlpha = 0.5;
    for (yy = 0; yy < n; yy++) for (xx = 0; xx < n; xx++) if (m[yy][xx]) {
      ctx.strokeRect(px + xx * size + 2.5, land + yy * size + 2.5, size - 5, size - 5);
    }
    ctx.restore();
    for (yy = 0; yy < n; yy++) for (xx = 0; xx < n; xx++) if (m[yy][xx]) {
      drawCell(ctx, px + xx * size, py + yy * size, size, col, 1, th.glow + 4);
    }
    ctx.save();
    ctx.globalAlpha = Math.min(1, (t % 4) * 2, (4 - t % 4) * 2) * 0.7;
    ctx.fillStyle = th.accent; ctx.font = '800 ' + Math.max(8, Math.round(h / 20)) + 'px ' + MONO;
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText(th.name, w - 6, 6);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_block_drop',
    order: 2,
    title: 'Block Drop',
    tagline: 'Stack, clear, survive the speed-up.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'blocks',
    modeLabel: 'Marathon',
    variants: [{ key: 'sprint', label: 'Sprint 40', mode: 'time', tagline: 'Clear 40 lines. Fastest time wins.' }],
    controls: '\u2190\u2192 move \u00b7 \u2191/X rotate \u00b7 Z counter \u00b7 Space drop \u00b7 C hold',
    create: create,
    attract: attract
  });
})(window);

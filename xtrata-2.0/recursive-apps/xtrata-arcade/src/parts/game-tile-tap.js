/*
 * Xtrata Arcade cartridge #10 -- TILE TAP (v2)
 *
 * Four lanes of tiles scroll down in time with the band. Every tile is a note
 * of the song's melody: the engine plays the backing, the PLAYER performs the
 * lead. Tap a tile as its bottom edge touches the glowing hit line.
 *
 *   SONGS (base mode, contract mode 'score', higher is better)
 *     An endless setlist of original songs. Each song is readable data: an
 *     engine arrangement, a lead melody written on an eighth-note grid, and a
 *     CHART derived from that melody (lanes follow the melody's contour).
 *     After the last song the setlist loops faster and denser.
 *
 *   RUSH 100 (variant 'rush', contract mode 'time', lower is better)
 *     A column of 100 tiles that only moves when you hit it. The clock starts
 *     on the first tap; a wrong lane is a DID NOT FINISH.
 *
 * Tile types: TAP, HOLD (keep the lane pressed until the tail), DOUBLE (two
 * lanes at once). Timing grades PERFECT / GREAT / GOOD feed a combo that
 * raises a score multiplier.
 *
 * Rules that decide a run (base mode):
 *   - a tap on the WRONG lane ends the run at once (classic tile rule);
 *   - a tile that scrolls past untouched costs one of 3 lives;
 *   - a broken hold or a split double only breaks the combo;
 *   - clearing a song gives back one life (max 3).
 *
 * Contract game-id: xa_tile_tap
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-tile-tap');
  var U = XA.util;
  function M() { return XA.music; }

  /* ================================================================ layout */
  var W = 400, H = 600, LANES = 4, LW = W / LANES;
  var HIT_Y = 492;             // a tile is due when its bottom edge touches this line
  var PAD_TOP = HIT_Y + 12;    // lane pads (key labels) live below the hit line
  var PPB = 190;               // scroll: pixels per beat (tiles move with the tempo)
  var SLOT = 0.5;              // chart grid: eighth notes (in beats)
  var TAP_H = 84;              // height of a tap / double tile
  var LOOK_BEATS = (HIT_Y - 8) / PPB;  // a tile can be tapped once it is on screen
  var INTRO_BARS = 2;          // backing-only bars before the first tile of a song
  var ACCENT = '#3ff0ff', HOT = '#ff3fa4';
  var FONT = '"Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var LANE_KEYS = [['left', 'k1'], ['down', 'k2'], ['up', 'k3'], ['right', 'k4']];
  var LANE_LABELS = ['\u2190', '\u2193', '\u2191', '\u2192'];

  /* ======================================================= timing & scoring */
  // Windows are seconds either side of the beat. Generous for touch screens.
  // A tap EARLIER than the good window (tile already on screen) still counts
  // as GOOD so a fast player never dies for being keen; a tile LATER than the
  // good window is a MISS.
  var WIN = { perfect: 0.065, great: 0.13, good: 0.21 };
  var POINTS = { perfect: 50, great: 30, good: 15 };
  var ACC_WEIGHT = { perfect: 1, great: 0.75, good: 0.45, broken: 0.25, miss: 0 };
  var GRADE_TEXT = { perfect: 'PERFECT', great: 'GREAT', good: 'GOOD', early: 'EARLY', miss: 'MISS', broken: 'BROKEN', split: 'SPLIT' };
  var DOUBLE_WIN = 0.3;        // seconds allowed between the two halves of a double
  var HOLD_TICK_BEATS = 0.25;  // hold score ticks every sixteenth while held
  var HOLD_TICK_PTS = 4, HOLD_DONE_PTS = 20;
  var HOLD_GRACE = 0.2;        // beats: letting go this close to the tail still counts
  var START_LIVES = 3, MAX_LIVES = 3;
  var RUSH_TILES = 100, RUSH_ROW = 118, RUSH_BPM = 124;

  function multFor(combo) { return combo >= 50 ? 4 : combo >= 25 ? 3 : combo >= 10 ? 2 : 1; }
  function lapBpm(bpm, lap) { return Math.round(bpm * Math.min(1.45, 1 + 0.09 * (lap - 1))); }

  /* ================================================================ songs
     Melody notation, one string per bar, 8 eighth-note slots per bar:
        4     tap tile, scale degree 4 (0 = the key's tonic, 7 = an octave up)
        4~    HOLD tile starting here; each following '-' adds an eighth
        -     continues the hold before it
        4+    DOUBLE tile (two lanes at once; a third below is added as harmony)
        .     rest
     Chords are scale degrees per bar and are written for bar 1 of the melody;
     the engine song is rotated so its intro bars lead into them.            */
  var SONGS = [
    {
      id: 'sunday', title: 'SUNDAY ARCADE', feel: 'bright pop', keyName: 'G major',
      bpm: 112, key: 55, scale: 'major', chords: [0, 4, 5, 3], swing: 0, seed: 10, startLane: 1,
      lead: { inst: 'pluck', oct: 1, gain: 0.8, params: { decay: 0.42 } },
      sustain: { inst: 'lead', oct: 1, gain: 0.5, params: { cutoff: 2400, wave: 'triangle' } },
      theme: { bg: ['#060715', '#111a44'], accent: '#3ff0ff', hot: '#ff3fa4', tile: ['#12163a', '#1d4a78'],
        edge: '#6a7bff', lights: ['#3ff0ff', '#ff3fa4', '#8a7bff'], eq: '#3ff0ff' },
      melody: [
        '4 4 2 4 5 4 2 0',      // G
        '1 . 4 . 6 5 4 1',      // D
        '2 2 0 2 5 4 2 0',      // Em
        '0 . 3 . 5~ - - -',     // C
        '4 . 4 2 4 . 7 .',
        '6 . 5 4 1~ - - .',
        '2+ . 4 . 5 4 2 0',
        '3~ - - - 2 . 0 .',
        '7 . 7 6 7 . 4 .',
        '8 . 6 . 4 5 6 8',
        '9 . 7 . 5+ . 4 2',
        '3~ - - - 5 . 7 .',
        '4+ . 4 4 2 . 4 .',
        '6+ . 5 4 6 . 8 .',
        '7~ - - - 5 4 2 4',
        '0+ . . . 0~ - - -'
      ],
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.35, chord: true, octave: -1, params: { cutoff: 1500 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.6, pattern: 'x...x...x...x...' },
        { name: 'bass', inst: 'bass', layer: 0.1, gain: 0.42, chord: true, octave: -2, params: { cutoff: 800 },
          pattern: '. . 0 . . . 0 . . . 0 . . . ^0 .' },
        { name: 'clap', inst: 'clap', layer: 0.3, gain: 0.45, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.45, gain: 0.4, pattern: '..x...x...x...x.' },
        { name: 'shaker', inst: 'shaker', layer: 0.6, gain: 0.35, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'keys', inst: 'marimba', layer: 0.75, gain: 0.3, chord: true, octave: 0,
          fn: function (i) { return i.stepInBar % 4 === 2 ? [{ deg: 2 }, { deg: 4 }] : null; } }
      ]
    },
    {
      id: 'freeway', title: 'NEON FREEWAY', feel: 'synthwave', keyName: 'A minor',
      bpm: 118, key: 57, scale: 'minor', chords: [0, 5, 2, 6], swing: 0, seed: 22, startLane: 2,
      lead: { inst: 'lead', oct: 1, gain: 0.62, params: { cutoff: 3000, wave: 'sawtooth' } },
      sustain: { inst: 'lead', oct: 1, gain: 0.55, params: { cutoff: 2600, wave: 'sawtooth' } },
      theme: { bg: ['#12031f', '#3d0b3f'], accent: '#ff4fd8', hot: '#ffb347', tile: ['#24062e', '#6a1a6e'],
        edge: '#c95cff', lights: ['#ff4fd8', '#ffb347', '#7a5cff'], eq: '#ff4fd8', grid: true },
      melody: [
        '4~ - - - 2 . 4 .',     // Am
        '5~ - - - 4 . 2 .',     // F
        '4 . 6 . 7 . 6 4',      // C
        '6~ - - - 5 4 1 .',     // G
        '0+ . 2 4 7 . 4 .',
        '5 . 7 9 7~ - - -',
        '6 . 4 . 2 . 4 6',
        '8~ - - - - - . .',
        '7 7 4 7 9 7 4 2',
        '5+ . 9 . 7 5 4 5',
        '6 4 2 4 6~ - - -',
        '5 6 8 6 5 4 1 .',
        '4+ . 4 . 7~ - - -',
        '9 . 7 . 5+ . 4 .',
        '6 . 4 . 2~ - - -',
        '1 2 4 6 7~ - - -'
      ],
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.32, chord: true, octave: -1, params: { cutoff: 1900, attack: 0.3 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.62, pattern: 'x...x...x...x...' },
        { name: 'bass', inst: 'bass', layer: 0.1, gain: 0.4, chord: true, octave: -2, params: { cutoff: 700, q: 8 },
          pattern: '0 . 0 . ^0 . 0 . 0 . 0 . ^0 . 0 .' },
        { name: 'snare', inst: 'snare', layer: 0.25, gain: 0.5, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.4, gain: 0.35, pattern: '..x...x...x...x.' },
        { name: 'arp', inst: 'arp', layer: 0.55, gain: 0.24, chord: true, octave: 0,
          fn: function (i) { return { deg: [0, 2, 4, 7][i.stepInBar % 4] }; } },
        { name: 'bell', inst: 'bell', layer: 0.8, gain: 0.16, chord: true, octave: 1,
          fn: function (i) { return i.stepInBar === 0 || i.stepInBar === 10 ? { deg: 4 } : null; } }
      ]
    },
    {
      id: 'elevator', title: 'GLASS ELEVATOR', feel: 'dorian funk', keyName: 'D dorian',
      bpm: 100, key: 50, scale: 'dorian', chords: [0, 3], swing: 0.14, seed: 37, startLane: 0,
      lead: { inst: 'pluck', oct: 1, gain: 0.85, params: { wave: 'square', cutoff: 3200, decay: 0.3 } },
      sustain: { inst: 'lead', oct: 1, gain: 0.5, params: { cutoff: 2000, wave: 'square' } },
      theme: { bg: ['#021410', '#0b3326'], accent: '#5dff9a', hot: '#ffd23f', tile: ['#06261c', '#13573c'],
        edge: '#3fd6a0', lights: ['#5dff9a', '#ffd23f', '#3fc3ff'], eq: '#5dff9a' },
      melody: [
        '4 . 4 2 . 0 2 .',      // Dm7
        '3+ . . 5 . 3 . 1',     // G7
        '4 . 4 6 . 4 2 0',
        '5~ - - . 3 . 5+ .',
        '7 . . 7 6 . 4 .',
        '5 . 3 . 5 7 . 5',
        '4 2 . 0 2 . 4+ .',
        '3~ - - - 5+ . . .',
        '0+ . 0 . 2 4 . 6',
        '7 . 5 . 3 . 5 .',
        '9 . 7 6 . 4 . 2',
        '3~ - - - 1 . 3 .',
        '4 . 4 2 . 0 2 .',
        '3+ . . 5 . 3 . 5',
        '6 . 4 . 2 . 4 .',
        '7+ . . . 5~ - - -'
      ],
      tracks: [
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.62, pattern: 'x..x......x..x..' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.45, chord: true, octave: -2, params: { cutoff: 1100, q: 5 },
          pattern: '0 . ^0 . . 0 . 4 . 0 . . 6 . 4 2' },
        { name: 'snare', inst: 'snare', layer: 0.2, gain: 0.5, pattern: '....X..x....X.x.' },
        { name: 'hat', inst: 'hat', layer: 0.35, gain: 0.3, pattern: 'xxXxxxXxxxXxxxXx' },
        { name: 'stabs', inst: 'pluck', layer: 0.5, gain: 0.3, chord: true, octave: 0, params: { wave: 'square', cutoff: 2400, decay: 0.16 },
          fn: function (i) { return i.stepInBar === 2 || i.stepInBar === 7 || i.stepInBar === 10 ? [{ deg: 2 }, { deg: 4 }, { deg: 6 }] : null; } },
        { name: 'shaker', inst: 'shaker', layer: 0.65, gain: 0.3, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'keys', inst: 'marimba', layer: 0.8, gain: 0.26, chord: true, octave: 1,
          fn: function (i) { return i.stepInBar % 8 === 6 ? { deg: 4 } : null; } }
      ]
    }
  ];

  // Rush 100 plays the Sunday Arcade band faster; each tap plays the next note
  // of this chord-relative phrase (the original Tile Tap tune), so the melody
  // stays in harmony at whatever pace the player drives it.
  var RUSH_SONG = SONGS[0];
  var RUSH_LEAD = ('4 2 4 5 4 2 0 2 4 4 5 4 2 1 0 -1 ' +
    '0 2 4 2 5 4 2 0 2 4 2 0 -1 0 1 0').split(' ').map(Number);
  var RUSH_THEME = { bg: ['#14040a', '#3a0b16'], accent: '#ff6a3c', hot: '#ffe14d', tile: ['#2a0a10', '#7a1c24'],
    edge: '#ff8a5c', lights: ['#ff6a3c', '#ffe14d', '#ff3f7a'], eq: '#ff6a3c' };

  /* ========================================================= chart builder */
  // Parse the bar strings into notes { beat, deg, len, kind } (beats from bar 1).
  function parseMelody(bars, songId) {
    var notes = [], open = null;
    bars.forEach(function (bar, b) {
      var toks = bar.trim().split(/\s+/);
      if (toks.length !== 8) throw new Error('Tile Tap ' + songId + ': bar ' + (b + 1) + ' needs 8 slots');
      toks.forEach(function (tok, s) {
        var beat = b * 4 + s * SLOT;
        if (tok === '-') { if (open) open.len += SLOT; return; }
        open = null;
        if (tok === '.') return;
        var m = /^(-?\d+)([~+]?)$/.exec(tok);
        if (!m) throw new Error('Tile Tap ' + songId + ': bad token "' + tok + '" in bar ' + (b + 1));
        var n = { beat: beat, deg: Number(m[1]), len: 0, kind: m[2] === '~' ? 'hold' : m[2] === '+' ? 'double' : 'tap' };
        if (n.kind === 'hold') { n.len = SLOT; open = n; }
        notes.push(n);
      });
    });
    return notes;
  }
  SONGS.forEach(function (s) { s.notes = parseMelody(s.melody, s.id); s.bars = s.melody.length; });

  // Later laps: fill some rests straight after a tap with an echo of that note
  // (or a third either side). The chance grows each lap. Uses the seeded rng.
  function densify(notes, bars, lap, rng) {
    var p = Math.min(0.4, 0.16 * (lap - 1));
    if (p <= 0) return notes;
    var total = bars * 8, busy = [];
    notes.forEach(function (n) {
      var s0 = Math.round(n.beat / SLOT), s1 = s0 + Math.max(1, Math.round(n.len / SLOT));
      for (var s = s0; s < s1; s++) busy[s] = n;
    });
    var extra = [];
    for (var s = 1; s < total - 1; s++) {
      var prev = busy[s - 1];
      if (busy[s] || !prev || prev.kind === 'hold') continue;
      if (rng() >= p) continue;
      var n = { beat: s * SLOT, deg: prev.deg + [0, 2, -2][rng.int(3)], len: 0, kind: 'tap', filler: true };
      busy[s] = n;
      extra.push(n);
    }
    return notes.concat(extra).sort(function (a, b) { return a.beat - b.beat; });
  }

  // LANE RULE: lanes follow the melody's contour. A repeated note stays in its
  // lane, a step moves one lane, a leap (3+ degrees) moves two; the edges
  // bounce back. A double adds the lane two across (never adjacent).
  function bounce(l) { if (l < 0) l = -l; if (l > LANES - 1) l = 2 * (LANES - 1) - l; return U.clamp(l, 0, LANES - 1); }
  function assignLanes(notes, startLane, mirror) {
    var lane = startLane, prev = null;
    notes.forEach(function (n) {
      if (prev !== null) {
        var d = n.deg - prev;
        var step = d === 0 ? 0 : (d > 0 ? 1 : -1) * (Math.abs(d) >= 3 ? 2 : 1);
        lane = bounce(lane + step);
      }
      prev = n.deg;
      var l = mirror ? LANES - 1 - lane : lane;
      n.lanes = n.kind === 'double' ? [l, (l + 2) % LANES] : [l];
    });
  }

  // A playable chart for one song on one lap: runtime tiles with state.
  function buildChart(song, lap, rng) {
    var notes = song.notes.map(function (n) { return { beat: n.beat, deg: n.deg, len: n.len, kind: n.kind }; });
    notes = densify(notes, song.bars, lap, rng);
    var start = lap === 1 ? song.startLane : rng.int(LANES);
    var mirror = lap > 1 && rng() < 0.5;
    assignLanes(notes, start, mirror);
    var offset = INTRO_BARS * 4;
    notes.forEach(function (n) {
      n.beat += offset;
      n.state = 'wait';      // wait | part (double half hit) | held | done | miss | broken
      n.hitLanes = [];
      n.grade = null;
      n.fadeT = 0;
    });
    return notes;
  }

  // Engine song for the backing: the chord list is rotated so the intro bars
  // lead into bar 1 of the melody.
  function engineSong(song, bpm) {
    var ch = song.chords, n = ch.length, rot = [];
    for (var i = 0; i < n; i++) rot.push(ch[((i - INTRO_BARS) % n + n) % n]);
    return { bpm: bpm, key: song.key, scale: song.scale, chords: rot, swing: song.swing, seed: song.seed, tracks: song.tracks };
  }

  /* ============================================================ drawing kit */
  function hexA(hex, a) {
    var v = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((v >> 16) & 255) + ',' + ((v >> 8) & 255) + ',' + (v & 255) + ',' + a + ')';
  }
  function laneX(l) { return l * LW; }
  function laneCX(l) { return l * LW + LW / 2; }

  // Background, stage lights and equaliser bars. `pulse` is 0..1 on the beat.
  function drawBackdrop(ctx, th, w, h, t, pulse) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(1, th.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // stage lights: three beams sweeping from the top edge
    for (var i = 0; i < 3; i++) {
      var ox = w * (0.18 + i * 0.32);
      var ang = Math.sin(t * (0.5 + i * 0.17) + i * 2.1) * 0.45;
      var len = h * 0.95, spread = w * 0.2;
      var tx = ox + Math.sin(ang) * len, ty = Math.cos(ang) * len;
      var bg = ctx.createLinearGradient(ox, 0, tx, ty);
      bg.addColorStop(0, hexA(th.lights[i], 0.16 + pulse * 0.16));
      bg.addColorStop(1, hexA(th.lights[i], 0));
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.moveTo(ox - 4, 0);
      ctx.lineTo(tx - spread * Math.cos(ang), ty + spread * Math.sin(ang));
      ctx.lineTo(tx + spread * Math.cos(ang), ty - spread * Math.sin(ang));
      ctx.lineTo(ox + 4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = hexA(th.lights[i], 0.5 + pulse * 0.5);
      ctx.fillRect(ox - 7, 0, 14, 4);
    }
    // synthwave floor grid (Neon Freeway)
    if (th.grid) {
      ctx.strokeStyle = hexA(th.accent, 0.1 + pulse * 0.06);
      ctx.lineWidth = 1;
      var hy = h * 0.45, scroll = (t * 0.8) % 1;
      for (var k = 0; k < 9; k++) {
        var f = (k + scroll) / 9, y = hy + (h - hy) * f * f;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
    // equaliser bars rising from the hit line
    var bars = 16, bw = w / bars, base = h * (HIT_Y / H), maxH = h * 0.2;
    for (var b = 0; b < bars; b++) {
      var wob = 0.5 + 0.5 * Math.sin(t * (3 + (b % 5) * 0.9) + b * 1.7);
      var bh = maxH * (0.12 + 0.88 * wob * (0.35 + pulse * 0.65));
      ctx.fillStyle = hexA(th.eq, 0.07 + pulse * 0.07);
      ctx.fillRect(b * bw + 2, base - bh, bw - 4, bh);
    }
    ctx.restore();
  }

  function drawLaneLines(ctx, th, w, h, glow) {
    var lw = w / LANES;
    for (var l = 0; l < LANES; l++) {
      if (glow && glow[l] > 0.01) {
        var g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, hexA(th.accent, 0));
        g.addColorStop(1, hexA(th.accent, 0.22 * glow[l]));
        ctx.fillStyle = g;
        ctx.fillRect(l * lw, 0, lw, h);
      }
      if (l) { ctx.fillStyle = hexA(th.accent, 0.13); ctx.fillRect(l * lw - 0.5, 0, 1, h); }
    }
  }

  function drawHitLine(ctx, th, w, y, pulse) {
    ctx.save();
    ctx.shadowColor = th.hot;
    ctx.shadowBlur = 10 + pulse * 16;
    ctx.fillStyle = hexA(th.hot, 0.55 + pulse * 0.45);
    ctx.fillRect(0, y - 1.5, w, 3);
    ctx.restore();
    var g = ctx.createLinearGradient(0, y - 40, 0, y);
    g.addColorStop(0, hexA(th.hot, 0));
    g.addColorStop(1, hexA(th.hot, 0.1 + pulse * 0.1));
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 40, w, 40);
  }

  // Lane pads under the hit line: light up while pressed.
  function drawPads(ctx, th, down, glow) {
    ctx.save();
    ctx.fillStyle = 'rgba(3,4,12,0.86)';
    ctx.fillRect(0, PAD_TOP, W, H - PAD_TOP);
    for (var l = 0; l < LANES; l++) {
      var x = laneX(l) + 6, y = PAD_TOP + 8, pw = LW - 12, ph = H - PAD_TOP - 16;
      var on = down[l] ? 1 : glow[l];
      ctx.fillStyle = hexA(th.accent, 0.06 + on * 0.3);
      U.roundRect(ctx, x, y, pw, ph, 10); ctx.fill();
      ctx.strokeStyle = hexA(th.accent, 0.25 + on * 0.6);
      ctx.lineWidth = 1.5;
      U.roundRect(ctx, x, y, pw, ph, 10); ctx.stroke();
      ctx.font = '800 16px ' + MONO;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = on > 0.3 ? '#ffffff' : 'rgba(210,230,255,0.55)';
      ctx.fillText(LANE_LABELS[l] + ' ' + (l + 1), laneCX(l), y + ph / 2);
    }
    ctx.restore();
  }

  function heart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x - s * 0.1, y + s * 0.75, x, y + s);
    ctx.bezierCurveTo(x + s * 0.1, y + s * 0.75, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  // One rounded tile. o: { next, alpha, miss, flash, label }
  function drawTile(ctx, th, x, top, h, o) {
    ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    var g = ctx.createLinearGradient(0, top, 0, top + h);
    g.addColorStop(0, o.miss ? '#3a0c16' : th.tile[0]);
    g.addColorStop(1, o.miss ? '#8a1c30' : o.next ? th.tile[1] : hexA(th.tile[1], 0.7));
    ctx.fillStyle = g;
    ctx.shadowColor = o.miss ? '#ff4d6d' : o.next ? th.accent : th.edge;
    ctx.shadowBlur = o.next ? 18 : 8;
    U.roundRect(ctx, x + 3, top + 3, LW - 6, h - 6, 8); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = o.miss ? '#ff4d6d' : o.next ? th.accent : hexA(th.edge, 0.6);
    ctx.lineWidth = 2;
    U.roundRect(ctx, x + 3, top + 3, LW - 6, h - 6, 8); ctx.stroke();
    ctx.fillStyle = o.miss ? '#ff4d6d' : o.next ? th.accent : hexA(th.edge, 0.8);
    ctx.fillRect(x + 14, top + h - 14, LW - 28, 4);
    // cosmetic: accent tiles carry a neon bitcoin mark
    if (o.btc && !o.label) U.btc(ctx, x + LW / 2, top + h / 2 - 4, Math.min(16, h * 0.2), { coin: false, ink: o.miss ? '#ff4d6d' : th.hot, glow: 10 });
    if (o.flash > 0) {
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * o.flash;
      ctx.fillStyle = '#ffffff';
      U.roundRect(ctx, x + 3, top + 3, LW - 6, h - 6, 8); ctx.fill();
    }
    if (o.label) U.glowText(ctx, o.label, x + LW / 2, top + h / 2, 11, th.accent);
    ctx.restore();
  }

  // A hold: a long bar with a head cap at the bottom. `fill` 0..1 is progress.
  function drawHold(ctx, th, x, top, bottom, o) {
    var h = bottom - top;
    if (h < 4) return;
    ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    var col = o.miss ? '#ff4d6d' : o.broken ? '#ffa04d' : th.accent;
    var g = ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, hexA(o.miss ? '#8a1c30' : th.tile[1], 0.35));
    g.addColorStop(1, o.miss ? '#8a1c30' : th.tile[1]);
    ctx.fillStyle = g;
    ctx.shadowColor = col;
    ctx.shadowBlur = o.held ? 24 : o.next ? 16 : 8;
    U.roundRect(ctx, x + 3, top + 3, LW - 6, h - 6, 10); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = o.next || o.held ? col : hexA(col, 0.6);
    ctx.lineWidth = 2;
    U.roundRect(ctx, x + 3, top + 3, LW - 6, h - 6, 10); ctx.stroke();
    // centre rail
    ctx.fillStyle = hexA(col, o.held ? 0.9 : 0.45);
    ctx.fillRect(x + LW / 2 - 3, top + 10, 6, Math.max(0, h - 20));
    // head cap (or the glowing grip while held)
    if (o.held) {
      ctx.shadowColor = th.hot; ctx.shadowBlur = 20;
      ctx.fillStyle = th.hot;
      ctx.fillRect(x + 8, bottom - 12, LW - 16, 8);
    } else {
      ctx.fillStyle = col;
      ctx.fillRect(x + 12, bottom - 16, LW - 24, 6);
    }
    ctx.shadowBlur = 0;
    // tail cap
    ctx.fillStyle = hexA(col, 0.8);
    ctx.fillRect(x + 18, top + 6, LW - 36, 3);
    ctx.restore();
  }

  // Song title card: sits in the top band (tiles there are still far from the
  // hit line) so it never hides a tile you are about to play.
  function drawTitleCard(ctx, th, lines, a) {
    if (a <= 0) return;
    var y0 = 40, hh = 92;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(3,4,12,0.6)';
    U.roundRect(ctx, 24, y0, W - 48, hh, 12); ctx.fill();
    ctx.strokeStyle = hexA(th.accent, 0.7);
    ctx.lineWidth = 2;
    U.roundRect(ctx, 24, y0, W - 48, hh, 12); ctx.stroke();
    ctx.font = '700 10px ' + MONO;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = hexA(th.hot, 0.95);
    ctx.fillText(lines[0], W / 2, y0 + 17);
    U.glowText(ctx, lines[1], W / 2, y0 + 44, 16, th.accent);
    ctx.font = '700 11px ' + MONO;
    ctx.fillStyle = 'rgba(220,230,255,0.8)';
    ctx.fillText(lines[2], W / 2, y0 + 72);
    ctx.restore();
  }

  function drawPanel(ctx, th, lines, color) {
    ctx.save();
    ctx.fillStyle = 'rgba(3,4,12,0.8)';
    U.roundRect(ctx, 34, 170, W - 68, 60 + lines.length * 22, 14); ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    U.roundRect(ctx, 34, 170, W - 68, 60 + lines.length * 22, 14); ctx.stroke();
    U.glowText(ctx, lines[0], W / 2, 200, 16, color);
    ctx.font = '700 12px ' + MONO;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(225,235,255,0.9)';
    for (var i = 1; i < lines.length; i++) ctx.fillText(lines[i], W / 2, 212 + i * 22);
    ctx.restore();
  }

  /* ================================================================ create */
  function create(api) {
    var RUSH = api.mode === 'time';
    var inp = api.input, rng = api.rng;
    var t = 0;                                  // seconds of play
    var laneGlow = [0, 0, 0, 0];                // flash on press
    var laneMiss = [0, 0, 0, 0];                // red flash on a miss
    var lastPtr = null;                         // pointer sample for two-finger doubles

    /* ---------------------------------------------------- music clock sync
       The engine reports each scheduled 16th step with its audio time, so the
       exact song position is step/4 beats plus the audio time since. Our own
       dt clock follows it softly (and snaps after a stall).                 */
    var sync = { ok: false, step: 0, time: 0, sps: 0.13 };
    if (M()) M().onStep(function (info) { sync.ok = true; sync.step = info.step; sync.time = info.time; sync.sps = info.secPerStep; });
    function engineBeat() {
      if (api.ranked || !M() || !sync.ok) return null;   // ranked runs are replayed silently: no audio clock
      var c = XA.audio.context();
      if (!c || c.state !== 'running') return null;
      var age = c.currentTime - sync.time;
      if (age > 0.35) return null;               // stale: paused or the tab slept
      return (sync.step + age / sync.sps) / 4;
    }
    function pulse() { return M() ? M().pulse(6) : 0; }

    function laneHeld(l) { return inp.held(LANE_KEYS[l][0]) || inp.held(LANE_KEYS[l][1]); }
    function pointerLane() { return U.clamp(Math.floor(api.pointer().x / LW), 0, LANES - 1); }

    // Read lane presses this frame and hand them to `press(lane, source)`.
    // `second(lane)` gets a second finger landing while the first is down (the
    // kit tracks one pointer, so it shows up as a jump, not a new press).
    function readLanes(press, second) {
      for (var l = 0; l < LANES; l++) {
        if (inp.hit(LANE_KEYS[l][0]) || inp.hit(LANE_KEYS[l][1])) { laneGlow[l] = 1; press(l, 'key'); }
      }
      var p = api.pointer();
      if (inp.hit('hold') && p.x >= 0 && p.x <= W) {
        var pl = pointerLane();
        laneGlow[pl] = 1;
        press(pl, 'pointer');
      } else if (second && inp.held('hold') && lastPtr && p.moved !== lastPtr.moved && Math.abs(p.x - lastPtr.x) > LW * 0.6) {
        var sl = pointerLane();
        laneGlow[sl] = 1;
        second(sl);
      }
      lastPtr = { x: p.x, moved: p.moved };
      inp.takeSwipes();
    }
    function padsDown() {
      var d = [], pl = inp.held('hold') ? pointerLane() : -1;
      for (var l = 0; l < LANES; l++) d.push(laneHeld(l) || pl === l);
      return d;
    }
    function fadeGlows(dt) {
      for (var l = 0; l < LANES; l++) {
        laneGlow[l] = Math.max(0, laneGlow[l] - dt * 4);
        laneMiss[l] = Math.max(0, laneMiss[l] - dt * 2.5);
      }
    }
    function clash() {
      var m = M();
      if (m) {
        m.note('pluck', 2, { octave: 0, gain: 0.6, params: { cutoff: 900, decay: 0.5 } });
        m.note('pluck', 3, { octave: 0, gain: 0.5, params: { cutoff: 900, decay: 0.5 } });
        m.duck(0.6, 0.9);
      } else {
        api.audio.tone(110, 0.5, { type: 'sawtooth', vol: 0.28, slide: 0.5 });
        api.audio.tone(116, 0.5, { type: 'sawtooth', vol: 0.2, slide: 0.5 });
      }
    }

    return RUSH ? createRush() : createSongs();

    /* ============================================================ SONG RUN */
    function createSongs() {
      var songIdx = 0, lap = 1, song = null, theme = SONGS[0].theme;
      var notes = [], cursor = 0, holds = [];
      var clock = { beat: 0, bpm: 112 };
      var updated = false, songT = 0, endBeat = 0;
      var lives = START_LIVES, combo = 0, maxCombo = 0, count = 0;
      var tally = { perfect: 0, great: 0, good: 0, broken: 0, miss: 0 };
      var judged = 0;
      var dead = false, deadT = 0, deadReason = '', badLane = -1, overCalled = false;
      var lastInt = -1;

      startSong(0, 1, true);

      /* ------------------------------------------------------ song flow */
      function startSong(idx, lp, first) {
        songIdx = idx; lap = lp; song = SONGS[idx]; theme = song.theme;
        clock.bpm = lapBpm(song.bpm, lap);
        notes = buildChart(song, lap, rng);
        cursor = 0; holds = [];
        var last = notes[notes.length - 1];
        endBeat = last.beat + last.len + 1;
        songT = 0;
        sync.ok = false;
        clock.beat = -0.06 * clock.bpm / 60;     // the engine starts its first step ~60ms out
        var m = M();
        if (m) {
          lastInt = intensityWanted();
          m.play(engineSong(song, clock.bpm), { fade: first ? 1.2 : 0.6, intensity: lastInt });
        }
      }
      function nextSong() {
        lives = Math.min(MAX_LIVES, lives + 1);
        var idx = songIdx + 1, lp = lap;
        if (idx >= SONGS.length) { idx = 0; lp++; }
        startSong(idx, lp, false);
      }
      function intensityWanted() {
        return Math.round(U.clamp(0.3 + (lap - 1) * 0.15 + Math.min(combo, 40) / 40 * 0.6, 0, 1) * 10) / 10;
      }
      function syncIntensity() {
        var it = intensityWanted();
        if (it !== lastInt && M()) { lastInt = it; M().setIntensity(it); }
      }

      /* ---------------------------------------------------------- clock */
      function advanceClock(dt) {
        if (!updated) {
          updated = true;
          // no audio clock (muted device / no WebAudio): assume the 3 s countdown ran
          if (engineBeat() == null) clock.beat = 3 * clock.bpm / 60;
        }
        clock.beat += dt * clock.bpm / 60;
        var eb = engineBeat();
        if (eb == null) return;
        var err = eb - clock.beat;
        if (Math.abs(err) > 0.75) clock.beat = eb;
        else clock.beat += err * Math.min(1, dt * 5);
      }
      function secsUntil(n) { return (n.beat - clock.beat) * 60 / clock.bpm; }

      /* ---------------------------------------------------------- lead */
      function playLead(deg, loud) {
        var m = M(), L = song.lead;
        if (m) m.note(L.inst, deg, { octave: L.oct, gain: L.gain * (loud ? 1 : 0.85), params: L.params, dur: 0.18 });
        else api.audio.tone(220 * Math.pow(2, deg / 7), 0.3, { type: 'triangle', vol: 0.2 });
      }
      function playSustain(deg, beats) {
        var m = M(), S = song.sustain;
        var secs = beats * 60 / clock.bpm;
        if (m) m.note(S.inst, deg, { octave: S.oct, gain: S.gain, params: S.params, dur: secs + 0.04 });
        else api.audio.tone(220 * Math.pow(2, deg / 7), secs, { type: 'triangle', vol: 0.16 });
      }

      /* -------------------------------------------------------- targets */
      function skipResolved() {
        while (cursor < notes.length && notes[cursor].state !== 'wait' && notes[cursor].state !== 'part') cursor++;
      }
      function target() { skipResolved(); return notes[cursor] || null; }
      function following(n) {
        for (var i = notes.indexOf(n) + 1; i < notes.length; i++) if (notes[i].state === 'wait') return notes[i];
        return null;
      }
      function visible(n) { return n.beat - clock.beat <= LOOK_BEATS; }
      function remainingLane(n) {
        for (var i = 0; i < n.lanes.length; i++) if (n.hitLanes.indexOf(n.lanes[i]) < 0) return n.lanes[i];
        return n.lanes[0];
      }

      /* -------------------------------------------------------- scoring */
      function gradeFor(offset) {
        var a = Math.abs(offset);
        return a <= WIN.perfect ? 'perfect' : a <= WIN.great ? 'great' : 'good';
      }
      function judge(result) { tally[result]++; judged++; }
      function accuracy() {
        if (!judged) return 100;
        var s = 0;
        for (var k in tally) s += tally[k] * ACC_WEIGHT[k];
        return Math.round(s / judged * 100);
      }
      function bumpCombo() {
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        if (combo >= 10 && combo % 25 === 0) api.fx.text(W / 2, 128, combo + ' COMBO', theme.hot, 16);
        syncIntensity();
      }
      function breakCombo() { combo = 0; syncIntensity(); }
      function addPoints(base) { api.addScore(Math.round(base * multFor(combo))); }
      function popup(lanes, grade, early) {
        var x = 0;
        lanes.forEach(function (l) { x += laneCX(l); });
        x /= lanes.length;
        var col = grade === 'perfect' ? theme.hot : grade === 'great' ? theme.accent : grade === 'good' ? '#c8d0ff' : grade === 'miss' ? '#ff4d6d' : '#ffa04d';
        api.fx.text(U.clamp(x, 60, W - 60), HIT_Y - 70, GRADE_TEXT[early ? 'early' : grade], col, grade === 'perfect' ? 14 : 12);
      }
      function sparks(lane, grade) {
        var y = HIT_Y - 20;
        if (grade === 'perfect') api.fx.burst(laneCX(lane), y, theme.hot, 18, 190, 0.5);
        else api.fx.burst(laneCX(lane), y, theme.accent, 7, 130, 0.35);
      }

      /* ---------------------------------------------------------- taps */
      function press(lane, src) {
        if (dead) return;
        var n = target();
        if (!n) return;
        if (n.state === 'part') {
          if (lane === remainingLane(n)) { completeDouble(n, lane); return; }
          if (n.hitLanes.indexOf(lane) >= 0) return;         // same half again: ignore
          var f = following(n);
          if (f && visible(f) && f.lanes.indexOf(lane) >= 0) { splitDouble(n); n = f; }
          else { endRun('wrong', lane); return; }
        }
        if (!visible(n)) return;                             // nothing on screen yet
        if (n.lanes.indexOf(lane) < 0) { endRun('wrong', lane); return; }
        var offset = -secsUntil(n);                          // + late, - early
        var grade = gradeFor(offset);
        var early = offset < -WIN.good;
        count++;
        if (n.kind === 'tap') hitTap(n, lane, grade, early);
        else if (n.kind === 'hold') startHold(n, lane, src, grade, early);
        else startDouble(n, lane, grade, early);
      }
      // A second finger landing on the other half of a double.
      function secondFinger(lane) {
        var n = target();
        if (!dead && n && n.state === 'part' && lane === remainingLane(n)) completeDouble(n, lane);
      }

      function hitTap(n, lane, grade, early) {
        n.state = 'done'; n.grade = grade; n.fadeT = 0.001;
        bumpCombo();
        addPoints(POINTS[grade]);
        judge(grade);
        playLead(n.deg, grade === 'perfect');
        popup([lane], grade, early);
        sparks(lane, grade);
      }
      function startDouble(n, lane, grade, early) {
        n.state = 'part'; n.grade = grade; n.early = early; n.partT = t;
        n.hitLanes.push(lane);
        playLead(n.deg, grade === 'perfect');
        sparks(lane, grade);
      }
      function completeDouble(n, lane) {
        n.hitLanes.push(lane);
        n.state = 'done'; n.fadeT = 0.001;
        count++;
        bumpCombo();
        addPoints(POINTS[n.grade] * 2);
        judge(n.grade);
        playLead(n.deg - 2, n.grade === 'perfect');
        popup(n.lanes, n.grade, n.early);
        sparks(lane, n.grade);
        if (n.grade === 'perfect') api.fx.burst(W / 2, HIT_Y - 20, theme.accent, 12, 220, 0.5);
      }
      function splitDouble(n) {
        n.state = 'broken'; n.fadeT = 0.001;
        judge('broken');
        breakCombo();
        popup(n.lanes, 'split');
      }
      function startHold(n, lane, src, grade, early) {
        n.state = 'held'; n.grade = grade; n.lane = lane; n.src = src;
        n.tickBeat = Math.max(clock.beat, n.beat);
        n.susBeat = Math.max(clock.beat, n.beat);
        bumpCombo();
        addPoints(POINTS[grade]);
        popup([lane], grade, early);
        sparks(lane, grade);
        holds.push(n);
      }
      function stillHeld(h) {
        return laneHeld(h.lane) || (h.src === 'pointer' && inp.held('hold'));
      }
      function updateHolds() {
        for (var i = holds.length - 1; i >= 0; i--) {
          var h = holds[i], tail = h.beat + h.len;
          // lead note sustains in one-beat chunks while the lane is held
          if (clock.beat >= h.susBeat - 0.02 && h.susBeat < tail - 0.1) {
            playSustain(h.deg, Math.min(1, tail - h.susBeat));
            h.susBeat += 1;
          }
          while (h.tickBeat + HOLD_TICK_BEATS <= Math.min(clock.beat, tail)) {
            h.tickBeat += HOLD_TICK_BEATS;
            addPoints(HOLD_TICK_PTS);
          }
          if (clock.beat >= tail - HOLD_GRACE) {
            h.state = 'done'; h.fadeT = 0.001;
            addPoints(HOLD_DONE_PTS);
            judge(h.grade);
            api.fx.text(laneCX(h.lane), HIT_Y - 110, 'HOLD!', theme.hot, 12);
            api.fx.burst(laneCX(h.lane), HIT_Y - 20, theme.hot, 14, 170, 0.45);
            holds.splice(i, 1);
          } else if (!stillHeld(h)) {
            h.state = 'broken'; h.fadeT = 0.001;
            judge('broken');
            breakCombo();
            popup([h.lane], 'broken');
            holds.splice(i, 1);
          }
        }
      }

      /* -------------------------------------------------------- misses */
      function updateMisses() {
        for (var i = cursor; i < notes.length; i++) {
          var n = notes[i];
          if (n.beat - clock.beat > 2) break;
          if (n.state === 'part' && t - n.partT > DOUBLE_WIN) { splitDouble(n); continue; }
          if (n.state === 'wait' && -secsUntil(n) > WIN.good) missTile(n);
          if (dead) return;
        }
      }
      function missTile(n) {
        n.state = 'miss';
        judge('miss');
        breakCombo();
        lives--;
        n.lanes.forEach(function (l) { laneMiss[l] = 1; });
        popup(n.lanes, 'miss');
        api.shake(5);
        if (M()) M().note('pluck', -1, { octave: 0, gain: 0.35, params: { cutoff: 700, decay: 0.3 } });
        else api.audio.tone(140, 0.2, { type: 'sawtooth', vol: 0.15 });
        if (lives <= 0) endRun('lives', n.lanes[0]);
      }

      function endRun(reason, lane) {
        if (dead) return;
        dead = true; deadReason = reason; badLane = lane;
        api.shake(9);
        clash();
        api.setStatus(finalStatus());
      }
      function finalStatus() {
        return 'ACCURACY ' + accuracy() + '% - ' + tally.perfect + ' PERFECT / ' + tally.great + ' GREAT / ' +
          tally.good + ' GOOD / ' + tally.miss + ' MISS - BEST COMBO ' + maxCombo;
      }

      /* ======================================================== update */
      function update(dt) {
        t += dt;
        fadeGlows(dt);
        if (dead) {
          inp.takeSwipes();
          deadT += dt;
          if (deadT > 1.8 && !overCalled) { overCalled = true; api.gameOver(); }
          return;
        }
        advanceClock(dt);
        songT += dt;
        readLanes(press, secondFinger);
        if (dead) return;
        updateHolds();
        updateMisses();
        if (dead) return;
        notes.forEach(function (n) { if (n.fadeT > 0) n.fadeT += dt; });
        skipResolved();
        if (cursor >= notes.length && !holds.length && clock.beat >= endBeat) nextSong();
        api.setStatus('SONG ' + (songIdx + 1) + '/' + SONGS.length + ' - LAP ' + lap + ' - COMBO ' + combo +
          (multFor(combo) > 1 ? ' x' + multFor(combo) : '') + ' - ACC ' + accuracy() + '%');
      }

      /* ======================================================== render */
      function render(ctx) {
        var beat = updated ? clock.beat : (engineBeat() != null ? engineBeat() : clock.beat);
        var pl = pulse();
        var th = theme;
        drawBackdrop(ctx, th, W, H, t + (updated ? 0 : beat * 0.3), pl);
        drawLaneLines(ctx, th, W, H, laneGlow);
        // big translucent combo behind the tiles
        if (combo >= 3) {
          ctx.save();
          ctx.globalAlpha = 0.22 + pl * 0.1;
          U.glowText(ctx, String(combo), W / 2, 170, 44, th.accent);
          ctx.globalAlpha = 0.35;
          U.glowText(ctx, 'COMBO' + (multFor(combo) > 1 ? '  x' + multFor(combo) : ''), W / 2, 214, 11, th.hot);
          ctx.restore();
        }
        for (var l = 0; l < LANES; l++) if (laneMiss[l] > 0) {
          ctx.fillStyle = 'rgba(255,77,109,' + (laneMiss[l] * 0.28) + ')';
          ctx.fillRect(laneX(l), 0, LW, H);
        }
        if (dead && badLane >= 0) {
          ctx.fillStyle = 'rgba(255,77,109,' + (0.25 + Math.sin(t * 20) * 0.15) + ')';
          ctx.fillRect(laneX(badLane), 0, LW, H);
        }
        drawNotes(ctx, th, beat);
        drawHitLine(ctx, th, W, HIT_Y, pl);
        drawPads(ctx, th, padsDown(), laneGlow);
        drawHud(ctx, th, beat);
        // the first song's card already showed through the countdown
        var cardHold = lap === 1 && songIdx === 0 ? 1.0 : 2.6;
        var ca = songT < 0.3 && cardHold > 1 ? songT / 0.3 : songT > cardHold ? 1 - (songT - cardHold) / 0.5 : 1;
        if (!updated) ca = 1;
        drawTitleCard(ctx, th, ['SONG ' + (songIdx + 1) + ' OF ' + SONGS.length + (lap > 1 ? '  -  LAP ' + lap : ''),
          song.title, song.keyName + ' - ' + clock.bpm + ' BPM - ' + song.feel], U.clamp(ca, 0, 1));
        // the room's game-over card takes over once gameOver() is called
        if (dead && deadT > 0.5 && !overCalled) {
          drawPanel(ctx, th, [deadReason === 'wrong' ? 'WRONG TILE' : 'OUT OF LIVES',
            'ACCURACY ' + accuracy() + '%',
            tally.perfect + ' PERFECT  ' + tally.great + ' GREAT  ' + tally.good + ' GOOD',
            tally.miss + ' MISS  ' + tally.broken + ' BROKEN',
            'BEST COMBO ' + maxCombo], '#ff4d6d');
        }
      }
      function drawNotes(ctx, th, beat) {
        var tgt = null;
        for (var k = cursor; k < notes.length; k++) if (notes[k].state === 'wait' || notes[k].state === 'part') { tgt = notes[k]; break; }
        var from = Math.max(0, cursor - 16);
        for (var i = from; i < notes.length; i++) {
          var n = notes[i];
          var bottom = HIT_Y - (n.beat - beat) * PPB;
          if (bottom < -4) break;
          if (n.fadeT > 0.35) continue;
          var isNext = n === tgt;
          var fade = n.fadeT > 0 ? 1 - n.fadeT / 0.35 : 1;
          if (n.kind === 'hold') {
            var top = HIT_Y - (n.beat + n.len - beat) * PPB;
            if (top > H) continue;
            var held = n.state === 'held';
            drawHold(ctx, th, laneX(n.lanes[0]), top, held ? HIT_Y : bottom, {
              next: isNext, held: held, miss: n.state === 'miss', broken: n.state === 'broken',
              alpha: n.state === 'miss' ? 0.6 : n.state === 'done' ? fade : n.state === 'broken' ? 0.5 * fade : 1 });
            continue;
          }
          if (bottom - TAP_H > H) continue;
          var hitHere = n.state === 'done' || n.state === 'part';
          n.lanes.forEach(function (l) {
            var half = n.hitLanes.indexOf(l) >= 0;
            var gone = n.state === 'done' || (n.state === 'part' && half);
            drawTile(ctx, th, laneX(l), bottom - TAP_H, TAP_H, {
              next: isNext && !half, miss: n.state === 'miss',
              alpha: n.state === 'miss' ? 0.6 : gone ? 0.5 * fade : n.state === 'broken' ? 0.4 * fade : 1,
              flash: gone ? fade : 0, btc: n.kind === 'double' || i % 8 === 0 });
          });
          if (n.kind === 'double' && !(hitHere && n.state === 'done') && n.state !== 'broken') {
            // link bar between the two halves
            var a = Math.min(n.lanes[0], n.lanes[1]), b = Math.max(n.lanes[0], n.lanes[1]);
            ctx.save();
            ctx.globalAlpha = n.state === 'miss' ? 0.5 : 0.9;
            ctx.shadowColor = th.hot; ctx.shadowBlur = 10;
            ctx.fillStyle = n.state === 'miss' ? '#ff4d6d' : th.hot;
            ctx.fillRect(laneX(a) + LW - 4, bottom - TAP_H / 2 - 2, (b - a - 1) * LW + 8, 4);
            ctx.restore();
          }
        }
      }
      function drawHud(ctx, th, beat) {
        ctx.save();
        ctx.fillStyle = 'rgba(3,4,12,0.55)';
        ctx.fillRect(0, 0, W, 30);
        // song progress
        var first = INTRO_BARS * 4, prog = U.clamp((beat - first) / Math.max(1, endBeat - first), 0, 1);
        ctx.fillStyle = hexA(th.accent, 0.2);
        ctx.fillRect(0, 28, W, 2);
        ctx.fillStyle = th.accent;
        ctx.fillRect(0, 28, W * prog, 2);
        ctx.font = '800 11px ' + MONO;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = hexA(th.accent, 0.95);
        ctx.fillText(song.title + (lap > 1 ? '  L' + lap : ''), 10, 15);
        ctx.fillStyle = th.hot;
        for (var i = 0; i < MAX_LIVES; i++) {
          ctx.globalAlpha = i < lives ? 1 : 0.2;
          heart(ctx, W - 16 - i * 20, 7, 15);
        }
        ctx.restore();
      }

      return {
        update: update,
        render: render,
        // Read-only test hook: what is coming and how the run stands.
        debug: function () {
          var n = null, next = [];
          for (var i = cursor; i < notes.length && next.length < 6; i++) {
            var x = notes[i];
            if (x.state !== 'wait' && x.state !== 'part') continue;
            if (!n) n = x;
            next.push({ lane: x.state === 'part' ? remainingLane(x) : x.lanes[0], lanes: x.lanes.slice(), type: x.kind,
              dueIn: Math.round(secsUntil(x) * 1000) / 1000, len: Math.round(x.len * 60 / clock.bpm * 1000) / 1000 });
          }
          return {
            mode: api.mode, variant: api.variant, song: songIdx, songTitle: song.title, lap: lap, bpm: clock.bpm,
            beat: Math.round(clock.beat * 1000) / 1000, combo: combo, maxCombo: maxCombo, mult: multFor(combo),
            lives: lives, count: count, nextLane: n ? next[0].lane : -1, next: next, holding: holds.length,
            grades: { perfect: tally.perfect, great: tally.great, good: tally.good, broken: tally.broken, miss: tally.miss },
            accuracy: accuracy(), dead: dead, reason: deadReason
          };
        }
      };
    }

    /* ============================================================ RUSH 100 */
    function createRush() {
      var th = RUSH_THEME;
      var rows = [], hits = 0, scroll = 0, started = false, elapsed = 0;
      var done = false, doneT = 0, dnf = false, dnfT = 0, badLane = -1, ended = false;
      var lastInt = -1, prev = -1;
      // Row lanes: seeded, and a lane rarely repeats straight away.
      for (var i = 0; i < RUSH_TILES; i++) {
        var l;
        do { l = rng.int(LANES); } while (l === prev && rng() < 0.7);
        prev = l;
        rows.push({ lane: l, hitT: 0 });
      }
      if (M()) M().play(engineSong(RUSH_SONG, RUSH_BPM), { fade: 1.2, intensity: 0.2 });
      lastInt = 0.2;

      function press(lane) {
        if (done || dnf) return;
        var r = rows[hits];
        if (lane !== r.lane) {
          if (!started) return;                // a stray press before the start is forgiven
          dnf = true; badLane = lane;
          api.shake(9);
          clash();
          api.setStatus('RUSH 100 - DID NOT FINISH at ' + hits + '/' + RUSH_TILES);
          return;
        }
        started = true;
        r.hitT = t;
        hits++;
        var m = M();
        if (m) m.note('pluck', RUSH_LEAD[(hits - 1) % RUSH_LEAD.length], { chord: true, octave: 1, gain: 0.72, params: { decay: 0.36 } });
        else api.audio.tone(330 * Math.pow(2, RUSH_LEAD[(hits - 1) % RUSH_LEAD.length] / 7), 0.25, { type: 'triangle', vol: 0.2 });
        api.fx.burst(laneCX(lane), HIT_Y - RUSH_ROW / 2, hits % 10 === 0 ? th.hot : th.accent, hits % 10 === 0 ? 16 : 7, 150, 0.35);
        if (hits % 25 === 0 && hits < RUSH_TILES) api.fx.text(W / 2, 140, (RUSH_TILES - hits) + ' LEFT', th.hot, 16);
        var it = Math.round(U.clamp(0.2 + hits / RUSH_TILES * 0.8, 0, 1) * 10) / 10;
        if (it !== lastInt && m) { lastInt = it; m.setIntensity(it); }
        if (hits >= RUSH_TILES) {
          done = true;
          api.setScore(Math.round(elapsed * 100));
          api.setStatus('RUSH 100 - FINISHED in ' + elapsed.toFixed(2) + 's');
          if (m) m.stinger([{ deg: 0, at: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 4 }], { quantize: '8', inst: 'pluck', octave: 1, gain: 0.7 });
          api.fx.burst(W / 2, HIT_Y - 60, th.hot, 40, 260, 0.8);
        }
      }

      function update(dt) {
        t += dt;
        fadeGlows(dt);
        if (dnf) {
          inp.takeSwipes();
          dnfT += dt;
          if (dnfT > 1.3 && !ended) { ended = true; api.gameOver(); }
          return;
        }
        if (done) {
          inp.takeSwipes();
          doneT += dt;
          scroll += (hits - scroll) * Math.min(1, dt * 18);
          if (doneT > 1.6 && !ended) { ended = true; api.finish(); }
          return;
        }
        // Several lanes can be pressed inside one 16 ms frame by a fast player.
        // Resolve them in the order the tiles need, not in lane order, so a
        // correct quick burst is never judged as a wrong tap.
        var pressed = [];
        readLanes(function (lane) { pressed.push(lane); }, null);
        while (pressed.length && !done && !dnf) {
          var want = pressed.indexOf(rows[hits].lane);
          press(want >= 0 ? pressed.splice(want, 1)[0] : pressed.shift());
        }
        if (dnf || done) return;
        if (started) {
          elapsed += dt;
          api.setScore(Math.round(elapsed * 100));
        }
        scroll += (hits - scroll) * Math.min(1, dt * 18);
        api.setStatus('RUSH 100 - ' + (RUSH_TILES - hits) + ' LEFT - ' + elapsed.toFixed(2) + 's');
      }

      function render(ctx) {
        var pl = pulse();
        drawBackdrop(ctx, th, W, H, t, pl);
        drawLaneLines(ctx, th, W, H, laneGlow);
        if (dnf && badLane >= 0) {
          ctx.fillStyle = 'rgba(255,77,109,' + (0.25 + Math.sin(t * 20) * 0.15) + ')';
          ctx.fillRect(laneX(badLane), 0, LW, H);
        }
        // rows: the next one sits on the hit line, the rest stack upwards
        var lo = Math.max(0, Math.floor(scroll) - 2);
        for (var i = lo; i < Math.min(RUSH_TILES, lo + 8); i++) {
          var r = rows[i];
          var bottom = HIT_Y - (i - scroll) * RUSH_ROW;
          if (bottom < -4 || bottom - RUSH_ROW > H) continue;
          var hit = i < hits;
          var fade = hit ? Math.max(0, 1 - (t - r.hitT) / 0.3) : 1;
          if (hit && fade <= 0) continue;
          drawTile(ctx, th, laneX(r.lane), bottom - RUSH_ROW + 4, RUSH_ROW - 4, {
            next: i === hits, alpha: hit ? 0.5 * fade : 1, flash: hit ? fade : 0,
            label: i === 0 && !started ? 'START' : '', btc: (i + 1) % 10 === 0 });
        }
        // the finish line after tile 100
        var fy = HIT_Y - (RUSH_TILES - scroll) * RUSH_ROW;
        if (fy > 30 && fy < H) {
          for (var c = 0; c < 20; c++) {
            ctx.fillStyle = (c % 2) ? '#ffffff' : '#111111';
            ctx.fillRect(c * W / 20, fy - 8, W / 20, 8);
          }
        }
        drawHitLine(ctx, th, W, HIT_Y, pl);
        drawPads(ctx, th, padsDown(), laneGlow);
        // HUD: tiles left and the running time
        ctx.save();
        ctx.fillStyle = 'rgba(3,4,12,0.6)';
        ctx.fillRect(0, 0, W, 44);
        ctx.fillStyle = hexA(th.accent, 0.25);
        ctx.fillRect(0, 42, W, 2);
        ctx.fillStyle = th.accent;
        ctx.fillRect(0, 42, W * hits / RUSH_TILES, 2);
        ctx.restore();
        U.glowText(ctx, (RUSH_TILES - hits) + ' LEFT', 12, 22, 14, th.accent, 'left');
        U.glowText(ctx, elapsed.toFixed(2) + 's', W - 12, 22, 14, th.hot, 'right');
        if (!started && !dnf) {
          drawTitleCard(ctx, th, ['RUSH 100', 'HIT 100 TILES', 'clock starts on the first tap'], 1);
        }
        if (done && !ended) drawPanel(ctx, th, ['FINISHED', elapsed.toFixed(2) + ' SECONDS', (RUSH_TILES / Math.max(0.01, elapsed)).toFixed(1) + ' TILES PER SECOND'], th.hot);
        if (dnf && dnfT > 0.3 && !ended) drawPanel(ctx, th, ['DID NOT FINISH', 'WRONG TILE AT ' + hits + '/' + RUSH_TILES], '#ff4d6d');
      }

      return {
        update: update,
        render: render,
        // Read-only test hook.
        debug: function () {
          var next = [];
          for (var i = hits; i < Math.min(RUSH_TILES, hits + 4); i++) next.push({ lane: rows[i].lane, lanes: [rows[i].lane], type: 'tap', dueIn: 0 });
          return { mode: api.mode, variant: api.variant, left: RUSH_TILES - hits, count: hits, nextLane: hits < RUSH_TILES ? rows[hits].lane : -1,
            next: next, started: started, elapsed: Math.round(elapsed * 1000) / 1000, finished: done, dead: dnf };
        }
      };
    }
  }

  /* ======================================================= attract preview */
  // A little looping show: themes cycle, tiles (taps, a hold, a double) fall.
  var ATTRACT = [{ l: 1 }, { l: 2 }, { l: 0, d: 2 }, { l: 3 }, { l: 2, hold: 2 }, { l: 1 }, { l: 0 }, { l: 1, d: 3 }];
  function attract(ctx, w, h, t) {
    var themes = [SONGS[0].theme, SONGS[1].theme, SONGS[2].theme];
    var th = themes[Math.floor(t / 5) % themes.length];
    var beatT = t * 1.8, pl = Math.exp(-(beatT % 1) * 5);
    drawBackdrop(ctx, th, w, h, t, pl);
    drawLaneLines(ctx, th, w, h, null);
    var lw = w / 4, ppb = h * 0.3, hit = h * (HIT_Y / H), th_ = ppb * 0.42;
    var loop = ATTRACT.length;
    var first = Math.floor(beatT) - 1;
    for (var k = first; k < first + 5; k++) {
      var e = ATTRACT[((k % loop) + loop) % loop];
      var bottom = hit - (k - beatT) * ppb;
      var top = bottom - (e.hold ? e.hold * ppb : th_);
      var lanes = e.d != null ? [e.l, e.d] : [e.l];
      var passed = bottom > hit + 2;
      lanes.forEach(function (l) {
        ctx.save();
        ctx.globalAlpha = passed ? 0.3 : 1;
        ctx.fillStyle = th.tile[1];
        ctx.shadowColor = th.accent; ctx.shadowBlur = 10;
        ctx.fillRect(l * lw + 2, top + 2, lw - 4, bottom - top - 4);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = th.accent;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(l * lw + 2, top + 2, lw - 4, bottom - top - 4);
        if (e.hold) { ctx.fillStyle = th.accent; ctx.fillRect(l * lw + lw / 2 - 2, top + 6, 4, bottom - top - 12); }
        else if (e.d != null || ((k % 3) + 3) % 3 === 0) U.btc(ctx, l * lw + lw / 2, (top + bottom) / 2, Math.min(lw, bottom - top) * 0.2, { coin: false, ink: th.hot, glow: 8 });
        ctx.restore();
      });
      if (e.d != null && !passed) {
        ctx.fillStyle = th.hot;
        var a = Math.min(e.l, e.d), b = Math.max(e.l, e.d);
        ctx.fillRect(a * lw + lw - 2, bottom - th_ / 2 - 1.5, (b - a - 1) * lw + 4, 3);
      }
    }
    ctx.save();
    ctx.shadowColor = th.hot; ctx.shadowBlur = 8 + pl * 10;
    ctx.fillStyle = hexA(th.hot, 0.6 + pl * 0.4);
    ctx.fillRect(0, hit - 1.5, w, 3);
    ctx.restore();
    ctx.fillStyle = 'rgba(3,4,12,0.7)';
    ctx.fillRect(0, hit + 4, w, h - hit - 4);
    for (var l = 0; l < 4; l++) {
      ctx.fillStyle = hexA(th.accent, 0.12 + (l === ((Math.floor(beatT) % 4) + 4) % 4 ? pl * 0.4 : 0));
      ctx.fillRect(l * lw + 3, hit + 8, lw - 6, h - hit - 12);
    }
  }

  XA.registerGame({
    id: 'xa_tile_tap',
    order: 10,
    title: 'BlockBeat',
    tagline: 'Every tile is a note. Play the song.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP TILES ON THE LINE - HOLD THE LONG ONES',
    modeLabel: 'Songs',
    variants: [{ key: 'rush', label: 'Rush 100', mode: 'time', tagline: 'Hit 100 tiles. Fastest time wins.' }],
    controls: '\u2190 \u2193 \u2191 \u2192 or 1 2 3 4 for the four lanes \u00b7 click/tap a lane \u00b7 keep holding long tiles',
    create: create,
    attract: attract
  });
})(window);

/*
 * Xtrata Arcade cartridge #19 - REFLEX TAP (v2)
 *
 * Targets pop out of a 3x3 grid. Hit the good ones fast, leave the decoys.
 *
 * ROUNDS (score board, higher wins)
 *   The run is a chain of short rule rounds (SPEED, DECOYS, SHRINK, SEQUENCES,
 *   MOVERS, DOUBLES, FROST, MIXED). Each opens with a title card, ends after a
 *   set number of good hits and pays an accuracy bonus. After MIXED the cycle
 *   repeats faster. Three hearts: hitting a red, breaking a sequence or letting
 *   a good target escape costs one; a perfect round gives one back.
 *
 * HIT 50 (time board, lower wins)
 *   Cyan + red only. The next cyan appears the moment you hit the current one
 *   (its cell is outlined in advance). The clock starts on the first hit.
 *   Hitting a red or an empty cell ends the run (DID NOT FINISH).
 *
 * Controls: click / tap a cell, or keys 1-9 (top-left to bottom-right).
 * Contract game-id: xa_reflex_tap
 *
 * File map
 *   1. layout + palette           5. round mode (spawning, hits, round flow)
 *   2. TARGET KINDS table         6. hit 50 mode
 *   3. ROUNDS table               7. rendering (panel, grid, cards)
 *   4. music                      8. attract + registration
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-reflex-tap');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================== 1. layout + palette */
  var W = 400, H = 520, N = 3, CELL = 112, GAP = 12;
  var GRID = N * CELL + (N - 1) * GAP;          // 360
  var GX = (W - GRID) / 2, GY = 106;           // grid top-left
  var TS = 40;                                  // target half-size in a cell
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';

  var COL = {
    bg: '#060718', bg2: '#0b0d28', cell: '#10132e', ink: '#e8f0ff', dim: 'rgba(200,220,255,0.5)',
    cyan: '#3ff0ff', red: '#ff4d6d', gold: '#ffd23f', violet: '#b86bff', green: '#5dff9b',
    orange: '#ff9f3f', frost: '#bfefff', white: '#ffffff'
  };
  var ACCENT = COL.cyan;

  /* ================================================ 2. TARGET KINDS table
   * good        true = hit it; false = decoy (leave it)
   * lifeMul     how long it stays, relative to the round's base life
   * points      base points for a hit (before the streak multiplier)
   * expireHurts letting it vanish costs a heart
   * label/intro caption shown the first time the kind appears ("NEW: ...")
   */
  var KINDS = {
    normal: { good: true, color: COL.cyan, lifeMul: 1, points: 10, expireHurts: true,
      label: 'CYAN', intro: null, miss: 'TOO SLOW' },
    red: { good: false, color: COL.red, lifeMul: 1.3, points: 0, expireHurts: false,
      label: 'RED', intro: 'NEVER HIT RED' },
    gold: { good: true, color: COL.gold, lifeMul: 0.7, points: 0, expireHurts: false,   // scores 3x a cyan
      label: 'GOLD STAR', intro: 'QUICK! WORTH x3' },
    shrink: { good: true, color: COL.violet, lifeMul: 1.15, points: 10, expireHurts: true,
      label: 'SHRINKER', intro: 'HIT IT EARLY FOR MORE', miss: 'SHRUNK AWAY' },
    mover: { good: true, color: COL.green, lifeMul: 2.3, points: 25, expireHurts: true,
      label: 'MOVER', intro: 'HOPS ON THE BEAT - FOLLOW THE ARROW', miss: 'GOT AWAY' },
    seq: { good: true, color: COL.orange, lifeMul: 2.6, points: 15, expireHurts: true,
      label: 'SEQUENCE', intro: 'HIT 1 - 2 - 3 IN ORDER', miss: 'TOO SLOW' },
    'double': { good: true, color: COL.cyan, lifeMul: 1.35, points: 20, expireHurts: true,
      label: 'DOUBLE', intro: 'LINKED PAIR - HIT BOTH FAST', miss: 'BOTH!', window: 0.75 },
    frost: { good: false, color: COL.frost, lifeMul: 1.25, points: 0, expireHurts: false,
      label: 'FROST', intro: 'FROST RING FREEZES YOUR HANDS', freeze: 0.9 }
  };
  var SEQ_BONUS = 30, PAIR_BONUS = 20, PAIR_SNAP = 0.25;

  /* ======================================================= 3. ROUNDS table
   * One cycle = these rounds in order; later cycles repeat them faster.
   * goal   good hits needed to clear the round
   * spawn  seconds between spawns (divided by the cycle speed)
   * life   base seconds a target stays (x kind.lifeMul, / speed)
   * maxOn  most spawn units on the board at once (a group counts as one)
   * mix    spawn weights per kind
   */
  var ROUNDS = [
    { rule: 'SPEED', desc: 'HIT THE CYAN - FAST', goal: 12, spawn: 0.8, life: 1.35, maxOn: 2,
      mix: { normal: 9, gold: 1 } },
    { rule: 'DECOYS', desc: 'LEAVE THE RED ALONE', goal: 12, spawn: 0.72, life: 1.3, maxOn: 3,
      mix: { normal: 6, red: 3, gold: 1 } },
    { rule: 'SHRINK', desc: 'EARLY HITS SCORE MORE', goal: 12, spawn: 0.78, life: 1.35, maxOn: 3,
      mix: { shrink: 6, normal: 2, red: 2 } },
    { rule: 'SEQUENCES', desc: 'NUMBERS IN ORDER', goal: 15, spawn: 1.0, life: 1.3, maxOn: 2,
      mix: { seq: 4, normal: 3, red: 1 } },
    { rule: 'MOVERS', desc: 'CATCH THE HOPPERS', goal: 12, spawn: 0.9, life: 1.3, maxOn: 3,
      mix: { mover: 4, normal: 3, red: 2 } },
    { rule: 'DOUBLES', desc: 'PAIRS - HIT BOTH', goal: 14, spawn: 0.95, life: 1.3, maxOn: 2,
      mix: { 'double': 4, normal: 3, red: 2 } },
    { rule: 'FROST', desc: 'CYAN WITH A RING IS A TRAP', goal: 12, spawn: 0.72, life: 1.3, maxOn: 3,
      mix: { normal: 6, frost: 3, red: 1 } },
    { rule: 'MIXED', desc: 'EVERYTHING AT ONCE', goal: 15, spawn: 0.72, life: 1.3, maxOn: 3,
      mix: { normal: 4, red: 2, gold: 1, shrink: 2, mover: 1, seq: 1, 'double': 1, frost: 1 } }
  ];
  var CARD_SECS = 1.6, FIRST_CARD_SECS = 1.2, CLEAR_SECS = 1.7;
  var CYCLE_SPEEDUP = 0.22;

  function roundInfo(no) {
    var idx = (no - 1) % ROUNDS.length, cycle = Math.floor((no - 1) / ROUNDS.length);
    var def = ROUNDS[idx];
    return {
      no: no, idx: idx, cycle: cycle, def: def,
      speed: 1 + cycle * CYCLE_SPEEDUP + idx * 0.015,
      goal: def.goal + Math.min(3, cycle),
      seqLen: cycle >= 1 ? 4 : 3,
      bpm: Math.min(152, 116 + (no - 1) * 3)
    };
  }

  /* HIT 50 rules */
  var HIT50_GOAL = 50;
  function hit50Reds(hits) { return Math.min(3, 1 + Math.floor(hits / 15)); }

  /* ============================================================ 4. music */
  // Taps walk this pentatonic phrase, each one landing on the next 16th.
  var PHRASE = [0, 2, 4, 3, 2, 4, 5, 7, 4, 5, 7, 6, 5, 4, 2, 1];
  var SEQ_DEG = [0, 2, 4, 7, 9];

  // Metronome groove in D major pentatonic; streak and rounds add layers.
  function song() {
    return {
      bpm: 116, key: 62, scale: 'pentatonic', chords: [0, 4, 3, 1], seed: 19,
      tracks: [
        { name: 'click', inst: 'hat', layer: 0, gain: 0.34, pattern: 'X...x...x...x...' },
        { name: 'tock', inst: 'marimba', layer: 0, gain: 0.2, octave: 2, pattern: '0 . . . . . . . . . . . . . . .' },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.55, pattern: 'x.......x.......' },
        { name: 'bass', inst: 'bass', layer: 0.3, gain: 0.4, chord: true, octave: -2, params: { cutoff: 800 },
          pattern: '0 . . 0 . . 0 . . . 0 . 3 . . .' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.4, pattern: '....x.......x...' },
        { name: 'shaker', inst: 'shaker', layer: 0.6, gain: 0.3, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'pad', inst: 'pad', layer: 0.75, gain: 0.26, chord: true, octave: -1,
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 3, steps: 16 }] : null; } },
        { name: 'kick2', inst: 'kick', layer: 0.9, gain: 0.4, pattern: '......x.......x.' },
        { name: 'sparkle', inst: 'bell', layer: 0.95, gain: 0.12, chord: true, octave: 1,
          pattern: '4 . . 2 . . 7 . . . 4 . 2 . . .' }
      ]
    };
  }

  /* ============================================ shared drawing helpers */
  function star(ctx, cx, cy, r, points, inner) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / points, rr = i % 2 ? r * inner : r;
      if (i) ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      else ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function sign(v) { return v > 0 ? 1 : v < 0 ? -1 : 0; }
  function heart(ctx, hx, hy, k) {
    ctx.beginPath();
    ctx.moveTo(hx, hy + 8 * k);
    ctx.bezierCurveTo(hx - 16 * k, hy - 4 * k, hx - 8 * k, hy - 16 * k, hx, hy - 6 * k);
    ctx.bezierCurveTo(hx + 8 * k, hy - 16 * k, hx + 16 * k, hy - 4 * k, hx, hy + 8 * k);
    ctx.fill();
  }
  function label(ctx, text, x, y, size, color, align, weight) {
    ctx.font = (weight || 700) + ' ' + size + 'px ' + MONO;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  /*
   * Draw one target centred on (cx, cy) with half-size s. Every kind has its
   * own SHAPE so it reads without colour: square+dot (cyan), square+X (red),
   * star (gold), shrinking square in a dashed frame (shrink), diamond+arrow
   * (mover), numbered circle (sequence), square+two pips (double), square
   * inside a spiky ring (frost).
   * o: { remain 0..1, n (sequence number), dir {x,y} (mover), hop 0..1 }
   */
  function drawTarget(ctx, kind, cx, cy, s, o) {
    o = o || {};
    var k = KINDS[kind], col = k.color;
    ctx.save();
    ctx.shadowColor = col;
    ctx.shadowBlur = s * 0.5;
    ctx.fillStyle = col;
    if (kind === 'gold') {
      star(ctx, cx, cy, s * 1.08, 5, 0.48); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      star(ctx, cx, cy, s * 0.42, 5, 0.48); ctx.fill();
    } else if (kind === 'seq') {
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.95, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.95 - 5, 0, Math.PI * 2); ctx.stroke();
      label(ctx, String(o.n || 1), cx, cy + 2, Math.round(s * 1.05), '#1a0c00', 'center', 900);
    } else if (kind === 'mover') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 1.05); ctx.lineTo(cx + s * 1.05, cy);
      ctx.lineTo(cx, cy + s * 1.05); ctx.lineTo(cx - s * 1.05, cy);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      var d = o.dir || { x: 1, y: 0 };
      ctx.strokeStyle = 'rgba(0,30,10,' + (0.45 + 0.5 * (o.hop || 0)) + ')';
      ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      var px = -d.y, py = d.x, a = s * 0.42;
      ctx.beginPath();
      ctx.moveTo(cx - d.x * a * 0.4 + px * a, cy - d.y * a * 0.4 + py * a);
      ctx.lineTo(cx + d.x * a * 0.7, cy + d.y * a * 0.7);
      ctx.lineTo(cx - d.x * a * 0.4 - px * a, cy - d.y * a * 0.4 - py * a);
      ctx.stroke();
    } else if (kind === 'shrink') {
      var r = Math.max(0.14, o.remain == null ? 1 : o.remain);
      ctx.shadowBlur = 0;
      ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(184,107,255,0.6)';
      U.roundRect(ctx, cx - s, cy - s, s * 2, s * 2, 12); ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = s * 0.5;
      var ss = s * r;
      U.roundRect(ctx, cx - ss, cy - ss, ss * 2, ss * 2, Math.max(3, 12 * r)); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(2, ss * 0.3), 0, Math.PI * 2); ctx.fill();
    } else {
      // square-bodied kinds: normal, red, double, frost
      U.roundRect(ctx, cx - s, cy - s, s * 2, s * 2, 12); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      if (kind === 'red') {
        ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineCap = 'round';
        var q = s * 0.42;
        ctx.beginPath(); ctx.moveTo(cx - q, cy - q); ctx.lineTo(cx + q, cy + q);
        ctx.moveTo(cx + q, cy - q); ctx.lineTo(cx - q, cy + q); ctx.stroke();
      } else if (kind === 'double') {
        ctx.beginPath(); ctx.arc(cx - s * 0.3, cy, s * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + s * 0.3, cy, s * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        U.roundRect(ctx, cx - s + 4, cy - s + 4, s * 2 - 8, s * 2 - 8, 9); ctx.stroke();
      } else if (kind === 'frost') {
        // snowflake core + spiky ice ring around the (cyan-looking) block
        ctx.strokeStyle = 'rgba(10,40,70,0.55)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (var f = 0; f < 3; f++) {
          var fa = f * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(fa) * s * 0.4, cy - Math.sin(fa) * s * 0.4);
          ctx.lineTo(cx + Math.cos(fa) * s * 0.4, cy + Math.sin(fa) * s * 0.4);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(230,250,255,0.95)'; ctx.lineWidth = 2.5;
        ctx.shadowColor = '#e8fbff'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(cx, cy, s * 1.22, 0, Math.PI * 2); ctx.stroke();
        for (var sp = 0; sp < 10; sp++) {
          var sa = sp * Math.PI / 5 + (o.spin || 0);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(sa) * s * 1.1, cy + Math.sin(sa) * s * 1.1);
          ctx.lineTo(cx + Math.cos(sa) * s * 1.4, cy + Math.sin(sa) * s * 1.4);
          ctx.stroke();
        }
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, s * 0.33, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ============================================================ create */
  function create(api) {
    var rng = api.rng;
    var HIT50 = api.mode === 'time';
    var inp = api.input;
    var t = 0;                                   // game clock (s)

    /* ---------- shared run state ---------- */
    var hits = 0, streak = 0, bestStreak = 0, hearts = 3;
    var lastMs = 0, msSum = 0, msCount = 0;

    /* ---------- visuals (Math.random is fine here) ---------- */
    var rings = [];                              // expanding hit rings
    var cellPulse = [], cellBad = [];
    for (var ci = 0; ci < N * N; ci++) { cellPulse.push(0); cellBad.push(0); }
    var flashT = 0, flashCol = COL.white;

    /* ---------- round-mode state ---------- */
    var R = null;                                // roundInfo() of the current round
    var phase = 'card', phaseT = 0;              // card | play | clear | over
    var targets = [], groups = [], nextId = 1;
    var spawnT = 0, rHits = 0, rMiss = 0;
    var frozenT = 0, overT = 0;
    var seen = {}, captions = [], clearInfo = null;

    /* ---------- hit-50 state ---------- */
    var cur = -1, nxt = -1, reds = [], redBorn = [];
    var started = false, elapsed = 0, curBorn = 0;
    var done = false, dnf = false, badCell = -1, endT = 0, ended = false;

    /* ---------- music ---------- */
    var phraseAt = 0, lastI = -1, lastBpm = 116, filtered = false;
    if (M()) M().play(song(), { fade: 1, intensity: HIT50 ? 0.1 : 0 });

    function setIntensity(v) {
      var m = M();
      if (!m) return;
      v = Math.round(U.clamp(v, 0, 1) * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
    }
    function setBpm(bpm) {
      var m = M();
      bpm = Math.round(bpm);
      if (!m || bpm === lastBpm) return;
      lastBpm = bpm;
      m.setTempo(bpm, 2);
    }
    function syncMusic() {
      if (HIT50) {
        setIntensity(0.1 + hits / HIT50_GOAL * 0.9);
        setBpm(120 + Math.floor(hits / 10) * 6);
      } else if (R) {
        setIntensity(streak / 24 + (R.no - 1) * 0.05);
      }
    }
    // Each good hit plays the next note of the phrase on the 16th grid.
    function musicHit(kind, n, second) {
      var m = M();
      if (!m) { api.audio.tone(520 + Math.min(streak, 20) * 25, 0.06, { type: 'square', vol: 0.14 }); return; }
      if (kind === 'seq') {
        m.note('pluck', SEQ_DEG[(n - 1) % SEQ_DEG.length], { quantize: '16', octave: 1, gain: 0.75 });
        m.note('marimba', SEQ_DEG[(n - 1) % SEQ_DEG.length], { quantize: '16', octave: 2, gain: 0.3 });
      } else {
        var deg = PHRASE[phraseAt++ % PHRASE.length];
        m.note('pluck', deg, { quantize: '16', octave: 1, gain: 0.75 });
        if (kind === 'gold') m.note('bell', deg, { quantize: '16', octave: 2, gain: 0.45 });
        if (kind === 'mover') m.note('marimba', deg + 2, { quantize: '16', octave: 1, gain: 0.35 });
        if (kind === 'shrink') m.note('bell', deg + 4, { quantize: '16', octave: 1, gain: 0.25 });
        if (second) m.note('bell', deg + 2, { quantize: '16', octave: 2, gain: 0.4 });
      }
      syncMusic();
    }
    // Miss = muted low note + duck; the phrase restarts.
    function musicMiss() {
      var m = M();
      if (m) {
        m.note('bass', -5, { octave: -2, dur: 0.12, gain: 0.7, params: { cutoff: 260, q: 2 } });
        m.duck(0.45, 0.6);
        phraseAt = 0;
        syncMusic();
      } else api.audio.tone(150, 0.25, { type: 'sawtooth', vol: 0.22, slide: 0.6 });
    }
    function musicStray() { api.audio.tone(120, 0.04, { type: 'square', vol: 0.05 }); }
    function musicCard() {
      var m = M();
      if (!m) { api.audio.arp([523, 659, 784], 0.07, { type: 'square', vol: 0.1 }); return; }
      m.stinger([{ deg: 0, at: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4, steps: 3 }], { quantize: 'beat', inst: 'bell', octave: 1, gain: 0.35 });
    }
    function musicClear(acc) {
      var m = M();
      var n = acc >= 1 ? 5 : acc >= 0.85 ? 4 : 3, seq = [];
      for (var i = 0; i < n; i++) seq.push({ deg: SEQ_DEG[i], at: i, steps: i === n - 1 ? 4 : 1 });
      if (m) m.stinger(seq, { quantize: '8', inst: 'pluck', octave: 1, gain: 0.7 });
      else api.audio.arp([523, 659, 784, 1047].slice(0, n - 1), 0.08, { type: 'square', vol: 0.12 });
    }
    function musicFreeze(on) {
      var m = M();
      if (on === filtered) return;
      filtered = on;
      if (!m) { if (on) api.audio.tone(1800, 0.3, { type: 'sine', vol: 0.1, slide: 0.4 }); return; }
      m.setFilter(on ? 650 : 18000, on ? 0.08 : 0.5);
      if (on) m.note('bell', 9, { octave: 2, gain: 0.4 });
    }

    /* ---------- grid geometry + input ---------- */
    function cellX(i) { return GX + (i % N) * (CELL + GAP); }
    function cellY(i) { return GY + Math.floor(i / N) * (CELL + GAP); }
    function centre(i) { return { x: cellX(i) + CELL / 2, y: cellY(i) + CELL / 2 }; }
    function cellAtPoint(px, py) {
      var c = Math.floor((px - GX) / (CELL + GAP)), r = Math.floor((py - GY) / (CELL + GAP));
      if (c < 0 || c >= N || r < 0 || r >= N) return -1;
      // ignore taps that land in the gap between cells
      if (px - cellX(r * N + c) > CELL || py - cellY(r * N + c) > CELL) return -1;
      return r * N + c;
    }
    // Every cell pressed this frame (keys 1-9 and one pointer tap), no repeats.
    function readPresses() {
      var out = [];
      for (var k = 1; k <= 9; k++) if (inp.hit('k' + k)) out.push(k - 1);
      if (inp.hit('hold')) {
        var p = api.pointer(), c = cellAtPoint(p.x, p.y);
        if (c >= 0 && out.indexOf(c) < 0) out.push(c);
      }
      return out;
    }

    /* ---------- shared scoring feedback ---------- */
    function mult() { return 1 + Math.min(4, Math.floor(streak / 8)); }
    function noteReaction(ms) {
      lastMs = ms; msSum += ms; msCount++;
    }
    function hitFeedback(cell, col, ms, text) {
      var c = centre(cell);
      rings.push({ x: c.x, y: c.y, t: 0, max: 0.45, col: col, r0: TS * 0.8, r1: TS * 2.1 });
      cellPulse[cell] = 1;
      api.fx.burst(c.x, c.y, col, 16, 170, 0.5);
      if (text) api.fx.text(c.x, c.y - 30, text, col === COL.cyan ? COL.white : col, 12);
      if (ms != null) api.fx.text(c.x, c.y + 26, ms + 'ms', '#9fb3ff', 8);
      if (streak > 0 && streak % 10 === 0) {
        flashT = 0.35; flashCol = streak % 30 === 0 ? COL.gold : COL.cyan;
        // Hit 50 counts down in the panel instead; its streak is just the hit count
        if (!HIT50) api.fx.text(W / 2, GY + GRID / 2 + 12, 'STREAK ' + streak, flashCol, 16);
        api.shake(3);
      }
    }
    function missFeedback(cell, why) {
      cellBad[cell] = 0.6;
      api.shake(7);
      var c = centre(cell);
      api.fx.burst(c.x, c.y, COL.red, 20, 180, 0.6);
      if (why) api.fx.text(c.x, c.y - 40, why, COL.red, 11);
    }

    /* ==================================================== 5. ROUND MODE */
    function startRound(no) {
      R = roundInfo(no);
      phase = 'card'; phaseT = 0;
      targets = []; groups = [];
      rHits = 0; rMiss = 0; frozenT = 0;
      musicFreeze(false);
      setBpm(R.bpm);
      syncMusic();
      musicCard();
    }
    function cardSecs() { return R.no === 1 ? FIRST_CARD_SECS : CARD_SECS; }

    function targetAt(cell) {
      for (var i = 0; i < targets.length; i++) if (targets[i].cell === cell) return targets[i];
      return null;
    }
    function freeCells() {
      var out = [];
      for (var i = 0; i < N * N; i++) if (!targetAt(i)) out.push(i);
      return out;
    }
    function takeRandom(list) { return list.splice(Math.floor(rng() * list.length), 1)[0]; }
    function unitsOnBoard() {
      var n = groups.length;
      for (var i = 0; i < targets.length; i++) if (!targets[i].group) n++;
      return n;
    }
    function pickKind(mix) {
      var total = 0, key;
      for (key in mix) total += mix[key];
      var roll = rng() * total;
      for (key in mix) { roll -= mix[key]; if (roll < 0) return key; }
      return 'normal';
    }
    function lifeFor(kind) { return R.def.life * KINDS[kind].lifeMul / R.speed; }
    function hopEvery() { return 2 * 60 / R.bpm; }   // movers hop every 2 beats

    function makeTarget(kind, cell, life, group, n) {
      var tg = { id: nextId++, kind: kind, cell: cell, from: cell, slide: 1, born: t, age: 0, life: life,
        group: group || null, n: n || 0, hopT: 0, next: -1 };
      targets.push(tg);
      if (!seen[kind]) {
        seen[kind] = true;
        if (KINDS[kind].intro) captions.push({ kind: kind, t: 2.6 });
      }
      return tg;
    }
    // Pick an orthogonal free neighbour for a mover's next hop (-1 = none).
    function pickHop(cell) {
      var r = Math.floor(cell / N), c = cell % N, opts = [];
      if (r > 0) opts.push(cell - N);
      if (r < N - 1) opts.push(cell + N);
      if (c > 0) opts.push(cell - 1);
      if (c < N - 1) opts.push(cell + 1);
      opts = opts.filter(function (i) { return !targetAt(i); });
      return opts.length ? opts[Math.floor(rng() * opts.length)] : -1;
    }

    function spawnUnit() {
      var free = freeCells();
      if (!free.length) return;
      var kind = pickKind(R.def.mix);
      var need = kind === 'seq' ? R.seqLen : kind === 'double' ? 2 : 1;
      if (free.length < need) kind = 'normal';
      if (kind === 'seq' || kind === 'double') {
        var g = { kind: kind, size: need, next: 1, hit: 0, windowT: 0, lastHit: t, firstHitT: 0 };
        var life = lifeFor(kind) * (kind === 'seq' ? need / 3 : 1);
        for (var i = 1; i <= need; i++) makeTarget(kind, takeRandom(free), life, g, i);
        groups.push(g);
        return;
      }
      var tg = makeTarget(kind, takeRandom(free), lifeFor(kind));
      if (kind === 'mover') tg.next = pickHop(tg.cell);
    }

    function removeTarget(tg) {
      var i = targets.indexOf(tg);
      if (i >= 0) targets.splice(i, 1);
    }
    function removeGroup(g) {
      targets = targets.filter(function (x) { return x.group !== g; });
      var i = groups.indexOf(g);
      if (i >= 0) groups.splice(i, 1);
    }
    function isGoodNow(tg) {
      if (!KINDS[tg.kind].good) return false;
      return tg.kind !== 'seq' || tg.group.next === tg.n;
    }
    function goodCells() {
      var list = targets.filter(isGoodNow).map(function (x) { return x.cell; });
      return list;
    }

    // Lose a heart (or, at 0, end the run).
    function hurt(cell, why) {
      if (phase !== 'play') return;
      hearts = Math.max(0, hearts - 1);
      streak = 0;
      rMiss++;
      missFeedback(cell, why);
      musicMiss();
      if (hearts <= 0) { phase = 'over'; overT = 0; }
    }
    function stray(cell) {
      rMiss++;
      streak = 0;
      cellBad[cell] = 0.25;
      musicStray();
      syncMusic();
    }
    function freeze(tg) {
      var c = centre(tg.cell);
      frozenT = KINDS.frost.freeze;
      streak = 0;
      rMiss++;
      removeTarget(tg);
      api.fx.burst(c.x, c.y, COL.frost, 26, 200, 0.7);
      api.fx.text(c.x, c.y - 36, 'FROZEN!', COL.frost, 12);
      api.shake(4);
      musicFreeze(true);
      syncMusic();
    }

    // Points for a good hit, before the streak multiplier.
    function pointsFor(tg) {
      var k = KINDS[tg.kind], remain = U.clamp(1 - tg.age / tg.life, 0, 1);
      if (tg.kind === 'normal') return k.points + Math.round(20 * remain);
      if (tg.kind === 'gold') return (KINDS.normal.points + Math.round(20 * remain)) * 3;
      if (tg.kind === 'shrink') return k.points + Math.round(50 * remain * remain);
      if (tg.kind === 'mover') return k.points + Math.round(15 * remain);
      if (tg.kind === 'seq') return k.points * tg.n;
      return k.points;
    }

    function goodHit(tg) {
      var g = tg.group;
      var from = g && g.kind === 'seq' ? Math.max(tg.born, g.lastHit) : tg.born;
      var ms = Math.round((t - from) * 1000);
      streak++; hits++; rHits++;
      bestStreak = Math.max(bestStreak, streak);
      noteReaction(ms);
      var pts = pointsFor(tg) * mult();
      var second = false, bonus = 0, bonusText = null;
      if (g && g.kind === 'seq') {
        g.next++; g.lastHit = t;
        if (g.next > g.size) { bonus = SEQ_BONUS * mult(); bonusText = 'IN ORDER +' + bonus; }
      } else if (g && g.kind === 'double') {
        g.hit++;
        if (g.hit === 1) { g.windowT = KINDS['double'].window; g.firstHitT = t; }
        else {
          second = true;
          bonus = PAIR_BONUS * mult() * (t - g.firstHitT <= PAIR_SNAP ? 2 : 1);
          bonusText = (t - g.firstHitT <= PAIR_SNAP ? 'SNAP! +' : 'PAIR +') + bonus;
        }
      }
      api.addScore(pts + bonus);
      hitFeedback(tg.cell, KINDS[tg.kind].color, ms, '+' + pts);
      if (bonusText) api.fx.text(W / 2, GY + GRID / 2 - 34, bonusText, KINDS[tg.kind].color, 13);
      removeTarget(tg);
      if (g && ((g.kind === 'seq' && g.next > g.size) || (g.kind === 'double' && g.hit >= 2))) removeGroup(g);
      musicHit(tg.kind, tg.n, second);
      if (rHits >= R.goal) endRound();
    }

    function pressCell(cell) {
      var tg = targetAt(cell);
      if (!tg) { stray(cell); return; }
      if (tg.kind === 'red') { removeTarget(tg); hurt(cell, 'NOT THAT ONE'); return; }
      if (tg.kind === 'frost') { freeze(tg); return; }
      if (tg.kind === 'seq' && tg.group.next !== tg.n) {
        var g = tg.group;
        removeGroup(g);
        hurt(cell, 'IN ORDER!');
        return;
      }
      goodHit(tg);
    }
    // A fast player can press several cells inside one frame. Resolve the
    // ones that are good right now first (so 1-2-3 or both halves of a pair
    // pressed together always count), then the rest in press order.
    function resolvePresses(list) {
      while (list.length && phase === 'play' && frozenT <= 0) {
        var pick = 0;
        for (var i = 0; i < list.length; i++) {
          var tg = targetAt(list[i]);
          if (tg && isGoodNow(tg)) { pick = i; break; }
        }
        pressCell(list.splice(pick, 1)[0]);
      }
    }

    function updateMover(tg, dt) {
      tg.hopT += dt;
      if (tg.hopT < hopEvery()) return;
      tg.hopT = 0;
      if (tg.next < 0 || targetAt(tg.next)) tg.next = pickHop(tg.cell);
      if (tg.next < 0) return;
      tg.from = tg.cell; tg.cell = tg.next; tg.slide = 0;
      tg.next = pickHop(tg.cell);
    }
    function expire(tg) {
      var k = KINDS[tg.kind];
      if (tg.group) removeGroup(tg.group); else removeTarget(tg);
      if (k.expireHurts) hurt(tg.cell, k.miss || 'TOO SLOW');
    }
    function updateTargets(dt) {
      var i, list = targets.slice();
      for (i = 0; i < list.length; i++) {
        var tg = list[i];
        if (targets.indexOf(tg) < 0) continue;     // removed with its group
        tg.age += dt;
        if (tg.slide < 1) tg.slide = Math.min(1, tg.slide + dt / 0.14);
        if (tg.kind === 'mover') updateMover(tg, dt);
        if (tg.age >= tg.life) { expire(tg); if (phase !== 'play') return; }
      }
      // a pair must be finished within its window once the first half is hit
      for (i = groups.length - 1; i >= 0; i--) {
        var g = groups[i];
        if (!g || g.kind !== 'double' || g.hit !== 1) continue;
        g.windowT -= dt;
        if (g.windowT <= 0) {
          var left = targets.filter(function (x) { return x.group === g; })[0];
          removeGroup(g);
          hurt(left ? left.cell : 4, 'BOTH!');
          if (phase !== 'play') return;
        }
      }
    }
    function updateSpawns(dt) {
      spawnT -= dt;
      if (!goodCells().length) spawnT = Math.min(spawnT, 0.22);
      if (spawnT > 0 || unitsOnBoard() >= R.def.maxOn) return;
      spawnUnit();
      var into = rHits / R.goal;                 // a little faster through the round
      spawnT = R.def.spawn / R.speed * (1 - 0.2 * into) * (0.75 + rng() * 0.5);
    }

    function endRound() {
      var acc = rHits / Math.max(1, rHits + rMiss);
      var perfect = rMiss === 0;
      var bonus = Math.round(150 * acc * acc * R.speed) + (perfect ? 100 : 0);
      targets.forEach(function (x) {
        var c = centre(x.cell);
        api.fx.burst(c.x, c.y, KINDS[x.kind].color, 6, 90, 0.35);
      });
      targets = []; groups = [];
      api.addScore(bonus);
      var gained = perfect && hearts < 3;
      if (gained) hearts++;
      clearInfo = { acc: acc, bonus: bonus, perfect: perfect, gained: gained };
      phase = 'clear'; phaseT = 0;
      frozenT = 0; musicFreeze(false);
      musicClear(acc);
    }

    function updateRounds(dt) {
      phaseT += dt;
      if (phase === 'over') {
        overT += dt;
        if (overT > 1.2 && !ended) { ended = true; api.gameOver(); }
        return;
      }
      if (phase === 'card') {
        readPresses();
        if (phaseT >= cardSecs()) { phase = 'play'; phaseT = 0; spawnT = 0.15; }
      } else if (phase === 'clear') {
        readPresses();
        if (phaseT >= CLEAR_SECS) startRound(R.no + 1);
      } else if (phase === 'play') {
        if (frozenT > 0) { frozenT -= dt; if (frozenT <= 0) { frozenT = 0; musicFreeze(false); } }
        var list = readPresses();
        if (frozenT > 0) {
          if (list.length) api.audio.tone(2400, 0.03, { type: 'sine', vol: 0.05 });
        } else resolvePresses(list);
        if (phase !== 'play') return;
        updateTargets(dt);
        if (phase !== 'play') return;
        updateSpawns(dt);
        if (captions.length) { captions[0].t -= dt; if (captions[0].t <= 0) captions.shift(); }
      }
      api.setStatus('ROUND ' + R.no + ' \u00b7 ' + R.def.rule + ' \u00b7 HEARTS ' + hearts +
        ' \u00b7 STREAK ' + streak + (mult() > 1 ? ' \u00b7 x' + mult() : ''));
    }

    /* ==================================================== 6. HIT 50 MODE */
    // Random cell not in `avoid` (and not a red).
    function hit50Pick(avoid) {
      var opts = [];
      for (var i = 0; i < N * N; i++) if (avoid.indexOf(i) < 0 && reds.indexOf(i) < 0) opts.push(i);
      return opts[Math.floor(rng() * opts.length)];
    }
    // Reds never sit on the current or the upcoming target.
    function hit50PlaceRed(slot) {
      var avoid = [cur, nxt].concat(reds.filter(function (r, i) { return i !== slot; }));
      var opts = [];
      for (var i = 0; i < N * N; i++) if (avoid.indexOf(i) < 0) opts.push(i);
      if (!opts.length) return;
      reds[slot] = opts[Math.floor(rng() * opts.length)];
      redBorn[slot] = t;
    }
    function hit50Init() {
      cur = Math.floor(rng() * N * N);
      nxt = hit50Pick([cur]);
      curBorn = 0;
      for (var i = 0; i < hit50Reds(0); i++) hit50PlaceRed(i);
    }
    function hit50Advance() {
      cur = nxt;
      curBorn = t;
      nxt = hit50Pick([cur]);
      var want = hit50Reds(hits);
      while (reds.length < want) hit50PlaceRed(reds.length);
      // one red relocates after every hit (keeps the board alive)
      if (reds.length) hit50PlaceRed(hits % reds.length);
    }
    function hit50Dnf(cell, why) {
      dnf = true; badCell = cell; endT = 0;
      missFeedback(cell, why);
      musicMiss();
      api.setStatus('HIT 50 - DID NOT FINISH at ' + hits + '/' + HIT50_GOAL);
    }
    function hit50Press(cell) {
      if (cell !== cur) { hit50Dnf(cell, reds.indexOf(cell) >= 0 ? 'RED!' : 'WRONG CELL'); return; }
      var ms = started ? Math.round((t - curBorn) * 1000) : null;
      if (!started) { started = true; elapsed = 0; }
      hits++; streak++;
      bestStreak = Math.max(bestStreak, streak);
      if (ms != null) noteReaction(ms);
      hitFeedback(cell, COL.cyan, ms, null);
      musicHit('normal', 0, false);
      if (hits % 10 === 0 && hits < HIT50_GOAL) api.fx.text(W / 2, GY - 8, (HIT50_GOAL - hits) + ' LEFT', COL.gold, 14);
      if (hits >= HIT50_GOAL) {
        done = true; endT = 0;
        api.setScore(Math.round(elapsed * 100));
        api.setStatus('HIT 50 - FINISHED in ' + elapsed.toFixed(2) + 's');
        var m = M();
        if (m) m.stinger([{ deg: 0, at: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 4 }], { quantize: '8', inst: 'pluck', octave: 1, gain: 0.7 });
        api.fx.burst(W / 2, GY + GRID / 2, COL.gold, 40, 260, 0.8);
        flashT = 0.4; flashCol = COL.gold;
        return;
      }
      hit50Advance();
    }
    function updateHit50(dt) {
      if (dnf) {
        endT += dt;
        if (endT > 1.3 && !ended) { ended = true; api.gameOver(); }
        return;
      }
      if (done) {
        endT += dt;
        if (endT > 1.5 && !ended) { ended = true; api.finish(); }
        return;
      }
      // Same-frame presses: take the current target first, then the one that
      // replaces it, and so on; anything left over is a wrong press.
      var list = readPresses();
      while (list.length && !done && !dnf) {
        var want = list.indexOf(cur);
        hit50Press(want >= 0 ? list.splice(want, 1)[0] : list.shift());
      }
      if (done || dnf) return;
      if (started) {
        elapsed += dt;
        api.setScore(Math.round(elapsed * 100));
      }
      api.setStatus('HIT 50 - ' + (HIT50_GOAL - hits) + ' LEFT - ' + (started ? elapsed.toFixed(2) + 's' : 'clock starts on your first hit'));
    }

    /* ============================================================ start */
    if (HIT50) hit50Init(); else startRound(1);

    /* ======================================================= 7. RENDER */
    function drawBackdrop(ctx, pl) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, COL.bg2); g.addColorStop(1, COL.bg);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // grid glow breathing with the beat
      ctx.save();
      ctx.shadowColor = ACCENT; ctx.shadowBlur = 18 + 26 * pl;
      ctx.strokeStyle = 'rgba(63,240,255,' + (0.18 + 0.3 * pl) + ')'; ctx.lineWidth = 2;
      U.roundRect(ctx, GX - 8, GY - 8, GRID + 16, GRID + 16, 20); ctx.stroke();
      ctx.restore();
    }
    function drawCells(ctx, pl) {
      for (var i = 0; i < N * N; i++) {
        var x = cellX(i), y = cellY(i), p = cellPulse[i];
        var grow = p * 5;
        ctx.fillStyle = COL.cell;
        U.roundRect(ctx, x - grow, y - grow, CELL + grow * 2, CELL + grow * 2, 16); ctx.fill();
        if (p > 0) {
          ctx.fillStyle = 'rgba(63,240,255,' + (p * 0.22) + ')';
          U.roundRect(ctx, x - grow, y - grow, CELL + grow * 2, CELL + grow * 2, 16); ctx.fill();
        }
        if (cellBad[i] > 0) {
          ctx.fillStyle = 'rgba(255,77,109,' + (cellBad[i] * 0.55) + ')';
          U.roundRect(ctx, x, y, CELL, CELL, 16); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(63,240,255,' + (0.12 + 0.22 * pl + p * 0.5) + ')'; ctx.lineWidth = 2;
        U.roundRect(ctx, x - grow, y - grow, CELL + grow * 2, CELL + grow * 2, 16); ctx.stroke();
        label(ctx, String(i + 1), x + 13, y + 14, 11, 'rgba(200,220,255,0.3)', 'center');
      }
    }
    function drawRing(ctx, cx, cy, r, remain, col, width) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = width;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = width;
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * U.clamp(remain, 0, 1)); ctx.stroke();
      ctx.restore();
    }
    function targetPos(tg) {
      var a = centre(tg.from), b = centre(tg.cell), e = 1 - Math.pow(1 - tg.slide, 3);
      return { x: U.lerp(a.x, b.x, e), y: U.lerp(a.y, b.y, e) };
    }
    function drawRoundTargets(ctx) {
      // tethers between the halves of each pair
      groups.forEach(function (g) {
        if (g.kind !== 'double') return;
        var two = targets.filter(function (x) { return x.group === g; });
        if (two.length < 2) return;
        var a = centre(two[0].cell), b = centre(two[1].cell);
        ctx.save();
        ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 40;
        ctx.strokeStyle = 'rgba(63,240,255,0.55)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.restore();
      });
      targets.forEach(function (tg) {
        var p = targetPos(tg), k = KINDS[tg.kind];
        var pop = Math.min(1, tg.age / 0.08);
        var remain = 1 - tg.age / tg.life;
        var s = TS * (0.6 + 0.4 * pop);
        var o = { remain: remain, n: tg.n, spin: t * 0.6 };
        if (tg.kind === 'mover') {
          var nx = tg.next >= 0 ? centre(tg.next) : null, cc = centre(tg.cell);
          o.dir = nx ? { x: sign(nx.x - cc.x), y: sign(nx.y - cc.y) } : { x: 0, y: -1 };
          o.hop = U.clamp(tg.hopT / hopEvery(), 0, 1);
          // telegraph the next cell during the second half of the beat
          if (nx && o.hop > 0.5) {
            ctx.save();
            ctx.globalAlpha = (o.hop - 0.5) * 1.4;
            ctx.strokeStyle = COL.green; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
            U.roundRect(ctx, nx.x - TS, nx.y - TS, TS * 2, TS * 2, 12); ctx.stroke();
            ctx.restore();
          }
        }
        // sequence targets that are not next wait dimmed
        ctx.save();
        if (tg.kind === 'seq' && tg.group.next !== tg.n) ctx.globalAlpha = 0.55;
        drawTarget(ctx, tg.kind, p.x, p.y, s, o);
        ctx.restore();
        if (tg.kind === 'double' && tg.group.hit === 1) {
          drawRing(ctx, p.x, p.y, TS + 11, tg.group.windowT / k.window, COL.white, 4);
        } else if (tg.kind !== 'shrink') {
          drawRing(ctx, p.x, p.y, TS + 11, remain, tg.kind === 'red' || tg.kind === 'frost' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)', 3);
        }
      });
    }
    function drawHit50Targets(ctx) {
      if (!done && nxt >= 0 && !dnf) {
        var n = centre(nxt);
        ctx.save();
        ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(63,240,255,0.45)'; ctx.lineWidth = 2;
        U.roundRect(ctx, n.x - TS, n.y - TS, TS * 2, TS * 2, 12); ctx.stroke();
        ctx.restore();
        label(ctx, 'NEXT', n.x, n.y, 9, 'rgba(63,240,255,0.5)', 'center');
      }
      reds.forEach(function (cell, i) {
        var c = centre(cell), pop = Math.min(1, (t - redBorn[i]) / 0.1);
        drawTarget(ctx, 'red', c.x, c.y, TS * (0.6 + 0.4 * pop));
      });
      if (!done && cur >= 0) {
        var c = centre(cur), pop2 = started ? Math.min(1, (t - curBorn) / 0.06) : 1;
        drawTarget(ctx, 'normal', c.x, c.y, TS * (0.7 + 0.3 * pop2));
      }
    }
    function drawRings(ctx) {
      rings.forEach(function (r) {
        var k = r.t / r.max;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = r.col; ctx.lineWidth = 5 * (1 - k) + 1;
        ctx.shadowColor = r.col; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(r.x, r.y, U.lerp(r.r0, r.r1, 1 - Math.pow(1 - k, 2)), 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
    }
    function drawFrozen(ctx) {
      if (frozenT <= 0) return;
      var k = frozenT / KINDS.frost.freeze;
      ctx.save();
      ctx.fillStyle = 'rgba(170,230,255,' + (0.14 + 0.1 * k) + ')';
      U.roundRect(ctx, GX - 8, GY - 8, GRID + 16, GRID + 16, 20); ctx.fill();
      ctx.strokeStyle = 'rgba(230,250,255,0.8)'; ctx.lineWidth = 3;
      U.roundRect(ctx, GX - 8, GY - 8, GRID + 16, GRID + 16, 20); ctx.stroke();
      ctx.restore();
      U.glowText(ctx, 'FROZEN', W / 2, GY + GRID / 2 - 8, 18, COL.frost);
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(W / 2 - 70, GY + GRID / 2 + 16, 140, 6);
      ctx.fillStyle = COL.frost; ctx.fillRect(W / 2 - 70, GY + GRID / 2 + 16, 140 * k, 6);
    }

    /* ---------- top panel ---------- */
    function panelBox(ctx, col) {
      ctx.save();
      ctx.fillStyle = 'rgba(16,19,46,0.9)';
      U.roundRect(ctx, 12, 10, W - 24, 80, 14); ctx.fill();
      ctx.strokeStyle = col; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5;
      U.roundRect(ctx, 12, 10, W - 24, 80, 14); ctx.stroke();
      ctx.restore();
    }
    function drawHearts(ctx, cx, cy) {
      for (var l = 0; l < 3; l++) {
        ctx.save();
        ctx.fillStyle = l < hearts ? COL.red : 'rgba(255,77,109,0.18)';
        if (l < hearts) { ctx.shadowColor = COL.red; ctx.shadowBlur = 10; }
        heart(ctx, cx - 30 + l * 30, cy, 0.8);
        ctx.restore();
      }
    }
    function avgMs() { return msCount ? Math.round(msSum / msCount) : 0; }
    function drawRoundPanel(ctx) {
      var ruleCol = ruleColour(R.def);
      panelBox(ctx, ruleCol);
      // left: round + rule
      label(ctx, 'ROUND', 28, 26, 10, COL.dim, 'left');
      U.glowText(ctx, String(R.no), 30, 50, 18, COL.ink, 'left');
      label(ctx, R.def.rule, 28, 76, 11, ruleCol, 'left', 800);
      // centre: hearts + round progress
      drawHearts(ctx, W / 2, 32);
      var bw = 120, bx = W / 2 - bw / 2, by = 58;
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; U.roundRect(ctx, bx, by, bw, 8, 4); ctx.fill();
      ctx.fillStyle = ruleCol; U.roundRect(ctx, bx, by, Math.max(8, bw * Math.min(1, rHits / R.goal)), 8, 4); ctx.fill();
      label(ctx, Math.min(rHits, R.goal) + ' / ' + R.goal, W / 2, 78, 10, COL.dim);
      // right: streak, accuracy, reaction
      var acc = rHits + rMiss ? Math.round(rHits / (rHits + rMiss) * 100) : 100;
      label(ctx, 'STREAK ' + streak + (mult() > 1 ? '  x' + mult() : ''), W - 28, 28, 11, mult() > 1 ? COL.gold : COL.ink, 'right', 800);
      label(ctx, 'ACC ' + acc + '%', W - 28, 50, 11, acc >= 90 ? COL.green : acc >= 70 ? COL.ink : COL.red, 'right');
      label(ctx, lastMs ? 'LAST ' + lastMs + 'ms' : 'LAST --', W - 28, 72, 10, '#9fb3ff', 'right');
    }
    function drawHit50Panel(ctx) {
      panelBox(ctx, COL.cyan);
      label(ctx, 'HIT 50', 28, 26, 10, COL.dim, 'left');
      U.glowText(ctx, String(HIT50_GOAL - hits), 30, 52, 20, done ? COL.gold : COL.cyan, 'left');
      label(ctx, 'LEFT', 28, 78, 10, COL.dim, 'left');
      U.glowText(ctx, elapsed.toFixed(2), W / 2, 42, 18, dnf ? COL.red : done ? COL.gold : COL.ink);
      label(ctx, started ? 'SECONDS' : 'CLOCK STARTS ON FIRST HIT', W / 2, 72, 10, COL.dim);
      label(ctx, lastMs ? 'LAST ' + lastMs + 'ms' : 'LAST --', W - 28, 36, 10, '#9fb3ff', 'right');
      label(ctx, msCount ? 'AVG ' + avgMs() + 'ms' : 'AVG --', W - 28, 60, 10, '#9fb3ff', 'right');
    }
    function ruleColour(def) {
      var best = 'normal', bw = -1;
      for (var k in def.mix) if (k !== 'red' && k !== 'normal' && def.mix[k] > bw) { best = k; bw = def.mix[k]; }
      if (def.rule === 'DECOYS') best = 'red';
      if (def.rule === 'SPEED' || def.rule === 'MIXED') best = 'normal';
      return best === 'normal' ? COL.cyan : KINDS[best].color;
    }

    /* ---------- bottom strip: NEW caption or legend ---------- */
    function drawFooter(ctx) {
      var y = GY + GRID + 26;
      if (!HIT50 && phase === 'play' && captions.length) {
        var c = captions[0], k = KINDS[c.kind];
        var a = Math.min(1, c.t * 3, (2.6 - c.t) * 6);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgba(16,19,46,0.95)';
        U.roundRect(ctx, 22, y - 19, W - 44, 38, 12); ctx.fill();
        ctx.strokeStyle = k.color; ctx.lineWidth = 2;
        U.roundRect(ctx, 22, y - 19, W - 44, 38, 12); ctx.stroke();
        drawTarget(ctx, c.kind, 46, y, 11, { remain: 0.7, n: 1, spin: t });
        label(ctx, 'NEW: ' + k.label, 66, y - 7, 11, k.color, 'left', 900);
        label(ctx, k.intro, 66, y + 8, 9, COL.ink, 'left');
        ctx.restore();
        return;
      }
      var text = HIT50 ? 'HIT CYAN \u00b7 RED OR EMPTY = DNF' : 'HIT GOOD TARGETS \u00b7 NEVER RED OR FROST';
      label(ctx, text, W / 2, y, 10, 'rgba(200,220,255,0.45)');
    }

    /* ---------- round title card + clear card ---------- */
    function cardVeil(ctx, a) {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(4,5,16,0.82)';
      U.roundRect(ctx, GX - 8, GY - 8, GRID + 16, GRID + 16, 20); ctx.fill();
      ctx.restore();
    }
    function drawTitleCard(ctx) {
      var secs = cardSecs(), a = Math.min(1, phaseT * 6, (secs - phaseT) * 5);
      var col = ruleColour(R.def), cy = GY + GRID / 2;
      cardVeil(ctx, a);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      label(ctx, 'ROUND ' + R.no + (R.cycle ? '  \u00b7  CYCLE ' + (R.cycle + 1) : ''), W / 2, cy - 78, 12, COL.dim);
      var slide = (1 - Math.min(1, phaseT * 4)) * 30;
      U.glowText(ctx, R.def.rule, W / 2 + slide, cy - 44, 22, col);
      label(ctx, R.def.desc, W / 2, cy - 10, 11, COL.ink);
      // the kinds this round uses, drawn small so the shapes are learnt
      var keys = [];
      for (var k in R.def.mix) keys.push(k);
      var gap = 46, x0 = W / 2 - (keys.length - 1) * gap / 2;
      keys.forEach(function (k, i) {
        drawTarget(ctx, k, x0 + i * gap, cy + 34, 13, { remain: 0.75, n: 1, dir: { x: 1, y: 0 }, spin: t });
      });
      label(ctx, 'HIT ' + R.goal + (R.speed > 1.05 ? '  \u00b7  SPEED x' + R.speed.toFixed(2) : ''), W / 2, cy + 78, 11, COL.gold);
      ctx.restore();
    }
    function drawClearCard(ctx) {
      var a = Math.min(1, phaseT * 6, (CLEAR_SECS - phaseT) * 5), cy = GY + GRID / 2;
      cardVeil(ctx, a);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      U.glowText(ctx, 'ROUND CLEAR', W / 2, cy - 50, 18, COL.green);
      label(ctx, 'ACCURACY ' + Math.round(clearInfo.acc * 100) + '%', W / 2, cy - 12, 13, COL.ink, 'center', 800);
      U.glowText(ctx, '+' + U.fmt(clearInfo.bonus), W / 2, cy + 20, 16, COL.gold);
      if (clearInfo.perfect) label(ctx, clearInfo.gained ? 'PERFECT!  +1 HEART' : 'PERFECT!', W / 2, cy + 56, 12, COL.red, 'center', 900);
      ctx.restore();
    }
    function drawEndBanner(ctx, text, col, sub) {
      var cy = GY + GRID / 2;
      cardVeil(ctx, 1);
      U.glowText(ctx, text, W / 2, cy - 10, 18, col);
      if (sub) label(ctx, sub, W / 2, cy + 22, 12, COL.ink, 'center', 800);
    }

    /* ======================================================= instance */
    return {
      // Read-only test hook. `good` = cells that are safe to hit right now,
      // in the order they should be hit.
      debug: function () {
        var good;
        if (HIT50) good = done || dnf || cur < 0 ? [] : [cur];
        else if (phase !== 'play' || frozenT > 0) good = [];
        else {
          good = goodCells();
          var seqs = targets.filter(function (x) { return x.kind === 'seq' && isGoodNow(x); }).map(function (x) { return x.cell; });
          good = seqs.concat(good.filter(function (c) { return seqs.indexOf(c) < 0; }));
        }
        return {
          mode: api.mode, variant: api.variant, phase: HIT50 ? (dnf ? 'dnf' : done ? 'done' : 'play') : phase,
          round: R ? R.no : 0, rule: R ? R.def.rule : 'HIT 50', cycle: R ? R.cycle : 0, goal: R ? R.goal : HIT50_GOAL,
          roundHits: rHits, roundMiss: rMiss,
          targets: HIT50
            ? (cur >= 0 && !done ? [{ cell: cur, kind: 'normal' }] : []).concat(reds.map(function (c) { return { cell: c, kind: 'red' }; }))
            : targets.map(function (x) { return { cell: x.cell, kind: x.kind, n: x.n }; }),
          good: good, hearts: hearts, hits: hits, streak: streak, frozen: frozenT > 0,
          dead: HIT50 ? dnf : phase === 'over', done: done,
          left: HIT50 ? HIT50_GOAL - hits : null, next: HIT50 ? nxt : null, reds: HIT50 ? reds.slice() : null,
          elapsed: elapsed, started: started, lastMs: lastMs, score: api.getScore()
        };
      },

      update: function (dt) {
        t += dt;
        inp.takeSwipes();
        // visual timers
        for (var i = 0; i < N * N; i++) {
          if (cellPulse[i] > 0) cellPulse[i] = Math.max(0, cellPulse[i] - dt * 4);
          if (cellBad[i] > 0) cellBad[i] = Math.max(0, cellBad[i] - dt * 2);
        }
        for (var r = rings.length - 1; r >= 0; r--) { rings[r].t += dt; if (rings[r].t >= rings[r].max) rings.splice(r, 1); }
        if (flashT > 0) flashT = Math.max(0, flashT - dt);
        if (HIT50) updateHit50(dt); else updateRounds(dt);
      },

      render: function (ctx) {
        var pl = M() ? M().pulse(6) : 0;
        drawBackdrop(ctx, pl);
        drawCells(ctx, pl);
        if (HIT50) drawHit50Targets(ctx); else drawRoundTargets(ctx);
        drawRings(ctx);
        if (!HIT50) drawFrozen(ctx);
        if (HIT50) drawHit50Panel(ctx); else drawRoundPanel(ctx);
        drawFooter(ctx);
        if (!HIT50 && phase === 'card') drawTitleCard(ctx);
        if (!HIT50 && phase === 'clear') drawClearCard(ctx);
        if (!HIT50 && phase === 'over') drawEndBanner(ctx, 'OUT OF HEARTS', COL.red, 'ROUND ' + R.no + ' \u00b7 BEST STREAK ' + bestStreak);
        if (HIT50 && dnf) {
          if (badCell >= 0) {
            ctx.fillStyle = 'rgba(255,77,109,' + (0.3 + Math.sin(t * 20) * 0.15) + ')';
            U.roundRect(ctx, cellX(badCell), cellY(badCell), CELL, CELL, 16); ctx.fill();
          }
          drawEndBanner(ctx, 'DID NOT FINISH', COL.red, hits + ' / ' + HIT50_GOAL);
        }
        if (HIT50 && done) drawEndBanner(ctx, 'FINISHED', COL.gold, elapsed.toFixed(2) + 's  \u00b7  AVG ' + avgMs() + 'ms');
        if (flashT > 0) {
          ctx.save();
          ctx.globalAlpha = flashT * 0.45;
          ctx.fillStyle = flashCol;
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }
      }
    };
  }

  /* ===================================================== 8. ATTRACT */
  var ATTRACT_KINDS = ['gold', 'seq', 'shrink', 'mover', 'double', 'frost'];
  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, COL.bg2); g.addColorStop(1, COL.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var size = Math.min(w, h) * 0.27, gap = size * 0.12;
    var ox = (w - size * 3 - gap * 2) / 2, oy = (h - size * 3 - gap * 2) / 2;
    var beat = t * 2.2, step = Math.floor(beat), frac = beat - step;
    var lit = (step * 4 + 1) % 9, bad = (step * 7 + 3) % 9;
    var special = (step * 5 + 6) % 9;
    if (special === lit || special === bad) special = (special + 1) % 9;
    if (bad === lit) bad = (bad + 2) % 9;
    var kind = ATTRACT_KINDS[Math.floor(step / 3) % ATTRACT_KINDS.length];
    var pl = Math.exp(-frac * 5);
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 8 + 14 * pl;
    ctx.strokeStyle = 'rgba(63,240,255,' + (0.2 + 0.3 * pl) + ')'; ctx.lineWidth = 1.5;
    U.roundRect(ctx, ox - gap * 0.6, oy - gap * 0.6, size * 3 + gap * 3.2, size * 3 + gap * 3.2, size * 0.16); ctx.stroke();
    ctx.restore();
    for (var i = 0; i < 9; i++) {
      var x = ox + (i % 3) * (size + gap), y = oy + Math.floor(i / 3) * (size + gap);
      ctx.fillStyle = COL.cell;
      U.roundRect(ctx, x, y, size, size, size * 0.14); ctx.fill();
      ctx.strokeStyle = 'rgba(63,240,255,' + (0.1 + 0.2 * pl) + ')'; ctx.lineWidth = 1;
      U.roundRect(ctx, x, y, size, size, size * 0.14); ctx.stroke();
      var s = size * 0.34, cx = x + size / 2, cy = y + size / 2;
      if (i === lit) {
        drawTarget(ctx, 'normal', cx, cy, s * (frac < 0.7 ? 1 : 0.4 + 0.6 * (1 - (frac - 0.7) / 0.3)));
        if (frac > 0.7) {
          ctx.save();
          ctx.globalAlpha = 1 - (frac - 0.7) / 0.3;
          ctx.strokeStyle = COL.cyan; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx, cy, s * (1 + (frac - 0.7) * 5), 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }
      } else if (i === bad) drawTarget(ctx, 'red', cx, cy, s);
      else if (i === special) drawTarget(ctx, kind, cx, cy, s * 0.9, { remain: 1 - frac * 0.8, n: 1 + step % 3, dir: { x: 1, y: 0 }, spin: t });
    }
  }

  XA.registerGame({
    id: 'xa_reflex_tap',
    order: 19,
    title: 'Reflex Tap',
    tagline: 'Hit the cyan. Never the red.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP THE GOOD TARGETS \u00b7 NEVER RED OR FROST',
    controls: 'Click / tap \u00b7 or keys 1\u20139 (top-left to bottom-right)',
    modeLabel: 'Rounds',
    variants: [{ key: 'hit50', label: 'Hit 50', mode: 'time', tagline: 'Hit 50 targets. Fastest time wins.' }],
    create: create,
    attract: attract
  });
})(window);

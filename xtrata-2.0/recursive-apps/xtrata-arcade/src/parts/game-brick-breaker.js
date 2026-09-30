/*
 * Xtrata Arcade cartridge #6 — BRICK BREAKER (v2)
 * Twenty hand-made walls with a boss core every fifth level. Special bricks
 * (steel, bombs, movers, gold), seven power-ups including laser, catch and
 * fireball, and bricks that shatter.
 *
 * Music: every level gets its own theme generated from a template (key,
 * mode, progression and a seeded melody), and the arrangement fills in as
 * the wall empties. Consecutive hits climb the scale on the 16th-note grid
 * so a good combo *plays a melody*; lasers fire in key; bosses switch to a
 * heavier track; clears land a stinger on the next bar.
 *
 * Contract game-id: xa_brick_breaker (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-brick-breaker');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 480, H = 600;
  var COLS = 10, BW = 44, BH = 18, GAP = 2, TOP = 76;
  var BX0 = (W - COLS * (BW + GAP) + GAP) / 2;
  var PY = 556, PH = 12, BALL_R = 6;
  var ACCENT = '#ff3fa4';
  var HP_COLORS = ['', '#3ff0ff', '#ffd23f', '#ff4d6d', '#b04dff'];
  var POWERS = {
    wide: { c: '#39ff88', l: 'W' }, multi: { c: '#3ff0ff', l: 'M' }, slow: { c: '#ffd23f', l: 'S' },
    life: { c: '#ff3fa4', l: '+' }, laser: { c: '#ff4d6d', l: 'L' }, catch: { c: '#b98cff', l: 'C' }, fire: { c: '#ff9f1c', l: 'F' }
  };

  // '.' empty · 1-4 hit points · S steel · B bomb · M mover · G gold (drops a power-up)
  var LEVELS = [
    { name: 'WARM UP', map: ['..........', '.11111111.', '.11111111.', '.22222222.'] },
    { name: 'PYRAMID', map: ['....22....', '...2112...', '..211112..', '.21111112.', '2111111112'] },
    { name: 'CHECKER', map: ['1.1.1.1.1.', '.2.2.2.2.2', '1.1.1.1.1.', '.2.2.2.2.2', '1.1.1.1.1.'] },
    { name: 'BOMB BAY', map: ['2222222222', '1111B11111', '1B1111111B', '1111111111', 'S1S1S1S1S1'] },
    { name: 'THE CORE', boss: 1, map: ['..........', '..........', '..........', '..........', '.1S1..1S1.'] },
    { name: 'DIAMOND', map: ['....33....', '...3223...', '..321123..', '.32111123.', '..321123..', '...3223...', '....33....'] },
    { name: 'MOVERS', map: ['MMMMMMMMMM', '..........', '2222222222', '..........', 'MMMMMMMMMM', '1111111111'] },
    { name: 'FORTRESS', map: ['S22222222S', 'S21111112S', 'S211GG112S', 'S21111112S', 'SSSS..SSSS'] },
    { name: 'ZIGZAG', map: ['33........', '.33.......', '..33......', '...33.....', '....33....', '.....33...', '......33..', '.......33.', '........33'] },
    { name: 'TWIN CORE', boss: 2, map: ['..........', '..........', '..........', '..........', '1B11SS11B1'] },
    { name: 'SPIRAL', map: ['2222222222', '.........2', '22222222.2', '2......2.2', '2.2222.2.2', '2.2..2.2.2', '2.2B.2...2', '2.22222222', '2.........', '2222222222'] },
    { name: 'GOLD RAIN', map: ['G.G.G.G.G.', '..........', 'M.M.M.M.M.', '.M.M.M.M.M', '3333333333'] },
    { name: 'CROSSING', map: ['44......44', '.44....44.', '..44..44..', '...4444...', '...4GG4...', '...4444...', '..44..44..', '.44....44.', '44......44'] },
    { name: 'BUNKER', map: ['SSSSSSSSSS', 'S........S', 'S.333333.S', 'S.3BGGB3.S', 'S.333333.S', 'S........S', 'SSSS..SSSS'] },
    { name: 'OVERCLOCK', boss: 3, map: ['..........', '..........', '..........', '..........', 'MMMMMMMMMM'] },
    { name: 'WAVES', map: ['2........2', '32......23', '432....234', '.432..234.', '..432234..', '...4334...'] },
    { name: 'GRID LOCK', map: ['S1S1S1S1S1', '1S1S1S1S1S', 'S1S1S1S1S1', '1S1S1S1S1S', '2222222222'] },
    { name: 'BOMB CHAIN', map: ['BBBBBBBBBB', '3333333333', 'B33B33B33B', '3333333333', 'BBBBBBBBBB'] },
    { name: 'THE GAUNTLET', map: ['4444444444', 'S33333333S', 'MMMMMMMMMM', 'S22222222S', '1111GG1111'] },
    { name: 'FINAL CORE', boss: 4, map: ['..........', '..........', '..........', 'SS..SS..SS', '1B11BB11B1'] }
  ];
  var KEYS = [57, 60, 62, 55, 64, 59];
  var MODES = ['minor', 'dorian', 'mixolydian', 'minor', 'lydian'];
  var PROGS = [[0, 5, 2, 6], [0, 3, 4, 0], [0, 5, 3, 4], [0, 6, 5, 6], [0, 2, 5, 4]];

  function levelSong(n) {
    var r = U.rng(1000 + n);
    var motif = [];
    for (var i = 0; i < 8; i++) motif.push(r() < 0.25 ? null : [0, 2, 4, 7, 4, 2][Math.floor(r() * 6)]);
    return {
      bpm: Math.min(150, 116 + n * 1.5), key: KEYS[n % KEYS.length], scale: MODES[n % MODES.length], chords: PROGS[n % PROGS.length], seed: n,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.4, chord: true, octave: -1,
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.7, pattern: n % 2 ? 'x...x...x...x...' : 'x.....x...x.....' },
        { name: 'bass', inst: 'bass', layer: 0.2, gain: 0.5, chord: true, octave: -2, params: { cutoff: 800 },
          pattern: n % 3 === 0 ? '0 . 0 0 . 0 . 0 0 . 0 . ^0 . 0 .' : '0 . . 0 . . 0 . 0 . . 0 . . 4 .' },
        { name: 'hat', inst: 'hat', layer: 0.35, gain: 0.45, pattern: n % 2 ? '..x...x...x...x.' : 'x.x.x.x.x.x.x.xx' },
        { name: 'clap', inst: 'clap', layer: 0.5, gain: 0.45, pattern: '....x.......x...' },
        { name: 'lead', inst: 'lead', layer: 0.7, gain: 0.3, chord: true, octave: 1, rate: 2,
          fn: function (i) { var d = motif[(i.step / 2) % 8]; return d == null ? null : { deg: d + (i.bar % 4 === 3 && i.step % 16 > 8 ? 2 : 0) }; } },
        { name: 'fill', inst: 'snare', layer: 2, gain: 0.35, fn: function (i) { return { drum: true, vel: 0.4 + (i.stepInBar / 16) * 0.6 }; } }
      ]
    };
  }
  function bossSong(n) {
    return {
      bpm: 138 + n * 2, key: 52, scale: 'harmonic', chords: [0, 0, 5, 4], seed: 900 + n,
      tracks: [
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.85, pattern: 'x...x...x...x.x.' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.5, chord: true, octave: -2, params: { cutoff: 1100, q: 9 },
          fn: function (i) { return { deg: i.step % 4 === 3 ? 7 : 0, vel: i.step % 2 ? 0.55 : 0.9 }; } },
        { name: 'hat', inst: 'hat', layer: 0, gain: 0.45, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'snare', inst: 'snare', layer: 0.2, gain: 0.5, pattern: '....x.......x..x' },
        { name: 'alarm', inst: 'lead', layer: 0.4, gain: 0.3, octave: 1, params: { wave: 'sawtooth', cutoff: 2400 },
          pattern: '4 - 3 - 4 - 6 - 7 - 6 - 4 - 3 - 1 - 3 - 4 - - - - - - - . .' },
        { name: 'fill', inst: 'snare', layer: 2, gain: 0.35, fn: function (i) { return { drum: true, vel: 0.6 }; } }
      ]
    };
  }

  function drawCell(ctx, x, y, w, h, color, alpha, kind, t) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    if (kind === 'S') {
      var sg = ctx.createLinearGradient(x, y, x, y + h);
      sg.addColorStop(0, '#c9d1e6'); sg.addColorStop(1, '#5b6480');
      ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(x + 3, y + 3, 3, 3); ctx.fillRect(x + w - 6, y + 3, 3, 3); ctx.fillRect(x + 3, y + h - 6, 3, 3); ctx.fillRect(x + w - 6, y + h - 6, 3, 3);
      ctx.restore();
      return;
    }
    ctx.shadowColor = color; ctx.shadowBlur = kind === 'G' ? 14 : 8;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(x, y, w, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(x, y + h - 3, w, 3);
    if (kind === 'B') {
      ctx.fillStyle = '#1a0508';
      ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2 + 1, 5, 0, 7); ctx.fill();
      ctx.fillStyle = Math.floor(t * 6) % 2 ? '#ffd23f' : '#ff9f1c';
      ctx.fillRect(x + w / 2 + 2, y + 3, 3, 3);
    } else if (kind === 'G') {
      // gold bricks carry a bitcoin (cosmetic)
      U.btc(ctx, x + w / 2, y + h / 2, Math.min(w, h) * 0.36, { fill: '#f7931a', glow: 6 });
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(x + ((t * 60) % (w + 20)) - 10, y + 3, 6, h - 6);
    } else if (kind === 'M') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.moveTo(x + 6, y + h / 2); ctx.lineTo(x + 11, y + 4); ctx.lineTo(x + 11, y + h - 4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + w - 6, y + h / 2); ctx.lineTo(x + w - 11, y + 4); ctx.lineTo(x + w - 11, y + h - 4); ctx.fill();
    }
    ctx.restore();
  }

  function create(api) {
    var rng = api.rng;
    var levelIndex = 0, loop = 0, level = 1, lives = 3;
    var bricks = [], balls = [], drops = [], lasers = [], shards = [], sparks = [];
    var boss = null;
    var paddle = { x: W / 2, w: 84, target: 84 };
    var timers = { wide: 0, slow: 0, laser: 0, catch: 0, fire: 0, shrink: 0 };
    var combo = 0, totalBreakable = 0, laserCd = 0, fillOn = false;
    function setFill(on) { if (on === fillOn) return; fillOn = on; if (M()) M().setTrack('fill', on ? true : null); }
    var lastMoved = api.pointer().moved;
    var over = false, overT = 0, clearT = 0, titleT = 0, t = 0;

    function baseSpeed() { return Math.min(580, 330 + (level - 1) * 12 + loop * 40); }
    function def() { return LEVELS[levelIndex]; }
    function breakable() { return bricks.filter(function (b) { return b.hp > 0 && b.kind !== 'S'; }).length; }

    function buildLevel() {
      bricks = []; drops = []; lasers = []; sparks = [];
      var L = def();
      L.map.forEach(function (row, r) {
        for (var c = 0; c < COLS; c++) {
          var ch = row[c];
          if (!ch || ch === '.') continue;
          var hp = ch === 'S' ? 99 : ch === 'G' ? 3 : ch === 'B' || ch === 'M' ? 1 : +ch;
          hp = Math.min(4, hp + (ch >= '1' && ch <= '4' ? loop : 0));
          bricks.push({ r: r, c: c, x0: BX0 + c * (BW + GAP), x: BX0 + c * (BW + GAP), y: TOP + r * (BH + GAP),
            hp: hp, max: hp, kind: ch >= '1' && ch <= '4' ? 'N' : ch, flash: 0, phase: c * 0.4 + r });
        }
      });
      boss = L.boss ? { x: W / 2 - 66, y: TOP + 6, w: 132, h: 38, hp: 18 + L.boss * 8 + loop * 10, max: 18 + L.boss * 8 + loop * 10,
        vx: 70 + L.boss * 20, shootT: 2, flash: 0, tier: L.boss } : null;
      totalBreakable = breakable() + (boss ? 1 : 0);
      fillOn = false;
      titleT = 2;
      var m = M();
      if (m) {
        m.play(boss ? bossSong(L.boss) : levelSong(level), { fade: 1.2, intensity: 0.15 });
        if (boss) m.note('riser', 0, { dur: 1.8, gain: 0.4 });
      }
    }
    function resetBall() {
      balls = [{ x: paddle.x, y: PY - BALL_R - 1, vx: 0, vy: 0, stuck: true, off: 0, hold: 0 }];
      combo = 0;
    }
    function launch(b) {
      var ang = (-90 + (rng() - 0.5) * 30) * Math.PI / 180;
      var sp = baseSpeed();
      b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp; b.stuck = false;
      if (M()) M().note('pluck', 4, { chord: true, octave: 1, gain: 0.6 });
    }
    buildLevel();
    resetBall();

    function comboNote() {
      var m = M();
      if (!m) return api.audio.tone(440 + Math.min(combo, 16) * 40, 0.05, { type: 'square', vol: 0.12 });
      // the combo walks up the level's scale, locked to the 16th grid
      m.note('pluck', Math.min(combo - 1, 14), { quantize: '16', octave: 1, gain: 0.75 });
    }
    function shatter(br, color) {
      for (var i = 0; i < 4; i++) {
        shards.push({ x: br.x + (i % 2) * BW / 2, y: br.y + Math.floor(i / 2) * BH / 2, w: BW / 2, h: BH / 2,
          vx: (i % 2 ? 1 : -1) * (40 + rng() * 80), vy: -60 - rng() * 120, rot: 0, vr: (rng() - 0.5) * 8, c: color, life: 1 });
      }
      if (shards.length > 200) shards.splice(0, shards.length - 200);
    }
    function destroy(br, byBomb) {
      if (br.hp <= 0 && !byBomb) return;
      var color = br.kind === 'S' ? '#9aa3c7' : br.kind === 'B' ? '#ff9f1c' : br.kind === 'G' ? '#ffd23f' : br.kind === 'M' ? '#39ff88' : HP_COLORS[Math.min(br.max, 4)];
      br.hp = 0;
      var mult = 1 + Math.min(combo, 12) * 0.1;
      var pts = Math.round(10 * Math.min(br.max, 4) * level * mult);
      api.addScore(pts);
      if (combo >= 4) api.fx.text(br.x + BW / 2, br.y + BH / 2, '+' + pts, '#fff', 10);
      shatter(br, color);
      api.fx.burst(br.x + BW / 2, br.y + BH / 2, color, 8, 140, 0.4);
      if (br.kind === 'G' || rng() < 0.11) {
        var kinds = ['wide', 'multi', 'slow', 'laser', 'catch', 'fire', 'wide', 'multi', 'laser'];
        var k = rng() < 0.08 ? 'life' : kinds[Math.floor(rng() * kinds.length)];
        drops.push({ x: br.x + BW / 2, y: br.y + BH / 2, kind: k });
      }
      if (br.kind === 'B') {
        api.shake(6);
        api.fx.burst(br.x + BW / 2, br.y + BH / 2, '#ff9f1c', 30, 220, 0.6);
        if (M()) M().note('kick', 0, { gain: 1 });
        bricks.forEach(function (o) {
          if (o.hp > 0 && o !== br && Math.abs(o.r - br.r) <= 1 && Math.abs(o.c - br.c) <= 1 && o.kind !== 'S') destroy(o, true);
        });
      }
    }
    function hitBrick(br) {
      br.flash = 0.12;
      combo++;
      comboNote();
      if (br.kind === 'S') { if (M()) M().note('bell', 0, { octave: 2, gain: 0.25 }); combo = Math.max(0, combo - 1); return; }
      br.hp--;
      if (br.hp <= 0) destroy(br, false);
      else api.addScore(Math.round(5 * level));
    }
    function hitBoss(dmg) {
      boss.hp -= dmg; boss.flash = 0.12;
      api.addScore(25 * level);
      api.shake(3);
      if (M()) M().note('bell', 7 - Math.round((boss.hp / boss.max) * 7), { octave: 1, gain: 0.5 });
      if (boss.hp <= 0) {
        api.addScore(1500 * boss.tier);
        api.fx.text(W / 2, boss.y + 30, 'GENESIS BLOCK MINED +' + (1500 * boss.tier), '#ffd23f', 16);
        for (var i = 0; i < 5; i++) api.fx.burst(boss.x + rng() * boss.w, boss.y + rng() * boss.h, i % 2 ? ACCENT : '#ffd23f', 30, 260, 1);
        api.shake(16);
        boss = null;
      }
    }

    // Move one ball by h seconds; returns false if it fell out.
    function stepBall(b, h) {
      b.x += b.vx * h; b.y += b.vy * h;
      if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
      if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
      if (b.y < BALL_R + 30) { b.y = BALL_R + 30; b.vy = Math.abs(b.vy); }
      var half = paddle.w / 2;
      if (b.vy > 0 && b.y + BALL_R >= PY && b.y + BALL_R <= PY + PH + 8 && b.x > paddle.x - half - BALL_R && b.x < paddle.x + half + BALL_R) {
        if (timers.catch > 0) {
          b.stuck = true; b.off = b.x - paddle.x; b.hold = 2; b.y = PY - BALL_R - 1;
          if (M()) M().note('marimba', 2, { chord: true, octave: 1 });
          combo = 0;
          return true;
        }
        var off = U.clamp((b.x - paddle.x) / half, -1, 1);
        var ang = (-90 + off * 62) * Math.PI / 180;
        var sp = Math.min(640, Math.hypot(b.vx, b.vy) * 1.012);
        b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp;
        b.y = PY - BALL_R;
        combo = 0;
        if (M()) M().note('kick', 0, { gain: 0.5 }); else api.audio.tone(220, 0.05, { type: 'square', vol: 0.12 });
        api.fx.burst(b.x, PY, ACCENT, 6, 80, 0.3);
      }
      var fire = timers.fire > 0;
      for (var i = 0; i < bricks.length; i++) {
        var br = bricks[i];
        if (br.hp <= 0) continue;
        var nx = U.clamp(b.x, br.x, br.x + BW), ny = U.clamp(b.y, br.y, br.y + BH);
        var dx = b.x - nx, dy = b.y - ny;
        if (dx * dx + dy * dy > BALL_R * BALL_R) continue;
        if (fire) { combo++; comboNote(); destroy(br, true); continue; }
        if (Math.abs(dx) > Math.abs(dy)) b.vx = dx > 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
        else b.vy = dy > 0 ? Math.abs(b.vy) : -Math.abs(b.vy);
        hitBrick(br);
        break;
      }
      if (boss) {
        var bx = U.clamp(b.x, boss.x, boss.x + boss.w), by = U.clamp(b.y, boss.y, boss.y + boss.h);
        var ddx = b.x - bx, ddy = b.y - by;
        if (ddx * ddx + ddy * ddy <= BALL_R * BALL_R) {
          if (Math.abs(ddx) > Math.abs(ddy)) b.vx = ddx > 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
          else b.vy = ddy > 0 ? Math.abs(b.vy) : -Math.abs(b.vy);
          hitBoss(fire ? 3 : 1);
        }
      }
      return b.y < H + 20;
    }

    function loseLife() {
      lives--;
      api.shake(8);
      Object.keys(timers).forEach(function (k) { timers[k] = 0; });
      paddle.target = 84; drops = []; lasers = [];
      if (lives <= 0) { over = true; api.fx.burst(paddle.x, PY, ACCENT, 40, 220, 1); return; }
      var m = M();
      if (m) { m.duck(0.75, 1.4); m.setFilter(700, 0.1); m.setFilter(18000, 1.6); m.note('sub', -3, { dur: 0.6, gain: 0.8 }); }
      api.fx.text(W / 2, H / 2, lives + (lives === 1 ? ' LIFE LEFT' : ' LIVES LEFT'), '#fff', 14);
      resetBall();
    }
    function applyPower(kind, x) {
      var pw = POWERS[kind];
      api.fx.burst(x, PY, pw.c, 16, 140);
      var label = { wide: 'WIDE', multi: 'MULTI', slow: 'SLOW', life: '+1 LIFE', laser: 'LASER', catch: 'CATCH', fire: 'FIREBALL' }[kind];
      api.fx.text(x, PY - 20, label, pw.c, 11);
      var m = M();
      if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2, steps: 2 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.5 });
      if (kind === 'wide') { paddle.target = 134; timers.wide = 12; timers.shrink = 0; }
      if (kind === 'slow') { timers.slow = 10; if (m) m.setFilter(1800, 0.4); }
      if (kind === 'life') lives = Math.min(5, lives + 1);
      if (kind === 'laser') timers.laser = 10;
      if (kind === 'catch') timers.catch = 12;
      if (kind === 'fire') { timers.fire = 8; setFill(true); }
      if (kind === 'multi') {
        var src = balls.filter(function (b) { return !b.stuck; })[0];
        if (src) for (var k = 0; k < 2 && balls.length < 8; k++) {
          var a = Math.atan2(src.vy, src.vx) + (k ? 0.45 : -0.45), sp = Math.hypot(src.vx, src.vy);
          balls.push({ x: src.x, y: src.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, stuck: false });
        }
      }
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var sw = inp.takeSwipes();
        shards.forEach(function (s) { s.vy += 900 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt; s.life -= dt * 0.8; });
        shards = shards.filter(function (s) { return s.life > 0 && s.y < H + 20; });
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); return; }
        if (titleT > 0) titleT -= dt;

        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; paddle.x = p.x; }
        if (inp.held('left')) paddle.x -= 560 * dt;
        if (inp.held('right')) paddle.x += 560 * dt;
        var wantW = timers.shrink > 0 ? 56 : timers.wide > 0 ? 134 : 84;
        paddle.target = wantW;
        paddle.w += (paddle.target - paddle.w) * Math.min(1, dt * 10);
        paddle.x = U.clamp(paddle.x, paddle.w / 2 + 4, W - paddle.w / 2 - 4);
        Object.keys(timers).forEach(function (k) {
          if (timers[k] > 0) {
            timers[k] -= dt;
            if (timers[k] <= 0) {
              timers[k] = 0;
              if (k === 'slow' && M()) M().setFilter(18000, 0.8);
              if (k === 'fire') setFill(false);
            }
          }
        });

        if (clearT > 0) {
          clearT -= dt;
          balls.forEach(function (b) { if (b.stuck) b.x = paddle.x; });
          if (clearT <= 0) {
            levelIndex++;
            if (levelIndex >= LEVELS.length) { levelIndex = 0; loop++; }
            level++;
            buildLevel(); resetBall();
          }
          return;
        }

        var press = inp.hit('a') || inp.hit('up') || sw.indexOf('tap') >= 0;
        balls.forEach(function (b) {
          if (!b.stuck) return;
          b.x = paddle.x + (b.off || 0); b.y = PY - BALL_R - 1;
          if (b.hold > 0) { b.hold -= dt; if (b.hold <= 0) { b.off = 0; launch(b); return; } }
          if (press) { b.off = 0; b.hold = 0; launch(b); }
        });
        // lasers
        laserCd -= dt;
        if (timers.laser > 0 && laserCd <= 0 && (inp.held('a') || inp.held('up') || inp.held('hold')) && !balls.some(function (b) { return b.stuck; })) {
          laserCd = 0.28;
          lasers.push({ x: paddle.x - paddle.w / 2 + 6, y: PY - 4 }, { x: paddle.x + paddle.w / 2 - 6, y: PY - 4 });
          if (M()) M().note('arp', [0, 2, 4, 7][Math.floor(rng() * 4)], { chord: true, octave: 2, gain: 0.5 });
        }
        lasers = lasers.filter(function (l) {
          l.y -= 620 * dt;
          if (l.y < 30) return false;
          for (var i = 0; i < bricks.length; i++) {
            var br = bricks[i];
            if (br.hp > 0 && l.x > br.x && l.x < br.x + BW && l.y > br.y && l.y < br.y + BH) {
              if (br.kind !== 'S') { br.hp--; br.flash = 0.1; if (br.hp <= 0) destroy(br, false); }
              return false;
            }
          }
          if (boss && l.x > boss.x && l.x < boss.x + boss.w && l.y > boss.y && l.y < boss.y + boss.h) { hitBoss(1); return false; }
          return true;
        });

        // movers slide; boss patrols and shoots sparks
        bricks.forEach(function (br) {
          if (br.flash > 0) br.flash -= dt;
          if (br.kind === 'M' && br.hp > 0) br.x = U.clamp(br.x0 + Math.sin(t * 1.4 + br.phase) * BW * 0.55, 2, W - BW - 2);
        });
        if (boss) {
          boss.x += boss.vx * dt;
          if (boss.x < 10 || boss.x + boss.w > W - 10) { boss.vx *= -1; boss.x = U.clamp(boss.x, 10, W - 10 - boss.w); }
          if (boss.flash > 0) boss.flash -= dt;
          boss.shootT -= dt;
          if (boss.shootT <= 0) {
            boss.shootT = Math.max(0.8, 2.2 - boss.tier * 0.3);
            sparks.push({ x: boss.x + boss.w / 2, y: boss.y + boss.h, vy: 160 + boss.tier * 30 });
            if (M()) M().note('lead', 0, { octave: -1, gain: 0.4, dur: 0.1 });
          }
        }
        sparks = sparks.filter(function (s) {
          s.y += s.vy * dt;
          if (s.y > PY - 4 && s.y < PY + PH + 4 && Math.abs(s.x - paddle.x) < paddle.w / 2 + 4) {
            timers.shrink = 5; timers.wide = 0;
            api.shake(5);
            api.fx.text(paddle.x, PY - 24, 'SHRUNK', '#ff4d6d', 11);
            if (M()) M().duck(0.5, 0.6);
            return false;
          }
          return s.y < H + 10;
        });

        var slow = timers.slow > 0 ? 0.65 : 1;
        var sub = 3;
        for (var s = 0; s < sub; s++) balls = balls.filter(function (b) { return b.stuck || stepBall(b, dt * slow / sub); });
        balls.forEach(function (b) { if (!b.stuck) api.fx.trail(b.x, b.y, timers.fire > 0 ? '#ff9f1c' : 'rgba(255,255,255,0.5)', 0, 0); });
        if (!balls.length) { loseLife(); return; }

        drops = drops.filter(function (d) {
          d.y += 150 * dt;
          if (d.y > PY - 6 && d.y < PY + PH + 6 && Math.abs(d.x - paddle.x) < paddle.w / 2 + 10) { applyPower(d.kind, d.x); return false; }
          return d.y < H + 20;
        });

        var left = breakable();
        var m = M();
        if (m) {
          var remaining = (left + (boss ? 1 : 0)) / Math.max(1, totalBreakable);
          m.setIntensity(boss ? 0.2 + (1 - boss.hp / boss.max) * 0.8 : 0.15 + (1 - remaining) * 0.85);
        }
        if (!boss && left > 0) setFill(left <= 4 || timers.fire > 0);
        if (left === 0 && !boss) {
          var bonus = 250 * level + lives * 100;
          api.addScore(bonus);
          api.fx.text(W / 2, H / 2 - 30, 'WALL CLEARED +' + bonus, '#39ff88', 15);
          if (m) {
            setFill(false);
            m.stinger([{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 7, at: 6, steps: 10 }], { inst: 'lead', quantize: 'bar', octave: 1, gain: 0.6 });
          } else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.2 });
          balls = balls.slice(0, 1);
          balls[0].stuck = true; balls[0].off = 0; balls[0].hold = 0;
          clearT = 2.2;
        }
        api.setStatus('LV ' + level + ' ' + def().name + '  ·  LIVES ' + lives + '  ·  BRICKS ' + left + (combo > 2 ? '  ·  COMBO ' + combo : ''));
      },

      render: function (ctx) {
        var pulse = M() ? M().pulse(6) : 0;
        var hue = (levelIndex * 37) % 360;
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'hsl(' + hue + ',55%,' + (boss ? 9 : 7) + '%)'); g.addColorStop(1, '#05030c');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'hsla(' + hue + ',90%,60%,' + (0.06 + pulse * 0.08) + ')';
        ctx.beginPath();
        for (var x = 0; x <= W; x += 24) { ctx.moveTo(x + 0.5, 30); ctx.lineTo(x + 0.5, H); }
        ctx.stroke();
        ctx.save();
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12 + pulse * 10; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(W, 30); ctx.stroke();
        ctx.restore();
        for (var l = 0; l < lives; l++) { ctx.fillStyle = ACCENT; U.roundRect(ctx, 12 + l * 26, 11, 20, 7, 3); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('LV ' + level + ' · ' + def().name, W - 12, 19);

        bricks.forEach(function (br) {
          if (br.hp <= 0) return;
          var col = br.flash > 0 ? '#ffffff' : br.kind === 'B' ? '#ff9f1c' : br.kind === 'G' ? '#ffd23f' : br.kind === 'M' ? '#39ff88' : HP_COLORS[Math.min(br.hp, 4)];
          var a = br.kind === 'N' ? 0.4 + 0.6 * (br.hp / br.max) : 1;
          drawCell(ctx, br.x, br.y, BW, BH, col, a, br.kind, t);
          if (br.kind === 'N' && br.max > 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            for (var k = 0; k < br.hp; k++) ctx.fillRect(br.x + 5 + k * 6, br.y + BH - 7, 4, 3);
          }
        });
        shards.forEach(function (s) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, s.life);
          ctx.translate(s.x + s.w / 2, s.y + s.h / 2); ctx.rotate(s.rot);
          ctx.fillStyle = s.c; ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
          ctx.restore();
        });
        if (boss) {
          ctx.save();
          var bc = boss.flash > 0 ? '#ffffff' : ACCENT;
          ctx.shadowColor = bc; ctx.shadowBlur = 20 + pulse * 20;
          ctx.fillStyle = '#1a0717'; ctx.strokeStyle = bc; ctx.lineWidth = 3;
          U.roundRect(ctx, boss.x, boss.y, boss.w, boss.h, 10); ctx.fill(); ctx.stroke();
          ctx.shadowBlur = 0;
          var eye = boss.x + boss.w / 2 + U.clamp((paddle.x - boss.x - boss.w / 2) * 0.1, -20, 20);
          // the core is presented as the GENESIS BLOCK: a bitcoin eye plus a small label (cosmetic only)
          U.btc(ctx, eye, boss.y + boss.h / 2, 9 + pulse * 3, { fill: bc, ink: '#1a0717', glow: 10 });
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.font = '700 8px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('GENESIS BLOCK', boss.x + boss.w / 2, boss.y + boss.h + 9);
          ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(boss.x + 8, boss.y - 10, boss.w - 16, 5);
          ctx.fillStyle = ACCENT; ctx.fillRect(boss.x + 8, boss.y - 10, (boss.w - 16) * (boss.hp / boss.max), 5);
          ctx.restore();
        }
        ctx.fillStyle = '#ff4d6d';
        sparks.forEach(function (s) { ctx.beginPath(); ctx.arc(s.x, s.y, 5 + Math.sin(t * 20) * 1.5, 0, 7); ctx.fill(); });
        ctx.fillStyle = '#ff8a8a';
        lasers.forEach(function (l) { ctx.fillRect(l.x - 1.5, l.y - 10, 3, 12); });

        drops.forEach(function (d) {
          var pw = POWERS[d.kind];
          ctx.save();
          ctx.shadowColor = pw.c; ctx.shadowBlur = 12; ctx.fillStyle = pw.c;
          U.roundRect(ctx, d.x - 14, d.y - 8, 28, 16, 8); ctx.fill();
          ctx.shadowBlur = 0; ctx.fillStyle = '#05030c';
          ctx.font = '900 11px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(pw.l, d.x, d.y + 1);
          ctx.restore();
        });

        // paddle (with cannons while the laser is on)
        var pc = timers.shrink > 0 ? '#ff4d6d' : timers.wide > 0 ? '#39ff88' : timers.catch > 0 ? '#b98cff' : ACCENT;
        ctx.save();
        ctx.shadowColor = pc; ctx.shadowBlur = 18; ctx.fillStyle = pc;
        U.roundRect(ctx, paddle.x - paddle.w / 2, PY, paddle.w, PH, 6); ctx.fill();
        if (timers.laser > 0) { ctx.fillStyle = '#ff4d6d'; ctx.fillRect(paddle.x - paddle.w / 2 + 3, PY - 7, 6, 8); ctx.fillRect(paddle.x + paddle.w / 2 - 9, PY - 7, 6, 8); }
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        U.roundRect(ctx, paddle.x - paddle.w / 2 + 4, PY + 2, paddle.w - 8, 3, 2); ctx.fill();
        ctx.restore();

        balls.forEach(function (b) {
          ctx.save();
          var fire = timers.fire > 0;
          ctx.shadowColor = fire ? '#ff9f1c' : timers.slow > 0 ? '#ffd23f' : '#ffffff'; ctx.shadowBlur = fire ? 24 : 14;
          ctx.fillStyle = fire ? '#ffe0b0' : '#ffffff';
          ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R + (fire ? 1.5 : 0), 0, 7); ctx.fill();
          ctx.restore();
        });
        // active power-up timers
        var active = ['laser', 'catch', 'fire', 'slow', 'wide'].filter(function (k) { return timers[k] > 0; });
        active.forEach(function (k, i) {
          ctx.fillStyle = POWERS[k].c;
          ctx.fillRect(12 + i * 46, H - 12, 40 * Math.min(1, timers[k] / 12), 4);
        });
        if (titleT > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, titleT);
          U.glowText(ctx, (boss ? 'GENESIS BLOCK · ' : 'LEVEL ' + level + ' · ') + def().name, W / 2, H / 2 + 40, 16, boss ? ACCENT : '#ffd0ea');
          ctx.restore();
        } else if (balls.length === 1 && balls[0].stuck && !over && clearT <= 0 && !(balls[0].hold > 0)) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP OR SPACE TO LAUNCH', W / 2, PY - 60, 13, '#ffd0ea');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#0d0418';
    ctx.fillRect(0, 0, w, h);
    var cols = 8, bw = w / cols, bh = h * 0.055;
    var map = ['..2222..', '.211112.', '21BGGB12', '.211112.', '..SSSS..'];
    map.forEach(function (row, r) {
      for (var c = 0; c < cols; c++) {
        var ch = row[c];
        if (ch === '.' || (r * 3 + c * 5 + Math.floor(t * 0.7)) % 11 === 0) continue;
        var col = ch === 'S' ? '#9aa3c7' : ch === 'B' ? '#ff9f1c' : ch === 'G' ? '#ffd23f' : HP_COLORS[+ch];
        drawCell(ctx, c * bw + 2, h * 0.1 + r * (bh + 3), bw - 4, bh, col, 0.9, ch === 'S' || ch === 'B' || ch === 'G' ? ch : 'N', t);
      }
    });
    var bx = w / 2 + Math.sin(t * 1.9) * w * 0.4;
    var by = h * 0.55 + Math.abs(Math.sin(t * 2.6)) * -h * 0.25 + h * 0.2;
    var px = w / 2 + Math.sin(t * 1.9) * w * 0.35;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.fillStyle = ACCENT;
    U.roundRect(ctx, px - w * 0.1, h * 0.88, w * 0.2, h * 0.035, 4); ctx.fill();
    ctx.shadowColor = '#fff'; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(bx, by, h * 0.025, 0, 7); ctx.fill();
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_brick_breaker',
    order: 6,
    title: 'Block Breaker',
    tagline: '20 walls, 4 bosses. Play a combo.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO MOVE · TAP TO LAUNCH OR FIRE',
    controls: 'Mouse or ←→ to move · Space to launch / fire lasers',
    create: create,
    attract: attract
  });
})(window);

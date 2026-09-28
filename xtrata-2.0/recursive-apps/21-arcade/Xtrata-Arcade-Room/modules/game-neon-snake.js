/*
 * Xtrata Arcade cartridge #1 — NEON SNAKE (v2)
 * Eat, grow, don't bite yourself — across designed stages with portals,
 * with power-ups that bend time, space and the soundtrack.
 *
 * Music: a synthwave track that *grows with the snake*. Each extra length
 * unlocks a layer (pad → bass → drums → arps → lead), speed drives tempo,
 * every stage modulates up a tone, every bite plays a chord tone in key,
 * SLOW drops the tempo under a filter, GHOST shifts to a whole-tone scale,
 * MAGNET adds a bell sparkle line, and death is a tape stop.
 *
 * Contract game-id: xa_neon_snake (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-neon-snake');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 480, H = 480, CELL = 20, COLS = 24, ROWS = 24, BITES_PER_STAGE = 12;
  var COLOR = '#39ff88', FOOD = '#ff3fa4', GOLD = '#ffd23f';
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var THEMES = [
    { snake: '#39ff88', wall: '#6a7bff', grid: 'rgba(57,255,136,0.06)', bg: '#05060f' },
    { snake: '#3ff0ff', wall: '#ff3fa4', grid: 'rgba(63,240,255,0.07)', bg: '#06051a' },
    { snake: '#ffd23f', wall: '#3ff0ff', grid: 'rgba(255,210,63,0.06)', bg: '#0d0714' },
    { snake: '#ff8fd8', wall: '#39ff88', grid: 'rgba(255,143,216,0.06)', bg: '#070d12' },
    { snake: '#b98cff', wall: '#ffd23f', grid: 'rgba(185,140,255,0.07)', bg: '#0a0618' }
  ];
  var POWERS = {
    slow: { color: '#3ff0ff', label: 'SLOW-MO', dur: 5 },
    ghost: { color: '#b98cff', label: 'GHOST', dur: 5 },
    magnet: { color: '#ffd23f', label: 'MAGNET', dur: 6 }
  };

  // Designed layouts (walls + optional portal pair), returned as cell lists.
  function layout(stage) {
    var walls = [], portals = null, i, startY = 12;
    function line(x0, y0, x1, y1) {
      var dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0), x = x0, y = y0;
      while (true) { walls.push([x, y]); if (x === x1 && y === y1) break; x += dx; y += dy; }
    }
    var k = (stage - 1) % 5;
    if (k === 1) { // corner brackets
      [[2, 2, 1, 1], [21, 2, -1, 1], [2, 21, 1, -1], [21, 21, -1, -1]].forEach(function (c) {
        line(c[0], c[1], c[0] + 4 * c[2], c[1]); line(c[0], c[1], c[0], c[1] + 4 * c[3]);
      });
    } else if (k === 2) { // broken cross + portals
      line(11, 3, 11, 8); line(11, 15, 11, 20); line(3, 11, 8, 11); line(15, 11, 20, 11);
      portals = [[4, 4], [19, 19]];
      startY = 13;                              // one clear row between you and the arm
    } else if (k === 3) { // twin bars with portals at their ends
      line(4, 7, 19, 7); line(4, 16, 19, 16);
      portals = [[2, 11], [21, 11]];
    } else if (k === 4) { // box with four doors
      line(7, 7, 10, 7); line(13, 7, 16, 7); line(7, 16, 10, 16); line(13, 16, 16, 16);
      line(7, 8, 7, 10); line(7, 13, 7, 15); line(16, 8, 16, 10); line(16, 13, 16, 15);
      portals = [[11, 11], [3, 20]];
    }
    // later loops: a few extra pillars
    for (i = 0; i < Math.floor((stage - 1) / 5) * 3; i++) {
      var py = 3 + (i * 11) % 18;
      if (Math.abs(py - startY) > 1) walls.push([3 + (i * 7) % 18, py]);   // keep the start lane clear
    }
    return { walls: walls, portals: portals, startY: startY };
  }

  function song() {
    var hook = [
      '4 - . 4 2 - 0 - 2 - - - . . . .',
      '5 - . 5 4 - 2 - 4 - - - . . . .',
      '7 - . 6 4 - 2 - 4 - 6 - 7 - - -',
      '6 - - - 4 - - - 2 - - - . . . .'
    ].join(' ');
    return {
      bpm: 104, key: 57, scale: 'minor', chords: [0, 5, 2, 6], seed: 11,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.5, chord: true, octave: -1,
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'bass', inst: 'bass', layer: 0.12, gain: 0.55, chord: true, octave: -2, params: { cutoff: 700 },
          pattern: '0 . 0 . 0 . ^0 . 0 . 0 . 0 . ^0 .' },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.8, pattern: 'x...x...x...x...' },
        { name: 'hat', inst: 'hat', layer: 0.32, gain: 0.5, pattern: '..x...x...x...xx' },
        { name: 'snare', inst: 'clap', layer: 0.45, gain: 0.55, pattern: '....x.......x...' },
        { name: 'arp', inst: 'arp', layer: 0.58, gain: 0.35, chord: true, octave: 1,
          fn: function (i) { return [0, 2, 4, 7][i.step % 4]; } },
        { name: 'lead', inst: 'lead', layer: 0.75, gain: 0.4, octave: 1, pattern: hook },
        { name: 'sparkle', inst: 'bell', layer: 2, gain: 0.35, chord: true, octave: 2, rate: 2,
          fn: function (i) { return i.rng() < 0.6 ? { deg: [0, 2, 4, 7][Math.floor(i.rng() * 4)], vel: 0.6 } : null; } },
        { name: 'ghostpad', inst: 'pad', layer: 2, gain: 0.35, octave: 0, params: { cutoff: 2400, attack: 0.2 },
          fn: function (i) { return i.stepInBar % 8 === 0 ? [{ deg: 0, steps: 8 }, { deg: 3, steps: 8 }] : null; } }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var stage = 1, theme = THEMES[0];
    var walls = {}, portals = null;
    var snake, prevSnake, dir, queue, grow;
    var tick = 0, food = null, gold = null, power = null, active = null;
    var bitesInStage = 0, eaten = 0, combo = 1, comboTimer = 0;
    var dead = false, deathT = 0, stageT = 0, t = 0;

    function key(x, y) { return x + ',' + y; }
    function loadStage() {
      theme = THEMES[(stage - 1) % THEMES.length];
      var L = layout(stage);
      walls = {};
      L.walls.forEach(function (w) { walls[key(w[0], w[1])] = true; });
      portals = L.portals;
      var len = snake ? Math.min(10, snake.length) : 4;
      snake = [];
      for (var i = 0; i < len; i++) snake.push({ x: Math.max(1, 6 - i), y: L.startY });
      prevSnake = snake.map(function (s) { return { x: s.x, y: s.y }; });
      dir = 'right'; queue = []; grow = 0; tick = 0;
      bitesInStage = 0;
      food = freeCell(true); gold = null; power = null;
    }
    function occupied(x, y, ignoreSnake) {
      if (walls[key(x, y)]) return true;
      if (portals && portals.some(function (p) { return p[0] === x && p[1] === y; })) return true;
      if (!ignoreSnake) for (var i = 0; i < snake.length; i++) if (snake[i].x === x && snake[i].y === y) return true;
      return false;
    }
    function freeCell(avoidHead) {
      for (var tries = 0; tries < 800; tries++) {
        var x = 1 + rng.int(COLS - 2), y = 1 + rng.int(ROWS - 2);
        if (occupied(x, y)) continue;
        if (food && food.x === x && food.y === y) continue;
        if (gold && gold.x === x && gold.y === y) continue;
        if (power && power.x === x && power.y === y) continue;
        if (avoidHead && snake && Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < 5) continue;
        return { x: x, y: y };
      }
      return null;
    }
    function baseInterval() { return Math.max(0.05, 0.13 - (stage - 1) * 0.006 - snake.length * 0.0012); }
    function interval() { return baseInterval() * (active && active.kind === 'slow' ? 1.9 : 1); }
    function bpmFor(iv) { return 100 + U.clamp((0.13 - iv) / 0.08, 0, 1) * 52; }

    function syncMusic() {
      var m = M();
      if (!m) return;
      m.setIntensity(U.clamp((snake.length - 4) / 34 + (stage - 1) * 0.08, 0, 1));
      if (!(active && active.kind === 'slow')) m.setTempo(bpmFor(baseInterval()), 1.2);
    }

    loadStage();
    if (M()) { M().play(song(), { fade: 1.2, intensity: 0 }); }

    function turn(d) {
      var last = queue.length ? queue[queue.length - 1] : dir;
      if (d === last) return;
      var a = DIRS[d], b = DIRS[last];
      if (a[0] === -b[0] && a[1] === -b[1]) return;
      if (queue.length < 3) queue.push(d);
    }

    function die() {
      dead = true;
      var h = snake[0];
      api.fx.burst(h.x * CELL + CELL / 2, h.y * CELL + CELL / 2, theme.snake, 40, 220, 0.9);
      snake.forEach(function (s, i) {
        if (i % 2) api.fx.burst(s.x * CELL + CELL / 2, s.y * CELL + CELL / 2, theme.snake, 3, 90, 0.8);
      });
      api.shake(10);
      if (M()) { M().note('sub', -7, { dur: 0.9, gain: 0.8 }); M().tapeStop(1.1); }
      else api.audio.tone(220, 0.35, { type: 'sawtooth', slide: 0.25, vol: 0.3 });
    }

    function activate(kind) {
      var m = M();
      endPower();
      active = { kind: kind, left: POWERS[kind].dur };
      api.fx.text(W / 2, 60, POWERS[kind].label + '!', POWERS[kind].color, 16);
      if (!m) return;
      m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 3 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.6 });
      if (kind === 'slow') { m.setTempo(bpmFor(baseInterval()) * 0.55, 0.5); m.setFilter(900, 0.5); }
      if (kind === 'ghost') { m.setScale('whole'); m.setTrack('ghostpad', true); m.setFilter(5000, 0.3); }
      if (kind === 'magnet') { m.setTrack('sparkle', true); }
    }
    function endPower() {
      if (!active) return;
      var m = M(), kind = active.kind;
      active = null;
      if (!m) return;
      if (kind === 'slow') { m.setFilter(18000, 0.6); }
      if (kind === 'ghost') { m.setScale('minor'); m.setTrack('ghostpad', null); m.setFilter(18000, 0.3); }
      if (kind === 'magnet') { m.setTrack('sparkle', null); }
      syncMusic();
    }

    function nextStage() {
      var bonus = snake.length * 10 * stage;
      api.addScore(bonus);
      api.fx.text(W / 2, H / 2 + 30, 'STAGE CLEAR +' + bonus, GOLD, 14);
      stage++;
      stageT = 1.4;
      endPower();
      var m = M();
      if (m) {
        m.note('riser', 0, { dur: 1.1, gain: 0.5 });
        m.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 9, at: 6 }, { deg: 11, at: 8, steps: 8 }], { inst: 'lead', quantize: 'beat', octave: 1, gain: 0.5 });
        m.transpose(2);
      }
    }

    function step() {
      prevSnake = snake.map(function (s) { return { x: s.x, y: s.y }; });
      if (queue.length) dir = queue.shift();
      var d = DIRS[dir];
      var nx = snake[0].x + d[0], ny = snake[0].y + d[1];
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return die();
      // portals: arrive on the partner cell, keep heading
      if (portals) {
        for (var p = 0; p < 2; p++) {
          if (portals[p][0] === nx && portals[p][1] === ny) {
            var o = portals[1 - p];
            nx = o[0] + d[0]; ny = o[1] + d[1];
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return die();
            if (M()) M().note('bell', 7, { octave: 1, gain: 0.5, chord: true });
            api.fx.burst(o[0] * CELL + CELL / 2, o[1] * CELL + CELL / 2, '#ffffff', 12, 120, 0.4);
            break;
          }
        }
      }
      var ghost = active && active.kind === 'ghost';
      var tail = snake[snake.length - 1];
      var hitsTail = tail.x === nx && tail.y === ny && grow === 0;
      if (walls[key(nx, ny)]) return die();
      if (!ghost && !hitsTail && snake.some(function (s) { return s.x === nx && s.y === ny; })) return die();
      snake.unshift({ x: nx, y: ny });
      if (grow > 0) grow--; else snake.pop();

      var cx = nx * CELL + CELL / 2, cy = ny * CELL + CELL / 2;
      var m = M();
      if (food && nx === food.x && ny === food.y) {
        combo = comboTimer > 0 ? Math.min(6, combo + 1) : 1;
        comboTimer = 3;
        var pts = 10 * combo * stage;
        api.addScore(pts);
        api.fx.burst(cx, cy, FOOD, 18, 140);
        api.fx.text(cx, cy - 10, '+' + pts + (combo > 1 ? ' x' + combo : ''), FOOD, 12);
        if (m) m.note('pluck', [0, 2, 4, 7, 9, 11][combo - 1], { chord: true, octave: 1, gain: 0.8 });
        else api.audio.tone(520 + combo * 90, 0.08, { vol: 0.2 });
        grow += 2; eaten++; bitesInStage++;
        food = freeCell(false);
        if (!gold && eaten % 5 === 0) { gold = freeCell(true); if (gold) gold.life = 6; }
        if (!power && eaten % 7 === 3) {
          power = freeCell(true);
          if (power) { power.kind = ['slow', 'ghost', 'magnet'][rng.int(3)]; power.life = 7; }
        }
        syncMusic();
        if (bitesInStage >= BITES_PER_STAGE) nextStage();
      } else if (gold && nx === gold.x && ny === gold.y) {
        var g = (50 + Math.round(gold.life * 10)) * stage;
        api.addScore(g);
        api.fx.burst(cx, cy, GOLD, 30, 200);
        api.fx.text(cx, cy - 10, '+' + g, GOLD, 14);
        if (m) m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3 }], { inst: 'pluck', quantize: '16', octave: 1 });
        grow += 4; gold = null;
        syncMusic();
      } else if (power && nx === power.x && ny === power.y) {
        activate(power.kind);
        api.fx.burst(cx, cy, POWERS[power.kind].color, 26, 180);
        power = null;
      }
      // magnet: food drifts one cell toward the head every other step
      if (active && active.kind === 'magnet' && food && (Math.round(t * 10) % 2 === 0)) {
        var dx = Math.sign(nx - food.x), dy = Math.sign(ny - food.y);
        var tryX = { x: food.x + dx, y: food.y }, tryY = { x: food.x, y: food.y + dy };
        var mv = Math.abs(nx - food.x) > Math.abs(ny - food.y) ? [tryX, tryY] : [tryY, tryX];
        for (var k = 0; k < 2; k++) if ((mv[k].x !== food.x || mv[k].y !== food.y) && !occupied(mv[k].x, mv[k].y)) { food = mv[k]; break; }
      }
    }

    return {
      // Read-only test hook: what is on screen right now.
      debug: function () { return { stage: stage, len: snake.length, head: snake[0], dir: dir, food: food, active: active && active.kind, dead: dead }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d)) turn(d); });
        inp.takeSwipes().forEach(function (s) { if (DIRS[s]) turn(s); });
        if (dead) { deathT += dt; if (deathT > 1.1) api.gameOver(); return; }
        if (stageT > 0) {
          stageT -= dt;
          if (stageT <= 0) loadStage();
          return;
        }
        if (comboTimer > 0) { comboTimer -= dt; if (comboTimer <= 0) combo = 1; }
        if (gold) { gold.life -= dt; if (gold.life <= 0) gold = null; }
        if (power) { power.life -= dt; if (power.life <= 0) power = null; }
        if (active) { active.left -= dt; if (active.left <= 0) endPower(); }
        tick += dt;
        var iv = interval();
        while (tick >= iv && !dead && stageT <= 0) { tick -= iv; step(); }
        api.setStatus('STAGE ' + stage + '  ·  ' + bitesInStage + '/' + BITES_PER_STAGE + '  ·  LEN ' + snake.length +
          (active ? '  ·  ' + POWERS[active.kind].label + ' ' + active.left.toFixed(1) : combo > 1 ? '  ·  COMBO x' + combo : ''));
      },

      render: function (ctx) {
        var pulse = M() ? M().pulse(6) : 0;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, W, H);
        // grid breathes with the beat
        ctx.globalAlpha = 1 + pulse * 1.5;
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gx = 0; gx <= COLS; gx++) { ctx.moveTo(gx * CELL + 0.5, 0); ctx.lineTo(gx * CELL + 0.5, H); }
        for (var gy = 0; gy <= ROWS; gy++) { ctx.moveTo(0, gy * CELL + 0.5); ctx.lineTo(W, gy * CELL + 0.5); }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.strokeStyle = theme.snake; ctx.globalAlpha = 0.45 + pulse * 0.4; ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, W - 2, H - 2);
        ctx.restore();

        // walls
        ctx.save();
        ctx.shadowColor = theme.wall; ctx.shadowBlur = 10 + pulse * 8; ctx.fillStyle = theme.wall;
        Object.keys(walls).forEach(function (k) {
          var p = k.split(','); ctx.fillRect(+p[0] * CELL + 2, +p[1] * CELL + 2, CELL - 4, CELL - 4);
        });
        ctx.restore();
        // portals
        if (portals) portals.forEach(function (p, i) {
          var px = p[0] * CELL + CELL / 2, py = p[1] * CELL + CELL / 2;
          ctx.save();
          ctx.translate(px, py); ctx.rotate(t * (i ? -3 : 3));
          ctx.strokeStyle = '#ffffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 14; ctx.lineWidth = 2;
          for (var r = 0; r < 3; r++) { ctx.beginPath(); ctx.arc(0, 0, 4 + r * 3, r, r + 4); ctx.stroke(); }
          ctx.restore();
        });

        var bob = 1 + pulse * 0.25;
        function orb(o, color, r) {
          ctx.save();
          ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(o.x * CELL + CELL / 2, o.y * CELL + CELL / 2, r * bob, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        if (food) orb(food, FOOD, 6);
        if (gold) {
          orb(gold, GOLD, 7);
          ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(gold.x * CELL + CELL / 2, gold.y * CELL + CELL / 2, 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (gold.life / 6)); ctx.stroke();
        }
        if (power) {
          var pc = POWERS[power.kind].color, ppx = power.x * CELL + CELL / 2, ppy = power.y * CELL + CELL / 2;
          ctx.save();
          ctx.translate(ppx, ppy); ctx.rotate(t * 2);
          ctx.strokeStyle = pc; ctx.shadowColor = pc; ctx.shadowBlur = 16; ctx.lineWidth = 2.5;
          ctx.strokeRect(-7, -7, 14, 14);
          ctx.restore();
          ctx.fillStyle = pc;
          ctx.font = '900 9px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(power.kind[0].toUpperCase(), ppx, ppy + 1);
        }

        // smooth body: interpolate each segment between its last two cells
        var f = dead || stageT > 0 ? 1 : U.clamp(tick / interval(), 0, 1);
        var pts = snake.map(function (s, i) {
          var p = prevSnake[i] || prevSnake[prevSnake.length - 1] || s;
          if (Math.abs(p.x - s.x) + Math.abs(p.y - s.y) > 1) p = s;   // portal jump: no smear
          return { x: (p.x + (s.x - p.x) * f) * CELL + CELL / 2, y: (p.y + (s.y - p.y) * f) * CELL + CELL / 2 };
        });
        var ghostA = active && active.kind === 'ghost' ? 0.45 + Math.sin(t * 12) * 0.15 : 1;
        var col = dead ? '#ff5050' : theme.snake;
        function path(width, alpha, blur) {
          ctx.save();
          ctx.globalAlpha = alpha * ghostA;
          ctx.strokeStyle = col; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.shadowColor = col; ctx.shadowBlur = blur;
          ctx.beginPath();
          for (var i = 0; i < pts.length; i++) {
            var jump = i > 0 && Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y) > CELL * 1.5;
            if (i === 0 || jump) ctx.moveTo(pts[i].x, pts[i].y); else ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }
        path(15, 0.35, 18 + pulse * 10);
        path(11, 0.9, 8);
        path(4, 0.9, 0);
        // head
        var h = pts[0], dvec = DIRS[dir];
        ctx.save();
        ctx.globalAlpha = ghostA;
        ctx.fillStyle = '#ffffff'; ctx.shadowColor = col; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(h.x, h.y, 8, 0, 7); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = theme.bg;
        var ex = h.x + dvec[0] * 3, ey = h.y + dvec[1] * 3;
        ctx.beginPath();
        ctx.arc(ex - dvec[1] * 3.5, ey - dvec[0] * 3.5, 1.8, 0, 7);
        ctx.arc(ex + dvec[1] * 3.5, ey + dvec[0] * 3.5, 1.8, 0, 7);
        ctx.fill();
        ctx.restore();

        // power timer bar
        if (active) {
          ctx.fillStyle = POWERS[active.kind].color;
          ctx.fillRect(0, H - 4, W * (active.left / POWERS[active.kind].dur), 4);
          if (active.kind === 'slow') { ctx.fillStyle = 'rgba(63,240,255,0.06)'; ctx.fillRect(0, 0, W, H); }
        }
        if (stageT > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, stageT * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, H / 2 - 50, W, 100);
          U.glowText(ctx, 'STAGE ' + stage, W / 2, H / 2 - 8, 26, THEMES[(stage - 1) % THEMES.length].snake);
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#05060f';
    ctx.fillRect(0, 0, w, h);
    var cell = Math.max(6, Math.round(w / 18));
    ctx.strokeStyle = 'rgba(57,255,136,0.07)';
    ctx.beginPath();
    for (var x = 0; x < w; x += cell) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
    for (var y = 0; y < h; y += cell) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
    ctx.stroke();
    ctx.save();
    ctx.strokeStyle = COLOR; ctx.shadowColor = COLOR; ctx.shadowBlur = 12; ctx.lineWidth = cell * 0.55; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i < 40; i++) {
      var tt = t * 2.2 - i * 0.06;
      var px = w / 2 + Math.sin(tt * 0.9) * w * 0.33, py = h / 2 + Math.sin(tt * 1.7) * h * 0.28;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.shadowColor = FOOD; ctx.fillStyle = FOOD;
    ctx.beginPath(); ctx.arc(w * 0.72, h * 0.3, cell * 0.35 * (1 + Math.sin(t * 6) * 0.15), 0, 7); ctx.fill();
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_neon_snake',
    order: 1,
    title: 'Neon Snake',
    tagline: 'Grow the snake. Grow the song.',
    color: COLOR,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD · swipe on mobile',
    create: create,
    attract: attract
  });
})(window);

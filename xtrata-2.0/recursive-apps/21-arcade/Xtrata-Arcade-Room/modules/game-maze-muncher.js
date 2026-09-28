/*
 * Xtrata Arcade cartridge #13 — MAZE MUNCHER
 * Clear every data pellet from the maze while four glitches hunt you.
 * Grab a power core and the glitches turn vulnerable for a few seconds;
 * eat them back to back for 200 / 400 / 800 / 1600. Three lives.
 * Contract game-id: xa_maze_muncher (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-maze-muncher');
  var U = XA.util;

  var MAP = [
    '###################',
    '#........#........#',
    '#o##.###.#.###.##o#',
    '#.................#',
    '#.##.#.#####.#.##.#',
    '#....#...#...#....#',
    '####.###.#.###.####',
    '   #.#.......#.#   ',
    '####.#.##-##.#.####',
    'T......#HHH#......T',
    '####.#.#####.#.####',
    '   #.#.......#.#   ',
    '####.#.#####.#.####',
    '#........#........#',
    '#.##.###.#.###.##.#',
    '#o.#.....P.....#.o#',
    '##.#.#.#####.#.#.##',
    '#....#...#...#....#',
    '#.######.#.######.#',
    '#.................#',
    '###################'
  ];
  var COLS = 19, ROWS = 21, T = 22, TOP = 30;
  var W = COLS * T, H = ROWS * T + TOP + 8;
  var ACCENT = '#ffd23f', WALL = '#4d7bff';
  var GLITCH = ['#ff4d6d', '#ff8fd8', '#3ff0ff', '#ff9f1c'];
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
  var ORDER = ['up', 'left', 'down', 'right'];
  var DOOR = { x: 9, y: 8 }, HOUSE = { x: 9, y: 9 }, EXIT = { x: 9, y: 7 };
  var CORNERS = [{ x: 17, y: -2 }, { x: 1, y: -2 }, { x: 18, y: 22 }, { x: 0, y: 22 }];

  function create(api) {
    var rng = api.rng;
    var pellets, left;
    var player, glitches;
    var level = 1, lives = 3;
    var modeT = 0, chase = false, frightT = 0, eatChain = 0;
    var dying = 0, readyT = 1.2, clearT = 0, over = false, overT = 0;
    var bonus = null, bonusShown = 0;
    var t = 0;

    function cell(x, y) {
      if (y < 0 || y >= ROWS) return '#';
      x = ((x % COLS) + COLS) % COLS;
      return MAP[y][x];
    }
    function openFor(x, y, g) {
      var c = cell(x, y);
      if (c === '#' || c === ' ') return false;
      if (c === '-' || c === 'H') return !!g && (g.state === 'leaving' || g.state === 'eyes' || g.state === 'house');
      return true;
    }
    function resetPellets() {
      pellets = {}; left = 0;
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var c = MAP[y][x];
        if (c === '.' || c === 'o') { pellets[x + ',' + y] = c === 'o' ? 2 : 1; left++; }
      }
    }
    function resetActors() {
      player = { x: 9, y: 15, dir: 'left', want: 'left', mouth: 0 };
      glitches = GLITCH.map(function (c, i) {
        return { i: i, x: i === 0 ? EXIT.x : 8 + (i % 3), y: i === 0 ? EXIT.y : HOUSE.y, dir: i === 0 ? 'left' : 'up',
          state: i === 0 ? 'normal' : 'house', release: [0, 2.5, 5, 8][i] * Math.max(0.4, 1 - (level - 1) * 0.12), color: c };
      });
      modeT = 0; chase = false; frightT = 0;
    }
    resetPellets();
    resetActors();

    function speedPlayer() { return Math.min(8.6, 6.4 + level * 0.25); }
    function speedGlitch(g) {
      if (g.state === 'eyes') return 14;
      if (g.state === 'fright') return 3.6;
      if (g.state === 'house' || g.state === 'leaving') return 3.5;
      var tunnel = g.y === 9 && (g.x < 4 || g.x > 14);
      return (tunnel ? 0.55 : 1) * Math.min(8.2, 5.8 + level * 0.3);
    }
    function atCenter(e) { return Math.abs(e.x - Math.round(e.x)) < 1e-6 && Math.abs(e.y - Math.round(e.y)) < 1e-6; }
    function canGo(e, d, g) { var v = DIRS[d]; return openFor(Math.round(e.x) + v[0], Math.round(e.y) + v[1], g); }

    // Advance an actor along the grid; `decide(e)` picks a direction at each centre.
    function advance(e, dist, decide, g) {
      for (var guard = 0; guard < 12 && dist > 1e-6; guard++) {
        if (atCenter(e)) {
          e.x = Math.round(e.x); e.y = Math.round(e.y);
          if (e.x < 0) e.x += COLS; else if (e.x >= COLS) e.x -= COLS;
          decide(e);
          if (!e.dir || !canGo(e, e.dir, g)) return;
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

    function glitchTarget(g) {
      var px = Math.round(player.x), py = Math.round(player.y), pv = DIRS[player.dir] || [0, 0];
      if (g.state === 'eyes') return DOOR;
      if (g.state === 'leaving') return EXIT;
      if (!chase) return CORNERS[g.i];
      if (g.i === 0) return { x: px, y: py };
      if (g.i === 1) return { x: px + pv[0] * 4, y: py + pv[1] * 4 };
      if (g.i === 2) { var a = glitches[0]; return { x: px + pv[0] * 2 + (px + pv[0] * 2 - a.x), y: py + pv[1] * 2 + (py + pv[1] * 2 - a.y) }; }
      var d = Math.hypot(g.x - px, g.y - py);
      return d > 7 ? { x: px, y: py } : CORNERS[3];
    }
    function decideGlitch(g) {
      var x = Math.round(g.x), y = Math.round(g.y);
      if (g.state === 'eyes' && x === DOOR.x && y === DOOR.y) { g.state = 'house'; g.dir = 'down'; g.release = 1.2; return; }
      if (g.state === 'house') {
        if (y > HOUSE.y - 1 && g.release > 0) { g.dir = null; return; }
        g.state = 'leaving';
      }
      if (g.state === 'leaving' && x === EXIT.x && y === EXIT.y) g.state = frightT > 0 && g.wasFright ? 'fright' : 'normal';
      var options = ORDER.filter(function (d) { return d !== OPP[g.dir] && canGo(g, d, g); });
      if (!options.length) options = ORDER.filter(function (d) { return canGo(g, d, g); });
      if (g.state === 'fright') { g.dir = options[Math.floor(rng() * options.length)]; return; }
      var tg = glitchTarget(g);
      var best = null, bestD = 1e9;
      options.forEach(function (d) {
        var v = DIRS[d], dd = Math.pow(x + v[0] - tg.x, 2) + Math.pow(y + v[1] - tg.y, 2);
        if (dd < bestD) { bestD = dd; best = d; }
      });
      g.dir = best;
    }
    function decidePlayer(p) {
      if (p.want && canGo(p, p.want)) p.dir = p.want;
      var key = Math.round(p.x) + ',' + Math.round(p.y);
      if (pellets[key]) eat(key);
    }
    function eat(key) {
      var kind = pellets[key];
      delete pellets[key];
      left--;
      var xy = key.split(',');
      if (kind === 2) {
        api.addScore(50);
        frightT = Math.max(2, 7 - (level - 1) * 0.8);
        eatChain = 0;
        glitches.forEach(function (g) {
          if (g.state === 'normal') { g.state = 'fright'; g.dir = OPP[g.dir] || g.dir; }
          g.wasFright = true;
        });
        api.audio.arp([392, 523, 392, 523], 0.05, { type: 'square', vol: 0.14 });
      } else {
        api.addScore(10);
        api.audio.tone(t % 0.3 < 0.15 ? 520 : 440, 0.03, { type: 'triangle', vol: 0.07 });
      }
      if (!bonus && bonusShown < 2 && (left === 120 || left === 50)) {
        bonus = { x: 9, y: 11, life: 9 }; bonusShown++;
      }
      if (left <= 0) {
        clearT = 2;
        api.fx.text(W / 2, TOP + T * 10, 'MAZE CLEAR', ACCENT, 18);
        api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.2 });
      }
      void xy;
    }
    function px(x) { return x * T + T / 2; }
    function py(y) { return TOP + y * T + T / 2; }

    function loseLife() {
      dying = 1.4;
      api.shake(8);
      api.audio.tone(500, 0.9, { type: 'sawtooth', slide: 0.15, vol: 0.25 });
      api.fx.burst(px(player.x), py(player.y), ACCENT, 30, 180, 0.9);
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d) || inp.held(d)) player.want = d; });
        inp.takeSwipes().forEach(function (s) { if (DIRS[s]) player.want = s; });
        if (over) { overT += dt; if (overT > 1.2) api.gameOver(); return; }
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
          if (clearT <= 0) { level++; resetPellets(); resetActors(); readyT = 1.6; bonusShown = 0; }
          return;
        }
        if (readyT > 0) { readyT -= dt; return; }

        // reverse instantly between tiles
        if (player.want === OPP[player.dir]) player.dir = player.want;
        advance(player, speedPlayer() * dt, decidePlayer);
        player.mouth += dt * 14;

        // scatter/chase cycle; paused while frightened
        if (frightT > 0) {
          frightT -= dt;
          if (frightT <= 0) glitches.forEach(function (g) { g.wasFright = false; if (g.state === 'fright') g.state = 'normal'; });
        } else {
          modeT += dt;
          var was = chase;
          chase = !(modeT < 7 || (modeT > 27 && modeT < 34) || (modeT > 54 && modeT < 59));
          if (chase !== was) glitches.forEach(function (g) { if (g.state === 'normal') g.dir = OPP[g.dir] || g.dir; });
        }
        glitches.forEach(function (g) {
          if (g.state === 'house') {
            g.release -= dt;
            // bob in the house
            g.y = HOUSE.y + Math.sin(t * 6 + g.i) * 0.15;
            if (g.release <= 0) { g.y = HOUSE.y; g.x = HOUSE.x; g.state = 'leaving'; g.dir = 'up'; }
            return;
          }
          advance(g, speedGlitch(g) * dt, decideGlitch, g);
          if (Math.hypot(g.x - player.x, g.y - player.y) < 0.65) {
            if (g.state === 'fright') {
              eatChain++;
              var pts = 100 * Math.pow(2, Math.min(eatChain, 4));
              api.addScore(pts);
              api.fx.text(px(g.x), py(g.y), String(pts), '#3ff0ff', 12);
              api.fx.burst(px(g.x), py(g.y), '#3ff0ff', 16, 140);
              api.audio.arp([800, 1200, 1600], 0.04, { type: 'square', vol: 0.16 });
              g.state = 'eyes';
            } else if (g.state === 'normal' || g.state === 'leaving') {
              loseLife();
            }
          }
        });
        if (bonus) {
          bonus.life -= dt;
          if (Math.hypot(bonus.x - player.x, bonus.y - player.y) < 0.6) {
            var bp = 100 * level + 100;
            api.addScore(bp);
            api.fx.text(px(bonus.x), py(bonus.y), '+' + bp, '#39ff88', 12);
            api.audio.arp([659, 988], 0.06, { type: 'square', vol: 0.16 });
            bonus = null;
          } else if (bonus.life <= 0) bonus = null;
        }
        api.setStatus('LEVEL ' + level + '  ·  LIVES ' + lives + '  ·  PELLETS ' + left + (frightT > 0 ? '  ·  POWER ' + frightT.toFixed(1) : ''));
      },

      render: function (ctx) {
        ctx.fillStyle = '#04040f';
        ctx.fillRect(0, 0, W, H);
        // walls
        ctx.save();
        var flash = clearT > 0 && Math.floor(t * 6) % 2;
        ctx.strokeStyle = flash ? '#ffffff' : WALL;
        ctx.shadowColor = WALL; ctx.shadowBlur = 8; ctx.lineWidth = 2;
        for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
          var c = MAP[y][x];
          if (c !== '#') continue;
          var X = x * T, Y = TOP + y * T;
          // draw edges facing open cells for a clean outline look
          ctx.beginPath();
          if (y > 0 && MAP[y - 1][x] !== '#' && MAP[y - 1][x] !== ' ') { ctx.moveTo(X, Y + 4); ctx.lineTo(X + T, Y + 4); }
          if (y < ROWS - 1 && MAP[y + 1][x] !== '#' && MAP[y + 1][x] !== ' ') { ctx.moveTo(X, Y + T - 4); ctx.lineTo(X + T, Y + T - 4); }
          if (x > 0 && MAP[y][x - 1] !== '#' && MAP[y][x - 1] !== ' ') { ctx.moveTo(X + 4, Y); ctx.lineTo(X + 4, Y + T); }
          if (x < COLS - 1 && MAP[y][x + 1] !== '#' && MAP[y][x + 1] !== ' ') { ctx.moveTo(X + T - 4, Y); ctx.lineTo(X + T - 4, Y + T); }
          ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = '#ff8fd8';
        ctx.fillRect(DOOR.x * T + 2, TOP + DOOR.y * T + T / 2 - 1, T - 4, 3);
        // pellets
        Object.keys(pellets).forEach(function (k) {
          var xy = k.split(','), kind = pellets[k];
          if (kind === 2) {
            if (Math.floor(t * 4) % 2) return;
            ctx.save();
            ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12;
            ctx.fillRect(px(+xy[0]) - 6, py(+xy[1]) - 6, 12, 12);
            ctx.restore();
          } else {
            ctx.fillStyle = '#ffe9a8';
            ctx.fillRect(px(+xy[0]) - 2, py(+xy[1]) - 2, 4, 4);
          }
        });
        if (bonus) {
          ctx.save();
          ctx.translate(px(bonus.x), py(bonus.y)); ctx.rotate(t * 2);
          ctx.fillStyle = '#39ff88'; ctx.shadowColor = '#39ff88'; ctx.shadowBlur = 14;
          ctx.fillRect(-7, -7, 14, 14);
          ctx.restore();
        }
        // glitches: diamond bodies with a jittering scanline
        glitches.forEach(function (g) {
          var gx = px(g.x), gy = py(g.y);
          ctx.save();
          ctx.translate(gx, gy);
          if (g.state !== 'eyes') {
            var fr = g.state === 'fright';
            var blink = fr && frightT < 2 && Math.floor(t * 8) % 2;
            var col = fr ? (blink ? '#ffffff' : '#2a4dff') : g.color;
            ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(10, 0); ctx.lineTo(0, 10); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(-8, Math.sin(t * 20 + g.i) * 5, 16, 2);
          }
          var v = DIRS[g.dir] || [0, 0];
          ctx.fillStyle = '#fff';
          ctx.fillRect(-6, -4, 5, 5); ctx.fillRect(1, -4, 5, 5);
          ctx.fillStyle = '#05060f';
          ctx.fillRect(-5 + v[0] * 1.5, -3 + v[1] * 1.5, 3, 3); ctx.fillRect(2 + v[0] * 1.5, -3 + v[1] * 1.5, 3, 3);
          ctx.restore();
        });
        // player: a chomping block
        if (!(dying > 0 && dying < 1.0)) {
          var pv = DIRS[player.dir];
          var ang = Math.atan2(pv[1], pv[0]);
          var open = Math.abs(Math.sin(player.mouth)) * 0.55;
          ctx.save();
          ctx.translate(px(player.x), py(player.y));
          ctx.rotate(ang);
          if (dying > 0) ctx.scale(dying / 1.4, dying / 1.4);
          ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 14;
          // upper and lower jaws open like a trap
          ctx.save(); ctx.rotate(-open); ctx.fillRect(-9, -9, 18, 8); ctx.restore();
          ctx.save(); ctx.rotate(open); ctx.fillRect(-9, 1, 18, 8); ctx.restore();
          ctx.fillRect(-9, -9, 8, 18);
          ctx.restore();
        }
        // lives + level
        for (var l = 0; l < lives; l++) { ctx.fillStyle = ACCENT; ctx.fillRect(8 + l * 18, 10, 12, 12); }
        ctx.fillStyle = 'rgba(200,210,255,0.6)';
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('LEVEL ' + level, W - 8, 20);
        if (readyT > 0 && !over) U.glowText(ctx, 'READY', W / 2, py(11), 14, ACCENT);
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#04040f';
    ctx.fillRect(0, 0, w, h);
    var cy = h / 2, cell = h / 10;
    ctx.strokeStyle = WALL; ctx.lineWidth = 2; ctx.shadowColor = WALL; ctx.shadowBlur = 6;
    ctx.strokeRect(6, cy - cell * 1.2, w - 12, cell * 2.4);
    ctx.shadowBlur = 0;
    var x = ((t * w * 0.25) % (w + 80)) - 40;
    ctx.fillStyle = '#ffe9a8';
    for (var p = 20; p < w; p += cell) if (p > x + 10) ctx.fillRect(p, cy - 2, 4, 4);
    ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
    var open = Math.abs(Math.sin(t * 12)) * 0.5;
    ctx.save(); ctx.translate(x, cy);
    ctx.save(); ctx.rotate(-open); ctx.fillRect(-cell * 0.4, -cell * 0.4, cell * 0.8, cell * 0.35); ctx.restore();
    ctx.save(); ctx.rotate(open); ctx.fillRect(-cell * 0.4, cell * 0.05, cell * 0.8, cell * 0.35); ctx.restore();
    ctx.fillRect(-cell * 0.4, -cell * 0.4, cell * 0.35, cell * 0.8);
    ctx.restore();
    GLITCH.forEach(function (c, i) {
      var gx = x - cell * (1.6 + i * 1.1);
      ctx.fillStyle = c; ctx.shadowColor = c;
      ctx.beginPath(); ctx.moveTo(gx, cy - cell * 0.45); ctx.lineTo(gx + cell * 0.45, cy); ctx.lineTo(gx, cy + cell * 0.45); ctx.lineTo(gx - cell * 0.45, cy); ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  XA.registerGame({
    id: 'xa_maze_muncher',
    order: 13,
    title: 'Maze Muncher',
    tagline: 'Clear the maze. Turn the glitches.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD to steer · swipe on mobile',
    create: create,
    attract: attract
  });
})(window);

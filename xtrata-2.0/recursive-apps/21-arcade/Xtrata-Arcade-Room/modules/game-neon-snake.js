/*
 * Xtrata Arcade cartridge #1 — NEON SNAKE
 * Eat, grow, don't bite yourself. Speed climbs with length, quick successive
 * bites build a combo multiplier, and new wall blocks appear every 8 bites.
 * Contract game-id: xa_neon_snake (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-neon-snake');
  var U = XA.util;

  var W = 480, H = 480, CELL = 20, COLS = 24, ROWS = 24;
  var COLOR = '#39ff88', FOOD = '#ff3fa4', GOLD = '#ffd23f', WALL = '#6a7bff';
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function create(api) {
    var rng = api.rng;
    var snake = [];
    for (var i = 0; i < 4; i++) snake.push({ x: 8 - i, y: 12 });
    var dir = 'right';
    var queue = [];
    var grow = 0;
    var tick = 0;
    var walls = {};
    var food = null, gold = null;
    var eaten = 0, combo = 1, comboTimer = 0;
    var dead = false, deathT = 0;
    var t = 0;

    function key(x, y) { return x + ',' + y; }
    function occupied(x, y) {
      if (walls[key(x, y)]) return true;
      for (var i = 0; i < snake.length; i++) if (snake[i].x === x && snake[i].y === y) return true;
      return false;
    }
    function freeCell(avoidHead) {
      for (var tries = 0; tries < 500; tries++) {
        var x = 1 + rng.int(COLS - 2), y = 1 + rng.int(ROWS - 2);
        if (occupied(x, y)) continue;
        if (food && food.x === x && food.y === y) continue;
        if (gold && gold.x === x && gold.y === y) continue;
        if (avoidHead && Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < 6) continue;
        return { x: x, y: y };
      }
      return null;
    }
    function interval() {
      return Math.max(0.052, 0.125 - snake.length * 0.0016);
    }
    food = freeCell(false);

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
      api.fx.burst(h.x * CELL + CELL / 2, h.y * CELL + CELL / 2, COLOR, 40, 220, 0.9);
      api.shake(10);
      api.audio.tone(220, 0.35, { type: 'sawtooth', slide: 0.25, vol: 0.3 });
      api.audio.noise(0.3, { vol: 0.25 });
    }

    function step() {
      if (queue.length) dir = queue.shift();
      var d = DIRS[dir];
      var nx = snake[0].x + d[0], ny = snake[0].y + d[1];
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return die();
      // Moving into the tail cell is legal because the tail moves away (unless growing).
      var tail = snake[snake.length - 1];
      var hitsTail = tail.x === nx && tail.y === ny && grow === 0;
      if (occupied(nx, ny) && !hitsTail) return die();
      snake.unshift({ x: nx, y: ny });
      if (grow > 0) grow--; else snake.pop();

      var cx = nx * CELL + CELL / 2, cy = ny * CELL + CELL / 2;
      if (food && nx === food.x && ny === food.y) {
        combo = comboTimer > 0 ? Math.min(5, combo + 1) : 1;
        comboTimer = 3.2;
        var pts = 10 * combo;
        api.addScore(pts);
        api.fx.burst(cx, cy, FOOD, 18, 140);
        api.fx.text(cx, cy - 10, '+' + pts + (combo > 1 ? ' x' + combo : ''), FOOD, 12);
        api.audio.tone(520 + combo * 90, 0.08, { type: 'square', vol: 0.2 });
        grow += 2;
        eaten++;
        food = freeCell(false);
        if (eaten % 8 === 0) {
          for (var k = 0; k < 2; k++) { var w = freeCell(true); if (w) walls[key(w.x, w.y)] = true; }
          api.audio.arp([392, 523, 659], 0.06, { type: 'triangle', vol: 0.18 });
          api.setStatus('WALLS +2');
        }
        if (!gold && eaten % 5 === 0) { gold = freeCell(true); if (gold) gold.life = 6; }
      } else if (gold && nx === gold.x && ny === gold.y) {
        var g = 50 + Math.round(gold.life * 10);
        api.addScore(g);
        api.fx.burst(cx, cy, GOLD, 30, 200);
        api.fx.text(cx, cy - 10, '+' + g, GOLD, 14);
        api.audio.arp([660, 880, 1320], 0.05, { type: 'square', vol: 0.2 });
        grow += 4;
        gold = null;
      }
      api.fx.trail(cx, cy, COLOR, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
    }

    return {
      update: function (dt) {
        t += dt;
        if (dead) {
          deathT += dt;
          if (deathT > 0.9) api.gameOver();
          return;
        }
        var inp = api.input;
        ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d)) turn(d); });
        inp.takeSwipes().forEach(function (s) { if (DIRS[s]) turn(s); });
        if (comboTimer > 0) { comboTimer -= dt; if (comboTimer <= 0) combo = 1; }
        if (gold) { gold.life -= dt; if (gold.life <= 0) gold = null; }
        tick += dt;
        var iv = interval();
        while (tick >= iv && !dead) { tick -= iv; step(); }
        api.setStatus('LEN ' + snake.length + (combo > 1 ? '  COMBO x' + combo : ''));
      },
      render: function (ctx) {
        ctx.fillStyle = '#05060f';
        ctx.fillRect(0, 0, W, H);
        // grid
        ctx.strokeStyle = 'rgba(57,255,136,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gx = 0; gx <= COLS; gx++) { ctx.moveTo(gx * CELL + 0.5, 0); ctx.lineTo(gx * CELL + 0.5, H); }
        for (var gy = 0; gy <= ROWS; gy++) { ctx.moveTo(0, gy * CELL + 0.5); ctx.lineTo(W, gy * CELL + 0.5); }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(57,255,136,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, W - 2, H - 2);

        // walls
        ctx.save();
        ctx.shadowColor = WALL; ctx.shadowBlur = 10; ctx.fillStyle = WALL;
        Object.keys(walls).forEach(function (k) {
          var p = k.split(','); ctx.fillRect(+p[0] * CELL + 2, +p[1] * CELL + 2, CELL - 4, CELL - 4);
        });
        ctx.restore();

        // food
        var pulse = 1 + Math.sin(t * 8) * 0.15;
        function orb(o, color, r) {
          ctx.save();
          ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(o.x * CELL + CELL / 2, o.y * CELL + CELL / 2, r * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (food) orb(food, FOOD, 6);
        if (gold) {
          orb(gold, GOLD, 7);
          ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(gold.x * CELL + CELL / 2, gold.y * CELL + CELL / 2, 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (gold.life / 6));
          ctx.stroke();
        }

        // snake
        ctx.save();
        ctx.shadowColor = COLOR; ctx.shadowBlur = 12;
        for (var i = snake.length - 1; i >= 0; i--) {
          var s = snake[i];
          var f = 1 - i / (snake.length + 4);
          ctx.fillStyle = dead ? 'rgba(255,80,80,' + (0.3 + 0.7 * f) + ')' : 'rgba(57,255,136,' + (0.35 + 0.65 * f) + ')';
          var inset = i === 0 ? 1 : 2.5;
          U.roundRect(ctx, s.x * CELL + inset, s.y * CELL + inset, CELL - inset * 2, CELL - inset * 2, 5);
          ctx.fill();
        }
        ctx.restore();
        // eyes
        var h = snake[0], d = DIRS[dir];
        ctx.fillStyle = '#05060f';
        var ex = h.x * CELL + CELL / 2 + d[0] * 4, ey = h.y * CELL + CELL / 2 + d[1] * 4;
        ctx.beginPath();
        ctx.arc(ex - d[1] * 4, ey - d[0] * 4, 2, 0, 7);
        ctx.arc(ex + d[1] * 4, ey + d[0] * 4, 2, 0, 7);
        ctx.fill();
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
    ctx.shadowColor = COLOR; ctx.shadowBlur = 10;
    for (var i = 0; i < 16; i++) {
      var tt = t * 3 - i * 0.18;
      var px = w / 2 + Math.sin(tt * 0.9) * w * 0.33;
      var py = h / 2 + Math.sin(tt * 1.7) * h * 0.28;
      ctx.fillStyle = 'rgba(57,255,136,' + (1 - i / 18) + ')';
      ctx.fillRect(Math.round(px / cell) * cell + 1, Math.round(py / cell) * cell + 1, cell - 2, cell - 2);
    }
    ctx.shadowColor = FOOD; ctx.fillStyle = FOOD;
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.3, cell * 0.35 * (1 + Math.sin(t * 6) * 0.15), 0, 7);
    ctx.fill();
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_neon_snake',
    order: 1,
    title: 'Neon Snake',
    tagline: 'Eat. Grow. Don’t bite yourself.',
    color: COLOR,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD · swipe on mobile',
    create: create,
    attract: attract
  });
})(window);

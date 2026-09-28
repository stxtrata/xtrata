/*
 * Xtrata Arcade cartridge #2 — BLOCK DROP
 * Falling-block line clearer: 7-bag randomiser, SRS rotation + wall kicks,
 * hold, ghost piece, lock delay, back-to-back and combo scoring.
 * Contract game-id: xa_block_drop (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-drop');
  var U = XA.util;

  var W = 440, H = 580;
  var COLS = 10, ROWS = 22, HIDDEN = 2, CELL = 27;
  var BX = 16, BY = 20;                 // board origin (visible rows)
  var PX = BX + COLS * CELL + 16;       // side panel x
  var ACCENT = '#3ff0ff';

  var SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
  };
  var COLORS = { I: '#3ff0ff', O: '#ffd23f', T: '#b04dff', S: '#39ff88', Z: '#ff4d6d', J: '#4d7bff', L: '#ff9a3f' };
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

  function drawCell(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(x + 1, y + 1, size - 2, Math.max(2, size * 0.18));
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x + 1, y + size - 1 - size * 0.14, size - 2, size * 0.14);
    ctx.restore();
  }

  function create(api) {
    var rng = api.rng;
    var grid = [];
    for (var r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill(null));
    var bag = [];
    var queue = [];
    var cur = null;
    var hold = null, holdUsed = false;
    var level = 1, lines = 0, combo = -1, b2b = false;
    var fallT = 0, lockT = 0, lockResets = 0;
    var dasDir = null, dasT = 0, arrT = 0;
    var clearing = null;       // { rows:[], t }
    var over = false, overT = 0;
    var t = 0;

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
      fallT = 0; lockT = 0; lockResets = 0;
      if (!fits(cur)) { topOut(); return; }
      // Drop one row immediately if possible so the piece enters view promptly.
      if (fits(cur, cur.rot, cur.x, cur.y + 1)) cur.y++;
    }
    function topOut() {
      over = true;
      api.shake(12);
      api.audio.tone(330, 0.5, { type: 'sawtooth', slide: 0.2, vol: 0.3 });
      api.audio.noise(0.4, { vol: 0.2 });
      for (var y = HIDDEN; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        if (grid[y][x]) api.fx.burst(BX + x * CELL + CELL / 2, BY + (y - HIDDEN) * CELL + CELL / 2, grid[y][x], 2, 90);
      }
    }
    function grounded() { return !fits(cur, cur.rot, cur.x, cur.y + 1); }
    function touchLock() {
      if (grounded() && lockResets < 15) { lockT = 0; lockResets++; }
    }
    function move(dx) {
      if (cur && fits(cur, cur.rot, cur.x + dx, cur.y)) {
        cur.x += dx;
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
    function lock() {
      var cs = cells(cur);
      var color = COLORS[cur.type];
      var above = true;
      cs.forEach(function (c) {
        if (c[1] >= 0) grid[c[1]][c[0]] = color;
        if (c[1] >= HIDDEN) above = false;
      });
      api.audio.tone(140, 0.06, { type: 'square', vol: 0.12 });
      if (above) { cur = null; topOut(); return; }
      var full = [];
      for (var y = 0; y < ROWS; y++) if (grid[y].every(Boolean)) full.push(y);
      cur = null;
      holdUsed = false;
      if (full.length) {
        clearing = { rows: full, t: 0 };
        score(full.length);
        full.forEach(function (row) {
          for (var x = 0; x < COLS; x++) {
            api.fx.burst(BX + x * CELL + CELL / 2, BY + (row - HIDDEN) * CELL + CELL / 2, grid[row][x], 3, 160, 0.5);
          }
        });
      } else {
        combo = -1;
        spawn(queue.shift()); queue.push(nextType());
      }
    }
    function score(n) {
      combo++;
      var base = [0, 100, 300, 500, 800][n] * level;
      var tetris = n === 4;
      if (tetris && b2b) base = Math.floor(base * 1.5);
      b2b = tetris ? true : (n > 0 ? false : b2b);
      var bonus = combo > 0 ? 50 * combo * level : 0;
      api.addScore(base + bonus);
      lines += n;
      var label = ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD!'][n];
      var cy = BY + (clearing.rows[0] - HIDDEN) * CELL;
      api.fx.text(BX + COLS * CELL / 2, cy, label + ' +' + (base + bonus), tetris ? '#ffd23f' : ACCENT, tetris ? 16 : 13);
      if (combo > 0) api.fx.text(BX + COLS * CELL / 2, cy + 22, 'COMBO ' + combo, '#ff3fa4', 11);
      api.shake(n * 2.5);
      api.audio.arp(n === 4 ? [523, 659, 784, 1047] : [440, 554, 659].slice(0, n + 1), 0.05, { type: 'square', vol: 0.18 });
      var newLevel = 1 + Math.floor(lines / 10);
      if (newLevel > level) {
        level = newLevel;
        api.fx.text(BX + COLS * CELL / 2, BY + 200, 'LEVEL ' + level, '#ffd23f', 18);
        api.audio.arp([392, 523, 659, 784], 0.07, { type: 'triangle', vol: 0.2 });
      }
    }
    function hardDrop() {
      var gy = ghostY();
      var dist = gy - cur.y;
      for (var i = 0; i < 4; i++) {
        api.fx.trail(BX + (cur.x + 1 + Math.random() * 2) * CELL, BY + (gy - HIDDEN) * CELL, COLORS[cur.type], 0, -120);
      }
      cur.y = gy;
      api.addScore(dist * 2);
      api.shake(3);
      lock();
    }
    function doHold() {
      if (!cur || holdUsed) return;
      var t0 = cur.type;
      if (hold) spawn(hold); else { spawn(queue.shift()); queue.push(nextType()); }
      hold = t0;
      holdUsed = true;
      api.audio.tone(300, 0.06, { type: 'triangle', vol: 0.12 });
    }

    spawn(queue.shift()); queue.push(nextType());

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); inp.takeSwipes(); return; }

        if (clearing) {
          clearing.t += dt;
          if (clearing.t > 0.22) {
            clearing.rows.forEach(function (row) {
              grid.splice(row, 1);
              grid.unshift(new Array(COLS).fill(null));
            });
            clearing = null;
            spawn(queue.shift()); queue.push(nextType());
          }
          inp.takeSwipes();
          return;
        }
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

        // Gravity (soft drop while down is held)
        var g = gravity(level);
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
            if (soft) api.addScore(1);
          }
          if (cur && grounded()) fallT = 0;
        }
        api.setStatus('LV ' + level + '  LINES ' + lines);
      },

      render: function (ctx) {
        ctx.fillStyle = '#05060f';
        ctx.fillRect(0, 0, W, H);
        // board
        ctx.fillStyle = '#0a0d1e';
        ctx.fillRect(BX, BY, COLS * CELL, (ROWS - HIDDEN) * CELL);
        ctx.strokeStyle = 'rgba(63,240,255,0.06)';
        ctx.beginPath();
        for (var x = 1; x < COLS; x++) { ctx.moveTo(BX + x * CELL + 0.5, BY); ctx.lineTo(BX + x * CELL + 0.5, BY + (ROWS - HIDDEN) * CELL); }
        for (var y = 1; y < ROWS - HIDDEN; y++) { ctx.moveTo(BX, BY + y * CELL + 0.5); ctx.lineTo(BX + COLS * CELL, BY + y * CELL + 0.5); }
        ctx.stroke();
        ctx.save();
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.lineWidth = 2;
        ctx.strokeRect(BX - 2, BY - 2, COLS * CELL + 4, (ROWS - HIDDEN) * CELL + 4);
        ctx.restore();

        for (y = HIDDEN; y < ROWS; y++) for (x = 0; x < COLS; x++) {
          if (!grid[y][x]) continue;
          var flash = clearing && clearing.rows.indexOf(y) >= 0;
          drawCell(ctx, BX + x * CELL, BY + (y - HIDDEN) * CELL, CELL, flash ? '#ffffff' : grid[y][x], flash ? 1 - clearing.t * 3 : 1);
        }
        if (cur && !over) {
          var gy = ghostY();
          ctx.save();
          ctx.strokeStyle = COLORS[cur.type]; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.5;
          cells(cur, cur.rot, cur.x, gy).forEach(function (c) {
            if (c[1] >= HIDDEN) ctx.strokeRect(BX + c[0] * CELL + 2.5, BY + (c[1] - HIDDEN) * CELL + 2.5, CELL - 5, CELL - 5);
          });
          ctx.restore();
          cells(cur).forEach(function (c) {
            if (c[1] >= HIDDEN) drawCell(ctx, BX + c[0] * CELL, BY + (c[1] - HIDDEN) * CELL, CELL, COLORS[cur.type]);
          });
        }

        // side panel
        function mini(type, cx, cy, size, dim) {
          if (!type) return;
          var m = ROT[type][0];
          var minX = 9, maxX = -1, minY = 9, maxY = -1;
          for (var yy = 0; yy < m.length; yy++) for (var xx = 0; xx < m.length; xx++) if (m[yy][xx]) {
            minX = Math.min(minX, xx); maxX = Math.max(maxX, xx); minY = Math.min(minY, yy); maxY = Math.max(maxY, yy);
          }
          var w = (maxX - minX + 1) * size, h = (maxY - minY + 1) * size;
          for (yy = 0; yy < m.length; yy++) for (xx = 0; xx < m.length; xx++) if (m[yy][xx]) {
            drawCell(ctx, cx - w / 2 + (xx - minX) * size, cy - h / 2 + (yy - minY) * size, size, COLORS[type], dim ? 0.35 : 1);
          }
        }
        function label(text, yy) {
          ctx.fillStyle = 'rgba(200,220,255,0.6)';
          ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(text, PX, yy);
        }
        var pw = W - PX - 12;
        label('NEXT', BY + 10);
        ctx.strokeStyle = 'rgba(63,240,255,0.25)';
        ctx.strokeRect(PX, BY + 18, pw, 200);
        mini(queue[0], PX + pw / 2, BY + 62, 20);
        mini(queue[1], PX + pw / 2, BY + 130, 15);
        mini(queue[2], PX + pw / 2, BY + 186, 15);
        label('HOLD', BY + 246);
        ctx.strokeRect(PX, BY + 254, pw, 76);
        mini(hold, PX + pw / 2, BY + 292, 18, holdUsed);
        label('LEVEL', BY + 360);
        U.glowText(ctx, String(level), PX + pw / 2, BY + 388, 20, '#ffd23f');
        label('LINES', BY + 426);
        U.glowText(ctx, String(lines), PX + pw / 2, BY + 454, 20, ACCENT);
        if (b2b) { label('B2B', BY + 496); }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#05060f';
    ctx.fillRect(0, 0, w, h);
    var size = Math.max(6, Math.floor(h / 14));
    var cols = Math.floor(w / size);
    var ox = (w - cols * size) / 2;
    var stack = [3, 4, 2, 5, 5, 3, 1, 4, 6, 2, 3, 5, 4, 2];
    var palette = TYPES.map(function (k) { return COLORS[k]; });
    for (var x = 0; x < cols; x++) {
      var hgt = stack[x % stack.length];
      for (var y = 0; y < hgt; y++) {
        drawCell(ctx, ox + x * size, h - (y + 1) * size, size, palette[(x * 3 + y) % 7], 0.9);
      }
    }
    var cyc = (t * 0.7) % 1;
    var type = TYPES[Math.floor(t * 0.7) % 7];
    var m = ROT[type][Math.floor(t * 1.4) % 4];
    var px = ox + Math.floor(cols / 2 - 1) * size;
    var py = -size * 2 + cyc * (h - size * 6);
    for (var yy = 0; yy < m.length; yy++) for (var xx = 0; xx < m.length; xx++) if (m[yy][xx]) {
      drawCell(ctx, px + xx * size, py + yy * size, size, COLORS[type]);
    }
  }

  XA.registerGame({
    id: 'xa_block_drop',
    order: 2,
    title: 'Block Drop',
    tagline: 'Stack, clear, survive the speed-up.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'blocks',
    controls: '←→ move · ↑/X rotate · Z counter · Space drop · C hold',
    create: create,
    attract: attract
  });
})(window);

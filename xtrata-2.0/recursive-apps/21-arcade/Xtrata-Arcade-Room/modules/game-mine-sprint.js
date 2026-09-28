/*
 * Xtrata Arcade cartridge #20 — MINE SPRINT
 * Timed minesweeper runs. Clear a board to bank a speed bonus and move
 * straight on to a bigger, denser one. The first click is always safe.
 * Hit a mine and the sprint is over; everything banked so far counts.
 * Contract game-id: xa_mine_sprint (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-mine-sprint');
  var U = XA.util;

  var W = 420, H = 500, TOP = 64, AREA = 396;
  var ACCENT = '#39ff88', MINE = '#ff4d6d', FLAG = '#ffd23f';
  var NUM = ['', '#3ff0ff', '#39ff88', '#ffd23f', '#ff9f1c', '#ff4d6d', '#ff3fa4', '#b04dff', '#ffffff'];
  var BTN = { x: W - 118, y: 14, w: 106, h: 34 };

  function create(api) {
    var rng = api.rng;
    var level = 0, cols, rows, mines, cs, ox;
    var cells;               // { mine, n, open, flag }
    var placed = false, opened = 0, time = 0, flagMode = false;
    var cursor = { c: 0, r: 0 };
    var press = null;
    var over = false, overT = 0, clearT = 0, boom = null, t = 0;

    function newBoard() {
      level++;
      cols = rows = Math.min(13, 8 + level);
      mines = Math.round(cols * rows * Math.min(0.2, 0.12 + level * 0.012));
      cs = Math.floor(AREA / cols);
      ox = (W - cs * cols) / 2;
      cells = [];
      for (var i = 0; i < cols * rows; i++) cells.push({ mine: false, n: 0, open: false, flag: false });
      placed = false; opened = 0; time = 0;
      cursor = { c: Math.floor(cols / 2), r: Math.floor(rows / 2) };
    }
    function idx(c, r) { return r * cols + c; }
    function around(c, r, fn) {
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        var nc = c + dc, nr = r + dr;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) fn(nc, nr);
      }
    }
    function place(sc, sr) {
      var n = 0;
      while (n < mines) {
        var c = Math.floor(rng() * cols), r = Math.floor(rng() * rows);
        if (Math.abs(c - sc) <= 1 && Math.abs(r - sr) <= 1) continue;
        var cell = cells[idx(c, r)];
        if (cell.mine) continue;
        cell.mine = true; n++;
      }
      for (var r2 = 0; r2 < rows; r2++) for (var c2 = 0; c2 < cols; c2++) {
        var k = 0;
        around(c2, r2, function (nc, nr) { if (cells[idx(nc, nr)].mine) k++; });
        cells[idx(c2, r2)].n = k;
      }
      placed = true;
    }
    newBoard();

    function explode(c, r) {
      over = true;
      boom = { c: c, r: r };
      cells.forEach(function (cell) { if (cell.mine) cell.open = true; });
      api.fx.burst(ox + c * cs + cs / 2, TOP + r * cs + cs / 2, MINE, 50, 260, 1);
      api.shake(14);
      api.audio.noise(0.7, { vol: 0.35, cutoff: 800 });
    }
    function reveal(c, r) {
      var cell = cells[idx(c, r)];
      if (cell.open || cell.flag) return;
      if (!placed) place(c, r);
      if (cell.mine) { explode(c, r); return; }
      var stack = [[c, r]], gained = 0;
      while (stack.length) {
        var p = stack.pop(), cc = cells[idx(p[0], p[1])];
        if (cc.open || cc.flag || cc.mine) continue;
        cc.open = true; opened++; gained++;
        if (cc.n === 0) around(p[0], p[1], function (nc, nr) { stack.push([nc, nr]); });
      }
      api.addScore(gained * 2);
      api.audio.tone(gained > 1 ? 660 : 520, 0.04, { type: 'triangle', vol: 0.1 });
      if (opened === cols * rows - mines) {
        var bonus = 150 * level + Math.max(0, Math.round((40 + level * 20 - time) * 8 * level));
        api.addScore(bonus);
        api.fx.text(W / 2, TOP + 120, 'CLEARED IN ' + time.toFixed(1) + 's', ACCENT, 15);
        api.fx.text(W / 2, TOP + 150, '+' + bonus, FLAG, 15);
        api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
        cells.forEach(function (cell) { if (cell.mine) cell.flag = true; });
        clearT = 1.8;
      }
    }
    function chord(c, r) {
      var cell = cells[idx(c, r)];
      if (!cell.open || !cell.n) return;
      var flags = 0;
      around(c, r, function (nc, nr) { if (cells[idx(nc, nr)].flag) flags++; });
      if (flags !== cell.n) return;
      around(c, r, function (nc, nr) { if (!over) reveal(nc, nr); });
    }
    function toggleFlag(c, r) {
      var cell = cells[idx(c, r)];
      if (cell.open) return;
      cell.flag = !cell.flag;
      api.audio.tone(cell.flag ? 880 : 440, 0.04, { type: 'square', vol: 0.08 });
    }
    function act(c, r, flag) {
      cursor = { c: c, r: r };
      var cell = cells[idx(c, r)];
      if (cell.open) chord(c, r);
      else if (flag) toggleFlag(c, r);
      else reveal(c, r);
    }
    function cellAt(x, y) {
      var c = Math.floor((x - ox) / cs), r = Math.floor((y - TOP) / cs);
      return c >= 0 && c < cols && r >= 0 && r < rows ? { c: c, r: r } : null;
    }
    function inBtn(x, y) { return x >= BTN.x && x <= BTN.x + BTN.w && y >= BTN.y && y <= BTN.y + BTN.h; }

    return {
      // Read-only test hook.
      // Mine positions are deliberately not exposed.
      debug: function () { return { cols: cols, rows: rows, placed: placed, opened: opened, level: level }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.8) api.gameOver(); return; }
        if (clearT > 0) { clearT -= dt; if (clearT <= 0) newBoard(); return; }
        if (placed) time += dt;

        // pointer: tap = reveal (or flag in flag mode), long-press = flag
        var p = api.pointer();
        if (inp.hit('hold')) press = { x: p.x, y: p.y, t: t, done: false };
        if (press && !press.done && p.down && t - press.t > 0.38) {
          var lc = cellAt(press.x, press.y);
          if (lc && !cells[idx(lc.c, lc.r)].open) { toggleFlag(lc.c, lc.r); api.shake(1.5); }
          press.done = true;
        }
        if (inp.hit('release') && press) {
          if (!press.done) {
            if (inBtn(press.x, press.y)) { flagMode = !flagMode; api.audio.tone(700, 0.05, { type: 'triangle', vol: 0.1 }); }
            else { var pc = cellAt(press.x, press.y); if (pc) act(pc.c, pc.r, flagMode); }
          }
          press = null;
        }
        // keyboard cursor
        if (inp.hit('left')) cursor.c = Math.max(0, cursor.c - 1);
        if (inp.hit('right')) cursor.c = Math.min(cols - 1, cursor.c + 1);
        if (inp.hit('up')) cursor.r = Math.max(0, cursor.r - 1);
        if (inp.hit('down')) cursor.r = Math.min(rows - 1, cursor.r + 1);
        if (inp.hit('a')) act(cursor.c, cursor.r, false);
        if (inp.hit('f') || inp.hit('d')) act(cursor.c, cursor.r, true);
        var flags = cells.filter(function (c) { return c.flag; }).length;
        api.setStatus('BOARD ' + level + '  ·  ' + cols + '×' + rows + '  ·  MINES ' + (mines - flags) + '  ·  ' + time.toFixed(1) + 's');
      },

      render: function (ctx) {
        ctx.fillStyle = '#05070f';
        ctx.fillRect(0, 0, W, H);
        // timer + mines
        U.glowText(ctx, time.toFixed(1) + 's', 70, 31, 16, ACCENT);
        // flag mode toggle
        ctx.save();
        ctx.fillStyle = flagMode ? 'rgba(255,210,63,0.2)' : 'rgba(255,255,255,0.05)';
        ctx.strokeStyle = flagMode ? FLAG : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
        U.roundRect(ctx, BTN.x, BTN.y, BTN.w, BTN.h, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = flagMode ? FLAG : 'rgba(255,255,255,0.7)';
        ctx.font = '800 12px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(flagMode ? '⚑ FLAG MODE' : '⚑ FLAG: OFF', BTN.x + BTN.w / 2, BTN.y + BTN.h / 2 + 1);
        ctx.restore();

        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          var cell = cells[idx(c, r)];
          var x = ox + c * cs, y = TOP + r * cs;
          if (cell.open) {
            ctx.fillStyle = cell.mine ? (boom && boom.c === c && boom.r === r ? '#5a0f1f' : '#2a0f18') : '#0d1422';
            ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
            if (cell.mine) {
              ctx.save();
              ctx.fillStyle = MINE; ctx.shadowColor = MINE; ctx.shadowBlur = 10;
              ctx.beginPath(); ctx.arc(x + cs / 2, y + cs / 2, cs * 0.24, 0, 7); ctx.fill();
              ctx.fillRect(x + cs / 2 - 1, y + cs * 0.15, 2, cs * 0.7);
              ctx.fillRect(x + cs * 0.15, y + cs / 2 - 1, cs * 0.7, 2);
              ctx.restore();
            } else if (cell.n) {
              ctx.fillStyle = NUM[cell.n];
              ctx.font = '900 ' + Math.floor(cs * 0.55) + 'px ui-monospace, Menlo, Consolas, monospace';
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(String(cell.n), x + cs / 2, y + cs / 2 + 1);
            }
          } else {
            ctx.fillStyle = '#1b2446';
            ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fillRect(x + 1, y + 1, cs - 2, 3);
            if (cell.flag) {
              ctx.save();
              ctx.fillStyle = FLAG; ctx.shadowColor = FLAG; ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.moveTo(x + cs * 0.35, y + cs * 0.2); ctx.lineTo(x + cs * 0.72, y + cs * 0.35); ctx.lineTo(x + cs * 0.35, y + cs * 0.5);
              ctx.fill();
              ctx.fillRect(x + cs * 0.33, y + cs * 0.2, 2, cs * 0.6);
              ctx.restore();
            }
          }
        }
        // keyboard cursor
        ctx.strokeStyle = 'rgba(57,255,136,0.8)'; ctx.lineWidth = 2;
        ctx.strokeRect(ox + cursor.c * cs + 1, TOP + cursor.r * cs + 1, cs - 2, cs - 2);
        // long-press progress
        if (press && !press.done && api.pointer().down) {
          var k = Math.min(1, (t - press.t) / 0.38);
          if (k > 0.2) {
            ctx.strokeStyle = FLAG; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(press.x, press.y, 18, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.stroke();
          }
        }
        if (!placed && !over) {
          ctx.fillStyle = 'rgba(200,255,220,0.7)';
          ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('FIRST TAP IS ALWAYS SAFE · HOLD TO FLAG', W / 2, H - 14);
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, w, h);
    var n = 8, cs = Math.min(w, h) * 0.9 / n, ox = (w - cs * n) / 2, oy = (h - cs * n) / 2;
    var reveal = (t * 6) % (n * n + 20);
    var nums = [0, 1, 1, 2, 0, 1, 3, 2];
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var i = r * n + c, x = ox + c * cs, y = oy + r * cs;
      var order = (i * 29) % (n * n);
      if (order < reveal) {
        ctx.fillStyle = '#0d1422'; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        var v = nums[(r * 3 + c * 5) % 8];
        if (v) { ctx.fillStyle = NUM[v]; ctx.font = '900 ' + Math.floor(cs * 0.55) + 'px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(v), x + cs / 2, y + cs / 2); }
      } else {
        ctx.fillStyle = '#1b2446'; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        if ((i * 7) % 11 === 0) { ctx.fillStyle = FLAG; ctx.fillRect(x + cs * 0.35, y + cs * 0.25, cs * 0.3, cs * 0.25); }
      }
    }
  }

  XA.registerGame({
    id: 'xa_mine_sprint',
    order: 20,
    title: 'Mine Sprint',
    tagline: 'Sweep fast. Don’t guess wrong.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP TO REVEAL · HOLD (OR FLAG MODE) TO FLAG',
    controls: 'Click reveal · hold to flag · or arrows + Space, F to flag',
    create: create,
    attract: attract
  });
})(window);

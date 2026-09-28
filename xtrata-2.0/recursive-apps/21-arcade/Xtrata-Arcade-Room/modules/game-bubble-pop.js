/*
 * Xtrata Arcade cartridge #16 — BUBBLE POP
 * Aim and fire orbs into the cluster. Three or more of a colour pop, and
 * anything left hanging drops for a bigger bonus. Miss too often and the
 * ceiling pushes down. Clear the board for a new one.
 * Contract game-id: xa_bubble_pop (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-bubble-pop');
  var U = XA.util;

  var W = 420, H = 600, R = 18, D = R * 2, COLS = 11, ROWH = R * 1.732;
  var LEFT = (W - COLS * D) / 2, TOP = 40, MAX_ROWS = 14;
  var SX = W / 2, SY = 548, SPEED = 880;
  var ACCENT = '#ff8fd8';
  var PALETTE = ['#ff4d6d', '#ffd23f', '#39ff88', '#3ff0ff', '#b04dff', '#ff9f1c'];

  function create(api) {
    var rng = api.rng;
    var grid = [];          // grid[r][c] = colour index or -1
    var parity = 0;         // which rows are shifted right by R
    var colours = 4;
    var board = 1;
    var aim = -Math.PI / 2, lastMoved = api.pointer().moved;
    var shot = null, current, next;
    var misses = 0, missLimit = 6;
    var over = false, overT = 0, clearT = 0, t = 0;
    var falling = [];

    function shifted(r) { return (r + parity) % 2 === 1; }
    function cols(r) { return shifted(r) ? COLS - 1 : COLS; }
    function cx(r, c) { return LEFT + R + c * D + (shifted(r) ? R : 0); }
    function cy(r) { return TOP + R + r * ROWH; }
    function get(r, c) { return r >= 0 && r < grid.length && c >= 0 && c < cols(r) ? grid[r][c] : -1; }
    function emptyRow(r) { var a = []; for (var c = 0; c < cols(r); c++) a.push(-1); return a; }
    function ensureRows(n) { while (grid.length < n) grid.push(emptyRow(grid.length)); }
    function neighbours(r, c) {
      var s = shifted(r), out = [[r, c - 1], [r, c + 1]];
      var dcs = s ? [0, 1] : [-1, 0];
      dcs.forEach(function (d) { out.push([r - 1, c + d]); out.push([r + 1, c + d]); });
      return out.filter(function (p) { return p[0] >= 0 && p[1] >= 0 && p[1] < cols(p[0]); });
    }
    function fillBoard() {
      grid = []; parity = 0;
      colours = Math.min(6, 3 + board);
      var rows = Math.min(8, 4 + board);
      for (var r = 0; r < rows; r++) {
        grid.push([]);
        for (var c = 0; c < cols(r); c++) {
          // clumpy colours: often copy the neighbour above or to the left
          var col = Math.floor(rng() * colours);
          if (c > 0 && rng() < 0.35) col = grid[r][c - 1];
          else if (r > 0 && rng() < 0.3) col = get(r - 1, Math.min(c, cols(r - 1) - 1));
          grid[r].push(col);
        }
      }
      ensureRows(MAX_ROWS + 1);
    }
    function present() {
      var set = {};
      grid.forEach(function (row) { row.forEach(function (v) { if (v >= 0) set[v] = true; }); });
      var list = Object.keys(set).map(Number);
      return list.length ? list : [0];
    }
    function pick() { var p = present(); return p[Math.floor(rng() * p.length)]; }
    fillBoard();
    current = pick(); next = pick();

    function pushCeiling() {
      grid.unshift(null);
      parity ^= 1;
      grid[0] = [];
      for (var c = 0; c < cols(0); c++) grid[0].push(present()[Math.floor(rng() * present().length)]);
      grid.length = Math.max(grid.length, MAX_ROWS + 1);
      // rows keep their own lengths after the parity flip: rebuild widths
      for (var r = 1; r < grid.length; r++) {
        if (!grid[r]) grid[r] = emptyRow(r);
        while (grid[r].length > cols(r)) grid[r].pop();
        while (grid[r].length < cols(r)) grid[r].push(-1);
      }
      api.shake(5);
      api.audio.tone(90, 0.3, { type: 'square', vol: 0.18 });
      api.fx.text(W / 2, TOP + 20, 'CEILING DROP', ACCENT, 12);
    }
    function lowestRow() {
      for (var r = grid.length - 1; r >= 0; r--) if (grid[r].some(function (v) { return v >= 0; })) return r;
      return -1;
    }

    function snap(x, y) {
      var r = U.clamp(Math.round((y - TOP - R) / ROWH), 0, grid.length - 1);
      var best = null, bd = 1e9;
      for (var rr = Math.max(0, r - 1); rr <= Math.min(grid.length - 1, r + 1); rr++) {
        for (var c = 0; c < cols(rr); c++) {
          if (grid[rr][c] >= 0) continue;
          var ok = rr === 0 || neighbours(rr, c).some(function (p) { return get(p[0], p[1]) >= 0; });
          if (!ok) continue;
          var d = Math.hypot(cx(rr, c) - x, cy(rr) - y);
          if (d < bd) { bd = d; best = [rr, c]; }
        }
      }
      return best;
    }
    function settle(r, c, colour) {
      grid[r][c] = colour;
      // flood same colour
      var seen = {}, group = [], stack = [[r, c]];
      while (stack.length) {
        var p = stack.pop(), k = p[0] + ',' + p[1];
        if (seen[k] || get(p[0], p[1]) !== colour) continue;
        seen[k] = true; group.push(p);
        neighbours(p[0], p[1]).forEach(function (n) { stack.push(n); });
      }
      if (group.length >= 3) {
        misses = 0;
        group.forEach(function (p) {
          grid[p[0]][p[1]] = -1;
          api.fx.burst(cx(p[0], p[1]), cy(p[0]), PALETTE[colour], 10, 140, 0.45);
        });
        var pts = group.length * 10 + Math.max(0, group.length - 3) * 10;
        api.addScore(pts);
        api.audio.arp([523, 659, 784].slice(0, Math.min(3, group.length - 1)), 0.04, { type: 'triangle', vol: 0.16 });
        // drop anything no longer connected to the ceiling
        var anchored = {}, st = [];
        for (var c0 = 0; c0 < cols(0); c0++) if (grid[0][c0] >= 0) st.push([0, c0]);
        while (st.length) {
          var q = st.pop(), kk = q[0] + ',' + q[1];
          if (anchored[kk] || get(q[0], q[1]) < 0) continue;
          anchored[kk] = true;
          neighbours(q[0], q[1]).forEach(function (n) { st.push(n); });
        }
        var dropped = 0;
        for (var rr = 0; rr < grid.length; rr++) for (var cc = 0; cc < cols(rr); cc++) {
          if (grid[rr][cc] >= 0 && !anchored[rr + ',' + cc]) {
            falling.push({ x: cx(rr, cc), y: cy(rr), vy: -60 - rng() * 80, vx: (rng() - 0.5) * 80, c: grid[rr][cc] });
            grid[rr][cc] = -1;
            dropped++;
          }
        }
        if (dropped) {
          var dp = 20 * dropped * Math.min(8, dropped);
          api.addScore(dp);
          api.fx.text(W / 2, cy(r) + 30, 'DROP x' + dropped + '  +' + dp, '#ffd23f', 13);
          api.audio.arp([392, 523, 659, 784, 1047].slice(0, Math.min(5, dropped + 1)), 0.05, { type: 'square', vol: 0.16 });
        }
        if (lowestRow() < 0) {
          var bonus = 1000 * board;
          api.addScore(bonus);
          api.fx.text(W / 2, H / 2, 'BOARD CLEAR +' + bonus, '#39ff88', 16);
          clearT = 1.5;
        }
      } else {
        misses++;
        api.audio.tone(260, 0.05, { type: 'square', vol: 0.1 });
        if (misses >= missLimit) { misses = 0; pushCeiling(); }
      }
      if (lowestRow() >= MAX_ROWS - 1) {
        over = true;
        api.shake(12);
        api.audio.tone(140, 0.6, { type: 'sawtooth', vol: 0.28, slide: 0.4 });
      }
    }

    function fire() {
      if (shot || over || clearT > 0) return;
      shot = { x: SX, y: SY, vx: Math.cos(aim) * SPEED, vy: Math.sin(aim) * SPEED, c: current };
      current = next; next = pick();
      api.audio.tone(600, 0.05, { type: 'triangle', vol: 0.12, slide: 1.5 });
    }

    return {
      // Read-only test hook.
      debug: function () { var n = 0; grid.forEach(function (row) { row.forEach(function (v) { if (v >= 0) n++; }); }); return { bubbles: n, board: board }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        falling.forEach(function (f) { f.vy += 1400 * dt; f.x += f.vx * dt; f.y += f.vy * dt; });
        falling = falling.filter(function (f) { return f.y < H + 40; });
        if (over) { overT += dt; if (overT > 1.3) api.gameOver(); return; }
        if (clearT > 0) {
          clearT -= dt;
          if (clearT <= 0) { board++; fillBoard(); misses = 0; current = pick(); next = pick(); }
          return;
        }
        // aim with the pointer when it moves, or with the keys
        var p = api.pointer();
        if (p.moved !== lastMoved) {
          lastMoved = p.moved;
          if (p.y < SY - 10) aim = Math.atan2(p.y - SY, p.x - SX);
        }
        if (inp.held('left')) aim -= 1.6 * dt;
        if (inp.held('right')) aim += 1.6 * dt;
        aim = U.clamp(aim, -Math.PI + 0.16, -0.16);
        if (inp.hit('release') || inp.hit('a') || inp.hit('up')) fire();
        if (inp.hit('d') || inp.hit('b')) { var tmp = current; current = next; next = tmp; }

        if (shot) {
          var steps = 4;
          for (var s = 0; s < steps && shot; s++) {
            shot.x += shot.vx * dt / steps; shot.y += shot.vy * dt / steps;
            if (shot.x < LEFT + R) { shot.x = LEFT + R; shot.vx = Math.abs(shot.vx); }
            if (shot.x > W - LEFT - R) { shot.x = W - LEFT - R; shot.vx = -Math.abs(shot.vx); }
            var hit = shot.y <= TOP + R;
            if (!hit) {
              for (var r = 0; r < grid.length && !hit; r++) for (var c = 0; c < cols(r); c++) {
                if (grid[r][c] >= 0 && Math.hypot(cx(r, c) - shot.x, cy(r) - shot.y) < D * 0.86) { hit = true; break; }
              }
            }
            if (hit) {
              var cell = snap(shot.x, shot.y);
              var col = shot.c;
              shot = null;
              if (cell) settle(cell[0], cell[1], col);
            }
          }
        }
        var rowsLeft = MAX_ROWS - 1 - lowestRow();
        api.setStatus('BOARD ' + board + '  ·  CEILING IN ' + (missLimit - misses) + '  ·  ROWS LEFT ' + rowsLeft);
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#140a26'); g.addColorStop(1, '#05030e');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // frame + danger line
        ctx.strokeStyle = 'rgba(255,143,216,0.35)'; ctx.lineWidth = 2;
        ctx.strokeRect(LEFT - 3, TOP - 3, COLS * D + 6, SY - TOP + 20);
        ctx.save();
        ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,77,109,0.5)';
        var dl = cy(MAX_ROWS - 1) - R;
        ctx.beginPath(); ctx.moveTo(LEFT, dl); ctx.lineTo(W - LEFT, dl); ctx.stroke();
        ctx.restore();
        // ceiling pressure bar
        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(LEFT, TOP - 12, (COLS * D) * (misses / missLimit), 4);

        function orb(x, y, colour, alpha) {
          ctx.save();
          ctx.globalAlpha = alpha == null ? 1 : alpha;
          var gg = ctx.createRadialGradient(x - R * 0.35, y - R * 0.4, 2, x, y, R);
          gg.addColorStop(0, '#ffffff'); gg.addColorStop(0.25, PALETTE[colour]); gg.addColorStop(1, 'rgba(0,0,0,0.6)');
          ctx.fillStyle = gg;
          ctx.shadowColor = PALETTE[colour]; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(x, y, R - 1, 0, 7); ctx.fill();
          ctx.restore();
        }
        for (var r = 0; r < grid.length; r++) for (var c = 0; c < cols(r); c++) if (grid[r][c] >= 0) orb(cx(r, c), cy(r), grid[r][c]);
        falling.forEach(function (f) { orb(f.x, f.y, f.c, 0.9); });

        // aim guide with one bounce
        if (!over) {
          ctx.save();
          ctx.setLineDash([2, 8]);
          ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
          var x = SX, y = SY, vx = Math.cos(aim), vy = Math.sin(aim), len = 0;
          ctx.beginPath(); ctx.moveTo(x, y);
          while (len < 520 && y > TOP) {
            x += vx * 6; y += vy * 6; len += 6;
            if (x < LEFT + R || x > W - LEFT - R) { vx = -vx; ctx.lineTo(x, y); }
          }
          ctx.lineTo(x, y); ctx.stroke();
          ctx.restore();
        }
        // launcher
        ctx.save();
        ctx.translate(SX, SY); ctx.rotate(aim + Math.PI / 2);
        ctx.fillStyle = '#2a1f4a'; ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.fillRect(-8, -34, 16, 34); ctx.strokeRect(-8, -34, 16, 34);
        ctx.restore();
        orb(SX, SY, current);
        ctx.save(); ctx.translate(SX + 62, SY + 16); ctx.scale(0.7, 0.7); orb(0, 0, next); ctx.restore();
        ctx.fillStyle = 'rgba(255,220,240,0.5)';
        ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NEXT', SX + 62, SY + 44);
        if (shot) orb(shot.x, shot.y, shot.c);
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#100820';
    ctx.fillRect(0, 0, w, h);
    var r = Math.max(5, w / 22);
    for (var row = 0; row < 5; row++) {
      var n = Math.floor(w / (r * 2)) - (row % 2);
      for (var c = 0; c < n; c++) {
        if ((row * 7 + c * 3 + Math.floor(t)) % 9 === 0 && row > 2) continue;
        ctx.fillStyle = PALETTE[(row * 3 + c * 5 + (c > 4 ? 1 : 0)) % 5];
        ctx.beginPath(); ctx.arc(r + c * r * 2 + (row % 2 ? r : 0), r + row * r * 1.73, r - 1, 0, 7); ctx.fill();
      }
    }
    var a = -Math.PI / 2 + Math.sin(t * 1.3) * 0.7;
    var k = (t * 0.8) % 1;
    ctx.fillStyle = PALETTE[Math.floor(t * 0.8) % 5];
    ctx.shadowColor = '#fff'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(w / 2 + Math.cos(a) * k * h * 0.5, h * 0.92 + Math.sin(a) * k * h * 0.5, r - 1, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
  }

  XA.registerGame({
    id: 'xa_bubble_pop',
    order: 16,
    title: 'Bubble Pop',
    tagline: 'Match three. Drop the rest.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO AIM · LIFT YOUR FINGER TO FIRE',
    controls: 'Mouse aim + click · or ←→ aim, Space fire, C swap',
    create: create,
    attract: attract
  });
})(window);

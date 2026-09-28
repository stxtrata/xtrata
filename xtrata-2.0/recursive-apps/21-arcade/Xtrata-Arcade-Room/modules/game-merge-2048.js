/*
 * Xtrata Arcade cartridge #11 — MERGE 2048
 * Slide the whole grid; equal tiles merge and add their value to your
 * score. A new 2 (or sometimes 4) appears after every move. Reaching 2048
 * is a milestone, not the end: keep going until no move is left.
 * Contract game-id: xa_merge_2048 (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-merge-2048');
  var U = XA.util;

  var W = 440, H = 520, N = 4, PAD = 12, BOARD = 416, BX = (W - BOARD) / 2, BY = 88;
  var CELL = (BOARD - PAD * (N + 1)) / N;
  var SLIDE = 0.1;
  var ACCENT = '#ffae3f';
  var COLORS = {
    2: '#2b3a7a', 4: '#34479a', 8: '#b04dff', 16: '#d43fd8', 32: '#ff3fa4', 64: '#ff4d6d',
    128: '#ff9f1c', 256: '#ffd23f', 512: '#39ff88', 1024: '#3ff0ff', 2048: '#ffffff'
  };

  function create(api) {
    var rng = api.rng;
    var grid = [];           // grid[r][c] = tile | null
    var tiles = [];          // all live tiles (for drawing and animation)
    var nextId = 1;
    var anim = 0;            // >0 while tiles slide
    var best = 2, reached2048 = false;
    var moves = 0;
    var over = false, overT = 0;
    var t = 0;
    for (var r = 0; r < N; r++) grid.push([null, null, null, null]);

    function cellX(c) { return BX + PAD + c * (CELL + PAD); }
    function cellY(r) { return BY + PAD + r * (CELL + PAD); }
    function spawn() {
      var empty = [];
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (!grid[r][c]) empty.push([r, c]);
      if (!empty.length) return;
      var e = empty[Math.floor(rng() * empty.length)];
      var tile = { id: nextId++, v: rng() < 0.9 ? 2 : 4, r: e[0], c: e[1], fr: e[0], fc: e[1], born: 0.12, pop: 0 };
      grid[e[0]][e[1]] = tile;
      tiles.push(tile);
    }
    spawn(); spawn();

    function canMove() {
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var tl = grid[r][c];
        if (!tl) return true;
        if (c < N - 1 && grid[r][c + 1] && grid[r][c + 1].v === tl.v) return true;
        if (r < N - 1 && grid[r + 1][c] && grid[r + 1][c].v === tl.v) return true;
      }
      return false;
    }

    function move(dir) {
      if (anim > 0 || over) return;
      var dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
      var dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
      var order = [0, 1, 2, 3];
      if (dr > 0 || dc > 0) order.reverse();
      var moved = false, gained = 0, merges = 0;
      tiles.forEach(function (tl) { tl.fr = tl.r; tl.fc = tl.c; tl.merged = false; });
      var dead = [];
      order.forEach(function (i) {
        order.forEach(function (j) {
          var r = dr ? i : j, c = dc ? i : j;
          var tl = grid[r][c];
          if (!tl) return;
          var nr = r, nc = c;
          while (true) {
            var tr = nr + dr, tc = nc + dc;
            if (tr < 0 || tr >= N || tc < 0 || tc >= N) break;
            var other = grid[tr][tc];
            if (!other) { nr = tr; nc = tc; continue; }
            if (other.v === tl.v && !other.merged && !tl.merged) {
              // merge into `other`; `tl` slides onto it and disappears
              grid[r][c] = null;
              tl.r = tr; tl.c = tc;
              other.v *= 2;
              other.merged = true;
              other.pop = 0.18;
              dead.push(tl);
              gained += other.v;
              merges++;
              if (other.v > best) best = other.v;
              moved = true;
              return;
            }
            break;
          }
          if (nr !== r || nc !== c) {
            grid[r][c] = null;
            grid[nr][nc] = tl;
            tl.r = nr; tl.c = nc;
            moved = true;
          }
        });
      });
      if (!moved) { api.audio.tone(140, 0.04, { type: 'square', vol: 0.05 }); return; }
      moves++;
      anim = SLIDE;
      dead.forEach(function (d) { d.dying = true; });
      api.audio.tone(merges ? 330 + Math.log2(best) * 30 : 220, 0.06, { type: 'triangle', vol: merges ? 0.16 : 0.08 });
      if (gained) {
        api.addScore(gained);
        if (merges > 1) api.fx.text(W - 80, 44, merges + ' MERGES +' + gained, ACCENT, 11);
      }
      if (best >= 2048 && !reached2048) {
        reached2048 = true;
        api.fx.text(W / 2, BY + BOARD / 2, '2048!', '#ffffff', 28);
        api.fx.burst(W / 2, BY + BOARD / 2, '#ffd23f', 80, 300, 1.2);
        api.shake(10);
        api.audio.arp([523, 659, 784, 1047, 1319, 1568], 0.08, { type: 'square', vol: 0.2 });
      }
    }

    function afterSlide() {
      tiles = tiles.filter(function (tl) {
        if (tl.dying) {
          api.fx.burst(cellX(tl.c) + CELL / 2, cellY(tl.r) + CELL / 2, COLORS[Math.min(tl.v * 2, 2048)] || '#fff', 8, 110, 0.35);
          return false;
        }
        return true;
      });
      tiles.forEach(function (tl) { tl.fr = tl.r; tl.fc = tl.c; });
      spawn();
      if (!canMove()) {
        over = true;
        api.shake(6);
        api.audio.tone(200, 0.5, { type: 'sawtooth', slide: 0.5, vol: 0.25 });
      }
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var dirs = [];
        ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d)) dirs.push(d); });
        inp.takeSwipes().forEach(function (s) { if (s !== 'tap') dirs.push(s); });
        if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }
        if (anim > 0) {
          anim -= dt;
          if (anim <= 0) { anim = 0; afterSlide(); }
        } else if (dirs.length) move(dirs[0]);
        tiles.forEach(function (tl) {
          if (tl.born > 0) tl.born = Math.max(0, tl.born - dt);
          if (tl.pop > 0 && anim === 0) tl.pop = Math.max(0, tl.pop - dt);
        });
        api.setStatus('BEST TILE ' + best + '  ·  MOVES ' + moves);
      },

      render: function (ctx) {
        ctx.fillStyle = '#07071a';
        ctx.fillRect(0, 0, W, H);
        U.glowText(ctx, String(best), W / 2, 44, 30, COLORS[Math.min(best, 2048)] || '#fff');
        ctx.fillStyle = 'rgba(200,210,255,0.45)';
        ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BEST TILE', W / 2, 72);

        ctx.save();
        ctx.fillStyle = '#10122e';
        ctx.shadowColor = ACCENT; ctx.shadowBlur = 16;
        U.roundRect(ctx, BX, BY, BOARD, BOARD, 14); ctx.fill();
        ctx.restore();
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          U.roundRect(ctx, cellX(c), cellY(r), CELL, CELL, 10); ctx.fill();
        }
        var k = anim > 0 ? 1 - anim / SLIDE : 1;
        var ease = 1 - Math.pow(1 - k, 3);
        tiles.slice().sort(function (a, b) { return (a.dying ? 0 : 1) - (b.dying ? 0 : 1); }).forEach(function (tl) {
          var x = cellX(tl.fc) + (cellX(tl.c) - cellX(tl.fc)) * ease;
          var y = cellY(tl.fr) + (cellY(tl.r) - cellY(tl.fr)) * ease;
          var s = 1;
          if (tl.born > 0) s = 1 - tl.born / 0.12;
          if (tl.pop > 0 && anim === 0) s = 1 + Math.sin((tl.pop / 0.18) * Math.PI) * 0.12;
          var v = tl.dying ? tl.v : tl.v;
          var col = COLORS[Math.min(v, 2048)] || '#ffffff';
          ctx.save();
          ctx.translate(x + CELL / 2, y + CELL / 2);
          ctx.scale(s, s);
          ctx.fillStyle = col;
          ctx.shadowColor = col; ctx.shadowBlur = v >= 128 ? 22 : 8;
          U.roundRect(ctx, -CELL / 2, -CELL / 2, CELL, CELL, 10); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = v >= 256 && v !== 512 ? '#1a1030' : '#ffffff';
          var size = v < 100 ? 38 : v < 1000 ? 32 : v < 10000 ? 26 : 20;
          ctx.font = '900 ' + size + 'px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(v), 0, 2);
          ctx.restore();
        });
        if (moves === 0 && !over) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'SWIPE OR USE THE ARROWS', W / 2, H - 6, 11, '#ffe2bd');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#07071a';
    ctx.fillRect(0, 0, w, h);
    var size = Math.min(w, h) * 0.8, cell = size / 4, x0 = (w - size) / 2, y0 = (h - size) / 2;
    var vals = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var idx = (r * 4 + c + Math.floor(t)) % 13;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x0 + c * cell + 3, y0 + r * cell + 3, cell - 6, cell - 6);
      if (idx >= vals.length || (r + c + Math.floor(t)) % 3 === 0) continue;
      var v = vals[idx];
      ctx.fillStyle = COLORS[v];
      ctx.fillRect(x0 + c * cell + 3, y0 + r * cell + 3, cell - 6, cell - 6);
      ctx.fillStyle = v >= 256 && v !== 512 ? '#1a1030' : '#fff';
      ctx.font = '900 ' + Math.floor(cell * (v < 100 ? 0.38 : v < 1000 ? 0.3 : 0.24)) + 'px ui-monospace, Menlo, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(v), x0 + c * cell + cell / 2, y0 + r * cell + cell / 2);
    }
  }

  XA.registerGame({
    id: 'xa_merge_2048',
    order: 11,
    title: 'Merge 2048',
    tagline: 'Slide, merge, reach 2048 and beyond.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD or swipe to slide the grid',
    create: create,
    attract: attract
  });
})(window);

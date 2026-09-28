/*
 * Xtrata Arcade cartridge #3 — CAVE DIVER
 * One button: hold to swim up, release to sink. Thread an endless cave that
 * narrows and speeds up; grab pearls for a combo, skim walls for CLOSE bonus.
 * Contract game-id: xa_cave_diver (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-cave-diver');
  var U = XA.util;

  var W = 600, H = 400, COL = 12, PLAYER_X = 150, R = 9;
  var ACCENT = '#ff9a3f', WALL = '#19c3b0', PEARL = '#ffe66d', JELLY = '#ff4fd8';

  function create(api) {
    var rng = api.rng;
    var cols = [];          // { top, bot } per COL-wide world column
    var firstCol = 0;       // world index of cols[0]
    var center = H / 2, drift = 0;
    var dist = 0, speed = 190;
    var y = H / 2, vy = 0;
    var started = false, dead = false, deadT = 0;
    var pearls = [], jellies = [];
    var pickups = 0, bonus = 0, chain = 0, closeCd = 0, bubbleT = 0;
    var t = 0;

    function gapFor(d) { return U.lerp(250, 118, U.clamp(d / 14000, 0, 1)); }
    function genCol(index) {
      var d = index * COL;
      drift += (rng() - 0.5) * 3.2;
      drift *= 0.94;
      center += drift;
      var gap = gapFor(d);
      var margin = 26;
      center = U.clamp(center, margin + gap / 2, H - margin - gap / 2);
      var wobble = Math.sin(index * 0.35) * 6;
      var c = { top: center - gap / 2 + wobble, bot: center + gap / 2 + wobble };
      // Spawn pickups and hazards inside the gap.
      if (index > 40 && rng() < 0.045) {
        pearls.push({ x: d, y: U.lerp(c.top + 22, c.bot - 22, rng()), got: false });
      }
      if (d > 2500 && rng() < 0.012 + U.clamp(d / 60000, 0, 0.02)) {
        jellies.push({ x: d, baseY: (c.top + c.bot) / 2, amp: (c.bot - c.top) * 0.28, phase: rng() * 6, r: 11 });
      }
      return c;
    }
    function colAt(worldX) {
      var i = Math.floor(worldX / COL) - firstCol;
      return cols[U.clamp(i, 0, cols.length - 1)];
    }
    function fill() {
      var need = Math.ceil((dist + W + COL * 4) / COL);
      while (firstCol + cols.length < need) cols.push(genCol(firstCol + cols.length));
      var drop = Math.floor((dist - COL * 4) / COL) - firstCol;
      if (drop > 0) { cols.splice(0, drop); firstCol += drop; }
      pearls = pearls.filter(function (p) { return p.x > dist - 40; });
      jellies = jellies.filter(function (j) { return j.x > dist - 40; });
    }
    for (var i = 0; i < 40; i++) cols.push(genCol(i));
    center = H / 2;
    fill();

    function die() {
      dead = true;
      api.fx.burst(PLAYER_X, y, ACCENT, 36, 230, 0.9);
      api.fx.burst(PLAYER_X, y, '#bfefff', 20, 120, 1.1);
      api.shake(12);
      api.audio.tone(200, 0.4, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
      api.audio.noise(0.35, { vol: 0.25, cutoff: 900 });
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var hold = inp.held('hold') || inp.held('a') || inp.held('up');
        inp.takeSwipes();
        if (dead) { deadT += dt; if (deadT > 1) api.gameOver(); return; }
        if (!started) {
          y = H / 2 + Math.sin(t * 3) * 8;
          if (hold) { started = true; vy = -120; api.audio.tone(600, 0.08, { type: 'triangle', vol: 0.15 }); }
          return;
        }
        // physics
        vy += (hold ? -1450 : 1050) * dt;
        vy = U.clamp(vy, -380, 420);
        y += vy * dt;
        speed = Math.min(430, 190 + dist * 0.012);
        dist += speed * dt;
        fill();

        var wx = dist + PLAYER_X;
        // wall collision: sample three columns under the player
        var near = 999;
        for (var k = -1; k <= 1; k++) {
          var c = colAt(wx + k * R);
          if (y - R < c.top || y + R > c.bot) { die(); return; }
          near = Math.min(near, y - R - c.top, c.bot - (y + R));
        }
        closeCd -= dt;
        if (near < 7 && closeCd <= 0) {
          closeCd = 1.1;
          bonus += 15;
          api.fx.text(PLAYER_X + 30, y - 18, 'CLOSE +15', '#bfefff', 11);
          api.audio.tone(900, 0.05, { type: 'sine', vol: 0.12 });
        }
        // pearls
        pearls.forEach(function (p) {
          if (p.got) return;
          var dx = p.x - wx, dy = p.y - y;
          if (dx * dx + dy * dy < (R + 9) * (R + 9)) {
            p.got = true;
            chain = Math.min(10, chain + 1);
            var pts = 20 * chain;
            pickups += pts;
            api.fx.burst(PLAYER_X + dx, p.y, PEARL, 16, 150);
            api.fx.text(PLAYER_X + dx, p.y - 16, '+' + pts + (chain > 1 ? ' x' + chain : ''), PEARL, 12);
            api.audio.tone(700 + chain * 60, 0.07, { type: 'square', vol: 0.16 });
          } else if (dx < -30 && !p.missed) {
            p.missed = true;
            if (chain > 1) api.fx.text(PLAYER_X, y + 22, 'CHAIN LOST', '#8899aa', 10);
            chain = 0;
          }
        });
        // jellies
        for (var j = 0; j < jellies.length; j++) {
          var jl = jellies[j];
          var jy = jl.baseY + Math.sin(t * 1.6 + jl.phase) * jl.amp;
          var ddx = jl.x - wx, ddy = jy - y;
          if (ddx * ddx + ddy * ddy < (R + jl.r - 2) * (R + jl.r - 2)) { die(); return; }
        }
        // distance score: 1 point per 10px travelled
        api.setScore(Math.floor(dist / 10) + pickups + bonus);
        bubbleT += dt;
        if (bubbleT > 0.05) {
          bubbleT = 0;
          api.fx.trail(PLAYER_X - 12, y + (Math.random() - 0.5) * 6, 'rgba(190,240,255,0.8)', -speed * 0.4, -20 - Math.random() * 30);
        }
        api.setStatus(Math.floor(dist / 10) + ' m' + (chain > 1 ? '  CHAIN x' + chain : ''));
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#031526');
        g.addColorStop(1, '#010812');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // far parallax rocks
        ctx.fillStyle = 'rgba(25,195,176,0.07)';
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (var x = 0; x <= W; x += 20) {
          var px = x + dist * 0.25;
          ctx.lineTo(x, H - 60 - Math.sin(px * 0.01) * 30 - Math.sin(px * 0.023) * 18);
        }
        ctx.lineTo(W, H);
        ctx.fill();
        // light rays
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#9fe8ff';
        for (var r = 0; r < 4; r++) {
          var rx = ((r * 190 - dist * 0.1) % (W + 200) + W + 200) % (W + 200) - 100;
          ctx.beginPath();
          ctx.moveTo(rx, 0); ctx.lineTo(rx + 60, 0); ctx.lineTo(rx - 40, H); ctx.lineTo(rx - 90, H);
          ctx.fill();
        }
        ctx.restore();

        // cave walls
        var offset = dist - firstCol * COL;
        function wall(isTop) {
          ctx.beginPath();
          ctx.moveTo(-COL, isTop ? 0 : H);
          for (var i = 0; i < cols.length; i++) {
            var sx = i * COL - offset;
            if (sx < -COL * 2 || sx > W + COL * 2) continue;
            ctx.lineTo(sx, isTop ? cols[i].top : cols[i].bot);
          }
          ctx.lineTo(W + COL, isTop ? 0 : H);
          ctx.closePath();
        }
        ctx.save();
        [true, false].forEach(function (isTop) {
          var wg = ctx.createLinearGradient(0, isTop ? 0 : H, 0, H / 2);
          wg.addColorStop(0, '#04241f');
          wg.addColorStop(1, '#0b4a42');
          ctx.fillStyle = wg;
          wall(isTop);
          ctx.fill();
          ctx.strokeStyle = WALL; ctx.lineWidth = 2; ctx.shadowColor = WALL; ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
        ctx.restore();

        // pearls
        pearls.forEach(function (p) {
          if (p.got) return;
          var sx = p.x - dist;
          if (sx < -20 || sx > W + 20) return;
          ctx.save();
          ctx.shadowColor = PEARL; ctx.shadowBlur = 14; ctx.fillStyle = PEARL;
          ctx.beginPath();
          var s = 7 + Math.sin(t * 5 + p.x) * 1.2;
          ctx.moveTo(sx, p.y - s); ctx.lineTo(sx + s, p.y); ctx.lineTo(sx, p.y + s); ctx.lineTo(sx - s, p.y);
          ctx.fill();
          ctx.restore();
        });
        // jellies
        jellies.forEach(function (jl) {
          var sx = jl.x - dist;
          if (sx < -30 || sx > W + 30) return;
          var jy = jl.baseY + Math.sin(t * 1.6 + jl.phase) * jl.amp;
          ctx.save();
          ctx.shadowColor = JELLY; ctx.shadowBlur = 16;
          ctx.fillStyle = 'rgba(255,79,216,0.8)';
          ctx.beginPath();
          ctx.arc(sx, jy, jl.r, Math.PI, 0);
          ctx.lineTo(sx + jl.r, jy + 2);
          ctx.lineTo(sx - jl.r, jy + 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,79,216,0.6)'; ctx.lineWidth = 1.5;
          for (var k = -1; k <= 1; k++) {
            ctx.beginPath();
            ctx.moveTo(sx + k * 6, jy + 2);
            ctx.quadraticCurveTo(sx + k * 6 + Math.sin(t * 6 + k) * 4, jy + 10, sx + k * 6, jy + 18);
            ctx.stroke();
          }
          ctx.restore();
        });

        // the carp
        if (!dead) {
          ctx.save();
          ctx.translate(PLAYER_X, y);
          ctx.rotate(U.clamp(vy / 900, -0.5, 0.5));
          ctx.shadowColor = ACCENT; ctx.shadowBlur = 14;
          ctx.fillStyle = ACCENT;
          ctx.beginPath();
          ctx.ellipse(0, 0, 13, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          var wag = Math.sin(t * 18) * 4;
          ctx.beginPath();
          ctx.moveTo(-10, 0); ctx.lineTo(-21, -7 + wag); ctx.lineTo(-21, 7 + wag);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#fff3e0';
          ctx.beginPath(); ctx.ellipse(2, 2, 7, 3.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#05060f';
          ctx.beginPath(); ctx.arc(7, -2.5, 1.8, 0, 7); ctx.fill();
          ctx.restore();
        }
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'HOLD TO SWIM', W / 2, H / 2 + 60, 16, '#bfefff');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#031526'); g.addColorStop(1, '#010812');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var off = t * 60;
    function edge(isTop) {
      ctx.beginPath();
      ctx.moveTo(0, isTop ? 0 : h);
      for (var x = 0; x <= w; x += 6) {
        var c = h / 2 + Math.sin((x + off) * 0.018) * h * 0.14;
        var gap = h * 0.5 + Math.sin((x + off) * 0.05) * h * 0.04;
        ctx.lineTo(x, isTop ? c - gap / 2 : c + gap / 2);
      }
      ctx.lineTo(w, isTop ? 0 : h);
      ctx.closePath();
      ctx.fillStyle = '#083a34';
      ctx.fill();
      ctx.strokeStyle = WALL; ctx.lineWidth = 1.5; ctx.stroke();
    }
    ctx.save();
    ctx.shadowColor = WALL; ctx.shadowBlur = 8;
    edge(true); edge(false);
    ctx.restore();
    var px = w * 0.3;
    var py = h / 2 + Math.sin((px + off) * 0.018) * h * 0.14;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 10; ctx.fillStyle = ACCENT;
    ctx.beginPath(); ctx.ellipse(px, py, 8, 5, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(px - 6, py); ctx.lineTo(px - 13, py - 5 + Math.sin(t * 16) * 2); ctx.lineTo(px - 13, py + 5 + Math.sin(t * 16) * 2); ctx.fill();
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_cave_diver',
    order: 3,
    title: 'Cave Diver',
    tagline: 'Hold to swim. Let go to sink.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hold',
    controls: 'Hold Space / ↑ / tap-and-hold',
    create: create,
    attract: attract
  });
})(window);

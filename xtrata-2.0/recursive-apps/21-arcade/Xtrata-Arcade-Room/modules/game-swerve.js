/*
 * Xtrata Arcade cartridge #17 — SWERVE
 * Steer a light-cycle down a winding neon corridor. Drag (or use ←→) to
 * weave; thread the gates for points, skim the walls for CLOSE bonuses,
 * and don't touch anything. The corridor tightens and speeds up.
 * Contract game-id: xa_swerve (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-swerve');
  var U = XA.util;

  var W = 400, H = 600, PY = 480, SEGH = 10, PR = 8;
  var ACCENT = '#3ff0ff', GATE = '#ffd23f', BLOCK = '#ff3fa4';

  function create(api) {
    var rng = api.rng;
    var segs = [];            // world rows every SEGH px: { y, l, r }
    var gates = [], blocks = [];
    var dist = 0, speed = 240, bonus = 0, streak = 0;
    var x = W / 2, vx = 0, lastPX = null, lastMoved = api.pointer().moved;
    var centre = W / 2, drift = 0, width = 210;
    var phaseA = rng() * 6.28, phaseB = rng() * 6.28;
    var started = false, dead = false, deadT = 0, closeCd = 0, t = 0;
    var nextFeature = 500;
    var trail = [];

    function genTo(y) {
      while (!segs.length || segs[segs.length - 1].y < y) {
        var sy = segs.length ? segs[segs.length - 1].y + SEGH : -(H - PY) - 60;
        var d = sy;
        width = Math.max(92, 210 - d * 0.006);
        // Two layered waves (seeded phases) plus a little noise: always swaying,
        // never stuck against the screen edge.
        var room = (W - width) / 2 - 14;
        drift = U.clamp(drift * 0.995 + (rng() - 0.5) * 0.006, -0.25, 0.25);
        var sway = Math.sin(d * 0.0032 + phaseA) * 0.62 + Math.sin(d * 0.0079 + phaseB) * 0.3 + drift;
        centre = W / 2 + U.clamp(sway, -1, 1) * room * Math.min(1, 0.35 + d / 3000);
        segs.push({ y: sy, l: centre - width / 2, r: centre + width / 2 });
        if (sy > nextFeature) {
          nextFeature = sy + 260 + rng() * 260 - Math.min(120, d * 0.004);
          if (rng() < 0.55) {
            var gw = Math.max(46, width * 0.45);
            var gx = centre - width / 2 + 10 + rng() * (width - gw - 20);
            gates.push({ y: sy, l: gx, r: gx + gw, passed: false });
          } else if (d > 1500) {
            var bw = Math.min(width * 0.42, 40 + rng() * 50);
            var side = rng() < 0.5;
            var bx = side ? centre - width / 2 + 6 + rng() * 20 : centre + width / 2 - bw - 6 - rng() * 20;
            if (rng() < 0.35) bx = centre - bw / 2;
            blocks.push({ y: sy, x: bx, w: bw, h: 18 });
          }
        }
      }
      var tail = dist - (H - PY) - 60;
      while (segs.length > 2 && segs[1].y < tail) segs.shift();
      gates = gates.filter(function (g) { return g.y > tail; });
      blocks = blocks.filter(function (b) { return b.y + b.h > tail; });
    }
    // World y grows in the direction of travel; the player sits at world y = dist.
    function playerWorldY() { return dist; }
    function segAt(wy) {
      var i = Math.floor((wy - segs[0].y) / SEGH);
      return segs[U.clamp(i, 0, segs.length - 1)];
    }
    function sy(wy) { return PY - (wy - dist); }   // world → screen: the road ahead is above the player
    genTo(dist + PY + 200);

    function die() {
      dead = true;
      api.fx.burst(x, PY, ACCENT, 36, 240, 0.9);
      api.fx.burst(x, PY, '#fff', 14, 160, 0.6);
      api.shake(11);
      api.audio.tone(170, 0.4, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (dead) { deadT += dt; if (deadT > 1) api.gameOver(); return; }
        // steering: drag / hover follows the pointer; keys push sideways
        var p = api.pointer();
        var target = null;
        if (p.moved !== lastMoved) { lastMoved = p.moved; lastPX = p.x; }
        if (lastPX !== null) target = U.clamp(lastPX, 0, W);
        var keys = (inp.held('right') ? 1 : 0) - (inp.held('left') ? 1 : 0);
        if (keys) { lastPX = null; vx = U.lerp(vx, keys * 330, Math.min(1, dt * 10)); }
        else if (target !== null) vx = U.clamp((target - x) * 9, -520, 520);
        else vx *= Math.pow(0.02, dt);
        if (!started) {
          if (keys || p.down || inp.hit('a') || inp.hit('up') || inp.hit('left') || inp.hit('right') || inp.hit('hold')) started = true;
          else { x = W / 2 + Math.sin(t * 2) * 6; return; }
        }
        x += vx * dt;
        speed = Math.min(620, 240 + dist * 0.011);
        dist += speed * dt;
        genTo(dist + PY + 200);

        var wy = playerWorldY();
        var s = segAt(wy);
        if (x - PR < s.l || x + PR > s.r) { die(); return; }
        // close shave
        closeCd -= dt;
        if (Math.min(x - PR - s.l, s.r - x - PR) < 5 && closeCd <= 0) {
          closeCd = 0.9; bonus += 10;
          api.fx.text(x, PY - 24, 'CLOSE +10', '#bfefff', 10);
          api.audio.tone(1000, 0.04, { type: 'sine', vol: 0.1 });
        }
        for (var i = 0; i < blocks.length; i++) {
          var b = blocks[i];
          if (wy > b.y - PR && wy < b.y + b.h + PR && x + PR > b.x && x - PR < b.x + b.w) { die(); return; }
        }
        gates.forEach(function (g) {
          if (!g.passed && wy >= g.y) {
            g.passed = true;
            if (x > g.l && x < g.r) {
              streak++;
              var pts = 25 * Math.min(streak, 8);
              bonus += pts;
              api.fx.text(x, PY - 30, 'GATE +' + pts, GATE, 12);
              api.fx.burst(x, PY, GATE, 16, 150, 0.5);
              api.audio.tone(660 + Math.min(streak, 8) * 60, 0.08, { type: 'square', vol: 0.14 });
            } else if (streak) { streak = 0; api.fx.text(x, PY - 30, 'MISSED', '#8899aa', 10); }
          }
        });
        trail.unshift({ x: x, wy: wy });
        if (trail.length > 40) trail.pop();
        api.setScore(Math.floor(dist / 10) + bonus);
        api.setStatus(Math.floor(dist / 10) + ' m  ·  GATES x' + streak);
      },

      render: function (ctx) {
        ctx.fillStyle = '#04030d';
        ctx.fillRect(0, 0, W, H);
        // speed lines
        ctx.fillStyle = 'rgba(63,240,255,0.06)';
        for (var k = 0; k < 18; k++) {
          var ly = ((k * 97 + dist * 1.4) % (H + 60)) - 30;
          ctx.fillRect((k * 53) % W, ly, 2, 30);
        }
        // corridor fill + walls
        ctx.save();
        ctx.fillStyle = 'rgba(63,240,255,0.05)';
        ctx.beginPath();
        segs.forEach(function (s, i) { var y = sy(s.y); if (i) ctx.lineTo(s.l, y); else ctx.moveTo(s.l, y); });
        for (var i = segs.length - 1; i >= 0; i--) ctx.lineTo(segs[i].r, sy(segs[i].y));
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 3; ctx.shadowColor = ACCENT; ctx.shadowBlur = 14;
        ['l', 'r'].forEach(function (side) {
          ctx.beginPath();
          segs.forEach(function (s, i) { var y = sy(s.y); if (i) ctx.lineTo(s[side], y); else ctx.moveTo(s[side], y); });
          ctx.stroke();
        });
        ctx.restore();
        // gates
        gates.forEach(function (g) {
          var y = sy(g.y);
          if (y < -20 || y > H + 20) return;
          ctx.save();
          ctx.strokeStyle = g.passed ? 'rgba(255,210,63,0.25)' : GATE; ctx.lineWidth = 3;
          ctx.shadowColor = GATE; ctx.shadowBlur = g.passed ? 0 : 12;
          ctx.beginPath(); ctx.moveTo(g.l, y); ctx.lineTo(g.r, y); ctx.stroke();
          ctx.fillStyle = GATE;
          ctx.fillRect(g.l - 3, y - 7, 6, 14); ctx.fillRect(g.r - 3, y - 7, 6, 14);
          ctx.restore();
        });
        // blocks
        blocks.forEach(function (b) {
          var y = sy(b.y);
          if (y < -40 || y > H + 40) return;
          ctx.save();
          ctx.fillStyle = BLOCK; ctx.shadowColor = BLOCK; ctx.shadowBlur = 14;
          ctx.fillRect(b.x, sy(b.y + b.h), b.w, b.h);
          ctx.restore();
        });
        // light trail + cycle
        if (!dead) {
          ctx.save();
          ctx.strokeStyle = 'rgba(63,240,255,0.6)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
          ctx.beginPath();
          trail.forEach(function (p, i) { var yy = sy(p.wy); if (i) ctx.lineTo(p.x, yy); else ctx.moveTo(p.x, yy); });
          ctx.stroke();
          ctx.translate(x, PY);
          ctx.rotate(U.clamp(vx / 900, -0.5, 0.5));
          ctx.fillStyle = '#ffffff'; ctx.shadowColor = ACCENT; ctx.shadowBlur = 18;
          ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(8, 10); ctx.lineTo(0, 5); ctx.lineTo(-8, 10); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'DRAG OR ←→ TO GO', W / 2, 200, 14, '#c9f7ff');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#04030d';
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8;
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      for (var y = 0; y <= h; y += 6) {
        var c = w / 2 + Math.sin((y - t * 90) * 0.02) * w * 0.18;
        var hw = w * 0.2 + Math.sin((y - t * 90) * 0.05) * w * 0.03;
        if (y) ctx.lineTo(c + side * hw, y); else ctx.moveTo(c + side * hw, y);
      }
      ctx.stroke();
    });
    ctx.restore();
    var py = h * 0.8, cx = w / 2 + Math.sin((py - t * 90) * 0.02) * w * 0.18;
    ctx.fillStyle = '#fff'; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(cx, py - 9); ctx.lineTo(cx + 6, py + 7); ctx.lineTo(cx - 6, py + 7); ctx.fill();
    ctx.shadowBlur = 0;
    var gy = ((t * 90) % (h * 0.8));
    ctx.fillStyle = GATE;
    var gc = w / 2 + Math.sin((gy - t * 90) * 0.02) * w * 0.18;
    ctx.fillRect(gc - w * 0.07, gy, w * 0.14, 2);
  }

  XA.registerGame({
    id: 'xa_swerve',
    order: 17,
    title: 'Swerve',
    tagline: 'Weave the corridor. Thread the gates.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO STEER',
    controls: 'Mouse / drag to steer · or ←→',
    create: create,
    attract: attract
  });
})(window);

/*
 * Xtrata Arcade cartridge #4 — ORBIT MERGE
 * Drop planets into the jar. Two of the same kind touching merge into the
 * next size up; keep the jar below the red line. Two suns merging collapse
 * into a supernova bonus.
 * Contract game-id: xa_orbit_merge (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-orbit-merge');
  var U = XA.util;

  var W = 420, H = 600;
  var LEFT = 26, RIGHT = W - 26, FLOOR = H - 22, DANGER = 118, DROP_Y = 64;
  var ACCENT = '#b98cff';
  // tier: radius, colour, name, merge points
  var TIERS = [
    { r: 13, c: '#9fb4ff', n: 'Moon' },
    { r: 18, c: '#ff8fb1', n: 'Pluto' },
    { r: 24, c: '#ffd166', n: 'Mercury' },
    { r: 31, c: '#7bf1a8', n: 'Mars' },
    { r: 38, c: '#4dd6ff', n: 'Venus' },
    { r: 46, c: '#3a86ff', n: 'Earth' },
    { r: 55, c: '#c77dff', n: 'Neptune' },
    { r: 64, c: '#ffb86b', n: 'Saturn', ring: true },
    { r: 74, c: '#ff7a59', n: 'Jupiter' },
    { r: 86, c: '#ffe36e', n: 'Sun', glow: true }
  ];
  var POINTS = TIERS.map(function (_, i) { return (i + 1) * (i + 2) / 2 * 2; }); // 2,6,12,20,…
  var G = 1500, SUB = 4;

  function planet(ctx, x, y, t, tier, alpha) {
    var d = TIERS[tier];
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    if (d.ring) {
      ctx.strokeStyle = 'rgba(255,220,160,0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(x, y, d.r * 1.35, d.r * 0.38, -0.35, Math.PI, Math.PI * 2); ctx.stroke();
    }
    ctx.shadowColor = d.c;
    ctx.shadowBlur = d.glow ? 30 : 12;
    var g = ctx.createRadialGradient(x - d.r * 0.35, y - d.r * 0.4, d.r * 0.1, x, y, d.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.18, d.c);
    g.addColorStop(1, 'rgba(10,8,30,0.95)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, d.r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    if (tier === 5) { // Earth: a couple of continents
      ctx.fillStyle = 'rgba(123,241,168,0.55)';
      ctx.beginPath(); ctx.ellipse(x - d.r * 0.2, y - d.r * 0.1, d.r * 0.32, d.r * 0.2, 0.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + d.r * 0.35, y + d.r * 0.3, d.r * 0.2, d.r * 0.13, -0.4, 0, 7); ctx.fill();
    }
    if (tier === 8) { // Jupiter bands
      ctx.strokeStyle = 'rgba(80,30,10,0.35)'; ctx.lineWidth = d.r * 0.12;
      [-0.35, 0.05, 0.4].forEach(function (k) {
        var w = Math.sqrt(1 - k * k) * d.r;
        ctx.beginPath(); ctx.moveTo(x - w * 0.95, y + k * d.r); ctx.lineTo(x + w * 0.95, y + k * d.r); ctx.stroke();
      });
    }
    if (d.ring) {
      ctx.strokeStyle = 'rgba(255,220,160,0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(x, y, d.r * 1.35, d.r * 0.38, -0.35, 0, Math.PI); ctx.stroke();
    }
    ctx.restore();
  }

  function create(api) {
    var rng = api.rng;
    var orbs = [];
    var nextId = 1;
    var aimX = W / 2;
    var lastMoved = api.pointer().moved;
    var current = pickTier(), next = pickTier();
    var cooldown = 0;
    var dangerT = 0;
    var chain = 0, chainT = 0;
    var over = false, overT = 0;
    var t = 0;
    var stars = [];
    for (var i = 0; i < 60; i++) stars.push({ x: rng() * W, y: rng() * H, s: rng() * 1.5 + 0.3, p: rng() * 6 });

    function pickTier() {
      var r = rng();
      return r < 0.34 ? 0 : r < 0.62 ? 1 : r < 0.82 ? 2 : r < 0.95 ? 3 : 4;
    }
    function clampAim(x) {
      var r = TIERS[current].r;
      return U.clamp(x, LEFT + r + 1, RIGHT - r - 1);
    }
    function drop() {
      if (cooldown > 0 || over) return;
      var r = TIERS[current].r;
      orbs.push({ id: nextId++, tier: current, x: clampAim(aimX), y: DROP_Y, vx: 0, vy: 60, age: 0, pop: 0 });
      api.audio.tone(260 + current * 20, 0.08, { type: 'triangle', vol: 0.14 });
      current = next;
      next = pickTier();
      cooldown = 0.45;
      aimX = clampAim(aimX);
    }
    function merge(a, b) {
      a.dead = b.dead = true;
      var tier = a.tier + 1;
      var x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
      chain = chainT > 0 ? chain + 1 : 1;
      chainT = 1.2;
      var mult = Math.min(4, 1 + (chain - 1) * 0.5);
      if (tier >= TIERS.length) {
        var nova = Math.round(1000 * mult);
        api.addScore(nova);
        api.fx.burst(x, y, '#ffe36e', 80, 360, 1.3);
        api.fx.burst(x, y, '#ffffff', 40, 220, 1);
        api.fx.text(x, y, 'SUPERNOVA +' + nova, '#ffe36e', 18);
        api.shake(16);
        api.audio.arp([523, 659, 784, 1047, 1319], 0.07, { type: 'square', vol: 0.22 });
        return;
      }
      var pts = Math.round(POINTS[tier] * mult);
      api.addScore(pts);
      var o = { id: nextId++, tier: tier, x: x, y: y, vx: (a.vx + b.vx) / 2, vy: Math.min(a.vy, b.vy) - 60, age: 1, pop: 1 };
      orbs.push(o);
      api.fx.burst(x, y, TIERS[tier].c, 12 + tier * 3, 120 + tier * 20);
      api.fx.text(x, y - TIERS[tier].r - 6, '+' + pts + (chain > 1 ? ' x' + mult : ''), TIERS[tier].c, 11 + Math.min(tier, 6));
      api.shake(Math.min(10, tier * 1.2));
      api.audio.tone(330 * Math.pow(1.122, tier), 0.14, { type: 'sine', vol: 0.2, slide: 1.5 });
      if (tier >= 6) api.fx.text(W / 2, 150, TIERS[tier].n.toUpperCase() + '!', TIERS[tier].c, 16);
    }

    function physics(h) {
      var i, j, a, b;
      for (i = 0; i < orbs.length; i++) {
        a = orbs[i];
        a.vy += G * h;
        a.vx *= 0.999; a.vy *= 0.999;
        a.x += a.vx * h; a.y += a.vy * h;
      }
      for (var iter = 0; iter < 3; iter++) {
        for (i = 0; i < orbs.length; i++) {
          a = orbs[i];
          if (a.dead) continue;
          for (j = i + 1; j < orbs.length; j++) {
            b = orbs[j];
            if (b.dead) continue;
            var ra = TIERS[a.tier].r, rb = TIERS[b.tier].r;
            var dx = b.x - a.x, dy = b.y - a.y;
            var min = ra + rb;
            var d2 = dx * dx + dy * dy;
            if (d2 >= min * min) continue;
            if (a.tier === b.tier) { merge(a, b); break; }
            var d = Math.sqrt(d2) || 0.01;
            var nx = dx / d, ny = dy / d, overlap = min - d;
            var ma = ra * ra, mb = rb * rb, tot = ma + mb;
            a.x -= nx * overlap * (mb / tot); a.y -= ny * overlap * (mb / tot);
            b.x += nx * overlap * (ma / tot); b.y += ny * overlap * (ma / tot);
            var vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (vn < 0) {
              var jimp = -(1.15) * vn / (1 / ma + 1 / mb);
              a.vx -= jimp / ma * nx; a.vy -= jimp / ma * ny;
              b.vx += jimp / mb * nx; b.vy += jimp / mb * ny;
            }
          }
        }
        for (i = 0; i < orbs.length; i++) {
          a = orbs[i];
          var r = TIERS[a.tier] ? TIERS[a.tier].r : 0;
          if (a.x - r < LEFT) { a.x = LEFT + r; a.vx = Math.abs(a.vx) * 0.25; }
          if (a.x + r > RIGHT) { a.x = RIGHT - r; a.vx = -Math.abs(a.vx) * 0.25; }
          if (a.y + r > FLOOR) { a.y = FLOOR - r; a.vy = -Math.abs(a.vy) * 0.2; a.vx *= 0.97; }
        }
      }
      if (orbs.some(function (o) { return o.dead; })) orbs = orbs.filter(function (o) { return !o.dead; });
    }

    function gameOver() {
      over = true;
      api.shake(12);
      api.audio.tone(180, 0.6, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
      orbs.forEach(function (o, k) {
        setTimeout(function () { api.fx.burst(o.x, o.y, TIERS[o.tier].c, 10, 160); }, k * 25);
      });
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }
        cooldown -= dt;
        if (chainT > 0) chainT -= dt;

        // Aim: pointer when it moves, otherwise keys.
        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; aimX = p.x; }
        if (inp.held('left')) aimX -= 330 * dt;
        if (inp.held('right')) aimX += 330 * dt;
        aimX = clampAim(aimX);

        // Drop: key press, or release of a touch/click inside the jar.
        if (inp.hit('release')) drop();
        if (inp.hit('a') || inp.hit('down') || inp.hit('up')) drop();

        var h = dt / SUB;
        for (var s = 0; s < SUB; s++) physics(h);
        orbs.forEach(function (o) { o.age += dt; if (o.pop > 0) o.pop = Math.max(0, o.pop - dt * 4); });

        // Over the line: only settled planets count, and only if they stay there.
        var above = orbs.some(function (o) { return o.age > 1.2 && o.y - TIERS[o.tier].r < DANGER && Math.abs(o.vy) < 120; });
        dangerT = above ? dangerT + dt : Math.max(0, dangerT - dt * 2);
        if (dangerT > 2.2) gameOver();

        var biggest = orbs.reduce(function (m, o) { return Math.max(m, o.tier); }, 0);
        api.setStatus('NEXT ' + TIERS[next].n.toUpperCase() + '   BIGGEST ' + TIERS[biggest].n.toUpperCase());
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#0b0726'); g.addColorStop(1, '#03020c');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        stars.forEach(function (s) {
          ctx.globalAlpha = 0.35 + Math.sin(t * 2 + s.p) * 0.3;
          ctx.fillStyle = '#fff';
          ctx.fillRect(s.x, s.y, s.s, s.s);
        });
        ctx.globalAlpha = 1;

        // jar
        ctx.save();
        ctx.fillStyle = 'rgba(185,140,255,0.05)';
        ctx.fillRect(LEFT, DANGER - 30, RIGHT - LEFT, FLOOR - DANGER + 30);
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 14; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(LEFT - 1.5, DANGER - 40); ctx.lineTo(LEFT - 1.5, FLOOR + 1.5);
        ctx.lineTo(RIGHT + 1.5, FLOOR + 1.5); ctx.lineTo(RIGHT + 1.5, DANGER - 40);
        ctx.stroke();
        ctx.restore();

        // danger line
        var warn = dangerT > 0;
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.strokeStyle = warn ? 'rgba(255,77,109,' + (0.5 + Math.sin(t * 20) * 0.5) + ')' : 'rgba(255,77,109,0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(LEFT, DANGER); ctx.lineTo(RIGHT, DANGER); ctx.stroke();
        ctx.restore();

        // aim guide + held planet
        if (!over) {
          var ax = clampAim(aimX);
          ctx.save();
          ctx.strokeStyle = 'rgba(255,255,255,0.14)';
          ctx.setLineDash([3, 7]);
          ctx.beginPath(); ctx.moveTo(ax, DROP_Y); ctx.lineTo(ax, FLOOR); ctx.stroke();
          ctx.restore();
          planet(ctx, ax, DROP_Y, t, current, cooldown > 0 ? 0.35 : 1);
        }
        orbs.forEach(function (o) {
          var r = TIERS[o.tier].r;
          if (o.pop > 0) {
            ctx.save();
            ctx.translate(o.x, o.y);
            var k = 1 + o.pop * 0.18;
            ctx.scale(k, k);
            planet(ctx, 0, 0, t, o.tier);
            ctx.restore();
          } else planet(ctx, o.x, o.y, t, o.tier);
          void r;
        });

        // next preview
        ctx.save();
        ctx.fillStyle = 'rgba(200,210,255,0.55)';
        ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('NEXT', RIGHT - 34, 26);
        ctx.restore();
        ctx.save();
        ctx.translate(RIGHT - 12, 22);
        ctx.scale(0.6, 0.6);
        planet(ctx, 0, 0, t, next);
        ctx.restore();

        if (warn && !over) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, dangerT);
          U.glowText(ctx, 'TOO HIGH!', W / 2, DANGER - 18, 14, '#ff4d6d');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#07051a';
    ctx.fillRect(0, 0, w, h);
    var s = h / 300;
    var pile = [[0.25, 0.86, 6], [0.62, 0.84, 7], [0.42, 0.62, 5], [0.8, 0.6, 4], [0.14, 0.64, 3], [0.55, 0.47, 2], [0.3, 0.44, 1]];
    ctx.save();
    ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.04, h * 0.25); ctx.lineTo(w * 0.04, h * 0.97); ctx.lineTo(w * 0.96, h * 0.97); ctx.lineTo(w * 0.96, h * 0.25); ctx.stroke();
    ctx.restore();
    pile.forEach(function (p) {
      ctx.save();
      ctx.translate(p[0] * w, p[1] * h);
      ctx.scale(s * 0.62, s * 0.62);
      planet(ctx, 0, 0, t, p[2]);
      ctx.restore();
    });
    var fall = (t * 0.6) % 1;
    ctx.save();
    ctx.translate(w * (0.5 + Math.sin(t) * 0.25), h * (0.08 + fall * 0.3));
    ctx.scale(s * 0.62, s * 0.62);
    planet(ctx, 0, 0, t, Math.floor(t * 0.6) % 4);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_orbit_merge',
    order: 4,
    title: 'Orbit Merge',
    tagline: 'Match planets. Grow a sun.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO AIM · LIFT YOUR FINGER TO DROP',
    controls: 'Mouse to aim, click to drop · or ←→ and Space',
    create: create,
    attract: attract
  });
})(window);

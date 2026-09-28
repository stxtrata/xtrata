/*
 * Xtrata Arcade cartridge #7 — ROCK DRIFT
 * Thrust, rotate, split rocks. Big rocks break into smaller, faster ones;
 * a saucer shows up from wave 2 and shoots back. Extra ship every 10,000.
 * Contract game-id: xa_rock_drift (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-rock-drift');
  var U = XA.util;

  var W = 560, H = 480;
  var ACCENT = '#7df9ff', ROCK = '#c9d4ff', UFO = '#ff4fd8';
  var SIZES = [{ r: 40, pts: 20, spd: 45 }, { r: 22, pts: 50, spd: 80 }, { r: 12, pts: 100, spd: 125 }];

  function wrap(o) {
    if (o.x < -50) o.x += W + 100; else if (o.x > W + 50) o.x -= W + 100;
    if (o.y < -50) o.y += H + 100; else if (o.y > H + 50) o.y -= H + 100;
  }
  function wrapTight(o, r) {
    if (o.x < -r) o.x += W + 2 * r; else if (o.x > W + r) o.x -= W + 2 * r;
    if (o.y < -r) o.y += H + 2 * r; else if (o.y > H + r) o.y -= H + 2 * r;
  }

  function create(api) {
    var rng = api.rng;
    var ship = null;
    var rocks = [], bullets = [], ufoShots = [];
    var ufo = null, ufoT = 12;
    var wave = 0, lives = 3, nextLife = 10000, score = 0;
    var fireCd = 0, respawnT = 0, waveT = 0;
    var over = false, overT = 0;
    var t = 0;
    var stars = [];
    for (var i = 0; i < 70; i++) stars.push({ x: rng() * W, y: rng() * H, s: rng() < 0.1 ? 2 : 1 });

    function newShip() {
      ship = { x: W / 2, y: H / 2, vx: 0, vy: 0, a: -Math.PI / 2, inv: 2.5, thrust: false };
    }
    function makeRock(x, y, size, ang) {
      var s = SIZES[size];
      var a = ang == null ? rng() * Math.PI * 2 : ang;
      var sp = s.spd * (0.7 + rng() * 0.6) * (1 + wave * 0.05);
      var pts = [];
      var n = 9 + Math.floor(rng() * 4);
      for (var k = 0; k < n; k++) pts.push(0.72 + rng() * 0.36);
      return { x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: size, r: s.r, rot: rng() * 6, spin: (rng() - 0.5) * 1.6, pts: pts };
    }
    function startWave() {
      wave++;
      var n = Math.min(11, 3 + wave);
      for (var k = 0; k < n; k++) {
        // spawn on the edges, away from the ship
        var edge = rng() < 0.5;
        var x = edge ? (rng() < 0.5 ? -30 : W + 30) : rng() * W;
        var y = edge ? rng() * H : (rng() < 0.5 ? -30 : H + 30);
        rocks.push(makeRock(x, y, 0));
      }
      api.fx.text(W / 2, H / 2 - 60, 'WAVE ' + wave, ACCENT, 18);
      api.audio.arp([392, 523, 659], 0.07, { type: 'triangle', vol: 0.16 });
    }
    function add(pts, x, y) {
      score += pts;
      api.addScore(pts);
      if (score >= nextLife) {
        nextLife += 10000;
        lives = Math.min(6, lives + 1);
        api.fx.text(W / 2, 60, 'EXTRA SHIP', '#39ff88', 14);
        api.audio.arp([659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
      }
      if (x != null) api.fx.text(x, y, '+' + pts, '#fff', 10);
    }
    function breakRock(r, idx) {
      rocks.splice(idx, 1);
      add(SIZES[r.size].pts, r.x, r.y - r.r);
      api.fx.burst(r.x, r.y, ROCK, 10 + (2 - r.size) * 10, 120 + r.size * 40, 0.6);
      api.shake(4 - r.size);
      api.audio.noise(0.18 + (2 - r.size) * 0.1, { vol: 0.22, cutoff: 700 + r.size * 800 });
      if (r.size < 2) {
        var base = Math.atan2(r.vy, r.vx);
        rocks.push(makeRock(r.x, r.y, r.size + 1, base + 0.6 + rng() * 0.4));
        rocks.push(makeRock(r.x, r.y, r.size + 1, base - 0.6 - rng() * 0.4));
      }
    }
    function killShip() {
      api.fx.burst(ship.x, ship.y, ACCENT, 40, 220, 1);
      api.fx.burst(ship.x, ship.y, '#ffffff', 16, 140, 0.8);
      api.shake(12);
      api.audio.noise(0.6, { vol: 0.35, cutoff: 600 });
      ship = null;
      lives--;
      if (lives <= 0) { over = true; return; }
      respawnT = 1.6;
    }
    function hits(a, b, r) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return dx * dx + dy * dy < r * r;
    }

    newShip();
    startWave();

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.2) api.gameOver(); updateWorld(dt); return; }

        if (!ship) {
          respawnT -= dt;
          // Respawn only when the centre is clear.
          if (respawnT <= 0 && !rocks.some(function (r) { return hits(r, { x: W / 2, y: H / 2 }, r.r + 70); })) newShip();
        } else {
          if (inp.held('left')) ship.a -= 4.4 * dt;
          if (inp.held('right')) ship.a += 4.4 * dt;
          ship.thrust = inp.held('up');
          if (ship.thrust) {
            ship.vx += Math.cos(ship.a) * 330 * dt;
            ship.vy += Math.sin(ship.a) * 330 * dt;
            if (Math.random() < 0.7) api.fx.trail(ship.x - Math.cos(ship.a) * 12, ship.y - Math.sin(ship.a) * 12, '#ffb35c',
              -Math.cos(ship.a) * 120 + (Math.random() - 0.5) * 40, -Math.sin(ship.a) * 120 + (Math.random() - 0.5) * 40);
          }
          var sp = Math.hypot(ship.vx, ship.vy);
          if (sp > 340) { ship.vx *= 340 / sp; ship.vy *= 340 / sp; }
          ship.vx *= Math.pow(0.55, dt); ship.vy *= Math.pow(0.55, dt);
          ship.x += ship.vx * dt; ship.y += ship.vy * dt;
          wrapTight(ship, 12);
          if (ship.inv > 0) ship.inv -= dt;
          fireCd -= dt;
          var firing = inp.held('a') || inp.held('c') || inp.held('hold');
          if (firing && fireCd <= 0 && bullets.length < 6) {
            fireCd = 0.17;
            bullets.push({ x: ship.x + Math.cos(ship.a) * 14, y: ship.y + Math.sin(ship.a) * 14,
              vx: ship.vx + Math.cos(ship.a) * 520, vy: ship.vy + Math.sin(ship.a) * 520, life: 0.85 });
            api.audio.tone(880, 0.05, { type: 'square', vol: 0.08, slide: 0.5 });
          }
        }
        updateWorld(dt);

        if (!rocks.length && !ufo) {
          waveT += dt;
          if (waveT > 1.4) { waveT = 0; startWave(); }
        }
        api.setStatus('WAVE ' + wave + '  ·  SHIPS ' + lives + '  ·  ROCKS ' + rocks.length);
      },

      render: function (ctx) {
        ctx.fillStyle = '#03040c';
        ctx.fillRect(0, 0, W, H);
        stars.forEach(function (s) {
          ctx.fillStyle = 'rgba(200,220,255,' + (0.3 + (s.s - 1) * 0.4) + ')';
          ctx.fillRect(s.x, s.y, s.s, s.s);
        });
        // lives
        for (var l = 0; l < lives; l++) drawShip(ctx, 18 + l * 18, 18, -Math.PI / 2, 0.6, false);

        ctx.save();
        ctx.strokeStyle = ROCK; ctx.lineWidth = 2; ctx.shadowColor = ROCK; ctx.shadowBlur = 8;
        rocks.forEach(function (r) {
          ctx.beginPath();
          for (var k = 0; k < r.pts.length; k++) {
            var a = r.rot + k / r.pts.length * Math.PI * 2;
            var px = r.x + Math.cos(a) * r.r * r.pts[k], py = r.y + Math.sin(a) * r.r * r.pts[k];
            if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(201,212,255,0.06)';
          ctx.fill();
          ctx.stroke();
        });
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#fff'; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
        bullets.forEach(function (b) { ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3); });
        ctx.fillStyle = UFO; ctx.shadowColor = UFO;
        ufoShots.forEach(function (b) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, 7); ctx.fill(); });
        ctx.restore();

        if (ufo) {
          ctx.save();
          ctx.translate(ufo.x, ufo.y);
          ctx.strokeStyle = UFO; ctx.shadowColor = UFO; ctx.shadowBlur = 14; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(0, 0, 20, 7, 0, 0, 7); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(0, -6, 9, 7, 0, Math.PI, 0); ctx.stroke();
          ctx.restore();
        }
        if (ship && !(ship.inv > 0 && Math.floor(t * 12) % 2)) drawShip(ctx, ship.x, ship.y, ship.a, 1, ship.thrust);
      }
    };

    function drawShip(ctx, x, y, a, k, thrust) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
      ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, -9); ctx.lineTo(-6, 0); ctx.lineTo(-10, 9); ctx.closePath();
      ctx.fillStyle = 'rgba(125,249,255,0.12)'; ctx.fill(); ctx.stroke();
      if (thrust && Math.floor(t * 30) % 2) {
        ctx.strokeStyle = '#ffb35c'; ctx.shadowColor = '#ffb35c';
        ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(-17, 0); ctx.lineTo(-7, 4); ctx.stroke();
      }
      ctx.restore();
    }

    function updateWorld(dt) {
      var i, j;
      rocks.forEach(function (r) { r.x += r.vx * dt; r.y += r.vy * dt; r.rot += r.spin * dt; wrap(r); });
      for (i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i];
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        wrapTight(b, 2);
        if (b.life <= 0) { bullets.splice(i, 1); continue; }
        for (j = rocks.length - 1; j >= 0; j--) {
          if (hits(b, rocks[j], rocks[j].r)) { bullets.splice(i, 1); breakRock(rocks[j], j); break; }
        }
        if (bullets[i] === b && ufo && hits(b, ufo, 18)) {
          bullets.splice(i, 1);
          add(500, ufo.x, ufo.y - 16);
          api.fx.burst(ufo.x, ufo.y, UFO, 30, 200, 0.8);
          api.audio.arp([1047, 784, 523], 0.05, { type: 'square', vol: 0.18 });
          ufo = null;
        }
      }
      // saucer
      if (wave >= 2 && !over) {
        if (!ufo) {
          ufoT -= dt;
          if (ufoT <= 0) {
            var fromLeft = rng() < 0.5;
            ufo = { x: fromLeft ? -20 : W + 20, y: 60 + rng() * (H - 120), vx: fromLeft ? 90 : -90, shoot: 1.2, t: 0 };
          }
        } else {
          ufo.t += dt;
          ufo.x += ufo.vx * dt;
          ufo.y += Math.sin(ufo.t * 2) * 40 * dt;
          ufo.shoot -= dt;
          if (Math.floor(ufo.t * 8) % 4 === 0) api.audio.tone(ufo.t % 0.5 < 0.25 ? 520 : 440, 0.03, { type: 'sine', vol: 0.04 });
          if (ufo.shoot <= 0 && ship) {
            ufo.shoot = Math.max(0.8, 1.6 - wave * 0.1);
            var aim = Math.atan2(ship.y - ufo.y, ship.x - ufo.x) + (rng() - 0.5) * 0.5;
            ufoShots.push({ x: ufo.x, y: ufo.y, vx: Math.cos(aim) * 230, vy: Math.sin(aim) * 230, life: 2 });
          }
          if (ufo.x < -40 || ufo.x > W + 40) { ufo = null; }
          if (!ufo) ufoT = 14 + rng() * 10;
        }
      }
      for (i = ufoShots.length - 1; i >= 0; i--) {
        var s = ufoShots[i];
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
        if (s.life <= 0) { ufoShots.splice(i, 1); continue; }
        if (ship && ship.inv <= 0 && hits(s, ship, 10)) { ufoShots.splice(i, 1); killShip(); }
      }
      if (ship && ship.inv <= 0) {
        for (j = 0; j < rocks.length; j++) {
          if (hits(ship, rocks[j], rocks[j].r * 0.85 + 8)) { breakRock(rocks[j], j); killShip(); break; }
        }
        if (ship && ufo && hits(ship, ufo, 24)) { ufo = null; ufoT = 12; killShip(); }
      }
    }
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#03040c';
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = ROCK; ctx.shadowColor = ROCK; ctx.shadowBlur = 6; ctx.lineWidth = 1.5;
    [[0.2, 0.3, 0.12, 0.3], [0.75, 0.25, 0.09, -0.5], [0.65, 0.75, 0.14, 0.2], [0.3, 0.8, 0.06, 0.8]].forEach(function (r, i) {
      var x = ((r[0] * w + t * 14 * (i % 2 ? -1 : 1)) % w + w) % w, y = r[1] * h, rad = r[2] * h;
      ctx.beginPath();
      for (var k = 0; k < 10; k++) {
        var a = t * r[3] + k / 10 * Math.PI * 2, m = 0.75 + ((k * 7 + i * 3) % 5) / 12;
        ctx.lineTo(x + Math.cos(a) * rad * m, y + Math.sin(a) * rad * m);
      }
      ctx.closePath(); ctx.stroke();
    });
    ctx.restore();
    ctx.save();
    ctx.translate(w / 2, h / 2); ctx.rotate(t * 0.8);
    ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10; ctx.lineWidth = 2;
    var k2 = h / 300;
    ctx.beginPath(); ctx.moveTo(14 * k2, 0); ctx.lineTo(-10 * k2, -9 * k2); ctx.lineTo(-6 * k2, 0); ctx.lineTo(-10 * k2, 9 * k2); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#fff';
    for (var b = 1; b < 4; b++) ctx.fillRect((20 + ((t * 200 + b * 40) % 140)) * k2, -1, 3, 3);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_rock_drift',
    order: 7,
    title: 'Rock Drift',
    tagline: 'Thrust, turn, split the rocks.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'ship',
    controls: '←→ turn · ↑ thrust · Space fire (hold to auto-fire)',
    create: create,
    attract: attract
  });
})(window);

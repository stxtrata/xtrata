/*
 * Xtrata Arcade cartridge #18 — LUNAR LANDER
 * Rotate and burn to set the module down softly on a pad. Narrow pads pay
 * more (x2 / x3 / x5). Every landing refuels a little and brings a new
 * surface; three modules, and fuel is shared across the whole run.
 * Contract game-id: xa_lunar_lander (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-lunar-lander');
  var U = XA.util;

  var W = 600, H = 450, STEP = 20, N = W / STEP + 1;
  var G = 30, THRUST = 78, TURN = 2.6, BURN = 55;
  var SAFE_VY = 42, SAFE_VX = 28, SAFE_A = 0.22;
  var ACCENT = '#c9d4ff', OK = '#39ff88', WARN = '#ffd23f', BAD = '#ff4d6d';

  function create(api) {
    var rng = api.rng;
    var ground = [], pads = [];
    var ship = null, level = 0, ships = 3, fuel = 1000;
    var landedT = 0, crashT = 0, over = false, overT = 0, t = 0;
    var stars = [];
    for (var i = 0; i < 60; i++) stars.push({ x: rng() * W, y: rng() * 260, s: rng() < 0.15 ? 2 : 1 });

    function newSurface() {
      level++;
      ground = [];
      var h = 330 + rng() * 60;
      for (var i = 0; i < N; i++) {
        h = U.clamp(h + (rng() - 0.5) * (70 + level * 6), 210, H - 20);
        ground.push(h);
      }
      pads = [];
      var specs = [{ len: 4, mult: 2 }, { len: 3, mult: 3 }, { len: 2, mult: 5 }];
      var used = {};
      specs.forEach(function (sp) {
        for (var tries = 0; tries < 50; tries++) {
          var start = 1 + Math.floor(rng() * (N - sp.len - 2));
          var clash = false;
          for (var k = start - 1; k <= start + sp.len + 1; k++) if (used[k]) clash = true;
          if (clash) continue;
          var y = ground[start];
          for (k = start; k <= start + sp.len; k++) { ground[k] = y; used[k] = true; }
          pads.push({ a: start, b: start + sp.len, y: y, mult: sp.mult });
          break;
        }
      });
      spawn();
    }
    function spawn() {
      ship = { x: 60 + rng() * (W - 120), y: 40, vx: (rng() - 0.5) * 70, vy: 5, a: (rng() - 0.5) * 0.6, burn: false, legs: 0 };
    }
    function groundAt(x) {
      var i = U.clamp(Math.floor(x / STEP), 0, N - 2);
      var f = (x - i * STEP) / STEP;
      return ground[i] + (ground[i + 1] - ground[i]) * f;
    }
    function padAt(x) {
      for (var i = 0; i < pads.length; i++) if (x > pads[i].a * STEP + 6 && x < pads[i].b * STEP - 6) return pads[i];
      return null;
    }
    newSurface();

    function crash(reason) {
      api.fx.burst(ship.x, ship.y, '#ff9f1c', 40, 220, 1);
      api.fx.burst(ship.x, ship.y, ACCENT, 20, 160, 0.8);
      api.fx.text(ship.x, ship.y - 30, reason, BAD, 12);
      api.shake(12);
      api.audio.noise(0.7, { vol: 0.35, cutoff: 700 });
      ship = null;
      ships--;
      crashT = 1.6;
    }

    return {
      // Read-only test hook.
      debug: function () { return { ships: ships, fuel: fuel, level: level, flying: !!ship }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.2) api.gameOver(); return; }
        if (crashT > 0) {
          crashT -= dt;
          if (crashT <= 0) { if (ships <= 0 || fuel <= 0) over = true; else spawn(); }
          return;
        }
        if (landedT > 0) {
          landedT -= dt;
          if (landedT <= 0) newSurface();
          return;
        }
        var s = ship;
        if (inp.held('left')) s.a -= TURN * dt;
        if (inp.held('right')) s.a += TURN * dt;
        s.a = U.clamp(s.a, -Math.PI / 2, Math.PI / 2);
        s.burn = fuel > 0 && (inp.held('up') || inp.held('a') || inp.held('hold'));
        if (s.burn) {
          s.vx += Math.sin(s.a) * THRUST * dt;
          s.vy -= Math.cos(s.a) * THRUST * dt;
          fuel = Math.max(0, fuel - BURN * dt);
          if (Math.random() < 0.8) api.fx.trail(s.x - Math.sin(s.a) * 12, s.y + Math.cos(s.a) * 12, '#ffb35c',
            -Math.sin(s.a) * 90 + (Math.random() - 0.5) * 30, Math.cos(s.a) * 90);
          if (Math.floor(t * 30) % 3 === 0) api.audio.noise(0.05, { vol: 0.05, cutoff: 500 });
        }
        s.vy += G * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.x < 0) s.x += W; if (s.x > W) s.x -= W;
        s.legs = Math.min(1, s.legs + (s.y > 150 ? dt * 3 : -dt * 3));

        var foot = s.y + 10;
        var gy = Math.min(groundAt(s.x - 8), groundAt(s.x + 8));
        if (foot >= gy) {
          var pad = padAt(s.x);
          var soft = s.vy < SAFE_VY && Math.abs(s.vx) < SAFE_VX && Math.abs(s.a) < SAFE_A;
          if (pad && soft) {
            var gentle = Math.round((SAFE_VY - s.vy) + (SAFE_A - Math.abs(s.a)) * 100);
            s.y = pad.y - 10; s.vy = 0; s.vx = 0;
            var pts = 50 * pad.mult * level + gentle;
            api.addScore(pts);
            fuel = Math.min(1000, fuel + 250);
            api.fx.text(s.x, s.y - 40, 'LANDED x' + pad.mult + '  +' + pts, OK, 14);
            api.fx.burst(s.x, pad.y, OK, 20, 120, 0.6);
            api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'triangle', vol: 0.2 });
            landedT = 2;
          } else crash(!pad ? 'MISSED THE PAD' : s.vy >= SAFE_VY ? 'TOO FAST' : Math.abs(s.a) >= SAFE_A ? 'NOT LEVEL' : 'DRIFTING');
        }
        if (ship) api.setStatus('LEVEL ' + level + '  ·  MODULES ' + ships + '  ·  FUEL ' + Math.round(fuel));
      },

      render: function (ctx) {
        ctx.fillStyle = '#02030a';
        ctx.fillRect(0, 0, W, H);
        stars.forEach(function (s) { ctx.fillStyle = 'rgba(220,230,255,' + (0.35 + (s.s - 1) * 0.4) + ')'; ctx.fillRect(s.x, s.y, s.s, s.s); });
        // Earth in the sky
        ctx.save();
        ctx.fillStyle = '#1f4fa8'; ctx.shadowColor = '#3f8cff'; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(510, 70, 22, 0, 7); ctx.fill();
        ctx.fillStyle = '#02030a';
        ctx.beginPath(); ctx.arc(520, 64, 20, 0, 7); ctx.fill();
        ctx.restore();
        // terrain
        ctx.save();
        ctx.beginPath(); ctx.moveTo(0, H);
        for (var i = 0; i < N; i++) ctx.lineTo(i * STEP, ground[i]);
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = '#12131f'; ctx.fill();
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5; ctx.shadowColor = ACCENT; ctx.shadowBlur = 6;
        ctx.beginPath();
        for (i = 0; i < N; i++) { if (i) ctx.lineTo(i * STEP, ground[i]); else ctx.moveTo(0, ground[0]); }
        ctx.stroke();
        ctx.restore();
        pads.forEach(function (p) {
          ctx.save();
          var col = p.mult >= 5 ? BAD : p.mult >= 3 ? WARN : OK;
          ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(p.a * STEP, p.y); ctx.lineTo(p.b * STEP, p.y); ctx.stroke();
          ctx.fillStyle = col;
          ctx.font = '800 11px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
          ctx.fillText('x' + p.mult, (p.a + p.b) / 2 * STEP, p.y + 16);
          ctx.restore();
        });
        // module
        if (ship) {
          var s = ship;
          ctx.save();
          ctx.translate(s.x, s.y); ctx.rotate(s.a);
          ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.6; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
          ctx.fillStyle = 'rgba(201,212,255,0.12)';
          ctx.beginPath(); ctx.arc(0, -4, 7, 0, 7); ctx.fill(); ctx.stroke();
          ctx.strokeRect(-8, 2, 16, 5);
          var l = 4 + s.legs * 5;
          ctx.beginPath();
          ctx.moveTo(-6, 7); ctx.lineTo(-10, 7 + l * 0.6); ctx.moveTo(6, 7); ctx.lineTo(10, 7 + l * 0.6);
          ctx.moveTo(-13, 7 + l * 0.6); ctx.lineTo(-7, 7 + l * 0.6); ctx.moveTo(7, 7 + l * 0.6); ctx.lineTo(13, 7 + l * 0.6);
          ctx.stroke();
          if (s.burn && Math.floor(t * 30) % 2) {
            ctx.strokeStyle = '#ffb35c'; ctx.shadowColor = '#ffb35c';
            ctx.beginPath(); ctx.moveTo(-4, 8); ctx.lineTo(0, 20 + Math.random() * 6); ctx.lineTo(4, 8); ctx.stroke();
          }
          ctx.restore();
        }
        // instruments
        ctx.save();
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'left';
        if (ship) {
          var alt = Math.max(0, Math.round(Math.min(groundAt(ship.x - 8), groundAt(ship.x + 8)) - ship.y - 10));
          var rows = [
            ['ALT', alt, WARN],
            ['V↓', Math.round(ship.vy), ship.vy < SAFE_VY ? OK : BAD],
            ['V→', Math.round(ship.vx), Math.abs(ship.vx) < SAFE_VX ? OK : BAD],
            ['TILT', Math.round(ship.a * 57.3) + '°', Math.abs(ship.a) < SAFE_A ? OK : BAD]
          ];
          rows.forEach(function (r, i) {
            ctx.fillStyle = 'rgba(200,210,255,0.55)'; ctx.fillText(r[0], 12, 22 + i * 16);
            ctx.fillStyle = r[2]; ctx.fillText(String(r[1]), 52, 22 + i * 16);
          });
        }
        // fuel gauge
        ctx.fillStyle = 'rgba(200,210,255,0.55)'; ctx.fillText('FUEL', 12, 96);
        ctx.strokeStyle = 'rgba(200,210,255,0.4)'; ctx.strokeRect(52, 88, 100, 9);
        ctx.fillStyle = fuel > 300 ? OK : fuel > 120 ? WARN : BAD;
        ctx.fillRect(53, 89, 98 * (fuel / 1000), 7);
        for (var m = 0; m < ships; m++) { ctx.strokeStyle = ACCENT; ctx.beginPath(); ctx.arc(W - 18 - m * 18, 18, 5, 0, 7); ctx.stroke(); }
        ctx.restore();
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#02030a';
    ctx.fillRect(0, 0, w, h);
    var base = h * 0.8;
    ctx.fillStyle = '#12131f';
    ctx.beginPath(); ctx.moveTo(0, h);
    var pts = [0.75, 0.62, 0.7, 0.82, 0.82, 0.82, 0.66, 0.58, 0.72, 0.64, 0.78];
    pts.forEach(function (p, i) { ctx.lineTo(i / (pts.length - 1) * w, p * h); });
    ctx.lineTo(w, h); ctx.fill();
    ctx.strokeStyle = OK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.82); ctx.lineTo(w * 0.5, h * 0.82); ctx.stroke();
    var k = (t * 0.25) % 1;
    var sy = h * 0.1 + k * (base - h * 0.15);
    ctx.save();
    ctx.translate(w * 0.4, Math.min(sy, h * 0.82 - h * 0.05));
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5;
    var s = h / 150;
    ctx.beginPath(); ctx.arc(0, -3 * s, 5 * s, 0, 7); ctx.stroke();
    ctx.strokeRect(-6 * s, 2 * s, 12 * s, 3 * s);
    if (k > 0.5 && Math.floor(t * 20) % 2) { ctx.strokeStyle = '#ffb35c'; ctx.beginPath(); ctx.moveTo(-3 * s, 6 * s); ctx.lineTo(0, 14 * s); ctx.lineTo(3 * s, 6 * s); ctx.stroke(); }
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_lunar_lander',
    order: 18,
    title: 'Lunar Lander',
    tagline: 'Gentle hands. Narrow pads pay more.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'lander',
    controls: '←→ rotate · ↑ / Space thrust',
    create: create,
    attract: attract
  });
})(window);

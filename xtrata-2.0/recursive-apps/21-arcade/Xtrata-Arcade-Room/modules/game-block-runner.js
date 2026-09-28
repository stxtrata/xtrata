/*
 * Xtrata Arcade cartridge #5 — BLOCK RUNNER
 * An endless one-button runner: an orange block hops across the chain.
 * Tap to jump (hold for height), duck under drones, grab data bits.
 * Contract game-id: xa_block_runner (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-runner');
  var U = XA.util;

  var W = 600, H = 340, GROUND = 284, PX = 92;
  var ACCENT = '#ff9f1c', BIT = '#3ff0ff', HAZARD = '#ff4d6d', DRONE = '#c77dff';
  var SIZE = 30, DUCK = 17;

  function create(api) {
    var rng = api.rng;
    var y = GROUND - SIZE, vy = 0, grounded = true, ducking = false, duckT = 0, jumpBuffer = 0, milestone = 500;
    var dist = 0, speed = 330, bonus = 0;
    var obstacles = [], bits = [];
    var nextGap = 520;
    var dead = false, deadT = 0, started = false;
    var spin = 0, t = 0, bitChain = 0;
    var skyline = [];
    for (var i = 0; i < 24; i++) skyline.push({ w: 30 + rng() * 50, h: 40 + rng() * 110, gap: 4 + rng() * 16 });

    function h() { return ducking && grounded ? DUCK : SIZE; }

    function spawn() {
      var x = dist + W + 40;
      var roll = rng();
      if (dist > 900 && roll < 0.22) {
        // Drone at head height: duck (or time a jump over it).
        obstacles.push({ kind: 'drone', x: x, y: GROUND - 44 - rng() * 6, w: 38, h: 16 });
      } else if (dist > 3000 && roll < 0.36) {
        obstacles.push({ kind: 'block', x: x, y: GROUND - 34, w: 30, h: 34 });
        obstacles.push({ kind: 'block', x: x + 30, y: GROUND - 52, w: 30, h: 52 });
      } else {
        var bh = 26 + Math.floor(rng() * 3) * 12;
        var bw = rng() < 0.3 ? 46 : 26;
        obstacles.push({ kind: rng() < 0.4 ? 'spike' : 'block', x: x, y: GROUND - bh, w: bw, h: bh });
      }
      // A little arc of data bits over some obstacles.
      if (rng() < 0.45) {
        var ox = x + 10;
        for (var k = 0; k < 4; k++) bits.push({ x: ox - 40 + k * 28, y: GROUND - 90 - Math.sin(k / 3 * Math.PI) * 30, got: false });
      }
      var min = 250 + speed * 0.35, max = min + 300;
      nextGap = min + rng() * (max - min);
    }

    function die() {
      dead = true;
      api.fx.burst(PX + SIZE / 2, y + h() / 2, ACCENT, 34, 240, 0.9);
      api.fx.burst(PX + SIZE / 2, y + h() / 2, '#ffffff', 12, 160, 0.6);
      api.shake(11);
      api.audio.tone(160, 0.35, { type: 'square', slide: 0.4, vol: 0.28 });
      api.audio.noise(0.25, { vol: 0.2 });
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var sw = inp.takeSwipes();
        if (dead) { deadT += dt; if (deadT > 0.9) api.gameOver(); return; }

        var jumpPressed = inp.hit('a') || inp.hit('up') || inp.hit('hold');
        var jumpHeld = inp.held('a') || inp.held('up') || inp.held('hold');
        if (sw.indexOf('down') >= 0) duckT = 0.55;
        if (duckT > 0) duckT -= dt;
        var wantDuck = inp.held('down') || duckT > 0;
        if (!started) {
          if (jumpPressed) started = true; else { spin = Math.sin(t * 4) * 0.1; return; }
        }

        if (jumpPressed) jumpBuffer = 0.12;
        if (jumpBuffer > 0) jumpBuffer -= dt;
        if (grounded && jumpBuffer > 0) {
          grounded = false; vy = -640; jumpBuffer = 0; duckT = 0; wantDuck = false;
          y = GROUND - SIZE;
          api.audio.tone(520, 0.08, { type: 'square', vol: 0.12, slide: 1.6 });
        }
        if (!grounded) {
          // Variable jump: short tap = short hop. Duck in the air = fast fall.
          var grav = vy < 0 && jumpHeld ? 1500 : 2900;
          if (wantDuck) grav = 4200;
          vy += grav * dt;
          y += vy * dt;
          if (y + SIZE >= GROUND) {
            grounded = true; vy = 0;
            api.fx.burst(PX + SIZE / 2, GROUND, 'rgba(255,159,28,0.7)', 6, 70, 0.3);
          }
        }
        ducking = wantDuck;
        var hh = h();
        if (grounded) y = GROUND - hh;
        spin = grounded ? 0 : spin + dt * 9;

        speed = Math.min(820, 330 + dist * 0.018);
        dist += speed * dt;
        nextGap -= speed * dt;
        if (nextGap <= 0) spawn();

        // collisions (slightly forgiving hitbox)
        var px0 = PX + 4, px1 = PX + SIZE - 4, py0 = y + 4, py1 = y + hh - 1;
        for (var i = 0; i < obstacles.length; i++) {
          var o = obstacles[i];
          var sx = o.x - dist;
          var inset = o.kind === 'spike' ? 6 : 2;
          if (px1 > sx + inset && px0 < sx + o.w - inset && py1 > o.y + inset && py0 < o.y + o.h) { die(); return; }
          if (!o.passed && sx + o.w < PX) {
            o.passed = true;
            if (o.kind === 'drone' && ducking) { bonus += 10; api.fx.text(PX + 20, y - 14, 'DUCK +10', DRONE, 10); }
          }
        }
        for (var j = 0; j < bits.length; j++) {
          var b = bits[j];
          if (b.got) continue;
          var bx = b.x - dist;
          if (bx > px0 - 8 && bx < px1 + 8 && b.y > py0 - 8 && b.y < py1 + 8) {
            b.got = true;
            bitChain++;
            var pts = 5 * Math.min(bitChain, 8);
            bonus += pts;
            api.fx.burst(bx, b.y, BIT, 8, 90, 0.4);
            if (bitChain % 4 === 0) api.fx.text(bx, b.y - 12, 'CHAIN ' + bitChain, BIT, 10);
            api.audio.tone(880 + (bitChain % 8) * 60, 0.05, { type: 'square', vol: 0.1 });
          } else if (bx < PX - 20 && !b.missed) { b.missed = true; bitChain = 0; }
        }
        obstacles = obstacles.filter(function (o) { return o.x - dist > -120; });
        bits = bits.filter(function (b) { return b.x - dist > -40; });

        var metres = Math.floor(dist / 10);
        api.setScore(metres + bonus);
        if (metres >= milestone) {
          api.fx.text(W / 2, 80, milestone + ' m', ACCENT, 16);
          milestone += 500;
          api.audio.arp([523, 784], 0.07, { type: 'triangle', vol: 0.15 });
        }
        api.setStatus(metres + ' m  ·  ' + Math.round(speed / 10) + ' km/h' + (bitChain > 1 ? '  ·  BITS x' + bitChain : ''));
      },

      render: function (ctx) {
        // Sky shifts slowly between dusk and night as you run.
        var phase = (Math.sin(dist / 6000) + 1) / 2;
        var g = ctx.createLinearGradient(0, 0, 0, GROUND);
        g.addColorStop(0, phase > 0.5 ? '#07081c' : '#1a0b2e');
        g.addColorStop(1, phase > 0.5 ? '#141238' : '#3a1440');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // sun / moon
        ctx.save();
        ctx.shadowColor = '#ff9f1c'; ctx.shadowBlur = 30;
        ctx.fillStyle = phase > 0.5 ? 'rgba(220,230,255,0.85)' : 'rgba(255,159,28,0.8)';
        ctx.beginPath(); ctx.arc(470, 80, 26, 0, 7); ctx.fill();
        ctx.restore();

        // skyline: a chain of stacked blocks
        var sx = -((dist * 0.2) % 1400);
        ctx.fillStyle = 'rgba(120,90,255,0.18)';
        for (var rep = 0; rep < 2; rep++) {
          var x = sx + rep * 1400;
          skyline.forEach(function (b) {
            ctx.fillRect(x, GROUND - b.h, b.w, b.h);
            x += b.w + b.gap;
          });
        }
        // ground
        ctx.fillStyle = '#0a0a18';
        ctx.fillRect(0, GROUND, W, H - GROUND);
        ctx.save();
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, GROUND + 1); ctx.lineTo(W, GROUND + 1); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(255,159,28,0.25)';
        var off = dist % 40;
        for (var k = 0; k < W / 40 + 2; k++) ctx.fillRect(k * 40 - off, GROUND + 14, 18, 2);
        off = (dist * 1.4) % 90;
        for (k = 0; k < W / 90 + 2; k++) ctx.fillRect(k * 90 - off, GROUND + 34, 30, 2);

        // bits
        bits.forEach(function (b) {
          if (b.got) return;
          var bx = b.x - dist;
          ctx.save();
          ctx.translate(bx, b.y);
          ctx.rotate(t * 3);
          ctx.shadowColor = BIT; ctx.shadowBlur = 10; ctx.fillStyle = BIT;
          ctx.fillRect(-4, -4, 8, 8);
          ctx.restore();
        });

        // obstacles
        obstacles.forEach(function (o) {
          var ox = o.x - dist;
          if (ox > W + 60 || ox < -80) return;
          ctx.save();
          if (o.kind === 'spike') {
            ctx.fillStyle = HAZARD; ctx.shadowColor = HAZARD; ctx.shadowBlur = 12;
            var n = Math.max(1, Math.round(o.w / 13));
            var sw = o.w / n;
            ctx.beginPath();
            for (var s = 0; s < n; s++) {
              ctx.moveTo(ox + s * sw, o.y + o.h);
              ctx.lineTo(ox + s * sw + sw / 2, o.y);
              ctx.lineTo(ox + (s + 1) * sw, o.y + o.h);
            }
            ctx.fill();
          } else if (o.kind === 'drone') {
            var bob = Math.sin(t * 8 + o.x) * 2;
            ctx.fillStyle = DRONE; ctx.shadowColor = DRONE; ctx.shadowBlur = 14;
            U.roundRect(ctx, ox, o.y + bob, o.w, o.h, 5); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillRect(ox + 6, o.y + bob + 5, 5, 5);
            ctx.strokeStyle = 'rgba(199,125,255,0.8)'; ctx.lineWidth = 2;
            var pr = Math.sin(t * 40) * 9;
            ctx.beginPath(); ctx.moveTo(ox + o.w / 2 - pr, o.y + bob - 4); ctx.lineTo(ox + o.w / 2 + pr, o.y + bob - 4); ctx.stroke();
          } else {
            ctx.fillStyle = '#23254a'; ctx.strokeStyle = '#6a7bff'; ctx.shadowColor = '#6a7bff'; ctx.shadowBlur = 10; ctx.lineWidth = 2;
            ctx.fillRect(ox, o.y, o.w, o.h);
            ctx.strokeRect(ox + 1, o.y + 1, o.w - 2, o.h - 2);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(106,123,255,0.35)';
            for (var yy = o.y + 12; yy < o.y + o.h; yy += 12) { ctx.beginPath(); ctx.moveTo(ox + 2, yy); ctx.lineTo(ox + o.w - 2, yy); ctx.stroke(); }
          }
          ctx.restore();
        });

        // runner
        if (!dead) {
          var hh = h();
          ctx.save();
          ctx.translate(PX + SIZE / 2, y + hh / 2);
          ctx.rotate(grounded ? 0 : spin);
          ctx.shadowColor = ACCENT; ctx.shadowBlur = 16;
          ctx.fillStyle = ACCENT;
          ctx.fillRect(-SIZE / 2, -hh / 2, SIZE, hh);
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.fillRect(-SIZE / 2, -hh / 2, SIZE, 4);
          ctx.fillStyle = '#05060f';
          ctx.fillRect(4, -hh / 2 + 6, 5, hh > 20 ? 6 : 3);
          ctx.restore();
          if (grounded && started) api.fx.trail(PX, GROUND - 2, 'rgba(255,159,28,0.6)', -speed * 0.3, -20);
        }
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP OR SPACE TO RUN', W / 2, 140, 15, '#ffd9a8');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1a0b2e'); g.addColorStop(1, '#3a1440');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var gy = h * 0.8;
    ctx.fillStyle = 'rgba(120,90,255,0.2)';
    for (var i = 0; i < 12; i++) {
      var bw = w * 0.07, bh = h * (0.15 + ((i * 37) % 7) / 14);
      var x = ((i * w * 0.11 - t * 20) % (w * 1.3) + w * 1.3) % (w * 1.3) - bw;
      ctx.fillRect(x, gy - bh, bw, bh);
    }
    ctx.save();
    ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    ctx.restore();
    var cyc = (t * 0.8) % 1;
    var ox = w * (1.1 - cyc * 1.3);
    ctx.fillStyle = HAZARD;
    ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + h * 0.06, gy - h * 0.12); ctx.lineTo(ox + h * 0.12, gy); ctx.fill();
    var px = w * 0.2, size = h * 0.1;
    var dx = ox - px;
    var jump = dx < size * 2.2 && dx > -size * 1.5 ? Math.sin((1 - (dx + size * 1.5) / (size * 3.7)) * Math.PI) : 0;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.fillStyle = ACCENT;
    ctx.translate(px + size / 2, gy - size / 2 - Math.max(0, jump) * h * 0.25);
    ctx.rotate(Math.max(0, jump) * Math.PI);
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_block_runner',
    order: 5,
    title: 'Block Runner',
    tagline: 'Jump the blocks. Duck the drones.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP TO JUMP · HOLD FOR HEIGHT · SWIPE DOWN TO DUCK',
    controls: 'Space / ↑ jump (hold for height) · ↓ duck',
    create: create,
    attract: attract
  });
})(window);

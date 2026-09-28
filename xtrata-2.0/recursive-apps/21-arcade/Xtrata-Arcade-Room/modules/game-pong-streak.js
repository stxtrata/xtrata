/*
 * Xtrata Arcade cartridge #21 — PONG STREAK
 * You against the machine. Every return scores more the longer the rally
 * runs; get one past the machine for a big bonus, but it levels up and
 * gets sharper each time. The ball speeds up on every hit. Three lives.
 * Contract game-id: xa_pong_streak (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-pong-streak');
  var U = XA.util;

  var W = 420, H = 600, PW = 84, PH = 12, BR = 7;
  var PY = H - 44, AY = 44;
  var ACCENT = '#b98cff', YOU = '#3ff0ff', CPU = '#ff3fa4';
  var M = function () { return XA.music; };
  var CT = [0, 2, 4, 6];   // chord tones; rally hits climb through them

  // G dorian disco-funk vamp: Gm7 - C7, two bars each.
  function song() {
    return {
      bpm: 112, key: 55, scale: 'dorian', chords: [0, 3], barsPerChord: 2, seed: 21,
      tracks: [
        { name: 'ohat', inst: 'hat', layer: 0, gain: 0.3, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'bass', inst: 'bass', layer: 0.1, gain: 0.45, chord: true, octave: -2, params: { cutoff: 1100 },
          pattern: '0 . ^0 . . 0 . 4 0 . ^0 . 6 . 4 .' },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.56, pattern: 'x...x...x...x...' },
        { name: 'clap', inst: 'clap', layer: 0.4, gain: 0.42, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.55, gain: 0.24, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'stab', inst: 'pluck', layer: 0.7, gain: 0.3, chord: true, params: { cutoff: 2600, decay: 0.12 },
          fn: function (i) { return i.stepInBar === 6 || i.stepInBar === 14 ? [0, 2, 4, 6] : null; } },
        { name: 'strings', inst: 'pad', layer: 0.85, gain: 0.24, chord: true, params: { cutoff: 2200, attack: 0.3 },
          fn: function (i) { return i.step % 32 === 0 ? [{ deg: 4, steps: 32 }, { deg: 6, steps: 32 }, { deg: 9, steps: 32 }] : null; } }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var you = { x: W / 2 }, cpu = { x: W / 2, err: 0 };
    var ball = null, serveT = 1, rally = 0, best = 0, level = 1, lives = 3;
    var lastMoved = api.pointer().moved;
    var over = false, overT = 0, t = 0, flash = 0;
    var hitN = 0, lastI = -1, lastBpm = 112;
    if (M()) M().play(song(), { fade: 1, intensity: 0 });
    // groove builds with the rally; tempo follows ball speed (event-driven)
    function syncMusic() {
      var m = M();
      if (!m) return;
      var v = Math.round(U.clamp(rally / 24 + (level - 1) * 0.04, 0, 1) * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
      var sp = ball ? Math.hypot(ball.vx, ball.vy) : 300;
      var bpm = Math.round(108 + U.clamp((sp - 300) / 480, 0, 1) * 28);
      if (Math.abs(bpm - lastBpm) >= 1) { lastBpm = bpm; m.setTempo(bpm, 0.8); }
    }
    function hitNote(inst, gain) {
      var m = M();
      if (!m) return false;
      var k = hitN++ % 12;
      m.note(inst, CT[k % 4] + 7 * Math.floor(k / 4), { chord: true, quantize: '8', gain: gain });
      return true;
    }

    function serve() {
      var a = Math.PI / 2 + (rng() - 0.5) * 0.9;
      var sp = 300 + (level - 1) * 12;
      ball = { x: W / 2, y: H / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp };
      rally = 0; hitN = 0;
      syncMusic();
      cpu.err = (rng() - 0.5) * Math.max(20, 110 - level * 12);
    }
    function predictX(targetY) {
      // straight-line prediction with wall reflections
      var x = ball.x, y = ball.y, vx = ball.vx, vy = ball.vy;
      if (vy >= 0) return W / 2;
      var tt = (y - targetY) / -vy;
      x += vx * tt;
      var span = W - 2 * BR;
      x -= BR;
      x = ((x % (2 * span)) + 2 * span) % (2 * span);
      if (x > span) x = 2 * span - x;
      return x + BR;
    }
    function paddleHit(px, dirUp) {
      var off = U.clamp((ball.x - px) / (PW / 2), -1, 1);
      var sp = Math.min(780, Math.hypot(ball.vx, ball.vy) * 1.045);
      var ang = off * 1.05;           // up to ~60 degrees
      ball.vx = Math.sin(ang) * sp;
      ball.vy = (dirUp ? -1 : 1) * Math.cos(ang) * sp;
    }

    function wallTick() {
      if (M()) M().note('hat', 0, { gain: 0.3, vel: 0.6 });
      else api.audio.tone(300, 0.03, { type: 'square', vol: 0.06 });
    }

    return {
      // Read-only test hook: what is on screen right now.
      debug: function () { return { ball: ball && { x: ball.x, y: ball.y, vy: ball.vy }, rally: rally, lives: lives }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (flash > 0) flash -= dt;
        // player paddle: pointer when it moves, otherwise keys
        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; you.x = p.x; }
        if (inp.held('left')) you.x -= 540 * dt;
        if (inp.held('right')) you.x += 540 * dt;
        you.x = U.clamp(you.x, PW / 2, W - PW / 2);
        if (over) { overT += dt; if (overT > 1.2) api.gameOver(); return; }

        if (!ball) {
          serveT -= dt;
          if (serveT <= 0) serve();
          cpu.x += (W / 2 - cpu.x) * Math.min(1, dt * 3);
          api.setStatus('LEVEL ' + level + '  ·  LIVES ' + lives + '  ·  BEST RALLY ' + best);
          return;
        }
        // CPU: aims at the predicted landing spot plus a per-rally error
        var target = ball.vy < 0 ? predictX(AY + PH) + cpu.err : W / 2 + (ball.x - W / 2) * 0.3;
        var maxV = 200 + level * 38;
        cpu.x += U.clamp(target - cpu.x, -maxV * dt, maxV * dt);
        cpu.x = U.clamp(cpu.x, PW / 2, W - PW / 2);

        var steps = 3;
        for (var s = 0; s < steps && ball; s++) {
          var h = dt / steps;
          ball.x += ball.vx * h; ball.y += ball.vy * h;
          if (ball.x < BR) { ball.x = BR; ball.vx = Math.abs(ball.vx); wallTick(); }
          if (ball.x > W - BR) { ball.x = W - BR; ball.vx = -Math.abs(ball.vx); wallTick(); }
          // your paddle
          if (ball.vy > 0 && ball.y + BR >= PY && ball.y + BR <= PY + PH + 10 && Math.abs(ball.x - you.x) <= PW / 2 + BR) {
            ball.y = PY - BR;
            paddleHit(you.x, true);
            rally++;
            best = Math.max(best, rally);
            var pts = 10 * (1 + Math.floor(rally / 5)) * level;
            api.addScore(pts);
            if (rally % 5 === 0) api.fx.text(W / 2, H / 2, 'RALLY ' + rally, YOU, 14);
            api.fx.burst(ball.x, PY, YOU, 8, 100, 0.3);
            if (!hitNote('pluck', 0.7)) api.audio.tone(440 + Math.min(rally, 20) * 20, 0.05, { type: 'square', vol: 0.14 });
            syncMusic();
            if (rally % 10 === 0 && M()) {
              M().stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4, steps: 4 }], { inst: 'pluck', quantize: 'beat', octave: 1, gain: 0.55 });
            }
            cpu.err = (rng() - 0.5) * Math.max(16, 110 - level * 12 - rally * 2);
          }
          // CPU paddle
          if (ball.vy < 0 && ball.y - BR <= AY + PH && ball.y - BR >= AY - 10 && Math.abs(ball.x - cpu.x) <= PW / 2 + BR) {
            ball.y = AY + PH + BR;
            paddleHit(cpu.x, false);
            api.fx.burst(ball.x, AY + PH, CPU, 8, 100, 0.3);
            if (!hitNote('marimba', 0.6)) api.audio.tone(330, 0.05, { type: 'square', vol: 0.12 });
            syncMusic();
          }
          if (ball.y > H + 20) {
            lives--;
            api.shake(8); flash = 0.4;
            api.audio.tone(140, 0.4, { type: 'sawtooth', slide: 0.4, vol: 0.25 });
            if (M()) M().duck(0.5, 0.9);
            ball = null; serveT = 1.1;
            if (lives <= 0) over = true;
          } else if (ball.y < -20) {
            var bonus = 100 * level;
            api.addScore(bonus);
            api.fx.text(W / 2, H / 2 - 30, 'POINT! +' + bonus, CPU, 16);
            api.fx.burst(ball.x, 0, CPU, 30, 200, 0.8);
            if (M()) M().stinger([{ deg: 4 }, { deg: 6, at: 2 }, { deg: 7, at: 4, steps: 6 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.55 });
            else api.audio.arp([523, 659, 784], 0.07, { type: 'square', vol: 0.18 });
            level++;
            api.fx.text(W / 2, H / 2, 'MACHINE LEVEL ' + level, ACCENT, 13);
            ball = null; serveT = 1.2;
          }
        }
        if (ball) api.fx.trail(ball.x, ball.y, 'rgba(255,255,255,0.4)', 0, 0);
        api.setStatus('LEVEL ' + level + '  ·  LIVES ' + lives + '  ·  RALLY ' + rally + '  ·  BEST ' + best);
      },

      render: function (ctx) {
        ctx.fillStyle = '#07061a';
        ctx.fillRect(0, 0, W, H);
        if (flash > 0) { ctx.fillStyle = 'rgba(255,77,109,' + flash * 0.4 + ')'; ctx.fillRect(0, 0, W, H); }
        // centre line
        ctx.fillStyle = 'rgba(185,140,255,0.25)';
        for (var x = 6; x < W; x += 24) ctx.fillRect(x, H / 2 - 1, 12, 2);
        ctx.strokeStyle = 'rgba(185,140,255,0.3)'; ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, W - 4, H - 4);
        // lives / level
        for (var l = 0; l < lives; l++) { ctx.fillStyle = YOU; ctx.fillRect(12 + l * 16, H - 16, 10, 6); }
        ctx.fillStyle = 'rgba(255,200,240,0.6)';
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('MACHINE LV ' + level, W - 12, 20);
        // rally counter
        if (rally > 1) {
          ctx.save();
          ctx.globalAlpha = 0.18;
          U.glowText(ctx, String(rally), W / 2, H / 2 + 60, 60, ACCENT);
          ctx.restore();
        }
        function paddle(px, py, col) {
          ctx.save();
          ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16;
          U.roundRect(ctx, px - PW / 2, py, PW, PH, 6); ctx.fill();
          ctx.restore();
        }
        paddle(cpu.x, AY, CPU);
        paddle(you.x, PY, YOU);
        if (ball) {
          ctx.save();
          ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.arc(ball.x, ball.y, BR, 0, 7); ctx.fill();
          ctx.restore();
        } else if (!over) {
          ctx.save();
          ctx.globalAlpha = 0.5 + Math.sin(t * 8) * 0.4;
          U.glowText(ctx, 'READY', W / 2, H / 2 - 40, 14, '#e6d9ff');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#07061a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(185,140,255,0.25)';
    for (var x = 4; x < w; x += 14) ctx.fillRect(x, h / 2 - 1, 7, 2);
    var k = (t * 0.7) % 2, up = k > 1;
    var f = up ? 2 - k : k;
    var by = h * 0.12 + f * h * 0.76;
    var bx = w / 2 + Math.sin(t * 2.1) * w * 0.35;
    var pw = w * 0.2;
    ctx.fillStyle = CPU; ctx.fillRect(bx - pw / 2 + Math.sin(t * 3) * 6, h * 0.08, pw, h * 0.03);
    ctx.fillStyle = YOU; ctx.fillRect(bx - pw / 2 - Math.sin(t * 2.5) * 6, h * 0.89, pw, h * 0.03);
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(bx, by, h * 0.025, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
  }

  XA.registerGame({
    id: 'xa_pong_streak',
    order: 21,
    title: 'Pong Streak',
    tagline: 'Keep the rally alive. Beat the machine.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO MOVE YOUR PADDLE',
    controls: 'Mouse / drag or ←→ to move',
    create: create,
    attract: attract
  });
})(window);

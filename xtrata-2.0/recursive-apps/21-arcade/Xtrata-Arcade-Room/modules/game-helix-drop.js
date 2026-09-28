/*
 * Xtrata Arcade cartridge #15 — HELIX DROP
 * A ball bounces on a spiral tower of rings. Spin the tower so the ball
 * drops through the gaps; avoid the red segments. Fall through three rings
 * without bouncing and the ball ignites, smashing whatever it lands on.
 * Contract game-id: xa_helix_drop (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-helix-drop');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 400, H = 600, CX = W / 2;
  var R = 150, RI = 34, SQ = 0.32, SEG = 12, STEP = Math.PI * 2 / SEG, GAP_Y = 118, BALL_R = 11;
  var FRONT = Math.PI / 2, MID = (R + RI) / 2;
  var ACCENT = '#ff9f1c', SAFE = '#3ff0ff', DANGER = '#ff2d55';

  // Music: C# minor drum & bass at 170 - half-time drums while shallow, full
  // two-step break deeper down. Each gap fallen through plays the next note
  // of a descending run (reset on landing); an ignited ball opens the filter
  // and adds a riser until it lands.
  var CLOSED = 4200;
  function song() {
    return {
      bpm: 170, key: 49, scale: 'minor', chords: [0, 0, 5, 6], seed: 15, filter: CLOSED,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.34, chord: true, octave: 0, params: { cutoff: 1000, attack: 0.8, release: 1.5 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0.08, gain: 0.5, chord: true, octave: -1, pattern: '0 - - - - - - - . . 0 - - - - .' },
        { name: 'hkick', inst: 'kick', layer: 0.15, maxLayer: 0.5, gain: 0.6, pattern: 'x.........x.....' },
        { name: 'hsnare', inst: 'snare', layer: 0.15, maxLayer: 0.5, gain: 0.4, pattern: '........x.......' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.25, pattern: '..x...x...x...xx' },
        { name: 'kick', inst: 'kick', layer: 0.5, gain: 0.6, pattern: 'x.........x.....' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.42, pattern: '....x..x.x..x...' },
        { name: 'reese', inst: 'bass', layer: 0.62, gain: 0.3, chord: true, octave: -1, params: { cutoff: 500, q: 2 },
          pattern: '0 - - - - - . 0 - - . 2 - - 1 -' },
        { name: 'shaker', inst: 'shaker', layer: 0.72, gain: 0.3, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'stab', inst: 'bell', layer: 0.85, gain: 0.25, chord: true, octave: 1,
          fn: function (i) { return i.stepInBar === 6 || (i.stepInBar === 14 && i.bar % 2) ? [{ deg: 4, vel: 0.6 }, { deg: 7, vel: 0.5 }] : null; } }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var rings = [];                 // { y, kinds:[0 plate,1 gap,2 danger], broken, splats:[] }
    var rot = 0;
    var ball = { y: -60, vy: 0 };
    var nextRing = 0, cam = -200, combo = 0, passed = 0;
    var lastPX = null, lastMoved = api.pointer().moved;
    var over = false, overT = 0, t = 0;

    function makeRing(k) {
      var kinds = new Array(SEG).fill(0);
      var gapLen = k < 10 ? 2 : (rng() < 0.6 ? 2 : 1);
      var g0 = Math.floor(rng() * SEG);
      if (k === 0) g0 = 7;          // first gap starts away from the ball
      for (var i = 0; i < gapLen; i++) kinds[(g0 + i) % SEG] = 1;
      var danger = k < 3 ? 0 : Math.min(5, 1 + Math.floor(k / 7));
      for (var d = 0; d < danger; d++) {
        var s = Math.floor(rng() * SEG);
        if (kinds[s] === 0 && !(k < 6 && s === 3)) kinds[s] = 2;
      }
      // the ring the ball starts on must be safe under it
      if (k === 0) kinds[3] = 0;
      return { y: k * GAP_Y, kinds: kinds, broken: 0, splats: [] };
    }
    function ring(k) { while (rings.length <= k) rings.push(makeRing(rings.length)); return rings[k]; }
    for (var i = 0; i < 12; i++) ring(i);
    var run = 0, fireOn = false, lastInt = -1;
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    // ignited ball: open the filter + riser; any landing closes it again
    function setFire(on) {
      if (on === fireOn) return;
      fireOn = on;
      var m = M();
      if (!m) return;
      m.setFilter(on ? 16000 : CLOSED, on ? 0.25 : 0.5);
      if (on) m.note('riser', 0, { dur: 0.8, gain: 0.4 });
    }
    function landed() {
      run = 0;
      setFire(false);
      var m = M();
      if (!m) return;
      var it = Math.round(U.clamp(0.1 + passed / 55, 0, 1) * 20) / 20;
      if (it !== lastInt) { lastInt = it; m.setIntensity(it); }
    }

    function segUnderBall() {
      var local = ((FRONT - rot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      return Math.floor(local / STEP) % SEG;
    }
    function landOn(rg, k) {
      var s = segUnderBall();
      var kind = rg.kinds[s];
      var sy = rg.y;
      if (kind === 1) {
        passed++;
        combo++;
        var pts = 10 * combo;
        api.addScore(pts);
        if (combo > 1) api.fx.text(CX + 40, sy - cam - 10, '+' + pts, combo >= 3 ? ACCENT : '#fff', 11 + Math.min(combo, 5));
        var m = M();
        if (m) {
          // a cascade: every gap in one fall is the next note down the scale
          m.note('pluck', 9 - Math.min(run, 16), { octave: 0, gain: 0.7, params: { decay: 0.35 } });
          run++;
          setFire(combo >= 3);
        } else api.audio.tone(300 + Math.min(combo, 12) * 60, 0.06, { type: 'triangle', vol: 0.12 });
        nextRing = k + 1;
        return false;
      }
      if (combo >= 3) {
        // fireball smash
        rg.broken = 1;
        passed++;
        api.addScore(20 + combo * 5);
        api.fx.burst(CX, sy - cam + MID * SQ, ACCENT, 40, 260, 0.8);
        api.fx.text(CX, sy - cam - 20, 'SMASH', ACCENT, 15);
        api.shake(7);
        api.audio.noise(0.25, { vol: 0.28, cutoff: 1400 });
        if (M()) M().note('sub', 0, { octave: -2, dur: 0.4, gain: 0.8 });
        combo = 0;
        landed();
        nextRing = k + 1;
        ball.vy = -520;
        return true;
      }
      if (kind === 2) {
        over = true;
        api.fx.burst(CX, sy - cam + MID * SQ, DANGER, 36, 220, 0.9);
        api.shake(12);
        api.audio.tone(160, 0.5, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
        setFire(false);
        return true;
      }
      // normal bounce
      ball.y = sy - BALL_R;
      ball.vy = -600;
      combo = 0;
      landed();
      var local = ((FRONT - rot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      rg.splats.push(local);
      if (rg.splats.length > 5) rg.splats.shift();
      api.audio.tone(180, 0.05, { type: 'square', vol: 0.1 });
      api.fx.burst(CX, sy - cam + MID * SQ, SAFE, 6, 80, 0.3);
      return true;
    }

    return {
      // Read-only test hook.
      debug: function () { return { seg: segUnderBall(), kinds: ring(nextRing).kinds.slice(), passed: passed }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        // rotate: keys, or drag horizontally (mouse or touch)
        if (inp.held('left')) rot -= 3.4 * dt;
        if (inp.held('right')) rot += 3.4 * dt;
        var p = api.pointer();
        if (p.down) {
          if (lastPX !== null && p.moved !== lastMoved) rot += (p.x - lastPX) * 0.014;
          lastPX = p.x;
        } else lastPX = null;
        lastMoved = p.moved;

        if (over) { overT += dt; if (overT > 1.2) api.gameOver(); return; }

        var prevBottom = ball.y + BALL_R;
        ball.vy = Math.min(900, ball.vy + 1900 * dt);
        ball.y += ball.vy * dt;
        var bottom = ball.y + BALL_R;
        // check rings crossed this frame
        for (var k = nextRing; k < nextRing + 3; k++) {
          var rg = ring(k);
          if (rg.broken) { if (k === nextRing) nextRing++; continue; }
          if (prevBottom <= rg.y && bottom >= rg.y && ball.vy > 0) {
            if (landOn(rg, k)) break;
          }
        }
        // keep a lookahead of rings and let the camera trail the ball
        ring(nextRing + 10);
        cam += ((ball.y - 210) - cam) * Math.min(1, dt * 6);
        rings.forEach(function (rg) { if (rg.broken > 0 && rg.broken < 2) rg.broken = Math.min(2, rg.broken + dt * 2); });
        api.setStatus('RINGS ' + passed + (combo >= 3 ? '  ·  ON FIRE' : combo > 1 ? '  ·  COMBO ' + combo : ''));
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#1a0a2e'); g.addColorStop(1, '#070312');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        var first = Math.max(0, Math.floor((cam - 80) / GAP_Y)), last = Math.floor((cam + H + 80) / GAP_Y);
        var i, k;
        function segPath(sy, a0, a1, lift) {
          ctx.beginPath();
          var n = 6;
          for (i = 0; i <= n; i++) {
            var a = a0 + (a1 - a0) * i / n;
            ctx.lineTo(CX + Math.cos(a) * R, sy + lift + Math.sin(a) * R * SQ);
          }
          for (i = n; i >= 0; i--) {
            var b = a0 + (a1 - a0) * i / n;
            ctx.lineTo(CX + Math.cos(b) * RI, sy + lift + Math.sin(b) * RI * SQ);
          }
          ctx.closePath();
        }
        function drawRing(k, frontHalf) {
          var rg = rings[k];
          if (!rg || rg.broken >= 2) return;
          var sy = rg.y - cam;
          var alpha = rg.broken ? 1 - rg.broken / 2 : 1;
          for (var s = 0; s < SEG; s++) {
            var kind = rg.kinds[s];
            if (kind === 1) continue;
            var a0 = s * STEP + rot, a1 = a0 + STEP;
            var mid = (a0 + a1) / 2;
            var isFront = Math.sin(mid) > 0;
            if (isFront !== frontHalf) continue;
            var col = kind === 2 ? DANGER : k === nextRing ? SAFE : '#2fb9c9';
            ctx.save();
            ctx.globalAlpha = alpha;
            if (isFront) { ctx.fillStyle = kind === 2 ? '#7a0f25' : '#0e4f58'; segPath(sy, a0, a1, 12); ctx.fill(); }
            ctx.fillStyle = col;
            if (kind === 2) { ctx.shadowColor = DANGER; ctx.shadowBlur = 10; }
            segPath(sy, a0, a1, 0); ctx.fill();
            ctx.restore();
          }
          // paint splats where the ball bounced
          rg.splats.forEach(function (loc) {
            var a = loc + rot;
            if ((Math.sin(a) > 0) !== frontHalf) return;
            ctx.fillStyle = 'rgba(255,159,28,0.55)';
            ctx.beginPath(); ctx.ellipse(CX + Math.cos(a) * MID, sy + Math.sin(a) * MID * SQ, 10, 4, 0, 0, 7); ctx.fill();
          });
        }
        for (k = last; k >= first; k--) drawRing(k, false);
        // central pillar
        var pg = ctx.createLinearGradient(CX - RI, 0, CX + RI, 0);
        pg.addColorStop(0, '#2a1450'); pg.addColorStop(0.5, '#5b3aa0'); pg.addColorStop(1, '#2a1450');
        ctx.fillStyle = pg;
        ctx.fillRect(CX - RI + 4, 0, (RI - 4) * 2, H);
        for (k = last; k >= first; k--) drawRing(k, true);

        // ball (always at the front of the tower)
        var by = ball.y - cam + MID * SQ;
        var fire = combo >= 3;
        ctx.save();
        ctx.fillStyle = fire ? ACCENT : '#ffffff';
        ctx.shadowColor = fire ? ACCENT : '#ffd9a8'; ctx.shadowBlur = fire ? 26 : 12;
        var squash = ball.vy < -300 ? 1.08 : 1;
        ctx.beginPath(); ctx.ellipse(CX, by, BALL_R / squash, BALL_R * squash, 0, 0, 7); ctx.fill();
        ctx.restore();
        if (fire && !over) api.fx.trail(CX + (Math.random() - 0.5) * 8, by - 8, ACCENT, 0, -60);

        if (passed === 0 && !over) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'DRAG OR ←→ TO SPIN', W / 2, 60, 13, '#ffe2bd');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1a0a2e'); g.addColorStop(1, '#070312');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var cx = w / 2, r = Math.min(w, h * 1.4) * 0.34, ri = r * 0.22, rot = t * 1.1;
    ctx.fillStyle = '#4a2c88';
    ctx.fillRect(cx - ri * 0.8, 0, ri * 1.6, h);
    for (var k = 0; k < 4; k++) {
      var sy = h * 0.2 + k * h * 0.25;
      for (var s = 0; s < 12; s++) {
        if ((s + k * 5) % 12 < 2) continue;
        var a0 = s * Math.PI / 6 + rot + k, a1 = a0 + Math.PI / 6;
        ctx.fillStyle = (s * 7 + k) % 11 === 0 ? DANGER : '#2fb9c9';
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a0) * r, sy + Math.sin(a0) * r * SQ);
        ctx.lineTo(cx + Math.cos(a1) * r, sy + Math.sin(a1) * r * SQ);
        ctx.lineTo(cx + Math.cos(a1) * ri, sy + Math.sin(a1) * ri * SQ);
        ctx.lineTo(cx + Math.cos(a0) * ri, sy + Math.sin(a0) * ri * SQ);
        ctx.fill();
      }
    }
    var bounce = Math.abs(Math.sin(t * 3)) * h * 0.12;
    ctx.fillStyle = '#fff'; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(cx, h * 0.2 + r * 0.6 * SQ - bounce - h * 0.03, h * 0.03, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
  }

  XA.registerGame({
    id: 'xa_helix_drop',
    order: 15,
    title: 'Helix Drop',
    tagline: 'Spin the tower. Fall through.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO SPIN THE TOWER',
    controls: 'Drag or ←→ to spin the tower',
    create: create,
    attract: attract
  });
})(window);

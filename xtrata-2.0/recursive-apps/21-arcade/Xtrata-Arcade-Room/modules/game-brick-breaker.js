/*
 * Xtrata Arcade cartridge #6 — BRICK BREAKER
 * Paddle, ball, bricks. Tough bricks take several hits, power-ups drop from
 * broken bricks, consecutive hits without touching the paddle build a combo.
 * Clear the wall to go up a level; three lives.
 * Contract game-id: xa_brick_breaker (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-brick-breaker');
  var U = XA.util;

  var W = 480, H = 600;
  var COLS = 10, BW = 44, BH = 18, GAP = 2, TOP = 76;
  var BX0 = (W - COLS * (BW + GAP) + GAP) / 2;
  var PY = 556, PH = 12, BALL_R = 6;
  var ACCENT = '#ff3fa4';
  var HP_COLORS = ['', '#3ff0ff', '#ffd23f', '#ff4d6d', '#b04dff'];
  var POWERS = {
    wide: { c: '#39ff88', l: 'W' },
    multi: { c: '#3ff0ff', l: 'M' },
    slow: { c: '#ffd23f', l: 'S' },
    life: { c: '#ff3fa4', l: '+' }
  };

  function create(api) {
    var rng = api.rng;
    var level = 1, lives = 3;
    var bricks = [];
    var balls = [];
    var drops = [];
    var paddle = { x: W / 2, w: 84, target: 84 };
    var wideT = 0, slowT = 0;
    var combo = 0;
    var lastMoved = api.pointer().moved;
    var over = false, overT = 0, clearT = 0;
    var t = 0;

    function baseSpeed() { return Math.min(560, 330 + (level - 1) * 28); }

    function buildLevel() {
      bricks = [];
      var rows = Math.min(9, 5 + Math.floor((level - 1) / 2));
      var pattern = (level - 1) % 4;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < COLS; c++) {
          var keep = true;
          if (pattern === 1) keep = (r + c) % 2 === 0 || r < 2;
          if (pattern === 2) keep = Math.abs(c - 4.5) + r * 0.6 < 6.5;
          if (pattern === 3) keep = c % 3 !== 1 || r % 2 === 0;
          if (!keep) continue;
          var hp = 1;
          var toughChance = Math.min(0.7, 0.08 * level);
          if (r < 2 && rng() < toughChance) hp = 2 + (rng() < 0.08 * level ? 1 : 0);
          if (level >= 4 && r === 0 && rng() < 0.25) hp = 4;
          bricks.push({ x: BX0 + c * (BW + GAP), y: TOP + r * (BH + GAP), hp: hp, max: hp, flash: 0 });
        }
      }
    }
    function resetBall() {
      balls = [{ x: paddle.x, y: PY - BALL_R - 1, vx: 0, vy: 0, stuck: true }];
      combo = 0;
    }
    function launch(b) {
      var ang = (-90 + (rng() - 0.5) * 30) * Math.PI / 180;
      var sp = baseSpeed();
      b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp; b.stuck = false;
      api.audio.tone(660, 0.06, { type: 'square', vol: 0.12 });
    }
    buildLevel();
    resetBall();

    function hitBrick(br, b) {
      br.hp--;
      br.flash = 0.12;
      combo++;
      var mult = 1 + Math.min(combo - 1, 10) * 0.1;
      var cx = br.x + BW / 2, cy = br.y + BH / 2;
      if (br.hp <= 0) {
        var pts = Math.round(10 * br.max * level * mult);
        api.addScore(pts);
        api.fx.burst(cx, cy, HP_COLORS[Math.min(br.max, 4)], 14, 160, 0.5);
        if (combo >= 3) api.fx.text(cx, cy, '+' + pts, '#fff', 10);
        api.audio.tone(440 + Math.min(combo, 16) * 40, 0.05, { type: 'square', vol: 0.12 });
        if (rng() < 0.11) {
          var kinds = ['wide', 'multi', 'slow', 'wide', 'multi'];
          if (rng() < 0.12) kinds = ['life'];
          drops.push({ x: cx, y: cy, kind: kinds[Math.floor(rng() * kinds.length)] });
        }
      } else {
        api.addScore(Math.round(5 * level));
        api.audio.tone(300, 0.04, { type: 'triangle', vol: 0.1 });
      }
      void b;
    }

    // Move one ball by (dx, dy); returns false if it fell out.
    function stepBall(b, h) {
      b.x += b.vx * h; b.y += b.vy * h;
      if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
      if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
      if (b.y < BALL_R + 30) { b.y = BALL_R + 30; b.vy = Math.abs(b.vy); }
      // paddle
      var half = paddle.w / 2;
      if (b.vy > 0 && b.y + BALL_R >= PY && b.y + BALL_R <= PY + PH + 8 && b.x > paddle.x - half - BALL_R && b.x < paddle.x + half + BALL_R) {
        var off = U.clamp((b.x - paddle.x) / half, -1, 1);
        var ang = (-90 + off * 62) * Math.PI / 180;
        var sp = Math.min(640, Math.hypot(b.vx, b.vy) * 1.012);
        b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp;
        b.y = PY - BALL_R;
        combo = 0;
        api.audio.tone(220, 0.05, { type: 'square', vol: 0.12 });
        api.fx.burst(b.x, PY, ACCENT, 6, 80, 0.3);
      }
      // bricks: resolve at most one per substep
      for (var i = 0; i < bricks.length; i++) {
        var br = bricks[i];
        if (br.hp <= 0) continue;
        var nx = U.clamp(b.x, br.x, br.x + BW), ny = U.clamp(b.y, br.y, br.y + BH);
        var dx = b.x - nx, dy = b.y - ny;
        if (dx * dx + dy * dy > BALL_R * BALL_R) continue;
        var penX = Math.min(Math.abs(b.x - br.x), Math.abs(br.x + BW - b.x));
        var penY = Math.min(Math.abs(b.y - br.y), Math.abs(br.y + BH - b.y));
        if (dx === 0 && dy === 0) { if (penX < penY) b.vx = -b.vx; else b.vy = -b.vy; }
        else if (Math.abs(dx) > Math.abs(dy)) b.vx = dx > 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
        else b.vy = dy > 0 ? Math.abs(b.vy) : -Math.abs(b.vy);
        hitBrick(br, b);
        break;
      }
      return b.y < H + 20;
    }

    function loseLife() {
      lives--;
      api.shake(8);
      api.audio.tone(200, 0.4, { type: 'sawtooth', slide: 0.4, vol: 0.25 });
      paddle.target = 84; wideT = 0; slowT = 0; drops = [];
      if (lives <= 0) {
        over = true;
        api.fx.burst(paddle.x, PY, ACCENT, 40, 220, 1);
        return;
      }
      api.fx.text(W / 2, H / 2, lives + (lives === 1 ? ' LIFE LEFT' : ' LIVES LEFT'), '#fff', 14);
      resetBall();
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var sw = inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); return; }

        // Paddle: pointer when it moves, otherwise keys.
        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; paddle.x = p.x; }
        if (inp.held('left')) paddle.x -= 560 * dt;
        if (inp.held('right')) paddle.x += 560 * dt;
        paddle.w += (paddle.target - paddle.w) * Math.min(1, dt * 10);
        paddle.x = U.clamp(paddle.x, paddle.w / 2 + 4, W - paddle.w / 2 - 4);

        if (wideT > 0) { wideT -= dt; if (wideT <= 0) paddle.target = 84; }
        if (slowT > 0) slowT -= dt;

        if (clearT > 0) {
          clearT -= dt;
          balls.forEach(function (b) { if (b.stuck) b.x = paddle.x; });
          if (clearT <= 0) { level++; buildLevel(); resetBall(); api.fx.text(W / 2, H / 2, 'LEVEL ' + level, '#ffd23f', 18); }
          return;
        }

        var launchNow = inp.hit('a') || inp.hit('up') || sw.indexOf('tap') >= 0;
        balls.forEach(function (b) {
          if (b.stuck) { b.x = paddle.x; b.y = PY - BALL_R - 1; if (launchNow) launch(b); }
        });

        var slow = slowT > 0 ? 0.65 : 1;
        var sub = 3;
        for (var s = 0; s < sub; s++) {
          balls = balls.filter(function (b) { return b.stuck || stepBall(b, dt * slow / sub); });
        }
        balls.forEach(function (b) { if (!b.stuck) api.fx.trail(b.x, b.y, 'rgba(255,255,255,0.5)', 0, 0); });
        if (!balls.length) { loseLife(); return; }

        // power-up drops
        drops = drops.filter(function (d) {
          d.y += 150 * dt;
          if (d.y > PY - 6 && d.y < PY + PH + 6 && Math.abs(d.x - paddle.x) < paddle.w / 2 + 10) {
            var pw = POWERS[d.kind];
            api.fx.burst(d.x, PY, pw.c, 16, 140);
            api.audio.arp([523, 784], 0.05, { type: 'triangle', vol: 0.16 });
            if (d.kind === 'wide') { paddle.target = 134; wideT = 12; api.fx.text(d.x, PY - 20, 'WIDE', pw.c, 11); }
            if (d.kind === 'slow') { slowT = 10; api.fx.text(d.x, PY - 20, 'SLOW', pw.c, 11); }
            if (d.kind === 'life') { lives = Math.min(5, lives + 1); api.fx.text(d.x, PY - 20, '+1 LIFE', pw.c, 11); }
            if (d.kind === 'multi') {
              api.fx.text(d.x, PY - 20, 'MULTI', pw.c, 11);
              var src = balls.filter(function (b) { return !b.stuck; })[0];
              if (src) for (var k = 0; k < 2 && balls.length < 8; k++) {
                var a = Math.atan2(src.vy, src.vx) + (k ? 0.45 : -0.45);
                var sp = Math.hypot(src.vx, src.vy);
                balls.push({ x: src.x, y: src.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, stuck: false });
              }
            }
            return false;
          }
          return d.y < H + 20;
        });

        bricks.forEach(function (br) { if (br.flash > 0) br.flash -= dt; });
        if (bricks.every(function (br) { return br.hp <= 0; })) {
          var bonus = 250 * level + lives * 100;
          api.addScore(bonus);
          api.fx.text(W / 2, H / 2 - 30, 'WALL CLEARED +' + bonus, '#39ff88', 15);
          api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.2 });
          balls = balls.slice(0, 1);
          balls[0].stuck = true;
          clearT = 1.6;
        }
        var left = bricks.filter(function (br) { return br.hp > 0; }).length;
        api.setStatus('LV ' + level + '  ·  LIVES ' + lives + '  ·  BRICKS ' + left + (combo > 2 ? '  ·  COMBO ' + combo : ''));
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#12051f'); g.addColorStop(1, '#05030c');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,63,164,0.07)';
        ctx.beginPath();
        for (var x = 0; x <= W; x += 24) { ctx.moveTo(x + 0.5, 30); ctx.lineTo(x + 0.5, H); }
        ctx.stroke();
        // top rail
        ctx.save();
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(W, 30); ctx.stroke();
        ctx.restore();
        // lives
        for (var l = 0; l < lives; l++) {
          ctx.fillStyle = ACCENT;
          U.roundRect(ctx, 12 + l * 26, 11, 20, 7, 3); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('LEVEL ' + level, W - 12, 19);

        bricks.forEach(function (br) {
          if (br.hp <= 0) return;
          var col = br.flash > 0 ? '#ffffff' : HP_COLORS[Math.min(br.hp, 4)];
          ctx.save();
          ctx.shadowColor = col; ctx.shadowBlur = 8;
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.35 + 0.65 * (br.hp / br.max);
          ctx.fillRect(br.x, br.y, BW, BH);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(br.x, br.y, BW, 3);
          if (br.max > 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            for (var k = 0; k < br.hp; k++) ctx.fillRect(br.x + 5 + k * 6, br.y + BH - 6, 4, 3);
          }
          ctx.restore();
        });

        drops.forEach(function (d) {
          var pw = POWERS[d.kind];
          ctx.save();
          ctx.shadowColor = pw.c; ctx.shadowBlur = 12; ctx.fillStyle = pw.c;
          U.roundRect(ctx, d.x - 14, d.y - 8, 28, 16, 8); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#05030c';
          ctx.font = '900 11px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(pw.l, d.x, d.y + 1);
          ctx.restore();
        });

        // paddle
        ctx.save();
        ctx.shadowColor = wideT > 0 ? '#39ff88' : ACCENT; ctx.shadowBlur = 18;
        ctx.fillStyle = wideT > 0 ? '#39ff88' : ACCENT;
        U.roundRect(ctx, paddle.x - paddle.w / 2, PY, paddle.w, PH, 6); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        U.roundRect(ctx, paddle.x - paddle.w / 2 + 4, PY + 2, paddle.w - 8, 3, 2); ctx.fill();
        ctx.restore();

        balls.forEach(function (b) {
          ctx.save();
          ctx.shadowColor = slowT > 0 ? '#ffd23f' : '#ffffff'; ctx.shadowBlur = 14;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, 7); ctx.fill();
          ctx.restore();
        });
        if (balls.length === 1 && balls[0].stuck && !over && clearT <= 0) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP OR SPACE TO LAUNCH', W / 2, PY - 60, 13, '#ffd0ea');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#0d0418';
    ctx.fillRect(0, 0, w, h);
    var cols = 8, bw = w / cols;
    for (var r = 0; r < 4; r++) for (var c = 0; c < cols; c++) {
      if ((r * 3 + c * 5 + Math.floor(t * 0.5)) % 7 === 0) continue;
      ctx.fillStyle = HP_COLORS[1 + ((r + c) % 3)];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(c * bw + 2, h * 0.12 + r * h * 0.07, bw - 4, h * 0.055);
    }
    ctx.globalAlpha = 1;
    var bx = w / 2 + Math.sin(t * 1.9) * w * 0.4;
    var by = h * 0.55 + Math.abs(Math.sin(t * 2.6)) * -h * 0.25 + h * 0.2;
    var px = w / 2 + Math.sin(t * 1.9) * w * 0.35;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 12; ctx.fillStyle = ACCENT;
    U.roundRect(ctx, px - w * 0.1, h * 0.88, w * 0.2, h * 0.035, 4); ctx.fill();
    ctx.shadowColor = '#fff'; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(bx, by, h * 0.025, 0, 7); ctx.fill();
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_brick_breaker',
    order: 6,
    title: 'Brick Breaker',
    tagline: 'Smash the wall. Catch the power-ups.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO MOVE THE PADDLE · TAP TO LAUNCH',
    controls: 'Mouse or ←→ to move · Space to launch',
    create: create,
    attract: attract
  });
})(window);

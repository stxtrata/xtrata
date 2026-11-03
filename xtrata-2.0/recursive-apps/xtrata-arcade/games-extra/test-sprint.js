/*
 * Xtrata Arcade extra game (test) - ARROW SPRINT
 * Contract game-id: xa_test_sprint   (time board, LOWEST wins)
 *
 * An arrow is shown. Press that direction (arrow keys / WASD, or swipe / the pad) as fast as you can. 20 right answers
 * finish the run; each wrong press adds half a second. The score is your time in hundredths of a second.
 * More than 60 seconds is a did-not-finish.
 *
 * A cartridge for the games contract: it registers exactly one game, uses only the arcade kit and the api the hall
 * passes to create(), and all of its randomness comes from api.rng so a run replays exactly.
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before this game');
  var W = 360, H = 480, COLOR = '#b86bff', GOAL = 20, PENALTY_CS = 50, LIMIT_S = 60, MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var DIRS = ['up', 'right', 'down', 'left'];
  var GLYPH = { up: '▲', right: '▶', down: '▼', left: '◀' };

  function create(api) {
    var rng = api.rng, input = api.input;
    var steps = 0, penalty = 0, done = 0, wrong = 0, target = DIRS[rng.int(4)], over = false, overT = 0, shake = 0, msg = '';

    function cs() { return Math.floor(steps * 100 / 60) + penalty; }
    function press(d) {
      if (over) return;
      if (d === target) {
        done++; msg = '';
        if (done >= GOAL) { over = true; overT = 0; api.setScore(cs()); api.finish(); return; }
        var next = DIRS[rng.int(4)];
        target = next;
      } else { wrong++; penalty += PENALTY_CS; shake = 0.2; msg = '+0.50 s'; api.shake(3); }
    }
    api.setStatus(done + ' / ' + GOAL);

    return {
      update: function (dt) {
        if (over) { overT += dt; return; }
        steps++;
        if (shake > 0) shake -= dt;
        for (var i = 0; i < DIRS.length; i++) if (input.hit(DIRS[i])) { press(DIRS[i]); if (over) return; }
        input.takeSwipes().forEach(function (s) { if (DIRS.indexOf(s) >= 0) press(s); });
        api.setScore(cs());
        api.setStatus(done + ' / ' + GOAL + (wrong ? ' · ' + wrong + ' wrong' : ''));
        if (steps / 60 > LIMIT_S) { over = true; api.gameOver(); }       // a did-not-finish
      },
      // Read-only test hook: what is on screen right now (lets a test bot play).
      debug: function () { return { target: target, done: done, wrong: wrong, cs: cs() }; },
      render: function (ctx) {
        ctx.fillStyle = '#0b0820'; ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var c = cs();
        ctx.fillStyle = '#e8f0ff'; ctx.font = '800 38px ' + MONO;
        ctx.fillText((c / 100).toFixed(2) + ' s', W / 2, 60);
        ctx.fillStyle = 'rgba(200,220,255,0.55)'; ctx.font = '700 14px ' + MONO;
        ctx.fillText(done + ' / ' + GOAL, W / 2, 96);
        ctx.fillStyle = '#1a1540'; ctx.fillRect(40, 112, W - 80, 8);
        ctx.fillStyle = COLOR; ctx.fillRect(40, 112, (W - 80) * done / GOAL, 8);
        var jitter = shake > 0 ? Math.sin(shake * 120) * 6 : 0;
        ctx.save(); ctx.shadowColor = shake > 0 ? '#ff4d6d' : COLOR; ctx.shadowBlur = 28;
        ctx.fillStyle = shake > 0 ? '#ff4d6d' : COLOR; ctx.font = '900 190px ' + MONO;
        ctx.fillText(GLYPH[target], W / 2 + jitter, 270);
        ctx.restore();
        ctx.fillStyle = '#ff7a93'; ctx.font = '800 18px ' + MONO; ctx.fillText(msg, W / 2, 400);
        if (over) {
          ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, H / 2 - 40, W, 80);
          ctx.fillStyle = done >= GOAL ? '#5dff9b' : '#ff4d6d'; ctx.font = '900 28px ' + MONO;
          ctx.fillText(done >= GOAL ? 'FINISHED ' + (c / 100).toFixed(2) + ' s' : 'DID NOT FINISH', W / 2, H / 2);
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#0b0820'; ctx.fillRect(0, 0, w, h);
    var d = DIRS[Math.floor(t * 2.2) % 4];
    ctx.fillStyle = COLOR; ctx.shadowColor = COLOR; ctx.shadowBlur = 20; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 ' + Math.floor(h * 0.5) + 'px ' + MONO; ctx.fillText(GLYPH[d], w / 2, h / 2);
    ctx.shadowBlur = 0;
  }

  XA.registerGame({
    id: 'xa_test_sprint', order: 1001, title: 'Arrow Sprint', tagline: 'Hit the arrows. Beat the clock.', color: COLOR,
    size: { w: W, h: H }, mode: 'time', touch: 'dpad', controls: 'Arrow keys / WASD · swipe on mobile',
    modeLabel: 'Time', create: create, attract: attract
  });
})(window);

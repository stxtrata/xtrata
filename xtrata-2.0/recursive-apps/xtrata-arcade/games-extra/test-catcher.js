/*
 * Xtrata Arcade extra game (test) - SAT CATCHER
 * Contract game-id: xa_test_catcher   (score board, higher wins)
 *
 * Sats fall from the top. Slide the basket under them. Gold sats score 10, rare big ones 30. A missed sat or a
 * caught red bomb costs a heart; three hearts. It speeds up as you score.
 * Controls: left / right (or A / D), or drag on the screen.
 *
 * A cartridge for the games contract: it registers exactly one game, uses only the arcade kit and the api the hall
 * passes to create(), and all of its randomness comes from api.rng so a run replays exactly.
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before this game');
  var W = 360, H = 480, BASKET_W = 68, BASKET_Y = 440, COLOR = '#ffd23f', MONO = 'ui-monospace, Menlo, Consolas, monospace';

  function create(api) {
    var rng = api.rng, input = api.input;
    var x = W / 2, vx = 0, lives = 3, t = 0, spawnIn = 0.6, over = false, overT = 0, caught = 0, flash = 0, bonusText = '';
    var items = [];

    function level() { return 1 + Math.floor(caught / 8); }
    function fallSpeed() { return Math.min(330, 130 + level() * 22); }
    function spawn() {
      var r = rng();
      var kind = r < 0.14 ? 'bomb' : r < 0.22 ? 'big' : 'sat';
      items.push({ kind: kind, x: 20 + rng() * (W - 40), y: -12, vy: fallSpeed() * (0.9 + rng() * 0.3) });
      spawnIn = Math.max(0.28, 0.85 - level() * 0.05) * (0.8 + rng() * 0.4);
    }
    function hurt() {
      lives--; flash = 0.25;
      api.shake(4);
      if (lives <= 0 && !over) { over = true; overT = 0; }
    }
    function status() { api.setStatus('LIVES ' + lives + ' · LEVEL ' + level()); }
    status();

    return {
      update: function (dt) {
        t += dt;
        if (flash > 0) flash -= dt;
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); return; }
        var dir = (input.held('left') ? -1 : 0) + (input.held('right') ? 1 : 0);
        var p = api.pointer();
        if (p && p.down) { vx = 0; x += (p.x - x) * Math.min(1, dt * 14); }
        else { vx = dir * 300; x += vx * dt; }
        x = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, x));
        spawnIn -= dt;
        if (spawnIn <= 0) spawn();
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.y += it.vy * dt;
          var inBasket = it.y >= BASKET_Y - 14 && it.y <= BASKET_Y + 10 && Math.abs(it.x - x) <= BASKET_W / 2 + 6;
          if (inBasket) {
            items.splice(i, 1);
            if (it.kind === 'bomb') { hurt(); bonusText = 'BOOM'; }
            else { caught++; api.addScore(it.kind === 'big' ? 30 : 10); bonusText = it.kind === 'big' ? '+30' : '+10'; }
            status();
          } else if (it.y > H + 14) {
            items.splice(i, 1);
            if (it.kind !== 'bomb') { hurt(); bonusText = 'MISS'; status(); }
          }
        }
      },
      // Read-only test hook: what is on screen right now (lets a test bot play).
      debug: function () { return { x: x, lives: lives, items: items.map(function (i) { return { kind: i.kind, x: i.x, y: i.y }; }) }; },
      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#0a0c24'); g.addColorStop(1, '#171044');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (var s = 0; s < 24; s++) {            // fixed star field (not random: render must not touch the run's rng)
          ctx.fillStyle = 'rgba(200,220,255,' + (0.15 + (s % 5) * 0.08) + ')';
          ctx.fillRect((s * 83) % W, (s * 149 + t * (6 + s % 4)) % H, 2, 2);
        }
        items.forEach(function (it) {
          ctx.save();
          if (it.kind === 'bomb') {
            ctx.fillStyle = '#ff4d6d'; ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(it.x, it.y, 11, 0, 7); ctx.fill();
            ctx.shadowBlur = 0; ctx.strokeStyle = '#2a0610'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(it.x - 5, it.y - 5); ctx.lineTo(it.x + 5, it.y + 5); ctx.moveTo(it.x + 5, it.y - 5); ctx.lineTo(it.x - 5, it.y + 5); ctx.stroke();
          } else {
            var r = it.kind === 'big' ? 14 : 9;
            ctx.fillStyle = it.kind === 'big' ? '#3ff0ff' : COLOR; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14;
            ctx.beginPath(); ctx.arc(it.x, it.y, r, 0, 7); ctx.fill();
            ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.arc(it.x, it.y, r * 0.45, 0, 7); ctx.fill();
          }
          ctx.restore();
        });
        ctx.fillStyle = flash > 0 ? '#ff4d6d' : '#e8f0ff';
        ctx.fillRect(x - BASKET_W / 2, BASKET_Y, BASKET_W, 10);
        ctx.fillRect(x - BASKET_W / 2, BASKET_Y - 12, 6, 12); ctx.fillRect(x + BASKET_W / 2 - 6, BASKET_Y - 12, 6, 12);
        ctx.font = '700 14px ' + MONO; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = '#ff7a93';
        var hearts = ''; for (var i = 0; i < lives; i++) hearts += '♥ ';
        ctx.fillText(hearts, 12, 20);
        ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(200,220,255,0.6)'; ctx.fillText(bonusText, W - 12, 20);
        if (over) {
          ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, H / 2 - 36, W, 72);
          ctx.fillStyle = '#ffd23f'; ctx.font = '900 30px ' + MONO; ctx.fillText('OUT OF HEARTS', W / 2, H / 2);
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#0d0f33'; ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < 7; i++) {
      var yy = ((t * 70 + i * 61) % (h + 20)) - 10, xx = 30 + ((i * 97) % (w - 60));
      ctx.fillStyle = i % 3 === 0 ? '#3ff0ff' : COLOR; ctx.beginPath(); ctx.arc(xx, yy, 7, 0, 7); ctx.fill();
    }
    var bx = w / 2 + Math.sin(t * 1.6) * w * 0.3;
    ctx.fillStyle = '#e8f0ff'; ctx.fillRect(bx - 28, h - 40, 56, 8);
    ctx.fillRect(bx - 28, h - 50, 5, 10); ctx.fillRect(bx + 23, h - 50, 5, 10);
  }

  XA.registerGame({
    id: 'xa_test_catcher', order: 1000, title: 'Sat Catcher', tagline: 'Catch the falling sats. Dodge the bombs.', color: COLOR,
    size: { w: W, h: H }, touch: 'hint', touchHint: 'DRAG TO MOVE', controls: 'Left / right (A / D) · drag on mobile',
    modeLabel: 'Points', create: create, attract: attract
  });
})(window);

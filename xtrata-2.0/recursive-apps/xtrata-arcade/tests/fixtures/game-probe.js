/* A tiny cartridge for the tests of the games contract: 300 steps, a score that depends on the run's seed (so it only verifies when the
   replay's game index is right), and the same rules as the built-in games (api.rng, api.input, api.addScore, api.gameOver). */
(function (root) {
  'use strict';
  var XA = root.XA, W = 320, H = 240;
  function create(api) {
    var t = 0, bonus = 0;
    return {
      update: function (dt) {
        t++;
        if (t % 30 === 0) api.addScore(1 + Math.floor(api.rng() * 9));
        if (api.input.hit('a')) bonus += 2;
        if (t >= 300) { api.addScore(bonus); api.gameOver(); }
      },
      render: function (ctx) { ctx.fillStyle = '#102a44'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#3be4ff'; ctx.fillRect(10, 10, t % 300, 8); }
    };
  }
  function attract(ctx, w, h, t) { ctx.fillStyle = '#102a44'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#3be4ff'; ctx.fillRect(20 + (t * 30) % 200, 100, 30, 30); }
  XA.registerGame({ id: 'xa_probe_game', title: 'Probe Game', tagline: 'A test cartridge.', color: '#3be4ff', size: { w: W, h: H },
    touch: 'hint', touchHint: 'TEST', controls: 'A', modeLabel: 'Points', create: create, attract: attract });
})(window);

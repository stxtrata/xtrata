/*
 * Xtrata Arcade cartridge #10 — TILE TAP
 * Four lanes of falling tiles. Tap the lowest tile before it leaves the
 * screen; every tile plays the next note of the tune. Tap the wrong lane or
 * let one slip past and the song ends. It speeds up as you go.
 * Contract game-id: xa_tile_tap (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-tile-tap');
  var U = XA.util;

  var W = 400, H = 600, LANES = 4, LW = W / LANES, TH = 138, PERFECT_ZONE = 170;
  var ACCENT = '#3ff0ff', HOT = '#ff3fa4';
  var LANE_KEYS = [['left', 'k1'], ['down', 'k2'], ['up', 'k3'], ['right', 'k4']];
  var LANE_LABELS = ['←', '↓', '↑', '→'];

  // An original looping tune: i–VI–III–VII in A minor as rolling arpeggios.
  var CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
  var SHAPE = [0, 1, 2, 3, 2, 1, 0, 2];
  function noteAt(i) {
    var chord = CHORDS[Math.floor(i / 8) % CHORDS.length];
    var k = SHAPE[i % 8];
    var midi = k === 3 ? chord[0] + 12 : chord[k];
    if (Math.floor(i / 32) % 2 === 1 && i % 2 === 1) midi += 12; // second pass climbs
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function create(api) {
    var rng = api.rng;
    var tiles = [];          // { lane, y, hit, fade }
    var nextIndex = 0;       // index into tiles of the lowest untapped tile
    var count = 0, perfectStreak = 0;
    var speed = 0, started = false;
    var over = false, overT = 0, badLane = -1, flash = 0;
    var t = 0;
    var lastLane = -1;

    function laneFor() {
      var l;
      do { l = Math.floor(rng() * LANES); } while (l === lastLane && rng() < 0.6);
      lastLane = l;
      return l;
    }
    // Fill the screen upwards; the first tile sits on the start line.
    function topY() { return tiles.length ? tiles[tiles.length - 1].y : H - TH - 20 + TH; }
    function fill() {
      while (topY() > -TH * 2) tiles.push({ lane: laneFor(), y: topY() - TH, hit: false, fade: 0 });
    }
    fill();

    function end(lane) {
      over = true;
      badLane = lane;
      api.shake(9);
      api.audio.tone(110, 0.5, { type: 'sawtooth', vol: 0.28, slide: 0.5 });
      api.audio.tone(116, 0.5, { type: 'sawtooth', vol: 0.2, slide: 0.5 });
    }
    function tap(lane) {
      if (over) return;
      var next = tiles[nextIndex];
      // Only tiles already on screen can be tapped; early taps are ignored.
      if (!next || next.y + TH < 24) return;
      if (next.lane !== lane) { end(lane); return; }
      if (!started) { started = true; speed = 360; }
      next.hit = true;
      nextIndex++;
      count++;
      var bottom = next.y + TH;
      var perfect = bottom > H - PERFECT_ZONE && bottom <= H + 4;
      var pts = 10;
      if (perfect) { perfectStreak++; pts += 5; } else perfectStreak = 0;
      api.addScore(pts);
      var f = noteAt(count - 1);
      api.audio.tone(f, 0.32, { type: 'triangle', vol: 0.22 });
      api.audio.tone(f * 2, 0.12, { type: 'sine', vol: 0.06 });
      var cx = lane * LW + LW / 2, cy = next.y + TH / 2;
      api.fx.burst(cx, cy, perfect ? HOT : ACCENT, perfect ? 16 : 8, 150, 0.4);
      if (perfect && perfectStreak > 2 && perfectStreak % 5 === 0) api.fx.text(W / 2, 90, 'PERFECT x' + perfectStreak, HOT, 14);
      if (count % 25 === 0) {
        api.fx.text(W / 2, 130, count + ' TILES', ACCENT, 16);
      }
    }

    return {
      // Read-only test hook.
      debug: function () { var n = tiles[nextIndex]; return { nextLane: n ? n.lane : -1, count: count }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        if (flash > 0) flash -= dt;
        if (over) {
          inp.takeSwipes();
          overT += dt;
          if (overT > 1.2) api.gameOver();
          return;
        }
        // lane input: keys, or a press on the playfield
        for (var l = 0; l < LANES; l++) {
          if (inp.hit(LANE_KEYS[l][0]) || inp.hit(LANE_KEYS[l][1])) tap(l);
        }
        if (inp.hit('hold')) {
          var p = api.pointer();
          if (p.x >= 0 && p.x <= W) tap(U.clamp(Math.floor(p.x / LW), 0, LANES - 1));
        }
        inp.takeSwipes();
        if (over) return;

        if (started) {
          speed = Math.min(1150, 360 + count * 4.2);
          var dy = speed * dt;
          tiles.forEach(function (tl) { tl.y += dy; if (tl.hit) tl.fade = Math.min(1, tl.fade + dt * 4); });
          var next = tiles[nextIndex];
          if (next && next.y > H) {
            // Scroll back so the missed tile is visible, then end.
            var back = next.y - (H - TH);
            tiles.forEach(function (tl) { tl.y -= back; });
            end(next.lane);
            flash = 1;
            return;
          }
          // drop tiles far below, keep indices aligned
          while (tiles.length && tiles[0].y > H + TH && tiles[0].hit) { tiles.shift(); nextIndex--; }
          fill();
        }
        api.setStatus('TILES ' + count + '  ·  SPEED x' + (Math.max(speed, 360) / 360).toFixed(1) + (perfectStreak > 2 ? '  ·  PERFECT x' + perfectStreak : ''));
      },

      render: function (ctx) {
        ctx.fillStyle = '#060715';
        ctx.fillRect(0, 0, W, H);
        // perfect zone glow
        var g = ctx.createLinearGradient(0, H - PERFECT_ZONE, 0, H);
        g.addColorStop(0, 'rgba(255,63,164,0)');
        g.addColorStop(1, 'rgba(255,63,164,0.12)');
        ctx.fillStyle = g;
        ctx.fillRect(0, H - PERFECT_ZONE, W, PERFECT_ZONE);
        for (var l = 1; l < LANES; l++) {
          ctx.fillStyle = 'rgba(63,240,255,0.12)';
          ctx.fillRect(l * LW - 0.5, 0, 1, H);
        }
        if (over && badLane >= 0) {
          ctx.fillStyle = 'rgba(255,77,109,' + (0.25 + Math.sin(t * 20) * 0.15) + ')';
          ctx.fillRect(badLane * LW, 0, LW, H);
        }
        tiles.forEach(function (tl, i) {
          if (tl.y > H + 4 || tl.y + TH < -4) return;
          var x = tl.lane * LW;
          ctx.save();
          if (tl.hit) {
            ctx.globalAlpha = 0.25 * (1 - tl.fade) + 0.08;
            ctx.fillStyle = ACCENT;
            ctx.fillRect(x + 3, tl.y + 3, LW - 6, TH - 6);
          } else {
            var isNext = i === nextIndex;
            var tg = ctx.createLinearGradient(0, tl.y, 0, tl.y + TH);
            tg.addColorStop(0, '#12163a');
            tg.addColorStop(1, isNext ? '#1d4a78' : '#161c46');
            ctx.fillStyle = tg;
            ctx.shadowColor = isNext ? ACCENT : '#6a7bff';
            ctx.shadowBlur = isNext ? 18 : 8;
            U.roundRect(ctx, x + 3, tl.y + 3, LW - 6, TH - 6, 8); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = isNext ? ACCENT : 'rgba(106,123,255,0.6)';
            ctx.lineWidth = 2;
            U.roundRect(ctx, x + 3, tl.y + 3, LW - 6, TH - 6, 8); ctx.stroke();
            ctx.fillStyle = isNext ? ACCENT : 'rgba(106,123,255,0.8)';
            ctx.fillRect(x + 14, tl.y + TH - 14, LW - 28, 4);
            if (!started && i === 0) U.glowText(ctx, 'START', x + LW / 2, tl.y + TH / 2, 13, ACCENT);
          }
          ctx.restore();
        });
        // lane keys
        ctx.save();
        ctx.font = '800 14px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(200,230,255,0.35)';
        for (l = 0; l < LANES; l++) ctx.fillText(LANE_LABELS[l] + ' ' + (l + 1), l * LW + LW / 2, H - 10);
        ctx.restore();
        if (flash > 0 && Math.floor(t * 10) % 2) {
          ctx.fillStyle = 'rgba(255,77,109,0.2)';
          ctx.fillRect(0, 0, W, H);
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#060715';
    ctx.fillRect(0, 0, w, h);
    var lw = w / 4, th = h / 3.2;
    for (var l = 1; l < 4; l++) { ctx.fillStyle = 'rgba(63,240,255,0.12)'; ctx.fillRect(l * lw, 0, 1, h); }
    var off = (t * h * 0.5) % th;
    var lanes = [2, 0, 3, 1, 2, 3, 0, 1];
    var base = Math.floor(t * 0.5 * h / th);
    for (var i = -1; i < 5; i++) {
      var lane = lanes[((base - i) % 8 + 8) % 8];
      var y = h - (i + 1) * th + off;
      var isNext = i === 0;
      ctx.save();
      ctx.fillStyle = isNext ? '#1d4a78' : '#161c46';
      ctx.shadowColor = isNext ? ACCENT : '#6a7bff'; ctx.shadowBlur = 10;
      ctx.fillRect(lane * lw + 2, y + 2, lw - 4, th - 4);
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = 0.5 + Math.sin(t * 8) * 0.3;
    ctx.fillStyle = HOT;
    ctx.fillRect(0, h - 4, w, 4);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_tile_tap',
    order: 10,
    title: 'Tile Tap',
    tagline: 'Every tile is a note. Don’t miss.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP THE LOWEST TILE IN ITS LANE',
    controls: '← ↓ ↑ → or 1 2 3 4 for the four lanes · click a lane',
    create: create,
    attract: attract
  });
})(window);

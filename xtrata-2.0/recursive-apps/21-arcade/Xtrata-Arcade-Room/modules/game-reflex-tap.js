/*
 * Xtrata Arcade cartridge #19 — REFLEX TAP
 * Blocks pop out of a 3x3 grid. Hit the cyan ones fast (quicker hits score
 * more), leave the red ones alone. Miss a cyan block or hit a red one and
 * you lose a heart. It gets faster, and busier, as you go.
 * Contract game-id: xa_reflex_tap (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-reflex-tap');
  var U = XA.util;

  var W = 400, H = 520, N = 3, CELL = 116, GAP = 12;
  var GX = (W - (N * CELL + (N - 1) * GAP)) / 2, GY = 110;
  var ACCENT = '#3ff0ff', GOOD = '#3ff0ff', BAD = '#ff4d6d', GOLD = '#ffd23f';
  var M = function () { return XA.music; };
  // Taps walk this pentatonic phrase, each one landing on the next 16th.
  var PHRASE = [0, 2, 4, 3, 2, 4, 5, 7, 4, 5, 7, 6, 5, 4, 2, 1];

  // Metronome groove in D major pentatonic; tempo climbs with the level.
  function song() {
    return {
      bpm: 116, key: 62, scale: 'pentatonic', chords: [0, 4, 3, 1], seed: 19,
      tracks: [
        { name: 'click', inst: 'hat', layer: 0, gain: 0.34, pattern: 'X...x...x...x...' },
        { name: 'tock', inst: 'marimba', layer: 0, gain: 0.2, octave: 2, pattern: '0 . . . . . . . . . . . . . . .' },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.55, pattern: 'x.......x.......' },
        { name: 'bass', inst: 'bass', layer: 0.3, gain: 0.4, chord: true, octave: -2, params: { cutoff: 800 },
          pattern: '0 . . 0 . . 0 . . . 0 . 3 . . .' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.4, pattern: '....x.......x...' },
        { name: 'shaker', inst: 'shaker', layer: 0.6, gain: 0.3, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'pad', inst: 'pad', layer: 0.75, gain: 0.26, chord: true, octave: -1,
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 3, steps: 16 }] : null; } },
        { name: 'kick2', inst: 'kick', layer: 0.9, gain: 0.4, pattern: '......x.......x.' }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var holes = [];
    for (var i = 0; i < N * N; i++) holes.push({ kind: null, t: 0, life: 0, hitT: 0, hitKind: null });
    var hits = 0, streak = 0, hearts = 3;
    var spawnT = 0.9, elapsed = 0;
    var over = false, overT = 0, t = 0;
    var phraseAt = 0, lastI = -1, lastBpm = 116;
    if (M()) M().play(song(), { fade: 1, intensity: 0 });
    function syncMusic() {
      var m = M();
      if (!m) return;
      var v = Math.round(U.clamp(streak / 24 + (level() - 1) * 0.05, 0, 1) * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
      var bpm = Math.min(150, 116 + (level() - 1) * 4);
      if (bpm !== lastBpm) { lastBpm = bpm; m.setTempo(bpm, 2); }
    }

    function level() { return 1 + Math.floor(hits / 12); }
    function lifeFor() { return Math.max(0.55, 1.35 - hits * 0.012); }
    function spawn() {
      var free = holes.map(function (h, i) { return h.kind ? -1 : i; }).filter(function (i) { return i >= 0; });
      if (!free.length) return;
      var idx = free[Math.floor(rng() * free.length)];
      var roll = rng();
      var kind = roll < Math.min(0.32, 0.08 + hits * 0.004) ? 'bad' : roll > 0.95 ? 'gold' : 'good';
      holes[idx].kind = kind;
      holes[idx].t = 0;
      holes[idx].life = kind === 'bad' ? lifeFor() * 1.3 : lifeFor() * (kind === 'gold' ? 0.7 : 1);
    }
    function hurt(i, why) {
      hearts--;
      streak = 0;
      api.shake(7);
      var m = M();
      if (m) {
        m.note('bass', -5, { octave: -2, dur: 0.12, gain: 0.7, params: { cutoff: 260, q: 2 } });
        m.duck(0.45, 0.6);
        phraseAt = 0;
        syncMusic();
      } else api.audio.tone(150, 0.25, { type: 'sawtooth', vol: 0.22, slide: 0.6 });
      var c = centre(i);
      api.fx.text(c.x, c.y - 40, why, BAD, 12);
      if (hearts <= 0) over = true;
    }
    function centre(i) {
      var r = Math.floor(i / N), c = i % N;
      return { x: GX + c * (CELL + GAP) + CELL / 2, y: GY + r * (CELL + GAP) + CELL / 2 };
    }
    function whack(i) {
      var h = holes[i];
      var c = centre(i);
      if (!h.kind) {
        api.audio.tone(120, 0.04, { type: 'square', vol: 0.05 });
        return;
      }
      if (h.kind === 'bad') {
        h.hitKind = 'bad'; h.hitT = 0.3; h.kind = null;
        api.fx.burst(c.x, c.y, BAD, 20, 180, 0.6);
        hurt(i, 'NOT THAT ONE');
        return;
      }
      var speedBonus = Math.round(20 * Math.max(0, 1 - h.t / h.life));
      streak++;
      hits++;
      var mult = 1 + Math.min(4, Math.floor(streak / 8));
      var pts = (10 + speedBonus) * mult * (h.kind === 'gold' ? 3 : 1);
      api.addScore(pts);
      api.fx.burst(c.x, c.y, h.kind === 'gold' ? GOLD : GOOD, 16, 160, 0.5);
      api.fx.text(c.x, c.y - 30, '+' + pts, h.kind === 'gold' ? GOLD : '#fff', 12);
      var m = M();
      if (m) {
        var deg = PHRASE[phraseAt++ % PHRASE.length];
        m.note('pluck', deg, { quantize: '16', octave: 1, gain: 0.75 });
        if (h.kind === 'gold') m.note('bell', deg, { quantize: '16', octave: 2, gain: 0.45 });
        syncMusic();
      } else api.audio.tone(520 + Math.min(streak, 20) * 25, 0.06, { type: 'square', vol: 0.14 });
      h.hitKind = h.kind; h.hitT = 0.25; h.kind = null;
    }

    return {
      // Read-only test hook: what is on screen right now.
      debug: function () { return { good: holes.map(function (h, i) { return h.kind === 'good' || h.kind === 'gold' ? i : -1; }).filter(function (i) { return i >= 0; }), hearts: hearts, hits: hits }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        holes.forEach(function (h) { if (h.hitT > 0) h.hitT -= dt; });
        if (over) { overT += dt; if (overT > 1.1) api.gameOver(); return; }
        elapsed += dt;
        // input: click/tap a cell, or keys 1-9 (top-left to bottom-right)
        if (inp.hit('hold')) {
          var p = api.pointer();
          var c = Math.floor((p.x - GX) / (CELL + GAP)), r = Math.floor((p.y - GY) / (CELL + GAP));
          if (c >= 0 && c < N && r >= 0 && r < N) whack(r * N + c);
        }
        for (var k = 1; k <= 9; k++) if (inp.hit('k' + k)) whack(k - 1);
        if (over) return;

        holes.forEach(function (h, i) {
          if (!h.kind) return;
          h.t += dt;
          if (h.t >= h.life) {
            var was = h.kind;
            h.kind = null;
            if (was === 'good') hurt(i, 'TOO SLOW');
          }
        });
        spawnT -= dt;
        if (spawnT <= 0) {
          spawn();
          if (hits > 20 && rng() < Math.min(0.5, hits / 120)) spawn();
          spawnT = Math.max(0.32, 0.95 - hits * 0.011) * (0.7 + rng() * 0.6);
        }
        api.setStatus('HEARTS ' + hearts + '  ·  HITS ' + hits + '  ·  STREAK ' + streak + (streak >= 8 ? '  ·  x' + (1 + Math.min(4, Math.floor(streak / 8))) : ''));
      },

      render: function (ctx) {
        ctx.fillStyle = '#060718';
        ctx.fillRect(0, 0, W, H);
        // hearts
        for (var l = 0; l < 3; l++) {
          ctx.save();
          ctx.fillStyle = l < hearts ? BAD : 'rgba(255,77,109,0.18)';
          if (l < hearts) { ctx.shadowColor = BAD; ctx.shadowBlur = 10; }
          var hx = W / 2 - 40 + l * 40, hy = 50;
          ctx.beginPath();
          ctx.moveTo(hx, hy + 8);
          ctx.bezierCurveTo(hx - 16, hy - 4, hx - 8, hy - 16, hx, hy - 6);
          ctx.bezierCurveTo(hx + 8, hy - 16, hx + 16, hy - 4, hx, hy + 8);
          ctx.fill();
          ctx.restore();
        }
        for (var i = 0; i < N * N; i++) {
          var r = Math.floor(i / N), c = i % N;
          var x = GX + c * (CELL + GAP), y = GY + r * (CELL + GAP);
          var h = holes[i];
          ctx.fillStyle = '#10132e';
          U.roundRect(ctx, x, y, CELL, CELL, 16); ctx.fill();
          ctx.strokeStyle = 'rgba(63,240,255,0.18)'; ctx.lineWidth = 2;
          U.roundRect(ctx, x, y, CELL, CELL, 16); ctx.stroke();
          ctx.fillStyle = 'rgba(200,220,255,0.25)';
          ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(String(i + 1), x + 10, y + 18);
          if (h.kind) {
            var pop = Math.min(1, h.t / 0.08);
            var remain = 1 - h.t / h.life;
            var col = h.kind === 'bad' ? BAD : h.kind === 'gold' ? GOLD : GOOD;
            var s = (CELL - 30) * (0.6 + 0.4 * pop);
            ctx.save();
            ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20;
            U.roundRect(ctx, x + (CELL - s) / 2, y + (CELL - s) / 2, s, s, 12); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            if (h.kind === 'bad') {
              ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,0.45)';
              ctx.beginPath(); ctx.moveTo(x + 40, y + 40); ctx.lineTo(x + CELL - 40, y + CELL - 40);
              ctx.moveTo(x + CELL - 40, y + 40); ctx.lineTo(x + 40, y + CELL - 40); ctx.stroke();
            } else {
              ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, 14, 0, 7); ctx.fill();
            }
            // countdown ring
            ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remain); ctx.stroke();
            ctx.restore();
          } else if (h.hitT > 0) {
            ctx.save();
            ctx.globalAlpha = h.hitT * 3;
            ctx.strokeStyle = h.hitKind === 'bad' ? BAD : '#ffffff'; ctx.lineWidth = 4;
            U.roundRect(ctx, x + 6, y + 6, CELL - 12, CELL - 12, 12); ctx.stroke();
            ctx.restore();
          }
        }
        ctx.fillStyle = 'rgba(200,220,255,0.45)';
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HIT CYAN · SKIP RED · GOLD = x3', W / 2, H - 22);
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#060718';
    ctx.fillRect(0, 0, w, h);
    var size = Math.min(w, h) * 0.26, gap = size * 0.12;
    var ox = (w - size * 3 - gap * 2) / 2, oy = (h - size * 3 - gap * 2) / 2;
    var lit = Math.floor(t * 2.5) % 9, bad = (lit * 5 + 3) % 9;
    for (var i = 0; i < 9; i++) {
      var x = ox + (i % 3) * (size + gap), y = oy + Math.floor(i / 3) * (size + gap);
      ctx.fillStyle = '#10132e';
      ctx.fillRect(x, y, size, size);
      if (i === lit || i === bad) {
        ctx.save();
        var col = i === lit ? GOOD : BAD;
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
        ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7);
        ctx.restore();
      }
    }
  }

  XA.registerGame({
    id: 'xa_reflex_tap',
    order: 19,
    title: 'Reflex Tap',
    tagline: 'Hit the cyan. Never the red.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP THE CYAN BLOCKS · LEAVE THE RED ONES',
    controls: 'Click / tap · or keys 1–9 (top-left to bottom-right)',
    create: create,
    attract: attract
  });
})(window);

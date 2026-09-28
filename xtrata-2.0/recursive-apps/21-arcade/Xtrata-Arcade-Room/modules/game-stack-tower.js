/*
 * Xtrata Arcade cartridge #8 — STACK TOWER
 * A slab slides back and forth over the tower; tap to drop it. Whatever
 * overhangs is sliced off. Land it perfectly to keep its full width, and
 * chain perfects to grow the slab back. Miss completely and it's over.
 * Contract game-id: xa_stack_tower (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-stack-tower');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 400, H = 600;
  var SLAB_H = 26, DEPTH = 14, BASE_W = 200, BASE_Y = 470, PERFECT = 5;
  var ACCENT = '#ffd23f';

  function hue(n) { return (200 + n * 9) % 360; }
  function col(n, l) { return 'hsl(' + hue(n) + ',85%,' + l + '%)'; }

  // Soundtrack: warm major groove; the tower itself plays the melody, one note per floor.
  var TUNE = [
    [0, 2, 4, 2, 4, 5, 4, 6, 7, 4],
    [4, 5, 7, 5, 7, 9, 8, 7, 6, 7],
    [7, 6, 4, 6, 7, 9, 11, 9, 10, 11]
  ];
  var KEYS = [55, 60, 57, 62, 59, 64];
  function song() {
    return {
      bpm: 100, key: 55, scale: 'major', chords: [0, 2, 3, 4], seed: 9,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.32, chord: true, octave: -1, params: { cutoff: 1300 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'bass', inst: 'bass', layer: 0.1, gain: 0.4, chord: true, octave: -2, params: { cutoff: 600, q: 2 },
          pattern: '0 - . . . . 0 . . . 4 - . . 2 .' },
        { name: 'shaker', inst: 'shaker', layer: 0.2, gain: 0.3, pattern: '..x...x...x...x.' },
        { name: 'kick', inst: 'kick', layer: 0.3, gain: 0.55, pattern: 'x.....x...x.....' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.38, pattern: '....x.......x...' },
        { name: 'counter', inst: 'marimba', layer: 0.6, gain: 0.3, chord: true, rate: 2,
          fn: function (i) { return [4, 2, 0, 2, 4, 5, 4, 2][(i.step / 2) % 8]; } },
        { name: 'sparkle', inst: 'bell', layer: 0.8, gain: 0.22, chord: true, octave: 2, rate: 4,
          fn: function (i) { return i.rng() < 0.5 ? { deg: [0, 2, 4][Math.floor(i.rng() * 3)], vel: 0.5 } : null; } }
      ]
    };
  }

  function slab(ctx, x, y, w, n, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    // top face (slanted back)
    ctx.fillStyle = col(n, 72);
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + DEPTH, y - DEPTH); ctx.lineTo(x + w + DEPTH, y - DEPTH); ctx.lineTo(x + w, y);
    ctx.closePath(); ctx.fill();
    // side face
    ctx.fillStyle = col(n, 38);
    ctx.beginPath();
    ctx.moveTo(x + w, y); ctx.lineTo(x + w + DEPTH, y - DEPTH); ctx.lineTo(x + w + DEPTH, y - DEPTH + SLAB_H); ctx.lineTo(x + w, y + SLAB_H);
    ctx.closePath(); ctx.fill();
    // front face
    ctx.shadowColor = col(n, 60); ctx.shadowBlur = 10;
    ctx.fillStyle = col(n, 55);
    ctx.fillRect(x, y, w, SLAB_H);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x, y, w, 3);
    ctx.restore();
  }

  function create(api) {
    var tower = [{ x: (W - BASE_W) / 2 - DEPTH / 2, w: BASE_W }];   // index 0 = base
    var cur = null;
    var debris = [];
    var cam = 0, camTarget = 0;
    var perfectRun = 0;
    var over = false, overT = 0, fallT = 0;
    var t = 0;
    var mInt = -1;

    function yOf(i) { return BASE_Y - i * SLAB_H; }
    function spawn() {
      var n = tower.length;
      var top = tower[n - 1];
      var speed = Math.min(430, 150 + n * 7);
      var fromLeft = n % 2 === 0;
      // Enter from just off the edge so the slab is on screen almost at once.
      cur = { x: fromLeft ? -top.w * 0.35 : W - top.w * 0.65, w: top.w, dir: fromLeft ? 1 : -1, speed: speed };
    }
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    spawn();

    // floor n (1-based) plays the next note of the tune
    function tuneDeg(n) { return TUNE[Math.floor((n - 1) / 10) % TUNE.length][(n - 1) % 10]; }
    function syncMusic(m) {
      var iv = Math.round(U.clamp((tower.length - 1) / 40 + Math.min(perfectRun, 6) * 0.07, 0, 1) * 20) / 20;
      if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
      var n = tower.length - 1;
      if (n > 0 && n % 10 === 0) {
        m.setKey(KEYS[(n / 10) % KEYS.length]);
        m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4, steps: 6 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
        m.note('riser', 0, { dur: 0.6, gain: 0.3 });
      }
    }

    function drop() {
      var n = tower.length;
      var top = tower[n - 1];
      var y = yOf(n);
      var left = Math.max(cur.x, top.x), right = Math.min(cur.x + cur.w, top.x + top.w);
      var overlap = right - left;
      if (overlap <= 0) {
        // clean miss: the whole slab falls
        debris.push({ x: cur.x, y: y, w: cur.w, n: n, vy: 0, vx: cur.dir * 60, rot: 0, vr: cur.dir * 1.2 });
        cur = null;
        over = true;
        api.shake(10);
        api.audio.tone(220, 0.5, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
        return;
      }
      var off = cur.x - top.x;
      if (Math.abs(off) <= PERFECT) {
        perfectRun++;
        var w = top.w;
        if (perfectRun >= 3) w = Math.min(BASE_W, w + 8);
        var x = top.x - (w - top.w) / 2;
        tower.push({ x: x, w: w });
        var bonus = 10 * Math.min(perfectRun, 10);
        api.addScore(10 + bonus);
        api.fx.text(x + w / 2, y - 26 + cam, perfectRun > 1 ? 'PERFECT x' + perfectRun : 'PERFECT', '#ffffff', 13);
        api.fx.burst(x + w / 2, y + cam, col(n, 70), 20, 180, 0.5);
        var mp = M();
        if (mp) mp.note('bell', tuneDeg(n), { quantize: '16', octave: 2, gain: 0.7 + Math.min(perfectRun, 5) * 0.04 });
        else api.audio.tone(440 * Math.pow(1.0595, Math.min(perfectRun, 24) * 2), 0.14, { type: 'triangle', vol: 0.2 });
      } else {
        perfectRun = 0;
        tower.push({ x: left, w: overlap });
        // sliced-off piece
        var cutX = off > 0 ? right : cur.x;
        var cutW = cur.w - overlap;
        debris.push({ x: cutX, y: y, w: cutW, n: n, vy: 0, vx: (off > 0 ? 1 : -1) * 40, rot: 0, vr: (off > 0 ? 1 : -1) * 1.5 });
        api.addScore(10);
        var mt = M();
        if (mt) {
          mt.note('pluck', tuneDeg(n), { quantize: '16', octave: 1, gain: 0.45, params: { cutoff: 2600 } });
          mt.note('marimba', tuneDeg(n) + 1, { quantize: '16', octave: 0, gain: 0.18 });   // soft rub = "off" note
        } else api.audio.tone(300 + Math.min(n, 40) * 6, 0.07, { type: 'square', vol: 0.12 });
        api.shake(2);
      }
      if (M()) syncMusic(M());
      camTarget = Math.max(0, (tower.length - 9) * SLAB_H);
      spawn();
    }

    return {
      // Read-only test hook: lets automated tests time a drop.
      debug: function () { return { cur: cur && { x: cur.x, w: cur.w }, top: tower[tower.length - 1], floors: tower.length - 1, perfectRun: perfectRun }; },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        cam += (camTarget - cam) * Math.min(1, dt * 6);
        debris.forEach(function (d) { d.vy += 1300 * dt; d.y += d.vy * dt; d.x += d.vx * dt; d.rot += d.vr * dt; });
        debris = debris.filter(function (d) { return d.y + cam < H + 200; });
        if (over) {
          overT += dt;
          // Pan down the whole tower before ending.
          camTarget = 0;
          fallT += dt;
          if (overT > 1.8) api.gameOver();
          return;
        }
        cur.x += cur.dir * cur.speed * dt;
        if (cur.dir > 0 && cur.x + cur.w > W + 20) cur.dir = -1;
        if (cur.dir < 0 && cur.x < -20) cur.dir = 1;
        if (inp.hit('a') || inp.hit('hold') || inp.hit('up') || inp.hit('down')) drop();
        api.setStatus('FLOOR ' + (tower.length - 1) + (perfectRun > 1 ? '  ·  PERFECT x' + perfectRun : ''));
      },

      render: function (ctx) {
        var floors = tower.length;
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'hsl(' + hue(floors) + ',45%,10%)');
        g.addColorStop(1, 'hsl(' + ((hue(floors) + 40) % 360) + ',55%,4%)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // height markers every 10 floors
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
        for (var f = 10; f < floors + 20; f += 10) {
          var my = yOf(f) + cam;
          if (my < -10 || my > H) continue;
          ctx.beginPath(); ctx.moveTo(0, my + 0.5); ctx.lineTo(W, my + 0.5); ctx.stroke();
          ctx.fillText(f + 'F', 8, my - 4);
        }
        ctx.restore();

        ctx.save();
        ctx.translate(0, cam);
        // ground plinth
        ctx.fillStyle = '#0a0b18';
        ctx.fillRect(0, BASE_Y + SLAB_H, W, 400);
        for (var i = 0; i < tower.length; i++) {
          var y = yOf(i);
          if (y + cam > H + 40 || y + cam < -60) continue;
          slab(ctx, tower[i].x, y, tower[i].w, i);
        }
        if (cur) slab(ctx, cur.x, yOf(tower.length), cur.w, tower.length);
        debris.forEach(function (d) {
          ctx.save();
          ctx.translate(d.x + d.w / 2, d.y + SLAB_H / 2);
          ctx.rotate(d.rot);
          slab(ctx, -d.w / 2, -SLAB_H / 2, d.w, d.n, 0.9);
          ctx.restore();
        });
        ctx.restore();

        U.glowText(ctx, String(floors - 1), W / 2, 56, 34, ACCENT);
        if (floors === 1 && !over) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP / SPACE TO DROP', W / 2, 110, 13, '#fff3c4');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0f1630'); g.addColorStop(1, '#05030c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var s = h / 300;
    ctx.save();
    ctx.scale(s, s);
    var cw = w / s;
    var widths = [150, 140, 140, 128, 128, 120, 104, 104, 96];
    var baseY = 262;
    for (var i = 0; i < widths.length; i++) {
      var off = [0, 6, 6, 12, 12, 8, 20, 20, 16][i];
      slab(ctx, cw / 2 - 75 + off, baseY - i * SLAB_H, widths[i], i);
    }
    var n = widths.length;
    var x = cw / 2 - 60 + Math.sin(t * 2.2) * cw * 0.35;
    slab(ctx, x, baseY - n * SLAB_H, 96, n);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_stack_tower',
    order: 8,
    title: 'Stack Tower',
    tagline: 'One tap. Perfect drops. Go higher.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP ANYWHERE ON THE TOWER TO DROP',
    controls: 'Space / click / tap to drop',
    create: create,
    attract: attract
  });
})(window);

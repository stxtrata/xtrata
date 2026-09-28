/*
 * Xtrata Arcade cartridge #14 — INVADER WAVE
 * A marching formation of pixel invaders speeds up as it thins out. Hide
 * behind the crumbling bunkers, pick off the mystery ship for a bonus,
 * and clear the wave before it lands. Each new wave starts lower.
 * Contract game-id: xa_invader_wave (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-invader-wave');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 480, H = 560, PY = 522, GROUND = 540;
  var COLS = 11, ROWS = 5, CW = 34, CH = 30, PIX = 3;
  var ACCENT = '#39ff88';
  var ROW_COLORS = ['#ff3fa4', '#b04dff', '#b04dff', '#3ff0ff', '#3ff0ff'];
  var ROW_PTS = [30, 20, 20, 10, 10];

  // Original sprites: 8x8, mirrored, generated from fixed seeds so every
  // player sees the same invaders. Two frames per type for the march.
  var SPRITES = [101, 202, 303].map(function (seed) {
    var r = U.rng(seed);
    var base = [];
    for (var y = 0; y < 8; y++) {
      var row = [];
      for (var x = 0; x < 4; x++) {
        var p = y < 2 ? 0.35 : y < 6 ? 0.7 : 0.45;
        row.push(r() < p ? 1 : 0);
      }
      row[3] = y > 0 && y < 6 ? 1 : row[3];     // solid spine
      base.push(row.concat(row.slice().reverse()));
    }
    base[3][2] = base[3][5] = 0;                 // eyes
    var alt = base.map(function (row, y) {
      if (y < 6) return row.slice();
      return row.map(function (v, x) { return base[y][(x + (y === 6 ? 1 : 7)) % 8]; });
    });
    return [base, alt];
  });
  var TYPE_OF_ROW = [0, 1, 1, 2, 2];

  function drawSprite(ctx, spr, x, y, color, px) {
    ctx.fillStyle = color;
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) if (spr[r][c]) ctx.fillRect(x + c * px, y + r * px, px, px);
  }

  // Music: F minor synth march. The bass walks four steps down every bar and
  // its tempo follows the formation - fewer invaders, faster march. The
  // mystery ship forces a wobbling siren; each cleared wave lifts the key.
  var KEY = 53;
  function song() {
    return {
      bpm: 96, key: KEY, scale: 'minor', chords: [0, 0, 5, 4], seed: 14,
      tracks: [
        { name: 'march', inst: 'bass', layer: 0, gain: 0.45, chord: true, octave: -2, rate: 4, params: { cutoff: 650, q: 4 },
          pattern: '0 -1 -2 -3' },
        { name: 'pad', inst: 'pad', layer: 0.12, gain: 0.32, chord: true, octave: 0, params: { cutoff: 1300, attack: 0.3 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.55, pattern: 'x.......x.......' },
        { name: 'snare', inst: 'snare', layer: 0.38, gain: 0.35, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.5, gain: 0.25, pattern: '..x...x...x...x.' },
        { name: 'synth', inst: 'arp', layer: 0.62, gain: 0.26, chord: true, octave: 1, params: { cutoff: 1800 },
          fn: function (i) { return i.stepInBar % 2 ? null : [0, 4, 2, 4, 0, 4, 2, 7][(i.stepInBar >> 1)]; } },
        { name: 'lead', inst: 'lead', layer: 0.8, gain: 0.26, octave: 1, params: { wave: 'triangle', cutoff: 2200 },
          pattern: '7 - - - 6 - 4 - 3 - - - 4 - - - 2 - - - 3 - 2 - 0 - - - -1 - - -' },
        { name: 'siren', inst: 'lead', layer: 2, gain: 0.24, octave: 1, params: { wave: 'sine', cutoff: 3000 },
          fn: function (i) { return i.stepInBar % 4 === 0 ? { deg: (i.stepInBar >> 2) % 2 ? 4 : 5, steps: 4 } : null; } }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var aliens = [], formation = { x: 0, y: 0, dir: 1, step: 0, frame: 0 };
    var shots = [], bombs = [], bunkers = [], ufo = null, ufoT = 20;
    var player = { x: W / 2, alive: true, respawn: 0, inv: 0 };
    var wave = 0, lives = 3, score = 0, nextLife = 5000;
    var fireCd = 0, bombT = 1.5, clearT = 0, over = false, overT = 0;
    var t = 0;

    function buildBunkers() {
      bunkers = [];
      for (var b = 0; b < 4; b++) {
        var bx = 60 + b * 108, cells = {};
        for (var r = 0; r < 8; r++) for (var c = 0; c < 11; c++) {
          if (r === 0 && (c < 2 || c > 8)) continue;
          if (r >= 5 && c >= 3 && c <= 7) continue; // arch
          cells[c + ',' + r] = true;
        }
        bunkers.push({ x: bx, y: 440, cells: cells });
      }
    }
    function startWave() {
      wave++;
      aliens = [];
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) aliens.push({ r: r, c: c, alive: true });
      formation.x = 36;
      formation.y = 70 + Math.min(4, wave - 1) * 14;
      formation.dir = 1; formation.step = 0;
      shots = []; bombs = [];
      if (wave === 1 || wave % 3 === 1) buildBunkers();
      api.fx.text(W / 2, 250, 'WAVE ' + wave, ACCENT, 18);
    }
    startWave();
    var lastBpm = 96, lastInt = -1, sirenOn = false, shotN = 0;
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    function syncMusic(liveN) {
      var m = M();
      if (!m) return;
      var frac = liveN / (COLS * ROWS);
      var bpm = Math.min(188, Math.round((96 + (1 - frac) * 72 + (wave - 1) * 4) / 4) * 4);
      if (bpm !== lastBpm) { lastBpm = bpm; m.setTempo(bpm, 0.5); }
      var it = Math.round(U.clamp(0.1 + (1 - frac) * 0.8 + (wave - 1) * 0.1, 0, 1) * 20) / 20;
      if (it !== lastInt) { lastInt = it; m.setIntensity(it); }
      var s = !!ufo && !over;
      if (s !== sirenOn) { sirenOn = s; m.setTrack('siren', s ? true : null); }
    }

    function alienPos(a) { return { x: formation.x + a.c * CW, y: formation.y + a.r * CH }; }
    function alive() { return aliens.filter(function (a) { return a.alive; }); }

    function addPts(n, x, y) {
      score += n; api.addScore(n);
      if (x != null) api.fx.text(x, y, '+' + n, '#fff', 10);
      if (score >= nextLife) { nextLife += 5000; lives = Math.min(5, lives + 1); api.fx.text(W / 2, 300, 'EXTRA CANNON', ACCENT, 13); }
    }
    function hitBunker(x, y, radius) {
      for (var i = 0; i < bunkers.length; i++) {
        var b = bunkers[i];
        if (x < b.x - 4 || x > b.x + 48 || y < b.y - 4 || y > b.y + 36) continue;
        var c = Math.floor((x - b.x) / 4), r = Math.floor((y - b.y) / 4);
        if (b.cells[c + ',' + r]) {
          for (var dc = -radius; dc <= radius; dc++) for (var dr = -radius; dr <= radius; dr++) {
            if (Math.abs(dc) + Math.abs(dr) <= radius && rng() < 0.85) delete b.cells[(c + dc) + ',' + (r + dr)];
          }
          return true;
        }
      }
      return false;
    }
    function killPlayer() {
      player.alive = false;
      player.respawn = 1.6;
      lives--;
      api.fx.burst(player.x, PY, ACCENT, 34, 200, 0.9);
      api.shake(10);
      api.audio.noise(0.6, { vol: 0.3, cutoff: 900 });
      if (lives <= 0) over = true;
      else if (M()) M().duck(0.5, 1.2);
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (over) { overT += dt; if (overT > 1.3) api.gameOver(); return; }
        var i;

        // player
        if (player.alive) {
          var mv = (inp.held('right') ? 1 : 0) - (inp.held('left') ? 1 : 0);
          player.x = U.clamp(player.x + mv * 260 * dt, 20, W - 20);
          if (player.inv > 0) player.inv -= dt;
          fireCd -= dt;
          if ((inp.held('a') || inp.held('up') || inp.held('hold')) && fireCd <= 0 && shots.length < 2) {
            shots.push({ x: player.x, y: PY - 12 });
            fireCd = 0.32;
            api.audio.tone(900, 0.06, { type: 'square', vol: 0.08, slide: 0.4 });
            if (M()) M().note('arp', [0, 2, 4][shotN++ % 3], { chord: true, octave: 2, gain: 0.12 });
          }
        } else {
          player.respawn -= dt;
          if (player.respawn <= 0) { player.alive = true; player.inv = 1.5; player.x = W / 2; bombs = []; }
        }

        if (clearT > 0) { clearT -= dt; if (clearT <= 0) startWave(); return; }

        // formation march: interval shrinks as invaders fall
        var live = alive();
        var interval = 0.03 + (live.length / (COLS * ROWS)) * 0.55 / (1 + (wave - 1) * 0.12);
        formation.step += dt;
        if (formation.step >= interval) {
          formation.step = 0;
          formation.frame ^= 1;
          var minX = 1e9, maxX = -1e9;
          live.forEach(function (a) { var p = alienPos(a); minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x + 24); });
          if ((formation.dir > 0 && maxX + 6 > W - 8) || (formation.dir < 0 && minX - 6 < 8)) {
            formation.y += 14; formation.dir *= -1;
          } else formation.x += 6 * formation.dir;
          // with music on, the march bass carries the footsteps
          if (!M()) api.audio.tone([98, 92, 87, 82][Math.floor(t * 10) % 4], 0.05, { type: 'square', vol: 0.06 });
        }
        // invaders erase bunkers they touch, and win if they land
        live.forEach(function (a) {
          var p = alienPos(a);
          if (p.y + 24 > 436) for (var k = 0; k < 24; k += 4) hitBunker(p.x + k, p.y + 22, 0);
          if (p.y + 24 >= PY - 6) { over = true; api.shake(14); api.audio.tone(80, 1, { type: 'sawtooth', vol: 0.3 }); }
        });

        // player shots
        for (i = shots.length - 1; i >= 0; i--) {
          var s = shots[i];
          s.y -= 540 * dt;
          if (s.y < 30) { shots.splice(i, 1); continue; }
          if (hitBunker(s.x, s.y, 1)) { shots.splice(i, 1); continue; }
          var hit = false;
          for (var k = 0; k < aliens.length; k++) {
            var a = aliens[k];
            if (!a.alive) continue;
            var p = alienPos(a);
            if (s.x > p.x && s.x < p.x + 24 && s.y > p.y && s.y < p.y + 24) {
              a.alive = false; hit = true;
              var pts = Math.round(ROW_PTS[a.r] * (1 + (wave - 1) * 0.25));
              addPts(pts);
              api.fx.burst(p.x + 12, p.y + 12, ROW_COLORS[a.r], 14, 140, 0.5);
              api.audio.noise(0.12, { vol: 0.18, cutoff: 2400 });
              break;
            }
          }
          if (!hit && ufo && Math.abs(s.x - ufo.x) < 22 && Math.abs(s.y - 54) < 10) {
            var up = [50, 100, 150, 300][Math.floor(rng() * 4)];
            addPts(up, ufo.x, 40);
            api.fx.burst(ufo.x, 54, '#ff4d6d', 30, 180, 0.8);
            api.audio.arp([1047, 784, 1047], 0.05, { type: 'square', vol: 0.16 });
            ufo = null; ufoT = 18 + rng() * 10; hit = true;
          }
          if (!hit) for (var bi = bombs.length - 1; bi >= 0; bi--) {
            if (Math.abs(bombs[bi].x - s.x) < 5 && Math.abs(bombs[bi].y - s.y) < 10) { bombs.splice(bi, 1); hit = true; addPts(5); break; }
          }
          if (hit) shots.splice(i, 1);
        }

        // invader bombs from the lowest invader in a random column
        bombT -= dt;
        if (bombT <= 0 && live.length && player.alive) {
          bombT = Math.max(0.3, 1.25 - wave * 0.08) * (0.5 + rng());
          var cols = {};
          live.forEach(function (a) { if (!cols[a.c] || cols[a.c].r < a.r) cols[a.c] = a; });
          var keys = Object.keys(cols);
          // favour the column above the player
          var pick = cols[keys[Math.floor(rng() * keys.length)]];
          if (rng() < 0.4) keys.forEach(function (kk) { var pp = alienPos(cols[kk]); if (Math.abs(pp.x + 12 - player.x) < 20) pick = cols[kk]; });
          var bp = alienPos(pick);
          bombs.push({ x: bp.x + 12, y: bp.y + 24, v: 190 + wave * 14 });
        }
        for (i = bombs.length - 1; i >= 0; i--) {
          var b = bombs[i];
          b.y += b.v * dt;
          if (b.y > GROUND) { bombs.splice(i, 1); continue; }
          if (hitBunker(b.x, b.y, 1)) { bombs.splice(i, 1); continue; }
          if (player.alive && player.inv <= 0 && Math.abs(b.x - player.x) < 16 && b.y > PY - 10 && b.y < PY + 10) {
            bombs.splice(i, 1); killPlayer(); break;
          }
        }

        // mystery ship
        if (!ufo) {
          ufoT -= dt;
          if (ufoT <= 0) { var fl = rng() < 0.5; ufo = { x: fl ? -30 : W + 30, v: fl ? 110 : -110 }; }
        } else {
          ufo.x += ufo.v * dt;
          if (!M() && Math.floor(t * 12) % 2) api.audio.tone(ufo.x % 40 < 20 ? 700 : 620, 0.03, { type: 'sine', vol: 0.03 });
          if (ufo.x < -50 || ufo.x > W + 50) { ufo = null; ufoT = 18 + rng() * 10; }
        }

        if (!alive().length && clearT <= 0) {
          var bonus = 100 * wave;
          addPts(bonus);
          api.fx.text(W / 2, 280, 'WAVE CLEAR +' + bonus, '#ffd23f', 15);
          if (M()) {
            M().stinger([{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 7, at: 6, steps: 6 }], { inst: 'lead', quantize: 'beat', octave: 1, gain: 0.4, params: { wave: 'triangle', cutoff: 2600 } });
            M().setKey(KEY + (wave % 6) * 2 - (wave % 6 > 3 ? 12 : 0));
          } else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
          clearT = 1.8;
        }
        syncMusic(alive().length);
        api.setStatus('WAVE ' + wave + '  ·  CANNONS ' + lives + '  ·  INVADERS ' + alive().length);
      },

      render: function (ctx) {
        ctx.fillStyle = '#03030b';
        ctx.fillRect(0, 0, W, H);
        // ground line + lives
        ctx.fillStyle = ACCENT;
        ctx.fillRect(0, GROUND, W, 2);
        for (var l = 0; l < lives; l++) drawCannon(ctx, 24 + l * 30, GROUND + 12, 0.6);
        // bunkers
        ctx.fillStyle = ACCENT;
        bunkers.forEach(function (b) {
          Object.keys(b.cells).forEach(function (k) {
            var cr = k.split(',');
            ctx.fillRect(b.x + cr[0] * 4, b.y + cr[1] * 4, 4, 4);
          });
        });
        // invaders
        ctx.save();
        aliens.forEach(function (a) {
          if (!a.alive) return;
          var p = alienPos(a);
          ctx.shadowColor = ROW_COLORS[a.r]; ctx.shadowBlur = 8;
          drawSprite(ctx, SPRITES[TYPE_OF_ROW[a.r]][formation.frame], p.x, p.y, ROW_COLORS[a.r], PIX);
        });
        ctx.restore();
        // mystery ship
        if (ufo) {
          ctx.save();
          ctx.fillStyle = '#ff4d6d'; ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.ellipse(ufo.x, 56, 22, 7, 0, 0, 7); ctx.fill();
          ctx.fillRect(ufo.x - 8, 44, 16, 8);
          ctx.fillStyle = '#fff';
          for (var d = -14; d <= 14; d += 7) ctx.fillRect(ufo.x + d - 1, 55, 3, 3);
          ctx.restore();
        }
        // shots
        ctx.fillStyle = '#ffffff';
        shots.forEach(function (s) { ctx.fillRect(s.x - 1.5, s.y - 8, 3, 10); });
        ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 2;
        bombs.forEach(function (b) {
          ctx.beginPath();
          var z = Math.floor(t * 20) % 2 ? 3 : -3;
          ctx.moveTo(b.x, b.y - 10); ctx.lineTo(b.x + z, b.y - 6); ctx.lineTo(b.x - z, b.y - 2); ctx.lineTo(b.x, b.y + 2);
          ctx.stroke();
        });
        if (player.alive && !(player.inv > 0 && Math.floor(t * 12) % 2)) drawCannon(ctx, player.x, PY, 1);
      }
    };

    function drawCannon(ctx, x, y, k) {
      ctx.save();
      ctx.translate(x, y); ctx.scale(k, k);
      ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
      ctx.fillRect(-16, -2, 32, 10);
      ctx.fillRect(-11, -7, 22, 6);
      ctx.fillRect(-3, -14, 6, 8);
      ctx.restore();
    }
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#03030b';
    ctx.fillRect(0, 0, w, h);
    var px = Math.max(1.5, h / 110);
    var cw = px * 11, chh = px * 10;
    var cols = Math.min(8, Math.floor((w * 0.8) / cw));
    var ox = (w - cols * cw) / 2 + Math.sin(t * 1.5) * w * 0.06;
    var frame = Math.floor(t * 3) % 2;
    for (var r = 0; r < 4; r++) for (var c = 0; c < cols; c++) {
      drawSprite(ctx, SPRITES[TYPE_OF_ROW[r]][frame], ox + c * cw, h * 0.12 + r * chh, ROW_COLORS[r], px);
    }
    ctx.fillStyle = ACCENT;
    var cx = w / 2 + Math.sin(t * 2) * w * 0.3;
    ctx.fillRect(cx - px * 5, h * 0.86, px * 10, px * 3);
    ctx.fillRect(cx - px, h * 0.86 - px * 3, px * 2, px * 3);
    ctx.fillStyle = '#fff';
    var sy = h * 0.86 - ((t * h * 0.8) % (h * 0.7));
    ctx.fillRect(cx - 1, sy, 2, px * 3);
  }

  XA.registerGame({
    id: 'xa_invader_wave',
    order: 14,
    title: 'Invader Wave',
    tagline: 'Hold the line. Clear the sky.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'shooter',
    controls: '←→ move · Space fire (hold to keep firing)',
    create: create,
    attract: attract
  });
})(window);

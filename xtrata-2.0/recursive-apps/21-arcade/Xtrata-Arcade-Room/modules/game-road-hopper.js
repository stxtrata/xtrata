/*
 * Xtrata Arcade cartridge #9 — ROAD HOPPER
 * Hop forward across roads, rivers and rail lines. Cars squash, water
 * drowns (ride the logs), trains don't stop. Dawdle and the screen
 * catches you. One point of progress per new row, plus coins.
 * Contract game-id: xa_road_hopper (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-road-hopper');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 420, H = 600, C = 42, COLS = 10, HOP = 0.11;
  var ACCENT = '#39ff88';
  var CAR_COLORS = ['#ff4d6d', '#3ff0ff', '#ffd23f', '#b04dff', '#ff9f1c', '#4d7bff'];

  // Soundtrack: bouncy mixolydian marimba tune; roads bring the drums, rivers wash them out.
  function song() {
    return {
      bpm: 112, key: 58, scale: 'mixolydian', chords: [0, 6, 0, 3], seed: 31, swing: 0.12,
      tracks: [
        { name: 'marimba', inst: 'marimba', layer: 0, gain: 0.34, chord: true,
          pattern: '0 . 2 4 . 2 7 . 4 . 2 . 4 5 4 2' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.4, chord: true, octave: -2, params: { cutoff: 800, q: 3 },
          pattern: '0 . . 0 . . 4 . 0 . . 0 . . 4 .' },
        { name: 'shaker', inst: 'shaker', layer: 0.12, gain: 0.32, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'kick', inst: 'kick', layer: 0.3, gain: 0.5, pattern: 'x.....x.x.......' },
        { name: 'hat', inst: 'hat', layer: 0.4, gain: 0.26, pattern: '..x...x...x...x.' },
        { name: 'clap', inst: 'clap', layer: 0.5, gain: 0.34, pattern: '....x.......x...' },
        { name: 'bells', inst: 'bell', layer: 0.72, gain: 0.22, chord: true, octave: 1, pattern: '. . . . 4 . . . . . 7 . . . 6 .' },
        { name: 'pad', inst: 'pad', layer: 2, gain: 0.4, chord: true, octave: -1, params: { cutoff: 1500, attack: 0.6 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }, { deg: 6, steps: 16 }] : null; } }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var rows = [];
    var plan = [];            // queued row types
    var player = { row: 0, x: C * 4.5, face: 'up', hop: 0, fromRow: 0, fromX: C * 4.5 };
    var queued = null;
    var camRow = 0, started = false;
    var maxRow = 0, coins = 0;
    var dead = false, deadT = 0, deathKind = '';
    var t = 0;
    var hopDeg = 0, mZone = 'grass', mInt = -1, mBpm = 112;

    function speedScale(r) { return 1 + Math.min(1.4, r / 120); }

    function planRows() {
      var r = rows.length;
      var roll = rng();
      var n, type;
      if (roll < 0.3) { type = 'grass'; n = 1 + Math.floor(rng() * 2); }
      else if (roll < 0.64) { type = 'road'; n = 1 + Math.floor(rng() * (r > 40 ? 4 : 3)); }
      else if (roll < 0.9) { type = 'river'; n = 1 + Math.floor(rng() * (r > 40 ? 3 : 2)); }
      else { type = 'rail'; n = 1; }
      for (var k = 0; k < n; k++) plan.push(type);
      if (type !== 'grass') plan.push('grass');
    }
    function makeRow(r) {
      var type = r < 4 ? 'grass' : (plan.length ? plan.shift() : (planRows(), plan.shift()));
      var row = { type: type, dir: rng() < 0.5 ? -1 : 1, items: [], trees: {}, coin: -1 };
      var track = W + 4 * C;
      var x, w;
      if (type === 'grass') {
        if (r > 0) {
          var nt = r < 4 ? 0 : Math.floor(rng() * 4);
          for (var k = 0; k < nt; k++) row.trees[Math.floor(rng() * COLS)] = true;
          if (r >= 4 && rng() < 0.18) { var cc = Math.floor(rng() * COLS); if (!row.trees[cc]) row.coin = cc; }
        }
        // start rows: trees on the edges only
        if (r < 4) { row.trees[0] = r > 0; row.trees[COLS - 1] = r > 0; }
      } else if (type === 'road') {
        row.speed = (60 + rng() * 90) * speedScale(r);
        x = -2 * C;
        var truck = rng() < 0.3;
        while (x < W + 2 * C) {
          w = truck ? C * 2.3 : C * 1.2;
          row.items.push({ x: x, w: w, c: CAR_COLORS[Math.floor(rng() * CAR_COLORS.length)] });
          x += w + C * (1.8 + rng() * 3.2);
        }
        row.track = track;
      } else if (type === 'river') {
        row.speed = (38 + rng() * 70) * Math.min(1.8, speedScale(r));
        x = -2 * C;
        while (x < W + 2 * C) {
          w = C * (2 + Math.floor(rng() * 3));
          row.items.push({ x: x, w: w });
          x += w + C * (1.2 + rng() * 1.8);
        }
        row.track = track;
      } else if (type === 'rail') {
        row.timer = 2 + rng() * 4;
        row.train = null;
      }
      return row;
    }
    function row(r) {
      while (rows.length <= r + 20) rows.push(makeRow(rows.length));
      return rows[r];
    }
    row(0);

    function screenY(r) { return H - (r - camRow + 1) * C - 10; }
    function colOf(x) { return Math.floor(x / C); }
    function logUnder(rw, x) {
      for (var i = 0; i < rw.items.length; i++) {
        var it = rw.items[i];
        if (x > it.x + 4 && x < it.x + it.w - 4) return it;
      }
      return null;
    }
    function die(kind) {
      if (dead) return;
      dead = true; deathKind = kind;
      var y = screenY(player.row) + C / 2;
      if (kind === 'splash') {
        api.fx.burst(player.x, y, '#7fd6ff', 30, 160, 0.8);
        api.audio.noise(0.4, { vol: 0.25, cutoff: 1200 });
      } else {
        api.fx.burst(player.x, y, '#ffffff', 28, 200, 0.8);
        api.fx.burst(player.x, y, ACCENT, 16, 160, 0.6);
        api.audio.tone(140, 0.3, { type: 'square', slide: 0.4, vol: 0.28 });
      }
      api.shake(kind === 'train' ? 16 : 9);
    }

    function tryMove(d) {
      if (dead) return;
      if (player.hop > 0) { queued = d; return; }
      var nr = player.row, nx = player.x;
      if (d === 'up' || d === 'tap') nr++;
      else if (d === 'down') nr--;
      else if (d === 'left') nx -= C;
      else if (d === 'right') nx += C;
      player.face = d === 'tap' ? 'up' : d;
      if (nr < 0 || nr < Math.floor(camRow)) return;
      if (nx < C / 2 - 1 || nx > W - C / 2 + 1) return;
      var target = row(nr);
      var landX = target.type === 'river' ? nx : (colOf(nx) + 0.5) * C;
      if (target.type === 'grass' && target.trees[colOf(landX)]) { api.audio.tone(120, 0.04, { type: 'square', vol: 0.06 }); return; }
      started = true;
      player.fromRow = player.row; player.fromX = player.x;
      player.row = nr; player.x = landX;
      player.hop = HOP;
      var m = M();
      if (m) {
        if (nr > player.fromRow) hopDeg = hopDeg >= 9 ? 3 : hopDeg + 1;       // forward climbs the scale
        else if (nr < player.fromRow) hopDeg = hopDeg <= -3 ? 3 : hopDeg - 1; // back steps down
        m.note('marimba', hopDeg, { quantize: '16', octave: 1, gain: nr === player.fromRow ? 0.35 : 0.6 });
      } else api.audio.tone(d === 'down' ? 360 : 480, 0.045, { type: 'triangle', vol: 0.1 });
    }

    function land() {
      var rw = row(player.row);
      var m = M();
      if (player.row > maxRow) {
        maxRow = player.row;
        if (maxRow % 50 === 0) {
          api.fx.text(W / 2, 120, maxRow + ' ROWS', ACCENT, 16);
          if (m) {
            m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4 }, { deg: 9, at: 6, steps: 6 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.6 });
            m.transpose(maxRow % 100 ? 5 : -5);
          } else api.audio.arp([523, 659, 784], 0.06, { type: 'triangle', vol: 0.16 });
        } else if (maxRow % 10 === 0 && m) {
          m.stinger([{ deg: 4 }, { deg: 7, at: 2, steps: 2 }], { inst: 'marimba', quantize: '8', octave: 1, gain: 0.55 });
        }
        if (m) {
          var iv = Math.round(U.clamp(0.1 + maxRow / 160, 0, 1) * 20) / 20;
          if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
          var bpm = 112 + Math.min(8, Math.floor(maxRow / 25)) * 2;
          if (bpm !== mBpm) { mBpm = bpm; m.setTempo(bpm, 2); }
        }
      }
      var zone = rw.type === 'river' ? 'river' : rw.type === 'grass' ? 'grass' : 'road';
      if (m && zone !== mZone) {
        var wasRiver = mZone === 'river';
        mZone = zone;
        var drums = zone === 'river' ? false : zone === 'road' ? true : null;
        m.setTrack('kick', drums); m.setTrack('hat', drums);
        m.setTrack('clap', zone === 'river' ? false : null);
        m.setTrack('pad', zone === 'river' ? true : null);
        if (zone === 'river') m.setFilter(1500, 0.8);
        else if (wasRiver) m.setFilter(18000, 0.5);
      }
      if (rw.type === 'river' && !logUnder(rw, player.x)) die('splash');
      if (rw.type === 'grass' && rw.coin === colOf(player.x)) {
        rw.coin = -1;
        coins++;
        api.fx.burst(player.x, screenY(player.row) + C / 2, '#ffd23f', 14, 120);
        api.fx.text(player.x, screenY(player.row), '+25', '#ffd23f', 11);
        if (m) m.stinger([{ deg: 7 }, { deg: 9, at: 1 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.5 });
        else api.audio.arp([988, 1319], 0.04, { type: 'square', vol: 0.12 });
      }
    }

    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var moves = [];
        ['up', 'down', 'left', 'right'].forEach(function (d) { if (inp.hit(d)) moves.push(d); });
        if (inp.hit('a')) moves.push('up');
        inp.takeSwipes().forEach(function (s) { moves.push(s); });
        if (!dead) moves.forEach(tryMove);

        // world motion
        var lo = Math.max(0, Math.floor(camRow) - 1), hi = Math.floor(camRow) + 16;
        for (var r = lo; r <= hi; r++) {
          var rw = row(r);
          if (rw.type === 'road' || rw.type === 'river') {
            rw.items.forEach(function (it) {
              it.x += rw.dir * rw.speed * dt;
              if (rw.dir > 0 && it.x > W + 2 * C) it.x -= rw.track + it.w;
              if (rw.dir < 0 && it.x + it.w < -2 * C) it.x += rw.track + it.w;
            });
          } else if (rw.type === 'rail') {
            if (!rw.train) {
              rw.timer -= dt;
              if (rw.timer <= 0) rw.train = { x: rw.dir > 0 ? -C * 9 : W + C, w: C * 8, speed: 820 * Math.min(1.4, speedScale(r)) };
              else if (rw.timer < 1 && Math.floor(t * 8) % 2 === 0 && Math.abs(r - player.row) < 8 && rw.timer > 0.95)
                api.audio.tone(990, 0.08, { type: 'square', vol: 0.06 });
            } else {
              rw.train.x += rw.dir * rw.train.speed * dt;
              if (rw.train.x > W + C * 9 || rw.train.x < -C * 18) { rw.train = null; rw.timer = 3 + rng() * 5; }
            }
          }
        }

        if (dead) { deadT += dt; if (deadT > 1.1) api.gameOver(); return; }

        if (player.hop > 0) {
          player.hop -= dt;
          if (player.hop <= 0) { player.hop = 0; land(); if (queued && !dead) { var q = queued; queued = null; tryMove(q); } }
        }
        var cur = row(player.row);
        // carried by logs (only once fully landed)
        if (player.hop === 0 && cur.type === 'river') {
          var log = logUnder(cur, player.x);
          if (!log) die('splash');
          else {
            player.x += cur.dir * cur.speed * dt;
            if (player.x < 4 || player.x > W - 4) die('splash');
          }
        }
        // cars and trains (hitbox narrower than the cell)
        if (!dead && player.hop < HOP * 0.5) {
          if (cur.type === 'road') {
            cur.items.forEach(function (it) { if (player.x + 12 > it.x && player.x - 12 < it.x + it.w) die('squash'); });
          } else if (cur.type === 'rail' && cur.train) {
            if (player.x + 12 > cur.train.x && player.x - 12 < cur.train.x + cur.train.w) die('train');
          }
        }

        // camera: follow the player, and creep forward once the run starts
        var target = Math.max(0, player.row - 4);
        if (target > camRow) camRow += (target - camRow) * Math.min(1, dt * 5);
        if (started) camRow += Math.min(0.9, 0.16 + maxRow * 0.004) * dt;
        if (!dead && player.row < camRow - 0.6) { die('squash'); api.fx.text(W / 2, H - 80, 'TOO SLOW!', '#ff4d6d', 16); }

        api.setScore(maxRow * 10 + coins * 25);
        api.setStatus('ROW ' + maxRow + (coins ? '  ·  COINS ' + coins : ''));
      },

      render: function (ctx) {
        ctx.fillStyle = '#0b1a12';
        ctx.fillRect(0, 0, W, H);
        var first = Math.max(0, Math.floor(camRow) - 1), last = Math.floor(camRow) + 15;
        for (var r = first; r <= last; r++) {
          var rw = row(r), y = screenY(r);
          if (y > H || y < -C) continue;
          if (rw.type === 'grass') {
            ctx.fillStyle = r % 2 ? '#123d25' : '#15472b';
            ctx.fillRect(0, y, W, C);
          } else if (rw.type === 'road') {
            ctx.fillStyle = '#16161f';
            ctx.fillRect(0, y, W, C);
            var prev = row(Math.max(0, r - 1));
            if (prev.type === 'road' && r > 0) {
              ctx.fillStyle = 'rgba(255,255,255,0.25)';
              for (var dx = 6; dx < W; dx += 40) ctx.fillRect(dx, y + C - 1, 20, 2);
            }
          } else if (rw.type === 'river') {
            ctx.fillStyle = '#0d3050';
            ctx.fillRect(0, y, W, C);
            ctx.strokeStyle = 'rgba(127,214,255,0.18)';
            ctx.beginPath();
            for (var wx = -40; wx < W + 40; wx += 40) {
              var ox = (wx + t * 20 * rw.dir) % 40;
              ctx.moveTo(wx + ox, y + C * 0.5); ctx.quadraticCurveTo(wx + ox + 10, y + C * 0.4, wx + ox + 20, y + C * 0.5);
            }
            ctx.stroke();
          } else {
            ctx.fillStyle = '#231d1a';
            ctx.fillRect(0, y, W, C);
            ctx.fillStyle = '#3b312b';
            for (var sx = 4; sx < W; sx += 14) ctx.fillRect(sx, y + 6, 6, C - 12);
            ctx.fillStyle = '#8b8f9c';
            ctx.fillRect(0, y + 12, W, 3); ctx.fillRect(0, y + C - 15, W, 3);
            var warn = !rw.train && rw.timer < 1.2;
            ctx.save();
            ctx.fillStyle = warn && Math.floor(t * 8) % 2 ? '#ff4d6d' : '#401820';
            if (warn) { ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 14; }
            ctx.beginPath(); ctx.arc(W - 14, y + 10, 5, 0, 7); ctx.fill();
            ctx.restore();
          }
        }
        for (r = last; r >= first; r--) {
          rw = row(r); y = screenY(r);
          if (y > H + C || y < -C * 2) continue;
          if (rw.type === 'grass') {
            Object.keys(rw.trees).forEach(function (k) {
              if (!rw.trees[k]) return;
              var tx = +k * C;
              ctx.fillStyle = '#0a2416'; ctx.fillRect(tx + 6, y + 8, C - 12, C - 10);
              ctx.fillStyle = '#1f7a45'; ctx.fillRect(tx + 6, y - 6, C - 12, C - 10);
              ctx.fillStyle = '#2ea862'; ctx.fillRect(tx + 6, y - 6, C - 12, 5);
            });
            if (rw.coin >= 0) {
              ctx.save();
              ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 12; ctx.fillStyle = '#ffd23f';
              var cw = 8 * Math.abs(Math.cos(t * 3));
              ctx.beginPath(); ctx.ellipse(rw.coin * C + C / 2, y + C / 2, Math.max(1.5, cw), 8, 0, 0, 7); ctx.fill();
              ctx.restore();
            }
          } else if (rw.type === 'road') {
            rw.items.forEach(function (it) {
              ctx.save();
              ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(it.x + 3, y + 10, it.w, C - 12);
              ctx.fillStyle = it.c; ctx.shadowColor = it.c; ctx.shadowBlur = 10;
              U.roundRect(ctx, it.x, y + 6, it.w, C - 14, 6); ctx.fill();
              ctx.shadowBlur = 0;
              ctx.fillStyle = 'rgba(10,12,30,0.75)';
              var wx0 = rw.dir > 0 ? it.x + it.w - 16 : it.x + 6;
              ctx.fillRect(wx0, y + 10, 10, C - 22);
              ctx.fillStyle = '#fff6c2';
              var hx = rw.dir > 0 ? it.x + it.w - 3 : it.x;
              ctx.fillRect(hx, y + 9, 3, 4); ctx.fillRect(hx, y + C - 15, 3, 4);
              ctx.restore();
            });
          } else if (rw.type === 'river') {
            rw.items.forEach(function (it) {
              ctx.fillStyle = '#6b4424'; U.roundRect(ctx, it.x, y + 7, it.w, C - 14, 8); ctx.fill();
              ctx.fillStyle = '#8a5a31'; ctx.fillRect(it.x + 6, y + 10, it.w - 12, 4);
            });
          } else if (rw.type === 'rail' && rw.train) {
            ctx.save();
            ctx.fillStyle = '#c9ced9'; ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 12;
            U.roundRect(ctx, rw.train.x, y + 3, rw.train.w, C - 6, 6); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ff4d6d'; ctx.fillRect(rw.train.x, y + C / 2 - 3, rw.train.w, 6);
            ctx.fillStyle = '#1b2240';
            for (var wn = rw.train.x + 12; wn < rw.train.x + rw.train.w - 16; wn += 26) ctx.fillRect(wn, y + 8, 14, 8);
            ctx.restore();
          }
          if (r === player.row && !dead) drawPlayer(ctx);
        }
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'HOP FORWARD TO START', W / 2, 90, 14, '#c9ffe0');
          ctx.restore();
        }
      }
    };

    function drawPlayer(ctx) {
      var k = player.hop > 0 ? 1 - player.hop / HOP : 1;
      var row0 = player.fromRow + (player.row - player.fromRow) * k;
      var x = player.fromX + (player.x - player.fromX) * k;
      var y = screenY(row0) + C / 2 - Math.sin(k * Math.PI) * (player.hop > 0 ? 10 : 0);
      if (player.hop === 0) { x = player.x; y = screenY(player.row) + C / 2; }
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-12, 6, 26, 10);
      ctx.shadowColor = ACCENT; ctx.shadowBlur = 14;
      ctx.fillStyle = '#f4fff8';
      ctx.fillRect(-13, -15, 26, 26);
      ctx.shadowBlur = 0;
      ctx.fillStyle = ACCENT; ctx.fillRect(-13, -15, 26, 5);
      ctx.fillStyle = '#ff9f1c';
      var f = player.face;
      if (f === 'up') ctx.fillRect(-3, -19, 6, 5);
      else if (f === 'down') ctx.fillRect(-3, 10, 6, 5);
      else if (f === 'left') ctx.fillRect(-17, -4, 5, 6);
      else ctx.fillRect(12, -4, 5, 6);
      ctx.fillStyle = '#05060f';
      ctx.fillRect(-7, -7, 3, 3); ctx.fillRect(4, -7, 3, 3);
      ctx.restore();
    }
  }

  function attract(ctx, w, h, t) {
    var rh = h / 7;
    var types = ['grass', 'road', 'road', 'grass', 'river', 'river', 'grass'];
    types.forEach(function (ty, i) {
      var y = h - (i + 1) * rh;
      ctx.fillStyle = ty === 'grass' ? (i % 2 ? '#123d25' : '#15472b') : ty === 'road' ? '#16161f' : '#0d3050';
      ctx.fillRect(0, y, w, rh);
      if (ty === 'road') {
        for (var c = 0; c < 3; c++) {
          var cx = ((c * w * 0.45 + t * 70 * (i % 2 ? 1 : -1.4)) % (w + 60) + w + 60) % (w + 60) - 60;
          ctx.fillStyle = CAR_COLORS[(c + i) % CAR_COLORS.length];
          U.roundRect(ctx, cx, y + rh * 0.15, rh * 1.3, rh * 0.7, 4); ctx.fill();
        }
      }
      if (ty === 'river') {
        for (var l = 0; l < 2; l++) {
          var lx = ((l * w * 0.6 + t * 40 * (i % 2 ? 1 : -1)) % (w + 100) + w + 100) % (w + 100) - 100;
          ctx.fillStyle = '#6b4424'; U.roundRect(ctx, lx, y + rh * 0.18, rh * 2.6, rh * 0.64, 5); ctx.fill();
        }
      }
    });
    var hopRow = Math.floor(t * 1.5) % 7;
    var k = (t * 1.5) % 1;
    var py = h - (hopRow + 0.5) * rh - Math.sin(Math.min(1, k * 4) * Math.PI) * rh * 0.3;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 10; ctx.fillStyle = '#f4fff8';
    ctx.fillRect(w / 2 - rh * 0.3, py - rh * 0.3, rh * 0.6, rh * 0.6);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_road_hopper',
    order: 9,
    title: 'Road Hopper',
    tagline: 'Cross the roads. Ride the logs.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD to hop · swipe or tap on mobile',
    create: create,
    attract: attract
  });
})(window);

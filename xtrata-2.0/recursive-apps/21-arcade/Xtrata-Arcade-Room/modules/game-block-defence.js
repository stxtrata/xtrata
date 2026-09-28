/*
 * Xtrata Arcade cartridge #12 — BLOCK DEFENCE
 * Missiles rain down on six block towers. Aim and fire interceptors from
 * three silos; each blast hangs in the air and takes out anything that
 * flies into it. Later waves bring faster warheads that split. Survive
 * the wave for bonus points on saved towers and unused ammo.
 * Contract game-id: xa_block_defence (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-defence');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 480, H = 560, GROUND = 520;
  var ACCENT = '#39ff88', ENEMY = '#ff4d6d', BLAST = '#ffd23f';
  var SILO_X = [40, 240, 440];
  var CITY_X = [96, 144, 192, 288, 336, 384];
  var AMMO = 10;

  // Music: tense D harmonic minor at 124. Threats on screen drive the layers,
  // warheads near the towers force an alarm, detonations boom in key and each
  // extra kill from one blast (and its chain) climbs the scale.
  function song() {
    return {
      bpm: 124, key: 50, scale: 'harmonic', chords: [0, 5, 3, 4], seed: 12,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.35, chord: true, octave: -1, params: { cutoff: 1200 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'pulse', inst: 'bass', layer: 0.1, gain: 0.4, chord: true, octave: -2, params: { cutoff: 600 },
          pattern: '0 0 . 0 0 . 0 . 0 0 . 0 0 . ^0 .' },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.6, pattern: 'x...x...x...x...' },
        { name: 'snare', inst: 'snare', layer: 0.4, gain: 0.4, pattern: '....x.......x..x' },
        { name: 'hat', inst: 'hat', layer: 0.55, gain: 0.25, pattern: 'xxxxxxxxxxxxxxxx' },
        { name: 'arp', inst: 'arp', layer: 0.65, gain: 0.3, chord: true, octave: 1,
          fn: function (i) { return [0, 2, 4, 7, 4, 2][i.step % 6]; } },
        { name: 'strings', inst: 'lead', layer: 0.8, gain: 0.26, octave: 1, params: { wave: 'sawtooth', cutoff: 1800 },
          pattern: '4 - - - 3 - - - 2 - - - 1 - - - 0 - - - -1 - - - 0 - - - - - - -' },
        { name: 'alarm', inst: 'lead', layer: 2, gain: 0.26, octave: 0, params: { wave: 'sawtooth', cutoff: 1600 },
          pattern: '7 - - - 6 - - - 7 - - - 6 - - -' }
      ]
    };
  }

  function create(api) {
    var rng = api.rng;
    var cities = CITY_X.map(function (x, i) { return { x: x, alive: true, h: 3 + (i * 7) % 3 }; });
    var silos = SILO_X.map(function (x) { return { x: x, ammo: AMMO, alive: true }; });
    var interceptors = [], blasts = [], enemies = [];
    var wave = 0, toSpawn = 0, spawnT = 0, between = 0;
    var aim = { x: W / 2, y: 260 };
    var lastMoved = api.pointer().moved;
    var score = 0, nextCity = 10000;
    var over = false, overT = 0;
    var t = 0;

    function startWave() {
      wave++;
      toSpawn = 8 + wave * 3;
      spawnT = 0.6;
      silos.forEach(function (s) { s.ammo = AMMO; s.alive = true; });
      api.fx.text(W / 2, 200, 'WAVE ' + wave, ACCENT, 18);
      api.audio.arp([392, 494, 587], 0.08, { type: 'triangle', vol: 0.16 });
    }
    function speed() { return 34 + wave * 7; }
    function targets() {
      var list = [];
      cities.forEach(function (c) { if (c.alive) list.push(c.x); });
      silos.forEach(function (s) { if (s.alive) list.push(s.x); });
      return list.length ? list : [W / 2];
    }
    function spawnEnemy(x, y, tx) {
      var sp = speed() * (0.85 + rng() * 0.3);
      var dx = tx - x, dy = GROUND - y, d = Math.hypot(dx, dy);
      enemies.push({ sx: x, sy: y, x: x, y: y, vx: dx / d * sp, vy: dy / d * sp,
        split: wave >= 3 && rng() < Math.min(0.35, 0.08 * (wave - 2)) ? 180 + rng() * 150 : 0 });
    }
    function fire(siloIdx, tx, ty) {
      var s = silos[siloIdx];
      if (!s || !s.alive || s.ammo <= 0) return false;
      if (ty > GROUND - 30) ty = GROUND - 30;
      s.ammo--;
      var sx = s.x, sy = GROUND - 14;
      var d = Math.hypot(tx - sx, ty - sy);
      var sp = siloIdx === 1 ? 620 : 480;
      interceptors.push({ sx: sx, sy: sy, x: sx, y: sy, tx: tx, ty: ty, vx: (tx - sx) / d * sp, vy: (ty - sy) / d * sp, left: d / sp });
      api.audio.tone(700, 0.08, { type: 'square', vol: 0.1, slide: 1.8 });
      return true;
    }
    function fireNearest(tx, ty) {
      var order = [0, 1, 2].sort(function (a, b) { return Math.abs(SILO_X[a] - tx) - Math.abs(SILO_X[b] - tx); });
      for (var i = 0; i < order.length; i++) if (fire(order[i], tx, ty)) return;
      api.audio.tone(120, 0.05, { type: 'square', vol: 0.06 });
    }
    function addPts(n, x, y) {
      score += n;
      api.addScore(n);
      if (x != null) api.fx.text(x, y, '+' + n, '#fff', 10);
      if (score >= nextCity) {
        nextCity += 10000;
        var dead = cities.filter(function (c) { return !c.alive; });
        if (dead.length) { dead[0].alive = true; api.fx.text(dead[0].x, GROUND - 40, 'REBUILT', ACCENT, 11); }
      }
    }
    function hitGround(e) {
      var hitSomething = false;
      cities.forEach(function (c) {
        if (c.alive && Math.abs(c.x - e.x) < 20) {
          c.alive = false; hitSomething = true;
          api.fx.burst(c.x, GROUND - 14, ACCENT, 30, 180, 0.9);
        }
      });
      silos.forEach(function (s) {
        if (s.alive && Math.abs(s.x - e.x) < 20) { s.alive = false; s.ammo = 0; hitSomething = true; api.fx.burst(s.x, GROUND - 10, '#9aa3c7', 24, 160, 0.8); }
      });
      blasts.push({ x: e.x, y: GROUND - 4, r: 0, max: 26, t: 0, life: 0.7, enemy: true });
      api.shake(hitSomething ? 9 : 4);
      if (hitSomething && M()) { M().duck(0.55, 0.9); M().note('sub', 0, { octave: -2, dur: 0.8, gain: 0.8 }); }
      api.audio.noise(0.35, { vol: hitSomething ? 0.35 : 0.2, cutoff: 700 });
    }

    startWave();
    var lastInt = -1, alarmOn = false, calm = 0;
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    function syncMusic(dt) {
      var m = M();
      if (!m) return;
      if (calm > 0) calm -= dt;
      var it = calm > 0 ? 0 : Math.round(U.clamp(enemies.length / 9 + (wave - 1) * 0.05, 0, 1) * 10) / 10;
      if (it !== lastInt) { lastInt = it; m.setIntensity(it); }
      var close = !over && enemies.some(function (e) { return e.y > GROUND - 150; });
      if (close !== alarmOn) {
        alarmOn = close;
        m.setTrack('alarm', close ? true : null);
        if (close) m.note('riser', 0, { dur: 0.9, gain: 0.35 });
      }
    }

    return {
      // Read-only test hook: the lowest incoming warhead.
      debug: function () {
        var low = null;
        enemies.forEach(function (e) { if (!low || e.y > low.y) low = e; });
        return { enemy: low && { x: low.x, y: low.y, vx: low.vx, vy: low.vy }, wave: wave };
      },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        // aim: pointer when it moves, arrows otherwise
        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; aim.x = p.x; aim.y = p.y; }
        if (inp.held('left')) aim.x -= 360 * dt;
        if (inp.held('right')) aim.x += 360 * dt;
        if (inp.held('up')) aim.y -= 360 * dt;
        if (inp.held('down')) aim.y += 360 * dt;
        aim.x = U.clamp(aim.x, 6, W - 6); aim.y = U.clamp(aim.y, 36, GROUND - 30);

        if (!over) {
          if (inp.hit('hold')) { aim.x = U.clamp(p.x, 6, W - 6); aim.y = U.clamp(p.y, 36, GROUND - 30); fireNearest(aim.x, aim.y); }
          if (inp.hit('a')) fireNearest(aim.x, aim.y);
          if (inp.hit('b')) fire(0, aim.x, aim.y);
          if (inp.hit('c')) fire(1, aim.x, aim.y);
          if (inp.hit('d')) fire(2, aim.x, aim.y);
        }

        // spawn
        if (!over && toSpawn > 0) {
          spawnT -= dt;
          if (spawnT <= 0) {
            var burst = 1 + (rng() < 0.3 ? 1 : 0) + (wave > 4 && rng() < 0.3 ? 1 : 0);
            for (var b = 0; b < burst && toSpawn > 0; b++, toSpawn--) {
              var tg = targets();
              spawnEnemy(20 + rng() * (W - 40), -6, tg[Math.floor(rng() * tg.length)] + (rng() - 0.5) * 10);
            }
            spawnT = Math.max(0.45, 1.8 - wave * 0.12) * (0.6 + rng() * 0.8);
          }
        }

        var i;
        // interceptors fly to their mark and burst
        for (i = interceptors.length - 1; i >= 0; i--) {
          var m = interceptors[i];
          m.left -= dt;
          if (m.left <= 0) {
            blasts.push({ x: m.tx, y: m.ty, r: 0, max: 38, t: 0, life: 1.1, ch: { n: 0 } });
            api.audio.noise(0.25, { vol: 0.18, cutoff: 2200 });
            if (M()) M().note('sub', 0, { chord: true, octave: -1, dur: 0.35, gain: 0.55 });
            interceptors.splice(i, 1);
          } else { m.x += m.vx * dt; m.y += m.vy * dt; }
        }
        // blasts grow then shrink
        for (i = blasts.length - 1; i >= 0; i--) {
          var bl = blasts[i];
          bl.t += dt;
          var k = bl.t / bl.life;
          bl.r = bl.max * Math.sin(Math.min(1, k) * Math.PI);
          if (k >= 1) blasts.splice(i, 1);
        }
        // enemies
        var chain = 0;
        for (i = enemies.length - 1; i >= 0; i--) {
          var e = enemies[i];
          e.x += e.vx * dt; e.y += e.vy * dt;
          if (e.split && e.y > e.split) {
            e.split = 0;
            var tg2 = targets();
            for (var s = 0; s < 2; s++) spawnEnemy(e.x, e.y, tg2[Math.floor(rng() * tg2.length)]);
            api.audio.tone(500, 0.06, { type: 'sawtooth', vol: 0.08 });
          }
          var killed = false, kb = null;
          for (var j = 0; j < blasts.length; j++) {
            var bj = blasts[j];
            if (!bj.enemy && Math.hypot(e.x - bj.x, e.y - bj.y) < bj.r + 2) { killed = true; kb = bj; break; }
          }
          if (killed) {
            chain++;
            enemies.splice(i, 1);
            addPts(25 * wave * chain, e.x, e.y - 12);
            blasts.push({ x: e.x, y: e.y, r: 0, max: 22, t: 0, life: 0.6, ch: kb && kb.ch });
            if (M() && kb && kb.ch) { kb.ch.n++; M().note('bell', Math.min(14, kb.ch.n - 1), { chord: true, octave: 1, gain: 0.5 }); }
            api.fx.burst(e.x, e.y, ENEMY, 10, 130, 0.5);
            continue;
          }
          if (e.y >= GROUND - 4) { enemies.splice(i, 1); hitGround(e); }
        }

        if (!over && !cities.some(function (c) { return c.alive; })) {
          over = true;
          api.audio.tone(90, 1, { type: 'sawtooth', vol: 0.3, slide: 0.5 });
          api.shake(16);
        }
        syncMusic(dt);
        if (over) { overT += dt; if (overT > 1.6) api.gameOver(); return; }

        // wave cleared
        if (toSpawn === 0 && !enemies.length && !interceptors.length) {
          between += dt;
          if (between > 0.8) {
            between = 0;
            var alive = cities.filter(function (c) { return c.alive; }).length;
            var ammo = silos.reduce(function (a, s) { return a + (s.alive ? s.ammo : 0); }, 0);
            var bonus = alive * 100 * Math.min(wave, 6) + ammo * 5 * Math.min(wave, 6);
            addPts(bonus);
            api.fx.text(W / 2, 250, 'WAVE ' + wave + ' CLEAR  +' + bonus, BLAST, 14);
            if (M()) {
              // resolve on V -> i, then strip back to the pad for a breath
              M().stinger([{ deg: 4 }, { deg: 6, at: 2 }, { deg: 7, at: 4, steps: 8 }, { deg: 9, at: 4, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.5 });
              calm = 2.5;
            }
            startWave();
          }
        }
        var ammoLeft = silos.map(function (s) { return s.alive ? s.ammo : 'X'; }).join(' / ');
        api.setStatus('WAVE ' + wave + '  ·  AMMO ' + ammoLeft + '  ·  TOWERS ' + cities.filter(function (c) { return c.alive; }).length);
      },

      render: function (ctx) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#02030c'); g.addColorStop(1, '#0a1428');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // ground
        ctx.fillStyle = '#0c1f16';
        ctx.fillRect(0, GROUND, W, H - GROUND);
        ctx.save();
        ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
        ctx.restore();
        // cities: stacks of blocks
        cities.forEach(function (c) {
          if (!c.alive) {
            ctx.fillStyle = '#2a1a1a';
            ctx.fillRect(c.x - 14, GROUND - 6, 28, 6);
            return;
          }
          for (var k = 0; k < c.h; k++) {
            ctx.save();
            ctx.fillStyle = k === c.h - 1 ? '#7dffb8' : ACCENT;
            ctx.shadowColor = ACCENT; ctx.shadowBlur = 8;
            var w = 26 - k * 4;
            ctx.fillRect(c.x - w / 2, GROUND - (k + 1) * 11, w, 10);
            ctx.restore();
          }
        });
        // silos
        silos.forEach(function (s, i) {
          ctx.save();
          ctx.fillStyle = s.alive ? '#3a4a8a' : '#2a2a3a';
          ctx.beginPath(); ctx.moveTo(s.x - 22, GROUND); ctx.lineTo(s.x - 10, GROUND - 16); ctx.lineTo(s.x + 10, GROUND - 16); ctx.lineTo(s.x + 22, GROUND); ctx.fill();
          if (s.alive) {
            ctx.fillStyle = '#cfe0ff';
            for (var a = 0; a < s.ammo; a++) ctx.fillRect(s.x - 18 + (a % 5) * 8, GROUND + 8 + Math.floor(a / 5) * 8, 5, 5);
          }
          ctx.fillStyle = 'rgba(200,210,255,0.4)';
          ctx.font = '700 9px ui-monospace, Menlo, Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(['Z', 'X', 'C'][i], s.x, GROUND - 20);
          ctx.restore();
        });
        // enemy trails
        ctx.save();
        ctx.lineWidth = 1.5;
        enemies.forEach(function (e) {
          var gr = ctx.createLinearGradient(e.sx, e.sy, e.x, e.y);
          gr.addColorStop(0, 'rgba(255,77,109,0)');
          gr.addColorStop(1, 'rgba(255,77,109,0.8)');
          ctx.strokeStyle = gr;
          ctx.beginPath(); ctx.moveTo(e.sx, e.sy); ctx.lineTo(e.x, e.y); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.shadowColor = ENEMY; ctx.shadowBlur = 10;
          ctx.fillRect(e.x - 2, e.y - 2, 4, 4);
          ctx.shadowBlur = 0;
        });
        // interceptors
        interceptors.forEach(function (m) {
          ctx.strokeStyle = 'rgba(57,255,136,0.6)';
          ctx.beginPath(); ctx.moveTo(m.sx, m.sy); ctx.lineTo(m.x, m.y); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.fillRect(m.x - 1.5, m.y - 1.5, 3, 3);
          ctx.strokeStyle = 'rgba(57,255,136,0.5)';
          ctx.beginPath(); ctx.moveTo(m.tx - 4, m.ty - 4); ctx.lineTo(m.tx + 4, m.ty + 4); ctx.moveTo(m.tx + 4, m.ty - 4); ctx.lineTo(m.tx - 4, m.ty + 4); ctx.stroke();
        });
        ctx.restore();
        // blasts
        blasts.forEach(function (b) {
          ctx.save();
          var col = b.enemy ? ENEMY : (Math.floor(t * 20) % 2 ? BLAST : '#ffffff');
          ctx.fillStyle = col; ctx.globalAlpha = 0.85;
          ctx.shadowColor = col; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.arc(b.x, b.y, Math.max(0, b.r), 0, 7); ctx.fill();
          ctx.restore();
        });
        // crosshair
        if (!over) {
          ctx.save();
          ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(aim.x, aim.y, 9, 0, 7);
          ctx.moveTo(aim.x - 15, aim.y); ctx.lineTo(aim.x - 5, aim.y);
          ctx.moveTo(aim.x + 5, aim.y); ctx.lineTo(aim.x + 15, aim.y);
          ctx.moveTo(aim.x, aim.y - 15); ctx.lineTo(aim.x, aim.y - 5);
          ctx.moveTo(aim.x, aim.y + 5); ctx.lineTo(aim.x, aim.y + 15);
          ctx.stroke();
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#040818';
    ctx.fillRect(0, 0, w, h);
    var gy = h * 0.9;
    ctx.fillStyle = '#0c1f16'; ctx.fillRect(0, gy, w, h - gy);
    for (var c = 0; c < 6; c++) {
      var cx = w * (0.15 + c * 0.14);
      ctx.fillStyle = ACCENT;
      ctx.fillRect(cx - w * 0.03, gy - h * 0.06, w * 0.06, h * 0.06);
      ctx.fillRect(cx - w * 0.02, gy - h * 0.1, w * 0.04, h * 0.04);
    }
    ctx.lineWidth = 1.5;
    for (var i = 0; i < 4; i++) {
      var k = ((t * 0.25 + i * 0.27) % 1);
      var sx = w * (0.1 + i * 0.25), tx = w * (0.8 - i * 0.2);
      var x = sx + (tx - sx) * k, y = gy * k;
      ctx.strokeStyle = 'rgba(255,77,109,0.8)';
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(x, y); ctx.stroke();
      if (k > 0.55 && k < 0.75 && i % 2 === 0) {
        ctx.fillStyle = BLAST; ctx.shadowColor = BLAST; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(x, y, h * 0.08 * Math.sin((k - 0.55) / 0.2 * Math.PI), 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  XA.registerGame({
    id: 'xa_block_defence',
    order: 12,
    title: 'Block Defence',
    tagline: 'Shield the towers. Blast the warheads.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP THE SKY TO FIRE AN INTERCEPTOR THERE',
    controls: 'Click to fire · or arrows to aim, Space / Z X C to fire',
    create: create,
    attract: attract
  });
})(window);

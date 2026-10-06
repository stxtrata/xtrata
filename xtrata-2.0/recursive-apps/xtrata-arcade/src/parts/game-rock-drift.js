/*
 * Xtrata Arcade cartridge #7 - ROCK DRIFT (v2)
 * Thrust, rotate, split rocks. Big rocks break into smaller, faster ones.
 *   rock types  normal, ICE (shatters into more shards), METAL (several hits),
 *               EXPLOSIVE (blast radius, chain reactions)
 *   pickups     TRIPLE shot, RAPID fire, SHIELD (one hit), SMART BOMB (shockwave)
 *   every 5th wave a rock-armoured CORE boss with three phases.
 * A saucer shows up from wave 2 and shoots back. Extra ship every 10,000.
 * Contract game-id: xa_rock_drift (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-rock-drift');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 560, H = 480, TAU = Math.PI * 2;
  var ACCENT = '#7df9ff', UFO = '#ff4fd8', FLAME = '#ffb35c';
  var SIZES = [{ r: 40, pts: 20, spd: 45 }, { r: 22, pts: 50, spd: 80 }, { r: 12, pts: 100, spd: 125 }];
  var TYPES = {
    n: { c: '#c4b8ff', fill: 'rgba(185,170,255,0.07)', mul: 1, name: 'ROCKS' },
    i: { c: '#6fd6ff', fill: 'rgba(110,200,255,0.2)', mul: 1, name: 'ICE ROCKS' },
    m: { c: '#a4b0c8', fill: '#131824', mul: 2, name: 'METAL ROCKS' },
    x: { c: '#ff5a4f', fill: 'rgba(255,70,60,0.10)', mul: 1.5, name: 'EXPLOSIVE ROCKS' }
  };
  var METAL_HP = [4, 2, 1];
  var POWERS = {
    triple: { c: '#ffd23f', time: 11, deg: [0, 2, 4], inst: 'pluck' },
    rapid: { c: '#ff9f1c', time: 11, deg: [4, 5, 4, 7], inst: 'arp' },
    shield: { c: '#39ff88', time: 0, deg: [0, 4, 7], inst: 'bell' },
    bomb: { c: '#ff4fd8', time: 0, deg: [7, 4, 1, 0], inst: 'marimba' }
  };
  var PLATES = 10, CORE_R = 30, PLATE_IN = 41, PLATE_OUT = 61;

  // Soundtrack: dark phrygian pad over a two-note heartbeat that races as the wave thins out.
  var MASS = [7, 3, 1];        // a big rock is 7 small-rock "units" of work
  var SONG_CUT = 2400;
  function song() {
    return {
      bpm: 64, key: 52, scale: 'phrygian', chords: [0, 1, 0, -1], barsPerChord: 2, seed: 77, filter: SONG_CUT,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.34, chord: true, octave: -1, params: { cutoff: 700, attack: 0.9, release: 1.4 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 1, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'heart', inst: 'sub', layer: 0, gain: 0.6, octave: -2, pattern: '0 - . 1 - . . . . . . . . . . .' },
        { name: 'thump', inst: 'kick', layer: 0.2, gain: 0.45, pattern: 'X..x............' },
        { name: 'tick', inst: 'hat', layer: 0.3, gain: 0.22, pattern: '....x.......x.x.' },
        { name: 'drone', inst: 'bass', layer: 0.45, gain: 0.3, chord: true, octave: -2, params: { cutoff: 420, q: 8 },
          pattern: '. . . . . . . . 0 . 0 . . . 1 .' },
        { name: 'glint', inst: 'bell', layer: 0.6, gain: 0.22, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.18 ? { deg: [0, 1, 4, 5, 7][Math.floor(i.rng() * 5)], vel: 0.5 } : null; } },
        { name: 'pulse', inst: 'arp', layer: 0.8, gain: 0.18, chord: true, params: { cutoff: 1200 },
          fn: function (i) { return i.step % 2 ? null : [0, 1, 4, 1][(i.step / 2) % 4]; } }
      ]
    };
  }
  // Boss: same E phrygian world, but the heartbeat becomes a machine.
  function bossSong(n) {
    return {
      bpm: 112, key: 52, scale: 'phrygian', chords: [0, 0, 1, -2], seed: 500 + n, filter: 18000,
      tracks: [
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.8, pattern: 'X..x..x.X..x..x.' },
        { name: 'heart', inst: 'sub', layer: 0, gain: 0.5, octave: -2, pattern: '0 - . 1 - . . . 0 - . 1 - . . .' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.42, chord: true, octave: -2, params: { cutoff: 950, q: 10 },
          pattern: '0 0 ^0 0 0 1 0 0 0 0 ^0 0 -1 0 1 0' },
        { name: 'snare', inst: 'snare', layer: 0.3, gain: 0.45, pattern: '....X.......X...' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.35, pattern: 'x.xxx.x.x.xxx.xx' },
        { name: 'alarm', inst: 'lead', layer: 0.55, gain: 0.26, octave: 1, params: { wave: 'sawtooth', cutoff: 2200 },
          pattern: '0 - 1 - 0 - . . 0 - 1 - 3 - 1 -' },
        { name: 'stab', inst: 'pluck', layer: 0.8, gain: 0.3, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.4 ? { deg: [0, 1, 4, 7][Math.floor(i.rng() * 4)] } : null; } },
        { name: 'fill', inst: 'snare', layer: 0.95, gain: 0.3, fn: function (i) { return i.stepInBar > 11 ? { drum: true, vel: 0.3 + (i.stepInBar - 11) * 0.15 } : null; } }
      ]
    };
  }

  function wrap(o) {
    if (o.x < -50) o.x += W + 100; else if (o.x > W + 50) o.x -= W + 100;
    if (o.y < -50) o.y += H + 100; else if (o.y > H + 50) o.y -= H + 100;
  }
  function wrapTight(o, r) {
    if (o.x < -r) o.x += W + 2 * r; else if (o.x > W + r) o.x -= W + 2 * r;
    if (o.y < -r) o.y += H + 2 * r; else if (o.y > H + r) o.y -= H + 2 * r;
  }
  function dist2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
  function hits(a, b, r) { return dist2(a, b) < r * r; }
  function blastR(r) { return r * 1.6 + 46; }

  /* ------------------------------------------------ shared vector drawing */
  // Two-pass glow: wide faint stroke, then a thin bright one (use under 'lighter').
  function glow(ctx, c, w, a) {
    a = a == null ? 1 : a;
    ctx.strokeStyle = c;
    ctx.globalAlpha = a * 0.18; ctx.lineWidth = w * 4; ctx.stroke();
    ctx.globalAlpha = a * 0.9; ctx.lineWidth = w; ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function polyPath(ctx, x, y, r, rot, pts) {
    ctx.beginPath();
    for (var k = 0; k < pts.length; k++) {
      var a = rot + k / pts.length * TAU;
      var px = x + Math.cos(a) * r * pts[k], py = y + Math.sin(a) * r * pts[k];
      if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath();
  }
  function drawRock(ctx, r, t, sc) {
    var T = TYPES[r.type], x = r.x * sc, y = r.y * sc, rad = r.r * sc, k, a;
    var col = r.flash > 0 ? '#ffffff' : T.c;
    polyPath(ctx, x, y, rad, r.rot, r.pts);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = T.fill; ctx.fill();
    if (r.type === 'x') {
      var pu = 0.7 + 0.3 * Math.sin(t * 7 + r.ph);
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad * 0.75);
      g.addColorStop(0, 'rgba(255,230,160,' + (0.9 * pu) + ')'); g.addColorStop(0.35, 'rgba(255,70,40,' + (0.55 * pu) + ')'); g.addColorStop(1, 'rgba(255,40,40,0)');
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, col, r.type === 'm' ? 2.2 : 1.6, 1);
    if (r.type === 'i') {
      ctx.beginPath();
      for (k = 0; k < r.pts.length; k += 3) { a = r.rot + k / r.pts.length * TAU; ctx.moveTo(x + Math.cos(a + 1) * rad * 0.2, y + Math.sin(a + 1) * rad * 0.2); ctx.lineTo(x + Math.cos(a) * rad * r.pts[k] * 0.92, y + Math.sin(a) * rad * r.pts[k] * 0.92); }
      glow(ctx, T.c, 0.7, 0.35);
    } else if (r.type === 'm') {
      ctx.beginPath(); ctx.arc(x, y, rad * 0.62, r.rot * 0.3 - 2.5, r.rot * 0.3 - 1.5);
      glow(ctx, '#ffffff', 1.2, 0.45);
      ctx.fillStyle = 'rgba(210,220,240,0.7)';
      for (k = 0; k < 3; k++) { a = r.rot + k * 2.1; ctx.fillRect(x + Math.cos(a) * rad * 0.45 - 1, y + Math.sin(a) * rad * 0.45 - 1, 2, 2); }
      var dmg = r.maxhp - r.hp;
      if (dmg > 0) {
        ctx.beginPath();
        for (k = 0; k < dmg; k++) { a = r.rot + k * 2.4 + 0.5; ctx.moveTo(x + Math.cos(a) * rad * 0.15, y + Math.sin(a) * rad * 0.15); ctx.lineTo(x + Math.cos(a + 0.3) * rad * 0.5, y + Math.sin(a + 0.3) * rad * 0.5); ctx.lineTo(x + Math.cos(a) * rad * 0.85, y + Math.sin(a) * rad * 0.85); }
        glow(ctx, '#ffb35c', 0.8, 0.8);
      }
    } else if (r.type === 'n' && r.ph != null && Math.floor(r.ph * 10) % 3 === 0) {
      // cosmetic: roughly one plain rock in three wears a faint bitcoin crater that turns with it
      // (picked from the rock's existing phase value; no random numbers are drawn)
      ctx.save();
      ctx.translate(x, y); ctx.rotate(r.rot);
      U.btc(ctx, rad * 0.08, -rad * 0.06, rad * 0.36, { coin: false, ink: '#f7931a', alpha: 0.42, glow: 6 });
      ctx.restore();
    } else if (r.type === 'x') {
      // blast-radius telegraph
      ctx.setLineDash([4, 7]);
      ctx.beginPath(); ctx.arc(x, y, blastR(r.r) * sc, r.rot * 0.4, r.rot * 0.4 + TAU);
      ctx.strokeStyle = T.c; ctx.lineWidth = 1; ctx.globalAlpha = 0.12 + 0.08 * Math.sin(t * 5 + r.ph); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  }
  function drawShipShape(ctx, x, y, a, k, col, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
    ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, -9); ctx.lineTo(-6, 0); ctx.lineTo(-10, 9); ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(125,249,255,' + (0.14 * alpha) + ')'; ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, col, 1.8 / k, alpha);
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-2, -3); ctx.lineTo(-2, 3); ctx.closePath();
    glow(ctx, '#ffffff', 1 / k, 0.6 * alpha);
    ctx.restore();
  }
  function drawFlame(ctx, x, y, a, k, len) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath(); ctx.moveTo(-7, -5); ctx.lineTo(-7 - len, 0); ctx.lineTo(-7, 5); ctx.closePath();
    var g = ctx.createLinearGradient(-7, 0, -7 - len, 0);
    g.addColorStop(0, 'rgba(255,245,200,0.95)'); g.addColorStop(0.4, 'rgba(255,150,60,0.7)'); g.addColorStop(1, 'rgba(255,60,20,0)');
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
  }
  function drawPickupIcon(ctx, kind, x, y, s, alpha, spin) {
    var c = POWERS[kind].c, k;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    for (k = 0; k < 6; k++) { var a = spin + k / 6 * TAU; ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); }
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(8,10,24,0.75)'; ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, c, 1.4, alpha);
    var q = s * 0.5;
    ctx.beginPath();
    if (kind === 'triple') {
      ctx.moveTo(0, q); ctx.lineTo(0, -q); ctx.moveTo(0, q); ctx.lineTo(-q * 0.8, -q * 0.7); ctx.moveTo(0, q); ctx.lineTo(q * 0.8, -q * 0.7);
    } else if (kind === 'rapid') {
      ctx.moveTo(-q * 0.7, 0); ctx.lineTo(0, -q * 0.8); ctx.lineTo(q * 0.7, 0);
      ctx.moveTo(-q * 0.7, q * 0.8); ctx.lineTo(0, 0); ctx.lineTo(q * 0.7, q * 0.8);
    } else if (kind === 'shield') {
      ctx.moveTo(0, -q); ctx.lineTo(q * 0.85, -q * 0.55); ctx.lineTo(q * 0.6, q * 0.45); ctx.lineTo(0, q); ctx.lineTo(-q * 0.6, q * 0.45); ctx.lineTo(-q * 0.85, -q * 0.55); ctx.closePath();
    } else {
      for (k = 0; k < 8; k++) { var b = k / 8 * TAU; ctx.moveTo(Math.cos(b) * q * 0.3, Math.sin(b) * q * 0.3); ctx.lineTo(Math.cos(b) * q * (k % 2 ? 0.7 : 1.05), Math.sin(b) * q * (k % 2 ? 0.7 : 1.05)); }
    }
    glow(ctx, '#ffffff', 1.1, alpha);
    ctx.restore();
  }

  function create(api) {
    var rng = api.rng;
    var ship = null;
    var rocks = [], bullets = [], eShots = [], pickups = [], blasts = [], shocks = [];
    var parts = [], lines = [];
    var ufo = null, ufoT = 12, boss = null, bossN = 0;
    var power = { triple: 0, rapid: 0 };
    var wave = 0, lives = 3, nextLife = 10000, score = 0;
    var fireCd = 0, respawnT = 0, waveT = 0, spawnTag = 0, shockId = 0;
    var over = false, overT = 0, bannerT = 0, banner = '', banner2 = '';
    var t = 0, camX = 0, camY = 0;
    var waveMass = 1, mBpm = 0, mInt = -1, mThrust = false, mClear = false, mBoss = false;
    var srng = U.rng((api.seed ^ 0x5bd1e995) >>> 0);  // starfield only
    var stars = [];
    for (var i = 0; i < 110; i++) stars.push({ x: srng() * W, y: srng() * H, d: [0.08, 0.2, 0.45][i % 3], s: i % 3 === 2 ? 1.6 : 1, tw: 1 + srng() * 3, ph: srng() * 6 });

    /* ------------------------------------------------ visual-only particles */
    function spark(x, y, c, n, sp, life, size) {
      for (var k = 0; k < n && parts.length < 520; k++) {
        var a = Math.random() * TAU, s = sp * (0.3 + Math.random() * 0.7);
        parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: life * (0.5 + Math.random() * 0.5), max: life, c: c, s: size || 2 });
      }
    }
    function debris(r) {
      var n = Math.min(r.pts.length, 5 + (2 - r.size) * 3);
      for (var k = 0; k < n && lines.length < 170; k++) {
        var a = r.rot + k / n * TAU, sp = 40 + Math.random() * 90;
        lines.push({ x: r.x + Math.cos(a) * r.r * 0.7, y: r.y + Math.sin(a) * r.r * 0.7, vx: r.vx * 0.4 + Math.cos(a) * sp, vy: r.vy * 0.4 + Math.sin(a) * sp,
          a: a + 1.57, va: (Math.random() - 0.5) * 8, len: r.r * (0.35 + Math.random() * 0.3), life: 0.9, max: 0.9, c: TYPES[r.type].c });
      }
    }
    function stepParts(dt) {
      var k, p;
      for (k = parts.length - 1; k >= 0; k--) {
        p = parts[k]; p.life -= dt;
        if (p.life <= 0) { parts.splice(k, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.97; p.vy *= 0.97;
      }
      for (k = lines.length - 1; k >= 0; k--) {
        p = lines[k]; p.life -= dt;
        if (p.life <= 0) { lines.splice(k, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
      }
    }

    /* --------------------------------------------------------- spawning */
    function spdScale() { return Math.min(1.6, 1 + (wave - 1) * 0.045); }
    function newShip(x, y) {
      ship = { x: x == null ? W / 2 : x, y: y == null ? H / 2 : y, vx: 0, vy: 0, a: -Math.PI / 2, inv: 2.6, thrust: false, shield: ship && ship.shield, spawn: 0.7 };
    }
    function makeRock(x, y, size, ang, type, mul) {
      var s = SIZES[size];
      type = type || 'n';
      var a = ang == null ? rng() * TAU : ang;
      var sp = s.spd * (0.7 + rng() * 0.6) * spdScale() * (type === 'm' ? 0.75 : 1) * (mul || 1);
      var pts = [];
      var n = 9 + Math.floor(rng() * 4);
      for (var k = 0; k < n; k++) pts.push(type === 'i' ? (k % 2 ? 0.7 : 1) * (0.85 + rng() * 0.2) : 0.72 + rng() * 0.36);
      var hp = type === 'm' ? METAL_HP[size] : 1;
      return { x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: size, r: s.r, rot: rng() * 6, spin: (rng() - 0.5) * 1.6,
        pts: pts, type: type, hp: hp, maxhp: hp, flash: 0, ph: rng() * 6, tag: spawnTag };
    }
    function pickType() {
      var w = wave, r = rng();
      var pi = w >= 2 ? Math.min(0.28, 0.1 + 0.03 * w) : 0;
      var pe = w >= 3 ? Math.min(0.2, 0.06 + 0.02 * w) : 0;
      var pm = w >= 4 ? Math.min(0.24, 0.05 + 0.02 * w) : 0;
      if (r < pi) return 'i';
      r -= pi; if (r < pe) return 'x';
      r -= pe; if (r < pm) return 'm';
      return 'n';
    }
    function edgeSpot() {
      for (var tries = 0; tries < 8; tries++) {
        var edge = rng() < 0.5;
        var p = { x: edge ? (rng() < 0.5 ? -30 : W + 30) : rng() * W, y: edge ? rng() * H : (rng() < 0.5 ? -30 : H + 30) };
        if (!ship || !hits(p, ship, 170)) return p;
      }
      return { x: ship && ship.x < W / 2 ? W + 30 : -30, y: ship && ship.y < H / 2 ? H + 30 : -30 };
    }
    function showBanner(a, b) { banner = a; banner2 = b || ''; bannerT = 2.2; }
    function startWave() {
      wave++;
      mClear = false;
      if (wave % 5 === 0) { spawnBoss(); return; }
      var n = Math.min(10, 3 + wave), intro = { 2: 'i', 3: 'x', 4: 'm' }[wave];
      waveMass = 0;
      for (var k = 0; k < n; k++) {
        var p = edgeSpot();
        var r = makeRock(p.x, p.y, 0, null, k === 0 && intro ? intro : pickType());
        // aim loosely at the arena, never straight down the ship's throat
        rocks.push(r);
        waveMass += MASS[0] * (r.type === 'i' ? 1.3 : 1);
      }
      showBanner('WAVE ' + wave, intro ? 'NEW: ' + TYPES[intro].name : '');
      api.audio.arp([392, 523, 659], 0.07, { type: 'triangle', vol: 0.16 });
      syncMusic();
    }
    function spawnBoss() {
      bossN++;
      var plates = [], pts = [];
      for (var k = 0; k < PLATES; k++) plates.push({ hp: 2, flash: 0 });
      for (k = 0; k < 11; k++) pts.push(0.8 + rng() * 0.3);
      var max = 20 + bossN * 8;
      boss = { x: W / 2, y: -90, hp: max, max: max, phase: 1, rot: 0, spin: 0.5, plates: plates, pts: pts, flash: 0, t: 0,
        enter: 2.4, spitT: 3.5, ringT: 2.6, dying: 0, boomT: 0, shock: 0 };
      waveMass = 1;
      showBanner('WARNING', 'ROCK CORE MK ' + bossN);
      api.shake(6);
      var m = M();
      if (m) { mBoss = true; mBpm = 0; mInt = -1; mThrust = false; m.play(bossSong(bossN), { fade: 1.2, intensity: 0.3 }); m.note('riser', 0, { dur: 2, gain: 0.45 }); }
      api.audio.tone(110, 0.9, { type: 'sawtooth', vol: 0.12, slide: 0.5 });
    }
    function syncMusic() {
      var m = M();
      if (!m) return;
      var bpm, iv;
      if (boss) {
        bpm = [112, 120, 132][boss.phase - 1];
        iv = [0.35, 0.65, 1][boss.phase - 1];
      } else {
        var left = 0;
        for (var k = 0; k < rocks.length; k++) left += MASS[rocks[k].size];
        var gone = U.clamp(1 - left / waveMass, 0, 1);
        bpm = 64 + Math.round(gone * gone * 18) * 4;          // 64 -> 136 as the last rocks go
        iv = Math.round(U.clamp(0.08 + (wave - 1) * 0.1 + gone * 0.45, 0, 1) * 20) / 20;
      }
      if (bpm !== mBpm) { mBpm = bpm; m.setTempo(bpm, 0.8); }
      if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
    }
    function add(pts, x, y, col) {
      pts = Math.round(pts);
      score += pts;
      api.addScore(pts);
      if (score >= nextLife) {
        nextLife += 10000;
        lives = Math.min(6, lives + 1);
        api.fx.text(W / 2, 60, 'EXTRA SHIP', '#39ff88', 14);
        api.audio.arp([659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
      }
      if (x != null) api.fx.text(x, y, '+' + pts, col || '#fff', 10);
    }

    /* ----------------------------------------------------------- damage */
    function dropPickup(x, y, force) {
      if (!force && (spawnTag || pickups.length >= 2 || rng() > 0.065)) return;
      var r = rng(), kind = r < 0.3 ? 'triple' : r < 0.58 ? 'rapid' : r < 0.84 ? 'shield' : 'bomb';
      var a = rng() * TAU;
      pickups.push({ x: x, y: y, vx: Math.cos(a) * 25, vy: Math.sin(a) * 25, life: 9, kind: kind, spin: 0 });
    }
    function killUfo() {
      add(500, ufo.x, ufo.y - 16, UFO);
      api.fx.burst(ufo.x, ufo.y, UFO, 30, 200, 0.8);
      spark(ufo.x, ufo.y, '#ffffff', 14, 180, 0.6, 2);
      api.audio.arp([1047, 784, 523], 0.05, { type: 'square', vol: 0.18 });
      dropPickup(ufo.x, ufo.y, pickups.length < 2);
      ufo = null; ufoT = 14 + rng() * 10;
    }
    function clank(x, y) {
      spark(x, y, '#ffe6a8', 7, 180, 0.3, 1.5);
      api.audio.tone(1500, 0.04, { type: 'triangle', vol: 0.09 });
      if (M()) M().note('bell', 1, { octave: -1, gain: 0.3 }); else api.audio.tone(330, 0.12, { type: 'square', vol: 0.08 });
    }
    // Returns true if the rock broke.
    function damageRock(idx, dmg, depth, px, py) {
      var r = rocks[idx];
      if (r.type === 'm' && r.hp > dmg) {
        r.hp -= dmg; r.flash = 0.1;
        var ci = Math.floor(Math.random() * r.pts.length);
        r.pts[ci] = Math.max(0.55, r.pts[ci] - 0.12);
        clank(px == null ? r.x : px, py == null ? r.y : py);
        return false;
      }
      breakRock(idx, depth || 0);
      return true;
    }
    function breakRock(idx, depth, vaporise) {
      var r = rocks[idx], T = TYPES[r.type];
      rocks.splice(idx, 1);
      add(SIZES[r.size].pts * T.mul + (depth ? 60 * depth : 0), r.x, r.y - r.r, depth ? '#ffb35c' : '#fff');
      api.fx.burst(r.x, r.y, T.c, 8 + (2 - r.size) * 8, 120 + r.size * 40, 0.6);
      debris(r);
      api.shake(4 - r.size);
      var m = M();
      if (r.type === 'x') {
        var R = blastR(r.r);
        blasts.push({ x: r.x, y: r.y, R: R, t: 0, done: false, depth: depth });
        api.shake(8 + depth * 2);
        spark(r.x, r.y, '#ffd08a', 26, 320, 0.5, 2.5);
        api.audio.noise(0.5, { vol: 0.34, cutoff: 900 });
        if (depth) api.fx.text(r.x, r.y + 14, 'CHAIN x' + (depth + 1), '#ffb35c', 12);
        if (m) {
          m.note('marimba', Math.min(depth * 2, 10), { octave: 1, quantize: '16', gain: 0.6 });
          m.note('kick', 0, { gain: 0.7 });
        }
        dropPickup(r.x, r.y);
        return;
      }
      api.audio.noise(0.18 + (2 - r.size) * 0.1, { vol: 0.22, cutoff: r.type === 'i' ? 3200 : 700 + r.size * 800 });
      if (m) {
        var top = [0, 4, 7][r.size];   // large low, small high; each split falls a step
        if (r.type === 'i') m.stinger([{ deg: top + 7 }, { deg: top + 5, at: 1 }, { deg: top + 4, at: 2 }], { inst: 'bell', quantize: '16', octave: 0, gain: 0.35 });
        else m.stinger([{ deg: top + 1 }, { deg: top, at: 1, steps: 2 }], { inst: r.size ? 'pluck' : 'marimba', quantize: '16', octave: r.size - 1, gain: 0.5,
          params: { cutoff: r.type === 'm' ? 900 : 1800, decay: 0.2 } });
      }
      var base = Math.atan2(r.vy, r.vx);
      if (vaporise) return;
      if (r.type === 'i') {
        spark(r.x, r.y, '#e8fbff', 12, 160, 0.5, 1.5);
        var kids = r.size === 0 ? [1, 1, 2, 2] : r.size === 1 ? [2, 2, 2] : [];
        for (var k = 0; k < kids.length; k++) rocks.push(makeRock(r.x, r.y, kids[k], base + (k - (kids.length - 1) / 2) * 1.1 + (rng() - 0.5) * 0.4, 'i'));
      } else if (r.size < 2) {
        rocks.push(makeRock(r.x, r.y, r.size + 1, base + 0.6 + rng() * 0.4, r.type));
        rocks.push(makeRock(r.x, r.y, r.size + 1, base - 0.6 - rng() * 0.4, r.type));
      }
      dropPickup(r.x, r.y);
    }
    function hurtShip() {
      if (!ship || ship.inv > 0) return false;
      if (ship.shield) {
        ship.shield = false; ship.inv = 1.2;
        spark(ship.x, ship.y, POWERS.shield.c, 30, 260, 0.6, 2);
        api.shake(6);
        api.audio.tone(300, 0.3, { type: 'sawtooth', vol: 0.14, slide: 0.4 });
        if (M()) M().note('bell', -3, { octave: 0, gain: 0.5 });
        return false;
      }
      killShip();
      return true;
    }
    function killShip() {
      api.fx.burst(ship.x, ship.y, ACCENT, 34, 220, 1);
      spark(ship.x, ship.y, '#ffffff', 24, 200, 0.9, 2);
      for (var k = 0; k < 4 && lines.length < 170; k++) {
        var a = ship.a + k * 1.6;
        lines.push({ x: ship.x, y: ship.y, vx: Math.cos(a) * 70 + ship.vx * 0.3, vy: Math.sin(a) * 70 + ship.vy * 0.3, a: a, va: 5 - k * 3, len: 12, life: 1.4, max: 1.4, c: ACCENT });
      }
      api.shake(12);
      api.audio.noise(0.6, { vol: 0.35, cutoff: 600 });
      ship = null;
      power.triple = power.rapid = 0;
      lives--;
      if (lives <= 0) { over = true; if (M()) M().tapeStop(1.4); return; }
      if (M()) M().duck(0.7, 1.4);
      respawnT = 1.6;
    }
    function safeSpot() {
      var best = null, bestD = -1;
      var cands = [[W / 2, H / 2], [W * 0.25, H * 0.3], [W * 0.75, H * 0.3], [W * 0.25, H * 0.7], [W * 0.75, H * 0.7], [W / 2, H * 0.25], [W / 2, H * 0.75]];
      for (var c = 0; c < cands.length; c++) {
        var p = { x: cands[c][0], y: cands[c][1] }, d = 9999;
        for (var k = 0; k < rocks.length; k++) d = Math.min(d, Math.sqrt(dist2(p, rocks[k])) - rocks[k].r);
        if (boss) d = Math.min(d, Math.sqrt(dist2(p, boss)) - PLATE_OUT);
        if (c === 0 && d > 90) return { x: p.x, y: p.y, clear: true };
        if (d > bestD) { bestD = d; best = p; }
      }
      return { x: best.x, y: best.y, clear: bestD > 90 };
    }

    /* ------------------------------------------------------------- boss */
    function bossPlate(b) {
      var dx = b.x - boss.x, dy = b.y - boss.y, a = Math.atan2(dy, dx) - boss.rot;
      a = ((a % TAU) + TAU) % TAU;
      var seg = TAU / PLATES, idx = Math.floor(a / seg), frac = a / seg - idx;
      return frac > 0.09 && frac < 0.91 && boss.plates[idx].hp > 0 ? idx : -1;
    }
    function shedPlate(idx, speed) {
      var p = boss.plates[idx];
      p.hp = 0;
      var a = boss.rot + (idx + 0.5) * TAU / PLATES;
      var r = makeRock(boss.x + Math.cos(a) * 52, boss.y + Math.sin(a) * 52, 2, a, 'm', speed || 1);
      r.hp = r.maxhp = 1;
      rocks.push(r);
      spark(r.x, r.y, '#ffe6a8', 10, 200, 0.4, 1.5);
    }
    function hitPlate(idx, x, y) {
      var p = boss.plates[idx];
      p.hp--; p.flash = 0.12;
      clank(x, y);
      if (p.hp <= 0) { shedPlate(idx, 1.1); add(40, x, y); api.audio.noise(0.2, { vol: 0.2, cutoff: 1400 }); }
    }
    function hitCore(dmg, x, y) {
      if (boss.enter > 0 || boss.dying) return;
      boss.hp = Math.max(0, boss.hp - dmg); boss.flash = 0.1;
      add(25 * dmg, x, y - 10, '#ffd08a');
      spark(x, y, '#ffd08a', 10, 220, 0.35, 2);
      api.audio.tone(200 + (1 - boss.hp / boss.max) * 500, 0.07, { type: 'square', vol: 0.1, slide: 0.6 });
      if (M()) M().note('pluck', 7 - Math.round(boss.hp / boss.max * 7), { octave: 1, gain: 0.45 });
      var f = boss.hp / boss.max, k;
      if (boss.phase === 1 && f <= 0.66) {
        boss.phase = 2; boss.spin = -1.3; boss.spitT = 1.2;
        for (k = 0; k < PLATES; k += 2) if (boss.plates[k].hp > 0) shedPlate(k, 1.4);
        api.shake(10); showBanner('ARMOUR BREAKING', ''); bannerT = 1.4;
        if (M()) M().stinger([{ deg: 0 }, { deg: 1, at: 2 }, { deg: 0, at: 4, steps: 4 }], { inst: 'lead', quantize: 'beat', octave: 0, gain: 0.4 });
      } else if (boss.phase === 2 && f <= 0.33) {
        boss.phase = 3; boss.spin = 2.6; boss.ringT = 1.5;
        for (k = 0; k < PLATES; k++) if (boss.plates[k].hp > 0) shedPlate(k, 1.7);
        api.shake(14); showBanner('CORE EXPOSED', ''); bannerT = 1.4;
        if (M()) M().stinger([{ deg: 4 }, { deg: 1, at: 2 }, { deg: 0, at: 4, steps: 6 }], { inst: 'lead', quantize: 'beat', octave: 0, gain: 0.45 });
      }
      if (boss.hp <= 0) { boss.dying = 1.8; boss.boomT = 0; api.audio.tone(80, 1.6, { type: 'sawtooth', vol: 0.15, slide: 0.3 }); }
      syncMusic();
    }
    function bossBullet(b) {
      var d2 = dist2(b, boss);
      if (d2 > (PLATE_OUT + 3) * (PLATE_OUT + 3)) return false;
      if (boss.enter > 0 || boss.dying) return d2 < PLATE_OUT * PLATE_OUT;
      if (d2 > CORE_R * CORE_R) {
        if (d2 < (PLATE_IN - 3) * (PLATE_IN - 3)) return false;
        var idx = bossPlate(b);
        if (idx >= 0) { hitPlate(idx, b.x, b.y); return true; }
        return false;
      }
      hitCore(1, b.x, b.y);
      return true;
    }
    function armoured() { if (!boss) return false; for (var k = 0; k < PLATES; k++) if (boss.plates[k].hp > 0) return true; return false; }
    function updateBoss(dt) {
      var b = boss, k;
      b.t += dt; b.flash -= dt;
      for (k = 0; k < PLATES; k++) b.plates[k].flash -= dt;
      b.rot += b.spin * dt;
      if (b.dying) {
        b.dying -= dt; b.boomT -= dt;
        if (b.boomT <= 0) {
          b.boomT = 0.14;
          var ox = b.x + (Math.random() - 0.5) * 70, oy = b.y + (Math.random() - 0.5) * 70;
          spark(ox, oy, Math.random() < 0.5 ? '#ffd08a' : '#ff5a2a', 16, 260, 0.6, 2.5);
          api.audio.noise(0.25, { vol: 0.25, cutoff: 900 }); api.shake(6);
        }
        if (b.dying <= 0) bossDefeated();
        return;
      }
      if (b.enter > 0) {
        b.enter -= dt;
        b.y += (150 - b.y) * Math.min(1, dt * 2.2);
        return;
      }
      var k2 = [0.5, 0.8, 1.2][b.phase - 1];
      var tx = W / 2 + Math.cos(b.t * 0.37 * k2) * (W / 2 - 110), ty = H / 2 + Math.sin(b.t * 0.53 * k2) * (H / 2 - 110);
      if (b.phase === 3 && ship) { tx = tx * 0.65 + ship.x * 0.35; ty = ty * 0.65 + ship.y * 0.35; }
      b.x += (tx - b.x) * Math.min(1, dt * 0.6 * k2);
      b.y += (ty - b.y) * Math.min(1, dt * 0.6 * k2);
      b.spitT -= dt;
      if (b.spitT <= 0 && rocks.length < 26) {
        b.spitT = [3.6, 2.6, 3.2][b.phase - 1];
        var aim = ship ? Math.atan2(ship.y - b.y, ship.x - b.x) : rng() * TAU;
        var n = b.phase === 2 ? 2 : 1;
        for (k = 0; k < n; k++) {
          var a = aim + (n > 1 ? (k - 0.5) * 0.5 : 0) + (rng() - 0.5) * 0.3;
          var r = makeRock(b.x + Math.cos(a) * 64, b.y + Math.sin(a) * 64, 2, a, rng() < 0.2 + b.phase * 0.1 ? 'x' : 'n', 1.2);
          if (!ship || !hits(r, ship, 70)) rocks.push(r);
        }
        spark(b.x + Math.cos(aim) * 50, b.y + Math.sin(aim) * 50, '#ff9f1c', 10, 160, 0.4, 2);
        api.audio.tone(140, 0.2, { type: 'sawtooth', vol: 0.1, slide: 1.8 });
      }
      if (b.phase === 3) {
        b.ringT -= dt;
        if (b.ringT <= 0) {
          b.ringT = 2.6;
          for (k = 0; k < 10; k++) {
            var ra = b.rot + k / 10 * TAU;
            eShots.push({ x: b.x + Math.cos(ra) * 34, y: b.y + Math.sin(ra) * 34, vx: Math.cos(ra) * 165, vy: Math.sin(ra) * 165, life: 3, c: '#ff9f1c' });
          }
          if (M()) M().note('lead', 4, { octave: -1, gain: 0.35, dur: 0.12 }); else api.audio.tone(220, 0.15, { type: 'square', vol: 0.1 });
        }
      }
    }
    function bossDefeated() {
      var b = boss;
      for (var k = 0; k < 3; k++) spark(b.x, b.y, ['#ffffff', '#ffd08a', '#ff5a2a'][k], 40, 360 - k * 60, 1.2, 3);
      debris({ x: b.x, y: b.y, vx: 0, vy: 0, r: 60, rot: b.rot, size: 0, type: 'x', pts: b.pts });
      blasts.push({ x: b.x, y: b.y, R: 170, t: 0, done: true, depth: 0 });
      api.shake(18);
      api.audio.noise(1.2, { vol: 0.4, cutoff: 700 });
      add(2500 * bossN, b.x, b.y - 30, '#ffd23f');
      api.fx.text(W / 2, H / 2 - 40, 'CORE DESTROYED', '#ffd23f', 18);
      dropPickup(b.x - 20, b.y, true); dropPickup(b.x + 20, b.y, true);
      boss = null;
      var m = M();
      if (m) {
        m.play(song(), { fade: 2, intensity: 0.3 });
        mBoss = false; mBpm = 0; mInt = -1; mThrust = false;
        m.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 8, at: 6 }, { deg: 11, at: 8, steps: 12 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.6 });
        m.stinger([{ deg: 0, steps: 8 }, { deg: 4, at: 8, steps: 12 }], { inst: 'lead', quantize: 'beat', octave: 0, gain: 0.3 });
      }
      mClear = !rocks.length;
      waveMass = 0;
      for (k = 0; k < rocks.length; k++) waveMass += MASS[rocks[k].size];
      waveMass = Math.max(1, waveMass);
    }

    /* ------------------------------------------------------- pickups */
    function collect(p) {
      var P = POWERS[p.kind], m = M();
      spark(p.x, p.y, P.c, 18, 200, 0.5, 2);
      api.fx.text(p.x, p.y - 16, { triple: 'TRIPLE SHOT', rapid: 'RAPID FIRE', shield: 'SHIELD', bomb: 'SMART BOMB' }[p.kind], P.c, 11);
      api.audio.tone(660, 0.08, { type: 'triangle', vol: 0.12, slide: 1.5 });
      if (m) {
        var seq = [];
        for (var k = 0; k < P.deg.length; k++) seq.push({ deg: P.deg[k], at: k, steps: p.kind === 'shield' ? 4 : 1 });
        m.stinger(seq, { inst: P.inst, quantize: '16', octave: p.kind === 'bomb' ? 0 : 1, gain: 0.5 });
      }
      if (p.kind === 'triple' || p.kind === 'rapid') power[p.kind] = P.time;
      else if (p.kind === 'shield') ship.shield = true;
      else {
        shockId++;
        shocks.push({ x: ship.x, y: ship.y, r: 0, id: shockId });
        eShots.length = 0;
        api.shake(10);
        api.audio.noise(0.8, { vol: 0.35, cutoff: 500 });
        if (m) { m.note('kick', 0, { gain: 1 }); m.duck(0.4, 0.8); }
      }
    }

    if (M()) M().play(song(), { fade: 1.5, intensity: 0 });
    newShip();
    startWave();

    /* ----------------------------------------------------------- update */
    function updateWorld(dt) {
      var i, j, k, r;
      for (i = 0; i < rocks.length; i++) {
        r = rocks[i];
        if (r.type === 'i') {   // ice skates: velocity slowly swivels
          var sw = Math.sin(t * 1.3 + r.ph) * 0.35 * dt, c = Math.cos(sw), s = Math.sin(sw), vx = r.vx;
          r.vx = vx * c - r.vy * s; r.vy = vx * s + r.vy * c;
        }
        r.x += r.vx * dt; r.y += r.vy * dt; r.rot += r.spin * dt; r.flash -= dt;
        wrap(r);
      }
      for (i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i];
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        wrapTight(b, 2);
        if (b.life <= 0) { bullets.splice(i, 1); continue; }
        var used = false;
        for (j = rocks.length - 1; j >= 0; j--) {
          if (hits(b, rocks[j], rocks[j].r)) { used = true; damageRock(j, 1, 0, b.x, b.y); break; }
        }
        if (!used && boss) used = bossBullet(b);
        if (!used && ufo && hits(b, ufo, 18)) {
          used = true;
          killUfo();
        }
        if (used) bullets.splice(i, 1);
      }
      // explosive blasts: flash first, damage lands a beat later so chains cascade visibly
      for (i = blasts.length - 1; i >= 0; i--) {
        var bl = blasts[i];
        bl.t += dt;
        if (!bl.done && bl.t >= 0.12) {
          bl.done = true;
          var targets = [];
          for (j = 0; j < rocks.length; j++) if (hits(rocks[j], bl, bl.R + rocks[j].r * 0.5)) targets.push(rocks[j]);
          for (j = 0; j < targets.length; j++) {
            k = rocks.indexOf(targets[j]);
            if (k >= 0) damageRock(k, 2, bl.depth + 1);
          }
          if (boss && hits(boss, bl, bl.R + CORE_R)) {
            for (k = 0; k < PLATES; k++) if (boss.plates[k].hp > 0 && rng() < 0.4) shedPlate(k, 1.2);
            hitCore(2, boss.x, boss.y);
          }
          if (ufo && hits(ufo, bl, bl.R + 10)) killUfo();
          if (ship && hits(ship, bl, bl.R)) {   // shove, never kill
            var ang = Math.atan2(ship.y - bl.y, ship.x - bl.x);
            ship.vx += Math.cos(ang) * 160; ship.vy += Math.sin(ang) * 160;
          }
        }
        if (bl.t > 0.5) blasts.splice(i, 1);
      }
      // smart-bomb shockwaves
      for (i = shocks.length - 1; i >= 0; i--) {
        var sh = shocks[i];
        sh.r += 640 * dt;
        spawnTag = sh.id;
        for (j = rocks.length - 1; j >= 0; j--) {
          if (j >= rocks.length) continue;
          r = rocks[j];
          if (r.tag !== sh.id && hits(r, sh, sh.r)) breakRock(j, 0, r.size > 0);
        }
        spawnTag = 0;
        if (boss && boss.shock !== sh.id && hits(boss, sh, sh.r)) {
          boss.shock = sh.id;
          for (k = 0; k < PLATES; k += 3) if (boss.plates[k].hp > 0) shedPlate(k, 1.3);
          hitCore(4, boss.x, boss.y);
        }
        if (ufo && hits(ufo, sh, sh.r)) killUfo();
        if (sh.r > 780) shocks.splice(i, 1);
      }
      for (i = pickups.length - 1; i >= 0; i--) {
        var p = pickups[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; p.spin += dt * 1.5;
        wrapTight(p, 12);
        if (p.life <= 0) { pickups.splice(i, 1); continue; }
        if (ship && hits(p, ship, 22)) { pickups.splice(i, 1); collect(p); }
      }
      if (boss) updateBoss(dt);
      // saucer
      if (wave >= 2 && !over && !boss) {
        if (!ufo) {
          ufoT -= dt;
          if (ufoT <= 0) {
            var fromLeft = rng() < 0.5;
            ufo = { x: fromLeft ? -20 : W + 20, y: 60 + rng() * (H - 120), vx: fromLeft ? 90 : -90, shoot: 1.2, t: 0 };
          }
        } else {
          ufo.t += dt;
          ufo.x += ufo.vx * dt;
          ufo.y += Math.sin(ufo.t * 2) * 40 * dt;
          ufo.shoot -= dt;
          if (Math.floor(ufo.t * 8) % 4 === 0) api.audio.tone(ufo.t % 0.5 < 0.25 ? 520 : 440, 0.03, { type: 'sine', vol: 0.04 });
          if (ufo.shoot <= 0 && ship) {
            ufo.shoot = Math.max(0.8, 1.6 - wave * 0.1);
            var aim = Math.atan2(ship.y - ufo.y, ship.x - ufo.x) + (rng() - 0.5) * 0.5;
            eShots.push({ x: ufo.x, y: ufo.y, vx: Math.cos(aim) * 230, vy: Math.sin(aim) * 230, life: 2, c: UFO });
          }
          if (ufo.x < -40 || ufo.x > W + 40) { ufo = null; ufoT = 14 + rng() * 10; }
        }
      }
      for (i = eShots.length - 1; i >= 0; i--) {
        var s2 = eShots[i];
        s2.x += s2.vx * dt; s2.y += s2.vy * dt; s2.life -= dt;
        if (s2.life <= 0) { eShots.splice(i, 1); continue; }
        if (ship && ship.inv <= 0 && hits(s2, ship, 10)) { eShots.splice(i, 1); hurtShip(); }
      }
      if (ship && ship.inv <= 0) {
        for (j = 0; j < rocks.length; j++) {
          if (hits(ship, rocks[j], rocks[j].r * 0.85 + 8)) {
            var shielded = ship.shield;
            breakRock(j, 0);
            if (!hurtShip() && shielded && ship) { ship.vx *= -0.5; ship.vy *= -0.5; }
            break;
          }
        }
        if (ship && ufo && hits(ship, ufo, 24)) { ufo = null; ufoT = 12; hurtShip(); }
        if (ship && boss && !boss.dying && boss.enter <= 0 && hits(ship, boss, (armoured() ? PLATE_OUT : CORE_R + 4) + 8)) {
          var ba = Math.atan2(ship.y - boss.y, ship.x - boss.x);
          if (!hurtShip() && ship) { ship.vx = Math.cos(ba) * 260; ship.vy = Math.sin(ba) * 260; }
        }
      }
      stepParts(dt);
    }

    function fire() {
      var rapid = power.rapid > 0, triple = power.triple > 0;
      var cap = (rapid ? 10 : 6) * (triple ? 2.5 : 1);
      if (bullets.length >= cap) return;
      fireCd = rapid ? 0.085 : 0.17;
      var spread = triple ? [-0.2, 0, 0.2] : [0];
      for (var k = 0; k < spread.length; k++) {
        var a = ship.a + spread[k];
        bullets.push({ x: ship.x + Math.cos(a) * 14, y: ship.y + Math.sin(a) * 14,
          vx: ship.vx + Math.cos(a) * 520, vy: ship.vy + Math.sin(a) * 520, life: 0.85, c: triple ? '#ffe98a' : rapid ? '#ffc27a' : '#ffffff' });
      }
      api.audio.tone(rapid ? 990 : 880, 0.05, { type: 'square', vol: 0.07, slide: 0.5 });
    }

    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (bannerT > 0) bannerT -= dt;
        if (over) { overT += dt; if (overT > 1.4) api.gameOver(); updateWorld(dt); return; }

        if (!ship) {
          respawnT -= dt;
          if (respawnT <= 0) {
            var sp = safeSpot();
            if (sp.clear || respawnT < -2.5) newShip(sp.x, sp.y);
          }
        } else {
          if (inp.held('left')) ship.a -= 4.4 * dt;
          if (inp.held('right')) ship.a += 4.4 * dt;
          ship.thrust = inp.held('up');
          if (ship.thrust) {
            ship.vx += Math.cos(ship.a) * 330 * dt;
            ship.vy += Math.sin(ship.a) * 330 * dt;
            for (var f = 0; f < 2 && parts.length < 520; f++) {
              var ja = ship.a + Math.PI + (Math.random() - 0.5) * 0.5, js = 110 + Math.random() * 90;
              parts.push({ x: ship.x - Math.cos(ship.a) * 11, y: ship.y - Math.sin(ship.a) * 11, vx: Math.cos(ja) * js + ship.vx * 0.5, vy: Math.sin(ja) * js + ship.vy * 0.5,
                life: 0.35, max: 0.4, c: Math.random() < 0.3 ? '#fff3c0' : Math.random() < 0.6 ? FLAME : '#ff5a2a', s: 3.4 });
            }
          }
          var spd = Math.hypot(ship.vx, ship.vy);
          if (spd > 340) { ship.vx *= 340 / spd; ship.vy *= 340 / spd; }
          ship.vx *= Math.pow(0.55, dt); ship.vy *= Math.pow(0.55, dt);
          ship.x += ship.vx * dt; ship.y += ship.vy * dt;
          wrapTight(ship, 12);
          if (ship.inv > 0) ship.inv -= dt;
          if (ship.spawn > 0) ship.spawn -= dt;
          fireCd -= dt;
          if ((inp.held('a') || inp.held('c') || inp.held('hold')) && fireCd <= 0) fire();
          camX += ship.vx * dt; camY += ship.vy * dt;
        }
        power.triple = Math.max(0, power.triple - dt);
        power.rapid = Math.max(0, power.rapid - dt);
        updateWorld(dt);
        var mu = M();
        if (mu) {
          var th = !!(ship && ship.thrust) && !boss;
          if (th !== mThrust) { mThrust = th; mu.setFilter(th ? 16000 : (mBoss ? 18000 : SONG_CUT), th ? 0.25 : 0.6); }
          syncMusic();
          if (!rocks.length && !boss && !mClear) {
            mClear = true;
            mu.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 8, at: 6 }, { deg: 7, at: 8, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
          }
        }
        if (!rocks.length && !ufo && !boss && !blasts.length) {
          waveT += dt;
          if (waveT > 1.4) { waveT = 0; startWave(); }
        }
        var pw = (power.triple > 0 ? '  \u00b7  TRIPLE' : '') + (power.rapid > 0 ? '  \u00b7  RAPID' : '') + (ship && ship.shield ? '  \u00b7  SHIELD' : '');
        api.setStatus((boss ? 'BOSS ' + bossN + '  \u00b7  CORE ' + Math.ceil(boss.hp / boss.max * 100) + '%' : 'WAVE ' + wave + '  \u00b7  ROCKS ' + rocks.length) + '  \u00b7  SHIPS ' + lives + pw);
      },

      render: function (ctx) {
        var i, k, pulse = M() ? M().pulse(6) : 0;
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        var neb = ctx.createRadialGradient(W * 0.7, H * 0.3, 10, W * 0.7, H * 0.3, W * 0.7);
        neb.addColorStop(0, boss ? '#23081a' : '#0c1030'); neb.addColorStop(1, '#03040c');
        ctx.fillStyle = neb; ctx.fillRect(0, 0, W, H);
        // parallax starfield
        for (i = 0; i < stars.length; i++) {
          var s = stars[i];
          var sx = ((s.x - camX * s.d) % W + W) % W, sy = ((s.y - camY * s.d) % H + H) % H;
          ctx.fillStyle = 'rgba(200,220,255,' + (0.25 + s.d * 0.9 + 0.25 * Math.sin(t * s.tw + s.ph)) + ')';
          ctx.fillRect(sx, sy, s.s, s.s);
        }
        ctx.globalCompositeOperation = 'lighter';
        // blasts (radius flash + ring)
        for (i = 0; i < blasts.length; i++) {
          var bl = blasts[i], f = bl.t / 0.5;
          ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.R * (bl.t < 0.12 ? 1 : 0.4 + f * 0.7), 0, TAU);
          if (bl.t < 0.12) { ctx.fillStyle = 'rgba(255,90,60,' + (0.22 * (1 - bl.t / 0.12) + 0.08) + ')'; ctx.fill(); glow(ctx, '#ff5a4f', 1.5, 0.8); }
          else { ctx.fillStyle = 'rgba(255,160,80,' + (0.18 * (1 - f)) + ')'; ctx.fill(); glow(ctx, '#ffd08a', 2, 1 - f); }
        }
        for (i = 0; i < shocks.length; i++) {
          var sh = shocks[i], sa = Math.max(0, 1 - sh.r / 780);
          ctx.beginPath(); ctx.arc(sh.x, sh.y, sh.r, 0, TAU); glow(ctx, POWERS.bomb.c, 3, sa);
          ctx.beginPath(); ctx.arc(sh.x, sh.y, sh.r * 0.85, 0, TAU); glow(ctx, '#ffffff', 1, sa * 0.5);
        }
        for (i = 0; i < rocks.length; i++) drawRock(ctx, rocks[i], t, 1);
        if (boss) drawBoss(ctx, pulse);
        // pickups
        for (i = 0; i < pickups.length; i++) {
          var p = pickups[i];
          if (p.life < 2.5 && Math.floor(t * 10) % 2) continue;
          drawPickupIcon(ctx, p.kind, p.x, p.y, 11 + Math.sin(t * 5 + i) * 1, 1, p.spin);
        }
        // bullets with trails
        for (i = 0; i < bullets.length; i++) {
          var b = bullets[i];
          ctx.beginPath(); ctx.moveTo(b.x - (b.vx) * 0.03, b.y - (b.vy) * 0.03); ctx.lineTo(b.x, b.y);
          glow(ctx, b.c === '#ffffff' ? ACCENT : b.c, 1.4, 0.9);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);
        }
        for (i = 0; i < eShots.length; i++) {
          var e = eShots[i];
          ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, TAU);
          ctx.fillStyle = e.c; ctx.fill(); glow(ctx, e.c, 1.2, 0.8);
        }
        if (ufo) drawUfo(ctx, ufo.x, ufo.y, t, 1);
        // particles + debris lines
        for (i = 0; i < parts.length; i++) {
          var q = parts[i], qa = q.life / q.max, qs = q.s * (0.4 + qa * 0.6);
          ctx.globalAlpha = qa; ctx.fillStyle = q.c; ctx.fillRect(q.x - qs / 2, q.y - qs / 2, qs, qs);
        }
        ctx.globalAlpha = 1;
        for (i = 0; i < lines.length; i++) {
          var l = lines[i], lc = Math.cos(l.a) * l.len / 2, ls = Math.sin(l.a) * l.len / 2;
          ctx.beginPath(); ctx.moveTo(l.x - lc, l.y - ls); ctx.lineTo(l.x + lc, l.y + ls);
          glow(ctx, l.c, 1.2, l.life / l.max);
        }
        if (ship) {
          var blink = ship.inv > 0 && !ship.shield ? (Math.floor(t * 12) % 2 ? 0.3 : 1) : 1;
          if (ship.thrust) drawFlame(ctx, ship.x, ship.y, ship.a, 1, 12 + Math.random() * 10);
          drawShipShape(ctx, ship.x, ship.y, ship.a, 1, ACCENT, blink);
          if (ship.shield) {
            ctx.beginPath();
            for (k = 0; k < 6; k++) { var ha = t * 1.5 + k / 6 * TAU; ctx.lineTo(ship.x + Math.cos(ha) * 21, ship.y + Math.sin(ha) * 21); }
            ctx.closePath();
            glow(ctx, POWERS.shield.c, 1.3, (0.6 + 0.3 * Math.sin(t * 6)) * (ship.inv > 0 && Math.floor(t * 12) % 2 ? 0.4 : 1));
          }
          if (ship.spawn > 0) { ctx.beginPath(); ctx.arc(ship.x, ship.y, 14 + ship.spawn * 70, 0, TAU); glow(ctx, ACCENT, 1.5, ship.spawn / 0.7); }
        }
        drawWarnings(ctx);
        drawHud(ctx);
        ctx.restore();
      },
      debug: function () {
        var types = { n: 0, i: 0, m: 0, x: 0 };
        for (var k = 0; k < rocks.length; k++) types[rocks[k].type]++;
        return { wave: wave, rocks: rocks.length, types: types, pickups: pickups.map(function (p) { return p.kind; }),
          boss: boss ? { hp: boss.hp, max: boss.max, phase: boss.phase, plates: boss.plates.filter(function (p) { return p.hp > 0; }).length } : null,
          power: { triple: Math.round(power.triple * 10) / 10, rapid: Math.round(power.rapid * 10) / 10, shield: !!(ship && ship.shield) },
          lives: lives, dead: !ship, over: over, ufo: !!ufo };
      }
    };

    /* ----------------------------------------------------------- render */
    function drawBoss(ctx, pulse) {
      var b = boss, k, ph = b.phase;
      var hot = ['#ff9f1c', '#ff5a2a', '#ff2b6a'][ph - 1];
      var alpha = b.dying ? 0.5 + Math.random() * 0.5 : 1;
      if (b.enter > 0) { ctx.beginPath(); ctx.arc(b.x, b.y, 80 + b.enter * 30, 0, TAU); glow(ctx, hot, 1.5, 0.3 * (Math.floor(t * 8) % 2)); }
      // core
      polyPath(ctx, b.x, b.y, CORE_R * (1 + pulse * 0.06), -b.rot * 0.5, b.pts);
      var g = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, CORE_R * 1.1);
      g.addColorStop(0, b.flash > 0 ? '#ffffff' : 'rgba(255,240,200,0.95)'); g.addColorStop(0.45, hot); g.addColorStop(1, 'rgba(60,10,20,0.6)');
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.fill(); ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, b.flash > 0 ? '#ffffff' : hot, 2, alpha);
      var dmg = Math.floor((1 - b.hp / b.max) * 6);
      if (dmg) {
        ctx.beginPath();
        for (k = 0; k < dmg; k++) { var ca = k * 1.9 - b.rot * 0.5; ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + Math.cos(ca) * CORE_R * 0.5, b.y + Math.sin(ca + 0.3) * CORE_R * 0.5); ctx.lineTo(b.x + Math.cos(ca + 0.2) * CORE_R * 0.9, b.y + Math.sin(ca + 0.2) * CORE_R * 0.9); }
        glow(ctx, '#fff3c0', 0.8, 0.7);
      }
      // armour plates
      var seg = TAU / PLATES;
      for (k = 0; k < PLATES; k++) {
        var p = b.plates[k];
        if (p.hp <= 0) continue;
        var a0 = b.rot + k * seg + seg * 0.09, a1 = b.rot + (k + 1) * seg - seg * 0.09;
        ctx.beginPath(); ctx.arc(b.x, b.y, PLATE_OUT, a0, a1); ctx.arc(b.x, b.y, PLATE_IN, a1, a0, true); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = p.flash > 0 ? '#39405a' : '#161b28'; ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, p.flash > 0 ? '#ffffff' : p.hp < 2 ? '#ffb35c' : '#a4b0c8', 1.6, alpha);
        ctx.beginPath(); ctx.arc(b.x, b.y, PLATE_OUT - 5, a0 + 0.08, a0 + 0.3); glow(ctx, '#ffffff', 1, 0.35);
      }
      // weak-point pulse ring visible through the gaps
      ctx.beginPath(); ctx.arc(b.x, b.y, CORE_R + 5 + pulse * 3, 0, TAU); glow(ctx, hot, 1, 0.25 + pulse * 0.3);
    }
    function drawUfo(ctx, x, y, tt, sc) {
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 7, 0, 0, TAU);
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(40,6,40,0.8)'; ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, UFO, 1.8 / sc, 1);
      ctx.beginPath(); ctx.ellipse(0, -6, 9, 7, 0, Math.PI, 0); glow(ctx, UFO, 1.4 / sc, 1);
      ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); glow(ctx, UFO, 1 / sc, 0.6);
      for (var k = 0; k < 4; k++) {
        ctx.fillStyle = Math.floor(tt * 6 + k) % 4 === 0 ? '#ffffff' : '#ff9fe8';
        ctx.fillRect(-13 + k * 8.5, 2, 2.5, 2.5);
      }
      ctx.restore();
    }
    // Arrows at the screen edge for rocks about to wrap in close to the ship.
    function drawWarnings(ctx) {
      if (!ship) return;
      for (var i = 0; i < rocks.length; i++) {
        var r = rocks[i];
        if (r.x > 0 && r.x < W && r.y > 0 && r.y < H) continue;
        var p = { x: r.x, y: r.y }, eta = -1;
        for (var s = 1; s <= 12; s++) {
          p.x += r.vx * 0.1; p.y += r.vy * 0.1; wrap(p);
          if (p.x > 0 && p.x < W && p.y > 0 && p.y < H) { eta = s * 0.1; break; }
        }
        if (eta < 0) continue;
        var d = Math.sqrt(dist2(p, ship));
        if (d > 200) continue;
        var u = U.clamp((1.3 - eta) * (1.2 - d / 200), 0, 1), wa = (0.55 + u * 0.45) * (0.7 + 0.3 * Math.sin(t * 18));
        ctx.save();
        ctx.translate(U.clamp(p.x, 12, W - 12), U.clamp(p.y, 12, H - 12));
        ctx.rotate(Math.atan2(r.vy, r.vx));
        ctx.scale(1 + u * 0.4, 1 + u * 0.4);
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-6, -8); ctx.lineTo(-2, 0); ctx.lineTo(-6, 8); ctx.closePath();
        ctx.fillStyle = TYPES[r.type].c; ctx.globalAlpha = wa; ctx.fill(); glow(ctx, '#ff5a4f', 2, wa); glow(ctx, '#ffffff', 0.8, wa * 0.6);
        ctx.restore();
      }
    }
    function drawHud(ctx) {
      var k;
      for (k = 0; k < lives; k++) drawShipShape(ctx, 18 + k * 18, 18, -Math.PI / 2, 0.6, ACCENT, 0.9);
      var hx = W - 20, act = [];
      if (power.triple > 0) act.push(['triple', power.triple / POWERS.triple.time]);
      if (power.rapid > 0) act.push(['rapid', power.rapid / POWERS.rapid.time]);
      if (ship && ship.shield) act.push(['shield', 1]);
      for (k = 0; k < act.length; k++) {
        var x = hx - k * 32, fr = act[k][1], warn = fr < 0.25 && Math.floor(t * 8) % 2;
        drawPickupIcon(ctx, act[k][0], x, 20, 9, warn ? 0.35 : 1, 0);
        ctx.beginPath(); ctx.arc(x, 20, 13, -Math.PI / 2, -Math.PI / 2 + fr * TAU);
        glow(ctx, POWERS[act[k][0]].c, 1.5, 0.9);
      }
      if (boss) {
        var bw = 240, bx = W / 2 - bw / 2, by = 16, f = boss.hp / boss.max;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(10,12,24,0.85)'; ctx.fillRect(bx - 2, by - 2, bw + 4, 10);
        var g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
        g.addColorStop(0, '#ff2b6a'); g.addColorStop(0.5, '#ff5a2a'); g.addColorStop(1, '#ffd23f');
        ctx.fillStyle = boss.flash > 0 ? '#ffffff' : g; ctx.fillRect(bx, by, bw * f, 6);
        ctx.fillStyle = '#03040c'; ctx.fillRect(bx + bw * 0.33, by, 2, 6); ctx.fillRect(bx + bw * 0.66, by, 2, 6);
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.rect(bx - 2, by - 2, bw + 4, 10); glow(ctx, '#ff5a2a', 1, 0.7);
        U.glowText(ctx, 'ROCK CORE MK ' + bossN + (boss.phase > 1 ? '  P' + boss.phase : ''), W / 2, by + 20, 8, '#ffb35c');
      }
      if (bannerT > 0) {
        var ba = Math.min(1, bannerT * 2), big = banner === 'WARNING';
        ctx.globalAlpha = big && Math.floor(t * 6) % 2 ? ba * 0.4 : ba;
        U.glowText(ctx, banner, W / 2, H / 2 - 70, big ? 22 : 18, big || banner.indexOf('CORE') >= 0 || banner.indexOf('ARMOUR') >= 0 ? '#ff5a4f' : ACCENT);
        if (banner2) U.glowText(ctx, banner2, W / 2, H / 2 - 42, 10, big ? '#ffb35c' : '#ffd23f');
        ctx.globalAlpha = 1;
      }
    }
  }

  /* ------------------------------------------------------------ attract */
  var ATTRACT = [
    { x: 0.18, y: 0.28, r: 0.13, s: 0.3, v: 1, type: 'n' }, { x: 0.78, y: 0.24, r: 0.09, s: -0.5, v: -1, type: 'i' },
    { x: 0.68, y: 0.76, r: 0.12, s: 0.2, v: 1, type: 'm' }, { x: 0.28, y: 0.78, r: 0.07, s: 0.8, v: -1, type: 'x' },
    { x: 0.9, y: 0.55, r: 0.05, s: -0.9, v: 1, type: 'n' }
  ];
  var APTS = [0.9, 1.02, 0.8, 0.95, 1.05, 0.78, 0.97, 0.86, 1.03, 0.82];
  function attract(ctx, w, h, t) {
    ctx.save();
    ctx.fillStyle = '#03040c';
    ctx.fillRect(0, 0, w, h);
    var k, sc = h / 300;
    for (k = 0; k < 60; k++) {
      var sx = ((k * 97.3 - t * (4 + (k % 3) * 6)) % w + w) % w, sy = (k * 53.7) % h;
      ctx.fillStyle = 'rgba(200,220,255,' + (0.3 + 0.3 * Math.sin(t * 2 + k)) + ')';
      ctx.fillRect(sx, sy, k % 3 === 2 ? 1.6 : 1, k % 3 === 2 ? 1.6 : 1);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (k = 0; k < ATTRACT.length; k++) {
      var a = ATTRACT[k], rad = a.r * h;
      var rk = { x: ((a.x * w + t * 14 * a.v) % (w + 2 * rad) + w + 2 * rad) % (w + 2 * rad) - rad, y: a.y * h, r: rad, rot: t * a.s,
        pts: APTS, type: a.type, hp: a.type === 'm' ? 3 : 1, maxhp: a.type === 'm' ? 4 : 1, flash: 0, ph: k };
      drawRock(ctx, rk, t, 1);
    }
    // ship turning, thrusting and firing
    var sa = t * 0.8;
    drawFlame(ctx, w / 2, h / 2, sa, sc, 14 + Math.sin(t * 40) * 5);
    drawShipShape(ctx, w / 2, h / 2, sa, sc, ACCENT, 1);
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(sa);
    for (k = 1; k < 4; k++) {
      var bx = (20 + ((t * 200 + k * 40) % 140)) * sc;
      ctx.beginPath(); ctx.moveTo(bx - 10 * sc, 0); ctx.lineTo(bx, 0); glow(ctx, ACCENT, 1.4, 0.9);
    }
    ctx.restore();
    drawPickupIcon(ctx, ['triple', 'shield', 'rapid', 'bomb'][Math.floor(t / 2) % 4], w * 0.5, h * 0.2, 9 * sc, 0.6 + 0.4 * Math.sin(t * 5), t);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_rock_drift',
    order: 7,
    title: 'Nakamoto Drift',
    tagline: 'Thrust, turn, split the rocks.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'ship',
    controls: '\u2190\u2192 turn \u00b7 \u2191 thrust \u00b7 Space fire (hold to auto-fire)',
    create: create,
    attract: attract
  });
})(window);

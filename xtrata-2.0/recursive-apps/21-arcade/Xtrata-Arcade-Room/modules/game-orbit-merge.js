/*
 * Xtrata Arcade cartridge #4 - ORBIT MERGE (v2)
 * Drop planets into the jar. Two of the same kind touching merge into the
 * next size up; keep the jar below the red line. Grow a SUN and it goes
 * supernova: the jar is cleared, every body scores, and you level up into a
 * new sky. Specials turn up in the queue now and then: BOMB, TREMOR, STARDUST.
 *
 * Music: slow F lydian space pads. Jar fill -> intensity, the danger line
 * closes the filter, merges play lower notes for bigger planets and climb
 * with the chain, every level modulates, a supernova is a riser + stinger.
 *
 * Contract game-id: xa_orbit_merge (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-orbit-merge');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 420, H = 600, TAU = Math.PI * 2;
  var LEFT = 26, RIGHT = W - 26, FLOOR = H - 22, DANGER = 118, DROP_Y = 64, GRACE = 2.2;
  var ACCENT = '#b98cff', SS = 2, VMAX = 1300;
  // k = surface look; base/dark/light = palette used by the painter
  var TIERS = [
    { r: 13, c: '#c3c9dc', n: 'Moon', k: 'rock', base: '#9aa0b4', dark: '#50556a', light: '#e4e7f2' },
    { r: 18, c: '#ffb3cf', n: 'Pluto', k: 'ice', base: '#ecd3dd', dark: '#8a5a6e', light: '#ffffff' },
    { r: 24, c: '#ffcf70', n: 'Mercury', k: 'rock', base: '#c29a62', dark: '#6e4f2a', light: '#f3d9a4' },
    { r: 31, c: '#ff7b5c', n: 'Mars', k: 'mars', base: '#c65a3a', dark: '#7a2c1b', light: '#f3a47c' },
    { r: 38, c: '#ffa040', n: 'Io', k: 'lava', base: '#3b2420', dark: '#1a0f0d', light: '#ffd35a' },
    { r: 46, c: '#4db4ff', n: 'Earth', k: 'ocean', base: '#1f6fd1', dark: '#0d3a86', light: '#4fbf6c' },
    { r: 55, c: '#7d8cff', n: 'Neptune', k: 'gas', base: '#4a66e6', dark: '#2a3aa6', light: '#a9c0ff', spot: '#18206e' },
    { r: 64, c: '#ffd89a', n: 'Saturn', k: 'gas', ring: true, base: '#e3c088', dark: '#b08750', light: '#fff1cc' },
    { r: 74, c: '#ff9d6b', n: 'Jupiter', k: 'gas', base: '#e2ab7c', dark: '#9a5836', light: '#fbe8cf', spot: '#c4502e' },
    { r: 86, c: '#ffe36e', n: 'Sun', k: 'sun' }
  ];
  var SUN = TIERS.length - 1, ROLL = { rock: 1, mars: 1, ice: 1, lava: 1 };
  var POINTS = TIERS.map(function (_, i) { return (i + 1) * (i + 2) / 2 * 2; }); // 2,6,12,20...
  var SPECIAL = {
    bomb: { r: 15, c: '#ff4d6d', label: 'BOMB', desc: 'BLASTS SMALL PLANETS' },
    wild: { r: 12, c: '#fff4a8', label: 'STARDUST', desc: 'UPGRADES WHAT IT TOUCHES' },
    tremor: { r: 14, c: '#ffb347', label: 'TREMOR', desc: 'SHAKES THE JAR ON DROP' }
  };
  var HUES = [262, 200, 318, 160, 28, 232, 345];
  var KEYS = [0, 2, -3, 5, -1, 3, 7];
  var WEIGHTS = [[34, 28, 20, 13, 5], [30, 28, 22, 13, 7], [36, 24, 18, 14, 8], [28, 26, 24, 14, 8]];
  var G = 1500, SUB = 4;

  // Soundtrack: slow, dreamy lydian drift; drums only arrive as the jar fills.
  function song() {
    return {
      bpm: 76, key: 53, scale: 'lydian', chords: [0, 1, 0, 4], barsPerChord: 2, seed: 41,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.36, chord: true, octave: -1, params: { cutoff: 900, attack: 1.2, release: 1.6 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 4, steps: 32 }, { deg: 6, steps: 32 }] : null; } },
        { name: 'bells', inst: 'bell', layer: 0, gain: 0.3, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.22 ? { deg: [0, 2, 3, 4, 6, 7][Math.floor(i.rng() * 6)], vel: 0.5 + i.rng() * 0.3 } : null; } },
        { name: 'shaker', inst: 'shaker', layer: 0.18, gain: 0.3, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'sub', inst: 'sub', layer: 0.3, gain: 0.45, chord: true, octave: -2, pattern: '0 - - - - - - - . . 4 - - - . .' },
        { name: 'marimba', inst: 'marimba', layer: 0.45, gain: 0.32, chord: true, rate: 2,
          fn: function (i) { return [0, 4, 2, 6, 4, 7, 2, 4][(i.step / 2) % 8]; } },
        { name: 'kick', inst: 'kick', layer: 0.65, gain: 0.45, pattern: 'x.........x.....' },
        { name: 'rim', inst: 'clap', layer: 0.8, gain: 0.3, pattern: '........x.......' }
      ]
    };
  }

  /* ------------------------------------------------------ helpers */
  function mkCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function disc(g, x, y, r) { g.beginPath(); g.arc(x, y, Math.max(0.1, r), 0, TAU); g.fill(); }
  function blob(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, TAU); g.fill(); }
  function inDisc(vr, r, k) { var a = vr() * TAU, m = Math.sqrt(vr()) * r * k; return [Math.cos(a) * m, Math.sin(a) * m]; }
  function wave(g, r, y0, amp, freq, ph, x0, x1) {
    g.beginPath();
    for (var x = x0; x <= x1 + 0.01; x += r / 10) {
      var y = y0 + Math.sin(x / r * freq + ph) * amp;
      if (x === x0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }

  /* ---------------------------------------------- planet painting */
  function surface(g, d, r, vr) {
    var i, p, k;
    if (d.k === 'sun') {
      var sg = g.createRadialGradient(0, 0, 0, 0, 0, r);
      sg.addColorStop(0, '#fffbe8'); sg.addColorStop(0.35, '#fff0a0'); sg.addColorStop(0.72, '#ffc84a'); sg.addColorStop(1, '#ff8a2a');
      g.fillStyle = sg; g.fillRect(-r, -r, 2 * r, 2 * r);
      for (i = 0; i < 110; i++) { p = inDisc(vr, r, 0.97); g.fillStyle = vr() < 0.5 ? 'rgba(255,248,200,0.28)' : 'rgba(255,140,40,0.22)'; disc(g, p[0], p[1], r * (0.02 + vr() * 0.05)); }
      g.fillStyle = 'rgba(160,70,20,0.55)'; disc(g, r * 0.3, r * 0.15, r * 0.05); disc(g, r * 0.38, r * 0.2, r * 0.03); disc(g, -r * 0.4, -r * 0.3, r * 0.04);
      return;
    }
    g.fillStyle = d.base; g.fillRect(-r, -r, 2 * r, 2 * r);
    if (d.k === 'rock' || d.k === 'mars') {
      for (i = 0; i < 16; i++) { p = inDisc(vr, r, 1); g.fillStyle = rgba(vr() < 0.5 ? d.dark : d.light, 0.14 + vr() * 0.12); blob(g, p[0], p[1], r * (0.15 + vr() * 0.4), r * (0.1 + vr() * 0.3), vr() * 3); }
      if (d.k === 'mars') {
        g.fillStyle = rgba(d.dark, 0.45);
        blob(g, -r * 0.2, r * 0.05, r * 0.45, r * 0.16, 0.4); blob(g, r * 0.35, -r * 0.25, r * 0.22, r * 0.12, -0.3);
        g.fillStyle = 'rgba(255,250,245,0.92)'; blob(g, 0, -r * 0.94, r * 0.5, r * 0.2); blob(g, r * 0.1, r * 0.96, r * 0.36, r * 0.13);
      }
      var n = d.k === 'mars' ? 4 : 5 + Math.floor(r / 5);
      for (i = 0; i < n; i++) {
        p = inDisc(vr, r, 0.85); k = r * (0.07 + vr() * 0.15);
        g.fillStyle = rgba(d.dark, 0.5); disc(g, p[0], p[1], k);
        g.fillStyle = rgba(d.dark, 0.35); disc(g, p[0] - k * 0.2, p[1] - k * 0.2, k * 0.72);
        g.strokeStyle = rgba(d.light, 0.6); g.lineWidth = Math.max(0.7, k * 0.24);
        g.beginPath(); g.arc(p[0], p[1], k, -0.4, 2.0); g.stroke();
      }
    } else if (d.k === 'ice') {
      for (i = 0; i < 10; i++) { p = inDisc(vr, r, 1); g.fillStyle = rgba(d.dark, 0.12); blob(g, p[0], p[1], r * 0.3, r * 0.2, vr() * 3); }
      g.fillStyle = rgba(d.dark, 0.6); blob(g, -r * 0.62, r * 0.12, r * 0.42, r * 0.7, 0.3);
      g.fillStyle = 'rgba(255,252,250,0.95)';
      disc(g, r * 0.1, -r * 0.08, r * 0.25); disc(g, r * 0.44, -r * 0.05, r * 0.23);
      g.beginPath(); g.moveTo(-r * 0.14, 0); g.lineTo(r * 0.67, r * 0.02); g.lineTo(r * 0.3, r * 0.52); g.fill();
      g.strokeStyle = 'rgba(140,180,255,0.6)'; g.lineWidth = 0.8;
      for (i = 0; i < 6; i++) {
        p = inDisc(vr, r, 0.8); var a = vr() * TAU;
        g.beginPath(); g.moveTo(p[0], p[1]);
        for (k = 0; k < 4; k++) { a += (vr() - 0.5) * 1.4; p[0] += Math.cos(a) * r * 0.22; p[1] += Math.sin(a) * r * 0.22; g.lineTo(p[0], p[1]); }
        g.stroke();
      }
    } else if (d.k === 'lava') {
      for (i = 0; i < 14; i++) { p = inDisc(vr, r, 1); g.fillStyle = vr() < 0.5 ? rgba(d.dark, 0.5) : 'rgba(110,62,40,0.35)'; blob(g, p[0], p[1], r * (0.12 + vr() * 0.3), r * (0.1 + vr() * 0.2), vr() * 3); }
      g.fillStyle = 'rgba(232,195,80,0.22)';
      for (i = 0; i < 5; i++) { p = inDisc(vr, r, 0.9); blob(g, p[0], p[1], r * 0.2, r * 0.12, vr() * 3); }
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (i = 0; i < 9; i++) {
        var pts = [], q = inDisc(vr, r, 0.9), an = vr() * TAU;
        pts.push([q[0], q[1]]);
        for (k = 0; k < 5; k++) { an += (vr() - 0.5) * 1.6; q = [q[0] + Math.cos(an) * r * 0.2, q[1] + Math.sin(an) * r * 0.2]; pts.push(q); }
        [[r * 0.11, 'rgba(255,100,30,0.35)'], [r * 0.045, '#ffb13a'], [r * 0.018, '#fff2a0']].forEach(function (s) {
          g.lineWidth = s[0]; g.strokeStyle = s[1]; g.beginPath();
          pts.forEach(function (pt, j) { if (j) g.lineTo(pt[0], pt[1]); else g.moveTo(pt[0], pt[1]); });
          g.stroke();
        });
      }
      for (i = 0; i < 4; i++) {
        p = inDisc(vr, r, 0.75); k = r * (0.08 + vr() * 0.08);
        var pg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], k);
        pg.addColorStop(0, '#fff6b0'); pg.addColorStop(0.5, '#ff8a2a'); pg.addColorStop(1, 'rgba(255,80,20,0)');
        g.fillStyle = pg; disc(g, p[0], p[1], k);
      }
    } else if (d.k === 'ocean') {
      for (i = 0; i < 10; i++) { p = inDisc(vr, r, 1); g.fillStyle = rgba(d.dark, 0.3); blob(g, p[0], p[1], r * 0.35, r * 0.22, vr() * 3); }
      for (i = 0; i < 4; i++) {
        var cx = inDisc(vr, r, 0.72), bits = [];
        for (k = 0; k < 7; k++) bits.push([cx[0] + (vr() - 0.5) * r * 0.45, cx[1] + (vr() - 0.5) * r * 0.32, r * (0.07 + vr() * 0.13)]);
        g.fillStyle = '#d8c48a'; bits.forEach(function (b) { disc(g, b[0], b[1], b[2] + r * 0.025); });
        g.fillStyle = i % 2 ? '#3fae62' : '#5cc46e'; bits.forEach(function (b) { disc(g, b[0], b[1], b[2]); });
      }
      g.fillStyle = 'rgba(245,250,255,0.9)'; blob(g, 0, -r * 0.97, r * 0.55, r * 0.16); blob(g, 0, r * 0.98, r * 0.5, r * 0.14);
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineCap = 'round';
      for (i = 0; i < 7; i++) {
        g.lineWidth = r * (0.03 + vr() * 0.05);
        var x0 = -r + vr() * r, x1 = x0 + r * (0.5 + vr() * 1.1);
        wave(g, r, (vr() * 2 - 1) * r * 0.85, r * 0.05, 5, vr() * 6, x0, Math.min(r, x1));
      }
    } else if (d.k === 'gas') {
      var cols = [d.base, d.dark, d.light], y = -r;
      while (y < r) {
        var hh = r * (0.07 + vr() * 0.15);
        g.fillStyle = rgba(cols[Math.floor(vr() * 3)], 0.45 + vr() * 0.45);
        g.fillRect(-r, y, 2 * r, hh + 0.5);
        y += hh;
      }
      g.lineWidth = Math.max(0.8, r * 0.025);
      for (i = 0; i < 12; i++) {
        g.strokeStyle = rgba(vr() < 0.5 ? d.dark : d.light, 0.35);
        wave(g, r, (vr() * 2 - 1) * r, r * 0.03, 7, vr() * 6, -r, r);
      }
      if (d.spot) {
        var sx = d.ring ? 0 : r * 0.3, sy = d.spot === '#18206e' ? -r * 0.22 : r * 0.36;
        g.fillStyle = d.spot; blob(g, sx, sy, r * 0.25, r * 0.14);
        g.fillStyle = 'rgba(255,255,255,0.2)'; blob(g, sx - r * 0.03, sy - r * 0.02, r * 0.14, r * 0.07);
        g.strokeStyle = rgba(d.light, 0.5); g.lineWidth = r * 0.025;
        g.beginPath(); g.ellipse(sx, sy, r * 0.28, r * 0.17, 0, 0, TAU); g.stroke();
      }
    }
  }
  function shade(g, d, r) {
    if (d.k === 'sun') {
      var sg = g.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
      sg.addColorStop(0, 'rgba(255,255,240,0.45)'); sg.addColorStop(0.5, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,110,20,0.3)');
      g.fillStyle = sg; disc(g, 0, 0, r);
      return;
    }
    var hg = g.createRadialGradient(-r * 0.42, -r * 0.48, r * 0.04, -r * 0.15, -r * 0.18, r * 1.28);
    hg.addColorStop(0, 'rgba(255,255,255,0.42)');
    hg.addColorStop(0.22, 'rgba(255,255,255,0.08)');
    hg.addColorStop(0.55, 'rgba(6,4,24,0.04)');
    hg.addColorStop(0.85, 'rgba(6,4,24,0.5)');
    hg.addColorStop(1, 'rgba(3,2,14,0.85)');
    g.fillStyle = hg; disc(g, 0, 0, r);
    g.lineWidth = Math.max(1.2, r * 0.06); g.strokeStyle = rgba(d.c, 0.55);
    g.beginPath(); g.arc(0, 0, r - g.lineWidth / 2, -0.2, 1.9); g.stroke();
    g.lineWidth = 1; g.strokeStyle = 'rgba(255,255,255,0.28)';
    g.beginPath(); g.arc(0, 0, r - 0.5, 3.5, 4.8); g.stroke();
  }
  function rings(g, r, back) {
    g.save();
    g.rotate(-0.32);
    g.beginPath();
    if (back) g.rect(-3 * r, -3 * r, 6 * r, 3 * r); else g.rect(-3 * r, 0, 6 * r, 3 * r);
    g.clip();
    [[1.2, 0.1, '#b89462', 0.55], [1.31, 0.13, '#f3dcaa', 0.85], [1.41, 0.06, '#d8bd8c', 0.6], [1.47, 0.05, '#a88c68', 0.4]].forEach(function (b) {
      g.strokeStyle = rgba(b[2], back ? b[3] * 0.75 : b[3]); g.lineWidth = b[1] * r * 0.55;
      g.beginPath(); g.ellipse(0, 0, b[0] * r, b[0] * r * 0.3, 0, 0, TAU); g.stroke();
    });
    g.restore();
  }
  // Each tier is painted once. Banded worlds are a single composite image;
  // rocky worlds keep a tight surface layer (rotated as they roll) plus one
  // fixed layer holding the glow, lighting and rim.
  var ART = [], THUMB = {};
  function tierArt(i) {
    if (ART[i]) return ART[i];
    var d = TIERS[i], r = d.r, roll = !!ROLL[d.k];
    var pad = d.k === 'sun' ? r * 0.85 : d.ring ? r * 0.55 : Math.max(8, r * 0.3);
    var half = r + pad, D = half * 2;
    var vr = U.rng(7717 + i * 131);
    function layer(hw, fn) { var px = Math.ceil(hw * 2 * SS), c = mkCanvas(px, px), g = c.getContext('2d'); g.scale(px / hw / 2, px / hw / 2); g.translate(hw, hw); fn(g); return c; }
    function glow(g) {
      var gl = g.createRadialGradient(0, 0, r, 0, 0, half), sun = d.k === 'sun';
      gl.addColorStop(0, rgba(d.c, sun ? 0.7 : 0.35));
      gl.addColorStop(0.3, rgba(d.c, sun ? 0.3 : 0.1));
      gl.addColorStop(1, rgba(d.c, 0));
      g.fillStyle = gl; g.beginPath(); g.arc(0, 0, half, 0, TAU); g.arc(0, 0, r - 0.5, 0, TAU, true); g.fill();
    }
    function body(g) { g.save(); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.clip(); surface(g, d, r, vr); g.restore(); }
    var art = { half: half, D: D, r: r };
    if (roll) {
      art.body = layer(r, body);
      art.over = layer(half, function (g) { glow(g); shade(g, d, r); });
    } else {
      art.one = layer(half, function (g) { glow(g); if (d.ring) rings(g, r, true); body(g); shade(g, d, r); if (d.ring) rings(g, r, false); });
    }
    ART[i] = art;
    return art;
  }
  // o: { ang, sq, sqAng, sc, alpha }
  function drawPlanet(ctx, x, y, tier, o) {
    var a = tierArt(tier), h = a.half, D = a.D, r = a.r;
    o = o || {};
    ctx.save();
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.translate(x, y);
    if (o.sc && o.sc !== 1) ctx.scale(o.sc, o.sc);
    if (o.sq) { ctx.rotate(o.sqAng); ctx.scale(1 - o.sq, 1 + o.sq * 0.55); ctx.rotate(-o.sqAng); }
    if (a.one) ctx.drawImage(a.one, -h, -h, D, D);
    else {
      if (o.ang) ctx.rotate(o.ang);
      ctx.drawImage(a.body, -r, -r, 2 * r, 2 * r);
      if (o.ang) ctx.rotate(-o.ang);
      ctx.drawImage(a.over, -h, -h, D, D);
    }
    ctx.restore();
  }
  // Small planets (queue preview, tier ladder) cached at display size.
  function drawThumb(ctx, x, y, tier, dr, alpha) {
    var key = tier + '_' + dr, c = THUMB[key], a = tierArt(tier), sc = dr / a.r, hw = a.half * sc;
    if (!c) {
      c = THUMB[key] = mkCanvas(Math.ceil(hw * 2 * SS), Math.ceil(hw * 2 * SS));
      var g = c.getContext('2d'); g.scale(SS, SS);
      drawPlanet(g, hw, hw, tier, { sc: sc });
    }
    if (alpha != null) ctx.globalAlpha = alpha;
    ctx.drawImage(c, x - hw, y - hw, hw * 2, hw * 2);
    ctx.globalAlpha = 1;
  }
  function drawSun(ctx, x, y, t, sc) {
    var r = TIERS[SUN].r * (sc || 1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(x, y);
    ctx.rotate(t * 0.25);
    for (var i = 0; i < 12; i++) {
      var len = r * (1.28 + 0.12 * Math.sin(t * 3 + i * 1.7));
      ctx.fillStyle = 'rgba(255,190,80,0.16)';
      ctx.beginPath(); ctx.moveTo(Math.cos(i * TAU / 12 - 0.08) * r * 0.9, Math.sin(i * TAU / 12 - 0.08) * r * 0.9);
      ctx.lineTo(Math.cos(i * TAU / 12) * len, Math.sin(i * TAU / 12) * len);
      ctx.lineTo(Math.cos(i * TAU / 12 + 0.08) * r * 0.9, Math.sin(i * TAU / 12 + 0.08) * r * 0.9); ctx.fill();
    }
    ctx.restore();
  }
  function star4(ctx, R, r0) {
    ctx.beginPath();
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, m = i % 2 ? r0 : R; if (i) ctx.lineTo(Math.cos(a) * m, Math.sin(a) * m); else ctx.moveTo(m, 0); }
    ctx.closePath(); ctx.fill();
  }
  function drawSpecial(ctx, sp, x, y, t, sc, ang) {
    var r = SPECIAL[sp].r, k, blink = 0.5 + 0.5 * Math.sin(t * 10);
    ctx.save();
    ctx.translate(x, y);
    if (sc && sc !== 1) ctx.scale(sc, sc);
    if (sp === 'bomb') {
      ctx.fillStyle = rgba('#ff4d6d', 0.14 + 0.2 * blink); disc(ctx, 0, 0, r + 6);
      ctx.rotate(ang || 0);
      var bg = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 1, 0, 0, r);
      bg.addColorStop(0, '#7a809e'); bg.addColorStop(0.55, '#262a3f'); bg.addColorStop(1, '#0b0c15');
      ctx.fillStyle = bg; disc(ctx, 0, 0, r);
      ctx.strokeStyle = 'rgba(255,77,109,' + (0.55 + 0.45 * blink) + ')'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#9aa0bc'; ctx.fillRect(-3.5, -r - 3, 7, 5);
      ctx.strokeStyle = '#d9c89a'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(0, -r - 3); ctx.quadraticCurveTo(r * 0.2, -r - 11, r * 0.65, -r - 8); ctx.stroke();
      ctx.fillStyle = '#fff3b0'; disc(ctx, r * 0.65, -r - 8, 1.8 + blink * 1.6);
      ctx.fillStyle = 'rgba(255,170,60,0.7)'; disc(ctx, r * 0.65, -r - 8, 3.5 + blink * 2.5);
    } else if (sp === 'wild') {
      var hue = (t * 120) % 360;
      var hg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
      hg.addColorStop(0, 'rgba(255,255,255,0.95)'); hg.addColorStop(0.3, 'hsla(' + hue + ',100%,75%,0.6)'); hg.addColorStop(1, 'hsla(' + hue + ',100%,70%,0)');
      ctx.fillStyle = hg; disc(ctx, 0, 0, r * 2);
      ctx.save(); ctx.rotate(t * 1.5 + (ang || 0)); ctx.fillStyle = 'rgba(255,255,255,0.95)'; star4(ctx, r * 1.3, r * 0.28); ctx.restore();
      ctx.save(); ctx.rotate(-t * 1.1 + 0.4); ctx.fillStyle = 'hsla(' + (hue + 180) + ',100%,80%,0.7)'; star4(ctx, r * 0.9, r * 0.22); ctx.restore();
      for (k = 0; k < 5; k++) {
        var a = t * 2.2 + k * TAU / 5;
        ctx.fillStyle = 'hsl(' + (hue + k * 70) + ',100%,72%)';
        disc(ctx, Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.35, 1.8);
      }
    } else {
      ctx.fillStyle = rgba('#ffb347', 0.18 + 0.15 * blink); disc(ctx, 0, 0, r + 5);
      var tg = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r);
      tg.addColorStop(0, '#6a4a22'); tg.addColorStop(1, '#221507');
      ctx.fillStyle = tg; disc(ctx, 0, 0, r);
      ctx.strokeStyle = '#ffb347'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r - 1, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#fff3d6'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (k = 0; k <= 8; k++) {
        var px = -r * 0.72 + k * r * 0.18, py = (k % 2 ? -1 : 1) * r * (k === 0 || k === 8 ? 0 : 0.25 + 0.3 * Math.abs(Math.sin(k * 1.9 + t * 8)));
        if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawItem(ctx, it, x, y, t, sc, alpha) {
    if (it.sp) { ctx.save(); if (alpha != null) ctx.globalAlpha = alpha; drawSpecial(ctx, it.sp, x, y, t, sc); ctx.restore(); }
    else if (sc < 1) drawThumb(ctx, x, y, it.tier, Math.round(it.tier >= 0 ? TIERS[it.tier].r * sc : 8), alpha);
    else drawPlanet(ctx, x, y, it.tier, { sc: sc, alpha: alpha });
  }

  /* ------------------------------------------------- scenery */
  var JX0 = LEFT - 14, JY0 = DANGER - 52, JW = RIGHT - LEFT + 28, JH = FLOOR - JY0 + 14, JTOP = DANGER - 40;
  function jarPath(g) {
    var rad = 14, l = LEFT - 1.5, rt = RIGHT + 1.5, f = FLOOR + 1.5;
    g.beginPath(); g.moveTo(l, JTOP); g.lineTo(l, f - rad); g.quadraticCurveTo(l, f, l + rad, f);
    g.lineTo(rt - rad, f); g.quadraticCurveTo(rt, f, rt, f - rad); g.lineTo(rt, JTOP);
  }
  function buildJar(hue) {
    var acc = 'hsl(' + hue + ',95%,78%)';
    function layer(x0, w, fn) { var c = mkCanvas(w * SS, JH * SS), g = c.getContext('2d'); g.scale(SS, SS); g.translate(-x0, -JY0); fn(g); return c; }
    return {
      back: layer(JX0, JW, function (g) {
        jarPath(g); g.closePath();
        var gl = g.createLinearGradient(LEFT, 0, RIGHT, 0);
        gl.addColorStop(0, 'rgba(255,255,255,0.08)'); gl.addColorStop(0.08, 'rgba(255,255,255,0.025)'); gl.addColorStop(0.5, 'rgba(255,255,255,0.01)');
        gl.addColorStop(0.92, 'rgba(255,255,255,0.02)'); gl.addColorStop(1, 'rgba(255,255,255,0.07)');
        g.fillStyle = gl; g.fill();
        var tint = g.createLinearGradient(0, JTOP, 0, FLOOR);
        tint.addColorStop(0, 'hsla(' + hue + ',80%,60%,0)'); tint.addColorStop(1, 'hsla(' + hue + ',80%,60%,0.12)');
        g.fillStyle = tint; g.fill();
        jarPath(g); g.strokeStyle = acc; g.lineWidth = 3; g.shadowColor = acc; g.shadowBlur = 14; g.stroke();
        g.shadowBlur = 0;
        g.beginPath(); g.moveTo(LEFT - 10, JTOP - 5); g.lineTo(LEFT - 1.5, JTOP); g.moveTo(RIGHT + 10, JTOP - 5); g.lineTo(RIGHT + 1.5, JTOP); g.stroke();
        jarPath(g); g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1; g.stroke();
      }),
      // front glass highlights: two thin strips, blitted over the bodies
      left: layer(LEFT + 2, 14, function (g) { frontGlass(g, true); }),
      right: layer(RIGHT - 10, 6, function (g) { frontGlass(g, false); })
    };
  }
  function frontGlass(g, left) {
        var s = g.createLinearGradient(0, JTOP, 0, FLOOR);
        s.addColorStop(0, 'rgba(255,255,255,0.18)'); s.addColorStop(0.7, 'rgba(255,255,255,0.03)'); s.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = s;
        if (left) {
          U.roundRect(g, LEFT + 4, JTOP + 12, 4, FLOOR - JTOP - 50, 2); g.fill();
          U.roundRect(g, LEFT + 12, JTOP + 34, 2, (FLOOR - JTOP) * 0.45, 1); g.fill();
        } else { g.globalAlpha = 0.6; U.roundRect(g, RIGHT - 9, JTOP + 70, 3, (FLOOR - JTOP) * 0.32, 1.5); g.fill(); }
  }
  function buildSky(level, seed) {
    var hue = HUES[(level - 1) % HUES.length], vr = U.rng((seed + level * 7919) >>> 0);
    var c = mkCanvas(W * SS, H * SS), g = c.getContext('2d');
    g.scale(SS, SS);
    var bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'hsl(' + hue + ',55%,10%)'); bg.addColorStop(1, 'hsl(' + (hue + 30) + ',60%,3%)');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 8; i++) {
      var x = vr() * W, y = vr() * H, r = 110 + vr() * 170;
      var ng = g.createRadialGradient(x, y, 0, x, y, r);
      ng.addColorStop(0, 'hsla(' + (hue + (vr() - 0.5) * 80) + ',85%,58%,' + (0.08 + vr() * 0.1) + ')');
      ng.addColorStop(1, 'hsla(' + hue + ',80%,50%,0)');
      g.fillStyle = ng; g.fillRect(0, 0, W, H);
    }
    for (i = 0; i < 140; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.12 + vr() * 0.4) + ')'; g.fillRect(vr() * W, vr() * H, 0.8, 0.8); }
    var jar = buildJar(hue);
    g.drawImage(jar.back, JX0, JY0, JW, JH);           // sky + jar glass = one blit per frame
    return { canvas: c, hue: hue, jar: jar };
  }

  /* ------------------------------------------------------ game */
  function create(api) {
    var rng = api.rng;                                       // gameplay only
    var vis = U.rng((api.seed ^ 0x5bd1e995) >>> 0);         // visuals only
    var orbs = [], pend = [], rings2 = [];
    var nextId = 1, level = 1, drops = 0;
    var aimX = W / 2, lastMoved = api.pointer().moved;
    var sinceSp = 0, spGap = 12 + rng.int(7), seen = {}, caption = null;
    var cur, queue = [];
    var cooldown = 0, dangerT = 0, dangerX = W / 2, nearV = 0;
    var chain = 0, chainT = 0, best = 0;
    var over = false, overT = 0, nova = null, tremor = 0, tremorPh = 0;
    var flashT = 0, bannerT = 0, t = 0;
    var musicQ = -1, musicTense = false;
    var sky = buildSky(1, api.seed), oldSky = null, skyBlend = 1;
    var stars = [];
    for (var i = 0; i < 70; i++) stars.push({ x: vis() * W, y: vis() * H, s: vis() * 1.4 + 0.4, p: vis() * 6, z: [0.3, 0.6, 1][i % 3] });

    function pickTier() {
      var w = WEIGHTS[(level - 1) % WEIGHTS.length], tot = 0, k;
      for (k = 0; k < w.length; k++) tot += w[k];
      var r = rng() * tot;
      for (k = 0; k < w.length; k++) { r -= w[k]; if (r < 0) return k; }
      return 0;
    }
    function gen() {
      var prev = queue.length ? queue[queue.length - 1] : cur;
      sinceSp++;
      if (sinceSp >= spGap && !(prev && prev.sp)) {
        sinceSp = 0; spGap = 12 + rng.int(7);
        var r = rng(), sp = r < 0.4 ? 'bomb' : r < 0.75 ? 'wild' : 'tremor';
        if (!seen[sp]) { seen[sp] = true; caption = { sp: sp, t: 3.2 }; }
        return { sp: sp };
      }
      return { tier: pickTier() };
    }
    cur = { tier: pickTier() };
    queue.push(gen(), gen());

    function itemR(it) { return it.sp ? SPECIAL[it.sp].r : TIERS[it.tier].r; }
    function name(it) { return it.sp ? SPECIAL[it.sp].label : TIERS[it.tier].n.toUpperCase(); }
    function clampAim(x) { var r = itemR(cur); return U.clamp(x, LEFT + r + 1, RIGHT - r - 1); }
    function mk(tier, x, y, vx, vy, sp) {
      return { id: nextId++, tier: tier, sp: sp || null, r: sp ? SPECIAL[sp].r : TIERS[tier].r, x: x, y: y, vx: vx, vy: vy,
        age: 0, pop: 0, ang: 0, sq: 0, sqAng: 0, sqPh: 0, puff: 0 };
    }
    function ring(x, y, v, c, w, life) { rings2.push({ x: x, y: y, r: 4, v: v, c: c, w: w, life: life, max: life }); }

    function drop() {
      if (cooldown > 0 || over || nova) return;
      var it = cur, x = clampAim(aimX) + (rng() - 0.5) * 0.8, m = M();   // sub-pixel jitter: no perfect towers
      if (it.sp === 'tremor') startTremor();
      else if (it.sp) {
        orbs.push(mk(-1, x, DROP_Y, 0, 60, it.sp));
        api.audio.tone(it.sp === 'bomb' ? 180 : 700, 0.1, { type: 'triangle', vol: 0.14 });
      } else {
        orbs.push(mk(it.tier, x, DROP_Y, 0, 60));
        api.audio.tone(260 + it.tier * 20, 0.08, { type: 'triangle', vol: 0.14 });
      }
      if (m && it.sp === 'wild') m.note('bell', 7, { quantize: '16', octave: 1, gain: 0.35 });
      drops++;
      cur = queue.shift();
      queue.push(gen());
      cooldown = 0.45;
      aimX = clampAim(aimX);
    }

    function startTremor() {
      tremor = 1.5; tremorPh = 0;
      orbs.forEach(function (o) { o.vy -= 110 + rng() * 150; o.vx += (rng() - 0.5) * 120; });
      api.shake(8);
      api.fx.text(W / 2, 270, 'TREMOR!', SPECIAL.tremor.c, 16);
      var m = M();
      if (m) { m.note('sub', 0, { octave: -1, dur: 1.1, gain: 0.85 }); m.note('riser', 0, { dur: 0.8, gain: 0.2 }); m.duck(0.35, 0.9); }
      api.audio.noise(0.9, { cutoff: 260, vol: 0.4 });
    }

    function merge(a, b) {
      a.dead = b.dead = true;
      var tier = a.tier + 1;
      var x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
      chain = chainT > 0 ? chain + 1 : 1;
      chainT = 1.2;
      var mult = Math.min(4, 1 + (chain - 1) * 0.5);
      var pts = Math.round(POINTS[tier] * mult);
      api.addScore(pts);
      var o = mk(tier, x, y, (a.vx + b.vx) / 2, Math.min(a.vy, b.vy) - 60);
      o.age = 1; o.pop = 1; o.ang = (a.ang + b.ang) / 2;
      orbs.push(o);
      var c = TIERS[tier].c;
      api.fx.burst(x, y, c, 12 + tier * 3, 120 + tier * 20);
      api.fx.burst(x, y, '#ffffff', 5 + tier, 80 + tier * 10, 0.45);
      api.fx.text(x, y - TIERS[tier].r - 6, '+' + pts + (chain > 1 ? ' x' + mult : ''), c, 11 + Math.min(tier, 6));
      if (chain >= 2) api.fx.text(x, y - TIERS[tier].r - 26, 'CHAIN x' + chain + '!', chain >= 4 ? '#ffe36e' : '#ffffff', 11 + Math.min(chain, 6) * 1.5);
      if (tier >= 4) api.shake(Math.min(11, tier * 1.3));
      if (tier >= 5) ring(x, y, 260, c, 3, 0.45);
      var m = M();
      if (m) {
        var climb = Math.min(chain - 1, 6) * 2;               // chains climb the scale
        m.note(tier >= 5 ? 'bell' : 'marimba', 9 - tier + climb, { quantize: '8', octave: tier >= 5 ? -1 : 0, gain: 0.55 + tier * 0.03 });
        if (chain >= 3) m.note('bell', 7 + climb, { quantize: '16', octave: 1, gain: 0.35 });
        if (tier >= 7 && tier < SUN) m.stinger([{ deg: 7 - tier, at: 0 }, { deg: 11 - tier, at: 2 }, { deg: 14 - tier, at: 4, steps: 6 }], { inst: 'bell', quantize: 'beat', gain: 0.6 });
      } else api.audio.tone(330 * Math.pow(1.122, tier), 0.14, { type: 'sine', vol: 0.2, slide: 1.5 });
      if (tier >= 6 && tier < SUN) api.fx.text(W / 2, 160, TIERS[tier].n.toUpperCase() + '!', c, 16);
      if (tier === SUN) startNova(o);
    }

    function detonate(b) {
      var x = b.x, y = b.y, R = 100, pts = 10;
      orbs.forEach(function (o) {
        if (o.dead || o === b) return;
        var dx = o.x - x, dy = o.y - y, d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (d - o.r > R) return;
        if (o.tier <= 3) {
          o.dead = true;
          pts += o.tier >= 0 ? Math.ceil(POINTS[o.tier] / 2) : 2;
          api.fx.burst(o.x, o.y, o.sp ? SPECIAL[o.sp].c : TIERS[o.tier].c, 10, 150);
        } else {
          var f = 640 * (1 - Math.max(0, d - o.r) / R * 0.7) * U.clamp(40 / o.r, 0.45, 1);
          o.vx += dx / d * f; o.vy += dy / d * f - 60;
        }
      });
      api.addScore(pts);
      api.fx.burst(x, y, '#ff6b3d', 40, 300, 0.8);
      api.fx.burst(x, y, '#ffd166', 24, 200, 0.6);
      api.fx.text(x, y - 24, 'BOOM +' + pts, '#ff8a5c', 14);
      ring(x, y, 520, '#ff8a5c', 5, 0.35); ring(x, y, 330, '#ffd166', 3, 0.45);
      flashT = Math.max(flashT, 0.3);
      api.shake(12);
      var m = M();
      if (m) { m.note('sub', 0, { octave: -2, dur: 0.9, gain: 1 }); m.note('kick', 0, { gain: 1 }); m.duck(0.7, 0.9); }
      api.audio.noise(0.5, { cutoff: 900, vol: 0.4 });
    }

    function upgrade(o) {
      api.fx.burst(o.x, o.y, '#fff4a8', 20, 180, 0.7);
      api.fx.burst(o.x, o.y, '#9ff8ff', 12, 140, 0.6);
      var m = M();
      if (m) m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4 }, { deg: 9, at: 5 }, { deg: 11, at: 6, steps: 3 }],
        { inst: 'arp', quantize: '16', octave: 1, gain: 0.5 });
      else api.audio.arp([660, 880, 1100, 1320], 0.05, { type: 'triangle', vol: 0.18 });
      if (o.dead) return;
      var nt = o.tier + 1;
      api.addScore(POINTS[nt]);
      api.fx.text(o.x, o.y - o.r - 10, 'STARDUST +' + POINTS[nt], '#fff4a8', 12);
      if (nt >= SUN) { o.dead = true; var s = mk(SUN, o.x, o.y, 0, 0); s.age = 1; s.pop = 1; orbs.push(s); startNova(s); return; }
      o.tier = nt; o.r = TIERS[nt].r; o.pop = 1;
    }

    function startNova(s) {
      nova = { x: s.x, y: s.y, t: 0, fired: false, sun: s };
      chainT = 0; tremor = 0; dangerT = 0;
      api.fx.text(W / 2, 200, 'A SUN IS BORN', '#ffe36e', 18);
      api.shake(6);
      var m = M();
      if (m) { m.note('riser', 0, { dur: 1.6, gain: 0.5 }); m.setFilter(18000, 0.3); musicTense = false; }
    }
    function vaporize(o) {
      o.dead = true;
      var pts = o.tier >= 0 ? POINTS[o.tier] : 5;
      api.addScore(pts);
      api.fx.burst(o.x, o.y, o.sp ? SPECIAL[o.sp].c : TIERS[o.tier].c, 10 + Math.max(0, o.tier) * 2, 180, 0.8);
      if (o.tier >= 3) api.fx.text(o.x, o.y, '+' + pts, '#fff2c0', 11);
    }
    function updateNova(dt) {
      nova.t += dt;
      var m = M();
      if (!nova.fired && nova.t >= 1.0) {
        nova.fired = true;
        nova.sun.dead = true;
        var bonus = 1000 * level;
        api.addScore(bonus);
        flashT = 0.85;
        ring(nova.x, nova.y, 620, '#ffffff', 8, 1.0); ring(nova.x, nova.y, 480, '#ffe36e', 6, 1.2); ring(nova.x, nova.y, 360, '#ff8a2a', 4, 1.4);
        api.fx.burst(nova.x, nova.y, '#ffe36e', 90, 380, 1.4);
        api.fx.burst(nova.x, nova.y, '#ffffff', 50, 240, 1.1);
        api.fx.burst(nova.x, nova.y, '#ff7a3a', 40, 300, 1.2);
        api.fx.text(W / 2, H / 2 - 40, 'SUPERNOVA +' + bonus, '#ffe36e', 18);
        api.shake(18);
        if (m) {
          m.duck(0.6, 1.2);
          m.note('sub', 0, { octave: -2, dur: 1.4, gain: 1 });
          m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4 }, { deg: 9, at: 6 }, { deg: 11, at: 8 }, { deg: 14, at: 10, steps: 8 }],
            { inst: 'bell', quantize: '8', octave: 1, gain: 0.7 });
        } else api.audio.arp([523, 659, 784, 1047, 1319], 0.07, { type: 'square', vol: 0.22 });
      }
      if (nova.fired) {
        var R = (nova.t - 1.0) * 430;
        orbs.forEach(function (o) {
          if (o.dead) return;
          var dx = o.x - nova.x, dy = o.y - nova.y;
          if (Math.sqrt(dx * dx + dy * dy) - o.r < R || nova.t > 2.6) vaporize(o);
        });
        orbs = orbs.filter(function (o) { return !o.dead; });
        if (nova.t > 2.9) { nova = null; levelUp(); }
      }
    }
    function levelUp() {
      level++;
      bannerT = 2.8;
      oldSky = sky; sky = buildSky(level, api.seed); skyBlend = 0;
      var bonus = 500 * level;
      api.addScore(bonus);
      api.fx.text(W / 2, H / 2 + 40, 'LEVEL BONUS +' + bonus, '#ffffff', 13);
      dangerT = 0; best = 0;
      var m = M();
      if (m) {
        m.setKey(53 + KEYS[(level - 1) % KEYS.length]);
        m.setScale(level % 2 ? 'lydian' : 'major');
        m.stinger([{ deg: 0, steps: 6 }, { deg: 4, at: 2, steps: 6 }, { deg: 7, at: 4, steps: 8 }, { deg: 9, at: 6, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
      }
    }

    function hit(o, nx, ny, speed, px, py) {
      if (speed < 240) return;
      var s = Math.min(0.2, speed / 2600);
      if (s > o.sq * 0.8) { o.sq = s; o.sqAng = Math.atan2(ny, nx); o.sqPh = 0; }
      if (o.puff <= 0 && speed > 330) {
        o.puff = 0.3;
        api.fx.burst(px, py, 'rgba(210,200,255,0.8)', 4 + Math.min(6, Math.floor(speed / 200)), 50 + speed * 0.05, 0.4);
      }
    }
    function specialTouch(a, b) {
      var bomb = a.sp === 'bomb' ? a : b.sp === 'bomb' ? b : null;
      if (bomb) { bomb.dead = true; pend.push({ k: 'bomb', o: bomb }); return true; }
      var w = a.sp === 'wild' ? a : b.sp === 'wild' ? b : null, other = w === a ? b : a;
      if (w && other.tier >= 0) { w.dead = true; pend.push({ k: 'wild', o: other }); return true; }
      return false;
    }

    function physics(h) {
      var i, j, a, b, n;
      var acc = 0, tol = 0;
      if (tremor > 0) {
        tremorPh += h * TAU * 6;
        acc = Math.sin(tremorPh) * 4200 * Math.min(1, tremor / 0.5);
        tol = 4;
      }
      for (i = 0; i < orbs.length; i++) {
        a = orbs[i];
        a.vy += G * h; a.vx += acc * h;
        a.vx *= 0.999; a.vy *= 0.999;
        var sp2 = a.vx * a.vx + a.vy * a.vy;
        if (sp2 > VMAX * VMAX) { var k = VMAX / Math.sqrt(sp2); a.vx *= k; a.vy *= k; }
        a.x += a.vx * h; a.y += a.vy * h;
      }
      for (var iter = 0; iter < 3; iter++) {
        n = orbs.length;
        for (i = 0; i < n; i++) {
          a = orbs[i];
          if (a.dead) continue;
          for (j = i + 1; j < orbs.length; j++) {
            b = orbs[j];
            if (b.dead) continue;
            var dx = b.x - a.x, dy = b.y - a.y;
            var min = a.r + b.r;
            var d2 = dx * dx + dy * dy;
            if (a.tier >= 0 && a.tier === b.tier && d2 < (min + tol) * (min + tol)) { merge(a, b); break; }
            if (d2 >= min * min) continue;
            if ((a.sp || b.sp) && specialTouch(a, b)) { if (a.dead) break; continue; }
            var d = Math.sqrt(d2) || 0.01;
            var nx = dx / d, ny = dy / d, overlap = min - d;
            var ma = a.r * a.r, mb = b.r * b.r, tot = ma + mb;
            a.x -= nx * overlap * (mb / tot); a.y -= ny * overlap * (mb / tot);
            b.x += nx * overlap * (ma / tot); b.y += ny * overlap * (ma / tot);
            var vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (vn < 0) {
              if (vn < -240) { var cx = a.x + nx * a.r, cy = a.y + ny * a.r; hit(a, nx, ny, -vn, cx, cy); hit(b, -nx, -ny, -vn, cx, cy); }
              var jimp = -(1.15) * vn / (1 / ma + 1 / mb);
              a.vx -= jimp / ma * nx; a.vy -= jimp / ma * ny;
              b.vx += jimp / mb * nx; b.vy += jimp / mb * ny;
            }
          }
        }
        for (i = 0; i < orbs.length; i++) {
          a = orbs[i];
          if (a.dead) continue;
          var r = a.r, touched = false;
          if (a.x - r < LEFT) { a.x = LEFT + r; a.vx = Math.abs(a.vx) * 0.25; touched = true; }
          if (a.x + r > RIGHT) { a.x = RIGHT - r; a.vx = -Math.abs(a.vx) * 0.25; touched = true; }
          if (a.y + r > FLOOR) {
            if (a.vy > 240) hit(a, 0, 1, a.vy, a.x, FLOOR);
            a.y = FLOOR - r; a.vy = -Math.abs(a.vy) * 0.2; a.vx *= 0.97; touched = true;
          }
          if (touched && a.sp === 'bomb') { a.dead = true; pend.push({ k: 'bomb', o: a }); }
        }
      }
      while (pend.length) {
        var e = pend.shift();
        if (e.k === 'bomb') detonate(e.o); else upgrade(e.o);
        if (nova) { pend.length = 0; break; }
      }
      for (i = 0; i < orbs.length; i++) if (orbs[i].dead) { orbs = orbs.filter(function (o) { return !o.dead; }); break; }
    }

    // jar fill -> layers; planets over the line -> filter tension (edge-triggered)
    function syncMusic() {
      var m = M();
      if (!m) return;
      var top = FLOOR;
      for (var k = 0; k < orbs.length; k++) if (orbs[k].age > 0.8) top = Math.min(top, orbs[k].y - orbs[k].r);
      var q = Math.round(U.clamp((FLOOR - top) / (FLOOR - DANGER), 0, 1) * 20) / 20;
      if (q !== musicQ) { musicQ = q; m.setIntensity(q); }
      var tense = dangerT > 0 && !nova;
      if (tense !== musicTense) { musicTense = tense; m.setFilter(tense ? 1500 : 18000, tense ? 0.5 : 1); }
    }

    function gameOver() {
      over = true;
      api.shake(12);
      if (M()) { M().setFilter(600, 0.3); M().tapeStop(1.3); }
      api.audio.tone(180, 0.6, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
      orbs.forEach(function (o, k) { o.dieAt = 0.2 + Math.min(1.1, k * 0.03); });
    }

    if (M()) M().play(song(), { fade: 1.6, intensity: 0 });

    /* ------------------------------------------------ render parts */
    function ghostY(x, r) {
      var y = FLOOR - r;
      for (var k = 0; k < orbs.length; k++) {
        var o = orbs[k], dx = o.x - x, rr = r + o.r;
        if (Math.abs(dx) < rr) { var yy = o.y - Math.sqrt(rr * rr - dx * dx); if (yy < y) y = yy; }
      }
      return Math.max(DROP_Y, y);
    }
    function drawBody(ctx, o) {
      var sc = 1 + o.pop * 0.18, sq = o.sq * Math.cos(o.sqPh);
      if (o.sp) { drawSpecial(ctx, o.sp, o.x, o.y, t, sc, o.ang); return; }
      if (o.tier === SUN) {
        var grow = nova && nova.sun === o ? 1 + Math.min(1, nova.t) * 0.3 + Math.sin(nova.t * nova.t * 30) * 0.03 * nova.t : 1;
        drawSun(ctx, o.x, o.y, t, sc * grow);
        drawPlanet(ctx, o.x, o.y, SUN, { sc: sc * grow });
        return;
      }
      drawPlanet(ctx, o.x, o.y, o.tier, { ang: o.ang, sc: sc, sq: sq, sqAng: o.sqAng });
    }
    function drawBackground(ctx) {
      if (oldSky && skyBlend < 1) { ctx.drawImage(oldSky.canvas, 0, 0, W, H); ctx.globalAlpha = skyBlend; }
      ctx.drawImage(sky.canvas, 0, 0, W, H);
      ctx.globalAlpha = 1;
      var tint = 'hsl(' + sky.hue + ',70%,88%)', par = (aimX - W / 2) * 0.03;
      ctx.fillStyle = tint;
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        ctx.globalAlpha = (0.3 + Math.sin(t * 2 + s.p) * 0.25) * (0.5 + s.z * 0.5);
        var x = ((s.x - par * s.z) % W + W) % W;
        ctx.fillRect(x, s.y, s.s * s.z + 0.4, s.s * s.z + 0.4);
      }
      ctx.globalAlpha = 1;
    }
    function drawDanger(ctx) {
      var warn = dangerT > 0;
      if (nearV > 0.05) {
        var zg = ctx.createLinearGradient(0, JTOP, 0, DANGER + 30);
        zg.addColorStop(0, 'rgba(255,77,109,0)'); zg.addColorStop(0.55, 'rgba(255,77,109,' + (0.1 * nearV + (warn ? 0.08 : 0)) + ')'); zg.addColorStop(1, 'rgba(255,77,109,0)');
        ctx.fillStyle = zg; ctx.fillRect(LEFT, JTOP, RIGHT - LEFT, DANGER + 30 - JTOP);
      }
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -t * 20;
      var pulse = 0.5 + 0.5 * Math.sin(t * (warn ? 20 : 7));
      ctx.strokeStyle = 'rgba(255,77,109,' + (warn ? 0.5 + pulse * 0.5 : 0.3 + nearV * 0.5 * pulse) + ')';
      ctx.lineWidth = warn ? 2.5 : 2;
      ctx.beginPath(); ctx.moveTo(LEFT, DANGER); ctx.lineTo(RIGHT, DANGER); ctx.stroke();
      ctx.restore();
    }
    function drawCountdown(ctx) {
      if (dangerT > 0 && !over) {
        var left = 1 - dangerT / GRACE, x = U.clamp(dangerX, LEFT + 20, RIGHT - 20), y = DANGER - 22;
        ctx.save();
        ctx.fillStyle = 'rgba(20,4,12,0.7)'; disc(ctx, x, y, 12);
        ctx.strokeStyle = 'rgba(255,77,109,0.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.stroke();
        ctx.strokeStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(x, y, 11, -Math.PI / 2, -Math.PI / 2 + TAU * left); ctx.stroke();
        ctx.restore();
        U.glowText(ctx, String(Math.ceil(GRACE - dangerT)), x, y + 1, 9, '#ffd0d8');
        ctx.save(); ctx.globalAlpha = Math.min(1, dangerT * 2);
        U.glowText(ctx, 'TOO HIGH!', W / 2, DANGER + 18, 13, '#ff4d6d');
        ctx.restore();
      }
    }
    function drawPreview(ctx) {
      var x = W - 104, y = 6;
      ctx.save();
      ctx.fillStyle = 'rgba(8,6,24,0.55)'; ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1;
      U.roundRect(ctx, x, y, 98, 50, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(210,215,255,0.6)'; ctx.font = '700 9px ui-monospace, Menlo, Consolas, monospace';
      ctx.fillText('NEXT', x + 8, y + 12);
      ctx.restore();
      for (var k = 0; k < 2; k++) {
        var it = queue[k], dr = it.sp ? 11 : 8 + it.tier * 1.6, sc = (k ? 0.8 : 1) * dr / itemR(it);
        drawItem(ctx, it, x + 30 + k * 40, y + 30, t, sc, k ? 0.65 : 1);
      }
    }
    function drawLadder(ctx) {
      var n = TIERS.length, gap = 34, x0 = W / 2 - (n - 1) * gap / 2, y = H - 10;
      for (var k = 0; k < n; k++) {
        drawThumb(ctx, x0 + k * gap, y, k, 4 + Math.round(k * 0.45), k <= best ? 1 : 0.28);
      }
    }

    return {
      // Read-only snapshot for tests.
      debug: function () {
        var mt = -1;
        orbs.forEach(function (o) { if (o.tier > mt) mt = o.tier; });
        return { level: level, bodies: orbs.length, maxTier: mt, current: name(cur), queue: [name(queue[0]), name(queue[1])],
          danger: Math.round(dangerT * 100) / 100, dead: over, nova: !!nova, tremor: tremor > 0, drops: drops };
      },
      update: function (dt) {
        t += dt;
        var inp = api.input, k;
        inp.takeSwipes();
        for (k = rings2.length - 1; k >= 0; k--) { var rg = rings2[k]; rg.r += rg.v * dt; rg.life -= dt; if (rg.life <= 0) rings2.splice(k, 1); }
        if (flashT > 0) flashT = Math.max(0, flashT - dt * 2.2);
        if (bannerT > 0) bannerT -= dt;
        if (caption) { caption.t -= dt; if (caption.t <= 0) caption = null; }
        skyBlend = Math.min(1, skyBlend + dt / 2);
        for (k = 0; k < stars.length; k++) { var s = stars[k]; s.y += s.z * 7 * dt; if (s.y > H) { s.y -= H; s.x = vis() * W; } }
        if (over) {
          overT += dt;
          orbs.forEach(function (o) { if (!o.dead && o.dieAt < overT) { o.dead = true; api.fx.burst(o.x, o.y, o.sp ? SPECIAL[o.sp].c : TIERS[o.tier].c, 10, 160); } });
          orbs = orbs.filter(function (o) { return !o.dead; });
          if (overT > 1.5) api.gameOver();
          return;
        }
        cooldown -= dt;
        if (chainT > 0) chainT -= dt;

        // Aim: pointer when it moves, otherwise keys.
        var p = api.pointer();
        if (p.moved !== lastMoved) { lastMoved = p.moved; aimX = p.x; }
        if (inp.held('left')) aimX -= 330 * dt;
        if (inp.held('right')) aimX += 330 * dt;
        aimX = clampAim(aimX);

        // Drop: key press, or release of a touch/click inside the jar.
        if (inp.hit('release')) drop();
        if (inp.hit('a') || inp.hit('down') || inp.hit('up')) drop();

        if (nova) updateNova(dt);
        else {
          if (tremor > 0) tremor -= dt;
          var h = dt / SUB;
          for (var s2 = 0; s2 < SUB && !nova; s2++) physics(h);
        }
        orbs.forEach(function (o) {
          o.age += dt;
          if (o.pop > 0) o.pop = Math.max(0, o.pop - dt * 4);
          if (o.sq > 0.004) { o.sq *= Math.exp(-dt * 7); o.sqPh += dt * 30; } else o.sq = 0;
          if (o.puff > 0) o.puff -= dt;
          if (!nova) o.ang += U.clamp(o.vx / o.r, -8, 8) * dt;
          if (o.tier > best) best = Math.min(o.tier, SUN);
        });

        // Over the line: only settled planets count, and only if they stay there.
        nearV = 0;
        var above = false, hiTop = 1e9;
        if (!nova) {
          orbs.forEach(function (o) {
            if (o.age <= 1.2) return;
            var top = o.y - o.r;
            nearV = Math.max(nearV, U.clamp(1 - (top - DANGER) / 80, 0, 1));
            if (top < DANGER && Math.abs(o.vy) < 120) { if (top < hiTop) { hiTop = top; dangerX = o.x; } above = true; }
          });
        }
        dangerT = above ? dangerT + dt : Math.max(0, dangerT - dt * 2);
        if (dangerT > GRACE) gameOver();
        syncMusic();

        var biggest = orbs.reduce(function (m, o) { return Math.max(m, o.tier); }, 0);
        api.setStatus('LV ' + level + '   NEXT ' + name(queue[0]) + '   BIGGEST ' + TIERS[Math.max(0, biggest)].n.toUpperCase());
      },

      render: function (ctx) {
        drawBackground(ctx);
        var jx = tremor > 0 ? Math.sin(tremorPh) * 3 * Math.min(1, tremor / 0.5) : 0;
        drawDanger(ctx);

        // aim guide + ghost + held item
        if (!over && !nova) {
          var ax = clampAim(aimX), r = itemR(cur), ready = cooldown <= 0;
          if (cur.sp !== 'tremor') {
            var gy = ghostY(ax, r);
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,' + (ready ? 0.22 : 0.1) + ')';
            ctx.setLineDash([3, 7]); ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(ax, DROP_Y + r); ctx.lineTo(ax, gy); ctx.stroke();
            ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(255,255,255,' + (ready ? 0.35 : 0.15) + ')';
            ctx.beginPath(); ctx.arc(ax, gy, r, 0, TAU); ctx.stroke();
            ctx.restore();
            if (ready && gy > DROP_Y + r * 2) drawItem(ctx, cur, ax, gy, t, 1, 0.16);
          }
        }
        for (var k = 0; k < orbs.length; k++) drawBody(ctx, orbs[k]);

        if (rings2.length) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          rings2.forEach(function (rg) {
            var f = rg.life / rg.max;
            ctx.globalAlpha = f; ctx.strokeStyle = rg.c; ctx.lineWidth = rg.w * (0.4 + f);
            ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, 0, TAU); ctx.stroke();
          });
          ctx.restore();
        }
        ctx.drawImage(sky.jar.left, LEFT + 2 + jx, JY0, 14, JH);
        ctx.drawImage(sky.jar.right, RIGHT - 10 + jx, JY0, 6, JH);
        ctx.fillStyle = 'rgba(255,255,255,0.09)'; ctx.fillRect(LEFT + 16, FLOOR - 3, RIGHT - LEFT - 32, 1);
        drawCountdown(ctx);
        drawLadder(ctx);
        drawPreview(ctx);

        if (!over && !nova) {
          var bob = Math.sin(t * 3) * 1.5;
          drawItem(ctx, cur, clampAim(aimX), DROP_Y + bob, t, 1, cooldown > 0 ? 0.35 : 1);
          if (cur.sp) U.glowText(ctx, SPECIAL[cur.sp].label, clampAim(aimX), DROP_Y - itemR(cur) - 14, 8, SPECIAL[cur.sp].c);
        }
        ctx.save();
        ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
        ctx.fillStyle = 'hsla(' + sky.hue + ',90%,85%,0.75)';
        ctx.fillText('LEVEL ' + level, LEFT, 18);
        ctx.restore();

        if (caption) {
          var ca = Math.min(1, caption.t * 2, (3.2 - caption.t) * 4), sp = SPECIAL[caption.sp];
          ctx.save(); ctx.globalAlpha = ca;
          ctx.fillStyle = 'rgba(8,6,24,0.75)'; U.roundRect(ctx, W / 2 - 150, 150, 300, 58, 12); ctx.fill();
          drawSpecial(ctx, caption.sp, W / 2 - 118, 179, t, 1);
          U.glowText(ctx, 'NEW: ' + sp.label, W / 2 + 18, 170, 12, sp.c);
          U.glowText(ctx, sp.desc, W / 2 + 18, 192, 7, '#e6e8ff');
          ctx.restore();
        }
        if (bannerT > 0) {
          ctx.save(); ctx.globalAlpha = Math.min(1, bannerT * 1.5, (2.8 - bannerT) * 3);
          U.glowText(ctx, 'LEVEL ' + level, W / 2, H / 2 - 20, 26, 'hsl(' + sky.hue + ',95%,80%)');
          U.glowText(ctx, 'NEW SKY - GROW ANOTHER SUN', W / 2, H / 2 + 14, 8, '#ffffff');
          ctx.restore();
        }
        if (nova && !nova.fired) {
          ctx.save(); ctx.globalAlpha = Math.min(0.55, nova.t * 0.55);
          var ng = ctx.createRadialGradient(nova.x, nova.y, 0, nova.x, nova.y, 300);
          ng.addColorStop(0, 'rgba(255,240,180,0.6)'); ng.addColorStop(1, 'rgba(255,200,80,0)');
          ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }
        if (flashT > 0) { ctx.fillStyle = 'rgba(255,248,225,' + Math.min(0.9, flashT) + ')'; ctx.fillRect(0, 0, W, H); }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#150b33'); bg.addColorStop(1, '#03020c');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    var ng = ctx.createRadialGradient(w * 0.72, h * 0.28, 0, w * 0.72, h * 0.28, w * 0.55);
    ng.addColorStop(0, 'rgba(190,110,255,0.22)'); ng.addColorStop(1, 'rgba(190,110,255,0)');
    ctx.fillStyle = ng; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    for (var i = 0; i < 40; i++) {
      var fx = Math.abs(Math.sin(i * 12.9898) * 43758.5) % 1, fy = Math.abs(Math.sin(i * 78.233) * 12543.1) % 1;
      ctx.globalAlpha = 0.25 + 0.25 * Math.sin(t * 2 + i);
      ctx.fillRect(fx * w, (fy * h + t * (3 + i % 3 * 4)) % h, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;
    var s = h / 300;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(w * 0.04, h * 0.25, w * 0.92, h * 0.72);
    ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.04, h * 0.25); ctx.lineTo(w * 0.04, h * 0.97); ctx.lineTo(w * 0.96, h * 0.97); ctx.lineTo(w * 0.96, h * 0.25); ctx.stroke();
    ctx.restore();
    var pile = [[0.25, 0.84, 7], [0.64, 0.83, 8], [0.42, 0.6, 5], [0.82, 0.58, 4], [0.14, 0.62, 3], [0.56, 0.45, 2], [0.3, 0.43, 1], [0.7, 0.4, 0]];
    pile.forEach(function (p, k) {
      drawPlanet(ctx, p[0] * w, p[1] * h, p[2], { sc: s * 0.62, ang: Math.sin(t * 0.4 + k) * 0.4 });
    });
    var fall = (t * 0.6) % 1, cyc = Math.floor(t * 0.6);
    var x = w * (0.5 + Math.sin(t) * 0.25), y = h * (0.08 + fall * 0.3);
    if (cyc % 4 === 3) drawSpecial(ctx, 'wild', x, y, t, s * 0.8);
    else drawPlanet(ctx, x, y, cyc % 4, { sc: s * 0.62, ang: t });
  }

  XA.registerGame({
    id: 'xa_orbit_merge',
    order: 4,
    title: 'Orbit Merge',
    tagline: 'Match planets. Grow a sun.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO AIM - LIFT YOUR FINGER TO DROP',
    controls: 'Mouse to aim, click to drop - or arrows and Space',
    create: create,
    attract: attract
  });
})(window);

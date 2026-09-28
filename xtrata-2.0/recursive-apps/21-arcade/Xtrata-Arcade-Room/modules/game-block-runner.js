/*
 * Xtrata Arcade cartridge #5 - BLOCK RUNNER (v2)
 * An endless one-button runner: an orange block sprints through four worlds -
 * City Rush, Dune Sea, Neon Night and Orbit - each with its own sky, parallax,
 * ground, obstacle mix and soundtrack. Tap to jump (hold for height, jump
 * again in the air with DOUBLE JUMP), duck under drones, ride coin trails,
 * grab SHIELD / MAGNET / DOUBLE JUMP / DASH, and shave obstacles for
 * CLOSE CALL bonuses.
 *
 * Music: one song per world, crossfaded on the world change (C-major city
 * chiptune, E-phrygian desert pluck, A-minor synthwave, D-lydian space
 * bells). Tempo follows speed, jumps climb an arpeggio, ducking dips the
 * filter, DASH drops tempo + filter, 500 m milestones step the key up.
 *
 * Contract game-id: xa_block_runner (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-runner');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 600, H = 340, GROUND = 284, PX = 92, TW = 1024;
  var ACCENT = '#ff9f1c', COIN = '#3ff0ff';
  var SIZE = 30, DUCK = 17, JUMP_V = 640, G_HOLD = 1500, G_FALL = 2900, CLOSE = 9;
  var KEY_STEPS = [0, 2, 4, 5, 7, 9];

  var WORLDS = [
    { name: 'CITY RUSH', sky: ['#170a2c', '#4a1848', '#ff7a4d'], far: '#3b2160', mid: '#22123c', ground: '#0d0818', line: ACCENT,
      stripe: 'rgba(255,159,28,0.28)', fill: '#23254a', edge: '#6a7bff', haz: '#ff4d6d', drone: '#c77dff', dust: 'rgba(200,180,255,0.7)' },
    { name: 'DUNE SEA', sky: ['#2b1640', '#c4513a', '#ffcf7a'], far: '#7d3a3f', mid: '#a9552b', ground: '#4a2914', line: '#ffcf7a',
      stripe: 'rgba(255,207,122,0.3)', fill: '#6e4226', edge: '#ffb36b', haz: '#46d17a', drone: '#ff8a5c', dust: 'rgba(255,200,130,0.75)' },
    { name: 'NEON NIGHT', sky: ['#03000f', '#190540', '#4a0f78'], far: '#1a0b3a', mid: '#0e0626', ground: '#07001a', line: '#ff3fa4',
      stripe: 'rgba(255,63,164,0.45)', fill: '#140330', edge: '#3ff0ff', haz: '#ff3fa4', drone: '#ffe14d', dust: 'rgba(255,120,210,0.7)' },
    { name: 'ORBIT', sky: ['#000004', '#050a24', '#1a0f45'], far: '#1b1e3a', mid: '#2b2e4a', ground: '#262838', line: '#b8c4ff',
      stripe: 'rgba(184,196,255,0.22)', fill: '#3a3d55', edge: '#b8c4ff', haz: '#9dff5a', drone: '#5ad1ff', dust: 'rgba(200,210,240,0.7)' }
  ];
  var BOUNDS = [0, 600, 1400, 2400, 3400];
  function worldAt(m) {
    for (var i = 1; i < BOUNDS.length; i++) if (m < BOUNDS[i]) return i - 1;
    return Math.floor((m - 3400) / 900) % 4;           // then the worlds keep cycling
  }
  function worldSpan(m) {
    for (var i = 1; i < BOUNDS.length; i++) if (m < BOUNDS[i]) return [BOUNDS[i - 1], BOUNDS[i]];
    var k = Math.floor((m - 3400) / 900);
    return [3400 + k * 900, 3400 + (k + 1) * 900];
  }

  var PW = {
    shield: { c: '#5ab8ff', label: 'SHIELD', dur: 15 },
    magnet: { c: '#ff5ad1', label: 'MAGNET', dur: 10 },
    double: { c: '#7dff6a', label: 'DOUBLE JUMP', dur: 12 },
    dash: { c: '#ffd23f', label: 'DASH', dur: 3.5 }
  };
  var PW_KEYS = ['shield', 'magnet', 'double', 'dash'];

  /* ------------------------------------------------------------ music */
  function songs() {
    var hook = [
      '4 . 4 5 7 . 4 . 2 . 2 4 5 . . .',
      '4 . 4 5 7 . 9 . 7 . 5 4 2 . . .',
      '0 . 2 . 4 . 7 . 5 - 4 . 2 . 4 .',
      '5 . 4 . 2 . 1 . 0 - - - . . . .'
    ].join(' ');
    return [
      // CITY RUSH: bright major chiptune
      { bpm: 128, key: 60, scale: 'major', chords: [0, 5, 3, 4], seed: 5, tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.4, chord: true, octave: -2, params: { cutoff: 1100, q: 3 },
          pattern: '0 . ^0 . 0 . ^0 . 0 . ^0 . 0 . ^0 4' },
        { name: 'arp', inst: 'arp', layer: 0, gain: 0.2, chord: true, octave: 1, params: { cutoff: 2000 },
          fn: function (i) { return [0, 2, 4, 7, 4, 2][i.step % 6]; } },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.55, pattern: 'x...x...x...x...' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.28, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'snare', inst: 'snare', layer: 0.42, gain: 0.35, pattern: '....x.......x...' },
        { name: 'lead', inst: 'lead', layer: 0.6, gain: 0.24, octave: 1, params: { wave: 'square', cutoff: 2100 }, pattern: hook },
        { name: 'chime', inst: 'bell', layer: 0.82, gain: 0.25, chord: true, octave: 2, rate: 4,
          fn: function (i) { return i.stepInBar === 0 || i.stepInBar === 12 ? { deg: [0, 4, 2, 7][i.bar % 4], vel: 0.6 } : null; } }
      ] },
      // DUNE SEA: phrygian pluck ostinato over a drone, doumbek-ish kick
      { bpm: 120, key: 64, scale: 'phrygian', chords: [0, 1, 0, 6], seed: 51, tracks: [
        { name: 'drone', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - 0 - - - 4 - - -' },
        { name: 'oud', inst: 'pluck', layer: 0, gain: 0.34, chord: true, params: { decay: 0.22, cutoff: 3200 },
          fn: function (i) {
            var p = [0, 1, 0, null, 2, 1, 0, null, 4, null, 3, 2, 1, null, 0, null][i.stepInBar];
            return p == null ? null : { deg: p, vel: i.stepInBar % 4 === 0 ? 0.9 : 0.55 };
          } },
        { name: 'doum', inst: 'kick', layer: 0.12, gain: 0.55, pattern: 'x..x..x...x.x...' },
        { name: 'shaker', inst: 'shaker', layer: 0.25, gain: 0.55, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.3, pattern: '....x.......x..x' },
        { name: 'lead', inst: 'lead', layer: 0.62, gain: 0.2, octave: 1, params: { wave: 'triangle', cutoff: 2400 },
          pattern: '4 - - 5 4 - 2 - 1 - - - 0 - - - 4 - 5 - 7 - 5 4 2 - 1 - 0 - - -' },
        { name: 'bell', inst: 'bell', layer: 0.82, gain: 0.2, chord: true, octave: 2,
          fn: function (i) { return i.stepInBar === 8 && i.rng() < 0.6 ? { deg: [0, 4, 2][i.bar % 3], vel: 0.5 } : null; } }
      ] },
      // NEON NIGHT: minor synthwave, octave bass, pads, gated arp
      { bpm: 132, key: 57, scale: 'minor', chords: [0, 5, 2, 6], seed: 52, tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.36, chord: true, octave: -2, params: { cutoff: 900, q: 5 },
          fn: function (i) { return i.step % 2 ? { deg: 0, oct: 1, vel: 0.5 } : { deg: 0, vel: 0.85 }; } },
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.32, chord: true, params: { cutoff: 1400 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0.1, gain: 0.6, pattern: 'x...x...x...x...' },
        { name: 'clap', inst: 'clap', layer: 0.3, gain: 0.32, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.38, gain: 0.3, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'arp', inst: 'arp', layer: 0.5, gain: 0.2, chord: true, octave: 1, params: { cutoff: 3000 },
          fn: function (i) { return [0, 2, 4, 7, 9, 7, 4, 2][i.step % 8]; } },
        { name: 'lead', inst: 'lead', layer: 0.7, gain: 0.22, octave: 1, params: { wave: 'sawtooth', cutoff: 2600 },
          pattern: '7 - - 6 7 - 9 - 7 - 4 - - - . . 7 - - 6 7 - 11 - 9 - - - 7 - . .' }
      ] },
      // ORBIT: lydian pads, random star bells, half-time drums
      { bpm: 116, key: 62, scale: 'lydian', chords: [0, 1], barsPerChord: 2, seed: 53, tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.4, chord: true, octave: -1, params: { cutoff: 900, attack: 0.9, release: 1.6 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 4, steps: 32 }, { deg: 6, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.45, chord: true, octave: -2, pattern: '0 - - - - - - - - - - - 0 - - -' },
        { name: 'stars', inst: 'bell', layer: 0, gain: 0.28, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.22 ? { deg: [0, 2, 3, 4, 6, 7][Math.floor(i.rng() * 6)], vel: 0.45 } : null; } },
        { name: 'arp', inst: 'arp', layer: 0.2, gain: 0.16, chord: true, octave: 1, params: { cutoff: 2200 },
          fn: function (i) { return i.step % 3 ? null : [0, 4, 7, 3, 6, 4][(i.step / 3) % 6]; } },
        { name: 'kick', inst: 'kick', layer: 0.35, gain: 0.55, pattern: 'x.........x.....' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.32, pattern: '........x.......' },
        { name: 'hat', inst: 'hat', layer: 0.6, gain: 0.25, pattern: 'x.x.x.x.x.x.x.x.' },
        { name: 'lead', inst: 'lead', layer: 0.78, gain: 0.2, octave: 1, params: { wave: 'triangle', cutoff: 3000 },
          pattern: '4 - - - 3 - 4 - 6 - - - 7 - - - 6 - 4 - 3 - - - 1 - - - 0 - - -' }
      ] }
    ];
  }

  /* ------------------------------------------- pre-rendered scenery
     Built once per page with a fixed visual-only seed (never api.rng). */
  var LAYERS = null, COIN_IMG = null;
  function cnv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function glowDisc(g, x, y, r, c0, c1) {
    g.save(); g.shadowColor = c1; g.shadowBlur = r * 0.9; g.fillStyle = c0;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore();
  }
  function paintSky(i, g, r) {
    var wd = WORLDS[i], grd = g.createLinearGradient(0, 0, 0, GROUND), k;
    grd.addColorStop(0, wd.sky[0]); grd.addColorStop(0.62, wd.sky[1]); grd.addColorStop(1, wd.sky[2]);
    g.fillStyle = grd; g.fillRect(0, 0, W, GROUND);
    if (i !== 1) {
      g.fillStyle = '#fff';
      for (k = 0; k < (i === 3 ? 180 : 60); k++) {
        g.globalAlpha = 0.15 + r() * (i === 3 ? 0.8 : 0.45);
        var s = r() < 0.9 ? 1 : 2;
        g.fillRect(r() * W, r() * GROUND * (i === 3 ? 1 : 0.5), s, s);
      }
      g.globalAlpha = 1;
    }
    if (i === 0) {
      glowDisc(g, 430, 190, 46, '#ffb35c', '#ff6a3d');
      g.fillStyle = 'rgba(255,140,120,0.16)';
      for (k = 0; k < 5; k++) g.fillRect(40 + k * 120, 60 + (k % 3) * 22, 90 + (k % 2) * 60, 5);
    } else if (i === 1) {
      glowDisc(g, 400, 168, 64, '#fff2b0', '#ffcf7a');
      g.fillStyle = 'rgba(255,225,170,0.2)';
      for (k = 0; k < 5; k++) g.fillRect(0, 150 + k * 22, W, 4 + k);
      g.strokeStyle = 'rgba(60,20,40,0.55)'; g.lineWidth = 2;
      for (k = 0; k < 3; k++) {                 // distant birds
        var bx = 150 + k * 46, by = 70 + (k % 2) * 16;
        g.beginPath(); g.moveTo(bx - 7, by - 3); g.quadraticCurveTo(bx - 3, by - 6, bx, by); g.quadraticCurveTo(bx + 3, by - 6, bx + 7, by - 3); g.stroke();
      }
    } else if (i === 2) {
      g.save();
      g.shadowColor = '#ff3fa4'; g.shadowBlur = 40;
      var sg = g.createLinearGradient(0, 100, 0, 256);
      sg.addColorStop(0, '#ffe14d'); sg.addColorStop(1, '#ff3fa4');
      g.fillStyle = sg; g.beginPath(); g.arc(300, 178, 78, 0, 7); g.fill();
      g.restore();
      g.fillStyle = grd;
      for (k = 0; k < 7; k++) g.fillRect(200, 178 + k * 11, 200, 1.5 + k * 0.9);
    } else {
      var neb = g.createRadialGradient(170, 100, 10, 170, 100, 190);
      neb.addColorStop(0, 'rgba(170,70,220,0.32)'); neb.addColorStop(1, 'rgba(170,70,220,0)');
      g.fillStyle = neb; g.fillRect(0, 0, W, GROUND);
      g.strokeStyle = 'rgba(255,220,180,0.55)'; g.lineWidth = 3;
      g.beginPath(); g.ellipse(470, 86, 58, 12, -0.35, Math.PI, Math.PI * 2); g.stroke();
      var pg = g.createRadialGradient(458, 74, 4, 470, 86, 32);
      pg.addColorStop(0, '#ffd9a8'); pg.addColorStop(1, '#a8502a');
      g.fillStyle = pg; g.beginPath(); g.arc(470, 86, 30, 0, 7); g.fill();
      g.beginPath(); g.ellipse(470, 86, 58, 12, -0.35, 0, Math.PI); g.stroke();
      glowDisc(g, 110, 56, 13, '#5aa8ff', '#5aa8ff');
      g.fillStyle = '#6ee08a'; g.beginPath(); g.arc(106, 53, 5, 0, 7); g.fill();
    }
  }
  function paintFar(i, g, r) {
    var wd = WORLDS[i], x = 0, bw, bh;
    g.fillStyle = wd.far;
    if (i === 0 || i === 2) {
      while (true) {
        bw = 30 + r() * 50; bh = 60 + r() * 130;
        if (x + bw > TW) break;
        g.fillStyle = wd.far; g.fillRect(x, GROUND - bh, bw, bh);
        if (i === 2 && r() < 0.5) { g.fillRect(x + bw / 2 - 1, GROUND - bh - 16, 2, 16); g.fillStyle = '#ff3fa4'; g.fillRect(x + bw / 2 - 2, GROUND - bh - 18, 4, 3); }
        var wc = i === 0 ? 'rgba(255,210,150,0.16)' : (r() < 0.5 ? 'rgba(63,240,255,0.35)' : 'rgba(255,63,164,0.35)');
        g.fillStyle = wc;
        for (var yy = GROUND - bh + 8; yy < GROUND - 8; yy += 10) for (var xx = x + 5; xx < x + bw - 6; xx += 8) if (r() < 0.45) g.fillRect(xx, yy, 3, 4);
        x += bw + 2 + r() * 12;
      }
    } else if (i === 1) {
      while (true) {
        bw = 90 + r() * 140; bh = 40 + r() * 70;
        if (x + bw > TW) break;
        g.fillStyle = wd.far;
        g.beginPath(); g.moveTo(x, GROUND); g.lineTo(x + 18, GROUND - bh); g.lineTo(x + bw - 18, GROUND - bh); g.lineTo(x + bw, GROUND); g.fill();
        g.fillStyle = 'rgba(255,190,140,0.25)'; g.fillRect(x + 18, GROUND - bh, bw - 36, 3);
        x += bw + 20 + r() * 60;
      }
    } else {
      g.fillStyle = wd.far; g.beginPath(); g.moveTo(0, GROUND);
      for (x = 0; x <= TW; x += 8) {
        var a = x / TW * Math.PI * 2;
        g.lineTo(x, GROUND - 55 - Math.sin(a * 3 + 1) * 28 - Math.sin(a * 7) * 14 - Math.abs(Math.sin(a * 13)) * 10);
      }
      g.lineTo(TW, GROUND); g.fill();
    }
  }
  function paintMid(i, g, r) {
    var wd = WORLDS[i], x = 0, k, bw, bh;
    if (i === 0) {
      while (true) {
        bw = 40 + r() * 60; bh = 30 + r() * 80;
        if (x + bw > TW) break;
        g.fillStyle = wd.mid; g.fillRect(x, GROUND - bh, bw, bh);
        if (r() < 0.35) { g.fillRect(x + 8, GROUND - bh - 14, 14, 10); g.fillRect(x + 10, GROUND - bh - 4, 2, 4); g.fillRect(x + 18, GROUND - bh - 4, 2, 4); }
        g.fillStyle = 'rgba(255,200,90,0.45)';
        for (var yy = GROUND - bh + 7; yy < GROUND - 6; yy += 11) for (var xx = x + 5; xx < x + bw - 6; xx += 9) if (r() < 0.18) g.fillRect(xx, yy, 4, 5);
        x += bw + r() * 30;
      }
    } else if (i === 1) {
      g.fillStyle = wd.mid; g.beginPath(); g.moveTo(0, GROUND);
      for (x = 0; x <= TW; x += 8) { var a = x / TW * Math.PI * 2; g.lineTo(x, GROUND - 38 - Math.sin(a * 2) * 18 - Math.sin(a * 5 + 2) * 9); }
      g.lineTo(TW, GROUND); g.fill();
      g.fillStyle = '#3a4a22';
      for (k = 0; k < 5; k++) {
        x = 60 + k * 190 + r() * 60; bh = 34 + r() * 26;
        g.fillRect(x, GROUND - bh, 7, bh);
        g.fillRect(x - 9, GROUND - bh * 0.7, 9, 5); g.fillRect(x - 9, GROUND - bh * 0.7 - 12, 5, 12);
        g.fillRect(x + 7, GROUND - bh * 0.55, 9, 5); g.fillRect(x + 11, GROUND - bh * 0.55 - 10, 5, 10);
      }
    } else if (i === 2) {
      var words = ['XTRATA', 'OPEN', 'BLOCKS', '24/7', 'STX', 'BTC', 'ARCADE', 'L2'];
      var cols = ['#ff3fa4', '#3ff0ff', '#ffe14d', '#7dff6a'];
      g.fillStyle = wd.mid;
      while (x < TW - 60) { bw = 50 + r() * 60; bh = 20 + r() * 40; if (x + bw > TW) break; g.fillRect(x, GROUND - bh, bw, bh); x += bw + r() * 20; }
      for (k = 0; k < 6; k++) {
        x = 30 + k * 165 + r() * 30; var sw = 70 + r() * 30, sy = 120 + r() * 60, c = cols[k % 4];
        g.fillStyle = '#05010f'; g.fillRect(x + sw / 2 - 2, sy + 30, 4, GROUND - sy - 30);
        g.save(); g.shadowColor = c; g.shadowBlur = 14; g.strokeStyle = c; g.lineWidth = 2;
        g.fillStyle = 'rgba(10,2,30,0.85)'; g.fillRect(x, sy, sw, 30); g.strokeRect(x, sy, sw, 30);
        g.fillStyle = c; g.font = '800 14px ui-monospace, Menlo, Consolas, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(words[(k * 3) % words.length], x + sw / 2, sy + 16);
        g.restore();
      }
    } else {
      g.fillStyle = wd.mid;
      for (k = 0; k < 9; k++) {
        x = 20 + k * 110 + r() * 40; bw = 30 + r() * 50;
        g.beginPath(); g.ellipse(x, GROUND, bw, 14 + r() * 16, 0, Math.PI, 0); g.fill();
      }
      x = 700; g.fillStyle = '#3a3e60';
      g.beginPath(); g.arc(x, GROUND, 46, Math.PI, 0); g.fill();
      g.fillStyle = 'rgba(255,230,140,0.8)';
      for (k = 0; k < 4; k++) g.fillRect(x - 30 + k * 16, GROUND - 16, 6, 5);
      g.strokeStyle = '#3a3e60'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(x + 70, GROUND); g.lineTo(x + 70, GROUND - 60); g.stroke();
      g.beginPath(); g.arc(x + 70, GROUND - 66, 12, 0.3, Math.PI - 0.3); g.stroke();
    }
  }
  function buildLayers() {
    if (LAYERS) return LAYERS;
    LAYERS = WORLDS.map(function (wd, i) {
      var r = U.rng(9001 + i * 77);
      var sky = cnv(W, GROUND), far = cnv(TW, GROUND), mid = cnv(TW, GROUND);
      paintSky(i, sky.getContext('2d'), r);
      paintFar(i, far.getContext('2d'), r);
      paintMid(i, mid.getContext('2d'), r);
      return { sky: sky, far: far, mid: mid };
    });
    COIN_IMG = cnv(24, 24);
    var g = COIN_IMG.getContext('2d');
    g.shadowColor = COIN; g.shadowBlur = 7; g.fillStyle = COIN;
    g.beginPath(); g.moveTo(12, 4); g.lineTo(19, 12); g.lineTo(12, 20); g.lineTo(5, 12); g.fill();
    g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(10, 9, 3, 3);
    return LAYERS;
  }
  function tiled(ctx, img, off) {
    var x = -(off % TW);
    ctx.drawImage(img, x, 0);
    if (x + TW < W) ctx.drawImage(img, x + TW, 0);
  }
  function drawGround(ctx, i, dist) {
    var wd = WORLDS[i], k, off;
    ctx.fillStyle = wd.ground; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = wd.stripe;
    if (i === 0) {
      off = dist % 40; for (k = 0; k < W / 40 + 2; k++) ctx.fillRect(k * 40 - off, GROUND + 14, 18, 2);
      off = (dist * 1.4) % 90; for (k = 0; k < W / 90 + 2; k++) ctx.fillRect(k * 90 - off, GROUND + 34, 30, 2);
    } else if (i === 1) {
      off = dist % 46;
      for (k = 0; k < W / 46 + 2; k++) { ctx.fillRect(k * 46 - off, GROUND + 10 + (k % 3) * 9, 20, 2); ctx.fillRect(k * 46 - off + 12, GROUND + 40 + (k % 2) * 6, 14, 2); }
    } else if (i === 2) {
      ctx.strokeStyle = wd.stripe; ctx.lineWidth = 1; ctx.beginPath();
      for (k = 0; k < 5; k++) { var gy = GROUND + 5 + k * k * 2.8; ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
      off = dist % 60;
      for (k = -12; k < 24; k++) { var x0 = k * 60 - off; ctx.moveTo(x0, GROUND); ctx.lineTo(W / 2 + (x0 - W / 2) * 2.6, H); }
      ctx.stroke();
    } else {
      off = dist % 170;
      for (k = 0; k < W / 170 + 2; k++) {
        var cx = k * 170 - off + 50, cy = GROUND + 20 + (k % 2) * 16;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, cy, 28, 5, 0, 0, 7); ctx.fill();
        ctx.fillStyle = wd.stripe; ctx.fillRect(cx - 26, cy - 5, 52, 1.5);
      }
    }
    ctx.save();
    ctx.strokeStyle = wd.line; ctx.shadowColor = wd.line; ctx.shadowBlur = 10; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GROUND + 1); ctx.lineTo(W, GROUND + 1); ctx.stroke();
    ctx.restore();
  }
  function drawWorld(ctx, i, dist) {
    var L = buildLayers()[i];
    ctx.drawImage(L.sky, 0, 0);
    tiled(ctx, L.far, dist * 0.08);
    tiled(ctx, L.mid, dist * 0.25);
    drawGround(ctx, i, dist);
  }
  function glyph(ctx, k, x, y, r) {
    var s = r * 0.62;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.24; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    if (k === 'shield') {
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.85, -s * 0.6); ctx.quadraticCurveTo(s * 0.8, s * 0.5, 0, s);
      ctx.quadraticCurveTo(-s * 0.8, s * 0.5, -s * 0.85, -s * 0.6); ctx.closePath(); ctx.fill();
    } else if (k === 'magnet') {
      ctx.arc(0, s * 0.1, s * 0.6, 0, Math.PI); ctx.moveTo(-s * 0.6, s * 0.1); ctx.lineTo(-s * 0.6, -s * 0.8);
      ctx.moveTo(s * 0.6, s * 0.1); ctx.lineTo(s * 0.6, -s * 0.8); ctx.stroke();
    } else if (k === 'double') {
      ctx.moveTo(-s * 0.65, -s * 0.05); ctx.lineTo(0, -s * 0.7); ctx.lineTo(s * 0.65, -s * 0.05);
      ctx.moveTo(-s * 0.65, s * 0.65); ctx.lineTo(0, 0); ctx.lineTo(s * 0.65, s * 0.65); ctx.stroke();
    } else {
      ctx.moveTo(s * 0.25, -s); ctx.lineTo(-s * 0.55, s * 0.12); ctx.lineTo(-s * 0.02, s * 0.12); ctx.lineTo(-s * 0.25, s);
      ctx.lineTo(s * 0.55, -s * 0.18); ctx.lineTo(s * 0.02, -s * 0.18); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function badge(ctx, k, x, y, r, frac) {
    var c = PW[k].c;
    ctx.save();
    ctx.fillStyle = 'rgba(8,8,24,0.78)'; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.shadowColor = c; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    glyph(ctx, k, x, y, r);
    if (frac != null) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 7); ctx.stroke();
      ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, r + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * U.clamp(frac, 0, 1)); ctx.stroke();
    }
    ctx.restore();
  }
  // The runner block (shared by the game and the cabinet preview).
  function drawRunner(ctx, x, feetY, hh, rot, sq, runPh, grounded, tint) {
    ctx.save();
    ctx.translate(x + SIZE / 2, feetY);
    if (rot) { ctx.translate(0, -hh / 2); ctx.rotate(rot); ctx.translate(0, hh / 2); }
    ctx.scale(1 - sq * 0.45, 1 + sq);
    var c = tint || ACCENT;
    ctx.shadowColor = c; ctx.shadowBlur = 16; ctx.fillStyle = c;
    var legs = grounded ? 4 : 0;
    ctx.fillRect(-SIZE / 2, -hh, SIZE, hh - legs);
    ctx.shadowBlur = 0;
    if (legs) {
      var a = Math.sin(runPh);
      ctx.fillStyle = '#c96f00';
      ctx.fillRect(-11 + a * 3, -legs - Math.max(0, a) * 3, 8, legs + 1);
      ctx.fillRect(3 - a * 3, -legs - Math.max(0, -a) * 3, 8, legs + 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-SIZE / 2, -hh, SIZE, 4);
    ctx.fillStyle = '#05060f'; ctx.fillRect(4, -hh + 6, 5, hh > 20 ? 6 : 3);
    ctx.restore();
  }

  /* ------------------------------------------------------------- game */
  function create(api) {
    var rng = api.rng;
    buildLayers();
    var SONGS = songs();
    var y = GROUND - SIZE, vy = 0, grounded = true, ducking = false, duckT = 0, jumpBuffer = 0, coyote = 0, committed = false;
    var dist = 0, speed = 330, bonus = 0, wt = 0, ts = 1, t = 0, metres = 0;
    var obstacles = [], coins = [], items = [];
    var nextGap = 520, nextPowerM = 150;
    var dead = false, deadT = 0, started = false, flash = 0;
    var spin = 0, sq = 0, runPh = 0, dustT = 0, invT = 0, closeFlash = 0, closeCd = 0, closeStreak = 0, ringT = 0;
    var chain = 0, lineStreak = 0, coinCount = 0, milestone = 500;
    var pw = { shield: 0, magnet: 0, double: 0, dash: 0 }, airJumps = 0;
    var wi = 0, prevWi = 0, blend = 1, bannerT = 0;
    var mBpm = -1, mInt = -1, mFilt = -1, jumpNotes = 0, jumpNoteT = 0, keyStep = 0;
    var pieces = [], ghosts = [], gi = 0, lines = [], k;
    for (k = 0; k < 6; k++) ghosts.push({ y: 0, h: 0 });
    for (k = 0; k < 14; k++) lines.push({ x: Math.random() * W, y: 20 + Math.random() * (GROUND - 30), l: 40 + Math.random() * 80 });

    function curH() { return ducking && grounded ? DUCK : SIZE; }
    function diff() { return U.clamp(dist / 30000, 0, 1); }

    /* ---- spawning: every pattern is clearable; gaps scale with speed ---- */
    function ob(kind, x, yy, w, h, wv) {
      var o = { kind: kind, x: x, x0: x, y: yy, y0: yy, w: w, h: h, wi: wv, ph: rng() * 6.28, st: 0, vy: 0,
        passed: false, near: 99, touched: false, dead: false };
      obstacles.push(o);
      return o;
    }
    function addCoin(x, yy, tr) { coins.push({ x: x, y: yy, tr: tr, got: false, missed: false }); tr.n++; }
    // Coins along the arc a real jump takes, apex over `cx` (world x of the player's centre).
    function arc(cx, high) {
      var tr = { n: 0, got: 0, broken: false };
      var g1 = high ? G_HOLD : G_FALL, tUp = JUMP_V / g1, hMax = JUMP_V * JUMP_V / (2 * g1);
      var T = tUp + Math.sqrt(2 * hMax / G_FALL), x0 = cx - speed * tUp;
      for (var i = 1; i < 6; i++) {
        var tt = T * i / 6, hg;
        if (tt < tUp) hg = JUMP_V * tt - 0.5 * g1 * tt * tt;
        else { var td = tt - tUp; hg = hMax - 0.5 * G_FALL * td * td; }
        addCoin(x0 + speed * tt, GROUND - SIZE / 2 - hg, tr);
      }
    }
    function lowLine(x, w) {
      var tr = { n: 0, got: 0, broken: false };
      for (var i = 0; i < 5; i++) addCoin(x - 30 + i * (w + 60) / 4, GROUND - 10, tr);
    }
    var POOLS = [
      ['block', 'block', 'spike', 'drone', 'slider', 'fall', 'double', 'combo'],
      ['spike', 'block', 'pit', 'pit', 'fall', 'drone', 'double', 'combo'],
      ['block', 'spike', 'bob', 'bob', 'slider', 'fall', 'drone', 'combo'],
      ['block', 'pit', 'bob', 'fall', 'fall', 'spike', 'combo', 'slider']
    ];
    var UNLOCK = { block: 0, spike: 0, drone: 80, bob: 0, slider: 250, fall: 350, pit: 0, double: 900, combo: 1700 };
    function pattern(x, wv, m, d) {
      var kind = 'block';
      for (var tries = 0; tries < 6; tries++) { var c = POOLS[wv][rng.int(8)]; if (m >= UNLOCK[c]) { kind = c; break; } }
      var bh, bw, o;
      if (kind === 'block' || kind === 'spike') {
        bh = [26, 38, 50][rng.int(1 + Math.min(2, Math.floor(d * 3 + 0.8)))];
        bw = rng() < 0.3 ? 46 : 26;
        if (kind === 'spike' && wv === 1) bh = Math.max(bh, 38);
        ob(kind, x, GROUND - bh, bw, bh, wv);
        if (rng() < 0.55) arc(x + bw / 2, bh > 30 || bw > 30);
        return bw;
      }
      if (kind === 'drone') { ob('drone', x, GROUND - 36, 38, 16, wv); if (rng() < 0.65) lowLine(x, 38); return 38; }
      if (kind === 'bob') { o = ob('bob', x, GROUND - 58, 34, 16, wv); if (rng() < 0.5) lowLine(x, 34); return 34; }
      if (kind === 'slider') { ob('slider', x + 30, GROUND - 30, 30, 30, wv); if (rng() < 0.5) arc(x + 45, true); return 90; }
      if (kind === 'fall') { o = ob('fall', x, -50, 34, 34, wv); o.y0 = GROUND - 34; if (rng() < 0.5) arc(x + 17, true); return 34; }
      if (kind === 'pit') {
        bw = Math.round(Math.min(60 + d * 70, speed * 0.44 - 50));
        ob('pit', x, GROUND, bw, H - GROUND, wv);
        if (rng() < 0.6) arc(x + bw / 2, false);
        return bw;
      }
      if (kind === 'double') {
        ob('block', x, GROUND - 34, 30, 34, wv); ob('block', x + 30, GROUND - 52, 30, 52, wv);
        if (rng() < 0.6) arc(x + 30, true);
        return 60;
      }
      // combo: low block, room to land, then a drone to duck
      var gap = speed * 0.8 + 40;
      ob('block', x, GROUND - 26, 26, 26, wv);
      ob('drone', x + 26 + gap, GROUND - 36, 38, 16, wv);
      lowLine(x + 26 + gap, 38);
      return 26 + gap + 38;
    }
    function spawn() {
      var m = dist / 10, d = diff(), x = dist + W + 60, wv = worldAt(x / 10), len;
      if (m >= nextPowerM) {
        nextPowerM = m + 280 + rng() * 220;
        items.push({ kind: PW_KEYS[rng.int(4)], x: x, y: GROUND - 38, got: false });
        len = 30;
      } else len = pattern(x, wv, m, d);
      nextGap = len + 120 + speed * U.lerp(1.05, 0.72, d) + rng() * U.lerp(320, 170, d);
    }

    function overPit() {
      for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        if (o.kind !== 'pit') continue;
        var sx = o.x - dist;
        if (PX + 9 > sx && PX + SIZE - 9 < sx + o.w) return true;
      }
      return false;
    }
    function grant(kind) {
      pw[kind] = PW[kind].dur;
      if (kind === 'double') airJumps = 1;
      bonus += 20;
      api.fx.text(PX + 40, y - 24, PW[kind].label + '!', PW[kind].c, 12);
      api.fx.burst(PX + SIZE / 2, y + SIZE / 2, PW[kind].c, 22, 180, 0.6);
      var m = M();
      if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 11, at: 3, steps: 3 }], { inst: 'pluck', quantize: '16', octave: 1, gain: 0.6 });
      else api.audio.arp([660, 880, 1320], 0.05, { type: 'square', vol: 0.12 });
    }
    function smash(o, label) {
      o.dead = true;
      var P = WORLDS[o.wi], sx = o.x - dist;
      api.fx.burst(sx + o.w / 2, o.y + o.h / 2, P.edge, 18, 220, 0.5);
      api.fx.burst(sx + o.w / 2, o.y + o.h / 2, '#ffffff', 8, 160, 0.3);
      api.shake(5);
      api.audio.noise(0.12, { vol: 0.16, cutoff: 2600 });
      if (label) { bonus += 15; api.fx.text(sx + o.w / 2, o.y - 12, label, PW.dash.c, 11); }
    }
    function die(reason) {
      dead = true; deadT = 0; flash = 1;
      var hh = curH();
      for (var i = 0; i < 9; i++) {
        pieces.push({ x: PX + (i % 3) * 10 + 5, y: y + Math.floor(i / 3) * hh / 3 + 5, vx: -140 + (i % 3) * 120 + (Math.random() - 0.5) * 80,
          vy: -260 - Math.random() * 220, r: 0, vr: (Math.random() - 0.5) * 16, s: 10 });
      }
      api.fx.burst(PX + SIZE / 2, y + hh / 2, ACCENT, 34, 240, 0.9);
      api.fx.burst(PX + SIZE / 2, y + hh / 2, '#ffffff', 12, 160, 0.6);
      if (reason) api.fx.text(PX + 60, y - 20, reason, '#ff8a8a', 11);
      api.shake(12);
      var m = M();
      if (m) { m.setFilter(600, 0.2); m.tapeStop(1.1); }
      else { api.audio.tone(160, 0.35, { type: 'square', slide: 0.4, vol: 0.28 }); api.audio.noise(0.25, { vol: 0.2 }); }
    }
    function hitBy(o) {
      if (pw.shield > 0) {
        pw.shield = 0; invT = 0.9;
        smash(o, null);
        api.fx.text(PX + 30, y - 22, 'SHIELD!', PW.shield.c, 12);
        api.fx.burst(PX + SIZE / 2, y + SIZE / 2, PW.shield.c, 30, 260, 0.7);
        api.shake(7);
        if (M()) M().note('bell', 0, { octave: 1, gain: 0.7 });
        return false;
      }
      die({ spike: 'SPIKED', drone: 'ZAPPED', bob: 'ZAPPED', fall: 'CRUSHED', slider: 'BONK' }[o.kind] || 'BONK');
      return true;
    }
    function changeWorld(z) {
      prevWi = wi; wi = z; blend = 0; bannerT = 2.8;
      var m = M();
      if (m) {
        m.play(SONGS[z], { fade: 2.2, intensity: m.intensity(), keepFilter: true });
        m.setKey(SONGS[z].key + KEY_STEPS[keyStep]);
        m.note('riser', 0, { dur: 1.4, gain: 0.3 });
        mBpm = -1; mInt = -1;
      }
    }
    function musicTick() {
      var ms = M();
      if (!ms) return;
      var base = SONGS[wi].bpm + Math.round((speed - 330) / 450 * 9) * 4;
      var bpm = pw.dash > 0 ? Math.round(base * 0.72) : base;
      if (bpm !== mBpm) { ms.setTempo(bpm, mBpm < 0 ? 0.01 : Math.abs(bpm - mBpm) > 8 ? 0.4 : 1.5); mBpm = bpm; }
      var f = pw.dash > 0 ? 1 : ducking ? 2 : 3;
      if (f !== mFilt) { mFilt = f; ms.setFilter([0, 1100, 650, 18000][f], f === 3 ? 0.4 : 0.1); }
      var span = worldSpan(metres);
      var iv = Math.round(U.clamp(0.15 + (metres - span[0]) / 650 * 0.75 + (pw.dash > 0 ? 0.1 : 0), 0, 1) * 20) / 20;
      if (iv !== mInt) { mInt = iv; ms.setIntensity(iv); }
    }

    if (M()) M().play(SONGS[0], { fade: 1, intensity: 0 });

    return {
      // Read-only test hook.
      debug: function () {
        var nx = null, best = 1e9;
        for (var i = 0; i < obstacles.length; i++) {
          var o = obstacles[i], sx = o.x - dist;
          if (o.dead || sx + o.w < PX) continue;
          if (sx < best) { best = sx; nx = o; }
        }
        return { world: wi, worldName: WORLDS[wi].name, metres: metres, speed: speed, timeScale: ts,
          power: { shield: pw.shield, magnet: pw.magnet, double: pw.double, dash: pw.dash }, shielded: pw.shield > 0,
          airJumps: airJumps, grounded: grounded, ducking: ducking, y: y, vy: vy, started: started, dead: dead,
          bonus: bonus, coins: coinCount, items: items.length,
          next: nx && { kind: nx.kind, dx: best - (PX + SIZE), w: nx.w, top: nx.y, bottom: nx.y + nx.h, state: nx.st } };
      },
      update: function (dt) {
        t += dt;
        var inp = api.input, i, o, m;
        var sw = inp.takeSwipes();
        if (flash > 0) flash -= dt * 3;
        if (dead) {
          deadT += dt;
          for (i = 0; i < pieces.length; i++) {
            var p = pieces[i];
            p.vy += 1400 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
            if (p.y > GROUND - 5 && p.vy > 0 && !overPit()) { p.y = GROUND - 5; p.vy *= -0.35; p.vx *= 0.7; p.vr *= 0.6; }
          }
          if (deadT > 1.2) api.gameOver();
          return;
        }
        var jumpPressed = inp.hit('a') || inp.hit('up') || inp.hit('hold');
        var jumpHeld = inp.held('a') || inp.held('up') || inp.held('hold');
        if (sw.indexOf('down') >= 0) duckT = 0.55;
        if (duckT > 0) duckT -= dt;
        var wantDuck = inp.held('down') || duckT > 0;
        if (!started) {
          if (jumpPressed) { started = true; bannerT = 2.4; } else { runPh += dt * 4; return; }
        }
        // power timers (real time) and the world's time scale (slow-mo)
        for (i = 0; i < 4; i++) { var pk = PW_KEYS[i]; if (pw[pk] > 0) { pw[pk] -= dt; if (pw[pk] <= 0) { pw[pk] = 0; if (pk === 'double') airJumps = 0; } } }
        if (invT > 0) invT -= dt;
        if (closeFlash > 0) closeFlash -= dt;
        if (closeCd > 0) closeCd -= dt;
        if (bannerT > 0) bannerT -= dt;
        if (ringT > 0) ringT -= dt;
        blend = Math.min(1, blend + dt / 2.2);
        var tsTarget = pw.dash > 0 ? 0.6 : 1;
        if (closeFlash > 0) tsTarget = Math.min(tsTarget, 0.45);
        ts += (tsTarget - ts) * Math.min(1, dt * 10);
        var wdt = dt * ts;
        wt += wdt;

        // ---- jumping
        if (jumpPressed) jumpBuffer = 0.12;
        if (jumpBuffer > 0) jumpBuffer -= dt;
        if (coyote > 0) coyote -= dt;
        var mj = M();
        if ((grounded || coyote > 0) && jumpBuffer > 0 && !committed) {
          grounded = false; coyote = 0; vy = -JUMP_V; jumpBuffer = 0; duckT = 0; wantDuck = false; sq = 0.3;
          if (pw.double > 0) airJumps = 1;
          y = Math.min(y, GROUND - SIZE);
          if (mj) { mj.note('arp', 0, { quantize: '16', chord: true, octave: 1, gain: 0.55 }); jumpNotes = 1; jumpNoteT = 0.1; }
          else api.audio.tone(520, 0.08, { type: 'square', vol: 0.12, slide: 1.6 });
        } else if (!grounded && jumpPressed && pw.double > 0 && airJumps > 0 && !committed) {
          airJumps = 0; vy = -560; jumpBuffer = 0; sq = 0.28; spin = 0;
          api.fx.burst(PX + SIZE / 2, y + SIZE, PW.double.c, 14, 150, 0.4);
          if (mj) { mj.note('arp', 7, { quantize: '16', chord: true, octave: 1, gain: 0.6 }); jumpNotes = 3; jumpNoteT = 0.1; }
          else api.audio.tone(780, 0.08, { type: 'square', vol: 0.12, slide: 1.6 });
        }
        // holding the jump climbs an arpeggio while still rising
        if (!grounded && jumpNotes && jumpNotes < 5 && jumpHeld && vy < 0) {
          jumpNoteT -= dt;
          if (jumpNoteT <= 0 && mj) { mj.note('arp', [0, 2, 4, 7, 9][jumpNotes], { quantize: '16', chord: true, octave: 1, gain: 0.5 }); jumpNotes++; jumpNoteT = 0.1; }
        } else if (grounded) jumpNotes = 0;

        var dashing = pw.dash > 0;
        if (grounded && !dashing && overPit()) { grounded = false; vy = 0; coyote = 0.09; }
        if (!grounded) {
          // Variable jump: short tap = short hop. Duck in the air = fast fall.
          var grav = vy < 0 && jumpHeld ? G_HOLD : G_FALL;
          if (wantDuck) grav = 4200;
          vy += grav * dt;
          y += vy * dt;
          if (y + SIZE >= GROUND) {
            var op = !dashing && overPit();
            if (op && y + SIZE > GROUND + 4) committed = true;
            if (op || committed) {
              if (y > GROUND + 12) {
                if (pw.shield > 0) { pw.shield = 0; invT = 0.9; vy = -760; committed = false; api.fx.text(PX + 30, GROUND - 60, 'SHIELD!', PW.shield.c, 12); api.shake(6); }
                else { die('FELL'); return; }
              }
            } else if (!committed) {
              if (vy > 500) { api.fx.burst(PX + SIZE / 2, GROUND - 2, WORLDS[wi].dust, 10, 110, 0.35); sq = -0.32; }
              grounded = true; vy = 0; spin = 0;
              if (pw.double > 0) airJumps = 1;
            }
          }
        }
        ducking = wantDuck;
        var hh = curH();
        if (grounded) y = GROUND - hh;
        spin = grounded ? 0 : spin + dt * 9;
        sq *= Math.exp(-dt * 12);
        if (grounded) runPh += dt * speed * ts / 26;

        // ---- world motion
        speed = 330 + Math.min(450, dist * 0.016);
        dist += speed * wdt;
        nextGap -= speed * wdt;
        if (nextGap <= 0) spawn();
        metres = Math.floor(dist / 10);
        var z = worldAt(metres);
        if (z !== wi) changeWorld(z);

        // moving obstacles
        for (i = 0; i < obstacles.length; i++) {
          o = obstacles[i];
          if (o.kind === 'bob') o.y = o.y0 + Math.sin(wt * 2.4 + o.ph) * 22;
          else if (o.kind === 'slider') o.x = o.x0 + Math.sin(wt * 1.7 + o.ph) * 30;
          else if (o.kind === 'fall' && o.st < 2) {
            var fsx = o.x - dist, landAt = PX + Math.max(170, speed * 0.55);
            if (o.st === 0 && fsx < landAt + speed * 0.3) { o.st = 1; o.vy = 520; api.audio.tone(900, 0.25, { type: 'triangle', slide: 0.3, vol: 0.06 }); }
            if (o.st === 1) {
              o.vy += 3200 * wdt; o.y += o.vy * wdt;
              if (o.y >= o.y0) {
                o.y = o.y0; o.st = 2; api.shake(4);
                api.fx.burst(fsx + o.w / 2, GROUND - 2, WORLDS[o.wi].dust, 12, 140, 0.4);
                api.audio.noise(0.14, { vol: 0.18, cutoff: 700 });
              }
            }
          }
        }

        // ---- collisions + close calls (slightly forgiving hitbox)
        var px0 = PX + 4, px1 = PX + SIZE - 4, py0 = y + 4, py1 = y + hh - 1;
        for (i = 0; i < obstacles.length; i++) {
          o = obstacles[i];
          if (o.dead || o.kind === 'pit') continue;
          var sx = o.x - dist;
          if (sx < PX + 90 && sx + o.w > PX - 50 && !(o.kind === 'fall' && o.st === 0)) {
            var inset = o.kind === 'spike' ? 6 : 2;
            var ax0 = sx + inset, ax1 = sx + o.w - inset, ay0 = o.y + inset, ay1 = o.y + o.h;
            if (px1 > ax0 && px0 < ax1 && py1 > ay0 && py0 < ay1) {
              o.touched = true;
              if (invT > 0) continue;
              var low = o.kind !== 'drone' && o.kind !== 'bob' && !(o.kind === 'fall' && o.st === 1);
              if (dashing && low) { smash(o, 'SMASH +15'); continue; }
              if (hitBy(o)) return;
              continue;
            }
            var gx = Math.max(0, ax0 - px1, px0 - ax1), gy = Math.max(0, ay0 - py1, py0 - ay1), nd = Math.max(gx, gy);
            if (nd < o.near) o.near = nd;
          }
          if (!o.passed && sx + o.w < PX) {
            o.passed = true;
            var ducked = (o.kind === 'drone' || o.kind === 'bob') && ducking;
            if (ducked) { bonus += 10; api.fx.text(PX + 20, y - 14, 'DUCK +10', WORLDS[o.wi].drone, 10); }
            if (o.near < CLOSE && !o.touched && !ducked && closeCd <= 0) {
              closeStreak = Math.min(5, closeStreak + 1);
              var cp = 25 * closeStreak;
              bonus += cp; closeFlash = 0.16; closeCd = 0.35; ringT = 0.35;
              api.fx.text(PX + 34, y - 26, 'CLOSE CALL +' + cp, '#fff4b8', 12);
              api.fx.burst(PX + SIZE, y + hh / 2, '#fff4b8', 14, 170, 0.45);
              m = M();
              if (m) m.note('bell', 4 + closeStreak, { octave: 1, gain: 0.55, quantize: '16' });
              else api.audio.tone(1320, 0.1, { type: 'triangle', vol: 0.12 });
            } else if (o.near >= CLOSE) closeStreak = 0;
          }
        }

        // ---- coins
        var pcx = dist + PX + SIZE / 2, pcy = y + hh / 2, pull = Math.min(1, dt * 9);
        for (i = 0; i < coins.length; i++) {
          var c = coins[i];
          if (c.got) continue;
          var bx = c.x - dist;
          if (pw.magnet > 0 && bx > PX - 30 && bx < PX + 220) { c.x += (pcx - c.x) * pull; c.y += (pcy - c.y) * pull; bx = c.x - dist; }
          if (bx > px0 - 8 && bx < px1 + 8 && c.y > py0 - 8 && c.y < py1 + 8) {
            c.got = true; chain++; coinCount++;
            var pts = 5 * Math.min(chain, 8);
            bonus += pts;
            api.fx.burst(bx, c.y, COIN, 8, 90, 0.4);
            m = M();
            if (m) m.note('pluck', (chain - 1) % 8, { octave: 2, gain: 0.35 });
            else api.audio.tone(880 + (chain % 8) * 60, 0.05, { type: 'square', vol: 0.1 });
            var tr = c.tr;
            tr.got++;
            if (tr.got === tr.n && !tr.broken) {
              lineStreak = Math.min(8, lineStreak + 1);
              var lp = 25 * lineStreak;
              bonus += lp;
              api.fx.text(bx, c.y - 16, (lineStreak > 1 ? 'LINE x' + lineStreak + ' +' : 'PERFECT LINE +') + lp, COIN, 11);
              if (m) m.stinger([{ deg: 4 }, { deg: 7, at: 1 }, { deg: 9, at: 2, steps: 2 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.4 });
            }
          } else if (bx < PX - 20 && !c.missed) {
            c.missed = true; chain = 0;
            if (!c.tr.broken) { c.tr.broken = true; lineStreak = 0; }
          }
        }
        // ---- power-up items
        for (i = 0; i < items.length; i++) {
          var it = items[i];
          if (it.got) continue;
          var ix = it.x - dist;
          if (ix + 14 > PX && ix - 14 < PX + SIZE && it.y + 14 > y && it.y - 14 < y + hh) { it.got = true; grant(it.kind); }
        }
        // compact arrays in place (no per-frame garbage)
        var n = 0;
        for (i = 0; i < obstacles.length; i++) { o = obstacles[i]; if (!o.dead && o.x + o.w - dist > -140) obstacles[n++] = o; }
        obstacles.length = n; n = 0;
        for (i = 0; i < coins.length; i++) if (!coins[i].got && coins[i].x - dist > -40) coins[n++] = coins[i];
        coins.length = n; n = 0;
        for (i = 0; i < items.length; i++) if (!items[i].got && items[i].x - dist > -40) items[n++] = items[i];
        items.length = n;

        // ---- juice bookkeeping
        dustT -= dt;
        if (grounded && dustT <= 0) { dustT = 0.06; api.fx.trail(PX + 2, GROUND - 2, WORLDS[wi].dust, -speed * 0.3 * ts, -10 - Math.random() * 25); }
        if (dashing) { ghosts[gi].y = y; ghosts[gi].h = hh; gi = (gi + 1) % ghosts.length; }
        for (i = 0; i < lines.length; i++) {
          var ln = lines[i];
          ln.x -= speed * 1.7 * ts * dt;
          if (ln.x < -ln.l) { ln.x = W + Math.random() * 200; ln.y = 20 + Math.random() * (GROUND - 30); ln.l = 40 + Math.random() * 80; }
        }

        api.setScore(metres + bonus);
        if (metres >= milestone) {
          api.fx.text(W / 2, 110, milestone + ' m', ACCENT, 16);
          milestone += 500;
          m = M();
          if (m) {
            keyStep = (keyStep + 1) % KEY_STEPS.length;
            m.setKey(SONGS[wi].key + KEY_STEPS[keyStep]);
            m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 4, steps: 4 }], { inst: 'pluck', quantize: 'beat', octave: 1, gain: 0.65 });
          } else api.audio.arp([523, 784], 0.07, { type: 'triangle', vol: 0.15 });
        }
        musicTick();
        api.setStatus(WORLDS[wi].name + '  ·  ' + metres + ' m  ·  ' + Math.round(speed / 10) + ' km/h' + (chain > 1 ? '  ·  COINS x' + chain : ''));
      },

      render: function (ctx) {
        var i, o, sx;
        // background: crossfade the previous world into the new one
        if (blend < 1) { drawWorld(ctx, prevWi, dist); ctx.save(); ctx.globalAlpha = blend; drawWorld(ctx, wi, dist); ctx.restore(); }
        else drawWorld(ctx, wi, dist);

        // pits cut the ground
        for (i = 0; i < obstacles.length; i++) {
          o = obstacles[i];
          if (o.kind !== 'pit') continue;
          sx = o.x - dist;
          if (sx > W || sx + o.w < 0) continue;
          var P = WORLDS[o.wi];
          ctx.fillStyle = '#000'; ctx.fillRect(sx, GROUND - 1, o.w, H - GROUND + 1);
          ctx.fillStyle = P.ground; ctx.fillRect(sx, GROUND, 4, H - GROUND); ctx.fillRect(sx + o.w - 4, GROUND, 4, H - GROUND);
          ctx.fillStyle = P.line; ctx.fillRect(sx - 2, GROUND - 1, 6, 4); ctx.fillRect(sx + o.w - 4, GROUND - 1, 6, 4);
          if (pw.dash > 0) { ctx.fillStyle = 'rgba(255,210,63,0.55)'; ctx.fillRect(sx, GROUND - 1, o.w, 3); }
        }
        // speed lines
        var sl = pw.dash > 0 ? 0.7 : U.clamp((speed - 520) / 260, 0, 1) * 0.45;
        if (sl > 0.02 && started && !dead) {
          ctx.fillStyle = pw.dash > 0 ? 'rgba(255,230,140,' + sl.toFixed(2) + ')' : 'rgba(255,255,255,' + sl.toFixed(2) + ')';
          for (i = 0; i < lines.length; i++) ctx.fillRect(lines[i].x, lines[i].y, lines[i].l, 1.5);
        }
        // falling-object telegraphs (under everything)
        for (i = 0; i < obstacles.length; i++) {
          o = obstacles[i];
          if (o.kind !== 'fall' || o.st === 2) continue;
          var fcx = o.x - dist + o.w / 2;
          if (fcx > W + 260) continue;
          var prog = o.st === 0 ? 0.25 + 0.08 * Math.sin(t * 14) : U.clamp((o.y + 50) / (o.y0 + 50), 0, 1);
          var hz = o.wi === 2 ? '#ff3fa4' : '#ff4d4d';
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.beginPath(); ctx.ellipse(fcx, GROUND + 1, 6 + prog * o.w * 0.6, 2 + prog * 3, 0, 0, 7); ctx.fill();
          ctx.strokeStyle = hz; ctx.globalAlpha = 0.45; ctx.setLineDash([4, 6]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(fcx, 72); ctx.lineTo(fcx, GROUND - 4); ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = Math.sin(t * 18) > -0.3 ? 1 : 0.35;
          var wx = U.clamp(fcx, 16, W - 16);
          ctx.fillStyle = hz; ctx.shadowColor = hz; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.moveTo(wx, 44); ctx.lineTo(wx + 12, 65); ctx.lineTo(wx - 12, 65); ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0; ctx.fillStyle = '#05060f'; ctx.fillRect(wx - 1.5, 50, 3, 8); ctx.fillRect(wx - 1.5, 60, 3, 3);
          if (fcx > W) { ctx.fillStyle = hz; ctx.beginPath(); ctx.moveTo(W - 4, 76); ctx.lineTo(W - 14, 70); ctx.lineTo(W - 14, 82); ctx.fill(); }
          ctx.restore();
        }
        // coins
        for (i = 0; i < coins.length; i++) {
          var c = coins[i];
          var cx = c.x - dist;
          if (cx < -20 || cx > W + 20) continue;
          ctx.save(); ctx.translate(cx, c.y); ctx.scale(0.35 + Math.abs(Math.cos(t * 4 + c.x * 0.02)) * 0.65, 1);
          ctx.drawImage(COIN_IMG, -12, -12); ctx.restore();
        }
        // power-up items
        for (i = 0; i < items.length; i++) {
          var it = items[i], ix = it.x - dist;
          if (ix < -30 || ix > W + 30) continue;
          var iy = it.y + Math.sin(t * 4 + it.x) * 3;
          ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(t * 6) * 0.15; ctx.strokeStyle = PW[it.kind].c; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(ix, iy, 19 + Math.sin(t * 6) * 2, 0, 7); ctx.stroke(); ctx.restore();
          badge(ctx, it.kind, ix, iy, 13, null);
        }
        // obstacles
        for (i = 0; i < obstacles.length; i++) {
          o = obstacles[i];
          if (o.kind === 'pit') continue;
          sx = o.x - dist;
          if (sx > W + 60 || sx < -90 || o.y < -o.h) continue;
          drawOb(ctx, o, sx, t);
        }

        // runner
        if (!dead) {
          var hh = curH();
          if (pw.dash > 0) {
            for (i = 1; i <= 5; i++) {
              var gh = ghosts[(gi - i + ghosts.length * 2) % ghosts.length];
              if (!gh.h) continue;
              ctx.globalAlpha = 0.32 * (1 - i / 6); ctx.fillStyle = PW.dash.c;
              ctx.fillRect(PX - i * 11, gh.y, SIZE, gh.h);
            }
            ctx.globalAlpha = 1;
          }
          var pcx = PX + SIZE / 2, pcy = y + hh / 2, shOn = pw.shield > 0 && (pw.shield > 2.5 || Math.sin(t * 22) > 0);
          if (shOn) { ctx.fillStyle = 'rgba(90,184,255,0.16)'; ctx.beginPath(); ctx.arc(pcx, pcy, 25, 0, 7); ctx.fill(); }
          var blink = invT > 0 && Math.sin(t * 40) > 0;
          if (!blink) {
            var bobY = grounded && started ? -Math.abs(Math.sin(runPh)) * 2.5 : 0;
            drawRunner(ctx, PX, y + hh + bobY, hh, grounded ? 0 : spin, sq, runPh, grounded, pw.dash > 0 ? '#ffc23a' : null);
          }
          if (pw.double > 0 && airJumps > 0 && !grounded) {
            ctx.save(); ctx.fillStyle = PW.double.c; ctx.globalAlpha = 0.8;
            ctx.beginPath(); ctx.moveTo(pcx - 18, pcy); ctx.lineTo(pcx - 30, pcy - 10 - Math.sin(t * 20) * 4); ctx.lineTo(pcx - 22, pcy + 4); ctx.fill();
            ctx.beginPath(); ctx.moveTo(pcx + 18, pcy); ctx.lineTo(pcx + 30, pcy - 10 - Math.sin(t * 20) * 4); ctx.lineTo(pcx + 22, pcy + 4); ctx.fill();
            ctx.restore();
          }
          if (pw.magnet > 0) {
            ctx.save(); ctx.strokeStyle = PW.magnet.c; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5; ctx.setLineDash([3, 7]);
            ctx.lineDashOffset = -t * 30;
            ctx.beginPath(); ctx.arc(pcx, pcy, 34 + Math.sin(t * 5) * 3, 0, 7); ctx.stroke(); ctx.restore();
          }
          if (shOn) {
            ctx.save();
            ctx.strokeStyle = PW.shield.c; ctx.shadowColor = PW.shield.c; ctx.shadowBlur = 14; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(pcx, pcy, 25 + Math.sin(t * 6) * 1.5, 0, 7); ctx.stroke();
            ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath(); ctx.arc(pcx, pcy, 20, t * 3, t * 3 + 0.9); ctx.stroke();
            ctx.restore();
          }
          if (ringT > 0) {
            ctx.save(); ctx.globalAlpha = ringT / 0.35; ctx.strokeStyle = '#fff4b8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(pcx, pcy, 20 + (0.35 - ringT) * 120, 0, 7); ctx.stroke(); ctx.restore();
          }
        } else {
          ctx.save(); ctx.fillStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
          for (i = 0; i < pieces.length; i++) {
            var p = pieces[i];
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = U.clamp(1.6 - deadT, 0, 1);
            ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
          }
          ctx.restore();
        }

        // HUD: active power-ups with timer rings, world progress
        var hx = 24;
        for (i = 0; i < 4; i++) {
          var pk = PW_KEYS[i];
          if (pw[pk] <= 0) continue;
          badge(ctx, pk, hx, 24, 12, pw[pk] / PW[pk].dur);
          hx += 40;
        }
        if (started) {
          var span = worldSpan(metres), fr = U.clamp((dist / 10 - span[0]) / (span[1] - span[0]), 0, 1);
          ctx.save();
          ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillStyle = WORLDS[wi].line; ctx.fillText(WORLDS[wi].name, W - 12, 16);
          ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(W - 112, 26, 100, 3);
          ctx.fillStyle = WORLDS[wi].line; ctx.fillRect(W - 112, 26, 100 * fr, 3);
          ctx.restore();
        }
        if (bannerT > 0 && started) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, bannerT) * 0.95;
          U.glowText(ctx, WORLDS[wi].name, W / 2, 78, 20, WORLDS[wi].line);
          ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(255,245,230,0.8)';
          ctx.fillText(metres < 50 ? 'GO!' : worldSpan(metres)[0] + ' m', W / 2, 104);
          ctx.restore();
        }
        if (closeFlash > 0) { ctx.fillStyle = 'rgba(255,244,184,' + (closeFlash * 0.5).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
        if (flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (flash * 0.45).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
        if (!started && !dead) {
          drawRunner(ctx, PX, GROUND, SIZE, 0, Math.sin(t * 4) * 0.05, runPh, true, null);
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP OR SPACE TO RUN', W / 2, 140, 15, '#ffd9a8');
          ctx.restore();
        }
      }
    };
  }

  function drawOb(ctx, o, sx, t) {
    var P = WORLDS[o.wi], k = o.kind, wv = o.wi, s, n;
    ctx.save();
    if (k === 'spike') {
      if (wv === 1) {                                   // cacti
        n = o.w > 30 ? 2 : 1;
        ctx.fillStyle = P.haz; ctx.shadowColor = P.haz; ctx.shadowBlur = 8;
        for (s = 0; s < n; s++) {
          var cx = sx + (n === 1 ? o.w / 2 : 11 + s * 24);
          U.roundRect(ctx, cx - 6, o.y, 12, o.h, 5); ctx.fill();
          U.roundRect(ctx, cx - 14, o.y + o.h * 0.35, 6, o.h * 0.3, 3); ctx.fill();
          U.roundRect(ctx, cx + 8, o.y + o.h * 0.25, 6, o.h * 0.3, 3); ctx.fill();
          ctx.fillRect(cx - 12, o.y + o.h * 0.58, 8, 4); ctx.fillRect(cx + 4, o.y + o.h * 0.5, 8, 4);
        }
      } else {
        ctx.fillStyle = P.haz; ctx.shadowColor = P.haz; ctx.shadowBlur = 12;
        n = Math.max(1, Math.round(o.w / 13));
        var w = o.w / n;
        ctx.beginPath();
        for (s = 0; s < n; s++) {
          var tip = wv === 3 ? o.y + (s % 2) * 8 : o.y;
          ctx.moveTo(sx + s * w, o.y + o.h); ctx.lineTo(sx + s * w + w / 2, tip); ctx.lineTo(sx + (s + 1) * w, o.y + o.h);
        }
        ctx.fill();
        if (wv === 3) { ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(sx + w / 2 - 1, o.y + 8, 2, o.h - 12); }
      }
    } else if (k === 'drone' || k === 'bob') {
      var bob = k === 'drone' ? Math.sin(t * 8 + o.ph) * 2 : 0;
      var yy = o.y + bob;
      if (k === 'bob') {
        ctx.strokeStyle = P.drone; ctx.globalAlpha = 0.3; ctx.setLineDash([2, 5]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx + o.w / 2, o.y0 - 26); ctx.lineTo(sx + o.w / 2, o.y0 + 22 + o.h + 4); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
      ctx.fillStyle = P.drone; ctx.shadowColor = P.drone; ctx.shadowBlur = 14;
      if (wv === 3) {
        ctx.fillRect(sx + 11, yy, 16, o.h);
        ctx.fillStyle = '#2a5bd7'; ctx.fillRect(sx - 2, yy + 3, 12, o.h - 6); ctx.fillRect(sx + 28, yy + 3, 12, o.h - 6);
        ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.fillRect(sx + 16, yy + 5, 5, 5);
      } else {
        U.roundRect(ctx, sx, yy, o.w, o.h, 5); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.fillRect(sx + 6, yy + 5, 5, 5);
        ctx.strokeStyle = P.drone; ctx.lineWidth = 2;
        var pr = Math.sin(t * 40 + o.ph) * 9;
        ctx.beginPath(); ctx.moveTo(sx + o.w / 2 - pr, yy - 4); ctx.lineTo(sx + o.w / 2 + pr, yy - 4); ctx.stroke();
      }
    } else if (k === 'fall' && o.st < 2 && (wv === 1 || wv === 3)) {
      if (wv === 3) {                                   // meteor with a fire trail
        var tg = ctx.createLinearGradient(0, o.y - 70, 0, o.y + o.h / 2);
        tg.addColorStop(0, 'rgba(255,120,40,0)'); tg.addColorStop(1, 'rgba(255,160,60,0.8)');
        ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(sx + 4, o.y + o.h / 2); ctx.lineTo(sx + o.w / 2, o.y - 70); ctx.lineTo(sx + o.w - 4, o.y + o.h / 2); ctx.fill();
      }
      rock(ctx, sx, o.y, o.w, o.h, wv === 3 ? '#6b4a3a' : P.fill, wv === 3 ? '#ff8a3c' : P.edge);
    } else if (k === 'fall' && (wv === 1 || wv === 3)) {
      rock(ctx, sx, o.y, o.w, o.h, wv === 3 ? '#4a3a40' : P.fill, wv === 3 ? '#ff8a3c' : P.edge);
    } else {
      // blocks, sliders, landed crates / signs
      ctx.fillStyle = P.fill; ctx.strokeStyle = k === 'fall' ? P.haz : P.edge; ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = wv === 2 ? 16 : 10; ctx.lineWidth = 2;
      if (wv === 1) { U.roundRect(ctx, sx, o.y, o.w, o.h, 5); ctx.fill(); ctx.stroke(); }
      else { ctx.fillRect(sx, o.y, o.w, o.h); ctx.strokeRect(sx + 1, o.y + 1, o.w - 2, o.h - 2); }
      ctx.shadowBlur = 0; ctx.globalAlpha = 0.4; ctx.beginPath();
      if (wv === 0) { for (s = o.y + 12; s < o.y + o.h; s += 12) { ctx.moveTo(sx + 2, s); ctx.lineTo(sx + o.w - 2, s); } }
      else if (wv === 1) { for (s = o.y + 10; s < o.y + o.h; s += 11) { ctx.moveTo(sx + 3, s); ctx.quadraticCurveTo(sx + o.w / 2, s + 3, sx + o.w - 3, s); } }
      else if (wv === 2) { ctx.moveTo(sx + 3, o.y + 3); ctx.lineTo(sx + o.w - 3, o.y + o.h - 3); ctx.moveTo(sx + o.w - 3, o.y + 3); ctx.lineTo(sx + 3, o.y + o.h - 3); }
      else { ctx.fillStyle = '#ffd23f'; ctx.globalAlpha = 0.7; for (s = 0; s < o.w; s += 8) ctx.fillRect(sx + s, o.y + 3, 4, 3); }
      ctx.stroke(); ctx.globalAlpha = 1;
      if (k === 'slider') {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(sx + 5, o.y + o.h / 2); ctx.lineTo(sx + 11, o.y + o.h / 2 - 5); ctx.lineTo(sx + 11, o.y + o.h / 2 + 5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(sx + o.w - 5, o.y + o.h / 2); ctx.lineTo(sx + o.w - 11, o.y + o.h / 2 - 5); ctx.lineTo(sx + o.w - 11, o.y + o.h / 2 + 5); ctx.fill();
        ctx.fillStyle = P.edge; ctx.globalAlpha = 0.5;
        ctx.fillRect(o.x0 - (o.x - sx) - 30, GROUND - 2, o.w + 60, 2);
      }
      if (k === 'fall' && wv === 2) {
        ctx.fillStyle = P.haz; ctx.font = '800 12px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('BTC', sx + o.w / 2, o.y + o.h / 2 + 1);
      }
    }
    ctx.restore();
  }
  function rock(ctx, x, y, w, h, fill, edge) {
    ctx.fillStyle = fill; ctx.strokeStyle = edge; ctx.lineWidth = 2; ctx.shadowColor = edge; ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + h); ctx.lineTo(x, y + h * 0.55); ctx.lineTo(x + w * 0.15, y + h * 0.15); ctx.lineTo(x + w * 0.55, y);
    ctx.lineTo(x + w * 0.95, y + h * 0.25); ctx.lineTo(x + w, y + h * 0.7); ctx.lineTo(x + w * 0.8, y + h); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.arc(x + w * 0.4, y + h * 0.45, w * 0.1, 0, 7); ctx.arc(x + w * 0.68, y + h * 0.68, w * 0.07, 0, 7); ctx.fill();
  }

  // Cabinet preview: tours all four worlds with a runner hopping a spike and a coin arc.
  function attract(ctx, w, h, t) {
    var s = Math.max(w / W, h / H), tx = -Math.min((W * s - w) / 2, 40 * s);
    var vx0 = -tx / s, vx1 = vx0 + w / s;          // visible playfield span
    ctx.save();
    ctx.translate(tx, h - H * s);
    ctx.scale(s, s);
    var cyc = t / 4.5, wi = Math.floor(cyc) % 4, f = cyc % 1, dist = t * 300;
    drawWorld(ctx, wi, dist);
    if (f < 0.2 && t > 1) { ctx.save(); ctx.globalAlpha = 1 - f / 0.2; drawWorld(ctx, (wi + 3) % 4, dist); ctx.restore(); }
    var P = WORLDS[wi], per = 1.5, ph = (t % per) / per, ox = W + 40 - ph * (W + 160);
    // speed lines
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (var k = 0; k < 6; k++) ctx.fillRect(((k * 173 - t * 900) % (W + 200) + W + 200) % (W + 200) - 100, 40 + k * 34, 60, 1.5);
    // coin arc over the spike
    for (k = 0; k < 5; k++) {
      var cx = ox + 13 + (k - 2) * 34;
      if (cx < PX + 15) continue;
      var cy = GROUND - 15 - Math.sin((k + 1) / 6 * Math.PI) * 95;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(0.4 + Math.abs(Math.cos(t * 4 + k)) * 0.6, 1);
      ctx.fillStyle = COIN; ctx.shadowColor = COIN; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0); ctx.fill(); ctx.restore();
    }
    drawOb(ctx, { kind: 'spike', wi: wi, x: ox, x0: ox, y: GROUND - 34, y0: GROUND - 34, w: 26, h: 34, ph: 0, st: 2 }, ox, t);
    var dx = ox - PX, jp = dx < 150 && dx > -60 ? (150 - dx) / 210 : -1;
    var jy = jp >= 0 ? Math.sin(jp * Math.PI) * 100 : 0;
    var shielded = wi === 1 || wi === 3;
    drawRunner(ctx, PX, GROUND - jy, SIZE, jp >= 0 ? jp * Math.PI : 0, 0, t * 18, jp < 0, null);
    if (shielded) {
      ctx.save(); ctx.strokeStyle = PW.shield.c; ctx.shadowColor = PW.shield.c; ctx.shadowBlur = 12; ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(90,184,255,0.13)';
      ctx.beginPath(); ctx.arc(PX + 15, GROUND - jy - 15, 25, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    badge(ctx, shielded ? 'shield' : wi === 0 ? 'double' : 'magnet', vx1 - 26, 58, 13, 1 - f);
    U.glowText(ctx, P.name, vx1 - 12, 24, 16, P.line, 'right');
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_block_runner',
    order: 5,
    title: 'Block Runner',
    tagline: 'City, dunes, neon, orbit. Keep running.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP TO JUMP · HOLD FOR HEIGHT · SWIPE DOWN TO DUCK',
    controls: 'Space / ↑ jump (hold for height, again in air with DOUBLE) · ↓ duck',
    create: create,
    attract: attract
  });
})(window);

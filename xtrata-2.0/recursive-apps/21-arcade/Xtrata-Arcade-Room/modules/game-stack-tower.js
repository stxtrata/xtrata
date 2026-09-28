/*
 * Xtrata Arcade cartridge #8 - STACK TOWER (v2)
 * A slab slides back and forth over the tower; tap to drop it. Whatever
 * overhangs is sliced off and tumbles away. Land it perfectly to keep its
 * full width; three perfects in a row repair a trimmed edge.
 *
 * The climb: the camera rises through five altitude bands - Ground, Skyline,
 * Clouds, Stratosphere and Space - with a sky that shifts continuously with
 * height. Special slabs turn up now and then: GOLD (bonus points), WIDE
 * (arrives wider and lets you win width back) and ICE (slides a fixed
 * distance after landing - its ghost shows exactly where it will settle).
 * Tall towers sway gently; the moving slab sways with the top, so what you
 * see is exactly what you get.
 *
 * Music: G major groove; every floor writes the next note of a climbing
 * melody, perfects ring a bell two octaves up, the key rises every ten
 * floors and each altitude band re-arranges the band (scale, layers, filter).
 *
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
  var GROUND = BASE_Y + SLAB_H;           // street level (world y)
  var FOCUS = 300, FOCUS_ALT = BASE_Y - 300;   // parallax anchor
  var ICE_SLIDE = 22, WIDE_GRACE = 24, REPAIR = 12;
  var ACCENT = '#ffd23f', GOLD = '#ffcf3a', WIDEC = '#7dff9a', ICEC = '#bff4ff';

  var BANDS = [
    { name: 'GROUND', from: 0, scale: 'major', filter: 18000, on: [], off: [] },
    { name: 'SKYLINE', from: 12, scale: 'mixolydian', filter: 14000, on: ['dusk'], off: [] },
    { name: 'CLOUDS', from: 28, scale: 'lydian', filter: 8000, on: ['dusk', 'air'], off: ['clap'] },
    { name: 'STRATOSPHERE', from: 48, scale: 'dorian', filter: 5200, on: ['air', 'aurora'], off: ['clap', 'shaker'] },
    { name: 'SPACE', from: 72, scale: 'lydian', filter: 3600, on: ['aurora', 'orbit'], off: ['clap', 'shaker', 'kick', 'counter'] }
  ];
  var BAND_TRACKS = ['dusk', 'air', 'aurora', 'orbit', 'clap', 'shaker', 'kick', 'counter'];
  function bandOf(f) { for (var i = BANDS.length - 1; i > 0; i--) if (f >= BANDS[i].from) return i; return 0; }
  // Sky keyframes by floor: [floor, top colour, horizon colour]
  var SKY = [
    [0, 0x4a8fd8, 0xbfe2ff], [9, 0x4a8fd8, 0xbfe2ff], [15, 0x3c5eae, 0xffb877], [22, 0x2a2466, 0xff7a59], [30, 0x1d2a5e, 0x8a7fb8],
    [44, 0x121a46, 0x3d4f8f], [56, 0x050a24, 0x173066], [72, 0x010208, 0x0a1030], [110, 0x000000, 0x05081a]
  ];
  // Altitude in metres, log-ish between anchors so the top of the sky feels high.
  var ALT = [[0, 0], [12, 45], [28, 420], [48, 4200], [72, 32000], [100, 100000]];
  function altitude(f) {
    for (var i = 1; i < ALT.length; i++) {
      if (f <= ALT[i][0]) {
        var a = ALT[i - 1], b = ALT[i], k = (f - a[0]) / (b[0] - a[0]);
        return a[1] === 0 ? b[1] * k : a[1] * Math.pow(b[1] / a[1], k);
      }
    }
    return 100000 + (f - 100) * 4000;
  }
  function altText(f) { var m = altitude(f); return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(m < 10000 ? 2 : 1) + ' km'; }
  function smooth(a, b, x) { var k = U.clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
  function rgb(c) { return 'rgb(' + (c >> 16 & 255) + ',' + (c >> 8 & 255) + ',' + (c & 255) + ')'; }
  function mixc(a, b, k) {
    return ((((a >> 16 & 255) * (1 - k) + (b >> 16 & 255) * k) | 0) << 16) |
      ((((a >> 8 & 255) * (1 - k) + (b >> 8 & 255) * k) | 0) << 8) | (((a & 255) * (1 - k) + (b & 255) * k) | 0);
  }
  function skyAt(f) {
    for (var i = 1; i < SKY.length; i++) {
      if (f <= SKY[i][0]) { var k = (f - SKY[i - 1][0]) / (SKY[i][0] - SKY[i - 1][0]); return [mixc(SKY[i - 1][1], SKY[i][1], k), mixc(SKY[i - 1][2], SKY[i][2], k)]; }
    }
    return [SKY[SKY.length - 1][1], SKY[SKY.length - 1][2]];
  }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function hue(n) { var k = (n % 28) / 14; return 222 + 120 * (k < 1 ? k : 2 - k); }   // indigo..rose, never gold/green/cyan
  function col(n, l, kind) {
    if (kind === 'gold') return 'hsl(45,95%,' + l + '%)';
    if (kind === 'wide') return 'hsl(135,80%,' + l + '%)';
    if (kind === 'ice') return 'hsl(190,85%,' + Math.min(92, l + 16) + '%)';
    return 'hsl(' + hue(n) + ',85%,' + l + '%)';
  }

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
          fn: function (i) { return i.rng() < 0.5 ? { deg: [0, 2, 4][Math.floor(i.rng() * 3)], vel: 0.5 } : null; } },
        // band layers: never on by intensity, switched per altitude band
        { name: 'dusk', inst: 'arp', layer: 2, gain: 0.2, chord: true, octave: 1, rate: 2,
          fn: function (i) { return { deg: [0, 2, 4, 7, 4, 2, 4, 6][(i.step / 2) % 8], vel: 0.55 }; } },
        { name: 'air', inst: 'pluck', layer: 2, gain: 0.3, chord: true, octave: 1, params: { decay: 0.5, cutoff: 3200 },
          fn: function (i) { var k = i.step % 12; return k % 3 ? null : { deg: [0, 4, 7, 4][k / 3], vel: 0.45 }; } },
        { name: 'aurora', inst: 'pad', layer: 2, gain: 0.26, chord: true, octave: 0, params: { cutoff: 2200, attack: 1.2, release: 2 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 4, steps: 32 }, { deg: 6, steps: 32 }] : null; } },
        { name: 'orbit', inst: 'bell', layer: 2, gain: 0.3, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.28 ? { deg: [0, 1, 4, 6, 7][Math.floor(i.rng() * 5)], vel: 0.45 } : null; } }
      ]
    };
  }

  /* ------------------------------------------------------------ slab */
  function slab(ctx, x, y, w, n, kind, night, alpha, t) {
    ctx.save();
    if (alpha != null && alpha < 1) ctx.globalAlpha = alpha;
    ctx.fillStyle = col(n, 72, kind);              // top face (slanted back)
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + DEPTH, y - DEPTH); ctx.lineTo(x + w + DEPTH, y - DEPTH); ctx.lineTo(x + w, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x + 2, y - 2, w - 2, 2);
    ctx.fillStyle = col(n, 36, kind);              // side face
    ctx.beginPath();
    ctx.moveTo(x + w, y); ctx.lineTo(x + w + DEPTH, y - DEPTH); ctx.lineTo(x + w + DEPTH, y - DEPTH + SLAB_H); ctx.lineTo(x + w, y + SLAB_H);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = col(n, 54, kind);              // front face
    ctx.fillRect(x, y, w, SLAB_H);
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(x, y + SLAB_H * 0.6, w, SLAB_H * 0.4);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x, y + SLAB_H - 1, w, 1);
    if (kind === 'gold' || kind === 'ice') {       // moving sheen
      var sx = x + ((t * (kind === 'gold' ? 120 : 60) + n * 37) % (w + 60)) - 30;
      var c = function (v) { return U.clamp(v, x, x + w); };
      ctx.fillStyle = 'rgba(255,255,255,' + (kind === 'gold' ? 0.45 : 0.35) + ')';
      ctx.beginPath(); ctx.moveTo(c(sx), y); ctx.lineTo(c(sx + 10), y); ctx.lineTo(c(sx + 2), y + SLAB_H); ctx.lineTo(c(sx - 8), y + SLAB_H); ctx.fill();
    }
    if (night > 0.05 && !kind) {                   // lit windows
      ctx.fillStyle = 'rgba(255,226,150,' + (night * 0.9).toFixed(2) + ')';
      for (var k = 0, wx = x + 6; wx + 6 < x + w; wx += 13, k++) {
        if (hash(n * 31 + k) > 0.42) ctx.fillRect(wx, y + 7, 6, 9);
      }
    }
    ctx.restore();
  }
  function label(ctx, x, y, w, kind, dir, t) {
    var txt = kind === 'gold' ? 'GOLD' : kind === 'wide' ? '< WIDE >' : 'ICE ' + (dir > 0 ? '>>' : '<<');
    ctx.save();
    ctx.font = '800 10px ui-monospace, Menlo, Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = kind === 'gold' ? '#5a3a00' : kind === 'wide' ? '#063d17' : '#0b4a5c';
    ctx.globalAlpha = 0.75 + Math.sin(t * 8) * 0.25;
    ctx.fillText(txt, x + w / 2, y + SLAB_H / 2 + 1);
    ctx.restore();
  }

  /* -------------------------------------------------------- scenery */
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function cityLayer(r, h, minH, maxH, bw, color, winColor, density) {
    var c = canvas(W, h), w = canvas(W, h), g = c.getContext('2d'), gw = w.getContext('2d');
    g.fillStyle = color; gw.fillStyle = winColor;
    for (var x = -10; x < W + 10;) {
      var bwid = bw * (0.6 + r() * 0.8), bh = minH + r() * (maxH - minH);
      g.fillRect(x, h - bh, bwid, bh);
      if (r() < 0.35) g.fillRect(x + bwid * 0.4, h - bh - 14, 2, 14);        // antenna
      for (var yy = h - bh + 6; yy < h - 4; yy += 7) for (var xx = x + 3; xx < x + bwid - 3; xx += 5) if (r() < density) gw.fillRect(xx, yy, 2, 3);
      x += bwid + r() * 3;
    }
    return { img: c, win: w, h: h };
  }
  function groundLayer(r) {
    var h = 260, c = canvas(W, h), g = c.getContext('2d'), wc = canvas(W, h), gw = wc.getContext('2d');
    var street = h - 40;
    var bx = [[0, 70, 150, '#5a6c8c'], [66, 52, 105, '#7a7f9a'], [300, 60, 170, '#56688a'], [352, 56, 120, '#6e7894'], [150, 90, 80, '#65708f']];
    bx.forEach(function (b) {
      g.fillStyle = b[3]; g.fillRect(b[0], street - b[2], b[1], b[2]);
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(b[0] + b[1] - 8, street - b[2], 8, b[2]);
      for (var yy = street - b[2] + 8; yy < street - 10; yy += 14) for (var xx = b[0] + 6; xx < b[0] + b[1] - 12; xx += 11) {
        g.fillStyle = 'rgba(160,200,240,0.55)'; g.fillRect(xx, yy, 6, 8);
        if (r() < 0.55) { gw.fillStyle = '#ffd98a'; gw.fillRect(xx, yy, 6, 8); }
      }
    });
    g.fillStyle = '#8d8f9e'; g.fillRect(0, street - 6, W, 8);                 // pavement
    g.fillStyle = '#2d2f3a'; g.fillRect(0, street + 2, W, 38);                // road
    g.fillStyle = '#e8e3c8';
    for (var d = 8; d < W; d += 34) g.fillRect(d, street + 19, 18, 3);
    for (var i = 0; i < 9; i++) {                                              // trees
      var tx = 14 + i * 46 + r() * 12, th = 26 + r() * 16;
      g.fillStyle = '#5b3d25'; g.fillRect(tx - 2, street - 6 - th * 0.5, 4, th * 0.5);
      g.fillStyle = i % 2 ? '#2f8a4a' : '#3aa35a';
      g.beginPath(); g.arc(tx, street - 6 - th * 0.6, th * 0.38, 0, 7); g.arc(tx - 6, street - th * 0.45, th * 0.28, 0, 7); g.arc(tx + 6, street - th * 0.45, th * 0.28, 0, 7); g.fill();
    }
    return { img: c, win: wc, h: h, street: street };
  }
  function cloudSprite(r, w, h, tint) {
    var c = canvas(w, h), g = c.getContext('2d');
    for (var i = 0; i < 14; i++) {
      var cx = w * 0.15 + r() * w * 0.7, cy = h * 0.55 + (r() - 0.5) * h * 0.25, rad = h * (0.18 + r() * 0.22);
      var gr = g.createRadialGradient(cx, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
      gr.addColorStop(0, tint); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
    }
    return c;
  }
  function seaOfClouds(r) {
    var c = canvas(W, 140), g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 20, 0, 140);
    gr.addColorStop(0, '#b9c3ec'); gr.addColorStop(1, '#46558f');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, 140);
    for (var x = 0; x <= W; x += 20) g.lineTo(x, 34 + Math.sin(x * 0.05) * 8 + r() * 10);
    g.lineTo(W, 140); g.fill();
    for (var i = 0; i < 26; i++) {
      var cx = r() * W, cy = 36 + r() * 30, rad = 12 + r() * 22;
      g.fillStyle = 'rgba(220,228,255,' + (0.25 + r() * 0.3) + ')';
      g.beginPath(); g.arc(cx, cy, rad, Math.PI, 0); g.fill();
    }
    return c;
  }
  function starField(r) {
    var c = canvas(W, H), g = c.getContext('2d');
    for (var i = 0; i < 190; i++) {
      var s = r();
      g.fillStyle = s > 0.9 ? '#ffe9c4' : s > 0.8 ? '#c4dcff' : '#ffffff';
      g.globalAlpha = 0.35 + r() * 0.65;
      g.fillRect(r() * W, r() * H, s > 0.93 ? 2 : 1, s > 0.93 ? 2 : 1);
    }
    return c;
  }

  function create(api) {
    var rng = api.rng;                                       // gameplay only
    var srng = U.rng((api.seed ^ 0x51ce7) >>> 0);           // scenery only
    var tower = [{ x: (W - BASE_W) / 2 - DEPTH / 2, w: BASE_W, kind: null }];
    var cur = null, sliding = null;
    var debris = [], dust = [], rings = [], flyers = [];
    var cam = 0, camTarget = 0;
    var perfectRun = 0, lastSpecial = 0;
    var over = false, overT = 0, t = 0;
    var mInt = -1, band = 0, banner = null, flyT = 2;

    var S = {
      ground: groundLayer(srng),
      far: cityLayer(srng, 160, 30, 120, 22, '#2c3566', '#ffd98a', 0.18),
      mid: cityLayer(srng, 200, 50, 170, 34, '#1d2248', '#ffcf7a', 0.22),
      clouds: [cloudSprite(srng, 200, 80, 'rgba(255,255,255,0.9)'), cloudSprite(srng, 150, 60, 'rgba(255,245,250,0.85)'), cloudSprite(srng, 260, 90, 'rgba(240,244,255,0.85)')],
      sea: seaOfClouds(srng),
      stars: starField(srng)
    };
    var clouds = [];
    for (var ci = 0; ci < 36; ci++) {
      var p = ci < 10 ? 0.45 + srng() * 0.2 : ci < 28 ? 0.85 + srng() * 0.3 : 1.35 + srng() * 0.3;
      clouds.push({ a: (26 + ci * 0.6 + srng() * 8) * SLAB_H * (ci < 10 ? 1.2 : 1), x: srng() * (W + 200) - 200, p: p, s: ci % 3, v: 6 + srng() * 14, front: p > 1.2 });
    }

    function yOf(i) { return BASE_Y - i * SLAB_H; }
    function para(a, p) { return FOCUS - (a - (FOCUS_ALT + cam)) * p; }
    function camFloor() { return cam / SLAB_H + 9; }
    function swayAmp(i) { return 16 * U.clamp((i - 20) / 80, 0, 1); }
    function sway(i) { return swayAmp(i) * Math.sin(t * 1.25); }
    function nightness() { return smooth(15, 26, camFloor()); }
    function floors() { return tower.length - 1; }

    function spawn() {
      var n = tower.length, top = tower[n - 1];
      var speed = Math.min(430, 150 + n * 7);
      var fromLeft = n % 2 === 0;
      var kind = null, w = top.w;
      if (n >= 6 && n - lastSpecial >= 4) {
        var r = rng();
        var wideP = top.w < BASE_W - 30 ? 0.02 + 0.12 * (1 - top.w / BASE_W) : 0;
        if (r < 0.06) kind = 'gold';
        else if (r < 0.06 + wideP) kind = 'wide';
        else if (n >= 10 && r < 0.11 + wideP) kind = 'ice';
      }
      if (kind === 'wide') w = Math.min(BASE_W, top.w + WIDE_GRACE * 2);
      if (kind) lastSpecial = n;
      cur = { x: fromLeft ? -w * 0.35 : W - w * 0.65, w: w, dir: fromLeft ? 1 : -1, speed: speed, kind: kind };
    }
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });
    spawn();

    function tuneDeg(n) { return TUNE[Math.floor((n - 1) / 10) % TUNE.length][(n - 1) % 10]; }
    function syncMusic(m) {
      var iv = Math.round(U.clamp(floors() / 40 + Math.min(perfectRun, 6) * 0.07, 0, 1) * 20) / 20;
      if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
      var n = floors();
      if (n > 0 && n % 10 === 0) {
        m.setKey(KEYS[(n / 10) % KEYS.length]);
        m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4, steps: 6 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
        m.note('riser', 0, { dur: 0.6, gain: 0.3 });
      }
    }
    function enterBand(b) {
      band = b;
      var B = BANDS[b];
      banner = { text: B.name, sub: altText(B.from) + '   NEW ALTITUDE +250', t: 0 };
      api.addScore(250);
      var m = M();
      if (!m) { api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'triangle', vol: 0.18 }); return; }
      m.setScale(B.scale);
      m.setFilter(B.filter, 2.5);
      for (var i = 0; i < BAND_TRACKS.length; i++) {
        var nm = BAND_TRACKS[i];
        m.setTrack(nm, B.on.indexOf(nm) >= 0 ? true : B.off.indexOf(nm) >= 0 ? false : null);
      }
      m.note('riser', 0, { dur: 1.4, gain: 0.35 });
      m.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 9, at: 6 }, { deg: 11, at: 8, steps: 8 }], { inst: 'bell', quantize: 'bar', octave: 1, gain: 0.6 });
    }

    function addDebris(x, y, w, n, kind, dir) {
      debris.push({ x: x, y: y, w: w, n: n, kind: kind, vy: -60, vx: dir * (50 + w * 0.6), rot: 0, vr: dir * (1.2 + 40 / Math.max(8, w)) });
      for (var i = 0; i < 8; i++) {
        dust.push({ x: dir > 0 ? x : x + w, y: y + SLAB_H * (0.2 + srng() * 0.8), vx: dir * (20 + srng() * 60), vy: -20 - srng() * 50, r: 3 + srng() * 5, life: 0.7 + srng() * 0.4, max: 1.1 });
      }
    }

    function drop() {
      if (cur.kind === 'ice') {
        sliding = { x0: cur.x, x1: cur.x + cur.dir * ICE_SLIDE, w: cur.w, dir: cur.dir, t: 0, kind: cur.kind };
        cur = null;
        api.audio.noise(0.28, { cutoff: 5000, vol: 0.12 });
        return;
      }
      land(cur.x, cur.w, cur.kind, cur.dir);
    }

    function land(cx, cw, kind, dir) {
      var n = tower.length, top = tower[n - 1], y = yOf(n), sw = sway(n);
      var lo = top.x - (kind === 'wide' ? WIDE_GRACE : 0), hi = top.x + top.w + (kind === 'wide' ? WIDE_GRACE : 0);
      var left = Math.max(cx, lo), right = Math.min(cx + cw, hi), overlap = right - left;
      if (Math.min(cx + cw, top.x + top.w) - Math.max(cx, top.x) <= 0) {
        debris.push({ x: cx + sw, y: y, w: cw, n: n, kind: kind, vy: 0, vx: dir * 60, rot: 0, vr: dir * 1.2 });
        cur = null; over = true;
        api.shake(10);
        api.audio.tone(220, 0.5, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
        if (M()) M().setFilter(700, 1.2);
        return;
      }
      var off = (cx + cw / 2) - (top.x + top.w / 2);
      var mp = M(), x, w, pts = 10, cxs;
      if (Math.abs(off) <= PERFECT) {
        perfectRun++;
        w = kind === 'wide' ? cw : top.w;
        var repaired = perfectRun >= 3 && w < BASE_W;
        if (repaired) w = Math.min(BASE_W, w + REPAIR);
        x = top.x + top.w / 2 - w / 2;
        tower.push({ x: x, w: w, kind: kind, glow: repaired ? 1 : 0, land: 1 });
        pts += 10 * Math.min(perfectRun, 10) + (perfectRun % 5 === 0 ? 100 : 0);
        cxs = x + w / 2 + sw;
        rings.push({ x: cxs, y: y + SLAB_H / 2, w: w, t: 0, c: kind === 'gold' ? GOLD : '#ffffff' });
        api.fx.text(cxs, y - 26 + cam, perfectRun > 1 ? 'PERFECT x' + perfectRun : 'PERFECT', '#ffffff', 13);
        api.fx.burst(cxs, y + cam, col(n, 70, kind), 22, 190, 0.55);
        if (mp) mp.note('bell', tuneDeg(n), { quantize: '16', octave: 2, gain: 0.7 + Math.min(perfectRun, 5) * 0.04 });
        else api.audio.tone(440 * Math.pow(1.0595, Math.min(perfectRun, 24) * 2), 0.14, { type: 'triangle', vol: 0.2 });
        if (repaired) {
          api.fx.text(cxs, y - 46 + cam, 'REPAIR +' + REPAIR, '#7dffb0', 11);
          api.fx.burst(x + sw, y + cam + SLAB_H / 2, '#7dffb0', 14, 150, 0.6);
          api.fx.burst(x + w + sw, y + cam + SLAB_H / 2, '#7dffb0', 14, 150, 0.6);
          if (mp) mp.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 3 }], { inst: 'marimba', quantize: '8', octave: 1, gain: 0.5 });
          else api.audio.arp([660, 830, 990], 0.05, { type: 'triangle', vol: 0.15 });
        }
      } else {
        perfectRun = 0;
        x = left; w = overlap;
        tower.push({ x: x, w: w, kind: kind, land: 1 });
        var cut = cw - overlap;
        if (cut > 0.5) {
          if (cx < left) addDebris(cx + sw, y, left - cx, n, kind, -1);
          if (cx + cw > right) addDebris(right + sw, y, cx + cw - right, n, kind, 1);
          api.shake(cut > 40 ? 7 : cut > 18 ? 4 : 2);
        }
        if (mp) {
          mp.note('pluck', tuneDeg(n), { quantize: '16', octave: 1, gain: 0.45, params: { cutoff: 2600 } });
          mp.note('marimba', tuneDeg(n) + 1, { quantize: '16', octave: 0, gain: 0.18 });   // soft rub = "off" note
        } else api.audio.tone(300 + Math.min(n, 40) * 6, 0.07, { type: 'square', vol: 0.12 });
        api.audio.noise(0.12, { cutoff: 900, vol: 0.12 });
      }
      if (kind === 'gold') {
        var g = Math.abs(off) <= PERFECT ? 150 : 50;
        pts += g;
        api.fx.text(x + w / 2 + sw, y - 66 + cam, 'GOLD +' + g, GOLD, 12);
        api.fx.burst(x + w / 2 + sw, y + cam, GOLD, 26, 220, 0.8);
        if (mp) mp.stinger([{ deg: 4 }, { deg: 7, at: 1 }, { deg: 9, at: 2 }, { deg: 11, at: 3, steps: 4 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.5 });
      } else if (kind === 'wide' && mp) mp.note('pluck', 7, { quantize: '16', octave: 1, gain: 0.4 });
      else if (kind === 'ice' && mp) mp.note('bell', tuneDeg(n) + 2, { quantize: '16', octave: 1, gain: 0.35 });
      api.addScore(pts);
      if (M()) syncMusic(M());
      camTarget = Math.max(0, (tower.length - 9) * SLAB_H);
      var b = bandOf(floors());
      if (b > band) enterBand(b);
      spawn();
    }

    function spawnFlyer() {
      var f = camFloor(), a = (FOCUS_ALT + cam) + 120 + srng() * 160, dir = srng() < 0.5 ? 1 : -1;
      var kind = f < 26 ? 'birds' : f < 50 ? 'plane' : f > 66 ? 'sat' : null;
      if (!kind) return;
      flyers.push({ kind: kind, a: a, p: kind === 'sat' ? 0.15 : 0.8, x: dir > 0 ? -60 : W + 60, vx: dir * (kind === 'plane' ? 60 : kind === 'sat' ? 22 : 45), ph: srng() * 6 });
    }

    return {
      // Read-only test hook.
      debug: function () {
        var top = tower[tower.length - 1];
        return { floors: floors(), width: top.w, band: band, bandName: BANDS[band].name, streak: perfectRun, special: cur ? cur.kind : null,
          dead: over, sliding: !!sliding, cur: cur && { x: cur.x, w: cur.w, dir: cur.dir, speed: cur.speed, kind: cur.kind },
          top: { x: top.x, w: top.w }, altitude: Math.round(altitude(floors())), iceSlide: ICE_SLIDE, wideGrace: WIDE_GRACE, cam: cam };
      },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        cam += (camTarget - cam) * Math.min(1, dt * (over ? 2.2 : 5));
        var i;
        for (i = debris.length - 1; i >= 0; i--) {
          var d = debris[i];
          d.vy += 1300 * dt; d.y += d.vy * dt; d.x += d.vx * dt; d.rot += d.vr * dt;
          if (d.y + cam > H + 200) debris.splice(i, 1);
        }
        for (i = dust.length - 1; i >= 0; i--) {
          var p = dust[i];
          p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy *= 0.94; p.r += dt * 10;
          if (p.life <= 0) dust.splice(i, 1);
        }
        for (i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t > 0.7) rings.splice(i, 1); }
        for (i = tower.length - 1; i >= Math.max(0, tower.length - 4); i--) {
          if (tower[i].glow) tower[i].glow = Math.max(0, tower[i].glow - dt * 0.8);
          if (tower[i].land) tower[i].land = Math.max(0, tower[i].land - dt * 5);
        }
        clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > W + 150) c.x = -280; });
        flyT -= dt;
        if (flyT <= 0) { flyT = 4 + srng() * 5; spawnFlyer(); }
        for (i = flyers.length - 1; i >= 0; i--) { flyers[i].x += flyers[i].vx * dt; if (flyers[i].x < -90 || flyers[i].x > W + 90) flyers.splice(i, 1); }
        if (banner) { banner.t += dt; if (banner.t > 2.8) banner = null; }
        if (over) {
          overT += dt;
          camTarget = 0;                           // pan down the whole tower before ending
          if (overT > 2.2) api.gameOver();
          return;
        }
        if (sliding) {
          sliding.t += dt;
          if (sliding.t >= 0.28) { var s = sliding; sliding = null; land(s.x1, s.w, s.kind, s.dir); }
          return;
        }
        cur.x += cur.dir * cur.speed * dt;
        if (cur.dir > 0 && cur.x + cur.w > W + 20) cur.dir = -1;
        if (cur.dir < 0 && cur.x < -20) cur.dir = 1;
        if (inp.hit('a') || inp.hit('hold') || inp.hit('up') || inp.hit('down')) drop();
        api.setStatus(BANDS[band].name + ' | FLOOR ' + floors() + ' | ' + altText(floors()) + (perfectRun > 1 ? ' | PERFECT x' + perfectRun : ''));
      },

      render: function (ctx) {
        var cf = camFloor(), sky = skyAt(cf), night = nightness(), i;
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, rgb(sky[0])); g.addColorStop(1, rgb(sky[1]));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        var starA = smooth(30, 56, cf);
        if (starA > 0.01) {
          var so = (cam * 0.03) % H;
          ctx.globalAlpha = starA;
          ctx.drawImage(S.stars, 0, so - H); ctx.drawImage(S.stars, 0, so);
          ctx.globalAlpha = 1;
        }
        var sunA = 1 - smooth(14, 26, cf);                         // low sun
        if (sunA > 0.01) {
          var sy = 150 + cf * 12, sg = ctx.createRadialGradient(310, sy, 4, 310, sy, 90);
          sg.addColorStop(0, 'rgba(255,240,200,' + (0.9 * sunA) + ')'); sg.addColorStop(0.2, 'rgba(255,200,120,' + (0.4 * sunA) + ')'); sg.addColorStop(1, 'rgba(255,160,90,0)');
          ctx.fillStyle = sg; ctx.fillRect(210, sy - 90, 200, 180);
        }
        // aurora in the stratosphere
        var aurA = smooth(44, 54, cf) * (1 - smooth(74, 88, cf));
        if (aurA > 0.01) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (var k = 0; k < 3; k++) {
            var base = 120 + k * 50, ag = ctx.createLinearGradient(0, base - 60, 0, base + 70);
            ag.addColorStop(0, 'rgba(80,255,170,0)'); ag.addColorStop(0.55, k === 1 ? 'rgba(170,110,255,0.35)' : 'rgba(80,255,170,0.35)'); ag.addColorStop(1, 'rgba(80,255,170,0)');
            ctx.fillStyle = ag;
            for (var x = 0; x < W; x += 4) {
              var off = Math.sin(x * 0.018 + t * 0.4 + k * 2) * 26 + Math.sin(x * 0.051 - t * 0.7) * 8;
              ctx.globalAlpha = aurA * (0.45 + 0.55 * Math.abs(Math.sin(x * 0.03 + t * 0.9 + k)));
              ctx.fillRect(x, base - 60 + off, 4, 130);
            }
          }
          ctx.restore();
        }
        // earth curve in space
        var spaceA = smooth(62, 78, cf);
        if (spaceA > 0.01) {
          var R = 1100, ey = H + R - 40 - 90 * spaceA;
          var eg = ctx.createRadialGradient(W / 2, ey, R - 140, W / 2, ey, R + 40);
          eg.addColorStop(0, '#0b2a6b'); eg.addColorStop(0.85, '#2a7fd0'); eg.addColorStop(0.965, '#9fe4ff'); eg.addColorStop(1, 'rgba(120,200,255,0)');
          ctx.globalAlpha = spaceA; ctx.fillStyle = eg;
          ctx.beginPath(); ctx.arc(W / 2, ey, R + 40, 0, 7); ctx.fill();
          ctx.globalAlpha = 1;
        }
        // distant city layers (parallax), fading into silhouettes at dusk
        var cityA = 1 - smooth(30, 42, cf);
        [[S.far, 0.3, 0.3], [S.mid, 0.5, 0.55]].forEach(function (L) {
          var by = para(-120, L[1]);
          if (by - L[0].h > H || cityA <= 0) return;
          ctx.globalAlpha = (L[2] + night * (1 - L[2])) * cityA;
          ctx.drawImage(L[0].img, 0, by - L[0].h);
          ctx.fillStyle = L[0] === S.far ? '#2c3566' : '#1d2248';
          if (by < H) ctx.fillRect(0, by, W, H - by);
          ctx.globalAlpha = night * cityA;
          if (night > 0.02) ctx.drawImage(L[0].win, 0, by - L[0].h);
          ctx.globalAlpha = 1;
        });
        // far clouds, then the sea of clouds seen from above
        var cloudA = smooth(18, 28, cf) * (1 - smooth(52, 62, cf));
        function drawClouds(front) {
          clouds.forEach(function (c) {
            if (c.front !== front || c.p > 1.2 && !front) return;
            var y = para(c.a, c.p), img = S.clouds[c.s];
            if (y < -img.height || y > H + img.height) return;
            ctx.globalAlpha = cloudA * (front ? 0.55 : c.p < 0.7 ? 0.6 : 0.9) * (1 - night * 0.3);
            ctx.drawImage(img, c.x, y - img.height / 2, img.width * c.p, img.height * c.p);
          });
          ctx.globalAlpha = 1;
        }
        drawClouds(false);
        var seaA = smooth(44, 52, cf) * (1 - smooth(66, 76, cf));
        if (seaA > 0.01) {
          var sy2 = para(40 * SLAB_H, 0.6), sx2 = (t * 8) % W;
          ctx.globalAlpha = seaA;
          ctx.drawImage(S.sea, sx2 - W, sy2); ctx.drawImage(S.sea, sx2, sy2);
          ctx.fillStyle = '#46558f'; if (sy2 + 140 < H) ctx.fillRect(0, sy2 + 139, W, H);
          ctx.globalAlpha = 1;
        }
        // flyers
        flyers.forEach(function (f) {
          var fy = para(f.a, f.p);
          if (fy < -20 || fy > H + 20 || (f.kind === 'sat' ? cf < 60 : f.kind === 'birds' ? cf > 32 : cf < 18 || cf > 58)) return;
          ctx.save(); ctx.translate(f.x, fy);
          if (f.kind === 'birds') {
            ctx.strokeStyle = night > 0.5 ? 'rgba(20,20,40,0.8)' : 'rgba(30,30,50,0.7)'; ctx.lineWidth = 1.6;
            for (var b = 0; b < 5; b++) {
              var bx = -Math.abs(b - 2) * 12 * (f.vx > 0 ? 1 : -1), by2 = Math.abs(b - 2) * 7 + b * 2, fl = Math.sin(t * 9 + b + f.ph) * 3;
              ctx.beginPath(); ctx.moveTo(bx - 5, by2 - fl); ctx.lineTo(bx, by2); ctx.lineTo(bx + 5, by2 - fl); ctx.stroke();
            }
          } else if (f.kind === 'plane') {
            ctx.scale(f.vx > 0 ? 1 : -1, 1);
            ctx.fillStyle = '#dfe6f5';
            ctx.fillRect(-16, -2, 30, 4); ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-8, 10); ctx.lineTo(2, 0); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-14, -2); ctx.lineTo(-18, -8); ctx.lineTo(-12, -2); ctx.fill();
            ctx.fillStyle = Math.sin(t * 8) > 0.6 ? '#ff4a4a' : '#552222'; ctx.fillRect(-18, -9, 2, 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-90, 0); ctx.stroke();
          } else {
            ctx.rotate(0.3);
            ctx.fillStyle = '#c8ccd8'; ctx.fillRect(-3, -3, 6, 6);
            ctx.fillStyle = '#3a6bd8'; ctx.fillRect(-15, -2, 10, 4); ctx.fillRect(5, -2, 10, 4);
            ctx.fillStyle = Math.sin(t * 5 + f.ph) > 0.7 ? '#9fffb0' : '#335533'; ctx.fillRect(-1, -6, 2, 2);
          }
          ctx.restore();
        });

        // world: street, tower, debris
        ctx.save();
        ctx.translate(0, cam);
        var gy = GROUND - S.ground.street;
        if (gy + cam < H) {
          ctx.drawImage(S.ground.img, 0, gy);
          if (night > 0.02) { ctx.globalAlpha = night; ctx.drawImage(S.ground.win, 0, gy); ctx.globalAlpha = 1; }
          ctx.fillStyle = '#2d2f3a'; ctx.fillRect(0, gy + S.ground.img.height - 1, W, 400);
          if (night > 0.02) { ctx.fillStyle = 'rgba(10,12,40,' + (night * 0.45) + ')'; ctx.fillRect(0, gy, W, S.ground.img.height + 400); }
        }
        var i0 = Math.max(0, Math.ceil((BASE_Y + cam - H - 30) / SLAB_H));
        for (i = i0; i < tower.length; i++) {
          var fl = tower[i], y = yOf(i), sx = fl.x + sway(i);
          if (y + cam < -60) break;
          slab(ctx, sx, y, fl.w, i, fl.kind, night, 1, t);
          if (fl.glow > 0) {
            ctx.save(); ctx.globalAlpha = fl.glow; ctx.strokeStyle = '#7dffb0'; ctx.lineWidth = 2;
            ctx.shadowColor = '#7dffb0'; ctx.shadowBlur = 12; ctx.strokeRect(sx, y, fl.w, SLAB_H); ctx.restore();
          }
          if (fl.land > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (fl.land * 0.5) + ')'; ctx.fillRect(sx, y, fl.w, SLAB_H); }
        }
        var n = tower.length, top = tower[n - 1], cy = yOf(n), csw = sway(n);
        if (cur) {
          if (cur.kind === 'ice') {                    // ghost: exactly where it will settle
            ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(191,244,255,0.85)'; ctx.lineWidth = 1.5;
            ctx.strokeRect(cur.x + cur.dir * ICE_SLIDE + csw, cy, cur.w, SLAB_H); ctx.restore();
          }
          if (cur.kind === 'wide') {                   // grace zone either side of the top
            ctx.fillStyle = 'rgba(125,255,154,0.18)';
            ctx.fillRect(top.x - WIDE_GRACE + csw, cy + SLAB_H - 3, top.w + WIDE_GRACE * 2, 3);
          }
          ctx.save(); ctx.shadowColor = col(n, 60, cur.kind); ctx.shadowBlur = cur.kind ? 18 : 10;
          slab(ctx, cur.x + csw, cy, cur.w, n, cur.kind, 0, 1, t);
          ctx.restore();
          if (cur.kind) label(ctx, cur.x + csw, cy, cur.w, cur.kind, cur.dir, t);
          // drop guide: faint shadow line on the top slab
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.fillRect(Math.max(cur.x, top.x) + csw, cy + SLAB_H, Math.max(0, Math.min(cur.x + cur.w, top.x + top.w) - Math.max(cur.x, top.x)), 2);
        }
        if (sliding) {
          var k2 = U.clamp(sliding.t / 0.28, 0, 1), e = 1 - (1 - k2) * (1 - k2);
          var slx = U.lerp(sliding.x0, sliding.x1, e) + csw;
          slab(ctx, slx, cy, sliding.w, n, 'ice', 0, 1, t);
          ctx.fillStyle = 'rgba(220,250,255,0.6)';
          for (var q = 1; q <= 3; q++) ctx.fillRect(slx - sliding.dir * q * 7 + (sliding.dir > 0 ? 0 : sliding.w), cy + 6 + q * 4, -sliding.dir * 6 * (1 - k2), 2);
        }
        debris.forEach(function (d) {
          ctx.save();
          ctx.translate(d.x + d.w / 2, d.y + SLAB_H / 2);
          ctx.rotate(d.rot);
          slab(ctx, -d.w / 2, -SLAB_H / 2, d.w, d.n, d.kind, 0, 0.95, t);
          ctx.restore();
        });
        dust.forEach(function (p) {
          ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.5;
          ctx.fillStyle = '#e6e2f0';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        });
        ctx.globalAlpha = 1;
        rings.forEach(function (r) {
          var k3 = r.t / 0.7;
          ctx.save(); ctx.globalAlpha = 1 - k3; ctx.strokeStyle = r.c; ctx.lineWidth = 2.5 * (1 - k3) + 0.5;
          ctx.shadowColor = r.c; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.ellipse(r.x + DEPTH / 2, r.y, r.w / 2 + 10 + k3 * 60, 10 + k3 * 22, 0, 0, 7); ctx.stroke();
          for (var s = 0; s < 6; s++) {
            var a = s / 6 * 6.283 + r.t * 3, rx = r.x + DEPTH / 2 + Math.cos(a) * (r.w / 2 + 14 + k3 * 60), ry = r.y + Math.sin(a) * (12 + k3 * 22);
            ctx.fillStyle = '#ffffff'; ctx.fillRect(rx - 1.5, ry - 1.5, 3, 3);
          }
          ctx.restore();
        });
        ctx.restore();
        drawClouds(true);                               // clouds you pass through
        var fog = smooth(26, 34, cf) * (1 - smooth(40, 48, cf));
        if (fog > 0.01) { ctx.fillStyle = 'rgba(225,230,255,' + (fog * 0.18) + ')'; ctx.fillRect(0, 0, W, H); }

        // HUD
        U.glowText(ctx, String(floors()), W / 2, 50, 34, ACCENT);
        ctx.save();
        ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('ALT ' + altText(floors()), W / 2, 82);
        ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(BANDS[band].name, 10, 20);
        // altitude gauge
        var gx = W - 14, gTop = 24, gH = 150, frac = U.clamp(cf / 90, 0, 1);
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(gx, gTop, 3, gH);
        for (i = 1; i < BANDS.length; i++) { var by3 = gTop + gH - gH * BANDS[i].from / 90; ctx.fillRect(gx - 4, by3, 11, 1); }
        ctx.fillStyle = ACCENT; ctx.fillRect(gx - 3, gTop + gH - gH * frac - 2, 9, 4);
        ctx.restore();
        if (banner) {
          var ba = Math.min(1, banner.t * 3, (2.8 - banner.t) * 2);
          ctx.save(); ctx.globalAlpha = ba;
          ctx.fillStyle = 'rgba(5,6,20,0.45)'; ctx.fillRect(0, 118, W, 52);
          U.glowText(ctx, banner.text, W / 2, 138, 18, '#ffffff');
          U.glowText(ctx, banner.sub, W / 2, 160, 10, ACCENT);
          ctx.restore();
        }
        if (floors() === 0 && !over) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'TAP / SPACE TO DROP', W / 2, 112, 13, '#fff3c4');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#231f5c'); g.addColorStop(0.7, '#8a4f7d'); g.addColorStop(1, '#ff8a5c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var s = h / 300;
    ctx.save();
    ctx.scale(s, s);
    var cw = w / s;
    ctx.fillStyle = '#fff';
    for (var i = 0; i < 24; i++) { ctx.globalAlpha = 0.3 + 0.5 * hash(i + 3); ctx.fillRect(hash(i) * cw, hash(i + 50) * 120, 1, 1); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2a2350';                                   // skyline silhouette
    for (var x = 0, k = 0; x < cw; k++) { var bw = 10 + hash(k * 7) * 16, bh = 30 + hash(k * 13) * 70; ctx.fillRect(x, 288 - bh, bw, bh); x += bw + 1; }
    ctx.fillStyle = '#ffd98a';
    for (k = 0; k < 40; k++) ctx.fillRect(hash(k * 3.3) * cw, 288 - hash(k * 5.1) * 60, 2, 3);
    ctx.fillStyle = '#15122e'; ctx.fillRect(0, 286, cw, 20);
    var widths = [150, 140, 140, 128, 128, 120, 104, 104, 96];
    var baseY = 262, kinds = [null, null, null, null, 'gold', null, null, null, null];
    for (i = 0; i < widths.length; i++) {
      var off = [0, 6, 6, 12, 12, 8, 20, 20, 16][i] + Math.sin(t * 1.3) * i * 0.3;
      slab(ctx, cw / 2 - 75 + off, baseY - i * SLAB_H, widths[i], i, kinds[i], 0.8, 1, t);
    }
    var n = widths.length;
    var ice = Math.floor(t / 6) % 2 === 1;
    var mx = cw / 2 - 60 + Math.sin(t * 2.2) * cw * 0.35;
    slab(ctx, mx, baseY - n * SLAB_H, 96, n, ice ? 'ice' : null, 0, 1, t);
    if (ice) label(ctx, mx, baseY - n * SLAB_H, 96, 'ice', Math.cos(t * 2.2) > 0 ? 1 : -1, t);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_stack_tower',
    order: 8,
    title: 'Stack Tower',
    tagline: 'One tap. Perfect drops. Reach space.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP ANYWHERE ON THE TOWER TO DROP',
    controls: 'Space / click / tap to drop',
    create: create,
    attract: attract
  });
})(window);

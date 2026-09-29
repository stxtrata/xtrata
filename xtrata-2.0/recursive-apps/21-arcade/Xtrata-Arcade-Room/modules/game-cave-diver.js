/*
 * Xtrata Arcade cartridge #3 - CAVE DIVER (v3)
 * One button: hold to rise, release to sink. Pilot a little submersible
 * through four depth zones - Sunlit Reef, Kelp Forest, The Abyss and the
 * Thermal Vents - each with its own rock, light, creatures and hazards.
 *
 *   OXYGEN     drains all the time. AIR bubbles, ceiling AIR POCKETS and each
 *              new zone refill it; a reserve generator guarantees air in
 *              the gap centre before the tank can run low. Empty = run over.
 *   PICKUPS    AIR, SHELL SHIELD (one hit forgiven), FLARE (lights the dark),
 *              PEARL MAGNET. Pearl strings build a chain multiplier.
 *   HAZARDS    urchins, jellyfish, kelp, eels (eyes glow before the lunge),
 *              anglerfish lures, scalding vents, falling rocks (dust first).
 *   TREASURE   chests wait in floor pockets - risky dips, big points.
 *
 * Music: a generative score that crossfades with each zone (bright
 * pentatonic marimba -> dorian kelp ostinato -> sparse phrygian bells in the
 * dark -> driving harmonic-minor pulse at the vents). The mix is low-passed by
 * depth, pearl chains climb the scale on the grid, pickups answer with
 * in-key jingles, low oxygen brings in a tension layer and a crash is a
 * tape stop.
 *
 * Contract game-id: xa_cave_diver (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-cave-diver');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ constants */
  var W = 600, H = 400, TAU = Math.PI * 2;
  var COL = 12;                    // world px per cave column
  var PLAYER_X = 150, R = 9;       // submersible screen x and hit radius
  var START_COLS = 40;             // quiet opening: no hazards, no pickups
  var SPR = 2;                     // sprites are pre-rendered at 2x for hi-dpi
  var TILE = 256;                  // rock texture tile
  var TW = 900;                    // parallax strip width
  var CT = 160;                    // caustic tile
  var MAX_PARTS = 300, MOTES = 70, MAX_FG = 3;
  var DEAD_SECS = 1.7, INVULN_SECS = 1.3;
  var ACCENT = '#ff9f1c', PEARL = '#ffe66d', GOLD = '#ffd35a';
  var OK = '#39ff88', WARN = '#ffd23f', BAD = '#ff4d6d', AIRC = '#9ff3ff';
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';

  /* oxygen (percent of a full tank) */
  var O2 = {
    max: 100,
    bubble: 32,          // AIR pickup
    zone: 50,            // top-up on entering a new zone
    pocketRate: 60,      // per second while poking into a ceiling air pocket
    low: 30,             // warning beeps, red meter, tension music
    critical: 15,        // faster beeps, red vignette
    reserve: 25,         // reserve generator keeps you above this at the next air
    airEvery: 10.5       // seconds of travel between scheduled AIR bubbles
  };

  /* scoring: distance (metres) + everything below */
  var SCORE = { pearl: 20, close: 15, zoneBase: 150, zoneStep: 50, treasure: 250, treasureStep: 75, chainMax: 12 };

  /* =================================================================== zones
     water    three gradient stops, far/mid/near parallax silhouette colours
     rock     texture palette for the pre-rendered rock tile
     dark     darkness overlay (0 = none) - the headlamp cuts through it
     drain    oxygen used per second
     hazards  per-column spawn chance for each hazard kind in this zone
     powers   relative weights for the power-up schedule                     */
  var ZONES = [
    { id: 'reef', name: 'SUNLIT REEF', sub: 'SUNBEAMS, CORAL AND URCHINS', from: 0,
      water: ['#0f7196', '#0a4a6c', '#05263d'], far: '#0e5a7a', mid: '#0a4260', near: '#062a3e',
      rock: { base: '#2f625a', hi: 'rgba(170,245,220,0.18)', lo: 'rgba(4,24,30,0.40)', strata: 'rgba(200,255,238,0.16)',
        crack: 'rgba(3,18,22,0.65)', speck: '#c8f8ea' },
      rimFloor: '#b8fff0', rimCeil: '#63dcc4', edge: '#5fffd0',
      dark: 0, filter: 9000, drain: 2.3,
      hazards: { urchin: 0.035, jelly: 0.02 }, powers: { shell: 1, magnet: 1 } },
    { id: 'kelp', name: 'KELP FOREST', sub: 'CURRENTS SWAY YOU - EELS HIDE IN THE ROCK', from: 400,
      water: ['#0f5a44', '#08372a', '#031a12'], far: '#0d4b39', mid: '#083426', near: '#042218',
      rock: { base: '#2c4a31', hi: 'rgba(160,230,140,0.16)', lo: 'rgba(4,16,8,0.45)', strata: 'rgba(180,235,160,0.12)',
        crack: 'rgba(4,14,6,0.7)', speck: '#b5eca5' },
      rimFloor: '#a8ffa0', rimCeil: '#56d47f', edge: '#39ff88',
      dark: 0.3, filter: 6000, drain: 2.7,
      hazards: { kelp: 0.03, jelly: 0.014, eel: 0.014 }, powers: { shell: 2, magnet: 2, flare: 1 } },
    { id: 'abyss', name: 'THE ABYSS', sub: 'LIGHTS OUT - TRUST YOUR HEADLAMP', from: 1000,
      water: ['#0a1236', '#050a1c', '#010208'], far: '#0b1438', mid: '#070d26', near: '#04081a',
      rock: { base: '#1b2036', hi: 'rgba(120,140,230,0.13)', lo: 'rgba(0,0,8,0.55)', strata: 'rgba(140,160,255,0.09)',
        crack: 'rgba(0,0,6,0.75)', speck: '#93a6ff' },
      rimFloor: '#8492ff', rimCeil: '#5563ff', edge: '#4d5bff',
      dark: 0.93, filter: 2400, drain: 3.1,
      hazards: { lure: 0.02, eel: 0.016 }, powers: { flare: 3, shell: 2, magnet: 1 } },
    { id: 'vents', name: 'THERMAL VENTS', sub: 'SCALDING PLUMES AND FALLING ROCK', from: 1800,
      water: ['#3c110d', '#210907', '#0c0303'], far: '#3d150d', mid: '#290c07', near: '#170604',
      rock: { base: '#3d1d16', hi: 'rgba(255,150,100,0.11)', lo: 'rgba(10,2,0,0.55)', strata: 'rgba(255,175,125,0.11)',
        crack: 'rgba(12,2,0,0.75)', speck: '#ffb477' },
      rimFloor: '#ff8a4a', rimCeil: '#ffb070', edge: '#ff6a2a',
      dark: 0.55, filter: 5200, drain: 3.5,
      hazards: { vent: 0.024, rock: 0.018 }, powers: { shell: 2, flare: 1, magnet: 1 } }
  ];
  function zoneIndex(m) {
    if (m < 400) return 0;
    if (m < 1000) return 1;
    if (m < 1800) return 2;
    if (m < 2600) return 3;
    return Math.floor((m - 2600) / 800) % 2 === 0 ? 2 : 3;   // the deep keeps alternating
  }

  /* ================================================================= hazards
     Every hazard is telegraphed: urchins/kelp/vents are static and visible,
     jellies pulse on a fixed rhythm, eels show their den and glowing eyes for
     0.8 s before the lunge, rocks trickle dust and shake before they drop.  */
  var HAZARDS = {
    urchin: { name: 'URCHIN', death: 'URCHIN' },
    jelly:  { name: 'JELLYFISH', death: 'STUNG', minGap: 112 },
    kelp:   { name: 'KELP', death: 'TANGLED' },
    eel:    { name: 'EEL', death: 'EEL BITE', den: 22, warn: 0.8, lunge: 0.16, hold: 0.55, retract: 0.45 },
    lure:   { name: 'ANGLERFISH', death: 'ANGLERFISH' },
    vent:   { name: 'VENT', death: 'SCALDED' },
    rock:   { name: 'FALLING ROCK', death: 'CRUSHED', warn: 0.75 }
  };

  /* ================================================================= pickups */
  var PICKUPS = {
    air:    { name: 'AIR BUBBLE', tip: 'REFILLS OXYGEN', color: AIRC },
    shell:  { name: 'SHELL SHIELD', tip: 'FORGIVES ONE HIT', color: '#ffb3de' },
    flare:  { name: 'FLARE', tip: 'LIGHTS UP THE DARK', color: '#ff6a3c', secs: 8 },
    magnet: { name: 'PEARL MAGNET', tip: 'PULLS IN PEARLS', color: '#c9a2ff', secs: 8 }
  };
  var POWER_SECS = [8, 13];          // seconds of travel between power-ups

  /* ==================================================================== music */
  // Tension layers sit above any intensity (layer 9) and are forced on by
  // setTrack while oxygen is low.
  function tensionTracks() {
    return [
      { name: 'o2arp', inst: 'arp', layer: 9, gain: 0.34, octave: 1, params: { cutoff: 2400 },
        fn: function (i) { return i.step % 2 ? null : { deg: (i.step >> 2) % 2, vel: i.step % 4 === 0 ? 0.9 : 0.45 }; } },
      { name: 'o2pulse', inst: 'kick', layer: 9, gain: 0.42, pattern: 'x..x....x..x....' }
    ];
  }
  function songs() {
    var list = [
      { bpm: 92, key: 62, scale: 'pentatonic', chords: [0, 3, 1, 4], seed: 21, tracks: [
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - 2 - - - - - - -' },
        { name: 'marimba', inst: 'marimba', layer: 0, gain: 0.55, chord: true, octave: 0,
          fn: function (i) { return i.step % 2 ? null : { deg: [0, 2, 4, 2, 5, 4, 2, 1][(i.step / 2) % 8], vel: 0.5 + (i.step % 8 === 0 ? 0.3 : 0) }; } },
        { name: 'shaker', inst: 'shaker', layer: 0.2, gain: 0.6, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'kick', inst: 'kick', layer: 0.4, gain: 0.5, pattern: 'x.......x.......' },
        { name: 'bell', inst: 'bell', layer: 0.6, gain: 0.3, chord: true, octave: 1, pattern: '. . . . 4 . . . . . 2 . . . . .' }
      ] },
      { bpm: 84, key: 57, scale: 'dorian', chords: [0, 3, 0, 4], seed: 22, tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.45, chord: true, octave: -1, params: { cutoff: 800 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        // a 12-step ostinato over a 16-step bar drifts against the beat
        { name: 'ostinato', inst: 'pluck', layer: 0, gain: 0.45, chord: true, params: { decay: 0.35, cutoff: 2600 },
          fn: function (i) { var k = i.step % 12; return [0, null, 2, null, 4, null, 7, null, 4, null, 2, null][k] == null ? null : { deg: [0, 0, 2, 0, 4, 0, 7, 0, 4, 0, 2, 0][k], vel: 0.6 }; } },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.5, pattern: 'x.........x.....' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.3, pattern: '........x.......' },
        { name: 'bass', inst: 'bass', layer: 0.55, gain: 0.4, chord: true, octave: -2, params: { cutoff: 500 }, pattern: '0 . . 0 . . 0 . . . 0 . . . . .' }
      ] },
      { bpm: 60, key: 50, scale: 'phrygian', chords: [0, 1], barsPerChord: 2, seed: 23, filter: 2400, tracks: [
        { name: 'drone', inst: 'pad', layer: 0, gain: 0.55, chord: true, octave: -1, params: { cutoff: 500, attack: 1.2, release: 2 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - - - - - - - - -' },
        { name: 'heart', inst: 'kick', layer: 0.2, gain: 0.45, pattern: 'x..x............' },
        { name: 'bells', inst: 'bell', layer: 0, gain: 0.35, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.18 ? { deg: [0, 1, 4, 5, 7][Math.floor(i.rng() * 5)], vel: 0.5 } : null; } }
      ] },
      { bpm: 110, key: 52, scale: 'harmonic', chords: [0, 5, 3, 4], seed: 24, tracks: [
        { name: 'pulse', inst: 'bass', layer: 0, gain: 0.45, chord: true, octave: -2, params: { cutoff: 600, q: 8 },
          fn: function (i) { return { deg: i.step % 8 === 6 ? 7 : 0, vel: i.step % 4 === 0 ? 0.9 : 0.55 }; } },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.7, pattern: 'x...x...x...x...' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.45, pattern: '..x...x...x...x.' },
        { name: 'lead', inst: 'lead', layer: 0.5, gain: 0.3, octave: 0, pattern: '4 - - 3 4 - 6 - 7 - - - 6 - 4 - 3 - - - 1 - 3 - 4 - - - - - . .' },
        { name: 'snare', inst: 'snare', layer: 0.65, gain: 0.4, pattern: '....x.......x...' }
      ] }
    ];
    list.forEach(function (s) { s.tracks = s.tracks.concat(tensionTracks()); });
    return list;
  }
  // In-key phrases (scale degrees of whatever zone song is playing).
  var JINGLES = {
    air:      { inst: 'marimba', oct: 1, seq: [{ deg: 4 }, { deg: 7, at: 1 }, { deg: 9, at: 2, steps: 2 }] },
    shell:    { inst: 'bell', oct: 1, seq: [{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2, steps: 3 }] },
    flare:    { inst: 'pluck', oct: 1, seq: [{ deg: 7 }, { deg: 4, at: 1 }, { deg: 9, at: 2 }, { deg: 11, at: 3, steps: 3 }] },
    magnet:   { inst: 'arp', oct: 1, seq: [{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3 }] },
    treasure: { inst: 'lead', oct: 0, seq: [{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 7, at: 6, steps: 6 }] },
    sparkle:  { inst: 'bell', oct: 2, seq: [{ deg: 7, at: 6 }, { deg: 9, at: 7 }, { deg: 11, at: 8, steps: 4 }] },
    zone:     { inst: 'bell', oct: 0, seq: [{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4 }, { deg: 11, at: 6, steps: 8 }] },
    best:     { inst: 'marimba', oct: 1, seq: [{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }, { deg: 11, at: 3, steps: 4 }] }
  };

  /* ========================================================= small utilities */
  function makeCanvas(w, h) {
    var cv = root.document.createElement('canvas');
    cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h));
    return cv;
  }
  function hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hexA(hex, a) { var c = hexRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mixHex(a, b, k) {
    var p = hexRgb(a), q = hexRgb(b);
    return 'rgb(' + Math.round(p[0] + (q[0] - p[0]) * k) + ',' + Math.round(p[1] + (q[1] - p[1]) * k) + ',' + Math.round(p[2] + (q[2] - p[2]) * k) + ')';
  }
  function clear0(rgba) { return rgba.replace(/[\d.]+\)$/, '0)'); }          // same colour, alpha 0
  function wrapTile(size, fn) { for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) fn(dx * size, dy * size); }
  function wrapX(fn) { fn(-TW); fn(0); fn(TW); }
  // periodic noise-ish wave across a strip of width TW: harmonics [[k, amp, phase]]
  function harmonics(r, n) { var h = []; for (var i = 0; i < n; i++) h.push([1 + i * 2 + Math.floor(r() * 2), 1 / (i + 1), r() * TAU]); return h; }
  function wave(x, hs) { var v = 0, s = 0; for (var i = 0; i < hs.length; i++) { v += Math.sin(x / TW * TAU * hs[i][0] + hs[i][2]) * hs[i][1]; s += hs[i][1]; } return v / s; }
  function distSeg(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy, k = l2 ? U.clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1) : 0;
    return Math.hypot(px - ax - dx * k, py - ay - dy * k);
  }
  // one pattern per (context, image); the scroll offset is set per draw
  function patFor(ctx, img) {
    var list = img.__pats || (img.__pats = []);
    for (var i = 0; i < list.length; i++) if (list[i].ctx === ctx) return list[i].p;
    var p = ctx.createPattern(img, 'repeat');
    list.push({ ctx: ctx, p: p });
    if (list.length > 6) list.shift();
    return p;
  }
  function patOffset(p, ox, oy) {
    if (p && p.setTransform && typeof root.DOMMatrix === 'function') {
      try { p.setTransform(new root.DOMMatrix([1, 0, 0, 1, ox, oy || 0])); } catch (e) {}
    }
  }
  function spriteCanvas(w, h, paint) {
    var cv = makeCanvas(w * SPR, h * SPR), g = cv.getContext('2d');
    g.scale(SPR, SPR);
    paint(g, w, h);
    cv.w = w; cv.h = h;
    return cv;
  }
  // Cheap glow for long edges: shadowBlur over a whole cave edge is far too
  // slow on software canvases, so a wide translucent stroke sits under a
  // crisp one.
  function glowStroke(ctx, path, col, width, glow) {
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = col;
    ctx.globalAlpha = glow; ctx.lineWidth = width * 4; ctx.stroke(path);
    ctx.globalAlpha = glow * 1.6; ctx.lineWidth = width * 2.2; ctx.stroke(path);
    ctx.globalAlpha = 1; ctx.lineWidth = width; ctx.stroke(path);
    ctx.restore();
  }
  function hudText(ctx, str, x, y, col, size, align, weight) {
    ctx.font = (weight || 700) + ' ' + (size || 10) + 'px ' + MONO;
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = col; ctx.fillText(str, x, y);
  }

  /* ============================================================ rock tiles
     One seamless texture per zone: mottling, strata, embedded stones,
     cracks, speckle, then the zone's own detail (coral crust, moss, basalt,
     magma veins).                                                          */
  function paintRock(z) {
    var Z = ZONES[z], rk = Z.rock, cv = makeCanvas(TILE, TILE), g = cv.getContext('2d'), r = U.rng(4100 + z * 97), i, k;
    g.fillStyle = rk.base; g.fillRect(0, 0, TILE, TILE);
    for (i = 0; i < 90; i++) {                                   // mottled light and dark patches
      (function (mx, my, mr, col) {
        wrapTile(TILE, function (dx, dy) {
          var gr = g.createRadialGradient(mx + dx, my + dy, 0, mx + dx, my + dy, mr);
          gr.addColorStop(0, col); gr.addColorStop(1, clear0(col));
          g.fillStyle = gr; g.fillRect(mx + dx - mr, my + dy - mr, mr * 2, mr * 2);
        });
      })(r() * TILE, r() * TILE, 10 + r() * 44, r() < 0.5 ? rk.hi : rk.lo);
    }
    for (k = 0; k < 9; k++) {                                    // strata, periodic in x
      (function (y0, hs, thick) {
        [-TILE, 0, TILE].forEach(function (dy) {
          [[0, rk.strata, thick], [1.6, rk.lo, 1]].forEach(function (pass) {
            g.beginPath();
            for (var x = 0; x <= TILE; x += 4) {
              var yy = y0 + dy + pass[0] + Math.sin(x / TILE * TAU * hs[0] + hs[1]) * hs[2] + Math.sin(x / TILE * TAU * hs[3] + hs[4]) * hs[5];
              if (x) g.lineTo(x, yy); else g.moveTo(x, yy);
            }
            g.strokeStyle = pass[1]; g.lineWidth = pass[2]; g.stroke();
          });
        });
      })((k + r() * 0.6) * TILE / 9, [1 + Math.floor(r() * 2), r() * TAU, 2 + r() * 5, 3 + Math.floor(r() * 3), r() * TAU, 1 + r() * 2], k % 3 === 0 ? 1.8 : 1);
    }
    for (i = 0; i < 18; i++) {                                   // embedded stones
      (function (sx, sy, rx, ry, a) {
        wrapTile(TILE, function (dx, dy) {
          g.beginPath(); g.ellipse(sx + dx, sy + dy, rx, ry, a, 0, TAU);
          g.fillStyle = rk.hi; g.fill();
          g.beginPath(); g.ellipse(sx + dx, sy + dy, rx, ry, a, 0.2, Math.PI - 0.2);
          g.strokeStyle = rk.lo; g.lineWidth = 1.4; g.stroke();
          g.beginPath(); g.ellipse(sx + dx, sy + dy, rx, ry, a, Math.PI + 0.4, TAU - 0.4);
          g.strokeStyle = rk.strata; g.lineWidth = 0.8; g.stroke();
        });
      })(r() * TILE, r() * TILE, 4 + r() * 9, 3 + r() * 5, r() * 3);
    }
    for (i = 0; i < 10; i++) {                                   // cracks
      var pts = [], cx = r() * TILE, cy = r() * TILE, ang = r() * TAU, n = 6 + Math.floor(r() * 9);
      pts.push([cx, cy]);
      for (k = 0; k < n; k++) { ang += (r() - 0.5) * 0.7; cx += Math.cos(ang) * (5 + r() * 9); cy += Math.sin(ang) * (5 + r() * 9); pts.push([cx, cy]); }
      (function (pts) {
        wrapTile(TILE, function (dx, dy) {
          [[0, rk.crack, 1.2], [0.8, rk.strata, 0.5]].forEach(function (pass) {
            g.beginPath();
            pts.forEach(function (p, j) { if (j) g.lineTo(p[0] + dx + pass[0], p[1] + dy + pass[0]); else g.moveTo(p[0] + dx + pass[0], p[1] + dy + pass[0]); });
            g.strokeStyle = pass[1]; g.lineWidth = pass[2]; g.stroke();
          });
        });
      })(pts);
    }
    ROCK_EXTRAS[Z.id](g, r);
    for (i = 0; i < 1100; i++) {                                 // speckle
      g.globalAlpha = 0.12 + r() * 0.45;
      g.fillStyle = r() < 0.6 ? rk.speck : '#000';
      var s = r() < 0.1 ? 2 : 1;
      g.fillRect(r() * TILE, r() * TILE, s, s);
    }
    g.globalAlpha = 1;
    return cv;
  }
  var ROCK_EXTRAS = {
    reef: function (g, r) {
      var cols = ['#ff7aa8', '#ff9f6b', '#ffd36b', '#c77dff', '#6bffd8'];
      for (var i = 0; i < 34; i++) {                             // encrusting coral polyps
        (function (cx, cy, col, n) {
          wrapTile(TILE, function (dx, dy) {
            for (var k = 0; k < n; k++) {
              var a = k / n * TAU, rr = 2 + (k % 3);
              g.globalAlpha = 0.55; g.fillStyle = col;
              g.beginPath(); g.arc(cx + dx + Math.cos(a) * rr * 1.4, cy + dy + Math.sin(a) * rr * 1.4, 1.6 + (k % 2), 0, TAU); g.fill();
              g.globalAlpha = 0.5; g.fillStyle = '#10302c';
              g.fillRect(cx + dx + Math.cos(a) * rr * 1.4 - 0.5, cy + dy + Math.sin(a) * rr * 1.4 - 0.5, 1, 1);
            }
            g.globalAlpha = 1;
          });
        })(r() * TILE, r() * TILE, cols[Math.floor(r() * cols.length)], 4 + Math.floor(r() * 5));
      }
      for (i = 0; i < 36; i++) {                                 // barnacles
        (function (bx, by, br) {
          wrapTile(TILE, function (dx, dy) {
            g.fillStyle = 'rgba(225,250,240,0.35)'; g.beginPath(); g.arc(bx + dx, by + dy, br, 0, TAU); g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 0.7; g.stroke();
            g.fillStyle = 'rgba(8,30,30,0.7)'; g.beginPath(); g.arc(bx + dx, by + dy, br * 0.4, 0, TAU); g.fill();
          });
        })(r() * TILE, r() * TILE, 1.8 + r() * 1.8);
      }
    },
    kelp: function (g, r) {
      for (var i = 0; i < 9; i++) {                              // holdfast root tangles
        (function (x0, y0, a) {
          wrapTile(TILE, function (dx, dy) {
            g.strokeStyle = 'rgba(42,30,10,0.55)'; g.lineWidth = 2;
            g.beginPath(); g.moveTo(x0 + dx, y0 + dy);
            g.bezierCurveTo(x0 + dx + a * 20, y0 + dy + 14, x0 + dx - a * 12, y0 + dy + 26, x0 + dx + a * 18, y0 + dy + 40); g.stroke();
          });
        })(r() * TILE, r() * TILE, r() < 0.5 ? -1 : 1);
      }
      for (i = 0; i < 700; i++) {                                // moss fuzz
        var x = r() * TILE, y = r() * TILE, a2 = -Math.PI / 2 + (r() - 0.5) * 1.6, l = 2 + r() * 3;
        g.strokeStyle = r() < 0.5 ? 'rgba(140,230,120,0.28)' : 'rgba(70,150,60,0.3)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a2) * l, y + Math.sin(a2) * l); g.stroke();
      }
    },
    abyss: function (g, r) {
      for (var x = 0; x < TILE; x += 18 + Math.floor(r() * 3) * 5) {   // basalt columns and joints
        var jx = x;
        g.strokeStyle = 'rgba(0,0,12,0.55)'; g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(jx, 0);
        for (var y = 0; y <= TILE; y += 16) g.lineTo(jx + Math.sin(y * 0.05 + x) * 1.5, y);
        g.stroke();
        g.strokeStyle = 'rgba(130,150,255,0.10)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(jx + 1.5, 0); g.lineTo(jx + 1.5, TILE); g.stroke();
        for (var j = 0; j < 4; j++) { var yy = r() * TILE; g.strokeStyle = 'rgba(0,0,12,0.5)'; g.beginPath(); g.moveTo(jx, yy); g.lineTo(jx + 18, yy + (r() - 0.5) * 6); g.stroke(); }
      }
      for (var i = 0; i < 90; i++) {                             // mineral glints
        g.fillStyle = r() < 0.7 ? 'rgba(150,175,255,0.9)' : 'rgba(120,255,230,0.8)';
        var s = r() < 0.2 ? 2 : 1; g.fillRect(r() * TILE, r() * TILE, s, s);
      }
    },
    vents: function (g, r) {
      for (var i = 0; i < 22; i++) {                             // soot patches
        (function (sx, sy, sr) {
          wrapTile(TILE, function (dx, dy) {
            var gr = g.createRadialGradient(sx + dx, sy + dy, 0, sx + dx, sy + dy, sr);
            gr.addColorStop(0, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
            g.fillStyle = gr; g.fillRect(sx + dx - sr, sy + dy - sr, sr * 2, sr * 2);
          });
        })(r() * TILE, r() * TILE, 10 + r() * 22);
      }
      for (i = 0; i < 7; i++) {                                  // glowing magma veins
        var pts = [], cx = r() * TILE, cy = r() * TILE, ang = r() * TAU;
        pts.push([cx, cy]);
        for (var k = 0; k < 12; k++) { ang += (r() - 0.5) * 1.1; cx += Math.cos(ang) * (6 + r() * 8); cy += Math.sin(ang) * (6 + r() * 8); pts.push([cx, cy]); }
        (function (pts) {
          wrapTile(TILE, function (dx, dy) {
            [['rgba(255,70,10,0.75)', 1.9, 5], ['rgba(255,200,120,0.8)', 0.6, 0]].forEach(function (pass) {
              g.save(); g.shadowColor = '#ff3d00'; g.shadowBlur = pass[2];
              g.beginPath(); pts.forEach(function (p, j) { if (j) g.lineTo(p[0] + dx, p[1] + dy); else g.moveTo(p[0] + dx, p[1] + dy); });
              g.strokeStyle = pass[0]; g.lineWidth = pass[1]; g.lineJoin = 'round'; g.stroke(); g.restore();
            });
          });
        })(pts);
      }
      for (i = 0; i < 160; i++) { g.fillStyle = 'rgba(232,210,90,' + (0.25 + r() * 0.4) + ')'; g.fillRect(r() * TILE, r() * TILE, 1.5, 1.5); }
    }
  };

  /* ======================================================= shared light art */
  // One frame of a looping caustic web: the edges of a jittered-grid Voronoi
  // diagram (F2 - F1 is small along cell borders). Feature points circle
  // with the phase `ph` (0..TAU), so the frames loop seamlessly; the grid
  // wraps so the tile repeats.
  var CAUSTIC_FRAMES = 16, CAUSTIC_CELLS = 4;
  var CAUSTIC_SEED = (function () {
    var r = U.rng(4242), a = [];
    for (var i = 0; i < CAUSTIC_CELLS * CAUSTIC_CELLS; i++) a.push([r(), r(), r() * TAU, 0.18 + r() * 0.16]);
    return a;
  })();
  function paintCaustic(ph) {
    var G = CAUSTIC_CELLS, cell = CT / G, pts = [], i, j;
    for (i = 0; i < G * G; i++) {
      var sd = CAUSTIC_SEED[i];
      pts.push([(i % G + 0.5 + (sd[0] - 0.5) * 0.5 + Math.cos(ph + sd[2]) * sd[3]) * cell,
                (Math.floor(i / G) + 0.5 + (sd[1] - 0.5) * 0.5 + Math.sin(ph + sd[2]) * sd[3]) * cell]);
    }
    var cv = makeCanvas(CT, CT), g = cv.getContext('2d'), img = g.createImageData(CT, CT), d = img.data;
    for (var y0 = 0; y0 < CT; y0++) {
      for (var x0 = 0; x0 < CT; x0++) {
        // periodic domain warp bends the straight cell borders into ripples
        var x = (x0 + Math.sin(y0 / CT * TAU * 2 + ph) * 5 + Math.sin(y0 / CT * TAU * 5) * 2 + CT) % CT;
        var y = (y0 + Math.sin(x0 / CT * TAU * 2 - ph) * 5 + Math.sin(x0 / CT * TAU * 3) * 2 + CT) % CT;
        var cx = Math.floor(x / cell), cy = Math.floor(y / cell), f1 = 1e9, f2 = 1e9;
        for (j = -1; j <= 1; j++) {
          for (i = -1; i <= 1; i++) {
            var gx = cx + i, gy = cy + j, wx = (gx + G) % G, wy = (gy + G) % G, p = pts[wy * G + wx];
            var dx = p[0] + (gx - wx) * cell - x, dy = p[1] + (gy - wy) * cell - y, dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
          }
        }
        var e = (f2 - f1) / cell, line = Math.exp(-e * 16) * 0.9 + Math.exp(-e * 5) * 0.12;
        var o = (y0 * CT + x0) * 4;
        d[o] = 225; d[o + 1] = 255; d[o + 2] = 248; d[o + 3] = Math.min(255, Math.round(line * 255));
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }
  function paintBeam() {
    var cv = makeCanvas(200, H), g = cv.getContext('2d');
    for (var k = 0; k < 5; k++) {
      var gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, 'rgba(220,250,255,0.16)'); gr.addColorStop(0.6, 'rgba(200,245,255,0.05)'); gr.addColorStop(1, 'rgba(200,245,255,0)');
      g.fillStyle = gr;
      var inset = k * 9;
      g.beginPath(); g.moveTo(110 + inset * 0.3, 0); g.lineTo(150 - inset * 0.3, 0); g.lineTo(120 - inset, H); g.lineTo(20 + inset, H); g.closePath(); g.fill();
    }
    return cv;
  }
  function paintDapple() {
    var S = 256, cv = makeCanvas(S, S), g = cv.getContext('2d'), r = U.rng(911);
    for (var i = 0; i < 46; i++) {
      (function (x, y, rr, a) {
        wrapTile(S, function (dx, dy) {
          var gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rr);
          gr.addColorStop(0, 'rgba(200,255,170,' + a + ')'); gr.addColorStop(1, 'rgba(200,255,170,0)');
          g.fillStyle = gr; g.fillRect(x + dx - rr, y + dy - rr, rr * 2, rr * 2);
        });
      })(r() * S, r() * S, 8 + r() * 26, 0.35 + r() * 0.4);
    }
    return cv;
  }
  function paintVignette(col, strength, k) {
    k = k || 1;
    var cv = makeCanvas(W * k, H * k), g = cv.getContext('2d');
    g.scale(k, k);
    var gr = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.72);
    gr.addColorStop(0, hexA(col, 0)); gr.addColorStop(1, hexA(col, strength));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    return cv;
  }

  /* ============================================================ parallax art
     far  = half-resolution distant walls and columns (soft, 0.08x scroll)
     mid  = formations: coral trees, spires, chimneys (0.2x)
     near = large dark silhouettes along the edges (0.38x)                  */
  function column(g, x, w, waist, y0, y1) {
    var mid = (y0 + y1) / 2;
    g.beginPath();
    g.moveTo(x - w / 2, y0);
    g.quadraticCurveTo(x - w * waist / 2, mid, x - w / 2 - 4, y1);
    g.lineTo(x + w / 2 + 4, y1);
    g.quadraticCurveTo(x + w * waist / 2, mid, x + w / 2, y0);
    g.closePath(); g.fill();
  }
  function band(g, top, base, amp, hs, step) {
    g.beginPath(); g.moveTo(0, top ? -2 : H + 2);
    for (var x = 0; x <= TW; x += step || 10) g.lineTo(x, top ? base + wave(x, hs) * amp : H - base - wave(x, hs) * amp);
    g.lineTo(TW, top ? -2 : H + 2); g.closePath(); g.fill();
  }
  function spike(g, x, base, w, len, dir) {
    g.beginPath(); g.moveTo(x - w / 2, base); g.quadraticCurveTo(x - w * 0.15, base + dir * len * 0.6, x, base + dir * len);
    g.quadraticCurveTo(x + w * 0.15, base + dir * len * 0.6, x + w / 2, base); g.closePath(); g.fill();
  }
  function coralTree(g, x, y, len, ang, depth, r) {
    if (depth <= 0 || len < 3) return;
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    g.lineWidth = Math.max(1, depth * 1.3); g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    coralTree(g, x2, y2, len * 0.72, ang - 0.35 - r() * 0.3, depth - 1, r);
    coralTree(g, x2, y2, len * 0.72, ang + 0.35 + r() * 0.3, depth - 1, r);
  }
  function seaFan(g, x, y, rad) {
    g.lineWidth = 1;
    for (var a = -2.6; a <= -0.5; a += 0.12) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * rad * 0.6, y + Math.sin(a) * rad * 0.5, x + Math.cos(a) * rad, y + Math.sin(a) * rad); g.stroke(); }
    for (var k = 1; k <= 4; k++) { g.beginPath(); g.arc(x, y, rad * k / 4.5, -2.6, -0.5); g.stroke(); }
  }
  function chimney(g, x, base, w, hgt, r) {
    g.beginPath(); g.moveTo(x - w / 2, base);
    for (var k = 0; k <= 6; k++) { var f = k / 6; g.lineTo(x - w / 2 + f * w * 0.3 + (r() - 0.5) * 4, base - f * hgt); }
    g.lineTo(x + w * 0.2, base - hgt);
    for (k = 6; k >= 0; k--) { var f2 = k / 6; g.lineTo(x + w / 2 - f2 * w * 0.3 + (r() - 0.5) * 4, base - f2 * hgt); }
    g.closePath(); g.fill();
  }
  function paintFar(z, scale) {
    scale = scale || 0.5;
    var Z = ZONES[z], cv = makeCanvas(TW * scale, H * scale), g = cv.getContext('2d'), r = U.rng(5200 + z * 13), k;
    g.scale(scale, scale);
    var wg = g.createLinearGradient(0, 0, 0, H);                            // the water itself: this layer is opaque
    wg.addColorStop(0, Z.water[0]); wg.addColorStop(0.5, Z.water[1]); wg.addColorStop(1, Z.water[2]);
    g.fillStyle = wg; g.fillRect(0, 0, TW, H);
    g.fillStyle = Z.far;
    band(g, true, 44, 34, harmonics(r, 4));
    band(g, false, 56, 38, harmonics(r, 4));
    for (k = 0; k < 4; k++) {
      (function (cx, w, waist) { wrapX(function (dx) { column(g, cx + dx, w, waist, 30, H - 30); }); })((k + 0.25 + r() * 0.5) * TW / 4, 26 + r() * 46, 0.45 + r() * 0.3);
    }
    if (Z.id === 'kelp') {
      g.strokeStyle = Z.far; g.lineWidth = 3;
      for (k = 0; k < 16; k++) {
        (function (x, h, ph) { wrapX(function (dx) { g.beginPath(); g.moveTo(x + dx, H - 40); g.bezierCurveTo(x + dx + 12, H - h * 0.4, x + dx - 12, H - h * 0.7, x + dx + Math.sin(ph) * 8, H - h); g.stroke(); }); })(r() * TW, 180 + r() * 140, r() * 6);
      }
    }
    if (Z.id === 'vents') {
      var vg = g.createLinearGradient(0, H, 0, H * 0.35);                   // red glow rising from the vents
      vg.addColorStop(0, 'rgba(255,70,20,0.5)'); vg.addColorStop(1, 'rgba(255,60,20,0)');
      g.fillStyle = vg; g.fillRect(0, H * 0.35, TW, H * 0.65);
      for (k = 0; k < 5; k++) {
        (function (x, h) {
          wrapX(function (dx) {
            g.fillStyle = Z.far; chimney(g, x + dx, H - 40, 26, h, r);
            var gr = g.createRadialGradient(x + dx, H - 40 - h, 0, x + dx, H - 40 - h, 26);
            gr.addColorStop(0, 'rgba(255,120,50,0.45)'); gr.addColorStop(1, 'rgba(255,120,50,0)');
            g.fillStyle = gr; g.fillRect(x + dx - 26, H - 66 - h, 52, 52);
          });
        })(r() * TW, 60 + r() * 90);
      }
    }
    return cv;
  }
  function paintMid(z) {
    var Z = ZONES[z], cv = makeCanvas(TW, H), g = cv.getContext('2d'), r = U.rng(6100 + z * 17), k;
    g.fillStyle = Z.mid;
    band(g, true, 18, 16, harmonics(r, 3), 8);
    band(g, false, 26, 20, harmonics(r, 3), 8);
    for (k = 0; k < 9; k++) {                                              // stalactites
      (function (x, w, l) { wrapX(function (dx) { spike(g, x + dx, 20, w, l, 1); }); })(r() * TW, 14 + r() * 20, 26 + r() * 50);
    }
    if (Z.id === 'reef') {
      g.strokeStyle = Z.mid;
      for (k = 0; k < 7; k++) (function (x, s) { wrapX(function (dx) { coralTree(g, x + dx, H - 30, 16 * s, -Math.PI / 2, 5, U.rng(k * 31 + 7)); }); })(r() * TW, 0.8 + r() * 0.8);
      for (k = 0; k < 5; k++) (function (x, s) { wrapX(function (dx) { seaFan(g, x + dx, H - 28, 30 * s); }); })(r() * TW, 0.8 + r() * 0.6);
    } else if (Z.id === 'kelp') {
      for (k = 0; k < 8; k++) (function (x, rx, ry) { wrapX(function (dx) { g.beginPath(); g.ellipse(x + dx, H - 30, rx, ry, 0, Math.PI, 0); g.fill(); }); })(r() * TW, 20 + r() * 36, 12 + r() * 20);
    } else if (Z.id === 'abyss') {
      for (k = 0; k < 10; k++) (function (x, w, l) { wrapX(function (dx) { spike(g, x + dx, H - 24, w, l, -1); }); })(r() * TW, 16 + r() * 22, 50 + r() * 110);
      g.fillStyle = 'rgba(110,170,255,0.5)';
      for (k = 0; k < 40; k++) g.fillRect(r() * TW, H - 30 - r() * 120, 1.5, 1.5);
    } else {
      for (k = 0; k < 6; k++) {
        (function (x, w, h) {
          wrapX(function (dx) {
            g.fillStyle = Z.mid; chimney(g, x + dx, H - 24, w, h, r);
            var sm = g.createLinearGradient(0, H - 24 - h, 0, H - 24 - h - 120);
            sm.addColorStop(0, 'rgba(30,14,12,0.55)'); sm.addColorStop(1, 'rgba(30,14,12,0)');
            g.fillStyle = sm; g.beginPath(); g.moveTo(x + dx - 4, H - 24 - h); g.quadraticCurveTo(x + dx - 30, H - 84 - h, x + dx - 12, H - 144 - h);
            g.lineTo(x + dx + 26, H - 144 - h); g.quadraticCurveTo(x + dx + 10, H - 84 - h, x + dx + 6, H - 24 - h); g.fill();
            var gl = g.createRadialGradient(x + dx, H - 24 - h, 0, x + dx, H - 24 - h, 22);
            gl.addColorStop(0, 'rgba(255,150,70,0.6)'); gl.addColorStop(1, 'rgba(255,120,50,0)');
            g.fillStyle = gl; g.fillRect(x + dx - 22, H - 46 - h, 44, 44);
          });
        })(r() * TW, 18 + r() * 14, 80 + r() * 90);
      }
    }
    return cv;
  }
  function paintNear(z) {
    var Z = ZONES[z], cv = makeCanvas(TW, H), g = cv.getContext('2d'), r = U.rng(7300 + z * 19), k;
    g.fillStyle = Z.near;
    band(g, true, 8, 12, harmonics(r, 3), 8);
    band(g, false, 12, 14, harmonics(r, 3), 8);
    if (Z.id === 'reef') {
      for (k = 0; k < 6; k++) {
        (function (x, rx, ry) {
          wrapX(function (dx) {
            g.fillStyle = Z.near; g.beginPath(); g.ellipse(x + dx, H - 8, rx, ry, 0, Math.PI, 0); g.fill();
            g.strokeStyle = 'rgba(180,255,235,0.07)'; g.lineWidth = 1.2;       // brain-coral grooves
            for (var q = 1; q < 4; q++) { g.beginPath(); g.ellipse(x + dx, H - 8, rx * q / 4, ry * q / 4, 0, Math.PI + 0.2, -0.2); g.stroke(); }
          });
        })(r() * TW, 26 + r() * 30, 18 + r() * 22);
      }
      g.strokeStyle = Z.near;
      for (k = 0; k < 5; k++) (function (x) { wrapX(function (dx) { coralTree(g, x + dx, H - 10, 14, -Math.PI / 2 + (r() - 0.5) * 0.4, 4, U.rng(k * 77 + 3)); }); })(r() * TW);
    } else if (Z.id === 'kelp') {
      for (k = 0; k < 9; k++) (function (x, rx, ry) { wrapX(function (dx) { g.beginPath(); g.ellipse(x + dx, H - 6, rx, ry, 0, Math.PI, 0); g.fill(); }); })(r() * TW, 16 + r() * 26, 10 + r() * 16);
    } else if (Z.id === 'abyss') {
      for (k = 0; k < 2; k++) {                                                 // a whale fall: ribs and spine
        (function (x) {
          wrapX(function (dx) {
            g.strokeStyle = 'rgba(160,170,210,0.16)'; g.lineWidth = 4; g.lineCap = 'round';
            g.beginPath(); g.moveTo(x + dx - 90, H - 16); g.quadraticCurveTo(x + dx, H - 30, x + dx + 90, H - 14); g.stroke();
            for (var q = 0; q < 7; q++) {
              var bx = x + dx - 70 + q * 22;
              g.beginPath(); g.moveTo(bx, H - 22 - Math.sin(q / 6 * Math.PI) * 6); g.quadraticCurveTo(bx - 26, H - 70 - q % 2 * 10, bx - 6, H - 96 + Math.abs(q - 3) * 10); g.stroke();
            }
          });
        })(r() * TW);
      }
      g.fillStyle = Z.near;
      for (k = 0; k < 7; k++) (function (x, w, l) { wrapX(function (dx) { spike(g, x + dx, H - 8, w, l, -1); }); })(r() * TW, 14 + r() * 14, 30 + r() * 50);
    } else {
      for (k = 0; k < 14; k++) {                                                 // basalt prisms
        (function (x, w, h) {
          wrapX(function (dx) {
            g.fillStyle = Z.near; g.fillRect(x + dx, H - h, w, h);
            g.fillStyle = 'rgba(255,120,60,0.10)'; g.fillRect(x + dx, H - h, w, 2);
          });
        })(r() * TW, 12 + r() * 14, 20 + r() * 50);
      }
      g.strokeStyle = 'rgba(255,90,30,0.35)'; g.lineWidth = 1.2;
      for (k = 0; k < 8; k++) { var cx = r() * TW; g.beginPath(); g.moveTo(cx, H); g.lineTo(cx + 6, H - 10); g.lineTo(cx + 2, H - 22); g.stroke(); }
    }
    return cv;
  }

  /* ======================================================= foreground art
     Big dark silhouettes that slide past in front of the playfield.        */
  function paintForeground(z, k) {
    var Z = ZONES[z], id = Z.id, bottom = k === 0;
    return spriteCanvas(150, 190, function (g, w, h) {
      var r = U.rng(8800 + z * 7 + k), q;
      g.fillStyle = 'rgba(1,4,8,0.95)';
      g.strokeStyle = 'rgba(1,4,8,0.95)';
      if (!bottom) { g.translate(0, h); g.scale(1, -1); }            // paint as floor art, flip for the ceiling
      if (id === 'reef') {
        if (bottom) {
          g.beginPath(); g.ellipse(70, h, 60, 46, 0, Math.PI, 0); g.fill();
          coralTree(g, 110, h - 30, 22, -Math.PI / 2 - 0.2, 5, r);
          coralTree(g, 40, h - 36, 18, -Math.PI / 2 + 0.3, 4, r);
        } else { spike(g, 50, h, 60, 120, -1); spike(g, 100, h, 40, 80, -1); g.fillRect(0, h - 10, w, 10); }
      } else if (id === 'kelp') {
        g.lineCap = 'round';
        for (q = 0; q < 4; q++) {
          var x = 30 + q * 28, top = 10 + r() * 60;
          g.lineWidth = 5; g.beginPath(); g.moveTo(x, h); g.bezierCurveTo(x + 18, h * 0.7, x - 18, h * 0.4, x + 6, top); g.stroke();
          for (var s = 0; s < 7; s++) {
            var ly = h - 20 - s * (h - top) / 8, lx = x + Math.sin(s * 1.3) * 8;
            g.beginPath(); g.ellipse(lx + (s % 2 ? 9 : -9), ly, 11, 4, s % 2 ? -0.5 : 0.5, 0, TAU); g.fill();
          }
        }
      } else if (id === 'abyss') {
        g.beginPath(); g.moveTo(20, h);
        for (q = 0; q <= 10; q++) g.lineTo(40 + (r() - 0.5) * 24 + q * 3, h - q * 17);
        for (q = 10; q >= 0; q--) g.lineTo(80 + (r() - 0.5) * 24 - q * 2, h - q * 17);
        g.lineTo(120, h); g.closePath(); g.fill();
      } else {
        chimney(g, 70, h, 54, 160, r);
        var gl = g.createRadialGradient(72, h - 160, 0, 72, h - 160, 26);
        gl.addColorStop(0, 'rgba(255,140,60,0.7)'); gl.addColorStop(1, 'rgba(255,100,40,0)');
        g.fillStyle = gl; g.fillRect(40, h - 190, 64, 60);
      }
    });
  }

  /* ============================================================ edge decor
     Small sprites that sit on the cave edges (anchor: bottom centre for the
     floor, top centre for the ceiling). They stay small so they never read
     as obstacles.                                                           */
  var DECOR = {
    reef: {
      floor: [
        function (g) { g.strokeStyle = '#ff7aa8'; coralTree(g, 12, 16, 5, -Math.PI / 2, 3, U.rng(3)); },
        function (g) { g.strokeStyle = 'rgba(199,125,255,0.9)'; seaFan(g, 12, 16, 11); },
        function (g) { g.fillStyle = '#d7e36b'; g.beginPath(); g.ellipse(12, 16, 8, 6, 0, Math.PI, 0); g.fill(); g.strokeStyle = 'rgba(60,80,20,0.6)'; g.lineWidth = 0.8; for (var q = 0; q < 4; q++) { g.beginPath(); g.moveTo(5 + q * 4, 16); g.quadraticCurveTo(7 + q * 4, 11, 5 + q * 4, 11); g.stroke(); } }
      ],
      ceil: [
        function (g) { g.fillStyle = 'rgba(210,240,230,0.55)'; for (var q = 0; q < 4; q++) { g.beginPath(); g.arc(6 + q * 4, 2 + (q % 2) * 2, 2, 0, TAU); g.fill(); } },
        function (g) { g.fillStyle = '#3f7a70'; spike(g, 12, 0, 6, 9, 1); }
      ]
    },
    kelp: {
      floor: [
        function (g) { g.strokeStyle = '#2f8f4a'; g.lineWidth = 2; g.lineCap = 'round'; for (var q = 0; q < 4; q++) { g.beginPath(); g.moveTo(8 + q * 3, 16); g.quadraticCurveTo(4 + q * 5, 8, 8 + q * 3 + (q - 1.5) * 3, 2 + q); g.stroke(); } },
        function (g) { g.fillStyle = '#ff8a3c'; g.beginPath(); for (var q = 0; q < 10; q++) { var a = q / 10 * TAU - Math.PI / 2, rr = q % 2 ? 2.2 : 5.5; g.lineTo(12 + Math.cos(a) * rr, 12 + Math.sin(a) * rr); } g.closePath(); g.fill(); },
        function (g) { g.fillStyle = '#4a5a3a'; g.beginPath(); g.ellipse(9, 16, 6, 4, 0, Math.PI, 0); g.fill(); g.fillStyle = '#5b6b48'; g.beginPath(); g.ellipse(16, 16, 4, 3, 0, Math.PI, 0); g.fill(); }
      ],
      ceil: [
        function (g) { g.strokeStyle = 'rgba(80,170,90,0.8)'; g.lineWidth = 1.2; for (var q = 0; q < 4; q++) { g.beginPath(); g.moveTo(6 + q * 4, 0); g.quadraticCurveTo(8 + q * 4, 5, 5 + q * 4, 8 + q % 2 * 3); g.stroke(); } },
        function (g) { g.fillStyle = '#3c5a40'; spike(g, 12, 0, 6, 9, 1); }
      ]
    },
    abyss: {
      floor: [
        function (g) { for (var q = 0; q < 4; q++) { g.fillStyle = '#d8dce8'; g.fillRect(6 + q * 4, 6 + q % 2 * 3, 2, 10); g.fillStyle = '#ff4a6a'; g.beginPath(); g.arc(7 + q * 4, 5 + q % 2 * 3, 2, 0, TAU); g.fill(); } },
        function (g) { g.fillStyle = 'rgba(120,160,255,0.9)'; g.beginPath(); g.moveTo(8, 16); g.lineTo(10, 4); g.lineTo(12, 16); g.moveTo(12, 16); g.lineTo(15, 7); g.lineTo(17, 16); g.fill(); },
        function (g) { g.strokeStyle = 'rgba(200,210,240,0.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(12, 16); g.lineTo(12, 6); g.stroke(); for (var q = 0; q < 6; q++) { var a = -Math.PI / 2 + (q - 2.5) * 0.4; g.beginPath(); g.moveTo(12, 6); g.lineTo(12 + Math.cos(a) * 6, 6 + Math.sin(a) * 6); g.stroke(); } }
      ],
      ceil: [
        function (g) { g.fillStyle = '#2a3052'; spike(g, 12, 0, 6, 10, 1); },
        function (g) { g.fillStyle = 'rgba(120,255,220,0.8)'; for (var q = 0; q < 5; q++) { g.beginPath(); g.arc(6 + q * 3, 2 + (q % 3), 1.2, 0, TAU); g.fill(); } }
      ]
    },
    vents: {
      floor: [
        function (g) { g.fillStyle = '#241008'; g.beginPath(); g.moveTo(7, 16); g.lineTo(10, 5); g.lineTo(14, 5); g.lineTo(17, 16); g.fill(); g.fillStyle = 'rgba(255,140,60,0.9)'; g.fillRect(10.5, 4, 3, 1.5); },
        function (g) { g.fillStyle = 'rgba(232,210,90,0.85)'; for (var q = 0; q < 6; q++) { g.beginPath(); g.arc(6 + q * 2.4, 15 - (q % 3) * 1.5, 1.8, 0, TAU); g.fill(); } },
        function (g) { g.fillStyle = '#f2e6dc'; g.beginPath(); g.ellipse(12, 14, 4, 2.4, 0, 0, TAU); g.fill(); g.strokeStyle = '#f2e6dc'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(8, 14); g.lineTo(5, 11); g.moveTo(16, 14); g.lineTo(19, 11); g.moveTo(9, 15); g.lineTo(7, 17); g.moveTo(15, 15); g.lineTo(17, 17); g.stroke(); }
      ],
      ceil: [
        function (g) { g.fillStyle = '#3a1a12'; spike(g, 12, 0, 6, 10, 1); g.fillStyle = 'rgba(255,140,60,0.9)'; g.fillRect(11.4, 8, 1.2, 2); },
        function (g) { g.fillStyle = 'rgba(20,6,4,0.8)'; spike(g, 9, 0, 5, 6, 1); spike(g, 15, 0, 4, 5, 1); }
      ]
    }
  };

  /* ============================================================ sprite art */
  function paintSub(white) {
    return spriteCanvas(48, 32, function (g) {
      g.translate(24, 17);
      g.fillStyle = '#c45f00';                                         // rear fins
      g.beginPath(); g.moveTo(-10, -3); g.lineTo(-18, -10); g.lineTo(-16, -2); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(-10, 3); g.lineTo(-18, 10); g.lineTo(-16, 2); g.closePath(); g.fill();
      g.strokeStyle = '#8a4a10'; g.lineWidth = 1.3; g.lineCap = 'round';   // periscope
      g.beginPath(); g.moveTo(1, -12); g.lineTo(1, -15.5); g.lineTo(4, -15.5); g.stroke();
      var tg = g.createLinearGradient(0, -13, 0, -5);                  // conning tower
      tg.addColorStop(0, '#ffe0a8'); tg.addColorStop(1, '#e07a00');
      g.fillStyle = tg; U.roundRect(g, -6, -13, 10, 8, 2.5); g.fill();
      g.strokeStyle = 'rgba(80,30,0,0.8)'; g.lineWidth = 0.7; g.stroke();
      g.beginPath();                                                   // hull
      g.moveTo(16, 0.5); g.bezierCurveTo(16, -6, 8, -8, 0, -8); g.bezierCurveTo(-9, -8, -15, -5, -15, 0);
      g.bezierCurveTo(-15, 5, -9, 8, 0, 8); g.bezierCurveTo(9, 8, 16, 6, 16, 0.5); g.closePath();
      var hg = g.createLinearGradient(0, -8, 0, 8);
      hg.addColorStop(0, '#ffe3b0'); hg.addColorStop(0.35, '#ffab2e'); hg.addColorStop(0.75, '#e07000'); hg.addColorStop(1, '#8a3c00');
      g.fillStyle = hg; g.fill();
      g.save(); g.clip();
      g.fillStyle = 'rgba(255,250,235,0.92)'; g.fillRect(-16, 2.4, 33, 1.8);     // belly stripe
      g.fillStyle = 'rgba(60,20,0,0.25)'; g.fillRect(-16, 4.2, 33, 0.7);
      g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.ellipse(-3, -5.2, 9, 1.5, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(90,40,0,0.55)';
      for (var i = 0; i < 6; i++) g.fillRect(-12 + i * 4.2, 5.6, 0.9, 0.9);        // rivets
      g.restore();
      g.strokeStyle = 'rgba(80,30,0,0.85)'; g.lineWidth = 0.8; g.stroke();
      g.beginPath(); g.arc(6, -1.5, 4.5, 0, TAU); g.fillStyle = '#ffe9c2'; g.fill();  // porthole ring
      g.strokeStyle = '#6a3000'; g.lineWidth = 0.6; g.stroke();
      var gl = g.createRadialGradient(5, -3, 0.5, 6, -1.5, 3.6);
      gl.addColorStop(0, '#d8fbff'); gl.addColorStop(0.5, '#5fc8e6'); gl.addColorStop(1, '#0d4a66');
      g.beginPath(); g.arc(6, -1.5, 3.4, 0, TAU); g.fillStyle = gl; g.fill();
      g.save(); g.clip();                                             // the diver inside
      g.fillStyle = 'rgba(10,30,45,0.85)'; g.beginPath(); g.arc(6.5, 0.3, 2.1, 0, TAU); g.fill(); g.fillRect(4, 1.6, 5, 3);
      g.fillStyle = 'rgba(255,215,110,0.95)'; g.fillRect(6.9, -0.4, 1.6, 0.9);
      g.restore();
      g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(4.6, -3.3, 0.9, 0, TAU); g.fill();
      g.fillStyle = '#4a2200'; U.roundRect(g, 11, 3, 5.4, 3.2, 1); g.fill();          // headlamp housing
      g.fillStyle = '#fffbe0'; g.fillRect(15.4, 3.6, 1.2, 2);
      g.fillStyle = '#7a3a00'; g.beginPath(); g.ellipse(-15.6, 0, 1.6, 2.4, 0, 0, TAU); g.fill();   // prop hub
      if (white) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,255,255,0.95)'; g.fillRect(-30, -30, 60, 60); }
    });
  }
  function paintPearl() {
    return spriteCanvas(24, 24, function (g) {
      g.shadowColor = PEARL; g.shadowBlur = 8;
      var gr = g.createRadialGradient(10, 10, 1, 12, 12, 7);
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#fff4cf'); gr.addColorStop(1, '#d6b25a');
      g.fillStyle = gr; g.beginPath(); g.arc(12, 12, 6.5, 0, TAU); g.fill();
      g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.arc(9.8, 9.6, 1.6, 0, TAU); g.fill();
    });
  }
  function paintUrchin() {
    return spriteCanvas(40, 40, function (g) {
      g.translate(20, 20);
      for (var i = 0; i < 28; i++) {
        var a = i / 28 * TAU, l = i % 2 ? 11 : 16;
        var gr = g.createLinearGradient(0, 0, Math.cos(a) * l, Math.sin(a) * l);
        gr.addColorStop(0, '#2a0f33'); gr.addColorStop(1, i % 2 ? '#b77be0' : '#e8b8ff');
        g.strokeStyle = gr; g.lineWidth = i % 2 ? 1.2 : 1.6; g.lineCap = 'round';
        g.beginPath(); g.moveTo(Math.cos(a) * 4, Math.sin(a) * 4); g.lineTo(Math.cos(a) * l, Math.sin(a) * l); g.stroke();
      }
      var bg = g.createRadialGradient(-2, -2, 0.5, 0, 0, 7.5);
      bg.addColorStop(0, '#b35ab3'); bg.addColorStop(1, '#3a1040');
      g.fillStyle = bg; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,220,255,0.5)';
      for (i = 0; i < 8; i++) { var b = i / 8 * TAU; g.fillRect(Math.cos(b) * 4 - 0.5, Math.sin(b) * 4 - 0.5, 1, 1); }
    });
  }
  function paintChest() {
    return spriteCanvas(34, 30, function (g) {
      var gl = g.createRadialGradient(17, 12, 1, 17, 12, 16);                   // gold glow inside
      gl.addColorStop(0, 'rgba(255,220,100,0.8)'); gl.addColorStop(1, 'rgba(255,200,80,0)');
      g.fillStyle = gl; g.fillRect(0, 0, 34, 26);
      g.fillStyle = '#5a3212'; g.beginPath(); g.moveTo(6, 13); g.lineTo(9, 3); g.lineTo(28, 3); g.lineTo(28, 13); g.closePath(); g.fill();   // open lid
      g.strokeStyle = GOLD; g.lineWidth = 1.2; g.stroke();
      g.fillStyle = '#ffd35a';                                                    // coins
      for (var i = 0; i < 7; i++) { g.beginPath(); g.ellipse(9 + i * 2.6, 13 - (i % 3), 2.4, 1.4, 0, 0, TAU); g.fill(); }
      var bg = g.createLinearGradient(0, 13, 0, 28);
      bg.addColorStop(0, '#8a5424'); bg.addColorStop(1, '#4a2808');
      g.fillStyle = bg; g.fillRect(5, 13, 24, 14);
      g.fillStyle = GOLD; g.fillRect(5, 13, 24, 2); g.fillRect(5, 25, 24, 2); g.fillRect(9, 13, 2, 14); g.fillRect(23, 13, 2, 14);
      g.fillStyle = '#fff3b0'; g.fillRect(15.5, 17, 3, 4);
      g.fillStyle = '#6fe0ff'; g.beginPath(); g.moveTo(17, 7); g.lineTo(19, 9); g.lineTo(17, 11); g.lineTo(15, 9); g.fill();
    });
  }
  function paintRockBoulder() {
    return spriteCanvas(30, 30, function (g) {
      g.translate(15, 15);
      g.beginPath();
      var pts = [[-11, -4], [-7, -11], [2, -12], [10, -7], [12, 2], [7, 10], [-3, 12], [-10, 7]];
      pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
      g.closePath();
      var gr = g.createLinearGradient(-8, -10, 8, 10);
      gr.addColorStop(0, '#8a5a44'); gr.addColorStop(0.5, '#4a261a'); gr.addColorStop(1, '#1e0c07');
      g.fillStyle = gr; g.fill();
      g.strokeStyle = 'rgba(255,200,160,0.35)'; g.lineWidth = 0.8; g.stroke();
      g.strokeStyle = 'rgba(255,110,40,0.95)'; g.lineWidth = 1.2; g.shadowColor = '#ff5a1f'; g.shadowBlur = 5;
      g.beginPath(); g.moveTo(-6, -6); g.lineTo(-1, -1); g.lineTo(-3, 5); g.moveTo(-1, -1); g.lineTo(6, 1); g.stroke();
    });
  }
  function paintIcon(kind) {
    var col = PICKUPS[kind].color;
    return spriteCanvas(36, 36, function (g) {
      g.translate(18, 18);
      g.shadowColor = col; g.shadowBlur = 9;
      var orb = g.createRadialGradient(-4, -5, 1, 0, 0, 13);
      orb.addColorStop(0, 'rgba(255,255,255,0.55)'); orb.addColorStop(0.55, hexA(col, 0.22)); orb.addColorStop(1, hexA(col, 0.5));
      g.fillStyle = orb; g.beginPath(); g.arc(0, 0, 12.5, 0, TAU); g.fill();
      g.shadowBlur = 0;
      g.strokeStyle = hexA(col, 0.95); g.lineWidth = 1.4; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.ellipse(-5, -6, 3.5, 2, -0.6, 0, TAU); g.fill();
      g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineCap = 'round'; g.lineJoin = 'round';
      if (kind === 'air') {
        g.font = '800 9px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = '#eaffff'; g.fillText('O2', 0, 1);
      } else if (kind === 'shell') {
        g.fillStyle = '#ffd1ea';
        g.beginPath(); g.moveTo(0, 6); g.lineTo(-7, -2); g.quadraticCurveTo(0, -9, 7, -2); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(160,50,110,0.8)'; g.lineWidth = 0.8;
        for (var i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(0, 6); g.lineTo(i * 2.8, -5 + Math.abs(i) * 0.8); g.stroke(); }
        g.fillStyle = '#ffd1ea'; g.fillRect(-2, 5, 4, 2);
      } else if (kind === 'flare') {
        g.save(); g.rotate(-0.6);
        g.fillStyle = '#ff3c2a'; g.fillRect(-2, -3, 4, 10); g.fillStyle = '#ffd0a0'; g.fillRect(-2, 5, 4, 2);
        g.restore();
        g.fillStyle = '#fff3a0'; g.beginPath();
        for (i = 0; i < 8; i++) { var a = i / 8 * TAU, rr = i % 2 ? 1.6 : 4.5; g.lineTo(-3.5 + Math.cos(a) * rr, -5.5 + Math.sin(a) * rr); }
        g.closePath(); g.fill();
      } else {
        g.lineWidth = 3.2; g.strokeStyle = '#e8d6ff';
        g.beginPath(); g.arc(0, 0, 5, 0, Math.PI); g.moveTo(-5, 0); g.lineTo(-5, -5); g.moveTo(5, 0); g.lineTo(5, -5); g.stroke();
        g.fillStyle = '#ff5a7a'; g.fillRect(-6.6, -7.5, 3.2, 3); g.fillRect(3.4, -7.5, 3.2, 3);
      }
    });
  }

  /* ============================================================ art cache */
  var ART = { zones: [], shared: null };
  function zoneArt(z) {
    if (ART.zones[z]) return ART.zones[z];
    var id = ZONES[z].id;
    ART.zones[z] = {
      rock: paintRock(z), far: paintFar(z), mid: paintMid(z), near: paintNear(z),
      fg: [paintForeground(z, 0), paintForeground(z, 1)],
      floor: DECOR[id].floor.map(function (fn) { return spriteCanvas(24, 17, fn); }),
      ceil: DECOR[id].ceil.map(function (fn) { return spriteCanvas(24, 17, fn); })
    };
    var dk = makeCanvas(TILE, TILE), dg = dk.getContext('2d');
    dg.drawImage(ART.zones[z].rock, 0, 0); dg.fillStyle = 'rgba(0,3,10,0.62)'; dg.fillRect(0, 0, TILE, TILE);
    ART.zones[z].rockDark = dk;
    ART.zones[z].mid.rows = measureRows(ART.zones[z].mid);
    ART.zones[z].near.rows = measureRows(ART.zones[z].near);
    return ART.zones[z];
  }
  function sharedArt() {
    if (ART.shared) return ART.shared;
    ART.shared = {
      caustic: [], beam: paintBeam(), dapple: paintDapple(),
      vignette: paintVignette('#000008', 0.55),
      sub: paintSub(false), subWhite: paintSub(true), pearl: paintPearl(), urchin: paintUrchin(),
      chest: paintChest(), boulder: paintRockBoulder(),
      icons: { air: paintIcon('air'), shell: paintIcon('shell'), flare: paintIcon('flare'), magnet: paintIcon('magnet') }
    };
    for (var i = 0; i < CAUSTIC_FRAMES; i++) ART.shared.caustic.push(paintCaustic(i / CAUSTIC_FRAMES * TAU));
    return ART.shared;
  }
  function drawSprite(ctx, img, x, y, scale, ax, ay) {
    var s = scale || 1, w = img.w * s, h = img.h * s;
    ctx.drawImage(img, x - w * (ax == null ? 0.5 : ax), y - h * (ay == null ? 0.5 : ay), w, h);
  }
  // Rows of a strip that hold any pixels: the empty middle band is skipped
  // when drawing (full-screen composites are the costly part on software
  // canvases).
  function measureRows(cv) {
    var d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, w = cv.width, h = cv.height, has = [], y, x;
    for (y = 0; y < h; y++) {
      has[y] = false;
      for (x = 0; x < w; x += 2) if (d[(y * w + x) * 4 + 3] > 2) { has[y] = true; break; }
    }
    var top = 0; while (top < h && has[top]) top++;
    var bot = h; while (bot > top && has[bot - 1]) bot--;
    for (y = top; y < bot; y++) if (has[y]) return [[0, h]];         // content in the middle: draw it all
    return [[0, Math.min(h, top + 1)], [Math.max(0, bot - 1), h]];
  }
  function tiled(ctx, img, off, fullW, fullH) {
    var x = -(((off % TW) + TW) % TW), rows = img.rows || [[0, img.height]], k = fullH / img.height;
    for (var i = 0; i < rows.length; i++) {
      var y0 = rows[i][0], hh = rows[i][1] - y0;
      if (hh <= 0) continue;
      ctx.drawImage(img, 0, y0, img.width, hh, x, y0 * k, fullW, hh * k);
      if (x + TW < W) ctx.drawImage(img, 0, y0, img.width, hh, x + TW, y0 * k, fullW, hh * k);
    }
  }
  // The opaque far layer (it carries the water gradient) covers the whole
  // screen, so in play it is cached at device resolution and blitted 1:1.
  var FAR_DEV = [];
  function farFor(z, k) {
    if (!k || k > 2.6) return zoneArt(z).far;
    for (var i = 0; i < FAR_DEV.length; i++) if (FAR_DEV[i].z === z && FAR_DEV[i].k === k) return FAR_DEV[i].cv;
    var cv = paintFar(z, k);
    FAR_DEV.push({ z: z, k: k, cv: cv });
    if (FAR_DEV.length > 2) FAR_DEV.shift();
    return cv;
  }
  // device-resolution strip drawn with an identity transform (a plain copy)
  function blitStrip(ctx, img, off, k) {
    var tr = ctx.getTransform(), x = Math.round(-(((off % TW) + TW) % TW) * k), wpx = img.width;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, Math.round(tr.e), Math.round(tr.f));
    ctx.drawImage(img, x, 0);
    if (x + wpx < W * k) ctx.drawImage(img, x + wpx, 0);
    ctx.restore();
  }
  function drawParallax(ctx, z, dist, alpha, k) {
    var A = zoneArt(z), far = farFor(z, k);
    ctx.globalAlpha = alpha;
    if (far !== A.far && ctx.getTransform) blitStrip(ctx, far, dist * 0.08, k);
    else tiled(ctx, A.far, dist * 0.08, TW, H);
    tiled(ctx, A.mid, dist * 0.2, TW, H);
    tiled(ctx, A.near, dist * 0.38, TW, H);
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------- the submersible */
  // Drawn at the origin; +x is forward. Propeller behind, sprite on top.
  function drawSubAt(ctx, S, o) {
    ctx.save();
    ctx.translate(o.x, o.y); ctx.rotate(o.tilt || 0);
    if (o.sx) ctx.scale(o.sx, o.sy);
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    var a = o.prop || 0, b1 = Math.sin(a) * 5.2, b2 = Math.sin(a + Math.PI / 2) * 5.2;
    ctx.fillStyle = 'rgba(230,205,150,0.9)';
    ctx.beginPath(); ctx.ellipse(-18.5, b1 / 2, 1.3, Math.abs(b1) / 2 + 0.4, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-18.5, b2 / 2, 1.3, Math.abs(b2) / 2 + 0.4, 0, 0, TAU); ctx.fill();
    ctx.drawImage(S.sub, -24, -17, 48, 32);
    if (o.flash > 0) { ctx.globalAlpha = Math.min(1, o.flash); ctx.drawImage(S.subWhite, -24, -17, 48, 32); }
    ctx.restore();
  }

  /* ==================================================================== create */
  function create(api) {
    var rng = api.rng;
    var S = sharedArt();
    for (var zi = 0; zi < ZONES.length; zi++) zoneArt(zi);      // built during the countdown
    var SONGS = songs();

    /* ---- run state ---------------------------------------------------- */
    var cols = [], firstCol = 0, center = H / 2, drift = 0, bulges = [];
    var gen = { hazCd: 0, nextAirX: 1150, nextPowerX: 2600, nextPocket: 70, pearlRun: null, toothCd: 20 };
    var dist = 0, speed = 190, t = 0;
    var y = H / 2, vy = 0, tilt = 0, squash = 0, prop = 0, flashT = 0, invulnT = 0;
    var started = false, dead = false, deadT = 0, cause = '';
    var oxygen = O2.max, shield = false, flareT = 0, magnetT = 0, flareY = 60;
    var things = [], parts = [], partIx = 0, motes = [], fishes = [], debris = [], fgs = [], fgT = 3;
    var pearls = 0, bonus = 0, treasure = 0, chain = 0, closeCd = 0, bubbleT = 0, zonesReached = 0;
    var zone = 0, prevZone = 0, zoneBlend = 1, bannerT = 0, bannerLine = '';
    var reserveCd = 0, reserveCount = 0, beepT = 0, puffT = 0, lowO2Min = O2.max, inPocket = false;
    var bestM = Number(U.store('cave_best_m')) || 0, bestAtStart = bestM, bestShown = bestM <= 0;
    var seen = U.store('cave_seen') || {};
    var music = { tension: false, intensity: -1 };
    // Full-screen overlays live at device resolution so compositing them is
    // a 1:1 blit (resized whenever the room rescales the canvas).
    var dev = { k: 0 }, dark, dctx;
    function ensureDevice(ctx) {
      var tr = ctx.getTransform ? ctx.getTransform() : null, k = tr ? Math.hypot(tr.a, tr.b) : 1;
      k = U.clamp(k || 1, 0.5, 4);
      if (Math.abs(k - dev.k) < 0.001) return;
      dev.k = k;
      dark = makeCanvas(W * k, H * k); dctx = dark.getContext('2d'); dctx.setTransform(k, 0, 0, k, 0, 0);
      dev.vig = paintVignette('#000008', 0.55, k);
      dev.red = paintVignette('#ff1030', 0.6, k);
    }
    function blitDevice(ctx, cv) {                // identity transform, whole-pixel offset: a plain copy
      var tr = ctx.getTransform ? ctx.getTransform() : null;
      if (!tr) { ctx.drawImage(cv, 0, 0, W, H); return; }
      ctx.save(); ctx.setTransform(1, 0, 0, 1, Math.round(tr.e), Math.round(tr.f)); ctx.drawImage(cv, 0, 0); ctx.restore();
    }
    var paths = null, gauge = { cv: null, range: 0 };

    /* ---------------------------------------------------- cave generation */
    function gapFor(d) { return U.lerp(250, 120, U.clamp(d / 16000, 0, 1)); }
    function speedAt(d) { return Math.min(430, 190 + d * 0.012); }
    // Bulges reshape one wall for a run of columns: pockets and domes widen
    // the cave, eel dens carve a burrow, teeth jut into the gap.
    function bulgeAt(index, side) {
      var add = 0;
      for (var i = 0; i < bulges.length; i++) {
        var b = bulges[i];
        if (b.side !== side || index < b.start || index >= b.start + b.len) continue;
        var f = (index - b.start + 0.5) / b.len;
        add += b.depth * (b.shape === 'tooth' ? 1 - Math.abs(f * 2 - 1) : Math.pow(Math.sin(Math.PI * f), 0.7));
      }
      return add;
    }
    function bulgeNear(index, pad) {
      for (var i = 0; i < bulges.length; i++) { var b = bulges[i]; if (index >= b.start - pad && index < b.start + b.len + pad) return b; }
      return null;
    }
    function thingNear(x, r, pickupsOnly) {
      for (var i = things.length - 1; i >= 0; i--) {
        var o = things[i];
        if (Math.abs(o.x - x) >= r) continue;
        var isPickup = !!PICKUPS[o.kind] || o.kind === 'pearl' || o.kind === 'chest';
        if (pickupsOnly === true ? isPickup : pickupsOnly === false ? !isPickup : true) return o;
      }
      return null;
    }
    function pickWeighted(weights) {
      var keys = Object.keys(weights), sum = 0, i;
      for (i = 0; i < keys.length; i++) sum += weights[keys[i]];
      var v = rng() * sum;
      for (i = 0; i < keys.length; i++) { v -= weights[keys[i]]; if (v <= 0) return keys[i]; }
      return keys[keys.length - 1];
    }

    function genCol(index) {
      var d = index * COL, m = d / 10, z = zoneIndex(m);
      drift += (rng() - 0.5) * 3.2;
      drift *= 0.94;
      center += drift;
      var gap = gapFor(d);
      center = U.clamp(center, 26 + gap / 2, H - 26 - gap / 2);
      var wob = Math.sin(index * 0.35) * 6;
      var c = { baseTop: center - gap / 2 + wob, baseBot: center + gap / 2 + wob, z: z, air: null, decoF: null, decoC: null };
      c.top = Math.max(6, c.baseTop - bulgeAt(index, 'top'));
      c.bot = Math.min(H - 6, c.baseBot + bulgeAt(index, 'bot'));
      var dome = domeAt(index);
      if (dome && c.top < dome.airLine - 2) c.air = dome.airLine;
      if (index > START_COLS) planFeatures(index, c, d, z, gap);
      decorate(c);
      return c;
    }
    function domeAt(index) {
      for (var i = 0; i < bulges.length; i++) { var b = bulges[i]; if (b.shape === 'dome' && index >= b.start && index < b.start + b.len) return b; }
      return null;
    }
    function decorate(c) {                        // visual only
      if (Math.random() < 0.2) c.decoF = { k: Math.floor(Math.random() * 3), s: 0.75 + Math.random() * 0.45 };
      if (Math.random() < 0.13) c.decoC = { k: Math.floor(Math.random() * 2), s: 0.75 + Math.random() * 0.4 };
    }

    function planFeatures(index, c, d, z, gap) {
      var Z = ZONES[z], busy = !!bulgeNear(index, 2);
      // 1. cave shape events: treasure pockets (floor) and air pockets (ceiling)
      if (index >= gen.nextPocket && !busy) {
        var roomBot = H - 8 - c.bot, roomTop = c.top - 8;
        if (rng() < 0.55 && roomBot >= 46) {
          var depth = Math.min(64, roomBot), len = 16 + rng.int(6);
          bulges.push({ side: 'bot', start: index + 2, len: len, depth: depth, shape: 'pocket' });
          things.push({ kind: 'chest', x: (index + 2 + len / 2) * COL, got: false, ph: rng() * TAU });
          gen.nextPocket = index + 160 + rng.int(120);
        } else if (roomTop >= 42) {
          var dd = Math.min(58, roomTop), ll = 14 + rng.int(5);
          bulges.push({ side: 'top', start: index + 2, len: ll, depth: dd, shape: 'dome', airLine: c.baseTop - dd * 0.42 });
          gen.nextPocket = index + 130 + rng.int(110);
        } else gen.nextPocket = index + 24;
        busy = true;
      }
      // 2. rock teeth: real geometry, only where the gap has room to spare
      if (--gen.toothCd <= 0 && !busy && gap > 150 && rng() < 0.05) {
        bulges.push({ side: rng() < 0.5 ? 'top' : 'bot', start: index + 1, len: 3, depth: -Math.min(26, (gap - 110) * 0.45), shape: 'tooth' });
        gen.toothCd = 26;
        busy = true;
      }
      // 3. scheduled air
      if (d >= gen.nextAirX && !busy) {
        if (thingNear(d, 70, false)) gen.nextAirX = d + 48;
        else {
          things.push({ kind: 'air', x: d, y: U.lerp(c.top + 30, c.bot - 30, 0.35 + rng() * 0.3), ph: rng() * TAU });
          gen.nextAirX = d + speedAt(d) * O2.airEvery * (0.85 + rng() * 0.3);
          busy = true;
        }
      }
      // 4. power-ups
      if (d >= gen.nextPowerX && !busy) {
        if (thingNear(d, 70)) gen.nextPowerX = d + 36;
        else {
          things.push({ kind: pickWeighted(Z.powers), x: d, y: U.lerp(c.top + 30, c.bot - 30, 0.3 + rng() * 0.4), ph: rng() * TAU });
          gen.nextPowerX = d + speedAt(d) * U.lerp(POWER_SECS[0], POWER_SECS[1], rng());
          busy = true;
        }
      }
      // 5. pearl strings (a chain of 4-7, spaced 3 columns)
      var run = gen.pearlRun;
      if (run) {
        if (index >= run.next) {
          var py = (c.top + c.bot) / 2 + run.offset + Math.sin(run.k * 0.7) * run.amp;
          if (!thingNear(d, 34, false)) things.push({ kind: 'pearl', x: d, y: U.clamp(py, c.top + 30, c.bot - 30) });
          run.k++; run.next = index + 3;
          if (--run.left <= 0) gen.pearlRun = null;
        }
        busy = true;
      } else if (!busy && rng() < 0.009) {
        gen.pearlRun = { left: 4 + rng.int(4), next: index + 1, k: 0, offset: (rng() - 0.5) * gap * 0.4, amp: 6 + rng() * 18 };
      }
      // 6. hazards: one at a time, spaced, never on a pickup
      if (gen.hazCd > 0) gen.hazCd--;
      else if (!busy && !thingNear(d, 56, true)) {
        var keys = Object.keys(Z.hazards);
        for (var k = 0; k < keys.length; k++) {
          if (rng() < Z.hazards[keys[k]] && placeHazard(keys[k], index, c, d, gap)) {
            gen.hazCd = Math.round(U.lerp(15, 9, U.clamp(d / 22000, 0, 1)));
            break;
          }
        }
      }
    }

    function placeHazard(kind, index, c, d, gap) {
      var g = c.bot - c.top;
      if (kind === 'urchin') {
        var fromTop = rng() < 0.5;
        things.push({ kind: 'urchin', x: d, y: fromTop ? c.top + 8 : c.bot - 8, r: 11, rot: rng() * TAU });
      } else if (kind === 'jelly') {
        if (g < HAZARDS.jelly.minGap) return false;
        var lo = c.top + 26, hi = c.bot - 44, mid = (lo + hi) / 2;
        // a slow, fixed rhythm the player can time; the sweep never fills the gap
        things.push({ kind: 'jelly', x: d, mid: mid, amp: Math.max(0, Math.min(34, (hi - lo) / 2 - 10)), tent: 26, per: 3.2 + rng() * 1.4, ph: rng() * TAU });
      } else if (kind === 'kelp') {
        var up = rng() < 0.5;
        things.push({ kind: 'kelp', x: d, base: up ? c.bot : c.top, len: g * (0.35 + rng() * 0.2), up: up, phase: rng() * 6 });
      } else if (kind === 'eel') {
        var side = rng() < 0.5 ? 'top' : 'bot', den = HAZARDS.eel.den;
        if (side === 'top' && c.top - den < 8) side = 'bot';
        if (side === 'bot' && c.bot + den > H - 8) return false;
        bulges.push({ side: side, start: index + 1, len: 7, depth: den, shape: 'den' });
        things.push({ kind: 'eel', x: (index + 4.5) * COL, side: side, state: 'lurk', e: 0, timer: 0,
          L: Math.min(62, (g + den) * 0.42), ph: rng() * TAU });
      } else if (kind === 'lure') {
        things.push({ kind: 'lure', x: d, baseY: (c.top + c.bot) / 2, amp: g * 0.3, phase: rng() * 6, r: 10 });
      } else if (kind === 'vent') {
        things.push({ kind: 'vent', x: d, floor: c.bot, reach: g * (0.45 + rng() * 0.15), period: 2.6 + rng() * 1.5, phase: rng() * 3 });
      } else if (kind === 'rock') {
        things.push({ kind: 'rock', x: d, y: c.top + 6, r: 12, state: 'hang', timer: 0, spin: rng() * TAU, sink: 140 + rng() * 50 });
      }
      return true;
    }

    function colAt(worldX) { return cols[U.clamp(Math.floor(worldX / COL) - firstCol, 0, cols.length - 1)]; }
    // interpolated edges: collision follows exactly what is drawn
    function edgeAt(worldX, key) {
      var f = worldX / COL - firstCol, i = U.clamp(Math.floor(f), 0, cols.length - 1), j = Math.min(cols.length - 1, i + 1);
      return U.lerp(cols[i][key], cols[j][key], U.clamp(f - Math.floor(f), 0, 1));
    }
    function fill() {
      var need = Math.ceil((dist + W + COL * 6) / COL);
      while (firstCol + cols.length < need) cols.push(genCol(firstCol + cols.length));
      var drop = Math.floor((dist - COL * 4) / COL) - firstCol;
      if (drop > 0) { cols.splice(0, drop); firstCol += drop; }
      if (things.length && things[0].x < dist - 80) things = things.filter(function (o) { return o.x > dist - 80 && !o.gone; });
      if (bulges.length && bulges[0].start + bulges[0].len < firstCol) bulges = bulges.filter(function (b) { return b.start + b.len >= firstCol; });
    }
    for (var i = 0; i < START_COLS; i++) cols.push(genCol(i));
    center = H / 2;
    fill();
    for (i = 0; i < 14; i++) fishes.push({ x: Math.random() * W, y: 50 + Math.random() * (H - 100), s: 0.5 + Math.random() * 0.8, v: 20 + Math.random() * 40, p: Math.random() * 6 });
    for (i = 0; i < MOTES; i++) motes.push({ x: Math.random() * W, y: Math.random() * H, z: 0.25 + Math.random() * 0.75, p: Math.random() * TAU });

    var m0 = M();
    if (m0) { m0.play(SONGS[0], { fade: 1.5 }); m0.setFilter(ZONES[0].filter, 0.5); }

    /* ------------------------------------------------------------ helpers */
    function zoneW(k) { return (zone === k ? zoneBlend : 0) + (prevZone === k ? 1 - zoneBlend : 0); }
    function blended(key) { var v = 0; for (var k = 0; k < ZONES.length; k++) v += ZONES[k][key] * zoneW(k); return v; }
    function flareK() { return flareT <= 0 ? 0 : Math.min(1, flareT / 0.8, (PICKUPS.flare.secs - flareT) / 0.4 + 0.2); }
    function darkness() { return blended('dark') * (1 - 0.86 * flareK()); }
    function ventPhase(o) { return ((t + o.phase) % o.period) / o.period; }
    function ventActive(o) { return ventPhase(o) > 0.72; }
    function ventWarn(o) { var ph = ventPhase(o); return ph > 0.5 && ph <= 0.72; }
    function jellyY(o) { return o.mid + Math.sin(t * TAU / o.per + o.ph) * o.amp; }
    function lureY(o) { return o.baseY + Math.sin(t * 1.4 + o.phase) * o.amp; }
    function eelBase(o) { var top = o.side === 'top'; return { y: top ? edgeAt(o.x, 'top') + 4 : edgeAt(o.x, 'bot') - 4, dir: top ? 1 : -1 }; }
    function eelTip(o, b) { return { x: o.x + Math.sin(t * 9 + o.ph) * 4 * o.e, y: b.y + b.dir * o.L * o.e }; }
    function lampPos() { var ca = Math.cos(tilt), sa = Math.sin(tilt); return { x: PLAYER_X + 16 * ca - 4.5 * sa, y: y + 16 * sa + 4.5 * ca }; }
    function hudAlpha(x0, y0, x1, y1) { var m = 16; return PLAYER_X + 20 > x0 - m && PLAYER_X - 20 < x1 + m && y + 16 > y0 - m && y - 16 < y1 + m ? 0.3 : 1; }

    /* ---------------------------------------------------------- particles */
    function part(kind, x, y2, vx, vy2, life, size, color, world) {
      var p;
      if (parts.length < MAX_PARTS) { p = {}; parts.push(p); }
      else { p = parts[partIx]; partIx = (partIx + 1) % MAX_PARTS; }
      p.kind = kind; p.x = x; p.y = y2; p.vx = vx; p.vy = vy2; p.life = p.max = life; p.size = size; p.color = color;
      p.world = !!world; p.ph = Math.random() * TAU; p.alive = true;
      return p;
    }
    function burst(kind, x, y2, n, spd, life, size, color, world) {
      for (var k = 0; k < n; k++) {
        var a = Math.random() * TAU, s = spd * (0.3 + Math.random() * 0.7);
        part(kind, x, y2, Math.cos(a) * s, Math.sin(a) * s, life * (0.6 + Math.random() * 0.4), size * (0.6 + Math.random() * 0.7), color, world);
      }
    }
    function updateParts(dt) {
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        if (!p.alive) continue;
        p.life -= dt;
        if (p.life <= 0) { p.alive = false; continue; }
        if (p.world && !dead) p.x -= speed * dt;
        if (p.kind === 'bubble') { p.vy -= 70 * dt; p.vx *= 0.97; p.x += Math.sin(t * 7 + p.ph) * 12 * dt; }
        else if (p.kind === 'puff') { p.size += 14 * dt; p.vx *= 0.92; p.vy *= 0.92; }
        else if (p.kind === 'dust') { p.vy += 90 * dt; }
        else if (p.kind === 'glass' || p.kind === 'spark') { p.vx *= 0.94; p.vy = p.vy * 0.94 + 30 * dt; }
        else if (p.kind === 'steam') { p.vy -= 20 * dt; p.size += 10 * dt; }
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }
    function updateAmbient(dt) {
      var scroll = dead ? 0 : speed;
      fishes.forEach(function (f) { f.x -= (f.v + scroll * 0.15 * f.s) * dt; if (f.x < -40) { f.x = W + 40; f.y = 50 + Math.random() * (H - 100); } });
      var w2 = zoneW(2), w3 = zoneW(3), fall = (zoneW(0) + zoneW(1)) * 9 - w3 * 32;
      motes.forEach(function (o) {
        o.x -= (scroll * (0.12 + 0.4 * o.z) + 6) * dt;
        o.y += (fall * o.z + w2 * Math.sin(t * 0.7 + o.p) * 10 + zoneW(1) * Math.sin(t * 0.9) * 38 * o.z) * dt;   // kelp current shows in the drift
        if (o.x < -4) { o.x = W + 4; o.y = Math.random() * H; }
        if (o.y > H + 4) o.y = -4; else if (o.y < -4) o.y = H + 4;
      });
      fgT -= dt;
      if (fgT <= 0 && started && !dead && fgs.length < MAX_FG) {
        fgs.push({ x: W + 90, k: Math.random() < 0.6 ? 0 : 1, z: zone, s: 0.75 + Math.random() * 0.35 });
        fgT = 3.5 + Math.random() * 4.5;
      }
      for (var k = fgs.length - 1; k >= 0; k--) { fgs[k].x -= scroll * 1.5 * dt; if (fgs[k].x < -150) fgs.splice(k, 1); }
      updateParts(dt);
    }

    /* ------------------------------------------------------------- music */
    function jingle(name, gain) {
      var j = JINGLES[name], m = M();
      if (m) m.stinger(j.seq, { inst: j.inst, octave: j.oct, quantize: '16', gain: gain || 0.6 });
      else api.audio.arp([523, 659, 784], 0.06, { type: 'triangle', vol: 0.14 });
    }
    function musicTick(hold) {
      var m = M();
      if (!m) return;
      var want = started && !dead && oxygen < O2.low;
      if (want !== music.tension) {
        music.tension = want;
        m.setTrack('o2arp', want ? true : null);
        m.setTrack('o2pulse', want ? true : null);
      }
      var inten = U.clamp(chain / 10 + (hold ? 0.25 : 0) + (speed - 190) / 600 + (want ? 0.15 : 0), 0, 1);
      if (Math.abs(inten - music.intensity) > 0.03) { music.intensity = inten; m.setIntensity(inten); }
    }

    /* ----------------------------------------------------- damage + death */
    function breakSub() {
      var ca = Math.cos(tilt), sa = Math.sin(tilt);
      [
        { pts: [[-15, 0], [-9, -8], [0, -8], [-2, 0], [0, 8], [-9, 8]], col: '#e07a00' },
        { pts: [[0, -8], [9, -8], [16, 0], [9, 8], [0, 8], [-2, 0]], col: '#ffab2e' },
        { pts: [[-6, -13], [4, -13], [4, -5], [-6, -5]], col: '#ffc766' },
        { pts: [[-10, -3], [-18, -10], [-16, -2]], col: '#c45f00' },
        { pts: [[-10, 3], [-18, 10], [-16, 2]], col: '#c45f00' },
        { ring: 4.5, pts: [[6, -1.5]], col: '#ffe9c2' }
      ].forEach(function (pc) {
        var cx = 0, cy = 0;
        pc.pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
        cx /= pc.pts.length; cy /= pc.pts.length;
        var wx2 = PLAYER_X + cx * ca - cy * sa, wy2 = y + cx * sa + cy * ca, out = Math.atan2(wy2 - y, wx2 - PLAYER_X + 0.01);
        debris.push({ x0: PLAYER_X, y0: y, x: wx2, y: wy2, vx: Math.cos(out) * (70 + Math.random() * 90) + vy * 0.05, vy: Math.sin(out) * (70 + Math.random() * 90) - 30,
          a: tilt, va: (Math.random() - 0.5) * 9, col: pc.col, ring: pc.ring,
          pts: pc.pts.map(function (p) { return [p[0] - cx, p[1] - cy]; }) });
      });
      burst('bubble', PLAYER_X, y, 34, 150, 1.4, 3.2, 'rgba(210,245,255,0.9)');
      burst('glass', PLAYER_X + 6, y - 2, 14, 190, 0.8, 2, '#bff6ff');
      burst('spark', PLAYER_X, y, 14, 220, 0.5, 2.2, ACCENT);
    }
    function die(reason) {
      if (dead) return;
      dead = true; cause = reason || 'CRASHED';
      breakSub();
      api.fx.text(PLAYER_X + 50, y - 26, cause, cause === 'OUT OF AIR' ? AIRC : '#ff8a8a', 12);
      api.shake(12);
      var metres = Math.floor(dist / 10);
      if (metres > bestM) { bestM = metres; U.store('cave_best_m', bestM); }
      var m = M();
      if (m) { m.setFilter(500, 0.2); m.tapeStop(1.2); }
      api.audio.noise(0.5, { cutoff: 700, vol: 0.32 });
      api.audio.tone(180, 0.45, { type: 'sawtooth', slide: 0.3, vol: 0.2 });
      api.audio.tone(2200, 0.12, { type: 'triangle', vol: 0.08, delay: 0.05 });
      api.audio.tone(2900, 0.1, { type: 'triangle', vol: 0.06, delay: 0.11 });
    }
    // Hazard contact: the shell shield (or recent-hit grace) forgives it.
    function hurt(reason) {
      if (invulnT > 0) return false;
      if (shield) {
        shield = false; invulnT = INVULN_SECS; flashT = 0.6; squash = 1;
        burst('spark', PLAYER_X, y, 22, 170, 0.6, 2.4, PICKUPS.shell.color);
        api.fx.text(PLAYER_X + 30, y - 24, 'SHIELD SAVED YOU', PICKUPS.shell.color, 11);
        api.shake(6);
        api.audio.tone(660, 0.18, { type: 'triangle', slide: 0.5, vol: 0.18 });
        if (M()) M().duck(0.5, 0.5);
        return false;
      }
      die(reason);
      return true;
    }
    function updateDebris(dt) {
      debris.forEach(function (d) {
        d.vy += 80 * dt; d.vx *= 0.985; d.vy *= 0.985;
        d.x += d.vx * dt; d.y += d.vy * dt; d.a += d.va * dt; d.va *= 0.99;
        if (Math.random() < 0.15) part('bubble', d.x, d.y, 0, -20, 0.8, 1.6, 'rgba(210,245,255,0.8)');
      });
    }

    /* -------------------------------------------------------------- zones */
    function changeZone(z) {
      prevZone = zone; zone = z; zoneBlend = 0; bannerT = 3.4;
      zonesReached++;
      var pts = SCORE.zoneBase + SCORE.zoneStep * (zonesReached - 1);
      bonus += pts;
      oxygen = Math.min(O2.max, oxygen + O2.zone);
      bannerLine = 'ZONE BONUS +' + pts + '   AIR +' + O2.zone + '%';
      var m = M();
      if (m) {
        m.play(SONGS[z], { fade: 2.8, intensity: m.intensity(), keepFilter: true });
        m.setFilter(ZONES[z].filter, 2.5);
        m.note('riser', 0, { dur: 1.6, gain: 0.35 });
        if (music.tension) { m.setTrack('o2arp', true); m.setTrack('o2pulse', true); }
        jingle('zone', 0.5);
      }
    }

    /* ------------------------------------------------------------- oxygen */
    function updateOxygen(dt) {
      oxygen -= blended('drain') * dt;
      var wx = dist + PLAYER_X, c = colAt(wx);
      inPocket = c.air != null && y - R < c.air;
      if (inPocket) {
        if (oxygen < O2.max - 1 && Math.random() < 0.5) part('bubble', PLAYER_X + (Math.random() - 0.5) * 20, y - 6, 0, -40, 0.6, 2, 'rgba(220,250,255,0.9)');
        if (oxygen < O2.max - 20 && !c.airNoted) { c.airNoted = true; api.fx.text(PLAYER_X + 20, y - 26, 'AIR POCKET', AIRC, 11); api.audio.noise(0.25, { cutoff: 3000, vol: 0.08 }); }
        oxygen += O2.pocketRate * dt;
      }
      oxygen = U.clamp(oxygen, 0, O2.max);
      lowO2Min = Math.min(lowO2Min, oxygen);
      if (oxygen <= 0) { die('OUT OF AIR'); return true; }
      if (oxygen < O2.low) {
        beepT -= dt;
        if (beepT <= 0) {
          beepT = oxygen < O2.critical ? 0.45 : 0.9;
          api.audio.tone(oxygen < O2.critical ? 1320 : 990, 0.08, { type: 'square', vol: 0.08 });
        }
      } else beepT = 0;
      return false;
    }
    // Fairness: if the tank would dip under the reserve before the next
    // scheduled air, spawn a bubble just off-screen in the middle of the gap.
    function reserveAir(dt) {
      reserveCd -= dt;
      if (reserveCd > 0) return;
      var wx = dist + PLAYER_X, next = null;
      for (var k = 0; k < things.length; k++) {
        var o = things[k];
        if (o.kind === 'air' && !o.got && o.x > wx && (!next || o.x < next.x)) next = o;
      }
      var spawnX = dist + W + 30;
      if (next && next.x <= spawnX + 60) return;               // one is already on its way
      var nextX = next ? next.x : Math.max(gen.nextAirX, spawnX + COL * 6);   // the next scheduled bubble
      var o2There = oxygen - blended('drain') * (nextX - wx) / speed;
      if (o2There >= O2.reserve) return;
      for (var tries = 0; tries < 4 && thingNear(spawnX, 44, false); tries++) spawnX += 50;
      var c = colAt(spawnX);
      things.push({ kind: 'air', x: spawnX, y: (edgeAt(spawnX, 'top') + edgeAt(spawnX, 'bot')) / 2 + (c.air != null ? 10 : 0), ph: Math.random() * TAU, reserve: true });
      reserveCount++;
      reserveCd = 2.2;
    }

    /* ------------------------------------------------------------ pickups */
    function collect(o, sx) {
      o.got = true;
      var P = PICKUPS[o.kind];
      squash = Math.max(squash, 0.35);
      burst('spark', sx, o.y, 18, 150, 0.6, 2.2, P.color);
      if (o.kind === 'air') {
        oxygen = Math.min(O2.max, oxygen + O2.bubble);
        burst('bubble', sx, o.y, 14, 90, 0.9, 2.6, 'rgba(220,250,255,0.9)');
        api.fx.text(sx, o.y - 18, 'AIR +' + O2.bubble + '%', AIRC, 11);
      } else if (o.kind === 'shell') {
        if (shield) { bonus += 50; api.fx.text(sx, o.y - 18, 'SHIELD +50', P.color, 11); }
        else api.fx.text(sx, o.y - 18, 'SHELL SHIELD', P.color, 11);
        shield = true;
      } else if (o.kind === 'flare') {
        flareT = P.secs; flareY = 50 + Math.random() * 30;
        api.fx.text(sx, o.y - 18, 'FLARE!', P.color, 11);
        api.audio.noise(0.6, { cutoff: 5000, vol: 0.1 });
      } else if (o.kind === 'magnet') {
        magnetT = P.secs;
        api.fx.text(sx, o.y - 18, 'PEARL MAGNET', P.color, 11);
      }
      jingle(o.kind);
    }
    function collectPearl(o, sx) {
      o.got = true;
      chain = Math.min(SCORE.chainMax, chain + 1);
      var pts = SCORE.pearl * chain;
      pearls += pts;
      burst('spark', sx, o.y, 14, 140, 0.5, 2, PEARL);
      api.fx.text(sx, o.y - 16, '+' + pts + (chain > 1 ? ' x' + chain : ''), PEARL, 12);
      // the chain climbs the current zone's scale, locked to the grid
      if (M()) M().note(zone === 2 ? 'bell' : 'marimba', chain - 1, { quantize: '16', octave: 1, gain: 0.75 });
      else api.audio.tone(600 + chain * 60, 0.08, { type: 'triangle', vol: 0.14 });
    }
    function openChest(o, sx, cy) {
      o.got = true;
      var pts = SCORE.treasure + SCORE.treasureStep * zonesReached;
      treasure += pts;
      burst('spark', sx, cy, 34, 220, 0.9, 2.6, GOLD);
      burst('bubble', sx, cy, 12, 90, 1, 2.4, 'rgba(255,240,200,0.9)');
      api.fx.text(sx, cy - 28, 'TREASURE +' + pts, GOLD, 14);
      api.shake(4);
      jingle('treasure', 0.55); jingle('sparkle', 0.4);
    }

    /* ----------------------------------------------------- hazard updates */
    function updateThing(o, dt, wx) {
      var dx = o.x - wx, sx = o.x - dist;
      if (o.kind === 'eel') {
        var H2 = HAZARDS.eel;
        if (o.state === 'lurk' && dx > 0 && dx < speed * 1.05 + 30) {
          o.state = 'warn'; o.timer = H2.warn;
          if (M()) M().note('pluck', 1, { octave: 1, gain: 0.45 });
          api.audio.tone(130, 0.5, { type: 'sawtooth', slide: 0.6, vol: 0.06 });
        } else if (o.state === 'warn') {
          o.timer -= dt;
          if (o.timer <= 0) {
            o.state = 'lunge';
            if (M()) M().note('bass', 1, { octave: -1, gain: 0.6, dur: 0.3 });
            api.audio.noise(0.18, { cutoff: 1400, vol: 0.16 });
          }
        } else if (o.state === 'lunge') {
          o.e = Math.min(1, o.e + dt / H2.lunge);
          if (o.e >= 1) { o.state = 'hold'; o.timer = H2.hold; }
        } else if (o.state === 'hold') {
          o.timer -= dt;
          if (o.timer <= 0) o.state = 'retract';
        } else if (o.state === 'retract') {
          o.e = Math.max(0, o.e - dt / H2.retract);
          if (o.e <= 0) o.state = 'done';
        }
      } else if (o.kind === 'rock') {
        if (o.state === 'hang' && dx > 0 && dx < speed * 1.3 + 20) {
          o.state = 'warn'; o.timer = HAZARDS.rock.warn;
          api.audio.noise(0.7, { cutoff: 260, vol: 0.3 });
          api.shake(2);
        } else if (o.state === 'warn') {
          o.timer -= dt;
          if (Math.random() < 0.6) part('dust', sx + (Math.random() - 0.5) * 16, o.y - 4, (Math.random() - 0.5) * 10, 20 + Math.random() * 30, 0.7, 1.6, 'rgba(210,170,140,0.8)', true);
          if (o.timer <= 0) { o.state = 'fall'; api.audio.tone(90, 0.3, { type: 'sine', slide: 0.5, vol: 0.14 }); }
        } else if (o.state === 'fall') {
          o.y += o.sink * dt; o.spin += dt * 2.4;
          if (Math.random() < 0.4) part('bubble', sx, o.y - 10, 0, -20, 0.5, 1.5, 'rgba(255,220,200,0.6)', true);
          if (o.y + o.r * 0.6 >= edgeAt(o.x, 'bot')) {
            o.gone = true;
            if (sx > -20 && sx < W + 20) {
              burst('puff', sx, o.y, 10, 60, 0.9, 5, 'rgba(90,50,40,0.5)', true);
              burst('spark', sx, o.y, 10, 120, 0.5, 2, '#ff8a4a', true);
              api.audio.noise(0.3, { cutoff: 500, vol: 0.2 });
            }
          }
        }
      }
    }
    // returns true when the run ended
    function collideThing(o, wx, dt) {
      var dx = o.x - wx, sx = o.x - dist;
      if (dx < -60 || dx > 70 || o.gone) return false;
      var k = o.kind;
      if (k === 'pearl') {
        if (o.got) return false;
        var dy = o.y - y;
        if (dx * dx + dy * dy < (R + 9) * (R + 9)) collectPearl(o, sx);
        else if (dx < -30 && !o.missed) {
          o.missed = true;
          if (chain > 1) api.fx.text(PLAYER_X, y + 24, 'CHAIN LOST', '#8899aa', 10);
          chain = 0;
        }
      } else if (PICKUPS[k]) {
        if (!o.got && Math.hypot(dx, o.y + Math.sin(t * 2 + o.ph) * 3 - y) < R + 13) collect(o, sx);
      } else if (k === 'chest') {
        var cy = edgeAt(o.x, 'bot') - 10;
        if (!o.got && Math.hypot(dx, cy - y) < R + 15) openChest(o, sx, cy);
      } else if (k === 'urchin') {
        if (Math.hypot(dx, o.y - y) < R + o.r - 3) return hurt(HAZARDS.urchin.death);
      } else if (k === 'jelly') {
        var jy = jellyY(o);
        if (Math.hypot(dx, jy - y) < R + 9) return hurt(HAZARDS.jelly.death);
        if (Math.abs(dx) < R + 4 && y + R - 3 > jy && y - R + 3 < jy + o.tent) return hurt(HAZARDS.jelly.death);
      } else if (k === 'kelp') {
        var tipY = o.up ? o.base - o.len : o.base + o.len, sway = Math.sin(t * 2 + o.phase) * 10;
        if (Math.abs(dx - sway * 0.5) < 6 + R && (o.up ? y + R > tipY : y - R < tipY)) return hurt(HAZARDS.kelp.death);
      } else if (k === 'eel') {
        if (o.e > 0.05) {
          var b = eelBase(o), tip = eelTip(o, b);
          if (distSeg(wx, y, o.x, b.y, tip.x, tip.y) < R + 6) return hurt(HAZARDS.eel.death);
        }
      } else if (k === 'lure') {
        if (Math.hypot(dx, lureY(o) - y) < R + o.r - 2) return hurt(HAZARDS.lure.death);
      } else if (k === 'vent') {
        if (Math.abs(dx) < 16) {
          if (ventActive(o) && y + R > o.floor - o.reach) return hurt(HAZARDS.vent.death);
          vy -= 900 * dt;                                           // warm updraft
        }
      } else if (k === 'rock') {
        if (o.state === 'fall' && Math.hypot(dx, o.y - y) < R + o.r - 2) return hurt(HAZARDS.rock.death);
      }
      return false;
    }

    /* =============================================================== update */
    function update(dt) {
      t += dt;
      var inp = api.input;
      var hold = inp.held('hold') || inp.held('a') || inp.held('up');
      inp.takeSwipes();
      prop += dt * (hold ? 26 : 14);
      updateAmbient(dt);
      if (dead) { deadT += dt; updateDebris(dt); if (deadT > DEAD_SECS) api.gameOver(); return; }
      if (bannerT > 0) bannerT -= dt;
      zoneBlend = Math.min(1, zoneBlend + dt / 2.5);
      flashT = Math.max(0, flashT - dt); invulnT = Math.max(0, invulnT - dt);
      squash = Math.max(0, squash - dt * 3.2);
      if (!started) {
        var mid = (edgeAt(dist + PLAYER_X, 'top') + edgeAt(dist + PLAYER_X, 'bot')) / 2;
        y = mid + Math.sin(t * 3) * 8; vy = Math.cos(t * 3) * 24;
        tilt = vy / 900;
        if (hold || inp.hit('a') || inp.hit('up') || inp.hit('hold')) {
          started = true; vy = -120; squash = 0.5;
          if (M()) M().note('marimba', 4, { gain: 0.8 });
        }
        return;
      }
      /* physics + currents */
      vy += (hold ? -1450 : 1050) * dt;
      if (zone === 1) vy += Math.sin(t * 0.9) * 240 * dt;               // kelp sways you
      vy = U.clamp(vy, -380, 420);
      y += vy * dt;
      tilt += (U.clamp(vy / 800, -0.45, 0.45) - tilt) * Math.min(1, dt * 10);
      speed = Math.min(430, 190 + dist * 0.012);
      dist += speed * dt;
      fill();
      var metres = Math.floor(dist / 10);
      var z = zoneIndex(metres);
      if (z !== zone) changeZone(z);
      flareT = Math.max(0, flareT - dt); magnetT = Math.max(0, magnetT - dt);
      if (updateOxygen(dt)) return;

      /* walls */
      var wx = dist + PLAYER_X, near = 999, hit = 0, maxTop = -1e9, minBot = 1e9;
      for (var k = -1; k <= 1; k++) {
        var top = edgeAt(wx + k * R, 'top'), bot = edgeAt(wx + k * R, 'bot');
        maxTop = Math.max(maxTop, top); minBot = Math.min(minBot, bot);
        if (y - R < top) hit = -1; else if (y + R > bot) hit = 1;
        near = Math.min(near, y - R - top, bot - (y + R));
      }
      if (hit) {
        if (hurt('CRASHED')) return;
        y = U.clamp(y, maxTop + R + 1, minBot - R - 1);                  // shielded: bounce off the rock
        vy = hit < 0 ? 170 : -220; squash = 1;
        burst('puff', PLAYER_X, hit < 0 ? maxTop : minBot, 8, 50, 0.8, 4, 'rgba(140,120,100,0.45)', true);
      }
      closeCd -= dt;
      if (near < 7 && closeCd <= 0) {
        closeCd = 1.1; bonus += SCORE.close;
        api.fx.text(PLAYER_X + 30, y - 18, 'CLOSE +' + SCORE.close, '#bfefff', 11);
        if (M()) M().note('pluck', 7, { chord: true, octave: 1, gain: 0.5 });
      }
      puffT -= dt;
      if (near < 16 && puffT <= 0) {                                        // sediment stirred off the wall
        puffT = 0.07;
        var wallY = y - R - edgeAt(wx, 'top') < edgeAt(wx, 'bot') - y - R ? edgeAt(wx, 'top') + 3 : edgeAt(wx, 'bot') - 3;
        part('puff', PLAYER_X - 6 + Math.random() * 10, wallY, -30 + Math.random() * 20, (Math.random() - 0.5) * 16, 0.9, 3 + Math.random() * 3, zone === 3 ? 'rgba(60,40,36,0.5)' : 'rgba(150,135,110,0.4)', true);
      }

      /* things */
      for (var j = 0; j < things.length; j++) {
        var o = things[j];
        if (o.gone) continue;
        updateThing(o, dt, wx);
        if (!seen[o.kind] && PICKUPS[o.kind] && o.x - dist < W - 12) { seen[o.kind] = 1; o.isNew = true; U.store('cave_seen', seen); }
        if (magnetT > 0 && o.kind === 'pearl' && !o.got) {
          var mdx = o.x - wx, mdy = o.y - y, md = Math.hypot(mdx, mdy);
          if (md < 180 && mdx > -20) { var pull = Math.min(md, 520 * dt); o.x -= mdx / md * pull; o.y -= mdy / md * pull; o.pulled = true; }
        }
        if (collideThing(o, wx, dt)) return;
      }
      reserveAir(dt);

      if (!bestShown && metres >= bestAtStart) {
        bestShown = true;
        api.fx.text(PLAYER_X + 40, y - 30, 'NEW BEST DEPTH!', GOLD, 12);
        jingle('best', 0.55);
      }
      api.setScore(metres + pearls + bonus + treasure);
      bubbleT += dt;
      if (bubbleT > 0.045) {
        bubbleT = 0;
        var ca = Math.cos(tilt), sa = Math.sin(tilt);
        part('bubble', PLAYER_X - 20 * ca, y - 20 * sa + (Math.random() - 0.5) * 4, -speed * 0.35 - 30, -10 - Math.random() * 25, 0.7 + Math.random() * 0.4, 1.2 + Math.random() * 1.6, 'rgba(200,240,255,0.8)');
      }
      musicTick(hold);
      api.setStatus(ZONES[zone].name + '  \u00b7  ' + metres + ' m  \u00b7  O2 ' + Math.ceil(oxygen) + '%' + (chain > 1 ? '  \u00b7  CHAIN x' + chain : ''));
    }

    /* =============================================================== render */
    function buildPaths() {
      var offset = dist - firstCol * COL, first = -1, last = -1, i;
      for (i = 0; i < cols.length; i++) {
        var sx = i * COL - offset;
        if (sx < -COL * 2 || sx > W + COL * 2) continue;
        if (first < 0) first = i;
        last = i;
      }
      var top = new root.Path2D(), bot = new root.Path2D(), te = new root.Path2D(), be = new root.Path2D();
      var x0 = first * COL - offset, x1 = last * COL - offset;
      top.moveTo(x0, -20); bot.moveTo(x0, H + 20);
      for (i = first; i <= last; i++) {
        var x = i * COL - offset, c = cols[i];
        top.lineTo(x, c.top); bot.lineTo(x, c.bot);
        if (i === first) { te.moveTo(x, c.top); be.moveTo(x, c.bot); } else { te.lineTo(x, c.top); be.lineTo(x, c.bot); }
      }
      top.lineTo(x1, -20); top.closePath(); bot.lineTo(x1, H + 20); bot.closePath();
      return { top: top, bot: bot, topEdge: te, botEdge: be, first: first, last: last, offset: offset };
    }
    function drawWater(ctx) {
      var b = zoneBlend, blending = b < 1 && zone !== prevZone;          // the far layer carries the water gradient
      drawParallax(ctx, blending ? prevZone : zone, dist, 1, dev.k);
      if (blending) drawParallax(ctx, zone, dist, b, dev.k);
    }
    function drawBeams(ctx) {
      var w = zoneW(0) + zoneW(1) * 0.45;
      if (w < 0.02) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.imageSmoothingEnabled = false;                                   // soft gradients: no filtering needed
      for (var k = 0; k < 3; k++) {
        var x = ((k * 290 - dist * 0.05 + Math.sin(t * 0.25 + k * 2) * 40) % (W + 300) + W + 300) % (W + 300) - 200;
        ctx.globalAlpha = w * (0.55 + 0.45 * Math.sin(t * 0.6 + k * 1.7));
        ctx.drawImage(S.beam, x, 0, 200 * (0.8 + (k % 3) * 0.2), H);
      }
      ctx.restore();
    }
    function drawBackLife(ctx) {
      var wl = zoneW(0) + zoneW(1);
      ctx.save();
      if (wl > 0.02) {
        ctx.fillStyle = zone === 1 || prevZone === 1 && zoneBlend < 0.5 ? 'rgba(10,50,30,0.55)' : 'rgba(6,50,70,0.6)';
        ctx.globalAlpha = wl * 0.8;
        fishes.forEach(function (f) {
          for (var q = 0; q < 3; q++) {                                  // tiny schools of three
            var fx = f.x + q * 11 * f.s, fy = f.y + (q % 2 ? 6 : -4) * f.s, s = 5 * f.s;
            ctx.beginPath();
            ctx.moveTo(fx - s, fy); ctx.quadraticCurveTo(fx, fy - s * 0.6, fx + s, fy);
            ctx.quadraticCurveTo(fx, fy + s * 0.6, fx - s, fy);
            ctx.lineTo(fx + s * 1.6, fy - s * 0.5 + Math.sin(t * 10 + f.p + q) * 1.5); ctx.lineTo(fx + s * 1.6, fy + s * 0.5); ctx.closePath();
            ctx.fill();
          }
        });
      }
      ctx.restore();
      if (zoneW(1) > 0.02) drawKelpFronds(ctx, zoneW(1));
    }
    function drawKelpFronds(ctx, w) {                                     // swaying mid-depth kelp
      ctx.save(); ctx.globalAlpha = w * 0.7; ctx.lineCap = 'round';
      for (var k = 0; k < 7; k++) {
        var x = ((k * 131 - dist * 0.3) % (W + 160) + W + 160) % (W + 160) - 80, hgt = 190 + (k * 53) % 120;
        ctx.strokeStyle = '#0b3d22'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x, H);
        for (var s = 1; s <= 10; s++) { var f = s / 10; ctx.lineTo(x + Math.sin(t * 0.9 + k + f * 2.4) * 16 * f, H - hgt * f); }
        ctx.stroke();
        ctx.fillStyle = '#0d4a2a';
        for (s = 2; s <= 10; s += 1) {
          var f2 = s / 10, lx = x + Math.sin(t * 0.9 + k + f2 * 2.4) * 16 * f2, ly = H - hgt * f2;
          ctx.beginPath(); ctx.ellipse(lx + (s % 2 ? 7 : -7), ly, 9, 3, (s % 2 ? -0.5 : 0.5) + Math.sin(t + s) * 0.2, 0, TAU); ctx.fill();
        }
      }
      ctx.restore();
    }
    function drawMotesBack(ctx) {
      var w = zoneW(0) + zoneW(1);
      if (w < 0.02) return;
      ctx.save(); ctx.fillStyle = 'rgba(235,250,255,1)';
      motes.forEach(function (o) { ctx.globalAlpha = w * (0.15 + 0.35 * o.z); var s = 0.6 + o.z * 1.3; ctx.fillRect(o.x, o.y, s, s); });
      ctx.restore();
    }
    function drawMotesLit(ctx) {                                          // plankton and embers
      var wa = zoneW(2), wv = zoneW(3), fk = flareK();
      if (wa < 0.02 && wv < 0.02) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      motes.forEach(function (o, k) {
        if (wa > 0.02) {
          var d = Math.hypot(o.x - PLAYER_X - 30, o.y - y), glow = Math.max(0, 1 - d / 130);
          ctx.globalAlpha = wa * Math.min(1, 0.14 + glow * 0.95 + fk * 0.2) * (0.6 + 0.4 * Math.sin(t * 3 + o.p));
          ctx.fillStyle = k % 3 ? '#7df9ff' : '#8dff9a';
          var s = 1 + o.z * (1.2 + glow * 1.6);
          ctx.beginPath(); ctx.arc(o.x, o.y, s, 0, TAU); ctx.fill();
        }
        if (wv > 0.02 && k % 2 === 0) {
          ctx.globalAlpha = wv * (0.35 + 0.5 * Math.abs(Math.sin(t * 5 + o.p))) * o.z;
          ctx.fillStyle = k % 4 ? '#ff8a3c' : '#ffd08a';
          ctx.fillRect(o.x, o.y, 1.4 + o.z, 1.4 + o.z);
        }
      });
      ctx.restore();
    }
    function drawAbyssJellies(ctx) {                                     // distant bioluminescence
      var w = zoneW(2);
      if (w < 0.02) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      fishes.forEach(function (f, k) {
        if (k % 2) return;
        var pulse = 0.5 + 0.5 * Math.sin(t * 2 + f.p), s = 3 + f.s * 3;
        ctx.globalAlpha = w * (0.2 + 0.35 * pulse);
        var gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, s * 3);
        gr.addColorStop(0, k % 4 ? 'rgba(120,200,255,0.9)' : 'rgba(255,120,220,0.9)'); gr.addColorStop(1, 'rgba(80,120,255,0)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y, s * 3, 0, TAU); ctx.fill();
        ctx.strokeStyle = k % 4 ? 'rgba(150,220,255,0.6)' : 'rgba(255,160,230,0.6)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(f.x, f.y, s, Math.PI, 0); ctx.stroke();
        for (var q = -1; q <= 1; q++) { ctx.beginPath(); ctx.moveTo(f.x + q * s * 0.6, f.y); ctx.quadraticCurveTo(f.x + q * s * 0.6 + Math.sin(t * 3 + q) * 2, f.y + s * 1.5, f.x + q * s * 0.4, f.y + s * 3); ctx.stroke(); }
      });
      ctx.restore();
    }

    function drawWalls(ctx) {
      var P = ZONES[prevZone], Z = ZONES[zone], b = zoneBlend, ox = -(dist % TILE);
      // 1. deep rock: the zone tile pre-darkened (crossfading between zones)
      var layers = b >= 1 || zone === prevZone ? [[zone, 1]] : [[prevZone, 1], [zone, b]];
      layers.forEach(function (L) {
        var pat = patFor(ctx, zoneArt(L[0]).rockDark);
        patOffset(pat, ox, 0);
        ctx.globalAlpha = L[1];
        ctx.fillStyle = pat; ctx.fill(paths.top); ctx.fill(paths.bot);
      });
      ctx.globalAlpha = 1;
      // 2. the rock face near the edge is lit: soft bands of the full-brightness
      //    tile, then caustics (reef) or green dapple (kelp), clipped to the rock
      var wc = zoneW(0), wd = zoneW(1), light = null, lightA = 0;
      if (wc > 0.02 || wd > 0.02) {
        light = wc >= wd ? S.caustic[Math.floor(t * 12) % S.caustic.length] : S.dapple;
        lightA = wc >= wd ? wc * 0.5 : wd * 0.4;
      }
      [[paths.top, paths.topEdge, 0.6], [paths.bot, paths.botEdge, 1]].forEach(function (side) {
        ctx.save();
        ctx.clip(side[0]);
        ctx.lineJoin = 'round';
        layers.forEach(function (L) {
          var pat = patFor(ctx, zoneArt(L[0]).rock);
          patOffset(pat, ox, 0);
          ctx.strokeStyle = pat;
          [[46, 0.4], [14, 1]].forEach(function (band) {
            ctx.globalAlpha = L[1] * band[1] * (band[1] < 1 ? 1 : 0.6 + 0.4 * side[2]); ctx.lineWidth = band[0]; ctx.stroke(side[1]);
          });
        });
        if (light && side[2] === 1) {                                     // light falls on the floor
          var lp = patFor(ctx, light), size = light.width;
          patOffset(lp, Math.round(-(dist % size) + Math.sin(t * 0.4) * 12), Math.round(Math.cos(t * 0.3) * 10));
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = lp; ctx.globalAlpha = lightA; ctx.lineWidth = 76; ctx.stroke(side[1]);
        }
        ctx.restore();
      });
      // 4. edge decor from each column's own zone
      var offset = paths.offset;
      for (var i = paths.first; i <= paths.last; i++) {
        var c = cols[i], x = i * COL - offset, A = zoneArt(c.z);
        if (c.decoF) drawSprite(ctx, A.floor[c.decoF.k], x, c.bot + 3, c.decoF.s, 0.5, 1);
        if (c.decoC) drawSprite(ctx, A.ceil[c.decoC.k], x, c.top - 2, c.decoC.s, 0.5, 0);
      }
      // 5. lit rim: brighter on the floor (light falls from above)
      var pulse = M() ? M().pulse(4) : 0;
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3;
      ctx.save(); ctx.translate(0, 2); ctx.stroke(paths.botEdge); ctx.restore();
      ctx.save(); ctx.translate(0, -2); ctx.stroke(paths.topEdge); ctx.restore();
      var floorCol = mixHex(P.rimFloor, Z.rimFloor, b), ceilCol = mixHex(P.rimCeil, Z.rimCeil, b);
      glowStroke(ctx, paths.botEdge, floorCol, 2.2, 0.16 + pulse * 0.12);   // a wide faint stroke is the glow
      glowStroke(ctx, paths.topEdge, ceilCol, 1.6, 0.12 + pulse * 0.1);
      ctx.globalAlpha = 0.55; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 0.8;
      ctx.stroke(paths.botEdge);
      ctx.restore();
    }
    // Trapped air under the ceiling. The lit pass redraws it over the
    // darkness so pockets can be found in the abyss.
    function drawDomes(ctx, litAlpha) {
      var offset = paths.offset;
      if (litAlpha != null && litAlpha < 0.05) return;
      for (var i = paths.first; i <= paths.last; i++) {
        var c = cols[i];
        if (c.air == null) continue;
        var j = i, x0 = i * COL - offset, line = c.air;
        while (j + 1 <= paths.last && cols[j + 1].air != null) j++;
        var x1 = j * COL - offset;
        ctx.save();
        if (litAlpha != null) ctx.globalAlpha = litAlpha;
        ctx.beginPath(); ctx.moveTo(x0 - COL, line);
        for (var k = i; k <= j; k++) ctx.lineTo(k * COL - offset, Math.min(line, cols[k].top));
        ctx.lineTo(x1 + COL, line); ctx.closePath();
        var gr = ctx.createLinearGradient(0, line - 40, 0, line);
        gr.addColorStop(0, 'rgba(210,245,255,0.18)'); gr.addColorStop(1, 'rgba(230,252,255,0.42)');
        ctx.fillStyle = gr; ctx.fill();
        ctx.strokeStyle = 'rgba(240,255,255,0.85)'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (var x = x0 - COL * 0.5; x <= x1 + COL * 0.5; x += 4) {
          var yy = line + Math.sin(x * 0.2 + t * 4) * 1.2;
          if (x <= x0 - COL * 0.5) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
        var ga = litAlpha == null ? 1 : litAlpha;
        ctx.globalAlpha = 0.25 * ga; ctx.lineWidth = 5; ctx.stroke();
        ctx.globalAlpha = ga;
        hudText(ctx, 'AIR', (x0 + x1) / 2, line - 6, 'rgba(230,252,255,0.8)', 9, 'center', 800);
        ctx.restore();
        i = j;
      }
    }

    /* ---------------------------------------------------- things: art */
    function drawJelly(ctx, o, sx, lit) {
      var jy = jellyY(o), pulse = 0.5 + 0.5 * Math.sin(t * TAU / o.per * 2 + o.ph);
      var bw = 11 * (1 + 0.14 * pulse), bh = 9 * (1 - 0.12 * pulse);
      var near = Math.max(0, 1 - Math.hypot(sx - PLAYER_X, jy - y) / 110);
      if (lit) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        var gr = ctx.createRadialGradient(sx, jy - 2, 1, sx, jy - 2, 26 + near * 10);
        gr.addColorStop(0, 'rgba(255,120,220,' + (0.3 + near * 0.3) + ')'); gr.addColorStop(1, 'rgba(255,90,200,0)');
        ctx.fillStyle = gr; ctx.fillRect(sx - 40, jy - 40, 80, 80);
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.lineCap = 'round';
      for (var k = 0; k < 5; k++) {                                       // stinging tentacles
        var x0 = sx - bw * 0.7 + k * bw * 0.35;
        ctx.strokeStyle = near > 0.2 ? 'rgba(255,90,200,' + (0.6 + near * 0.4) + ')' : 'rgba(255,170,235,0.6)';
        ctx.lineWidth = 1 + near * 0.8;
        ctx.beginPath(); ctx.moveTo(x0, jy);
        for (var s = 1; s <= 6; s++) ctx.lineTo(x0 + Math.sin(t * 4 + k + s * 0.9) * 2.4 * s / 6, jy + o.tent * s / 6 * (0.9 + 0.1 * pulse));
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,200,240,0.8)'; ctx.lineWidth = 2.4;          // frilly oral arms
      ctx.beginPath(); ctx.moveTo(sx - 2, jy); ctx.quadraticCurveTo(sx - 5 + Math.sin(t * 3) * 2, jy + 8, sx - 1, jy + 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx + 2, jy); ctx.quadraticCurveTo(sx + 5 + Math.sin(t * 3 + 1) * 2, jy + 8, sx + 1, jy + 14); ctx.stroke();
      var bg = ctx.createRadialGradient(sx - 2, jy - bh, 1, sx, jy - bh * 0.5, bw * 1.2);
      bg.addColorStop(0, 'rgba(255,235,252,0.92)'); bg.addColorStop(0.5, 'rgba(240,130,215,0.6)'); bg.addColorStop(1, 'rgba(170,70,210,0.35)');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.ellipse(sx, jy, bw, bh * 1.35, 0, Math.PI, 0);
      for (var q = 0; q < 6; q++) { var qx = sx + bw - (q + 0.5) * bw / 3; ctx.quadraticCurveTo(qx + bw / 6, jy + 3, qx - bw / 6, jy); }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,225,250,0.85)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(255,110,190,0.55)';
      for (q = 0; q < 4; q++) { ctx.beginPath(); ctx.ellipse(sx + Math.cos(q * 1.57) * 3, jy - bh * 0.55 + Math.sin(q * 1.57) * 2, 2, 1.3, q * 1.57, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    function drawKelp(ctx, o, sx) {
      var dir = o.up ? -1 : 1, segs = 9, pts = [];
      for (var q = 0; q <= segs; q++) { var f = q / segs; pts.push([sx + Math.sin(t * 2 + o.phase + f * 2) * 10 * f, o.base + dir * o.len * f]); }
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = '#155f31'; ctx.lineWidth = 6;
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      for (q = 1; q < segs; q++) {
        var p = pts[q], side = q % 2 ? 1 : -1, a = side * 0.9 + Math.sin(t * 2.5 + q) * 0.2;
        ctx.fillStyle = q % 3 ? '#2fae5c' : '#3cc46c';
        ctx.beginPath(); ctx.ellipse(p[0] + side * 7, p[1], 10, 3.4, a * dir, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(190,255,200,0.5)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + side * 13, p[1] + Math.sin(a * dir) * 4); ctx.stroke();
      }
      ctx.strokeStyle = '#5fe08a'; ctx.lineWidth = 1.6;
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      var tip = pts[segs];
      ctx.fillStyle = '#a6e05a'; ctx.beginPath(); ctx.arc(tip[0], tip[1], 3.4, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function drawEel(ctx, o, sx, lit) {
      var b = eelBase(o), dir = b.dir, hx = sx, hy = b.y - dir * 3;
      if (lit) {                                                          // glowing eyes in the den
        if (o.state === 'warn' || o.state === 'lunge' || o.state === 'hold') {
          var k = o.state === 'warn' ? 1 - o.timer / HAZARDS.eel.warn : 1, blink = o.state === 'warn' && Math.sin(t * 30) < -0.6 ? 0.3 : 1;
          var tip0 = eelTip(o, b), ex = o.e > 0.1 ? tip0.x - dist : hx, ey = o.e > 0.1 ? tip0.y - dir * 3 : hy;
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgba(255,230,80,' + (0.5 + 0.5 * k) * blink + ')'; ctx.shadowColor = '#ffe14d'; ctx.shadowBlur = 10 + k * 10;
          ctx.beginPath(); ctx.arc(ex - 4, ey, 1.8 + k, 0, TAU); ctx.arc(ex + 4, ey, 1.8 + k, 0, TAU); ctx.fill();
          ctx.restore();
          if (o.state === 'warn') {
            ctx.save(); ctx.globalAlpha = 0.35 + 0.35 * k; ctx.strokeStyle = BAD; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, b.y + dir * o.L); ctx.stroke(); ctx.restore();
          }
        } else if (zoneW(2) > 0.3) {
          ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = '#7d8cff'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(hx, hy, 12, 6, 0, 0, TAU); ctx.stroke(); ctx.restore();
        }
        return;
      }
      ctx.save();
      ctx.fillStyle = '#010204';                                          // the den
      ctx.beginPath(); ctx.ellipse(hx, hy, 12, 6.5, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(hx, hy, 13, 7.5, 0, dir > 0 ? 0.2 : Math.PI + 0.2, dir > 0 ? Math.PI - 0.2 : TAU - 0.2); ctx.stroke();
      if (o.e > 0.02) {
        var tip = eelTip(o, b), tx = tip.x - dist, ty = tip.y, deep = zoneW(2) > 0.5;
        var body = deep ? '#5a67a8' : '#8a9a34', belly = deep ? '#b8c2ff' : '#e0e89a', cxq = hx - (tx - hx) - 6, cyq = (hy + ty) / 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(0,0,0,0.65)'; ctx.lineWidth = 14;                // outline keeps it readable on dark rock
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(cxq, cyq, tx, ty); ctx.stroke();
        ctx.strokeStyle = body; ctx.lineWidth = 11; ctx.stroke();
        ctx.strokeStyle = belly; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hx + 2, hy); ctx.quadraticCurveTo(cxq + 2, cyq, tx + 2, ty); ctx.stroke();
        ctx.fillStyle = 'rgba(20,24,8,0.55)';                                 // moray spots
        for (var sp = 0.15; sp < 0.9; sp += 0.18) {
          var u2 = 1 - sp, px = u2 * u2 * hx + 2 * u2 * sp * cxq + sp * sp * tx, py = u2 * u2 * hy + 2 * u2 * sp * cyq + sp * sp * ty;
          ctx.beginPath(); ctx.arc(px - 2, py, 1.6, 0, TAU); ctx.fill();
        }
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.beginPath(); ctx.ellipse(tx, ty, 9.5, 10.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = body;                                              // head with open jaw
        ctx.beginPath(); ctx.ellipse(tx, ty, 8, 9, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#12050a';
        ctx.beginPath(); ctx.moveTo(tx - 6, ty + dir * 4); ctx.lineTo(tx, ty + dir * 12); ctx.lineTo(tx + 6, ty + dir * 4); ctx.fill();
        ctx.fillStyle = '#f5f0e0';
        for (var q = -1; q <= 1; q++) { ctx.beginPath(); ctx.moveTo(tx + q * 3 - 1, ty + dir * 5); ctx.lineTo(tx + q * 3, ty + dir * 8); ctx.lineTo(tx + q * 3 + 1, ty + dir * 5); ctx.fill(); }
      }
      ctx.restore();
    }
    function drawLure(ctx, o, sx, lit) {
      var ly = lureY(o), bx = sx + 36, by = ly + 22;
      if (lit) {
        ctx.save();
        ctx.fillStyle = '#d6f4ff'; ctx.shadowColor = '#6fd0ff'; ctx.shadowBlur = 26;
        ctx.beginPath(); ctx.arc(sx, ly, 5 + Math.sin(t * 6 + o.phase), 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'lighter'; ctx.shadowBlur = 0;
        var gr = ctx.createRadialGradient(sx, ly, 2, sx, ly, 46);
        gr.addColorStop(0, 'rgba(120,210,255,0.35)'); gr.addColorStop(1, 'rgba(120,210,255,0)');
        ctx.fillStyle = gr; ctx.fillRect(sx - 46, ly - 46, 92, 92);
        ctx.globalAlpha = 0.5 + 0.3 * darkness();                      // teeth catch the lure light
        ctx.fillStyle = 'rgba(230,240,255,0.85)';
        for (var q = 0; q < 5; q++) { ctx.beginPath(); ctx.moveTo(bx - 20 + q * 4, by - 3); ctx.lineTo(bx - 18 + q * 4, by + 3); ctx.lineTo(bx - 16 + q * 4, by - 3); ctx.fill(); }
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.strokeStyle = 'rgba(120,160,255,0.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx - 8, by - 14); ctx.quadraticCurveTo(sx + 16, ly - 10, sx, ly); ctx.stroke();
      var bg = ctx.createRadialGradient(bx, by - 6, 2, bx, by, 26);
      bg.addColorStop(0, 'rgba(60,70,120,0.95)'); bg.addColorStop(1, 'rgba(18,20,44,0.95)');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.ellipse(bx, by, 24, 16, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx + 20, by); ctx.lineTo(bx + 36, by - 12); ctx.lineTo(bx + 34, by + 12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#05040a';
      ctx.beginPath(); ctx.moveTo(bx - 23, by - 4); ctx.quadraticCurveTo(bx - 10, by + 2, bx - 23, by + 8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e8f0ff'; ctx.beginPath(); ctx.arc(bx - 10, by - 7, 2, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function drawVent(ctx, o, sx, lit) {
      var act = ventActive(o), warn = ventWarn(o), ph = ventPhase(o);
      if (!lit) {
        ctx.save();
        var cg = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0);
        cg.addColorStop(0, '#12070a'); cg.addColorStop(0.5, '#3a1a10'); cg.addColorStop(1, '#0c0406');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.moveTo(sx - 17, o.floor + 3); ctx.lineTo(sx - 9, o.floor - 10); ctx.lineTo(sx - 6, o.floor - 18); ctx.lineTo(sx + 6, o.floor - 18); ctx.lineTo(sx + 9, o.floor - 10); ctx.lineTo(sx + 17, o.floor + 3); ctx.fill();
        ctx.strokeStyle = 'rgba(255,110,40,' + (act ? 0.95 : warn ? 0.7 : 0.35) + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(sx - 4, o.floor - 16); ctx.lineTo(sx - 2, o.floor - 8); ctx.lineTo(sx - 5, o.floor); ctx.stroke();
        ctx.restore();
        return;
      }
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var mouth = o.floor - 18, plumeTop = act ? o.floor - o.reach : warn ? mouth - (o.reach - 18) * 0.35 * (ph - 0.5) / 0.22 : mouth - 14;
      var g2 = ctx.createLinearGradient(0, mouth, 0, plumeTop);
      g2.addColorStop(0, act ? 'rgba(255,150,60,0.8)' : warn ? 'rgba(255,170,90,0.4)' : 'rgba(255,200,160,0.15)');
      g2.addColorStop(1, 'rgba(255,110,40,0)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.moveTo(sx - 6, mouth);
      for (var yy = mouth; yy >= plumeTop; yy -= 6) { var wdt = 6 + (mouth - yy) * (act ? 0.16 : 0.08); ctx.lineTo(sx - wdt + Math.sin(yy * 0.12 + t * 12) * 2.5, yy); }
      for (yy = plumeTop; yy <= mouth; yy += 6) { var wd2 = 6 + (mouth - yy) * (act ? 0.16 : 0.08); ctx.lineTo(sx + wd2 + Math.sin(yy * 0.12 + t * 12 + 2) * 2.5, yy); }
      ctx.closePath(); ctx.fill();
      var mg = ctx.createRadialGradient(sx, mouth, 0, sx, mouth, act ? 30 : 18);
      mg.addColorStop(0, 'rgba(255,190,90,' + (act ? 0.8 : warn ? 0.5 : 0.25) + ')'); mg.addColorStop(1, 'rgba(255,90,30,0)');
      ctx.fillStyle = mg; ctx.fillRect(sx - 30, mouth - 30, 60, 60);
      ctx.globalCompositeOperation = 'source-over';
      if (warn || act) {                                                   // heat shimmer above the mouth
        ctx.strokeStyle = 'rgba(255,220,190,' + (act ? 0.22 : 0.16) + ')'; ctx.lineWidth = 1;
        for (var q = -1; q <= 1; q++) {
          ctx.beginPath();
          for (yy = mouth - 4; yy > plumeTop - 30; yy -= 5) ctx.lineTo(sx + q * 7 + Math.sin(yy * 0.3 + t * 14 + q) * 2, yy);
          ctx.stroke();
        }
      }
      ctx.restore();
      if (act && Math.random() < 0.5) part('steam', sx + (Math.random() - 0.5) * 10, mouth - Math.random() * o.reach * 0.6, (Math.random() - 0.5) * 20, -40, 0.6, 3, 'rgba(255,200,170,0.25)', true);
    }
    function drawRock(ctx, o, sx, lit) {
      var jit = o.state === 'warn' ? (Math.random() - 0.5) * 2.5 : 0;
      if (lit) {
        if (o.state === 'warn' || o.state === 'fall') {                     // drop line and landing mark
          var fy = edgeAt(o.x, 'bot');
          ctx.save(); ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 20); ctx.strokeStyle = WARN; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]);
          if (o.state === 'warn') { ctx.beginPath(); ctx.moveTo(sx, o.y + 12); ctx.lineTo(sx, fy - 5); ctx.stroke(); }
          ctx.setLineDash([]); ctx.strokeStyle = BAD; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(sx, fy - 2, 13, 4, 0, 0, TAU); ctx.stroke();
          ctx.restore();
        }
        return;
      }
      ctx.save();
      ctx.translate(sx + jit, o.y); ctx.rotate(o.state === 'fall' ? o.spin : 0);
      drawSprite(ctx, S.boulder, 0, 0, 1);
      ctx.restore();
      if (o.state !== 'fall') {                                              // the crack it will fall from
        ctx.save(); ctx.strokeStyle = 'rgba(20,6,2,0.8)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(sx - 14, o.y - 8); ctx.lineTo(sx - 8, o.y - 3); ctx.lineTo(sx + 2, o.y - 7); ctx.lineTo(sx + 12, o.y - 2); ctx.stroke(); ctx.restore();
      }
    }
    function drawPickup(ctx, o, sx) {
      var P = PICKUPS[o.kind], by = o.y + Math.sin(t * 2 + o.ph) * 3, s = 1 + Math.sin(t * 5 + o.ph) * 0.05;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var gr = ctx.createRadialGradient(sx, by, 4, sx, by, 26);
      gr.addColorStop(0, hexA(P.color, 0.3)); gr.addColorStop(1, hexA(P.color, 0));
      ctx.fillStyle = gr; ctx.fillRect(sx - 26, by - 26, 52, 52);
      ctx.restore();
      drawSprite(ctx, S.icons[o.kind], sx, by, s);
      if (o.isNew) {
        ctx.save();
        ctx.font = '800 9px ' + MONO;
        var label = 'NEW  ' + P.name, tw = Math.max(ctx.measureText(label).width, ctx.measureText(P.tip).width) + 14;
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = 'rgba(3,10,20,0.78)'; U.roundRect(ctx, sx - tw / 2, by + 18, tw, 26, 5); ctx.fill();
        ctx.strokeStyle = hexA(P.color, 0.7); ctx.lineWidth = 1; ctx.stroke();
        hudText(ctx, label, sx, by + 29, P.color, 9, 'center', 800);
        hudText(ctx, P.tip, sx, by + 40, 'rgba(230,240,255,0.85)', 8, 'center', 600);
        ctx.restore();
      }
    }
    function drawChest(ctx, o, sx) {
      var cy = edgeAt(o.x, 'bot');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var gr = ctx.createRadialGradient(sx, cy - 12, 2, sx, cy - 12, 34);
      gr.addColorStop(0, 'rgba(255,210,90,' + (0.35 + 0.15 * Math.sin(t * 4 + o.ph)) + ')'); gr.addColorStop(1, 'rgba(255,200,80,0)');
      ctx.fillStyle = gr; ctx.fillRect(sx - 34, cy - 46, 68, 68);
      ctx.restore();
      drawSprite(ctx, S.chest, sx, cy + 2, 0.95, 0.5, 1);
      if (Math.sin(t * 3 + o.ph) > 0.9) part('spark', sx + (Math.random() - 0.5) * 20, cy - 14 - Math.random() * 10, 0, -20, 0.4, 1.8, GOLD, true);
    }
    function drawThings(ctx, lit) {
      for (var j = 0; j < things.length; j++) {
        var o = things[j], sx = o.x - dist;
        if (o.gone || sx < -70 || sx > W + 70) continue;
        var k = o.kind;
        if (k === 'pearl') {
          if (!lit || o.got) continue;
          var ps = 1 + Math.sin(t * 5 + o.x) * 0.08;
          if (o.pulled) { ctx.save(); ctx.strokeStyle = 'rgba(201,162,255,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, o.y); ctx.lineTo(PLAYER_X, y); ctx.stroke(); ctx.restore(); }
          drawSprite(ctx, S.pearl, sx, o.y, ps);
        } else if (PICKUPS[k]) { if (lit && !o.got) drawPickup(ctx, o, sx); }
        else if (k === 'chest') { if (lit && !o.got) drawChest(ctx, o, sx); }
        else if (k === 'urchin') {
          if (lit) {
            var dk = darkness();
            if (dk > 0.2) { ctx.save(); ctx.globalAlpha = dk * 0.5; ctx.strokeStyle = '#d58cff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, o.y, o.r + 4, 0, TAU); ctx.stroke(); ctx.restore(); }
            continue;
          }
          ctx.save(); ctx.translate(sx, o.y); ctx.rotate(o.rot + t * 0.3); drawSprite(ctx, S.urchin, 0, 0, 0.95); ctx.restore();
        } else if (k === 'jelly') drawJelly(ctx, o, sx, lit);
        else if (k === 'kelp') { if (!lit) drawKelp(ctx, o, sx); }
        else if (k === 'eel') drawEel(ctx, o, sx, lit);
        else if (k === 'lure') drawLure(ctx, o, sx, lit);
        else if (k === 'vent') drawVent(ctx, o, sx, lit);
        else if (k === 'rock') drawRock(ctx, o, sx, lit);
      }
    }
    function drawBestLine(ctx) {
      if (bestAtStart <= 0) return;
      var sx = bestAtStart * 10 + PLAYER_X - dist;
      if (sx < -30 || sx > W + 30) return;
      var wx = bestAtStart * 10 + PLAYER_X, top = edgeAt(wx, 'top'), bot = edgeAt(wx, 'bot');
      ctx.save();
      ctx.strokeStyle = 'rgba(255,211,90,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t * 20;
      ctx.beginPath(); ctx.moveTo(sx, top + 14); ctx.lineTo(sx, bot); ctx.stroke();
      ctx.setLineDash([]);
      var by = top + 12 + Math.sin(t * 2) * 2;                               // the buoy
      ctx.strokeStyle = 'rgba(255,211,90,0.6)'; ctx.beginPath(); ctx.moveTo(sx, top); ctx.lineTo(sx, by); ctx.stroke();
      ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(sx, by + 4, 6, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(sx - 6, by + 4, 12, 3);
      ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(sx, by + 7, 6, 0, Math.PI); ctx.fill();
      ctx.shadowColor = GOLD; ctx.shadowBlur = 8;
      hudText(ctx, 'YOUR BEST ' + bestAtStart + ' m', sx + 10, by + 10, GOLD, 9, 'left', 800);
      ctx.restore();
    }
    function drawSub(ctx) {
      if (dead) return;
      drawSubAt(ctx, S, { x: PLAYER_X, y: y, tilt: tilt, sx: 1 + squash * 0.2, sy: 1 - squash * 0.18, prop: prop,
        flash: flashT / 0.6, alpha: invulnT > 0 && Math.floor(t * 18) % 2 === 0 ? 0.45 : 1 });
      if (shield) {
        ctx.save();
        var sp = 0.5 + 0.5 * Math.sin(t * 4);
        ctx.strokeStyle = hexA(PICKUPS.shell.color, 0.55 + sp * 0.25); ctx.lineWidth = 1.6;
        ctx.shadowColor = PICKUPS.shell.color; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.ellipse(PLAYER_X, y - 1, 25, 18, tilt, 0, TAU); ctx.stroke();
        ctx.shadowBlur = 0; ctx.fillStyle = hexA(PICKUPS.shell.color, 0.08); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(PLAYER_X - 10, y - 12, 5, 2, -0.5, 0, TAU); ctx.fill();
        ctx.restore();
      }
      if (magnetT > 0) {
        ctx.save(); ctx.strokeStyle = 'rgba(201,162,255,0.35)'; ctx.lineWidth = 1;
        for (var q = 0; q < 3; q++) { var rr = 20 + ((t * 40 + q * 14) % 42); ctx.globalAlpha = 1 - (rr - 20) / 42; ctx.beginPath(); ctx.arc(PLAYER_X, y, rr, 0, TAU); ctx.stroke(); }
        ctx.restore();
      }
    }
    function drawLampLit(ctx, dk) {
      if (dead) return;
      var lp = lampPos();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(lp.x, lp.y, 0, lp.x, lp.y, 12);
      g.addColorStop(0, 'rgba(255,250,220,0.95)'); g.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.fillStyle = g; ctx.fillRect(lp.x - 12, lp.y - 12, 24, 24);
      ctx.translate(lp.x, lp.y); ctx.rotate(tilt);                           // volumetric beam in the murk
      var bg = ctx.createLinearGradient(0, 0, 260, 0);
      bg.addColorStop(0, 'rgba(255,245,200,' + (0.02 + dk * 0.14) + ')'); bg.addColorStop(1, 'rgba(255,245,200,0)');
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(260, -80); ctx.lineTo(260, 80); ctx.lineTo(0, 2); ctx.fill();
      ctx.restore();
    }
    function drawParts(ctx, lit) {
      ctx.save();
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        if (!p.alive) continue;
        var a = p.life / p.max, glow = p.kind === 'spark' || p.kind === 'glass';
        if (glow !== !!lit) continue;
        ctx.globalAlpha = Math.max(0, Math.min(1, a * 1.4));
        if (p.kind === 'bubble') {
          ctx.strokeStyle = p.color; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(p.x - p.size * 0.45, p.y - p.size * 0.5, 1, 1);
        } else if (p.kind === 'puff' || p.kind === 'steam') {
          ctx.globalAlpha = a * 0.8; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
        } else {
          if (glow) ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.restore();
    }
    function drawDebris(ctx) {
      if (dead && deadT < 0.5 && debris.length) {                         // implosion shock ring
        ctx.save(); ctx.globalAlpha = 1 - deadT / 0.5; ctx.strokeStyle = 'rgba(220,245,255,0.9)'; ctx.lineWidth = 2.5 * (1 - deadT / 0.5) + 0.5;
        ctx.beginPath(); ctx.arc(debris[0].x0, debris[0].y0, 8 + deadT * 180, 0, TAU); ctx.stroke(); ctx.restore();
      }
      debris.forEach(function (d) {
        ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.a);
        ctx.globalAlpha = Math.max(0, 1 - deadT / (DEAD_SECS + 0.6));
        if (d.ring) {
          ctx.strokeStyle = d.col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, d.ring, 0, TAU); ctx.stroke();
          ctx.strokeStyle = 'rgba(190,240,255,0.8)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(1, 0); ctx.lineTo(-1, 2); ctx.stroke();
        } else {
          ctx.fillStyle = d.col; ctx.strokeStyle = 'rgba(60,20,0,0.9)'; ctx.lineWidth = 0.8;
          ctx.beginPath(); d.pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(40,10,0,0.8)';                                // crack lines on the hull pieces
          ctx.beginPath(); ctx.moveTo(d.pts[0][0] * 0.5, d.pts[0][1] * 0.5); ctx.lineTo(0, 0); ctx.lineTo(d.pts[1][0] * 0.4, d.pts[1][1] * 0.6); ctx.stroke();
        }
        ctx.restore();
      });
    }
    function drawForeground(ctx) {
      fgs.forEach(function (f) {
        var img = zoneArt(f.z).fg[f.k], s = f.s, bottom = f.k === 0;
        ctx.save(); ctx.globalAlpha = 0.72;
        drawSprite(ctx, img, f.x, bottom ? H + 6 : -6, s, 0.5, bottom ? 1 : 0);
        ctx.restore();
      });
    }
    // One overlay pass: darkness with the headlamp cut out, the vignette and
    // the low-oxygen red pulse.
    function drawOverlay(ctx, dk) {
      dctx.globalCompositeOperation = 'source-over';
      dctx.globalAlpha = 1;
      dctx.clearRect(0, 0, W, H);
      if (dk >= 0.02) cutDarkness(dk);
      dctx.globalCompositeOperation = 'source-over';
      dctx.drawImage(dev.vig, 0, 0, W, H);
      if (started && !dead && oxygen < O2.low) {
        dctx.globalAlpha = (oxygen < O2.critical ? 0.95 : 0.6) * (0.6 + 0.4 * Math.sin(t * (oxygen < O2.critical ? 12 : 7)));
        dctx.drawImage(dev.red, 0, 0, W, H);
        dctx.globalAlpha = 1;
      }
      blitDevice(ctx, dark);
    }
    function cutDarkness(dk) {
      var lp = lampPos(), fade = dead ? Math.max(0, 1 - deadT / DEAD_SECS) : 1, wv = zoneW(3);
      dctx.fillStyle = 'rgba(0,1,8,' + dk.toFixed(3) + ')';
      dctx.fillRect(0, 0, W, H);
      dctx.globalCompositeOperation = 'destination-out';
      if (wv > 0.02) {                                                     // the vents glow from below
        var vg = dctx.createLinearGradient(0, H, 0, H * 0.4);
        vg.addColorStop(0, 'rgba(0,0,0,' + 0.6 * wv + ')'); vg.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = vg; dctx.fillRect(0, H * 0.4, W, H * 0.6);
      }
      var halo = dctx.createRadialGradient(PLAYER_X, y, 8, PLAYER_X, y, 78);
      halo.addColorStop(0, 'rgba(0,0,0,' + fade + ')'); halo.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = halo; dctx.fillRect(PLAYER_X - 80, y - 80, 160, 160);
      if (!dead) {
        dctx.save(); dctx.translate(lp.x, lp.y); dctx.rotate(tilt);
        var cone = dctx.createRadialGradient(0, 0, 12, 40, 0, 330);
        cone.addColorStop(0, 'rgba(0,0,0,0.97)'); cone.addColorStop(0.55, 'rgba(0,0,0,0.6)'); cone.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = cone;
        dctx.beginPath(); dctx.moveTo(-4, -4); dctx.lineTo(340, -135); dctx.quadraticCurveTo(380, 0, 340, 135); dctx.lineTo(-4, 4); dctx.closePath(); dctx.fill();
        dctx.restore();
      }
      var pools = 0;
      things.forEach(function (o) {                                          // small light pools around self-lit things
        var sx = o.x - dist;
        if (pools >= 6 || o.gone || o.got || sx < -40 || sx > W + 40) return;
        var ly = o.kind === 'lure' ? lureY(o) : o.kind === 'jelly' ? jellyY(o) : PICKUPS[o.kind] ? o.y : null;
        if (ly == null) return;
        pools++;
        var r0 = o.kind === 'lure' ? 40 : o.kind === 'jelly' ? 34 : 22;
        var lg = dctx.createRadialGradient(sx, ly, 0, sx, ly, r0);
        lg.addColorStop(0, 'rgba(0,0,0,0.5)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = lg; dctx.fillRect(sx - r0, ly - r0, r0 * 2, r0 * 2);
      });
    }
    function drawDarkRims(ctx, dk) {                                      // faint self-lit cave edges
      if (dk < 0.3) return;
      ctx.save();
      ctx.globalAlpha = (dk - 0.3) * 0.55;
      glowStroke(ctx, paths.topEdge, ZONES[zone].edge, 1.1, 0.2);
      glowStroke(ctx, paths.botEdge, ZONES[zone].edge, 1.2, 0.2);
      ctx.restore();
    }
    function drawFlare(ctx) {
      var fk = flareK();
      if (fk <= 0) return;
      var fx = W * 0.6 + Math.sin(t * 0.8) * 30, fy = flareY + (PICKUPS.flare.secs - flareT) * 6;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(fx, fy, 2, fx, fy, 420);
      g.addColorStop(0, 'rgba(255,120,80,' + 0.28 * fk + ')'); g.addColorStop(1, 'rgba(255,80,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,240,200,' + fk + ')'; ctx.shadowColor = '#ff6a3c'; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(fx, fy, 3 + Math.random() * 1.5, 0, TAU); ctx.fill();
      ctx.restore();
      if (Math.random() < 0.5) part('spark', fx, fy, (Math.random() - 0.5) * 60, 20 + Math.random() * 40, 0.6, 1.6, '#ffb070');
    }

    /* ---------------------------------------------------------------- HUD */
    function drawHud(ctx) {
      // oxygen + chain panel (top left)
      ctx.save();
      ctx.globalAlpha = hudAlpha(8, 8, 128, 50);
      ctx.fillStyle = 'rgba(2,8,16,0.62)'; U.roundRect(ctx, 8, 8, 120, 42, 7); ctx.fill();
      ctx.strokeStyle = hexA(ZONES[zone].edge, 0.3); ctx.lineWidth = 1; ctx.stroke();
      var low = oxygen < O2.low, blink = low && Math.sin(t * (oxygen < O2.critical ? 18 : 10)) > 0;
      var col = oxygen > 50 ? AIRC : low ? BAD : WARN;
      hudText(ctx, 'O2', 16, 24, blink ? '#fff' : col, 10, 'left', 800);
      for (var s = 0; s < 10; s++) {
        var on = oxygen > s * 10 + 0.5;
        if (on) { ctx.fillStyle = hexA(col, 0.25); ctx.fillRect(34.5 + s * 8.6, 14.5, 9.6, 12); }
        ctx.fillStyle = on ? (blink ? '#fff' : col) : 'rgba(255,255,255,0.1)';
        ctx.fillRect(36 + s * 8.6, 16, 6.6, 9);
      }
      drawSprite(ctx, S.pearl, 20, 38, 0.8);
      hudText(ctx, chain > 0 ? 'x' + chain : '--', 31, 42, chain > 1 ? PEARL : 'rgba(230,240,255,0.5)', 10, 'left', 800);
      for (s = 0; s < SCORE.chainMax; s++) {
        ctx.fillStyle = s < chain ? PEARL : 'rgba(255,255,255,0.12)';
        ctx.fillRect(56 + s * 5.6, 35, 3.6, 5);
      }
      ctx.restore();
      if (low && started && !dead) {
        ctx.save();
        ctx.fillStyle = 'rgba(40,0,8,0.7)'; U.roundRect(ctx, 8, 52, 96, 17, 5); ctx.fill();
        ctx.globalAlpha = 0.65 + 0.35 * Math.sin(t * 10);
        hudText(ctx, oxygen < O2.critical ? 'AIR CRITICAL' : 'LOW AIR', 14, 64, '#ff6b82', 10, 'left', 800);
        ctx.restore();
      }
      // active powers
      var px = 20, py = low && started ? 84 : 68;
      [['shell', shield ? 1 : 0, null], ['flare', flareT, PICKUPS.flare.secs], ['magnet', magnetT, PICKUPS.magnet.secs]].forEach(function (pw) {
        if (!pw[1]) return;
        ctx.save();
        ctx.fillStyle = 'rgba(2,8,16,0.6)'; ctx.beginPath(); ctx.arc(px, py, 12, 0, TAU); ctx.fill();
        drawSprite(ctx, S.icons[pw[0]], px, py, 0.62);
        if (pw[2]) {
          ctx.strokeStyle = PICKUPS[pw[0]].color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(px, py, 12, -Math.PI / 2, -Math.PI / 2 + TAU * pw[1] / pw[2]); ctx.stroke();
        }
        ctx.restore();
        px += 28;
      });
      drawGauge(ctx);
    }
    function drawGauge(ctx) {
      var metres = dist / 10, x = W - 16, y0 = 40, y1 = H - 26, hg = y1 - y0;
      var range = Math.max(2800, Math.ceil((Math.max(metres, bestAtStart) + 500) / 400) * 400);
      ctx.save();
      ctx.globalAlpha = 0.95;
      hudText(ctx, Math.floor(metres) + ' m', W - 10, 24, '#eaf6ff', 12, 'right', 800);
      hudText(ctx, 'DEPTH', W - 10, 34, 'rgba(220,235,255,0.55)', 8, 'right', 700);
      if (!gauge.cv || gauge.range !== range) {                          // the zone bar only changes with its range
        gauge.range = range;
        gauge.cv = spriteCanvas(16, hg + 12, function (g) {
          g.fillStyle = 'rgba(2,8,16,0.6)'; U.roundRect(g, 2, 1, 12, hg + 10, 6); g.fill();
          for (var m = 0, prev = -1; m < range; m += 50) {
            var zi = zoneIndex(m);
            g.globalAlpha = 0.6; g.fillStyle = ZONES[zi].edge;
            g.fillRect(5, 6 + m / range * hg, 6, hg * 50 / range + 0.6);
            if (prev >= 0 && zi !== prev) { g.globalAlpha = 1; g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(3, 6 + m / range * hg, 10, 1); }
            prev = zi;
          }
        });
      }
      ctx.drawImage(gauge.cv, x - 8, y0 - 6, 16, hg + 12);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x - 3, y0, 6, hg * Math.min(1, metres / range));                // travelled part dims
      if (bestAtStart > 0) {
        var by = y0 + Math.min(1, bestAtStart / range) * hg;
        ctx.fillStyle = hexA(GOLD, 0.3); ctx.fillRect(x - 10, by - 2.5, 17, 5);
        ctx.fillStyle = GOLD; ctx.fillRect(x - 9, by - 1, 15, 2);
        hudText(ctx, 'BEST', x - 11, by + 3, GOLD, 8, 'right', 800);
      }
      var my = y0 + Math.min(1, metres / range) * hg;
      ctx.fillStyle = ACCENT;
      ctx.beginPath(); ctx.moveTo(x - 4, my); ctx.lineTo(x - 12, my - 5); ctx.lineTo(x - 12, my + 5); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function drawBanner(ctx) {
      if (bannerT <= 0) return;
      var Z = ZONES[zone], a = Math.min(1, bannerT / 0.6, (3.4 - bannerT) / 0.3);
      ctx.save();
      ctx.globalAlpha = a * (y < 110 ? 0.45 : 1);
      ctx.fillStyle = 'rgba(2,8,16,0.72)'; U.roundRect(ctx, W / 2 - 170, 44, 340, 66, 10); ctx.fill();
      ctx.strokeStyle = hexA(Z.edge, 0.55); ctx.lineWidth = 1; ctx.stroke();
      hudText(ctx, Z.from + ' m  \u00b7  ZONE ' + (zonesReached + 1), W / 2, 60, 'rgba(220,240,255,0.6)', 9, 'center', 700);
      U.glowText(ctx, Z.name, W / 2, 76, 16, Z.edge);
      hudText(ctx, Z.sub, W / 2, 96, 'rgba(230,240,255,0.85)', 9, 'center', 700);
      if (bannerLine) hudText(ctx, bannerLine, W / 2, 107, WARN, 8, 'center', 800);
      ctx.restore();
    }

    function render(ctx) {
      ensureDevice(ctx);
      paths = buildPaths();
      var dk = darkness();
      drawWater(ctx);
      drawBeams(ctx);
      drawBackLife(ctx);
      drawAbyssJellies(ctx);
      drawMotesBack(ctx);
      drawWalls(ctx);
      drawDomes(ctx);
      drawThings(ctx, false);
      drawBestLine(ctx);
      drawParts(ctx, false);
      drawSub(ctx);
      drawDebris(ctx);
      drawForeground(ctx);
      drawOverlay(ctx, dk);
      drawDarkRims(ctx, dk);
      drawDomes(ctx, dk * 0.85);
      drawMotesLit(ctx);
      drawThings(ctx, true);
      drawLampLit(ctx, dk);
      drawParts(ctx, true);
      drawFlare(ctx);
      drawHud(ctx);
      drawBanner(ctx);
      if (!started && !dead) {
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
        U.glowText(ctx, 'HOLD TO DIVE', W / 2, H / 2 + 70, 16, '#bfefff');
        ctx.globalAlpha = 0.8;
        hudText(ctx, 'HOLD = RISE   \u00b7   RELEASE = SINK   \u00b7   GRAB AIR', W / 2, H / 2 + 94, 'rgba(220,240,255,0.8)', 9, 'center', 700);
        ctx.restore();
      }
    }

    function airAhead() {                          // nearest ceiling air pocket ahead (test hook)
      for (var dx = 0; dx < 260; dx += COL) { var c = colAt(dist + PLAYER_X + dx); if (c.air != null) return { dx: dx, line: c.air }; }
      return null;
    }
    return {
      // Read-only test hook: what is on screen right now.
      debug: function () {
        var wx = dist + PLAYER_X, ax = wx + 40, list = [];
        things.forEach(function (o) {
          var sx = o.x - dist;
          if (o.gone || o.got || sx < PLAYER_X - 40 || sx > W + 20) return;
          var e = { kind: o.kind, sx: sx, x: o.x, reserve: !!o.reserve };
          if (o.kind === 'jelly') {
            e.y = jellyY(o); e.y0 = e.y - 12; e.y1 = e.y + o.tent; e.sweep = [o.mid - o.amp - 12, o.mid + o.amp + o.tent];
            e.yAt = (function (j) { return function (secs) { return j.mid + Math.sin((t + secs) * TAU / j.per + j.ph) * j.amp; }; })(o);
          } else if (o.kind === 'lure') {
            e.y = lureY(o); e.y0 = e.y - 12; e.y1 = e.y + 12; e.sweep = [o.baseY - o.amp - 12, o.baseY + o.amp + 12];
            e.yAt = (function (l) { return function (secs) { return l.baseY + Math.sin((t + secs) * 1.4 + l.phase) * l.amp; }; })(o);
          }
          else if (o.kind === 'eel') { var b = eelBase(o); e.state = o.state; e.y0 = Math.min(b.y, b.y + b.dir * o.L); e.y1 = Math.max(b.y, b.y + b.dir * o.L); e.side = o.side; }
          else if (o.kind === 'rock') { e.state = o.state; e.y = o.y; e.y0 = o.y - o.r; e.y1 = o.y + o.r; }
          else if (o.kind === 'kelp') { e.y0 = o.up ? o.base - o.len : o.base; e.y1 = o.up ? o.base : o.base + o.len; }
          else if (o.kind === 'vent') { e.y0 = o.floor - o.reach; e.y1 = o.floor; e.active = ventActive(o) || ventWarn(o); }
          else if (o.kind === 'urchin') { e.y = o.y; e.y0 = o.y - o.r; e.y1 = o.y + o.r; }
          else if (o.kind === 'chest') { e.y = edgeAt(o.x, 'bot') - 10; }
          else e.y = o.y;
          list.push(e);
        });
        return {
          y: y, vy: vy, top: edgeAt(ax, 'top'), bot: edgeAt(ax, 'bot'), zone: zone, metres: Math.floor(dist / 10), dead: dead,
          started: started, cause: cause, speed: speed, oxygen: oxygen, lowestOxygen: lowO2Min, shield: shield,
          flare: flareT, magnet: magnetT, chain: chain, pearls: pearls, bonus: bonus, treasure: treasure,
          reserveSpawns: reserveCount, inPocket: inPocket, airAhead: airAhead(), best: bestM, darkness: darkness(),
          topAt: function (dx) { return edgeAt(wx + dx, 'top'); }, botAt: function (dx) { return edgeAt(wx + dx, 'bot'); },
          things: list
        };
      },
      update: update,
      render: render
    };
  }

  /* ================================================================ attract
     Cabinet preview: the sub cruises through all four zones in turn.       */
  // Kept deliberately cheap: the room redraws every cabinet each tick. Each
  // zone's parallax is flattened once into a single panorama strip.
  var ATTRACT = { pano: [] };
  function attractPano(z) {
    if (ATTRACT.pano[z]) return ATTRACT.pano[z];
    var A = zoneArt(z), cv = makeCanvas(TW / 2, H / 2), g = cv.getContext('2d');
    g.scale(0.5, 0.5);
    g.drawImage(A.far, 0, 0, TW, H); g.drawImage(A.mid, 0, 0, TW, H); g.drawImage(A.near, 0, 0, TW, H);
    ATTRACT.pano[z] = cv;
    return cv;
  }
  function attract(ctx, w, h, t) {
    var S = sharedArt(), s = Math.max(w / W, h / H), cyc = t / 7, z = Math.floor(cyc) % 4, f = cyc - Math.floor(cyc);
    var Z = ZONES[z], A = zoneArt(z), off = t * 70, k;
    ctx.save();
    ctx.translate((w - W * s) / 2, (h - H * s) / 2); ctx.scale(s, s);
    tiled(ctx, attractPano(z), off * 0.2, TW, H);
    if (z === 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.7; ctx.drawImage(S.beam, ((200 - off * 0.05) % 800 + 800) % 800 - 150, 0);
      ctx.restore();
    }
    function cy(x) { return H / 2 + Math.sin((x + off) * 0.012) * 50 + Math.sin((x + off) * 0.031) * 14; }
    function gp(x) { return 170 + Math.sin((x + off) * 0.02) * 26; }
    var top = new root.Path2D(), bot = new root.Path2D(), te = new root.Path2D(), be = new root.Path2D();
    top.moveTo(-10, -10); bot.moveTo(-10, H + 10);
    for (var x = -10; x <= W + 10; x += 15) {
      var a = cy(x) - gp(x) / 2, b = cy(x) + gp(x) / 2;
      top.lineTo(x, a); bot.lineTo(x, b);
      if (x === -10) { te.moveTo(x, a); be.moveTo(x, b); } else { te.lineTo(x, a); be.lineTo(x, b); }
    }
    top.lineTo(W + 10, -10); top.closePath(); bot.lineTo(W + 10, H + 10); bot.closePath();
    var pat = patFor(ctx, A.rockDark); patOffset(pat, -(off % TILE), 0);
    ctx.fillStyle = pat; ctx.fill(top); ctx.fill(bot);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = hexA(Z.rimFloor, 0.25); ctx.lineWidth = 7; ctx.stroke(be);
    ctx.strokeStyle = Z.rimFloor; ctx.lineWidth = 2.2; ctx.stroke(be);
    ctx.strokeStyle = hexA(Z.rimCeil, 0.25); ctx.lineWidth = 6; ctx.stroke(te);
    ctx.strokeStyle = Z.rimCeil; ctx.lineWidth = 1.6; ctx.stroke(te);
    var px = W * 0.3, py = cy(px) + Math.sin(t * 2.2) * 16, slope = (cy(px + 20) - cy(px - 20)) / 40;
    for (k = 0; k < 4; k++) {                                          // pearls ahead on the line
      var kx = ((W * 0.55 + k * 70 - t * 70) % (W * 0.8) + W * 0.8) % (W * 0.8) + W * 0.35;
      drawSprite(ctx, S.pearl, kx, cy(kx), 1);
    }
    drawSprite(ctx, S.icons.air, ((W * 1.1 - t * 70) % (W + 200) + W + 200) % (W + 200) - 60, H / 2 + Math.sin(t * 0.8) * 30, 1);
    if (z === 0) { ctx.save(); ctx.translate(W * 0.75, cy(W * 0.75) + gp(W * 0.75) / 2 - 10); ctx.rotate(t * 0.3); drawSprite(ctx, S.urchin, 0, 0, 1); ctx.restore(); }
    ctx.lineWidth = 1;
    for (k = 0; k < 6; k++) {                                          // bubble trail
      var bt = (t * 1.6 + k / 6) % 1;
      ctx.strokeStyle = 'rgba(200,240,255,' + (0.8 - bt * 0.8) + ')';
      ctx.beginPath(); ctx.arc(px - 24 - bt * 90, py - bt * 30 + Math.sin(k + t * 5) * 3, 1.5 + bt * 2, 0, TAU); ctx.stroke();
    }
    drawSubAt(ctx, S, { x: px, y: py, tilt: Math.atan(slope) * 0.8 + Math.cos(t * 2.2) * 0.12, prop: t * 20 });
    if (Z.dark > 0.2) {                                                   // one gradient: lit ahead of the headlamp
      var dg = ctx.createRadialGradient(px + 70, py, 30, px + 70, py, 330);
      dg.addColorStop(0, 'rgba(0,1,8,0)'); dg.addColorStop(0.45, 'rgba(0,1,8,' + Z.dark * 0.6 + ')'); dg.addColorStop(1, 'rgba(0,1,8,' + Z.dark * 0.95 + ')');
      ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (k = 0; k < 24; k++) {
        var mx = ((k * 97 - t * 40) % W + W) % W, my = (k * 53 + Math.sin(t + k) * 10) % H, near = Math.max(0, 1 - Math.hypot(mx - px, my - py) / 150);
        ctx.fillStyle = z === 3 ? 'rgba(255,140,60,' + (0.3 + near * 0.6) + ')' : 'rgba(125,249,255,' + (0.12 + near * 0.85) + ')';
        ctx.fillRect(mx, my, 1.6 + near * 1.5, 1.6 + near * 1.5);
      }
      ctx.restore();
    }
    var fade = f < 0.08 ? 1 - f / 0.08 : f > 0.94 ? (f - 0.94) / 0.06 : 0;       // dip between zones
    if (fade > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fade * 0.85 + ')'; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_cave_diver',
    order: 3,
    title: 'Cave Diver',
    tagline: 'Reef, kelp, abyss, vents. Mind your air.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hold',
    controls: 'Hold Space / \u2191 / tap-and-hold',
    create: create,
    attract: attract
  });
})(window);

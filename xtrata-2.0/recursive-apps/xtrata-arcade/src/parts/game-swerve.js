/*
 * Xtrata Arcade cartridge #17 - SWERVE (v2)
 * Steer a light-cycle down a winding corridor. Drag (or use left/right) to
 * weave; thread the gates for points, skim walls and hazards for CLOSE
 * bonuses, and don't touch anything. The corridor tightens and speeds up.
 *
 *   zones      NEON TUNNEL -> CITY CANYON -> OCEAN TRENCH -> DEEP SPACE (then
 *              they cycle), each with its own walls, parallax and song
 *   hazards    introduced gradually: BARRIERS, SLIDING GATES, PILLARS,
 *              CHOKES (warned by chevrons), ROTORS (spinning bars in a
 *              chamber, always with a safe lane beside each tip)
 *   pickups    BOOST pads (speed burst + x2 score), SHIELD (forgives one
 *              hit), SLOW-MO (time slows, music dips with it)
 *   chains     close shaves in quick succession build a CHAIN multiplier
 *
 * Music: E-dorian synthwave in the tunnel, A-minor funk in the city,
 * D-dorian bells in the trench, F#-lydian pads in space; crossfaded per zone.
 * Speed drives tempo, close shaves play a riser + a pluck that climbs with
 * the chain, gates climb a pluck with the streak, every 500 m steps the key
 * up, slow-mo drops tempo and filter until it wears off.
 *
 * Contract game-id: xa_swerve (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-swerve');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ======================================================== constants */
  var W = 400, H = 600, PY = 480, SEGH = 10, PR = 8, TAU = Math.PI * 2;
  var ACCENT = '#3ff0ff', GATE = '#ffd23f', WARN = '#ffb000';
  var BASE_SPEED = 240, MAX_SPEED = 620;
  var TONES = [0, 2, 4, 7, 9, 11, 14, 16];       // climbing pluck degrees
  var KEY_STEPS = [0, 2, 4, 5, 7];              // key offsets per 500 m
  var CLOSE_PX = 6;                             // clearance that counts as a close shave
  var CHAIN_WINDOW = 1.8;                       // seconds to land the next shave
  var CHAIN_MAX = 8;
  var REARM_PX = 16;                            // pull this far off a wall to re-arm its shave
  var BAR_T = 4;                                // rotor half-thickness
  var ROTOR_LANE = 50;                          // gap between a rotor tip and the wall
  var SAFE_LANE = 44;                           // every hazard row leaves at least one lane this wide
  var TILE_H = 600;                             // parallax tile height

  /* ===================================================== environments
     Distance in metres (1 m = 10 world px). After the last bound the
     four zones keep cycling every ENV_CYCLE metres. */
  var ENVS = [
    { name: 'MEMPOOL TUNNEL', style: 'neon', filter: 18000,
      sky: ['#04030d', '#0b0526', '#1a0838'], fill: 'rgba(6,4,22,0.86)', floor: 'rgba(63,240,255,0.13)',
      wall: '#3ff0ff', wall2: '#ff3fa4', hazard: '#ff3fa4', streak: '#d9fdff', ship: '#3ff0ff' },
    { name: 'CITY CANYON', style: 'city', filter: 18000,
      sky: ['#12071f', '#34112f', '#6b2338'], fill: 'rgba(24,18,30,0.92)', floor: 'rgba(255,190,90,0.16)',
      wall: '#ffb347', wall2: '#ff6a3d', hazard: '#ff4d6d', streak: '#fff0d6', ship: '#ffcf7a' },
    { name: 'OCEAN TRENCH', style: 'ocean', filter: 2800,
      sky: ['#010812', '#02223d', '#043e5c'], fill: 'rgba(2,24,42,0.86)', floor: 'rgba(110,255,220,0.12)',
      wall: '#46f0c8', wall2: '#2a8cff', hazard: '#ff7a5a', streak: '#d0fff4', ship: '#7fffe0' },
    { name: 'DEEP SPACE', style: 'space', filter: 18000,
      sky: ['#000003', '#060420', '#150a36'], fill: 'rgba(6,4,24,0.82)', floor: 'rgba(160,170,255,0.12)',
      wall: '#8fa8ff', wall2: '#ffd23f', hazard: '#ff5a7a', streak: '#eef0ff', ship: '#b8c8ff' }
  ];
  var ENV_BOUNDS = [0, 400, 900, 1500, 2100];
  var ENV_CYCLE = 600;
  function zoneAt(m) {                          // 0,1,2,... counts every zone entered
    for (var i = ENV_BOUNDS.length - 1; i >= 0; i--) {
      if (m >= ENV_BOUNDS[i]) return i < 4 ? i : 4 + Math.floor((m - ENV_BOUNDS[4]) / ENV_CYCLE);
    }
    return 0;
  }
  function envAt(m) { return zoneAt(m) % 4; }
  function zoneSpan(m) {
    var z = zoneAt(m);
    if (z < 4) return [ENV_BOUNDS[z], ENV_BOUNDS[z + 1]];
    var a = ENV_BOUNDS[4] + (z - 4) * ENV_CYCLE;
    return [a, a + ENV_CYCLE];
  }

  /* ==================================================== feature table
     Everything that spawns in the corridor. `from` = first metre it may
     appear, `weight` = relative chance once unlocked. Gates are rewards;
     hazards kill; pickups help. */
  var KINDS = {
    gate:    { from: 0,   weight: 5,   label: 'GATE',         type: 'gate' },
    mgate:   { from: 220, weight: 3,   label: 'SLIDING GATE', type: 'gate' },
    barrier: { from: 150, weight: 3,   label: 'BARRIER',      type: 'hazard' },
    pillar:  { from: 300, weight: 3,   label: 'PILLARS',      type: 'hazard' },
    choke:   { from: 450, weight: 1.6, label: 'CHOKE',        type: 'shape' },
    spinner: { from: 650, weight: 1.8, label: 'ROTOR',        type: 'hazard' },
    boost:   { from: 120, weight: 1.1, label: 'BOOST',        type: 'item' },
    shield:  { from: 650, weight: 0.7, label: 'SHIELD',       type: 'item' },
    slowmo:  { from: 750, weight: 0.6, label: 'SLOW-MO',      type: 'item' }
  };
  var KIND_ORDER = ['gate', 'mgate', 'barrier', 'pillar', 'choke', 'spinner', 'boost', 'shield', 'slowmo'];

  // Pickup look + timings (seconds of real time).
  var POWERS = {
    boost:  { c: '#7dff6a', dur: 2.6, mult: 2, speedUp: 0.35 },
    shield: { c: '#5ab8ff' },
    slowmo: { c: '#c77dff', dur: 4.2, scale: 0.5 }
  };

  /* ============================================================ music */
  var SONGS = null;
  function songs() {
    if (SONGS) return SONGS;
    // NEON TUNNEL: driving E dorian synthwave, Em - A - D - Bm, two bars each.
    var neonHook = [
      '4 - - - - - 2 - 1 - 0 - - - . .',
      '. . . . . . . . . . . . . . . .',
      '4 - - - 6 - - - 7 - - - 6 - 4 -',
      '2 - - - - - - - . . . . . . . .'
    ].join(' ');
    var neon = {
      bpm: 118, key: 52, scale: 'dorian', chords: [0, 3, 6, 4], barsPerChord: 2, seed: 17,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.34, chord: true, octave: -1, params: { cutoff: 1400 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'bass', inst: 'bass', layer: 0.08, gain: 0.45, chord: true, octave: -2, rate: 2, params: { cutoff: 650 },
          pattern: '0 0 ^0 0 0 0 ^0 0' },
        { name: 'kick', inst: 'kick', layer: 0.2, gain: 0.58, pattern: 'x...x...x...x...' },
        { name: 'arp', inst: 'arp', layer: 0.34, gain: 0.26, chord: true, octave: 1, params: { cutoff: 1900 },
          fn: function (i) { return [0, 2, 4, 7, 4, 2, 4, 9][i.step % 8]; } },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.38, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.6, gain: 0.34, pattern: '..x...x...x...x.' },
        { name: 'lead', inst: 'lead', layer: 0.8, gain: 0.26, octave: 1, params: { wave: 'triangle', cutoff: 2200 }, pattern: neonHook }
      ]
    };
    // CITY CANYON: A minor night-drive funk - octave bass, offbeat chord stabs, claps.
    var city = {
      bpm: 124, key: 57, scale: 'minor', chords: [0, 5, 3, 4], seed: 71,
      tracks: [
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.42, chord: true, octave: -2, params: { cutoff: 1000, q: 5 },
          pattern: '0 . ^0 0 . 0 ^0 . 0 . ^0 0 . 2 ^0 .' },
        { name: 'stab', inst: 'pluck', layer: 0, gain: 0.3, chord: true, params: { decay: 0.14, cutoff: 3000 },
          fn: function (i) { return i.stepInBar % 8 === 4 ? [{ deg: 0, vel: 0.8 }, { deg: 2, vel: 0.7 }, { deg: 4, vel: 0.7 }] : null; } },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.58, pattern: 'x...x...x...x..x' },
        { name: 'clap', inst: 'clap', layer: 0.3, gain: 0.34, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.42, gain: 0.26, pattern: 'xxx.xxx.xxx.xxxx' },
        { name: 'arp', inst: 'arp', layer: 0.55, gain: 0.18, chord: true, octave: 1, params: { cutoff: 2600 },
          fn: function (i) { return i.step % 2 ? null : [0, 4, 7, 4, 9, 7, 4, 2][(i.step / 2) % 8]; } },
        { name: 'lead', inst: 'lead', layer: 0.75, gain: 0.22, octave: 1, params: { wave: 'square', cutoff: 2300 },
          pattern: '4 . 4 . 3 . 2 - 0 - . . 2 . 3 . 4 . 4 . 6 . 7 - 6 - 4 - . . . .' }
      ]
    };
    // OCEAN TRENCH: D dorian, sub drone, marimba ostinato, bubbling bells, half-time drums.
    var ocean = {
      bpm: 108, key: 50, scale: 'dorian', chords: [0, 2, 3, 0], barsPerChord: 2, seed: 72,
      tracks: [
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - 0 - - - 4 - - -' },
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.3, chord: true, octave: -1, params: { cutoff: 800, attack: 0.9, release: 1.4 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'marimba', inst: 'marimba', layer: 0.1, gain: 0.34, chord: true,
          fn: function (i) { var p = [0, null, 4, null, 2, null, 4, 7, 0, null, 4, null, 2, 4, null, null][i.stepInBar]; return p == null ? null : { deg: p, vel: 0.7 }; } },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.5, pattern: 'x.........x.....' },
        { name: 'shaker', inst: 'shaker', layer: 0.35, gain: 0.5, pattern: '..x...x...x...xx' },
        { name: 'bubbles', inst: 'bell', layer: 0.5, gain: 0.22, chord: true, octave: 2,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.3 ? { deg: [0, 2, 4, 6, 7][Math.floor(i.rng() * 5)], vel: 0.4 } : null; } },
        { name: 'snare', inst: 'snare', layer: 0.6, gain: 0.28, pattern: '........x.......' },
        { name: 'lead', inst: 'lead', layer: 0.8, gain: 0.2, octave: 1, params: { wave: 'triangle', cutoff: 2000 },
          pattern: '4 - - - 5 - 4 - 2 - - - . . . . 0 - 2 - 4 - - - 7 - - - 6 - . .' }
      ]
    };
    // DEEP SPACE: F# lydian, wide pads, running arp, star bells, four-on-the-floor.
    var space = {
      bpm: 126, key: 54, scale: 'lydian', chords: [0, 1], barsPerChord: 2, seed: 73,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.38, chord: true, octave: -1, params: { cutoff: 1000, attack: 0.8, release: 1.6 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 4, steps: 32 }, { deg: 6, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.42, chord: true, octave: -2, pattern: '0 - - - - - - - 0 - - - 0 - 4 -' },
        { name: 'stars', inst: 'bell', layer: 0.05, gain: 0.24, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.2 ? { deg: [0, 2, 3, 4, 6, 7][Math.floor(i.rng() * 6)], vel: 0.45 } : null; } },
        { name: 'arp', inst: 'arp', layer: 0.2, gain: 0.18, chord: true, octave: 1, params: { cutoff: 2400 },
          fn: function (i) { return [0, 4, 7, 11, 7, 4, 3, 6][i.step % 8]; } },
        { name: 'kick', inst: 'kick', layer: 0.35, gain: 0.55, pattern: 'x...x...x...x...' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.3, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.6, gain: 0.26, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'lead', inst: 'lead', layer: 0.78, gain: 0.2, octave: 1, params: { wave: 'sawtooth', cutoff: 2600 },
          pattern: '4 - - - 3 - 4 - 6 - - - 7 - - - 6 - 4 - 3 - - - 1 - - - 0 - - -' }
      ]
    };
    SONGS = [neon, city, ocean, space];
    return SONGS;
  }

  /* ================================================= cached scenery art
     Parallax tiles are painted once per page with a fixed, visual-only
     seed (never api.rng). Each env has: sky (full-screen gradient), far
     and mid tiles (W x TILE_H, wrap vertically). */
  var ART = null;
  function makeCanvas(w, h) {
    var d = root.document;
    if (!d) return null;
    var c = d.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  // Draw something at y, plus its copy one tile up/down if it crosses the seam.
  function wrapY(y, reach, fn) {
    fn(y);
    if (y < reach) fn(y + TILE_H);
    if (y > TILE_H - reach) fn(y - TILE_H);
  }
  function blob(g, x, y, r, rgb, a) {
    var gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
    gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function rockPath(g, x, y, r, vr, n) {
    g.beginPath();
    for (var k = 0; k < n; k++) {
      var a = k / n * TAU, rr = r * (0.7 + vr() * 0.35);
      if (k) g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    g.closePath();
  }

  var PAINT = {
    neon: {
      far: function (g, vr) {
        g.strokeStyle = 'rgba(255,63,164,0.10)'; g.lineWidth = 1;
        for (var x = 0; x <= W; x += 40) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, TILE_H); g.stroke(); }
        for (var y = 0; y < TILE_H; y += 40) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
        for (var k = 0; k < 40; k++) { g.fillStyle = 'rgba(63,240,255,' + (0.15 + vr() * 0.3) + ')'; g.fillRect(Math.floor(vr() * 10) * 40 - 1, Math.floor(vr() * 15) * 40 - 1, 3, 3); }
      },
      mid: function (g, vr) {
        for (var k = 0; k < 16; k++) {
          var x = vr() * W, len = 40 + vr() * 120, c = k % 2 ? '255,63,164' : '63,240,255';
          wrapY(vr() * TILE_H, len, function (y) {
            g.fillStyle = 'rgba(' + c + ',0.12)'; g.fillRect(x - 4, y, 9, len);
            g.fillStyle = 'rgba(' + c + ',0.55)'; g.fillRect(x - 1, y, 3, len);
          });
        }
      }
    },
    city: {
      far: function (g, vr) {
        // street grid far below: dark blocks, sodium-lit streets, car lights
        g.fillStyle = 'rgba(255,150,70,0.06)';
        for (var x = 0; x < W; x += 80) g.fillRect(x + 36, 0, 8, TILE_H);
        for (var y = 0; y < TILE_H; y += 100) g.fillRect(0, y + 46, W, 8);
        for (var k = 0; k < 50; k++) {
          g.fillStyle = k % 3 ? 'rgba(255,220,140,0.5)' : 'rgba(255,70,70,0.5)';
          if (vr() < 0.5) g.fillRect(Math.floor(vr() * 5) * 80 + 38 + (vr() < 0.5 ? 0 : 3), vr() * TILE_H, 2, 3);
          else g.fillRect(vr() * W, Math.floor(vr() * 6) * 100 + 48 + (vr() < 0.5 ? 0 : 3), 3, 2);
        }
      },
      mid: function (g, vr) {
        // rooftops of the canyon: blocks with lit windows and a warm edge
        for (var k = 0; k < 14; k++) {
          var bw = 50 + vr() * 70, bh = 60 + vr() * 110, x = vr() * (W + 40) - 20;
          var tone = ['#2a1a33', '#33203d', '#241629'][k % 3];
          var lights = [];
          for (var j = 0; j < 14; j++) lights.push([vr(), vr(), vr() < 0.45]);
          wrapY(vr() * TILE_H, bh, function (y) {
            g.fillStyle = tone; g.fillRect(x, y, bw, bh);
            g.fillStyle = 'rgba(255,140,70,0.45)'; g.fillRect(x, y, bw, 2); g.fillRect(x, y, 2, bh);
            for (var j = 0; j < lights.length; j++) {
              if (!lights[j][2]) continue;
              g.fillStyle = 'rgba(255,207,122,0.55)';
              g.fillRect(x + 6 + lights[j][0] * (bw - 14), y + 6 + lights[j][1] * (bh - 14), 4, 3);
            }
          });
        }
      }
    },
    ocean: {
      far: function (g, vr) {
        for (var k = 0; k < 14; k++) {
          var x = vr() * W, r = 40 + vr() * 70;
          wrapY(vr() * TILE_H, r, function (y) { blob(g, x, y, r, '70,240,200', 0.07); });
        }
        for (var s = 0; s < 60; s++) { g.fillStyle = 'rgba(180,255,240,' + (0.1 + vr() * 0.25) + ')'; g.fillRect(vr() * W, vr() * TILE_H, 1.5, 1.5); }
      },
      mid: function (g, vr) {
        for (var k = 0; k < 12; k++) {
          var x = vr() * W, r = 16 + vr() * 34, rs = Math.floor(vr() * 1e6);
          wrapY(vr() * TILE_H, r, function (y) {
            rockPath(g, x, y, r, U.rng(rs), 9);
            g.fillStyle = '#0a2436'; g.fill();
            g.strokeStyle = 'rgba(70,240,200,0.35)'; g.lineWidth = 1.5; g.stroke();
          });
        }
        for (var q = 0; q < 10; q++) {
          var kx = vr() * W, klen = 50 + vr() * 80, ph = vr() * 6;
          wrapY(vr() * TILE_H, klen, function (y) {
            g.strokeStyle = 'rgba(40,190,120,0.55)'; g.lineWidth = 2.5; g.beginPath();
            for (var s = 0; s <= klen; s += 5) { var xx = kx + Math.sin(s * 0.08 + ph) * 6; if (s) g.lineTo(xx, y + s); else g.moveTo(xx, y + s); }
            g.stroke();
          });
        }
      }
    },
    space: {
      far: function (g, vr) {
        for (var k = 0; k < 170; k++) {
          var a = 0.2 + vr() * 0.6;
          g.fillStyle = 'rgba(220,225,255,' + a + ')';
          g.fillRect(vr() * W, vr() * TILE_H, vr() < 0.15 ? 2 : 1, vr() < 0.15 ? 2 : 1);
        }
        blob(g, W * 0.25, TILE_H * 0.3, 170, '120,70,255', 0.12);
        blob(g, W * 0.8, TILE_H * 0.75, 150, '255,60,160', 0.08);
      },
      mid: function (g, vr) {
        for (var k = 0; k < 9; k++) {
          var x = vr() * W, r = 8 + vr() * 20, rs = Math.floor(vr() * 1e6);
          wrapY(vr() * TILE_H, r, function (y) {
            rockPath(g, x, y, r, U.rng(rs), 8);
            g.fillStyle = '#211c36'; g.fill();
            g.strokeStyle = 'rgba(160,170,255,0.4)'; g.lineWidth = 1.2; g.stroke();
          });
        }
        for (var s = 0; s < 14; s++) {
          var sx = vr() * W, sy = vr() * TILE_H;
          g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(sx - 1, sy - 1, 2, 2);
          g.fillStyle = 'rgba(200,210,255,0.35)'; g.fillRect(sx - 5, sy - 0.5, 10, 1); g.fillRect(sx - 0.5, sy - 5, 1, 10);
        }
      }
    }
  };

  function buildArt() {
    if (ART) return ART;
    var list = [];
    for (var i = 0; i < ENVS.length; i++) {
      var env = ENVS[i], vr = U.rng(9100 + i * 77);
      var sky = makeCanvas(W, H), far = makeCanvas(W, TILE_H), mid = makeCanvas(W, TILE_H);
      if (!sky) return null;
      var g = sky.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, env.sky[0]); gr.addColorStop(0.55, env.sky[1]); gr.addColorStop(1, env.sky[2]);
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      PAINT[env.style].far(far.getContext('2d'), vr);
      PAINT[env.style].mid(mid.getContext('2d'), vr);
      list.push({ sky: sky, far: far, mid: mid });
    }
    ART = list;
    return ART;
  }

  /* ========================================================= geometry */
  function distToSeg(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    var k = L2 ? U.clamp(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1) : 0;
    var cx = ax + dx * k - px, cy = ay + dy * k - py;
    return Math.sqrt(cx * cx + cy * cy);
  }
  function distToRect(px, py, x0, y0, x1, y1) {
    var dx = Math.max(x0 - px, 0, px - x1), dy = Math.max(y0 - py, 0, py - y1);
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* ============================================================= game */
  function create(api) {
    var rng = api.rng;
    buildArt();
    var SONG = songs();

    /* ---- corridor + world state ---- */
    var segs = [];            // world rows every SEGH px: { y, l, r, e, warn, choke }
    var gates = [], obstacles = [], items = [], shapes = [], portals = [], pendingRotors = [];
    var dist = 0, speed = BASE_SPEED, distPts = 0, bonus = 0, streak = 0;
    var x = W / 2, vx = 0, lastPX = null, lastMoved = api.pointer().moved;
    var centre = W / 2, drift = 0;
    var phaseA = rng() * 6.28, phaseB = rng() * 6.28;
    var started = false, dead = false, deadT = 0, t = 0, tw = 0;
    var nextFeature = 500, lastKind = '';
    var trail = [];
    var spawned = {};         // kind -> count (debug)
    var seen = {};            // kinds already introduced with a label

    /* ---- player state ---- */
    var pw = { boost: 0, shield: false, slowmo: 0 };
    var ts = 1, boostK = 0, invT = 0, hitFlash = 0, hitCount = 0;
    var chain = 0, chainT = 0, wallCd = 0, bestChain = 0, armL = true, armR = true;

    /* ---- zone / presentation state ---- */
    var envIdx = 0, prevEnv = 0, envBlend = 1, bannerT = 0, zone = 0;
    var mBpm = -1, mInt = -1, mFilt = -1, lastMile = 0, keyStep = 0;

    /* ---------------------------------------------- corridor generation */
    function lastSeg() { return segs[segs.length - 1]; }
    // Width modifier from chokes (negative) and rotor chambers (positive).
    function shapeAt(y) {
      var out = { dw: 0, warn: false };
      for (var i = 0; i < shapes.length; i++) {
        var s = shapes[i];
        if (s.kind === 'choke' && y >= s.y0 - 260 && y < s.y0 + s.ramp) out.warn = true;
        if (y < s.y0 || y > s.y1) continue;
        var k = Math.min(1, (y - s.y0) / s.ramp, (s.y1 - y) / s.ramp);
        out.dw += s.dw * k * k * (3 - 2 * k);        // smoothstep: no kinks in the walls
      }
      return out;
    }
    function genTo(yMax) {
      while (!segs.length || lastSeg().y < yMax) {
        var y = segs.length ? lastSeg().y + SEGH : -(H - PY) - 60;
        var base = Math.max(92, 210 - y * 0.006);
        // Two layered waves (seeded phases) plus a little noise: always swaying,
        // never stuck against the screen edge.
        var room = (W - base) / 2 - 14;
        drift = U.clamp(drift * 0.995 + (rng() - 0.5) * 0.006, -0.25, 0.25);
        var sway = Math.sin(y * 0.0032 + phaseA) * 0.62 + Math.sin(y * 0.0079 + phaseB) * 0.3 + drift;
        centre = W / 2 + U.clamp(sway, -1, 1) * room * Math.min(1, 0.35 + y / 3000);
        var sh = shapeAt(y), wd = base + sh.dw;
        var l = centre - wd / 2, r = centre + wd / 2;
        if (l < 6) { r += 6 - l; l = 6; }
        if (r > W - 6) { l -= r - (W - 6); r = W - 6; }
        var e = envAt(Math.max(0, y / 10));
        if (segs.length && lastSeg().e !== e) portals.push({ y: y, e: e });
        segs.push({ y: y, l: l, r: r, e: e, warn: sh.warn, choke: sh.dw < -4 });
        resolveRotors(y, l, r);
        if (y > nextFeature) spawnFeature(y, l, r, base);
      }
      var tail = dist - (H - PY) - 80;
      while (segs.length > 2 && segs[1].y < tail) segs.shift();
      gates = gates.filter(function (g) { return g.y > tail; });
      obstacles = obstacles.filter(function (o) { return o.y + (o.ext || 0) > tail; });
      items = items.filter(function (it) { return it.y > tail && !it.taken; });
      shapes = shapes.filter(function (s) { return s.y1 > tail; });
      portals = portals.filter(function (p) { return p.y > tail; });
    }
    // Rotors sit in a chamber that is generated after they spawn: fix the
    // pivot once the pivot row exists.
    function resolveRotors(y, l, r) {
      for (var i = pendingRotors.length - 1; i >= 0; i--) {
        var o = pendingRotors[i];
        if (y < o.y) continue;
        var hw = (r - l) / 2;
        o.px = (l + r) / 2;
        o.len = U.clamp(hw - ROTOR_LANE, 24, 80);   // tips always leave a lane by each wall
        o.ext = o.len + BAR_T;
        pendingRotors.splice(i, 1);
      }
    }
    function segAt(wy) {
      var i = Math.floor((wy - segs[0].y) / SEGH);
      return segs[U.clamp(i, 0, segs.length - 1)];
    }
    function sy(wy) { return PY - (wy - dist); }   // world -> screen: the road ahead is above the player

    /* ------------------------------------------------- feature spawning */
    function pickKind(m) {
      var total = 0, opts = [];
      for (var i = 0; i < KIND_ORDER.length; i++) {
        var k = KIND_ORDER[i], def = KINDS[k];
        if (m < def.from) continue;
        if (k === lastKind && def.type !== 'gate') continue;        // no repeats of hazards/pickups
        if (k === 'shield' && (pw.shield || countItems('shield'))) continue;
        if (k === 'slowmo' && (pw.slowmo > 0 || countItems('slowmo'))) continue;
        // hazards ramp in: weight grows over the 300 m after unlocking
        var w = def.weight * (def.type === 'hazard' || def.type === 'shape' ? Math.min(1, 0.35 + (m - def.from) / 300) : 1);
        total += w; opts.push([k, w]);
      }
      var roll = rng() * total;
      for (var j = 0; j < opts.length; j++) { roll -= opts[j][1]; if (roll <= 0) return opts[j][0]; }
      return opts.length ? opts[opts.length - 1][0] : 'gate';
    }
    function countItems(kind) { var n = 0; items.forEach(function (it) { if (it.kind === kind) n++; }); return n; }

    function spawnFeature(y, l, r, base) {
      var m = y / 10, wd = r - l, kind = pickKind(m);
      // Before 150 m only gates, and only some of the time (as in v1).
      if (m < 150 && kind === 'gate' && rng() >= 0.55) kind = null;
      var gap = 260 + rng() * 260 - Math.min(120, y * 0.004);
      nextFeature = y + gap;
      // keep the zone portal (and its name) clear
      if (envAt(Math.max(0, y - 150) / 10) !== envAt((y + 150) / 10)) { nextFeature = y + 160; return; }
      if (!kind) return;
      // long features (chokes, rotor chambers) must not straddle a portal
      if ((kind === 'choke' || kind === 'spinner') && envAt(y / 10) !== envAt((y + 650) / 10)) kind = 'gate';
      lastKind = kind;
      spawned[kind] = (spawned[kind] || 0) + 1;
      SPAWN[kind](y, l, r, wd, base);
    }
    var SPAWN = {
      gate: function (y, l, r, wd) {
        var gw = Math.max(46, wd * 0.45);
        var gx = l + 10 + rng() * (wd - gw - 20);
        gates.push({ kind: 'gate', y: y, l: gx, r: gx + gw, gw: gw, passed: false });
      },
      mgate: function (y, l, r, wd) {
        var gw = Math.max(46, wd * 0.4);
        var lo = l + 10, hi = r - 10 - gw;
        gates.push({ kind: 'mgate', y: y, lo: lo, hi: Math.max(lo, hi), gw: gw, ph: rng() * TAU,
          w: (1.1 + rng() * 0.8) * (rng() < 0.5 ? -1 : 1), passed: false });
      },
      barrier: function (y, l, r, wd) {
        var bw = Math.max(24, Math.min(wd * 0.42, 40 + rng() * 50, wd - SAFE_LANE - 6));
        var inset = rng() * Math.max(0, Math.min(20, wd - bw - SAFE_LANE - 6));
        var bx = rng() < 0.5 ? l + 6 + inset : r - bw - 6 - inset;
        // a centred barrier only when both side lanes stay wide enough
        if (rng() < 0.35 && (wd - bw) / 2 >= SAFE_LANE) bx = (l + r) / 2 - bw / 2;
        obstacles.push({ kind: 'barrier', y: y, x0: bx, x1: bx + bw, h: 18, ext: 9 });
      },
      pillar: function (y, l, r, wd) {
        var rad = 10 + rng() * 4, list = [];
        if (wd > 170 && rng() < 0.5) {
          // a pair with a wide middle lane and lanes by the walls
          list.push({ cx: l + wd * 0.27, r: rad }, { cx: l + wd * 0.73, r: rad });
        } else {
          // one pillar; the lane on its far side is always at least SAFE_LANE
          var near = rng() * Math.max(0, wd - 2 * rad - SAFE_LANE);
          list.push({ cx: rng() < 0.5 ? l + near + rad : r - near - rad, r: rad });
        }
        obstacles.push({ kind: 'pillar', y: y, posts: list, ext: rad });
      },
      choke: function (y, l, r, wd, base) {
        var y0 = y + 200, ramp = 60, hold = 150 + rng() * 80;
        var target = Math.max(60, base * 0.52);
        shapes.push({ kind: 'choke', y0: y0, y1: y0 + ramp * 2 + hold, ramp: ramp, dw: -(base - target) });
        obstacles.push({ kind: 'choke', y: y0 + ramp, ext: 0, marker: true });
        nextFeature = y0 + ramp * 2 + hold + 160;
      },
      spinner: function (y, l, r) {
        // the chamber is fully open well before the rotor's sweep begins
        var y0 = y + 60, ramp = 60, hold = 260;
        shapes.push({ kind: 'chamber', y0: y0, y1: y0 + ramp * 2 + hold, ramp: ramp, dw: 80 });
        var o = { kind: 'spinner', y: y0 + ramp + hold / 2, px: null, len: 30, ext: 40,
          a0: rng() * Math.PI, w: (1.1 + rng() * 0.6) * (rng() < 0.5 ? -1 : 1) };
        obstacles.push(o); pendingRotors.push(o);
        nextFeature = y0 + ramp * 2 + hold + 180;
      },
      boost: function (y, l, r, wd) { items.push({ kind: 'boost', y: y, x: l + 24 + rng() * Math.max(0, wd - 48) }); },
      shield: function (y, l, r, wd) { items.push({ kind: 'shield', y: y, x: l + 22 + rng() * Math.max(0, wd - 44) }); },
      slowmo: function (y, l, r, wd) { items.push({ kind: 'slowmo', y: y, x: l + 22 + rng() * Math.max(0, wd - 44) }); }
    };

    /* --------------------------------------------- obstacle geometry */
    function gateSpan(g) {
      if (g.kind !== 'mgate') return g;
      var gx = g.lo + (g.hi - g.lo) * (0.5 + 0.5 * Math.sin(tw * g.w + g.ph));
      return { l: gx, r: gx + g.gw };
    }
    function rotorEnds(o) {
      var a = o.a0 + tw * o.w, c = Math.cos(a) * o.len, s = Math.sin(a) * o.len;
      return [o.px - c, o.y - s, o.px + c, o.y + s];
    }
    // Clearance between the ship's edge and a hazard (negative = touching).
    function clearance(o, px, py) {
      if (o.kind === 'barrier') return distToRect(px, py, o.x0, o.y - o.h / 2, o.x1, o.y + o.h / 2) - PR;
      if (o.kind === 'pillar') {
        var best = 1e9;
        for (var i = 0; i < o.posts.length; i++) {
          var p = o.posts[i], d = Math.sqrt((px - p.cx) * (px - p.cx) + (py - o.y) * (py - o.y)) - p.r - PR;
          if (d < best) best = d;
        }
        return best;
      }
      if (o.kind === 'spinner' && o.px != null) {
        var e = rotorEnds(o);
        return Math.min(distToSeg(px, py, e[0], e[1], e[2], e[3]) - BAR_T, Math.sqrt((px - o.px) * (px - o.px) + (py - o.y) * (py - o.y)) - 7) - PR;
      }
      return 1e9;
    }

    /* ---------------------------------------------------------- music */
    function speedNorm() { return U.clamp((speed / (1 + POWERS.boost.speedUp * boostK) - BASE_SPEED) / (MAX_SPEED - BASE_SPEED), 0, 1); }
    function syncMusic() {
      var m = M();
      if (!m) return;
      var sn = speedNorm(), song = SONG[envIdx];
      var bpm = Math.round((song.bpm + sn * 22 + (pw.boost > 0 ? 6 : 0)) * (pw.slowmo > 0 ? 0.72 : 1));
      if (bpm !== mBpm) { m.setTempo(bpm, mBpm < 0 ? 0.01 : Math.abs(bpm - mBpm) > 6 ? 0.35 : 1.5); mBpm = bpm; }
      var f = pw.slowmo > 0 ? 850 : ENVS[envIdx].filter;
      if (f !== mFilt) { m.setFilter(f, mFilt < 0 ? 0.05 : 0.4); mFilt = f; }
      var span = zoneSpan(dist / 10), prog = U.clamp((dist / 10 - span[0]) / (span[1] - span[0]), 0, 1);
      var iv = Math.round(U.clamp(0.12 + prog * 0.45 + sn * 0.3 + Math.min(streak, 8) * 0.03 + Math.min(chain, 8) * 0.02 +
        (pw.boost > 0 ? 0.15 : 0), 0, 1) * 20) / 20;
      if (iv !== mInt) { mInt = iv; m.setIntensity(iv); }
      // key steps up every 500 m
      var mile = Math.floor(dist / 5000);
      if (mile !== lastMile) {
        lastMile = mile;
        keyStep = (keyStep + 1) % KEY_STEPS.length;
        m.note('riser', 0, { dur: 0.9, gain: 0.35 });
        m.stinger([{ deg: 0 }, { deg: 4, at: 2 }, { deg: 7, at: 4, steps: 4 }], { inst: 'pluck', quantize: 'beat', octave: 1, gain: 0.5 });
        m.setKey(song.key + KEY_STEPS[keyStep]);
        api.fx.text(W / 2, 140, (mile * 500) + ' m', ENVS[envIdx].wall, 13);
      }
    }
    function climbNote(n, gain) {
      var m = M();
      if (m) m.note('pluck', TONES[U.clamp(n, 1, 8) - 1], { chord: true, quantize: '16', octave: 1, gain: gain || 0.55 });
      else api.audio.tone(660 + n * 60, 0.08, { type: 'square', vol: 0.12 });
    }

    /* ------------------------------------------------------ zones */
    function changeEnv(e) {
      prevEnv = envIdx; envIdx = e; envBlend = 0; bannerT = 2.8; zone = zoneAt(dist / 10);
      var m = M();
      if (m) {
        m.play(SONG[e], { fade: 2, intensity: m.intensity(), keepFilter: true });
        m.setKey(SONG[e].key + KEY_STEPS[keyStep]);
        m.note('riser', 0, { dur: 1.3, gain: 0.3 });
        mBpm = -1; mInt = -1; mFilt = -2;
      }
      api.fx.burst(x, PY, ENVS[e].wall, 24, 200, 0.7);
    }

    /* --------------------------------------------- scoring: shaves + chain */
    function scoreMult() { return pw.boost > 0 ? POWERS.boost.mult : 1; }
    function nearMiss(what) {
      chain = chainT > 0 ? Math.min(chain + 1, 99) : 1;
      chainT = CHAIN_WINDOW;
      if (chain > bestChain) bestChain = chain;
      var mul = Math.min(chain, CHAIN_MAX), pts = 10 * mul * scoreMult();
      bonus += pts;
      var label = chain > 1 ? what + ' x' + mul + ' +' + pts : what + ' +' + pts;
      api.fx.text(x, PY - 26, label, chain > 1 ? '#ffffff' : '#bfefff', chain > 2 ? 12 : 10);
      var mm = M();
      if (mm) { if (chain === 1 || chain % 3 === 0) mm.note('riser', 0, { dur: 0.3, gain: 0.3 }); climbNote(mul, 0.5); }
      else api.audio.tone(900 + mul * 80, 0.05, { type: 'sine', vol: 0.1 });
    }
    function endChain() {
      if (chain >= 3) {
        var pts = chain * 15 * scoreMult();
        bonus += pts;
        api.fx.text(W / 2, PY - 70, 'CHAIN x' + chain + '  +' + pts, '#ffffff', 13);
        var m = M();
        if (m) m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3, steps: 3 }], { inst: 'pluck', quantize: '16', octave: 1, gain: 0.5 });
      }
      chain = 0; chainT = 0;
    }

    /* ---------------------------------------------------- pickups */
    function takeItem(it) {
      it.taken = true;
      var p = POWERS[it.kind], m = M();
      api.fx.burst(it.x, sy(it.y), p.c, 20, 180, 0.6);
      if (it.kind === 'boost') {
        pw.boost = p.dur;
        api.fx.text(x, PY - 40, 'BOOST x2', p.c, 12);
        api.audio.noise(0.55, { cutoff: 3200, vol: 0.22 });
        if (m) { m.note('riser', 0, { dur: 0.5, gain: 0.35 }); m.duck(0.25, 0.4); }
        api.shake(4);
      } else if (it.kind === 'shield') {
        pw.shield = true;
        api.fx.text(x, PY - 40, 'SHIELD', p.c, 12);
        if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2, steps: 2 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.55 });
        else api.audio.arp([523, 659, 784], 0.06, { type: 'triangle', vol: 0.12 });
      } else if (it.kind === 'slowmo') {
        pw.slowmo = p.dur;
        api.fx.text(x, PY - 40, 'SLOW-MO', p.c, 12);
        if (m) m.note('bell', 0, { octave: -1, gain: 0.6 });
        else api.audio.tone(300, 0.5, { type: 'sine', slide: 0.5, vol: 0.15 });
      }
    }
    function endSlowmo() {
      pw.slowmo = 0;
      var m = M();
      if (m) m.note('riser', 0, { dur: 0.6, gain: 0.3 });
      api.fx.text(x, PY - 40, 'SPEED UP', POWERS.slowmo.c, 10);
    }
    function tickPowers(dt) {
      if (pw.boost > 0) pw.boost = Math.max(0, pw.boost - dt);
      if (pw.slowmo > 0) { pw.slowmo -= dt; if (pw.slowmo <= 0) endSlowmo(); }
      ts += ((pw.slowmo > 0 ? POWERS.slowmo.scale : 1) - ts) * Math.min(1, dt * 5);
      boostK += ((pw.boost > 0 ? 1 : 0) - boostK) * Math.min(1, dt * 4);
      if (invT > 0) invT -= dt;
      if (hitFlash > 0) hitFlash -= dt * 2.5;
    }

    /* ------------------------------------------------ hits + death */
    // Returns true when the run is over. A shield (or the grace time right
    // after one pops) forgives the hit.
    function hit(reason) {
      if (invT > 0) return false;
      hitCount++;
      if (pw.shield) {
        pw.shield = false; invT = 1.0; hitFlash = 1;
        api.fx.text(x, PY - 30, 'SHIELD!', POWERS.shield.c, 12);
        api.fx.burst(x, PY, POWERS.shield.c, 30, 240, 0.7);
        api.shake(7);
        api.audio.noise(0.25, { cutoff: 2400, vol: 0.2 });
        if (M()) M().note('bell', 0, { octave: 1, gain: 0.7 });
        return false;
      }
      die(reason);
      return dead;
    }
    function die(reason) {
      dead = true;
      api.fx.burst(x, PY, ENVS[envIdx].ship, 36, 240, 0.9);
      api.fx.burst(x, PY, '#fff', 14, 160, 0.6);
      if (reason) api.fx.text(x, PY - 34, reason, '#ff8a8a', 11);
      api.shake(11);
      var m = M();
      if (m) { m.setFilter(600, 0.2); m.tapeStop(1.0); }
      api.audio.tone(170, 0.4, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
    }
    function clampInside(s) {
      var lo = s.l + PR + 3, hi = s.r - PR - 3;
      if (x < lo) { x = lo; vx = Math.abs(vx) * 0.3; }
      if (x > hi) { x = hi; vx = -Math.abs(vx) * 0.3; }
    }

    /* ------------------------------------------------ per-frame steps */
    function steer(dt) {
      var inp = api.input, p = api.pointer(), target = null;
      if (p.moved !== lastMoved) { lastMoved = p.moved; lastPX = p.x; }
      if (lastPX !== null) target = U.clamp(lastPX, 0, W);
      var keys = (inp.held('right') ? 1 : 0) - (inp.held('left') ? 1 : 0);
      if (keys) { lastPX = null; vx = U.lerp(vx, keys * 330, Math.min(1, dt * 10)); }
      else if (target !== null) vx = U.clamp((target - x) * 9, -520, 520);
      else vx *= Math.pow(0.02, dt);
      if (!started) {
        if (keys || p.down || inp.hit('a') || inp.hit('up') || inp.hit('left') || inp.hit('right') || inp.hit('hold')) { started = true; bannerT = 2.4; }
        else { x = W / 2 + Math.sin(t * 2) * 6; return false; }
      }
      x += vx * dt;
      return true;
    }
    function checkWalls(dt) {
      var s = segAt(dist);
      if (x - PR < s.l || x + PR > s.r) {
        if (hit('WALL')) return true;
        clampInside(s);
      }
      // A wall shave counts once per approach: pull away (re-arm) before the
      // next one, so hugging a wall can't farm the chain.
      var gapL = x - PR - s.l, gapR = s.r - x - PR;
      wallCd -= dt;
      if (gapL > REARM_PX) armL = true;
      if (gapR > REARM_PX) armR = true;
      if (invT <= 0 && wallCd <= 0) {
        if (gapL < CLOSE_PX && armL) { armL = false; wallCd = 0.3; nearMiss('CLOSE'); }
        else if (gapR < CLOSE_PX && armR) { armR = false; wallCd = 0.3; nearMiss('CLOSE'); }
      }
      return false;
    }
    function checkObstacles() {
      var wy = dist;
      for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        if (o.done || o.marker || (o.kind === 'spinner' && o.px == null)) continue;
        var dy = wy - o.y;
        if (dy < -o.ext - PR) continue;
        if (dy > o.ext + PR) {
          o.done = true;
          if (!o.hit && o.minClear != null && o.minClear < CLOSE_PX + 2) nearMiss(o.kind === 'spinner' ? 'ROTOR' : 'SHAVE');
          continue;
        }
        var c = clearance(o, x, wy);
        if (o.minClear == null || c < o.minClear) o.minClear = c;
        if (c < 0 && invT <= 0) {
          o.hit = true;
          if (hit({ barrier: 'SMASHED', pillar: 'SMASHED', spinner: 'SWATTED' }[o.kind])) return true;
        }
      }
      return false;
    }
    function checkGates() {
      for (var i = 0; i < gates.length; i++) {
        var g = gates[i];
        if (g.passed || dist < g.y) continue;
        g.passed = true;
        var sp = gateSpan(g);
        if (x > sp.l && x < sp.r) {
          streak++;
          var pts = 25 * Math.min(streak, 8) * (g.kind === 'mgate' ? 2 : 1) * scoreMult();
          bonus += pts;
          g.hitX = x;
          api.fx.text(x, PY - 30, 'GATE +' + pts, GATE, 12);
          api.fx.burst(x, PY, GATE, 16, 150, 0.5);
          climbNote(Math.min(streak, 8), 0.7);
        } else if (streak) { streak = 0; api.fx.text(x, PY - 30, 'MISSED', '#8899aa', 10); }
      }
    }
    function checkItems() {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.taken) continue;
        var dy = dist - it.y;
        if (it.kind === 'boost') { if (Math.abs(dy) < 22 && Math.abs(x - it.x) < 18 + PR * 0.5) takeItem(it); }
        else if (dy * dy + (x - it.x) * (x - it.x) < (14 + PR) * (14 + PR)) takeItem(it);
      }
    }
    // First time a new kind scrolls into view, tag it with its name.
    function introduce(list) {
      for (var i = 0; i < list.length; i++) {
        var o = list[i], k = o.kind;
        if (k === 'gate' || seen[k] || o.intro) continue;
        if (sy(o.y) > 40) { seen[k] = true; o.intro = 2.2; }
      }
    }
    function tickIntros(list, dt) { for (var i = 0; i < list.length; i++) if (list[i].intro > 0) list[i].intro -= dt; }

    /* ======================================================== render */
    function drawTile(ctx, img, off) {
      var y0 = off % TILE_H;
      ctx.drawImage(img, 0, y0 - TILE_H);
      ctx.drawImage(img, 0, y0);
    }
    function drawBackdrop(ctx, e, alpha) {
      var art = ART && ART[e];
      ctx.globalAlpha = alpha;
      if (!art) { ctx.fillStyle = ENVS[e].sky[0]; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; return; }
      ctx.drawImage(art.sky, 0, 0);
      drawTile(ctx, art.far, dist * 0.12);
      drawTile(ctx, art.mid, dist * 0.45);
      ctx.globalAlpha = 1;
    }
    function drawAmbient(ctx, env) {
      var k, yy;
      if (env.style === 'ocean') {
        ctx.fillStyle = 'rgba(190,255,245,0.35)';
        for (k = 0; k < 22; k++) {
          yy = H - ((k * 131 + t * (30 + (k % 5) * 8)) % (H + 40)) + 20;
          ctx.beginPath(); ctx.arc((k * 67 + Math.sin(t + k) * 8) % W, yy, 1.5 + (k % 3), 0, TAU); ctx.fill();
        }
        ctx.fillStyle = 'rgba(120,255,230,0.04)';
        for (k = 0; k < 4; k++) {
          var bx = (k * 120 + Math.sin(t * 0.3 + k) * 40) % W;
          ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx + 60, 0); ctx.lineTo(bx + 140, H); ctx.lineTo(bx + 40, H); ctx.fill();
        }
      } else if (env.style === 'space') {
        for (k = 0; k < 10; k++) {
          var tw2 = 0.5 + 0.5 * Math.sin(t * 3 + k * 1.7);
          ctx.fillStyle = 'rgba(255,255,255,' + (0.2 + tw2 * 0.6) + ')';
          ctx.fillRect((k * 97) % W, (k * 173 + dist * 0.2) % H, 2, 2);
        }
      }
    }
    function drawSpeedLines(ctx, sn) {
      var n = 14 + Math.round(sn * 14) + (pw.boost > 0 ? 10 : 0);
      var len = 24 + sn * 50 + boostK * 40;
      var col = pw.boost > 0 ? '125,255,106' : '255,255,255';
      ctx.fillStyle = 'rgba(' + col + ',' + (0.05 + sn * 0.08 + boostK * 0.08) + ')';
      for (var k = 0; k < n; k++) {
        var ly = ((k * 97 + dist * (1.2 + (k % 3) * 0.3)) % (H + 80)) - 60;
        ctx.fillRect((k * 53 + (k % 4) * 11) % W, ly, k % 3 ? 1.5 : 2.5, len);
      }
    }
    // Contiguous runs of segments that share an environment.
    function runs() {
      var out = [], cur = null;
      for (var i = 0; i < segs.length; i++) {
        if (!cur || segs[i].e !== cur.e) { cur = { e: segs[i].e, a: Math.max(0, i - 1), b: i }; out.push(cur); }
        cur.b = i;
      }
      return out;
    }
    function wallPath(ctx, a, b, side) {
      ctx.beginPath();
      for (var i = a; i <= b; i++) { var s = segs[i], y = sy(s.y); if (i > a) ctx.lineTo(s[side], y); else ctx.moveTo(s[side], y); }
    }
    function drawCorridor(ctx, sn) {
      var rs = runs(), pulse = M() ? M().pulse(6) : 0, i, j, r, env, s, y;
      for (j = 0; j < rs.length; j++) {
        r = rs[j]; env = ENVS[r.e];
        // floor
        ctx.fillStyle = env.fill;
        ctx.beginPath();
        for (i = r.a; i <= r.b; i++) { s = segs[i]; y = sy(s.y); if (i > r.a) ctx.lineTo(s.l, y); else ctx.moveTo(s.l, y); }
        for (i = r.b; i >= r.a; i--) ctx.lineTo(segs[i].r, sy(segs[i].y));
        ctx.closePath(); ctx.fill();
        drawFloor(ctx, r, env);
      }
      // walls: wide faint pass, then a thin bright pass (cheap glow)
      ctx.save();
      ctx.lineJoin = 'round';
      for (j = 0; j < rs.length; j++) {
        r = rs[j]; env = ENVS[r.e];
        ['l', 'r'].forEach(function (side) {
          ctx.globalAlpha = 0.18 + pulse * 0.08; ctx.strokeStyle = env.wall; ctx.lineWidth = 12;
          wallPath(ctx, r.a, r.b, side); ctx.stroke();
          ctx.globalAlpha = 0.5; ctx.strokeStyle = env.wall2; ctx.lineWidth = 1.5;
          ctx.save(); ctx.translate(side === 'l' ? -5 : 5, 0); wallPath(ctx, r.a, r.b, side); ctx.stroke(); ctx.restore();
          ctx.globalAlpha = 1; ctx.strokeStyle = env.wall; ctx.lineWidth = 3 + pulse * 1.2;
          wallPath(ctx, r.a, r.b, side); ctx.stroke();
        });
      }
      ctx.restore();
      drawEdgeStreaks(ctx, sn);
      drawWarnings(ctx);
      drawPortals(ctx);
    }
    function drawFloor(ctx, r, env) {
      ctx.strokeStyle = env.floor; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = r.a; i <= r.b; i++) {
        var s = segs[i], y = sy(s.y);
        if (y < -10 || y > H + 10) continue;
        var row = Math.round(s.y / SEGH);
        if (env.style === 'neon' && row % 4 === 0) { ctx.moveTo(s.l, y); ctx.lineTo(s.r, y); }
        else if (env.style === 'city' && row % 6 < 3 && i < r.b) {
          var n = segs[i + 1];                        // lane dash follows the corridor centre
          ctx.moveTo((s.l + s.r) / 2, y); ctx.lineTo((n.l + n.r) / 2, sy(n.y));
        }
        else if (env.style === 'ocean' && row % 5 === 0) {
          var wv = Math.sin(row * 0.7 + t * 2) * 3;
          ctx.moveTo(s.l, y + wv); ctx.quadraticCurveTo((s.l + s.r) / 2, y - wv * 2, s.r, y + wv);
        } else if (env.style === 'space' && row % 5 === 0) {
          for (var k = 1; k < 5; k++) { var dx = s.l + (s.r - s.l) * k / 5; ctx.moveTo(dx, y); ctx.lineTo(dx + 1.5, y); }
        }
      }
      ctx.stroke();
      if (env.style === 'city') {
        // kerb ticks just inside each wall
        ctx.fillStyle = 'rgba(255,190,90,0.22)';
        for (var q = r.a; q <= r.b; q++) {
          var sg = segs[q];
          if (Math.round(sg.y / SEGH) % 4) continue;
          var yy = sy(sg.y);
          ctx.fillRect(sg.l + 8, yy, 6, 3); ctx.fillRect(sg.r - 14, yy, 6, 3);
        }
      }
    }
    function drawEdgeStreaks(ctx, sn) {
      if (sn < 0.05 && boostK < 0.05) return;
      var k = 1 + Math.round(sn * 3 + boostK * 2);
      ctx.save();
      ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.globalAlpha = Math.min(1, 0.25 + sn * 0.6 + boostK * 0.4);
      for (var i = 0; i + k < segs.length; i++) {
        var s = segs[i];
        if (Math.round(s.y / SEGH) % 9) continue;
        var e = segs[i + k], y0 = sy(s.y), y1 = sy(e.y);
        if (y0 < -20 || y1 > H + 20) continue;
        ctx.strokeStyle = ENVS[s.e].streak;
        ctx.beginPath(); ctx.moveTo(s.l + 2, y0); ctx.lineTo(e.l + 2, y1); ctx.moveTo(s.r - 2, y0); ctx.lineTo(e.r - 2, y1); ctx.stroke();
      }
      ctx.restore();
    }
    // Chevrons ahead of a choke (pointing inwards) and hazard ticks inside it.
    function drawWarnings(ctx) {
      var blink = Math.floor(t * 6) % 2 === 0;
      ctx.save();
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i], row = Math.round(s.y / SEGH), y = sy(s.y);
        if (y < -12 || y > H + 12) continue;
        if (s.warn && row % 4 === 0) {
          ctx.globalAlpha = blink ? 0.95 : 0.5;
          ctx.strokeStyle = WARN; ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(s.l + 6, y - 7); ctx.lineTo(s.l + 14, y); ctx.lineTo(s.l + 6, y + 7);
          ctx.moveTo(s.r - 6, y - 7); ctx.lineTo(s.r - 14, y); ctx.lineTo(s.r - 6, y + 7);
          ctx.stroke();
        }
        if (s.choke && row % 2 === 0) {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = row % 4 ? WARN : '#ff3f3f';
          ctx.fillRect(s.l - 7, y - 4, 6, 8); ctx.fillRect(s.r + 1, y - 4, 6, 8);
        }
      }
      ctx.restore();
    }
    function drawPortals(ctx) {
      for (var i = 0; i < portals.length; i++) {
        var p = portals[i], y = sy(p.y);
        if (y < -30 || y > H + 30) continue;
        var s = segAt(p.y), env = ENVS[p.e];
        ctx.save();
        ctx.globalAlpha = 0.25; ctx.fillStyle = env.wall;
        ctx.fillRect(s.l, y - 12, s.r - s.l, 24);
        ctx.globalAlpha = 1; ctx.fillRect(s.l, y - 1.5, s.r - s.l, 3);
        ctx.restore();
        if (y > 30) U.glowText(ctx, env.name, (s.l + s.r) / 2, y - 22, 9, env.wall);
      }
    }
    function drawGates(ctx) {
      for (var i = 0; i < gates.length; i++) {
        var g = gates[i], y = sy(g.y);
        if (y < -20 || y > H + 20) continue;
        var sp = gateSpan(g);
        ctx.save();
        if (g.kind === 'mgate') {
          // the rail it slides on
          ctx.strokeStyle = 'rgba(255,210,63,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
          ctx.beginPath(); ctx.moveTo(g.lo, y); ctx.lineTo(g.hi + g.gw, y); ctx.stroke(); ctx.setLineDash([]);
        }
        var on = !g.passed;
        ctx.globalAlpha = on ? 0.3 : 0.1; ctx.strokeStyle = GATE; ctx.lineWidth = 9;
        ctx.beginPath(); ctx.moveTo(sp.l, y); ctx.lineTo(sp.r, y); ctx.stroke();
        ctx.globalAlpha = on ? 1 : 0.3; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(sp.l, y); ctx.lineTo(sp.r, y); ctx.stroke();
        ctx.fillStyle = GATE;
        ctx.fillRect(sp.l - 3, y - 7, 6, 14); ctx.fillRect(sp.r - 3, y - 7, 6, 14);
        // cosmetic: a ₿ coin set in the middle of the gate bar
        U.btc(ctx, (sp.l + sp.r) / 2, y, 6.5, { glow: on ? 8 : 0, alpha: on ? 1 : 0.35 });
        if (g.kind === 'mgate' && on) {
          var dir = Math.cos(tw * g.w + g.ph) * g.w >= 0 ? 1 : -1;
          var ax = dir > 0 ? sp.r + 8 : sp.l - 8;
          ctx.beginPath(); ctx.moveTo(ax, y - 5); ctx.lineTo(ax + dir * 7, y); ctx.lineTo(ax, y + 5); ctx.fill();
        }
        ctx.restore();
        if (g.intro > 0) drawIntro(ctx, g, y);
      }
    }
    function drawObstacles(ctx) {
      for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i], y = sy(o.y);
        if (y < -120 || y > H + 120) continue;
        var env = ENVS[segAt(o.y).e], hz = env.hazard;
        if (o.kind === 'barrier') {
          ctx.save();
          ctx.globalAlpha = 0.3; ctx.fillStyle = hz; ctx.fillRect(o.x0 - 4, y - o.h / 2 - 4, o.x1 - o.x0 + 8, o.h + 8);
          ctx.globalAlpha = 1; ctx.fillRect(o.x0, y - o.h / 2, o.x1 - o.x0, o.h);
          // hazard stripes
          ctx.beginPath(); ctx.rect(o.x0, y - o.h / 2, o.x1 - o.x0, o.h); ctx.clip();
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          for (var sx = o.x0 - o.h; sx < o.x1; sx += 12) {
            ctx.beginPath(); ctx.moveTo(sx, y + o.h / 2); ctx.lineTo(sx + 6, y + o.h / 2); ctx.lineTo(sx + 6 + o.h, y - o.h / 2); ctx.lineTo(sx + o.h, y - o.h / 2); ctx.fill();
          }
          ctx.restore();
        } else if (o.kind === 'pillar') {
          for (var p = 0; p < o.posts.length; p++) {
            var q = o.posts[p];
            ctx.save();
            ctx.globalAlpha = 0.25; ctx.fillStyle = hz;
            ctx.beginPath(); ctx.arc(q.cx, y, q.r + 6, 0, TAU); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(q.cx, y, q.r, 0, TAU); ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.beginPath(); ctx.arc(q.cx, y, q.r * 0.55, 0, TAU); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.arc(q.cx - q.r * 0.35, y - q.r * 0.35, 2, 0, TAU); ctx.fill();
            ctx.restore();
          }
        } else if (o.kind === 'spinner' && o.px != null) {
          var e = rotorEnds(o);
          ctx.save();
          // sweep circle: everything outside it is safe
          ctx.strokeStyle = hz; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
          ctx.beginPath(); ctx.arc(o.px, y, o.len + BAR_T, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
          ctx.globalAlpha = 0.3; ctx.lineWidth = BAR_T * 2 + 8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(e[0], sy(e[1])); ctx.lineTo(e[2], sy(e[3])); ctx.stroke();
          ctx.globalAlpha = 1; ctx.lineWidth = BAR_T * 2;
          ctx.beginPath(); ctx.moveTo(e[0], sy(e[1])); ctx.lineTo(e[2], sy(e[3])); ctx.stroke();
          // safe-lane arrows beside each tip
          var sg = segAt(o.y), laneL = (sg.l + o.px - o.len - BAR_T) / 2, laneR = (sg.r + o.px + o.len + BAR_T) / 2;
          ctx.globalAlpha = 0.55 + 0.25 * Math.sin(t * 6); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
          ctx.beginPath();
          [laneL, laneR].forEach(function (lx) {
            for (var q = -1; q <= 1; q += 2) { ctx.moveTo(lx - 5, y + q * 18 + 4); ctx.lineTo(lx, y + q * 18 - 2); ctx.lineTo(lx + 5, y + q * 18 + 4); }
          });
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(o.px, y, 7, 0, TAU); ctx.fill();
          ctx.fillStyle = hz;
          ctx.beginPath(); ctx.arc(o.px, y, 3.5, 0, TAU); ctx.fill();
          ctx.restore();
        }
        if (o.intro > 0) drawIntro(ctx, o, y);
      }
    }
    function drawIntro(ctx, o, y) {
      var a = Math.min(1, o.intro) * (0.6 + 0.4 * Math.sin(t * 10));
      var s = segAt(o.y), cx = (s.l + s.r) / 2, yy = Math.max(30, y - (o.ext || 12) - 18);
      if (o.kind === 'choke') yy = Math.max(30, sy(o.y) - 90);
      ctx.save(); ctx.globalAlpha = a;
      U.glowText(ctx, KINDS[o.kind].label + '!', cx, yy, 9, o.kind === 'choke' ? WARN : '#ffffff');
      ctx.restore();
    }
    function drawItems(ctx) {
      for (var i = 0; i < items.length; i++) {
        var it = items[i], y = sy(it.y);
        if (it.taken || y < -30 || y > H + 30) continue;
        var p = POWERS[it.kind], bob = Math.sin(t * 4 + i) * 0.15 + 1;
        ctx.save();
        if (it.kind === 'boost') {
          ctx.globalAlpha = 0.22; ctx.fillStyle = p.c;
          U.roundRect(ctx, it.x - 18, y - 22, 36, 44, 6); ctx.fill();
          ctx.globalAlpha = 1; ctx.strokeStyle = p.c; ctx.lineWidth = 2;
          U.roundRect(ctx, it.x - 18, y - 22, 36, 44, 6); ctx.stroke();
          ctx.lineWidth = 3; ctx.lineCap = 'round';
          for (var k = 0; k < 3; k++) {
            var ph = (t * 3 + k / 3) % 1, cy = y + 14 - ((k * 12 + t * 40) % 36);
            ctx.globalAlpha = 0.4 + 0.6 * (1 - ph);
            ctx.beginPath(); ctx.moveTo(it.x - 9, cy + 5); ctx.lineTo(it.x, cy - 3); ctx.lineTo(it.x + 9, cy + 5); ctx.stroke();
          }
        } else {
          ctx.globalAlpha = 0.25; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(it.x, y, 18 * bob, 0, TAU); ctx.fill();
          ctx.globalAlpha = 1; ctx.strokeStyle = p.c; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(it.x, y, 12, 0, TAU); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
          if (it.kind === 'shield') {
            ctx.beginPath(); ctx.moveTo(it.x, y - 7); ctx.lineTo(it.x + 6, y - 4); ctx.lineTo(it.x + 5, y + 2);
            ctx.lineTo(it.x, y + 7); ctx.lineTo(it.x - 5, y + 2); ctx.lineTo(it.x - 6, y - 4); ctx.closePath(); ctx.fill();
          } else {
            ctx.beginPath(); ctx.moveTo(it.x - 5, y - 7); ctx.lineTo(it.x + 5, y - 7); ctx.lineTo(it.x - 5, y + 7); ctx.lineTo(it.x + 5, y + 7); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(it.x - 3, y + 6); ctx.lineTo(it.x + 3, y + 6); ctx.lineTo(it.x, y + 2); ctx.fill();
          }
        }
        ctx.restore();
        if (it.intro > 0) drawIntro(ctx, it, y);
      }
    }
    function shipShape(ctx) {
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(8, 10); ctx.lineTo(0, 5); ctx.lineTo(-8, 10); ctx.closePath();
    }
    function drawShip(ctx, sn) {
      var env = ENVS[envIdx], col = pw.boost > 0 ? POWERS.boost.c : env.ship, i;
      // tapered light trail
      ctx.save();
      ctx.lineCap = 'round'; ctx.strokeStyle = col;
      for (i = 1; i < trail.length; i++) {
        var a = trail[i - 1], b = trail[i], f = 1 - i / trail.length;
        ctx.globalAlpha = f * 0.7; ctx.lineWidth = 1 + f * 5;
        ctx.beginPath(); ctx.moveTo(a.x, sy(a.wy)); ctx.lineTo(b.x, sy(b.wy)); ctx.stroke();
      }
      // afterimages at speed
      if (sn > 0.35 || boostK > 0.2) {
        for (i = 4; i < Math.min(trail.length, 16); i += 4) {
          ctx.save(); ctx.globalAlpha = (0.25 + boostK * 0.2) * (1 - i / 16);
          ctx.translate(trail[i].x, sy(trail[i].wy)); ctx.fillStyle = col; shipShape(ctx); ctx.fill(); ctx.restore();
        }
      }
      ctx.restore();
      ctx.save();
      ctx.translate(x, PY);
      // exhaust flame
      var fl = 6 + sn * 8 + boostK * 12 + Math.random() * 4;
      ctx.fillStyle = col; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(-4, 8); ctx.lineTo(0, 8 + fl); ctx.lineTo(4, 8); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.rotate(U.clamp(vx / 900, -0.5, 0.5));
      ctx.globalAlpha = 0.35; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = '#ffffff';
      shipShape(ctx); ctx.fill();
      ctx.restore();
      // shield bubble / grace blink
      if (pw.shield || invT > 0) {
        ctx.save();
        ctx.strokeStyle = POWERS.shield.c; ctx.lineWidth = 2;
        ctx.globalAlpha = pw.shield ? 0.6 + 0.3 * Math.sin(t * 6) : (Math.floor(t * 16) % 2 ? 0.8 : 0.2);
        ctx.beginPath(); ctx.arc(x, PY, 15, 0, TAU); ctx.stroke();
        ctx.globalAlpha *= 0.3; ctx.fillStyle = POWERS.shield.c; ctx.fill();
        ctx.restore();
      }
    }
    function drawHud(ctx) {
      var env = ENVS[envIdx], m = dist / 10, span = zoneSpan(m);
      // zone name + progress to the next zone
      ctx.save();
      ctx.font = '700 9px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillStyle = env.wall; ctx.fillText(env.name, W - 10, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(W - 110, 24, 100, 3);
      ctx.fillStyle = env.wall; ctx.fillRect(W - 110, 24, 100 * U.clamp((m - span[0]) / (span[1] - span[0]), 0, 1), 3);
      // active powers, top left
      var px = 10, py = 10;
      ctx.textAlign = 'left';
      if (pw.shield) { powerChip(ctx, px, py, POWERS.shield.c, 'SHIELD', 1); py += 18; }
      if (pw.boost > 0) { powerChip(ctx, px, py, POWERS.boost.c, 'BOOST x2', pw.boost / POWERS.boost.dur); py += 18; }
      if (pw.slowmo > 0) { powerChip(ctx, px, py, POWERS.slowmo.c, 'SLOW-MO', pw.slowmo / POWERS.slowmo.dur); py += 18; }
      ctx.restore();
      // chain meter above the ship
      if (chain > 1) {
        var mul = Math.min(chain, CHAIN_MAX), a = Math.min(1, chainT * 2);
        ctx.save(); ctx.globalAlpha = a;
        U.glowText(ctx, 'CHAIN x' + mul, W / 2, PY + 62, 10, mul >= 5 ? '#ffffff' : '#bfefff');
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(W / 2 - 40, PY + 74, 80, 3);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(W / 2 - 40, PY + 74, 80 * chainT / CHAIN_WINDOW, 3);
        ctx.restore();
      }
    }
    function powerChip(ctx, x0, y0, c, label, frac) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(x0, y0, 88, 14);
      ctx.fillStyle = c; ctx.globalAlpha = 0.35; ctx.fillRect(x0, y0, 88 * U.clamp(frac, 0, 1), 14);
      ctx.globalAlpha = 1; ctx.fillStyle = c; ctx.fillText(label, x0 + 4, y0 + 3);
    }
    function drawBanner(ctx) {
      if (bannerT <= 0 || !started) return;
      var env = ENVS[envIdx];
      ctx.save();
      ctx.globalAlpha = Math.min(1, bannerT, (2.8 - bannerT) * 3 + 0.2) * 0.95;
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, 118, W, 64);
      U.glowText(ctx, env.name, W / 2, 142, 18, env.wall);
      U.glowText(ctx, 'ZONE ' + (zone + 1), W / 2, 166, 9, env.wall2);
      ctx.restore();
    }

    /* ------------------------------------------------------- boot */
    genTo(dist + PY + 200);
    if (M()) M().play(SONG[0], { fade: 1.2, intensity: 0 });

    return {
      // Read-only snapshot for tests and QA tools.
      debug: function () {
        var s = segs.length ? segAt(dist) : { l: 0, r: W }, ahead = [], corridor = [], i;
        for (i = 0; i <= 15; i++) { var cs = segAt(dist + i * 20); corridor.push({ dy: i * 20, l: cs.l, r: cs.r }); }
        obstacles.forEach(function (o) {
          if (o.done || o.marker || o.y < dist - 20 || o.y > dist + 420) return;
          var d = { kind: o.kind, dy: o.y - dist };
          if (o.kind === 'barrier') { d.x0 = o.x0; d.x1 = o.x1; }
          if (o.kind === 'pillar') d.posts = o.posts.map(function (p) { return { cx: p.cx, r: p.r }; });
          if (o.kind === 'spinner' && o.px != null) { var e = rotorEnds(o); d.px = o.px; d.len = o.len; d.ends = e.slice(); }
          ahead.push(d);
        });
        items.forEach(function (it) { if (!it.taken && it.y > dist - 20 && it.y < dist + 420) ahead.push({ kind: it.kind, dy: it.y - dist, x: it.x }); });
        gates.forEach(function (g) { if (!g.passed && g.y < dist + 420) { var sp = gateSpan(g); ahead.push({ kind: g.kind, dy: g.y - dist, l: sp.l, r: sp.r }); } });
        var counts = {};
        for (var k in spawned) counts[k] = spawned[k];
        return {
          env: envIdx, envName: ENVS[envIdx].name, zone: zone, metres: Math.floor(dist / 10), dist: dist,
          speed: speed, timeScale: ts, started: started, dead: dead, x: x, wall: { l: s.l, r: s.r },
          streak: streak, chain: chain, chainMult: Math.min(chain, CHAIN_MAX), chainT: chainT, bestChain: bestChain,
          bonus: bonus, power: { shield: pw.shield, boost: pw.boost, slowmo: pw.slowmo }, shielded: pw.shield,
          invuln: invT, hits: hitCount, spawned: counts, corridor: corridor, ahead: ahead
        };
      },

      update: function (dt) {
        t += dt;
        api.input.takeSwipes();
        if (bannerT > 0) bannerT -= dt;
        if (envBlend < 1) envBlend = Math.min(1, envBlend + dt / 1.4);
        if (dead) { deadT += dt; if (deadT > 1) api.gameOver(); return; }
        if (!steer(dt)) return;
        tickPowers(dt);
        var wdt = dt * ts;
        tw += wdt;
        speed = Math.min(MAX_SPEED, BASE_SPEED + dist * 0.011) * (1 + POWERS.boost.speedUp * boostK);
        var step = speed * wdt;
        dist += step;
        distPts += step / 10 * scoreMult();
        genTo(dist + PY + 200);
        var e = envAt(dist / 10);
        if (e !== envIdx || zoneAt(dist / 10) !== zone) changeEnv(e);

        if (checkWalls(dt)) return;
        if (checkObstacles()) return;
        checkGates();
        checkItems();
        introduce(obstacles); introduce(items); introduce(gates);
        tickIntros(obstacles, dt); tickIntros(items, dt); tickIntros(gates, dt);
        if (chainT > 0) { chainT -= dt; if (chainT <= 0) endChain(); }
        var sn = speedNorm();
        if (sn > 0.6 || boostK > 0.3) api.shake(Math.max((sn - 0.6) * 3, boostK * 2));
        if (boostK > 0.3 && Math.random() < 0.5) api.fx.trail(x + (Math.random() - 0.5) * 6, PY + 10, POWERS.boost.c, 0, 120);
        syncMusic();
        trail.unshift({ x: x, wy: dist });
        if (trail.length > 40) trail.pop();
        api.setScore(Math.floor(distPts) + bonus);
        api.setStatus(ENVS[envIdx].name + '  \u00b7  ' + Math.floor(dist / 10) + ' m  \u00b7  GATES x' + streak +
          (chain > 1 ? '  \u00b7  CHAIN x' + Math.min(chain, CHAIN_MAX) : ''));
      },

      render: function (ctx) {
        var sn = speedNorm(), env = ENVS[envIdx];
        drawBackdrop(ctx, envBlend < 1 ? prevEnv : envIdx, 1);
        if (envBlend < 1) drawBackdrop(ctx, envIdx, envBlend);
        drawAmbient(ctx, env);
        drawSpeedLines(ctx, sn);
        // FOV-ish zoom out at speed, anchored on the ship so steering stays true
        var z = 1 - sn * 0.07 - boostK * 0.04;
        ctx.save();
        ctx.translate(x, PY); ctx.scale(z, z); ctx.translate(-x, -PY);
        drawCorridor(ctx, sn);
        drawItems(ctx);
        drawGates(ctx);
        drawObstacles(ctx);
        if (!dead) drawShip(ctx, sn);
        ctx.restore();
        // slow-mo tint + shield-pop flash
        if (ts < 0.98) { ctx.fillStyle = 'rgba(120,60,200,' + ((1 - ts) * 0.35) + ')'; ctx.fillRect(0, 0, W, H); }
        if (hitFlash > 0) { ctx.fillStyle = 'rgba(90,184,255,' + (hitFlash * 0.3) + ')'; ctx.fillRect(0, 0, W, H); }
        drawHud(ctx);
        drawBanner(ctx);
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'DRAG OR \u2190\u2192 TO GO', W / 2, 200, 14, '#c9f7ff');
          ctx.restore();
        }
      }
    };
  }

  /* ========================================================= attract
     Cabinet preview: the corridor cycles through the four zone palettes
     with a gate, a pillar and a rotor streaming past. */
  function attract(ctx, w, h, t) {
    var ei = Math.floor(t / 4) % 4, env = ENVS[ei], k;
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, env.sky[0]); gr.addColorStop(0.6, env.sky[1]); gr.addColorStop(1, env.sky[2]);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
    var v = t * 110;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (k = 0; k < 14; k++) ctx.fillRect((k * 53) % w, ((k * 97 + v * 1.5) % (h + 40)) - 30, 1.5, 26);
    function cAt(y) { return w / 2 + Math.sin((y - v) * 0.02) * w * 0.18; }
    function hwAt(y) { return w * 0.2 + Math.sin((y - v) * 0.05) * w * 0.03; }
    // floor
    ctx.fillStyle = env.fill;
    ctx.beginPath();
    for (var y = 0; y <= h; y += 6) { if (y) ctx.lineTo(cAt(y) - hwAt(y), y); else ctx.moveTo(cAt(y) - hwAt(y), y); }
    for (y = Math.floor(h / 6) * 6; y >= 0; y -= 6) ctx.lineTo(cAt(y) + hwAt(y), y);
    ctx.closePath(); ctx.fill();
    // walls: faint wide + bright thin
    [[10, 0.2], [2.5, 1]].forEach(function (pass) {
      ctx.save(); ctx.globalAlpha = pass[1]; ctx.strokeStyle = env.wall; ctx.lineWidth = pass[0];
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        for (var yy = 0; yy <= h; yy += 6) { var xx = cAt(yy) + side * hwAt(yy); if (yy) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
        ctx.stroke();
      });
      ctx.restore();
    });
    // a gate, a pillar and a rotor streaming down
    var gy = (v % (h * 1.2)) - h * 0.1, gc = cAt(gy);
    ctx.fillStyle = GATE; ctx.fillRect(gc - w * 0.08, gy - 1, w * 0.16, 2.5);
    ctx.fillRect(gc - w * 0.08 - 2, gy - 4, 3, 8); ctx.fillRect(gc + w * 0.08 - 1, gy - 4, 3, 8);
    U.btc(ctx, gc, gy, Math.max(4, w * 0.018), { glow: 6 });
    var py2 = ((v + h * 0.45) % (h * 1.2)) - h * 0.1;
    ctx.fillStyle = env.hazard;
    ctx.beginPath(); ctx.arc(cAt(py2) - hwAt(py2) * 0.45, py2, Math.max(4, w * 0.025), 0, TAU); ctx.fill();
    var ry = ((v + h * 0.85) % (h * 1.2)) - h * 0.1, rc = cAt(ry), rl = hwAt(ry) * 0.55, ra = t * 2.4;
    ctx.strokeStyle = env.hazard; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(rc - Math.cos(ra) * rl, ry - Math.sin(ra) * rl); ctx.lineTo(rc + Math.cos(ra) * rl, ry + Math.sin(ra) * rl); ctx.stroke();
    // the ship and its trail
    var shipY = h * 0.8, cx = cAt(shipY);
    ctx.strokeStyle = env.ship; ctx.globalAlpha = 0.6; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, shipY);
    for (k = 1; k < 10; k++) ctx.lineTo(cAt(shipY + k * 6), shipY + k * 6);
    ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(cx, shipY - 9); ctx.lineTo(cx + 6, shipY + 7); ctx.lineTo(cx, shipY + 3); ctx.lineTo(cx - 6, shipY + 7); ctx.closePath(); ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.font = '700 ' + Math.max(7, Math.round(w * 0.035)) + 'px "Press Start 2P", ui-monospace, monospace';
    ctx.textAlign = 'center'; ctx.fillStyle = env.wall;
    ctx.fillText(env.name, w / 2, h * 0.1);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_swerve',
    order: 17,
    title: 'Mempool Velocity',
    tagline: 'Weave four zones. Thread the gates.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO STEER',
    controls: 'Mouse / drag to steer \u00b7 or \u2190\u2192',
    create: create,
    attract: attract
  });
})(window);

/*
 * Xtrata Arcade cartridge #12 - BLOCK DEFENCE (v2)
 * Missiles rain down on six block towers. Aim and fire interceptors from
 * three silos; each blast hangs in the air and takes out anything that
 * flies into it, and every kill it causes chains a smaller blast.
 *
 *   enemies   WARHEAD (straight line), SPLITTER (blinks, then splits into
 *             2-4 warheads), SMART BOMB (slow, sidesteps blasts that start
 *             beside it - lead it), BOMBER (crosses the sky dropping
 *             warheads, shoot it down for a big bonus), DART (tiny + fast)
 *   towers    take two hits: the first leaves them burning, the second
 *             flattens them. Lose every tower and the run is over.
 *   waves     defined by the WAVES table; the sky runs day -> dusk -> night.
 *   depot     after each wave: bonus tally, then a supply depot that spends
 *             CREDITS (earned alongside score, never taken from it) on
 *             bigger blasts, faster interceptors, more ammo, rebuilds and
 *             an auto-turret.
 *
 * Contract game-id: xa_block_defence (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-block-defence');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ config */
  var W = 480, H = 560, GROUND = 520, TAU = Math.PI * 2;
  var ACCENT = '#39ff88', ENEMY = '#ff4d6d', BLAST = '#ffd23f', GOLD = '#ffd23f';
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var SILO_X = [40, 240, 440];
  var CITY_X = [96, 144, 192, 288, 336, 384];
  var TOWER_HP = 2;                  // first hit: burning, second hit: rubble
  var BASE_AMMO = 10;                // interceptors per silo per wave
  var BASE_BLAST = 38;               // interceptor blast radius before upgrades
  var SILO_SPEED = [480, 620, 480];  // the centre silo is the fast one
  var AIM_TOP = 36, AIM_BOTTOM = GROUND - 30;
  var DODGE_R = 64;                  // smart bombs sidestep blasts that start this close...
  var DODGE_AHEAD = 0.55;            // ...unless the blast is in front of them (lead it!)
  var SHOP_TIME = 12;                // the depot closes by itself after this long
  var SHOP_LOCK = 0.6;               // ignore input briefly so battle mashing can't skip it
  var BONUS_TOWER_EVERY = 10000;     // score milestone that repairs a tower for free
  var MAX_DEBRIS = 220;              // cap on cosmetic smoke / embers / wreckage

  /* ============================================================ enemy kinds
     speed is a multiplier on the wave's base speed; pts is multiplied by the
     wave number and by the chain count of the blast that got it; cr is the
     credits it pays; hitR is added to a blast's radius for the hit test.   */
  var KINDS = {
    warhead: { name: 'WARHEAD',    speed: 1.0,  pts: 25,  cr: 1, hitR: 2,  rgb: '255,77,109' },
    mirv:    { name: 'SPLITTER',   speed: 0.9,  pts: 50,  cr: 2, hitR: 4,  rgb: '255,179,71',
               intro: 'IT BLINKS, THEN SPLITS - HIT IT HIGH' },
    bomber:  { name: 'BOMBER',     speed: 1.0,  pts: 300, cr: 5, hitR: 13, rgb: '255,77,109',
               intro: 'DROPS WARHEADS - SHOOT IT DOWN' },
    smart:   { name: 'SMART BOMB', speed: 0.7,  pts: 150, cr: 3, hitR: 6,  rgb: '199,125,255',
               intro: 'DODGES BLASTS BESIDE IT - LEAD IT' },
    dart:    { name: 'DART',       speed: 2.1,  pts: 60,  cr: 2, hitR: 2,  rgb: '125,249,255',
               intro: 'TINY AND FAST - FIRE EARLY' }
  };

  /* ================================================================= waves
     n        warheads launched from the top of the sky (bomber drops are extra)
     speed    base fall speed in px/s
     gap      average seconds between launches
     bombers  bombers that cross during the wave
     split    how many warheads a splitter becomes
     mix      relative weights of each kind launched from the top
     intro    kind announced with a "NEW:" banner                            */
  function wv(n, speed, gap, bombers, split, mix, intro) {
    return { n: n, speed: speed, gap: gap, bombers: bombers, split: split, mix: mix, intro: intro || null };
  }
  var WAVES = [
    //  n   speed  gap  bomb split  mix                                            intro
    wv(10,  36,  1.70,  0,  2, { warhead: 1 }),
    wv(12,  40,  1.50,  0,  2, { warhead: 1 }),
    wv(13,  42,  1.45,  0,  2, { warhead: 3, mirv: 1 },                          'mirv'),
    wv(14,  44,  1.40,  1,  2, { warhead: 3, mirv: 1 },                          'bomber'),
    wv(15,  46,  1.35,  1,  3, { warhead: 4, mirv: 1, smart: 1 },                'smart'),
    wv(17,  48,  1.30,  1,  3, { warhead: 4, mirv: 2, smart: 1 }),
    wv(18,  50,  1.25,  1,  3, { warhead: 4, mirv: 1, smart: 1, dart: 2 },       'dart'),
    wv(20,  52,  1.20,  2,  3, { warhead: 4, mirv: 2, smart: 1, dart: 2 }),
    wv(21,  54,  1.15,  2,  3, { warhead: 3, mirv: 2, smart: 2, dart: 2 }),
    wv(23,  56,  1.10,  2,  4, { warhead: 3, mirv: 2, smart: 2, dart: 3 })
  ];
  // Past the table the last wave keeps ramping, gently.
  function waveDef(w) {
    if (w <= WAVES.length) return WAVES[w - 1];
    var last = WAVES[WAVES.length - 1], extra = w - WAVES.length;
    return wv(last.n + 2 * extra, Math.min(95, last.speed + 2.5 * extra), Math.max(0.55, last.gap * Math.pow(0.97, extra)),
      Math.min(4, last.bombers + Math.floor(extra / 3)), 4, last.mix);
  }

  /* ============================================================== upgrades
     Credits are a separate purse: kills and the wave tally pay them, the
     depot spends them, and the score is never touched. cost = base + step * level. */
  var UPGRADES = [
    { id: 'blast',   name: 'BIGGER BLASTS',       desc: '+12% BLAST RADIUS',         base: 8,  step: 6,  max: 5 },
    { id: 'speed',   name: 'FASTER INTERCEPTORS', desc: '+20% MISSILE SPEED',        base: 6,  step: 5,  max: 5 },
    { id: 'ammo',    name: 'MORE AMMO',           desc: '+2 MISSILES PER SILO',      base: 6,  step: 5,  max: 5 },
    { id: 'rebuild', name: 'REBUILD TOWER',       desc: 'RESTORE THE WORST TOWER',   base: 10, step: 6,  max: 99 },
    { id: 'turret',  name: 'AUTO-TURRET',         desc: 'CENTRE SILO FIRES BY ITSELF', base: 16, step: 12, max: 3 }
  ];
  var TURRET_COOLDOWN = [0, 3.2, 2.4, 1.7];   // by turret level
  // Wave tally: points are multiplied by min(wave, 10); credits are flat.
  var TALLY = { towerPts: 100, ammoPts: 5, perfectPts: 250, towerCr: 1, ammoPerCr: 4, perfectCr: 3 };

  /* =================================================================== sky
     One key per wave, cycling. Colours are [r,g,b]; night drives stars,
     window lights, searchlights and the darker soundtrack.                 */
  var SKY = [
    { name: 'DAY',         top: [26, 70, 140], mid: [64, 124, 186], bot: [150, 196, 220], sunX: 360, sunY: 96,  sunA: 1,   moonX: 60,  moonY: 470, moonA: 0,   night: 0 },
    { name: 'AFTERNOON',   top: [30, 58, 124], mid: [86, 118, 170], bot: [222, 186, 138], sunX: 392, sunY: 175, sunA: 1,   moonX: 60,  moonY: 450, moonA: 0,   night: 0.08 },
    { name: 'GOLDEN HOUR', top: [38, 40, 104], mid: [150, 88, 118], bot: [255, 164, 84],  sunX: 410, sunY: 300, sunA: 1,   moonX: 70,  moonY: 420, moonA: 0,   night: 0.25 },
    { name: 'DUSK',        top: [20, 20, 66],  mid: [96, 44, 98],   bot: [250, 104, 72],  sunX: 420, sunY: 420, sunA: 0.9, moonX: 80,  moonY: 360, moonA: 0.35, night: 0.5 },
    { name: 'TWILIGHT',    top: [10, 12, 40],  mid: [34, 30, 82],   bot: [96, 54, 104],   sunX: 430, sunY: 520, sunA: 0,   moonX: 100, moonY: 260, moonA: 0.9, night: 0.75 },
    { name: 'NIGHT',       top: [3, 4, 14],    mid: [8, 12, 34],    bot: [16, 26, 54],    sunX: 430, sunY: 560, sunA: 0,   moonX: 130, moonY: 150, moonA: 1,   night: 1 },
    { name: 'MIDNIGHT',    top: [1, 1, 6],     mid: [4, 6, 20],     bot: [10, 16, 38],    sunX: 40,  sunY: 560, sunA: 0,   moonX: 250, moonY: 92,  moonA: 1,   night: 1 },
    { name: 'PRE-DAWN',    top: [14, 16, 48],  mid: [44, 36, 84],   bot: [150, 86, 112],  sunX: 40,  sunY: 540, sunA: 0,   moonX: 400, moonY: 230, moonA: 0.8, night: 0.6 }
  ];
  function skyFor(w) { return SKY[(w - 1) % SKY.length]; }

  /* =========================================================== tower shapes
     Each tower is a stack of [width, height] blocks, bottom first.        */
  var TOWERS = [
    { blocks: [[30, 14], [24, 13], [18, 12]], antenna: 10 },
    { blocks: [[26, 16], [26, 14], [20, 14], [12, 10]], antenna: 0 },
    { blocks: [[32, 12], [22, 18], [14, 16]], antenna: 14 },
    { blocks: [[28, 18], [20, 18], [20, 12]], antenna: 6 },
    { blocks: [[30, 12], [26, 12], [20, 12], [14, 12]], antenna: 0 },
    { blocks: [[24, 22], [18, 16], [10, 10]], antenna: 12 }
  ];
  var TW = 48, TH = 84;              // tower sprite size (anchored bottom-centre)
  var SKYLINE_H = 150;               // far skyline strip above the ground

  /* ================================================================= music
     Battle: tense D harmonic minor at 124. Threats on screen drive the
     layers, warheads near the towers force an alarm, detonations boom in
     key, each extra kill from one blast climbs the bell scale, bombers
     bring a low drone, splitters fire a note cluster. Night waves play a
     darker arrangement (low-pass + sparse bells, phrygian at full night).
     Depot: a calm D dorian loop of pad + marimba, then back to battle.   */
  function battleSong(night) {
    var dark = night >= 0.75;
    return {
      bpm: 124, key: 50, scale: night >= 0.95 ? 'phrygian' : 'harmonic', chords: [0, 5, 3, 4], seed: 12,
      filter: dark ? 2600 : night >= 0.4 ? 6500 : 18000,
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
        { name: 'strings', inst: 'lead', layer: 0.8, gain: 0.26, octave: dark ? 0 : 1, params: { wave: 'sawtooth', cutoff: 1800 },
          pattern: '4 - - - 3 - - - 2 - - - 1 - - - 0 - - - -1 - - - 0 - - - - - - -' },
        // forced on by the game, never by intensity (layer 2)
        { name: 'alarm', inst: 'lead', layer: 2, gain: 0.26, octave: 0, params: { wave: 'sawtooth', cutoff: 1600 },
          pattern: '7 - - - 6 - - - 7 - - - 6 - - -' },
        { name: 'drone', inst: 'bass', layer: 2, gain: 0.34, octave: -2, params: { cutoff: 240, q: 14 },
          pattern: '0 - - - - - - - 0 - - - -1 - - -' },
        { name: 'engine', inst: 'pad', layer: 2, gain: 0.22, octave: -2, params: { cutoff: 360, attack: 0.3 },
          fn: function (i) { return i.stepInBar === 0 ? { deg: 0, steps: 16 } : null; } },
        // night only: sparse cold bells over the top
        { name: 'nightbell', inst: 'bell', layer: dark ? 0.15 : 2, gain: 0.16, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.12 ? { deg: [0, 2, 4, 7][Math.floor(i.rng() * 4)], vel: 0.5 } : null; } }
      ]
    };
  }
  function shopSong() {
    return {
      bpm: 96, key: 50, scale: 'dorian', chords: [0, 3, 5, 4], barsPerChord: 2, seed: 31, filter: 7000,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.3, chord: true, octave: -1, params: { cutoff: 900, attack: 0.8, release: 1.4 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'marimba', inst: 'marimba', layer: 0, gain: 0.34, chord: true, pattern: '0 . 4 . 2 . 7 . 4 . 2 . 4 . 9 .' },
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.3, chord: true, octave: -2, pattern: '0 - - - . . . . 0 - - - . . 4 .' },
        { name: 'shaker', inst: 'shaker', layer: 0, gain: 0.22, pattern: '..x...x...x..xx.' }
      ]
    };
  }

  /* =============================================================== helpers */
  function mixN(a, b, k) { return a + (b - a) * k; }
  function mixRGB(a, b, k) { return [mixN(a[0], b[0], k), mixN(a[1], b[1], k), mixN(a[2], b[2], k)]; }
  function rgb(c, a) {
    return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (a == null ? 1 : a) + ')';
  }
  function ease(k) { return k * k * (3 - 2 * k); }
  function mixSky(a, b, k) {
    var o = {};
    for (var key in a) {
      if (!a.hasOwnProperty(key)) continue;
      var va = a[key], vb = b[key];
      if (typeof va === 'number') o[key] = mixN(va, vb, k);
      else if (va && va.length === 3) o[key] = mixRGB(va, vb, k);
      else o[key] = k < 0.5 ? va : vb;
    }
    return o;
  }
  function label(ctx, text, x, y, size, color, align) {
    ctx.font = '700 ' + size + 'px ' + MONO;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  function pickWeighted(mix, r) {
    var total = 0, k;
    for (k in mix) if (mix.hasOwnProperty(k)) total += mix[k];
    var roll = r * total;
    for (k in mix) {
      if (!mix.hasOwnProperty(k)) continue;
      roll -= mix[k];
      if (roll <= 0) return k;
    }
    return 'warhead';
  }

  /* ======================================================== pre-rendered art
     Built once (lazily) and shared by the game and the attract screen.
     Only Math.random / a private seeded RNG are used here: never api.rng. */
  var ART = null;
  function art() {
    if (ART) return ART;
    var doc = root.document;
    function canvas(w, h) { var c = doc.createElement('canvas'); c.width = w; c.height = h; return c; }
    var vr = U.rng(1212);
    ART = { skyMask: canvas(W, SKYLINE_H), skyLights: canvas(W, SKYLINE_H), skyTint: canvas(W, SKYLINE_H), tintKey: '',
      towers: [], stars: [] };

    // far skyline: a white mask (tinted per sky) and its window lights
    var m = ART.skyMask.getContext('2d'), l = ART.skyLights.getContext('2d');
    m.fillStyle = '#fff';
    var x = -4;
    while (x < W) {
      var bw = 12 + vr() * 24, bh = 26 + vr() * 90;
      if (vr() < 0.25) bh += 30;
      var top = SKYLINE_H - bh;
      m.fillRect(x, top, bw, bh);
      if (vr() < 0.3) m.fillRect(x + bw * 0.4, top - 10, 2, 10);        // mast
      if (vr() < 0.3) m.fillRect(x + 3, top - 6, bw - 6, 6);            // setback roof
      for (var wy = top + 4; wy < SKYLINE_H - 4; wy += 5) {
        for (var wx = x + 3; wx < x + bw - 3; wx += 4) {
          if (vr() < 0.28) { l.fillStyle = vr() < 0.8 ? '#ffd98a' : '#9fd8ff'; l.fillRect(wx, wy, 2, 2); }
        }
      }
      x += bw + vr() * 3;
    }
    // towers: body + lights for each of the three states
    for (var i = 0; i < TOWERS.length; i++) {
      var set = {};
      ['full', 'damaged', 'rubble'].forEach(function (state) {
        var body = canvas(TW, TH), lights = canvas(TW, TH);
        paintTower(body.getContext('2d'), lights.getContext('2d'), TOWERS[i], state, U.rng(40 + i));
        set[state] = body; set[state + 'Lights'] = lights;
      });
      ART.towers.push(set);
    }
    for (var s = 0; s < 80; s++) ART.stars.push({ x: vr() * W, y: vr() * 380, s: vr() < 0.15 ? 2 : 1, tw: 1 + vr() * 3, ph: vr() * TAU });
    return ART;
  }
  // Re-tint the far skyline only when the sky colour actually changes.
  function tintedSkyline(sky) {
    var A = art();
    var night = sky.night;
    var col = mixRGB(mixRGB(sky.bot, [20, 28, 52], 0.55), [5, 7, 16], night * 0.75);
    var key = Math.round(col[0]) + ',' + Math.round(col[1]) + ',' + Math.round(col[2]);
    if (key !== A.tintKey) {
      A.tintKey = key;
      var g = A.skyTint.getContext('2d');
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, W, SKYLINE_H);
      g.drawImage(A.skyMask, 0, 0);
      g.globalCompositeOperation = 'source-in';
      g.fillStyle = rgb(col);
      g.fillRect(0, 0, W, SKYLINE_H);
      g.globalCompositeOperation = 'source-over';
    }
    return A.skyTint;
  }

  // Paints one tower state into a body canvas and a (night) lights canvas.
  function paintTower(g, lg, design, state, vr) {
    var cx = TW / 2;
    if (state === 'rubble') {
      g.fillStyle = '#22362c'; g.strokeStyle = '#5a9c78'; g.lineWidth = 1;
      var chunks = [[-16, 6, 12, 7], [-6, 9, 14, 10], [6, 5, 11, 7], [-11, 4, 8, 5], [2, 13, 7, 6]];
      chunks.forEach(function (c) {
        var bx = cx + c[0], by = TH - c[1], bw = c[2], bh = c[3];
        g.beginPath();
        g.moveTo(bx, TH); g.lineTo(bx + 1, by + bh * 0.2); g.lineTo(bx + bw * 0.5, by - 2 + vr() * 3);
        g.lineTo(bx + bw, by + bh * 0.4); g.lineTo(bx + bw, TH); g.closePath();
        g.fill(); g.stroke();
      });
      // bent girders poking out of the pile
      g.strokeStyle = '#8fb8a0'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(cx - 4, TH - 8); g.lineTo(cx - 1, TH - 18); g.lineTo(cx + 5, TH - 21);
      g.moveTo(cx + 7, TH - 5); g.lineTo(cx + 12, TH - 14); g.stroke();
      // scorch on the ground
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(cx - 22, TH - 2, 44, 2);
      return;
    }
    var total = 0;
    design.blocks.forEach(function (b) { total += b[1]; });
    var cutY = state === 'damaged' ? TH - total * 0.66 : -1;
    // jagged break line for damaged towers
    var jag = [];
    if (state === 'damaged') for (var jx = 0; jx <= TW; jx += 4) jag.push(cutY + (vr() - 0.3) * 7);
    function clipBroken(ctx) {
      if (state !== 'damaged') return;
      ctx.beginPath();
      ctx.moveTo(0, TH);
      for (var k = 0; k < jag.length; k++) ctx.lineTo(k * 4, jag[k]);
      ctx.lineTo(TW, TH); ctx.closePath(); ctx.clip();
    }
    g.save(); lg.save();
    clipBroken(g); clipBroken(lg);
    var y = TH;
    design.blocks.forEach(function (b, bi) {
      var bw = b[0], bh = b[1], x0 = Math.round(cx - bw / 2);
      y -= bh;
      g.fillStyle = '#0c2b21';
      g.fillRect(x0, y, bw, bh - 1);
      g.shadowColor = ACCENT; g.shadowBlur = 4;
      g.strokeStyle = state === 'damaged' ? '#2fbf6e' : ACCENT; g.lineWidth = 1;
      g.strokeRect(x0 + 0.5, y + 0.5, bw - 1, bh - 2);
      g.shadowBlur = 0;
      if (bi === design.blocks.length - 1) { g.fillStyle = '#7dffb8'; g.fillRect(x0 + 1, y, bw - 2, 1.5); }
      for (var wy = y + 3; wy < y + bh - 3; wy += 4) {
        for (var wx = x0 + 3; wx < x0 + bw - 3; wx += 4) {
          g.fillStyle = '#04110c'; g.fillRect(wx, wy, 2, 2);
          if (vr() < (state === 'damaged' ? 0.35 : 0.7)) { lg.fillStyle = vr() < 0.85 ? '#ffe7a0' : '#a8e6ff'; lg.fillRect(wx, wy, 2, 2); }
        }
      }
    });
    if (design.antenna && state === 'full') {
      g.strokeStyle = '#7dffb8'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(cx, y); g.lineTo(cx, y - design.antenna); g.stroke();
      lg.fillStyle = '#ff4d6d'; lg.fillRect(cx - 1, y - design.antenna - 1, 2, 2);
    }
    g.restore(); lg.restore();
    if (state === 'damaged') {
      // burning edge along the break
      g.save();
      g.beginPath();
      for (var k = 0; k < jag.length; k++) { if (k) g.lineTo(k * 4, jag[k]); else g.moveTo(0, jag[0]); }
      g.globalCompositeOperation = 'source-atop';
      g.strokeStyle = '#ff9a3c'; g.lineWidth = 2; g.shadowColor = '#ff6a00'; g.shadowBlur = 6;
      g.stroke();
      g.restore();
      // scorch marks
      g.fillStyle = 'rgba(0,0,0,0.45)';
      for (var s = 0; s < 4; s++) g.fillRect(cx - 12 + vr() * 20, cutY + 2 + vr() * 18, 3 + vr() * 5, 2 + vr() * 3);
    }
  }

  /* ========================================================= shared drawing */
  function drawSky(ctx, sky, t, yTop) {
    var g = ctx.createLinearGradient(0, yTop || 0, 0, GROUND);
    g.addColorStop(0, rgb(sky.top)); g.addColorStop(0.55, rgb(sky.mid)); g.addColorStop(1, rgb(sky.bot));
    ctx.fillStyle = g;
    ctx.fillRect(0, yTop || 0, W, GROUND - (yTop || 0));
    // stars
    var starA = U.clamp((sky.night - 0.3) / 0.7, 0, 1);
    if (starA > 0.01) {
      var A = art();
      for (var i = 0; i < A.stars.length; i++) {
        var s = A.stars[i];
        ctx.globalAlpha = starA * (0.45 + 0.4 * Math.sin(t * s.tw + s.ph));
        ctx.fillStyle = '#dfe8ff';
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
    }
    // sun: warm disc with a wide glow, reddening as it sinks
    if (sky.sunA > 0.01) {
      var low = U.clamp((sky.sunY - 150) / 300, 0, 1);
      var core = mixRGB([255, 250, 225], [255, 120, 60], low);
      var sg = ctx.createRadialGradient(sky.sunX, sky.sunY, 4, sky.sunX, sky.sunY, 90);
      sg.addColorStop(0, rgb(core, 0.55 * sky.sunA)); sg.addColorStop(1, rgb(core, 0));
      ctx.fillStyle = sg;
      ctx.fillRect(sky.sunX - 90, sky.sunY - 90, 180, 180);
      ctx.fillStyle = rgb(core, sky.sunA);
      ctx.beginPath(); ctx.arc(sky.sunX, sky.sunY, 20, 0, TAU); ctx.fill();
    }
    // moon: pale disc with a soft halo and two craters
    if (sky.moonA > 0.01) {
      var mg = ctx.createRadialGradient(sky.moonX, sky.moonY, 6, sky.moonX, sky.moonY, 60);
      mg.addColorStop(0, 'rgba(200,215,255,' + 0.22 * sky.moonA + ')'); mg.addColorStop(1, 'rgba(200,215,255,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(sky.moonX - 60, sky.moonY - 60, 120, 120);
      ctx.fillStyle = 'rgba(232,238,255,' + sky.moonA + ')';
      ctx.beginPath(); ctx.arc(sky.moonX, sky.moonY, 13, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(160,172,205,' + 0.6 * sky.moonA + ')';
      ctx.beginPath(); ctx.arc(sky.moonX - 4, sky.moonY - 3, 3, 0, TAU); ctx.arc(sky.moonX + 4, sky.moonY + 4, 2, 0, TAU); ctx.fill();
    }
  }
  function drawSkyline(ctx, sky) {
    ctx.drawImage(tintedSkyline(sky), 0, GROUND - SKYLINE_H);
    if (sky.night > 0.05) {
      ctx.globalAlpha = sky.night * 0.8;
      ctx.drawImage(art().skyLights, 0, GROUND - SKYLINE_H);
      ctx.globalAlpha = 1;
    }
    // haze where the skyline meets the ground
    var hz = ctx.createLinearGradient(0, GROUND - 40, 0, GROUND);
    hz.addColorStop(0, rgb(sky.bot, 0)); hz.addColorStop(1, rgb(sky.bot, 0.25 * (1 - sky.night * 0.6)));
    ctx.fillStyle = hz; ctx.fillRect(0, GROUND - 40, W, 40);
  }
  function drawGround(ctx, sky) {
    var gc = mixRGB([20, 48, 34], [5, 14, 11], sky.night);
    var g = ctx.createLinearGradient(0, GROUND, 0, H);
    g.addColorStop(0, rgb(gc)); g.addColorStop(1, rgb(mixRGB(gc, [0, 0, 0], 0.6)));
    ctx.fillStyle = g;
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.save();
    ctx.strokeStyle = ACCENT; ctx.shadowColor = ACCENT; ctx.shadowBlur = 8; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    ctx.restore();
  }
  function drawSearchlights(ctx, sky, t, xs) {
    var a = U.clamp((sky.night - 0.45) / 0.55, 0, 1);
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < xs.length; i++) {
      var ang = -Math.PI / 2 + Math.sin(t * 0.45 + i * 2.3) * 0.62;
      var ox = xs[i], oy = GROUND - 44, len = 560, spread = 0.07;
      var g = ctx.createLinearGradient(ox, oy, ox + Math.cos(ang) * len, oy + Math.sin(ang) * len);
      g.addColorStop(0, 'rgba(210,225,255,' + 0.2 * a + ')'); g.addColorStop(1, 'rgba(210,225,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(ang - spread) * len, oy + Math.sin(ang - spread) * len);
      ctx.lineTo(ox + Math.cos(ang + spread) * len, oy + Math.sin(ang + spread) * len);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function drawTower(ctx, design, hp, x, night, t) {
    var set = art().towers[design];
    var state = hp >= TOWER_HP ? 'full' : hp > 0 ? 'damaged' : 'rubble';
    var dx = Math.round(x - TW / 2), dy = GROUND - TH;
    ctx.drawImage(set[state], dx, dy);
    if (state !== 'rubble' && night > 0.05) {
      ctx.globalAlpha = night * (state === 'damaged' ? 0.6 + 0.3 * Math.sin(t * 13 + x) : 0.95);
      ctx.drawImage(set[state + 'Lights'], dx, dy);
      ctx.globalAlpha = 1;
    }
  }
  // Chain Sentinel dressing (display only): neighbouring towers in each
  // trio are linked by a short chain; a link snaps when either end is
  // rubble. Standing towers carry a small ₿ on their base block.
  function drawChains(ctx, hps, night) {
    ctx.save();
    ctx.lineWidth = 1.4;
    for (var i = 0; i < CITY_X.length - 1; i++) {
      if (i === 2) continue;                          // the centre silo splits the two trios
      var a = CITY_X[i] + TOWERS[i].blocks[0][0] / 2, b = CITY_X[i + 1] - TOWERS[i + 1].blocks[0][0] / 2;
      var y = GROUND - 7, broken = hps[i] <= 0 || hps[i + 1] <= 0;
      var n = 3, step = (b - a) / n;
      ctx.strokeStyle = broken ? 'rgba(120,110,100,0.55)' : 'rgba(247,147,26,' + (0.75 + 0.2 * night) + ')';
      ctx.shadowColor = '#f7931a'; ctx.shadowBlur = broken ? 0 : 4;
      for (var k = 0; k < n; k++) {
        if (broken && k === 1) continue;               // snapped middle link
        var cx = a + step * (k + 0.5), cy = y + (broken ? (k === 0 ? 2 : 3) : 0);
        ctx.beginPath();
        if (k % 2) ctx.ellipse(cx, cy, 1.5, 2.6, 0, 0, TAU);
        else ctx.ellipse(cx, cy, step * 0.62, 1.9, broken ? (k === 0 ? 0.35 : -0.35) : 0, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.restore();
    for (var j = 0; j < CITY_X.length; j++) {
      if (hps[j] <= 0) continue;
      var bh = TOWERS[j].blocks[0][1];
      U.btc(ctx, CITY_X[j], GROUND - bh / 2, Math.min(5, bh / 2 - 1.5), { glow: 3, alpha: hps[j] >= TOWER_HP ? 0.95 : 0.7 });
    }
  }
  // Blast: white-hot core, gold body, orange bloom and a thin ring.
  function drawBlast(ctx, x, y, r, k, hostile) {
    r = Math.max(0.5, r);
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    if (hostile) {
      g.addColorStop(0, 'rgba(255,230,220,0.9)'); g.addColorStop(0.35, 'rgba(255,90,90,0.75)');
      g.addColorStop(0.62, 'rgba(255,50,70,0.4)'); g.addColorStop(1, 'rgba(255,40,60,0)');
    } else {
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.3, 'rgba(255,236,140,0.9)');
      g.addColorStop(0.62, 'rgba(255,150,50,0.5)'); g.addColorStop(1, 'rgba(255,90,30,0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.fill();
    ctx.strokeStyle = hostile ? 'rgba(255,160,160,' + (0.8 * (1 - k)) + ')' : 'rgba(255,250,215,' + (0.9 * (1 - k)) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }
  function drawBomber(ctx, x, y, dir, t, bayOpen) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.fillStyle = '#1c0d18'; ctx.strokeStyle = ENEMY; ctx.lineWidth = 1.2;
    ctx.shadowColor = ENEMY; ctx.shadowBlur = 6;
    // swept wing
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-8, -10); ctx.lineTo(-13, -10); ctx.lineTo(-5, 1); ctx.closePath(); ctx.fill(); ctx.stroke();
    // fuselage
    ctx.beginPath(); ctx.moveTo(19, 0); ctx.lineTo(13, -4); ctx.lineTo(-16, -3); ctx.lineTo(-19, -9); ctx.lineTo(-22, -9); ctx.lineTo(-20, 3); ctx.lineTo(12, 4); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    // far wing + cockpit
    ctx.beginPath(); ctx.moveTo(2, 3); ctx.lineTo(-9, 10); ctx.lineTo(-13, 10); ctx.lineTo(-6, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffb3c1'; ctx.fillRect(10, -3, 4, 2);
    // bomb bay glows before a drop
    if (bayOpen) { ctx.fillStyle = 'rgba(255,90,90,' + (0.6 + 0.4 * Math.sin(t * 40)) + ')'; ctx.fillRect(-6, 3, 8, 3); }
    // nav lights
    if (Math.floor(t * 3) % 2) { ctx.fillStyle = '#ff2a2a'; ctx.fillRect(-12, -11, 2, 2); ctx.fillStyle = '#7dff9a'; ctx.fillRect(-12, 10, 2, 2); }
    ctx.restore();
  }
  // One enemy head (also used for the NEW: banner icon). blink 0..1 for splitters.
  function drawHead(ctx, kind, x, y, t, blink, vx, vy) {
    var k = KINDS[kind];
    ctx.save();
    if (kind === 'smart') {
      var pu = 0.75 + 0.25 * Math.sin(t * 9);
      var g = ctx.createRadialGradient(x, y, 0, x, y, 18 * pu);
      g.addColorStop(0, 'rgba(255,240,255,1)'); g.addColorStop(0.25, 'rgba(210,150,255,0.9)'); g.addColorStop(1, 'rgba(160,80,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 18 * pu, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(230,200,255,0.7)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, 8, t * 4, t * 4 + 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 8, t * 4 + Math.PI, t * 4 + Math.PI + 2); ctx.stroke();
    } else if (kind === 'mirv') {
      var on = blink > 0 && Math.floor(t * (5 + blink * 14)) % 2 === 0;
      var s = on ? 6.5 : 5;
      ctx.fillStyle = on ? '#ffffff' : '#ffb347';
      ctx.shadowColor = '#ffb347'; ctx.shadowBlur = on ? 16 : 8;
      ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      if (blink > 0) {
        ctx.strokeStyle = 'rgba(255,200,120,' + (0.25 + 0.5 * blink) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, 12 - blink * 4, 0, TAU); ctx.stroke();
      }
    } else if (kind === 'dart') {
      var sp = Math.hypot(vx || 0, vy || 1) || 1;
      ctx.strokeStyle = '#e8feff'; ctx.lineWidth = 2; ctx.shadowColor = '#7df9ff'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - (vx || 0) / sp * 7, y - (vy || 1) / sp * 7); ctx.stroke();
    } else {
      ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgb(' + k.rgb + ')'; ctx.shadowBlur = 10;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    ctx.restore();
  }

  /* ================================================================ create */
  function create(api) {
    var rng = api.rng;

    /* --------------------------------------------------------- state */
    var cities = CITY_X.map(function (x, i) { return { x: x, hp: TOWER_HP, design: i, smokeT: 0 }; });
    var silos = SILO_X.map(function (x) { return { x: x, ammo: BASE_AMMO, alive: true }; });
    var interceptors = [], blasts = [], enemies = [], bombers = [], flashes = [], debris = [], ghosts = [];
    var upg = { blast: 0, speed: 0, ammo: 0, rebuild: 0, turret: 0 };
    var credits = 0, score = 0, nextBonus = BONUS_TOWER_EVERY;
    var wave = 0, def = null, toSpawn = 0, spawnT = 0, bomberAt = [], clearT = 0, hitThisWave = false;
    var phase = 'battle', tally = null, shop = null;
    var banner = { t: 0, a: '', b: '', c: '', kind: null };
    var hintT = 4;
    var turret = { cd: 2, ang: -Math.PI / 2 };
    var aim = { x: W / 2, y: 260 };
    var lastMoved = api.pointer().moved;
    var skyFrom = SKY[0], skyTo = SKY[0], skyK = 1;
    var over = false, overT = 0, t = 0;
    var mus = { int: -1, alarm: false, bomber: false, calm: 0 };

    /* ------------------------------------------------ derived stats */
    function ammoMax() { return BASE_AMMO + 2 * upg.ammo; }
    function blastMax() { return BASE_BLAST * (1 + 0.12 * upg.blast); }
    function siloSpeed(i) { return SILO_SPEED[i] * (1 + 0.2 * upg.speed); }
    function towersStanding() { return cities.filter(function (c) { return c.hp > 0; }).length; }
    function sky() { return skyK >= 1 ? skyTo : mixSky(skyFrom, skyTo, ease(skyK)); }
    function waveMul() { return Math.min(wave, 10); }
    function setSkyTarget(s, instant) {
      if (s === skyTo && !instant) return;
      skyFrom = instant ? s : sky();
      skyTo = s; skyK = instant ? 1 : 0;
    }

    /* ------------------------------------------------------ scoring */
    function addPts(n, x, y) {
      n = Math.floor(n);
      if (n <= 0) return;
      score += n;
      api.addScore(n);
      if (x != null) api.fx.text(x, y, '+' + n, '#fff', 10);
      if (score >= nextBonus) {
        nextBonus += BONUS_TOWER_EVERY;
        var c = worstTower();
        if (c) { c.hp = TOWER_HP; api.fx.text(c.x, GROUND - 60, 'BONUS REPAIR', ACCENT, 11); }
      }
    }
    function addCredits(n) { credits += n; }
    function worstTower() {
      var worst = null;
      cities.forEach(function (c) { if (c.hp < TOWER_HP && (!worst || c.hp < worst.hp)) worst = c; });
      return worst;
    }

    /* ------------------------------------------------- targets / spawn */
    function targets() {
      var list = [];
      cities.forEach(function (c) { if (c.hp > 0) list.push(c.x); });
      silos.forEach(function (s) { if (s.alive) list.push(s.x); });
      return list.length ? list : [W / 2];
    }
    function randomTarget() {
      var tg = targets();
      return tg[Math.floor(rng() * tg.length)] + (rng() - 0.5) * 10;
    }
    function spawnEnemy(kind, x, y, tx, baseSpeed) {
      var k = KINDS[kind];
      var sp = (baseSpeed || def.speed) * k.speed * (0.88 + rng() * 0.24);
      var dx = tx - x, dy = GROUND - y, d = Math.hypot(dx, dy) || 1;
      var e = { kind: kind, x: x, y: y, sx: x, sy: y, tx: tx, speed: sp, vx: dx / d * sp, vy: dy / d * sp,
        age: 0, lat: 0, dodges: 3, splitY: 0, hist: null, histT: 0, turretT: -9 };
      if (kind === 'mirv') e.splitY = 170 + rng() * 120;
      if (kind === 'smart') e.hist = [x, y];
      enemies.push(e);
      return e;
    }
    function launchFromTop() {
      spawnEnemy(pickWeighted(def.mix, rng()), 20 + rng() * (W - 40), -6, randomTarget());
    }
    function spawnBomber() {
      var dir = rng() < 0.5 ? 1 : -1;
      bombers.push({ x: dir > 0 ? -30 : W + 30, y: 64 + rng() * 60, dir: dir, speed: 46 + wave * 1.5,
        dropT: 1.2 + rng() * 0.8, drops: 3 + (wave >= 8 ? 1 : 0) });
      if (M()) M().note('riser', 0, { dur: 0.8, gain: 0.25 });
    }

    /* ---------------------------------------------------- firing */
    function fire(siloIdx, tx, ty) {
      var s = silos[siloIdx];
      if (!s || !s.alive || s.ammo <= 0) return false;
      if (ty > AIM_BOTTOM) ty = AIM_BOTTOM;
      s.ammo--;
      launchInterceptor(s.x, GROUND - 16, tx, ty, siloSpeed(siloIdx), blastMax(), false);
      api.audio.tone(700, 0.08, { type: 'square', vol: 0.1, slide: 1.8 });
      return true;
    }
    function launchInterceptor(sx, sy, tx, ty, sp, max, isTurret) {
      var d = Math.hypot(tx - sx, ty - sy) || 1;
      interceptors.push({ sx: sx, sy: sy, x: sx, y: sy, tx: tx, ty: ty, vx: (tx - sx) / d * sp, vy: (ty - sy) / d * sp,
        left: d / sp, max: max, turret: isTurret });
    }
    function nearestSilo(tx) {
      var order = [0, 1, 2].sort(function (a, b) { return Math.abs(SILO_X[a] - tx) - Math.abs(SILO_X[b] - tx); });
      for (var i = 0; i < order.length; i++) if (silos[order[i]].alive && silos[order[i]].ammo > 0) return order[i];
      return -1;
    }
    function fireNearest(tx, ty) {
      var i = nearestSilo(tx);
      if (i >= 0) fire(i, tx, ty);
      else api.audio.tone(120, 0.05, { type: 'square', vol: 0.06 });
    }
    function detonate(m) {
      blasts.push({ x: m.tx, y: m.ty, r: 0, max: m.max, t: 0, life: m.turret ? 0.85 : 1.1, ch: { n: 0 } });
      api.audio.noise(0.25, { vol: m.turret ? 0.1 : 0.18, cutoff: 2200 });
      if (M()) M().note('sub', 0, { chord: true, octave: -1, dur: 0.35, gain: m.turret ? 0.3 : 0.55 });
      smartBombsReact(m.tx, m.ty);
    }
    // Smart bombs sidestep a fresh blast beside or behind them. A blast set
    // in their path (ahead) is committed to - that is how you beat them.
    function smartBombsReact(bx, by) {
      enemies.forEach(function (e) {
        if (e.kind !== 'smart' || e.dodges <= 0) return;
        var dx = bx - e.x, dy = by - e.y, d = Math.hypot(dx, dy);
        if (d > DODGE_R) return;
        var ahead = (dx * e.vx + dy * e.vy) / (e.speed || 1);
        if (d > 10 && ahead > d * DODGE_AHEAD) return;
        var side = e.x > bx ? 1 : e.x < bx ? -1 : (rng() < 0.5 ? -1 : 1);
        if (e.x < 40) side = 1; else if (e.x > W - 40) side = -1;
        e.lat = side * 170;
        e.dodges--;
        flashes.push({ x: e.x, y: e.y, t: 0, life: 0.35, r: 16, rgb: KINDS.smart.rgb });
        api.audio.tone(880, 0.12, { type: 'triangle', vol: 0.07, slide: 1.6 });
      });
    }

    /* ------------------------------------------------------- waves */
    function startWave() {
      wave++;
      def = waveDef(wave);
      toSpawn = def.n;
      spawnT = 1.6;
      clearT = 0;
      hitThisWave = false;
      bomberAt = [];
      for (var b = 0; b < def.bombers; b++) bomberAt.push(Math.floor(def.n * (b + 1) / (def.bombers + 1)));
      silos.forEach(function (s) { s.ammo = ammoMax(); s.alive = true; });
      phase = 'battle';
      setSkyTarget(skyFor(wave), wave === 1);
      var intro = def.intro && KINDS[def.intro];
      banner = { t: intro ? 3.2 : 2, a: 'WAVE ' + wave, b: intro ? 'NEW: ' + intro.name : skyFor(wave).name, c: intro ? intro.intro : '', kind: def.intro };
      api.audio.arp([392, 494, 587], 0.08, { type: 'triangle', vol: 0.16 });
      startBattleMusic();
      if (M() && intro) M().note('riser', 0, { dur: 1.2, gain: 0.3 });
    }
    function checkWaveClear(dt) {
      var busy = toSpawn > 0 || bomberAt.length || enemies.length || bombers.length || interceptors.length;
      if (busy) { clearT = 0; return; }
      clearT += dt;
      if (clearT > 0.9) startTally();
    }

    /* ------------------------------------------------------- tally */
    function startTally() {
      phase = 'tally';
      var items = [];
      cities.forEach(function (c) { if (c.hp > 0) items.push({ type: 'tower', c: c }); });
      silos.forEach(function (s) { if (s.alive) for (var a = 0; a < s.ammo; a++) items.push({ type: 'ammo', s: s }); });
      if (!hitThisWave) items.push({ type: 'perfect' });
      tally = { items: items, i: 0, t: 0.6, hold: 1.3, towers: 0, ammo: 0, perfect: false, pts: 0, cr: 0 };
      if (M()) {
        // resolve on V -> i, then strip back to the pad for a breath
        M().stinger([{ deg: 4 }, { deg: 6, at: 2 }, { deg: 7, at: 4, steps: 8 }, { deg: 9, at: 4, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.5 });
        mus.calm = 99;
      }
    }
    function tallyStep() {
      var it = tally.items[tally.i++];
      var m = waveMul(), mu = M();
      if (it.type === 'tower') {
        tally.towers++;
        tally.pts += TALLY.towerPts * m; tally.cr += TALLY.towerCr;
        addPts(TALLY.towerPts * m, it.c.x, GROUND - 70);
        addCredits(TALLY.towerCr);
        if (mu) mu.note('marimba', tally.towers - 1, { octave: 1, gain: 0.55 });
        return 0.3;
      }
      if (it.type === 'ammo') {
        it.s.ammo--;
        tally.ammo++;
        tally.pts += TALLY.ammoPts * m;
        addPts(TALLY.ammoPts * m);
        if (tally.ammo % TALLY.ammoPerCr === 0) { tally.cr++; addCredits(1); }
        api.audio.tone(1200 + (tally.ammo % 8) * 60, 0.03, { type: 'square', vol: 0.04 });
        return 0.045;
      }
      tally.perfect = true;
      tally.pts += TALLY.perfectPts * m; tally.cr += TALLY.perfectCr;
      addPts(TALLY.perfectPts * m, W / 2, 210);
      addCredits(TALLY.perfectCr);
      if (mu) mu.stinger([{ deg: 7 }, { deg: 9, at: 1 }, { deg: 11, at: 2 }, { deg: 14, at: 3, steps: 6 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.45 });
      return 0.5;
    }
    function updateTally(dt, skip) {
      if (skip) { while (tally.i < tally.items.length) tallyStep(); tally.hold = Math.min(tally.hold, 0.5); }
      if (tally.i < tally.items.length) {
        tally.t -= dt;
        while (tally.t <= 0 && tally.i < tally.items.length) tally.t += tallyStep();
        return;
      }
      tally.hold -= dt;
      if (tally.hold <= 0) openShop();
    }

    /* -------------------------------------------------------- shop */
    function upgradeCost(u) { return u.base + u.step * upg[u.id]; }
    function upgradeState(u) {
      if (u.id === 'rebuild') return worstTower() ? (credits >= upgradeCost(u) ? 'ok' : 'poor') : 'na';
      if (upg[u.id] >= u.max) return 'max';
      return credits >= upgradeCost(u) ? 'ok' : 'poor';
    }
    function openShop() {
      phase = 'shop';
      tally = null;
      shop = { t: SHOP_TIME, lock: SHOP_LOCK, sel: UPGRADES.length, flash: -1, flashT: 0 };
      setSkyTarget(skyFor(wave + 1));
      if (M()) M().play(shopSong(), { fade: 1.2, intensity: 1 });
      mus.int = -1; mus.alarm = false; mus.bomber = false; mus.calm = 0;
    }
    function buy(idx) {
      var u = UPGRADES[idx];
      var st = upgradeState(u);
      shop.flash = idx; shop.flashT = 0.35;
      if (st !== 'ok') {
        api.audio.tone(140, 0.12, { type: 'square', vol: 0.08 });
        return;
      }
      credits -= upgradeCost(u);
      upg[u.id]++;
      if (u.id === 'rebuild') {
        var c = worstTower();
        c.hp = TOWER_HP;
        api.fx.burst(c.x, GROUND - 20, ACCENT, 18, 90, 0.6);
      }
      if (M()) M().note('bell', upg[u.id] + idx, { octave: 1, gain: 0.5 });
      api.audio.tone(990, 0.08, { type: 'triangle', vol: 0.1, slide: 1.5 });
    }
    function rowAt(x, y) {
      for (var i = 0; i <= UPGRADES.length; i++) {
        var r = shopRow(i);
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
      }
      return -1;
    }
    function updateShop(dt) {
      var inp = api.input, p = api.pointer();
      shop.t -= dt;
      shop.lock -= dt;
      if (shop.flashT > 0) shop.flashT -= dt;
      if (shop.t <= 0) { closeShop(); return; }
      var hovered = rowAt(p.x, p.y);
      if (p.moved !== lastMoved) { lastMoved = p.moved; if (hovered >= 0) shop.sel = hovered; }
      if (shop.lock > 0) return;
      if (inp.hit('up')) shop.sel = (shop.sel + UPGRADES.length) % (UPGRADES.length + 1);
      if (inp.hit('down')) shop.sel = (shop.sel + 1) % (UPGRADES.length + 1);
      for (var k = 0; k < UPGRADES.length; k++) if (inp.hit('k' + (k + 1))) { shop.sel = k; buy(k); }
      var act = inp.hit('a') || inp.hit('start') ? shop.sel : -1;
      if (inp.hit('hold')) act = rowAt(p.x, p.y);
      if (act === UPGRADES.length) closeShop();
      else if (act >= 0) buy(act);
    }
    function closeShop() {
      shop = null;
      api.audio.arp([587, 740, 880], 0.06, { type: 'square', vol: 0.1 });
      startWave();
    }

    /* ------------------------------------------------------ turret */
    function updateTurret(dt) {
      if (!upg.turret || !silos[1].alive) return;
      var best = null;
      enemies.forEach(function (e) {
        if (e.y < 130 || t - e.turretT < 1.6) return;
        if (!best || e.y > best.y) best = e;
      });
      var ox = SILO_X[1], oy = GROUND - 26;
      if (best) turret.ang += (Math.atan2(best.y - oy, best.x - ox) - turret.ang) * Math.min(1, dt * 8);
      turret.cd -= dt;
      if (turret.cd > 0 || !best) return;
      // lead the target: two passes of "where will it be when we get there"
      var sp = 720, px = best.x, py = best.y;
      for (var n = 0; n < 2; n++) {
        var ft = Math.hypot(px - ox, py - oy) / sp;
        px = best.x + best.vx * ft; py = best.y + best.vy * ft;
      }
      py = Math.min(py, AIM_BOTTOM);
      best.turretT = t;
      launchInterceptor(ox, oy, U.clamp(px, 6, W - 6), py, sp, blastMax() * 0.65, true);
      turret.cd = TURRET_COOLDOWN[upg.turret];
      api.audio.tone(1100, 0.05, { type: 'square', vol: 0.06, slide: 1.5 });
    }

    /* ----------------------------------------------- world updates */
    function updateSpawner(dt) {
      if (toSpawn <= 0) return;
      spawnT -= dt;
      if (spawnT > 0) return;
      var burst = 1 + (rng() < 0.25 ? 1 : 0) + (wave >= 6 && rng() < 0.2 ? 1 : 0);
      for (var b = 0; b < burst && toSpawn > 0; b++, toSpawn--) launchFromTop();
      var launched = def.n - toSpawn;
      while (bomberAt.length && launched >= bomberAt[0]) { bomberAt.shift(); spawnBomber(); }
      spawnT = def.gap * (0.6 + rng() * 0.8);
    }
    function updateBombers(dt) {
      for (var i = bombers.length - 1; i >= 0; i--) {
        var b = bombers[i];
        b.x += b.dir * b.speed * dt;
        if (b.drops > 0 && b.x > 30 && b.x < W - 30) {
          b.dropT -= dt;
          if (b.dropT <= 0) {
            b.drops--;
            b.dropT = 1.4 + rng() * 0.8;
            spawnEnemy('warhead', b.x, b.y + 6, randomTarget());
            api.audio.tone(260, 0.1, { type: 'sawtooth', vol: 0.06, slide: 0.6 });
          }
        }
        var hit = blastTouching(b.x, b.y, KINDS.bomber.hitR);
        if (hit) { killBomber(i, hit); continue; }
        if ((b.dir > 0 && b.x > W + 40) || (b.dir < 0 && b.x < -40)) bombers.splice(i, 1);
      }
    }
    function updateInterceptors(dt) {
      for (var i = interceptors.length - 1; i >= 0; i--) {
        var m = interceptors[i];
        m.left -= dt;
        if (m.left <= 0) { detonate(m); interceptors.splice(i, 1); }
        else { m.x += m.vx * dt; m.y += m.vy * dt; }
      }
    }
    function updateBlasts(dt) {
      for (var i = blasts.length - 1; i >= 0; i--) {
        var bl = blasts[i];
        bl.t += dt;
        var k = bl.t / bl.life;
        bl.r = bl.max * Math.sin(Math.min(1, k) * Math.PI);
        if (k >= 1) blasts.splice(i, 1);
      }
      for (i = flashes.length - 1; i >= 0; i--) { flashes[i].t += dt; if (flashes[i].t >= flashes[i].life) flashes.splice(i, 1); }
      for (i = ghosts.length - 1; i >= 0; i--) { ghosts[i].t += dt; if (ghosts[i].t >= ghosts[i].life) ghosts.splice(i, 1); }
    }
    function blastTouching(x, y, hitR) {
      for (var j = 0; j < blasts.length; j++) {
        var b = blasts[j];
        if (!b.hostile && Math.hypot(x - b.x, y - b.y) < b.r + hitR) return b;
      }
      return null;
    }
    function moveEnemy(e, dt) {
      e.age += dt;
      if (e.kind === 'smart') {
        // homes on its target; a dodge adds a decaying sideways push
        var dx = e.tx - e.x, dy = GROUND - e.y, d = Math.hypot(dx, dy) || 1;
        e.vx = dx / d * e.speed; e.vy = dy / d * e.speed;
        e.x = U.clamp(e.x + (e.vx + e.lat) * dt, 8, W - 8);
        e.y += e.vy * dt;
        e.lat *= Math.pow(0.04, dt);
        e.histT -= dt;
        if (e.histT <= 0) { e.histT = 0.08; e.hist.push(e.x, e.y); if (e.hist.length > 48) e.hist.splice(0, 2); }
        return;
      }
      e.x += e.vx * dt; e.y += e.vy * dt;
    }
    function splitMirv(e) {
      var n = def.split;
      for (var s = 0; s < n; s++) spawnEnemy('warhead', e.x, e.y, randomTarget(), e.speed / KINDS.mirv.speed);
      flashes.push({ x: e.x, y: e.y, t: 0, life: 0.45, r: 26, rgb: KINDS.mirv.rgb });
      ghosts.push({ sx: e.sx, sy: e.sy, x: e.x, y: e.y, rgb: KINDS.mirv.rgb, t: 0, life: 1.4 });
      api.audio.tone(500, 0.08, { type: 'sawtooth', vol: 0.09 });
      var mu = M();
      if (mu) { mu.note('pluck', 0, { octave: 1, gain: 0.4 }); mu.note('pluck', 1, { octave: 1, gain: 0.4 }); mu.note('pluck', 3, { octave: 1, gain: 0.35 }); }
    }
    function updateEnemies(dt) {
      for (var i = enemies.length - 1; i >= 0; i--) {
        var e = enemies[i];
        moveEnemy(e, dt);
        if (e.kind === 'mirv' && e.y >= e.splitY) { enemies.splice(i, 1); splitMirv(e); continue; }
        var hit = blastTouching(e.x, e.y, KINDS[e.kind].hitR);
        if (hit) { enemies.splice(i, 1); killEnemy(e, hit); continue; }
        if (e.y >= GROUND - 4) { enemies.splice(i, 1); hitGround(e); }
      }
    }
    function killEnemy(e, blast) {
      var k = KINDS[e.kind];
      blast.ch.n++;
      var chain = Math.min(8, blast.ch.n);
      addPts(k.pts * wave * chain, e.x, e.y - 12);
      addCredits(k.cr);
      blasts.push({ x: e.x, y: e.y, r: 0, max: 22, t: 0, life: 0.6, ch: blast.ch });
      if (M()) M().note('bell', Math.min(14, blast.ch.n - 1), { chord: true, octave: 1, gain: 0.5 });
      api.fx.burst(e.x, e.y, 'rgb(' + k.rgb + ')', 10, 130, 0.5);
      if (e.kind === 'mirv') api.fx.text(e.x, e.y - 26, 'SPLIT STOPPED', '#ffb347', 9);
    }
    function killBomber(i, blast) {
      var b = bombers[i];
      bombers.splice(i, 1);
      blast.ch.n++;
      addPts(KINDS.bomber.pts * wave, b.x, b.y - 16);
      addCredits(KINDS.bomber.cr);
      api.fx.text(b.x, b.y - 32, 'BOMBER DOWN', ENEMY, 11);
      blasts.push({ x: b.x, y: b.y, r: 0, max: 30, t: 0, life: 0.7, ch: blast.ch });
      api.fx.burst(b.x, b.y, ENEMY, 26, 170, 0.8);
      for (var k = 0; k < 10; k++) addDebris(b.x, b.y, (Math.random() - 0.5) * 120 + b.dir * b.speed * 0.5, -40 - Math.random() * 60, 'wreck');
      api.shake(6);
      api.audio.noise(0.5, { vol: 0.3, cutoff: 900 });
      if (M()) M().note('sub', -2, { octave: -2, dur: 0.6, gain: 0.7 });
    }
    function hitGround(e) {
      var hitSomething = false;
      cities.forEach(function (c) {
        if (c.hp > 0 && Math.abs(c.x - e.x) < 20) {
          c.hp--; hitSomething = true; hitThisWave = true;
          api.fx.burst(c.x, GROUND - 20, c.hp ? '#ff9a3c' : ACCENT, 30, 180, 0.9);
          for (var k = 0; k < 8; k++) addDebris(c.x + (Math.random() - 0.5) * 20, GROUND - 24, (Math.random() - 0.5) * 140, -60 - Math.random() * 120, 'wreck');
          api.fx.text(c.x, GROUND - 70, c.hp ? 'DAMAGED' : 'TOWER LOST', c.hp ? '#ff9a3c' : ENEMY, 10);
        }
      });
      silos.forEach(function (s) {
        if (s.alive && Math.abs(s.x - e.x) < 20) {
          s.alive = false; s.ammo = 0; hitSomething = true;
          api.fx.burst(s.x, GROUND - 10, '#9aa3c7', 24, 160, 0.8);
        }
      });
      blasts.push({ x: e.x, y: GROUND - 4, r: 0, max: 26, t: 0, life: 0.7, hostile: true });
      api.shake(hitSomething ? 10 : 4);
      if (hitSomething && M()) { M().duck(0.55, 0.9); M().note('sub', 0, { octave: -2, dur: 0.8, gain: 0.8 }); }
      api.audio.noise(0.35, { vol: hitSomething ? 0.35 : 0.2, cutoff: 700 });
    }

    /* ---------------------------------------- cosmetic debris / smoke */
    function addDebris(x, y, vx, vy, type) {
      if (debris.length >= MAX_DEBRIS) debris.shift();
      var life = type === 'smoke' ? 1.6 + Math.random() : type === 'ember' ? 0.9 : 1.2;
      debris.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, type: type, s: type === 'smoke' ? 3 + Math.random() * 3 : 2 });
    }
    function updateDebris(dt) {
      cities.forEach(function (c) {
        if (c.hp >= TOWER_HP) return;
        c.smokeT -= dt;
        if (c.smokeT > 0) return;
        if (c.hp > 0) { c.smokeT = 0.09; addDebris(c.x + (Math.random() - 0.5) * 16, GROUND - 30, 6 + Math.random() * 8, -24 - Math.random() * 14, Math.random() < 0.3 ? 'ember' : 'smoke'); }
        else { c.smokeT = 0.35; addDebris(c.x + (Math.random() - 0.5) * 20, GROUND - 8, 4 + Math.random() * 6, -14 - Math.random() * 10, Math.random() < 0.4 ? 'ember' : 'smoke'); }
      });
      for (var i = debris.length - 1; i >= 0; i--) {
        var d = debris[i];
        d.life -= dt;
        if (d.life <= 0) { debris.splice(i, 1); continue; }
        if (d.type === 'wreck') { d.vy += 260 * dt; if (d.y > GROUND - 1) { d.y = GROUND - 1; d.vy *= -0.3; d.vx *= 0.6; } }
        else { d.s += dt * (d.type === 'smoke' ? 6 : 0); }
        d.x += d.vx * dt; d.y += d.vy * dt;
      }
    }

    /* ------------------------------------------------------ music */
    function startBattleMusic() {
      var mu = M();
      if (!mu) return;
      mu.play(battleSong(skyFor(wave).night), { fade: wave === 1 ? 1.2 : 1.0, intensity: 0 });
      mus.int = -1; mus.alarm = false; mus.bomber = false; mus.calm = 0;
    }
    function syncMusic(dt) {
      var mu = M();
      if (!mu || phase === 'shop') return;
      if (mus.calm > 0) mus.calm -= dt;
      var threats = enemies.length + bombers.length * 2;
      var it = mus.calm > 0 ? 0 : Math.round(U.clamp(threats / 9 + (wave - 1) * 0.05, 0, 1) * 10) / 10;
      if (it !== mus.int) { mus.int = it; mu.setIntensity(it); }
      var close = !over && phase === 'battle' && enemies.some(function (e) { return e.y > GROUND - 150; });
      if (close !== mus.alarm) {
        mus.alarm = close;
        mu.setTrack('alarm', close ? true : null);
        if (close) mu.note('riser', 0, { dur: 0.9, gain: 0.35 });
      }
      var drone = bombers.length > 0;
      if (drone !== mus.bomber) {
        mus.bomber = drone;
        mu.setTrack('drone', drone ? true : null);
        mu.setTrack('engine', drone ? true : null);
      }
    }

    /* ------------------------------------------------------ input */
    function updateAim(dt) {
      var inp = api.input, p = api.pointer();
      if (p.moved !== lastMoved) { lastMoved = p.moved; aim.x = p.x; aim.y = p.y; }
      if (inp.held('left')) aim.x -= 360 * dt;
      if (inp.held('right')) aim.x += 360 * dt;
      if (inp.held('up')) aim.y -= 360 * dt;
      if (inp.held('down')) aim.y += 360 * dt;
      aim.x = U.clamp(aim.x, 6, W - 6); aim.y = U.clamp(aim.y, AIM_TOP, AIM_BOTTOM);
    }
    function handleBattleInput() {
      var inp = api.input, p = api.pointer();
      if (inp.hit('hold')) { aim.x = U.clamp(p.x, 6, W - 6); aim.y = U.clamp(p.y, AIM_TOP, AIM_BOTTOM); fireNearest(aim.x, aim.y); }
      if (inp.hit('a')) fireNearest(aim.x, aim.y);
      if (inp.hit('b')) fire(0, aim.x, aim.y);
      if (inp.hit('c')) fire(1, aim.x, aim.y);
      if (inp.hit('d')) fire(2, aim.x, aim.y);
    }
    function updateStatus() {
      if (phase === 'shop') { api.setStatus('SUPPLY DEPOT  \u00b7  CREDITS ' + credits + '  \u00b7  1-5 BUY  \u00b7  SPACE CONTINUE'); return; }
      var ammo = silos.map(function (s) { return s.alive ? s.ammo : 'X'; }).join(' / ');
      api.setStatus('WAVE ' + wave + '  \u00b7  AMMO ' + ammo + '  \u00b7  TOWERS ' + towersStanding() + '  \u00b7  CREDITS ' + credits);
    }

    startWave();

    /* ====================================================== game object */
    return {
      // Read-only test/QA hook. `enemy` is the lowest incoming warhead (not bombers).
      debug: function () {
        var low = null, kinds = {};
        enemies.forEach(function (e) {
          kinds[e.kind] = (kinds[e.kind] || 0) + 1;
          if (!low || e.y > low.y) low = e;
        });
        if (bombers.length) kinds.bomber = bombers.length;
        var up = {};
        for (var k in upg) if (upg.hasOwnProperty(k)) up[k] = upg[k];
        return {
          enemy: low && { x: low.x, y: low.y, vx: low.vx, vy: low.vy, kind: low.kind },
          wave: wave, phase: phase, warheads: enemies.length, bombers: bombers.length, kinds: kinds,
          cities: cities.map(function (c) { return c.hp; }), ammo: silos.map(function (s) { return s.alive ? s.ammo : -1; }),
          credits: credits, upgrades: up, sky: skyTo.name, shopTime: shop ? Math.max(0, shop.t) : 0, dead: over
        };
      },

      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        if (banner.t > 0) banner.t -= dt;
        if (hintT > 0) hintT -= dt;
        if (skyK < 1) skyK = Math.min(1, skyK + dt / 3.5);

        if (phase === 'shop') {
          updateShop(dt);
        } else {
          updateAim(dt);
          if (phase === 'battle' && !over) {
            handleBattleInput();
            updateSpawner(dt);
            updateTurret(dt);
          } else if (phase === 'tally') {
            updateTally(dt, inp.hit('hold') || inp.hit('a') || inp.hit('start'));
          }
        }
        updateBombers(dt);
        updateInterceptors(dt);
        updateBlasts(dt);
        updateEnemies(dt);
        updateDebris(dt);

        if (!over && towersStanding() === 0) {
          over = true;
          api.audio.tone(90, 1, { type: 'sawtooth', vol: 0.3, slide: 0.5 });
          api.shake(16);
        }
        syncMusic(dt);
        if (over) { overT += dt; if (overT > 1.6) api.gameOver(); return; }
        if (phase === 'battle') checkWaveClear(dt);
        updateStatus();
      },

      render: function (ctx) {
        var s = sky(), i;
        drawSky(ctx, s, t, 0);
        drawSearchlights(ctx, s, t, [CITY_X[1], CITY_X[4]].filter(function (x, k) { return cities[k === 0 ? 1 : 4].hp > 0; }));
        drawSkyline(ctx, s);
        drawGround(ctx, s);
        for (i = 0; i < cities.length; i++) drawTower(ctx, cities[i].design, cities[i].hp, cities[i].x, s.night, t);
        drawChains(ctx, cities.map(function (c) { return c.hp; }), s.night);
        renderSilos(ctx);
        renderDebris(ctx, s.night);
        renderEnemies(ctx);
        for (i = 0; i < bombers.length; i++) {
          var b = bombers[i];
          drawBomber(ctx, b.x, b.y, b.dir, t, b.drops > 0 && b.dropT < 0.45 && b.x > 30 && b.x < W - 30);
        }
        renderInterceptors(ctx);
        ctx.save();
        // additive bloom reads well on a dark sky but washes out to white by day
        ctx.globalCompositeOperation = s.night >= 0.5 ? 'lighter' : 'source-over';
        for (i = 0; i < blasts.length; i++) drawBlast(ctx, blasts[i].x, blasts[i].y, blasts[i].r, blasts[i].t / blasts[i].life, blasts[i].hostile);
        for (i = 0; i < flashes.length; i++) {
          var f = flashes[i], k = f.t / f.life;
          ctx.strokeStyle = 'rgba(' + f.rgb + ',' + (1 - k) + ')'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.4 + k), 0, TAU); ctx.stroke();
        }
        ctx.restore();
        if (phase === 'battle' && !over) renderCrosshair(ctx);
        renderBanner(ctx);
        if (phase === 'tally' && tally) renderTally(ctx);
        if (phase === 'shop' && shop) renderShop(ctx);
        renderCorner(ctx);
      }
    };

    /* ====================================================== render parts */
    function renderSilos(ctx) {
      silos.forEach(function (s, i) {
        ctx.save();
        // mound
        ctx.fillStyle = s.alive ? '#1c2c5c' : '#1a1a24';
        ctx.strokeStyle = s.alive ? '#6d8cff' : '#3a3a4a'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(s.x - 24, GROUND); ctx.lineTo(s.x - 11, GROUND - 16); ctx.lineTo(s.x + 11, GROUND - 16); ctx.lineTo(s.x + 24, GROUND); ctx.closePath();
        ctx.fill(); ctx.stroke();
        if (s.alive) {
          // hatch
          ctx.fillStyle = s.ammo > 0 ? '#cfe0ff' : '#ff6b6b';
          ctx.fillRect(s.x - 5, GROUND - 18, 10, 2);
          // ammo pips stacked in rows of five below the ground line
          for (var a = 0; a < s.ammo; a++) {
            var row = Math.floor(a / 5), col = a % 5;
            ctx.fillStyle = row % 2 ? '#a9c1ff' : '#e3ecff';
            ctx.fillRect(s.x - 16 + col * 7, GROUND + 6 + row * 7, 4, 5);
          }
          if (s.ammo === 0 && phase === 'battle') label(ctx, 'EMPTY', s.x, GROUND + 14, 8, '#ff6b6b');
        } else {
          ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(s.x, GROUND - 6, 12, 4, 0, 0, TAU); ctx.fill();
          label(ctx, 'OFFLINE', s.x, GROUND + 14, 8, '#6b6b80');
        }
        label(ctx, ['Z', 'X', 'C'][i], s.x, GROUND - 24, 9, 'rgba(200,210,255,0.45)');
        ctx.restore();
      });
      // auto-turret on the centre silo
      if (upg.turret) {
        var ox = SILO_X[1], oy = GROUND - 26;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = silos[1].alive ? '#2b3d7a' : '#222'; ctx.strokeStyle = silos[1].alive ? GOLD : '#444';
        ctx.beginPath(); ctx.arc(0, 4, 6, Math.PI, 0); ctx.fill(); ctx.stroke();
        ctx.rotate(turret.ang);
        ctx.fillStyle = silos[1].alive ? GOLD : '#444'; ctx.fillRect(0, -1.5, 11, 3);
        ctx.restore();
        for (var p = 0; p < upg.turret; p++) { ctx.fillStyle = GOLD; ctx.fillRect(ox + 8 + p * 4, oy + 2, 2, 2); }
      }
    }
    function renderDebris(ctx, night) {
      var smoke = night > 0.5 ? '150,150,165' : '52,52,60';
      for (var i = 0; i < debris.length; i++) {
        var d = debris[i], a = d.life / d.max;
        if (d.type === 'smoke') {
          ctx.fillStyle = 'rgba(' + smoke + ',' + 0.35 * a + ')';
          ctx.beginPath(); ctx.arc(d.x, d.y, d.s / 2, 0, TAU); ctx.fill();
        }
        else if (d.type === 'ember') { ctx.fillStyle = 'rgba(255,' + Math.round(120 + 100 * a) + ',60,' + a + ')'; ctx.fillRect(d.x, d.y, 1.5, 1.5); }
        else { ctx.fillStyle = 'rgba(120,130,140,' + a + ')'; ctx.fillRect(d.x - 1, d.y - 1, 2.5, 2.5); }
      }
    }
    function renderEnemies(ctx) {
      ctx.save();
      // spent splitter trails linger and fade
      ctx.lineWidth = 2;
      for (var gi = 0; gi < ghosts.length; gi++) {
        var gh = ghosts[gi], ga = 0.85 * (1 - gh.t / gh.life);
        var gg = ctx.createLinearGradient(gh.sx, gh.sy, gh.x, gh.y);
        gg.addColorStop(0, 'rgba(' + gh.rgb + ',0)'); gg.addColorStop(1, 'rgba(' + gh.rgb + ',' + ga + ')');
        ctx.strokeStyle = gg;
        ctx.beginPath(); ctx.moveTo(gh.sx, gh.sy); ctx.lineTo(gh.x, gh.y); ctx.stroke();
      }
      for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i], k = KINDS[e.kind];
        if (e.hist) {
          // curved trail for smart bombs, faded in four bands
          var h = e.hist, n = h.length / 2;
          ctx.lineWidth = 2;
          for (var band = 0; band < 4; band++) {
            var from = Math.floor(n * band / 4), to = Math.min(n - 1, Math.floor(n * (band + 1) / 4));
            if (to <= from) continue;
            ctx.strokeStyle = 'rgba(' + k.rgb + ',' + (0.12 + band * 0.18) + ')';
            ctx.beginPath(); ctx.moveTo(h[from * 2], h[from * 2 + 1]);
            for (var j = from + 1; j <= to; j++) ctx.lineTo(h[j * 2], h[j * 2 + 1]);
            if (band === 3) ctx.lineTo(e.x, e.y);
            ctx.stroke();
          }
        } else {
          var gr = ctx.createLinearGradient(e.sx, e.sy, e.x, e.y);
          gr.addColorStop(0, 'rgba(' + k.rgb + ',0)');
          gr.addColorStop(1, 'rgba(' + k.rgb + ',0.85)');
          ctx.strokeStyle = gr;
          ctx.lineWidth = e.kind === 'dart' ? 1 : e.kind === 'mirv' ? 2.2 : 1.5;
          ctx.beginPath(); ctx.moveTo(e.sx, e.sy); ctx.lineTo(e.x, e.y); ctx.stroke();
        }
        var blink = e.kind === 'mirv' ? U.clamp(1 - (e.splitY - e.y) / 90, 0, 1) : 0;
        drawHead(ctx, e.kind, e.x, e.y, t, blink, e.vx, e.vy);
      }
      ctx.restore();
    }
    function renderInterceptors(ctx) {
      ctx.save();
      ctx.lineWidth = 1.5;
      for (var i = 0; i < interceptors.length; i++) {
        var m = interceptors[i];
        var col = m.turret ? '255,210,63' : '57,255,136';
        var gr = ctx.createLinearGradient(m.sx, m.sy, m.x, m.y);
        gr.addColorStop(0, 'rgba(' + col + ',0.1)'); gr.addColorStop(1, 'rgba(' + col + ',0.8)');
        ctx.strokeStyle = gr;
        ctx.beginPath(); ctx.moveTo(m.sx, m.sy); ctx.lineTo(m.x, m.y); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(m.x - 1.5, m.y - 1.5, 3, 3);
        if (Math.floor(t * 12) % 2 || m.turret) {
          ctx.strokeStyle = 'rgba(' + col + ',0.6)';
          ctx.beginPath(); ctx.moveTo(m.tx - 4, m.ty - 4); ctx.lineTo(m.tx + 4, m.ty + 4); ctx.moveTo(m.tx + 4, m.ty - 4); ctx.lineTo(m.tx - 4, m.ty + 4); ctx.stroke();
        }
      }
      ctx.restore();
    }
    function renderCrosshair(ctx) {
      var si = nearestSilo(aim.x);
      ctx.save();
      // faint guide from the silo that would fire
      if (si >= 0) {
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = 'rgba(57,255,136,0.18)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(SILO_X[si], GROUND - 16); ctx.lineTo(aim.x, aim.y); ctx.stroke();
        ctx.setLineDash([]);
      }
      var col = si >= 0 ? ACCENT : '#ff6b6b';
      var r = 9 + Math.sin(t * 6) * 1;
      ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.shadowColor = col; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(aim.x, aim.y, r, 0, TAU);
      ctx.moveTo(aim.x - 16, aim.y); ctx.lineTo(aim.x - 5, aim.y);
      ctx.moveTo(aim.x + 5, aim.y); ctx.lineTo(aim.x + 16, aim.y);
      ctx.moveTo(aim.x, aim.y - 16); ctx.lineTo(aim.x, aim.y - 5);
      ctx.moveTo(aim.x, aim.y + 5); ctx.lineTo(aim.x, aim.y + 16);
      ctx.stroke();
      ctx.shadowBlur = 0;
      // blast-size preview ring
      ctx.strokeStyle = 'rgba(255,210,63,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(aim.x, aim.y, blastMax(), 0, TAU); ctx.stroke();
      ctx.restore();
    }
    function renderBanner(ctx) {
      if (banner.t > 0 && phase === 'battle') {
        ctx.save();
        ctx.globalAlpha = Math.min(1, banner.t * 2);
        U.glowText(ctx, banner.a, W / 2, 180, 20, ACCENT);
        if (banner.kind) {
          U.glowText(ctx, banner.b, W / 2, 214, 12, 'rgb(' + KINDS[banner.kind].rgb + ')');
          if (banner.kind === 'bomber') drawBomber(ctx, W / 2, 246, 1, t, Math.floor(t * 2) % 2 === 0);
          else drawHead(ctx, banner.kind, W / 2, 246, t, banner.kind === 'mirv' ? (t * 0.7) % 1 : 0, 0.3, 1);
          label(ctx, banner.c, W / 2, 276, 10, '#e6ecff');
        } else {
          label(ctx, banner.b, W / 2, 210, 10, 'rgba(230,236,255,0.75)');
        }
        ctx.restore();
      }
      if (hintT > 0 && wave === 1 && phase === 'battle') {
        ctx.save();
        ctx.globalAlpha = Math.min(1, hintT);
        label(ctx, 'CLICK / TAP THE SKY TO FIRE', W / 2, 330, 11, '#e6ecff');
        label(ctx, 'BLASTS HANG IN THE AIR - AIM AHEAD', W / 2, 348, 9, 'rgba(230,236,255,0.7)');
        ctx.restore();
      }
    }
    function panel(ctx, x, y, w, h, edge) {
      ctx.save();
      ctx.fillStyle = 'rgba(4,8,20,0.86)';
      U.roundRect(ctx, x, y, w, h, 10); ctx.fill();
      ctx.strokeStyle = edge; ctx.lineWidth = 1.5; ctx.shadowColor = edge; ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }
    function renderTally(ctx) {
      var m = waveMul();
      panel(ctx, 70, 150, 340, 200, GOLD);
      U.glowText(ctx, 'WAVE ' + wave + ' CLEAR', W / 2, 180, 16, GOLD);
      ctx.save();
      label(ctx, 'TOWERS SAVED', 96, 222, 11, '#e6ecff', 'left');
      label(ctx, tally.towers + ' x ' + TALLY.towerPts * m, 384, 222, 11, ACCENT, 'right');
      // little tower pips for the ones counted so far
      for (var i = 0; i < tally.towers; i++) { ctx.fillStyle = ACCENT; ctx.fillRect(96 + i * 12, 232, 8, 8); }
      label(ctx, 'AMMO LEFT', 96, 258, 11, '#e6ecff', 'left');
      label(ctx, tally.ammo + ' x ' + TALLY.ammoPts * m, 384, 258, 11, '#cfe0ff', 'right');
      if (tally.perfect) label(ctx, 'PERFECT DEFENCE  +' + TALLY.perfectPts * m, W / 2, 284, 11, GOLD);
      label(ctx, 'BONUS  ' + U.fmt(tally.pts), 96, 316, 12, '#fff', 'left');
      label(ctx, '+' + tally.cr + ' CR', 384, 316, 12, GOLD, 'right');
      label(ctx, 'CLICK TO SKIP', W / 2, 338, 8, 'rgba(230,236,255,0.45)');
      ctx.restore();
    }
    function shopRow(i) { return { x: 56, y: 170 + i * 46, w: 368, h: 40 }; }
    function renderShop(ctx) {
      panel(ctx, 40, 96, 400, 400, ACCENT);
      U.glowText(ctx, 'SUPPLY DEPOT', W / 2, 124, 16, ACCENT);
      label(ctx, 'CREDITS  ' + credits, W / 2, 150, 12, GOLD);
      ctx.save();
      for (var i = 0; i <= UPGRADES.length; i++) {
        var r = shopRow(i), sel = shop.sel === i;
        var flash = shop.flash === i && shop.flashT > 0;
        ctx.fillStyle = flash ? 'rgba(255,255,255,0.18)' : sel ? 'rgba(57,255,136,0.12)' : 'rgba(255,255,255,0.03)';
        U.roundRect(ctx, r.x, r.y, r.w, r.h, 6); ctx.fill();
        if (sel) { ctx.strokeStyle = ACCENT; ctx.lineWidth = 1; ctx.stroke(); }
        if (i === UPGRADES.length) {
          var left = Math.ceil(shop.t);
          label(ctx, '[SPACE]  CONTINUE TO WAVE ' + (wave + 1), W / 2, r.y + 15, 11, '#fff');
          ctx.fillStyle = 'rgba(57,255,136,0.18)'; ctx.fillRect(r.x + 20, r.y + 28, r.w - 40, 4);
          ctx.fillStyle = ACCENT; ctx.fillRect(r.x + 20, r.y + 28, (r.w - 40) * Math.max(0, shop.t / SHOP_TIME), 4);
          label(ctx, left + 's', r.x + r.w - 10, r.y + 15, 9, 'rgba(230,236,255,0.6)', 'right');
          continue;
        }
        var u = UPGRADES[i], st = upgradeState(u);
        var dim = st === 'na' || st === 'max';
        // key badge
        ctx.strokeStyle = dim ? '#555c70' : '#cfe0ff'; ctx.lineWidth = 1;
        ctx.strokeRect(r.x + 8.5, r.y + 10.5, 18, 18);
        label(ctx, String(i + 1), r.x + 17.5, r.y + 20, 10, dim ? '#555c70' : '#fff');
        label(ctx, u.name, r.x + 36, r.y + 14, 11, dim ? '#6b7390' : '#fff', 'left');
        label(ctx, u.desc, r.x + 36, r.y + 29, 8, 'rgba(200,210,240,0.6)', 'left');
        // level pips (rebuild shows how many were bought instead)
        if (u.id !== 'rebuild') {
          for (var p = 0; p < u.max; p++) {
            ctx.fillStyle = p < upg[u.id] ? ACCENT : 'rgba(255,255,255,0.14)';
            ctx.fillRect(r.x + 236 + p * 10, r.y + 16, 7, 7);
          }
        } else {
          var hurt = cities.filter(function (c) { return c.hp < TOWER_HP; }).length;
          label(ctx, hurt ? hurt + ' NEED WORK' : 'ALL STANDING', r.x + 262, r.y + 20, 9, hurt ? '#ff9a3c' : 'rgba(200,210,240,0.6)');
        }
        var costTxt = st === 'max' ? 'MAX' : st === 'na' ? 'ALL OK' : upgradeCost(u) + ' CR';
        label(ctx, costTxt, r.x + r.w - 10, r.y + 20, 11, st === 'ok' ? GOLD : st === 'poor' ? '#ff6b6b' : '#6b7390', 'right');
      }
      label(ctx, 'CREDITS ARE SEPARATE FROM SCORE - SPENDING NEVER COSTS POINTS', W / 2, 484, 7, 'rgba(200,210,240,0.45)');
      ctx.restore();
    }
    function renderCorner(ctx) {
      if (phase === 'shop') return;
      ctx.save();
      label(ctx, 'W' + wave, 10, 14, 10, 'rgba(230,236,255,0.6)', 'left');
      label(ctx, credits + ' CR', W - 10, 14, 10, GOLD, 'right');
      ctx.restore();
    }
  }

  /* ================================================================ attract
     A slow day -> night cycle over the skyline, warheads falling, blasts
     catching them and a bomber crossing now and then.                    */
  function attract(ctx, w, h, t) {
    ctx.fillStyle = '#040818';
    ctx.fillRect(0, 0, w, h);
    var k = w / W;
    var yTop = H - h / k;                       // playfield y at the top of the cabinet screen
    ctx.save();
    ctx.translate(0, h - H * k);
    ctx.scale(k, k);
    var cyc = (t * 0.06) % SKY.length, i0 = Math.floor(cyc);
    var s = mixSky(SKY[i0], SKY[(i0 + 1) % SKY.length], ease(cyc - i0));
    drawSky(ctx, s, t, yTop);
    drawSearchlights(ctx, s, t, [CITY_X[1], CITY_X[4]]);
    drawSkyline(ctx, s);
    drawGround(ctx, s);
    for (var c = 0; c < CITY_X.length; c++) drawTower(ctx, c, c === 2 ? 1 : c === 4 ? 0 : TOWER_HP, CITY_X[c], s.night, t);
    drawChains(ctx, CITY_X.map(function (x, c) { return c === 2 ? 1 : c === 4 ? 0 : TOWER_HP; }), s.night);
    // warheads and the blasts that meet them
    ctx.save();
    for (var i = 0; i < 5; i++) {
      var p = (t * 0.22 + i * 0.21) % 1, pe = Math.min(p, 0.55);
      var sx = 40 + i * 100, tx = CITY_X[(i * 2 + 1) % 6];
      var x = sx + (tx - sx) * pe, y = yTop + (GROUND - yTop) * pe;
      ctx.globalAlpha = p > 0.55 ? Math.max(0, 1 - (p - 0.55) * 4) : 1;
      var kind = i === 1 ? 'mirv' : i === 3 ? 'smart' : 'warhead';
      var col = KINDS[kind].rgb;
      var gr = ctx.createLinearGradient(sx, yTop, x, y);
      gr.addColorStop(0, 'rgba(' + col + ',0)'); gr.addColorStop(1, 'rgba(' + col + ',0.85)');
      ctx.strokeStyle = gr; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(sx, yTop); ctx.lineTo(x, y); ctx.stroke();
      if (p < 0.55) drawHead(ctx, kind, x, y, t, kind === 'mirv' ? p / 0.55 : 0, tx - sx, GROUND);
      if (p > 0.5 && p < 0.72) {
        ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = s.night >= 0.5 ? 'lighter' : 'source-over';
        drawBlast(ctx, sx + (tx - sx) * 0.55, yTop + (GROUND - yTop) * 0.55, 34 * Math.sin((p - 0.5) / 0.22 * Math.PI), (p - 0.5) / 0.22, false);
        ctx.restore();
      }
    }
    ctx.restore();
    var bp = (t * 0.08) % 1.6;
    if (bp < 1) drawBomber(ctx, -30 + bp * (W + 60), yTop + 50, 1, t, false);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_block_defence',
    order: 12,
    title: 'Chain Sentinel',
    tagline: 'Shield the towers. Blast the warheads.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'TAP THE SKY TO FIRE AN INTERCEPTOR THERE',
    controls: 'Click to fire \u00b7 or arrows to aim, Space / Z X C to fire \u00b7 1-5 buy in the depot',
    create: create,
    attract: attract
  });
})(window);

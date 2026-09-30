/*
 * Xtrata Arcade cartridge #14 - INVADER WAVE (v2)
 * A marching formation of pixel invaders speeds up as it thins out. Hide
 * behind bunkers that crumble pixel by pixel, shoot the mystery ship for
 * power-ups and clear every wave before it lands.
 *
 *   formations  a readable data table (block, chevron, diamond, split
 *               columns, stagger, fortress, wings, swarm) that loops harder
 *   enemy kinds GRUNT (march + shoot), DIVER (breaks ranks, swoops, returns),
 *               SHIELDED (front shield soaks hits), SPLITTER (breaks into two
 *               minis), BOMBER (slow, wide bunker-busting bombs)
 *   power-ups   DOUBLE / TRIPLE shot, RAPID fire, PIERCING laser, SHIELD,
 *               WINGMAN drone - dropped by the mystery ship and the boss
 *   boss        every 5th wave a MOTHERSHIP: two gun pods guard its core;
 *               bullet fans, diving escorts and a telegraphed sweeping laser
 *   look        CRT: cached glowing pixel sprites, scanlines, vignette,
 *               starfield, pixel explosions, screen flashes
 * Contract game-id: xa_invader_wave (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-invader-wave');
  var U = XA.util;
  var M = function () { return XA.music; };
  var TAU = Math.PI * 2;

  /* ================================================================ playfield */
  var W = 480, H = 560;
  var PY = 522;               // cannon centre line
  var GROUND = 540;           // ground line; the lives strip sits below it
  var COLS = 11;              // every formation map is 11 columns wide
  var CW = 34, CH = 30;       // formation cell size
  var PIX = 3;                // screen pixels per sprite pixel
  var FORM_TOP = 76;          // first row of a fresh formation
  var FORM_LOWEST = 300;      // a fresh formation's bottom row never starts below this
  var UFO_Y = 50;
  var BUNKER_Y = 436, BUNKER_CELL = 2, BUNKER_COLS = 22, BUNKER_ROWS = 16;
  var BW = BUNKER_COLS * BUNKER_CELL, BH = BUNKER_ROWS * BUNKER_CELL;
  var PLAYER_SPEED = 260, SHOT_SPEED = 560;
  var FIRE_CD = 0.3, RAPID_CD = 0.12, RESPAWN_INV = 2.2;
  var BOSS_EVERY = 5;
  var MAX_BITS = 700;

  var ACCENT = '#39ff88';     // cannon, bunkers, cartridge colour
  var UFO_C = '#ff4fd8';
  var ZIG_C = '#ff9f1c';      // classic zig-zag bombs
  var WIDE_C = '#ff5a4f';     // bomber bombs
  var ORB_C = '#ff3b6b';      // boss bullet fans
  var LASER_C = '#ff2d55';
  var SHIELD_C = '#bff7ff';
  var HULL_C = '#9b8cff', POD_C = '#ffb347', STEEL_C = '#5d6488';

  /* ===================================================================== art
     Pixel sprites as ASCII ('#' lit, '.' empty), two frames each so the
     march animates. All original designs. */
  var ART = {
    gruntA: [[
      '#..##..#',
      '.######.',
      '##.##.##',
      '########',
      '.##..##.',
      '..####..',
      '.#.##.#.',
      '#......#'
    ], [
      '...##...',
      '.######.',
      '##.##.##',
      '########',
      '#.#..#.#',
      '..####..',
      '.#.##.#.',
      '.#....#.'
    ]],
    gruntB: [[
      '.#......#.',
      '..#....#..',
      '.########.',
      '##.####.##',
      '##########',
      '.########.',
      '.#.#..#.#.',
      '#........#'
    ], [
      '#........#',
      '.#......#.',
      '.########.',
      '##.####.##',
      '##########',
      '.########.',
      '..#....#..',
      '.#.#..#.#.'
    ]],
    gruntC: [[
      '...####...',
      '.########.',
      '##########',
      '##..##..##',
      '##########',
      '..##..##..',
      '.##.##.##.',
      '##......##'
    ], [
      '...####...',
      '.########.',
      '##########',
      '##..##..##',
      '##########',
      '...#..#...',
      '..#.##.#..',
      '...#..#...'
    ]],
    diver: [[
      '#........#',
      '##......##',
      '.##.##.##.',
      '..######..',
      '...####...',
      '..#.##.#..',
      '.#..##..#.',
      '....##....'
    ], [
      '..........',
      '#........#',
      '##.####.##',
      '.########.',
      '...####...',
      '...#..#...',
      '..#.##.#..',
      '....##....'
    ]],
    shielded: [[
      '.########.',
      '##########',
      '#.##..##.#',
      '##########',
      '.#.####.#.',
      '.########.',
      '..#....#..',
      '.##....##.'
    ], [
      '.########.',
      '##########',
      '#.##..##.#',
      '##########',
      '.#.####.#.',
      '.########.',
      '.#......#.',
      '##......##'
    ]],
    splitter: [[
      '.###..###.',
      '####..####',
      '#.##..##.#',
      '####..####',
      '.###..###.',
      '..#....#..',
      '.#.#..#.#.',
      '#........#'
    ], [
      '.###..###.',
      '####..####',
      '##.#..#.##',
      '####..####',
      '.###..###.',
      '..#....#..',
      '..#....#..',
      '.#......#.'
    ]],
    mini: [[
      '.###.',
      '#.#.#',
      '#####',
      '.#.#.',
      '#...#'
    ], [
      '.###.',
      '#.#.#',
      '#####',
      '.#.#.',
      '.#.#.'
    ]],
    bomber: [[
      '..######..',
      '.########.',
      '##.####.##',
      '##########',
      '.#.####.#.',
      '..#.##.#..',
      '.#..##..#.',
      '..........'
    ], [
      '..######..',
      '.########.',
      '##.####.##',
      '##########',
      '.#.#..#.#.',
      '..#....#..',
      '.#......#.',
      '..........'
    ]],
    cannon: [[
      '.....#.....',
      '....###....',
      '....###....',
      '.#########.',
      '###########',
      '###########',
      '##.#####.##'
    ]],
    drone: [[
      '...#...',
      '..###..',
      '.#####.',
      '##.#.##',
      '#.....#'
    ]],
    ufo: [[
      '.....######.....',
      '...##########...',
      '..############..',
      '.##.##.##.##.##.',
      '################',
      '..###..##..###..',
      '...#........#...'
    ], [
      '.....######.....',
      '...##########...',
      '..############..',
      '.#.##.##.##.##.#',
      '################',
      '..###..##..###..',
      '...#........#...'
    ]],
    pod: [[
      '.####.',
      '######',
      '#.##.#',
      '######',
      '.#..#.'
    ]],
    coreShut: [[
      '.####.',
      '#.##.#',
      '######',
      '######',
      '#.##.#',
      '.####.'
    ]],
    coreEye: [[
      '.####.',
      '######',
      '##..##',
      '##..##',
      '######',
      '.####.'
    ]]
  };
  // The mothership hull is symmetric: only the left half is written out.
  var HULL_HALF = [
    '..........######',
    '.......#########',
    '.....###########',
    '...#############',
    '..###.###.###.##',
    '################',
    '################',
    '.##.##.#########',
    '..#..#..########',
    '.........#######',
    '..........#.####',
    '...........#.###'
  ];
  ART.hull = [HULL_HALF.map(function (r) { return r + r.split('').reverse().join(''); })];

  function artW(name) { return ART[name][0][0].length; }
  function artH(name) { return ART[name][0].length; }

  /* ============================================================= enemy kinds
     Each kind: art, colour, base points, and the line shown when it first
     appears. Grunts come in three looks chosen by their row. */
  var KINDS = {
    g: { name: 'GRUNT', blurb: 'MARCHES AND SHOOTS', variants: [
      { art: 'gruntA', c: '#ff3fa4', pts: 30 },
      { art: 'gruntB', c: '#b04dff', pts: 20 },
      { art: 'gruntC', c: '#3ff0ff', pts: 10 }
    ] },
    d: { name: 'DIVER', blurb: 'BREAKS RANKS AND SWOOPS', art: 'diver', c: '#ffd23f', pts: 40 },
    s: { name: 'SHIELDED', blurb: 'FRONT SHIELD SOAKS HITS', art: 'shielded', c: '#6f8bff', pts: 50, shield: 2 },
    p: { name: 'SPLITTER', blurb: 'BREAKS INTO TWO', art: 'splitter', c: '#ff9f1c', pts: 40 },
    b: { name: 'BOMBER', blurb: 'WIDE BOMBS BUST BUNKERS', art: 'bomber', c: '#ff5a4f', pts: 60 },
    m: { name: 'MINI', blurb: '', art: 'mini', c: '#ffc27a', pts: 20 }
  };
  function lookOf(kind, variant) {
    var K = KINDS[kind];
    return K.variants ? K.variants[variant || 0] : K;
  }

  /* ============================================================== formations
     One row per string, one column per character (11 wide):
       g grunt   d diver   s shielded   p splitter   b bomber   . empty
     Waves 5, 10, 15... are the mothership; the table loops (harder) after. */
  var WAVES = [
    { name: 'BLOCK', map: [
      'ggggggggggg',
      'ggggggggggg',
      'ggggggggggg',
      'ggggggggggg',
      'ggggggggggg'
    ] },
    { name: 'CHEVRON', map: [
      'dd.......dd',
      'ggg.....ggg',
      '.ggg...ggg.',
      '..ggg.ggg..',
      '...ggggg...',
      '....ggg....'
    ] },
    { name: 'DIAMOND', map: [
      '.....g.....',
      '....ggg....',
      '...ggdgg...',
      '..ggggggg..',
      '...sssss...',
      '....sss....',
      '.....s.....'
    ] },
    { name: 'SPLIT COLUMNS', map: [
      'pp..ppp..pp',
      'gg..ggg..gg',
      'gg..ggg..gg',
      'dd..sgs..dd',
      'gg..ggg..gg'
    ] },
    { name: 'STAGGER', map: [
      'b.b.b.b.b.b',
      '.g.g.g.g.g.',
      'g.p.g.p.g.p',
      '.s.s.s.s.s.',
      'g.g.g.g.g.g'
    ] },
    { name: 'FORTRESS', map: [
      '..bb...bb..',
      '.dggg.gggd.',
      'sssssssssss',
      'ggggggggggg',
      'ppppppppppp'
    ] },
    { name: 'WINGS', map: [
      'd.........d',
      'gg.ppppp.gg',
      'ggg.bbb.ggg',
      '.ggg.s.ggg.',
      '..sss.sss..'
    ] },
    { name: 'SWARM', map: [
      'ddd.....ddd',
      'ggggbbbgggg',
      'ppgggggggpp',
      'sgsgsgsgsgs',
      'ggggggggggg',
      'ggggggggggg'
    ] }
  ];

  /* ================================================================ power-ups
     time 0 = lasts until used (shield). DOUBLE and TRIPLE replace each other.
     jingle = scale degrees played in key when collected. */
  var POWERS = {
    double: { label: '2X', name: 'DOUBLE SHOT', c: '#ffd23f', time: 14, weight: 3, jingle: [0, 4], inst: 'pluck' },
    triple: { label: '3X', name: 'TRIPLE SHOT', c: '#ff9f1c', time: 11, weight: 2, jingle: [0, 2, 4], inst: 'pluck' },
    rapid: { label: 'R', name: 'RAPID FIRE', c: '#ff3fa4', time: 12, weight: 3, jingle: [4, 5, 4, 7], inst: 'arp' },
    pierce: { label: 'P', name: 'PIERCING LASER', c: '#c77dff', time: 9, weight: 2, jingle: [0, 7, 9], inst: 'lead' },
    shield: { label: 'S', name: 'SHIELD', c: '#3ff0ff', time: 0, weight: 3, jingle: [0, 4, 7], inst: 'bell' },
    drone: { label: 'W', name: 'WINGMAN', c: '#39ff88', time: 16, weight: 2, jingle: [7, 4, 7, 9], inst: 'marimba' }
  };
  var POWER_ORDER = ['double', 'triple', 'rapid', 'pierce', 'drone', 'shield'];

  /* ============================================================== mothership
     Phase 1: two gun pods (weak points) fire bullet fans; escorts dive.
     Phase 2: pods gone, the core opens; sweeping laser joins the fans.
     Phase 3: core under half health; everything faster and wider.
     Fan gaps stay wider than the cannon so a fan is always dodgeable. */
  var BOSS_PIX = 5;
  var HULL_W = 32 * BOSS_PIX, HULL_H = 12 * BOSS_PIX;
  var BOSS_Y = 118, POD_DX = 56, POD_DY = 26, CORE_DY = 16, CORE_R = 14;
  var LASER_MOVE = 0.8, LASER_TELE = 1.3, LASER_FIRE = 2.2, LASER_COOL = 0.5, LASER_HALF = 9;
  var BOSS_PHASES = [null,
    { name: 'MOTHERSHIP', sub: 'DESTROY THE GUN PODS', fanEvery: 1.9, fanN: 5, fanSpread: 0.7, fanSpeed: 150,
      escortEvery: 8, escortN: 2, laserEvery: 0, laserReach: 0, sway: 0.55, bpm: 128, intensity: 0.3 },
    { name: 'CORE EXPOSED', sub: 'SHOOT THE CORE', fanEvery: 2.4, fanN: 7, fanSpread: 1.1, fanSpeed: 160,
      escortEvery: 10, escortN: 2, laserEvery: 6.5, laserReach: 0.52, sway: 0.7, bpm: 136, intensity: 0.65 },
    { name: 'OVERLOAD', sub: 'FINISH IT', fanEvery: 1.6, fanN: 9, fanSpread: 1.5, fanSpeed: 170,
      escortEvery: 7, escortN: 3, laserEvery: 5, laserReach: 0.6, sway: 0.9, bpm: 148, intensity: 1 }
  ];

  /* =================================================================== music
     F minor synth march. The bass walks four steps down every bar and its
     tempo follows the formation - fewer invaders, faster march. The mystery
     ship forces a wobbling siren; each cleared wave lifts the key. */
  var KEY = 53;
  function keyFor(w) { var k = w % 6; return KEY + k * 2 - (k > 3 ? 12 : 0); }
  function song(key) {
    return {
      bpm: 96, key: key, scale: 'minor', chords: [0, 0, 5, 4], seed: 14,
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
  // Mothership: same key, harmonic minor, the march bass now a machine. The
  // 'laser' track is forced on while the sweep is telegraphed and firing.
  function bossSong(n, key) {
    return {
      bpm: 128, key: key, scale: 'harmonic', chords: [0, 0, 5, 4], seed: 1400 + n,
      tracks: [
        { name: 'kick', inst: 'kick', layer: 0, gain: 0.75, pattern: 'X...x...X...x.x.' },
        { name: 'bass', inst: 'bass', layer: 0, gain: 0.42, chord: true, octave: -2, params: { cutoff: 1000, q: 9 },
          pattern: '0 0 ^0 0 0 0 ^0 0 0 0 ^0 0 -1 0 1 0' },
        { name: 'march', inst: 'sub', layer: 0, gain: 0.4, chord: true, octave: -2, rate: 4, pattern: '0 -1 -2 -3' },
        { name: 'snare', inst: 'snare', layer: 0.25, gain: 0.4, pattern: '....X.......X..x' },
        { name: 'hat', inst: 'hat', layer: 0.25, gain: 0.3, pattern: 'x.x.x.x.x.x.xxx.' },
        { name: 'alarm', inst: 'lead', layer: 0.5, gain: 0.22, octave: 1, params: { wave: 'sawtooth', cutoff: 2400 },
          pattern: '4 - 3 - 4 - . . 4 - 6 - 4 - 3 -' },
        { name: 'stab', inst: 'pluck', layer: 0.7, gain: 0.28, chord: true, octave: 1, rate: 2,
          fn: function (i) { return i.rng() < 0.35 ? { deg: [0, 2, 4, 7][Math.floor(i.rng() * 4)] } : null; } },
        { name: 'pad', inst: 'pad', layer: 0.9, gain: 0.3, chord: true, params: { cutoff: 1600, attack: 0.2 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        { name: 'laser', inst: 'lead', layer: 2, gain: 0.2, octave: 2, params: { wave: 'sine', cutoff: 4000 },
          fn: function (i) { return i.stepInBar % 2 === 0 ? { deg: (i.stepInBar >> 1) % 2 ? 7 : 6, steps: 2 } : null; } }
      ]
    };
  }

  /* ===================================================== sprite + CRT caches
     Every sprite is drawn once to an offscreen canvas, with a pre-blurred
     glow copy, so a frame is just drawImage calls (no per-frame shadowBlur). */
  var sprCache = {};
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  function sprite(name, frame, color, px) {
    px = px || PIX;
    var frames = ART[name], f = (frame || 0) % frames.length;
    var key = name + '|' + f + '|' + color + '|' + px;
    var s = sprCache[key];
    if (s) return s;
    var rows = frames[f], w = rows[0].length * px, h = rows.length * px, pad = Math.ceil(px * 3);
    var img = makeCanvas(w, h), g = img.getContext('2d');
    for (var y = 0; y < rows.length; y++) {
      for (var x = 0; x < rows[y].length; x++) {
        if (rows[y].charAt(x) !== '#') continue;
        g.fillStyle = color; g.fillRect(x * px, y * px, px, px);
        // phosphor highlight on the top edge of each lit pixel
        g.fillStyle = 'rgba(255,255,255,0.28)'; g.fillRect(x * px, y * px, px, Math.max(1, Math.round(px / 3)));
      }
    }
    var glow = makeCanvas(w + pad * 2, h + pad * 2), gg = glow.getContext('2d');
    gg.shadowColor = color; gg.shadowBlur = px * 3.2;
    gg.drawImage(img, pad, pad); gg.drawImage(img, pad, pad);
    s = { img: img, glow: glow, w: w, h: h, pad: pad };
    sprCache[key] = s;
    return s;
  }
  // Draw a cached sprite (optionally scaled by k) with its additive glow.
  function blit(ctx, s, x, y, glowA, k, alpha) {
    k = k || 1;
    var a = alpha == null ? 1 : alpha;
    x = Math.round(x); y = Math.round(y);
    if (glowA > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = glowA * a;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(s.glow, x - s.pad * k, y - s.pad * k, s.glow.width * k, s.glow.height * k);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = a;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s.img, x, y, s.w * k, s.h * k);
    ctx.globalAlpha = 1;
  }
  function roundPath(g, x, y, w, h, r) {
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  // Scanlines + vignette + rounded dark bezel (reads as curved glass).
  var crtCache = {}, crtCount = 0;
  function crtOverlay(w, h) {
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    var key = w + 'x' + h, c = crtCache[key];
    if (c) return c;
    if (++crtCount > 8) { crtCache = {}; crtCount = 1; }
    c = makeCanvas(w, h);
    var g = c.getContext('2d');
    g.fillStyle = 'rgba(0,0,0,0.26)';
    for (var y = 0; y < h; y += 3) g.fillRect(0, y + 2, w, 1);
    var v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.76);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.62)');
    g.fillStyle = v; g.fillRect(0, 0, w, h);
    var r = Math.min(w, h) * 0.06;
    g.beginPath(); g.rect(0, 0, w, h); roundPath(g, 2, 2, w - 4, h - 4, r);
    g.fillStyle = '#000'; g.fill('evenodd');
    var sh = g.createLinearGradient(0, 0, 0, h * 0.22);
    sh.addColorStop(0, 'rgba(255,255,255,0.05)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(0, 0, w, h * 0.22);
    crtCache[key] = c;
    return c;
  }

  // Soft horizontal refresh band that rolls down the tube.
  var bandCanvas = null;
  function rollBand() {
    if (bandCanvas) return bandCanvas;
    bandCanvas = makeCanvas(4, 64);
    var g = bandCanvas.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, 'rgba(200,255,230,0)'); gr.addColorStop(0.5, 'rgba(200,255,230,0.035)'); gr.addColorStop(1, 'rgba(200,255,230,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 64);
    return bandCanvas;
  }

  /* ================================================================= bunkers
     A bunker is a 22x16 grid of 2px cells: shoulders rounded, arch below. */
  function bunkerSolid(cx, cy) {
    if (cy < 4 && (cx < 4 - cy || cx > BUNKER_COLS - 1 - (4 - cy))) return false;
    var ax = (cx + 0.5 - BUNKER_COLS / 2) / 5, ay = (cy + 0.5 - BUNKER_ROWS) / 7;
    return ax * ax + ay * ay >= 1;
  }
  function paintBunkerCell(g, cx, cy) {
    g.fillStyle = (cx * 3 + cy * 5) % 11 === 0 ? '#9dffc8' : ACCENT;
    g.fillRect(cx * BUNKER_CELL, cy * BUNKER_CELL, BUNKER_CELL, BUNKER_CELL);
  }
  var bunkerArt = null;     // intact bunker, for the attract screen
  function intactBunker() {
    if (bunkerArt) return bunkerArt;
    var img = makeCanvas(BW, BH), g = img.getContext('2d');
    for (var cy = 0; cy < BUNKER_ROWS; cy++) for (var cx = 0; cx < BUNKER_COLS; cx++) if (bunkerSolid(cx, cy)) paintBunkerCell(g, cx, cy);
    var glow = makeCanvas(BW + 16, BH + 16), gg = glow.getContext('2d');
    gg.shadowColor = ACCENT; gg.shadowBlur = 7; gg.drawImage(img, 8, 8);
    bunkerArt = { img: img, glow: glow, w: BW, h: BH, pad: 8 };
    return bunkerArt;
  }

  /* ================================================================== create */
  function create(api) {
    var rng = api.rng;                                   // gameplay only

    /* -------------------------------------------------------------- state */
    var aliens = [];      // every invader: formation, divers, escorts, minis
    var shots = [];       // player + wingman shots
    var bombs = [];       // enemy fire: zig, wide, orb
    var caps = [];        // falling power-up capsules
    var bunkers = [];
    var bits = [], rings = [];                           // visual only
    var formation = { x: 36, y: FORM_TOP, dir: 1, step: 0, frame: 0, start: 1, name: '', beat: 0 };
    var player = { x: W / 2, alive: true, respawn: 0, inv: 0, shield: false, recoil: 0 };
    var power = { double: 0, triple: 0, rapid: 0, pierce: 0, drone: 0 };
    var drone = { x: W / 2, fireT: 0 };
    var ufo = null, ufoT = 10, boss = null, bossN = 0;
    var wave = 0, lives = 3, score = 0, nextLife = 5000;
    var fireCd = 0, bombT = 1.6, diveT = 3.5, clearT = 0, over = false, overT = 0;
    var t = 0, banner = null, flash = { a: 0, c: '#ffffff' }, seen = {}, crumbleT = 0, powTextT = -9, powStack = 0;
    var mus = { bpm: 96, int: -1, siren: false, laser: false, boss: false, shotN: 0 };
    var stars = [];
    for (var si = 0; si < 90; si++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, sp: 4 + Math.random() * 22,
        s: Math.random() < 0.2 ? 2 : 1, ph: Math.random() * TAU });
    }

    /* ------------------------------------------------------------ helpers */
    function mult() { return 1 + (wave - 1) * 0.2; }
    function addPts(n, x, y, col) {
      n = Math.round(n);
      score += n;
      api.addScore(n);
      if (x != null) api.fx.text(x, y, '+' + n, col || '#ffffff', 10);
      if (score >= nextLife) {
        nextLife += 10000;
        if (lives < 5) {
          lives++;
          api.fx.text(W / 2, 300, 'EXTRA CANNON', ACCENT, 13);
          api.audio.arp([659, 784, 1047], 0.08, { type: 'square', vol: 0.14 });
        }
      }
    }
    function showBanner(top, title, sub, color, kind, warn) {
      banner = { top: top || '', title: title, sub: sub || '', color: color || ACCENT, kind: kind || null, warn: !!warn, t: 2.8 };
    }
    function screenFlash(c, a) { if (a >= flash.a) { flash.c = c; flash.a = a; } }
    function segHits(s, y0, x0, x1, top, bot) { return s.x >= x0 && s.x <= x1 && s.y <= bot && y0 >= top; }
    function frameOf(a) { return a.state === 'form' ? formation.frame : Math.floor(t * 8) % 2; }
    function hasSlot(a) { return a.state === 'form' || a.state === 'dive' || a.state === 'return'; }
    function liveCount() { var n = 0; for (var i = 0; i < aliens.length; i++) if (!aliens[i].dead) n++; return n; }
    // Drop dead invaders in place once per frame (kills only mark them).
    function compactAliens() {
      var j = 0;
      for (var i = 0; i < aliens.length; i++) if (!aliens[i].dead) aliens[j++] = aliens[i];
      aliens.length = j;
    }

    /* ----------------------------------------------------- visual effects */
    function bit(x, y, vx, vy, c, s, life, grav) {
      if (bits.length >= MAX_BITS) return;
      bits.push({ x: x, y: y, vx: vx, vy: vy, c: c, s: s, life: life, max: life, g: grav || 0 });
    }
    // Explode a sprite into its own pixels.
    function pixelBurst(art, frame, x, y, c, px, force) {
      var rows = ART[art][(frame || 0) % ART[art].length], cxm = rows[0].length / 2, cym = rows.length / 2;
      force = force || 1;
      for (var ry = 0; ry < rows.length; ry++) {
        for (var rx = 0; rx < rows[ry].length; rx++) {
          if (rows[ry].charAt(rx) !== '#') continue;
          var dx = rx + 0.5 - cxm, dy = ry + 0.5 - cym;
          var sp = (40 + Math.random() * 110) * force;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          bit(x + rx * px + px / 2, y + ry * px + px / 2, dx / d * sp + (Math.random() - 0.5) * 40,
            dy / d * sp + (Math.random() - 0.5) * 40, c, px, 0.45 + Math.random() * 0.45, 90);
        }
      }
    }
    function sparks(x, y, c, n, sp) {
      for (var k = 0; k < n; k++) {
        var a = Math.random() * TAU, v = (sp || 120) * (0.3 + Math.random() * 0.7);
        bit(x, y, Math.cos(a) * v, Math.sin(a) * v, c, 2, 0.25 + Math.random() * 0.25, 0);
      }
    }
    function ring(x, y, c, r) { if (rings.length < 24) rings.push({ x: x, y: y, c: c, r: 4, max: r, life: 0.45, t: 0 }); }
    function stepVisuals(dt) {
      var i;
      for (i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.y += st.sp * dt * (boss ? 2.2 : 1);
        if (st.y > H) { st.y -= H; st.x = Math.random() * W; }
      }
      for (i = bits.length - 1; i >= 0; i--) {
        var b = bits[i];
        b.life -= dt;
        if (b.life <= 0) { bits.splice(i, 1); continue; }
        b.vy += b.g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        b.vx *= 0.985; b.vy *= 0.985;
      }
      for (i = rings.length - 1; i >= 0; i--) {
        var r = rings[i];
        r.t += dt;
        if (r.t >= r.life) { rings.splice(i, 1); continue; }
        r.r = 4 + (r.max - 4) * Math.sqrt(r.t / r.life);
      }
      flash.a = Math.max(0, flash.a - dt * 2.4);
      // exhaust trail behind swooping divers
      for (i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (!a.dead && (a.state === 'dive' || a.state === 'escort') && Math.random() < 0.6) {
          bit(a.x + a.w / 2 + (Math.random() - 0.5) * 8, a.y + 2, 0, -20, KINDS.d.c, 2, 0.3, 0);
        }
      }
    }

    /* ------------------------------------------------------------ bunkers */
    function makeBunker(x) {
      var b = { x: x, y: BUNKER_Y, cells: new Uint8Array(BUNKER_COLS * BUNKER_ROWS), n: 0,
        cv: makeCanvas(BW, BH), glow: makeCanvas(BW + 16, BH + 16), dirty: true };
      b.g = b.cv.getContext('2d');
      b.gg = b.glow.getContext('2d');
      for (var cy = 0; cy < BUNKER_ROWS; cy++) {
        for (var cx = 0; cx < BUNKER_COLS; cx++) {
          if (!bunkerSolid(cx, cy)) continue;
          b.cells[cy * BUNKER_COLS + cx] = 1; b.n++;
          paintBunkerCell(b.g, cx, cy);
        }
      }
      return b;
    }
    function buildBunkers() {
      bunkers = [];
      for (var k = 0; k < 4; k++) bunkers.push(makeBunker(Math.round(W / 2 + (k - 1.5) * 108 - BW / 2)));
    }
    function needBunkers(w) { var k = w % BOSS_EVERY; return w === 1 || k === 1 || k === 3 || k === 0; }
    function carve(b, cx, cy) {
      if (cx < 0 || cy < 0 || cx >= BUNKER_COLS || cy >= BUNKER_ROWS) return false;
      var i = cy * BUNKER_COLS + cx;
      if (!b.cells[i]) return false;
      b.cells[i] = 0; b.n--; b.dirty = true;
      b.g.clearRect(cx * BUNKER_CELL, cy * BUNKER_CELL, BUNKER_CELL, BUNKER_CELL);
      if (Math.random() < 0.3) {
        bit(b.x + cx * BUNKER_CELL + 1, b.y + cy * BUNKER_CELL + 1, (Math.random() - 0.5) * 60, -Math.random() * 50, ACCENT, 2, 0.5, 260);
      }
      return true;
    }
    function crumbleTick() {
      if (crumbleT > 0) return;
      crumbleT = 0.07;
      api.audio.noise(0.03, { vol: 0.035, cutoff: 3800 });
    }
    // Knock a ragged hole of radius r (cells) around a hit.
    function splat(b, cx, cy, r) {
      for (var dy = -r; dy <= r; dy++) {
        for (var dx = -r; dx <= r; dx++) {
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d > r + 0.4) continue;
          if (d > r * 0.5 && rng() < 0.35) continue;
          carve(b, cx + dx, cy + dy);
        }
      }
      crumbleTick();
    }
    function bunkerAt(x, y) {
      for (var i = 0; i < bunkers.length; i++) {
        var b = bunkers[i];
        if (x < b.x || x >= b.x + BW || y < b.y || y >= b.y + BH) continue;
        var cx = Math.floor((x - b.x) / BUNKER_CELL), cy = Math.floor((y - b.y) / BUNKER_CELL);
        return b.cells[cy * BUNKER_COLS + cx] ? { b: b, cx: cx, cy: cy } : null;
      }
      return null;
    }
    // Walk a projectile's path from ya to yb cell by cell; crumble the first solid cell.
    function bunkerSweep(x, ya, yb, r) {
      if (!bunkers.length) return false;
      var lo = Math.min(ya, yb), hi = Math.max(ya, yb);
      if (hi < BUNKER_Y || lo > BUNKER_Y + BH) return false;
      var dir = yb > ya ? 1 : -1, n = Math.ceil((hi - lo) / BUNKER_CELL);
      for (var k = 0; k <= n; k++) {
        var hit = bunkerAt(x, ya + dir * Math.min(k * BUNKER_CELL, hi - lo));
        // centre the crater a little inside the bunker, in the direction of travel
        if (hit) { splat(hit.b, hit.cx, hit.cy + dir * Math.floor(r / 2), r); return true; }
      }
      return false;
    }
    // Invaders erase whatever bunker they overlap.
    function bunkerEraseRect(x, y, w, h) {
      if (y + h < BUNKER_Y || y > BUNKER_Y + BH) return;
      var any = false;
      for (var i = 0; i < bunkers.length; i++) {
        var b = bunkers[i];
        if (x + w < b.x || x > b.x + BW) continue;
        var cx0 = Math.max(0, Math.floor((x - b.x) / BUNKER_CELL)), cx1 = Math.min(BUNKER_COLS - 1, Math.floor((x + w - 1 - b.x) / BUNKER_CELL));
        var cy0 = Math.max(0, Math.floor((y - b.y) / BUNKER_CELL)), cy1 = Math.min(BUNKER_ROWS - 1, Math.floor((y + h - 1 - b.y) / BUNKER_CELL));
        for (var cy = cy0; cy <= cy1; cy++) for (var cx = cx0; cx <= cx1; cx++) if (carve(b, cx, cy)) any = true;
      }
      if (any) crumbleTick();
    }
    // The laser eats down through bunkers a few cells per frame; returns where the beam stops.
    function laserEnd(x) {
      var end = GROUND;
      for (var i = 0; i < bunkers.length; i++) {
        var b = bunkers[i];
        if (x + LASER_HALF < b.x || x - LASER_HALF > b.x + BW) continue;
        var cx0 = Math.max(0, Math.floor((x - LASER_HALF - b.x) / BUNKER_CELL));
        var cx1 = Math.min(BUNKER_COLS - 1, Math.floor((x + LASER_HALF - b.x) / BUNKER_CELL));
        for (var cy = 0; cy < BUNKER_ROWS; cy++) {
          var found = false;
          for (var cx = cx0; cx <= cx1; cx++) {
            if (!b.cells[cy * BUNKER_COLS + cx]) continue;
            found = true;
            if (rng() < 0.3) carve(b, cx, cy);
          }
          if (found) { end = Math.min(end, b.y + cy * BUNKER_CELL); crumbleTick(); break; }
        }
      }
      return end;
    }
    function bunkerCells() { var n = 0; for (var i = 0; i < bunkers.length; i++) n += bunkers[i].n; return n; }

    /* --------------------------------------------------------- formations */
    function waveInfo(w) {
      if (w % BOSS_EVERY === 0) return { boss: true };
      var idx = w - 1 - Math.floor((w - 1) / BOSS_EVERY);
      return { boss: false, def: WAVES[idx % WAVES.length], loop: Math.floor(idx / WAVES.length) };
    }
    function makeAlien(kind, r, c) {
      var a = { kind: kind, v: 0, r: r, c: c, state: 'form', x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0,
        shield: 0, shieldMax: 0, flash: 0, grace: 0, t: 0, phase: 0, head: 0, side: 1, tx: 0,
        fireT: 0, fireAt: 0, shotsLeft: 0, weave: 0, dead: false };
      if (kind === 'g') a.v = r === 0 ? 0 : r <= 2 ? 1 : 2;
      var L = lookOf(kind, a.v);
      a.w = artW(L.art) * PIX; a.h = artH(L.art) * PIX;
      return a;
    }
    function slotX(a) { return formation.x + a.c * CW + (CW - a.w) / 2; }
    function slotY(a) { return formation.y + a.r * CH + (24 - a.h) / 2; }
    function buildFormation(def, loop) {
      var rows = def.map.length, fresh = null;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < COLS; c++) {
          var ch = def.map[r].charAt(c);
          if (!KINDS[ch]) continue;
          var a = makeAlien(ch, r, c);
          if (ch === 's') a.shield = a.shieldMax = KINDS.s.shield + Math.min(1, loop);
          if (ch === 'b') a.fireT = 2 + rng() * 4;
          aliens.push(a);
          if (!seen[ch] && !fresh) fresh = ch;
        }
      }
      for (var k = 0; k < aliens.length; k++) seen[aliens[k].kind] = true;
      formation.name = def.name;
      formation.start = Math.max(1, aliens.length);
      formation.x = 36; formation.dir = 1; formation.step = 0;
      formation.y = Math.min(FORM_TOP + Math.min(4, wave - 1) * 8, FORM_LOWEST - 24 - (rows - 1) * CH);
      aliens.forEach(function (al) { al.x = slotX(al); al.y = slotY(al); });
      if (fresh && fresh !== 'g') {
        showBanner('WAVE ' + wave + ' \u00b7 ' + def.name, 'NEW: ' + KINDS[fresh].name, KINDS[fresh].blurb, KINDS[fresh].c, fresh);
      } else {
        showBanner('', 'WAVE ' + wave, def.name + (loop ? ' +' + loop : ''), ACCENT, null);
      }
    }
    function startWave() {
      wave++;
      shots.length = 0; bombs.length = 0; aliens = [];
      if (needBunkers(wave)) buildBunkers();
      var info = waveInfo(wave);
      if (info.boss) { spawnBoss(); return; }
      buildFormation(info.def, info.loop);
      bombT = 1.6; diveT = 3 + rng() * 1.5;
    }
    function marchStep() {
      formation.frame ^= 1;
      var minX = 1e9, maxX = -1e9;
      for (var i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (a.dead || !hasSlot(a)) continue;
        var sx = slotX(a);
        if (sx < minX) minX = sx;
        if (sx + a.w > maxX) maxX = sx + a.w;
      }
      if (minX > maxX) return;
      if ((formation.dir > 0 && maxX + 6 > W - 10) || (formation.dir < 0 && minX - 6 < 10)) {
        formation.y += 14; formation.dir = -formation.dir;
      } else formation.x += 6 * formation.dir;
      // with music on, the march bass carries the footsteps
      if (!M()) api.audio.tone([98, 92, 87, 82][formation.beat++ % 4], 0.05, { type: 'square', vol: 0.06 });
    }
    function updateFormation(dt) {
      var live = 0, i, a;
      for (i = 0; i < aliens.length; i++) if (!aliens[i].dead && hasSlot(aliens[i])) live++;
      if (!live) return;
      var interval = 0.03 + (live / formation.start) * 0.55 / (1 + (wave - 1) * 0.1);
      formation.step += dt;
      if (formation.step >= interval) { formation.step = 0; marchStep(); }
      for (i = 0; i < aliens.length; i++) {
        a = aliens[i];
        if (a.dead || a.state !== 'form') continue;
        a.x = slotX(a); a.y = slotY(a);
        if (a.y + a.h > BUNKER_Y) bunkerEraseRect(a.x, a.y, a.w, a.h);
        if (a.y + a.h >= PY - 14) { invade(); return; }
        if (a.kind === 'b') bomberTick(a, dt);
      }
    }
    function invade() {
      if (over) return;
      over = true;
      if (player.alive) explodePlayer();
      lives = 0;
      screenFlash(LASER_C, 0.9);
      api.shake(14);
      api.audio.tone(80, 1, { type: 'sawtooth', vol: 0.3 });
      api.fx.text(W / 2, 300, 'INVADED', LASER_C, 18);
    }

    /* ------------------------------------------------------- enemy weapons */
    function zigSpeed() { return Math.min(320, 190 + wave * 12); }
    function fireZig(x, y, v) { bombs.push({ type: 'zig', x: x, y: y, vx: 0, vy: v || zigSpeed() }); }
    function fireWide(x, y) { bombs.push({ type: 'wide', x: x, y: y, vx: 0, vy: 100 + Math.min(40, wave * 3) }); }
    function fireOrb(x, y, ang, spd) { bombs.push({ type: 'orb', x: x, y: y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd }); }
    // Classic fire: the lowest invader in a random column (often the one above the cannon).
    function formationFire(dt) {
      bombT -= dt;
      if (bombT > 0 || !player.alive) return;
      bombT = Math.max(0.35, 1.25 - wave * 0.06) * (0.5 + rng());
      var cols = {}, i, a;
      for (i = 0; i < aliens.length; i++) {
        a = aliens[i];
        if (a.dead || a.state !== 'form') continue;
        if (!cols[a.c] || cols[a.c].r < a.r) cols[a.c] = a;
      }
      var keys = Object.keys(cols);
      if (!keys.length) return;
      var pick = cols[keys[Math.floor(rng() * keys.length)]];
      if (rng() < 0.4) {
        keys.forEach(function (k) { var c = cols[k]; if (Math.abs(c.x + c.w / 2 - player.x) < 20) pick = c; });
      }
      fireZig(pick.x + pick.w / 2, pick.y + pick.h);
    }
    function bomberTick(a, dt) {
      a.fireT -= dt;
      if (a.fireT > 0 || !player.alive) return;
      a.fireT = Math.max(3, 7 - wave * 0.2) * (0.7 + rng() * 0.6);
      var wide = 0;
      for (var i = 0; i < bombs.length; i++) if (bombs[i].type === 'wide') wide++;
      if (wide >= 3) return;
      fireWide(a.x + a.w / 2, a.y + a.h);
      api.audio.tone(140, 0.2, { type: 'triangle', vol: 0.1, slide: 0.6 });
    }

    /* ------------------------------------------------ divers, escorts, minis */
    function maxDivers() { return Math.min(3, 1 + Math.floor(wave / 4)); }
    function launchDives(dt) {
      if (!player.alive) return;
      diveT -= dt;
      if (diveT > 0) return;
      diveT = Math.max(1.4, 4.2 - wave * 0.15) * (0.7 + rng() * 0.6);
      var diving = 0, pool = [], i;
      for (i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (a.dead) continue;
        if (a.state === 'dive' || a.state === 'return') diving++;
        else if (a.kind === 'd' && a.state === 'form') pool.push(a);
      }
      if (!pool.length || diving >= maxDivers()) return;
      startDive(pool[Math.floor(rng() * pool.length)], false);
    }
    // Loop out of formation (half turn), then swoop down on the cannon.
    function startDive(a, escort) {
      a.state = escort ? 'escort' : 'dive';
      a.t = 0; a.phase = 0; a.vx = 0;
      a.side = a.x + a.w / 2 < W / 2 ? -1 : 1;
      a.head = -Math.PI / 2;
      a.shotsLeft = 1 + (wave > 6 ? 1 : 0);
      a.fireAt = 0.9 + rng() * 0.6;
      a.weave = rng() * TAU;
      swoopNote();
    }
    function updateDive(a, dt) {
      a.t += dt;
      if (a.phase === 0) {
        a.head += a.side * Math.PI / 0.7 * dt;
        a.x += Math.cos(a.head) * 150 * dt; a.y += Math.sin(a.head) * 150 * dt;
        if (a.t >= 0.7) { a.phase = 1; a.tx = player.x; }
        return;
      }
      var spd = Math.min(260, 185 + wave * 5);
      var want = U.clamp((a.tx - (a.x + a.w / 2)) * 1.6, -150, 150) + Math.sin(a.t * 4 + a.weave) * 70;
      a.vx += (want - a.vx) * Math.min(1, dt * 3);
      a.x = U.clamp(a.x + a.vx * dt, 2, W - a.w - 2);
      a.y += spd * dt;
      if (a.shotsLeft > 0 && a.t > a.fireAt && a.y < 380 && player.alive) {
        fireZig(a.x + a.w / 2, a.y + a.h, zigSpeed() + 60);
        a.shotsLeft--; a.fireAt = a.t + 0.45;
      }
      bunkerEraseRect(a.x, a.y, a.w, a.h);
      if (a.y > H + 10) {
        if (a.state === 'escort') { a.dead = true; return; }
        a.state = 'return'; a.x = slotX(a); a.y = -30;
      }
    }
    function updateReturn(a, dt) {
      var sx = slotX(a), sy = slotY(a), dx = sx - a.x, dy = sy - a.y;
      var d = Math.sqrt(dx * dx + dy * dy), step = 220 * dt;
      if (d <= step) { a.state = 'form'; a.x = sx; a.y = sy; return; }
      a.x += dx / d * step; a.y += dy / d * step;
    }
    function spawnMinis(a) {
      for (var k = -1; k <= 1; k += 2) {
        var m = makeAlien('m', 0, 0);
        m.state = 'free';
        m.x = a.x + a.w / 2 - m.w / 2 + k * 8; m.y = a.y + 4;
        m.vx = k * (70 + rng() * 30); m.vy = 50 + Math.min(40, wave * 2);
        m.grace = 0.25;
        aliens.push(m);
      }
      var mu = M();
      if (mu) mu.stinger([{ deg: 4 }, { deg: 2, at: 1 }], { inst: 'pluck', quantize: '16', octave: 1, gain: 0.3 });
      else api.audio.tone(700, 0.08, { type: 'square', vol: 0.08, slide: 0.6 });
    }
    function updateMini(a, dt) {
      a.x += a.vx * dt; a.y += a.vy * dt;
      if (a.x < 4) { a.x = 4; a.vx = Math.abs(a.vx); }
      if (a.x + a.w > W - 4) { a.x = W - 4 - a.w; a.vx = -Math.abs(a.vx); }
      bunkerEraseRect(a.x, a.y, a.w, a.h);
      if (a.y > GROUND) a.dead = true;           // escaped below the ground line
    }
    function touchesPlayer(a) {
      return player.alive && a.x < player.x + 14 && a.x + a.w > player.x - 14 && a.y + a.h > PY - 11 && a.y < PY + 8;
    }
    // Everything that is not marching in its slot.
    function updateMovers(dt) {
      for (var i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (a.dead) continue;
        if (a.flash > 0) a.flash -= dt;
        if (a.grace > 0) a.grace -= dt;
        if (a.state === 'dive' || a.state === 'escort') updateDive(a, dt);
        else if (a.state === 'return') updateReturn(a, dt);
        else if (a.state === 'free') updateMini(a, dt);
        if (!a.dead && a.state !== 'form' && player.inv <= 0 && touchesPlayer(a)) { killAlien(a, false); hurtPlayer(); }
      }
    }

    /* -------------------------------------------------------------- kills */
    function killAlien(a, scored) {
      if (a.dead) return;
      a.dead = true;
      var L = lookOf(a.kind, a.v), cx = a.x + a.w / 2;
      var diving = a.state === 'dive' || a.state === 'escort';
      if (scored) addPts(L.pts * mult() * (diving ? 2 : 1), cx, a.y, diving ? '#ffd23f' : '#ffffff');
      pixelBurst(L.art, frameOf(a), a.x, a.y, L.c, PIX, a.kind === 'b' ? 1.4 : 1);
      api.audio.noise(0.12, { vol: 0.16, cutoff: 2400 });
      if (a.kind === 'b') { ring(cx, a.y + a.h / 2, L.c, 30); api.shake(3); }
      if (a.kind === 'p') spawnMinis(a);
    }
    function hitShield(a, d) {
      a.shield = Math.max(0, a.shield - d);
      a.flash = 0.12;
      var sy = a.y + a.h + 4;
      sparks(a.x + a.w / 2, sy, SHIELD_C, 6, 110);
      if (a.shield > 0) {
        api.audio.tone(1500, 0.04, { type: 'triangle', vol: 0.08 });
        if (M()) M().note('bell', 1, { octave: -1, gain: 0.2 });
      } else {
        addPts(10, a.x + a.w / 2, sy, SHIELD_C);
        sparks(a.x + a.w / 2, sy, SHIELD_C, 14, 170);
        api.audio.noise(0.1, { vol: 0.12, cutoff: 5200 });
      }
    }

    /* ------------------------------------------------------------- player */
    function addShot(x, y, vx, pierce, fromDrone) {
      shots.push({ x: x, y: y, vx: vx, pierce: !!pierce, drone: !!fromDrone, hit: pierce ? [] : null });
    }
    function tryFire(dt, inp) {
      fireCd -= dt;
      if (fireCd > 0 || !(inp.held('a') || inp.held('up') || inp.held('hold'))) return;
      var spread = power.triple > 0 ? 3 : power.double > 0 ? 2 : 1;
      var own = 0;
      for (var i = 0; i < shots.length; i++) if (!shots[i].drone) own++;
      if (own + spread > spread * (power.rapid > 0 ? 4 : 2)) return;
      var pierce = power.pierce > 0, y = PY - 14;
      if (spread === 1) addShot(player.x, y, 0, pierce);
      else if (spread === 2) { addShot(player.x - 7, y, 0, pierce); addShot(player.x + 7, y, 0, pierce); }
      else { addShot(player.x, y, 0, pierce); addShot(player.x - 5, y, -95, pierce); addShot(player.x + 5, y, 95, pierce); }
      fireCd = power.rapid > 0 ? RAPID_CD : FIRE_CD;
      player.recoil = 1;
      api.audio.tone(pierce ? 1300 : 900, 0.06, { type: 'square', vol: power.rapid > 0 ? 0.05 : 0.08, slide: 0.4 });
      // quiet in-key tick (every other shot under rapid fire)
      if (M() && (power.rapid <= 0 || mus.shotN % 2 === 0)) M().note('arp', [0, 2, 4][mus.shotN % 3], { chord: true, octave: 2, gain: 0.12 });
      mus.shotN++;
    }
    function updateDrone(dt) {
      if (power.drone <= 0) return;
      var side = player.x > W / 2 ? -1 : 1;
      drone.x += (U.clamp(player.x + side * 40, 14, W - 14) - drone.x) * Math.min(1, dt * 6);
      drone.fireT -= dt;
      if (drone.fireT <= 0) { drone.fireT = 0.5; addShot(drone.x, PY - 20, 0, false, true); }
    }
    function updatePlayer(dt, inp) {
      if (!player.alive) {
        player.respawn -= dt;
        if (player.respawn <= 0 && !over) {
          player.alive = true; player.inv = RESPAWN_INV; player.x = W / 2;
          bombs.length = 0;
        }
        return;
      }
      var mv = (inp.held('right') ? 1 : 0) - (inp.held('left') ? 1 : 0);
      player.x = U.clamp(player.x + mv * PLAYER_SPEED * dt, 20, W - 20);
      if (player.inv > 0) player.inv -= dt;
      player.recoil = Math.max(0, player.recoil - dt * 8);
      for (var k in power) if (power[k] > 0) power[k] = Math.max(0, power[k] - dt);
      tryFire(dt, inp);
      updateDrone(dt);
    }
    function explodePlayer() {
      player.alive = false; player.respawn = 1.8;
      pixelBurst('cannon', 0, player.x - 16.5, PY - 10.5, ACCENT, PIX, 1.6);
      ring(player.x, PY, ACCENT, 60);
      api.shake(10);
      screenFlash(LASER_C, 0.5);
      api.audio.noise(0.6, { vol: 0.3, cutoff: 900 });
      for (var k in power) power[k] = 0;
      player.shield = false;
    }
    function hurtPlayer() {
      if (!player.alive || player.inv > 0 || over) return;
      if (player.shield) {
        player.shield = false; player.inv = 1.1;
        ring(player.x, PY, POWERS.shield.c, 44);
        screenFlash(POWERS.shield.c, 0.35);
        api.audio.tone(520, 0.25, { type: 'triangle', vol: 0.16, slide: 0.5 });
        api.fx.text(player.x, PY - 34, 'SHIELD DOWN', POWERS.shield.c, 10);
        return;
      }
      explodePlayer();
      lives--;
      if (lives <= 0) over = true;
      else if (M()) M().duck(0.5, 1.2);
    }

    /* -------------------------------------------------------- player shots */
    function shotVsAliens(s, y0) {
      for (var k = 0; k < aliens.length; k++) {
        var a = aliens[k];
        if (a.dead || a.grace > 0 || (s.hit && s.hit.indexOf(a) >= 0)) continue;
        // the front shield sits under the body and takes the hit first
        if (a.shield > 0 && segHits(s, y0, a.x - 3, a.x + a.w + 3, a.y + a.h + 1, a.y + a.h + 8)) {
          hitShield(a, s.pierce ? a.shield : 1);
          if (!s.pierce) return true;
        }
        if (segHits(s, y0, a.x, a.x + a.w, a.y, a.y + a.h)) {
          killAlien(a, true);
          if (!s.pierce) return true;
          s.hit.push(a);
        }
      }
      return false;
    }
    function shotVsUfo(s) {
      if (!ufo || Math.abs(s.x - ufo.x) > 24 || Math.abs(s.y - UFO_Y) > 12) return false;
      killUfo();
      return true;
    }
    function shotVsBombs(s) {
      for (var i = bombs.length - 1; i >= 0; i--) {
        var b = bombs[i];
        if (b.type === 'orb') continue;                 // boss fans cannot be shot down
        var hw = b.type === 'wide' ? 8 : 5;
        if (Math.abs(b.x - s.x) < hw && Math.abs(b.y - s.y) < 12) {
          bombs.splice(i, 1);
          addPts(b.type === 'wide' ? 15 : 5);
          sparks(b.x, b.y, b.type === 'wide' ? WIDE_C : ZIG_C, 8, 120);
          return !s.pierce;
        }
      }
      return false;
    }
    function updateShots(dt) {
      for (var i = shots.length - 1; i >= 0; i--) {
        var s = shots[i], y0 = s.y;
        s.y -= SHOT_SPEED * dt; s.x += s.vx * dt;
        if (s.y < 20 || s.x < -6 || s.x > W + 6) { shots.splice(i, 1); continue; }
        if (bunkerSweep(s.x, y0, s.y, 1)) { shots.splice(i, 1); continue; }
        if (shotVsAliens(s, y0) || shotVsBoss(s, y0) || shotVsUfo(s) || shotVsBombs(s)) shots.splice(i, 1);
      }
    }

    /* --------------------------------------------------------- enemy shots */
    var BOMB_HALF = { zig: 12, wide: 19, orb: 13 };     // hit half-widths vs the cannon
    var BOMB_BITE = { zig: 1, wide: 4, orb: 1 };        // crater radius in bunker cells
    function updateBombs(dt) {
      for (var i = bombs.length - 1; i >= 0; i--) {
        var b = bombs[i], y0 = b.y;
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.y > GROUND || b.x < -10 || b.x > W + 10) {
          if (b.y > GROUND) sparks(b.x, GROUND, b.type === 'wide' ? WIDE_C : '#ffd08a', b.type === 'wide' ? 10 : 3, 80);
          bombs.splice(i, 1); continue;
        }
        if (bunkerSweep(b.x, y0, b.y, BOMB_BITE[b.type])) {
          if (b.type === 'wide') { ring(b.x, b.y, WIDE_C, 22); api.shake(2); }
          bombs.splice(i, 1); continue;
        }
        if (player.alive && Math.abs(b.x - player.x) < BOMB_HALF[b.type] && b.y > PY - 14 && b.y < PY + 8) {
          bombs.splice(i, 1);
          hurtPlayer();
        }
      }
    }

    /* ------------------------------------------------ mystery ship + drops */
    function updateUfo(dt) {
      if (boss) { ufo = null; return; }
      if (!ufo) {
        ufoT -= dt;
        if (ufoT <= 0 && clearT <= 0) { var fl = rng() < 0.5; ufo = { x: fl ? -30 : W + 30, v: fl ? 105 : -105 }; }
        return;
      }
      ufo.x += ufo.v * dt;
      if (!M() && Math.floor(t * 12) % 2) api.audio.tone(ufo.x % 40 < 20 ? 700 : 620, 0.03, { type: 'sine', vol: 0.03 });
      if (ufo.x < -50 || ufo.x > W + 50) { ufo = null; ufoT = 16 + rng() * 10; }
    }
    function killUfo() {
      addPts([50, 100, 150, 300][Math.floor(rng() * 4)], ufo.x, UFO_Y - 10, UFO_C);
      pixelBurst('ufo', 0, ufo.x - 24, UFO_Y - 10, UFO_C, PIX, 1.3);
      ring(ufo.x, UFO_Y, UFO_C, 50);
      screenFlash(UFO_C, 0.25);
      api.audio.arp([1047, 784, 1047], 0.05, { type: 'square', vol: 0.16 });
      dropCapsule(ufo.x, UFO_Y + 6);
      ufo = null; ufoT = 16 + rng() * 10;
    }
    function pickPower() {
      var total = 0, k;
      for (k = 0; k < POWER_ORDER.length; k++) total += POWERS[POWER_ORDER[k]].weight;
      var r = rng() * total;
      for (k = 0; k < POWER_ORDER.length; k++) {
        r -= POWERS[POWER_ORDER[k]].weight;
        if (r < 0) return POWER_ORDER[k];
      }
      return 'double';
    }
    function dropCapsule(x, y, kind) {
      if (caps.length >= 3) return;
      caps.push({ kind: kind || pickPower(), x: U.clamp(x, 20, W - 20), y: y, t: 0 });
    }
    function updateCaps(dt) {
      for (var i = caps.length - 1; i >= 0; i--) {
        var c = caps[i];
        c.t += dt; c.y += 78 * dt;
        if (player.alive && Math.abs(c.x - player.x) < 24 && c.y > PY - 22 && c.y < PY + 10) {
          caps.splice(i, 1); applyPower(c.kind); continue;
        }
        if (c.y > GROUND + 8) caps.splice(i, 1);
      }
    }
    function applyPower(k) {
      var P = POWERS[k];
      if (k === 'shield') player.shield = true;
      else {
        if (k === 'double') power.triple = 0;
        if (k === 'triple') power.double = 0;
        if (k === 'drone' && power.drone <= 0) { drone.x = player.x; drone.fireT = 0.2; }
        power[k] = P.time;
      }
      powStack = t - powTextT < 0.9 ? powStack + 1 : 0;
      powTextT = t;
      api.fx.text(U.clamp(player.x, 100, W - 100), PY - 46 - powStack * 16, P.name, P.c, 11);
      ring(player.x, PY, P.c, 40);
      screenFlash(P.c, 0.18);
      var m = M();
      if (m) m.stinger(P.jingle.map(function (d, i) { return { deg: d, at: i }; }), { inst: P.inst, quantize: '16', octave: 1, gain: 0.35 });
      else api.audio.arp([660, 880, 1100], 0.06, { type: 'square', vol: 0.14 });
    }

    /* ---------------------------------------------------------- mothership */
    function spawnBoss() {
      bossN++;
      var podHp = 10 + (bossN - 1) * 4, coreHp = 26 + (bossN - 1) * 8;
      boss = { x: W / 2, y: -70, enter: 2.8, phase: 1, t: 0, hullFlash: 0,
        pods: [{ dx: -POD_DX, hp: podHp, max: podHp, flash: 0 }, { dx: POD_DX, hp: podHp, max: podHp, flash: 0 }],
        core: { hp: coreHp, max: coreHp, flash: 0 },
        fanT: 1.5, escT: 6, lasT: 3.5, las: null, charge: null, turn: 0, dying: 0, boomT: 0 };
      formation.name = 'MOTHERSHIP';
      ufo = null;
      showBanner('WAVE ' + wave, 'WARNING', 'MOTHERSHIP MK ' + bossN + ' \u00b7 DESTROY THE GUN PODS', LASER_C, null, true);
      api.shake(6);
      screenFlash(LASER_C, 0.3);
      var m = M();
      if (m) {
        m.play(bossSong(bossN, keyFor(wave - 1)), { fade: 1.2, intensity: 0.3 });
        mus.boss = true; resetMusicGuards();
        m.note('riser', 0, { dur: 2.2, gain: 0.45 });
      } else api.audio.tone(110, 0.9, { type: 'sawtooth', vol: 0.12, slide: 0.5 });
    }
    function podAlive(k) { return boss.pods[k].hp > 0; }
    function bossHp() { return boss.pods[0].hp + boss.pods[1].hp + boss.core.hp; }
    function bossMax() { return boss.pods[0].max + boss.pods[1].max + boss.core.max; }
    function updateBoss(dt) {
      var b = boss, P = BOSS_PHASES[b.phase];
      b.t += dt;
      b.hullFlash = Math.max(0, b.hullFlash - dt);
      b.core.flash = Math.max(0, b.core.flash - dt);
      b.pods[0].flash = Math.max(0, b.pods[0].flash - dt);
      b.pods[1].flash = Math.max(0, b.pods[1].flash - dt);
      if (b.dying > 0) { updateBossDeath(dt); return; }
      if (b.enter > 0) {
        b.enter -= dt;
        b.y += (BOSS_Y - b.y) * Math.min(1, dt * 1.6);
        return;
      }
      if (b.las) updateLaser(b, dt);
      else {
        b.x += (W / 2 + Math.sin(b.t * P.sway) * 150 - b.x) * Math.min(1, dt * 2);
        b.y += (BOSS_Y + Math.sin(b.t * 1.3) * 6 - b.y) * Math.min(1, dt * 3);
        if (b.charge) {
          b.charge.t -= dt;
          if (b.charge.t <= 0) { fireFan(b, P); b.charge = null; }
        } else {
          b.fanT -= dt;
          if (b.fanT <= 0) { b.fanT = P.fanEvery; b.charge = { t: 0.4, pod: b.phase === 1 ? nextPod(b) : -1 }; }
        }
        if (P.laserEvery && !b.charge) {
          b.lasT -= dt;
          if (b.lasT <= 0 && player.alive) startLaser(b, P);
        }
      }
      b.escT -= dt;
      if (b.escT <= 0) { b.escT = P.escortEvery; spawnEscorts(b, P.escortN); }
    }
    function nextPod(b) {
      b.turn++;
      var k = b.turn % 2;
      return podAlive(k) ? k : 1 - k;
    }
    function fanOrigin(b, pod) {
      if (pod >= 0 && podAlive(pod)) return { x: b.x + b.pods[pod].dx, y: b.y + POD_DY + 13 };
      return { x: b.x, y: b.y + CORE_DY + CORE_R };
    }
    // A fan of orbs aimed at the cannon; in overload every other fan is a straight curtain.
    function fireFan(b, P) {
      var o = fanOrigin(b, b.charge ? b.charge.pod : -1);
      var aim = U.clamp(Math.atan2(PY - o.y, player.x - o.x), Math.PI * 0.22, Math.PI * 0.78);
      if (b.phase === 3 && b.turn % 2) aim = Math.PI / 2;
      b.turn++;
      for (var k = 0; k < P.fanN; k++) fireOrb(o.x, o.y, aim + (k / (P.fanN - 1) - 0.5) * P.fanSpread, P.fanSpeed);
      sparks(o.x, o.y, ORB_C, 8, 90);
      var m = M();
      if (m) m.note('pluck', [0, 4, 7][b.turn % 3], { octave: 0, gain: 0.35, params: { cutoff: 1400 } });
      else api.audio.tone(330, 0.12, { type: 'square', vol: 0.08, slide: 0.7 });
    }
    function spawnEscorts(b, n) {
      var have = 0, i;
      for (i = 0; i < aliens.length; i++) if (!aliens[i].dead && aliens[i].state === 'escort') have++;
      n = Math.min(n, 4 - have);
      for (i = 0; i < n; i++) {
        var a = makeAlien('d', 0, 0);
        a.x = b.x - a.w / 2 + (i - (n - 1) / 2) * 44;
        a.y = b.y + 10;
        startDive(a, true);
        a.side = i < n / 2 ? -1 : 1;
        aliens.push(a);
      }
    }
    // Laser: glide to an edge, telegraph the swept zone, sweep, cool down.
    // The zone always covers the cannon's half and never the far side.
    function startLaser(b, P) {
      var left = player.x < W / 2, reach = W * P.laserReach;
      b.las = { st: 'move', t: 0, x0: left ? 64 : W - 64, x1: left ? reach : W - reach, end: GROUND, beep: 0 };
    }
    function updateLaser(b, dt) {
      var L = b.las;
      L.t += dt;
      if (L.st === 'move') {
        b.x += (L.x0 - b.x) * Math.min(1, dt * 5);
        if (L.t >= LASER_MOVE) { L.st = 'tele'; L.t = 0; }
      } else if (L.st === 'tele') {
        b.x += (L.x0 - b.x) * Math.min(1, dt * 8);
        L.beep -= dt;
        if (L.beep <= 0) { L.beep = 0.22; api.audio.tone(880, 0.07, { type: 'square', vol: 0.07 }); }
        if (L.t >= LASER_TELE) {
          L.st = 'fire'; L.t = 0;
          api.shake(5); screenFlash(LASER_C, 0.3);
          api.audio.tone(70, LASER_FIRE, { type: 'sawtooth', vol: 0.12 });
          api.audio.noise(0.5, { vol: 0.2, cutoff: 1600 });
        }
      } else if (L.st === 'fire') {
        var f = Math.min(1, L.t / LASER_FIRE), e = f * f * (3 - 2 * f);
        b.x = L.x0 + (L.x1 - L.x0) * e;
        L.end = laserEnd(b.x);
        if (L.end >= PY - 14 && Math.abs(player.x - b.x) < LASER_HALF + 12) hurtPlayer();
        if (Math.random() < 0.7) sparks(b.x + (Math.random() - 0.5) * 12, L.end, Math.random() < 0.5 ? '#ffffff' : LASER_C, 1, 160);
        if (f >= 1) { L.st = 'cool'; L.t = 0; }
      } else if (L.t >= LASER_COOL) {
        b.las = null;
        b.lasT = BOSS_PHASES[b.phase].laserEvery;
        b.fanT = Math.min(b.fanT, 0.8);
      }
    }
    function clankAt(x, y) {
      sparks(x, y, '#e6e0ff', 4, 140);
      api.audio.tone(1700, 0.03, { type: 'triangle', vol: 0.05 });
    }
    function hullAt(x, y) {
      var col = Math.floor((x - (boss.x - HULL_W / 2)) / BOSS_PIX), row = Math.floor((y - (boss.y - HULL_H / 2)) / BOSS_PIX);
      var rows = ART.hull[0];
      return row >= 0 && row < rows.length && col >= 0 && col < rows[0].length && rows[row].charAt(col) === '#';
    }
    function shotVsBoss(s, y0) {
      var b = boss;
      if (!b || b.dying > 0 || s.y > b.y + 60 || y0 < b.y - 40) return false;
      var dmg = s.pierce ? 2 : 1;
      for (var k = 0; k < 2; k++) {
        if (!podAlive(k)) continue;
        var px = b.x + b.pods[k].dx, py = b.y + POD_DY;
        if (segHits(s, y0, px - 15, px + 15, py - 13, py + 13)) {
          if (b.enter > 0) clankAt(s.x, s.y); else damagePod(k, dmg);
          return true;
        }
      }
      var cy = b.y + CORE_DY;
      if (b.phase >= 2 && segHits(s, y0, b.x - CORE_R, b.x + CORE_R, cy - CORE_R, cy + CORE_R)) { damageCore(dmg); return true; }
      if (hullAt(s.x, s.y) || hullAt(s.x, (s.y + y0) / 2)) { clankAt(s.x, s.y); return true; }
      return false;
    }
    function damagePod(k, d) {
      var p = boss.pods[k], x = boss.x + p.dx, y = boss.y + POD_DY;
      p.hp = Math.max(0, p.hp - d); p.flash = 0.08;
      sparks(x, y + 10, '#ffd08a', 4, 120);
      api.audio.tone(260 + p.hp * 25, 0.05, { type: 'square', vol: 0.07 });
      if (p.hp > 0) return;
      addPts(400 * bossN, x, y, '#ffd23f');
      pixelBurst('pod', 0, x - 15, y - 12, POD_C, BOSS_PIX, 1.4);
      ring(x, y, POD_C, 64);
      api.shake(9); screenFlash('#ffd08a', 0.4);
      api.audio.noise(0.5, { vol: 0.3, cutoff: 1100 });
      dropCapsule(x, y + 14);
      if (!podAlive(0) && !podAlive(1)) setBossPhase(2);
    }
    function damageCore(d) {
      var b = boss;
      b.core.hp = Math.max(0, b.core.hp - d); b.core.flash = 0.08;
      sparks(b.x, b.y + CORE_DY + 8, '#ffffff', 5, 140);
      api.audio.tone(180 + b.core.hp * 12, 0.05, { type: 'square', vol: 0.08 });
      if (b.core.hp <= 0) { bossDie(); return; }
      if (b.phase === 2 && b.core.hp <= b.core.max * 0.5) setBossPhase(3);
    }
    function setBossPhase(n) {
      var P = BOSS_PHASES[n];
      boss.phase = n;
      boss.fanT = 1.4; boss.lasT = 2.4; boss.charge = null;
      boss.hullFlash = 0.15;
      showBanner('MOTHERSHIP MK ' + bossN, P.name, P.sub, n === 3 ? LASER_C : '#ffd23f', null, n === 3);
      screenFlash('#ffffff', 0.45);
      api.shake(8);
      api.audio.noise(0.4, { vol: 0.22, cutoff: 1400 });
      var m = M();
      if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2, steps: 3 }], { inst: 'lead', quantize: '8', octave: 1, gain: 0.35, params: { wave: 'sawtooth', cutoff: 2600 } });
    }
    function bossDie() {
      var b = boss;
      b.dying = 2.4; b.boomT = 0; b.las = null; b.charge = null;
      bombs = bombs.filter(function (q) { return q.type !== 'orb'; });
      for (var i = 0; i < aliens.length; i++) if (!aliens[i].dead) killAlien(aliens[i], false);
      addPts(2500 * bossN, b.x, b.y - 40, '#ffd23f');
      showBanner('', 'MOTHERSHIP DOWN', '+' + U.fmt(2500 * bossN), '#ffd23f', null);
      if (M()) M().duck(0.5, 2);
    }
    function updateBossDeath(dt) {
      var b = boss;
      b.dying -= dt; b.boomT -= dt;
      b.x += (Math.random() - 0.5) * 2;
      if (b.boomT <= 0) {
        b.boomT = 0.11;
        var x = b.x + (Math.random() - 0.5) * HULL_W, y = b.y + (Math.random() - 0.5) * HULL_H;
        sparks(x, y, Math.random() < 0.5 ? HULL_C : '#ffd08a', 14, 200);
        ring(x, y, '#ffd08a', 24 + Math.random() * 20);
        api.audio.noise(0.2, { vol: 0.18, cutoff: 700 + Math.random() * 900 });
        api.shake(4);
      }
      if (b.dying > 0) return;
      pixelBurst('hull', 0, b.x - HULL_W / 2, b.y - HULL_H / 2, HULL_C, BOSS_PIX, 2);
      ring(b.x, b.y, '#ffffff', 160);
      screenFlash('#ffffff', 0.9);
      api.shake(16);
      api.audio.noise(1.2, { vol: 0.34, cutoff: 600 });
      dropCapsule(b.x, b.y + 20);
      boss = null;
    }

    /* ---------------------------------------------------------- wave flow */
    function waveCleared() {
      var bonus = 100 * wave;
      addPts(bonus);
      api.fx.text(W / 2, 280, 'BLOCK FOUND +' + bonus, '#ffd23f', 15);
      screenFlash(ACCENT, 0.2);
      var m = M();
      if (m) {
        m.stinger([{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 7, at: 6, steps: 6 }], { inst: 'lead', quantize: 'beat', octave: 1, gain: 0.4, params: { wave: 'triangle', cutoff: 2600 } });
        if (mus.boss) { m.play(song(keyFor(wave)), { fade: 2, intensity: 0.1 }); mus.boss = false; resetMusicGuards(); }
        else m.setKey(keyFor(wave));
      } else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'square', vol: 0.18 });
      clearT = 2.0;
    }

    /* -------------------------------------------------------------- music */
    function resetMusicGuards() { mus.bpm = -1; mus.int = -1; mus.siren = false; mus.laser = false; }
    function swoopNote() {
      var m = M();
      if (m) m.stinger([{ deg: 9 }, { deg: 7, at: 1 }, { deg: 4, at: 2 }, { deg: 2, at: 3, steps: 2 }], { inst: 'arp', quantize: '16', octave: 1, gain: 0.16, params: { cutoff: 2400 } });
      else api.audio.tone(1300, 0.35, { type: 'sine', vol: 0.05, slide: 0.4 });
    }
    function syncMusic() {
      var m = M();
      if (!m) return;
      var bpm, it;
      if (boss) {
        var P = BOSS_PHASES[boss.phase];
        bpm = P.bpm; it = P.intensity;
      } else {
        var live = 0;
        for (var i = 0; i < aliens.length; i++) if (!aliens[i].dead && hasSlot(aliens[i])) live++;
        var frac = live / formation.start;
        bpm = Math.min(188, Math.round((96 + (1 - frac) * 72 + (wave - 1) * 4) / 4) * 4);
        it = Math.round(U.clamp(0.1 + (1 - frac) * 0.8 + (wave - 1) * 0.1, 0, 1) * 20) / 20;
      }
      if (bpm !== mus.bpm) { mus.bpm = bpm; m.setTempo(bpm, 0.5); }
      if (it !== mus.int) { mus.int = it; m.setIntensity(it); }
      var siren = !!ufo && !over && !boss;
      if (siren !== mus.siren) { mus.siren = siren; m.setTrack('siren', siren ? true : null); }
      var las = !!(boss && boss.las && (boss.las.st === 'tele' || boss.las.st === 'fire'));
      if (las !== mus.laser) { mus.laser = las; m.setTrack('laser', las ? true : null); }
    }
    function status() {
      var pw = '';
      for (var k = 0; k < POWER_ORDER.length; k++) {
        var key = POWER_ORDER[k];
        if (key === 'shield' ? player.shield : power[key] > 0) pw += '  \u00b7  ' + POWERS[key].label;
      }
      var head = boss ? 'MOTHERSHIP ' + bossN + '  \u00b7  HULL ' + Math.ceil(bossHp() / bossMax() * 100) + '%'
        : 'WAVE ' + wave + '  \u00b7  INVADERS ' + liveCount();
      api.setStatus(head + '  \u00b7  CANNONS ' + lives + pw);
    }

    /* ============================================================ render */
    function drawBackground(ctx) {
      ctx.fillStyle = '#02030a';
      ctx.fillRect(0, 0, W, H);
      var hz = ctx.createLinearGradient(0, H * 0.55, 0, GROUND);
      hz.addColorStop(0, 'rgba(20,80,50,0)'); hz.addColorStop(1, boss ? 'rgba(140,20,60,0.2)' : 'rgba(30,140,80,0.14)');
      ctx.fillStyle = hz; ctx.fillRect(0, H * 0.55, W, GROUND - H * 0.55);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + s.ph)) * (s.sp / 26);
        ctx.fillStyle = s.s > 1 ? '#cfe8ff' : '#8fa8d8';
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
    }
    function drawBunkers(ctx) {
      for (var i = 0; i < bunkers.length; i++) {
        var b = bunkers[i];
        if (b.dirty) {
          b.gg.clearRect(0, 0, BW + 16, BH + 16);
          b.gg.shadowColor = ACCENT; b.gg.shadowBlur = 7;
          b.gg.drawImage(b.cv, 8, 8);
          b.dirty = false;
        }
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.45;
        ctx.drawImage(b.glow, b.x - 8, b.y - 8);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(b.cv, b.x, b.y);
      }
    }
    // Front shield: five segments under the body; the centre survives longest.
    function drawShield(ctx, a) {
      drawShieldBar(ctx, a.x, a.y + a.h + 2, a.w, a.shield / a.shieldMax, a.flash > 0, a.c);
    }
    function drawShieldBar(ctx, x, y, w, frac, hit, ph) {
      var n = 5, segW = (w + 6) / n, x0 = x - 3;
      var keep = Math.ceil(n * frac), order = [2, 1, 3, 0, 4];
      var al = hit ? 1 : 0.8 + 0.2 * Math.sin(t * 22 + ph * 1.7);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = hit ? '#ffffff' : SHIELD_C;
      for (var k = 0; k < keep; k++) {
        var sx = x0 + order[k] * segW;
        ctx.globalAlpha = al * 0.3; ctx.fillRect(sx - 1, y - 2, segW + 1, 9);
        ctx.globalAlpha = al; ctx.fillRect(sx + 0.5, y, segW - 1, 4);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    function drawAliens(ctx, gA) {
      for (var i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (a.dead) continue;
        var L = lookOf(a.kind, a.v);
        blit(ctx, sprite(L.art, frameOf(a), a.flash > 0 ? '#ffffff' : L.c), a.x, a.y, gA, 1, a.grace > 0 ? 0.6 : 1);
        if (a.kind === 's' && a.shield > 0) drawShield(ctx, a);
        // bomber bay glows just before it drops (telegraph)
        if (a.kind === 'b' && a.state === 'form' && a.fireT < 0.6 && Math.floor(t * 14) % 2) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgba(255,90,79,0.35)'; ctx.fillRect(a.x + a.w / 2 - 7, a.y + a.h - 4, 14, 8);
          ctx.fillStyle = '#ffe0d0'; ctx.fillRect(a.x + a.w / 2 - 3, a.y + a.h - 2, 6, 4);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    function drawBoss(ctx, gA) {
      var b = boss, k;
      var alpha = b.dying > 0 ? 0.55 + Math.random() * 0.45 : 1;
      if (b.enter > 0 && Math.floor(t * 10) % 2) alpha *= 0.7;
      drawLaser(ctx, b);
      // gun pods (weak points in phase 1)
      for (k = 0; k < 2; k++) {
        var p = b.pods[k], px = b.x + p.dx - 15, py = b.y + POD_DY - 12;
        var pc = p.hp <= 0 ? '#2a2d3e' : p.flash > 0 ? '#ffffff' : p.hp < p.max * 0.4 ? WIDE_C : POD_C;
        ctx.fillStyle = 'rgba(155,140,255,0.5)';
        ctx.fillRect(b.x + p.dx - 2, b.y + 8, 4, POD_DY - 18);
        blit(ctx, sprite('pod', 0, pc, BOSS_PIX), px, py, p.hp > 0 ? gA : 0, 1, alpha);
      }
      blit(ctx, sprite('hull', 0, b.hullFlash > 0 ? '#e6e0ff' : HULL_C, BOSS_PIX), b.x - HULL_W / 2, b.y - HULL_H / 2, gA * 0.8, 1, alpha);
      // core: armoured shutter in phase 1, a pulsing eye once exposed
      var cy = b.y + CORE_DY;
      if (b.phase === 1) blit(ctx, sprite('coreShut', 0, STEEL_C, BOSS_PIX), b.x - 15, cy - 15, 0, 1, alpha);
      else {
        var pu = 0.5 + 0.5 * Math.sin(t * (b.phase === 3 ? 14 : 7));
        blit(ctx, sprite('coreEye', 0, b.core.flash > 0 ? '#ffffff' : LASER_C, BOSS_PIX), b.x - 15, cy - 15, 0.6 + pu * 0.5, 1, alpha);
        var look = U.clamp((player.x - b.x) / 40, -3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(b.x - 5 + look), Math.round(cy - 5), 10, 10);
      }
      // fan charge-up telegraph
      if (b.charge) {
        var o = fanOrigin(b, b.charge.pod), cr = 3 + (0.4 - b.charge.t) * 22;
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.arc(o.x, o.y, cr, 0, TAU);
        ctx.fillStyle = 'rgba(255,59,107,0.35)'; ctx.fill();
        ctx.beginPath(); ctx.arc(o.x, o.y, cr * 0.45, 0, TAU);
        ctx.fillStyle = '#ffd0dc'; ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    function drawLaser(ctx, b) {
      var L = b.las;
      if (!L) return;
      var ox = b.x, oy = b.y + CORE_DY + CORE_R;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (L.st === 'move' || L.st === 'tele') {
        // danger zone on the ground, hatched, with arrows showing the sweep
        var zx0 = Math.min(L.x0, L.x1) - LASER_HALF - 6, zx1 = Math.max(L.x0, L.x1) + LASER_HALF + 6;
        var on = Math.floor(t * 8) % 2, zt = BUNKER_Y - 14;
        ctx.fillStyle = 'rgba(255,45,85,' + (0.08 + (on ? 0.07 : 0)) + ')';
        ctx.fillRect(zx0, zt, zx1 - zx0, GROUND - zt);
        ctx.beginPath(); ctx.rect(zx0, zt, zx1 - zx0, GROUND - zt); ctx.clip();
        ctx.strokeStyle = 'rgba(255,45,85,0.28)'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (var hx = zx0 - 120; hx < zx1; hx += 16) { ctx.moveTo(hx, GROUND); ctx.lineTo(hx + 100, zt); }
        ctx.stroke();
        ctx.restore(); ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = LASER_C;
        ctx.fillRect(zx0, GROUND - 2, zx1 - zx0, 3);
        var dir = L.x1 > L.x0 ? 1 : -1, ay = GROUND - 12;
        for (var k = 0; k < 3; k++) {
          var ax = (L.x0 + L.x1) / 2 + (k - 1) * 22 * dir + dir * ((t * 40) % 22);
          ctx.beginPath(); ctx.moveTo(ax + dir * 7, ay); ctx.lineTo(ax - dir * 3, ay - 7); ctx.lineTo(ax - dir * 3, ay + 7); ctx.closePath();
          ctx.fillStyle = 'rgba(255,120,150,' + (0.5 + 0.5 * on) + ')'; ctx.fill();
        }
        if (L.st === 'tele') {
          var f = L.t / LASER_TELE;
          ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t * 60;
          ctx.strokeStyle = 'rgba(255,45,85,' + (0.35 + 0.6 * f * (on ? 1 : 0.6)) + ')';
          ctx.lineWidth = 1 + f * 2;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, GROUND); ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath(); ctx.arc(ox, oy, 4 + f * 10, 0, TAU);
          ctx.fillStyle = 'rgba(255,120,150,' + (0.3 + f * 0.5) + ')'; ctx.fill();
        }
      } else if (L.st === 'fire') {
        var end = L.end, jit = Math.random() * 3;
        ctx.fillStyle = 'rgba(255,45,85,0.16)'; ctx.fillRect(ox - 20 - jit, oy, 40 + jit * 2, end - oy);
        ctx.fillStyle = 'rgba(255,45,85,0.55)'; ctx.fillRect(ox - LASER_HALF, oy, LASER_HALF * 2, end - oy);
        ctx.fillStyle = 'rgba(255,235,240,0.95)'; ctx.fillRect(ox - 3 - jit / 2, oy, 6 + jit, end - oy);
        ctx.beginPath(); ctx.arc(ox, end, 14 + jit * 2, 0, TAU);
        ctx.fillStyle = 'rgba(255,120,150,0.45)'; ctx.fill();
      }
      ctx.restore();
    }
    function drawUfo(ctx, gA) {
      if (!ufo) return;
      blit(ctx, sprite('ufo', Math.floor(t * 8) % 2, UFO_C), ufo.x - 24, UFO_Y - 10, gA + 0.2);
      // Hashstorm dressing: the mystery ship carries a ₿ and a MYSTERY BLOCK tag (display only)
      U.btc(ctx, ufo.x, UFO_Y - 0.5, 6, { glow: 6 });
      U.glowText(ctx, 'MYSTERY BLOCK', ufo.x, UFO_Y - 17, 7, UFO_C, 'center');
    }
    function drawCaps(ctx) {
      for (var i = 0; i < caps.length; i++) {
        var c = caps[i], P = POWERS[c.kind];
        ctx.save();
        ctx.translate(Math.round(c.x), Math.round(c.y + Math.sin(c.t * 6) * 1.5));
        ctx.beginPath(); roundPath(ctx, -18, -9, 36, 18, 8);
        ctx.fillStyle = 'rgba(6,6,20,0.9)'; ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = P.c;
        ctx.globalAlpha = 0.3; ctx.lineWidth = 6; ctx.stroke();
        ctx.globalAlpha = 1; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.font = '10px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = P.c; ctx.fillText(P.label, 0, 1);
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.45; ctx.fillText(P.label, 0, 1);
        ctx.restore();
      }
    }
    function drawShots(ctx) {
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < shots.length; i++) {
        var s = shots[i], sl = s.vx ? s.vx * 0.02 : 0;
        if (s.pierce) {
          ctx.fillStyle = 'rgba(199,125,255,0.35)'; ctx.fillRect(s.x - 4, s.y - 12, 8, 26);
          ctx.fillStyle = '#f0dcff'; ctx.fillRect(s.x - 1.5, s.y - 10, 3, 22);
        } else {
          var c = s.drone ? 'rgba(57,255,136,0.35)' : 'rgba(160,255,220,0.3)';
          ctx.fillStyle = c; ctx.fillRect(s.x - 3 - sl, s.y - 10, 6, 16);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(s.x - 1 - sl / 2, s.y - 8, 2, 11);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    function drawBombs(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < bombs.length; i++) {
        var b = bombs[i];
        if (b.type === 'zig') {
          var z = Math.floor(t * 20 + i) % 2 ? 3 : -3;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y - 10); ctx.lineTo(b.x + z, b.y - 6); ctx.lineTo(b.x - z, b.y - 2); ctx.lineTo(b.x, b.y + 2);
          ctx.strokeStyle = ZIG_C; ctx.globalAlpha = 0.3; ctx.lineWidth = 6; ctx.stroke();
          ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke();
        } else if (b.type === 'wide') {
          var pr = 6 + Math.sin(t * 16 + i) * 1.2;
          ctx.beginPath(); ctx.ellipse(b.x, b.y, pr * 1.6 + 6, pr + 5, 0, 0, TAU); ctx.fillStyle = 'rgba(255,90,79,0.25)'; ctx.fill();
          ctx.beginPath(); ctx.ellipse(b.x, b.y, pr * 1.6, pr, 0, 0, TAU); ctx.fillStyle = WIDE_C; ctx.fill();
          ctx.fillStyle = '#ffd0c8'; ctx.fillRect(b.x - pr * 1.6 - 3, b.y - 1, 3, 2); ctx.fillRect(b.x + pr * 1.6, b.y - 1, 3, 2);
          ctx.beginPath(); ctx.arc(b.x, b.y - 1, pr * 0.45, 0, TAU); ctx.fillStyle = '#ffe6d6'; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(b.x, b.y, 7, 0, TAU); ctx.fillStyle = 'rgba(255,59,107,0.3)'; ctx.fill();
          ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, TAU); ctx.fillStyle = ORB_C; ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.fillRect(b.x - 1, b.y - 1, 2, 2);
        }
      }
      ctx.restore();
    }
    function drawPlayer(ctx, gA) {
      if (power.drone > 0 && player.alive) {
        var da = power.drone < 3 && Math.floor(t * 8) % 2 ? 0.4 : 1;
        blit(ctx, sprite('drone', 0, POWERS.drone.c, 2), drone.x - 7, PY - 10 + Math.sin(t * 5) * 2, gA, 1, da);
      }
      if (!player.alive) return;
      var blink = player.inv > 0 && Math.floor(t * 12) % 2 ? 0.35 : 1;
      blit(ctx, sprite('cannon', 0, ACCENT), player.x - 16.5, PY - 10.5 + player.recoil * 2, gA + 0.1, 1, blink);
      if (player.shield) {
        var sa = 0.55 + 0.3 * Math.sin(t * 6);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.ellipse(player.x, PY - 1, 25, 17, 0, Math.PI, TAU);
        ctx.strokeStyle = POWERS.shield.c;
        ctx.globalAlpha = sa * 0.3; ctx.lineWidth = 6; ctx.stroke();
        ctx.globalAlpha = sa; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
      }
    }
    function drawBits(ctx) {
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        ctx.globalAlpha = Math.max(0, b.life / b.max);
        ctx.fillStyle = b.c;
        ctx.fillRect(b.x - b.s / 2, b.y - b.s / 2, b.s, b.s);
      }
      ctx.globalAlpha = 1;
      for (var k = 0; k < rings.length; k++) {
        var r = rings[k], ra = 1 - r.t / r.life;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU);
        ctx.strokeStyle = r.c;
        ctx.globalAlpha = ra * 0.3; ctx.lineWidth = 6; ctx.stroke();
        ctx.globalAlpha = ra; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    function drawHud(ctx, gA) {
      var k;
      // ground line + lives
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(57,255,136,0.25)'; ctx.fillRect(0, GROUND - 1, W, 4);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = ACCENT; ctx.fillRect(0, GROUND, W, 2);
      var cs = sprite('cannon', 0, ACCENT);
      for (k = 0; k < lives; k++) blit(ctx, cs, 26 + k * 26, GROUND + 7, 0, 0.6);
      U.glowText(ctx, boss ? 'BOSS ' + bossN : 'WAVE ' + wave, 22, 16, 9, boss ? LASER_C : ACCENT, 'left');
      // active power-ups: pill + draining timer bar, right to left
      var x = W - 22;
      for (k = POWER_ORDER.length - 1; k >= 0; k--) {
        var key = POWER_ORDER[k], P = POWERS[key];
        var on = key === 'shield' ? player.shield : power[key] > 0;
        if (!on) continue;
        var frac = key === 'shield' ? 1 : power[key] / P.time;
        var warn = frac < 0.25 && Math.floor(t * 8) % 2;
        ctx.globalAlpha = warn ? 0.4 : 1;
        ctx.beginPath(); roundPath(ctx, x - 32, 7, 32, 15, 6);
        ctx.fillStyle = 'rgba(6,6,20,0.85)'; ctx.fill();
        ctx.strokeStyle = P.c; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.font = '9px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = P.c; ctx.fillText(P.label, x - 16, 15);
        ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x - 32, 25, 32, 3);
        ctx.fillStyle = P.c; ctx.fillRect(x - 32, 25, 32 * frac, 3);
        ctx.globalAlpha = 1;
        x -= 38;
      }
      if (boss) drawBossBar(ctx);
    }
    function drawBossBar(ctx) {
      var bw = 240, bx = W / 2 - bw / 2, by = 38, b = boss;
      var pm = b.pods[0].max, cm = b.core.max, tot = pm * 2 + cm;
      U.glowText(ctx, 'MOTHERSHIP MK ' + bossN + (b.phase > 1 ? '  P' + b.phase : ''), W / 2, by - 9, 8, '#ffb35c');
      ctx.fillStyle = 'rgba(10,10,26,0.9)'; ctx.fillRect(bx - 2, by - 2, bw + 4, 10);
      var segs = [[b.pods[0].hp, pm, POD_C], [b.pods[1].hp, pm, POD_C], [b.core.hp, cm, LASER_C]], sx = bx;
      for (var k = 0; k < 3; k++) {
        var sw = bw * segs[k][1] / tot;
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(sx + 1, by, sw - 2, 6);
        ctx.fillStyle = segs[k][2]; ctx.fillRect(sx + 1, by, (sw - 2) * segs[k][0] / segs[k][1], 6);
        sx += sw;
      }
      ctx.strokeStyle = 'rgba(255,179,92,0.7)'; ctx.lineWidth = 1; ctx.strokeRect(bx - 2.5, by - 2.5, bw + 5, 11);
    }
    function drawBanner(ctx) {
      if (!banner) return;
      var b = banner, a = Math.min(1, b.t * 2, (2.8 - b.t) * 6), y = 350;
      if (b.warn && Math.floor(t * 6) % 2) a *= 0.45;
      ctx.globalAlpha = a * 0.7;
      ctx.fillStyle = '#02030a'; ctx.fillRect(0, y - 44, W, 84);
      ctx.fillStyle = b.color; ctx.fillRect(0, y - 44, W, 1); ctx.fillRect(0, y + 39, W, 1);
      ctx.globalAlpha = a;
      if (b.top) U.glowText(ctx, b.top, W / 2, y - 28, 8, '#9fb4ff');
      if (b.kind) {
        var L = lookOf(b.kind, 0), s = sprite(L.art, Math.floor(t * 3) % 2, L.c);
        ctx.font = '800 16px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
        var tw = ctx.measureText(b.title).width;
        var lx = W / 2 - tw / 2 - s.w - 14, rx = W / 2 + tw / 2 + 14, sy = y - 4 - s.h / 2;
        blit(ctx, s, lx, sy, 0.8, 1, a);
        blit(ctx, s, rx, sy, 0.8, 1, a);
        if (b.kind === 's') { drawShieldBar(ctx, lx, sy + s.h + 2, s.w, 1, false, 0); drawShieldBar(ctx, rx, sy + s.h + 2, s.w, 1, false, 0); }
        ctx.globalAlpha = a;
      }
      U.glowText(ctx, b.title, W / 2, y - 2, b.kind ? 16 : 18, b.color);
      if (b.sub) U.glowText(ctx, b.sub, W / 2, y + 24, 8, '#ffd23f');
      ctx.globalAlpha = 1;
    }
    function drawCrt(ctx) {
      if (flash.a > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = flash.a * 0.35;
        ctx.fillStyle = flash.c; ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      // slow rolling refresh band
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(rollBand(), 0, (t * 60) % (H + 140) - 70, W, 64);
      ctx.drawImage(crtOverlay(W, H), 0, 0);
    }

    /* =========================================================== start up */
    startWave();
    if (M()) M().play(song(KEY), { fade: 1.2, intensity: 0 });

    /* ================================================== public interface */
    return {
      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        stepVisuals(dt);
        if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }
        crumbleT -= dt;
        if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
        updatePlayer(dt, inp);
        updateShots(dt);
        updateBombs(dt);
        updateCaps(dt);
        updateUfo(dt);
        if (clearT > 0) {
          clearT -= dt;
          if (clearT <= 0) startWave();
        } else {
          if (boss) updateBoss(dt);
          else { updateFormation(dt); formationFire(dt); launchDives(dt); }
          updateMovers(dt);
          compactAliens();
          if (!boss && !over && !aliens.length) waveCleared();
        }
        syncMusic();
        status();
      },

      render: function (ctx) {
        var pulse = M() ? M().pulse(6) : 0, gA = 0.45 + pulse * 0.25;
        ctx.save();
        drawBackground(ctx);
        drawBunkers(ctx);
        if (boss) drawBoss(ctx, gA);
        drawAliens(ctx, gA);
        drawUfo(ctx, gA);
        drawCaps(ctx);
        drawShots(ctx);
        drawBombs(ctx);
        drawPlayer(ctx, gA);
        drawBits(ctx);
        drawHud(ctx, gA);
        drawBanner(ctx);
        drawCrt(ctx);
        ctx.restore();
      },

      // Read-only snapshot for tests.
      debug: function () {
        var kinds = {}, n = 0, diving = 0;
        for (var i = 0; i < aliens.length; i++) {
          var a = aliens[i];
          if (a.dead) continue;
          n++;
          kinds[a.kind] = (kinds[a.kind] || 0) + 1;
          if (a.state === 'dive' || a.state === 'escort') diving++;
        }
        var pw = {};
        for (var k in power) pw[k] = Math.round(power[k] * 10) / 10;
        pw.shield = player.shield;
        return {
          wave: wave, formation: formation.name, invaders: n, kinds: kinds, diving: diving,
          boss: boss ? { hp: bossHp(), max: bossMax(), phase: boss.phase, pods: (podAlive(0) ? 1 : 0) + (podAlive(1) ? 1 : 0),
            laser: boss.las ? boss.las.st : null, dying: boss.dying > 0 } : null,
          power: pw, lives: lives, dead: !player.alive, over: over, ufo: !!ufo,
          capsules: caps.map(function (c) { return c.kind; }), bunkerCells: bunkerCells(), bombs: bombs.length
        };
      }
    };
  }

  /* ================================================================= attract */
  var ATTRACT_ROWS = [
    [['bomber', '#ff5a4f'], ['diver', '#ffd23f'], ['shielded', '#6f8bff'], ['splitter', '#ff9f1c']],
    [['gruntA', '#ff3fa4']],
    [['gruntB', '#b04dff']],
    [['gruntC', '#3ff0ff']]
  ];
  function attract(ctx, w, h, t) {
    ctx.save();
    ctx.fillStyle = '#02030a';
    ctx.fillRect(0, 0, w, h);
    var k, r, c;
    for (k = 0; k < 50; k++) {
      var sx = (k * 97.3) % w, sy = (k * 53.7 + t * (6 + (k % 3) * 8)) % h;
      ctx.fillStyle = 'rgba(190,210,255,' + (0.25 + 0.25 * Math.sin(t * 2 + k)) + ')';
      ctx.fillRect(sx, sy, k % 4 === 0 ? 2 : 1, k % 4 === 0 ? 2 : 1);
    }
    var sc = Math.max(0.4, h / 330), cell = CW * sc;
    var cols = Math.max(3, Math.min(8, Math.floor((w * 0.86) / cell)));
    var ox = (w - cols * cell) / 2 + Math.sin(t * 1.5) * w * 0.05;
    var frame = Math.floor(t * 3) % 2;
    for (r = 0; r < ATTRACT_ROWS.length; r++) {
      for (c = 0; c < cols; c++) {
        var e = ATTRACT_ROWS[r][c % ATTRACT_ROWS[r].length], s = sprite(e[0], frame, e[1]);
        blit(ctx, s, ox + c * cell + (cell - s.w * sc) / 2, h * 0.14 + r * CH * sc, 0.55, sc);
      }
    }
    // a diver swooping out of the formation
    var dt = (t % 4) / 4, dx = w * 0.5 + Math.sin(dt * TAU) * w * 0.32, dy = h * 0.2 + Math.sin(dt * Math.PI) * h * 0.45;
    blit(ctx, sprite('diver', Math.floor(t * 8) % 2, '#ffd23f'), dx - 15 * sc, dy, 0.7, sc);
    // mystery ship
    var ux = ((t * 50) % (w + 120)) - 60;
    blit(ctx, sprite('ufo', Math.floor(t * 8) % 2, UFO_C), ux - 24 * sc, h * 0.04, 0.6, sc);
    U.btc(ctx, ux, h * 0.04 + 9.5 * sc, 6 * sc, { glow: 6 * sc });
    // bunkers
    var bk = intactBunker();
    for (k = 0; k < 3; k++) blit(ctx, bk, w * (0.2 + k * 0.3) - BW * sc / 2, h * 0.62, 0.45, sc);
    // cannon firing
    var cx = w / 2 + Math.sin(t * 2) * w * 0.3, cyy = h * 0.76;
    blit(ctx, sprite('cannon', 0, ACCENT), cx - 16.5 * sc, cyy, 0.6, sc);
    var shy = cyy - ((t * h * 0.9) % (h * 0.7));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(160,255,220,0.35)'; ctx.fillRect(cx - 3 * sc, shy - 4, 6 * sc, 16 * sc);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(cx - sc, shy - 2, 2 * sc, 11 * sc);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(crtOverlay(w, h), 0, 0, w, h);
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_invader_wave',
    order: 14,
    title: 'Hashstorm',
    tagline: 'Hold the line. Clear the sky.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'shooter',
    controls: '\u2190\u2192 move \u00b7 Space fire (hold to keep firing)',
    create: create,
    attract: attract
  });
})(window);

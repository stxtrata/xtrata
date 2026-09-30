/*
 * Xtrata Arcade cartridge #18 - LUNAR LANDER (v2)
 * Rotate and burn to set the module down softly on a pad. Narrow pads pay
 * more (x2 / x3 / x5). Every landing refuels and brings a new surface; three
 * modules, fuel is shared across the run (each surface tops up a reserve).
 *
 *   WORLDS    cycle every 3 surfaces: MOON, MARS (wind), ICE MOON (low g,
 *             slippery pads), VOLCANIC (thermal updrafts, ash), GAS GIANT
 *             MOON (heavy gravity). Each has its own sky, terrain and music.
 *   MISSIONS  STANDARD LANDING, FUEL CACHE (optional floating pods) and
 *             CARGO RESCUE (optional crate at a beacon, deliver it to a pad).
 *   CAMERA    zooms in smoothly near the ground so the touchdown is readable.
 *
 * Contract game-id: xa_lunar_lander (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-lunar-lander');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ constants */
  var W = 600, H = 450, TAU = Math.PI * 2;
  var SEG = 20, N = W / SEG + 1;               // terrain = N points, SEG px apart
  var GROUND_MIN = 205, GROUND_MAX = H - 24;   // surface stays in the lower half
  var THRUST = 78, TURN = 2.6, BURN = 55, FUEL_MAX = 1000;
  var SAFE_VY = 42, SAFE_VX = 28, SAFE_A = 0.22;
  var FOOT = 10, HALF_SPAN = 9;                // feet: FOOT below centre, +-HALF_SPAN wide
  var SPAWN_Y = 40, CEILING = -150;
  var SPAWN_X0 = 210, SPAWN_X1 = W - 110;       // clear of the instrument panel
  var SURFACES_PER_WORLD = 3;
  var FIFTHS = [0, 7, 2];                      // key per surface: round the circle of fifths
  var CARD_SECS = 3.4;                         // mission card on screen
  var LAND_SECS = 2.4, CRASH_SECS = 1.8, LOAD_SECS = 1.0;
  var ZOOM_MAX = 1.9, ZOOM_NEAR = 55, ZOOM_FAR = 170;  // altitude for full / no zoom
  var GEAR_ALT = 140;                          // landing gear extends below this
  var CARGO_THRUST = 0.88;                     // a crate aboard makes the module heavier
  var BEACON_FUEL = 120;                       // the beacon tops you up while loading
  var POD_RADIUS = 22, POD_FUEL = 90, POD_PTS = 40, CACHE_BONUS = 150;
  var THERMAL_HALF = 22;                       // half width of a thermal column
  var ICE_FRICTION = 7;                        // px/s^2 - touchdown skid on ice pads
  var MAX_PARTS = 420;
  var SKY_RES = 2, GROUND_RES = 2;             // offscreen caches are drawn at 2x for zoom
  var CLOSED = 2400, OPEN = 9000;              // master filter: idle vs thrusting

  var ACCENT = '#c9d4ff', OK = '#39ff88', WARN = '#ffd23f', BAD = '#ff4d6d';
  var FLAME = '#ffb35c', BEACON = '#7df9ff', POD = '#b8ff5c';
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';

  /* =================================================================== worlds
     gravity    px/s^2 pulling down (thrust is 78)
     safeVx     horizontal speed limit at touchdown
     reserve    fuel the tank is topped up to at each spawn (keeps pads reachable)
     refuel     fuel added per landing
     wind       { min, max, gust, freq } px/s^2 sideways, telegraphed on the HUD
     thermals   { count, strength, reach } rising columns above lava vents
     terrain    { base, rough, smooth, mesa, spires } for the random walk        */
  var WORLDS = [
    {
      id: 'moon', name: 'MOON', gravity: 30, safeVx: SAFE_VX, reserve: 400, refuel: 250,
      wind: null, thermals: null, ash: false, slippery: false, crystals: false,
      hint: 'CLASSIC PHYSICS - NO AIR',
      terrain: { base: 340, rough: 70, smooth: 0, mesa: false, spires: 0, craters: 9 },
      sky: { top: '#02030a', mid: '#05060f', bottom: '#0b0e1d', stars: 110, planet: 'earth' },
      ridges: ['#0c0f1c', '#121524'],
      ground: { top: '#1b1d2c', deep: '#07080f', rim: '#c9d4ff', strata: 'rgba(201,212,255,0.10)',
        crater: 'rgba(0,0,0,0.38)', craterRim: 'rgba(201,212,255,0.16)', dust: '#b9bfd6' },
      closed: CLOSED,
      music: { key: 53, scale: 'lydian', bpm: 70, chords: [0, 4, 5, 1], bells: [0, 2, 4, 6, 7], bellProb: 0.16, padCut: 900 }
    },
    {
      id: 'mars', name: 'MARS', gravity: 22, safeVx: SAFE_VX, reserve: 480, refuel: 260,
      wind: { min: 4, max: 10, gust: 4, freq: 0.45 }, thermals: null, ash: false, slippery: false, crystals: false,
      hint: 'WIND - WATCH THE WINDSOCKS',
      terrain: { base: 330, rough: 60, smooth: 1, mesa: true, spires: 0, craters: 4 },
      sky: { top: '#1a0a0c', mid: '#4a1f1a', bottom: '#b0593a', stars: 30, planet: 'moons' },
      ridges: ['#5a2a20', '#6e3322'],
      ground: { top: '#6a2f1c', deep: '#1a0906', rim: '#ffab7a', strata: 'rgba(255,171,122,0.13)',
        crater: 'rgba(40,10,5,0.40)', craterRim: 'rgba(255,190,150,0.16)', dust: '#e89a6c' },
      closed: 2100,
      music: { key: 50, scale: 'dorian', bpm: 66, chords: [0, 3, 4, 0], bells: [0, 2, 4, 5, 7], bellProb: 0.12, padCut: 800 }
    },
    {
      id: 'ice', name: 'ICE MOON', gravity: 15, safeVx: 12, reserve: 330, refuel: 230,
      wind: null, thermals: null, ash: false, slippery: true, crystals: true,
      hint: 'LOW GRAVITY - ICY PADS: DRIFT UNDER 12',
      terrain: { base: 345, rough: 46, smooth: 2, mesa: false, spires: 4, craters: 5 },
      sky: { top: '#01050d', mid: '#041325', bottom: '#0d3346', stars: 120, planet: 'ringed' },
      ridges: ['#0a2233', '#0f2d40'],
      ground: { top: '#2a5a70', deep: '#061420', rim: '#a8f4ff', strata: 'rgba(168,244,255,0.14)',
        crater: 'rgba(0,20,35,0.35)', craterRim: 'rgba(200,250,255,0.22)', dust: '#d6f7ff' },
      closed: 2800,
      music: { key: 57, scale: 'pentatonic', bpm: 74, chords: [0, 3, 1, 2], bells: [0, 1, 2, 3, 4, 5], bellProb: 0.2, padCut: 1200 }
    },
    {
      id: 'volcanic', name: 'VOLCANIC', gravity: 34, safeVx: SAFE_VX, reserve: 460, refuel: 260,
      wind: null, thermals: { count: 2, strength: 70, reach: 240 }, ash: true, slippery: false, crystals: false,
      hint: 'THERMALS PUSH YOU UP OVER THE VENTS',
      terrain: { base: 350, rough: 84, smooth: 0, mesa: false, spires: 0, craters: 3 },
      sky: { top: '#070103', mid: '#1e0507', bottom: '#4d130b', stars: 25, planet: 'sun' },
      ridges: ['#230806', '#2e0b07'],
      ground: { top: '#2c1310', deep: '#0a0303', rim: '#ff7a45', strata: 'rgba(255,110,60,0.14)',
        crater: 'rgba(0,0,0,0.45)', craterRim: 'rgba(255,120,60,0.18)', dust: '#9a8078' },
      closed: 2000,
      music: { key: 52, scale: 'phrygian', bpm: 62, chords: [0, 1, 0, -1], bells: [0, 1, 4, 5, 7], bellProb: 0.1, padCut: 700 }
    },
    {
      id: 'giant', name: 'GAS GIANT MOON', gravity: 44, safeVx: SAFE_VX, reserve: 560, refuel: 320,
      wind: null, thermals: null, ash: false, slippery: false, crystals: false,
      hint: 'HEAVY GRAVITY - BURN EARLY',
      terrain: { base: 360, rough: 56, smooth: 1, mesa: false, spires: 0, craters: 10 },
      sky: { top: '#05020d', mid: '#120a24', bottom: '#2a1638', stars: 70, planet: 'giant' },
      ridges: ['#1a1030', '#22143a'],
      ground: { top: '#2d2240', deep: '#0a0612', rim: '#d9a8ff', strata: 'rgba(217,168,255,0.12)',
        crater: 'rgba(0,0,0,0.40)', craterRim: 'rgba(217,168,255,0.18)', dust: '#b9a3d6' },
      closed: 2200,
      music: { key: 48, scale: 'harmonic', bpm: 58, chords: [0, 5, 3, 4], bells: [0, 2, 4, 6, 7], bellProb: 0.1, padCut: 750 }
    }
  ];

  /* ================================================================= missions */
  var MISSIONS = {
    land: { title: 'STANDARD LANDING', line: 'Set down softly on a pad. Narrow pads pay more.' },
    fuel: { title: 'FUEL CACHE', line: 'Optional: collect the floating fuel pods, then land.' },
    cargo: { title: 'CARGO RESCUE', line: 'Optional: land at the beacon for the crate, then on a pad.' }
  };
  var MISSION_CYCLE = ['land', 'fuel', 'cargo'];
  function missionFor(level) { return level === 1 ? 'land' : MISSION_CYCLE[(level - 1) % MISSION_CYCLE.length]; }

  /* ==================================================================== music
     Ambient, no drums. Each world is its own key/scale/tempo/colour; thrust
     opens the filter and a drone track, ticks arrive with the ground.        */
  var WORLD_EXTRAS = {
    moon: function () { return []; },
    mars: function () {
      return [
        { name: 'dust', inst: 'shaker', layer: 0, gain: 0.14, pattern: '..x...x...x..x..' },
        { name: 'gust', inst: 'riser', layer: 0, gain: 0.12,
          fn: function (i) { return i.step % 64 === 32 ? { deg: 0, steps: 24, vel: 0.6 } : null; } },
        { name: 'pluck', inst: 'pluck', layer: 0.3, gain: 0.16, chord: true, rate: 2, params: { cutoff: 1800, decay: 0.5 },
          fn: function (i) { return i.rng() < 0.2 ? { deg: [0, 2, 4, 5][Math.floor(i.rng() * 4)], vel: 0.6 } : null; } }
      ];
    },
    ice: function () {
      return [
        { name: 'glass', inst: 'marimba', layer: 0, gain: 0.18, chord: true, octave: 1, rate: 4,
          fn: function (i) { return { deg: [0, 2, 4, 2, 5, 4, 2, 1][(i.step / 4) % 8], vel: 0.55 }; } }
      ];
    },
    volcanic: function () {
      return [
        { name: 'rumble', inst: 'bass', layer: 0, gain: 0.24, chord: true, octave: -2, params: { cutoff: 260, q: 4 },
          pattern: '0 - - - . . . . . . 0 - . . . .' },
        { name: 'embers', inst: 'pluck', layer: 0.3, gain: 0.14, chord: true, rate: 2, params: { cutoff: 1400, decay: 0.4 },
          fn: function (i) { return i.rng() < 0.15 ? { deg: [0, 1, 4][Math.floor(i.rng() * 3)], vel: 0.6 } : null; } }
      ];
    },
    giant: function () {
      return [
        { name: 'swell', inst: 'pad', layer: 0, gain: 0.28, octave: -2, params: { attack: 2.5, release: 3, cutoff: 500 },
          fn: function (i) { return i.step % 64 === 0 ? [{ deg: 0, steps: 60 }, { deg: 4, steps: 60 }] : null; } },
        { name: 'pull', inst: 'sub', layer: 0, gain: 0.3, octave: -2, pattern: '0 - . . . . . . 0 . . . . . . .' }
      ];
    }
  };
  function song(world, seed) {
    var m = world.music;
    var tracks = [
      { name: 'drone', inst: 'sub', layer: 0, gain: 0.38, octave: -1,
        fn: function (i) { return i.stepInBar === 0 ? { deg: 0, steps: 16, vel: 0.7 } : null; } },
      { name: 'pad', inst: 'pad', layer: 0, gain: 0.36, chord: true, octave: -1, params: { attack: 1.4, release: 2.2, cutoff: m.padCut },
        fn: function (i) { return i.step % 32 === 0 ? [{ deg: 0, steps: 30 }, { deg: 2, steps: 30 }, { deg: 4, steps: 30 }, { deg: 6, steps: 30 }] : null; } },
      { name: 'bells', inst: 'bell', layer: 0, gain: 0.28, chord: true, octave: 1, rate: 2,
        fn: function (i) { return i.rng() < m.bellProb ? { deg: m.bells[Math.floor(i.rng() * m.bells.length)], vel: 0.5 } : null; } },
      { name: 'thrust', inst: 'pad', layer: 2, gain: 0.4, octave: -2, rate: 4, params: { attack: 0.06, release: 0.5, cutoff: 420 },
        fn: function () { return [{ deg: 0, steps: 4 }, { deg: 4, steps: 4 }]; } },
      { name: 'tick1', inst: 'hat', layer: 0.3, maxLayer: 0.6, gain: 0.28, pattern: 'x...x...x...x...' },
      { name: 'tick2', inst: 'hat', layer: 0.6, maxLayer: 0.85, gain: 0.3, pattern: 'x.x.x.x.x.x.x.xx' },
      { name: 'tick3', inst: 'hat', layer: 0.85, gain: 0.32, pattern: 'xxxxXxxxxxxxXxxx' },
      { name: 'heart', inst: 'sub', layer: 0.6, gain: 0.4, chord: true, octave: -1, pattern: '0 . . 0 . . . . . . . . . . . .' }
    ].concat(WORLD_EXTRAS[world.id]());
    return { bpm: m.bpm, key: m.key, scale: m.scale, chords: m.chords, barsPerChord: 2, seed: seed, filter: world.closed, tracks: tracks };
  }

  /* ========================================================= small utilities */
  function makeCanvas(w, h) {
    var cv = root.document.createElement('canvas');
    cv.width = w; cv.height = h;
    return cv;
  }
  function smooth01(v) { v = U.clamp(v, 0, 1); return v * v * (3 - 2 * v); }
  function approach(cur, target, rate, dt) { return cur + (target - cur) * (1 - Math.exp(-rate * dt)); }
  // green inside 70% of a limit, amber up to it, red past it
  function limitColor(v, lim) { v = Math.abs(v); return v < lim * 0.7 ? OK : v < lim ? WARN : BAD; }
  function padColor(mult) { return mult >= 5 ? BAD : mult >= 3 ? WARN : OK; }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* ============================================================ lander art
     Drawn at the origin, unrotated; +y is down. Feet reach y = FOOT when the
     gear is fully out (legs = 1).                                           */
  function drawLander(ctx, o) {
    var legs = o.legs, col = o.color || ACCENT;
    ctx.save();
    ctx.translate(o.x, o.y); ctx.rotate(o.a);
    if (o.scale) ctx.scale(o.scale, o.scale);
    if (o.flame > 0) drawFlame(ctx, o.flame);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = col; ctx.lineWidth = 1.4;
    ctx.shadowColor = col; ctx.shadowBlur = o.glow == null ? 8 : o.glow;
    // landing gear
    var fx = 9 + legs * 3, fy = 4 + legs * 6;
    ctx.beginPath();
    ctx.moveTo(-6, 3); ctx.lineTo(-fx, fy); ctx.moveTo(6, 3); ctx.lineTo(fx, fy);
    ctx.moveTo(-8, 0); ctx.lineTo(-fx + 1, fy - 3); ctx.moveTo(8, 0); ctx.lineTo(fx - 1, fy - 3);
    ctx.moveTo(-fx - 2.5, fy); ctx.lineTo(-fx + 2.5, fy); ctx.moveTo(fx - 2.5, fy); ctx.lineTo(fx + 2.5, fy);
    ctx.stroke();
    // crate carried between the legs
    if (o.crate) {
      ctx.fillStyle = '#6b4a1e'; ctx.fillRect(-4, 4.5, 8, 5);
      ctx.strokeStyle = BEACON; ctx.shadowColor = BEACON; ctx.strokeRect(-4, 4.5, 8, 5);
      ctx.strokeStyle = col; ctx.shadowColor = col;
    }
    // descent stage (gold foil)
    ctx.fillStyle = 'rgba(255,196,90,0.22)';
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.lineTo(7, 5); ctx.lineTo(-7, 5); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // cosmetic: small ₿ badge on the descent stage
    U.btc(ctx, 0, 2.6, 3.1, { glow: 3 });
    // ascent cabin
    ctx.fillStyle = 'rgba(201,212,255,0.14)';
    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-7, -6); ctx.lineTo(-3, -11); ctx.lineTo(3, -11); ctx.lineTo(7, -6); ctx.lineTo(6, 0); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7df9ff'; ctx.shadowColor = '#7df9ff';
    ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(2, -8); ctx.lineTo(3, -5); ctx.lineTo(-3, -5); ctx.closePath(); ctx.fill();
    // antenna + RCS quads
    ctx.beginPath(); ctx.moveTo(2, -11); ctx.lineTo(4, -15); ctx.moveTo(-8.5, -5); ctx.lineTo(-10, -5); ctx.moveTo(8.5, -5); ctx.lineTo(10, -5);
    ctx.stroke();
    ctx.restore();
  }
  function drawFlame(ctx, k) {
    var len = 10 + k * (10 + Math.random() * 8);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createLinearGradient(0, 5, 0, 5 + len);
    g.addColorStop(0, 'rgba(255,245,200,0.95)'); g.addColorStop(0.35, 'rgba(255,170,80,0.8)'); g.addColorStop(1, 'rgba(255,80,40,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-4.5, 5); ctx.quadraticCurveTo(0, 5 + len * 1.1, 4.5, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,240,0.9)';
    ctx.beginPath(); ctx.moveTo(-2, 5); ctx.quadraticCurveTo(0, 5 + len * 0.5, 2, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* ================================================================== planets */
  function drawPlanet(c, kind) {
    c.save();
    if (kind === 'earth') {
      c.fillStyle = '#1f4fa8'; c.shadowColor = '#3f8cff'; c.shadowBlur = 22;
      c.beginPath(); c.arc(505, 72, 22, 0, TAU); c.fill();
      c.shadowBlur = 0; c.fillStyle = 'rgba(80,190,120,0.55)';
      c.beginPath(); c.arc(498, 66, 7, 0, TAU); c.arc(506, 84, 5, 0, TAU); c.fill();
      c.fillStyle = '#03040b';
      c.beginPath(); c.arc(515, 66, 21, 0, TAU); c.fill();
    } else if (kind === 'moons') {
      [[470, 58, 8], [545, 104, 4.5]].forEach(function (m) {
        c.fillStyle = '#8a7a70'; c.shadowColor = '#ffcfa0'; c.shadowBlur = 10;
        c.beginPath(); c.arc(m[0], m[1], m[2], 0, TAU); c.fill();
        c.shadowBlur = 0; c.fillStyle = 'rgba(30,10,10,0.55)';
        c.beginPath(); c.arc(m[0] + m[2] * 0.4, m[1] + m[2] * 0.2, m[2], 0, TAU); c.fill();
      });
    } else if (kind === 'ringed') {
      c.translate(470, 92); c.rotate(-0.35);
      c.strokeStyle = 'rgba(190,240,255,0.35)'; c.lineWidth = 3;
      c.beginPath(); c.ellipse(0, 0, 80, 16, 0, Math.PI, TAU); c.stroke();
      var g = c.createRadialGradient(-14, -14, 4, 0, 0, 44);
      g.addColorStop(0, '#d9f7ff'); g.addColorStop(0.6, '#6fb4cf'); g.addColorStop(1, '#1d4a60');
      c.fillStyle = g; c.shadowColor = '#9ff3ff'; c.shadowBlur = 18;
      c.beginPath(); c.arc(0, 0, 44, 0, TAU); c.fill();
      c.shadowBlur = 0; c.strokeStyle = 'rgba(210,248,255,0.5)';
      c.beginPath(); c.ellipse(0, 0, 80, 16, 0, 0, Math.PI); c.stroke();
    } else if (kind === 'sun') {
      var sx = 420, sy = 150;
      var sg = c.createRadialGradient(sx, sy, 6, sx, sy, 90);
      sg.addColorStop(0, 'rgba(255,170,90,0.9)'); sg.addColorStop(0.3, 'rgba(255,90,40,0.35)'); sg.addColorStop(1, 'rgba(255,60,20,0)');
      c.fillStyle = sg; c.fillRect(sx - 100, sy - 100, 200, 200);
      c.fillStyle = '#ffb070'; c.beginPath(); c.arc(sx, sy, 20, 0, TAU); c.fill();
      c.fillStyle = 'rgba(20,4,4,0.55)';                     // smoke bands drift across it
      for (var i = 0; i < 4; i++) c.fillRect(sx - 90, sy - 26 + i * 16 + (i % 2) * 5, 180, 4 + (i % 2) * 3);
    } else if (kind === 'giant') {
      c.beginPath(); c.arc(520, 30, 150, 0, TAU); c.clip();
      var bands = ['#6b3f7a', '#a36a8f', '#e0b48a', '#b5796c', '#7c4a86', '#d59c86', '#8f5a8a', '#5d3670'];
      for (var b = 0; b < 16; b++) {
        c.fillStyle = bands[b % bands.length];
        c.fillRect(360, -120 + b * 19, 320, 20);
      }
      c.fillStyle = 'rgba(255,220,200,0.35)';
      c.beginPath(); c.ellipse(470, 110, 22, 9, -0.1, 0, TAU); c.fill();       // the storm eye
      var shade = c.createLinearGradient(380, 0, 560, 90);
      shade.addColorStop(0, 'rgba(5,2,13,0.9)'); shade.addColorStop(0.55, 'rgba(5,2,13,0.15)'); shade.addColorStop(1, 'rgba(5,2,13,0)');
      c.fillStyle = shade; c.fillRect(360, -130, 330, 330);
    }
    c.restore();
  }
  function drawRidge(c, y0, amp, col, seedA) {
    c.fillStyle = col;
    c.beginPath(); c.moveTo(0, H);
    for (var x = 0; x <= W; x += 10) {
      var y = y0 + Math.sin(x * 0.011 + seedA) * amp + Math.sin(x * 0.037 + seedA * 2) * amp * 0.4 + Math.sin(x * 0.09 + seedA) * amp * 0.12;
      c.lineTo(x, y);
    }
    c.lineTo(W, H); c.closePath(); c.fill();
  }

  /* ================================================================== create */
  function create(api) {
    var rng = api.rng;

    // ---- run state ------------------------------------------------------
    var level = 0, ships = 3, fuel = FUEL_MAX, t = 0;
    var worldIdx = -1, world = WORLDS[0], surfIdx = 0, lap = 0;
    var mission = 'land', cargo = 'none', loadT = 0, podsTaken = 0;
    var ground = [], pads = [], vents = [], pods = [], beacon = null, windSurf = null;
    var ship = null, debris = [], parts = [];
    var phase = 'fly', phaseT = 0, overT = 0, cardT = 0, crashAt = null, crashReason = '';
    var skyCv = null, groundCv = null;
    var cam = { x: W / 2, y: H / 2, z: 1 };
    var music = { worldId: null, key: null, burn: false, band: 0, fuelWarn: false };

    /* ------------------------------------------------------- terrain queries */
    function groundAt(x) {
      var i = U.clamp(Math.floor(x / SEG), 0, N - 2);
      var f = U.clamp((x - i * SEG) / SEG, 0, 1);
      return ground[i] + (ground[i + 1] - ground[i]) * f;
    }
    function footGround(s) { return Math.min(groundAt(s.x - HALF_SPAN), groundAt(s.x + HALF_SPAN)); }
    function altitudeOf(s) { return footGround(s) - s.y - FOOT; }
    function padAt(x) {
      for (var i = 0; i < pads.length; i++) if (x > pads[i].a * SEG + 6 && x < pads[i].b * SEG - 6) return pads[i];
      return null;
    }
    function onBeacon(x) { return !!beacon && x > beacon.a * SEG + 4 && x < beacon.b * SEG - 4; }

    /* ---------------------------------------------------- terrain generation */
    function generateGround() {
      var tp = world.terrain, rough = tp.rough + lap * 12 + surfIdx * 6, i, k;
      var g = [], h = tp.base + (rng() - 0.5) * 50;
      for (i = 0; i < N; i++) {
        h = U.clamp(h + (rng() - 0.5) * rough, GROUND_MIN, GROUND_MAX);
        g.push(h);
      }
      for (k = 0; k < tp.smooth; k++) {
        for (i = 1; i < N - 1; i++) g[i] = (g[i - 1] + g[i] * 2 + g[i + 1]) / 4;
      }
      if (tp.mesa) {                       // stepped plateaus with a little grit
        for (i = 0; i < N; i++) g[i] = GROUND_MIN + Math.round((g[i] - GROUND_MIN) / 34) * 34 + (rng() - 0.5) * 6;
      }
      for (k = 0; k < tp.spires; k++) {    // sharp ice spires
        i = 2 + Math.floor(rng() * (N - 4));
        g[i] -= 30 + rng() * 40;
      }
      for (i = 0; i < N; i++) g[i] = U.clamp(g[i], GROUND_MIN - 20, GROUND_MAX);
      return g;
    }
    // A random run of `len` segments with `margin` free segments either side.
    function findFreeRun(len, used, margin) {
      for (var tries = 0; tries < 80; tries++) {
        var start = 1 + Math.floor(rng() * (N - len - 2));
        var clash = false;
        for (var k = start - margin; k <= start + len + margin; k++) if (used[k]) clash = true;
        if (!clash) return start;
      }
      return -1;
    }
    function flatten(start, len, used) {
      var y = U.clamp(ground[start], GROUND_MIN, GROUND_MAX);
      for (var k = start; k <= start + len; k++) { ground[k] = y; used[k] = true; }
      return y;
    }
    function placePads(used) {
      pads = [];
      [{ len: 4, mult: 2 }, { len: 3, mult: 3 }, { len: 2, mult: 5 }].forEach(function (sp) {
        var start = findFreeRun(sp.len, used, 1);
        if (start < 0) return;
        var y = flatten(start, sp.len, used);
        pads.push({ a: start, b: start + sp.len, y: y, mult: sp.mult, ph: rng() * TAU });
      });
    }
    function placeBeacon(used) {
      beacon = null;
      if (mission !== 'cargo') return;
      var start = findFreeRun(2, used, 1);
      if (start < 0) return;
      var y = flatten(start, 2, used);
      beacon = { a: start, b: start + 2, y: y, x: (start + 1) * SEG };
    }
    function placeVents(used) {
      vents = [];
      var th = world.thermals;
      if (!th) return;
      var count = th.count + (surfIdx > 0 ? 1 : 0), misses = 0;
      for (var n = 0; n < count; n++) {
        var idx = findFreeRun(0, used, 1);
        if (idx < 3 || idx > N - 4) { n--; if (++misses > 40) break; continue; }   // keep columns on screen
        ground[idx - 1] = Math.max(GROUND_MIN - 20, ground[idx - 1] - 16);   // a little cone
        ground[idx + 1] = Math.max(GROUND_MIN - 20, ground[idx + 1] - 16);
        ground[idx] = Math.min(ground[idx - 1], ground[idx + 1]) + 7;         // with a notch
        used[idx - 1] = used[idx] = used[idx + 1] = true;
        vents.push({ x: idx * SEG, y: ground[idx], strength: th.strength, reach: th.reach, ph: rng() * TAU });
      }
    }
    function placePods() {
      pods = [];
      if (mission !== 'fuel') return;
      for (var k = 0; k < 3; k++) {
        var x = U.clamp(W * (k + 0.5) / 3 + (rng() - 0.5) * 90, 40, W - 40);
        var hi = 110, lo = groundAt(x) - 70;
        pods.push({ x: x, y: hi + rng() * Math.max(0, lo - hi), taken: false, ph: rng() * TAU });
      }
    }
    function makeWind() {
      var w = world.wind;
      if (!w) return null;
      var mag = w.min + rng() * (w.max - w.min) + surfIdx * 1.5;   // later surfaces blow harder
      return { base: (rng() < 0.5 ? -1 : 1) * mag, gust: w.gust, freq: w.freq, ph: rng() * TAU, max: w.max + w.gust + 6 };
    }

    /* ------------------------------------------------------------- caches */
    function buildSky() {
      var cv = makeCanvas(W * SKY_RES, H * SKY_RES), c = cv.getContext('2d'), sk = world.sky;
      c.scale(SKY_RES, SKY_RES);
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, sk.top); g.addColorStop(0.55, sk.mid); g.addColorStop(1, sk.bottom);
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (var i = 0; i < sk.stars; i++) {
        var big = Math.random() < 0.12;
        c.fillStyle = 'rgba(225,232,255,' + (0.25 + Math.random() * (big ? 0.6 : 0.35)) + ')';
        c.fillRect(Math.random() * W, Math.random() * 300, big ? 1.6 : 1, big ? 1.6 : 1);
      }
      drawPlanet(c, sk.planet);
      var sa = Math.random() * 10;
      c.globalAlpha = 0.9; drawRidge(c, 262, 26, world.ridges[0], sa);
      c.globalAlpha = 1; drawRidge(c, 300, 20, world.ridges[1], sa + 3);
      return cv;
    }
    function groundPath(c) {
      c.beginPath(); c.moveTo(0, H + 2);
      for (var i = 0; i < N; i++) c.lineTo(i * SEG, ground[i]);
      c.lineTo(W, H + 2); c.closePath();
    }
    function buildGround() {
      var cv = makeCanvas(W * GROUND_RES, H * GROUND_RES), c = cv.getContext('2d'), gd = world.ground, i, k;
      c.scale(GROUND_RES, GROUND_RES);
      groundPath(c);
      var g = c.createLinearGradient(0, GROUND_MIN - 20, 0, H);
      g.addColorStop(0, gd.top); g.addColorStop(1, gd.deep);
      c.fillStyle = g; c.fill();
      c.save();
      groundPath(c); c.clip();
      // layered strata following the surface
      for (k = 1; k <= 5; k++) {
        c.strokeStyle = gd.strata; c.globalAlpha = 1 - k * 0.15; c.lineWidth = 1;
        c.beginPath();
        for (i = 0; i < N; i++) {
          var y = ground[i] + k * 15 + Math.sin(i * 1.7 + k * 2.3) * 3;
          if (i) c.lineTo(i * SEG, y); else c.moveTo(0, y);
        }
        c.stroke();
      }
      c.globalAlpha = 1;
      // craters: dark bowls with a lit lower lip
      var count = world.terrain.craters + 6;
      for (k = 0; k < count; k++) {
        var cx = Math.random() * W, top = groundAt(cx);
        var cy = top + 16 + Math.random() * Math.max(10, H - top - 26);
        var rx = 5 + Math.random() * 14, ry = rx * 0.35;
        c.fillStyle = gd.crater; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.fill();
        c.strokeStyle = gd.craterRim; c.lineWidth = 1;
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0.1, Math.PI - 0.1); c.stroke();
      }
      for (k = 0; k < 70; k++) {                       // pebbles
        var px = Math.random() * W, py = groundAt(px) + 4 + Math.random() * (H - groundAt(px));
        c.fillStyle = gd.strata; c.fillRect(px, py, 1.5, 1.5);
      }
      c.restore();
      // glowing rim line + soft inner highlight
      c.save();
      c.strokeStyle = gd.rim; c.lineWidth = 1.6; c.shadowColor = gd.rim; c.shadowBlur = 8; c.lineJoin = 'round';
      c.beginPath();
      for (i = 0; i < N; i++) { if (i) c.lineTo(i * SEG, ground[i]); else c.moveTo(0, ground[0]); }
      c.stroke();
      c.shadowBlur = 0; c.globalAlpha = 0.25; c.lineWidth = 1;
      c.beginPath();
      for (i = 0; i < N; i++) { if (i) c.lineTo(i * SEG, ground[i] + 3); else c.moveTo(0, ground[0] + 3); }
      c.stroke();
      c.restore();
      return cv;
    }

    /* ------------------------------------------------------ surface flow */
    function newSurface() {
      level++;
      var wi = Math.floor((level - 1) / SURFACES_PER_WORLD) % WORLDS.length;
      var worldChanged = wi !== worldIdx;
      worldIdx = wi; world = WORLDS[wi];
      surfIdx = (level - 1) % SURFACES_PER_WORLD;
      lap = Math.floor((level - 1) / (SURFACES_PER_WORLD * WORLDS.length));
      mission = missionFor(level);
      cargo = mission === 'cargo' ? 'waiting' : 'none';
      loadT = 0; podsTaken = 0;

      ground = generateGround();
      var used = {};
      placePads(used);
      placeBeacon(used);
      placeVents(used);
      placePods();
      windSurf = makeWind();

      if (worldChanged || !skyCv) skyCv = buildSky();
      groundCv = buildGround();
      parts.length = 0;
      cardT = CARD_SECS;
      musicForSurface();
      spawn();
    }
    function spawn() {
      ship = { x: SPAWN_X0 + rng() * (SPAWN_X1 - SPAWN_X0), y: SPAWN_Y, vx: (rng() - 0.5) * 70, vy: 5, a: (rng() - 0.5) * 0.6,
        burn: false, legs: 0, turn: 0, grounded: false, slide: 0 };
      fuel = Math.max(fuel, world.reserve);   // reserve tank: every surface is reachable
      fuelWarnReset();
      debris = []; crashAt = null;
      phase = 'fly';
      cam.x = ship.x; cam.y = H / 2; cam.z = 1;
    }

    /* ------------------------------------------------------------ forces */
    function windNow() {
      return windSurf ? windSurf.base + windSurf.gust * Math.sin(t * windSurf.freq + windSurf.ph) : 0;
    }
    function windAt(alt) {
      var shelter = alt < 40 ? 0.45 + 0.55 * Math.max(0, alt) / 40 : 1;   // calmer close to the ground
      return windNow() * shelter;
    }
    function ventBreath(v) { return 0.7 + 0.3 * Math.sin(t * 1.4 + v.ph); }
    function thermalLift(x, y) {
      var lift = 0;
      for (var i = 0; i < vents.length; i++) {
        var v = vents[i], dx = Math.abs(x - v.x), h = v.y - y;
        if (dx > THERMAL_HALF || h < 0 || h > v.reach) continue;
        lift += v.strength * ventBreath(v) * (1 - h / v.reach) * (0.5 + 0.5 * Math.cos(dx / THERMAL_HALF * Math.PI));
      }
      return lift;
    }

    /* --------------------------------------------------------- particles */
    function addPart(p) {
      if (parts.length >= MAX_PARTS) parts.shift();
      parts.push(p);
    }
    // kind: glow (additive dot) | smoke (grows, fades) | dust | streak (line) | flake (ash)
    function part(kind, x, y, vx, vy, life, size, color, grav, drag) {
      addPart({ kind: kind, x: x, y: y, vx: vx, vy: vy, life: life, max: life, size: size, color: color,
        grav: grav || 0, drag: drag == null ? 0.985 : drag });
    }
    function updateParts(dt) {
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life -= dt;
        p.vy += p.grav * dt; p.vx *= p.drag; p.vy *= p.drag;
        if (p.kind === 'flake') p.vx += Math.sin(t * 2 + p.size * 7) * 8 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if ((p.kind === 'flake' || p.kind === 'dust') && p.y > groundAt(p.x) + 2) p.life = Math.min(p.life, 0.08);
        if (p.life <= 0) parts.splice(i, 1);
      }
    }
    function nozzle(s) { return { x: s.x - Math.sin(s.a) * 7, y: s.y + Math.cos(s.a) * 7, dx: -Math.sin(s.a), dy: Math.cos(s.a) }; }
    function emitThrust(s, alt) {
      var n = nozzle(s);
      for (var k = 0; k < 2; k++) {
        var sp = 90 + Math.random() * 60, jit = (Math.random() - 0.5) * 30;
        part('glow', n.x, n.y, n.dx * sp + jit * n.dy + s.vx * 0.5, n.dy * sp - jit * n.dx + s.vy * 0.5, 0.3 + Math.random() * 0.15,
          2 + Math.random() * 2, Math.random() < 0.3 ? '#fff2b0' : Math.random() < 0.6 ? FLAME : '#ff6a3d');
      }
      if (Math.random() < 0.12) part('smoke', n.x, n.y + n.dy * 8, n.dx * 40 + s.vx * 0.3, n.dy * 40, 0.7, 2, 'rgba(170,170,190,', -6, 0.97);
      // dust kicked up where the exhaust hits the ground
      if (alt < 70 && n.dy > 0.3) {
        var hitX = n.x + n.dx / n.dy * Math.max(0, alt);
        var gy = groundAt(hitX), power = 1 - Math.max(0, alt) / 70;
        for (var d = 0; d < 3; d++) {
          var side = Math.random() < 0.5 ? -1 : 1;
          part('dust', hitX + side * Math.random() * 6, gy - 1, side * (60 + Math.random() * 90) * power, -(10 + Math.random() * 40) * power,
            0.6 + Math.random() * 0.4, 2 + Math.random() * 2.5, world.ground.dust, 40, 0.96);
        }
      }
    }
    function emitRcs(s, dir) {
      // rotating one way fires the opposite top quad sideways
      var lx = dir > 0 ? -10 : 10, ly = -5, ca = Math.cos(s.a), sa = Math.sin(s.a);
      var x = s.x + lx * ca - ly * sa, y = s.y + lx * sa + ly * ca;
      var vx = (dir > 0 ? -1 : 1) * ca * 70, vy = (dir > 0 ? -1 : 1) * sa * 70;
      part('glow', x, y, vx + s.vx, vy + s.vy, 0.22, 2, '#eaf2ff');
    }
    function emitAmbient(dt, v) {
      var i;
      if (windSurf) {                                           // dust streaks ride the wind
        var w = windNow();
        if (Math.random() < dt * (8 + Math.abs(w) * 1.6)) {
          part('streak', v.left + Math.random() * v.vw, v.top + Math.random() * v.vh, w * 11 + (w > 0 ? 40 : -40), (Math.random() - 0.5) * 8,
            1.4, 1, world.ground.dust, 0, 1);
        }
      }
      if (world.ash && Math.random() < dt * 12) {               // falling ash, a few embers
        var ember = Math.random() < 0.2;
        part(ember ? 'glow' : 'flake', Math.random() * W, v.top - 6, (Math.random() - 0.5) * 10, 18 + Math.random() * 22,
          9, ember ? 1.8 : 1.6 + Math.random(), ember ? '#ff8a4a' : '#6f625e', 0, 1);
      }
      for (i = 0; i < vents.length; i++) {                      // heat motes over the vents
        if (Math.random() < dt * 7) {
          var vt = vents[i];
          part('glow', vt.x + (Math.random() - 0.5) * THERMAL_HALF * 1.4, vt.y - 2, 0, -50 - Math.random() * 40, 1.4, 1.8, '#ff9a4a', 0, 1);
        }
      }
      if (world.crystals && Math.random() < dt * 4) {           // drifting ice glints
        part('glow', Math.random() * W, v.top + Math.random() * v.vh, 6, 4, 2.2, 1.4, '#cffaff', 0, 1);
      }
    }

    /* ------------------------------------------------------------ debris */
    function spawnDebris(s) {
      var bits = [[-9, 0, 9, 0], [-7, 5, 7, 5], [-7, -6, -3, -11], [3, -11, 7, -6], [-6, 3, -12, 10], [6, 3, 12, 10], [-3, -11, 3, -11], [2, -11, 4, -15], [-9, 0, -7, 5], [9, 0, 7, 5]];
      bits.forEach(function (b) {
        var mx = (b[0] + b[2]) / 2, my = (b[1] + b[3]) / 2;
        var ang = Math.atan2(my + 2, mx) + (Math.random() - 0.5) * 0.8, sp = 60 + Math.random() * 120;
        debris.push({ x: s.x + mx, y: s.y + my, vx: s.vx * 0.3 + Math.cos(ang) * sp, vy: Math.min(0, s.vy * -0.2) + Math.sin(ang) * sp - 60,
          a: s.a, va: (Math.random() - 0.5) * 14, len: Math.sqrt((b[2] - b[0]) * (b[2] - b[0]) + (b[3] - b[1]) * (b[3] - b[1])) / 2 + 1, rest: false,
          col: Math.random() < 0.3 ? FLAME : ACCENT });
      });
    }
    function updateDebris(dt) {
      debris.forEach(function (d) {
        if (d.rest) return;
        d.vy += world.gravity * 1.6 * dt;
        d.x += d.vx * dt; d.y += d.vy * dt; d.a += d.va * dt;
        var gy = groundAt(U.clamp(d.x, 0, W)) - 1.5;
        if (d.y > gy) {
          d.y = gy; d.vy *= -0.3; d.vx *= 0.55; d.va *= 0.5;
          if (Math.abs(d.vy) < 12 && Math.abs(d.vx) < 8) d.rest = true;
        }
        if (!d.rest && Math.random() < 0.15) part('smoke', d.x, d.y, 0, -10, 0.8, 2, 'rgba(120,110,110,', -8, 0.97);
      });
    }

    /* ------------------------------------------------------------ camera */
    function updateCamera(dt) {
      var tx = cam.x, ty = cam.y, tz = 1;
      if (ship) {
        var alt = Math.max(0, altitudeOf(ship));
        tz = 1 + (ZOOM_MAX - 1) * smooth01((ZOOM_FAR - alt) / (ZOOM_FAR - ZOOM_NEAR));
        tx = ship.x; ty = ship.y + alt * 0.45;          // keep the ground in the frame
      } else if (crashAt) { tz = 1.5; tx = crashAt.x; ty = crashAt.y; }
      cam.z = approach(cam.z, tz, 2.2, dt);
      cam.x = approach(cam.x, tx, 4, dt);
      cam.y = approach(cam.y, ty, 4, dt);
    }
    function view() {
      var z = cam.z, vw = W / z, vh = H / z;
      return { z: z, vw: vw, vh: vh, left: U.clamp(cam.x - vw / 2, 0, W - vw), top: U.clamp(cam.y - vh / 2, 0, H - vh) };
    }
    function toScreen(x, y) { var v = view(); return { x: (x - v.left) * v.z, y: (y - v.top) * v.z }; }

    /* ------------------------------------------------------------- music */
    function musicForSurface() {
      var m = M();
      if (!m) return;
      if (music.worldId !== world.id) {
        m.play(song(world, 18 + worldIdx), { fade: music.worldId ? 2.4 : 1.6, intensity: 0 });
        music.worldId = world.id; music.key = world.music.key; music.burn = false; music.band = 0;
      }
      var key = world.music.key + FIFTHS[surfIdx];
      if (music.key !== key) { music.key = key; m.setKey(key); }
    }
    function setBurn(on) {
      if (on === music.burn) return;
      music.burn = on;
      var m = M();
      if (!m) return;
      m.setTrack('thrust', on ? true : null);
      m.setFilter(on ? OPEN : world.closed, on ? 0.25 : 0.9);
    }
    // altitude bands (edge-guarded): ticks get denser near the surface
    function setBand(b) {
      if (b === music.band) return;
      music.band = b;
      if (M()) M().setIntensity([0, 0.3, 0.6, 0.9][b]);
    }
    function fuelWarnReset() { if (fuel > 260) music.fuelWarn = false; }
    function musicTick(alt) {
      var flying = phase === 'fly' && !!ship;
      setBurn(flying && ship.burn);
      setBand(!flying ? 0 : alt > 180 ? 0 : alt > 100 ? 1 : alt > 45 ? 2 : 3);
      if (!music.fuelWarn && fuel < 200) {
        music.fuelWarn = true;
        if (M()) M().stinger([{ deg: 3 }, { deg: 0, at: 2 }, { deg: 3, at: 4 }, { deg: 0, at: 6, steps: 4 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.4 });
        else api.audio.tone(880, 0.1, { type: 'sine', vol: 0.1 });
      } else fuelWarnReset();
    }
    function landingStinger(delivered) {
      var m = M();
      if (!m) { api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'triangle', vol: 0.2 }); return; }
      var seq = [{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 7, at: 6, steps: 10 }];
      if (delivered) seq.push({ deg: 9, at: 10, steps: 6 }, { deg: 11, at: 12, steps: 10 });
      m.stinger(seq, { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.6 });
      m.stinger([{ deg: 0, steps: 16 }, { deg: 4, steps: 16 }], { inst: 'pad', quantize: 'beat', octave: 0, gain: 0.5 });
    }

    /* ------------------------------------------------------ pickups/cargo */
    function collectPods(s) {
      pods.forEach(function (p) {
        if (p.taken || Math.sqrt((s.x - p.x) * (s.x - p.x) + (s.y - p.y) * (s.y - p.y)) > POD_RADIUS) return;
        p.taken = true; podsTaken++;
        fuel = Math.min(FUEL_MAX, fuel + POD_FUEL);
        api.addScore(POD_PTS);
        var sc = toScreen(p.x, p.y);
        api.fx.text(sc.x, sc.y - 18, '+FUEL', POD, 11);
        for (var k = 0; k < 16; k++) part('glow', p.x, p.y, (Math.random() - 0.5) * 140, (Math.random() - 0.5) * 140, 0.5, 2.2, POD);
        if (M()) M().note('bell', 2 + podsTaken * 2, { quantize: '8', octave: 1, gain: 0.5 });
        else api.audio.tone(660 + podsTaken * 120, 0.12, { type: 'sine', vol: 0.15 });
        if (podsTaken === pods.length) {
          api.addScore(CACHE_BONUS);
          api.fx.text(W / 2, 150, 'CACHE CLEARED +' + CACHE_BONUS, POD, 13);
        }
      });
    }
    function settleOnBeacon(s) {
      s.y = beacon.y - FOOT; s.vy = 0; s.vx = 0; s.grounded = true;
      api.fx.burst(toScreen(s.x, beacon.y).x, toScreen(s.x, beacon.y).y, BEACON, 10, 80, 0.4);
      if (cargo === 'waiting') { cargo = 'loading'; loadT = 0; }
    }
    function updateLoading(dt) {
      if (cargo !== 'loading') return;
      loadT += dt;
      if (loadT < LOAD_SECS) return;
      cargo = 'aboard';
      fuel = Math.min(FUEL_MAX, fuel + BEACON_FUEL);
      var sc = toScreen(ship.x, ship.y);
      api.fx.text(sc.x, sc.y - 34, 'CRATE ABOARD  +FUEL', BEACON, 12);
      if (M()) M().stinger([{ deg: 4 }, { deg: 7, at: 2, steps: 4 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.5 });
      else api.audio.arp([660, 990], 0.08, { type: 'triangle', vol: 0.15 });
    }

    /* ------------------------------------------------- touchdown outcomes */
    function touchdown(s) {
      var pad = padAt(s.x), atBeacon = onBeacon(s.x);
      var fault = s.vy >= SAFE_VY ? 'TOO FAST' : Math.abs(s.a) >= SAFE_A ? 'NOT LEVEL'
        : Math.abs(s.vx) >= world.safeVx ? (world.slippery ? 'SKIDDED OFF' : 'DRIFTING') : null;
      if (!pad && !atBeacon) return crash('MISSED THE PAD');
      if (fault) return crash(fault);
      if (atBeacon) return settleOnBeacon(s);
      landOnPad(s, pad);
    }
    function landOnPad(s, pad) {
      var gentle = Math.round((SAFE_VY - s.vy) + (SAFE_A - Math.abs(s.a)) * 100);
      s.y = pad.y - FOOT; s.vy = 0;
      s.slide = world.slippery ? s.vx : 0; s.vx = 0;
      var pts = 50 * pad.mult * level + gentle;
      api.addScore(pts);
      fuel = Math.min(FUEL_MAX, fuel + world.refuel);
      var sc = toScreen(s.x, s.y);
      api.fx.text(sc.x, sc.y - 44, 'TOUCHDOWN. HODL.  x' + pad.mult + '  +' + pts, OK, 13);
      var delivered = cargo === 'aboard';
      if (delivered) {
        var bonus = 300 + 20 * level;
        api.addScore(bonus);
        cargo = 'delivered';
        api.fx.text(sc.x, sc.y - 64, 'CARGO DELIVERED +' + bonus, BEACON, 12);
      }
      for (var k = 0; k < 18; k++) {
        var side = k % 2 ? 1 : -1;
        part('dust', s.x + side * 8, pad.y - 1, side * (40 + Math.random() * 60), -Math.random() * 30, 0.8, 2.5, world.ground.dust, 30, 0.95);
      }
      part('glow', s.x, pad.y, 0, 0, 0.5, 6, padColor(pad.mult));
      landingStinger(delivered);
      phase = 'landed'; phaseT = LAND_SECS;
      setBurn(false); setBand(0);
    }
    function crash(reason) {
      var s = ship, sc = toScreen(s.x, s.y);
      spawnDebris(s);
      for (var k = 0; k < 40; k++) {
        var a = Math.random() * TAU, sp = 40 + Math.random() * 180;
        part('glow', s.x, s.y, Math.cos(a) * sp, Math.sin(a) * sp - 40, 0.5 + Math.random() * 0.6, 2 + Math.random() * 3,
          Math.random() < 0.5 ? '#ff9f1c' : Math.random() < 0.5 ? '#fff2b0' : BAD, world.gravity, 0.97);
      }
      for (k = 0; k < 10; k++) part('smoke', s.x + (Math.random() - 0.5) * 16, s.y, (Math.random() - 0.5) * 30, -20 - Math.random() * 30, 1.6, 5, 'rgba(90,85,95,', -4, 0.97);
      crashReason = reason;
      api.shake(12);
      api.audio.noise(0.7, { vol: 0.35, cutoff: 700 });
      crashAt = { x: s.x, y: s.y };
      ship = null;
      if (cargo === 'aboard' || cargo === 'loading') cargo = 'waiting';   // the crate waits at the beacon again
      phase = 'crashed'; phaseT = CRASH_SECS;
      musicTick(0);
      if (M()) { M().duck(0.6, 1.4); M().note('sub', -7, { octave: -1, dur: 1, gain: 0.7 }); }
      ships--;
    }

    /* ------------------------------------------------------------ flight */
    function flyShip(dt) {
      var s = ship, inp = api.input;
      var turn = (inp.held('right') ? 1 : 0) - (inp.held('left') ? 1 : 0);
      if (turn && !s.turn) api.audio.noise(0.04, { vol: 0.03, cutoff: 3200 });
      s.turn = turn;
      s.a = U.clamp(s.a + turn * TURN * dt, -Math.PI / 2, Math.PI / 2);
      if (turn && Math.random() < 0.7) emitRcs(s, turn);

      var alt = altitudeOf(s);
      s.burn = fuel > 0 && (inp.held('up') || inp.held('a') || inp.held('hold'));
      if (s.burn) {
        var thrust = THRUST * (cargo === 'aboard' ? CARGO_THRUST : 1);
        s.vx += Math.sin(s.a) * thrust * dt;
        s.vy -= Math.cos(s.a) * thrust * dt;
        fuel = Math.max(0, fuel - BURN * dt);
        emitThrust(s, alt);
        if (Math.floor(t * 30) % 3 === 0) api.audio.noise(0.05, { vol: 0.05, cutoff: 500 });
      }
      s.vy += world.gravity * dt;
      s.legs = U.clamp(s.legs + (alt < GEAR_ALT ? dt * 2.5 : -dt * 2.5), 0, 1);

      if (s.grounded) {                 // resting on the cargo beacon
        if (s.vy >= 0) { s.vy = 0; s.vx = 0; s.y = beacon.y - FOOT; updateLoading(dt); return; }
        s.grounded = false;
        if (cargo === 'loading') cargo = 'waiting';
        s.y -= 1;
      }
      s.vx += windAt(alt) * dt;
      s.vy -= thermalLift(s.x, s.y) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.x < 0) { s.x += W; cam.x += W; } else if (s.x > W) { s.x -= W; cam.x -= W; }
      if (s.y < CEILING) { s.y = CEILING; s.vy = Math.max(0, s.vy); }
      collectPods(s);
      if (s.y + FOOT >= footGround(s)) touchdown(s);
    }
    function slideOnPad(dt) {          // settle level on the gear; ice pads also skid a little
      var s = ship;
      if (!s) return;
      s.a = approach(s.a, 0, 6, dt);
      if (!s.slide) return;
      var pad = padAt(s.x) || pads[0];
      var dir = s.slide > 0 ? 1 : -1;
      s.x += s.slide * dt;
      s.slide = dir * Math.max(0, Math.abs(s.slide) - ICE_FRICTION * dt);
      var lo = pad.a * SEG + 8, hi = pad.b * SEG - 8;
      if (s.x < lo || s.x > hi) { s.x = U.clamp(s.x, lo, hi); s.slide = 0; }
      if (Math.random() < 0.5) part('glow', s.x - dir * 10, s.y + FOOT, -dir * 20, -8, 0.4, 1.5, '#dffcff');
    }
    function statusLine() {
      api.setStatus(world.name + ' ' + (surfIdx + 1) + '/' + SURFACES_PER_WORLD + '  \u00b7  MODULES ' + ships + '  \u00b7  FUEL ' + Math.round(fuel));
    }

    /* =========================================================== rendering */
    function drawThermals(ctx) {
      vents.forEach(function (v) {
        var b = ventBreath(v), top = v.y - v.reach, hw = THERMAL_HALF;
        var g = ctx.createLinearGradient(0, v.y, 0, top);
        g.addColorStop(0, 'rgba(255,120,60,' + (0.24 * b) + ')'); g.addColorStop(1, 'rgba(255,120,60,0)');
        ctx.fillStyle = g; ctx.fillRect(v.x - hw, top, hw * 2, v.reach);
        ctx.lineWidth = 1;
        for (var k = 0; k < 3; k++) {               // shimmering heat lines
          ctx.strokeStyle = 'rgba(255,190,120,' + (0.16 + 0.1 * b) + ')';
          ctx.beginPath();
          for (var yy = v.y; yy > top; yy -= 6) {
            var xx = v.x + (k - 1) * hw * 0.55 + Math.sin(yy * 0.08 + t * 5 + k * 2) * 3;
            if (yy === v.y) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        }
        for (var j = 0; j < 4; j++) {               // rising chevrons telegraph the push
          var cy = v.y - ((t * 55 + j * v.reach / 4) % v.reach), fade = 1 - (v.y - cy) / v.reach;
          ctx.strokeStyle = 'rgba(255,210,150,' + (0.5 * fade * b) + ')';
          ctx.beginPath(); ctx.moveTo(v.x - 6, cy + 4); ctx.lineTo(v.x, cy); ctx.lineTo(v.x + 6, cy + 4); ctx.stroke();
        }
      });
    }
    function drawVentMouths(ctx) {
      vents.forEach(function (v) {
        var b = ventBreath(v);
        var g = ctx.createRadialGradient(v.x, v.y, 1, v.x, v.y, 18);
        g.addColorStop(0, 'rgba(255,220,140,' + (0.9 * b) + ')'); g.addColorStop(0.4, 'rgba(255,90,30,' + (0.5 * b) + ')'); g.addColorStop(1, 'rgba(255,60,20,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(v.x, v.y, 18, 9, 0, 0, TAU); ctx.fill();
      });
    }
    function drawWindsock(ctx, x, y) {
      var w = windNow(), k = Math.min(1, Math.abs(w) / 18), dir = w >= 0 ? 1 : -1;
      var droop = (1 - k) * 1.1 + Math.sin(t * 9 + x) * 0.08 * k;
      ctx.strokeStyle = '#d8c8c0'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 20); ctx.stroke();
      ctx.save();
      ctx.translate(x, y - 19); ctx.scale(dir, 1); ctx.rotate(droop);
      for (var i = 0; i < 3; i++) {
        var x0 = i * 4.5, h0 = 3.2 - i * 0.8, h1 = 3.2 - (i + 1) * 0.8;
        ctx.fillStyle = i % 2 ? '#ffe7d6' : '#ff6a3d';
        ctx.beginPath(); ctx.moveTo(x0, -h0); ctx.lineTo(x0 + 4.5, -h1); ctx.lineTo(x0 + 4.5, h1); ctx.lineTo(x0, h0); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    function drawPad(ctx, p) {
      var col = padColor(p.mult), x0 = p.a * SEG, x1 = p.b * SEG, mid = (x0 + x1) / 2;
      ctx.save();
      ctx.fillStyle = 'rgba(10,12,20,0.85)'; ctx.fillRect(x0, p.y, x1 - x0, 4);
      ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x0, p.y); ctx.lineTo(x1, p.y); ctx.stroke();
      ctx.lineWidth = 1; ctx.shadowBlur = 0; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(x0 + 4, p.y + 2); ctx.lineTo(x0 + 2, p.y + 9); ctx.moveTo(x1 - 4, p.y + 2); ctx.lineTo(x1 - 2, p.y + 9); ctx.stroke();
      ctx.globalAlpha = 1;
      // blinking edge lights, chasing towards the middle
      for (var i = 0; i < 2; i++) {
        var on = Math.sin(t * 5 + p.ph + i * 1.6) > 0;
        ctx.fillStyle = on ? '#ffffff' : col; ctx.shadowColor = col; ctx.shadowBlur = on ? 10 : 3;
        ctx.fillRect((i ? x1 - 3 : x0) , p.y - 3, 3, 3);
      }
      // multiplier plate below the pad
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(5,6,12,0.75)'; U.roundRect(ctx, mid - 12, p.y + 7, 24, 13, 3); ctx.fill();
      ctx.strokeStyle = hexA(col, 0.6); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = col; ctx.font = '800 10px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('x' + p.mult, mid, p.y + 14);
      ctx.restore();
      if (windSurf) drawWindsock(ctx, x1 - 2, p.y);
    }
    function drawBeacon(ctx) {
      if (!beacon) return;
      var x0 = beacon.a * SEG, x1 = beacon.b * SEG, y = beacon.y, mx = x1 - 4;
      ctx.save();
      ctx.strokeStyle = BEACON; ctx.shadowColor = BEACON; ctx.shadowBlur = 8; ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.setLineDash([]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(mx, y - 24); ctx.stroke();
      var waiting = cargo === 'waiting' || cargo === 'loading';
      ctx.fillStyle = Math.sin(t * 6) > 0 || !waiting ? BEACON : '#1b4a52';
      ctx.beginPath(); ctx.arc(mx, y - 25, 2.5, 0, TAU); ctx.fill();
      if (waiting) {                                    // radio ping rings
        var r = (t * 30) % 40;
        ctx.globalAlpha = 1 - r / 40; ctx.beginPath(); ctx.arc(mx, y - 25, r, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
        var lift = cargo === 'loading' ? Math.min(1, loadT / LOAD_SECS) * 6 : 0;
        ctx.fillStyle = '#6b4a1e'; ctx.fillRect(x0 + 13, y - 7 - lift, 12, 7);
        ctx.strokeRect(x0 + 13, y - 7 - lift, 12, 7);
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(5,6,12,0.75)'; U.roundRect(ctx, x0 + 2, y + 7, 36, 13, 3); ctx.fill();
      ctx.fillStyle = BEACON; ctx.font = '800 9px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('CARGO', x0 + 20, y + 14);
      ctx.restore();
      if (windSurf) drawWindsock(ctx, x0 + 3, y);
    }
    function drawPods(ctx) {
      pods.forEach(function (p) {
        if (p.taken) return;
        var y = p.y + Math.sin(t * 2 + p.ph) * 3;
        ctx.save();
        ctx.strokeStyle = POD; ctx.shadowColor = POD; ctx.shadowBlur = 10; ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 4 + p.ph);
        ctx.beginPath(); ctx.arc(p.x, y, 12, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(20,40,10,0.85)'; U.roundRect(ctx, p.x - 4.5, y - 7, 9, 14, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = POD; ctx.fillRect(p.x - 2.5, y - 1, 5, 6);
        ctx.restore();
      });
    }
    function drawDebris(ctx) {
      ctx.save();
      ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      debris.forEach(function (d) {
        var dx = Math.cos(d.a) * d.len, dy = Math.sin(d.a) * d.len;
        ctx.strokeStyle = d.col; ctx.shadowColor = d.col; ctx.shadowBlur = d.rest ? 2 : 6;
        ctx.beginPath(); ctx.moveTo(d.x - dx, d.y - dy); ctx.lineTo(d.x + dx, d.y + dy); ctx.stroke();
      });
      ctx.restore();
    }
    function drawParts(ctx) {
      ctx.save();
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], a = Math.max(0, p.life / p.max);
        if (p.kind === 'glow') continue;
        if (p.kind === 'smoke') {
          ctx.fillStyle = p.color + (0.22 * a) + ')';
          var r = p.size * (1 + (1 - a) * 2.2);
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.fill();
        } else if (p.kind === 'streak') {
          ctx.globalAlpha = Math.min(1, a * 3, (1 - a) * 4) * 0.5;
          ctx.strokeStyle = p.color; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.12, p.y - p.vy * 0.12); ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.globalAlpha = a * (p.kind === 'flake' ? 0.8 : 0.7);
          ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.globalAlpha = 1;
        }
      }
      ctx.globalCompositeOperation = 'lighter';
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        if (p.kind !== 'glow') continue;
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
    function drawShip(ctx) {
      if (!ship) return;
      var s = ship;
      drawLander(ctx, { x: s.x, y: s.y, a: s.a, legs: s.legs, crate: cargo === 'aboard',
        flame: s.burn && phase === 'fly' ? (Math.floor(t * 30) % 2 ? 1 : 0.75) : 0 });
      if (cargo === 'loading') {                        // loading progress ring
        ctx.save();
        ctx.strokeStyle = BEACON; ctx.lineWidth = 2; ctx.shadowColor = BEACON; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(s.x, s.y - 2, 17, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, loadT / LOAD_SECS)); ctx.stroke();
        ctx.restore();
      }
    }
    function drawAurora(ctx) {
      if (!world.crystals) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var k = 0; k < 2; k++) {
        var g = ctx.createLinearGradient(0, 30, 0, 150);
        g.addColorStop(0, 'rgba(80,255,190,0)'); g.addColorStop(0.5, 'rgba(80,255,190,' + (0.07 + k * 0.03) + ')'); g.addColorStop(1, 'rgba(80,160,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(0, 150);
        for (var x = 0; x <= W; x += 20) ctx.lineTo(x, 60 + k * 25 + Math.sin(x * 0.012 + t * (0.3 + k * 0.2) + k) * 26);
        ctx.lineTo(W, 150); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    function drawSky(ctx, v) {
      ctx.fillStyle = world.sky.top; ctx.fillRect(0, 0, W, H);
      var sc = 1 + (v.z - 1) * 0.12;                    // gentle parallax on the backdrop
      var fx = (v.left + v.vw / 2) / W, fy = (v.top + v.vh / 2) / H;
      ctx.drawImage(skyCv, -fx * W * (sc - 1), -fy * H * (sc - 1), W * sc, H * sc);
      drawAurora(ctx);
    }
    function drawWorld(ctx, v) {
      ctx.save();
      ctx.scale(v.z, v.z); ctx.translate(-v.left, -v.top);
      drawThermals(ctx);
      ctx.drawImage(groundCv, 0, 0, W, H);
      drawVentMouths(ctx);
      pads.forEach(function (p) { drawPad(ctx, p); });
      drawBeacon(ctx);
      drawPods(ctx);
      drawDebris(ctx);
      drawShip(ctx);
      drawParts(ctx);
      ctx.restore();
    }

    /* ----------------------------------------------------------------- HUD */
    function hudText(ctx, str, x, y, col, size, align, weight) {
      ctx.font = (weight || 700) + ' ' + (size || 11) + 'px ' + MONO;
      ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = col; ctx.fillText(str, x, y);
    }
    function drawAttitude(ctx, cx, cy, r, a) {
      ctx.save();
      ctx.strokeStyle = 'rgba(200,210,255,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(57,255,136,0.18)';                 // the safe wedge
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -Math.PI / 2 - SAFE_A, -Math.PI / 2 + SAFE_A); ctx.closePath(); ctx.fill();
      var col = limitColor(a, SAFE_A);
      ctx.translate(cx, cy); ctx.rotate(a);
      ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, -r + 3); ctx.moveTo(-5, -r + 8); ctx.lineTo(0, -r + 3); ctx.lineTo(5, -r + 8);
      ctx.moveTo(-8, 4); ctx.lineTo(8, 4); ctx.stroke();
      ctx.restore();
    }
    // HUD blocks turn see-through while the module flies behind them
    function hudAlpha(x0, y0, x1, y1) {
      if (!ship) return 1;
      var p = toScreen(ship.x, ship.y), m = 22;
      return p.x > x0 - m && p.x < x1 + m && p.y > y0 - m && p.y < y1 + m ? 0.28 : 1;
    }
    function drawInstruments(ctx) {
      ctx.save();
      ctx.globalAlpha = hudAlpha(8, 8, 184, 112);
      ctx.fillStyle = 'rgba(4,6,14,0.62)'; U.roundRect(ctx, 8, 8, 176, 104, 8); ctx.fill();
      ctx.strokeStyle = hexA(world.ground.rim, 0.28); ctx.lineWidth = 1; ctx.stroke();
      var s = ship, dim = 'rgba(200,210,255,0.55)';
      var alt = s ? Math.max(0, Math.round(altitudeOf(s))) : 0;
      var rows = [
        ['ALT', s ? String(alt) : '--', s && alt < 60 ? WARN : ACCENT],
        ['VERT', s ? String(Math.round(s.vy)) : '--', s ? limitColor(Math.max(0, s.vy), SAFE_VY) : dim],
        ['HORZ', s ? String(Math.round(s.vx)) : '--', s ? limitColor(s.vx, world.safeVx) : dim],
        ['TILT', s ? Math.round(s.a * 57.3) + '\u00b0' : '--', s ? limitColor(s.a, SAFE_A) : dim]
      ];
      rows.forEach(function (r, i) {
        hudText(ctx, r[0], 18, 27 + i * 16, dim);
        hudText(ctx, r[1], 62, 27 + i * 16, r[2]);
      });
      drawAttitude(ctx, 140, 50, 26, s ? s.a : 0);
      // gear light
      var gearOn = s && s.legs > 0.95;
      hudText(ctx, 'GEAR', 124, 90, gearOn ? OK : 'rgba(200,210,255,0.35)', 9);
      // fuel gauge
      var fk = fuel / FUEL_MAX, fcol = fuel > 300 ? OK : fuel > 150 ? WARN : BAD;
      hudText(ctx, 'FUEL', 18, 104, dim);
      ctx.strokeStyle = 'rgba(200,210,255,0.35)'; ctx.strokeRect(56, 96, 118, 9);
      ctx.fillStyle = fcol; ctx.shadowColor = fcol; ctx.shadowBlur = 6;
      ctx.fillRect(57, 97, 116 * fk, 7);
      ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(56 + 118 * world.reserve / FUEL_MAX, 94, 1, 13);         // reserve tick
      ctx.restore();
    }
    function drawWorldTag(ctx) {
      ctx.save();
      ctx.globalAlpha = hudAlpha(W - 170, 8, W - 8, 62);
      hudText(ctx, world.name, W - 12, 22, world.ground.rim, 11, 'right', 800);
      hudText(ctx, 'SURFACE ' + (surfIdx + 1) + '/' + SURFACES_PER_WORLD + '  G ' + world.gravity, W - 12, 36, 'rgba(200,210,255,0.55)', 10, 'right');
      for (var m = 0; m < ships; m++) drawLander(ctx, { x: W - 20 - m * 20, y: 52, a: 0, legs: 1, scale: 0.7, glow: 4 });
      ctx.restore();
    }
    function drawWindGauge(ctx) {
      if (!windSurf) return;
      var w = windNow(), k = Math.min(1, Math.abs(w) / windSurf.max), dir = w >= 0 ? 1 : -1;
      var cx = W / 2, y = 22, len = 18 + 50 * k, col = k > 0.7 ? WARN : '#ffd9c2';
      ctx.save();
      ctx.fillStyle = 'rgba(4,6,14,0.55)'; U.roundRect(ctx, cx - 70, 8, 140, 24, 6); ctx.fill();
      hudText(ctx, 'WIND ' + Math.round(Math.abs(w)), cx - 62, y + 4, 'rgba(255,217,194,0.8)', 10);
      ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.lineWidth = 2;
      var x0 = cx + 22 - dir * len / 2, x1 = cx + 22 + dir * len / 2;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - dir * 6, y - 5); ctx.lineTo(x1, y); ctx.lineTo(x1 - dir * 6, y + 5); ctx.stroke();
      ctx.restore();
    }
    function missionStatus() {
      if (mission === 'fuel') return pods.length ? { text: 'FUEL PODS ' + podsTaken + '/' + pods.length, col: POD } : null;
      if (mission !== 'cargo' || !beacon) return null;
      if (cargo === 'waiting') return { text: 'CRATE: LAND AT THE BEACON', col: BEACON };
      if (cargo === 'loading') return { text: 'LOADING CRATE...', col: BEACON };
      if (cargo === 'aboard') return { text: 'CRATE ABOARD - LAND ON A PAD', col: BEACON };
      if (cargo === 'delivered') return { text: 'CARGO DELIVERED', col: OK };
      return null;
    }
    function drawMissionStatus(ctx) {
      var st = missionStatus();
      if (!st) return;
      var y = windSurf ? 50 : 24;
      ctx.save();
      ctx.font = '700 10px ' + MONO;
      var w = ctx.measureText(st.text).width + 20;
      ctx.fillStyle = 'rgba(4,6,14,0.55)'; U.roundRect(ctx, W / 2 - w / 2, y - 14, w, 20, 6); ctx.fill();
      hudText(ctx, st.text, W / 2, y, st.col, 10, 'center');
      ctx.restore();
    }
    function worldHint() {
      if (windSurf) return 'WIND ' + Math.round(Math.abs(windSurf.base)) + (windSurf.base > 0 ? ' >>> EAST' : ' <<< WEST') + ' - WATCH THE WINDSOCKS';
      return world.hint;
    }
    function drawCard(ctx) {
      if (cardT <= 0) return;
      var a = Math.min(1, (CARD_SECS - cardT) / 0.3, cardT / 0.6);
      var info = MISSIONS[mission], cy = 150;
      ctx.save();
      ctx.globalAlpha = a * hudAlpha(W / 2 - 180, cy - 38, W / 2 + 180, cy + 46);   // never hide the module
      ctx.fillStyle = 'rgba(4,6,14,0.78)'; U.roundRect(ctx, W / 2 - 180, cy - 38, 360, 84, 10); ctx.fill();
      ctx.strokeStyle = hexA(world.ground.rim, 0.5); ctx.lineWidth = 1; ctx.stroke();
      hudText(ctx, world.name + '  \u00b7  SURFACE ' + (surfIdx + 1) + '/' + SURFACES_PER_WORLD, W / 2, cy - 20, world.ground.rim, 10, 'center');
      U.glowText(ctx, info.title, W / 2, cy + 2, 13, mission === 'land' ? ACCENT : mission === 'fuel' ? POD : BEACON);
      hudText(ctx, info.line, W / 2, cy + 24, 'rgba(230,236,255,0.85)', 10, 'center', 600);
      hudText(ctx, worldHint(), W / 2, cy + 39, WARN, 9, 'center');
      ctx.restore();
    }
    function drawCrashBanner(ctx) {
      if (phase !== 'crashed' && phase !== 'over') return;
      var a = Math.min(1, (CRASH_SECS - phaseT) / 0.25);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(20,4,8,0.72)'; U.roundRect(ctx, W / 2 - 130, 70, 260, 50, 8); ctx.fill();
      ctx.strokeStyle = hexA(BAD, 0.6); ctx.lineWidth = 1; ctx.stroke();
      U.glowText(ctx, crashReason, W / 2, 88, 13, BAD);
      hudText(ctx, ships > 0 ? 'MODULE LOST - ' + ships + ' LEFT' : 'LAST MODULE LOST', W / 2, 110, 'rgba(255,210,220,0.85)', 10, 'center');
      ctx.restore();
    }
    function drawAlerts(ctx) {
      if (phase === 'fly' && fuel < 200 && Math.floor(t * 3) % 2) U.glowText(ctx, 'LOW FUEL', W / 2, H - 18, 11, BAD);
      if (ship && ship.y < -4) {                        // off the top: marker + height
        var v = view(), sx = (ship.x - v.left) * v.z;
        ctx.save();
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.moveTo(sx, 4); ctx.lineTo(sx - 6, 13); ctx.lineTo(sx + 6, 13); ctx.closePath(); ctx.fill();
        hudText(ctx, String(Math.round(-ship.y)), sx, 26, ACCENT, 9, 'center');
        ctx.restore();
      }
    }

    /* ---------------------------------------------------------- boot */
    newSurface();

    return {
      // Read-only test hook: a fresh snapshot every call.
      debug: function () {
        var s = ship;
        return {
          level: level, world: world.id, worldName: world.name, surface: surfIdx + 1, mission: mission, cargo: cargo,
          pods: pods.length - podsTaken, podsTaken: podsTaken, ships: ships, fuel: fuel,
          flying: !!s && phase === 'fly', landed: phase === 'landed', dead: phase === 'crashed' || phase === 'over', phase: phase,
          x: s ? s.x : null, y: s ? s.y : null, altitude: s ? altitudeOf(s) : null, vx: s ? s.vx : 0, vy: s ? s.vy : 0, angle: s ? s.a : 0,
          grounded: !!s && s.grounded, gear: s ? s.legs : 0, zoom: cam.z, wind: windNow(), gravity: world.gravity, safeVx: world.safeVx,
          thrust: THRUST * (cargo === 'aboard' ? CARGO_THRUST : 1), lift: s ? thermalLift(s.x, s.y) : 0,
          pads: pads.map(function (p) { return { x0: p.a * SEG, x1: p.b * SEG, y: p.y, mult: p.mult }; }),
          beacon: beacon ? { x0: beacon.a * SEG, x1: beacon.b * SEG, y: beacon.y } : null,
          podList: pods.map(function (p) { return { x: p.x, y: p.y, taken: p.taken }; }),
          vents: vents.map(function (v) { return { x: v.x, y: v.y, reach: v.reach }; }),
          particles: parts.length
        };
      },
      update: function (dt) {
        t += dt;
        api.input.takeSwipes();
        cardT = Math.max(0, cardT - dt);
        updateParts(dt);
        updateDebris(dt);
        emitAmbient(dt, view());
        if (phase === 'over') { overT += dt; if (overT > 1.2) api.gameOver(); return; }
        if (phase === 'crashed') {
          phaseT -= dt;
          updateCamera(dt);
          if (phaseT <= 0) { if (ships <= 0) phase = 'over'; else spawn(); }
          return;
        }
        if (phase === 'landed') {
          phaseT -= dt;
          slideOnPad(dt);
          updateCamera(dt);
          if (phaseT <= 0) newSurface();
          return;
        }
        flyShip(dt);
        updateCamera(dt);
        musicTick(ship ? altitudeOf(ship) : 0);
        if (ship) statusLine();
      },
      render: function (ctx) {
        var v = view();
        drawSky(ctx, v);
        drawWorld(ctx, v);
        drawInstruments(ctx);
        drawWorldTag(ctx);
        drawWindGauge(ctx);
        drawMissionStatus(ctx);
        drawAlerts(ctx);
        drawCrashBanner(ctx);
        drawCard(ctx);
      }
    };
  }

  /* ================================================================= attract
     Stateless: a lander settles onto a pad, one world every six seconds.    */
  function attract(ctx, w, h, t) {
    var wi = Math.floor(t / 6) % WORLDS.length, wd = WORLDS[wi], k = (t % 6) / 6;
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, wd.sky.top); g.addColorStop(0.6, wd.sky.mid); g.addColorStop(1, wd.sky.bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(225,232,255,0.6)';
    for (var i = 0; i < 26; i++) ctx.fillRect((Math.sin(i * 91.7) * 0.5 + 0.5) * w, (Math.sin(i * 37.3) * 0.5 + 0.5) * h * 0.55, 1, 1);
    // far ridge
    ctx.fillStyle = wd.ridges[1];
    ctx.beginPath(); ctx.moveTo(0, h);
    for (var x = 0; x <= w; x += w / 20) ctx.lineTo(x, h * 0.62 + Math.sin(x / w * 7 + wi) * h * 0.05);
    ctx.lineTo(w, h); ctx.fill();
    // terrain with a pad
    var pts = [0.75, 0.62, 0.7, 0.82, 0.82, 0.82, 0.66, 0.58, 0.72, 0.64, 0.78];
    ctx.fillStyle = wd.ground.top;
    ctx.beginPath(); ctx.moveTo(0, h);
    pts.forEach(function (p, j) { ctx.lineTo(j / (pts.length - 1) * w, p * h); });
    ctx.lineTo(w, h); ctx.fill();
    ctx.strokeStyle = wd.ground.rim; ctx.lineWidth = 1.2;
    ctx.beginPath();
    pts.forEach(function (p, j) { if (j) ctx.lineTo(j / (pts.length - 1) * w, p * h); else ctx.moveTo(0, p * h); });
    ctx.stroke();
    var padY = h * 0.82;
    ctx.strokeStyle = OK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(w * 0.3, padY); ctx.lineTo(w * 0.5, padY); ctx.stroke();
    ctx.fillStyle = Math.sin(t * 6) > 0 ? '#fff' : OK;
    ctx.fillRect(w * 0.3, padY - 3, 2, 2); ctx.fillRect(w * 0.5 - 2, padY - 3, 2, 2);
    // lander: descend, burn near the bottom, settle
    var sc = h / 170, land = Math.min(1, k / 0.7);
    var ease = 1 - Math.pow(1 - land, 2);
    var y = h * 0.12 + ease * (padY - FOOT * sc - h * 0.12);
    var burning = land > 0.4 && land < 1;
    drawLander(ctx, { x: w * 0.4, y: y, a: Math.sin(t * 1.3) * 0.08 * (1 - land), legs: smooth01((land - 0.3) / 0.4),
      scale: sc, glow: 4, flame: burning && Math.floor(t * 20) % 2 ? 0.9 : burning ? 0.6 : 0 });
    if (burning && land > 0.75) {
      ctx.fillStyle = hexA(wd.ground.dust, 0.5);
      for (var d = 0; d < 6; d++) {
        var off = ((t * 60 + d * 13) % 30) * sc;
        ctx.fillRect(w * 0.4 - off - 2, padY - 2 - d % 2 * 2, 2, 2); ctx.fillRect(w * 0.4 + off, padY - 2 - d % 2 * 2, 2, 2);
      }
    }
    ctx.font = '700 ' + Math.max(8, Math.round(h / 22)) + 'px ' + MONO;
    ctx.textAlign = 'right'; ctx.fillStyle = hexA(wd.ground.rim, 0.8);
    ctx.fillText(wd.name, w - 6, h * 0.08 + 6);
  }

  XA.registerGame({
    id: 'xa_lunar_lander',
    order: 18,
    title: 'Satoshi One',
    tagline: 'Gentle hands. Narrow pads pay more.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'lander',
    controls: '\u2190\u2192 rotate \u00b7 \u2191 / Space thrust',
    create: create,
    attract: attract
  });
})(window);

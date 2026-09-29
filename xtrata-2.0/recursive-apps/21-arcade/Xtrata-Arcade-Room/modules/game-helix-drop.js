/*
 * Xtrata Arcade cartridge #15 - HELIX DROP (v2)
 *
 * A ball bounces on a spiral tower of rings. Spin the tower so the ball drops
 * through the gaps. The tower is cut into LEVELS that end on a chequered
 * FINISH platform; every four levels the ball falls into a new WORLD (Neon
 * Core, Magma Depths, Frozen Spire, Aurora Garden) with its own palette,
 * pole, backdrop and soundtrack.
 *
 * Segment kinds (introduced gradually):
 *   SAFE     - bounce on it
 *   DANGER   - red/striped, touching it ends the run
 *   MOVER    - a danger block that slides back and forth along a visible rail
 *   GLASS    - cracks on the first landing, shatters on the second
 *   BOOST    - a gold gap: falling through it gives points and a speed kick
 * Pickup: SHIELD orb floating in a gap - forgives one danger touch.
 * Fall through three rings without landing and the ball becomes a FIREBALL
 * that smashes whatever it lands on next, even danger.
 *
 * Music: drum & bass around 170 bpm, one song per world (crossfaded). Each
 * gap passed plays the next note of a descending run (reset on landing), the
 * fireball opens the filter and adds a riser, intensity follows the depth
 * inside the world, and level clears get a stinger.
 *
 * Contract game-id: xa_helix_drop (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-helix-drop');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ geometry */
  var W = 400, H = 600, CX = W / 2;
  var R = 150, RI = 34, SQ = 0.32, THICK = 14;
  var SEG = 12, STEP = Math.PI * 2 / SEG, GAP_Y = 118, BALL_R = 11;
  var FRONT = Math.PI / 2, MID = (R + RI) / 2;
  var LIGHT = Math.PI * 0.72;           // light comes from the front-left
  var INSET = 0.018;                    // angular gap drawn between segments
  var PLAY_G = { cx: CX, r: R, ri: RI, sq: SQ, thick: THICK };

  /* ================================================================ physics */
  var GRAVITY = 1900, BOUNCE_V = -600, MAX_FALL = 900, BOOST_FALL = 1150;
  var SMASH_HOP = -420, ROT_KEYS = 3.4, ROT_DRAG = 0.014;
  var FIRE_AT = 3;                      // gaps in a row that ignite the ball
  var GLASS_HITS = 2;                   // landings a glass arc survives - 1
  var CLEAR_TIME = 1.5;                 // celebration on the finish platform
  var CAM_LEAD = 210;                   // ball sits this far below the top

  /* ================================================================ colours */
  var ACCENT = '#ff9f1c', FIRE = '#ff9f1c', BOOST = '#ffd23f', SHIELD = '#5ab8ff';

  /* ================================================================ worlds
     One entry per world; levels 1-4 are world 0, 5-8 world 1 and so on, then
     the worlds cycle. Colours are hex strings (parsed once below).
       bg      sky gradient top/bottom      fog    colour far rings fade into
       safe    top face of safe segments    danger lethal segments
       glass   breakable glass tint         paint  splat colour
       pole    [dark, light] pole gradient  line   pole detail colour
       poleStyle  'neon' | 'rock' | 'crystal' | 'vine'
       scene   background shapes: 'hex' | 'ember' | 'shard' | 'aurora'
       finish  chequer colours of the finish platform */
  var WORLDS = [
    { name: 'NEON CORE', bg: ['#1a0a2e', '#070312'], fog: '#0c0620', safe: '#3ff0ff', danger: '#ff2d55',
      glass: '#d8f6ff', paint: '#ff9f1c', pole: ['#2a1450', '#6b44b8'], line: '#b394ff', poleStyle: 'neon',
      scene: 'hex', sceneCol: '#8a5cff', finish: ['#ffffff', '#ffd23f'], accent: '#3ff0ff', runInst: 'pluck' },
    { name: 'MAGMA DEPTHS', bg: ['#2c0d07', '#0a0302'], fog: '#1a0604', safe: '#9aa6c4', danger: '#ff2d6f',
      glass: '#ffe0c8', paint: '#3ff0ff', pole: ['#1c0e0a', '#553022'], line: '#ff6a1a', poleStyle: 'rock',
      scene: 'ember', sceneCol: '#ff7a2a', finish: ['#ffffff', '#ff7a2a'], accent: '#ff7a2a', runInst: 'pluck' },
    { name: 'FROZEN SPIRE', bg: ['#0b2342', '#020816'], fog: '#061426', safe: '#e6f4ff', danger: '#ff2d7a',
      glass: '#8fe3ff', paint: '#ff5ad1', pole: ['#17406a', '#a8e4ff'], line: '#ffffff', poleStyle: 'crystal',
      scene: 'shard', sceneCol: '#9fe8ff', finish: ['#ffffff', '#5ab8ff'], accent: '#9fe8ff', runInst: 'marimba' },
    { name: 'AURORA GARDEN', bg: ['#04161a', '#01050a'], fog: '#021009', safe: '#7dff9a', danger: '#ff3b5c',
      glass: '#d0fff0', paint: '#ff7ad9', pole: ['#0b3a2c', '#2fd49a'], line: '#b8ffd9', poleStyle: 'vine',
      scene: 'aurora', sceneCol: '#46ffb4', finish: ['#ffffff', '#7dff9a'], accent: '#46ffb4', runInst: 'bell' }
  ];
  var LEVELS_PER_WORLD = 4;
  function worldOf(level) { return Math.floor((level - 1) / LEVELS_PER_WORLD) % WORLDS.length; }

  /* ================================================================ segment kinds
     The numeric codes are what debug().kinds reports (1 = hole, 2 = lethal). */
  var SAFE = 0, GAP = 1, DANGER = 2, GLASS = 3, BOOSTK = 4;
  var KINDS = [
    { id: SAFE, name: 'safe', solid: true },
    { id: GAP, name: 'gap', hole: true },
    { id: DANGER, name: 'danger', solid: true, lethal: true },
    { id: GLASS, name: 'glass', solid: true, breakable: true },
    { id: BOOSTK, name: 'boost', hole: true }
  ];
  function isHole(k) { return !!KINDS[k].hole; }

  /* ================================================================ level generator
     levelParams(L) turns the level number into generator settings. Every
     feature has an unlock level so new things arrive one at a time, and a
     short hint is shown the first time it can appear. */
  var GEN = {
    ringsBase: 12, ringsPerLevel: 1, ringsMax: 20,    // rings before the finish
    calmRings: 2,               // first rings of every level carry no danger
    wideGapFrom: 1, wideGapDrop: 0.08, wideGapMin: 0.35, // chance the gap is 2 wide
    dangerBase: 1, dangerPerLevel: 0.5, dangerMax: 5, // static danger per ring
    glassFrom: 2, glassBase: 0.2, glassPer: 0.03, glassMax: 0.4,
    boostFrom: 3, boostChance: 0.22,
    moverFrom: 4, moverBase: 0.25, moverPer: 0.04, moverMax: 0.5,
    moverSpeed: 1.1, moverSpeedPer: 0.08, moverSpeedMax: 2.2, // segments per second
    moverPause: 0.4,            // seconds a mover rests at each end of its rail
    shieldFrom: 2, shieldChance: 0.07
  };
  var INTROS = [
    { level: 2, text: 'GLASS CRACKS - LAND TWICE' },
    { level: 2, text: 'BLUE ORB = SHIELD' },
    { level: 3, text: 'GOLD GAP = BOOST' },
    { level: 4, text: 'SLIDERS FOLLOW THEIR RAIL' }
  ];
  function levelParams(L) {
    var d = L - 1;
    return {
      rings: Math.min(GEN.ringsMax, GEN.ringsBase + d * GEN.ringsPerLevel),
      wideGap: Math.max(GEN.wideGapMin, 1 - Math.max(0, L - GEN.wideGapFrom - 1) * GEN.wideGapDrop),
      danger: Math.min(GEN.dangerMax, GEN.dangerBase + Math.floor(d * GEN.dangerPerLevel)),
      glass: L >= GEN.glassFrom ? Math.min(GEN.glassMax, GEN.glassBase + (L - GEN.glassFrom) * GEN.glassPer) : 0,
      boost: L >= GEN.boostFrom ? GEN.boostChance : 0,
      mover: L >= GEN.moverFrom ? Math.min(GEN.moverMax, GEN.moverBase + (L - GEN.moverFrom) * GEN.moverPer) : 0,
      moverSpeed: Math.min(GEN.moverSpeedMax, GEN.moverSpeed + Math.max(0, L - GEN.moverFrom) * GEN.moverSpeedPer),
      shield: L >= GEN.shieldFrom ? GEN.shieldChance : 0
    };
  }

  function segFree(segs, s, zone) { return segs[s] === SAFE && !zone[s]; }

  // Longest circular run of free segments (for a mover's rail).
  function longestRun(segs, zone) {
    var best = { start: 0, len: 0 };
    for (var s = 0; s < SEG; s++) {
      if (!segFree(segs, s, zone) || segFree(segs, (s + SEG - 1) % SEG, zone)) continue;
      var n = 0;
      while (n < SEG && segFree(segs, (s + n) % SEG, zone)) n++;
      if (n > best.len) best = { start: s, len: n };
    }
    return best;
  }

  // One ring. `zone` marks segments right under the previous ring's holes:
  // the ball lands there after falling, so they never hold danger.
  function makeRing(rng, P, idx, zone, firstEver) {
    var segs = [], i, s;
    for (i = 0; i < SEG; i++) segs.push(SAFE);
    var calm = idx < GEN.calmRings;
    // 1) the guaranteed gap
    var gapLen = rng() < P.wideGap ? 2 : 1;
    var g0 = firstEver ? 7 : rng.int(SEG);       // first gap starts away from the ball
    for (i = 0; i < gapLen; i++) segs[(g0 + i) % SEG] = GAP;
    // 2) optional bonus BOOST gap (one segment, not touching the main gap)
    if (!calm && rng() < P.boost) {
      s = (g0 + gapLen + 2 + rng.int(SEG - gapLen - 3)) % SEG;
      if (segs[s] === SAFE) segs[s] = BOOSTK;
    }
    // 3) glass arc of two segments
    if (idx > 0 && rng() < P.glass) {
      s = rng.int(SEG);
      if (segs[s] === SAFE && segs[(s + 1) % SEG] === SAFE) { segs[s] = GLASS; segs[(s + 1) % SEG] = GLASS; }
    }
    // 4) static danger - never under the landing zone
    var nd = calm ? 0 : P.danger;
    for (i = 0; i < nd; i++) {
      s = rng.int(SEG);
      if (segFree(segs, s, zone)) segs[s] = DANGER;
    }
    if (firstEver) segs[3] = SAFE;               // the ball starts above segment 3
    // 5) moving danger on a rail of free segments
    var mover = null;
    if (!calm && rng() < P.mover) {
      var run = longestRun(segs, zone);
      if (run.len >= 3) {
        var len = Math.min(5, run.len);
        var off = rng.int(run.len - len + 1);
        mover = { a: run.start + off, b: run.start + off + len - 1, speed: P.moverSpeed, phase: rng() };
      }
    }
    // 6) shield orb floating in the main gap
    var pickup = !calm && rng() < P.shield ? { seg: g0, taken: false } : null;
    return { segs: segs, mover: mover, pickup: pickup, glassHits: 0, broken: 0, splats: [], finish: false };
  }

  function holeZone(rg) {
    var z = [];
    for (var s = 0; s < SEG; s++) z.push(rg ? rg.segs[s] !== SAFE && rg.segs[s] !== DANGER : true);
    return z;
  }

  /* ================================================================ movers
     A mover rests at `a`, glides to `b`, rests, glides back. Positions are in
     segment units (the block covers [p, p+1)). */
  function moverState(mv, t) {
    var span = mv.b - mv.a, pause = GEN.moverPause;
    var travel = span / mv.speed, period = 2 * (travel + pause);
    var tt = ((t + mv.phase * period) % period + period) % period;
    var p, dir, rest = 0;
    if (tt < pause) { p = mv.a; dir = 1; rest = pause - tt; }
    else if (tt < pause + travel) { p = mv.a + smooth((tt - pause) / travel) * span; dir = 1; }
    else if (tt < 2 * pause + travel) { p = mv.b; dir = -1; rest = 2 * pause + travel - tt; }
    else { p = mv.b - smooth((tt - 2 * pause - travel) / travel) * span; dir = -1; }
    return { p: p, dir: dir, rest: rest };
  }
  function smooth(x) { x = U.clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function wrapSeg(x) { return ((x % SEG) + SEG) % SEG; }
  function moverCovers(mv, t, u) {
    if (!mv) return false;
    var d = wrapSeg(u - moverState(mv, t).p);
    return d > 0.06 && d < 0.94;
  }

  /* ================================================================ music
     One song per world. World 0 is the original C# minor drum & bass. Layers
     come in by `layer` as the intensity rises through the world's levels. */
  var CLOSED = 4200;
  function songFor(w) {
    if (w === 1) return {   // MAGMA DEPTHS: F harmonic minor, heavier reese
      bpm: 174, key: 53, scale: 'harmonic', chords: [0, 0, 5, 4], seed: 151, filter: CLOSED,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.3, chord: true, params: { cutoff: 700, attack: 1, release: 1.5 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 6, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0.05, gain: 0.55, chord: true, octave: -1, pattern: '0 - - - - - . 0 - - - - 0 - . .' },
        { name: 'hkick', inst: 'kick', layer: 0.12, maxLayer: 0.45, gain: 0.62, pattern: 'x.........x.....' },
        { name: 'hsnare', inst: 'snare', layer: 0.12, maxLayer: 0.45, gain: 0.4, pattern: '........x.......' },
        { name: 'hat', inst: 'hat', layer: 0.25, gain: 0.24, pattern: '..x...x...x.x.x.' },
        { name: 'kick', inst: 'kick', layer: 0.45, gain: 0.62, pattern: 'x.........x..x..' },
        { name: 'snare', inst: 'snare', layer: 0.45, gain: 0.42, pattern: '....x..x....x...' },
        { name: 'reese', inst: 'bass', layer: 0.55, gain: 0.34, chord: true, octave: -1, params: { cutoff: 380, q: 5 },
          pattern: '0 - - . 0 - 1 - 0 - - . -1 - 0 -' },
        { name: 'clap', inst: 'clap', layer: 0.7, gain: 0.25, pattern: '............x..x' },
        { name: 'growl', inst: 'lead', layer: 0.82, gain: 0.18, octave: 0, params: { wave: 'sawtooth', cutoff: 1400 },
          pattern: '0 - . 0 . 2 - . 1 - . 0 . -1 - .' }
      ]
    };
    if (w === 2) return {   // FROZEN SPIRE: F# dorian liquid, marimba + bells
      bpm: 166, key: 54, scale: 'dorian', chords: [0, 3, 5, 4], seed: 152, filter: CLOSED,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.36, chord: true, params: { cutoff: 1600, attack: 0.9, release: 1.8 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }, { deg: 6, steps: 16 }] : null; } },
        { name: 'mallet', inst: 'marimba', layer: 0.05, gain: 0.34, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 ? null : [0, 4, 2, 7, 4, 9, 7, 4][(i.step / 2) % 8]; } },
        { name: 'sub', inst: 'sub', layer: 0.1, gain: 0.5, chord: true, octave: -1, pattern: '0 - - - - - - - . . 0 - - - - .' },
        { name: 'hkick', inst: 'kick', layer: 0.15, maxLayer: 0.5, gain: 0.55, pattern: 'x.........x.....' },
        { name: 'hsnare', inst: 'snare', layer: 0.15, maxLayer: 0.5, gain: 0.36, pattern: '........x.......' },
        { name: 'shaker', inst: 'shaker', layer: 0.3, gain: 0.4, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'kick', inst: 'kick', layer: 0.5, gain: 0.55, pattern: 'x.........x.....' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.38, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.6, gain: 0.22, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'bells', inst: 'bell', layer: 0.8, gain: 0.24, chord: true, octave: 1,
          fn: function (i) { return i.stepInBar === 0 || i.stepInBar === 10 ? { deg: [4, 7, 6, 9][i.bar % 4], vel: 0.55 } : null; } }
      ]
    };
    if (w === 3) return {   // AURORA GARDEN: G# phrygian, gated arp, clap
      bpm: 172, key: 56, scale: 'phrygian', chords: [0, 1, 0, 6], seed: 153, filter: CLOSED,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.34, chord: true, octave: -1, params: { cutoff: 900, attack: 1.1, release: 1.8 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 4, steps: 32 }, { deg: 7, steps: 32 }] : null; } },
        { name: 'stars', inst: 'bell', layer: 0, gain: 0.22, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.18 ? { deg: [0, 1, 4, 7][Math.floor(i.rng() * 4)], vel: 0.4 } : null; } },
        { name: 'sub', inst: 'sub', layer: 0.08, gain: 0.5, chord: true, octave: -1, pattern: '0 - - - - - - . 0 - - . 0 - - -' },
        { name: 'hkick', inst: 'kick', layer: 0.15, maxLayer: 0.5, gain: 0.58, pattern: 'x.........x.....' },
        { name: 'hsnare', inst: 'clap', layer: 0.15, maxLayer: 0.5, gain: 0.34, pattern: '........x.......' },
        { name: 'arp', inst: 'arp', layer: 0.3, gain: 0.18, chord: true, octave: 1, params: { cutoff: 2400 },
          fn: function (i) { return [0, 4, 7, 4, 1, 4, 7, 11][i.step % 8]; } },
        { name: 'kick', inst: 'kick', layer: 0.5, gain: 0.6, pattern: 'x.........x.....' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.4, pattern: '....x..x.x..x...' },
        { name: 'hat', inst: 'hat', layer: 0.62, gain: 0.24, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'lead', inst: 'lead', layer: 0.8, gain: 0.18, octave: 1, params: { wave: 'triangle', cutoff: 2600 },
          pattern: '4 - - 1 0 - - - 7 - - 4 1 - 0 - 4 - - 1 0 - - - 1 - 0 - -1 - - -' }
      ]
    };
    // NEON CORE: C# minor drum & bass - half-time drums while shallow, full
    // two-step break deeper down.
    return {
      bpm: 170, key: 49, scale: 'minor', chords: [0, 0, 5, 6], seed: 15, filter: CLOSED,
      tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.34, chord: true, octave: 0, params: { cutoff: 1000, attack: 0.8, release: 1.5 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 2, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0.08, gain: 0.5, chord: true, octave: -1, pattern: '0 - - - - - - - . . 0 - - - - .' },
        { name: 'hkick', inst: 'kick', layer: 0.15, maxLayer: 0.5, gain: 0.6, pattern: 'x.........x.....' },
        { name: 'hsnare', inst: 'snare', layer: 0.15, maxLayer: 0.5, gain: 0.4, pattern: '........x.......' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.25, pattern: '..x...x...x...xx' },
        { name: 'kick', inst: 'kick', layer: 0.5, gain: 0.6, pattern: 'x.........x.....' },
        { name: 'snare', inst: 'snare', layer: 0.5, gain: 0.42, pattern: '....x..x.x..x...' },
        { name: 'reese', inst: 'bass', layer: 0.62, gain: 0.3, chord: true, octave: -1, params: { cutoff: 500, q: 2 },
          pattern: '0 - - - - - . 0 - - . 2 - - 1 -' },
        { name: 'shaker', inst: 'shaker', layer: 0.72, gain: 0.3, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'stab', inst: 'bell', layer: 0.85, gain: 0.25, chord: true, octave: 1,
          fn: function (i) { return i.stepInBar === 6 || (i.stepInBar === 14 && i.bar % 2) ? [{ deg: 4, vel: 0.6 }, { deg: 7, vel: 0.5 }] : null; } }
      ]
    };
  }

  /* ================================================================ colour helpers */
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  // shade: k < 1 darkens, k > 1 lifts toward white; then mix toward fog by f.
  function tone(rgb, k, fog, f, a) {
    var out = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
      var v = k <= 1 ? rgb[i] * k : rgb[i] + (255 - rgb[i]) * (k - 1);
      if (fog && f > 0) v = v + (fog[i] - v) * f;
      out[i] = Math.round(U.clamp(v, 0, 255));
    }
    return a == null ? 'rgb(' + out[0] + ',' + out[1] + ',' + out[2] + ')' : 'rgba(' + out[0] + ',' + out[1] + ',' + out[2] + ',' + a + ')';
  }
  WORLDS.forEach(function (w) {
    w.c = { safe: hex(w.safe), danger: hex(w.danger), glass: hex(w.glass), paint: hex(w.paint), fog: hex(w.fog),
      f0: hex(w.finish[0]), f1: hex(w.finish[1]), boost: hex(BOOST) };
  });
  function lightAt(a) { return 0.72 + 0.36 * Math.cos(a - LIGHT); }

  /* ================================================================ background scenery
     Visual-only shapes, generated once with a fixed seed (never api.rng). */
  var SCENE = (function () {
    var r = U.rng(0x4e11c5), out = [];
    for (var w = 0; w < WORLDS.length; w++) {
      var list = [];
      for (var i = 0; i < 34; i++) {
        list.push({ x: r(), y: r(), s: 0.4 + r() * 0.8, par: i < 20 ? 0.12 : 0.3, ph: r() * 6.28, spin: (r() - 0.5) * 0.6 });
      }
      out.push(list);
    }
    return out;
  })();

  function drawBackground(ctx, w, h, wi, camY, t, alpha) {
    var wd = WORLDS[wi];
    ctx.save();
    ctx.globalAlpha = alpha;
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, wd.bg[0]); g.addColorStop(1, wd.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // distant towers for depth
    ctx.fillStyle = tone(wd.c.fog, 1.1, null, 0, 0.5);
    for (var k = 0; k < 4; k++) {
      var tx = ((k * 0.29 + 0.07) % 1) * w, tw = w * (0.04 + (k % 2) * 0.025);
      if (Math.abs(tx - w / 2) < w * 0.22) tx += w * 0.3;
      ctx.fillRect(tx - tw / 2, 0, tw, h);
      var bandY = ((k * 97 - camY * 0.08) % 60 + 60) % 60;
      for (var by = bandY; by < h; by += 60) ctx.fillRect(tx - tw, by, tw * 2, 3);
    }
    var list = SCENE[wi], tile = h * 1.6;
    ctx.strokeStyle = wd.sceneCol; ctx.fillStyle = wd.sceneCol;
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var x = it.x * w;
      var y = ((it.y * tile - camY * it.par) % tile + tile) % tile - h * 0.3;
      var s = it.s * (it.par > 0.2 ? 1.6 : 1);
      ctx.globalAlpha = alpha * (it.par > 0.2 ? 0.32 : 0.18);
      if (wd.scene === 'hex') {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (var j = 0; j <= 6; j++) {
          var a = j * Math.PI / 3 + it.ph + t * it.spin * 0.3;
          ctx.lineTo(x + Math.cos(a) * 16 * s, y + Math.sin(a) * 16 * s);
        }
        ctx.stroke();
      } else if (wd.scene === 'ember') {
        var ey = ((y - t * 30 * s) % tile + tile) % tile - h * 0.3;
        ctx.globalAlpha = alpha * (0.35 + 0.35 * Math.sin(t * 3 + it.ph));
        ctx.fillRect(x + Math.sin(t + it.ph) * 6, ey, 2.5 * s, 2.5 * s);
      } else if (wd.scene === 'shard') {
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y - 22 * s); ctx.lineTo(x + 6 * s, y); ctx.lineTo(x, y + 22 * s); ctx.lineTo(x - 6 * s, y); ctx.closePath();
        ctx.stroke();
        ctx.fillRect(x + 20 * s, y + 10, 1.5, 1.5);
      } else {
        ctx.globalAlpha = alpha * (0.3 + 0.4 * Math.abs(Math.sin(t * 1.5 + it.ph)));
        ctx.fillRect(x, y, 1.6, 1.6);
      }
    }
    ctx.globalAlpha = alpha;
    if (wd.scene === 'ember') {                  // lava glow from below
      var lg = ctx.createLinearGradient(0, h * 0.6, 0, h);
      lg.addColorStop(0, 'rgba(255,90,20,0)'); lg.addColorStop(1, 'rgba(255,90,20,0.22)');
      ctx.fillStyle = lg; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    } else if (wd.scene === 'aurora') {          // two drifting aurora curtains
      for (var b = 0; b < 2; b++) {
        ctx.globalAlpha = alpha * 0.16;
        ctx.fillStyle = b ? '#46ffb4' : '#7a5cff';
        ctx.beginPath();
        var base = h * (0.18 + b * 0.16) - ((camY * 0.05) % 40);
        ctx.moveTo(0, base);
        for (var ax = 0; ax <= w; ax += 20) ctx.lineTo(ax, base + Math.sin(ax * 0.018 + t * 0.6 + b * 2) * 22);
        for (ax = w; ax >= 0; ax -= 20) ctx.lineTo(ax, base + 70 + Math.sin(ax * 0.022 + t * 0.5 + b) * 16);
        ctx.closePath(); ctx.fill();
      }
    } else if (wd.scene === 'shard') {           // cold haze at the bottom
      var ig = ctx.createLinearGradient(0, h * 0.65, 0, h);
      ig.addColorStop(0, 'rgba(160,230,255,0)'); ig.addColorStop(1, 'rgba(160,230,255,0.12)');
      ctx.fillStyle = ig; ctx.fillRect(0, h * 0.65, w, h * 0.35);
    }
    ctx.restore();
  }

  /* ================================================================ tower drawing
     G = { cx, r, ri, sq, thick }. Angles are screen angles (local + rot);
     sin(a) > 0 is the front half of the tower. */
  function arcAt(ctx, G, y, rad, a0, a1, ccw) {
    ctx.save();
    ctx.translate(G.cx, y);
    ctx.scale(1, G.sq);
    ctx.arc(0, 0, rad, a0, a1, ccw);
    ctx.restore();
  }
  function topPath(ctx, G, y, a0, a1, rOut, rIn) {
    ctx.beginPath();
    arcAt(ctx, G, y, rOut, a0, a1, false);
    arcAt(ctx, G, y, rIn, a1, a0, true);
    ctx.closePath();
  }
  // Part of [a0, a0+len] that faces the viewer, or null.
  function frontSpan(a0, len) {
    var s = ((a0 % 6.2832) + 6.2832) % 6.2832, e = s + len;
    var lo = Math.max(s, 0), hi = Math.min(e, Math.PI);
    if (hi > lo) return [lo, hi];
    lo = Math.max(s, 2 * Math.PI); hi = Math.min(e, 3 * Math.PI);
    return hi > lo ? [lo, hi] : null;
  }
  function sidePath(ctx, G, y, a0, a1, rad, depth) {
    var sp = frontSpan(a0, a1 - a0);
    if (!sp) return false;
    ctx.beginPath();
    arcAt(ctx, G, y, rad, sp[0], sp[1], false);
    arcAt(ctx, G, y + depth, rad, sp[1], sp[0], true);
    ctx.closePath();
    return true;
  }
  function hatch(ctx, x, y, size, color, t) {
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.beginPath();
    var off = (t * 14) % 10;
    for (var d = -size; d < size; d += 10) { ctx.moveTo(x + d + off - 20, y - 20); ctx.lineTo(x + d + off + 20, y + 20); }
    ctx.stroke();
  }

  // Draw one solid segment (side wall when facing us, then the lit top).
  // look = { top: rgb, alpha, lift, fog, f, dim, stripe (danger), glass, cracks }
  function drawSolid(ctx, G, y, a0, a1, look, t) {
    var mid = (a0 + a1) / 2, lt = lightAt(mid) * look.dim;
    var al = look.alpha == null ? 1 : look.alpha;
    var yy = y + (look.lift || 0), depth = look.depth || G.thick;
    if (Math.sin(mid) > -0.2 && sidePath(ctx, G, yy, a0, a1, G.r, depth)) {
      ctx.fillStyle = tone(look.top, 0.42 * lt, look.fog, look.f, al);
      ctx.fill();
    }
    topPath(ctx, G, yy, a0, a1, G.r, G.ri);
    ctx.fillStyle = tone(look.top, lt, look.fog, look.f, al);
    ctx.fill();
    if (look.stripe) {
      ctx.save();
      ctx.clip();
      var px = G.cx + Math.cos(mid) * (G.r + G.ri) / 2, py = yy + Math.sin(mid) * (G.r + G.ri) / 2 * G.sq;
      hatch(ctx, px, py, G.r * 0.6, tone(look.top, 0.55 * lt, look.fog, look.f, 0.85), t);
      ctx.restore();
    }
    // bright outer rim catches the light
    ctx.beginPath();
    arcAt(ctx, G, yy, G.r - 1, a0, a1, false);
    ctx.strokeStyle = tone(look.top, 1.25 * lt, look.fog, look.f, 0.7 * al);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (look.alpha != null && look.alpha < 1) {       // glass: a bright diagonal glint
      topPath(ctx, G, yy, a0 + (a1 - a0) * 0.3, a0 + (a1 - a0) * 0.45, G.r - 8, G.ri + 10);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.35 * lt) + ')';
      ctx.fill();
    }
    if (look.cracks) {
      var cx = G.cx + Math.cos(mid) * (G.r + G.ri) / 2, cy = yy + Math.sin(mid) * (G.r + G.ri) / 2 * G.sq;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (var j = 0; j < 5; j++) {
        var ca = j * 1.3 + a0 * 3;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ca) * 14, cy + Math.sin(ca) * 6);
        ctx.lineTo(cx + Math.cos(ca + 0.3) * 24, cy + Math.sin(ca + 0.3) * 9);
      }
      ctx.stroke();
    }
  }

  // Draw one half (front or back) of a ring. o = { t, fog, f, dim, rot, world, next, pulse }
  function drawRingHalf(ctx, G, rg, y, front, o) {
    var wd = WORLDS[o.world], C = wd.c, s, a0, a1, mid;
    var order = [];
    for (s = 0; s < SEG; s++) {
      a0 = s * STEP + o.rot;
      mid = a0 + STEP / 2;
      if ((Math.sin(mid) > 0) === front) order.push({ s: s, a0: a0, z: Math.sin(mid) });
    }
    order.sort(function (p, q) { return p.z - q.z; });
    for (var n = 0; n < order.length; n++) {
      s = order[n].s; a0 = order[n].a0 + INSET; a1 = order[n].a0 + STEP - INSET;
      var kind = rg.segs[s];
      if (rg.finish) {
        drawSolid(ctx, G, y, a0, a1, { top: s % 2 ? C.f0 : C.f1, fog: C.fog, f: o.f, dim: o.dim }, o.t);
        topPath(ctx, G, y, a0, a1, (G.r + G.ri) / 2, G.ri);
        ctx.fillStyle = tone(s % 2 ? C.f1 : C.f0, lightAt(a0 + STEP / 2) * o.dim, C.fog, o.f);
        ctx.fill();
      } else if (kind === SAFE) {
        drawSolid(ctx, G, y, a0, a1, { top: C.safe, fog: C.fog, f: o.f, dim: o.dim * (o.next ? 1 : 0.84) }, o.t);
      } else if (kind === DANGER) {
        drawSolid(ctx, G, y, a0, a1, { top: C.danger, fog: C.fog, f: o.f * 0.7, dim: o.dim * (0.95 + o.pulse * 0.15), stripe: true }, o.t);
      } else if (kind === GLASS) {
        drawSolid(ctx, G, y, a0, a1, { top: C.glass, fog: C.fog, f: o.f, dim: o.dim, alpha: 0.42, cracks: rg.glassHits > 0 }, o.t);
      } else if (kind === BOOSTK) {
        // an open gap with a shimmering gold membrane and a down chevron
        topPath(ctx, G, y, a0, a1, G.r, G.ri);
        ctx.fillStyle = tone(C.boost, 1, C.fog, o.f, 0.22 + 0.1 * Math.sin(o.t * 8));
        ctx.fill();
        ctx.strokeStyle = tone(C.boost, 1, C.fog, o.f, 0.9); ctx.lineWidth = 2; ctx.stroke();
        var m2 = (a0 + a1) / 2, bx = G.cx + Math.cos(m2) * (G.r + G.ri) / 2, byy = y + Math.sin(m2) * (G.r + G.ri) / 2 * G.sq;
        var bob = (o.t * 18) % 8;
        ctx.beginPath();
        ctx.moveTo(bx - 8, byy - 4 + bob); ctx.lineTo(bx, byy + 2 + bob); ctx.lineTo(bx + 8, byy - 4 + bob);
        ctx.stroke();
      }
    }
    if (rg.mover) drawMover(ctx, G, rg, y, front, o);
    // paint splats where the ball bounced
    for (var i = 0; i < rg.splats.length; i++) {
      var sp = rg.splats[i], a = sp.u * STEP + o.rot;
      if ((Math.sin(a) > 0) !== front) continue;
      drawSplat(ctx, G, y, a, sp, tone(C.paint, 1, C.fog, o.f, 0.8));
    }
    if (rg.pickup && !rg.pickup.taken) {
      var pa = (rg.pickup.seg + 0.5) * STEP + o.rot;
      if ((Math.sin(pa) > 0) === front) drawShieldOrb(ctx, G.cx + Math.cos(pa) * (G.r + G.ri) / 2, y + Math.sin(pa) * (G.r + G.ri) / 2 * G.sq - 18 + Math.sin(o.t * 4) * 4, 9, o.t);
    }
  }

  // Rail (always visible) + the sliding danger block riding on it.
  function drawMover(ctx, G, rg, y, front, o) {
    var mv = rg.mover, st = moverState(mv, o.t), C = WORLDS[o.world].c, i;
    var rad = (G.r + G.ri) / 2;
    // rail: a dark groove with end stops, drawn in the half it lives in
    ctx.save();
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    for (i = mv.a; i <= mv.b; i++) {
      var ra0 = i * STEP + o.rot + 0.08, ra1 = ra0 + STEP - 0.16;
      if ((Math.sin(ra0 + STEP / 2) > 0) !== front) continue;
      ctx.beginPath(); arcAt(ctx, G, y, rad, ra0, ra1, false); ctx.stroke();
    }
    ctx.strokeStyle = tone(C.danger, 1.1, C.fog, o.f, 0.75); ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 5]); ctx.lineDashOffset = -o.t * 12;
    for (i = mv.a; i <= mv.b; i++) {
      var da0 = i * STEP + o.rot + 0.08;
      if ((Math.sin(da0 + STEP / 2) > 0) !== front) continue;
      ctx.beginPath(); arcAt(ctx, G, y, rad, da0, da0 + STEP - 0.16, false); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.lineWidth = 2.5;
    [mv.a + 0.08, mv.b + 0.92].forEach(function (e) {
      var ea = e * STEP + o.rot;
      if ((Math.sin(ea) > 0) !== front) return;
      var ex = G.cx + Math.cos(ea) * rad, ey = y + Math.sin(ea) * rad * G.sq;
      ctx.beginPath(); ctx.moveTo(ex, ey - 6); ctx.lineTo(ex, ey + 4); ctx.stroke();
    });
    ctx.restore();
    // the block itself, raised above the ring
    var b0 = st.p * STEP + o.rot + INSET, b1 = b0 + STEP - INSET * 2, bm = (b0 + b1) / 2;
    if ((Math.sin(bm) > 0) !== front) return;
    var blink = st.rest > 0 && st.rest < 0.25 ? 1.25 : 1;
    var lift = -G.thick * 0.85;
    drawSolid(ctx, G, y, b0, b1, { top: C.danger, fog: C.fog, f: o.f * 0.6, dim: o.dim * blink * (1.05 + o.pulse * 0.15), lift: lift, depth: -lift, stripe: true }, o.t);
    topPath(ctx, G, y + lift, b0, b1, G.r, G.ri);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.55 + 0.3 * o.pulse) + ')'; ctx.lineWidth = 1.5; ctx.stroke();
    // direction chevron on top of the block
    var cx = G.cx + Math.cos(bm) * rad, cy = y + lift + Math.sin(bm) * rad * G.sq;
    var dx = -Math.sin(bm) * st.dir, dy = Math.cos(bm) * st.dir * G.sq;
    var dl = Math.sqrt(dx * dx + dy * dy) || 1; dx /= dl; dy /= dl;
    ctx.save();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx - dx * 4 - dy * 5, cy - dy * 4 + dx * 5);
    ctx.lineTo(cx + dx * 4, cy + dy * 4);
    ctx.lineTo(cx - dx * 4 + dy * 5, cy - dy * 4 - dx * 5);
    ctx.stroke();
    ctx.restore();
  }

  function drawSplat(ctx, G, y, a, sp, color) {
    var rad = (G.r + G.ri) / 2 + sp.dr;
    var x = G.cx + Math.cos(a) * rad, yy = y + Math.sin(a) * rad * G.sq;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(x, yy, sp.s, sp.s * 0.42, 0, 0, 7); ctx.fill();
    for (var i = 0; i < 3; i++) {
      var da = sp.seed + i * 2.1, dd = sp.s * (1.1 + (i % 2) * 0.4);
      ctx.beginPath(); ctx.ellipse(x + Math.cos(da) * dd, yy + Math.sin(da) * dd * 0.42, 2.4, 1.2, 0, 0, 7); ctx.fill();
    }
  }

  function drawShieldOrb(ctx, x, y, r, t) {
    ctx.save();
    var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 1, x, y, r * 1.6);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, SHIELD); g.addColorStop(1, 'rgba(90,184,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, 7); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.9;
    ctx.beginPath();                                  // little shield glyph
    ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y - 4); ctx.lineTo(x + 4, y + 1); ctx.lineTo(x, y + 5); ctx.lineTo(x - 4, y + 1); ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 6);
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, 7); ctx.stroke();
    ctx.restore();
  }

  function drawPole(ctx, G, wi, top, bottom, rot, camY, t) {
    var wd = WORLDS[wi], w2 = G.ri - 4, x0 = G.cx - w2, i, a;
    var pg = ctx.createLinearGradient(x0, 0, G.cx + w2, 0);
    pg.addColorStop(0, wd.pole[0]); pg.addColorStop(0.38, wd.pole[1]); pg.addColorStop(1, wd.pole[0]);
    ctx.fillStyle = pg;
    ctx.fillRect(x0, top, w2 * 2, bottom - top);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, top, w2 * 2, bottom - top); ctx.clip();
    ctx.strokeStyle = wd.line;
    // vertical details rotate with the tower so spinning is visible
    for (i = 0; i < 6; i++) {
      a = rot + i * Math.PI / 3;
      if (Math.sin(a) <= 0) continue;
      var x = G.cx + Math.cos(a) * w2;
      ctx.globalAlpha = 0.25 + 0.35 * Math.sin(a);
      if (wd.poleStyle === 'neon') {
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
      } else if (wd.poleStyle === 'rock') {       // glowing zig-zag cracks
        ctx.lineWidth = 1.6; ctx.beginPath();
        for (var y = top - ((camY * 1) % 40); y < bottom + 40; y += 20) ctx.lineTo(x + ((Math.floor((y + camY) / 20) % 2) ? 3 : -3), y);
        ctx.stroke();
      } else if (wd.poleStyle === 'crystal') {    // wide bright facets
        ctx.fillStyle = wd.line; ctx.globalAlpha *= 0.4;
        ctx.fillRect(x - 3, top, 6 * Math.sin(a), bottom - top);
      } else {                                    // vine spiral
        ctx.lineWidth = 2.2; ctx.beginPath();
        for (var vy = top; vy < bottom; vy += 8) {
          var va = a + (vy + camY) * 0.02;
          if (Math.sin(va) > 0) ctx.lineTo(G.cx + Math.cos(va) * w2, vy); else ctx.moveTo(G.cx + Math.cos(va) * w2, vy);
        }
        ctx.stroke();
      }
    }
    // horizontal bands scroll with the camera
    ctx.globalAlpha = wd.poleStyle === 'neon' ? 0.55 : 0.25;
    ctx.fillStyle = wd.line;
    var gap = wd.poleStyle === 'neon' ? 59 : 118;
    for (var by = top - ((camY % gap) + gap) % gap; by < bottom; by += gap) ctx.fillRect(x0, by, w2 * 2, wd.poleStyle === 'neon' ? 2 : 4);
    ctx.restore();
  }

  function drawBall(ctx, x, y, r, squash, fire, t) {
    var sx = 1 + squash * 0.32, sy = 1 - squash * 0.28;
    ctx.save();
    ctx.translate(x, y + r * (1 - sy));
    ctx.scale(sx, sy);
    var g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 1, 0, 0, r);
    if (fire) { g.addColorStop(0, '#fff6c8'); g.addColorStop(0.5, '#ffc14d'); g.addColorStop(1, '#ff5a1a'); }
    else { g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#e8e4f4'); g.addColorStop(1, '#a9a2c4'); }
    ctx.shadowColor = fire ? FIRE : 'rgba(255,230,200,0.8)'; ctx.shadowBlur = fire ? 26 : 10;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ================================================================ game */
  function create(api) {
    var rng = api.rng;

    // ---- tower state
    var rings = [];                 // index k -> ring (null once far above)
    var levels = [];                // [{ startK, finishK, rings, world }], index = level - 1
    var rot = 0, cam = -200;
    var ball = { y: -60, vy: 0, squash: 0, boostT: 0 };
    var nextRing = 0;
    // ---- run state
    var level = 1, world = 0, prevWorld = 0, bgBlend = 1;
    var combo = 0, run = 0, passed = 0, shield = 0, grace = false;
    var fireOn = false, lastInt = -1, clearT = 0, clearRing = -1;
    var over = false, overT = 0, t = 0;
    var debris = [], banners = [], flash = 0;
    var lastPX = null, lastMoved = api.pointer().moved;
    var MAX_DEBRIS = 140, MAX_SPLATS = 4;

    /* ---------- level building */
    function buildLevel() {
      var L = levels.length + 1, P = levelParams(L), startK = rings.length;
      var info = { startK: startK, rings: P.rings, finishK: startK + P.rings, world: worldOf(L) };
      for (var i = 0; i < P.rings; i++) {
        var prev = i === 0 ? null : rings[startK + i - 1];
        var rg = makeRing(rng, P, i, holeZone(prev), startK === 0 && i === 0);
        rg.y = (startK + i) * GAP_Y; rg.level = L; rg.world = info.world;
        rings.push(rg);
      }
      var fin = { segs: [], mover: null, pickup: null, glassHits: 0, broken: 0, splats: [], finish: true,
        y: info.finishK * GAP_Y, level: L, world: info.world };
      for (var s = 0; s < SEG; s++) fin.segs.push(SAFE);
      rings.push(fin);
      levels.push(info);
    }
    function ring(k) { while (rings.length <= k) buildLevel(); return rings[k]; }
    ring(20);

    /* ---------- music */
    function mus() { return M(); }
    if (mus()) mus().play(songFor(0), { fade: 1.2, intensity: 0 });
    function setFire(on) {
      if (on === fireOn) return;
      fireOn = on;
      var m = mus();
      if (!m) return;
      m.setFilter(on ? 16000 : CLOSED, on ? 0.25 : 0.5);
      if (on) m.note('riser', 0, { dur: 0.8, gain: 0.4 });
    }
    function syncIntensity() {
      var m = mus();
      if (!m) return;
      var info = levels[level - 1];
      var prog = info ? U.clamp((nextRing - info.startK) / info.rings, 0, 1) : 0;
      var it = Math.round(U.clamp(0.12 + ((level - 1) % LEVELS_PER_WORLD) * 0.2 + prog * 0.18, 0, 1) * 20) / 20;
      if (it !== lastInt) { lastInt = it; m.setIntensity(it); }
    }

    /* ---------- helpers */
    function ballU() {
      var local = ((FRONT - rot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      return local / STEP;
    }
    function segUnderBall() { return Math.floor(ballU()) % SEG; }
    function kindAt(rg, u) {
      if (moverCovers(rg.mover, t, u)) return DANGER;
      return rg.segs[Math.floor(u) % SEG];
    }
    function screenY(worldY) { return worldY - cam; }
    function ballScreenY() { return screenY(ball.y) + MID * SQ; }
    function banner(title, sub, col, dur) { banners.push({ title: title, sub: sub || '', col: col || '#ffffff', t: 0, dur: dur || 2.2 }); }
    function segColour(rg, s) {
      var C = WORLDS[rg.world].c;
      if (rg.finish) return s % 2 ? WORLDS[rg.world].finish[0] : WORLDS[rg.world].finish[1];
      var k = rg.segs[s];
      return k === DANGER ? WORLDS[rg.world].danger : k === GLASS ? WORLDS[rg.world].glass : tone(C.safe, 1);
    }
    function addDebris(rg, s) {
      if (debris.length >= MAX_DEBRIS) debris.splice(0, 4);
      var a = (s + Math.random()) * STEP + rot, rad = RI + Math.random() * (R - RI);
      debris.push({ x: CX + Math.cos(a) * rad, y: rg.y + Math.sin(a) * rad * SQ,
        vx: Math.cos(a) * (80 + Math.random() * 160), vy: -120 - Math.random() * 180,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 14, s: 5 + Math.random() * 7,
        col: segColour(rg, s), life: 1.1, glass: rg.segs[s] === GLASS });
    }
    function shatter(rg, only) {
      for (var s = 0; s < SEG; s++) {
        if (isHole(rg.segs[s]) || (only != null && rg.segs[s] !== only)) continue;
        addDebris(rg, s); addDebris(rg, s);
      }
    }
    function addSplat(rg, u) {
      rg.splats.push({ u: u, dr: (Math.random() - 0.5) * 30, s: 7 + Math.random() * 5, seed: Math.random() * 6 });
      if (rg.splats.length > MAX_SPLATS) rg.splats.shift();
    }

    /* ---------- gameplay events */
    function bounce(rg, u, quiet) {
      ball.y = rg.y - BALL_R;
      ball.vy = BOUNCE_V;
      ball.squash = 1;
      combo = 0; run = 0; grace = false;
      setFire(false);
      syncIntensity();
      addSplat(rg, u);
      if (!quiet) api.audio.tone(180, 0.05, { type: 'square', vol: 0.1 });
      api.fx.burst(CX, screenY(rg.y) + MID * SQ, WORLDS[rg.world].paint, 6, 80, 0.3);
    }

    function passHole(rg, k, s, kind) {
      passed++;
      combo++;
      var pts = 10 * combo, m = mus(), sy = screenY(rg.y);
      if (kind === BOOSTK) {
        combo++;                                      // boost charges the fireball faster
        pts += 25;
        ball.vy = Math.max(ball.vy, 0) + 260;
        ball.boostT = 0.5;
        api.fx.burst(CX, sy + MID * SQ, BOOST, 18, 180, 0.5);
        api.fx.text(CX - 50, sy - 14, 'BOOST', BOOST, 12);
        if (m) m.note('bell', 7, { octave: 1, gain: 0.5 });
        else api.audio.tone(880, 0.1, { type: 'triangle', vol: 0.14 });
      }
      api.addScore(pts);
      if (combo > 1) api.fx.text(CX + 40, sy - 10, '+' + pts, combo >= FIRE_AT ? FIRE : '#fff', 11 + Math.min(combo, 5));
      if (rg.pickup && !rg.pickup.taken && (rg.pickup.seg === s || rg.pickup.seg === (s + SEG - 1) % SEG || rg.pickup.seg === (s + 1) % SEG)) collectShield(rg);
      if (m) {
        // a cascade: every gap in one fall is the next note down the scale
        m.note(WORLDS[rg.world].runInst, 9 - Math.min(run, 16), { octave: 0, gain: 0.7, params: { decay: 0.35 } });
        run++;
      } else api.audio.tone(300 + Math.min(combo, 12) * 60, 0.06, { type: 'triangle', vol: 0.12 });
      if (combo >= FIRE_AT && !fireOn) api.fx.text(CX, sy + 40, 'FIREBALL!', FIRE, 14);
      setFire(combo >= FIRE_AT);
      nextRing = k + 1;
    }

    function collectShield(rg) {
      rg.pickup.taken = true;
      api.addScore(15);
      api.fx.burst(CX, ballScreenY(), SHIELD, 20, 160, 0.6);
      api.fx.text(CX, ballScreenY() - 24, shield ? '+15' : 'SHIELD', SHIELD, 13);
      shield = 1;
      var m = mus();
      if (m) m.stinger([{ deg: 0 }, { deg: 4, at: 1 }, { deg: 7, at: 2 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.45 });
      else api.audio.arp([660, 880, 1100], 0.05, { type: 'triangle', vol: 0.14 });
    }

    function smash(rg, k) {
      rg.broken = 2;
      shatter(rg);
      passed++;
      var sy = screenY(rg.y);
      api.addScore(20 + combo * 5);
      api.fx.burst(CX, sy + MID * SQ, FIRE, 40, 260, 0.8);
      api.fx.burst(CX, sy + MID * SQ, '#ffffff', 12, 200, 0.4);
      api.fx.text(CX, sy - 20, 'SMASH', FIRE, 15);
      api.shake(7);
      flash = 0.6;
      api.audio.noise(0.25, { vol: 0.28, cutoff: 1400 });
      if (mus()) mus().note('sub', 0, { octave: -2, dur: 0.4, gain: 0.8 });
      combo = 0; run = 0;
      grace = true;                                   // the next landing forgives danger
      setFire(false);
      syncIntensity();
      nextRing = k + 1;
      ball.vy = SMASH_HOP;
    }

    function hitGlass(rg, k, u) {
      rg.glassHits++;
      var sy = screenY(rg.y);
      if (rg.glassHits >= GLASS_HITS) {
        shatter(rg, GLASS);
        for (var s = 0; s < SEG; s++) if (rg.segs[s] === GLASS) rg.segs[s] = GAP;
        api.audio.noise(0.18, { vol: 0.22, cutoff: 5200 });
        if (mus()) mus().note('bell', 9, { octave: 1, gain: 0.45 });
        api.fx.text(CX, sy - 16, 'CRASH +15', '#ffffff', 12);
        api.addScore(15);
        passHole(rg, k, Math.floor(u) % SEG, GAP);
        return false;
      }
      api.audio.tone(1800, 0.06, { type: 'triangle', vol: 0.1 });
      if (mus()) mus().note('bell', 11, { octave: 1, gain: 0.3 });
      api.fx.burst(CX, sy + MID * SQ, '#ffffff', 8, 90, 0.3);
      bounce(rg, u, true);
      return true;
    }

    function hitDanger(rg, u) {
      var sy = screenY(rg.y);
      if (shield) {
        shield = 0;
        api.fx.burst(CX, sy + MID * SQ, SHIELD, 30, 220, 0.6);
        api.fx.text(CX, sy - 20, 'SHIELD SAVED YOU', SHIELD, 11);
        api.shake(5);
        api.audio.noise(0.2, { vol: 0.2, cutoff: 3000 });
        if (mus()) mus().duck(0.5, 0.4);
        bounce(rg, u, true);
        grace = true;                                 // a moment to steer off
        return;
      }
      if (grace) {
        api.fx.burst(CX, sy + MID * SQ, '#ffffff', 10, 120, 0.3);
        bounce(rg, u, true);
        return;
      }
      over = true;
      ball.squash = 1;
      api.fx.burst(CX, sy + MID * SQ, WORLDS[rg.world].danger, 36, 220, 0.9);
      api.fx.burst(CX, sy + MID * SQ, '#ffffff', 16, 160, 0.5);
      api.shake(12);
      api.audio.tone(160, 0.5, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
      setFire(false);
      if (mus()) mus().tapeStop(1.1);
    }

    function landFinish(rg, k, u) {
      setFire(false);
      bounce(rg, u);
      if (rg.cleared) return;
      rg.cleared = true;
      clearT = CLEAR_TIME; clearRing = k;
      var bonus = 100 * level;
      api.addScore(bonus);
      var wd = WORLDS[rg.world];
      banner('LEVEL ' + level + ' CLEAR', '+' + bonus, wd.finish[1], CLEAR_TIME);
      for (var i = 0; i < 4; i++) api.fx.burst(CX + (i - 1.5) * 70, screenY(rg.y) - 30, [wd.finish[1], '#ffffff', wd.accent, BOOST][i], 22, 240, 1);
      var m = mus();
      if (m) m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3 }, { deg: 9, at: 4 }, { deg: 11, at: 5, steps: 6 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.6 });
      else api.audio.arp([523, 659, 784, 1047], 0.08, { type: 'triangle', vol: 0.18 });
    }

    // Celebration over: the finish platform bursts open and the next level starts.
    function openFinish() {
      var rg = rings[clearRing];
      if (rg) { rg.broken = 2; shatter(rg); }
      api.audio.noise(0.3, { vol: 0.25, cutoff: 2400 });
      startLevel(level + 1);
    }

    function startLevel(L) {
      level = L;
      var w = worldOf(L), m = mus();
      var intro = INTROS.filter(function (x) { return x.level === L; }).map(function (x) { return x.text; });
      var sub = intro.length ? intro.join('  /  ') : '';
      if (w !== world) {
        prevWorld = world; world = w; bgBlend = 0;
        banner('WORLD ' + (Math.floor((L - 1) / LEVELS_PER_WORLD) + 1) + ': ' + WORLDS[w].name, sub || 'LEVEL ' + L, WORLDS[w].accent, 2.8);
        if (m) {
          m.play(songFor(w), { fade: 1.6, intensity: m.intensity(), keepFilter: true });
          m.note('riser', 0, { dur: 1.2, gain: 0.35 });
        }
      } else banner('LEVEL ' + L, sub, WORLDS[w].accent, sub ? 2.8 : 2);
      lastInt = -1;
      syncIntensity();
    }

    // Returns true when the fall stops at this ring.
    function crossRing(rg, k) {
      var u = ballU(), s = Math.floor(u) % SEG;
      if (rg.finish) { landFinish(rg, k, u); return true; }
      var kind = kindAt(rg, u);
      if (isHole(kind)) { passHole(rg, k, s, kind); return false; }
      if (fireOn) { smash(rg, k); return true; }
      if (kind === DANGER) { hitDanger(rg, u); return true; }
      if (kind === GLASS) return hitGlass(rg, k, u);
      bounce(rg, u);
      return true;
    }

    /* ---------- per-frame */
    function steer(dt) {
      var inp = api.input;
      inp.takeSwipes();
      if (inp.held('left')) rot -= ROT_KEYS * dt;
      if (inp.held('right')) rot += ROT_KEYS * dt;
      var p = api.pointer();
      if (p.down) {
        if (lastPX !== null && p.moved !== lastMoved) rot += (p.x - lastPX) * ROT_DRAG;
        lastPX = p.x;
      } else lastPX = null;
      lastMoved = p.moved;
    }

    function stepBall(dt) {
      var prevBottom = ball.y + BALL_R;
      ball.boostT = Math.max(0, ball.boostT - dt);
      var cap = ball.boostT > 0 ? BOOST_FALL : MAX_FALL;
      ball.vy = ball.vy > cap ? ball.vy - 1200 * dt : Math.min(cap, ball.vy + GRAVITY * dt);
      ball.y += ball.vy * dt;
      ball.squash = Math.max(0, ball.squash - dt * 6);
      var bottom = ball.y + BALL_R;
      for (var k = nextRing; k < nextRing + 3; k++) {
        var rg = ring(k);
        if (!rg || rg.broken) { if (k === nextRing) nextRing++; continue; }
        if (prevBottom <= rg.y && bottom >= rg.y && ball.vy > 0) {
          if (crossRing(rg, k)) break;
        }
      }
    }

    function stepEffects(dt) {
      for (var i = debris.length - 1; i >= 0; i--) {
        var d = debris[i];
        d.life -= dt;
        if (d.life <= 0) { debris.splice(i, 1); continue; }
        d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.r += d.vr * dt;
      }
      if (banners.length) { banners[0].t += dt; if (banners[0].t > banners[0].dur) banners.shift(); }
      bgBlend = Math.min(1, bgBlend + dt / 1.6);
      flash = Math.max(0, flash - dt * 2);
      // free rings far above the camera
      for (var k = Math.max(0, nextRing - 12); k < nextRing - 6; k++) rings[k] = null;
    }

    function status() {
      var bits = 'LV ' + level + '  \u00b7  RINGS ' + passed;
      if (fireOn) bits += '  \u00b7  FIREBALL';
      else if (combo > 1) bits += '  \u00b7  COMBO ' + combo;
      if (shield) bits += '  \u00b7  SHIELD';
      api.setStatus(bits);
    }

    // start-of-run banner
    banner('WORLD 1: ' + WORLDS[0].name, 'LEVEL 1', WORLDS[0].accent, 2.4);
    syncIntensity();

    /* ---------- render pieces */
    function renderTower(ctx, pulse) {
      var first = Math.max(0, Math.floor((cam - 80) / GAP_Y)), last = Math.floor((cam + H + 80) / GAP_Y);
      var bsy = ballScreenY(), k, rg, o;
      function opts(rg, k) {
        var sy = screenY(rg.y);
        return { t: t, rot: rot, world: rg.world, next: k === nextRing || rg.finish, pulse: pulse,
          f: U.clamp((sy - bsy - 150) / 330, 0, 0.78), dim: 1 };
      }
      for (k = last; k >= first; k--) {
        rg = rings[k];
        if (!rg || rg.broken) continue;
        o = opts(rg, k);
        drawRingHalf(ctx, PLAY_G, rg, screenY(rg.y), false, o);
      }
      drawPole(ctx, PLAY_G, world, -20, H + 20, rot, cam, t);
      for (k = last; k >= first; k--) {
        rg = rings[k];
        if (!rg || rg.broken) continue;
        o = opts(rg, k);
        drawRingHalf(ctx, PLAY_G, rg, screenY(rg.y), true, o);
        if (rg.finish && !rg.cleared) U.glowText(ctx, 'FINISH', CX, screenY(rg.y) + R * SQ + THICK + 16, 11, WORLDS[rg.world].finish[1]);
      }
    }

    function renderBall(ctx) {
      var by = ballScreenY();
      if (over) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - overT * 1.5);
        drawBall(ctx, CX, by, BALL_R * (1 + overT), 1, false, t);
        ctx.restore();
        return;
      }
      if (fireOn) {
        // flame tongues streaming upward behind the ball
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < 6; i++) {
          var fy = by - 8 - i * 9 - (t * 60 % 9), fr = BALL_R * (1 - i * 0.13);
          ctx.globalAlpha = 0.5 - i * 0.07;
          ctx.fillStyle = i < 2 ? '#ffe28a' : i < 4 ? FIRE : '#ff4a1a';
          ctx.beginPath(); ctx.arc(CX + Math.sin(t * 20 + i) * 3, fy, fr, 0, 7); ctx.fill();
        }
        var halo = ctx.createRadialGradient(CX, by, 4, CX, by, 46);
        halo.addColorStop(0, 'rgba(255,160,40,0.55)'); halo.addColorStop(1, 'rgba(255,90,20,0)');
        ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t * 18);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(CX, by, 46, 0, 7); ctx.fill();
        ctx.restore();
        if (Math.random() < 0.7) api.fx.trail(CX + (Math.random() - 0.5) * 10, by - 6, Math.random() < 0.5 ? FIRE : '#ffe28a', (Math.random() - 0.5) * 30, -70);
      }
      var stretch = !fireOn && ball.vy > 500 ? -0.25 : 0;
      drawBall(ctx, CX, by, BALL_R, ball.squash + stretch, fireOn, t);
      if (shield) {
        ctx.save();
        ctx.strokeStyle = SHIELD; ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 6);
        ctx.setLineDash([5, 4]); ctx.lineDashOffset = -t * 30;
        ctx.beginPath(); ctx.arc(CX, by, BALL_R + 7, 0, 7); ctx.stroke();
        ctx.restore();
      }
    }

    function renderDebris(ctx) {
      for (var i = 0; i < debris.length; i++) {
        var d = debris[i];
        ctx.save();
        ctx.globalAlpha = Math.min(1, d.life * 1.5) * (d.glass ? 0.6 : 1);
        ctx.translate(d.x, d.y - cam); ctx.rotate(d.r);
        ctx.fillStyle = d.col;
        ctx.beginPath(); ctx.moveTo(-d.s, -d.s * 0.4); ctx.lineTo(d.s, -d.s * 0.2); ctx.lineTo(0, d.s * 0.6); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    function renderHud(ctx) {
      var info = levels[level - 1], wd = WORLDS[world];
      var prog = info ? U.clamp((nextRing - info.startK) / (info.rings + 1), 0, 1) : 0;
      if (clearT > 0) prog = 1;
      // level progress bar
      var bx = 72, bw = W - 144, by = 22;
      ctx.save();
      var hg = ctx.createLinearGradient(0, 0, 0, 80);
      hg.addColorStop(0, 'rgba(0,0,0,0.55)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, 0, W, 80);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      U.roundRect(ctx, bx, by - 6, bw, 12, 6); ctx.fill();
      ctx.fillStyle = wd.accent;
      if (prog > 0) { U.roundRect(ctx, bx + 2, by - 4, Math.max(8, (bw - 4) * prog), 8, 4); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (var i = 1; i < 4; i++) ctx.fillRect(bx + bw * i / 4, by - 4, 1, 8);
      [[bx - 20, level], [bx + bw + 20, level + 1]].forEach(function (p, j) {
        ctx.fillStyle = j ? 'rgba(0,0,0,0.5)' : wd.accent;
        ctx.beginPath(); ctx.arc(p[0], by, 14, 0, 7); ctx.fill();
        ctx.strokeStyle = wd.accent; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = '800 11px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = j ? '#ffffff' : '#10081c';
        ctx.fillText(String(p[1]), p[0], by + 1);
      });
      ctx.font = '700 8px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(wd.name, W / 2, by + 16);
      // fire meter: pips fill with the combo, then a flaming pill
      var fy = by + 34;
      if (fireOn) {
        ctx.fillStyle = 'rgba(255,120,20,' + (0.55 + 0.25 * Math.sin(t * 14)) + ')';
        U.roundRect(ctx, W / 2 - 52, fy - 9, 104, 18, 9); ctx.fill();
        U.glowText(ctx, 'FIREBALL', W / 2, fy + 1, 9, '#fff3c4');
      } else {
        for (i = 0; i < FIRE_AT; i++) {
          ctx.fillStyle = i < combo ? FIRE : 'rgba(255,255,255,0.18)';
          ctx.beginPath(); ctx.arc(W / 2 + (i - 1) * 16, fy, 4.5, 0, 7); ctx.fill();
        }
      }
      if (shield) drawShieldOrb(ctx, W - 26, 62, 8, t);
      ctx.restore();
    }

    function renderBanners(ctx) {
      var b = banners[0];
      if (!b) return;
      var a = Math.min(1, b.t * 4, (b.dur - b.t) * 3);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a) * 0.9;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 118, W, b.sub ? 56 : 38);
      ctx.globalAlpha = Math.max(0, a);
      U.glowText(ctx, b.title, W / 2, 137, b.title.length > 22 ? 11 : 14, b.col);
      if (b.sub) U.glowText(ctx, b.sub, W / 2, 160, b.sub.length > 34 ? 7 : 9, '#ffffff');
      ctx.restore();
    }

    return {
      // Read-only test hook.
      debug: function () {
        var rg = ring(nextRing), kinds = [];
        for (var s = 0; s < SEG; s++) kinds.push(rg.finish ? SAFE : kindAt(rg, s + 0.5));
        return {
          seg: segUnderBall(), kinds: kinds, passed: passed,
          level: level, world: world, worldName: WORLDS[world].name,
          ring: nextRing, ringInLevel: nextRing - levels[level - 1].startK, levelRings: levels[level - 1].rings,
          finish: !!rg.finish, clearing: clearT > 0, combo: combo, fireball: fireOn, shield: shield, grace: grace,
          mover: rg.mover ? moverState(rg.mover, t).p : null, glassHits: rg.glassHits, pickup: !!(rg.pickup && !rg.pickup.taken),
          ballY: ball.y, vy: ball.vy, cam: cam, rot: rot, debris: debris.length, dead: over
        };
      },

      update: function (dt) {
        t += dt;
        steer(dt);
        if (over) { overT += dt; stepEffects(dt); if (overT > 1.2) api.gameOver(); return; }
        if (clearT > 0) { clearT -= dt; if (clearT <= 0) openFinish(); }
        stepBall(dt);
        ring(nextRing + 12);
        // camera only follows the ball downward, smoothly
        var target = Math.max(cam, ball.y - CAM_LEAD);
        cam += (target - cam) * Math.min(1, dt * 7);
        stepEffects(dt);
        status();
      },

      render: function (ctx) {
        var m = mus(), pulse = m ? m.pulse(6) : 0;
        if (bgBlend < 1) drawBackground(ctx, W, H, prevWorld, cam, t, 1);
        drawBackground(ctx, W, H, world, cam, t, bgBlend < 1 ? bgBlend : 1);
        renderTower(ctx, pulse);
        renderDebris(ctx);
        renderBall(ctx);
        if (fireOn || flash > 0) {                  // heat vignette
          var v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
          v.addColorStop(0, 'rgba(255,120,20,0)');
          v.addColorStop(1, 'rgba(255,100,20,' + ((fireOn ? 0.28 : 0) + flash * 0.3).toFixed(3) + ')');
          ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
        }
        renderHud(ctx);
        renderBanners(ctx);
        if (passed === 0 && !over) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'DRAG OR \u2190\u2192 TO SPIN', W / 2, H - 40, 12, '#ffe2bd');
          ctx.restore();
        }
      }
    };
  }

  /* ================================================================ attract
     A small tower cycling through the worlds, with every segment kind. */
  var DEMO = [
    { segs: [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0] },
    { segs: [0, 2, 0, 0, 3, 3, 0, 0, 0, 1, 1, 0] },
    { segs: [0, 0, 1, 4, 0, 0, 2, 0, 0, 0, 0, 0], mover: { a: 6, b: 10, speed: 1.6, phase: 0 } },
    { segs: [1, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1] }
  ];
  function attract(ctx, w, h, t) {
    var wi = Math.floor(t / 6) % WORLDS.length;
    drawBackground(ctx, w, h, wi, t * 40, t, 1);
    var r = Math.min(w * 0.36, h * 0.33);
    var G = { cx: w / 2, r: r, ri: r * 0.22, sq: SQ, thick: r * 0.09 };
    var rot = t * 1.1, gapY = h * 0.25;
    var o = { t: t, rot: rot, world: wi, next: true, pulse: 0.5 + 0.5 * Math.sin(t * 6), f: 0, dim: 1 };
    var i, rg;
    for (i = DEMO.length - 1; i >= 0; i--) {
      rg = { segs: DEMO[i].segs, mover: DEMO[i].mover || null, pickup: i === 3 ? { seg: 0, taken: false } : null, glassHits: 1, splats: [], finish: false };
      o.rot = rot + i; o.f = i * 0.15;
      drawRingHalf(ctx, G, rg, h * 0.2 + i * gapY, false, o);
    }
    drawPole(ctx, G, wi, 0, h, rot, t * 40, t);
    for (i = DEMO.length - 1; i >= 0; i--) {
      rg = { segs: DEMO[i].segs, mover: DEMO[i].mover || null, pickup: i === 3 ? { seg: 0, taken: false } : null, glassHits: 1, splats: [], finish: false };
      o.rot = rot + i; o.f = i * 0.15;
      drawRingHalf(ctx, G, rg, h * 0.2 + i * gapY, true, o);
    }
    var ph = (t * 1.6) % 1, hop = 4 * ph * (1 - ph);
    var br = h * 0.03;
    var by = h * 0.2 + ((G.r + G.ri) / 2) * SQ - br - hop * h * 0.14;
    drawBall(ctx, w / 2, by, br, ph < 0.08 || ph > 0.94 ? 0.8 : 0, false, t);
    U.glowText(ctx, WORLDS[wi].name, w / 2, Math.max(10, h * 0.06), Math.max(7, Math.round(h * 0.035)), WORLDS[wi].accent);
  }

  XA.registerGame({
    id: 'xa_helix_drop',
    order: 15,
    title: 'Helix Drop',
    tagline: 'Spin the tower. Fall through.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO SPIN THE TOWER',
    controls: 'Drag or \u2190\u2192 to spin the tower',
    create: create,
    attract: attract
  });
})(window);

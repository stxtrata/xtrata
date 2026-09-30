/*
 * Xtrata Arcade cartridge #21 - PONG STREAK (v2)
 *
 * You against a ladder of machines. Every return scores more the longer the
 * rally runs; get the ball past the machine for a big bonus. Score enough
 * points against a machine and you beat it: the next one on the ladder walks
 * out in its own neon arena with its own playing style. After the final
 * machine the ladder loops as tougher "MK" versions. Three lives (one back,
 * up to five, for every machine you beat).
 *
 * Contract game-id: xa_pong_streak (score mode, higher is better)
 *
 * File map (search for the banner comments):
 *   CONSTANTS        court size, physics and scoring numbers
 *   OPPONENTS        the machine ladder - one row per machine, named params
 *   ARENAS           neon court themes, one per ladder rung
 *   POWERS           court power-ups
 *   SONG             G dorian disco-funk soundtrack (data)
 *   DRAW HELPERS     cached glow sprites, icons, portraits, arena layers
 *   create(api)      the game: state, physics, machine AI, rules, render
 *   attract()        cabinet preview
 *
 * RULES
 *   - Beat a machine: be first to its `points` (3-5). Each point the machine
 *     wins costs you a life instead; lose all lives and the run is over.
 *   - Score: each return = 10 x (1 + rally/5) x level; point = 100 x level;
 *     beating a machine = 500 x level; shield break = 50 x level.
 *     level = ladder position (1..6, then 7.. on MK loops).
 *
 * SPIN MODEL
 *   Every ball carries `spin` (-3.6..3.6). Spin turns the velocity vector
 *   at CURVE_RATE x spin rad/s, so the path bends (you can see it in the
 *   trail). Positive spin turns clockwise on screen: an upward ball curves
 *   right. Spin decays over time, and a wall bounce mirrors it (the path is
 *   reflected, curve and all) while bleeding some off.
 *   Your paddle's sideways speed at impact sets the spin; the hit position
 *   on the paddle sets the launch angle (edges bite hardest - "EDGE"), and a
 *   fast-moving paddle hit is a "SMASH" (extra speed + screen shake).
 *
 * POWER-UP FAIRNESS
 *   Power-ups only ever help YOU. A token is collected only by a ball that
 *   you touched last, so it has to be earned with a return; machine returns
 *   pass straight through tokens. The machines never use power-ups - their
 *   edge is their style (spin, feints, speed, angles, shields).
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-pong-streak');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================
   * CONSTANTS
   * ================================================================ */
  var W = 420, H = 600;
  var PW = 84, PH = 12, BR = 7;        // base paddle width/height, ball radius
  var PY = H - 44, AY = 44;            // top edge of your paddle / the machine's
  var SHIELD_Y = 30;                   // boss shield line (behind the machine)
  var ACCENT = '#b98cff', YOU = '#3ff0ff';
  var TAU = Math.PI * 2;
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';

  // Ball physics
  var SERVE_SPEED = 300, SERVE_PER_LEVEL = 10, SERVE_MAX = 520;
  var HIT_SPEEDUP = 1.045;             // every return is a little faster
  var MAX_SPEED = 840;
  var MAX_ANGLE = 1.15;                // rad from vertical at the very paddle edge
  var MIN_VY = 0.36;                   // ball keeps this share of its speed vertical
  var CURVE_RATE = 0.32;               // rad/s of path turn per unit of spin
  var SPIN_DECAY = 0.35;               // spin fades by e^-0.35 per second
  var SPIN_FROM_MOTION = 1 / 330;      // your paddle px/s -> spin units
  var SPIN_MOTION_MAX = 2.2;           // cap for motion spin (curve shot goes higher)
  var SPIN_MAX = 3.6;
  var CURVE_SHOT_SPIN = 3.4;
  var WALL_SPIN = -0.7;                // wall mirrors the curve and bleeds 30%
  var EDGE_OFF = 0.78, EDGE_SPEEDUP = 1.06;
  var SMASH_VX = 470, SMASH_SPEEDUP = 1.1;
  var SLOW_SCALE = 0.6;                // SLOW BALL time scale for balls
  var SUBSTEP_PX = 4;                  // max ball travel per physics sub-step
  var TRAIL_LEN = 18;

  // Player
  var KEY_SPEED = 540;
  var LIVES_START = 3, LIVES_MAX = 5;
  var BIG_MUL = 1.5;
  var MAX_BALLS = 3;                   // multiball never goes past this

  // Pace
  var INTRO_FIRST = 1.4, INTRO_NEXT = 2.6, BEATEN_T = 2.2;
  var SERVE_DELAY = 1.1;
  var TOKEN_R = 13, TOKEN_LIFE = 9, POWER_FIRST = 5, POWER_GAP = [8, 13];

  var CT = [0, 2, 4, 6];               // chord tones; rally hits climb through them

  /* ================================================================
   * OPPONENTS - the ladder, in order.
   *   speed    max paddle speed (px/s)
   *   err      aim error range (px) at rally 0; shrinks 2px per rally hit
   *   errMin   the error never shrinks below this
   *   react    seconds it stands still after you return the ball
   *   feint    chance per return to drift to the MIRROR spot first
   *   lunge    speed multiplier once a feint is dropped (ball past half court)
   *   spin     spin it puts on its returns (random side)
   *   readsSpin 0..1 how much of your curve its prediction accounts for
   *   boost    extra speed multiplier on its returns
   *   aim      'centre' | 'away' (from you) | 'angles' (edge hits) | 'mixed'
   *   w        paddle width;  points  points you need to beat it
   *   face     procedural portrait recipe
   *   boss     final machine: phases wall -> split paddle -> shield
   * ================================================================ */
  var OPPONENTS = [
    { name: 'BLOCKO', title: 'THE STEADY WALL', tagline: 'Never fancy. Never tired.',
      speed: 235, err: 110, errMin: 30, react: 0, feint: 0, lunge: 1, spin: 0, readsSpin: 0,
      boost: 1, aim: 'centre', w: 92, points: 3,
      face: { head: 'square', eyes: 'visor', mouth: 'grille', antenna: 0 } },
    { name: 'WHIRLIGIG', title: 'THE SPINNER', tagline: 'Every return bends.',
      speed: 255, err: 100, errMin: 26, react: 0.04, feint: 0, lunge: 1, spin: 2.3, readsSpin: 0.5,
      boost: 1, aim: 'centre', w: 84, points: 3,
      face: { head: 'round', eyes: 'spiral', mouth: 'o', antenna: 1 } },
    { name: 'MIRAGE', title: 'THE TRICKSTER', tagline: 'It hesitates... then pounces.',
      speed: 290, err: 90, errMin: 24, react: 0.22, feint: 0.55, lunge: 1.75, spin: 0.6, readsSpin: 0.3,
      boost: 1, aim: 'away', w: 80, points: 3,
      face: { head: 'diamond', eyes: 'wink', mouth: 'grin', antenna: 2 } },
    { name: 'REDLINE', title: 'THE SPEED DEMON', tagline: 'Returns hot. Returns fast.',
      speed: 330, err: 95, errMin: 24, react: 0, feint: 0, lunge: 1, spin: 0.4, readsSpin: 0.2,
      boost: 1.07, aim: 'away', w: 78, points: 3,
      face: { head: 'wedge', eyes: 'slit', mouth: 'teeth', antenna: 0 } },
    { name: 'KALEIDO', title: 'THE ANGLE HUNTER', tagline: 'Banks it off every wall.',
      speed: 305, err: 70, errMin: 18, react: 0.02, feint: 0, lunge: 1, spin: 0.5, readsSpin: 0.6,
      boost: 1.02, aim: 'angles', w: 84, points: 4,
      face: { head: 'hex', eyes: 'prism', mouth: 'line', antenna: 3 } },
    { name: 'OMEGA GATE', title: 'THE FINAL MACHINE', tagline: 'Split paddle. Shielded core.',
      speed: 320, err: 70, errMin: 20, react: 0, feint: 0.15, lunge: 1.4, spin: 1.3, readsSpin: 0.8,
      boost: 1.03, aim: 'mixed', w: 116, points: 5, boss: true, shrink: 0.05,
      face: { head: 'crown', eyes: 'triple', mouth: 'grille', antenna: 4 } }
  ];
  // Boss phases by points you have taken off it.
  var BOSS_PHASES = [
    { from: 0, name: 'WALL', split: false, shield: false },
    { from: 2, name: 'SPLIT', split: true, shield: false },
    { from: 4, name: 'SHIELD', split: true, shield: true }
  ];

  /* ================================================================
   * ARENAS - one per ladder rung (same index as OPPONENTS).
   *   sky    background gradient top/bottom      line  court neon colour
   *   cpu    machine paddle colour               net   net style
   *   bg     animated background layer           key   music key shift (semitones)
   * ================================================================ */
  var ARENAS = [
    { name: 'NEON GRID', sky: ['#0d0424', '#1c0838'], line: '#ff3fa4', cpu: '#ff3fa4', net: 'dash', bg: 'grid', key: 0 },
    { name: 'SPIN CYCLE', sky: ['#021a16', '#052a24'], line: '#3dffb0', cpu: '#8dff5a', net: 'dots', bg: 'rings', key: 2 },
    { name: 'MIRROR HALL', sky: ['#13041f', '#240a3a'], line: '#c77dff', cpu: '#e05cff', net: 'zigzag', bg: 'mirrors', key: -2 },
    { name: 'CITY LIGHTS', sky: ['#14040a', '#2e0a10'], line: '#ff7a3d', cpu: '#ff4d3d', net: 'solid', bg: 'city', key: 3 },
    { name: 'PRISM VAULT', sky: ['#03121f', '#072a3c'], line: '#5ce1ff', cpu: '#ffd23f', net: 'double', bg: 'prism', key: 5 },
    { name: 'EVENT HORIZON', sky: ['#040108', '#1a0410'], line: '#ffb13d', cpu: '#ff2a4a', net: 'beam', bg: 'stars', key: 0, scale: 'phrygian' }
  ];

  /* ================================================================
   * POWERS - tokens float on the court; hit one with a ball YOU returned.
   * ================================================================ */
  var POWERS = {
    multi: { label: 'MULTIBALL', color: '#ffd23f', dur: 8 },    // 2 extra balls for `dur` s
    big: { label: 'BIG PADDLE', color: '#3dffb0', dur: 10 },     // your paddle x BIG_MUL
    slow: { label: 'SLOW BALL', color: '#6cb8ff', dur: 7 },      // balls run at SLOW_SCALE
    curve: { label: 'CURVE SHOT', color: '#ff5cf0', dur: 14, charges: 2 } // next 2 returns banana
  };
  var POWER_ORDER = ['multi', 'big', 'slow', 'curve'];

  /* ================================================================
   * SONG - G dorian disco-funk vamp: Gm7 - C7, two bars each.
   * Tempo follows ball speed (108-136), layers follow the rally, each of
   * your hits climbs the chord, extra `boss` bass is forced on for the
   * final machine, `arp` only joins the very longest rallies.
   * ================================================================ */
  var ARP_LINE = [0, 2, 4, 7, 9, 7, 4, 2];
  function song() {
    return {
      bpm: 112, key: 55, scale: 'dorian', chords: [0, 3], barsPerChord: 2, seed: 21,
      tracks: [
        { name: 'ohat', inst: 'hat', layer: 0, gain: 0.3, params: { open: true }, pattern: '..x...x...x...x.' },
        { name: 'bass', inst: 'bass', layer: 0.1, gain: 0.45, chord: true, octave: -2, params: { cutoff: 1100 },
          pattern: '0 . ^0 . . 0 . 4 0 . ^0 . 6 . 4 .' },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.56, pattern: 'x...x...x...x...' },
        { name: 'clap', inst: 'clap', layer: 0.4, gain: 0.42, pattern: '....x.......x...' },
        { name: 'hat', inst: 'hat', layer: 0.55, gain: 0.24, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'stab', inst: 'pluck', layer: 0.7, gain: 0.3, chord: true, params: { cutoff: 2600, decay: 0.12 },
          fn: function (i) { return i.stepInBar === 6 || i.stepInBar === 14 ? [0, 2, 4, 6] : null; } },
        { name: 'strings', inst: 'pad', layer: 0.85, gain: 0.24, chord: true, params: { cutoff: 2200, attack: 0.3 },
          fn: function (i) { return i.step % 32 === 0 ? [{ deg: 4, steps: 32 }, { deg: 6, steps: 32 }, { deg: 9, steps: 32 }] : null; } },
        { name: 'arp', inst: 'arp', layer: 0.95, gain: 0.22, chord: true, octave: 1, params: { cutoff: 3200 },
          fn: function (i) { return i.step % 2 === 0 ? ARP_LINE[(i.step >> 1) % ARP_LINE.length] : null; } },
        // layer 2: never on by intensity, only forced on for the boss
        { name: 'boss', inst: 'sub', layer: 2, gain: 0.42, chord: true, octave: -2,
          pattern: '0 . . 0 . . 0 . 0 . . 0 . . -1 .' }
      ]
    };
  }

  /* ================================================================
   * SMALL HELPERS
   * ================================================================ */
  function sign(v) { return v < 0 ? -1 : 1; }
  function speedOf(b) { return Math.sqrt(b.vx * b.vx + b.vy * b.vy); }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  // Deterministic 0..1 hash for visuals that must not flicker (windows, stars).
  function hash(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function newCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  /* ================================================================
   * BALL PHYSICS (pure - also used by the machine's prediction)
   * ================================================================ */
  // Keep a minimum vertical component so a curve can never park the ball
  // in a sideways loop.
  function keepVertical(b) {
    var sp = speedOf(b), min = sp * MIN_VY;
    if (Math.abs(b.vy) >= min) return;
    b.vy = sign(b.vy) * min;
    b.vx = sign(b.vx) * Math.sqrt(Math.max(0, sp * sp - min * min));
  }
  // Advance one sub-step: curve by spin, move, bounce off the side walls.
  // Returns true when the ball touched a wall.
  function advance(b, h, spinScale) {
    var turn = b.spin * spinScale * CURVE_RATE * h;
    if (turn) {
      var c = Math.cos(turn), s = Math.sin(turn), vx = b.vx;
      b.vx = vx * c - b.vy * s;
      b.vy = vx * s + b.vy * c;
      keepVertical(b);
    }
    b.spin *= 1 - SPIN_DECAY * h;
    b.x += b.vx * h; b.y += b.vy * h;
    if (b.x < BR) { b.x = BR; b.vx = Math.abs(b.vx); b.spin *= WALL_SPIN; return true; }
    if (b.x > W - BR) { b.x = W - BR; b.vx = -Math.abs(b.vx); b.spin *= WALL_SPIN; return true; }
    return false;
  }
  // Set a new velocity after a paddle hit. `off` is the hit position on the
  // paddle (-1 left edge .. 1 right edge); edges are shaped to bite harder.
  function launch(b, off, mult, up) {
    var shaped = off * 0.75 + off * off * off * 0.25;
    var ang = shaped * MAX_ANGLE;
    var sp = Math.min(MAX_SPEED, speedOf(b) * mult);
    b.vx = Math.sin(ang) * sp;
    b.vy = (up ? -1 : 1) * Math.cos(ang) * sp;
    b.squash = 1;
  }
  // Where will this (upward) ball cross targetY? Simulated with the same
  // physics; `readsSpin` scales how much curve the machine accounts for.
  function predictLanding(b, targetY, readsSpin) {
    var p = { x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: b.spin };
    if (p.vy >= 0) return W / 2;
    for (var i = 0; i < 600 && p.y > targetY; i++) advance(p, 1 / 120, readsSpin);
    return p.x;
  }

  /* ================================================================
   * DRAW HELPERS - cached glow sprites
   * ================================================================ */
  var glowCache = {};
  // Soft radial glow, drawn with 'lighter'. Cached per colour.
  function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    var r = 32, c = newCanvas(r * 2, r * 2), g = c.getContext('2d');
    var grd = g.createRadialGradient(r, r, 0, r, r, r);
    grd.addColorStop(0, rgba(color, 0.9));
    grd.addColorStop(0.22, rgba(color, 0.45));
    grd.addColorStop(0.55, rgba(color, 0.12));
    grd.addColorStop(1, rgba(color, 0));
    g.fillStyle = grd; g.fillRect(0, 0, r * 2, r * 2);
    glowCache[color] = c;
    return c;
  }
  function drawGlow(ctx, color, x, y, r, a) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a == null ? 1 : a;
    ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }
  // Blurred bar halo for paddles (shadowBlur once, then stretched).
  var barCache = {};
  function barGlow(color) {
    if (barCache[color]) return barCache[color];
    var c = newCanvas(160, 56), g = c.getContext('2d');
    g.shadowColor = color; g.shadowBlur = 16; g.fillStyle = rgba(color, 0.85);
    U.roundRect(g, 24, 22, 112, 12, 6); g.fill(); g.fill();
    barCache[color] = c;
    return c;
  }
  function drawPaddle(ctx, x, y, w, col, flash, squash, lean) {
    var sw = w * (1 + 0.1 * squash), sh = PH * (1 - 0.35 * squash);
    var yy = y + (PH - sh) / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.75 + 0.25 * flash;
    ctx.drawImage(barGlow(col), x - sw / 2 - 24 * sw / 112, yy - 22 + sh / 2 - 6, 160 * sw / 112, 56);
    ctx.restore();
    ctx.save();
    ctx.translate(x, yy + sh / 2);
    ctx.transform(1, 0, lean || 0, 1, 0, 0);
    ctx.fillStyle = col;
    U.roundRect(ctx, -sw / 2, -sh / 2, sw, sh, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.6 * flash) + ')';
    U.roundRect(ctx, -sw / 2 + 4, -sh / 2 + 2, sw - 8, Math.max(2, sh * 0.3), 2); ctx.fill();
    ctx.restore();
  }

  /* ---------------------------------------------------------- icons */
  function drawIcon(ctx, kind, x, y, s, col) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = Math.max(1.5, s * 0.16);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'multi') {
      [[0, -0.42], [-0.42, 0.3], [0.42, 0.3]].forEach(function (p) {
        ctx.beginPath(); ctx.arc(p[0] * s, p[1] * s, s * 0.24, 0, TAU); ctx.fill();
      });
    } else if (kind === 'big') {
      ctx.fillRect(-s * 0.5, -s * 0.14, s, s * 0.28);
      ctx.beginPath();
      ctx.moveTo(-s * 0.78, 0); ctx.lineTo(-s * 0.56, -s * 0.28); ctx.lineTo(-s * 0.56, s * 0.28); ctx.closePath();
      ctx.moveTo(s * 0.78, 0); ctx.lineTo(s * 0.56, -s * 0.28); ctx.lineTo(s * 0.56, s * 0.28); ctx.closePath();
      ctx.fill();
    } else if (kind === 'slow') {
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, -s * 0.55); ctx.lineTo(s * 0.4, -s * 0.55); ctx.lineTo(-s * 0.4, s * 0.55);
      ctx.lineTo(s * 0.4, s * 0.55); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.45); ctx.lineTo(s * 0.18, s * 0.45); ctx.lineTo(0, s * 0.2); ctx.closePath(); ctx.fill();
    } else if (kind === 'curve') {
      ctx.beginPath(); ctx.moveTo(-s * 0.45, s * 0.55); ctx.quadraticCurveTo(-s * 0.5, -s * 0.5, s * 0.4, -s * 0.4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.55, -s * 0.38); ctx.lineTo(s * 0.18, -s * 0.66); ctx.lineTo(s * 0.22, -s * 0.12); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /* ------------------------------------------------------ portraits */
  // Procedural machine face from a recipe {head, eyes, mouth, antenna}.
  function headPath(ctx, kind, s) {
    ctx.beginPath();
    if (kind === 'square') { U.roundRect(ctx, -s, -s * 0.9, s * 2, s * 1.8, s * 0.2); return; }
    if (kind === 'round') { ctx.arc(0, 0, s, 0, TAU); return; }
    if (kind === 'diamond') { ctx.moveTo(0, -s * 1.1); ctx.lineTo(s * 1.05, 0); ctx.lineTo(0, s * 1.1); ctx.lineTo(-s * 1.05, 0); ctx.closePath(); return; }
    if (kind === 'wedge') { ctx.moveTo(-s * 1.1, -s * 0.7); ctx.lineTo(s * 1.1, -s * 0.7); ctx.lineTo(s * 0.6, s * 0.9); ctx.lineTo(-s * 0.6, s * 0.9); ctx.closePath(); return; }
    if (kind === 'hex') { for (var k = 0; k < 6; k++) { var a = k / 6 * TAU + Math.PI / 6; ctx[k ? 'lineTo' : 'moveTo'](Math.cos(a) * s * 1.05, Math.sin(a) * s * 1.05); } ctx.closePath(); return; }
    // crown
    ctx.moveTo(-s * 1.1, s * 0.9); ctx.lineTo(-s * 1.1, -s * 0.5); ctx.lineTo(-s * 0.6, -s * 0.1);
    ctx.lineTo(-s * 0.3, -s * 1.1); ctx.lineTo(0, -s * 0.3); ctx.lineTo(s * 0.3, -s * 1.1);
    ctx.lineTo(s * 0.6, -s * 0.1); ctx.lineTo(s * 1.1, -s * 0.5); ctx.lineTo(s * 1.1, s * 0.9); ctx.closePath();
  }
  function drawPortrait(ctx, opp, col, cx, cy, s, t) {
    var f = opp.face, blink = (t % 3.1) < 0.12;
    ctx.save();
    ctx.translate(cx, cy + Math.sin(t * 2) * 2);
    drawGlow(ctx, col, 0, 0, s * 2.4, 0.5);
    // antennas
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    for (var a = 0; a < f.antenna; a++) {
      var ax = (a - (f.antenna - 1) / 2) * s * 0.5;
      ctx.beginPath(); ctx.moveTo(ax, -s * 0.8); ctx.lineTo(ax * 1.3, -s * 1.45); ctx.stroke();
      ctx.fillStyle = a % 2 ? '#fff' : col;
      ctx.beginPath(); ctx.arc(ax * 1.3, -s * 1.5, 3 + Math.sin(t * 6 + a) * 1, 0, TAU); ctx.fill();
    }
    headPath(ctx, f.head, s);
    ctx.fillStyle = 'rgba(8,4,20,0.92)'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke();
    // eyes
    ctx.fillStyle = '#fff'; ctx.strokeStyle = col; ctx.lineWidth = 2;
    var low = f.head === 'crown' ? s * 0.35 : 0;
    var ey = -s * 0.18 + low, ex = s * 0.42, eh = blink ? 1.5 : s * 0.16;
    if (f.eyes === 'visor') {
      ctx.fillStyle = col; ctx.fillRect(-s * 0.7, ey - eh / 2, s * 1.4, eh);
      ctx.fillStyle = '#fff'; ctx.fillRect(-s * 0.7 + ((t * 60) % (s * 1.2)), ey - eh / 2, s * 0.2, eh);
    } else if (f.eyes === 'spiral') {
      for (var e = -1; e <= 1; e += 2) {
        ctx.beginPath();
        for (var q = 0; q < 26; q++) { var r = q / 26 * s * 0.24, an = q * 0.6 + t * 6 * e; ctx[q ? 'lineTo' : 'moveTo'](e * ex + Math.cos(an) * r, ey + Math.sin(an) * r); }
        ctx.stroke();
      }
    } else if (f.eyes === 'wink') {
      ctx.beginPath(); ctx.arc(-ex, ey, s * 0.14, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ex - s * 0.16, ey); ctx.lineTo(ex + s * 0.16, ey - (blink ? 0 : s * 0.08)); ctx.stroke();
    } else if (f.eyes === 'slit') {
      for (var e2 = -1; e2 <= 1; e2 += 2) {
        ctx.beginPath(); ctx.moveTo(e2 * ex - s * 0.24, ey - e2 * 0); ctx.lineTo(e2 * ex + s * 0.24, ey - s * 0.12 * -e2); ctx.lineTo(e2 * ex, ey + eh * 0.5); ctx.closePath(); ctx.fill();
      }
    } else if (f.eyes === 'prism') {
      for (var e3 = -1; e3 <= 1; e3 += 2) {
        ctx.beginPath(); ctx.moveTo(e3 * ex, ey - s * 0.18); ctx.lineTo(e3 * ex + s * 0.17, ey + s * 0.12); ctx.lineTo(e3 * ex - s * 0.17, ey + s * 0.12); ctx.closePath();
        ctx.fillStyle = 'hsl(' + ((t * 120 + e3 * 90) % 360) + ',100%,70%)'; ctx.fill();
      }
    } else { // triple
      for (var e4 = -1; e4 <= 1; e4++) {
        ctx.fillStyle = e4 === 0 ? '#fff' : col;
        ctx.beginPath(); ctx.arc(e4 * s * 0.5, ey - (e4 === 0 ? s * 0.12 : 0), blink ? 1.5 : s * 0.13, 0, TAU); ctx.fill();
      }
    }
    // mouth
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
    var my = s * 0.42 + low * 0.5;
    if (f.mouth === 'grille') { for (var g = -2; g <= 2; g++) ctx.fillRect(g * s * 0.18 - 1.5, my - s * 0.1, 3, s * 0.2); }
    else if (f.mouth === 'o') { ctx.beginPath(); ctx.arc(0, my, s * 0.12 + Math.sin(t * 5) * 1.5, 0, TAU); ctx.stroke(); }
    else if (f.mouth === 'grin') { ctx.beginPath(); ctx.arc(0, my - s * 0.2, s * 0.35, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
    else if (f.mouth === 'teeth') { ctx.beginPath(); for (var k2 = 0; k2 <= 6; k2++) ctx[k2 ? 'lineTo' : 'moveTo']((k2 / 6 - 0.5) * s * 0.9, my + (k2 % 2 ? s * 0.1 : -s * 0.05)); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-s * 0.35, my); ctx.lineTo(s * 0.35, my); ctx.stroke(); }
    ctx.restore();
  }

  /* ------------------------------------------------ arena: static layer */
  // Built once per arena at 2x and blitted every frame.
  var arenaCache = {};
  function arenaStatic(idx) {
    if (arenaCache[idx]) return arenaCache[idx];
    var A = ARENAS[idx], S2 = 2, c = newCanvas(W * S2, H * S2), g = c.getContext('2d');
    g.scale(S2, S2);
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, A.sky[1]); grd.addColorStop(0.5, A.sky[0]); grd.addColorStop(1, A.sky[1]);
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    var k;
    if (A.bg === 'grid') {
      // vertical lines converging on the net line (the "horizon")
      g.strokeStyle = rgba(A.line, 0.16); g.lineWidth = 1;
      for (k = -10; k <= 10; k++) {
        g.beginPath(); g.moveTo(W / 2 + k * 6, H / 2 - 4); g.lineTo(W / 2 + k * 60, 0);
        g.moveTo(W / 2 + k * 6, H / 2 + 4); g.lineTo(W / 2 + k * 60, H); g.stroke();
      }
    } else if (A.bg === 'rings') {
      g.strokeStyle = rgba(A.line, 0.08); g.lineWidth = 1;
      for (k = 1; k < 9; k++) { g.beginPath(); g.arc(W / 2, H / 2, k * 36, 0, TAU); g.stroke(); }
    } else if (A.bg === 'mirrors') {
      for (k = 0; k < 7; k++) {
        var mx = k * W / 7;
        var mg = g.createLinearGradient(mx, 0, mx + W / 7, 0);
        mg.addColorStop(0, 'rgba(255,255,255,0)'); mg.addColorStop(0.5, rgba(A.line, 0.06)); mg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = mg; g.fillRect(mx, 0, W / 7, H);
      }
    } else if (A.bg === 'city') {
      // skylines along both ends of the court, windows lit by hash
      [0, 1].forEach(function (side) {
        for (var bx = 0; bx < W; ) {
          var bw = 22 + hash(bx + side * 99) * 34, bh = 40 + hash(bx * 3 + side) * 70;
          var y0 = side ? H - bh : 0;
          g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(bx, y0, bw - 2, bh);
          g.fillStyle = rgba(A.line, 0.18); g.fillRect(bx, side ? y0 : y0 + bh - 1, bw - 2, 1);
          for (var wy = 6; wy < bh - 6; wy += 8) for (var wx = 4; wx < bw - 8; wx += 7) {
            if (hash(bx * 7 + wx * 13 + wy * 17 + side) > 0.62) {
              g.fillStyle = hash(wx + wy + bx) > 0.5 ? 'rgba(255,200,120,0.28)' : rgba(A.line, 0.25);
              g.fillRect(bx + wx, y0 + wy, 3, 3);
            }
          }
          bx += bw;
        }
      });
    } else if (A.bg === 'prism') {
      for (k = 0; k < 14; k++) {
        g.beginPath();
        var px = hash(k) * W, py = hash(k + 40) * H, pr = 40 + hash(k + 80) * 60;
        g.moveTo(px, py - pr); g.lineTo(px + pr * 0.87, py + pr / 2); g.lineTo(px - pr * 0.87, py + pr / 2); g.closePath();
        g.fillStyle = 'hsla(' + Math.floor(hash(k + 5) * 360) + ',90%,60%,0.035)'; g.fill();
      }
    } else if (A.bg === 'stars') {
      var ng = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 300);
      ng.addColorStop(0, 'rgba(255,60,90,0.16)'); ng.addColorStop(0.4, 'rgba(120,20,80,0.08)'); ng.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = ng; g.fillRect(0, 0, W, H);
      for (k = 0; k < 120; k++) { g.fillStyle = 'rgba(255,255,255,' + (0.15 + hash(k + 7) * 0.4) + ')'; g.fillRect(hash(k) * W, hash(k + 300) * H, 1, 1); }
    }
    // court border + goal zones
    g.strokeStyle = rgba(A.line, 0.35); g.lineWidth = 2; g.strokeRect(2, 2, W - 4, H - 4);
    var gz = g.createLinearGradient(0, 0, 0, 30);
    gz.addColorStop(0, rgba(A.cpu, 0.22)); gz.addColorStop(1, rgba(A.cpu, 0));
    g.fillStyle = gz; g.fillRect(0, 0, W, 30);
    var gy = g.createLinearGradient(0, H, 0, H - 30);
    gy.addColorStop(0, rgba(YOU, 0.2)); gy.addColorStop(1, rgba(YOU, 0));
    g.fillStyle = gy; g.fillRect(0, H - 30, W, 30);
    arenaCache[idx] = c;
    return c;
  }

  /* ---------------------------------------------- arena: animated layer */
  var STARS = [];
  for (var si = 0; si < 70; si++) STARS.push({ a: Math.random() * TAU, d: Math.random(), s: 0.3 + Math.random() * 0.7 });
  function drawArenaFx(ctx, A, t, pulse, spin, cpuX) {
    var k;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (A.bg === 'grid') {
      // horizontal lines rushing out from the net, both ways
      ctx.strokeStyle = rgba(A.line, 0.13 + pulse * 0.12); ctx.lineWidth = 1;
      for (k = 0; k < 9; k++) {
        var f = ((k + t * 0.8) % 9) / 9, dy = f * f * (H / 2);
        ctx.beginPath(); ctx.moveTo(0, H / 2 - dy); ctx.lineTo(W, H / 2 - dy); ctx.moveTo(0, H / 2 + dy); ctx.lineTo(W, H / 2 + dy); ctx.stroke();
      }
    } else if (A.bg === 'rings') {
      // dashed rings spin with the ball
      ctx.lineWidth = 2;
      for (k = 1; k < 6; k++) {
        var rot = t * (0.2 + spin * 0.6) * (k % 2 ? 1 : -1);
        ctx.strokeStyle = rgba(A.line, 0.07 + pulse * 0.06);
        for (var d = 0; d < 6; d++) {
          ctx.beginPath(); ctx.arc(W / 2, H / 2, k * 52, rot + d * TAU / 6, rot + d * TAU / 6 + 0.5); ctx.stroke();
        }
      }
    } else if (A.bg === 'mirrors') {
      for (k = 0; k < 7; k++) {
        ctx.fillStyle = rgba(A.line, 0.03 + 0.03 * Math.sin(t * 2 + k * 1.3) + pulse * 0.02);
        ctx.fillRect(k * W / 7 + 2, 0, W / 7 - 4, H);
      }
      // the trickster's mirror-ghost paddle
      ctx.fillStyle = rgba(A.cpu, 0.14);
      U.roundRect(ctx, W - cpuX - 40, AY, 80, PH, 6); ctx.fill();
    } else if (A.bg === 'city') {
      // speed streaks
      for (k = 0; k < 10; k++) {
        var sy = 120 + hash(k) * (H - 240), sx = ((t * (300 + hash(k + 9) * 400) + hash(k + 3) * W) % (W + 200)) - 100;
        ctx.fillStyle = rgba(A.line, 0.12); ctx.fillRect(sx, sy, 60 + hash(k + 1) * 60, 1);
      }
      // blinking windows
      for (k = 0; k < 6; k++) {
        var bx = hash(Math.floor(t * 2) * 7 + k) * W, by = hash(Math.floor(t * 2) * 13 + k) > 0.5 ? 10 + hash(k + t | 0) * 50 : H - 60 + hash(k) * 40;
        ctx.fillStyle = 'rgba(255,220,140,' + (0.3 + pulse * 0.4) + ')'; ctx.fillRect(bx, by, 3, 3);
      }
    } else if (A.bg === 'prism') {
      // sweeping laser beams from the corners
      ctx.lineWidth = 2;
      for (k = 0; k < 4; k++) {
        var cx = k % 2 ? W : 0, cy = k < 2 ? 0 : H, an = Math.atan2(H / 2 - cy, W / 2 - cx) + Math.sin(t * 0.7 + k) * 0.5;
        ctx.strokeStyle = 'hsla(' + ((t * 40 + k * 90) % 360) + ',100%,65%,' + (0.08 + pulse * 0.08) + ')';
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * 800, cy + Math.sin(an) * 800); ctx.stroke();
      }
    } else if (A.bg === 'stars') {
      // warp starfield
      ctx.strokeStyle = 'rgb(255,190,170)';
      ctx.lineCap = 'round';
      for (k = 0; k < STARS.length; k++) {
        var s = STARS[k], dd = (s.d + t * 0.12 * s.s) % 1, r0 = 20 + dd * dd * 400, r1 = r0 + 0.5 + dd * 3.5 * (1 + pulse);
        ctx.globalAlpha = dd * 0.55;
        ctx.lineWidth = 0.8 + dd * 1.4;
        ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(s.a) * r0, H / 2 + Math.sin(s.a) * r0);
        ctx.lineTo(W / 2 + Math.cos(s.a) * r1, H / 2 + Math.sin(s.a) * r1); ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ----------------------------------------------------- arena: net */
  function drawNet(ctx, A, t, pulse) {
    var y = H / 2, x;
    ctx.save();
    ctx.fillStyle = rgba(A.line, 0.35 + pulse * 0.2);
    ctx.strokeStyle = rgba(A.line, 0.45 + pulse * 0.25);
    ctx.lineWidth = 2;
    if (A.net === 'dash') { for (x = 6; x < W; x += 24) ctx.fillRect(x, y - 1, 12, 2); }
    else if (A.net === 'dots') { for (x = 10; x < W; x += 16) { ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill(); } }
    else if (A.net === 'zigzag') {
      ctx.beginPath(); for (x = 0; x <= W; x += 12) ctx.lineTo(x, y + ((x / 12) % 2 ? 4 : -4)); ctx.stroke();
    } else if (A.net === 'solid') { ctx.fillRect(0, y - 1, W, 2); drawGlowLine(ctx, A.line, y, 0.25 + pulse * 0.3); }
    else if (A.net === 'double') { ctx.fillRect(0, y - 5, W, 1.5); ctx.fillRect(0, y + 4, W, 1.5); }
    else if (A.net === 'beam') {
      ctx.beginPath();
      for (x = 0; x <= W; x += 6) ctx.lineTo(x, y + Math.sin(x * 0.05 + t * 8) * (2 + pulse * 4));
      ctx.stroke();
      drawGlowLine(ctx, A.line, y, 0.3 + pulse * 0.4);
    }
    ctx.restore();
  }
  function drawGlowLine(ctx, col, y, a) {
    var g = ctx.createLinearGradient(0, y - 10, 0, y + 10);
    g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, y - 10, W, 20);
  }

  /* ------------------------------------------ crowd / equaliser bars */
  function drawCrowd(ctx, col, t, pulse, energy) {
    var n = 26, gap = H / n;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) {
      var wob = 0.5 + 0.5 * Math.sin(t * (3 + hash(i) * 4) + i);
      var len = 3 + (pulse * 0.7 + wob * 0.3) * (6 + energy * 22);
      ctx.fillStyle = rgba(col, 0.1 + 0.25 * pulse);
      ctx.fillRect(2, i * gap + 3, len, gap - 6);
      ctx.fillRect(W - 2 - len, i * gap + 3, len, gap - 6);
    }
    ctx.restore();
  }

  /* ================================================================
   * THE GAME
   * ================================================================ */
  function create(api) {
    var rng = api.rng;

    /* ------------------------------------------------------ state */
    var you = { x: W / 2, w: PW, vx: 0, prevX: W / 2, flash: 0, squash: 0 };
    var cpu = { x: W / 2, vx: 0, flash: 0, squash: 0 };
    var ai = { plan: null };                 // machine's plan for the current incoming ball
    var ladder = { rung: 0, loop: 0, level: 1, beaten: 0 };
    var cur = null, arenaIdx = 0;            // scaled opponent + arena for this rung
    var match = { you: 0, cpu: 0 };          // points this match
    var phase = 'intro', phaseT = 0, introDur = INTRO_FIRST, serveT = 0;
    var balls = [];
    var lives = LIVES_START, rally = 0, best = 0;
    var tokens = [], powT = POWER_FIRST;
    var timers = { multi: 0, big: 0, slow: 0, curve: 0 }, curveCharges = 0;
    var shield = [], bossStage = -1;
    var over = false, overT = 0, t = 0, flash = 0, banner = null;
    var lastMoved = api.pointer().moved;
    // music bookkeeping (only send changes)
    var hitN = 0, lastI = -1, lastBpm = 112, musicKey = 0, musicScale = 'dorian', musicBoss = false;

    if (M()) M().play(song(), { fade: 1, intensity: 0 });
    startOpponent(true);

    /* ------------------------------------------------------ music */
    // groove builds with the rally; tempo follows ball speed (event-driven)
    function syncMusic() {
      var m = M();
      if (!m) return;
      var v = U.clamp(rally / 24 + (ladder.level - 1) * 0.04 + (balls.length > 1 ? 0.2 : 0), 0, 1);
      v = Math.round(v * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
      var sp = balls[0] ? speedOf(balls[0]) * (timers.slow > 0 ? SLOW_SCALE : 1) : 300;
      var bpm = Math.round(108 + U.clamp((sp - 300) / 480, 0, 1) * 28);
      if (Math.abs(bpm - lastBpm) >= 1) { lastBpm = bpm; m.setTempo(bpm, 0.8); }
    }
    function hitNote(inst, gain) {
      var m = M();
      if (!m) return false;
      var k = hitN++ % 12;
      m.note(inst, CT[k % 4] + 7 * Math.floor(k / 4), { chord: true, quantize: '8', gain: gain });
      return true;
    }
    // New opponent: key shift / scale / boss bass, each only when it changes.
    function musicForOpponent() {
      var m = M(), A = ARENAS[arenaIdx];
      if (!m) return;
      if (A.key !== musicKey) { musicKey = A.key; m.setKey(55 + A.key); }
      var sc = A.scale || 'dorian';
      if (sc !== musicScale) { musicScale = sc; m.setScale(sc); }
      var bossOn = !!cur.boss;
      if (bossOn !== musicBoss) { musicBoss = bossOn; m.setTrack('boss', bossOn ? true : null); }
      m.note('riser', 0, { quantize: 'beat', dur: 1.1, gain: 0.35 });
    }
    function stinger(seq, inst, q, oct, gain) {
      if (M()) M().stinger(seq, { inst: inst, quantize: q, octave: oct, gain: gain });
    }

    /* ---------------------------------------------------- ladder */
    // Opponent row scaled for the current MK loop.
    function scaledOpponent(rung, loop) {
      var base = OPPONENTS[rung], o = {};
      for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) o[k] = base[k];
      o.speed = base.speed * (1 + 0.1 * loop);
      o.err = base.err * Math.max(0.5, 1 - 0.15 * loop);
      o.errMin = base.errMin * Math.max(0.5, 1 - 0.15 * loop);
      o.readsSpin = Math.min(1, base.readsSpin + 0.1 * loop);
      o.shieldHp = 1 + loop;
      o.shrink = base.shrink || 0;
      o.fullName = base.name + (loop ? ' MK' + (loop + 1) : '');
      return o;
    }
    function startOpponent(first) {
      cur = scaledOpponent(ladder.rung, ladder.loop);
      arenaIdx = ladder.rung % ARENAS.length;
      ladder.level = ladder.rung + 1 + ladder.loop * OPPONENTS.length;
      match.you = 0; match.cpu = 0; rally = 0;
      balls = []; tokens = []; shield = []; bossStage = -1;
      endAllPowers();
      powT = POWER_FIRST;
      phase = 'intro'; phaseT = 0; introDur = first ? INTRO_FIRST : INTRO_NEXT;
      ai.plan = null;
      updateBossStage();
      musicForOpponent();
    }
    function nextOpponent() {
      ladder.rung++;
      if (ladder.rung >= OPPONENTS.length) { ladder.rung = 0; ladder.loop++; }
      startOpponent(false);
    }
    function opponentBeaten() {
      ladder.beaten++;
      var bonus = 500 * ladder.level;
      api.addScore(bonus);
      if (lives < LIVES_MAX) lives++;
      api.fx.text(W / 2, H / 2 - 10, cur.fullName + ' DOWN!', ARENAS[arenaIdx].cpu, 15);
      api.fx.text(W / 2, H / 2 + 20, '+' + U.fmt(bonus) + '  +1 LIFE', YOU, 11);
      api.fx.burst(cpu.x, AY, ARENAS[arenaIdx].cpu, 60, 260, 1.1);
      api.shake(10);
      stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 7, at: 3 }, { deg: 9, at: 4 }, { deg: 11, at: 5, steps: 6 }], 'lead', 'beat', 1, 0.5);
      balls = []; tokens = []; shield = [];
      endAllPowers();
      phase = 'beaten'; phaseT = 0;
    }
    // Boss phase from points taken (wall -> split -> shield).
    function updateBossStage() {
      if (!cur.boss) return;
      var st = 0;
      for (var i = 0; i < BOSS_PHASES.length; i++) if (match.you >= BOSS_PHASES[i].from) st = i;
      if (st === bossStage) return;
      var first = bossStage < 0;
      bossStage = st;
      var P = BOSS_PHASES[st];
      if (P.shield) {
        shield = [];
        for (var s = 0; s < 3; s++) shield.push({ x0: s * W / 3 + 6, x1: (s + 1) * W / 3 - 6, hp: cur.shieldHp, hit: 0 });
      }
      if (!first) {
        banner = { text: 'PHASE ' + (st + 1) + ': ' + P.name, t: 1.6, col: ARENAS[arenaIdx].cpu };
        api.shake(6);
        stinger([{ deg: 0 }, { deg: -1, at: 2 }, { deg: -3, at: 4, steps: 6 }], 'bell', 'beat', 0, 0.5);
      }
    }
    function bossPhase() { return cur.boss && bossStage >= 0 ? BOSS_PHASES[bossStage] : null; }

    /* ------------------------------------------- machine paddle */
    function splitGap() { return 38 + 26 * (1 + Math.sin(t * 1.5)); }
    // The machine's paddle as one or more parts [{x, w}] (boss splits).
    function machineParts() {
      var w = cur.w * (1 - cur.shrink * match.you);
      var P = bossPhase();
      if (P && P.split) {
        var pw = w * 0.42, off = splitGap() / 2 + pw / 2;
        return [{ x: cpu.x - off, w: pw }, { x: cpu.x + off, w: pw }];
      }
      return [{ x: cpu.x, w: w }];
    }

    /* --------------------------------------------- machine AI */
    // The ball the machine must deal with: the highest one heading up.
    function incomingBall() {
      var best = null;
      for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (b.vy < 0 && b.y > AY - 4 && (!best || b.y < best.y)) best = b;
      }
      return best;
    }
    function chooseAim(style) {
      if (style === 'mixed') style = ['centre', 'away', 'angles'][Math.floor(rng() * 3)];
      if (style === 'away') return (you.x < W / 2 ? 1 : -1) * (0.35 + rng() * 0.25);
      if (style === 'angles') return (rng() < 0.5 ? -1 : 1) * (0.68 + rng() * 0.2);
      return (rng() - 0.5) * 0.3;
    }
    // Decided once per incoming ball: error, delay, feint, aim.
    function makePlan(b) {
      var range = Math.max(cur.errMin, cur.err - rally * 2);
      var land = predictLanding(b, AY + PH, cur.readsSpin);
      var P = bossPhase(), side = 0;
      if (P && P.split) {
        var off = splitGap() / 2 + cur.w * 0.21;
        side = Math.abs(land - off - cpu.x) < Math.abs(land + off - cpu.x) ? 1 : -1;
      }
      return { ball: b, err: (rng() - 0.5) * range, react: cur.react, feint: rng() < cur.feint, aim: chooseAim(cur.aim), side: side };
    }
    function machineThink(dt) {
      var b = incomingBall(), target, speed = cur.speed;
      if (!b) {
        ai.plan = null;
        var nb = balls[0];
        target = nb ? W / 2 + (nb.x - W / 2) * 0.3 : W / 2;
        speed *= 0.6;
      } else {
        if (!ai.plan || ai.plan.ball !== b) ai.plan = makePlan(b);
        var P = ai.plan, parts = machineParts();
        if (P.react > 0) {
          P.react -= dt;
          target = cpu.x;
        } else {
          var land = predictLanding(b, AY + PH, cur.readsSpin);
          var partW = parts[0].w, partOff = parts.length > 1 ? parts[1].x - cpu.x : 0;
          target = land - P.aim * partW / 2 + P.err - P.side * partOff;
          if (P.feint && b.y > H * 0.5) target = W - target;       // wrong way first...
          else if (P.feint) speed *= cur.lunge;                   // ...then pounce
        }
      }
      var mv = U.clamp(target - cpu.x, -speed * dt, speed * dt);
      cpu.x += mv;
      cpu.vx = mv / dt;
      // keep the paddle on court; a split paddle may hang off the edge as
      // long as its other half is fully on court
      var ps = machineParts(), halfSpan = ps.length > 1 ? -(ps[1].x - cpu.x - ps[1].w / 2) : ps[0].w / 2;
      cpu.x = U.clamp(cpu.x, halfSpan, W - halfSpan);
    }

    /* ---------------------------------------------------- balls */
    function newBall(x, y, vx, vy, extra) {
      return { x: x, y: y, vx: vx, vy: vy, spin: 0, last: null, extra: !!extra, squash: 0, trail: [] };
    }
    function serve() {
      var a = Math.PI / 2 + (rng() - 0.5) * 0.9;
      var sp = Math.min(SERVE_MAX, SERVE_SPEED + (ladder.level - 1) * SERVE_PER_LEVEL);
      balls = [newBall(W / 2, H / 2, Math.cos(a) * sp, Math.sin(a) * sp, false)];
      rally = 0; hitN = 0;
      phase = 'rally';
      ai.plan = null;
      syncMusic();
    }
    // Floating text kept clear of the side walls so it never clips.
    function popText(x, y, str, col, size) {
      var half = Math.min(W / 2 - 4, str.length * size * 0.55 + 6);
      api.fx.text(U.clamp(x, half, W - half), y, str, col, size);
    }
    function wallTick() {
      if (M()) M().note('hat', 0, { gain: 0.3, vel: 0.6 });
      else api.audio.tone(300, 0.03, { type: 'square', vol: 0.06 });
    }

    // Your return: angle from hit position, spin from paddle motion.
    function playerReturn(b) {
      var off = U.clamp((b.x - you.x) / (you.w / 2), -1, 1);
      var mult = HIT_SPEEDUP, tag = '';
      if (Math.abs(off) > EDGE_OFF) { mult *= EDGE_SPEEDUP; tag = 'EDGE'; }
      var smash = Math.abs(you.vx) > SMASH_VX;
      if (smash) { mult *= SMASH_SPEEDUP; tag = 'SMASH'; }
      var spin = U.clamp(you.vx * SPIN_FROM_MOTION, -SPIN_MOTION_MAX, SPIN_MOTION_MAX) + b.spin * 0.2;
      if (curveCharges > 0) {
        // banana: launch one way, bend hard the other (towards the open side)
        curveCharges--;
        var dir = Math.abs(you.vx) > 60 ? sign(you.vx) : (cpu.x < W / 2 ? 1 : -1);
        spin = dir * CURVE_SHOT_SPIN;
        off = -dir * 0.45;
        tag = 'CURVE!';
        if (curveCharges <= 0) timers.curve = 0;
        if (M()) M().note('lead', 9, { quantize: '16', octave: 1, gain: 0.35 });
      }
      launch(b, off, mult, true);
      b.spin = U.clamp(spin, -SPIN_MAX, SPIN_MAX);
      b.last = 'you';
      you.flash = 1; you.squash = 1;
      rally++;
      best = Math.max(best, rally);
      var pts = 10 * (1 + Math.floor(rally / 5)) * ladder.level;
      api.addScore(pts);
      popText(b.x, PY - 18, '+' + pts, YOU, 9);
      if (tag) popText(b.x, PY - 36, tag, tag === 'SMASH' ? '#ffffff' : POWERS.curve.color, 10);
      if (rally % 5 === 0) api.fx.text(W / 2, H / 2, 'RALLY ' + rally, YOU, 14);
      api.fx.burst(b.x, PY, YOU, smash ? 18 : 8, smash ? 200 : 100, 0.3);
      if (smash) api.shake(5);
      if (!hitNote('pluck', 0.7)) api.audio.tone(440 + Math.min(rally, 20) * 20, 0.05, { type: 'square', vol: 0.14 });
      syncMusic();
      if (rally % 10 === 0) stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7, at: 4, steps: 4 }], 'pluck', 'beat', 1, 0.55);
    }
    // Machine return: its style decides spin and speed boost.
    function machineReturn(b, part) {
      var off = U.clamp((b.x - part.x) / (part.w / 2), -1, 1);
      launch(b, off, HIT_SPEEDUP * cur.boost, false);
      b.spin = cur.spin ? (rng() < 0.5 ? -1 : 1) * cur.spin * (0.6 + rng() * 0.4) : 0;
      b.last = 'cpu';
      cpu.flash = 1; cpu.squash = 1;
      ai.plan = null;
      api.fx.burst(b.x, AY + PH, ARENAS[arenaIdx].cpu, 8, 100, 0.3);
      if (cur.boost > 1.05) api.fx.burst(b.x, AY + PH, '#ffffff', 6, 180, 0.25);
      if (!hitNote('marimba', 0.6)) api.audio.tone(330, 0.05, { type: 'square', vol: 0.12 });
      syncMusic();
    }

    function collidePlayer(b) {
      if (b.vy <= 0 || b.y + BR < PY || b.y + BR > PY + PH + 12) return false;
      if (Math.abs(b.x - you.x) > you.w / 2 + BR) return false;
      b.y = PY - BR;
      playerReturn(b);
      return true;
    }
    function collideMachine(b) {
      if (b.vy >= 0 || b.y - BR > AY + PH || b.y - BR < AY - 12) return false;
      var parts = machineParts();
      for (var i = 0; i < parts.length; i++) {
        if (Math.abs(b.x - parts[i].x) <= parts[i].w / 2 + BR) {
          b.y = AY + PH + BR;
          machineReturn(b, parts[i]);
          return true;
        }
      }
      return false;
    }
    // Boss shield: a live segment blocks the ball once per hp.
    function collideShield(b) {
      if (!shield.length || b.vy >= 0 || b.y - BR > SHIELD_Y + 3 || b.y - BR < SHIELD_Y - 10) return false;
      for (var i = 0; i < shield.length; i++) {
        var s = shield[i];
        if (s.hp > 0 && b.x >= s.x0 - BR && b.x <= s.x1 + BR) {
          s.hp--; s.hit = 1;
          b.y = SHIELD_Y + 3 + BR; b.vy = Math.abs(b.vy); b.spin *= 0.5;
          var pts = 50 * ladder.level;
          api.addScore(pts);
          popText(b.x, SHIELD_Y + 26, s.hp > 0 ? 'CRACK +' + pts : 'SHIELD DOWN +' + pts, '#ffffff', 10);
          api.fx.burst(b.x, SHIELD_Y, ARENAS[arenaIdx].cpu, 26, 220, 0.6);
          api.shake(6);
          api.audio.noise(0.25, { cutoff: 2600, vol: 0.2 });
          if (M()) M().note('bell', s.hp > 0 ? 4 : 7, { quantize: '16', octave: 1, gain: 0.5 });
          return true;
        }
      }
      return false;
    }
    function collideTokens(b) {
      if (b.last !== 'you') return;
      for (var i = tokens.length - 1; i >= 0; i--) {
        var k = tokens[i], dx = b.x - k.x, dy = b.y - k.y;
        if (dx * dx + dy * dy < (BR + TOKEN_R) * (BR + TOKEN_R)) {
          tokens.splice(i, 1);
          applyPower(k.kind, b);
        }
      }
    }

    function pointWon() {
      match.you++;
      var bonus = 100 * ladder.level;
      api.addScore(bonus);
      if (match.you < cur.points) api.fx.text(W / 2, H / 2 - 30, 'POINT! +' + bonus, ARENAS[arenaIdx].cpu, 16);
      api.fx.burst(cpu.x, 0, ARENAS[arenaIdx].cpu, 30, 200, 0.8);
      api.shake(4);
      if (M()) M().stinger([{ deg: 4 }, { deg: 6, at: 2 }, { deg: 7, at: 4, steps: 6 }], { inst: 'bell', quantize: '8', octave: 1, gain: 0.55 });
      else api.audio.arp([523, 659, 784], 0.07, { type: 'square', vol: 0.18 });
      balls = [];
      if (timers.multi > 0) endPower('multi');
      if (match.you >= cur.points) { opponentBeaten(); return; }
      updateBossStage();
      phase = 'serve'; serveT = SERVE_DELAY + 0.1;
    }
    function lifeLost() {
      lives--;
      match.cpu++;
      api.shake(8); flash = 0.4;
      api.audio.tone(140, 0.4, { type: 'sawtooth', slide: 0.4, vol: 0.25 });
      if (M()) M().duck(0.5, 0.9);
      balls = [];
      if (timers.multi > 0) endPower('multi');
      phase = 'serve'; serveT = SERVE_DELAY;
      if (lives <= 0) { over = true; endAllPowers(); }
    }
    // Returns true when the point was decided (all balls cleared).
    function checkOut(b, idx) {
      if (b.y < -20) { pointWon(); return true; }
      if (b.y > H + 20) {
        if (balls.length > 1) {                         // a spare ball fizzles out
          balls.splice(idx, 1);
          api.fx.burst(b.x, H - 4, '#ffffff', 10, 120, 0.4);
          promoteMain();
          return false;
        }
        lifeLost();
        return true;
      }
      return false;
    }
    // Keep balls[0] a non-extra ball when possible (debug().ball = balls[0]).
    function promoteMain() {
      var hasMain = false;
      for (var i = 0; i < balls.length; i++) if (!balls[i].extra) hasMain = true;
      if (!hasMain && balls.length) balls[0].extra = false;
      balls.sort(function (a, c) { return (a.extra ? 1 : 0) - (c.extra ? 1 : 0); });
    }

    function stepBalls(dt) {
      var scale = timers.slow > 0 ? SLOW_SCALE : 1;
      for (var i = balls.length - 1; i >= 0; i--) {
        var b = balls[i];
        if (!b) continue;
        var n = U.clamp(Math.ceil(speedOf(b) * scale * dt / SUBSTEP_PX), 1, 16), h = dt * scale / n;
        for (var s = 0; s < n; s++) {
          if (advance(b, h, 1)) wallTick();
          collidePlayer(b) || collideMachine(b) || collideShield(b);
          collideTokens(b);
          if (balls.indexOf(b) < 0) break;
          if (checkOut(b, balls.indexOf(b))) return;
          if (balls.indexOf(b) < 0) break;
        }
        b.squash = Math.max(0, b.squash - dt * 6);
        b.trail.push(b.x, b.y);
        if (b.trail.length > TRAIL_LEN * 2) b.trail.splice(0, 2);
      }
    }

    /* --------------------------------------------------- powers */
    function applyPower(kind, b) {
      var P = POWERS[kind];
      api.addScore(25 * ladder.level);
      popText(b.x, b.y - 18, P.label, P.color, 11);
      api.fx.burst(b.x, b.y, P.color, 24, 180, 0.5);
      if (M()) M().stinger([{ deg: 7 }, { deg: 9, at: 1 }, { deg: 11, at: 2, steps: 2 }], { inst: 'bell', quantize: '16', octave: 1, gain: 0.4 });
      else api.audio.arp([660, 880, 1100], 0.05, { type: 'triangle', vol: 0.15 });
      if (kind === 'multi') {
        var sp = speedOf(b), a0 = Math.atan2(b.vy, b.vx);
        [-0.4, 0.4].forEach(function (da) {
          if (balls.length >= MAX_BALLS) return;
          var e = newBall(b.x, b.y, Math.cos(a0 + da) * sp, Math.sin(a0 + da) * sp, true);
          e.last = 'you';
          keepVertical(e);
          balls.push(e);
        });
        timers.multi = P.dur;
        ai.plan = null;
      } else if (kind === 'big') {
        timers.big = P.dur;
      } else if (kind === 'slow') {
        if (timers.slow <= 0 && M()) M().setFilter(1500, 0.3);
        timers.slow = P.dur;
      } else if (kind === 'curve') {
        curveCharges = P.charges;
        timers.curve = P.dur;
      }
      syncMusic();
    }
    function endPower(kind) {
      timers[kind] = 0;
      if (kind === 'slow' && M()) M().setFilter(18000, 0.5);
      if (kind === 'curve') curveCharges = 0;
      if (kind === 'multi') {
        // spare balls blink out; keep one if nothing else is left
        for (var i = balls.length - 1; i >= 0 && balls.length > 1; i--) {
          if (balls[i].extra) { api.fx.burst(balls[i].x, balls[i].y, POWERS.multi.color, 10, 90, 0.4); balls.splice(i, 1); }
        }
        promoteMain();
        syncMusic();
      }
    }
    function endAllPowers() {
      for (var i = 0; i < POWER_ORDER.length; i++) if (timers[POWER_ORDER[i]] > 0) endPower(POWER_ORDER[i]);
      curveCharges = 0;
    }
    function updatePowers(dt) {
      for (var i = 0; i < POWER_ORDER.length; i++) {
        var k = POWER_ORDER[i];
        if (timers[k] > 0) { timers[k] -= dt; if (timers[k] <= 0) endPower(k); }
      }
      // tokens on court
      for (var j = tokens.length - 1; j >= 0; j--) {
        tokens[j].life -= dt; tokens[j].t += dt;
        if (tokens[j].life <= 0) tokens.splice(j, 1);
      }
      powT -= dt;
      if (powT <= 0 && !tokens.length) {
        powT = POWER_GAP[0] + rng() * (POWER_GAP[1] - POWER_GAP[0]);
        var pool = POWER_ORDER.filter(function (k2) {
          if (k2 === 'multi') return balls.length < 2;
          if (k2 === 'curve') return curveCharges <= 0;
          return timers[k2] <= 0;
        });
        if (pool.length) {
          tokens.push({ kind: pool[Math.floor(rng() * pool.length)], x: 60 + rng() * (W - 120), y: H * 0.3 + rng() * H * 0.34, life: TOKEN_LIFE, t: 0 });
        }
      }
    }

    /* --------------------------------------------------- player */
    function movePlayer(dt) {
      var inp = api.input, p = api.pointer();
      if (p.moved !== lastMoved) { lastMoved = p.moved; you.x = p.x; }
      if (inp.held('left')) you.x -= KEY_SPEED * dt;
      if (inp.held('right')) you.x += KEY_SPEED * dt;
      var targetW = PW * (timers.big > 0 ? BIG_MUL : 1);
      you.w += (targetW - you.w) * Math.min(1, dt * 8);
      you.x = U.clamp(you.x, you.w / 2, W - you.w / 2);
      var vx = U.clamp((you.x - you.prevX) / dt, -1200, 1200);
      you.vx += (vx - you.vx) * Math.min(1, dt * 20);     // smoothed paddle speed
      you.prevX = you.x;
    }
    function decayFx(dt) {
      if (flash > 0) flash -= dt;
      you.flash = Math.max(0, you.flash - dt * 4); you.squash = Math.max(0, you.squash - dt * 6);
      cpu.flash = Math.max(0, cpu.flash - dt * 4); cpu.squash = Math.max(0, cpu.squash - dt * 6);
      for (var i = 0; i < shield.length; i++) shield[i].hit = Math.max(0, shield[i].hit - dt * 3);
      if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
    }
    function statusLine() {
      var s = 'VS ' + cur.fullName + ' ' + match.you + '/' + cur.points + '  \u00b7  LIVES ' + lives;
      if (phase === 'rally') s += '  \u00b7  RALLY ' + rally;
      return s + '  \u00b7  BEST ' + best;
    }

    /* ================================================== update */
    function update(dt) {
      t += dt;
      var inp = api.input;
      var swipes = inp.takeSwipes();
      decayFx(dt);
      movePlayer(dt);
      if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }

      if (phase === 'intro') {
        phaseT += dt;
        cpu.x += (W / 2 - cpu.x) * Math.min(1, dt * 3);
        var skip = phaseT > 0.5 && (inp.hit('a') || inp.hit('start') || swipes.indexOf('tap') >= 0);
        if (phaseT >= introDur || skip) { phase = 'serve'; serveT = 0.5; }
      } else if (phase === 'beaten') {
        phaseT += dt;
        cpu.x += (W / 2 - cpu.x) * Math.min(1, dt * 2);
        if (phaseT >= BEATEN_T) nextOpponent();
      } else if (phase === 'serve') {
        serveT -= dt;
        cpu.x += (W / 2 - cpu.x) * Math.min(1, dt * 3);
        if (serveT <= 0) serve();
      } else if (phase === 'rally') {
        updatePowers(dt);
        machineThink(dt);
        stepBalls(dt);
      }
      api.setStatus(statusLine());
    }

    /* ================================================== render */
    function drawShield(ctx, col) {
      for (var i = 0; i < shield.length; i++) {
        var s = shield[i];
        if (s.hp <= 0) continue;
        var a = 0.6 + 0.25 * Math.sin(t * 6 + i) + s.hit * 0.4;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        // energy band
        var g = ctx.createLinearGradient(0, SHIELD_Y - 9, 0, SHIELD_Y + 9);
        g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.5, rgba(col, 0.35 + s.hit * 0.4)); g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(s.x0, SHIELD_Y - 9, s.x1 - s.x0, 18);
        // hex cells scrolling along the band
        ctx.strokeStyle = s.hit > 0 ? '#ffffff' : rgba(col, a);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (var x = s.x0 + ((t * 20) % 12); x < s.x1 - 6; x += 12) {
          ctx.moveTo(x, SHIELD_Y - 5); ctx.lineTo(x + 5, SHIELD_Y - 5); ctx.lineTo(x + 8, SHIELD_Y); ctx.lineTo(x + 5, SHIELD_Y + 5); ctx.lineTo(x, SHIELD_Y + 5); ctx.lineTo(x - 3, SHIELD_Y);
          ctx.closePath();
        }
        ctx.stroke();
        ctx.fillStyle = rgba(col, a); ctx.fillRect(s.x0, SHIELD_Y - 7, s.x1 - s.x0, 1.5); ctx.fillRect(s.x0, SHIELD_Y + 6, s.x1 - s.x0, 1.5);
        // extra hp pips (MK loops)
        for (var h = 1; h < s.hp; h++) { ctx.fillStyle = '#fff'; ctx.fillRect((s.x0 + s.x1) / 2 - 6 + h * 6, SHIELD_Y - 1, 3, 2); }
        ctx.restore();
      }
    }
    function drawTokens(ctx) {
      for (var i = 0; i < tokens.length; i++) {
        var k = tokens[i], P = POWERS[k.kind];
        if (k.life < 2 && Math.floor(k.life * 8) % 2) continue;       // blink before vanishing
        var pop = Math.min(1, k.t * 4), r = TOKEN_R * pop * (1 + 0.08 * Math.sin(t * 6));
        drawGlow(ctx, P.color, k.x, k.y, r * 2.6, 0.6);
        ctx.save();
        ctx.translate(k.x, k.y);
        ctx.rotate(t * 1.5);
        ctx.strokeStyle = P.color; ctx.lineWidth = 2;
        ctx.beginPath();
        for (var q = 0; q < 6; q++) { var a = q / 6 * TAU; ctx[q ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
        ctx.closePath();
        ctx.fillStyle = 'rgba(10,6,24,0.8)'; ctx.fill(); ctx.stroke();
        ctx.restore();
        drawIcon(ctx, k.kind, k.x, k.y, r * 0.72, P.color);
      }
    }
    function spinColor(spin) {
      var a = Math.min(1, Math.abs(spin) / 2.5);
      return a < 0.15 ? '#ffffff' : spin > 0 ? '#ff5cf0' : '#5cffe0';
    }
    function drawTrail(ctx, b) {
      var tr = b.trail, n = tr.length / 2;
      if (n < 2) return;
      var col = spinColor(b.spin);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.strokeStyle = col;
      for (var i = 1; i < n; i++) {
        var f = i / n;
        ctx.globalAlpha = f * 0.55;
        ctx.lineWidth = BR * 1.6 * f;
        ctx.beginPath(); ctx.moveTo(tr[i * 2 - 2], tr[i * 2 - 1]); ctx.lineTo(tr[i * 2], tr[i * 2 + 1]); ctx.stroke();
      }
      ctx.restore();
    }
    function drawBall(ctx, b) {
      var col = spinColor(b.spin);
      var fade = b.extra && timers.multi < 1.5 && Math.floor(timers.multi * 10) % 2 ? 0.4 : 1;
      drawGlow(ctx, col, b.x, b.y, BR * 4, 0.9 * fade);
      var sp = speedOf(b), stretch = Math.min(0.35, sp / 2400) + b.squash * 0.3;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.atan2(b.vy, b.vx));
      // cosmetic: the ball is a ₿ coin (same radius / squash as before)
      ctx.fillStyle = '#f7931a';
      ctx.beginPath(); ctx.ellipse(0, 0, BR * (1 + stretch), BR * (1 - stretch * 0.6), 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,236,200,0.9)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
      U.btc(ctx, b.x, b.y, BR * 0.64, { coin: false, ink: '#ffffff', alpha: fade });
      // spin indicator: a rotating seam, faster and brighter with more spin
      if (Math.abs(b.spin) > 0.12) {
        var rot = b.spinA = (b.spinA || 0) + b.spin * 0.25;
        ctx.save();
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = Math.min(1, Math.abs(b.spin) / 1.5) * fade;
        ctx.beginPath(); ctx.arc(b.x, b.y, BR + 3.5, rot, rot + 1.6); ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x, b.y, BR + 3.5, rot + Math.PI, rot + Math.PI + 1.6); ctx.stroke();
        ctx.restore();
      }
    }
    function drawHud(ctx, A) {
      ctx.save();
      ctx.font = '700 10px ' + MONO;
      ctx.textBaseline = 'middle';
      // top-left: opponent; top-right: points pips
      ctx.textAlign = 'left';
      ctx.fillStyle = rgba(A.cpu, 0.85);
      ctx.fillText((ladder.rung + 1) + '/' + OPPONENTS.length + '  ' + cur.fullName, 10, 12);
      for (var p = 0; p < cur.points; p++) {
        var px = W - 14 - (cur.points - 1 - p) * 14;
        ctx.beginPath(); ctx.arc(px, 12, 4, 0, TAU);
        if (p < match.you) { ctx.fillStyle = YOU; ctx.fill(); }
        else { ctx.strokeStyle = rgba(YOU, 0.5); ctx.lineWidth = 1.5; ctx.stroke(); }
      }
      // bottom-left: lives
      for (var l = 0; l < lives; l++) { ctx.fillStyle = YOU; ctx.fillRect(12 + l * 16, H - 14, 10, 5); }
      // bottom-centre: spin gauge for the main ball
      var b = balls[0], gx = W / 2, gy = H - 11;
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(gx - 40, gy - 1, 80, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(gx - 1, gy - 4, 2, 8);
      if (b) {
        var sv = U.clamp(b.spin / SPIN_MAX, -1, 1) * 40;
        ctx.fillStyle = spinColor(b.spin);
        ctx.fillRect(Math.min(gx, gx + sv), gy - 2, Math.abs(sv), 4);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.textAlign = 'right'; ctx.fillText('SPIN', gx - 46, gy);
      // bottom-right: active powers with timer rings
      var x = W - 16;
      for (var i = POWER_ORDER.length - 1; i >= 0; i--) {
        var k = POWER_ORDER[i], P = POWERS[k];
        if (timers[k] <= 0) continue;
        ctx.strokeStyle = rgba(P.color, 0.3); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, H - 12, 9, 0, TAU); ctx.stroke();
        ctx.strokeStyle = P.color;
        ctx.beginPath(); ctx.arc(x, H - 12, 9, -Math.PI / 2, -Math.PI / 2 + TAU * timers[k] / P.dur); ctx.stroke();
        drawIcon(ctx, k, x, H - 12, 5.5, P.color);
        if (k === 'curve') { ctx.fillStyle = P.color; ctx.textAlign = 'center'; ctx.fillText('x' + curveCharges, x, H - 28); }
        x -= 26;
      }
      ctx.restore();
    }
    function drawIntroCard(ctx, A) {
      var k = Math.min(1, phaseT / 0.35), out = Math.max(0, (phaseT - introDur + 0.3) / 0.3);
      var slide = (1 - k) * -W + out * W;
      ctx.save();
      ctx.fillStyle = 'rgba(4,2,12,' + 0.55 * (1 - out) + ')';
      ctx.fillRect(0, 0, W, H);
      ctx.translate(slide, 0);
      var y0 = 170, h = 250;
      ctx.fillStyle = 'rgba(10,6,24,0.94)';
      ctx.fillRect(0, y0, W, h);
      ctx.fillStyle = A.cpu; ctx.fillRect(0, y0, W, 2); ctx.fillRect(0, y0 + h - 2, W, 2);
      U.glowText(ctx, ladder.loop ? 'ROUND ' + (ladder.rung + 1) + '  MK' + (ladder.loop + 1) : 'ROUND ' + (ladder.rung + 1) + ' / ' + OPPONENTS.length, W / 2, y0 + 22, 10, '#e6d9ff');
      drawPortrait(ctx, cur, A.cpu, 96, y0 + 118, 40, t);
      ctx.textAlign = 'left';
      U.glowText(ctx, cur.fullName, 176, y0 + 76, cur.fullName.length > 9 ? 15 : 18, A.cpu, 'left');
      U.glowText(ctx, cur.title, 176, y0 + 106, 9, '#ffffff', 'left');
      ctx.font = '700 11px ' + MONO;
      ctx.fillStyle = 'rgba(230,217,255,0.8)';
      ctx.textBaseline = 'middle';
      ctx.fillText(cur.tagline, 176, y0 + 132);
      ctx.fillStyle = rgba(A.line, 0.9);
      ctx.fillText('ARENA: ' + A.name, 176, y0 + 158);
      ctx.fillStyle = YOU;
      ctx.fillText('FIRST TO ' + cur.points + ' POINTS', 176, y0 + 178);
      if (cur.boss) { ctx.fillStyle = '#ffd23f'; ctx.fillText('WALL > SPLIT > SHIELD', 176, y0 + 198); }
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 6);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e6d9ff';
      ctx.fillText('TAP / SPACE TO START', W / 2, y0 + h - 18);
      ctx.restore();
    }

    function render(ctx) {
      var A = ARENAS[arenaIdx];
      var m = M(), pulse = m ? m.pulse() : 0;
      var mainSpin = balls[0] ? balls[0].spin : 0;
      ctx.drawImage(arenaStatic(arenaIdx), 0, 0, W, H);
      drawArenaFx(ctx, A, t, pulse, mainSpin, cpu.x);
      drawCrowd(ctx, A.line, t, pulse, Math.min(1, rally / 20));
      if (flash > 0) { ctx.fillStyle = 'rgba(255,77,109,' + flash * 0.4 + ')'; ctx.fillRect(0, 0, W, H); }
      drawNet(ctx, A, t, pulse);
      // big faint rally counter
      if (rally > 1 && phase !== 'beaten') {
        ctx.save();
        ctx.globalAlpha = 0.16 + pulse * 0.08;
        U.glowText(ctx, String(rally), W / 2, H / 2 + 60, 60, ACCENT);
        ctx.restore();
      }
      drawShield(ctx, A.cpu);
      drawTokens(ctx);
      var i;
      for (i = 0; i < balls.length; i++) drawTrail(ctx, balls[i]);
      // machine paddle(s) - lean with their motion
      var parts = machineParts(), lean = U.clamp(cpu.vx / 1500, -0.25, 0.25);
      if (phase !== 'beaten') for (i = 0; i < parts.length; i++) drawPaddle(ctx, parts[i].x, AY, parts[i].w, A.cpu, cpu.flash, cpu.squash, lean);
      // your paddle (curve charge shows as pink tips)
      drawPaddle(ctx, you.x, PY, you.w, YOU, you.flash, you.squash, U.clamp(-you.vx / 3000, -0.2, 0.2));
      if (curveCharges > 0) {
        drawGlow(ctx, POWERS.curve.color, you.x - you.w / 2, PY + PH / 2, 14, 0.8 + 0.2 * Math.sin(t * 10));
        drawGlow(ctx, POWERS.curve.color, you.x + you.w / 2, PY + PH / 2, 14, 0.8 + 0.2 * Math.sin(t * 10));
      }
      for (i = 0; i < balls.length; i++) drawBall(ctx, balls[i]);
      drawHud(ctx, A);
      if (banner) {
        ctx.save(); ctx.globalAlpha = Math.min(1, banner.t * 2);
        U.glowText(ctx, banner.text, W / 2, H / 2 - 60, 13, banner.col);
        ctx.restore();
      }
      if (phase === 'serve' && !over) {
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(t * 8) * 0.4;
        U.glowText(ctx, 'READY', W / 2, H / 2 - 100, 14, '#e6d9ff');
        ctx.restore();
      }
      if (phase === 'beaten') {
        ctx.save();
        ctx.globalAlpha = Math.min(1, phaseT * 3);
        U.glowText(ctx, 'MACHINE BEATEN', W / 2, H / 2 - 70, 14, '#ffffff');
        ctx.restore();
      }
      if (phase === 'intro') drawIntroCard(ctx, A);
    }

    return {
      // Read-only test hook: what is on screen right now. `ball` is the
      // primary ball (same shape as v1: x, y, vy) so the smoke test can track it.
      debug: function () {
        var b = balls[0];
        return {
          ball: b ? { x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: b.spin } : null,
          balls: balls.map(function (q) { return { x: q.x, y: q.y, vx: q.vx, vy: q.vy, spin: q.spin, extra: q.extra, last: q.last }; }),
          rally: rally, best: best, lives: lives, phase: phase, dead: over,
          opponent: cur.fullName, style: cur.title, rung: ladder.rung, loop: ladder.loop, level: ladder.level, beaten: ladder.beaten,
          points: { you: match.you, cpu: match.cpu, need: cur.points },
          arena: ARENAS[arenaIdx].name,
          boss: bossPhase() ? bossPhase().name : null,
          shield: shield.map(function (s) { return s.hp; }),
          you: { x: you.x, w: you.w, vx: you.vx },
          cpu: { x: cpu.x, parts: machineParts() },
          power: { multi: timers.multi, big: timers.big, slow: timers.slow, curve: timers.curve, curveCharges: curveCharges },
          tokens: tokens.map(function (k) { return { kind: k.kind, x: k.x, y: k.y }; })
        };
      },
      update: update,
      render: render
    };
  }

  /* ================================================================
   * ATTRACT - cabinet preview: neon grid, curving rally, equaliser.
   * ================================================================ */
  function attract(ctx, w, h, t) {
    var A = ARENAS[0], k;
    var grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, A.sky[1]); grd.addColorStop(0.5, A.sky[0]); grd.addColorStop(1, A.sky[1]);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = rgba(A.line, 0.18); ctx.lineWidth = 1;
    ctx.beginPath();
    for (k = -6; k <= 6; k++) { ctx.moveTo(w / 2 + k * 3, h / 2); ctx.lineTo(w / 2 + k * w * 0.16, 0); ctx.moveTo(w / 2 + k * 3, h / 2); ctx.lineTo(w / 2 + k * w * 0.16, h); }
    for (k = 0; k < 6; k++) { var f = ((k + t * 0.8) % 6) / 6, dy = f * f * h / 2; ctx.moveTo(0, h / 2 - dy); ctx.lineTo(w, h / 2 - dy); ctx.moveTo(0, h / 2 + dy); ctx.lineTo(w, h / 2 + dy); }
    ctx.stroke();
    // equaliser
    var beat = Math.pow(1 - ((t * 1.9) % 1), 3);
    for (k = 0; k < 12; k++) {
      var len = 2 + (beat * 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 5 + k))) * w * 0.06;
      ctx.fillStyle = rgba(A.line, 0.25);
      ctx.fillRect(1, k * h / 12 + 2, len, h / 12 - 4);
      ctx.fillRect(w - 1 - len, k * h / 12 + 2, len, h / 12 - 4);
    }
    ctx.fillStyle = rgba(A.line, 0.4);
    for (var x = 4; x < w; x += 14) ctx.fillRect(x, h / 2 - 1, 7, 2);
    // a curving rally: ball y bounces, x follows a bent path
    var cyc = (t * 0.7) % 2, up = cyc > 1, f2 = up ? 2 - cyc : cyc;
    var by = h * 0.12 + f2 * h * 0.76;
    var curve = Math.sin(f2 * Math.PI) * w * 0.18 * (up ? 1 : -1);
    var bx = w / 2 + Math.sin(t * 1.3) * w * 0.25 + curve;
    var pw = w * 0.2;
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = A.cpu; ctx.fillStyle = A.cpu;
    ctx.fillRect(bx - curve - pw / 2 + Math.sin(t * 3) * 6, h * 0.08, pw, h * 0.03);
    ctx.shadowColor = YOU; ctx.fillStyle = YOU;
    ctx.fillRect(bx - curve - pw / 2 - Math.sin(t * 2.5) * 6, h * 0.89, pw, h * 0.03);
    ctx.restore();
    // trail
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#ff5cf0'; ctx.lineCap = 'round';
    for (k = 1; k <= 8; k++) {
      var tt = t - k * 0.03, c2 = (tt * 0.7) % 2, u2 = c2 > 1, g2 = u2 ? 2 - c2 : c2;
      var tx = w / 2 + Math.sin(tt * 1.3) * w * 0.25 + Math.sin(g2 * Math.PI) * w * 0.18 * (u2 ? 1 : -1);
      ctx.globalAlpha = (1 - k / 9) * 0.4;
      ctx.lineWidth = h * 0.03 * (1 - k / 9);
      ctx.beginPath(); ctx.arc(tx, h * 0.12 + g2 * h * 0.76, ctx.lineWidth / 2, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.shadowColor = '#ff5cf0'; ctx.shadowBlur = 12;
    U.btc(ctx, bx, by, Math.max(4, h * 0.03), { glow: 12 });
    ctx.restore();
  }

  XA.registerGame({
    id: 'xa_pong_streak',
    order: 21,
    title: 'Bit Pong',
    tagline: 'Climb the machine ladder. Bend the ball.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG LEFT AND RIGHT TO MOVE YOUR PADDLE',
    controls: 'Mouse / drag or \u2190\u2192 to move \u00b7 move while hitting to spin',
    create: create,
    attract: attract
  });
})(window);

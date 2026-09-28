(function (root) {
'use strict';
// ---------------------------------------------------------------------------
// Astro Blaster 3 — deterministic simulation core.
//
// DETERMINISM RULES (the replay proof depends on these):
// - The sim never reads the clock, Math.random, the DOM or device state.
// - Only + - * / Math.floor/abs/min/max/sqrt/imul and bit ops are used.
//   Math.sin/cos/atan2/pow/exp are NOT used: their results may differ between
//   browser engines. dsin/dcos below are pure polynomials instead.
// - Arrays are iterated in insertion order; removal is order-preserving.
// ---------------------------------------------------------------------------

var ENGINE_VERSION = 1;
var W = 360, H = 640;
var TAU = 6.283185307179586, PI = 3.141592653589793, HALF_PI = 1.5707963267948966;

function dsin(x) {
  // range-reduce to [-PI, PI]
  var k = Math.floor(x / TAU + 0.5);
  x = x - k * TAU;
  // reflect to [-PI/2, PI/2]
  if (x > HALF_PI) x = PI - x;
  else if (x < -HALF_PI) x = -PI - x;
  var x2 = x * x;
  // Taylor series to x^13 (error < 1e-9 on [-PI/2, PI/2])
  return x * (1 + x2 * (-1 / 6 + x2 * (1 / 120 + x2 * (-1 / 5040 + x2 * (1 / 362880 + x2 * (-1 / 39916800 + x2 / 6227020800))))));
}
function dcos(x) { return dsin(x + HALF_PI); }

function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
function len(x, y) { return Math.sqrt(x * x + y * y); }

// mulberry32 — 32-bit integer PRNG, identical on every engine.
function makeRng(seed) {
  var s = seed >>> 0;
  var rng = function () {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.int = function (n) { return Math.floor(rng() * n); };
  rng.range = function (a, b) { return a + rng() * (b - a); };
  rng.pick = function (arr) { return arr[Math.floor(rng() * arr.length)]; };
  rng.chance = function (p) { return rng() < p; };
  rng.state = function () { return s; };
  return rng;
}

// Stable string hash (FNV-1a 32) — used for daily seeds and state hashes.
function fnv1a(str) {
  var h = 0x811c9dc5;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
function hashMix(h, v) {
  // v: number; mixes its integer part (and 1/64 fraction) into h
  var n = Math.floor(v * 64) | 0;
  h ^= n & 0xffff; h = Math.imul(h, 0x01000193) >>> 0;
  h ^= (n >>> 16) & 0xffff; h = Math.imul(h, 0x01000193) >>> 0;
  return h;
}

function dailySeed(period) { return fnv1a('astro3-daily-' + period); }

// Order-preserving in-place filter.
function compact(arr, keep) {
  var j = 0;
  for (var i = 0; i < arr.length; i++) { if (keep(arr[i])) arr[j++] = arr[i]; }
  arr.length = j;
}

// Rotate a unit vector (x, y) by angle a.
function rot(x, y, a) {
  var c = dcos(a), s = dsin(a);
  return [x * c - y * s, x * s + y * c];
}
function aimAt(fx, fy, tx, ty) {
  var dx = tx - fx, dy = ty - fy, l = len(dx, dy) || 1;
  return [dx / l, dy / l];
}

// ---------------------------------------------------------------------------
// Game data: sectors, enemies, weapons, upgrade cards.
// ---------------------------------------------------------------------------

var SECTORS = [
  { name: 'Perimeter Drift', boss: 'warden', hazard: null,
    pool: { dart: 5, weaver: 4, swarmer: 3, gunship: 2 } },
  { name: 'Ember Belt', boss: 'hive', hazard: 'rocks',
    pool: { dart: 4, weaver: 3, swarmer: 3, gunship: 2, splitter: 3, minelayer: 2 } },
  { name: 'Nebula Veil', boss: 'twins', hazard: 'fog',
    pool: { dart: 3, weaver: 3, swarmer: 3, gunship: 2, splitter: 2, sniper: 3, bearer: 3 } },
  { name: 'Glass Reef', boss: 'leviathan', hazard: 'crystals',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, sniper: 2, bearer: 2, mirror: 3, turret: 2 } },
  { name: 'Storm Corridor', boss: 'prism', hazard: 'lightning',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, splitter: 2, sniper: 2, mirror: 2, turret: 2, carrier: 2 } },
  { name: 'The Source', boss: 'signal', hazard: 'mixed',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 3, splitter: 2, minelayer: 2, sniper: 2, bearer: 2, mirror: 2, turret: 2, carrier: 2 } }
];

// hp: base hit points; r: hit radius; score: base points; scrap: orbs dropped
var ENEMIES = {
  dart:      { hp: 2,  r: 9,  score: 100, scrap: 1 },
  weaver:    { hp: 4,  r: 10, score: 150, scrap: 1 },
  gunship:   { hp: 14, r: 15, score: 400, scrap: 3 },
  splitter:  { hp: 9,  r: 14, score: 250, scrap: 2 },
  minelayer: { hp: 10, r: 14, score: 350, scrap: 2 },
  bearer:    { hp: 12, r: 15, score: 400, scrap: 3 },
  sniper:    { hp: 8,  r: 11, score: 350, scrap: 2 },
  swarmer:   { hp: 2,  r: 8,  score: 80,  scrap: 1 },
  carrier:   { hp: 60, r: 26, score: 1200, scrap: 6 },
  turret:    { hp: 36, r: 18, score: 700, scrap: 4 },
  mirror:    { hp: 12, r: 13, score: 450, scrap: 3 },
  rock:      { hp: 6,  r: 16, score: 60,  scrap: 1, hazard: true },
  pebble:    { hp: 2,  r: 9,  score: 30,  scrap: 0, hazard: true },
  crystal:   { hp: 1,  r: 14, score: 0,   scrap: 0, hazard: true, invuln: true }
};

var WEAPONS = ['pulse', 'scatter', 'lance', 'swarm'];
var WEAPON_NAMES = { pulse: 'Pulse', scatter: 'Scatter', lance: 'Lance', swarm: 'Swarm' };

// Module caps
var MODULE_MAX = { drone: 2, shield: 2, magnet: 3, over: 3, after: 3, graze: 2, bomb: 3, chain: 3 };
var MODULE_INFO = {
  drone:  ['Wing Drone', 'A drone flies beside you and fires your weapon at half power.'],
  shield: ['Shield Cell', 'Blocks one hit. Recharges one cell after each wave.'],
  magnet: ['Magnet', 'Pulls scrap in from further away.'],
  over:   ['Overcharge', 'Fire 15% faster.'],
  after:  ['Afterburner', 'Move 12% faster.'],
  graze:  ['Graze Field', 'Wider graze zone: more points and bomb charge from near misses.'],
  bomb:   ['Nova Rack', '+1 bomb now and +1 bomb capacity.'],
  chain:  ['Chain Battery', 'Your kill chain lasts half a second longer.']
};

var BOSSES = {
  warden:    { name: 'Warden', hp: 520 },
  hive:      { name: 'Hive Mother', hp: 760 },
  twins:     { name: 'Twin Lancers', hp: 430 },   // per ship
  leviathan: { name: 'Leviathan', hp: 70 },       // per segment (12 segments)
  prism:     { name: 'Prism Core', hp: 1300 },
  signal:    { name: 'The Signal', hp: 2100 }
};

// Input commands (discrete, one frame).
var CMD = {
  NONE: 0, BOMB: 1,
  CARD1: 2, CARD2: 3, CARD3: 4,
  DOCK1: 5, DOCK2: 6, DOCK3: 7, DOCK4: 8, DOCK_LEAVE: 9
};

// ---------------------------------------------------------------------------
// Game state, step function, player, weapons, collisions, waves, cards, dock.
// ---------------------------------------------------------------------------

var MODE_CAMPAIGN = 0, MODE_DAILY = 1;

function createGame(opts) {
  opts = opts || {};
  var mode = opts.mode === MODE_DAILY ? MODE_DAILY : MODE_CAMPAIGN;
  var period = (opts.period >>> 0) || 0;
  var seed = mode === MODE_DAILY ? dailySeed(period) : (opts.seed >>> 0);
  // The pilot (the submitting wallet's hash160) is mixed into the run, so a copied
  // input stream replayed under another wallet falls out of sync.
  var pilot = new Uint8Array(20);
  if (opts.pilot && opts.pilot.length === 20) pilot.set(opts.pilot);
  var pilotVersion = (opts.pilotVersion | 0) & 255;
  var ph = 0x811c9dc5;
  for (var pi = 0; pi < 20; pi++) { ph ^= pilot[pi]; ph = Math.imul(ph, 0x01000193) >>> 0; }
  ph ^= pilotVersion; ph = Math.imul(ph, 0x01000193) >>> 0;
  var mainSeed = mode === MODE_DAILY ? seed : ((seed ^ ph) >>> 0); // daily waves stay identical for everyone
  var st = {
    v: ENGINE_VERSION, seed: seed, mode: mode, period: period,
    pilot: pilot, pilotVersion: pilotVersion,
    rng: makeRng(mainSeed),
    rng2: makeRng((seed ^ ph ^ 0x9e3779b9) >>> 0), // pilot-bound: upgrades, dock crates, drops
    frame: 0, phase: 'play', overT: 0,
    loop: 0, sector: 0, wave: 0,
    flow: 'sectorIntro', flowT: 0,
    banner: null,
    player: {
      x: W / 2, y: H - 90, lives: 3, shield: 0, bombs: 2, bombMax: 3, bombCharge: 0,
      inv: 60, weapon: 'pulse', wlv: 1, fireT: 0, missileT: 0, droneT: 0,
      mods: { drone: 0, shield: 0, magnet: 0, over: 0, after: 0, graze: 0, bomb: 0, chain: 0 },
      hitThisWave: false, vx: 0, vy: 0
    },
    score: 0, chain: 0, chainT: 0, maxChain: 0, scrap: 0,
    kills: 0, grazes: 0, bossTimes: [],
    pb: [], eb: [], en: [], pk: [], beams: [], lanes: [],
    schedule: [], waveT: 0, hazardT: 0,
    boss: null,
    cards: null, dock: null, dockBuys: [0, 0, 0, 0],
    events: [],
    nextId: 1,
    testGod: !!opts.testGod
  };
  banner(st, 'SECTOR 1', SECTORS[0].name, 150);
  return st;
}

function ev(st, type, a) { a = a || {}; a.type = type; st.events.push(a); }
function banner(st, title, sub, t) { st.banner = { title: title, sub: sub || '', t: t, max: t }; }

function diff(st) {
  var s = st.sector, L = st.loop;
  return {
    hp: 1 + 0.5 * s + 1.6 * L,
    fire: 1.2 + 0.3 * s + 1.1 * L,
    bs: 1.08 + 0.09 * s + 0.35 * L,
    elite: Math.min(0.6, 0.015 + 0.035 * s + 0.12 * L)
  };
}
function loopMult(st) { var m = 1; for (var i = 0; i < st.loop; i++) m *= 1.5; return m; }
function chainMult(st) { return Math.min(8, 1 + Math.floor(st.chain / 6)); }
function addScore(st, base, useChain) {
  var pts = Math.floor(base * (useChain ? chainMult(st) : 1) * loopMult(st));
  st.score += pts;
  return pts;
}

// --------------------------------------------------------------------------
// Step
// --------------------------------------------------------------------------
function step(st, input) {
  st.events.length = 0;
  var ax = input ? (input.ax | 0) : 0, ay = input ? (input.ay | 0) : 0, cmd = input ? (input.cmd | 0) : 0;
  if (ax < -4) ax = -4; if (ax > 4) ax = 4; if (ay < -4) ay = -4; if (ay > 4) ay = 4;

  if (st.phase === 'over') return;
  if (st.phase === 'cards') { handleCards(st, cmd); st.frame++; return; }
  if (st.phase === 'dock') { handleDock(st, cmd); st.frame++; return; }

  st.frame++;
  var p = st.player;

  if (st.overT > 0) {
    st.overT--;
    if (st.overT === 0) { st.phase = 'over'; ev(st, 'gameOver'); return; }
  } else {
    // movement
    var sp = 3.4; for (var i = 0; i < p.mods.after; i++) sp *= 1.12;
    p.vx = ax / 4 * sp; p.vy = ay / 4 * sp;
    if (ax !== 0 && ay !== 0) { p.vx *= 0.7071; p.vy *= 0.7071; }
    p.x = clamp(p.x + p.vx, 12, W - 12);
    p.y = clamp(p.y + p.vy, 70, H - 24);
    if (cmd === CMD.BOMB) useBomb(st);
    if (p.inv > 0) p.inv--;
    fireWeapons(st);
  }

  if (st.banner) { st.banner.t--; if (st.banner.t <= 0) st.banner = null; }
  if (st.chainT > 0) { st.chainT--; if (st.chainT === 0) { if (st.chain >= 12) ev(st, 'chainLost', { chain: st.chain }); st.chain = 0; } }

  runFlow(st);
  updateHazards(st);
  updateEnemies(st);
  if (st.boss) updateBoss(st);
  updatePlayerBullets(st);
  updateEnemyBullets(st);
  updateBeams(st);
  updatePickups(st);
}

// --------------------------------------------------------------------------
// Flow: sector intro -> waves (x4, cards after each) -> boss -> dock -> next
// --------------------------------------------------------------------------
function runFlow(st) {
  st.flowT++;
  switch (st.flow) {
    case 'sectorIntro':
      if (st.flowT >= 150) startWave(st);
      break;
    case 'wave':
      st.waveT++;
      while (st.schedule.length && st.schedule[0].t <= st.waveT) spawnFromSchedule(st, st.schedule.shift());
      if (!st.schedule.length && !waveEnemiesLeft(st)) waveClear(st);
      break;
    case 'waveClear':
      if (st.flowT >= 80) {
        offerCards(st);
      }
      break;
    case 'bossWarn':
      if (st.flowT >= 160) { st.flow = 'boss'; st.flowT = 0; startBoss(st); }
      break;
    case 'boss':
      if (!st.boss) { st.flow = 'bossDead'; st.flowT = 0; }
      break;
    case 'bossDead':
      if (st.flowT >= 150) openDock(st);
      break;
  }
}

function waveEnemiesLeft(st) {
  for (var i = 0; i < st.en.length; i++) if (!st.en[i].hazard && !st.en[i].dead) return true;
  return false;
}

function startWave(st) {
  st.flow = 'wave'; st.flowT = 0; st.waveT = 0;
  st.player.hitThisWave = false;
  st.schedule = genWave(st);
  banner(st, 'WAVE ' + (st.sector + 1) + '-' + (st.wave + 1), SECTORS[st.sector].name, 70);
  ev(st, 'waveStart', { sector: st.sector, wave: st.wave });
}

function waveClear(st) {
  st.flow = 'waveClear'; st.flowT = 0;
  var s = st.sector + 1;
  var bonus = 0;
  if (!st.player.hitThisWave) bonus = addScore(st, 600 * s, false);
  ev(st, 'waveClear', { perfect: !st.player.hitThisWave, bonus: bonus });
  banner(st, st.player.hitThisWave ? 'WAVE CLEAR' : 'PERFECT WAVE', bonus ? '+' + bonus : '', 80);
  // shields recharge one cell per wave
  var p = st.player;
  if (p.shield < p.mods.shield) p.shield++;
}

function afterCards(st) {
  st.phase = 'play';
  st.cards = null;
  if (st.wave < 3) { st.wave++; startWave(st); }
  else {
    st.wave = 4; st.flow = 'bossWarn'; st.flowT = 0;
    // clear leftover hazards so the boss arena is clean
    compact(st.en, function (e) { return !e.hazard; });
    st.lanes.length = 0;
    banner(st, 'WARNING', BOSSES[SECTORS[st.sector].boss].name.toUpperCase() + ' APPROACHING', 160);
    ev(st, 'bossWarn', { boss: SECTORS[st.sector].boss });
  }
}

function afterDock(st) {
  st.phase = 'play'; st.dock = null;
  st.wave = 0;
  st.sector++;
  if (st.sector >= SECTORS.length) {
    st.sector = 0; st.loop++;
    ev(st, 'loop', { loop: st.loop });
    banner(st, 'DEEP LOOP ' + st.loop, 'Score x' + loopMult(st).toFixed(2).replace(/\.?0+$/, ''), 180);
  } else {
    banner(st, 'SECTOR ' + (st.sector + 1), SECTORS[st.sector].name, 150);
  }
  st.flow = 'sectorIntro'; st.flowT = 0;
  ev(st, 'sectorStart', { sector: st.sector, loop: st.loop });
}

// --------------------------------------------------------------------------
// Wave generation (seeded)
// --------------------------------------------------------------------------
function weightedPick(rng, pool) {
  var total = 0, k;
  for (k in pool) total += pool[k];
  var r = rng() * total;
  for (k in pool) { r -= pool[k]; if (r < 0) return k; }
  return k;
}

function genWave(st) {
  var rng = st.rng, s = st.sector, w = st.wave, L = st.loop;
  var pool = SECTORS[s].pool;
  var groups = Math.min(18, 6 + w + s + 2 * L);
  var out = [], t = 20;
  var d = diff(st);
  function add(dt, type, x, y, extra) {
    var o = { t: t + dt, type: type, x: x, y: y, elite: rng.chance(d.elite) };
    if (extra) for (var k in extra) o[k] = extra[k];
    out.push(o);
  }
  for (var g = 0; g < groups; g++) {
    var type = weightedPick(rng, pool);
    var n, i, x;
    switch (type) {
      case 'dart': {
        var f = rng.int(3);
        n = 4 + rng.int(3);
        if (f === 0) { for (i = 0; i < n; i++) add(0, 'dart', 40 + i * (280 / (n - 1)), -20); }
        else if (f === 1) { x = rng.range(60, 300); for (i = 0; i < n; i++) add(i * 10, 'dart', x, -20); }
        else { var cx = rng.range(110, 250); for (i = 0; i < 5; i++) add(Math.abs(i - 2) * 8, 'dart', cx + (i - 2) * 32, -20); }
        break;
      }
      case 'weaver':
        n = 4 + rng.int(2); x = rng.range(80, 280);
        for (i = 0; i < n; i++) add(i * 16, 'weaver', x, -20, { phase: i * 0.6 });
        break;
      case 'swarmer': {
        var fromLeft = rng.chance(0.5), y0 = rng.range(50, 170);
        n = 6;
        for (i = 0; i < n; i++) add(i * 9, 'swarmer', fromLeft ? -16 : W + 16, y0, { dir: fromLeft ? 1 : -1 });
        break;
      }
      case 'gunship':
        n = 1 + (rng.chance(0.4 + 0.1 * s) ? 1 : 0);
        for (i = 0; i < n; i++) add(i * 30, 'gunship', n === 1 ? rng.range(90, 270) : 100 + i * 160, -24, { ty: rng.range(80, 190) });
        break;
      case 'splitter':
        n = 2 + rng.int(2);
        for (i = 0; i < n; i++) add(i * 20, 'splitter', 70 + i * (220 / Math.max(1, n - 1)), -24);
        break;
      case 'minelayer': {
        var left = rng.chance(0.5);
        add(0, 'minelayer', left ? -20 : W + 20, rng.range(60, 150), { dir: left ? 1 : -1 });
        break;
      }
      case 'sniper':
        n = 2;
        add(0, 'sniper', rng.range(40, 140), -20, { ty: rng.range(60, 140) });
        add(24, 'sniper', rng.range(220, 320), -20, { ty: rng.range(60, 140) });
        break;
      case 'bearer':
        n = 2 + rng.int(2);
        for (i = 0; i < n; i++) add(i * 14, 'bearer', 80 + i * (200 / Math.max(1, n - 1)), -24);
        break;
      case 'carrier':
        add(0, 'carrier', rng.range(110, 250), -40);
        break;
      case 'turret':
        n = 1 + (rng.chance(0.35) ? 1 : 0);
        for (i = 0; i < n; i++) add(i * 40, 'turret', n === 1 ? rng.range(90, 270) : 90 + i * 180, -30);
        break;
      case 'mirror':
        n = 2 + rng.int(2);
        for (i = 0; i < n; i++) add(i * 18, 'mirror', 70 + i * (220 / Math.max(1, n - 1)), -20);
        break;
    }
    var gap = Math.floor((150 - 7 * s - 10 * w - 8 * L) * rng.range(0.75, 1.1));
    if (type === 'carrier' || type === 'turret' || type === 'gunship') gap += 50;
    t += Math.max(48, gap);
  }
  out.sort(function (a, b) { return a.t - b.t; });
  return out;
}

function spawnFromSchedule(st, o) {
  var e = spawnEnemy(st, o.type, o.x, o.y, o.elite);
  for (var k in o) if (k !== 't' && k !== 'type' && k !== 'x' && k !== 'y' && k !== 'elite') e[k] = o[k];
}

function spawnEnemy(st, type, x, y, elite) {
  var def = ENEMIES[type], d = diff(st);
  var hp = def.invuln ? 1e9 : def.hp * d.hp * (elite ? 2.5 : 1);
  var e = {
    id: st.nextId++, t: type, x: x, y: y, vx: 0, vy: 0, r: def.r,
    hp: hp, maxHp: hp, age: 0, elite: !!elite, hazard: !!def.hazard, invuln: !!def.invuln,
    fireT: 25 + st.rng.int(45), dead: false, dmgMul: 1, flash: 0, s: {}
  };
  st.en.push(e);
  return e;
}

// --------------------------------------------------------------------------
// Hazards per sector
// --------------------------------------------------------------------------
function updateHazards(st) {
  if (st.flow !== 'wave') return;
  var hz = SECTORS[st.sector].hazard, rng = st.rng;
  if (!hz || hz === 'fog') return;
  st.hazardT++;
  var mixed = hz === 'mixed';
  if ((hz === 'rocks' || mixed) && st.hazardT % (mixed ? 170 : 85) === 0) {
    var r = spawnEnemy(st, 'rock', rng.range(20, W - 20), -24, false);
    r.vx = rng.range(-0.6, 0.6); r.vy = rng.range(1.1, 2.0); r.spin = rng.range(-0.05, 0.05);
  }
  if ((hz === 'crystals' || mixed) && st.hazardT % (mixed ? 300 : 210) === 0) {
    var c = spawnEnemy(st, 'crystal', rng.range(40, W - 40), -24, false);
    c.vy = 0.7; c.vx = 0;
  }
  if ((hz === 'lightning' || mixed) && st.hazardT % (mixed ? 260 : 170) === 0) {
    // lane avoids spawning directly on top of the player too often: pure random x
    st.lanes.push({ x: rng.range(30, W - 30), w: 44, warn: 75, act: 16, age: 0 });
    ev(st, 'laneWarn');
  }
}

// --------------------------------------------------------------------------
// Player weapons
// --------------------------------------------------------------------------
function cooldownMul(p) { var m = 1; for (var i = 0; i < p.mods.over; i++) m *= 0.85; return m; }

function pbullet(st, x, y, vx, vy, dmg, kind, pierce, extra) {
  var b = { x: x, y: y, vx: vx, vy: vy, dmg: dmg, kind: kind, pierce: pierce || 1, hit: null, life: 0, reflect: 0 };
  if (extra) for (var k in extra) b[k] = extra[k];
  st.pb.push(b);
  return b;
}

function fireWeapons(st) {
  var p = st.player;
  if (st.flow === 'bossDead' || st.flow === 'sectorIntro' && st.flowT < 30) return;
  var lv = p.wlv, cm = cooldownMul(p), i;
  p.fireT--;
  if (p.fireT <= 0) {
    var x = p.x, y = p.y - 14;
    switch (p.weapon) {
      case 'pulse': {
        var dmg = [2, 2, 3, 3, 4][lv - 1];
        if (lv === 1) pbullet(st, x, y, 0, -11, dmg, 'pulse');
        else if (lv <= 3) { pbullet(st, x - 5, y, 0, -11, dmg, 'pulse'); pbullet(st, x + 5, y, 0, -11, dmg, 'pulse'); }
        else {
          pbullet(st, x, y - 2, 0, -11, dmg, 'pulse');
          pbullet(st, x - 8, y, 0, -11, dmg, 'pulse'); pbullet(st, x + 8, y, 0, -11, dmg, 'pulse');
          if (lv === 5) { pbullet(st, x - 10, y, -1.3, -10.8, dmg - 1, 'pulse'); pbullet(st, x + 10, y, 1.3, -10.8, dmg - 1, 'pulse'); }
        }
        p.fireT = Math.max(3, Math.floor(7 * cm));
        break;
      }
      case 'scatter': {
        var n = [3, 5, 5, 7, 7][lv - 1], spread = [0.5, 0.7, 0.7, 0.9, 0.95][lv - 1], sd = [1.6, 1.6, 2.1, 2.1, 2.6][lv - 1];
        for (i = 0; i < n; i++) {
          var a = -spread / 2 + spread * i / (n - 1);
          var v = rot(0, -9.5, a);
          pbullet(st, x, y, v[0], v[1], sd, 'scatter');
        }
        p.fireT = Math.max(4, Math.floor(9 * cm));
        break;
      }
      case 'lance': {
        var ld = [5, 6, 8, 9, 11][lv - 1], pierce = [2, 3, 3, 4, 5][lv - 1];
        pbullet(st, x, y - 6, 0, -14, ld, 'lance', pierce);
        if (lv >= 4) {
          pbullet(st, x - 12, y, -0.9, -13.5, ld / 2, 'lance', 2);
          pbullet(st, x + 12, y, 0.9, -13.5, ld / 2, 'lance', 2);
        }
        p.fireT = Math.max(5, Math.floor(12 * cm));
        break;
      }
      case 'swarm': {
        pbullet(st, x, y, 0, -10, 1.5, 'pulse');
        p.fireT = Math.max(4, Math.floor(8 * cm));
        break;
      }
    }
  }
  if (p.weapon === 'swarm') {
    p.missileT--;
    if (p.missileT <= 0) {
      var cnt = [1, 2, 2, 3, 4][lv - 1], md = [4, 4, 5, 5, 6][lv - 1];
      for (i = 0; i < cnt; i++) {
        var side = (i % 2 === 0 ? -1 : 1) * (1 + Math.floor(i / 2));
        pbullet(st, p.x + side * 8, p.y, side * 1.8, -3, md, 'missile', 1, { homing: 1 });
      }
      p.missileT = Math.max(10, Math.floor([30, 26, 22, 20, 18][lv - 1] * cm));
    }
  }
  if (p.mods.drone > 0) {
    p.droneT--;
    if (p.droneT <= 0) {
      for (i = 0; i < p.mods.drone; i++) {
        var dx = p.x + (i === 0 ? -26 : 26), dy = p.y + 10;
        switch (p.weapon) {
          case 'pulse': pbullet(st, dx, dy, 0, -11, 1 + lv * 0.4, 'drone'); break;
          case 'scatter':
            pbullet(st, dx, dy, -1.4, -9.4, 0.9 + lv * 0.2, 'drone'); pbullet(st, dx, dy, 0, -9.5, 0.9 + lv * 0.2, 'drone');
            pbullet(st, dx, dy, 1.4, -9.4, 0.9 + lv * 0.2, 'drone'); break;
          case 'lance': pbullet(st, dx, dy, 0, -14, 2 + lv, 'lance', 2); break;
          case 'swarm': pbullet(st, dx, dy, (i === 0 ? -1.5 : 1.5), -3, 2 + lv * 0.5, 'missile', 1, { homing: 1 }); break;
        }
      }
      p.droneT = Math.max(6, Math.floor((p.weapon === 'swarm' ? 34 : 13) * cm));
    }
  }
}

function useBomb(st) {
  var p = st.player;
  if (p.bombs <= 0) return;
  p.bombs--;
  p.inv = Math.max(p.inv, 90);
  var cleared = st.eb.length;
  st.eb.length = 0;
  for (var i = 0; i < st.beams.length; i++) st.beams[i].age = st.beams[i].warn + st.beams[i].act; // cancel
  for (var j = 0; j < st.en.length; j++) {
    var e = st.en[j];
    if (e.dead || e.invuln || e.y < -10) continue;
    damageEnemy(st, e, e.boss ? 30 : 40, true);
  }
  ev(st, 'bomb', { x: p.x, y: p.y, cleared: cleared });
}

// --------------------------------------------------------------------------
// Player bullets
// --------------------------------------------------------------------------
function nearestTarget(st, x, y) {
  var best = null, bd = 1e12;
  for (var i = 0; i < st.en.length; i++) {
    var e = st.en[i];
    if (e.dead || e.invuln || e.y < 0 || e.dmgMul === 0) continue;
    var d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}

function updatePlayerBullets(st) {
  var pb = st.pb, en = st.en;
  for (var i = 0; i < pb.length; i++) {
    var b = pb[i];
    b.life++;
    if (b.homing) {
      if (b.life > 6) {
        var tg = nearestTarget(st, b.x, b.y);
        if (tg) {
          var dir = aimAt(b.x, b.y, tg.x, tg.y);
          b.vx += dir[0] * 0.9; b.vy += dir[1] * 0.9;
        } else b.vy -= 0.4;
        var sp = len(b.vx, b.vy), max = 8.5;
        if (sp > max) { b.vx = b.vx / sp * max; b.vy = b.vy / sp * max; }
      }
    }
    b.x += b.vx; b.y += b.vy;
    if (b.reflect > 0) b.reflect--;
    if (b.y < -20 || b.y > H + 20 || b.x < -20 || b.x > W + 20) { b.dead = true; continue; }
    for (var j = 0; j < en.length; j++) {
      var e = en[j];
      if (e.dead) continue;
      var rr = e.r + (b.kind === 'lance' ? 5 : 4);
      var dx = b.x - e.x, dy = b.y - e.y;
      if (dx * dx + dy * dy > rr * rr) continue;
      if (b.hit && b.hit.indexOf(e.id) >= 0) continue;
      // crystals reflect player shots
      if (e.t === 'crystal') {
        if (b.reflect === 0) { b.vy = -b.vy * 0.9; b.vx = -b.vx + (dx > 0 ? 1.6 : -1.6); b.reflect = 10; ev(st, 'ricochet', { x: b.x, y: b.y }); }
        continue;
      }
      // mirrors reflect while flashing
      if (e.t === 'mirror' && e.s.flashing) {
        b.dead = true;
        var a = aimAt(b.x, b.y, st.player.x, st.player.y);
        ebullet(st, b.x, b.y, a[0] * 3.4, a[1] * 3.4, 'shard');
        ev(st, 'reflect', { x: b.x, y: b.y });
        break;
      }
      // bearers block shots from straight below (lance pierces the shield)
      if (e.t === 'bearer' && b.kind !== 'lance' && b.vy < 0 && Math.abs(dx) < e.r * 0.6 && dy > 0) {
        b.dead = true; e.s.block = 8; ev(st, 'block', { x: b.x, y: b.y - 4 });
        break;
      }
      damageEnemy(st, e, b.dmg, false);
      if (b.pierce > 1) { b.pierce--; if (!b.hit) b.hit = []; b.hit.push(e.id); }
      else { b.dead = true; break; }
    }
  }
  compact(pb, function (b) { return !b.dead; });
  compact(en, function (e) { return !e.dead; });
}

function damageEnemy(st, e, dmg, fromBomb) {
  if (e.dead || e.invuln) return;
  var m = e.dmgMul;
  if (m <= 0) { if (!fromBomb) ev(st, 'shieldHit', { x: e.x, y: e.y }); return; }
  e.hp -= dmg * m;
  e.flash = 4;
  if (e.hp <= 0) killEnemy(st, e);
  else if (!fromBomb && (st.frame & 3) === 0) ev(st, 'hit', { x: e.x, y: e.y });
}

function killEnemy(st, e) {
  if (e.dead) return;
  e.dead = true;
  if (e.boss) { bossPartKilled(st, e); return; }
  var def = ENEMIES[e.t];
  if (!e.hazard) {
    st.chain++; st.chainT = 90 + 30 * st.player.mods.chain;
    if (st.chain > st.maxChain) st.maxChain = st.chain;
    st.kills++;
  }
  var pts = addScore(st, def.score * (e.elite ? 3 : 1), !e.hazard);
  ev(st, 'kill', { x: e.x, y: e.y, t: e.t, elite: e.elite, pts: pts, big: e.r > 18 });
  var n = def.scrap * (e.elite ? 2 : 1);
  for (var i = 0; i < n; i++) dropPickup(st, e.x, e.y, 'scrap');
  if (e.elite && st.rng2.chance(0.12)) dropPickup(st, e.x, e.y, 'bomb');
  onEnemyDeath(st, e);
}

function dropPickup(st, x, y, kind) {
  var rng = st.rng2;
  st.pk.push({ x: x + rng.range(-8, 8), y: y + rng.range(-8, 8), vx: rng.range(-1.2, 1.2), vy: rng.range(-2.2, -0.6), kind: kind, age: 0 });
}

// --------------------------------------------------------------------------
// Enemy bullets, beams, lanes, pickups, player hits
// --------------------------------------------------------------------------
function ebullet(st, x, y, vx, vy, kind, extra) {
  var b = { x: x, y: y, vx: vx, vy: vy, kind: kind || 'orb', r: 3.5, grazed: false, life: 0, ax: 0, ay: 0 };
  if (kind === 'big') b.r = 6.5;
  else if (kind === 'needle') b.r = 2.6;
  else if (kind === 'mine') b.r = 6;
  else if (kind === 'shard') b.r = 3;
  if (extra) for (var k in extra) b[k] = extra[k];
  st.eb.push(b);
  return b;
}

function grazeRadius(p) { return 20 + 8 * p.mods.graze; }

function updateEnemyBullets(st) {
  var p = st.player, eb = st.eb, gr = grazeRadius(p), alive = st.overT === 0;
  for (var i = 0; i < eb.length; i++) {
    var b = eb[i];
    b.life++;
    b.vx += b.ax; b.vy += b.ay;
    b.x += b.vx; b.y += b.vy;
    if (b.kind === 'mine' && b.life >= (b.fuse || 100)) {
      b.dead = true;
      var n = 8, sp = 2.2 * diff(st).bs;
      for (var k = 0; k < n; k++) { var v = rot(0, sp, TAU * k / n); ebullet(st, b.x, b.y, v[0], v[1], 'orb'); }
      ev(st, 'mineBurst', { x: b.x, y: b.y });
      continue;
    }
    if (b.x < -30 || b.x > W + 30 || b.y < -40 || b.y > H + 30) { b.dead = true; continue; }
    if (!alive) continue;
    var dx = b.x - p.x, dy = b.y - p.y, d2 = dx * dx + dy * dy;
    var hr = b.r + 2.8;
    if (d2 < hr * hr) {
      if (p.inv === 0) { b.dead = true; playerHit(st); }
      continue;
    }
    if (!b.grazed && d2 < gr * gr && p.inv === 0) {
      b.grazed = true;
      st.grazes++;
      addScore(st, 12, true);
      p.bombCharge += 3;
      if (p.bombCharge >= 100) {
        if (p.bombs < p.bombMax) { p.bombs++; p.bombCharge = 0; ev(st, 'bombGained'); }
        else p.bombCharge = 100;
      }
      ev(st, 'graze', { x: b.x, y: b.y });
    }
  }
  compact(eb, function (b) { return !b.dead; });
}

// beam: { x, y, dx, dy, len, w, warn, act, age }
function updateBeams(st) {
  var p = st.player, alive = st.overT === 0;
  for (var i = 0; i < st.beams.length; i++) {
    var bm = st.beams[i];
    bm.age++;
    if (bm.age === bm.warn) ev(st, 'beamFire', { x: bm.x, y: bm.y });
    if (alive && bm.age > bm.warn && bm.age <= bm.warn + bm.act && p.inv === 0) {
      // distance from player to segment
      var px = p.x - bm.x, py = p.y - bm.y;
      var tproj = px * bm.dx + py * bm.dy;
      if (tproj > 0 && tproj < bm.len) {
        var cx = px - bm.dx * tproj, cy = py - bm.dy * tproj;
        if (cx * cx + cy * cy < (bm.w / 2 + 2) * (bm.w / 2 + 2)) playerHit(st);
      }
    }
  }
  compact(st.beams, function (bm) { return bm.age <= bm.warn + bm.act; });
  for (var j = 0; j < st.lanes.length; j++) {
    var ln = st.lanes[j];
    ln.age++;
    if (ln.age === ln.warn) ev(st, 'lightning', { x: ln.x });
    if (alive && ln.age > ln.warn && ln.age <= ln.warn + ln.act && p.inv === 0 && Math.abs(p.x - ln.x) < ln.w / 2) playerHit(st);
  }
  compact(st.lanes, function (ln) { return ln.age <= ln.warn + ln.act; });
}

function updatePickups(st) {
  var p = st.player, mr = 36 + 44 * p.mods.magnet;
  for (var i = 0; i < st.pk.length; i++) {
    var k = st.pk[i];
    k.age++;
    var dx = p.x - k.x, dy = p.y - k.y, d = len(dx, dy);
    if (st.overT === 0 && (d < mr || st.flow === 'bossDead' || st.flow === 'waveClear')) {
      var sp = 6.5;
      k.vx = dx / (d || 1) * sp; k.vy = dy / (d || 1) * sp;
    } else {
      k.vx *= 0.96; k.vy = Math.min(1.6, k.vy + 0.06);
    }
    k.x += k.vx; k.y += k.vy;
    if (d < 16 && st.overT === 0) {
      k.dead = true;
      if (k.kind === 'scrap') { st.scrap++; addScore(st, 10, false); ev(st, 'scrap', { x: k.x, y: k.y }); }
      else if (k.kind === 'bomb') { if (p.bombs < p.bombMax) p.bombs++; ev(st, 'pickup', { x: k.x, y: k.y, kind: 'bomb' }); }
      continue;
    }
    if (k.y > H + 20) k.dead = true;
  }
  compact(st.pk, function (k) { return !k.dead; });
}

function playerHit(st) {
  var p = st.player;
  if (p.inv > 0 || st.overT > 0) return;
  p.hitThisWave = true;
  if (st.testGod) { p.inv = 30; return; } // test harness only; never set by replays
  if (st.chain >= 12) ev(st, 'chainLost', { chain: st.chain });
  st.chain = 0; st.chainT = 0;
  var clearR;
  if (p.shield > 0) {
    p.shield--; p.inv = 90; clearR = 90;
    ev(st, 'shieldBreak', { x: p.x, y: p.y });
  } else {
    p.lives--; p.inv = 150; clearR = 150;
    ev(st, 'playerHit', { x: p.x, y: p.y, lives: p.lives });
    if (p.lives <= 0) {
      st.overT = 100;
      ev(st, 'playerDie', { x: p.x, y: p.y });
    }
  }
  compact(st.eb, function (b) { var dx = b.x - p.x, dy = b.y - p.y; return dx * dx + dy * dy > clearR * clearR; });
}

// --------------------------------------------------------------------------
// Upgrade cards
// --------------------------------------------------------------------------
function cardInfo(st, id) {
  var p = st.player;
  if (id === 'wlv') return { id: id, kind: 'weapon', title: WEAPON_NAMES[p.weapon] + ' Lv ' + (p.wlv + 1), desc: 'Upgrade your ' + WEAPON_NAMES[p.weapon] + ' to level ' + (p.wlv + 1) + '.' };
  if (id === 'repair') return { id: id, kind: 'repair', title: 'Hull Repair', desc: 'Restore one life.' };
  if (id.indexOf('w_') === 0) {
    var w = id.slice(2);
    var desc = { pulse: 'Focused rapid shots straight ahead.', scatter: 'A wide fan of shots.', lance: 'Heavy bolts that pierce through enemies and shields.', swarm: 'Homing missiles plus a light forward gun.' }[w];
    return { id: id, kind: 'weapon', title: 'Switch: ' + WEAPON_NAMES[w], desc: desc + ' Keeps your level (' + p.wlv + ').' };
  }
  var m = id.slice(2), info = MODULE_INFO[m];
  var have = p.mods[m];
  return { id: id, kind: 'module', title: info[0] + (have ? ' ' + (have + 1) : ''), desc: info[1] };
}

function offerCards(st) {
  var p = st.player, rng = st.rng2;
  var pool = [];
  function addc(id, wgt) { pool.push([id, wgt]); }
  if (p.wlv < 5) addc('wlv', 5);
  for (var i = 0; i < WEAPONS.length; i++) if (WEAPONS[i] !== p.weapon) addc('w_' + WEAPONS[i], 1);
  for (var m in MODULE_MAX) if (p.mods[m] < MODULE_MAX[m]) addc('m_' + m, m === 'drone' || m === 'shield' ? 3 : 2);
  if (p.lives < 5) addc('repair', p.lives <= 1 ? 2.5 : 0.8);
  var picks = [];
  while (picks.length < 3 && pool.length) {
    var total = 0, j;
    for (j = 0; j < pool.length; j++) total += pool[j][1];
    var r = rng() * total;
    for (j = 0; j < pool.length; j++) { r -= pool[j][1]; if (r < 0) break; }
    if (j >= pool.length) j = pool.length - 1;
    picks.push(pool[j][0]);
    pool.splice(j, 1);
  }
  st.phase = 'cards';
  st.cards = picks.map(function (id) { return cardInfo(st, id); });
  ev(st, 'cards');
}

function applyCard(st, id) {
  var p = st.player;
  if (id === 'wlv') { if (p.wlv < 5) p.wlv++; }
  else if (id === 'repair') { if (p.lives < 5) p.lives++; }
  else if (id.indexOf('w_') === 0) { p.weapon = id.slice(2); p.fireT = 0; p.missileT = 0; }
  else {
    var m = id.slice(2);
    if (p.mods[m] < MODULE_MAX[m]) {
      p.mods[m]++;
      if (m === 'shield') p.shield++;
      if (m === 'bomb') { p.bombMax++; p.bombs = Math.min(p.bombMax, p.bombs + 1); }
    }
  }
}

function handleCards(st, cmd) {
  if (cmd < CMD.CARD1 || cmd > CMD.CARD3) return;
  var idx = cmd - CMD.CARD1;
  if (!st.cards || idx >= st.cards.length) return;
  var c = st.cards[idx];
  applyCard(st, c.id);
  ev(st, 'cardPicked', { id: c.id, title: c.title });
  afterCards(st);
}

// --------------------------------------------------------------------------
// Dock (after each boss): spend scrap
// --------------------------------------------------------------------------
function dockItems(st) {
  var p = st.player, s = st.sector + 1;
  var base = [40 + 15 * s, 18 + 6 * s, 45 + 15 * s, 35 + 12 * s];
  var costs = base.map(function (c, i) { var m = c; for (var k = 0; k < st.dockBuys[i]; k++) m = Math.floor(m * 1.5); return m; });
  var moduleLeft = false;
  for (var m in MODULE_MAX) if (p.mods[m] < MODULE_MAX[m]) moduleLeft = true;
  return [
    { title: 'Hull Repair', desc: '+1 life', cost: costs[0], ok: p.lives < 5 },
    { title: 'Nova Bomb', desc: '+1 bomb', cost: costs[1], ok: p.bombs < p.bombMax },
    { title: 'Weapon Tune', desc: WEAPON_NAMES[p.weapon] + ' +1 level', cost: costs[2], ok: p.wlv < 5 },
    { title: 'Module Crate', desc: 'A random module', cost: costs[3], ok: moduleLeft }
  ];
}

function openDock(st) {
  st.phase = 'dock';
  st.dock = dockItems(st);
  ev(st, 'dock');
}

function handleDock(st, cmd) {
  if (cmd === CMD.DOCK_LEAVE) { afterDock(st); return; }
  if (cmd < CMD.DOCK1 || cmd > CMD.DOCK4) return;
  var i = cmd - CMD.DOCK1, item = st.dock[i], p = st.player;
  if (!item || !item.ok || st.scrap < item.cost) return;
  st.scrap -= item.cost;
  st.dockBuys[i]++;
  if (i === 0) p.lives++;
  else if (i === 1) p.bombs++;
  else if (i === 2) p.wlv++;
  else {
    var opts = [];
    for (var m in MODULE_MAX) if (p.mods[m] < MODULE_MAX[m]) opts.push('m_' + m);
    applyCard(st, st.rng2.pick(opts));
    ev(st, 'crate', { id: opts.length ? 'module' : '' });
  }
  ev(st, 'dockBuy', { item: i });
  st.dock = dockItems(st);
}

// --------------------------------------------------------------------------
// State hash (for replay headers and verification)
// --------------------------------------------------------------------------
function stateHash(st) {
  var h = 0x811c9dc5, p = st.player;
  h = hashMix(h, st.frame); h = hashMix(h, st.score); h = hashMix(h, st.scrap);
  h = hashMix(h, p.x); h = hashMix(h, p.y); h = hashMix(h, p.lives);
  h = hashMix(h, st.en.length); h = hashMix(h, st.eb.length);
  for (var i = 0; i < st.en.length; i++) { h = hashMix(h, st.en[i].x); h = hashMix(h, st.en[i].hp); }
  h = hashMix(h, st.rng.state());
  h = hashMix(h, st.rng2.state());
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// Enemy behaviours
// ---------------------------------------------------------------------------

function fireAimed(st, e, speed, kind, spreadN, spreadA) {
  var p = st.player, d = diff(st);
  var a = aimAt(e.x, e.y, p.x, p.y);
  var sp = speed * d.bs;
  spreadN = spreadN || 1;
  for (var i = 0; i < spreadN; i++) {
    var off = spreadN === 1 ? 0 : -spreadA / 2 + spreadA * i / (spreadN - 1);
    var v = rot(a[0], a[1], off);
    ebullet(st, e.x, e.y + e.r * 0.5, v[0] * sp, v[1] * sp, kind);
  }
}

function fireRing(st, x, y, n, speed, offset, kind) {
  var sp = speed * diff(st).bs;
  for (var i = 0; i < n; i++) {
    var v = rot(0, 1, offset + TAU * i / n);
    ebullet(st, x, y, v[0] * sp, v[1] * sp, kind);
  }
}

function fireTimer(st, e, base) {
  // returns true when the enemy should fire; resets the timer
  e.fireT--;
  if (e.fireT > 0) return false;
  var d = diff(st);
  e.fireT = Math.max(12, Math.floor(base / d.fire * (e.elite ? 0.7 : 1)));
  // no firing while above the screen or right at the bottom
  return e.y > 10 && e.y < H - 140;
}

var AI = {
  dart: function (st, e) {
    if (e.age === 1) { e.vy = 1.6; e.vx = 0; }
    e.vy = Math.min(5.2, e.vy + 0.045);
    if (!e.s.shot && e.y > 110 && (st.sector >= 1 || st.wave >= 1 || e.elite || st.loop > 0)) {
      e.s.shot = true; fireAimed(st, e, 2.8, 'orb');
    }
  },
  weaver: function (st, e) {
    if (e.age === 1) e.s.bx = e.x;
    e.y += 1.05;
    e.x = e.s.bx + dsin(e.age * 0.045 + (e.phase || 0)) * 70;
    if (fireTimer(st, e, 110)) fireAimed(st, e, 2.6, 'orb', st.sector >= 2 ? 3 : 1, 0.3);
  },
  swarmer: function (st, e) {
    if (e.age === 1) { e.vx = 2.7 * e.dir; e.vy = 0.2; }
    e.vy = Math.min(3.2, e.vy + 0.028);
    e.vx *= 0.993;
    if (e.elite && fireTimer(st, e, 90)) fireAimed(st, e, 2.6, 'orb');
  },
  gunship: function (st, e) {
    if (e.age === 1) { e.vy = 1.6; e.vx = 0; }
    if (e.age < 1100) {
      if (e.y < e.ty) e.vy = Math.max(0.4, (e.ty - e.y) * 0.04); else { e.vy = 0; if (e.vx === 0) e.vx = e.x < W / 2 ? 0.9 : -0.9; }
      if (e.x < 40 && e.vx < 0 || e.x > W - 40 && e.vx > 0) e.vx = -e.vx;
    } else { e.vy = Math.min(3, e.vy + 0.05); }
    if (fireTimer(st, e, 95)) fireAimed(st, e, 2.8, 'orb', e.elite || st.sector >= 2 ? 5 : 3, e.elite ? 0.75 : 0.5);
  },
  splitter: function (st, e) {
    if (e.age === 1) { e.vy = 0.95; e.s.bx = e.x; }
    e.x = e.s.bx + dsin(e.age * 0.03) * 24;
    if (fireTimer(st, e, 130)) fireAimed(st, e, 2.3, 'big', 2, 0.35);
  },
  minelayer: function (st, e) {
    if (e.age === 1) { e.vx = 1.25 * e.dir; e.vy = 0; }
    if (e.age % Math.max(26, Math.floor(52 / diff(st).fire)) === 0 && e.x > 20 && e.x < W - 20) {
      ebullet(st, e.x, e.y + 10, 0, 0.45, 'mine', { fuse: 110 });
      ev(st, 'mineDrop', { x: e.x, y: e.y });
    }
  },
  bearer: function (st, e) {
    if (e.age === 1) e.vy = 0.8;
    if (e.s.block) e.s.block--;
    if (fireTimer(st, e, 140)) fireRing(st, e.x, e.y, e.elite ? 12 : 8, 2.2, e.age * 0.1, 'orb');
  },
  sniper: function (st, e) {
    if (e.age === 1) e.vy = 1.8;
    if (e.y < e.ty) e.vy = Math.max(0.3, (e.ty - e.y) * 0.05); else e.vy = 0;
    if (e.age > 900) e.vy = -1.5; // retreat upward
    var s = e.s;
    if (s.aim > 0) {
      s.aim--;
      if (s.aim === 0) {
        var sp = 7.2 * diff(st).bs;
        ebullet(st, e.x, e.y, s.ax * sp, s.ay * sp, 'needle');
        if (e.elite) { var v = rot(s.ax, s.ay, 0.15), v2 = rot(s.ax, s.ay, -0.15); ebullet(st, e.x, e.y, v[0] * sp, v[1] * sp, 'needle'); ebullet(st, e.x, e.y, v2[0] * sp, v2[1] * sp, 'needle'); }
        ev(st, 'snipe', { x: e.x, y: e.y });
      }
    } else if (e.vy === 0 && fireTimer(st, e, 150)) {
      var a = aimAt(e.x, e.y, st.player.x, st.player.y);
      s.ax = a[0]; s.ay = a[1]; s.aim = 48;
    }
  },
  carrier: function (st, e) {
    if (e.age === 1) { e.vy = 0.5; e.vx = 0; }
    if (e.y >= 110 && e.age < 1400) { e.vy = 0; if (e.vx === 0) e.vx = 0.4; if (e.x < 70 || e.x > W - 70) e.vx = -e.vx; }
    if (e.age >= 1400) e.vy = 0.8;
    if (e.age % 140 === 70 && e.y > 40) {
      var d1 = spawnEnemy(st, 'dart', e.x - 20, e.y + 10, false), d2 = spawnEnemy(st, 'dart', e.x + 20, e.y + 10, false);
      d1.hazard = d2.hazard = false; d1.minion = d2.minion = true;
      ev(st, 'launch', { x: e.x, y: e.y });
    }
    if (fireTimer(st, e, 200)) fireRing(st, e.x, e.y, e.elite ? 16 : 10, 1.9, e.age * 0.05, 'big');
  },
  turret: function (st, e) {
    if (e.age === 1) e.vy = 0.55;
    e.s.a = (e.s.a || 0) + 0.3;
    var every = Math.max(4, Math.floor(10 / diff(st).fire));
    if (e.y > 20 && e.y < H - 160 && e.age % every === 0) {
      var sp = 2.1 * diff(st).bs;
      var v = rot(0, 1, e.s.a);
      ebullet(st, e.x, e.y, v[0] * sp, v[1] * sp, 'orb');
      if (e.elite) ebullet(st, e.x, e.y, -v[0] * sp, -v[1] * sp, 'orb');
    }
  },
  mirror: function (st, e) {
    if (e.age === 1) { e.vy = 0.7; e.s.bx = e.x; }
    e.x = e.s.bx + dsin(e.age * 0.025) * 40;
    var cyc = e.age % 150;
    e.s.flashing = cyc < 55 && e.y > 0;
    if (fireTimer(st, e, 140)) fireAimed(st, e, 2.4, 'orb', 2, 0.25);
  },
  rock: function (st, e) {
    e.s.rot = (e.s.rot || 0) + (e.spin || 0.02);
    if (st.player.inv === 0 && st.overT === 0 && hitsPlayer(st, e)) { playerHit(st); damageEnemy(st, e, 99, true); }
  },
  pebble: function (st, e) {
    e.s.rot = (e.s.rot || 0) + 0.06;
    if (st.player.inv === 0 && st.overT === 0 && hitsPlayer(st, e)) { playerHit(st); damageEnemy(st, e, 99, true); }
  },
  crystal: function (st, e) {
    e.s.rot = (e.s.rot || 0) + 0.01;
    if (st.player.inv === 0 && st.overT === 0 && hitsPlayer(st, e)) playerHit(st);
  }
};

function hitsPlayer(st, e) {
  var p = st.player, dx = p.x - e.x, dy = p.y - e.y, r = e.r * 0.8 + 3;
  return dx * dx + dy * dy < r * r;
}

function updateEnemies(st) {
  var en = st.en;
  // iterate over a fixed count: enemies spawned this frame start moving next frame
  var n = en.length;
  for (var i = 0; i < n; i++) {
    var e = en[i];
    if (e.dead || e.boss) continue;
    e.age++;
    if (e.flash > 0) e.flash--;
    var ai = AI[e.t];
    if (ai) ai(st, e);
    if (e.dead) continue;
    e.x += e.vx; e.y += e.vy;
    // body collision with the player (non-hazard enemies)
    if (!e.hazard && st.player.inv === 0 && st.overT === 0 && hitsPlayer(st, e)) {
      playerHit(st);
      damageEnemy(st, e, 6, true);
    }
    if (e.y > H + 50 || e.y < -80 && e.age > 200 || e.x < -80 || e.x > W + 80) e.dead = true;
  }
  compact(en, function (e) { return !e.dead || e.boss; });
}

function onEnemyDeath(st, e) {
  var rng = st.rng;
  if (e.t === 'splitter') {
    for (var k = -1; k <= 1; k += 2) {
      var d = spawnEnemy(st, 'dart', e.x + k * 8, e.y, false);
      d.age = 1; d.vx = k * 1.6; d.vy = 1.2;
    }
  } else if (e.t === 'rock') {
    for (var j = -1; j <= 1; j += 2) {
      var pb = spawnEnemy(st, 'pebble', e.x + j * 6, e.y, false);
      pb.vx = j * rng.range(0.8, 1.5); pb.vy = e.vy + 0.3;
    }
  }
  if (e.elite && st.sector + st.loop >= 1) fireRing(st, e.x, e.y, 8, 1.8, 0, 'orb');
}

// ---------------------------------------------------------------------------
// Bosses: Warden, Hive Mother, Twin Lancers, Leviathan, Prism Core, The Signal
// ---------------------------------------------------------------------------

function bossPart(st, x, y, r, hp, extra) {
  var e = {
    id: st.nextId++, t: 'boss', boss: true, x: x, y: y, vx: 0, vy: 0, r: r,
    hp: hp, maxHp: hp, age: 0, elite: false, hazard: false, invuln: false,
    fireT: 0, dead: false, dmgMul: 0, flash: 0, s: {}
  };
  if (extra) for (var k in extra) e[k] = extra[k];
  st.en.push(e);
  return e;
}

function startBoss(st) {
  var kind = SECTORS[st.sector].boss, d = diff(st), def = BOSSES[kind];
  var hp = def.hp * d.hp;
  var B = { kind: kind, name: def.name, t: 0, phase: 0, parts: [], hp: 0, maxHp: 0 };
  st.boss = B;
  switch (kind) {
    case 'warden':
      B.parts.push(bossPart(st, W / 2, -60, 34, hp, { hx: W / 2, hy: 130 })); break;
    case 'hive':
      B.parts.push(bossPart(st, W / 2, -70, 40, hp, { hx: W / 2, hy: 140 })); B.open = false; break;
    case 'twins':
      B.parts.push(bossPart(st, 100, -60, 24, hp, { hx: 100, hy: 120, side: -1 }));
      B.parts.push(bossPart(st, 260, -60, 24, hp, { hx: 260, hy: 120, side: 1 }));
      B.enrageT = 0; B.enraged = false; break;
    case 'leviathan':
      B.hist = [];
      for (var i = 0; i < 12; i++) B.parts.push(bossPart(st, W / 2, -40 - i * 16, i === 0 ? 24 : 17 - i * 0.4, hp * (i === 0 ? 3 : 1), { seg: i }));
      break;
    case 'prism':
      B.parts.push(bossPart(st, W / 2, -70, 36, hp, { hx: W / 2, hy: 170 })); B.ang = 0; B.beamsOn = false; B.cycle = 0; B.beamRefs = []; break;
    case 'signal':
      B.parts.push(bossPart(st, W / 2, -80, 44, hp, { hx: W / 2, hy: 150 })); B.a = 0; B.b = 0; break;
  }
  for (var j = 0; j < B.parts.length; j++) B.maxHp += B.parts[j].maxHp;
  B.hp = B.maxHp;
  ev(st, 'bossStart', { boss: kind });
}

function bossHpFrac(B) {
  var hp = 0;
  for (var i = 0; i < B.parts.length; i++) if (!B.parts[i].dead) hp += Math.max(0, B.parts[i].hp);
  B.hp = hp;
  return hp / B.maxHp;
}

function setPhase(st, B, ph) {
  if (B.phase !== ph) { B.phase = ph; ev(st, 'bossPhase', { phase: ph }); }
}

function entryMove(B, e, t) {
  // ease into home position during the first 110 frames
  if (t < 110) { e.x += (e.hx - e.x) * 0.06; e.y += (e.hy - e.y) * 0.06; e.dmgMul = 0; return true; }
  return false;
}

function updateBoss(st) {
  var B = st.boss, t = ++B.t, d = diff(st), p = st.player;
  var every = function (n) { return t % Math.max(3, Math.floor(n / d.fire)) === 0; };
  for (var i = 0; i < B.parts.length; i++) { var q = B.parts[i]; q.age++; if (q.flash > 0) q.flash--; }
  var frac = bossHpFrac(B);
  var e = B.parts[0];

  switch (B.kind) {
    case 'warden': {
      if (entryMove(B, e, t)) break;
      e.dmgMul = 1;
      e.x = e.hx + dsin((t - 110) * 0.012) * 95;
      setPhase(st, B, frac > 0.55 ? 0 : 1);
      if (B.phase === 0) {
        if (every(52)) fireAimed(st, e, 2.8, 'orb', 3, 0.36);
        if (every(140)) fireRing(st, e.x, e.y, 14, 2.0, t * 0.05, 'big');
      } else {
        if (every(6)) {
          B.a = (B.a || 0) + 0.23;
          var v = rot(0, 1, B.a); var sp = 2.4 * d.bs;
          ebullet(st, e.x, e.y, v[0] * sp, v[1] * sp, 'orb');
          ebullet(st, e.x, e.y, -v[0] * sp, -v[1] * sp, 'orb');
        }
        if (every(95)) fireAimed(st, e, 3.0, 'needle', 5, 0.6);
      }
      break;
    }
    case 'hive': {
      if (entryMove(B, e, t)) break;
      e.x = e.hx + dsin((t - 110) * 0.009) * 60;
      setPhase(st, B, frac > 0.5 ? 0 : 1);
      var closedLen = B.phase === 0 ? 240 : 170, openLen = B.phase === 0 ? 150 : 130;
      var c = (t - 110) % (closedLen + openLen);
      var open = c >= closedLen;
      if (open !== B.open) { B.open = open; ev(st, open ? 'coreOpen' : 'coreClose'); }
      e.dmgMul = open ? 1 : 0.12;
      if (!open) {
        if (c % 120 === 20) {
          var left = (c / 120 | 0) % 2 === 0;
          for (var s = 0; s < 6; s++) {
            var sw = spawnEnemy(st, 'swarmer', left ? -16 : W + 16, 80 + s * 4, false);
            sw.dir = left ? 1 : -1; sw.age = 0; sw.fireT = 30 + s * 9;
            sw.x += (left ? -1 : 1) * s * 18; sw.minion = true;
          }
        }
        if (B.phase === 1 && every(70)) fireAimed(st, e, 3.3, 'needle', 3, 0.3);
      } else {
        if (every(42)) fireRing(st, e.x, e.y, 16, 2.1, (c % 2) * 0.2 + t * 0.01, 'orb');
        if (every(80)) fireAimed(st, e, 2.4, 'big', 3, 0.5);
      }
      break;
    }
    case 'twins': {
      var alive = [];
      for (var k = 0; k < B.parts.length; k++) if (!B.parts[k].dead) alive.push(B.parts[k]);
      for (k = 0; k < alive.length; k++) {
        var q2 = alive[k];
        if (entryMove(B, q2, t)) continue;
        q2.dmgMul = 1;
        q2.x = q2.hx + dsin((t - 110) * 0.02 + (q2.side > 0 ? PI : 0)) * 50;
        q2.y = q2.hy + dsin((t - 110) * 0.013) * 30;
        var rate = B.enraged ? 0.55 : 1;
        var off = q2.side > 0 ? 75 : 0;
        var bp = Math.max(40, Math.floor(150 * rate / d.fire));
        if ((t + off) % bp === 0) {
          st.beams.push({ x: p.x, y: q2.y + 10, dx: 0, dy: 1, len: H, w: 24, warn: B.enraged ? 42 : 55, act: 28, age: 0 });
          ev(st, 'beamWarn');
        }
        if ((t + off) % Math.max(20, Math.floor(70 * rate / d.fire)) === 0) fireAimed(st, q2, 2.9, 'orb', 3, 0.3);
      }
      if (alive.length === 1 && t > 110) {
        if (!B.enraged) {
          B.enrageT++;
          if (B.enrageT >= 600) { B.enraged = true; ev(st, 'enrage'); banner(st, 'ENRAGED', 'Too slow', 90); }
        }
      }
      break;
    }
    case 'leviathan': {
      var tt = t;
      var hx = W / 2 + dsin(tt * 0.018) * 130;
      var hy = (t < 110 ? -40 + t * 1.9 : 170) + (t < 110 ? 0 : dsin((tt - 110) * 0.031) * 85);
      B.hist.push(hx, hy);
      if (B.hist.length > 2 * 12 * 9 + 4) B.hist.splice(0, 2);
      var tail = -1;
      for (k = B.parts.length - 1; k >= 0; k--) if (!B.parts[k].dead) { tail = k; break; }
      for (k = 0; k < B.parts.length; k++) {
        var sg = B.parts[k];
        if (sg.dead) continue;
        var idx = B.hist.length - 2 - k * 9 * 2;
        if (idx < 0) idx = 0;
        sg.x = B.hist[idx]; sg.y = B.hist[idx + 1];
        sg.dmgMul = t < 110 ? 0 : (k === tail ? 1 : 0);
        if (t > 110 && k > 0 && (t + k * 23) % Math.max(60, Math.floor(190 / d.fire)) === 0) fireAimed(st, sg, 2.6, 'orb');
      }
      if (t > 110 && !B.parts[0].dead) {
        var head = B.parts[0];
        if (every(110)) fireRing(st, head.x, head.y, tail <= 3 ? 18 : 10, 2.0, t * 0.07, 'orb');
        if (tail <= 3 && every(60)) fireAimed(st, head, 3.2, 'needle', 3, 0.3);
      }
      setPhase(st, B, tail > 6 ? 0 : (tail > 2 ? 1 : 2));
      break;
    }
    case 'prism': {
      if (entryMove(B, e, t)) break;
      e.dmgMul = 1;
      e.x = e.hx + dsin((t - 110) * 0.007) * 50;
      setPhase(st, B, frac > 0.6 ? 0 : (frac > 0.25 ? 1 : 2));
      var nb = 3 + B.phase;
      B.ang += 0.0085 * (B.phase === 2 ? 1.35 : 1);
      B.cycle++;
      if (!B.beamsOn && B.cycle >= 150) {
        B.beamsOn = true; B.cycle = 0; B.beamRefs = [];
        for (k = 0; k < nb; k++) {
          var bm = { x: e.x, y: e.y, dx: 0, dy: 1, len: 900, w: 14, warn: 60, act: 380, age: 0, k: k, n: nb };
          st.beams.push(bm); B.beamRefs.push(bm);
        }
        ev(st, 'beamWarn');
      } else if (B.beamsOn && B.cycle >= 440) {
        B.beamsOn = false; B.cycle = 0; B.beamRefs = [];
      }
      for (k = 0; k < B.beamRefs.length; k++) {
        var br = B.beamRefs[k];
        var v2 = rot(0, 1, B.ang + TAU * br.k / br.n);
        br.x = e.x; br.y = e.y; br.dx = v2[0]; br.dy = v2[1];
      }
      if (B.beamsOn) { if (every(75)) fireRing(st, e.x, e.y, 10, 1.7, t * 0.03, 'orb'); }
      else {
        if (every(24)) fireAimed(st, e, 3.0, 'orb', 5, 0.8);
        if (every(60)) fireRing(st, e.x, e.y, 20, 2.2, t * 0.02, 'big');
      }
      break;
    }
    case 'signal': {
      if (entryMove(B, e, t)) break;
      e.dmgMul = 1;
      setPhase(st, B, frac > 0.66 ? 0 : (frac > 0.33 ? 1 : 2));
      if (B.phase === 0) {
        e.x = e.hx + dsin((t - 110) * 0.01) * 70;
        if (every(5)) {
          B.a += 0.17;
          for (k = 0; k < 3; k++) { var v3 = rot(0, 1, B.a + TAU * k / 3), sp3 = 2.2 * d.bs; ebullet(st, e.x, e.y, v3[0] * sp3, v3[1] * sp3, 'orb'); }
        }
        if (every(120)) fireAimed(st, e, 3.6, 'needle', 3, 0.25);
      } else if (B.phase === 1) {
        e.x = e.hx + dsin((t - 110) * 0.014) * 100;
        var minions = 0;
        for (k = 0; k < st.en.length; k++) if (st.en[k].minion && !st.en[k].dead) minions++;
        if (t % 400 === 0 && minions < 3) {
          var m1 = spawnEnemy(st, 'gunship', 60, -24, true); m1.ty = 110; m1.minion = true;
          var m2 = spawnEnemy(st, 'sniper', W - 60, -24, true); m2.ty = 90; m2.minion = true;
        }
        if (every(160)) { st.beams.push({ x: p.x, y: e.y + 20, dx: 0, dy: 1, len: H, w: 26, warn: 50, act: 26, age: 0 }); ev(st, 'beamWarn'); }
        if (every(90)) fireRing(st, e.x, e.y, 20, 2.1, t * 0.05, 'orb');
      } else {
        e.x = e.hx + dsin((t - 110) * 0.02) * 110;
        e.y = e.hy + dsin((t - 110) * 0.017) * 40;
        if (every(4)) {
          B.a += 0.2; B.b -= 0.23;
          var sp4 = 2.6 * d.bs, va = rot(0, 1, B.a), vb = rot(0, 1, B.b);
          ebullet(st, e.x, e.y, va[0] * sp4, va[1] * sp4, 'orb');
          ebullet(st, e.x, e.y, vb[0] * sp4, vb[1] * sp4, 'shard');
        }
        if (every(150)) fireRing(st, e.x, e.y, 24, 1.8, t * 0.01, 'big');
      }
      break;
    }
  }
  // boss body contact
  if (st.overT === 0 && p.inv === 0) {
    for (i = 0; i < B.parts.length; i++) if (!B.parts[i].dead && hitsPlayer(st, B.parts[i])) { playerHit(st); break; }
  }
}

function bossPartKilled(st, e) {
  var B = st.boss;
  if (!B) return;
  ev(st, 'bossPartDown', { x: e.x, y: e.y, r: e.r });
  addScore(st, 400 * (st.sector + 1), true);
  var allDead = true;
  if (B.kind === 'leviathan') allDead = B.parts[0].dead;
  else for (var i = 0; i < B.parts.length; i++) if (!B.parts[i].dead) allDead = false;
  if (B.kind === 'leviathan' && e.seg === 0) {
    for (var j = 0; j < B.parts.length; j++) if (!B.parts[j].dead) { B.parts[j].dead = true; ev(st, 'bossPartDown', { x: B.parts[j].x, y: B.parts[j].y, r: B.parts[j].r }); }
  }
  if (B.kind === 'twins' && !allDead && !B.enraged) B.enrageT = 0;
  if (!allDead) return;
  // defeated
  var s = st.sector + 1;
  var base = addScore(st, 5000 * s, false);
  var timeBonus = addScore(st, Math.max(0, 3600 - B.t) * 2 * s, false);
  st.bossTimes.push(B.t);
  st.eb.length = 0; st.beams.length = 0;
  for (var k = 0; k < st.en.length; k++) if (st.en[k].minion) st.en[k].dead = true;
  for (var n = 0; n < 24; n++) dropPickup(st, e.x, e.y, 'scrap');
  ev(st, 'bossDead', { x: e.x, y: e.y, boss: B.kind, bonus: base + timeBonus });
  banner(st, B.name.toUpperCase() + ' DESTROYED', '+' + (base + timeBonus), 150);
  st.boss = null;
  st.player.inv = Math.max(st.player.inv, 60);
}

// ---------------------------------------------------------------------------
// Replays: every step's input is recorded; changes are stored as
//   varint((frameDelta << 1) | hasCmd), byte((ax+4) | (ay+4) << 4), [byte cmd]
// then compressed with deflate-raw. A 32-byte header carries the run summary.
// ---------------------------------------------------------------------------

var REPLAY_MAGIC = [65, 66, 51]; // "AB3"
var REPLAY_FORMAT = 2;
// Header (little endian):
//  0-2 "AB3" | 3 format | 4-23 pilot hash160 | 24 pilot address version | 25 mode
//  26-27 engine | 28-31 seed | 32-35 period | 36-39 frames | 40-47 score (f64) | 48-51 state hash
// Bytes 4-23 sit at a fixed offset so the leaderboard contract can require
// them to equal the submitting wallet's hash160.
var REPLAY_HEADER = 52;
var REPLAY_MAX_BYTES = 65536;
var REPLAY_MAX_FRAMES = 60 * 60 * 60 * 3; // 3 hours

function Recorder() {
  this.bytes = [];
  this.frames = 0;
  this.lastFrame = 0;
  this.pax = 0; this.pay = 0;
}
Recorder.prototype.push = function (input) {
  var ax = clamp(input.ax | 0, -4, 4), ay = clamp(input.ay | 0, -4, 4), cmd = (input.cmd | 0) & 255;
  var f = this.frames++;
  if (ax === this.pax && ay === this.pay && cmd === 0) return;
  var delta = f - this.lastFrame;
  this.lastFrame = f;
  writeVarint(this.bytes, delta * 2 + (cmd ? 1 : 0));
  this.bytes.push(((ax + 4) & 15) | (((ay + 4) & 15) << 4));
  if (cmd) this.bytes.push(cmd & 255);
  this.pax = ax; this.pay = ay;
};

function writeVarint(out, v) {
  while (v >= 128) { out.push((v & 127) | 128); v = Math.floor(v / 128); }
  out.push(v);
}

// Iterates the per-frame inputs of an uncompressed event stream.
function InputReader(body, frames) {
  this.b = body; this.i = 0; this.frames = frames;
  this.f = 0; this.next = -1; this.ax = 0; this.ay = 0; this.pending = null;
  this._read();
}
InputReader.prototype._read = function () {
  if (this.i >= this.b.length) { this.next = -1; return; }
  var v = 0, mul = 1, byte;
  do { byte = this.b[this.i++]; v += (byte & 127) * mul; mul *= 128; } while (byte & 128);
  var hasCmd = v % 2, delta = (v - hasCmd) / 2;
  var packed = this.b[this.i++];
  var rec = { ax: (packed & 15) - 4, ay: ((packed >> 4) & 15) - 4, cmd: hasCmd ? this.b[this.i++] : 0 };
  this.next = (this.pending ? this.pending.at : 0) + delta;
  rec.at = this.next;
  this.pending = rec;
};
InputReader.prototype.nextInput = function () {
  var cmd = 0;
  if (this.pending && this.next === this.f) {
    this.ax = this.pending.ax; this.ay = this.pending.ay; cmd = this.pending.cmd;
    var at = this.pending.at;
    if (this.i < this.b.length) { this._read(); } else { this.pending = null; this.next = -1; }
    void at;
  }
  this.f++;
  return { ax: this.ax, ay: this.ay, cmd: cmd };
};

function writeHeader(st, frames) {
  var h = new Uint8Array(REPLAY_HEADER), dv = new DataView(h.buffer);
  h[0] = REPLAY_MAGIC[0]; h[1] = REPLAY_MAGIC[1]; h[2] = REPLAY_MAGIC[2];
  h[3] = REPLAY_FORMAT;
  h.set(st.pilot, 4);
  h[24] = st.pilotVersion;
  h[25] = st.mode;
  dv.setUint16(26, ENGINE_VERSION, true);
  dv.setUint32(28, st.seed >>> 0, true);
  dv.setUint32(32, st.period >>> 0, true);
  dv.setUint32(36, frames >>> 0, true);
  dv.setFloat64(40, st.score, true);
  dv.setUint32(48, stateHash(st), true);
  return h;
}

function readHeader(bytes) {
  if (!bytes || bytes.length < REPLAY_HEADER) throw new Error('Replay too short');
  if (bytes[0] !== 65 || bytes[1] !== 66 || bytes[2] !== 51) throw new Error('Not an Astro Blaster 3 replay');
  if (bytes[3] !== REPLAY_FORMAT) throw new Error('Unsupported replay format ' + bytes[3]);
  var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    format: bytes[3], pilot: bytes.slice(4, 24), pilotVersion: bytes[24], mode: bytes[25],
    engine: dv.getUint16(26, true), seed: dv.getUint32(28, true), period: dv.getUint32(32, true),
    frames: dv.getUint32(36, true), score: dv.getFloat64(40, true), hash: dv.getUint32(48, true)
  };
}

function streamBytes(bytes, format) {
  var cs = format === 'compress' ? new CompressionStream('deflate-raw') : new DecompressionStream('deflate-raw');
  var blobStream = new Blob([bytes]).stream().pipeThrough(cs);
  return new Response(blobStream).arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
}

// Returns a Promise<Uint8Array> of the full replay.
function encodeReplay(st, recorder) {
  var header = writeHeader(st, recorder.frames);
  return streamBytes(new Uint8Array(recorder.bytes), 'compress').then(function (body) {
    var out = new Uint8Array(header.length + body.length);
    out.set(header, 0); out.set(body, header.length);
    return out;
  });
}

function decodeReplay(bytes) {
  var h = readHeader(bytes);
  return streamBytes(bytes.subarray(REPLAY_HEADER), 'decompress').then(function (body) {
    return { header: h, body: body };
  });
}

// Creates the game a replay describes plus a reader for its inputs.
function replaySession(decoded) {
  var h = decoded.header;
  var st = createGame({ mode: h.mode, seed: h.seed, period: h.period, pilot: h.pilot, pilotVersion: h.pilotVersion });
  return { st: st, reader: new InputReader(decoded.body, h.frames), header: h };
}

function samePilot(a, b) {
  if (!a || !b || a.length !== 20 || b.length !== 20) return false;
  for (var i = 0; i < 20; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Full headless verification. Resolves to { ok, score, frames, header, reason }.
// opts: { score, period, mode, pilot (Uint8Array 20), chunk (frames per slice; yields between slices) }
function verifyReplay(bytes, opts) {
  opts = opts || {};
  return decodeReplay(bytes).then(function (dec) {
    var h = dec.header;
    var fail = function (reason) { return { ok: false, reason: reason, header: h, score: null, frames: h.frames }; };
    if (h.engine !== ENGINE_VERSION) return fail('engine version ' + h.engine + ' (this engine is ' + ENGINE_VERSION + ')');
    if (h.frames < 1 || h.frames > REPLAY_MAX_FRAMES) return fail('run length out of range');
    if (opts.mode != null && h.mode !== opts.mode) return fail('mode mismatch');
    if (h.mode === MODE_DAILY && opts.period != null && h.period !== opts.period) return fail('daily period mismatch');
    if (opts.pilot && !samePilot(opts.pilot, h.pilot)) return fail('flown by a different wallet');
    var s = replaySession(dec);
    var f = 0, chunk = opts.chunk || 0;
    function run() {
      var end = chunk ? Math.min(h.frames, f + chunk) : h.frames;
      for (; f < end; f++) {
        if (s.st.phase === 'over') return fail('input continues after game over');
        step(s.st, s.reader.nextInput());
      }
      if (f < h.frames) return new Promise(function (res) { setTimeout(res, 0); }).then(run);
      var score = s.st.score, hash = stateHash(s.st);
      var ok = score === h.score && hash === h.hash && (opts.score == null || opts.score === score);
      return {
        ok: ok, score: score, frames: h.frames, header: h, over: s.st.phase === 'over',
        reason: ok ? '' : (score !== h.score ? 'score mismatch' : (hash !== h.hash ? 'state mismatch' : 'claimed score mismatch'))
      };
    }
    return run();
  });
}

function toBase64Url(bytes) {
  var s = '';
  for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  var bin = atob(str), out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------------------------------------------------------------------------
// Autopilot: used by the test harness and the title-screen attract mode.
// It only reads state and returns an input; it never changes the sim.
// ---------------------------------------------------------------------------

function botInput(st, opts) {
  opts = opts || {};
  var p = st.player;
  if (st.phase === 'cards') {
    var pref = ['repair', 'wlv', 'm_drone', 'm_shield', 'm_over', 'm_bomb', 'm_after', 'm_graze', 'm_chain', 'm_magnet'];
    var best = 0, bestScore = 999;
    for (var i = 0; i < st.cards.length; i++) {
      var id = st.cards[i].id;
      var sc = pref.indexOf(id); if (id === 'repair' && p.lives > 2) sc = 50;
      if (sc < 0) sc = id.indexOf('w_') === 0 ? (opts.weapon && id === 'w_' + opts.weapon ? -1 : 60) : 40;
      if (sc < bestScore) { bestScore = sc; best = i; }
    }
    return { ax: 0, ay: 0, cmd: CMD.CARD1 + best };
  }
  if (st.phase === 'dock') {
    var order = [p.lives < 4 ? 0 : -1, 2, 3, 1, 0];
    for (var o = 0; o < order.length; o++) {
      var k = order[o]; if (k < 0) continue;
      var it = st.dock[k];
      if (it && it.ok && st.scrap >= it.cost) return { ax: 0, ay: 0, cmd: CMD.DOCK1 + k };
    }
    return { ax: 0, ay: 0, cmd: CMD.DOCK_LEAVE };
  }
  if (st.phase !== 'play' || st.overT > 0) return { ax: 0, ay: 0, cmd: 0 };

  var sp = 3.4; for (var a = 0; a < p.mods.after; a++) sp *= 1.12;
  // target: line up under the nearest threat, stay low
  var tx = W / 2, ty = H - 130, bestD = 1e9;
  for (var e = 0; e < st.en.length; e++) {
    var en = st.en[e];
    if (en.dead || en.hazard || en.y < 0 || en.dmgMul === 0) continue;
    var dd = Math.abs(en.x - p.x) + Math.max(0, en.y - 300);
    if (dd < bestD) { bestD = dd; tx = en.x; }
  }
  var near = [];
  for (var b = 0; b < st.eb.length; b++) {
    var bl = st.eb[b];
    if (Math.abs(bl.x - p.x) < 170 && Math.abs(bl.y - p.y) < 190) near.push(bl);
  }
  var bodies = [];
  for (e = 0; e < st.en.length; e++) {
    var q = st.en[e];
    if (!q.dead && Math.abs(q.x - p.x) < 150 && Math.abs(q.y - p.y) < 190) bodies.push(q);
  }
  var bestC = null, bestCost = 1e18, hardest = 0;
  for (var cx = -4; cx <= 4; cx += 4) {
    for (var cy = -4; cy <= 4; cy += 4) {
      var vx = cx / 4 * sp, vy = cy / 4 * sp;
      if (cx !== 0 && cy !== 0) { vx *= 0.7071; vy *= 0.7071; }
      var cost = 0, danger = 0;
      for (var kk = 1; kk <= 4; kk++) {
        var t = kk * 3;
        var px = clamp(p.x + vx * t, 12, W - 12), py = clamp(p.y + vy * t, 70, H - 24);
        for (b = 0; b < near.length; b++) {
          var nb = near[b];
          var bx = nb.x + nb.vx * t, by = nb.y + nb.vy * t;
          var dx = bx - px, dy = by - py, d2 = dx * dx + dy * dy;
          var hr = nb.r + 7;
          if (d2 < hr * hr) danger += (5 - kk) * 1000;
          else if (d2 < 1600) cost += 60 / d2 * (5 - kk);
        }
        for (b = 0; b < bodies.length; b++) {
          var bo = bodies[b];
          var ex = bo.x + bo.vx * t, ey = bo.y + bo.vy * t, rr = bo.r + 10;
          var ddx = ex - px, ddy = ey - py;
          if (ddx * ddx + ddy * ddy < rr * rr) danger += (5 - kk) * 800;
        }
        for (b = 0; b < st.beams.length; b++) {
          var bm = st.beams[b];
          if (bm.age + t < bm.warn - 2 || bm.age + t > bm.warn + bm.act) continue;
          var qx = px - bm.x, qy = py - bm.y, tp = qx * bm.dx + qy * bm.dy;
          if (tp > 0) { var ox = qx - bm.dx * tp, oy = qy - bm.dy * tp; if (ox * ox + oy * oy < (bm.w / 2 + 10) * (bm.w / 2 + 10)) danger += 900; }
        }
        for (b = 0; b < st.lanes.length; b++) {
          var ln = st.lanes[b];
          if (ln.age + t >= ln.warn - 4 && Math.abs(px - ln.x) < ln.w / 2 + 8) danger += 900;
        }
      }
      var fx = clamp(p.x + vx * 6, 12, W - 12), fy = clamp(p.y + vy * 6, 70, H - 24);
      cost += Math.abs(fx - tx) * 0.03 + Math.abs(fy - ty) * 0.02 + danger;
      if (fy < 250) cost += (250 - fy) * 0.2;
      if (cost < bestCost) { bestCost = cost; bestC = [cx, cy]; hardest = danger; }
    }
  }
  var cmd = 0;
  if (hardest >= 3000 && p.inv === 0 && p.bombs > 0 && !opts.noBomb) cmd = CMD.BOMB;
  return { ax: bestC[0], ay: bestC[1], cmd: cmd };
}

root.AB3 = {ENGINE_VERSION, W, H, TAU, dsin, dcos, makeRng, fnv1a, dailySeed, SECTORS, ENEMIES, WEAPONS, WEAPON_NAMES, MODULE_MAX, MODULE_INFO, BOSSES, CMD, MODE_CAMPAIGN, MODE_DAILY, createGame, step, stateHash, diff, chainMult, loopMult, grazeRadius, Recorder, InputReader, encodeReplay, decodeReplay, verifyReplay, replaySession, readHeader, toBase64Url, fromBase64Url, REPLAY_MAX_BYTES, REPLAY_HEADER, REPLAY_MAX_FRAMES, botInput};
})(typeof globalThis !== 'undefined' ? globalThis : this);

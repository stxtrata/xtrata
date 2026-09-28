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

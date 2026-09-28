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

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

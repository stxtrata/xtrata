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

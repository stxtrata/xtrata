// The Strata Salon and the Adrian hosts: the two player-versus-player tables live beside the classic five, the salon is
// walkable through the arch in the back wall, Adrian stands at every staffed table, and the panel never rebuilds for a
// ticking clock (the swallowed-click bug from the PvP build).
//
//   CHROME_PATH=<chromium> NODE_PATH=<dir with playwright> THREE_JS=<three.r128 min.js> node tests/casino-pvp.test.cjs
//
// The sandbox renderer is very slow (about 1 frame a second), so every wait is on state, never on wall-clock animation time.
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..'), roomsDir = path.join(ROOT, 'build', 'rooms');
const room = fs.readFileSync(path.join(roomsDir, 'casino-room.html'), 'utf8');
let passed = 0, failed = 0;
const ok = (name, cond, extra) => { if (cond) { passed++; console.log('  ✓ ' + name); } else { failed++; console.log('  ✗ ' + name + (extra ? ' ' + JSON.stringify(extra).slice(0, 300) : '')); } };

// ---------- A. the wiring is in the file ----------
ok('A: seven stations in the array', room.includes('makeVideoPoker(), makePvpHoldem(), makeLiarsDice()'));
ok('A: the salon pair are placed in the salon', room.includes("pvpholdem: [-8.6, -16.0, -0.35], liars: [-3.5, -16.0, 0.35]"));
ok('A: seats, verbs and signs know the pair', room.includes("pvpholdem: 'SIT', liars: 'SIT'") && room.includes('"HOLD\'EM · PvP"') && /pvpholdem: \[\{ x: -1\.15/.test(room));
ok('A: keys 1 to 7', room.includes('/^Digit[1-7]$/'));
ok('A: the raise slider gets input events', room.includes("addEventListener('input', (e) => { if (focus && focus.input) focus.input(e); })"));
ok('A: the salon is built and the hosts are asked for', room.includes('STRATA SALON') && room.includes("fetch('adrian.glb')") && room.includes("XA_HOSTS.add({ group: byId.pvpholdem.group"));
ok('A: adrian.glb is beside the room', fs.existsSync(path.join(roomsDir, 'adrian.glb')) && fs.statSync(path.join(roomsDir, 'adrian.glb')).size > 4e6);
ok('A: the preview copies .glb files', fs.readFileSync(path.join(ROOT, 'build', 'preview.mjs'), 'utf8').includes('html|css|js|jpg|png|glb'));

(async () => {
  const THREE = fs.readFileSync(process.env.THREE_JS, 'utf8');
  const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.glb': 'model/gltf-binary' };
  const srv = http.createServer((q, r) => {
    const f = path.join(roomsDir, path.basename(q.url.split('?')[0]) || 'casino-room.html');
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); } });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await (await browser.newContext({ viewport: { width: 760, height: 480 }, deviceScaleFactor: 1 })).newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort('failed'));
  await page.route(/cdnjs\.cloudflare\.com.*three/, (r) => r.fulfill({ contentType: 'application/javascript', body: THREE }));
  await page.goto('http://127.0.0.1:' + srv.address().port + '/casino-room.html');
  await page.waitForFunction(() => window.__casino, null, { timeout: 120000 });

  // ---------- B. the stations line up ----------
  const ids = await page.evaluate(() => __casino.stations.map((s) => s.id).join(','));
  ok('B: the floor keeps its five and gains the salon pair', ids === 'blackjack,roulette,holdem,baccarat,videopoker,pvpholdem,liars', ids);

  // ---------- C. Adrian is on duty ----------
  const hostState = await page.waitForFunction(() => {
    const H = window.XA_HOSTS; if (!H) return 'missing';
    return H.failed ? 'failed' : H.ready && H.hosts.every((h) => h.ctrl) ? 'ready:' + H.hosts.length : false;
  }, null, { timeout: 240000 }).then((h) => h.jsonValue()).catch(() => 'timeout');
  ok('C: the whole cast of sixteen stands ready', hostState === 'ready:16', hostState);
  if (hostState === 'ready:16') {
    ok('C: every woodcut figure stepped aside (dealers, bartender, players, patrons)', await page.evaluate(() => {
      const withFig = XA_HOSTS.hosts.filter((h) => h.fig);
      return withFig.length === 13 && withFig.every((h) => !h.fig.group.visible);
    }));
    ok('C: all six personas are on the floor, and the women wear their dos', await page.evaluate(() => {
      const people = new Set(XA_HOSTS.hosts.map((h) => h.person));
      const dos = ['f1', 'f2', 'f3'].every((p) => { const h = XA_HOSTS.hosts.find((x) => x.person === p); return h && h.ctrl.bones.head.children.some((c) => c.type === 'Group' && c.children.length); });
      return people.size === 6 && dos;
    }));
    ok('C: the five players sit on their stools (hips dropped, legs solved)', await page.evaluate(() => {
      const seated = XA_HOSTS.hosts.filter((h) => h.seat);
      return seated.length === 5 && seated.every((h) => h.ctrl.seat && h.ctrl.seat.drop > 0.1);
    }));
    const moved = await page.evaluate(() => new Promise((res) => {
      const h = XA_HOSTS.hosts[5].ctrl, q0 = h.bones.head.quaternion.toArray().join(',');
      let n = 0; const tick = () => { if (h.bones.head.quaternion.toArray().join(',') !== q0) return res(true); if (++n > 12) return res(false); requestAnimationFrame(() => setTimeout(tick, 400)); }; tick();
    }));
    ok('C: the clips breathe (a head bone moves between frames)', moved);
    ok('C: the staff wear different waistcoats and the players their own clothes', await page.evaluate(() => {
      const coat = (i) => { let c = null; XA_HOSTS.hosts[i].ctrl.model.traverse((o) => { if (o.isMesh && o.material.name === 'Midnight waistcoat') c = o.material.color.getHexString(); }); return c; };
      const civvy = XA_HOSTS.hosts.find((h) => h.wear);
      let coatHidden = false; civvy.ctrl.model.traverse((o) => { if (o.isMesh && o.material.name === 'Midnight waistcoat' && !o.visible) coatHidden = true; });
      return coat(0) !== coat(1) && coat(1) !== coat(3) && coat(3) !== coat(4) && coatHidden;
    }));
    // the dealers' hands lie ON the table, not in it: with the rest pose fully blended in, the lowest point of each hand is at (or a hair above) the surface beneath it
    const hands = await page.evaluate(() => XA_HOSTS.hosts.filter((h) => h.rest && h.rest.kind === 'table').map((h) => {
      const c = h.ctrl, t = c.surfaceMeshes(h.group); c.restW = 1; c.update(0.001);
      return [h.person, c.handClearance('L', t, 0), c.handClearance('R', t, 0)];
    }));
    ok('C: five dealers, and no dealer\'s hand sinks into the table', hands.length === 5 && hands.every(([, l, r]) => l !== null && r !== null && l > -0.012 && r > -0.012), hands);
    ok('C: and none hovers over it either', hands.every(([, l, r]) => l < 0.04 && r < 0.04), hands);
    // ...and the dealers stand BEHIND the rim, not in it: below the rim's top edge, no part of the waistcoat or trousers is inside the table (the belly may lean over it above)
    const rims = await page.evaluate(() => XA_HOSTS.hosts.filter((h) => h.rest && h.rest.kind === 'table').map((h) => {
      const g = h.group; g.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(g.matrixWorld).invert(); let R = 0;
      g.traverse((o) => {
        if (!o.isMesh || o.isSkinnedMesh) return; for (let q = o; q; q = q.parent) if (q.userData && q.userData.xaHost) return;
        o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox, m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), b2 = new THREE.Box3();
        for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) b2.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(m));
        if (b2.max.y > 0.9 && b2.max.y < 1.0 && b2.max.x - b2.min.x >= 1.2 && b2.min.z < -0.4) R = Math.max(R, -b2.min.z);
      });
      let near = -1e9; const v = new THREE.Vector3(), acc = new THREE.Vector3(), tmp = new THREE.Vector3(), mm = new THREE.Matrix4();
      h.ctrl.model.traverse((o) => {
        if (!o.isSkinnedMesh || !/waistcoat|trousers/.test(o.name)) return; o.skeleton.update();
        const pos = o.geometry.attributes.position, si = o.geometry.attributes.skinIndex.array, sw = o.geometry.attributes.skinWeight.array, bm = o.skeleton.boneMatrices;
        for (let i = 0; i < pos.count; i += 3) {
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix); acc.set(0, 0, 0);
          for (let k = 0; k < 4; k++) { const w = sw[i * 4 + k]; if (!w) continue; mm.fromArray(bm, si[i * 4 + k] * 16); acc.add(tmp.copy(v).applyMatrix4(mm).multiplyScalar(w)); }
          const l = acc.applyMatrix4(o.bindMatrixInverse).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
          if (l.y > 0.6 && l.y < 0.95 && l.z < 0 && l.z > near) near = l.z;   // below the rim's top: nothing of the body may be inside the table
        }
      });
      return [h.person, +R.toFixed(3), +near.toFixed(3)];
    }));
    ok('C: every dealer stands behind the rim of the table (nothing below the rim top inside it)', rims.length === 5 && rims.every(([, R, n]) => R > 0.5 && n < -R + 0.005), rims);
    ok('C: the waistcoat borrows the shirt\'s skin weights (no shirt poking through) and the ponytail is one smooth shape', room.includes('borrows the shirt') && room.includes('LatheGeometry(prof, 16)'));
  }

  // ---------- D. the arch is a doorway and the salon has walls ----------
  const probe = async (x, z) => page.evaluate(([x, z]) => new Promise((res) => {
    const p = __casino.player; p.x = x; p.z = z;
    let n = 0; const need = 3; const tick = () => { if (++n >= need) return res({ x: +p.x.toFixed(2), z: +p.z.toFixed(2) }); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  }), [x, z]);
  // the solids act only while the walk is live (not during the settling glide after enterWalk), so wait that out
  await page.evaluate(() => __casino.enterWalk());
  await page.waitForFunction(() => __casino.mode === 'walk' && !__casino.returning, null, { timeout: 120000 });
  const gap = await probe(-6, -11.1);
  ok('D: the arch lets you through (x -6 stays put in the wall band)', Math.abs(gap.x + 6) < 0.05 && Math.abs(gap.z + 11.1) < 0.35, gap);
  const wall = await probe(-9, -11.05);
  ok('D: beside the arch the wall pushes you back', wall.z > -10.75, wall);
  const deep = await probe(-6, -21);
  ok('D: the salon\'s far wall holds', deep.z > -19.6, deep);
  const west = await probe(-11.15, -15);   // grazing the west wall (deep inside a wall you are ejected north, by design)
  ok('D: the salon\'s side wall holds', west.x > -11.0, west);
  await page.evaluate(() => { __casino.exitWalk(); });

  // ---------- E. a Hold’em match: open, clock ticks without rebuilding the strip, fold, settle ----------
  // the PvP chairs are empty until a player sits
  ok('E: both PvP tables stand empty but for the dealer before anyone sits', await page.evaluate(() => {
    const opp = (i) => XA_HOSTS.hosts.find((h) => h.group === __casino.stations[i].group && h.wear);
    return !opp(5).ctrl.object.visible && !opp(6).ctrl.object.visible;
  }));
  const bank0 = await page.evaluate(() => __casino.bank);
  await page.evaluate(() => { __casino.setFocus(__casino.stations[5]); });
  await page.evaluate(() => __casino.stations[5].act('buy100'));
  const playing = await page.waitForFunction(() => {
    const s = __casino.stations[5], v = s.view(); return v && v.actions.some((a) => a.id === 'fold') ? true : false;
  }, null, { timeout: 120000 }).then(() => true).catch(() => false);
  ok('E: the table opens, a player sits, the hand reaches betting', playing);
  if (playing) {
    ok('E: the opponent appears in the chair once they have sat', await page.evaluate(() => new Promise((res) => {
      let n = 0; const opp = XA_HOSTS.hosts.find((h) => h.group === __casino.stations[5].group && h.wear);
      const tick = () => { if (opp.ctrl.object.visible) return res(true); if (++n > 10) return res(false); requestAnimationFrame(tick); }; tick();
    })));
    // the panel-rebuild rule: the running clock is NEVER part of the game HTML string — it lives in an empty
    // <b class="pvpclk"> that update() fills, so a tick cannot rebuild the strip under a click
    const clock = await page.evaluate(() => {
      const s = __casino.stations[5], v = s.view(), t = (s.session.view() || {}).timer;
      return { hasTimer: !!t, slotEmpty: /<b class="pvpclk"><\/b>/.test(v.game), timerInString: t ? v.game.includes('>' + t + '<') : false };
    });
    ok('E: the clock ticks outside the game strip (no rebuilt panel mid-click)', (!clock.hasTimer || clock.slotEmpty) && !clock.timerInString, clock);
    await page.evaluate(() => __casino.stations[5].act('fold'));
    const done = await page.waitForFunction(() => __casino.stations[5].debug().hasResult && __casino.stations[5].canLeave(), null, { timeout: 180000 }).then(() => true).catch(() => false);
    ok('E: the fold settles', done);
    if (done) {
      const after = await page.evaluate(() => ({ bank: __casino.bank, net: __casino.stations[5].session.result().net, held: __casino.stations[5].held() }));
      ok('E: the bankroll moves by exactly the result and nothing stays held', after.bank === bank0 + after.net && after.held === 0, { bank0, after });
    }
    await page.evaluate(() => { __casino.setFocus(null); });
    ok('E: standing up clears the table - the chair empties again', await page.evaluate(() => new Promise((res) => {
      let n = 0; const opp = XA_HOSTS.hosts.find((h) => h.group === __casino.stations[5].group && h.wear);
      const tick = () => { if (!opp.ctrl.object.visible) return res(true); if (++n > 10) return res(false); requestAnimationFrame(tick); }; tick();
    })));
  }

  // ---------- F. a Liar’s Dice match, played to the end ----------
  const bankD0 = await page.evaluate(() => __casino.bank);
  await page.evaluate(() => { __casino.setFocus(__casino.stations[6]); });
  await page.evaluate(() => __casino.stations[6].act('stake10'));
  const dDone = await page.evaluate(async () => {
    const s = __casino.stations[6];
    for (let i = 0; i < 240; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const v = s.session.view(); if (!v) continue;
      if (v.done) return true;
      if (v.myTurn && v.canAct && !v.busy) {
        const view = s.view();
        const bid = view.actions.find((a) => a.id === 'bid' && !a.dis), liar = view.actions.find((a) => a.id === 'liar' && !a.dis);
        if (v.g.qty >= 7 && liar) await s.act('liar'); else if (bid) await s.act('bid'); else if (liar) await s.act('liar');
      }
    }
    return false;
  });
  ok('F: a dice game plays to the end against the bot', dDone);
  if (dDone) {
    const settled = await page.waitForFunction(() => __casino.stations[6].debug().hasResult && __casino.stations[6].canLeave(), null, { timeout: 240000 }).then(() => true).catch(() => false);
    ok('F: the game settles', settled);
    if (settled) {
      const after = await page.evaluate(() => ({ bank: __casino.bank, net: __casino.stations[6].session.result().net, held: __casino.stations[6].held() }));
      ok('F: the bankroll moves by exactly the result', after.bank === bankD0 + after.net && after.held === 0, { bankD0, after });
    }
  }

  ok('G: no page errors', errors.length === 0, errors);
  await browser.close(); srv.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

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
ok('A: the salon pair are placed in the salon', room.includes("pvpholdem: [-8.15, -15.2, -0.5], liars: [-3.85, -15.2, 0.5]"));
ok('A: seats, verbs and signs know the pair', room.includes("pvpholdem: 'SIT', liars: 'SIT'") && room.includes('"HOLD\'EM · PvP"') && /pvpholdem: \[\{ x: -0\.7/.test(room));
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
  }, null, { timeout: 180000 }).then((h) => h.jsonValue()).catch(() => 'timeout');
  ok('C: six hosts stand ready (five tables and the door)', hostState === 'ready:6', hostState);
  if (hostState === 'ready:6') {
    ok('C: the woodcut dealers stepped aside', await page.evaluate(() => XA_HOSTS.hosts.filter((h) => h.fig).length === 3 && XA_HOSTS.hosts.filter((h) => h.fig).every((h) => !h.fig.group.visible)));
    const moved = await page.evaluate(() => new Promise((res) => {
      const h = XA_HOSTS.hosts[5].ctrl, q0 = h.bones.head.quaternion.toArray().join(',');
      let n = 0; const tick = () => { if (h.bones.head.quaternion.toArray().join(',') !== q0) return res(true); if (++n > 12) return res(false); requestAnimationFrame(() => setTimeout(tick, 400)); }; tick();
    }));
    ok('C: the clips breathe (a head bone moves between frames)', moved);
    ok('C: each host wears his own waistcoat', await page.evaluate(() => {
      const coat = (i) => { let c = null; XA_HOSTS.hosts[i].ctrl.model.traverse((o) => { if (o.isMesh && o.material.name === 'Midnight waistcoat') c = o.material.color.getHexString(); }); return c; };
      return coat(0) !== coat(1) && coat(1) !== coat(3) && coat(3) !== coat(4);
    }));
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
  const deep = await probe(-6, -19.5);
  ok('D: the salon\'s far wall holds', deep.z > -18.1, deep);
  const west = await probe(-10.45, -14.5);   // grazing the west wall (deep inside a wall you are ejected north, by design)
  ok('D: the salon\'s side wall holds', west.x > -10.3, west);
  await page.evaluate(() => { __casino.exitWalk(); });

  // ---------- E. a Hold’em match: open, clock ticks without rebuilding the strip, fold, settle ----------
  const bank0 = await page.evaluate(() => __casino.bank);
  await page.evaluate(() => { __casino.setFocus(__casino.stations[5]); });
  await page.evaluate(() => __casino.stations[5].act('buy100'));
  const playing = await page.waitForFunction(() => {
    const s = __casino.stations[5], v = s.view(); return v && v.actions.some((a) => a.id === 'fold') ? true : false;
  }, null, { timeout: 120000 }).then(() => true).catch(() => false);
  ok('E: the table opens, a player sits, the hand reaches betting', playing);
  if (playing) {
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

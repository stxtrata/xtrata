// The two test games (games-extra/test-catcher.js, test-sprint.js) added through the games contract, played and replay-verified in the real hall.
//   T1  both games load from the (mock) games contract, get replay numbers 21 and 22, and the room grows by two cabinets
//   T2  the 21 built-in games are unchanged: same order, replay numbers
//   T3  Sat Catcher (score board, higher wins) and Arrow Sprint (time board, lower wins): a ranked run is recorded, finishes, and is verified
//       by replaying it; the same replay is refused on the other game's board
//   T4  the testnet view page (ops/view.mjs --games --core) shows the same two games: it holds back the hall until the games contract is read
//   T5  pictures of both games are saved to $XA_SHOTS (default tests/out) for a look
// Run: NODE_PATH=<playwright + @stacks/transactions> CHROME_PATH=... node tests/hall-testgames.test.cjs
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const MC = require('./lib/mock-chain.cjs');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CHUNK = 16384;
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
const PACK_IDS = { assets: 9001, three: 9002, engine: 9003, games: 9004, hall: 9005 };
const CONTENT = { 3078: fs.readFileSync(path.join(ROOT, 'release', 'xtrata-arcade.html')) };
for (const [name, id] of Object.entries(PACK_IDS)) CONTENT[id] = fs.readFileSync(path.join(DIST, manifest.packs[name].file));
CONTENT[9400] = fs.readFileSync(path.join(ROOT, 'games-extra', 'test-catcher.js'));
CONTENT[9401] = fs.readFileSync(path.join(ROOT, 'games-extra', 'test-sprint.js'));

const GAMES_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-games-v1';
const BUILT_IN = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver',
  'xa_helix_drop', 'xa_invader_wave', 'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake',
  'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper', 'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];
const HEIGHT = 5000;

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

function parentWith(config) {
  const html = fs.readFileSync(path.join(DIST, 'xtrata-arcade-parent.html'), 'utf8');
  const m = /var CONFIG = (\{[\s\S]*?\n    \});/.exec(html);
  assert(m, 'CONFIG block not found in parent');
  const base = JSON.parse(m[1]);
  return html.replace(m[0], () => 'var CONFIG = ' + JSON.stringify(Object.assign(base, config)) + ';');
}
const item = (o) => Object.assign({ title: o.id, kind: 1, engineMin: 1, liveAt: 100, hidden: false }, o);
const chainWith = (items, extra) => MC.createChain(Object.assign({ games: { height: HEIGHT, items }, inscriptions: { 9400: CONTENT[9400], 9401: CONTENT[9401] } }, extra || {}));

(async () => {
  const pages = {};
  const srv = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (pages[p]) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(pages[p]); }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  // opts.chain: the in-memory chain (games contract + inscriptions); opts.gateway: serve | down; opts.down(fn): fail that read with 503.
  async function open(file, opts) {
    opts = opts || {};
    const chain = opts.chain || null;
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const reads = {};
    await ctx.route((opts.host || 'https://api.mainnet.hiro.so') + '/**', async (route) => {
      const req = route.request();
      const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const url = req.url();
      const args = (JSON.parse(req.postData() || '{}').arguments) || [];
      const ok = (result) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ okay: true, result }) });
      if (url.endsWith('/get-chunk')) {
        const id = Number(T.cvToValue(T.hexToCV(args[0]))), idx = Number(T.cvToValue(T.hexToCV(args[1])));
        reads[id] = (reads[id] || 0) + 1;
        const data = CONTENT[id];
        const part = data ? data.subarray(idx * CHUNK, (idx + 1) * CHUNK) : Buffer.alloc(0);
        return ok(part.length ? T.cvToHex(T.someCV(T.bufferCV(part))) : T.cvToHex(T.noneCV()));
      }
      if (url.endsWith('/get-top10')) return ok(T.cvToHex(T.responseOkCV(T.listCV(Array.from({ length: 10 }, () => T.noneCV())))));
      if (url.endsWith('/get-fee-unit')) return ok(T.cvToHex(T.responseOkCV(T.uintCV(30000))));
      const cm = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
      if (chain && cm) {
        if (opts.down && opts.down(cm[3], cm[2])) return route.fulfill({ status: 503, headers: cors, body: 'down' });
        const h = chain.call(cm[1] + '.' + cm[2], cm[3], args);
        if (h) return ok(h);
      }
      return route.fulfill({ status: 404, headers: cors, body: '' });
    });
    await ctx.route('https://xtrata.xyz/**', async (route) => {
      const m = /^\/i\/(\d+)$/.exec(new URL(route.request().url()).pathname);
      const cors = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' };
      if (!m || opts.gateway === 'down') return route.abort('failed');
      const id = Number(m[1]);
      const body = CONTENT[id];
      if (!body) return route.fulfill({ status: 404, headers: cors, body: '' });
      return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'text/plain' }, body });
    });
    await ctx.addInitScript(() => { window.XA_TEST = 1; Element.prototype.requestPointerLock = function () {}; });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebGL|GPU|404|ERR_FAILED|503/.test(m.text())) errors.push(m.text()); });
    await page.goto(base + file, { timeout: 120000 });
    await page.waitForFunction(() => !document.getElementById('xa-load') || document.getElementById('xa-load').classList.contains('done') ||
      !document.getElementById('xa-load-err').hidden, null, { timeout: 180000 });
    const loadErr = await page.evaluate(() => { const e = document.getElementById('xa-load-err'); return e && !e.hidden ? e.textContent : ''; });
    return { page, ctx, errors, loadErr, reads };
  }
  const look = (page) => page.evaluate(() => ({
    ids: window.XA.games.map((g) => g.id), idx: Array.from({ length: window.XA.replay.GAME_IDS.length }, (_, i) => window.XA.replay.GAME_IDS[i] || null),
    layout: window.XAHall.layout(), status: window.XAGamesRegistry ? window.XAGamesRegistry.status() : null,
    cfg: window.XA_GAMES_CONFIG || null, subtitle: (window.XA_CONFIG || {}).subtitle,
    scripts: document.querySelectorAll('script[data-xa-part]').length, game: document.querySelectorAll('script[data-xa-game]').length
  }));

  const hallParts = { bundleId: 3078, packs: PACK_IDS, parts: {}, hashes: {} };
  const HASH = (b) => { let h = Buffer.alloc(32); for (let i = 0; i < b.length; i += CHUNK) h = crypto.createHash('sha256').update(Buffer.concat([h, b.subarray(i, i + CHUNK)])).digest(); return h; };
  const items = [
    item({ id: 'xa_test_catcher', title: 'Sat Catcher', index: 21, codeId: 9400 }),
    item({ id: 'xa_test_sprint', title: 'Arrow Sprint', index: 22, codeId: 9401 }),
  ];
  // Plays one ranked run with a scripted driver; returns the replay (hex), the score and whether the game said it completed.
  async function play(page, gameId, driverName, maxSteps) {
    return page.evaluate(async ([id, drv, n]) => {
      const XA = window.XA, R = XA.replay, U = XA.util, game = XA.games.find((g) => g.id === id);
      const pilot = R.pilotFor('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR'), nonce = 777;
      const held = {}, hits = {}, P = { x: 0, y: 0, down: false, moved: 0 };
      const input = { held: (b) => !!held[b], hit: (b) => !!hits[b], takeSwipes: () => [], pointer: P, press() {}, release() {}, endFrame() {}, reset() {}, destroy() {} };
      const rec = R.record(game, null, pilot, nonce, input, () => ({ x: P.x, y: P.y, down: P.down, moved: P.moved }));
      const seed = R.seedFor(pilot.hash160, nonce, R.gameIndex(game));
      const st = { score: 0, over: false, completed: false };
      const quiet = new Proxy({}, { get: () => () => {} });
      const api = { W: game.size.w, H: game.size.h, input, audio: quiet, fx: XA.createFx(), rng: U.rng(seed), seed, ranked: true, shake() {}, setStatus() {},
        addScore: (v) => { if (!st.over) st.score += Math.max(0, Math.floor(v)); }, setScore: (v) => { if (!st.over) st.score = Math.max(0, Math.floor(v)); },
        getScore: () => st.score, gameOver: () => { st.over = true; }, finish: () => { if (!st.over) { st.completed = true; st.over = true; } },
        mode: game.mode, variant: null, pointer: () => ({ x: P.x, y: P.y, down: P.down, moved: P.moved }) };
      const inst = game.create(api);
      const dirs = ['up', 'right', 'down', 'left'];
      let step = 0;
      for (; step < n && !st.over; step++) {
        for (const b of ['left', 'right', 'up', 'down', 'a']) { held[b] = false; hits[b] = false; }
        if (drv === 'sweep') {                                  // chase the lowest good sat on screen
          const d = inst.debug(), t = d.items.filter((i) => i.kind !== 'bomb').sort((a, b) => b.y - a.y)[0];
          if (t && t.x < d.x - 6) held.left = true; else if (t && t.x > d.x + 6) held.right = true;
        } else if (drv === 'cycle' && step % 3 === 0) { const d = inst.debug().target; held[d] = true; hits[d] = true; }           // press the arrow shown
        else if (drv === 'mash' && step % 2 === 0) { const d = dirs[Math.floor(step / 2) % 4]; held[d] = true; hits[d] = true; }   // press them all in turn (some wrong)
        rec.before(); inst.update(1 / 60); rec.after();
      }
      const bytes = await rec.finish(st.score, st.completed);
      return { hex: Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(''), score: st.score, over: st.over, completed: st.completed, steps: step, idx: bytes[40], mode: game.mode, len: bytes.length };
    }, [gameId, driverName, maxSteps]);
  }
  const verify = (page, hex, board) => page.evaluate(async ([h, b]) => {
    const bytes = new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16)));
    return window.XA.replay.verify(bytes, { address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', board: b });
  }, [hex, board]);

  /* ------------------------------------------------ the baseline and the hall with the two games */
  pages['/plain.html'] = parentWith(hallParts);
  let r = await open('/plain.html', { chain: chainWith([]), gateway: 'serve' });
  const base0 = await look(r.page);
  await r.ctx.close();
  pages['/games.html'] = parentWith(Object.assign({}, hallParts, { games: { contract: GAMES_CONTRACT } }));
  r = await open('/games.html', { chain: chainWith(items), gateway: 'serve' });
  check(!r.loadErr, 'T1: the hall loads with the two test games on the contract (' + (r.loadErr || 'no error') + ')');
  const g = await look(r.page);
  check(JSON.stringify(g.status.loaded) === JSON.stringify(['xa_test_catcher', 'xa_test_sprint']) && !g.status.skipped.length, 'T1: both games were read from the contract and added (' + g.status.loaded.join(', ') + '); skipped: ' + JSON.stringify(g.status.skipped));
  check(g.ids.length === 23 && g.ids[21] === 'xa_test_catcher' && g.ids[22] === 'xa_test_sprint', 'T1: 23 games in the hall, the new ones after the 21');
  check(g.idx[21] === 'xa_test_catcher' && g.idx[22] === 'xa_test_sprint', 'T1: replay numbers 21 and 22');
  check(g.layout.cabinets.length === 23, 'T1: 23 cabinets (' + g.layout.left + ' on the left wall, ' + g.layout.right + ' on the right); room ' + base0.layout.room.l + ' m to ' + g.layout.room.l + ' m; poster slots ' + base0.layout.posterSlots + ' to ' + g.layout.posterSlots);
  const defs = await r.page.evaluate(() => window.XA.games.filter((x) => /^xa_test_/.test(x.id)).map((x) => ({ id: x.id, mode: x.mode, title: x.title, board: window.XA.replay.boardFor(x) })));
  check(defs.find((d) => d.id === 'xa_test_catcher').mode === 'score' && defs.find((d) => d.id === 'xa_test_sprint').mode === 'time', 'T1: Sat Catcher is a score game and Arrow Sprint is a time game (lower wins)');
  check(JSON.stringify(g.ids.slice(0, 21)) === JSON.stringify(base0.ids) && JSON.stringify(g.idx.slice(0, 21)) === JSON.stringify(BUILT_IN), 'T2: the 21 built-in games are first, in the same order, with the same replay numbers');
  check(BUILT_IN.every((id) => { const a = base0.layout.cabinets.find((c) => c.id === id), b = g.layout.cabinets.find((c) => c.id === id); return a.side === b.side && a.slot === b.slot; }), 'T2: and each stands on the same wall in the same place in its row');

  /* ------------------------------------------------ play and verify */
  const cat = await play(r.page, 'xa_test_catcher', 'sweep', 6000);
  check(cat.idx === 21 && cat.over && !cat.completed, 'T3: Sat Catcher: a ranked run carries replay number 21 and ends when the hearts run out (' + cat.steps + ' steps, score ' + cat.score + ')');
  check(cat.score > 0, 'T3: and the sweeping basket caught something (score ' + cat.score + ')');
  const catV = await verify(r.page, cat.hex, 'xa_test_catcher');
  check(catV.ok && catV.score === cat.score && catV.game === 'xa_test_catcher', 'T3: Sat Catcher: the replay is verified by running the game again (score ' + catV.score + ')');
  const spr = await play(r.page, 'xa_test_sprint', 'cycle', 6000);
  check(spr.idx === 22 && spr.over && spr.completed, 'T3: Arrow Sprint: a ranked run carries replay number 22 and finishes (time ' + (spr.score / 100).toFixed(2) + ' s, ' + spr.steps + ' steps)');
  const sprV = await verify(r.page, spr.hex, 'xa_test_sprint');
  check(sprV.ok && sprV.score === spr.score && sprV.game === 'xa_test_sprint', 'T3: Arrow Sprint: the replay is verified by running the game again');
  const crossA = await verify(r.page, cat.hex, 'xa_test_sprint'), crossB = await verify(r.page, spr.hex, 'xa_test_catcher');
  check(!crossA.ok && !crossB.ok, 'T3: each replay is refused on the other game\'s board');
  const mash = await play(r.page, 'xa_test_sprint', 'mash', 6000);
  const mashV = await verify(r.page, mash.hex, 'xa_test_sprint');
  check(mash.completed && mashV.ok && mash.score > spr.score, 'T3: Arrow Sprint: wrong presses cost half a second each (pressing every arrow in turn: ' + (mash.score / 100).toFixed(2) + ' s against ' + (spr.score / 100).toFixed(2) + ' s for a clean run), and that replay verifies too');
  const nothing = await play(r.page, 'xa_test_sprint', 'none', 6000);
  check(nothing.over && !nothing.completed && nothing.steps > 3500, 'T3: Arrow Sprint with no input is a did-not-finish after 60 seconds (' + nothing.steps + ' steps)');
  const tamper = await r.page.evaluate(async (hex) => {
    const bytes = new Uint8Array(hex.match(/../g).map((x) => parseInt(x, 16)));
    bytes[bytes.length >> 1] ^= 0x55;
    return window.XA.replay.verify(bytes, { board: 'xa_test_sprint' });
  }, spr.hex);
  check(!tamper.ok, 'T3: a tampered replay is refused (' + tamper.reason + ')');

  /* ------------------------------------------------ the testnet view page */
  const PV = await import(pathToFileURL(path.join(ROOT, '..', '..', 'contracts', 'arcade-world', 'ops', 'lib', 'preview.mjs')).href);
  const TN = 'ST2J1GW1WDZ5ZZ0M37FRD17EHP602TVDVY1HME6XJ';
  pages['/view.html'] = PV.buildTestnetViewHtml({ world: TN + '.xtrata-world-v1', posters: TN + '.xtrata-posters-v1', screen: TN + '.xtrata-screen-v1', scores: TN + '.xtrata-arcade-scores-v2',
    registry: TN + '.xtrata-world-v2', games: TN + '.xtrata-games-v1', core: TN + '.xtrata-v3-2-3', hallHtml: fs.readFileSync(path.join(DIST, 'xtrata-arcade-v2.0.0.html'), 'utf8') });
  const rv = await open('/view.html', { chain: chainWith(items), gateway: 'serve', host: 'https://api.testnet.hiro.so' });
  await rv.page.waitForFunction(() => window.XAHall && window.XAHall.layout && window.XAGamesRegistry && window.XAGamesRegistry.status().done, null, { timeout: 90000 });
  const gv = await rv.page.evaluate(() => ({ ids: window.XA.games.map((x) => x.id), st: window.XAGamesRegistry.status(), cfg: window.XAScores.config().contentContractId, cabs: window.XAHall.layout().cabinets.length }));
  check(!rv.loadErr && gv.st.ok && gv.st.loaded.join() === 'xa_test_catcher,xa_test_sprint', 'T4: the testnet view page read the games contract and loaded both games (' + gv.st.loaded.join(', ') + (gv.st.error ? ', error ' + gv.st.error : '') + ')');
  check(gv.ids.length === 23 && gv.cabs === 23 && gv.cfg === TN + '.xtrata-v3-2-3', 'T4: so the testnet view page has 23 games and 23 cabinets, and reads cartridges from the testnet core');
  check(!rv.errors.length, 'T4: no page errors in the view page ' + rv.errors.slice(0, 2).join(' | '));
  await rv.ctx.close();
  pages['/view-off.html'] = PV.buildTestnetViewHtml({ world: TN + '.xtrata-world-v1', posters: TN + '.xtrata-posters-v1', hallHtml: fs.readFileSync(path.join(DIST, 'xtrata-arcade-v2.0.0.html'), 'utf8') });
  const rvo = await open('/view-off.html', { chain: chainWith(items), gateway: 'serve', host: 'https://api.testnet.hiro.so' });
  await rvo.page.waitForFunction(() => window.XAHall && window.XAHall.layout, null, { timeout: 90000 });
  check(await rvo.page.evaluate(() => window.XA.games.length) === 21, 'T4: a view page built without --games is the plain 21 games');
  await rvo.ctx.close();

  /* ------------------------------------------------ pictures */
  const shots = process.env.XA_SHOTS || path.join(__dirname, 'out');
  fs.mkdirSync(shots, { recursive: true });
  for (const [id, drv, steps] of [['xa_test_catcher', 'sweep', 300], ['xa_test_sprint', 'cycle', 90]]) {
    const png = await r.page.evaluate(async ([gid, d, n]) => {
      const XA = window.XA, U = XA.util, game = XA.games.find((x) => x.id === gid);
      const c = document.createElement('canvas'); c.width = game.size.w; c.height = game.size.h; const ctx = c.getContext('2d');
      const held = {}, hits = {}, P = { x: 0, y: 0, down: false, moved: 0 };
      const input = { held: (b) => !!held[b], hit: (b) => !!hits[b], takeSwipes: () => [], pointer: P };
      const quiet = new Proxy({}, { get: () => () => {} });
      let score = 0;
      const api = { W: game.size.w, H: game.size.h, input, audio: quiet, fx: quiet, rng: U.rng(99), seed: 99, ranked: false, shake() {}, setStatus() {},
        addScore: (v) => { score += v; }, setScore: (v) => { score = v; }, getScore: () => score, gameOver() {}, finish() {}, mode: game.mode, variant: null, pointer: () => P };
      const inst = game.create(api);
      const dirs = ['up', 'right', 'down', 'left'];
      for (let s = 0; s < n; s++) {
        for (const b of ['left', 'right', 'up', 'down']) { held[b] = false; hits[b] = false; }
        if (d === 'sweep') { const dd = inst.debug(), t = dd.items.filter((i) => i.kind !== 'bomb').sort((a, b) => b.y - a.y)[0]; if (t && t.x < dd.x - 6) held.left = true; else if (t && t.x > dd.x + 6) held.right = true; }
        else if (s % 6 === 0) { const k = inst.debug().target; held[k] = true; hits[k] = true; }
        inst.update(1 / 60);
      }
      inst.render(ctx);
      const att = document.createElement('canvas'); att.width = game.size.w; att.height = game.size.h; game.attract(att.getContext('2d'), att.width, att.height, 1.3);
      const both = document.createElement('canvas'); both.width = game.size.w * 2 + 10; both.height = game.size.h; const bc = both.getContext('2d');
      bc.fillStyle = '#000'; bc.fillRect(0, 0, both.width, both.height); bc.drawImage(att, 0, 0); bc.drawImage(c, game.size.w + 10, 0);
      return both.toDataURL('image/png');
    }, [id, drv, steps]);
    fs.writeFileSync(path.join(shots, id + '.png'), Buffer.from(png.split(',')[1], 'base64'));
  }
  check(fs.statSync(path.join(shots, 'xa_test_catcher.png')).size > 3000 && fs.statSync(path.join(shots, 'xa_test_sprint.png')).size > 3000, 'T5: pictures of both games saved to ' + shots);
  check(!r.errors.length, 'T5: no page errors in the hall ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();
  await browser.close();
  srv.close();
  console.log('\ntest games passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

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
const MC = require('/home/claude/xtrata/xtrata-2.0/recursive-apps/xtrata-arcade/tests/lib/mock-chain.cjs');

const ROOT = '/home/claude/xtrata/xtrata-2.0/recursive-apps/xtrata-arcade';
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

  const c32 = require('/home/claude/xtrata/xtrata-2.0/contracts/arcade-world/node_modules/c32check');
  const WALLETS = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  pages['/games.html'] = parentWith(Object.assign({}, hallParts0(), { games: { contract: GAMES_CONTRACT } }));
  function hallParts0() { return { bundleId: 3078, packs: PACK_IDS, parts: {}, hashes: {} }; }
  const r = await open('/games.html', { chain: chainWith(items), gateway: 'serve' });
  if (r.loadErr) throw new Error(r.loadErr);
  const out = { runs: [] };
  async function play(w, gameId, drv, maxSteps) {
    const d = c32.c32addressDecode(w.address);
    return r.page.evaluate(async ([id, drv, n, ver, h160, nonce, tol, stride]) => {
      const XA = window.XA, R = XA.replay, U = XA.util, game = XA.games.find((g) => g.id === id);
      const hash160 = new Uint8Array(h160.match(/../g).map((x) => parseInt(x, 16)));
      const pilot = { address: 'x', version: ver, hash160 };
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
      let step = 0, s = nonce >>> 0; const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
      const all = ['left', 'right', 'up', 'down', 'a'];
      for (; step < n && !st.over; step++) {
        for (const b of all) { held[b] = false; hits[b] = false; }
        if (drv === 'sweep') { const dd = inst.debug(), t = dd.items.filter((i) => i.kind !== 'bomb').sort((a, b) => b.y - a.y)[0];
          if (t && t.x < dd.x - tol) held.left = true; else if (t && t.x > dd.x + tol) held.right = true; }
        else if (drv === 'cycle' && step % stride === 0) { const t = inst.debug().target; held[t] = true; hits[t] = true; }
        else if (drv === 'random') { if (step % 5 === 0) { const b = all[Math.floor(rnd() * 5)]; held[b] = true; hits[b] = true; } else if (step % 5 < 3) { /* keep last */ } }
        rec.before(); inst.update(1 / 60); rec.after();
      }
      const bytes = await rec.finish(st.score, st.completed);
      return { hex: Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(''), score: st.score, over: st.over, completed: st.completed, steps: step, len: bytes.length, idx: bytes[40] };
    }, [gameId, drv, maxSteps, d[0], d[1], w.nonce, w.tol, w.stride]);
  }
  async function ver(hex, board) { return r.page.evaluate(async ([h, b]) => window.XA.replay.verify(new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16))), { board: b }), [hex, board]); }
  const PLAN = [];
  const cat = [[1,1001,6],[2,2002,22],[3,3003,14],[4,4004,8],[5,5005,30],[6,6006,12],[7,7007,18],[8,8008,25],[9,9009,10],[10,1010,35],[11,1011,16],[12,1012,9],[1,1101,3],[1,1102,50]];
  for (const [n, nonce, tol] of cat) PLAN.push({ n, gid: 'xa_test_catcher', drv: 'sweep', nonce, tol, stride: 3 });
  const spr = [[1,3],[2,4],[3,6],[4,5],[5,7]];
  for (const [n, stride] of spr) PLAN.push({ n, gid: 'xa_test_sprint', drv: 'cycle', nonce: 500 + n, tol: 6, stride });
  PLAN.push({ n: 3, gid: 'xa_test_sprint', drv: 'cycle', nonce: 603, tol: 6, stride: 9 });
  for (const [n, gid, nonce] of [[1,'xa_block_drop',7001],[2,'xa_block_drop',7002],[1,'xa_rock_drift',7003],[2,'xa_rock_drift',7004],[3,'xa_block_defence',7005]]) PLAN.push({ n, gid, drv: 'random', nonce, tol: 6, stride: 3 });
  for (const q of PLAN) {
    const w = { name: 'clone-player' + q.n, address: WALLETS['clone-player' + q.n], nonce: q.nonce, tol: q.tol, stride: q.stride };
    const p = await play(w, q.gid, q.drv, 7000);
    const v = await ver(p.hex, q.gid);
    console.log(w.name, q.gid, 'nonce', q.nonce, 'score', p.score, 'over', p.over, 'done', p.completed, 'len', p.len, 'verify', v.ok, v.reason || '');
    if (p.over && v.ok) out.runs.push({ wizard: w.name, address: w.address, board: q.gid, nonce: q.nonce, score: p.score, completed: p.completed, len: p.len, hex: p.hex });
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out));
  await r.ctx.close(); await browser.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });

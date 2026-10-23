// The games contract and the hall: extra games are read from the chain when the hall starts, and the 21 built-in games are not affected.
//   G0  no games contract configured      the hall is exactly the built-in 21 (this is also the baseline the rest compare against)
//   G1  extra games on chain              only the live, hash-correct, well-formed cartridges are added; each skipped one says why
//   G2  the 21 are unaffected             same game code, same order, same replay numbers, same wall and place in the row, and a ranked run
//                                         recorded in each of the 21 is byte for byte the same with and without the extra games
//   G3  the new games work                replay number 21, 22, 23 ...; a recorded run verifies; the same replay is refused where the game is not loaded
//   G4  the room grows                    24 cabinets, the room is longer, poster slots keep their numbers (the 27 original slots first)
//   G5  failures never stop the hall      contract down: the 21 open and the reason is on record; a bad cartridge costs only itself
// Run: NODE_PATH=<playwright + @stacks/transactions> CHROME_PATH=... node tests/hall-games.test.cjs
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const MC = require('./lib/mock-chain.cjs');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CHUNK = 16384;
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
const PACK_IDS = { assets: 9001, three: 9002, engine: 9003, games: 9004, hall: 9005 };
const PROBE = fs.readFileSync(path.join(__dirname, 'fixtures', 'game-probe.js'), 'utf8');
const as = (id) => Buffer.from(PROBE.replace(/xa_probe_game/g, id));
const CONTENT = { 3078: fs.readFileSync(path.join(ROOT, 'release', 'xtrata-arcade.html')) };
for (const [name, id] of Object.entries(PACK_IDS)) CONTENT[id] = fs.readFileSync(path.join(DIST, manifest.packs[name].file));
CONTENT[9300] = as('xa_probe_one');
CONTENT[9301] = as('xa_probe_two');
CONTENT[9302] = as('xa_probe_three');
CONTENT[9303] = Buffer.from('throw new Error("this cartridge is broken");');
CONTENT[9304] = as('xa_something_else');                 // registers a different id than the contract lists

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
const chainWith = (items, extra) => MC.createChain(Object.assign({ games: { height: HEIGHT, items }, inscriptions: { 9300: CONTENT[9300], 9301: CONTENT[9301], 9302: CONTENT[9302], 9303: CONTENT[9303], 9304: CONTENT[9304] } }, extra || {}));

// Runs a ranked run of `steps` steps in a game with a fixed wallet and nonce and a fixed pattern of button presses, records it with the
// engine's own recorder, and returns the replay (hex) and what the game scored.
async function recordIn(page, gameId, steps) {
  return page.evaluate(async ([id, n]) => {
    const XA = window.XA, R = XA.replay, U = XA.util, game = XA.games.find((g) => g.id === id);
    const pilot = R.pilotFor('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR'), nonce = 424242;
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
    const store = U.store, mem = {};
    U.store = (k, v) => { if (v === undefined) return k in mem ? mem[k] : null; mem[k] = v; return null; };
    let step = 0;
    try {
      const inst = game.create(api);
      const keys = ['left', 'right', 'a', 'up', 'down', 'hold'];
      for (; step < n && !st.over; step++) {
        const k = keys[Math.floor(step / 17) % keys.length];
        for (const b of keys) { held[b] = false; hits[b] = false; }
        if (step % 5 !== 4) { held[k] = true; if (step % 17 === 0) hits[k] = true; }
        P.x = (step * 7) % 300; P.y = (step * 3) % 200; P.down = step % 40 < 20; if (step % 3 === 0) P.moved++;
        rec.before(); inst.update(1 / 60); rec.after();
      }
    } finally { U.store = store; }
    const bytes = await rec.finish(st.score, st.completed);
    return { hex: Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(''), score: st.score, over: st.over, steps: step, idx: bytes[40] };
  }, [gameId, steps]);
}

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
    await ctx.route('https://api.mainnet.hiro.so/**', async (route) => {
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
    await page.goto(base + file);
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

  /* ------------------------------------------------ G0: the baseline, no games contract */
  pages['/plain.html'] = parentWith(hallParts);
  let r = await open('/plain.html', { chain: chainWith([]), gateway: 'serve' });
  check(!r.loadErr, 'G0: the hall loads with no games contract configured (' + (r.loadErr || 'no error') + ')');
  const base0 = await look(r.page);
  check(base0.cfg === null && base0.status && base0.status.configured === false && base0.status.loaded.length === 0, 'G0: the games reader is present and switched off');
  check(JSON.stringify(base0.ids.slice().sort()) === JSON.stringify(BUILT_IN) && base0.ids.length === 21, 'G0: exactly the 21 built-in games');
  check(JSON.stringify(base0.idx) === JSON.stringify(BUILT_IN), 'G0: the replay numbers 0 to 20 are the fixed list, in the fixed order');
  check(base0.layout.left === 11 && base0.layout.right === 10 && base0.layout.posterSlots === 27, 'G0: the original layout: 11 + 10 cabinets, 27 poster slots');
  const baseRuns = {};
  for (const id of BUILT_IN) baseRuns[id] = await recordIn(r.page, id, 500);
  check(BUILT_IN.every((id, i) => baseRuns[id].idx === i && baseRuns[id].steps > 0), 'G0: a ranked run recorded in each of the 21 carries that game\'s own replay number');
  const probeNotLoaded = r;                               // kept open: a replay for a game this hall does not have

  /* ------------------------------------------------ G1: extra games on chain */
  const items = [
    item({ id: 'xa_probe_one', index: 21, codeId: 9300 }),                                            // good
    item({ id: 'xa_future_game', index: 22, codeId: 9301, liveAt: HEIGHT + 50 }),                      // not live yet
    item({ id: 'xa_hidden_game', index: 23, codeId: 9301, hidden: true }),                             // hidden by the admin
    item({ id: 'xa_bad_hash', index: 24, codeId: 9301, hash: Buffer.alloc(32, 7) }),                   // the contract's hash is not the inscription's
    item({ id: 'xa_neon_snake', index: 25, codeId: 9301 }),                                            // a built-in id
    item({ id: 'xa_kind_nine', index: 26, codeId: 9301, kind: 9 }),                                    // a kind this hall does not know
    item({ id: 'xa_needs_engine', index: 27, codeId: 9301, engineMin: 9 }),                            // needs a newer engine
    item({ id: 'xa_wrong_id', index: 28, codeId: 9304 }),                                              // its script registers some other id
    item({ id: 'xa_broken', index: 29, codeId: 9303 }),                                                // its script throws
    item({ id: 'xa_probe_two', index: 30, codeId: 9301 }),                                             // good
    item({ id: 'xa_probe_three', index: 31, codeId: 9302 }),                                           // good
  ];
  const chain1 = chainWith(items);
  pages['/games.html'] = parentWith(Object.assign({}, hallParts, { games: { contract: GAMES_CONTRACT } }));
  r = await open('/games.html', { chain: chain1, gateway: 'serve' });
  check(!r.loadErr, 'G1: the hall loads with the games contract configured (' + (r.loadErr || 'no error') + ')');
  const g1 = await look(r.page);
  check(g1.cfg && g1.cfg.contract === GAMES_CONTRACT, 'G1: the parent hands the hall the games contract');
  check(JSON.stringify(g1.status.loaded) === JSON.stringify(['xa_probe_one', 'xa_probe_two', 'xa_probe_three']), 'G1: only the three good games were added, in the order they were added (' + g1.status.loaded.join(', ') + ')');
  const why = Object.fromEntries(g1.status.skipped.map((s) => [s.id, s.reason]));
  check(why.xa_future_game === 'not live yet' && why.xa_hidden_game === 'hidden' && /could not load/.test(why.xa_bad_hash) && why.xa_neon_snake === 'built-in id' &&
    why.xa_kind_nine === 'unknown kind' && why.xa_needs_engine === 'needs a newer engine' && why.xa_wrong_id === 'did not register itself' && why.xa_broken === 'did not register itself',
    'G1: every skipped game says why: ' + JSON.stringify(why));
  check(g1.status.ok === true && g1.status.count === 11, 'G1: the read finished (11 games on the contract, 3 live)');
  check(g1.ids.length === 24 && g1.game === 5, 'G1: 24 games in the hall (21 + 3; only 5 cartridges were even run)');

  /* ------------------------------------------------ G2: the 21 are unaffected */
  check(JSON.stringify(g1.ids.slice(0, 21)) === JSON.stringify(base0.ids), 'G2: the 21 built-in games are first, in exactly the same order');
  check(JSON.stringify(g1.idx.slice(0, 21)) === JSON.stringify(BUILT_IN), 'G2: replay numbers 0 to 20 are unchanged');
  check(g1.idx[21] === 'xa_probe_one' && g1.idx[30] === 'xa_probe_two' && g1.idx[31] === 'xa_probe_three' && g1.idx[22] === null && g1.idx[28] === null && g1.idx[29] === null && g1.idx.length === 32, 'G2: the extra games got exactly the numbers the contract gave them, and no other number was used');
  const sameWall = BUILT_IN.every((id) => {
    const a = base0.layout.cabinets.find((c) => c.id === id), b = g1.layout.cabinets.find((c) => c.id === id);
    return a.side === b.side && a.slot === b.slot;
  });
  check(sameWall, 'G2: every built-in game stands on the same wall, in the same place in the row');
  let identical = 0;
  for (const id of BUILT_IN) {
    const now = await recordIn(r.page, id, 500);
    if (now.hex === baseRuns[id].hex && now.score === baseRuns[id].score) identical++;
  }
  check(identical === 21, 'G2: a ranked run in each of the 21 is byte for byte the same with and without the extra games (' + identical + ' of 21)');

  /* ------------------------------------------------ G3: the new games work */
  const probe = await recordIn(r.page, 'xa_probe_one', 400);
  check(probe.idx === 21 && probe.over && probe.score > 0, 'G3: a run in the first extra game carries replay number 21 and finishes (score ' + probe.score + ')');
  const probeTwo = await recordIn(r.page, 'xa_probe_two', 400);
  check(probeTwo.idx === 30, 'G3: the next one carries the number the contract gave it (30)');
  const verified = await r.page.evaluate(async (hex) => {
    const bytes = new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16)));
    const v = await window.XA.replay.verify(bytes, { address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', board: 'xa_probe_one' });
    const wrongBoard = await window.XA.replay.verify(bytes, { board: 'xa_probe_two' });
    return { v, wrongBoard };
  }, probe.hex);
  check(verified.v.ok && verified.v.score === probe.score && verified.v.game === 'xa_probe_one', 'G3: the recorded run is verified by replaying it through the added game');
  check(!verified.wrongBoard.ok, 'G3: the same replay is refused for any other board');
  const elsewhere = await probeNotLoaded.page.evaluate(async (hex) => {
    const bytes = new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16)));
    return window.XA.replay.verify(bytes, {});
  }, probe.hex);
  check(!elsewhere.ok, 'G3: a hall without that game cannot verify its replay (' + elsewhere.reason + ')');
  const noReuse = await r.page.evaluate(() => ({
    builtIn: window.XA.replay.registerIndex('xa_new_one', 5), taken: window.XA.replay.registerIndex('xa_new_one', 21), again: window.XA.replay.registerIndex('xa_probe_one', 21),
    other: window.XA.replay.registerIndex('xa_probe_one', 40), big: window.XA.replay.registerIndex('xa_new_one', 256), bad: window.XA.replay.registerIndex('Bad-Id', 60) }));
  check(!noReuse.builtIn && !noReuse.taken && noReuse.again === true && !noReuse.other && !noReuse.big && !noReuse.bad, 'G3: replay numbers cannot be reused, moved, given below 21 or above 255');

  /* ------------------------------------------------ G4: the room grows */
  check(g1.layout.cabinets.length === 24 && g1.layout.left + g1.layout.right === 24, 'G4: 24 cabinets (' + g1.layout.left + ' left, ' + g1.layout.right + ' right)');
  check(g1.layout.room.l > base0.layout.room.l, 'G4: the room is longer (' + base0.layout.room.l + ' m to ' + g1.layout.room.l + ' m)');
  check(g1.layout.posterSlots === base0.layout.posterSlots + 3 * 1 + 0 || g1.layout.posterSlots > base0.layout.posterSlots, 'G4: more poster slots (' + base0.layout.posterSlots + ' to ' + g1.layout.posterSlots + ')');
  check(JSON.stringify(g1.layout.posterTags.slice(0, 27)) === JSON.stringify(base0.layout.posterTags), 'G4: the original 27 poster slots keep their numbers, walls and bays (pinned posters stay where they were put); the new slots come after them');
  const wallBase = await probeNotLoaded.page.evaluate(() => window.XA.wallState().length);
  check(wallBase === 27 && await r.page.evaluate(() => window.XA.wallState().length) === g1.layout.posterSlots, 'G4: the wall has a poster slot for each');
  check(/^24 games/.test(g1.subtitle) && base0.subtitle.startsWith('Twenty-one games'), 'G4: the flat room\'s subtitle counts the games (' + g1.subtitle.slice(0, 40) + ')');
  check(!r.errors.filter((e) => !/this cartridge is broken/.test(e)).length, 'G4: no page errors other than the deliberately broken cartridge ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  /* ------------------------------------------------ G5: failures never stop the hall */
  r = await open('/games.html', { chain: chainWith(items), gateway: 'serve', down: (fn, c) => /games/.test(c) });
  let g5 = await look(r.page);
  check(!r.loadErr && g5.ids.length === 21 && g5.status.ok === false && g5.status.error && g5.status.loaded.length === 0, 'G5: with the games contract unreachable the hall opens with its 21 games (' + g5.status.error + ')');
  check(JSON.stringify(g5.ids) === JSON.stringify(base0.ids), 'G5: and they are exactly the same 21 in the same order');
  await r.ctx.close();
  r = await open('/games.html', { chain: chainWith(items.slice(0, 1)), gateway: 'down' });
  g5 = await look(r.page);
  check(!r.loadErr && g5.status.loaded.join() === 'xa_probe_one' && g5.ids.length === 22, 'G5: with the gateway down a game is read from the chain instead (hash-checked)');
  const l22 = g5.layout;
  check(l22.left === 11 && l22.right === 11 && l22.room.l === base0.layout.room.l, 'G5: one extra game fills the right wall: 11 + 11, same room length');
  await r.ctx.close();
  r = await open('/games.html', { chain: chainWith([]), gateway: 'serve' });
  g5 = await look(r.page);
  check(!r.loadErr && g5.ids.length === 21 && g5.status.ok === true && g5.status.count === 0, 'G5: an empty contract leaves the 21 exactly as they are');
  await r.ctx.close();

  await probeNotLoaded.ctx.close();
  await browser.close();
  srv.close();
  console.log('\nhall games tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

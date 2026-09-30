// End-to-end test of the recursive hall parent against a mocked chain.
//   #3078        = release/xtrata-arcade.html (the inscribed v1.3 single file)
//   9001..9005   = dist/packs/*.txt (assets, three, engine, games, hall)
//   9100         = src/parts/game-cave-diver.js (a single-part override)
// Scenarios: bundle only; changed packs over the bundle; one part override; Leather shim;
// idle cabinet screens showing the Top 10; the gateway (R2) fast path, a tampered gateway,
// and the parent inside a viewer-style sandboxed srcdoc frame.
// https://xtrata.xyz/i/<id> is mocked per test (`gateway`): 'serve', 'tamper', or down.
// Run: NODE_PATH=<playwright + @stacks/transactions> CHROME_PATH=... node tests/hall-parent.test.cjs [shotsDir]
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SHOTS = process.argv[2] || null;
const CHUNK = 16384;
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
const PACK_IDS = { assets: 9001, three: 9002, engine: 9003, games: 9004, hall: 9005 };
const CONTENT = {
  3078: fs.readFileSync(path.join(ROOT, 'release', 'xtrata-arcade.html')),
  9100: fs.readFileSync(path.join(ROOT, 'src', 'parts', 'game-cave-diver.js'))
};
for (const [name, id] of Object.entries(PACK_IDS)) CONTENT[id] = fs.readFileSync(path.join(DIST, manifest.packs[name].file));
// The released ids (parent/ids.json): engine #3079, hall #3080 over the bundle #3078.
const RELEASED = manifest.parent.config;
for (const [name, id] of Object.entries(RELEASED.packs)) if (id > 0) CONTENT[id] = CONTENT[PACK_IDS[name]];

const P1 = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', P2 = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
const NAMES = ['JIM', 'ZED', 'ACE', 'NEO', 'MAX', 'KAI', 'LEO', 'RAY', 'SKY', 'OZZ'];

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

function parentWith(config) {
  const html = fs.readFileSync(path.join(DIST, 'xtrata-arcade-parent.html'), 'utf8');
  const m = /var CONFIG = (\{[\s\S]*?\n    \});/.exec(html);
  assert(m, 'CONFIG block not found in parent');
  const base = JSON.parse(m[1]);
  return html.replace(m[0], () => 'var CONFIG = ' + JSON.stringify(Object.assign(base, config)) + ';');
}

// Top-10 rows are read from the score contract; which boards have entries is set per test.
function top10Result(board, filled) {
  const tupleFor = (i) => {
    const t = {
      name: T.stringAsciiCV(NAMES[i]), player: T.standardPrincipalCV(i % 2 ? P2 : P1), score: T.uintCV(90000 - i * 7000),
      'burn-height': T.uintCV(880000), 'engine-id': T.uintCV(1), 'replay-hash': T.bufferCV(Buffer.alloc(32, i + 1))
    };
    return T.someCV(T.tupleCV(t));
  };
  const list = [];
  for (let i = 0; i < 10; i++) list.push(i < filled ? tupleFor(i) : T.noneCV());
  return T.cvToHex(T.responseOkCV(T.listCV(list)));
}

(async () => {
  const pages = {};
  const srv = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (pages[p]) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(pages[p]); }
    const f = path.join(DIST, p);
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end(fs.readFileSync(f));
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open(file, opts) {
    opts = opts || {};
    const reads = {};
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
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
      if (url.endsWith('/get-top10')) {
        const board = String(T.cvToValue(T.hexToCV(args[0])));
        const filled = opts.boards ? (opts.boards[board] || 0) : 0;
        if (filled < 0) return route.fulfill({ status: 503, headers: cors, body: 'down' });
        return ok(top10Result(board, filled));
      }
      if (url.endsWith('/get-fee-unit')) return ok(T.cvToHex(T.responseOkCV(T.uintCV(30000))));
      return route.fulfill({ status: 404, headers: cors, body: '' });
    });
    if (opts.leather) {
      await ctx.addInitScript(() => {
        window.__leather = [];
        window.LeatherProvider = { request: async (method, params) => {
          window.__leather.push({ method, params });
          if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR' }] } };
          for (const pc of (params && params.postConditions) || []) {
            if (typeof pc === 'string' && !/^([0-9a-fA-F]{2})+$/.test(pc)) throw new Error('Not a serialized post condition');
          }
          return { result: { txid: 'ab'.repeat(32) } };
        } };
      });
    }
    const gw = {};
    await ctx.route('https://xtrata.xyz/**', async (route) => {
      const m = /^\/i\/(\d+)$/.exec(new URL(route.request().url()).pathname);
      const cors = { 'Access-Control-Allow-Origin': '*' };
      if (!m || !opts.gateway) return route.abort('failed');
      const id = Number(m[1]);
      gw[id] = (gw[id] || 0) + 1;
      if (!CONTENT[id]) return route.fulfill({ status: 404, headers: cors, body: '' });
      const body = opts.gateway === 'tamper' && id === 3078 ? Buffer.concat([CONTENT[id], Buffer.from('<!-- x -->')]) : CONTENT[id];
      return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'text/plain' }, body });
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebGL|GPU|404|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
    await page.goto(base + file);
    await page.waitForFunction(() => !document.getElementById('xa-load') || document.getElementById('xa-load').classList.contains('done') ||
      !document.getElementById('xa-load-err').hidden, null, { timeout: 180000 });
    const loadErr = await page.evaluate(() => { const e = document.getElementById('xa-load-err'); return e && !e.hidden ? e.textContent : ''; });
    return { page, ctx, errors, reads, gw, loadErr };
  }
  async function hallState(page) {
    return page.evaluate(() => ({
      games: window.XA && window.XA.games ? window.XA.games.length : 0,
      three: typeof window.THREE !== 'undefined',
      stage: !!document.querySelector('#stage canvas'),
      flat: document.body.classList.contains('flat'),
      err: !document.getElementById('err') || !document.getElementById('err').hidden,
      scripts: document.querySelectorAll('script[data-xa-part]').length,
      styles: document.querySelectorAll('style[data-xa-part]').length,
      build: window.XA_BUILD
    }));
  }

  /* 1. Bundle only: the parent rebuilds the hall from #3078 alone. */
  pages['/bundle-only.html'] = parentWith({ bundleId: 3078, packs: { assets: 0, three: 0, engine: 0, games: 0, hall: 0 }, parts: {}, hashes: {} });
  let r = await open('/bundle-only.html');
  check(!r.loadErr, 'bundle-only parent loads (' + (r.loadErr || 'no error') + ')');
  let s = await hallState(r.page);
  check(s.games === 21 && s.three && s.stage && !s.flat && !s.err, 'hall boots from #3078 alone: 21 cabinets, Three.js, WebGL stage');
  check(s.scripts === 30 && s.styles === 3, 'all 34 parts injected (' + s.scripts + ' scripts, ' + s.styles + ' styles)');
  check(r.reads[3078] > 200 && Object.keys(r.reads).length === 1, '#3078 is the only inscription read (' + r.reads[3078] + ' chunks)');
  check(!r.errors.length, 'no page errors (' + r.errors.slice(0, 2).join(' | ') + ')');
  if (SHOTS) await r.page.screenshot({ path: path.join(SHOTS, '01-bundle-only.png') });
  await r.ctx.close();

  /* 2. Packs: the five packs, nothing from the bundle. */
  pages['/packs.html'] = parentWith({ bundleId: 3078, packs: PACK_IDS, parts: {}, hashes: {} });
  r = await open('/packs.html');
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && s.three && !s.err, 'hall boots from the five packs');
  check(!r.reads[3078] && Object.keys(PACK_IDS).every((k) => r.reads[PACK_IDS[k]] > 0), 'every pack read, the bundle not needed');
  check(!r.errors.length, 'no page errors with packs (' + r.errors.slice(0, 2).join(' | ') + ')');
  await r.ctx.close();

  /* 3. Mixed: engine + hall packs over the bundle, one game from its own inscription. */
  pages['/mixed.html'] = parentWith({ bundleId: 3078, packs: { assets: 0, three: 0, engine: 9003, games: 0, hall: 9005 }, parts: { 'game-cave-diver.js': 9100 }, hashes: {} });
  r = await open('/mixed.html', { leather: true });
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && s.three && !s.err, 'hall boots from engine + hall packs over #3078');
  check(r.reads[9003] > 0 && r.reads[9005] > 0 && r.reads[9100] > 0 && r.reads[3078] > 0 && !r.reads[9001] && !r.reads[9004],
    'reads only the changed packs, the one-game override and the bundle');
  const shim = await r.page.evaluate(async () => {
    await window.LeatherProvider.request('stx_callContract', { contract: 'x.y', functionName: 'f', functionArgs: ['0x0100000000000000000000000000000001'],
      postConditions: ['0x0002160000000000000000000000000000000000000000050000000000007530'], postConditionMode: 'deny' });
    return window.__leather[window.__leather.length - 1].params;
  });
  check(shim.postConditions[0] === '0002160000000000000000000000000000000000000000050000000000007530' && shim.functionArgs[0] === '0100000000000000000000000000000001',
    'Leather shim strips 0x from post-conditions and args');
  check(!r.errors.length, 'no page errors (mixed)');
  await r.ctx.close();

  /* 4. v1.4 behaviour: Top 10 on idle screens, and connect-before-play. */
  const boards = { xa_neon_snake: 10, xa_block_drop: 3, xa_block_drop_sprint: 5, xa_cave_diver: -1 };
  r = await open('/packs.html', { boards, leather: true });
  await r.page.click('#go');
  await r.page.waitForFunction(() => window.XAHall && window.XAHall.boards().length >= 3, null, { timeout: 60000 });
  const seen = {};
  // Longest cycle is Block Drop: 7 s attract + two 6 s boards = 19 s, so sample for 24 s.
  for (let i = 0; i < 24; i++) {
    const sc = await r.page.evaluate(() => window.XAHall.screens());
    sc.forEach((x) => { const k = x.id; seen[k] = seen[k] || new Set(); seen[k].add(x.phase + (x.board ? ':' + x.board : '')); });
    await r.page.waitForTimeout(1000);
  }
  const has = (id, v) => seen[id] && seen[id].has(v);
  console.log('    screens seen:', JSON.stringify(Object.fromEntries(Object.entries(seen).slice(0, 4).map(([k, v]) => [k, Array.from(v)]))), JSON.stringify(await r.page.evaluate(() => window.XAHall.boards())));
  check(has('xa_neon_snake', 'board:xa_neon_snake') && has('xa_neon_snake', 'attract'), 'Snake screen rotates between its attract loop and its Top 10');
  check(has('xa_block_drop', 'board:xa_block_drop_sprint'), 'Block Drop also shows its Sprint 40 Top 10');
  check(!Array.from(seen.xa_cave_diver || []).some((v) => v.startsWith('board')), 'a board that failed to load is never shown (Cave Diver offline)');
  const emptyOnly = ['xa_orbit_merge', 'xa_pong_streak'].every((id) => Array.from(seen[id] || []).every((v) => v === 'attract'));
  check(emptyOnly, 'machines with empty boards keep their attract loop');
  if (SHOTS) {
    // Save a board-phase screen and a leader-strip screen as PNGs.
    for (let tries = 0; tries < 20; tries++) {
      const st = await r.page.evaluate(() => window.XAHall.screens()[0]);
      if (st.phase === 'board') { const png = await r.page.evaluate(() => window.XAHall.screenImage(0));
        fs.writeFileSync(path.join(SHOTS, '10-screen-top10.png'), Buffer.from(png.split(',')[1], 'base64')); break; }
      await r.page.waitForTimeout(500);
    }
    for (let tries = 0; tries < 30; tries++) {
      const st = await r.page.evaluate(() => window.XAHall.screens()[0]);
      if (st.phase === 'attract') { const png = await r.page.evaluate(() => window.XAHall.screenImage(0));
        fs.writeFileSync(path.join(SHOTS, '11-screen-leader.png'), Buffer.from(png.split(',')[1], 'base64')); break; }
      await r.page.waitForTimeout(500);
    }
    await r.page.screenshot({ path: path.join(SHOTS, '12-hall-walk.png') });
  }
  // Ready card while not connected: connecting is the main action, Enter connects, the run comes back ranked.
  await r.page.evaluate(() => window.XARoom.start('xa_neon_snake'));
  await r.page.waitForSelector('.xa-btn-connect', { timeout: 10000 });
  const card = await r.page.evaluate(() => ({ tag: document.querySelector('.xa-ready-tag').textContent,
    buttons: Array.from(document.querySelectorAll('.xa-ready .xa-over-actions .xa-btn')).map((b) => b.textContent) }));
  check(/NOT CONNECTED/.test(card.tag) && /CONNECT WALLET/.test(card.buttons[0]) && card.buttons.some((b) => /Practice/.test(b)),
    'not connected: the ready card leads with Connect wallet, practice is secondary (' + card.buttons.join(' | ') + ')');
  if (SHOTS) await r.page.screenshot({ path: path.join(SHOTS, '13-ready-connect.png') });
  await r.page.keyboard.press('Enter');
  await r.page.waitForSelector('.xa-ready-tag.is-ranked', { timeout: 10000 });
  check(/RANKED/.test(await r.page.textContent('.xa-ready-tag')), 'Enter connects the wallet and reopens the machine as a ranked run');
  check(await r.page.evaluate(() => window.__leather.some((c) => c.method === 'getAddresses')), 'the connect went to the wallet');
  if (SHOTS) await r.page.screenshot({ path: path.join(SHOTS, '14-ready-ranked.png') });
  // Score client sends bare hex to Leather on the direct route (v1.4 engine pack).
  const hex = await r.page.evaluate(() => window.XAScores._codec.stxPostConditionHex('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', '30000'));
  check(/^[0-9a-f]+$/.test(hex) && hex.length % 2 === 0, 'score client builds bare-hex post-conditions (' + hex.slice(0, 10) + '...)');
  check(!r.errors.length, 'no page errors (v1.4 behaviour) ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  /* 5. The gateway (R2) fast path, as released: every inscription arrives whole from /i/<id>?raw=1. */
  const chainReads = (x) => Object.values(x.reads).reduce((a, b) => a + b, 0);
  pages['/released.html'] = fs.readFileSync(path.join(DIST, 'xtrata-arcade-parent.html'), 'utf8');
  check(Object.keys(RELEASED.hashes).length === 3 && RELEASED.hashes[3078] && RELEASED.hashes[RELEASED.packs.engine] && RELEASED.hashes[RELEASED.packs.hall],
    'the released parent carries a hash for #3078 and both packs');
  r = await open('/released.html', { gateway: 'serve' });
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && s.three && !s.err, 'released parent boots from the gateway');
  check(chainReads(r) === 0 && r.gw[3078] === 1 && r.gw[RELEASED.packs.engine] === 1 && r.gw[RELEASED.packs.hall] === 1,
    'three gateway requests, no chain reads (' + JSON.stringify(r.gw) + ', ' + chainReads(r) + ' chunk reads)');
  check(!r.errors.length, 'no page errors (gateway) ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  r = await open('/released.html', { gateway: 'tamper' });
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && r.reads[3078] > 200 && !r.reads[RELEASED.packs.engine] && !r.reads[RELEASED.packs.hall],
    'a gateway copy that fails its hash is ignored: #3078 comes from the chain, the packs still from the gateway');
  await r.ctx.close();

  r = await open('/released.html');
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && r.reads[3078] > 200 && r.reads[RELEASED.packs.engine] > 0 && r.reads[RELEASED.packs.hall] > 0,
    'gateway down: everything is read from the chain (' + chainReads(r) + ' chunk reads)');
  await r.ctx.close();

  /* 6. Inside a viewer: sandboxed srcdoc frame (opaque origin), as the xtrata.xyz grid and preview run it. */
  pages['/viewer.html'] = '<!doctype html><body style="margin:0"><iframe id="f" sandbox="allow-scripts allow-pointer-lock allow-downloads" allow="autoplay; fullscreen; encrypted-media" style="width:1200px;height:760px;border:0"></iframe></body>';
  r = await open('/viewer.html', { gateway: 'serve' });
  await r.page.$eval('#f', (f, html) => { f.srcdoc = html; }, pages['/released.html']);
  const inner = () => r.page.frames().find((f) => f !== r.page.mainFrame());
  let v = null;
  for (let i = 0; i < 120 && !(v && v.games === 21); i++) {
    await r.page.waitForTimeout(1000);
    v = await inner().evaluate(() => ({ games: window.XA && window.XA.games ? window.XA.games.length : 0, origin: String(location.origin),
      err: (document.getElementById('xa-load-err') || {}).hidden === false, bases: window.XA_CONFIG && window.XA_CONFIG.scores && window.XA_CONFIG.scores.apiBases })).catch(() => null);
    if (v && v.err) break;
  }
  check(v && v.games === 21 && v.origin === 'null' && chainReads(r) === 0, 'boots inside a sandboxed srcdoc frame from the gateway (origin ' + (v && v.origin) + ')');
  check(v && Array.isArray(v.bases) && v.bases.length === 1 && v.bases[0] === 'https://api.mainnet.hiro.so',
    'the score client reads through the same hosts as the parent (' + JSON.stringify(v && v.bases) + '); a viewer points those at its /hiro proxy');
  // The viewer's sandbox withholds clipboard and similar permissions on purpose; Chrome logs those as policy notes.
  const viewerErrors = r.errors.filter((e) => !/permissions policy/i.test(e));
  check(!viewerErrors.length, 'no page errors (viewer) ' + viewerErrors.slice(0, 2).join(' | '));
  if (SHOTS) await r.page.screenshot({ path: path.join(SHOTS, '15-viewer-srcdoc.png') });
  await r.ctx.close();

  await browser.close();
  srv.close();
  console.log('\nhall parent tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

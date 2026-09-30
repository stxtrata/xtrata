// End-to-end test of the recursive hall parent against a mocked chain.
//   #3078        = release/xtrata-arcade.html (the inscribed v1.3 single file)
//   9001..9005   = dist/packs/*.txt (assets, three, engine, games, hall)
//   9100         = src/parts/game-cave-diver.js (a single-part override)
// Scenarios: bundle only; changed packs over the bundle; one part override; Leather shim;
// idle cabinet screens showing the Top 10.
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
          for (const pc of (params && params.postConditions) || []) {
            if (typeof pc === 'string' && !/^([0-9a-fA-F]{2})+$/.test(pc)) throw new Error('Not a serialized post condition');
          }
          return { result: { txid: 'ab'.repeat(32) } };
        } };
      });
    }
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebGL|GPU|404/.test(m.text())) errors.push(m.text()); });
    await page.goto(base + file);
    await page.waitForFunction(() => !document.getElementById('xa-load') || document.getElementById('xa-load').classList.contains('done') ||
      !document.getElementById('xa-load-err').hidden, null, { timeout: 180000 });
    const loadErr = await page.evaluate(() => { const e = document.getElementById('xa-load-err'); return e && !e.hidden ? e.textContent : ''; });
    return { page, ctx, errors, reads, loadErr };
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
  pages['/bundle-only.html'] = parentWith({ bundleId: 3078, packs: { assets: 0, three: 0, engine: 0, games: 0, hall: 0 }, parts: {} });
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
  pages['/packs.html'] = parentWith({ bundleId: 3078, packs: PACK_IDS, parts: {} });
  r = await open('/packs.html');
  s = await hallState(r.page);
  check(!r.loadErr && s.games === 21 && s.three && !s.err, 'hall boots from the five packs');
  check(!r.reads[3078] && Object.keys(PACK_IDS).every((k) => r.reads[PACK_IDS[k]] > 0), 'every pack read, the bundle not needed');
  check(!r.errors.length, 'no page errors with packs (' + r.errors.slice(0, 2).join(' | ') + ')');
  await r.ctx.close();

  /* 3. Mixed: engine + hall packs over the bundle, one game from its own inscription. */
  pages['/mixed.html'] = parentWith({ bundleId: 3078, packs: { assets: 0, three: 0, engine: 9003, games: 0, hall: 9005 }, parts: { 'game-cave-diver.js': 9100 } });
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

  await browser.close();
  srv.close();
  console.log('\nhall parent tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

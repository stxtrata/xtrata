// The operator toolkit's local preview page (contracts/arcade-world/ops): a scene file shown in the real hall, block by block.
//   A  every key block in the file has a button, and the panel says it is not on chain
//   B  "before the first scene" shows posters in both bays, the next frames show the story's curtain, the door and the lobby link
//   D  the test-network view page reads the TEST contracts from the testnet API and nothing from mainnet
//   C  no page errors, and the world and poster contracts are never read (all outside requests are blocked; the hall's own score reads are expected)
// Run: NODE_PATH=<playwright> CHROME_PATH=... node tests/ops-preview.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const OPS = path.join(__dirname, '..', '..', '..', 'contracts', 'arcade-world', 'ops');
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'xa-ops-preview-')), 'story.html');
execFileSync('node', [path.join(OPS, 'preview.mjs'), path.join(OPS, 'examples', 'launch-story.scene.json'), '--height', '1000', '--out', out], { stdio: 'pipe' });
const HTML = fs.readFileSync(out, 'utf8');

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
  const outside = [];
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => { outside.push(route.request().url()); route.abort('failed'); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
  await page.waitForFunction(() => /LOCAL PREVIEW/.test(document.body.innerText), null, { timeout: 60000 });
  await page.waitForTimeout(1200);

  const labels = await page.evaluate(() => [...document.querySelectorAll('div[style*="99999"] button')].map((b) => b.textContent));
  check(labels.some((l) => /^now/.test(l)) && labels.some((l) => /before the first/.test(l)) && labels.filter((l) => /^block /.test(l)).length === 3, 'A: the panel lists now, before-the-first and one button per start block (' + labels.join(' | ') + ')');
  check(/NOT ON CHAIN/.test(await page.evaluate(() => document.body.innerText)), 'A: the panel says it is not on chain');

  const bays = () => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.bayState())));
  const click = async (re) => { await page.evaluate((src) => { const r = new RegExp(src); [...document.querySelectorAll('div[style*="99999"] button')].find((b) => r.test(b.textContent)).click(); }, re.source); await page.waitForTimeout(700); };

  await click(/before the first/);
  let s = await bays();
  check(s.bays.every((b) => b.plan === null && !b.curtain && !b.door), 'B: before the first scene both bays are plain posters');
  await click(/^block 1006/);
  s = await bays();
  check(s.bays[0].curtain && s.bays[0].light && s.bays[0].overlays === 1 && s.bays[0].plan.base === 'wall', 'B: block 1006 shows the curtain, sign and lamp on a plain wall in bay 0');
  check(s.bays[1].plan === null, 'B: bay 1 is still posters');
  await click(/^block 1432/);
  s = await bays();
  check(s.bays[0].door === true && !s.bays[0].curtain && s.bays[0].plan.interaction === 1, 'B: block 1432 shows a locked (knock) door and no curtain');
  await click(/^block 1576/);
  s = await bays();
  check(s.bays[0].plan.interaction === 3 && s.bays[0].plan.link && s.bays[0].plan.link['target-room'] === 'lobby', 'B: block 1576 shows the open door that leads to the lobby');
  check(s.bays[1].plan && s.bays[1].plan.base === 'posters' && !s.bays[1].curtain && !s.bays[1].door && !s.bays[1].light, 'B: bay 1 gets its posters scene, which draws nothing extra');
  check(!errors.length, 'C: no page errors ' + errors.slice(0, 2).join(' | '));
  const worldCalls = outside.filter((u) => /SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X\/xtrata-(world|posters)-v1/.test(u));
  check(worldCalls.length === 0, 'C: the page never reads the real world or poster contracts (' + worldCalls.slice(0, 2).join(', ') + ')');

  /* ---- D: testnet view ---- */
  {
    const view = path.join(path.dirname(out), 'view.html');
    execFileSync('node', [path.join(OPS, 'view.mjs'), '--world', 'ST1ABCDEFGHJKMNPQRSTVWXYZ0123456789.xtrata-world-v1', '--posters', 'ST1ABCDEFGHJKMNPQRSTVWXYZ0123456789.xtrata-posters-v1', '--out', view], { stdio: 'pipe' });
    const VH = fs.readFileSync(view, 'utf8');
    const srv2 = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(VH); });
    await new Promise((r) => srv2.listen(0, r));
    const c2 = await browser.newContext({ viewport: { width: 900, height: 600 } });
    const seen = [];
    await c2.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => { seen.push(route.request().url()); route.fulfill({ status: 200, contentType: 'application/json', body: '{"okay":false,"cause":"test"}' }); });
    const p2 = await c2.newPage();
    const errs2 = [];
    p2.on('pageerror', (e) => errs2.push(e.message));
    await p2.goto('http://127.0.0.1:' + srv2.address().port + '/', { timeout: 120000 });
    await p2.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27, null, { timeout: 120000 });
    await p2.waitForTimeout(3000);
    const testnetReads = seen.filter((u) => /api\.testnet\.hiro\.so\/v2\/contracts\/call-read\/ST1ABCDEFGHJKMNPQRSTVWXYZ0123456789\/xtrata-(world|posters)-v1\//.test(u));
    check(testnetReads.length > 0, 'D: the testnet view reads the test world/poster contracts from the testnet API (' + testnetReads.length + ' reads)');
    check(!seen.some((u) => /api\.mainnet\.hiro\.so/.test(u)), 'D: and nothing is read from mainnet (' + seen.filter((u) => /mainnet/.test(u)).slice(0, 2).join(', ') + ')');
    check(/TESTNET VIEW/.test(await p2.evaluate(() => document.body.innerText)), 'D: the page says it is a read-only testnet view');
    check(!errs2.length, 'D: no page errors ' + errs2.slice(0, 2).join(' | '));
    await c2.close(); srv2.close();
  }

  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

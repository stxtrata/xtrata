// The real hall (dist single file) in Chromium with the centre screen switched on and the chain blocked.
// Every request to a node is refused, so the screen has nothing from xtrata-screen-v1: it must draw its idle panel
// (Bitcoin Day clock + "no scores" + the default ticker), try the contract, and raise no page errors.
//   A  no screen configured    idle panel, the contract is never read
//   B  screen configured       idle panel, get-version attempted (and refused), nothing cached, still no errors
// Run: NODE_PATH=<playwright> CHROME_PATH=... node tests/hall-screen.test.cjs   (needs `node build/modular.mjs build` first)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const SCREEN = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-screen-v1';
const IDLE = 'EVERY TOP SCORE LIVES ON BITCOIN';

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function hall(configured) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const reads = [];
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => { reads.push(route.request().url()); route.abort('failed'); });
    await ctx.addInitScript((o) => { if (o.screen) window.XA_WORLD_CONFIG = { screen: o.screen }; }, { screen: configured ? SCREEN : null });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XAScreen && document.querySelector('canvas'), null, { timeout: 120000 });
    // record what the centre screen draws on its next frame (the hall repaints it every ~120 ms while the player is near it)
    const seen = await page.evaluate(() => new Promise((resolve) => {
      const real = window.XAScreen.paint;
      window.XAScreen.paint = function (x, W, H, d) {
        const texts = [], ft = x.fillText;
        x.fillText = function (t) { texts.push(String(t)); return ft.apply(this, arguments); };
        try { return real.apply(this, arguments); } finally { x.fillText = ft; window.XAScreen.paint = real; resolve({ texts, items: d.items.length, day: d.day }); }
      };
    }));
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => ({ enabled: window.XAScreen.enabled(), snap: window.XAScreen.snapshot(), items: window.XAScreen.items().length }));
    await ctx.close();
    return { seen, info, errors, reads };
  }

  const A = await hall(false);
  check(A.info.enabled === false && A.info.snap === null, 'A: no screen configured, the reader is off');
  check(A.seen.texts.includes('BITCOIN DAY') && A.seen.texts.filter((t) => t === IDLE).length >= 2, 'A: the screen draws its idle panel and default ticker');
  check(A.seen.items === 0 && A.seen.texts.includes('NO SCORES YET TODAY'), 'A: no items, no scorers');
  check(!A.reads.some((u) => /xtrata-screen-v1/.test(u)), 'A: the screen contract is never read');
  check(!A.errors.length, 'A: no page errors ' + A.errors.slice(0, 2).join(' | '));

  const B = await hall(true);
  check(B.info.enabled === true && B.info.snap === null && B.info.items === 0, 'B: configured, chain blocked, nothing cached: no snapshot');
  check(B.seen.texts.includes('BITCOIN DAY') && B.seen.texts.filter((t) => t === IDLE).length >= 2 && B.seen.items === 0, 'B: still the idle panel');
  check(B.reads.some((u) => /call-read\/ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E\/xtrata-screen-v1\/get-version/.test(u)), 'B: the reader did try get-version (refused)');
  check(!B.errors.length, 'B: no page errors ' + B.errors.slice(0, 2).join(' | '));

  await browser.close(); srv.close();
  console.log('hall screen tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

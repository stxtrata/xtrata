// The door latch, in the real hall (dist single file, Chromium): a closed door has its bolt thrown into the strike set in the frame, a held
// handle pulls the bolt fully back into the leaf, and a door that is opened and closed again ends with the bolt in the strike.
//   A  closed          the bolt tip is past the strike's face and still inside the keep (so it goes into the frame, not in front of it)
//   B  handle held     with the handle down the bolt is back inside the leaf
//   C  open then shut  closing the door ends with the bolt thrown into the strike again
// Run: NODE_PATH=<playwright> CHROME_PATH=... node tests/hall-latch.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const STYLES = ['rect', 'arch', 'tall', 'circle'];
const LOOKS = {}; STYLES.forEach((n, i) => { LOOKS[20 + i] = { kind: 0, name: n, tier: 0, builtin: 'door-' + n, hidden: false, approved: true }; });
const bay = (i) => ({ scene: { base: 'door', baseId: 2, interaction: 2, doorLook: 20 + i, layers: [], link: null, fromHeight: 0 }, nextHeight: null, height: 0 });
const snapshot = { versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays: STYLES.map((n, i) => bay(i)), looks: LOOKS };

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 800, height: 500 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
  await ctx.addInitScript((s) => {
    window.XA_TEST = 1;
    window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
    try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(s)); } catch (e) {}
  }, snapshot);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:' + srv.address().port + '/');
  await page.waitForFunction(() => window.XA && window.XA.bayState && window.XA.wallState && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.click('#go'); await page.waitForTimeout(600);

  const latch = (i) => page.evaluate((n) => JSON.parse(JSON.stringify(window.XA.bayState().bays[n].latch)), i);
  const door = (i, fn) => page.evaluate(([n, f]) => window.XA.bayDoor(n, new Function('m', f)), [i, fn]);
  const settle = (i, ms) => page.waitForFunction((n) => { const s = window.XA.bayState().bays[n]; return s.doorState && !s.doorState.awake; }, i, { timeout: ms || 120000 }).catch(() => {});

  for (let i = 0; i < STYLES.length; i++) {
    await door(i, 'm.cfg.locked = false; m.wake();'); await page.waitForTimeout(1500);
    const [l] = await latch(i);
    /* ---- A ---- */
    check(l && l.hasKeep, 'A: ' + STYLES[i] + ' has a strike in the frame');
    check(l.tip - l.face >= 0.007 && l.tip < l.keepEnd, 'A: ' + STYLES[i] + ' closed, the bolt tip is in the strike (tip ' + (l.tip * 1000).toFixed(1) + ' mm, face ' + (l.face * 1000).toFixed(1) + ' mm, keep ends ' + (l.keepEnd * 1000).toFixed(0) + ' mm)');
  }
  /* ---- B ---- */
  await door(0, 'm.handle.hold = true; m.handle.holdT = -999; m.handle.a = 22; m.handle.v = 0; m.wake();');
  await page.waitForFunction(() => window.XA.bayState().bays[0].latch[0].tip < 0, null, { timeout: 120000 }).catch(() => {});
  check((await latch(0))[0].tip < 0, 'B: with the handle down the bolt is back inside the leaf (tip ' + ((await latch(0))[0].tip * 1000).toFixed(1) + ' mm)');
  await door(0, 'm.handle.hold = false; m.wake();'); await page.waitForTimeout(2500);
  /* ---- C ---- */
  await door(1, 'm.angle = m.cfg.openAngle; m.vel = 0; m.mode = "free"; m.wake();'); await page.waitForTimeout(1500);
  await door(1, 'm.close();'); await settle(1, 150000); await page.waitForTimeout(1500);
  const s1 = await page.evaluate(() => window.XA.bayState().bays[1].doorState), l1 = (await latch(1))[0];
  check(s1.angle < 0.3, 'C: the door closed again (angle ' + s1.angle.toFixed(2) + ')');
  check(l1.tip - l1.face >= 0.007, 'C: and the bolt is back in the strike (tip ' + (l1.tip * 1000).toFixed(1) + ' mm)');
  check(!errors.length, 'no page errors ' + errors.slice(0, 2).join(' | '));
  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

// The real hall (dist single file) in Chromium: the OPEN LINK button on the hall bar.
//   A  no item on the screen has a link   the button is hidden; pressing L opens nothing
//   B  the item on the screen has a link  the button shows, the host is painted on the screen
//   C  clicking the button / pressing L   opens the https link in a new tab (noopener); nothing else is opened
//   D  an unsafe link (javascript:)       never shows the button and opens nothing
// Run: CHROME_PATH=... NODE_PATH=<playwright> node tests/hall-screen-link.test.cjs   (needs `node build/modular.mjs build` first)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).filter((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop()), 'utf8');
const SCREEN = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-screen-v1';
let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
  await ctx.addInitScript((s) => { window.XA_TEST = true; window.XA_WORLD_CONFIG = { screen: s }; window.__opened = []; window.open = function () { window.__opened.push(Array.prototype.slice.call(arguments)); return {}; }; }, SCREEN);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XAScreen && document.querySelector('canvas') && document.getElementById('hlink'), null, { timeout: 120000 });

  // put the player in the walking state in front of the screen (the same state the real hall is in after "walk in")
  const walk = async () => { await page.click('#go'); await page.waitForTimeout(500); };
  const setItems = (links) => page.evaluate((ls) => {
    const S = window.XAScreen;
    const items = ls.map((l, i) => S.normalizeItem(i + 1, { kind: 1, head: 'ITEM ' + (i + 1), body: 'x', weight: 1, turns: 1, status: 1, link: l, 'starts-at': 0, 'ends-at': 99999999 }));
    // a raw item can carry an unsafe link that normalizeItem would have dropped: make it directly
    ls.forEach((l, i) => { if (l && !items[i].link) items[i].link = l; });
    S._t.state.snap = { version: 1, at: Date.now(), height: 100, items };
    S.stop();
  }, links);
  const btnShown = () => page.evaluate(() => { const b = document.getElementById('hlink'); return !!b && !b.hidden; });
  // the hall paints the screen only while the player is near it; the player starts near the centre screen in the preview position
  const waitFrames = () => page.waitForTimeout(1500);

  // intro state first (the hall bar is already on screen): the real mouse click
  await setItems([null]); await waitFrames();
  check(!(await btnShown()), 'A: no link on the screen, the button is hidden');
  await setItems(['https://xtrata.xyz/arcade']); await waitFrames();
  check(await btnShown(), 'B: the item on the screen has a link, the OPEN LINK button shows');
  check(/^OPEN: ITEM 1/.test(await page.evaluate(() => document.getElementById('hlink').textContent)), 'B: the button names what it opens (the item headline), not just OPEN LINK');
  check(/xtrata\.xyz/.test(await page.evaluate(() => document.getElementById('hlink').title)), 'B: hovering the button tells you the site it opens');
  await page.click('#hlink');
  let o = await page.evaluate(() => window.__opened);
  check(o.length === 1 && o[0][0] === 'https://xtrata.xyz/arcade' && o[0][1] === '_blank' && /noopener/.test(o[0][2]), 'C: clicking opens the https link in a new tab with noopener');
  // then walking: the L key
  await walk();
  await setItems([null]); await waitFrames();
  await page.keyboard.press('KeyL');
  check((await page.evaluate(() => window.__opened.length)) === 1, 'A: walking, no link on the screen: pressing L opens nothing');
  await setItems(['https://xtrata.xyz/arcade']); await waitFrames();
  await page.keyboard.press('KeyL');
  o = await page.evaluate(() => window.__opened);
  check(o.length === 2 && o[1][0] === 'https://xtrata.xyz/arcade', 'C: walking, pressing L opens the link');

  // E: aim at the big screen: the dot changes, a prompt names the link, E and a click open it; aim away and it goes
  await setItems(['https://xtrata.xyz/arcade']); await waitFrames();
  const aim = (yaw, pitch) => page.evaluate(([y, p]) => { XA.pose(0, XA.centreZ() + 5, y, p); }, [yaw, pitch]);
  const cross = () => page.evaluate(() => document.getElementById('cross').classList.contains('link'));
  const promptText = () => page.evaluate(() => { const e = document.getElementById('sprompt'); return e.hidden ? '' : e.textContent; });
  await aim(Math.PI, 0); await page.waitForTimeout(400);
  check(!(await cross()) && (await promptText()) === '', 'E: looking away from the screen: plain dot, no prompt');
  await aim(0, 0.3); await page.waitForTimeout(400);
  check(await cross(), 'E: aimed at the screen: the dot turns into a ring');
  check(/OPEN LINK/.test(await promptText()) && /ITEM 1/.test(await promptText()) && /xtrata\.xyz/.test(await promptText()), 'E: the prompt names the link and the site: ' + await promptText());
  const n0 = await page.evaluate(() => window.__opened.length);
  await page.keyboard.press('KeyE'); await page.waitForTimeout(200);
  check((await page.evaluate(() => window.__opened.length)) === n0 + 1, 'E: pressing E while aimed opens the link');
  await page.mouse.click(550, 350); await page.waitForTimeout(200);
  check((await page.evaluate(() => window.__opened.length)) === n0 + 2, 'E: clicking the screen opens the link');
  await aim(Math.PI, 0); await page.waitForTimeout(400); await page.keyboard.press('KeyE');
  check((await page.evaluate(() => window.__opened.length)) === n0 + 2, 'E: pressing E while looking away opens nothing');
  await setItems([null]); await aim(0, 0.3); await waitFrames();
  check(!(await cross()), 'E: an item with no link is not clickable');
  await setItems(['https://xtrata.xyz/arcade']); await aim(0, 0.3); await page.waitForTimeout(400);

  await setItems(['javascript:alert(1)']); await waitFrames();
  check(!(await btnShown()), 'D: an unsafe link never shows the button');
  const before = await page.evaluate(() => window.__opened.length);
  await page.keyboard.press('KeyL');
  check((await page.evaluate(() => window.__opened.length)) === before, 'D: and pressing L opens nothing');
  check(!errors.length, 'no page errors ' + errors.slice(0, 2).join(' | '));
  await browser.close(); srv.close();
  console.log('hall screen link tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

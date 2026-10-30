// The real hall with every board answered from a canned get-top10: the centre screen's left column alternates between the latest scorers and
// the number ones (newest crown first, then A to Z), pages through the list, and marks a crown set in the last day.
//   A  latest scorers first, from the boards the hall has read
//   B  number ones, newest first: the title, the order and a page count; every board the hall knows has a row (21 games and their variants)
//   C  latest scorers again, then number ones A to Z
// Time is moved by shifting performance.now (the screen's clock), forward only. Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-screen-left.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).filter((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop()), 'utf8');
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
  await ctx.addInitScript(() => {
    window.XA_TEST = 1; Element.prototype.requestPointerLock = function () {};
    // the screen's clock: performance.now plus an offset the test moves
    window.__tOff = 0; const real = performance.now.bind(performance); performance.now = () => real() + window.__tOff;
    // every board is answered from a canned list (3 players); a few crowns are brand new
    let xs; const hash = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
    Object.defineProperty(window, 'XAScores', { configurable: true, get() { return xs; }, set(v) {
      xs = v;
      v.getTop10 = async (board, mode) => {
        const h = hash(board), time = mode === 'time';
        const base = time ? 900 + (h % 700) : 400 + (h % 3000);
        const fresh = h % 5 === 0;
        return { ok: true, entries: [
          { name: 'ACE' + (h % 90), score: time ? base : base + 200, burn: fresh ? 9999999 : 970000 - (h % 700) * 3 },
          { name: 'BOB' + (h % 90), score: time ? base + 150 : base + 100, burn: 969000 - (h % 500) },
          { name: 'CY' + (h % 90), score: time ? base + 300 : base, burn: 968000 } ] };
      };
    } });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XAScreen && window.XA.where && document.getElementById('go'), null, { timeout: 120000 });
  // record the screen's text each paint (the last paint's texts are what is on the screen)
  await page.evaluate(() => {
    const real = window.XAScreen.paint; window.__texts = [];
    window.XAScreen.paint = function (x, W, H, d) {
      const seen = [], ft = x.fillText;
      x.fillText = function (t) { seen.push(String(t)); return ft.apply(this, arguments); };
      try { return real.apply(this, arguments); } finally { x.fillText = ft; window.__texts = seen; window.__d = { champs: (d.champions || []).length, scorers: (d.scorers || []).length, t: d.t }; }
    };
  });
  await page.click('#go'); await page.waitForTimeout(600);
  const w = await page.evaluate(() => window.XA.where());
  await page.evaluate((w0) => window.XA.pose(0, window.XA.centreZ() + 5, 0, 0.1), w);
  // move the screen's clock FORWARD to the next time that is `t` seconds into the 120 s round (the hall's repaint gate ignores a clock that goes back)
  const setT = async (t) => {
    const want = await page.evaluate((tt) => { const cur = performance.now() / 1000, w = cur + ((((tt - cur) % 120) + 120) % 120); window.__tOff += (w - cur) * 1000; return w; }, t);
    // wait for a paint at (or after) the new time: frames are slow in the software renderer
    await page.waitForFunction((w) => window.__d && window.__d.t >= w, want, { timeout: 20000, polling: 100 });
  };
  const texts = () => page.evaluate(() => window.__texts.slice());
  const shot = async (n) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, 'screen-left-' + n + '.png') }); };

  // the hall reads one board every ~1.2 s: wait until it has read them all (the list stops growing)
  let last = -1, stable = 0;
  for (let i = 0; i < 120 && stable < 6; i++) { await page.waitForTimeout(1500); const n = await page.evaluate(() => window.__d.champs); stable = n === last && n > 0 ? stable + 1 : 0; last = n; }
  check(last >= 21, 'the hall has read the boards: ' + last + ' number ones known (21 games and their variants)');

  await setT(5);
  let t = await texts();
  if (process.env.DBG) console.log(JSON.stringify(await page.evaluate(() => ({d: window.__d, t: window.__texts.slice(0,40)}))));
  check(t.includes('LATEST SCORERS') && !t.includes('NUMBER ONES'), 'A: first, the latest scorers');
  check(t.some((s) => /^(ACE|BOB|CY)\d+$/.test(s)), 'A: they are the players from the boards');
  await shot('latest');

  await setT(25);
  t = await texts();
  check(t.includes('NUMBER ONES'), 'B: then the number ones');
  const sub = t.find((s) => /^NEWEST FIRST\s+1\/\d+$/.test(s));
  check(!!sub, 'B: newest first, page 1 of ' + (sub || '').split('/')[1]);
  const pages = Number((sub || '').split('/')[1]);
  check(pages >= 3, 'B: it pages (' + pages + ' pages)');
  check(t.includes('NEW'), 'B: a crown set inside the last day is marked NEW');
  check(t.filter((s) => /^ACE\d+$/.test(s)).length >= 5, 'B: the holders are the number ones (the best score on each board)');
  await shot('champs-new-1');
  await setT(25 + 12);
  t = await texts();
  check(t.some((s) => new RegExp('^NEWEST FIRST\\s+2/' + pages + '$').test(s)), 'B: and on to page 2');
  await shot('champs-new-2');

  await setT(65);
  t = await texts();
  check(t.includes('LATEST SCORERS'), 'C: latest scorers again');
  await setT(85);
  t = await texts();
  check(t.some((s) => new RegExp('^A TO Z\\s+1/' + pages + '$').test(s)) && t.includes('NUMBER ONES'), 'C: then the number ones A to Z');
  await shot('champs-abc-1');
  const names = t.filter((s) => s === s.toUpperCase() && /[A-Z]/.test(s) && s.length > 3 && !/^(NUMBER ONES|A TO Z|BITCOIN DAY|BLOCK|NEXT)/.test(s) && !/\d/.test(s) && s !== 'EVERY TOP SCORE LIVES ON BITCOIN');
  const firstGames = names.slice(0, 5);
  check(firstGames.length >= 3 && JSON.stringify(firstGames) === JSON.stringify(firstGames.slice().sort()), 'C: that page is in A to Z order (' + firstGames.join(', ') + ')');
  await setT(125);
  t = await texts();
  check(t.includes('LATEST SCORERS'), 'C: and round again');
  check(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.slice(0, 2).join(' | ') : ''));
  await browser.close(); srv.close();
  console.log('hall screen left-column tests passed: ' + passed);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });

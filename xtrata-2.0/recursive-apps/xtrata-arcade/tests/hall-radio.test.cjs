// The radio dock: music is part of the hall's own frame, so it is there in the hall and in every room.
//   A  the button      there in the hall, not in the way of the top bar; opens the radio panel; the radio is loaded only when first asked for
//   B  the frame       the radio page is radio.xtrata.xyz/radio (the one origin the listening wallet trusts), with passkeys granted to that origin only
//   C  keeps playing   hiding the panel does not unload the radio (same page, loaded once); Esc, HIDE and a click outside all hide it; the hall's keys wait while it is open
//   D  in a room       the button and the panel are there inside a room (a sandboxed room frame cannot reach them), and the radio is still the same page
//   E  games           the button steps aside during a game; the radio page is still there afterwards
// A stub page stands in for the real radio (the test browser cannot reach the network): it counts how many times it was loaded.
// Run: NODE_PATH=<playwright> CHROME_PATH=... node tests/hall-radio.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

(async () => {
  const srv = http.createServer((req, res) => {
    if (/room-stub\.html/.test(req.url)) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><title>stub room</title><body style="background:#123;color:#fff"><h1>ROOM STUB</h1><script>parent.postMessage({xa:"room-ready"},"*")</script>'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML);
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
  let radioLoads = 0;
  await ctx.route(/^https:\/\/radio\.xtrata\.xyz\//, (route) => {
    radioLoads++;
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub radio</title><body style="background:#222;color:#fff"><h1>RADIO STUB</h1><script>parent.postMessage({radioStub:Date.now()},"*")</script>' });
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)(?!radio\.xtrata\.xyz)/, (route) => route.abort('failed'));
  await ctx.addInitScript(() => { window.XA_TEST = 1; Element.prototype.requestPointerLock = function () {}; window.__radioMsgs = []; addEventListener('message', (e) => { if (e.data && e.data.radioStub) window.__radioMsgs.push(e.data.radioStub); }); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XA.radioState && window.XA.where && window.XA.roomState && document.getElementById('go'), null, { timeout: 120000 });
  await page.waitForTimeout(1000);
  const rr = () => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.radioState())));
  const rs = () => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.roomState())));
  const frameBorn = () => page.evaluate(() => (window.__radioMsgs.length === 1 ? window.__radioMsgs[0] : window.__radioMsgs.length ? -window.__radioMsgs.length : 0));

  // before the hall has started (the intro card is up) the radio is not loaded and not asked for
  let s = await rr();
  check(!s.loaded && !s.src && radioLoads === 0, 'A: nothing is fetched from the radio until it is asked for');
  await page.click('#go'); await page.waitForTimeout(600);
  s = await rr();
  check(s.shown, 'A: the radio button is there once you can walk');
  const box = await page.evaluate(() => { const b = document.getElementById('xa-radio-btn').getBoundingClientRect(), h = document.getElementById('hallbar').getBoundingClientRect(); return { b: [b.left, b.top, b.right, b.bottom], h: [h.left, h.top, h.right, h.bottom], w: innerWidth, hh: innerHeight }; });
  check(box.b[0] < 100 && box.b[3] > box.hh - 80 && box.b[2] < box.h[0], 'A: it sits at the bottom left, clear of the top bar (' + box.b.map((v) => Math.round(v)) + ')');

  await page.click('#xa-radio-btn');
  await page.waitForFunction(() => window.__radioMsgs.length >= 1, null, { timeout: 30000 }).catch(() => {});
  s = await rr();
  check(s.open && s.loaded && s.src === 'https://radio.xtrata.xyz/radio' && !s.away, 'B: the button opens the radio panel on radio.xtrata.xyz/radio');
  check(/publickey-credentials-get https:\/\/radio\.xtrata\.xyz/.test(s.allow) && /publickey-credentials-create https:\/\/radio\.xtrata\.xyz/.test(s.allow) && !/publickey-credentials-get \*/.test(s.allow), 'B: passkeys are granted to the radio origin only');
  check(/allow-scripts/.test(s.sandbox) && /allow-same-origin/.test(s.sandbox) && !/allow-top-navigation/.test(s.sandbox), 'B: the frame cannot navigate the hall away (' + s.sandbox + ')');
  check(radioLoads === 1, 'B: the radio was fetched once');
  const born = await frameBorn();
  check(born > 0, 'B: the radio page is up inside the panel');

  // C  hide keeps it alive
  await page.click('#xa-radio-hide'); await page.waitForTimeout(400);
  s = await rr();
  check(!s.open && s.away && s.loaded, 'C: HIDE hides the panel');
  check((await frameBorn()) === born && radioLoads === 1, 'C: the radio page is the same page afterwards (not reloaded, so music would not stop)');
  await page.click('#xa-radio-btn'); await page.waitForTimeout(500);
  check((await rr()).open && (await frameBorn()) === born && radioLoads === 1, 'C: opening it again shows the same page');
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  check(!(await rr()).open, 'C: Esc hides it');
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  await page.mouse.click(900, 80); await page.waitForTimeout(300);
  check(!(await rr()).open && (await frameBorn()) === born, 'C: a click outside the panel hides it');
  // the hall's keys wait while it is open
  const w0 = await page.evaluate(() => window.XA.where());
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  await page.keyboard.down('KeyW'); await page.waitForTimeout(700); await page.keyboard.up('KeyW');
  const w1 = await page.evaluate(() => window.XA.where());
  check(Math.hypot(w1.x - w0.x, w1.z - w0.z) < 0.05, 'C: you do not walk while the radio panel is open');
  await page.click('#xa-radio-hide'); await page.waitForTimeout(300);

  // D  in a room
  await page.evaluate(() => window.XA.enterRoom({ kind: 'src', cfg: { src: 'room-stub.html' }, key: 'stub', slug: 'stub', title: 'Stub Room', label: 'Stub Room', view: {} }, -1));
  await page.waitForFunction(() => window.XA.roomState().state === 'room' && window.XA.roomState().back, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  const rm = await rs();
  check(rm.state === 'room' && !/allow-same-origin/.test(rm.sandbox), 'D: inside a room (its frame is sandboxed: ' + rm.sandbox + ')');
  check((await rr()).shown, 'D: the radio button is still there inside the room');
  const z = await page.evaluate(() => { const b = document.getElementById('xa-radio-btn'), p = document.getElementById('xa-radio'), f = document.querySelector('iframe[data-xa-room]'); return { b: +getComputedStyle(b).zIndex, p: +getComputedStyle(p).zIndex, f: +getComputedStyle(f).zIndex, top: document.elementFromPoint(b.getBoundingClientRect().left + 10, b.getBoundingClientRect().top + 10) === b || b.contains(document.elementFromPoint(b.getBoundingClientRect().left + 10, b.getBoundingClientRect().top + 10)) }; });
  check(z.b > z.f && z.p > z.b && z.top, 'D: the button is above the room and can be clicked (z ' + z.b + ' over the room\'s ' + z.f + ')');
  await page.click('#xa-radio-btn'); await page.waitForTimeout(500);
  check((await rr()).open && (await frameBorn()) === born && radioLoads === 1, 'D: in the room, the same radio page opens (no reload)');
  if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, 'radio-in-room.png') });
  await page.click('#xa-radio-hide'); await page.waitForTimeout(300);
  check((await rs()).state === 'room', 'D: hiding it leaves you in the room');
  await page.click('#xa-room-back'); await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 60000 });
  await page.waitForTimeout(600);
  check((await rr()).shown && (await frameBorn()) === born, 'D: back in the hall the button is there and the radio page is still the same one');

  // E  during a game: the button steps aside, the radio page stays
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, 'radio-open-hall.png') });
  await page.click('#xa-radio-hide'); await page.waitForTimeout(300);
  if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, 'radio-button-hall.png') });
  await page.evaluate(() => window.XA.startGame(0));
  await page.waitForFunction(() => window.XA.hallState() === 'play', null, { timeout: 60000 });
  await page.waitForTimeout(800);
  check(!(await rr()).shown, 'E: during a game the button steps aside');
  check((await frameBorn()) === born && radioLoads === 1, 'E: the radio page is still the same page during the game');
  check(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close(); srv.close();
  console.log('hall radio tests passed: ' + passed);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });

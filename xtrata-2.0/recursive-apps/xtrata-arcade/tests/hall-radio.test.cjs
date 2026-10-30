// The radio dock: music is part of the hall's own frame, so it is there in the hall and in every room.
//   A  the button      there in the hall, not in the way of the top bar; opens the radio panel; the radio is loaded only when first asked for
//   B  the frame       the radio page is radio.xtrata.xyz/radio (the one origin the listening wallet trusts), with passkeys granted to that origin only
//   C  keeps playing   hiding the panel does not unload the radio (same page, loaded once); Esc, HIDE and a click outside all hide it; the hall's keys wait while it is open
//   D  in a room       the button and the panel are there inside a room (a sandboxed room frame cannot reach them), and the radio is still the same page
//   E  games           the button steps aside during a game; the radio page is still there afterwards
//   G  bridge          the radio says what is playing: a now-playing strip with play/pause, next, previous (panel or pop-out; other origins ignored); a heart tap in the
//                      panel opens the pop-out; a blocked pop-up leaves the panel up and says so
//   F  pop-out         POP OUT opens the radio in its own window (compact layout) and takes the panel's copy down, so there is one radio; the RADIO button then
//                      brings that window forward; once it is closed the panel works again; if the browser blocks the window the panel stays and a tab opens
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

// The stand-in radio speaks the dock protocol like the real page does (public/radio.html): it says "ready", answers the hall's "hello" with what is
// playing, logs every message from the hall, and can ask for the pop-out the way the panel's heart does.
const STUB_JS = `
var peers=[window.opener,window.parent].filter(function(x){return x&&x!==window});
window.__log=[];
try{parent.postMessage({radioStub:Date.now()},"*")}catch(e){}
peers.forEach(function(w){w.postMessage({xtrataRadio:1,type:'ready'},'*')});
addEventListener('message',function(e){var d=e.data;if(d&&d.xtrataHall===1){window.__log.push(d);
  if(d.type==='hello')e.source.postMessage({xtrataRadio:1,type:'state',title:'Test Song',artist:'Test Artist',playing:true,on:true},e.origin)}});
window.sendNeed=function(){peers.forEach(function(w){w.postMessage({xtrataRadio:1,type:'need-wallet',why:'like'},'*')})};
window.sendHide=function(){peers.forEach(function(w){w.postMessage({xtrataRadio:1,type:'hide-request'},'*')})};
window.sendState=function(o){peers.forEach(function(w){w.postMessage(Object.assign({xtrataRadio:1,type:'state'},o),'*')})};
`.replace(/\n/g, ' ');

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
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub radio</title><body style="background:#222;color:#fff"><h1>RADIO STUB</h1><script>' + STUB_JS + '</script>' });
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)(?!radio\.xtrata\.xyz)/, (route) => route.abort('failed'));
  await ctx.addInitScript(() => { window.XA_TEST = 1; window.__locks = 0; Element.prototype.requestPointerLock = function () { window.__locks++; }; window.__radioMsgs = []; addEventListener('message', (e) => { if (e.data && e.data.radioStub) window.__radioMsgs.push(e.data.radioStub); }); });
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
  check(s.open && s.loaded && s.src === 'https://radio.xtrata.xyz/radio?dock=1' && !s.away, 'B: the button opens the radio panel on radio.xtrata.xyz/radio, asking for its compact (dock) layout');
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
  // F  pop out: the radio in its own window, one radio at a time
  await page.evaluate(() => window.XA.exitGame());
  await page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 30000 });
  await page.waitForTimeout(600);
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  check((await rr()).open, 'F: the panel is open before popping out');
  check(await page.evaluate(() => /POP OUT/.test(document.getElementById('xa-radio-open').textContent) && document.getElementById('xa-radio-open').getAttribute('href') === 'https://radio.xtrata.xyz/radio?dock=1'), 'F: the panel has a POP OUT link to the compact radio');
  const loadsBefore = radioLoads;
  const [pop] = await Promise.all([ctx.waitForEvent('page'), page.click('#xa-radio-open')]);
  await pop.waitForLoadState('domcontentloaded').catch(() => {});
  check(pop.url() === 'https://radio.xtrata.xyz/radio?dock=1', 'F: it opens the compact radio in its own window (' + pop.url() + ')');
  s = await rr();
  check(!s.open && !s.loaded && !s.src && !s.allow, 'F: the panel is hidden and its copy of the radio is taken down (one radio, no two streams)');
  await page.click('#xa-radio-btn'); await page.waitForTimeout(400);
  s = await rr();
  check(!s.open && !s.src && radioLoads === loadsBefore + 1, 'F: the RADIO button brings the pop-out forward instead of starting a second radio');
  await pop.close(); await page.waitForTimeout(300);
  await page.click('#xa-radio-btn');
  await page.waitForFunction(() => window.XA.radioState().open, null, { timeout: 10000 });
  s = await rr();
  check(s.open && s.loaded && s.src === 'https://radio.xtrata.xyz/radio?dock=1', 'F: once the pop-out is closed, the panel works again');
  // the browser blocks the window: the panel stays, the link opens a tab
  await page.evaluate(() => { window.__realOpen = window.open; window.open = () => null; });
  const [tab] = await Promise.all([ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null), page.click('#xa-radio-open')]);
  await page.waitForTimeout(300);
  s = await rr();
  check(s.open && s.loaded && !!s.src, 'F: if the window is blocked the panel stays up');
  if (tab) await tab.close().catch(() => {});
  await page.evaluate(() => { window.open = window.__realOpen; });
  // G  now playing + transport, and the panel's hand-over to the pop-out
  const stubFrame = () => page.frames().find((f) => /radio\.xtrata\.xyz/.test(f.url()));
  if (!(await rr()).open) { await page.click('#xa-radio-btn'); await page.waitForTimeout(300); }
  check((await rr()).open && !!(await rr()).src, 'G: the panel is open (the radio loads again)');
  await page.waitForFunction(() => window.XA.radioState().now && window.XA.radioState().now.src === 'panel', null, { timeout: 15000 });
  s = await rr();
  check(s.now.title === 'Test Song' && s.now.artist === 'Test Artist' && s.now.playing, 'G: the hall hears what the radio is playing (the radio answered the hall\'s hello)');
  check(!s.np.shown, 'G: while the panel is open the strip is not shown (the panel has its own controls)');
  await page.click('#xa-radio-hide'); await page.waitForTimeout(500);
  s = await rr();
  check(s.np.shown && /Test Song/.test(s.np.text) && /Test Artist/.test(s.np.text), 'G: with the panel shut, a now-playing strip shows the song (' + s.np.text + ')');
  check(s.np.playing === '\u23F8', 'G: and a pause button while it plays');
  const logOf = (fr) => fr.evaluate(() => window.__log.map((m) => m.type + (m.cmd ? ':' + m.cmd : '')));
  await page.click('#xa-radio-np [data-cmd=next]'); await page.waitForTimeout(300);
  await page.click('#xa-radio-np [data-cmd=toggle]'); await page.waitForTimeout(300);
  const lg = await logOf(stubFrame());
  check(lg[0] === 'hello' && lg.includes('cmd:next') && lg.includes('cmd:toggle'), 'G: the strip\'s next and play/pause reach the radio (' + lg.join(',') + ')');
  await stubFrame().evaluate(() => window.sendState({ title: 'Second Song', artist: '', playing: false, on: true })); await page.waitForTimeout(700);
  s = await rr();
  check(/Second Song/.test(s.np.text) && s.np.playing === '\u25B6', 'G: it follows the radio: new song, and a play button when paused');
  // a message that is not from the radio's own origin is ignored
  await page.evaluate(() => window.postMessage({ xtrataRadio: 1, type: 'state', title: 'EVIL', playing: true, on: true }, '*')); await page.waitForTimeout(600);
  check(!/EVIL/.test((await rr()).np.text), 'G: a message from any other origin is ignored');
  // the panel's heart / wallet controls hand over to the pop-out
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  const [pop2] = await Promise.all([ctx.waitForEvent('page'), stubFrame().evaluate(() => window.sendNeed())]);
  await pop2.waitForLoadState('domcontentloaded').catch(() => {});
  s = await rr();
  check(pop2.url() === 'https://radio.xtrata.xyz/radio?dock=1' && !s.open && !s.src, 'G: a heart tap in the panel opens the pop-out and takes the panel\'s radio down');
  await page.waitForFunction(() => window.XA.radioState().now && window.XA.radioState().now.src === 'pop', null, { timeout: 15000 });
  await page.waitForTimeout(600);
  s = await rr();
  check(s.np.shown && /Test Song/.test(s.np.text), 'G: the strip now follows the pop-out');
  await page.click('#xa-radio-np [data-cmd=next]'); await page.waitForTimeout(300);
  const lg2 = await logOf(pop2);
  check(lg2.includes('cmd:next'), 'G: and its buttons control the pop-out (' + lg2.join(',') + ')');
  await pop2.close(); await page.waitForTimeout(900);
  check(!(await rr()).np.shown, 'G: closing the pop-out clears the strip');
  // pop-up blocked: the panel stays and says so
  await page.click('#xa-radio-btn');
  await page.waitForFunction(() => window.XA.radioState().now && window.XA.radioState().now.src === 'panel', null, { timeout: 15000 });
  await page.evaluate(() => { window.__realOpen2 = window.open; window.open = () => null; });
  await stubFrame().evaluate(() => window.sendNeed()); await page.waitForTimeout(500);
  s = await rr();
  check(s.open && /blocked/i.test(s.barNote), 'G: if the pop-up is blocked the panel stays and says to allow pop-ups (' + s.barNote + ')');
  await page.evaluate(() => { window.open = window.__realOpen2; });
  // H  R hotkey: open the radio and free the mouse; R, or the radio's own R/Esc, or HIDE, close it and capture the mouse again (no extra click)
  if ((await rr()).open) { await page.click('#xa-radio-hide'); await page.waitForTimeout(300); }
  await page.evaluate(() => { window.__locks = 0; });
  await page.keyboard.press('KeyR'); await page.waitForTimeout(400);
  check((await rr()).open, 'H: R opens the radio panel');
  await page.keyboard.press('KeyR'); await page.waitForTimeout(400);
  s = await rr();
  check(!s.open && (await page.evaluate(() => window.__locks)) >= 1, 'H: R again hides it and asks for the mouse back (' + (await page.evaluate(() => window.__locks)) + ' capture requests)');
  await page.evaluate(() => { window.__locks = 0; });
  await page.click('#xa-radio-btn'); await page.waitForTimeout(300);
  await page.click('#xa-radio-hide'); await page.waitForTimeout(300);
  check(!(await rr()).open && (await page.evaluate(() => window.__locks)) >= 1, 'H: HIDE puts you back in the hall with the mouse captured');
  await page.keyboard.press('KeyR'); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__locks = 0; });
  await stubFrame().evaluate(() => window.sendHide()); await page.waitForTimeout(500);
  check(!(await rr()).open && (await page.evaluate(() => window.__locks)) >= 1, 'H: R or Esc typed inside the radio panel (which the hall cannot see) hides it too');
  const room0 = await page.evaluate(() => document.getElementById('hroom').title);
  await page.keyboard.press('KeyN'); await page.waitForTimeout(300);
  const room1 = await page.evaluate(() => document.getElementById('hroom').title);
  check(!(await rr()).open && room0 !== room1, 'H: the room-music toggle moved to N (R is the radio): ' + room0 + ' -> ' + room1);
  check(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close(); srv.close();
  console.log('hall radio tests passed: ' + passed);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });

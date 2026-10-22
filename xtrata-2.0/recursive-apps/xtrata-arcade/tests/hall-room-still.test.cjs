// The room's entry still (XA_ROOMS[slug].still): the casino door's open doorway shows a picture of the room's first view as a window (with parallax), and walking in keeps that same
// picture on screen until the live room says it has drawn its first frames ({xa:'room-ready'}). The loading screen only comes if the room is slow.
//   G  the numbers agree  the window is aimed at the casino's own first view; the casino posts room-ready
//   H  the window     an open door to a room with a still shows the picture; shut, it does not; the picture is really drawn (not the dark recess); it moves with you
//   I  the handoff    crossing the threshold: the still fills the screen, no loading screen, the hidden frame is not shown until the room is ready; then the still goes and the room shows
//   J  a room that never says it is ready   it is shown 2.5 s after it loads
// The real casino page needs three.js from a CDN, which the test browser cannot reach: a stub page stands in for it (it posts room-ready the way the casino does).
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-room-still.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const STILL = fs.readFileSync(path.join(__dirname, '..', 'build', 'rooms', 'casino-entry.jpg'));
let readyMs = 800;   // when the stub says it is ready after it loads; -1 = never
const stub = () => '<!doctype html><title>stub casino</title><body style="background:#123;color:#fff"><h1 id="hi">CASINO STUB</h1><script>' + (readyMs >= 0 ? 'setTimeout(function(){parent.postMessage({xa:"room-ready"},"*")},' + readyMs + ');' : '') + '<\/script></body>';

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const LOOKS = {
  2: { kind: 2, name: 'Sign', tier: 0, builtin: 'sign-board', hidden: false, approved: true },
  20: { kind: 0, name: 'Arch door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
};
const door = (interaction, link, layers) => ({ base: 'door', baseId: 2, interaction, doorLook: 20, layers: layers || [], link: link || null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const LOBBY = { 'target-room': 'lobby', 'arrival-bay': 0, path: '' };
const CASINO = { 'target-room': 'casino', 'arrival-bay': 0, path: '' };
const sign = { slot: 2, look: 2, params: '{"text":"casino","sub":"royal flush","tone":"gold"}', state: '' };
const snapshot = () => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [],
  bays: [bay(door(3, LOBBY)), bay(null), bay(null), bay(null)],
  rooms: { lobby: { bays: [bay(door(3, CASINO, [sign])), bay(door(1, null))] } }, looks: LOOKS });

// G  the numbers agree: doors.js aims the window at the casino's own first view, and the casino tells the hall when it is ready
{
  const doors = fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'doors.js'), 'utf8'), room = fs.readFileSync(path.join(__dirname, '..', 'build', 'rooms', 'casino-room.html'), 'utf8');
  const w = /var WIN = \{ dist: ([\d.]+), camZ: ([\d.]+), eye: ([\d.]+), pitch: (-?[\d.]+), fov: (\d+) \}/.exec(doors);
  const at = /player\.x = 0; player\.z = ([\d.]+); player\.yaw = 0; player\.pitch = (-?[\d.]+);/.exec(room), walk = /const WALK = \{ fov: (\d+), eye: ([\d.]+),/.exec(room);
  check(w && at && walk && +w[4] === +at[2] && +w[5] === +walk[1] && +w[3] === +walk[2], 'G: the window\'s eye height, pitch and fov are the casino\'s own startAtDoor view (pitch ' + (at && at[2]) + ', fov ' + (walk && walk[1]) + ')');
  check(/parent\.postMessage\(\{ xa: 'room-ready' \}/.test(room), 'G: the casino posts room-ready to the arcade after its first frames');
}
(async () => {
  const srv = http.createServer((req, res) => {
    if (/entry\.jpg/.test(req.url)) { res.writeHead(200, { 'Content-Type': 'image/jpeg' }); res.end(STILL); return; }
    if (/casino-room\.html/.test(req.url)) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(stub()); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML);
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open() {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
    await ctx.addInitScript((a) => {
      window.XA_TEST = 1;
      Element.prototype.requestPointerLock = function () {};
      window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Royal Flush Casino', still: 'entry.jpg' } };
      window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(a.snap)); } catch (e) {}
    }, { snap: snapshot() });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.click('#go'); await page.waitForTimeout(600);
    return { ctx, page, errors };
  }
  const bayS = (page, i) => page.evaluate((n) => JSON.parse(JSON.stringify(window.XA.bayState().bays[n])), i);
  const rs = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.roomState())));
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png'), timeout: 170000 }); };
  const openDoor = (page, i) => page.evaluate((n) => window.XA.bayDoor(n, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }), i);
  const shutDoor = (page, i) => page.evaluate((n) => window.XA.bayDoor(n, (m) => { m.angle = 0; m.vel = 0; m.mode = 'free'; m.wake(); }), i);
  const face = (page, n, dist, side) => page.evaluate((a) => { const p = window.XA.bayState().bays[a.i].pos; window.XA.pose(p.x + a.d, p.z + a.s, Math.PI / 2, -0.05); }, { i: n, d: dist || 1.6, s: side || 0 });
  const steer = (page) => page.evaluate(() => { const w = window.XA.where(); window.XA.pose(w.x, w.z, Math.PI / 2, -0.05); });
  async function walkInto(page, done) {
    await page.keyboard.down('KeyW');
    try { for (let i = 0; i < 400 && !(await page.evaluate(done)); i++) { await steer(page); await page.waitForTimeout(250); } } finally { await page.keyboard.up('KeyW'); }
  }
  async function intoLobby(page) {
    await openDoor(page, 0);
    await page.waitForFunction(() => window.XA.lobbyState().open === true, null, { timeout: 120000 });
    await page.evaluate(() => window.XA.pose(-8, -13.1, -Math.PI / 2, -0.05));
    await page.waitForFunction(() => window.XA.lobbyState().inside === true, null, { timeout: 120000 });
  }
  // brightness and spread of a rectangle of the screen (measured in a scratch page, from a screenshot)
  async function region(page, clip) {
    const buf = await page.screenshot({ clip, timeout: 170000 });
    const p2 = await page.context().newPage();
    const r = await p2.evaluate(async (b64) => {
      const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data; let s = 0, s2 = 0, n = d.length / 4, R = 0, G = 0, B = 0;
      for (let i = 0; i < d.length; i += 4) { const l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; s += l; s2 += l * l; R += d[i]; G += d[i + 1]; B += d[i + 2]; }
      const m = s / n; return { mean: m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)), r: R / n, g: G / n, b: B / n };
    }, buf.toString('base64'));
    await p2.close(); return r;
  }

  {
    const { ctx, page, errors } = await open();
    await intoLobby(page);
    await face(page, 4); await page.waitForTimeout(1200);
    /* ---- H ---- */
    let b = await bayS(page, 4);
    check(b.window && b.window.url === 'entry.jpg', 'H: the casino door has a window onto its still (' + JSON.stringify(b.window && b.window.url) + ')');
    check(b.window && b.window.visible === false, 'H: with the door shut the window is not drawn');
    await openDoor(page, 4); await face(page, 4);
    await page.waitForFunction(() => { const w = window.XA.bayState().bays[4].window; return w && w.ready && w.visible; }, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    check(true, 'H: with the door open the picture has loaded and the window is drawn');
    await shot(page, 'still-near');
    const mid = { x: 450, y: 250, width: 200, height: 300 };
    const near = await region(page, mid);
    check(near.mean > 40 && near.sd > 18 && near.g > 25, 'H: the doorway shows the room (mean ' + near.mean.toFixed(0) + ', spread ' + near.sd.toFixed(0) + ', rgb ' + [near.r, near.g, near.b].map((v) => v.toFixed(0)) + ')');
    await face(page, 4, 1.6, 0.4); await page.waitForTimeout(800); await shot(page, 'still-side');
    const side = await region(page, mid);
    check(Math.abs(side.r - near.r) + Math.abs(side.g - near.g) + Math.abs(side.b - near.b) > 1.5, 'H: the picture moves as you do (the view through the doorway changes when you step aside)');
    await face(page, 4, 4.5); await page.waitForTimeout(800); await shot(page, 'still-far');
    const far = await bayS(page, 4);
    check(far.window && far.window.visible && far.window.cam[2] > 3, 'H: it is still drawn from a few metres back, the eye measured in the door\'s own space (z ' + (far.window && far.window.cam[2].toFixed(1)) + ')');
    await shutDoor(page, 4); await page.waitForTimeout(2500);
    b = await bayS(page, 4);
    check(b.window && b.window.visible === false, 'H: shutting the door takes the window away again');
    await openDoor(page, 4); await face(page, 4); await page.waitForTimeout(1200);
    /* ---- I ---- */
    readyMs = 1500;
    await page.waitForFunction(() => window.XA.roomState().frame === true, null, { timeout: 120000 });
    await page.waitForFunction(() => { const f = document.querySelector('iframe[title="Royal Flush Casino"]'); return f && f.dataset.loaded === '1'; }, null, { timeout: 120000 });
    await walkInto(page, () => window.XA.roomState().state === 'room');
    let r = await rs(page);
    check(r.state === 'room' && r.still === true && r.loading === false, 'I: crossing the threshold puts the still on screen, with no loading screen');
    await shot(page, 'still-handoff');
    const bg = await page.evaluate(() => { const s = [...document.querySelectorAll('div')].find((d) => /entry\.jpg/.test(d.style.backgroundImage)); return s ? { img: s.style.backgroundImage, z: s.style.zIndex } : null; });
    check(bg && /entry\.jpg/.test(bg.img), 'I: the picture is the room\'s entry still');
    await page.waitForFunction(() => window.XA.roomState().back === true, null, { timeout: 120000 });
    r = await rs(page);
    check(r.ready === true && r.back && r.loading === false, 'I: the room said it was ready and BACK TO THE LOBBY is showing (the loading screen never came)');
    await page.waitForTimeout(800);
    r = await rs(page);
    const vis = await page.evaluate(() => getComputedStyle(document.querySelector('iframe[title="Royal Flush Casino"]')).visibility);
    check(vis === 'visible' && r.still === false, 'I: the live room is showing and the still has gone');
    check((await page.evaluate(() => getComputedStyle(document.getElementById('hallbar')).visibility)) === 'hidden', 'I: the hall\'s own buttons stay out of the room');
    await page.click('text=BACK TO THE LOBBY');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    r = await rs(page);
    check(!r.still && !r.frame && !r.loading, 'I: going back leaves no still behind');
    check((await page.evaluate(() => getComputedStyle(document.getElementById('hallbar')).visibility)) !== 'hidden', 'I: and the hall\'s buttons come back');
    check(!errors.length, 'H-I: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- J ---- */
    readyMs = -1;
    const { ctx, page, errors } = await open();
    await intoLobby(page); await face(page, 4); await openDoor(page, 4); await face(page, 4);
    await page.waitForFunction(() => { const f = document.querySelector('iframe[title="Royal Flush Casino"]'); return f && f.dataset.loaded === '1'; }, null, { timeout: 120000 });
    const t0 = Date.now();
    await walkInto(page, () => window.XA.roomState().state === 'room');
    check((await rs(page)).still === true, 'J: the still is up');
    await page.waitForFunction(() => window.XA.roomState().back === true, null, { timeout: 120000 });
    check((await rs(page)).ready === false, 'J: a room that never says it is ready is shown anyway, a moment after it loaded (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
    check(!errors.length, 'J: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log('hall room still tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

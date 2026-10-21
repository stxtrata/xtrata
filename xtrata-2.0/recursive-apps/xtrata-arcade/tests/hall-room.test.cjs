// The lobby's CASINO door and the full-screen takeover (no button anywhere: you walk through the open door). The lobby has two doorways of its own on its back wall (bays 4 and 5, read from the
// world contract's 'lobby' room). A door linking to a room named in window.XA_ROOMS opens that room's page over the whole screen after a short
// loading screen; the hall sleeps, and BACK TO THE LOBBY (or the room telling the hall it is done) puts you back in front of the door.
//   A  the lobby's doors       bays 4 and 5 exist, the casino door has a door and its sign, the staff door is a plain knock door
//   B  going in                the open door starts loading the page quietly; walking into it: loading screen, then the page full screen, hall asleep, back button
//   C  going back              BACK TO THE LOBBY removes the page; you come out of the door, a step in front of it, and walk again
//   D  the room can leave too  the page posts {xa:'leave-room'} and the hall takes you back the same way
//   E  not configured          without XA_ROOMS the door says it is not open yet, and no page opens
// The real casino page needs three.js from a CDN, which the test browser cannot reach: a stub page stands in for it.
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-room.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const STUB = '<!doctype html><title>stub casino</title><body style="background:#123;color:#fff"><h1 id="hi">CASINO STUB</h1><button id="leave" onclick="parent.postMessage({xa:\'leave-room\'},\'*\')">leave</button></body>';

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

(async () => {
  const srv = http.createServer((req, res) => {
    if (/casino-room\.html/.test(req.url)) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(STUB); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML);
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open(rooms) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
    await ctx.addInitScript((a) => {
      window.XA_TEST = 1;
      Element.prototype.requestPointerLock = function () {};   // (the headless browser grants the lock and reports a mouse jump when it does; these tests are about walking, not the mouse)
      if (a.rooms) window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Royal Flush Casino' } };
      window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(a.snap)); } catch (e) {}
    }, { rooms, snap: snapshot() });
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
  const hint = (page) => page.evaluate(() => { const e = document.getElementById('bprompt'); return e && !e.hidden ? e.textContent : ''; });
  // the headless browser nudges the view now and then, so stand in place again until the prompt shows
  const until = async (page, pose, re) => { for (let i = 0; i < 40; i++) { await pose(); await page.waitForTimeout(1200); if (re.test(await hint(page))) return; } throw new Error('the prompt never showed: ' + re + ' (last: ' + (await hint(page)) + ')'); };
  // stand 1.6 m in front of lobby bay n, looking at its door (the lobby is behind the left wall: its back wall faces the hall, towards +x)
  const face = (page, n) => page.evaluate((i) => { const p = window.XA.bayState().bays[i].pos; window.XA.pose(p.x + 1.6, p.z, Math.PI / 2, -0.05); }, n);
  // hold W towards the door (the headless view drifts a little, so steer back on every try) until done() is true
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

  {
    const { ctx, page, errors } = await open(true);
    await intoLobby(page);
    /* ---- A ---- */
    const s = await page.evaluate(() => JSON.parse(JSON.stringify(window.XA.bayState())));
    check(s.bays.length === 6, 'A: the hall has its four bays and the lobby two');
    const c = await bayS(page, 4), k = await bayS(page, 5);
    check(c.visible && c.door === true && c.overlays >= 1, 'A: lobby bay 4 (CASINO) has its door slab and its sign');
    check(k.visible && k.door === true, 'A: lobby bay 5 is a door too (the staff door)');
    check(Math.abs(c.pos.z - k.pos.z) > 3 && c.pos.x < -14, 'A: the two doors stand apart on the lobby\'s back wall (x ' + c.pos.x.toFixed(1) + ', z ' + c.pos.z.toFixed(1) + ' / ' + k.pos.z.toFixed(1) + ')');
    await face(page, 4); await page.waitForTimeout(1500);
    await shot(page, 'room-casino-door');
    /* ---- B ---- */
    await face(page, 4); await page.waitForTimeout(800);
    check((await rs(page)).state === 'walk' && !(await rs(page)).frame, 'B: with the casino door shut nothing is loading');
    await openDoor(page, 4);
    await page.waitForFunction(() => window.XA.roomState().frame === true, null, { timeout: 120000 });
    check((await rs(page)).state === 'walk', 'B: opening the door starts loading the casino page quietly (you are still walking)');
    await page.waitForFunction(() => { const f = document.querySelector('iframe[title="Royal Flush Casino"]'); return f && f.dataset.loaded === '1'; }, null, { timeout: 120000 });
    await face(page, 4);
    check(!/ENTER/.test(await hint(page)), 'B: there is no ENTER prompt at the open door: you just walk in');
    await shot(page, 'room-open-door');
    await walkInto(page, () => window.XA.roomState().state === 'room');
    let r = await rs(page);
    check(r.state === 'room' && r.room === 'casino' && r.frame && /^casino-room\.html\?from=arcade$/.test(r.frameSrc), 'B: walking into the open doorway takes the screen: the casino page is framed (' + r.frameSrc + ')');
    await shot(page, 'room-loading');
    await page.waitForFunction(() => window.XA.roomState().back === true && !window.XA.roomState().loading, null, { timeout: 120000 });
    r = await rs(page);
    check(r.state === 'room' && r.back && !r.loading, 'B: the loading screen is gone and BACK TO THE LOBBY is showing');
    const fr = page.frames().find((f) => /casino-room\.html/.test(f.url()));
    check(!!fr && (await fr.textContent('#hi')) === 'CASINO STUB', 'B: the page inside the frame is the casino page');
    const vis = await page.evaluate(() => { const f = document.querySelector('iframe[title="Royal Flush Casino"]'); const b = f.getBoundingClientRect(); return { w: b.width, h: b.height, v: getComputedStyle(f).visibility }; });
    check(vis.v === 'visible' && vis.w === 1100 && vis.h === 700, 'B: the frame covers the whole screen (' + vis.w + 'x' + vis.h + ')');
    await shot(page, 'room-inside');
    /* ---- C ---- */
    await page.click('text=BACK TO THE LOBBY');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    r = await rs(page);
    check(!r.frame && !r.back && !r.loading && r.room === '', 'C: BACK TO THE LOBBY removes the page and the player walks again');
    check((await page.evaluate(() => document.querySelectorAll('iframe[title="Royal Flush Casino"]').length)) === 0, 'C: no frame is left behind');
    const w = await page.evaluate(() => window.XA.where());
    check(Math.abs(w.x - (c.pos.x + 1.2)) < 0.05 && Math.abs(w.z - c.pos.z) < 0.05 && (await page.evaluate(() => window.XA.lobbyState().inside)), 'C: you come back out of the door, a step in front of it and in the lobby (x ' + w.x.toFixed(2) + ', z ' + w.z.toFixed(2) + ')');
    check(Math.abs(Math.sin(w.yaw) + 1) < 0.05, 'C: facing away from the door, into the lobby (yaw ' + w.yaw.toFixed(2) + ')');
    /* ---- D ---- */
    await walkInto(page, () => window.XA.roomState().state === 'room');
    await page.waitForFunction(() => window.XA.roomState().state === 'room' && window.XA.roomState().back, null, { timeout: 120000 });
    const fr2 = page.frames().find((f) => /casino-room\.html/.test(f.url()));
    await fr2.click('#leave');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    check(true, 'D: the room telling the hall it is done brings you back the same way');
    // the staff door is not a room
    await face(page, 5); await openDoor(page, 5); await page.waitForTimeout(800);
    await walkInto(page, () => { const w = window.XA.where(), p = window.XA.bayState().bays[5].pos; return w.x - p.x < 0.7; });
    await page.waitForTimeout(800);
    check((await rs(page)).state === 'walk', 'D: walking into the other lobby door does not open a room');
    check(!errors.length, 'A-D: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- E ---- */
    const { ctx, page, errors } = await open(false);
    await intoLobby(page);
    await openDoor(page, 4);
    await face(page, 4); await page.waitForTimeout(800);
    // the toast only shows for a few seconds and the headless frames are slow, so watch for it rather than poll
    await page.evaluate(() => { window.__toast = false; new MutationObserver(() => { const e = document.getElementById('bprompt'); if (e && !e.hidden && /NOT OPEN YET/.test(e.textContent)) window.__toast = true; }).observe(document.getElementById('bprompt'), { subtree: true, childList: true, characterData: true, attributes: true }); });
    await walkInto(page, () => window.__toast === true);
    check(await page.evaluate(() => window.__toast === true), 'E: walking into the casino door says it is not open yet');
    check((await rs(page)).state === 'walk' && !(await rs(page)).frame, 'E: with no XA_ROOMS the casino door opens no page and loads nothing');
    check(!errors.length, 'E: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log('hall room tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

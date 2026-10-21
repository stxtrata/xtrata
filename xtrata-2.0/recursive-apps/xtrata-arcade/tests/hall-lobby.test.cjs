// The bare lobby: a real room built behind the wall of a door that links to it (target-room 'lobby', interaction 3). When the door opens its
// doorway shows the room (stencil cut-out) and the player walks in: no fade, no teleport. Real hall (dist single file) in Chromium.
//   A  the room is there      a door linking to the lobby puts the lobby behind its wall; closed, the doorway is not a portal
//   B  open                   the open door becomes a portal; no prompt, you just walk in
//   C  walking in             W walks through the doorway into the room, the view never jumps (x changes smoothly), walls stop you inside
//   D  held open              inside, the door stays open; walking back out works
//   E  other links            a door to some other room still says "not open yet", and without a lobby door there is no lobby
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-lobby.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const LOOKS = {
  2: { kind: 2, name: 'Sign', tier: 0, builtin: 'sign-board', hidden: false, approved: true },
  20: { kind: 0, name: 'Arch door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
};
const door = (interaction, link) => ({ base: 'door', baseId: 2, interaction, doorLook: 20, layers: [], link: link || null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const snapshot = (bays) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays, looks: LOOKS });
const LOBBY = { 'target-room': 'lobby', 'arrival-bay': 0, path: '' };

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open(snap) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
    await ctx.addInitScript((s) => {
      window.XA_TEST = 1;
      window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(s)); } catch (e) {}
    }, snap);
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
  const ls = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.lobbyState())));
  const bay0 = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.bayState().bays[0])));
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png'), timeout: 170000 }); };
  const openDoor = (page, i) => page.evaluate((n) => window.XA.bayDoor(n, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }), i);
  const hint = (page) => page.evaluate(() => { const e = document.getElementById('bprompt'); return e && !e.hidden ? e.textContent : ''; });
  // the headless browser nudges the view now and then, so stand in place again until the prompt shows
  const until = async (page, pose, re) => { for (let i = 0; i < 40; i++) { await pose(); await page.waitForTimeout(1200); if (re.test(await hint(page))) return; } throw new Error('the prompt never showed: ' + re); };
  // hold W towards the door (the headless view drifts a little, so face the same way again on every try) until done() is true
  async function walkOn(page, done) {
    await page.keyboard.down('KeyW');
    try { for (let i = 0; i < 400 && !(await page.evaluate(done)); i++) { await page.evaluate(() => { const w = window.XA.where(); window.XA.pose(w.x, w.z, Math.PI / 2, -0.05); }); await page.waitForTimeout(250); } } finally { await page.keyboard.up('KeyW'); }
  }
  const face = (page, d) => page.evaluate((dd) => { const p = window.XA.bayState().bays[0].pos; window.XA.pose(p.x + dd, p.z, Math.PI / 2, -0.05); }, d || 1.5);

  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1 + 2, LOBBY)), bay(null), bay(null), bay(null)]));
    /* ---- A ---- */
    let s = await ls(page);
    check(s.bay === 0 && s.visible && s.pass.side === -1 && s.pass.wallX === -5, 'A: a door linking to the lobby puts the lobby behind the wall of bay 0');
    check(s.stencil, 'A: the renderer has a stencil buffer');
    check(s.open === false && (await bay0(page)).portal === false, 'A: closed, the doorway is plain (not a portal)');
    /* ---- B ---- */
    await face(page, 1.5);
    await openDoor(page, 0);
    await page.waitForFunction(() => window.XA.lobbyState().open === true, null, { timeout: 120000 });
    check((await bay0(page)).portal === true, 'B: the open door is a portal');
    await face(page, 1.5); await page.waitForTimeout(1500);
    check(!/ENTER/.test(await hint(page)), 'B: looking through the open door shows no ENTER prompt: you just walk in');
    await shot(page, 'lobby-through-door');
    /* ---- C ---- */
    const xs = [];
    await walkOn(page, () => window.XA.where().x < -7.2);
    await page.waitForFunction(() => window.XA.lobbyState().inside === true, null, { timeout: 180000 });
    await page.waitForFunction(() => window.XA.where().x < -7, null, { timeout: 180000 });
    const w = await page.evaluate(() => window.XA.where());
    check(w.x < -7 && Math.abs(w.z - (-13.135)) < 0.3, 'C: walking forward took the player through the doorway into the lobby (x ' + w.x.toFixed(2) + ', z ' + w.z.toFixed(2) + ')');
    await page.waitForTimeout(800);
    await shot(page, 'lobby-inside');
    // walls hold you in the lobby
    await page.evaluate(() => window.XA.pose(-40, -13.1, -Math.PI / 2, 0));
    await page.waitForFunction(() => window.XA.where().x > -15.0, null, { timeout: 120000 });
    const far = await page.evaluate(() => window.XA.where());
    check(far.x >= -14.9 && far.x <= -14.8, 'C: the far lobby wall stops the player (x ' + far.x.toFixed(2) + ')');
    await page.evaluate(() => window.XA.pose(-9, -30, 0, 0));
    await page.waitForFunction(() => window.XA.where().z > -17.2, null, { timeout: 120000 });
    check((await page.evaluate(() => window.XA.where().z)) <= -9.0, 'C: the lobby side wall stops the player');
    /* ---- D ---- */
    check((await ls(page)).open === true, 'D: inside the lobby the door is still open');
    await page.evaluate(() => window.XA.pose(-8, -13.1, -Math.PI / 2, -0.05));
    await page.waitForTimeout(500);
    await shot(page, 'lobby-looking-back');
    await page.evaluate(() => window.XA.pose(-5.4, -13.1, -Math.PI / 2, -0.05));
    for (let i = 0; i < 80; i++) { await page.keyboard.down('KeyW'); await page.waitForTimeout(200); if ((await page.evaluate(() => window.XA.where().x)) > -4.6) break; }
    await page.keyboard.up('KeyW');
    check((await page.evaluate(() => window.XA.where().x)) > -4.7, 'D: walking forward carries the player back out into the hall');
    check(!errors.length, 'A-D: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- E ---- */
    const { ctx, page, errors } = await open(snapshot([bay(door(3, { 'target-room': 'vault', 'arrival-bay': 0, path: '' })), bay(null), bay(null), bay(null)]));
    const s = await ls(page);
    check(s.bay === -1 && s.visible === false, 'E: a door to some other room builds no lobby');
    await face(page, 1.5); await openDoor(page, 0); await page.waitForTimeout(800);
    await page.evaluate(() => { window.__toast = false; new MutationObserver(() => { const e = document.getElementById('bprompt'); if (e && !e.hidden && /THIS DOOR LEADS TO VAULT . NOT OPEN YET/.test(e.textContent)) window.__toast = true; }).observe(document.getElementById('bprompt'), { subtree: true, childList: true, characterData: true, attributes: true }); });
    await walkOn(page, () => window.__toast === true);
    assert(await page.evaluate(() => window.__toast === true), 'the not-open-yet line never showed');
    check(true, 'E: walking into it says the door leads to VAULT and is not open yet');
    check(!errors.length, 'E: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

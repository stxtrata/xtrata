// Phase 3b: the Threshold doors inside the real hall (dist single file) in Chromium. The chain is never reached; scenes are pushed
// through the reader's own listener list, as hall-bays.test.cjs does.
//   H  a locked door (interaction 1)    a real door is built in the bay (style from the door look), KNOCK ON THE DOOR, E knocks
//   I  an unlocked door (interaction 2) OPEN THE DOOR, E starts it opening, then CLOSE THE DOOR; a hidden curtain stops it being usable
//   J  going live                        locked -> unlocked on a push (the lock sound plays), unlocked -> locked closes it again
//   K  a door that leads somewhere       looking through an open door shows ENTER; E shows "THIS DOOR LEADS TO <ROOM> · NOT OPEN YET"
//   L  door styles and clean-up          a different door look rebuilds the door; back to posters removes it, no errors
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-doors.test.cjs
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
  1: { kind: 1, name: 'House curtain', tier: 0, builtin: 'curtain-house', hidden: false, approved: true },
  2: { kind: 2, name: 'Sign', tier: 0, builtin: 'sign-board', hidden: false, approved: true },
  20: { kind: 0, name: 'Arch door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
  21: { kind: 0, name: 'Gothic door', tier: 0, builtin: 'door-gothic', hidden: false, approved: true },
};
const layer = (slot, look, params, state) => ({ slot, look, params: params || '{}', state: state || '' });
const door = (interaction, doorLook, layers, link) => ({ base: 'door', baseId: 2, interaction, doorLook, layers: layers || [], link: link || null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const snapshot = (bays) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays, looks: LOOKS });

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
  const bays = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.bayState())));
  const push = (page, snap) => page.evaluate((s) => { const st = window.XAWorld._t.state; st.snap = s; st.listeners.forEach((fn) => fn(s, 'chain')); }, snap);
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png') }); };
  const face = (page, d) => page.evaluate((dd) => { const p = window.XA.bayState().bays[0].pos; window.XA.pose(p.x + dd, p.z, Math.PI / 2, -0.05); }, d || 1.8);
  const away = (page) => page.evaluate(() => { const p = window.XA.bayState().bays[0].pos; window.XA.pose(p.x + 1.8, p.z, -Math.PI / 2, 0); });
  const hint = (page) => page.evaluate(() => { const e = document.getElementById('bprompt'); return e && !e.hidden ? e.textContent : ''; });
  const waitHint = (page, re) => page.waitForFunction((src) => { const e = document.getElementById('bprompt'); return e && !e.hidden && new RegExp(src).test(e.textContent); }, re.source, { timeout: 30000 });
  const model = (page, fn) => page.evaluate(fn);

  /* ---- H: a locked door ---- */
  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1, 20)), bay(null)]));
    const b0 = (await bays(page)).bays[0];
    check(b0.visible && b0.door === true && b0.doorState && b0.doorState.style === 'arch', 'H: bay 0 holds a real door in the arch style from its door look');
    check(b0.doorState.locked === true && b0.doorState.angle === 0, 'H: it is locked and closed');
    await face(page);
    await waitHint(page, /KNOCK ON THE DOOR/);
    check(true, 'H: looking at it shows KNOCK ON THE DOOR');
    await shot(page, 'doors-H-locked');
    const log0 = (await bays(page)).log.length;
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(400);
    const s1 = (await bays(page)).bays[0].doorState;
    check(s1.locked === true && s1.angle < 1 && !s1.open, 'H: knocking does not open a locked door');
    await away(page);
    await page.waitForFunction(() => document.getElementById('bprompt').hidden, null, { timeout: 30000 });
    check(true, 'H: the prompt goes when you look away');
    check(!errors.length, 'H: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- I and J: unlocked doors, and going live ---- */
  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1, 20)), bay(null)]));
    await face(page);
    await push(page, snapshot([bay(door(2, 20)), bay(null)]));
    await page.waitForFunction(() => window.XA.bayState().bays[0].doorState.locked === false, null, { timeout: 30000 });
    check(true, 'J: a live push from locked to peek unlocks the door');
    await waitHint(page, /OPEN THE DOOR/);
    check(true, 'I: an unlocked door says OPEN THE DOOR');
    await page.keyboard.press('KeyE');
    await page.waitForFunction(() => window.XA.bayState().bays[0].doorState.open === true, null, { timeout: 30000 });
    await page.waitForFunction(() => window.XA.bayState().bays[0].doorState.angle > 2, null, { timeout: 60000 });
    check(true, 'I: E starts it opening and the leaf swings (software rendering is slow, so progress is checked, not completion)');
    await waitHint(page, /CLOSE THE DOOR/);
    check(true, 'I: an open door says CLOSE THE DOOR');
    await shot(page, 'doors-I-opening');
    // a closed curtain hides the door, so it cannot be used
    await push(page, snapshot([bay(door(2, 20, [layer(1, 1, '{"color":"#7a1020"}', 'closed')])), bay(null)]));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.XA.bayDoor(0, (m) => { m.angle = 0; m.vel = 0; m.pendingOpen = false; m.mode = 'free'; m.wake(); }));
    await page.waitForTimeout(1500);
    check(!/DOOR/.test(await hint(page)), 'I: behind a closed curtain the door gives no prompt (hint is "' + (await hint(page)) + '")');
    // going live the other way: locked again, an open door is closed first
    await push(page, snapshot([bay(door(1, 20)), bay(null)]));
    await page.waitForFunction(() => window.XA.bayState().bays[0].doorState.locked === true, null, { timeout: 30000 });
    check(true, 'J: a live push back to knock-only locks the door again');
    check(!errors.length, 'I/J: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- K: a door that leads somewhere ---- */
  {
    const link = { 'target-room': 'lobby', 'arrival-bay': 0, path: '' };
    const { ctx, page, errors } = await open(snapshot([bay(door(3, 21, [], link)), bay(null)]));
    await face(page, 1.5);
    await page.evaluate(() => window.XA.bayDoor(0, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }));
    await waitHint(page, /ENTER/);
    check(true, 'K: looking through the open door of an enter scene shows ENTER');
    await shot(page, 'doors-K-enter');
    await page.keyboard.press('KeyE');
    await waitHint(page, /THIS DOOR LEADS TO LOBBY . NOT OPEN YET/);
    check(true, 'K: E says where the door leads and that it is not open yet');
    check(!errors.length, 'K: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- L: styles and clean-up ---- */
  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1, 20)), bay(null)]));
    await push(page, snapshot([bay(door(1, 21)), bay(null)]));
    await page.waitForFunction(() => window.XA.bayState().bays[0].doorState && window.XA.bayState().bays[0].doorState.style === 'gothic', null, { timeout: 30000 });
    check(true, 'L: a different door look rebuilds the door in the new style');
    await push(page, snapshot([bay({ base: 'posters', baseId: 0, interaction: 0, doorLook: null, layers: [], link: null, fromHeight: 0 }), bay(null)]));
    await page.waitForTimeout(500);
    const gone = (await bays(page)).bays[0];
    check(!gone.door && gone.doorState === null, 'L: back to posters removes the door');
    check(!errors.length, 'L: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close(); srv.close();
  console.log('hall doors tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

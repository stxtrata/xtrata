// The bare lobby: a real room built behind the wall of a door that links to it (target-room 'lobby', interaction 3). When the door opens its
// doorway shows the room (stencil cut-out) and the player walks in: no fade, no teleport. Real hall (dist single file) in Chromium.
//   A  the room is there      a door linking to the lobby puts the lobby behind its wall; closed, the doorway is not a portal
//   B  open                   the open door becomes a portal; no prompt, you just walk in
//   C  walking in             W walks through the doorway into the room, the view never jumps (x changes smoothly), walls stop you inside
//   D  held open              inside, the door stays open; walking back out works
//   E  other links            a door to some other room still says "not open yet", and without a lobby door there is no lobby
//   F  two doorways           the lobby's two doorways stand exactly where they always did (BASELINE=<older dist html> also compares the picture)
//   G  six doorways           two on the back wall, two on each side wall: all drawn, none overlapping, each one walked through and back
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
const door = (interaction, link, layers) => ({ base: 'door', baseId: 2, interaction, doorLook: 20, layers: layers || [], link: link || null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const snapshot = (bays) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays, looks: LOOKS });
const LOBBY = { 'target-room': 'lobby', 'arrival-bay': 0, path: '' };

(async () => {
  const STUB = '<!doctype html><title>stub room</title><body style="background:#123;color:#fff"><h1>ROOM</h1></body>';
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(/casino-room\.html/.test(req.url) ? STUB : HTML); });
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
  /* ---- F, G: the lobby's doorways come from how many it has ---- */
  const lobbyDoor = (i) => bay(door(3, { 'target-room': 'casino', 'arrival-bay': 0, path: '' }, [{ slot: 2, look: 2, params: JSON.stringify({ text: 'door ' + i }), state: '' }]));
  const lobbySnap = (n) => Object.assign(snapshot([bay(door(3, LOBBY)), bay(null), bay(null), bay(null)]), { rooms: { lobby: { bays: Array.from({ length: n }, (_, i) => lobbyDoor(i)) } } });
  const geometry = (page) => page.evaluate(() => { const s = window.XA.bayState(); return s.bays.slice(4).map((b, k) => ({ visible: b.visible, door: b.door, pos: b.pos, frame: window.XA.doorFrame(4 + k) })); });
  // where the two lobby doorways always were (hall.js before the count: x -2.2 / 2.2 on the back wall, facing the way in), in world space
  // for a lobby behind bay 0: the lobby's frame is rotated -90 degrees about y and stands at the hall's left wall
  async function walkThrough(page, i) {
    await openDoor(page, i); await page.waitForTimeout(500);
    const pose = () => page.evaluate((n) => { const p = window.XA.bayState().bays[n].pos, f = window.XA.doorFrame(n); window.XA.pose(p.x + f.nx * 1.6, p.z + f.nz * 1.6, Math.atan2(f.nx, f.nz), -0.05); }, i);
    await pose(); await page.waitForTimeout(600);
    await page.keyboard.down('KeyW');
    try {
      for (let k = 0; k < 300 && (await page.evaluate(() => window.XA.roomState().state)) !== 'room'; k++) {
        await page.evaluate((n) => { const w = window.XA.where(), f = window.XA.doorFrame(n); window.XA.pose(w.x, w.z, Math.atan2(f.nx, f.nz), -0.05); }, i);
        await page.waitForTimeout(250);
      }
    } finally { await page.keyboard.up('KeyW'); }
    await page.waitForFunction(() => window.XA.roomState().state === 'room' && window.XA.roomState().back, null, { timeout: 120000 });
    await page.click('#xa-room-back');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    return page.evaluate((n) => { const w = window.XA.where(), p = window.XA.bayState().bays[n].pos, f = window.XA.doorFrame(n); return { d: Math.hypot(w.x - (p.x + f.nx * 1.2), w.z - (p.z + f.nz * 1.2)), inside: window.XA.lobbyState().inside }; }, i);
  }
  {
    /* ---- F: two doorways, exactly as before ---- */
    const { ctx, page, errors } = await open(lobbySnap(2));
    await page.evaluate(() => { window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Casino' } }; });
    const g = await geometry(page);
    check(g.length === 2, 'F: with two lobby bays the engine still has six bays (the hall four, the lobby two)');
    // the old constants: the lobby frame is at (wallX - WALL_T, 0, z) rotated by -PI/2 (lobby behind the left wall); a back-wall door at (x, LD - .02)
    const ls0 = await ls(page), LD = 10, WT = 0.2;
    const old = [-2.2, 2.2].map((x) => ({ x: ls0.pass.wallX - WT - (LD - 0.02), z: ls0.pass.z + x }));
    check(g.every((b, k) => b.visible && b.door && Math.abs(b.frame.x - old[k].x) < 1e-6 && Math.abs(b.frame.z - old[k].z) < 1e-6 && Math.abs(b.frame.nx - 1) < 1e-6 && Math.abs(b.frame.nz) < 1e-6),
      'F: the two doorways stand exactly where they always did, on the back wall facing the way in (' + g.map((b) => b.frame.x.toFixed(3) + ',' + b.frame.z.toFixed(3)).join(' / ') + ')');
    if (process.env.BASELINE) {
      // optional: the same view in an older build (BASELINE=<a dist/xtrata-arcade-v*.html from before this change>) is the same picture
      await openDoor(page, 0);
      await page.waitForFunction(() => window.XA.lobbyState().open === true, null, { timeout: 120000 });
      await page.evaluate(() => window.XA.pose(-6.5, -13.135, -Math.PI / 2, -0.02)); await page.waitForTimeout(2500);
      const a = await page.screenshot({ clip: { x: 150, y: 100, width: 800, height: 500 } });
      await page.close();   // (one WebGL hall at a time: two software-rendered halls side by side starve each other)
      const bsrv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(fs.readFileSync(process.env.BASELINE)); });
      await new Promise((r) => bsrv.listen(0, r));
      const c2 = await browser.newContext({ viewport: { width: 1100, height: 700 } });
      await c2.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
      await c2.addInitScript((s) => { window.XA_TEST = 1; window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' }; try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(s)); } catch (e) {} }, lobbySnap(2));
      const p2 = await c2.newPage();
      await p2.goto('http://127.0.0.1:' + bsrv.address().port + '/', { timeout: 180000, waitUntil: 'domcontentloaded' });
      await p2.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
      await p2.waitForTimeout(1500); await p2.click('#go'); await p2.waitForTimeout(600);
      await p2.evaluate(() => window.XA.bayDoor(0, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }));
      await p2.waitForFunction(() => window.XA.lobbyState().open === true, null, { timeout: 120000 });
      await p2.evaluate(() => window.XA.pose(-6.5, -13.135, -Math.PI / 2, -0.02)); await p2.waitForTimeout(2500);
      const b = await p2.screenshot({ clip: { x: 150, y: 100, width: 800, height: 500 } });
      // decode both screenshots in the browser and count the pixels that differ visibly
      const frac = await p2.evaluate(async ([x, y]) => {
        const px = async (b64) => { const im = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob()); const c = new OffscreenCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height).data; };
        const A = await px(x), B = await px(y); let d = 0;
        for (let k = 0; k < A.length; k += 4) if (Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]) > 24) d++;
        return d / (A.length / 4);
      }, [a.toString('base64'), b.toString('base64')]);
      check(frac < 0.01, 'F: the same view in the older build is the same picture (' + (100 * frac).toFixed(3) + '% of pixels differ visibly)');
      await c2.close(); bsrv.close();
    }
    check(!errors.length, 'F: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- G: six doorways: two on the back wall, two on each side wall; every one is drawn and can be walked through ---- */
    const { ctx, page, errors } = await open(lobbySnap(6));
    await page.evaluate(() => { window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Casino' } }; });
    await openDoor(page, 0);
    await page.waitForFunction(() => window.XA.lobbyState().open === true, null, { timeout: 120000 });
    await page.evaluate(() => window.XA.pose(-8, -13.1, -Math.PI / 2, -0.05));
    await page.waitForFunction(() => window.XA.lobbyState().inside === true, null, { timeout: 120000 });
    const g = await geometry(page);
    check(g.length === 6 && g.every((b) => b.visible && b.door), 'G: six lobby doorways, each with its door (' + g.length + ')');
    const nrm = g.map((b) => [Math.round(b.frame.nx), Math.round(b.frame.nz)].join(','));
    check(nrm[0] === '1,0' && nrm[1] === '1,0' && nrm[2] === nrm[4] && nrm[3] === nrm[5] && nrm[2] !== nrm[3] && nrm[2] !== '1,0', 'G: two face the way in from the back wall, two face each other from each side wall (' + nrm.join(' | ') + ')');
    let apart = true; for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) if (Math.hypot(g[a].frame.x - g[b].frame.x, g[a].frame.z - g[b].frame.z) < 2.3) apart = false;
    check(apart, 'G: no two doorways overlap (all at least 2.3 m apart)');
    await page.evaluate(() => window.XA.pose(-12, -13.1, -Math.PI / 2, -0.1)); await page.waitForTimeout(1200);
    await shot(page, 'lobby-six');
    for (let i = 4; i < 10; i++) {
      const r = await walkThrough(page, i);
      check(r.d < 0.05 && r.inside, 'G: doorway ' + (i - 3) + ' can be walked through, and BACK puts you a step in front of it, in the lobby');
    }
    // back to two: the side doorways go, the back two are where they always were
    await page.evaluate((s) => { const st = window.XAWorld._t.state; st.snap = s; st.listeners.forEach((f) => f(s, 'test')); }, lobbySnap(2));
    await page.waitForTimeout(800);
    const g2 = await geometry(page);
    check(g2.slice(0, 2).every((b) => b.visible) && g2.slice(2).every((b) => !b.visible), 'G: going back to two lobby bays leaves only the two back-wall doorways');
    check(!errors.length, 'G: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

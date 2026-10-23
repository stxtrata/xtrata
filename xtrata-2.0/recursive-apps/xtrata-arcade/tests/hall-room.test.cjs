// The lobby's doors and the full-screen takeover (no button anywhere: you walk through the open door). The lobby's doorways are bays 4 and
// up (read from the world's 'lobby' room). A door opens its room's page over the whole screen after a short loading screen; the hall sleeps,
// and BACK (or the room telling the hall it is done) puts you back in front of the door.
// A-E: the local preview path (window.XA_ROOMS: a page beside the hall; a stub page stands in for the casino):
//   A  the lobby's doors       bays 4 and 5 exist, the casino door has a door and its sign, the staff door is a plain knock door
//   B  going in                the open door starts loading the page quietly; walking into it: loading screen, then the page full screen, hall asleep, back button
//   C  going back              BACK TO THE LOBBY removes the page; you come out of the door, a step in front of it, and walk again
//   D  the room can leave too  the page posts {xa:'leave-room'} and the hall takes you back the same way
//   E  not configured          without XA_ROOMS the door says it is not open yet, and no page opens
// H-M: rooms from the world registry (an in-memory chain: tests/lib/mock-chain.cjs; nothing about any room is configured in the hall):
//   H  a page room             read by id, hash-checked, framed as srcdoc in a sandbox (no allow-same-origin); XA_ROOM and XA_ENTRY are injected;
//                              the room has an opaque origin; <script data-xa-part="three.js"> gets the arcade's three.js; account() refused (not hosted)
//   I  doors inside a room     XA_ROOM.go(door): unknown and hidden doors refused, a closed room refused; to a second room and back, twice; BACK at any depth
//   J  honest door states      a live room with no entry: NOT OPEN YET; suspended: CLOSED; draft: CLOSED
//   K  a failed read           COULD NOT CHECK THE DOOR · TRY AGAIN (never "not open"); walking in again once the node answers opens the room
//   L  a page that fails its hash   refused: the screen says it could not be loaded, BACK works
//   M  size                    a page over 16 MB is not read ("too big", with its size); a page whose size disagrees with its entry is refused
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-room.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MC = require('./lib/mock-chain.cjs');

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
      if (a.rooms === true) window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Royal Flush Casino' } };
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
    const fr = await (await page.$('iframe[data-xa-room]')).contentFrame();
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
    const fr2 = await (await page.$('iframe[data-xa-room]')).contentFrame();
    await fr2.evaluate(() => document.getElementById('leave').click());   // (the page's own back door: it posts {xa:'leave-room'})
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 30000 }).catch(async (e) => {
      console.log('D failed: room ' + JSON.stringify(await rs(page)) + ' messages ' + JSON.stringify(await page.evaluate(() => window.XA._msgs)) + ' frames ' + page.frames().map((f) => f.url()).join(', '));
      throw e;
    });
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
  /* ================================================================ rooms from the world registry (an in-memory chain) */
  // The hall reads its bays, the lobby's doorways and every destination from a mocked xtrata-world-v2 (tests/lib/mock-chain.cjs), and
  // the rooms' pages from the mocked Xtrata core / gateway, hash-checked. Nothing is configured in the hall about any room.
  const roomPage = (name) => '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title><script data-xa-part="three.js"></script></head>' +
    '<body style="background:#123;color:#fff"><h1 id="hi">' + name.toUpperCase() + ' FROM CHAIN</h1><pre id="info"></pre><script>' +
    'var info={entry:window.XA_ENTRY,v:window.XA_ROOM&&XA_ROOM.version,runtime:window.XA_ROOM&&XA_ROOM.runtime,title:window.XA_ROOM&&XA_ROOM.title,from:window.__XA_FROM_ARCADE,origin:String(window.origin),three:!!(window.THREE&&THREE.REVISION),apiBases:window.XA_ROOM&&XA_ROOM.apiBases};' +
    'try{localStorage.getItem("x");info.storage="open"}catch(e){info.storage="blocked"}' +
    'try{info.parentDom=!!parent.document.body}catch(e){info.parentDom=false}' +
    'window.__info=info;document.getElementById("info").textContent=JSON.stringify(info);' +
    'window.__go=function(d){return XA_ROOM.go(d).then(function(){return "ok"},function(e){return "err:"+e.code})};' +
    'window.__acct=function(){return XA_ROOM.account().then(function(a){return "ok:"+a},function(e){return "err:"+e.code})};' +
    'XA_ROOM.ready();</script></body></html>';
  const CASINO_PAGE = Buffer.from(roomPage('casino')), GALLERY_PAGE = Buffer.from(roomPage('gallery'));
  const ent = (id, b) => ({ id, hash: MC.chainHash(b).toString('hex'), size: b.length });
  function regWorld(over = {}) {
    const doorObj = (space, name, to, arrival) => ({ space, parent: 0, kind: 0, name, params: '{}', portal: to ? { to, arrival: arrival || 0, path: '' } : null, active: { patch: '{"base":"door"}', interaction: to ? 3 : 1 } });
    const w = {
      spaces: {
        1: { parent: 0, slug: '', title: 'Xtrata World', kind: 0 }, 2: { parent: 1, slug: 'arcade', title: 'Arcade', kind: 0 },
        3: { parent: 2, slug: 'hall', title: 'Hall' }, 4: { parent: 2, slug: 'lobby', title: 'Lobby' },
        10: { parent: 2, slug: 'casino', title: 'Royal Flush Casino', runtime: 2, entry: ent(9200, CASINO_PAGE) },
        11: { parent: 2, slug: 'vault', title: 'The Vault', runtime: 2, state: 2, entry: ent(9200, CASINO_PAGE) },
        12: { parent: 2, slug: 'workshop', title: 'Workshop', runtime: 2 },
        13: { parent: 2, slug: 'gallery', title: 'Gallery', runtime: 3, entry: ent(9201, GALLERY_PAGE) },
      },
      objects: {
        20: doorObj(3, 'bay-0', 4),
        30: doorObj(4, 'bay-0', 10, 77), 31: doorObj(4, 'bay-1', 11),
        40: { space: 10, parent: 0, kind: 2, name: 'to-gallery', portal: { to: 13, arrival: 0, path: '' }, active: null },
        41: { space: 10, parent: 0, kind: 2, name: 'to-vault', portal: { to: 11, arrival: 0, path: '' }, active: null },
        42: { space: 10, parent: 0, kind: 2, name: 'hidden-door', portal: { to: 13, arrival: 0, path: '' }, active: { visibility: 1 } },
        50: { space: 13, parent: 0, kind: 2, name: 'to-casino', portal: { to: 10, arrival: 40, path: '' }, active: null },
      },
      kinds: MC.KINDS, inscriptions: { 9200: CASINO_PAGE, 9201: GALLERY_PAGE },
    };
    if (over.mutate) over.mutate(w);
    return MC.createChain(w);
  }
  const REG_CFG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', registry: 'SP000000000000000000002Q6VF78.xtrata-world-v2' };
  async function openReg(chain, routeOpts) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, MC.routeFor(chain, routeOpts));
    await ctx.addInitScript((cfg) => {
      window.XA_TEST = 1;
      Element.prototype.requestPointerLock = function () {};
      window.XA_WORLD_CONFIG = cfg;
    }, REG_CFG);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
    await page.waitForFunction(() => { const s = window.XA.bayState(); return s && s.bays[4] && s.bays[4].plan && window.XA.lobbyState().bay === 0; }, null, { timeout: 120000 });
    await page.waitForTimeout(800);
    await page.click('#go'); await page.waitForTimeout(600);
    return { ctx, page, errors };
  }
  const roomFrame = async (page) => { const h = await page.$('iframe[data-xa-room]'); return h ? h.contentFrame() : null; };
  const info = async (page) => { const f = await roomFrame(page); return f ? f.evaluate(() => JSON.parse(JSON.stringify(window.__info || null))) : null; };
  const watchToast = (page, src) => page.evaluate((s) => { const re = new RegExp(s); window.__toast = ''; new MutationObserver(() => { const e = document.getElementById('bprompt'); if (e && !e.hidden && re.test(e.textContent)) window.__toast = e.textContent; }).observe(document.getElementById('bprompt'), { subtree: true, childList: true, characterData: true, attributes: true }); }, src);
  const roomUp = (page, re) => page.waitForFunction((s) => { const r = window.XA.roomState(); return r.state === 'room' && r.back && !r.loading && new RegExp(s).test(r.title); }, re.source, { timeout: 120000 });
  const until2 = async (page, fn, ms) => { for (let i = 0; i < (ms || 120000) / 250; i++) { const v = await fn(); if (v) return v; await page.waitForTimeout(250); } return null; };

  {
    /* ---- H: a room that is a page in the registry ---- */
    const chain = regWorld();
    const { ctx, page, errors } = await openReg(chain);
    await intoLobby(page);
    const c = await bayS(page, 4);
    check(c.visible && c.door && c.plan.link.to === 10 && c.plan.link.title === 'Royal Flush Casino', 'H: the lobby\'s first doorway is read from the registry: it leads to space 10, "Royal Flush Casino"');
    check(await page.evaluate(() => !window.XA_ROOMS), 'H: nothing about any room is configured in the hall');
    await face(page, 4); await page.waitForTimeout(600);
    await openDoor(page, 4);
    await page.waitForFunction(() => window.XA.roomState().frame === true, null, { timeout: 120000 });
    check((await rs(page)).state === 'walk' && (await rs(page)).frameSrc === null, 'H: the open door starts loading the room quietly (its page comes from the chain, no URL)');
    await face(page, 4);
    await walkInto(page, () => window.XA.roomState().state === 'room');
    await roomUp(page, /ROYAL FLUSH CASINO/);
    let r = await rs(page);
    check(r.frameDoc && r.sandbox === 'allow-scripts allow-pointer-lock allow-downloads', 'H: the room is framed as srcdoc in a sandbox without allow-same-origin (' + r.sandbox + ')');
    check(r.room === 'casino' && /BACK TO THE LOBBY/.test(r.backLabel), 'H: the hall knows it is in "casino"; the button says ' + r.backLabel);
    const i1 = await info(page);
    check(i1 && i1.v === 1 && i1.runtime === 2 && i1.title === 'ROYAL FLUSH CASINO' && i1.from === 1, 'H: the page has window.XA_ROOM (version 1, runtime 2: a page) and __XA_FROM_ARCADE');
    check(i1 && JSON.stringify(i1.entry) === JSON.stringify({ from: 'lobby', door: 'bay-0', arrival: 77 }), 'H: XA_ENTRY says where you came from: ' + JSON.stringify(i1 && i1.entry));
    check(i1 && i1.origin === 'null' && i1.storage === 'blocked' && i1.parentDom === false, 'H: the room has an opaque origin: no storage, no reach into the hall (' + [i1.origin, i1.storage, i1.parentDom].join(', ') + ')');
    check(i1 && i1.three === true, 'H: <script data-xa-part="three.js"> is filled with the arcade\'s own three.js');
    check(i1 && Array.isArray(i1.apiBases) && i1.apiBases.length > 0, 'H: the hall\'s read hosts are given to the room (' + (i1 && i1.apiBases) + ')');
    const f1 = await roomFrame(page);
    check((await f1.evaluate(() => window.__acct())) === 'err:not-hosted', 'H: account() is refused in a page room (only a hosted room may ask)');
    await shot(page, 'room-registry-casino');

    /* ---- I: doors inside a room, and back at any depth ---- */
    check((await f1.evaluate(() => window.__go('nope'))) === 'err:unknown-door', 'I: go() to a door the room\'s space does not have is refused');
    check((await f1.evaluate(() => window.__go('hidden-door'))) === 'err:unknown-door', 'I: go() to a hidden door is refused');
    check((await f1.evaluate(() => window.__go('to-vault'))) === 'err:closed' && (await rs(page)).room === 'casino', 'I: go() to a suspended room says closed, and you stay');
    for (let lap = 1; lap <= 2; lap++) {
      const f = await roomFrame(page);
      // (an accepted go() replaces this page, so its promise may never be seen from here: start it, then watch the hall)
      await f.evaluate(() => { window.__go('to-gallery'); return 1; });
      await roomUp(page, /GALLERY/);
      r = await rs(page);
      const ig = await info(page);
      check(r.room === 'gallery' && r.depth === 2 && /BACK TO ROYAL FLUSH CASINO/.test(r.backLabel) && r.sandbox === 'allow-scripts allow-pointer-lock allow-downloads', 'I' + lap + ': the gallery is open, one room deeper; the button says ' + r.backLabel);
      check(ig && JSON.stringify(ig.entry) === JSON.stringify({ from: 'casino', door: 'to-gallery', arrival: 0 }) && ig.runtime === 3, 'I' + lap + ': the gallery is told it was entered from casino through to-gallery');
      await page.click('text=BACK TO ROYAL FLUSH CASINO');
      await roomUp(page, /ROYAL FLUSH CASINO/);
      r = await rs(page);
      const ic = await info(page);
      check(r.room === 'casino' && r.depth === 1 && /BACK TO THE LOBBY/.test(r.backLabel), 'I' + lap + ': BACK re-opens the casino (read again), and its button says back to the lobby');
      check(ic && JSON.stringify(ic.entry) === JSON.stringify({ from: 'gallery', door: 'to-gallery', arrival: 40 }), 'I' + lap + ': the casino is re-opened at the door you went through: ' + JSON.stringify(ic && ic.entry));
    }
    await page.click('text=BACK TO THE LOBBY');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    r = await rs(page);
    const w = await page.evaluate(() => window.XA.where());
    check(!r.frame && r.depth === 0 && Math.abs(w.x - (c.pos.x + 1.2)) < 0.05 && (await page.evaluate(() => window.XA.lobbyState().inside)), 'I: the last BACK returns you to the lobby, a step in front of the door you came in by');
    check(!errors.length, 'H-I: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- J: closed, not open yet ---- */
    const chain = regWorld({ mutate: (w) => { w.objects[32] = { space: 4, parent: 0, kind: 0, name: 'bay-1', portal: { to: 12, arrival: 0, path: '' }, active: { patch: '{"base":"door"}', interaction: 3 } }; } });
    delete chain.world.objects[31];
    const { ctx, page, errors } = await openReg(chain);
    await intoLobby(page);
    await face(page, 5); await openDoor(page, 5); await page.waitForTimeout(600);
    await watchToast(page, 'NOT OPEN YET');
    await walkInto(page, () => !!window.__toast);
    check(/THIS DOOR LEADS TO WORKSHOP . NOT OPEN YET/.test(await page.evaluate(() => window.__toast)), 'J: a live room with no entry: "' + (await page.evaluate(() => window.__toast)) + '"');
    check((await rs(page)).state === 'walk' && !(await rs(page)).frame, 'J: and nothing opens');
    // suspended (and draft) rooms are closed
    chain.world.objects[32].portal.to = 11;
    chain.world.version++;
    await page.evaluate(() => window.XAWorld.refresh(true));
    await page.waitForFunction(() => window.XA.bayState().bays[5].plan && window.XA.bayState().bays[5].plan.link.to === 11, null, { timeout: 60000 });
    await page.evaluate(() => window.XA.pose(window.XA.bayState().bays[5].pos.x + 2.4, window.XA.bayState().bays[5].pos.z, Math.PI / 2, -0.05));
    await page.waitForTimeout(800); await openDoor(page, 5); await page.waitForTimeout(600);
    await watchToast(page, 'CLOSED');
    await walkInto(page, () => !!window.__toast);
    check(/THIS DOOR LEADS TO THE VAULT . CLOSED/.test(await page.evaluate(() => window.__toast)), 'J: a suspended room: "' + (await page.evaluate(() => window.__toast)) + '"');
    chain.world.spaces[11].state = 0;
    await page.evaluate(() => window.XA.pose(window.XA.bayState().bays[5].pos.x + 2.4, window.XA.bayState().bays[5].pos.z, Math.PI / 2, -0.05));
    await page.waitForTimeout(16000);   // (the hall keeps a destination for 15 s)
    await watchToast(page, 'CLOSED');
    await walkInto(page, () => !!window.__toast);
    check(/THE VAULT . CLOSED/.test(await page.evaluate(() => window.__toast)), 'J: a draft room is closed too, not open');
    check(!errors.length, 'J: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- K: the destination could not be read ---- */
    const chain = regWorld();
    let down = false;
    const { ctx, page, errors } = await openReg(chain, { down: (fn, contract, args) => down && fn === 'get-space' && args[0] === MC.cv.uint(10).replace(/^/, '0x') });
    await intoLobby(page);
    down = true;
    await face(page, 4); await openDoor(page, 4); await page.waitForTimeout(600);
    await watchToast(page, 'COULD NOT CHECK');
    await walkInto(page, () => !!window.__toast);
    check(/COULD NOT CHECK THE DOOR . TRY AGAIN/.test(await page.evaluate(() => window.__toast)), 'K: a failed read says "' + (await page.evaluate(() => window.__toast)) + '", never that the door is not open');
    check((await rs(page)).state === 'walk' && !(await rs(page)).frame, 'K: and nothing opens');
    down = false;
    await face(page, 4);
    await walkInto(page, () => window.XA.roomState().state === 'room');
    await roomUp(page, /ROYAL FLUSH CASINO/);
    check(true, 'K: once the node answers, walking in again opens the room (a failed read is not remembered)');
    check(!errors.length, 'K: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- L: a room whose bytes do not match its hash ---- */
    const chain = regWorld({ mutate: (w) => { w.spaces[10].entry.hash = 'ee'.repeat(32); } });
    const { ctx, page, errors } = await openReg(chain);
    await intoLobby(page);
    await face(page, 4); await openDoor(page, 4); await page.waitForTimeout(600);
    await face(page, 4);
    await walkInto(page, () => window.XA.roomState().state === 'room');
    await page.waitForFunction(() => /COULD NOT BE LOADED/.test(document.body.innerText), null, { timeout: 120000 });
    const fr = await page.evaluate(() => { const f = document.querySelector('iframe[data-xa-room]'); return f ? { doc: f.hasAttribute('srcdoc') } : null; });
    check(fr && !fr.doc, 'L: a page that fails its chain hash is refused: nothing is framed, and the screen says it could not be loaded');
    // the size too: right hash, wrong size
    await page.click('text=BACK TO THE LOBBY');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 });
    check(!(await rs(page)).frame, 'L: going back leaves nothing behind');
    check(!errors.length, 'L: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    /* ---- M: a page bigger than 16 MB is not opened; a size that disagrees with the entry is refused ---- */
    const chain = regWorld({ mutate: (w) => { w.spaces[10].entry = { ...w.spaces[10].entry, size: 17 * 1024 * 1024 }; } });
    const { ctx, page, errors } = await openReg(chain);
    await intoLobby(page);
    await face(page, 4); await openDoor(page, 4); await page.waitForTimeout(600);
    await watchToast(page, 'TOO BIG');
    await walkInto(page, () => !!window.__toast);
    check(/ROYAL FLUSH CASINO . TOO BIG TO OPEN HERE \(17\.0 MB, THE LIMIT IS 16 MB\)/.test(await page.evaluate(() => window.__toast)), 'M: "' + (await page.evaluate(() => window.__toast)) + '"');
    check(!chain.log.some((l) => l.fn === 'get-chunk-batch' || l.fn === 'get-inscription-meta'), 'M: and the page is not read at all');
    check(!errors.length, 'M: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
    const c2 = regWorld({ mutate: (w) => { w.spaces[10].entry = { ...w.spaces[10].entry, size: w.spaces[10].entry.size + 1 }; } });
    const o2 = await openReg(c2);
    await intoLobby(o2.page);
    await face(o2.page, 4); await openDoor(o2.page, 4); await o2.page.waitForTimeout(600);
    await face(o2.page, 4);
    await walkInto(o2.page, () => window.XA.roomState().state === 'room');
    await o2.page.waitForFunction(() => /COULD NOT BE LOADED/.test(document.body.innerText), null, { timeout: 120000 });
    check(true, 'M: a page whose size is not the size its space says is refused');
    await o2.ctx.close();
  }
  await browser.close(); srv.close();
  console.log('hall room tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

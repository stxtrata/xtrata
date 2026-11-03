// The casino room walks and looks exactly like the arcade hall, and has a way back to the lobby. Runs the REAL casino page (build/rooms/casino-room.html)
// and the real hall. The casino page loads three.js r128 from a CDN, which the test browser cannot reach, so give it a local copy:
//   npm pack three@0.128.0 && tar xzf three-0.128.0.tgz package/build/three.min.js   then THREE_JS=<that file>
// Without THREE_JS this test says so and exits (it needs the real page, a stub would prove nothing).
//   A  same numbers        the hall's WALK constants and the casino's are identical (field of view, eye height, speed, sprint, bob, mouse, pitch limit)
//   B  same mouse          the same drag turns both by the same yaw and pitch, from the first pixel
//   C  opened from the arcade   ?from=arcade starts walking just inside the door (no overview), at the hall's field of view
//   D  the rope is open    nothing blocks the middle of the carpet between the door and the tables
//   E  the way out         walking up to the door opens it, walking through tells the arcade to leave (and shutting it again when you step away)
//   F  on its own          opened by itself the door does not leave anywhere: it says so
// Run: THREE_JS=... NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/casino-walk.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

if (!process.env.THREE_JS || !fs.existsSync(process.env.THREE_JS)) { console.log('casino-walk: skipped (set THREE_JS to a local three.js r128 build; see the header)'); process.exit(0); }
const THREE = fs.readFileSync(process.env.THREE_JS, 'utf8');
const DIST = path.join(__dirname, '..', 'dist');
const HALL = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const CASINO = fs.readFileSync(path.join(__dirname, '..', 'build', 'rooms', 'casino-room.html'), 'utf8');
const HOST = '<!doctype html><body style="margin:0"><script>window.msgs=[];addEventListener("message",e=>window.msgs.push(e.data))</script><iframe id="c" src="/casino-room.html?from=arcade" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>';

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);

(async () => {
  const srv = http.createServer((req, res) => {
    const u = req.url.split('?')[0];
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(u === '/casino-room.html' ? CASINO : u === '/host' ? HOST : HALL);
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  async function newPage() {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort('failed'));   // (first: the later route wins)
    await page.route(/cdnjs\.cloudflare\.com.*three/, (r) => r.fulfill({ contentType: 'application/javascript', body: THREE }));
    return { ctx, page, errors };
  }
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png'), timeout: 170000 }); };
  const drag = async (page) => { await page.mouse.move(550, 350); await page.mouse.down(); for (let i = 1; i <= 10; i++) await page.mouse.move(550 + i * 10, 350 + i * 4); await page.mouse.up(); };

  let hallCfg, hallDelta;
  {   /* hall */
    const { ctx, page } = await newPage();
    await page.addInitScript(() => { window.XA_TEST = 1; });
    await page.goto(base + '/');
    await page.waitForFunction(() => window.XA && window.XA.walkCfg && window.XA.wallState && window.XA.wallState().length >= 27, null, { timeout: 120000 });
    await page.waitForTimeout(1500); await page.click('#go');
    await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 120000 }); await page.waitForTimeout(1500);
    hallCfg = await page.evaluate(() => window.XA.walkCfg());
    // (the headless browser may grant the hall pointer lock; the drag is the unlocked path, so let it go and start from a known view)
    await page.evaluate(() => { if (document.pointerLockElement) document.exitPointerLock(); window.XA.pose(0, 13.6, 0, 0); });
    await page.waitForFunction(() => !document.pointerLockElement, null, { timeout: 30000 }); await page.waitForTimeout(800);
    await page.evaluate(() => window.XA.pose(0, 13.6, 0, 0));
    const w0 = await page.evaluate(() => window.XA.where());
    await drag(page);
    const w1 = await page.evaluate(() => window.XA.where());
    hallDelta = { yaw: w1.yaw - w0.yaw, pitch: w1.pitch - w0.pitch };
    await ctx.close();
  }
  {   /* casino from the arcade, in a frame, as the hall shows it */
    const { ctx, page, errors } = await newPage();
    await page.goto(base + '/host');
    const frame = () => page.frames().find((f) => /casino-room\.html/.test(f.url()));
    await page.waitForFunction(() => { const f = document.getElementById('c'); return f && f.contentWindow && f.contentWindow.__casino; }, null, { timeout: 180000 });
    const ev = (fn, arg) => frame().evaluate(fn, arg);
    await page.waitForTimeout(1500);
    /* ---- A ---- */
    const cfg = await ev(() => window.__casino.walkCfg);
    check(JSON.stringify(cfg) === JSON.stringify(hallCfg), 'A: the casino walks and looks with the hall\'s numbers ' + JSON.stringify(cfg));
    /* ---- C ---- */
    const st = await ev(() => ({ mode: window.__casino.mode, ret: window.__casino.returning, fov: window.__casino.fov, x: window.__casino.player.x, z: window.__casino.player.z, intro: document.getElementById('intro').classList.contains('on') }));
    check(st.mode === 'walk' && !st.ret && !st.intro, 'C: opened from the arcade it is walking at once, no overview');
    check(st.x === 0 && st.z > 9 && st.z < 10, 'C: just inside the door (z ' + st.z + ')');
    check(near(st.fov, hallCfg.fov, 0.05), 'C: at the hall\'s field of view (' + st.fov.toFixed(2) + ')');
    await shot(page, 'casino-at-door');
    /* ---- B ---- */
    const p0 = await ev(() => ({ yaw: window.__casino.player.yaw, pitch: window.__casino.player.pitch }));
    await drag(page);
    const p1 = await ev(() => ({ yaw: window.__casino.player.yaw, pitch: window.__casino.player.pitch }));
    const d = { yaw: p1.yaw - p0.yaw, pitch: p1.pitch - p0.pitch };
    check(near(d.yaw, hallDelta.yaw, 1e-9) && near(d.pitch, hallDelta.pitch, 1e-9), 'B: the same drag turns both rooms the same (yaw ' + d.yaw.toFixed(4) + ', pitch ' + d.pitch.toFixed(4) + ')');
    check(near(d.yaw, -0.4, 1e-9) && near(d.pitch, -0.16, 1e-9), 'B: and from the first pixel (100 px right, 40 down = -0.4 / -0.16 at 0.004 per pixel)');
    /* ---- D ---- */
    const blocked = await ev(() => window.__casino.solids.filter((o) => (o.k === 'c' && Math.hypot(o.x - 0, o.z - 7.2) < 1.3) || (o.k === 'b' && o.z0 <= 7.2 && o.z1 >= 7.2 && o.x0 < 1.4 && o.x1 > -1.4)).length);
    check(blocked === 0, 'D: nothing blocks the middle of the carpet at the rope line');
    /* ---- E ---- */
    check((await ev(() => window.__casino.exitOpen)) > 0.9, 'E: arriving, the door is open behind you');
    await ev(() => { window.__casino.player.z = 6.5; });
    await page.waitForFunction(() => document.getElementById('c').contentWindow.__casino.exitOpen < 0.3, null, { timeout: 120000 });
    check(true, 'E: stepping away, it swings shut');
    await ev(() => { const c = window.__casino; c.player.x = 0; c.player.z = 9.5; });
    await page.waitForFunction(() => document.getElementById('c').contentWindow.__casino.exitOpen > 0.8, null, { timeout: 120000 });
    check(true, 'E: walking up to it, it opens');
    await shot(page, 'casino-door-open');
    await ev(() => { const c = window.__casino; c.player.x = 0; c.player.z = 10.2; });
    await page.waitForFunction(() => window.msgs.some((m) => m && m.xa === 'leave-room'), null, { timeout: 120000 });
    check(true, 'E: walking through it tells the arcade to leave (no button)');
    check(!errors.length, 'A-E: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {   /* the casino on its own */
    const { ctx, page, errors } = await newPage();
    await page.goto(base + '/casino-room.html');
    await page.waitForFunction(() => window.__casino, null, { timeout: 180000 });
    await page.evaluate(() => { const c = window.__casino; c.startAtDoor(); c.player.x = 0; c.player.z = 9.5; });
    await page.waitForFunction(() => window.__casino.exitOpen > 0.8, null, { timeout: 120000 });
    await page.evaluate(() => { window.__casino.player.z = 10.2; });
    await page.waitForFunction(() => /way out/i.test(document.getElementById('toast').textContent), null, { timeout: 120000 });
    check(true, 'F: on its own the door says where the way out is instead of leaving');
    check(!errors.length, 'F: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log('casino walk tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

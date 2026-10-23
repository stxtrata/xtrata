// The real hall (dist single file) in Chromium reading its bays from the object registry (xtrata-world-v2).
// The "chain" is a route that answers the hall's read-only calls with results recorded from a simnet registry seeded with the
// four-doorways demo (tests/fixtures/hall-v2-demo.json); posters answer "nothing". No network is reached.
//   A  no registry configured                    the wall as #3111 draws it, nothing from the registry is read
//   B  registry configured, node down, no cache  identical to A: all four bays show their posters
//   C  registry configured, node up              the demo: wall + curtain + sign, arch door, gothic door to the lobby, wall + sign + lamp
//   D  registry configured, node down, v2 cache  the cached snapshot draws the same bays as C
//   E  the registry before the scenes start      posters (the hall knows what it is waiting for)
//   F  no registry, a v2 snapshot in the cache   ignored: the hall is #3111
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-world2.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const MC = require('./lib/mock-chain.cjs');
const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'hall-v2-demo.json'), 'utf8'));
const REG = FIX.registry, POSTERS = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-posters-v1';
const BAY_SLOTS = { L: [12, 13], R: [25, 26], NL: [0, 1], NR: [14, 15] };

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }
const uint = (n) => '0x01' + BigInt(n).toString(16).padStart(32, '0');
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, GET, OPTIONS' };

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  // opts: { registry: bool, node: 'up'|'down', scenario, snap }
  async function hall(opts) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const reads = [];
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => {
      const req = route.request(), url = req.url();
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
      const m = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
      if (!m) return route.abort('failed');
      const fn = m[3], body = JSON.parse(req.postData() || '{}'), key = fn + '|' + (body.arguments || []).join(',');
      reads.push(m[2] + '.' + fn);
      if (opts.node !== 'up') return route.abort('failed');
      let hex;
      if (m[2] === 'xtrata-posters-v1') hex = fn === 'get-version' ? uint(1) : '0x0b00000000';
      else {
        const calls = FIX.scenarios[opts.scenario].calls, i = calls[key];
        hex = i === undefined ? null : FIX.blobs[i];
        // the recording predates get-object-ids: derive the page from the recorded get-objects page (same slots, ids only)
        const j = calls['get-objects|' + key.slice(fn.length + 1)];
        if (hex === null && fn === 'get-object-ids' && j !== undefined) hex = MC.idsFromObjectsPage(FIX.blobs[j]);
      }
      const out = hex ? { okay: true, result: hex } : { okay: false, cause: 'unrecorded ' + key };
      return route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(out) });
    });
    await ctx.addInitScript((o) => {
      window.XA_TEST = true;
      if (o.config) window.XA_WORLD_CONFIG = o.registry ? { posters: o.posters, registry: o.reg } : { posters: o.posters, world: 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-world-v1' };
      if (o.snap) { try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(o.snap)); } catch (e) {} }
    }, { config: !!opts.config, registry: !!opts.registry, posters: POSTERS, reg: REG, snap: opts.snap || null });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
    if (opts.waitBay != null) await page.waitForFunction((i) => { const b = window.XA.bayState(); return b && b.bays[i] && b.bays[i].plan; }, opts.waitBay, { timeout: 60000 });
    else await page.waitForTimeout(1500);
    await page.waitForTimeout(500);
    const out = await page.evaluate(() => ({ wall: window.XA.wallState(), bays: window.XA.bayState() && window.XA.bayState().bays.map((b) => ({ plan: b.plan, visible: b.visible, door: b.door, curtain: b.curtain && { openness: b.curtain.openness }, light: b.light && b.light.key, overlays: b.overlays })), lobby: window.XA.lobbyState() }));
    if (process.env.SHOTS && opts.shot) await page.screenshot({ path: path.join(process.env.SHOTS, opts.shot + '.png') });
    await ctx.close();
    return { ...out, errors, reads };
  }
  const heads = (s) => JSON.stringify(s.map((x) => x.head + '|' + x.chain + '|' + x.shown));
  const bayShown = (w, code) => BAY_SLOTS[code].every((i) => w[i].shown);
  const bayHidden = (w, code) => BAY_SLOTS[code].every((i) => !w[i].shown);

  const A = await hall({});
  check(A.wall.length === 27 && A.wall.every((s) => s.chain === 0 && s.shown), 'A: 27 embedded posters, all shown');
  check(A.reads.every((u) => !/world-v2/.test(u)), 'A: the registry is not read when nothing is configured');
  check(!A.errors.length, 'A: no page errors ' + A.errors.slice(0, 2).join(' | '));

  const B = await hall({ config: true, registry: true, node: 'down', shot: 'world2-B' });
  check(heads(B.wall) === heads(A.wall), 'B: registry configured, node down, nothing cached: the wall is #3111');
  check(B.reads.length > 0, 'B: the reader did try the chain (' + B.reads.length + ' refused reads)');
  check(!B.errors.length, 'B: no page errors ' + B.errors.slice(0, 2).join(' | '));

  const C = await hall({ config: true, registry: true, node: 'up', scenario: 'active', waitBay: 1, shot: 'world2-C' });
  const [p0, p1, p2, p3] = C.bays.map((b) => b.plan);
  check(p0 && p0.base === 'wall' && p0.cover && p0.cover.p.openness === 0 && p0.overlays[0].p.text === 'COMING SOON', 'C: bay 0 is a wall with a closed curtain and the "coming soon" sign');
  check(p1 && p1.base === 'door' && p1.door.style === 'arch' && p1.interaction === 1 && p1.overlays[0].p.text === 'STAFF ONLY', 'C: bay 1 is an arch door you can knock on: "staff only"');
  check(p2 && p2.base === 'door' && p2.door.style === 'gothic' && p2.interaction === 3 && p2.link['target-room'] === 'lobby', 'C: bay 2 is a gothic door that enters the lobby');
  check(p3 && p3.base === 'wall' && p3.light && p3.light.key === 'light-pulse' && p3.overlays[0].p.text === 'NEW ROOM', 'C: bay 3 is a wall with the "new room" sign and a pulsing lamp');
  check(C.bays[2].door && C.bays[1].door && C.bays[0].curtain, 'C: the engine built the doors and the curtain');
  check(['L', 'R', 'NL', 'NR'].every((c) => bayHidden(C.wall, c)), 'C: all four bays hide their posters (every bay has a scene)');
  const nonBay = Array.from({ length: 27 }, (_, i) => i).filter((i) => ![].concat(...Object.values(BAY_SLOTS)).includes(i));
  check(nonBay.every((i) => C.wall[i].head === A.wall[i].head && C.wall[i].shown), 'C: every other poster on the wall is exactly #3111\'s');
  check(C.lobby.bay === 2, 'C: the lobby is placed behind bay 2, the door whose link is "lobby"');
  check(C.bays.length === 6 && C.bays[4].plan === null && C.bays[5].plan === null, 'C: the lobby\'s two doorways are bays 4 and 5 and show nothing yet');
  check(!C.errors.length, 'C: no page errors ' + C.errors.slice(0, 2).join(' | '));
  check(C.reads.every((u) => !/world-v1|get-bays|get-looks/.test(u)), 'C: the v1 scene contract is not read');

  const D = await hall({ config: true, registry: true, node: 'down', snap: { ...FIX.scenarios.active.expect, src: REG, versions: { posters: 1, world: 'x' }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], rooms: { lobby: { bays: FIX.scenarios.active.expect.lobbyBays } } }, waitBay: 1 });
  check(JSON.stringify(D.bays.map((b) => b.plan && b.plan.base)) === JSON.stringify(C.bays.map((b) => b.plan && b.plan.base)), 'D: node down, the cached v2 snapshot draws the same bays as C');
  check(heads(D.wall) === heads(C.wall), 'D: and the same wall');
  check(!D.errors.length, 'D: no page errors ' + D.errors.slice(0, 2).join(' | '));

  const E = await hall({ config: true, registry: true, node: 'up', scenario: 'pending' });
  check(heads(E.wall) === heads(A.wall), 'E: before the scenes start every bay shows its posters, the wall is #3111');
  check(E.bays.slice(0, 4).every((b) => b.plan === null), 'E: no bay has a plan');
  check(!E.errors.length, 'E: no page errors ' + E.errors.slice(0, 2).join(' | '));

  const F = await hall({ config: true, registry: false, node: 'down', snap: { ...FIX.scenarios.active.expect, src: REG, versions: { posters: 1, world: 'x' }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], rooms: { lobby: { bays: [] } } } });
  check(heads(F.wall) === heads(A.wall), 'F: with the v1 contract configured a v2 cache is ignored: the wall is #3111');
  check(F.bays.slice(0, 4).every((b) => b.plan === null), 'F: and no bay is drawn from it');

  await browser.close(); srv.close();
  console.log('hall world2 tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

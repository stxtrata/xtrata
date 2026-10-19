// The real hall (dist single file) in Chromium with the world reader switched on.
// The chain is never reached (every request to a node is refused); the reader's last-good snapshot in localStorage
// stands in for a chain read, which is also exactly the path a visitor takes when a node is down.
//   A  no world config                         the wall as #3111 draws it
//   B  config on, chain down, nothing cached   identical to A (the hall is #3111 when the chain is unreachable)
//   C  cached snapshot: chain posters, a pin, bay 0 set to plain wall
//   D  same snapshot with both bays back on posters: the other 25 slots do not move, the bay posters are back
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-world.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
const BAY_SLOTS = { L: [12, 13], R: [25, 26] };

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const entry = (id, o = {}) => ({ id, set: 0, kind: 0, head: 'CHAIN ' + id, sub: 'from the registry', foot: 'XTRATA', c: 'gold', art: 'star',
  imageId: 0, imageHash: '', imageSize: 0, cols: 0, frames: 0, fps: 0, actKind: 0, actId: 0, actText: '',
  weight: 40, start: 0, end: 0, evergreen: true, scope: [], hidden: false, ...o });
const bay = (base) => ({ scene: base ? { base, baseId: base === 'wall' ? 1 : 2, interaction: 0, doorLook: null, layers: [], link: null, fromHeight: 0 } : null, nextHeight: null, height: 0 });
function snapshot(bays, extra) {
  const posters = [entry(1), entry(2), entry(3)];
  return { versions: { posters: 1, world: 1 }, at: 0, posters, pins: [{ spot: 2, poster: 7, from: 0, to: 1e9 }],
    pinned: { 7: entry(7, { head: 'PINNED' }) }, suppressed: [], bays, ...extra };
}

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function wall(opts) {
    opts = opts || {};
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const reads = [];
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => { reads.push(route.request().url()); route.abort('failed'); });
    await ctx.addInitScript((o) => {
      if (o.config) window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      if (o.snap) { try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(o.snap)); } catch (e) {} }
    }, { config: !!opts.config, snap: opts.snap || null });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
    await page.waitForTimeout(1500);                 // let a cached snapshot and any failing read settle
    const state = await page.evaluate(() => window.XA.wallState());
    if (process.env.SHOTS && opts.shot) await page.screenshot({ path: path.join(process.env.SHOTS, opts.shot + '.png') });
    await ctx.close();
    return { state, errors, reads };
  }
  const heads = (s) => s.map((x) => x.head + '|' + x.chain);
  const same = (a, b, slots) => slots.every((i) => a[i].head === b[i].head && a[i].chain === b[i].chain);
  const all = Array.from({ length: 27 }, (_, i) => i);
  const nonBay = all.filter((i) => !BAY_SLOTS.L.concat(BAY_SLOTS.R).includes(i));

  const A = await wall({ shot: 'world-A' });
  check(A.state.length === 27 && A.state.every((s) => s.chain === 0 && s.shown), 'A: 27 embedded posters, all shown (' + A.state.length + ')');
  check(A.reads.length === 0 || A.reads.every((u) => !/xtrata-posters|xtrata-world/.test(u)), 'A: no world contract is read when nothing is configured');
  check(!A.errors.length, 'A: no page errors ' + A.errors.slice(0, 2).join(' | '));

  const B = await wall({ config: true });
  check(JSON.stringify(heads(B.state)) === JSON.stringify(heads(A.state)), 'B: chain down and nothing cached gives the same wall as #3111');
  check(B.state.every((s) => s.shown), 'B: every poster shown, bays included');
  check(B.reads.some((u) => /call-read/.test(u)), 'B: the reader did try the chain (' + B.reads.length + ' refused requests)');
  check(!B.errors.length, 'B: no page errors ' + B.errors.slice(0, 2).join(' | '));

  const C = await wall({ config: true, snap: snapshot([bay('wall'), bay(null)]), shot: 'world-C' });
  const chainSlots = all.filter((i) => C.state[i].chain > 0);
  check(chainSlots.length >= 2 && chainSlots.length <= 9, 'C: chain posters are on the wall (' + chainSlots.map((i) => i + ':' + C.state[i].head).join(', ') + ')');
  check(C.state[14].chain === 7 && C.state[14].head === 'PINNED', 'C: the pin holds slot 14');
  check(chainSlots.every((i) => nonBay.includes(i)), 'C: no chain poster sits in a bay');
  check(BAY_SLOTS.L.every((i) => !C.state[i].shown) && BAY_SLOTS.R.every((i) => C.state[i].shown), 'C: bay 0 (plain wall) hides its posters, bay 1 keeps them');
  const moved = all.filter((i) => !same(A.state, C.state, [i]));
  check(moved.every((i) => C.state[i].chain > 0), 'C: only the overlay changed the wall (' + moved.length + ' slots differ from A, all chain posters)');
  check(!C.errors.length, 'C: no page errors ' + C.errors.slice(0, 2).join(' | '));

  const D = await wall({ config: true, snap: snapshot([bay(null), bay(null)]) });
  check(same(C.state, D.state, nonBay), 'D: bays back on posters, the other 25 slots are exactly as in C');
  check(D.state.every((s) => s.shown), 'D: all four bay posters are back');
  check(same(A.state, D.state, BAY_SLOTS.L.concat(BAY_SLOTS.R)), 'D: the bay posters are the same ones #3111 shows');
  check(!D.errors.length, 'D: no page errors ' + D.errors.slice(0, 2).join(' | '));

  const E = await wall({ config: true, snap: snapshot([bay(null), bay(null)], { suppressed: [3, 40, 90, 120] }) });
  const swapped = all.filter((i) => !same(D.state, E.state, [i]));
  check(swapped.length <= 4 && swapped.every((i) => E.state[i].chain === 0), 'E: suppressing four embedded posters swaps at most those slots, for other embedded posters (' + swapped.length + ' differ from D)');
  check(!E.errors.length, 'E: no page errors ' + E.errors.slice(0, 2).join(' | '));

  await browser.close(); srv.close();
  console.log('hall world tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

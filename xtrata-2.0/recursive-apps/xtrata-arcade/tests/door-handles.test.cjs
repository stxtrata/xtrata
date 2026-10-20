// Door handles on skinned doors, in the real hall (dist single file) in Chromium.
//   H1  the hardware itself   every handle type's geometry stays inside its declared extent, has no NaN, uses known materials
//   H2  per door style        each of the 14 styles gets the handle type that suits it, builds without errors, and the handle turns
//   H3  finish                a painted vintage door gets a porcelain knob, a wooden one a metal knob
// Run: node tests/door-handles.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }

const STY = ['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'vintage', 'scifi'];
const SKIN_FOR = { rect: 'oak', tall: 'walnut', wide: 'pine', arch: 'racing-green', gothic: 'iron', double: 'navy', cathedral: 'stained', circle: 'brushed-steel', oval: 'verdigris', hexagon: 'composite', octagon: 'hazard', industrial: 'iron', vintage: 'oak', scifi: 'composite' };
const WANT = { rect: 'lever', tall: 'plate', wide: 'barn', arch: 'cranked', gothic: 'ring', double: 'lever', cathedral: 'ring', circle: 'wheel', oval: 'tee', hexagon: 'tee', octagon: 'wheel', industrial: 'heavy', vintage: 'knob', scifi: 'touch' };
const LOOKS = { 30: { kind: 2, name: 'Door skin', tier: 0, builtin: 'door-skin', hidden: false, approved: true } };
STY.forEach((s, i) => { LOOKS[100 + i] = { kind: 0, name: s, tier: 0, builtin: 'door-' + s, hidden: false, approved: true }; });
const skin = (p) => ({ slot: 2, look: 30, params: JSON.stringify(p), state: '' });
const door = (st, p) => ({ base: 'door', baseId: 2, interaction: 2, doorLook: 100 + STY.indexOf(st), layers: [skin(p)], link: null, fromHeight: 0 });
const snapshot = (bays) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays: bays.map((x) => ({ scene: x, nextHeight: null, height: 0 })), looks: LOOKS });

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 600 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
  await ctx.addInitScript((s) => {
    window.XA_TEST = 1;
    window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
    try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(s)); } catch (e) {}
  }, snapshot([door('rect', { skin: 'oak' }), null, null, null]));
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.click('#go'); await page.waitForTimeout(500);
  const push = (snap) => page.evaluate((s) => { const st = window.XAWorld._t.state; st.snap = s; st.listeners.forEach((fn) => fn(s, 'chain')); }, snap);

  /* ---- H1: the hardware geometry ---- */
  {
    const res = await page.evaluate(() => {
      const T = window.THREE, D = window.XADoors, out = {}, MATS = ['fin', 'acc', 'dark', 'glow', 'knob'];
      if (!T) return { noThree: true };
      D.HW.TYPES.forEach((type) => {
        const { parts, geos } = D.HW.parts(T, type), E = D.HW.EXTENT[type], box = new T.Box3(), bad = [];
        let n = 0;
        parts.forEach((p) => {
          p.g.computeBoundingBox(); const b = p.g.boundingBox.clone().translate(new T.Vector3(p.x, p.y, p.z)); box.union(b); n++;
          const a = p.g.attributes.position.array; for (let i = 0; i < a.length; i++) if (!isFinite(a[i])) { bad.push(type); break; }
          if (MATS.indexOf(p.m) < 0) bad.push('material ' + p.m);
        });
        out[type] = { n, bad, min: [box.min.x, box.min.y, box.min.z], max: [box.max.x, box.max.y, box.max.z], E, geos: geos.length };
        geos.forEach((g) => g.dispose());
      });
      return out;
    });
    check(!res.noThree, 'H1: THREE is reachable for the geometry check');
    Object.keys(res).forEach((t) => {
      const r = res[t], E = r.E, tol = 0.35;
      check(r.n >= 3 && r.bad.length === 0, `H1: ${t} has ${r.n} parts, no NaN and only known materials`);
      check(r.min[0] >= -E[0] - tol && r.max[0] <= E[1] + tol && r.min[1] >= -E[2] - tol && r.max[1] <= E[3] + tol,
        `H1: ${t} stays inside its extent (x ${r.min[0].toFixed(1)}..${r.max[0].toFixed(1)} of -${E[0]}..${E[1]}, y ${r.min[1].toFixed(1)}..${r.max[1].toFixed(1)} of -${E[2]}..${E[3]})`);
      check(r.max[0] >= E[1] - 1.5 && r.min[0] <= -E[0] + 1.5 && r.min[1] <= -E[2] + 1.5 && r.max[1] >= E[3] - 1.5, `H1: ${t}'s declared extent is honest (not much bigger than the hardware)`);
      check(r.max[2] > 2 && r.max[2] < 12, `H1: ${t} stands ${r.max[2].toFixed(1)} cm off the door`);
    });
  }

  /* ---- H2: every style, in the real hall ---- */
  const seen = {};
  for (const st of STY) {
    await push(snapshot([door(st, { skin: SKIN_FOR[st] }), null, null, null]));
    await page.waitForTimeout(900);
    const h = await page.evaluate(() => window.XA.bayHandle(0));
    seen[st] = h;
    check(h && h.type === WANT[st], `H2: ${st} (${SKIN_FOR[st]}) carries a ${WANT[st]} handle (${h && h.type})`);
    check(h && isFinite(h.x) && isFinite(h.y) && h.y > 0.7 && h.y < 1.5, `H2: ${st} handle at a hand height (${h && h.y.toFixed(2)} m)`);
    await page.evaluate(() => window.XA.bayDoor(0, (m) => { m.handle.hold = true; m.handle.holdT = -999; m.handle.a = 15; m.handle.v = 0; m.wake(); }));
    await page.waitForFunction(() => Math.abs(window.XA.bayHandle(0).turn) > 0.1, null, { timeout: 15000 }).catch(() => {});   // the software renderer is slow: wait for a frame
    const t = await page.evaluate(() => window.XA.bayHandle(0).turn);
    check(Math.abs(t) > 0.1, `H2: ${st} handle turns with the physics (${(t * 180 / Math.PI).toFixed(1)} deg)`);
    await page.evaluate(() => window.XA.bayDoor(0, (m) => { m.handle.hold = false; m.wake(); }));
  }
  check(new Set(Object.values(seen).map((h) => h.type)).size === 10, 'H2: all ten handle types appear across the 14 styles');
  check(!errors.length, 'H2: no page errors ' + errors.slice(0, 2).join(' | '));

  /* ---- H3: finish ---- */
  await push(snapshot([door('vintage', { skin: 'white' }), null, null, null])); await page.waitForTimeout(900);
  check((await page.evaluate(() => window.XA.bayHandle(0))).porcelain === true, 'H3: a painted vintage door gets a porcelain knob');
  await push(snapshot([door('vintage', { skin: 'oak' }), null, null, null])); await page.waitForTimeout(900);
  check((await page.evaluate(() => window.XA.bayHandle(0))).porcelain === false, 'H3: an oak vintage door gets a metal knob');
  await push(snapshot([door('rect', { skin: 'white' }), null, null, null])); await page.waitForTimeout(900);
  check((await page.evaluate(() => window.XA.bayHandle(0))).porcelain === false, 'H3: only the knob is ever porcelain');
  await push(snapshot([null, null, null, null])); await page.waitForTimeout(500);
  check((await page.evaluate(() => window.XA.bayHandle(0))) === null, 'H3: back to posters, no handle');
  check(!errors.length, 'H3: no page errors ' + errors.slice(0, 2).join(' | '));

  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

// Door skins inside the real hall (dist single file) in Chromium: a door-skin overlay gives the door a lit, textured finish;
// no overlay, the neon look, an unknown skin, or a skin that does not suit the door style all leave the neon Threshold door.
//   S1  oak arch + racing-green rect      built with skins, no page errors, shots
//   S2  brushed steel gothic + stained gothic
//   S3  fallbacks                         no overlay / neon / unknown / unsuited style -> doorSkin ''
//   S4  live change                       a different skin rebuilds the door, removing it cleans up
// Run: [SHOTS=<dir>] node tests/hall-skins.test.cjs
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
  20: { kind: 0, name: 'Arch door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
  21: { kind: 0, name: 'Gothic door', tier: 0, builtin: 'door-gothic', hidden: false, approved: true },
  22: { kind: 0, name: 'Rect door', tier: 0, builtin: 'door-rect', hidden: false, approved: true },
  30: { kind: 2, name: 'Door skin', tier: 0, builtin: 'door-skin', hidden: false, approved: true },
  40: { kind: 4, name: 'Flicker', tier: 0, builtin: 'light-flicker', hidden: false, approved: true },
};
const skin = (p) => ({ slot: 2, look: 30, params: JSON.stringify(p), state: '' });
const door = (interaction, doorLook, layers) => ({ base: 'door', baseId: 2, interaction, doorLook, layers: layers || [], link: null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const snapshot = (bays) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays, looks: LOOKS });

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  async function open(snap) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
    await ctx.addInitScript((s) => {
      window.XA_TEST = 1;
      window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(s)); } catch (e) {}
    }, snap);
    const page = await ctx.newPage(), errors = [];
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
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png'), timeout: 170000 }); };
  const face = (page, i, d) => page.evaluate(([ii, dd]) => { const p = window.XA.bayState().bays[ii].pos, k = p.x < 0 ? 1 : -1; window.XA.pose(p.x + k * dd, p.z, k * Math.PI / 2, -0.05); }, [i, d || 1.7]);
  const sig = (b) => b.doorSkin;

  /* ---- S1/S2: skinned doors in two bays, then two other skins ---- */
  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1, 20, [skin({ skin: 'oak' })])), bay(door(1, 22, [skin({ skin: 'racing-green' })]))]));
    await page.waitForTimeout(1500);
    let st = await bays(page);
    check(st.bays[0].door && /^\["oak"/.test(sig(st.bays[0])), 'S1: bay 0 is an arch door with the oak skin (' + sig(st.bays[0]) + ')');
    check(st.bays[0].doorSound === 'wood', 'S1: an oak door sounds like wood');
    check(st.bays[1].door && /^\["racing-green"/.test(sig(st.bays[1])), 'S1: bay 1 is a rect door in racing green (' + sig(st.bays[1]) + ')');
    await face(page, 0); await page.waitForTimeout(6000); await shot(page, 'skins-S1-oak-arch');
    await face(page, 1); await page.waitForTimeout(2500); await shot(page, 'skins-S1-green-rect');
    check(!errors.length, 'S1: no page errors ' + errors.slice(0, 2).join(' | '));

    await push(page, snapshot([bay(door(1, 21, [skin({ skin: 'brushed-steel' })])), bay(door(1, 21, [skin({ skin: 'stained' })]))]));
    await page.waitForTimeout(1500);
    st = await bays(page);
    check(/^\["brushed-steel"/.test(sig(st.bays[0])) && /^\["stained"/.test(sig(st.bays[1])), 'S2: both doors changed finish live (' + sig(st.bays[0]) + ' / ' + sig(st.bays[1]) + ')');
    check(st.bays[0].doorState.style === 'gothic', 'S2: the door model is still the gothic style');
    check(st.bays[0].doorSound === 'metal' && st.bays[1].doorSound === 'glass', 'S2: steel sounds like metal, stained glass like glass');
    await face(page, 0); await page.waitForTimeout(2500); await shot(page, 'skins-S2-steel-gothic');
    await face(page, 1); await page.waitForTimeout(2500); await shot(page, 'skins-S2-stained-gothic');
    // the bay lamp lights a skinned door: the same oak door without and with an orange lamp
    await push(page, snapshot([bay(door(1, 20, [skin({ skin: 'oak' })])), bay(null)])); await page.waitForTimeout(1500); await face(page, 0); await page.waitForTimeout(2500); await shot(page, 'skins-lamp-off');
    await push(page, snapshot([bay(door(1, 20, [skin({ skin: 'oak' }), { slot: 4, look: 40, params: '{"tone":"orange","intensity":2,"rate":0.2}', state: '' }])), bay(null)])); await page.waitForTimeout(3000); await shot(page, 'skins-lamp-on');
    check(!errors.length, 'S2: lamp on a skinned door, no page errors ' + errors.slice(0, 2).join(' | '));
    // brass hardware and a tint, and the door still opens
    await push(page, snapshot([bay(door(2, 20, [skin({ skin: 'racing-green', frame: 'brass', hardware: 'brass', tint: '#2a4aa0', wear: 60 })])), bay(null)]));
    await page.waitForTimeout(1200); await face(page, 0); await page.waitForTimeout(2000); await shot(page, 'skins-S2-tinted-worn');
    check(/racing-green/.test(sig((await bays(page)).bays[0])), 'S2: frame, hardware, tint and wear are accepted');
    await page.evaluate(() => window.XA.bayDoor(0, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }));
    await page.waitForTimeout(1500); await shot(page, 'skins-S2-open');
    check(!errors.length, 'S2: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- S3/S4: fallbacks, live change and clean-up ---- */
  {
    const { ctx, page, errors } = await open(snapshot([bay(door(1, 20)), bay(null)]));
    check(sig((await bays(page)).bays[0]) === '', 'S3: no overlay -> the neon door');
    const tryIt = async (layers, style, name) => { await push(page, snapshot([bay(door(1, style || 20, layers)), bay(null)])); await page.waitForTimeout(700); const b = (await bays(page)).bays[0]; check(b.door && sig(b) === '', 'S3: ' + name + ' -> the neon door'); };
    check((await bays(page)).bays[0].doorSound === '', 'S3: the neon door sound is chosen by its style');
    await tryIt([skin({ skin: 'neon' })], 20, 'the neon skin');
    await tryIt([skin({ skin: 'no-such-skin' })], 20, 'an unknown skin');
    await tryIt([skin({ skin: 'stained' })], 22, 'a skin that does not suit the style (stained on rect)');
    await tryIt([skin('garbage')], 20, 'garbage params');
    await push(page, snapshot([bay(door(1, 20, [skin({ skin: 'oak' })])), bay(null)])); await page.waitForTimeout(800);
    const a = sig((await bays(page)).bays[0]);
    await push(page, snapshot([bay(door(1, 20, [skin({ skin: 'walnut' })])), bay(null)])); await page.waitForTimeout(800);
    const b = sig((await bays(page)).bays[0]);
    check(/oak/.test(a) && /walnut/.test(b), 'S4: another skin rebuilds the door (' + a + ' then ' + b + ')');
    await push(page, snapshot([bay(null), bay(null)])); await page.waitForTimeout(600);
    check(!(await bays(page)).bays[0].door, 'S4: back to posters removes the door');
    check(!errors.length, 'S4: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error(e); process.exit(1); });

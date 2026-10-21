// Phase 3: the bay engine inside the real hall (dist single file) in Chromium.
// The chain is never reached; the reader's snapshot is seeded the same way hall-world.test.cjs does it, and live scene
// changes are pushed through the reader's own listener list, exactly where a chain read would arrive.
//   A  no world config                    no bay engine at all (XA.bayState() is null), the hall is #3111
//   B  the launch story in bay 0          curtain closed + sign + door slab + flickering lamp; bay 1 still shows posters
//   C  open curtain on first sight        an already-open curtain is drawn open at once (no animation on arrival)
//   D  live changes (after Walk in)       curtain opens by animation, sign changes, back to posters removes everything
//   E  bad data                           recipe looks, unknown keys, hidden looks: nothing drawn, no errors
//   F  mouse interaction                  a curtain that may be pulled can be grabbed and moved; one that may not, cannot
// Run: NODE_PATH=<playwright> CHROME_PATH=... [SHOTS=<dir>] node tests/hall-bays.test.cjs
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
  3: { kind: 3, name: 'Work site', tier: 0, builtin: 'work-site', hidden: false, approved: true },
  4: { kind: 4, name: 'Flicker', tier: 0, builtin: 'light-flicker', hidden: false, approved: true },
  6: { kind: 1, name: 'Recipe curtain', tier: 1, builtin: '', hidden: false, approved: true },
  7: { kind: 1, name: 'Hidden curtain', tier: 0, builtin: 'curtain-house', hidden: true, approved: true },
  9: { kind: 2, name: 'Unknown', tier: 0, builtin: 'velvet-9000', hidden: false, approved: true },
};
const layer = (slot, look, params, state) => ({ slot, look, params: params || '{}', state: state || '' });
const scene = (base, layers, interaction) => ({ base, baseId: base === 'wall' ? 1 : base === 'door' ? 2 : 0, interaction: interaction || 0, doorLook: null, layers: layers || [], link: null, fromHeight: 0 });
const bay = (sc) => ({ scene: sc || null, nextHeight: null, height: 0 });
const snapshot = (bays, extra) => ({ versions: { posters: 1, world: 1 }, at: 0, posters: [], pins: [], pinned: {}, suppressed: [], bays, looks: LOOKS, ...extra });

const story = (state, interaction) => bay(scene('door', [
  layer(1, 1, '{"color":"#7a1020"}', state || 'closed'),
  layer(2, 2, '{"text":"coming soon","sub":"back in three days","tone":"gold"}'),
  layer(3, 3, '{"kinds":"hammer,saw","volume":0.5,"radius":6}'),
  layer(4, 4, '{"tone":"orange","rate":2}'),
], interaction == null ? 1 : interaction));

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open(opts) {
    opts = opts || {};
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort('failed'));
    await ctx.addInitScript((o) => {
      window.XA_TEST = 1;
      if (o.config) window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1' };
      if (o.snap) { try { localStorage.setItem('xa-world-snap-v1', JSON.stringify(o.snap)); } catch (e) {} }
    }, { config: !!opts.config, snap: opts.snap || null });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
    await page.goto(base);
    await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
    await page.waitForTimeout(opts.settle || 1500);
    return { ctx, page, errors };
  }
  const bays = (page) => page.evaluate(() => { const s = window.XA.bayState(); return s ? JSON.parse(JSON.stringify(s)) : null; });
  const push = (page, snap) => page.evaluate((s) => { const st = window.XAWorld._t.state; st.snap = s; st.listeners.forEach((fn) => fn(s, 'chain')); }, snap);
  const shot = async (page, name) => { if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, name + '.png') }); };
  const walkIn = async (page) => { await page.click('#go'); await page.waitForTimeout(600); };

  /* ---- A ---- */
  {
    const { ctx, page, errors } = await open({});
    check((await bays(page)) === null, 'A: no world config, no bay engine (XA.bayState() is null)');
    check(!errors.length, 'A: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- A2: world on but chain down and nothing cached ---- */
  {
    const { ctx, page, errors } = await open({ config: true });
    const s = await bays(page);
    check(s && s.bays.length === 6 && s.bays.every((b) => !b.visible && b.plan === null && !b.curtain && !b.door && b.overlays === 0 && !b.light), 'A2: world on, chain down: all six bays (hall four, lobby two) empty and hidden, posters as in #3111');
    check((await page.evaluate(() => window.XA.wallState())).every((x) => x.shown), 'A2: all 27 posters shown');
    check(!errors.length, 'A2: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- B ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('closed'), bay(null)]) });
    const s = await bays(page), b0 = s.bays[0], b1 = s.bays[1];
    check(b0.visible && b0.curtain && b0.curtain.openness < 0.05, 'B: bay 0 draws a closed curtain (openness ' + (b0.curtain && b0.curtain.openness.toFixed(2)) + ')');
    check(b0.overlays === 1 && b0.door === true, 'B: bay 0 has its sign board and the door slab');
    check(b0.curtain.bottom >= 0 && b0.curtain.bottom < 0.1, 'B: the curtain hangs to just above the floor (bottom at ' + b0.curtain.bottom.toFixed(3) + ' m)');
    check(b0.light && b0.light.key === 'light-flicker', 'B: bay 0 has its flickering lamp');
    check(!b1.visible && b1.plan === null && !b1.curtain && !b1.light, 'B: bay 1 builds nothing');
    const ws = await page.evaluate(() => window.XA.wallState());
    check(!ws[12].shown && !ws[13].shown && ws[25].shown && ws[26].shown, 'B: bay 0 posters are covered by the scene, bay 1 posters stay');
    await page.waitForTimeout(800);
    const s2 = await bays(page);
    check(s2.bays[0].light.intensity > 0, 'B: the lamp is lit (' + s2.bays[0].light.intensity.toFixed(2) + ')');
    check(JSON.stringify(s2.voices) === '[]', 'B: no sound before the player is near and the room audio is up');
    await shot(page, 'bays-B');
    check(!errors.length, 'B: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- C ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('open'), bay(null)]) });
    const c = (await bays(page)).bays[0].curtain;
    check(c && c.openness > 0.95 && !c.animating, 'C: a curtain that is already open on arrival is open at once (' + (c && c.openness.toFixed(2)) + ')');
    check(!errors.length, 'C: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- D ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('closed'), bay(null)]) });
    await walkIn(page);
    await push(page, snapshot([story('open'), bay(null)]));
    await page.waitForTimeout(150);
    const mid = (await bays(page)).bays[0].curtain;
    check(mid.target === 1 && mid.openness < 0.95, 'D: a live change animates the curtain towards open (target ' + mid.target + ', now ' + mid.openness.toFixed(2) + ')');
    // swiftshader renders about one frame a second and the cloth advances per frame, so check progress, not completion
    await page.waitForFunction((o) => window.XA.bayState().bays[0].curtain.openness > o, mid.openness, { timeout: 120000 });
    const later = (await bays(page)).bays[0].curtain;
    check(later.openness > mid.openness && later.animating && later.target === 1, 'D: and keeps opening, frame by frame (' + mid.openness.toFixed(4) + ' -> ' + later.openness.toFixed(4) + ')');
    await shot(page, 'bays-D-open');
    const beforeSign = (await bays(page)).bays[0];
    await push(page, snapshot([bay(scene('door', [layer(1, 1, '{"color":"#7a1020"}', 'open'), layer(2, 2, '{"text":"open now"}')], 1)), bay(null)]));
    await page.waitForTimeout(300);
    const afterSign = (await bays(page)).bays[0];
    check(afterSign.overlays === 1 && !afterSign.light && afterSign.plan.sound === null, 'D: dropping the lamp and the sound layers removes them');
    check(JSON.stringify(afterSign.plan.overlays) !== JSON.stringify(beforeSign.plan.overlays), 'D: the sign text changed');
    await push(page, snapshot([bay(scene('posters')), bay(null)]));
    await page.waitForTimeout(300);
    const gone = (await bays(page)).bays[0];
    check(gone.plan === null || (gone.plan.base === 'posters' && !gone.plan.cover && !gone.plan.overlays.length), 'D: back to posters: no cover, no sign');
    check(!gone.curtain && !gone.door && gone.overlays === 0 && !gone.light, 'D: back to posters: every piece is removed');
    check((await page.evaluate(() => window.XA.wallState())).every((x) => x.shown), 'D: back to posters: all the bay posters are back');
    check(!errors.length, 'D: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- E ---- */
  {
    const bad = bay(scene('door', [layer(1, 6), layer(1, 7), layer(2, 9), layer(2, 99), layer(3, 1), layer(4, 4, 'not json', 'off')]));
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([bad, bay(scene('posters', [layer(1, 99)]))]) });
    const s = await bays(page);
    check(s.bays[0].visible && !s.bays[0].curtain && s.bays[0].overlays === 0 && !s.bays[0].light, 'E: recipe, hidden, unknown and mismatched looks draw nothing');
    check(s.bays[1].plan && !s.bays[1].curtain, 'E: a posters scene with a bad layer still shows posters');
    check(!errors.length, 'E: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  /* ---- F ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('closed', 2), bay(null)]) });
    check((await bays(page)).bays[0].plan.interaction === 2, 'F: scene allows peeking');
    // grab the curtain by looking at it: teleporting the camera is not exposed, so the ray test is done through the engine's own
    // plan rule, and the live interaction through a pushed open state (a closed curtain with interaction 0 cannot be pulled)
    await walkIn(page);
    await push(page, snapshot([story('closed', 0), bay(null)]));
    await page.waitForTimeout(200);
    const s = await bays(page);
    check(s.bays[0].plan.interaction === 0 && s.bays[0].curtain.openness < 0.05, 'F: with no interaction the closed curtain stays closed');
    await page.mouse.move(550, 350); await page.mouse.down(); await page.mouse.move(700, 350); await page.mouse.up();
    await page.waitForTimeout(300);
    check((await bays(page)).bays[0].curtain.openness < 0.05, 'F: mouse drags in the hall do not move a curtain you may not pull');
    check(!errors.length, 'F: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- G: a curtain you may pull ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('closed', 2), bay(null)]) });
    await walkIn(page);
    const face = (yaw) => page.evaluate((y) => { const p = window.XA.bayState().bays[0].pos; window.XA.pose(p.x + 2.2, p.z, y, -0.05); }, yaw);
    await face(Math.PI / 2);                                     // two metres from the cloth, looking at it
    // (the headless view drifts a little each frame, so face the cloth again on every try)
    for (let k = 0; k < 40 && await page.evaluate(() => { const e = document.getElementById('bprompt'); return !e || e.hidden; }); k++) { await face(Math.PI / 2); await page.waitForTimeout(500); }
    check(/PULL THE CURTAIN/.test(await page.textContent('#bprompt')), 'G: looking at a curtain you may pull shows PULL THE CURTAIN');
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
    const t1 = (await bays(page)).bays[0].curtain;
    check(t1.target === 1 && t1.animating, 'G: E starts it opening (target ' + t1.target + ')');
    await face(-Math.PI / 2);                            // turn away: the prompt goes
    await page.waitForFunction(() => document.getElementById('bprompt').hidden, null, { timeout: 30000 });
    check(true, 'G: the prompt goes when you look away from the curtain');
    // the same cloth on a scene that forbids it: no prompt
    await push(page, snapshot([story('closed', 0), bay(null)]));
    await face(Math.PI / 2);
    await page.waitForTimeout(3500);
    check(await page.evaluate(() => document.getElementById('bprompt').hidden), 'G: a closed curtain the scene does not allow you to open gives no prompt');
    check(!errors.length, 'G: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- H: cloth pulled past the rail end stays visible ---- */
  {
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([story('open', 2), bay(null)]) });
    await walkIn(page);
    await page.evaluate(() => { const p = window.XA.bayState().bays[0].pos; window.XA.pose(p.x + 3.2, p.z, Math.PI / 2, -0.05); });
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => window.XA.bayCurtain(0, (c) => {
      const sim = c.sim, q = sim.uvToPx(0.05, 0.8), W = sim.width, ok = sim.grab(q.x, q.y);
      const lim = Math.max(0.5 * 0.8 / c.w, 0.8 / c.w - 0.1);
      sim.moveGrabUV(-lim);
      return { ok, mg: c.mg, W, lim, w: c.w };
    }));
    check(info.ok, 'H: the open cloth can be grabbed near the stack');
    await page.waitForTimeout(6000);
    const after = await page.evaluate(() => window.XA.bayCurtain(0, (c) => ({ min: Math.min.apply(null, Array.from(c.sim.panels[0].x)), mg: c.mg })));
    check(after.min < 0 && after.min > -after.mg, 'H: the cloth hangs past the rail end (' + after.min.toFixed(0) + ' px) but inside the picture margin (' + after.mg + ' px), so nothing is cut off');
    const planeW = (await bays(page)).bays[0].curtain.planeW;
    check(Math.abs(planeW - (info.w + 2 * after.mg * info.w / 720)) < 0.01, 'H: the picture is wider than the bay by the margin on both sides (' + planeW.toFixed(2) + ' m)');
    await shot(page, 'bays-H-pulled-out');
    check(!errors.length, 'H: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  /* ---- I: four bays (far left/right = 0/1, near left/right at the entrance end = 2/3) ---- */
  {
    const nearDoor = bay(scene('door', [layer(2, 2, '{"text":"staff only","sub":"knock","tone":"orange"}')], 1));
    const nearWall = bay(scene('wall', [layer(2, 2, '{"text":"under construction","sub":"","tone":"gold"}')], 0));
    const { ctx, page, errors } = await open({ config: true, snap: snapshot([bay(null), bay(null), nearDoor, nearWall]) });
    const s = await bays(page);
    check(s.bays.length === 6, 'I: the hall has four bays and the lobby two');
    const p = s.bays.slice(0, 4).map((b) => b.pos);
    check(p[0].x < 0 && p[1].x > 0 && p[2].x < 0 && p[3].x > 0, 'I: bays 0 and 2 are on the left wall, 1 and 3 on the right');
    check(p[0].z < 0 && p[1].z < 0 && p[2].z > 0 && p[3].z > 0, 'I: bays 0 and 1 are at the far end, 2 and 3 at the entrance end');
    check(!s.bays[0].visible && !s.bays[1].visible, 'I: far bays on posters build nothing');
    check(s.bays[2].visible && s.bays[2].door === true && s.bays[2].overlays === 1, 'I: bay 2 (near left) has a door slab and its sign');
    check(s.bays[3].visible && !s.bays[3].door && s.bays[3].overlays === 1, 'I: bay 3 (near right) is plain wall with its sign');
    const ws = await page.evaluate(() => window.XA.wallState());
    check(!ws[0].shown && !ws[1].shown && !ws[14].shown && !ws[15].shown, 'I: the four entrance-end posters are covered by the two near bays');
    check(ws[12].shown && ws[13].shown && ws[25].shown && ws[26].shown, 'I: the far bay posters stay');
    check(ws.filter((x, i) => ![0, 1, 14, 15].includes(i)).every((x) => x.shown), 'I: every other poster stays');
    await walkIn(page);
    await page.evaluate(() => { const q = window.XA.bayState().bays[2].pos; window.XA.pose(q.x + 3.2, q.z, Math.PI / 2, -0.05); });
    await page.waitForTimeout(1200);
    await shot(page, 'bays-I-near-left');
    const model = await page.evaluate(() => window.XA.bayDoor(2, (m) => ({ state: m.state(), has: true })));
    check(model && model.has, 'I: the near-left door model exists and answers');
    check(!errors.length, 'I: no page errors ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close(); srv.close();
  console.log('hall bays tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

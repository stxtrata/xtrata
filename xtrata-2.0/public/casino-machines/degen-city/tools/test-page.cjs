// End-to-end check of the standalone test page: the studio, deck buttons and lever, every bonus in all four stages
// (screenshotted), Skip, reduced motion, the gamble, a whole fullscreen session driven only by the bottom bar at desktop
// and phone width, pack.json decoding and the 94.38% engine.
//   node tools/test-page.cjs http://localhost:8102/degen-city/index.html [outdir]
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const URL = process.argv[2], OUT = process.argv[3] || path.join(__dirname, '../dist/test');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };
// Default: no GPU at all, so the studio uses the page's WebGL-less SoftwareRenderer fallback and 2D canvases read back quickly. GL=swiftshader tests the WebGL path instead (slow).
const ARGS = process.env.GL === 'swiftshader' ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : ['--disable-gpu'];

async function open(ctxOpts) {
  const browser = await chromium.launch({ args: ARGS }); const ctx = await browser.newContext(ctxOpts); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 9).map(s => s.trim()).join(' < '))); page.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|Failed to load resource|ERR_PROXY|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto(URL); await page.waitForFunction(() => window.DCTest, null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  // Headless Chromium renders the studio in software, a frame every few hundred ms; drive the game frame's pump directly
  // (the same __pxPump the casino uses) so the game itself runs at a normal frame rate during the test.
  await page.evaluate(() => { setInterval(() => { try { DCTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30); DCTest.renderer.setPixelRatio(.6); });
  await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
  await grab(fr); // warm-up read-back
  return { browser, page, fr, errors };
}
const G = (fr, fn, a) => fr.evaluate(fn, a);
const sceneOf = fr => G(fr, () => window.DegenCity.scene());
// Software GL makes the first read-back of the 2800×1920 screen canvas stall for over a minute, then it is fast: warm it up once, and
// copy to a 1400×960 canvas for the screenshot.
const grab = fr => G(fr, () => { const src = window.DegenCity.screen(), c = document.createElement('canvas'); c.width = 1400; c.height = 960; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(src, 0, 0, 1400, 960); return c.toDataURL('image/png'); });
const shotScreen = async (fr, name) => { const d = await grab(fr); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
const waitScene = (fr, stage, kind, ms = 30000) => fr.waitForFunction(([s, k]) => { const x = window.DegenCity.scene(); return x && x.stage === s && (!k || x.kind === k); }, [stage, kind], { timeout: ms });
const waitIdle = fr => fr.waitForFunction(() => !window.PX_CASINO_ENGINE.ui().spinning, null, { timeout: 60000 });
const snap = fr => G(fr, () => { const s = window.DegenCity.snapshot().state; return { bal: window.ParallaxLAYRAccount.balance(), free: s.free, freeActive: s.freeActive, features: s.features.map(f => f.type), spins: s.spins, wagered: s.wagered, paidOut: s.paidOut, gamble: s.gamble, last: s.history[0] }; });

// Play one bonus from trigger to summary with the scene's own buttons; screenshot the four stages.
async function playBonus(fr, kind, tag) {
  const ok = await G(fr, k => window.DegenCity.test.play(k), kind); if (!ok) throw Error(`test.play(${kind}) refused: ` + JSON.stringify({ scene: await sceneOf(fr), s: await snap(fr) }));
  await waitScene(fr, 'trigger', kind); await sleep(900); await shotScreen(fr, `${tag}-${kind}-1-trigger`);
  await waitScene(fr, 'intro', kind); await sleep(800); await shotScreen(fr, `${tag}-${kind}-2-intro`);
  if (kind === 'gamble') { await G(fr, () => window.PX_CASINO_ENGINE.key('KeyA', 'a')); await waitScene(fr, 'play', 'gamble'); await sleep(700); await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(1800); await G(fr, () => window.DegenCity.test.primary()); }
  else if (kind === 'free') { await G(fr, () => window.DegenCity.test.primary()); for (let i = 0; i < 400; i++) { const s = await sceneOf(fr); if (s && s.stage === 'outro' && s.kind === 'free') break; if (s && s.kind !== 'free') { await finishOther(fr); continue; } if (i === 6) await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(400); } }
  else if (kind === 'jackpot') { await G(fr, () => window.DegenCity.test.primary()); await waitScene(fr, 'play', 'jackpot'); await sleep(1800); await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(3500); await G(fr, () => window.DegenCity.test.primary()); }
  else { await G(fr, () => window.DegenCity.test.primary()); await waitScene(fr, 'play', kind);
    if (kind === 'vault') { for (const p of [2, 5, 7]) { await G(fr, k => window.PX_CASINO_ENGINE.key('Digit' + k, String(k)), p); await sleep(450); } await sleep(500); await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(1200); await G(fr, () => window.DegenCity.test.primary()); }
    else { for (let i = 0; i < 160; i++) { const f = await G(fr, () => window.DegenCity.snapshot().state.features[0]); if (!f) break; if (i === 2) await shotScreen(fr, `${tag}-${kind}-3-play`); await G(fr, () => window.DegenCity.test.primary()); await sleep(450); } } }
  await waitScene(fr, 'outro', kind, 60000); await sleep(1600); await shotScreen(fr, `${tag}-${kind}-4-outro`);
  const total = await G(fr, () => window.DegenCity.snapshot().state.lastWin);
  await G(fr, () => window.DegenCity.test.primary()); await sleep(400);
  for (let i = 0; i < 40; i++) { const s = await sceneOf(fr); if (!s) break; await finishOther(fr); }
  return total;
}
async function finishOther(fr) { const s = await sceneOf(fr); if (!s) return; if (s.stage === 'outro') { await sleep(1500); await G(fr, () => window.DegenCity.test.primary()); await sleep(300); return; } await G(fr, () => window.DegenCity.test.skip()); await sleep(400); }

(async () => {
  // pack.json decodes to a valid pack in the existing format.
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../pack.json'), 'utf8'));
  const keys = Object.keys(pack).join(','), model = JSON.parse(zlib.gunzipSync(Buffer.from(pack.model, 'base64')).toString()), game = zlib.gunzipSync(Buffer.from(pack.game, 'base64')).toString();
  const roles = []; (function walk(n) { if (n.role) roles.push(n.role); if (n.action) roles.push('action:' + n.action); n.children.forEach(walk); })(model.root);
  check('pack.json decodes: {name, description, color, accent, model, game, css}', keys === 'name,description,color,accent,model,game,css' && model.root && model.geometries.length && model.materials.length && model.textures.length && /window\.PX_CASINO_ENGINE=\{/.test(game), keys);
  check('cabinet parts present', ['screenMesh', 'crest', 'spinPhysical', 'lever', 'action:spin', 'action:betUp', 'action:betDown', 'action:auto', 'action:pays'].every(r => roles.includes(r)), [...new Set(roles)].join(' '));

  // Desktop session in the studio.
  let { browser, page, fr, errors } = await open({ viewport: { width: 1280, height: 800 } });
  if (process.env.FS_ONLY) { await fullscreenSession(page, fr, 'desktop'); check('desktop: no page errors', errors.length === 0, errors.slice(0, 3).join(' | ')); await browser.close(); }
  else {
  await page.screenshot({ path: path.join(OUT, 'desktop-1-cabinet-view.png'), timeout: 180000 });
  await page.click('#vScr'); await sleep(2500); await page.screenshot({ path: path.join(OUT, 'desktop-2-screen-view.png'), timeout: 180000 }); await page.click('#vCab'); await sleep(1500);
  const s0 = await snap(fr);
  await page.click('#deck [data-a=betUp]'); await sleep(200); const betUp = await G(fr, () => window.DegenCity.snapshot().state.bet);
  await page.click('#deck [data-a=betDown]'); await sleep(200);
  check('deck −STAKE / +STAKE change the bet', betUp === 200 && (await G(fr, () => window.DegenCity.snapshot().state.bet)) === 100, `up → ${betUp}`);
  await page.click('#deck [data-a=spin]'); await sleep(300); check('deck DRIVE spins', (await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning)));
  await waitIdle(fr); await sleep(400);
  for (let i = 0; i < 40; i++) { if (!(await sceneOf(fr)) && !(await snap(fr)).free) break; await finishOther(fr); await G(fr, () => window.DegenCity.test.primary()); await sleep(300); }
  await sleep(2500); // let the camera settle
  // Click the lever in the 3D studio.
  const leverXY = await page.evaluate(() => { const { model, camera, renderer } = DCTest, o = model.getObjectByName('px-lever'), v = new o.position.constructor(); o.children[1].getWorldPosition(v); v.project(camera); const r = renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; });
  const spinsBefore = (await snap(fr)).spins; await page.mouse.click(leverXY[0], leverXY[1]); await sleep(400); const leverSpun = await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning || window.PX_CASINO_ENGINE.mechanics().lever !== null);
  await waitIdle(fr); await sleep(300); check('clicking the lever spins and pulls it', leverSpun && (await snap(fr)).spins === spinsBefore + 1, `at ${leverXY.map(Math.round)}`);
  await page.keyboard.press('Space'); await sleep(300); await waitIdle(fr); check('Space spins', (await snap(fr)).spins === spinsBefore + 2);
  const s1 = await snap(fr);
  check('stakes leave the test balance (shared LAYR stub)', Math.abs((s0.bal - s1.bal) - ((s1.wagered - s0.wagered) - (s1.paidOut - s0.paidOut))) < 1e-6, `wagered ${s1.wagered - s0.wagered}`);
  // Every bonus, the jackpot and the gamble, four stages each.
  // A plain spin can by chance earn a bonus (about 1 in 50 spins): play it out before the forced ones.
  for (let i = 0; i < 60; i++) { const st0 = await snap(fr); if (!(await sceneOf(fr)) && !st0.free && !st0.freeActive && !st0.features.length) break; await finishOther(fr); await G(fr, () => window.DegenCity.test.primary()); await sleep(300); }
  const totals = {};
  for (const kind of (process.env.KINDS ? process.env.KINDS.split(',').filter(Boolean) : ['free', 'vault', 'chain', 'jackpot', 'gamble'])) { try { totals[kind] = await playBonus(fr, kind, 'desktop'); check(`${kind}: trigger → intro → play → outro`, true, `win ${totals[kind]}`); } catch (e) { check(`${kind}: trigger → intro → play → outro`, false, e.message.split('\n')[0]); await shotScreen(fr, `desktop-${kind}-FAILED`); } }
  // Skip lands on the outro with the engine's total.
  await G(fr, () => window.DegenCity.test.play('vault')); await waitScene(fr, 'intro', 'vault'); await G(fr, () => window.DegenCity.test.skip()); await waitScene(fr, 'outro', 'vault'); await sleep(1500);
  const sk = await G(fr, () => window.DegenCity.snapshot().state.history[0]); await shotScreen(fr, 'desktop-skip-vault-outro'); check('Skip jumps to the outro with the dealt total', sk.win > 0 && /VAULT/.test(sk.feature), `win ${sk.win}`); await G(fr, () => window.DegenCity.test.primary()); await sleep(300);
  await G(fr, () => window.DegenCity.test.play('free')); await waitScene(fr, 'intro', 'free'); await G(fr, () => window.DegenCity.test.skip()); await waitScene(fr, 'outro', 'free'); const fs1 = await snap(fr); check('Skip runs the Mining Season instantly and summarises it', !fs1.free && !fs1.freeActive); await sleep(1400); await shotScreen(fr, 'desktop-skip-rain-outro'); await G(fr, () => window.DegenCity.test.primary()); await sleep(300);
  for (let i = 0; i < 20; i++) { if (!(await sceneOf(fr))) break; await finishOther(fr); }
  // Bonus Lab: every item played on the lab balance with four-stage screenshots; then Run all; the real game must be untouched.
  {
    const realKey = () => G(fr, () => { const s = window.DegenCity.snapshot().state; return JSON.stringify({ bal: window.ParallaxLAYRAccount.balance(), bank: s.balance, spins: s.spins, wagered: s.wagered, paidOut: s.paidOut, jackpots: s.jackpots, hist: s.history.length, pot: window.DegenCity.holder() }); });
    const realBefore = await realKey();
    await G(fr, () => window.DegenCity.test.setTurbo(true)); // the Lab items run at turbo speed here; stage screenshots still land on every stage
    check('Lab: opens with the L key', await (async () => { await G(fr, () => window.PX_CASINO_ENGINE.key('KeyL', 'l')); await sleep(500); return G(fr, () => window.DegenCity.lab.on()); })());
    await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
    const items = await G(fr, () => window.DegenCity.lab.items());
    check('Lab: thirteen items (eleven bonus items + two city-race items)', items.length === 13, items.map(i => i.id).join(','));
    // A recorder inside the game frame copies the screen the moment each scene stage appears (the autopilot moves quickly at turbo,
    // so sampling from outside would miss the short stages). Free-spin rounds have no scene during the spins: those are captured as 'play'.
    await G(fr, () => {
      const RPD = window.DegenCity; window.__rec = {}; let last = null, idle = 0;
      const cap = key => { if (window.__rec[key]) return; const c = document.createElement('canvas'); c.width = 1400; c.height = 960; c.getContext('2d').drawImage(RPD.screen(), 0, 0, 1400, 960); window.__rec[key] = c.toDataURL('image/png'); };
      window.__recT = setInterval(() => { const sc = RPD.scene(), key = sc ? sc.kind + ':' + sc.stage : null;
        if (key && key !== last) { last = key; setTimeout(() => cap(key), 140); }
        if (!key) { last = null; if (RPD.snapshot().state.free > 0 && !window.__rec['free:play'] && ++idle > 40) cap('free:play'); } else idle = 0; }, 30);
    });
    for (const it of items) {
      try {
        await G(fr, () => { window.__rec = {}; window.DegenCity.lab.setMode('seeded', 20261101); });
        const r = await G(fr, id => window.DegenCity.lab.run(id, { autopilot: true }), it.id); if (r !== 'ok') throw Error('run returned ' + r);
        for (let g = 0; g < 900; g++) { const sc = await sceneOf(fr), running = await G(fr, () => window.DegenCity.lab.running()); if (!running && !sc) break; await sleep(150); }
        await sleep(400);
        const rec = await G(fr, () => window.__rec), shots = Object.keys(rec), seen = (await G(fr, () => window.DegenCity.lab.state())).seen, keys = [...new Set(seen)];
        for (const k of shots) fs.writeFileSync(path.join(OUT, `lab-${it.id}-${k.replace(':', '-')}.png`), Buffer.from(rec[k].split(',')[1], 'base64'));
        const kinds = [it.kind, it.also].filter(Boolean), stages = st => kinds.some(k => keys.includes(`${k}:${st}`));
        const need = it.kind === 'race' ? [] : it.kind === 'free' ? ['trigger', 'intro', 'outro'] : it.kind === 'gamble' ? ['intro', 'outro'] : ['trigger', 'intro', 'play', 'outro'];
        const ok = need.every(stages);
        check(`Lab ${it.id}: ${it.kind} shows ${it.kind === 'free' ? 'trigger → intro → spins → outro' : it.kind === 'gamble' ? 'intro → play → outro' : 'trigger → intro → play → outro'}`, ok && !(await sceneOf(fr)), `${keys.join(' ')} | ${shots.length} screenshots`);
      } catch (e) { check(`Lab ${it.id}`, false, e.message.split('\n')[0]); await G(fr, () => window.DegenCity.lab.abort()).catch(() => {}); }
    }
    await G(fr, () => clearInterval(window.__recT));
    // Replay: the same seed gives the same round and the same net result.
    const idle = async () => { for (let i = 0; i < 400; i++) { if (!(await G(fr, () => window.DegenCity.lab.running())) && !(await sceneOf(fr)) && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) return; await sleep(200); } };
    await G(fr, () => window.DegenCity.lab.setMode('seeded', 7)); await G(fr, () => window.DegenCity.lab.run('pick', { autopilot: true })); await idle();
    const a1 = (await G(fr, () => window.DegenCity.lab.results())).find(x => x.id === 'pick'), seed1 = (await G(fr, () => window.DegenCity.lab.last())).seed;
    await G(fr, () => { const l = window.DegenCity.lab.last(); window.DegenCity.lab.run(l.id, { seed: l.seed, autopilot: true }); }); await idle();
    const a2 = (await G(fr, () => window.DegenCity.lab.results())).find(x => x.id === 'pick');
    check('Lab: replaying a seed repeats the round (same net result)', !!a1 && !!a2 && seed1 === 7 && a1.net === a2.net, `seed ${seed1}: ${a1 && a1.net} vs ${a2 && a2.net}`);
    // Run all.
    await idle(); await G(fr, () => window.DegenCity.lab.runAll());
    for (let i = 0; i < 900 && (await G(fr, () => window.DegenCity.lab.running())); i++) await sleep(250);
    const all = await G(fr, () => window.DegenCity.lab.results()); check('Lab: Run all passes every item', all.length === 13 && all.every(r => r.ok), all.filter(r => !r.ok).map(r => r.id + ':' + r.why).join(' ') || `${all.length} items`);
    await G(fr, () => window.DegenCity.lab.open()); await sleep(400); await page.screenshot({ path: path.join(OUT, 'desktop-lab-panel.png'), timeout: 180000 }); await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
    await G(fr, () => window.PX_CASINO_ENGINE.action('history')); await sleep(300); const hist = (await G(fr, () => window.PX_CASINO_ENGINE.ui())).modal || ''; check('Lab: rounds are marked LAB in History', /LAB/.test(hist)); await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
    await G(fr, () => window.DegenCity.lab.exit()); await sleep(500);
    check('Lab: your real game is exactly as you left it', (await realKey()) === realBefore, '');
    await G(fr, () => window.DegenCity.test.setTurbo(false));
    check('Lab: off again', !(await G(fr, () => window.DegenCity.lab.on())));
  }
  // Reduced motion: calmer scenes, same flow.
  await G(fr, () => window.DegenCity.test.setReduced(true)); await playBonus(fr, 'chain', 'reduced'); check('reduced motion: Block Party plays all four stages', true); await G(fr, () => window.DegenCity.test.setReduced(false));
  // Fair Play and engine text.
  await G(fr, () => window.PX_CASINO_ENGINE.action('pays')); await sleep(200); const rules = (await G(fr, () => window.PX_CASINO_ENGINE.ui())).modal; await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, 'desktop-3-pays-panel.png'), timeout: 180000 });
  check('Fair Play states 94.38% and the split', ['94.38%', '59.7%', '1.5%', '8.5%', '11.9%', '10.3%', '2.4%', '1 in 140', '1 in 290', '1 in 113,000', 'even bet', 'design estimate'].every(t => rules.includes(t)));
  await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  check('no engine slot names on screen copy', !/\b(cherry|lemon|Mining chip|Vault key|Chain node)\b/.test(rules));
  // Fullscreen session, driven only by the bottom bar.
  await fullscreenSession(page, fr, 'desktop');
  check('desktop: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  }

  // Phone width.
  ({ browser, page, fr, errors } = await open({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }));
  await page.screenshot({ path: path.join(OUT, 'phone-1-cabinet-view.png'), timeout: 180000 });
  const small = await page.evaluate(() => [...document.querySelectorAll('#top button, #deck button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(b => b.w < 44 || b.h < 44));
  check('phone: page buttons are at least 44 px', !small.length, JSON.stringify(small));
  await fullscreenSession(page, fr, 'phone');
  check('phone: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  console.log(`${results.filter(r => r.ok).length}/${results.length} passed`); process.exit(results.every(r => r.ok) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });

async function barShowsEarly(fr, id) { return fr.evaluate(id => { const b = document.querySelector(`#fsBar [data-fs="${id}"]`); return !!(b && !b.hidden && !b.disabled && b.offsetParent); }, id); }
async function fullscreenSession(page, fr, tag) {
  await page.click('#fsBtn'); await sleep(800);
  const on = await G(fr, () => window.DegenCity.fullscreen()); check(`${tag}: fullscreen opens`, on);
  const bar = id => fr.locator(`#fsBar [data-fs="${id}"]`), click = async id => { await bar(id).click(); await sleep(250); };
  const vis = await fr.evaluate(() => [...document.querySelectorAll('#fsBar [data-fs]')].filter(b => !b.hidden).map(b => b.dataset.fs));
  check(`${tag}: bar has every control`, ['primary', 'betDown', 'bet', 'betUp', 'auto', 'pays', 'fair', 'turbo', 'sound', 'volume', 'history', 'balance', 'test', 'exit'].every(k => vis.includes(k)), vis.join(' '));
  const tiny = await fr.evaluate(() => [...document.querySelectorAll('#fsBar .fb')].filter(b => !b.hidden && b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { k: b.dataset.fs, w: Math.round(r.width), h: Math.round(r.height) }; }).filter(b => b.w < 44 || b.h < 44));
  check(`${tag}: bar touch targets ≥ 44 px`, !tiny.length, JSON.stringify(tiny));
  await page.screenshot({ path: path.join(OUT, `${tag}-fs-1-idle.png`) });
  const b0 = await G(fr, () => window.DegenCity.snapshot().state.bet); await click('betUp'); const b1 = await G(fr, () => window.DegenCity.snapshot().state.bet); await click('betDown');
  check(`${tag}: bar bets`, b1 > b0, `${b0} → ${b1}`);
  const sp = (await snap(fr)).spins; await click('primary'); await waitIdle(fr); await sleep(400); check(`${tag}: bar spins`, (await snap(fr)).spins === sp + 1);
  // A plain spin can trigger a real bonus by chance; play it out through the test hooks so the checks below start from an idle machine.
  for (let i = 0; i < 80; i++) { const st = await snap(fr); if (!(await sceneOf(fr)) && !st.free && !st.features.length && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) { await sleep(500); if (!(await sceneOf(fr)) && !(await snap(fr)).features.length) break; continue; } await G(fr, () => { window.DegenCity.test.skip(); }); await sleep(250); await G(fr, () => { window.DegenCity.test.primary(); }); await sleep(350); }
  if (await barShowsEarly(fr, 'keep')) await click('keep');
  for (const id of ['pays', 'fair', 'history']) { await click(id); const m = await fr.evaluate(() => { const d = document.getElementById('modal'); const r = d.getBoundingClientRect(); const bar = document.getElementById('fsBar').getBoundingClientRect(); return { open: d.open, bottom: r.bottom, barTop: bar.top, h: innerHeight }; }); if (id === 'pays') await page.screenshot({ path: path.join(OUT, `${tag}-fs-2-pays.png`) }); await fr.evaluate(() => window.PX_CASINO_ENGINE.closeModal()); await sleep(150); check(`${tag}: ${id} opens and closes inside fullscreen`, m.open, `dialog bottom ${Math.round(m.bottom)} of ${m.h}`); }
  await click('auto'); const autoOpen = await fr.evaluate(() => document.getElementById('modal').open); await fr.evaluate(() => window.PX_CASINO_ENGINE.closeModal()); check(`${tag}: auto opens inside fullscreen`, autoOpen);
  await click('turbo'); await click('turbo'); await click('sound'); await click('sound');
  // Every bonus from the in-game Test dialog, then only the bar's big button (and the bar's ODD for the gamble).
  for (const kind of (process.env.KINDS ? process.env.KINDS.split(',').filter(Boolean) : ['free', 'vault', 'chain', 'jackpot', 'gamble'])) {
    await click('test'); await fr.locator(`#modal [data-t="${kind}"]`).click(); await sleep(300);
    // The scene is queued 350 ms after the spin ends: wait for it to appear before treating the machine as idle.
    for (let w = 0; w < 40 && !(await sceneOf(fr)) && !(await snap(fr)).features.length; w++) await sleep(150);
    for (let i = 0; i < 300; i++) { const s = await sceneOf(fr), st = await snap(fr); if (!s && !st.free && !st.features.length && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) { await sleep(900); const s2 = await sceneOf(fr), st2 = await snap(fr); if (!s2 && !st2.free && !st2.features.length && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) break; continue; }
      if (s && s.kind === 'gamble' && s.stage === 'intro') { await click('odd'); continue; }
      if (s && s.kind === 'vault' && s.stage === 'play') { const f = st.features[0] ? await G(fr, () => window.DegenCity.snapshot().state.features[0]) : null; if (f && f.picks.length < 3) { const i2 = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(i => !f.picks.includes(i)); const rect = await fr.evaluate(i => { const c = document.querySelector('#fsStage canvas').getBoundingClientRect(); const gap = 22, w = (1310 - 2 * gap) / 3, h = (570 - 2 * gap) / 3; const x = 45 + (i % 3) * (w + gap) + w / 2, y = 206 + Math.floor(i / 3) * (h + gap) + h / 2; return [c.left + x / 1400 * c.width, c.top + y / 960 * c.height]; }, i2); await page.mouse.click(rect[0], rect[1]); await sleep(500); continue; } }
      if (s && s.stage === 'outro' && i % 3 === 0 && kind !== 'free') await page.screenshot({ path: path.join(OUT, `${tag}-fs-bonus-${kind}-outro.png`), timeout: 180000 }).catch(() => {});
      const pb = await fr.evaluate(() => { const b = document.querySelector('#fsBar [data-fs="primary"]'); return !!(b && !b.hidden && !b.disabled && b.offsetParent); }); if (pb) await bar('primary').click({ timeout: 5000 }).catch(() => {}); await sleep(s && s.kind === 'jackpot' && s.stage === 'play' ? 1500 : 450);
      if (i === 4) await page.screenshot({ path: path.join(OUT, `${tag}-fs-bonus-${kind}.png`), timeout: 180000 }).catch(() => {}); }
    const left = await sceneOf(fr); check(`${tag}: ${kind} played to the end from the fullscreen bar`, !left, left ? JSON.stringify(left) : '');
  }
  // Gamble offered after a plain win: the bar shows ODD/EVEN?, then ODD SAT / EVEN SAT.
  await G(fr, () => window.DegenCity.test.force('win')); await click('primary'); await waitIdle(fr); await sleep(500);
  const waitFor = async (fn, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(200); } return false; };
  const barShows = id => fr.evaluate(id => { const b = document.querySelector(`#fsBar [data-fs="${id}"]`); return !!(b && !b.hidden && !b.disabled && b.offsetParent); }, id);
  if (await waitFor(() => barShows('gamble'), 5000)) {
    await click('gamble'); const intro = await waitFor(async () => { const s = await sceneOf(fr); return s && s.kind === 'gamble' && s.stage === 'intro'; });
    const oddVis = intro && await barShows('odd') && await barShows('even') && await barShows('keep');
    await page.screenshot({ path: path.join(OUT, `${tag}-fs-3-gamble.png`), timeout: 180000 }).catch(() => {});
    if (oddVis) await click('even');
    const landed = await waitFor(async () => { const s = await sceneOf(fr); return !s || s.stage === 'outro' || await barShows('primary'); }, 45000);
    for (let i = 0; i < 6 && await sceneOf(fr); i++) { if (await barShows('primary')) await click('primary'); await sleep(500); }
    const left = await sceneOf(fr); check(`${tag}: gamble played from the bar`, oddVis && landed && !left, JSON.stringify({ intro, oddVis, landed, left }));
  } else check(`${tag}: gamble offered on the bar after a win`, false, JSON.stringify(await G(fr, () => ({ gamble: window.DegenCity.snapshot().state.gamble, scene: window.DegenCity.scene() }))));
  await click('exit'); await sleep(600); check(`${tag}: exit fullscreen`, !(await G(fr, () => window.DegenCity.fullscreen())) && !(await page.evaluate(() => document.getElementById('game').classList.contains('fs'))));
}

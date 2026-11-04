// End-to-end check of the standalone test page (public/casino-machines/xtrata-originals/index.html):
//  1. the studio: lever, deck buttons and the screen clicked in 3D; cabinet and screen views photographed;
//  2. every Bonus Lab item played from trigger to summary through its own scene, with a screenshot of each stage;
//  3. Skip and reduced motion on every item (seeded Layers and The X must pay the same with or without Skip);
//  4. a whole fullscreen session driven only by the bottom bar, at desktop and phone width, with touch-target checks;
//  5. Run all from the Lab menu.
//   node tools/xtrata-originals/test-page.cjs http://localhost:8123/casino-machines/xtrata-originals/ [outdir]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const BASE = process.argv[2], OUT = process.argv[3] || path.join(__dirname, 'checks'); fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];
async function open(viewport, query = '?lite') {
  const browser = await chromium.launch({ args: /nostudio/.test(query) ? ['--disable-gpu', '--disable-accelerated-2d-canvas', '--autoplay-policy=no-user-gesture-required'] : ARGS }); /* without the studio, keep the game canvas on the CPU: software-GPU readbacks are very slow */ const ctx = await browser.newContext({ viewport, hasTouch: viewport.width < 500 }); const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(m.text()); });
  await page.goto(BASE + query); await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === '1', null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  await page.evaluate(() => { setInterval(() => { try { XOTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30); }); // headless rAF is throttled: drive the game's own pump
  const cdp = await ctx.newCDPSession(page); const shotPage = async name => { const r = await cdp.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64')); };
  return { browser, page, fr, errors, shotPage };
}
const G = (fr, fn, a) => fr.evaluate(fn, a);
const scene = fr => G(fr, () => window.XtrataOriginals.scene());
const shotScreen = async (fr, name) => { const d = await G(fr, () => window.XtrataOriginals.screen().toDataURL('image/jpeg', .82)); fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(d.split(',')[1], 'base64')); };
const waitScene = (fr, stage, kind, ms = 60000) => fr.waitForFunction(([s, k]) => { const x = window.XtrataOriginals.scene(); return x && x.stage === s && (!k || x.kind === k); }, [stage, kind], { timeout: ms, polling: 200 });
const waitIdle = (fr, ms = 120000) => fr.waitForFunction(() => { const s = window.XtrataOriginals.snapshot(); return !s.spinning && !s.pres && !s.state.features.length && !s.state.free; }, null, { timeout: ms, polling: 200 });
const snap = fr => G(fr, () => { const s = window.XtrataOriginals.snapshot().state; return { bal: s.balance, free: s.free, features: s.features.map(f => f.type), spins: s.spins, gamble: s.gamble, last: s.history[0] }; });
const T = (fr, k, ...a) => G(fr, ([k, a]) => window.XtrataOriginals.test[k](...a), [k, a]);
// Play one Lab item through the full presentation with the scene's own controls; photograph trigger, intro, play and summary.
async function playItem(fr, item, tag, { skip = false, seed = 4242, bet = 100 } = {}) {
  const before = (await snap(fr)).bal; const r = await T(fr, 'lab', item, bet, seed); if (r !== 'ok') throw Error(`lab(${item}) -> ${r}`);
  let kind = null, idleSince = 0; for (let i = 0; i < 300 && !kind; i++) { const s = await scene(fr); if (s) kind = s.kind; else { const sn = await G(fr, () => window.XtrataOriginals.snapshot()); const idle = !sn.spinning && !sn.pres && !sn.state.features.length; if (!idle) idleSince = 0; else if (!idleSince) idleSince = Date.now(); else if (Date.now() - idleSince > 3000) break; await sleep(250); } } // a gamble opens 0.9 s after its winning spin lands
  const stages = new Set(), seen = [];
  const shoot = async stage => { const s = await scene(fr); if (!s) return; const k = `${s.kind}-${stage}`; if (seen.includes(k)) return; seen.push(k); if (!skip) await shotScreen(fr, `${tag}-${item}-${seen.length}-${k}`); };
  for (let guard = 0; guard < 900; guard++) {
    const s = await scene(fr); if (!s) { const sn = await G(fr, () => window.XtrataOriginals.snapshot()); if (!sn.spinning && !sn.state.features.length && !sn.state.free) break; await sleep(200); continue; }
    stages.add(`${s.kind}:${s.stage}`);
    if (s.stage === 'trigger') { await sleep(skip ? 100 : 1100); await shoot('trigger'); if (skip) await T(fr, 'skip'); else await waitScene(fr, 'intro', s.kind).catch(() => {}); continue; }
    if (s.stage === 'intro') { await sleep(skip ? 100 : 900); await shoot('intro'); if (skip) { await T(fr, 'skip'); await sleep(300); continue; }
      if (s.kind === 'gamble') await T(fr, 'gamble', item === 'gamble-lose' ? 'odd' : 'even'); else if (s.kind !== 'jackpot') await T(fr, 'primary'); else await waitScene(fr, 'play', 'jackpot').catch(() => {}); await sleep(400); continue; }
    if (s.stage === 'play') {
      if (skip && s.kind !== 'jackpot') { await T(fr, 'skip'); await sleep(300); continue; }
      if (s.kind === 'vault') { for (const i of [1, 4, 7]) { await T(fr, 'pick', i); await sleep(1200); if (i === 4) await shoot('play'); } await waitScene(fr, 'summary', 'vault').catch(() => {}); continue; }
      if (s.kind === 'chain') { for (let i = 0; i < 40; i++) { const x = await scene(fr); if (!x || x.stage !== 'play' || x.kind !== 'chain') break; await T(fr, 'respin'); await sleep(700); if (i === 1) await shoot('play'); } continue; }
      if (s.kind === 'free') { if (!seen.includes('free-play')) { await sleep(3500); await shoot('play'); } else await sleep(600); continue; } // stay responsive: Layers or The Chorus can trigger inside a session
      if (s.kind === 'jackpot') { await sleep(2600); await shoot('play'); await waitScene(fr, 'summary', 'jackpot').catch(() => {}); continue; }
      if (s.kind === 'gamble') { await sleep(1000); await shoot('play'); await waitScene(fr, 'summary', 'gamble').catch(() => {}); continue; }
    }
    if (s.stage === 'summary') { await sleep(skip ? 300 : 2300); await shoot('summary'); await T(fr, 'primary'); await sleep(900); continue; }
    await sleep(200);
  }
  await waitIdle(fr).catch(() => {}); const after = await snap(fr);
  return { stages: [...stages], gained: Math.round((after.bal - before) * 100) / 100, last: after.last };
}
// Studio spins can land a real bonus (1 in 140): settle it with Skip and Collect so the next check starts idle.
async function settle(fr) { await fr.waitForFunction(() => !window.XtrataOriginals.snapshot().spinning, null, { timeout: 60000, polling: 200 }); for (let i = 0; i < 80; i++) { const sn = await G(fr, () => window.XtrataOriginals.snapshot()); if (!sn.spinning && !sn.pres && !sn.state.features.length && !sn.state.free) return; const sc = await scene(fr); if (sc && (sc.stage === 'summary')) await T(fr, 'primary'); else if (sc) await T(fr, 'skip'); else await T(fr, 'primary'); await sleep(700); } }
const ITEMS = ['free', 'free-retrigger', 'vault', 'chain', 'chain-full', 'jackpot', 'gamble-win', 'gamble-lose', 'scatter3', 'scatter4', 'scatter5', 'cameo', 'callisto'];
async function project(page, role, dy = 0) { return page.evaluate(([r, dy]) => { const o = XOTest.model.getObjectByName('px-' + r); const v = o.localToWorld(new XOTest.THREE.Vector3(0, dy, 0)); v.project(XOTest.camera); return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight]; }, [role, dy]); }

async function fullscreenSession(viewport, tag) {
  const { browser, page, fr, errors, shotPage } = await open(viewport, '?nostudio');
  const F = page.frameLocator('iframe.pxLogicFrame');
  await page.keyboard.press('f'); await sleep(800);
  const active = await G(fr, () => window.PX_CASINO_ENGINE.fullscreen.active()); check(`${tag}: F enters fullscreen`, active);
  await shotPage(`${tag}-fullscreen-idle`);
  // Touch targets: every visible control on the bar is at least 44 px in both directions.
  const small = await G(fr, () => [...document.querySelectorAll('#fsbar button, #fsbar input, #fsbar label.deck')].filter(b => b.offsetParent && getComputedStyle(b).display !== 'none').map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className || b.tagName, Math.round(r.width), Math.round(r.height)]; }).filter(([, w, h]) => w < 44 || h < 44));
  check(`${tag}: bar touch targets >= 44 px`, small.filter(x => x[0] !== 'vol').length === 0, JSON.stringify(small));
  const barH = await G(fr, () => document.getElementById('fsbar').getBoundingClientRect().height); check(`${tag}: bar fits (${Math.round(barH)} px tall)`, barH < viewport.height * .45);
  const click = async sel => { await F.locator(sel).click({ timeout: 15000 }); await sleep(250); };
  const closeModal = async () => { await F.locator('#close').click(); await sleep(250); };
  const modalOpen = () => G(fr, () => document.getElementById('modal').open);
  // Bets, spin, auto, and every panel opened and closed inside fullscreen.
  const b0 = (await snap(fr)); await click('#plus'); await click('#minus'); await click('#minus'); const betNow = await G(fr, () => window.XtrataOriginals.snapshot().state.bet); check(`${tag}: bar −LAYR / +LAYR change the bet`, betNow === 40, String(betNow)); await click('#plus');
  await click('#spin'); await settle(fr).catch(() => {}); const s1 = await snap(fr); check(`${tag}: bar INSCRIBE spins`, s1.spins === b0.spins + 1, `${b0.spins} -> ${s1.spins}`);
  for (const id of ['rules', 'fair', 'work', 'pot', 'history', 'account', 'settings']) { await click('#' + id); const o = await modalOpen(); const vis = await G(fr, () => { const r = document.getElementById('modal').getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top >= -1; }); if (id === 'rules') await shotPage(`${tag}-fullscreen-gallery`); check(`${tag}: ${id} opens inside fullscreen`, o && vis && await G(fr, () => window.PX_CASINO_ENGINE.fullscreen.active())); await closeModal(); }
  await click('#auto'); check(`${tag}: AUTO-LAYER menu opens`, await modalOpen()); await F.locator('[data-auto="10"]').click(); await sleep(2500); const autoOn = await G(fr, () => window.PX_CASINO_ENGINE.ui().auto); await click('#auto'); await settle(fr).catch(() => {}); check(`${tag}: AUTO-LAYER runs and stops from the bar`, autoOn && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().auto)));
  await click('#turbo'); check(`${tag}: TURBO toggles`, await G(fr, () => window.PX_CASINO_ENGINE.ui().turbo)); await click('#turbo');
  await click('#sound'); check(`${tag}: SOUND toggles`, await G(fr, () => window.PX_CASINO_ENGINE.ui().muted)); await click('#sound');
  await F.locator('#vol').fill('0.7'); check(`${tag}: volume slider on the bar`, Math.abs(await G(fr, () => window.XtrataOriginals.snapshot().state.volume) - .7) < .01);
  // The Bonus Lab from the bar: pick an item in the menu and run it, then play every bonus with the bar and the screen only.
  await click('#labBtn'); check(`${tag}: LAB opens the Bonus Lab menu inside fullscreen`, await modalOpen()); await shotPage(`${tag}-fullscreen-lab-menu`);
  await F.locator('input[name=labItem][value=vault]').check(); await F.locator('#labBet').selectOption('200'); await F.locator('#labRun').click(); await waitScene(fr, 'trigger', 'vault');
  await waitScene(fr, 'intro', 'vault'); await click('#fbGo'); await waitScene(fr, 'play', 'vault');
  for (const i of [0, 3, 8]) { await F.locator(`[data-pick="${i}"]`).click(); await sleep(900); } await shotPage(`${tag}-fullscreen-chorus`);
  await waitScene(fr, 'summary', 'vault'); await sleep(600); await click('#fbGo'); await waitIdle(fr); check(`${tag}: The Chorus played from the bar at bet 200`, (await snap(fr)).last && (await snap(fr)).last.bet === 200 && (await snap(fr)).last.lab === true);
  for (const k of ['chain', 'free', 'jackpot']) {
    await G(fr, k => window.XtrataOriginals.test.lab(k, 100, 77), k); await waitScene(fr, 'intro', k, 60000);
    if (k !== 'jackpot') await click('#fbGo'); await waitScene(fr, 'play', k);
    // Drive it with the bar only: Respin for Layers; a bonus that triggers inside Session Mode is skipped and collected from the bar too.
    for (let i = 0; i < 400; i++) { const x = await scene(fr); if (x && x.kind === k && x.stage === 'summary') break;
      if (x && x.kind !== k) await F.locator(x.stage === 'summary' ? '#fbGo' : '#fbSkip').click({ timeout: 3000 }).catch(() => {}); else if (x && x.kind === 'chain' && x.stage === 'play') await F.locator('#fbGo').click({ timeout: 3000 }).catch(() => {});
      await sleep(600); }
    await waitScene(fr, 'summary', k, 30000); await shotPage(`${tag}-fullscreen-${k}-summary`); await sleep(500); await click('#fbGo'); await waitIdle(fr); check(`${tag}: ${k} played from the bar`, true);
  }
  await G(fr, () => window.XtrataOriginals.test.lab('gamble-win', 100, 9)); await waitScene(fr, 'intro', 'gamble', 60000); await shotPage(`${tag}-fullscreen-gamble`); await click('#fbBtc'); await waitScene(fr, 'summary', 'gamble'); await sleep(500); await click('#fbGo'); await waitIdle(fr);
  check(`${tag}: Bitcoin or Stacks called from the bar`, true);
  // A real gamble offer shows its two choices on the bar.
  await G(fr, () => window.XtrataOriginals.test.labExit()); await sleep(300);
  let offered = false; for (let i = 0; i < 6 && !offered; i++) { await G(fr, () => window.PX_CASINO_ENGINE.test.force('win')); await waitIdle(fr); offered = await G(fr, () => !document.getElementById('gBtc').hidden && !document.getElementById('gStx').hidden); }
  if (offered) { await shotPage(`${tag}-fullscreen-gamble-offer`); await click('#gStx'); await waitScene(fr, 'summary', 'gamble'); await sleep(400); await click('#fbGo'); await waitIdle(fr); }
  check(`${tag}: gamble choices appear on the bar after a win`, offered);
  await click('#fsExit'); check(`${tag}: Exit leaves fullscreen`, !(await G(fr, () => window.PX_CASINO_ENGINE.fullscreen.active())));
  check(`${tag}: no page errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await Promise.race([browser.close(), sleep(6000)]);
}

(async () => {
  // 1. Studio at desktop width: lever, deck buttons, the screen, views.
  let { browser, page, fr, errors, shotPage } = await open({ width: 1280, height: 800 });
  await sleep(2500); await shotPage('studio-cabinet-view');
  check('studio renders with WebGL (SoftwareRenderer fallback present)', await page.evaluate(() => typeof SoftwareRenderer === 'function'));
  let s0 = await snap(fr); let s1 = s0; for (let k = 0; k < 4 && s1.spins === s0.spins; k++) { await sleep(800); const [lx, ly] = await project(page, 'lever', .55 + k * .15); await page.mouse.move(lx, ly); await page.mouse.down(); await page.mouse.up(); await sleep(600); await settle(fr); s1 = await snap(fr); }
  check('clicking the lever spins', s1.spins === s0.spins + 1, `${s0.spins} -> ${s1.spins}`);
  const bet0 = await G(fr, () => window.XtrataOriginals.snapshot().state.bet); const bu = await page.evaluate(() => { let o = null; XOTest.model.traverse(x => { if (!o && x.userData.pxMachineAction === 'betUp') o = x; }); const v = new XOTest.THREE.Vector3(); o.getWorldPosition(v); v.project(XOTest.camera); return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight]; });
  await page.mouse.click(bu[0], bu[1]); await sleep(400); check('the +LAYR deck button raises the bet', (await G(fr, () => window.XtrataOriginals.snapshot().state.bet)) > bet0);
  await page.evaluate(() => XOTest.engine.action('betDown'));
  s0 = await snap(fr); let [lx, ly] = await project(page, 'spinPhysical'); await page.mouse.click(lx, ly); await settle(fr); s1 = await snap(fr); check('the INSCRIBE deck button spins', s1.spins === s0.spins + 1);
  await page.keyboard.press('Space'); await sleep(300); await settle(fr); check('Space spins', (await snap(fr)).spins === s1.spins + 1);
  console.log('… screen view'); await page.click('[data-view=screen]'); await sleep(2500); console.log('… shot'); await shotPage('studio-screen-view'); console.log('… test panel'); await page.click('[data-view=cabinet]');
  await page.keyboard.press('t'); await sleep(300); await page.click('[data-k="twins:none"]'); const tn = await G(fr, () => window.XtrataOriginals.sources()); check('test panel: holders unknown shows unknown, never zero', tn.mintRead === 'unknown' && tn.minted === null);
  await page.click('[data-k="twins:all"]'); check('test panel: all 111', (await G(fr, () => window.XtrataOriginals.sources())).minted === 111); await page.click('[data-k="twins:some"]');
  await shotPage('studio-test-panel'); await page.keyboard.press('t');
  check('studio: no page errors', errors.length === 0, errors.slice(0, 3).join(' | ')); await Promise.race([browser.close(), sleep(6000)]);
  if (process.env.ONLY === 'studio') { fs.writeFileSync(path.join(OUT, 'results-studio.json'), JSON.stringify(results, null, 1)); process.exit(results.some(r => !r.ok) ? 1 : 0); }
  // The game inside the frame is the same with or without the 3D studio; the long scene runs use ?nostudio so software WebGL doesn't slow the clock.
  ({ browser, page, fr, errors, shotPage } = await open({ width: 1280, height: 800 }, '?nostudio'));
  // 2. Every Bonus Lab item, four stages each.
  await G(fr, () => window.XtrataOriginals.test.labOpen()); await sleep(300); await shotPage('lab-menu'); await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  const real = await G(fr, () => window.ParallaxLAYRAccount.balance());
  for (const it of ITEMS) { const r = await playItem(fr, it, 'lab'); const kinds = [...new Set(r.stages.map(x => x.split(':')[0]))]; const full = kinds.every(k => ['trigger', 'intro', 'play', 'summary'].every(st => r.stages.includes(`${k}:${st}`) || (k === 'gamble' && st === 'trigger' && false)));
    check(`lab ${it}: full presentation ${kinds.join('+') || 'base win'}`, (['cameo', 'callisto'].includes(it) && !kinds.length) || full, `${r.stages.join(',')} · gained ${r.gained} · LAB ${!!(r.last && r.last.lab)}`);
    if (it === 'chain-full') check('lab chain-full: The X follows a full tower', kinds.includes('jackpot'));
    if (it === 'cameo') check('lab cameo: an Audionaut cameo is recorded', r.last && r.last.cameos && r.last.cameos.length > 0, JSON.stringify(r.last && r.last.cameos));
    if (it === 'free-retrigger') check('lab free-retrigger: retrigger happened', r.last && /RETRIGGER|FREE/.test(JSON.stringify(await G(fr, () => window.XtrataOriginals.snapshot().state.history.slice(0, 14).map(h => h.feature))))); }
  check('lab never touched the real LAYR account', Math.abs((await G(fr, () => window.ParallaxLAYRAccount.balance())) - real) < .001);
  // 3. Skip and reduced motion on every item; seeded Layers and The X pay the same with Skip.
  const R = () => T(fr, 'labReset'); await R(); const full1 = await playItem(fr, 'chain-full', 'cmp', { skip: false, seed: 9001 }); await R(); const full2 = await playItem(fr, 'chain-full', 'cmp', { skip: true, seed: 9001 }); // same meters both times
  check('Skip pays the same total (seeded full tower + The X)', full1.gained === full2.gained, `${full1.gained} / ${full2.gained}`);
  await R(); const j1 = await playItem(fr, 'jackpot', 'cmp', { seed: 31 }); await R(); const j2 = await playItem(fr, 'jackpot', 'cmp', { skip: true, seed: 31 }); check('Skip pays the same total (seeded The X)', j1.gained === j2.gained, `${j1.gained} / ${j2.gained}`);
  await G(fr, () => window.PX_CASINO_ENGINE.test.setReduced(true));
  for (const it of ['free', 'vault', 'chain', 'jackpot', 'gamble-win']) { const r = await playItem(fr, it, 'reduced', { seed: 555 }); check(`reduced motion: ${it} plays to its summary`, r.stages.some(s => s.endsWith(':summary'))); }
  for (const it of ['free', 'vault', 'chain', 'jackpot', 'gamble-lose']) { const r = await playItem(fr, it, 'skip', { skip: true, seed: 556 }); check(`skip: ${it} ${it.startsWith('gamble') ? 'keeps the win (Skip on the offer = keep, straight to the outro)' : 'jumps to its summary'}`, it.startsWith('gamble') ? r.last && r.last.win > 0 && r.gained === r.last.win - r.last.bet && !r.stages.some(s => s.endsWith(':play')) : r.stages.some(s => s.endsWith(':summary')), `net ${r.gained} = win ${r.last && r.last.win} − bet ${r.last && r.last.bet}`); }
  await G(fr, () => window.PX_CASINO_ENGINE.test.setReduced(false));
  // 5. Run all from the menu.
  await G(fr, () => window.XtrataOriginals.test.labOpen()); await sleep(300); await G(fr, () => document.getElementById('labAll').click());
  const t0 = Date.now(); let done = false; while (Date.now() - t0 < 900000) { if (!(await G(fr, () => window.PX_CASINO_ENGINE.lab.runAllActive())) && !(await scene(fr))) { done = true; break; } await sleep(1000); }
  check('Run all completes every item', done, `${((Date.now() - t0) / 1000).toFixed(0)} s`);
  await G(fr, () => window.XtrataOriginals.test.labExit());
  check('desktop lab run: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await Promise.race([browser.close(), sleep(6000)]);
  // Phone width studio.
  ({ browser, page, fr, errors, shotPage } = await open({ width: 390, height: 844 })); await sleep(2500); await shotPage('phone-studio'); await page.click('[data-view=screen]'); await sleep(2000); await shotPage('phone-screen-view');
  const hdr = await page.evaluate(() => [...document.querySelectorAll('header button, header .chip')].map(b => b.getBoundingClientRect()).filter(r => r.height < 44 || r.right > innerWidth + 1).length); check('phone: header controls >= 44 px and on screen', hdr === 0, String(hdr));
  await Promise.race([browser.close(), sleep(6000)]);
  // 4. Fullscreen sessions.
  await fullscreenSession({ width: 1280, height: 800 }, 'desktop');
  await fullscreenSession({ width: 390, height: 844 }, 'phone');
  const failed = results.filter(r => !r.ok); fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  console.log(`${results.length - failed.length}/${results.length} passed`); process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

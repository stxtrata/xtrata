// The 3D buttons really move: press each deck button on the test page and read the meshes one rendered frame later, mid-press and after the
// spring back. The game frame runs on a fake clock, so the result does not depend on how slow the headless software renderer is.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu'] }), page = await browser.newPage(); let bad = 0;
  const check = (n, ok, d = '') => { if (!ok) bad++; console.log(ok ? 'PASS' : 'FAIL', n, d); };
  await page.goto(process.argv[2]); await page.waitForFunction(() => window.RFTest, null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
  await page.evaluate(() => { RFTest.setView('screen'); window.__frames = 0; const r = RFTest.renderer.render.bind(RFTest.renderer); RFTest.renderer.render = (...a) => { window.__frames++; return r(...a); }; });
  await fr.evaluate(() => { const real = performance.now.bind(performance); window.__fake = null; performance.now = () => (window.__fake == null ? real() : window.__fake); });
  const zs = a => page.evaluate(a => { const o = []; RFTest.model.traverse(m => { if (m.userData.pxMachineAction === a && m.isMesh) o.push(+m.position.z.toFixed(4)); }); return o; }, a);
  const nextFrame = async () => { const n = await page.evaluate(() => window.__frames); await page.waitForFunction(n => window.__frames > n, n, { timeout: 60000 }); };
  for (const a of ['pays', 'betDown', 'betUp', 'auto']) {
    await page.waitForTimeout(600); await nextFrame(); const rest = await zs(a);
    const T0 = await fr.evaluate(() => { window.__fake = performance.now(); return window.__fake; });
    await page.evaluate(a => document.querySelector(`#deck [data-a="${a}"]`).click(), a);
    await fr.evaluate(T => { window.__fake = T + 60; }, T0); await nextFrame(); await nextFrame(); const down = await zs(a);
    await fr.evaluate(T => { window.__fake = T + 400; }, T0); await nextFrame(); await nextFrame(); const back = await zs(a);
    await fr.evaluate(() => { window.__fake = null; }); await fr.evaluate(() => window.PX_CASINO_ENGINE.closeModal());
    const sunk = down.map((z, i) => +(rest[i] - z).toFixed(3));
    check(`${a}: cap and face sink about 0.03, the base stays`, sunk.length === 3 && sunk[0] === 0 && sunk[1] >= .028 && sunk[2] >= .028, `rest ${rest} mid-press ${down}`);
    check(`${a}: back at rest`, JSON.stringify(rest) === JSON.stringify(back), `after ${back}`);
  }
  await page.screenshot({ path: 'dist/test/press-screen-view.png' });
  await browser.close(); console.log(bad ? bad + ' FAILED' : 'all 3D press checks passed'); process.exit(bad ? 1 : 0);
})();

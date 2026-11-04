// Deck-button press check: every deck button plunges fast and springs back, and the PRESS cap does the same through spinZ.
//   node tools/check-press.cjs http://localhost:8102/index.html
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu'] }), page = await browser.newPage(); let bad = 0;
  const check = (n, ok, d = '') => { if (!ok) bad++; console.log(ok ? 'PASS' : 'FAIL', n, d); };
  await page.goto(process.argv[2]); await page.waitForFunction(() => window.RFTest, null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
  for (const a of ['betUp', 'betDown', 'auto', 'pays', 'spin']) {
    // A fake clock keeps the sampling exact however slow the headless software renderer is.
    const r = await fr.evaluate(a => {
      const E = window.PX_CASINO_ENGINE, real = performance.now.bind(performance); let fake = real(); performance.now = () => fake; const t0 = fake, s = [];
      try { E.action(a); for (let t = 0; t <= 360; t += 4) { fake = t0 + t; const m = E.mechanics(); s.push([t, a === 'spin' ? +(.19 - m.spinZ).toFixed(4) : m.press ? +m.press.depth.toFixed(2) : 0]); } } finally { performance.now = real; }
      return s; }, a);
    if (process.env.DUMP) console.log(a, JSON.stringify(r)); const peak = Math.max(...r.map(x => x[1])), tPeak = r.find(x => x[1] >= peak * .97)[0], last = r[r.length - 1][1];
    check(`${a}: plunges at least ${a === 'spin' ? '.03' : '.9 of its travel'}`, a === 'spin' ? peak >= .03 : peak >= .9, `peak ${peak}`);
    check(`${a}: fully down within 60 ms`, tPeak <= 60, `${tPeak} ms`);
    check(`${a}: springs back by the end` , a === 'spin' ? last <= .013 : last === 0, `end ${last}`);
    if (a === 'spin') await fr.evaluate(() => window.RobotFactory.test && window.RobotFactory.test.skip && window.RobotFactory.test.skip());
    await fr.evaluate(() => { const E = window.PX_CASINO_ENGINE; E.closeModal(); }); await page.waitForTimeout(a === 'auto' ? 200 : 100);
    if (a === 'auto') await fr.evaluate(() => window.PX_CASINO_ENGINE.action('auto'));
  }
  const spinning = await fr.evaluate(() => window.PX_CASINO_ENGINE.ui().spinDisabled); console.log('note: spin disabled after press =', spinning);
  await browser.close(); console.log(bad ? bad + ' FAILED' : 'all press checks passed'); process.exit(bad ? 1 : 0);
})();

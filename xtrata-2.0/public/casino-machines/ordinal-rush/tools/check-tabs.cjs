// The standalone test page must run in several tabs at once (one test account per tab), keep its balance on reload,
// and give a duplicated tab (which copies sessionStorage) its own account.
//   node tools/check-tabs.cjs http://localhost:8102/ordinal-rush/index.html
const { chromium } = require('playwright');
const URL = process.argv[2]; let fails = 0;
const check = (name, ok, detail = '') => { if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, detail); };
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const start = async (page) => {
    await page.goto(URL, { waitUntil: 'commit', timeout: 180000 }); await page.waitForFunction(() => window.ORTest || (document.getElementById('err') && document.getElementById('err').textContent), null, { timeout: 180000 });
    const err = await page.evaluate(() => document.getElementById('err').textContent);
    if (err) return { err };
    const fr = page.frames().find(f => f !== page.mainFrame());
    await page.evaluate(() => setInterval(() => { try { ORTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30));
    await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
    return { fr, tab: await page.evaluate(() => window.OR_TEST_TAB) };
  };
  const spin = async (s) => { await s.fr.evaluate(() => window.PX_CASINO_ENGINE.action('spin')); await s.fr.waitForFunction(() => !window.PX_CASINO_ENGINE.ui().spinning, null, { timeout: 60000 }); };
  const bal = s => s.fr.evaluate(() => window.ParallaxLAYRAccount.balance());
  const a = await ctx.newPage(), A = await start(a); check('tab 1 starts', !A.err, A.err || A.tab);
  const b = await ctx.newPage(), B = await start(b); check('tab 2 starts while tab 1 is open', !B.err, B.err || B.tab);
  check('each tab has its own account', A.tab && B.tab && A.tab !== B.tab, `${A.tab} / ${B.tab}`);
  await spin(A); await spin(B); await spin(A);
  check('both tabs can play', (await bal(A)) !== 100000 || (await bal(B)) !== 100000);
  const before = await bal(A); await a.bringToFront(); const A2 = await start(a);
  check('reloading a tab keeps its account and balance', !A2.err && A2.tab === A.tab && (await bal(A2)) === before, `${A2.err || A2.tab} ${before}`);
  // A duplicated tab copies sessionStorage: emulate it by pre-seeding tab 2's id into a new page.
  const c = await ctx.newPage(); await c.addInitScript(id => { try { sessionStorage.setItem('xtrata.parallax.test.ordinal-rush.tab', id); } catch (e) {} }, B.tab);
  const C = await start(c); check('a duplicated tab starts with its own account', !C.err && C.tab !== B.tab, C.err || C.tab);
  await browser.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

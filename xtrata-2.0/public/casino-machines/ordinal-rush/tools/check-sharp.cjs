// Sharpness and Land Grab check: plays the test page in fullscreen on a 2x (Retina) display, confirms the screen canvas
// matches the display's real pixels and is still readable, and saves crops of the reels plus frames of a Land Grab respin.
//   node tools/check-sharp.cjs http://localhost:8102/ordinal-rush/index.html [outdir]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const URL = process.argv[2], OUT = process.argv[3] || path.join(__dirname, '../dist/sharp');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)); let fails = 0;
const check = (name, ok, detail = '') => { if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, detail); };
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 1512, height: 945 }, deviceScaleFactor: 2 })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL); await page.waitForFunction(() => window.ORTest, null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  await page.evaluate(() => { setInterval(() => { try { ORTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30); ORTest.renderer.setPixelRatio(.5); });
  await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
  const before = await fr.evaluate(() => [window.OrdinalRush.screen().width, window.OrdinalRush.screen().height]);
  check('cabinet texture stays 2800 x 1920', before[0] === 2800 && before[1] === 1920, before.join(' x '));
  await page.click('#fsBtn'); await sleep(1200);
  const fs1 = await fr.evaluate(() => { const c = window.OrdinalRush.screen(), r = c.getBoundingClientRect(); return { w: c.width, h: c.height, cw: r.width, ch: r.height, dpr: devicePixelRatio }; });
  check('fullscreen canvas matches the display pixels', Math.abs(fs1.w - fs1.cw * fs1.dpr) <= 2 && Math.abs(fs1.h - fs1.ch * fs1.dpr) <= 2, JSON.stringify(fs1));
  let readable = true; try { await fr.evaluate(() => window.OrdinalRush.screen().getContext('2d').getImageData(0, 0, 4, 4).data.length); } catch (e) { readable = false; }
  check('screen canvas stays readable (no tainted art, so the room can upload it)', readable);
  await fr.evaluate(() => window.OrdinalRush.test.force('jackpot')); await page.keyboard.press('Space'); await sleep(6000);
  await fr.evaluate(() => { try { window.OrdinalRush.test.skip(); } catch (e) {} }); await sleep(1500);
  for (let i = 0; i < 6 && await fr.evaluate(() => !!window.OrdinalRush.scene()); i++) { await fr.evaluate(() => window.OrdinalRush.test.primary()); await sleep(800); }
  await sleep(800);
  await page.screenshot({ path: path.join(OUT, 'fullscreen-2x.png'), timeout: 180000 });
  const box = await fr.evaluate(() => { const r = window.OrdinalRush.screen().getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  // A 2x crop of two reel cells, as a Retina display shows them.
  await page.screenshot({ path: path.join(OUT, 'reel-crop-2x.png'), clip: { x: box[0] + box[2] * .03, y: box[1] + box[3] * .21, width: box[2] * .38, height: box[3] * .4 }, timeout: 180000 });
  // Land Grab: frames through one respin.
  const ok = await fr.evaluate(() => window.OrdinalRush.test.play('chain')); check('Land Grab starts', ok);
  for (let i = 0; i < 60; i++) { const s = await fr.evaluate(() => window.OrdinalRush.scene()); if (s && s.kind === 'chain' && s.stage !== 'trigger') break; if (s && s.kind !== 'chain') await fr.evaluate(() => window.OrdinalRush.test.primary()); await sleep(500); }
  console.log('scene now', JSON.stringify(await fr.evaluate(() => ({ s: window.OrdinalRush.scene(), st: window.OrdinalRush.snapshot().state.features.map(f => f.type) }))));
  for (let i = 0; i < 20; i++) { const s = await fr.evaluate(() => window.OrdinalRush.scene()); if (s && s.stage === 'play') break; await fr.evaluate(() => window.OrdinalRush.test.primary()); await sleep(600); } await sleep(1500);
  const shot = async n => { const d = await fr.evaluate(() => window.OrdinalRush.screen().toDataURL('image/png')); fs.writeFileSync(path.join(OUT, n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  let respins = 0;
  for (let r = 1; r <= 3; r++) {
    await fr.evaluate(() => window.OrdinalRush.test.primary()); const t0 = Date.now();
    for (const ms of [150, 600, 1100]) { await sleep(Math.max(0, ms - (Date.now() - t0))); await shot(`grab-respin${r}-${ms}ms`); }
    await sleep(1800); await shot(`grab-respin${r}-after`);
    const s = await fr.evaluate(() => window.OrdinalRush.scene()); if (s && s.respins) respins = s.respins; if (!s || s.kind !== 'chain') break;
  }
  check('respins roll and are counted', respins >= 1, `respins seen: ${respins}`);
  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

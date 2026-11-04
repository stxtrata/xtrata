// End-to-end check of the standalone Mempool Madness test page: the studio, deck buttons, the launch lever and its sparks, every bonus
// in all four stages (screenshotted), every Bonus Lab item through all four stages, Skip, reduced motion, the Confirm or Evict
// gamble, a whole fullscreen session driven only by the bottom bar at desktop and phone width, pack.json decoding.
//   node tools/test-page.cjs http://localhost:8102/mempool-madness/index.html [outdir]
// Env: FS_ONLY=1 (only the fullscreen session), KINDS=free,vault (limit the bonuses), LAB_ONLY=1, LAB_ITEMS=free,pick (limit the Lab),
//      NO_PHONE=1.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const URL = process.argv[2], OUT = process.argv[3] || path.join(__dirname, '../dist/test');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };
const ARGS = ['--disable-accelerated-2d-canvas', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const want = n => !process.env.ONLY || process.env.ONLY.split(',').includes(n);
const KINDS = process.env.KINDS ? process.env.KINDS.split(',').filter(Boolean) : ['free', 'vault', 'chain', 'jackpot', 'gamble'];

async function open(ctxOpts) {
  const browser = await chromium.launch({ args: ARGS }); const ctx = await browser.newContext(ctxOpts); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 9).map(s => s.trim()).join(' < '))); page.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|Failed to load resource|ERR_PROXY|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto(URL); await page.waitForFunction(() => window.MMTest, null, { timeout: 180000 });
  const fr = page.frames().find(f => f !== page.mainFrame());
  // Headless Chromium renders the studio in software, a frame every few hundred ms; drive the game frame's pump directly
  // (the same __pxPump the casino uses) so the game itself runs at a normal frame rate during the test.
  await page.evaluate(() => { setInterval(() => { try { MMTest.frame.contentWindow.__pxPump(); } catch (e) {} }, 30); MMTest.renderer.setPixelRatio(.6); });
  await fr.waitForFunction(() => window.PX_CASINO_ENGINE && !window.PX_CASINO_ENGINE.ui().spinDisabled, null, { timeout: 60000 });
  return { browser, page, fr, errors };
}
const G = (fr, fn, a) => fr.evaluate(fn, a);
const sceneOf = fr => G(fr, () => window.MempoolMadness.scene());
const shotScreen = async (fr, name) => { const d = await G(fr, () => window.MempoolMadness.screen().toDataURL('image/png')); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
const waitScene = (fr, stage, kind, ms = 30000) => fr.waitForFunction(([s, k]) => { const x = window.MempoolMadness.scene(); return x && x.stage === s && (!k || x.kind === k); }, [stage, kind], { timeout: ms });
const waitIdle = fr => fr.waitForFunction(() => !window.PX_CASINO_ENGINE.ui().spinning, null, { timeout: 60000 });
const snap = fr => G(fr, () => { const s = window.MempoolMadness.snapshot().state; return { bal: window.ParallaxLAYRAccount.balance(), free: s.free, freeActive: s.freeActive, features: s.features.map(f => f.type), spins: s.spins, wagered: s.wagered, paidOut: s.paidOut, gamble: s.gamble, lastWin: s.lastWin, last: s.history[0] }; });
const waitFor = async (fn, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await sleep(150); } return false; };

// Play one bonus from trigger to summary with the scene's own buttons; screenshot the four stages.
async function playBonus(fr, kind, tag) {
  const ok = await G(fr, k => window.MempoolMadness.test.play(k), kind); if (!ok) throw Error(`test.play(${kind}) refused: ` + JSON.stringify({ scene: await sceneOf(fr), s: await snap(fr) }));
  await waitScene(fr, 'trigger', kind); await sleep(900); await shotScreen(fr, `${tag}-${kind}-1-trigger`);
  await waitScene(fr, 'intro', kind); await sleep(900); await shotScreen(fr, `${tag}-${kind}-2-intro`);
  if (kind === 'gamble') { await G(fr, () => window.PX_CASINO_ENGINE.key('KeyC', 'c')); await waitScene(fr, 'play', 'gamble'); await sleep(900); await shotScreen(fr, `${tag}-${kind}-3-play`); for (let i = 0; i < 40; i++) { await sleep(500); await G(fr, () => window.MempoolMadness.test.primary()); const s = await sceneOf(fr); if (!s || s.stage === 'outro') break; } }
  else if (kind === 'free') { await G(fr, () => window.MempoolMadness.test.primary()); let lastSc = ''; for (let i = 0; i < 600; i++) { const s = await sceneOf(fr); const js = JSON.stringify(s); if (process.env.TRACE && js !== lastSc) { console.log('  trace', i, js, JSON.stringify(await snap(fr))); lastSc = js; } if (s && s.stage === 'outro' && s.kind === 'free') break; if (s && s.kind !== 'free') { await finishOther(fr); continue; } if (i === 10) await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(400); } }
  else if (kind === 'jackpot') { await G(fr, () => window.MempoolMadness.test.primary()); await waitScene(fr, 'play', 'jackpot'); await sleep(2200); await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(4200); await shotScreen(fr, `${tag}-${kind}-3b-play-moon`); await G(fr, () => window.MempoolMadness.test.primary()); }
  else { await G(fr, () => window.MempoolMadness.test.primary()); await waitScene(fr, 'play', kind);
    if (kind === 'vault') { for (const p of [2, 5, 7]) { await G(fr, k => window.PX_CASINO_ENGINE.key('Digit' + k, String(k)), p); await sleep(700); } await sleep(1500); await shotScreen(fr, `${tag}-${kind}-3-play`); await sleep(1200); await G(fr, () => window.MempoolMadness.test.primary()); }
    else { for (let i = 0; i < 60; i++) { const f = await G(fr, () => window.MempoolMadness.snapshot().state.features[0]); if (!f) break; if (i === 3) await shotScreen(fr, `${tag}-${kind}-3-play`); if (i === 8) await shotScreen(fr, `${tag}-${kind}-3b-play`); await G(fr, () => window.MempoolMadness.test.primary()); await sleep(500); } } }
  await waitScene(fr, 'outro', kind, 90000); await sleep(1800); await shotScreen(fr, `${tag}-${kind}-4-outro`);
  const total = await G(fr, () => window.MempoolMadness.snapshot().state.lastWin);
  await G(fr, () => window.MempoolMadness.test.primary()); await sleep(400);
  for (let i = 0; i < 40; i++) { const s = await sceneOf(fr); if (!s) break; await finishOther(fr); }
  return total;
}
async function finishOther(fr) { const s = await sceneOf(fr); if (!s) return; if (s.stage === 'outro') { await sleep(1500); await G(fr, () => window.MempoolMadness.test.primary()); await sleep(300); return; } await G(fr, () => window.MempoolMadness.test.skip()); await sleep(400); }
async function clearAll(fr) { for (let i = 0; i < 60; i++) { const s = await sceneOf(fr), st = await snap(fr); if (!s && !st.free && !st.freeActive && !st.features.length && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) return; if (s) await finishOther(fr); else { await G(fr, () => window.MempoolMadness.test.primary()); await sleep(500); } } }

// One Bonus Lab item, hands-free, through every stage the run shows; screenshot each (kind, stage) the first time it appears.
async function labRun(fr, id, tag, opts = {}) {
  const seen = new Map(), t0 = Date.now(); const real0 = await G(fr, () => JSON.stringify(window.MempoolMadness.snapshot().state)), bal0 = await G(fr, () => window.ParallaxLAYRAccount.balance());
  const started = await G(fr, ([i, o]) => window.MempoolMadness.lab.run(i, o), [id, { auto: true, mode: 'seeded', seed: opts.seed || '20261101', bet: opts.bet || 100 }]);
  if (!started) throw Error('lab.run refused for ' + id);
  // A page-side recorder notes every scene stage (a screenshot can take longer than a short stage lasts).
  await G(fr, () => { window.__stg = []; window.__stake = 0; clearInterval(window.__stgT); window.__stgT = setInterval(() => { try { const sc = window.MempoolMadness.test.scene(); let k = sc ? sc.kind + '-' + sc.stage : null; if (!k) { const ls = window.MempoolMadness.lab.state(); if (ls && ls.freeActive && ls.free > 0) k = 'free-play'; } if (k && !window.__stg.includes(k)) window.__stg.push(k); const ls2 = window.MempoolMadness.lab.state(); if (!window.__stake && ls2 && ls2.gamble > 0) window.__stake = ls2.gamble; } catch (e) {} }, 40); });
  let pend = null, stake = null, won = null;
  while (Date.now() - t0 < (opts.timeout || Number(process.env.LAB_TIMEOUT) || 300000)) {
    const act = await G(fr, () => window.MempoolMadness.lab.active()); if (!act) break;
    let s = await sceneOf(fr); if (!s) { const ls = await G(fr, () => window.MempoolMadness.lab.state()); if (ls && ls.freeActive && ls.free > 0) s = { kind: 'free', stage: 'play' }; } // free spins run on the reels with no scene: that is the play stage
    if (s && s.kind === 'gamble' && s.stage === 'intro' && stake == null) stake = (await G(fr, () => window.MempoolMadness.lab.state())).gamble; if (s && s.kind === 'gamble' && s.stage === 'outro' && won == null) won = (await G(fr, () => window.MempoolMadness.lab.state())).lastWin;
    if (s) { const key = `${s.kind}-${s.stage}`; if (!seen.has(key)) { seen.set(key, Date.now()); pend = key; setTimeout(() => {}, 0); await sleep(opts.shotDelay ?? 600); const s2 = (await sceneOf(fr)) || s; if (s2 && `${s2.kind}-${s2.stage}` === key) await shotScreen(fr, `${tag}-${id}-${String(seen.size).padStart(2, '0')}-${key}`); } }
    await sleep(120);
  }
  const act = await G(fr, () => window.MempoolMadness.lab.active()); if (act) throw Error(`lab ${id} did not finish in time; scene ${JSON.stringify(await sceneOf(fr))}; ui ${JSON.stringify(await G(fr, () => { const u = window.PX_CASINO_ENGINE.ui(), st = window.MempoolMadness.lab.state(); return {  spinning: u.spinning, modal: (u.modal || '').slice(0, 60), pending: !!st.pending, features: st.features.length, free: st.free, freeActive: st.freeActive, gamble: st.gamble, button: u.button }; }))}`);
  const real1 = await G(fr, () => JSON.stringify(window.MempoolMadness.snapshot().state)), bal1 = await G(fr, () => window.ParallaxLAYRAccount.balance());
  const store = await G(fr, () => window.MempoolMadness.lab.store());
  const rec = await G(fr, () => { clearInterval(window.__stgT); return window.__stg; }), stakeRec = await G(fr, () => window.__stake); if (!stake) stake = stakeRec; return { id, stake, won, stages: [...new Set([...seen.keys(), ...rec])], realUntouched: real0 === real1 && bal0 === bal1, last: store.history[0], ms: Date.now() - t0 };
}
const FOUR = { free: ['free'], free_retrigger: ['free'], pick: ['vault'], hold: ['chain'], hold_full: ['chain', 'jackpot'], jackpot: ['jackpot'], gamble_win: ['gamble'], gamble_loss: ['gamble'], scatter3: ['free'], scatter4: ['free'], scatter5: ['free'] };

(async () => {
  // pack.json decodes to a valid pack in the existing format.
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../pack.json'), 'utf8'));
  const keys = Object.keys(pack).join(','), model = JSON.parse(zlib.gunzipSync(Buffer.from(pack.model, 'base64')).toString()), game = zlib.gunzipSync(Buffer.from(pack.game, 'base64')).toString();
  const roles = []; (function walk(n) { if (n.role) roles.push(n.role); if (n.action) roles.push('action:' + n.action); n.children.forEach(walk); })(model.root);
  check('pack.json decodes: {name, description, color, accent, model, game, css}', keys === 'name,description,color,accent,model,game,css' && model.root && model.geometries.length && model.materials.length && model.textures.length && /window\.PX_CASINO_ENGINE=\{/.test(game), keys);
  check('pack identity: Mempool Madness, #14f195, #0b130f', pack.name === 'Mempool Madness' && pack.accent === '#14f195' && pack.color === '#0b130f' && pack.description === 'Bitcoin mempool · live fee reels', `${pack.name} ${pack.accent} ${pack.color}`);
  check('cabinet parts present (core topper + blocks, safetyCover, sparkAnchor, tickers, lever, BROADCAST, deck actions)', ['screenMesh', 'core', 'coreBlock0', 'coreBlock9', 'safetyCover', 'sparkAnchor', 'tickerL', 'tickerR', 'spinPhysical', 'lever', 'action:spin', 'action:betUp', 'action:betDown', 'action:auto', 'action:pays'].every(r => roles.includes(r)) && !roles.includes('crest'), [...new Set(roles)].join(' '));
  check('model textures: opaque JPEG and transparent WebP data URLs', model.textures.some(t => /^data:image\/webp/.test(t.image)) && model.textures.every(t => /^data:image\/(jpeg|webp|png)/.test(t.image)), `${model.textures.length} textures`);
  check('no Rune Pit / Ordinal Rush / Forever Twins leftovers in the game code', !/ordinal-rush|OrdinalRush|OR_ART|OR_MANIFEST|INSCRIBE|Wizard Vault|Land Grab|rune-pit|RunePit|RP_ART|RP_MANIFEST|Runestone|Etching/.test(game), (game.match(/ordinal-rush|OrdinalRush|OR_ART|OR_MANIFEST|INSCRIBE|Wizard Vault|Land Grab|rune-pit|RunePit|RP_ART|RP_MANIFEST|Runestone|Etching/g) || []).slice(0, 4).join(','));

  // Desktop session in the studio.
  let { browser, page, fr, errors } = await open({ viewport: { width: 1280, height: 800 } });
  {
  if (want('basic')) {
  await page.screenshot({ path: path.join(OUT, 'desktop-1-cabinet-view.png'), timeout: 180000 });
  await page.click('#vScr'); await sleep(2500); await page.screenshot({ path: path.join(OUT, 'desktop-2-screen-view.png'), timeout: 180000 }); await page.click('#vCab'); await sleep(1500);
  await shotScreen(fr, 'desktop-0-idle-reels');
  const s0 = await snap(fr);
  await page.click('#deck [data-a=betUp]'); await sleep(200); const betUp = await G(fr, () => window.MempoolMadness.snapshot().state.bet);
  await page.click('#deck [data-a=betDown]'); await sleep(200);
  check('deck −FEE / +FEE change the bet', betUp === 200 && (await G(fr, () => window.MempoolMadness.snapshot().state.bet)) === 100, `up → ${betUp}`);
  const lbl = await page.evaluate(() => [...document.querySelectorAll('#deck button')].filter(b => !b.hidden).map(b => b.textContent.trim()).join('|')); check('deck labels: FEES, −FEE, +FEE, AUTO-BUMP, (LAB), BROADCAST', lbl === 'FEES|−FEE|+FEE|AUTO-BUMP|LAB|BROADCAST', lbl);
  await page.click('#deck [data-a=spin]'); await sleep(300); check('deck BROADCAST spins', (await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning)));
  await waitIdle(fr); await sleep(400); await clearAll(fr);
  await sleep(2500); // let the camera settle
  // Click the launch lever in the 3D studio: it spins, and sparks fly from the exhaust at the end of the pull.
  const leverXY = await page.evaluate(() => { const { model, camera, renderer } = MMTest, o = model.getObjectByName('px-lever'), v = new o.position.constructor(); o.children[1].getWorldPosition(v); v.project(camera); const r = renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; });
  const spinsBefore = (await snap(fr)).spins, sb0 = await page.evaluate(() => MMTest.sparkBursts()); await page.mouse.click(leverXY[0], leverXY[1]); await sleep(400); const leverSpun = await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning || window.PX_CASINO_ENGINE.mechanics().lever !== null);
  await sleep(700); const sb1 = await page.evaluate(() => MMTest.sparkBursts()); await page.screenshot({ path: path.join(OUT, 'desktop-2b-lever-launch.png'), timeout: 180000 });
  await waitIdle(fr); await sleep(300); await clearAll(fr); check('clicking the launch lever spins and pulls it', leverSpun && (await snap(fr)).spins === spinsBefore + 1, `at ${leverXY.map(Math.round)}`);
  check('the lever pull throws sparks from px-sparkAnchor', sb1 === sb0 + 1, `bursts ${sb0} → ${sb1}`);
  await page.keyboard.press('Space'); await sleep(300); await waitIdle(fr); await clearAll(fr); check('Space spins', (await snap(fr)).spins === spinsBefore + 2);
  const s1 = await snap(fr);
  check('stakes leave the test balance (shared LAYR stub)', Math.abs((s0.bal - s1.bal) - ((s1.wagered - s0.wagered) - (s1.paidOut - s0.paidOut))) < 1e-6, `wagered ${s1.wagered - s0.wagered}`);
  }
  // Every bonus, the jackpot and the gamble, four stages each.
  const totals = {};
  if (want('bonus')) for (const kind of KINDS) { try { totals[kind] = await playBonus(fr, kind, 'desktop'); check(`${kind}: trigger → intro → play → outro`, true, `win ${totals[kind]}`); } catch (e) { check(`${kind}: trigger → intro → play → outro`, false, e.message.split('\n')[0]); await shotScreen(fr, `desktop-${kind}-FAILED`); await clearAll(fr); } }
  await clearAll(fr);
  // Skip lands on the outro with the engine's total.
  if (want('skip')) for (const kind of ['vault', 'chain', 'free', 'jackpot']) {
    await G(fr, k => window.MempoolMadness.test.play(k), kind); await waitScene(fr, 'intro', kind); await G(fr, () => window.MempoolMadness.test.skip()); await waitScene(fr, 'outro', kind, 60000); await sleep(1500);
    const sk = await G(fr, () => { const s = window.MempoolMadness.snapshot().state; const sc = window.MempoolMadness.test.scene(); return { sw: sc ? sc.total : 0, h: s.history[0], lw: s.lastWin, free: s.free, freeActive: s.freeActive, f: s.features.length }; }); await shotScreen(fr, `desktop-skip-${kind}-outro`);
    check(`Skip jumps ${kind} to the outro with the dealt total`, sk.h && (kind === 'free' ? sk.sw >= 0 : sk.h.win > 0) && !sk.free && !sk.f, `win ${kind === 'free' ? sk.sw : sk.h && sk.h.win}`); await G(fr, () => window.MempoolMadness.test.primary()); await sleep(300); await clearAll(fr);
  }
  // Reduced motion: calmer scenes, same flow.
  if (want('reduced')) { await G(fr, () => window.MempoolMadness.test.setReduced(true)); for (const k of ['chain', 'jackpot']) { try { await playBonus(fr, k, 'reduced'); check(`reduced motion: ${k} plays all four stages`, true); } catch (e) { check(`reduced motion: ${k} plays all four stages`, false, e.message.split('\n')[0]); await clearAll(fr); } } await G(fr, () => window.MempoolMadness.test.setReduced(false)); }
  // Ledger, Fair Play and engine text.
  if (want('panels')) {
  await G(fr, () => window.PX_CASINO_ENGINE.action('pays')); await sleep(200); const rules = (await G(fr, () => window.PX_CASINO_ENGINE.ui())).modal; await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, 'desktop-3-fees-panel.png'), timeout: 180000 });
  check('Fees panel states 94.38% and the split', ['94.38%', '59.7%', '1.5%', '8.5%', '11.9%', '10.3%', '2.4%', '1 in 140', '1 in 290', '1 in 113,000', 'even bet', 'design estimate'].every(t => rules.includes(t)), ['94.38%', '59.7%', '1.5%', '8.5%', '11.9%', '10.3%', '2.4%', '1 in 140', '1 in 290', '1 in 113,000', 'even bet', 'design estimate'].filter(t => !rules.includes(t)).join(','));
  await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  check('no engine slot names on screen copy', !/\b(cherry|lemon|Mining chip|Vault key|Chain node)\b/.test(rules));
  await G(fr, () => window.PX_CASINO_ENGINE.action('history')); await sleep(300); await page.screenshot({ path: path.join(OUT, 'desktop-3b-log.png'), timeout: 180000 }); await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  const cols = await G(fr, () => { document.getElementById('colsInfo').click(); return document.getElementById('modal').innerText; }); await sleep(300); await page.screenshot({ path: path.join(OUT, 'desktop-3c-data-panel.png'), timeout: 180000 }); await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  check('data panel: names the source, the badge, the fee-band note and the real figures', /mempool\.space/.test(cols) && /SNAPSHOT|LIVE/.test(cols) && /fee bands/i.test(cols) && /BTC/.test(cols) && /Whale/i.test(cols), cols.slice(0, 120).replace(/\n/g, ' '));
  }
  if (want('lab')) await labSection(page, fr, 'desktop');
  // Fullscreen session, driven only by the bottom bar.
  if (want('fs')) await fullscreenSession(page, fr, 'desktop');
  check('desktop: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  }

  // Phone width.
  if (!process.env.NO_PHONE && want('phone')) {
  ({ browser, page, fr, errors } = await open({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }));
  await page.screenshot({ path: path.join(OUT, 'phone-1-cabinet-view.png'), timeout: 180000 });
  const small = await page.evaluate(() => [...document.querySelectorAll('#top button, #deck button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(b => b.w < 44 || b.h < 44));
  check('phone: page buttons are at least 44 px', !small.length, JSON.stringify(small));
  await fullscreenSession(page, fr, 'phone');
  check('phone: no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  console.log(`${results.filter(r => r.ok).length}/${results.length} passed`); process.exit(results.every(r => r.ok) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });

// The Bonus Lab: the modal, every item through all four stages with screenshots, isolation from the real account, replay, Run all.
async function labSection(page, fr, tag) {
  await clearAll(fr);
  await G(fr, () => window.PX_CASINO_ENGINE.action('lab')); await sleep(500); const modal = (await G(fr, () => window.PX_CASINO_ENGINE.ui())).modal; await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, `${tag}-lab-0-modal.png`), timeout: 180000 });
  const ids = await G(fr, () => window.MempoolMadness.lab.items().map(i => i.id));
  const want = ['free', 'free-retrigger', 'pick', 'hold', 'hold-full', 'jackpot', 'gamble-win', 'gamble-loss', 'scatter3', 'scatter4', 'scatter5'];
  check('Bonus Lab lists every item', want.every(w => ids.includes(w)) && ['Seeded', 'Random', 'Hands-free', 'Run', 'Replay last', 'Run all', 'Reset lab balance', 'Leave the Lab'].every(t => modal.includes(t)), ids.join(','));
  await G(fr, () => window.PX_CASINO_ENGINE.closeModal());
  const only = process.env.LAB_ITEMS ? process.env.LAB_ITEMS.split(',') : want;
  const labBal = {}; const outcomes = {};
  for (const id of only) {
    try { const r = await labRun(fr, id, tag, { shotDelay: 700 }); outcomes[id] = r;
      const need = { 'free': ['free-trigger', 'free-intro', 'free-play', 'free-outro'], 'free-retrigger': ['free-trigger', 'free-intro', 'free-play', 'free-outro'], 'pick': ['vault-trigger', 'vault-intro', 'vault-play', 'vault-outro'], 'hold': ['chain-trigger', 'chain-intro', 'chain-play', 'chain-outro'], 'hold-full': ['chain-trigger', 'chain-intro', 'chain-play', 'chain-outro'], 'jackpot': ['jackpot-trigger', 'jackpot-intro', 'jackpot-play', 'jackpot-outro'], 'gamble-win': ['gamble-intro', 'gamble-play', 'gamble-outro'], 'gamble-loss': ['gamble-intro', 'gamble-play', 'gamble-outro'], 'scatter3': ['free-trigger', 'free-intro', 'free-play', 'free-outro'], 'scatter4': ['free-trigger', 'free-intro', 'free-play', 'free-outro'], 'scatter5': ['free-trigger', 'free-intro', 'free-play', 'free-outro'] }[id];
      const missing = need.filter(k => !r.stages.includes(k));
      check(`Lab ${id}: all stages (${need.map(k => k.split('-')[1]).join(' → ')})`, !missing.length, `${r.stages.join(' ')} · ${Math.round(r.ms / 1000)}s${missing.length ? ' · missing ' + missing.join(',') : ''}`);
      check(`Lab ${id}: the real account and machine state are untouched`, r.realUntouched);
    } catch (e) { check(`Lab ${id}: all stages`, false, e.message.split('\n')[0]); await shotScreen(fr, `${tag}-lab-${id}-FAILED`); await G(fr, () => window.MempoolMadness.lab.abort()); await clearAll(fr); }
  }
  { const gw = outcomes['gamble-win'], gl = outcomes['gamble-loss'];
    if (gw) check('Lab gamble-win: the call lands on a win (the staked win doubles)', gw.stake > 0 && gw.won === gw.stake * 2, `stake ${gw.stake} → ${gw.won}`);
    if (gl) check('Lab gamble-loss: the call lands on a loss (the staked win is burnt)', gl.stake > 0 && gl.won === 0, `stake ${gl.stake} → ${gl.won}`); }
  // Same seed, same run: the pick (Accelerate) pays the same twice.
  if (!process.env.LAB_ITEMS || only.includes('pick')) {
    const a = await labRun(fr, 'pick', tag + '-seedA', { seed: '777', shotDelay: 5000 }), b = await labRun(fr, 'pick', tag + '-seedB', { seed: '777', shotDelay: 5000 }), c = await labRun(fr, 'pick', tag + '-seedC', { seed: '778', shotDelay: 5000 });
    check('Lab: a seeded run repeats exactly', a.last && b.last && a.last.win === b.last.win, `${a.last && a.last.win} / ${b.last && b.last.win} (seed 778: ${c.last && c.last.win})`);
  }
  if (!process.env.LAB_ITEMS || process.env.LAB_ALL) {
    // Replay last, Reset lab balance, Leave, then Run all (hands-free), once, at turbo speed.
    await G(fr, () => window.MempoolMadness.lab.replay()); await waitFor(async () => !(await G(fr, () => window.MempoolMadness.lab.active())), 120000); check('Lab: Replay last runs and leaves the Lab', !(await G(fr, () => window.MempoolMadness.lab.active())));
    await G(fr, () => window.MempoolMadness.test.setTurbo(true));
    const real0 = await G(fr, () => JSON.stringify(window.MempoolMadness.snapshot().state)); const t0 = Date.now(); await G(fr, () => window.MempoolMadness.lab.runAll({ bet: 100, mode: 'seeded', seed: '31' }));
    let seenKinds = new Set(); while (Date.now() - t0 < 900000) { if (!(await G(fr, () => window.MempoolMadness.lab.active()))) break; const s = await sceneOf(fr); if (s) seenKinds.add(s.kind + '-' + s.stage); await sleep(80); }
    const done = !(await G(fr, () => window.MempoolMadness.lab.active())); const real1 = await G(fr, () => JSON.stringify(window.MempoolMadness.snapshot().state));
    check('Lab: Run all plays every item hands-free and leaves the real machine untouched', done && real0 === real1 && ['free-outro', 'vault-outro', 'chain-outro', 'jackpot-outro', 'gamble-outro'].every(k => seenKinds.has(k)), `${Math.round((Date.now() - t0) / 1000)}s · ${[...seenKinds].length} stage kinds`);
    await G(fr, () => window.MempoolMadness.test.setTurbo(false));
  }
  await clearAll(fr);
}

async function fullscreenSession(page, fr, tag) {
  await page.click('#fsBtn'); await sleep(800);
  const on = await G(fr, () => window.MempoolMadness.fullscreen()); check(`${tag}: fullscreen opens`, on);
  const bar = id => fr.locator(`#fsBar [data-fs="${id}"]`), click = async id => { await bar(id).click({ force: true }); await sleep(250); };
  const vis = await fr.evaluate(() => [...document.querySelectorAll('#fsBar [data-fs]')].filter(b => !b.hidden).map(b => b.dataset.fs));
  check(`${tag}: bar has every control`, ['primary', 'betDown', 'bet', 'betUp', 'max', 'auto', 'pays', 'fair', 'turbo', 'sound', 'volume', 'history', 'balance', 'lab', 'test', 'exit'].every(k => vis.includes(k)), vis.join(' '));
  const tiny = await fr.evaluate(() => [...document.querySelectorAll('#fsBar .fb')].filter(b => !b.hidden && b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return { k: b.dataset.fs, w: Math.round(r.width), h: Math.round(r.height) }; }).filter(b => b.w < 44 || b.h < 44));
  check(`${tag}: bar touch targets ≥ 44 px`, !tiny.length, JSON.stringify(tiny));
  await page.screenshot({ path: path.join(OUT, `${tag}-fs-1-idle.png`) });
  const b0 = await G(fr, () => window.MempoolMadness.snapshot().state.bet); await click('betUp'); const b1 = await G(fr, () => window.MempoolMadness.snapshot().state.bet); await click('max'); const bm = await G(fr, () => window.MempoolMadness.snapshot().state.bet); await click('betDown'); await click('betDown');
  check(`${tag}: bar bets (−FEE, +FEE, MAX FEE)`, b1 > b0 && bm >= b1, `${b0} → ${b1} → max ${bm}`);
  while ((await G(fr, () => window.MempoolMadness.snapshot().state.bet)) > 100) await click('betDown');
  const sp = (await snap(fr)).spins; await click('primary'); await waitIdle(fr); await sleep(400); check(`${tag}: bar spins`, (await snap(fr)).spins === sp + 1);
  await clearAll(fr);
  for (const id of ['pays', 'fair', 'history', 'lab']) { await click(id); const m = await fr.evaluate(() => { const d = document.getElementById('modal'); const r = d.getBoundingClientRect(); const bar = document.getElementById('fsBar').getBoundingClientRect(); return { open: d.open, bottom: r.bottom, barTop: bar.top, h: innerHeight }; }); if (id === 'pays' || id === 'lab') await page.screenshot({ path: path.join(OUT, `${tag}-fs-2-${id}.png`) }); await fr.evaluate(() => window.PX_CASINO_ENGINE.closeModal()); await sleep(150); check(`${tag}: ${id} opens and closes inside fullscreen`, m.open && m.bottom <= m.h + 1, `dialog bottom ${Math.round(m.bottom)} of ${m.h}`); }
  await click('auto'); await sleep(400); const askOpen = await fr.evaluate(() => !!document.querySelector('#modal[open] [data-auto="10"]')); await fr.evaluate(() => { const b = document.querySelector('[data-auto="10"]'); if (b) b.click(); }); await sleep(1500); const autoOn = askOpen && await G(fr, () => window.PX_CASINO_ENGINE.ui().auto); check(`${tag}: AUTO-BUMP asks, then starts from the bar`, autoOn); await click('auto'); await waitIdle(fr); await sleep(500); await clearAll(fr);
  await click('turbo'); await click('turbo'); await click('sound'); await click('sound');
  const vol = await fr.evaluate(() => { const i = document.querySelector('#fsBar [data-fs=volume] input'); i.value = '0.3'; i.dispatchEvent(new Event('input', { bubbles: true })); return window.MempoolMadness.snapshot().state.volume; }); check(`${tag}: bar volume slider works`, Math.abs(vol - .3) < 1e-6, String(vol));
  // Every bonus from the in-game Test dialog, then only the bar's big button (and the bar's CONFIRM / EVICT for the gamble).
  for (const kind of KINDS) {
    await click('test'); await fr.locator(`#modal [data-t="${kind}"]`).click(); await sleep(300);
    for (let i = 0; i < 400; i++) { const s = await sceneOf(fr), st = await snap(fr); if (process.env.TRACE) console.log('  fs', kind, i, JSON.stringify(s), st.free, st.freeActive, Date.now() % 100000); if (!s && !st.free && !st.features.length && !st.freeActive && !(await G(fr, () => window.PX_CASINO_ENGINE.ui().spinning))) { if (kind !== 'gamble' || i > 6) break; }
      if (s && s.kind === 'gamble' && s.stage === 'intro') { await click('etch'); continue; }
      if (s && s.kind === 'vault' && s.stage === 'play') { const f = st.features[0] ? await G(fr, () => window.MempoolMadness.snapshot().state.features[0]) : null; if (f && f.picks.length < 3) { const i2 = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(i => !f.picks.includes(i)); const rect = await fr.evaluate(i => { const c = document.querySelector('#fsStage canvas').getBoundingClientRect(); const gap = 22, w = (1310 - 2 * gap) / 3, h = (570 - 2 * gap) / 3; const x = 45 + (i % 3) * (w + gap) + w / 2, y = 206 + Math.floor(i / 3) * (h + gap) + h / 2; return [c.left + x / 1400 * c.width, c.top + y / 960 * c.height]; }, i2); await page.mouse.click(rect[0], rect[1]); await sleep(700); continue; } }
      if (s && s.stage === 'outro' && i % 3 === 0 && kind !== 'free') await page.screenshot({ path: path.join(OUT, `${tag}-fs-bonus-${kind}-outro.png`), timeout: 180000 }).catch(() => {});
      const pb = await fr.evaluate(() => { const b = document.querySelector('#fsBar [data-fs="primary"]'); return !!(b && !b.hidden && !b.disabled && b.offsetParent); }); if (pb) await bar('primary').click({ timeout: 5000, force: true }).catch(e => { if (process.env.TRACE) console.log('  click failed', e.message.split('\n').slice(0, 6).join(' | ')); }); await sleep(s && s.kind === 'jackpot' && s.stage === 'play' ? 1500 : 500);
      if (i === 4) await page.screenshot({ path: path.join(OUT, `${tag}-fs-bonus-${kind}.png`), timeout: 180000 }).catch(() => {}); }
    const left = await sceneOf(fr); check(`${tag}: ${kind} played to the end from the fullscreen bar`, !left, left ? JSON.stringify(left) : ''); await clearAll(fr);
  }
  // A Bonus Lab run started and finished from the fullscreen bar (hands-free), the bar showing the lab balance meanwhile.
  await click('lab'); await fr.locator('#modal [data-lab-item="pick"]').click(); await fr.locator('#modal #labRunBtn').click(); await sleep(800);
  const labBarBal = await fr.evaluate(() => document.querySelector('#fsBar [data-fs=balance] small').textContent); await page.screenshot({ path: path.join(OUT, `${tag}-fs-lab-run.png`), timeout: 180000 }).catch(() => {});
  const labDone = await waitFor(async () => !(await G(fr, () => window.MempoolMadness.lab.active())), 180000); check(`${tag}: a Lab run plays through from the fullscreen bar`, labDone && /LAB/.test(labBarBal), labBarBal);
  await clearAll(fr);
  // Gamble offered after a plain win: the bar shows CONFIRM/EVICT?, then CONFIRM / EVICT / KEEP.
  await G(fr, () => window.MempoolMadness.test.force('win')); await click('primary'); await waitIdle(fr); await sleep(500);
  const barShows = id => fr.evaluate(id => { const b = document.querySelector(`#fsBar [data-fs="${id}"]`); return !!(b && !b.hidden && !b.disabled && b.offsetParent); }, id);
  if (await waitFor(() => barShows('gamble'), 5000)) {
    await click('gamble'); const intro = await waitFor(async () => { const s = await sceneOf(fr); return s && s.kind === 'gamble' && s.stage === 'intro'; });
    const btnsVis = intro && await barShows('etch') && await barShows('burn') && await barShows('keep');
    await page.screenshot({ path: path.join(OUT, `${tag}-fs-3-gamble.png`), timeout: 180000 }).catch(() => {});
    if (btnsVis) await click('burn');
    const landed = await waitFor(async () => { const s = await sceneOf(fr); return !s || s.stage === 'outro' || await barShows('primary'); }, 45000);
    for (let i = 0; i < 12 && await sceneOf(fr); i++) { if (await barShows('primary')) await click('primary'); await sleep(500); }
    const left = await sceneOf(fr); check(`${tag}: gamble played from the bar`, btnsVis && landed && !left, JSON.stringify({ intro, btnsVis, landed, left }));
  } else check(`${tag}: gamble offered on the bar after a win`, false, JSON.stringify(await G(fr, () => ({ gamble: window.MempoolMadness.snapshot().state.gamble, scene: window.MempoolMadness.scene() }))));
  await click('exit'); await sleep(600); check(`${tag}: exit fullscreen`, !(await G(fr, () => window.MempoolMadness.fullscreen())) && !(await page.evaluate(() => document.getElementById('game').classList.contains('fs'))));
}

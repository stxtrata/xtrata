// Drives the local harness in headless Chromium: menu pick, local file, open by ID (matched, unlisted, refused), community
// registration, stranger refused, tamper refused, persistence across a reload.
//   NODE_PATH=<dir with playwright> CHROME_PATH=<chromium> node canaries/snes-catalogue/harness/harness-test.cjs [harness.html]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const HTML = path.resolve(process.argv[2] || path.join(__dirname, '../../build/snes-arcade-harness.html'));
const ROM = (n) => path.join(__dirname, '../assets/roms', n);
const problems = [];
const check = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) problems.push(msg); };

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  const reqs = [];
  await ctx.route(/^https?:\/\//, (r) => { reqs.push(r.request().url()); return r.abort(); });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|WebGL|GPU|AudioContext|Failed to load resource|permissions policy/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await page.goto('file://' + HTML);
  await page.waitForFunction(() => window.__harness && window.__harness.ready(), null, { timeout: 60000 });
  const emu = () => page.frames().find((f) => f !== page.mainFrame());
  const banner = async () => (await page.textContent('#banner')).trim();
  const waitBanner = async (re, ms = 20000) => { await page.waitForFunction((s) => new RegExp(s).test(document.querySelector('#banner').textContent), re.source, { timeout: ms }); return banner(); };
  const titles = async () => emu().$$eval('#games .game b', (els) => els.map((e) => e.textContent));
  const prov = () => emu().evaluate(() => document.getElementById('provenance').textContent.trim());
  const frames = async (n) => page.evaluate(async (k) => { await window.__harness.request('control', { action: 'pause' }); const a = (await window.__harness.request('get-info')).frame; const b = (await window.__harness.request('step', { frames: k })).frame; return b - a; }, n);
  const pick = async (title) => emu().evaluate((t) => { for (const g of document.querySelectorAll('#games .game')) if (g.querySelector('b').textContent === t) { g.querySelector('button').click(); return true; } return false; }, title);

  await page.waitForFunction(() => document.querySelector('#menu-note').textContent.includes('lists 5'), null, { timeout: 20000 });
  let t = await titles();
  console.log('menu:', t.join(', '));
  check(t.length >= 5 && ['CRATE QUEST', 'SKY HOPPER', 'BRICK STORM', 'GARDEN SNAKE'].every((x) => t.includes(x)), 'the emulator menu lists the catalogue games');

  // A. menu pick
  check(await pick('CRATE QUEST'), 'Play clicked in the emulator menu');
  let b = await waitBanner(/loaded from inscription #\d+/);
  check(/Verified on-chain copy/.test(b) && /^CRATE QUEST/.test(b), 'flow A: ' + b.slice(0, 120));
  check((await frames(120)) >= 120, 'flow A: the game runs');

  // B. local file
  await emu().setInputFiles('#file', ROM('sky-hopper.sfc'));
  b = await waitBanner(/catalogue knows this ROM/);
  check(/SKY HOPPER v1/.test(b) && (await prov()).includes('Local file'), 'flow B: ' + b.slice(0, 140));

  // D. open by ID: the registered ROM
  const idOf = (title) => page.evaluate((tt) => { for (const [id, g] of window.__harness.chain.games) if (g.title === tt) return window.__harness.chain.versions.get(id + ':1').ins; }, title);
  const brick = await idOf('BRICK STORM');
  await page.fill('#open-id', String(brick)); await page.click('#open-go');
  b = await waitBanner(/Emulator label/);
  check(/Matches catalogue game BRICK STORM v1/.test(b) && !/Verified on-chain copy"/.test(b.replace(/never claims "Verified on-chain copy"/, '')) && (await prov()) !== '' && !/Verified/.test(await prov()), 'flow D (registered ROM): ' + b.slice(0, 150) + ' | emulator: ' + (await prov()));
  check((await frames(60)) >= 60, 'flow D: the game runs');

  // D. an unlisted ROM: a modified copy inscribed by the publisher
  const mod = Buffer.from(fs.readFileSync(ROM('crate-quest.sfc'))); mod[mod.length - 1] ^= 0xff;
  fs.writeFileSync('/tmp/modified-crate.sfc', mod);
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.PUBLISHER));
  await page.setInputFiles('#file-ins', '/tmp/modified-crate.sfc');
  await page.waitForFunction(() => document.querySelector('#reg-ins').value !== '', null, { timeout: 10000 });
  const modId = await page.inputValue('#reg-ins');
  await page.click('#open-go');
  b = await waitBanner(/Emulator label/);
  check(/not in the catalogue: unverified, play only, no scores/.test(b), 'flow D (unlisted ROM #' + modId + '): ' + b.slice(0, 150));

  // key hints on the pad (emulator) + controls card (wrapper)
  {
    const f = emu();
    await f.evaluate(() => document.getElementById('touch').classList.add('on'));
    const hint = (id) => f.evaluate((i) => document.querySelector('#touch .k[data-id="' + i + '"]').textContent, id);
    check((await hint('b')) === 'Z' && (await hint('a')) === 'X' && (await hint('start')) === '↵' && (await hint('select')) === 'Shift', 'pad buttons show the default key letters');
    await f.click('#optHints');
    check(await f.evaluate(() => getComputedStyle(document.querySelector('#touch .k[data-id="b"]')).display === 'none'), 'Key hints switch hides the letters');
    await f.click('#optHints');
    check(await f.evaluate(() => getComputedStyle(document.querySelector('#touch .k[data-id="b"]')).display !== 'none'), 'Key hints switch brings them back');
    await f.evaluate(() => { document.getElementById('t-ctl').click(); });
    await f.click('#keyTable .key >> nth=4'); await page.keyboard.press('KeyJ');
    check((await hint('b')) === 'J', 'rebinding B to J updates the pad letter');
    await f.click('#keyDefaults');
    check((await hint('b')) === 'Z', 'Reset to defaults restores it');
    await page.click('#keycard-on'); check(await page.evaluate(() => document.querySelector('#keycard p').hidden), 'controls card can be switched off');
    await page.click('#keycard-on');
  }

  // refusals
  for (const [id, re, name] of [['99999', /There is no inscription #99999/, 'missing id'], ['abc', /whole number/, 'bad id'], ['SP1.other-core', /Only inscriptions on/, 'other core'], ['0', /There is no inscription #0/, 'zero']]) {
    await page.fill('#open-id', id); await page.click('#open-go');
    b = await waitBanner(re, 5000).catch(async () => banner());
    check(re.test(b), `D refused (${name}): ${b.slice(0, 100)}`);
  }
  await page.click('#unsealed');
  const unsealedId = await page.inputValue('#open-id'); await page.click('#open-go');
  b = await waitBanner(/not sealed/, 5000).catch(async () => banner());
  check(/not sealed/.test(b), `D refused (unsealed #${unsealedId}): ${b.slice(0, 100)}`);
  const capped = await page.evaluate(async (id) => { let reads = 0; const w = window.__harness.wrapper; const before = w.readCore; try { await w.openById(id, { maxBytes: 1000 }); return 'no error'; } catch (e) { return e.message + '|' + e.code; } }, String(brick));
  check(/Nothing was downloaded/.test(capped) && /too-big/.test(capped), 'D refused (over the size cap, before any chunk is read): ' + capped.slice(0, 100));

  // a stranger cannot publish until the admin enrols them; then a publisher's game lands in the community set
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.PUBLISHER));
  await page.fill('#reg-slug', 'early'); await page.fill('#reg-title', 'EARLY'); await page.fill('#reg-ins', modId); await page.click('#reg-go');
  b = await waitBanner(/refused by the contract/, 8000).catch(async () => banner());
  check(/err u101/.test(b), 'a publisher who is not enrolled is refused: ' + b.slice(0, 110));
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.ME)); await page.click('#p-on');
  await waitBanner(/enrol .* as publisher — ok/, 8000);
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.PUBLISHER));
  // community registration by a publisher; the stranger is refused
  await page.fill('#reg-slug', 'modified-crate'); await page.fill('#reg-title', 'MODIFIED CRATE'); await page.fill('#reg-note', 'one byte changed'); await page.click('#reg-go');
  b = await waitBanner(/add-version/);
  check(/ok/.test(b) && /add-version/.test(b), 'publisher registers a community game: ' + b.slice(0, 140));
  const placed = await page.evaluate(() => { const g = [...window.__harness.chain.games.values()].find((x) => x.slug === 'modified-crate'); return g && g.set; });
  check(placed === 1, 'a publisher\'s game lands in the community set');
  await page.waitForFunction(() => /Community \(1\)/.test(document.querySelector('#tab-community').textContent), null, { timeout: 5000 });
  t = await titles(); check(!t.includes('MODIFIED CRATE'), 'it is not in the core menu');
  await page.click('#tab-community'); await page.waitForFunction(() => /lists 1 community/.test(document.querySelector('#menu-note').textContent), null, { timeout: 5000 });
  t = await titles(); check(t.includes('MODIFIED CRATE'), 'it shows on the Community tab');
  await pick('MODIFIED CRATE'); b = await waitBanner(/loaded from inscription/);
  check(/Verified on-chain copy/.test(b), 'community game loads verified: ' + b.slice(0, 100));
  // the unlisted ROM is now a catalogue match
  await page.fill('#open-id', modId); await page.click('#open-go'); b = await waitBanner(/Matches catalogue game MODIFIED CRATE/, 8000).catch(async () => banner());
  check(/Matches catalogue game MODIFIED CRATE/.test(b), 'after registering, opening the same id is a catalogue match');
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.STRANGER));
  await page.fill('#reg-slug', 'nope'); await page.fill('#reg-title', 'NOPE'); await page.click('#reg-go');
  b = await waitBanner(/refused by the contract/, 8000).catch(async () => banner());
  check(/err u101/.test(b), 'stranger refused: ' + b.slice(0, 110));
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.ME));
  await page.fill('#reg-slug', 'dupe'); await page.fill('#reg-title', 'DUPE'); await page.fill('#reg-ins', String(brick)); await page.click('#reg-go');
  b = await waitBanner(/refused by the contract|add-version/, 8000).catch(async () => banner());
  await page.waitForTimeout(300); b = await banner();
  check(/err u105/.test(b), 'a duplicate ROM hash is refused: ' + b.slice(0, 110));

  // tamper
  await page.click('#tab-core'); await page.waitForFunction(() => /lists 5 core|lists 6 core/.test(document.querySelector('#menu-note').textContent), null, { timeout: 5000 });
  await page.check('#tamper'); await pick('GARDEN SNAKE'); b = await waitBanner(/Refused/);
  check(/do not hash to the catalogue/.test(b), 'tampered read refused: ' + b.slice(0, 120));
  await page.uncheck('#tamper');

  // a catalogue update shows up without touching the emulator
  await page.selectOption('#actor', await page.evaluate(() => window.__harness.ME));
  await page.fill('#g-game', 'modified-crate'); await page.click('#g-core');
  await page.waitForFunction(() => /Core \(6\)/.test(document.querySelector('#tab-core').textContent), null, { timeout: 5000 });
  t = await titles(); check(t.includes('MODIFIED CRATE'), 'admin promotes it to Core and the menu follows');
  await page.fill('#g-game', 'modified-crate'); await page.click('#g-hide');
  await page.waitForFunction(() => /Core \(5\)/.test(document.querySelector('#tab-core').textContent), null, { timeout: 5000 });
  t = await titles(); check(!t.includes('MODIFIED CRATE'), 'hiding removes it from the menu');

  // persistence
  await page.reload(); await page.waitForFunction(() => window.__harness && window.__harness.ready(), null, { timeout: 60000 });
  await page.waitForFunction(() => /Core \(5\)/.test(document.querySelector('#tab-core').textContent), null, { timeout: 10000 });
  const still = await page.evaluate(() => [...window.__harness.chain.games.values()].some((g) => g.slug === 'modified-crate'));
  check(still, 'your changes survive a reload');
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT });
  check(reqs.length === 0, 'the page made no network requests (' + reqs.slice(0, 2).join(',') + ')');
  check(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await browser.close();
  if (problems.length) { console.log('FAILED', problems); process.exit(1); }
  console.log('harness test passed');
})().catch((e) => { console.error(e); process.exit(1); });

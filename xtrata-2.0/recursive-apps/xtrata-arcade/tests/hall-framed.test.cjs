// A framed game (games registry kind 2): Astro Blaster 3 style. A game that is its own inscription gets a cabinet; playing it frames the page.
//   F1  the registry adds it: 22 games, a cabinet, no script run, the 21 built-in games untouched, and the cabinet's Top 10 reads the game's own board
//   F2  playing zooms in and then frames the inscription: sandboxed (no same-origin), the page is the one on chain, BACK returns to the hall
//   F3  the page is checked: a game whose bytes do not match the contract's size is not opened (and the hall carries on)
//   F4  hand-offs: the pilot's address (only to the open game, only for stx_requestAccounts), a run to post (shape checked) goes up to the viewer
//       or, with no viewer above the hall, opens the xtrata.xyz submit page; a bad board / name / score is refused; messages from anyone else are ignored
//   F6  a real window above the hall (the viewer): the run goes up under the hall's own id, the viewer's answer comes back under the game's id; a silent viewer falls back to the submit page
//   F7  a manifest game (kind 3): the contract's inscription is a picture whose note names the real game; the hall takes the cabinet art from it,
//       checks the real game against the hash in the note, and skips a picture with no note or for another board
//   F5  other kinds are still ignored (kind 7 = unknown), and the High scores list has no replay tools for a framed game
// Run: NODE_PATH=<playwright + @stacks/transactions> CHROME_PATH=... node tests/hall-framed.test.cjs
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MC = require('./lib/mock-chain.cjs');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CHUNK = 16384;
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
const PACK_IDS = { assets: 9001, three: 9002, engine: 9003, games: 9004, hall: 9005 };
const GAME_PAGE = Buffer.from(`<!doctype html><html><head><meta charset="utf-8"><title>Fake Astro</title></head><body style="background:#001;color:#fff"><h1>FAKE GAME</h1><script>
window.__got = [];
addEventListener('message', function (e) { window.__got.push(e.data); });
window.ask = function (m) { parent.postMessage(m, '*'); };
window.store = (function () { try { localStorage.setItem('x', '1'); return 'works'; } catch (e) { return 'blocked'; } })();
</script></body></html>`);
const BIG_LIE = 9501;
const PNG1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
// A manifest picture: a real (tiny) png with the note written after its last chunk, as the generator writes it into a real poster's metadata.
const manifestPic = (note) => Buffer.concat([Buffer.from(PNG1.split(',')[1], 'base64'), Buffer.from(note ? '<xtrata-game>' + JSON.stringify(note) + '</xtrata-game>' : '', 'latin1')]);
const good = { v: 1, kind: 'framed-game', board: 'astro3', marquee: PNG1, game: { id: 9500, hash: MC.chainHash(GAME_PAGE).toString('hex'), size: GAME_PAGE.length } };
const { marquee: _m, ...noMarquee } = good;
const MAN = { 9600: manifestPic(good), 9601: manifestPic({ ...good, game: { ...good.game, hash: 'ab'.repeat(32) } }), 9602: manifestPic(null), 9603: manifestPic({ ...good, board: 'other_board' }), 9604: manifestPic(noMarquee), 9606: fs.readFileSync(path.join(ROOT, '..', 'astro-blaster-3', 'cabinet', 'astro-blaster-3-cabinet.webp')), 3075: fs.readFileSync(path.join(ROOT, '..', 'astro-blaster-3', 'release', 'astro-blaster-3-inscribed-3075.html')), 9605: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><metadata>' + JSON.stringify(good) + '</metadata></svg>') };
const CONTENT = { 3078: fs.readFileSync(path.join(ROOT, 'release', 'xtrata-arcade.html')), 9500: GAME_PAGE, [BIG_LIE]: GAME_PAGE, ...MAN };
for (const [name, id] of Object.entries(PACK_IDS)) CONTENT[id] = fs.readFileSync(path.join(DIST, manifest.packs[name].file));
const GAMES_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-games-v1';
const BUILT_IN_COUNT = 21;

let passed = 0;
function check(cond, name) { assert(cond, name); passed++; console.log('  ✓ ' + name); }
function parentWith(config) {
  const html = fs.readFileSync(path.join(DIST, 'xtrata-arcade-parent.html'), 'utf8');
  const m = /var CONFIG = (\{[\s\S]*?\n    \});/.exec(html);
  assert(m, 'CONFIG block not found in parent');
  const base = JSON.parse(m[1]);
  return html.replace(m[0], () => 'var CONFIG = ' + JSON.stringify(Object.assign(base, config)) + ';');
}
const item = (o) => Object.assign({ title: o.id, kind: 2, engineMin: 1, liveAt: 100, hidden: false }, o);
const chainWith = (items) => MC.createChain({ games: { height: 5000, items }, inscriptions: { 9500: GAME_PAGE, [BIG_LIE]: GAME_PAGE, ...MAN } });
const hallParts = { bundleId: 3078, packs: PACK_IDS, parts: {}, hashes: {} };

(async () => {
  const pages = {};
  const srv = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (pages[p]) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(pages[p]); }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

  async function open(file, chain) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
    const top10 = [], opened = [];
    await ctx.route('https://api.mainnet.hiro.so/**', async (route) => {
      const req = route.request();
      const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const url = req.url();
      const args = (JSON.parse(req.postData() || '{}').arguments) || [];
      const ok = (result) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ okay: true, result }) });
      if (url.endsWith('/get-chunk')) {
        const id = Number(T.cvToValue(T.hexToCV(args[0]))), idx = Number(T.cvToValue(T.hexToCV(args[1])));
        const data = CONTENT[id];
        const part = data ? data.subarray(idx * CHUNK, (idx + 1) * CHUNK) : Buffer.alloc(0);
        return ok(part.length ? T.cvToHex(T.someCV(T.bufferCV(part))) : T.cvToHex(T.noneCV()));
      }
      if (url.endsWith('/get-top10')) {
        const v = T.cvToValue(T.hexToCV(args[0])); top10.push(String(v && v.value !== undefined ? v.value : v));
        return ok(T.cvToHex(T.responseOkCV(T.listCV(Array.from({ length: 10 }, () => T.noneCV())))));
      }
      if (url.endsWith('/get-fee-unit')) return ok(T.cvToHex(T.responseOkCV(T.uintCV(30000))));
      const cm = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
      if (chain && cm) { const h = chain.call(cm[1] + '.' + cm[2], cm[3], args); if (h) return ok(h); }
      return route.fulfill({ status: 404, headers: cors, body: '' });
    });
    await ctx.route('https://xtrata.xyz/**', async (route) => {
      const u = new URL(route.request().url());
      const m = /^\/i\/(\d+)$/.exec(u.pathname);
      const cors = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' };
      if (m) { const body = CONTENT[Number(m[1])]; return body ? route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'text/plain' }, body }) : route.fulfill({ status: 404, headers: cors, body: '' }); }
      if (u.pathname === '/arcade/submit') { opened.push(u.pathname + u.hash); return route.fulfill({ status: 200, contentType: 'text/html', body: '<title>submit</title>' }); }
      return route.abort('failed');
    });
    await ctx.addInitScript(() => { window.XA_TEST = 1; Element.prototype.requestPointerLock = function () {}; });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebGL|GPU|404|ERR_FAILED|503/.test(m.text())) errors.push(m.text()); });
    await page.goto(base + file, { timeout: 120000 });
    await page.waitForFunction(() => !document.getElementById('xa-load') || document.getElementById('xa-load').classList.contains('done') ||
      !document.getElementById('xa-load-err').hidden, null, { timeout: 180000 });
    const loadErr = await page.evaluate(() => { const e = document.getElementById('xa-load-err'); return e && !e.hidden ? e.textContent : ''; });
    return { page, ctx, errors, loadErr, top10, opened };
  }
  const look = (page) => page.evaluate(() => ({ ids: window.XA.games.map((g) => g.id), status: window.XAGamesRegistry.status(), cabs: window.XAHall.layout().cabinets.length,
    scripts: document.querySelectorAll('script[data-xa-game]').length, def: (() => { const g = window.XA.games.find((x) => x.id === 'astro3'); return g ? { framed: g.framed && { id: g.framed.id, size: g.framed.size }, mode: g.mode, board: window.XA.replay.boardFor(g) } : null; })() }));

  /* ------------------------------------------------ F1 */
  pages['/plain.html'] = parentWith(hallParts);
  let r = await open('/plain.html', chainWith([]));
  const base0 = await look(r.page);
  const fps = (pg) => pg.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(f); else res(n / 4); }; requestAnimationFrame(f); }));
  await r.page.click('#go'); await r.page.waitForTimeout(1500);
  console.log('     (frames per second without the framed game, software GL: ' + (await fps(r.page)).toFixed(1) + ')');
  await r.ctx.close();
  pages['/games.html'] = parentWith(Object.assign({}, hallParts, { games: { contract: GAMES_CONTRACT } }));
  r = await open('/games.html', chainWith([item({ id: 'astro3', title: 'Astro Blaster 3', index: 21, codeId: 9500 }), item({ id: 'weird_kind', kind: 7, index: 22, codeId: 9500 })]));
  check(!r.loadErr, 'F1: the hall loads with a framed game on the contract (' + (r.loadErr || 'no error') + ')');
  let g = await look(r.page);
  check(g.status.loaded.join() === 'astro3' && g.status.skipped.some((s) => s.id === 'weird_kind' && /unknown kind/.test(s.reason)), 'F1/F5: the framed game is added and an unknown kind (7) is still skipped (' + JSON.stringify(g.status.skipped) + ')');
  check(g.ids.length === BUILT_IN_COUNT + 1 && g.ids[BUILT_IN_COUNT] === 'astro3' && JSON.stringify(g.ids.slice(0, BUILT_IN_COUNT)) === JSON.stringify(base0.ids), 'F1: 22 games, the new one after the 21 built-in games, which are unchanged');
  check(g.cabs === base0.cabs + 1, 'F1: and one more cabinet in the hall (' + base0.cabs + ' to ' + g.cabs + ')');
  check(g.scripts === 0, 'F1: no script was fetched or run for it');
  check(g.def && g.def.framed.id === 9500 && g.def.framed.size === GAME_PAGE.length && g.def.mode === 'score' && g.def.board === 'astro3', 'F1: it is a score game on the board named by its id (' + JSON.stringify(g.def) + ')');
  await r.page.waitForFunction(() => document.getElementById('go'), null, { timeout: 120000 });
  await r.page.click('#go'); await r.page.waitForTimeout(800);
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  console.log('     (frames per second with the framed game and its model cabinet, software GL: ' + (await fps(r.page)).toFixed(1) + ')');
  await r.page.waitForTimeout(6000);
  check(r.top10.includes('astro3'), 'F1: the cabinet screen reads the Top 10 of the board astro3 (' + [...new Set(r.top10)].filter((b) => /astro/.test(b)).join(', ') + ')');

  /* ------------------------------------------------ F1b the model cabinet */
  const cabInfo = await r.page.evaluate(() => { const m = window.XA_CAB3D && window.XA_CAB3D.astro3; return { have: !!m, w: m && m.screen.w, h: m && m.screen.h, lay: window.XAHall.layout().cabinets.find((c) => c.id === 'astro3') }; });
  check(cabInfo.have && cabInfo.lay, 'F1b: the hall has the hand-built Astro Blaster 3 cabinet model for this game');
  const cost = await r.page.evaluate(() => { const c = window.XA_CAB3D.astro3.build(window.THREE, { lighting: false }); let meshes = 0, tris = 0; const mats = new Set();
    c.group.traverse((o) => { if (o.isMesh) { meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; mats.add(o.material); } }); return { meshes, tris: Math.round(tris), mats: mats.size }; });
  console.log('     (model cost: ' + JSON.stringify(cost) + ')');
  check(cost.meshes > 50 && cost.meshes <= 700 && cost.tris <= 300000, 'F1b: the model stays within a budget for one machine in a room of 22 (' + cost.meshes + ' meshes, ' + cost.tris + ' triangles)');
  const shotAt = async (name, dx, dz, yawOff, pitch) => {
    if (!process.env.SHOTS) return;
    const L = cabInfo.lay, x = (L.side < 0 ? -4.84 + dx : 4.84 - dx), yaw = (L.side < 0 ? Math.PI / 2 : -Math.PI / 2) + yawOff;
    await r.page.evaluate(([x, z, yaw, pitch]) => window.XA.pose(x, z, yaw, pitch), [x, L.z + dz, yaw, pitch || 0]);
    await r.page.waitForTimeout(1200);
    await r.page.screenshot({ path: path.join(process.env.SHOTS, name) });
  };
  await shotAt('astro3-front.png', 3.0, 0, 0, 0.05);
  await shotAt('astro3-close.png', 1.9, 0, 0, 0.12);
  await shotAt('astro3-angle.png', 2.4, 1.3, -0.45, 0.05);
  await shotAt('astro3-row.png', 4.5, -1.0, 0.25, 0.0);
  if (process.env.SHOTS) {
    const L = cabInfo.lay, sgn = L.side < 0 ? 1 : -1;
    for (const [nm, dz, yaw] of [['astro3-side-a.png', 1.7, 0.6], ['astro3-side-b.png', -1.7, Math.PI - 0.6]]) {
      await r.page.evaluate(([x, z, yaw]) => window.XA.pose(x, z, yaw, 0.05), [sgn * -3.5, L.z + dz, sgn > 0 ? yaw : -yaw]);
      await r.page.waitForTimeout(1200); await r.page.screenshot({ path: path.join(process.env.SHOTS, nm) });
    }
  }

  /* ------------------------------------------------ F2 */
  const idx = g.ids.indexOf('astro3');
  await r.page.evaluate((i) => window.XA.startGame(i), idx);
  await r.page.waitForFunction(() => window.XA.framedState && window.XA.framedState().open && window.XA.framedState().loaded, null, { timeout: 60000 });
  let fs_ = await r.page.evaluate(() => window.XA.framedState());
  check(fs_.open && fs_.loaded && !fs_.failed && fs_.back, 'F2: playing the cabinet opens the framed game with a BACK button');
  check(/allow-scripts/.test(fs_.sandbox) && !/allow-same-origin/.test(fs_.sandbox), 'F2: in a sandboxed frame without same-origin (' + fs_.sandbox + ')');
  const gf = () => r.page.frames().find((f) => f !== r.page.mainFrame() && f.parentFrame() === r.page.mainFrame() && /xaFramed/.test('xaFramed')) ;
  const frame = r.page.frames().filter((f) => f !== r.page.mainFrame()).pop();
  const inside = await frame.evaluate(() => ({ h1: document.querySelector('h1') && document.querySelector('h1').textContent, store: window.store }));
  check(inside.h1 === 'FAKE GAME', 'F2: the page in the frame is the inscription from the chain');
  check(inside.store === 'blocked', 'F2: the game cannot reach the hall\'s storage (no same-origin)');
  await frame.evaluate(() => { window.__got.length = 0; });

  /* ------------------------------------------------ F4 */
  const got = () => frame.evaluate(() => window.__got.slice());
  const ADDR = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
  await r.page.evaluate((a) => { window.XAScores.status = () => ({ route: 'direct', address: a }); }, ADDR);
  await frame.evaluate(() => ask({ type: 'xtrata:wallet:hello', nonce: 'n1' }));
  await r.page.waitForTimeout(300);
  let m = await got();
  const ack = m.find((x) => x.type === 'xtrata:wallet:hello-ack');
  check(ack && ack.nonce === 'n1' && typeof ack.bridgeToken === 'string' && ack.bridgeToken.length > 8, 'F4: hello is answered with a token');
  await frame.evaluate((t) => ask({ type: 'xtrata:wallet:request', requestId: 'q1', bridgeToken: t, method: 'stx_requestAccounts', params: {} }), ack.bridgeToken);
  await frame.evaluate(() => ask({ type: 'xtrata:wallet:request', requestId: 'q2', bridgeToken: 'wrong', method: 'stx_requestAccounts', params: {} }));
  await frame.evaluate((t) => ask({ type: 'xtrata:wallet:request', requestId: 'q3', bridgeToken: t, method: 'stx_transferStx', params: {} }), ack.bridgeToken);
  await r.page.waitForTimeout(400);
  m = await got();
  const q1 = m.find((x) => x.requestId === 'q1'), q2 = m.find((x) => x.requestId === 'q2'), q3 = m.find((x) => x.requestId === 'q3');
  check(q1 && q1.ok && q1.result.address === ADDR, 'F4: stx_requestAccounts answers with the connected address, and only that');
  check(!q2, 'F4: a request with the wrong token gets no answer');
  check(q3 && !q3.ok, 'F4: any other wallet method is refused');
  const pl = (o) => Object.assign({ v: 1, game: 'astro-blaster-3', network: 'mainnet', board: 'astro3', period: 0, score: 12345, name: 'ACE', replay: 'QUJDREVGR0g' }, o);
  // no viewer above the hall: the xtrata.xyz submit page opens in a tab
  const popup = r.page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null);
  await frame.locator('h1').click();                    // a real click in the game, as the SUBMIT button is: the browser lets the page above open a tab for it
  await frame.evaluate((p) => ask({ type: 'xtrata:arcade:submit', id: 'ab3-1', payload: p }), pl());
  const tab = await popup;
  await r.page.waitForTimeout(400);
  m = await got();
  check(m.some((x) => x.type === 'xtrata:arcade:submit-opened' && x.id === 'ab3-1'), 'F4: with no viewer above, the game is told the submit page opened');
  // The browser may or may not let the page above the hall open a tab (it needs a fresh click, and a slow machine can let that lapse): either is fine,
  // as long as the submit page is what is offered, with the run in it.
  const link = tab ? tab.url() : await r.page.evaluate(() => { const a = document.querySelector('#xa-framed-back') && document.querySelector('a[href*="/arcade/submit"]'); return a ? a.href : ''; });
  check(/xtrata\.xyz\/arcade\/submit#p=/.test(link), 'F4: the xtrata.xyz submit page is what opens, or is offered as a link when the browser blocks the tab (' + (tab ? 'opened' : 'link') + ')');
  const payloadBack = link ? JSON.parse(Buffer.from(link.split('#p=')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()) : null;
  check(payloadBack && payloadBack.score === 12345 && payloadBack.name === 'ACE' && payloadBack.board === 'astro3', 'F4: carrying the run as the game sent it');
  if (tab) await tab.close();
  await r.page.bringToFront();                          // (a page behind another tab draws no frames, so the hall would stand still)
  const before = m.length, openedBefore = (await r.page.waitForTimeout(1500), r.opened.length);
  const bad = [pl({ board: 'astro3-daily', score: 0 }), pl({ board: 'chess' }), pl({ name: 'x' }), pl({ name: 'a'.repeat(20) }), pl({ score: 1.5 }), pl({ replay: 'bad replay!' }), pl({ replay: 'A'.repeat(140001) }), 'text', null];
  for (let i = 0; i < bad.length; i++) await frame.evaluate(([id, p]) => ask({ type: 'xtrata:arcade:submit', id, payload: p }), ['bad-' + i, bad[i]]);
  await frame.evaluate(() => ask({ type: 'xtrata:arcade:submit', id: 'bad id!', payload: null }));
  await r.page.waitForTimeout(400);
  m = (await got()).slice(before);
  const results = m.filter((x) => x.type === 'xtrata:arcade:submit-result');
  check(r.opened.length === openedBefore && !m.some((x) => x.type === 'xtrata:arcade:submit-opened') && results.length >= bad.length - 1 && results.every((x) => x.error), 'F4: a run with a wrong board, name, score or replay is refused with an error and nothing opens (' + results.length + ' refused)');
  // a message from a window that is not the open game is ignored
  const stranger = await r.page.evaluate(() => new Promise((res) => {
    const f = document.createElement('iframe'); f.sandbox = 'allow-scripts'; document.body.appendChild(f);
    window.addEventListener('message', (e) => { if (e.source === f.contentWindow && e.data && e.data.ping) res('heard'); });
    f.srcdoc = '<script>parent.postMessage({type:"xtrata:wallet:hello",nonce:"zz"},"*");parent.postMessage({type:"xtrata:arcade:submit",id:"s1",payload:null},"*");parent.postMessage({ping:1},"*")<\/script>';
    setTimeout(() => res('quiet'), 3000);
  }));
  await r.page.waitForTimeout(300);
  check(stranger === 'heard' && !(await frame.evaluate(() => window.__got.some((x) => x.nonce === 'zz' || x.id === 's1'))), 'F4: messages from any other window are ignored');
  // a viewer above the hall: the run is passed up and its answer comes back to the game
  await r.page.evaluate(() => {
    window.__up = [];
    const orig = window.XAScores.relaySubmit;
    window.XAScores.hasHost = () => true;
    window.XAScores.relaySubmit = (p, opened) => { window.__up.push(p); opened(); return Promise.resolve({ txId: '0x' + 'ab'.repeat(32) }); };
  });
  await frame.evaluate((p) => ask({ type: 'xtrata:arcade:submit', id: 'ab3-2', payload: p }), pl({ score: 777 }));
  await r.page.waitForTimeout(500);
  m = await got();
  check((await r.page.evaluate(() => window.__up.length)) === 1 && m.some((x) => x.type === 'xtrata:arcade:submit-opened' && x.id === 'ab3-2') && m.some((x) => x.type === 'xtrata:arcade:submit-result' && x.id === 'ab3-2' && x.txId === '0x' + 'ab'.repeat(32)), 'F4: with a viewer above, the run goes up to it and the viewer\'s answer comes back to the game');
  await r.page.evaluate(() => { window.XAScores.relaySubmit = () => Promise.resolve({ cancelled: true }); });
  await frame.evaluate((p) => ask({ type: 'xtrata:arcade:submit', id: 'ab3-3', payload: p }), pl());
  await r.page.waitForTimeout(400);
  check((await got()).some((x) => x.type === 'xtrata:arcade:submit-result' && x.id === 'ab3-3' && x.cancelled), 'F4: a cancelled review is passed back as cancelled');

  /* ------------------------------------------------ back */
  await r.page.click('#xa-framed-back');
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 }).catch(async (e) => { console.log('   state after BACK:', await r.page.evaluate(() => ({ s: window.XA.hallState(), f: window.XA.framedState(), vis: document.visibilityState, raf: performance.now() }))); throw e; });
  fs_ = await r.page.evaluate(() => window.XA.framedState());
  check(!fs_.open && (await r.page.$$('iframe[data-xa-framed]')).length === 0, 'F2: BACK takes the frame down and returns to the hall');

  /* ------------------------------------------------ F5 the High scores list */
  const tools = await r.page.evaluate(() => { const g = window.XA.games.find((x) => x.id === 'astro3'); return !!g.framed; });
  check(tools, 'F5: the game is marked framed for the High scores list (no watch / verify buttons for a replay the hall cannot play)');
  check(!r.errors.length, 'no page errors ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  /* ------------------------------------------------ F3 a page that is not what the contract says */
  r = await open('/games.html', chainWith([item({ id: 'astro3', title: 'Astro Blaster 3', index: 21, codeId: BIG_LIE, size: GAME_PAGE.length + 10 })]));
  await r.page.click('#go'); await r.page.waitForTimeout(800);
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  const idx2 = await r.page.evaluate(() => window.XA.games.findIndex((x) => x.id === 'astro3'));
  if (idx2 >= 0) {
    await r.page.evaluate((i) => window.XA.startGame(i), idx2);
    await r.page.waitForFunction(() => window.XA.framedState && window.XA.framedState().open, null, { timeout: 60000 });
    await r.page.waitForFunction(() => window.XA.framedState().failed, null, { timeout: 120000 }).catch(() => {});
    fs_ = await r.page.evaluate(() => window.XA.framedState());
    check(fs_.failed && !fs_.loaded, 'F3: a game whose bytes are not the size the contract states is not opened (' + fs_.why + ')');
    await r.page.click('#xa-framed-back'); await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
    check(true, 'F3: and BACK still works');
  } else {
    check(true, 'F3: a game whose registry record size lies is not added at all (' + JSON.stringify(await r.page.evaluate(() => window.XAGamesRegistry.status().skipped)) + ')');
  }
  await r.ctx.close();

  /* ------------------------------------------------ F7 a manifest picture (kind 3) */
  const mItem = (codeId) => item({ id: 'astro3', title: 'Astro Blaster 3', index: 21, kind: 3, codeId });
  r = await open('/games.html', chainWith([mItem(9600)]));
  g = await look(r.page);
  check(g.status.loaded.join() === 'astro3' && g.ids.length === BUILT_IN_COUNT + 1, 'F7: a manifest picture adds the game (' + JSON.stringify(g.status.skipped) + ')');
  check(g.def && g.def.framed.id === 9500 && g.def.framed.size === GAME_PAGE.length && g.def.board === 'astro3', 'F7: the game framed is the inscription the note names (#9500), not the picture (' + JSON.stringify(g.def) + ')');
  const art = await r.page.evaluate(() => { const a = window.XA.games.find((x) => x.id === 'astro3').cabinetArt; return a && { side: /^data:image\/png/.test(a.side || ''), marquee: /^data:image\/png/.test(a.marquee || '') }; });
  check(art && art.side && art.marquee, 'F7: the cabinet art comes from the picture (the picture is the side print, the note carries the marquee)');
  check(g.scripts === 0, 'F7: no script was fetched or run');
  await r.page.click('#go'); await r.page.waitForTimeout(800);
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  await r.page.evaluate((i) => window.XA.startGame(i), g.ids.indexOf('astro3'));
  await r.page.waitForFunction(() => window.XA.framedState && window.XA.framedState().open && window.XA.framedState().loaded, null, { timeout: 120000 });
  check(true, 'F7: playing opens the real game from the note\'s inscription');
  await r.page.click('#xa-framed-back'); await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  check(!r.errors.length, 'F7: no page errors ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  // The real thing: the poster as made by ops/framed-manifest.mjs, the real Astro Blaster 3 release page as #3075.
  r = await open('/games.html', chainWith([mItem(9606)]));
  g = await look(r.page);
  const real = await r.page.evaluate(() => { const d = window.XA.games.find((x) => x.id === 'astro3'); return d && { id: d.framed.id, size: d.framed.size, side: (d.cabinetArt.side || '').slice(0, 22), marquee: (d.cabinetArt.marquee || '').slice(0, 22) }; });
  check(real && real.id === 3075 && real.size === MAN[3075].length && /^data:image\/webp/.test(real.side) && /^data:image\/webp/.test(real.marquee), 'F7: the real poster (webp) is read: it names #3075 and carries the marquee (' + JSON.stringify(real) + ')');
  await r.page.click('#go'); await r.page.waitForTimeout(800);
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  if (process.env.SHOTS) {                      // the cabinet wearing the real poster and marquee
    const L = await r.page.evaluate(() => window.XAHall.layout().cabinets.find((c) => c.id === 'astro3'));
    const sgn = L.side < 0 ? 1 : -1;
    const shot = async (name, dx, dz, yawOff, pitch) => { const x = L.side < 0 ? -4.84 + dx : 4.84 - dx, yaw = (L.side < 0 ? Math.PI / 2 : -Math.PI / 2) + yawOff;
      await r.page.evaluate(([x, z, yaw, pitch]) => window.XA.pose(x, z, yaw, pitch), [x, L.z + dz, yaw, pitch]); await r.page.waitForTimeout(2500); await r.page.screenshot({ path: path.join(process.env.SHOTS, name) }); };
    await shot('real-front.png', 2.2, 0, 0, 0.1); await shot('real-angle.png', 2.4, 1.3, -0.45, 0.05);
    for (const [nm, dz, yaw] of [['real-side-a.png', 1.7, 0.6], ['real-side-b.png', -1.7, Math.PI - 0.6]]) {
      await r.page.evaluate(([x, z, yaw]) => window.XA.pose(x, z, yaw, 0.05), [sgn * -3.5, L.z + dz, sgn > 0 ? yaw : -yaw]); await r.page.waitForTimeout(2500); await r.page.screenshot({ path: path.join(process.env.SHOTS, nm) });
    }
  }
  await r.page.evaluate((i) => window.XA.startGame(i), g.ids.indexOf('astro3'));
  await r.page.waitForFunction(() => window.XA.framedState && window.XA.framedState().open && window.XA.framedState().loaded, null, { timeout: 120000 });
  check(true, 'F7: the real Astro Blaster 3 page, matched to the hash in the real poster, opens in the frame');
  await r.page.waitForTimeout(4000);
  const gfr = r.page.frames().find((f) => f !== r.page.mainFrame() && f.url() !== r.page.url());
  console.log('     (the frame\'s page: ' + (gfr ? await gfr.title().catch(() => '?') : 'no frame') + ')');
  await r.page.click('#xa-framed-back'); await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  check(!r.errors.length, 'F7: no page errors with the real poster and game ' + r.errors.slice(0, 2).join(' | '));
  await r.ctx.close();

  // The note names a hash the real game does not have: the cabinet may exist but the game is never opened.
  r = await open('/games.html', chainWith([mItem(9601)]));
  await r.page.click('#go'); await r.page.waitForTimeout(800);
  await r.page.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  const i8 = await r.page.evaluate(() => window.XA.games.findIndex((x) => x.id === 'astro3'));
  await r.page.evaluate((i) => window.XA.startGame(i), i8);
  await r.page.waitForFunction(() => window.XA.framedState && window.XA.framedState().open, null, { timeout: 120000 });
  await r.page.waitForFunction(() => window.XA.framedState().failed, null, { timeout: 120000 }).catch(() => {});
  const f8 = await r.page.evaluate(() => window.XA.framedState());
  check(f8.failed && !f8.loaded, 'F7: a game that does not match the hash in the note is not opened (' + f8.why + ')');
  await r.ctx.close();

  // A picture with no note, a note for another board, something that is not an image, and a note with no marquee.
  for (const [id, why] of [[9602, 'no note'], [9603, 'other board'], [9605, 'not an image (an svg)']]) {
    r = await open('/games.html', chainWith([mItem(id)]));
    g = await look(r.page);
    check(!g.ids.includes('astro3') && g.status.skipped.some((x) => x.id === 'astro3' && /manifest/.test(x.reason)), 'F7: a picture with ' + why + ' is skipped, the hall carries on (' + JSON.stringify(g.status.skipped) + ')');
    await r.ctx.close();
  }
  r = await open('/games.html', chainWith([mItem(9604)]));
  g = await look(r.page);
  const art4 = await r.page.evaluate(() => { const a = window.XA.games.find((x) => x.id === 'astro3'); return a && a.cabinetArt; });
  check(g.ids.includes('astro3') && art4 && /^data:image\/png/.test(art4.side) && !art4.marquee, 'F7: a note with no marquee still works (the picture is still the side print)');
  await r.ctx.close();

  /* ------------------------------------------------ F6 the real hand-up, with a real viewer window above the hall */
  pages['/host.html'] = '<!doctype html><title>host</title><iframe id="h" src="/games.html" style="width:1100px;height:700px;border:0"></iframe><script>window.log=[];addEventListener("message",function(e){var d=e.data;window.log.push(d);if(d&&d.type==="xtrata:arcade:submit"){if(d.payload&&d.payload.score===111)return;e.source.postMessage({type:"xtrata:arcade:submit-opened",id:d.id},"*");setTimeout(function(){e.source.postMessage({type:"xtrata:arcade:submit-result",id:d.id,txId:"0x"+"cd".repeat(32)},"*")},50)}})<\/script>';
  r = await open('/host.html', chainWith([item({ id: 'astro3', title: 'Astro Blaster 3', index: 21, codeId: 9500 })]));
  const hf = r.page.frames().find((f) => f !== r.page.mainFrame() && /games\.html/.test(f.url()));
  await hf.waitForFunction(() => window.XA && window.XA.startGame && document.getElementById('go'), null, { timeout: 120000 });
  await hf.click('#go'); await hf.waitForFunction(() => window.XA.hallState() === 'walk', null, { timeout: 120000 });
  await hf.evaluate((i) => window.XA.startGame(i), await hf.evaluate(() => window.XA.games.findIndex((x) => x.id === 'astro3')));
  await hf.waitForFunction(() => window.XA.framedState && window.XA.framedState().loaded, null, { timeout: 60000 });
  const game6 = r.page.frames().filter((f) => f !== r.page.mainFrame() && f !== hf).pop();
  await game6.evaluate((p) => { window.__got.length = 0; ask({ type: 'xtrata:arcade:submit', id: 'ab3-9', payload: p }); }, pl({ score: 4242 }));
  await r.page.waitForTimeout(800);
  const m6 = await game6.evaluate(() => window.__got.slice());
  const upstream = await r.page.evaluate(() => window.log.filter((d) => d && d.type === 'xtrata:arcade:submit'));
  check(upstream.length === 1 && upstream[0].payload.score === 4242 && upstream[0].id !== 'ab3-9', 'F6: the run goes up to the window above the hall (under the hall\'s own id), exactly as the game sent it');
  check(m6.some((x) => x.type === 'xtrata:arcade:submit-opened' && x.id === 'ab3-9') && m6.some((x) => x.type === 'xtrata:arcade:submit-result' && x.id === 'ab3-9' && x.txId === '0x' + 'cd'.repeat(32)), 'F6: and the viewer\'s opened / result come back to the game under the game\'s own id');
  check(!r.opened.length, 'F6: no tab is opened when the viewer answers');
  const slow = r.page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null);
  await game6.evaluate((p) => { window.__got.length = 0; ask({ type: 'xtrata:arcade:submit', id: 'ab3-10', payload: p }); }, pl({ score: 111 }));
  await r.page.waitForTimeout(5500);
  const m7 = await game6.evaluate(() => window.__got.slice());
  check(m7.some((x) => x.type === 'xtrata:arcade:submit-opened' && x.id === 'ab3-10') && !m7.some((x) => x.type === 'xtrata:arcade:submit-result'), 'F6: a viewer that never answers is not waited on for ever: after a few seconds the game is told the submit page is open');
  const t7 = await slow; if (t7) await t7.close();
  await r.ctx.close();
  await browser.close(); srv.close();
  console.log('\n' + passed + ' checks passed');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });

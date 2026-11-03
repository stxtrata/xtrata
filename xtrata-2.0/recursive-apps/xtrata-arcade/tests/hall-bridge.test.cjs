// The room bridge's wallet half: XA_ROOM.call() and XA_ROOM.account() from a room page, signed through the hall's own wallet path.
// The real hall (dist single file) in Chromium, on an in-memory chain (tests/lib/mock-chain.cjs) and a mocked Xverse wallet on a
// top-level page (as tests/long-replay.test.cjs). Two rooms, both reached through a hall door: GALLERY is hosted (runtime 3), CASINO a page (2).
//   A  a page room            call() and account() are refused (not-hosted); no dialog, nothing reaches the wallet
//   B  not approved           a hosted room's call to a contract the registry does not approve is refused; no dialog, no wallet
//   C  could not check        is-approved fails to read: refused as could-not-check (never treated as approved)
//   D  bad requests           no maxStx, a post-condition above the cap, a malformed contract: refused before anything else
//   E  the player says no     the hall's dialog names the room, the contract, the function and the cap; "Not now" cancels; no wallet call
//   F  the player says yes    the wallet gets stx_callContract with no sender, deny mode, exactly one STX post-condition (this account sends
//                             at most maxStx), bare-hex args; the room gets the txid. account() gives the connected address
//   G  account mismatch       the wallet connects as another account than the one confirmed: the call aborts, nothing is signed
// Run: NODE_PATH=<playwright> CHROME_PATH=... node tests/hall-bridge.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const MC = require('./lib/mock-chain.cjs');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = fs.readFileSync(path.join(DIST, fs.readdirSync(DIST).find((f) => /^xtrata-arcade-v[\d.]+\.html$/.test(f))), 'utf8');
let passed = 0;
const check = (c, name) => { assert(c, name); passed++; console.log('  ✓ ' + name); };

const ADDR1 = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', ADDR2 = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OK_CONTRACT = 'SP000000000000000000002Q6VF78.casino-holdem-v1', NO_CONTRACT = 'SP000000000000000000002Q6VF78.casino-liars-dice-v1';
const page_ = (name) => Buffer.from('<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title></head><body style="background:#123;color:#fff"><h1>' + name + '</h1><script>' +
  'window.__call=function(o){return XA_ROOM.call(o).then(function(t){return "ok:"+t},function(e){return "err:"+e.code})};' +
  'window.__acct=function(){return XA_ROOM.account().then(function(a){return "ok:"+a},function(e){return "err:"+e.code})};XA_ROOM.ready();</script></body></html>');
const GALLERY = page_('gallery'), CASINO = page_('casino');
const ent = (id, b) => ({ id, hash: MC.chainHash(b).toString('hex'), size: b.length });
const door = (space, name, to) => ({ space, parent: 0, kind: 0, name, params: '{}', portal: { to, arrival: 0, path: '' }, active: { patch: '{"base":"door"}', interaction: 3 } });
function world() {
  return MC.createChain({
    spaces: { 1: { parent: 0, slug: '', kind: 0 }, 2: { parent: 1, slug: 'arcade', kind: 0 }, 3: { parent: 2, slug: 'hall', title: 'Hall' }, 4: { parent: 2, slug: 'lobby', title: 'Lobby' },
      10: { parent: 2, slug: 'casino', title: 'Royal Flush Casino', runtime: 2, entry: ent(9200, CASINO) },
      13: { parent: 2, slug: 'gallery', title: 'Gallery', runtime: 3, entry: ent(9201, GALLERY) } },
    objects: { 20: door(3, 'bay-0', 13), 21: door(3, 'bay-1', 10) },
    kinds: MC.KINDS, inscriptions: { 9200: CASINO, 9201: GALLERY }, approved: [OK_CONTRACT],
  });
}
const ARG = '0x' + MC.cv.uint(7);

(async () => {
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(HTML); });
  await new Promise((r) => srv.listen(0, r));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const wallet = { addr: ADDR1, calls: [] };
  const chain = world();
  let approvedDown = false;
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, MC.routeFor(chain, { down: (fn) => approvedDown && fn === 'is-approved' }));
  await ctx.exposeFunction('__wallet', (m, p) => {
    wallet.calls.push({ m, p });
    if (m === 'wallet_connect' || m === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', purpose: 'stacks', address: wallet.addr }] } };
    if (m === 'stx_callContract') return { result: { txid: 'ab'.repeat(32) } };
    return { error: { message: 'unsupported ' + m } };
  });
  await ctx.addInitScript(() => {
    window.XA_TEST = 1;
    Element.prototype.requestPointerLock = function () {};
    window.XverseProviders = { BitcoinProvider: { request: (m, prm) => window.__wallet(m, JSON.parse(JSON.stringify(prm || null))) } };
    window.XA_WORLD_CONFIG = { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', registry: 'SP000000000000000000002Q6VF78.xtrata-world-v2' };
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => window.XA && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null), null, { timeout: 120000 });
  await page.waitForFunction(() => { const s = window.XA.bayState(); return s && s.bays[0].plan && s.bays[1].plan; }, null, { timeout: 120000 });
  await page.click('#go'); await page.waitForTimeout(600);

  const rs = () => page.evaluate(() => JSON.parse(JSON.stringify(window.XA.roomState())));
  const openDoor = (i) => page.evaluate((n) => window.XA.bayDoor(n, (m) => { m.cfg.locked = false; m.angle = m.cfg.openAngle; m.vel = 0; m.mode = 'free'; m.wake(); }), i);
  // walk into hall bay i (0: the left wall, facing -x; 1: the right wall, facing +x)
  async function into(i, re) {
    await openDoor(i);
    const yaw = i === 0 ? Math.PI / 2 : -Math.PI / 2;
    await page.evaluate(([n, y]) => { const p = window.XA.bayState().bays[n].pos; window.XA.pose(p.x + (n === 0 ? 1.6 : -1.6), p.z, y, -0.05); }, [i, yaw]);
    await page.waitForTimeout(600);
    await page.keyboard.down('KeyW');
    try { for (let k = 0; k < 400 && (await rs()).state !== 'room'; k++) { await page.evaluate((y) => { const w = window.XA.where(); window.XA.pose(w.x, w.z, y, -0.05); }, yaw); await page.waitForTimeout(250); } } finally { await page.keyboard.up('KeyW'); }
    await page.waitForFunction((s) => { const r = window.XA.roomState(); return r.state === 'room' && r.back && !r.loading && new RegExp(s).test(r.title); }, re.source, { timeout: 120000 });
  }
  const frame = async () => (await page.$('iframe[data-xa-room]')).contentFrame();
  const back = async () => { await page.click('#xa-room-back'); await page.waitForFunction(() => window.XA.roomState().state === 'walk', null, { timeout: 60000 }); await page.waitForTimeout(400); };
  const dialog = () => page.evaluate(() => { const d = document.querySelector('.xa-callmodal'); return d ? d.innerText : ''; });
  const walletCalls = () => wallet.calls.filter((c) => c.m === 'stx_callContract').length;

  /* ---- A ---- */
  await into(1, /ROYAL FLUSH CASINO/);
  let f = await frame();
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: [], maxStx: '1' }), OK_CONTRACT)) === 'err:not-hosted', 'A: call() from a page room (runtime 2) is refused: not-hosted');
  check((await f.evaluate(() => window.__acct())) === 'err:not-hosted', 'A: account() too');
  check(!(await dialog()) && walletCalls() === 0, 'A: no dialog, nothing reached the wallet');
  check(/BACK TO THE HALL/.test((await rs()).backLabel), 'A: a room entered from a hall door goes back to the hall (' + (await rs()).backLabel + ')');
  await back();
  const w = await page.evaluate(() => ({ where: window.XA.where(), pos: window.XA.bayState().bays[1].pos }));
  check(Math.abs(w.where.x - (w.pos.x - 1.2)) < 0.05 && Math.abs(Math.sin(w.where.yaw) - 1) < 0.05, 'A: back in the hall, a step in front of the right-wall door, facing away from it');

  /* ---- B ---- */
  await into(0, /GALLERY/);
  f = await frame();
  check((await rs()).sandbox === 'allow-scripts allow-pointer-lock allow-downloads', 'B: the hosted room runs in the same sandbox as any room');
  check((await f.evaluate(() => window.__acct())) === 'ok:null', 'B: account() in a hosted room: null while no wallet is connected');
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: [], maxStx: '1' }), NO_CONTRACT)) === 'err:not-approved', 'B: a contract the registry does not approve is refused');
  check(!(await dialog()) && walletCalls() === 0, 'B: no dialog, nothing reached the wallet');
  const isApprovedReads = chain.log.filter((l) => l.fn === 'is-approved').length;
  check(isApprovedReads >= 1, 'B: the registry was asked at call time (' + isApprovedReads + ' is-approved reads)');

  /* ---- C ---- */
  approvedDown = true;
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: [], maxStx: '1' }), OK_CONTRACT)) === 'err:could-not-check', 'C: is-approved could not be read: refused as could-not-check');
  approvedDown = false;
  check(!(await dialog()) && walletCalls() === 0, 'C: no dialog, nothing reached the wallet');

  /* ---- D ---- */
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: [] }), OK_CONTRACT)) === 'err:bad-request:maxStx', 'D: no maxStx: refused');
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: [], maxStx: '1', postConditions: [{ type: 'stx', amount: '2000000' }] }), OK_CONTRACT)) === 'err:bad-request:postConditions', 'D: a post-condition above the cap: refused');
  check((await f.evaluate(() => window.__call({ contract: 'evil', fn: 'join', args: [], maxStx: '1' }))) === 'err:bad-request:contract', 'D: a malformed contract: refused');
  check((await f.evaluate((c) => window.__call({ contract: c, fn: 'join', args: ['nothex'], maxStx: '1' }), OK_CONTRACT)) === 'err:bad-request:args', 'D: args that are not Clarity hex: refused');
  check(walletCalls() === 0, 'D: nothing reached the wallet');

  /* ---- E ---- */
  let pending = f.evaluate(([c, a]) => window.__call({ contract: c, fn: 'join-table', args: [a], maxStx: '0.25' }), [OK_CONTRACT, ARG]);
  await page.waitForFunction(() => !!document.querySelector('.xa-callmodal'), null, { timeout: 30000 });
  const text = await dialog();
  check(/GALLERY asks you to sign/i.test(text) && text.includes(OK_CONTRACT) && /join-table/.test(text) && /0\.25 STX/.test(text) && /NETWORK FEE/i.test(text), 'E: the hall\'s dialog names the room, contract, function, the 0.25 STX cap and the network fee');
  await page.click('.xa-callmodal >> text=Not now');
  check((await pending) === 'err:cancelled' && walletCalls() === 0, 'E: "Not now" cancels; nothing reached the wallet');

  /* ---- F ---- */
  pending = f.evaluate(([c, a]) => window.__call({ contract: c, fn: 'join-table', args: [a], maxStx: 0.25, postConditions: [{ type: 'stx', amount: '250000' }] }), [OK_CONTRACT, ARG]);
  await page.waitForFunction(() => !!document.querySelector('.xa-callmodal'), null, { timeout: 30000 });
  check(/connect first/i.test(await dialog()), 'F: not connected yet, the dialog says the wallet will ask to connect');
  await page.click('.xa-callmodal >> text=Open my wallet');
  const got = await pending;
  check(got === 'ok:' + 'ab'.repeat(32), 'F: the room gets the txid (' + got + ')');
  const call = wallet.calls.filter((c) => c.m === 'stx_callContract').pop().p;
  check(!('sender' in call), 'F: no sender is sent (wallet playbook §2)');
  check(call.contract === OK_CONTRACT && call.functionName === 'join-table' && call.postConditionMode === 'deny', 'F: the contract, function and deny mode');
  const d1 = MC.c32decode(ADDR1);
  const wantPc = '0002' + d1.version.toString(16).padStart(2, '0') + d1.hash160 + '05' + (250000).toString(16).padStart(16, '0');
  check(Array.isArray(call.postConditions) && call.postConditions.length === 1 && call.postConditions[0] === wantPc, 'F: exactly one post-condition: ' + ADDR1.slice(0, 6) + '… sends at most 250000 µSTX (' + call.postConditions + ')');
  check(JSON.stringify(call.functionArgs) === JSON.stringify([ARG.slice(2)]) && JSON.stringify(call.arguments) === JSON.stringify([ARG.slice(2)]), 'F: args as bare hex (functionArgs and arguments)');
  check((await f.evaluate(() => window.__acct())) === 'ok:' + ADDR1, 'F: account() gives the connected address');

  /* ---- G ---- */
  pending = f.evaluate(([c, a]) => window.__call({ contract: c, fn: 'join-table', args: [a], maxStx: '1' }), [OK_CONTRACT, ARG]);
  await page.waitForFunction(() => !!document.querySelector('.xa-callmodal'), null, { timeout: 30000 });
  check(/Signing as SP2C2/.test(await dialog()), 'G: the dialog says which account will sign');
  const before = walletCalls();
  // between the dialog and the wallet the session is lost and the wallet comes back as another account
  await page.evaluate(() => window.XAScores.disconnect()); wallet.addr = ADDR2;
  await page.click('.xa-callmodal >> text=Open my wallet');
  const g = await pending;
  check(/^err:.*not the account you confirmed\. Nothing was signed\./.test(g) && walletCalls() === before, 'G: another account aborts the call: "' + g.slice(4, 90) + '…"');
  await back();
  check(!errors.length, 'no page errors ' + errors.slice(0, 2).join(' | '));
  await ctx.close(); await browser.close(); srv.close();
  console.log('hall bridge tests passed: ' + passed);
})().catch((e) => { console.error(e); process.exit(1); });

// The testnet ad-buying page (build/testnet-ads.cjs): reads the screen contract and the core (faked Hiro answers), quotes the price, checks the picture belongs to the
// connected wallet, sends buy-slot through a fake Leather with the exact arguments and a deny-mode post-condition for the price, lists pending slots with the right buttons,
// and refuses a mainnet account.
// Run: NODE_PATH=<playwright + @stacks/transactions> node tests/testnet-ads.test.cjs   (builds the page first)
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { execFileSync } = require('child_process');
// XA_NET=mainnet runs the same checks against the MAINNET page (build/mainnet-ads.cjs) with mainnet-format addresses and a testnet account refused.
const MAIN = process.env.XA_NET === 'mainnet', NET = MAIN ? 'mainnet' : 'testnet';
const c32 = require('c32check');
const toMain = (a) => c32.c32address(22, c32.c32addressDecode(a)[1]);
const out = path.join(require('os').tmpdir(), 'xa-' + NET + '-ads.html');
execFileSync('node', [path.join(__dirname, '..', 'build', MAIN ? 'mainnet-ads.cjs' : 'testnet-ads.cjs'), '--out', out]);
const fix = (a) => (MAIN ? toMain(a) : a);
const ROOT = MAIN ? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' : 'STVAM4JVX5ES4MV18S00VCAQMPR8928FAHRNMAJ9', BUYER = fix('ST3N1VYG563049PE8C2Z24QY6ANW222Y1TQG583X9'), OTHER = fix('ST18222E20QGZPCEAJ7W88G9EGZJNVFCGZBRQG0F3'), PARTNER = fix('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
const U = (n) => T.uintCV(n), A = (s) => T.stringAsciiCV(s), B = (b) => T.bufferCV(b), P = (a) => T.principalCV(a);
const HASH = Buffer.alloc(32, 7);
let slotsOn = true;
const item = (o) => T.someCV(T.tupleCV({ kind: U(o.kind), head: A(o.head), body: A(''), 'image-id': U(o.img || 0), 'image-hash': B(o.img ? HASH : Buffer.alloc(0)), 'image-size': U(o.img ? 5000 : 0), layout: U(o.layout || 0), turns: U(o.turns || 1), link: A(o.link || ''), weight: U(1),
  publisher: P(o.buyer), paid: T.trueCV(), buyer: T.someCV(P(o.buyer)), days: U(o.days), price: U(o.price), escrow: U(o.price), status: U(o.status), hidden: T.falseCV(), 'starts-at': U(o.status ? 900 : 0), 'ends-at': U(o.status ? 900 + o.days * 144 : 0), 'added-at': U(800), 'closed-reason': U(0) }));
const items = [item({ kind: 2, head: 'LIVE ONE', buyer: OTHER, days: 2, price: 10e6, status: 1 }), item({ kind: 0, head: 'MY PENDING', buyer: BUYER, days: 1, price: 1e6, status: 0 })];
function answer(contract, fn, args) {
  const arg = (i) => T.cvToValue(T.hexToCV(args[i]));
  if (/xtrata-screen-v1$/.test(contract)) {
    if (fn === 'get-config') return T.tupleCV({ paused: T.falseCV(), 'review-lane': T.falseCV(), 'slots-enabled': slotsOn ? T.trueCV() : T.falseCV(), prices: T.tupleCV({ message: U(1e6), news: U(2e6), ad: U(5e6) }), 'premium-percent': U(200), 'min-days': U(1), 'max-days': U(14),
      'max-paid-live': U(8), 'max-pending-per-buyer': U(2), 'max-turns': U(3), 'review-window': U(432), 'fee-recipient': P(ROOT), 'kind-caps': T.tupleCV({ message: U(16), news: U(12), ad: U(8) }), 'cap-live-per-publisher': U(2), 'pending-admin': T.noneCV() });
    if (fn === 'get-admin') return P(ROOT);
    if (fn === 'get-partner') return arg(0) === PARTNER ? T.someCV(T.tupleCV({ discount: U(50), 'max-days': U(30), 'max-turns': U(5) })) : T.noneCV();
    if (fn === 'get-height') return U(1000);
    if (fn === 'get-count') return U(items.length);
    if (fn === 'get-item') return items[Number(arg(0).value ?? arg(0))];
  } else {
    const id = Number(arg(0).value ?? arg(0));
    if (fn === 'is-inscription-sealed') return T.someCV(T.trueCV());
    if (fn === 'get-inscription-creator') return id === 99 ? T.someCV(P(ROOT)) : id === 77 ? T.someCV(P(BUYER)) : id === 88 ? T.someCV(P(OTHER)) : T.noneCV();
    if (fn === 'get-inscription-hash') return T.someCV(B(HASH));
    if (fn === 'get-inscription-size') return T.someCV(U(5000));
  }
  throw new Error('no answer for ' + contract + ' ' + fn);
}
(async () => {
  const br = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  async function open(address) {
    const pg = await br.newPage(); const errors = []; if (process.env.DBG) pg.on('console', (m) => console.log('c:', m.text())); pg.on('pageerror', (e) => errors.push(e.message));
    await pg.route('**/v2/contracts/call-read/**', async (r) => {
      const m = /call-read\/([^/]+)\/([^/]+)\/([a-z-]+)$/.exec(r.request().url()); const body = JSON.parse(r.request().postData());
      try { await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ okay: true, result: T.cvToHex(answer(m[1] + '.' + m[2], m[3], body.arguments)) }) }); }
      catch (e) { if (process.env.DBG) console.log('ANSWER ERR', m[3], e.message); await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ okay: false, cause: e.message }) }); }
    });
    await pg.addInitScript((addr) => {
      window.__calls = [];
      window.LeatherProvider = { request: async (m, p) => {
        if (m === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: addr }] } };
        if (m === 'stx_callContract') { window.__calls.push(p); return { result: { txid: '0xabc123' } }; }
        return { error: { code: -32601, message: 'no' } };
      } };
    }, address);
    pg.on('console', (m) => process.env.DBG && console.log('console:', m.text())); await pg.goto('file://' + out); await pg.waitForFunction(() => document.getElementById('cfg').textContent.includes('Prices per day'), null, { timeout: 8000 }).catch(async (e) => { console.log('CFG:', await pg.textContent('#cfg'), errors); throw e; });
    return { pg, errors };
  }
  let { pg, errors } = await open(BUYER);
  assert(/Paid slots are ON/.test(await pg.textContent('#cfg')) && /5 STX/.test(await pg.textContent('#cfg')), 'config shown');
  assert((await pg.textContent('#price')).includes('15 STX'), 'ad 3 days = 15 STX: ' + await pg.textContent('#price'));
  await pg.selectOption('#layout', '1'); assert((await pg.textContent('#price')).includes('30 STX'), 'full-screen is double: ' + await pg.textContent('#price'));
  await pg.selectOption('#layout', '0');
  await pg.fill('#days', '20'); assert((await pg.textContent('#pricenote')).includes('1 to 14'), 'days limit shown'); await pg.fill('#days', '3');
  assert(await pg.isDisabled('#buy'), 'buy disabled before connecting');
  assert(/MY PENDING/.test(await pg.textContent('#items')) && /LIVE ONE/.test(await pg.textContent('#items')) && /pending/.test(await pg.textContent('#items')), 'slots listed');
  await pg.click('#wbtn'); await pg.waitForFunction(() => /Connected/.test(document.getElementById('wstat').textContent));
  await pg.waitForSelector('button[data-a=cancel]'); assert(!(await pg.$('button[data-a=approve]')) && !(await pg.$('button[data-a=reject]')), 'a buyer sees Cancel, but no Approve or Reject');
  // cancel = a refund: the wallet caps what the buyer spends at 0 AND the contract may pay out at most the held escrow (second post-condition, contract principal)
  await pg.evaluate(() => { window.confirm = () => true; }); await pg.click('button[data-a=cancel]'); await pg.waitForFunction(() => window.__calls.length === 1);
  const cc = await pg.evaluate(() => window.__calls.shift()); assert.strictEqual(cc.functionName, 'cancel'); assert.strictEqual(cc.postConditionMode, 'deny'); assert.strictEqual(cc.postConditions.length, 2, 'cancel carries two post-conditions');
  const pcs = cc.postConditions.map((h) => Buffer.from(h, 'hex')); const own = pcs[0], ctr = pcs[1];
  assert.strictEqual(own[1], 2, 'first is the buyer (standard principal)'); assert.strictEqual(Number(BigInt('0x' + own.slice(own.length - 8).toString('hex'))), 0, 'buyer may spend 0 on a cancel');
  assert.strictEqual(ctr[0], 0, 'STX post-condition'); assert.strictEqual(ctr[1], 3, 'second is the CONTRACT principal'); const nlen = ctr[23]; assert.strictEqual(ctr.slice(24, 24 + nlen).toString('ascii'), 'xtrata-screen-v1', 'contract name');
  assert.strictEqual(ctr[24 + nlen], 5, 'less-than-or-equal'); assert.strictEqual(Number(BigInt('0x' + ctr.slice(25 + nlen).toString('hex'))), 1e6, 'contract may pay out at most the 1 STX held');
  assert.strictEqual(c32.c32address(ctr[2], ctr.slice(3, 23).toString('hex')), ROOT, 'contract address is the screen contract deployer');
  assert.strictEqual(c32.c32address(own[2], own.slice(3, 23).toString('hex')), BUYER, 'first post-condition is the connected buyer');
  await pg.fill('#head', 'TEST AD'); assert(!(await pg.isDisabled('#buy')), 'text-only ad can be bought');
  await pg.fill('#img', '88'); await pg.waitForFunction(() => /not your connected wallet/.test(document.getElementById('imgchk').textContent)); assert(await pg.isDisabled('#buy'), "someone else's picture refused");
  await pg.fill('#img', '77'); await pg.waitForFunction(() => /sealed, yours/.test(document.getElementById('imgchk').textContent)); assert(!(await pg.isDisabled('#buy')), 'own picture accepted');
  // turns, start date and link: price x turns, the public limit is 3, a bad link blocks buying, a good one is sent
  await pg.selectOption('#layout', '1'); await pg.selectOption('#turns', '4');
  assert(await pg.isDisabled('#buy') && /turns must be 1 to 3/.test(await pg.textContent('#pricenote')), 'over the public turn limit: ' + await pg.textContent('#pricenote'));
  await pg.selectOption('#turns', '2'); assert((await pg.textContent('#price')).includes('60 STX'), '10 STX/day full-screen x 3 days x 2 turns = 60 STX: ' + await pg.textContent('#price'));
  await pg.fill('#link', 'http://nope.example'); assert(await pg.isDisabled('#buy') && /https:\/\//.test(await pg.textContent('#linkchk')), 'a non-https link blocks buying');
  await pg.fill('#link', 'https://a b.example'); assert(await pg.isDisabled('#buy'), 'a link with a space blocks buying');
  await pg.fill('#link', 'https://xtrata.xyz/arcade?x=1'); assert(!(await pg.isDisabled('#buy')) && /looks fine/.test(await pg.textContent('#linkchk')), 'a good link is accepted');
  await pg.fill('#startd', '31'); assert(await pg.isDisabled('#buy'), 'a start more than 30 days ahead blocks buying'); await pg.fill('#startd', '1');
  await pg.click('#buy'); await pg.waitForFunction(() => window.__calls.length === 1, null, { timeout: 6000 }).catch(async (e) => { console.log('BUYMSG:', await pg.textContent('#buymsg')); throw e; });
  const c = await pg.evaluate(() => window.__calls[0]);
  assert.strictEqual(c.contract, ROOT + '.xtrata-screen-v1'); assert.strictEqual(c.functionName, 'buy-slot'); assert.strictEqual(c.network, NET); assert.strictEqual(c.postConditionMode, 'deny');
  assert(c.functionArgs.every((a) => !/^0x/.test(a)) && !('sender' in c), 'bare hex, no sender');
  const dec = c.functionArgs.map((h) => T.cvToValue(T.hexToCV(h)));
  const v = (x) => (x && x.value !== undefined ? x.value : x);
  assert.deepStrictEqual(dec.slice(0, 12).map((x) => String(v(x))), ['2', 'TEST AD', '', '77', '0x' + HASH.toString('hex'), '5000', '3', '1', '60000000', '2', '1144', 'https://xtrata.xyz/arcade?x=1'], 'buy-slot arguments: ' + dec.map(v).map(String).join('|'));
  assert.strictEqual(c.postConditions.length, 1, 'one STX post-condition (the price)');
  assert(!(await pg.isVisible('#freecard')), 'a normal buyer never sees the admin card');
  await pg.close(); assert.deepStrictEqual(errors, []);
  // a partner: discount and their own limits shown and applied, sent as the computed price
  ({ pg, errors } = await open(PARTNER)); await pg.click('#wbtn'); await pg.waitForFunction(() => /PARTNER RATE/.test(document.getElementById('wstat').textContent));
  await pg.fill('#days', '20'); await pg.selectOption('#turns', '5'); await pg.fill('#head', 'PARTNER AD');
  assert((await pg.textContent('#price')).includes('250 STX') && /50% partner discount/.test(await pg.textContent('#pricenote')), '5 STX x 20 days x 5 turns = 500, half = 250 STX: ' + await pg.textContent('#price'));
  assert(!(await pg.isDisabled('#buy')), 'a partner can book 20 days and 5 turns');
  await pg.click('#buy'); await pg.waitForFunction(() => window.__calls.length === 1, null, { timeout: 6000 });
  const pc = await pg.evaluate(() => window.__calls[0]); const pd = pc.functionArgs.map((h) => T.cvToValue(T.hexToCV(h))).map((x) => String(x && x.value !== undefined ? x.value : x));
  assert.deepStrictEqual([pd[6], pd[8], pd[9], pd[10], pd[11]], ['20', '250000000', '5', '0', ''], 'partner buy-slot arguments: ' + pd.join('|'));
  await pg.close(); assert.deepStrictEqual(errors, []);
  // admin sees Approve/Reject; slots off blocks buying; a mainnet account is refused
  ({ pg, errors } = await open(ROOT)); await pg.click('#wbtn'); await pg.waitForSelector('button[data-a=approve]');
  await pg.evaluate(() => { window.confirm = () => true; }); await pg.click('button[data-a=reject]'); await pg.waitForFunction(() => window.__calls.length === 1);
  const rj = await pg.evaluate(() => window.__calls.shift()); assert.strictEqual(rj.functionName, 'reject'); assert.strictEqual(rj.postConditions.length, 2, 'reject (a refund) carries the contract post-condition too');
  assert(await pg.isVisible('#freecard'), 'the admin sees the free-post card');
  assert(/Earned payments go to/.test(await pg.textContent('#cfg')), 'the page says where earned payments go');
  assert(/the admin wallet/.test(await pg.textContent('#sltxt')), 'admin card: says payments go to the admin wallet');
  const wasOn = /Paid slots are ON/.test(await pg.textContent('#cfg')); assert.strictEqual(/off$/.test(await pg.textContent('#fslots')), wasOn, 'the switch offers the opposite of the current state');
  await pg.click('#fslots'); assert.strictEqual(await pg.evaluate(() => window.__calls.length), 0, 'the first press only asks to confirm: nothing sent');
  await pg.click('#fslots'); await pg.waitForFunction(() => window.__calls.length === 1);
  const sw = await pg.evaluate(() => window.__calls.shift()); assert.strictEqual(sw.functionName, 'set-slots-enabled'); assert.deepStrictEqual(sw.functionArgs, [wasOn ? '04' : '03'], 'a Clarity bool'); assert.strictEqual(sw.postConditions.length, 1, 'moves no STX');
  await pg.fill('#fimg', '77'); await pg.waitForFunction(() => /not the connected admin wallet/.test(document.getElementById('fimgchk').textContent)); await pg.click('#fpost'); await pg.waitForTimeout(300); assert.strictEqual(await pg.evaluate(() => window.__calls.map((c) => c.functionName).join()), '', "someone else's picture is refused: nothing sent");
  await pg.fill('#fimg', ''); await pg.click('#fpost'); await pg.waitForFunction(() => window.__calls.length === 1);
  const fp0 = await pg.evaluate(() => window.__calls.shift()); assert.strictEqual(fp0.functionName, 'post-item'); assert.strictEqual(String(T.cvToValue(T.hexToCV(fp0.functionArgs[3])).value ?? T.cvToValue(T.hexToCV(fp0.functionArgs[3]))), '0', 'text-only free post has no picture');
  await pg.fill('#fimg', '99'); await pg.waitForFunction(() => /sealed, yours/.test(document.getElementById('fimgchk').textContent)); await pg.selectOption('#fturns', '2'); await pg.click('#fpost'); await pg.waitForFunction(() => window.__calls.length === 1);
  const fp = await pg.evaluate(() => window.__calls.shift()); assert.strictEqual(fp.functionName, 'post-item'); assert.strictEqual(fp.postConditions.length, 1, 'a free post moves no STX');
  const fa = fp.functionArgs.map((h) => T.cvToValue(T.hexToCV(h))).map((x) => String(x && x.value !== undefined ? x.value : x));
  assert.deepStrictEqual([fa[0], fa[1], fa[3], fa[4], fa[5], fa[6], fa[7], fa[8], fa[9], fa[10], fa[11]], ['2', 'ADVERTISE HERE', '99', '0x' + HASH.toString('hex'), '5000', '1', '0', String(1000 + 365 * 144), '0', '2', 'https://xtrata.xyz/arcade/advertise'], 'post-item arguments: ' + fa.join('|'));
  await pg.click('button[data-a=approve]'); await pg.waitForFunction(() => window.__calls.length === 1);
  assert.strictEqual((await pg.evaluate(() => window.__calls[0])).postConditions.length, 1, 'approve moves no STX: one post-condition only');
  const a = await pg.evaluate(() => window.__calls[0]); assert.strictEqual(a.functionName, 'approve'); assert.strictEqual(String(T.cvToValue(T.hexToCV(a.functionArgs[0])).value ?? T.cvToValue(T.hexToCV(a.functionArgs[0]))), '1'); await pg.close();
  slotsOn = false; ({ pg } = await open(BUYER)); await pg.click('#wbtn'); await pg.fill('#head', 'X'); assert(await pg.isDisabled('#buy') && /Paid slots are OFF/.test(await pg.textContent('#cfg')), 'off = cannot buy'); await pg.close(); slotsOn = true;
  ({ pg } = await open(MAIN ? 'ST3N1VYG563049PE8C2Z24QY6ANW222Y1TQG583X9' : 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X')); await pg.click('#wbtn').catch(() => {}); await pg.waitForTimeout(500);
  assert(/mainnet account|testnet account|Switch your wallet/.test(await pg.textContent('#wstat')), 'mainnet refused: ' + await pg.textContent('#wstat')); assert(await pg.isDisabled('#buy'), 'cannot buy with a mainnet account'); await pg.close();
  await br.close(); console.log(NET + ' ads page: all checks passed');
})().catch((e) => { console.error('FAIL', e.message, (e.stack || '').split('\n').filter((l) => /testnet-ads.test/.test(l)).slice(0, 2).join(' ')); process.exit(1); });

// Mock-chain run of the Forever Twins launch canary, end to end, against a synthetic collection ("testcol").
//
//   node canaries/forever-twins-launch/make-test-collection.mjs <repoRoot> <scratch> <deployer>
//   node scripts/build-forever-twins-launch-canary.mjs --root <scratch> --collection testcol --pin --deployer <deployer>
//   NODE_PATH=<dir with playwright + @stacks/transactions v6> CHROME_PATH=<chromium> \
//     node canaries/forever-twins-launch/mock-chain-test.cjs <scratch>
//
// The mock chain implements just enough of the helper, the core and the Hiro API to exercise every step. The web
// wallet is a stub Leather provider that applies calls to the mock (no keys, nothing leaves this machine).
// Cases: wrong wallet refused; finalise blocked until the resolver serves the exact manifest; tampered file
// refused before signing; non-payee test inscription pays both payees half; re-run after "Forget progress"
// resumes from the chain and sends nothing twice.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = require('@stacks/transactions');
const { chromium } = require('playwright');
const { tupleCV, uintCV, boolCV, bufferCV, stringAsciiCV, principalCV, someCV, noneCV, responseOkCV, cvToHex, cvToString } = T;
const hexToCV = (h) => T.hexToCV(/^0x/i.test(h) ? h : '0x' + h);

const DIR = path.resolve(process.argv[2]);
const GROUP = process.env.GROUP === 'G2' ? 'G2' : 'G1'; // G2 runs also exercise the listing read and the configured test token
const TEST_TOKEN = GROUP === 'G2' ? 3 : 1;
const HTML = path.join(DIR, 'canaries/build/forever-twins-launch-testcol-canary.html');
const MANIFEST_TEXT = fs.readFileSync(path.join(DIR, 'public/ft/data/testcol.manifest.json'));
const MANIFEST = JSON.parse(MANIFEST_TEXT.toString('utf8'));
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OTHER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7'; // a payee, i.e. the wrong wallet for this launch
const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7', RAPHA = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const SOURCE = 'SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.testcol';
const HELPER = DEPLOYER + '.forever-twin-testcol';
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const hex = (b) => Buffer.from(b).toString('hex');
const num = (cv) => BigInt(cv.value);
const failures = [];
const check = (ok, what) => { console.log(`${ok ? '  ok  ' : '  FAIL'} ${what}`); if (!ok) failures.push(what); };

// ---------- mock chain ----------
const S = { walletAddr: OTHER, blk: 900000, nonce: 100, txs: new Map(), contracts: new Map(), bal: new Map(), resolver: false, tamper: false, drift: false, writes: [],
  H: { canon: new Map(), finalized: false, mhash: Buffer.alloc(32), bindings: new Map(), nextXid: 5000, xowner: new Map() } };
S.contracts.set(SOURCE, '(mock source collection)');
const half = 50000n, FEE = 100000n;
const feeFor = (payer) => (payer === JIM ? 0n : half) + (payer === RAPHA ? 0n : half);
const newTx = (status, repr, events = []) => { const id = '0x' + crypto.randomBytes(32).toString('hex'); S.txs.set(id, { tx_status: status, tx_result: { repr }, block_height: ++S.blk, events }); return id; };
const principalStr = (cv) => cvToString(cv);

function callRead(contract, fn, args) {
  const H = S.H;
  if (contract === HELPER) {
    if (fn === 'get-twin-interface') return tupleCV({ 'interface-version': uintCV(3), 'collection-key': stringAsciiCV('testcol'), master: principalCV(CORE), source: principalCV(SOURCE),
      'source-asset': stringAsciiCV('testcol'), route: stringAsciiCV('standard'), group: stringAsciiCV(GROUP), 'canonical-finalized': boolCV(H.finalized), 'canonical-count': uintCV(H.canon.size),
      'manifest-hash': bufferCV(H.mhash), 'inscribed-count': uintCV(H.bindings.size), 'swaps-enabled': boolCV(true), 'large-unbound': uintCV(0), fee: uintCV(FEE), 'max-fee': uintCV(5000000),
      'payee-a': principalCV(JIM), 'payee-b': principalCV(RAPHA), 'rescue-enabled': boolCV(true), 'rescue-delay': uintCV(432), owner: principalCV(DEPLOYER), 'pending-owner': noneCV() });
    if (fn === 'get-canonical') { const c = H.canon.get(Number(num(args[0]))); return c ? someCV(tupleCV({ 'content-hash': bufferCV(c.hash), mime: stringAsciiCV(c.mime), 'total-size': uintCV(c.size), 'token-uri': stringAsciiCV(c.uri) })) : noneCV(); }
    if (fn === 'get-binding') { const b = H.bindings.get(Number(num(args[0]))); return b ? someCV(tupleCV({ 'xtrata-id': uintCV(b.xid), 'content-hash': bufferCV(b.hash), inscriber: principalCV(b.by), 'xtrata-escrowed': boolCV(true), at: uintCV(S.blk) })) : noneCV(); }
    if (fn === 'fee-for') return uintCV(feeFor(principalStr(args[0])));
    if (fn === 'get-custody-state') { const b = H.bindings.get(Number(num(args[0]))); return b ? someCV(tupleCV({ 'xtrata-id': uintCV(b.xid), 'xtrata-escrowed': boolCV(true), 'original-owner': someCV(principalCV(JIM)), 'twin-owner': someCV(principalCV(HELPER)), consistent: boolCV(true), stranded: boolCV(false) })) : noneCV(); }
  } else if (contract === CORE) {
    if (fn === 'is-paused') return boolCV(false);
    if (fn === 'quote-single-tx-fee') { const f = num(args[1]) * 1000n + 10000n; return responseOkCV(tupleCV({ 'begin-fee': uintCV(100000n), 'chunk-size': uintCV(16384n), mode: uintCV(2n), 'seal-fee': uintCV(108000n), 'single-tx-eligible': boolCV(true), 'single-tx-fee': uintCV(f), 'total-fee': uintCV(f), 'upload-batch-limit': uintCV(32n), 'upload-batches': uintCV(1n) })); }
    if (fn === 'get-owner') { const o = S.H.xowner.get(Number(num(args[0]))); return responseOkCV(o ? someCV(principalCV(o)) : noneCV()); }
  } else if (contract === SOURCE) {
    if (fn === 'get-owner') return responseOkCV(someCV(principalCV(JIM)));
    // like Megapont: the on-chain URI is a template; S.drift simulates the owner changing the base URI after the snapshot
    if (fn === 'get-token-uri') return responseOkCV(someCV(stringAsciiCV(S.drift ? 'ipfs://QmChangedBase/{id}.json' : 'ipfs://QmTestMeta/{id}.json')));
    if (fn === 'get-listing-in-ustx') return noneCV();
  }
  throw new Error('mock read not implemented: ' + contract + ' ' + fn);
}

function callWrite(contract, fn, args, sender, params) {
  const H = S.H;
  if (contract !== HELPER) throw new Error('mock write to unknown contract ' + contract);
  S.writes.push(fn);
  if (['seed-canonical', 'finalize-canonical'].includes(fn) && sender !== DEPLOYER) return ['abort_by_response', '(err u204)'];
  if (fn === 'seed-canonical') {
    if (H.finalized) return ['abort_by_response', '(err u202)'];
    for (const e of args[0].list) { const d = e.data; const id = Number(num(d.id)); if (!H.canon.has(id)) H.canon.set(id, { hash: d['content-hash'].buffer, mime: d.mime.data, size: num(d['total-size']), uri: d['token-uri'].data }); }
    return ['success', `(ok u${H.canon.size})`];
  }
  if (fn === 'finalize-canonical') {
    if (num(args[1]) !== BigInt(H.canon.size)) return ['abort_by_response', '(err u206)'];
    H.finalized = true; H.mhash = Buffer.from(args[0].buffer); return ['success', '(ok true)'];
  }
  if (fn === 'inscribe') {
    const id = Number(num(args[0])); const rec = H.canon.get(id);
    if (!H.finalized || !rec) return ['abort_by_response', '(err u200)'];
    if (H.bindings.has(id)) return ['abort_by_response', '(err u201)'];
    const bytes = Buffer.concat(args[1].list.map((c) => Buffer.from(c.buffer)));
    if (BigInt(bytes.length) !== rec.size || hex(sha(bytes)) !== hex(sha(fs.readFileSync(path.join(DIR, `testcol-files/${id}.png`))))) return ['abort_by_response', '(err u210)'];
    if (!(params.postConditions || []).length || params.postConditionMode !== 'allow') return ['abort_by_response', '(err u999 mock: expected an allow-mode call with a sender post-condition)'];
    const chunks = BigInt(args[1].list.length), core = chunks * 1000n + 10000n, events = [];
    const xfer = (from, to, amount) => events.push({ event_type: 'stx_asset', asset: { asset_event_type: 'transfer', sender: from, recipient: to, amount: String(amount) } });
    for (const p of [JIM, RAPHA]) if (p !== sender) xfer(sender, p, half);
    xfer(sender, HELPER, core); xfer(HELPER, CORE, core);
    const xid = H.nextXid++;
    H.bindings.set(id, { xid, hash: rec.hash, by: sender }); H.xowner.set(xid, HELPER);
    return ['success', `(ok u${xid})`, events];
  }
  throw new Error('mock write not implemented: ' + fn);
}

async function route(r) {
  const u = new URL(r.request().url()), p = u.pathname;
  const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(o) });
  const cors = { 'Access-Control-Allow-Origin': '*' };
  if (u.hostname === '127.0.0.1' && u.port === '8080') {
    const m = p.match(/^\/ipfs\/QmTestCid\/(\d+)\.png$/);
    if (!m) return r.fulfill({ status: 404, headers: cors, body: '' });
    const b = Buffer.from(fs.readFileSync(path.join(DIR, `testcol-files/${m[1]}.png`)));
    if (S.tamper) b[5] ^= 1;
    return r.fulfill({ status: 200, headers: cors, contentType: 'image/png', body: b });
  }
  if (/(^|\.)xtrata\.xyz$/.test(u.hostname) && p.startsWith('/ft/')) {
    if (!S.resolver) return r.fulfill({ status: 404, headers: cors, body: 'not live' });
    if (p === '/ft/data/testcol.manifest.json') return r.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: MANIFEST_TEXT });
    const m = p.match(/^\/ft\/testcol\/(\d+)\.json$/);
    if (m) return json({ properties: { original: { token_id: Number(m[1]) } } });
    return r.fulfill({ status: 404, headers: cors, body: '' });
  }
  if (!/\/hiro\//.test(p) && !/api\.(mainnet\.)?hiro\.so/.test(u.hostname)) return r.abort();
  const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
  let m;
  if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
    const args = JSON.parse(r.request().postData()).arguments.map(hexToCV);
    try { return json({ okay: true, result: cvToHex(callRead(m[1] + '.' + m[2], m[3], args)) }); } catch (e) { return json({ okay: false, cause: String(e.message) }); }
  }
  if ((m = q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))) { const s = S.contracts.get(m[1] + '.' + m[2]); return s ? json({ source: s }) : r.fulfill({ status: 404, headers: cors, body: '{}' }); }
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(S.bal.get(m[1]) ?? 100_000_000n) });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: S.nonce++ });
  if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.txs.get(m[1]); return t ? json(t) : r.fulfill({ status: 404, headers: cors, body: '{}' }); }
  return r.fulfill({ status: 404, headers: cors, body: '{}' });
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  await ctx.route(/^https?:\/\//, route);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('dialog', (d) => d.accept(d.type() === 'prompt' ? 'testcol' : undefined));
  await page.exposeFunction('__wallet', async (method, params) => {
    if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: S.walletAddr }] } };
    if (method === 'stx_deployContract') { S.contracts.set(S.walletAddr + '.' + params.name, params.clarityCode); S.writes.push('deploy'); return { result: { txid: newTx('success', '(ok true)') } }; }
    if (method === 'stx_callContract') {
      if ('sender' in params) throw new Error('stx_callContract must not carry sender');
      const res = callWrite(params.contract, params.functionName, params.functionArgs.map(hexToCV), S.walletAddr, params);
      return { result: { txid: newTx(res[0], res[1], res[2]) } };
    }
    throw Object.assign(new Error('unsupported ' + method), { code: -32601 });
  });
  await page.addInitScript(() => { window.LeatherProvider = { request: async (m, pr) => window.__wallet(m, pr) }; });
  await page.goto('file://' + HTML);
  await page.waitForSelector('[data-step="connect"]');

  const badge = (id) => page.evaluate((i) => { const b = document.querySelector(`[data-step="${i}"]`).closest('section'); return b.querySelector('.badge').textContent + '|' + (b.querySelector('.note') || { textContent: '' }).textContent; }, id);
  const runStep = async (id, { chooser = false } = {}) => {
    await page.click(`[data-step="${id}"]`, { timeout: 20000 });
    if (chooser) { await page.waitForSelector('.chooser__item', { timeout: 15000 }); await page.click('.chooser__item'); }
    const t0 = Date.now(); let b = '';
    for (;;) {
      await page.waitForTimeout(400);
      b = await badge(id);
      if (/^(pass|fail)/.test(b)) break;
      if (Date.now() - t0 > 240000) { b = 'TIMEOUT|' + b; break; }
    }
    console.log(id.padEnd(10), b.slice(0, 420));
    return b;
  };
  const passes = (b) => b.startsWith('pass');

  // 1. wrong wallet is refused, right wallet connects
  let b = await runStep('connect', { chooser: true });
  check(b.startsWith('fail') && /must be signed by/.test(b), 'wrong wallet refused');
  S.walletAddr = DEPLOYER;
  b = await runStep('connect', { chooser: true }); check(passes(b), 'connect with the Xtrata wallet');
  S.drift = true;
  b = await runStep('preflight'); check(b.startsWith('fail') && /token URIs have changed since the manifest snapshot/.test(b), 'preflight refuses when the source token URIs changed after the snapshot');
  S.drift = false;
  b = await runStep('preflight'); check(passes(b) && /name is free/.test(b) && /resolver manifest not live/.test(b) && /unchanged since the snapshot/.test(b), 'preflight passes, notes resolver not live and URIs unchanged');
  if (GROUP === 'G2') check(/get-listing-in-ustx readable/.test(b), 'G2 preflight confirms the listing read works');
  b = await runStep('deploy'); check(passes(b) && S.contracts.has(HELPER), 'deploy sends the helper');
  b = await runStep('verify'); check(passes(b), 'verify matches config (payees, fee, ceiling, owner)');
  await page.selectOption('#seed-batch', '25');
  b = await runStep('seed'); check(passes(b) && S.H.canon.size === 60 && /3 batch/.test(b), 'seed writes 60 records in 3 batches');
  b = await runStep('audit'); check(passes(b), 'audit reads back all 60 records');

  // 2. finalise is blocked until the resolver serves the exact manifest, then needs the typed key
  b = await runStep('finalise'); check(b.startsWith('fail') && /resolver does not serve/.test(b) && !S.H.finalized, 'finalise blocked while the resolver is not live');
  S.resolver = true;
  S.drift = true;
  b = await runStep('finalise'); check(b.startsWith('fail') && /token URIs have changed/.test(b) && !S.H.finalized, 'finalise blocked when the source token URIs changed since the snapshot');
  S.drift = false;
  b = await runStep('finalise'); check(passes(b) && S.H.finalized && hex(S.H.mhash) === hex(sha(MANIFEST_TEXT)), 'finalise succeeds with the exact manifest hash');

  // 3. test inscription: tampered file refused before signing, then the real one
  S.tamper = true;
  const before = S.writes.length;
  b = await runStep('inscribe'); check(b.startsWith('fail') && /sha256 does not match/.test(b) && S.writes.length === before, 'tampered file refused before anything is signed');
  S.tamper = false;
  b = await runStep('inscribe'); check(passes(b) && S.H.bindings.has(TEST_TOKEN) && /Xtrata #5000/.test(b), `test inscription of #${TEST_TOKEN} verified (binding, custody, owner)`);
  const tx = [...S.txs.values()].find((t) => t.tx_result.repr === '(ok u5000)');
  const sent = tx.events.filter((e) => e.asset.sender === DEPLOYER);
  check(sent.some((e) => e.asset.recipient === JIM && e.asset.amount === '50000') && sent.some((e) => e.asset.recipient === RAPHA && e.asset.amount === '50000'), 'non-payee wallet paid 0.05 STX to each payee');
  b = await runStep('handoff'); check(passes(b), 'hand-off built');
  const text = await page.$eval('textarea', (t) => t.value);
  check(text.includes(HELPER) && text.includes(hex(sha(MANIFEST_TEXT))) && /"status": "live"/.test(text), 'hand-off names the helper, the manifest hash and a registry entry');

  // 4. forget local progress: everything is re-found on chain, nothing is sent twice
  const writes = S.writes.length;
  await page.click('#forget'); await page.waitForTimeout(500);
  for (const id of ['connect']) { b = await runStep(id, { chooser: true }); check(passes(b), 're-connect after forgetting progress'); }
  b = await runStep('preflight'); check(passes(b) && /already deployed/.test(b), 'preflight finds the deployed helper');
  b = await runStep('deploy'); check(passes(b) && /nothing to send/.test(b), 'deploy sends nothing the second time');
  b = await runStep('verify'); check(passes(b), 'verify passes on a finalised helper');
  await page.selectOption('#seed-batch', '25');
  b = await runStep('seed'); check(passes(b) && /3 already on chain/.test(b), 'seed skips all batches already on chain');
  b = await runStep('audit'); check(passes(b), 'audit passes again');
  b = await runStep('finalise'); check(passes(b) && /already finalised/.test(b), 'finalise recognises the finalised helper');
  b = await runStep('inscribe'); check(b.startsWith('fail') && /already inscribed/.test(b), 'test inscription refuses a token that is already inscribed');
  check(S.writes.length === writes, 'no transactions were sent during the re-run');
  check(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));

  await browser.close();
  console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL MOCK-CHAIN CHECKS PASSED');
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error('test crashed:', e); process.exit(2); });

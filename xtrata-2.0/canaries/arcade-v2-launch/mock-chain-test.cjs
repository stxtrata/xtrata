// Mock-chain run of the arcade v2 launch canary, end to end, against REAL contracts.
//
//   NODE_PATH=<dir with playwright> CHROME_PATH=<chromium> \
//     node canaries/arcade-v2-launch/mock-chain-test.cjs [canaries/build/arcade-v2-launch-canary.html]
//
// The chain is a clarinet-sdk simnet (needs `npm install` in contracts/arcade-world). Every contract the canary touches runs
// there as real Clarity at the address the canary expects: the mainnet core xtrata-v3-2-3 (with xtrata-v1-1-1, xtrata-v2-1-0
// and the SIP-009 trait it implements), the leaderboard xtrata-arcade-scores-v2, and xtrata-world-v2, xtrata-posters-v1 and
// xtrata-screen-v1 once the canary deploys them from the stub wallet. Only the network around the chain is mocked: the Hiro
// API routes (read-only calls, sources, balances, nonces, the mempool, tx status, contract events, raw broadcasts) and the
// xtrata.xyz gateway are answered from the simnet. Deny-mode post-conditions are checked against each call's STX events.
//
// The chain starts where mainnet is: #55 owned by the root wallet, the v1.3 bundle at #3078, an earlier engine pack #3110 and
// parent #3111, the 26 boards on #3111, and none of the three new contracts. The web wallet is a stub Leather provider that
// refuses `0x` post-conditions and `sender`. Scenarios:
//   1. a wrong wallet is refused at preflight and nothing is sent;
//   2. a fresh run passes every step; the wallet signatures per step are counted and compared with the README; the registry
//      holds exactly the launch plan (ops/lib/v2-plan.mjs launchCalls) and the canary's own reads avoid get-objects;
//   3. the parent it inscribed boots from the mock chain with the registry config and shows four poster bays;
//   4. a re-run after "Forget local progress" sends nothing and pays nothing.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { createRequire } = require('module');

const ROOTDIR = path.resolve(__dirname, '../..');
const AW = path.join(ROOTDIR, 'contracts/arcade-world');
const rqRoot = createRequire(path.join(ROOTDIR, 'package.json'));
const rqAW = createRequire(path.join(AW, 'package.json'));
const T = rqRoot('@stacks/transactions');            // v6, as the canary
const V7 = rqAW('@stacks/transactions');             // v7, as the simnet
const { initSimnet } = rqAW('@stacks/clarinet-sdk');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = createRequire('/opt/npm-tools/node_modules/')('playwright')); }
const { Cl } = V7;

const HTML = path.resolve(process.argv[2] || path.join(ROOTDIR, 'canaries/build/arcade-v2-launch-canary.html'));
const XA = path.join(ROOTDIR, 'recursive-apps/xtrata-arcade');
const BUNDLE = fs.readFileSync(path.join(XA, 'release/xtrata-arcade.html'));
const BOARDS = JSON.parse(fs.readFileSync(path.join(XA, 'boards.json'), 'utf8'));
const LIVE = (f) => fs.readFileSync(path.join(ROOTDIR, 'contracts/live', f), 'utf8');
// TESTNET=1: the rehearsal. The chain holds only the testnet SIP-009 trait: the canary deploys the core itself (step 1b),
// inscribes the bundle (read from the mainnet gateway, hash-checked) and a stand-in for #55, deploys the leaderboard with the
// other contracts, and boots its mainnet-shaped parent with the reads pointed at the testnet core.
const TESTNET = !!process.env.TESTNET;
const NET = TESTNET ? 'testnet' : 'mainnet';
const ROOT = TESTNET ? 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQPAYDW7J' : 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const ROYALTY = 'SP1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2XG1V316';   // the core's fee recipient here, so "pay at most" post-conditions see real STX
const WRONG = 'SP2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CH94GRJ';      // any other wallet
const TRAIT = TESTNET ? 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT' : 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
const CORE = ROOT + '.xtrata-v3-2-3';
const SCORES = ROOT + '.xtrata-arcade-scores-v2';
const NEW = ['xtrata-world-v2', 'xtrata-posters-v1', 'xtrata-screen-v1'];
const CHUNK = 16384;
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const chunksOf = (buf) => { const out = []; for (let i = 0; i < buf.length; i += CHUNK) out.push(buf.subarray(i, i + CHUNK)); return out; };
const runHash = (chunks) => chunks.reduce((h, c) => sha(Buffer.concat([h, c])), Buffer.alloc(32));
const hex0 = (h) => (h.startsWith('0x') ? h : '0x' + h);
const pp = (cv) => Cl.prettyPrint(cv);

let simnet;
// The simnet prints every Clarity `print` to stdout; keep the test output readable.
const muted = (fn) => { const a = console.log, b = process.stdout.write, c = console.error; console.log = () => {}; console.error = () => {}; process.stdout.write = () => true; try { return fn(); } finally { console.log = a; console.error = c; process.stdout.write = b; } };
const S = {
  sources: new Map(), tx: new Map(), events: new Map(), nonce: 7, txn: 0,
  sigs: {}, current: '', readFails: [], walletCalls: 0, raw: 0, deploys: [], calls: [], violations: [], gateway: 0, reads: [],
  address: ROOT
};
const newTx = (status, repr) => { const id = '0x' + sha('tx' + (++S.txn)).toString('hex'); S.tx.set(id, { tx_status: status, tx_result: { repr }, block_height: simnet.blockHeight }); return id; };
const stxSent = (events, who) => events.filter((e) => e.event === 'stx_transfer_event' && e.data.sender === who).reduce((n, e) => n + BigInt(e.data.amount), 0n);
const recordEvents = (events) => {
  for (const e of events) if (e.event === 'print_event') {
    const id = e.data.contract_identifier;
    if (!S.events.has(id)) S.events.set(id, []);
    S.events.get(id).unshift({ event_type: 'smart_contract_log', contract_log: { contract_id: id, topic: 'print', value: { hex: e.data.raw_value, repr: '' } } });
  }
};
// Deny mode: every STX the sender moves must be covered by a "send at most" post-condition (the canary uses no others).
function checkPcs(label, events, sender, pcs) {
  const sent = stxSent(events, sender);
  const cap = pcs.filter((p) => p.conditionCode === T.FungibleConditionCode.LessEqual).reduce((n, p) => n + BigInt(p.amount), 0n);
  if (sent > 0n && (!pcs.length || sent > cap)) S.violations.push(`${label}: sent ${sent} µSTX, post-conditions allow ${pcs.length ? cap : 'nothing'}`);
}
function exec(contract, fn, argsV7, sender, pcs, label) {
  S.calls.push({ step: S.current, sender, fn: `${contract.split('.')[1]}.${fn}` });
  let r;
  try { r = muted(() => simnet.callPublicFn(contract, fn, argsV7, sender)); } catch (e) { return newTx('abort_by_response', `(runtime ${String(e.message || e).slice(0, 80)})`); }
  recordEvents(r.events);
  checkPcs(label || fn, r.events, sender, pcs);
  return newTx(r.result.type === 'ok' ? 'success' : 'abort_by_response', pp(r.result));
}
function deploy(name, code, version, sender) {
  const r = muted(() => simnet.deployContract(name, code, { clarityVersion: version }, sender));
  S.sources.set(`${sender}.${name}`, code);
  return r;
}
const readOnly = (contract, fn, args, sender = ROOT) => muted(() => simnet.callReadOnlyFn(contract, fn, args, sender)).result;
const call = (contract, fn, args, sender = ROOT) => { const r = muted(() => simnet.callPublicFn(contract, fn, args, sender)); if (r.result.type !== 'ok') throw new Error(`${fn}: ${pp(r.result)}`); return r.result; };
const bytesCache = new Map();
function inscriptionBytes(id) {
  if (bytesCache.has(id)) return bytesCache.get(id);
  const meta = readOnly(CORE, 'get-inscription-meta', [Cl.uint(id)]);
  if (meta.type !== 'some') return null;
  const n = Number(meta.value.value['total-chunks'].value), out = [];
  for (let i = 0; i < n; i++) out.push(Buffer.from(V7.hexToCV(V7.cvToHex(readOnly(CORE, 'get-chunk', [Cl.uint(id), Cl.uint(i)]))).value.value, 'hex'));
  const b = Buffer.concat(out); bytesCache.set(id, b); return b;
}
const mint = (bytes, mime, sender = ROOT, deps = [], parents = []) => {
  const ch = chunksOf(bytes);
  const r = call(CORE, 'mint-single-tx-with-relationships', [Cl.buffer(runHash(ch)), Cl.stringAscii(mime), Cl.uint(bytes.length), Cl.list(ch.map((c) => Cl.buffer(c))), Cl.stringAscii('data:x'), Cl.list(deps.map((d) => Cl.uint(d))), Cl.list(parents.map((p) => Cl.uint(p)))], sender);
  return Number(r.value.value['token-id'].value);
};

async function setupChain() {
  const t0 = Date.now();
  simnet = await initSimnet(path.join(__dirname, 'simnet/Clarinet.toml'));
  const dep = simnet.getAccounts().get('deployer');
  muted(() => { simnet.transferSTX(10_000_000_000_000n, ROOT, dep); simnet.transferSTX(1_000_000n, TRAIT, dep); simnet.transferSTX(1_000_000_000n, WRONG, dep); });
  deploy('nft-trait', fs.readFileSync(path.join(ROOTDIR, 'contracts/clarinet/contracts/sip009-nft-trait.clar'), 'utf8'), 2, TRAIT);
  if (TESTNET) { console.log(`simnet ready in ${((Date.now() - t0) / 1000).toFixed(1)}s: testnet, only the SIP-009 trait at ${TRAIT}; root ${ROOT} funded`); return; }
  deploy('xtrata-v1-1-1', LIVE('xtrata-v1.1.1.clar'), 3, ROOT);
  deploy('xtrata-v2-1-0', LIVE('xtrata-v2.1.0.clar'), 3, ROOT);
  deploy('xtrata-v3-2-3', LIVE('xtrata-v3.2.3.clar'), 3, ROOT);
  call(CORE, 'set-paused', [Cl.bool(false)]);
  call(CORE, 'set-royalty-recipient', [Cl.principal(ROYALTY)]);
  call(CORE, 'set-next-id', [Cl.uint(55)]);
  if (mint(Buffer.from('<p>#55</p>'), 'text/html') !== 55) throw new Error('#55');
  for (let i = 56; i < 3078; i++) mint(Buffer.from(`filler ${i}`), 'text/plain');
  // #3078: the v1.3 bundle, staged as it was on mainnet
  const ch = chunksOf(BUNDLE), h = runHash(ch);
  call(CORE, 'begin-or-get', [Cl.buffer(h), Cl.stringAscii('text/html'), Cl.uint(BUNDLE.length), Cl.uint(ch.length)]);
  for (let i = 0; i < ch.length; i += 30) call(CORE, 'add-chunk-batch', [Cl.buffer(h), Cl.list(ch.slice(i, i + 30).map((c) => Cl.buffer(c)))]);
  const sealed = call(CORE, 'seal-inscription', [Cl.buffer(h), Cl.stringAscii('data:x')]);
  if (Number(sealed.value.value ?? sealed.value) !== 3078 && pp(sealed) !== '(ok u3078)') throw new Error('bundle id ' + pp(sealed));
  for (let i = 3079; i < 3110; i++) mint(Buffer.from(`filler ${i}`), 'text/plain');
  if (mint(Buffer.from('/*@xa-pack engine v1*/ an earlier engine'), 'text/plain', ROOT, [], [55]) !== 3110) throw new Error('#3110');
  if (mint(Buffer.from('<!doctype html><title>arcade v1.5 parent</title>'), 'text/html', ROOT, [3078, 3110], [55]) !== 3111) throw new Error('#3111');
  // the leaderboard, live since v1.0, every board on #3111
  deploy('xtrata-arcade-scores-v2', fs.readFileSync(path.join(ROOTDIR, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8'), 4, ROOT);
  for (const b of BOARDS) call(SCORES, 'set-board', [Cl.stringAscii(b.id), Cl.uint(b.mode), Cl.uint(b.max), Cl.uint(0), Cl.uint(3111), Cl.bool(false), Cl.bool(true)]);
  console.log(`simnet ready in ${((Date.now() - t0) / 1000).toFixed(1)}s: core ${CORE} (next id ${pp(readOnly(CORE, 'get-next-token-id', []))}), #3078 = the v1.3 bundle, 26 boards on #3111, burn height ${simnet.burnBlockHeight}`);
}

// ---------- the Hiro API and the gateway, answered from the simnet ----------
async function route(r) {
  const u = new URL(r.request().url()), p = u.pathname;
  const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(o) });
  if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } });
  if (/xtrata\.xyz$/.test(u.hostname) && p.startsWith('/i/')) {
    const id = Number(p.slice(3)); S.gateway++;
    // the testnet rehearsal reads mainnet's #3078 through the gateway (the canary checks its hash)
    if (TESTNET) return id === 3078 ? r.fulfill({ contentType: 'text/html', headers: { 'Access-Control-Allow-Origin': '*' }, body: BUNDLE }) : r.fulfill({ status: 404, body: '' });
    const b = inscriptionBytes(id);
    return b ? r.fulfill({ contentType: 'text/html', headers: { 'Access-Control-Allow-Origin': '*' }, body: b }) : r.fulfill({ status: 404, body: '' });
  }
  if (!/\/hiro\//.test(p) && !/api\.(mainnet\.|testnet\.)?hiro\.so/.test(u.hostname)) return r.abort();
  const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
  let m;
  if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
    const body = JSON.parse(r.request().postData());
    S.reads.push({ fn: `${m[2]}.${m[3]}`, step: S.current });
    try {
      const res = readOnly(`${m[1]}.${m[2]}`, m[3], body.arguments.map((h) => V7.hexToCV(hex0(h))), body.sender);
      return json({ okay: true, result: V7.cvToHex(res) });
    } catch (e) { S.readFails.push(`${m[2]}.${m[3]}: ${String(e.message || e).slice(0, 160)}`); return json({ okay: false, cause: String(e.message || e).slice(0, 200) }); }
  }
  if (q === '/v2/info') return json({ burn_block_height: simnet.burnBlockHeight, stacks_tip_height: simnet.blockHeight });
  if ((m = q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))) { const s = S.sources.get(`${m[1]}.${m[2]}`); return s ? json({ source: s, publish_height: 1 }) : json({}, 404); }
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(simnet.getAssetsMap().get('STX')?.get(m[1]) ?? 0n) });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: S.nonce++ });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/mempool/))) return json({ total: 0, results: [] });
  if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.tx.get(m[1]); return t ? json(t) : json({}, 404); }
  if ((m = q.match(/^\/extended\/v1\/contract\/([^/]+)\/events$/))) {
    const all = S.events.get(m[1]) || [], off = Number(u.searchParams.get('offset') || 0), lim = Number(u.searchParams.get('limit') || 20);
    return json({ limit: lim, offset: off, results: all.slice(off, off + lim) });
  }
  if (q === '/v2/transactions') {
    const tx = T.deserializeTransaction(r.request().postDataBuffer().toString('hex'));
    const ver = tx.version === T.TransactionVersion.Mainnet ? 22 : 26;
    const sender = T.addressToString(T.addressFromVersionHash(ver, tx.auth.spendingCondition.signer));
    S.raw++;
    let id;
    if (tx.payload.payloadType === T.PayloadType.ContractCall) {
      const contract = T.addressToString(tx.payload.contractAddress) + '.' + tx.payload.contractName.content;
      const args = tx.payload.functionArgs.map((a) => V7.hexToCV(T.cvToHex(a)));
      id = exec(contract, tx.payload.functionName.content, args, sender, tx.postConditions.values, `${sender.slice(0, 6)} ${tx.payload.functionName.content}`);
    } else {
      const to = T.cvToString(tx.payload.recipient), amt = BigInt(tx.payload.amount);
      const res = muted(() => simnet.transferSTX(amt, to, sender));
      id = newTx(res.result.type === 'ok' ? 'success' : 'abort_by_response', pp(res.result));
    }
    return json(id.slice(2));
  }
  return json({}, 404);
}

(async () => {
  if (!fs.existsSync(HTML)) throw new Error(`${HTML} not found: run npm run build:canary:arcade-v2-launch first`);
  await setupChain();
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 }, acceptDownloads: true });
  await ctx.route(/^https?:\/\//, route);
  const page = await ctx.newPage();
  const errs = [];
  const results = { failed: null, checks: 0 };
  const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (ok) results.checks++; else if (!results.failed) results.failed = what; };
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('dialog', (d) => d.accept());
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|permissions policy|WebGL|GPU|AudioContext|404|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await page.exposeFunction('__wallet', async (method, params) => {
    if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: S.address }] } };
    if (method === 'stx_callContract') {
      S.walletCalls++; S.sigs[S.current] = (S.sigs[S.current] || 0) + 1;
      if ('sender' in params) throw new Error('stx_callContract must not carry sender');
      if (params.postConditionMode !== 'deny') throw new Error('post-condition mode must be deny');
      for (const pc of params.postConditions || []) if (/^0x/i.test(pc)) throw new Error('Not a serialized post condition'); // what Leather says about 0x
      const pcs = (params.postConditions || []).map((h) => T.deserializePostCondition(new T.BytesReader(Buffer.from(h, 'hex'))));
      const id = exec(params.contract, params.functionName, params.functionArgs.map((h) => V7.hexToCV(hex0(h))), S.address, pcs, `wallet ${params.functionName}`);
      return { result: { txid: id } };
    }
    if (method === 'stx_deployContract') {
      S.walletCalls++; S.sigs[S.current] = (S.sigs[S.current] || 0) + 1;
      S.deploys.push({ name: params.name, version: params.clarityVersion, sha: sha(params.clarityCode).toString('hex') });
      let ok = true;
      try { deploy(params.name, params.clarityCode, params.clarityVersion, S.address); } catch (e) { ok = false; console.log(`  deploy ${params.name} failed: ${String(e.message || e).slice(0, 300)}`); }
      return { result: { txid: newTx(ok ? 'success' : 'abort_by_response', ok ? '(ok true)' : '(err none)') } };
    }
    if (method === 'stx_transferStx') {
      S.walletCalls++; S.sigs[S.current] = (S.sigs[S.current] || 0) + 1;
      const res = muted(() => simnet.transferSTX(BigInt(params.amount), params.recipient, S.address));
      return { result: { txid: newTx(res.result.type === 'ok' ? 'success' : 'abort_by_response', pp(res.result)) } };
    }
    throw Object.assign(new Error('unsupported ' + method), { code: -32601 });
  });
  await page.addInitScript(() => { window.LeatherProvider = { request: async (m, pr) => window.__wallet(m, pr) }; });
  await page.goto('file://' + HTML);
  await page.waitForTimeout(800);
  if (TESTNET) { await page.selectOption('#network', 'testnet'); await page.waitForTimeout(500); }

  const noteOf = (id) => page.evaluate((i) => { const b = document.querySelector(`[data-step="${i}"]`).closest('section'); return b.querySelector('.badge').textContent + '|' + (b.querySelector('.note') || { textContent: '' }).textContent; }, id);
  const runSteps = async (list, { quietLog = false } = {}) => {
    for (const id of list) {
      S.current = id;
      await page.click(`[data-step="${id}"]`, { timeout: 20000 });
      if (id === 'connect') { await page.waitForSelector('.chooser__item', { timeout: 15000 }); await page.click('.chooser__item'); }
      const t0 = Date.now(); let badge = '';
      for (;;) {
        await page.waitForTimeout(400);
        badge = await noteOf(id);
        if (/^(pass|fail)/.test(badge)) break;
        if (Date.now() - t0 > 600000) { badge = 'TIMEOUT|' + badge; break; }
      }
      if (!quietLog) console.log(`${id.padEnd(12)} ${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s ${badge.slice(0, 700)}`);
      if (!badge.startsWith('pass')) return { failed: id, badge };
    }
    return { failed: null };
  };
  const ids = await page.$$eval('[data-step]', (els) => els.map((e) => e.getAttribute('data-step')));
  console.log(`steps (${ids.length}): ${ids.join(', ')}`);

  // ---- 1. the wrong wallet is refused at preflight ----
  if (!TESTNET) {
  console.log('-- 1. a wallet that is not the root owner');
  S.address = WRONG;
  const w = await runSteps(['connect', 'preflight']);
  const wrongNote = (await noteOf('preflight')).split('|')[1] || '';
  check(w.failed === 'preflight', 'preflight fails for a wallet that is not the root owner');
  check(/not the root owner/.test(wrongNote) && /root owner AND|root owner and the treasury/.test(wrongNote) && /epoch/.test(wrongNote), 'and explains why (the H1 rule: deployer = root owner and treasury, spaces owned by their creator, epochs)');
  check(S.walletCalls === 0 && S.raw === 0 && S.deploys.length === 0, 'nothing was signed or sent');
  // a fresh page for the real run (the wrong wallet's connection must not carry over)
  S.address = ROOT;
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^xtrata-arcade-v2-launch:v1:/.test(k)) localStorage.removeItem(k); });
  await page.reload(); await page.waitForTimeout(800);
  }

  // ---- 2. a fresh run ----
  console.log('-- 2. a fresh run from the root wallet');
  const t2 = Date.now();
  const fresh = await runSteps(ids);
  check(!fresh.failed, `every step passed (${((Date.now() - t2) / 1000).toFixed(0)}s)${fresh.failed ? `: stopped at ${fresh.failed}: ${fresh.badge.slice(0, 300)}` : ''}`);
  const parentId = await page.evaluate((net) => { for (const k of Object.keys(localStorage)) if (k.startsWith(`xtrata-arcade-v2-launch:v1:${net}:`)) return JSON.parse(localStorage.getItem(k)).inscriptionId || null; return null; }, NET);
  const hot = await page.evaluate(() => document.querySelector('#hot').textContent.split(' ')[0]);
  if (!fresh.failed) {
    const expected = TESTNET
      ? { connect: 0, preflight: 0, core: 3, fixtures: 1 + 2 + Math.ceil(chunksOf(BUNDLE).length / 30), deploy: 4, kinds: 3, hall: 8, setup: 0, registry: 0, 'pack-engine': 1, 'pack-hall': 1, parent: 1, release: 0, board: 1, submit: 1, fund: 1, copy: 0, sweep: 0, close: 1, boardwallet: 1, handover: 1, production: 0, handback: 1, ownership: 0, audit: 0 }
      : { connect: 0, preflight: 0, deploy: 3, kinds: 3, hall: 8, setup: 0, registry: 0, 'pack-engine': 1, 'pack-hall': 1, parent: 1, release: 0, board: 1, submit: 1, fund: 1, copy: 0, sweep: 0, close: 1, boardwallet: 1, handover: 1, production: 0, handback: 1, ownership: 0, audit: 0 };
    const got = Object.fromEntries(ids.map((i) => [i, S.sigs[i] || 0]));
    console.log('  wallet signatures per step: ' + ids.map((i) => `${i} ${got[i]}`).join(', ') + ` · total ${S.walletCalls}`);
    check(JSON.stringify(got) === JSON.stringify(expected), `signatures per step match the README (${Object.values(expected).reduce((a, b) => a + b, 0)} in all)`);
    if (TESTNET) check(['xtrata-v1-1-1', 'xtrata-v2-1-0', 'xtrata-v3-2-3'].every((n, i) => S.deploys[i] && S.deploys[i].name === n && S.deploys[i].version === 3), 'testnet: the canary deployed the core trio first, in order, at Clarity 3');
    const fresh3 = S.deploys.filter((d) => NEW.includes(d.name) || d.name === 'xtrata-arcade-scores-v2');
    check(fresh3.length === (TESTNET ? 4 : 3) && fresh3.every((d) => d.version === 4) && NEW.every((n) => fresh3.some((d) => d.name === n)), `the three contracts${TESTNET ? ' and the leaderboard' : ''} were deployed at Clarity 4 from the root wallet`);
    const W2 = ROOT + '.xtrata-world-v2';
    const v = (fn, args = []) => V7.cvToValue(readOnly(W2, fn, args), true);
    const root = readOnly(W2, 'get-root', []);
    check(pp(root) === `{ owner: '${ROOT}, paused: false, pending: none, treasury: '${ROOT} }`, `registry root owner and treasury are the root wallet: ${pp(root)}`);
    check(Number(v('get-kind-count')) === 24, 'the registry holds exactly 24 kinds');
    const kinds = S.calls.filter((c) => c.fn === 'xtrata-world-v2.register-kind');
    check(kinds.length === 24 && kinds.every((c) => c.sender === hot), `all 24 register-kind calls were signed by the temporary KINDS admin ${hot}`);
    check(pp(readOnly(W2, 'get-admin', [Cl.principal(hot)])) === 'u0', 'the temporary wallet is no longer a registry admin');
    const hall = readOnly(W2, 'resolve-path', [Cl.list([Cl.stringAscii('arcade'), Cl.stringAscii('hall')])]);
    const lobby = readOnly(W2, 'resolve-path', [Cl.list([Cl.stringAscii('arcade'), Cl.stringAscii('lobby')])]);
    check(pp(hall) === '(some u3)' && pp(lobby) === 'none', `arcade/hall resolves to space 3 and there is no lobby (${pp(hall)}, ${pp(lobby)})`);
    const sp = readOnly(W2, 'get-space', [Cl.uint(3)]).value.value;
    check(pp(sp.owner) === `'${ROOT}` && pp(sp.state) === 'u1' && pp(sp.objects) === 'u4', `the hall is owned by the root wallet, live, with 4 objects (${pp(sp.owner)}, state ${pp(sp.state)}, ${pp(sp.objects)})`);
    const bays = [4, 5, 6, 7].map((id) => readOnly(W2, 'get-object-view', [Cl.uint(id)]).value.value);
    check(bays.every((b, i) => b.object.value.name.value === `bay-${i}` && pp(b.active) === 'none') && [4, 5, 6, 7].every((id) => pp(readOnly(W2, 'get-state-count', [Cl.uint(id)])) === 'u0'), 'bay-0..bay-3 are objects 4..7 with no states (a bay with no state shows its posters)');
    const heavy = S.reads.filter((r) => /^xtrata-world-v2\.(get-objects|get-children)$/.test(r.fn) && r.step !== 'registry' && r.step !== 'release');
    check(heavy.length === 0, `the canary's own registry reads use the light pages, never get-objects / get-children${heavy.length ? ` (${heavy.length} in ${[...new Set(heavy.map((r) => r.step))].join(', ')})` : ''}`);
    const hallHeavy = S.reads.filter((r) => /^xtrata-world-v2\.get-objects$/.test(r.fn)).length;
    console.log(`  note: the hall's own reader (world2.js, run in the registry and release steps) made ${hallHeavy} get-objects reads`);
    check(S.violations.length === 0, `every STX movement was covered by a deny-mode post-condition${S.violations.length ? ': ' + S.violations.join('; ') : ''}`);
    check(pp(readOnly(SCORES, 'get-owner', [])) === `'${ROOT}` && BOARDS.every((b) => pp(readOnly(SCORES, 'get-board', [Cl.stringAscii(b.id)])).includes(`engine-id: u${parentId}`)), `the leaderboard is back with the root wallet and all 26 boards are on #${parentId}`);
    const hotBal = simnet.getAssetsMap().get('STX')?.get(hot) ?? 0n;
    check(hotBal <= 5000n, `the temporary wallet was swept (holds ${hotBal} µSTX)`);
  }
  console.log(`  page errors: ${JSON.stringify(errs.slice(0, 4))}`);

  // ---- 3. boot the parent the canary inscribed, from the mock chain only ----
  if (!results.failed && parentId && !TESTNET) {
    console.log(`-- 3. boot parent #${parentId} from the mock chain`);
    const boot = await ctx.newPage();
    const berrs = [];
    boot.on('pageerror', (e) => berrs.push(e.message)); boot.on('console', (m) => { if (/world|xa:/i.test(m.text())) console.log('  [hall console] ' + m.text().slice(0, 300)); });
    const readsBefore = S.reads.length;
    await boot.goto(`https://xtrata.xyz/i/${parentId}`);
    await boot.waitForFunction(() => window.XA && window.XA.games && window.XA.games.length === 21 && window.XA.wallState && window.XA.wallState().length >= 27 && window.XA.wallState().every((s) => s.head !== null) && !document.getElementById('xa-load'), null, { timeout: 240000 });
    await boot.waitForTimeout(3000);
    // the world reader loads after the hall starts: give it time, then report any read the chain refused
    await boot.waitForFunction(() => window.XAWorld && window.XAWorld.snapshot(), null, { timeout: 90000 }).catch(() => {});
    if (S.readFails.length) console.log(`  refused reads so far: ${S.readFails.length}, last: ${JSON.stringify(S.readFails.slice(-4))}`);
    const info = await boot.evaluate(() => ({
      world: window.XA_WORLD_CONFIG, mode: window.XAWorld.mode(), enabled: window.XAWorld.enabled(), cfg: window.XAWorld.config(),
      wall: window.XA.wallState().map((s) => ({ head: s.head, shown: s.shown, chain: s.chain })),
      bays: window.XA.bayState && window.XA.bayState() ? window.XA.bayState().bays.slice(0, 4).map((b) => (b && b.plan ? { base: b.plan.base, layers: (b.plan.overlays || []).length + (b.plan.cover ? 1 : 0) } : null)) : null,
      snap: window.XAWorld.snapshot() ? { src: window.XAWorld.snapshot().src, bays: (window.XAWorld.snapshot().bays || []).length } : null
    }));
    const reads = S.reads.slice(readsBefore).map((r) => r.fn);
    const want = { posters: ROOT + '.xtrata-posters-v1', registry: ROOT + '.xtrata-world-v2', screen: ROOT + '.xtrata-screen-v1' };
    check(JSON.stringify(info.world) === JSON.stringify(want), `the parent hands the hall XA_WORLD_CONFIG = ${JSON.stringify(info.world)}`);
    check(info.mode === 2 && info.enabled && info.cfg.registry === want.registry, 'the hall\'s world reader is on the registry (mode 2)');
    check(reads.some((x) => /^xtrata-world-v2\.(resolve-path|get-objects)/.test(x)) && reads.some((x) => /^xtrata-world-v2\.get-object-view/.test(x)), `the hall read the registry from the chain (${reads.filter((x) => /world-v2/.test(x)).length} reads)`);
    check(reads.some((x) => /^xtrata-posters-v1\./.test(x)) && reads.some((x) => /^xtrata-screen-v1\./.test(x)), 'and the poster and screen contracts');
    const BAY_SLOTS = { L: [12, 13], R: [25, 26], NL: [0, 1], NR: [14, 15] };
    check(info.wall.length === 27 && Object.values(BAY_SLOTS).flat().every((i) => info.wall[i].shown), 'all four bays show their posters (the poster slots in every bay are shown)');
    check(info.snap && info.snap.src === want.registry && info.snap.bays === 4, `the hall's snapshot came from the registry with 4 bays (${JSON.stringify(info.snap)})`);
    check(Array.isArray(info.bays) && info.bays.every((b) => b === null || (b.base === 'posters' && b.layers === 0)), `no bay draws anything but posters (${JSON.stringify(info.bays)})`);
    check(berrs.length === 0, `the parent booted without page errors ${JSON.stringify(berrs.slice(0, 3))}`);
    await boot.close();
  }

  // ---- 4. re-run after forgetting local progress: nothing is sent ----
  if (!results.failed) {
    console.log('-- 4. re-run after "Forget local progress"');
    await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^xtrata-arcade-v2-launch:v1:/.test(k)) localStorage.removeItem(k); });
    await page.reload(); await page.waitForTimeout(800);
    const wc = S.walletCalls, raw = S.raw, calls = S.calls.length, deploys = S.deploys.length;
    const again = await runSteps(ids);
    check(!again.failed, `every step passed again${again.failed ? `: stopped at ${again.failed}: ${again.badge.slice(0, 300)}` : ''}`);
    check(S.walletCalls === wc && S.raw === raw && S.calls.length === calls && S.deploys.length === deploys, `the re-run signed and sent nothing (wallet ${S.walletCalls - wc}, raw ${S.raw - raw}, calls ${S.calls.length - calls}, deploys ${S.deploys.length - deploys})`);
    const reused = await page.evaluate(() => [...document.querySelectorAll('.note')].reduce((k, n) => k + (n.textContent.match(/re-used, nothing sent/g) || []).length, 0));
    const caught = await page.evaluate(() => [...document.querySelectorAll('.note')].filter((n) => /nothing sent|nothing to send|already deployed|already closed|already ran|already refused|earlier session/.test(n.textContent)).length);
    check(reused === (TESTNET ? 5 : 3), `the ${TESTNET ? 'fixtures, the ' : ''}packs and the parent were found on chain by hash and re-used (${reused})`);
    console.log(`  ${caught} step notes say the work was already done`);
  }
  console.log(`  page errors: ${JSON.stringify(errs.slice(0, 4))}`);
  check(errs.length === 0, 'no page errors in the canary');
  await browser.close();
  if (results.failed) { console.log(`FAILED: ${results.failed} (${results.checks} checks passed before it)`); process.exit(1); }
  console.log(`arcade v2 launch canary mock run (${NET}) passed: ${results.checks} checks`);
})().catch((e) => { console.error(e); process.exit(1); });

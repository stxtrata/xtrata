// Mock-chain run of the arcade launch canary (v1.4, recursive release) end to end, then boots the
// recursive parent it inscribed from the same mock chain.
//
//   NODE_PATH=<dir with playwright + @stacks/transactions v6> CHROME_PATH=<chromium> \
//     node canaries/arcade-launch/mock-chain-test.cjs [canaries/build/arcade-launch-canary.html] [stepCount]
//
// The mock chain starts where mainnet is: the leaderboard is deployed with the pinned source, the 26
// boards point at #3078, #3078 holds the v1.3 bundle, the wallet owns #55. The web wallet is a stub
// Leather provider that applies calls to the mock directly (no keys, nothing leaves this machine).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = require('@stacks/transactions');
const { chromium } = require('playwright');
const { tupleCV, uintCV, boolCV, bufferCV, stringAsciiCV, principalCV, someCV, noneCV, responseOkCV, listCV, cvToHex, cvToString, deserializeTransaction, addressToString, PayloadType } = T;
const hexToCV = (h) => T.hexToCV(/^0x/i.test(h) ? h : '0x' + h);

const ROOT = path.resolve(__dirname, '../..');
const HTML = path.resolve(process.argv[2] || path.join(ROOT, 'canaries/build/arcade-launch-canary.html'));
const BUNDLE = fs.readFileSync(path.join(ROOT, 'recursive-apps/xtrata-arcade/release/xtrata-arcade.html'));
const SOURCE = fs.readFileSync(path.join(ROOT, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8');
const BOARDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'recursive-apps/xtrata-arcade/boards.json'), 'utf8'));
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const SCORES = DEPLOYER + '.xtrata-arcade-scores-v2';
const CHUNK = 16384;
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const hex = (b) => Buffer.from(b).toString('hex');
const chunksOf = (buf) => { const out = []; for (let i = 0; i < buf.length; i += CHUNK) out.push(buf.subarray(i, i + CHUNK)); return out; };
const runHash = (chunks) => chunks.reduce((h, c) => sha(Buffer.concat([h, c])), Buffer.alloc(32));

// ---------- mock state ----------
const S = {
  core: { uploads: new Map(), chunks: new Map(), meta: new Map(), byHash: new Map(), deps: new Map(), parents: new Map(), owner: new Map(), next: 3100, fees: [] },
  sc: { src: SOURCE, boards: new Map(), slots: new Map(), replays: new Map() },
  tx: new Map(), bal: new Map(), nonce: 5, blk: 1000, calls: []
};
function addInscription(id, buf, mime, creator) {
  const ch = chunksOf(buf), h = hex(runHash(ch));
  S.core.meta.set(id, { creator, mime, size: buf.length, n: ch.length, hash: h });
  S.core.chunks.set(id, ch); S.core.byHash.set(h, id); S.core.owner.set(id, creator);
}
// Mainnet as of the v1.4 launch: #3078 the v1.3 bundle, #3079 / #3080 the engine and hall packs, #3081 the
// v1.4 parent (chain-only loader), every board on #3081.
const XA = path.join(ROOT, 'recursive-apps/xtrata-arcade');
const HP = require(path.join(XA, 'build/hall-parts.cjs')), PR = require(path.join(XA, 'build/parent-render.cjs'));
const PARTS = {};
for (const f of fs.readdirSync(path.join(XA, 'src/parts'))) PARTS[f] = fs.readFileSync(path.join(XA, 'src/parts', f), 'utf8');
const V14_PARENT = PR.fillParent(PR.parentShell(fs.readFileSync(path.join(XA, 'parent/parent.template.html'), 'utf8'), fs.readFileSync(path.join(XA, 'build/hall-parts.cjs'), 'utf8')),
  { version: 'v1.4', bundleId: 3078, packs: { assets: 0, three: 0, engine: 3079, games: 0, hall: 3080 }, parts: {}, parentTokenId: 0 });
addInscription(55, Buffer.from('<p>#55</p>'), 'text/html', DEPLOYER);
addInscription(3078, BUNDLE, 'text/html', DEPLOYER);
addInscription(3079, Buffer.from(HP.makePack('engine', PARTS)), 'text/plain', DEPLOYER);
addInscription(3080, Buffer.from(HP.makePack('hall', PARTS)), 'text/plain', DEPLOYER);
addInscription(3081, Buffer.from(V14_PARENT), 'text/html', DEPLOYER);
for (const id of [3079, 3080, 3081]) S.core.parents.set(id, [55]);
S.core.deps.set(3081, [3078, 3079, 3080]);
for (const b of BOARDS) S.sc.boards.set(b.id, { mode: BigInt(b.mode), max: BigInt(b.max), fee: 0n, eid: 3081n, daily: false, en: true });
S.sc.boards.set('arcade-canary', { mode: 0n, max: 1000000000n, fee: 0n, eid: 3081n, daily: false, en: false });

let txn = 0;
const newTx = (status, repr) => { const id = '0x' + sha('tx' + (++txn)).toString('hex'); S.tx.set(id, { tx_status: status, tx_result: { repr }, block_height: ++S.blk }); return id; };
const num = (cv) => BigInt(cv.value);
const buf = (cv) => Buffer.from(cv.buffer);
const hash160 = (addr) => Buffer.from(T.createAddress(addr).hash160, 'hex');

function callWrite(contract, fn, args, sender) {
  S.calls.push(`${contract.split('.')[1]}.${fn}`);
  if (contract === CORE) {
    const C = S.core;
    if (fn === 'begin-or-get') {
      const h = hex(buf(args[0])), k = sender + h;
      if (C.byHash.has(h)) return ['abort_by_response', '(err u109)'];
      if (!C.uploads.has(k)) { C.uploads.set(k, { mime: args[1].data, size: Number(num(args[2])), n: Number(num(args[3])), idx: 0, run: Buffer.alloc(32), chunks: [] }); C.fees.push('begin'); }
      return ['success', '(ok none)'];
    }
    if (fn === 'add-chunk-batch') {
      const u = C.uploads.get(sender + hex(buf(args[0])));
      if (!u) return ['abort_by_response', '(err u101)'];
      const items = args[1].list;
      if (items.length > 32 || u.idx + items.length > u.n) return ['abort_by_response', '(err u102)'];
      for (const it of items) {
        const d = buf(it), want = u.idx < u.n - 1 ? CHUNK : u.size - u.idx * CHUNK;
        if (d.length !== want) return ['abort_by_response', '(err u102)'];
        u.run = sha(Buffer.concat([u.run, d])); u.chunks.push(d); u.idx++;
      }
      return ['success', '(ok true)'];
    }
    if (fn === 'seal-with-relationships' || fn === 'seal-inscription') {
      const h = hex(buf(args[0])), k = sender + h, u = C.uploads.get(k);
      if (!u) return ['abort_by_response', '(err u101)'];
      if (u.idx !== u.n) return ['abort_by_response', '(err u102)'];
      if (hex(u.run) !== h) return ['abort_by_response', '(err u103)'];
      if (!args[1].data.length) return ['abort_by_response', '(err u107)'];
      const deps = fn === 'seal-with-relationships' ? args[2].list.map((x) => Number(num(x))) : [];
      const parents = fn === 'seal-with-relationships' ? args[3].list.map((x) => Number(num(x))) : [];
      if (deps.some((d) => !C.meta.has(d))) return ['abort_by_response', '(err u111)'];
      if (parents.some((p) => C.owner.get(p) !== sender)) return ['abort_by_response', '(err u100)'];
      const id = C.next++;
      C.meta.set(id, { creator: sender, mime: u.mime, size: u.size, n: u.n, hash: h });
      C.chunks.set(id, u.chunks); C.byHash.set(h, id); C.owner.set(id, sender); C.deps.set(id, deps); C.parents.set(id, parents);
      C.uploads.delete(k); C.fees.push('seal');
      return ['success', `(ok u${id})`];
    }
  } else if (contract === SCORES) {
    const B = S.sc, name = (x) => x.data;
    if (sender !== DEPLOYER && fn !== 'submit-score') return ['abort_by_response', '(err u100)'];
    if (fn === 'set-board') {
      const id = name(args[0]), old = B.boards.get(id);
      if (old && old.mode !== num(args[1])) return ['abort_by_response', '(err u110)'];
      B.boards.set(id, { mode: num(args[1]), max: num(args[2]), fee: num(args[3]), eid: num(args[4]), daily: args[5].type === T.ClarityType.BoolTrue, en: args[6].type === T.ClarityType.BoolTrue });
      return ['success', '(ok true)'];
    }
    if (fn === 'set-board-enabled') { const b = B.boards.get(name(args[0])); if (!b) return ['abort_by_response', '(err u102)']; b.en = args[1].type === T.ClarityType.BoolTrue; return ['success', '(ok true)']; }
    if (fn === 'submit-score') {
      const id = name(args[0]), b = B.boards.get(id);
      if (!b) return ['abort_by_response', '(err u102)'];
      if (!b.en) return ['abort_by_response', '(err u103)'];
      const rep = buf(args[4]);
      if (!rep.subarray(4, 24).equals(hash160(sender))) return ['abort_by_response', '(err u113)'];
      const score = num(args[2]), arr = (B.slots.get(id) || []).filter((e) => e.player !== sender);
      const prev = (B.slots.get(id) || []).find((e) => e.player === sender);
      if (prev && prev.score >= score) return ['abort_by_response', '(err u108)'];
      arr.push({ player: sender, name: name(args[3]), score, hash: sha(rep), eid: b.eid });
      arr.sort((a, c) => Number(c.score - a.score));
      B.slots.set(id, arr.slice(0, 10)); B.replays.set(id + sender, rep);
      return ['success', '(ok u1)'];
    }
  }
  return ['abort_by_response', '(err u999)'];
}
function callRead(contract, fn, args) {
  if (contract === CORE) {
    const C = S.core;
    if (fn === 'is-paused') return responseOkCV(boolCV(false));
    if (fn === 'get-admin') return responseOkCV(principalCV(DEPLOYER));
    if (fn === 'quote-staged-fee') { const n = Number(num(args[1])); return responseOkCV(tupleCV({ 'begin-fee': uintCV(100000), 'seal-fee': uintCV(100000 + Math.min(n, 32) * 1000 + Math.ceil(Math.max(n - 32, 0) / 32) * 100000) })); }
    if (fn === 'get-id-by-hash') { const id = C.byHash.get(hex(buf(args[0]))); return id ? someCV(uintCV(id)) : noneCV(); }
    if (fn === 'get-upload-state') { const u = C.uploads.get(cvToString(args[1]) + hex(buf(args[0]))); return u ? someCV(tupleCV({ 'current-index': uintCV(u.idx) })) : noneCV(); }
    if (fn === 'get-owner') { const o = C.owner.get(Number(num(args[0]))); return responseOkCV(o ? someCV(principalCV(o)) : noneCV()); }
    if (fn === 'get-inscription-meta') { const m = C.meta.get(Number(num(args[0]))); return m ? someCV(tupleCV({ creator: principalCV(m.creator), 'mime-type': stringAsciiCV(m.mime), 'total-size': uintCV(m.size), 'total-chunks': uintCV(m.n), sealed: boolCV(true), 'final-hash': bufferCV(Buffer.from(m.hash, 'hex')), owner: principalCV(m.creator) })) : noneCV(); }
    if (fn === 'get-chunk-batch') { const ch = C.chunks.get(Number(num(args[0]))); return listCV(args[1].list.map((i) => bufferCV(ch[Number(num(i))]))); }
    if (fn === 'get-chunk') { const ch = C.chunks.get(Number(num(args[0]))) || [], c = ch[Number(num(args[1]))]; return c ? someCV(bufferCV(c)) : noneCV(); }
    if (fn === 'get-parents') return listCV((C.parents.get(Number(num(args[0]))) || []).map((x) => uintCV(x)));
    if (fn === 'get-dependencies') return listCV((C.deps.get(Number(num(args[0]))) || []).map((x) => uintCV(x)));
  } else if (contract === SCORES) {
    const B = S.sc;
    if (fn === 'get-owner') return principalCV(DEPLOYER);
    if (fn === 'is-paused') return boolCV(false);
    if (fn === 'current-period') return uintCV(1234);
    if (fn === 'get-board') { const b = B.boards.get(args[0].data); return b ? someCV(tupleCV({ mode: uintCV(b.mode), 'max-score': uintCV(b.max), fee: uintCV(b.fee), 'engine-id': uintCV(b.eid), daily: boolCV(b.daily), enabled: boolCV(b.en) })) : noneCV(); }
    if (fn === 'get-top10') { const arr = B.slots.get(args[0].data) || []; return listCV(Array.from({ length: 10 }, (_, i) => arr[i] ? someCV(tupleCV({ player: principalCV(arr[i].player), name: stringAsciiCV(arr[i].name), score: uintCV(arr[i].score), 'stacks-height': uintCV(1), 'burn-height': uintCV(1), 'engine-id': uintCV(arr[i].eid), 'replay-hash': bufferCV(arr[i].hash) })) : noneCV())); }
    if (fn === 'get-replay') { const r = B.replays.get(args[0].data + cvToString(args[2])); return r ? someCV(bufferCV(r)) : noneCV(); }
  }
  throw new Error('mock read not implemented: ' + contract + ' ' + fn);
}
const inscriptionBytes = (id) => Buffer.concat(S.core.chunks.get(id) || []);

async function route(r) {
  const u = new URL(r.request().url()), p = u.pathname;
  const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
  if (/xtrata\.xyz$/.test(u.hostname) && p.startsWith('/i/')) { const id = Number(p.slice(3)); S.gateway = (S.gateway || 0) + 1; return S.core.meta.has(id) ? r.fulfill({ contentType: 'text/html', headers: { 'Access-Control-Allow-Origin': '*' }, body: inscriptionBytes(id) }) : r.fulfill({ status: 404, body: '' }); }
  if (/xtrata\.xyz$/.test(u.hostname) && p === '/arcade/submit') return r.fulfill({ contentType: 'text/html', body: '<html><script src="/arcade/submit.js"></script></html>' });
  if (/xtrata\.xyz$/.test(u.hostname) && p === '/arcade/submit.js') return r.fulfill({ contentType: 'text/javascript', body: 'const B=["xa_neon_snake"]' });
  if (!/\/hiro\//.test(p) && !/api\.(mainnet\.)?hiro\.so/.test(u.hostname)) return r.abort();
  const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
  let m;
  if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
    const args = JSON.parse(r.request().postData()).arguments.map(hexToCV);
    try { return json({ okay: true, result: cvToHex(callRead(m[1] + '.' + m[2], m[3], args)) }); } catch (e) { return json({ okay: false, cause: String(e.message) }); }
  }
  if (q === '/v2/info') return json({ burn_block_height: 900000, stacks_tip_height: S.blk });
  if ((m = q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))) return m[1] + '.' + m[2] === SCORES ? json({ source: S.sc.src }) : r.fulfill({ status: 404, body: '{}' });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(S.bal.get(m[1]) ?? (m[1] === DEPLOYER ? 100_000_000n : 0n)) });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: S.nonce++ });
  if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.tx.get(m[1]); return t ? json(t) : r.fulfill({ status: 404, body: '{}' }); }
  if (q === '/v2/transactions') {
    const tx = deserializeTransaction(r.request().postDataBuffer().toString('hex'));
    const sender = addressToString(T.addressFromVersionHash(22, tx.auth.spendingCondition.signer));
    let id;
    if (tx.payload.payloadType === PayloadType.ContractCall) {
      const res = callWrite(addressToString(tx.payload.contractAddress) + '.' + tx.payload.contractName.content, tx.payload.functionName.content, tx.payload.functionArgs, sender);
      id = newTx(res[0], res[1]);
    } else {
      const to = cvToString(tx.payload.recipient), amt = BigInt(tx.payload.amount);
      S.bal.set(sender, (S.bal.get(sender) ?? 0n) - amt); S.bal.set(to, (S.bal.get(to) ?? 0n) + amt);
      id = newTx('success', '(ok true)');
    }
    return json(id.slice(2));
  }
  return r.fulfill({ status: 404, body: '{}' });
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  await ctx.route(/^https?:\/\//, route);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('response', (res) => { if (res.status() >= 400) console.log('  http', res.status(), res.url().slice(0, 120)); });
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|permissions policy|WebGL|GPU|AudioContext/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 160)); });
  await page.exposeFunction('__wallet', async (method, params) => {
    if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: DEPLOYER }] } };
    if (method === 'stx_callContract') {
      if ('sender' in params) throw new Error('stx_callContract must not carry sender');
      for (const pc of params.postConditions || []) if (/^0x/i.test(pc)) throw new Error('Not a serialized post condition'); // what Leather says about 0x
      const res = callWrite(params.contract, params.functionName, params.functionArgs.map(hexToCV), DEPLOYER);
      return { result: { txid: newTx(res[0], res[1]) } };
    }
    if (method === 'stx_transferStx') { const a = BigInt(params.amount); S.bal.set(params.recipient, (S.bal.get(params.recipient) ?? 0n) + a); S.bal.set(DEPLOYER, (S.bal.get(DEPLOYER) ?? 100_000_000n) - a); return { result: { txid: newTx('success', '(ok true)') } }; }
    throw Object.assign(new Error('unsupported ' + method), { code: -32601 });
  });
  await page.addInitScript(() => { window.LeatherProvider = { request: async (m, pr) => window.__wallet(m, pr) }; });
  await page.goto('file://' + HTML);
  await page.waitForTimeout(1000);

  const ids = await page.$$eval('[data-step]', (els) => els.map((e) => e.getAttribute('data-step')));
  const only = process.argv[3] ? Number(process.argv[3]) : ids.length;
  const runSteps = async (list) => {
    for (const id of list) {
      await page.click(`[data-step="${id}"]`, { timeout: 20000 });
      if (id === 'connect') { await page.waitForSelector('.chooser__item', { timeout: 15000 }); await page.click('.chooser__item'); }
      const t0 = Date.now(); let badge = '';
      for (;;) {
        await page.waitForTimeout(500);
        badge = await page.evaluate((i) => { const b = document.querySelector(`[data-step="${i}"]`).closest('section'); return b.querySelector('.badge').textContent + '|' + (b.querySelector('.note') || { textContent: '' }).textContent; }, id);
        if (/^(pass|fail)/.test(badge)) break;
        if (Date.now() - t0 > 400000) { badge = 'TIMEOUT|' + badge; break; }
      }
      console.log(id.padEnd(12), badge.slice(0, 600));
      if (!badge.startsWith('pass')) return id;
    }
    return null;
  };
  let failed = await runSteps(ids.slice(0, only));
  const parentId = await page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^xtrata-arcade-launch:v2:/.test(k)) return JSON.parse(localStorage.getItem(k)).inscriptionId || null; } return null; });
  console.log('core fees', S.core.fees.join(','), '· calls', S.calls.length, '· canary errors', errs.slice(0, 4));
  const results = { failed, parentId, errs };

  // Boot the parent the canary inscribed, from the mock chain only.
  if (!failed && only === ids.length && parentId) {
    const pid = Number(parentId);
    const deps = S.core.deps.get(pid), meta = S.core.meta.get(pid);
    console.log(`parent #${pid}: ${meta.size} bytes, parents [${S.core.parents.get(pid)}], dependencies [${deps}]`);
    const bad = BOARDS.filter((b) => S.sc.boards.get(b.id).eid !== BigInt(pid)).map((b) => b.id);
    const boot = await ctx.newPage();
    const berrs = [];
    boot.on('pageerror', (e) => berrs.push(e.message));
    let reads = 0; boot.on('request', (rq) => { if (/get-chunk/.test(rq.url())) reads++; });
    const gatewayBefore = S.gateway || 0;
    await boot.goto(`https://xtrata.xyz/i/${pid}`);
    await boot.waitForFunction(() => window.XA && window.XA.games && window.XA.games.length === 21 && window.THREE && !document.getElementById('xa-load'), null, { timeout: 180000 });
    const info = await boot.evaluate(() => ({ build: window.XA_BUILD, parts: document.querySelectorAll('[data-xa-part]').length }));
    const fromGateway = (S.gateway || 0) - gatewayBefore - 1; // minus the page itself
    console.log(`booted #${pid}: 21 games, ${info.parts} parts, ${fromGateway} inscriptions from the gateway, ${reads} chunk reads, packs ${JSON.stringify(info.build.packs)}, errors ${JSON.stringify(berrs.slice(0, 3))}`);
    const eq = BOARDS.filter((b) => S.sc.boards.get(b.id).eid === 3081n).length;
    console.log(`boards: ${BOARDS.length - bad.length} on #${pid}, ${eq} left on the equivalent #3081 (${S.calls.filter((c) => /set-board$/.test(c)).length} set-board calls in all)`);
    if (bad.length - eq !== 0 || berrs.length || info.parts !== 33 || fromGateway !== 3 || reads !== 0) results.failed = 'parent-boot';
  }
  // A re-run after "Forget local progress" must find the release on chain and send nothing.
  if (!results.failed && only === ids.length) {
    const before = S.core.fees.length, calls = S.calls.length;
    await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^xtrata-arcade-launch:v2:/.test(k)) localStorage.removeItem(k); });
    await page.reload(); await page.waitForTimeout(1000);
    console.log('-- re-run after forgetting local progress');
    const f = await runSteps(['connect', 'preflight', 'deploy', 'verify', ...ids.filter((i) => /^pack-|^parent$/.test(i)), 'inscription']);
    const reused = await page.evaluate(() => [...document.querySelectorAll('.note')].filter((n) => /re-used, nothing sent/.test(n.textContent)).length);
    console.log(`re-run: ${reused} inscriptions re-used, ${S.core.fees.length - before} fees paid, ${S.calls.length - calls} calls sent`);
    if (f || reused !== 3 || S.core.fees.length !== before || S.calls.length !== calls) results.failed = 'resume';
  }
  await browser.close();
  if (results.failed || errs.length) { console.log('FAILED', results.failed || errs); process.exit(1); }
  console.log('arcade launch canary mock run passed');
})().catch((e) => { console.error(e); process.exit(1); });

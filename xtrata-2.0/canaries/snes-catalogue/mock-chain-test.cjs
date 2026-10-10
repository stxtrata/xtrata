// Mock-chain run of the SNES catalogue launch canary end to end, including the real emulator in the page.
//
//   NODE_PATH=<dir with playwright + @stacks/transactions v6> CHROME_PATH=<chromium> \
//     node canaries/snes-catalogue/mock-chain-test.cjs [canaries/build/snes-catalogue-canary.html] [stepCount]
//
// The mock chain starts where mainnet is: the Xtrata core is live, your wallet has 100 STX, nothing of ours is deployed.
// The web wallet is a stub Leather provider that applies calls to the mock directly (no keys, nothing leaves this
// machine). The temporary wallet's transactions are real signed transactions, broadcast to the mock node, which reads
// the signer, the fee and the payload out of the bytes exactly as a node would.
//
// Then, as the canary's rules require, the whole run happens twice: the second run starts after "Forget local
// progress" and must find everything on chain and send nothing at all.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = require('@stacks/transactions');
const { chromium } = require('playwright');
const { tupleCV, uintCV, boolCV, bufferCV, stringAsciiCV, principalCV, someCV, noneCV, responseOkCV, responseErrorCV, listCV, cvToHex, cvToString, deserializeTransaction, addressToString, PayloadType } = T;
const hexToCV = (h) => T.hexToCV(/^0x/i.test(h) ? h : '0x' + h);

const ROOT = path.resolve(__dirname, '../..');
const HTML = path.resolve(process.argv[2] || path.join(ROOT, 'canaries/build/snes-catalogue-canary.html'));
const CAT_SRC = fs.readFileSync(path.join(ROOT, 'contracts/snes-game-catalogue/contracts/snes-game-catalogue-v1.clar'), 'utf8');
const AD_SRC = fs.readFileSync(path.join(ROOT, 'contracts/snes-game-catalogue/contracts/snes-xtrata-adapter-v3-2-3.clar'), 'utf8');
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'; // also the core's own address; the test wallet is a different account below
const ME = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CAT = ME + '.snes-game-catalogue-v1', AD = ME + '.snes-xtrata-adapter-v3-2-3';
const CHUNK = 16384;
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const hex = (b) => Buffer.from(b).toString('hex');
const runHash = (chunks) => chunks.reduce((h, c) => sha(Buffer.concat([h, c])), Buffer.alloc(32));
const num = (cv) => BigInt(cv.value);
const buf = (cv) => Buffer.from(cv.buffer);
const err = (n) => ['abort_by_response', `(err u${n})`];
const ok = (r = 'true') => ['success', `(ok ${r})`];
const fail = (m) => { throw new Error(m); };

// ---------- mock state ----------
const S = {
  core: { chunks: new Map(), meta: new Map(), byHash: new Map(), uploads: new Map(), next: 3200, fees: [] },
  src: new Map(),
  cat: null, // set when the catalogue is deployed
  calls: [], wlog: [], sent: [], walletCalls: 0, deploys: 0, transfers: 0, hotFees: [],
  tx: new Map(), bal: new Map([[ME, 100_000_000n]]), nonce: 5, blk: 1000
};
let txn = 0;
const newTx = (status, repr) => { const id = '0x' + sha('tx' + (++txn)).toString('hex'); S.tx.set(id, { tx_status: status, tx_result: { repr }, block_height: ++S.blk }); return id; };
const addInscription = (id, bytes, mime, creator) => {
  const ch = []; for (let i = 0; i < bytes.length; i += CHUNK) ch.push(bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  const h = hex(runHash(ch));
  S.core.meta.set(id, { creator, mime, size: bytes.length, n: ch.length, hash: h, sealed: true });
  S.core.chunks.set(id, ch); S.core.byHash.set(h, id);
};
addInscription(1, Buffer.from('<p>#1</p>'), 'text/html', DEPLOYER); // the core is not empty

// ---------- the catalogue, as the Clarity source defines it ----------
const newCatalogue = (admin) => ({ admin, pending: null, count: 0, gate: null, publishers: new Map(), readers: new Map(), games: new Map(), versions: new Map(), byHash: new Map(), bySlug: new Map() });
const activePub = (C, who) => !!(C.publishers.get(who) || {}).active;
const canAct = (C, g, sender) => sender === C.admin || (sender === g.owner && activePub(C, sender));
const optPtr = (cv) => (cv.type === T.ClarityType.OptionalSome ? { core: cvToString(cv.value.data.core), id: Number(num(cv.value.data.id)) } : null);
const adapterCheck = (adapter, ins, size, creator) => {
  if (adapter !== AD) return err(200);
  const m = S.core.meta.get(ins);
  if (!m) return err(200);
  if (!m.sealed) return err(201);
  if (m.size !== size) return err(202);
  if (m.creator !== creator) return err(203);
  return null;
};
function catWrite(fn, a, sender) {
  const C = S.cat;
  if (!C) return err(999);
  const isAdmin = sender === C.admin;
  switch (fn) {
    case 'set-publisher': if (!isAdmin) return err(100); C.publishers.set(cvToString(a[0]), { active: a[1].type === T.ClarityType.BoolTrue, label: a[2].data }); return ok();
    case 'set-gate': if (!isAdmin) return err(100); C.gate = a[0].type === T.ClarityType.OptionalSome ? cvToString(a[0].value) : null; return ok();
    case 'set-reader': if (!isAdmin) return err(100); C.readers.set(cvToString(a[0]), a[1].type === T.ClarityType.BoolTrue); return ok();
    case 'set-set': { const g = C.games.get(Number(num(a[0]))); if (!g) return err(103); if (!isAdmin) return err(100); const s = Number(num(a[1])); if (s > 1) return err(106); g.set = s; return ok(); }
    case 'revoke-version': {
      const id = Number(num(a[0])), ver = Number(num(a[1])), v = C.versions.get(id + ':' + ver);
      if (!v) return err(103); if (!isAdmin) return err(100);
      v.revoked = true; const h = hex(v.sha); const b = C.byHash.get(h); if (b && b.id === id && b.ver === ver) C.byHash.delete(h); return ok();
    }
    case 'propose-admin': if (!isAdmin) return err(100); C.pending = cvToString(a[0]); return ok();
    case 'accept-admin': if (!C.pending || C.pending !== sender) return err(113); C.admin = C.pending; C.pending = null; return ok();
    case 'add-game': {
      const slug = a[0].data, title = a[1].data;
      if (!activePub(C, sender)) return err(101);
      if (!slug.length || !title.length) return err(106);
      if (C.bySlug.has(slug)) return err(104);
      const id = C.count + 1;
      C.bySlug.set(slug, id);
      C.games.set(id, { slug, title, owner: sender, set: isAdmin ? 0 : 1, hidden: false, latest: 0, versions: 0, payout: sender, licence: 'free', cover: optPtr(a[2]), icon: optPtr(a[3]) });
      C.count = id; return ok(`u${id}`);
    }
    case 'add-version': {
      const id = Number(num(a[0])), g = C.games.get(id);
      if (!g) return err(103);
      const adapter = cvToString(a[1]), ver = g.versions + 1;
      if (adapter !== AD) return err(999);
      if (!canAct(C, g, sender)) return err(102);
      if (!C.readers.get(adapter)) return err(107);
      const size = Number(num(a[3])), ins = Number(num(a[4])), coreMin = Number(num(a[5]));
      if (!(size > 0 && coreMin > 0)) return err(106);
      const bad = adapterCheck(adapter, ins, size, g.owner); if (bad) return bad;
      const h = hex(buf(a[2]));
      if (C.byHash.has(h)) return err(105);
      C.byHash.set(h, { id, ver });
      C.versions.set(id + ':' + ver, { sha: buf(a[2]), size, core: CORE, ins, coreMin, profile: a[6].data, board: a[7].type === T.ClarityType.OptionalSome ? a[7].value.data : null, note: a[8].data, revoked: false });
      g.versions = ver; if (a[9].type === T.ClarityType.BoolTrue || g.latest === 0) g.latest = ver;
      return ok(`u${ver}`);
    }
    case 'set-latest': case 'set-art': case 'set-hidden': case 'set-payout': case 'set-licence': case 'transfer-game': {
      const id = Number(num(a[0])), g = C.games.get(id);
      if (!g) return err(103);
      if (!canAct(C, g, sender)) return err(102);
      if (fn === 'set-hidden') g.hidden = a[1].type === T.ClarityType.BoolTrue;
      if (fn === 'transfer-game') { const to = cvToString(a[1]); if (!activePub(C, to)) return err(101); g.owner = to; g.payout = to; }
      return ok();
    }
  }
  return err(999);
}
const gameCV = (g) => tupleCV({
  slug: stringAsciiCV(g.slug), title: stringAsciiCV(g.title), owner: principalCV(g.owner), set: uintCV(g.set), hidden: boolCV(g.hidden), latest: uintCV(g.latest), versions: uintCV(g.versions),
  payout: principalCV(g.payout), licence: stringAsciiCV(g.licence),
  cover: g.cover ? someCV(tupleCV({ core: principalCV(g.cover.core), id: uintCV(g.cover.id) })) : noneCV(),
  icon: g.icon ? someCV(tupleCV({ core: principalCV(g.icon.core), id: uintCV(g.icon.id) })) : noneCV()
});
const versionCV = (v) => tupleCV({
  'rom-sha256': bufferCV(v.sha), size: uintCV(v.size), core: principalCV(v.core), ins: uintCV(v.ins), 'core-min': uintCV(v.coreMin), profile: stringAsciiCV(v.profile),
  board: v.board ? someCV(stringAsciiCV(v.board)) : noneCV(), note: stringAsciiCV(v.note), 'added-at': uintCV(1), revoked: boolCV(v.revoked)
});
function catRead(fn, a) {
  const C = S.cat;
  if (!C) throw new Error('catalogue not deployed');
  const card = (id) => { const g = C.games.get(id); return g ? someCV(tupleCV({ id: uintCV(id), game: gameCV(g), version: C.versions.get(id + ':' + g.latest) ? someCV(versionCV(C.versions.get(id + ':' + g.latest))) : noneCV() })) : noneCV(); };
  switch (fn) {
    case 'get-count': return uintCV(C.count);
    case 'get-admin': return principalCV(C.admin);
    case 'get-pending-admin': return C.pending ? someCV(principalCV(C.pending)) : noneCV();
    case 'get-gate': return C.gate ? someCV(principalCV(C.gate)) : noneCV();
    case 'is-publisher': return boolCV(activePub(C, cvToString(a[0])));
    case 'is-reader': return boolCV(!!C.readers.get(cvToString(a[0])));
    case 'get-game': { const g = C.games.get(Number(num(a[0]))); return g ? someCV(gameCV(g)) : noneCV(); }
    case 'get-version': { const v = C.versions.get(Number(num(a[0])) + ':' + Number(num(a[1]))); return v ? someCV(versionCV(v)) : noneCV(); }
    case 'get-by-hash': { const b = C.byHash.get(hex(buf(a[0]))); return b ? someCV(tupleCV({ id: uintCV(b.id), ver: uintCV(b.ver) })) : noneCV(); }
    case 'get-by-slug': { const id = C.bySlug.get(a[0].data); return id ? someCV(uintCV(id)) : noneCV(); }
    case 'get-card': return card(Number(num(a[0])));
    case 'get-page': { const s = Number(num(a[0])); return listCV(Array.from({ length: 10 }, (_, i) => card(s + i))); }
  }
  throw new Error('mock read not implemented: catalogue ' + fn);
}

// ---------- the core ----------
function coreWrite(fn, a, sender) {
  const C = S.core;
  if (fn === 'mint-single-tx') {
    const h = hex(buf(a[0])), items = a[3].list;
    if (items.length > 32) return err(102);
    let run = Buffer.alloc(32); const chunks = [];
    for (const it of items) { const d = buf(it); run = sha(Buffer.concat([run, d])); chunks.push(d); }
    if (hex(run) !== h) return err(103);
    if (chunks.reduce((n, c) => n + c.length, 0) !== Number(num(a[2]))) return err(102);
    if (!a[4].data.length) return err(107);
    if (C.byHash.has(h)) return ok(`(tuple (existed true) (token-id u${C.byHash.get(h)}))`);
    const id = C.next++;
    C.meta.set(id, { creator: sender, mime: a[1].data, size: Number(num(a[2])), n: chunks.length, hash: h, sealed: true });
    C.chunks.set(id, chunks); C.byHash.set(h, id); C.fees.push('single');
    return ok(`(tuple (existed false) (token-id u${id}))`);
  }
  if (fn === 'begin-or-get') {
    const h = hex(buf(a[0])), k = sender + h;
    if (!C.uploads.has(k)) { C.uploads.set(k, { mime: a[1].data, size: Number(num(a[2])), n: Number(num(a[3])), idx: 0, run: Buffer.alloc(32), chunks: [] }); C.fees.push('begin'); }
    return ok();
  }
  if (fn === 'add-chunk-batch') {
    const u = C.uploads.get(sender + hex(buf(a[0])));
    if (!u) return err(101);
    for (const it of a[1].list) { const d = buf(it); u.run = sha(Buffer.concat([u.run, d])); u.chunks.push(d); u.idx++; }
    return ok();
  }
  if (fn === 'seal-inscription') {
    const h = hex(buf(a[0])), k = sender + h, u = C.uploads.get(k);
    if (!u) return err(101);
    if (u.idx !== u.n) return err(102);
    if (hex(u.run) !== h) return err(103);
    const id = C.next++;
    C.meta.set(id, { creator: sender, mime: u.mime, size: u.size, n: u.n, hash: h, sealed: true });
    C.chunks.set(id, u.chunks); C.byHash.set(h, id); C.uploads.delete(k); C.fees.push('seal');
    return ok(`u${id}`);
  }
  return err(999);
}
function coreRead(fn, a) {
  const C = S.core;
  switch (fn) {
    case 'is-paused': return responseOkCV(boolCV(false));
    case 'quote-single-tx-fee': { const n = Number(num(a[1])); return responseOkCV(tupleCV({ 'total-fee': uintCV(10000 + 1000 * n), 'single-tx-fee': uintCV(10000 + 1000 * n) })); }
    case 'quote-staged-fee': { const n = Number(num(a[1])); return responseOkCV(tupleCV({ 'begin-fee': uintCV(100000), 'seal-fee': uintCV(100000 + n * 1000) })); }
    case 'get-id-by-hash': { const id = C.byHash.get(hex(buf(a[0]))); return id ? someCV(uintCV(id)) : noneCV(); }
    case 'get-upload-state': { const u = C.uploads.get(cvToString(a[1]) + hex(buf(a[0]))); return u ? someCV(tupleCV({ 'current-index': uintCV(u.idx) })) : noneCV(); }
    case 'get-inscription-meta': {
      const m = C.meta.get(Number(num(a[0])));
      return m ? someCV(tupleCV({ creator: principalCV(m.creator), 'mime-type': stringAsciiCV(m.mime), 'total-size': uintCV(m.size), 'total-chunks': uintCV(m.n), sealed: boolCV(m.sealed), 'final-hash': bufferCV(Buffer.from(m.hash, 'hex')) })) : noneCV();
    }
    case 'get-chunk-batch': { const ch = C.chunks.get(Number(num(a[0]))); return listCV(a[1].list.map((i) => bufferCV(ch[Number(num(i))]))); }
  }
  throw new Error('mock read not implemented: core ' + fn);
}
function adapterRead(fn, a) {
  if (fn === 'core') return responseOkCV(principalCV(CORE));
  if (fn === 'check') { const bad = adapterCheck(AD, Number(num(a[0])), Number(num(a[1])), cvToString(a[2])); return bad ? responseErrorCV(uintCV(Number(/u(\d+)/.exec(bad[1])[1]))) : responseOkCV(boolCV(true)); }
  throw new Error('mock read not implemented: adapter ' + fn);
}
function callWrite(contract, fn, args, sender) {
  S.calls.push(`${contract.split('.')[1]}.${fn}`);
  if (contract === CORE) return coreWrite(fn, args, sender);
  if (contract === CAT) { S.sent.push({ sender, fn }); return catWrite(fn, args, sender); }
  return err(999);
}
function callRead(contract, fn, args) {
  if (contract === CORE) return coreRead(fn, args);
  if (contract === CAT) return catRead(fn, args);
  if (contract === AD) return adapterRead(fn, args);
  throw new Error('unknown contract ' + contract);
}
const deploy = (name, code, sender) => {
  S.deploys++;
  const id = sender + '.' + name;
  if (S.src.has(id)) return ['abort_by_response', '(err already-deployed)'];
  if (name === 'snes-game-catalogue-v1') S.cat = newCatalogue(sender);
  if (name === 'snes-xtrata-adapter-v3-2-3' && !S.src.has(sender + '.snes-game-catalogue-v1')) return ['abort_by_response', '(err unresolved-trait)'];
  S.src.set(id, code);
  return ['success', '(ok true)'];
};

async function route(r) {
  const u = new URL(r.request().url()), p = u.pathname;
  const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
  if (!/\/hiro\//.test(p) && !/api\.(mainnet\.)?hiro\.so/.test(u.hostname)) return r.abort();
  const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
  let m;
  if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
    const args = JSON.parse(r.request().postData()).arguments.map(hexToCV);
    try { return json({ okay: true, result: cvToHex(callRead(m[1] + '.' + m[2], m[3], args)) }); } catch (e) { return json({ okay: false, cause: String(e.message) }); }
  }
  if (q === '/v2/info') return json({ burn_block_height: 900000, stacks_tip_height: S.blk });
  if ((m = q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))) { const s = S.src.get(m[1] + '.' + m[2]); return s ? json({ source: s }) : r.fulfill({ status: 404, body: '{}' }); }
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(S.bal.get(m[1]) ?? 0n) });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: S.nonce++ });
  if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/mempool/))) return json({ total: 0, results: [] });
  if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.tx.get(m[1]); return t ? json(t) : r.fulfill({ status: 404, body: '{}' }); }
  if (q === '/v2/transactions') {
    const raw = r.request().postDataBuffer();
    const tx = deserializeTransaction(raw.toString('hex'));
    const sender = addressToString(T.addressFromVersionHash(22, tx.auth.spendingCondition.signer));
    const fee = BigInt(tx.auth.spendingCondition.fee);
    if (sender === ME) fail('the canary signed a transaction as the web wallet account itself');
    if (fee < BigInt(Math.max(2 * raw.length, 20000))) return r.fulfill({ status: 400, body: `fee ${fee} is below 2x ${raw.length} bytes` });
    if ((S.bal.get(sender) ?? 0n) < fee) return r.fulfill({ status: 400, body: 'NotEnoughFunds' });
    S.hotFees.push(fee);
    S.bal.set(sender, (S.bal.get(sender) ?? 0n) - fee);
    let id;
    if (tx.payload.payloadType === PayloadType.ContractCall) {
      if (tx.postConditionMode !== T.PostConditionMode.Deny) fail('a temporary-wallet call was not in deny mode');
      const res = callWrite(addressToString(tx.payload.contractAddress) + '.' + tx.payload.contractName.content, tx.payload.functionName.content, tx.payload.functionArgs, sender);
      id = newTx(res[0], res[1]);
    } else {
      const to = cvToString(tx.payload.recipient), amt = BigInt(tx.payload.amount);
      if ((S.bal.get(sender) ?? 0n) < amt) return r.fulfill({ status: 400, body: 'NotEnoughFunds' });
      S.bal.set(sender, (S.bal.get(sender) ?? 0n) - amt); S.bal.set(to, (S.bal.get(to) ?? 0n) + amt); S.transfers++;
      id = newTx('success', '(ok true)');
    }
    return json(id.slice(2));
  }
  return r.fulfill({ status: 404, body: '{}' });
}

(async () => {
  const exe = process.env.CHROME_PATH || undefined;
  const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 1000 }, acceptDownloads: true });
  await ctx.route(/^https?:\/\//, route);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  let dialogs = 0;
  page.on('dialog', (d) => { dialogs++; d.accept(); });
  let downloads = 0;
  page.on('download', () => { downloads++; });
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|permissions policy|WebGL|GPU|AudioContext|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await page.exposeFunction('__wallet', async (method, params) => {
    if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', address: ME }] } };
    if (method === 'stx_callContract') {
      S.walletCalls++; S.wlog.push(params.functionName);
      if ('sender' in params) throw new Error('stx_callContract must not carry sender');
      if (params.postConditionMode !== 'deny') throw new Error('wallet call is not in deny mode: ' + params.postConditionMode);
      for (const pc of params.postConditions || []) if (/^0x/i.test(pc)) throw new Error('Not a serialized post condition');
      const res = callWrite(params.contract, params.functionName, params.functionArgs.map(hexToCV), ME);
      return { result: { txid: newTx(res[0], res[1]) } };
    }
    if (method === 'stx_deployContract') {
      S.walletCalls++; S.wlog.push('deploy ' + params.name);
      if (params.postConditionMode !== 'deny') throw new Error('deploy is not in deny mode');
      const res = deploy(params.name, params.clarityCode, ME);
      return { result: { txid: newTx(res[0], res[1]) } };
    }
    if (method === 'stx_transferStx') {
      S.walletCalls++; S.wlog.push('transfer ' + params.amount);
      const a = BigInt(params.amount);
      if ((S.bal.get(ME) ?? 0n) < a) throw new Error('insufficient funds');
      S.bal.set(params.recipient, (S.bal.get(params.recipient) ?? 0n) + a); S.bal.set(ME, S.bal.get(ME) - a); S.transfers++;
      return { result: { txid: newTx('success', '(ok true)') } };
    }
    throw Object.assign(new Error('unsupported ' + method), { code: -32601 });
  });
  await page.addInitScript(() => { window.LeatherProvider = { request: async (m, pr) => window.__wallet(m, pr) }; });
  await page.goto('file://' + HTML);
  await page.waitForTimeout(1000);

  const ids = await page.$$eval('[data-step]', (els) => els.map((e) => e.getAttribute('data-step')));
  console.log('steps:', ids.join(', '));
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
        if (Date.now() - t0 > 600000) { badge = 'TIMEOUT|' + badge; break; }
      }
      console.log(id.padEnd(16), badge.slice(0, 420));
      if (!badge.startsWith('pass')) return id;
    }
    return null;
  };
  const problems = [];
  let failed = await runSteps(ids.slice(0, only));
  console.log('wallet calls:', S.wlog.join(', '));
  console.log('core fees', S.core.fees.length, '· web-wallet calls', S.walletCalls, '· contract calls', S.calls.length, '· canary errors', errs.slice(0, 4));

  if (!failed && only === ids.length) {
    const C = S.cat;
    const me = (x) => x === ME;
    const hotSenders = [...new Set(S.sent.map((x) => x.sender))].filter((x) => x !== ME);
    const hot = hotSenders[0];
    const games = [...C.games.values()];
    console.log(`catalogue: ${C.count} games · admin ${C.admin === ME ? 'your wallet' : 'NOT YOU ' + C.admin} · pending ${C.pending} · readers ${[...C.readers].filter(([, v]) => v).map(([k]) => k.split('.')[1])} · hot publisher ${hot ? activePub(C, hot) : 'n/a'}`);
    for (const [id, g] of C.games) {
      const v = C.versions.get(id + ':' + g.latest);
      console.log(`  #${id} ${g.title.padEnd(13)} set ${g.set} owner ${me(g.owner) ? 'you' : g.owner} v${g.latest}/${g.versions} ins #${v.ins} sha ${hex(v.sha).slice(0, 12)} cover ${g.cover ? '#' + g.cover.id : '-'} icon ${g.icon ? '#' + g.icon.id : '-'}`);
    }
    if (C.count !== 5) problems.push('expected 5 games');
    if (C.admin !== ME || C.pending !== null) problems.push('admin role is not back with your wallet');
    if (games.some((g) => g.owner !== ME || g.set !== 0 || g.versions !== 1 || g.hidden)) problems.push('a game is not owned by you in the core set with one version');
    if (!activePub(C, ME)) problems.push('your wallet is not a publisher');
    if (hot && activePub(C, hot)) problems.push('the temporary wallet is still a publisher');
    if (!C.readers.get(AD)) problems.push('adapter not allowed');
    if (hotSenders.length !== 1) problems.push('expected exactly one temporary wallet, saw ' + hotSenders.length);
    if (S.walletCalls !== 18) problems.push(`expected 18 web-wallet signatures, saw ${S.walletCalls}`);
    if (S.deploys !== 2) problems.push('expected 2 deploys, saw ' + S.deploys);
    if (S.core.fees.length !== 13) problems.push('expected 13 core inscriptions, saw ' + S.core.fees.length);
    const hotBal = S.bal.get(hot) ?? 0n;
    console.log(`temporary wallet ${hot}: balance ${hotBal} µSTX left · ${S.hotFees.length} transactions signed in the page · key downloads ${downloads} · confirm dialogs ${dialogs}`);
    if (hotBal > 30000n) problems.push('temporary wallet was not swept: ' + hotBal);
    if (downloads < 1) problems.push('the temporary wallet key was never saved to a file');
    // every ROM and image in the mock core is byte-identical to the file in the repo
    const dir = path.join(ROOT, 'canaries/snes-catalogue/assets');
    const defs = JSON.parse(fs.readFileSync(path.join(ROOT, 'canaries/snes-catalogue/games.json'), 'utf8'));
    for (const d of defs) {
      const g = C.games.get(C.bySlug.get(d.slug));
      const v = C.versions.get(C.bySlug.get(d.slug) + ':1');
      const bytes = Buffer.concat(S.core.chunks.get(v.ins));
      if (!bytes.equals(fs.readFileSync(path.join(__dirname, d.rom)))) problems.push(d.slug + ': ROM on chain differs from the file');
      for (const k of ['cover', 'icon']) if (d[k] && !Buffer.concat(S.core.chunks.get(g[k].id)).equals(fs.readFileSync(path.join(__dirname, d[k])))) problems.push(`${d.slug}: ${k} on chain differs from the file`);
    }
    if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT, fullPage: true });

    // ---------- run two: forget local progress; everything is on chain; nothing may be sent ----------
    const snap = { wc: S.walletCalls, calls: S.calls.length, fees: S.core.fees.length, deploys: S.deploys, transfers: S.transfers, hotTx: S.hotFees.length };
    await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^xtrata-snes-catalogue:/.test(k)) localStorage.removeItem(k); });
    await page.reload(); await page.waitForTimeout(1000);
    console.log('-- run two: after forgetting local progress');
    const second = await runSteps(ids);
    const delta = { wc: S.walletCalls - snap.wc, calls: S.calls.length - snap.calls, fees: S.core.fees.length - snap.fees, deploys: S.deploys - snap.deploys, transfers: S.transfers - snap.transfers, hotTx: S.hotFees.length - snap.hotTx };
    console.log('run two sent:', JSON.stringify(delta));
    if (second) problems.push('run two failed at ' + second);
    if (Object.values(delta).some((n) => n !== 0)) problems.push('run two sent something: ' + JSON.stringify(delta));
    if (process.env.SHOT2) await page.screenshot({ path: process.env.SHOT2, fullPage: true });
  }
  await browser.close();
  if (failed || problems.length || errs.length) { console.log('FAILED', failed || '', problems, errs.slice(0, 5)); process.exit(1); }
  console.log('SNES catalogue canary mock run passed (twice)');
})().catch((e) => { console.error(e); process.exit(1); });

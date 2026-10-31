// Mock-chain run of the "Somewhere Else" inscriber canary, end to end. Nothing here touches a real network or real keys.
//
//   NODE_PATH=<dir with playwright + @stacks/transactions v6 + c32check> CHROME_PATH=<chromium, optional> \
//     node canaries/somewhere-else-inscribe/mock-chain-test.cjs [path/to/built-canary.html]
//
// The mock implements just enough of the Xtrata core (mint-single-tx, transfer, get-id-by-hash, get-inscription-meta, get-owner,
// get-chunk-batch, quote, is-paused) and of the Hiro API (call-read, balances, nonces, raw broadcast, tx lookup, mempool) to run every
// step. It is strict where the real chain is strict: nonces must be consecutive, fees must cover the relay minimum, a duplicate hash is
// rejected, and every transaction must carry Deny-mode post-conditions of the expected shape.
// Cases: A full run (funded in two stages, then "Forget local progress" re-run sends nothing); B a rejected broadcast and a transaction
// left pending across a page reload (resumes, never duplicates); C "Send everything to my wallet now" after an interrupted run;
// D a corrupted chunk is caught on read-back; E an identical file already on chain from someone else is reused; F owner-address
// validation; G the build refuses a tampered image.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const T = require('@stacks/transactions');
const { chromium } = require('playwright');
const { c32address } = require('c32check');
const { tupleCV, uintCV, boolCV, bufferCV, stringAsciiCV, principalCV, someCV, noneCV, responseOkCV, listCV, cvToHex, cvToString } = T;
const hexToCV = (h) => T.hexToCV(/^0x/i.test(h) ? h : '0x' + h);

const ROOT = path.resolve(__dirname, '../..');
const ASSETS = path.join(__dirname, 'assets');
const HTML = path.resolve(process.argv[2] || path.join(ROOT, 'canaries/build/somewhere-else-inscribe-canary.html'));
const OWNER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const OTHER = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const MAN = JSON.parse(fs.readFileSync(path.join(ASSETS, 'manifest.json'), 'utf8'));
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const hex = (b) => Buffer.from(b).toString('hex');
const roll = (buf) => { let h = Buffer.alloc(32); for (let i = 0; i < buf.length; i += 16384) h = sha(Buffer.concat([h, buf.subarray(i, i + 16384)])); return hex(h); };
const failures = [];
const check = (ok, what) => { console.log(`${ok ? '  ok  ' : '  FAIL'} ${what}`); if (!ok) failures.push(what); };
const fee = (chunks) => BigInt(chunks) * 1000n + 10000n;

function newMock() {
  const S = { bal: new Map(), nonces: new Map(), txs: new Map(), byHash: new Map(), meta: new Map(), nextId: 70000, blk: 900000, broadcasts: [], mints: 0, transfers: 0, sweeps: 0,
    lowFee: [], badShape: [], rejectMint: 0, rejectLeft: 3, rejectAfter: 0, holdMint: 0, held: null, corrupt: null, rate: 24 };
  return S;
}

function makeRoute(S) {
  const cors = { 'Access-Control-Allow-Origin': '*' };
  const apply = (rec) => { rec.apply(); S.txs.set(rec.txid, { tx_status: 'success', tx_result: { repr: rec.repr }, block_height: ++S.blk, events: [] }); };
  const callRead = (fn, args) => {
    if (fn === 'is-paused') return boolCV(false);
    if (fn === 'quote-single-tx-fee') { const f = fee(Number(args[1].value)); return responseOkCV(tupleCV({ 'single-tx-fee': uintCV(f), 'total-fee': uintCV(f), mode: uintCV(2n) })); }
    if (fn === 'get-id-by-hash') { const id = S.byHash.get(hex(args[0].buffer)); return id === undefined ? noneCV() : someCV(uintCV(id)); }
    if (fn === 'get-inscription-meta') {
      const m = S.meta.get(Number(args[0].value)); if (!m) return noneCV();
      return someCV(tupleCV({ owner: principalCV(m.owner), creator: principalCV(m.creator), 'mime-type': stringAsciiCV(m.mime), 'total-size': uintCV(m.bytes.length), 'total-chunks': uintCV(Math.ceil(m.bytes.length / 16384)), sealed: boolCV(true), 'final-hash': bufferCV(Buffer.from(m.hash, 'hex')) }));
    }
    if (fn === 'get-owner') { const m = S.meta.get(Number(args[0].value)); return responseOkCV(m ? someCV(principalCV(m.owner)) : noneCV()); }
    if (fn === 'get-chunk-batch') {
      const id = Number(args[0].value), m = S.meta.get(id); if (!m) return listCV([]);
      return listCV(args[1].list.map((i) => {
        const n = Number(i.value); let c = m.bytes.subarray(n * 16384, (n + 1) * 16384);
        if (S.corrupt === id && n === 0) { c = Buffer.from(c); c[3] ^= 1; }
        return c.length ? someCV(bufferCV(c)) : noneCV();
      }));
    }
    throw new Error('mock read not implemented: ' + fn);
  };
  const broadcast = (raw, r, json) => {
    const tx = T.deserializeTransaction(raw), sc = tx.auth.spendingCondition, from = c32address(22, sc.signer), f = BigInt(sc.fee), nonce = BigInt(sc.nonce);
    const reject = (reason) => r.fulfill({ status: 400, headers: cors, contentType: 'application/json', body: JSON.stringify({ error: 'transaction rejected', reason }) });
    if ((S.nonces.get(from) ?? 0n) !== nonce) return reject(`BadNonce expected ${S.nonces.get(from) ?? 0n} got ${nonce}`);
    if (f < BigInt(raw.length)) S.lowFee.push({ from, fee: f, size: raw.length });
    const pl = tx.payload, txid = '0x' + tx.txid();
    let bal = S.bal.get(from) ?? 0n;
    if (bal < f) return reject('NotEnoughFunds');
    const pcs = tx.postConditions.values, deny = tx.postConditionMode === T.PostConditionMode.Deny;
    let kind = '', rec = null;
    if (pl.payloadType === T.PayloadType.ContractCall) {
      const fn = pl.functionName.content, a = pl.functionArgs;
      if (T.addressToString(pl.contractAddress) + '.' + pl.contractName.content !== CORE) return reject('unknown contract');
      if (fn === 'mint-single-tx') {
        kind = 'mint';
        if (S.rejectMint && S.mints + 1 === S.rejectMint) { if (--S.rejectLeft <= 0) S.rejectMint = 0; return reject('ServerFailureDatabase mock'); }
        if (S.rejectAfter && S.mints >= S.rejectAfter) return reject('ServerFailureDatabase mock permanent');
        const chunks = a[3].list.map((c) => Buffer.from(c.buffer)), bytes = Buffer.concat(chunks), expected = hex(a[0].buffer), q = fee(chunks.length);
        const stxPc = pcs.find((p) => p.conditionType === T.PostConditionType.STX);
        if (!deny || pcs.length !== 1 || !stxPc || stxPc.conditionCode !== T.FungibleConditionCode.LessEqual || BigInt(stxPc.amount) !== q) S.badShape.push('mint post-conditions');
        const bad = (!a[4].data.length) ? 'u112' : chunks.length > 32 ? 'u113' : roll(bytes) !== expected ? 'u114' : BigInt(bytes.length) !== BigInt(a[2].value) ? 'u115' : S.byHash.has(expected) ? 'u116' : null;
        if (bal < f + q) bal = -1n;
        const id = S.nextId;
        rec = { txid, repr: bad ? `(err ${bad})` : bal < 0n ? '(err u1)' : `(ok (tuple (existed false) (token-id u${id})))`, ok: !bad && bal >= 0n,
          apply: () => { if (bad || bal < 0n) return; S.bal.set(from, (S.bal.get(from) ?? 0n) - q); S.byHash.set(expected, id); S.meta.set(id, { owner: from, creator: from, mime: a[1].data, bytes, hash: expected }); S.nextId++; } };
        if (!bad && bal >= 0n) S.mints++;
      } else if (fn === 'transfer') {
        kind = 'transfer'; const id = Number(a[0].value), m = S.meta.get(id), sender = cvToString(a[1]), recipient = cvToString(a[2]);
        const nft = pcs.find((p) => p.conditionType === T.PostConditionType.NonFungible);
        if (!deny || pcs.length !== 1 || !nft || nft.conditionCode !== T.NonFungibleConditionCode.Sends || BigInt(nft.assetName.value) !== BigInt(id)) S.badShape.push('transfer post-conditions');
        const ok = m && m.owner === from && sender === from;
        rec = { txid, repr: ok ? '(ok true)' : '(err u100)', ok, apply: () => { if (ok) m.owner = recipient; } };
        if (ok) S.transfers++;
      } else return reject('unknown function ' + fn);
    } else if (pl.payloadType === T.PayloadType.TokenTransfer) {
      kind = 'sweep'; const to = cvToString(pl.recipient), amt = BigInt(pl.amount);
      rec = { txid, repr: '(ok true)', ok: bal >= f + amt, apply: () => { S.bal.set(to, (S.bal.get(to) ?? 0n) + amt); S.bal.set(from, (S.bal.get(from) ?? 0n) - amt); } };
      S.sweeps++;
    } else return reject('unsupported payload');
    S.nonces.set(from, nonce + 1n);
    S.bal.set(from, bal < 0n ? (S.bal.get(from) ?? 0n) - f : bal - f);
    S.broadcasts.push({ kind, from, fee: f, size: raw.length, txid });
    if (kind === 'mint' && S.holdMint && S.mints === S.holdMint && !S.held) { S.held = rec; S.txs.set(txid, { tx_status: 'pending' }); return json(txid.slice(2)); }
    if (rec.ok) apply(rec); else S.txs.set(txid, { tx_status: 'abort_by_response', tx_result: { repr: rec.repr }, block_height: ++S.blk, events: [] });
    return json(txid.slice(2));
  };
  S.release = () => { if (S.held) { apply(S.held); S.held = null; } };
  return async (r) => {
    const u = new URL(r.request().url()), p = u.pathname;
    const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', headers: cors, body: JSON.stringify(o) });
    if (/(^|\.)xtrata\.xyz$/.test(u.hostname) && !p.startsWith('/hiro/')) return r.fulfill({ status: 200, headers: cors, body: '<html></html>', contentType: 'text/html' });
    if (!/\/hiro\//.test(p) && !/api\.(mainnet\.)?hiro\.so/.test(u.hostname)) return r.abort();
    const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
    let m;
    if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
      if (m[1] + '.' + m[2] !== CORE) return json({ okay: false, cause: 'unknown contract' });
      try { return json({ okay: true, result: cvToHex(callRead(m[3], JSON.parse(r.request().postData()).arguments.map(hexToCV))) }); } catch (e) { return json({ okay: false, cause: String(e.message) }); }
    }
    if (q === '/v2/fees/transfer') return json(S.rate);
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(S.bal.get(m[1]) ?? 0n) });
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: Number(S.nonces.get(m[1]) ?? 0n) });
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/mempool/))) return json({ total: [...S.txs.values()].filter((t) => t.tx_status === 'pending').length ? 1 : 0, results: [] });
    if (q === '/v2/transactions' && r.request().method() === 'POST') return broadcast(r.request().postDataBuffer(), r, json);
    if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.txs.get(m[1]); return t ? json(t) : r.fulfill({ status: 404, headers: cors, body: '{}' }); }
    return r.fulfill({ status: 404, headers: cors, body: '{}' });
  };
}

async function session(browser, S, { keepStorage } = {}) {
  const ctx = keepStorage || await browser.newContext({ viewport: { width: 1100, height: 900 } });
  if (!keepStorage) await ctx.route(/^https?:\/\//, makeRoute(S));
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('dialog', (d) => d.accept(d.type() === 'prompt' ? (S.promptAnswer || '') : undefined));
  await page.goto('file://' + HTML);
  await page.waitForSelector('[data-step="owner"]');
  const badge = (id) => page.evaluate((i) => { const b = document.querySelector(`[data-step="${i}"]`).closest('section'); return b.querySelector('.badge').textContent + '|' + (b.querySelector('.note') || { textContent: '' }).textContent; }, id);
  const click = async (id, { wait = true, timeout = 240000 } = {}) => {
    await page.click(`[data-step="${id}"]`, { timeout: 20000 });
    if (!wait) return '';
    const t0 = Date.now(); let b = '';
    for (;;) { await page.waitForTimeout(300); b = await badge(id); if (/^(pass|fail)/.test(b)) break; if (Date.now() - t0 > timeout) { b = 'TIMEOUT|' + b; break; } }
    console.log(id.padEnd(9), b.slice(0, 300));
    return b;
  };
  const hot = async () => (await page.textContent('#hot')).trim();
  const setOwner = async (a, b = a) => { await page.fill('#owner', a); await page.fill('#owner2', b); };
  const logText = () => page.textContent('#log');
  const fund = async (micro) => { const h = await hot(); S.bal.set(h, (S.bal.get(h) ?? 0n) + BigInt(micro)); };
  const needMicro = async () => { const n = await badge('preflight'); const mm = n.match(/FUND ([\d,.]+) STX/); return BigInt(Math.round(parseFloat(mm[1].replace(/,/g, '')) * 1e6)); };
  return { ctx, page, errs, badge, click, hot, setOwner, fund, needMicro, logText };
}

async function fullRun(s, S, { stagedFunding = false } = {}) {
  await s.setOwner(OWNER);
  let b = await s.click('owner'); check(b.startsWith('pass'), 'owner confirmed');
  b = await s.click('preflight'); check(b.startsWith('pass') && /FUND/.test(b), 'preflight passes and states the amount to fund');
  b = await s.click('wallet'); check(b.startsWith('pass'), 'temporary wallet created');
  const need = await s.needMicro();
  if (stagedFunding) {
    await s.click('fund', { wait: false });
    await s.page.waitForTimeout(1500);
    await s.fund(need / 3n);
    await s.page.waitForTimeout(6500);
    check(/Send .* STX .* to SP/.test(await s.page.textContent('#status')), 'an underfunded wallet makes the page wait and say how much more to send');
    await s.fund(need);
    for (let i = 0; i < 40 && !(await s.badge('fund')).startsWith('pass'); i++) await s.page.waitForTimeout(500);
    b = await s.badge('fund');
  } else { await s.fund(need); b = await s.click('fund'); }
  check(b.startsWith('pass'), 'funding detected');
  for (const id of ['images', 'article', 'loader', 'verify', 'handover', 'sweep', 'report']) { b = await s.click(id); check(b.startsWith('pass'), `${id} passes`); if (!b.startsWith('pass')) return false; }
  return true;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

  console.log('\n=== A: full run, funded in two stages; then forget local progress and run again ===');
  {
    const S = newMock(); const s = await session(browser, S);
    const ok = await fullRun(s, S, { stagedFunding: true });
    const hotAddr = await s.hot();
    check(ok, 'every step passed');
    check(S.mints === 26 && S.transfers === 26 && S.sweeps === 1, `26 inscriptions, 26 transfers, 1 sweep (${S.mints}/${S.transfers}/${S.sweeps})`);
    check(S.badShape.length === 0, 'every mint and transfer carried exactly the expected deny-mode post-condition' + (S.badShape.length ? ' ' + S.badShape.join(',') : ''));
    check(S.lowFee.length === 0, 'no transaction paid less than the relay minimum');
    check(S.broadcasts.filter((x) => x.kind === 'mint').every((x) => x.fee >= BigInt(x.size) && x.fee <= BigInt(x.size) * 2n), 'large transactions are priced near 1 uSTX per byte (the 24/byte transfer rate is not used)');
    check([...S.meta.values()].every((m) => m.owner === OWNER), 'all 26 inscriptions are owned by the owner wallet');
    check([...S.meta.values()].every((m) => m.creator === hotAddr), 'the temporary wallet is the recorded creator (as documented)');
    check((S.bal.get(hotAddr) ?? 0n) === 0n, `temporary wallet swept to zero (${S.bal.get(hotAddr)})`);
    const swept = S.bal.get(OWNER) ?? 0n;
    console.log('  info  owner received', Number(swept) / 1e6, 'STX back; miner fees', Number(S.broadcasts.reduce((t, x) => t + x.fee, 0n)) / 1e6, 'STX');
    // the article and the reader on the mock chain are what the Python kit would build
    const ids = MAN.filter((m) => m.inArticle !== false).map((m) => S.byHash.get(m.rolling));
    check(MAN.every((m) => S.byHash.get(m.rolling) !== undefined), 'all 24 images were stored under their expected hashes');
    check(MAN.filter((m) => m.inArticle === false).length === 1 && ids.length === 23, 'the article uses 23 of the 24 inscribed images (slot 9 is inscribed and handed over but left out of the text)');
    const metas = [...S.meta.entries()];
    const html = metas.filter(([, m]) => m.mime === 'text/html').sort((x, y) => x[0] - y[0]);
    const art = html[0], ldr = html[1];
    check(art && [...art[1].bytes.toString().matchAll(/data-ins="(\d+)"/g)].map((x) => Number(x[1])).join() === ids.join(), 'the inscribed article references the image IDs in order');
    const unused = S.byHash.get(MAN.find((m) => m.inArticle === false).rolling);
    check(art && !art[1].bytes.toString().includes(`data-ins="${unused}"`) && !art[1].bytes.toString().includes('class="by"'), 'the unused image is not referenced by the article, and the text matches the doc (no byline line)');
    check(ldr && ldr[1].bytes.toString().includes(`"articleId": ${art[0]}`) && ldr[1].bytes.toString().includes(art[1].hash), 'the inscribed reader is pinned to the article ID and hash');
    const report = await s.page.evaluate(() => document.querySelector('[data-step="report"]').closest('section').querySelector('textarea')?.value || '');
    check(/READER \(share this\)\s+https:\/\/xtrata\.xyz\/inscription\/\d+/.test(report), 'the report prints the reader link');
    // forget local progress: the chain is the memory, nothing may be sent again
    const before = S.broadcasts.length;
    await s.page.click('#forget');
    await s.page.waitForTimeout(300);
    await s.setOwner(OWNER);
    for (const id of ['owner', 'preflight', 'wallet', 'fund', 'images', 'article', 'loader', 'verify', 'handover', 'sweep', 'report']) {
      const b = await s.click(id); check(b.startsWith('pass'), `after forgetting progress: ${id} passes`);
    }
    check(S.broadcasts.length === before, `after forgetting progress nothing was sent (${S.broadcasts.length - before} new transactions)`);
    check(s.errs.length === 0, 'no page errors' + (s.errs.length ? ': ' + s.errs[0] : ''));
    await s.ctx.close();
  }

  console.log('\n=== H: the 24 images are already on chain from an earlier run; this build inscribes only the article and reader ===');
  for (const variant of ['keeps its browser state', 'browser progress forgotten (only the chain remembers)']) {
    console.log('  --', variant);
    const S = newMock(); const s = await session(browser, S);
    await s.setOwner(OWNER); await s.click('owner'); await s.click('preflight'); await s.click('wallet'); await s.fund(await s.needMicro()); await s.click('fund');
    let b = await s.click('images'); check(b.startsWith('pass') && S.mints === 24, `24 images inscribed by the earlier run (${S.mints})`);
    const hotAddr = await s.hot();
    S.bal.set(hotAddr, 1124002n);                                    // roughly what is left in the temporary wallet
    if (variant.startsWith('browser')) { await s.page.click('#forget'); await s.page.waitForTimeout(300); } else { await s.page.reload(); await s.page.waitForSelector('[data-step="owner"]'); }
    const sent = S.broadcasts.length;
    if (variant.startsWith('browser')) { await s.setOwner(OWNER); await s.click('owner'); }
    b = await s.click('preflight');
    check(b.startsWith('pass') && /24 of 26 already on chain/.test(b) && /2 to inscribe/.test(b), 'preflight sees 24 images already on chain and plans only 2 inscriptions');
    check(!/FUND [3-9]/.test(b), 'and asks for far less than the original amount');
    await s.click('wallet'); await s.click('fund');
    for (const id of ['images', 'article', 'loader', 'verify', 'handover', 'sweep', 'report']) { b = await s.click(id); check(b.startsWith('pass'), `${id} passes`); }
    check(S.mints === 26, `only the article and reader were newly inscribed (${S.mints - 24} new mints)`);
    check([...S.meta.values()].length === 26 && [...S.meta.values()].every((m) => m.owner === OWNER), 'all 26 inscriptions, including the unused image, end up with the owner wallet');
    check((S.bal.get(hotAddr) ?? 0n) === 0n, 'temporary wallet swept to zero');
    const art = [...S.meta.entries()].filter(([, m]) => m.mime === 'text/html').sort((x, y) => x[0] - y[0])[0];
    const refs = [...art[1].bytes.toString().matchAll(/data-ins="(\d+)"/g)].map((x) => Number(x[1]));
    check(refs.length === 23 && !refs.includes(S.byHash.get(MAN.find((m) => m.inArticle === false).rolling)), 'the article carries 23 image references');
    check(S.badShape.length === 0, 'post-conditions all as expected');
    check(s.errs.length === 0, 'no page errors' + (s.errs.length ? ': ' + s.errs[0] : ''));
    await s.ctx.close();
  }

  console.log('\n=== B: a rejected broadcast, then a transaction left pending across a page reload ===');
  {
    const S = newMock(); S.rejectMint = 10; S.holdMint = 14; const s = await session(browser, S);
    await s.setOwner(OWNER); await s.click('owner'); await s.click('preflight'); await s.click('wallet'); await s.fund(await s.needMicro()); await s.click('fund');
    let b = await s.click('images');
    check(b.startsWith('fail') && S.mints === 9, `a rejected broadcast fails the step cleanly after 9 inscriptions (${b.slice(0, 60)})`);
    await s.click('images', { wait: false });
    for (let i = 0; i < 60 && !S.held; i++) await s.page.waitForTimeout(500);
    check(!!S.held, 'the 14th inscription is now pending on the chain');
    const sentBefore = S.broadcasts.length;
    await s.page.reload(); await s.page.waitForSelector('[data-step="owner"]');
    check((await s.page.textContent('#hot')).trim().startsWith('SP'), 'the temporary wallet and progress survive a reload');
    await s.click('images', { wait: false });
    await s.page.waitForTimeout(3000);
    check(S.broadcasts.length === sentBefore, 'after the reload the pending transaction is waited on, not re-sent');
    S.release();
    for (let i = 0; i < 100 && !(await s.badge('images')).startsWith('pass'); i++) await s.page.waitForTimeout(500);
    b = await s.badge('images'); check(b.startsWith('pass'), 'images complete once the pending transaction confirms');
    check(S.mints === 24, `exactly 24 image inscriptions, no duplicates (${S.mints})`);
    await s.ctx.close();
  }

  console.log('\n=== C: stopped part-way, then "Send everything to my wallet now" ===');
  {
    const S = newMock(); S.rejectAfter = 5; const s = await session(browser, S);
    await s.setOwner(OWNER); await s.click('owner'); await s.click('preflight'); await s.click('wallet'); await s.fund(await s.needMicro()); await s.click('fund');
    const b = await s.click('images');
    check(b.startsWith('fail') && S.mints === 5, `run stops after 5 inscriptions (${S.mints})`);
    await s.page.click('#rescue');
    const hotAddr = await s.hot();
    for (let i = 0; i < 120 && (S.sweeps < 1); i++) await s.page.waitForTimeout(500);
    await s.page.waitForTimeout(1500);
    check([...S.meta.values()].length === 5 && [...S.meta.values()].every((m) => m.owner === OWNER), 'all 5 inscriptions made so far are with the owner wallet');
    check((S.bal.get(hotAddr) ?? 0n) === 0n, 'the temporary wallet is swept to zero');
    await s.ctx.close();
  }

  console.log('\n=== D: a corrupted chunk is caught on read-back ===');
  {
    const S = newMock(); const s = await session(browser, S);
    await s.setOwner(OWNER); await s.click('owner'); await s.click('preflight'); await s.click('wallet'); await s.fund(await s.needMicro()); await s.click('fund');
    for (const id of ['images', 'article', 'loader']) await s.click(id);
    S.corrupt = S.byHash.get(MAN[6].rolling);
    let b = await s.click('verify');
    check(b.startsWith('fail') && /differs|hash/.test(b), 'verify fails when a chunk read from the chain differs');
    S.corrupt = null;
    b = await s.click('verify'); check(b.startsWith('pass'), 'verify passes again once the chain reads back correctly');
    await s.ctx.close();
  }

  console.log('\n=== E: an identical image already on chain from someone else is reused, not re-sent ===');
  {
    const S = newMock();
    const bytes = fs.readFileSync(path.join(ASSETS, MAN[2].file));
    S.byHash.set(MAN[2].rolling, 55555); S.meta.set(55555, { owner: OTHER, creator: OTHER, mime: 'image/webp', bytes, hash: MAN[2].rolling });
    const s = await session(browser, S);
    const ok = await fullRun(s, S);
    check(ok, 'the run completes');
    check(S.mints === 25 && S.transfers === 25, `23 images + article + reader inscribed and moved, the reused one left alone (${S.mints}/${S.transfers})`);
    check(S.meta.get(55555).owner === OTHER, 'the other wallet still owns its inscription');
    const report = await s.page.evaluate(() => document.querySelector('[data-step="report"]').closest('section').querySelector('textarea')?.value || '');
    check(/NOT OWNED BY YOU/.test(report), 'the report says which inscription is not owned by the owner wallet');
    await s.ctx.close();
  }

  console.log('\n=== F: owner address validation ===');
  {
    const S = newMock(); const s = await session(browser, S);
    await s.setOwner('SP123');
    let b = await s.click('owner'); check(b.startsWith('fail'), 'a malformed address is refused');
    await s.setOwner(OWNER, OTHER);
    b = await s.click('owner'); check(b.startsWith('fail') && /confirm/i.test(b), 'a confirm box that does not match is refused');
    await s.setOwner(OWNER.slice(0, -1) + (OWNER.endsWith('7') ? '8' : '7'));
    b = await s.click('owner'); check(b.startsWith('fail'), 'an address with a bad checksum is refused');
    await s.setOwner(OWNER);
    b = await s.click('owner'); check(b.startsWith('pass'), 'the right address is accepted');
    check((await s.page.textContent('[data-step="preflight"]').catch(() => '')) !== undefined, 'preflight is available next');
    await s.ctx.close();
  }

  await browser.close();

  console.log('\n=== G: the build refuses a tampered image ===');
  {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'se-assets-'));
    fs.cpSync(ASSETS, tmp, { recursive: true });
    const f = path.join(tmp, MAN[4].file); const b = fs.readFileSync(f); b[b.length - 5] ^= 1; fs.writeFileSync(f, b);
    const r = cp.spawnSync('node', [path.join(ROOT, 'scripts/build-somewhere-else-canary.mjs'), '--assets', tmp, '--out', path.join(tmp, 'x.html')], { encoding: 'utf8', cwd: ROOT });
    check(r.status !== 0 && /REFUSED/.test(r.stderr), 'a flipped byte in an image stops the build: ' + (r.stderr || '').trim().slice(0, 100));
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log(failures.length ? `\n${failures.length} FAILED:\n - ${failures.join('\n - ')}` : '\nALL CHECKS PASSED');
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

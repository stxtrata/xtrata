// Long runs: a replay too big for a score entry is inscribed on the Xtrata core (mint-single-tx), and the
// score entry stores a small pointer to it. Played end to end in the single-file build against a mocked chain
// and a mocked Xverse wallet on a top-level page.
// Run: NODE_PATH=<playwright + @stacks/transactions v6> CHROME_PATH=<chromium> node tests/long-replay.test.cjs [dist/xtrata-arcade-vX.html]
const { chromium } = require('playwright');
const T = require('@stacks/transactions');
const crypto = require('crypto');
const fs = require('fs'), path = require('path'), assert = require('assert');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'manifest.json'), 'utf8'));
const FILE = process.argv[2] || path.join(ROOT, 'dist', manifest.single.file);
let ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OWNER = ADDR;
const SCORES = OWNER + '.xtrata-arcade-scores-v2', CORE = OWNER + '.xtrata-v3-2-3';
let passed = 0;
const check = (c, name) => { assert(c, name); passed++; console.log('  ✓ ' + name); };

const chain = { nextId: 5000, byHash: {}, ins: {}, boards: {}, txs: {}, gateway: 'serve', calls: [] };
const sha = (b) => crypto.createHash('sha256').update(b).digest();
function chainHash(bytes) { let h = Buffer.alloc(32); for (let i = 0; i < bytes.length; i += 16384) h = sha(Buffer.concat([h, bytes.subarray(i, i + 16384)])); return h; }
const hex = (b) => Buffer.from(b).toString('hex');
const cv = (h) => T.hexToCV(h.startsWith('0x') ? h : '0x' + h);
const newTx = (ok, repr) => { const id = '0x' + crypto.randomBytes(32).toString('hex'); chain.txs[id] = { tx_status: ok ? 'success' : 'abort_by_response', tx_result: { repr } }; return id; };

function walletCall(m, p) {
  if (m === 'wallet_connect' || m === 'getAddresses') return { result: { addresses: [{ symbol: 'STX', purpose: 'stacks', address: ADDR }] } };
  if (m !== 'stx_callContract') return { error: { message: 'unsupported ' + m } };
  const args = (p.functionArgs || p.arguments).map(cv);
  chain.calls.push({ contract: p.contract, fn: p.functionName, bytes: JSON.stringify(p).length, pcs: p.postConditions });
  if (p.contract === CORE && p.functionName === 'mint-single-tx') {
    const [hash, mime, size, list, uri] = args;
    const bytes = Buffer.concat(list.list.map((b) => Buffer.from(b.buffer)));
    if (bytes.length !== Number(size.value)) return { result: { txid: newTx(false, '(err u102)') } };
    if (hex(chainHash(bytes)) !== hex(hash.buffer)) return { result: { txid: newTx(false, '(err u103)') } };
    const id = chain.nextId++;
    chain.ins[id] = { bytes, mime: mime.data, creator: ADDR, hash: hex(hash.buffer) };
    chain.byHash[hex(hash.buffer)] = id;
    return { result: { txid: newTx(true, `(ok (tuple (existed false) (token-id u${id})))`) } };
  }
  if (p.contract === SCORES && p.functionName === 'submit-score') {
    const [board, , score, name, replay] = args;
    const r = Buffer.from(replay.buffer);
    const pilot = hex(r.subarray(4, 24));
    if (pilot !== T.createAddress(ADDR).hash160) return { result: { txid: newTx(false, '(err u113)') } };
    (chain.boards[board.data] ||= []).push({ player: ADDR, name: name.data, score: Number(score.value), replay: r });
    return { result: { txid: newTx(true, '(ok u1)') } };
  }
  return { error: { message: 'unexpected call ' + p.contract + ' ' + p.functionName } };
}

function read(contract, fn, args) {
  const ok = (v) => T.responseOkCV(v);
  if (contract === SCORES) {
    if (fn === 'get-board') return T.someCV(T.tupleCV({ mode: T.uintCV(0), 'max-score': T.uintCV(1e12), fee: T.uintCV(0), 'engine-id': T.uintCV(3081), daily: T.falseCV(), enabled: T.trueCV() }));
    if (fn === 'current-period') return T.uintCV(1);
    if (fn === 'get-top10') {
      const rows = (chain.boards[args[0].data] || []).slice().sort((a, b) => b.score - a.score);
      return T.listCV(Array.from({ length: 10 }, (_, i) => rows[i] ? T.someCV(T.tupleCV({ player: T.principalCV(rows[i].player), name: T.stringAsciiCV(rows[i].name), score: T.uintCV(rows[i].score),
        'stacks-height': T.uintCV(1), 'burn-height': T.uintCV(1), 'engine-id': T.uintCV(3081), 'replay-hash': T.bufferCV(sha(rows[i].replay)) })) : T.noneCV()));
    }
    if (fn === 'get-replay') { const row = (chain.boards[args[0].data] || []).find((x) => x.player === T.cvToString(args[2])); return row ? T.someCV(T.bufferCV(row.replay)) : T.noneCV(); }
  }
  if (contract === CORE) {
    if (fn === 'quote-single-tx-fee') { const n = Number(args[1].value); return ok(T.tupleCV({ 'total-fee': T.uintCV(10000 + 1000 * n), 'single-tx-fee': T.uintCV(10000 + 1000 * n) })); }
    if (fn === 'get-id-by-hash') { const id = chain.byHash[hex(args[0].buffer)]; return id ? T.someCV(T.uintCV(id)) : T.noneCV(); }
    if (fn === 'get-inscription-meta') { const x = chain.ins[Number(args[0].value)]; return x ? T.someCV(T.tupleCV({ creator: T.principalCV(x.creator), 'mime-type': T.stringAsciiCV(x.mime), 'total-size': T.uintCV(x.bytes.length),
      'total-chunks': T.uintCV(Math.ceil(x.bytes.length / 16384)), sealed: T.trueCV(), 'final-hash': T.bufferCV(Buffer.from(x.hash, 'hex')) })) : T.noneCV(); }
    if (fn === 'get-chunk-batch') { const x = chain.ins[Number(args[0].value)]; chain.chunkReads = (chain.chunkReads || 0) + 1;
      return T.listCV(args[1].list.map((i) => T.bufferCV(x.bytes.subarray(Number(i.value) * 16384, Number(i.value) * 16384 + 16384)))); }
  }
  throw new Error('unmocked read ' + contract + ' ' + fn);
}

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 820 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.exposeFunction('__wallet', (m, prm) => walletCall(m, prm));
  await p.route(/^https?:\/\//, async (r) => {
    const u = new URL(r.request().url());
    let m = /\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(u.pathname);
    if (m) {
      try { const body = JSON.parse(r.request().postData()); const res = read(m[1] + '.' + m[2], m[3], body.arguments.map(cv));
        return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ okay: true, result: T.cvToHex(res) }) }); }
      catch (e) { return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ okay: false, cause: String(e.message) }) }); }
    }
    m = /\/extended\/v1\/tx\/(0x[0-9a-f]+)/.exec(u.pathname);
    if (m) return chain.txs[m[1]] ? r.fulfill({ contentType: 'application/json', body: JSON.stringify(chain.txs[m[1]]) }) : r.fulfill({ status: 404, body: '{}' });
    m = /^\/i\/(\d+)$/.exec(u.pathname);
    if (m && u.hostname === 'xtrata.xyz') {
      chain.gatewayHits = (chain.gatewayHits || 0) + 1;
      const x = chain.ins[Number(m[1])];
      if (!x || chain.gateway === 'down') return r.fulfill({ status: 404, body: '' });
      const body = chain.gateway === 'tamper' ? Buffer.concat([x.bytes.subarray(0, 100), Buffer.from('tampered')]) : x.bytes;
      return r.fulfill({ contentType: 'application/octet-stream', body, headers: { 'access-control-allow-origin': '*' } });
    }
    return r.abort();
  });
  await p.addInitScript(() => {
    window.XverseProviders = { BitcoinProvider: { request: (m, prm) => window.__wallet(m, JSON.parse(JSON.stringify(prm || null))) } };
  });
  let src = fs.readFileSync(FILE, 'utf8');
  src = src.replace('    var s = session;\n', '    var s = session; window.__sess = function () { return session; };\n').replace(/s\.instance = game\.create\(api\)/g, 'window.__api = api, s.instance = game.create(api)');
  const tmp = path.join(require('os').tmpdir(), 'xa-long-replay.html'); fs.writeFileSync(tmp, src);
  await p.goto('file://' + tmp); await p.waitForTimeout(3000);
  check(await p.evaluate(() => XAScores.status().route === 'direct'), 'top-level page finds the Xverse wallet');
  await p.evaluate(() => XAScores.connect());
  // Treat anything over 100 bytes as a long run, so a short bot run exercises the whole inscription path.
  await p.evaluate(() => XAScores.configure({ inlineMax: 100 }));

  let ran = 'no run';
  for (let attempt = 0; attempt < 5 && ran !== 'ok'; attempt++) {
    await p.evaluate(() => XARoom.start('xa_cave_diver')); await p.waitForTimeout(1200);
    await p.evaluate(() => { const b = [...document.querySelectorAll('.xa-overlay button')].find((x) => /START/i.test(x.textContent)); b.click(); });
    ran = await p.evaluate(async () => {
      const t0 = Date.now(); while (__sess().state !== 'play' && Date.now() - t0 < 20000) await new Promise((r) => setTimeout(r, 100));
      const s = __sess(); if (!s.rec) return 'not ranked';
      const B = ['up', 'down', 'left', 'right', 'a', 'hold'];
      // A real run with a restless mouse: every pointer move is recorded, which is what makes long replays big.
      const iv = setInterval(() => {
        s.input.pointer.x += (Math.random() - 0.5) * 40; s.input.pointer.y += (Math.random() - 0.5) * 40; s.input.pointer.moved++;
        for (const k of B) if (Math.random() < 0.06) { s.input.press(k); setTimeout(() => s.input.release(k), 60 + Math.random() * 250); }
      }, 16);
      const t1 = Date.now(); while (s.state === 'play' && Date.now() - t1 < 60000) await new Promise((r) => setTimeout(r, 100));
      clearInterval(iv);
      return s.state === 'over' && s.score > 0 ? 'ok' : 'score ' + s.score + ' state ' + s.state;
    });
  }
  check(ran === 'ok', 'a ranked run is recorded');
  await p.waitForFunction(() => { const b = [...document.querySelectorAll('.xa-submit button')].find((x) => /Post score/i.test(x.textContent)); return b && !b.disabled; }, null, { timeout: 120000 });
  await p.waitForFunction(() => /STX/.test((document.querySelector('.xa-long') || {}).textContent || ''), null, { timeout: 20000 });
  const note = await p.evaluate(() => (document.querySelector('.xa-long') || {}).textContent || '');
  check(/Long run/.test(note) && /Inscribe the replay/.test(note) && /Seal it/.test(note) && /STX/.test(note), 'game over offers inscribe or seal, with the cost (' + note.slice(0, 90) + '…)');
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('xa:unposted') || '[]').length === 1), 'the unposted Top 10 run is kept in this browser');
  await p.fill('#xa-name', 'LONGRUN');
  await p.evaluate(() => [...document.querySelectorAll('.xa-submit button')].find((x) => /Post score/i.test(x.textContent)).click());
  await p.waitForFunction(() => /Submitted/.test((document.querySelector('.xa-submit .xa-msg') || {}).textContent || ''), null, { timeout: 120000 });
  const mint = chain.calls.find((c) => c.fn === 'mint-single-tx'), sub = chain.calls.find((c) => c.fn === 'submit-score');
  check(mint && mint.pcs && mint.pcs.length === 1 && sub && chain.calls.indexOf(mint) < chain.calls.indexOf(sub), 'two approvals: mint-single-tx (fee capped by a post-condition), then submit-score');
  const row = chain.boards.xa_cave_diver[0];
  const insId = Object.keys(chain.ins)[0], full = chain.ins[insId].bytes;
  check((row.replay[3] & 127) === 3 && row.replay.length < 120 && row.replay.subarray(4, 44).equals(full.subarray(4, 44)), `the score entry stores a ${row.replay.length}-byte pointer with the run's header`);
  check((full[3] & 127) === 2 && full.length > 100, `the inscription #${insId} holds the full ${full.length}-byte replay (format 2)`);
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('xa:unposted') || '[]').length === 0), 'posting removes the kept copy');

  const resolve = async () => p.evaluate(async (bs) => {
    const ptr = new Uint8Array(bs);
    try { const full = await XA.replay.resolve(ptr); const v = await XA.replay.verify(ptr, { board: 'xa_cave_diver' }); return { n: full.length, ok: v.ok, why: v.reason }; }
    catch (e) { return { err: e.message }; }
  }, [...row.replay]);
  let r1 = await resolve();
  check(r1.n === full.length && r1.ok, 'the pointer resolves through the gateway and the run verifies');
  chain.gateway = 'tamper'; chain.chunkReads = 0;
  await p.evaluate(() => location.reload()); await p.waitForTimeout(2500);
  r1 = await resolve();
  check(r1.n === full.length && r1.ok && chain.chunkReads > 0, 'a tampered gateway copy is ignored: read from the chain instead');
  chain.gateway = 'down';
  await p.evaluate(() => location.reload()); await p.waitForTimeout(2500);
  r1 = await resolve();
  check(r1.n === full.length && r1.ok, 'gateway down: still resolves from the chain');
  // Posting the same run again re-uses the inscription (nothing is paid twice).
  const before = chain.calls.filter((c) => c.fn === 'mint-single-tx').length;
  await p.evaluate(() => XAScores.connect());
  await p.evaluate(() => XAScores.configure({ inlineMax: 100 }));
  const again = await p.evaluate(async (bs) => { try { const r = await XAScores.submit({ board: 'xa_cave_diver', score: XA.replay.readHeader(new Uint8Array(bs)).score, name: 'AGAIN', replay: new Uint8Array(bs) }); return r.ok; } catch (e) { return e.message; } }, [...full]);
  check(again === true && chain.calls.filter((c) => c.fn === 'mint-single-tx').length === before, 're-posting re-uses the stored replay inscription (no second mint)');
  // A tampered pointer (someone else's replay under another header) is refused.
  const bad = await p.evaluate(async (bs) => { const b2 = new Uint8Array(bs); b2[36] ^= 1; try { await XA.replay.resolve(b2); return 'accepted'; } catch (e) { return e.message; } }, [...row.replay]);
  check(/different run/.test(bad), 'a pointer whose header does not match the inscription is refused');
  // Sealed posting: only the replay's fingerprint goes on chain; the player keeps the file. One approval, no inscription.
  chain.gateway = 'serve';
  const mintsBefore = chain.calls.filter((c) => c.fn === 'mint-single-tx').length, subsBefore = chain.calls.filter((c) => c.fn === 'submit-score').length;
  await p.evaluate(() => XAScores.connect());
  const seal = await p.evaluate(async (bs) => { try { const r = await XAScores.submit({ board: 'xa_cave_diver', score: XA.replay.readHeader(new Uint8Array(bs)).score, name: 'SEALED', replay: new Uint8Array(bs), seal: true }); return r.ok && r.sealed; } catch (e) { return e.message; } }, [...full]);
  const subs = chain.calls.filter((c) => c.fn === 'submit-score');
  check(seal === true && chain.calls.filter((c) => c.fn === 'mint-single-tx').length === mintsBefore && subs.length === subsBefore + 1, 'a sealed post is one approval: submit-score only, no inscription');
  const srow = chain.boards.xa_cave_diver.find((r) => r.name === 'SEALED') || chain.boards.xa_cave_diver[chain.boards.xa_cave_diver.length - 1];
  check(srow.replay.length < 140 && (srow.replay[3] & 127) === 3 && srow.replay[44] === 2 && srow.replay.subarray(4, 44).equals(full.subarray(4, 44)), `the score entry stores a ${srow.replay.length}-byte seal with the run's header`);
  const sres = await p.evaluate(async ({ st, fl }) => {
    const stored = new Uint8Array(st), file = new Uint8Array(fl), out = {};
    out.isSeal = XA.replay.isSeal(stored);
    out.good = XA.replay.mismatch(stored, file);
    const bad = file.slice(); bad[bad.length - 3] ^= 1; out.tamper = XA.replay.mismatch(stored, bad);
    const short = file.subarray(0, file.length - 1); out.short = XA.replay.mismatch(stored, short);
    const v = await XA.replay.verify(stored, { board: 'xa_cave_diver', file }); out.verify = v.ok;
    return out;
  }, { st: [...srow.replay], fl: [...full] });
  check(sres.isSeal && sres.good === null && sres.verify, 'the player\'s file matches its seal and re-plays to the sealed score');
  check(/fingerprint/.test(sres.tamper || '') && /size/.test(sres.short || ''), 'an altered or truncated file is refused (' + sres.tamper + ' / ' + sres.short + ')');
  // With no file and no inscription of those bytes the entry reads as sealed, not as an error.
  const nofile = await p.evaluate(async (st) => { const r = await XA.replay.verify(new Uint8Array(st), { board: 'xa_cave_diver', findByHash: async () => null }); return { ok: r.ok, sealed: r.sealed }; }, [...srow.replay]);
  check(!nofile.ok && nofile.sealed, 'without the file the run shows as sealed');
  // If the same bytes are later inscribed on Xtrata, the seal resolves from the chain on its own.
  const viaChain = await p.evaluate(async (st) => { const r = await XA.replay.verify(new Uint8Array(st), { board: 'xa_cave_diver' }); return r.ok; }, [...srow.replay]);
  check(viaChain === true, 'a seal resolves from chain once the same replay is inscribed (found by its hash)');
  // A real multi-chunk replay from mainnet (if available): a 12-minute Chain Sentinel run, stored over three chunks.
  const real = process.env.REAL_REPLAY;
  if (real && fs.existsSync(real)) {
    const bytes = fs.readFileSync(real);
    ADDR = T.addressToString({ type: 0, version: bytes[24], hash160: bytes.subarray(4, 24).toString('hex') });
    await p.evaluate(() => { XAScores.disconnect(); });
    await p.evaluate(() => XAScores.connect());
    await p.evaluate(() => XAScores.configure({ inlineMax: 10000 }));
    const hd = await p.evaluate((bs) => XA.replay.readHeader(new Uint8Array(bs)), [...bytes]);
    const res = await p.evaluate(async (bs) => { try { return (await XAScores.submit({ board: 'xa_block_defence', score: XA.replay.readHeader(new Uint8Array(bs)).score, name: 'REAL', replay: new Uint8Array(bs) })).ok; } catch (e) { return e.message; } }, [...bytes]);
    const rrow = (chain.boards.xa_block_defence || [])[0];
    const rid = chain.byHash[hex(chainHash(bytes))];
    check(res === true && rrow && (rrow.replay[3] & 127) === 3 && chain.ins[rid].bytes.equals(bytes), `a real ${bytes.length}-byte replay is inscribed over ${Math.ceil(bytes.length / 16384)} chunks as #${rid} and posted as a pointer`);
    chain.gateway = 'down'; chain.chunkReads = 0;
    const v = await p.evaluate(async (bs) => { const r = await XA.replay.verify(new Uint8Array(bs), { board: 'xa_block_defence' }); return r.ok ? r.score : r.reason; }, [...rrow.replay]);
    check(v === hd.score && chain.chunkReads > 0, `read back chunk by chunk from the chain and re-played to exactly ${v}`);
  }
  check(errs.length === 0, 'no page errors ' + errs.slice(0, 2).join(' | '));
  console.log(`\nlong replay tests passed: ${passed}`);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

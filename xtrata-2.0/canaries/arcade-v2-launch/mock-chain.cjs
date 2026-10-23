// The mock chain shared by the arcade v2 launch canary's tests (mock-chain-test.cjs drives the page in Chromium,
// runner-test.cjs drives the Node runner). A clarinet-sdk simnet runs every contract as real Clarity at the address the canary
// expects; only the network is mocked. `handle()` answers one HTTP request (the Hiro API routes the canary uses, and the
// xtrata.xyz gateway) from the simnet, so any transport (a Playwright route, a fetch stub) can sit in front of it.
//
// Needs `npm install` in contracts/arcade-world (@stacks/clarinet-sdk, @stacks/transactions v7) and in xtrata-2.0 (v6).
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { createRequire } = require('module');

const ROOTDIR = path.resolve(__dirname, '../..');
const AW = path.join(ROOTDIR, 'contracts/arcade-world');
const T = createRequire(path.join(ROOTDIR, 'package.json'))('@stacks/transactions');   // v6, as the canary
const rqAW = createRequire(path.join(AW, 'package.json'));
const V7 = rqAW('@stacks/transactions');                                             // v7, as the simnet
const { initSimnet } = rqAW('@stacks/clarinet-sdk');
const { Cl } = V7;
const XA = path.join(ROOTDIR, 'recursive-apps/xtrata-arcade');
const BUNDLE = fs.readFileSync(path.join(XA, 'release/xtrata-arcade.html'));
const BOARDS = JSON.parse(fs.readFileSync(path.join(XA, 'boards.json'), 'utf8'));
const LIVE = (f) => fs.readFileSync(path.join(ROOTDIR, 'contracts/live', f), 'utf8');
const CHUNK = 16384;
const sha = (b) => crypto.createHash('sha256').update(b).digest();
const chunksOf = (buf) => { const out = []; for (let i = 0; i < buf.length; i += CHUNK) out.push(buf.subarray(i, i + CHUNK)); return out; };
const runHash = (chunks) => chunks.reduce((h, c) => sha(Buffer.concat([h, c])), Buffer.alloc(32));
const hex0 = (h) => (h.startsWith('0x') ? h : '0x' + h);
const pp = (cv) => Cl.prettyPrint(cv);
// The simnet prints every Clarity `print` to stdout; keep test output readable.
const muted = (fn) => { const a = console.log, b = process.stdout.write, c = console.error; console.log = () => {}; console.error = () => {}; process.stdout.write = () => true; try { return fn(); } finally { console.log = a; console.error = c; process.stdout.write = b; } };

/**
 * opts.testnet: start from an empty testnet (only the SIP-009 trait; the canary deploys the core and its fixtures).
 * opts.root:    the root owner (default: the canary build's root for that network).
 * Otherwise the chain starts where mainnet is: #55 owned by the root, the v1.3 bundle at #3078, an earlier engine #3110 and
 * parent #3111, the leaderboard with its 26 boards on #3111.
 */
function createMockChain(opts = {}) {
  const TESTNET = !!opts.testnet;
  const ROOT = opts.root || (TESTNET ? 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQPAYDW7J' : 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
  const ROYALTY = 'SP1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2XG1V316';   // the core's fee recipient, so "pay at most" post-conditions see real STX
  const WRONG = 'SP2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CH94GRJ';      // any other wallet
  const TRAIT = TESTNET ? 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT' : 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
  const CORE = ROOT + '.xtrata-v3-2-3';
  const SCORES = ROOT + '.xtrata-arcade-scores-v2';
  let simnet;
  const S = {
    sources: new Map(), tx: new Map(), events: new Map(), nonce: 7, txn: 0,
    sigs: {}, current: '', readFails: [], walletCalls: 0, raw: 0, rawBySender: {}, deploys: [], calls: [], violations: [], gateway: 0, reads: [],
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
  const balance = (who) => simnet.getAssetsMap().get('STX')?.get(who) ?? 0n;

  async function setup() {
    const t0 = Date.now();
    simnet = await initSimnet(path.join(__dirname, 'simnet/Clarinet.toml'));
    const dep = simnet.getAccounts().get('deployer');
    muted(() => { simnet.transferSTX(10_000_000_000_000n, ROOT, dep); simnet.transferSTX(1_000_000n, TRAIT, dep); simnet.transferSTX(1_000_000_000n, WRONG, dep); });
    // Testnet: the canary deploys the SIP-009 trait itself (as <root>.nft-trait, its first core step), so nothing is pre-deployed.
    if (TESTNET) return `simnet ready in ${((Date.now() - t0) / 1000).toFixed(1)}s: testnet, empty chain (the canary deploys the trait and the core); root ${ROOT} funded`;
    deploy('nft-trait', fs.readFileSync(path.join(ROOTDIR, 'contracts/clarinet/contracts/sip009-nft-trait.clar'), 'utf8'), 2, TRAIT);
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
    if (!/u3078\b/.test(pp(sealed))) throw new Error('bundle id ' + pp(sealed));
    for (let i = 3079; i < 3110; i++) mint(Buffer.from(`filler ${i}`), 'text/plain');
    if (mint(Buffer.from('/*@xa-pack engine v1*/ an earlier engine'), 'text/plain', ROOT, [], [55]) !== 3110) throw new Error('#3110');
    if (mint(Buffer.from('<!doctype html><title>arcade v1.5 parent</title>'), 'text/html', ROOT, [3078, 3110], [55]) !== 3111) throw new Error('#3111');
    // the leaderboard, live since v1.0, every board on #3111
    deploy('xtrata-arcade-scores-v2', fs.readFileSync(path.join(ROOTDIR, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8'), 4, ROOT);
    for (const b of BOARDS) call(SCORES, 'set-board', [Cl.stringAscii(b.id), Cl.uint(b.mode), Cl.uint(b.max), Cl.uint(0), Cl.uint(3111), Cl.bool(false), Cl.bool(true)]);
    return `simnet ready in ${((Date.now() - t0) / 1000).toFixed(1)}s: core ${CORE} (next id ${pp(readOnly(CORE, 'get-next-token-id', []))}), #3078 = the v1.3 bundle, 26 boards on #3111`;
  }

  // ---------- one HTTP request: the Hiro API and the gateway, answered from the simnet ----------
  // req = { url, method, body: Buffer | string | null } -> { status, headers, body } or { abort: true }
  const CORS = { 'Access-Control-Allow-Origin': '*' };
  function handle(req) {
    const u = new URL(req.url), p = u.pathname;
    const json = (o, status = 200) => ({ status, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(o) });
    const text = () => (req.body == null ? '' : Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body));
    if (req.method === 'OPTIONS') return { status: 204, headers: { ...CORS, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }, body: '' };
    if (/xtrata\.xyz$/.test(u.hostname) && p.startsWith('/i/')) {
      const id = Number(p.slice(3)); S.gateway++;
      // the testnet rehearsal reads mainnet's #3078 through the gateway (the canary checks its hash)
      if (TESTNET) return id === 3078 ? { status: 200, headers: { ...CORS, 'content-type': 'text/html' }, body: BUNDLE } : { status: 404, headers: CORS, body: '' };
      const b = inscriptionBytes(id);
      return b ? { status: 200, headers: { ...CORS, 'content-type': 'text/html' }, body: b } : { status: 404, headers: CORS, body: '' };
    }
    if (!/\/hiro\//.test(p) && !/api\.(mainnet\.|testnet\.)?hiro\.so/.test(u.hostname)) return { abort: true };
    const q = p.replace(/^\/hiro\/(mainnet|testnet)/, '');
    let m;
    if ((m = q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))) {
      const body = JSON.parse(text());
      S.reads.push({ fn: `${m[2]}.${m[3]}`, step: S.current });
      try {
        const res = readOnly(`${m[1]}.${m[2]}`, m[3], body.arguments.map((h) => V7.hexToCV(hex0(h))), body.sender);
        return json({ okay: true, result: V7.cvToHex(res) });
      } catch (e) { S.readFails.push(`${m[2]}.${m[3]}: ${String(e.message || e).slice(0, 160)}`); return json({ okay: false, cause: String(e.message || e).slice(0, 200) }); }
    }
    if (q === '/v2/info') return json({ burn_block_height: simnet.burnBlockHeight, stacks_tip_height: simnet.blockHeight });
    if ((m = q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))) { const s = S.sources.get(`${m[1]}.${m[2]}`); return s ? json({ source: s, publish_height: 1 }) : json({}, 404); }
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))) return json({ balance: String(balance(m[1])) });
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))) return json({ possible_next_nonce: S.nonce++ });
    if ((m = q.match(/^\/extended\/v1\/address\/([^/]+)\/mempool/))) return json({ total: 0, results: [] });
    if ((m = q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))) { const t = S.tx.get(m[1]); return t ? json(t) : json({}, 404); }
    if ((m = q.match(/^\/extended\/v1\/contract\/([^/]+)\/events$/))) {
      const all = S.events.get(m[1]) || [], off = Number(u.searchParams.get('offset') || 0), lim = Number(u.searchParams.get('limit') || 20);
      return json({ limit: lim, offset: off, results: all.slice(off, off + lim) });
    }
    if (q === '/v2/transactions') {
      const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);
      let tx;
      try { tx = T.deserializeTransaction(raw.toString('hex')); } catch (e) {
        // v6 cannot read a Clarity 4 deploy (the runner builds those with v7): read it with v7
        const t7 = V7.deserializeTransaction(raw.toString('hex'));
        const p7 = t7.payload;
        const signer = t7.auth.spendingCondition.signer;
        const from = T.addressToString(T.addressFromVersionHash(t7.transactionVersion === 0 ? 22 : 26, signer));
        if (!p7.codeBody) return json({ error: `could not read transaction: ${e.message}` }, 400);
        S.raw++; S.rawBySender[from] = (S.rawBySender[from] || 0) + 1;
        const name = p7.contractName.content, code = p7.codeBody.content, version = Number(p7.clarityVersion || 2);
        S.deploys.push({ name, version, sha: sha(code).toString('hex'), sender: from, raw: true });
        let ok = true;
        try { deploy(name, code, version, from); } catch (err) { ok = false; }
        return json(newTx(ok ? 'success' : 'abort_by_response', ok ? '(ok true)' : '(err none)').slice(2));
      }
      const ver = tx.version === T.TransactionVersion.Mainnet ? 22 : 26;
      const sender = T.addressToString(T.addressFromVersionHash(ver, tx.auth.spendingCondition.signer));
      S.raw++; S.rawBySender[sender] = (S.rawBySender[sender] || 0) + 1;
      let id;
      if (tx.payload.payloadType === T.PayloadType.ContractCall) {
        const contract = T.addressToString(tx.payload.contractAddress) + '.' + tx.payload.contractName.content;
        const args = tx.payload.functionArgs.map((a) => V7.hexToCV(T.cvToHex(a)));
        id = exec(contract, tx.payload.functionName.content, args, sender, tx.postConditions.values, `${sender.slice(0, 6)} ${tx.payload.functionName.content}`);
      } else if (tx.payload.payloadType === T.PayloadType.SmartContract || tx.payload.payloadType === T.PayloadType.VersionedSmartContract) {
        const name = tx.payload.contractName.content, code = tx.payload.codeBody.content, version = tx.payload.clarityVersion || 2;
        S.deploys.push({ name, version, sha: sha(code).toString('hex'), sender, raw: true });
        let ok = true;
        try { deploy(name, code, version, sender); } catch (e) { ok = false; }
        id = newTx(ok ? 'success' : 'abort_by_response', ok ? '(ok true)' : '(err none)');
      } else {
        const to = T.cvToString(tx.payload.recipient), amt = BigInt(tx.payload.amount);
        const res = muted(() => simnet.transferSTX(amt, to, sender));
        id = newTx(res.result.type === 'ok' ? 'success' : 'abort_by_response', pp(res.result));
      }
      return json(id.slice(2));
    }
    return json({}, 404);
  }

  return {
    S, setup, handle, exec, deploy, readOnly, call, inscriptionBytes, balance, sim: () => simnet,
    ROOT, WRONG, CORE, SCORES, TRAIT, TESTNET, BUNDLE, BOARDS, chunksOf, sha, pp, hex0, muted, T, V7, Cl
  };
}

module.exports = { createMockChain };

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
const fs = require('fs'), path = require('path');
const { createRequire } = require('module');
const { createMockChain } = require('./mock-chain.cjs');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = createRequire('/opt/npm-tools/node_modules/')('playwright')); }

const ROOTDIR = path.resolve(__dirname, '../..');
const HTML = path.resolve(process.argv[2] || path.join(ROOTDIR, 'canaries/build/arcade-v2-launch-canary.html'));
// TESTNET=1: the rehearsal. The chain holds only the testnet SIP-009 trait: the canary deploys the core itself (step 1b),
// inscribes the bundle (read from the mainnet gateway, hash-checked) and a stand-in for #55, deploys the leaderboard with the
// other contracts, and boots its mainnet-shaped parent with the reads pointed at the testnet core.
const TESTNET = !!process.env.TESTNET;
const NET = TESTNET ? 'testnet' : 'mainnet';
const C = createMockChain({ testnet: TESTNET });
const { S, exec, deploy, readOnly, ROOT, WRONG, SCORES, BUNDLE, BOARDS, chunksOf, sha, pp, hex0, muted, T, V7, Cl } = C;
const NEW = ['xtrata-world-v2', 'xtrata-posters-v1', 'xtrata-screen-v1'];
let simnet;
const newTx = (status, repr) => { const id = '0x' + sha('wallet' + (++S.txn)).toString('hex'); S.tx.set(id, { tx_status: status, tx_result: { repr }, block_height: simnet.blockHeight }); return id; };
async function route(r) {
  const rq = r.request();
  const out = C.handle({ url: rq.url(), method: rq.method(), body: rq.postDataBuffer() });
  if (out.abort) return r.abort();
  return r.fulfill({ status: out.status, headers: out.headers, body: out.body });
}

(async () => {
  if (!fs.existsSync(HTML)) throw new Error(`${HTML} not found: run npm run build:canary:arcade-v2-launch first`);
  console.log(await C.setup());
  simnet = C.sim();
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
    // one signature for a pack within the one-transaction limit (32 chunks); begin + chunk batches of 30 + seal beyond it
    const packSigs = (name) => { const n = Math.ceil(fs.readFileSync(path.join(ROOTDIR, 'recursive-apps/xtrata-arcade/dist/packs/xtrata-arcade-' + name + '.txt')).length / 16384); return n <= 32 ? 1 : 2 + Math.ceil(n / 30); };
    const expected = TESTNET
      ? { connect: 0, preflight: 0, core: 3, fixtures: 1 + 2 + Math.ceil(chunksOf(BUNDLE).length / 30), deploy: 4, kinds: 3, hall: 8, setup: 0, registry: 0, 'pack-engine': packSigs('engine'), 'pack-hall': packSigs('hall'), parent: 1, release: 0, board: 1, submit: 1, fund: 1, copy: 0, sweep: 0, close: 1, boardwallet: 1, handover: 1, production: 0, handback: 1, ownership: 0, audit: 0 }
      : { connect: 0, preflight: 0, deploy: 3, kinds: 3, hall: 8, setup: 0, registry: 0, 'pack-engine': packSigs('engine'), 'pack-hall': packSigs('hall'), parent: 1, release: 0, board: 1, submit: 1, fund: 1, copy: 0, sweep: 0, close: 1, boardwallet: 1, handover: 1, production: 0, handback: 1, ownership: 0, audit: 0 };
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

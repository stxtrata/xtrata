// Tests the headless runner (canaries/arcade-v2-launch/runner.ts) against the same simnet-backed mock chain as the page test.
//
//   node canaries/arcade-v2-launch/runner-test.cjs
//
// It makes a disposable testnet key, builds a copy of the canary for that key as the testnet root (XA_TESTNET_ROOT, into a
// temporary folder), starts an empty testnet chain, answers the runner's fetch() from the simnet, and proves:
//   - mainnet is refused before anything is read;
//   - the ops guard is enforced: no XA_OPS_CONFIRM, or an ops KILL file, refuses with nothing sent;
//   - a key that is not the build's root, and a page-only step, are refused;
//   - a dry run reads, then stops at the first step that would send, with nothing sent;
//   - --execute runs the whole testnet launch (core, fixtures, deploys, kinds through a temporary KINDS admin, the hall, the
//     packs and the parent), with the hall's own reader (ops/lib/hallread.mjs) reading the registry back;
//   - a re-run after --forget sends nothing.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');
const { createMockChain } = require('./mock-chain.cjs');

const ROOTDIR = path.resolve(__dirname, '../..');
let passed = 0, failed = null;
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (ok) passed++; else if (!failed) failed = what; };

(async () => {
  const C0 = createMockChain({ testnet: true });
  const { T } = C0;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'xa-v2-runner-'));
  let key = T.privateKeyToString(T.makeRandomPrivKey());
  if (key.length === 64) key += '01';
  const addr = T.getAddressFromPrivateKey(key, T.TransactionVersion.Testnet);
  const keyFile = path.join(tmp, 'testnet-root.key');
  fs.writeFileSync(keyFile, key + '\n', { mode: 0o600 });
  const stateDir = path.join(tmp, 'state');
  console.log(`disposable testnet root ${addr}; building a copy of the canary for it in ${tmp}`);
  execFileSync(process.execPath, [path.join(ROOTDIR, 'scripts/build-arcade-v2-launch-canary.mjs')], { env: { ...process.env, XA_TESTNET_ROOT: addr, XA_CANARY_OUT_DIR: tmp }, stdio: ['ignore', 'ignore', 'inherit'] });

  const C = createMockChain({ testnet: true, root: addr });
  console.log(await C.setup());
  globalThis.fetch = async (url, init = {}) => {
    const body = init.body == null ? null : typeof init.body === 'string' ? Buffer.from(init.body) : Buffer.from(init.body);
    const out = C.handle({ url: String(url && url.url || url), method: init.method || 'GET', body });
    if (out.abort) throw new TypeError('fetch failed (not reachable from the mock)');
    return new Response(out.body, { status: out.status, headers: out.headers });
  };
  process.env.XA_REPO = ROOTDIR;
  delete process.env.XA_OPS_CONFIRM;
  process.env.XA_OPS_KILL = path.join(tmp, 'KILL');
  const R = await import(pathToFileURL(path.join(tmp, 'arcade-v2-launch-runner.mjs')).href);
  const run = async (args) => {
    const log = console.log, err = console.error, lines = [];
    console.log = (...a) => lines.push(a.join(' ')); console.error = (...a) => lines.push(a.join(' '));
    try { return { code: await R.main(args), out: lines.join('\n') }; } finally { console.log = log; console.error = err; }
  };
  const sent = () => C.S.raw;

  let r = await run(['--network', 'mainnet', '--execute', '--key-file', keyFile]);
  check(r.code === 2 && /testnet only/.test(r.out) && C.S.reads.length === 0 && sent() === 0, 'mainnet is refused outright, before any read');

  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes']);
  check(r.code === 2 && /XA_OPS_CONFIRM=broadcast-testnet/.test(r.out) && sent() === 0, 'without XA_OPS_CONFIRM=broadcast-testnet the guard refuses, nothing sent');

  process.env.XA_OPS_CONFIRM = 'broadcast-testnet';
  fs.writeFileSync(process.env.XA_OPS_KILL, 'stop');
  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes']);
  check(r.code === 2 && /kill switch/.test(r.out) && sent() === 0, 'with the ops KILL file present the guard refuses, nothing sent');
  fs.unlinkSync(process.env.XA_OPS_KILL);

  r = await run(['--network', 'testnet', '--address', C.WRONG.replace(/^SP/, 'ST'), '--state-dir', stateDir]);
  check(r.code === 2 && sent() === 0, `a wallet that is not the build's testnet root is refused (${(r.out.match(/REFUSED[^\n]*/) || [''])[0].slice(0, 120)}…)`);

  r = await run(['--network', 'testnet', '--address', addr, '--state-dir', stateDir, '--steps', 'connect,submit']);
  check(r.code === 2 && /needs the page/.test(r.out) && sent() === 0, 'a page-only step (the run proof) is refused');

  r = await run(['--network', 'testnet', '--address', addr, '--state-dir', stateDir]);
  check(r.code === 1 && /PASS preflight/.test(r.out) && /FAIL core: dry run/.test(r.out) && sent() === 0 && C.S.deploys.length === 0, 'a dry run passes preflight (reads only) and stops at the first step that would send, nothing sent');

  const t0 = Date.now();
  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes', '--forget']);
  const passes = (r.out.match(/^PASS [a-z-]+/gm) || []).map((x) => x.slice(5));
  console.log(`  runner: ${passes.join(', ')} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  if (r.code !== 0) console.log(r.out.split('\n').filter((l) => /FAIL|!!/.test(l)).join('\n').slice(0, 1500));
  check(r.code === 0 && passes.length === R.DEFAULT_STEPS.length, `--execute runs all ${R.DEFAULT_STEPS.length} steps of the testnet launch`);
  const byRoot = C.S.rawBySender[addr] || 0;
  // a pack within the one-transaction limit (32 chunks) is one transaction; beyond it: begin + chunk batches of 30 + seal
  const packTxs = (name) => { const n = Math.ceil(fs.readFileSync(path.join(ROOTDIR, 'recursive-apps/xtrata-arcade/dist/packs/xtrata-arcade-' + name + '.txt')).length / 16384); return n <= 32 ? 1 : 2 + Math.ceil(n / 30); };
  const packsAndParent = packTxs('engine') + packTxs('hall') + 1;
  check(byRoot === 4 + 11 + 5 + 1 + 3 + 8 + packsAndParent, `the root key signed ${byRoot} transactions (trait + core trio 4, fixtures 11, deploys 5, games delay 1, kinds 3, hall 8, packs and parent ${packsAndParent} = ${4 + 11 + 5 + 1 + 3 + 8 + packsAndParent})`);
  const kinds = C.S.calls.filter((c) => c.fn === 'xtrata-world-v2.register-kind');
  const hot = (kinds[0] && kinds[0].sender) || addr;
  check(kinds.length === 24 && hot !== addr && kinds.every((c) => c.sender === hot), `the 24 kinds were signed by the temporary KINDS admin ${hot}`);
  const W2 = `${addr}.xtrata-world-v2`;
  check(C.pp(C.readOnly(W2, 'get-admin', [C.Cl.principal(hot)])) === 'u0', 'the temporary wallet is no longer a registry admin');
  check(C.pp(C.readOnly(W2, 'get-root', [])) === `{ owner: '${addr}, paused: false, pending: none, treasury: '${addr} }`, 'registry root owner and treasury are the root key');
  check(/PASS registry: hall space #3 live/.test(r.out) && /all four bays resolve to posters/.test(r.out), 'the hall\'s own reader (hallread.mjs) read the hall back: four bays on posters');
  check(C.S.deploys.filter((d) => d.raw).map((d) => `${d.name}@${d.version}`).join() === 'nft-trait@3,xtrata-v1-1-1@3,xtrata-v2-1-0@3,xtrata-v3-2-3@3,xtrata-world-v2@4,xtrata-posters-v1@4,xtrata-screen-v1@4,xtrata-games-v1@4,xtrata-arcade-scores-v2@4', 'the runner deployed the SIP-009 trait and the core trio at Clarity 3, then the five contracts at Clarity 4');
  check(C.S.violations.length === 0, `every STX movement was covered by a deny-mode post-condition${C.S.violations.length ? ': ' + C.S.violations.join('; ') : ''}`);

  const before = sent();
  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes', '--forget']);
  check(r.code === 0 && sent() === before, `a re-run after --forget passes and sends nothing (${sent() - before} sent)`);
  if (r.code !== 0) console.log(r.out.split('\n').filter((l) => /FAIL|!!/.test(l)).join('\n').slice(0, 1500));

  // the two test games: inscribed, boards registered, listed on the games contract (testnet only, run on request: not one of the default steps)
  check(!R.DEFAULT_STEPS.includes('testgames'), 'the test-games step is not part of the default launch steps');
  check(R.FULL_EXTRA_STEPS.join() === 'boards26,testgames', '--full adds boards26 and testgames');
  const txBefore = C.S.rawBySender[addr] || 0;
  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes', '--steps', 'connect,boards26,testgames']);
  if (r.code !== 0) console.log(r.out.split('\n').filter((l) => /FAIL|!!/.test(l)).join('\n').slice(0, 1500));
  check(r.code === 0 && /PASS testgames/.test(r.out), 'the testgames step passes');
  check((C.S.rawBySender[addr] || 0) - txBefore === 32, `it sent 32 transactions: 26 boards, then 2 cartridge inscriptions, 2 set-board and 2 add-game (${(C.S.rawBySender[addr] || 0) - txBefore})`);
  const G = `${addr}.xtrata-games-v1`, SC = `${addr}.xtrata-arcade-scores-v2`;
  check(C.pp(C.readOnly(G, 'get-count', [])) === 'u2', 'the games contract lists 2 games');
  const g0 = C.pp(C.readOnly(G, 'get-game', [C.Cl.uint(0)])), g1 = C.pp(C.readOnly(G, 'get-game', [C.Cl.uint(1)]));
  check(/id: "xa_test_catcher"/.test(g0) && /index: u21/.test(g0) && /id: "xa_test_sprint"/.test(g1) && /index: u22/.test(g1) && /kind: u1/.test(g0), 'game 0 is xa_test_catcher (replay number 21) and game 1 is xa_test_sprint (22)');
  const allBoards = JSON.parse(fs.readFileSync(path.join(ROOTDIR, 'recursive-apps/xtrata-arcade/boards.json'), 'utf8'));
  let boardsOk = 0;
  for (const b of allBoards) { const t = C.pp(C.readOnly(SC, 'get-board', [C.Cl.stringAscii(b.id)])); if (new RegExp('mode: u' + b.mode).test(t) && /enabled: true/.test(t) && /engine-id: u\d+/.test(t)) boardsOk++; }
  check(boardsOk === allBoards.length, `all ${allBoards.length} arcade boards exist on the leaderboard, enabled, with the right mode (${boardsOk})`);
  const b0 = C.pp(C.readOnly(SC, 'get-board', [C.Cl.stringAscii('xa_test_catcher')])), b1 = C.pp(C.readOnly(SC, 'get-board', [C.Cl.stringAscii('xa_test_sprint')]));
  check(/mode: u0/.test(b0) && /mode: u1/.test(b1) && /enabled: true/.test(b0) && /enabled: true/.test(b1), 'both score boards exist and are enabled: Sat Catcher highest wins, Arrow Sprint lowest wins');
  check(/live at burn block/.test(r.out) && /replay number 21/.test(r.out), 'the step says when each game goes live');
  const txMid = C.S.rawBySender[addr] || 0;
  r = await run(['--network', 'testnet', '--execute', '--key-file', keyFile, '--state-dir', stateDir, '--yes', '--steps', 'connect,boards26,testgames']);
  check(r.code === 0 && (C.S.rawBySender[addr] || 0) === txMid, 'running it again sends nothing');
  check(C.S.violations.length === 0, 'every STX movement was still covered by a deny-mode post-condition');

  fs.rmSync(tmp, { recursive: true, force: true });
  if (failed) { console.log(`FAILED: ${failed} (${passed} checks passed)`); process.exit(1); }
  console.log(`arcade v2 launch runner test passed: ${passed} checks`);
})().catch((e) => { console.error(e); process.exit(1); });

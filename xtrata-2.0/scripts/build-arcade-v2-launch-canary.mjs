#!/usr/bin/env node
// Builds canaries/arcade-v2-launch into ONE self-contained HTML file
// (canaries/build/arcade-v2-launch-canary.html).
//
// The arcade v2 launch: deploy xtrata-posters-v1, xtrata-world-v2 and xtrata-screen-v1 from the final root owner, seed the
// hall-only registry (24 built-in kinds, arcade/hall spaces, four bays on posters), inscribe the changed packs and a parent
// whose CONFIG.world names those three contracts, prove a real run, and move the 26 boards to the new parent.
//
// Everything the page can send is pinned here: the build refuses to run when a contract source, the bundle, a pack, the parent
// shell or any part differs from its pin, and prints the new value for an intended change (update the pin in the same commit).
//
// Testnet: the three contracts are embedded twice, the mainnet sources (contracts/live) and testnet variants made with
// make-live.mjs's toLive() and the testnet core instead of the mainnet one. The testnet core itself (xtrata-v1-1-1,
// xtrata-v2-1-0, xtrata-v3-2-3 with the testnet SIP-009 trait) is embedded for the canary's testnet-only "deploy the core" step.
//   XA_TESTNET_ROOT      the testnet root owner (default: the mainnet root's key on testnet)
//   XA_TESTNET_CORE      the testnet core contract id (default: <testnet root>.xtrata-v3-2-3, which the canary can deploy)
//   XA_TESTNET_TREASURY  the testnet treasury (default: the testnet root)
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import T from '@stacks/transactions';
import { hallOnlyPlan, kindList } from '../canaries/arcade-v2-launch/plan.mjs';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const XA = resolve(root, 'recursive-apps/xtrata-arcade');
const AW = resolve(root, 'contracts/arcade-world');
const P = require(resolve(XA, 'build/hall-parts.cjs'));
const R = require(resolve(XA, 'build/parent-render.cjs'));
const { toLive, CORE: LIVE_CORE } = await import(pathToFileURL(resolve(AW, 'scripts/make-live.mjs')).href);
const { lookRegistry } = await import(pathToFileURL(resolve(AW, 'ops/lib/catalogue.mjs')).href);

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const fail = (msg) => { console.error(msg); process.exit(1); };
const CHUNK = 16384;

// ---------------------------------------------------------------- networks
// The final root owner per network. xtrata-world-v2 makes its deployer the root owner AND the treasury, and a space belongs to
// whoever creates it, so the canary deploys and builds only from this wallet (review finding H1).
const MAINNET_ROOT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const sameKeyOn = (address, version) => T.addressToString(T.addressFromVersionHash(version, T.createAddress(address).hash160));
const TESTNET_ROOT = process.env.XA_TESTNET_ROOT || sameKeyOn(MAINNET_ROOT, T.AddressVersion.TestnetSingleSig);
const TESTNET_CORE = process.env.XA_TESTNET_CORE || `${TESTNET_ROOT}.xtrata-v3-2-3`;
for (const [k, v] of [['XA_TESTNET_ROOT', TESTNET_ROOT], ['XA_TESTNET_CORE', TESTNET_CORE.split('.')[0]]]) if (!/^ST[0-9A-Z]{38,40}$/.test(v)) fail(`${k} must be a testnet (ST…) address, got ${v}`);
const NETWORKS = {
  mainnet: {
    root: MAINNET_ROOT,
    treasury: MAINNET_ROOT,
    core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
    // the poster publishers and the hall's STATE-only publisher grant the launch sets up (none at launch: posters and bays
    // change later by the owner's own contract writes)
    posterPublishers: [],
    hallPublisher: null,
    screenFeeRecipient: MAINNET_ROOT,
    parents: [55],
    bundleId: 3078,
    canDeployCore: false
  },
  testnet: {
    root: TESTNET_ROOT,
    treasury: process.env.XA_TESTNET_TREASURY || TESTNET_ROOT,
    core: TESTNET_CORE,
    posterPublishers: [],
    hallPublisher: null,
    screenFeeRecipient: process.env.XA_TESTNET_TREASURY || TESTNET_ROOT,
    parents: 'stand-in',     // a small inscription the canary makes on the testnet core in place of #55
    bundleId: 'by-hash',     // the bundle is inscribed on the testnet core by the canary; its id is found by its chain hash
    canDeployCore: TESTNET_CORE.split('.')[0] === TESTNET_ROOT && TESTNET_CORE.split('.')[1] === 'xtrata-v3-2-3'
  }
};

// ---------------------------------------------------------------- contracts
// sha256 of contracts/live/<name>.clar (the mainnet variants). Earlier: none (first launch of these three).
const PINNED_CONTRACTS = {
  'xtrata-posters-v1': '3e9bdfc500c97a166804e15bda29df852e7f0dbea2fe2ebe97048f67399618fb',
  'xtrata-world-v2': '9d1397cccbc34c7f36b76aeeea5a5b7389b3a93b889df9d405e7e666ac4de5f8',
  'xtrata-screen-v1': '86b2df342242692f9c2485f5611c659976eaac42e4440d46f88f0e6a46c2b112'
};
const PINNED_SCORES = 'c82a89c5da9d0fd0a3f37f348ef755d833c3149865d9837f86c0a2831d0eefd5';
// The core and the two contracts it reads from, contracts/live (mainnet variants; the testnet variants switch the SIP-009 trait).
const PINNED_CORE = {
  'xtrata-v1-1-1': { file: 'xtrata-v1.1.1.clar', sha: '1f9ee448262d982017f69479718628689af4a660c28905492b4bad84096d74fd' },
  'xtrata-v2-1-0': { file: 'xtrata-v2.1.0.clar', sha: '3f632b0adc44788366c1cce87a497e0dc789bc99fdd7fd9024a5c47b7df05e2c' },
  'xtrata-v3-2-3': { file: 'xtrata-v3.2.3.clar', sha: '4d5ed9db022bb345d712ceadbd75d8d9540bd0a5b4d9122017c770b8d00a8ac7' }
};
const pinErrors = [];
const pin = (label, got, want, where) => { if (got !== want) pinErrors.push(`${label}: sha256 ${got} is not the pinned ${want}. If intended, set it in ${where}.`); };

const withCore = (live, core) => live.split('\n').map((line) => (line.includes(';; @principal core') ? line.replace(LIVE_CORE, `'${core}`) : line)).join('\n');
const contracts = { mainnet: {}, testnet: {} };
for (const name of Object.keys(PINNED_CONTRACTS)) {
  const sim = readFileSync(resolve(AW, 'contracts', `${name}.clar`), 'utf8');
  const live = readFileSync(resolve(root, 'contracts/live', `${name}.clar`), 'utf8');
  if (toLive(sim) !== live) fail(`contracts/live/${name}.clar is stale: run node contracts/arcade-world/scripts/make-live.mjs`);
  if (!live.includes(LIVE_CORE)) fail(`${name}: expected the mainnet core ${LIVE_CORE} on its @principal core lines`);
  pin(name, sha(live), PINNED_CONTRACTS[name], 'PINNED_CONTRACTS');
  const test = withCore(live, NETWORKS.testnet.core);
  if (test.includes(LIVE_CORE)) fail(`${name}: the testnet variant still names the mainnet core`);
  contracts.mainnet[name] = live;
  contracts.testnet[name] = test;
}
const scores = readFileSync(resolve(root, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8');
pin('xtrata-arcade-scores-v2', sha(scores), PINNED_SCORES, 'PINNED_SCORES');
contracts.mainnet['xtrata-arcade-scores-v2'] = scores;
contracts.testnet['xtrata-arcade-scores-v2'] = scores;

// The testnet core: the [MAINNET] SIP-009 trait lines become comments and the [TESTNET] ones are switched on.
const TRAIT_MAIN = "'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait";
const TRAIT_TEST = "'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait";
const testnetTrait = (src, name) => {
  let on = 0, off = 0;
  const out = src.split('\n').map((line) => {
    if (/^\((impl|use)-trait /.test(line) && line.includes(TRAIT_MAIN)) { off++; return `;; ${line}`; }
    if (/^;; \((impl|use)-trait /.test(line) && line.includes(TRAIT_TEST)) { on++; return line.slice(3); }
    return line;
  }).join('\n');
  if (on !== 2 || off !== 2) fail(`${name}: expected one impl-trait and one use-trait line for each network (switched ${on} on, ${off} off)`);
  return out;
};
const coreTestnet = {};
for (const [name, c] of Object.entries(PINNED_CORE)) {
  const live = readFileSync(resolve(root, 'contracts/live', c.file), 'utf8');
  pin(name, sha(live), c.sha, 'PINNED_CORE');
  coreTestnet[name] = testnetTrait(live, name);
}

// ---------------------------------------------------------------- the release (as the v1 launch canary)
const BUNDLE_ID = 3078;
const BUNDLE_SHA = 'd9fa6b2085d64c1e5cb63682bbc278e1fe83a335d8dda914d657d9ba675bd62c';
// sha256 over the packs to inscribe, the parent shell, the part list, the bundle and the ids (printed by this script).
// v2.0 launch: the hall reads xtrata-world-v2 (bays), xtrata-posters-v1 and xtrata-screen-v1 (CONFIG.world).
const PINNED_RELEASE = '10c7b47abe7cde3f9910ed9c4e8e1bdbfd8c51f8be992b4f89bc2930e62f97f0';
const bundle = readFileSync(resolve(XA, 'release/xtrata-arcade.html'));
if (sha(bundle) !== BUNDLE_SHA) fail(`release/xtrata-arcade.html is ${sha(bundle)}, not the pinned bundle #${BUNDLE_ID} ${BUNDLE_SHA}`);
let h = Buffer.alloc(32);
for (let i = 0; i < bundle.length; i += CHUNK) h = createHash('sha256').update(Buffer.concat([h, bundle.subarray(i, i + CHUNK)])).digest();
const bundleInfo = { id: BUNDLE_ID, sha256: BUNDLE_SHA, bytes: bundle.length, chunks: Math.ceil(bundle.length / CHUNK), chainHash: h.toString('hex') };

const ids = JSON.parse(readFileSync(resolve(XA, 'parent/ids.json'), 'utf8'));
if (Number(ids.bundleId) !== BUNDLE_ID) fail(`parent/ids.json bundleId is ${ids.bundleId}, expected ${BUNDLE_ID}`);
if (Object.keys(ids.parts || {}).length) fail('parent/ids.json lists single-part overrides; the canary does not inscribe those.');
// Rooms (the casino) are not part of this launch: the parent is written without them, whatever parent/ids.json says.
execFileSync(process.execPath, [resolve(XA, 'build/modular.mjs'), 'check'], { stdio: 'inherit' });
execFileSync(process.execPath, [resolve(XA, 'build/modular.mjs'), 'build'], { stdio: 'inherit' });
const manifest = JSON.parse(readFileSync(resolve(XA, 'dist/manifest.json'), 'utf8'));
const parts = {};
for (const f of readdirSync(resolve(XA, 'src/parts'))) parts[f] = readFileSync(resolve(XA, 'src/parts', f), 'utf8');
const names = [...P.ORDER.css, ...P.ORDER.html, ...P.ORDER.js];
if (names.length !== Object.keys(parts).length || names.some((n) => typeof parts[n] !== 'string')) fail('src/parts does not hold exactly the parts in hall-parts.cjs ORDER');
for (const need of ['world.js', 'world2.js', 'screen.js', 'score-client.js']) if (typeof parts[need] !== 'string') fail(`the hall has no ${need}: this release needs the v2 world reader`);
const partSha = Object.fromEntries(names.map((n) => [n, sha(parts[n])]));

const bundleParts = P.splitRelease(bundle.toString('utf8')).parts;
const inscribe = P.PACK_ORDER.filter((name) => P.PACKS[name].some((p) => bundleParts[p] !== parts[p]));
if (!inscribe.includes('hall')) fail('the hall pack does not differ from the bundle: there is no v2 hall to inscribe');
const packs = {};
for (const name of P.PACK_ORDER) {
  const text = P.makePack(name, parts);
  const back = P.parsePack(text);
  if (P.PACKS[name].some((p) => back[p] !== parts[p])) fail(`pack ${name} does not round-trip`);
  if (inscribe.includes(name)) packs[name] = text;
  if (inscribe.includes(name) && Math.ceil(Buffer.byteLength(text) / CHUNK) > 32) console.warn(`NOTE pack ${name} is over 32 chunks: the canary will use the staged route for it`);
}
const tpl = readFileSync(resolve(XA, 'parent/parent.template.html'), 'utf8');
const lib = readFileSync(resolve(XA, 'build/hall-parts.cjs'), 'utf8');
const shell = R.parentShell(tpl, lib);
// The parent renderer must carry the world block through as given (the hall's CONFIG.world: posters, registry, screen).
const probeWorld = { posters: 'SP000000000000000000002Q6VF78.a', registry: 'SP000000000000000000002Q6VF78.b', screen: 'SP000000000000000000002Q6VF78.c' };
const probeCfg = R.parentConfig({ version: ids.version, bundleId: BUNDLE_ID, packs: {}, parts: {}, parentTokenId: 0, world: probeWorld }, P.PACK_ORDER);
if (JSON.stringify(probeCfg.world) !== JSON.stringify(probeWorld)) fail(`build/parent-render.cjs does not pass CONFIG.world through as { posters, registry, screen } (got ${JSON.stringify(probeCfg.world)})`);
if (probeCfg.rooms) fail('build/parent-render.cjs added rooms that were not asked for');
if (!/XA_WORLD_CONFIG = CONFIG\.world/.test(tpl)) fail('parent.template.html does not hand CONFIG.world to the hall (window.XA_WORLD_CONFIG)');

const single = readFileSync(resolve(XA, `dist/xtrata-arcade-${ids.version}.html`));
if (single[0] === 0xef && single[1] === 0xbb) fail('the single-file build starts with a UTF-8 BOM');
if (/https?:\/\/(cdnjs|fonts\.googleapis|fonts\.gstatic|unpkg|cdn\.jsdelivr)/.test(single.toString('utf8'))) fail('the arcade still references a CDN');
if (manifest.single.sha256 !== sha(single)) fail('dist/manifest.json is stale');

const boards = JSON.parse(readFileSync(resolve(XA, 'boards.json'), 'utf8'));
if (boards.length !== 26 || new Set(boards.map((b) => b.id)).size !== 26 || boards.some((b) => !/^[a-z0-9_-]{1,24}$/.test(b.id))) fail('boards.json must hold 26 unique ids of at most 24 characters');

const release = {
  version: ids.version,
  bundle: bundleInfo,
  packOrder: P.PACK_ORDER,
  inscribe,
  packs,
  packSha: Object.fromEntries(inscribe.map((n) => [n, sha(packs[n])])),
  fromBundle: P.PACK_ORDER.filter((n) => !inscribe.includes(n)),
  ids: { version: ids.version, bundleId: BUNDLE_ID, packs: {}, parts: {}, parentTokenId: Number(ids.parentTokenId || 0) },
  shell,
  shellSha: sha(shell),
  partSha,
  single: single.toString('utf8'),
  singleSha: sha(single),
  // The v2 parent is not byte-equivalent to any earlier parent (#3111 had no world config): every board moves.
  equivalentParents: []
};
const releaseSha = sha(JSON.stringify({ packSha: release.packSha, shellSha: release.shellSha, partSha, bundle: BUNDLE_SHA, ids: release.ids, equivalentParents: [] }));
pin('release', releaseSha, PINNED_RELEASE, 'PINNED_RELEASE');

// ---------------------------------------------------------------- the registry plan
const kinds = kindList(lookRegistry());
if (kinds.length !== 24) fail(`expected 24 built-in kinds (the bay and 23 looks), got ${kinds.length}`);
// Cross-check the local planner against the ops planner (dry run of a hall-only seed, lobby calls removed).
const local = hallOnlyPlan({ owner: MAINNET_ROOT, kinds });
let crossCheck = 'skipped (run npm install in contracts/arcade-world to compare with ops/lib/v2.mjs)';
if (existsSync(resolve(AW, 'node_modules/@stacks/transactions'))) {
  const V2 = await import(pathToFileURL(resolve(AW, 'ops/lib/v2.mjs')).href);
  const doc = { format: 'arcade-scene-file/1', room: 'arcade-hall', scenes: [0, 1, 2, 3].map((bay) => ({ bay, at: 0, base: 'posters' })) };
  const ops = V2.planSeed([doc], { owner: MAINNET_ROOT, ownerAddress: MAINNET_ROOT, height: 100 });
  if (ops.errors.length) fail(`ops planner: ${ops.errors.join('; ')}`);
  // Remove the lobby: its space, its live call, its two bays (the ops planner always plans one).
  const lobbyId = ops.manifest.spaces.lobby;
  const keep = ops.steps.filter((s) => !/\blobby\b/.test(s.note || ''));
  // Ids come from one counter shared by spaces and objects, so without the lobby space every object id after it is one lower.
  // Only the object ids in state tuples are renumbered; kinds, the arcade and hall ids and every other number stay as planned.
  const renumber = (x) => JSON.parse(JSON.stringify(x, (k, v) => (k === 'obj' && v && typeof v.uint === 'number' && v.uint > lobbyId ? { uint: v.uint - 1 } : v)));
  const opsCalls = keep.map((s) => renumber({ fn: s.fn, args: s.args }));
  const mine = local.steps.map((s) => ({ fn: s.fn, args: s.args }));
  const a = JSON.stringify(opsCalls), b = JSON.stringify(mine);
  if (a !== b) {
    const i = mine.findIndex((m, j) => JSON.stringify(m) !== JSON.stringify(opsCalls[j]));
    fail(`plan.mjs differs from ops/lib/v2.mjs at call ${i + 1}:\n  ops   ${JSON.stringify(opsCalls[i])}\n  local ${JSON.stringify(mine[i])}`);
  }
  crossCheck = `matches ops/lib/v2.mjs planSeed (${ops.steps.length} calls with the lobby, ${mine.length} without)`;
}

if (pinErrors.length) {
  console.error(pinErrors.join('\n'));
  fail('\nPins do not match (see above). For an intended change, set the printed values in scripts/build-arcade-v2-launch-canary.mjs.');
}

// ---------------------------------------------------------------- bundle the page
const launch = {
  release,
  releaseSha,
  networks: NETWORKS,
  contracts,
  contractSha: Object.fromEntries(['mainnet', 'testnet'].map((n) => [n, Object.fromEntries(Object.entries(contracts[n]).map(([k, v]) => [k, sha(v)]))])),
  coreTestnet,
  coreTestnetSha: Object.fromEntries(Object.entries(coreTestnet).map(([k, v]) => [k, sha(v)])),
  kinds,
  planCalls: local.steps.length,
  boards,
  // the hall's own registry reader, run by the canary against the registry before anything is inscribed
  reader: Object.fromEntries(['score-client.js', 'world.js', 'world2.js'].map((n) => [n, parts[n]]))
};
const launchPlugin = {
  name: 'xa-launch',
  setup(b) {
    b.onResolve({ filter: /^xa:launch$/ }, () => ({ path: 'launch', namespace: 'xa' }));
    b.onLoad({ filter: /.*/, namespace: 'xa' }, () => ({ contents: JSON.stringify(launch), loader: 'json' }));
  }
};
const dir = resolve(root, 'canaries/arcade-v2-launch');
const builtAt = new Date();
const stamp = `v2-${ids.version}-${builtAt.toISOString().slice(0, 10)}-${sha(readFileSync(resolve(dir, 'main.ts')) + readFileSync(resolve(dir, 'engine.ts')) + readFileSync(resolve(dir, 'plan.mjs')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8') + releaseSha).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.html': 'text' },
  plugins: [launchPlugin],
  define: {
    __BUILD__: JSON.stringify(stamp), __BUILT_AT__: JSON.stringify(builtAt.toISOString()),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
// Inline-script safety: the embedded arcade holds both "</script" and "<!--" inside JS strings.
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/arcade-v2-launch-canary.html');
writeFileSync(out, html);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);
console.log(`Xtrata Arcade ${ids.version} (v2 world) · release sha256 ${releaseSha}`);
for (const n of inscribe) console.log(`  inscribes pack ${n.padEnd(7)} ${kb(Buffer.byteLength(packs[n])).padStart(10)} · ${Math.ceil(Buffer.byteLength(packs[n]) / CHUNK)} chunks · sha256 ${release.packSha[n]}`);
console.log(`  from bundle #${BUNDLE_ID}: ${release.fromBundle.join(', ')}`);
console.log(`  then the parent (${kb(Buffer.byteLength(shell))} + its ids) · shell sha256 ${release.shellSha}`);
for (const [n, s] of Object.entries(launch.contractSha.mainnet)) console.log(`  contract ${n.padEnd(24)} ${kb(Buffer.byteLength(contracts.mainnet[n])).padStart(9)} · mainnet sha256 ${s} · testnet ${launch.contractSha.testnet[n]}`);
console.log(`  registry plan: ${local.steps.length} calls (${kinds.length} kinds, ${local.steps.length - kinds.length} hall) · ${crossCheck}`);
console.log(`  root owner: mainnet ${NETWORKS.mainnet.root} · testnet ${NETWORKS.testnet.root} (core ${NETWORKS.testnet.core}${NETWORKS.testnet.canDeployCore ? ', the canary can deploy it' : ''})`);

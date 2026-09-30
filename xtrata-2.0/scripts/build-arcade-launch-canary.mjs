#!/usr/bin/env node
// Builds canaries/arcade-launch into ONE self-contained HTML file
// (canaries/build/arcade-launch-canary.html).
//
// From v1.4 the arcade is recursive (recursive-apps/xtrata-arcade/README.md): the canary
// inscribes only the packs that changed since the single-file bundle (#3078), then a small
// parent that loads every part from those packs or from the bundle. The page can only deploy
// the pinned leaderboard contract and only inscribe the pinned packs and parent: the build
// refuses to run otherwise. When the arcade changes on purpose, update PINNED_RELEASE in the
// same commit (the build prints the new value).
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const XA = resolve(root, 'recursive-apps/xtrata-arcade');
const P = require(resolve(XA, 'build/hall-parts.cjs'));
const R = require(resolve(XA, 'build/parent-render.cjs'));

const PINNED_CONTRACT = 'c82a89c5da9d0fd0a3f37f348ef755d833c3149865d9837f86c0a2831d0eefd5';
// The single-file bundle every unchanged part is read from: v1.3 = inscription #3078.
// Earlier: v1.1 c140bb14… = #3077, v1.0 0fb9085b… = #3076.
const BUNDLE_ID = 3078;
const BUNDLE_SHA = 'd9fa6b2085d64c1e5cb63682bbc278e1fe83a335d8dda914d657d9ba675bd62c';
// v1.4: Top 10 on idle cabinet screens, connect before play, Leather bare-hex fix; first recursive release.
// sha256 over the packs to inscribe, the parent shell and the part list (printed by this script).
const PINNED_RELEASE = '1608b91178f4a94e66cdb0e17b30790bf983159f65cbb823fef129dc5a01ff59';
const CHUNK = 16384;
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const fail = (msg) => { console.error(msg); process.exit(1); };

// 1. Leaderboard contract (unchanged since v1.0; the canary skips the deploy when it is already on chain).
const contract = readFileSync(resolve(root, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8');
if (sha(contract) !== PINNED_CONTRACT) fail(`contract source sha256 ${sha(contract)} is not the pinned ${PINNED_CONTRACT}`);

// 2. The bundle (#3078): the canary checks on chain that the inscription holds exactly this file.
const bundle = readFileSync(resolve(XA, 'release/xtrata-arcade.html'));
if (sha(bundle) !== BUNDLE_SHA) fail(`release/xtrata-arcade.html is ${sha(bundle)}, not the pinned bundle #${BUNDLE_ID} ${BUNDLE_SHA}`);
let h = Buffer.alloc(32);
for (let i = 0; i < bundle.length; i += CHUNK) h = createHash('sha256').update(Buffer.concat([h, bundle.subarray(i, i + CHUNK)])).digest();
const bundleInfo = { id: BUNDLE_ID, sha256: BUNDLE_SHA, bytes: bundle.length, chunks: Math.ceil(bundle.length / CHUNK), chainHash: h.toString('hex') };

// 3. The release: rebuild from src/ (proves the split still round-trips #3078 first).
const ids = JSON.parse(readFileSync(resolve(XA, 'parent/ids.json'), 'utf8'));
if (Number(ids.bundleId) !== BUNDLE_ID) fail(`parent/ids.json bundleId is ${ids.bundleId}, expected ${BUNDLE_ID}`);
// Pack ids in parent/ids.json record the last launch; the canary ignores them and finds any pack
// that is already inscribed by its hash, so an unchanged pack is re-used, never inscribed twice.
if (Object.keys(ids.parts || {}).length) fail('parent/ids.json lists single-part overrides; the canary does not inscribe those.');
execFileSync(process.execPath, [resolve(XA, 'build/modular.mjs'), 'check'], { stdio: 'inherit' });
execFileSync(process.execPath, [resolve(XA, 'build/modular.mjs'), 'build'], { stdio: 'inherit' });
const manifest = JSON.parse(readFileSync(resolve(XA, 'dist/manifest.json'), 'utf8'));
const parts = {};
for (const f of readdirSync(resolve(XA, 'src/parts'))) parts[f] = readFileSync(resolve(XA, 'src/parts', f), 'utf8');
const names = [...P.ORDER.css, ...P.ORDER.html, ...P.ORDER.js];
if (names.length !== Object.keys(parts).length || names.some((n) => typeof parts[n] !== 'string')) fail('src/parts does not hold exactly the parts in hall-parts.cjs ORDER');
const partSha = Object.fromEntries(names.map((n) => [n, sha(parts[n])]));

// Packs that differ from the bundle are inscribed; the rest are read out of the bundle.
const bundleParts = P.splitRelease(bundle.toString('utf8')).parts;
const inscribe = P.PACK_ORDER.filter((name) => P.PACKS[name].some((p) => bundleParts[p] !== parts[p]));
if (!inscribe.length) fail('nothing differs from the bundle: there is no release to inscribe');
const packs = {};
for (const name of P.PACK_ORDER) {
  const text = P.makePack(name, parts);
  const back = P.parsePack(text);
  if (P.PACKS[name].some((p) => back[p] !== parts[p])) fail(`pack ${name} does not round-trip`);
  if (inscribe.includes(name)) packs[name] = text;
}

const tpl = readFileSync(resolve(XA, 'parent/parent.template.html'), 'utf8');
const lib = readFileSync(resolve(XA, 'build/hall-parts.cjs'), 'utf8');
const shell = R.parentShell(tpl, lib);

// The single-file build of the same parts: the canary flies and re-plays runs in it.
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
  singleSha: sha(single)
};
const releaseSha = sha(JSON.stringify({ packSha: release.packSha, shellSha: release.shellSha, partSha, bundle: BUNDLE_SHA, ids: release.ids }));
if (releaseSha !== PINNED_RELEASE) fail(`release sha256 ${releaseSha} is not the pinned ${PINNED_RELEASE}.\nIf this release is intended, set PINNED_RELEASE = '${releaseSha}' in scripts/build-arcade-launch-canary.mjs.`);

// esbuild: `import RELEASE from 'xa:release'` resolves to the checked data above.
const releasePlugin = {
  name: 'xa-release',
  setup(b) {
    b.onResolve({ filter: /^xa:release$/ }, () => ({ path: 'release', namespace: 'xa' }));
    b.onLoad({ filter: /.*/, namespace: 'xa' }, () => ({ contents: JSON.stringify(release), loader: 'json' }));
  }
};

const dir = resolve(root, 'canaries/arcade-launch');
const builtAt = new Date();
const stamp = `${ids.version}-${builtAt.toISOString().slice(0, 10)}-${sha(readFileSync(resolve(dir, 'main.ts')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8') + releaseSha).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.clar': 'text', '.html': 'text' },
  plugins: [releasePlugin],
  define: {
    __BUILD__: JSON.stringify(stamp), __SOURCE_SHA__: JSON.stringify(PINNED_CONTRACT), __RELEASE_SHA__: JSON.stringify(releaseSha),
    __BUILT_AT__: JSON.stringify(builtAt.toISOString()),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
// Inline-script safety: the embedded arcade holds both "</script" and "<!--" inside JS strings.
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/arcade-launch-canary.html');
writeFileSync(out, html);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);
console.log(`Xtrata Arcade ${ids.version} (recursive) · release sha256 ${releaseSha}`);
for (const n of inscribe) console.log(`  inscribes pack ${n.padEnd(7)} ${kb(Buffer.byteLength(packs[n])).padStart(10)} · ${Math.ceil(Buffer.byteLength(packs[n]) / CHUNK)} chunks · sha256 ${release.packSha[n]}`);
console.log(`  from bundle #${BUNDLE_ID}: ${release.fromBundle.join(', ')}`);
console.log(`  then the parent (${kb(Buffer.byteLength(shell))} + its ids) · shell sha256 ${release.shellSha}`);

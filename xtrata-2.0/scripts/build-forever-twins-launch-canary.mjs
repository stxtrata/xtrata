#!/usr/bin/env node
// Builds canaries/forever-twins-launch into ONE self-contained HTML file for one collection:
//   node scripts/build-forever-twins-launch-canary.mjs --collection nyc-degens            (verify against pins)
//   node scripts/build-forever-twins-launch-canary.mjs --collection nyc-degens --pin --deployer SP...   (record pins)
// Inputs (all in the repo):
//   forever-twins/ft-harness/scripts/configs/mainnet-<key>.v3.json   helper config (payees, fee, ceiling, group, ...)
//   forever-twins/ft-harness/manifest/out/<key>.manifest.json        the manifest that will be finalised
//   public/ft/data/<key>.manifest.json                               the copy the resolver publishes (must be identical)
// The helper is rendered from the harness template at build time. Pins (helper source sha256, manifest sha256,
// deployer) live in canaries/forever-twins-launch/pins.json; the build refuses if anything differs from them.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const root = opt('root') ? resolve(opt('root')) : resolve(import.meta.dirname, '..');   // --root is for the mock-chain test only
const harness = resolve(root, 'forever-twins/ft-harness');
const key = opt('collection');
if (!key || !/^[a-z0-9-]+$/.test(key)) { console.error('usage: --collection <key> [--pin --deployer SP...]'); process.exit(1); }
const sha = (x) => createHash('sha256').update(x).digest('hex');
const fail = (m) => { console.error(`REFUSED: ${m}`); process.exit(1); };

const cfgPath = resolve(harness, `scripts/configs/mainnet-${key}.v3.json`);
const manifestPath = resolve(harness, `manifest/out/${key}.manifest.json`);
const publicPath = resolve(root, `public/ft/data/${key}.manifest.json`);
for (const p of [cfgPath, manifestPath, publicPath]) if (!existsSync(p)) fail(`missing ${p}`);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const manifestText = readFileSync(manifestPath, 'utf8');
if (manifestText !== readFileSync(publicPath, 'utf8')) fail(`public/ft/data/${key}.manifest.json is not byte-identical to manifest/out/${key}.manifest.json`);
const shaFile = resolve(harness, `manifest/out/${key}.manifest.sha256`);
const manifestSha = sha(manifestText);
if (existsSync(shaFile) && !readFileSync(shaFile, 'utf8').startsWith(manifestSha)) fail('manifest does not match its .sha256 file');
const manifest = JSON.parse(manifestText);
if (/subset|NOT for finalisation/.test(manifest.scope || '')) fail(`partial manifest (scope: ${manifest.scope})`);
if (manifest.collectionKey !== key || cfg.collectionKey !== key) fail('collection key mismatch between config and manifest');
if (manifest.source !== cfg.source) fail('manifest source differs from the helper config source');
if (!Array.isArray(manifest.tokens) || manifest.tokens.length !== manifest.count) fail('manifest count mismatch');

// render the helper with the harness renderer (the same one the simnet tests use)
const { render } = await import(pathToFileURL(resolve(harness, 'scripts/render-helper-v3.mjs')).href);
const helperSource = render(cfg);
const helperSha = sha(helperSource);

const pinsPath = resolve(root, 'canaries/forever-twins-launch/pins.json');
const allPins = existsSync(pinsPath) ? JSON.parse(readFileSync(pinsPath, 'utf8')) : {};
if (argv.includes('--pin')) {
  const deployer = opt('deployer');
  if (!/^SP[0-9A-Z]{30,}$/.test(deployer || '')) fail('--pin needs --deployer SP...');
  allPins[key] = { helperSha, manifestSha, deployer, pinnedAt: new Date().toISOString().slice(0, 10) };
  writeFileSync(pinsPath, JSON.stringify(allPins, null, 2) + '\n');
  console.log(`pinned ${key}: helper ${helperSha}, manifest ${manifestSha}, deployer ${deployer}`);
}
const pins = allPins[key];
if (!pins) fail(`no pins for ${key}. Review the config, then run with --pin --deployer <address>.`);
if (pins.helperSha !== helperSha) fail(`rendered helper sha256 ${helperSha} is not the pinned ${pins.helperSha} (re-pin only if the change is intended)`);
if (pins.manifestSha !== manifestSha) fail(`manifest sha256 ${manifestSha} is not the pinned ${pins.manifestSha} (re-pin only if the change is intended)`);

// sanity: the config the helper was rendered from must agree with what the page will verify on chain
if (!Array.isArray(cfg.payees) || cfg.payees.length !== 2) fail('config needs two payees');
if (cfg.initialFeeUstx % 2 !== 0 || cfg.initialFeeUstx > cfg.maxFeeUstx) fail('bad fee/ceiling in config');
if (!helperSource.includes(`'${cfg.payees[0]})`) || !helperSource.includes(`'${cfg.payees[1]})`)) fail('rendered helper does not contain the config payees');

let name = key.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
try {
  const reg = JSON.parse(readFileSync(resolve(root, 'functions/ft/collections.json'), 'utf8'));
  const e = reg.collections?.[key] ?? reg[key];
  if (e?.label || e?.name) name = e.label ?? e.name;
} catch { /* fall back to the derived name */ }
const page = {
  key, name, master: cfg.master, source: cfg.source, group: cfg.group, payees: cfg.payees,
  initialFeeUstx: cfg.initialFeeUstx, maxFeeUstx: cfg.maxFeeUstx, deployer: pins.deployer,
  contractName: `forever-twin-${key}`.slice(0, 40), gateway: 'http://127.0.0.1:8080', manifestPath: `/ft/data/${key}.manifest.json`,
  listingReadFn: cfg.listingReadFn || undefined, testToken: cfg.testToken || undefined,
  largeOnDemand: cfg.largeOnDemand === true ? true : undefined
};

const dir = resolve(root, 'canaries/forever-twins-launch');
const stampSrc = readFileSync(resolve(dir, 'main.ts'), 'utf8') + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8');
const stamp = `ftl-${new Date().toISOString().slice(0, 10)}-${sha(stampSrc).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  define: {
    __BUILD__: JSON.stringify(stamp), __CFG__: JSON.stringify(JSON.stringify(page)), __HELPER__: JSON.stringify(helperSource),
    __MANIFEST__: JSON.stringify(manifestText), __PINS__: JSON.stringify(JSON.stringify({ helperSha, manifestSha })),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, `canaries/build/forever-twins-launch-${key}-canary.html`);
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}\n  helper ${helperSha}\n  manifest ${manifestSha}\n  deployer ${pins.deployer}`);

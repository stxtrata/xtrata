#!/usr/bin/env node
// Builds canaries/somewhere-else-inscribe into ONE self-contained HTML file (the 24 WebPs, the article source and the reader
// template are embedded). Usage:
//   node scripts/build-somewhere-else-canary.mjs                         verify against the pins and build
//   node scripts/build-somewhere-else-canary.mjs --pin                   record the pins for the current assets
//   node scripts/build-somewhere-else-canary.mjs --owner SP...           build a copy that only ever pays to that address
//   options: --resolver https://xtrata.xyz/inscription/{id}   --token-uri https://...   --fee-mult 1.5   --out path
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const root = resolve(import.meta.dirname, '..');
const dir = resolve(root, 'canaries/somewhere-else-inscribe');
const assets = resolve(opt('assets', resolve(dir, 'assets')));
const sha = (x) => createHash('sha256').update(x).digest('hex');
const fail = (m) => { console.error(`REFUSED: ${m}`); process.exit(1); };

const manifest = JSON.parse(readFileSync(resolve(assets, 'manifest.json'), 'utf8'));
const source = readFileSync(resolve(assets, 'source-article.html'), 'utf8');
const loaderTpl = readFileSync(resolve(assets, 'loader.template.html'), 'utf8');
if (!Array.isArray(manifest) || !manifest.length) fail('manifest.json is empty');
const webp = manifest.map((m) => {
  const bytes = readFileSync(resolve(assets, m.file));
  if (bytes.length !== m.bytes) fail(`${m.file}: ${bytes.length} bytes, manifest says ${m.bytes}`);
  if (sha(bytes) !== m.sha256) fail(`${m.file}: sha256 differs from the manifest`);
  if (bytes.slice(0, 4).toString() !== 'RIFF' || bytes.slice(8, 12).toString() !== 'WEBP') fail(`${m.file} is not a WebP`);
  return bytes.toString('base64');
});
if (new Set(manifest.map((m) => m.slot)).size !== manifest.length) fail('duplicate slots in the manifest');
const figures = (source.match(/<p><img [^>]*?\/><\/p>|<p>\[image: [\s\S]*?\]<\/p>/g) || []).length;
if (figures !== manifest.length) fail(`the article has ${figures} image placeholders but the manifest has ${manifest.length} images`);
const pinsNow = { assetsSha: sha(manifest.map((m) => m.sha256).join('\n')), sourceSha: sha(source), loaderSha: sha(loaderTpl) };

const pinsPath = resolve(dir, 'pins.json');
if (argv.includes('--pin')) { writeFileSync(pinsPath, JSON.stringify({ ...pinsNow, pinnedAt: new Date().toISOString().slice(0, 10) }, null, 2) + '\n'); console.log('pinned', pinsNow); }
if (!existsSync(pinsPath)) fail('no pins.json. Review the assets, then run with --pin.');
const pins = JSON.parse(readFileSync(pinsPath, 'utf8'));
for (const k of ['assetsSha', 'sourceSha', 'loaderSha']) if (pins[k] !== pinsNow[k]) fail(`${k} ${pinsNow[k]} is not the pinned ${pins[k]} (re-pin only if the change is intended)`);

const owner = opt('owner');
if (owner && !/^SP[0-9A-Z]{30,}$/.test(owner)) fail('--owner must be a mainnet SP... address');
const cfg = {
  core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  resolver: opt('resolver', 'https://xtrata.xyz/inscription/{id}'),
  tokenUri: opt('token-uri', 'https://yfa7uhk4vmrr3jjwr57fnm6ccvwi2r2ycufcjs6nsmrpjmr25azq.ardrive.net/wUH6HVyrIx2lNo9-VrPCFWyNR1gVCiTLzZMi9LI66DM'),
  feeMult: Number(opt('fee-mult', '1.5')),
  nodes: ['https://api.mainnet.hiro.so', 'https://xtrata.xyz/hiro/mainnet', 'https://stacks-node-api.mainnet.stacks.co'],
  ...(owner ? { ownerPin: owner } : {})
};
if (!cfg.resolver.includes('{id}')) fail('--resolver must contain {id}');
if (!(cfg.feeMult >= 1 && cfg.feeMult <= 10)) fail('--fee-mult must be 1..10');
const files = { source, loaderTpl, manifest: manifest.map(({ slot, alt, width, height, bytes, rolling, mime, sha256 }, i) => ({ slot, alt, width, height, bytes, rolling, mime, sha256, file: manifest[i].file })), webp };

const stamp = `se-${new Date().toISOString().slice(0, 10)}-${sha(readFileSync(resolve(dir, 'main.ts'), 'utf8') + readFileSync(resolve(dir, 'article.ts'), 'utf8') + pinsNow.assetsSha).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')], bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
  define: {
    __BUILD__: JSON.stringify(stamp), __CFG__: JSON.stringify(JSON.stringify(cfg)), __FILES__: JSON.stringify(JSON.stringify(files)),
    __PINS__: JSON.stringify(JSON.stringify(pinsNow)), global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
const out = resolve(opt('out', resolve(root, 'canaries/build/somewhere-else-inscribe-canary.html')));
mkdirSync(resolve(out, '..'), { recursive: true });
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB) build ${stamp}\n  images ${manifest.length} · assets ${pinsNow.assetsSha}${owner ? `\n  pinned owner ${owner}` : ''}`);

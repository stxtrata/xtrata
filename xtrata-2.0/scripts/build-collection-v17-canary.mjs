#!/usr/bin/env node
// Builds canaries/collection-v17 into ONE self-contained HTML file
// (canaries/build/collection-v17-canary.html) that can be served statically or
// inscribed. Refuses to build if the helper source is not the pinned v1.7.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const PINNED = 'd76e697e3d26fc828af21f046881b05e518ef456e86d863181672b55e2c16999';
const source = readFileSync(resolve(root, 'contracts/live/xtrata-collection-mint-v1.7.clar'), 'utf8');
const sha = createHash('sha256').update(source).digest('hex');
if (sha !== PINNED) { console.error(`helper source sha256 ${sha} is not the pinned ${PINNED}`); process.exit(1); }

const stamp = `v1-${new Date().toISOString().slice(0, 10)}-${createHash('sha256').update(readFileSync(resolve(root, 'canaries/collection-v17/main.ts')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8')).digest('hex').slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(root, 'canaries/collection-v17/main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.clar': 'text' },
  define: { __BUILD__: JSON.stringify(stamp), __SOURCE_SHA__: JSON.stringify(sha), global: 'globalThis', 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(resolve(root, 'canaries/collection-v17/template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/collection-v17-canary.html');
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);

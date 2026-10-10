#!/usr/bin/env node
// Builds canaries/snes-catalogue/harness into ONE self-contained HTML file (canaries/build/snes-arcade-harness.html):
// the pinned emulator + the Arcade wrapper's loading code + an in-page mock chain. Open it straight from disk: it needs
// no wallet and no network.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, dir, sha, releaseSha, packPlugin } from './snes-pack.mjs';

const hdir = resolve(dir, 'harness');
const builtAt = new Date();
const src = readFileSync(resolve(hdir, 'harness.ts')) + readFileSync(resolve(hdir, 'mock-node.ts')) + readFileSync(resolve(dir, 'wrapper.ts'));
const stamp = `harness-${builtAt.toISOString().slice(0, 10)}-${sha(src + releaseSha).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(hdir, 'harness.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  plugins: [packPlugin], loader: { '.html': 'text' },
  define: { __BUILD__: JSON.stringify(stamp), global: 'globalThis', 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const html = readFileSync(resolve(hdir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/snes-arcade-harness.html');
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);

#!/usr/bin/env node
// Builds canaries/arcade-scores-v2 into ONE self-contained HTML file
// (canaries/build/arcade-scores-v2-canary.html). Refuses to build if the
// contract source is not the pinned one, so the page can only deploy the
// reviewed leaderboard. The Astro Blaster 3 engine is bundled so the canary
// can fly and verify a real run; its sha256 is shown on the page.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const PINNED = 'c82a89c5da9d0fd0a3f37f348ef755d833c3149865d9837f86c0a2831d0eefd5';
const source = readFileSync(resolve(root, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8');
const sha = createHash('sha256').update(source).digest('hex');
if (sha !== PINNED) { console.error(`contract source sha256 ${sha} is not the pinned ${PINNED}`); process.exit(1); }
const engineSha = createHash('sha256').update(readFileSync(resolve(root, 'recursive-apps/astro-blaster-3/release/sim.js'))).digest('hex');

const dir = resolve(root, 'canaries/arcade-scores-v2');
const stamp = `v1-${new Date().toISOString().slice(0, 10)}-${createHash('sha256').update(readFileSync(resolve(dir, 'main.ts')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8')).digest('hex').slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.clar': 'text' },
  define: {
    __BUILD__: JSON.stringify(stamp), __SOURCE_SHA__: JSON.stringify(sha), __ENGINE_SHA__: JSON.stringify(engineSha),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/arcade-scores-v2-canary.html');
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);

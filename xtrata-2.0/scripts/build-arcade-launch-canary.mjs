#!/usr/bin/env node
// Builds canaries/arcade-launch into ONE self-contained HTML file
// (canaries/build/arcade-launch-canary.html). The page can only deploy the pinned
// leaderboard contract and only inscribe the pinned arcade file: the build refuses to run
// otherwise. When the arcade changes on purpose, update PINNED_ARCADE in the same commit.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const PINNED_CONTRACT = 'c82a89c5da9d0fd0a3f37f348ef755d833c3149865d9837f86c0a2831d0eefd5';
const PINNED_ARCADE = '0fb9085b47c78a27dc4bb7392a9a5cbba5926f7bc3ee3a680a3f80bd713569e9';
const sha = (buf) => createHash('sha256').update(buf).digest('hex');

const contract = readFileSync(resolve(root, 'contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar'), 'utf8');
if (sha(contract) !== PINNED_CONTRACT) { console.error(`contract source sha256 ${sha(contract)} is not the pinned ${PINNED_CONTRACT}`); process.exit(1); }
const arcadePath = resolve(root, 'recursive-apps/xtrata-arcade/release/xtrata-arcade.html');
const arcade = readFileSync(arcadePath);
if (sha(arcade) !== PINNED_ARCADE) { console.error(`arcade file sha256 ${sha(arcade)} is not the pinned ${PINNED_ARCADE}`); process.exit(1); }
if (arcade[0] === 0xef && arcade[1] === 0xbb) { console.error('arcade file starts with a UTF-8 BOM; the canary hashes the text form'); process.exit(1); }
if (/https?:\/\/(cdnjs|fonts\.googleapis|fonts\.gstatic|unpkg|cdn\.jsdelivr)/.test(arcade.toString('utf8'))) { console.error('arcade file still references a CDN: build it with INSCRIBE=1'); process.exit(1); }

const boards = JSON.parse(readFileSync(resolve(root, 'recursive-apps/xtrata-arcade/boards.json'), 'utf8'));
if (boards.length !== 26 || new Set(boards.map((b) => b.id)).size !== 26 || boards.some((b) => !/^[a-z0-9_-]{1,24}$/.test(b.id))) { console.error('boards.json must hold 26 unique ids of at most 24 characters'); process.exit(1); }

const dir = resolve(root, 'canaries/arcade-launch');
const stamp = `v1-${new Date().toISOString().slice(0, 10)}-${sha(readFileSync(resolve(dir, 'main.ts')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8')).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.clar': 'text', '.html': 'text' },
  define: {
    __BUILD__: JSON.stringify(stamp), __SOURCE_SHA__: JSON.stringify(PINNED_CONTRACT), __ARCADE_SHA__: JSON.stringify(PINNED_ARCADE),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/arcade-launch-canary.html');
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);

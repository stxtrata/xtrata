#!/usr/bin/env node
// Builds canaries/snes-catalogue into ONE self-contained HTML file
// (canaries/build/snes-catalogue-canary.html).
//
// The page can only deploy the two pinned contracts and only inscribe the pinned ROMs and artwork: the build
// refuses to run otherwise. When something changes on purpose, update the PINNED_* values below in the same commit
// (the build prints the new value). ROM hashes are the emulator's canonical SHA-256 (512-byte copier header
// stripped when size % 1024 == 512) and are recomputed here from the files.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, dir, sha, games, releaseSha, packPlugin, PINNED_CATALOGUE, PINNED_ADAPTER } from './snes-pack.mjs';

const builtAt = new Date();
const stamp = `v1-${builtAt.toISOString().slice(0, 10)}-${sha(readFileSync(resolve(dir, 'main.ts')) + readFileSync(resolve(root, 'canaries/collection-v17/wallet.ts'), 'utf8') + releaseSha).slice(0, 8)}`;
const result = await build({
  entryPoints: [resolve(dir, 'main.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false,
  loader: { '.clar': 'text', '.html': 'text' },
  plugins: [packPlugin],
  define: {
    __BUILD__: JSON.stringify(stamp), __BUILT_AT__: JSON.stringify(builtAt.toISOString()),
    __CATALOGUE_SHA__: JSON.stringify(PINNED_CATALOGUE), __ADAPTER_SHA__: JSON.stringify(PINNED_ADAPTER), __PACK_SHA__: JSON.stringify(releaseSha),
    global: 'globalThis', 'process.env.NODE_ENV': '"production"'
  },
  legalComments: 'none'
});
// Inline-script safety: the embedded emulator holds both "</script" and "<!--" inside JS strings.
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const html = readFileSync(resolve(dir, 'template.html'), 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync(resolve(root, 'canaries/build'), { recursive: true });
const out = resolve(root, 'canaries/build/snes-catalogue-canary.html');
writeFileSync(out, html);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KB) build ${stamp}`);
console.log(`catalogue ${PINNED_CATALOGUE}\nadapter   ${PINNED_ADAPTER}\nrelease   ${releaseSha}`);
for (const g of games) console.log(`  ${g.title.padEnd(13)} ${kb(g.size).padStart(9)} · ${Math.ceil(g.size / 16384)} chunks · canonical sha256 ${g.romSha}`);

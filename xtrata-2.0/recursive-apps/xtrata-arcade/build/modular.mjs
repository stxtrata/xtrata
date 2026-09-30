#!/usr/bin/env node
/*
 * Xtrata Arcade Hall - modular build
 *
 *   node build/modular.mjs split  [release.html]   one-off: release → src/ (proves the round trip)
 *   node build/modular.mjs check                   src/ rebuilds the pinned v1.3 byte for byte
 *   node build/modular.mjs build                   src/ → dist/: 5 packs, single file, parent, manifest
 *
 * src/parts/<name>   one file per part (the source of truth from v1.4 on)
 * src/skeleton.html  the single-file layout with @@part:NAME@@ slots
 * parent/ids.json    inscription ids the parent should use (see README)
 */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const P = require('./hall-parts.cjs');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const SRC = join(root, 'src'), PARTS = join(SRC, 'parts'), DIST = join(root, 'dist');
const V13 = join(root, 'release', 'xtrata-arcade.html');
const V13_SHA = 'd9fa6b2085d64c1e5cb63682bbc278e1fe83a335d8dda914d657d9ba675bd62c'; // inscription #3078
const sha = (s) => createHash('sha256').update(s).digest('hex');
const kb = (n) => (n / 1024).toFixed(1) + ' KB';

function readParts() {
  const parts = {};
  for (const f of readdirSync(PARTS)) parts[f] = readFileSync(join(PARTS, f), 'utf8');
  return parts;
}

function split(file = V13) {
  const html = readFileSync(file, 'utf8');
  const { parts, skeleton } = P.splitRelease(html);
  if (P.assembleRelease(skeleton, parts) !== html) throw new Error('split is not lossless');
  mkdirSync(PARTS, { recursive: true });
  for (const [name, text] of Object.entries(parts)) writeFileSync(join(PARTS, name), text);
  writeFileSync(join(SRC, 'skeleton.html'), skeleton);
  console.log(`split ${file} → ${Object.keys(parts).length} parts (round trip exact)`);
}

// The unchanged v1.3 parts, rebuilt, must equal the inscribed file: guards the split itself.
function check() {
  const html = readFileSync(V13, 'utf8');
  if (sha(html) !== V13_SHA) throw new Error('release/xtrata-arcade.html is not the pinned v1.3');
  const { parts, skeleton } = P.splitRelease(html);
  const again = P.assembleRelease(skeleton, parts);
  if (sha(again) !== V13_SHA) throw new Error('v1.3 does not round-trip');
  // Every pack round-trips through its text form.
  for (const name of P.PACK_ORDER) {
    const back = P.parsePack(P.makePack(name, parts));
    for (const p of P.PACKS[name]) if (back[p] !== parts[p]) throw new Error(`pack ${name}: ${p} does not round-trip`);
  }
  console.log('check: v1.3 (#3078) splits and rebuilds byte for byte; all 5 packs round-trip');
}

function build() {
  const parts = readParts();
  const skeleton = readFileSync(join(SRC, 'skeleton.html'), 'utf8');
  const ids = JSON.parse(readFileSync(join(root, 'parent', 'ids.json'), 'utf8'));
  mkdirSync(join(DIST, 'packs'), { recursive: true });
  const manifest = { version: ids.version, bundleId: ids.bundleId, packs: {}, parts: {} };

  for (const name of P.PACK_ORDER) {
    const text = P.makePack(name, parts);
    writeFileSync(join(DIST, 'packs', `xtrata-arcade-${name}.txt`), text);
    manifest.packs[name] = { file: `packs/xtrata-arcade-${name}.txt`, bytes: Buffer.byteLength(text), sha256: sha(text), id: ids.packs[name] || 0 };
  }
  for (const [name, text] of Object.entries(parts)) manifest.parts[name] = { pack: P.packOf(name), bytes: Buffer.byteLength(text), sha256: sha(text) };

  // Which packs differ from the bundle (#3078)? Those are the ones worth inscribing.
  if (existsSync(V13)) {
    const base = P.splitRelease(readFileSync(V13, 'utf8')).parts;
    for (const name of P.PACK_ORDER) {
      const changed = P.PACKS[name].filter((p) => base[p] !== parts[p]);
      manifest.packs[name].changedSinceBundle = changed;
    }
  }

  const single = P.assembleRelease(skeleton, parts);
  writeFileSync(join(DIST, `xtrata-arcade-${ids.version}.html`), single);

  const tpl = readFileSync(join(root, 'parent', 'parent.template.html'), 'utf8');
  const lib = readFileSync(join(here, 'hall-parts.cjs'), 'utf8');
  // Inline-script safety: '</script' ends the element early and '<!--' can stop it ending at all.
  if (/<\/script|<!--/i.test(lib)) throw new Error('hall-parts.cjs must not contain </script or <!-- (use \\x3c)');
  const config = {
    version: ids.version,
    bundleId: ids.bundleId || 0,
    packs: Object.fromEntries(P.PACK_ORDER.map((n) => [n, ids.packs[n] || 0])),
    parts: ids.parts || {},
    parentTokenId: ids.parentTokenId || 0
  };
  const parent = tpl.replace('/*@@HALL_PARTS@@*/', () => lib).replace('/*@@CONFIG@@*/{}', () => JSON.stringify(config, null, 2).replace(/\n/g, '\n    '));
  writeFileSync(join(DIST, 'xtrata-arcade-parent.html'), parent);
  manifest.parent = { file: 'xtrata-arcade-parent.html', bytes: Buffer.byteLength(parent), sha256: sha(parent), config };
  manifest.single = { file: `xtrata-arcade-${ids.version}.html`, bytes: Buffer.byteLength(single), sha256: sha(single) };
  writeFileSync(join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  console.log(`build ${ids.version}`);
  for (const name of P.PACK_ORDER) {
    const m = manifest.packs[name];
    const note = m.changedSinceBundle ? (m.changedSinceBundle.length ? 'CHANGED: ' + m.changedSinceBundle.join(', ') : 'same as #' + ids.bundleId) : '';
    console.log(`  ${name.padEnd(7)} ${kb(m.bytes).padStart(10)}  id ${String(m.id).padEnd(6)} ${note}`);
  }
  console.log(`  parent  ${kb(manifest.parent.bytes).padStart(10)}   single file ${kb(single.length)}`);
}

const cmd = process.argv[2];
if (cmd === 'split') split(process.argv[3]);
else if (cmd === 'check') check();
else if (cmd === 'build') build();
else { console.error('usage: node build/modular.mjs split|check|build'); process.exit(1); }

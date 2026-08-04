#!/usr/bin/env node
// Build the single-file board.
//
// An inscription cannot fetch anything, so the output is one HTML file with
// every module inlined and no external request of any kind. There is no
// bundler dependency here either: the module graph is small and the source
// style is narrow (named imports from relative paths, `export const|function|
// class`), so a hundred lines of transform beats a toolchain.
//
//   node scripts/build.mjs
//   node scripts/build.mjs --seal sealed-game.json
//
// The sealed form embeds a finished game's log in the page, so it renders with
// no network at all. That is what makes an inscribed game a durable artifact
// rather than a link to a contract someone has to keep reading.

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = resolve(ROOT, 'src');
const OUT_DIR = resolve(ROOT, 'dist');

const ENTRY = './app.js';

const IMPORT_RE = /^import\s*\{([\s\S]*?)\}\s*from\s*['"](\.\/[^'"]+)['"];?\s*$/gm;
const EXPORT_DECL_RE = /^export\s+(const|let|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm;

async function loadModule(id, seen) {
  if (seen.has(id)) return;
  seen.set(id, null);

  const path = resolve(SRC, id.replace(/^\.\//, ''));
  const source = await readFile(path, 'utf8');

  const dependencies = [];
  for (const match of source.matchAll(IMPORT_RE)) dependencies.push(match[2]);
  for (const dependency of dependencies) await loadModule(dependency, seen);

  const exported = new Set();
  for (const match of source.matchAll(EXPORT_DECL_RE)) exported.add(match[2]);

  if (/^export\s+(default|\{)/m.test(source)) {
    throw new Error(`${id}: default and re-exports are not supported by this build`);
  }

  const body = source
    .replace(IMPORT_RE, (_, names, from) => `const {${names}} = __require(${JSON.stringify(from)});`)
    .replace(EXPORT_DECL_RE, (_, keyword, name) => `${keyword} ${name}`);

  const assignment = exported.size
    ? `\nObject.assign(__exports, { ${[...exported].join(', ')} });\n`
    : '';

  seen.set(id, `__modules[${JSON.stringify(id)}] = function (__exports, __require) {\n${body}${assignment}};`);
}

async function bundle() {
  const seen = new Map();
  await loadModule(ENTRY, seen);

  const runtime = `
const __modules = {};
const __cache = {};
function __require(id) {
  if (__cache[id]) return __cache[id];
  const __exports = {};
  __cache[id] = __exports;
  __modules[id](__exports, __require);
  return __exports;
}
`.trim();

  return [runtime, ...seen.values()].join('\n\n');
}

async function main() {
  const args = process.argv.slice(2);
  const sealIndex = args.indexOf('--seal');
  const sealPath = sealIndex >= 0 ? args[sealIndex + 1] : null;

  const html = await readFile(resolve(ROOT, 'index.html'), 'utf8');
  const modules = await bundle();

  // Replace the dev entry script with the inlined bundle.
  const entryScript = /<script type="module">[\s\S]*?<\/script>/;
  if (!entryScript.test(html)) throw new Error('could not find the entry script in index.html');

  const originalEntry = html.match(entryScript)[0];
  const wiring = originalEntry
    .replace(/<\/?script[^>]*>/g, '')
    .replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/m, '');

  let sealedBlock = '';
  let name = 'xtrata-chess-board';

  if (sealPath) {
    const sealed = JSON.parse(await readFile(resolve(process.cwd(), sealPath), 'utf8'));
    sealedBlock = `window.__XTRATA_CHESS_SEALED__ = ${JSON.stringify(sealed)};\n`;
    name = `xtrata-chess-game-${sealed.game ?? 'sealed'}`;
  }

  const script = [
    '<script>',
    '(function () {',
    sealedBlock,
    modules,
    'const { ChessBoardApp } = __require("./app.js");',
    wiring.trim(),
    '})();',
    '</script>'
  ].join('\n');

  const output = html.replace(entryScript, script);

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, `${name}.html`);
  await writeFile(outPath, output, 'utf8');

  const bytes = Buffer.byteLength(output, 'utf8');
  const sha = createHash('sha256').update(output).digest('hex');

  console.log(`built  ${outPath}`);
  console.log(`bytes  ${bytes.toLocaleString()}`);
  console.log(`sha256 ${sha}`);
  if (sealPath) console.log('mode   sealed (renders with no network)');

  if (/https?:\/\/(?!www\.w3\.org)/.test(output.replace(/DEFAULT_API[\s\S]{0,200}/, ''))) {
    console.warn('\nwarning: the output mentions an external URL, check it is not a runtime fetch');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

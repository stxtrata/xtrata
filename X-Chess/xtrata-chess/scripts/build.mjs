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

const ENTRY = './boot.js';

// A build stamp both the artifact and the manifest carry, so a page can tell
// you whether it is the build you just made. The id is content-derived, so an
// unchanged rebuild keeps the same id and only the timestamp moves. That is
// deliberate: what matters is whether the bytes are current, not when they were
// produced.
function buildStamp(parts) {
  const digest = createHash('sha256');
  for (const part of parts) digest.update(part);
  return {
    version: '1.0.0',
    buildId: digest.digest('hex').slice(0, 12),
    builtAt: new Date().toISOString()
  };
}

async function writeManifest(name, stamp, extra = {}) {
  const manifestPath = resolve(OUT_DIR, 'build-manifest.json');
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    manifest = {};
  }
  manifest[name] = { ...stamp, ...extra };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  return manifestPath;
}

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

// Inlining JavaScript into an HTML <script> block has one hard rule: the text
// "</script>" must never appear in it, because the HTML parser closes the tag on
// sight without caring that it is inside a string. src/child.js generates child
// pages and therefore contains that text verbatim, which silently truncated
// every self-contained build at that point and turned the remainder into markup.
//
// Inside a JavaScript string, <\/script> is identical to </script>, so escaping
// costs nothing and the parser stops noticing.
// A self-contained page has exactly one script and loads nothing. If a stray
// </script> ever slips through again, the build stops rather than shipping a
// page that looks fine and does nothing.
function assertSingleScript(html, label) {
  // Only the closing tag ends a script block, so that is what to count. An
  // opening "<script" inside a JavaScript string is inert; a closing one is not.
  const closers = (html.match(/<\/script/gi) || []).length;
  if (closers !== 1) {
    throw new Error(
      `${label}: expected exactly one unescaped </script>, found ${closers}. ` +
        'One inside the bundled source will have truncated the page there.'
    );
  }
}

function escapeForInlineScript(code) {
  return code.replace(/<\/(script)/gi, '<\\/$1');
}

async function bundleFrom(entry) {
  const seen = new Map();
  await loadModule(entry, seen);

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

const bundle = () => bundleFrom(ENTRY);

// Pull the shell out of index.html so the engine can carry it. The dev page and
// the inscribed engine then share one definition of the markup rather than
// drifting apart.
function extractShell(html) {
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
  const body = (html.match(/<body>([\s\S]*?)<\/body>/) || [, ''])[1];
  const markup = body.replace(/<script[\s\S]*?<\/script>/g, '').trim();
  if (!markup) throw new Error('could not find the board markup in index.html');
  return { css: css.trim(), html: markup };
}

// The engine as a standalone inscription: every module, the shell it mounts
// when a page does not already have one, and nothing else. Children depend on
// this rather than carrying their own copy.
async function buildEngine(html) {
  const shell = extractShell(html);
  const modules = await bundle();

  const stamp = buildStamp([modules, shell.css, shell.html]);

  const source = [
    '(function () {',
    `window.__XTRATA_CHESS_BUILD__ = ${JSON.stringify(stamp)};`,
    modules,
    'const __boot = __require("./boot.js");',
    `__boot.SHELL.css = ${JSON.stringify(shell.css)};`,
    `__boot.SHELL.html = ${JSON.stringify(shell.html)};`,
    'if (document.readyState === "loading") {',
    '  document.addEventListener("DOMContentLoaded", function () { __boot.boot(); });',
    '} else {',
    '  __boot.boot();',
    '}',
    '})();'
  ].join('\n');

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, 'xtrata-chess-engine.js');
  await writeFile(outPath, source, 'utf8');

  const bytes = Buffer.byteLength(source, 'utf8');
  const sha = createHash('sha256').update(source).digest('hex');

  await writeManifest('engine', stamp);

  console.log(`built  ${outPath}`);
  console.log(`bytes  ${bytes.toLocaleString()}`);
  console.log(`sha256 ${sha}`);
  console.log(`build  ${stamp.version} · ${stamp.buildId} · ${stamp.builtAt}`);
  console.log('\nInscribe this first. Every board and every child game depends on it,');
  console.log('so its inscription id is what children carry.');
  return { outPath, bytes, sha };
}

// The open board as a thin page that depends on the inscribed engine.
//
// It carries its own contract. An inscribed board that opened with an empty
// address box would be a tool for finding the game rather than the game, and
// whoever inscribed it already knows the answer.
async function buildBoard(engineId, contract, network = 'mainnet') {
  // exact, because an inscribed board cannot be corrected and must not be able
  // to talk to a contract other than the one it was built against. Falling back
  // would show a different log under the same game number.
  const config = contract
    ? `<script>window.__XTRATA_CHESS_BOARD__ = ${JSON.stringify({ contract, network, exact: true })};</script>\n`
    : '';

  const source = `<!doctype html>
<meta charset="utf-8">
<title>X Chess</title>
${config}<script src="/i/${engineId}"></script>
`;

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, 'xtrata-chess-open-board.html');
  await writeFile(outPath, source, 'utf8');

  console.log(`built  ${outPath}`);
  console.log(`bytes  ${Buffer.byteLength(source, 'utf8')}`);
  console.log(`sha256 ${createHash('sha256').update(source).digest('hex')}`);
  console.log(`\nSeal with dependency [${engineId}].`);
  return outPath;
}

// The launch canary as one file: every module inlined, plus the contract source
// itself, so the page that deploys the contract carries the exact bytes it is
// going to deploy rather than fetching them from somewhere.
async function buildCanary() {
  const html = await readFile(resolve(ROOT, 'canary.html'), 'utf8');
  // Every contract travels with the canary, so the page can deploy any of them
  // and always carries the exact bytes it is going to send.
  const names = ['xtrata-chess-log-v1', 'xtrata-chess-log-v2', 'xtrata-chess-log-v3'];
  const contracts = Object.fromEntries(
    await Promise.all(
      names.map(async (name) => [
        name,
        await readFile(resolve(ROOT, 'contracts', `${name}.clar`), 'utf8')
      ])
    )
  );
  // The newest, which is what the canary offers first.
  const contract = contracts[names[names.length - 1]];
  const modules = await bundleFrom('./canary.js');

  const entryScript = /<script type="module">[\s\S]*?<\/script>/;
  if (!entryScript.test(html)) throw new Error('could not find the entry script in canary.html');

  const wiring = html
    .match(entryScript)[0]
    .replace(/<\/?script[^>]*>/g, '')
    .replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/m, '');

  const stamp = buildStamp([modules, JSON.stringify(contracts), html]);

  const script = [
    '<script>',
    '(function () {',
    `window.__XTRATA_CHESS_BUILD__ = ${JSON.stringify(stamp)};`,
    `window.__XTRATA_CHESS_CONTRACTS__ = ${JSON.stringify(contracts)};`,
    modules,
    'const { LaunchCanary } = __require("./canary.js");',
    wiring.trim(),
    '})();',
    '</script>'
  ].join('\n');

  const output = html.replace(entryScript, script);
  assertSingleScript(output, 'launch canary');

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, 'xtrata-chess-launch-canary.html');
  await writeFile(outPath, output, 'utf8');

  const contractHash = createHash('sha256').update(contract).digest('hex');
  await writeManifest('canary', stamp, { contractHash });

  console.log(`built  ${outPath}`);
  console.log(`bytes  ${Buffer.byteLength(output, 'utf8').toLocaleString()}`);
  console.log(`sha256 ${createHash('sha256').update(output).digest('hex')}`);
  console.log(`build  ${stamp.version} · ${stamp.buildId} · ${stamp.builtAt}`);
  for (const [name, source] of Object.entries(contracts)) {
    console.log(
      `inlined ${name}: ${source.length.toLocaleString()} bytes, ` +
        `sha256 ${createHash('sha256').update(source).digest('hex')}`
    );
  }
  console.log('Open it in a browser with Leather or Xverse installed. No seed phrase is needed.');
}

async function main() {
  const args = process.argv.slice(2);
  const sealIndex = args.indexOf('--seal');
  const sealPath = sealIndex >= 0 ? args[sealIndex + 1] : null;
  const engineIdIndex = args.indexOf('--engine-id');
  const engineId = engineIdIndex >= 0 ? args[engineIdIndex + 1] : null;

  const html = await readFile(resolve(ROOT, 'index.html'), 'utf8');

  if (args.includes('--canary')) {
    await buildCanary();
    return;
  }

  if (args.includes('--engine')) {
    await buildEngine(html);
    return;
  }

  if (args.includes('--board')) {
    if (!engineId) throw new Error('--board needs --engine-id <inscription id>');
    const contractIndex = args.indexOf('--contract');
    const networkIndex = args.indexOf('--network');
    await buildBoard(
      engineId,
      contractIndex >= 0 ? args[contractIndex + 1] : null,
      networkIndex >= 0 ? args[networkIndex + 1] : 'mainnet'
    );
    return;
  }

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

  const contractIndex = args.indexOf('--contract');
  if (contractIndex >= 0) {
    const networkIndex = args.indexOf('--network');
    const boardConfig = {
      contract: args[contractIndex + 1],
      network: networkIndex >= 0 ? args[networkIndex + 1] : 'mainnet',
      exact: true
    };
    sealedBlock += `window.__XTRATA_CHESS_BOARD__ = ${JSON.stringify(boardConfig)};\n`;
    // Named after the contract it is bound to. An inscription is permanent and
    // there will be more than one of these over time; a file called "play" says
    // nothing about which contract it talks to, and the whole point of exact is
    // that this file talks to one and only one.
    const contractName = String(boardConfig.contract).split('.')[1] || '';
    const version = contractName.match(/v\d+$/)?.[0];
    name = version ? `xtrata-chess-board-${version}` : 'xtrata-chess-play';
  }

  if (sealPath) {
    const sealed = JSON.parse(await readFile(resolve(process.cwd(), sealPath), 'utf8'));
    sealedBlock = `window.__XTRATA_CHESS_SEALED__ = ${JSON.stringify(sealed)};\n`;
    name = `xtrata-chess-game-${sealed.game ?? 'sealed'}`;
  }

  const script = [
    '<script>',
    '(function () {',
    sealedBlock,
    escapeForInlineScript(modules),
    'const __boot = __require("./boot.js");',
    '__boot.boot();',
    '})();',
    '</script>'
  ].join('\n');

  const output = html.replace(entryScript, script);
  assertSingleScript(output, name);

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

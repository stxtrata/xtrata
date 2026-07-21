#!/usr/bin/env node
/**
 * Extracts the public API surface of @xtrata/sdk and @xtrata/reconstruction
 * into docs/machine/sdk-api.json (machine-readable, for LLMs and tooling).
 *
 * Syntactic extraction via the repo's TypeScript compiler: every exported
 * declaration per module, with its kind and one-line signature. Also enforces
 * a parity gate: each module re-exported from src/index.ts must contribute at
 * least one export.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(rootDir, 'package.json'));
const ts = require('typescript');

const PACKAGES = [
  { name: '@xtrata/sdk', dir: 'packages/xtrata-sdk' },
  { name: '@xtrata/reconstruction', dir: 'packages/xtrata-reconstruction' }
];

const signatureOf = (node, source) => {
  const text = node.getText(source).replace(/\s+/g, ' ');
  const cut = text.search(/[{=]/);
  const sig = cut > 0 ? text.slice(0, cut).trim() : text.trim();
  return sig.length > 240 ? `${sig.slice(0, 237)}...` : sig;
};

const extractModule = async (filePath) => {
  const sourceText = await fs.readFile(filePath, 'utf8');
  const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.ES2022, true);
  const exports = [];
  const push = (name, kind, node) =>
    exports.push({ name, kind, signature: signatureOf(node, source) });

  for (const node of source.statements) {
    const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    if (ts.isFunctionDeclaration(node) && node.name) push(node.name.text, 'function', node);
    else if (ts.isClassDeclaration(node) && node.name) push(node.name.text, 'class', node);
    else if (ts.isInterfaceDeclaration(node)) push(node.name.text, 'interface', node);
    else if (ts.isTypeAliasDeclaration(node)) push(node.name.text, 'type', node);
    else if (ts.isEnumDeclaration(node)) push(node.name.text, 'enum', node);
    else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) push(decl.name.text, 'const', node);
      }
    }
  }
  return exports;
};

const main = async () => {
  const result = {
    $schema: './sdk-api.meta.json',
    generatedBy: 'scripts/sdk/api-extract.mjs',
    packages: {}
  };
  const problems = [];

  for (const pkg of PACKAGES) {
    const srcDir = path.join(rootDir, pkg.dir, 'src');
    const pkgJson = JSON.parse(await fs.readFile(path.join(rootDir, pkg.dir, 'package.json'), 'utf8'));
    const indexText = await fs.readFile(path.join(srcDir, 'index.ts'), 'utf8');
    const reexports = [...indexText.matchAll(/export \* from '\.\/(.+)\.js';/g)].map((m) => m[1]);
    const moduleNames = reexports.length > 0 ? reexports : ['index'];

    const modules = {};
    for (const mod of moduleNames) {
      const exports = await extractModule(path.join(srcDir, `${mod}.ts`));
      if (exports.length === 0) problems.push(`${pkg.name}: module ${mod} contributes no exports`);
      modules[mod] = exports;
    }
    result.packages[pkg.name] = { version: pkgJson.version, modules };
  }

  if (problems.length > 0) {
    console.error('[sdk:api:extract] FAIL');
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
  }

  const outDir = path.join(rootDir, 'docs', 'machine');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'sdk-api.json'), `${JSON.stringify(result, null, 2)}\n`);
  const counts = Object.entries(result.packages)
    .map(([name, p]) => `${name}=${Object.values(p.modules).flat().length}`)
    .join(' ');
  console.log(`[sdk:api:extract] PASS ${counts}`);
};

main().catch((error) => {
  console.error('[sdk:api:extract] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

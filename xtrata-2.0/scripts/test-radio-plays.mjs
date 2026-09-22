#!/usr/bin/env node
// Resolve both suites relative to this file, never the caller's working directory.
// Use only installed project runners; never download another Vitest version.
import { existsSync } from 'node:fs';
import { dirname, resolve, basename, join } from 'node:path';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const suites = [
  { cwd: resolve(root, 'contracts/clarinet'), tests: ['tests/xtrata-radio-plays-v1.0.test.ts'] },
  { cwd: root, tests: ['src/lib/deploy/__tests__/radio-plays-console.test.ts', 'src/lib/deploy/__tests__/radio-likes-console.test.ts'] }
];
for (const suite of suites) {
  suite.runner = resolve(suite.cwd, 'node_modules/vitest/vitest.mjs');
  if (!existsSync(suite.runner)) {
    console.error(`Project test dependencies are missing in ${suite.cwd}. Install that project's locked dependencies before retrying. No packages were downloaded.`);
    process.exit(1);
  }
}
// Clarinet regenerates its platform-specific deployment plan. CI can keep the
// exact source checkout clean by running that suite in a disposable copy.
let temporary;
try {
 if (process.argv.includes('--isolated')) {
  temporary = await mkdtemp(join(tmpdir(), 'xtrata-contract-tests-'));
  for (const name of ['clarinet', 'live']) {
   await cp(resolve(root, 'contracts', name), resolve(temporary, name), {
    recursive: true,
    filter: path => !['node_modules', '.cache'].includes(basename(path))
   });
  }
  await symlink(resolve(root, 'contracts/clarinet/node_modules'), resolve(temporary, 'clarinet/node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  suites[0].cwd = resolve(temporary, 'clarinet');
 }
 for (const suite of suites) {
  const result = spawnSync(process.execPath, [suite.runner, 'run', ...suite.tests], { cwd: suite.cwd, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
 }
} finally {
 if (temporary) await rm(temporary, {recursive: true, force: true});
}

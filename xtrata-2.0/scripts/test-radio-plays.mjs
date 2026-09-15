#!/usr/bin/env node
// Resolve both suites relative to this file, never the caller's working directory.
// Use only installed project runners; never download another Vitest version.
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
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
for (const suite of suites) {
  const result = spawnSync(process.execPath, [suite.runner, 'run', ...suite.tests], { cwd: suite.cwd, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

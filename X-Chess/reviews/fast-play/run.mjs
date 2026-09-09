import { build } from '../../X-Chess_2.0/node_modules/esbuild/lib/main.js';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
const scratch = await mkdtemp(join(tmpdir(), 'xchess-fast-proof-'));
try {
  const engine = join(scratch, 'engine.mjs');
  await build({ entryPoints: [fileURLToPath(new URL('../../X-Chess_2.0/packages/chess/engine.ts', import.meta.url))],
    outfile: engine, bundle: true, platform: 'node', format: 'esm' });
  const result = spawnSync(process.execPath, ['--test', fileURLToPath(new URL('./proof.test.mjs', import.meta.url))], {
    stdio: 'inherit', env: { ...process.env, XCHESS_PROOF_ENGINE: pathToFileURL(engine).href }
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally { await rm(scratch, { recursive: true, force: true }); }

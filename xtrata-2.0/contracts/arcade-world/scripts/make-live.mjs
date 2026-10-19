// Generates the mainnet variants of the arcade-world contracts from the simnet sources.
// Only lines tagged ";; @principal core" differ: `.mock-xtrata-core` becomes the real core.
// Usage: node scripts/make-live.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const liveDir = join(root, '..', 'live');
export const CORE = "'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3";
export const NAMES = ['xtrata-posters-v1', 'xtrata-world-v1'];

export function toLive(src) {
  return src.split('\n').map((line) =>
    line.includes(';; @principal core') ? line.replace('.mock-xtrata-core', CORE) : line).join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  let bad = 0;
  for (const n of NAMES) {
    const out = toLive(readFileSync(join(root, 'contracts', `${n}.clar`), 'utf8'));
    const dest = join(liveDir, `${n}.clar`);
    if (check) {
      if (!existsSync(dest) || readFileSync(dest, 'utf8') !== out) { console.log('STALE', dest); bad++; }
      else console.log('ok   ', dest);
    } else {
      mkdirSync(liveDir, { recursive: true });
      writeFileSync(dest, out);
      console.log('wrote', dest);
    }
  }
  process.exit(bad ? 1 : 0);
}

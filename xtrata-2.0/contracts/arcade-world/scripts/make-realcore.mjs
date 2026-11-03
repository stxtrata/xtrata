// Writes integration/contracts/*: the sim sources with the mock core swapped for the
// real core source deployed in the integration project as `.xtrata-v3-2-3`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'integration', 'contracts'), { recursive: true });
for (const n of ['xtrata-posters-v1', 'xtrata-world-v1', 'xtrata-door-skins-v1', 'xtrata-world-v2', 'xtrata-screen-v1', 'xtrata-games-v1']) {
  const src = readFileSync(join(root, 'contracts', `${n}.clar`), 'utf8');
  const out = src.split('\n').map((l) => l.includes(';; @principal core') ? l.replace('.mock-xtrata-core', '.xtrata-v3-2-3') : l).join('\n');
  writeFileSync(join(root, 'integration', 'contracts', `${n}.clar`), out);
}

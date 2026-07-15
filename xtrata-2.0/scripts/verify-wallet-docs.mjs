import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requirements = {
  'docs/wallet-architecture.md': [
    '# Wallet Architecture', '## Invariants', '## Provider capability matrix',
    '## Session state machine', '## Production surface inventory', '## Forbidden patterns'
  ],
  'docs/wallet-live-testing.md': [
    '# Wallet Live Testing', '## Capability matrix', '## Low-value transaction matrix',
    '## Rollback procedure', '## Release sign-off'
  ],
  'docs/app-reference.md': ['wallet/coordinator.ts', 'npm run smoke:wallet'],
  'docs/assumptions.md': ['RECONNECT_REQUIRED', 'expected sender', 'BroadcastChannel'],
  'AGENTS.md': ['docs/wallet-architecture.md', 'npm run smoke:wallet']
};

const missing = [];
for (const [file, values] of Object.entries(requirements)) {
  const source = await readFile(path.join(root, file), 'utf8');
  for (const value of values) if (!source.includes(value)) missing.push(`${file}: ${value}`);
}
if (missing.length) throw new Error(`Wallet documentation contract failed:\n- ${missing.join('\n- ')}`);
console.log(`Verified wallet documentation contract across ${Object.keys(requirements).length} files.`);

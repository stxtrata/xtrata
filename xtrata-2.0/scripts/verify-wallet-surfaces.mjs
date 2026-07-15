import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'src');
const violations = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__') await walk(file);
      continue;
    }
    if (!/\.(?:ts|tsx|js)$/.test(entry.name)) continue;
    const relative = path.relative(root, file);
    if (relative === 'src/lib/wallet/connect.ts' || relative.startsWith('src/lib/wallet/providers/')) {
      continue;
    }
    const source = await readFile(file, 'utf8');
    if (/wallet\/connect(?:\.ts)?['"]/.test(source)) {
      violations.push(`${relative}: imports the internal wallet transport`);
    }
    if (/\b(?:XverseProviders|LeatherProvider|BitcoinProvider)\b/.test(source) &&
        !relative.startsWith('src/lib/wallet/')) {
      violations.push(`${relative}: probes an injected wallet provider`);
    }
  }
}

await walk(sourceRoot);

const wizardFiles = ['index.html', 'suno.html', 'manifests.html'];
for (const name of wizardFiles) {
  const relative = `xtrata-agent-one/wizard/${name}`;
  const source = await readFile(path.join(root, relative), 'utf8');
  for (const required of ['agent-one.js?v=', 'Change account', 'w.subscribe']) {
    if (!source.includes(required)) violations.push(`${relative}: missing ${required}`);
  }
}

const runtime = await readFile(path.join(root, 'public/runtime/wallet-shim.js'), 'utf8');
if (!runtime.includes('requires the Xtrata host coordinator')) {
  violations.push('public/runtime/wallet-shim.js: host-only coordinator delegation is missing');
}

if (violations.length) {
  throw new Error(`Wallet surface verification failed:\n- ${violations.join('\n- ')}`);
}
console.log(`Verified coordinator-only wallet routing across authored source and ${wizardFiles.length} wizard pages.`);

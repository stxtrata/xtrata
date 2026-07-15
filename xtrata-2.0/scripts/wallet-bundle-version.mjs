import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const versionSource = await readFile(path.join(root, 'src/agent-one/version.ts'), 'utf8');
const match = versionSource.match(/AGENT_ONE_BUNDLE_VERSION\s*=\s*(\d+)/);
if (!match) throw new Error('Could not read AGENT_ONE_BUNDLE_VERSION.');
const version = match[1];
const files = ['index.html', 'suno.html', 'manifests.html'].map((name) =>
  path.join(root, 'xtrata-agent-one/wizard', name)
);
const expected = `agent-one.js?v=${version}`;
const write = process.argv.includes('--write');
const mismatches = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const updated = source.replace(/agent-one\.js\?v=\d+/g, expected);
  if (updated === source && !source.includes(expected)) {
    throw new Error(`${path.relative(root, file)} has no versioned Agent One bundle reference.`);
  }
  if (source !== updated) {
    if (write) await writeFile(file, updated);
    else mismatches.push(path.relative(root, file));
  }
}

if (mismatches.length) {
  throw new Error(`Wizard bundle version mismatch (${expected}): ${mismatches.join(', ')}`);
}

console.log(`${write ? 'Synchronized' : 'Verified'} ${expected} across ${files.length} wizard pages.`);

// Snapshot the exact shared sources into the independently deployable service.
import { mkdir, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base = new URL('../', import.meta.url);
const target = new URL('services/quick-play/shared/', base);
const files = [
  ...(await readdir(new URL('packages/chess/', base))).filter(n => n.endsWith('.ts')).map(n => 'chess/' + n),
  'fast/protocol.ts', 'fast/referee.ts', 'fast/registry.ts', 'chain/clarity.ts', 'protocol/sha256.ts'
];
const hashes = {};
for (const path of files) {
  const src = new URL('packages/' + path, base), dst = new URL(path, target);
  await mkdir(new URL('.', dst), { recursive: true }); await cp(src, dst);
  hashes[path] = createHash('sha256').update(await readFile(src)).digest('hex');
}
await writeFile(new URL('services/quick-play/SHARED-SOURCES.json', base), JSON.stringify(hashes,null,2)+'\n');
console.log('Service shared source snapshot: ' + files.length + ' files');

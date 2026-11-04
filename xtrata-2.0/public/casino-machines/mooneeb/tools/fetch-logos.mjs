// Fetch the official $LEO and STX logo files into art/logos/, then rebuild with `node tools/build-pack.mjs`.
//   node tools/fetch-logos.mjs [--stx <url-or-path-to-official-stacks-logo>]
// $LEO comes from its own token metadata (image_canonical_uri). For STX, pass the official file from the Stacks brand
// resources (stacks.co/brand) with --stx; it isn't published at a stable machine-readable URL. Both still need each
// project's OK before a public launch (see art/sources.json → needsPermission).
import { writeFile, mkdir, readFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), DIR = join(ROOT, 'art/logos');
await mkdir(DIR, { recursive: true });
const notesPath = join(DIR, 'logos.json'), notes = existsSync(notesPath) ? JSON.parse(await readFile(notesPath, 'utf8')) : {};
const extFor = type => ({ 'image/png': '.png', 'image/svg+xml': '.svg', 'image/webp': '.webp', 'image/jpeg': '.jpg' })[type.split(';')[0]] || '.png';
async function save(key, url) {
  if (!/^https?:/.test(url)) { const ext = extname(url) || '.png'; await copyFile(url, join(DIR, key + ext)); notes[key] = { source: url, fetchedAt: new Date().toISOString() }; console.log(key, '←', url); return; }
  const r = await fetch(url); if (!r.ok) throw Error(`${r.status} ${url}`);
  const ext = extFor(r.headers.get('content-type') || ''); await writeFile(join(DIR, key + ext), Buffer.from(await r.arrayBuffer()));
  notes[key] = { source: url, fetchedAt: new Date().toISOString() }; console.log(key, '←', url);
}
// $LEO: read the token's own metadata (through xtrata.xyz's Hiro proxy, or Hiro directly).
const LEO = 'SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token';
let meta = null;
for (const u of [`https://xtrata.xyz/hiro/mainnet/metadata/v1/ft/${LEO}`, `https://api.hiro.so/metadata/v1/ft/${LEO}`]) { try { const r = await fetch(u); if (r.ok) { meta = await r.json(); break; } } catch (e) {} }
if (!meta) console.error('Could not read the $LEO token metadata.');
else { let ok = false; for (const u of [meta.image_canonical_uri, meta.metadata?.image, meta.image_uri].filter(Boolean)) { try { await save('leo', u); ok = true; break; } catch (e) { console.error('leo:', e.message); } } if (!ok) console.error('No $LEO image could be downloaded.'); }
const i = process.argv.indexOf('--stx'); if (i > 0 && process.argv[i + 1]) await save('stx', process.argv[i + 1]); else console.log('STX: pass the official Stacks logo with --stx <url or file> (from stacks.co/brand).');
await writeFile(notesPath, JSON.stringify(notes, null, 2));
console.log('Now run: node tools/build-pack.mjs');

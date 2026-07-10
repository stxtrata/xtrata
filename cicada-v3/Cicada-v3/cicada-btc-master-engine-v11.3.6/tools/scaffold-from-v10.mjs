// Completes the v11.0.0 folder by bringing over the two large UNCHANGED
// artifacts from the v10.4.0 sibling that are not hand-maintained in v11:
//
//   1. src/cicada-renderer.js  — copied verbatim (cache-bust tokens bumped to
//      ?v=11.0.0). The renderer has no logic changes in v11; reduced-motion and
//      keyboard access are layered on from outside (CSS + cicada-core.js).
//   2. src/export-bundle-source.js — regenerated from the v11 runtime modules
//      via build-export-bundle.mjs, so exported inscriptions inherit the
//      accessible v11 core.
//
// All other v11 source files are authored directly in this folder and are NOT
// touched by this script.
//
// Usage (from the v11.0.0 folder root or anywhere):
//   node tools/scaffold-from-v10.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const V11 = join(here, '..');
const V10 = join(V11, '..', 'cicada-btc-master-engine-v10.4.0');

const bumpTokens = source => source.split('?v=10.4.0').join('?v=11.0.0');

const v10Renderer = join(V10, 'src', 'cicada-renderer.js');
if (!existsSync(v10Renderer)) {
    console.error('Could not find the v10.4.0 sibling renderer at:');
    console.error('  ' + v10Renderer);
    console.error('Place the v11.0.0 folder next to cicada-btc-master-engine-v10.4.0 and retry.');
    process.exit(1);
}

const rendererTarget = join(V11, 'src', 'cicada-renderer.js');
writeFileSync(rendererTarget, bumpTokens(readFileSync(v10Renderer, 'utf8')));
console.log('Copied cicada-renderer.js from v10.4.0 (tokens bumped to ?v=11.0.0).');

// Build the export bundle now that the renderer is present.
await import('./build-export-bundle.mjs');

console.log('\nv11.0.0 scaffold complete. Serve the folder and open index.html:');
console.log('  python3 -m http.server 8092   →   http://localhost:8092');

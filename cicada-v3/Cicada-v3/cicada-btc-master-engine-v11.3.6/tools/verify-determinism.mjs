// Acceptance test for v11.3.4. v11.x intentionally changes only post-rank bark
// traits relative to v10.4.0 / v11.0.0: the Bark Backdrop value set and, in v11.3,
// the seeded bark placement / family. Everything that defines the collection's
// rarity — every seed's rank, tier, and rarity score — must remain identical to
// v10.4.0, because bark is assigned post-rank and never feeds the score or the sort.
//
// This script loads both engines and asserts rank/tier/score equality across all
// 3,301 seeds, and that every assigned bark value is one of the new 16 (+none).
//
// Usage (Node 20.6+):  node tools/verify-determinism.mjs
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

register('data:text/javascript,' + encodeURIComponent(`
    export async function resolve(specifier, context, next) {
        return next(specifier.replace(/\\?v=[0-9.]+/g, ''), context);
    }
`));

const here = dirname(fileURLToPath(import.meta.url));
const V11 = join(here, '..', 'src', 'cicada-traits.js');
const V10 = join(here, '..', '..', 'cicada-btc-master-engine-v10.4.0', 'src', 'cicada-traits.js');

const NEW_BARK = new Set(['none', 'oak', 'maple', 'hickory', 'apple', 'willow', 'elm', 'ash',
    'birch', 'dogwood', 'linden', 'pear-cherry', 'poplar', 'eucalyptus', 'angophora', 'casuarina', 'acacia']);

const [v11, v10] = await Promise.all([
    import(pathToFileURL(V11).href),
    import(pathToFileURL(V10).href)
]);

const a = v11.getCollectionMetadata();
const b = v10.getCollectionMetadata();

let rank = 0, score = 0, tier = 0, badBark = 0;
const counts = {};
for (const it of a.seedItems) {
    const o = b.bySeed[it.seed];
    if (it.rank !== o.rank) rank++;
    if (it.rarityScore !== o.rarityScore) score++;
    if (it.rarityTier !== o.rarityTier) tier++;
    const bk = it.instructions.barkBackdrop;
    if (!NEW_BARK.has(bk)) badBark++;
    counts[bk] = (counts[bk] || 0) + 1;
}

const line = (name, n) => console.log(`${n === 0 ? 'PASS' : 'FAIL'}  ${name}: ${n} mismatch(es)`);
line('rank identical to v10.4.0', rank);
line('rarityScore identical to v10.4.0', score);
line('rarityTier identical to v10.4.0', tier);
line('all bark values valid (16 photos + none)', badBark);

const none = counts['none'] || 0;
console.log(`\nBark distribution: ${Object.keys(counts).length} distinct values, Studio Dark (none) = ${none} (${(none / 3301 * 100).toFixed(1)}%).`);

const failures = rank + score + tier + badBark;
if (failures === 0) {
    console.log('\nALL PASS — v11.3.4 rarity (rank/tier/score) is identical to v10.4.0; only the bark layer changed.');
    process.exit(0);
} else {
    console.log(`\n${failures} CHECK(S) FAILED.`);
    process.exit(1);
}

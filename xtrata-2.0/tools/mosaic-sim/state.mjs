// Collection state, resolved from folders on disk.
//
// The point of this harness is that the MOSAIC runs unmodified — byte-identical to what
// gets inscribed — and only the chain underneath it is fake. So the state model here has
// to match what the real contracts expose, not what would be convenient to render.
//
// Three states per item, driven by which folder it is in:
//
//   in neither folder   -> not minted yet
//   state/treasury/NNNN -> minted, held by the treasury wallet
//   state/released/NNNN -> minted, held by a collector
//
// Drag a file from treasury/ to released/ and the mosaic sees a sale.
//
// Two deliberate traps are built in, because a mosaic that gets these wrong looks
// perfect right up until launch:
//
//   1. TOKEN ID != COLLECTION INDEX. Ids start at TOKEN_ID_BASE, so anything that
//      conflates the two breaks immediately rather than at item 400.
//   2. MINT ORDER != COLLECTION ORDER. Items are minted in whatever order the wizard
//      got to them, so `get-minted-id(0)` is not collection item 0.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const TOKEN_ID_BASE = 3000;
export const TREASURY = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/** Collection index (0..N-1) -> token id. Deliberately not the identity function. */
export const tokenIdFor = (index) => TOKEN_ID_BASE + index;
export const indexForToken = (tokenId) => tokenId - TOKEN_ID_BASE;

const items = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((n) => /^\d+$/.test(n))
    .map((n) => ({ index: Number(n), file: join(dir, n) }));
};

/**
 * Read the whole collection state off disk.
 *
 * Returns everything the fake contract needs to answer, plus the anomalies worth
 * surfacing — a harness that silently tolerates a broken folder set cannot be used to
 * test broken states, which is most of its value.
 */
export function readState(root) {
  // Tag the holder from the folder we READ, not by sniffing the path — a root directory
  // that happens to contain "released" would otherwise misclassify everything in it.
  const found = [
    ...items(join(root, 'treasury')).map((i) => ({ ...i, holder: 'treasury' })),
    ...items(join(root, 'released')).map((i) => ({ ...i, holder: 'collector' }))
  ];

  const byIndex = new Map();
  const duplicates = [];
  for (const { index, file, holder } of found) {
    if (byIndex.has(index)) duplicates.push(index);   // same index in BOTH folders
    byIndex.set(index, { index, holder, content: readFileSync(file, 'utf8').trim() });
  }

  // Mint order: the order the wizard actually got to them, which is NOT collection
  // order. Explicit so a scenario can pin it; falls back to numeric with a note.
  const orderFile = join(root, 'mint-order.json');
  let mintOrder;
  let mintOrderExplicit = false;
  if (existsSync(orderFile)) {
    mintOrder = JSON.parse(readFileSync(orderFile, 'utf8')).filter((i) => byIndex.has(i));
    mintOrderExplicit = true;
  } else {
    mintOrder = [...byIndex.keys()].sort((a, b) => a - b);
  }
  // Anything minted but absent from an explicit order still has to appear somewhere.
  for (const i of byIndex.keys()) if (!mintOrder.includes(i)) mintOrder.push(i);

  const config = existsSync(join(root, 'config.json'))
    ? JSON.parse(readFileSync(join(root, 'config.json'), 'utf8'))
    : {};

  const maxSupply = config.maxSupply ?? 1024;
  const slug = config.slug ?? 'demo';

  // Anomalies. These are REPORTED, never corrected — the whole point is to be able to
  // point the mosaic at a state that should not exist and see what it does.
  const anomalies = [];
  if (duplicates.length) anomalies.push(`index in both folders: ${duplicates.join(', ')}`);
  for (const [index, it] of byIndex) {
    if (index >= maxSupply) anomalies.push(`index ${index} is beyond maxSupply ${maxSupply}`);
    const expected = `xtrata:seed/${slug}/${String(index).padStart(4, '0')}:`;
    if (!it.content.startsWith(expected)) {
      anomalies.push(`index ${index} content does not match xtrata:seed/${slug}/NNNN: — "${it.content.slice(0, 40)}"`);
    }
  }

  return {
    slug,
    maxSupply,
    defaultDependencies: config.defaultDependencies ?? [],
    finalized: !!config.finalized,
    holders: config.holders ?? {},          // collection index -> collector address
    items: byIndex,
    mintOrder,
    mintOrderExplicit,
    mintedCount: byIndex.size,
    anomalies
  };
}

/** Who owns this token right now, or null if it was never minted. */
export function ownerOf(state, tokenId) {
  const index = indexForToken(tokenId);
  const item = state.items.get(index);
  if (!item) return null;
  if (item.holder === 'treasury') return TREASURY;
  return state.holders[String(index)] ?? state.holders[index] ?? 'SP2W89C1HN0PWSPG3XBWXK05WD5K1TF2XJAJXD05P';
}

/** The content the runtime would serve at /i/<tokenId>. */
export function contentOf(state, tokenId) {
  const item = state.items.get(indexForToken(tokenId));
  return item ? item.content : null;
}

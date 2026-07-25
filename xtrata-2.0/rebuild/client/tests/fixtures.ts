import { CHUNK_SIZE } from '../src/hash.js';
import { ingestFiles, type IngestFile, type IngestOptions } from '../src/ingest.js';
import { MANIFEST_SCHEMA_VERSION, sealManifest, type Manifest } from '../src/manifest.js';

export const baseOptions: IngestOptions = {
  collection: { name: 'Test Collection', symbol: 'TEST' },
  network: 'simnet',
  contracts: { core: 'SP000000000000000000002Q6VF78.xtrata-v3-2-3' },
  now: () => new Date('2026-07-24T00:00:00.000Z')
};

/** Deterministic pseudo-random bytes, unique per seed. */
export const bytesOf = (seed: number, length: number): Uint8Array => {
  const out = new Uint8Array(length);
  let state = (seed * 2654435761) >>> 0 || 1;
  for (let i = 0; i < length; i += 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    out[i] = state & 0xff;
  }
  // Bake the seed into the first bytes so tiny files stay unique too.
  out[0] = seed & 0xff;
  if (length > 1) out[1] = (seed >> 8) & 0xff;
  return out;
};

export const fileOfChunks = (seed: number, chunks: number, name = `file-${seed}.bin`): IngestFile => ({
  name,
  bytes: bytesOf(seed, chunks * CHUNK_SIZE - (chunks > 0 ? 7 : 0)),
  mimeType: 'application/octet-stream'
});

/**
 * Synthetic manifest for planner-scale tests (500/1000 items): items are
 * constructed directly with fake-but-valid hashes so no real hashing of
 * megabytes is needed. Structure is still schema-valid and checksummed.
 */
export const syntheticManifest = (
  specs: ReadonlyArray<{ chunks: number; dependencies?: number[]; parents?: number[] }>
): Manifest => {
  const fakeHex = (tag: string, i: number): string => {
    const head = `${i.toString(16)}${tag}`.replace(/[^0-9a-f]/g, 'a');
    return (head + '0'.repeat(64)).slice(0, 64);
  };
  return sealManifest({
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    collection: { name: 'Synthetic' },
    network: 'simnet',
    contracts: { core: 'SP000000000000000000002Q6VF78.xtrata-v3-2-3' },
    items: specs.map((spec, index) => ({
      index,
      fileName: `item-${index}.bin`,
      byteLength: spec.chunks * CHUNK_SIZE,
      mimeType: 'application/octet-stream',
      contentHashHex: fakeHex('c', index),
      sha256Hex: fakeHex('d', index),
      ...(spec.dependencies !== undefined ? { dependencies: spec.dependencies } : {}),
      ...(spec.parents !== undefined ? { parents: spec.parents } : {}),
      chunkCount: spec.chunks,
      mode: spec.chunks <= 32 ? ('single-tx' as const) : ('staged' as const)
    })),
    createdAt: '2026-07-24T00:00:00.000Z',
    updatedAt: '2026-07-24T00:00:00.000Z'
  });
};

/** Build a manifest of `count` items, each with chunksFor(i) chunks. */
export const manifestOf = (
  count: number,
  chunksFor: (i: number) => number = () => 1,
  options: Partial<IngestOptions> = {}
): Manifest => {
  const files = Array.from({ length: count }, (_, i) => fileOfChunks(i + 1, chunksFor(i)));
  return ingestFiles(files, { ...baseOptions, ...options }).manifest;
};

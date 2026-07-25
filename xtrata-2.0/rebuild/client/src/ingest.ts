import {
  MAX_SINGLE_TX_CHUNKS,
  bytesToHex,
  chainHashOfBytes,
  chunkCount,
  plainSha256
} from './hash.js';
import {
  MANIFEST_SCHEMA_VERSION,
  sealManifest,
  type Manifest,
  type ManifestItem
} from './manifest.js';
import { XtrataClientError } from './errors.js';

/** Input file for ingestion. Order of the array is the collection order. */
export interface IngestFile {
  name: string;
  bytes: Uint8Array;
  mimeType: string;
  itemUri?: string;
  dependencies?: number[];
  parents?: number[];
  metadata?: Record<string, unknown>;
}

export type DuplicatePolicy = 'reject' | 'dedupe' | 'allow';

export interface DuplicateReport {
  /** sha256Hex → indexes (positions in the input array) sharing that content. */
  groups: Array<{ sha256Hex: string; positions: number[]; fileNames: string[] }>;
}

export interface IngestOptions {
  collection: Manifest['collection'];
  network: Manifest['network'];
  contracts: Manifest['contracts'];
  /** Default 'reject': identical content in one collection is almost always a mistake. */
  duplicatePolicy?: DuplicatePolicy;
  now?: () => Date;
}

export interface IngestResult {
  manifest: Manifest;
  duplicates: DuplicateReport;
  /** Input positions dropped by the 'dedupe' policy (empty otherwise). */
  droppedPositions: number[];
}

const naturalCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/**
 * Helper for callers who want filename natural-sort ordering ("img2" before
 * "img10") instead of supplying an explicit order. Stable; does not mutate.
 */
export const naturalSortByName = <T extends { name: string }>(files: readonly T[]): T[] =>
  [...files].sort((a, b) => naturalCollator.compare(a.name, b.name) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

const validateFile = (file: IngestFile, position: number): void => {
  if (file.name.length === 0) {
    throw new XtrataClientError('manifest-invalid', `file at position ${position} has an empty name`);
  }
  if (file.bytes.length === 0) {
    throw new XtrataClientError('manifest-invalid', `file "${file.name}" is empty`);
  }
  if (file.mimeType.length === 0 || file.mimeType.length > 64 || !file.mimeType.includes('/')) {
    throw new XtrataClientError('manifest-invalid', `file "${file.name}" has invalid MIME type "${file.mimeType}"`);
  }
  if ((file.dependencies?.length ?? 0) > 50 || (file.parents?.length ?? 0) > 50) {
    throw new XtrataClientError(
      'manifest-invalid',
      `file "${file.name}" declares more than 50 dependencies/parents`
    );
  }
  for (const id of [...(file.dependencies ?? []), ...(file.parents ?? [])]) {
    if (!Number.isInteger(id) || id < 0) {
      throw new XtrataClientError('manifest-invalid', `file "${file.name}" has invalid relationship id ${id}`);
    }
  }
  if (file.metadata !== undefined) {
    try {
      JSON.stringify(file.metadata);
    } catch {
      throw new XtrataClientError('manifest-invalid', `file "${file.name}" metadata is not JSON-serializable`);
    }
  }
};

/**
 * Build a checksummed manifest from an ordered list of files. Ordering is the
 * caller's explicit array order (use `naturalSortByName` first if desired).
 * Duplicate detection uses the plain sha256 of the raw bytes so it is
 * independent of chunking; the collection contract additionally enforces
 * chain-hash uniqueness on-chain (HashIndex).
 */
export const ingestFiles = (files: readonly IngestFile[], options: IngestOptions): IngestResult => {
  const policy: DuplicatePolicy = options.duplicatePolicy ?? 'reject';
  const now = (options.now ?? (() => new Date()))().toISOString();

  files.forEach(validateFile);

  // Duplicate detection by plain file hash.
  const bySha = new Map<string, number[]>();
  const shaByPosition: string[] = [];
  files.forEach((file, position) => {
    const sha = bytesToHex(plainSha256(file.bytes));
    shaByPosition.push(sha);
    const positions = bySha.get(sha);
    if (positions) positions.push(position);
    else bySha.set(sha, [position]);
  });

  const groups = [...bySha.entries()]
    .filter(([, positions]) => positions.length > 1)
    .map(([sha256Hex, positions]) => ({
      sha256Hex,
      positions,
      fileNames: positions.map((p) => files[p]!.name)
    }));
  const duplicates: DuplicateReport = { groups };

  if (policy === 'reject' && groups.length > 0) {
    throw new XtrataClientError(
      'duplicate-content',
      `duplicate file content detected: ${groups
        .map((g) => g.fileNames.join(' = '))
        .join('; ')}`,
      { detail: { duplicates } }
    );
  }

  const droppedPositions: number[] = [];
  const keptPositions: number[] = [];
  const firstOfSha = new Set<string>();
  files.forEach((_, position) => {
    const sha = shaByPosition[position]!;
    if (policy === 'dedupe' && firstOfSha.has(sha)) {
      droppedPositions.push(position);
      return;
    }
    firstOfSha.add(sha);
    keptPositions.push(position);
  });

  const items: ManifestItem[] = keptPositions.map((position, index) => {
    const file = files[position]!;
    const chunks = chunkCount(file.bytes.length);
    return {
      index,
      fileName: file.name,
      byteLength: file.bytes.length,
      mimeType: file.mimeType,
      contentHashHex: bytesToHex(chainHashOfBytes(file.bytes)),
      sha256Hex: shaByPosition[position]!,
      ...(file.itemUri !== undefined ? { itemUri: file.itemUri } : {}),
      ...(file.dependencies !== undefined ? { dependencies: file.dependencies } : {}),
      ...(file.parents !== undefined ? { parents: file.parents } : {}),
      ...(file.metadata !== undefined ? { metadata: file.metadata } : {}),
      chunkCount: chunks,
      mode: chunks <= MAX_SINGLE_TX_CHUNKS ? ('single-tx' as const) : ('staged' as const)
    };
  });

  const manifest = sealManifest({
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    collection: options.collection,
    network: options.network,
    contracts: options.contracts,
    items,
    createdAt: now,
    updatedAt: now
  });

  return { manifest, duplicates, droppedPositions };
};

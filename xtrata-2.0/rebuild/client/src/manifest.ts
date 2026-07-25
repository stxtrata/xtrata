import { z } from 'zod';
import { bytesToHex, plainSha256 } from './hash.js';
import { XtrataClientError } from './errors.js';

/**
 * Versioned, checksummed collection manifest. A client-side cache/plan only —
 * the chain is the source of truth; the manifest lets a resume (possibly on a
 * new device) rebuild the same deterministic plan.
 */

export const MANIFEST_SCHEMA_VERSION = 1;

const hex64 = z
  .string()
  .regex(/^[0-9a-f]{64}$/, 'must be 64 lowercase hex characters');

const principal = z.string().min(1).max(200);

export const manifestItemSchema = z
  .object({
    /** 0-based deterministic position in the collection. */
    index: z.number().int().nonnegative(),
    fileName: z.string().min(1),
    byteLength: z.number().int().nonnegative(),
    mimeType: z.string().min(1).max(64),
    /** Chain hash (H_n) — what the core seals against; the item's identity. */
    contentHashHex: hex64,
    /** Plain sha256 of the file bytes — dedupe key, independent of chunking. */
    sha256Hex: hex64,
    itemUri: z.string().max(256).optional(),
    /** Core token ids this item depends on (seal-with-relationships). */
    dependencies: z.array(z.number().int().nonnegative()).max(50).optional(),
    parents: z.array(z.number().int().nonnegative()).max(50).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    /** Derived: chunk count at the protocol chunk size. */
    chunkCount: z.number().int().nonnegative(),
    /** single-tx if chunkCount ≤ 32, else staged. */
    mode: z.enum(['single-tx', 'staged'])
  })
  .strict();

export const batchPlanSummarySchema = z
  .object({
    totalTxs: z.number().int().nonnegative(),
    estimatedTotalFeeMicroStx: z.string().regex(/^\d+$/),
    generatedAt: z.string()
  })
  .strict();

export const manifestSchema = z
  .object({
    schemaVersion: z.literal(MANIFEST_SCHEMA_VERSION),
    collection: z
      .object({
        name: z.string().min(1).max(64),
        symbol: z.string().min(1).max(16).optional(),
        description: z.string().max(1024).optional(),
        artworkUri: z.string().max(256).optional(),
        baseUri: z.string().max(256).optional()
      })
      .strict(),
    network: z.enum(['mainnet', 'testnet', 'devnet', 'simnet']),
    contracts: z
      .object({
        core: principal,
        collection: principal.optional(),
        drops: principal.optional()
      })
      .strict(),
    items: z.array(manifestItemSchema),
    batchPlan: batchPlanSummarySchema.optional(),
    /** Checksum of the manifest this one replaces (versioning chain). */
    supersedes: hex64.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    /** sha256 of the canonical JSON of everything except this field. */
    checksum: hex64
  })
  .strict()
  .superRefine((manifest, ctx) => {
    const seen = new Set<number>();
    for (const item of manifest.items) {
      if (seen.has(item.index)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate item index ${item.index}`
        });
      }
      seen.add(item.index);
    }
    manifest.items.forEach((item, position) => {
      if (item.index !== position) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `items must be ordered densely by index; position ${position} has index ${item.index}`
        });
      }
    });
  });

export type ManifestItem = z.infer<typeof manifestItemSchema>;
export type Manifest = z.infer<typeof manifestSchema>;
export type ManifestWithoutChecksum = Omit<Manifest, 'checksum'>;

/**
 * Deterministic canonical JSON: object keys sorted lexicographically at every
 * level, arrays kept in order, no whitespace. Undefined-valued keys omitted
 * (matching JSON.stringify semantics).
 */
export const canonicalJson = (value: unknown): string => {
  if (value === null || typeof value === 'number' || typeof value === 'boolean') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new XtrataClientError('manifest-invalid', 'non-finite number in manifest');
    }
    return JSON.stringify(value);
  }
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry === undefined ? null : entry)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`);
    return `{${entries.join(',')}}`;
  }
  throw new XtrataClientError('manifest-invalid', `unsupported value type in manifest: ${typeof value}`);
};

const textEncoder = new TextEncoder();

export const computeManifestChecksum = (manifest: ManifestWithoutChecksum): string => {
  const { ...rest } = manifest;
  delete (rest as Partial<Manifest>).checksum;
  return bytesToHex(plainSha256(textEncoder.encode(canonicalJson(rest))));
};

/** Attach (or refresh) the checksum. */
export const sealManifest = (manifest: ManifestWithoutChecksum): Manifest => {
  const checksum = computeManifestChecksum(manifest);
  return { ...manifest, checksum } as Manifest;
};

/** Serialize with checksum, deterministic byte-for-byte. */
export const exportManifest = (manifest: Manifest): string => {
  const parsed = manifestSchema.safeParse(manifest);
  if (!parsed.success) {
    throw new XtrataClientError('manifest-invalid', parsed.error.message);
  }
  const expected = computeManifestChecksum(manifest);
  if (expected !== manifest.checksum) {
    throw new XtrataClientError('checksum-mismatch', 'manifest checksum does not match its contents');
  }
  return canonicalJson(manifest);
};

/** Parse + validate + verify checksum. A tampered manifest fails here. */
export const importManifest = (json: string): Manifest => {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (cause) {
    throw new XtrataClientError('manifest-invalid', 'manifest is not valid JSON', { cause });
  }
  const parsed = manifestSchema.safeParse(raw);
  if (!parsed.success) {
    throw new XtrataClientError('manifest-invalid', parsed.error.message);
  }
  const manifest = parsed.data;
  const expected = computeManifestChecksum(manifest);
  if (expected !== manifest.checksum) {
    throw new XtrataClientError(
      'checksum-mismatch',
      `manifest checksum mismatch: stored ${manifest.checksum}, computed ${expected}`
    );
  }
  return manifest;
};

/** New manifest version superseding `previous` (records its checksum). */
export const superseding = (
  previous: Manifest,
  next: Omit<ManifestWithoutChecksum, 'supersedes' | 'createdAt'>
): Manifest =>
  sealManifest({
    ...next,
    supersedes: previous.checksum,
    createdAt: previous.createdAt
  });

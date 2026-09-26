/**
 * Collection v1.5/v1.6 helpers only mint files whose hash has been registered on
 * the contract (`set-registered-token-uri`). An unregistered hash fails every
 * mint with ERR-UNREGISTERED-HASH (u123), so registration is a launch gate.
 *
 * The contract has no "registered count" read, so a full check costs one read
 * per file. After a complete pass finds nothing missing, the studio records the
 * verified hash set in collection metadata. The record only counts while the
 * staged files are unchanged: uploading or removing a file changes the digest
 * and the collection needs checking again.
 */
export type InventoryRegistrationRecord = {
  version: 1;
  contractId: string;
  hashCount: number;
  digest: string;
  verifiedAt: string;
};

export const INVENTORY_REGISTRATION_METADATA_KEY = 'inventoryRegistration';

export const normalizeInventoryHash = (value: unknown) => {
  const normalized = String(value ?? '').trim().toLowerCase().replace(/^0x/, '');
  return /^[0-9a-f]{64}$/.test(normalized) ? normalized : null;
};

const isActiveInventoryState = (state: unknown) => {
  const normalized = String(state ?? '').trim().toLowerCase();
  return normalized !== 'expired' && normalized !== 'sold-out';
};

/**
 * Unique, sorted hashes of the files a collector could still mint. Returns null
 * when any active file lacks a valid hash: that inventory cannot be verified.
 */
export const collectInventoryHashes = (
  assets: Array<{ expected_hash?: unknown; state?: unknown }>
): string[] | null => {
  const hashes = new Set<string>();
  for (const asset of assets) {
    if (!isActiveInventoryState(asset.state)) continue;
    const hash = normalizeInventoryHash(asset.expected_hash);
    if (!hash) return null;
    hashes.add(hash);
  }
  return [...hashes].sort();
};

export const computeInventoryDigest = async (sortedHashes: string[]) => {
  const bytes = new TextEncoder().encode(sortedHashes.join('\n'));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const parseInventoryRegistrationRecord = (
  metadata: Record<string, unknown> | null | undefined
): InventoryRegistrationRecord | null => {
  const raw = metadata?.[INVENTORY_REGISTRATION_METADATA_KEY];
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const hashCount = Number(record.hashCount);
  if (
    typeof record.contractId !== 'string' ||
    typeof record.digest !== 'string' ||
    typeof record.verifiedAt !== 'string' ||
    !Number.isSafeInteger(hashCount) ||
    hashCount < 0
  ) {
    return null;
  }
  return {
    version: 1,
    contractId: record.contractId,
    hashCount,
    digest: record.digest,
    verifiedAt: record.verifiedAt
  };
};

/** True only when the record matches this contract and today's exact file set. */
export const isInventoryRegistrationCurrent = (params: {
  record: InventoryRegistrationRecord | null;
  contractId: string | null;
  hashCount: number;
  digest: string | null;
}) =>
  params.record !== null &&
  params.contractId !== null &&
  params.digest !== null &&
  params.hashCount > 0 &&
  params.record.contractId === params.contractId &&
  params.record.hashCount === params.hashCount &&
  params.record.digest === params.digest;

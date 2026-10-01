/**
 * Replacing unminted files in a published (upload-locked) collection.
 *
 * A replacement swaps the bytes behind existing inventory entries: the asset
 * rows keep their id, path and place in the collection (no editions are
 * added), only the content (hash, storage key, size) changes. On the helper
 * contract the new hashes are registered and the old registrations cleared, so
 * the old bytes can never be minted. The original bytes stay in storage and are
 * recorded here so they can be recovered.
 *
 * Shared by the studio (browser) and the Pages Functions (server). Pure: no
 * network, no storage. A failed chain read is never passed in as "false" — the
 * caller reports "could not check" instead.
 */

export const INVENTORY_REPLACEMENT_METADATA_KEY = 'inventoryReplacement';
export const INVENTORY_REPLACEMENT_HISTORY_KEY = 'inventoryReplacementHistory';
/** Kept small: one wallet approval registers every new hash. */
export const MAX_REPLACEMENT_FILES = 20;

export type ReplacementFile = {
  hash: string;
  storageKey: string;
  bytes: number;
  chunks: number;
  mimeType: string;
};

export type ReplacementItem = {
  assetId: string;
  path: string;
  /** The file being replaced, preserved for recovery. */
  original: ReplacementFile & { tokenUri: string };
  /** Null until the artist uploads the new file. */
  replacement: ReplacementFile | null;
};

export type InventoryReplacementRecord = {
  version: 1;
  id: string;
  status: 'open' | 'complete' | 'cancelled';
  contractId: string;
  startedAt: number;
  startedBy: string | null;
  updatedAt: number;
  completedAt: number | null;
  items: ReplacementItem[];
  /** Submitted transaction ids, for resuming. The chain, not this list, decides progress. */
  txs: { register: string[]; clear: string[] };
};

export type ReplacementChainItem = {
  assetId: string;
  originalRegistered: boolean;
  originalMinted: boolean;
  originalReserved: boolean;
  /** Null until a replacement is uploaded. */
  replacementRegistered: boolean | null;
  replacementOnCore: boolean | null;
};

export type ReplacementChainState = {
  paused: boolean;
  finalized: boolean;
  items: ReplacementChainItem[];
};

export type ReplacementStep = 'upload' | 'register' | 'clear' | 'finish' | 'done' | 'blocked';

export type ReplacementPlan = {
  step: ReplacementStep;
  blockers: string[];
  /** Hashes still to register (new files). */
  toRegister: string[];
  /** Hashes still registered that must be cleared (old files). */
  toClear: string[];
};

export const normalizeContentHash = (value: unknown) => {
  const hash = String(value ?? '').trim().toLowerCase().replace(/^0x/, '');
  return /^[0-9a-f]{64}$/.test(hash) ? hash : null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const parseFile = (value: unknown): ReplacementFile | null => {
  if (!isObject(value)) return null;
  const hash = normalizeContentHash(value.hash);
  const bytes = Number(value.bytes);
  const chunks = Number(value.chunks);
  if (!hash || typeof value.storageKey !== 'string' || !value.storageKey || typeof value.mimeType !== 'string' ||
      !Number.isSafeInteger(bytes) || bytes < 1 || !Number.isSafeInteger(chunks) || chunks < 1) return null;
  return { hash, storageKey: value.storageKey, bytes, chunks, mimeType: value.mimeType };
};

/** Null when there is no record or it is malformed (treated as "none", never as complete). */
export function parseReplacementRecord(metadata: Record<string, unknown> | null | undefined): InventoryReplacementRecord | null {
  const raw = metadata?.[INVENTORY_REPLACEMENT_METADATA_KEY];
  if (!isObject(raw) || raw.version !== 1 || typeof raw.id !== 'string' || typeof raw.contractId !== 'string') return null;
  if (raw.status !== 'open' && raw.status !== 'complete' && raw.status !== 'cancelled') return null;
  if (!Array.isArray(raw.items) || raw.items.length === 0) return null;
  const items: ReplacementItem[] = [];
  for (const entry of raw.items) {
    if (!isObject(entry) || typeof entry.assetId !== 'string' || typeof entry.path !== 'string') return null;
    const original = parseFile(entry.original);
    const tokenUri = isObject(entry.original) ? entry.original.tokenUri : null;
    if (!original || typeof tokenUri !== 'string') return null;
    const replacement = entry.replacement === null || entry.replacement === undefined ? null : parseFile(entry.replacement);
    if (entry.replacement && !replacement) return null;
    items.push({ assetId: entry.assetId, path: entry.path, original: { ...original, tokenUri }, replacement });
  }
  const txs = isObject(raw.txs) ? raw.txs : {};
  const txList = (value: unknown) => (Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string') : []);
  return {
    version: 1,
    id: raw.id,
    status: raw.status,
    contractId: raw.contractId,
    startedAt: Number(raw.startedAt) || 0,
    startedBy: typeof raw.startedBy === 'string' ? raw.startedBy : null,
    updatedAt: Number(raw.updatedAt) || 0,
    completedAt: Number.isFinite(Number(raw.completedAt)) && raw.completedAt !== null ? Number(raw.completedAt) : null,
    items,
    txs: { register: txList(txs.register), clear: txList(txs.clear) }
  };
}

export const isReplacementOpen = (record: InventoryReplacementRecord | null) => record?.status === 'open';

/** Why these files cannot be replaced right now (empty = they can). */
export function replacementStartBlockers(params: {
  paused: boolean;
  finalized: boolean;
  items: Array<{ path: string; assetState: string; minted: boolean; reserved: boolean }>;
}): string[] {
  const blockers: string[] = [];
  if (params.finalized) blockers.push('The collection is finalized, so its files can no longer change.');
  if (!params.paused) blockers.push('Pause minting first: files can only be replaced while the collection is paused.');
  for (const item of params.items) {
    const state = item.assetState.trim().toLowerCase();
    if (item.minted || state === 'sold-out') blockers.push(`${item.path} has already been minted.`);
    else if (item.reserved) blockers.push(`${item.path} is reserved by a collector mid-mint. Wait for it to finish or be released.`);
    else if (state === 'expired') blockers.push(`${item.path} is not an active file.`);
  }
  return blockers;
}

/** Problems with an uploaded replacement file (empty = acceptable). */
export function replacementUploadProblems(params: {
  path: string;
  newHash: string;
  originalHash: string;
  /** Hashes of every other active file in the collection, and of other replacements in this record. */
  otherHashes: string[];
  /** Null = could not check (reported by the caller), never passed as false. */
  inscribedOnCore: boolean;
}): string[] {
  const problems: string[] = [];
  if (params.newHash === params.originalHash) problems.push(`The new ${params.path} is identical to the current file.`);
  if (params.otherHashes.includes(params.newHash)) problems.push(`The new ${params.path} is identical to another file in this collection.`);
  if (params.inscribedOnCore) problems.push(`The new ${params.path} has already been inscribed on Xtrata, so it could never be minted here.`);
  return problems;
}

/** What the artist does next, from the record and a fresh chain read. */
export function planReplacement(record: InventoryReplacementRecord, chain: ReplacementChainState): ReplacementPlan {
  if (record.status !== 'open') return { step: 'done', blockers: [], toRegister: [], toClear: [] };
  const byId = new Map(chain.items.map((item) => [item.assetId, item]));
  const blockers: string[] = [];
  if (chain.finalized) blockers.push('The collection is finalized, so its files can no longer change.');
  if (!chain.paused) blockers.push('Minting is open. Pause the collection before continuing the replacement.');
  const toRegister: string[] = [];
  const toClear: string[] = [];
  let awaitingUpload = false;
  for (const item of record.items) {
    const state = byId.get(item.assetId);
    if (!state) {
      blockers.push(`Could not read the on-chain state of ${item.path}.`);
      continue;
    }
    if (state.originalMinted) blockers.push(`${item.path} was minted before the replacement finished.`);
    if (state.originalReserved) blockers.push(`${item.path} is reserved by a collector.`);
    if (!item.replacement) {
      awaitingUpload = true;
      continue;
    }
    if (state.replacementOnCore) blockers.push(`The new ${item.path} is already inscribed on Xtrata. Upload a different file.`);
    if (state.replacementRegistered === false) toRegister.push(item.replacement.hash);
    if (state.originalRegistered) toClear.push(item.original.hash);
  }
  if (blockers.length > 0) return { step: 'blocked', blockers, toRegister, toClear };
  if (awaitingUpload) return { step: 'upload', blockers, toRegister, toClear };
  if (toRegister.length > 0) return { step: 'register', blockers, toRegister, toClear };
  if (toClear.length > 0) return { step: 'clear', blockers, toRegister, toClear };
  return { step: 'finish', blockers, toRegister, toClear };
}

/**
 * Asset preview URL. `version` (the content hash) makes a replaced file a new
 * URL, so no browser or CDN cache can serve the old bytes for it.
 */
export function buildCollectionAssetPreviewUrl(
  collectionId: string,
  assetId: string,
  options: { version?: string | null; purpose?: string } = {}
) {
  const query = new URLSearchParams({ assetId });
  if (options.purpose) query.set('purpose', options.purpose);
  const version = normalizeContentHash(options.version);
  if (version) query.set('v', version.slice(0, 16));
  return `/collections/${encodeURIComponent(collectionId)}/asset-preview?${query.toString()}`;
}

/** "084.html", "84.html" and "folder/084.HTML" all name the same edition file. */
export const normalizeEditionFileName = (value: string) =>
  (value.split(/[\\/]/).pop() ?? '').trim().toLowerCase().replace(/^0+(?=\d)/, '');

/**
 * Match revised files picked by the artist to the collection's active files by
 * name. Every file must match exactly one active file, and no file twice.
 */
export function matchReplacementFiles(
  fileNames: string[],
  assets: Array<{ asset_id: string; path?: string | null; state?: string | null }>
): { matches: Array<{ fileIndex: number; assetId: string; path: string }>; errors: string[] } {
  const active = assets.filter((asset) => !['expired', 'sold-out'].includes(String(asset.state ?? '').toLowerCase()));
  const errors: string[] = [];
  const matches: Array<{ fileIndex: number; assetId: string; path: string }> = [];
  fileNames.forEach((name, fileIndex) => {
    const key = normalizeEditionFileName(name);
    const found = active.filter((asset) => normalizeEditionFileName(String(asset.path ?? '')) === key);
    if (found.length === 0) errors.push(`${name} does not match any unminted file in this collection.`);
    else if (found.length > 1) errors.push(`${name} matches more than one file in this collection.`);
    else if (matches.some((match) => match.assetId === found[0].asset_id)) errors.push(`${name} was chosen twice.`);
    else matches.push({ fileIndex, assetId: found[0].asset_id, path: String(found[0].path ?? found[0].asset_id) });
  });
  if (fileNames.length > MAX_REPLACEMENT_FILES) errors.push(`Replace at most ${MAX_REPLACEMENT_FILES} files at a time.`);
  return { matches, errors };
}

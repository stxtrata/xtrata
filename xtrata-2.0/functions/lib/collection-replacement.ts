import { bufferCV, ClarityType, cvToString, type ClarityValue } from '@stacks/transactions';
import { DEFAULT_TOKEN_URI } from '../../src/lib/mint/constants';
import { parseGetIdByHash } from '../../src/lib/protocol/parsers';
import {
  INVENTORY_REPLACEMENT_HISTORY_KEY,
  INVENTORY_REPLACEMENT_METADATA_KEY,
  MAX_REPLACEMENT_FILES,
  normalizeContentHash,
  parseReplacementRecord,
  planReplacement,
  replacementStartBlockers,
  replacementUploadProblems,
  type InventoryReplacementRecord,
  type ReplacementChainState,
  type ReplacementFile,
  type ReplacementPlan
} from '../../src/lib/collections/inventory-replacement';
import { DEFAULT_CORE, makeChainReader } from './collection-storage/chain';
import { CHUNK_SIZE, db, hashBytes, staging, storageEnabled } from './collection-storage/common';
import { createUploadIntent, putVerifiedUpload } from './collection-storage/uploads';
import { isCollectionUploadsLocked, parseCollectionMetadata } from './collections';
import { queryAll, run, type Env } from './db';
import {
  collectInventoryHashes,
  computeInventoryDigest,
  INVENTORY_REGISTRATION_METADATA_KEY,
  isInventoryRegistrationCurrent,
  parseInventoryRegistrationRecord
} from '../../src/manage/lib/inventory-registration';

/**
 * Explicit replacement of unminted files in a published (upload-locked)
 * collection. See src/lib/collections/inventory-replacement.ts for the model.
 * Every step re-reads the chain; a failed read stops with "could not check".
 */
export class ReplacementError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

/** The reads a replacement needs, from the collection's helper and its pinned core. */
export type ReplacementChain = {
  paused(): Promise<boolean>;
  finalized(): Promise<boolean>;
  registeredUri(hash: string): Promise<string | null>;
  reserved(hash: string): Promise<boolean>;
  onCore(hash: string): Promise<boolean>;
};

type CollectionRow = Record<string, unknown>;
type AssetRow = {
  asset_id: string;
  path: string | null;
  mime_type: string | null;
  total_bytes: number;
  total_chunks: number;
  expected_hash: string | null;
  storage_key: string | null;
  state: string | null;
};

const CONTRACT_PATTERN = /^(S[PTMN][0-9A-Z]{20,40})\.([a-zA-Z][a-zA-Z0-9_-]{0,127})$/;
const ADDRESS_PATTERN = /^S[PTMN][0-9A-Z]{20,40}$/;

/** Helper + core of a deployed collection; the core must be one Xtrata allows. */
export function resolveReplacementTarget(env: Env, collection: CollectionRow) {
  const metadata = parseCollectionMetadata(collection.metadata) ?? {};
  const address = String(collection.contract_address ?? '').trim();
  const contractName = String(metadata.contractName ?? '').trim();
  const helper = CONTRACT_PATTERN.test(address) ? address
    : ADDRESS_PATTERN.test(address) && contractName ? `${address}.${contractName}` : '';
  const core = String(metadata.coreContractId ?? '').trim();
  const allowed = String(env.COLLECTION_CLEANUP_CORES ?? DEFAULT_CORE).split(',').map((x) => x.trim());
  if (!CONTRACT_PATTERN.test(helper)) throw new ReplacementError(409, 'This collection has no deployed contract yet.');
  if (!allowed.includes(core) || !CONTRACT_PATTERN.test(core)) throw new ReplacementError(409, 'This collection does not use a supported Xtrata core.');
  const network: 'mainnet' | 'testnet' = core.startsWith('ST') || core.startsWith('SN') ? 'testnet' : 'mainnet';
  return { helper, core, network };
}

const hashArg = (hash: string) => bufferCV(Uint8Array.from(hash.match(/../g)!.map((x) => parseInt(x, 16))));
const unwrapOk = (value: ClarityValue) => (value.type === ClarityType.ResponseOk ? value.value : value);
const boolOf = (value: ClarityValue, name: string) => {
  const inner = unwrapOk(value);
  if (inner.type === ClarityType.BoolTrue) return true;
  if (inner.type === ClarityType.BoolFalse) return false;
  throw new Error(`Unexpected ${name} result.`);
};

export function makeReplacementChain(env: Env, target: ReturnType<typeof resolveReplacementTarget>, fetcher: typeof fetch = fetch): ReplacementChain {
  const reader = makeChainReader(env, { core: target.core, helper: target.helper, network: target.network }, fetcher);
  const helper = (name: string, args: ClarityValue[] = []) => reader.read(target.helper, name, args, 'latest');
  return {
    paused: async () => boolOf(await helper('is-paused'), 'is-paused'),
    finalized: async () => boolOf(await helper('get-finalized'), 'get-finalized'),
    async registeredUri(hash) {
      const value = await helper('get-registered-token-uri', [hashArg(hash)]);
      if (value.type === ClarityType.OptionalNone) return null;
      if (value.type !== ClarityType.OptionalSome || value.value.type !== ClarityType.Tuple) throw new Error('Unexpected registration result.');
      const uri = value.value.data['token-uri'];
      if (!uri || uri.type !== ClarityType.StringASCII) throw new Error('Unexpected registration result.');
      return uri.data;
    },
    async reserved(hash) {
      const value = await helper('get-hash-reservation', [hashArg(hash)]);
      if (value.type === ClarityType.OptionalNone) return false;
      if (value.type === ClarityType.OptionalSome) return true;
      throw new Error(`Unexpected reservation result: ${cvToString(value)}.`);
    },
    onCore: async (hash) => parseGetIdByHash(await reader.read(target.core, 'get-id-by-hash', [hashArg(hash)], 'latest')) !== null
  };
}

/** A read that failed is "could not check" — never treated as an answer. */
const checked = async <T>(read: () => Promise<T>): Promise<T> => {
  try {
    return await read();
  } catch {
    throw new ReplacementError(503, 'Could not read the contract right now, so nothing was changed. Try again in a moment.');
  }
};

async function loadCollection(env: Env, collectionId: string) {
  const collection = ((await queryAll(env, 'SELECT * FROM collections WHERE id = ? LIMIT 1', [collectionId])).results ?? [])[0] as CollectionRow | undefined;
  if (!collection) throw new ReplacementError(404, 'Collection not found.');
  const metadata = parseCollectionMetadata(collection.metadata) ?? {};
  return { collection, metadata, record: parseReplacementRecord(metadata) };
}

const loadAssets = async (env: Env, collectionId: string) =>
  ((await queryAll(env, 'SELECT * FROM assets WHERE collection_id = ?', [collectionId])).results ?? []) as AssetRow[];

const isActive = (asset: AssetRow) => !['expired', 'sold-out'].includes(String(asset.state ?? '').trim().toLowerCase());

async function saveRecord(env: Env, collectionId: string, record: InventoryReplacementRecord, now: number, extra: Record<string, unknown> = {}) {
  // Re-read so a concurrent metadata edit (description, cover…) is kept.
  const { metadata } = await loadCollection(env, collectionId);
  const next: Record<string, unknown> = { ...metadata, ...extra, [INVENTORY_REPLACEMENT_METADATA_KEY]: { ...record, updatedAt: now } };
  await run(env, 'UPDATE collections SET metadata = ?, updated_at = ? WHERE id = ?', [JSON.stringify(next), now, collectionId]);
  return { ...record, updatedAt: now };
}

async function readChainState(chain: ReplacementChain, record: InventoryReplacementRecord): Promise<ReplacementChainState> {
  return checked(async () => {
    const [paused, finalized] = await Promise.all([chain.paused(), chain.finalized()]);
    const items = [];
    for (const item of record.items) {
      const original = item.original.hash;
      const replacement = item.replacement?.hash ?? null;
      items.push({
        assetId: item.assetId,
        originalRegistered: (await chain.registeredUri(original)) !== null,
        originalMinted: await chain.onCore(original),
        originalReserved: await chain.reserved(original),
        replacementRegistered: replacement ? (await chain.registeredUri(replacement)) !== null : null,
        replacementOnCore: replacement ? await chain.onCore(replacement) : null
      });
    }
    return { paused, finalized, items };
  });
}

export type ReplacementStatus = {
  record: InventoryReplacementRecord | null;
  chain: ReplacementChainState | null;
  plan: ReplacementPlan | null;
  activeFileCount: number;
  /** Finish only: whether the registration check carried over (else the artist re-checks). */
  registrationCarried?: boolean;
};

export async function getReplacementStatus(env: Env, collectionId: string, chain: ReplacementChain): Promise<ReplacementStatus> {
  const { record } = await loadCollection(env, collectionId);
  const activeFileCount = (await loadAssets(env, collectionId)).filter(isActive).length;
  if (!record || record.status !== 'open') return { record, chain: null, plan: null, activeFileCount };
  const state = await readChainState(chain, record);
  return { record, chain: state, plan: planReplacement(record, state), activeFileCount };
}

export async function startReplacement(params: {
  env: Env; collectionId: string; chain: ReplacementChain; assetIds: string[]; actor: string | null; now?: number;
}) {
  const now = params.now ?? Date.now();
  const assetIds = [...new Set(params.assetIds.map((id) => String(id).trim()).filter(Boolean))].sort();
  if (assetIds.length === 0) throw new ReplacementError(400, 'Choose at least one file to replace.');
  if (assetIds.length > MAX_REPLACEMENT_FILES) throw new ReplacementError(400, `Replace at most ${MAX_REPLACEMENT_FILES} files at a time.`);
  const { collection, record } = await loadCollection(params.env, params.collectionId);
  if (record?.status === 'open') {
    const same = record.items.map((item) => item.assetId).sort().join(',') === assetIds.join(',');
    if (same) return getReplacementStatus(params.env, params.collectionId, params.chain);
    throw new ReplacementError(409, 'Another file replacement is in progress. Finish or cancel it first.');
  }
  if (!isCollectionUploadsLocked(collection.state)) {
    throw new ReplacementError(409, 'This collection is not published yet, so its files can be changed directly in Artwork & metadata.');
  }
  const target = resolveReplacementTarget(params.env, collection);
  const assets = await loadAssets(params.env, params.collectionId);
  const selected = assetIds.map((id) => assets.find((asset) => asset.asset_id === id));
  if (selected.some((asset) => !asset)) throw new ReplacementError(404, 'One of the chosen files is not part of this collection.');
  const rows = selected as AssetRow[];
  for (const asset of rows) {
    if (!normalizeContentHash(asset.expected_hash) || !asset.storage_key) {
      throw new ReplacementError(409, `${asset.path ?? asset.asset_id} has no verified fingerprint, so it cannot be replaced.`);
    }
  }
  const { paused, finalized, perItem } = await checked(async () => {
    const [paused, finalized] = await Promise.all([params.chain.paused(), params.chain.finalized()]);
    const perItem = [];
    for (const asset of rows) {
      const hash = normalizeContentHash(asset.expected_hash)!;
      perItem.push({
        asset, hash,
        minted: await params.chain.onCore(hash),
        reserved: await params.chain.reserved(hash),
        tokenUri: await params.chain.registeredUri(hash)
      });
    }
    return { paused, finalized, perItem };
  });
  const blockers = replacementStartBlockers({
    paused, finalized,
    items: perItem.map((item) => ({ path: item.asset.path ?? item.asset.asset_id, assetState: String(item.asset.state ?? ''), minted: item.minted, reserved: item.reserved }))
  });
  if (blockers.length > 0) throw new ReplacementError(409, blockers.join(' '));
  const next: InventoryReplacementRecord = {
    version: 1,
    id: crypto.randomUUID(),
    status: 'open',
    contractId: target.helper,
    startedAt: now,
    startedBy: params.actor,
    updatedAt: now,
    completedAt: null,
    items: perItem.map(({ asset, hash, tokenUri }) => ({
      assetId: asset.asset_id,
      path: asset.path ?? asset.asset_id,
      original: {
        hash, storageKey: asset.storage_key!, bytes: Number(asset.total_bytes), chunks: Number(asset.total_chunks),
        mimeType: asset.mime_type ?? 'application/octet-stream', tokenUri: tokenUri ?? DEFAULT_TOKEN_URI
      },
      replacement: null
    })),
    txs: { register: [], clear: [] }
  };
  await saveRecord(params.env, params.collectionId, next, now);
  return getReplacementStatus(params.env, params.collectionId, params.chain);
}

async function storeBytes(env: Env, collectionId: string, bytes: Uint8Array, contentType: string) {
  if (storageEnabled(env)) {
    const intent = await createUploadIntent(env, collectionId);
    return (await putVerifiedUpload(env, collectionId, intent.key, bytes, contentType)).key;
  }
  // A new key: the original object is never overwritten.
  const key = `${collectionId}/${crypto.randomUUID()}`;
  await staging(env).put(key, bytes, { httpMetadata: { contentType } });
  return key;
}

export async function uploadReplacement(params: {
  env: Env; collectionId: string; chain: ReplacementChain; assetId: string; bytes: Uint8Array; contentType: string | null; now?: number;
}) {
  const now = params.now ?? Date.now();
  const { record } = await loadCollection(params.env, params.collectionId);
  if (!record || record.status !== 'open') throw new ReplacementError(409, 'Start a replacement for this file first.');
  const item = record.items.find((entry) => entry.assetId === params.assetId);
  if (!item) throw new ReplacementError(404, 'That file is not part of the replacement in progress.');
  let hash: string;
  try {
    hash = hashBytes(params.bytes);
  } catch (error) {
    throw new ReplacementError(400, error instanceof Error ? error.message : 'Invalid file.');
  }
  if (item.replacement?.hash === hash) return getReplacementStatus(params.env, params.collectionId, params.chain);
  const assets = await loadAssets(params.env, params.collectionId);
  const otherHashes = [
    ...assets.filter((asset) => isActive(asset) && asset.asset_id !== item.assetId).map((asset) => normalizeContentHash(asset.expected_hash)).filter((x): x is string => !!x),
    ...record.items.filter((entry) => entry.assetId !== item.assetId && entry.replacement).map((entry) => entry.replacement!.hash)
  ];
  const { inscribed, previousRegistered } = await checked(async () => ({
    inscribed: await params.chain.onCore(hash),
    previousRegistered: item.replacement ? (await params.chain.registeredUri(item.replacement.hash)) !== null : false
  }));
  if (previousRegistered) {
    throw new ReplacementError(409, `The earlier upload of ${item.path} is already registered on the contract. Finish the replacement with it, or cancel and start again.`);
  }
  const problems = replacementUploadProblems({ path: item.path, newHash: hash, originalHash: item.original.hash, otherHashes, inscribedOnCore: inscribed });
  if (problems.length > 0) throw new ReplacementError(409, problems.join(' '));
  const mimeType = params.contentType && params.contentType !== 'application/octet-stream' ? params.contentType.split(';')[0].trim() : item.original.mimeType;
  const storageKey = await storeBytes(params.env, params.collectionId, params.bytes, mimeType);
  const replacement: ReplacementFile = {
    hash, storageKey, bytes: params.bytes.length, chunks: Math.ceil(params.bytes.length / CHUNK_SIZE), mimeType
  };
  const next = { ...record, items: record.items.map((entry) => (entry.assetId === item.assetId ? { ...entry, replacement } : entry)) };
  await saveRecord(params.env, params.collectionId, next, now);
  return getReplacementStatus(params.env, params.collectionId, params.chain);
}

const TX_PATTERN = /^(0x)?[0-9a-f]{64}$/i;

export async function recordReplacementTx(params: { env: Env; collectionId: string; kind: string; txId: string; now?: number }) {
  if (params.kind !== 'register' && params.kind !== 'clear') throw new ReplacementError(400, 'Unknown transaction kind.');
  if (!TX_PATTERN.test(params.txId)) throw new ReplacementError(400, 'Invalid transaction id.');
  const { record } = await loadCollection(params.env, params.collectionId);
  if (!record || record.status !== 'open') throw new ReplacementError(409, 'No replacement is in progress.');
  const txId = params.txId.startsWith('0x') ? params.txId.toLowerCase() : `0x${params.txId.toLowerCase()}`;
  const list = record.txs[params.kind];
  if (list.includes(txId)) return record;
  return saveRecord(params.env, params.collectionId, { ...record, txs: { ...record.txs, [params.kind]: [...list, txId].slice(-20) } }, params.now ?? Date.now());
}

/**
 * Swap the asset rows to the new files once the chain shows every new hash
 * registered and every old one cleared, still paused and unminted. Safe to
 * repeat: rows already swapped are left as they are.
 */
export async function finishReplacement(params: { env: Env; collectionId: string; chain: ReplacementChain; now?: number }) {
  const now = params.now ?? Date.now();
  const { record } = await loadCollection(params.env, params.collectionId);
  if (record?.status === 'complete') return getReplacementStatus(params.env, params.collectionId, params.chain);
  if (!record || record.status !== 'open') throw new ReplacementError(409, 'No replacement is in progress.');
  const state = await readChainState(params.chain, record);
  const plan = planReplacement(record, state);
  if (plan.step !== 'finish') {
    const reason = plan.step === 'blocked' ? plan.blockers.join(' ')
      : plan.step === 'upload' ? 'Upload every replacement file first.'
      : plan.step === 'register' ? 'Register the new files on the contract first, and wait for confirmation.'
      : 'Remove the old registrations on the contract first, and wait for confirmation.';
    throw new ReplacementError(409, reason);
  }
  const statements = record.items.map((item) => db(params.env).prepare(
    `UPDATE assets SET expected_hash = ?, storage_key = ?, total_bytes = ?, total_chunks = ?, mime_type = ?, updated_at = ?
     WHERE collection_id = ? AND asset_id = ? AND (expected_hash = ? OR expected_hash = ?)`
  ).bind(item.replacement!.hash, item.replacement!.storageKey, item.replacement!.bytes, item.replacement!.chunks,
    item.replacement!.mimeType, now, params.collectionId, item.assetId, item.original.hash, item.replacement!.hash));
  await db(params.env).batch(statements);
  const assets = await loadAssets(params.env, params.collectionId);
  for (const item of record.items) {
    const row = assets.find((asset) => asset.asset_id === item.assetId);
    if (!row || normalizeContentHash(row.expected_hash) !== item.replacement!.hash) {
      throw new ReplacementError(409, `${item.path} changed while replacing. Nothing else was changed; reload and check the file list.`);
    }
  }
  const { metadata } = await loadCollection(params.env, params.collectionId);
  const complete: InventoryReplacementRecord = { ...record, status: 'complete', completedAt: now };
  const history = Array.isArray(metadata[INVENTORY_REPLACEMENT_HISTORY_KEY]) ? metadata[INVENTORY_REPLACEMENT_HISTORY_KEY] as unknown[] : [];
  const registration = await carriedRegistration(metadata, record, assets, now);
  await saveRecord(params.env, params.collectionId, complete, now, {
    [INVENTORY_REGISTRATION_METADATA_KEY]: registration,
    [INVENTORY_REPLACEMENT_HISTORY_KEY]: [...history, { ...complete, updatedAt: now }].slice(-20)
  });
  return { ...(await getReplacementStatus(params.env, params.collectionId, params.chain)), registrationCarried: registration !== null };
}

/**
 * The registration check for the rest of the collection still holds after a
 * replacement: the unchanged files are the ones it verified, and the chain has
 * just confirmed every new file registered (and not inscribed elsewhere) and
 * every old one cleared. So the check is carried over to the new file set —
 * but only if it was current for the old set on this contract. Otherwise the
 * artist runs "Check registration" again before minting can reopen.
 */
async function carriedRegistration(
  metadata: Record<string, unknown>,
  record: InventoryReplacementRecord,
  assets: AssetRow[],
  now: number
) {
  const previous = parseInventoryRegistrationRecord(metadata);
  const current = collectInventoryHashes(assets);
  if (!previous || !current) return null;
  const toOriginal = new Map(record.items.map((item) => [item.replacement!.hash, item.original.hash]));
  const before = [...new Set(current.map((hash) => toOriginal.get(hash) ?? hash))].sort();
  const wasCurrent = isInventoryRegistrationCurrent({
    record: previous, contractId: record.contractId, hashCount: before.length, digest: await computeInventoryDigest(before)
  });
  if (!wasCurrent) return null;
  return { version: 1, contractId: record.contractId, hashCount: current.length, digest: await computeInventoryDigest(current),
    verifiedAt: new Date(now).toISOString() };
}

/**
 * The uploaded replacement bytes for one file, for previewing on the server
 * before anything is registered on-chain (the live asset still serves the
 * current file until the replacement finishes).
 */
export async function readReplacementPreview(env: Env, collectionId: string, assetId: string) {
  const { record } = await loadCollection(env, collectionId);
  const item = record?.status === 'open' ? record.items.find((entry) => entry.assetId === assetId) : null;
  if (!item?.replacement) throw new ReplacementError(404, 'No uploaded replacement for that file.');
  const object = await staging(env).get(item.replacement.storageKey);
  if (!object) throw new ReplacementError(404, 'The uploaded replacement is not in storage. Upload it again.');
  return { body: object.body, mimeType: item.replacement.mimeType, hash: item.replacement.hash };
}

/** Only before anything changed on-chain; afterwards the artist finishes (or undoes it on-chain). */
export async function cancelReplacement(params: { env: Env; collectionId: string; chain: ReplacementChain; now?: number }) {
  const now = params.now ?? Date.now();
  const { record } = await loadCollection(params.env, params.collectionId);
  if (!record || record.status !== 'open') throw new ReplacementError(409, 'No replacement is in progress.');
  const state = await readChainState(params.chain, record);
  const changedOnChain = state.items.some((item) => !item.originalRegistered || item.replacementRegistered === true);
  if (changedOnChain) {
    throw new ReplacementError(409, 'The contract registrations have already changed, so this replacement can no longer be cancelled here. Finish it, or restore the old registrations and remove the new ones on-chain first.');
  }
  await saveRecord(params.env, params.collectionId, { ...record, status: 'cancelled', completedAt: now }, now);
  return getReplacementStatus(params.env, params.collectionId, params.chain);
}

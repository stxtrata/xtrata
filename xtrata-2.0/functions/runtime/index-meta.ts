import { queryAll } from '../lib/db';
import type { RuntimeContractRef, RuntimeEnv } from './lib';

// The runtime cache is keyed by content hash, which is what makes a cached copy
// impossible to serve stale. The cost of that design was a chain read on EVERY
// request — including cache hits — just to learn the hash before we could look
// in our own cupboard. Measured against production that was ~500-770ms and up
// to five upstream calls before a single cached byte moved.
//
// The index already holds the hash. For a SEALED inscription it can never
// change, so reading it from D1 is not a staleness risk: the hash either
// matches a cached object or it does not, and a miss just falls through to the
// normal chain path. Nothing here is ever used to RECONSTRUCT content — only to
// find an already-assembled copy — so a wrong or stale row can cost a wasted
// lookup but can never produce wrong bytes.

export type IndexedRuntimeMeta = {
  contract: RuntimeContractRef;
  contractId: string;
  finalHash: Uint8Array;
  finalHashHex: string;
  mimeType: string;
  totalSize: bigint;
  totalChunks: bigint;
  tokenUri: string;
};

type IndexRow = {
  contract?: string;
  mime?: string | null;
  total_size?: number | null;
  total_chunks?: number | null;
  final_hash?: string | null;
  token_uri?: string | null;
  sealed?: number | null;
};

const HEX_HASH_PATTERN = /^[0-9a-f]+$/;

export const parseIndexedFinalHash = (value: string | null | undefined) => {
  const trimmed = String(value ?? '').trim().toLowerCase();
  const hex = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
  // A content hash is 32 bytes. Anything else is a row we do not understand,
  // and guessing at it would only produce cache keys that never match.
  if (hex.length !== 64 || !HEX_HASH_PATTERN.test(hex)) {
    return null;
  }
  const bytes = new Uint8Array(32);
  for (let index = 0; index < 32; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return { bytes, hex };
};

const toBigInt = (value: number | null | undefined) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return BigInt(Math.floor(value));
};

const formatContractId = (contract: RuntimeContractRef) =>
  `${contract.address}.${contract.contractName}`;

/**
 * The indexed metadata for a sealed inscription, or null when the index cannot
 * answer — no D1 binding, no row, an unsealed token, or a hash we cannot parse.
 * Null is always safe: the caller falls back to reading the chain.
 *
 * Candidates are tried in the order given (primary contract, then fallback),
 * mirroring how the chain path resolves, so the cache key is built against the
 * same contract the chain path would have chosen.
 */
export const lookupIndexedRuntimeMeta = async (params: {
  env: RuntimeEnv;
  candidates: Array<RuntimeContractRef | null>;
  tokenId: bigint;
}): Promise<IndexedRuntimeMeta | null> => {
  const candidates = params.candidates.filter(
    (entry): entry is RuntimeContractRef => entry !== null
  );
  if (candidates.length === 0) {
    return null;
  }
  if (params.tokenId < 0n || params.tokenId > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  const contractIds: string[] = [];
  for (const candidate of candidates) {
    const contractId = formatContractId(candidate);
    if (!contractIds.includes(contractId)) {
      contractIds.push(contractId);
    }
  }

  let rows: IndexRow[];
  try {
    const result = await queryAll(
      params.env as Parameters<typeof queryAll>[0],
      `SELECT contract, mime, total_size, total_chunks, final_hash, token_uri
         FROM inscription_index
        WHERE token_id = ? AND sealed = 1
          AND contract IN (${contractIds.map(() => '?').join(',')})`,
      [Number(params.tokenId), ...contractIds]
    );
    rows = (result.results ?? []) as IndexRow[];
  } catch (error) {
    // No D1 binding, or the index is unavailable. Not an error worth failing a
    // content request over — the chain path still works.
    return null;
  }

  for (const contractId of contractIds) {
    const row = rows.find((entry) => entry.contract === contractId);
    if (!row) {
      continue;
    }
    const finalHash = parseIndexedFinalHash(row.final_hash);
    const totalSize = toBigInt(row.total_size);
    const totalChunks = toBigInt(row.total_chunks);
    const mimeType = String(row.mime ?? '').trim();
    if (!finalHash || totalSize === null || totalChunks === null || !mimeType) {
      continue;
    }
    const contract = candidates.find(
      (entry) => formatContractId(entry) === contractId
    );
    if (!contract) {
      continue;
    }
    return {
      contract,
      contractId,
      finalHash: finalHash.bytes,
      finalHashHex: finalHash.hex,
      mimeType,
      totalSize,
      totalChunks,
      tokenUri: String(row.token_uri ?? '').trim()
    };
  }

  return null;
};

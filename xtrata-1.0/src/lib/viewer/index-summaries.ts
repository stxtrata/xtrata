import type { TokenSummary } from './types';

// Client for the D1-backed inscription index (functions/index/[contract].ts).
// Returns complete TokenSummary objects so a grid page needs zero per-token
// chain reads; resolves primary-first across the migration lineage and falls
// back to the chain (in the caller) for any id the index hasn't synced yet.

type IndexRow = {
  id: number;
  owner: string | null;
  creator: string | null;
  finalHash: string | null;
  mime: string | null;
  totalSize: number | null;
  totalChunks: number | null;
  sealed: boolean;
  tokenUri: string | null;
  migrationSource: string | null;
};

const hexToBytes = (hex: string | null): Uint8Array => {
  if (!hex) return new Uint8Array();
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length === 0 || clean.length % 2 !== 0) return new Uint8Array();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};

const rowToSummary = (row: IndexRow, contractId: string): TokenSummary => ({
  id: BigInt(row.id),
  owner: row.owner ?? null,
  tokenUri: row.tokenUri ?? null,
  // SVG previews need a separate data-uri read; the index can't supply it, so
  // svg rows are treated as "not indexed" below and fall back to the chain.
  svgDataUri: null,
  sourceContractId: contractId,
  meta: row.mime
    ? {
        owner: row.owner ?? '',
        creator: row.creator ?? null,
        mimeType: row.mime,
        totalSize: BigInt(Math.max(0, row.totalSize ?? 0)),
        totalChunks: BigInt(Math.max(0, row.totalChunks ?? 0)),
        sealed: !!row.sealed,
        finalHash: hexToBytes(row.finalHash)
      }
    : null
});

const isSvg = (mime: string | null) => mime?.toLowerCase() === 'image/svg+xml';

const fetchContractRows = async (
  origin: string,
  contractId: string,
  ids: bigint[]
): Promise<IndexRow[]> => {
  const url = `${origin}/index/${contractId}?ids=${ids.map((id) => id.toString()).join(',')}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`index ${contractId} HTTP ${response.status}`);
  }
  const body = (await response.json()) as { tokens?: IndexRow[] };
  return Array.isArray(body.tokens) ? body.tokens : [];
};

// Resolve the given ids from the index, primary-first across [primary, ...lineage].
// Returns a map of id-string -> TokenSummary for the ids the index actually has.
// SVG tokens and any id missing everywhere are omitted (caller chain-fallback).
export const fetchIndexedSummaries = async (params: {
  primaryContractId: string;
  lineageContractIds: string[];
  ids: bigint[];
  origin?: string;
}): Promise<Map<string, TokenSummary>> => {
  const out = new Map<string, TokenSummary>();
  if (params.ids.length === 0) return out;
  const origin = params.origin ?? '';
  const contracts = [params.primaryContractId, ...params.lineageContractIds];

  // One request per contract (in parallel), each returning whichever of the ids
  // it holds. Keyed by contract so we can merge primary-first.
  const byContract = await Promise.all(
    contracts.map(async (contractId) => {
      try {
        const rows = await fetchContractRows(origin, contractId, params.ids);
        const map = new Map<string, IndexRow>();
        for (const row of rows) map.set(row.id.toString(), row);
        return { contractId, map };
      } catch {
        return { contractId, map: new Map<string, IndexRow>() };
      }
    })
  );

  for (const id of params.ids) {
    const key = id.toString();
    for (const { contractId, map } of byContract) {
      const row = map.get(key);
      if (row && !isSvg(row.mime)) {
        out.set(key, rowToSummary(row, contractId));
        break; // primary-first: first contract that has it wins
      }
    }
  }
  return out;
};

import type { TokenSummary } from './types';
import { loadTokenSummaryFromCache, saveTokenSummaryToCache } from './cache';

// Index-resolved summaries are persisted in the shared IndexedDB token-summaries
// store so a return visit (or a fresh page reload) paints the grid instantly
// from disk instead of waiting on the network. A short TTL keeps owner/migration
// changes from lingering stale (the server edge cache + rolling sync handle
// authoritative freshness); 5 minutes mirrors the edge SWR window's spirit.
const INDEX_SUMMARY_TTL_MS = 5 * 60 * 1000;

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
  // SVG rows carry no inline data-uri; the grids render SVGs from the R2-backed
  // runtime content endpoint (falling back to on-chain bytes on error), so the
  // index no longer needs to chain-fetch a data-uri for them.
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

type CombinedRow = IndexRow & { sourceContract: string };

// Single round-trip: the combined endpoint resolves the whole lineage server-
// side in one D1 query and returns each id's primary-first winner already
// attributed to its source contract. Throws on any non-OK so the caller can
// fall back to the per-contract fan-out below.
const fetchCombined = async (
  origin: string,
  primaryContractId: string,
  lineageContractIds: string[],
  ids: bigint[]
): Promise<Map<string, TokenSummary>> => {
  const url =
    `${origin}/index/page?primary=${encodeURIComponent(primaryContractId)}` +
    `&lineage=${encodeURIComponent(lineageContractIds.join(','))}` +
    `&ids=${ids.map((id) => id.toString()).join(',')}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`index page HTTP ${response.status}`);
  }
  const body = (await response.json()) as { tokens?: CombinedRow[] };
  const out = new Map<string, TokenSummary>();
  for (const row of Array.isArray(body.tokens) ? body.tokens : []) {
    out.set(row.id.toString(), rowToSummary(row, row.sourceContract));
  }
  return out;
};

// Resolve the given ids from the index, primary-first across [primary, ...lineage].
// Returns a map of id-string -> TokenSummary for the ids the index actually has.
// SVG tokens and any id missing everywhere are omitted (caller chain-fallback).
// Per-contract fan-out fallback for deploys without /index/page. Resolves the
// given ids primary-first across [primary, ...lineage].
const fetchFanOut = async (
  origin: string,
  primaryContractId: string,
  lineageContractIds: string[],
  ids: bigint[]
): Promise<Map<string, TokenSummary>> => {
  const out = new Map<string, TokenSummary>();
  const contracts = [primaryContractId, ...lineageContractIds];
  const byContract = await Promise.all(
    contracts.map(async (contractId) => {
      try {
        const rows = await fetchContractRows(origin, contractId, ids);
        const map = new Map<string, IndexRow>();
        for (const row of rows) map.set(row.id.toString(), row);
        return { contractId, map };
      } catch {
        return { contractId, map: new Map<string, IndexRow>() };
      }
    })
  );
  for (const id of ids) {
    const key = id.toString();
    for (const { contractId, map } of byContract) {
      const row = map.get(key);
      if (row) {
        out.set(key, rowToSummary(row, contractId));
        break; // primary-first: first contract that has it wins
      }
    }
  }
  return out;
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

  // 1. Seed from the IndexedDB cache (instant). Anything still fresh is served
  //    from disk; only the misses go to the network. Keyed by the primary
  //    contract so the index keyspace is stable regardless of which lineage
  //    contract actually resolved a given id.
  const missing: bigint[] = [];
  await Promise.all(
    params.ids.map(async (id) => {
      const cached = await loadTokenSummaryFromCache(
        params.primaryContractId,
        id,
        INDEX_SUMMARY_TTL_MS
      );
      if (cached) {
        out.set(id.toString(), cached as TokenSummary);
      } else {
        missing.push(id);
      }
    })
  );
  if (missing.length === 0) return out;

  // 2. Fetch only the misses — combined endpoint first, fan-out on failure.
  let fetched: Map<string, TokenSummary>;
  try {
    fetched = await fetchCombined(
      origin,
      params.primaryContractId,
      params.lineageContractIds,
      missing
    );
  } catch {
    fetched = await fetchFanOut(
      origin,
      params.primaryContractId,
      params.lineageContractIds,
      missing
    );
  }

  // 3. Merge and persist the freshly fetched summaries (best-effort).
  for (const [key, summary] of fetched) {
    out.set(key, summary);
    void saveTokenSummaryToCache(
      params.primaryContractId,
      summary.id,
      summary,
      { maxAgeMs: INDEX_SUMMARY_TTL_MS }
    );
  }
  return out;
};

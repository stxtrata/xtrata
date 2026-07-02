import { queryAll } from '../lib/db';
import type { RuntimeEnv } from '../runtime/lib';

// Combined lineage page endpoint. The grids resolve a visible page primary-first
// across [primary, ...lineage]. Hitting /index/<contract> once per contract cost
// one request (and one cache entry) per contract — three for v3/v2/v1. This
// endpoint does it in ONE round-trip: a single D1 query across all contracts in
// the lineage, deduped primary-first server-side, and edge-cached as one entry.
//
//   GET /index/page?primary=<id>&lineage=<id,id>&ids=1,2,3
//
// Returns each resolved token with the contract it came from (sourceContract),
// so the client can attribute ownership/lineage exactly as the per-contract path
// did. SVG tokens are included: the client renders them from the R2-backed
// runtime content endpoint (no per-token chain reconstruction needed).

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS }
  });

type IndexDbRow = {
  contract: string;
  token_id: number;
  owner: string | null;
  creator: string | null;
  final_hash: string | null;
  mime: string | null;
  total_size: number | null;
  total_chunks: number | null;
  sealed: number;
  token_uri: string | null;
  migration_source: string | null;
};

const COLS =
  'contract, token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source';

export const onRequest = async (context: {
  request: Request;
  env: RuntimeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);

  try {
    const url = new URL(request.url);
    const primary = (url.searchParams.get('primary') || '').trim();
    if (!primary) return json({ error: 'Missing primary contract.' }, 400);

    // Lineage order matters: it is the primary-first fallback priority. Keep the
    // primary at the head and preserve the caller's lineage ordering, de-duped.
    const lineage = (url.searchParams.get('lineage') || '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s !== primary);
    const contracts = Array.from(new Set([primary, ...lineage]));

    const idsParam = url.searchParams.get('ids');
    if (!idsParam) return json({ error: 'Missing ids.' }, 400);
    const ids = Array.from(
      new Set(
        idsParam
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => Number.isInteger(n) && n > 0)
      )
    )
      .sort((a, b) => a - b)
      .slice(0, 200);
    if (ids.length === 0) return json({ error: 'No valid ids.' }, 400);

    // Normalized edge-cache key: equivalent requests (any id/lineage ordering)
    // share one entry. SWR keeps it fresh; owner/migration changes self-heal via
    // each contract's rolling sync.
    const cacheKeyUrl = new URL(url.origin + url.pathname);
    cacheKeyUrl.searchParams.set('primary', primary);
    cacheKeyUrl.searchParams.set('lineage', lineage.join(','));
    cacheKeyUrl.searchParams.set('ids', ids.join(','));
    const edgeCache = (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null;
    const cacheRequest = new Request(cacheKeyUrl.toString(), { method: 'GET' });
    if (edgeCache) {
      const hit = await edgeCache.match(cacheRequest);
      if (hit) return hit;
    }

    // One query across the whole lineage instead of one request per contract.
    const result = await queryAll(
      env,
      `SELECT ${COLS} FROM inscription_index
        WHERE contract IN (${contracts.map(() => '?').join(',')})
          AND token_id IN (${ids.map(() => '?').join(',')})`,
      [...contracts, ...ids]
    );
    const dbRows = (result.results ?? []) as IndexDbRow[];

    // Index rows by contract -> token_id so we can resolve each id primary-first.
    const byContract = new Map<string, Map<number, IndexDbRow>>();
    for (const row of dbRows) {
      let perContract = byContract.get(row.contract);
      if (!perContract) {
        perContract = new Map<number, IndexDbRow>();
        byContract.set(row.contract, perContract);
      }
      perContract.set(row.token_id, row);
    }

    const tokens: Array<{
      id: number;
      sourceContract: string;
      owner: string | null;
      creator: string | null;
      finalHash: string | null;
      mime: string | null;
      totalSize: number | null;
      totalChunks: number | null;
      sealed: boolean;
      tokenUri: string | null;
      migrationSource: string | null;
    }> = [];
    for (const id of ids) {
      for (const contractId of contracts) {
        const row = byContract.get(contractId)?.get(id);
        if (row) {
          tokens.push({
            id: row.token_id,
            sourceContract: contractId,
            owner: row.owner,
            creator: row.creator,
            finalHash: row.final_hash,
            mime: row.mime,
            totalSize: row.total_size,
            totalChunks: row.total_chunks,
            sealed: row.sealed === 1,
            tokenUri: row.token_uri ?? null,
            migrationSource: row.migration_source
          });
          break; // primary-first: first contract that has it wins
        }
      }
    }

    // Lazy freshness: kick each contract's own sync (its POST handler) in the
    // background when it is behind or stale, so the backlog fills and new mints
    // appear over traffic — without duplicating the sync logic here.
    if (context.waitUntil) {
      const stateRes = await queryAll(
        env,
        `SELECT contract, minted_count, synced_count, updated_at
           FROM inscription_index_state
          WHERE contract IN (${contracts.map(() => '?').join(',')})`,
        contracts
      );
      const stateByContract = new Map<string, { minted: number; synced: number; updatedAt: number }>();
      for (const r of (stateRes.results ?? []) as Array<{
        contract: string; minted_count?: number; synced_count?: number; updated_at?: number;
      }>) {
        stateByContract.set(r.contract, {
          minted: r.minted_count ?? 0,
          synced: r.synced_count ?? 0,
          updatedAt: r.updated_at ?? 0
        });
      }
      const now = Date.now();
      for (const contractId of contracts) {
        const st = stateByContract.get(contractId);
        const behind = !st || st.synced < st.minted;
        const stale = !st || now - st.updatedAt > 60_000;
        if (behind || stale) {
          const syncUrl = `${url.origin}/index/${encodeURIComponent(contractId)}`;
          context.waitUntil(fetch(syncUrl, { method: 'POST' }).then(() => undefined).catch(() => undefined));
        }
      }
    }

    const shouldCacheResponse = tokens.length > 0;
    const response = new Response(JSON.stringify({ primary, lineage, tokens }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': shouldCacheResponse
          ? 'public, max-age=15, s-maxage=60, stale-while-revalidate=300'
          : 'no-store',
        ...CORS
      }
    });
    if (shouldCacheResponse && edgeCache && context.waitUntil) {
      context.waitUntil(edgeCache.put(cacheRequest, response.clone()));
    }
    return response;
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

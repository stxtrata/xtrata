import { parseRuntimeContractRef, type RuntimeEnv } from '../../runtime/lib';
import { queryAll } from '../../lib/db';

// Dependents endpoint. There is no on-chain get-dependents reader, so the list
// of inscriptions that DEPEND ON a given id is derived from the
// inscription_dependencies edge table (populated by the index sync, migration
// 007). Because `dependencies` are existence-only edges, this answers "every
// inscription that points at X" — the index behind a permissionless bulletin
// board whose root is X and whose posts are its dependents.
//
//   GET /index/dependents/<contract>?id=42&limit=100&offset=0
//
// Returns the direct dependents of <id>, mint-ordered (token_id ASC ≈
// chronological, since a token can only name dependencies minted before it),
// joined to the summary index for creator/owner/uri/mime/size.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};
const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS, ...extraHeaders }
  });

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

const getState = async (env: RuntimeEnv, contractId: string) => {
  const res = await queryAll(
    env,
    'SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?',
    [contractId]
  );
  const row = (res.results ?? [])[0] as { minted_count?: number; synced_count?: number } | undefined;
  return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
};

const queryDependents = async (
  env: RuntimeEnv, contractId: string, id: number, limit: number, offset: number
) => {
  // limit+1 to detect hasMore without a second COUNT query.
  const res = await queryAll(
    env,
    `SELECT d.child_id AS id, i.creator, i.owner, i.token_uri AS tokenUri,
            i.mime, i.total_size AS totalSize, i.sealed, i.final_hash AS finalHash, i.updated_at AS updatedAt
       FROM inscription_dependencies d
       LEFT JOIN inscription_index i
         ON i.contract = d.contract AND i.token_id = d.child_id
      WHERE d.contract = ?1 AND d.dependency_id = ?2
      ORDER BY d.child_id ASC
      LIMIT ?3 OFFSET ?4`,
    [contractId, id, limit + 1, offset]
  );
  return (res.results ?? []) as Array<Record<string, unknown>>;
};

export const onRequest = async (context: {
  request: Request;
  params: { contract?: string };
  env: RuntimeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, params, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);

  const contractId = params.contract ?? '';
  const contract = parseRuntimeContractRef(contractId);
  if (!contract) return json({ error: 'Invalid contract id.' }, 400);

  const url = new URL(request.url);
  const idRaw = Number(url.searchParams.get('id'));
  if (!Number.isInteger(idRaw) || idRaw <= 0) {
    return json({ error: 'Missing or invalid id.' }, 400);
  }
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get('limit')) || DEFAULT_LIMIT));
  const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);

  try {
    const [rows, state] = await Promise.all([
      queryDependents(env, contractId, idRaw, limit, offset),
      getState(env, contractId)
    ]);

    // Keep the index moving: if behind, kick a throttled background sync (which
    // carries the edge sync). Same-origin, fire-and-forget.
    if (context.waitUntil && state.syncedCount < state.mintedCount) {
      const syncUrl = new URL(`/index/${contractId}`, url.origin);
      context.waitUntil(fetch(syncUrl.toString(), { method: 'POST' }).then(() => undefined).catch(() => undefined));
    }

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const complete = state.syncedCount >= state.mintedCount && state.mintedCount > 0;

    return json(
      {
        contract: contractId,
        id: idRaw,
        mintedCount: state.mintedCount,
        syncedCount: state.syncedCount,
        complete,
        dependents: page,
        pagination: { limit, offset, hasMore, nextOffset: hasMore ? offset + limit : null }
      },
      200,
      { 'Cache-Control': 'public, max-age=15, s-maxage=60, stale-while-revalidate=300' }
    );
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

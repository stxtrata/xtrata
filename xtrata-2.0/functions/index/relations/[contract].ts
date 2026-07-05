import { parseRuntimeContractRef, type RuntimeEnv } from '../../runtime/lib';
import { queryAll } from '../../lib/db';

// Relationship lineage endpoint. There is no on-chain get-children reader, so
// child navigation is derived from the inscription_parents edge table (populated
// by the index sync). Because the edges form a mint-ordered DAG, one table
// answers every direction via recursive CTEs:
//
//   GET /index/relations/<contract>?id=42
//
// Returns, for the given id:
//   - ancestors:   parents, grandparents, … (depth-tagged, all depths)
//   - descendants: children, grandchildren, … (depth-tagged, all depths)
//   - siblings:    other inscriptions sharing at least one parent (half-siblings)
// Convenience: parents/children are the depth-1 slices of ancestors/descendants.

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

// Safety bounds: depth caps the recursion (DAGs are shallow in practice) and the
// row LIMIT caps payload size for pathological fan-out.
const MAX_DEPTH = 32;
const MAX_ROWS = 2000;

const getState = async (env: RuntimeEnv, contractId: string) => {
  const res = await queryAll(
    env,
    'SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?',
    [contractId]
  );
  const row = (res.results ?? [])[0] as { minted_count?: number; synced_count?: number } | undefined;
  return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
};

// Descendants: walk parent_id -> child_id. MIN(depth) collapses ids reachable by
// multiple paths to their shallowest distance (UNION dedups (id,depth) pairs and
// guarantees termination under the depth cap).
const queryDescendants = async (env: RuntimeEnv, contractId: string, id: number) => {
  const res = await queryAll(
    env,
    `WITH RECURSIVE descs(id, depth) AS (
       SELECT child_id, 1 FROM inscription_parents
        WHERE contract = ?1 AND parent_id = ?2
       UNION
       SELECT ip.child_id, descs.depth + 1
         FROM inscription_parents ip
         JOIN descs ON ip.parent_id = descs.id
        WHERE ip.contract = ?1 AND descs.depth < ?3
     )
     SELECT id, MIN(depth) AS depth FROM descs
     GROUP BY id ORDER BY depth ASC, id ASC LIMIT ?4`,
    [contractId, id, MAX_DEPTH, MAX_ROWS]
  );
  return (res.results ?? []) as Array<{ id: number; depth: number }>;
};

// Ancestors: walk child_id -> parent_id.
const queryAncestors = async (env: RuntimeEnv, contractId: string, id: number) => {
  const res = await queryAll(
    env,
    `WITH RECURSIVE ancs(id, depth) AS (
       SELECT parent_id, 1 FROM inscription_parents
        WHERE contract = ?1 AND child_id = ?2
       UNION
       SELECT ip.parent_id, ancs.depth + 1
         FROM inscription_parents ip
         JOIN ancs ON ip.child_id = ancs.id
        WHERE ip.contract = ?1 AND ancs.depth < ?3
     )
     SELECT id, MIN(depth) AS depth FROM ancs
     GROUP BY id ORDER BY depth ASC, id ASC LIMIT ?4`,
    [contractId, id, MAX_DEPTH, MAX_ROWS]
  );
  return (res.results ?? []) as Array<{ id: number; depth: number }>;
};

// Half-siblings: other children of any of this id's parents.
const querySiblings = async (env: RuntimeEnv, contractId: string, id: number) => {
  const res = await queryAll(
    env,
    `SELECT DISTINCT child_id AS id FROM inscription_parents
      WHERE contract = ?1
        AND parent_id IN (
          SELECT parent_id FROM inscription_parents WHERE contract = ?1 AND child_id = ?2
        )
        AND child_id <> ?2
      ORDER BY child_id ASC LIMIT ?3`,
    [contractId, id, MAX_ROWS]
  );
  return (res.results ?? []) as Array<{ id: number }>;
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

  try {
    const [descendants, ancestors, siblings, state] = await Promise.all([
      queryDescendants(env, contractId, idRaw),
      queryAncestors(env, contractId, idRaw),
      querySiblings(env, contractId, idRaw),
      getState(env, contractId)
    ]);

    // Keep the index moving toward completeness: if the summary index is behind,
    // kick a throttled background sync on the sibling /index/<contract> route
    // (which carries the edge-sync). Same-origin, fire-and-forget.
    if (context.waitUntil && state.syncedCount < state.mintedCount) {
      const syncUrl = new URL(`/index/${contractId}`, url.origin);
      context.waitUntil(
        fetch(syncUrl.toString(), { method: 'POST' }).then(() => undefined).catch(() => undefined)
      );
    }

    // Mimes for the immediate family (parents/children/siblings) so clients can
    // classify relatives (song vs image vs other) without extra round-trips.
    const familyIds = [...new Set([
      ...ancestors.filter((r) => r.depth === 1).map((r) => r.id),
      ...descendants.filter((r) => r.depth === 1).map((r) => r.id),
      ...siblings.map((r) => r.id)
    ])].slice(0, 64);
    const mimes: Record<number, string> = {};
    if (familyIds.length) {
      try {
        const mimeRows = await queryAll(
          env,
          `SELECT token_id, mime FROM inscription_index
            WHERE contract = ?1 AND token_id IN (${familyIds.map(() => '?').join(',')})`,
          [contractId, ...familyIds]
        );
        for (const row of (mimeRows.results ?? []) as Array<{ token_id: number; mime: string | null }>) {
          mimes[row.token_id] = row.mime || '';
        }
      } catch { /* mime map is best-effort */ }
    }

    const complete = state.syncedCount >= state.mintedCount && state.mintedCount > 0;
    const payload = {
      contract: contractId,
      id: idRaw,
      mintedCount: state.mintedCount,
      syncedCount: state.syncedCount,
      complete,
      parents: ancestors.filter((r) => r.depth === 1).map((r) => r.id),
      children: descendants.filter((r) => r.depth === 1).map((r) => r.id),
      ancestors: ancestors.map((r) => ({ id: r.id, depth: r.depth })),
      descendants: descendants.map((r) => ({ id: r.id, depth: r.depth })),
      siblings: siblings.map((r) => r.id),
      mimes
    };
    return json(payload, 200, {
      // Brief browser cache; longer edge TTL with SWR. The edges only change when
      // new children are minted, which the rolling sync picks up.
      'Cache-Control': 'public, max-age=15, s-maxage=60, stale-while-revalidate=300'
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

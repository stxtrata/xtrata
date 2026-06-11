import { serializeCV, uintCV, cvToJSON } from '@stacks/transactions';
import {
  callRuntimeReadOnly,
  getRuntimeApiBases,
  parseRuntimeContractRef,
  type RuntimeContractRef,
  type RuntimeEnv
} from '../runtime/lib';
import { queryAll, run } from '../lib/db';

// Cached per-token summary index. Reading a page is one D1 query instead of N
// per-token chain reads; the index is populated incrementally from the core's
// append-only minted-id list. Content bytes remain served by /runtime/content.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS }
  });

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
const uintArg = (value: bigint) => {
  const serialized = serializeCV(uintCV(value)) as unknown as Uint8Array | string;
  return '0x' + (typeof serialized === 'string' ? serialized.replace(/^0x/, '') : toHex(serialized));
};

// cvToJSON unwrappers (defensive against version shape differences).
const unwrap = (node: any): any =>
  node && typeof node === 'object' && 'value' in node ? node.value : node;
const asNumber = (node: any): number | null => {
  const v = unwrap(node);
  return v === null || v === undefined ? null : Number(v);
};
const asString = (node: any): string | null => {
  const v = unwrap(node);
  return typeof v === 'string' ? v : v === null || v === undefined ? null : String(v);
};
// Clarity (list uint) -> number[]. cvToJSON renders a list as { value: [ {uint},
// ... ] }; unwrap yields the element array, each element unwrapped to a number.
const asUintList = (node: any): number[] => {
  const v = unwrap(node);
  if (!Array.isArray(v)) return [];
  const out: number[] = [];
  for (const el of v) {
    const n = asNumber(el);
    if (n !== null && Number.isInteger(n) && n > 0) out.push(n);
  }
  return out;
};

const readOkUint = async (
  env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, functionName: string
) => {
  const cv = await callRuntimeReadOnly({
    env, apiBases, contract, functionName, functionArgs: [], senderAddress: contract.address
  });
  // (ok uint): cvToJSON -> { value: { value: "56" } } — unwrap twice.
  return Number(unwrap(unwrap(cvToJSON(cv))));
};
const readMintedCount = (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef) =>
  readOkUint(env, apiBases, contract, 'get-minted-count');
const readLastTokenId = (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef) =>
  readOkUint(env, apiBases, contract, 'get-last-token-id');

const readMintedId = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, index: number) => {
  const cv = await callRuntimeReadOnly({
    env, apiBases, contract,
    functionName: 'get-minted-id', functionArgs: [uintArg(BigInt(index))], senderAddress: contract.address
  });
  const json0 = cvToJSON(cv);
  // (ok (optional uint)) -> ok -> optional -> uint
  const v = unwrap(unwrap(json0));
  return v === null || v === undefined ? null : Number(unwrap(v));
};

const readSummary = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, id: number) => {
  const cv = await callRuntimeReadOnly({
    env, apiBases, contract,
    functionName: 'get-inscription-summary', functionArgs: [uintArg(BigInt(id))], senderAddress: contract.address
  });
  // (ok (optional { tuple })) -> ok -> optional -> tuple.value (field map)
  const okVal = unwrap(cvToJSON(cv));
  const optVal = unwrap(okVal);
  if (optVal === null || optVal === undefined) return null;
  const fields = optVal.value ?? optVal; // tuple field map
  return {
    owner: asString(fields['owner']),
    creator: asString(fields['creator']),
    finalHash: asString(fields['final-hash']),
    mime: asString(fields['mime-type']),
    totalSize: asNumber(fields['total-size']),
    totalChunks: asNumber(fields['total-chunks']),
    sealed: unwrap(fields['sealed']) === true ? 1 : 0,
    tokenUri: asString(unwrap(fields['token-uri'])),
    // migration-source is (optional { source-contract: principal, source-id: uint }).
    // Store the XIP-002 canonical reference "<contract>:<id>", or null.
    migrationSource: (() => {
      const ms = fields['migration-source'];
      if (!ms) return null;
      const inner = unwrap(ms); // optional -> tuple json or null
      if (inner === null || inner === undefined) return null;
      const t = inner.value ?? inner;
      const sourceContract = asString(t['source-contract']);
      const sourceId = asNumber(t['source-id']);
      return sourceContract != null && sourceId != null ? `${sourceContract}:${sourceId}` : null;
    })(),
    // Direct parents (v3.2.0+ summaries carry this list; empty on older cores).
    parents: asUintList(fields['parents'])
  };
};

// Older cores (v1/v2) lack get-inscription-summary: read get-inscription-meta
// (+ get-owner when the meta tuple carries no owner). v1/v2 are migration sources
// themselves, so migration-source is null.
const readMetaSummary = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, id: number) => {
  const cv = await callRuntimeReadOnly({
    env, apiBases, contract,
    functionName: 'get-inscription-meta', functionArgs: [uintArg(BigInt(id))], senderAddress: contract.address
  });
  const optVal = unwrap(unwrap(cvToJSON(cv)));
  if (optVal === null || optVal === undefined) return null;
  const fields = optVal.value ?? optVal;
  let owner = asString(fields['owner']);
  if (owner === null) {
    try {
      const oc = await callRuntimeReadOnly({
        env, apiBases, contract,
        functionName: 'get-owner', functionArgs: [uintArg(BigInt(id))], senderAddress: contract.address
      });
      owner = asString(unwrap(unwrap(cvToJSON(oc))));
    } catch { owner = null; }
  }
  // get-inscription-meta has no token-uri; read it separately (one-time at sync).
  let tokenUri: string | null = null;
  try {
    const tc = await callRuntimeReadOnly({
      env, apiBases, contract,
      functionName: 'get-token-uri', functionArgs: [uintArg(BigInt(id))], senderAddress: contract.address
    });
    tokenUri = asString(unwrap(unwrap(unwrap(cvToJSON(tc)))));
  } catch { tokenUri = null; }
  return {
    owner,
    creator: asString(fields['creator']),
    finalHash: asString(fields['final-hash']),
    mime: asString(fields['mime-type']),
    totalSize: asNumber(fields['total-size']),
    totalChunks: asNumber(fields['total-chunks']),
    sealed: unwrap(fields['sealed']) === true ? 1 : 0,
    tokenUri,
    migrationSource: null as string | null,
    // v1/v2 cores predate parent relationships.
    parents: [] as number[]
  };
};

// Detect the contract's reader shape so v1/v2/v3 all index from one endpoint.
const probeCaps = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef) => {
  let hasMintedList = true;
  let hasSummary = true;
  try { await readMintedCount(env, apiBases, contract); } catch { hasMintedList = false; }
  try {
    await callRuntimeReadOnly({
      env, apiBases, contract,
      functionName: 'get-inscription-summary', functionArgs: [uintArg(1n)], senderAddress: contract.address
    });
  } catch { hasSummary = false; }
  return { hasMintedList, hasSummary };
};

const getState = async (env: RuntimeEnv, contractId: string) => {
  const res = await queryAll(env, 'SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?', [contractId]);
  const row = (res.results ?? [])[0] as { minted_count?: number; synced_count?: number } | undefined;
  return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
};

type IndexSummary = {
  owner: string | null; creator: string | null; finalHash: string | null; mime: string | null;
  totalSize: number | null; totalChunks: number | null; sealed: number;
  tokenUri: string | null; migrationSource: string | null; parents: number[];
};
type Caps = { hasMintedList: boolean; hasSummary: boolean };

const readToken = (
  env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, caps: Caps, id: number
): Promise<IndexSummary | null> =>
  caps.hasSummary
    ? readSummary(env, apiBases, contract, id)
    : readMetaSummary(env, apiBases, contract, id);

// Replace a child's parent edge set: clear its existing edges, then insert the
// current parents. Wrapped so a deploy that hasn't applied migration 006 (no
// inscription_parents table) never breaks core summary indexing.
const syncTokenParents = async (
  env: RuntimeEnv, contractId: string, childId: number, parents: number[]
) => {
  try {
    await run(env, 'DELETE FROM inscription_parents WHERE contract = ? AND child_id = ?', [contractId, childId]);
    const now = Date.now();
    for (const parentId of parents) {
      if (!Number.isInteger(parentId) || parentId <= 0 || parentId === childId) continue;
      await run(
        env,
        'INSERT OR IGNORE INTO inscription_parents (contract, child_id, parent_id, updated_at) VALUES (?,?,?,?)',
        [contractId, childId, parentId, now]
      );
    }
  } catch {
    // inscription_parents absent / not yet migrated — skip edge sync.
  }
};

const upsertToken = async (env: RuntimeEnv, contractId: string, tokenId: number, s: IndexSummary) => {
  await run(
    env,
    `INSERT INTO inscription_index
       (contract, token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(contract, token_id) DO UPDATE SET
       owner=excluded.owner, creator=excluded.creator, final_hash=excluded.final_hash,
       mime=excluded.mime, total_size=excluded.total_size, total_chunks=excluded.total_chunks,
       sealed=excluded.sealed, token_uri=excluded.token_uri,
       migration_source=excluded.migration_source, updated_at=excluded.updated_at`,
    [contractId, tokenId, s.owner, s.creator, s.finalHash, s.mime,
     s.totalSize, s.totalChunks, s.sealed, s.tokenUri, s.migrationSource, Date.now()]
  );
  await syncTokenParents(env, contractId, tokenId, s.parents ?? []);
};

// Soft self-expiring lock TTL. Generous relative to a batch sync (which reads
// at most maxPerRun tokens) so a slow run doesn't release early, but short
// enough that a crashed run frees the lock quickly.
const SYNC_LOCK_TTL_MS = 120_000;

const sync = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, contractId: string, maxPerRun: number) => {
  // Acquire the stampede lock. Ensure a state row exists, then conditionally
  // claim the lock only if it is free or expired. If the UPDATE changes no rows,
  // another sync holds the lock — back off rather than duplicate the work.
  const now = Date.now();
  await run(
    env,
    `INSERT OR IGNORE INTO inscription_index_state
       (contract, minted_count, synced_count, updated_at, sync_lock_until)
     VALUES (?,0,0,0,0)`,
    [contractId]
  );
  const lockRes = await run(
    env,
    `UPDATE inscription_index_state SET sync_lock_until = ?
      WHERE contract = ? AND (sync_lock_until IS NULL OR sync_lock_until <= ?)`,
    [now + SYNC_LOCK_TTL_MS, contractId, now]
  );
  const acquired = Number((lockRes as { meta?: { changes?: number } })?.meta?.changes ?? 0) > 0;
  if (!acquired) {
    return { skipped: true as const };
  }

  try {
    return await runSync(env, apiBases, contract, contractId, maxPerRun);
  } finally {
    // Release the lock so the next sync can run immediately (don't wait for TTL).
    await run(
      env,
      'UPDATE inscription_index_state SET sync_lock_until = 0 WHERE contract = ?',
      [contractId]
    ).catch(() => undefined);
  }
};

const runSync = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, contractId: string, maxPerRun: number) => {
  const caps = await probeCaps(env, apiBases, contract);
  // total = number of enumerable entries. Sparse cores (v2/v3) enumerate the
  // minted-id list; dense cores (v1) enumerate ids 1..last-token-id.
  const total = caps.hasMintedList
    ? await readMintedCount(env, apiBases, contract)
    : await readLastTokenId(env, apiBases, contract);
  const { syncedCount } = await getState(env, contractId);
  const start = syncedCount;
  const end = Math.min(total, start + maxPerRun);
  let ingested = 0;
  for (let index = start; index < end; index += 1) {
    const tokenId = caps.hasMintedList
      ? await readMintedId(env, apiBases, contract, index)
      : index + 1; // dense 1-based ids
    if (tokenId === null) continue;
    const summary = await readToken(env, apiBases, contract, caps, tokenId);
    if (!summary) continue;
    await upsertToken(env, contractId, tokenId, summary);
    ingested += 1;
  }
  const newSynced = end;
  await run(
    env,
    `INSERT INTO inscription_index_state (contract, minted_count, synced_count, updated_at)
     VALUES (?,?,?,?)
     ON CONFLICT(contract) DO UPDATE SET minted_count=excluded.minted_count, synced_count=excluded.synced_count, updated_at=excluded.updated_at`,
    [contractId, total, newSynced, Date.now()]
  );
  const complete = newSynced >= total;

  // Rolling owner-refresh: once the backlog is ingested, re-read the least-
  // recently-refreshed rows so transfers and migrations (which change owner on
  // already-indexed tokens, e.g. the v2 side of a v2->v3 migration) self-heal
  // over traffic without any per-event trigger.
  let refreshed = 0;
  if (complete) {
    const window = Number((env as any).INSCRIPTION_INDEX_REFRESH_WINDOW) || 12;
    const stale = await queryAll(
      env,
      'SELECT token_id FROM inscription_index WHERE contract = ? ORDER BY updated_at ASC LIMIT ?',
      [contractId, window]
    );
    for (const row of (stale.results ?? []) as Array<{ token_id: number }>) {
      const summary = await readToken(env, apiBases, contract, caps, row.token_id);
      if (summary) { await upsertToken(env, contractId, row.token_id, summary); refreshed += 1; }
    }
  }

  return { mintedCount: total, syncedCount: newSynced, ingested, refreshed, complete };
};

// Re-read specific token ids on demand (targeted trigger, e.g. after a migration
// confirms). Returns how many were updated.
const refreshTokens = async (
  env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, contractId: string, ids: number[]
) => {
  const caps = await probeCaps(env, apiBases, contract);
  let refreshed = 0;
  for (const id of ids) {
    const summary = await readToken(env, apiBases, contract, caps, id);
    if (summary) { await upsertToken(env, contractId, id, summary); refreshed += 1; }
  }
  return { refreshed, ids };
};

export const onRequest = async (context: {
  request: Request;
  params: { contract?: string };
  env: RuntimeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, params, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const contractId = params.contract ?? '';
  const contract = parseRuntimeContractRef(contractId);
  if (!contract) return json({ error: 'Invalid contract id.' }, 400);
  const apiBases = getRuntimeApiBases('mainnet', env);
  if (apiBases.length === 0) return json({ error: 'No API base configured.' }, 503);

  try {
    if (request.method === 'POST') {
      // Targeted refresh: POST ...?id=14 or ?id=14,15,16 re-reads just those
      // tokens (instant accuracy after a migration/transfer). Otherwise: sync.
      const idParam = new URL(request.url).searchParams.get('id');
      if (idParam) {
        const ids = idParam.split(',').map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
        if (ids.length === 0) return json({ error: 'No valid id(s).' }, 400);
        const result = await refreshTokens(env, apiBases, contract, contractId, ids);
        return json({ ok: true, ...result });
      }
      const maxPerRun = Number((env as any).INSCRIPTION_INDEX_SYNC_BATCH) || 20;
      const result = await sync(env, apiBases, contract, contractId, maxPerRun);
      return json({ ok: true, ...result });
    }

    // GET: serve from D1. Either an explicit id set (?ids=1,2,3 — used by grids
    // to fetch exactly the visible page) or a range (?from=&limit=&order=).
    const url = new URL(request.url);
    const cols = 'token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, token_uri, migration_source';

    // Parse + normalize the query first so equivalent requests (e.g. the same
    // ids in a different order, or with duplicates) collapse to one edge-cache
    // entry. The normalized form is also what we key the Cloudflare Cache API on.
    const idsParam = url.searchParams.get('ids');
    let parsedIds: number[] | null = null;
    let from = 1;
    let limit = 16;
    let order: 'ASC' | 'DESC' = 'ASC';
    if (idsParam) {
      const ids = idsParam.split(',').map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
      if (ids.length === 0) return json({ error: 'No valid ids.' }, 400);
      parsedIds = Array.from(new Set(ids)).sort((a, b) => a - b);
    } else {
      from = Math.max(1, Number(url.searchParams.get('from') || '1'));
      limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '16')));
      order = (url.searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    }

    // Edge cache: a hot page (page 1 of a popular gallery) is served from the
    // Cloudflare edge with zero Worker D1 work. Short s-maxage + SWR keeps it
    // fresh — owner/migration changes already self-heal via the rolling sync, so
    // a brief staleness window is acceptable and the SWR revalidation is silent.
    const cacheKeyUrl = new URL(url.origin + url.pathname);
    if (parsedIds) {
      cacheKeyUrl.searchParams.set('ids', parsedIds.join(','));
    } else {
      cacheKeyUrl.searchParams.set('from', String(from));
      cacheKeyUrl.searchParams.set('limit', String(limit));
      cacheKeyUrl.searchParams.set('order', order);
    }
    const edgeCache = (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null;
    const cacheRequest = new Request(cacheKeyUrl.toString(), { method: 'GET' });
    if (edgeCache) {
      const hit = await edgeCache.match(cacheRequest);
      if (hit) return hit;
    }

    let rows;
    if (parsedIds) {
      rows = await queryAll(
        env,
        `SELECT ${cols} FROM inscription_index
          WHERE contract = ? AND token_id IN (${parsedIds.map(() => '?').join(',')})`,
        [contractId, ...parsedIds]
      );
    } else {
      rows = await queryAll(
        env,
        `SELECT ${cols} FROM inscription_index
          WHERE contract = ? AND token_id >= ?
          ORDER BY token_id ${order} LIMIT ?`,
        [contractId, from, limit]
      );
    }
    const state = await getState(env, contractId);

    // Lazily keep the index fresh: kick a throttled background sync when behind
    // or stale, so the backlog fills over successive page views and new mints
    // are picked up — without a separate scheduler (Pages has no cron).
    if (context.waitUntil) {
      const stale = await queryAll(env, 'SELECT updated_at FROM inscription_index_state WHERE contract = ?', [contractId]);
      const updatedAt = ((stale.results ?? [])[0] as { updated_at?: number } | undefined)?.updated_at ?? 0;
      const behind = state.syncedCount < state.mintedCount;
      if (behind || Date.now() - updatedAt > 60_000) {
        const maxPerRun = Number((env as any).INSCRIPTION_INDEX_SYNC_BATCH) || 20;
        context.waitUntil(sync(env, apiBases, contract, contractId, maxPerRun).catch(() => undefined));
      }
    }

    const payload = {
      contract: contractId,
      mintedCount: state.mintedCount,
      syncedCount: state.syncedCount,
      tokens: (rows.results ?? []).map((r: any) => ({
        id: r.token_id,
        owner: r.owner,
        creator: r.creator,
        finalHash: r.final_hash,
        mime: r.mime,
        totalSize: r.total_size,
        totalChunks: r.total_chunks,
        sealed: r.sealed === 1,
        tokenUri: r.token_uri ?? null,
        migrationSource: r.migration_source
      }))
    };
    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // max-age: brief browser cache. s-maxage: edge TTL. SWR: serve stale
        // instantly while a background revalidation refreshes the entry.
        'Cache-Control': 'public, max-age=15, s-maxage=60, stale-while-revalidate=300',
        ...CORS
      }
    });
    if (edgeCache && context.waitUntil) {
      // Store under the normalized key; clone so the body stream stays readable
      // for the response we return now.
      context.waitUntil(edgeCache.put(cacheRequest, response.clone()));
    }
    return response;
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

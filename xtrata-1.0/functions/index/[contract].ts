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
    })()
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
    migrationSource: null as string | null
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
  tokenUri: string | null; migrationSource: string | null;
};
type Caps = { hasMintedList: boolean; hasSummary: boolean };

const readToken = (
  env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, caps: Caps, id: number
): Promise<IndexSummary | null> =>
  caps.hasSummary
    ? readSummary(env, apiBases, contract, id)
    : readMetaSummary(env, apiBases, contract, id);

const upsertToken = (env: RuntimeEnv, contractId: string, tokenId: number, s: IndexSummary) =>
  run(
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

const sync = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, contractId: string, maxPerRun: number) => {
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
    const idsParam = url.searchParams.get('ids');
    let rows;
    if (idsParam) {
      const ids = idsParam.split(',').map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
      if (ids.length === 0) return json({ error: 'No valid ids.' }, 400);
      rows = await queryAll(
        env,
        `SELECT ${cols} FROM inscription_index
          WHERE contract = ? AND token_id IN (${ids.map(() => '?').join(',')})`,
        [contractId, ...ids]
      );
    } else {
      const from = Math.max(1, Number(url.searchParams.get('from') || '1'));
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '16')));
      const order = (url.searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
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

    return json({
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
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

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

const readMintedCount = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef) => {
  const cv = await callRuntimeReadOnly({
    env, apiBases, contract,
    functionName: 'get-minted-count', functionArgs: [], senderAddress: contract.address
  });
  // (ok uint): cvToJSON -> { value: { value: "56" } } — unwrap twice.
  return Number(unwrap(unwrap(cvToJSON(cv))));
};

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
    migrationSource: (() => {
      const ms = fields['migration-source'];
      const v = ms ? unwrap(unwrap(ms)) : null;
      return v ? asString(v) : null;
    })()
  };
};

const getState = async (env: RuntimeEnv, contractId: string) => {
  const res = await queryAll(env, 'SELECT minted_count, synced_count FROM inscription_index_state WHERE contract = ?', [contractId]);
  const row = (res.results ?? [])[0] as { minted_count?: number; synced_count?: number } | undefined;
  return { mintedCount: row?.minted_count ?? 0, syncedCount: row?.synced_count ?? 0 };
};

const sync = async (env: RuntimeEnv, apiBases: string[], contract: RuntimeContractRef, contractId: string, maxPerRun: number) => {
  const mintedCount = await readMintedCount(env, apiBases, contract);
  const { syncedCount } = await getState(env, contractId);
  const start = syncedCount;
  const end = Math.min(mintedCount, start + maxPerRun);
  let ingested = 0;
  for (let index = start; index < end; index += 1) {
    const tokenId = await readMintedId(env, apiBases, contract, index);
    if (tokenId === null) continue;
    const summary = await readSummary(env, apiBases, contract, tokenId);
    if (!summary) continue;
    await run(
      env,
      `INSERT INTO inscription_index
         (contract, token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, migration_source, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(contract, token_id) DO UPDATE SET
         owner=excluded.owner, creator=excluded.creator, final_hash=excluded.final_hash,
         mime=excluded.mime, total_size=excluded.total_size, total_chunks=excluded.total_chunks,
         sealed=excluded.sealed, migration_source=excluded.migration_source, updated_at=excluded.updated_at`,
      [contractId, tokenId, summary.owner, summary.creator, summary.finalHash, summary.mime,
       summary.totalSize, summary.totalChunks, summary.sealed, summary.migrationSource, Date.now()]
    );
    ingested += 1;
  }
  const newSynced = start + (end - start);
  await run(
    env,
    `INSERT INTO inscription_index_state (contract, minted_count, synced_count, updated_at)
     VALUES (?,?,?,?)
     ON CONFLICT(contract) DO UPDATE SET minted_count=excluded.minted_count, synced_count=excluded.synced_count, updated_at=excluded.updated_at`,
    [contractId, mintedCount, newSynced, Date.now()]
  );
  return { mintedCount, syncedCount: newSynced, ingested, complete: newSynced >= mintedCount };
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
      const maxPerRun = Number((env as any).INSCRIPTION_INDEX_SYNC_BATCH) || 20;
      const result = await sync(env, apiBases, contract, contractId, maxPerRun);
      return json({ ok: true, ...result });
    }

    // GET: serve a page from D1.
    const url = new URL(request.url);
    const from = Math.max(1, Number(url.searchParams.get('from') || '1'));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '16')));
    const order = (url.searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const rows = await queryAll(
      env,
      `SELECT token_id, owner, creator, final_hash, mime, total_size, total_chunks, sealed, migration_source
         FROM inscription_index
        WHERE contract = ? AND token_id >= ?
        ORDER BY token_id ${order}
        LIMIT ?`,
      [contractId, from, limit]
    );
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
        migrationSource: r.migration_source
      }))
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

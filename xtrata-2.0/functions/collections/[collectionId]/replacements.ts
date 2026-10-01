import { jsonResponse, badRequest, notFound, serverError } from '../../lib/utils';
import { queryAll, type Env } from '../../lib/db';
import { authorizeCreator, denyPrivateRead } from '../../lib/creator-auth';
import { boundedBody } from '../../lib/collection-storage/uploads';
import {
  cancelReplacement,
  finishReplacement,
  getReplacementStatus,
  makeReplacementChain,
  recordReplacementTx,
  ReplacementError,
  resolveReplacementTarget,
  startReplacement,
  uploadReplacement,
  type ReplacementChain
} from '../../lib/collection-replacement';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/**
 * Replace unminted files in a published, paused collection.
 *   GET                         → { record, chain, plan, activeFileCount } (fresh chain read)
 *   POST { action: 'start', assetIds }
 *   PUT  ?assetId=…  (file bytes) → upload one replacement file
 *   POST { action: 'record-tx', kind: 'register' | 'clear', txId }
 *   POST { action: 'finish' }     → swaps the files once the chain confirms
 *   POST { action: 'cancel' }     → only before anything changed on-chain
 * Writes require the collection's creator (or an Xtrata admin).
 */
export const onRequest: PagesFunction = async ({ request, env, params }) => {
  const collectionId = String(params?.collectionId ?? '').trim();
  if (!collectionId) return badRequest('Collection id missing.');
  try {
    const collection = ((await queryAll(env as Env, 'SELECT * FROM collections WHERE id = ? LIMIT 1', [collectionId])).results ?? [])[0] as
      | Record<string, unknown>
      | undefined;
    if (!collection) return notFound('Collection not found.');
    const chain = (): ReplacementChain => makeReplacementChain(env as Env, resolveReplacementTarget(env as Env, collection));

    if (request.method === 'GET') {
      const denied = await denyPrivateRead(request, env as Env, collection);
      if (denied) return denied;
      return jsonResponse(await getReplacementStatus(env as Env, collectionId, chain()), 200, NO_STORE);
    }

    const decision = await authorizeCreator(request, env as Env, { action: 'replace-asset', collection });
    if (!decision.allowed) return decision.response!;

    if (request.method === 'PUT') {
      const assetId = new URL(request.url).searchParams.get('assetId')?.trim() ?? '';
      if (!assetId) return badRequest('assetId is required.');
      const bytes = await boundedBody(request);
      return jsonResponse(await uploadReplacement({
        env: env as Env, collectionId, chain: chain(), assetId, bytes, contentType: request.headers.get('content-type')
      }), 200, NO_STORE);
    }

    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, NO_STORE);
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const action = String(body?.action ?? '');
    if (action === 'start') {
      const assetIds = Array.isArray(body?.assetIds) ? body!.assetIds.map(String) : [];
      return jsonResponse(await startReplacement({ env: env as Env, collectionId, chain: chain(), assetIds, actor: decision.address }), 200, NO_STORE);
    }
    if (action === 'record-tx') {
      const record = await recordReplacementTx({ env: env as Env, collectionId, kind: String(body?.kind ?? ''), txId: String(body?.txId ?? '') });
      return jsonResponse({ record }, 200, NO_STORE);
    }
    if (action === 'finish') return jsonResponse(await finishReplacement({ env: env as Env, collectionId, chain: chain() }), 200, NO_STORE);
    if (action === 'cancel') return jsonResponse(await cancelReplacement({ env: env as Env, collectionId, chain: chain() }), 200, NO_STORE);
    return badRequest('Unknown action.');
  } catch (error) {
    if (error instanceof ReplacementError) return jsonResponse({ error: error.message }, error.status, NO_STORE);
    if (error instanceof Error && /Upload exceeds|body missing/i.test(error.message)) return badRequest(error.message);
    return serverError(error instanceof Error ? error.message : 'File replacement failed.');
  }
};

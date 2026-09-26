import { jsonResponse, badRequest, notFound, serverError } from '../../lib/utils';
import { queryAll, run } from '../../lib/db';
import { parseCollectionMetadata } from '../../lib/collections';
import { authorizeCreator, denyPrivateRead } from '../../lib/creator-auth';
import {
  DRAFT_EXTENSION_MS,
  extendDraftAssets,
  isCollectionCommitted,
  MAX_DRAFT_EXTENSIONS,
  readExtensionsUsed,
  summarizeDraftRetention
} from '../../lib/asset-retention';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/**
 * Temporary-file retention for a collection draft.
 *   GET  → { committed, earliestExpiry, expiringWithin24h, extensionsUsed, extensionsLeft, extensionDays }
 *   POST → "Keep my files": one 14-day extension per unpublished, undeployed draft.
 */
export const onRequest: PagesFunction = async ({ request, env, params }) => {
  const collectionId = String(params?.collectionId ?? '').trim();
  if (!collectionId) return badRequest('Collection id missing.');
  try {
    const row = ((await queryAll(env, 'SELECT id, state, contract_address, artist_address, metadata FROM collections WHERE id = ?', [collectionId])).results ?? [])[0] as
      | Record<string, unknown>
      | undefined;
    if (!row) return notFound('Collection not found.');
    const metadata = parseCollectionMetadata(row.metadata);
    const summaryOf = () => summarizeDraftRetention(env, collectionId, { ...row, metadata });
    const extensionDays = Math.round(DRAFT_EXTENSION_MS / 86400000);
    if (request.method === 'GET') {
      const denied = await denyPrivateRead(request, env, row);
      if (denied) return denied;
      return jsonResponse({ ...(await summaryOf()), extensionDays }, 200, NO_STORE);
    }
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, NO_STORE);
    const decision = await authorizeCreator(request, env, { action: 'extend-files', collection: row });
    if (!decision.allowed) return decision.response!;
    if (isCollectionCommitted(row)) return badRequest('This collection is deployed or published, so its files are already kept until minted.');
    const used = readExtensionsUsed(metadata);
    if (used >= MAX_DRAFT_EXTENSIONS) return badRequest('This draft has already used its one extension. Deploy your contract to keep the files until minted.');
    const now = Date.now();
    const until = await extendDraftAssets(env, collectionId, now);
    const nextMetadata = { ...(metadata ?? {}), assetRetention: { extensions: used + 1, lastExtendedAt: now, extendedUntil: until } };
    await run(env, 'UPDATE collections SET metadata = ?, updated_at = ? WHERE id = ?', [JSON.stringify(nextMetadata), now, collectionId]);
    return jsonResponse({ ...(await summarizeDraftRetention(env, collectionId, { ...row, metadata: nextMetadata }, now)), extendedUntil: until, extensionDays }, 200, NO_STORE);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Retention update failed.');
  }
};

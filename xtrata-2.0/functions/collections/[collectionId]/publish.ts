import { jsonResponse, badRequest, serverError } from '../../lib/utils';
import { run } from '../../lib/db';
import { getCollectionDeployReadiness } from '../../lib/collection-deploy';
import { retainCommittedAssets } from '../../lib/asset-retention';
import { authorizeCreator } from '../../lib/creator-auth';
import { readOnlyUint } from '../../lib/hiro-read';
import { queryAll } from '../../lib/db';
import {
  collectInventoryHashes,
  computeInventoryDigest,
  isInventoryRegistrationCurrent,
  parseInventoryRegistrationRecord
} from '../../../src/manage/lib/inventory-registration';

/** Helpers that mint only registered files and have a set-once max supply. */
const usesRegisteredInventory = (templateVersion: unknown) =>
  /^xtrata-collection-mint-v1[.-][5-9]$/.test(String(templateVersion ?? '').trim());

const contractIdOf = (collection: Record<string, unknown>, metadata: Record<string, unknown> | null) => {
  const raw = String(collection.contract_address ?? '').trim();
  if (raw.includes('.')) return raw;
  const name = String(metadata?.contractName ?? '').trim();
  return raw && name ? `${raw}.${name}` : null;
};

/** Launch checks the server can verify itself; returns a message when not ready. */
export async function standardLaunchBlocker(
  env: Parameters<typeof queryAll>[0],
  collectionId: string,
  collection: Record<string, unknown>,
  metadata: Record<string, unknown> | null,
  fetcher?: typeof fetch
): Promise<string | null> {
  if (!usesRegisteredInventory(metadata?.templateVersion)) return null;
  const contractId = contractIdOf(collection, metadata);
  if (!contractId) return 'Your contract is not linked to this collection yet.';
  const assets = (await queryAll(env, 'SELECT expected_hash, state FROM assets WHERE collection_id = ?', [collectionId])).results ?? [];
  const hashes = collectInventoryHashes(assets as Array<{ expected_hash?: unknown; state?: unknown }>);
  if (!hashes) return 'Some files have no verified fingerprint. Re-check your uploads.';
  const current = isInventoryRegistrationCurrent({
    record: parseInventoryRegistrationRecord(metadata),
    contractId,
    hashCount: hashes.length,
    digest: hashes.length ? await computeInventoryDigest(hashes) : null
  });
  if (!current) return 'Register every uploaded file on your contract (Prepare contract), then publish.';
  const supply = await readOnlyUint(env, contractId, 'get-max-supply', fetcher);
  if (!supply.ok) return 'Could not read your contract right now, so nothing was published. Try again in a moment.';
  if (supply.value === 0n) return 'Set max supply in Mint rules before publishing.';
  return null;
}

const parseMetadata = (raw: unknown): Record<string, unknown> | null => {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'object') {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
};

export const onRequest: PagesFunction = async ({ request, env, params }) => {
  const collectionId = params?.collectionId;
  if (!collectionId) {
    return badRequest('Collection id missing.');
  }

  if (request.method === 'POST') {
    try {
      const owner = ((await queryAll(env, 'SELECT id, artist_address FROM collections WHERE id = ?', [collectionId])).results ?? [])[0];
      const decision = await authorizeCreator(request, env, {
        action: 'publish', collection: (owner as Record<string, unknown> | undefined) ?? { id: collectionId, artist_address: null }
      });
      if (!decision.allowed) return decision.response!;
      const payload = (await request.json()) as Record<string, unknown>;
      const target = payload.state === 'published' ? 'published' : 'draft';

      if (target === 'published') {
        const readiness = await getCollectionDeployReadiness({
          env,
          collectionId
        });
        if (!readiness.ready || !readiness.collection) {
          return badRequest(readiness.reason);
        }
        const collection = readiness.collection;

        const metadata = readiness.metadata ?? parseMetadata(collection.metadata);
        const mintType =
          typeof metadata?.mintType === 'string' ? metadata.mintType : 'standard';
        if (mintType !== 'pre-inscribed') {
          const blocker = await standardLaunchBlocker(env, String(collectionId), collection, metadata);
          if (blocker) return badRequest(blocker);
        }

        // Publishing commits the inventory: keep every still-live file until minted.
        await retainCommittedAssets(env, String(collectionId));

        const assetsCountResult = await env.DB
          .prepare(
            'SELECT COUNT(*) as total FROM assets WHERE collection_id = ? AND state NOT IN (?, ?)'
          )
          .bind(collectionId, 'expired', 'sold-out')
          .all();
        const activeAssets = Number(assetsCountResult.results?.[0]?.total ?? 0);

        if (mintType !== 'pre-inscribed' && activeAssets <= 0) {
          return badRequest(
            'Upload at least one artwork file before publishing. Files that expired before deployment must be uploaded again.'
          );
        }
      }

      await run(env,
        'UPDATE collections SET state = ?, updated_at = ? WHERE id = ?',
        [target, Date.now(), collectionId]
      );
      const select = await env.DB
        .prepare('SELECT * FROM collections WHERE id = ?')
        .bind(collectionId)
        .all();
      const record = (select.results ?? [])[0];
      return jsonResponse(record);
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'Failed to update state');
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};

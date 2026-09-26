import type { Env } from './db';
import { queryAll, run } from './db';

/**
 * Staged collection files are temporary: an unpublished draft's files expire
 * (default 3 days) so abandoned uploads don't pile up. Once a collection is
 * committed — its contract is deployed or its page is published — its files are
 * the inventory collectors mint from and must never expire.
 *
 * Before 2026-09-26 the expiry sweep only skipped published collections that
 * were also listed on the public page, so hidden live collections (Numbers 1–10
 * among them) lost their whole inventory three days after upload.
 */
export const DEFAULT_ASSET_TTL_MS = 3 * 24 * 60 * 60 * 1000;
export const DRAFT_EXTENSION_MS = 14 * 24 * 60 * 60 * 1000;
export const MAX_DRAFT_EXTENSIONS = 1;

export type CollectionRetentionRow = {
  state?: unknown;
  contract_address?: unknown;
};

export const isCollectionCommitted = (row: CollectionRetentionRow | null | undefined) => {
  if (!row) return false;
  const state = String(row.state ?? '').trim().toLowerCase();
  const contract = String(row.contract_address ?? '').trim();
  return state === 'published' || contract.length > 0;
};

export const resolveAssetTtlMs = (env: Env) => {
  const configured = Number(env.COLLECTION_ASSET_TTL_MS ?? DEFAULT_ASSET_TTL_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_ASSET_TTL_MS;
};

/** Marks past-due draft files expired — only for collections that are not committed. */
export async function sweepExpiredDraftAssets(
  env: Env,
  collectionId: string,
  row: CollectionRetentionRow | null | undefined,
  now = Date.now()
) {
  if (isCollectionCommitted(row)) return false;
  await run(
    env,
    'UPDATE assets SET state = ? WHERE collection_id = ? AND expires_at IS NOT NULL AND expires_at < ? AND state = ?',
    ['expired', collectionId, now, 'draft']
  );
  return true;
}

/**
 * Keep every file of a committed collection that is still in inventory (state
 * `draft`) until it is minted, including ones whose old expiry has passed but
 * which were never swept. Rows already marked `expired` are left alone;
 * restoring those is an explicit, reviewed operation (see restore-expired).
 */
export async function retainCommittedAssets(env: Env, collectionId: string, now = Date.now()) {
  await run(
    env,
    'UPDATE assets SET expires_at = NULL, updated_at = ? WHERE collection_id = ? AND state = ? AND expires_at IS NOT NULL',
    [now, collectionId, 'draft']
  );
}

export type DraftRetentionSummary = {
  committed: boolean;
  earliestExpiry: number | null;
  expiringWithin24h: number;
  extensionsUsed: number;
  extensionsLeft: number;
};

export const readExtensionsUsed = (metadata: Record<string, unknown> | null | undefined) => {
  const retention = metadata?.assetRetention;
  const used = retention && typeof retention === 'object'
    ? Number((retention as Record<string, unknown>).extensions ?? 0)
    : 0;
  return Number.isSafeInteger(used) && used > 0 ? used : 0;
};

export async function summarizeDraftRetention(
  env: Env,
  collectionId: string,
  row: CollectionRetentionRow & { metadata?: Record<string, unknown> | null },
  now = Date.now()
): Promise<DraftRetentionSummary> {
  const committed = isCollectionCommitted(row);
  const used = readExtensionsUsed(row.metadata ?? null);
  if (committed) {
    return { committed, earliestExpiry: null, expiringWithin24h: 0, extensionsUsed: used, extensionsLeft: 0 };
  }
  const result = await queryAll(
    env,
    `SELECT MIN(expires_at) AS earliest,
            SUM(CASE WHEN expires_at < ? THEN 1 ELSE 0 END) AS soon
       FROM assets WHERE collection_id = ? AND state = ? AND expires_at IS NOT NULL AND expires_at >= ?`,
    [now + 24 * 60 * 60 * 1000, collectionId, 'draft', now]
  );
  const summary = (result.results ?? [])[0] as Record<string, unknown> | undefined;
  const earliest = summary?.earliest == null ? null : Number(summary.earliest);
  return {
    committed,
    earliestExpiry: Number.isFinite(earliest) ? earliest : null,
    expiringWithin24h: Number(summary?.soon ?? 0),
    extensionsUsed: used,
    extensionsLeft: Math.max(0, MAX_DRAFT_EXTENSIONS - used)
  };
}

/** Pushes every live draft file's expiry out by DRAFT_EXTENSION_MS from now. */
export async function extendDraftAssets(env: Env, collectionId: string, now = Date.now()) {
  const until = now + DRAFT_EXTENSION_MS;
  await run(
    env,
    'UPDATE assets SET expires_at = ?, updated_at = ? WHERE collection_id = ? AND state = ? AND expires_at IS NOT NULL AND expires_at >= ? AND expires_at < ?',
    [until, now, collectionId, 'draft', now, until]
  );
  return until;
}

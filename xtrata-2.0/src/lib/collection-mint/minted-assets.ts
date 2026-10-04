/**
 * Fast "which files are minted" for the live collection page.
 *
 * The collection contract keeps its own append-only list of minted token ids.
 * Reading that list plus each token's final hash and matching the hashes to the
 * collection's files costs ~2 reads per MINTED token, instead of 1-3 reads (and a
 * file download) per FILE in the collection.
 *
 * Anything it cannot answer with certainty returns `fallback` so the caller keeps
 * using the slow, thorough scan. A failed read is never reported as "not minted".
 */

export type MintedAssetLike = { asset_id: string; expected_hash?: string | null };

const HASH_PATTERN = /^[0-9a-f]{64}$/;

export const normalizeHashHexValue = (value: string | null | undefined): string | null => {
  const trimmed = (value ?? '').trim().toLowerCase().replace(/^0x/, '');
  return HASH_PATTERN.test(trimmed) ? trimmed : null;
};

/** Run `worker` over `items` with at most `limit` in flight. Rejects on the first failure. */
export const runWithConcurrency = async <T>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<void>
): Promise<void> => {
  const queue = [...items];
  let failure: unknown = null;
  let failed = false;
  const lane = async () => {
    while (!failed) {
      const next = queue.shift();
      if (next === undefined) return;
      try {
        await worker(next);
      } catch (error) {
        failed = true;
        failure = error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, lane));
  if (failed) throw failure;
};

/** hash (hex) → asset id, from both the verified canonical hash and the staged expected hash. */
export const buildAssetHashIndex = (
  assets: readonly MintedAssetLike[],
  canonicalHashHexByAssetId: Readonly<Record<string, string>>
): Map<string, string> => {
  const index = new Map<string, string>();
  for (const asset of assets) {
    const canonical = normalizeHashHexValue(canonicalHashHexByAssetId[asset.asset_id]);
    const expected = normalizeHashHexValue(asset.expected_hash);
    if (canonical) index.set(canonical, asset.asset_id);
    if (expected && !index.has(expected)) index.set(expected, asset.asset_id);
  }
  return index;
};

export type FastMintedResult =
  | { status: 'ok'; mintedTokenIds: Record<string, string> }
  | { status: 'fallback'; reason: string; mintedTokenIds: Record<string, string> };

export type FastMintedInput = {
  /** The contract's minted count. */
  mintedCount: number;
  assets: readonly MintedAssetLike[];
  canonicalHashHexByAssetId: Readonly<Record<string, string>>;
  /** Global token ids (decimal strings) at minted indexes [0, count). null = unreadable entry. */
  readTokenIds: (count: number) => Promise<Array<string | null>>;
  /** Final hash (hex) of a token. Throws if the read fails. */
  readTokenHash: (tokenId: string) => Promise<string | null>;
  concurrency?: number;
};

export const resolveMintedAssetsFast = async (input: FastMintedInput): Promise<FastMintedResult> => {
  const empty: Record<string, string> = {};
  if (!Number.isSafeInteger(input.mintedCount) || input.mintedCount < 0) {
    return { status: 'fallback', reason: 'Minted count unavailable.', mintedTokenIds: empty };
  }
  if (input.mintedCount === 0) return { status: 'ok', mintedTokenIds: empty };

  let tokenIds: Array<string | null>;
  try {
    tokenIds = await input.readTokenIds(input.mintedCount);
  } catch (error) {
    return { status: 'fallback', reason: `Minted list unreadable: ${String(error)}`, mintedTokenIds: empty };
  }
  if (tokenIds.length !== input.mintedCount || tokenIds.some((id) => id === null)) {
    return { status: 'fallback', reason: 'Minted list incomplete.', mintedTokenIds: empty };
  }

  const hashByToken = new Map<string, string>();
  try {
    await runWithConcurrency(tokenIds as string[], input.concurrency ?? 6, async (tokenId) => {
      const hash = normalizeHashHexValue(await input.readTokenHash(tokenId));
      if (hash) hashByToken.set(tokenId, hash);
    });
  } catch (error) {
    return { status: 'fallback', reason: `Token hash unreadable: ${String(error)}`, mintedTokenIds: empty };
  }

  const assetByHash = buildAssetHashIndex(input.assets, input.canonicalHashHexByAssetId);
  const matched: Record<string, string> = {};
  for (const tokenId of tokenIds as string[]) {
    const hash = hashByToken.get(tokenId);
    const assetId = hash ? assetByHash.get(hash) : undefined;
    if (assetId && matched[assetId] === undefined) matched[assetId] = tokenId;
  }
  if (Object.keys(matched).length !== input.mintedCount) {
    // A minted token we cannot tie to a file (e.g. a legacy upload fingerprint): let the thorough scan decide.
    return { status: 'fallback', reason: 'Some minted tokens did not match a file hash.', mintedTokenIds: matched };
  }
  return { status: 'ok', mintedTokenIds: matched };
};

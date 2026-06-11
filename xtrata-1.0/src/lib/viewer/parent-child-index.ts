import { isReadOnlyBackoffActive } from '../contract/read-only';
import type { XtrataClient } from '../contract/client';
import {
  loadRelationshipChildren,
  loadRelationshipSyncCursor,
  saveRelationshipChildDependencies,
  saveRelationshipSyncCursor
} from './relationship-index';

// The v3.2.3 core exposes two distinct relationship edges: `get-parents`
// (owned-parent links surfaced by the "Add Parents" panel) and
// `get-dependencies` (recursive content deps). There is no on-chain
// `get-children` reader, so child navigation is derived by walking every
// minted inscription's parent list and persisting the reverse edge.
//
// We reuse the generic adjacency storage in relationship-index.ts but under a
// dedicated namespace so the parents reverse-index never collides with the
// (separately maintained) dependencies index that module also serves. The
// namespace is folded into the contractId the storage layer keys on.
export const PARENT_CHILD_NAMESPACE_SUFFIX = '#parents';

export const parentChildNamespace = (contractId: string) =>
  `${contractId}${PARENT_CHILD_NAMESPACE_SUFFIX}`;

export type ChildIndexProgress = {
  scanned: bigint;
  total: bigint;
  found: bigint;
  currentId: bigint;
};

export type ChildIndexResult = {
  scanned: bigint;
  total: bigint;
  found: bigint;
  cancelled: boolean;
  nextMintedIndex: bigint;
  mintedCount: bigint;
};

// How many ids we ingest between cursor flushes, so an interrupted scan
// resumes near where it stopped instead of restarting the contract.
const CURSOR_FLUSH_INTERVAL = 20n;

// Read the children of `parentId` from the persisted reverse index. Returns
// only what has been indexed so far (empty until a scan has covered the
// children that reference this parent).
export const loadIndexedChildren = (params: {
  contractId: string;
  parentId: bigint;
}): Promise<bigint[]> =>
  loadRelationshipChildren({
    contractId: parentChildNamespace(params.contractId),
    parentId: params.parentId
  });

// The minted-index position the next scan will resume from for this contract.
export const loadChildIndexCursor = (contractId: string): Promise<bigint> =>
  loadRelationshipSyncCursor(parentChildNamespace(contractId));

// Persist (childId -> parentIds) and its reverse links for a single token.
// Used both by the full scan and opportunistically when the selected
// inscription's parents are fetched for display.
export const recordChildParents = (params: {
  contractId: string;
  childId: bigint;
  parentIds: bigint[];
}): Promise<void> =>
  saveRelationshipChildDependencies({
    contractId: parentChildNamespace(params.contractId),
    childId: params.childId,
    parentIds: params.parentIds
  });

// Walk the contract's minted-id list, reading each token's on-chain parents
// and writing the reverse (parent -> child) edge to IndexedDB. Resumable via
// the persisted cursor, cancellable, and progress-reporting so the UI can show
// a live count. When `parentId` is provided, `found` counts children of that
// specific parent (so the caller can refresh a single token's view), but the
// scan always indexes every token it visits.
export const syncChildIndex = async (params: {
  client: XtrataClient;
  contractId: string;
  senderAddress: string;
  parentId?: bigint;
  shouldCancel?: () => boolean;
  onProgress?: (progress: ChildIndexProgress) => void;
}): Promise<ChildIndexResult> => {
  if (isReadOnlyBackoffActive()) {
    throw new Error('Read-only backoff active');
  }
  if (!params.client.supportsMintedIndex) {
    throw new Error(
      'Child indexing requires xtrata-v2.1.0+ tokens. Migrate v1 inscriptions to v2.'
    );
  }

  const namespace = parentChildNamespace(params.contractId);
  const shouldCancel = params.shouldCancel ?? (() => false);
  let nextMintedIndex = await loadRelationshipSyncCursor(namespace);
  const mintedCount = await params.client.getMintedCount(params.senderAddress);
  if (nextMintedIndex > mintedCount) {
    nextMintedIndex = mintedCount;
  }
  // A child can only reference a parent minted before it, so ids at or below
  // the focused parent can never be its children — skip them when scanning for
  // a specific parent's children.
  const minChildTokenId =
    params.parentId !== undefined ? params.parentId + 1n : null;
  const startIndex = nextMintedIndex;
  const total = mintedCount - startIndex;
  let scanned = 0n;
  let found = 0n;
  let cancelled = false;

  const flushCursor = async () => {
    if ((nextMintedIndex - startIndex) % CURSOR_FLUSH_INTERVAL === 0n) {
      await saveRelationshipSyncCursor({
        contractId: namespace,
        nextMintedIndex
      });
    }
  };

  for (let index = startIndex; index < mintedCount; index += 1n) {
    if (shouldCancel()) {
      cancelled = true;
      nextMintedIndex = index;
      break;
    }
    if (isReadOnlyBackoffActive()) {
      throw new Error('Read-only backoff active');
    }
    const tokenId = await params.client.getMintedId(index, params.senderAddress);
    nextMintedIndex = index + 1n;
    scanned += 1n;

    if (tokenId === null) {
      params.onProgress?.({ scanned, total, found, currentId: 0n });
      await flushCursor();
      continue;
    }
    if (minChildTokenId !== null && tokenId < minChildTokenId) {
      params.onProgress?.({ scanned, total, found, currentId: tokenId });
      await flushCursor();
      continue;
    }

    const parents = await params.client.getParents(tokenId, params.senderAddress);
    await saveRelationshipChildDependencies({
      contractId: namespace,
      childId: tokenId,
      parentIds: parents
    });
    if (
      params.parentId !== undefined &&
      parents.some((id) => id === params.parentId)
    ) {
      found += 1n;
    }
    params.onProgress?.({ scanned, total, found, currentId: tokenId });
    await flushCursor();
  }

  await saveRelationshipSyncCursor({
    contractId: namespace,
    nextMintedIndex
  });

  return { scanned, total, found, cancelled, nextMintedIndex, mintedCount };
};

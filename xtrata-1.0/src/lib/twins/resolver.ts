import {
  FOREVER_TWIN_COLLECTIONS,
  getCollectionByHelperId,
  getCollectionsForMaster,
  type ForeverTwinCollection
} from './registry';
import {
  callReadOnly,
  fetchContractPrintEvents,
  tupleBool,
  tuplePrincipal,
  tupleUint,
  unwrapOwnerResult,
  unwrapTuple,
  uintArg
} from './hiro';

/**
 * Forever Twin resolution.
 *
 * The helper contract exposes `get-binding (local-token-id)` and emits an
 * `inscribed` print event carrying both the local token id and the minted
 * Xtrata id. There is no on-chain reverse lookup (xtrata-id -> local id), so we
 * build a cached reverse index per collection from those print events, then
 * confirm the live binding with `get-binding`.
 */

export type TwinBinding = {
  collection: ForeverTwinCollection;
  /** Original collection token number, e.g. Bitcoin Pepe #44 -> 44n. */
  localTokenId: bigint;
  /** Xtrata inscription id of the twin. */
  xtrataId: bigint;
  /** True when the Xtrata twin is currently held by the helper (escrowed). */
  xtrataEscrowed: boolean;
};

export type TwinOwnership = TwinBinding & {
  /**
   * Address to display as the effective owner:
   *  - escrowed: the current holder of the original collection NFT;
   *  - not escrowed: the current Xtrata token owner.
   */
  effectiveOwner: string | null;
  /** Raw on-chain owner of the Xtrata token (the helper, when escrowed). */
  rawOwner: string | null;
  /** Whether the twin is escrowed (Xtrata held by helper). */
  escrowed: boolean;
};

type ReverseIndex = Map<string, bigint>; // xtrataId -> localTokenId

const reverseIndexCache = new Map<string, Promise<ReverseIndex>>();

const xtrataKey = (xtrataId: bigint): string => xtrataId.toString();

/**
 * Build (and cache) the xtrata-id -> local-id index for a collection by
 * scanning the helper's `inscribed` print events. Cached for the session;
 * call `clearTwinCaches` to force a rebuild.
 */
export const buildReverseIndex = (
  collection: ForeverTwinCollection
): Promise<ReverseIndex> => {
  const cached = reverseIndexCache.get(collection.key);
  if (cached) {
    return cached;
  }
  const promise = (async (): Promise<ReverseIndex> => {
    const index: ReverseIndex = new Map();
    for await (const print of fetchContractPrintEvents({
      contractId: collection.helperContractId,
      network: collection.network
    })) {
      const event = print as Record<string, { type: string; value: unknown }>;
      const eventName = event.event?.value;
      if (eventName !== 'inscribed') {
        continue;
      }
      const localId = tupleUint(event, 'token-id');
      const xtrataId = tupleUint(event, 'xtrata-id');
      if (localId === null || xtrataId === null) {
        continue;
      }
      // Earliest binding wins; an id is only inscribed once.
      const key = xtrataKey(xtrataId);
      if (!index.has(key)) {
        index.set(key, localId);
      }
    }
    return index;
  })();
  reverseIndexCache.set(collection.key, promise);
  promise.catch(() => reverseIndexCache.delete(collection.key));
  return promise;
};

/** Read the live binding for a local token id from the helper contract. */
export const getBinding = async (
  collection: ForeverTwinCollection,
  localTokenId: bigint
): Promise<TwinBinding | null> => {
  const json = await callReadOnly({
    contractId: collection.helperContractId,
    functionName: 'get-binding',
    args: [uintArg(localTokenId)],
    network: collection.network
  });
  const tuple = unwrapTuple(json);
  if (!tuple) {
    return null;
  }
  const xtrataId = tupleUint(tuple, 'xtrata-id');
  if (xtrataId === null) {
    return null;
  }
  return {
    collection,
    localTokenId,
    xtrataId,
    xtrataEscrowed: tupleBool(tuple, 'xtrata-escrowed') ?? false
  };
};

/** Current owner of the original collection NFT (the real holder when escrowed). */
export const getSourceOwner = async (
  collection: ForeverTwinCollection,
  localTokenId: bigint
): Promise<string | null> => {
  const json = await callReadOnly({
    contractId: collection.sourceContractId,
    functionName: 'get-owner',
    args: [uintArg(localTokenId)],
    network: collection.network
  });
  return unwrapOwnerResult(json);
};

const candidateCollections = (
  masterContractId?: string | null
): ForeverTwinCollection[] => {
  if (masterContractId) {
    const scoped = getCollectionsForMaster(masterContractId);
    if (scoped.length > 0) {
      return scoped;
    }
  }
  return [...FOREVER_TWIN_COLLECTIONS];
};

/**
 * Resolve the twin binding for a given Xtrata inscription id. Searches the
 * registered collections' reverse indexes, then confirms the live binding.
 * Returns null when the id is not a Forever Twin.
 */
export const resolveTwinByXtrataId = async (
  xtrataId: bigint,
  options?: { masterContractId?: string | null }
): Promise<TwinBinding | null> => {
  const key = xtrataKey(xtrataId);
  for (const collection of candidateCollections(options?.masterContractId)) {
    let index: ReverseIndex;
    try {
      index = await buildReverseIndex(collection);
    } catch {
      continue;
    }
    const localTokenId = index.get(key);
    if (localTokenId === undefined) {
      continue;
    }
    const binding = await getBinding(collection, localTokenId).catch(() => null);
    if (binding && binding.xtrataId === xtrataId) {
      return binding;
    }
    // Fall back to the indexed mapping if the live read fails.
    if (!binding) {
      return {
        collection,
        localTokenId,
        xtrataId,
        xtrataEscrowed: true
      };
    }
  }
  return null;
};

/**
 * High-level resolver for the viewer panels. Given the selected Xtrata token's
 * id and raw owner, returns escrow state, the effective owner to display, and
 * the local collection number + name. Returns null for non-twin tokens.
 *
 * Fast path: when `rawOwner` is a registered helper contract, the token is
 * escrowed and we know the collection immediately — we still resolve the local
 * id (from the reverse index) and the real holder (source get-owner).
 */
export const resolveTwinOwnership = async (params: {
  xtrataId: bigint;
  rawOwner: string | null;
  masterContractId?: string | null;
}): Promise<TwinOwnership | null> => {
  const helperCollection = getCollectionByHelperId(params.rawOwner);

  let binding: TwinBinding | null = null;
  if (helperCollection) {
    const index = await buildReverseIndex(helperCollection).catch(
      () => null as ReverseIndex | null
    );
    const localTokenId = index?.get(xtrataKey(params.xtrataId));
    if (localTokenId !== undefined) {
      binding =
        (await getBinding(helperCollection, localTokenId).catch(() => null)) ?? {
          collection: helperCollection,
          localTokenId,
          xtrataId: params.xtrataId,
          xtrataEscrowed: true
        };
    }
  }
  if (!binding) {
    binding = await resolveTwinByXtrataId(params.xtrataId, {
      masterContractId: params.masterContractId
    });
  }
  if (!binding) {
    return null;
  }

  // Escrowed when the raw owner is the helper, corroborated by the binding flag.
  const ownerIsHelper =
    getCollectionByHelperId(params.rawOwner)?.key === binding.collection.key;
  const escrowed = ownerIsHelper || binding.xtrataEscrowed;

  let effectiveOwner = params.rawOwner;
  if (escrowed) {
    effectiveOwner =
      (await getSourceOwner(binding.collection, binding.localTokenId).catch(
        () => null
      )) ?? params.rawOwner;
  }

  return {
    ...binding,
    escrowed,
    rawOwner: params.rawOwner,
    effectiveOwner
  };
};

/** Clear all in-memory twin caches (e.g. after a swap, for a fresh read). */
export const clearTwinCaches = (): void => {
  reverseIndexCache.clear();
};

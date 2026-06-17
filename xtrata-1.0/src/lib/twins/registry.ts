import type { NetworkType } from '../network/types';

/**
 * Forever Twin collection registry.
 *
 * Each entry describes one external NFT collection that has been ported into
 * Xtrata via a Forever Twin helper contract. The helper contract is the
 * on-chain twin index: it owns a `Bindings` map keyed by the *local* collection
 * token id (e.g. Bitcoin Pepe #44) whose value records the minted Xtrata
 * inscription id and whether the Xtrata twin is currently escrowed.
 *
 *   Bindings[localTokenId] = {
 *     xtrata-id,         ;; the Xtrata inscription id of the twin
 *     content-hash,
 *     inscriber,
 *     xtrata-escrowed,   ;; true => the Xtrata twin is held by the helper
 *     at,
 *   }
 *
 * Escrow model (per the helper contracts):
 *   - On `inscribe`, the Xtrata twin is minted to the helper => xtrata-escrowed = true.
 *     The original NFT stays with its holder.
 *   - `swap-pepe-for-xtrata`: holder deposits the original NFT, receives the
 *     Xtrata twin => xtrata-escrowed = false (the original is now escrowed).
 *   - `swap-xtrata-for-pepe`: holder deposits the Xtrata twin, receives the
 *     original back => xtrata-escrowed = true again.
 *
 * So when a Xtrata token's on-chain owner equals a helper contract id, the twin
 * is escrowed and the *real* owner is the current holder of the corresponding
 * original collection NFT (looked up via the source contract's `get-owner`).
 *
 * To add a new collection, append an entry here. No other code needs to change:
 * the resolver derives everything (local id, name, escrow state, real owner)
 * from these fields plus on-chain reads.
 */
export type ForeverTwinCollection = {
  /** Stable internal key, e.g. "bitcoin-pepes". */
  readonly key: string;
  /** Human-readable collection name shown in the UI, e.g. "Bitcoin Pepes". */
  readonly name: string;
  /** Singular noun for a single item label, e.g. "Bitcoin Pepe". */
  readonly itemNoun: string;
  /** Network the helper + source contracts live on. */
  readonly network: NetworkType;
  /** Xtrata master inscription contract the twins are minted into. */
  readonly masterContractId: string;
  /**
   * Forever Twin helper contract id. This is both the escrow holder and the
   * on-chain twin index (owns the Bindings map).
   */
  readonly helperContractId: string;
  /** Original collection contract id (the source NFT). */
  readonly sourceContractId: string;
  /** SIP-009 asset name defined inside the source contract. */
  readonly sourceAssetName: string;
  /**
   * Optional external claim/marketplace URL for the collection, used for
   * "view on …" affordances.
   */
  readonly claimUrl?: string;
};

const XTRATA_MASTER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

export const FOREVER_TWIN_COLLECTIONS: readonly ForeverTwinCollection[] = [
  {
    key: 'bitcoin-pepes',
    name: 'Bitcoin Pepes',
    itemNoun: 'Bitcoin Pepe',
    network: 'mainnet',
    masterContractId: XTRATA_MASTER,
    helperContractId: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun',
    sourceContractId: 'SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe',
    sourceAssetName: 'bitcoin-pepe',
    claimUrl:
      'https://fak.fun/SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun'
  },
  {
    key: 'leo-cats',
    name: 'LeoCats',
    itemNoun: 'LeoCat',
    network: 'mainnet',
    masterContractId: XTRATA_MASTER,
    helperContractId: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata',
    sourceContractId: 'SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats',
    sourceAssetName: 'leo-cats'
  }
];

/**
 * NFT custody contracts: when an original collection NFT is held by one of
 * these (e.g. listed on a marketplace), `get-owner` returns the custody
 * contract rather than a wallet. The resolver hops through to the real owner
 * using the named read-only function + field (e.g. marketplace `get-listing` →
 * `seller`). Add an entry to support a new marketplace/escrow custodian.
 */
export type NftCustodyResolver = {
  readonly contractId: string;
  readonly label: string;
  /** Read-only function taking the local token id, returning a tuple. */
  readonly functionName: string;
  /** Principal field on the returned tuple that holds the real owner. */
  readonly ownerField: string;
};

export const NFT_CUSTODY_RESOLVERS: readonly NftCustodyResolver[] = [
  {
    contractId: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace',
    label: 'pepe-nft-marketplace',
    functionName: 'get-listing',
    ownerField: 'seller'
  },
  {
    contractId: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-nft-market-faktory',
    label: 'leo-nft-market-faktory',
    functionName: 'get-listing',
    ownerField: 'seller'
  }
];

const CUSTODY_BY_ID = new Map<string, NftCustodyResolver>(
  NFT_CUSTODY_RESOLVERS.map((entry) => [entry.contractId, entry])
);

const normalizePrincipal = (value: string | null | undefined): string =>
  (value ?? '').trim();

/** Look up a custody resolver by contract id (the principal `get-owner` returns). */
export const getCustodyResolver = (
  contractId: string | null | undefined
): NftCustodyResolver | null =>
  CUSTODY_BY_ID.get(normalizePrincipal(contractId)) ?? null;

const HELPER_BY_ID = new Map<string, ForeverTwinCollection>(
  FOREVER_TWIN_COLLECTIONS.map((collection) => [
    collection.helperContractId,
    collection
  ])
);

/** All registered collections that mint twins into the given master contract. */
export const getCollectionsForMaster = (
  masterContractId: string
): ForeverTwinCollection[] => {
  const target = normalizePrincipal(masterContractId);
  return FOREVER_TWIN_COLLECTIONS.filter(
    (collection) => collection.masterContractId === target
  );
};

/** Look up a collection by its helper contract id (the escrow holder). */
export const getCollectionByHelperId = (
  contractId: string | null | undefined
): ForeverTwinCollection | null => {
  return HELPER_BY_ID.get(normalizePrincipal(contractId)) ?? null;
};

/**
 * True when the given principal is a registered Forever Twin helper contract.
 * A Xtrata token owned by such a principal is escrowed.
 */
export const isForeverTwinHelper = (
  contractId: string | null | undefined
): boolean => HELPER_BY_ID.has(normalizePrincipal(contractId));

import registry from '../../data/market-registry.json';
import { getNetworkFromAddress } from '../network/guard';
import { isNetworkType, type NetworkType } from '../network/types';
import { getContractId } from '../contract/config';

export type MarketRegistryEntry = {
  label: string;
  address: string;
  contractName: string;
  network: NetworkType;
  paymentTokenContractId?: string | null;
  /** true for xtrata-market-sponsored-* contracts (fee-budget escrow, STX-free buys) */
  sponsored?: boolean;
  /** base URL of the sponsor relayer for this market (required when sponsored) */
  sponsorApi?: string;
  /**
   * The single NFT contract this market will accept, when that is welded into
   * the contract at deploy time rather than being an admin-settable allow-list.
   *
   * Every pre-sponsored market has `(define-constant ALLOWED-NFT-CONTRACT …)`
   * and `list-token` asserts against it, so it can never take an inscription
   * from any other core. `xtrata-market-{stx,sbtc,usdc}-v1-0` are welded to
   * `xtrata-v2-1-0`, and `xtrata-market-v1-{0,1}` to `xtrata-v1-1-1`. Absent
   * means the market has a real `set-nft-allowed` allow-list.
   *
   * Recorded here because it is not discoverable at runtime: there is no getter
   * for the constant, so a listing against the wrong core simply aborts with
   * ERR-NOT-AUTHORIZED, which wallets report as an opaque internal error.
   */
  lockedNftContract?: string;
};

const isValidEntry = (entry: MarketRegistryEntry) => {
  if (!entry.address || !entry.contractName || !entry.label) {
    return false;
  }
  if (!isNetworkType(entry.network)) {
    return false;
  }
  const inferred = getNetworkFromAddress(entry.address);
  if (inferred && inferred !== entry.network) {
    return false;
  }
  return true;
};

const normalizeRegistry = (entries: MarketRegistryEntry[]) => {
  const valid = entries.filter(isValidEntry);
  if (valid.length === 0) {
    throw new Error('Market registry is empty or invalid');
  }
  return valid;
};

export const MARKET_REGISTRY = normalizeRegistry(
  registry as MarketRegistryEntry[]
);

const MARKET_REGISTRY_BY_ID = new Map(
  MARKET_REGISTRY.map((entry) => [getContractId(entry), entry])
);

export const getMarketContractId = (entry: MarketRegistryEntry) =>
  getContractId(entry);

export const getMarketRegistryEntry = (
  contractId: string | null | undefined
) => {
  if (!contractId) {
    return null;
  }
  return MARKET_REGISTRY_BY_ID.get(contractId) ?? null;
};

/**
 * Can this market accept a NEW listing of an inscription from `nftContractId`?
 *
 * Only ever used to decide what a seller may choose. Existing listings on a
 * locked market stay fully readable, buyable and cancellable — the lock is on
 * `list-token`, not on the rest of the contract, and hiding those listings
 * would strand their sellers.
 */
export const marketAcceptsNftContract = (
  entry: Pick<MarketRegistryEntry, 'lockedNftContract'> | null | undefined,
  nftContractId: string | null | undefined
): boolean => {
  if (!entry) return false;
  if (!entry.lockedNftContract) return true;
  if (!nftContractId) return false;
  return entry.lockedNftContract.toLowerCase() === nftContractId.toLowerCase();
};

/** Markets that will accept a new listing of `nftContractId`, sponsored first. */
export const getSellableMarkets = (
  nftContractId: string | null | undefined,
  network?: NetworkType
) =>
  MARKET_REGISTRY.filter(
    (entry) =>
      (!network || entry.network === network) &&
      marketAcceptsNftContract(entry, nftContractId)
  ).sort((a, b) => Number(b.sponsored ?? false) - Number(a.sponsored ?? false));

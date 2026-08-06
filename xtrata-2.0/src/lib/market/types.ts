import type { MarketSettlementAsset } from './settlement';
export type MarketListing = {
  seller: string;
  nftContract: string;
  tokenId: bigint;
  price: bigint;
  createdAt: bigint;
  /** sponsored markets only — STX fee budget escrowed at list time */
  feeBudget?: bigint;
  /** sponsored markets only — unclaimed budget still in escrow */
  budgetRemaining?: bigint;
  /** sponsored markets only — cumulative sponsor reimbursement */
  claimed?: bigint;
  /** sponsored markets only — buyer once sold */
  buyer?: string | null;
  /** sponsored markets only — block height of the sale (null while live) */
  soldAt?: bigint | null;
};

export type MarketActivityType =
  | 'list'
  | 'buy'
  | 'cancel'
  | 'claim-fee'
  | 'settle-refund';

export type MarketActivityEvent = {
  id: string;
  type: MarketActivityType;
  listingId: bigint;
  tokenId?: bigint;
  price?: bigint;
  fee?: bigint;
  seller?: string;
  buyer?: string;
  nftContract?: string;
  txId?: string;
  blockHeight?: number;
  eventIndex?: number;
  timestamp?: string;
  /** sponsored markets: seller's escrowed fee budget at list time */
  feeBudget?: bigint;
  /** sponsored markets: budget remaining after a claim, or refunded at settle */
  budgetRemaining?: bigint;
  /** sponsored markets: µSTX reimbursed to the sponsor */
  claimAmount?: bigint;
  /** sponsored markets: µSTX dust returned to the seller */
  refunded?: bigint;
};

export type MarketIndexSnapshot = {
  contractId: string;
  events: MarketActivityEvent[];
  /**
   * Did the fetch reach the end of this contract's history?
   *
   * False when the page walk hit its bound or the merge hit MAX_EVENTS, i.e.
   * older events exist that are not in `events`. A view that shows this
   * snapshot as a complete history when this is false is lying, so it is not
   * optional and defaults to absent-meaning-unknown rather than to true.
   */
  complete?: boolean;
  updatedAt: number;
};

export type NftActivityType = 'mint' | 'transfer';

export type NftActivityEvent = {
  id: string;
  type: NftActivityType;
  tokenId?: bigint;
  sender?: string;
  recipient?: string;
  nftContract?: string;
  assetIdentifier?: string;
  txId?: string;
  blockHeight?: number;
  eventIndex?: number;
  timestamp?: string;
};

export type NftIndexSnapshot = {
  assetIdentifier: string;
  events: NftActivityEvent[];
  updatedAt: number;
};

export type UnifiedActivityType = MarketActivityType | 'inscribe' | 'transfer';

export type UnifiedActivityEvent = {
  id: string;
  source: 'market' | 'nft';
  type: UnifiedActivityType;
  listingId?: bigint;
  tokenId?: bigint;
  price?: bigint;
  fee?: bigint;
  seller?: string;
  buyer?: string;
  from?: string;
  to?: string;
  nftContract?: string;
  txId?: string;
  blockHeight?: number;
  eventIndex?: number;
  timestamp?: string;
};

/**
 * One row of the marketplace-wide activity list.
 *
 * A `MarketActivityEvent` knows its listing but not which market it happened
 * on, because it was only ever read back per contract. Merging three markets
 * into one list makes that ambiguous -- listing 6 exists on all three -- so the
 * market is attached here rather than inferred later.
 */
export type MarketplaceActivityRow = MarketActivityEvent & {
  marketContractId: string;
  marketKey: string;
  marketLabel: string;
  /**
   * The asset this market settles in, carried whole so the row formats through
   * the same `formatMarketPrice` the listing cards use. A second opinion about
   * what a price means is how two parts of one page disagree about a number.
   */
  settlement: MarketSettlementAsset;
  /**
   * True when the sponsor reimbursed itself from the seller's escrowed budget,
   * which only happens on a sponsored buy. Derived from a `claim-fee` event
   * against the same listing, NOT from the market being sponsor-capable --
   * every listing here is on a sponsored market, but most sales are self-paid.
   */
  sponsored?: boolean;
};

export type MarketplaceActivitySnapshot = {
  rows: MarketplaceActivityRow[];
  /** False when ANY market's history was truncated. See MarketIndexSnapshot. */
  complete: boolean;
  markets: {
    contractId: string;
    label: string;
    count: number;
    complete: boolean;
  }[];
  updatedAt: number;
};

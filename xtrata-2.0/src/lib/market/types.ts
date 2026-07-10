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

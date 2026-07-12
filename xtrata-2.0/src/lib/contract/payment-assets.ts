import { FungibleConditionCode } from '@stacks/transactions';
import type { PriceAssetKey } from '../pricing/types';
import type { ContractCapabilities } from './capabilities';
import type { FungibleAssetConfig } from './fungible-assets';
import { listKnownFungibleAssets } from './fungible-assets';
import { buildFungibleSpendPostCondition } from './post-conditions';

/**
 * Payment-asset selection for the mint flow (WS-3.2).
 *
 * STX is always available. Non-STX SIP-010 assets (sBTC, USDCx, and later USDT)
 * are only offered when the target core advertises `supportsMultiAssetPayment`;
 * no shipped core does yet, so the picker degrades to STX-only rather than
 * presenting an option the contract cannot honour. See
 * contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md.
 */
export type PaymentAsset =
  | {
      kind: 'stx';
      symbol: 'STX';
      decimals: 6;
      priceAssetKey: 'stx';
      token: null;
    }
  | {
      kind: 'fungible';
      symbol: string;
      decimals: number;
      priceAssetKey: PriceAssetKey | null;
      token: FungibleAssetConfig;
    };

export const STX_PAYMENT_ASSET: PaymentAsset = {
  kind: 'stx',
  symbol: 'STX',
  decimals: 6,
  priceAssetKey: 'stx',
  token: null
};

const toFungiblePaymentAsset = (token: FungibleAssetConfig): PaymentAsset => ({
  kind: 'fungible',
  symbol: token.symbol,
  decimals: token.decimals,
  priceAssetKey: token.priceAssetKey,
  token
});

/**
 * The payment assets the user may choose for a given contract. Returns STX only
 * unless the contract accepts non-STX payment.
 */
export const getAvailablePaymentAssets = (
  capabilities: Pick<ContractCapabilities, 'supportsMultiAssetPayment'>
): PaymentAsset[] => {
  if (!capabilities.supportsMultiAssetPayment) {
    return [STX_PAYMENT_ASSET];
  }
  return [
    STX_PAYMENT_ASSET,
    ...listKnownFungibleAssets().map(toFungiblePaymentAsset)
  ];
};

/**
 * Build the exact-amount fungible post-condition for a non-STX payment leg.
 * Returns null for STX (whose payment/post-condition is handled by the existing
 * mint flow).
 */
export const buildPaymentPostCondition = (params: {
  asset: PaymentAsset;
  senderAddress: string;
  amount: bigint;
}) => {
  if (params.asset.kind === 'stx') {
    return null;
  }
  return buildFungibleSpendPostCondition({
    token: params.asset.token,
    senderAddress: params.senderAddress,
    amount: params.amount,
    conditionCode: FungibleConditionCode.Equal
  });
};

import { estimateWorstCaseSealFeeMicroStx } from '../deploy/pricing-lock';
import {
  quoteCollectionV15Mint,
  type CollectionV15FeeUnits
} from '../../../packages/xtrata-sdk/src/collection-v15';
import type { CollectionMintPaymentModel } from './payment-model';
import {
  resolveDisplayedCollectionMintPrice,
  type CollectionMintPricingMetadata
} from './pricing-metadata';

export type LockedCollectionMintFeeFloor = {
  maxChunks: number;
  feeBatches: number;
  beginFeeMicroStx: bigint;
  sealFeeMicroStx: bigint;
  totalProtocolFeeMicroStx: bigint;
};

export const resolveLockedCollectionMintFeeFloor = (params: {
  maxChunks: number;
  feeUnitMicroStx: bigint;
}): LockedCollectionMintFeeFloor | null => {
  const maxChunks = Math.max(0, Math.floor(params.maxChunks));
  if (maxChunks <= 0 || params.feeUnitMicroStx <= 0n) {
    return null;
  }
  const estimate = estimateWorstCaseSealFeeMicroStx({
    maxChunks,
    feeUnitMicroStx: params.feeUnitMicroStx
  });
  const beginFeeMicroStx = params.feeUnitMicroStx;
  return {
    maxChunks,
    feeBatches: estimate.batchCount,
    beginFeeMicroStx,
    sealFeeMicroStx: estimate.sealMicroStx,
    totalProtocolFeeMicroStx: beginFeeMicroStx + estimate.sealMicroStx
  };
};

/**
 * Collection v1.5/v1.6 on core v3.2.3: the collector pays the core's staged fees
 * (begin + seal + per-chunk, plus a batch fee beyond 32 chunks) on top of the
 * contract price. The floor is quoted for the largest locked file, which is
 * exactly what the live mint page shows collectors, so the price the creator
 * enters is the price collectors see for the largest item.
 *
 * The legacy single-unit formula above must not be used for these helpers: it
 * reads only `get-fee-unit` (the batch unit on v3.2.3) and misprices every mint.
 */
export const resolveV15CollectionMintFeeFloor = (params: {
  maxChunks: number;
  units: CollectionV15FeeUnits;
}): LockedCollectionMintFeeFloor | null => {
  const maxChunks = Math.max(0, Math.floor(params.maxChunks));
  if (maxChunks <= 0) {
    return null;
  }
  const quote = quoteCollectionV15Mint(params.units, maxChunks, 0n);
  return {
    maxChunks,
    feeBatches: maxChunks <= 32 ? 0 : Math.ceil((maxChunks - 32) / 32),
    beginFeeMicroStx: quote.begin,
    sealFeeMicroStx: quote.sealProtocol,
    totalProtocolFeeMicroStx: quote.begin + quote.sealProtocol
  };
};

export const resolveOnChainMintPriceFromDisplayedMintPrice = (params: {
  displayedMintPriceMicroStx: bigint;
  feeFloorMicroStx: bigint;
}) => {
  const onChainMintPriceMicroStx =
    params.displayedMintPriceMicroStx - params.feeFloorMicroStx;
  return onChainMintPriceMicroStx >= 0n ? onChainMintPriceMicroStx : null;
};

export const resolveDisplayedMintPriceFromOnChainMintPrice = (params: {
  onChainMintPriceMicroStx: bigint;
  feeFloorMicroStx: bigint;
}) => params.onChainMintPriceMicroStx + params.feeFloorMicroStx;

export const resolveManagedCollectionMintPrice = (params: {
  paymentModel: CollectionMintPaymentModel;
  contractMintPriceMicroStx: bigint | null;
  pricing: CollectionMintPricingMetadata;
  pricingLockMaxChunks: number | null;
  feeUnitMicroStx: bigint | null;
  /** When supplied (v1.5/v1.6), used instead of the legacy single-unit floor. */
  feeFloorMicroStx?: bigint | null;
}) => {
  if (params.feeFloorMicroStx !== undefined) {
    // v1.5/v1.6: collectors pay contract price + live protocol quote, whatever
    // older metadata recorded. Unknown fees mean an unknown collector price —
    // never fall back to the bare contract price, which would understate it.
    if (params.contractMintPriceMicroStx === null || params.feeFloorMicroStx === null) {
      return null;
    }
    return resolveDisplayedMintPriceFromOnChainMintPrice({
      onChainMintPriceMicroStx: params.contractMintPriceMicroStx,
      feeFloorMicroStx: params.feeFloorMicroStx
    });
  }
  const metadataResolvedPrice = resolveDisplayedCollectionMintPrice({
    activePhaseMintPriceMicroStx: null,
    onChainMintPriceMicroStx: params.contractMintPriceMicroStx,
    paymentModel: params.paymentModel,
    pricing: params.pricing,
    statusMintPriceMicroStx: params.contractMintPriceMicroStx
  });
  if (
    metadataResolvedPrice !== null &&
    params.contractMintPriceMicroStx !== null &&
    metadataResolvedPrice !== params.contractMintPriceMicroStx
  ) {
    return metadataResolvedPrice;
  }
  if (
    params.paymentModel === 'seal' &&
    params.contractMintPriceMicroStx !== null &&
    params.pricingLockMaxChunks !== null &&
    params.feeUnitMicroStx !== null
  ) {
    const feeFloor = resolveLockedCollectionMintFeeFloor({
      maxChunks: params.pricingLockMaxChunks,
      feeUnitMicroStx: params.feeUnitMicroStx
    });
    if (feeFloor) {
      return resolveDisplayedMintPriceFromOnChainMintPrice({
        onChainMintPriceMicroStx: params.contractMintPriceMicroStx,
        feeFloorMicroStx: feeFloor.totalProtocolFeeMicroStx
      });
    }
  }
  return params.contractMintPriceMicroStx;
};

import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  type PostCondition
} from '@stacks/transactions';
import { FEE_BATCH_SIZE } from '../chunking/hash';

type MintBeginSpendCapParams = {
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  additionalCapMicroStx?: bigint | null;
};

export const resolveMintBeginSpendCapMicroStx = (
  params: MintBeginSpendCapParams
) => {
  const baseCap = params.activePhaseMintPrice ?? params.mintPrice ?? null;
  if (baseCap === null || baseCap < 0n) {
    return null;
  }
  if (params.additionalCapMicroStx === null || params.additionalCapMicroStx === undefined) {
    return baseCap;
  }
  if (params.additionalCapMicroStx <= 0n) {
    return null;
  }
  return params.additionalCapMicroStx < baseCap
    ? params.additionalCapMicroStx
    : baseCap;
};

type CollectionBeginSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  mintPrice?: bigint | null;
  activePhaseMintPrice?: bigint | null;
  chargeMintPriceAtBegin?: boolean;
  beginFeeMicroStx?: bigint | null;
};

export const resolveCollectionBeginSpendCapMicroStx = (
  params: CollectionBeginSpendCapParams
) => {
  const protocolFee = toPositiveProtocolFee(params.protocolFeeMicroStx);
  if (protocolFee === null) {
    return null;
  }
  const mintPrice =
    params.activePhaseMintPrice ?? params.mintPrice ?? null;
  const beginFee =
    params.beginFeeMicroStx ??
    (params.chargeMintPriceAtBegin ? mintPrice : 0n);
  if (beginFee === null) {
    return null;
  }
  if (beginFee < 0n) {
    return null;
  }
  return protocolFee + beginFee;
};

/**
 * Real granular fee units read from the core, when the caller has them.
 *
 * The v3.2.x core charges from five independent admin-mutable units, not one
 * (xtrata-v3.2.3.clar lines 129-133 and 415-442). `protocolFeeMicroStx` below is
 * the legacy aggregate `get-fee-unit`, which cannot express upload-chunk or
 * single-tx. Supply these to get the exact `seal-fee-for-chunks` amount.
 */
export type SpendCapFeeUnits = {
  beginFeeUnit?: bigint | null;
  uploadChunkFeeUnit?: bigint | null;
  uploadBatchFeeUnit?: bigint | null;
  sealFeeUnit?: bigint | null;
  singleTxFeeUnit?: bigint | null;
};

type SealSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: SpendCapFeeUnits | null;
};

const toPositiveChunkCount = (value: number | bigint | null) => {
  if (value === null) {
    return null;
  }
  if (typeof value === 'bigint') {
    return value > 0n ? value : null;
  }
  if (!Number.isSafeInteger(value) || value <= 0) {
    return null;
  }
  return BigInt(value);
};

const toPositiveProtocolFee = (value: bigint | null) => {
  if (value === null || value <= 0n) {
    return null;
  }
  return value;
};

const hasGranularSealUnits = (units?: SpendCapFeeUnits | null) =>
  !!units &&
  units.sealFeeUnit !== null &&
  units.sealFeeUnit !== undefined &&
  units.uploadChunkFeeUnit !== null &&
  units.uploadChunkFeeUnit !== undefined &&
  units.uploadBatchFeeUnit !== null &&
  units.uploadBatchFeeUnit !== undefined;

/** Contract `first-batch-chunks` / `additional-batches` / `seal-fee-for-chunks`. */
const sealFeeMicroStxFromUnits = (
  units: SpendCapFeeUnits,
  totalChunks: bigint
) => {
  const chunkBatchSize = BigInt(FEE_BATCH_SIZE);
  const firstChunks =
    totalChunks > chunkBatchSize ? chunkBatchSize : totalChunks;
  const extraBatches =
    totalChunks <= chunkBatchSize
      ? 0n
      : (totalChunks - chunkBatchSize + chunkBatchSize - 1n) / chunkBatchSize;
  return (
    (units.sealFeeUnit ?? 0n) +
    firstChunks * (units.uploadChunkFeeUnit ?? 0n) +
    extraBatches * (units.uploadBatchFeeUnit ?? 0n)
  );
};

export const resolveSealSpendCapMicroStx = (
  params: SealSpendCapParams
) => {
  const feeUnit = toPositiveProtocolFee(params.protocolFeeMicroStx);
  const totalChunks = toPositiveChunkCount(params.totalChunks);
  if (feeUnit === null || totalChunks === null) {
    return null;
  }
  if (hasGranularSealUnits(params.feeUnits)) {
    return sealFeeMicroStxFromUnits(params.feeUnits!, totalChunks);
  }
  // Only the legacy aggregate is known, and it cannot express
  // upload-chunk-fee-unit. Keep the conservative `aggregate * (1 + ceil(n/32))`
  // bound: it is >= the real granular seal fee for every unit configuration
  // seen on chain, and a cap that is too LOW aborts the seal after the begin
  // fee and every upload batch have already been spent.
  const chunkBatchSize = BigInt(FEE_BATCH_SIZE);
  const feeBatches = (totalChunks + chunkBatchSize - 1n) / chunkBatchSize;
  return feeUnit * (1n + feeBatches);
};

type BatchSealSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: SpendCapFeeUnits | null;
};

export const resolveBatchSealSpendCapMicroStx = (
  params: BatchSealSpendCapParams
) => {
  const feeUnit = toPositiveProtocolFee(params.protocolFeeMicroStx);
  if (feeUnit === null) {
    return null;
  }
  let total = 0n;
  for (const totalChunks of params.totalChunks) {
    const itemCap = resolveSealSpendCapMicroStx({
      protocolFeeMicroStx: feeUnit,
      totalChunks,
      feeUnits: params.feeUnits
    });
    if (itemCap === null) {
      return null;
    }
    total += itemCap;
  }
  return total;
};

type MintBeginPostConditionParams = MintBeginSpendCapParams & {
  sender?: string | null;
};

export const buildMintBeginStxPostConditions = (
  params: MintBeginPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const cap = resolveMintBeginSpendCapMicroStx(params);
  if (cap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(sender, FungibleConditionCode.LessEqual, cap)
  ];
};

type ProtocolFeePostConditionParams = {
  sender?: string | null;
  protocolFeeMicroStx: bigint | null;
};

export const buildProtocolFeeStxPostConditions = (
  params: ProtocolFeePostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const protocolFee = params.protocolFeeMicroStx;
  if (protocolFee === null || protocolFee <= 0n) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      protocolFee
    )
  ];
};

type SealPostConditionParams = {
  sender?: string | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: SpendCapFeeUnits | null;
};

export const buildSealStxPostConditions = (
  params: SealPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const sealCap = resolveSealSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (sealCap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      sealCap
    )
  ];
};

type BatchSealPostConditionParams = {
  sender?: string | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: SpendCapFeeUnits | null;
};

export const buildBatchSealStxPostConditions = (
  params: BatchSealPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const sealCap = resolveBatchSealSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (sealCap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      sealCap
    )
  ];
};

type CollectionSealSpendCapParams = {
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: SpendCapFeeUnits | null;
};

const resolveCollectionMintPrice = (params: {
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
}) => {
  const price = params.activePhaseMintPrice ?? params.mintPrice ?? null;
  if (price === null || price < 0n) {
    return null;
  }
  return price;
};

export const resolveCollectionSealSpendCapMicroStx = (
  params: CollectionSealSpendCapParams
) => {
  const mintPrice = resolveCollectionMintPrice(params);
  const sealCap = resolveSealSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (mintPrice === null || sealCap === null) {
    return null;
  }
  return mintPrice + sealCap;
};

type CollectionBatchSealSpendCapParams = {
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: SpendCapFeeUnits | null;
};

export const resolveCollectionBatchSealSpendCapMicroStx = (
  params: CollectionBatchSealSpendCapParams
) => {
  const mintPrice = resolveCollectionMintPrice(params);
  const batchSealCap = resolveBatchSealSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (mintPrice === null || batchSealCap === null) {
    return null;
  }
  return mintPrice * BigInt(params.totalChunks.length) + batchSealCap;
};

type CollectionSmallSingleTxSpendCapParams = {
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  chargeMintPriceAtBegin?: boolean;
  beginFeeMicroStx?: bigint | null;
  sealSpendCapMicroStx?: bigint | null;
  feeUnits?: SpendCapFeeUnits | null;
};

/**
 * Cap for the collection contract's `mint-small-single-tx`.
 *
 * This deliberately stays on the STAGED model (begin + seal). The collection
 * contract packs begin-or-get -> add-chunk-batch -> seal-inscription into one
 * transaction (xtrata-collection-mint-v1.4.clar lines 1470-1482), so the core
 * charges begin_fee + seal_fee(n). `single-tx-fee-for-chunks` applies only to
 * the core's OWN `mint-single-tx`, and using it here would cap below the real
 * fee and abort the mint.
 */
export const resolveCollectionSmallSingleTxSpendCapMicroStx = (
  params: CollectionSmallSingleTxSpendCapParams
) => {
  const beginCap = resolveCollectionBeginSpendCapMicroStx({
    mintPrice: params.mintPrice,
    activePhaseMintPrice: params.activePhaseMintPrice,
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    chargeMintPriceAtBegin: params.chargeMintPriceAtBegin,
    beginFeeMicroStx: params.beginFeeMicroStx
  });
  if (beginCap === null) {
    return null;
  }

  let sealCap = params.sealSpendCapMicroStx;
  if (sealCap === undefined || sealCap === null) {
    sealCap = params.chargeMintPriceAtBegin
      ? resolveSealSpendCapMicroStx({
          protocolFeeMicroStx: params.protocolFeeMicroStx,
          totalChunks: params.totalChunks,
          feeUnits: params.feeUnits
        })
      : resolveCollectionSealSpendCapMicroStx({
          mintPrice: params.mintPrice,
          activePhaseMintPrice: params.activePhaseMintPrice,
          protocolFeeMicroStx: params.protocolFeeMicroStx,
          totalChunks: params.totalChunks,
          feeUnits: params.feeUnits
        });
  }

  if (sealCap === null || sealCap < 0n) {
    return null;
  }

  return beginCap + sealCap;
};

type CollectionSealPostConditionParams = {
  sender?: string | null;
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: SpendCapFeeUnits | null;
};

export const buildCollectionSealStxPostConditions = (
  params: CollectionSealPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const cap = resolveCollectionSealSpendCapMicroStx(params);
  if (cap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      cap
    )
  ];
};

type CollectionBatchSealPostConditionParams = {
  sender?: string | null;
  mintPrice: bigint | null;
  activePhaseMintPrice?: bigint | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: SpendCapFeeUnits | null;
};

export const buildCollectionBatchSealStxPostConditions = (
  params: CollectionBatchSealPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const cap = resolveCollectionBatchSealSpendCapMicroStx(params);
  if (cap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      cap
    )
  ];
};

type CollectionSmallSingleTxPostConditionParams =
  CollectionSmallSingleTxSpendCapParams & {
    sender?: string | null;
  };

export const buildCollectionSmallSingleTxStxPostConditions = (
  params: CollectionSmallSingleTxPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const cap = resolveCollectionSmallSingleTxSpendCapMicroStx(params);
  if (cap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      cap
    )
  ];
};

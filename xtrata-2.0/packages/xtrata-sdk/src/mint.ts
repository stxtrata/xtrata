import { sha256 } from '@noble/hashes/sha256';
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  type PostCondition
} from '@stacks/transactions';

export const CHUNK_SIZE = 16_384;
export const MAX_BATCH_SIZE = 50;
export const MAX_UPLOAD_BATCH_SIZE = 30;

/**
 * Divisor for protocol fee arithmetic. Matches the deployed contract's
 * MAX-UPLOAD-BATCH-SIZE (u32) — the batch size the contract CHARGES for, which
 * is neither the size the client SENDS (MAX_UPLOAD_BATCH_SIZE = 30) nor the
 * purge index list length (MAX_BATCH_SIZE = 50, typed `(list 50 uint)`).
 *
 * Dividing by 50 here under-counts fee batches, so a seal post-condition caps
 * below the fee the contract charges and aborts the seal AFTER the begin fee
 * and every upload batch fee have been spent.
 *
 * Verified against mainnet 2026-08-02:
 * SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 line 75.
 */
export const FEE_BATCH_SIZE = 32;
export const MAX_SMALL_MINT_CHUNKS = 30;
export const EMPTY_HASH = new Uint8Array(32);

export const DEFAULT_BATCH_SIZE = MAX_UPLOAD_BATCH_SIZE;
export const TX_DELAY_SECONDS = 5;
export const DEFAULT_TOKEN_URI =
  'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';
export const MAX_TOKEN_URI_LENGTH = 256;
export const MAX_MIME_LENGTH = 64;

const concatBytes = (left: Uint8Array, right: Uint8Array) => {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left, 0);
  combined.set(right, left.length);
  return combined;
};

export const chunkBytes = (data: Uint8Array, chunkSize = CHUNK_SIZE) => {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than zero');
  }
  const chunks: Uint8Array[] = [];
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    chunks.push(data.slice(offset, offset + chunkSize));
  }
  return chunks;
};

export const batchChunks = (chunks: Uint8Array[], batchSize = MAX_UPLOAD_BATCH_SIZE) => {
  if (!Number.isFinite(batchSize) || batchSize <= 0) {
    throw new Error('batchSize must be greater than zero');
  }
  const resolvedBatchSize = Math.min(MAX_UPLOAD_BATCH_SIZE, Math.floor(batchSize));
  const batches: Uint8Array[][] = [];
  for (let offset = 0; offset < chunks.length; offset += resolvedBatchSize) {
    batches.push(chunks.slice(offset, offset + resolvedBatchSize));
  }
  return batches;
};

export const computeExpectedHash = (chunks: Uint8Array[]) => {
  let runningHash = EMPTY_HASH;
  for (const chunk of chunks) {
    runningHash = new Uint8Array(sha256(concatBytes(runningHash, chunk)));
  }
  return runningHash;
};

export const MICROSTX_PER_STX = 1_000_000;
export const DEFAULT_FEE_UNIT_MICROSTX = 100_000;

/**
 * The v3.2.x core does NOT charge one flat fee unit. It keeps five independent,
 * admin-mutable data vars and combines them with two different formulas:
 *
 *   seal_fee(n)      = seal-fee-unit
 *                    + min(n, 32) * upload-chunk-fee-unit
 *                    + additional_batches(n) * upload-batch-fee-unit
 *   single_tx_fee(n) = single-tx-fee-unit + n * upload-chunk-fee-unit
 *   begin_fee        = begin-fee-unit
 *
 * See xtrata-v3.2.3.clar lines 129-133 (the data vars) and 415-442
 * (first-batch-chunks / additional-batches / seal-fee-for-chunks /
 * single-tx-fee-for-chunks). Mirrors src/lib/contract/fees.ts in the app; keep
 * the two in sync.
 */
export type FeeUnits = {
  /** get-begin-fee-unit */
  beginFeeUnit: number;
  /** get-upload-chunk-fee-unit */
  uploadChunkFeeUnit: number;
  /** get-upload-batch-fee-unit */
  uploadBatchFeeUnit: number;
  /** get-seal-fee-unit */
  sealFeeUnit: number;
  /** get-single-tx-fee-unit */
  singleTxFeeUnit: number;
};

/**
 * Fee units read from mainnet SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
 * on 2026-08-03. upload-chunk (1000 vs 2000) and single-tx (10000 vs 100000)
 * are BELOW the contract source's compiled defaults because the admin lowered
 * them. Every unit is ADMIN-MUTABLE, so these are observed fallbacks only: a
 * caller that can read the chain should pass real units instead.
 */
export const OBSERVED_FEE_UNITS_MICROSTX: FeeUnits = {
  beginFeeUnit: 100_000,
  uploadChunkFeeUnit: 1_000,
  uploadBatchFeeUnit: 100_000,
  sealFeeUnit: 100_000,
  singleTxFeeUnit: 10_000
};

/** The two units the legacy aggregate `get-fee-unit` cannot express. */
export const OBSERVED_UPLOAD_CHUNK_FEE_UNIT_MICROSTX =
  OBSERVED_FEE_UNITS_MICROSTX.uploadChunkFeeUnit;
export const OBSERVED_SINGLE_TX_FEE_UNIT_MICROSTX =
  OBSERVED_FEE_UNITS_MICROSTX.singleTxFeeUnit;

export type FeeSchedule = {
  model: 'fee-unit';
  /**
   * Legacy aggregate unit (`get-fee-unit`). Kept for display; fee arithmetic
   * must go through `units`.
   */
  feeUnitMicroStx: number;
  units: FeeUnits;
};

export type FeeEstimate = {
  beginMicroStx: number;
  sealMicroStx: number;
  totalMicroStx: number;
  /**
   * Batches charged at `upload-batch-fee-unit`, i.e. the contract's
   * `additional-batches` (batches after the first 32 chunks, which are charged
   * per chunk instead). Not `ceil(chunks / 32)`.
   */
  feeBatches: number;
};

export type BatchFeeEstimate = {
  itemCount: number;
  beginMicroStx: number;
  sealMicroStx: number;
  totalMicroStx: number;
  feeBatches: number;
};

const normalizeMicroStx = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return DEFAULT_FEE_UNIT_MICROSTX;
  }
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_FEE_UNIT_MICROSTX;
  }
  return Math.round(value);
};

const normalizeTotalChunks = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.floor(value);
};

const normalizeUnit = (
  value: number | bigint | null | undefined,
  fallback: number
) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const asNumber = typeof value === 'bigint' ? Number(value) : value;
  if (!Number.isFinite(asNumber) || asNumber < 0) {
    return fallback;
  }
  return Math.round(asNumber);
};

export type FeeUnitOverrides = {
  beginFeeUnit?: number | bigint | null;
  uploadChunkFeeUnit?: number | bigint | null;
  uploadBatchFeeUnit?: number | bigint | null;
  sealFeeUnit?: number | bigint | null;
  singleTxFeeUnit?: number | bigint | null;
};

/**
 * Resolve the five granular units. The legacy aggregate can stand in for
 * begin / seal / upload-batch, but NOT for upload-chunk or single-tx, which are
 * lower on chain; those fall back to the values observed on mainnet 2026-08-03.
 */
export const resolveFeeUnits = (
  aggregateMicroStx?: number | null,
  overrides?: FeeUnitOverrides | null
): FeeUnits => {
  const aggregate = normalizeMicroStx(aggregateMicroStx);
  return {
    beginFeeUnit: normalizeUnit(overrides?.beginFeeUnit, aggregate),
    uploadChunkFeeUnit: normalizeUnit(
      overrides?.uploadChunkFeeUnit,
      OBSERVED_UPLOAD_CHUNK_FEE_UNIT_MICROSTX
    ),
    uploadBatchFeeUnit: normalizeUnit(overrides?.uploadBatchFeeUnit, aggregate),
    sealFeeUnit: normalizeUnit(overrides?.sealFeeUnit, aggregate),
    singleTxFeeUnit: normalizeUnit(
      overrides?.singleTxFeeUnit,
      OBSERVED_SINGLE_TX_FEE_UNIT_MICROSTX
    )
  };
};

export const getFeeSchedule = (
  feeUnitMicroStx?: number | null,
  units?: FeeUnitOverrides | null
): FeeSchedule => ({
  model: 'fee-unit',
  feeUnitMicroStx: normalizeMicroStx(feeUnitMicroStx),
  units: resolveFeeUnits(feeUnitMicroStx, units)
});

/** Contract `first-batch-chunks`. */
export const firstBatchChunks = (totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  return chunks > FEE_BATCH_SIZE ? FEE_BATCH_SIZE : chunks;
};

/** Contract `additional-batches`. */
export const additionalBatches = (totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  if (chunks <= FEE_BATCH_SIZE) {
    return 0;
  }
  return Math.ceil((chunks - FEE_BATCH_SIZE) / FEE_BATCH_SIZE);
};

/** Contract `seal-fee-for-chunks` (staged begin -> upload -> seal flow). */
export const sealFeeForChunks = (units: FeeUnits, totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  return (
    units.sealFeeUnit +
    firstBatchChunks(chunks) * units.uploadChunkFeeUnit +
    additionalBatches(chunks) * units.uploadBatchFeeUnit
  );
};

/**
 * Contract `single-tx-fee-for-chunks` (core-native mint-single-tx route).
 * NOT begin_fee + seal_fee — the core charges a separate flat unit plus a
 * per-chunk unit.
 */
export const singleTxFeeForChunks = (units: FeeUnits, totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  return units.singleTxFeeUnit + chunks * units.uploadChunkFeeUnit;
};

export const estimateContractFees = (params: {
  schedule: FeeSchedule;
  totalChunks: number;
}): FeeEstimate => {
  const totalChunks = normalizeTotalChunks(params.totalChunks);
  const units = params.schedule.units;
  const feeBatches = additionalBatches(totalChunks);
  const sealMicroStx = totalChunks > 0 ? sealFeeForChunks(units, totalChunks) : 0;
  const beginMicroStx = units.beginFeeUnit;
  return {
    beginMicroStx,
    sealMicroStx,
    totalMicroStx: beginMicroStx + sealMicroStx,
    feeBatches
  };
};

/** Fee for the core-native one-transaction mint route. */
export const estimateSingleTxContractFee = (params: {
  schedule: FeeSchedule;
  totalChunks: number;
}) => {
  const totalChunks = normalizeTotalChunks(params.totalChunks);
  if (totalChunks <= 0) {
    return 0;
  }
  return singleTxFeeForChunks(params.schedule.units, totalChunks);
};

export const estimateBatchContractFees = (params: {
  schedule: FeeSchedule;
  totalChunks: number[];
}): BatchFeeEstimate => {
  const items = params.totalChunks.map((count) =>
    estimateContractFees({ schedule: params.schedule, totalChunks: count })
  );
  const beginMicroStx = items.reduce((sum, item) => sum + item.beginMicroStx, 0);
  const sealMicroStx = items.reduce((sum, item) => sum + item.sealMicroStx, 0);
  const feeBatches = items.reduce((sum, item) => sum + item.feeBatches, 0);
  return {
    itemCount: items.length,
    beginMicroStx,
    sealMicroStx,
    totalMicroStx: beginMicroStx + sealMicroStx,
    feeBatches
  };
};

export const formatMicroStx = (value: number) =>
  `${(value / MICROSTX_PER_STX).toFixed(6)} STX`;

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

type CollectionBeginSpendCapParams = MintBeginSpendCapParams & {
  protocolFeeMicroStx: bigint | null;
};

export const resolveCollectionBeginSpendCapMicroStx = (
  params: CollectionBeginSpendCapParams
) => {
  const mintCap = resolveMintBeginSpendCapMicroStx(params);
  if (mintCap === null) {
    return null;
  }
  const protocolFee = params.protocolFeeMicroStx;
  if (protocolFee === null || protocolFee < 0n) {
    return null;
  }
  return mintCap + protocolFee;
};

type SealSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  /**
   * Real granular units read from the core. When the seal-relevant units are
   * all supplied the cap is the exact `seal-fee-for-chunks` amount; otherwise
   * only the legacy aggregate is known and a conservative bound is used.
   */
  feeUnits?: FeeUnitOverrides | null;
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

const toUnitBigInt = (
  value: number | bigint | null | undefined,
  fallback: bigint
) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'bigint') {
    return value >= 0n ? value : fallback;
  }
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }
  return BigInt(Math.round(value));
};

const isSuppliedUnit = (value: number | bigint | null | undefined) =>
  value !== null && value !== undefined;

const hasGranularSealUnits = (units?: FeeUnitOverrides | null) =>
  !!units &&
  isSuppliedUnit(units.sealFeeUnit) &&
  isSuppliedUnit(units.uploadChunkFeeUnit) &&
  isSuppliedUnit(units.uploadBatchFeeUnit);

const sealFeeMicroStxBigInt = (
  units: FeeUnitOverrides,
  totalChunks: bigint
) => {
  const chunkBatchSize = BigInt(FEE_BATCH_SIZE);
  const sealUnit = toUnitBigInt(units.sealFeeUnit, 0n);
  const chunkUnit = toUnitBigInt(units.uploadChunkFeeUnit, 0n);
  const batchUnit = toUnitBigInt(units.uploadBatchFeeUnit, 0n);
  const firstChunks =
    totalChunks > chunkBatchSize ? chunkBatchSize : totalChunks;
  const extraBatches =
    totalChunks <= chunkBatchSize
      ? 0n
      : (totalChunks - chunkBatchSize + chunkBatchSize - 1n) / chunkBatchSize;
  return sealUnit + firstChunks * chunkUnit + extraBatches * batchUnit;
};

export const resolveSealSpendCapMicroStx = (params: SealSpendCapParams) => {
  const feeUnit = toPositiveProtocolFee(params.protocolFeeMicroStx);
  const totalChunks = toPositiveChunkCount(params.totalChunks);
  if (feeUnit === null || totalChunks === null) {
    return null;
  }
  if (hasGranularSealUnits(params.feeUnits)) {
    return sealFeeMicroStxBigInt(params.feeUnits!, totalChunks);
  }
  // Only the legacy aggregate `get-fee-unit` is known, which cannot express
  // upload-chunk-fee-unit. Keep the conservative `aggregate * (1 + ceil(n/32))`
  // bound: it is >= the real seal fee for every unit configuration seen on
  // chain, and a cap that is too LOW aborts the seal after the begin fee and
  // every upload batch have already been paid.
  const chunkBatchSize = BigInt(FEE_BATCH_SIZE);
  const feeBatches = (totalChunks + chunkBatchSize - 1n) / chunkBatchSize;
  return feeUnit * (1n + feeBatches);
};

type SmallMintSingleTxSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: FeeUnitOverrides | null;
};

/**
 * Headroom applied on top of `single-tx-fee-for-chunks` so a modest admin bump
 * to single-tx-fee-unit or upload-chunk-fee-unit does not abort the mint. The
 * fee units are admin-mutable, so the cap cannot be exact and still be safe.
 */
export const SINGLE_TX_SPEND_CAP_SAFETY_MULTIPLIER = 2n;

/**
 * Spend cap for the CORE-NATIVE one-transaction route (`mint-single-tx` and its
 * recursive / relationship variants).
 *
 * The core charges `single-tx-fee-unit + n * upload-chunk-fee-unit` here — a
 * different formula from the staged flow, not begin_fee + seal_fee. Computing
 * begin + seal produced a cap ~27x the real fee at 1 chunk (300000 vs 11000)
 * and ~7x at 32 chunks, so the deny-mode guard was nominal.
 */
export const resolveSmallMintSingleTxSpendCapMicroStx = (
  params: SmallMintSingleTxSpendCapParams
) => {
  const aggregate = toPositiveProtocolFee(params.protocolFeeMicroStx);
  const totalChunks = toPositiveChunkCount(params.totalChunks);
  if (aggregate === null || totalChunks === null) {
    return null;
  }
  const singleTxUnit = toUnitBigInt(
    params.feeUnits?.singleTxFeeUnit,
    BigInt(OBSERVED_SINGLE_TX_FEE_UNIT_MICROSTX)
  );
  const chunkUnit = toUnitBigInt(
    params.feeUnits?.uploadChunkFeeUnit,
    BigInt(OBSERVED_UPLOAD_CHUNK_FEE_UNIT_MICROSTX)
  );
  const singleTxFee = singleTxUnit + totalChunks * chunkUnit;
  return singleTxFee * SINGLE_TX_SPEND_CAP_SAFETY_MULTIPLIER;
};

/**
 * Spend cap for the EXTERNAL small-mint helper route
 * (xtrata-small-mint-v1.x `mint-small-single-tx`).
 *
 * One wallet transaction, but the helper internally calls begin-or-get ->
 * add-chunk-batch -> seal-inscription on the core (xtrata-small-mint-v1.1.clar
 * lines 75-84), so the core charges the STAGED fees: begin_fee + seal_fee(n).
 * `single-tx-fee-for-chunks` does NOT apply to this route.
 */
export const resolveHelperSmallMintSpendCapMicroStx = (
  params: SmallMintSingleTxSpendCapParams
) => {
  const aggregate = toPositiveProtocolFee(params.protocolFeeMicroStx);
  const sealFee = resolveSealSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (aggregate === null || sealFee === null) {
    return null;
  }
  const beginFee = toUnitBigInt(params.feeUnits?.beginFeeUnit, aggregate);
  return beginFee + sealFee;
};

type BatchSealSpendCapParams = {
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: FeeUnitOverrides | null;
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
  feeUnits?: FeeUnitOverrides | null;
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

type SmallMintSingleTxPostConditionParams = {
  sender?: string | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: number | bigint | null;
  feeUnits?: FeeUnitOverrides | null;
};

/** Deny-mode cap for the core-native `mint-single-tx` route. */
export const buildSmallMintSingleTxStxPostConditions = (
  params: SmallMintSingleTxPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const spendCap = resolveSmallMintSingleTxSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (spendCap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      spendCap
    )
  ];
};

/**
 * Deny-mode cap for the external small-mint HELPER route, which pays the staged
 * begin + seal fees rather than the single-tx fee.
 */
export const buildHelperSmallMintStxPostConditions = (
  params: SmallMintSingleTxPostConditionParams
): PostCondition[] | null => {
  const sender = params.sender?.trim() ?? '';
  if (!sender) {
    return null;
  }
  const spendCap = resolveHelperSmallMintSpendCapMicroStx({
    protocolFeeMicroStx: params.protocolFeeMicroStx,
    totalChunks: params.totalChunks,
    feeUnits: params.feeUnits
  });
  if (spendCap === null) {
    return null;
  }
  return [
    makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      spendCap
    )
  ];
};

type BatchSealPostConditionParams = {
  sender?: string | null;
  protocolFeeMicroStx: bigint | null;
  totalChunks: Array<number | bigint>;
  feeUnits?: FeeUnitOverrides | null;
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

const TOKEN_PATTERN = /^\d+$/;
const SPLIT_PATTERN = /[,\s]+/;

export type DependencyParseResult = {
  ids: bigint[];
  invalidTokens: string[];
};

export type DependencyValidation = {
  ok: boolean;
  reason?: string;
};

export function parseDependencyInput(raw: string): DependencyParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ids: [], invalidTokens: [] };
  }

  const tokens = trimmed.split(SPLIT_PATTERN).filter(Boolean);
  const ids: bigint[] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    if (TOKEN_PATTERN.test(token)) {
      ids.push(BigInt(token));
    } else {
      invalidTokens.push(token);
    }
  }

  return { ids, invalidTokens };
}

export function normalizeDependencyIds(ids: bigint[]): bigint[] {
  const unique = Array.from(new Set(ids));
  unique.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return unique;
}

export function mergeDependencySources(...sources: bigint[][]): bigint[] {
  const merged: bigint[] = [];
  for (const source of sources) {
    merged.push(...source);
  }
  return normalizeDependencyIds(merged);
}

export function validateDependencyIds(ids: bigint[]): DependencyValidation {
  if (ids.length > 50) {
    return { ok: false, reason: 'max-50' };
  }
  for (const id of ids) {
    if (id < 0n) {
      return { ok: false, reason: 'negative-id' };
    }
  }
  if (new Set(ids).size !== ids.length) {
    return { ok: false, reason: 'duplicate-ids' };
  }
  return { ok: true };
}

export function toDependencyStrings(ids: bigint[]): string[] {
  return ids.map((id) => id.toString());
}

export function fromDependencyStrings(ids: string[]): bigint[] {
  const parsed: bigint[] = [];
  for (const token of ids) {
    if (TOKEN_PATTERN.test(token)) {
      parsed.push(BigInt(token));
    }
  }
  return normalizeDependencyIds(parsed);
}

export type MintAttempt = {
  contractId: string;
  expectedHashHex: string;
  fileName: string | null;
  mimeType: string;
  totalBytes: number;
  totalChunks: number;
  batchSize: number;
  tokenUri: string | null;
  dependencyIds?: string[];
  updatedAt: number;
};

type MintAttemptRecord = {
  id: string;
  value: MintAttempt;
  timestamp: number;
};

const DB_NAME = 'XtrataMint';
const DB_VERSION = 1;
const STORE_NAME = 'mint-attempts';
const STORAGE_PREFIX = 'xtrata.mint.attempt.';

let dbPromise: Promise<IDBDatabase | null> | null = null;

const isIndexedDbAvailable = () =>
  typeof indexedDB !== 'undefined' && indexedDB !== null;

const openDB = () => {
  if (!isIndexedDbAvailable()) {
    return Promise.resolve(null);
  }
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = () => {
      resolve(null);
    };
  });
  return dbPromise;
};

const buildKey = (contractId: string) => `${STORAGE_PREFIX}${contractId}`;

const loadFromStorage = (contractId: string): MintAttempt | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  const raw = window.localStorage.getItem(buildKey(contractId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as MintAttempt;
  } catch {
    return null;
  }
};

const saveToStorage = (attempt: MintAttempt) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(buildKey(attempt.contractId), JSON.stringify(attempt));
  } catch {
    // Ignore storage write failures.
  }
};

const clearFromStorage = (contractId: string) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  window.localStorage.removeItem(buildKey(contractId));
};

export const loadMintAttempt = async (contractId: string): Promise<MintAttempt | null> => {
  const db = await openDB();
  if (!db) {
    return loadFromStorage(contractId);
  }
  const key = buildKey(contractId);
  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const record = req.result as MintAttemptRecord | undefined;
        resolve(record?.value ?? null);
      };
      req.onerror = () => {
        resolve(loadFromStorage(contractId));
      };
    } catch {
      resolve(loadFromStorage(contractId));
    }
  });
};

export const saveMintAttempt = async (attempt: MintAttempt): Promise<void> => {
  const db = await openDB();
  if (!db) {
    saveToStorage(attempt);
    return;
  }
  const key = buildKey(attempt.contractId);
  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: MintAttemptRecord = {
        id: key,
        value: attempt,
        timestamp: Date.now()
      };
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        saveToStorage(attempt);
        resolve();
      };
    } catch {
      saveToStorage(attempt);
      resolve();
    }
  });
};

export const clearMintAttempt = async (contractId: string): Promise<void> => {
  const db = await openDB();
  if (!db) {
    clearFromStorage(contractId);
    return;
  }
  const key = buildKey(contractId);
  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        clearFromStorage(contractId);
        resolve();
      };
    } catch {
      clearFromStorage(contractId);
      resolve();
    }
  });
};

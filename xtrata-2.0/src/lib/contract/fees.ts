import { FEE_BATCH_SIZE } from '../chunking/hash';

export const MICROSTX_PER_STX = 1_000_000;

export const DEFAULT_FEE_UNIT_MICROSTX = 100_000;

/**
 * The v3.2.x core does NOT charge one flat fee unit. It keeps five independent,
 * admin-mutable data vars (see contracts/clarinet/contracts/xtrata-v3.2.3.clar
 * lines 129-133) and combines them with two different formulas:
 *
 *   seal_fee(n)      = seal-fee-unit
 *                    + min(n, 32) * upload-chunk-fee-unit
 *                    + additional_batches(n) * upload-batch-fee-unit
 *   single_tx_fee(n) = single-tx-fee-unit + n * upload-chunk-fee-unit
 *   begin_fee        = begin-fee-unit
 *
 * (xtrata-v3.2.3.clar lines 415-442: first-batch-chunks / additional-batches /
 * seal-fee-for-chunks / single-tx-fee-for-chunks.)
 *
 * The legacy `get-fee-unit` read-only still exists and returns a single
 * aggregate number, which cannot express the two units that differ from it.
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
 * on 2026-08-03. Two of them differ from the contract source's compiled
 * defaults, because the admin has since lowered them:
 *
 *   get-begin-fee-unit         100000   (source default 100000)
 *   get-upload-chunk-fee-unit    1000   (source default   2000)  <- lowered
 *   get-upload-batch-fee-unit  100000   (source default 100000)
 *   get-seal-fee-unit          100000   (source default 100000)
 *   get-single-tx-fee-unit      10000   (source default 100000)  <- lowered
 *   get-fee-unit (aggregate)   100000
 *
 * Every one of these is ADMIN-MUTABLE (set-begin-fee-unit and friends), so
 * these are observed fallbacks only. A caller that can read the chain should
 * pass real units into getFeeSchedule rather than rely on them.
 */
export const OBSERVED_FEE_UNITS_MICROSTX: FeeUnits = {
  beginFeeUnit: 100_000,
  uploadChunkFeeUnit: 1_000,
  uploadBatchFeeUnit: 100_000,
  sealFeeUnit: 100_000,
  singleTxFeeUnit: 10_000
};

/**
 * The two units the legacy aggregate `get-fee-unit` cannot express. Observed on
 * mainnet 2026-08-03 (see OBSERVED_FEE_UNITS_MICROSTX); admin-mutable.
 */
export const OBSERVED_UPLOAD_CHUNK_FEE_UNIT_MICROSTX =
  OBSERVED_FEE_UNITS_MICROSTX.uploadChunkFeeUnit;
export const OBSERVED_SINGLE_TX_FEE_UNIT_MICROSTX =
  OBSERVED_FEE_UNITS_MICROSTX.singleTxFeeUnit;

export type FeeSchedule = {
  model: 'fee-unit';
  /**
   * Legacy aggregate unit, kept for the admin/meta panels that display "the fee
   * unit". Fee ARITHMETIC must go through `units`, never through this number.
   */
  feeUnitMicroStx: number;
  units: FeeUnits;
};

export type FeeEstimate = {
  beginMicroStx: number;
  sealMicroStx: number;
  totalMicroStx: number;
  /**
   * Number of upload batches charged at `upload-batch-fee-unit`, i.e. the
   * contract's `additional-batches` (batches AFTER the first 32 chunks, which
   * are charged per chunk instead). Not `ceil(chunks / 32)`.
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
 * Resolve the five granular units.
 *
 * `aggregateMicroStx` is the legacy `get-fee-unit` value. It can stand in for
 * begin / seal / upload-batch (all three equal the aggregate on mainnet), but
 * NOT for upload-chunk or single-tx, which are lower. Those two fall back to
 * the values observed on mainnet 2026-08-03 unless real units are supplied.
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
  contract: {
    protocolVersion?: string;
    contractName?: string;
  },
  feeUnitMicroStx?: number | null,
  units?: FeeUnitOverrides | null
): FeeSchedule => {
  return {
    model: 'fee-unit',
    feeUnitMicroStx: normalizeMicroStx(feeUnitMicroStx),
    units: resolveFeeUnits(feeUnitMicroStx, units)
  };
};

const normalizeTotalChunks = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.floor(value);
};

/**
 * Contract `first-batch-chunks`: chunks charged per chunk at
 * `upload-chunk-fee-unit` (the first batch, capped at MAX-UPLOAD-BATCH-SIZE).
 */
export const firstBatchChunks = (totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  return chunks > FEE_BATCH_SIZE ? FEE_BATCH_SIZE : chunks;
};

/**
 * Contract `additional-batches`: batches AFTER the first, each charged at
 * `upload-batch-fee-unit`.
 */
export const additionalBatches = (totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  if (chunks <= FEE_BATCH_SIZE) {
    return 0;
  }
  return Math.ceil((chunks - FEE_BATCH_SIZE) / FEE_BATCH_SIZE);
};

/**
 * Contract `seal-fee-for-chunks` — the fee charged on seal-inscription /
 * seal-recursive in the staged begin -> upload -> seal flow.
 */
export const sealFeeForChunks = (units: FeeUnits, totalChunks: number) => {
  const chunks = normalizeTotalChunks(totalChunks);
  return (
    units.sealFeeUnit +
    firstBatchChunks(chunks) * units.uploadChunkFeeUnit +
    additionalBatches(chunks) * units.uploadBatchFeeUnit
  );
};

/**
 * Contract `single-tx-fee-for-chunks` — the fee charged by the core-native
 * one-transaction mint-single-tx route. NOT begin_fee + seal_fee: the core
 * charges a completely separate flat unit plus a per-chunk unit.
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

/**
 * Fee for the core-native one-transaction mint route (mint-single-tx and its
 * recursive/relationship variants).
 */
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

/**
 * Headroom applied to spend caps on top of the computed fee. Every fee unit is
 * admin-mutable and the app usually only reads the legacy aggregate, so an
 * exact cap can abort a transaction after earlier stages have already been
 * paid. Display uses `estimateContractFees`; post-conditions use these caps.
 */
export const SINGLE_TX_SPEND_CAP_SAFETY_MULTIPLIER = 2;

export type FeeCapEstimate = {
  beginMicroStx: number;
  sealMicroStx: number;
  totalMicroStx: number;
  singleTxMicroStx: number;
};

/**
 * Conservative spend caps for deny-mode post-conditions.
 *
 * The seal cap keeps the pre-granular `aggregate * (1 + ceil(n / 32))` bound,
 * which dominates the real granular seal fee for every unit configuration seen
 * on chain (it is >= the granular fee whenever
 * upload-chunk-fee-unit <= aggregate / 32). A seal cap that is too LOW aborts
 * the seal after the begin fee and every upload batch have already been spent,
 * so the bound is deliberately loose.
 */
export const estimateContractFeeCaps = (params: {
  schedule: FeeSchedule;
  totalChunks: number;
}): FeeCapEstimate => {
  const totalChunks = normalizeTotalChunks(params.totalChunks);
  const units = params.schedule.units;
  const aggregate = params.schedule.feeUnitMicroStx;

  const beginMicroStx = Math.max(aggregate, units.beginFeeUnit);
  const conservativeSeal =
    totalChunks > 0
      ? aggregate * (1 + Math.ceil(totalChunks / FEE_BATCH_SIZE))
      : 0;
  const sealMicroStx = Math.max(
    conservativeSeal,
    totalChunks > 0 ? sealFeeForChunks(units, totalChunks) : 0
  );
  const singleTxMicroStx =
    totalChunks > 0
      ? singleTxFeeForChunks(units, totalChunks) *
        SINGLE_TX_SPEND_CAP_SAFETY_MULTIPLIER
      : 0;

  return {
    beginMicroStx,
    sealMicroStx,
    totalMicroStx: beginMicroStx + sealMicroStx,
    singleTxMicroStx
  };
};

/** Per-item `estimateContractFeeCaps`, summed. */
export const estimateBatchContractFeeCaps = (params: {
  schedule: FeeSchedule;
  totalChunks: number[];
}): FeeCapEstimate => {
  const items = params.totalChunks.map((count) =>
    estimateContractFeeCaps({ schedule: params.schedule, totalChunks: count })
  );
  const beginMicroStx = items.reduce((sum, item) => sum + item.beginMicroStx, 0);
  const sealMicroStx = items.reduce((sum, item) => sum + item.sealMicroStx, 0);
  const singleTxMicroStx = items.reduce(
    (sum, item) => sum + item.singleTxMicroStx,
    0
  );
  return {
    beginMicroStx,
    sealMicroStx,
    totalMicroStx: beginMicroStx + sealMicroStx,
    singleTxMicroStx
  };
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

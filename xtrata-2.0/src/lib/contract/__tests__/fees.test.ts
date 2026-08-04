import { describe, expect, it } from 'vitest';
import {
  additionalBatches,
  DEFAULT_FEE_UNIT_MICROSTX,
  estimateBatchContractFees,
  estimateContractFeeCaps,
  estimateContractFees,
  estimateSingleTxContractFee,
  firstBatchChunks,
  getFeeSchedule,
  OBSERVED_FEE_UNITS_MICROSTX,
  resolveFeeUnits,
  sealFeeForChunks,
  singleTxFeeForChunks,
  type FeeUnits
} from '../fees';
import { FEE_BATCH_SIZE } from '../../chunking/hash';
import { resolveSmallMintSingleTxSpendCapMicroStx } from '../../../../packages/xtrata-sdk/src/mint';

/**
 * Fee units read from mainnet
 * SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 on 2026-08-03.
 *
 * EVERY ONE OF THESE IS ADMIN-MUTABLE (set-begin-fee-unit and friends). They are
 * pinned here on purpose: if the admin changes a unit on chain, this test fails
 * loudly instead of the app quietly quoting and capping the wrong amount.
 * upload-chunk (1000) and single-tx (10000) are BELOW the contract source's
 * compiled defaults (2000 / 100000) because they were lowered after deploy.
 */
const LIVE_UNITS: FeeUnits = {
  beginFeeUnit: 100_000,
  uploadChunkFeeUnit: 1_000,
  uploadBatchFeeUnit: 100_000,
  sealFeeUnit: 100_000,
  singleTxFeeUnit: 10_000
};

/** Live value of the legacy aggregate `get-fee-unit`, same date. */
const LIVE_AGGREGATE_FEE_UNIT = 100_000;

/**
 * Independent transcription of xtrata-v3.2.3.clar lines 415-442, used as the
 * differential oracle. Deliberately NOT importing the implementation's helpers.
 */
const contractFirstBatchChunks = (n: number) => (n > 32 ? 32 : n);
const contractAdditionalBatches = (n: number) =>
  n <= 32 ? 0 : Math.ceil((n - 32) / 32);
const contractSealFee = (units: FeeUnits, n: number) =>
  units.sealFeeUnit +
  contractFirstBatchChunks(n) * units.uploadChunkFeeUnit +
  contractAdditionalBatches(n) * units.uploadBatchFeeUnit;
const contractSingleTxFee = (units: FeeUnits, n: number) =>
  units.singleTxFeeUnit + n * units.uploadChunkFeeUnit;

const liveSchedule = getFeeSchedule(
  { protocolVersion: '3.2.3' },
  LIVE_AGGREGATE_FEE_UNIT,
  LIVE_UNITS
);

describe('live fee units', () => {
  it('pins every granular unit to its mainnet value (all admin-mutable)', () => {
    expect(OBSERVED_FEE_UNITS_MICROSTX.beginFeeUnit).toBe(100_000);
    expect(OBSERVED_FEE_UNITS_MICROSTX.uploadChunkFeeUnit).toBe(1_000);
    expect(OBSERVED_FEE_UNITS_MICROSTX.uploadBatchFeeUnit).toBe(100_000);
    expect(OBSERVED_FEE_UNITS_MICROSTX.sealFeeUnit).toBe(100_000);
    expect(OBSERVED_FEE_UNITS_MICROSTX.singleTxFeeUnit).toBe(10_000);
    expect(OBSERVED_FEE_UNITS_MICROSTX).toEqual(LIVE_UNITS);
  });

  it('keeps the fee divisor at the contract MAX-UPLOAD-BATCH-SIZE', () => {
    // Not MAX_UPLOAD_BATCH_SIZE (30, what the client sends) and not
    // MAX_BATCH_SIZE (50, the purge list length).
    expect(FEE_BATCH_SIZE).toBe(32);
  });
});

describe('contract fee formulas', () => {
  it('matches the live-measured seal spot checks', () => {
    expect(sealFeeForChunks(LIVE_UNITS, 1)).toBe(101_000);
    expect(sealFeeForChunks(LIVE_UNITS, 32)).toBe(132_000);
    expect(sealFeeForChunks(LIVE_UNITS, 33)).toBe(232_000);
    expect(sealFeeForChunks(LIVE_UNITS, 64)).toBe(232_000);
    expect(sealFeeForChunks(LIVE_UNITS, 65)).toBe(332_000);
    expect(sealFeeForChunks(LIVE_UNITS, 643)).toBe(2_132_000);
  });

  it('matches the live-measured single-tx spot checks', () => {
    expect(singleTxFeeForChunks(LIVE_UNITS, 1)).toBe(11_000);
    expect(singleTxFeeForChunks(LIVE_UNITS, 32)).toBe(42_000);
  });

  // Pins the 32/33 boundary from both sides: 32 chunks are all charged per
  // chunk, 33 adds a whole additional batch fee.
  const table = [1, 5, 16, 31, 32, 33, 50, 64, 65, 128, 320, 643];

  it.each(table)('reproduces the contract formulas at %i chunks', (chunks) => {
    expect(firstBatchChunks(chunks)).toBe(contractFirstBatchChunks(chunks));
    expect(additionalBatches(chunks)).toBe(contractAdditionalBatches(chunks));
    expect(sealFeeForChunks(LIVE_UNITS, chunks)).toBe(
      contractSealFee(LIVE_UNITS, chunks)
    );
    expect(singleTxFeeForChunks(LIVE_UNITS, chunks)).toBe(
      contractSingleTxFee(LIVE_UNITS, chunks)
    );
  });

  it('pins the whole table to explicit numbers', () => {
    expect(table.map((n) => sealFeeForChunks(LIVE_UNITS, n))).toEqual([
      101_000, 105_000, 116_000, 131_000, 132_000, 232_000, 232_000, 232_000,
      332_000, 432_000, 1_032_000, 2_132_000
    ]);
    expect(table.map((n) => singleTxFeeForChunks(LIVE_UNITS, n))).toEqual([
      11_000, 15_000, 26_000, 41_000, 42_000, 43_000, 60_000, 74_000, 75_000,
      138_000, 330_000, 653_000
    ]);
  });

  it('charges no additional batch fee at or below the first batch', () => {
    expect(additionalBatches(32)).toBe(0);
    expect(additionalBatches(33)).toBe(1);
    expect(firstBatchChunks(33)).toBe(32);
    expect(sealFeeForChunks(LIVE_UNITS, 33) - sealFeeForChunks(LIVE_UNITS, 32)).toBe(
      LIVE_UNITS.uploadBatchFeeUnit
    );
  });
});

describe('fee schedule', () => {
  it('uses supplied granular units verbatim', () => {
    const schedule = getFeeSchedule(
      { protocolVersion: '3.2.3' },
      LIVE_AGGREGATE_FEE_UNIT,
      LIVE_UNITS
    );
    expect(schedule.model).toBe('fee-unit');
    expect(schedule.feeUnitMicroStx).toBe(LIVE_AGGREGATE_FEE_UNIT);
    expect(schedule.units).toEqual(LIVE_UNITS);
  });

  it('falls back to observed defaults for the units the aggregate cannot express', () => {
    // get-fee-unit is a single number; it stands in for begin / seal /
    // upload-batch (equal to it on chain) but NOT for upload-chunk or
    // single-tx, which are lower.
    const units = resolveFeeUnits(250_000);
    expect(units.beginFeeUnit).toBe(250_000);
    expect(units.sealFeeUnit).toBe(250_000);
    expect(units.uploadBatchFeeUnit).toBe(250_000);
    expect(units.uploadChunkFeeUnit).toBe(
      OBSERVED_FEE_UNITS_MICROSTX.uploadChunkFeeUnit
    );
    expect(units.singleTxFeeUnit).toBe(
      OBSERVED_FEE_UNITS_MICROSTX.singleTxFeeUnit
    );
  });

  it('defaults the fee unit when missing', () => {
    const schedule = getFeeSchedule({ protocolVersion: '1.1.1' }, null);
    expect(schedule.feeUnitMicroStx).toBe(DEFAULT_FEE_UNIT_MICROSTX);
    expect(schedule.units.beginFeeUnit).toBe(DEFAULT_FEE_UNIT_MICROSTX);
  });
});

describe('contract fee estimates', () => {
  it('estimates the staged flow from the granular units', () => {
    const estimate = estimateContractFees({
      schedule: liveSchedule,
      totalChunks: 120
    });
    // OLD expectation was feeBatches 4 (ceil(120/32)) and sealMicroStx
    // feeUnit x (1 + 4). Both were wrong: the contract charges the first 32
    // chunks PER CHUNK at upload-chunk-fee-unit and only the batches AFTER
    // those at upload-batch-fee-unit, so feeBatches is additional-batches
    // (ceil((120-32)/32) = 3), and the seal fee is
    // 100000 + 32x1000 + 3x100000 = 432000, not 500000.
    expect(estimate.feeBatches).toBe(3);
    expect(estimate.beginMicroStx).toBe(100_000);
    expect(estimate.sealMicroStx).toBe(432_000);
    expect(estimate.totalMicroStx).toBe(532_000);
  });

  it('estimates fees for a 250000 aggregate with no granular units', () => {
    const schedule = getFeeSchedule({ protocolVersion: '1.1.1' }, 250_000);
    const estimate = estimateContractFees({ schedule, totalChunks: 120 });
    // OLD expectations: feeBatches 4, sealMicroStx 1250000, totalMicroStx
    // 1500000 -- all derived from one flat unit. The contract has never charged
    // that way; with upload-chunk-fee-unit at its observed 1000 the seal fee is
    // 250000 + 32x1000 + 3x250000 = 1032000.
    expect(estimate.feeBatches).toBe(3);
    expect(estimate.beginMicroStx).toBe(250_000);
    expect(estimate.sealMicroStx).toBe(1_032_000);
    expect(estimate.totalMicroStx).toBe(1_282_000);
  });

  it('reports zero seal fee with no chunks', () => {
    const estimate = estimateContractFees({
      schedule: liveSchedule,
      totalChunks: 0
    });
    expect(estimate.sealMicroStx).toBe(0);
    expect(estimate.feeBatches).toBe(0);
  });

  it('quotes the core-native single-tx route separately', () => {
    expect(
      estimateSingleTxContractFee({ schedule: liveSchedule, totalChunks: 1 })
    ).toBe(11_000);
    expect(
      estimateSingleTxContractFee({ schedule: liveSchedule, totalChunks: 32 })
    ).toBe(42_000);
    expect(
      estimateSingleTxContractFee({ schedule: liveSchedule, totalChunks: 0 })
    ).toBe(0);
  });

  it('estimates batch fees by summing per-item fees', () => {
    const schedule = getFeeSchedule({ protocolVersion: '1.1.1' }, 250_000);
    const estimate = estimateBatchContractFees({
      schedule,
      totalChunks: [120, 10]
    });
    const singleA = estimateContractFees({ schedule, totalChunks: 120 });
    const singleB = estimateContractFees({ schedule, totalChunks: 10 });

    expect(estimate.itemCount).toBe(2);
    expect(estimate.beginMicroStx).toBe(singleA.beginMicroStx + singleB.beginMicroStx);
    expect(estimate.sealMicroStx).toBe(singleA.sealMicroStx + singleB.sealMicroStx);
    expect(estimate.totalMicroStx).toBe(estimate.beginMicroStx + estimate.sealMicroStx);
  });
});

describe('spend caps', () => {
  it('keeps the seal cap at or above the real granular seal fee', () => {
    for (const chunks of [1, 5, 16, 31, 32, 33, 50, 64, 65, 128, 320, 643]) {
      const caps = estimateContractFeeCaps({
        schedule: liveSchedule,
        totalChunks: chunks
      });
      expect(caps.sealMicroStx).toBeGreaterThanOrEqual(
        contractSealFee(LIVE_UNITS, chunks)
      );
    }
  });

  it('caps the single-tx route from the single-tx formula, not begin + seal', () => {
    const caps = estimateContractFeeCaps({
      schedule: liveSchedule,
      totalChunks: 1
    });
    const realFee = contractSingleTxFee(LIVE_UNITS, 1); // 11000
    // The old cap was begin + staged seal = 100000 + 200000 = 300000, i.e.
    // ~27x the real fee. The cap now carries a documented 2x headroom only.
    expect(caps.singleTxMicroStx).toBe(realFee * 2);
    expect(caps.singleTxMicroStx / realFee).toBeLessThanOrEqual(3);
    expect(caps.singleTxMicroStx).toBeLessThan(300_000);
  });
});

describe('sdk single-tx spend cap (differential)', () => {
  const realFeeMicroStx = (chunks: number) =>
    BigInt(contractSingleTxFee(LIVE_UNITS, chunks));

  it.each([
    [1, 11_000n],
    [2, 12_000n],
    [30, 40_000n],
    [32, 42_000n]
  ])(
    'derives the cap at %i chunks from single-tx-fee-for-chunks',
    (chunks, expectedFee) => {
      const cap = resolveSmallMintSingleTxSpendCapMicroStx({
        protocolFeeMicroStx: BigInt(LIVE_AGGREGATE_FEE_UNIT),
        totalChunks: chunks
      });
      expect(realFeeMicroStx(chunks)).toBe(expectedFee);
      expect(cap).toBe(expectedFee * 2n);
    }
  );

  it('is no longer ~27x the real fee at 1 chunk', () => {
    const cap = resolveSmallMintSingleTxSpendCapMicroStx({
      protocolFeeMicroStx: BigInt(LIVE_AGGREGATE_FEE_UNIT),
      totalChunks: 1
    })!;
    const realFee = realFeeMicroStx(1);
    // Before: 300000 / 11000 = 27.27x. After: 2x.
    expect(cap).toBe(22_000n);
    expect(Number(cap) / Number(realFee)).toBeLessThanOrEqual(3);
    expect(Number(cap) / Number(realFee)).toBeGreaterThanOrEqual(1);
  });

  it('is no longer 7x the real fee at 32 chunks', () => {
    const cap = resolveSmallMintSingleTxSpendCapMicroStx({
      protocolFeeMicroStx: BigInt(LIVE_AGGREGATE_FEE_UNIT),
      totalChunks: 32
    })!;
    // Before: 100000 + 100000 x (1 + 1) = 300000, i.e. 7.14x the real 42000.
    expect(cap).toBe(84_000n);
    expect(Number(cap) / Number(realFeeMicroStx(32))).toBeLessThanOrEqual(3);
  });

  it('uses real granular units when the caller supplies them', () => {
    const cap = resolveSmallMintSingleTxSpendCapMicroStx({
      protocolFeeMicroStx: BigInt(LIVE_AGGREGATE_FEE_UNIT),
      totalChunks: 4,
      feeUnits: { singleTxFeeUnit: 100_000n, uploadChunkFeeUnit: 2_000n }
    });
    // Contract-source defaults rather than the observed live units.
    expect(cap).toBe((100_000n + 4n * 2_000n) * 2n);
  });
});

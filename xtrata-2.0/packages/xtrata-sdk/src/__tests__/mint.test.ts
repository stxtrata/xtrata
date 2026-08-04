import { describe, expect, it } from 'vitest';
import { FungibleConditionCode } from '@stacks/transactions';
import {
  additionalBatches,
  batchChunks,
  buildHelperSmallMintStxPostConditions,
  buildSmallMintSingleTxStxPostConditions,
  buildSealStxPostConditions,
  DEFAULT_BATCH_SIZE,
  firstBatchChunks,
  MAX_BATCH_SIZE,
  MAX_UPLOAD_BATCH_SIZE,
  normalizeDependencyIds,
  OBSERVED_FEE_UNITS_MICROSTX,
  parseDependencyInput,
  resolveCollectionBeginSpendCapMicroStx,
  resolveHelperSmallMintSpendCapMicroStx,
  resolveSmallMintSingleTxSpendCapMicroStx,
  resolveSealSpendCapMicroStx,
  sealFeeForChunks,
  singleTxFeeForChunks,
  validateDependencyIds
} from '../mint';

/**
 * Live mainnet units for SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3,
 * read 2026-08-03. All five are ADMIN-MUTABLE, so they are pinned here: a change
 * on chain must surface as a failing test rather than silently wrong maths.
 */
const LIVE_UNITS = {
  beginFeeUnit: 100_000,
  uploadChunkFeeUnit: 1_000,
  uploadBatchFeeUnit: 100_000,
  sealFeeUnit: 100_000,
  singleTxFeeUnit: 10_000
};

describe('sdk mint helpers', () => {
  it('uses a 30-chunk hard upload ceiling while preserving the contract ABI max', () => {
    const chunks = Array.from({ length: 65 }, (_, index) => new Uint8Array([index]));
    const batches = batchChunks(chunks);

    expect(MAX_BATCH_SIZE).toBe(50);
    expect(MAX_UPLOAD_BATCH_SIZE).toBe(30);
    expect(DEFAULT_BATCH_SIZE).toBe(30);
    expect(batches.map((batch) => batch.length)).toEqual([30, 30, 5]);
    expect(batchChunks(chunks, 50).map((batch) => batch.length)).toEqual([
      30,
      30,
      5
    ]);
  });

  it('computes collection begin cap including protocol fee', () => {
    expect(
      resolveCollectionBeginSpendCapMicroStx({
        mintPrice: 1_000_000n,
        activePhaseMintPrice: 2_000_000n,
        protocolFeeMicroStx: 100_000n
      })
    ).toBe(2_100_000n);
  });

  it('pins the live granular fee units (all admin-mutable)', () => {
    expect(OBSERVED_FEE_UNITS_MICROSTX).toEqual(LIVE_UNITS);
  });

  it('reproduces the contract seal and single-tx formulas', () => {
    // xtrata-v3.2.3.clar lines 415-442, live units above.
    expect(sealFeeForChunks(LIVE_UNITS, 1)).toBe(101_000);
    expect(sealFeeForChunks(LIVE_UNITS, 32)).toBe(132_000);
    expect(sealFeeForChunks(LIVE_UNITS, 33)).toBe(232_000);
    expect(sealFeeForChunks(LIVE_UNITS, 64)).toBe(232_000);
    expect(sealFeeForChunks(LIVE_UNITS, 65)).toBe(332_000);
    expect(sealFeeForChunks(LIVE_UNITS, 643)).toBe(2_132_000);
    expect(singleTxFeeForChunks(LIVE_UNITS, 1)).toBe(11_000);
    expect(singleTxFeeForChunks(LIVE_UNITS, 32)).toBe(42_000);
    expect(firstBatchChunks(33)).toBe(32);
    expect(additionalBatches(32)).toBe(0);
    expect(additionalBatches(33)).toBe(1);
  });

  it('keeps the conservative seal cap when only the aggregate fee unit is known', () => {
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 120
      })
      // The aggregate cannot express upload-chunk-fee-unit, so the cap stays on
      // the loose aggregate x (1 + ceil(120/32)) bound. A seal cap that is too
      // LOW aborts after the begin fee and every upload batch are already paid.
    ).toBe(500_000n);
  });

  it('uses the exact granular seal fee when real units are supplied', () => {
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 120,
        feeUnits: {
          sealFeeUnit: 100_000n,
          uploadChunkFeeUnit: 1_000n,
          uploadBatchFeeUnit: 100_000n
        }
      })
      // 100000 + 32x1000 + ceil((120-32)/32)=3 x 100000
    ).toBe(432_000n);
  });

  it('builds STX post condition in deny-friendly format', () => {
    const conditions = buildSealStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n,
      totalChunks: 51
    });

    expect(conditions).toHaveLength(1);
    expect(conditions?.[0].conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(conditions?.[0].amount).toBe(300_000n);
  });

  it('derives the core-native single-tx cap from single-tx-fee-for-chunks', () => {
    // OLD expectation was 300_000n (begin + staged seal). The core charges
    // single-tx-fee-unit + n x upload-chunk-fee-unit for mint-single-tx, so the
    // real fee at 2 chunks is 12_000; the old cap was 25x it and the deny-mode
    // guard was nominal. Cap now carries a documented 2x headroom.
    expect(
      resolveSmallMintSingleTxSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 2
      })
    ).toBe(24_000n);
  });

  it('builds the core-native single-tx post condition from the same formula', () => {
    const conditions = buildSmallMintSingleTxStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n,
      totalChunks: 2
    });
    expect(conditions).toHaveLength(1);
    expect(conditions?.[0].conditionCode).toBe(FungibleConditionCode.LessEqual);
    // OLD expectation 300_000n; see the test above for why that was wrong.
    expect(conditions?.[0].amount).toBe(24_000n);
  });

  it('keeps the external helper route on the staged begin + seal fees', () => {
    // xtrata-small-mint-v1.1.clar lines 75-84: the helper runs begin-or-get ->
    // add-chunk-batch -> seal on the core, so single-tx-fee-for-chunks does NOT
    // apply and the cap must stay on begin + seal.
    expect(
      resolveHelperSmallMintSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 2
      })
    ).toBe(300_000n);

    const conditions = buildHelperSmallMintStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n,
      totalChunks: 2
    });
    expect(conditions?.[0].amount).toBe(300_000n);
  });

  it('parses and validates dependencies', () => {
    const parsed = parseDependencyInput('10, 8 10\n12');
    expect(parsed.invalidTokens).toEqual([]);
    expect(normalizeDependencyIds(parsed.ids)).toEqual([8n, 10n, 12n]);
    expect(validateDependencyIds([1n, 2n, 3n]).ok).toBe(true);
  });
});

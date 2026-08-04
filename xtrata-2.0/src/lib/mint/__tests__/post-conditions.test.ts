import { describe, expect, it } from 'vitest';
import { FungibleConditionCode } from '@stacks/transactions';
import {
  buildBatchSealStxPostConditions,
  buildCollectionBatchSealStxPostConditions,
  buildCollectionSmallSingleTxStxPostConditions,
  buildCollectionSealStxPostConditions,
  buildProtocolFeeStxPostConditions,
  buildSealStxPostConditions,
  buildMintBeginStxPostConditions,
  resolveCollectionBatchSealSpendCapMicroStx,
  resolveBatchSealSpendCapMicroStx,
  resolveCollectionBeginSpendCapMicroStx,
  resolveCollectionSmallSingleTxSpendCapMicroStx,
  resolveCollectionSealSpendCapMicroStx,
  resolveMintBeginSpendCapMicroStx,
  resolveSealSpendCapMicroStx
} from '../post-conditions';

describe('mint post conditions', () => {
  it('uses active phase mint price when present', () => {
    const cap = resolveMintBeginSpendCapMicroStx({
      mintPrice: 5_000_000n,
      activePhaseMintPrice: 7_500_000n
    });
    expect(cap).toBe(7_500_000n);
  });

  it('falls back to base mint price when active phase price is missing', () => {
    const cap = resolveMintBeginSpendCapMicroStx({
      mintPrice: 5_000_000n,
      activePhaseMintPrice: null
    });
    expect(cap).toBe(5_000_000n);
  });

  it('applies tighter additional cap when provided', () => {
    const cap = resolveMintBeginSpendCapMicroStx({
      mintPrice: 5_000_000n,
      activePhaseMintPrice: 6_000_000n,
      additionalCapMicroStx: 4_500_000n
    });
    expect(cap).toBe(4_500_000n);
  });

  it('never expands cap when additional cap is looser', () => {
    const cap = resolveMintBeginSpendCapMicroStx({
      mintPrice: 5_000_000n,
      additionalCapMicroStx: 9_000_000n
    });
    expect(cap).toBe(5_000_000n);
  });

  it('builds LessEqual STX post condition with resolved cap', () => {
    const postConditions = buildMintBeginStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      mintPrice: 5_000_000n,
      additionalCapMicroStx: 4_500_000n
    });

    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(condition?.amount).toBe(4_500_000n);
  });

  it('returns null when sender is missing or price is unavailable', () => {
    expect(
      buildMintBeginStxPostConditions({
        sender: '',
        mintPrice: 5_000_000n
      })
    ).toBeNull();

    expect(
      buildMintBeginStxPostConditions({
        sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
        mintPrice: null
      })
    ).toBeNull();
  });

  it('uses protocol fee only for collection begin spend cap', () => {
    const cap = resolveCollectionBeginSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n
    });
    expect(cap).toBe(100_000n);
  });

  it('returns null when collection protocol fee is missing', () => {
    const cap = resolveCollectionBeginSpendCapMicroStx({
      protocolFeeMicroStx: null
    });
    expect(cap).toBeNull();
  });

  it('adds optional begin fee to collection begin spend cap', () => {
    const cap = resolveCollectionBeginSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n,
      beginFeeMicroStx: 25_000n
    });
    expect(cap).toBe(125_000n);
  });

  it('supports legacy begin pricing by adding active mint price to begin cap', () => {
    const cap = resolveCollectionBeginSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n,
      mintPrice: 1_000_000n,
      activePhaseMintPrice: 1_111_111n,
      chargeMintPriceAtBegin: true
    });
    expect(cap).toBe(1_211_111n);
  });

  it('returns null for legacy begin pricing when mint price is unavailable', () => {
    const cap = resolveCollectionBeginSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n,
      mintPrice: null,
      activePhaseMintPrice: null,
      chargeMintPriceAtBegin: true
    });
    expect(cap).toBeNull();
  });

  it('builds protocol fee STX post condition', () => {
    const postConditions = buildProtocolFeeStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(condition?.amount).toBe(100_000n);
  });

  it('computes seal cap using fee-unit and chunk batch count', () => {
    const cap = resolveSealSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n,
      totalChunks: 51
    });
    // Only the legacy aggregate get-fee-unit is known here, so the cap stays on
    // the conservative aggregate x (1 + ceil(51/32)) bound.
    expect(cap).toBe(300_000n);
  });

  it('computes the exact granular seal cap when real units are supplied', () => {
    // Live mainnet units for xtrata-v3-2-3 read 2026-08-03 (admin-mutable):
    // seal 100000, upload-chunk 1000, upload-batch 100000.
    const feeUnits = {
      sealFeeUnit: 100_000n,
      uploadChunkFeeUnit: 1_000n,
      uploadBatchFeeUnit: 100_000n
    };
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 1,
        feeUnits
      })
    ).toBe(101_000n);
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 32,
        feeUnits
      })
    ).toBe(132_000n);
    // 32/33 boundary: chunk 33 adds a whole additional batch fee.
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 33,
        feeUnits
      })
    ).toBe(232_000n);
    expect(
      resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: 100_000n,
        totalChunks: 643,
        feeUnits
      })
    ).toBe(2_132_000n);
  });

  it('computes batch seal cap as the sum of item seal caps', () => {
    const cap = resolveBatchSealSpendCapMicroStx({
      protocolFeeMicroStx: 100_000n,
      totalChunks: [1, 50, 51]
    });
    // Fee batches divide by 32 (the contract's MAX-UPLOAD-BATCH-SIZE), not 50.
    // 2 + 3 + 3 batches-worth of feeUnit.
    expect(cap).toBe(800_000n);
  });

  it('builds seal post condition using computed seal cap', () => {
    const postConditions = buildSealStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n,
      totalChunks: 120
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    // Fee batches divide by 32 (the contract's MAX-UPLOAD-BATCH-SIZE), not 50.
    // 1 + ceil(120/32) = 5 units.
    expect(condition?.amount).toBe(500_000n);
  });

  it('builds batch seal post condition from selected item chunk counts', () => {
    const postConditions = buildBatchSealStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      protocolFeeMicroStx: 100_000n,
      totalChunks: [10, 200]
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    // Fee batches divide by 32 (the contract's MAX-UPLOAD-BATCH-SIZE), not 50.
    // 2 + 8 units.
    expect(condition?.amount).toBe(1_000_000n);
  });

  it('computes collection seal cap as mint price plus protocol seal fee', () => {
    const cap = resolveCollectionSealSpendCapMicroStx({
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: 1
    });
    expect(cap).toBe(1_200_000n);
  });

  it('computes collection batch seal cap as per-item mint prices plus protocol seal fees', () => {
    const cap = resolveCollectionBatchSealSpendCapMicroStx({
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: [1, 51]
    });
    expect(cap).toBe(2_500_000n);
  });

  it('builds collection seal post condition from mint price and chunk count', () => {
    const postConditions = buildCollectionSealStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: 1
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(condition?.amount).toBe(1_200_000n);
  });

  it('builds collection batch seal post condition from mint price and item chunks', () => {
    const postConditions = buildCollectionBatchSealStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: [1, 51]
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(condition?.amount).toBe(2_500_000n);
  });

  it('computes collection small single-tx cap as begin plus seal spend for v1.4 model', () => {
    const cap = resolveCollectionSmallSingleTxSpendCapMicroStx({
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: 1,
      chargeMintPriceAtBegin: false
    });
    expect(cap).toBe(1_300_000n);
  });

  it('supports collection small single-tx cap override for display-price seal pricing', () => {
    const cap = resolveCollectionSmallSingleTxSpendCapMicroStx({
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: 1,
      chargeMintPriceAtBegin: false,
      sealSpendCapMicroStx: 1_200_000n
    });
    expect(cap).toBe(1_300_000n);
  });

  it('builds collection small single-tx post condition from combined spend cap', () => {
    const postConditions = buildCollectionSmallSingleTxStxPostConditions({
      sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      mintPrice: 1_000_000n,
      protocolFeeMicroStx: 100_000n,
      totalChunks: 30,
      chargeMintPriceAtBegin: false
    });
    expect(postConditions).not.toBeNull();
    expect(postConditions).toHaveLength(1);
    const condition = postConditions?.[0];
    expect(condition?.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(condition?.amount).toBe(1_300_000n);
  });
});

/**
 * The seal cap must never sit below the fee the contract actually charges.
 *
 * The app divided chunk counts by MAX_BATCH_SIZE (50) to count fee batches. The
 * deployed contract charges per MAX-UPLOAD-BATCH-SIZE (u32), verified against
 * mainnet source for SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
 * (line 75, asserted at line 1067). Above 32 chunks the cap fell short, and the
 * post-condition aborted the seal AFTER the begin fee and every upload batch fee
 * had already been spent.
 *
 * Confirmed against the contract's own quote-staged-fee on 2026-08-02:
 *   32 chunks -> 132,000  (cap was 200,000, held)
 *   33 chunks -> 232,000  (cap was 200,000, ABORTED)
 *   65 chunks -> 332,000  (cap was 300,000, ABORTED)
 *
 * This pins the DIVISOR RELATIONSHIP, not the fee values. An admin changing a fee
 * unit must not break it, because the expectation is recomputed from feeUnit. A
 * divisor regression must break it.
 */
describe('seal spend cap covers the contract fee', () => {
  // Live fee variables, 2026-08-02. Only used to model the contract's formula;
  // the assertion holds for any fee unit because both sides scale with it.
  const FEE_UNIT = 100_000n; // begin / seal / upload-batch unit
  const CHUNK_FEE = 1_000n; // upload-chunk-fee-unit
  const CONTRACT_BATCH = 32n; // MAX-UPLOAD-BATCH-SIZE, from the deployed source

  /** seal-fee-unit + chunk-fee*min(c,32) + batch-unit*ceil(max(c-32,0)/32) */
  const contractSealFee = (chunks: bigint) => {
    const firstChunks = chunks < CONTRACT_BATCH ? chunks : CONTRACT_BATCH;
    const extra = chunks > CONTRACT_BATCH ? chunks - CONTRACT_BATCH : 0n;
    const extraBatches = (extra + CONTRACT_BATCH - 1n) / CONTRACT_BATCH;
    return FEE_UNIT + CHUNK_FEE * firstChunks + FEE_UNIT * extraBatches;
  };

  for (const chunks of [32, 33, 50, 64, 65, 100, 200, 1000]) {
    it(`covers the contract fee at ${chunks} chunks`, () => {
      const cap = resolveSealSpendCapMicroStx({
        protocolFeeMicroStx: FEE_UNIT,
        totalChunks: chunks
      });
      expect(cap).not.toBeNull();
      expect(cap as bigint).toBeGreaterThanOrEqual(contractSealFee(BigInt(chunks)));
    });
  }
});

import { describe, expect, it } from 'vitest';
import {
  resolveDisplayedMintPriceFromOnChainMintPrice,
  resolveLockedCollectionMintFeeFloor,
  resolveManagedCollectionMintPrice,
  resolveOnChainMintPriceFromDisplayedMintPrice
} from '../launch-pricing';
import { resolveCollectionMintPricingMetadata } from '../pricing-metadata';

describe('resolveLockedCollectionMintFeeFloor', () => {
  it('includes begin and seal protocol fees in the floor', () => {
    const floor = resolveLockedCollectionMintFeeFloor({
      maxChunks: 1,
      feeUnitMicroStx: 100_000n
    });

    expect(floor).toEqual({
      maxChunks: 1,
      feeBatches: 1,
      beginFeeMicroStx: 100_000n,
      sealFeeMicroStx: 200_000n,
      totalProtocolFeeMicroStx: 300_000n
    });
  });
});

describe('display/on-chain mint price conversion', () => {
  it('derives the on-chain payout base from the displayed mint price', () => {
    expect(
      resolveOnChainMintPriceFromDisplayedMintPrice({
        displayedMintPriceMicroStx: 800_000n,
        feeFloorMicroStx: 300_000n
      })
    ).toBe(500_000n);
  });

  it('returns null when the displayed price is below the locked fee floor', () => {
    expect(
      resolveOnChainMintPriceFromDisplayedMintPrice({
        displayedMintPriceMicroStx: 299_999n,
        feeFloorMicroStx: 300_000n
      })
    ).toBeNull();
  });

  it('rebuilds the collector-facing mint price from the on-chain payout base', () => {
    expect(
      resolveDisplayedMintPriceFromOnChainMintPrice({
        onChainMintPriceMicroStx: 500_000n,
        feeFloorMicroStx: 300_000n
      })
    ).toBe(800_000n);
  });
});

describe('resolveManagedCollectionMintPrice', () => {
  it('prefers synced metadata when available', () => {
    const price = resolveManagedCollectionMintPrice({
      paymentModel: 'seal',
      contractMintPriceMicroStx: 500_000n,
      pricing: resolveCollectionMintPricingMetadata({
        mode: 'price-includes-total-fees',
        mintPriceMicroStx: '800000',
        onChainMintPriceMicroStx: '500000'
      }),
      pricingLockMaxChunks: 1,
      feeUnitMicroStx: 100_000n
    });

    expect(price).toBe(800_000n);
  });

  it('falls back to on-chain plus locked fee floor when metadata is raw', () => {
    const price = resolveManagedCollectionMintPrice({
      paymentModel: 'seal',
      contractMintPriceMicroStx: 500_000n,
      pricing: resolveCollectionMintPricingMetadata({
        mode: 'raw-on-chain',
        onChainMintPriceMicroStx: '500000'
      }),
      pricingLockMaxChunks: 1,
      feeUnitMicroStx: 100_000n
    });

    expect(price).toBe(800_000n);
  });
});

describe('v1.5/v1.6 fee floor (core v3.2.3 staged fees)', () => {
  const units = { begin: 100_000n, chunk: 2_000n, batch: 100_000n, seal: 100_000n };

  it('matches the live-page quote for the largest locked file', async () => {
    const { resolveV15CollectionMintFeeFloor } = await import('../launch-pricing');
    const { quoteCollectionV15Mint } = await import('../../../../packages/xtrata-sdk/src/collection-v15');
    for (const maxChunks of [1, 30, 32, 33, 64, 65]) {
      const floor = resolveV15CollectionMintFeeFloor({ maxChunks, units })!;
      expect(floor.totalProtocolFeeMicroStx).toBe(quoteCollectionV15Mint(units, maxChunks, 0n).total);
    }
    // 32 chunks: begin 0.1 + seal 0.1 + 32 × 0.002 = 0.264 STX
    expect(resolveV15CollectionMintFeeFloor({ maxChunks: 32, units })!.totalProtocolFeeMicroStx).toBe(264_000n);
    expect(resolveV15CollectionMintFeeFloor({ maxChunks: 0, units })).toBeNull();
  });

  it('differs from the legacy single-unit floor that misprices v3.2.3', async () => {
    const { resolveV15CollectionMintFeeFloor } = await import('../launch-pricing');
    const legacy = resolveLockedCollectionMintFeeFloor({ maxChunks: 1, feeUnitMicroStx: units.batch })!;
    const current = resolveV15CollectionMintFeeFloor({ maxChunks: 1, units })!;
    expect(current.totalProtocolFeeMicroStx).toBe(202_000n);
    expect(legacy.totalProtocolFeeMicroStx).not.toBe(current.totalProtocolFeeMicroStx);
  });

  it('shows contract price + floor and ignores stale metadata when a v1.5/v1.6 floor is supplied', () => {
    const pricing = resolveCollectionMintPricingMetadata({
      mode: 'price-includes-total-fees', mintPriceMicroStx: '1000000', onChainMintPriceMicroStx: '700000'
    });
    expect(resolveManagedCollectionMintPrice({
      paymentModel: 'seal', contractMintPriceMicroStx: 736_000n, pricing,
      pricingLockMaxChunks: 32, feeUnitMicroStx: 100_000n, feeFloorMicroStx: 264_000n
    })).toBe(1_000_000n);
  });

  it('reports an unknown collector price when v1.5/v1.6 fees could not be read', () => {
    const pricing = resolveCollectionMintPricingMetadata(null);
    expect(resolveManagedCollectionMintPrice({
      paymentModel: 'seal', contractMintPriceMicroStx: 736_000n, pricing,
      pricingLockMaxChunks: 32, feeUnitMicroStx: null, feeFloorMicroStx: null
    })).toBeNull();
  });
});

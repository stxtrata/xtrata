import { describe, expect, it } from 'vitest';
import {
  computeUsdFromBaseUnits,
  formatFiat,
  isFxRateFresh,
  parseGbpPerUsdFromCoinbase,
  type FxRateQuote
} from '../fiat';
import type { UsdPriceBook } from '../types';

const NOW = 1_711_111_115_000;

const gbpRate: FxRateQuote = {
  gbpPerUsd: 0.8, // 1 USD = 0.80 GBP
  updatedAt: NOW,
  sourceId: 'GBP-USD',
  isFallback: false
};

const priceBook: UsdPriceBook = {
  provider: 'test',
  generatedAt: NOW,
  prices: {
    stx: { usd: 0.3, updatedAt: NOW, sourceId: 'stacks', isFallback: false },
    sbtc: { usd: 90_000, updatedAt: NOW, sourceId: 'sbtc', isFallback: false },
    usdc: { usd: 1, updatedAt: NOW, sourceId: 'usd-coin', isFallback: false },
    usdt: { usd: 1, updatedAt: NOW, sourceId: 'tether', isFallback: false }
  }
};

describe('formatFiat', () => {
  it('formats USD with a $ and thousands separators', () => {
    expect(formatFiat(1234.5, 'USD')).toBe('$1,234.50');
    expect(formatFiat(0, 'USD')).toBe('$0.00');
  });

  it('converts USD to GBP using the FX rate', () => {
    expect(formatFiat(100, 'GBP', gbpRate)).toBe('£80.00');
  });

  it('returns null for GBP when no fresh FX rate is available (no silent USD)', () => {
    expect(formatFiat(100, 'GBP')).toBeNull();
    expect(formatFiat(100, 'GBP', null)).toBeNull();
    expect(
      formatFiat(100, 'GBP', { ...gbpRate, gbpPerUsd: 0 })
    ).toBeNull();
  });

  it('returns null for a missing amount', () => {
    expect(formatFiat(null, 'USD')).toBeNull();
    expect(formatFiat(undefined, 'GBP', gbpRate)).toBeNull();
  });
});

describe('computeUsdFromBaseUnits', () => {
  it('computes USD for a stablecoin at 6 decimals', () => {
    const usd = computeUsdFromBaseUnits({
      amount: 2_500_000n, // 2.5 USDC
      decimals: 6,
      assetKey: 'usdc',
      priceBook,
      now: NOW
    });
    expect(usd).toBeCloseTo(2.5, 6);
  });

  it('computes USD for sBTC at 8 decimals', () => {
    const usd = computeUsdFromBaseUnits({
      amount: 100_000n, // 0.001 sBTC
      decimals: 8,
      assetKey: 'sbtc',
      priceBook,
      now: NOW
    });
    expect(usd).toBeCloseTo(90, 6);
  });

  it('returns null with a stale price', () => {
    expect(
      computeUsdFromBaseUnits({
        amount: 1_000_000n,
        decimals: 6,
        assetKey: 'usdc',
        priceBook,
        now: NOW + 11 * 60_000
      })
    ).toBeNull();
  });
});

describe('parseGbpPerUsdFromCoinbase', () => {
  it('inverts USD-per-GBP into GBP-per-USD', () => {
    const quote = parseGbpPerUsdFromCoinbase(
      { data: { amount: '1.25', base: 'GBP', currency: 'USD' } },
      NOW
    );
    expect(quote?.gbpPerUsd).toBeCloseTo(0.8, 6);
    expect(isFxRateFresh(quote, NOW)).toBe(true);
    expect(isFxRateFresh(quote, NOW + 11 * 60_000)).toBe(false);
  });

  it('rejects a malformed payload', () => {
    expect(parseGbpPerUsdFromCoinbase({}, NOW)).toBeNull();
    expect(parseGbpPerUsdFromCoinbase({ data: { amount: '0' } }, NOW)).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { isCollectionV15, isFixedPriceCollection, quoteCollectionV15Mint } from '../collection-v15';

const units = { begin: 100_000n, chunk: 2_000n, batch: 100_000n, seal: 100_000n };
describe('v1.7 fixed collector price quote', () => {
  it('recognises v1.7 as a registered-inventory, fixed-price helper', () => {
    expect(isCollectionV15('xtrata-collection-mint-v1.7')).toBe(true);
    expect(isFixedPriceCollection('xtrata-collection-mint-v1.7')).toBe(true);
    expect(isFixedPriceCollection('xtrata-collection-mint-v1.6')).toBe(false);
  });
  it('charges the same total for every file size and pays out the difference', () => {
    const small = quoteCollectionV15Mint(units, 1, 1_000_000n, { fixedPrice: true });
    const large = quoteCollectionV15Mint(units, 32, 1_000_000n, { fixedPrice: true });
    expect(small.total).toBe(1_000_000n);
    expect(large.total).toBe(1_000_000n);
    expect(small.payout).toBe(1_000_000n - 202_000n);
    expect(large.payout).toBe(1_000_000n - 264_000n);
    expect(large.seal).toBeGreaterThanOrEqual(large.total - large.begin);
  });
  it('free mint: collectors pay only protocol fees', () => {
    const free = quoteCollectionV15Mint(units, 32, 0n, { fixedPrice: true });
    expect(free.total).toBe(264_000n);
    expect(free.payout).toBe(0n);
  });
  it('leaves the v1.5/v1.6 model unchanged', () => {
    expect(quoteCollectionV15Mint(units, 1, 1_000_000n).total).toBe(1_202_000n);
  });
});

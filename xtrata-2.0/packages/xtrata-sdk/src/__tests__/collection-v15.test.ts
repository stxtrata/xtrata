import { describe, expect, it } from 'vitest';
import { isCollectionV15, quoteCollectionV15Mint, readCollectionV15FeeUnits } from '../collection-v15';
const units = { begin: 123n, chunk: 7n, batch: 81n, seal: 99n };
describe('collection v1.5 staged fee quotes', () => {
  it.each([[1,106n],[30,309n],[32,323n],[33,404n],[64,404n],[65,485n]])('quotes %s chunks across core fee boundaries', (chunks, seal) => {
    expect(quoteCollectionV15Mint(units, chunks, 1000n)).toEqual({ begin: 123n, upload: 0n, sealProtocol: seal, payout: 1000n, seal: seal+1000n, total: seal+1123n });
  });
  it('accepts legitimate zero fee units without inventing a fallback', async () => {
    const free = await readCollectionV15FeeUnits(async () => 0n);
    expect(quoteCollectionV15Mint(free, 1, 0n).total).toBe(0n);
  });
  it('requires all units and rejects invalid data', async () => {
    await expect(readCollectionV15FeeUnits(async name => name === 'get-seal-fee-unit' ? null : 1n)).rejects.toThrow('four');
    expect(() => quoteCollectionV15Mint(units, 0, 0n)).toThrow();
    expect(() => quoteCollectionV15Mint(units, 1, -1n)).toThrow();
    expect(() => quoteCollectionV15Mint({...units, batch:-1n}, 1, 0n)).toThrow();
  });
  it('leaves legacy and unknown templates outside this fee model', () => {
    expect(isCollectionV15('xtrata-collection-mint-v1.5')).toBe(true);
    expect(isCollectionV15('xtrata-collection-mint-v1.4')).toBe(false);
    expect(isCollectionV15('xtrata-collection-mint-v1.6')).toBe(true);
    // v1.7 (fixed collector price) shares the staged fee units; later versions stay outside until reviewed.
    expect(isCollectionV15('xtrata-collection-mint-v1.7')).toBe(true);
    expect(isCollectionV15('xtrata-collection-mint-v1.8')).toBe(false);
  });
});

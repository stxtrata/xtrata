import { describe, expect, it } from 'vitest';
import { SUGGESTED_DROP, tierOfAmount, tierOfPlays, TIERS } from '../tiers';
import { batchDeposit, copyAmountForPlays } from '../batches';
import { GIFT_MAX, GIFT_MIN } from '../gifts';

describe('player tiers', () => {
  it('are decided by the plays a player was given, highest first', () => {
    expect([1000, 999, 500, 277, 250, 249, 100, 99, 50, 49, 20, 0].map((p) => tierOfPlays(p).id))
      .toEqual(['diamond', 'gold', 'gold', 'silver', 'silver', 'bronze', 'bronze', 'classic', 'classic', 'classic', 'classic', 'classic']);
    expect(TIERS.map((t) => t.min)).toEqual([...TIERS.map((t) => t.min)].sort((a, b) => b - a));
  });
  it('a gift made for N plays lands in the tier for N plays', () => {
    for (const d of SUGGESTED_DROP) expect(tierOfAmount(copyAmountForPlays(d.plays, false)).id).toBe(d.tier);
    expect(tierOfAmount(100_000n).id).toBe('silver'); // the 0.1 STX gifts already given: 277 plays
    expect(tierOfAmount(0n).id).toBe('classic');
  });
  it('the suggested drop is 1,000 players, none under 50 plays, every amount a batch can carry, under 30 STX in all', () => {
    expect(SUGGESTED_DROP.reduce((n, d) => n + d.count, 0)).toBe(1000);
    let total = 0n;
    for (const d of SUGGESTED_DROP) {
      const amount = copyAmountForPlays(d.plays, false);
      expect(amount >= GIFT_MIN && amount <= GIFT_MAX, `${d.tier} ${amount}`).toBe(true);
      total += batchDeposit(d.count, amount);
    }
    expect(total).toBe(29_887_500n);
    expect(total <= 30_000_000n).toBe(true);
    expect(Math.min(...SUGGESTED_DROP.map((d) => d.plays))).toBe(50);
    expect(copyAmountForPlays(1000, false)).toBe(353_000n);
    expect(copyAmountForPlays(50, false)).toBe(20_500n);
  });
});

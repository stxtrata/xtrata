/**
 * Player tiers: the "class" of a free starter player, decided only by how many plays it was given. A bit of fun for
 * the giveaway (a Diamond player is rare), with no effect on what a player can do: every tier plays any song and
 * pays artists the same way. A tier is worked out from the gift's amount each time, so nothing extra is stored.
 *
 * The suggested drop of 1,000 (docs/music/HANDBOOK.md): 5 Diamond, 10 Gold, 20 Silver, 100 Bronze, 265 Neon,
 * 600 Classic. Change the mix freely; only the `min` thresholds here decide what a player is called.
 */
import { DEFAULT_PLAY_FEE, RESERVE, costPerPlay } from './policy';

export type TierId = 'diamond' | 'gold' | 'silver' | 'bronze' | 'neon' | 'classic';
export interface Tier { id: TierId; name: string; /** A player with at least this many gifted plays is this tier. */ min: number; mark: string }

/** Highest first. */
export const TIERS: readonly Tier[] = [
  { id: 'diamond', name: 'Diamond', min: 1000, mark: '◆' },
  { id: 'gold', name: 'Gold', min: 500, mark: '★' },
  { id: 'silver', name: 'Silver', min: 250, mark: '✦' },
  { id: 'bronze', name: 'Bronze', min: 100, mark: '●' },
  { id: 'neon', name: 'Neon', min: 50, mark: '✺' },
  { id: 'classic', name: 'Classic', min: 0, mark: '♪' }
];
export const isTierId = (v: unknown): v is TierId => typeof v === 'string' && TIERS.some((t) => t.id === v);
export const tierById = (id: TierId) => TIERS.find((t) => t.id === id)!;

/** The tier of a player that was given this many plays. */
export const tierOfPlays = (plays: number): Tier => TIERS.find((t) => plays >= t.min) ?? TIERS[TIERS.length - 1];
/** The tier of a gift of this many microSTX (plays after the return reserve, at the default fee). */
export function tierOfAmount(amount: bigint, fee: bigint = DEFAULT_PLAY_FEE): Tier {
  return tierOfPlays(amount <= RESERVE ? 0 : Number((amount - RESERVE) / costPerPlay(fee)));
}

/** The suggested mix for a drop of 1,000: plays each, how many, and so what it costs. */
export const SUGGESTED_DROP: readonly { tier: TierId; plays: number; count: number }[] = [
  { tier: 'diamond', plays: 1000, count: 5 },
  { tier: 'gold', plays: 500, count: 10 },
  { tier: 'silver', plays: 250, count: 20 },
  { tier: 'bronze', plays: 100, count: 100 },
  { tier: 'neon', plays: 50, count: 265 },
  { tier: 'classic', plays: 20, count: 600 }
];

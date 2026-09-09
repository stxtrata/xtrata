// Disposable derived standings. Schema 2 excludes the 2.1.9 double-counted cache.
import type { LeaderboardRow, RatedGame } from '../ratings/elo-v1.js';
export interface RatingCache {
  schema: 2;
  contract: string;
  atCount: number;
  open: Array<[number, number]>;
  rows: LeaderboardRow[];
}
const integer = (n: unknown): n is number => Number.isSafeInteger(n);
export function readRatingCache(contract: string): RatingCache | null {
  try {
    const raw = globalThis.localStorage?.getItem('xchess:ratings:' + contract);
    const c = raw ? JSON.parse(raw) : null;
    if (c?.schema !== 2 || c.contract !== contract || !integer(c.atCount) || c.atCount < 0 ||
        !Array.isArray(c.open) || !c.open.every((p: unknown) => Array.isArray(p) && p.length === 2 && p.every(n => integer(n) && n >= 0)) ||
        !Array.isArray(c.rows) || !c.rows.every((p: LeaderboardRow) => p && typeof p.principal === 'string' &&
          ['rank', 'rating', 'games', 'wins', 'draws', 'losses', 'whiteGames', 'blackGames', 'peak', 'streak'].every(k => integer((p as unknown as Record<string, unknown>)[k])) &&
          typeof p.provisional === 'boolean' && Array.isArray(p.history) && p.history.every(integer))) return null;
    return c;
  } catch { return null; }
}
export function writeRatingCache(contract: string, rows: LeaderboardRow[], atCount: number, open: Array<[number, number]>): void {
  try { globalThis.localStorage?.setItem('xchess:ratings:' + contract, JSON.stringify({schema: 2, contract, rows, atCount, open} satisfies RatingCache)); }
  catch { /* The chain can rebuild this cache. */ }
}
/** Full verification must depend exclusively on the chain walk. Live evidence wins any overlap. */
export function ratingGames(seed: readonly RatedGame[], walked: readonly RatedGame[], full: boolean): RatedGame[] {
  const unique = new Map<number, RatedGame>();
  for (const game of full ? walked : [...seed, ...walked]) unique.set(game.game, game);
  return [...unique.values()];
}

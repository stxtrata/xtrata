/**
 * On-chain likes and paid plays per song: the one place every page gets them from.
 *
 *   likes       the likes contract's own per-song totals (get-state, 25 songs a read)
 *   paid plays  the paid-play index (functions/lib/music-stats.ts), a copy of the paid-plays
 *               contract's event log that is kept current by every reader
 *
 * Used by /radio/counts (catalogue, radio, homepage, lounge), /radio/song-stats (the radio's
 * display) and, through the same index, /api/music-stats and /api/music-plays. So a song shows
 * the same numbers wherever it appears. A count that could not be read is null, never 0.
 */
import type { Env } from './db';
import { catalogueChainTotals } from './radio-chain-totals';
import { freshenPaidPlayIndex, paidPlayIndexStatus, songPaidPlays, type StatsEnv } from './music-stats';

/** Core index of xtrata-v3-2-3 in the paid-plays contract: the radio's songs. */
export const RADIO_CORE_INDEX = 3;

export type CountsStatus = 'ready' | 'partial' | 'syncing' | 'unavailable' | 'disabled' | 'not-requested';
export type SongCounts = {
  likes: Map<number, number>;
  likesStatus: CountsStatus;
  paidPlays: Map<number, number> | null;
  paidPlaysStatus: CountsStatus;
};

type Options = { likes?: boolean; waitUntil?: (promise: Promise<unknown>) => void; wait?: boolean };

export async function songCounts(env: Env, ids: number[], { likes = true, waitUntil, wait = false }: Options = {}): Promise<SongCounts> {
  const [likeResult, playResult] = await Promise.all([
    likes ? likeTotals(env, ids) : Promise.resolve({ totals: new Map<number, number>(), status: 'not-requested' as const }),
    paidPlayTotals(env, { waitUntil, wait })
  ]);
  return { likes: likeResult.totals, likesStatus: likeResult.status, paidPlays: playResult.totals, paidPlaysStatus: playResult.status };
}

async function likeTotals(env: Env, ids: number[]) {
  const { totals, status } = await catalogueChainTotals(env, ids);
  return { totals: new Map([...totals].map(([id, total]) => [id, Number(total)])), status: status as CountsStatus };
}

async function paidPlayTotals(env: Env, { waitUntil, wait }: { waitUntil?: Options['waitUntil']; wait?: boolean }) {
  const stats = env as StatsEnv;
  if (!stats.DB) return { totals: null, status: 'unavailable' as CountsStatus };
  try {
    // A failed chain check leaves the index as it was; the numbers below are still the index's.
    await freshenPaidPlayIndex(stats, { waitUntil, wait }).catch(() => undefined);
    const [totals, status] = await Promise.all([songPaidPlays(stats, RADIO_CORE_INDEX), paidPlayIndexStatus(stats)]);
    return { totals, status: status as CountsStatus };
  } catch {
    return { totals: null, status: 'unavailable' as CountsStatus };
  }
}

/** A song's paid plays from a SongCounts: 0 when the index is usable and has none, else null. */
export const paidPlaysFor = (counts: SongCounts, id: number) => counts.paidPlays ? counts.paidPlays.get(id) ?? 0 : null;
/** A song's likes from a SongCounts: null when its batch could not be read. */
export const likesFor = (counts: SongCounts, id: number) => counts.likes.has(id) ? counts.likes.get(id)! : null;

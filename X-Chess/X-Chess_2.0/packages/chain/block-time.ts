// Turning block heights into wall-clock time.
//
// The contract stores `stacks-block-height` on every submission, which is the
// right thing to store: it is free, it is already there, and it is a key into
// the block's timestamp rather than a second copy of it. Putting a clock in the
// contract would pay storage on every move to record something the chain
// already knows.
//
// The cost is one lookup per DISTINCT block to play a game back in real time.
// Submissions that shared a block share a timestamp, which is not a rounding
// error but the truth: they happened in the same block.
//
// Same shape as the name resolver. Best effort, cached, never throws, never
// blocks the board.

import type { Endpoint } from './endpoint.js';

/** A gap between two moves: "12s", "4m 30s", "2h 15m", "3d 4h". */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const total = Math.round(seconds);
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  if (minutes < 60) return `${minutes}m ${total % 60}s`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

/**
 * Elapsed time since the game began, as a running clock.
 *
 * The first move is 0:00 by definition: it is the moment the clock starts, and
 * showing a wall time there would say when somebody happened to open the game
 * rather than how long the game has been going.
 */
export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.round(seconds);

  const days = Math.floor(total / 86400);
  if (days >= 1) return `${days}d ${Math.floor((total % 86400) / 3600)}h`;

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number): string => String(n).padStart(2, '0');
  return hours >= 1 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

export class BlockTimes {
  private readonly endpoint: Endpoint;
  /** height -> unix seconds. null means asked and unanswerable. */
  private readonly cache = new Map<number, number | null>();
  private readonly inFlight = new Map<number, Promise<number | null>>();

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  /** What is already known, without asking. Safe to call while rendering. */
  peek(height: number): number | null {
    return this.cache.get(height) ?? null;
  }

  async resolve(height: number): Promise<number | null> {
    if (!Number.isFinite(height) || height <= 0) return null;
    if (this.cache.has(height)) return this.cache.get(height) ?? null;

    const existing = this.inFlight.get(height);
    if (existing) return existing;

    const work = this.lookup(height)
      .catch(() => null)
      .then((time) => {
        this.cache.set(height, time);
        this.inFlight.delete(height);
        return time;
      });

    this.inFlight.set(height, work);
    return work;
  }

  /**
   * Resolve every distinct height in a log. Returns true if anything new was
   * learned, so a caller knows whether re-rendering is worth it.
   */
  async resolveAll(heights: readonly number[]): Promise<boolean> {
    const wanted = [...new Set(heights)].filter(
      (h) => Number.isFinite(h) && h > 0 && !this.cache.has(h)
    );
    if (!wanted.length) return false;
    await Promise.all(wanted.map((h) => this.resolve(h)));
    return true;
  }

  /**
   * Seconds between two heights, or null while either is unknown.
   *
   * Null rather than zero: "we do not know yet" and "they happened at the same
   * moment" are different, and showing 0:00 for the first is a lie that looks
   * like data.
   */
  gap(from: number, to: number): number | null {
    const start = this.peek(from);
    const end = this.peek(to);
    if (start === null || end === null) return null;
    return end - start;
  }

  private async lookup(height: number): Promise<number | null> {
    const response = await this.endpoint.request(`/extended/v2/blocks/${height}`);
    if (!response.ok) return null;
    const body = (await response.json()) as { block_time?: number };
    // `block_time` is a unix timestamp in seconds. Confirmed against mainnet.
    return typeof body?.block_time === 'number' ? body.block_time : null;
  }
}

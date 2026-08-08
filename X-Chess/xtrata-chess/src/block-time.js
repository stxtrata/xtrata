// Turning block heights into wall-clock time.
//
// The contract stores stacks-block-height on every submission, which is the
// right thing to store: it is free, it is already there, and it is a key into
// the block's timestamp rather than a second copy of it. Putting a clock in the
// contract would have cost storage on every move to record something the chain
// already knows.
//
// The cost of that choice is one lookup per distinct block to play a game back
// in real time. Submissions that shared a block share a timestamp, which is not
// a rounding error but the truth: they happened in the same block.
//
// Same shape as the name resolver. Best effort, cached, never throws, never
// blocks the board.

/**
 * Format a gap between moves: "12s", "4m 30s", "2h 15m", "3d 4h".
 */
export function formatDuration(seconds) {
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
 * Format elapsed time since the start of a game, as a running clock.
 */
export function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const total = Math.round(seconds);

  const days = Math.floor(total / 86400);
  if (days >= 1) return `${days}d${Math.floor((total % 86400) / 3600)}h`;

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Block times that came with the page. A sealed game cannot look one up, so it
// carries them, exactly as it carries the names it knew.
export class StaticBlockTimes {
  constructor(source = {}) {
    const entries = source instanceof Map ? [...source] : Object.entries(source || {});
    this.times = new Map(entries.map(([height, time]) => [Number(height), Number(time)]));
  }

  get(height) {
    return this.times.get(Number(height));
  }

  async resolve() {
    return false;
  }
}

export class BlockTimes {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl;
    this.fetch = options.fetch || globalThis.fetch?.bind(globalThis);
    this.concurrency = options.concurrency ?? 4;
    // height -> unix seconds, or null for "asked and could not tell"
    this.times = new Map();
  }

  get(height) {
    const value = this.times.get(Number(height));
    return value === null ? undefined : value;
  }

  known(height) {
    return this.times.has(Number(height));
  }

  async _lookup(height) {
    try {
      const response = await this.fetch(`${this.apiUrl}/extended/v2/blocks/${height}`);
      if (!response.ok) return null;
      const body = await response.json();
      // block_time is the Stacks block's own timestamp. burn_block_time is the
      // Bitcoin tenure's, which is the same for every block in a tenure and so
      // too coarse to pace a game with.
      const time = body?.block_time ?? body?.burn_block_time;
      return Number.isFinite(time) ? Number(time) : null;
    } catch {
      return null;
    }
  }

  /**
   * @returns {Promise<boolean>} whether anything new was learned
   */
  async resolve(heights) {
    const pending = [...new Set(heights.map(Number))].filter(
      (height) => Number.isFinite(height) && !this.times.has(height)
    );
    if (!pending.length) return false;

    let learned = false;
    const queue = pending.slice();

    const workers = Array.from({ length: Math.min(this.concurrency, queue.length) }, async () => {
      for (;;) {
        const height = queue.shift();
        if (height === undefined) return;
        const time = await this._lookup(height);
        this.times.set(height, time);
        if (time !== null) learned = true;
      }
    });

    await Promise.all(workers);
    return learned;
  }
}

/**
 * Wall-clock timestamps for a log, in submission order. Entries whose block is
 * not known yet come back as null rather than being guessed at.
 */
export function stampLog(moves, times) {
  return moves.map((entry) => {
    const at = times?.get?.(entry.height);
    return Number.isFinite(at) ? at : null;
  });
}

/**
 * The real gap in seconds between submission n-1 and n, or null if either
 * timestamp is unknown. Submissions in the same block give zero.
 */
export function gapAt(stamps, index) {
  if (index <= 0 || index >= stamps.length) return null;
  const before = stamps[index - 1];
  const after = stamps[index];
  if (before === null || after === null) return null;
  return Math.max(0, after - before);
}

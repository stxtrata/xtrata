/**
 * Block-height ↔ wall-clock helpers for the timing step.
 *
 * A drop window is expressed in Stacks block heights, which nobody can reason
 * about directly. These convert against the current tip using the nominal
 * Nakamoto block cadence, and every string they produce is hedged: block
 * production is not a clock, and a drop that says "about 3 days" must never be
 * read as a guarantee.
 */

/** Nominal seconds per Stacks block (Nakamoto tenure cadence). */
export const SECONDS_PER_BLOCK = 10;

export const blocksToSeconds = (blocks: number): number => blocks * SECONDS_PER_BLOCK;

export const secondsToBlocks = (seconds: number): number =>
  Math.max(0, Math.round(seconds / SECONDS_PER_BLOCK));

/** "about 2 days 4 hours" / "about 45 minutes". Always approximate. */
export const describeDuration = (blocks: number): string => {
  if (!Number.isFinite(blocks) || blocks <= 0) return 'no time at all';
  const totalSeconds = blocksToSeconds(blocks);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (parts.length === 0 && minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (parts.length === 0) parts.push('under a minute');
  return `about ${parts.join(' ')}`;
};

/** Approximate wall-clock date for a future (or past) block height. */
export const approximateDateOfBlock = (params: {
  targetBlock: number;
  tipHeight: number;
  now?: Date;
}): Date => {
  const now = params.now ?? new Date();
  const delta = params.targetBlock - params.tipHeight;
  return new Date(now.getTime() + blocksToSeconds(delta) * 1_000);
};

/**
 * Human sentence for one end of a drop window. `0` is the contract's
 * "unbounded" sentinel for `end-block` (and "start immediately" for
 * `start-block`, since every height is ≥ 0).
 */
export const describeBlock = (params: {
  block: number;
  tipHeight: number | null;
  kind: 'start' | 'end';
  now?: Date;
}): string => {
  if (params.kind === 'end' && params.block === 0) return 'No end block — claims stay open until you end the drop.';
  if (params.tipHeight === null) return `Block ${params.block.toLocaleString()} (current height unknown).`;
  const delta = params.block - params.tipHeight;
  if (delta <= 0) {
    return params.kind === 'start'
      ? `Block ${params.block.toLocaleString()} has passed — claims open as soon as the drop is activated.`
      : `Block ${params.block.toLocaleString()} has passed — the claim window is already closed.`;
  }
  const date = approximateDateOfBlock({
    targetBlock: params.block,
    tipHeight: params.tipHeight,
    ...(params.now !== undefined ? { now: params.now } : {})
  });
  return `Block ${params.block.toLocaleString()} — ${describeDuration(delta)} from now (≈ ${date.toUTCString()}). Block times vary; treat this as an estimate.`;
};

export interface WindowProblem {
  field: 'startBlock' | 'endBlock';
  message: string;
}

/** Mirrors the contract's create-drop window check plus practical warnings. */
export const validateWindow = (params: {
  startBlock: number;
  endBlock: number;
  tipHeight: number | null;
}): { errors: WindowProblem[]; warnings: WindowProblem[] } => {
  const errors: WindowProblem[] = [];
  const warnings: WindowProblem[] = [];
  if (!Number.isInteger(params.startBlock) || params.startBlock < 0) {
    errors.push({ field: 'startBlock', message: 'Start block must be a non-negative whole number.' });
  }
  if (!Number.isInteger(params.endBlock) || params.endBlock < 0) {
    errors.push({ field: 'endBlock', message: 'End block must be a non-negative whole number (0 = no end).' });
  }
  // create-drop asserts (or (is-eq end-block u0) (<= start-block end-block)).
  if (errors.length === 0 && params.endBlock !== 0 && params.startBlock > params.endBlock) {
    errors.push({ field: 'endBlock', message: 'End block must not be before the start block.' });
  }
  if (errors.length === 0 && params.tipHeight !== null) {
    if (params.endBlock !== 0 && params.endBlock <= params.tipHeight) {
      warnings.push({
        field: 'endBlock',
        message: 'The end block is already behind the chain tip — no claim would ever be inside the window.'
      });
    }
    if (params.endBlock !== 0 && params.endBlock - params.startBlock < 6) {
      warnings.push({
        field: 'endBlock',
        message: 'That window is only a few blocks wide. Claimers are unlikely to get a transaction mined inside it.'
      });
    }
  }
  return { errors, warnings };
};

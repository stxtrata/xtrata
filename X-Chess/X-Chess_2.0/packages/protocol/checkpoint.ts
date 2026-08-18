// A rating checkpoint: the walk somebody already did, offered so nobody has to
// do it again from the beginning.
//
// WHY THIS EXISTS. Ratings are derived by replaying every ranked game in index
// order, and that walk grows with the contract for ever. At nine games it was
// free; at thirty-eight it is half a minute; at four hundred it is a board
// nobody waits for. Nothing about that is fixable by reading faster.
//
// IT IS A CLAIM, NOT AN ANSWER, and the distinction is the whole design. The
// leaderboard's own rule is that nothing derived is cached, because recomputing
// is the proof. A checkpoint does not repeal that — it makes the recomputation
// OPTIONAL and says so on screen. A board reading one states that it is
// continuing from a claim, and offers to verify it by doing the full walk, which
// is exactly what it does today.
//
// SO IT MUST NAME ITS INPUTS. Elo is path-dependent: the same games in another
// order give different ratings. A table alone could not be checked against
// anything, so a checkpoint lists the games it consumed, in the order it
// consumed them, with the result it read for each. That makes any single claim
// checkable with one game's replay rather than all of them.
//
// WRITING ONE IS THE VERIFICATION. The builder does the full walk and inscribes
// what it found, so the inscription is a receipt for work already done rather
// than an assertion made in advance.

/** The first line, exact, so a scan is a string compare. */
export const CHECKPOINT_HEADER = 'X-CHESS-RATINGS/1';

export interface CheckpointRow {
  /** The principal this rating belongs to. */
  who: string;
  rating: number;
  games: number;
  won: number;
  drawn: number;
  lost: number;
}

export interface CheckpointGame {
  /** Game id on the contract. */
  id: number;
  white: string;
  black: string;
  result: '1-0' | '0-1' | '1/2-1/2';
}

export interface Checkpoint {
  contract: string;
  /**
   * How far this checkpoint got, as a position in the contract's ranked INDEX.
   *
   * An index rather than a block height, because that is what the walk is over:
   * a reader continues at `rankedIndex` and needs no arithmetic to know where.
   */
  rankedIndex: number;
  /** The block the walk was made at, for a reader deciding how stale it is. */
  block: number;
  table: CheckpointRow[];
  games: CheckpointGame[];
  /** Whatever the author wanted the next author to know. Shown, never parsed. */
  note?: string;
}

export interface ParsedCheckpoint {
  ok: boolean;
  checkpoint: Checkpoint | null;
  problems: string[];
}

const RESULTS = new Set(['1-0', '0-1', '1/2-1/2']);

/**
 * Read a checkpoint.
 *
 * Refuses rather than repairs. A checkpoint that is wrong in a way this can see
 * is one nobody should continue from, and continuing from a half-understood one
 * is how a rating table becomes untraceable.
 */
export function parseCheckpoint(text: unknown): ParsedCheckpoint {
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== CHECKPOINT_HEADER) {
    return {
      ok: false,
      checkpoint: null,
      problems: [`the first line must be exactly "${CHECKPOINT_HEADER}"`]
    };
  }

  let body: unknown;
  try {
    body = JSON.parse(lines.slice(1).join('\n'));
  } catch (error) {
    return { ok: false, checkpoint: null, problems: [`the body is not JSON: ${String(error)}`] };
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, checkpoint: null, problems: ['the body is not an object'] };
  }

  const c = body as Partial<Checkpoint>;
  const problems: string[] = [];

  if (typeof c.contract !== 'string' || !c.contract.includes('.')) {
    problems.push('contract is required, and names the contract these ratings are of');
  }
  if (!Number.isInteger(c.rankedIndex) || (c.rankedIndex as number) < 0) {
    problems.push('rankedIndex must be a whole number of ranked games consumed');
  }
  if (!Number.isInteger(c.block) || (c.block as number) < 1) {
    problems.push('block must be the height this was computed at');
  }
  if (!Array.isArray(c.table)) problems.push('table is required');
  if (!Array.isArray(c.games)) problems.push('games is required');

  for (const row of c.table ?? []) {
    if (typeof row?.who !== 'string' || !Number.isFinite(row?.rating)) {
      problems.push('every table row needs a principal and a rating');
      break;
    }
  }
  for (const game of c.games ?? []) {
    if (!Number.isInteger(game?.id) || !RESULTS.has(String(game?.result))) {
      problems.push('every game needs an id and a result of 1-0, 0-1 or 1/2-1/2');
      break;
    }
  }

  // THE COUNT IS THE ONE ARITHMETIC CLAIM WORTH CHECKING FOR FREE. A checkpoint
  // saying it consumed forty games while listing thirty is either truncated or
  // describing a walk it did not do, and either way the table cannot follow
  // from the list.
  if (Array.isArray(c.games) && Number.isInteger(c.rankedIndex) && c.games.length !== c.rankedIndex) {
    problems.push(
      `says it consumed ${c.rankedIndex} ranked games and lists ${c.games.length}`
    );
  }

  const ok = problems.length === 0;
  return { ok, problems, checkpoint: ok ? (c as Checkpoint) : null };
}

/**
 * May this board continue from this checkpoint?
 *
 * Separate from parsing because a document can be perfectly well formed and
 * still be about something else — another contract, or a walk further ahead
 * than the chain has got, which would mean skipping games that exist.
 */
export function usable(
  checkpoint: Checkpoint,
  contract: string,
  rankedCount: number
): { ok: boolean; says: string } {
  if (checkpoint.contract.toLowerCase() !== contract.toLowerCase()) {
    return { ok: false, says: `it is about ${checkpoint.contract}, and this board reads ${contract}` };
  }
  if (checkpoint.rankedIndex > rankedCount) {
    return {
      ok: false,
      says:
        `it claims ${checkpoint.rankedIndex} ranked games and this contract has ` +
        `${rankedCount}, so it is ahead of the chain`
    };
  }
  return { ok: true, says: '' };
}

/** What a reader should be told before a rating table is believed. */
export function checkpointNote(checkpoint: Checkpoint, id: number): string {
  return (
    `Continuing from inscription ${id}, which claims the first ${checkpoint.rankedIndex} ` +
    `ranked games as of block ${checkpoint.block.toLocaleString()}. Those were not replayed ` +
    'here. Everything after them was.'
  );
}

/**
 * Write a checkpoint, canonically.
 *
 * THE POINT IS THAT TWO PEOPLE GET THE SAME BYTES. A checkpoint is believed
 * rather than replayed, so the only thing making it safe is that anybody can
 * redo the walk and compare — and comparison only works if the writing is
 * fixed. Two honest walks that disagree about key order or spacing produce two
 * different hashes and prove nothing.
 *
 * So: keys in a stated order, games in ranked-index order, table sorted by
 * rating then principal to break ties, ratings rounded once here rather than
 * wherever they were computed, and two-space JSON. Nothing is left to the
 * serialiser's discretion.
 *
 * There is no timestamp. The only time in it is the block height, which is a
 * fact about the chain rather than about when somebody pressed a button — a
 * clock would make every regeneration differ and destroy the whole property.
 */
export function buildCheckpoint(input: {
  contract: string;
  block: number;
  games: readonly CheckpointGame[];
  table: readonly CheckpointRow[];
  note?: string;
}): string {
  const games = input.games.map((game) => ({
    id: game.id,
    white: game.white,
    black: game.black,
    result: game.result
  }));

  const table = [...input.table]
    .map((row) => ({
      who: row.who,
      rating: Math.round(row.rating),
      games: row.games,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost
    }))
    // Rating descending, then principal, so two runs cannot order equals
    // differently. `localeCompare` is deliberately avoided: it depends on the
    // machine's locale, which is exactly the kind of thing that makes bytes
    // differ between two people doing the same work.
    .sort((a, b) => b.rating - a.rating || (a.who < b.who ? -1 : a.who > b.who ? 1 : 0));

  const body = {
    contract: input.contract,
    rankedIndex: games.length,
    block: input.block,
    table,
    games,
    ...(input.note ? { note: input.note } : {})
  };
  return `${CHECKPOINT_HEADER}\n${JSON.stringify(body, null, 2)}\n`;
}

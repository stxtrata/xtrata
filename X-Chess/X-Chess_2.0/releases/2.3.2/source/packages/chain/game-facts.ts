// What a tournament already worked out about a game, so it need not do it again.
//
// THE SECOND VISIT COSTS WHAT THE FIRST DID. `scoreTournament` reads every
// game's row, pages every entry, and replays each one — for a twenty-one game
// exhibition that is the row reads plus sixty-odd page reads plus twenty-one
// replays, repeated in full every time the tab is opened. The manifest is
// cached and nothing derived from it is, so returning to a finished tournament
// is as slow as the first look at a live one.
//
// WHAT MAKES THIS SAFE, because a cached result is a claim and this project
// does not repeat claims. Entries are append-only and indexed by sequence, so
// `nextSeq` identifies the log exactly: same game, same nextSeq, same entries,
// therefore the same replay. The row is still read on every visit and the
// cached answer is used ONLY when the chain agrees about nextSeq, the rules
// hash, and the rules the replay was run with. What is skipped is the paging
// and the replay — never the check.
//
// So a wrong or tampered entry cannot survive one round trip, which is the same
// standard `known-rules` holds itself to: remembered, but never believed over
// the chain.
//
// ONE ENTRY PER GAME, replaced when the log grows. Keying by nextSeq as well
// would leave a new record behind after every move of every game anybody ever
// watched, which is an unbounded store for a bounded question.

import type { GameFacts } from '../protocol/tournament.js';

const PREFIX = 'xchess:facts:v2:';
export const factsScope = (chain: { contractId: string; network?: string }): string =>
  `${chain.network ?? 'mainnet'}:${chain.contractId}`;

/** Storage, if there is any. Same shape and reasoning as `yours.ts`. */
function store(): Storage | null {
  try {
    const local = (globalThis as { localStorage?: Storage }).localStorage;
    if (!local) return null;
    return local;
  } catch {
    return null;
  }
}

export interface CachedGame {
  /** The log length this was derived from. The whole basis of the cache. */
  nextSeq: number;
  /** The rules the replay ran with, so a re-declared tournament cannot reuse it. */
  rulesKey: string;
  facts: GameFacts;
  /** Earliest entry height, for provenance. Null when the game has no entries. */
  firstHeight: number | null;
  /** How many entries were read, for the "has anybody moved" count. */
  entries: number;
}

/**
 * The rules a replay ran under, as a string.
 *
 * Part of the validity check rather than the key, because a tournament that
 * re-declares its cooldown produces a DIFFERENT replay of the same log. Results
 * would not move — a cooldown cannot reject anything in a two-player game — but
 * relying on that here would make this cache correct by coincidence.
 */
export const rulesKeyOf = (white: string | null, black: string | null, cooldown: number): string =>
  `${white ?? '-'}|${black ?? '-'}|${cooldown}`;

/** What was worked out last time, or null. Never trusted without a row read. */
export function rememberedGame(id: number, scope: string): CachedGame | null {
  const local = store();
  if (!local || !Number.isSafeInteger(id)) return null;
  try {
    const raw = local.getItem(`${PREFIX}${scope}:${id}`);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const row = parsed as CachedGame;
    if (!Number.isSafeInteger(row.nextSeq) || typeof row.rulesKey !== 'string') return null;
    if (!row.facts || typeof row.facts !== 'object' || row.nextSeq < 0 || !Number.isSafeInteger(row.entries) || row.entries !== row.nextSeq ||
        (row.firstHeight !== null && (!Number.isSafeInteger(row.firstHeight) || row.firstHeight < 0))) return null;
    const facts = row.facts;
    if (facts.rulesHash !== null && (typeof facts.rulesHash !== 'string' || !/^[0-9a-f]{64}$/.test(facts.rulesHash))) return null;
    if (![null, '1-0', '0-1', '1/2-1/2'].includes(facts.result)) return null;
    for (const value of [facts.moves, facts.submissions]) {
      if (value !== undefined && (!Number.isSafeInteger(value) || value < 0)) return null;
    }
    if (facts.turn !== undefined && ![null, 'white', 'black'].includes(facts.turn)) return null;
    if (facts.toMove !== undefined && facts.toMove !== null && typeof facts.toMove !== 'string') return null;
    return row;
  } catch {
    // Corrupt, or written by something else on this origin. Costs one full read.
    return null;
  }
}

/**
 * Remember what a complete read produced.
 *
 * COMPLETE, and the caller is the only one who can say so. `getAllEntries`
 * pages, and a page that does not arrive returns what it has — so a game
 * reporting forty entries and handing back four has not been read. Caching that
 * would make a rate limit permanent, which is the mistake this codebase has
 * made before in every other form.
 */
export function rememberGame(id: number, row: CachedGame, scope: string): void {
  const local = store();
  if (!local || !Number.isSafeInteger(id)) return;
  try {
    local.setItem(`${PREFIX}${scope}:${id}`, JSON.stringify(row));
  } catch {
    // A full quota or a private window. It is a cache; next visit reads again.
  }
}

// The games an address is in, past the end of the window.
//
// THE LIST IS THE NEWEST TWENTY-FIVE, and that is a display bound rather than a
// statement about anybody's games. It has to be: the contract numbers games and
// nothing else, so "show me the list" can only mean "show me a run of ids", and
// an unbounded walk on a contract that grows forever is not a first paint.
//
// The cost falls on exactly the wrong person. A game drops off the window the
// moment twenty-five newer ones are opened, so the longer a game runs the more
// certain it is to vanish from the board of the player whose move it is — and
// the board then says nothing at all rather than saying it is your turn. That
// is the one thing a chess board must never get wrong.
//
// THE INDEX POINTS THIS WAY, unlike the one in players.ts. Xtrata cannot answer
// "what did this address inscribe", and the note there explains why holdings are
// used instead. Transactions are different: the API does index them by sender,
// and a move IS a transaction sent by the player — `submit` with the game id as
// its first argument. So "which games has this address played" is one call, with
// no window and no walk, and it was available the whole time.
//
// WHAT IT CANNOT FIND, said plainly because a list that quietly omits your game
// is worse than one that admits a limit. A game naming you that you have never
// moved in is not in your transaction history, because you have not sent
// anything. Nothing on chain links your address to that game until you do — the
// rules commit to a HASH, and a hash cannot be searched backwards. Such a game
// is findable in the window while it is new, or by its number, and once this has
// seen it once it is remembered forever. But it cannot be discovered from
// nothing, and no amount of reading will change that.

import type { Endpoint } from './endpoint.js';

/** How many pages of history to read before giving up. Fifty each. */
export const MAX_HISTORY_PAGES = 4;

const PAGE = 50;
const PREFIX = 'xchess:yours:';

/**
 * Storage, if there is any.
 *
 * Same shape as `known-rules.ts` and for the same reason: an inscribed page may
 * be sandboxed with no storage at all, and reading it can throw rather than
 * return null. Nothing here is load-bearing — losing it costs a slower first
 * paint and never a wrong answer — so every path degrades to "no".
 */
function store(): Storage | null {
  try {
    const local = (globalThis as { localStorage?: Storage }).localStorage;
    if (!local) return null;
    const probe = `${PREFIX}probe`;
    local.setItem(probe, '1');
    local.removeItem(probe);
    return local;
  } catch {
    return null;
  }
}

const norm = (address: string): string => String(address ?? '').trim().toUpperCase();
const idsKey = (address: string): string => `${PREFIX}${norm(address)}`;
const doneKey = (address: string): string => `${PREFIX}done:${norm(address)}`;
const markKey = (address: string): string => `${PREFIX}seen:${norm(address)}`;

export interface YourGamesOptions {
  endpoint: Endpoint;
  /** `SP….xchess-core-v1-canary`, matched exactly against the call target. */
  contractId: string;
  maxPages?: number;
}

export interface Discovery {
  /** Every game id now known for this address, remembered and discovered. */
  ids: number[];
  /** Ids this call learned that were not already remembered. */
  fresh: number[];
  /** False when the page cap was hit, so there may be older games unseen. */
  complete: boolean;
}

export class YourGames {
  private readonly endpoint: Endpoint;
  private readonly contractId: string;
  private readonly maxPages: number;

  constructor(options: YourGamesOptions) {
    this.endpoint = options.endpoint;
    this.contractId = options.contractId;
    this.maxPages = options.maxPages ?? MAX_HISTORY_PAGES;
  }

  /**
   * What this browser already knows, with no network at all.
   *
   * The point of the whole store: a returning player's own games are on screen
   * before the first request goes out, rather than after a walk that may not
   * reach them. Newest first, because a game id is monotonic and recency is the
   * only ordering available before anything has been replayed.
   */
  known(address: string): number[] {
    const local = store();
    if (!local || !norm(address)) return [];
    try {
      const raw = local.getItem(idsKey(address));
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const ids = parsed.filter((id): id is number => Number.isSafeInteger(id) && (id as number) > 0);
      return [...new Set(ids)].sort((a, b) => b - a);
    } catch {
      // Corrupt, or written by something else on this origin. Ordinary browser
      // storage is not trusted here any more than it is in `known-rules`: the
      // worst a bad entry can do is name a game that is then read from the
      // chain and described from the chain, so a wrong id costs one read.
      return [];
    }
  }

  /**
   * Record a game as one this address is in.
   *
   * Called for anything that ESTABLISHED participation rather than guessed it —
   * a replayed row whose rules name you, a game you opened, a move you sent. It
   * is the half of this that survives the limit described at the top: a game you
   * were named in but never moved in cannot be discovered, but the first time it
   * is seen by any route, it stops needing to be.
   */
  remember(address: string, id: number): void {
    if (!Number.isSafeInteger(id) || id < 1) return;
    const local = store();
    if (!local || !norm(address)) return;
    const next = new Set(this.known(address));
    if (next.has(id)) return;
    next.add(id);
    try {
      local.setItem(idsKey(address), JSON.stringify([...next].sort((a, b) => b - a)));
    } catch {
      // A full quota or a private window. Never worth failing a move over.
    }
  }

  /**
   * Games of yours that have ended.
   *
   * REMEMBERED BECAUSE A FINISHED GAME CANNOT UNFINISH. That makes it the one
   * fact here safe to cache forever, and it is what keeps the background check
   * cheap: a player with sixty games and two live ones pays for two. Without
   * it, "is anything waiting on me" costs a read of every game ever played,
   * every time a wallet connects — which is the objection that kept this out of
   * the page-load path in the first place.
   *
   * Wrong only if the store is tampered with, and the cost of that is a game
   * missing from a count, never a wrong board: the game view reads the chain.
   */
  finished(address: string): Set<number> {
    const local = store();
    if (!local || !norm(address)) return new Set();
    try {
      const raw = local.getItem(doneKey(address));
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.filter((id): id is number => Number.isSafeInteger(id)) : []);
    } catch {
      return new Set();
    }
  }

  /** Record that a game of yours has ended, so it need never be read again. */
  markFinished(address: string, id: number): void {
    const local = store();
    if (!local || !norm(address) || !Number.isSafeInteger(id)) return;
    const done = this.finished(address);
    if (done.has(id)) return;
    done.add(id);
    try {
      local.setItem(doneKey(address), JSON.stringify([...done].sort((a, b) => b - a)));
    } catch {
      // Then it is read again next time. Slower, never wrong.
    }
  }

  /** Games of yours that may still need something from you. */
  live(address: string): number[] {
    const done = this.finished(address);
    return this.known(address).filter((id) => !done.has(id));
  }

  /** Forget everything for one address. Used when a different wallet connects. */
  forget(address: string): void {
    const local = store();
    if (!local) return;
    try {
      local.removeItem(idsKey(address));
      local.removeItem(markKey(address));
      local.removeItem(doneKey(address));
    } catch {
      // Nothing to do, and nothing depends on it.
    }
  }

  /**
   * Ask the chain which games this address has moved in.
   *
   * Newest first, stopping at the newest transaction a previous call already
   * processed — so the first visit reads what it must and every later one reads
   * a single page. Without that mark, a player with a thousand moves would pay
   * the full walk on every load to learn nothing new.
   *
   * A failure THROWS rather than returning what it has. `PlayerNames` learned
   * this the hard way: a rate-limited lookup that returns "nothing found" is
   * indistinguishable from a real absence, and the caller then remembers the
   * absence. Here the caller keeps whatever `known` already had, which is the
   * conservative direction — a game is never dropped because the network
   * hiccupped.
   */
  async discover(address: string): Promise<Discovery> {
    const who = norm(address);
    if (!who) return { ids: [], fresh: [], complete: true };

    const before = new Set(this.known(who));
    const local = store();
    const mark = local?.getItem(markKey(who)) ?? null;

    const found = new Set<number>();
    let newestSeen: string | null = null;
    let complete = false;
    let reachedMark = false;

    for (let page = 0; page < this.maxPages && !reachedMark; page++) {
      const path =
        `/extended/v1/address/${encodeURIComponent(who)}/transactions` +
        `?limit=${PAGE}&offset=${page * PAGE}`;
      const response = await this.endpoint.request(path);
      if (!response.ok) throw new Error(`transaction history: HTTP ${response.status}`);

      const body = (await response.json()) as {
        results?: TransactionRow[];
        total?: number;
      };
      const rows = body.results ?? [];
      if (!rows.length) {
        complete = true;
        break;
      }

      for (const row of rows) {
        if (newestSeen === null && row.tx_id) newestSeen = row.tx_id;
        // The mark is a transaction already processed, so everything from here
        // down has been seen. Checked BEFORE the id is read, not after, or the
        // stop would depend on whether the marked transaction happened to be a
        // move.
        if (mark && row.tx_id === mark) {
          reachedMark = true;
          break;
        }
        const id = this.gameOf(row);
        if (id !== null) found.add(id);
      }

      if (rows.length < PAGE) complete = true;
    }
    if (reachedMark) complete = true;

    // Written only after a clean read. A mark set from a partial walk would
    // make the next call stop early at a point this one never actually reached.
    if (local && newestSeen) {
      try {
        local.setItem(markKey(who), newestSeen);
      } catch {
        // Then the next visit re-reads. Slower, never wrong.
      }
    }

    const fresh = [...found].filter((id) => !before.has(id));
    for (const id of fresh) this.remember(who, id);
    return { ids: this.known(who), fresh: fresh.sort((a, b) => b - a), complete };
  }

  /**
   * The game a transaction is about, or null.
   *
   * ONLY `submit`, and deliberately. Opening a game does not make you a player —
   * a tournament organiser opens twenty-one games it is not in, and the runner
   * that opened this contract's games is not a competitor. What proves you are
   * in a game is having moved in it, which is the same standard
   * `checkEligibility` applies before it will rate anybody.
   *
   * A failed transaction says nothing either: a move the contract rejected is a
   * move that never happened.
   */
  private gameOf(row: TransactionRow): number | null {
    if (row.tx_type !== 'contract_call' || row.tx_status !== 'success') return null;
    const call = row.contract_call;
    if (!call || call.contract_id !== this.contractId) return null;
    if (call.function_name !== 'submit') return null;
    const first = call.function_args?.[0]?.repr ?? '';
    const digits = /^u(\d+)$/.exec(String(first));
    if (!digits) return null;
    const id = Number(digits[1]);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }
}

interface TransactionRow {
  tx_id?: string;
  tx_type?: string;
  tx_status?: string;
  contract_call?: {
    contract_id?: string;
    function_name?: string;
    function_args?: Array<{ repr?: string }>;
  };
}

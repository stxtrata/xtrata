// The shape of a game's rules, and what they refuse.
//
// Every rule here is a question about the log, and the log already records the
// sender of every submission and the order they arrived in. Replay answers them
// at exactly the point it answers "is this a legal move". None of it touches the
// contract, and none of it could: the contract must never form a chess opinion.
//
// What the contract does hold is a hash of the rules, written when the game is
// opened. Without that, two boards could claim different rules for the same game
// and nothing would decide between them.

import { ANYONE, ANYONE_ELSE, FIRST_MOVER, NAME_PATTERN, PRINCIPAL_PATTERN } from './canonical.js';
import { EVENTS_PROTOCOL, REPLAY_PROTOCOL, REPLAY_PROTOCOL_V2 } from './versions.js';
import { START_FEN } from '../chess/fen.js';

export { ANYONE, ANYONE_ELSE, FIRST_MOVER } from './canonical.js';

export interface Rules {
  /** Which replay definition applies. Committed, so a game says how to read it. */
  replayProtocol: string;
  /** Which control strings mean something. Committed for the same reason. */
  eventsProtocol: string;
  /** A principal, `anyone`, or `anyone-else`. */
  white: string;
  black: string;
  /** If non-empty, only these principals may submit at all. Sorted, deduped. */
  allow: string[];
  /** How many other moves a sender waits before moving again. In MOVES. */
  cooldown: number;
  noConsecutive: boolean;
  /**
   * Both sides agreed this game counts towards ratings.
   *
   * Committed in the rules hash rather than asserted later, so that ranked
   * status is something both players signed up to before a move was played and
   * nobody can retrofit onto a game that was not offered as one.
   */
  ranked: boolean;
  startFen: string;
}

export const DEFAULT_RULES: Rules = {
  replayProtocol: REPLAY_PROTOCOL,
  eventsProtocol: EVENTS_PROTOCOL,
  white: ANYONE,
  black: ANYONE,
  allow: [],
  cooldown: 0,
  noConsecutive: false,
  ranked: false,
  startFen: START_FEN
};

export const REJECTED_BY_RULE = {
  NOT_ALLOWED: 'not-allowed',
  WRONG_PLAYER: 'wrong-player',
  CONSECUTIVE: 'consecutive',
  COOLDOWN: 'cooldown'
} as const;

export type RuleRejection = (typeof REJECTED_BY_RULE)[keyof typeof REJECTED_BY_RULE];

export function looksLikePrincipal(value: unknown): boolean {
  return typeof value === 'string' && PRINCIPAL_PATTERN.test(value.trim().toUpperCase());
}

export function looksLikeName(value: unknown): boolean {
  return typeof value === 'string' && NAME_PATTERN.test(value.trim().toLowerCase());
}

/**
 * Fill in anything missing, drop anything unrecognised, and never throw.
 *
 * Two callers describing the same rules must end up with byte-identical objects,
 * and a caller holding junk must still end up with something replay can use.
 */
export function normaliseRules(input: unknown): Rules {
  const source = (input && typeof input === 'object' ? input : {}) as Partial<Rules>;

  const side = (value: unknown): string => {
    if (typeof value !== 'string') return ANYONE;
    const trimmed = value.trim();
    if (trimmed === '') return ANYONE;
    const lowered = trimmed.toLowerCase();
    if (lowered === ANYONE) return ANYONE;
    if (lowered === ANYONE_ELSE) return ANYONE_ELSE;
    if (lowered === FIRST_MOVER) return FIRST_MOVER;
    // Everything else is treated as a principal and upper-cased. A value that is
    // not one will simply never match a sender, which is a side nobody can play
    // — refused at creation by readyToOpen, not silently corrected here.
    return trimmed.toUpperCase();
  };

  const allow = Array.isArray(source.allow)
    ? [...new Set(source.allow.map((v) => String(v).trim().toUpperCase()).filter(Boolean))].sort()
    : [];

  const rawCooldown = Number(source.cooldown);
  const cooldown = Number.isFinite(rawCooldown) ? Math.max(0, Math.floor(rawCooldown)) : 0;

  const text = (value: unknown, fallback: string): string =>
    typeof value === 'string' && value.trim() ? value.trim() : fallback;

  const white = side(source.white);
  const black = side(source.black);

  return {
    // DERIVED FROM THE SIDES, not taken from the source.
    //
    // A game that uses `first-mover` is played under replay-v2 whatever it was
    // handed, because the keyword IS the difference between the two protocols.
    // Letting a caller pass v1 alongside it would produce a rule set that hashes
    // to a commitment no board could honour: v1 boards would read the keyword as
    // a principal nobody holds and skip every move.
    replayProtocol:
      white === FIRST_MOVER || black === FIRST_MOVER
        ? REPLAY_PROTOCOL_V2
        : text(source.replayProtocol, REPLAY_PROTOCOL),
    eventsProtocol: text(source.eventsProtocol, EVENTS_PROTOCOL),
    white,
    black,
    allow,
    cooldown,
    noConsecutive: source.noConsecutive === true,
    ranked: source.ranked === true,
    startFen: text(source.startFen, START_FEN)
  };
}

/** True when these are the plain open-board rules, which commit to nothing. */
export function isOpenBoard(rules: Rules): boolean {
  return (
    rules.white === ANYONE &&
    rules.black === ANYONE &&
    rules.allow.length === 0 &&
    rules.cooldown === 0 &&
    !rules.noConsecutive &&
    !rules.ranked &&
    rules.startFen === START_FEN
  );
}

export interface SenderContext {
  sender: string | null;
  /** The colour to move in the position reached so far. */
  turn: 'white' | 'black';
  /**
   * Accepted moves so far, in order. Everything here is public.
   *
   * `color` is what `first-mover` reads: which side a past move was played for
   * is how a claimed seat is identified. Optional because the two callers that
   * predate it pass records that already carry it, and a caller that does not
   * simply cannot use the keyword.
   */
  history: { sender: string | null; color?: 'white' | 'black' }[];
}

/**
 * May this sender play a move now?
 *
 * Pure: everything it reads is either the rules or the accepted history, both of
 * which every reader has. Returns null when allowed, or a reason.
 *
 * The order of the checks is fixed rather than incidental. A submission can
 * break more than one rule at once, and which reason gets recorded is part of
 * the permanent record, so it must not depend on how the code happens to read.
 */
/**
 * Who has already played this colour, if anybody.
 *
 * The first accepted move for a colour is what claims it. Read from the record
 * rather than counted from the length, because a game may start from a position
 * where black moves first and because events sit in the same list.
 */
function claimedBy(
  colour: 'white' | 'black',
  history: SenderContext['history']
): string | null {
  for (const entry of history) {
    if (entry.color !== colour) continue;
    const who = String(entry.sender ?? '').trim().toUpperCase();
    if (who) return who;
  }
  return null;
}

/**
 * The principal bound to a side right now, or null while it is open.
 *
 * One function for the two ways a side becomes a specific person: named in the
 * rules, or claimed by playing. `anyone` and `anyone-else` are never a person.
 */
function holderOf(
  side: string,
  colour: 'white' | 'black',
  history: SenderContext['history']
): string | null {
  if (side === FIRST_MOVER) return claimedBy(colour, history);
  if (side === ANYONE || side === ANYONE_ELSE) return null;
  return side;
}

export function checkSender(rules: Rules, ctx: SenderContext): RuleRejection | null {
  const from = String(ctx.sender ?? '').toUpperCase();

  if (rules.allow.length && !rules.allow.includes(from)) {
    return REJECTED_BY_RULE.NOT_ALLOWED;
  }

  const other: 'white' | 'black' = ctx.turn === 'white' ? 'black' : 'white';
  const bound = ctx.turn === 'white' ? rules.white : rules.black;
  const opposite = ctx.turn === 'white' ? rules.black : rules.white;

  if (bound === FIRST_MOVER) {
    // A seat claimed by playing it. Once somebody has had a move accepted for
    // this colour it is theirs for the rest of the game; until then it is open
    // to anybody who does not already hold the other side, because a game
    // where one person takes both seats is not a game.
    const holder = claimedBy(ctx.turn, ctx.history);
    if (holder) {
      if (from !== holder) return REJECTED_BY_RULE.WRONG_PLAYER;
    } else {
      const rival = holderOf(opposite, other, ctx.history);
      if (rival && from === rival) return REJECTED_BY_RULE.WRONG_PLAYER;
    }
  } else if (bound === ANYONE_ELSE) {
    // Everyone but the other side. When the other side is not a specific person
    // there is nobody to exclude, so this is simply "anyone" — the honest
    // reading, not a special case being swallowed. A first-mover seat DOES
    // become a specific person, so it is asked rather than assumed open.
    const rival = holderOf(opposite, other, ctx.history);
    if (rival && from === rival) return REJECTED_BY_RULE.WRONG_PLAYER;
  } else if (bound !== ANYONE && from !== bound) {
    return REJECTED_BY_RULE.WRONG_PLAYER;
  }

  if (rules.noConsecutive && ctx.history.length) {
    const last = ctx.history[ctx.history.length - 1];
    if (last.sender && last.sender === ctx.sender) return REJECTED_BY_RULE.CONSECUTIVE;
  }

  // Counted in MOVES, not blocks.
  //
  // Blocks sound like a waiting time and are not one: a Stacks block is seconds,
  // so a cooldown of six was about a minute and stopped nobody. Moves are the
  // unit that means something in a game — "wait for three other people to play"
  // holds however fast or slow the chain runs.
  if (rules.cooldown > 0) {
    for (let i = ctx.history.length - 1; i >= 0; i--) {
      if (ctx.history[i].sender !== ctx.sender) continue;
      const movesSince = ctx.history.length - 1 - i;
      if (movesSince < rules.cooldown) return REJECTED_BY_RULE.COOLDOWN;
      break;
    }
  }

  return null;
}

export interface Problem {
  field: string;
  message: string;
  needsResolving?: string;
}

export interface Readiness {
  ready: boolean;
  problems: Problem[];
  /** Names still to look up, so a caller can resolve them all in one go. */
  unresolved: string[];
}

/**
 * How many different people these rules allow to move, or null for no limit.
 *
 * Only used to catch a wait nobody could ever satisfy.
 */
function countMovers(draft: Partial<Rules>): number | null {
  const allow = Array.isArray(draft.allow)
    ? [...new Set(draft.allow.map((v) => String(v).trim().toUpperCase()).filter(Boolean))]
    : [];
  if (allow.length) return allow.length;

  const named = new Set<string>();
  for (const side of [draft.white, draft.black]) {
    const value = typeof side === 'string' ? side.trim().toLowerCase() : '';
    if (!value || value === ANYONE || value === ANYONE_ELSE) return null;
    named.add(value);
  }
  return named.size;
}

/**
 * Is this rule set complete enough to commit to a chain that cannot forget it?
 *
 * Opening a game writes a hash. After that the rules are fixed: there is no
 * edit, no migration, and no way to reach the people who joined. So the bar is
 * not "will this parse" but "is every choice here one somebody made on purpose,
 * and can it still be satisfied tomorrow".
 */
export function readyToOpen(draft: Partial<Rules>): Readiness {
  const problems: Problem[] = [];

  const checkSide = (field: 'white' | 'black', label: string): void => {
    const raw = draft[field];
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (!value) {
      problems.push({
        field,
        message:
          `${label} is not set. Type an address, a .btc name, "anyone", ` +
          '"anyone-else", or "first-mover".'
      });
      return;
    }
    const lowered = value.toLowerCase();
    if (lowered === ANYONE || lowered === ANYONE_ELSE || lowered === FIRST_MOVER) return;
    if (looksLikePrincipal(value)) return;
    if (looksLikeName(value)) {
      // Replay compares principals, and a sealed board has no network, so a name
      // has to become an address before it is hashed rather than after. A name
      // that reached the hash would be a side nobody can ever play.
      problems.push({
        field,
        message: `${label} is the name ${value}, which has to be looked up before the game is opened.`,
        needsResolving: value
      });
      return;
    }
    problems.push({
      field,
      message: `${label} is "${value}", which is neither a Stacks address nor a .btc name.`
    });
  };

  checkSide('white', 'White');
  checkSide('black', 'Black');

  // Not held to the same standard as the sides, deliberately. A blank side
  // decides who may play and can lock somebody out permanently; a blank cooldown
  // means no cooldown, which is the stated default and restricts nobody.
  const raw = draft.cooldown;
  const given = raw !== undefined && raw !== null && String(raw).trim() !== '';
  if (given) {
    const cooldown = Number(raw);
    if (!Number.isFinite(cooldown) || cooldown < 0 || Math.floor(cooldown) !== cooldown) {
      problems.push({
        field: 'cooldown',
        message: 'The wait must be a whole number of moves, or zero for no wait.'
      });
    }
  }

  // A wait of N needs N+1 different people able to move, or the game locks.
  //
  // Two named players and a wait of two is the case that bites: A moves, B
  // moves, and now A is one move short and so is B. Nobody can ever move again,
  // and the rules are already hashed on chain, so the game is a brick. Refused
  // rather than warned about, because there is no fixing it afterwards.
  const movers = countMovers(draft);
  const wait = Number(draft.cooldown);
  if (movers !== null && Number.isFinite(wait) && wait >= movers) {
    problems.push({
      field: 'cooldown',
      message:
        `A wait of ${wait} needs ${wait + 1} different people able to move, and these rules allow ` +
        `${movers}. The game would lock up after ${movers} moves with nobody able to play. ` +
        `Lower the wait to ${movers - 1}, or open a side to more people.`
    });
  }

  // Ranked games are two named people and nothing else.
  //
  // Not a restriction on what X Chess can be — an experimental game is a
  // perfectly good game, it is simply unrated. It is a restriction on what may
  // move a number that other people's ratings are computed against.
  if (draft.ranked === true) {
    const white = String(draft.white ?? '').trim().toUpperCase();
    const black = String(draft.black ?? '').trim().toUpperCase();

    for (const [field, value, label] of [
      ['white', white, 'White'],
      ['black', black, 'Black']
    ] as const) {
      if (!looksLikePrincipal(value)) {
        problems.push({
          field,
          message: `A ranked game names both players. ${label} must be a Stacks address.`
        });
      }
    }

    if (white && white === black) {
      problems.push({
        field: 'black',
        message: 'A ranked game needs two different players.'
      });
    }

    if (Array.isArray(draft.allow) && draft.allow.length) {
      problems.push({
        field: 'allow',
        message: 'A ranked game is decided by its two named players, so it carries no allow list.'
      });
    }

    if (typeof draft.startFen === 'string' && draft.startFen.trim() && draft.startFen.trim() !== START_FEN) {
      problems.push({
        field: 'startFen',
        message: 'A ranked game starts from the standard position.'
      });
    }
  }

  return {
    ready: problems.length === 0,
    problems,
    unresolved: problems.filter((p) => p.needsResolving).map((p) => p.needsResolving as string)
  };
}

/**
 * A short human description, for the board to show above a game.
 *
 * `name` turns a principal into whatever it should be called. Rules store
 * addresses, because that is what replay compares and what a sealed board can
 * check with no network, but an address is not what anybody calls themselves.
 */
export function describeRules(rules: Rules, name?: (who: string) => string | null): string {
  const parts: string[] = [];
  const called = (who: string): string => (name && name(who)) || who;
  const other = (colour: string): string => (colour === 'White' ? rules.black : rules.white);

  const side = (colour: string, who: string): string => {
    if (who === ANYONE) return `${colour} can be played by anyone`;
    if (who === FIRST_MOVER) {
      return `${colour} belongs to whoever plays it first, and to nobody else after that`;
    }
    if (who === ANYONE_ELSE) {
      const excluded = other(colour);
      return excluded === ANYONE || excluded === ANYONE_ELSE
        ? `${colour} can be played by anyone`
        : excluded === FIRST_MOVER
          ? `${colour} can be played by anyone except whoever claims the other side`
          : `${colour} can be played by anyone except ${called(excluded)}`;
    }
    return `${colour} can only be played by ${called(who)}`;
  };

  if (rules.white === ANYONE && rules.black === ANYONE) {
    parts.push('Anyone can play either colour');
  } else {
    parts.push(side('White', rules.white));
    parts.push(side('Black', rules.black));
  }

  if (rules.allow.length) {
    parts.push(`only ${rules.allow.length} wallet${rules.allow.length === 1 ? '' : 's'} can play at all`);
  }
  if (rules.noConsecutive) parts.push('nobody can move twice in a row');
  if (rules.cooldown > 0) {
    parts.push(
      rules.cooldown === 1
        ? 'nobody can move twice in a row'
        : `after moving, a player waits for ${rules.cooldown} other moves`
    );
  }
  if (rules.ranked) parts.push('this game counts towards ratings');
  if (rules.startFen !== START_FEN) parts.push('the game starts from a set-up position');

  return parts.join(' · ');
}

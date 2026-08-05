// Rules for a game, and the commitment that pins them to it.
//
// The open board lets anyone move either side. A child board can narrow that:
// bind a colour to an address, require a wait between an address's own moves,
// start from a given position. None of it touches the contract, and none of it
// could: every rule here is a question about the log, and the log already
// records the sender and the block height of every submission. Replay answers
// them at exactly the point it answers "is this a legal move".
//
// What the contract does hold is a hash of the rules, written when the game is
// opened. Without that, two boards could claim different rules for the same
// game and nothing would say which is the referee. With it, anyone can hash a
// board's rules and check them against the chain.
//
// The canonical form below is what gets hashed. It is deliberately boring:
// fixed key order, no optional fields, no whitespace. A rule set that hashes
// differently on two machines would be worse than no commitment at all.

import { sha256, bytesToHex } from './clarity.js';
import { START_FEN } from './engine.js';

export const ANYONE = 'anyone';

export const RULES_VERSION = 1;

export const DEFAULT_RULES = {
  version: RULES_VERSION,
  white: ANYONE,
  black: ANYONE,
  allow: [],
  cooldown: 0,
  noConsecutive: false,
  startFen: START_FEN
};

export const REJECTED_BY_RULE = {
  NOT_ALLOWED: 'not-allowed',
  WRONG_PLAYER: 'wrong-player',
  CONSECUTIVE: 'consecutive',
  COOLDOWN: 'cooldown'
};

/**
 * Fill in anything missing and drop anything unrecognised, so that two callers
 * describing the same rules end up with byte-identical objects.
 */
export function normaliseRules(input = {}) {
  const source = input || {};
  const principal = (value) => {
    if (typeof value !== 'string') return ANYONE;
    const trimmed = value.trim().toUpperCase();
    return trimmed === '' || trimmed === ANYONE.toUpperCase() ? ANYONE : trimmed;
  };

  const allow = Array.isArray(source.allow)
    ? [...new Set(source.allow.map((value) => String(value).trim().toUpperCase()).filter(Boolean))]
        .sort()
    : [];

  const cooldown = Number.isFinite(Number(source.cooldown))
    ? Math.max(0, Math.floor(Number(source.cooldown)))
    : 0;

  return {
    version: RULES_VERSION,
    white: principal(source.white),
    black: principal(source.black),
    allow,
    cooldown,
    noConsecutive: source.noConsecutive === true,
    startFen: typeof source.startFen === 'string' && source.startFen.trim()
      ? source.startFen.trim()
      : START_FEN
  };
}

/**
 * The exact bytes that get hashed. Key order is fixed here and must never
 * change, because the hash of an existing game must stay reproducible forever.
 */
export function canonicalRules(rules) {
  const r = normaliseRules(rules);
  return JSON.stringify([
    r.version,
    r.white,
    r.black,
    r.allow,
    r.cooldown,
    r.noConsecutive,
    r.startFen
  ]);
}

export function rulesHash(rules) {
  return bytesToHex(sha256(new TextEncoder().encode(canonicalRules(rules))));
}

/** True when these are the plain open-board rules, which commit to nothing. */
export function isOpenBoard(rules) {
  return canonicalRules(rules) === canonicalRules(DEFAULT_RULES);
}

/**
 * Does the chain's commitment match these rules?
 *
 * A game opened with no commitment can only be the open board. A game opened
 * with one is refereed by whichever rule set hashes to it, and by no other.
 */
export function rulesMatchCommitment(rules, committedHex) {
  const committed = committedHex ? String(committedHex).replace(/^0x/, '').toLowerCase() : null;
  if (!committed) return isOpenBoard(rules);
  return rulesHash(rules) === committed;
}

/**
 * May this sender play this submission?
 *
 * Pure: everything it reads is either the rules or the accepted history, both
 * of which every reader has. `turn` is the colour to move in the current
 * position, and `history` is the accepted moves so far, in order.
 *
 * Returns null when the submission is allowed, or a rejection reason.
 */
// A Stacks principal, and a BNS name, told apart.
//
// The distinction matters more here than anywhere else in the board: rules are
// hashed and committed on chain, and replay compares a stored value against a
// transaction's sender, which is always a principal. A name that reaches the
// hash is a side nobody can ever play, permanently.
const PRINCIPAL_PATTERN = /^S[0-9A-HJKMNP-TV-Z]{5,}$/;
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;

export function looksLikePrincipal(value) {
  return typeof value === 'string' && PRINCIPAL_PATTERN.test(value.trim().toUpperCase());
}

export function looksLikeName(value) {
  return typeof value === 'string' && NAME_PATTERN.test(value.trim().toLowerCase());
}

/**
 * Is this rule set complete enough to commit to a chain that cannot forget it?
 *
 * Opening a game writes a hash. After that the rules are fixed: there is no
 * edit, no migration, and no way to reach the people who joined. So the bar for
 * opening is not "will this parse" but "is every choice here one somebody made
 * on purpose, and can it still be satisfied tomorrow".
 *
 * Three things are refused:
 *
 *   * A side left blank. Blank normalises to "anyone", which is a perfectly good
 *     rule and a terrible default: it is the difference between a public board
 *     and a private one, and it should be typed rather than fallen into.
 *   * A side naming something that is neither a principal nor a name. A typo
 *     locks that side out for good.
 *   * A name that has not been resolved to an address yet. Replay compares
 *     principals, and a sealed board has no network, so the name has to become
 *     an address before it is hashed rather than after.
 */
export function readyToOpen(draft = {}) {
  const problems = [];
  const check = (field, label) => {
    const raw = draft[field];
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (!value) {
      problems.push({ field, message: `${label} is not set. Type an address, a .btc name, or "anyone".` });
      return;
    }
    if (value.toLowerCase() === ANYONE) return;
    if (looksLikePrincipal(value)) return;
    if (looksLikeName(value)) {
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

  check('white', 'White');
  check('black', 'Black');

  // Not held to the same standard as the sides, and deliberately so. A blank
  // side decides who may play and can lock somebody out permanently; a blank
  // cooldown means no cooldown, which is the stated default and restricts
  // nobody. Only a value that was typed and makes no sense is a problem.
  const raw = draft.cooldown;
  const given = raw !== undefined && raw !== null && String(raw).trim() !== '';
  if (given) {
    const cooldown = Number(raw);
    if (!Number.isFinite(cooldown) || cooldown < 0 || Math.floor(cooldown) !== cooldown) {
      problems.push({
        field: 'cooldown',
        message: 'Cooldown must be a whole number of blocks, or zero.'
      });
    }
  }

  return {
    ready: problems.length === 0,
    problems,
    // The names still to look up, so a caller can resolve them all in one go.
    unresolved: problems.filter((p) => p.needsResolving).map((p) => p.needsResolving)
  };
}

export function checkSender(rules, { sender, height, turn, history }) {
  const r = normaliseRules(rules);

  if (r.allow.length && !r.allow.includes(String(sender ?? '').toUpperCase())) {
    return REJECTED_BY_RULE.NOT_ALLOWED;
  }

  const bound = turn === 'white' ? r.white : r.black;
  if (bound !== ANYONE && String(sender ?? '').toUpperCase() !== bound) {
    return REJECTED_BY_RULE.WRONG_PLAYER;
  }

  if (r.noConsecutive && history.length) {
    const last = history[history.length - 1];
    if (last.sender && last.sender === sender) return REJECTED_BY_RULE.CONSECUTIVE;
  }

  if (r.cooldown > 0 && Number.isFinite(height)) {
    // The most recent accepted move by this same sender.
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].sender !== sender) continue;
      const since = height - history[i].height;
      if (Number.isFinite(since) && since < r.cooldown) return REJECTED_BY_RULE.COOLDOWN;
      break;
    }
  }

  return null;
}

/** A short human description, for the board to show above a game. */
export function describeRules(rules) {
  const r = normaliseRules(rules);
  const parts = [];

  const side = (colour, who) =>
    who === ANYONE ? `${colour} open to anyone` : `${colour} is ${who}`;

  if (r.white === ANYONE && r.black === ANYONE) parts.push('Anyone may move either side');
  else {
    parts.push(side('White', r.white));
    parts.push(side('Black', r.black));
  }

  if (r.allow.length) parts.push(`only ${r.allow.length} address${r.allow.length === 1 ? '' : 'es'} may move`);
  if (r.noConsecutive) parts.push('no two moves in a row from one address');
  if (r.cooldown > 0) parts.push(`${r.cooldown} block${r.cooldown === 1 ? '' : 's'} between an address's own moves`);
  if (r.startFen !== START_FEN) parts.push('custom starting position');

  return parts.join(' · ');
}

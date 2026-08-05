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

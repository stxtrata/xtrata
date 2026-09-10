// The exact bytes a rule set hashes to.
//
// The contract stores a hash of a game's rules and never the rules themselves.
// That keeps it ignorant of chess and keeps opening a game cheap, but it means
// this encoding is a permanent protocol artefact: a game committed today must
// still hash to the same bytes in ten years, computed by somebody who has only
// the published spec and never saw this file.
//
// So the encoding is deliberately dull, and deliberately not JSON.
//
// JSON looks fine and hides two traps. Its string escaping is implementation-
// defined at the edges (which characters get \u escapes, and in which case),
// and its number formatting has no single spelling for every value. Neither
// matters until the day it does, and by then the games are on chain.
//
// Instead: newline-separated fields, every one of them validated against a
// character set that cannot contain a newline. There is exactly one way to
// write any rule set, an independent implementation is twenty lines, and there
// is nothing to get subtly wrong.
//
//   line 0   "rules-v1"          this encoding's own name
//   line 1   replay protocol     which replay definition applies
//   line 2   events protocol     which control strings mean something
//   line 3   white               principal | "anyone" | "anyone-else"
//   line 4   black               same
//   line 5   allow               comma-joined, sorted, deduped; "" for none
//   line 6   cooldown            decimal, no sign, no leading zeros
//   line 7   noConsecutive       "0" or "1"
//   line 8   ranked              "0" or "1"
//   line 9   startFen            the starting position
//
// Joined with "\n", encoded UTF-8 (which for these character sets is ASCII),
// hashed with SHA-256.

import { EVENTS_PROTOCOL, REPLAY_PROTOCOL, RULES_PROTOCOL } from './versions.js';
import { bytesToHex, sha256 } from './sha256.js';
import type { Rules } from './rules.js';

/**
 * A Stacks principal, as it appears in a rule set.
 *
 * Crockford base32 without I, L, O or U, which is what c32 addresses use.
 * Always upper case here: a rule set is compared byte for byte against a
 * transaction's sender, and two spellings of one address would be two different
 * commitments.
 */
export const PRINCIPAL_PATTERN = /^S[0-9A-HJKMNP-TV-Z]{5,}$/;

/** A BNS name. Never hashed — see rules.ts for why. */
export const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;

export const ANYONE = 'anyone';
export const ANYONE_ELSE = 'anyone-else';

/**
 * A seat nobody holds until somebody plays it.
 *
 * The first principal to have a move ACCEPTED for that colour holds it for the
 * rest of the game. Before that it is open to anybody who is not already
 * holding the other side, so one person cannot quietly play both.
 *
 * Hashable like the other two keywords, and it moves a game to replay-v2 -
 * see versions.ts for why that is a new protocol and not an edit.
 */
export const FIRST_MOVER = 'first-mover';

/**
 * The characters a FEN may contain.
 *
 * Letters, digits, the rank separator, the field separator and the "nothing
 * here" dash. Nothing else exists in the format, and in particular no newline
 * and no comma, which is what makes the line encoding above unambiguous.
 */
const FEN_PATTERN = /^[a-zA-Z0-9/ -]+$/;

const PROTOCOL_PATTERN = /^[a-z0-9-]+$/;

export class CanonicalError extends Error {
  readonly field: string;
  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.field = field;
    this.name = 'CanonicalError';
  }
}

function checkSide(field: string, value: string): string {
  if (value === ANYONE || value === ANYONE_ELSE || value === FIRST_MOVER) return value;
  if (PRINCIPAL_PATTERN.test(value)) return value;
  throw new CanonicalError(
    field,
    `"${value}" is not a Stacks principal, nor "${ANYONE}", "${ANYONE_ELSE}" or ` +
      `"${FIRST_MOVER}". A BNS name must be resolved to an address before it is hashed.`
  );
}

function checkProtocol(field: string, value: string): string {
  if (!PROTOCOL_PATTERN.test(value)) {
    throw new CanonicalError(field, `"${value}" is not a protocol identifier`);
  }
  return value;
}

function checkCount(field: string, value: number): string {
  if (!Number.isInteger(value) || value < 0) {
    throw new CanonicalError(field, `${value} is not a whole number of moves`);
  }
  // Decimal, no sign, no leading zeros. Number#toString gives exactly this for
  // a non-negative integer, but saying so is what an independent implementation
  // needs to read.
  return String(value);
}

const flag = (value: boolean): string => (value ? '1' : '0');

/**
 * The canonical bytes. Throws rather than guessing.
 *
 * Strict on purpose: this is only ever called to produce a commitment, and a
 * commitment made from a value nobody checked is a side somebody may be unable
 * to play, permanently. Replay never calls this — it reads rules, it does not
 * hash them.
 */
export function canonicalRules(rules: Rules): string {
  const fields: string[] = [
    RULES_PROTOCOL,
    checkProtocol('replayProtocol', rules.replayProtocol ?? REPLAY_PROTOCOL),
    checkProtocol('eventsProtocol', rules.eventsProtocol ?? EVENTS_PROTOCOL),
    checkSide('white', rules.white),
    checkSide('black', rules.black)
  ];

  const allow = [...rules.allow];
  for (const entry of allow) {
    if (!PRINCIPAL_PATTERN.test(entry)) {
      throw new CanonicalError('allow', `"${entry}" is not a Stacks principal`);
    }
  }
  // Sorted and deduped here rather than trusted, so that two callers who listed
  // the same wallets in a different order commit to the same bytes.
  const sorted = [...new Set(allow)].sort();
  if (sorted.length !== allow.length) {
    throw new CanonicalError('allow', 'contains a duplicate');
  }
  fields.push(sorted.join(','));

  fields.push(checkCount('cooldown', rules.cooldown));
  fields.push(flag(rules.noConsecutive));
  fields.push(flag(rules.ranked));

  if (!FEN_PATTERN.test(rules.startFen)) {
    throw new CanonicalError('startFen', 'contains a character that is not part of FEN');
  }
  fields.push(rules.startFen);

  return fields.join('\n');
}

export function canonicalBytes(rules: Rules): Uint8Array {
  return new TextEncoder().encode(canonicalRules(rules));
}

/** Lower-case hex, no 0x prefix. What the contract stores, as a reader sees it. */
export function rulesHash(rules: Rules): string {
  return bytesToHex(sha256(canonicalBytes(rules)));
}

/**
 * Does the chain's commitment match these rules?
 *
 * A hash cannot be turned back into rules, but it can confirm them: if what
 * somebody proposes hashes to what the game committed, no other rule set could
 * have produced it. That is proof, and it is the only way a board is ever
 * allowed to referee a game.
 */
export function rulesMatchCommitment(rules: Rules, committedHex: string | null): boolean {
  if (!committedHex) return false;
  const committed = String(committedHex).replace(/^0x/i, '').toLowerCase();
  try {
    return rulesHash(rules) === committed;
  } catch {
    // Rules that cannot be canonicalised cannot match anything.
    return false;
  }
}

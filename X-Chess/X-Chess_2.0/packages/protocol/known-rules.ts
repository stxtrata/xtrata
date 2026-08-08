// Rule sets this browser has seen, and rule sets somebody was handed.
//
// A game commits to the HASH of its rules and nothing else. The contract stores
// no players: `get-game` returns the opener, the height, `ranked`, and a 32-byte
// commitment. So the addresses a game names exist nowhere on chain until one of
// those players submits something.
//
// `recoverRules` bridges that by searching the small space of rule sets this
// application can create, built from the opener plus everyone who has submitted.
// It works well once a game is under way and NOT AT ALL before the first move:
// with an empty log the only known participant is the opener, so a game naming
// two other people has no candidate to find. The board falls back to the open
// board and says "anyone can play either colour" about a game that names two
// players - which is the opposite of what its creator just typed.
//
// The missing piece is not on chain and does not need to be. The board that
// OPENED the game knows the rules exactly. It just threw them away.
//
// So: remember them, and let them be passed around. Everything here is
// UNTRUSTED and hash-checked at the point of use - a remembered rule set that
// does not hash to the commitment is discarded, so the worst a corrupted store
// or a doctored link can do is fail to help. It can never make a board referee
// rules the game did not agree to.

import { rulesHash } from './canonical.js';
import { normaliseRules } from './rules.js';
import type { Rules } from './rules.js';

const PREFIX = 'xchess:rules:';

/**
 * Storage, if there is any.
 *
 * An inscribed page may be sandboxed with no storage at all, and reading it can
 * throw rather than return null. None of this is load-bearing - it is a cache
 * whose absence costs a display detail - so every path degrades to "no".
 */
function store(): Storage | null {
  try {
    const local = (globalThis as { localStorage?: Storage }).localStorage;
    if (!local) return null;
    // Some browsers expose the object and throw on use.
    const probe = `${PREFIX}probe`;
    local.setItem(probe, '1');
    local.removeItem(probe);
    return local;
  } catch {
    return null;
  }
}

const key = (hash: string): string => `${PREFIX}${String(hash).replace(/^0x/i, '').toLowerCase()}`;

/**
 * Remember a rule set against its own hash.
 *
 * Called when a game is opened, which is the one moment the full rule set is
 * known for certain. Keyed by the hash so that reading it back is a lookup
 * rather than a search, and so a wrong entry can never be returned for the
 * right game.
 */
export function rememberRules(rules: Rules): void {
  const local = store();
  if (!local) return;
  try {
    local.setItem(key(rulesHash(rules)), JSON.stringify(rules));
  } catch {
    // A full quota, or a private window. Nothing here is worth failing an open.
  }
}

/**
 * The remembered rule set for a commitment, if it still matches it.
 *
 * Re-hashed rather than trusted. The store is ordinary browser storage: another
 * page on the same origin can write to it, and so can anybody with the console
 * open. Checking costs one hash and removes the whole question.
 */
export function knownRules(committed: string | null): Rules | null {
  if (!committed) return null;
  const local = store();
  if (!local) return null;
  try {
    const raw = local.getItem(key(committed));
    if (!raw) return null;
    return verify(JSON.parse(raw) as Partial<Rules>, committed);
  } catch {
    return null;
  }
}

/**
 * A rule set carried in a link, if it matches the commitment.
 *
 * This is how the OTHER player's board learns the rules before anybody has
 * moved. There is no server to ask and no message to send, so the rules travel
 * the same way the game number does: in the URL somebody sends their opponent.
 *
 * RULES-V1 already says a game's rules are public - they are searchable from
 * the chain the moment play starts - so putting them in a link discloses
 * nothing that was ever private. And a doctored link is caught by the hash.
 */
export function rulesFromLink(url: string, committed: string | null): Rules | null {
  if (!committed) return null;
  try {
    // Parsed by hand rather than with URL, which needs a base and would mean
    // naming a host in an artefact that must never depend on one.
    const text = String(url ?? '');
    const query = text.includes('?') ? text.slice(text.indexOf('?') + 1).split('#')[0] : '';
    const fragment = text.includes('#') ? text.slice(text.indexOf('#') + 1) : '';
    const raw =
      new URLSearchParams(query).get('rules') ?? new URLSearchParams(fragment).get('rules');
    if (!raw) return null;
    return verify(JSON.parse(decode(raw)) as Partial<Rules>, committed);
  } catch {
    return null;
  }
}

/** The link to hand an opponent: the game, and the rules it agreed to. */
export function linkForGame(base: string, game: number, rules: Rules): string {
  const query = `game=${game}&rules=${encode(JSON.stringify(rules))}`;
  const clean = String(base ?? '').split(/[?#]/)[0];
  return clean ? `${clean}?${query}` : `?${query}`;
}

function verify(candidate: Partial<Rules>, committed: string): Rules | null {
  if (!candidate || typeof candidate !== 'object') return null;
  const rules = normaliseRules(candidate);
  const want = String(committed).replace(/^0x/i, '').toLowerCase();
  return rulesHash(rules).replace(/^0x/i, '').toLowerCase() === want ? rules : null;
}

/**
 * base64url, hand-rolled both ways.
 *
 * `btoa` is not available everywhere this runs and pulls in nothing worth
 * depending on. The alphabet is url-safe so the value survives being pasted,
 * shortened, and typed out by somebody reading it off a screen.
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    out += ALPHABET[a >> 2];
    out += ALPHABET[((a & 3) << 4) | ((b ?? 0) >> 4)];
    if (b === undefined) break;
    out += ALPHABET[((b & 15) << 2) | ((c ?? 0) >> 6)];
    if (c === undefined) break;
    out += ALPHABET[c & 63];
  }
  return out;
}

export function decode(text: string): string {
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of String(text)) {
    const index = ALPHABET.indexOf(ch);
    if (index < 0) continue;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

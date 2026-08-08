// Post conditions, as serialised hex strings.
//
// Two things here were learned the hard way and must not be simplified.
//
// FIRST: hex, never objects. Xverse accepts the serialised hex form and HANGS
// FOREVER on the object form, with no dialog and no rejection - the promise
// simply never settles, which reads to a user as a wallet that never opened.
//
// SECOND, and new to X Chess 2: in deny mode EVERY transfer must be covered by
// a condition, INCLUDING EVERY ONE THE CONTRACT MAKES, TO ANYBODY.
//
// This is not theory. The first real sponsored open on mainnet aborted for
// exactly this reason. `open-sponsored-game` pays a bootstrap to the OPPONENT,
// and the guard had been written as though the only contract outflow was the
// rebate coming back to the caller. The contract executed perfectly - the chain
// recorded `(ok u3)` - and then threw the whole transaction away, keeping the
// network fee. See ADR-0006.
//
// So the question to ask of every call is not "does the sender get anything
// back" but "does the CONTRACT pay anyone at all".
//
// The legacy trap generalises: a post condition is a CAP, not a preference.
// Getting one wrong does not shrink a transfer, it fails the transaction - and
// an aborted transaction still costs its sender the network fee.

import { bytesToHex } from '../protocol/sha256.js';
import { parseAddress } from '../chain/clarity.js';

/** Fungible condition codes, as they appear on the wire. */
export const SENT_EQUAL_TO = 0x01;
export const SENT_GREATER_THAN = 0x02;
export const SENT_GREATER_THAN_OR_EQUAL = 0x03;
export const SENT_LESS_THAN = 0x04;
export const SENT_LESS_THAN_OR_EQUAL = 0x05;

/** Post-condition principal kinds. */
/**
 * Who a post condition is about.
 *
 * ORIGIN means "whoever signed this transaction" and carries no address. It is
 * the right answer for anything about the sender, because a page cannot know
 * which account a wallet will sign with.
 */
const PRINCIPAL_ORIGIN = 0x01;
const PRINCIPAL_STANDARD = 0x02;
const PRINCIPAL_CONTRACT = 0x03;

/** Asset kinds. Only STX is used here. */
const ASSET_STX = 0x00;

const byte = (value: number): string => value.toString(16).padStart(2, '0');
const amount64 = (value: bigint): string => value.toString(16).padStart(16, '0');

/**
 * A post condition about a standard account sending STX.
 *
 *   00        STX condition
 *   02        standard principal
 *   version   one byte
 *   hash160   twenty bytes
 *   code      one byte
 *   amount    eight bytes, big endian
 */
export function stxFromAccount(
  address: string,
  amount: bigint,
  code = SENT_LESS_THAN_OR_EQUAL
): string {
  const { version, hash160 } = parseAddress(address);
  return `${byte(ASSET_STX)}${byte(PRINCIPAL_STANDARD)}${byte(version)}${bytesToHex(hash160)}${byte(code)}${amount64(amount)}`;
}

/**
 * A post condition about a CONTRACT sending STX.
 *
 *   00        STX condition
 *   03        contract principal
 *   version   one byte
 *   hash160   twenty bytes
 *   len       one byte, the contract name's length
 *   name      that many ASCII bytes
 *   code      one byte
 *   amount    eight bytes, big endian
 *
 * This is the one the legacy board never needed. A sponsored submission makes
 * the contract pay a rebate, and under deny mode an uncovered transfer aborts
 * the whole transaction.
 */
export function stxFromContract(
  contractId: string,
  amount: bigint,
  code = SENT_LESS_THAN_OR_EQUAL
): string {
  const [address, name] = String(contractId).split('.');
  if (!address || !name) throw new Error(`not a contract id: ${contractId}`);
  const { version, hash160 } = parseAddress(address);
  const nameBytes = new TextEncoder().encode(name);
  if (nameBytes.length > 128) throw new Error('contract name too long');
  return (
    `${byte(ASSET_STX)}${byte(PRINCIPAL_CONTRACT)}${byte(version)}${bytesToHex(hash160)}` +
    `${byte(nameBytes.length)}${bytesToHex(nameBytes)}${byte(code)}${amount64(amount)}`
  );
}

/**
 * A cap on what the SENDER of the transaction moves, whoever that turns out to
 * be. No address, because the origin needs none - that is the whole point.
 */
export function stxFromOrigin(amount: bigint, code = SENT_LESS_THAN_OR_EQUAL): string {
  return `${byte(ASSET_STX)}${byte(PRINCIPAL_ORIGIN)}${byte(code)}${amount64(amount)}`;
}

export interface Guard {
  postConditionMode: 'deny' | 'allow';
  postConditions: string[];
}

export interface GuardInput {
  /** The account that will sign. */
  sender: string | null;
  /** The contract being called, fully qualified. */
  contractId: string;
  /** MicroSTX the contract will take from the sender. */
  sends: bigint;
  /**
   * MicroSTX the CONTRACT will pay out, to ANYBODY.
   *
   * A STX post condition caps what a named principal SENDS; it says nothing
   * about who receives it. So one condition about the contract covers every
   * payout it makes in that call, whether the money goes to the caller, to an
   * opponent being bootstrapped, or to a treasury recipient.
   */
  contractSends: bigint;
  /**
   * 'strict' caps each direction at the stated amount, which is the default and
   * what should ship. 'allow' is a last resort for a wallet that cannot handle
   * conditions at all: the transfer goes through, but so would a larger one.
   */
  shape?: 'strict' | 'allow';
}

/**
 * The conditions for a call, covering both directions.
 *
 * The caps are "at most", never "exactly". Both bound the loss identically, but
 * an exact condition fails a perfectly fine transaction if the owner changes a
 * fee between the board reading it and the wallet signing, or if a rebate is
 * not paid because the allowance ran out in the meantime. A cap does not.
 *
 * That second case is not hypothetical: a sponsored player whose last rebate is
 * consumed by a transaction confirming first would have an exact-amount
 * condition fail on a move that was otherwise perfectly good.
 */
export function guardFor(input: GuardInput): Guard {
  const { sends, contractSends, shape = 'strict' } = input;

  if (shape === 'allow') {
    return { postConditionMode: 'allow', postConditions: [] };
  }

  const conditions: string[] = [];

  if (sends > 0n) {
    // ABOUT THE ORIGIN, NOT ABOUT AN ADDRESS.
    //
    // A condition naming a principal only holds if that principal is the one
    // who signs, and this page CANNOT KNOW who will. The wallet chooses
    // tx-sender; the request deliberately carries no sender field. So a page
    // that names the account it last saw is guessing, and under deny mode a
    // wrong guess is fatal: the real sender's transfer matches no condition and
    // the whole transaction aborts AFTER the contract has succeeded, burning
    // the fee.
    //
    // That is not hypothetical. The canary's top-up step is called "from a
    // THIRD account" - switching accounts is the point of it - and it aborted
    // on a post condition every single time for exactly this reason.
    //
    // The origin principal says "whoever sent this", which is the thing that
    // was always meant. It is strictly safer: it cannot be evaded, because
    // there is exactly one origin, and it cannot be wrong.
    conditions.push(stxFromOrigin(sends, SENT_LESS_THAN_OR_EQUAL));
  }

  if (contractSends > 0n) {
    conditions.push(stxFromContract(input.contractId, contractSends, SENT_LESS_THAN_OR_EQUAL));
  }

  // Nothing should move, and deny with no conditions says so as forcefully as a
  // wallet allows: any transfer at all fails the transaction.
  return { postConditionMode: 'deny', postConditions: conditions };
}

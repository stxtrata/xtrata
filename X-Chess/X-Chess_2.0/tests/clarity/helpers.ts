// Shared helpers for the Clarity suite.
//
// Every value is read through `cvToJSON`, which is a documented, stable shape,
// rather than by reaching into the Clarity value objects. Those internals have
// changed between @stacks/transactions majors before, and a test suite that
// breaks on a dependency bump is a test suite people start skipping.

import { Cl, cvToJSON } from '@stacks/transactions';
import type { ClarityValue } from '@stacks/transactions';
import { expect } from 'vitest';

export const CONTRACT = 'xchess-core-v1';

export const accounts = simnet.getAccounts();
export const DEPLOYER = accounts.get('deployer')!;
export const ALICE = accounts.get('wallet_1')!;
export const BOB = accounts.get('wallet_2')!;
export const CAROL = accounts.get('wallet_3')!;
export const DAVE = accounts.get('wallet_4')!;
// A wallet used by exactly one test, which empties it.
//
// simnet state carries across tests in this file (the clarinet environment is
// shared, and `isolate: false` keeps it that way for speed). So a test that
// drains an account drains it for every test after it. Giving the destructive
// test its own wallet is cheaper and clearer than restoring balances.
export const PAUPER = accounts.get('wallet_5')!;
/** Exactly zero STX. The wallet the final acceptance test is written about. */
export const ZERO = accounts.get('wallet_6')!;

interface Json {
  type: string;
  value: unknown;
  success?: boolean;
}

export const json = (cv: ClarityValue): Json => cvToJSON(cv) as Json;

export const pretty = (cv: ClarityValue): string => Cl.prettyPrint(cv);

/** The payload of an `(ok ...)`, or a throw naming the error. */
export function unwrapOk(cv: ClarityValue): Json {
  const parsed = json(cv);
  if (parsed.success === false) {
    throw new Error(`expected ok, got ${Cl.prettyPrint(cv)}`);
  }
  return (parsed.value ?? parsed) as Json;
}

export function asBigInt(value: Json): bigint {
  return BigInt(String(value.value));
}

/** A read-only function returning a bare uint. */
export function readUint(fn: string, args: ClarityValue[] = [], sender = DEPLOYER): bigint {
  return asBigInt(json(simnet.callReadOnlyFn(CONTRACT, fn, args, sender).result));
}

export function readBool(fn: string, args: ClarityValue[] = [], sender = DEPLOYER): boolean {
  return json(simnet.callReadOnlyFn(CONTRACT, fn, args, sender).result).value === true;
}

/** A tuple, flattened to plain values. */
export function readTuple(
  fn: string,
  args: ClarityValue[] = [],
  sender = DEPLOYER
): Record<string, string | boolean> | null {
  const parsed = json(simnet.callReadOnlyFn(CONTRACT, fn, args, sender).result);
  return flatten(parsed);
}

function flatten(parsed: Json): Record<string, string | boolean> | null {
  // `(optional ...)` wraps its payload; none has a null value.
  let node: Json = parsed;
  while (node && typeof node === 'object' && node.type?.startsWith('(optional')) {
    if (node.value === null) return null;
    node = node.value as Json;
  }
  const fields = node.value as Record<string, Json>;
  if (!fields || typeof fields !== 'object') return null;
  const out: Record<string, string | boolean> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = value.value as string | boolean;
  }
  return out;
}

export function self(): string {
  return String(json(simnet.callReadOnlyFn(CONTRACT, 'get-self', [], DEPLOYER).result).value);
}

export function stxBalance(who: string): bigint {
  return simnet.getAssetsMap().get('STX')?.get(who) ?? 0n;
}

export function contractBalance(): bigint {
  return stxBalance(`${simnet.deployer}.${CONTRACT}`);
}

export const totalReserved = (): bigint => readUint('get-total-reserved');
export const withdrawable = (): bigint => readUint('get-withdrawable');

export interface Price {
  bootstrap: bigint;
  liability: bigint;
  margin: bigint;
  total: bigint;
}

export function sponsorPrice(): Price {
  const row = readTuple('get-sponsor-price')!;
  return {
    bootstrap: BigInt(row.bootstrap as string),
    liability: BigInt(row.liability as string),
    margin: BigInt(row.margin as string),
    total: BigInt(row.total as string)
  };
}

export interface SponsorRow {
  rebatesLeft: bigint;
  rebate: bigint;
  reserved: bigint;
  expiry: bigint;
  settled: boolean;
  fundedBy: string;
}

export function sponsorship(game: number, who: string): SponsorRow | null {
  const row = readTuple('get-sponsorship', [Cl.uint(game), Cl.principal(who)]);
  if (!row) return null;
  return {
    rebatesLeft: BigInt(row['rebates-left'] as string),
    rebate: BigInt(row.rebate as string),
    reserved: BigInt(row.reserved as string),
    expiry: BigInt(row.expiry as string),
    settled: row.settled as boolean,
    fundedBy: row['funded-by'] as string
  };
}

/**
 * The invariant, asserted after every operation that touches money.
 *
 * The contract must hold at least what it says it owes. If this ever fails, one
 * game's reserve is payable out of another game's money, which is the failure
 * the whole accounting design exists to prevent.
 */
export function assertSolvent(context = ''): void {
  const balance = contractBalance();
  const owed = totalReserved();
  expect(balance >= owed, `${context}: contract holds ${balance} but owes ${owed}`).toBe(true);
  expect(readBool('is-solvent'), `${context}: contract disagrees about its own solvency`).toBe(true);
}

export const RULES_HASH = Cl.some(Cl.bufferFromHex('ab'.repeat(32)));
export const NO_RULES = Cl.none();

export function openGame(sender: string, ranked = false): number {
  const receipt = simnet.callPublicFn(CONTRACT, 'open-game', [RULES_HASH, Cl.bool(ranked)], sender);
  return Number(asBigInt(unwrapOk(receipt.result)));
}

export function openSponsored(sender: string, opponent: string, ranked = false): number {
  const receipt = simnet.callPublicFn(
    CONTRACT,
    'open-sponsored-game',
    [RULES_HASH, Cl.bool(ranked), Cl.principal(opponent)],
    sender
  );
  return Number(asBigInt(unwrapOk(receipt.result)));
}

export function openSponsoredBoth(sender: string, white: string, black: string, ranked = false): number {
  const receipt = simnet.callPublicFn(
    CONTRACT,
    'open-sponsored-both',
    [RULES_HASH, Cl.bool(ranked), Cl.principal(white), Cl.principal(black)],
    sender
  );
  return Number(asBigInt(unwrapOk(receipt.result)));
}

export function submit(sender: string, game: number, value: string) {
  return simnet.callPublicFn(CONTRACT, 'submit', [Cl.uint(game), Cl.stringAscii(value)], sender);
}

export function settle(sender: string, game: number, who: string) {
  return simnet.callPublicFn(
    CONTRACT,
    'settle-sponsorship',
    [Cl.uint(game), Cl.principal(who)],
    sender
  );
}

export function topUp(sender: string, game: number, who: string) {
  return simnet.callPublicFn(
    CONTRACT,
    'top-up-sponsorship',
    [Cl.uint(game), Cl.principal(who)],
    sender
  );
}

export { Cl };

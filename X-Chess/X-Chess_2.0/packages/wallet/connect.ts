// Getting an address out of a wallet, and how long to wait for each question.
//
// This lived in apps/chess/main.ts as wiring, and stopped being wiring the
// moment it acquired a timeout. It is policy now: it decides how patient to be,
// and getting that wrong is not a cosmetic fault - too short abandons a request
// the user is in the middle of approving, too long is a board that looks like it
// did not hear the click. Both have happened.
//
// The rule underneath all of it:
//
//   ASKING A WALLET WHO IT IS IS A PROBE. ASKING IT TO CONNECT IS A DIALOG.
//
// A probe is answered by software and should take milliseconds. A dialog is
// answered by a person reading it, and a person is slow. One number cannot serve
// both, which is what the first two attempts at this each assumed in turn.

import { collectProviders, shimInstalled } from './providers.js';
import { extractAddress, walletCall } from './requests.js';
import type { RequestOptions } from './requests.js';

/** How long a provider gets to answer a question that opens nothing. */
export const PROBE_MS = 6_000;

/**
 * How long the whole attempt gets, dialogs included.
 *
 * Longer than the runtime shim's own 90-second limit on the connect SDK, so the
 * board always hears the shim's answer rather than giving up just before it.
 */
export const CONNECT_MS = 120_000;

type Call = (
  method: string,
  params: unknown,
  options?: RequestOptions
) => Promise<{ result: unknown }>;

export interface ConnectDeps {
  /** Injected so the policy can be tested without a wallet. */
  call?: Call;
  providerCount?: () => number;
  underRuntime?: () => boolean;
  now?: () => number;
}

/**
 * Questions that never open anything, asked only where that is guaranteed.
 *
 * Under the Xtrata runtime the shim answers these itself, instantly, and returns
 * the address it stored last time - so a reload reconnects with no dialog at
 * all. Off the runtime the same question goes to a real wallet, which may well
 * prompt for it, and a six-second probe would then abandon a dialog. So this
 * round is skipped entirely when there is no shim.
 */
const REMEMBERED = ['stx_getAddresses', 'wallet_getAccount'];

/** Questions that ask a person for something. */
const DIALOGS = ['wallet_connect', 'stx_requestAccounts', 'stx_getAddresses', 'getAddresses'];

/**
 * Connect, or say why not.
 *
 * Method-first, provider-second: a wallet that cannot do one method may still
 * answer another, and a provider that refuses everything must not stop us
 * reaching the one beside it that works.
 */
export async function connectWallet({
  call = walletCall as Call,
  providerCount = () => collectProviders().length,
  underRuntime = shimInstalled,
  now = () => Date.now()
}: ConnectDeps = {}): Promise<{ address: string }> {
  const ask = async (method: string, timeoutMs: number): Promise<string | null> => {
    try {
      const { result } = await call(method, {}, { timeoutMs });
      return extractAddress(result);
    } catch {
      // A provider that cannot do one method is not a failure. walletCall has
      // already moved through every provider that said so.
      return null;
    }
  };

  if (underRuntime()) {
    for (const method of REMEMBERED) {
      const address = await ask(method, PROBE_MS);
      if (address) return { address };
    }
  }

  const deadline = now() + CONNECT_MS;
  for (const method of DIALOGS) {
    const left = deadline - now();
    if (left <= 0) break;

    // Divided by the providers still to try, so a provider that says nothing at
    // all can never eat the budget the next one needs. With three providers
    // that is forty seconds each: enough to read a dialog, and bounded.
    const share = Math.max(PROBE_MS, Math.floor(left / Math.max(1, providerCount())));
    const address = await ask(method, share);
    if (address) return { address };
  }

  const error: Error & { code?: string } = new Error(
    providerCount()
      ? 'a wallet answered but did not give an address'
      : 'no Stacks wallet found'
  );
  error.code = providerCount() ? 'NO_ADDRESS' : 'NO_WALLET';
  throw error;
}

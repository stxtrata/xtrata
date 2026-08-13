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

import { collectProviders, usingHostBridge } from './providers.js';
import { extractAddress, walletCall } from './requests.js';
import type { RequestOptions } from './requests.js';

/** How long a provider gets to answer a question that opens nothing. */
export const PROBE_MS = 6_000;

/**
 * How long the whole attempt gets, dialogs included.
 *
 * Three minutes reads as a lot until it is divided: a page under the runtime
 * offers three providers, so this is a minute each, and a minute is what a
 * first-time connect actually costs - a wallet picker, then the extension, then
 * choosing an account, then approving. Two of those steps are reading.
 *
 * Also longer than the runtime shim's own 90-second limit on the connect SDK,
 * so the board hears the shim's answer rather than giving up just before it.
 */
export const CONNECT_MS = 180_000;

type Call = (
  method: string,
  params: unknown,
  options?: RequestOptions
) => Promise<{ result: unknown }>;

export interface ConnectDeps {
  /** Injected so the policy can be tested without a wallet. */
  call?: Call;
  providerCount?: () => number;
  bridged?: () => boolean;
  now?: () => number;
}

/**
 * Questions that never open anything, asked only where that is guaranteed.
 *
 * The guarantee is a HOST BRIDGE. With one, the shim ranks first and answers
 * these by asking the Xtrata site, which is already connected to the wallet - so
 * the board learns the address with nothing opening and nobody clicking.
 *
 * Without one the shim ranks last (see collectProviders), so the same question
 * reaches a real extension instead, which may well prompt for it - and a
 * six-second probe would then abandon a dialog, which is the fault this whole
 * file exists to stop. So the round is skipped rather than made careful.
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
  bridged = usingHostBridge,
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

  if (bridged()) {
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

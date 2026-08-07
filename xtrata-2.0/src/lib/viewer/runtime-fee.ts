// The network fee an inscription may ask for.
//
// The runtime wallet bridge forwards a contract call from an inscription to the
// viewer's wallet. Everything in that request is untrusted: the inscription is
// arbitrary code, permanent, and written by whoever paid to put it on chain.
//
// Until now the bridge simply dropped any fee, which is safe and also means an
// inscription cannot ask for a sane one. Wallets left to estimate have quoted
// half a STX for a contract call that settles for a hundredth of that, and a
// viewer who does not think to edit the figure pays it.
//
// So the fee is carried, within a bound. The bound is the point: a fee is the
// one field in a contract call that moves the viewer's money without appearing
// as a post condition, so an unbounded one is a way to drain a wallet through a
// confirmation dialog that looks ordinary.
//
// Out of range is ignored rather than rejected. A hostile inscription should not
// be able to block a call by asking for something absurd, and a careless one
// should still work; in both cases the wallet falls back to its own estimate,
// which is exactly the behaviour before this existed.

/**
 * One STX, in microSTX.
 *
 * Comfortably above any legitimate fee — contract calls on this chain have been
 * settling between 0.003 and 0.01 STX — and far below an amount that could hurt
 * somebody who approved without looking.
 */
export const MAX_RUNTIME_FEE_USTX = 1_000_000n;

/**
 * A fee to pass to the wallet, or undefined to let it estimate.
 *
 * Accepts what a JSON payload can carry: a number, a decimal string, or a
 * bigint. Rejects everything else, including fractions, negatives, zero and
 * anything above the cap.
 *
 * Zero is refused deliberately. It is a valid fee only for a sponsored
 * transaction, which this path does not build, and a zero-fee transaction is
 * never mined — so it would look like a signature that silently did nothing.
 */
export const parseRuntimeFee = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;

  let amount: bigint;
  try {
    if (typeof value === 'bigint') {
      amount = value;
    } else if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) return undefined;
      amount = BigInt(value);
    } else if (typeof value === 'string') {
      const text = value.trim();
      if (!/^[0-9]+$/.test(text)) return undefined;
      amount = BigInt(text);
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }

  if (amount <= 0n) return undefined;
  if (amount > MAX_RUNTIME_FEE_USTX) return undefined;

  return amount.toString(10);
};

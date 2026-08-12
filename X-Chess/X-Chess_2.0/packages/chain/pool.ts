// Run a batch of reads a few at a time.
//
// The board resolves a name for every distinct sender and a timestamp for every
// distinct block height in a game, and both did it with a bare `Promise.all`.
// A thirty-three move game therefore fired up to thirty-three simultaneous
// requests at a public host from one IP.
//
// That matters more here than raw politeness. The rate limit is per address and
// THE WALLET SPENDS FROM THE SAME ALLOWANCE - for the nonce, the fee estimate
// and the broadcast itself - so a board that empties it in one burst is a board
// whose player cannot then move. See the comment on Endpoint.remaining.
//
// Deliberately tiny, and deliberately not a queue with priorities or retries.
// Neither of the callers blocks anything: the position is drawn from replay
// immediately and these only fill in labels, so arriving over a few seconds
// instead of one paint costs nothing anybody can see.

/**
 * Run `tasks` with at most `limit` in flight, preserving input order in the
 * result.
 *
 * Rejections are not caught here. Both callers already handle their own
 * failures per item, and swallowing them at this layer would turn a refusal
 * into an answer - which is the exact bug this file was written alongside.
 */
export async function pool<T>(
  limit: number,
  tasks: readonly (() => Promise<T>)[]
): Promise<T[]> {
  const width = Math.max(1, Math.floor(limit));
  const results = new Array<T>(tasks.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    for (;;) {
      const at = next++;
      if (at >= tasks.length) return;
      results[at] = await tasks[at]();
    }
  };

  await Promise.all(Array.from({ length: Math.min(width, tasks.length) }, worker));
  return results;
}

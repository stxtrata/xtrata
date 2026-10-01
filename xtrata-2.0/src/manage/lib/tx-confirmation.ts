/**
 * Wait for a Stacks transaction to confirm, through the site's Hiro proxy.
 * 'timeout' means "could not confirm yet" — the transaction may still land, so
 * callers re-read the chain rather than assuming it failed.
 */
export type TxConfirmation = { status: 'success' } | { status: 'failed'; reason: string } | { status: 'timeout' };

const FAILED_STATUSES = new Set([
  'abort_by_response',
  'abort_by_post_condition',
  'dropped_replace_by_fee',
  'dropped_replace_across_fork',
  'dropped_too_expensive',
  'dropped_stale_garbage_collect',
  'dropped_problematic'
]);

export async function waitForTxConfirmation(
  txId: string,
  network: 'mainnet' | 'testnet',
  options: {
    timeoutMs?: number;
    pollMs?: number;
    fetcher?: typeof fetch;
    sleep?: (ms: number) => Promise<void>;
    now?: () => number;
    signal?: { cancelled: boolean };
  } = {}
): Promise<TxConfirmation> {
  const id = txId.startsWith('0x') ? txId : `0x${txId}`;
  const fetcher = options.fetcher ?? fetch;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? Date.now;
  const deadline = now() + (options.timeoutMs ?? 15 * 60_000);
  while (now() < deadline && !options.signal?.cancelled) {
    try {
      const response = await fetcher(`/hiro/${network}/extended/v1/tx/${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (response.ok) {
        const status = String(((await response.json()) as { tx_status?: unknown }).tx_status ?? '').toLowerCase();
        if (status === 'success') return { status: 'success' };
        if (FAILED_STATUSES.has(status)) return { status: 'failed', reason: status };
      }
    } catch {
      // A failed poll is not an answer; keep polling until the deadline.
    }
    await sleep(options.pollMs ?? 5_000);
  }
  return { status: 'timeout' };
}

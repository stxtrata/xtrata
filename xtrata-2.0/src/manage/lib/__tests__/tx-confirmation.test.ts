import { describe, expect, it } from 'vitest';
import { waitForTxConfirmation } from '../tx-confirmation';

const respond = (statuses: Array<string | 'error' | 404>) => {
  const urls: string[] = [];
  let i = 0;
  const fetcher = (async (url: string) => {
    urls.push(url);
    const next = statuses[Math.min(i++, statuses.length - 1)];
    if (next === 'error') throw new Error('network');
    if (next === 404) return new Response('', { status: 404 });
    return Response.json({ tx_status: next });
  }) as unknown as typeof fetch;
  return { fetcher, urls };
};
const clock = () => { let t = 0; return { now: () => t, sleep: async (ms: number) => { t += ms; } }; };

describe('waitForTxConfirmation', () => {
  it('polls through pending, errors and 404 until success', async () => {
    const { fetcher, urls } = respond([404, 'error', 'pending', 'success']);
    await expect(waitForTxConfirmation('ab', 'mainnet', { fetcher, ...clock() })).resolves.toEqual({ status: 'success' });
    expect(urls[0]).toBe('/hiro/mainnet/extended/v1/tx/0xab');
    expect(urls).toHaveLength(4);
  });

  it('reports a failed transaction', async () => {
    const { fetcher } = respond(['abort_by_response']);
    await expect(waitForTxConfirmation('0xab', 'testnet', { fetcher, ...clock() })).resolves.toEqual({ status: 'failed', reason: 'abort_by_response' });
  });

  it('times out as "not confirmed yet", never as failed', async () => {
    const { fetcher } = respond(['pending']);
    await expect(waitForTxConfirmation('ab', 'mainnet', { fetcher, ...clock(), timeoutMs: 20_000, pollMs: 5_000 })).resolves.toEqual({ status: 'timeout' });
  });
});

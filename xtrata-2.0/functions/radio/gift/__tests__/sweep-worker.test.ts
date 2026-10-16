import { describe, expect, it, vi } from 'vitest';
import worker, { sweepOnce } from '../../../../workers/radio-gift-sweep/index';

const env = { SWEEP_URL: 'https://radio.test/radio/gift/sweep', RADIO_GIFT_SWEEP_SECRET: 'x'.repeat(30) };

describe('radio gift sweep worker', () => {
  it('knocks once with the secret and reports the steps', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ steps: ['deposits-scanned', 'nothing'] })));
    expect(await sweepOnce(env, fetcher as unknown as typeof fetch)).toEqual({ steps: ['deposits-scanned', 'nothing'] });
    expect(fetcher).toHaveBeenCalledWith(env.SWEEP_URL, { method: 'POST', headers: { authorization: `Bearer ${env.RADIO_GIFT_SWEEP_SECRET}` } });
  });
  it('fails loudly (so the run shows as failed) when the secret is missing or the answer is an error', async () => {
    await expect(sweepOnce({ SWEEP_URL: env.SWEEP_URL }, vi.fn() as unknown as typeof fetch)).rejects.toThrow(/not set/);
    await expect(sweepOnce(env, (async () => new Response('', { status: 404 })) as unknown as typeof fetch)).rejects.toThrow(/404/);
  });
  it('is not a public page', async () => {
    expect((await worker.fetch()).status).toBe(404);
  });
});

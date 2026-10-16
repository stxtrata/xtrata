import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from '../[[path]]';

const SECRET = 'endpoint-secret-'.repeat(3);
const call = (env: Record<string, unknown>, headers: Record<string, string> = {}, method = 'POST') =>
  onRequest({ request: new Request('https://radio.test/radio/gift/sweep', { method, headers }), env: env as never, params: { path: ['sweep'] } });

afterEach(() => vi.unstubAllGlobals());

describe('POST /radio/gift/sweep', () => {
  it('looks like no page at all without the right secret (and says nothing about why)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('the sweep must not reach the network'); }));
    for (const [env, headers] of [
      [{ RADIO_GIFT_SWEEP_SECRET: SECRET }, {}],
      [{ RADIO_GIFT_SWEEP_SECRET: SECRET }, { authorization: 'Bearer nope' }],
      [{}, { authorization: `Bearer ${SECRET}` }],
      [{ RADIO_GIFT_SWEEP_SECRET: SECRET }, { origin: 'https://radio.test' }]
    ] as [Record<string, unknown>, Record<string, string>][]) {
      const r = await call(env, headers);
      expect(r.status).toBe(404);
      expect(await r.json()).toEqual({ error: 'Not found' });
    }
    expect((await call({ RADIO_GIFT_SWEEP_SECRET: SECRET }, { authorization: `Bearer ${SECRET}` }, 'GET')).status).toBe(404);
  });

  it('runs the sweep for the right secret, with no Origin header, and answers what it did', async () => {
    const r = await call({ RADIO_GIFT_SWEEP_SECRET: SECRET /* gifts are not enabled here */ }, { authorization: `Bearer ${SECRET}` });
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ steps: ['off'] });
  });
});

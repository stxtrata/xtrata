// Being refused for asking too often is not the chain being down.
//
// The bug these hold down cost a real player a real move. The board polled
// every five seconds and spent three requests a poll, which is thirty-six a
// minute against a public allowance of about fifty. The allowance is per IP and
// the WALLET spends from the same one - nonce, fee estimate, broadcast - so
// there was nothing left when it came time to send. Xverse reported "unable to
// parse node response", because a rate-limit body is not the JSON it expects,
// and the board reported "could not read the sponsorship from the chain".
// Neither sentence contains the word that mattered.
//
// Measured on 2026-08-08: api.mainnet.hiro.so, stacks-node-api.stacks.co and
// api.hiro.so all answer and all share ONE bucket. They 429 together. So the
// endpoint list is insurance against an outage and no defence at all against a
// rate limit; the only defence is asking for less.

import { describe, expect, it } from 'vitest';
import { PUBLIC_API, makeEndpoint } from '../../packages/chain/endpoint.js';

/** A fetch that answers with whatever status each base is scripted to give. */
function scripted(byBase: Record<string, number>, seen: string[] = []) {
  return (async (url: string) => {
    seen.push(String(url));
    const base = Object.keys(byBase).find((b) => String(url).startsWith(b));
    const status = base ? byBase[base] : 500;
    return {
      status,
      headers: { get: () => null },
      async text() {
        return '';
      }
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

describe('a rate-limited endpoint', () => {
  it('moves to the next base rather than treating 429 as an answer', async () => {
    const seen: string[] = [];
    const endpoint = makeEndpoint({
      network: 'mainnet',
      fetch: scripted(
        {
          'https://api.mainnet.hiro.so': 429,
          'https://stacks-node-api.stacks.co': 200,
          'https://api.hiro.so': 200
        },
        seen
      )
    });

    const response = await endpoint.request('/v2/info');
    expect(response.status).toBe(200);
    expect(seen.length, 'the first base must actually have been tried').toBe(2);
    expect(seen[1]).toContain('stacks-node-api.stacks.co');
  });

  it('says it was RATE LIMITED, not that the chain is unavailable', async () => {
    // The distinction is the whole point. "The chain is unavailable" sends
    // somebody looking for a problem that does not exist, and it does not tell
    // them the one thing that would help: wait a minute.
    const endpoint = makeEndpoint({
      network: 'mainnet',
      fetch: scripted({
        'https://api.mainnet.hiro.so': 429,
        'https://stacks-node-api.stacks.co': 429,
        'https://api.hiro.so': 429
      })
    });

    await expect(endpoint.request('/v2/info')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('still calls a real outage unavailable', async () => {
    const endpoint = makeEndpoint({
      network: 'mainnet',
      fetch: scripted({
        'https://api.mainnet.hiro.so': 503,
        'https://stacks-node-api.stacks.co': 503,
        'https://api.hiro.so': 503
      })
    });

    await expect(endpoint.request('/v2/info')).rejects.toMatchObject({
      code: 'CHAIN_UNAVAILABLE'
    });
  });

  it('STILL believes a 404, which is the contract answering', async () => {
    // The older lesson, and it must not be undone by the newer one. A 404 means
    // "no such thing" and going somewhere else to ask again would be looking for
    // a different answer to a question already answered.
    const seen: string[] = [];
    const endpoint = makeEndpoint({
      network: 'mainnet',
      fetch: scripted(
        {
          'https://api.mainnet.hiro.so': 404,
          'https://stacks-node-api.stacks.co': 200,
          'https://api.hiro.so': 200
        },
        seen
      )
    });

    const response = await endpoint.request('/v2/info');
    expect(response.status).toBe(404);
    expect(seen.length, 'a 404 must not cause a second request').toBe(1);
  });

  it('remembers how much allowance the host says is left', async () => {
    const endpoint = makeEndpoint({
      network: 'mainnet',
      fetch: (async () =>
        ({
          status: 200,
          headers: { get: (name: string) => (name === 'x-ratelimit-remaining-minute' ? '14' : null) },
          async text() {
            return '';
          }
        }) as unknown as Response) as unknown as typeof fetch
    });

    expect(endpoint.remaining, 'nothing read yet').toBe(null);
    await endpoint.request('/v2/info');
    expect(endpoint.remaining).toBe(14);
  });
});

describe('the endpoint list', () => {
  it('does not name the host that stopped existing', () => {
    // stacks-node-api.mainnet.stacks.co does not connect at all. Leaving it in
    // made the list look like it had a fallback when it had none.
    expect(PUBLIC_API.mainnet).not.toContain('https://stacks-node-api.mainnet.stacks.co');
  });

  it('names more than one host, because a permanent artefact cannot be edited', () => {
    expect(PUBLIC_API.mainnet.length).toBeGreaterThan(1);
  });
});

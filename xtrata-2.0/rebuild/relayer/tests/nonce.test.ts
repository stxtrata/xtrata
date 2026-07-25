import { describe, expect, it } from 'vitest';
import { InMemoryNonceAuthority } from '../src/nonce.js';
import { FakeChain, SPONSOR_KEY, testConfig } from './helpers.js';
import { getAddressFromPrivateKey } from '@stacks/transactions';

const sponsorAddress = getAddressFromPrivateKey(SPONSOR_KEY, 'mainnet');
void testConfig;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('single-writer nonce authority', () => {
  it('20 concurrent submits get 20 distinct sequential nonces', async () => {
    const chain = new FakeChain();
    chain.nonce = 7n;
    const authority = new InMemoryNonceAuthority(chain, sponsorAddress);
    const nonces: bigint[] = [];
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        authority.withNonce(async (nonce) => {
          // Random interleaving to expose serialization failures.
          await delay(Math.floor(Math.random() * 5));
          nonces.push(nonce);
          return { outcome: 'broadcast' as const, value: i };
        })
      )
    );
    expect(nonces).toHaveLength(20);
    expect(new Set(nonces.map(String)).size).toBe(20);
    expect([...nonces].sort((a, b) => (a < b ? -1 : 1))).toEqual(
      Array.from({ length: 20 }, (_, i) => 7n + BigInt(i))
    );
    // Chain nonce fetched once, not per submission.
    expect(chain.nonceCalls).toBe(1);
  });

  it('a failed signing attempt returns its nonce to the pool (no gaps)', async () => {
    const chain = new FakeChain();
    chain.nonce = 3n;
    const authority = new InMemoryNonceAuthority(chain, sponsorAddress);
    const first = await authority.withNonce(async (nonce) => ({ outcome: 'unused' as const, value: nonce }));
    const second = await authority.withNonce(async (nonce) => ({ outcome: 'broadcast' as const, value: nonce }));
    const third = await authority.withNonce(async (nonce) => ({ outcome: 'broadcast' as const, value: nonce }));
    expect(first).toBe(3n);
    expect(second).toBe(3n);
    expect(third).toBe(4n);
  });

  it('a rejected task does not break the queue', async () => {
    const chain = new FakeChain();
    chain.nonce = 0n;
    const authority = new InMemoryNonceAuthority(chain, sponsorAddress);
    await expect(
      authority.withNonce(async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
    const next = await authority.withNonce(async (nonce) => ({ outcome: 'broadcast' as const, value: nonce }));
    expect(next).toBe(0n);
  });

  it('a nonce conflict resyncs from the chain', async () => {
    const chain = new FakeChain();
    chain.nonce = 10n;
    const authority = new InMemoryNonceAuthority(chain, sponsorAddress);
    await authority.withNonce(async (nonce) => ({ outcome: 'broadcast' as const, value: nonce })); // 10
    chain.nonce = 25n; // external tx moved the account
    await authority.withNonce(async (nonce) => {
      expect(nonce).toBe(11n); // stale
      return { outcome: 'conflict' as const, value: null };
    });
    const resynced = await authority.withNonce(async (nonce) => ({ outcome: 'broadcast' as const, value: nonce }));
    expect(resynced).toBe(25n);
  });
});

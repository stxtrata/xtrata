/**
 * The rate-limited read port.
 *
 * This exists because the first real plates run minted all 24 correctly and
 * then halted: the gate's 48 read-back calls tripped Hiro's rate limiter on
 * call ~40, every read after that returned 429, and an unread inscription is
 * not a verified one. The halt was right. Needing it was not.
 */
import { describe, expect, it, vi } from 'vitest';

import { backoffMs, describeHiroKeys, hiroApiKeys, makeHiroFetch } from '../hiro-fetch.mjs';

const response = (status: number, headers: Record<string, string> = {}) => ({
  ok: status < 400,
  status,
  headers: new Headers(headers)
});

/** Sleep and clock that never actually wait, so the suite stays fast. */
const fakeTiming = () => {
  let now = 0;
  const slept: number[] = [];
  return {
    slept,
    now: () => now,
    sleep: async (ms: number) => {
      slept.push(ms);
      now += ms;
    },
    tick: (ms: number) => {
      now += ms;
    }
  };
};

describe('key resolution', () => {
  it('reads the same names the rest of the repo does', () => {
    expect(hiroApiKeys({ HIRO_API_KEY: 'a' })).toEqual(['a']);
    expect(hiroApiKeys({ HIRO_API_KEYS: 'a, b' })).toEqual(['a', 'b']);
    expect(hiroApiKeys({ VITE_HIRO_API_KEY: 'c' })).toEqual(['c']);
    expect(hiroApiKeys({ HIRO_API_KEY_2: 'b', HIRO_API_KEY_1: 'a' })).toEqual(['a', 'b']);
  });

  it('deduplicates, so a rotation actually rotates', () => {
    expect(hiroApiKeys({ HIRO_API_KEY: 'a', VITE_HIRO_API_KEY: 'a' })).toEqual(['a']);
  });

  it('ignores blank values rather than sending an empty header', () => {
    expect(hiroApiKeys({ HIRO_API_KEY: '   ' })).toEqual([]);
  });

  it('never reveals the key', () => {
    const described = describeHiroKeys({ HIRO_API_KEY: 'super-secret-value' });
    expect(described).not.toContain('super-secret');
    expect(described).toBe('1 Hiro API key configured');
    expect(describeHiroKeys({})).toMatch(/no Hiro API key/);
  });
});

describe('backoff', () => {
  it('obeys Retry-After in seconds, because the server knows', () => {
    expect(backoffMs({ attempt: 0, response: response(429, { 'retry-after': '7' }) })).toBe(7_000);
  });

  it('obeys Retry-After as an HTTP date', () => {
    const at = new Date(Date.now() + 5_000).toUTCString();
    const wait = backoffMs({ attempt: 0, response: response(429, { 'retry-after': at }) });
    expect(wait).toBeGreaterThan(3_000);
    expect(wait).toBeLessThanOrEqual(6_000);
  });

  it('caps Retry-After, so a hostile or silly value cannot hang the run', () => {
    expect(backoffMs({ attempt: 0, response: response(429, { 'retry-after': '99999' }), capMs: 30_000 })).toBe(30_000);
  });

  it('grows exponentially and is capped', () => {
    const full = (attempt: number) => backoffMs({ attempt, baseMs: 1_000, capMs: 30_000, random: () => 1 });
    expect(full(0)).toBe(1_000);
    expect(full(1)).toBe(2_000);
    expect(full(2)).toBe(4_000);
    expect(full(10)).toBe(30_000);
  });

  it('jitters, so three wizards do not retry in lockstep', () => {
    expect(backoffMs({ attempt: 3, baseMs: 1_000, random: () => 0 })).toBe(0);
    expect(backoffMs({ attempt: 3, baseMs: 1_000, random: () => 0.5 })).toBe(4_000);
  });
});

describe('the fetch port', () => {
  it('attaches the key under both header names', async () => {
    const seen: Headers[] = [];
    const fetchImpl = vi.fn(async (_url: string, init: any) => {
      seen.push(new Headers(init?.headers));
      return response(200);
    });
    const timing = fakeTiming();
    const hiroFetch = makeHiroFetch({ env: { HIRO_API_KEY: 'k' }, fetchImpl, ...timing });
    await hiroFetch('https://api.hiro.so/x');
    expect(seen[0].get('x-hiro-api-key')).toBe('k');
    expect(seen[0].get('x-api-key')).toBe('k');
  });

  it('sends no key header at all when none is configured', async () => {
    const seen: Headers[] = [];
    const fetchImpl = vi.fn(async (_url: string, init: any) => {
      seen.push(new Headers(init?.headers ?? {}));
      return response(200);
    });
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, ...fakeTiming() });
    await hiroFetch('https://api.hiro.so/x');
    expect(seen[0].has('x-api-key')).toBe(false);
  });

  it('retries a 429 and returns the eventual success', async () => {
    let call = 0;
    const fetchImpl = vi.fn(async () => (++call < 3 ? response(429) : response(200)));
    const timing = fakeTiming();
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, random: () => 1, ...timing });
    const result = await hiroFetch('https://api.hiro.so/x');
    expect(result.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('waits longer each time', async () => {
    const fetchImpl = vi.fn(async () => response(429));
    const timing = fakeTiming();
    const hiroFetch = makeHiroFetch({
      env: {},
      fetchImpl,
      maxAttempts: 4,
      baseMs: 1_000,
      minIntervalMs: 0,
      random: () => 1,
      ...timing
    });
    await hiroFetch('https://api.hiro.so/x');
    expect(timing.slept).toEqual([1_000, 2_000, 4_000]);
  });

  it('gives up after maxAttempts and hands back the 429 rather than throwing', async () => {
    // Not an exception on purpose: the caller turns an unreadable response into
    // an `unavailable` gate result, and that is a different thing from
    // "read something and it was wrong". Throwing would collapse the two.
    const fetchImpl = vi.fn(async () => response(429));
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, maxAttempts: 3, random: () => 1, ...fakeTiming() });
    const result = await hiroFetch('https://api.hiro.so/x');
    expect(result.status).toBe(429);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('does NOT retry a 404, because an answer is not a failure', async () => {
    const fetchImpl = vi.fn(async () => response(404));
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, ...fakeTiming() });
    const result = await hiroFetch('https://api.hiro.so/x');
    expect(result.status).toBe(404);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('does not retry a 400 either', async () => {
    const fetchImpl = vi.fn(async () => response(400));
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, ...fakeTiming() });
    await hiroFetch('https://api.hiro.so/x');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('retries a 503, which is the gateway having a moment', async () => {
    let call = 0;
    const fetchImpl = vi.fn(async () => (++call < 2 ? response(503) : response(200)));
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, random: () => 1, ...fakeTiming() });
    expect((await hiroFetch('https://api.hiro.so/x')).status).toBe(200);
  });

  it('spaces successful calls out, which is the cheaper half of the fix', async () => {
    // A burst that never trips the limiter needs no backoff at all.
    const fetchImpl = vi.fn(async () => response(200));
    const timing = fakeTiming();
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, minIntervalMs: 120, ...timing });
    await hiroFetch('https://api.hiro.so/1');
    await hiroFetch('https://api.hiro.so/2');
    await hiroFetch('https://api.hiro.so/3');
    expect(timing.slept.filter((ms) => ms > 0)).toEqual([120, 120]);
  });

  it('does not throttle when the caller has already waited', async () => {
    const fetchImpl = vi.fn(async () => response(200));
    const timing = fakeTiming();
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, minIntervalMs: 120, ...timing });
    await hiroFetch('https://api.hiro.so/1');
    timing.tick(500);
    await hiroFetch('https://api.hiro.so/2');
    expect(timing.slept.filter((ms) => ms > 0)).toEqual([]);
  });

  it('rotates keys across retries, so the refused key is not hammered', async () => {
    const used: (string | null)[] = [];
    let call = 0;
    const fetchImpl = vi.fn(async (_url: string, init: any) => {
      used.push(new Headers(init?.headers).get('x-api-key'));
      return ++call < 3 ? response(429) : response(200);
    });
    const hiroFetch = makeHiroFetch({
      env: { HIRO_API_KEYS: 'first, second' },
      fetchImpl,
      random: () => 1,
      ...fakeTiming()
    });
    await hiroFetch('https://api.hiro.so/x');
    expect(used).toEqual(['first', 'second', 'first']);
  });

  it('reports each retry so a long wait is visible rather than a hang', async () => {
    const onRetry = vi.fn();
    let call = 0;
    const fetchImpl = vi.fn(async () => (++call < 2 ? response(429, { 'retry-after': '3' }) : response(200)));
    const hiroFetch = makeHiroFetch({ env: {}, fetchImpl, onRetry, ...fakeTiming() });
    await hiroFetch('https://api.hiro.so/x');
    expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({ status: 429, attempt: 1, waitMs: 3_000 }));
  });
});

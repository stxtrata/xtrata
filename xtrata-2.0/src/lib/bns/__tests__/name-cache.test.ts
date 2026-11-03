import { describe, expect, it, vi } from 'vitest';
import { createNameCache } from '../name-cache';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('createNameCache', () => {
  it('answers null at once, then the name, and tells the caller to draw again', async () => {
    const resolve = vi.fn().mockResolvedValue('jim.btc');
    const changed = vi.fn();
    const names = createNameCache(resolve, changed);
    expect(names.get('SP1')).toBeNull();
    await flush();
    expect(changed).toHaveBeenCalledTimes(1);
    expect(names.get('SP1')).toBe('jim.btc');
    expect(resolve).toHaveBeenCalledTimes(1); // asked once, however often it is drawn
    names.get('SP1'); names.get('SP1');
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does not redraw for an address with no name, and does not ask again', async () => {
    const resolve = vi.fn().mockResolvedValue(null);
    const changed = vi.fn();
    const names = createNameCache(resolve, changed);
    names.get('SP2');
    await flush();
    expect(changed).not.toHaveBeenCalled();
    names.get('SP2');
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('does nothing without an address', () => {
    const resolve = vi.fn();
    expect(createNameCache(resolve, vi.fn()).get(undefined)).toBeNull();
    expect(resolve).not.toHaveBeenCalled();
  });

  it('treats a failed lookup as unknown, not as "no name": it is tried again after the retry delay', async () => {
    let clock = 1000;
    const resolve = vi.fn().mockRejectedValueOnce(new Error('rate limited')).mockResolvedValue('jim.btc');
    const changed = vi.fn();
    const names = createNameCache(resolve, changed, { retryAfterMs: 30_000, now: () => clock });
    names.get('SP3');
    await flush();
    clock += 5_000;
    names.get('SP3'); // too soon
    expect(resolve).toHaveBeenCalledTimes(1);
    clock += 30_000;
    names.get('SP3'); // now retried
    await flush();
    expect(resolve).toHaveBeenCalledTimes(2);
    expect(names.get('SP3')).toBe('jim.btc');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('survives a resolver that throws synchronously', async () => {
    const names = createNameCache(() => { throw new Error('boom'); }, vi.fn());
    expect(names.get('SP4')).toBeNull();
    await flush();
    expect(names.get('SP4')).toBeNull();
  });
});

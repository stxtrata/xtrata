// How long Connect takes when a wallet ignores half of what it is asked.
//
// Measured against real Xverse under the runtime: wallet_connect answers, hands
// back no address, and then stx_requestAccounts, stx_getAccounts and
// getAddresses never settle at all. At the full probe budget that is
// forty-five seconds of a Connect button that looks dead, before
// stx_getAddresses finally answers.
//
// The fix is not a reorder. The method order decides whether the wallet's
// chooser appears, and demoting a prompting method to reach a faster one trades
// a visible wallet for a silent reconnect. What changed is the waiting.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connectWallet } from '../src/wallet.js';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/**
 * A provider that behaves the way a real one does: `answers` maps a method to
 * what it returns, anything listed in `hangs` never settles, and anything else
 * rejects the way a wallet rejects a method it has never heard of.
 */
function wallet({ answers = {}, hangs = [], onCall } = {}) {
  return {
    request: (method, params) => {
      onCall?.(method, params);
      if (hangs.includes(method)) return new Promise(() => {});
      if (method in answers) return Promise.resolve(answers[method]);
      const error = new Error(`Wallet method unsupported: ${method}`);
      error.code = -32601;
      return Promise.reject(error);
    }
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  for (const key of ['StacksProvider', 'stacks', 'LeatherProvider', 'XverseProviders',
    'XtrataWalletSession', 'ArcadeWalletSession', '__xtrataWalletSession',
    '__xtrataRuntimeWalletShimInstalled']) {
    delete globalThis[key];
  }
});

afterEach(() => {
  vi.useRealTimers();
});

// Drive both the connect and the clock together: the code awaits real promises
// between timer-driven waits, so the clock has to be advanced repeatedly.
async function runConnect(options) {
  const promise = connectWallet(options);
  const settled = promise.then((value) => ({ value }), (error) => ({ error }));
  for (let i = 0; i < 400; i += 1) {
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(250);
    const done = await Promise.race([settled, Promise.resolve('pending')]);
    if (done !== 'pending') return done;
  }
  throw new Error('connect never settled');
}

describe('a wallet that answers connect but names nobody', () => {
  it('asks who it connected as, instead of walking the methods that hang', async () => {
    const calls = [];
    globalThis.StacksProvider = wallet({
      // Exactly what Xverse does through the shim.
      answers: {
        wallet_connect: { addresses: [], accounts: [] },
        stx_getAddresses: { addresses: [{ symbol: 'STX', address: ADDRESS }] }
      },
      hangs: ['stx_requestAccounts', 'stx_getAccounts', 'getAddresses'],
      onCall: (method) => calls.push(method)
    });

    const { value } = await runConnect({ forcePrompt: true });

    expect(value.address).toBe(ADDRESS);
    // The prompting method still goes first. That is not negotiable: it is what
    // puts the wallet on screen.
    expect(calls[0]).toBe('wallet_connect');
    // And the read follows it directly, rather than after three dead ends.
    expect(calls[1]).toBe('stx_getAddresses');
    expect(calls).not.toContain('stx_getAccounts');
  });

  it('does not take the long way round even once', async () => {
    let hangCount = 0;
    globalThis.StacksProvider = wallet({
      answers: {
        wallet_connect: { addresses: [] },
        stx_getAddresses: { addresses: [{ address: ADDRESS }] }
      },
      hangs: ['stx_requestAccounts', 'stx_getAccounts', 'getAddresses'],
      onCall: (method) => {
        if (['stx_requestAccounts', 'stx_getAccounts', 'getAddresses'].includes(method)) {
          hangCount += 1;
        }
      }
    });

    await runConnect({ forcePrompt: true });
    expect(hangCount).toBe(0);
  });
});

describe('a wallet that refuses connect', () => {
  // The dangerous regression: jumping straight to a silent read when the
  // prompting method failed would connect without ever showing the wallet.
  it('keeps walking the prompting methods rather than jumping to a silent read', async () => {
    const calls = [];
    globalThis.StacksProvider = wallet({
      answers: { stx_requestAccounts: { addresses: [{ address: ADDRESS }] } },
      onCall: (method) => calls.push(method)
    });

    const { value } = await runConnect({ forcePrompt: true });

    expect(value.address).toBe(ADDRESS);
    expect(calls).toEqual(['wallet_connect', 'stx_requestAccounts']);
    // stx_getAddresses is a silent read. Reaching it before the prompting
    // methods have had their turn is the bug.
    expect(calls).not.toContain('stx_getAddresses');
  });
});

describe('a locked wallet', () => {
  // The long budget exists for exactly this: someone typing a password. It has
  // to survive the shortening.
  it('still gets the full budget on the very first call', async () => {
    let resolveUnlock;
    const unlocked = new Promise((resolve) => { resolveUnlock = resolve; });

    globalThis.StacksProvider = {
      request: (method) => {
        if (method !== 'wallet_connect') return Promise.reject(new Error('locked'));
        return unlocked.then(() => ({ addresses: [{ address: ADDRESS }] }));
      }
    };

    const promise = connectWallet({ forcePrompt: true });
    const settled = promise.then((v) => ({ value: v }), (e) => ({ error: e }));

    // Longer than the awake budget, well short of the locked one.
    await vi.advanceTimersByTimeAsync(9_000);
    expect(await Promise.race([settled, Promise.resolve('pending')])).toBe('pending');

    // Unlocked at last, long past the awake budget, and still accepted.
    resolveUnlock();
    await vi.advanceTimersByTimeAsync(100);
    const { value, error } = await settled;
    expect(error).toBeUndefined();
    expect(value.address).toBe(ADDRESS);
  });
});

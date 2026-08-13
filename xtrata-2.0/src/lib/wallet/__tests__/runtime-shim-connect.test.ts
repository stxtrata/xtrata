// The runtime wallet shim, asked to connect with no host bridge.
//
// This is the case every raw runtime link is in: `/runtime/?source=...` carries
// no walletBridgeToken and has no parent, so `hasHostBridge()` is false and the
// shim must fall back to reaching a wallet itself.
//
// It did not. `connectViaProviderRequest` asked `provider.request(...)`, and by
// the time it ran that WAS the shim - which answers a connect method by calling
// `connectViaProviderRequest`. A closed loop, and worse than a hang: every step
// is a promise continuation, so it spun the MICROTASK queue and never yielded.
// No timer in the page fired again. Wallet timeouts, polling, animation, all
// stopped. From the outside it looked like a Connect button that did nothing.
//
// The tests below are written against microtask turns rather than elapsed time,
// deliberately: a `setTimeout` in this test would never fire either, so a test
// written the obvious way would hang instead of failing.
//
// WHICH IS WORTH KNOWING BEFORE YOU DEBUG A RED BUILD HERE. If this fault comes
// back, this file does not fail - it HANGS, and takes the vitest worker with it,
// because vitest's own timeout is a timer too. A run of this file that stops
// producing output is the regression, not an infrastructure problem.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SHIM_PATH = fileURLToPath(new URL('../../../../public/runtime/wallet-shim.js', import.meta.url));

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/**
 * The last leg is not covered here, and deliberately.
 *
 * When every request-based spelling is refused the shim imports @stacks/connect
 * and opens its dialog. A dynamic import cannot run in this context at all, and
 * a dialog needs a browser, so that step belongs to harness/wallets/MATRIX.md.
 * What is covered is everything up to it - which is where the fault was.
 */
interface Stub {
  request: (method: unknown) => Promise<unknown>;
  asked: string[];
}

/** Xverse's real StacksProvider: a stub whose request throws this exact string. */
function refusesEverything(): Stub {
  const asked: string[] = [];
  return {
    asked,
    request(method: unknown) {
      asked.push(typeof method === 'string' ? method : String((method as { method?: string })?.method));
      throw new Error('request function is not implemented');
    }
  };
}

/** A provider that does answer, to prove the working path still works. */
function answers(on: string): Stub {
  const asked: string[] = [];
  return {
    asked,
    async request(method: unknown) {
      const name = typeof method === 'string' ? method : String((method as { method?: string })?.method);
      asked.push(name);
      if (name === on) return { addresses: [{ address: ADDRESS }] };
      throw new Error('request function is not implemented');
    }
  };
}

/**
 * A page with the shim installed over a given provider.
 *
 * The window is hand-built rather than borrowed from a DOM library so that the
 * surface the shim actually depends on is visible here: a location, an event
 * listener, and local storage. Nothing else.
 */
function installShim(stub: Stub): Record<string, any> {
  const source = readFileSync(SHIM_PATH, 'utf8');
  const store = new Map<string, string>();
  const window: Record<string, any> = {
    location: {
      // The launcher URL the board is tested on. No walletBridgeToken: that is
      // the whole point.
      search: '?source=/x-chess/xchess-next&network=mainnet',
      pathname: '/runtime/',
      hash: '',
      origin: 'https://main-staging-chess.xtrata.pages.dev',
      href: 'https://main-staging-chess.xtrata.pages.dev/runtime/?source=/x-chess/xchess-next&network=mainnet'
    },
    addEventListener: () => {},
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key)
    },
    StacksProvider: stub,
    XverseProviders: { StacksProvider: stub }
  };
  window.top = window;
  window.self = window;
  window.parent = window;
  window.opener = null;

  // eslint-disable-next-line no-new-func
  new Function('window', source)(window);
  return window;
}

/** Let the microtask queue run, without ever depending on a timer. */
async function turns(count: number): Promise<void> {
  for (let i = 0; i < count; i += 1) await Promise.resolve();
}

describe('the runtime wallet shim with no host bridge', () => {
  it('installs over the provider that is there', () => {
    const stub = refusesEverything();
    const window = installShim(stub);
    expect(window.__xtrataRuntimeWalletShimInstalled).toBe(true);
    expect(window.StacksProvider.__xtrataRuntimeWalletPatched).toBe(true);
  });

  it('asks the wallet each question once, and never asks itself', async () => {
    // The regression, and the exact list is the point. Eleven questions is the
    // opening request plus one of each spelling in the fallback. A twelfth means
    // the shim reached its own patched request and started the list again -
    // which before the fix it did, forever, thousands of times inside a single
    // millisecond, without ever yielding to a timer.
    const stub = refusesEverything();
    const window = installShim(stub);

    void window.StacksProvider.request('wallet_connect', {}).catch(() => {});
    await turns(20_000);

    expect(stub.asked).toEqual([
      'wallet_connect',
      'stx_getAddresses',
      'getAddresses',
      'stx_getAccounts',
      'getAccounts',
      'wallet_getAccount',
      'stx_requestAccounts',
      'requestAccounts',
      'stx_connect',
      'connect',
      'wallet_connect'
    ]);
  });

  it('leaves the queue clear afterwards, so timers still run', async () => {
    // What actually broke the page. The loop was made of promise continuations,
    // so it starved the macrotask queue: every setTimeout in the tab stopped,
    // including the board's own wallet timeout. Assert the thing that was lost.
    const stub = refusesEverything();
    const window = installShim(stub);

    void window.StacksProvider.request('wallet_connect', {}).catch(() => {});

    // Awaiting a timer is the whole assertion, and it has to be written this way
    // round: a starved queue cannot run the code that would measure it, so the
    // failure shows up as this test timing out. There is no cleverer version -
    // racing the timer against microtask turns measures which is faster, which
    // is not the question.
    await new Promise<void>((done) => setTimeout(done, 0));
    expect(stub.asked.length, 'the wallet was never asked anything').toBeGreaterThan(0);
  }, 1_000);

  it('still uses a provider that answers directly, rather than the SDK', async () => {
    const stub = answers('stx_getAddresses');
    const window = installShim(stub);

    const result = (await window.StacksProvider.request('wallet_connect', {})) as {
      address?: string;
    };
    expect(result?.address).toBe(ADDRESS);
    // wallet_connect goes to the provider first; it refuses; the fallback then
    // asks stx_getAddresses, which answers. Two questions, no more.
    expect(stub.asked).toEqual(['wallet_connect', 'stx_getAddresses']);
  });

  it('refuses a second connect while one is in flight, rather than recursing', async () => {
    // The backstop. A wallet dialog is open for as long as a person takes to
    // read it, and during that time the fallback must not be entered again -
    // re-entry is the shape that froze the tab, whatever leads to it.
    const asked: string[] = [];
    const waiting: Stub = {
      asked,
      request(method: unknown) {
        const name =
          typeof method === 'string' ? method : String((method as { method?: string })?.method);
        asked.push(name);
        if (name === 'wallet_connect') throw new Error('request function is not implemented');
        // A dialog that is open and waiting on a person.
        return new Promise<never>(() => {});
      }
    };
    const window = installShim(waiting);

    void window.StacksProvider.request('wallet_connect', {}).catch(() => {});
    await turns(200);
    expect(asked, 'the first connect did not reach the wallet').toContain('stx_getAddresses');

    await expect(window.StacksProvider.request('wallet_connect', {})).rejects.toThrow(
      /already in progress/i
    );
  });

  it('remembers the address it was given', async () => {
    // The session is what a board reads back after a reload, and it is written
    // by the fallback rather than by the provider - so if the fallback stops
    // being reached, this is the assertion that notices.
    const stub = answers('stx_getAddresses');
    const window = installShim(stub);
    await window.StacksProvider.request('wallet_connect', {});

    const stored = JSON.parse(
      window.localStorage.getItem('xtrata.runtime.wallet.session.v1') ?? 'null'
    );
    expect(stored?.address).toBe(ADDRESS);
    expect(stored?.network).toBe('mainnet');
  });
});

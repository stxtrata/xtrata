// The wallet conformance suite.
//
// Every fake below reproduces a behaviour a real wallet actually has, taken
// from what the legacy board found the hard way. The adapters are implemented
// against this suite rather than against a mental model of how wallets ought to
// work, because the whole lesson of the legacy wallet layer is that reasonable
// abstractions fail differently between providers.
//
// What this CANNOT do is drive a real extension. That part is in
// harness/wallets/MATRIX.md and has to be signed off by a person before a
// release. This suite is what makes that manual pass short rather than a
// rediscovery from scratch.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  canSignHere,
  collectProviders,
  isFramed,
  resolveProvider,
  shimInstalled,
  signingBlockedReason,
  usingHostBridge,
  waitForProvider
} from '../../packages/wallet/providers.js';
import {
  contractCallParams,
  extractAddress,
  needsWalletBridge,
  networkFromAddress,
  providerCannot,
  providerDidNotAnswer,
  userCancelled,
  walletCall,
  walletRequest
} from '../../packages/wallet/requests.js';

const ADDRESS = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

type Global = typeof globalThis & Record<string, unknown>;
const g = globalThis as Global;

const INJECTED = [
  'StacksProvider',
  'LeatherProvider',
  'XverseProviders',
  'xverseProviders',
  'BitcoinProvider',
  'btc',
  'stacks',
  'btc_providers',
  'webbtc_providers',
  'wbip_providers',
  '__xtrataRuntimeWalletShimInstalled',
  'location',
  'top',
  'self',
  'opener'
];

afterEach(() => {
  for (const key of INJECTED) delete g[key];
});

/** Somewhere with a search string, so bridgeToken() can read it. */
function pageAt(search: string): void {
  g.location = { search } as Location;
}

function framed(yes: boolean): void {
  // `top !== self` is what makes isFramed true. Assigned through `unknown`
  // because these are Window-typed globals and the fakes are not Windows; the
  // code under test only ever compares them by identity.
  g.self = g as unknown as Window & typeof globalThis;
  g.top = (yes ? {} : g) as unknown as Window;
}

// --- the fakes -------------------------------------------------------------

/**
 * Xverse. Injects TWO providers: a StacksProvider whose request() is a stub
 * that throws for every method, and a BitcoinProvider that actually answers.
 */
function installXverse(): { calls: string[] } {
  const calls: string[] = [];
  const stub = {
    request: async (method: string) => {
      calls.push(`stub:${method}`);
      throw new Error('request function is not implemented');
    },
    transactionRequest: async () => ({})
  };
  const real = {
    request: async (method: string) => {
      calls.push(`real:${method}`);
      if (/callContract/i.test(method)) return { txid: `0x${'11'.repeat(32)}` };
      return { addresses: [{ symbol: 'STX', address: ADDRESS }] };
    }
  };
  g.XverseProviders = { StacksProvider: stub, BitcoinProvider: real };
  g.StacksProvider = stub;
  g.BitcoinProvider = real;
  return { calls };
}

/** Leather. One good provider, plus the btckit alias that must be suppressed. */
function installLeather(): { calls: string[] } {
  const calls: string[] = [];
  const good = {
    request: async (method: string) => {
      calls.push(`leather:${method}`);
      return { result: { addresses: [{ symbol: 'STX', address: ADDRESS }] } };
    }
  };
  const btckit = {
    request: async () => {
      calls.push('btckit');
      return {};
    },
    transactionRequest: async () => ({})
  };
  g.LeatherProvider = good;
  g.StacksProvider = good;
  g.btc = btckit;
  return { calls };
}

/**
 * The Xtrata runtime shim. It patches whatever is there (or creates a provider
 * when nothing is), and REFUSES a contract call outright unless a host bridge
 * exists.
 */
function installShim({ bridged }: { bridged: boolean }): { calls: string[] } {
  const calls: string[] = [];
  const shim = {
    __xtrataRuntimeWalletPatched: true,
    request: async (method: string) => {
      calls.push(method);
      if (/callContract/i.test(method)) {
        if (!bridged) {
          const error = new Error('Wallet contract call requires host wallet bridge support.') as Error & {
            code?: number;
          };
          error.code = -32601;
          throw error;
        }
        return { txid: `0x${'22'.repeat(32)}` };
      }
      return { addresses: [{ symbol: 'STX', address: ADDRESS }] };
    }
  };
  g.StacksProvider = shim;
  g.__xtrataRuntimeWalletShimInstalled = true;
  pageAt(bridged ? '?walletBridgeToken=abc' : '');
  framed(bridged);
  return { calls };
}

// --- discovery -------------------------------------------------------------

describe('discovery', () => {
  it('finds nothing when there is nothing', () => {
    expect(collectProviders()).toEqual([]);
    expect(resolveProvider()).toBeNull();
  });

  it('ranks Xverse\'s working provider above its stub', () => {
    // THE ranking bug. Xverse's StacksProvider has transactionRequest and a
    // request() that throws for everything; its BitcoinProvider is the real
    // sats-connect surface. Any alphabetical or name-based ordering picks the
    // broken one every time.
    installXverse();
    const best = resolveProvider();
    expect(best?.label).toContain('BitcoinProvider');
  });

  it('suppresses the generic aliases when a named wallet is present', () => {
    // Named wallets also publish window.StacksProvider and window.stacks
    // pointing at the same extension. Offering them separately makes the user
    // approve twice for one action.
    installLeather();
    const labels = collectProviders().map((entry) => entry.label);
    expect(labels).toContain('window.LeatherProvider');
    expect(labels).not.toContain('window.StacksProvider');
    expect(labels).not.toContain('window.stacks');
  });

  it('suppresses window.btc when Leather is present', () => {
    // Routing a contract call through the btckit alias lands on the deprecated
    // transactionRequest screen, where Confirm is disabled and there is nothing
    // to do but close it.
    installLeather();
    expect(collectProviders().map((e) => e.label)).not.toContain('window.btc');
  });

  it('never suppresses the shim, because it may be the only route', () => {
    installShim({ bridged: true });
    const labels = collectProviders().map((entry) => entry.label);
    expect(labels).toContain('window.StacksProvider');
    expect(resolveProvider()?.label).toBe('window.StacksProvider');
  });

  it('deduplicates a provider published under several names', () => {
    installXverse();
    const providers = collectProviders().map((entry) => entry.provider);
    expect(new Set(providers).size).toBe(providers.length);
  });

  it('finds providers that register rather than inject', () => {
    g.btc_providers = [{ name: 'Some Wallet', provider: { request: async () => ({}) } }];
    expect(collectProviders().map((e) => e.label)).toContain('registry:Some Wallet');
  });

  it('ignores an object that is not a provider at all', () => {
    g.StacksProvider = { notAWallet: true };
    expect(collectProviders()).toEqual([]);
  });

  it('survives a provider that throws on property access', () => {
    // Some injected providers do exactly this.
    g.StacksProvider = new Proxy(
      { request: async () => ({}) },
      {
        get(target, key) {
          if (key === '__xtrataRuntimeWalletPatched') throw new Error('nope');
          return Reflect.get(target, key);
        }
      }
    );
    expect(() => collectProviders()).not.toThrow();
    expect(() => canSignHere()).not.toThrow();
  });

  it('waits for a provider that appears late', async () => {
    // The shim installs at load and again at 400ms, 1400ms, 3200ms and on
    // focus. Anything that asked once and gave up would report no wallet on a
    // machine that has one.
    vi.useFakeTimers();
    try {
      const promise = waitForProvider({ timeoutMs: 5000, intervalMs: 100 });
      await vi.advanceTimersByTimeAsync(300);
      installLeather();
      await vi.advanceTimersByTimeAsync(200);
      expect((await promise)?.label).toBe('window.LeatherProvider');
    } finally {
      vi.useRealTimers();
    }
  });

  it('gives up after the timeout rather than waiting forever', async () => {
    vi.useFakeTimers();
    try {
      const promise = waitForProvider({ timeoutMs: 1000, intervalMs: 100 });
      await vi.advanceTimersByTimeAsync(1500);
      expect(await promise).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

// --- the bridge ------------------------------------------------------------

describe('the Xtrata bridge', () => {
  it('knows a bridged page can sign', () => {
    installShim({ bridged: true });
    expect(shimInstalled()).toBe(true);
    expect(isFramed()).toBe(true);
    expect(usingHostBridge()).toBe(true);
    expect(canSignHere()).toBe(true);
    expect(signingBlockedReason()).toBeNull();
  });

  it('knows an unbridged page cannot, and says why', () => {
    // A raw link to /i/<id> reads and replays perfectly and can sign nothing.
    // The board says so up front rather than letting somebody meet it as a
    // failed transaction.
    installShim({ bridged: false });
    expect(usingHostBridge()).toBe(false);
    expect(canSignHere()).toBe(false);
    expect(signingBlockedReason()).toBe('no-bridge');
  });

  it('tells no-bridge apart from no-wallet', () => {
    g.__xtrataRuntimeWalletShimInstalled = true;
    pageAt('');
    framed(false);
    // The shim installed but there is no provider behind it at all.
    expect(signingBlockedReason()).toBe('no-wallet');
  });

  it('lets a provider the shim did not reach be a way through', () => {
    // Having an extension installed is not enough on its own, because the shim
    // patches Leather and the Xverse Stacks providers in place. What IS enough
    // is a provider it did not reach, such as Xverse's BitcoinProvider.
    installShim({ bridged: false });
    const untouched = { request: async () => ({}) };
    g.XverseProviders = { BitcoinProvider: untouched };
    expect(canSignHere()).toBe(true);
  });

  it('recognises the shim\'s refusal by its wording, not only its code', () => {
    // -32601 alone is also how a provider says it has never heard of a method.
    const bridgeError = Object.assign(new Error('Wallet contract call requires host wallet bridge support.'), {
      code: -32601
    });
    const unknownMethod = Object.assign(new Error('method not found'), { code: -32601 });
    expect(needsWalletBridge(bridgeError)).toBe(true);
    expect(needsWalletBridge(unknownMethod)).toBe(false);
    expect(providerCannot(bridgeError)).toBe(true);
  });

  it('does not walk past the bridge refusal looking for another provider', async () => {
    // The refusal is about the PAGE, not the provider. Trying every other
    // provider would produce the same refusal several times over and end with
    // the wrong message.
    const shim = installShim({ bridged: false });
    await expect(walletCall('stx_callContract', {})).rejects.toThrow(/host wallet bridge/);
    expect(shim.calls).toEqual(['stx_callContract']);
  });
});

// --- calling ---------------------------------------------------------------

describe('calling', () => {
  it('moves past a provider that cannot do the method', async () => {
    // A page with Xverse installed sees two providers where only the second
    // works. Stopping at the first is the difference between connecting and not.
    const xverse = installXverse();
    const { result } = await walletCall('stx_callContract', {});
    expect(result).toEqual({ txid: `0x${'11'.repeat(32)}` });
    expect(xverse.calls).toContain('real:stx_callContract');
  });

  it('stops at a real rejection instead of asking every other wallet', async () => {
    // A wallet that says the user declined has done its job.
    let asked = 0;
    const decline = async () => {
      asked++;
      const error = Object.assign(new Error('User rejected the request'), { code: 4001 });
      throw error;
    };
    g.LeatherProvider = { request: decline };
    g.XverseProviders = { BitcoinProvider: { request: decline } };

    await expect(walletCall('stx_callContract', {})).rejects.toThrow(/rejected/);
    expect(asked).toBe(1);
  });

  it('recognises a cancellation however it is spelled', () => {
    for (const message of ['User rejected', 'user declined', 'Request was denied', 'cancelled by user']) {
      expect(userCancelled(new Error(message)), message).toBe(true);
    }
    expect(userCancelled(Object.assign(new Error('nope'), { code: 4001 }))).toBe(true);
    expect(userCancelled(new Error('network down'))).toBe(false);
  });

  it('times out on a wallet that never answers', async () => {
    // Leather mobile never settles a request it cannot handle: no result, no
    // rejection, the promise simply hangs.
    vi.useFakeTimers();
    try {
      const entry = {
        provider: { request: () => new Promise(() => {}) },
        label: 'silent',
        hasRequest: true,
        hasTransactionRequest: false
      };
      const promise = walletRequest(entry, 'stx_callContract', {}, { timeoutMs: 5000 });
      const assertion = expect(promise).rejects.toThrow(/did not answer/);
      await vi.advanceTimersByTimeAsync(5001);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });

  it('treats a resolved error payload as an error', async () => {
    // Some providers resolve with an error rather than rejecting.
    const entry = {
      provider: { request: async () => ({ error: { code: 4001, message: 'declined' } }) },
      label: 'odd',
      hasRequest: true,
      hasTransactionRequest: false
    };
    await expect(walletRequest(entry, 'stx_callContract', {})).rejects.toThrow(/declined/);
  });

  it('reports no wallet distinctly', async () => {
    await expect(walletCall('stx_callContract', {})).rejects.toThrow(/no Stacks wallet/);
  });
});

// --- payload shaping -------------------------------------------------------

describe('the payload', () => {
  const request = {
    contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1',
    functionName: 'submit',
    functionArgs: ['0x01', '0x0d'],
    postConditionMode: 'deny' as const,
    postConditions: ['00021a'],
    network: 'mainnet',
    fee: 10_000
  };

  const entry = (label: string) => ({
    provider: { request: async () => ({}) },
    label,
    hasRequest: true,
    hasTransactionRequest: false
  });

  it('sends a schema-validating wallet exactly the fields its schema names', () => {
    // Xverse mobile reads an unknown `sender` field as "sign as this address"
    // and rejects the request before showing any confirmation at all.
    const params = contractCallParams(entry('window.XverseProviders.BitcoinProvider'), request);
    expect(Object.keys(params).sort()).toEqual(
      ['arguments', 'contract', 'functionArgs', 'functionName', 'postConditionMode', 'postConditions'].sort()
    );
    expect(params.network).toBeUndefined();
    expect(params.fee).toBeUndefined();
  });

  it('sends both spellings of the arguments', () => {
    // Older builds validate with a schema that reads `arguments` and silently
    // drop `functionArgs`.
    const params = contractCallParams(entry('window.LeatherProvider'), request);
    expect(params.functionArgs).toEqual(request.functionArgs);
    expect(params.arguments).toEqual(request.functionArgs);
  });

  it('never sends feeRate, which can only be misread as a hundredfold overcharge', () => {
    // A rate is a fee PER BYTE. A wallet reading 10,000 there computes a fee two
    // orders of magnitude too large rather than ignoring it.
    for (const label of ['window.LeatherProvider', 'window.XverseProviders.BitcoinProvider']) {
      expect(contractCallParams(entry(label), request)).not.toHaveProperty('feeRate');
    }
  });

  it('sends post conditions as hex strings, never objects', () => {
    // Xverse hangs forever on the object form, with no dialog and no rejection.
    const params = contractCallParams(entry('window.LeatherProvider'), request);
    for (const condition of params.postConditions as string[]) {
      expect(typeof condition).toBe('string');
    }
  });
});

// --- addresses -------------------------------------------------------------

describe('reading an address back', () => {
  it('finds it however the wallet nested it', () => {
    const shapes: unknown[] = [
      ADDRESS,
      { address: ADDRESS },
      { stxAddress: ADDRESS },
      { addresses: [{ symbol: 'STX', address: ADDRESS }] },
      { result: { addresses: [{ symbol: 'STX', address: ADDRESS }] } },
      { accounts: [{ address: ADDRESS }] },
      [{ symbol: 'STX', address: ADDRESS }]
    ];
    for (const shape of shapes) {
      expect(extractAddress(shape), JSON.stringify(shape)).toBe(ADDRESS);
    }
  });

  it('prefers an entry that says it is STX over one that merely looks like it', () => {
    const btc = 'SP000000000000000000002Q6VF78';
    const payload = [
      { symbol: 'BTC', address: btc },
      { symbol: 'STX', address: ADDRESS }
    ];
    expect(extractAddress(payload)).toBe(ADDRESS);
  });

  it('returns null rather than guessing', () => {
    for (const shape of [null, undefined, {}, [], { address: 'not-an-address' }, 42]) {
      expect(extractAddress(shape)).toBeNull();
    }
  });

  it('does not recurse forever on a cyclic payload', () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.result = cyclic;
    expect(() => extractAddress(cyclic)).not.toThrow();
  });

  it('tells the networks apart, and refuses to guess', () => {
    expect(networkFromAddress(ADDRESS)).toBe('mainnet');
    expect(networkFromAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe('testnet');
    expect(networkFromAddress('nonsense')).toBeNull();
    expect(networkFromAddress(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// A provider that never answers at all.
//
// Found on a real staging board, 2026-08-13, with Xverse installed. Clicking
// Connect appeared to do nothing whatever. The cause:
//
//   XverseProviders.BitcoinProvider  wallet_connect  ->  never settles
//
// No result, no rejection - the promise simply stays pending. BitcoinProvider
// ranks FIRST because it is usually Xverse's working surface, so the board
// waited on it, timed out, and treated the timeout as fatal to the whole method
// - never reaching the shim-patched StacksProvider sitting right behind it,
// which connects fine.
//
// Four methods at fifteen seconds each is a minute of silence, which is why it
// read as a dead button rather than a slow one.
// ---------------------------------------------------------------------------

describe('a wallet that says nothing at all', () => {
  it('moves to the next provider instead of giving up on the method', async () => {
    const hangs = { request: () => new Promise(() => {}) };
    const answers = {
      request: async (method: string) => {
        if (method !== 'stx_getAddresses') throw Object.assign(new Error('not implemented'), { code: -32601 });
        return { addresses: [{ address: ADDRESS }] };
      }
    };

    const g = globalThis as unknown as Record<string, unknown>;
    g.XverseProviders = { BitcoinProvider: hangs, StacksProvider: answers };

    // The hanging provider ranks first, exactly as it does in a real page.
    const order = collectProviders().map((entry) => entry.label);
    expect(order[0], 'the hanging provider should still rank first').toContain('BitcoinProvider');

    const { result, entry } = await walletCall('stx_getAddresses', {}, { timeoutMs: 60 });
    expect(extractAddress(result), 'the working provider was never reached').toBe(ADDRESS);
    expect(entry.label, 'it connected through the wrong provider').toContain('StacksProvider');
  });

  it('reports a hang as not-answered rather than as a capability', async () => {
    // The two are different claims and want different handling: one is a wallet
    // saying it cannot, the other is a wallet saying nothing.
    const timeout = Object.assign(new Error('wallet did not answer x within 6s'), {
      code: 'TIMEOUT'
    });
    expect(providerDidNotAnswer(timeout)).toBe(true);
    expect(providerCannot(timeout), 'a hang is not a statement about capability').toBe(false);
  });

  it('gives up in seconds, not in a minute', async () => {
    const hangs = { request: () => new Promise(() => {}) };
    const g = globalThis as unknown as Record<string, unknown>;
    g.XverseProviders = { BitcoinProvider: hangs };

    const started = Date.now();
    await expect(walletCall('wallet_connect', {}, { timeoutMs: 50 })).rejects.toThrow();
    expect(Date.now() - started, 'it waited far past its own timeout').toBeLessThan(500);
  });
});

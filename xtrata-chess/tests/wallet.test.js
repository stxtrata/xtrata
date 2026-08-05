// Provider discovery, replicated from Astro Blaster.
//
// Every rule here exists because a wallet on some platform did something
// unhelpful. These tests are the record of which, so that simplifying the logic
// later fails loudly instead of quietly reintroducing a double-prompt or a
// screen with a disabled Confirm button.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  collectProviders,
  connectWallet,
  extractAddress,
  networkFromAddress,
  providerCannot,
  resolveProvider,
  userCancelled,
  walletCall,
  walletRequest
} from '../src/wallet.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const TESTNET = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

const fake = (name) => ({ request: async () => ({ from: name }) });

function setGlobals(globals) {
  for (const [key, value] of Object.entries(globals)) globalThis[key] = value;
}

afterEach(() => {
  for (const key of [
    'LeatherProvider', 'XverseProviders', 'xverseProviders', 'StacksProvider',
    'stacks', 'btc', 'BitcoinProvider', 'btc_providers', 'webbtc_providers',
    'wbip_providers', '__xtrataRuntimeWalletShimInstalled',
    // connectWallet publishes a session on success, and a later connect reuses
    // it rather than re-prompting. Left behind it leaks between tests.
    'XtrataWalletSession', 'ArcadeWalletSession', '__xtrataWalletSession'
  ]) {
    delete globalThis[key];
  }
});

describe('suppressing aliases', () => {
  // Leather and Xverse also publish window.StacksProvider and window.stacks
  // pointing at the same extension. Offering them separately makes the user
  // approve twice for one action.
  it('drops the generic aliases when a named wallet is present', () => {
    const leather = fake('leather');
    setGlobals({ LeatherProvider: leather, StacksProvider: leather, stacks: leather });

    const labels = collectProviders().map((entry) => entry.label);
    expect(labels).toEqual(['window.LeatherProvider']);
  });

  // window.btc is Leather's btckit alias. A contract call through it lands on
  // the deprecated transactionRequest screen with Confirm disabled.
  it('never offers window.btc while Leather is installed', () => {
    setGlobals({ LeatherProvider: fake('leather'), btc: fake('btckit') });
    expect(collectProviders().map((e) => e.label)).not.toContain('window.btc');
  });

  it('never offers window.BitcoinProvider while Xverse is installed', () => {
    setGlobals({
      XverseProviders: { StacksProvider: fake('xverse') },
      BitcoinProvider: fake('generic')
    });
    expect(collectProviders().map((e) => e.label)).not.toContain('window.BitcoinProvider');
  });

  it('does offer the generic surfaces when nothing named is installed', () => {
    setGlobals({ StacksProvider: fake('generic') });
    expect(collectProviders().map((e) => e.label)).toContain('window.StacksProvider');
  });
});

describe('the Xtrata sandbox', () => {
  // Inside the runtime the shim *is* window.StacksProvider, and it may be the
  // only route to a wallet. Suppressing it there would break the sandbox.
  it('keeps window.StacksProvider when the Xtrata shim is installed', () => {
    setGlobals({
      __xtrataRuntimeWalletShimInstalled: true,
      LeatherProvider: fake('leather'),
      StacksProvider: fake('shim')
    });

    const labels = collectProviders().map((entry) => entry.label);
    expect(labels).toContain('window.StacksProvider');
  });

  it('prefers the shim over a directly injected wallet inside the runtime', () => {
    setGlobals({
      __xtrataRuntimeWalletShimInstalled: true,
      LeatherProvider: fake('leather'),
      StacksProvider: fake('shim')
    });
    expect(resolveProvider().label).toBe('window.StacksProvider');
  });

  // Astro Blaster's weights give Xverse a bonus and Leather none, so with both
  // installed an Xverse surface leads. Kept as it is rather than "improved":
  // the ordering was tuned against a real wallet matrix, and the fallback below
  // handles a leader that turns out to be a stub.
  it('leads with an Xverse surface when Leather and Xverse are both installed', () => {
    setGlobals({
      LeatherProvider: fake('leather'),
      XverseProviders: { StacksProvider: fake('x'), BitcoinProvider: fake('sats') }
    });

    const order = collectProviders().map((entry) => entry.label);
    expect(order[0]).toBe('window.XverseProviders.BitcoinProvider');
    expect(order).toContain('window.LeatherProvider');
  });

  it('still offers Leather, so a failing Xverse falls through to it', async () => {
    const leather = {
      request: vi.fn(async () => ({ addresses: [{ symbol: 'STX', address: ALICE }] }))
    };
    setGlobals({
      LeatherProvider: leather,
      XverseProviders: {
        StacksProvider: {
          request: async () => {
            throw new Error('`request` function is not implemented');
          }
        }
      }
    });

    const session = await connectWallet();
    expect(session.address).toBe(ALICE);
    expect(session.via).toContain('LeatherProvider');
  });
});

describe('registries', () => {
  it('finds wallets that register rather than inject', () => {
    setGlobals({ btc_providers: [{ id: 'someWallet', provider: fake('registered') }] });
    expect(collectProviders().map((e) => e.label)).toContain('registry:someWallet');
  });

  it('ignores registry entries with no request function', () => {
    setGlobals({ webbtc_providers: [{ id: 'broken', provider: {} }, null, 'nonsense'] });
    expect(collectProviders()).toHaveLength(0);
  });
});

describe('deduplication', () => {
  it('lists one entry per underlying object, however many names point at it', () => {
    const one = fake('one');
    setGlobals({ StacksProvider: one, stacks: one, btc: one });
    expect(collectProviders()).toHaveLength(1);
  });
});

describe('calling a wallet', () => {
  it('always uses the two-argument form', async () => {
    const request = vi.fn(async () => ({ txid: '0xabc' }));
    await walletRequest({ provider: { request } }, 'stx_callContract', { a: 1 });
    expect(request).toHaveBeenCalledWith('stx_callContract', { a: 1 });
  });

  it('throws on an error payload that was resolved rather than rejected', async () => {
    const provider = { request: async () => ({ error: { message: 'user cancelled', code: 4001 } }) };
    await expect(walletRequest({ provider }, 'stx_callContract', {})).rejects.toThrow(/user cancelled/);
  });

  it('throws on status: error', async () => {
    const provider = { request: async () => ({ status: 'error', result: 'nope' }) };
    await expect(walletRequest({ provider }, 'stx_callContract', {})).rejects.toThrow(/nope/);
  });

  // Leather mobile never settles a request it cannot handle. Without a timeout
  // the page waits forever on a wallet that has already given up.
  it('gives up on a wallet that never answers', async () => {
    const provider = { request: () => new Promise(() => {}) };
    await expect(
      walletRequest({ provider }, 'stx_callContract', {}, { timeoutMs: 60 })
    ).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('refuses when there is no provider at all', async () => {
    await expect(walletRequest(null, 'stx_callContract', {})).rejects.toMatchObject({
      code: 'NO_WALLET'
    });
  });
});

describe('reading an address out of a reply', () => {
  it('prefers the entry labelled STX over one that merely looks like an address', () => {
    const reply = {
      addresses: [
        { symbol: 'BTC', address: 'bc1qj5uxfxkukjvh9d3s8acuh0x9yfnppea7ufm938' },
        { symbol: 'STX', address: ALICE }
      ]
    };
    expect(extractAddress(reply)).toBe(ALICE);
  });

  it('handles the shapes each wallet actually returns', () => {
    expect(extractAddress(ALICE)).toBe(ALICE);
    expect(extractAddress({ result: { addresses: [{ address: ALICE }] } })).toBe(ALICE);
    expect(extractAddress({ stxAddress: ALICE })).toBe(ALICE);
    expect(extractAddress({ addresses: { mainnet: ALICE } })).toBe(ALICE);
  });

  it('returns null rather than guessing', () => {
    for (const value of [null, undefined, {}, [], 42, 'hello']) {
      expect(extractAddress(value)).toBe(null);
    }
  });

  it('survives a cyclic reply', () => {
    const cyclic = { result: {} };
    cyclic.result.result = cyclic;
    expect(() => extractAddress(cyclic)).not.toThrow();
  });
});

describe('network from address', () => {
  it('reads the prefix', () => {
    expect(networkFromAddress(ALICE)).toBe('mainnet');
    expect(networkFromAddress(TESTNET)).toBe('testnet');
    expect(networkFromAddress('SM123')).toBe('mainnet');
    expect(networkFromAddress('SN123')).toBe('testnet');
    expect(networkFromAddress('nonsense')).toBe(null);
  });
});

describe('session reuse', () => {
  // A connected page publishes its session so a second ask does not re-prompt.
  // That is the budget Astro Blaster settled on: one interactive wallet read per
  // page lifecycle, because a locked Leather can take twenty seconds to answer.
  it('reuses a session the host already published, without touching a provider', async () => {
    const request = vi.fn();
    setGlobals({
      LeatherProvider: { request },
      ArcadeWalletSession: { address: ALICE }
    });

    const session = await connectWallet();
    expect(session.address).toBe(ALICE);
    expect(session.via).toBe('host-session');
    expect(request).not.toHaveBeenCalled();
  });
});

describe('Xverse, as actually installed', () => {
  // Reproduces a real failure. Xverse injects a StacksProvider whose request()
  // is a stub that throws "request function is not implemented" for every
  // method, alongside a BitcoinProvider that is the working sats-connect
  // surface. Ranking by name puts the broken one first and nothing connects.
  const ALICE_REPLY = {
    result: { addresses: [{ symbol: 'STX', address: ALICE }] }
  };

  function installXverse() {
    const stub = {
      request: async () => {
        throw new Error('`request` function is not implemented');
      }
    };
    const working = { request: vi.fn(async () => ALICE_REPLY) };
    setGlobals({
      XverseProviders: { StacksProvider: stub, BitcoinProvider: working }
    });
    return { stub, working };
  }

  it('ranks the working BitcoinProvider above the stub StacksProvider', () => {
    installXverse();
    expect(resolveProvider().label).toBe('window.XverseProviders.BitcoinProvider');
  });

  it('recognises the stub error as "ask someone else"', () => {
    expect(providerCannot(new Error('`request` function is not implemented'))).toBe(true);
    expect(providerCannot({ code: -32601 })).toBe(true);
    // A refusal by the user is an answer, not a reason to try another wallet.
    expect(providerCannot(new Error('user rejected the request'))).toBe(false);
  });

  it('falls through the stub and connects via the provider that works', async () => {
    const { working } = installXverse();
    const session = await connectWallet();
    expect(session.address).toBe(ALICE);
    expect(session.via).toContain('BitcoinProvider');
    expect(working.request).toHaveBeenCalled();
  });

  it('sends a contract call through the working provider', async () => {
    const { working } = installXverse();
    const { entry } = await walletCall('stx_callContract', { contract: 'x.y' });
    expect(entry.label).toBe('window.XverseProviders.BitcoinProvider');
    expect(working.request).toHaveBeenCalledWith('stx_callContract', { contract: 'x.y' });
  });

  it('does not keep shopping around once a wallet genuinely refuses', async () => {
    const refuse = vi.fn(async () => {
      throw new Error('User rejected the request');
    });
    setGlobals({ XverseProviders: { BitcoinProvider: { request: refuse } } });
    await expect(walletCall('stx_callContract', {})).rejects.toThrow(/rejected/i);
    expect(refuse).toHaveBeenCalledTimes(1);
  });
});

describe('the ordering that broke connect', () => {
  // Xverse's StacksProvider is a stub for request() but does expose the legacy
  // transactionRequest. Scoring that capability highly, as the arcade does
  // because it calls that path, put the stub ahead of the provider that works.
  // This board only ever speaks request(), so it must rank on that.
  it('ranks a working request() above a stub that merely has transactionRequest', () => {
    setGlobals({
      XverseProviders: {
        StacksProvider: {
          request: async () => {
            throw new Error('`request` function is not implemented');
          },
          transactionRequest: async () => ({})
        },
        BitcoinProvider: { request: async () => ({}) }
      }
    });

    expect(collectProviders()[0].label).toBe('window.XverseProviders.BitcoinProvider');
  });

  it('puts a transactionRequest-only provider last, since it cannot be called', () => {
    setGlobals({
      LeatherProvider: { request: async () => ({}) },
      btc_providers: [{ id: 'legacyOnly', provider: { transactionRequest: async () => ({}) } }]
    });

    const order = collectProviders().map((entry) => entry.label);
    expect(order[order.length - 1]).toBe('registry:legacyOnly');
  });
});

describe('forcing the wallet to appear', () => {
  // Xverse answers getAddresses silently from cache, so leading with it
  // "connects" without the wallet ever showing, which reads as broken.
  // wallet_connect leads because it is what answered on the machine that
  // reported this. stx_getAccounts sits behind it: Xverse never answers that one
  // at all, and leading with it cost a full timeout before anything else ran.
  it('asks a prompting method before a silent one', async () => {
    const asked = [];
    setGlobals({
      LeatherProvider: {
        request: async (method) => {
          asked.push(method);
          if (method === 'wallet_connect') {
            return { addresses: [{ symbol: 'STX', address: ALICE }] };
          }
          throw new Error('not implemented');
        }
      }
    });

    const session = await connectWallet();
    expect(session.address).toBe(ALICE);
    expect(asked[0]).toBe('wallet_connect');
    // getAddresses answers silently from cache on Xverse, so it must not lead.
    expect(asked.indexOf('getAddresses')).toBe(-1);
  });

  it('uses only the provider that was explicitly chosen', async () => {
    const wrong = vi.fn(async () => ({ addresses: [{ symbol: 'STX', address: ALICE }] }));
    const right = vi.fn(async () => ({ addresses: [{ symbol: 'STX', address: TESTNET }] }));
    setGlobals({
      XverseProviders: { BitcoinProvider: { request: wrong }, StacksProvider: { request: right } }
    });

    const session = await connectWallet({
      preferredLabel: 'window.XverseProviders.StacksProvider'
    });

    expect(session.address).toBe(TESTNET);
    expect(right).toHaveBeenCalled();
    expect(wrong).not.toHaveBeenCalled();
  });

  it('skips a cached session when the caller insists on a prompt', async () => {
    const request = vi.fn(async () => ({ addresses: [{ symbol: 'STX', address: ALICE }] }));
    setGlobals({
      LeatherProvider: { request },
      ArcadeWalletSession: { address: ALICE }
    });

    const reused = await connectWallet();
    expect(reused.via).toBe('host-session');
    expect(request).not.toHaveBeenCalled();

    const forced = await connectWallet({ forcePrompt: true });
    expect(forced.via).toContain('LeatherProvider');
    expect(request).toHaveBeenCalled();
  });
});

describe('telling a cancel from a refusal', () => {
  // Cancelling is a decision, not a fault. Treating it as one sends people off
  // trying other parameter shapes for a request that was fine.
  it('recognises the ways wallets say the user declined', () => {
    for (const error of [
      { code: 4001 },
      new Error('User rejected the request'),
      new Error('Transaction cancelled by user'),
      new Error('User denied transaction signature'),
      new Error('Request was declined')
    ]) {
      expect(userCancelled(error)).toBe(true);
    }
  });

  it('does not mistake a genuine failure for a cancel', () => {
    for (const error of [
      new Error('`request` function is not implemented'),
      new Error('network mismatch'),
      { code: -32601 },
      new Error('insufficient balance')
    ]) {
      expect(userCancelled(error)).toBe(false);
    }
  });

  // A refusal and a cancel are both "no", but only one means try something else.
  it('keeps the two categories apart', () => {
    const cancel = new Error('User rejected the request');
    expect(userCancelled(cancel)).toBe(true);
    expect(providerCannot(cancel)).toBe(false);

    const cannot = new Error('`request` function is not implemented');
    expect(providerCannot(cannot)).toBe(true);
    expect(userCancelled(cannot)).toBe(false);
  });
});

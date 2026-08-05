// Provider discovery, replicated from Astro Blaster.
//
// Every rule here exists because a wallet on some platform did something
// unhelpful. These tests are the record of which, so that simplifying the logic
// later fails loudly instead of quietly reintroducing a double-prompt or a
// screen with a disabled Confirm button.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  collectProviders,
  extractAddress,
  networkFromAddress,
  resolveProvider,
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
    'wbip_providers', '__xtrataRuntimeWalletShimInstalled'
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

  it('prefers a named wallet over the bare generic when there is no shim', () => {
    setGlobals({ LeatherProvider: fake('leather'), XverseProviders: { StacksProvider: fake('x') } });
    expect(resolveProvider().label).toBe('window.LeatherProvider');
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

// Whether a move can be signed from this page at all.
//
// The runtime shim refuses stx_callContract with -32601 unless the page carries
// a walletBridgeToken and has a parent or opener to carry it. So an inscription
// opened by its bare URL reads and replays perfectly and cannot sign anything.
// Someone should learn that from the board, not from a failed transaction.
//
// The subtle half is that having an extension installed is not enough: the shim
// patches Leather's provider and the Xverse Stacks providers in place. Only a
// provider it did not reach can still sign.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { canSignHere, needsWalletBridge, signingBlockedReason } from '../src/wallet.js';

const patched = () => ({ request: async () => ({}), __xtrataRuntimeWalletPatched: true });
const untouched = () => ({ request: async () => ({}) });

function setPage({ token = '', framed = false, shim = false } = {}) {
  globalThis.location = { search: token ? `?walletBridgeToken=${token}` : '' };
  // isFramed() compares top to self, so make them differ to look framed.
  globalThis.self = globalThis;
  globalThis.top = framed ? {} : globalThis;
  if (shim) globalThis.__xtrataRuntimeWalletShimInstalled = true;
}

beforeEach(() => {
  for (const key of [
    'StacksProvider', 'stacks', 'LeatherProvider', 'XverseProviders',
    'xverseProviders', 'btc', 'BitcoinProvider', '__xtrataRuntimeWalletShimInstalled'
  ]) {
    delete globalThis[key];
  }
  setPage();
});

afterEach(() => {
  delete globalThis.location;
  delete globalThis.top;
  delete globalThis.self;
});

describe('outside the runtime', () => {
  it('says yes when a wallet is present and no shim is involved', () => {
    globalThis.LeatherProvider = untouched();
    expect(canSignHere()).toBe(true);
    expect(signingBlockedReason()).toBe(null);
  });

  // Not the bridge's problem, and not the message to show.
  it('reports no wallet rather than no bridge when nothing is installed', () => {
    setPage({ shim: true });
    expect(canSignHere()).toBe(false);
    expect(signingBlockedReason()).toBe('no-wallet');
  });
});

describe('inside the runtime, framed, with a bridge', () => {
  it('says yes even though every provider is the shim', () => {
    setPage({ token: 'abc', framed: true, shim: true });
    globalThis.StacksProvider = patched();
    expect(canSignHere()).toBe(true);
    expect(signingBlockedReason()).toBe(null);
  });
});

describe('inside the runtime with no bridge', () => {
  it('says no when the only provider is the shim itself', () => {
    setPage({ shim: true });
    globalThis.StacksProvider = patched();
    expect(canSignHere()).toBe(false);
    expect(signingBlockedReason()).toBe('no-bridge');
  });

  // The shim patches Leather in place, so an installed wallet does not save it.
  it('says no when Leather is installed but the shim took it over', () => {
    setPage({ shim: true });
    globalThis.StacksProvider = patched();
    globalThis.LeatherProvider = patched();
    expect(signingBlockedReason()).toBe('no-bridge');
  });

  // Xverse's BitcoinProvider is not in the shim's candidate list, so it still
  // answers directly and walletCall falls through to it on -32601.
  it('says yes when a provider the shim never reached is there', () => {
    setPage({ shim: true });
    globalThis.StacksProvider = patched();
    globalThis.XverseProviders = { StacksProvider: patched(), BitcoinProvider: untouched() };
    expect(canSignHere()).toBe(true);
  });

  // A token with nothing to post to is not a bridge.
  it('says no when a token is present but the page is not framed', () => {
    setPage({ token: 'abc', shim: true });
    globalThis.StacksProvider = patched();
    expect(signingBlockedReason()).toBe('no-bridge');
  });

  it('does not fall over on a provider that throws on property access', () => {
    setPage({ shim: true });
    globalThis.StacksProvider = new Proxy(
      { request: async () => ({}) },
      { get(target, key) {
          if (key === '__xtrataRuntimeWalletPatched') throw new Error('nope');
          return target[key];
        } }
    );
    // Unreadable means unknown, and unknown errs towards letting someone try.
    expect(() => canSignHere()).not.toThrow();
    expect(canSignHere()).toBe(true);
  });
});

describe('recognising the failure when it happens anyway', () => {
  it('matches the shim wording', () => {
    const error = new Error('Wallet contract call requires host wallet bridge support.');
    error.code = -32601;
    expect(needsWalletBridge(error)).toBe(true);
  });

  // -32601 on its own is also how a provider says it never heard of a method,
  // so the code alone must not trigger the bridge advice.
  it('does not claim a plain unsupported method is a bridge problem', () => {
    const error = new Error('Wallet method unsupported in runtime shim: stx_signMessage');
    error.code = -32601;
    expect(needsWalletBridge(error)).toBe(false);
  });

  it('shrugs off anything else', () => {
    for (const value of [null, undefined, {}, new Error('User rejected the request')]) {
      expect(needsWalletBridge(value)).toBe(false);
    }
  });
});

import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { __testing } from '../connect';

// Wallet-stability guard rails. Each block locks in a behaviour that has
// regressed at least once. If one of these fails, a wallet flow is about to
// break in production — do not weaken the assertion; fix the code.

const connectSource = readFileSync(new URL('../connect.ts', import.meta.url), 'utf8');
const adapterSource = readFileSync(new URL('../adapter.ts', import.meta.url), 'utf8');

const globalWithWindow = globalThis as { window?: unknown };

const makeWindow = (props: Record<string, unknown>) => {
  const win: Record<string, unknown> = {
    location: { origin: 'https://xtrata.xyz' },
    localStorage: {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined
    },
    ...props
  };
  return win;
};

afterEach(() => {
  delete globalWithWindow.window;
});

describe('wallet chooser invariants (source level)', () => {
  it('connectWallet always forces the wallet-select modal', () => {
    // Regression: adapter/connect silently reusing the last wallet meant the
    // user could never choose between Xverse and Leather.
    expect(connectSource).toContain('forceWalletSelect: true');
  });

  it('adapter.connect never short-circuits on a persisted session', () => {
    // The chooser must open on EVERY connect click; a stored session must not
    // bypass it (cancel keeps the previous session instead).
    expect(adapterSource).not.toMatch(/if \(current\.isConnected\)[\s\S]{0,40}return current/);
    expect(adapterSource).toContain('connectWallet({');
  });

  it('the chooser modal detects installed wallets on the HOST window only', () => {
    // Regression: inside the /wizard iframe, connect-ui's getInstalledProviders
    // listed the Asigna iframe shim and missed the real top-window wallets.
    expect(connectSource).toContain('getInstalledProvidersOnHost(defaultProviders)');
    expect(connectSource).not.toMatch(/installedProviders = getInstalledProviders\(/);
  });
});

describe('iframe host-window provider resolution', () => {
  it('detects providers on the top same-origin window, ignoring the iframe Asigna shim', () => {
    const topWindow = makeWindow({ LeatherProvider: { request: () => Promise.resolve() } });
    const iframeWindow = makeWindow({ AsignaProvider: {} });
    iframeWindow.self = iframeWindow;
    iframeWindow.top = topWindow;
    topWindow.self = topWindow;
    topWindow.top = topWindow;
    globalWithWindow.window = iframeWindow;

    expect(__testing.getWalletHostWindow()).toBe(topWindow);

    const defaults = [
      { id: 'LeatherProvider', name: 'Leather' },
      { id: 'AsignaProvider', name: 'Asigna Multisig' },
      { id: 'XverseProviders.StacksProvider', name: 'Xverse Wallet' }
    ] as never[];
    const installed = __testing.getInstalledProvidersOnHost(defaults) as Array<{ id: string }>;
    expect(installed.map((p) => p.id)).toEqual(['LeatherProvider']);
  });

  it('resolves dotted provider ids against the top window (Xverse)', () => {
    const xverseStacks = { request: () => Promise.resolve() };
    const topWindow = makeWindow({ XverseProviders: { StacksProvider: xverseStacks } });
    const iframeWindow = makeWindow({});
    iframeWindow.self = iframeWindow;
    iframeWindow.top = topWindow;
    globalWithWindow.window = iframeWindow;

    expect(__testing.resolveProviderById('XverseProviders.StacksProvider')).toBe(xverseStacks);
  });

  it('falls back to the local window when the parent is cross-origin', () => {
    const leather = { request: () => Promise.resolve() };
    const iframeWindow = makeWindow({ LeatherProvider: leather });
    iframeWindow.self = iframeWindow;
    Object.defineProperty(iframeWindow, 'top', {
      get() {
        // Simulates the SecurityError a cross-origin window.top.location access throws.
        return {
          get location(): never {
            throw new Error('Blocked a frame with origin from accessing a cross-origin frame.');
          }
        };
      }
    });
    globalWithWindow.window = iframeWindow;

    expect(__testing.getWalletHostWindow()).toBe(iframeWindow);
    expect(__testing.resolveProviderById('LeatherProvider')).toBe(leather);
  });

  it('uses the plain window when not embedded at all', () => {
    const topWindow = makeWindow({ LeatherProvider: { request: () => Promise.resolve() } });
    topWindow.self = topWindow;
    topWindow.top = topWindow;
    globalWithWindow.window = topWindow;

    expect(__testing.getWalletHostWindow()).toBe(topWindow);
    const installed = __testing.getInstalledProvidersOnHost([
      { id: 'LeatherProvider', name: 'Leather' }
    ] as never[]) as Array<{ id: string }>;
    expect(installed.map((p) => p.id)).toEqual(['LeatherProvider']);
  });
});

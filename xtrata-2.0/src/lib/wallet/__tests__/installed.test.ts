import { describe, expect, it } from 'vitest';
import { hasInstalledStacksWallet } from '../installed';

describe('hasInstalledStacksWallet', () => {
  it('is false for a browser with no wallet, and ignores the Asigna shim every iframe gets', () => {
    expect(hasInstalledStacksWallet({})).toBe(false);
    expect(hasInstalledStacksWallet({ AsignaProvider: {}, btc_providers: [{ id: 'AsignaProvider' }] })).toBe(false);
    expect(hasInstalledStacksWallet(undefined)).toBe(false);
  });
  it('sees Leather, Xverse and registered providers', () => {
    expect(hasInstalledStacksWallet({ LeatherProvider: {} })).toBe(true);
    expect(hasInstalledStacksWallet({ XverseProviders: {} })).toBe(true);
    expect(hasInstalledStacksWallet({ StacksProvider: {} })).toBe(true);
    expect(hasInstalledStacksWallet({ btc_providers: [{ id: 'XverseProviders.BitcoinProvider' }] })).toBe(true);
    expect(hasInstalledStacksWallet({ webbtc_stx_providers: [{ id: 'LeatherProvider' }] })).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { createMemoryStorage } from '../storage';
import { createWalletSessionStore, walletSessionUtils } from '../session';

describe('wallet session store', () => {
  it('stores and restores sessions', () => {
    const storage = createMemoryStorage();
    const store = createWalletSessionStore(storage);

    store.save({
      isConnected: true,
      address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      network: 'testnet'
    });

    const loaded = store.load();
    expect(loaded.isConnected).toBe(true);
    expect(loaded.address).toBe('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA');
    expect(loaded.network).toBe('testnet');
  });

  it('clears sessions', () => {
    const storage = createMemoryStorage();
    const store = createWalletSessionStore(storage);

    store.save({
      isConnected: true,
      address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      network: 'testnet'
    });
    store.clear();

    expect(store.load().isConnected).toBe(false);
  });

  it('normalizes invalid sessions', () => {
    const normalized = walletSessionUtils.normalizeSession({
      isConnected: true,
      address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA'
    });

    expect(normalized.isConnected).toBe(true);
    expect(normalized.network).toBe('testnet');

    const disconnected = walletSessionUtils.normalizeSession({
      isConnected: false
    });
    expect(disconnected.isConnected).toBe(false);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const connectWalletMock = vi.fn();
const disconnectWalletMock = vi.fn();

vi.mock('../connect', () => ({
  connectWallet: (...args: unknown[]) => connectWalletMock(...args),
  disconnectWallet: (...args: unknown[]) => disconnectWalletMock(...args)
}));

import { createStacksWalletAdapter } from '../adapter';

const APP = { appName: 'Xtrata', appIcon: '/favicon.ico' };
const ADDRESS_A = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const ADDRESS_B = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';

describe('stacks wallet adapter', () => {
  beforeEach(() => {
    connectWalletMock.mockReset();
    disconnectWalletMock.mockReset().mockResolvedValue(undefined);
    // vitest runs in a node environment: getDefaultStorage falls back to a
    // fresh in-memory store per adapter, so no cross-test cleanup is needed.
  });

  it('always re-runs the wallet chooser on connect, even with a persisted session', async () => {
    const adapter = createStacksWalletAdapter(APP);
    connectWalletMock.mockResolvedValueOnce({
      isConnected: true,
      address: ADDRESS_A,
      network: 'mainnet'
    });
    await adapter.connect();
    expect(connectWalletMock).toHaveBeenCalledTimes(1);

    // Second connect must NOT short-circuit on the stored session: the user
    // gets the Xverse/Leather picker again and can switch wallets.
    connectWalletMock.mockResolvedValueOnce({
      isConnected: true,
      address: ADDRESS_B,
      network: 'mainnet'
    });
    const switched = await adapter.connect();
    expect(connectWalletMock).toHaveBeenCalledTimes(2);
    expect(switched.address).toBe(ADDRESS_B);
    expect(adapter.getSession().address).toBe(ADDRESS_B);
  });

  it('keeps the existing session when the chooser is cancelled', async () => {
    const adapter = createStacksWalletAdapter(APP);
    connectWalletMock.mockResolvedValueOnce({
      isConnected: true,
      address: ADDRESS_A,
      network: 'mainnet'
    });
    await adapter.connect();

    connectWalletMock.mockResolvedValueOnce({ isConnected: false });
    const afterCancel = await adapter.connect();
    expect(afterCancel.isConnected).toBe(true);
    expect(afterCancel.address).toBe(ADDRESS_A);
    expect(adapter.getSession().address).toBe(ADDRESS_A);
  });

  it('returns a disconnected session when cancelled with no prior session', async () => {
    const adapter = createStacksWalletAdapter(APP);
    connectWalletMock.mockResolvedValueOnce({ isConnected: false });
    const session = await adapter.connect();
    expect(session.isConnected).toBe(false);
    expect(adapter.getSession().isConnected).toBe(false);
  });

  it('clears the stored session on disconnect', async () => {
    const adapter = createStacksWalletAdapter(APP);
    connectWalletMock.mockResolvedValueOnce({
      isConnected: true,
      address: ADDRESS_A,
      network: 'mainnet'
    });
    await adapter.connect();
    await adapter.disconnect();
    expect(disconnectWalletMock).toHaveBeenCalledTimes(1);
    expect(adapter.getSession().isConnected).toBe(false);
  });
});

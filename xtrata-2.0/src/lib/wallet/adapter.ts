import { createWalletSessionStore } from './session';
import { connectWallet, disconnectWallet } from './connect';
import { setNetwork, setWallet } from '../telemetry/client';
import type { WalletSession } from './types';

export const createStacksWalletAdapter = (params: {
  appName: string;
  appIcon: string;
}) => {
  const sessionStore = createWalletSessionStore();
  const clearSession = () => {
    sessionStore.clear();
  };

  const getSession = (): WalletSession => {
    const session = sessionStore.load();
    if (session.isConnected && session.address) {
      setWallet(session.address);
      setNetwork(session.network);
    }
    return session;
  };

  // Connecting ALWAYS opens the wallet chooser (connectWallet forces the
  // provider-select modal), even when a previous session is persisted in
  // localStorage. Users must be able to pick Xverse vs Leather on every
  // connect, not silently resume whichever wallet connected last time.
  // Cancelling the chooser keeps any existing session instead of wiping it.
  const connect = async (): Promise<WalletSession> => {
    const previous = getSession();

    const session = await connectWallet({
      appName: params.appName,
      appIcon: params.appIcon
    });

    if (!session.isConnected) {
      return previous.isConnected ? previous : session;
    }

    sessionStore.save(session);
    return session;
  };

  const disconnect = async () => {
    await disconnectWallet();
    clearSession();
  };

  return {
    connect,
    disconnect,
    getSession
  };
};

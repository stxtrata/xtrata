import {
  changeWalletAccount,
  connectWallet,
  disconnectWallet,
  getWalletSession,
  subscribeWalletSession
} from './coordinator';
import { walletSessionUtils } from './session';
import type { WalletSession, WalletSessionChangeSource } from './types';

export const createStacksWalletAdapter = (params: {
  appName: string;
  appIcon: string;
}) => {
  const getSession = (): WalletSession => getWalletSession();

  const connect = async (): Promise<WalletSession> => {
    const current = getSession();
    if (current.isConnected) {
      return current;
    }

    const session = await connectWallet({
      appName: params.appName,
      appIcon: params.appIcon
    });
    return session;
  };

  const changeAccount = async (): Promise<WalletSession> => {
    const session = await changeWalletAccount({
      appName: params.appName,
      appIcon: params.appIcon
    });
    return session;
  };

  const disconnect = async () => {
    await disconnectWallet();
  };

  const subscribe = (
    listener: (session: WalletSession, source: WalletSessionChangeSource) => void
  ) =>
    subscribeWalletSession(({ record, source }) => {
      listener(walletSessionUtils.recordToSession(record), source);
    });

  return {
    connect,
    changeAccount,
    disconnect,
    getSession,
    subscribe
  };
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { connectWallet, disconnectWallet, getSelectedWalletProviderId } from '../wallet/connect';
import { createWalletSessionStore } from '../wallet/session';
import { getNetworkFromAddress, type NetworkType } from '../wallet/network';
import type { WalletSession } from '../wallet/types';
import { loadConfig } from '../config';
import { useToasts } from './ToastContext';

/**
 * Wallet session as React state.
 *
 * The hardened provider layer (`src/wallet/connect.ts`) owns provider
 * discovery, signing and the session shape; this context is only a thin,
 * cached view of it. The cached session is a convenience — it is re-derived
 * from the wallet on connect, and every network decision goes through the
 * address prefix, never a stored `network` field.
 */

export interface WalletContextValue {
  session: WalletSession;
  address?: string;
  isConnected: boolean;
  /** Network family implied by the connected address (chain truth). */
  walletNetwork: NetworkType | null;
  /** Network the app is configured for. */
  appNetwork: NetworkType;
  /** True when the wallet is connected on a different network than the app. */
  wrongNetwork: boolean;
  connecting: boolean;
  providerId: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const disconnected: WalletSession = { isConnected: false };

export const WalletProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const config = loadConfig();
  const store = useMemo(() => createWalletSessionStore(), []);
  const [session, setSession] = useState<WalletSession>(disconnected);
  const [connecting, setConnecting] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const { notifyError, notify } = useToasts();

  useEffect(() => {
    setSession(store.load());
    setProviderId(getSelectedWalletProviderId() ?? null);
  }, [store]);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const next = await connectWallet({ appName: config.appName, appIcon: config.appIcon });
      setSession(next);
      setProviderId(getSelectedWalletProviderId() ?? null);
      if (next.isConnected) {
        store.save(next);
      } else {
        store.clear();
        notify({
          kind: 'warn',
          title: 'Wallet not connected',
          body: `No ${config.network} account was returned. Check that the wallet is unlocked and switched to ${config.network}.`
        });
      }
    } catch (error) {
      notifyError(error, 'Wallet connect');
    } finally {
      setConnecting(false);
    }
  }, [config.appIcon, config.appName, config.network, notify, notifyError, store]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      notifyError(error, 'Wallet disconnect');
    } finally {
      store.clear();
      setSession(disconnected);
      setProviderId(null);
    }
  }, [notifyError, store]);

  const walletNetwork = session.address ? getNetworkFromAddress(session.address) : null;

  const value = useMemo<WalletContextValue>(
    () => ({
      session,
      ...(session.address !== undefined ? { address: session.address } : {}),
      isConnected: Boolean(session.isConnected && session.address),
      walletNetwork,
      appNetwork: config.network,
      wrongNetwork: Boolean(session.address) && walletNetwork !== config.network,
      connecting,
      providerId,
      connect,
      disconnect
    }),
    [session, walletNetwork, config.network, connecting, providerId, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextValue => {
  const value = useContext(WalletContext);
  if (!value) throw new Error('useWallet must be used inside <WalletProvider>');
  return value;
};

export const shortenAddress = (address: string): string =>
  address.length <= 14 ? address : `${address.slice(0, 6)}…${address.slice(-5)}`;

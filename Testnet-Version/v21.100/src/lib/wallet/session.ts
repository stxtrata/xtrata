import { getNetworkFromAddress } from '../network/guard';
import type { NetworkType } from '../network/types';
import type { WalletSession } from './types';
import type { StorageLike } from './storage';
import { getDefaultStorage } from './storage';

const STORAGE_KEY = 'xstrata.v15.1.wallet.session';

const emptySession: WalletSession = { isConnected: false };

const resolveNetwork = (session: WalletSession): NetworkType | undefined => {
  if (session.network) {
    return session.network;
  }
  if (session.address) {
    return getNetworkFromAddress(session.address) ?? undefined;
  }
  return undefined;
};

const normalizeSession = (session: WalletSession): WalletSession => {
  if (!session.isConnected || !session.address) {
    return { ...emptySession };
  }

  return {
    isConnected: true,
    address: session.address,
    network: resolveNetwork(session)
  };
};

const parseSession = (raw: string | null): WalletSession => {
  if (!raw) {
    return { ...emptySession };
  }

  try {
    const parsed = JSON.parse(raw) as WalletSession;
    return normalizeSession(parsed);
  } catch (error) {
    return { ...emptySession };
  }
};

const serializeSession = (session: WalletSession): string => {
  const normalized = normalizeSession(session);
  return JSON.stringify(normalized);
};

export const createWalletSessionStore = (storage?: StorageLike) => {
  const backing = storage ?? getDefaultStorage();

  return {
    load: (): WalletSession => parseSession(backing.getItem(STORAGE_KEY)),
    save: (session: WalletSession) => {
      backing.setItem(STORAGE_KEY, serializeSession(session));
    },
    clear: () => {
      backing.removeItem(STORAGE_KEY);
    }
  };
};

export const walletSessionUtils = {
  normalizeSession,
  parseSession,
  serializeSession
};

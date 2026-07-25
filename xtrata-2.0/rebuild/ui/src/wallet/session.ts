import { getActiveNetwork, getNetworkFromAddress } from './network';
import type { NetworkType } from './network';
import type { WalletSession } from './types';
import type { StorageLike } from './storage';
import { getDefaultStorage } from './storage';

/**
 * Cached wallet session. Copied from `src/lib/wallet/session.ts`; the only
 * change is that the required network is the app's configured network rather
 * than the hardcoded `'mainnet'`, so a testnet session survives a reload during
 * the canary phase and a mainnet session is still rejected on a testnet build
 * (and vice versa).
 */

const STORAGE_KEY = 'xtrata.v3.wallet.session';

const emptySession: WalletSession = { isConnected: false };

const resolveNetwork = (session: WalletSession): NetworkType | undefined => {
  if (session.address) {
    return getNetworkFromAddress(session.address) ?? session.network;
  }
  return session.network;
};

const normalizeSession = (session: WalletSession): WalletSession => {
  if (!session.isConnected || !session.address) {
    return { ...emptySession };
  }

  const required = getActiveNetwork();
  const network = resolveNetwork(session);
  if (network !== required) {
    return { ...emptySession };
  }

  return {
    isConnected: true,
    address: session.address,
    network: required,
    ...(typeof session.publicKey === 'string' && /^[0-9a-f]{66}$/i.test(session.publicKey)
      ? { publicKey: session.publicKey }
      : {})
  };
};

const parseSession = (raw: string | null): WalletSession => {
  if (!raw) {
    return { ...emptySession };
  }

  try {
    const parsed = JSON.parse(raw) as WalletSession;
    return normalizeSession(parsed);
  } catch {
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

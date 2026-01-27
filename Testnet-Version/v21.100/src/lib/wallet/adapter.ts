import { AppConfig, UserSession, type UserData } from '@stacks/auth';
import { showConnect, disconnect as disconnectProvider } from '@stacks/connect';
import { getNetworkFromAddress } from '../network/guard';
import type { NetworkType } from '../network/types';
import { createWalletSessionStore } from './session';
import type { WalletSession } from './types';

const DEFAULT_SCOPES = ['store_write'];
const MANIFEST_PATH = '/manifest.json';

type StxAddressProfile =
  | string
  | {
      mainnet?: string;
      testnet?: string;
      [key: string]: unknown;
    };

const normalizeCoreNodeNetwork = (coreNode?: string): NetworkType | undefined => {
  if (!coreNode) {
    return undefined;
  }
  const lower = coreNode.toLowerCase();
  if (lower.includes('testnet')) {
    return 'testnet';
  }
  if (lower.includes('mainnet')) {
    return 'mainnet';
  }
  return undefined;
};

const normalizeProfileNetwork = (stxAddress?: StxAddressProfile): NetworkType | undefined => {
  if (!stxAddress || typeof stxAddress === 'string') {
    return undefined;
  }
  const hasMainnet = typeof stxAddress.mainnet === 'string';
  const hasTestnet = typeof stxAddress.testnet === 'string';
  if (hasMainnet && !hasTestnet) {
    return 'mainnet';
  }
  if (hasTestnet && !hasMainnet) {
    return 'testnet';
  }
  return undefined;
};

const resolveProfileAddress = (
  stxAddress?: StxAddressProfile,
  network?: NetworkType
): string | undefined => {
  if (!stxAddress) {
    return undefined;
  }
  if (typeof stxAddress === 'string') {
    return stxAddress;
  }
  if (network && typeof stxAddress[network] === 'string') {
    return stxAddress[network];
  }
  if (typeof stxAddress.testnet === 'string') {
    return stxAddress.testnet;
  }
  if (typeof stxAddress.mainnet === 'string') {
    return stxAddress.mainnet;
  }
  return undefined;
};

export const deriveWalletSession = (userData: UserData): WalletSession => {
  const profile = (userData.profile ?? {}) as { stxAddress?: StxAddressProfile };
  const stxAddress = profile.stxAddress;
  const network =
    normalizeCoreNodeNetwork(userData.coreNode) ??
    (userData.identityAddress
      ? getNetworkFromAddress(userData.identityAddress) ?? undefined
      : undefined) ??
    normalizeProfileNetwork(stxAddress);

  const address =
    resolveProfileAddress(stxAddress, network) ??
    userData.identityAddress ??
    resolveProfileAddress(stxAddress);

  if (!address) {
    return { isConnected: false };
  }

  return {
    isConnected: true,
    address,
    network
  };
};

const resolveIconUrl = (icon: string) => {
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon;
  }
  if (typeof window !== 'undefined') {
    return new URL(icon, window.location.origin).toString();
  }
  return icon;
};

export const createStacksWalletAdapter = (params: {
  appName: string;
  appIcon: string;
}) => {
  const appConfig = new AppConfig(DEFAULT_SCOPES, undefined, '', MANIFEST_PATH);
  const userSession = new UserSession({ appConfig });
  const sessionStore = createWalletSessionStore();

  const getSession = (): WalletSession => {
    if (userSession.isUserSignedIn()) {
      const session = deriveWalletSession(userSession.loadUserData());
      sessionStore.save(session);
      return session;
    }
    sessionStore.clear();
    return sessionStore.load();
  };

  const connect = async (): Promise<WalletSession> => {
    if (userSession.isUserSignedIn()) {
      return getSession();
    }
    return new Promise((resolve) => {
      showConnect({
        appDetails: {
          name: params.appName,
          icon: resolveIconUrl(params.appIcon)
        },
        manifestPath: MANIFEST_PATH,
        userSession,
        onFinish: (payload) => {
          const session = deriveWalletSession(payload.userSession.loadUserData());
          sessionStore.save(session);
          resolve(session);
        },
        onCancel: () => {
          resolve(getSession());
        }
      });
    });
  };

  const disconnect = async () => {
    userSession.signUserOut();
    disconnectProvider();
    sessionStore.clear();
  };

  return {
    connect,
    disconnect,
    getSession
  };
};

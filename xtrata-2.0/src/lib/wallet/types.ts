import type { NetworkType } from '../network/types';

export type WalletAccount = {
  address: string;
  network: NetworkType;
};

export type WalletSession = {
  isConnected: boolean;
  address?: string;
  network?: NetworkType;
  publicKey?: string;
};

export type WalletProviderFamily = 'xverse' | 'leather' | 'generic' | 'legacy';

export type WalletCoordinatorStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'VERIFYING'
  | 'SIGNING'
  | 'RECONNECT_REQUIRED';

/**
 * Serializable session metadata. Injected provider objects deliberately never
 * enter this record: every tab resolves its own object from providerId.
 */
export type WalletSessionRecord = {
  version: 2;
  revision: number;
  generation: number;
  status: WalletCoordinatorStatus;
  providerId?: string;
  transportId?: string;
  walletType?: WalletProviderFamily;
  address?: string;
  network?: NetworkType;
  publicKey?: string;
  updatedAt: number;
};

export type WalletSessionChangeSource = 'local' | 'broadcast' | 'storage';

export type WalletSessionChange = {
  record: WalletSessionRecord;
  source: WalletSessionChangeSource;
};

export type WalletAdapter = {
  connect: () => Promise<WalletSession>;
  changeAccount?: () => Promise<WalletSession>;
  disconnect: () => Promise<void>;
  getSession: () => WalletSession;
  subscribe: (
    listener: (session: WalletSession, source: WalletSessionChangeSource) => void
  ) => () => void;
};

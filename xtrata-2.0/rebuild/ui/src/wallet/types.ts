import type { NetworkType } from './network';

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

export type WalletAdapter = {
  connect: () => Promise<WalletSession>;
  disconnect: () => Promise<void>;
  getSession: () => WalletSession;
};

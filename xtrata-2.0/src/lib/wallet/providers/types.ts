import type { StacksProvider } from '@stacks/connect';
import type { WalletProviderFamily } from '../types';

export type ResolvedWalletProvider = {
  family: WalletProviderFamily;
  providerId: string;
  transportId: string;
  provider: StacksProvider;
};

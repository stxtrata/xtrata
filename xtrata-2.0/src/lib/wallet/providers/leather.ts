import { getProviderFromId } from '@stacks/connect-ui';
import type { StacksProvider } from '@stacks/connect';
import type { ResolvedWalletProvider } from './types';

export const resolveLeatherProvider = (providerId?: string | null): ResolvedWalletProvider | null => {
  if (typeof window === 'undefined' || !providerId?.toLowerCase().includes('leather')) {
    return null;
  }
  const walletWindow = window as typeof window & { LeatherProvider?: StacksProvider };
  const provider =
    (getProviderFromId(providerId) as StacksProvider | undefined) ??
    walletWindow.LeatherProvider;
  if (!provider) {
    return null;
  }
  return { family: 'leather', providerId, transportId: providerId, provider };
};

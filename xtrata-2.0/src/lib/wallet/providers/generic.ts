import { getProviderFromId } from '@stacks/connect-ui';
import type { StacksProvider } from '@stacks/connect';
import type { ResolvedWalletProvider } from './types';

export const resolveGenericProvider = (providerId?: string | null): ResolvedWalletProvider | null => {
  if (typeof window === 'undefined' || !providerId) {
    return null;
  }
  const provider = getProviderFromId(providerId) as StacksProvider | undefined;
  return provider
    ? { family: 'generic', providerId, transportId: providerId, provider }
    : null;
};

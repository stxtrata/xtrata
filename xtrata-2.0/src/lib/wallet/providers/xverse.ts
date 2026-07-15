import { getProviderFromId } from '@stacks/connect-ui';
import type { StacksProvider } from '@stacks/connect';
import type { ResolvedWalletProvider } from './types';

export const XVERSE_TRANSPORT_ID = 'XverseProviders.BitcoinProvider';
const IDS = [
  XVERSE_TRANSPORT_ID,
  'xverseProviders.BitcoinProvider',
  'BitcoinProvider'
] as const;

export const resolveXverseProvider = (providerId?: string | null): ResolvedWalletProvider | null => {
  if (typeof window === 'undefined' || !providerId?.toLowerCase().includes('xverse')) {
    return null;
  }
  const walletWindow = window as typeof window & {
    XverseProviders?: { BitcoinProvider?: StacksProvider };
    xverseProviders?: { BitcoinProvider?: StacksProvider };
    BitcoinProvider?: StacksProvider;
  };
  const provider =
    walletWindow.XverseProviders?.BitcoinProvider ??
    walletWindow.xverseProviders?.BitcoinProvider ??
    walletWindow.BitcoinProvider ??
    IDS.map((id) => getProviderFromId(id) as StacksProvider | undefined).find(
      (candidate) => typeof candidate?.request === 'function'
    );
  if (!provider || typeof provider.request !== 'function') {
    return null;
  }
  return {
    family: 'xverse',
    providerId,
    transportId: XVERSE_TRANSPORT_ID,
    provider
  };
};

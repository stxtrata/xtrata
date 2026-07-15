import type { StacksProvider } from '@stacks/connect';
import { resolveGenericProvider } from './generic';
import { resolveLeatherProvider } from './leather';
import type { ResolvedWalletProvider } from './types';
import { resolveXverseProvider } from './xverse';

export const resolveWalletProvider = (
  providerId?: string | null,
  fallback?: StacksProvider
): ResolvedWalletProvider | null => {
  const resolved =
    resolveXverseProvider(providerId) ??
    resolveLeatherProvider(providerId) ??
    resolveGenericProvider(providerId);
  if (resolved) {
    return resolved;
  }
  return fallback && providerId
    ? { family: 'legacy', providerId, transportId: providerId, provider: fallback }
    : null;
};

export type { ResolvedWalletProvider } from './types';
export { XVERSE_TRANSPORT_ID } from './xverse';

/**
 * Network identity for the wallet layer.
 *
 * Adapted from `src/lib/network/{types,guard}.ts` in the v15.1 app. The one
 * behavioural change vs. the original hardened layer: the app is no longer
 * mainnet-only. The active network is configurable at runtime (the canary and
 * the testnet rehearsal phase both need testnet), and every network check in
 * `connect.ts` / `session.ts` compares against it instead of the literal
 * `'mainnet'`.
 */

export type NetworkType = 'mainnet' | 'testnet';

export const NETWORK_TYPES: readonly NetworkType[] = ['mainnet', 'testnet'];

export const isNetworkType = (value: unknown): value is NetworkType =>
  value === 'mainnet' || value === 'testnet';

const MAINNET_PREFIXES = ['SP', 'SM'];
const TESTNET_PREFIXES = ['ST', 'SN'];

/** Principal prefix → network family. `null` when the prefix is unknown. */
export const getNetworkFromAddress = (principal: string): NetworkType | null => {
  const [address] = principal.split('.');
  if (!address || address.length < 2) {
    return null;
  }
  const prefix = address.slice(0, 2).toUpperCase();
  if (MAINNET_PREFIXES.includes(prefix)) {
    return 'mainnet';
  }
  if (TESTNET_PREFIXES.includes(prefix)) {
    return 'testnet';
  }
  return null;
};

export type NetworkMismatch = {
  expected: NetworkType;
  actual: NetworkType;
};

export const getNetworkMismatch = (
  appNetwork: NetworkType,
  walletNetwork?: NetworkType | null
): NetworkMismatch | null => {
  if (!walletNetwork || appNetwork === walletNetwork) {
    return null;
  }
  return { expected: appNetwork, actual: walletNetwork };
};

// --- configurable active network -------------------------------------------

let activeNetwork: NetworkType = 'mainnet';
const listeners = new Set<(network: NetworkType) => void>();

/** The network the app currently targets; wallet sessions must match it. */
export const getActiveNetwork = (): NetworkType => activeNetwork;

export const setActiveNetwork = (network: NetworkType): void => {
  if (!isNetworkType(network)) {
    throw new Error(`unsupported network: ${String(network)}`);
  }
  if (activeNetwork === network) return;
  activeNetwork = network;
  for (const listener of listeners) listener(network);
};

export const onActiveNetworkChange = (listener: (network: NetworkType) => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** True when `address` is encoded for the active network. */
export const addressMatchesActiveNetwork = (address: string): boolean =>
  getNetworkFromAddress(address) === activeNetwork;

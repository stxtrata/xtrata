import { NETWORKS, type NetworkName } from '@xtrata/collections-client';
import { isNetworkType, setActiveNetwork, type NetworkType } from './wallet/network';

/**
 * Build/runtime configuration for every entry of this app.
 *
 * Nothing here is a secret and nothing here is authoritative — the chain is.
 * These are the addresses the app talks to and the network it expects wallets
 * to be on. Overridable at build time via `VITE_*` env vars and, for local
 * experimentation, via `?network=testnet` on the URL.
 */

export interface AppConfig {
  /** Wallet-facing network family. */
  network: NetworkType;
  /** Client-facing network name (adds devnet for local chains). */
  networkName: NetworkName;
  /** Stacks API base URL used for read-only calls and tx status polling. */
  apiBaseUrl: string;
  /** The pinned Xtrata inscription core, `SPxxx.xtrata-v3-2-3`. */
  coreContractId: string;
  /** The deployed drops singleton, used as the collection's drops-authority. */
  dropsContractId: string;
  /**
   * Origin the sponsor relayer's `/sponsor/v3` routes are mounted under.
   * Defaults to this origin, which is how it ships (a Pages Function on the
   * same site); overridable for local development against a remote relayer.
   */
  relayerBaseUrl: string;
  appName: string;
  appIcon: string;
}

const DEFAULTS: Record<NetworkType, Pick<AppConfig, 'coreContractId' | 'dropsContractId'>> = {
  mainnet: {
    coreContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
    dropsContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3'
  },
  testnet: {
    coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3',
    dropsContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3'
  }
};

const env = (key: string): string | undefined => {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const networkFromLocation = (): NetworkType | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const value = new URL(window.location.href).searchParams.get('network');
    return isNetworkType(value) ? value : undefined;
  } catch {
    return undefined;
  }
};

const resolveNetwork = (): NetworkType => {
  const fromUrl = networkFromLocation();
  if (fromUrl) return fromUrl;
  const fromEnv = env('VITE_XTRATA_NETWORK');
  return isNetworkType(fromEnv) ? fromEnv : 'mainnet';
};

let cached: AppConfig | null = null;

export const loadConfig = (): AppConfig => {
  if (cached) return cached;
  const network = resolveNetwork();
  const networkName: NetworkName = network;
  cached = {
    network,
    networkName,
    apiBaseUrl: env('VITE_XTRATA_API_URL') ?? NETWORKS[networkName].coreApiUrl,
    coreContractId: env('VITE_XTRATA_CORE_CONTRACT') ?? DEFAULTS[network].coreContractId,
    dropsContractId: env('VITE_XTRATA_DROPS_CONTRACT') ?? DEFAULTS[network].dropsContractId,
    relayerBaseUrl:
      env('VITE_XTRATA_RELAYER_URL') ??
      (typeof window === 'undefined' ? '' : window.location.origin),
    appName: 'Xtrata Collection Studio',
    appIcon: `${typeof window === 'undefined' ? '' : window.location.origin}/favicon.svg`
  };
  setActiveNetwork(cached.network);
  return cached;
};

/** Test seam: drop the memoized config (and re-apply the wallet network). */
export const __resetConfig = (override?: Partial<AppConfig>): AppConfig => {
  cached = null;
  const base = loadConfig();
  if (override) {
    cached = { ...base, ...override };
    setActiveNetwork(cached.network);
  }
  return cached!;
};

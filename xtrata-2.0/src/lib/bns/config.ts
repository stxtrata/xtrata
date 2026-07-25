import type { NetworkType } from '../network/types';

const DEFAULT_EXPLORER_BASE = 'https://explorer.hiro.so';
const DEFAULT_BNSV2_BASES: Record<NetworkType, string[]> = {
  mainnet: ['https://api.bnsv2.com'],
  testnet: ['https://api.bnsv2.com/testnet']
};

// The BNS-V2 registry, used for the authoritative primary-name read. Testnet
// has no deployment we trust yet, so primary lookups are skipped there and the
// name-list heuristics stand in.
const DEFAULT_BNSV2_CONTRACTS: Record<NetworkType, string | null> = {
  mainnet: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
  testnet: null
};

const getEnvOverride = (network: NetworkType) => {
  const env = import.meta.env;
  if (network === 'testnet') {
    return env.VITE_STACKS_EXPLORER_BASE_TESTNET || env.VITE_STACKS_EXPLORER_BASE;
  }
  return env.VITE_STACKS_EXPLORER_BASE_MAINNET || env.VITE_STACKS_EXPLORER_BASE;
};

const getBnsV2EnvOverride = (network: NetworkType) => {
  const env = import.meta.env;
  if (network === 'testnet') {
    return env.VITE_BNSV2_API_BASE_TESTNET || env.VITE_BNSV2_API_BASE;
  }
  return env.VITE_BNSV2_API_BASE_MAINNET || env.VITE_BNSV2_API_BASE;
};

const getExplorerProxyBase = () => '/explorer';
const getBnsV2ProxyBase = (network: NetworkType) => `/bnsv2/${network}`;

const normalizeOverride = (override: string) => {
  if (override.startsWith('/') && typeof window !== 'undefined') {
    return `${window.location.origin}${override}`;
  }
  return override;
};

export const getExplorerHtmlBaseUrls = (network: NetworkType) => {
  const override = getEnvOverride(network);
  if (override) {
    return [normalizeOverride(override)];
  }
  if (import.meta.env.DEV) {
    return [getExplorerProxyBase()];
  }
  if (typeof window !== 'undefined') {
    return [`${window.location.origin}${getExplorerProxyBase()}`];
  }
  return [DEFAULT_EXPLORER_BASE];
};

export const getBnsV2ContractId = (network: NetworkType) => {
  const env = import.meta.env;
  const override =
    network === 'testnet'
      ? env.VITE_BNSV2_CONTRACT_TESTNET
      : env.VITE_BNSV2_CONTRACT_MAINNET;
  const trimmed = typeof override === 'string' ? override.trim() : '';
  if (trimmed) {
    return trimmed.includes('.') ? trimmed : null;
  }
  return DEFAULT_BNSV2_CONTRACTS[network];
};

export const getBnsV2ApiBaseUrls = (network: NetworkType) => {
  const override = getBnsV2EnvOverride(network);
  if (override) {
    return [normalizeOverride(override)];
  }
  if (import.meta.env.DEV) {
    return [getBnsV2ProxyBase(network)];
  }
  const bases = DEFAULT_BNSV2_BASES[network];
  if (typeof window !== 'undefined') {
    const proxyBase = `${window.location.origin}${getBnsV2ProxyBase(network)}`;
    return [proxyBase, ...bases.filter((base) => base !== proxyBase)];
  }
  return bases;
};

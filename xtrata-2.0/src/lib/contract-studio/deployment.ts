import { getApiBaseUrl } from '../network/config';
import type { NetworkType } from '../network/types';
import { sha256Hex } from './canonical';

export const assertDeploymentNetwork = (params: {
  assetNetwork: NetworkType;
  walletNetwork?: NetworkType;
  contractName: string;
}) => {
  if (!params.walletNetwork) throw new Error('Connect a wallet before deployment.');
  if (params.walletNetwork !== params.assetNetwork) {
    throw new Error(`Wallet is on ${params.walletNetwork}; this project is ${params.assetNetwork}.`);
  }
  if (!/^[a-zA-Z][a-zA-Z0-9-_]{0,127}$/.test(params.contractName)) {
    throw new Error('Contract name must start with a letter and use letters, numbers, hyphens or underscores.');
  }
};

export const verifyDeployedSource = async (params: {
  network: NetworkType;
  address: string;
  contractName: string;
  expectedHash: string;
}) => {
  const base = getApiBaseUrl(params.network);
  const response = await fetch(
    `${base}/v2/contracts/source/${params.address}/${params.contractName}`
  );
  if (!response.ok) throw new Error(`Source lookup returned HTTP ${response.status}.`);
  const payload = (await response.json()) as { source?: string };
  if (typeof payload.source !== 'string') throw new Error('Source lookup returned no source.');
  const actualHash = await sha256Hex(payload.source);
  return { matches: actualHash === params.expectedHash, actualHash };
};


import { XtrataClientError } from './errors.js';

/**
 * Network configuration + validation. Principal prefixes are the wrong-network
 * tripwire: SP/SM principals only exist on mainnet, ST/SN only on
 * testnet-family networks (testnet, devnet, simnet all use testnet encoding).
 */

export type NetworkName = 'mainnet' | 'testnet' | 'devnet';

export interface NetworkDescriptor {
  name: NetworkName;
  coreApiUrl: string;
  /** Valid standard/contract principal prefixes on this network. */
  principalPrefixes: readonly string[];
}

export const NETWORKS: Record<NetworkName, NetworkDescriptor> = {
  mainnet: {
    name: 'mainnet',
    coreApiUrl: 'https://api.hiro.so',
    principalPrefixes: ['SP', 'SM']
  },
  testnet: {
    name: 'testnet',
    coreApiUrl: 'https://api.testnet.hiro.so',
    principalPrefixes: ['ST', 'SN']
  },
  devnet: {
    name: 'devnet',
    coreApiUrl: 'http://localhost:3999',
    principalPrefixes: ['ST', 'SN']
  }
};

const PRINCIPAL_RE = /^S[PMTN][0-9A-Z]{18,40}$/;

export interface ContractId {
  address: string;
  name: string;
}

/** Parse `SPxxx.contract-name` into its parts; throws `plan-invalid` on junk. */
export const parseContractId = (contractId: string): ContractId => {
  const dot = contractId.indexOf('.');
  if (dot <= 0 || dot === contractId.length - 1) {
    throw new XtrataClientError('plan-invalid', `invalid contract id: ${contractId}`);
  }
  const address = contractId.slice(0, dot);
  const name = contractId.slice(dot + 1);
  if (!PRINCIPAL_RE.test(address)) {
    throw new XtrataClientError('plan-invalid', `invalid contract address: ${address}`);
  }
  if (!/^[a-zA-Z][a-zA-Z0-9-]{0,127}$/.test(name)) {
    throw new XtrataClientError('plan-invalid', `invalid contract name: ${name}`);
  }
  return { address, name };
};

export const formatContractId = (id: ContractId): string => `${id.address}.${id.name}`;

/** Which network family a principal's prefix belongs to. */
export const principalNetwork = (principal: string): 'mainnet' | 'testnet' => {
  const address = principal.includes('.') ? principal.slice(0, principal.indexOf('.')) : principal;
  const prefix = address.slice(0, 2);
  if (prefix === 'SP' || prefix === 'SM') return 'mainnet';
  if (prefix === 'ST' || prefix === 'SN') return 'testnet';
  throw new XtrataClientError('plan-invalid', `unrecognized principal prefix: ${address}`);
};

/**
 * Guard: the principal must be encoded for `network`. Throws a normalized
 * wrong-network error otherwise.
 */
export const assertPrincipalOnNetwork = (principal: string, network: NetworkName): void => {
  const family = principalNetwork(principal);
  const expected = network === 'mainnet' ? 'mainnet' : 'testnet';
  if (family !== expected) {
    throw new XtrataClientError(
      'plan-invalid',
      `wrong network: principal ${principal} is a ${family} address but the client is configured for ${network}`,
      { detail: { principal, network, principalFamily: family } }
    );
  }
};

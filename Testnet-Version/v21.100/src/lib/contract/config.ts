import type { NetworkType } from '../network/types';

export type ContractConfig = {
  address: string;
  contractName: string;
  network: NetworkType;
};

export const DEFAULT_CONTRACT: ContractConfig = {
  address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
  contractName: 'u64bxr-v9-2-14',
  network: 'testnet'
};

export const CONTRACTS: ContractConfig[] = [DEFAULT_CONTRACT];

export const getContractId = (contract: ContractConfig) =>
  `${contract.address}.${contract.contractName}`;

import type { NetworkType } from '../network/types';

export type ContractConfig = {
  address: string;
  contractName: string;
  network: NetworkType;
};

export const DEFAULT_CONTRACT: ContractConfig = {
  address: 'SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE',
  contractName: 'xtrata-v1-1-0',
  network: 'mainnet'
};

export const CONTRACTS: ContractConfig[] = [DEFAULT_CONTRACT];

export const getContractId = (contract: ContractConfig) =>
  `${contract.address}.${contract.contractName}`;

import { describe, expect, it } from 'vitest';
import { createMemoryStorage } from '../../wallet/storage';
import { createContractSelectionStore } from '../selection';
import type { ContractRegistryEntry } from '../registry';

const registry: ContractRegistryEntry[] = [
  {
    label: 'Testnet',
    address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
    contractName: 'u64bxr-v9-2-14',
    network: 'testnet',
    protocolVersion: '9.2.14'
  },
  {
    label: 'Mainnet',
    address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
    contractName: 'u64bxr-v9-2-14',
    network: 'mainnet',
    protocolVersion: '9.2.14'
  }
];

describe('contract selection store', () => {
  it('defaults to the first registry entry', () => {
    const store = createContractSelectionStore(registry, createMemoryStorage());
    const selected = store.load();
    expect(selected.label).toBe('Testnet');
  });

  it('persists selection', () => {
    const storage = createMemoryStorage();
    const store = createContractSelectionStore(registry, storage);

    store.save(registry[1]);
    const selected = store.load();
    expect(selected.label).toBe('Mainnet');
  });
});

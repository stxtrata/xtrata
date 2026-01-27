import { describe, expect, it } from 'vitest';
import { createMemoryStorage } from '../../wallet/storage';
import { createContractSelectionStore } from '../selection';
import type { ContractRegistryEntry } from '../registry';

const registry: ContractRegistryEntry[] = [
  {
    label: 'xtrata-v1-1-0',
    address: 'SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE',
    contractName: 'xtrata-v1-1-0',
    network: 'mainnet',
    protocolVersion: '1.1.0'
  }
];

describe('contract selection store', () => {
  it('defaults to the first registry entry', () => {
    const store = createContractSelectionStore(registry, createMemoryStorage());
    const selected = store.load();
    expect(selected.label).toBe('xtrata-v1-1-0');
  });

  it('persists selection', () => {
    const storage = createMemoryStorage();
    const store = createContractSelectionStore(registry, storage);

    store.save(registry[0]);
    const selected = store.load();
    expect(selected.label).toBe('xtrata-v1-1-0');
  });
});

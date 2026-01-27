import { describe, expect, it } from 'vitest';
import { CONTRACT_REGISTRY } from '../registry';
import { getContractId } from '../config';

const EXPECTED_V11_CONTRACT_ID =
  'SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE.xtrata-v1-1-0';

describe('contract registry', () => {
  it('loads the default registry entry', () => {
    expect(CONTRACT_REGISTRY.length).toBeGreaterThan(0);
    const entry = CONTRACT_REGISTRY[0];
    expect(getContractId(entry)).toBe(EXPECTED_V11_CONTRACT_ID);
    expect(entry.network).toBe('mainnet');
    expect(entry.protocolVersion).toBe('1.1.0');
  });

  it('includes xtrata-v1-1-0 as the only entry', () => {
    expect(CONTRACT_REGISTRY).toHaveLength(1);
    const [v110] = CONTRACT_REGISTRY;

    expect(getContractId(v110)).toBe(EXPECTED_V11_CONTRACT_ID);
    expect(v110.contractName).toBe('xtrata-v1-1-0');
    expect(v110.address).toBe('SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE');
    expect(v110.network).toBe('mainnet');
    expect(v110.protocolVersion).toBe('1.1.0');
  });
});

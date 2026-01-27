import { describe, expect, it } from 'vitest';
import { CONTRACT_REGISTRY } from '../registry';
import { getContractId } from '../config';

const EXPECTED_CONTRACT_ID =
  'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA.u64bxr-v9-2-14';

describe('contract registry', () => {
  it('loads the default registry entry', () => {
    expect(CONTRACT_REGISTRY.length).toBeGreaterThan(0);
    const entry = CONTRACT_REGISTRY[0];
    expect(getContractId(entry)).toBe(EXPECTED_CONTRACT_ID);
    expect(entry.network).toBe('testnet');
    expect(entry.protocolVersion).toBe('9.2.14');
  });

  it('includes the xStrata-v1-0-5 entry', () => {
    const entry = CONTRACT_REGISTRY.find(
      (item) => item.contractName === 'xStrata-v1-0-5'
    );
    expect(entry).toBeDefined();
    expect(entry?.address).toBe('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA');
    expect(entry?.network).toBe('testnet');
    expect(entry?.protocolVersion).toBe('1.0.5');
  });

  it('includes the xtrata-v1-1-0 entry', () => {
    const entry = CONTRACT_REGISTRY.find(
      (item) => item.contractName === 'xtrata-v1-1-0'
    );
    expect(entry).toBeDefined();
    expect(entry?.address).toBe('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA');
    expect(entry?.network).toBe('testnet');
    expect(entry?.protocolVersion).toBe('1.1.0');
  });
});

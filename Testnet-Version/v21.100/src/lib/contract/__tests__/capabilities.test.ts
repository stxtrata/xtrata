import { describe, expect, it } from 'vitest';
import { resolveContractCapabilities } from '../capabilities';

describe('contract capabilities', () => {
  it('resolves explicit v1.0.5 capabilities', () => {
    const capabilities = resolveContractCapabilities({ protocolVersion: '1.0.5' });
    expect(capabilities.version).toBe('1.0.5');
    expect(capabilities.feeModel).toBe('fee-unit');
    expect(capabilities.supportsPause).toBe(true);
    expect(capabilities.supportsAdminReadOnly).toBe(true);
    expect(capabilities.supportsNextTokenId).toBe(true);
    expect(capabilities.supportsChunkBatchRead).toBe(true);
  });

  it('resolves explicit v1.1.0 capabilities', () => {
    const capabilities = resolveContractCapabilities({ protocolVersion: '1.1.0' });
    expect(capabilities.version).toBe('1.1.0');
    expect(capabilities.feeModel).toBe('fee-unit');
    expect(capabilities.supportsPause).toBe(true);
    expect(capabilities.supportsAdminReadOnly).toBe(true);
    expect(capabilities.supportsNextTokenId).toBe(true);
    expect(capabilities.supportsChunkBatchRead).toBe(true);
  });

  it('infers v1.0.5 from contract name', () => {
    const capabilities = resolveContractCapabilities({
      contractName: 'xStrata-v1-0-5'
    });
    expect(capabilities.version).toBe('1.0.5');
  });

  it('infers v1.1.0 from contract name', () => {
    const capabilities = resolveContractCapabilities({
      contractName: 'xtrata-v1-1-0'
    });
    expect(capabilities.version).toBe('1.1.0');
  });
});

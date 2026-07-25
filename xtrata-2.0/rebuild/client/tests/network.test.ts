import { describe, expect, it } from 'vitest';
import {
  assertPrincipalOnNetwork,
  formatContractId,
  parseContractId,
  principalNetwork,
  NETWORKS
} from '../src/network.js';
import { XtrataClientError } from '../src/errors.js';

const MAIN = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const TEST = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

describe('network config', () => {
  it('exposes descriptors for all three networks', () => {
    expect(NETWORKS.mainnet.principalPrefixes).toContain('SP');
    expect(NETWORKS.testnet.principalPrefixes).toContain('ST');
    expect(NETWORKS.devnet.coreApiUrl).toContain('localhost');
  });
});

describe('contract id parsing', () => {
  it('round-trips a contract id', () => {
    const id = parseContractId(`${MAIN}.xtrata-collection-v3`);
    expect(id).toEqual({ address: MAIN, name: 'xtrata-collection-v3' });
    expect(formatContractId(id)).toBe(`${MAIN}.xtrata-collection-v3`);
  });

  it('rejects malformed ids', () => {
    expect(() => parseContractId(MAIN)).toThrow(XtrataClientError);
    expect(() => parseContractId(`${MAIN}.`)).toThrow(XtrataClientError);
    expect(() => parseContractId('not-an-address.name')).toThrow(XtrataClientError);
    expect(() => parseContractId(`${MAIN}.UPPER CASE!`)).toThrow(XtrataClientError);
  });
});

describe('principal network guard', () => {
  it('classifies principal prefixes', () => {
    expect(principalNetwork(MAIN)).toBe('mainnet');
    expect(principalNetwork(TEST)).toBe('testnet');
    expect(principalNetwork(`${TEST}.contract`)).toBe('testnet');
    expect(() => principalNetwork('XX123')).toThrow(XtrataClientError);
  });

  it('accepts matching networks and throws normalized wrong-network errors', () => {
    expect(() => assertPrincipalOnNetwork(MAIN, 'mainnet')).not.toThrow();
    expect(() => assertPrincipalOnNetwork(TEST, 'testnet')).not.toThrow();
    expect(() => assertPrincipalOnNetwork(TEST, 'devnet')).not.toThrow();
    try {
      assertPrincipalOnNetwork(TEST, 'mainnet');
      expect.unreachable();
    } catch (e) {
      const err = e as XtrataClientError;
      expect(err.code).toBe('plan-invalid');
      expect(err.message).toContain('wrong network');
      expect(err.detail).toMatchObject({ network: 'mainnet', principalFamily: 'testnet' });
    }
    expect(() => assertPrincipalOnNetwork(MAIN, 'testnet')).toThrow(/wrong network/);
  });
});

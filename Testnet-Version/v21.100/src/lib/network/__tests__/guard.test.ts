import { describe, expect, it } from 'vitest';
import {
  getNetworkFromAddress,
  getNetworkMismatch,
  isNetworkMatch
} from '../guard';

describe('network guard', () => {
  it('detects network from address prefix', () => {
    expect(getNetworkFromAddress('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA')).toBe('testnet');
    expect(getNetworkFromAddress('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B')).toBe('mainnet');
    expect(getNetworkFromAddress('SN2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B')).toBe('testnet');
    expect(getNetworkFromAddress('SM2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B')).toBe('mainnet');
  });

  it('detects network from contract principal', () => {
    expect(getNetworkFromAddress('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA.u64bxr-v9-2-14')).toBe('testnet');
  });

  it('reports network mismatch', () => {
    expect(isNetworkMatch('testnet', 'testnet')).toBe(true);
    expect(isNetworkMatch('testnet', 'mainnet')).toBe(false);
    expect(getNetworkMismatch('testnet', 'mainnet')).toEqual({
      expected: 'testnet',
      actual: 'mainnet'
    });
    expect(getNetworkMismatch('testnet', 'testnet')).toBeNull();
  });
});

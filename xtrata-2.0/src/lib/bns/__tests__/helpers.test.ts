import { describe, expect, it } from 'vitest';
import {
  buildBnsCacheKey,
  normalizeBnsName,
  pickPrimaryBnsName,
  sortBnsNames
} from '../helpers';

describe('bns helpers', () => {
  it('normalizes bns names', () => {
    expect(normalizeBnsName(' Alice.BTC ')).toBe('alice.btc');
    expect(normalizeBnsName('sub.Name.btc')).toBe('sub.name.btc');
    expect(normalizeBnsName('invalid')).toBeNull();
    expect(normalizeBnsName('')).toBeNull();
  });

  it('sorts bns names with btc priority', () => {
    expect(
      sortBnsNames(['Bob.id', 'alice.btc', 'zeta.btc', 'alice.btc'])
    ).toEqual(['alice.btc', 'zeta.btc', 'bob.id']);
  });

  it('builds cache keys consistently', () => {
    expect(
      buildBnsCacheKey({
        network: 'mainnet',
        kind: 'address',
        value: ' SP123 '
      })
    ).toBe('xtrata.bns.v5.mainnet.address.sp123');
  });

  it('picks primary name with btc preference', () => {
    expect(pickPrimaryBnsName(['bob.id', 'alice.btc'], 'bob.id')).toBe(
      'alice.btc'
    );
    expect(pickPrimaryBnsName([], 'carol.id')).toBe('carol.id');
  });

  it('prefers the on-chain primary over the btc heuristic', () => {
    expect(
      pickPrimaryBnsName(['aaa.btc', 'zed.btc'], null, 'zed.btc')
    ).toBe('zed.btc');
  });

  it('honours a non-btc on-chain primary', () => {
    expect(
      pickPrimaryBnsName(['alice.btc', 'jim.boom'], null, 'jim.boom')
    ).toBe('jim.boom');
  });

  it('ignores an unusable on-chain primary', () => {
    expect(pickPrimaryBnsName(['alice.btc'], null, 'not-a-name')).toBe(
      'alice.btc'
    );
    expect(pickPrimaryBnsName(['alice.btc'], null, null)).toBe('alice.btc');
  });
});

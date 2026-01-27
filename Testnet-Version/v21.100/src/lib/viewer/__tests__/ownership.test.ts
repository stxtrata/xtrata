import { describe, expect, it } from 'vitest';
import { filterTokensByOwner } from '../ownership';
import type { TokenSummary } from '../types';

const tokens: TokenSummary[] = [
  {
    id: 1n,
    owner: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
    tokenUri: null,
    meta: null,
    svgDataUri: null
  },
  {
    id: 2n,
    owner: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
    tokenUri: null,
    meta: null,
    svgDataUri: null
  }
];

describe('filterTokensByOwner', () => {
  it('filters tokens by owner (case-insensitive)', () => {
    const result = filterTokensByOwner(
      tokens,
      'st10w2eem757922qtvdzz5csew55jefnn33v2e7ya'
    );
    expect(result.map((token) => token.id)).toEqual([1n]);
  });

  it('returns empty when no owner provided', () => {
    expect(filterTokensByOwner(tokens, null)).toEqual([]);
  });
});

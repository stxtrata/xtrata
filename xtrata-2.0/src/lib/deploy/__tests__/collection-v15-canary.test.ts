import {describe, expect, it} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {COLLECTION_V15_CORE, inspectCollectionV15Source, inspectCollectionV15State} from '../collection-v15-canary';
describe('collection deployment gates', () => {
  it('pins actual mainnet source and rejects changes', () => {
    const source = readFileSync('contracts/live/xtrata-collection-mint-v1.5.clar', 'utf8');
    expect(inspectCollectionV15Source(source, createHash('sha256').update(source).digest('hex'))).toEqual([]);
    expect(inspectCollectionV15Source(source, 'wrong')).not.toEqual([]);
  });
  it('checks state invariants and fails closed on bad reads', () => {
    const ok = (value: unknown) => ({success:true,value:{value}});
    const reads = {'get-locked-core-contract':ok(COLLECTION_V15_CORE),'get-max-small-mint-chunks':ok('30'),'get-minted-count':ok('0'),'get-reserved-count':ok('0'),'get-max-supply':ok('0'),'get-minted-index-count':ok('0')};
    expect(inspectCollectionV15State(reads)).toEqual([]);
    expect(inspectCollectionV15State({...reads,'get-reserved-count':ok('1')})).toContain('Minted plus reserved exceeds maximum supply.');
    expect(() => inspectCollectionV15State({})).toThrow();
  });
});

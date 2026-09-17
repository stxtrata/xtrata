import {describe, expect, it} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {COLLECTION_V16_CORE, inspectCollectionV16Source, inspectCollectionV16State} from '../collection-v16-canary';
describe('collection deployment gates', () => {
  it('pins actual mainnet source and rejects changes', () => {
    const source = readFileSync('contracts/live/xtrata-collection-mint-v1.6.clar', 'utf8');
    expect(inspectCollectionV16Source(source, createHash('sha256').update(source).digest('hex'))).toEqual([]);
    expect(inspectCollectionV16Source(source, 'wrong')).not.toEqual([]);
  });
  it('checks state invariants and fails closed on bad reads', () => {
    const ok = (value: unknown) => ({success:true,value:{value}});
    const reads = {'get-locked-core-contract':ok(COLLECTION_V16_CORE),'get-max-small-mint-chunks':ok('32'),'get-minted-count':ok('0'),'get-reserved-count':ok('0'),'get-max-supply':ok('0'),'get-minted-index-count':ok('0')};
    expect(inspectCollectionV16State(reads)).toEqual([]);
    expect(inspectCollectionV16State({...reads,'get-reserved-count':ok('1')})).toContain('Minted plus reserved exceeds maximum supply.');
    expect(() => inspectCollectionV16State({})).toThrow();
  });
});

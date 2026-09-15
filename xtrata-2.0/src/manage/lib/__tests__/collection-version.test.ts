import { expect, it } from 'vitest';
import { isCurrentCollection } from '../collection-version';
it('separates v1.5 pinned to v3.2.3 from legacy and unknown templates',()=>{
 expect(isCurrentCollection({metadata:{templateVersion:'xtrata-collection-mint-v1.5',coreContractId:'SP.test.xtrata-v3-2-3'}})).toBe(true);
 expect(isCurrentCollection({metadata:{templateVersion:'xtrata-collection-mint-v1.4'}})).toBe(false);
 expect(isCurrentCollection({})).toBe(false);
 expect(isCurrentCollection({metadata:{templateVersion:'xtrata-collection-mint-v1.5',coreContractId:'SP.xtrata-v2-1-0'}})).toBe(false);
});

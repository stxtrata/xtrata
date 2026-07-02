import { describe, expect, it } from 'vitest';
import {
  PARENT_CHILD_NAMESPACE_SUFFIX,
  loadChildIndexCursor,
  loadIndexedChildren,
  parentChildNamespace,
  recordChildParents
} from '../parent-child-index';

describe('parent-child index', () => {
  it('namespaces the contract id for the parents edge', () => {
    expect(parentChildNamespace('SP123.contract')).toBe(
      `SP123.contract${PARENT_CHILD_NAMESPACE_SUFFIX}`
    );
    // The namespace must differ from the bare contract id so the parents
    // reverse-index never collides with the dependencies index.
    expect(parentChildNamespace('SP123.contract')).not.toBe('SP123.contract');
  });

  it('returns empty/default values when indexeddb is unavailable', async () => {
    const children = await loadIndexedChildren({
      contractId: 'SP123.contract',
      parentId: 1n
    });
    const cursor = await loadChildIndexCursor('SP123.contract');
    expect(children).toEqual([]);
    expect(cursor).toBe(0n);
  });

  it('noops writes when indexeddb is unavailable', async () => {
    await expect(
      recordChildParents({
        contractId: 'SP123.contract',
        childId: 9n,
        parentIds: [1n, 2n]
      })
    ).resolves.toBeUndefined();
  });
});

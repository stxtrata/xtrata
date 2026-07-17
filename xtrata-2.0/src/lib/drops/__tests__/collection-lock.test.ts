import { describe, expect, it } from 'vitest';
import {
  DROPS_COLLECTION_LOCKS,
  getDropsCollectionLockForDrop
} from '../collection-lock';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-0';
const CREATOR = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

describe('drops collection locks', () => {
  it('groups the current Dropped batch into one address-level claim lock', () => {
    const lock = DROPS_COLLECTION_LOCKS.find((entry) => entry.id === 'dropped-2026-07');
    expect(lock?.dropIds).toContain(20n);
    expect(lock?.dropIds).toContain(32n);
    expect(lock?.groupIds).toContain(1784123404089065n);
    expect(lock?.groupIds).toContain(1784126230500069n);
    expect(lock?.groupIds.length).toBe(lock?.dropIds.length);
  });

  it('matches by contract, creator, drop id, or group id', () => {
    expect(getDropsCollectionLockForDrop({
      contractId: CONTRACT,
      creator: CREATOR,
      dropId: 32n
    })?.id).toBe('dropped-2026-07');

    expect(getDropsCollectionLockForDrop({
      contractId: CONTRACT,
      creator: CREATOR,
      groupId: 1784123404089065n
    })?.id).toBe('dropped-2026-07');

    expect(getDropsCollectionLockForDrop({
      contractId: CONTRACT,
      creator: 'SP000000000000000000002Q6VF78',
      dropId: 32n
    })).toBeNull();
  });
});

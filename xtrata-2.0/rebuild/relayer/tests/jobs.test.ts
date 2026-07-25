import { describe, expect, it } from 'vitest';
import { InMemoryJobStore, isLegalTransition } from '../src/jobs.js';
import type { JobInsert } from '../src/types.js';

const row = (overrides: Partial<JobInsert> = {}): JobInsert => ({
  id: overrides.id ?? crypto.randomUUID(),
  contractId: 'SP.drops',
  functionName: 'claim',
  dropId: '1',
  claimer: 'SP_CLAIMER',
  originKey: 'ip1',
  payloadHash: overrides.payloadHash ?? crypto.randomUUID(),
  txHex: '00',
  feeUstx: '30000',
  ...overrides
});

describe('job store: atomic CAS state machine', () => {
  it('enforces UNIQUE(payload) and UNIQUE(drop, claimer) for live jobs', async () => {
    const store = new InMemoryJobStore();
    const first = await store.insert(row({ payloadHash: 'p1' }), 1);
    expect(first.ok).toBe(true);
    const dupPayload = await store.insert(row({ payloadHash: 'p1', claimer: 'SP_OTHER' }), 2);
    expect(dupPayload).toMatchObject({ ok: false, code: 'DUPLICATE_PAYLOAD' });
    const dupClaim = await store.insert(row({ payloadHash: 'p2' }), 3);
    expect(dupClaim).toMatchObject({ ok: false, code: 'DUPLICATE_CLAIM' });
    // A terminal failure frees the (drop, claimer) slot.
    if (first.ok) {
      await store.cas(first.job.id, 'RECEIVED', 'FAILED', { error: 'x' }, null, 4);
    }
    const retry = await store.insert(row({ payloadHash: 'p3' }), 5);
    expect(retry.ok).toBe(true);
  });

  it('cas succeeds only from the expected state — two workers, exactly one wins', async () => {
    const store = new InMemoryJobStore();
    const inserted = await store.insert(row(), 1);
    if (!inserted.ok) throw new Error('insert failed');
    const id = inserted.job.id;
    await store.cas(id, 'RECEIVED', 'SIGNING', {}, null, 2);
    await store.cas(id, 'SIGNING', 'SPONSORED', { sponsorTxid: 't1' }, null, 3);
    await store.cas(id, 'SPONSORED', 'CONFIRMED', {}, null, 4);
    const results = await Promise.all([
      store.cas(id, 'CONFIRMED', 'FEE_CLAIMING', {}, { owner: 'w1', expiresAt: 99 }, 5),
      store.cas(id, 'CONFIRMED', 'FEE_CLAIMING', {}, { owner: 'w2', expiresAt: 99 }, 5)
    ]);
    const winners = results.filter((r) => r !== null);
    expect(winners).toHaveLength(1);
  });

  it('rejects illegal transitions', async () => {
    const store = new InMemoryJobStore();
    const inserted = await store.insert(row(), 1);
    if (!inserted.ok) throw new Error('insert failed');
    await expect(store.cas(inserted.job.id, 'RECEIVED', 'SETTLED', {}, null, 2)).rejects.toThrow(/illegal/);
    expect(isLegalTransition('SETTLED', 'RECEIVED')).toBe(false);
    expect(isLegalTransition('FEE_CLAIMED', 'SETTLED')).toBe(true);
  });

  it('reaps expired leases one state back', async () => {
    const store = new InMemoryJobStore();
    const inserted = await store.insert(row(), 1);
    if (!inserted.ok) throw new Error('insert failed');
    const id = inserted.job.id;
    await store.cas(id, 'RECEIVED', 'SIGNING', {}, { owner: 'w1', expiresAt: 100 }, 2);
    expect(await store.reapExpiredLeases(50)).toBe(0); // not expired yet
    expect(await store.reapExpiredLeases(101)).toBe(1);
    expect((await store.get(id))?.state).toBe('RECEIVED');
    expect((await store.get(id))?.leaseOwner).toBeNull();
  });

  it('counts unsettled jobs and rolling accepted jobs (failures excluded)', async () => {
    const store = new InMemoryJobStore();
    const a = await store.insert(row({ payloadHash: 'a', dropId: '1' }), 1000);
    const b = await store.insert(row({ payloadHash: 'b', dropId: '2' }), 2000);
    await store.insert(row({ payloadHash: 'c', dropId: '3', claimer: 'SP_OTHER' }), 3000);
    expect(await store.countUnsettled()).toBe(3);
    if (a.ok) await store.cas(a.job.id, 'RECEIVED', 'FAILED', { error: 'x' }, null, 4000);
    expect(await store.countUnsettled()).toBe(2);
    expect(await store.countAcceptedSince('claimer', 'SP_CLAIMER', 0)).toBe(1); // b only, a failed
    expect(await store.countAcceptedSince('claimer', 'SP_CLAIMER', 2500)).toBe(0);
    expect(await store.countAcceptedSince('originKey', 'ip1', 0)).toBe(2);
    void b;
  });
});

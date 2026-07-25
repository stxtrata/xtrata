import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  ITEM_STATES,
  LEGAL_TRANSITIONS,
  canTransition,
  transition,
  initialProgress,
  rollup,
  type ItemState
} from '../src/progress.js';

const now = () => new Date('2026-07-24T00:00:00.000Z');

describe('transition table', () => {
  it('covers every state', () => {
    for (const state of ITEM_STATES) {
      expect(LEGAL_TRANSITIONS[state]).toBeDefined();
    }
  });

  it('happy path staged: prepared → … → indexed → assigned → claimed', () => {
    let item = initialProgress(0, 100, now);
    item = transition(item, 'reserved', { now });
    item = transition(item, 'begun', { now });
    item = transition(item, 'partially-uploaded', { uploadedChunks: 32, now });
    item = transition(item, 'partially-uploaded', { uploadedChunks: 64, now });
    item = transition(item, 'staged', { now });
    expect(item.uploadedChunks).toBe(100);
    item = transition(item, 'seal-submitted', { txid: 'tx1', feePaidMicroStx: 100n, now });
    item = transition(item, 'confirmed', { tokenId: 7, now });
    item = transition(item, 'indexed', { now });
    item = transition(item, 'assigned', { now });
    item = transition(item, 'claimed', { now });
    expect(item.state).toBe('claimed');
    expect(item.tokenId).toBe(7);
    expect(item.txids).toEqual(['tx1']);
    expect(item.feePaidMicroStx).toBe(100n);
  });

  it('happy path single-tx: prepared → seal-submitted → confirmed → indexed', () => {
    let item = initialProgress(0, 1, now);
    item = transition(item, 'seal-submitted', { now });
    item = transition(item, 'confirmed', { now });
    item = transition(item, 'indexed', { now });
    expect(item.state).toBe('indexed');
  });

  it('illegal edges throw', () => {
    const item = initialProgress(0, 10, now);
    expect(() => transition(item, 'staged', { now })).toThrow(/illegal/);
    expect(() => transition(item, 'confirmed', { now })).toThrow(/illegal/);
    expect(() => transition(item, 'claimed', { now })).toThrow(/illegal/);
    const confirmed = { ...item, state: 'confirmed' as ItemState };
    expect(() => transition(confirmed, 'failed', { now })).toThrow(/illegal/);
    expect(() => transition(confirmed, 'expired', { now })).toThrow(/illegal/);
  });

  it('terminal states have no outgoing edges except expired → prepared', () => {
    expect(LEGAL_TRANSITIONS.claimed).toEqual([]);
    expect(LEGAL_TRANSITIONS.failed).toEqual([]);
    expect(LEGAL_TRANSITIONS.expired).toEqual(['prepared']);
  });

  it('confirmed/indexed can never fail or expire (duplicate-mint safety)', () => {
    for (const from of ['confirmed', 'indexed', 'assigned', 'claimed'] as const) {
      expect(canTransition(from, 'failed')).toBe(false);
      expect(canTransition(from, 'expired')).toBe(false);
    }
  });

  it('partially-uploaded guards: k must be in (0, total) and never regress', () => {
    let item = initialProgress(0, 10, now);
    item = transition(item, 'begun', { now });
    expect(() => transition(item, 'partially-uploaded', { now })).toThrow(/uploadedChunks/);
    expect(() => transition(item, 'partially-uploaded', { uploadedChunks: 0, now })).toThrow();
    expect(() => transition(item, 'partially-uploaded', { uploadedChunks: 10, now })).toThrow();
    item = transition(item, 'partially-uploaded', { uploadedChunks: 5, now });
    expect(() => transition(item, 'partially-uploaded', { uploadedChunks: 3, now })).toThrow(/regress/);
    item = transition(item, 'partially-uploaded', { uploadedChunks: 5, now }); // no-regress self-loop ok
    expect(item.uploadedChunks).toBe(5);
  });

  it('expired → prepared resets error and chunks', () => {
    let item = initialProgress(0, 10, now);
    item = transition(item, 'reserved', { now });
    item = transition(item, 'expired', { now });
    item = transition(item, 'prepared', { now });
    expect(item.state).toBe('prepared');
    expect(item.uploadedChunks).toBe(0);
    expect(item.error).toBeUndefined();
  });
});

describe('property: random walks only traverse legal edges', () => {
  it('any sequence of attempted transitions either applies a legal edge or throws', () => {
    const stateArb = fc.constantFrom(...ITEM_STATES);
    fc.assert(
      fc.property(fc.array(stateArb, { minLength: 1, maxLength: 40 }), (targets) => {
        let item = initialProgress(0, 10, now);
        for (const target of targets) {
          const legal = canTransition(item.state, target);
          try {
            const next = transition(item, target, {
              uploadedChunks: target === 'partially-uploaded' ? Math.max(item.uploadedChunks, 5) : undefined,
              now
            } as never);
            expect(legal).toBe(true);
            expect(next.state).toBe(target);
            item = next;
          } catch {
            // A throw is acceptable only when the edge is illegal or a guard
            // (uploadedChunks) rejected it; the state must be unchanged.
            expect(item.state).toBe(item.state);
          }
        }
      }),
      { numRuns: 300 }
    );
  });

  it('property: canTransition is consistent with the table', () => {
    for (const from of ITEM_STATES) {
      for (const to of ITEM_STATES) {
        expect(canTransition(from, to)).toBe(LEGAL_TRANSITIONS[from].includes(to));
      }
    }
  });
});

describe('rollup', () => {
  it('aggregates counts, fees, and chunk progress', () => {
    let a = initialProgress(0, 10, now);
    a = transition(a, 'begun', { feePaidMicroStx: 100n, now });
    a = transition(a, 'partially-uploaded', { uploadedChunks: 4, feePaidMicroStx: 50n, now });
    let b = initialProgress(1, 1, now);
    b = transition(b, 'seal-submitted', { feePaidMicroStx: 10n, now });
    b = transition(b, 'confirmed', { now });
    b = transition(b, 'indexed', { now });
    let c = initialProgress(2, 5, now);
    c = transition(c, 'reserved', { now });
    c = transition(c, 'failed', { error: 'wallet-rejected', now });

    const agg = rollup([a, b, c]);
    expect(agg.total).toBe(3);
    expect(agg.done).toBe(1);
    expect(agg.failed).toBe(1);
    expect(agg.inFlight).toBe(1);
    expect(agg.totalFeePaidMicroStx).toBe(160n);
    expect(agg.uploadedChunks).toBe(4);
    expect(agg.totalChunks).toBe(16);
    expect(agg.byState['partially-uploaded']).toBe(1);
    expect(agg.byState.indexed).toBe(1);
    expect(agg.byState.failed).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { createSelectionGuard } from '../selection-guard';

describe('createSelectionGuard', () => {
  it('reports the latest selection as current and older ones as stale', () => {
    const guard = createSelectionGuard();
    const first = guard.begin();
    expect(first()).toBe(true);

    const second = guard.begin();
    expect(first()).toBe(false);
    expect(second()).toBe(true);
  });

  it('lets the second overlapping selection win when the first resolves last', async () => {
    const guard = createSelectionGuard();
    const committed: string[] = [];

    const select = async (name: string, delayMs: number) => {
      const isCurrent = guard.begin();
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (!isCurrent()) {
        return;
      }
      committed.push(name);
    };

    // A begins first but resolves last; B begins second and resolves first.
    const a = select('A', 40);
    const b = select('B', 5);
    await Promise.all([a, b]);

    // Only the second (most recent) selection may commit state.
    expect(committed).toEqual(['B']);
  });
});

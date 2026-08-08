// The short track, and the promise it makes.
//
// It exists because the twenty-six step page answers a question nobody is
// asking any more. That one asks "is this safe to launch forever", which is
// right when a board and a contract are being fixed in place together. This one
// asks "will these bytes work once inscribed", against a contract already
// deployed and proven - and a board, unlike a contract, is REPLACEABLE.
//
// What must not happen is the short track quietly dropping something that is
// permanent. These hold the line between the two.

import { describe, expect, it } from 'vitest';
import { INSCRIBE_STEPS, PHASE_TITLES, STEPS } from '../../packages/ui/gates.js';

describe('the short track', () => {
  it('is short enough to run in one sitting', () => {
    expect(INSCRIBE_STEPS.length).toBeLessThanOrEqual(8);
    expect(STEPS.length).toBeGreaterThan(20);
  });

  it('reaches an inscription, and then proves it can be PLAYED', () => {
    // Reading proves the bytes survived. Only signing proves the bridge, and
    // the bridge is the thing that cannot be rehearsed anywhere else.
    const ids = INSCRIBE_STEPS.map((s) => s.id);
    expect(ids).toContain('inscribe-canary');
    expect(ids[ids.length - 1]).toBe('launch-verified');
  });

  it('rehearses under the runtime BEFORE anything is spent', () => {
    // The step that earns the money: double boot, missing bridge and an
    // unreachable API are all invisible until they are permanent.
    const ids = INSCRIBE_STEPS.map((s) => s.id);
    expect(ids).toContain('rehearsal');
    expect(ids.indexOf('rehearsal')).toBeLessThan(ids.indexOf('inscribe-canary'));
  });

  it('marks exactly the steps that spend or cannot be undone', () => {
    const irreversible = INSCRIBE_STEPS.filter((s) => s.irreversible).map((s) => s.id);
    expect(irreversible).toEqual(['inscribe-canary', 'launch-verified']);
  });

  it('runs in order, with nothing depending on a step that is not there', () => {
    const seen = new Set<string>();
    for (const step of INSCRIBE_STEPS) {
      for (const need of step.needs) {
        expect(seen, `${step.id} needs ${need}, which comes later or not at all`).toContain(need);
      }
      seen.add(step.id);
    }
  });

  it('reuses handlers the full track already has, apart from the rehearsal', () => {
    // A second implementation of "connect a wallet" is a second thing to get
    // wrong. Only the rehearsal is new.
    const full = new Set(STEPS.map((s) => s.id));
    const novel = INSCRIBE_STEPS.map((s) => s.id).filter((id) => !full.has(id));
    expect(novel).toEqual(['rehearsal']);
  });

  it('names its own phases rather than borrowing ones it is not running', () => {
    for (const step of INSCRIBE_STEPS) {
      expect(PHASE_TITLES[step.phase], `no title for phase ${step.phase}`).toBeTruthy();
    }
    expect(new Set(INSCRIBE_STEPS.map((s) => s.phase))).toEqual(
      new Set(['before', 'inscribe', 'after'])
    );
  });
});

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
    expect(ids).toContain('inscribe-board');
    expect(ids[ids.length - 1]).toBe('first-move');
  });

  it('does not call the board a canary', () => {
    // It borrowed the launch track's ids so the handlers would work without
    // duplication, and the labels came with them - so the page asked for a
    // "canary inscription id" when it wanted the board's, at the exact moment
    // somebody was about to spend money on it.
    for (const step of INSCRIBE_STEPS) {
      expect(step.id, `${step.id} still says canary`).not.toMatch(/canary/i);
    }
  });

  it('rehearses under the runtime BEFORE anything is spent', () => {
    // The step that earns the money: double boot, missing bridge and an
    // unreachable API are all invisible until they are permanent.
    const ids = INSCRIBE_STEPS.map((s) => s.id);
    expect(ids).toContain('rehearsal');
    expect(ids.indexOf('rehearsal')).toBeLessThan(ids.indexOf('inscribe-board'));
  });

  it('marks exactly the steps that spend or cannot be undone', () => {
    const irreversible = INSCRIBE_STEPS.filter((s) => s.irreversible).map((s) => s.id);
    expect(irreversible).toEqual(['inscribe-board', 'first-move']);
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

  it('reuses the full track\u2019s handlers wherever the question is the same', () => {
    // A second implementation of "connect a wallet" is a second thing to get
    // wrong, so the reading steps are shared. The four that are not shared each
    // exist because the WORDING had to differ, not the behaviour.
    const full = new Set(STEPS.map((s) => s.id));
    const novel = INSCRIBE_STEPS.map((s) => s.id).filter((id) => !full.has(id));
    expect(novel.sort()).toEqual(
      ['first-move', 'inscribe-board', 'inscription-live', 'rehearsal'].sort()
    );
  });

  it('sends the rehearsal to the FRAMED runtime', () => {
    // The plain harness is unframed, and an unframed inscription cannot sign at
    // all - so it rehearses everything except the half this step exists for.
    // Connect simply does nothing, which reads as a broken board.
    const rehearsal = INSCRIBE_STEPS.find((s) => s.id === 'rehearsal');
    expect(rehearsal?.why).toContain('serve:runtime:framed');
    expect(rehearsal?.why, 'must say why framed is not optional').toMatch(/cannot sign/i);
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

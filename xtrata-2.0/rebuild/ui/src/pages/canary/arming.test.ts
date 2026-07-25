import { describe, expect, it } from 'vitest';
import {
  armReducer,
  canArm,
  canConfirm,
  initialArmState,
  matchesPhrase,
  PRODUCTION_APPROVAL_PHRASE,
  type ArmState
} from './arming';

/**
 * The typed confirmation is the last thing between an operator and an
 * irreversible deploy, so the rule is tested as a rule: typing never arms,
 * arming needs an exact match, and any edit after arming disarms.
 */

const type = (state: ArmState, value: string, expected: string): ArmState =>
  armReducer(state, { type: 'type', value }, expected);

const arm = (state: ArmState, expected: string): ArmState =>
  armReducer(state, { type: 'arm' }, expected);

const PHRASE = 'xtrata-drops-v3';

describe('matchesPhrase', () => {
  it('is exact — no trimming, no case folding', () => {
    expect(matchesPhrase(PHRASE, PHRASE)).toBe(true);
    expect(matchesPhrase(PHRASE, ` ${PHRASE}`)).toBe(false);
    expect(matchesPhrase(PHRASE, `${PHRASE} `)).toBe(false);
    expect(matchesPhrase(PHRASE, PHRASE.toUpperCase())).toBe(false);
  });

  it('never matches an empty expectation', () => {
    expect(matchesPhrase('', '')).toBe(false);
  });
});

describe('arming', () => {
  it('does not arm from typing alone, even with the exact phrase', () => {
    const state = type(initialArmState(), PHRASE, PHRASE);
    expect(state.armed).toBe(false);
    expect(canArm(state, PHRASE)).toBe(true);
    expect(canConfirm(state, PHRASE)).toBe(false);
  });

  it('refuses to arm on wrong text', () => {
    for (const wrong of ['xtrata-drops-v2', 'XTRATA-DROPS-V3', ' xtrata-drops-v3', '']) {
      const typed = type(initialArmState(), wrong, PHRASE);
      expect(canArm(typed, PHRASE)).toBe(false);
      expect(arm(typed, PHRASE).armed).toBe(false);
    }
  });

  it('arms on an explicit arm action over exactly-matching text', () => {
    const state = arm(type(initialArmState(), PHRASE, PHRASE), PHRASE);
    expect(state.armed).toBe(true);
    expect(canConfirm(state, PHRASE)).toBe(true);
    // Already armed: the arm control goes inert rather than re-arming.
    expect(canArm(state, PHRASE)).toBe(false);
  });

  it('disarms on any input change', () => {
    const armed = arm(type(initialArmState(), PHRASE, PHRASE), PHRASE);
    const edited = type(armed, `${PHRASE}x`, PHRASE);
    expect(edited.armed).toBe(false);
    expect(canConfirm(edited, PHRASE)).toBe(false);
  });

  it('disarms even when the edit lands back on the exact phrase', () => {
    // Arming is an act, not a property of the text: retyping the same string
    // must not silently re-arm a confirmation the operator already changed.
    const armed = arm(type(initialArmState(), PHRASE, PHRASE), PHRASE);
    const retyped = type(armed, PHRASE, PHRASE);
    expect(retyped.armed).toBe(false);
    expect(canConfirm(retyped, PHRASE)).toBe(false);
  });

  it('resets to the initial state', () => {
    const armed = arm(type(initialArmState(), PHRASE, PHRASE), PHRASE);
    expect(armReducer(armed, { type: 'reset' }, PHRASE)).toEqual(initialArmState());
  });

  it('does not confirm when the phrase changed underneath an armed state', () => {
    // A card re-rendered for a different contract must not inherit arming.
    const armed = arm(type(initialArmState(), PHRASE, PHRASE), PHRASE);
    expect(canConfirm(armed, 'xtrata-canary-collection')).toBe(false);
  });
});

describe('production approval phrase', () => {
  it('is long enough not to be typed by reflex', () => {
    expect(PRODUCTION_APPROVAL_PHRASE.length).toBeGreaterThan(10);
    expect(PRODUCTION_APPROVAL_PHRASE).toBe('DEPLOY TO MAINNET');
  });
});

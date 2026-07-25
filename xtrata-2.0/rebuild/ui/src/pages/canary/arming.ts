/**
 * Typed confirmation.
 *
 * Two deliberate steps stand between an operator and an irreversible deploy:
 * type the exact contract name (or approval phrase) to ARM, then click a
 * separate CONFIRM control. Typing alone never fires anything, and any change
 * to the text after arming disarms again — so a confirm click can only ever
 * apply to text the operator is looking at right now.
 *
 * Modelled as a pure reducer so the rule is testable without a DOM, and so the
 * React component holding it cannot accidentally arm through some other path.
 */

export interface ArmState {
  /** What the operator has typed. */
  typed: string;
  /** True only after an explicit arm action on exactly-matching text. */
  armed: boolean;
}

export type ArmAction =
  | { type: 'type'; value: string }
  | { type: 'arm' }
  | { type: 'reset' };

export const initialArmState = (): ArmState => ({ typed: '', armed: false });

/** Exact match, no trimming and no case folding: the phrase or nothing. */
export const matchesPhrase = (expected: string, typed: string): boolean =>
  expected.length > 0 && typed === expected;

export const armReducer = (state: ArmState, action: ArmAction, expected: string): ArmState => {
  switch (action.type) {
    case 'type':
      // Any edit disarms, including an edit that lands back on the phrase:
      // arming is an explicit act, never a side effect of typing.
      return { typed: action.value, armed: false };
    case 'arm':
      return matchesPhrase(expected, state.typed) ? { ...state, armed: true } : { ...state, armed: false };
    case 'reset':
      return initialArmState();
  }
};

/** May the ARM control be pressed? */
export const canArm = (state: ArmState, expected: string): boolean =>
  !state.armed && matchesPhrase(expected, state.typed);

/** May the CONFIRM control be pressed? */
export const canConfirm = (state: ArmState, expected: string): boolean =>
  state.armed && matchesPhrase(expected, state.typed);

/**
 * The production approval phrase for stage 12. Long and specific on purpose:
 * it should be impossible to type by reflex.
 */
export const PRODUCTION_APPROVAL_PHRASE = 'DEPLOY TO MAINNET';

/**
 * Stage 12's acknowledgment. Deployed Clarity contracts are immutable — there
 * is no upgrade, only a new versioned name plus an application routing change
 * (architecture §9).
 */
export const IMMUTABILITY_ACKNOWLEDGMENT =
  'I understand that a deployed Clarity contract CANNOT be overwritten or upgraded. ' +
  'Recovery from a bad mainnet deployment requires deploying a new contract version ' +
  'under a new name and changing the application and relayer routing to point at it.';

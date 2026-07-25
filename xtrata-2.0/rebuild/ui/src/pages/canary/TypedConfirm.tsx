import { useId, useReducer, type ReactNode } from 'react';
import { armReducer, canArm, canConfirm, initialArmState, type ArmAction, type ArmState } from './arming';
import type { EvidenceEntry } from './store';

/**
 * Two-step typed confirmation.
 *
 * Type the exact phrase → ARM → CONFIRM. The arming state lives in the pure
 * reducer from `arming.ts`, so the component has no way to reach an armed state
 * except through the rule the tests hold. Editing the text after arming
 * disarms, which is why the confirm control is bound to `canConfirm(state)` and
 * not to a local boolean.
 */

export const TypedConfirm = ({
  title,
  phrase,
  details,
  irreversible,
  confirmLabel,
  onConfirm,
  onCancel,
  children
}: {
  title: string;
  phrase: string;
  details: EvidenceEntry[];
  irreversible: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}): JSX.Element => {
  const inputId = useId();
  const [state, dispatch] = useReducer(
    (current: ArmState, action: ArmAction) => armReducer(current, action, phrase),
    undefined,
    initialArmState
  );

  return (
    <div
      className={`canary-confirm${irreversible ? ' canary-confirm--irreversible' : ''}`}
      role="group"
      aria-label={title}
    >
      <strong>{title}</strong>
      {irreversible ? (
        <p className="canary-confirm__warning">
          Irreversible. A deployed Clarity contract cannot be overwritten — recovery means a new
          contract version under a new name plus an application routing change.
        </p>
      ) : null}
      <dl className="canary-evidence">
        {details.map((entry) => (
          <div key={`${entry.label}:${entry.value}`}>
            <dt>{entry.label}</dt>
            <dd className={entry.tone ? `tone--${entry.tone}` : undefined}>{entry.value}</dd>
          </div>
        ))}
      </dl>
      {children}
      <div className="field">
        <label htmlFor={inputId}>
          Type <code className="mono">{phrase}</code> to arm
        </label>
        <input
          id={inputId}
          className="mono"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={state.typed}
          onChange={(event) => dispatch({ type: 'type', value: event.target.value })}
        />
      </div>
      <div className="row">
        <button
          type="button"
          className="btn"
          disabled={!canArm(state, phrase)}
          onClick={() => dispatch({ type: 'arm' })}
        >
          {state.armed ? 'Armed' : 'Arm'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          disabled={!canConfirm(state, phrase)}
          onClick={onConfirm}
        >
          {confirmLabel ?? 'Confirm'}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      <p className="canary-confirm__state" aria-live="polite">
        {state.armed ? 'Armed — confirm to proceed.' : 'Not armed.'}
      </p>
    </div>
  );
};

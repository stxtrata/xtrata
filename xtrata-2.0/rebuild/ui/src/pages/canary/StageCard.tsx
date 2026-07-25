import type { ReactNode } from 'react';
import { ATTESTED_COMMANDS, type StageDefinition, type StageStatus } from './stages';
import type { StageState } from './store';

/**
 * One gated stage card.
 *
 * Presentational: it renders status, the gate, the evidence and whatever
 * controls the page hands it. Everything about WHETHER a stage may run comes in
 * as `gate` from the store — the card never decides.
 */

export const STATUS_LABEL: Record<StageStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped'
};

export const STATUS_TONE: Record<StageStatus, string> = {
  pending: 'pending',
  running: 'active',
  passed: 'done',
  failed: 'bad',
  skipped: 'stale'
};

export const VERIFICATION_LABEL = {
  machine: 'Machine-verified',
  attested: 'Operator-attested — NOT machine-verified',
  'operator-review': 'Operator review'
} as const;

export const StageBadge = ({ status }: { status: StageStatus }): JSX.Element => (
  <span className={`state state--${STATUS_TONE[status]}`} data-status={status}>
    {STATUS_LABEL[status]}
  </span>
);

export const StageCard = ({
  definition,
  stage,
  gate,
  children
}: {
  definition: StageDefinition;
  stage: StageState;
  gate: { open: boolean; reason?: string };
  children?: ReactNode;
}): JSX.Element => {
  const commands = ATTESTED_COMMANDS[definition.id];
  return (
    <section
      className={`card canary-stage canary-stage--${stage.status}`}
      data-stage={definition.id}
      data-status={stage.status}
      aria-labelledby={`stage-${definition.id}-title`}
    >
      <div className="spread canary-stage__head">
        <h2 id={`stage-${definition.id}-title`}>
          {definition.number}. {definition.title}
        </h2>
        <StageBadge status={stage.status} />
      </div>

      <p className="canary-stage__summary">{definition.summary}</p>

      <p
        className={`canary-stage__verification${
          definition.verification === 'attested' ? ' canary-stage__verification--attested' : ''
        }`}
      >
        {VERIFICATION_LABEL[definition.verification]}
        {definition.requiredNetwork ? ` · requires a ${definition.requiredNetwork} account` : ''}
        {definition.irreversible ? ' · irreversible' : ''}
      </p>

      {commands ? (
        <pre className="canary-commands mono" aria-label={`Commands for stage ${definition.number}`}>
          {commands.join('\n')}
        </pre>
      ) : null}

      {!gate.open ? (
        <p className="canary-stage__gate" role="status">
          Locked — {gate.reason ?? 'an earlier stage has not passed'}.
        </p>
      ) : null}

      {stage.error ? (
        <p className="canary-stage__error" role="alert">
          {stage.error}
        </p>
      ) : null}

      {stage.skipReason ? (
        <p className="canary-stage__skip">Skipped: {stage.skipReason}</p>
      ) : null}

      {stage.evidence.length > 0 ? (
        <dl className="canary-evidence" aria-label={`Evidence for stage ${definition.number}`}>
          {stage.evidence.map((entry, index) => (
            <div key={`${index}-${entry.label}`}>
              <dt>{entry.label}</dt>
              <dd className={entry.tone ? `tone--${entry.tone}` : undefined}>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children}
    </section>
  );
};

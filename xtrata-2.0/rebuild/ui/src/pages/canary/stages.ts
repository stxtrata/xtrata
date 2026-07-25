import type { NetworkType } from '../../wallet/network';

/**
 * The 15 canary stages.
 *
 * Ordered and gated: stage N+1 cannot start until stage N has passed or been
 * explicitly skipped with a recorded reason. That ordering IS the mitigation
 * for threat 16 (partial deployment) — drops before collections, verification
 * before every state-changing canary, and application configuration dead last.
 *
 * `verification` is stated per stage and shown in the UI, because two of these
 * stages cannot be machine-verified from a browser: clarinet and the node test
 * suites do not run here, so the operator attests to their result and the
 * report records it AS an attestation rather than as evidence.
 */

export type StageId =
  | 'sources'
  | 'contract-tests'
  | 'source-parity'
  | 'client-tests'
  | 'testnet-deploy'
  | 'testnet-verify'
  | 'collection-canary'
  | 'inscription-canary'
  | 'drop-canary'
  | 'sponsored-claim-canary'
  | 'review'
  | 'production-approval'
  | 'production-deploy'
  | 'production-verify'
  | 'activation';

export type StageStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

/** How the stage's conclusion is established. */
export type StageVerification =
  /** The app performed the check itself and holds the evidence. */
  | 'machine'
  /** The operator ran something elsewhere and asserted the result. */
  | 'attested'
  /** A human judgement call recorded as such. */
  | 'operator-review';

export interface StageDefinition {
  id: StageId;
  /** 1-based, matches the deployment runbook. */
  number: number;
  title: string;
  summary: string;
  verification: StageVerification;
  /** Network this stage's chain work must run against, if any. */
  requiredNetwork?: NetworkType;
  /** True when the stage broadcasts something that cannot be undone. */
  irreversible: boolean;
  /** True when the stage may legitimately be skipped with a reason. */
  skippable: boolean;
}

export const STAGE_DEFINITIONS: readonly StageDefinition[] = [
  {
    id: 'sources',
    number: 1,
    title: 'Source and configuration validation',
    summary:
      'Load the bundled contract sources, substitute every template marker, and validate the deploy configuration — deployer, network, contract names and dependency principals.',
    verification: 'machine',
    irreversible: false,
    skippable: false
  },
  {
    id: 'contract-tests',
    number: 2,
    title: 'Clarinet checks and contract tests',
    summary:
      'Clarinet cannot run in a browser. Run the command below in a terminal, then paste its result — this stage is recorded as an operator attestation, not as machine-verified evidence.',
    verification: 'attested',
    irreversible: false,
    skippable: false
  },
  {
    id: 'source-parity',
    number: 3,
    title: 'Source-parity verification',
    summary:
      'SHA-256 of the exact bytes that will be deployed, recorded now so stages 6 and 14 can compare the chain against it rather than against a source rebuilt later.',
    verification: 'machine',
    irreversible: false,
    skippable: false
  },
  {
    id: 'client-tests',
    number: 4,
    title: 'Client and UI tests',
    summary:
      'The node test suites also run outside the browser. Run them and attest to the result; recorded as an attestation.',
    verification: 'attested',
    irreversible: false,
    skippable: false
  },
  {
    id: 'testnet-deploy',
    number: 5,
    title: 'Testnet contract deployment',
    summary:
      'Deploy in dependency order — the drops singleton first, then a canary collection pointing at it. Preflight refuses a name that is already occupied; each deploy needs its own typed confirmation.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: true,
    skippable: false
  },
  {
    id: 'testnet-verify',
    number: 6,
    title: 'On-chain source and interface verification',
    summary:
      'Fetch each deployed source, compare its SHA-256 against stage 3, probe the callable interface against the local source, and confirm the dependency principals baked into the deployed bytes are the intended ones.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: false,
    skippable: false
  },
  {
    id: 'collection-canary',
    number: 7,
    title: 'Small collection creation canary',
    summary:
      'Configure the freshly deployed canary collection through the real client path — the same transaction builders the Studio uses.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: true,
    skippable: false
  },
  {
    id: 'inscription-canary',
    number: 8,
    title: 'Small batch-inscription canary',
    summary:
      'Inscribe two small items through the real executor, proving reserve → begin → chunks → seal → index end to end.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: true,
    skippable: false
  },
  {
    id: 'drop-canary',
    number: 9,
    title: 'Drop creation and claim canary',
    summary:
      'Create a drop over the canary collection, select all unassigned inventory, escrow it, activate the drop and claim from the operator wallet.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: true,
    skippable: false
  },
  {
    id: 'sponsored-claim-canary',
    number: 10,
    title: 'Sponsored-claim canary',
    summary:
      'Exercise the relayer path (quote → submit → status) against the configured relayer. Skipped, with the reason recorded, when this build has no relayer configured.',
    verification: 'machine',
    requiredNetwork: 'testnet',
    irreversible: false,
    skippable: true
  },
  {
    id: 'review',
    number: 11,
    title: 'Monitoring and review',
    summary:
      'Everything observed so far, in one place, for the operator to read before any production step is offered.',
    verification: 'operator-review',
    irreversible: false,
    skippable: false
  },
  {
    id: 'production-approval',
    number: 12,
    title: 'Explicit production approval',
    summary:
      'The hard gate. A typed approval phrase plus an explicit acknowledgment that deployed Clarity contracts cannot be overwritten.',
    verification: 'operator-review',
    irreversible: false,
    skippable: false
  },
  {
    id: 'production-deploy',
    number: 13,
    title: 'Production deployment',
    summary:
      'Stage 5 again, on mainnet, with the network guard flipped and every typed confirmation required afresh.',
    verification: 'machine',
    requiredNetwork: 'mainnet',
    irreversible: true,
    skippable: false
  },
  {
    id: 'production-verify',
    number: 14,
    title: 'Post-deployment verification',
    summary: 'Stage 6 again, against mainnet: source parity, interface probe and dependency principals.',
    verification: 'machine',
    requiredNetwork: 'mainnet',
    irreversible: false,
    skippable: false
  },
  {
    id: 'activation',
    number: 15,
    title: 'Application configuration activation',
    summary:
      'Emit the contract ids per network for the app build and the relayer allowlist. Explicitly the last step — nothing points at these contracts until this stage runs.',
    verification: 'machine',
    irreversible: false,
    skippable: false
  }
];

export const STAGE_IDS: readonly StageId[] = STAGE_DEFINITIONS.map((stage) => stage.id);

export const stageDefinition = (id: StageId): StageDefinition => {
  const found = STAGE_DEFINITIONS.find((stage) => stage.id === id);
  if (!found) throw new Error(`unknown canary stage: ${String(id)}`);
  return found;
};

export const stageIndex = (id: StageId): number => STAGE_IDS.indexOf(id);

/** A stage is settled when it will not block the next one. */
export const isSettled = (status: StageStatus): boolean =>
  status === 'passed' || status === 'skipped';

/**
 * The gate. Stage N may start only when every earlier stage is settled — a
 * failed or still-pending predecessor blocks, and the reason names the first
 * offender so the UI never has to guess which card to point at.
 */
export const gateFor = (
  id: StageId,
  statuses: Readonly<Record<StageId, StageStatus>>
): { open: boolean; blockedBy?: StageId; reason?: string } => {
  const index = stageIndex(id);
  for (let i = 0; i < index; i += 1) {
    const previous = STAGE_IDS[i]!;
    const status = statuses[previous];
    if (isSettled(status)) continue;
    const definition = stageDefinition(previous);
    return {
      open: false,
      blockedBy: previous,
      reason:
        status === 'failed'
          ? `stage ${definition.number} (${definition.title}) failed`
          : status === 'running'
            ? `stage ${definition.number} (${definition.title}) is still running`
            : `stage ${definition.number} (${definition.title}) has not passed yet`
    };
  }
  return { open: true };
};

/**
 * The commands an attested stage quotes verbatim. The single source for both
 * the card's `<pre>` block and the attestation record, so the report can never
 * claim an operator ran something different from what the UI showed them.
 */
export const ATTESTED_COMMANDS: Partial<Record<StageId, string[]>> = {
  'contract-tests': ['cd rebuild/contracts && clarinet check && npm test'],
  'client-tests': ['cd rebuild/client && npm test', 'cd rebuild/ui && npm test']
};

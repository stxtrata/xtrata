import { XtrataClientError } from '@xtrata/collections-client';
import {
  gateFor,
  isSettled,
  stageDefinition,
  STAGE_IDS,
  type StageId,
  type StageStatus
} from './stages';
import type { CanaryDeployConfig } from './config';
import type { Deployable } from './sources';
import type { InterfaceProbe, DependencyCheck, NameConflict, SourceVerification } from './verify';

/**
 * Canary run state.
 *
 * Same framework-free observable store as the Studio (`pages/studio/store.ts`),
 * for the same reason: the gate rules, the evidence accumulation and the report
 * are the parts worth testing, and none of them should need React or a wallet
 * to exercise.
 *
 * The store OWNS the gate. `runStage` refuses to start a stage whose gate is
 * closed rather than leaving that to a disabled button, so a UI bug cannot open
 * a path the process forbids.
 */

export interface EvidenceEntry {
  label: string;
  value: string;
  /** Colours the value in the UI and survives into the report. */
  tone?: 'ok' | 'warn' | 'bad' | 'muted';
}

export interface DeployRecord {
  id: Deployable['id'];
  contractId: string;
  clarityVersion: number;
  sourceHash: string;
  txid?: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  error?: string;
}

export interface VerificationRecord {
  contractId: string;
  parity?: SourceVerification;
  interfaceProbe?: InterfaceProbe;
  dependencies?: DependencyCheck;
}

export interface AttestationRecord {
  commands: string[];
  /** What the operator pasted. */
  output: string;
  /** The operator's own claim about the outcome. */
  outcome: 'passed' | 'failed';
  attestedBy: string;
  attestedAt: string;
}

export interface StageState {
  id: StageId;
  status: StageStatus;
  startedAt?: string;
  finishedAt?: string;
  /** Human-readable evidence lines, in the order they were produced. */
  evidence: EvidenceEntry[];
  /** Error message on a failed stage. */
  error?: string;
  /** Why a stage was skipped. Always present on a skipped stage. */
  skipReason?: string;
  attestation?: AttestationRecord;
}

/**
 * A deployment waiting for the operator.
 *
 * The runner creates one of these and blocks; the UI renders the typed-
 * confirmation panel from it, showing EXACTLY what would be broadcast. There is
 * no code path that deploys without one, which is what "nothing deploys
 * silently" means here.
 */
export interface ConfirmationRequest {
  id: string;
  stage: StageId;
  title: string;
  /** The exact text the operator must type to arm — the contract name. */
  phrase: string;
  /** Everything that is about to happen, itemised. */
  details: EvidenceEntry[];
  irreversible: boolean;
}

export interface CanaryState {
  config: CanaryDeployConfig;
  /** Non-null while a runner is blocked on an explicit typed confirmation. */
  pendingConfirmation: ConfirmationRequest | null;
  stages: Record<StageId, StageState>;
  /** Ordered contract sources this run intends to deploy (stage 1 output). */
  deployables: Deployable[];
  /** Per-network deploy records, keyed by the stage that produced them. */
  deploys: Record<'testnet-deploy' | 'production-deploy', DeployRecord[]>;
  verifications: Record<'testnet-verify' | 'production-verify', VerificationRecord[]>;
  nameConflicts: NameConflict[];
  /** Freeform notes captured by the review stage. */
  reviewNotes: string;
  startedAt: string;
}

export interface CanaryDeps {
  config: CanaryDeployConfig;
  now?: () => Date;
}

const emptyStage = (id: StageId): StageState => ({ id, status: 'pending', evidence: [] });

const emptyStages = (): Record<StageId, StageState> =>
  Object.fromEntries(STAGE_IDS.map((id) => [id, emptyStage(id)])) as Record<StageId, StageState>;

export type StageRunner = (api: StageRunApi) => Promise<void>;

/** What a stage runner is handed. Everything it can do to the run, and nothing else. */
export interface StageRunApi {
  stage: StageId;
  config: CanaryDeployConfig;
  state: () => CanaryState;
  /** Append an evidence line. Visible immediately; kept in the report. */
  evidence: (entry: EvidenceEntry) => void;
  /** Record structured results on the run. */
  patch: (patch: Partial<Omit<CanaryState, 'stages'>>) => void;
  /** Skip this stage with a reason. Settles it without passing it. */
  skip: (reason: string) => void;
  /**
   * Block until the operator arms and confirms. Rejects if they decline, which
   * fails the stage — a declined deployment is not a silent no-op.
   */
  requestConfirmation: (request: Omit<ConfirmationRequest, 'id' | 'stage'>) => Promise<void>;
}

export class CanaryStore {
  private state: CanaryState;
  private readonly listeners = new Set<() => void>();
  private readonly now: () => Date;
  private active: StageId | null = null;

  constructor(deps: CanaryDeps) {
    this.now = deps.now ?? (() => new Date());
    this.state = {
      config: deps.config,
      pendingConfirmation: null,
      stages: emptyStages(),
      deployables: [],
      deploys: { 'testnet-deploy': [], 'production-deploy': [] },
      verifications: { 'testnet-verify': [], 'production-verify': [] },
      nameConflicts: [],
      reviewNotes: '',
      startedAt: this.now().toISOString()
    };
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = (): CanaryState => this.state;

  private set(patch: Partial<CanaryState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }

  private setStage(id: StageId, patch: Partial<StageState>): void {
    this.set({ stages: { ...this.state.stages, [id]: { ...this.state.stages[id], ...patch } } });
  }

  // --- gating --------------------------------------------------------------

  get statuses(): Record<StageId, StageStatus> {
    return Object.fromEntries(
      STAGE_IDS.map((id) => [id, this.state.stages[id].status])
    ) as Record<StageId, StageStatus>;
  }

  gate(id: StageId): ReturnType<typeof gateFor> {
    return gateFor(id, this.statuses);
  }

  /** May this stage be started right now? */
  canStart(id: StageId): boolean {
    if (this.active !== null) return false;
    const status = this.state.stages[id].status;
    if (status === 'running') return false;
    return this.gate(id).open;
  }

  updateConfig(patch: Partial<CanaryDeployConfig>): void {
    this.set({ config: { ...this.state.config, ...patch } });
  }

  setReviewNotes(reviewNotes: string): void {
    this.set({ reviewNotes });
  }

  /**
   * Re-open a stage and everything after it.
   *
   * A stage whose inputs changed cannot keep a stale pass, and neither can the
   * stages that were gated on it — otherwise editing the deploy config after
   * stage 1 passed would leave stage 5 armed against evidence that no longer
   * describes what is about to be deployed.
   */
  resetFrom(id: StageId): void {
    const from = STAGE_IDS.indexOf(id);
    const stages = { ...this.state.stages };
    for (let i = from; i < STAGE_IDS.length; i += 1) {
      stages[STAGE_IDS[i]!] = emptyStage(STAGE_IDS[i]!);
    }
    this.set({ stages });
  }

  // --- attestation ---------------------------------------------------------

  /**
   * Record an operator attestation for a stage the browser cannot verify.
   *
   * Passing requires an explicit `passed` outcome AND pasted output: an empty
   * attestation is not evidence of anything, and the report labels the result
   * as attested wherever it appears.
   */
  attest(
    id: StageId,
    attestation: Omit<AttestationRecord, 'attestedAt'> & { attestedAt?: string }
  ): void {
    const definition = stageDefinition(id);
    if (definition.verification !== 'attested') {
      throw new XtrataClientError('plan-invalid', `stage ${definition.number} is not an attested stage`);
    }
    if (!this.gate(id).open) {
      throw new XtrataClientError(
        'plan-invalid',
        `stage ${definition.number} is gated: ${this.gate(id).reason ?? 'blocked'}`
      );
    }
    if (attestation.output.trim().length === 0) {
      throw new XtrataClientError('plan-invalid', 'paste the command output before attesting');
    }
    if (attestation.attestedBy.trim().length === 0) {
      throw new XtrataClientError('plan-invalid', 'name the operator making this attestation');
    }
    const record: AttestationRecord = {
      ...attestation,
      attestedAt: attestation.attestedAt ?? this.now().toISOString()
    };
    const at = this.now().toISOString();
    this.setStage(id, {
      attestation: record,
      status: record.outcome === 'passed' ? 'passed' : 'failed',
      startedAt: this.state.stages[id].startedAt ?? at,
      finishedAt: at,
      evidence: [
        { label: 'Verification', value: 'operator-attested — NOT machine-verified', tone: 'warn' },
        { label: 'Commands', value: record.commands.join('\n'), tone: 'muted' },
        { label: 'Attested by', value: `${record.attestedBy} at ${record.attestedAt}` },
        {
          label: 'Operator outcome',
          value: record.outcome,
          tone: record.outcome === 'passed' ? 'ok' : 'bad'
        }
      ],
      ...(record.outcome === 'failed'
        ? { error: 'the operator attested that this stage failed' }
        : {})
    });
  }

  /**
   * Stage 12 — the production gate.
   *
   * Not a runner: nothing is computed here, a person takes responsibility. It
   * needs the exact approval phrase, an explicit acknowledgment of Clarity
   * immutability, and a name. Any one missing and the gate stays shut.
   */
  approveProduction(params: {
    phrase: string;
    expectedPhrase: string;
    acknowledgedImmutability: boolean;
    approvedBy: string;
  }): void {
    const id: StageId = 'production-approval';
    const gate = this.gate(id);
    if (!gate.open) {
      throw new XtrataClientError('plan-invalid', `production approval is gated: ${gate.reason ?? 'blocked'}`);
    }
    if (params.phrase !== params.expectedPhrase) {
      throw new XtrataClientError('plan-invalid', 'the approval phrase does not match exactly');
    }
    if (!params.acknowledgedImmutability) {
      throw new XtrataClientError(
        'plan-invalid',
        'acknowledge that a deployed Clarity contract cannot be overwritten before approving'
      );
    }
    if (params.approvedBy.trim().length === 0) {
      throw new XtrataClientError('plan-invalid', 'name the operator granting production approval');
    }
    const at = this.now().toISOString();
    this.setStage(id, {
      status: 'passed',
      startedAt: at,
      finishedAt: at,
      evidence: [
        { label: 'Approved by', value: `${params.approvedBy} at ${at}`, tone: 'warn' },
        { label: 'Approval phrase', value: params.expectedPhrase, tone: 'muted' },
        {
          label: 'Immutability acknowledged',
          value:
            'A deployed Clarity contract CANNOT be overwritten. Recovery requires a new contract ' +
            'version under a new name plus application and relayer routing changes.',
          tone: 'warn'
        }
      ]
    });
  }

  /** Explicitly skip a settled-but-not-run stage. A reason is mandatory. */
  skipStage(id: StageId, reason: string): void {
    if (reason.trim().length === 0) {
      throw new XtrataClientError('plan-invalid', 'a skipped stage must record why it was skipped');
    }
    const definition = stageDefinition(id);
    if (!definition.skippable) {
      throw new XtrataClientError(
        'plan-invalid',
        `stage ${definition.number} (${definition.title}) may not be skipped`
      );
    }
    if (!this.gate(id).open) {
      throw new XtrataClientError(
        'plan-invalid',
        `stage ${definition.number} is gated: ${this.gate(id).reason ?? 'blocked'}`
      );
    }
    const at = this.now().toISOString();
    this.setStage(id, {
      status: 'skipped',
      skipReason: reason,
      startedAt: this.state.stages[id].startedAt ?? at,
      finishedAt: at,
      evidence: [...this.state.stages[id].evidence, { label: 'Skipped', value: reason, tone: 'warn' }]
    });
  }

  // --- typed confirmation --------------------------------------------------

  private pending: { id: string; resolve: () => void; reject: (error: Error) => void } | null = null;
  private confirmationCounter = 0;

  /** Called by the UI once the operator has armed AND confirmed. */
  confirmPending(id: string): void {
    if (!this.pending || this.pending.id !== id) return;
    const { resolve } = this.pending;
    this.pending = null;
    this.set({ pendingConfirmation: null });
    resolve();
  }

  /** Called by the UI when the operator declines. Fails the running stage. */
  cancelPending(id: string, reason = 'the operator declined the confirmation'): void {
    if (!this.pending || this.pending.id !== id) return;
    const { reject } = this.pending;
    this.pending = null;
    this.set({ pendingConfirmation: null });
    reject(new XtrataClientError('wallet-rejected', reason));
  }

  // --- running -------------------------------------------------------------

  /**
   * Run one stage.
   *
   * The gate is enforced HERE, not in the button's `disabled`. A runner that
   * throws fails the stage (and therefore blocks every later stage) with the
   * thrown message; a runner that calls `skip` settles it as skipped; anything
   * else passes.
   */
  async runStage(id: StageId, runner: StageRunner): Promise<StageStatus> {
    const definition = stageDefinition(id);
    const gate = this.gate(id);
    if (!gate.open) {
      throw new XtrataClientError(
        'plan-invalid',
        `stage ${definition.number} (${definition.title}) is gated: ${gate.reason ?? 'blocked'}`
      );
    }
    if (this.active !== null) {
      throw new XtrataClientError('plan-invalid', `stage ${this.active} is already running`);
    }

    this.active = id;
    this.setStage(id, {
      status: 'running',
      startedAt: this.now().toISOString(),
      evidence: [],
      error: undefined,
      skipReason: undefined,
      finishedAt: undefined
    });

    let skipped: string | null = null;
    const api: StageRunApi = {
      stage: id,
      config: this.state.config,
      state: () => this.state,
      evidence: (entry) => {
        this.setStage(id, { evidence: [...this.state.stages[id].evidence, entry] });
      },
      patch: (patch) => {
        this.set(patch as Partial<CanaryState>);
      },
      skip: (reason) => {
        skipped = reason;
      },
      requestConfirmation: (request) =>
        new Promise<void>((resolve, reject) => {
          const confirmationId = `confirm-${(this.confirmationCounter += 1)}`;
          this.pending = { id: confirmationId, resolve, reject };
          this.set({ pendingConfirmation: { ...request, id: confirmationId, stage: id } });
        })
    };

    try {
      await runner(api);
      const at = this.now().toISOString();
      if (skipped !== null) {
        const reason: string = skipped;
        this.setStage(id, {
          status: 'skipped',
          skipReason: reason,
          finishedAt: at,
          evidence: [...this.state.stages[id].evidence, { label: 'Skipped', value: reason, tone: 'warn' }]
        });
        return 'skipped';
      }
      this.setStage(id, { status: 'passed', finishedAt: at });
      return 'passed';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.setStage(id, {
        status: 'failed',
        error: message,
        finishedAt: this.now().toISOString(),
        evidence: [...this.state.stages[id].evidence, { label: 'Failure', value: message, tone: 'bad' }]
      });
      return 'failed';
    } finally {
      this.active = null;
      // A runner that threw while blocked would otherwise leave the panel up.
      this.pending = null;
      if (this.state.pendingConfirmation !== null) this.set({ pendingConfirmation: null });
    }
  }

  // --- rollups -------------------------------------------------------------

  get settledCount(): number {
    return STAGE_IDS.filter((id) => isSettled(this.state.stages[id].status)).length;
  }

  get failed(): StageId[] {
    return STAGE_IDS.filter((id) => this.state.stages[id].status === 'failed');
  }

  /** The first stage that is neither passed nor skipped — where the run is. */
  get currentStage(): StageId | null {
    return STAGE_IDS.find((id) => !isSettled(this.state.stages[id].status)) ?? null;
  }
}

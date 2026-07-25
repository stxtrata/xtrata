import {
  buildPlan,
  bytesToHex,
  chainHashOfBytes,
  chunkBytes,
  CollectionExecutor,
  exportManifest,
  importManifest,
  ingestFiles,
  initialProgress,
  naturalSortByName,
  XtrataClientError,
  type CollectionReport,
  type DuplicateReport,
  type ExecutorEffects,
  type ExecutorEvent,
  type ExecutorRunResult,
  type FeeSchedule,
  type IngestFile,
  type ItemProgress,
  type Manifest,
  type ManifestItem,
  type TransactionPlan
} from '@xtrata/collections-client';
import {
  buildCollectionSource,
  createDefaultTemplateDraft,
  type CollectionTemplateDraft
} from './template';

/**
 * Collection Studio state.
 *
 * Framework-free on purpose: a small observable store so the wiring
 * (ingest → plan → run, pause/resume, retry) is testable without React and
 * without a wallet. React binds to it through `useSyncExternalStore`.
 *
 * Persistence rule (architecture §8): the chain is the source of truth. The
 * manifest is cached in localStorage purely so a reload does not lose the
 * ordering/metadata work, and every resume constructs a FRESH executor, which
 * re-observes each item on chain before it does anything. Nothing in this store
 * is ever treated as proof that a transaction landed.
 */

export type StudioStep = 'setup' | 'import' | 'plan' | 'run' | 'complete';

export const STUDIO_STEPS: readonly StudioStep[] = ['setup', 'import', 'plan', 'run', 'complete'];

export interface StudioFile {
  id: string;
  name: string;
  bytes: Uint8Array;
  mimeType: string;
  itemUri?: string;
  metadata?: Record<string, unknown>;
}

export type DeployStatus =
  | 'idle'
  | 'submitting'
  | 'confirming'
  | 'verifying-source'
  | 'verified'
  | 'failed';

export interface DeployState {
  status: DeployStatus;
  contractName: string;
  txid?: string;
  contractId?: string;
  sourceMatch?: 'exact' | 'normalized' | 'none';
  expectedHash?: string;
  actualHash?: string;
  error?: string;
}

export type RunPhase = 'idle' | 'verifying' | 'running' | 'paused' | 'complete' | 'failed';

export interface RunState {
  phase: RunPhase;
  reason?: string;
  /** Set while a user-requested pause is waiting for the next tx boundary. */
  pauseRequested: boolean;
  startedAt?: string;
  finishedAt?: string;
}

export interface StudioState {
  step: StudioStep;
  draft: CollectionTemplateDraft;
  deploy: DeployState;
  files: StudioFile[];
  /** Metadata applied to every item unless overridden per item. */
  sharedMetadata: Record<string, string>;
  duplicatePolicy: 'reject' | 'dedupe' | 'allow';
  duplicates: DuplicateReport;
  manifest: Manifest | null;
  plan: TransactionPlan | null;
  fees: FeeSchedule | null;
  feeSource: string | null;
  progress: ItemProgress[];
  run: RunState;
  report: CollectionReport | null;
  /** Files named in an imported manifest that are not present locally. */
  missingFiles: string[];
  error: string | null;
}

export interface ExecutorLike {
  run: (manifest: Manifest, plan: TransactionPlan) => Promise<ExecutorRunResult>;
}

export type ExecutorFactory = (params: {
  effects: Pick<ExecutorEffects, 'observer' | 'submit' | 'waitConfirm'>;
  onEvent: (event: ExecutorEvent) => void;
  chunksFor: ExecutorEffects['chunksFor'];
}) => ExecutorLike;

export interface StudioDeps {
  /** Builds an executor bound to the wallet + chain. A NEW one per run. */
  createExecutor?: ExecutorFactory;
  /** Chain + wallet effects. Absent until a wallet is connected. */
  effects?: Pick<ExecutorEffects, 'observer' | 'submit' | 'waitConfirm'>;
  coreContractId: string;
  dropsContractId: string | null;
  network: Manifest['network'];
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  now?: () => Date;
}

const MANIFEST_CACHE_KEY = 'xtrata.v3.studio.manifest';

let fileCounter = 0;
export const makeStudioFile = (params: Omit<StudioFile, 'id'>): StudioFile => ({
  id: `file-${(fileCounter += 1)}`,
  ...params
});

/** Sentinel thrown into the wallet seam to stop a run at a tx boundary. */
export class RunPausedByUser extends XtrataClientError {
  constructor() {
    super('wallet-rejected', 'run paused by the operator');
  }
}

export class StudioStore {
  private state: StudioState;
  private readonly listeners = new Set<() => void>();
  private deps: StudioDeps;
  private activeRun: Promise<void> | null = null;

  constructor(deps: StudioDeps) {
    this.deps = deps;
    this.state = {
      step: 'setup',
      draft: createDefaultTemplateDraft({
        coreContract: deps.coreContractId,
        dropsAuthority: deps.dropsContractId
      }),
      deploy: { status: 'idle', contractName: '' },
      files: [],
      sharedMetadata: {},
      duplicatePolicy: 'reject',
      duplicates: { groups: [] },
      manifest: null,
      plan: null,
      fees: null,
      feeSource: null,
      progress: [],
      run: { phase: 'idle', pauseRequested: false },
      report: null,
      missingFiles: [],
      error: null
    };
  }

  // --- observable plumbing -------------------------------------------------

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = (): StudioState => this.state;

  /**
   * Late-bind the wallet/chain seam. The store is constructed before a wallet
   * is connected (so the setup and import steps work read-only), and the
   * effects arrive once a session exists on the right network.
   */
  bindChain(params: {
    effects?: StudioDeps['effects'];
    createExecutor?: ExecutorFactory;
  }): void {
    this.deps = {
      ...this.deps,
      ...(params.effects !== undefined ? { effects: params.effects } : {}),
      ...(params.createExecutor !== undefined ? { createExecutor: params.createExecutor } : {})
    };
  }

  get canRun(): boolean {
    return Boolean(this.deps.effects && this.deps.createExecutor && this.state.plan);
  }

  private set(patch: Partial<StudioState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }

  // --- step 1: setup + deploy ---------------------------------------------

  setStep(step: StudioStep): void {
    this.set({ step });
  }

  updateDraft(patch: Partial<CollectionTemplateDraft>): void {
    this.set({ draft: { ...this.state.draft, ...patch } });
  }

  setContractName(contractName: string): void {
    this.set({ deploy: { ...this.state.deploy, contractName } });
  }

  updateDeploy(patch: Partial<DeployState>): void {
    this.set({ deploy: { ...this.state.deploy, ...patch } });
  }

  /** The exact source that will be deployed (and later hash-verified). */
  buildSource(): { source: string; errors: string[]; warnings: string[] } {
    return buildCollectionSource(this.state.draft);
  }

  get collectionContractId(): string | null {
    return this.state.deploy.contractId ?? null;
  }

  // --- step 2: file import -------------------------------------------------

  addFiles(files: StudioFile[]): void {
    const existing = new Set(this.state.files.map((file) => file.name));
    const added = files.filter((file) => !existing.has(file.name));
    this.set({ files: [...this.state.files, ...added], manifest: null, plan: null });
  }

  removeFile(id: string): void {
    this.set({ files: this.state.files.filter((file) => file.id !== id), manifest: null, plan: null });
  }

  clearFiles(): void {
    this.set({ files: [], manifest: null, plan: null, duplicates: { groups: [] }, missingFiles: [] });
  }

  /** Deterministic default ordering: natural sort on file name. */
  sortNatural(): void {
    this.set({ files: naturalSortByName(this.state.files), manifest: null, plan: null });
  }

  /** Manual reorder — the ordering IS the collection index assignment. */
  moveFile(id: string, delta: number): void {
    const files = [...this.state.files];
    const from = files.findIndex((file) => file.id === id);
    if (from < 0) return;
    const to = Math.min(files.length - 1, Math.max(0, from + delta));
    if (to === from) return;
    const [moved] = files.splice(from, 1);
    files.splice(to, 0, moved!);
    this.set({ files, manifest: null, plan: null });
  }

  setFileField(id: string, patch: Partial<Pick<StudioFile, 'itemUri' | 'metadata' | 'mimeType'>>): void {
    this.set({
      files: this.state.files.map((file) => (file.id === id ? { ...file, ...patch } : file)),
      manifest: null,
      plan: null
    });
  }

  setSharedMetadata(sharedMetadata: Record<string, string>): void {
    this.set({ sharedMetadata, manifest: null, plan: null });
  }

  setDuplicatePolicy(duplicatePolicy: StudioState['duplicatePolicy']): void {
    this.set({ duplicatePolicy, manifest: null, plan: null });
  }

  /** Duplicate groups by plain sha256, computed for display before ingest. */
  detectDuplicates(): DuplicateReport {
    const bySha = new Map<string, number[]>();
    this.state.files.forEach((file, position) => {
      const sha = bytesToHex(chainHashOfBytes(file.bytes));
      const list = bySha.get(sha);
      if (list) list.push(position);
      else bySha.set(sha, [position]);
    });
    const groups = [...bySha.entries()]
      .filter(([, positions]) => positions.length > 1)
      .map(([sha256Hex, positions]) => ({
        sha256Hex,
        positions,
        fileNames: positions.map((position) => this.state.files[position]!.name)
      }));
    return { groups };
  }

  private toIngestFiles(): IngestFile[] {
    const shared = this.state.sharedMetadata;
    const hasShared = Object.keys(shared).length > 0;
    return this.state.files.map((file) => ({
      name: file.name,
      bytes: file.bytes,
      mimeType: file.mimeType,
      ...(file.itemUri !== undefined && file.itemUri !== '' ? { itemUri: file.itemUri } : {}),
      ...(hasShared || file.metadata !== undefined
        ? { metadata: { ...shared, ...(file.metadata ?? {}) } }
        : {})
    }));
  }

  /** ingest → manifest. Throws (taxonomy) on duplicates under 'reject'. */
  buildManifest(): Manifest {
    if (this.state.files.length === 0) {
      throw new XtrataClientError('plan-invalid', 'no files imported');
    }
    const result = ingestFiles(this.toIngestFiles(), {
      collection: {
        name: this.state.draft.name || 'untitled',
        ...(this.state.draft.symbol ? { symbol: this.state.draft.symbol } : {}),
        ...(this.state.draft.description ? { description: this.state.draft.description } : {}),
        ...(this.state.draft.artworkUri ? { artworkUri: this.state.draft.artworkUri } : {}),
        ...(this.state.draft.baseUri ? { baseUri: this.state.draft.baseUri } : {})
      },
      network: this.deps.network,
      contracts: {
        core: this.deps.coreContractId,
        ...(this.state.deploy.contractId ? { collection: this.state.deploy.contractId } : {}),
        ...(this.deps.dropsContractId ? { drops: this.deps.dropsContractId } : {})
      },
      duplicatePolicy: this.state.duplicatePolicy,
      ...(this.deps.now ? { now: this.deps.now } : {})
    });
    this.set({
      manifest: result.manifest,
      duplicates: result.duplicates,
      plan: null,
      progress: result.manifest.items.map((item) => initialProgress(item.index, item.chunkCount)),
      error: null
    });
    this.cacheManifest(result.manifest);
    return result.manifest;
  }

  // --- step 3: plan --------------------------------------------------------

  setFees(fees: FeeSchedule, source: string): void {
    this.set({ fees, feeSource: source, plan: null });
  }

  buildPlan(): TransactionPlan {
    const { manifest, fees } = this.state;
    if (!manifest) throw new XtrataClientError('plan-invalid', 'build the manifest first');
    if (!fees) throw new XtrataClientError('plan-invalid', 'no fee schedule loaded');
    const plan = buildPlan(manifest, fees);
    this.set({ plan });
    return plan;
  }

  // --- manifest export / import -------------------------------------------

  exportManifestJson(): string {
    if (!this.state.manifest) {
      throw new XtrataClientError('manifest-invalid', 'nothing to export — build the manifest first');
    }
    return exportManifest(this.state.manifest);
  }

  /**
   * Device-change recovery: adopt a checksummed manifest, then match the
   * locally re-imported files to its items by content hash. Names are NOT
   * trusted for matching — content is.
   */
  importManifestJson(json: string): { manifest: Manifest; missingFiles: string[] } {
    const manifest = importManifest(json);
    const byHash = new Map<string, StudioFile>();
    for (const file of this.state.files) {
      byHash.set(bytesToHex(chainHashOfBytes(file.bytes)), file);
    }
    const ordered: StudioFile[] = [];
    const missingFiles: string[] = [];
    for (const item of manifest.items) {
      const file = byHash.get(item.contentHashHex);
      if (file) ordered.push({ ...file, ...(item.itemUri !== undefined ? { itemUri: item.itemUri } : {}) });
      else missingFiles.push(item.fileName);
    }
    this.set({
      manifest,
      files: ordered,
      missingFiles,
      plan: null,
      progress: manifest.items.map((item) => initialProgress(item.index, item.chunkCount)),
      draft: {
        ...this.state.draft,
        name: manifest.collection.name,
        symbol: manifest.collection.symbol ?? this.state.draft.symbol,
        description: manifest.collection.description ?? this.state.draft.description,
        artworkUri: manifest.collection.artworkUri ?? this.state.draft.artworkUri,
        baseUri: manifest.collection.baseUri ?? this.state.draft.baseUri
      },
      deploy: manifest.contracts.collection
        ? { ...this.state.deploy, contractId: manifest.contracts.collection }
        : this.state.deploy
    });
    this.cacheManifest(manifest);
    return { manifest, missingFiles };
  }

  private get storage(): StudioDeps['storage'] {
    if (this.deps.storage) return this.deps.storage;
    try {
      return typeof window === 'undefined' ? undefined : window.localStorage;
    } catch {
      return undefined;
    }
  }

  /** Convenience cache only — never consulted to decide what landed on chain. */
  private cacheManifest(manifest: Manifest): void {
    try {
      this.storage?.setItem(MANIFEST_CACHE_KEY, exportManifest(manifest));
    } catch {
      /* storage full or disabled: the exportable file is the real backup */
    }
  }

  loadCachedManifest(): Manifest | null {
    try {
      const raw = this.storage?.getItem(MANIFEST_CACHE_KEY);
      return raw ? importManifest(raw) : null;
    } catch {
      return null;
    }
  }

  clearCachedManifest(): void {
    try {
      this.storage?.removeItem(MANIFEST_CACHE_KEY);
    } catch {
      /* ignore */
    }
  }

  // --- step 4: run ---------------------------------------------------------

  private chunksFor = async (item: ManifestItem): Promise<Uint8Array[]> => {
    const file = this.state.files.find(
      (candidate) => bytesToHex(chainHashOfBytes(candidate.bytes)) === item.contentHashHex
    );
    if (!file) {
      throw new XtrataClientError(
        'plan-invalid',
        `file for item ${item.index} (${item.fileName}) is not loaded — re-import it to continue`
      );
    }
    return chunkBytes(file.bytes);
  };

  private applyEvent = (event: ExecutorEvent): void => {
    if (event.type === 'item-state') {
      const progress = this.state.progress.map((entry) =>
        entry.index === event.index ? event.progress : entry
      );
      const run =
        this.state.run.phase === 'verifying' ? { ...this.state.run, phase: 'running' as const } : this.state.run;
      this.set({ progress, run });
      return;
    }
    if (event.type === 'tx-submitted' && this.state.run.phase === 'verifying') {
      this.set({ run: { ...this.state.run, phase: 'running' } });
      return;
    }
    if (event.type === 'run-paused') {
      this.set({ run: { ...this.state.run, phase: 'paused', reason: event.reason } });
    }
  };

  /**
   * Pause at the next transaction boundary. The executor already treats a
   * wallet rejection as "stop, stay resumable", so a user pause reuses exactly
   * that path instead of adding a second, less-tested stop mechanism.
   */
  requestPause(): void {
    if (this.state.run.phase !== 'running' && this.state.run.phase !== 'verifying') return;
    this.set({ run: { ...this.state.run, pauseRequested: true } });
  }

  private wrapSubmit(
    submit: ExecutorEffects['submit']
  ): ExecutorEffects['submit'] {
    return async (tx) => {
      if (this.state.run.pauseRequested) throw new RunPausedByUser();
      return submit(tx);
    };
  }

  /**
   * Start (or resume, or retry) the run.
   *
   * ALWAYS builds a fresh executor: a new executor holds no local progress, so
   * it reconciles every item against the chain before acting. That is what
   * makes resume-after-reload, resume-on-another-device and retry-failed the
   * same code path — and why a `failed` item (terminal in the state machine)
   * becomes retryable simply by starting again.
   */
  async startRun(): Promise<ExecutorRunResult | null> {
    if (this.activeRun) return null;
    const { manifest, plan } = this.state;
    if (!manifest || !plan) {
      throw new XtrataClientError('plan-invalid', 'build a manifest and a plan before running');
    }
    const effects = this.deps.effects;
    const createExecutor = this.deps.createExecutor;
    if (!effects || !createExecutor) {
      throw new XtrataClientError('plan-invalid', 'connect a wallet before running');
    }

    this.set({
      run: {
        phase: 'verifying',
        pauseRequested: false,
        startedAt: (this.deps.now ?? (() => new Date()))().toISOString()
      },
      error: null,
      report: null
    });

    const executor = createExecutor({
      effects: { ...effects, submit: this.wrapSubmit(effects.submit) },
      onEvent: this.applyEvent,
      chunksFor: this.chunksFor
    });

    let result: ExecutorRunResult | null = null;
    const task = (async () => {
      try {
        result = await executor.run(manifest, plan);
        const finishedAt = (this.deps.now ?? (() => new Date()))().toISOString();
        this.set({
          progress: result.progress,
          report: result.report,
          run: {
            phase: result.paused ? 'paused' : 'complete',
            pauseRequested: false,
            ...(result.pauseReason !== undefined ? { reason: result.pauseReason } : {}),
            ...(this.state.run.startedAt !== undefined ? { startedAt: this.state.run.startedAt } : {}),
            finishedAt
          },
          step: result.paused ? 'run' : 'complete'
        });
      } catch (error) {
        this.set({
          run: { phase: 'failed', pauseRequested: false, reason: String(error) },
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      } finally {
        this.activeRun = null;
      }
    })();
    this.activeRun = task;
    await task;
    return result;
  }

  /** Same code path as start — the executor reconciles first, every time. */
  resumeRun(): Promise<ExecutorRunResult | null> {
    return this.startRun();
  }

  /** Retry only the failed items: a fresh run re-derives their state on chain. */
  retryFailed(): Promise<ExecutorRunResult | null> {
    const progress = this.state.progress.map((entry) =>
      entry.state === 'failed'
        ? initialProgress(entry.index, entry.totalChunks, this.deps.now)
        : entry
    );
    this.set({ progress });
    return this.startRun();
  }

  get failedCount(): number {
    return this.state.progress.filter((entry) => entry.state === 'failed').length;
  }
}

/** Default executor factory — the real `CollectionExecutor`, bound to a wallet. */
export const makeExecutorFactory =
  (config: ConstructorParameters<typeof CollectionExecutor>[1]) =>
  (params: Parameters<ExecutorFactory>[0]): ExecutorLike =>
    new CollectionExecutor(
      {
        observer: params.effects.observer,
        submit: params.effects.submit,
        waitConfirm: params.effects.waitConfirm,
        chunksFor: params.chunksFor
      },
      { ...config, onEvent: params.onEvent }
    );

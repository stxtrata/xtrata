import {
  DROP_ELIGIBILITY,
  DROP_MODES,
  MAX_INVENTORY_ITEMS,
  MIN_FEE_BUDGET,
  selectAllUnassigned,
  selectExplicit,
  selectRange,
  selectWholeCollection,
  selectionCount,
  sponsorExposure,
  XtrataClientError,
  type ChainTxResult,
  type ClaimRow,
  type CollectionInfo,
  type DropEligibility,
  type DropMode,
  type DropRow,
  type DropsTxBuilder,
  type DropsTxDescriptor,
  type InventorySelection,
  type ItemRow,
  type NetworkName,
  type ScanEntry,
  type SponsorExposure
} from '@xtrata/collections-client';
import {
  expandSelection,
  fitToRangeCap,
  planCreatorInventory,
  planRecoveryTxs,
  summarizeInventoryPlan,
  type CreatorInventoryPlan,
  type InventoryPlanSummary
} from './inventory';

/**
 * Drop Builder state.
 *
 * Same shape as the Collection Studio's store, and for the same reasons: a
 * framework-free observable so the whole creator flow — resolve inventory,
 * plan bounded transactions, fund, activate, monitor, recover — is testable
 * against fake clients with no React, no wallet and no chain. React binds via
 * `useSyncExternalStore`.
 *
 * The chain is the source of truth throughout. Nothing here is ever treated as
 * proof that a transaction landed: every step re-reads the drop row, and the
 * activation gates shown to the creator are read back from the contract's own
 * counters rather than from what this store thinks it submitted.
 */

export type BuilderStep = 'collection' | 'inventory' | 'mode' | 'timing' | 'costs' | 'activate' | 'monitor';

export const BUILDER_STEPS: readonly BuilderStep[] = [
  'collection',
  'inventory',
  'mode',
  'timing',
  'costs',
  'activate',
  'monitor'
];

export type SelectionSource = 'all-unassigned' | 'whole-collection' | 'range' | 'explicit';

export interface AllowlistEntry {
  wallet: string;
  allowance: number;
}

export type TxStatus = 'submitting' | 'confirming' | 'success' | 'failed';

export interface TxLogEntry {
  id: string;
  label: string;
  functionName: string;
  status: TxStatus;
  txid?: string;
  error?: string;
  chainErrorCode?: number;
}

export interface DropConfigDraft {
  mode: DropMode;
  eligibility: DropEligibility;
  startBlock: number;
  /** 0 = no end block. */
  endBlock: number;
  /** 0 = uncapped. */
  totalLimit: number;
  /** 0 = uncapped. */
  perWalletLimit: number;
}

export interface DropsBuilderState {
  step: BuilderStep;
  /** Collection contract id typed in or handed over from the Studio. */
  collectionId: string;
  collectionInfo: CollectionInfo | null;
  loadingCollection: boolean;
  /** Full unassigned scan, kept for the explicit multi-select list. */
  scan: ScanEntry[];
  scanning: boolean;
  selection: InventorySelection | null;
  selectionSource: SelectionSource | null;
  /** True when the raw selection had to be re-fitted under the 25-range cap. */
  selectionRefitted: boolean;
  config: DropConfigDraft;
  allowlist: AllowlistEntry[];
  /** index → minted token id, needed to plan escrow. */
  tokenIds: Map<number, number>;
  resolvingTokenIds: boolean;
  claimFeeCap: bigint | null;
  minFeeBudget: bigint;
  attestorConfigured: boolean | null;
  tipHeight: number | null;
  budgetInputMicroStx: bigint;
  dropId: number | null;
  drop: DropRow | null;
  remaining: number | null;
  claims: ClaimRow[];
  loadingClaims: boolean;
  /** Escrowed token ids observed for the drop (recovery planning). */
  escrowedTokenIds: Map<number, number>;
  txLog: TxLogEntry[];
  busy: string | null;
  error: string | null;
}

export interface CollectionReadsLike {
  getCollectionInfo(): Promise<CollectionInfo>;
  getUnassignedScan(start: number): Promise<ScanEntry[]>;
  getItems(indexes: number[]): Promise<(ItemRow | null)[]>;
}

export interface DropsReadsLike {
  getDrop(dropId: number): Promise<DropRow | null>;
  getNextDropId(): Promise<number>;
  getRemaining(dropId: number): Promise<number>;
  getAllClaims(dropId: number): Promise<ClaimRow[]>;
  getClaimFeeCap(): Promise<bigint>;
  getMinFeeBudget(): Promise<bigint>;
  getEscrowedToken(dropId: number, index: number): Promise<number | null>;
  getAttestorPubkeyHash(): Promise<string | null>;
  isPaused(): Promise<boolean>;
  /**
   * The drop's own inventory index list, expanded from its on-chain ranges and
   * explicit slots. Optional so a fake can omit it, but the real `DropsReads`
   * has it — and it is what makes recovery work after a reload, without the
   * creator having to re-select anything.
   */
  resolveInventory?(dropId: number): Promise<number[]>;
}

export interface DropsBuilderDeps {
  dropsContractId: string;
  coreContractId: string;
  network: NetworkName;
  address?: string;
  collectionReads?: CollectionReadsLike;
  dropsReads?: DropsReadsLike;
  builder?: DropsTxBuilder;
  submit?: (tx: DropsTxDescriptor) => Promise<{ txid: string }>;
  waitConfirm?: (txid: string) => Promise<ChainTxResult>;
  getBlockHeight?: () => Promise<number>;
  now?: () => Date;
}

const DEFAULT_CONFIG: DropConfigDraft = {
  mode: 'pre-inscribed',
  eligibility: 'public',
  startBlock: 0,
  endBlock: 0,
  totalLimit: 0,
  perWalletLimit: 1
};

let logCounter = 0;
const nextLogId = (): string => `droptx-${(logCounter += 1)}`;

/** Chunk size for `get-items` (the contract's list bound). */
const ITEMS_PAGE = MAX_INVENTORY_ITEMS;

export class DropsBuilderStore {
  private state: DropsBuilderState;
  private readonly listeners = new Set<() => void>();
  private deps: DropsBuilderDeps;

  constructor(deps: DropsBuilderDeps, initial?: Partial<DropsBuilderState>) {
    this.deps = deps;
    this.state = {
      step: 'collection',
      collectionId: '',
      collectionInfo: null,
      loadingCollection: false,
      scan: [],
      scanning: false,
      selection: null,
      selectionSource: null,
      selectionRefitted: false,
      config: { ...DEFAULT_CONFIG },
      allowlist: [],
      tokenIds: new Map(),
      resolvingTokenIds: false,
      claimFeeCap: null,
      minFeeBudget: MIN_FEE_BUDGET,
      attestorConfigured: null,
      tipHeight: null,
      budgetInputMicroStx: 0n,
      dropId: null,
      drop: null,
      remaining: null,
      claims: [],
      loadingClaims: false,
      escrowedTokenIds: new Map(),
      txLog: [],
      busy: null,
      error: null,
      ...initial
    };
  }

  // --- observable plumbing -------------------------------------------------

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = (): DropsBuilderState => this.state;

  private set(patch: Partial<DropsBuilderState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }

  /** Late-bind the wallet/chain seam, exactly as the Studio store does. */
  bindChain(params: Partial<Pick<DropsBuilderDeps, 'address' | 'collectionReads' | 'dropsReads' | 'builder' | 'submit' | 'waitConfirm' | 'getBlockHeight'>>): void {
    this.deps = { ...this.deps, ...params };
  }

  get canSubmit(): boolean {
    return Boolean(this.deps.builder && this.deps.submit);
  }

  get dropsContractId(): string {
    return this.deps.dropsContractId;
  }

  setStep(step: BuilderStep): void {
    this.set({ step });
  }

  // --- step 1: the collection ---------------------------------------------

  setCollectionId(collectionId: string): void {
    if (collectionId === this.state.collectionId) return;
    this.set({
      collectionId,
      collectionInfo: null,
      scan: [],
      selection: null,
      selectionSource: null,
      selectionRefitted: false,
      tokenIds: new Map()
    });
  }

  async loadCollection(): Promise<CollectionInfo> {
    const reads = this.requireCollectionReads();
    this.set({ loadingCollection: true, error: null });
    try {
      const collectionInfo = await reads.getCollectionInfo();
      this.set({ collectionInfo });
      return collectionInfo;
    } catch (error) {
      this.set({ error: messageOf(error) });
      throw error;
    } finally {
      this.set({ loadingCollection: false });
    }
  }

  /** Contract constants + attestor configuration + chain tip, for the gates. */
  async loadChainContext(): Promise<void> {
    const reads = this.deps.dropsReads;
    const patch: Partial<DropsBuilderState> = {};
    if (reads) {
      const [claimFeeCap, minFeeBudget, attestor] = await Promise.all([
        reads.getClaimFeeCap(),
        reads.getMinFeeBudget(),
        reads.getAttestorPubkeyHash()
      ]);
      patch.claimFeeCap = claimFeeCap;
      patch.minFeeBudget = minFeeBudget;
      patch.attestorConfigured = attestor !== null;
    }
    if (this.deps.getBlockHeight) {
      patch.tipHeight = await this.deps.getBlockHeight();
    }
    this.set(patch);
  }

  // --- step 2/3: inventory selection ---------------------------------------

  /**
   * THE one-action selection.
   *
   * Walks the collection's `get-unassigned-scan` pages (50 indexes per call)
   * across the WHOLE index space — which is why it works identically for a
   * collection inscribed in one batch and one inscribed across thirty — and
   * coalesces every minted-but-unassigned index into the minimal
   * ranges + singletons split. The result is index-based: it never depends on
   * a client-side list of what was uploaded, or on which transaction minted
   * what.
   *
   * If the coalesced result needs more than the contract's 25 range segments
   * (a heavily fragmented collection), the excess is demoted to explicit
   * indexes so the plan stays legal; `selectionRefitted` records that.
   */
  async selectAllUnassigned(): Promise<InventorySelection> {
    const reads = this.requireCollectionReads();
    this.set({ scanning: true, error: null });
    try {
      const raw = await selectAllUnassigned(reads);
      const selection = fitToRangeCap(raw);
      this.set({
        selection,
        selectionSource: 'all-unassigned',
        selectionRefitted: selection.ranges.length !== raw.ranges.length,
        tokenIds: new Map()
      });
      return selection;
    } catch (error) {
      this.set({ error: messageOf(error) });
      throw error;
    } finally {
      this.set({ scanning: false });
    }
  }

  /** Every minted index, assigned or not — the contract validates the rest. */
  selectWholeCollection(): InventorySelection {
    const info = this.state.collectionInfo;
    if (!info) throw new XtrataClientError('plan-invalid', 'load the collection first');
    const selection = selectWholeCollection(info);
    this.set({ selection, selectionSource: 'whole-collection', selectionRefitted: false, tokenIds: new Map() });
    return selection;
  }

  selectIndexRange(start: number, end: number): InventorySelection {
    const info = this.state.collectionInfo;
    const selection = selectRange(start, end);
    if (info && end > info.nextIndex) {
      throw new XtrataClientError(
        'plan-invalid',
        `range end ${end} is beyond the collection's next index (${info.nextIndex})`
      );
    }
    this.set({ selection, selectionSource: 'range', selectionRefitted: false, tokenIds: new Map() });
    return selection;
  }

  selectExplicitIndexes(indexes: number[]): InventorySelection {
    const raw = selectExplicit([...indexes].sort((a, b) => a - b));
    this.set({ selection: raw, selectionSource: 'explicit', selectionRefitted: false, tokenIds: new Map() });
    return raw;
  }

  clearSelection(): void {
    this.set({ selection: null, selectionSource: null, selectionRefitted: false, tokenIds: new Map() });
  }

  /** Load the scan pages once so the explicit picker has something to show. */
  async loadScan(): Promise<ScanEntry[]> {
    const reads = this.requireCollectionReads();
    this.set({ scanning: true });
    try {
      const info = this.state.collectionInfo ?? (await reads.getCollectionInfo());
      const scan: ScanEntry[] = [];
      for (let start = 0; start < info.nextIndex; start += 50) {
        const page = await reads.getUnassignedScan(start);
        if (page.length === 0) break;
        scan.push(...page);
      }
      this.set({ scan, collectionInfo: info });
      return scan;
    } finally {
      this.set({ scanning: false });
    }
  }

  get selectionCount(): number {
    return this.state.selection ? selectionCount(this.state.selection) : 0;
  }

  /** Bounded transaction counts for the current selection. */
  get planSummary(): InventoryPlanSummary | null {
    return this.state.selection ? summarizeInventoryPlan(this.state.selection) : null;
  }

  /**
   * The real descriptor plan. Uses the drop id when one exists and 0 as a
   * preview id before creation — the shape and the counts are identical, so
   * the review screen shows exactly what will be broadcast.
   */
  planInventory(): CreatorInventoryPlan {
    const builder = this.requireBuilder();
    if (!this.state.selection) {
      throw new XtrataClientError('plan-invalid', 'select some inventory first');
    }
    return planCreatorInventory({
      builder,
      dropId: this.state.dropId ?? 0,
      selection: this.state.selection,
      ...(this.state.tokenIds.size > 0 ? { tokenIdByIndex: this.state.tokenIds } : {})
    });
  }

  /** Resolve minted token ids for the selection (needed to escrow). */
  async resolveTokenIds(): Promise<Map<number, number>> {
    const reads = this.requireCollectionReads();
    if (!this.state.selection) {
      throw new XtrataClientError('plan-invalid', 'select some inventory first');
    }
    const indexes = expandSelection(this.state.selection);
    this.set({ resolvingTokenIds: true, error: null });
    try {
      const tokenIds = new Map<number, number>();
      for (let i = 0; i < indexes.length; i += ITEMS_PAGE) {
        const page = indexes.slice(i, i + ITEMS_PAGE);
        const rows = await reads.getItems(page);
        page.forEach((index, position) => {
          const row = rows[position];
          if (row) tokenIds.set(index, row.tokenId);
        });
      }
      this.set({ tokenIds });
      return tokenIds;
    } catch (error) {
      this.set({ error: messageOf(error) });
      throw error;
    } finally {
      this.set({ resolvingTokenIds: false });
    }
  }

  /** Selected indexes with no minted token — they cannot be escrowed. */
  get unmintedSelected(): number[] {
    if (!this.state.selection || this.state.tokenIds.size === 0) return [];
    return expandSelection(this.state.selection).filter((index) => !this.state.tokenIds.has(index));
  }

  // --- steps 4/5: mode + configuration -------------------------------------

  setMode(mode: DropMode): void {
    this.set({ config: { ...this.state.config, mode } });
  }

  setEligibility(eligibility: DropEligibility): void {
    this.set({ config: { ...this.state.config, eligibility } });
  }

  updateConfig(patch: Partial<DropConfigDraft>): void {
    this.set({ config: { ...this.state.config, ...patch } });
  }

  setAllowlist(allowlist: AllowlistEntry[]): void {
    this.set({ allowlist });
  }

  setBudgetInput(microStx: bigint): void {
    this.set({ budgetInputMicroStx: microStx });
  }

  // --- step 6: exposure -----------------------------------------------------

  /**
   * Sponsor exposure straight from the client calculator, which mirrors the
   * contract's activation gate (`MIN-FEE-BUDGET × effective-limit`). The UI
   * never recomputes this itself.
   */
  get exposure(): SponsorExposure {
    return sponsorExposure({
      mode: this.state.config.mode,
      inventoryCount: this.state.drop?.inventoryCount ?? this.selectionCount,
      totalLimit: this.state.config.totalLimit,
      ...(this.state.claimFeeCap !== null ? { claimFeeCap: this.state.claimFeeCap } : {})
    });
  }

  /** Budget still needed to pass the activation gate, in microSTX. */
  get budgetShortfall(): bigint {
    if (this.state.config.mode !== 'sponsored') return 0n;
    const held = this.state.drop?.feeBudgetRemaining ?? 0n;
    const required = this.exposure.minimumBudget;
    return held >= required ? 0n : required - held;
  }

  // --- transaction execution -----------------------------------------------

  private requireCollectionReads(): CollectionReadsLike {
    const reads = this.deps.collectionReads;
    if (!reads) throw new XtrataClientError('plan-invalid', 'no collection is loaded');
    return reads;
  }

  private requireDropsReads(): DropsReadsLike {
    const reads = this.deps.dropsReads;
    if (!reads) throw new XtrataClientError('plan-invalid', 'the drops contract is not readable yet');
    return reads;
  }

  private requireBuilder(): DropsTxBuilder {
    const builder = this.deps.builder;
    if (!builder) {
      throw new XtrataClientError('plan-invalid', 'connect a wallet on the right network first');
    }
    return builder;
  }

  private requireDropId(): number {
    const dropId = this.state.dropId;
    if (dropId === null) throw new XtrataClientError('plan-invalid', 'no drop has been created yet');
    return dropId;
  }

  private logAppend(entry: TxLogEntry): void {
    this.set({ txLog: [...this.state.txLog, entry] });
  }

  private logUpdate(id: string, patch: Partial<TxLogEntry>): void {
    this.set({ txLog: this.state.txLog.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)) });
  }

  /**
   * Submit descriptors in order, confirming each before the next.
   *
   * Sequential on purpose: `add-inventory-range` and `escrow-batch` both
   * mutate counters the next transaction reads, and a nonce race here would
   * produce a half-built inventory that cannot be diagnosed from the log.
   * Stops at the first failure and leaves the drop in draft, which is exactly
   * the state a retry expects.
   */
  private async runTxs(label: string, txs: DropsTxDescriptor[]): Promise<boolean> {
    const submit = this.deps.submit;
    if (!submit) throw new XtrataClientError('plan-invalid', 'connect a wallet before submitting');
    for (let i = 0; i < txs.length; i += 1) {
      const tx = txs[i]!;
      const id = nextLogId();
      const step = txs.length > 1 ? ` ${i + 1}/${txs.length}` : '';
      this.logAppend({ id, label: `${label}${step}`, functionName: tx.functionName, status: 'submitting' });
      let txid: string;
      try {
        ({ txid } = await submit(tx));
      } catch (error) {
        this.logUpdate(id, { status: 'failed', error: messageOf(error) });
        this.set({ error: messageOf(error) });
        return false;
      }
      this.logUpdate(id, { status: 'confirming', txid });
      if (!this.deps.waitConfirm) {
        this.logUpdate(id, { status: 'success' });
        continue;
      }
      const result = await this.deps.waitConfirm(txid);
      if (result.status !== 'success') {
        this.logUpdate(id, {
          status: 'failed',
          error: `transaction ${result.status}`,
          ...(result.chainErrorCode !== undefined ? { chainErrorCode: result.chainErrorCode } : {})
        });
        this.set({ error: `${label}: transaction ${result.status}` });
        return false;
      }
      this.logUpdate(id, { status: 'success' });
    }
    return true;
  }

  private async withBusy<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.set({ busy: key, error: null });
    try {
      return await fn();
    } finally {
      this.set({ busy: null });
    }
  }

  // --- step 7: create, stock, fund, activate --------------------------------

  /**
   * `create-drop` returns the new id in its response, which a status poll does
   * not carry. Rather than parse a repr, the id observed before submitting is
   * verified after confirmation by reading the row back and checking that it
   * is ours; a concurrent creation by someone else shifts the id, so a short
   * forward scan resolves it.
   */
  async createDrop(): Promise<number> {
    const builder = this.requireBuilder();
    const reads = this.requireDropsReads();
    const address = this.deps.address;
    if (!address) throw new XtrataClientError('plan-invalid', 'connect a wallet first');
    if (!this.state.collectionId) {
      throw new XtrataClientError('plan-invalid', 'choose a collection first');
    }
    return this.withBusy('create', async () => {
      const expected = await reads.getNextDropId();
      const ok = await this.runTxs('Create drop', [
        builder.createDrop({
          mode: this.state.config.mode,
          eligibility: this.state.config.eligibility,
          startBlock: this.state.config.startBlock,
          endBlock: this.state.config.endBlock,
          totalLimit: this.state.config.totalLimit,
          perWalletLimit: this.state.config.perWalletLimit
        })
      ]);
      if (!ok) throw new XtrataClientError('broadcast-failed', 'create-drop did not confirm');

      for (let candidate = expected; candidate < expected + 8; candidate += 1) {
        const drop = await reads.getDrop(candidate);
        if (drop && drop.creator === address && drop.collection === this.state.collectionId) {
          this.set({ dropId: candidate, drop });
          return candidate;
        }
      }
      throw new XtrataClientError(
        'reconcile-mismatch',
        'create-drop confirmed but the new drop could not be identified on chain'
      );
    });
  }

  /** Attach the store to an existing drop (monitoring, recovery, deep links). */
  async attachDrop(dropId: number): Promise<DropRow> {
    const reads = this.requireDropsReads();
    const drop = await reads.getDrop(dropId);
    if (!drop) throw new XtrataClientError('plan-invalid', `drop ${dropId} does not exist`);
    this.set({
      dropId,
      drop,
      collectionId: drop.collection,
      config: {
        mode: modeOf(drop.mode),
        eligibility: eligibilityOf(drop.eligibility),
        startBlock: drop.startBlock,
        endBlock: drop.endBlock,
        totalLimit: drop.totalLimit,
        perWalletLimit: drop.perWalletLimit
      }
    });
    return drop;
  }

  async addInventory(): Promise<boolean> {
    const plan = this.planInventory();
    return this.withBusy('inventory', async () => {
      const ok = await this.runTxs('Add inventory', plan.inventoryTxs);
      await this.refreshDrop();
      return ok;
    });
  }

  async escrowInventory(): Promise<boolean> {
    if (this.state.tokenIds.size === 0) await this.resolveTokenIds();
    const plan = this.planInventory();
    if (!plan.escrowTxs) {
      throw new XtrataClientError('plan-invalid', 'token ids for the selection are not resolved');
    }
    return this.withBusy('escrow', async () => {
      const ok = await this.runTxs('Escrow items', plan.escrowTxs!);
      await this.refreshDrop();
      return ok;
    });
  }

  async applyAllowlist(): Promise<boolean> {
    const builder = this.requireBuilder();
    const dropId = this.requireDropId();
    if (this.state.allowlist.length === 0) {
      throw new XtrataClientError('plan-invalid', 'the allowlist is empty');
    }
    const txs: DropsTxDescriptor[] = [];
    for (let i = 0; i < this.state.allowlist.length; i += 200) {
      txs.push(builder.setAllowlistBatch(dropId, this.state.allowlist.slice(i, i + 200)));
    }
    return this.withBusy('allowlist', () => this.runTxs('Set allowlist', txs));
  }

  async fundBudget(amountMicroStx?: bigint): Promise<boolean> {
    const builder = this.requireBuilder();
    const dropId = this.requireDropId();
    const amount = amountMicroStx ?? this.state.budgetInputMicroStx;
    if (amount <= 0n) {
      throw new XtrataClientError('plan-invalid', 'enter a budget amount above zero');
    }
    return this.withBusy('fund', async () => {
      const ok = await this.runTxs('Fund budget', [builder.fundBudget(dropId, amount)]);
      await this.refreshDrop();
      return ok;
    });
  }

  /**
   * Activation gates, read from the drop row the contract itself maintains.
   *
   * Note the contract is STRICTER than the mode table suggests: `activate-drop`
   * asserts `escrowed-count == inventory-count` for every mode, not only for
   * pre-inscribed and sponsored ones, because `settle-claim` always pays out
   * of escrow. The gate list reflects the contract, not the table.
   */
  get activationGates(): { label: string; met: boolean; detail: string }[] {
    const drop = this.state.drop;
    const inventoryCount = drop?.inventoryCount ?? 0;
    const escrowed = drop?.escrowedCount ?? 0;
    const gates = [
      {
        label: 'Drop created',
        met: this.state.dropId !== null,
        detail: this.state.dropId !== null ? `Drop #${this.state.dropId}` : 'create-drop has not confirmed'
      },
      {
        label: 'Inventory resolved',
        met: inventoryCount > 0,
        detail: `${inventoryCount} item${inventoryCount === 1 ? '' : 's'} assigned to this drop`
      },
      {
        label: 'Every item escrowed',
        met: inventoryCount > 0 && escrowed >= inventoryCount,
        detail: `${escrowed} of ${inventoryCount} escrowed — the contract requires all of them, in every mode`
      }
    ];
    if (this.state.config.mode === 'sponsored') {
      const required = this.exposure.minimumBudget;
      const held = drop?.feeBudgetRemaining ?? 0n;
      gates.push({
        label: 'Sponsor budget funded',
        met: held >= required && required > 0n,
        detail: `${held} of ${required} µSTX (minimum fee budget × claimable items)`
      });
    }
    return gates;
  }

  get canActivate(): boolean {
    return this.activationGates.every((gate) => gate.met);
  }

  async activate(): Promise<boolean> {
    const builder = this.requireBuilder();
    const dropId = this.requireDropId();
    return this.withBusy('activate', async () => {
      const ok = await this.runTxs('Activate drop', [builder.activateDrop(dropId)]);
      await this.refreshDrop();
      if (ok) this.set({ step: 'monitor' });
      return ok;
    });
  }

  // --- steps 8/9: monitor + lifecycle --------------------------------------

  async refreshDrop(): Promise<DropRow | null> {
    const dropId = this.state.dropId;
    if (dropId === null) return null;
    const reads = this.requireDropsReads();
    const [drop, remaining] = await Promise.all([reads.getDrop(dropId), reads.getRemaining(dropId)]);
    this.set({ drop, remaining });
    return drop;
  }

  async loadClaims(): Promise<ClaimRow[]> {
    const dropId = this.requireDropId();
    const reads = this.requireDropsReads();
    this.set({ loadingClaims: true });
    try {
      const claims = await reads.getAllClaims(dropId);
      this.set({ claims });
      return claims;
    } finally {
      this.set({ loadingClaims: false });
    }
  }

  private async lifecycleTx(key: string, label: string, tx: DropsTxDescriptor): Promise<boolean> {
    return this.withBusy(key, async () => {
      const ok = await this.runTxs(label, [tx]);
      await this.refreshDrop();
      return ok;
    });
  }

  pauseDrop(): Promise<boolean> {
    return this.lifecycleTx('pause', 'Pause drop', this.requireBuilder().pauseDrop(this.requireDropId()));
  }

  resumeDrop(): Promise<boolean> {
    return this.lifecycleTx('resume', 'Resume drop', this.requireBuilder().resumeDrop(this.requireDropId()));
  }

  endDrop(): Promise<boolean> {
    return this.lifecycleTx('end', 'End drop', this.requireBuilder().endDrop(this.requireDropId()));
  }

  /** Cancel refunds the remaining budget in the same transaction. */
  cancelDrop(): Promise<boolean> {
    const drop = this.state.drop;
    const maxRefund = drop?.feeBudgetRemaining ?? 0n;
    return this.lifecycleTx(
      'cancel',
      'Cancel drop',
      this.requireBuilder().cancelDrop(this.requireDropId(), maxRefund)
    );
  }

  // --- step 10: recovery ----------------------------------------------------

  /**
   * Unclaimed inventory indexes, resolved from the chain, paired with whatever
   * is still escrowed for them. Reading escrow per index is O(inventory) calls
   * but it is the only way to build correct contract-outbound NFT
   * post-conditions for `recover-batch`.
   *
   * The index list comes from the DROP's own ranges and explicit slots when the
   * reads client can expand them, so this works on a freshly loaded page; the
   * session's selection is only a fallback.
   */
  async loadRecoverable(): Promise<{ indexes: number[]; escrowed: Map<number, number> }> {
    const dropId = this.requireDropId();
    const reads = this.requireDropsReads();
    const fromChain = reads.resolveInventory ? await reads.resolveInventory(dropId) : null;
    const selection = this.state.selection;
    const indexes = fromChain ?? (selection ? expandSelection(selection) : []);
    if (indexes.length === 0) {
      throw new XtrataClientError(
        'plan-invalid',
        'resolve the drop inventory before planning recovery (load it from the drop or re-select it)'
      );
    }
    const escrowed = new Map<number, number>();
    for (const index of indexes) {
      const tokenId = await reads.getEscrowedToken(dropId, index);
      if (tokenId !== null) escrowed.set(index, tokenId);
    }
    this.set({ escrowedTokenIds: escrowed });
    return { indexes, escrowed };
  }

  /** ceil(n / 25) recover-batch transactions. */
  planRecovery(indexes: number[]): DropsTxDescriptor[] {
    return planRecoveryTxs({
      builder: this.requireBuilder(),
      dropId: this.requireDropId(),
      indexes,
      escrowedTokenIdByIndex: this.state.escrowedTokenIds
    });
  }

  async runRecovery(indexes: number[]): Promise<boolean> {
    const txs = this.planRecovery(indexes);
    return this.withBusy('recover', async () => {
      const ok = await this.runTxs('Recover items', txs);
      await this.refreshDrop();
      return ok;
    });
  }
}

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const modeOf = (code: number): DropMode => {
  const found = (Object.keys(DROP_MODES) as DropMode[]).find((mode) => DROP_MODES[mode] === code);
  if (!found) throw new XtrataClientError('internal', `unknown drop mode u${code}`);
  return found;
};

export const eligibilityOf = (code: number): DropEligibility => {
  const found = (Object.keys(DROP_ELIGIBILITY) as DropEligibility[]).find(
    (value) => DROP_ELIGIBILITY[value] === code
  );
  if (!found) throw new XtrataClientError('internal', `unknown eligibility u${code}`);
  return found;
};

/** Parse a pasted allowlist ("SP… 3" / "SP…,3" / "SP…" per line). */
export const parseAllowlist = (text: string): { entries: AllowlistEntry[]; errors: string[] } => {
  const entries: AllowlistEntry[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .forEach((line, position) => {
      const [wallet, allowanceText] = line.split(/[\s,]+/);
      if (!wallet || !/^S[PTMN][0-9A-Z]{20,50}$/.test(wallet)) {
        errors.push(`line ${position + 1}: "${line}" is not a Stacks principal`);
        return;
      }
      if (seen.has(wallet)) {
        errors.push(`line ${position + 1}: ${wallet} appears more than once`);
        return;
      }
      const allowance = allowanceText === undefined ? 1 : Number(allowanceText);
      if (!Number.isInteger(allowance) || allowance <= 0) {
        errors.push(`line ${position + 1}: "${allowanceText}" is not a positive whole allowance`);
        return;
      }
      seen.add(wallet);
      entries.push({ wallet, allowance });
    });
  return { entries, errors };
};

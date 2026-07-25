import { describe, expect, it, vi } from 'vitest';
import {
  DropsTxBuilder,
  MIN_FEE_BUDGET,
  XtrataClientError,
  type ChainTxResult,
  type ClaimRow,
  type CollectionInfo,
  type DropRow,
  type DropsTxDescriptor,
  type ItemRow,
  type ScanEntry
} from '@xtrata/collections-client';
import {
  DropsBuilderStore,
  parseAllowlist,
  type CollectionReadsLike,
  type DropsBuilderDeps,
  type DropsReadsLike
} from './store';
import { expandSelection } from './inventory';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DROPS = `${DEPLOYER}.xtrata-drops-v3`;
const CORE = `${DEPLOYER}.xtrata-v3-2-3`;
const COLLECTION = `${DEPLOYER}.my-collection`;
const CREATOR = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const collectionInfo = (patch: Partial<CollectionInfo> = {}): CollectionInfo => ({
  name: 'Test Collection',
  symbol: 'TEST',
  description: '',
  artworkUri: '',
  baseUri: '',
  owner: CREATOR,
  operatorAdmin: CREATOR,
  financeAdmin: CREATOR,
  supplyMode: 1,
  maxSupply: 0,
  mintedCount: 100,
  reservedCount: 0,
  nextIndex: 100,
  freeCount: 0,
  mintPrice: 0n,
  activePhaseId: 1,
  reservationExpiryBlocks: 144,
  paused: false,
  finalized: false,
  dropsAuthority: DROPS,
  coreContract: CORE,
  ...patch
});

const drop = (patch: Partial<DropRow> = {}): DropRow => ({
  creator: CREATOR,
  collection: COLLECTION,
  mode: 1,
  status: 0,
  statusName: 'draft',
  startBlock: 0,
  endBlock: 0,
  totalLimit: 0,
  perWalletLimit: 1,
  eligibility: 1,
  feeBudgetTotal: 0n,
  feeBudgetRemaining: 0n,
  feesSettled: 0,
  inventoryCount: 0,
  rangesTotal: 0,
  rangeCount: 0,
  explicitCount: 0,
  escrowedCount: 0,
  claimedCount: 0,
  reservedCount: 0,
  freeCount: 0,
  cursor: 0,
  createdAt: 10,
  endedAt: null,
  ...patch
});

/** A collection contract that answers scans and item rows, page by page. */
const fakeCollectionReads = (params: {
  info?: Partial<CollectionInfo>;
  assigned?: Iterable<number>;
}): CollectionReadsLike & { itemCalls: number[][] } => {
  const info = collectionInfo(params.info);
  const assigned = new Set(params.assigned ?? []);
  const itemCalls: number[][] = [];
  return {
    itemCalls,
    getCollectionInfo: async () => info,
    getUnassignedScan: async (start: number): Promise<ScanEntry[]> => {
      const entries: ScanEntry[] = [];
      for (let index = start; index < Math.min(start + 50, info.nextIndex); index += 1) {
        entries.push({ index, minted: true, assigned: assigned.has(index) });
      }
      return entries;
    },
    getItems: async (indexes: number[]): Promise<(ItemRow | null)[]> => {
      itemCalls.push(indexes);
      return indexes.map((index) => ({
        tokenId: 9_000 + index,
        ownerAtMint: CREATOR,
        phaseId: 1,
        mintedAt: 5,
        contentHashHex: '00'.repeat(32)
      }));
    }
  };
};

/** A drops singleton whose row the test can advance between transactions. */
const fakeDropsReads = (initial: DropRow | null = null) => {
  const state = { row: initial, nextId: 4, claims: [] as ClaimRow[], escrowed: new Map<number, number>() };
  const reads: DropsReadsLike = {
    getDrop: async (dropId) => (dropId === 4 ? state.row : null),
    getNextDropId: async () => state.nextId,
    getRemaining: async () => (state.row ? state.row.inventoryCount - state.row.claimedCount : 0),
    getAllClaims: async () => state.claims,
    getClaimFeeCap: async () => 300_000n,
    getMinFeeBudget: async () => MIN_FEE_BUDGET,
    getEscrowedToken: async (_dropId, index) => state.escrowed.get(index) ?? null,
    getAttestorPubkeyHash: async () => null,
    isPaused: async () => false
  };
  return { reads, state };
};

const builder = (): DropsTxBuilder =>
  new DropsTxBuilder({
    dropsContractId: DROPS,
    collectionContractId: COLLECTION,
    nftContractId: CORE,
    network: 'mainnet',
    sender: CREATOR
  });

const success = async (txid: string): Promise<ChainTxResult> => ({ txid, status: 'success' });

const makeStore = (overrides: Partial<DropsBuilderDeps> = {}): {
  store: DropsBuilderStore;
  submitted: DropsTxDescriptor[];
} => {
  const submitted: DropsTxDescriptor[] = [];
  const store = new DropsBuilderStore({
    dropsContractId: DROPS,
    coreContractId: CORE,
    network: 'mainnet',
    address: CREATOR,
    builder: builder(),
    submit: async (tx) => {
      submitted.push(tx);
      return { txid: `0x${submitted.length.toString(16).padStart(64, '0')}` };
    },
    waitConfirm: success,
    ...overrides
  });
  store.setCollectionId(COLLECTION);
  return { store, submitted };
};

describe('collection loading', () => {
  it('reads the collection from chain and keeps it in state', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });

    await store.loadCollection();

    expect(store.getState().collectionInfo?.name).toBe('Test Collection');
    expect(store.getState().collectionInfo?.mintedCount).toBe(100);
  });

  it('refuses to work without a collection rather than guessing', async () => {
    const { store } = makeStore();
    await expect(store.loadCollection()).rejects.toThrow(XtrataClientError);
  });

  it('changing the collection discards the selection built from the old one', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    expect(store.selectionCount).toBe(100);

    store.setCollectionId(`${DEPLOYER}.other-collection`);

    expect(store.getState().selection).toBeNull();
    expect(store.getState().collectionInfo).toBeNull();
  });
});

describe('one-action inventory selection, end to end through the store', () => {
  it('selects every unassigned item across a fragmented 100-item collection', async () => {
    // Inscribed in four batches; two other drops already took scattered items.
    const collectionReads = fakeCollectionReads({ assigned: [0, 1, 2, 37, 60, 61, 62, 99] });
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();

    const selection = await store.selectAllUnassigned();

    expect(store.selectionCount).toBe(92);
    expect(store.getState().selectionSource).toBe('all-unassigned');
    expect(selection.ranges).toEqual([
      { start: 3, end: 37 },
      { start: 38, end: 60 },
      { start: 63, end: 99 }
    ]);
    const summary = store.planSummary!;
    expect(summary.rangeTxs).toBe(3);
    expect(summary.explicitTxs).toBe(0);
    expect(summary.escrowTxs).toBe(Math.ceil(92 / 25)); // 4
    expect(summary.totalTxs).toBe(3 + 4 + 1);
  });

  it('produces a legal, re-fitted plan for a pathologically fragmented collection', async () => {
    const assigned: number[] = [];
    for (let run = 0; run < 40; run += 1) assigned.push(run * 3 + 2);
    const collectionReads = fakeCollectionReads({
      info: { mintedCount: 120, nextIndex: 120 },
      assigned
    });
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();

    await store.selectAllUnassigned();

    expect(store.getState().selectionRefitted).toBe(true);
    expect(store.planSummary!.rangeSegments).toBe(25);
    expect(store.planSummary!.exceedsRangeCap).toBe(false);
    expect(store.selectionCount).toBe(80);
    expect(store.planInventory().inventoryTxs).toHaveLength(
      store.planSummary!.rangeTxs + store.planSummary!.explicitTxs
    );
  });

  it('offers whole-collection, range and explicit selection too', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();

    expect(store.selectWholeCollection().ranges).toEqual([{ start: 0, end: 100 }]);
    expect(store.selectIndexRange(10, 20).ranges).toEqual([{ start: 10, end: 20 }]);
    expect(store.selectExplicitIndexes([9, 3, 7]).explicit).toEqual([3, 7, 9]);
    expect(store.getState().selectionSource).toBe('explicit');
  });

  it('rejects a range that runs off the end of the collection', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();
    expect(() => store.selectIndexRange(90, 120)).toThrow(/beyond the collection/);
    expect(() => store.selectIndexRange(20, 20)).toThrow(XtrataClientError);
  });

  it('resolves token ids in pages of 50 so escrow can be planned', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();
    await store.selectAllUnassigned();

    const tokenIds = await store.resolveTokenIds();

    expect(tokenIds.size).toBe(100);
    expect(tokenIds.get(42)).toBe(9_042);
    expect(collectionReads.itemCalls).toHaveLength(2);
    expect(collectionReads.itemCalls[0]).toHaveLength(50);
  });
});

describe('creating and stocking a drop', () => {
  it('creates the drop, identifies its id on chain and stores the row', async () => {
    const collectionReads = fakeCollectionReads({});
    const { reads, state } = fakeDropsReads();
    const { store, submitted } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    state.row = drop();

    const dropId = await store.createDrop();

    expect(dropId).toBe(4);
    expect(submitted).toHaveLength(1);
    expect(submitted[0]!.functionName).toBe('create-drop');
    expect(store.getState().drop?.creator).toBe(CREATOR);
    expect(store.getState().txLog[0]).toMatchObject({ status: 'success', functionName: 'create-drop' });
  });

  it('does not claim a drop id that is not ours', async () => {
    const collectionReads = fakeCollectionReads({});
    const { reads, state } = fakeDropsReads();
    state.row = drop({ creator: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE' });
    const { store } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();

    await expect(store.createDrop()).rejects.toThrow(/could not be identified/);
  });

  it('submits one inventory transaction per planned descriptor, in order', async () => {
    const collectionReads = fakeCollectionReads({ assigned: [10, 40, 70] });
    const { reads, state } = fakeDropsReads(drop());
    const { store, submitted } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);
    state.row = drop({ inventoryCount: 97 });

    const ok = await store.addInventory();

    expect(ok).toBe(true);
    expect(submitted.map((tx) => tx.functionName)).toEqual([
      'add-inventory-range',
      'add-inventory-range',
      'add-inventory-range',
      'add-inventory-range'
    ]);
    expect(store.getState().txLog.map((entry) => entry.label)).toEqual([
      'Add inventory 1/4',
      'Add inventory 2/4',
      'Add inventory 3/4',
      'Add inventory 4/4'
    ]);
  });

  it('stops at the first failing transaction and leaves the rest unsent', async () => {
    const collectionReads = fakeCollectionReads({ assigned: [10, 40, 70] });
    const { reads } = fakeDropsReads(drop());
    const submitted: DropsTxDescriptor[] = [];
    const { store } = makeStore({
      collectionReads,
      dropsReads: reads,
      submit: async (tx) => {
        submitted.push(tx);
        return { txid: `0x${submitted.length}` };
      },
      waitConfirm: async (txid) =>
        submitted.length === 2
          ? { txid, status: 'abort_by_response', chainErrorCode: 207 }
          : { txid, status: 'success' }
    });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);

    const ok = await store.addInventory();

    expect(ok).toBe(false);
    expect(submitted).toHaveLength(2);
    const failed = store.getState().txLog.find((entry) => entry.status === 'failed');
    expect(failed?.chainErrorCode).toBe(207);
    expect(store.getState().error).toContain('abort_by_response');
  });

  it('escrows in batches of 25 after resolving token ids automatically', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 60, nextIndex: 60 } });
    const { reads } = fakeDropsReads(drop({ inventoryCount: 60 }));
    const { store, submitted } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);

    await store.escrowInventory();

    expect(submitted.map((tx) => tx.functionName)).toEqual([
      'escrow-batch',
      'escrow-batch',
      'escrow-batch'
    ]);
    expect(store.getState().tokenIds.size).toBe(60);
  });

  it('writes the allowlist in batches of 200', async () => {
    const collectionReads = fakeCollectionReads({});
    const { reads } = fakeDropsReads(drop({ eligibility: 2 }));
    const { store, submitted } = makeStore({ collectionReads, dropsReads: reads });
    await store.attachDrop(4);
    store.setAllowlist(
      Array.from({ length: 250 }, () => ({ wallet: CREATOR, allowance: 1 }))
    );

    await store.applyAllowlist();

    expect(submitted).toHaveLength(2);
    expect(submitted[0]!.functionName).toBe('set-allowlist-batch');
  });
});

describe('sponsor exposure and the activation gates', () => {
  it('matches the client calculation for a sponsored drop', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 40, nextIndex: 40 } });
    const { reads } = fakeDropsReads();
    const { store } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.loadChainContext();
    store.setMode('sponsored');

    const exposure = store.exposure;

    expect(exposure.claimable).toBe(40);
    expect(exposure.minimumBudget).toBe(MIN_FEE_BUDGET * 40n);
    expect(exposure.worstCaseSettlement).toBe(300_000n * 40n);
  });

  it('caps claimable at the total limit, exactly as the contract does', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 40, nextIndex: 40 } });
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    store.setMode('sponsored');
    store.updateConfig({ totalLimit: 10 });

    expect(store.exposure.claimable).toBe(10);
    expect(store.exposure.minimumBudget).toBe(MIN_FEE_BUDGET * 10n);
  });

  it('reports zero exposure for unsponsored modes', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    await store.loadCollection();
    await store.selectAllUnassigned();

    store.setMode('pre-inscribed');
    expect(store.exposure.minimumBudget).toBe(0n);
    store.setMode('zero-price');
    expect(store.exposure.minimumBudget).toBe(0n);
    expect(store.budgetShortfall).toBe(0n);
  });

  it('blocks activation until the chain-side counters say every gate is met', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 10, nextIndex: 10 } });
    const { reads, state } = fakeDropsReads(drop({ inventoryCount: 0 }));
    const { store } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);
    expect(store.canActivate).toBe(false);

    state.row = drop({ inventoryCount: 10, escrowedCount: 4 });
    await store.refreshDrop();
    expect(store.canActivate).toBe(false);
    expect(store.activationGates.find((gate) => gate.label === 'Every item escrowed')?.detail).toContain(
      '4 of 10'
    );

    state.row = drop({ inventoryCount: 10, escrowedCount: 10 });
    await store.refreshDrop();
    expect(store.canActivate).toBe(true);
  });

  it('adds a budget gate for sponsored drops and clears it once funded', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 10, nextIndex: 10 } });
    const { reads, state } = fakeDropsReads(drop({ mode: 3, inventoryCount: 10, escrowedCount: 10 }));
    const { store } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);

    expect(store.getState().config.mode).toBe('sponsored');
    expect(store.canActivate).toBe(false);
    expect(store.budgetShortfall).toBe(MIN_FEE_BUDGET * 10n);

    state.row = drop({
      mode: 3,
      inventoryCount: 10,
      escrowedCount: 10,
      feeBudgetRemaining: MIN_FEE_BUDGET * 10n,
      feeBudgetTotal: MIN_FEE_BUDGET * 10n
    });
    await store.refreshDrop();

    expect(store.budgetShortfall).toBe(0n);
    expect(store.canActivate).toBe(true);
  });

  it('funds the budget with a spend cap equal to the amount', async () => {
    const { reads } = fakeDropsReads(drop({ mode: 3 }));
    const { store, submitted } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);
    store.setBudgetInput(500_000n);

    await store.fundBudget();

    expect(submitted[0]!.functionName).toBe('fund-budget');
    expect(submitted[0]!.postConditions).toHaveLength(1);
    await expect(store.fundBudget(0n)).rejects.toThrow(/above zero/);
  });

  it('activates and moves to the dashboard', async () => {
    const { reads, state } = fakeDropsReads(drop({ inventoryCount: 5, escrowedCount: 5 }));
    const { store, submitted } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);
    state.row = drop({ inventoryCount: 5, escrowedCount: 5, status: 1, statusName: 'active' });

    await store.activate();

    expect(submitted[0]!.functionName).toBe('activate-drop');
    expect(store.getState().step).toBe('monitor');
    expect(store.getState().drop?.statusName).toBe('active');
  });
});

describe('monitoring and lifecycle', () => {
  it('loads claims and the remaining count from chain', async () => {
    const { reads, state } = fakeDropsReads(drop({ inventoryCount: 10, claimedCount: 2 }));
    state.claims = [
      { index: 0, claimer: CREATOR, claimedAt: 12 },
      { index: 1, claimer: CREATOR, claimedAt: 13 }
    ];
    const { store } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);

    await store.refreshDrop();
    const claims = await store.loadClaims();

    expect(claims).toHaveLength(2);
    expect(store.getState().remaining).toBe(8);
  });

  it('adopts the drop’s own configuration when attaching to an existing drop', async () => {
    const { reads } = fakeDropsReads(
      drop({ mode: 3, eligibility: 2, startBlock: 100, endBlock: 200, totalLimit: 5, perWalletLimit: 2 })
    );
    const { store } = makeStore({ dropsReads: reads });

    await store.attachDrop(4);

    expect(store.getState().config).toEqual({
      mode: 'sponsored',
      eligibility: 'allowlist',
      startBlock: 100,
      endBlock: 200,
      totalLimit: 5,
      perWalletLimit: 2
    });
    expect(store.getState().collectionId).toBe(COLLECTION);
  });

  it('caps the cancel refund at the budget actually remaining', async () => {
    const { reads } = fakeDropsReads(drop({ status: 1, statusName: 'active', feeBudgetRemaining: 777n }));
    const { store, submitted } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);

    await store.cancelDrop();

    expect(submitted[0]!.functionName).toBe('cancel-drop');
    // Sender zero-spend cap + contract-outbound refund cap.
    expect(submitted[0]!.postConditions).toHaveLength(2);
  });

  it('pauses, resumes and ends through the builder', async () => {
    const { reads } = fakeDropsReads(drop({ status: 1, statusName: 'active' }));
    const { store, submitted } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);

    await store.pauseDrop();
    await store.resumeDrop();
    await store.endDrop();

    expect(submitted.map((tx) => tx.functionName)).toEqual(['pause-drop', 'resume-drop', 'end-drop']);
  });
});

describe('recovery', () => {
  it('finds what is still escrowed and plans ceil(n / 25) transactions', async () => {
    const collectionReads = fakeCollectionReads({ info: { mintedCount: 30, nextIndex: 30 } });
    const { reads, state } = fakeDropsReads(
      drop({ inventoryCount: 30, escrowedCount: 28, status: 3, statusName: 'ended' })
    );
    for (let index = 2; index < 30; index += 1) state.escrowed.set(index, 9_000 + index);
    const { store, submitted } = makeStore({ collectionReads, dropsReads: reads });
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.attachDrop(4);

    const { indexes, escrowed } = await store.loadRecoverable();
    expect(indexes).toHaveLength(30);
    expect(escrowed.size).toBe(28);

    const txs = store.planRecovery(indexes);
    expect(txs).toHaveLength(2);

    await store.runRecovery(indexes);
    expect(submitted.map((tx) => tx.functionName)).toEqual(['recover-batch', 'recover-batch']);
  });

  it('refuses to plan recovery without the resolved inventory', async () => {
    const { reads } = fakeDropsReads(drop({ status: 3, statusName: 'ended' }));
    const { store } = makeStore({ dropsReads: reads });
    await store.attachDrop(4);
    await expect(store.loadRecoverable()).rejects.toThrow(/resolve the drop inventory/);
  });

  it('reads the index list from the drop itself, so recovery survives a reload', async () => {
    const { reads, state } = fakeDropsReads(
      drop({ inventoryCount: 4, escrowedCount: 4, status: 3, statusName: 'ended' })
    );
    for (const index of [10, 11, 12, 40]) state.escrowed.set(index, 9_000 + index);
    // No session selection at all — a page that was just opened on ?drop=4.
    const { store } = makeStore({
      dropsReads: { ...reads, resolveInventory: async () => [10, 11, 12, 40] }
    });
    await store.attachDrop(4);

    const { indexes, escrowed } = await store.loadRecoverable();

    expect(indexes).toEqual([10, 11, 12, 40]);
    expect(escrowed.size).toBe(4);
    expect(store.planRecovery(indexes)).toHaveLength(1);
  });
});

describe('guards', () => {
  it('will not submit without a wallet-bound builder', async () => {
    const { reads } = fakeDropsReads(drop());
    const store = new DropsBuilderStore({
      dropsContractId: DROPS,
      coreContractId: CORE,
      network: 'mainnet',
      dropsReads: reads
    });
    expect(store.canSubmit).toBe(false);
    await expect(store.createDrop()).rejects.toThrow(/connect a wallet/);
  });

  it('will not create a drop before a collection is chosen', async () => {
    const { reads } = fakeDropsReads(drop());
    const { store } = makeStore({ dropsReads: reads });
    store.setCollectionId('');
    await expect(store.createDrop()).rejects.toThrow(/choose a collection/);
  });

  it('notifies subscribers on every state change', async () => {
    const collectionReads = fakeCollectionReads({});
    const { store } = makeStore({ collectionReads });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    await store.loadCollection();
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    const calls = listener.mock.calls.length;
    store.setStep('mode');
    expect(listener.mock.calls.length).toBe(calls);
  });
});

describe('parseAllowlist', () => {
  it('accepts one wallet per line with an optional allowance', () => {
    const { entries, errors } = parseAllowlist(
      `${CREATOR} 3\n${DEPLOYER},2\n# a comment\n\nSP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE`
    );
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { wallet: CREATOR, allowance: 3 },
      { wallet: DEPLOYER, allowance: 2 },
      { wallet: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE', allowance: 1 }
    ]);
  });

  it('reports bad principals, duplicates and bad allowances by line', () => {
    const { entries, errors } = parseAllowlist(`not-a-principal\n${CREATOR} 2\n${CREATOR} 1\n${DEPLOYER} 0`);
    expect(entries).toHaveLength(1);
    expect(errors).toHaveLength(3);
    expect(errors[0]).toContain('line 1');
    expect(errors[1]).toContain('more than once');
    expect(errors[2]).toContain('positive whole allowance');
  });
});

describe('expandSelection ordering matches the contract slot order', () => {
  it('expands ranges in sequence order, then explicit slots', () => {
    expect(
      expandSelection({ ranges: [{ start: 5, end: 8 }, { start: 20, end: 22 }], explicit: [1, 99] })
    ).toEqual([5, 6, 7, 20, 21, 1, 99]);
  });
});

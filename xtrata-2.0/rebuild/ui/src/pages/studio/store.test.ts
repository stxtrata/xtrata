import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHUNK_SIZE,
  buildReport,
  flatFeeSchedule,
  initialProgress,
  transition,
  XtrataClientError,
  type ChainObserver,
  type ExecutorEvent,
  type ExecutorRunResult,
  type Manifest,
  type TransactionPlan,
  type TxDescriptor
} from '@xtrata/collections-client';
import {
  makeStudioFile,
  StudioStore,
  type ExecutorLike,
  type StudioDeps,
  type StudioFile
} from './store';

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const DROPS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3';

const FEES = flatFeeSchedule({ beginFee: 3_000n, perChunkFee: 1_000n, sealBaseFee: 2_000n });

const file = (name: string, size: number, seed = 1): StudioFile =>
  makeStudioFile({
    name,
    bytes: Uint8Array.from({ length: size }, (_, i) => (i * 7 + seed) % 251),
    mimeType: 'image/png'
  });

const memoryStorage = (): StudioDeps['storage'] => {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key)
  };
};

const observer: ChainObserver = {
  observeItem: async () => ({ sessionExists: false }),
  getTxStatus: async (txid) => ({ txid, status: 'success' }),
  getBlockHeight: async () => 100
};

/**
 * A stand-in executor that walks each item through the real state machine and
 * reports the same `ExecutorRunResult` shape the real one does. It lets the
 * store's wiring be tested without a chain or a wallet — and, because it uses
 * the client's own `transition()`, an illegal state sequence would throw here
 * exactly as it would in production.
 */
const fakeExecutor = (params: {
  onEvent: (event: ExecutorEvent) => void;
  submit: (tx: TxDescriptor) => Promise<{ txid: string }>;
  failIndexes?: number[];
  stopAfter?: number;
}): ExecutorLike & { submitted: number } => {
  const impl = {
    submitted: 0,
    async run(manifest: Manifest, plan: TransactionPlan): Promise<ExecutorRunResult> {
      let paused = false;
      let pauseReason: string | undefined;
      const progress = manifest.items.map((item) => initialProgress(item.index, item.chunkCount));

      const emit = (index: number): void => {
        const entry = progress[index]!;
        params.onEvent({ type: 'item-state', index, state: entry.state, progress: entry });
      };

      for (const item of manifest.items) {
        if (paused) break;
        const fake: TxDescriptor = {
          contractAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
          contractName: 'c-v1',
          functionName: 'mint-small-single-tx',
          functionArgs: [],
          postConditions: [],
          postConditionMode: 'deny',
          network: 'mainnet'
        };
        try {
          await params.submit(fake);
          impl.submitted += 1;
        } catch (error) {
          paused = true;
          pauseReason = error instanceof Error ? error.message : String(error);
          break;
        }
        if (params.failIndexes?.includes(item.index)) {
          progress[item.index] = {
            ...progress[item.index]!,
            state: 'failed',
            error: 'simulated failure'
          };
          emit(item.index);
          continue;
        }
        progress[item.index] = transition(progress[item.index]!, 'seal-submitted');
        emit(item.index);
        progress[item.index] = transition(progress[item.index]!, 'confirmed', {
          txid: `0x${item.index.toString(16).padStart(64, '0')}`
        });
        emit(item.index);
        progress[item.index] = transition(progress[item.index]!, 'indexed');
        emit(item.index);
        if (params.stopAfter !== undefined && impl.submitted >= params.stopAfter) {
          paused = true;
          pauseReason = 'stopped for the test';
          break;
        }
      }

      if (paused) params.onEvent({ type: 'run-paused', reason: pauseReason ?? 'paused' });
      else params.onEvent({ type: 'run-complete' });

      return {
        report: buildReport({
          manifest,
          progress,
          estimatedFeeMicroStx: plan.totalEstimatedFeeMicroStx
        }),
        progress,
        paused,
        ...(pauseReason !== undefined ? { pauseReason } : {})
      };
    }
  };
  return impl;
};

const makeStore = (
  overrides: Partial<StudioDeps> = {}
): { store: StudioStore; submit: ReturnType<typeof vi.fn> } => {
  const submit = vi.fn(async (_tx: TxDescriptor) => ({ txid: '0xdeadbeef' }));
  const store = new StudioStore({
    coreContractId: CORE,
    dropsContractId: DROPS,
    network: 'mainnet',
    storage: memoryStorage(),
    effects: { observer, submit, waitConfirm: async (txid) => ({ txid, status: 'success' }) },
    createExecutor: ({ onEvent, effects }) => fakeExecutor({ onEvent, submit: effects.submit }),
    ...overrides
  });
  store.updateDraft({ name: 'Wired Collection', symbol: 'WIRE' });
  return { store, submit };
};

describe('StudioStore — ingest', () => {
  let store: StudioStore;
  beforeEach(() => {
    ({ store } = makeStore());
  });

  it('keeps import order as the collection index assignment', () => {
    store.addFiles([file('b.png', 10), file('a.png', 10, 2), file('c.png', 10, 3)]);
    expect(store.getState().files.map((f) => f.name)).toEqual(['b.png', 'a.png', 'c.png']);

    const manifest = store.buildManifest();
    expect(manifest.items.map((i) => i.fileName)).toEqual(['b.png', 'a.png', 'c.png']);
    expect(manifest.items.map((i) => i.index)).toEqual([0, 1, 2]);
  });

  it('natural-sorts so img2 precedes img10', () => {
    store.addFiles([file('img10.png', 10, 1), file('img2.png', 10, 2), file('img1.png', 10, 3)]);
    store.sortNatural();
    expect(store.getState().files.map((f) => f.name)).toEqual(['img1.png', 'img2.png', 'img10.png']);
  });

  it('reorders manually and reassigns indexes accordingly', () => {
    store.addFiles([file('a.png', 10, 1), file('b.png', 10, 2)]);
    const [, second] = store.getState().files;
    store.moveFile(second!.id, -1);
    expect(store.buildManifest().items.map((i) => i.fileName)).toEqual(['b.png', 'a.png']);
  });

  it('classifies items as single-tx or staged by chunk count', () => {
    store.addFiles([file('small.png', 1_000, 1), file('big.png', CHUNK_SIZE * 33, 2)]);
    const manifest = store.buildManifest();
    expect(manifest.items[0]!.mode).toBe('single-tx');
    expect(manifest.items[1]!.mode).toBe('staged');
    expect(manifest.items[1]!.chunkCount).toBe(33);
  });

  it('surfaces duplicate content before ingest and rejects it by default', () => {
    store.addFiles([file('a.png', 64, 5), { ...file('copy.png', 64, 5), id: 'dup' }]);
    expect(store.detectDuplicates().groups).toHaveLength(1);
    expect(() => store.buildManifest()).toThrow(XtrataClientError);
    try {
      store.buildManifest();
    } catch (error) {
      expect((error as XtrataClientError).code).toBe('duplicate-content');
    }
  });

  it('drops later duplicates under the dedupe policy', () => {
    store.addFiles([file('a.png', 64, 5), { ...file('copy.png', 64, 5), id: 'dup' }]);
    store.setDuplicatePolicy('dedupe');
    expect(store.buildManifest().items).toHaveLength(1);
  });

  it('merges shared metadata into every item, with per-item overrides winning', () => {
    store.addFiles([file('a.png', 10, 1), file('b.png', 10, 2)]);
    store.setSharedMetadata({ artist: 'Anon', year: '2026' });
    const [first] = store.getState().files;
    store.setFileField(first!.id, { metadata: { artist: 'Named' } });

    const manifest = store.buildManifest();
    expect(manifest.items[0]!.metadata).toEqual({ artist: 'Named', year: '2026' });
    expect(manifest.items[1]!.metadata).toEqual({ artist: 'Anon', year: '2026' });
  });

  it('carries per-item URIs into the manifest', () => {
    store.addFiles([file('a.png', 10, 1)]);
    const [first] = store.getState().files;
    store.setFileField(first!.id, { itemUri: 'ipfs://item-0' });
    expect(store.buildManifest().items[0]!.itemUri).toBe('ipfs://item-0');
  });

  it('refuses to build a manifest with no files', () => {
    expect(() => store.buildManifest()).toThrow(/no files imported/);
  });

  it('invalidates the plan whenever the inputs change', () => {
    store.addFiles([file('a.png', 10, 1)]);
    store.buildManifest();
    store.setFees(FEES, 'test');
    store.buildPlan();
    expect(store.getState().plan).not.toBeNull();

    store.addFiles([file('b.png', 10, 2)]);
    expect(store.getState().plan).toBeNull();
    expect(store.getState().manifest).toBeNull();
  });
});

describe('StudioStore — plan', () => {
  it('builds a plan whose totals come from the client planner', () => {
    const { store } = makeStore();
    store.addFiles([file('a.png', 1_000, 1), file('b.png', CHUNK_SIZE * 40, 2)]);
    store.buildManifest();
    store.setFees(FEES, 'test schedule');

    const plan = store.buildPlan();
    expect(plan.totalTxs).toBeGreaterThan(0);
    expect(plan.items).toHaveLength(2);
    // Staged item: begin + ceil(40/32)=2 chunk batches, sealed in a batch.
    expect(plan.items[1]!.chunkBatchCount).toBe(2);
    expect(plan.items[1]!.sealedInBatch).toBe(true);
    expect(plan.totalEstimatedFeeMicroStx).toBeGreaterThan(0n);
    expect(store.getState().feeSource).toBe('test schedule');
  });

  it('will not plan without a fee schedule', () => {
    const { store } = makeStore();
    store.addFiles([file('a.png', 10, 1)]);
    store.buildManifest();
    expect(() => store.buildPlan()).toThrow(/no fee schedule/);
  });
});

describe('StudioStore — run', () => {
  const prepared = (overrides: Partial<StudioDeps> = {}) => {
    const made = makeStore(overrides);
    made.store.addFiles([file('a.png', 500, 1), file('b.png', 500, 2), file('c.png', 500, 3)]);
    made.store.buildManifest();
    made.store.setFees(FEES, 'test');
    made.store.buildPlan();
    return made;
  };

  it('drives the executor with the manifest and plan it built', async () => {
    const seen: { manifest: Manifest; plan: TransactionPlan }[] = [];
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) => {
        const inner = fakeExecutor({ onEvent, submit: effects.submit });
        return {
          run: (manifest, plan) => {
            seen.push({ manifest, plan });
            return inner.run(manifest, plan);
          }
        };
      }
    });

    await store.startRun();

    expect(seen).toHaveLength(1);
    expect(seen[0]!.manifest).toBe(store.getState().manifest);
    expect(seen[0]!.plan.totalTxs).toBe(store.getState().plan!.totalTxs);
  });

  it('announces on-chain verification before it announces running', async () => {
    const phases: string[] = [];
    const { store } = prepared();
    const unsubscribe = store.subscribe(() => {
      const phase = store.getState().run.phase;
      if (phases[phases.length - 1] !== phase) phases.push(phase);
    });

    await store.startRun();
    unsubscribe();

    expect(phases[0]).toBe('verifying');
    expect(phases).toContain('running');
    expect(phases[phases.length - 1]).toBe('complete');
  });

  it('reflects per-item progress from executor events', async () => {
    const { store } = prepared();
    await store.startRun();

    expect(store.getState().progress.map((p) => p.state)).toEqual([
      'indexed',
      'indexed',
      'indexed'
    ]);
    expect(store.getState().report?.totals.succeeded).toBe(3);
    expect(store.getState().step).toBe('complete');
  });

  it('isolates a failed item and leaves the rest indexed', async () => {
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) =>
        fakeExecutor({ onEvent, submit: effects.submit, failIndexes: [1] })
    });

    await store.startRun();

    expect(store.getState().progress.map((p) => p.state)).toEqual([
      'indexed',
      'failed',
      'indexed'
    ]);
    expect(store.failedCount).toBe(1);
  });

  it('retry-failed resets only the failed items and runs again', async () => {
    let runs = 0;
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) => {
        runs += 1;
        return fakeExecutor({
          onEvent,
          submit: effects.submit,
          ...(runs === 1 ? { failIndexes: [1] } : {})
        });
      }
    });

    await store.startRun();
    expect(store.failedCount).toBe(1);

    await store.retryFailed();

    expect(runs).toBe(2);
    expect(store.failedCount).toBe(0);
    expect(store.getState().progress.every((p) => p.state === 'indexed')).toBe(true);
  });

  it('builds a NEW executor per run, so every resume reconciles from chain', async () => {
    const built: number[] = [];
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) => {
        built.push(built.length);
        return fakeExecutor({ onEvent, submit: effects.submit });
      }
    });

    await store.startRun();
    await store.resumeRun();

    expect(built).toHaveLength(2);
  });

  it('pausing stops at the next transaction boundary and stays resumable', async () => {
    let pauseAfterFirst = true;
    let storeRef: StudioStore;
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) =>
        fakeExecutor({
          onEvent,
          submit: async (tx) => {
            const result = await effects.submit(tx);
            if (pauseAfterFirst) {
              pauseAfterFirst = false;
              storeRef.requestPause();
            }
            return result;
          }
        })
    });
    storeRef = store;

    await store.startRun();

    // The first item went through; the pause landed at the next boundary.
    expect(store.getState().run.phase).toBe('paused');
    expect(store.getState().step).toBe('run');
    expect(store.getState().progress[0]!.state).toBe('indexed');
    expect(store.getState().progress[2]!.state).toBe('prepared');

    // Resuming clears the pause request and lets the run finish.
    await store.resumeRun();
    expect(store.getState().run.phase).toBe('complete');
    expect(store.getState().progress.every((p) => p.state === 'indexed')).toBe(true);
  });

  it('a pause request outside a run is a no-op', () => {
    const { store } = prepared();
    store.requestPause();
    expect(store.getState().run.pauseRequested).toBe(false);
  });

  it('records a wallet pause reason from the executor', async () => {
    const { store } = prepared({
      createExecutor: ({ onEvent, effects }) =>
        fakeExecutor({ onEvent, submit: effects.submit, stopAfter: 1 })
    });

    await store.startRun();

    expect(store.getState().run.phase).toBe('paused');
    expect(store.getState().run.reason).toBe('stopped for the test');
  });

  it('refuses to run without a plan', async () => {
    const { store } = makeStore();
    await expect(store.startRun()).rejects.toThrow(/build a manifest and a plan/);
  });

  it('refuses to run without wallet effects', async () => {
    const made = makeStore({ effects: undefined, createExecutor: undefined });
    made.store.addFiles([file('a.png', 100, 1)]);
    made.store.buildManifest();
    made.store.setFees(FEES, 'test');
    made.store.buildPlan();

    await expect(made.store.startRun()).rejects.toThrow(/connect a wallet/);
  });

  it('binds the chain seam late, without discarding work already done', async () => {
    const made = makeStore({ effects: undefined, createExecutor: undefined });
    made.store.addFiles([file('a.png', 100, 1)]);
    made.store.buildManifest();
    made.store.setFees(FEES, 'test');
    made.store.buildPlan();
    expect(made.store.canRun).toBe(false);

    made.store.bindChain({
      effects: {
        observer,
        submit: made.submit,
        waitConfirm: async (txid) => ({ txid, status: 'success' })
      },
      createExecutor: ({ onEvent, effects }) => fakeExecutor({ onEvent, submit: effects.submit })
    });

    expect(made.store.canRun).toBe(true);
    expect(made.store.getState().manifest?.items).toHaveLength(1);
    await made.store.startRun();
    expect(made.store.getState().progress[0]!.state).toBe('indexed');
  });

  it('ignores a second concurrent start', async () => {
    const { store } = prepared();
    const first = store.startRun();
    const second = store.startRun();
    expect(await second).toBeNull();
    await first;
  });
});

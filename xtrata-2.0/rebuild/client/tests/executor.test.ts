import { describe, expect, it } from 'vitest';
import type { BufferCV, ListCV, TupleCV, UIntCV } from '@stacks/transactions';
import { CollectionExecutor, type ChainTxResult } from '../src/engine/executor.js';
import { CollectionTxBuilder, type TxDescriptor } from '../src/collection/client.js';
import { flatFeeSchedule, buildPlan } from '../src/planner.js';
import { sealManifest, type Manifest, type ManifestItem } from '../src/manifest.js';
import type { ChainObservation } from '../src/reconcile.js';
import type { ChainObserver } from '../src/protocol-stubs.js';
import {
  bytesToHex,
  computeChainHash,
  plainSha256,
  runningHashAfter,
  hexToBytes
} from '../src/hash.js';
import { XtrataClientError } from '../src/errors.js';

const SENDER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const fees = flatFeeSchedule({ beginFee: 1000n, perChunkFee: 10n, sealBaseFee: 500n });
const builder = new CollectionTxBuilder({
  collectionContractId: COLLECTION,
  coreContractId: CORE,
  network: 'mainnet',
  sender: SENDER,
  fees
});

// --- fixture files: chunk arrays (tiny chunks, protocol semantics preserved) ---

const makeChunks = (count: number, seed: number): Uint8Array[] =>
  Array.from({ length: count }, (_, i) => new Uint8Array([seed, i % 256, (i * 7) % 256]));

interface Fixture {
  item: ManifestItem;
  chunks: Uint8Array[];
}

const makeFixture = (index: number, chunkCountN: number, seed: number, overrides: Partial<ManifestItem> = {}): Fixture => {
  const chunks = makeChunks(chunkCountN, seed);
  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let o = 0;
  for (const c of chunks) { bytes.set(c, o); o += c.length; }
  const item: ManifestItem = {
    index,
    fileName: `item-${index}.bin`,
    byteLength: bytes.length,
    mimeType: 'application/octet-stream',
    contentHashHex: bytesToHex(computeChainHash(chunks)),
    sha256Hex: bytesToHex(plainSha256(bytes)),
    chunkCount: chunkCountN,
    mode: chunkCountN <= 32 ? 'single-tx' : 'staged',
    ...overrides
  };
  return { item, chunks };
};

const makeManifest = (fixtures: Fixture[]): Manifest =>
  sealManifest({
    schemaVersion: 1,
    collection: { name: 'Exec Test' },
    network: 'mainnet',
    contracts: { core: CORE, collection: COLLECTION },
    items: fixtures.map((f) => f.item),
    createdAt: '2026-07-24T00:00:00.000Z',
    updatedAt: '2026-07-24T00:00:00.000Z'
  });

// --- scripted fake chain ---

interface HashState {
  session?: { createdAt: number; expired?: boolean };
  upload?: { currentIndex: number; totalChunks: number; runningHash: Uint8Array };
  tokenId?: number;
  indexedAt?: number;
}

type Hook = (tx: TxDescriptor) => void;

class FakeChain implements ChainObserver {
  state = new Map<string, HashState>();
  nextTokenId = 0;
  txCounter = 0;
  submitted: { functionName: string; hash?: string }[] = [];
  /** Hooks run BEFORE applying a tx; throw to simulate failures. */
  beforeApply: Hook[] = [];
  /** If true for a txid, submit applies state but then throws broadcast-failed. */
  loseResponseFor = new Set<string>();

  private at(hash: string): HashState {
    let s = this.state.get(hash);
    if (s === undefined) { s = {}; this.state.set(hash, s); }
    return s;
  }

  private hashArg(tx: TxDescriptor, pos: number): string {
    return (tx.functionArgs[pos] as BufferCV).value.toLowerCase();
  }

  private chunksArg(tx: TxDescriptor, pos: number): Uint8Array[] {
    return (tx.functionArgs[pos] as ListCV<BufferCV>).value.map((cv) => hexToBytes(cv.value));
  }

  apply(tx: TxDescriptor): void {
    switch (tx.functionName) {
      case 'mint-begin': {
        const hash = this.hashArg(tx, 1);
        const totalChunks = Number((tx.functionArgs[4] as UIntCV).value);
        const s = this.at(hash);
        if (s.session === undefined) s.session = { createdAt: 0 };
        if (s.upload === undefined) {
          s.upload = { currentIndex: 0, totalChunks, runningHash: new Uint8Array(32) };
        }
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'mint-add-chunk-batch': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        if (s.upload === undefined) throw new XtrataClientError('chain-rejected', 'no upload', { chainErrorCode: 103 });
        const chunks = this.chunksArg(tx, 2);
        for (const chunk of chunks) {
          const all = [s.upload.runningHash === undefined ? new Uint8Array(0) : chunk];
          void all;
          s.upload.runningHash = computeChainHashStep(s.upload.runningHash, chunk);
          s.upload.currentIndex += 1;
        }
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'mint-seal': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        if (s.upload === undefined || s.upload.currentIndex !== s.upload.totalChunks) {
          throw new XtrataClientError('chain-rejected', 'upload incomplete', { chainErrorCode: 102 });
        }
        if (bytesToHex(s.upload.runningHash) !== hash) {
          throw new XtrataClientError('chain-rejected', 'hash mismatch', { chainErrorCode: 103 });
        }
        this.mint(hash, s);
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'mint-seal-batch': {
        const items = (tx.functionArgs[1] as ListCV<TupleCV>).value;
        for (const entry of items) {
          const hash = ((entry.value as Record<string, BufferCV>)['hash'] as BufferCV).value.toLowerCase();
          const s = this.at(hash);
          if (s.upload === undefined || s.upload.currentIndex !== s.upload.totalChunks) {
            throw new XtrataClientError('chain-rejected', 'batch member incomplete', { chainErrorCode: 107 });
          }
          this.mint(hash, s);
        }
        this.submitted.push({ functionName: tx.functionName });
        return;
      }
      case 'mint-small-single-tx':
      case 'mint-small-single-tx-recursive': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        const chunks = this.chunksArg(tx, 4);
        if (bytesToHex(computeChainHash(chunks)) !== hash) {
          throw new XtrataClientError('chain-rejected', 'hash mismatch', { chainErrorCode: 103 });
        }
        if (s.indexedAt !== undefined) {
          throw new XtrataClientError('chain-rejected', 'duplicate', { chainErrorCode: 105 });
        }
        this.mint(hash, s);
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'release-expired-reservation': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        delete s.session;
        delete s.upload;
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      default:
        throw new Error(`fake chain: unhandled function ${tx.functionName}`);
    }
  }

  private mint(hash: string, s: HashState): void {
    s.tokenId = this.nextTokenId;
    this.nextTokenId += 1;
    s.indexedAt = 100 + s.tokenId;
    delete s.session;
    delete s.upload;
  }

  async observeItem(_owner: string, contentHashHex: string): Promise<ChainObservation> {
    const s = this.state.get(contentHashHex.toLowerCase());
    const obs: ChainObservation = { sessionExists: s?.session !== undefined };
    if (s?.session !== undefined) {
      obs.sessionExpired = s.session.expired === true;
    }
    if (s?.upload !== undefined) {
      obs.uploadState = {
        currentIndex: s.upload.currentIndex,
        totalChunks: s.upload.totalChunks,
        runningHashHex: bytesToHex(s.upload.runningHash)
      };
    }
    if (s?.indexedAt !== undefined) {
      obs.itemIndexedAt = s.indexedAt;
      if (s.tokenId !== undefined) {
        obs.hashIndexedAt = s.tokenId;
        obs.sealedTokenId = s.tokenId;
      }
    }
    return obs;
  }

  async getTxStatus(): Promise<ChainTxResult> {
    return { txid: 'x', status: 'success' };
  }

  async getBlockHeight(): Promise<number> {
    return 0;
  }

  submit = async (tx: TxDescriptor): Promise<{ txid: string }> => {
    for (const hook of this.beforeApply) hook(tx);
    this.apply(tx);
    const txid = `tx-${this.txCounter++}`;
    if (this.loseResponseFor.has(tx.functionName)) {
      this.loseResponseFor.delete(tx.functionName);
      throw new XtrataClientError('broadcast-failed', 'response lost after landing');
    }
    return { txid };
  };

  waitConfirm = async (txid: string): Promise<ChainTxResult> => ({ txid, status: 'success' });
}

const computeChainHashStep = (running: Uint8Array, chunk: Uint8Array): Uint8Array => {
  // Same fold the core performs: sha256(running || chunk).
  const joined = new Uint8Array(running.length + chunk.length);
  joined.set(running, 0);
  joined.set(chunk, running.length);
  return plainSha256(joined);
};

const makeExecutor = (chain: FakeChain, fixtures: Fixture[], concurrency = 1) => {
  const byIndex = new Map(fixtures.map((f) => [f.item.index, f.chunks]));
  return new CollectionExecutor(
    {
      observer: chain,
      submit: chain.submit,
      waitConfirm: chain.waitConfirm,
      chunksFor: async (item) => byIndex.get(item.index)!
    },
    { owner: SENDER, builder, concurrency, now: () => new Date('2026-07-24T00:00:00Z') }
  );
};

describe('CollectionExecutor scenarios', () => {
  it('happy path: 5 items, mixed modes, all indexed, seal coalesced in one batch', async () => {
    const fixtures = [
      makeFixture(0, 3, 1), // single-tx
      makeFixture(1, 40, 2), // staged, 2 chunk batches
      makeFixture(2, 1, 3), // single-tx
      makeFixture(3, 33, 4), // staged
      makeFixture(4, 35, 5) // staged
    ];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures).run(manifest, plan);

    expect(result.paused).toBe(false);
    expect(result.progress.map((p) => p.state)).toEqual(['indexed', 'indexed', 'indexed', 'indexed', 'indexed']);
    expect(result.report.totals.succeeded).toBe(5);
    expect(result.report.totals.failed).toBe(0);
    // 3 staged items sealed together in one mint-seal-batch tx.
    expect(chain.submitted.filter((s) => s.functionName === 'mint-seal-batch')).toHaveLength(1);
    expect(chain.submitted.filter((s) => s.functionName === 'mint-begin')).toHaveLength(3);
    expect(chain.submitted.filter((s) => s.functionName === 'mint-add-chunk-batch')).toHaveLength(2 + 2 + 2);
    expect(chain.submitted.filter((s) => s.functionName.startsWith('mint-small-single-tx'))).toHaveLength(2);
    expect(chain.nextTokenId).toBe(5); // exactly one mint per item
  });

  it('backfills token ids onto indexed items so the report has a token column', async () => {
    const fixtures = [makeFixture(0, 3, 21), makeFixture(1, 40, 22)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures).run(manifest, plan);

    expect(result.progress.every((p) => p.state === 'indexed')).toBe(true);
    // Token ids are only knowable from chain state — every indexed item must carry one.
    expect(result.progress.map((p) => p.tokenId)).toEqual([0, 1]);
    expect(result.report.items.map((i) => i.tokenId)).toEqual([0, 1]);
  });

  it('a failing observation during token backfill does not fail the run', async () => {
    const fixtures = [makeFixture(0, 3, 31)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const executor = makeExecutor(chain, fixtures);
    const realObserve = chain.observeItem.bind(chain);
    let calls = 0;
    chain.observeItem = async (owner: string, hash: string) => {
      calls += 1;
      // Fail only the post-run backfill observation, not the pre-flight ones.
      if (calls > 1) throw new XtrataClientError('broadcast-failed', 'api down');
      return realObserve(owner, hash);
    };

    const result = await executor.run(manifest, plan);
    expect(result.progress[0]!.state).toBe('indexed');
    expect(result.report.totals.succeeded).toBe(1);
    expect(result.progress[0]!.tokenId).toBeUndefined();
  });

  it('wallet rejection pauses the run; a second run resumes without double-submitting', async () => {
    const fixtures = [makeFixture(0, 2, 9), makeFixture(1, 40, 10)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();

    // Reject the second chunk batch of item 1.
    let batchCount = 0;
    chain.beforeApply.push((tx) => {
      if (tx.functionName === 'mint-add-chunk-batch' && ++batchCount === 2) {
        throw new XtrataClientError('wallet-rejected', 'user cancelled');
      }
    });

    const executor = makeExecutor(chain, fixtures);
    const first = await executor.run(manifest, plan);
    expect(first.paused).toBe(true);
    expect(first.pauseReason).toContain('user cancelled');
    // Nothing marked failed — the run is merely paused.
    expect(first.progress.every((p) => p.state !== 'failed')).toBe(true);

    chain.beforeApply = [];
    const second = await executor.run(manifest, plan);
    expect(second.paused).toBe(false);
    expect(second.progress.map((p) => p.state)).toEqual(['indexed', 'indexed']);
    // Resume reconciled: chunks 0..32 landed pre-rejection and were not re-sent.
    expect(chain.submitted.filter((s) => s.functionName === 'mint-add-chunk-batch')).toHaveLength(2);
    expect(chain.nextTokenId).toBe(2);
  });

  it('broadcast lost but landed: re-observation detects the mint, no double submit', async () => {
    const fixtures = [makeFixture(0, 4, 20)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    chain.loseResponseFor.add('mint-small-single-tx'); // tx lands, response lost

    const result = await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(result.paused).toBe(false);
    expect(result.progress[0]!.state).toBe('indexed');
    // Only ONE single-tx ever applied — the retry path observed and skipped.
    expect(chain.submitted.filter((s) => s.functionName === 'mint-small-single-tx')).toHaveLength(1);
    expect(chain.nextTokenId).toBe(1);
  });

  it('expired reservation: release + restart from scratch, then mints', async () => {
    const fixtures = [makeFixture(0, 40, 30)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    // Pre-seed a stale expired session with a half-done upload.
    chain.state.set(fixtures[0]!.item.contentHashHex, {
      session: { createdAt: 0, expired: true },
      upload: {
        currentIndex: 5,
        totalChunks: 40,
        runningHash: runningHashAfter(fixtures[0]!.chunks, 5)
      }
    });

    const result = await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(result.paused).toBe(false);
    expect(result.progress[0]!.state).toBe('indexed');
    expect(chain.submitted[0]!.functionName).toBe('release-expired-reservation');
    expect(chain.submitted.filter((s) => s.functionName === 'mint-begin')).toHaveLength(1);
    expect(chain.nextTokenId).toBe(1);
  });

  it('one poisoned item fails in isolation; the rest complete', async () => {
    const fixtures = [makeFixture(0, 2, 40), makeFixture(1, 40, 41), makeFixture(2, 34, 42)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const poisonHash = fixtures[1]!.item.contentHashHex;
    chain.beforeApply.push((tx) => {
      if (
        tx.functionName === 'mint-begin' &&
        (tx.functionArgs[1] as BufferCV).value.toLowerCase() === poisonHash
      ) {
        throw new XtrataClientError('chain-rejected', 'ERR-PAUSED for this item', { chainErrorCode: 101 });
      }
    });

    const result = await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(result.paused).toBe(false);
    expect(result.progress.map((p) => p.state)).toEqual(['indexed', 'failed', 'indexed']);
    expect(result.report.totals.failed).toBe(1);
    expect(result.report.totals.succeeded).toBe(2);
    expect(result.report.items[1]!.error).toContain('ERR-PAUSED');
    expect(chain.nextTokenId).toBe(2);
  });

  it('items with dependencies seal individually via mint-seal (not batch)', async () => {
    const fixtures = [makeFixture(0, 33, 50, { dependencies: [107] }), makeFixture(1, 34, 51)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(result.progress.map((p) => p.state)).toEqual(['indexed', 'indexed']);
    expect(chain.submitted.filter((s) => s.functionName === 'mint-seal')).toHaveLength(2); // dep item + solo batch collapses to mint-seal
    expect(chain.submitted.filter((s) => s.functionName === 'mint-seal-batch')).toHaveLength(0);
  });

  it('bounded concurrency (2 workers) still mints every item exactly once', async () => {
    const fixtures = [makeFixture(0, 2, 60), makeFixture(1, 3, 61), makeFixture(2, 40, 62), makeFixture(3, 4, 63)];
    const manifest = makeManifest(fixtures);
    const plan = buildPlan(manifest, fees);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures, 2).run(manifest, plan);
    expect(result.progress.every((p) => p.state === 'indexed')).toBe(true);
    expect(chain.nextTokenId).toBe(4);
  });
});

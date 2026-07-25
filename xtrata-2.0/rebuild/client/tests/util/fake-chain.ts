import type { BufferCV, ListCV, TupleCV, UIntCV } from '@stacks/transactions';
import type { TxDescriptor } from '../../src/collection/client.js';
import type { ChainObservation } from '../../src/reconcile.js';
import type { ChainObserver, TxStatus } from '../../src/protocol-stubs.js';
import {
  bytesToHex,
  computeChainHash,
  plainSha256,
  hexToBytes,
  CHUNK_SIZE
} from '../../src/hash.js';
import { sealManifest, type Manifest, type ManifestItem } from '../../src/manifest.js';
import { XtrataClientError } from '../../src/errors.js';

/**
 * In-memory stand-in for xtrata-collection-v3 + the core, faithful to the
 * properties the engine relies on:
 *   - `mint-begin` is resume-idempotent, chunk batches append to a folded
 *     hash chain, `mint-seal*` verifies the chain and is one-shot per hash;
 *   - a content hash can only ever be minted ONCE (the collection HashIndex);
 *   - broadcast responses can be lost after the tx has already landed.
 *
 * `mintsByHash` is the duplicate-mint oracle: any hash reaching 2 is a bug in
 * the client, not in the fixture.
 */

export interface FakeChainOptions {
  /** Throw `error` instead of applying the n-th submit (1-based). */
  failAtSubmit?: { at: number; error: XtrataClientError };
}

interface HashState {
  session?: { createdAt: number; expired?: boolean };
  upload?: { currentIndex: number; totalChunks: number; runningHash: Uint8Array };
  tokenId?: number;
  indexedAt?: number;
}

const foldStep = (running: Uint8Array, chunk: Uint8Array): Uint8Array => {
  const joined = new Uint8Array(running.length + chunk.length);
  joined.set(running, 0);
  joined.set(chunk, running.length);
  return plainSha256(joined);
};

export class FakeChain implements ChainObserver {
  readonly state = new Map<string, HashState>();
  /** Content hash -> how many times it was minted. Must never exceed 1. */
  readonly mintsByHash = new Map<string, number>();
  readonly submitted: Array<{ functionName: string; hash?: string }> = [];
  nextTokenId = 0;
  txCounter = 0;
  submitCount = 0;
  observeCount = 0;
  options: FakeChainOptions;
  /** Lose the response of the next submit of this function (after landing). */
  loseResponseFor = new Set<string>();

  constructor(options: FakeChainOptions = {}) {
    this.options = options;
  }

  get mintTxCount(): number {
    return this.submitted.filter((s) =>
      s.functionName === 'mint-seal' ||
      s.functionName === 'mint-seal-batch' ||
      s.functionName.startsWith('mint-small-single-tx')
    ).length;
  }

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

  private mint(hash: string, s: HashState): void {
    if (s.indexedAt !== undefined) {
      throw new XtrataClientError('chain-rejected', 'duplicate hash', { chainErrorCode: 105 });
    }
    s.tokenId = this.nextTokenId;
    this.nextTokenId += 1;
    s.indexedAt = 100 + s.tokenId;
    this.mintsByHash.set(hash, (this.mintsByHash.get(hash) ?? 0) + 1);
    delete s.session;
    delete s.upload;
  }

  apply(tx: TxDescriptor): void {
    switch (tx.functionName) {
      case 'mint-begin': {
        const hash = this.hashArg(tx, 1);
        const totalChunks = Number((tx.functionArgs[4] as UIntCV).value);
        const s = this.at(hash);
        if (s.indexedAt !== undefined) {
          throw new XtrataClientError('chain-rejected', 'already indexed', { chainErrorCode: 105 });
        }
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
        if (s.upload === undefined) {
          throw new XtrataClientError('chain-rejected', 'no upload', { chainErrorCode: 103 });
        }
        const chunks = this.chunksArg(tx, 2);
        if (s.upload.currentIndex + chunks.length > s.upload.totalChunks) {
          throw new XtrataClientError('chain-rejected', 'batch overruns declared chunks', { chainErrorCode: 902 });
        }
        for (const chunk of chunks) {
          s.upload.runningHash = foldStep(s.upload.runningHash, chunk);
          s.upload.currentIndex += 1;
        }
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'mint-seal': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        if (s.upload === undefined || s.upload.currentIndex !== s.upload.totalChunks) {
          throw new XtrataClientError('chain-rejected', 'upload incomplete', { chainErrorCode: 902 });
        }
        if (bytesToHex(s.upload.runningHash) !== hash) {
          throw new XtrataClientError('chain-rejected', 'hash mismatch', { chainErrorCode: 903 });
        }
        this.mint(hash, s);
        this.submitted.push({ functionName: tx.functionName, hash });
        return;
      }
      case 'mint-seal-batch': {
        const items = (tx.functionArgs[1] as ListCV<TupleCV>).value;
        // Atomic: validate the whole batch before mutating anything.
        const hashes = items.map((entry) =>
          ((entry.value as Record<string, BufferCV>)['hash'] as BufferCV).value.toLowerCase());
        for (const hash of hashes) {
          const s = this.at(hash);
          if (s.upload === undefined || s.upload.currentIndex !== s.upload.totalChunks) {
            throw new XtrataClientError('chain-rejected', 'batch member incomplete', { chainErrorCode: 107 });
          }
        }
        for (const hash of hashes) this.mint(hash, this.at(hash));
        this.submitted.push({ functionName: tx.functionName });
        return;
      }
      case 'mint-small-single-tx':
      case 'mint-small-single-tx-recursive': {
        const hash = this.hashArg(tx, 1);
        const s = this.at(hash);
        const chunks = this.chunksArg(tx, 4);
        if (bytesToHex(computeChainHash(chunks)) !== hash) {
          throw new XtrataClientError('chain-rejected', 'hash mismatch', { chainErrorCode: 903 });
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

  async observeItem(_owner: string, contentHashHex: string): Promise<ChainObservation> {
    this.observeCount += 1;
    const s = this.state.get(contentHashHex.toLowerCase());
    const obs: ChainObservation = { sessionExists: s?.session !== undefined };
    if (s?.session !== undefined) obs.sessionExpired = s.session.expired === true;
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

  async getTxStatus(): Promise<TxStatus> {
    return { txid: 'x', status: 'success' };
  }

  async getBlockHeight(): Promise<number> {
    return 0;
  }

  submit = async (tx: TxDescriptor): Promise<{ txid: string }> => {
    this.submitCount += 1;
    const failure = this.options.failAtSubmit;
    if (failure !== undefined && this.submitCount === failure.at) {
      // Interrupted BEFORE landing — nothing is applied.
      throw failure.error;
    }
    this.apply(tx);
    const txid = `tx-${this.txCounter++}`;
    if (this.loseResponseFor.has(tx.functionName)) {
      this.loseResponseFor.delete(tx.functionName);
      throw new XtrataClientError('broadcast-failed', 'response lost after landing');
    }
    return { txid };
  };

  waitConfirm = async (txid: string): Promise<TxStatus> => ({ txid, status: 'success' });
}

// --- fixtures ---------------------------------------------------------------

export interface Fixture {
  item: ManifestItem;
  chunks: Uint8Array[];
}

/** Tiny chunks: protocol shape (counts, batching, hash chain) is what matters. */
const makeChunks = (count: number, seed: number): Uint8Array[] =>
  Array.from({ length: count }, (_, i) =>
    new Uint8Array([seed & 0xff, (seed >> 8) & 0xff, i & 0xff, (i * 7) % 256]));

export const makeFixture = (
  index: number,
  chunkCountN: number,
  seed: number,
  overrides: Partial<ManifestItem> = {}
): Fixture => {
  const chunks = makeChunks(chunkCountN, seed);
  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const item: ManifestItem = {
    index,
    fileName: `item-${index}.bin`,
    // Declared byte length uses the protocol chunk size so `mode` stays honest.
    byteLength: Math.max(1, (chunkCountN - 1) * CHUNK_SIZE + 1),
    mimeType: 'application/octet-stream',
    contentHashHex: bytesToHex(computeChainHash(chunks)),
    sha256Hex: bytesToHex(plainSha256(bytes)),
    chunkCount: chunkCountN,
    mode: chunkCountN <= 32 ? 'single-tx' : 'staged',
    ...overrides
  };
  return { item, chunks };
};

export const manifestOfFixtures = (
  fixtures: Fixture[],
  contracts: { core: string; collection: string },
  name = 'Integration'
): Manifest =>
  sealManifest({
    schemaVersion: 1,
    collection: { name },
    network: 'mainnet',
    contracts,
    items: fixtures.map((f) => f.item),
    createdAt: '2026-07-24T00:00:00.000Z',
    updatedAt: '2026-07-24T00:00:00.000Z'
  });

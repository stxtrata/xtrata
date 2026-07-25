import type { Manifest, ManifestItem } from '../manifest.js';
import type { TransactionPlan } from '../planner.js';
import type { ChainObserver, TxStatus } from '../protocol-stubs.js';
import type { TxDescriptor, CollectionTxBuilder } from '../collection/client.js';
import { decideResume, planChunkBatch, type ItemResumeDecision } from '../reconcile.js';
import {
  initialProgress,
  transition,
  type ItemProgress,
  type ItemState
} from '../progress.js';
import { buildReport, type CollectionReport } from '../report.js';
import { runningHashAfter, bytesToHex, MAX_CHUNK_BATCH, MAX_SEAL_BATCH } from '../hash.js';
import { XtrataClientError } from '../errors.js';

/**
 * Resumable orchestration engine. Pure state-machine style: all effects
 * (chain reads, tx submission, confirmation waits, file bytes) are injected;
 * the executor owns ordering, reconcile-before-every-resume, idempotency and
 * per-item failure isolation.
 *
 * Invariants enforced here:
 * - Reconcile before every resume and before every chunk-batch (planChunkBatch
 *   guard) — a landed batch is never re-submitted (hash-chain double-fold).
 * - An item whose content hash is already indexed never receives another
 *   mint-producing tx.
 * - Wallet rejection pauses the whole run (resumable); every other error is
 *   isolated to its item.
 * - Broadcast-response-lost / unconfirmed: re-observe the chain and re-decide;
 *   never blind-resubmit.
 */

export interface ChainTxResult extends TxStatus {}

export type ExecutorEvent =
  | { type: 'item-state'; index: number; state: ItemState; progress: ItemProgress }
  | { type: 'tx-submitted'; index: number; functionName: string; txid: string }
  | { type: 'item-failed'; index: number; error: string }
  | { type: 'run-paused'; reason: string }
  | { type: 'run-complete' };

export interface ExecutorEffects {
  observer: ChainObserver;
  submit: (tx: TxDescriptor) => Promise<{ txid: string }>;
  waitConfirm: (txid: string) => Promise<ChainTxResult>;
  /** File bytes for an item, chunked at the protocol chunk size. */
  chunksFor: (item: ManifestItem) => Promise<Uint8Array[]>;
}

export interface ExecutorConfig {
  owner: string;
  builder: CollectionTxBuilder;
  /** Bounded per-item concurrency for the pre-seal phase. Default 1 (sequential). */
  concurrency?: number;
  onEvent?: (event: ExecutorEvent) => void;
  now?: () => Date;
}

export interface ExecutorRunResult {
  report: CollectionReport;
  progress: ItemProgress[];
  paused: boolean;
  pauseReason?: string;
}

export class WalletRejectedPause extends Error {
  constructor(readonly inner: XtrataClientError) {
    super('wallet rejected — run paused');
  }
}

const isWalletRejection = (error: unknown): boolean =>
  error instanceof XtrataClientError && error.code === 'wallet-rejected';

const isRecoverableBroadcast = (error: unknown): boolean =>
  error instanceof XtrataClientError &&
  (error.code === 'broadcast-failed' || error.code === 'timeout-unconfirmed');

export class CollectionExecutor {
  private readonly effects: ExecutorEffects;
  private readonly config: ExecutorConfig;
  private progressByIndex = new Map<number, ItemProgress>();

  constructor(effects: ExecutorEffects, config: ExecutorConfig) {
    this.effects = effects;
    this.config = config;
  }

  private emit(event: ExecutorEvent): void {
    this.config.onEvent?.(event);
  }

  private setProgress(next: ItemProgress): ItemProgress {
    this.progressByIndex.set(next.index, next);
    this.emit({ type: 'item-state', index: next.index, state: next.state, progress: next });
    return next;
  }

  private move(p: ItemProgress, to: ItemState, options?: Parameters<typeof transition>[2]): ItemProgress {
    return this.setProgress(transition(p, to, { ...(options ?? {}), now: this.config.now ?? (() => new Date()) }));
  }

  /**
   * Seal token ids are only knowable from chain state, so items reach 'indexed'
   * without one. Observe each indexed item once and attach it, otherwise the
   * final report has no token column. Failures here are non-fatal — a missing
   * token id must not fail a run whose inscriptions all landed.
   */
  private async backfillTokenIds(manifest: Manifest): Promise<void> {
    for (const item of manifest.items) {
      const p = this.progressByIndex.get(item.index);
      if (p === undefined || p.state !== 'indexed' || p.tokenId !== undefined) continue;
      try {
        const obs = await this.effects.observer.observeItem(this.config.owner, item.contentHashHex);
        if (obs.sealedTokenId !== undefined) {
          this.setProgress({ ...p, tokenId: obs.sealedTokenId });
        }
      } catch {
        // leave the token id unset; the report renders '—'
      }
    }
  }

  /**
   * Submit + confirm one tx for an item. Wallet rejection escalates to a run
   * pause; recoverable broadcast losses return 'lost' so the caller
   * re-observes instead of resubmitting.
   */
  private async submitConfirmed(
    index: number,
    tx: TxDescriptor
  ): Promise<{ outcome: 'confirmed'; txid: string } | { outcome: 'lost' }> {
    let txid: string;
    try {
      ({ txid } = await this.effects.submit(tx));
    } catch (error) {
      if (isWalletRejection(error)) throw new WalletRejectedPause(error as XtrataClientError);
      if (isRecoverableBroadcast(error)) return { outcome: 'lost' };
      throw error;
    }
    this.emit({ type: 'tx-submitted', index, functionName: tx.functionName, txid });
    let status: ChainTxResult;
    try {
      status = await this.effects.waitConfirm(txid);
    } catch (error) {
      if (isRecoverableBroadcast(error)) return { outcome: 'lost' };
      throw error;
    }
    if (status.status === 'success') return { outcome: 'confirmed', txid };
    if (status.status === 'abort_by_response' || status.status === 'abort_by_post_condition') {
      throw new XtrataClientError('chain-rejected', `tx ${txid} aborted (${status.status})`, {
        ...(status.chainErrorCode !== undefined ? { chainErrorCode: status.chainErrorCode } : {})
      });
    }
    // pending past the wait window, or dropped: treat as lost → re-observe.
    return { outcome: 'lost' };
  }

  private async observeAndDecide(item: ManifestItem): Promise<ItemResumeDecision> {
    const observation = await this.effects.observer.observeItem(
      this.config.owner,
      item.contentHashHex
    );
    const chunks = await this.effects.chunksFor(item);
    return decideResume({
      item,
      observation,
      localRunningHashAt: (k) => bytesToHex(runningHashAfter(chunks, k))
    });
  }

  /**
   * Drive one item to 'staged' (staged mode) or 'indexed' (single-tx). Retries
   * around lost broadcasts are bounded by re-observation loops.
   */
  private async runItemPreSeal(item: ManifestItem): Promise<void> {
    let p = this.progressByIndex.get(item.index) ?? this.setProgress(initialProgress(item.index, item.chunkCount, this.config.now));
    if (['staged', 'indexed', 'failed'].includes(p.state)) return;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const decision = await this.observeAndDecide(item);

      if (decision.action === 'skip') {
        // Already indexed on-chain — walk to indexed through legal edges.
        p = this.progressByIndex.get(item.index)!;
        if (p.state !== 'indexed') {
          if (p.state === 'begun' || p.state === 'partially-uploaded') p = this.move(p, 'staged');
          if (p.state === 'prepared' || p.state === 'reserved' || p.state === 'staged') {
            p = this.move(p, 'seal-submitted');
          }
          if (p.state === 'seal-submitted') p = this.move(p, 'confirmed');
          if (p.state === 'confirmed') p = this.move(p, 'indexed');
        }
        return;
      }

      if (decision.action === 'reconcile-mismatch') {
        throw new XtrataClientError('reconcile-mismatch', decision.reason);
      }

      if (decision.action === 'expired-restart') {
        const released = await this.submitConfirmed(
          item.index,
          this.config.builder.releaseExpiredReservation(this.config.owner, item.contentHashHex)
        );
        p = this.progressByIndex.get(item.index)!;
        if (p.state !== 'prepared') {
          if (p.state !== 'expired') {
            if (!['reserved', 'begun', 'partially-uploaded', 'staged'].includes(p.state)) {
              throw new XtrataClientError('internal', `item ${item.index} in state ${p.state} cannot expire`);
            }
            p = this.move(p, 'expired');
          }
          p = this.move(p, 'prepared');
        }
        if (released.outcome === 'lost') continue; // re-observe
        continue;
      }

      // decision.action === 'proceed'
      const chunks = await this.effects.chunksFor(item);

      if (item.mode === 'single-tx') {
        const tx = this.config.builder.mintSmallSingleTx({
          contentHashHex: item.contentHashHex,
          mimeType: item.mimeType,
          totalSize: item.byteLength,
          chunks,
          ...(item.itemUri !== undefined ? { tokenUri: item.itemUri } : {}),
          ...(item.dependencies !== undefined ? { dependencies: item.dependencies } : {})
        });
        p = this.progressByIndex.get(item.index)!;
        if (p.state === 'prepared' || p.state === 'reserved') p = this.move(p, 'seal-submitted');
        const result = await this.submitConfirmed(item.index, tx);
        if (result.outcome === 'lost') continue; // re-observe; never double-submit
        p = this.move(this.progressByIndex.get(item.index)!, 'confirmed', { txid: result.txid });
        this.move(p, 'indexed');
        return;
      }

      // Staged item.
      if (decision.fromStep === 'begin' || decision.fromStep === 'reserve') {
        const begun = await this.submitConfirmed(
          item.index,
          this.config.builder.mintBegin({
            contentHashHex: item.contentHashHex,
            mimeType: item.mimeType,
            totalSize: item.byteLength,
            totalChunks: item.chunkCount
          })
        );
        if (begun.outcome === 'lost') continue;
        p = this.progressByIndex.get(item.index)!;
        p = this.move(p, 'begun', { txid: begun.txid });
      }

      if (decision.fromStep === 'begin' || decision.fromStep === 'reserve' || decision.fromStep === 'upload') {
        p = this.progressByIndex.get(item.index)!;
        if (p.state === 'prepared' || p.state === 'reserved') p = this.move(p, 'begun');
        let cursor = decision.fromStep === 'upload' ? (decision.resumeFromChunk ?? 0) : 0;
        let lost = false;
        while (cursor < item.chunkCount) {
          // Reconcile before EVERY batch: re-read on-chain current-index.
          const obs = await this.effects.observer.observeItem(this.config.owner, item.contentHashHex);
          const onChain = obs.uploadState?.currentIndex ?? 0;
          const end = Math.min(cursor + MAX_CHUNK_BATCH, item.chunkCount);
          const guard = planChunkBatch({
            onChainCurrentIndex: onChain,
            batchStartIndex: cursor,
            batchLength: end - cursor
          });
          if (guard.action === 'skip') {
            cursor = onChain;
            continue;
          }
          if (guard.action === 'reconcile') {
            if (onChain > cursor) {
              cursor = onChain; // chain is ahead (previous lost broadcast landed)
              continue;
            }
            throw new XtrataClientError('reconcile-mismatch', guard.reason);
          }
          const batch = await this.submitConfirmed(item.index, this.config.builder.mintAddChunkBatch({
            contentHashHex: item.contentHashHex,
            chunks: chunks.slice(cursor, end)
          }));
          if (batch.outcome === 'lost') { lost = true; break; }
          cursor = end;
          p = this.progressByIndex.get(item.index)!;
          if (cursor < item.chunkCount) {
            p = this.move(p, 'partially-uploaded', { uploadedChunks: cursor, txid: batch.txid });
          } else {
            p = this.move(p, 'staged', { txid: batch.txid });
          }
        }
        if (lost) continue; // outer loop re-observes
      }

      p = this.progressByIndex.get(item.index)!;
      if (decision.fromStep === 'seal' && p.state !== 'staged') {
        // Chain says fully uploaded; sync local state.
        if (p.state === 'prepared') p = this.move(p, 'begun');
        if (p.state === 'begun' || p.state === 'partially-uploaded') p = this.move(p, 'staged');
      }
      if (this.progressByIndex.get(item.index)!.state === 'staged') return;
    }
    throw new XtrataClientError('internal', `item ${item.index} exceeded resume attempts`);
  }

  /** Seal one staged item individually (relationship items / batch fallback). */
  private async sealItem(item: ManifestItem): Promise<void> {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const tx = this.config.builder.mintSeal({
        contentHashHex: item.contentHashHex,
        ...(item.itemUri !== undefined ? { tokenUri: item.itemUri } : {}),
        chunkCount: item.chunkCount
      });
      let p = this.move(this.progressByIndex.get(item.index)!, 'seal-submitted');
      const result = await this.submitConfirmed(item.index, tx);
      if (result.outcome === 'lost') {
        const decision = await this.observeAndDecide(item);
        p = this.progressByIndex.get(item.index)!;
        if (decision.action === 'skip') {
          p = this.move(p, 'confirmed');
          this.move(p, 'indexed');
          return;
        }
        // Not landed — roll back to staged and retry.
        this.progressByIndex.set(item.index, { ...p, state: 'staged' });
        continue;
      }
      p = this.move(this.progressByIndex.get(item.index)!, 'confirmed', { txid: result.txid });
      this.move(p, 'indexed');
      return;
    }
    throw new XtrataClientError('internal', `item ${item.index} exceeded seal attempts`);
  }

  /** Seal a batch group atomically; on loss, fall back to per-item sealing. */
  private async sealBatchGroup(group: ManifestItem[]): Promise<void> {
    if (group.length === 1) return this.sealItem(group[0]!);
    const tx = this.config.builder.mintSealBatch({
      items: group.map((item) => ({
        contentHashHex: item.contentHashHex,
        ...(item.itemUri !== undefined ? { tokenUri: item.itemUri } : {}),
        chunkCount: item.chunkCount
      }))
    });
    for (const item of group) {
      this.move(this.progressByIndex.get(item.index)!, 'seal-submitted');
    }
    const first = group[0]!;
    try {
      const result = await this.submitConfirmed(first.index, tx);
      if (result.outcome === 'confirmed') {
        for (const item of group) {
          const p = this.move(this.progressByIndex.get(item.index)!, 'confirmed', { txid: result.txid });
          this.move(p, 'indexed');
        }
        return;
      }
    } catch (error) {
      if (error instanceof WalletRejectedPause) throw error;
      // Batch-level chain rejection: isolate by sealing individually below.
    }
    // Lost or rejected: re-observe and seal each item individually.
    for (const item of group) {
      const p = this.progressByIndex.get(item.index)!;
      this.progressByIndex.set(item.index, { ...p, state: 'staged' });
      await this.sealItem(item);
    }
  }

  private failItem(index: number, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const p = this.progressByIndex.get(index);
    if (p !== undefined && !['indexed', 'failed', 'assigned', 'claimed', 'confirmed'].includes(p.state)) {
      this.setProgress({
        ...p,
        state: 'failed',
        error: message,
        updatedAt: (this.config.now ?? (() => new Date()))().toISOString()
      });
    }
    this.emit({ type: 'item-failed', index, error: message });
  }

  /**
   * Run the whole plan. Returns a report; `paused: true` means a wallet
   * rejection stopped the run and calling run() again resumes (reconciling
   * against the chain first — nothing is double-submitted).
   */
  async run(manifest: Manifest, plan: TransactionPlan): Promise<ExecutorRunResult> {
    const concurrency = Math.max(1, this.config.concurrency ?? 1);
    for (const item of manifest.items) {
      if (!this.progressByIndex.has(item.index)) {
        this.setProgress(initialProgress(item.index, item.chunkCount, this.config.now));
      }
    }

    let paused = false;
    let pauseReason: string | undefined;

    // Phase 1: bring every item to staged (staged mode) / indexed (single-tx),
    // with bounded concurrency and per-item failure isolation.
    const queue = [...manifest.items];
    const worker = async (): Promise<void> => {
      for (;;) {
        const item = queue.shift();
        if (item === undefined || paused) return;
        try {
          await this.runItemPreSeal(item);
        } catch (error) {
          if (error instanceof WalletRejectedPause) {
            paused = true;
            pauseReason = error.inner.message;
            return;
          }
          this.failItem(item.index, error);
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, queue.length || 1) }, worker));

    // Phase 2: seal staged items — batch groups from the plan, minus failures.
    if (!paused) {
      const staged = (index: number): boolean => this.progressByIndex.get(index)?.state === 'staged';
      const byIndex = new Map(manifest.items.map((i) => [i.index, i]));
      const batchSteps = plan.steps.filter((s) => s.kind === 'seal-batch' || s.kind === 'seal');
      try {
        for (const step of batchSteps) {
          const survivors = step.itemIndexes.filter(staged).map((i) => byIndex.get(i)!);
          if (survivors.length === 0) continue;
          if (step.kind === 'seal') {
            const item = survivors[0]!;
            try {
              await this.sealItem(item);
            } catch (error) {
              if (error instanceof WalletRejectedPause) throw error;
              this.failItem(item.index, error);
            }
          } else {
            for (let i = 0; i < survivors.length; i += MAX_SEAL_BATCH) {
              const group = survivors.slice(i, i + MAX_SEAL_BATCH);
              try {
                await this.sealBatchGroup(group);
              } catch (error) {
                if (error instanceof WalletRejectedPause) throw error;
                for (const item of group) this.failItem(item.index, error);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof WalletRejectedPause) {
          paused = true;
          pauseReason = error.inner.message;
        } else {
          throw error;
        }
      }
    }

    await this.backfillTokenIds(manifest);

    if (paused) this.emit({ type: 'run-paused', reason: pauseReason ?? 'wallet rejected' });
    else this.emit({ type: 'run-complete' });

    const progress = manifest.items.map((item) => this.progressByIndex.get(item.index)!);
    const result: ExecutorRunResult = {
      report: buildReport({
        manifest,
        progress,
        estimatedFeeMicroStx: plan.totalEstimatedFeeMicroStx,
        ...(this.config.now !== undefined ? { now: this.config.now } : {})
      }),
      progress,
      paused
    };
    if (pauseReason !== undefined) result.pauseReason = pauseReason;
    return result;
  }
}

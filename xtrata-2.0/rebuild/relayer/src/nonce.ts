/**
 * Single-writer nonce authority for the sponsor hot wallet (threat 18,
 * FABLE-5 finding 2).
 *
 * Every transaction signed with SPONSOR_KEY must acquire its nonce through
 * one NonceAuthority. The authority serializes all wallet mutations: a lease
 * holds the queue until the caller reports the outcome, so two concurrent
 * submissions can never sign with the same nonce, and a failed signing
 * attempt returns its nonce instead of leaving a gap.
 *
 * In production the same interface is fronted by a Cloudflare Durable Object
 * (one instance keyed by sponsor address == globally single-writer); in Node
 * and in tests the in-memory implementation provides identical semantics.
 */
import type { ChainTransport } from './types.js';

export type NonceOutcome =
  /** Tx broadcast (or already known to the node): the nonce is consumed. */
  | 'broadcast'
  /** Nothing hit the chain: the nonce returns to the pool. */
  | 'unused'
  /** Nonce conflict/stale reported by the node: resync from chain. */
  | 'conflict';

export interface NonceLease {
  nonce: bigint;
  /** Report the outcome exactly once. */
  complete(outcome: NonceOutcome): Promise<void>;
}

export interface NonceAuthority {
  /**
   * Run `fn` while holding the wallet's next nonce. Calls are strictly
   * serialized (single writer): the next lease is not granted until the
   * previous fn resolved and reported its outcome via the returned value.
   */
  withNonce<T>(fn: (nonce: bigint) => Promise<{ outcome: NonceOutcome; value: T }>): Promise<T>;
}

export class InMemoryNonceAuthority implements NonceAuthority {
  private next: bigint | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly transport: ChainTransport,
    private readonly address: string
  ) {}

  /** Serialized queue: each task starts only after the previous finished. */
  withNonce<T>(fn: (nonce: bigint) => Promise<{ outcome: NonceOutcome; value: T }>): Promise<T> {
    const task = this.queue.then(async () => {
      if (this.next === null) {
        this.next = await this.transport.getAccountNonce(this.address);
      }
      const nonce = this.next;
      const { outcome, value } = await fn(nonce);
      if (outcome === 'broadcast') {
        this.next = nonce + 1n;
      } else if (outcome === 'conflict') {
        this.next = await this.transport.getAccountNonce(this.address);
      } // 'unused': nonce stays available
      return value;
    });
    // Keep the chain alive even when a task rejects.
    this.queue = task.catch(() => undefined);
    return task;
  }

  /** Force a resync on the next lease (recovery hook). */
  invalidate(): void {
    this.next = null;
  }
}

// ---------------------------------------------------------------- Durable Object adapter (stub)

/**
 * Cloudflare adapter: forwards lease requests to a Durable Object that runs an
 * InMemoryNonceAuthority per sponsor address. The DO is the single writer;
 * Pages Function isolates only proxy to it. Wire format kept trivial:
 *   POST /lease            → { nonce }
 *   POST /complete         → { outcome }
 * The DO class itself (SponsorNonceDO) lives with the worker deployment; this
 * stub satisfies the shared interface so orchestration code is identical.
 */
export interface DurableObjectStubLike {
  fetch(url: string, init?: { method?: string; body?: string }): Promise<{
    ok: boolean;
    json(): Promise<unknown>;
  }>;
}

export class DurableObjectNonceAuthority implements NonceAuthority {
  constructor(private readonly stub: DurableObjectStubLike) {}

  async withNonce<T>(
    fn: (nonce: bigint) => Promise<{ outcome: NonceOutcome; value: T }>
  ): Promise<T> {
    const leaseRes = await this.stub.fetch('https://nonce/lease', { method: 'POST' });
    if (!leaseRes.ok) throw new Error('nonce authority lease failed');
    const { nonce, leaseId } = (await leaseRes.json()) as { nonce: string; leaseId: string };
    let outcome: NonceOutcome = 'unused';
    try {
      const result = await fn(BigInt(nonce));
      outcome = result.outcome;
      return result.value;
    } finally {
      await this.stub.fetch('https://nonce/complete', {
        method: 'POST',
        body: JSON.stringify({ leaseId, outcome })
      });
    }
  }
}

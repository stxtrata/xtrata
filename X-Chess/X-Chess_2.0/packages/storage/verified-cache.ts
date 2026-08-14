// A cache that is always disposable.
//
// The rule, and it is not negotiable: DELETING EVERY BYTE OF THIS CHANGES
// NOTHING. If clearing local storage could destroy information, the design has
// failed, because the chain would no longer be the only thing that matters.
//
// What makes that safe is not discipline, it is what gets cached. Only
// IMMUTABLE facts go in here:
//
//   an entry at (game, seq)   once written, never changes
//   a game's rules hash       written once, at creation
//   ranked index -> game id   one map-set at creation, no delete anywhere
//
// What is deliberately NOT cached:
//
//   a game row                `next-seq` grows every submission
//   a sponsorship row         its allowance decreases as it is spent
//   the total reserved        changes constantly
//   any derived state         the position, the result, a rating - all of it is
//                             recomputed, because recomputing is the proof
//
// Caching a mutable row would make the board show a stale game and call it the
// chain. Caching a derived result would mean trusting a number instead of
// re-deriving it, which is the one thing this whole architecture exists to
// avoid.

import { PAGE_SIZE } from '../chain/client.js';
import type { ChainReader, ChainWriter, EntryRow, GameRow, WriteResult } from '../chain/client.js';

/** The smallest thing a store has to do. IndexedDB, a Map, or nothing at all. */
export interface Store {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  clear(): Promise<void>;
}

/** For tests, and for any environment with no storage worth using. */
export class MemoryStore implements Store {
  private readonly data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }

  get size(): number {
    return this.data.size;
  }
}

/**
 * IndexedDB, wrapped to the same three methods.
 *
 * Every failure is swallowed into "no cached value". A browser in private mode,
 * a storage quota, a user who cleared everything mid-session: all of them mean
 * the board reads from the chain, which is exactly what it would have done
 * anyway.
 */
export class IndexedDbStore implements Store {
  private readonly name: string;
  private db: IDBDatabase | null = null;

  constructor(name = 'xchess') {
    this.name = name;
  }

  private open(): Promise<IDBDatabase | null> {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((done) => {
      try {
        const request = indexedDB.open(this.name, 1);
        request.onupgradeneeded = () => request.result.createObjectStore('kv');
        request.onsuccess = () => {
          this.db = request.result;
          done(this.db);
        };
        request.onerror = () => done(null);
      } catch {
        done(null);
      }
    });
  }

  private async transact<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<T | null> {
    const db = await this.open();
    if (!db) return null;
    return new Promise((done) => {
      try {
        const request = run(db.transaction('kv', mode).objectStore('kv'));
        request.onsuccess = () => done(request.result as T);
        request.onerror = () => done(null);
      } catch {
        done(null);
      }
    });
  }

  async get(key: string): Promise<string | null> {
    return (await this.transact<string>('readonly', (store) => store.get(key))) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.transact('readwrite', (store) => store.put(value, key));
  }

  async clear(): Promise<void> {
    await this.transact('readwrite', (store) => store.clear());
  }
}

/**
 * A reader that remembers only what can never change.
 *
 * Wraps any other reader, so the application cannot tell the difference and
 * cannot come to depend on the cache being there.
 */
export class CachingReader implements ChainReader {
  private readonly inner: ChainReader;
  private readonly store: Store;
  /**
   * Counted so a test can prove the cache is actually being used.
   *
   * `misses` counts ROWS fetched from the chain, not calls made to this object.
   * Counting calls would make the number identical whether the cache worked or
   * not, which is exactly how a vacuous test gets written.
   */
  hits = 0;
  misses = 0;

  constructor(inner: ChainReader, store: Store = new MemoryStore()) {
    this.inner = inner;
    this.store = store;
  }

  get contractId(): string {
    return this.inner.contractId;
  }

  private key(kind: string, ...parts: (string | number)[]): string {
    // Namespaced by contract. Two contracts can both have a game 1, and they
    // are not the same game.
    return `${this.contractId}|${kind}|${parts.join('|')}`;
  }

  /**
   * An entry, cached forever.
   *
   * `(game, seq)` is written once and never rewritten - there is no map-delete
   * in the contract and exactly one write to Entries, and the contract tests
   * assert both. That is what makes this safe.
   */
  async getEntry(game: number, seq: number): Promise<EntryRow | null> {
    const key = this.key('entry', game, seq);
    const cached = await this.store.get(key);
    if (cached) {
      this.hits++;
      return JSON.parse(cached) as EntryRow;
    }
    this.misses++;
    const row = await this.inner.getEntry(game, seq);
    // A miss is not cached. An entry that does not exist yet is exactly the
    // thing that will exist later.
    if (row) await this.store.set(key, JSON.stringify(row));
    return row;
  }

  /**
   * The whole log, with the settled part served from cache.
   *
   * Two things here that an earlier version of this file got wrong, and both
   * are the difference between a cache that saves round trips and one that only
   * saves JSON parsing:
   *
   * 1. IT RESUMES. The old version read the cached prefix and then called
   *    `inner.getAllEntries`, which pages from seq 0 regardless — so every byte
   *    came off the chain anyway and the cache saved nothing anybody could
   *    measure.
   *
   * 2. IT CAN STOP BEFORE ASKING AT ALL. Given `knownNextSeq` — which a caller
   *    that has just read the game row already has — a complete cached log needs
   *    NO read. That is the case that matters: a game shorter than one page
   *    costs exactly one read whether cached or not, so resuming alone would do
   *    nothing for the ordinary game. Skipping does.
   *
   * Entries are contiguous: `next-seq` increments once per submission and each
   * writes exactly one entry, so holding 0..n-1 IS holding the whole log.
   */
  async getAllEntries(game: number, knownNextSeq?: number): Promise<EntryRow[]> {
    const out: EntryRow[] = [];
    for (let seq = 0; ; seq++) {
      const cachedRow = await this.store.get(this.key('entry', game, seq));
      if (!cachedRow) break;
      this.hits++;
      out.push(JSON.parse(cachedRow) as EntryRow);
    }

    const settled = out.length;
    // The log is already whole. Nothing to ask.
    if (knownNextSeq !== undefined && settled >= knownNextSeq) return out;

    // Resume at the page holding the first entry we do not have, rather than at
    // the beginning. A partly-cached page is re-read, which is unavoidable: the
    // rest of it was never cached.
    let start = Math.floor(settled / PAGE_SIZE) * PAGE_SIZE;
    for (;;) {
      const page = await this.inner.getPage(game, start);
      const rows = page.filter((entry): entry is EntryRow => entry !== null);
      for (const row of rows) {
        if (row.seq < settled) continue;
        out.push(row);
        this.misses++;
        await this.store.set(this.key('entry', game, row.seq), JSON.stringify(row));
      }
      if (rows.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out.sort((a, b) => a.seq - b.seq);
  }

  // Everything below is passed straight through. All of it can change.
  getFormatVersion(): Promise<number> {
    return this.inner.getFormatVersion();
  }
  getGameCount(): Promise<number> {
    return this.inner.getGameCount();
  }
  getGame(game: number): Promise<GameRow | null> {
    return this.inner.getGame(game);
  }
  getPage(game: number, start: number) {
    return this.inner.getPage(game, start);
  }
  getOpenFee() {
    return this.inner.getOpenFee();
  }
  getSponsorPrice() {
    return this.inner.getSponsorPrice();
  }
  getSponsorship(game: number, who: string) {
    return this.inner.getSponsorship(game, who);
  }
  getRankedCount() {
    return this.inner.getRankedCount();
  }
  /**
   * Which game is at a place in the ranked index. Cached forever.
   *
   * `(define-map RankedIndex uint uint)` is written exactly once, at creation,
   * at the index the counter is currently on - one `map-set` in the whole
   * contract and no `map-delete` anywhere. So position N is a game id that
   * cannot change.
   *
   * This is what the leaderboard spends a third of its reads on: it walks
   * 0..rankedCount asking the same question every time, and the answer was the
   * same on every visit anybody has ever made.
   */
  async getRankedGame(index: number): Promise<number | null> {
    const key = this.key('ranked', index);
    const cached = await this.store.get(key);
    if (cached !== null) {
      this.hits++;
      return JSON.parse(cached) as number;
    }
    this.misses++;
    const id = await this.inner.getRankedGame(index);
    // A miss is not cached, for the same reason an absent entry is not: an
    // index that holds nothing yet is exactly the one that will hold something.
    if (id !== null) await this.store.set(key, JSON.stringify(id));
    return id;
  }
  getResultHint(game: number) {
    return this.inner.getResultHint(game);
  }
  getTotalReserved() {
    return this.inner.getTotalReserved();
  }
  isSolvent() {
    return this.inner.isSolvent();
  }
  getWithdrawable() {
    return this.inner.getWithdrawable();
  }
  getHeight() {
    return this.inner.getHeight();
  }
  /** Never cached. Pending is the definition of a thing that changes. */
  getPending(game: number) {
    return this.inner.getPending(game);
  }

  /** Throw it all away. Nothing is lost, by construction. */
  async clear(): Promise<void> {
    await this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  // -------------------------------------------------------------------------
  // Everything past here is not caching at all. It is what makes this object
  // usable AS the chain rather than only as a reader.
  //
  // The board holds one chain and both reads and writes through it, so a
  // wrapper that implemented only ChainReader could never be the thing it
  // holds. Each of these is a straight forward, and none of them may ever grow
  // a cache: a write is the opposite of an immutable fact, and `reader` carries
  // the live rate-limit headroom, which is stale the moment it is copied.
  // -------------------------------------------------------------------------

  /** The endpoint, for the rate-limit headroom the board reports. */
  get reader(): unknown {
    return (this.inner as { reader?: unknown }).reader;
  }

  private get writer(): Partial<ChainWriter> {
    return this.inner as unknown as Partial<ChainWriter>;
  }

  openGame(rulesHash: string | null, ranked: boolean): Promise<WriteResult> {
    return this.writer.openGame!(rulesHash, ranked);
  }
  openSponsoredGame(rulesHash: string | null, ranked: boolean, opponent: string): Promise<WriteResult> {
    return this.writer.openSponsoredGame!(rulesHash, ranked, opponent);
  }
  openSponsoredBoth(
    rulesHash: string | null,
    ranked: boolean,
    white: string,
    black: string
  ): Promise<WriteResult> {
    return this.writer.openSponsoredBoth!(rulesHash, ranked, white, black);
  }
  submit(game: number, value: string, opts?: { expectRebate?: boolean }): Promise<WriteResult> {
    return this.writer.submit!(game, value, opts);
  }
  topUpSponsorship(game: number, who: string): Promise<WriteResult> {
    return this.writer.topUpSponsorship!(game, who);
  }
  settleSponsorship(game: number, who: string): Promise<WriteResult> {
    return this.writer.settleSponsorship!(game, who);
  }
  claimResult(game: number, result: string, terminalSeq: number): Promise<WriteResult> {
    return this.writer.claimResult!(game, result, terminalSeq);
  }
}

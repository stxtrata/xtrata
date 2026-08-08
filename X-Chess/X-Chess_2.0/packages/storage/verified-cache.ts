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

import type { ChainReader, EntryRow, GameRow } from '../chain/client.js';

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
   * The whole log, one page at a time, with the settled part served from cache.
   *
   * The last partial page is always re-read: it is the one that grows.
   */
  async getAllEntries(game: number): Promise<EntryRow[]> {
    const out: EntryRow[] = [];
    let seq = 0;
    for (;;) {
      const cachedRow = await this.store.get(this.key('entry', game, seq));
      if (cachedRow) {
        this.hits++;
        out.push(JSON.parse(cachedRow) as EntryRow);
        seq++;
        continue;
      }
      break;
    }

    // Everything from the first gap onwards comes from the chain.
    const settled = out.length;
    const page = await this.inner.getAllEntries(game);
    for (const row of page) {
      if (row.seq < settled) continue;
      out.push(row);
      this.misses++;
      await this.store.set(this.key('entry', game, row.seq), JSON.stringify(row));
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
  getRankedGame(index: number) {
    return this.inner.getRankedGame(index);
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
}

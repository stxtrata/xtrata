// An in-memory chain with the same interface as the live one.
//
// This exists so the whole application can be built and driven without a
// wallet, a node, or a network, deterministically. That is worth a great deal:
// it means every screen has a fast test, and it means development is not
// blocked on wallet plumbing.
//
// It is only a trustworthy test surface while it agrees with the real contract,
// so tests/chain/parity.test.ts runs the same scenarios against both and
// compares. When they disagree, the CONTRACT is right and this file is wrong.

import type {
  ChainReader,
  ChainWriter,
  EntryRow,
  GameRow,
  PendingRow,
  ResultHintRow,
  SponsorPrice,
  SponsorshipRow,
  WriteResult
} from './client.js';
import { PAGE_SIZE } from './client.js';

export class ContractError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'ContractError';
  }
}

export const MAX_SEQ = 65_536;

export interface MockOptions {
  contractId?: string;
  sender?: string;
  balances?: Record<string, bigint>;
  openFee?: bigint;
  bootstrap?: bigint;
  rebate?: bigint;
  rebateCount?: bigint;
  margin?: bigint;
  expiryBlocks?: number;
  height?: number;
}

export class MockChain implements ChainReader, ChainWriter {
  readonly contractId: string;
  /** Who the next write is from. The application sets this on connect. */
  sender: string;
  height: number;

  private readonly games = new Map<number, GameRow>();
  private readonly entries = new Map<string, EntryRow>();
  private readonly sponsorships = new Map<string, SponsorshipRow>();
  private readonly hints = new Map<number, ResultHintRow>();
  private readonly rankedIndex: number[] = [];
  readonly balances = new Map<string, bigint>();

  private gameCount = 0;
  private reserved = 0n;

  readonly openFee: bigint;
  readonly bootstrap: bigint;
  readonly rebate: bigint;
  readonly rebateCount: bigint;
  readonly margin: bigint;
  readonly expiryBlocks: number;

  constructor(options: MockOptions = {}) {
    this.contractId = options.contractId ?? 'SP000000000000000000002Q6VF78.xchess-core-v1';
    this.sender = options.sender ?? 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
    this.height = options.height ?? 1000;
    this.openFee = options.openFee ?? 1_000_000n;
    this.bootstrap = options.bootstrap ?? 60_000n;
    this.rebate = options.rebate ?? 10_000n;
    this.rebateCount = options.rebateCount ?? 45n;
    this.margin = options.margin ?? 50_000n;
    this.expiryBlocks = options.expiryBlocks ?? 4320;
    for (const [who, amount] of Object.entries(options.balances ?? {})) {
      this.balances.set(who, amount);
    }
  }

  // ---- balances --------------------------------------------------------

  balanceOf(who: string): bigint {
    return this.balances.get(who) ?? 0n;
  }

  private move(from: string, to: string, amount: bigint): void {
    if (amount === 0n) return;
    const available = this.balanceOf(from);
    // The contract's own `collect` fails the same way when a sender cannot pay.
    if (available < amount) throw new ContractError(1, 'not enough STX');
    this.balances.set(from, available - amount);
    this.balances.set(to, this.balanceOf(to) + amount);
  }

  private collect(amount: bigint): void {
    this.move(this.sender, this.contractId, amount);
  }

  /**
   * The one place STX leaves, mirroring the contract's single `pay-out`.
   *
   * The allowance is modelled too: paying more than the contract holds is the
   * failure the real one's `with-stx` would catch, and it must not be possible
   * to reach it here either.
   */
  private payOut(amount: bigint, to: string): void {
    if (amount === 0n) return;
    if (this.balanceOf(this.contractId) < amount) {
      throw new ContractError(113, 'the contract tried to move more than it holds');
    }
    this.move(this.contractId, to, amount);
  }

  // ---- reads -----------------------------------------------------------

  async getFormatVersion(): Promise<number> {
    return 1;
  }

  async getGameCount(): Promise<number> {
    return this.gameCount;
  }

  async getGame(game: number): Promise<GameRow | null> {
    return this.games.get(game) ? { ...this.games.get(game)! } : null;
  }

  async getEntry(game: number, seq: number): Promise<EntryRow | null> {
    const row = this.entries.get(`${game}|${seq}`);
    return row ? { ...row } : null;
  }

  async getPage(game: number, start: number): Promise<(EntryRow | null)[]> {
    const out: (EntryRow | null)[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) out.push(await this.getEntry(game, start + i));
    return out;
  }

  async getAllEntries(game: number): Promise<EntryRow[]> {
    const out: EntryRow[] = [];
    let start = 0;
    for (;;) {
      const page = await this.getPage(game, start);
      const found = page.filter((entry): entry is EntryRow => entry !== null);
      out.push(...found);
      if (found.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out;
  }

  async getOpenFee(): Promise<bigint> {
    return this.openFee;
  }

  async getSponsorPrice(): Promise<SponsorPrice> {
    const liability = this.rebate * this.rebateCount;
    return {
      bootstrap: this.bootstrap,
      liability,
      margin: this.margin,
      total: this.bootstrap + liability + this.margin
    };
  }

  async getSponsorship(game: number, who: string): Promise<SponsorshipRow | null> {
    const row = this.sponsorships.get(`${game}|${who}`);
    return row ? { ...row } : null;
  }

  async getRankedCount(): Promise<number> {
    return this.rankedIndex.length;
  }

  async getRankedGame(index: number): Promise<number | null> {
    return this.rankedIndex[index] ?? null;
  }

  async getResultHint(game: number): Promise<ResultHintRow | null> {
    const row = this.hints.get(game);
    return row ? { ...row } : null;
  }

  async getTotalReserved(): Promise<bigint> {
    return this.reserved;
  }

  /** Driven by tests; a real write in memory lands instantly. */
  pending: PendingRow[] = [];

  async getPending(): Promise<PendingRow[]> {
    return [...this.pending];
  }

  async getHeight(): Promise<number> {
    return this.height;
  }

  async isSolvent(): Promise<boolean> {
    return this.balanceOf(this.contractId) >= this.reserved;
  }

  async getWithdrawable(): Promise<bigint> {
    const balance = this.balanceOf(this.contractId);
    return balance > this.reserved ? balance - this.reserved : 0n;
  }

  // ---- writes ----------------------------------------------------------

  private register(rulesHash: string | null, ranked: boolean): number {
    const id = this.gameCount + 1;
    this.games.set(id, {
      id,
      openedBy: this.sender,
      openedAt: this.height,
      nextSeq: 0,
      rulesHash: rulesHash ? rulesHash.replace(/^0x/i, '').toLowerCase() : null,
      ranked
    });
    this.gameCount = id;
    if (ranked) this.rankedIndex.push(id);
    return id;
  }

  private done(id: number): WriteResult {
    // A deterministic stand-in for a txid. Nothing is broadcast; this exists so
    // the application's success path is exercised.
    return { ok: true, txid: `0x${String(id).padStart(64, '0')}` };
  }

  async openGame(rulesHash: string | null, ranked: boolean): Promise<WriteResult> {
    this.collect(this.openFee);
    return this.done(this.register(rulesHash, ranked));
  }

  private fund(game: number, who: string): void {
    if (this.sponsorships.has(`${game}|${who}`)) {
      throw new ContractError(107, 'already sponsored');
    }
    const liability = this.rebate * this.rebateCount;
    this.sponsorships.set(`${game}|${who}`, {
      rebatesLeft: this.rebateCount,
      rebate: this.rebate,
      reserved: liability,
      expiry: this.height + this.expiryBlocks,
      settled: false,
      fundedBy: this.sender
    });
    // Reserved before the bootstrap goes out, so that at no point does the
    // contract hold less than it claims to owe.
    this.reserved += liability;
    this.payOut(this.bootstrap, who);
  }

  async openSponsoredGame(
    rulesHash: string | null,
    ranked: boolean,
    opponent: string
  ): Promise<WriteResult> {
    if (opponent === this.sender) throw new ContractError(111, 'a game needs two different players');
    const price = await this.getSponsorPrice();
    this.collect(this.openFee + price.total);
    const id = this.register(rulesHash, ranked);
    this.fund(id, opponent);
    return this.done(id);
  }

  async openSponsoredBoth(
    rulesHash: string | null,
    ranked: boolean,
    white: string,
    black: string
  ): Promise<WriteResult> {
    if (white === black) throw new ContractError(111, 'a game needs two different players');
    const price = await this.getSponsorPrice();
    this.collect(this.openFee + price.total * 2n);
    const id = this.register(rulesHash, ranked);
    this.fund(id, white);
    this.fund(id, black);
    return this.done(id);
  }

  private maybeRebate(game: number, who: string): void {
    const key = `${game}|${who}`;
    const row = this.sponsorships.get(key);
    if (!row) return;
    if (row.settled || row.rebatesLeft === 0n || row.reserved < row.rebate) return;

    this.sponsorships.set(key, {
      ...row,
      rebatesLeft: row.rebatesLeft - 1n,
      reserved: row.reserved - row.rebate
    });
    this.reserved -= row.rebate;
    this.payOut(row.rebate, who);
  }

  async submit(game: number, value: string): Promise<WriteResult> {
    const row = this.games.get(game);
    if (!row) throw new ContractError(100, 'no such game');
    // The only filter, exactly as on chain: length, and nothing else.
    if (value.length !== 4 && value.length !== 5) {
      throw new ContractError(101, 'a submission must be four or five characters');
    }
    if (row.nextSeq >= MAX_SEQ) throw new ContractError(102, 'log full');

    const seq = row.nextSeq;
    this.entries.set(`${game}|${seq}`, { seq, value, sender: this.sender, height: this.height });
    this.games.set(game, { ...row, nextSeq: seq + 1 });
    this.maybeRebate(game, this.sender);
    return this.done(seq);
  }

  async topUpSponsorship(game: number, who: string): Promise<WriteResult> {
    const key = `${game}|${who}`;
    const row = this.sponsorships.get(key);
    if (!row) throw new ContractError(106, 'no sponsorship');
    if (!this.games.has(game)) throw new ContractError(100, 'no such game');
    if (row.settled) throw new ContractError(109, 'already settled');

    const liability = this.rebate * this.rebateCount;
    this.collect(liability + this.margin);
    this.sponsorships.set(key, {
      ...row,
      rebatesLeft: row.rebatesLeft + this.rebateCount,
      reserved: row.reserved + liability,
      expiry: this.height + this.expiryBlocks
    });
    this.reserved += liability;
    return this.done(game);
  }

  async settleSponsorship(game: number, who: string): Promise<WriteResult> {
    const key = `${game}|${who}`;
    const row = this.sponsorships.get(key);
    if (!row) throw new ContractError(106, 'no sponsorship');
    if (row.settled) throw new ContractError(109, 'already settled');
    if (this.height < row.expiry) throw new ContractError(108, 'not expired');

    const leftover = row.reserved;
    this.sponsorships.set(key, { ...row, reserved: 0n, rebatesLeft: 0n, settled: true });
    // The money does not move. Releasing the reservation is what turns it from
    // a liability into treasury.
    this.reserved -= leftover;
    return this.done(game);
  }

  async claimResult(game: number, result: string, terminalSeq: number): Promise<WriteResult> {
    if (!this.games.has(game)) throw new ContractError(100, 'no such game');
    if (this.hints.has(game)) throw new ContractError(114, 'already claimed');
    // Not validated, and not validatable without teaching this chess.
    this.hints.set(game, { result, terminalSeq, claimant: this.sender, height: this.height });
    return this.done(game);
  }

  // ---- test conveniences ----------------------------------------------

  mine(blocks = 1): void {
    this.height += blocks;
  }

  as(who: string): this {
    this.sender = who;
    return this;
  }

  fund$(who: string, amount: bigint): void {
    this.balances.set(who, this.balanceOf(who) + amount);
  }
}

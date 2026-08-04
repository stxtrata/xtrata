// An in-memory stand-in for xtrata-chess-log-v1.
//
// The board talks to this in simulation mode and to the real contract in live
// mode, through the same three read methods and two write methods. It exists so
// the whole game can be played, watched, and tested with no wallet, no node,
// and no fees.
//
// It is meant to be behaviourally identical to the contract, not merely
// similar: same error codes, same length filter, same sequence semantics.
// tests/contract.test.js runs the same scenarios against both and compares.

import { ERR, MAX_SEQ, PAGE_SIZE, FORMAT_VERSION, isWellFormedLength } from './protocol.js';

// Seconds per Stacks block. Nakamoto blocks land every few seconds, and the
// exact figure matters less than that simulated games have a plausible clock to
// be replayed against.
export const BLOCK_SECONDS = 6;

// A fixed epoch rather than the wall clock, so a seed always produces the same
// game down to its timestamps.
export const SIM_EPOCH = 1_785_000_000;

export class MockChain {
  constructor(options = {}) {
    this.games = new Map();
    this.gameCount = 0;
    this.height = 1;
    this.time = options.startTime ?? SIM_EPOCH;
    this.blockSeconds = options.blockSeconds ?? BLOCK_SECONDS;
    // height -> unix seconds. A plain Map, so it reads exactly like the live
    // and sealed block-time sources do.
    this.blockTimes = new Map([[this.height, this.time]]);
    this.listeners = new Set();
  }

  // ---- lifecycle -----------------------------------------------------

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _emit() {
    for (const fn of this.listeners) fn(this);
  }

  // Simulation only. The real chain advances on its own.
  advance(blocks = 1) {
    for (let i = 0; i < blocks; i++) {
      this.height += 1;
      this.time += this.blockSeconds;
      this.blockTimes.set(this.height, this.time);
    }
  }

  // ---- writes --------------------------------------------------------

  openGame(sender = 'SIM') {
    const id = this.gameCount + 1;
    this.games.set(id, {
      openedBy: sender,
      openedAt: this.height,
      nextSeq: 0,
      moves: []
    });
    this.gameCount = id;
    this._emit();
    return { ok: true, value: id };
  }

  submitMove(game, mv, sender = 'SIM') {
    const entry = this.games.get(game);
    if (!entry) return { ok: false, error: ERR.NO_GAME };
    if (!isWellFormedLength(mv)) return { ok: false, error: ERR.BAD_LENGTH };
    if (entry.nextSeq >= MAX_SEQ) return { ok: false, error: ERR.LOG_FULL };

    const seq = entry.nextSeq;
    entry.moves.push({ mv, sender, height: this.height, seq });
    entry.nextSeq = seq + 1;
    this._emit();
    return { ok: true, value: seq };
  }

  // ---- reads ---------------------------------------------------------

  getFormatVersion() {
    return FORMAT_VERSION;
  }

  getGameCount() {
    return this.gameCount;
  }

  getGame(game) {
    const entry = this.games.get(game);
    if (!entry) return null;
    return {
      openedBy: entry.openedBy,
      openedAt: entry.openedAt,
      nextSeq: entry.nextSeq
    };
  }

  getMove(game, seq) {
    const entry = this.games.get(game);
    if (!entry) return null;
    return entry.moves[seq] ?? null;
  }

  // Up to PAGE_SIZE consecutive entries. Trailing nulls mean end of log, which
  // is how the contract reports it too.
  getPage(game, start) {
    const entry = this.games.get(game);
    const out = new Array(PAGE_SIZE).fill(null);
    if (!entry) return out;
    for (let i = 0; i < PAGE_SIZE; i++) {
      out[i] = entry.moves[start + i] ?? null;
    }
    return out;
  }

  // Convenience for the board: page until the log runs out.
  async getAllMoves(game) {
    const out = [];
    let start = 0;
    for (;;) {
      const page = this.getPage(game, start);
      const found = page.filter((x) => x !== null);
      out.push(...found);
      if (found.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out;
  }
}

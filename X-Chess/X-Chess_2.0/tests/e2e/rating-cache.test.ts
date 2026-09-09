// A rating the board has already computed should not cost the walk that
// computed it — and a kept rating must be able to say whether it still holds.
//
// The standings lived in memory only. Opening Profile before the Leaderboard
// showed no rating at all, and the way to get one was to sit through every
// ranked game being read and replayed. The board knew the number; the price of
// being told it was the most expensive thing the board does.
//
// The interesting half is the check. A stamp of "how many ranked games existed"
// is the obvious one and it is WRONG: a game already inside that count can
// finish later and move two ratings without the count changing, so a count-only
// stamp confirms a stale figure as current. The stamp carries the unfinished
// games too.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

const WHO = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CONTRACT = 'SP000000000000000000002Q6VF78.xchess';

let dom: JSDOM;
let store: Map<string, string>;

beforeEach(() => {
  resetForTests();
  store = new Map();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
  (globalThis as unknown as Record<string, unknown>).localStorage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    key: (i: number) => [...store.keys()][i] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, v)
  } as Storage;
});

const ROW = {
  rank: 1, principal: WHO, rating: 1544, games: 9, wins: 6, draws: 1, losses: 2,
  whiteGames: 5, blackGames: 4, peak: 1560, provisional: false, history: [1500, 1544],
  streak: 2
};

/**
 * A board whose chain answers the two questions the check asks.
 *
 * `rankedCount` is the index length; `seqs` is the submission count of any game
 * asked for by row. Both are read live from the object, so a test can move the
 * chain between the walk and the check the way the chain actually moves.
 */
function board(chain: { rankedCount: number; seqs: Record<number, number> }) {
  mountShell(dom.window.document);
  const reads = { rows: 0, counts: 0 };
  const app = new ChessApp({
    chain: new MockChain({ balances: {} }) as never,
    document: dom.window.document,
    connect: async () => ({ address: WHO }),
    disconnect: async () => {}
  });
  (app as unknown as { chain: unknown }).chain = {
    contractId: CONTRACT,
    async getRankedCount() {
      reads.counts++;
      return chain.rankedCount;
    },
    async getGame(id: number) {
      reads.rows++;
      return { id, nextSeq: chain.seqs[id] ?? 0, openedAt: 1, openedBy: WHO, ranked: true, rulesHash: '0x00' };
    }
  };
  return { app, reads };
}

type Inner = {
  saveRatingCache(rows: unknown[], atCount: number, open: Array<[number, number]>): void;
  loadRatingCache(): void;
  confirmRatings(): Promise<void>;
  ratingNoteText(): string | null;
  ratedRows: unknown[];
  ratedChecked: string;
};
const inner = (app: ChessApp): Inner => app as unknown as Inner;

describe('keeping the standings across visits', () => {
  it('writes them where the next visit can find them', () => {
    const { app } = board({ rankedCount: 12, seqs: {} });
    inner(app).saveRatingCache([ROW], 12, [[7, 4]]);

    const raw = store.get(`xchess:ratings:${CONTRACT}`);
    expect(raw, 'the walk kept nothing').toBeTruthy();
    const kept = JSON.parse(raw!);
    expect(kept.rows[0].rating).toBe(1544);
    expect(kept.atCount).toBe(12);
    expect(kept.open, 'the unfinished games are what make it checkable').toEqual([[7, 4]]);
  });

  it('shows a rating on a board that has never walked', () => {
    const first = board({ rankedCount: 12, seqs: {} });
    inner(first.app).saveRatingCache([ROW], 12, []);

    // A DIFFERENT BOARD. Nothing carried over but storage, which is the point.
    const second = board({ rankedCount: 12, seqs: {} });
    expect(inner(second.app).ratedRows, 'nothing loads until it is asked to').toEqual([]);
    inner(second.app).loadRatingCache();
    expect(inner(second.app).ratedRows).toEqual([ROW]);
  });

  it('refuses standings computed against another contract', () => {
    const { app } = board({ rankedCount: 12, seqs: {} });
    store.set(
      `xchess:ratings:${CONTRACT}`,
      JSON.stringify({ contract: 'SP000000000000000000002Q6VF78.other', atCount: 12, open: [], rows: [ROW] })
    );
    inner(app).loadRatingCache();
    expect(inner(app).ratedRows, 'a rating under other rules is a different rating').toEqual([]);
  });
});

describe('checking whether a kept rating still holds', () => {
  it('confirms it when nothing has moved', async () => {
    const chain = { rankedCount: 12, seqs: { 7: 4 } };
    const { app } = board(chain);
    inner(app).saveRatingCache([ROW], 12, [[7, 4]]);
    inner(app).loadRatingCache();

    await inner(app).confirmRatings();
    expect(inner(app).ratedChecked).toBe('current');
    expect(inner(app).ratingNoteText()).toContain('nothing has changed');
  });

  it('flags it when a new ranked game exists', async () => {
    const chain = { rankedCount: 12, seqs: { 7: 4 } };
    const { app } = board(chain);
    inner(app).saveRatingCache([ROW], 12, [[7, 4]]);
    inner(app).loadRatingCache();

    chain.rankedCount = 13;
    await inner(app).confirmRatings();
    expect(inner(app).ratedChecked).toBe('stale');
    expect(inner(app).ratingNoteText()).toContain('Leaderboard');
  });

  it('flags it when a game already counted has been played on', async () => {
    // THE ONE A COUNT-ONLY STAMP GETS WRONG. Game 7 was in progress when the
    // walk ran and is inside `atCount` already, so the index does not grow when
    // it finishes — and finishing moves two ratings.
    const chain = { rankedCount: 12, seqs: { 7: 4 } };
    const { app } = board(chain);
    inner(app).saveRatingCache([ROW], 12, [[7, 4]]);
    inner(app).loadRatingCache();

    chain.seqs[7] = 5;
    await inner(app).confirmRatings();
    expect(inner(app).ratedChecked, 'the count never moved, and the rating did').toBe('stale');
  });

  it('reads one row per unfinished game and nothing else', async () => {
    // The whole justification for checking rather than recomputing. The walk
    // reads and replays every ranked game; this reads the count and the games
    // that could still change.
    const chain = { rankedCount: 40, seqs: { 7: 4, 9: 2 } };
    const { app, reads } = board(chain);
    inner(app).saveRatingCache([ROW], 40, [[7, 4], [9, 2]]);
    inner(app).loadRatingCache();

    await inner(app).confirmRatings();
    expect(reads.counts).toBe(1);
    expect(reads.rows, 'two unfinished games out of forty ranked').toBe(2);
  });

  it('stops at the first game that moved', async () => {
    const chain = { rankedCount: 40, seqs: { 7: 5, 9: 2 } };
    const { app, reads } = board(chain);
    inner(app).saveRatingCache([ROW], 40, [[7, 4], [9, 2]]);
    inner(app).loadRatingCache();

    await inner(app).confirmRatings();
    expect(reads.rows, 'the answer was settled by the first').toBe(1);
  });

  it('does not call a failed check a stale rating', async () => {
    // Nor a current one. An unreadable chain says nothing about the standings,
    // and the note goes on saying it is being checked.
    const { app } = board({ rankedCount: 12, seqs: {} });
    inner(app).saveRatingCache([ROW], 12, []);
    inner(app).loadRatingCache();
    (app as unknown as { chain: { getRankedCount(): Promise<number> } }).chain.getRankedCount =
      async () => {
        throw new Error('offline');
      };

    await inner(app).confirmRatings();
    expect(inner(app).ratedChecked).toBe('no');
    expect(inner(app).ratingNoteText()).toContain('being checked');
  });

  it('says nothing about standings computed in this session', () => {
    // They came from the walk a moment ago. A caveat there would be the board
    // qualifying its own fresh answer.
    const { app } = board({ rankedCount: 12, seqs: {} });
    inner(app).ratedRows = [ROW];
    expect(inner(app).ratingNoteText()).toBeNull();
  });
});

it('invalidates the unversioned cache that may contain doubled ratings', () => {
  const {app} = board({rankedCount: 12, seqs: {}});
  store.set(`xchess:ratings:${CONTRACT}`, JSON.stringify({contract: CONTRACT, atCount: 12, open: [], rows: [ROW]}));
  inner(app).loadRatingCache(); expect(inner(app).ratedRows).toEqual([]);
});

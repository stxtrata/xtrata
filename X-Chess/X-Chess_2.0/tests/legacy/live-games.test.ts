// The real games, replayed offline, against results a person checked.
//
// This is the test that would have caught ADR-0007 before it reached a real
// game rather than after.
//
// A finished game is not stored anywhere. The position, the result and every
// rating are RECOMPUTED by replaying the log, every time anybody opens the
// board, forever. So a change to replay does not only affect new games - it
// reaches back and can change what an old one means. That is not hypothetical:
// a real Scholar's Mate on the legacy contracts read 1-0 by checkmate under the
// protocol it was played under, and 0-1 by resignation under the next one. Same
// bytes on chain, opposite winner.
//
// Nothing else in the suite defends that against a game a real person played.
// `tests/replay` and `tests/fuzz` prove replay is total and deterministic over
// invented input; this proves it still says the same thing about NINE REAL GAMES
// on the contract the board is bound to.
//
// THE ORDER THESE WERE WRITTEN IN MATTERS. The expectations were derived once,
// then read back against the live board by a person before being committed. An
// expectation generated while a bug is present writes the bug down as the
// specification, and every future run then defends it - which is exactly how
// ADR-0007's wrong fixture came to exist.
//
// Offline. Refresh the frozen bytes with:
//   LIVE=1 npx vitest run tests/legacy/fetch-canary.test.ts
// and then RE-CHECK the table below, because a re-capture moves the goalposts.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { replay } from '../../packages/replay/replay.js';
import { recoverRules } from '../../packages/protocol/recover.js';
import { checkEligibility } from '../../packages/ratings/eligibility.js';
import { computeRatings, leaderboard } from '../../packages/ratings/elo-v1.js';
import type { RatedGame } from '../../packages/ratings/elo-v1.js';

const FIXTURE = fileURLToPath(
  new URL('../../harness/fixtures/canary-mainnet.json', import.meta.url)
);

interface Frozen {
  contract: string;
  count: number;
  ranked: number[];
  games: {
    game: {
      id: number;
      openedBy: string;
      openedAt: number;
      nextSeq: number;
      rulesHash: string | null;
      ranked: boolean;
    };
    entries: { seq: number; value: string; sender: string; height: number }[];
    hint: { result: string; terminalSeq: number } | null;
  }[];
}

const frozen = existsSync(FIXTURE) ? (JSON.parse(readFileSync(FIXTURE, 'utf8')) as Frozen) : null;

const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OPPONENT = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

/**
 * What the chain held on 2026-08-12, hand-checked against the live board.
 *
 * `accepted` and `rejected` are the split replay makes of the submissions, and
 * they are the numbers worth pinning hardest: ADR-0007's failure was exactly a
 * string moving from one column to the other. `confirmed` is whether the rules
 * could be recovered from the commitment, which is what decides whether a game
 * may be rated at all - and which master proposal 13 deliberately narrows, so
 * this table is also what tells you whether that change costs a real game.
 */
const EXPECTED: Record<
  number,
  {
    entries: number;
    accepted: number;
    rejected: number;
    ranked: boolean;
    confirmed: boolean;
    white: string;
    black: string;
    status: 'live' | 'over';
    result: string | null;
    termination: string | null;
  }
> = {
  1: { entries: 21, accepted: 20, rejected: 1, ranked: false, confirmed: true,
       white: XTRATA, black: 'anyone-else', status: 'live', result: null, termination: null },
  2: { entries: 1, accepted: 1, rejected: 0, ranked: false, confirmed: true,
       white: XTRATA, black: 'anyone-else', status: 'live', result: null, termination: null },
  // No commitment this board can reproduce, so it referees nothing and the
  // sides fall back to "anyone". A game like this can never be rated.
  3: { entries: 1, accepted: 1, rejected: 0, ranked: false, confirmed: false,
       white: 'anyone', black: 'anyone', status: 'live', result: null, termination: null },
  4: { entries: 33, accepted: 29, rejected: 4, ranked: false, confirmed: true,
       white: XTRATA, black: 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W',
       status: 'live', result: null, termination: null },
  5: { entries: 10, accepted: 10, rejected: 0, ranked: true, confirmed: true,
       white: OPPONENT, black: XTRATA, status: 'live', result: null, termination: null },
  // THE ONE FINISHED GAME. Everything about it is permanent, so everything
  // about it is pinned.
  6: { entries: 7, accepted: 7, rejected: 0, ranked: true, confirmed: true,
       white: XTRATA, black: OPPONENT, status: 'over', result: '1-0', termination: 'checkmate' },
  7: { entries: 1, accepted: 1, rejected: 0, ranked: true, confirmed: false,
       white: 'anyone', black: 'anyone', status: 'live', result: null, termination: null },
  // The game the first testers were playing when they reported the board.
  8: { entries: 38, accepted: 35, rejected: 3, ranked: true, confirmed: true,
       white: 'SPF0285448AVAQ2ASM78FWW89YF1VHPQ70MV4N4K',
       black: 'SP2Z2CBMGWB9MQZAF5Z8X56KS69XRV3SJF4WKJ7J9',
       status: 'live', result: null, termination: null },
  9: { entries: 0, accepted: 0, rejected: 0, ranked: true, confirmed: false,
       white: 'anyone', black: 'anyone', status: 'live', result: null, termination: null }
};

/** The position game 6 ended in. Permanent: it can never legitimately change. */
const GAME_6_FINAL_FEN = 'rn1qkbnr/ppp2Qpp/3p4/4p3/2B1P1b1/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4';

/** Replay one frozen game exactly as the board does. */
function derive(entry: Frozen['games'][number]) {
  const rules = recoverRules({
    rulesHash: entry.game.rulesHash,
    openedBy: entry.game.openedBy,
    ranked: entry.game.ranked,
    senders: entry.entries.map((e) => e.sender)
  });
  const state = replay(
    entry.entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
    { rules: rules.rules }
  );
  return { rules, state };
}

const RECHECK =
  'If the fixture was just re-captured, this is expected: read the game back off ' +
  'the live board and update the table in this file. Do not simply paste the new number.';

describe.skipIf(!frozen)('the real games on the contract the board is bound to', () => {
  it('holds every game the contract said it had', () => {
    // A short capture is the failure that matters most here, because it would
    // silently drop a real game out of every expectation below.
    expect(frozen!.games.length).toBe(frozen!.count);
    for (const entry of frozen!.games) {
      expect(entry.entries.length, `game ${entry.game.id} was frozen short`).toBe(
        entry.game.nextSeq
      );
    }
    expect(Object.keys(EXPECTED).length, `there are games with no checked expectation. ${RECHECK}`)
      .toBe(frozen!.count);
  });

  it('replays every game to the answer a person checked', () => {
    for (const entry of frozen!.games) {
      const id = entry.game.id;
      const want = EXPECTED[id];
      expect(want, `game ${id} is on chain and has no checked expectation. ${RECHECK}`).toBeDefined();

      const { rules, state } = derive(entry);

      expect(entry.entries.length, `game ${id}: entries. ${RECHECK}`).toBe(want.entries);
      // The split ADR-0007 moved a string across.
      expect(state.accepted.length, `game ${id}: ACCEPTED submissions. ${RECHECK}`).toBe(
        want.accepted
      );
      expect(state.rejected.length, `game ${id}: REJECTED submissions. ${RECHECK}`).toBe(
        want.rejected
      );
      expect(state.status, `game ${id}: status`).toBe(want.status);
      expect(state.result ?? null, `game ${id}: RESULT`).toBe(want.result);
      expect(state.termination ?? null, `game ${id}: termination`).toBe(want.termination);
      expect(entry.game.ranked, `game ${id}: ranked flag`).toBe(want.ranked);
      expect(rules.confirmed, `game ${id}: rules recovered from the commitment`).toBe(
        want.confirmed
      );
      expect(rules.rules.white, `game ${id}: white`).toBe(want.white);
      expect(rules.rules.black, `game ${id}: black`).toBe(want.black);
    }
  });

  it('ends game 6 in the position it actually ended in', () => {
    // The only finished game, so the only one whose position is permanent. A
    // FEN is the whole board in one string: if replay ever reconstructs this
    // game differently, this is where it shows.
    const six = frozen!.games.find((g) => g.game.id === 6)!;
    const { state } = derive(six);
    expect(state.position.fen()).toBe(GAME_6_FINAL_FEN);
    // Checkmate, at the seventh submission, by White.
    expect(state.accepted[state.accepted.length - 1]?.seq).toBe(6);
  });

  it('is deterministic: the same bytes give the same answer twice', () => {
    // The property the whole architecture rests on, asserted against real bytes
    // rather than invented ones.
    for (const entry of frozen!.games) {
      const a = JSON.stringify(derive(entry).state);
      const b = JSON.stringify(derive(entry).state);
      expect(a, `game ${entry.game.id} replayed differently twice`).toBe(b);
    }
  });

  it('agrees with the contract about which games are ranked', () => {
    // The ranked INDEX is what elo-v1 walks, in chain order. If a game's flag
    // and its presence in the index ever disagreed, two readers could rate
    // different sets of games.
    const flagged = frozen!.games.filter((g) => g.game.ranked).map((g) => g.game.id);
    expect([...frozen!.ranked].sort((a, b) => a - b)).toEqual(flagged.sort((a, b) => a - b));
  });

  it('rates exactly the games that qualify, and no others', () => {
    const eligible: number[] = [];
    for (const id of frozen!.ranked) {
      const entry = frozen!.games.find((g) => g.game.id === id);
      if (!entry) continue;
      const { rules, state } = derive(entry);
      if (checkEligibility({ rulesHash: entry.game.rulesHash }, rules.rules, state).eligible) {
        eligible.push(id);
      }
    }
    // Five games carry the ranked flag; only game 6 has finished, and the other
    // four are refused for reasons worth being able to see: 5 and 8 have no
    // result yet, 7 and 9 have rules that cannot be recovered at all.
    expect(eligible, `the set of rateable games changed. ${RECHECK}`).toEqual([6]);
  });

  it('derives the leaderboard a player would actually see', () => {
    const rated: RatedGame[] = [];
    for (const id of frozen!.ranked) {
      const entry = frozen!.games.find((g) => g.game.id === id);
      if (!entry) continue;
      const { rules, state } = derive(entry);
      if (!checkEligibility({ rulesHash: entry.game.rulesHash }, rules.rules, state).eligible) {
        continue;
      }
      const last = state.accepted[state.accepted.length - 1];
      rated.push({
        game: id,
        white: rules.rules.white,
        black: rules.rules.black,
        result: state.result as RatedGame['result'],
        terminalHeight: last?.height ?? 0
      });
    }

    const rows = leaderboard(computeRatings(rated));
    // One decided game from a 1200 start: the winner gains sixteen and the
    // loser gives up sixteen, both provisional on a single game.
    expect(
      rows.map((r) => [r.principal, r.rating, r.games, r.wins, r.losses]),
      `the ratings a player sees changed. ${RECHECK}`
    ).toEqual([
      [XTRATA, 1216, 1, 1, 0],
      [OPPONENT, 1184, 1, 0, 1]
    ]);
  });
});

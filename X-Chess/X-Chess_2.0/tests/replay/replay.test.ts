// Replay's behaviour, stated as the things a reader is entitled to rely on.

import { describe, expect, it } from 'vitest';
import { replay } from '../../packages/replay/replay.js';
import type { Submission } from '../../packages/replay/replay.js';
import { EVENT_STRINGS } from '../../packages/replay/events.js';
import { REJECTED } from '../../packages/replay/result.js';
import { DEFAULT_RULES } from '../../packages/protocol/rules.js';
import { START_FEN } from '../../packages/chess/fen.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MALLORY = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

const duel = { ...DEFAULT_RULES, white: ALICE, black: BOB };

const log = (...entries: [string, string | null][]): Submission[] =>
  entries.map(([mv, sender], seq) => ({ mv, sender, seq, height: 1000 + seq }));

describe('moves', () => {
  it('applies a legal move and skips an illegal one', () => {
    const state = replay(log(['e2e4', ALICE], ['e7e5', BOB], ['e2e4', ALICE]), { rules: duel });
    expect(state.accepted).toHaveLength(2);
    expect(state.rejected).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED.EMPTY_SQUARE);
    expect(state.turn).toBe('white');
  });

  it('records every submission in the log, accepted or not', () => {
    const state = replay(log(['e2e4', ALICE], ['zzzz', BOB], ['e7e5', BOB]), { rules: duel });
    expect(state.log).toHaveLength(3);
    expect(state.log.map((r) => r.status)).toEqual(['accepted', 'rejected', 'accepted']);
  });

  it('keeps ply and seq apart', () => {
    // seq counts submissions including the skipped ones; ply counts moves. A
    // reader that conflates them draws the wrong board.
    const state = replay(log(['zzzz', ALICE], ['e2e4', ALICE], ['e7e5', BOB]), { rules: duel });
    expect(state.accepted.map((a) => a.seq)).toEqual([1, 2]);
    expect(state.accepted.map((a) => (a.kind === 'move' ? a.ply : null))).toEqual([1, 2]);
  });

  it('tells the reasons a bad move can fail apart', () => {
    const cases: [string, string, string][] = [
      ['not-a-move', ALICE, REJECTED.MALFORMED],
      ['a3a4', ALICE, REJECTED.EMPTY_SQUARE],
      ['e7e5', ALICE, REJECTED.WRONG_TURN],
      ['e2e5', ALICE, REJECTED.ILLEGAL]
    ];
    for (const [mv, sender, reason] of cases) {
      const state = replay(log([mv, sender]), { rules: duel });
      expect(state.rejected[0]?.reason, mv).toBe(reason);
    }
  });

  it('requires a promotion to name its piece', () => {
    const fen = '4k3/P7/8/8/8/8/8/4K3 w - - 0 1';
    const rules = { ...duel, startFen: fen };
    expect(replay(log(['a7a8', ALICE]), { rules }).accepted).toHaveLength(0);
    expect(replay(log(['a7a8q', ALICE]), { rules }).accepted).toHaveLength(1);
    expect(replay(log(['a7a8n', ALICE]), { rules }).accepted).toHaveLength(1);
  });
});

describe('the invariant', () => {
  // The property the whole design rests on: a rejected entry is permanently
  // visible and changes nothing. If removing the rejected entries changed the
  // position, the log would not be a shared record.
  it('reaches the same position with the rejected entries deleted', () => {
    const messy = log(
      ['e2e4', ALICE],
      ['e2e4', MALLORY],
      ['e7e5', BOB],
      ['zzzz', ALICE],
      ['g1f3', ALICE],
      ['e7e5', BOB],
      ['b8c6', BOB]
    );
    const full = replay(messy, { rules: duel });
    const cleaned = replay(
      full.accepted.map((a) => ({ mv: a.raw, sender: a.sender, height: a.height })),
      { rules: duel }
    );
    expect(cleaned.fen).toBe(full.fen);
    expect(cleaned.result).toBe(full.result);
    expect(cleaned.accepted).toHaveLength(full.accepted.length);
  });
});

describe('rules', () => {
  it('refuses a move from somebody who does not hold that side', () => {
    const state = replay(log(['e2e4', BOB]), { rules: duel });
    expect(state.rejected[0].reason).toBe(REJECTED.WRONG_PLAYER);
  });

  it('lets anyone-else play, except the named opposite side', () => {
    const rules = { ...DEFAULT_RULES, white: ALICE, black: 'anyone-else' };
    const state = replay(log(['e2e4', ALICE], ['e7e5', ALICE], ['e7e5', MALLORY]), { rules });
    expect(state.rejected[0].reason).toBe(REJECTED.WRONG_PLAYER);
    expect(state.accepted).toHaveLength(2);
  });

  it('applies the allow list before anything else', () => {
    const rules = { ...DEFAULT_RULES, allow: [ALICE] };
    expect(replay(log(['e2e4', MALLORY]), { rules }).rejected[0].reason).toBe(REJECTED.NOT_ALLOWED);
  });

  it('counts the cooldown in moves, not blocks', () => {
    const rules = { ...DEFAULT_RULES, cooldown: 2, allow: [] };
    // Alice, Bob, Mallory, then Alice again — three moves since hers, so fine.
    const ok = replay(
      log(['e2e4', ALICE], ['e7e5', BOB], ['g1f3', MALLORY], ['b8c6', ALICE]),
      { rules }
    );
    expect(ok.accepted).toHaveLength(4);

    // Alice, Bob, Alice — only one move since hers.
    const blocked = replay(log(['e2e4', ALICE], ['e7e5', BOB], ['g1f3', ALICE]), { rules });
    expect(blocked.rejected[0].reason).toBe(REJECTED.COOLDOWN);
  });

  it('refuses the same sender twice running under noConsecutive', () => {
    const rules = { ...DEFAULT_RULES, noConsecutive: true };
    const state = replay(log(['e2e4', ALICE], ['e7e5', ALICE]), { rules });
    expect(state.rejected[0].reason).toBe(REJECTED.CONSECUTIVE);
  });
});

describe('control events', () => {
  it('resigns for the side that sent it', () => {
    const white = replay(log(['e2e4', ALICE], ['e7e5', BOB], [EVENT_STRINGS.RESIGN, ALICE]), {
      rules: duel
    });
    expect(white.result).toBe('0-1');
    expect(white.termination).toBe('resignation');
    expect(white.terminalSequence).toBe(2);

    const black = replay(log(['e2e4', ALICE], [EVENT_STRINGS.RESIGN, BOB]), { rules: duel });
    expect(black.result).toBe('1-0');
  });

  it('lets a player resign when it is not their turn', () => {
    // Conceding is not a move, so it does not wait for a turn.
    const state = replay(log(['e2e4', ALICE], [EVENT_STRINGS.RESIGN, ALICE]), { rules: duel });
    expect(state.result).toBe('0-1');
  });

  it('refuses a control event from somebody who holds neither side', () => {
    const state = replay(log([EVENT_STRINGS.RESIGN, MALLORY]), { rules: duel });
    expect(state.rejected[0].reason).toBe(REJECTED.NOT_A_PLAYER);
    expect(state.result).toBeNull();
  });

  it('refuses a resignation on an open board, where nobody owns the game', () => {
    const state = replay(log([EVENT_STRINGS.RESIGN, MALLORY]), { rules: DEFAULT_RULES });
    expect(state.rejected[0].reason).toBe(REJECTED.NOT_A_PLAYER);
  });

  it('agrees a draw when the other side accepts', () => {
    const state = replay(
      log(['e2e4', ALICE], [EVENT_STRINGS.DRAW_OFFER, ALICE], [EVENT_STRINGS.DRAW_ACCEPT, BOB]),
      { rules: duel }
    );
    expect(state.result).toBe('1/2-1/2');
    expect(state.termination).toBe('agreement');
    expect(state.terminalSequence).toBe(2);
  });

  it('refuses an acceptance of your own offer', () => {
    const state = replay(
      log([EVENT_STRINGS.DRAW_OFFER, ALICE], [EVENT_STRINGS.DRAW_ACCEPT, ALICE]),
      { rules: duel }
    );
    expect(state.rejected[0].reason).toBe(REJECTED.NO_OFFER);
    expect(state.result).toBeNull();
  });

  it('refuses an acceptance with nothing to accept', () => {
    expect(replay(log([EVENT_STRINGS.DRAW_ACCEPT, BOB]), { rules: duel }).rejected[0].reason).toBe(
      REJECTED.NO_OFFER
    );
  });

  it('refuses a second offer while one is standing', () => {
    const state = replay(
      log([EVENT_STRINGS.DRAW_OFFER, ALICE], [EVENT_STRINGS.DRAW_OFFER, BOB]),
      { rules: duel }
    );
    expect(state.rejected[0].reason).toBe(REJECTED.OFFER_PENDING);
    expect(state.pendingOffer).toBe('white');
  });

  it('lets a move lapse a standing offer', () => {
    const state = replay(
      log(
        [EVENT_STRINGS.DRAW_OFFER, ALICE],
        ['e2e4', ALICE],
        [EVENT_STRINGS.DRAW_ACCEPT, BOB]
      ),
      { rules: duel }
    );
    expect(state.pendingOffer).toBeNull();
    expect(state.result).toBeNull();
    expect(state.rejected[0].reason).toBe(REJECTED.NO_OFFER);
  });

  it('does not apply the cooldown to a resignation', () => {
    // A cooldown paces the moves in a game. Applying it to a concession would
    // make a game unfinishable, which is not a rule anybody agreed to.
    const rules = { ...duel, cooldown: 1 };
    const state = replay(log(['e2e4', ALICE], [EVENT_STRINGS.RESIGN, ALICE]), { rules });
    expect(state.result).toBe('0-1');
  });

  it('applies the allow list to a resignation', () => {
    const rules = { ...duel, allow: [BOB] };
    expect(replay(log([EVENT_STRINGS.RESIGN, ALICE]), { rules }).rejected[0].reason).toBe(
      REJECTED.NOT_ALLOWED
    );
  });

  it('is case sensitive, so a near miss is malformed rather than a resignation', () => {
    const state = replay(log(['RESGN', ALICE]), { rules: duel });
    expect(state.result).toBeNull();
    expect(state.rejected[0].reason).toBe(REJECTED.MALFORMED);
  });
});

describe('termination', () => {
  it('finds checkmate and stops there', () => {
    const state = replay(
      log(['f2f3', ALICE], ['e7e5', BOB], ['g2g4', ALICE], ['d8h4', BOB], ['e2e4', ALICE]),
      { rules: duel }
    );
    expect(state.result).toBe('0-1');
    expect(state.termination).toBe('checkmate');
    expect(state.terminalSequence).toBe(3);
    expect(state.rejected.at(-1)?.reason).toBe(REJECTED.GAME_OVER);
    expect(state.legalMoves).toEqual([]);
  });

  it('finds stalemate', () => {
    // Qf5-f7 leaves the black king on h8 with g7, g8 and h7 all covered and no
    // check on h8 itself.
    const rules = { ...duel, startFen: '7k/8/6K1/5Q2/8/8/8/8 w - - 0 1' };
    const state = replay(log(['f5f7', ALICE]), { rules });
    expect(state.result).toBe('1/2-1/2');
    expect(state.termination).toBe('stalemate');
  });

  it('finds insufficient material the moment it arises', () => {
    // Bishop against knight is playable; the bishop taking the knight leaves
    // king and bishop against a lone king, which is dead.
    const rules = { ...duel, startFen: '4k3/8/8/8/8/8/4n3/3BK3 w - - 0 1' };
    const state = replay(log(['d1e2', ALICE]), { rules });
    expect(state.result).toBe('1/2-1/2');
    expect(state.termination).toBe('insufficient-material');
  });

  it('treats a start position that is already dead as over before any move', () => {
    // King and knight against a lone king is insufficient the moment it is set
    // up, so the first submission has nothing to add to.
    const rules = { ...duel, startFen: '4k3/8/8/8/8/8/4n3/4K3 w - - 0 1' };
    const state = replay(log(['e1e2', ALICE]), { rules });
    expect(state.result).toBe('1/2-1/2');
    expect(state.termination).toBe('insufficient-material');
    expect(state.rejected[0].reason).toBe(REJECTED.GAME_OVER);
  });

  it('finds threefold repetition', () => {
    const state = replay(
      log(
        ['g1f3', ALICE], ['g8f6', BOB], ['f3g1', ALICE], ['f6g8', BOB],
        ['g1f3', ALICE], ['g8f6', BOB], ['f3g1', ALICE], ['f6g8', BOB]
      ),
      { rules: duel }
    );
    expect(state.result).toBe('1/2-1/2');
    expect(state.termination).toBe('repetition');
  });

  it('rejects everything after the game is over, permanently', () => {
    const state = replay(
      log([EVENT_STRINGS.RESIGN, ALICE], ['e2e4', ALICE], [EVENT_STRINGS.RESIGN, BOB]),
      { rules: duel }
    );
    expect(state.result).toBe('0-1');
    expect(state.rejected).toHaveLength(2);
    expect(state.rejected.every((r) => r.reason === REJECTED.GAME_OVER)).toBe(true);
  });
});

describe('an unusable rule set', () => {
  it('rejects everything rather than throwing, when the start position is not one', () => {
    const state = replay(log(['e2e4', ALICE]), { rules: { ...duel, startFen: 'not a position' } });
    expect(state.rejected).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED.BAD_START_POSITION);
    expect(state.status).toBe('over');
  });

  it('rejects a position with no king, which nothing downstream could handle', () => {
    const state = replay(log(['e2e4', ALICE]), { rules: { ...duel, startFen: '8/8/8/8/8/8/8/8 w - - 0 1' } });
    expect(state.rejected[0].reason).toBe(REJECTED.BAD_START_POSITION);
  });
});

describe('the empty log', () => {
  it('is the starting position and nothing else', () => {
    const state = replay([], { rules: duel });
    expect(state.fen).toBe(START_FEN);
    expect(state.status).toBe('live');
    expect(state.result).toBeNull();
    expect(state.lastAccepted).toBeNull();
    expect(state.moveNumber).toBe(1);
  });
});

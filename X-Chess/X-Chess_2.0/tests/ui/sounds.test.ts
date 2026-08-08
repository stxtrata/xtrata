// Which sound, and how many.
//
// The rule this file exists to hold down is that ONE STATE CHANGE PLAYS AT MOST
// ONE SOUND. A poll can return three submissions at once and a single move can
// be a capture, a promotion and a checkmate together; played faithfully that is
// a pile-up that communicates less than silence would.
//
// The other rule is that opening a game is not news. A forty move game replayed
// on load is forty state changes, and a board that announced them would greet
// everybody who opens a finished game with forty seconds of noise.
//
// Everything here is pure. No browser, no audio, nothing that makes a sound.

import { describe, expect, it } from 'vitest';
import { replay } from '../../packages/replay/replay.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { EVENT_STRINGS } from '../../packages/replay/events.js';
import {
  SOUND_EVENTS,
  VOICES,
  involved,
  isCastle,
  mayMoveNow,
  soundFor,
  voiceLength
} from '../../packages/ui/sounds.js';
import type { ReplayState } from '../../packages/replay/replay.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CARL = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';

const RULES = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });

/** Replay a list of submissions, alternating senders unless told otherwise. */
function state(moves: string[], senders?: (string | null)[], rules = RULES): ReplayState {
  return replay(
    moves.map((mv, i) => ({
      mv,
      sender: senders ? senders[i] ?? null : i % 2 === 0 ? ALICE : BOB,
      seq: i,
      height: 100 + i
    })),
    { rules }
  );
}

/** The two states either side of one more submission. */
function step(
  moves: string[],
  senders?: (string | null)[],
  rules = RULES
): { before: ReplayState; after: ReplayState } {
  return {
    before: state(moves.slice(0, -1), senders?.slice(0, -1), rules),
    after: state(moves, senders, rules)
  };
}

describe('the library', () => {
  it('gives every sound a label, an explanation and at least one layer', () => {
    // A sound with no explanation is a beep somebody cannot decide about, and
    // the panel prints this text under every row.
    for (const name of SOUND_EVENTS) {
      const voice = VOICES[name];
      expect(voice.label, `${name} has no label`).toBeTruthy();
      expect(voice.say, `${name} has no explanation`).toBeTruthy();
      expect(voice.layers.length, `${name} is silent`).toBeGreaterThan(0);
    }
    expect(SOUND_EVENTS.length).toBeGreaterThan(8);
  });

  it('keeps every sound shorter than a second', () => {
    // A sound is punctuation, not an event. Anything longer overlaps the next
    // one on a board where two submissions can land in the same poll.
    for (const name of SOUND_EVENTS) {
      const length = voiceLength(VOICES[name]);
      expect(length, `${name} lasts ${length}s`).toBeGreaterThan(0);
      expect(length, `${name} lasts ${length}s`).toBeLessThan(1);
    }
  });

  it('keeps every layer inside the range Web Audio will accept', () => {
    // Both ramps used to build these are exponential, which rejects zero, and a
    // frequency outside human hearing is a node doing nothing but exist.
    for (const name of SOUND_EVENTS) {
      for (const layer of VOICES[name].layers) {
        expect(layer.from, `${name} has a layer at ${layer.from}Hz`).toBeGreaterThan(20);
        expect(layer.to).toBeGreaterThan(20);
        expect(layer.from).toBeLessThan(20_000);
        expect(layer.to).toBeLessThan(20_000);
        expect(layer.level).toBeGreaterThan(0);
        expect(layer.level).toBeLessThanOrEqual(1);
        expect(layer.attack).toBeGreaterThan(0);
        expect(layer.decay).toBeGreaterThan(0);
        expect(layer.delay).toBeGreaterThanOrEqual(0);
      }
      expect(VOICES[name].gain).toBeGreaterThan(0);
      expect(VOICES[name].gain).toBeLessThanOrEqual(1);
    }
  });

  it('makes the turn sound the loudest and the local ones the quietest', () => {
    // The one this module was asked for has to carry from another room. The
    // ones that report a finger rather than a chain must not.
    expect(VOICES['your-turn'].gain).toBeGreaterThan(VOICES.move.gain);
    expect(VOICES.select.gain).toBeLessThan(VOICES.move.gain);
    expect(VOICES.select.on, 'picking a piece up fires constantly').toBe(false);
    expect(VOICES['your-turn'].on).toBe(true);
  });
});

describe('choosing a sound', () => {
  it('says nothing at all for the first draw of a game', () => {
    // Opening a game is not news, however much of it there is. This is the
    // whole of the guard: a null `before` means a fresh derivation.
    const loaded = state(['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4']);
    expect(soundFor(null, loaded, ALICE)).toBeNull();
    expect(soundFor(null, loaded, BOB)).toBeNull();
  });

  it('tells the waiting player it is their turn', () => {
    // The headline. White has moved, the mover was not Bob, and Bob may now
    // move - so Bob, and only Bob, is told.
    const { before, after } = step(['e2e4']);
    expect(soundFor(before, after, BOB)).toBe('your-turn');
  });

  it('never announces your turn to the person who just moved', () => {
    const { before, after } = step(['e2e4']);
    expect(soundFor(before, after, ALICE)).toBe('move');
  });

  it('says nothing about a turn to somebody watching', () => {
    // A spectator is not waiting for anything. They still hear the move.
    const { before, after } = step(['e2e4']);
    expect(soundFor(before, after, CARL)).toBe('move');
    expect(soundFor(before, after, null)).toBe('move');
  });

  it('does not tell every passer-by it is their turn on an open board', () => {
    // On a game where both sides are `anyone` the referee says yes to
    // everybody, so without the involvement check every reader of an open game
    // would be pinged by every move in it.
    const open = normaliseRules({ ...DEFAULT_RULES });
    const { before, after } = step(['e2e4', 'e7e5'], [ALICE, BOB], open);
    expect(involved(after, CARL)).toBe(false);
    expect(mayMoveNow(after, CARL)).toBe(true);
    expect(soundFor(before, after, CARL)).toBe('move');
    // Somebody who has actually played in it IS involved, and is told.
    expect(involved(after, ALICE)).toBe(true);
    expect(soundFor(before, after, ALICE)).toBe('your-turn');
  });

  it('reports a capture rather than a plain move', () => {
    const { before, after } = step(['e2e4', 'd7d5', 'e4d5']);
    // Alice took a pawn. She hears the capture; Bob hears his turn.
    expect(soundFor(before, after, ALICE)).toBe('capture');
    expect(soundFor(before, after, BOB)).toBe('your-turn');
  });

  it('puts check above everything except the end of the game', () => {
    // Being in check is strictly more information than being told it is your
    // turn: only the side to move can be in check, so the check sound already
    // carries the turn AND says the thing that matters about the position.
    // A bishop check that is not mate, so the result does not outrank it.
    const { before, after } = step(['e2e4', 'd7d5', 'f1b5']);
    expect(after.inCheck).toBe(true);
    expect(after.status).toBe('live');
    expect(soundFor(before, after, BOB)).toBe('check');
    expect(soundFor(before, after, ALICE)).toBe('check');
  });

  it('reports a promotion above a capture and a check', () => {
    // The last move takes the knight on b8 AND makes a queen, so it is a
    // capture and a promotion at once. Exactly one sound comes out.
    const moves = ['a2a4', 'b7b5', 'a4b5', 'a7a6', 'b5a6', 'g8f6', 'a6a7', 'f6g8', 'a7b8q'];
    const { before, after } = step(moves);
    const last = after.accepted[after.accepted.length - 1];
    expect(last.kind === 'move' && last.promotion).toBeTruthy();
    expect(last.kind === 'move' && last.captured).toBeTruthy();
    expect(soundFor(before, after, ALICE)).toBe('promote');
  });

  it('knows castling from any other king move', () => {
    const { before, after } = step(['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'e1g1']);
    const last = after.accepted[after.accepted.length - 1];
    expect(isCastle(last)).toBe(true);
    expect(soundFor(before, after, ALICE)).toBe('castle');

    const plain = step(['e2e4', 'e7e5', 'e1e2']);
    const king = plain.after.accepted[plain.after.accepted.length - 1];
    expect(isCastle(king)).toBe(false);
    expect(soundFor(plain.before, plain.after, ALICE)).toBe('move');
  });

  it('plays one sound for a poll that brings back several submissions', () => {
    // The case that made the precedence necessary. Three moves land between two
    // reads; faithfully that is three sounds on top of each other.
    const before = state(['e2e4']);
    const after = state(['e2e4', 'd7d5', 'e4d5', 'd8d5']);
    const chosen = soundFor(before, after, ALICE);
    expect(chosen).toBe('your-turn');
    expect(typeof chosen).toBe('string');
  });

  it('still notices a capture buried in the middle of such a batch', () => {
    // The batch is classified whole, not just its last record: a capture in the
    // middle of three submissions still happened. Read through a spectator,
    // who has no turn for the capture to be outranked by.
    const before = state(['e2e4']);
    const after = state(['e2e4', 'd7d5', 'e4d5', 'g8f6']);
    expect(soundFor(before, after, CARL)).toBe('capture');
  });

  it('tells each player their own result', () => {
    // Fool's mate. One log, two opposite sounds, and neither is the other's.
    const { before, after } = step(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(after.status).toBe('over');
    expect(after.result).toBe('0-1');
    expect(soundFor(before, after, ALICE)).toBe('lose');
    expect(soundFor(before, after, BOB)).toBe('win');
  });

  it('gives a spectator the position, not a stake in it', () => {
    // Somebody watching neither won nor lost, and inventing a side for them
    // would be the board asserting something untrue. They hear the mate.
    const { before, after } = step(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(soundFor(before, after, CARL)).toBe('check');
  });

  it('announces a draw to both sides', () => {
    const moves = ['e2e4', 'e7e5', EVENT_STRINGS.DRAW_OFFER, EVENT_STRINGS.DRAW_ACCEPT];
    const { before, after } = step(moves, [ALICE, BOB, ALICE, BOB]);
    expect(after.result).toBe('1/2-1/2');
    expect(soundFor(before, after, ALICE)).toBe('draw');
    expect(soundFor(before, after, BOB)).toBe('draw');
  });

  it('announces a resignation as a result, not as a move', () => {
    const { before, after } = step(['e2e4', 'e7e5', EVENT_STRINGS.RESIGN], [ALICE, BOB, ALICE]);
    expect(soundFor(before, after, ALICE)).toBe('lose');
    expect(soundFor(before, after, BOB)).toBe('win');
  });

  it('only announces the end once, not on every poll afterwards', () => {
    const over = state(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    // The same finished game, read again. Nothing changed, so nothing is said.
    expect(soundFor(over, over, BOB)).toBeNull();
  });

  it('tells you when something of yours was skipped, and only you', () => {
    // Bob moving out of turn. It is stored, it was charged for, and it counts
    // for nothing - and nothing else on the page makes a noise about that.
    const before = state(['e2e4'], [ALICE]);
    const after = state(['e2e4', 'e7e5', 'd7d5'], [ALICE, BOB, BOB]);
    expect(after.rejected.length).toBe(1);
    expect(soundFor(before, after, BOB)).toBe('skipped');
    expect(soundFor(before, after, ALICE)).toBe('your-turn');
  });

  it('says nothing when a poll returns the same log', () => {
    const now = state(['e2e4', 'e7e5']);
    expect(soundFor(now, now, ALICE)).toBeNull();
    expect(soundFor(now, now, BOB)).toBeNull();
  });

  it('refuses to announce a log that got shorter', () => {
    // Several hosts serve this contract and failover is one way, so a shorter
    // answer is a host a block behind rather than a reorg. A sound fired on one
    // would be announcing a move that never un-happened.
    const long = state(['e2e4', 'e7e5', 'g1f3']);
    const short = state(['e2e4']);
    expect(soundFor(long, short, BOB)).toBeNull();
  });

  it('holds the whole precedence order at once', () => {
    // Read as a table: every sound this could be, and the one that wins.
    const cases: [string, ReplayState, ReplayState, string | null, string | null][] = [];
    const mate = step(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    cases.push(['checkmate', mate.before, mate.after, 'lose', 'win']);
    const chk = step(['e2e4', 'd7d5', 'f1b5']);
    cases.push(['check', chk.before, chk.after, 'check', 'check']);
    const cap = step(['e2e4', 'd7d5', 'e4d5']);
    cases.push(['capture', cap.before, cap.after, 'capture', 'your-turn']);
    const plain = step(['e2e4']);
    cases.push(['move', plain.before, plain.after, 'move', 'your-turn']);

    for (const [name, before, after, white, black] of cases) {
      expect(soundFor(before, after, ALICE), `${name}, for White`).toBe(white);
      expect(soundFor(before, after, BOB), `${name}, for Black`).toBe(black);
    }
  });
});

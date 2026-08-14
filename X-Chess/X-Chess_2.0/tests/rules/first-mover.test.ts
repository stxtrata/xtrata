// A seat claimed by playing it.
//
// `anyone` is anybody, every move, forever: two strangers can play alternate
// moves for the same colour and both are legitimate. `anyone-else` excludes the
// person NAMED on the other side, and when nobody is named there it collapses to
// `anyone` - so neither of them has ever locked a game to two people.
//
// `first-mover` does. The first principal to have a move accepted for a colour
// holds it for the rest of the game; until then the seat is open to anybody who
// does not already hold the other side, because a game where one person takes
// both seats is not a game.
//
// It is a NEW REPLAY PROTOCOL and not an edit to the old one, which is the part
// worth understanding: a board that has never heard of the keyword would read it
// as a principal nobody holds and skip every move. Under replay-v2 such a board
// says "unsupported protocol" and derives nothing instead, which is honest.

import { describe, expect, it } from 'vitest';
import {
  ANYONE,
  ANYONE_ELSE,
  DEFAULT_RULES,
  FIRST_MOVER,
  checkSender,
  describeRules,
  normaliseRules,
  readyToOpen
} from '../../packages/protocol/rules.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { recoverRules } from '../../packages/protocol/recover.js';
import { replay } from '../../packages/replay/replay.js';
import { REPLAY_PROTOCOL, REPLAY_PROTOCOL_V2 } from '../../packages/protocol/versions.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CAROL = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';

const OPEN_SEATS = normaliseRules({
  ...DEFAULT_RULES,
  white: FIRST_MOVER,
  black: FIRST_MOVER
});

/** Accepted moves, in the shape checkSender reads them. */
const played = (...moves: [string, 'white' | 'black'][]) =>
  moves.map(([sender, color]) => ({ sender, color }));

describe('a seat nobody holds yet', () => {
  it('lets anybody take it', () => {
    expect(checkSender(OPEN_SEATS, { sender: CAROL, turn: 'white', history: [] })).toBeNull();
  });

  it('holds it for whoever took it', () => {
    const after = played([ALICE, 'white']);
    expect(
      checkSender(OPEN_SEATS, { sender: ALICE, turn: 'white', history: after }),
      'the player who claimed white was refused their own seat'
    ).toBeNull();
    expect(
      checkSender(OPEN_SEATS, { sender: CAROL, turn: 'white', history: after }),
      'a stranger was allowed into a seat somebody already holds'
    ).toBe('wrong-player');
  });

  it('does not let one person take both sides', () => {
    // The whole reason the open seat is not simply `anyone`.
    const after = played([ALICE, 'white']);
    expect(checkSender(OPEN_SEATS, { sender: ALICE, turn: 'black', history: after })).toBe(
      'wrong-player'
    );
    expect(checkSender(OPEN_SEATS, { sender: BOB, turn: 'black', history: after })).toBeNull();
  });

  it('locks both sides once both have played', () => {
    const after = played([ALICE, 'white'], [BOB, 'black']);
    expect(checkSender(OPEN_SEATS, { sender: CAROL, turn: 'white', history: after })).toBe(
      'wrong-player'
    );
    expect(checkSender(OPEN_SEATS, { sender: CAROL, turn: 'black', history: after })).toBe(
      'wrong-player'
    );
    expect(checkSender(OPEN_SEATS, { sender: ALICE, turn: 'white', history: after })).toBeNull();
    expect(checkSender(OPEN_SEATS, { sender: BOB, turn: 'black', history: after })).toBeNull();
  });

  it('works on one side only, which is what an open challenge is', () => {
    // Named white, open black: a challenge anybody can accept, and the first
    // person who does owns the reply for the rest of the game.
    const challenge = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: FIRST_MOVER });
    expect(checkSender(challenge, { sender: BOB, turn: 'black', history: [] })).toBeNull();

    const taken = played([ALICE, 'white'], [BOB, 'black']);
    expect(checkSender(challenge, { sender: CAROL, turn: 'black', history: taken })).toBe(
      'wrong-player'
    );
    expect(checkSender(challenge, { sender: ALICE, turn: 'black', history: taken })).toBe(
      'wrong-player'
    );
  });

  it('keeps the named side out of the open one', () => {
    const challenge = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: FIRST_MOVER });
    expect(
      checkSender(challenge, { sender: ALICE, turn: 'black', history: [] }),
      'the named player claimed the open seat as well'
    ).toBe('wrong-player');
  });

  it('excludes a claimed seat from anyone-else, which used to see only names', () => {
    // `anyone-else` asked whether the other side was a NAMED principal. A
    // first-mover seat is not named and does become a specific person, so the
    // question had to change from "is it named" to "does anybody hold it".
    const mixed = normaliseRules({ ...DEFAULT_RULES, white: FIRST_MOVER, black: ANYONE_ELSE });
    const after = played([ALICE, 'white']);
    expect(checkSender(mixed, { sender: ALICE, turn: 'black', history: after })).toBe(
      'wrong-player'
    );
    expect(checkSender(mixed, { sender: BOB, turn: 'black', history: after })).toBeNull();
  });
});

describe('what a first-mover game commits to', () => {
  it('is replay-v2, whatever it was handed', () => {
    expect(OPEN_SEATS.replayProtocol).toBe(REPLAY_PROTOCOL_V2);
    const forced = normaliseRules({
      ...DEFAULT_RULES,
      white: FIRST_MOVER,
      replayProtocol: REPLAY_PROTOCOL
    });
    expect(forced.replayProtocol, 'a v1 game was allowed to use a v2 keyword').toBe(
      REPLAY_PROTOCOL_V2
    );
  });

  it('leaves every other game on v1, so no existing board loses anything', () => {
    expect(normaliseRules({ ...DEFAULT_RULES }).replayProtocol).toBe(REPLAY_PROTOCOL);
    expect(
      normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: ANYONE_ELSE }).replayProtocol
    ).toBe(REPLAY_PROTOCOL);
  });

  it('hashes differently from every rule set that is not it', () => {
    const open = normaliseRules({ ...DEFAULT_RULES });
    expect(rulesHash(OPEN_SEATS)).not.toBe(rulesHash(open));
  });

  it('is a rule set this board will open', () => {
    const check = readyToOpen(OPEN_SEATS);
    expect(check.problems, `refused: ${check.problems.map((p) => p.message).join('; ')}`).toEqual(
      []
    );
    expect(check.ready).toBe(true);
  });

  it('says what it means in words a player can read', () => {
    const text = describeRules(OPEN_SEATS);
    expect(text).toContain('whoever plays it first');
    const challenge = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: FIRST_MOVER });
    expect(describeRules(challenge)).toContain('whoever plays it first');
  });
});

describe('a board that does not implement it', () => {
  it('derives nothing rather than deriving it wrongly', () => {
    // The MECHANISM, which is what protects inscription 2988. It cannot be
    // tested by handing these rules a future version - normaliseRules derives
    // the protocol from the sides and would overwrite it, which is itself the
    // property that stops a v2 game ever claiming to be v1.
    //
    // So: a protocol this build does not implement, on rules that do not force
    // one. A board older than replay-v2 meets a v2 game exactly this way.
    const state = replay([{ mv: 'e2e4', sender: ALICE, seq: 0, height: 1 }], {
      rules: normaliseRules({ ...DEFAULT_RULES, replayProtocol: 'replay-v9-from-the-future' })
    });
    expect(state.fault).toBe('unsupported-protocol');
    expect(state.accepted, 'it derived a position under rules it cannot read').toEqual([]);
    expect(state.result).toBeNull();
  });

  it('commits first-mover games to a version an older board will refuse', () => {
    // The other half: the mechanism above only protects 2988 if these games
    // actually carry a version it does not know. This is that assertion, and it
    // is the one that would fail if somebody ever "simplified" the derivation.
    expect(OPEN_SEATS.replayProtocol).not.toBe(REPLAY_PROTOCOL);
  });

  it('still replays a v1 game exactly as before', () => {
    const state = replay(
      [{ mv: 'e2e4', sender: ALICE, seq: 0, height: 1 }],
      { rules: normaliseRules({ ...DEFAULT_RULES }) }
    );
    expect(state.fault).toBeNull();
    expect(state.accepted.length).toBe(1);
  });
});

describe('confirming one of these games from the chain', () => {
  it('recovers an open-seats game a stranger is looking at', () => {
    // Recovery has to offer the keyword as a side, or every game using it would
    // read as "rules unconfirmed" to everybody including its own players.
    const found = recoverRules({
      rulesHash: rulesHash(OPEN_SEATS),
      openedBy: CAROL,
      senders: [ALICE, BOB],
      ranked: false
    });
    expect(found.confirmed, 'a first-mover game cannot be confirmed by anybody').toBe(true);
    expect(found.rules.white).toBe(FIRST_MOVER);
    expect(found.rules.black).toBe(FIRST_MOVER);
  });

  it('recovers a named-versus-open challenge', () => {
    const challenge = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: FIRST_MOVER });
    const found = recoverRules({
      rulesHash: rulesHash(challenge),
      openedBy: ALICE,
      senders: [ALICE, BOB],
      ranked: false
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.black).toBe(FIRST_MOVER);
  });

  it('stays inside the candidate bound the search is capped at', () => {
    // The cap is CONSENSUS-VISIBLE: two boards disagreeing about how far the
    // search runs disagree about whether a game can be confirmed, and therefore
    // about whether it is rated. Adding a third keyword had to fit.
    const found = recoverRules({
      rulesHash: rulesHash(OPEN_SEATS),
      openedBy: CAROL,
      senders: [ALICE, BOB, ANYONE, 'SP000000000000000000002Q6VF78'],
      ranked: true
    });
    expect(found.tried, `the search ran ${found.tried} candidates`).toBeLessThanOrEqual(512);
  });
});

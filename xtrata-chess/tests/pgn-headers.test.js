// The PGN a game copies out as.
//
// A PGN leaves the page. It gets opened in a chess program, pasted into a
// message, kept in a file — somewhere with no rules panel to contradict it. So
// its headers have to say what the board said, and the board said White is
// jim.btc.
//
// They did not. Every game copied as White "anyone", Black "anyone", which was
// correct back when every game was the open board and became a plain falsehood
// the moment a game could name its sides.

import { describe, expect, it } from 'vitest';
import { ANYONE, ANYONE_ELSE, normaliseRules } from '../src/rules.js';
import { JIM } from '../src/known-games.js';

// The header logic, matching src/app.js _pgnPlayers.
function players(gameRules, name = () => null) {
  if (!gameRules) return { White: 'anyone', Black: 'anyone' };
  const rules = normaliseRules(gameRules);
  const named = (who, other) => {
    if (who === ANYONE) return 'anyone';
    if (who === ANYONE_ELSE) {
      const excluded = other === ANYONE || other === ANYONE_ELSE ? null : other;
      return excluded ? `anyone except ${name(excluded) || excluded}` : 'anyone';
    }
    return name(who) || who;
  };
  return { White: named(rules.white, rules.black), Black: named(rules.black, rules.white) };
}

const asName = (who) => (who === JIM ? 'jim.btc' : null);

describe('a game whose rules name a side', () => {
  it('says who, by name where there is one', () => {
    const tags = players({ white: JIM, black: ANYONE_ELSE }, asName);
    expect(tags.White).toBe('jim.btc');
    expect(tags.Black).toBe('anyone except jim.btc');
  });

  it('falls back to the address when no name is known', () => {
    const tags = players({ white: JIM, black: ANYONE_ELSE });
    expect(tags.White).toBe(JIM);
    expect(tags.Black).toBe(`anyone except ${JIM}`);
  });

  it('handles both sides named', () => {
    const other = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const tags = players({ white: JIM, black: other }, asName);
    expect(tags.White).toBe('jim.btc');
    expect(tags.Black).toBe(other);
  });
});

describe('a game with nobody named', () => {
  it('says anyone, which is true', () => {
    expect(players({ white: ANYONE, black: ANYONE })).toEqual({
      White: 'anyone',
      Black: 'anyone'
    });
  });

  // anyone-else with nobody on the other side excludes nobody.
  it('does not invent an exclusion', () => {
    const tags = players({ white: ANYONE, black: ANYONE_ELSE });
    expect(tags.Black).toBe('anyone');
  });
});

describe('a game this board is not refereeing', () => {
  // The important one. If the board could not reproduce the commitment it
  // enforced nothing, so the move list being copied is an unfiltered log, and
  // claiming a named player would misrepresent what produced it.
  it('says anyone, because that is what this board enforced', () => {
    expect(players(null)).toEqual({ White: 'anyone', Black: 'anyone' });
  });
});

describe('when the game started', () => {
  // Matching src/app.js _pgnWhen.
  const pgnWhen = (stamps) => {
    const first = stamps?.find?.((at) => Number.isFinite(at));
    if (!Number.isFinite(first)) {
      return { Date: '????.??.??', UTCDate: '????.??.??', UTCTime: '??:??:??' };
    }
    const when = new Date(first * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const date = `${when.getUTCFullYear()}.${pad(when.getUTCMonth() + 1)}.${pad(when.getUTCDate())}`;
    const time = `${pad(when.getUTCHours())}:${pad(when.getUTCMinutes())}:${pad(when.getUTCSeconds())}`;
    return { Date: date, UTCDate: date, UTCTime: time };
  };
  const pgnDate = (stamps) => pgnWhen(stamps).Date;

  // Computed rather than typed, because a hand-written epoch is a fixture that
  // can be wrong in the same direction as nothing else.
  const NOON_6_AUG = Date.UTC(2026, 7, 6, 9, 14, 0) / 1000;

  it('is the day the first move landed', () => {
    expect(pgnDate([NOON_6_AUG])).toBe('2026.08.06');
  });

  it('skips leading gaps rather than reporting nothing', () => {
    expect(pgnDate([null, null, NOON_6_AUG])).toBe('2026.08.06');
  });

  // UTC, not the reader's timezone: the same game copied in two places must
  // produce the same PGN.
  it('uses UTC, so the same game reads the same anywhere', () => {
    const lateUtc = Date.UTC(2026, 7, 6, 23, 30, 0) / 1000;
    expect(pgnDate([lateUtc])).toBe('2026.08.06');
  });

  // Unknown has to stay unknown. Falling back to today would date a game to
  // whenever somebody happened to copy it.
  it('stays unknown when no block time is known', () => {
    for (const stamps of [[], [null], null, undefined]) {
      expect(pgnWhen(stamps)).toEqual({
        Date: '????.??.??',
        UTCDate: '????.??.??',
        UTCTime: '??:??:??'
      });
    }
  });

  it('carries the time of day, to the second', () => {
    expect(pgnWhen([NOON_6_AUG]).UTCTime).toBe('09:14:00');
    expect(pgnWhen([Date.UTC(2026, 7, 6, 0, 0, 0) / 1000]).UTCTime).toBe('00:00:00');
    expect(pgnWhen([Date.UTC(2026, 7, 6, 23, 59, 59) / 1000]).UTCTime).toBe('23:59:59');
  });

  // The supplemental pair is what this actually is: a block timestamp has no
  // timezone of its own. A bare Time tag would claim a local clock nobody has.
  it('reports the UTC pair alongside the required Date', () => {
    const tags = pgnWhen([NOON_6_AUG]);
    expect(tags.UTCDate).toBe(tags.Date);
    expect(tags.UTCTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

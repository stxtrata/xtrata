// The tournament manifest.
//
// On chain, games 13 to 30 are eighteen unrelated games that happen to share
// six wallets — the protocol commits players and ranked status per game and
// nothing that groups them. A manifest is the identity: it is inscribed, so its
// inscription id IS the tournament id, and it says which games belong together
// and who played them.
//
// Nothing in it is trusted. It CLAIMS a pairing; the chain holds what each game
// actually committed to. These tests hold the line that a manifest which lies
// fails rather than being repeated.

import { describe, expect, it } from 'vitest';
import {
  TOURNAMENT_HEADER, addressOf, parseTournament, rounds, standings
} from '../../packages/protocol/tournament.js';

const good = {
  name: 'Exhibition One',
  format: 'double-round-robin',
  contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary',
  engine: 2991,
  entrants: [
    { name: 'Plumb', address: 'SP1T7TGSAFZA0JMYZP4C65QS1BYRQ03DS9E9YYHRX' },
    { name: 'Mason', address: 'SP1AZT4GMWSX8EHM321YVHD8QVRQ0MTCN0W2' },
    { name: 'Wager', address: 'SPD7PCGZJNMSV5VQA8E2BSEBR744N7ZXFYB91ZCN' }
  ],
  games: [
    { id: 25, white: 'Mason', black: 'Plumb', round: 5 },
    { id: 27, white: 'Wager', black: 'Plumb', round: 5 },
    { id: 30, white: 'Wager', black: 'Mason', round: 6 }
  ]
};
const manifest = (body: unknown = good): string =>
  `${TOURNAMENT_HEADER}\n${JSON.stringify(body, null, 2)}`;

describe('finding a tournament', () => {
  it('accepts a manifest with the header', () => {
    expect(parseTournament(manifest()).ok).toBe(true);
  });

  it('refuses anything else, so a chain sweep is a string compare', () => {
    expect(parseTournament(JSON.stringify(good)).ok, 'no header').toBe(false);
    expect(parseTournament('').ok).toBe(false);
    expect(parseTournament(null).ok).toBe(false);
  });

  it('says what is wrong rather than failing silently', () => {
    const broken = parseTournament(`${TOURNAMENT_HEADER}\n{ not json`);
    expect(broken.ok).toBe(false);
    expect(broken.problems[0].says).toContain('not readable JSON');
  });
});

describe('a manifest has to describe a tournament it contains', () => {
  it('refuses a game naming somebody who is not an entrant', () => {
    // Otherwise the board renders a blank cell and the reader has to work out
    // that the manifest, not the chain, is the thing that is wrong.
    const bad = { ...good, games: [{ id: 25, white: 'Mason', black: 'Ghost', round: 5 }] };
    const parsed = parseTournament(manifest(bad));
    expect(parsed.ok).toBe(false);
    expect(parsed.problems[0].says).toContain('not an entrant');
  });

  it('refuses the same game listed twice', () => {
    const bad = { ...good, games: [...good.games, good.games[0]] };
    expect(parseTournament(manifest(bad)).problems.some((p) => p.says.includes('twice'))).toBe(true);
  });

  it('refuses a player against themselves', () => {
    const bad = { ...good, games: [{ id: 25, white: 'Mason', black: 'Mason', round: 5 }] };
    expect(parseTournament(manifest(bad)).problems.some((p) => p.says.includes('both sides'))).toBe(true);
  });

  it('needs a field and some games', () => {
    expect(parseTournament(manifest({ ...good, entrants: [good.entrants[0]] })).ok).toBe(false);
    expect(parseTournament(manifest({ ...good, games: [] })).ok).toBe(false);
  });
});

describe('what the board draws from it', () => {
  const t = parseTournament(manifest()).tournament!;

  it('resolves a name to the wallet that signed', () => {
    // This is what the leaderboard cannot do today: seven games "fail
    // verification" because nothing on chain says which wallet is which player.
    expect(addressOf(t, 'Plumb')).toBe('SP1T7TGSAFZA0JMYZP4C65QS1BYRQ03DS9E9YYHRX');
    expect(addressOf(t, 'Nobody')).toBeNull();
  });

  it('scores standings from results anybody can derive', () => {
    const table = standings(t, new Map([
      [25, '1-0'],   // Mason beat Plumb
      [27, '0-1'],   // Plumb beat Wager
      [30, '0-1']    // Mason beat Wager
    ] as const));
    const by = Object.fromEntries(table.map((r) => [r.name, r]));
    expect(by.Mason.points).toBe(2);
    expect(by.Plumb.points).toBe(1);
    expect(by.Wager.points).toBe(0);
    expect(by.Wager.lost).toBe(2);
  });

  it('ignores a game with no result yet, rather than scoring it as a loss', () => {
    const table = standings(t, new Map([[25, '1-0']] as const));
    expect(table.find((r) => r.name === 'Wager')!.played).toBe(0);
  });

  it('orders the table totally, so two boards cannot disagree', () => {
    // Points, then wins, then name. Ties left to a sort would let two viewers
    // of the same tournament see different standings.
    const table = standings(t, new Map([[25, '1/2-1/2'], [27, '1/2-1/2']] as const));
    expect(table.map((r) => r.name)).toEqual(['Plumb', 'Mason', 'Wager']);
  });

  it('groups games into rounds in order', () => {
    const structure = rounds(t);
    expect(structure.map((r) => r.number)).toEqual([5, 6]);
    expect(structure[0].games.map((g) => g.id)).toEqual([25, 27]);
  });
});

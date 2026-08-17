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
  MAX_REVISIONS,
  TOURNAMENT_HEADER,
  addressOf,
  checkGames,
  honours,
  parseTournament,
  provenance,
  provenanceNote,
  resolveTournament,
  revisedInTime,
  rounds,
  standings,
  verifiedResults
} from '../../packages/protocol/tournament.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { COMPILED_ACCEPTED_BEFORE } from '../../packages/ui/app.js';

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

describe('revising a manifest before play starts', () => {
  // A tournament's field has to be fixed before results exist, or the organiser
  // drops the entrant who lost and publishes a manifest that never mentions
  // them. It also has to be correctable — a wrong address, a missing entrant —
  // right up until the first move.

  const CREATOR = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
  const OTHER = 'SPD7PCGZJNMSV5VQA8E2BSEBR744N7ZXFYB91ZCN';

  const chainOf = (
    texts: Record<number, unknown>,
    deps: Record<number, number[]> = {},
    creators: Record<number, string> = {}
  ) => ({
    async text(id: number) {
      const t = texts[id];
      return t === undefined ? null : typeof t === 'string' ? t : manifest(t);
    },
    async dependencies(id: number) { return deps[id] ?? []; },
    async creator(id: number) { return creators[id] ?? CREATOR; }
  });

  it('treats the root as the tournament id, however many revisions later', async () => {
    // Old links keep working. A tournament revised four times still has one id.
    const chain = chainOf({ 100: good, 101: good, 102: good }, { 102: [101], 101: [100] });
    const r = await resolveTournament(102, chain);
    expect(r.ok).toBe(true);
    expect(r.tournamentId).toBe(100);
    expect(r.lineage).toEqual([100, 101, 102]);
  });

  it('shows the revision you asked for, not the root', async () => {
    const revised = { ...good, name: 'Exhibition One (corrected)' };
    const chain = chainOf({ 100: good, 101: revised }, { 101: [100] });
    const r = await resolveTournament(101, chain);
    expect(r.tournament!.name).toBe('Exhibition One (corrected)');
    expect(r.tournamentId).toBe(100);
  });

  it('refuses a revision by somebody else, which is a fork', async () => {
    // Same creator is the whole of the ownership proof. Without it anyone could
    // inscribe a manifest claiming to supersede yours.
    const chain = chainOf({ 100: good, 101: good }, { 101: [100] }, { 100: CREATOR, 101: OTHER });
    const r = await resolveTournament(101, chain);
    expect(r.ok).toBe(false);
    expect(r.problems[0].says).toContain('fork, not a revision');
  });

  it('ignores a dependency that is not a manifest', async () => {
    // The engine declares a dependency too. An ancestor is an ancestor only if
    // it is itself a tournament.
    const chain = chainOf({ 100: good, 101: '// some inscribed javascript' }, { 100: [101] });
    const r = await resolveTournament(100, chain);
    expect(r.ok).toBe(true);
    expect(r.lineage).toEqual([100]);
  });

  it('stops rather than following a hostile chain forever', async () => {
    const texts: Record<number, unknown> = {};
    const deps: Record<number, number[]> = {};
    for (let n = 0; n <= MAX_REVISIONS + 5; n++) { texts[n] = good; if (n > 0) deps[n] = [n - 1]; }
    const r = await resolveTournament(MAX_REVISIONS + 5, chainOf(texts, deps));
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.says.includes('revisions deep'))).toBe(true);
  });

  it('says so when the manifest itself will not read', async () => {
    const r = await resolveTournament(100, chainOf({}));
    expect(r.ok).toBe(false);
    expect(r.problems[0].says).toContain('could not be read');
  });
});

describe('whether a revision was made in time', () => {
  it('is true only strictly before the first move', () => {
    expect(revisedInTime(100, 120)).toBe(true);
    expect(revisedInTime(120, 100)).toBe(false);
    // Same block is not clearly earlier, and the tie must not favour whoever
    // wrote the revision.
    expect(revisedInTime(100, 100)).toBe(false);
  });

  it('returns null for "not checked" rather than pretending', () => {
    // Inscription metadata carries no block height — creator, hash, mime, owner,
    // sealed, chunks, size, and nothing about when. The heights come from the
    // Stacks API, and a caller that cannot get them must not be told it is fine.
    expect(revisedInTime(null, 120)).toBeNull();
    expect(revisedInTime(100, null)).toBeNull();
  });
});

describe('which kind of manifest a reader is holding', () => {
  // TWO DIFFERENT OBJECTS WEARING ONE FORMAT. Inscribed before its games, a
  // manifest is a commitment — the organiser named the pairings and then had to
  // play them. Inscribed after, it is a claim about games that already exist,
  // and anybody can make it about any games, including games another manifest
  // also claims. Only one of those is binding, so a reader must be told which.

  it('calls it committed when the manifest came first', () => {
    expect(provenance(100, 200)).toBe('committed');
  });

  it('calls it compiled when the games came first', () => {
    expect(provenance(200, 100)).toBe('compiled');
  });

  it('gives the tie against the organiser', () => {
    // Same block is not demonstrably earlier, and "probably committed" is not
    // worth telling anybody.
    expect(provenance(150, 150)).toBe('compiled');
  });

  it('says not checked rather than fine when a height is missing', () => {
    expect(provenance(null, 200)).toBeNull();
    expect(provenance(100, null)).toBeNull();
    expect(provenanceNote(null)).toContain('not checked');
  });

  it('never asks the manifest about its own provenance', () => {
    // A `retrospective: true` field could lie; block ordering cannot. Asserted
    // by signature: the derivation takes two numbers and no document.
    expect(provenance.length).toBe(2);
  });

  it('says which it is in words, not a term of art', () => {
    expect(provenanceNote('committed')).toContain('before its first game');
    expect(provenanceNote('compiled')).toContain('already existed');
  });
});

describe('the compiled fallback has an end date', () => {
  const CUTOFF = 8_787_816;

  it('honours a committed manifest whenever it was made', () => {
    expect(honours('committed', CUTOFF + 50_000, CUTOFF).ok).toBe(true);
  });

  it('honours a compiled manifest for games that predate the rule', () => {
    // Games 13 to 30 were played before manifests existed and can only ever be
    // described afterwards. Refusing them would make eighteen real games
    // permanently unreadable.
    const verdict = honours('compiled', CUTOFF - 1, CUTOFF);
    expect(verdict.ok).toBe(true);
    expect(verdict.says).toContain('predate the manifest rule');
  });

  it('REFUSES a compiled manifest for games played after it', () => {
    // Otherwise an organiser skips the manifest, plays, and writes one
    // afterwards — the exact thing the rule exists to prevent. The end date is
    // what makes "it can never happen again" a property of the reader rather
    // than a promise about behaviour.
    const verdict = honours('compiled', CUTOFF, CUTOFF);
    expect(verdict.ok).toBe(false);
    expect(verdict.says).toContain('must be named by a manifest inscribed before play');
  });

  it('does not refuse when provenance could not be established', () => {
    // Unknown is not guilty. A reader that cannot reach the heights should say
    // so and carry on, not withhold a tournament on a failed lookup.
    expect(honours(null, null, CUTOFF).ok).toBe(true);
  });

  it('takes the cutoff from the caller, so it is one board’s policy', () => {
    // Writing it into the format would claim a consensus that does not exist.
    expect(honours('compiled', 500, 1_000).ok).toBe(true);
    expect(honours('compiled', 500, 100).ok).toBe(false);
  });

  it('is the number the board actually holds', () => {
    expect(COMPILED_ACCEPTED_BEFORE).toBe(CUTOFF);
  });
});

describe('checking a claimed pairing against the chain', () => {
  // THE POINT OF THE WHOLE FORMAT. A manifest asserts that game 25 was Mason
  // against Plumb. Saying so proves nothing — but the game's rules hash commits
  // white, black and ranked, so rebuilding those rules from the claimed
  // addresses either reproduces the commitment or does not.

  const WHITE = 'SP1AZT4GMWSX8EHM321YVHD8QVR7WFXK6TCN0W2A';
  const BLACK = 'SP1T7TGSAFZA0JMYZP4C65QS1BYRQ03DS9E9YYHRX';
  const manifest = {
    name: 'T', format: 'double-round-robin', contract: 'SP.x',
    entrants: [{ name: 'Mason', address: WHITE }, { name: 'Plumb', address: BLACK }],
    games: [{ id: 25, white: 'Mason', black: 'Plumb', round: 5 }]
  } as unknown as Parameters<typeof checkGames>[0];

  /** The hash game 25 would have committed to if the manifest is telling the truth. */
  const trueHash = (): string =>
    rulesHash(normaliseRules({ ...DEFAULT_RULES, white: WHITE, black: BLACK, ranked: true }));

  it('verifies a pairing the chain agrees with', () => {
    const checked = checkGames(manifest, new Map([[25, { rulesHash: trueHash(), result: '1-0' as const }]]));
    expect(checked[0].verdict).toBe('verified');
    expect(checked[0].says, 'a verified game has nothing to explain').toBe('');
  });

  it('refuses a pairing the chain does not agree with', () => {
    const checked = checkGames(manifest, new Map([[25, { rulesHash: 'de'.repeat(32), result: '1-0' as const }]]));
    expect(checked[0].verdict).toBe('unverified');
    expect(checked[0].says).toContain('not this pairing');
  });

  it('says so when a game committed to no rules at all', () => {
    const checked = checkGames(manifest, new Map([[25, { rulesHash: null, result: '1-0' as const }]]));
    expect(checked[0].verdict).toBe('unverified');
    expect(checked[0].says).toContain('nothing to check the claim against');
  });

  it('reports a game that is not on the contract as missing, not unverified', () => {
    // Different failures deserve different words: one is a manifest naming a
    // game that does not exist, the other is a game that exists and disagrees.
    const checked = checkGames(manifest, new Map());
    expect(checked[0].verdict).toBe('missing');
    expect(checked[0].result).toBeNull();
  });

  it('tolerates an 0x prefix and upper case on the committed hash', () => {
    const checked = checkGames(
      manifest,
      new Map([[25, { rulesHash: `0x${trueHash().toUpperCase()}`, result: null }]])
    );
    expect(checked[0].verdict).toBe('verified');
  });

  it('is keyed by game id and never by position', () => {
    // Three games open at once and whichever lands first takes the lower id, so
    // schedule order and id order are unrelated. Reading a pairing off a list
    // index once put games 13 and 15 the wrong way round.
    const two = {
      ...manifest,
      games: [
        { id: 25, white: 'Mason', black: 'Plumb', round: 5 },
        { id: 13, white: 'Plumb', black: 'Mason', round: 1 }
      ]
    } as typeof manifest;
    const facts = new Map([[25, { rulesHash: trueHash(), result: '1-0' as const }]]);
    const checked = checkGames(two, facts);
    expect(checked.find((g) => g.id === 25)?.verdict).toBe('verified');
    expect(checked.find((g) => g.id === 13)?.verdict, 'position 1 must not inherit game 25').toBe('missing');
  });
});

describe('only verified games score', () => {
  // A table built from unverified games repeats a claim as though it had been
  // checked, which is the exact failure the manifest exists to end. An
  // unverified game is still SHOWN; it is simply not counted.
  const rows = [
    { id: 1, round: 1, white: 'A', black: 'B', verdict: 'verified' as const, says: '', result: '1-0' as const },
    { id: 2, round: 1, white: 'A', black: 'B', verdict: 'unverified' as const, says: 'no', result: '0-1' as const },
    { id: 3, round: 2, white: 'A', black: 'B', verdict: 'missing' as const, says: 'gone', result: null }
  ];

  it('passes a verified result through', () => {
    expect(verifiedResults(rows).get(1)).toBe('1-0');
  });

  it('drops an unverified result even though it has one', () => {
    expect(verifiedResults(rows).has(2), 'an unverified result was counted').toBe(false);
  });

  it('drops a missing game', () => {
    expect(verifiedResults(rows).has(3)).toBe(false);
  });

  it('keeps a verified but unfinished game, as unfinished', () => {
    // Distinct from "not verified": the pairing checks out, the game is simply
    // still being played, and `standings` skips a null result on its own.
    const live = [{ ...rows[0], id: 9, result: null }];
    expect(verifiedResults(live).has(9)).toBe(true);
    expect(verifiedResults(live).get(9)).toBeNull();
  });
});

// Pairings, and the two properties they have to have.
//
// FAIR: deterministic from the admitted field, so an organiser who owns every
// wallet cannot also quietly choose who plays whom. An entrant who suspects a
// favourable draw can recompute the schedule and see.
//
// SAFE: no agent in two games of a round. That is nonces, not sportsmanship —
// one wallet signing two transactions at once collides with itself and one is
// dropped, which is how two of three funding transfers went missing earlier.

import { describe, expect, it } from 'vitest';
import { settleAll } from '../../harness/wizards/run-tournament.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertNoDoubleBooking,
  doubleRoundRobin,
  findByRulesHash,
  findExisting,
  historyFrom,
  planTournament,
  roundRobin,
  standingsFrom,
  swissRound,
  swissRounds
} from '../../harness/wizards/tournament.mjs';
import { WizardSafetyError } from '../../harness/wizards/wizards-core.mjs';

const SIX = ['gambit', 'ledger', 'mason', 'wager', 'plumb', 'oblique'];

const key = (p: { white: string; black: string }) => `${p.white}v${p.black}`;
const unordered = (p: { white: string; black: string }) => [p.white, p.black].sort().join('|');

describe('round robin', () => {
  it('plays every pair exactly once, in N-1 rounds', () => {
    const rounds = roundRobin(SIX);
    expect(rounds).toHaveLength(5);

    const met = rounds.flatMap((r) => r.pairings).map(unordered);
    expect(met, 'not 15 games').toHaveLength(15);
    expect(new Set(met).size, 'a pair met twice').toBe(15);
  });

  it('gives every round three games and nobody two', () => {
    // Six players is exactly three parallel games with nobody doubled up, which
    // is the whole reason the exhibition field is six.
    for (const round of roundRobin(SIX)) {
      expect(round.pairings, `round ${round.number}`).toHaveLength(3);
      expect(() => assertNoDoubleBooking(round)).not.toThrow();
    }
  });

  it('byes exactly one player a round when the field is odd', () => {
    const rounds = roundRobin(SIX.slice(0, 5));
    expect(rounds).toHaveLength(5);
    const byes = rounds.map((r) => r.bye);
    expect(byes.filter(Boolean), 'a round had no bye').toHaveLength(5);
    expect(new Set(byes).size, 'somebody was byed twice').toBe(5);
    for (const round of rounds) {
      expect(round.pairings).toHaveLength(2);
      expect(() => assertNoDoubleBooking(round)).not.toThrow();
    }
  });

  it('spreads the colours rather than seating everybody the same way', () => {
    const whites: Record<string, number> = {};
    for (const round of roundRobin(SIX)) {
      for (const p of round.pairings) whites[p.white] = (whites[p.white] ?? 0) + 1;
    }
    // Five games cannot split three and two fairly, so the honest bound is
    // "nobody plays every game with the same colour".
    for (const id of SIX) {
      expect(whites[id] ?? 0, `${id} never had white`).toBeGreaterThan(0);
      expect(whites[id] ?? 0, `${id} always had white`).toBeLessThan(5);
    }
  });

  it('is the same schedule on anybody’s machine', () => {
    // The fairness property. Nothing here draws a random number.
    const a = roundRobin(SIX).flatMap((r) => r.pairings).map(key);
    const b = roundRobin(SIX).flatMap((r) => r.pairings).map(key);
    expect(a).toEqual(b);
  });

  it('refuses a field of one', () => {
    expect(() => roundRobin(['gambit'])).toThrow(WizardSafetyError);
  });
});

describe('double round robin', () => {
  it('plays every pair twice, once with each colour', () => {
    const rounds = doubleRoundRobin(SIX);
    expect(rounds).toHaveLength(10);

    const all = rounds.flatMap((r) => r.pairings);
    expect(all).toHaveLength(30);
    expect(new Set(all.map(key)).size, 'a colour pairing repeated').toBe(30);

    // Colours come out exactly even, which is the reason to pay for it.
    const whites: Record<string, number> = {};
    for (const p of all) whites[p.white] = (whites[p.white] ?? 0) + 1;
    for (const id of SIX) expect(whites[id], `${id} colour imbalance`).toBe(5);
  });

  it('numbers its rounds after the first pass rather than repeating them', () => {
    expect(doubleRoundRobin(SIX).map((r) => r.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('swiss', () => {
  it('wants five rounds for sixteen, which is the point of using it', () => {
    expect(swissRounds(16)).toBe(4);
    expect(swissRounds(17)).toBe(5);
    expect(swissRounds(6)).toBe(3);
  });

  it('pairs the leaders together', () => {
    const round = swissRound({
      ids: SIX,
      scores: { gambit: 2, ledger: 2, mason: 1, wager: 1, plumb: 0, oblique: 0 },
      number: 2
    });
    expect(unordered(round.pairings[0])).toBe('gambit|ledger');
    expect(unordered(round.pairings[1])).toBe('mason|wager');
  });

  it('avoids a rematch when it can', () => {
    const round = swissRound({
      ids: SIX,
      scores: { gambit: 2, ledger: 2, mason: 2, wager: 1, plumb: 0, oblique: 0 },
      played: { gambit: ['ledger'], ledger: ['gambit'] },
      number: 2
    });
    expect(unordered(round.pairings[0]), 'it repeated a pairing it could have avoided').not.toBe(
      'gambit|ledger'
    );
  });

  it('takes a rematch rather than failing to pair', () => {
    // Everyone has played everyone. A rematch beats a round that cannot happen.
    const played = Object.fromEntries(SIX.map((id) => [id, SIX.filter((o) => o !== id)]));
    const round = swissRound({ ids: SIX, played, number: 6 });
    expect(round.pairings).toHaveLength(3);
    expect(() => assertNoDoubleBooking(round)).not.toThrow();
  });

  it('gives white to whoever has had less of it', () => {
    const round = swissRound({
      ids: ['gambit', 'ledger'],
      whites: { gambit: 3, ledger: 0 },
      number: 2
    });
    expect(round.pairings[0].white).toBe('ledger');
  });

  it('byes one player on an odd field and pairs the rest', () => {
    const round = swissRound({ ids: SIX.slice(0, 5), number: 1 });
    expect(round.bye).toBeTruthy();
    expect(round.pairings).toHaveLength(2);
    expect(() => assertNoDoubleBooking(round)).not.toThrow();
  });

  it('breaks ties on the field order, never on chance', () => {
    const once = swissRound({ ids: SIX, number: 1 });
    const twice = swissRound({ ids: SIX, number: 1 });
    expect(once.pairings.map(key)).toEqual(twice.pairings.map(key));
  });
});

describe('the nonce rule, asserted rather than assumed', () => {
  it('catches an agent in two games of one round', () => {
    expect(() =>
      assertNoDoubleBooking({
        number: 1,
        bye: null,
        pairings: [
          { white: 'gambit', black: 'ledger' },
          { white: 'mason', black: 'gambit' }
        ]
      })
    ).toThrow(/two games of round 1/);
  });

  it('catches an agent paired with itself', () => {
    expect(() =>
      assertNoDoubleBooking({ number: 1, bye: null, pairings: [{ white: 'a', black: 'a' }] })
    ).toThrow(/paired with itself/);
  });

  it('catches a bye who is also playing', () => {
    expect(() =>
      assertNoDoubleBooking({
        number: 1,
        bye: 'gambit',
        pairings: [{ white: 'gambit', black: 'ledger' }]
      })
    ).toThrow(/bye and a game/);
  });
});

describe('resuming from the chain rather than from memory', () => {
  const games = [
    { id: 12, white: 'SP_GAMBIT', black: 'SP_LEDGER' },
    { id: 13, white: 'SP_LEDGER', black: 'SP_GAMBIT' }
  ];

  it('finds the game a pairing already has', () => {
    expect(findExisting({ white: 'SP_GAMBIT', black: 'SP_LEDGER' }, games)?.id).toBe(12);
  });

  it('tells the two meetings of a double round robin apart by colour', () => {
    // Or a resumed double round robin would replay the second leg into the
    // first leg's game, and the record would say one game where two happened.
    expect(findExisting({ white: 'SP_LEDGER', black: 'SP_GAMBIT' }, games)?.id).toBe(13);
  });

  it('matches regardless of case, because principals arrive both ways', () => {
    expect(findExisting({ white: 'sp_gambit', black: 'sp_ledger' }, games)?.id).toBe(12);
  });

  it('says nothing rather than guessing when the pairing has not played', () => {
    expect(findExisting({ white: 'SP_MASON', black: 'SP_WAGER' }, games)).toBe(null);
  });
});

describe('standings', () => {
  const results = [
    { white: 'gambit', black: 'ledger', result: '1-0' },
    { white: 'mason', black: 'wager', result: '1/2-1/2' },
    { white: 'ledger', black: 'mason', result: '0-1' },
    { white: 'wager', black: 'gambit', result: '1/2-1/2' },
    { white: 'plumb', black: 'oblique', result: null } // still playing
  ];

  it('scores a win, a draw and a loss the way chess does', () => {
    const table = standingsFrom({ ids: SIX, results });
    const by = Object.fromEntries(table.map((r) => [r.id, r]));
    expect(by.gambit).toMatchObject({ played: 2, won: 1, drawn: 1, lost: 0, score: 1.5 });
    expect(by.mason).toMatchObject({ played: 2, won: 1, drawn: 1, lost: 0, score: 1.5 });
    expect(by.ledger).toMatchObject({ played: 2, won: 0, drawn: 0, lost: 2, score: 0 });
  });

  it('ignores a game that has not finished rather than counting it as a draw', () => {
    const by = Object.fromEntries(standingsFrom({ ids: SIX, results }).map((r) => [r.id, r]));
    expect(by.plumb.played, 'an unfinished game was scored').toBe(0);
  });

  it('puts the leaders first, and breaks a tie on wins', () => {
    const table = standingsFrom({
      ids: SIX,
      results: [
        { white: 'gambit', black: 'ledger', result: '1-0' },
        { white: 'mason', black: 'wager', result: '1/2-1/2' },
        { white: 'plumb', black: 'oblique', result: '1/2-1/2' },
        { white: 'wager', black: 'plumb', result: '1/2-1/2' },
        { white: 'oblique', black: 'mason', result: '1/2-1/2' }
      ]
    });
    expect(table[0].id, 'a win did not outrank two draws').toBe('gambit');
  });

  it('ignores a result naming somebody who is not in the field', () => {
    const table = standingsFrom({
      ids: ['gambit', 'ledger'],
      results: [{ white: 'gambit', black: 'stranger', result: '1-0' }]
    });
    expect(table.find((r) => r.id === 'gambit')?.played).toBe(0);
  });
});

describe('history, derived rather than remembered', () => {
  it('reads who met whom and who had white out of the results', () => {
    const { played, whites } = historyFrom([
      { white: 'gambit', black: 'ledger' },
      { white: 'gambit', black: 'mason' }
    ]) as { played: Record<string, string[]>; whites: Record<string, number> };
    expect(played.gambit).toEqual(['ledger', 'mason']);
    expect(played.ledger).toEqual(['gambit']);
    expect(whites.gambit).toBe(2);
    expect(whites.ledger).toBeUndefined();
  });
});

describe('what a tournament will cost before it starts', () => {
  it('prices the exhibition, with names dominating', () => {
    const plan = planTournament({ ids: SIX });
    expect(plan.plannedGames).toBe(15);
    expect(plan.plannedRounds).toBe(5);
    // 15 games x (0.01 open + 46 x 0.003) = 15 x 0.148
    expect(plan.chainUstx).toBe(2_220_000n);
    // 6 x (2 STX + two miner fees for preorder and register)
    expect(plan.namesUstx).toBe(12_036_000n);
    expect(plan.totalUstx).toBe(14_256_000n);
  });

  it('prices a run that buys no names, for playing before spending', () => {
    const plan = planTournament({ ids: SIX, buyNames: false });
    expect(plan.namesUstx).toBe(0n);
    expect(plan.totalUstx).toBe(2_220_000n);
  });

  it('prices a swiss without needing results that do not exist yet', () => {
    const plan = planTournament({ ids: Array.from({ length: 16 }, (_, i) => `e${i}`), format: 'swiss' });
    expect(plan.plannedRounds).toBe(4);
    expect(plan.plannedGames).toBe(32);
    expect(plan.rounds, 'swiss cannot schedule ahead').toHaveLength(0);
  });

  it('refuses to plan a schedule that double-books a wallet', () => {
    // planTournament asserts on every round it builds, so a format added later
    // cannot quietly reintroduce the nonce collision.
    expect(() => planTournament({ ids: ['a', 'a', 'b', 'c'] })).toThrow(WizardSafetyError);
  });
});

describe('finding the game a pairing already has', () => {
  // THE INCIDENT. The contract does not store who is playing — the players are
  // inside the hashed rules — so `readGames` cannot report white and black. The
  // runner fabricated them: it stamped the current pairing's addresses onto
  // EVERY game before searching, so every pairing matched the first row. Three
  // characters resumed into game 1, a stranger's game, and put twenty-eight
  // submissions into it. Replay rejected all of them, so the game was unharmed,
  // but they are on chain forever and they cost real fees.
  const chain = [
    { id: 1, rulesHash: 'aa'.repeat(32), nextSeq: 26 },
    { id: 11, rulesHash: 'bb'.repeat(32), nextSeq: 4 },
    { id: 12, rulesHash: 'cc'.repeat(32), nextSeq: 52 }
  ];

  it('matches on the rules hash, which is one value per pairing', () => {
    expect(findByRulesHash('bb'.repeat(32), chain)?.id).toBe(11);
    expect(findByRulesHash('cc'.repeat(32), chain)?.id).toBe(12);
  });

  it('finds nothing for a pairing that has not played', () => {
    // The case that must open a NEW game rather than adopt somebody else's.
    expect(findByRulesHash('dd'.repeat(32), chain)).toBe(null);
  });

  it('never returns the first game as a fallback', () => {
    // Exactly the failure. A lookup that cannot find its game must say so, not
    // hand back whatever was at the top of the list.
    for (const bogus of ['dd'.repeat(32), '', null, undefined, 'not-a-hash', '0x']) {
      expect(findByRulesHash(bogus as string, chain), `${String(bogus)} matched something`).toBe(
        null
      );
    }
  });

  it('tolerates the 0x prefix and case, since the chain and the codec differ', () => {
    expect(findByRulesHash('0x' + 'BB'.repeat(32), chain)?.id).toBe(11);
  });

  it('cannot be fooled by two pairings sharing a hash it was handed', () => {
    // A hash commits white, black AND ranked, so two different pairings cannot
    // produce one. If they ever could, this would be the test that noticed.
    const dupes = [
      { id: 5, rulesHash: 'ee'.repeat(32) },
      { id: 6, rulesHash: 'ee'.repeat(32) }
    ];
    // Deterministic: the first, never an arbitrary one.
    expect(findByRulesHash('ee'.repeat(32), dupes)?.id).toBe(5);
  });
});

describe('running the field on a different model', () => {
  // An entry names its model because that is the part of a player nobody can
  // inscribe — you can commit a prompt, not weights. So a run that quietly
  // substituted one would produce a result that does not match the entries it
  // claims to be between. The flag exists for tuning the exhibition, and the
  // rule is that it announces itself.
  const source = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('uses the entry’s own model when nothing is overridden', () => {
    expect(source).toMatch(/model: MODEL_OVERRIDE \?\? character\.model/);
  });

  it('says so in the header when a run overrides it', () => {
    // Silent substitution is the failure this guards against, not the
    // substitution itself.
    expect(source).toMatch(/OVERRIDDEN/);
    expect(source).toMatch(/entries name/);
  });
});

describe('the fee ladder replacing its own transaction', () => {
  // Round 3 ran 82 moves in game 19 and 47 in game 20, then died on
  // `dropped_replace_by_fee` — a status that means "a higher rung took this
  // transaction's place on the same nonce", which is the ladder working. The
  // move was very likely on chain under the replacement's txid.
  const runner = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('is not treated as a failed move', () => {
    expect(runner).toMatch(/status === 'dropped_replace_by_fee'/);
    // It must not reach the throw that ends the game.
    const at = runner.indexOf("status === 'dropped_replace_by_fee'");
    const thrown = runner.indexOf("if (status !== 'success')", at);
    const continued = runner.indexOf('continue;', at);
    expect(continued, 'it must continue before it can throw').toBeLessThan(thrown);
  });

  it('waits for the replacement to be indexed before re-reading', () => {
    // Reading immediately finds a log that has not grown yet and trips the
    // growth guard — a working ladder turned into a stopped tournament, which
    // is the same mistake one layer down.
    //
    // First written as a 45-second sleep, which was a guess about indexing lag
    // and a wrong one: see the polling test below. It waits for the log to
    // GROW now, which is the thing actually being waited on.
    const block = runner.slice(runner.indexOf("status === 'dropped_replace_by_fee'"));
    expect(block.slice(0, 1400)).toMatch(/setTimeout\(done, 15_000\)/);
  });

  it('still refuses to play the same move twice', () => {
    // The growth guard is what makes the re-read safe: if the replacement did
    // NOT land, the log has not grown and the run stops loudly rather than
    // paying for the same move again.
    expect(runner).toMatch(/the log did not grow after a submission/);
  });
});

describe('saying that a round is over', () => {
  const runner = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('prints every result when the round finishes', () => {
    // A finished round used to end on a blank line, which in a terminal looks
    // exactly like a round that has HUNG — and this harness has hung, at
    // length, printing nothing. Telling the two apart meant reading the
    // mempool, which is a lot to ask of somebody who only wants to know
    // whether to keep waiting.
    expect(runner).toMatch(/round \$\{round\.number\} complete/);
    expect(runner).toMatch(/game \$\{String\(game\.gameId\)/);
  });

  it('says a silent terminal is finished rather than stuck', () => {
    expect(runner).toMatch(/finished, not stuck/);
  });

  it('names an unfinished game as unfinished, not as a result', () => {
    // playGame returns null when it stops without a result. Printing that as a
    // blank, or as a win, would be the summary lying about the chain.
    expect(runner).toMatch(/unfinished — re-run this round, the log is the record/);
  });

  it('collects what playGame actually returned', () => {
    // The summary must read real results rather than restate the schedule.
    //
    // This used to assert `await Promise.all(` — the implementation rather than
    // the property — and in doing so it pinned a bug. Round 10 lost games 41
    // and 42, forty-nine and fifteen moves in and both entirely healthy,
    // because `Promise.all` rejects on the first failure and game 40 had a
    // problem they shared nothing with. The test would have failed the fix.
    //
    // What is worth pinning is that the summary reads returned values, and that
    // a game which stopped is NAMED rather than swallowed. The independence
    // itself is tested properly below, against the function.
    expect(runner).toMatch(/const played = await settleAll\(/);
    expect(runner).toMatch(/return \{ gameId, white, black, result \}/);
    expect(runner).toMatch(/STOPPED/);
  });

  it('does not report a round that stopped a game as a success', () => {
    // The mirror of the bug the fix was for. `Promise.all` rejecting was what
    // made the process exit 1; `settleAll` cannot reject, so without this a
    // round in which every game died exits 0 and tells a script it worked.
    expect(runner).toMatch(/process\.exitCode = 1/);
    expect(runner).toMatch(/stopped\.push\(round\.number\)/);
  });
});

describe('waiting for the log after a rung was superseded', () => {
  const runner = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('polls for the log to grow rather than sleeping a fixed guess', () => {
    // Round 8, game 35: slept 45s, looked once, read 94 where the guard wanted
    // 95, and stopped a game that was fine. The move HAD landed — the log reads
    // 95 now. A fixed delay is a guess about indexing lag; polling is an answer.
    const block = runner.slice(runner.indexOf("status === 'dropped_replace_by_fee'"));
    expect(block.slice(0, 1400)).toMatch(/while \(Date\.now\(\) < until\)/);
    expect(block.slice(0, 1400)).toMatch(/readEntries\(gameId\)\)\.length > wasAt/);
  });

  it('leaves the growth guard alone', () => {
    // Refusing to play the same move twice is the one thing that must never
    // soften. What was wrong was asking it before the answer could exist.
    expect(runner).toMatch(/the log did not grow after a submission/);
  });

  it('gives up eventually rather than waiting forever', () => {
    const block = runner.slice(runner.indexOf("status === 'dropped_replace_by_fee'"));
    expect(block.slice(0, 1400)).toMatch(/4 \* 60_000/);
  });
});

describe('an indexer that has not caught up is not a lost move', () => {
  const runner = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('re-reads before deciding the log did not grow', () => {
    // A short log from a lagging indexer is indistinguishable from a lost move
    // on ONE read. Game 35 stopped at 94 when the chain held 95; game 40 at 3
    // when it held 4. Both were fine and both were stopped.
    const guard = runner.slice(runner.indexOf('ASK AGAIN BEFORE CONCLUDING'));
    expect(guard.slice(0, 900)).toMatch(/while \(Date\.now\(\) < until && entries\.length <= lastLength\)/);
  });

  it('puts the waiting next to the question, so every route in is covered', () => {
    // The first attempt polled only after a superseded rung. Game 40 came
    // through the ordinary success path and never touched that branch.
    const guard = runner.indexOf('ASK AGAIN BEFORE CONCLUDING');
    const throwsAt = runner.indexOf('the log did not grow after a submission');
    expect(guard).toBeGreaterThan(-1);
    expect(guard, 'the wait must precede the throw').toBeLessThan(throwsAt);
  });

  it('still stops when the move really is not there', () => {
    // The guard is what stands between a confused runner and paying five times
    // for the same move, as game 12 did. Waiting must not become forgiving.
    expect(runner).toMatch(/the log did not grow after a submission/);
    const guard = runner.slice(runner.indexOf('ASK AGAIN BEFORE CONCLUDING'));
    expect(guard.slice(0, 900)).toMatch(/4 \* 60_000/);
  });
});

describe('one game stopping must not kill the other two', () => {
  const runner = readFileSync(
    resolve(fileURLToPath(new URL('../..', import.meta.url)), 'harness/wizards/run-tournament.mjs'),
    'utf8'
  );

  it('settles the round rather than racing it', () => {
    // Promise.all rejects the moment one game throws, and the others keep
    // playing into a process already exiting. Round 10: game 40 stopped on a
    // lagging indexer and took games 41 and 42 with it — forty-nine and fifteen
    // moves in, both healthy. Three games at once is the nonce rule, not a
    // transaction; they are independent and should fail independently.
    expect(runner).toMatch(/const played = await settleAll\(/);
    expect(runner).not.toMatch(/const played = await Promise\.all\(/);
  });

  it('names the game and the players that stopped', () => {
    // A bare rejection knows neither, and "something failed" is not something
    // anybody can act on — it does not say which game to re-run.
    expect(runner).toMatch(/return \{ gameId, white, black, failed:/);
    expect(runner).toMatch(/STOPPED —/);
  });

  it('still reports the round as complete with the failures in it', () => {
    const summary = runner.slice(runner.indexOf('round ${round.number} complete'));
    expect(summary.slice(0, 700)).toMatch(/game\.failed/);
  });
});

describe('one game failing does not take the others down', () => {
  // The property, tested rather than described. `settleAll` is exported for
  // exactly this: the regexes above can only say what the source looks like.

  it('keeps every fulfilled result when one rejects', async () => {
    const out = await settleAll([
      Promise.resolve({ gameId: 41, result: '1-0' }),
      Promise.reject(new Error('the log did not grow')),
      Promise.resolve({ gameId: 42, result: null })
    ]);
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ gameId: 41, result: '1-0' });
    expect(out[2]).toEqual({ gameId: 42, result: null });
  });

  it('turns a rejection into something the summary can print', async () => {
    // A bare rejection is an error with no game attached, and "something
    // failed" is not a thing anybody can act on.
    const [outcome] = await settleAll([Promise.reject(new Error('boom'))]);
    expect(outcome.failed).toContain('boom');
  });

  it('never rejects, whatever it is given', async () => {
    await expect(
      settleAll([Promise.reject(new Error('a')), Promise.reject(new Error('b'))])
    ).resolves.toHaveLength(2);
  });

  it('does not hide a rejection by returning nothing for it', async () => {
    // Dropping the failures would make a dead round look like a short one.
    const out = await settleAll([Promise.reject(new Error('x'))]);
    expect(out).toHaveLength(1);
    expect(out[0].failed).toBeTruthy();
  });
});

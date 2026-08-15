// Pairings, rounds, and standings — none of which touch the network.
//
// The runner's I/O is somewhere else on purpose. What lives here is the part
// that decides who plays whom, and that part has to be checkable by somebody
// who does not trust the person running the tournament.
//
// THE PAIRINGS ARE DETERMINISTIC, and that is a fairness property rather than a
// convenience. Nothing here draws a random number. Given the admitted field in
// the order the tournament record lists it, every round of every pairing falls
// out the same way on anybody's machine — so an organiser cannot quietly give a
// favoured entry an easy draw, and an entrant who suspects one can recompute the
// whole schedule and see. A tournament whose organiser both owns the wallets and
// chooses the pairings would be asking for a great deal of trust; this removes
// half of that ask for free.
//
// THE STANDINGS COME FROM THE CHAIN, never from this runner's memory. A runner
// that recorded its own results would be the only witness to them, and a crash
// halfway through would leave nobody able to say what had happened. Replay over
// the on-chain log is the authority, and `standingsFrom` takes results that came
// from there.
//
// One rule is asserted rather than assumed: NO AGENT PLAYS TWO GAMES AT ONCE.
// That is not sportsmanship, it is nonces. A wallet with two transactions in
// flight signs them both against the same nonce and one is dropped — which is
// how two of three funding transfers went missing earlier in this project.

import { WizardSafetyError } from './wizards-core.mjs';

/** A bye is a real thing in Swiss and has to have a name. */
export const BYE = null;

export const SCORE = Object.freeze({ win: 1, draw: 0.5, loss: 0 });

/**
 * Round robin by the circle method.
 *
 * One player is fixed and the rest rotate, which is the standard construction
 * and produces every pairing exactly once in N-1 rounds. An odd field gets a
 * bye, rotated so it lands on a different player each round.
 *
 * Colours alternate by round so nobody accumulates one side. With an odd number
 * of rounds it is still not perfectly even — five games cannot split three and
 * two fairly — which is the honest argument for a double round robin rather
 * than something to paper over.
 */
export function roundRobin(ids) {
  const players = [...ids];
  if (players.length < 2) {
    throw new WizardSafetyError('a tournament needs at least two entries.');
  }
  if (players.length % 2 === 1) players.push(BYE);

  const n = players.length;
  const rounds = [];

  for (let r = 0; r < n - 1; r++) {
    const pairings = [];
    let bye = null;
    for (let i = 0; i < n / 2; i++) {
      const a = players[i];
      const b = players[n - 1 - i];
      if (a === BYE) { bye = b; continue; }
      if (b === BYE) { bye = a; continue; }
      // Alternated so a player is not always on the same side of the circle.
      pairings.push(r % 2 === 0 ? { white: a, black: b } : { white: b, black: a });
    }
    rounds.push({ number: r + 1, pairings, bye });

    // Rotate everything except the first.
    players.splice(1, 0, players.pop());
  }
  return rounds;
}

/** Every pairing, both colours. Fair, and twice the games. */
export function doubleRoundRobin(ids) {
  const first = roundRobin(ids);
  const second = first.map((round) => ({
    number: round.number + first.length,
    bye: round.bye,
    pairings: round.pairings.map((p) => ({ white: p.black, black: p.white }))
  }));
  return [...first, ...second];
}

/** How many rounds a Swiss of this size wants. The usual ceiling of log2. */
export const swissRounds = (count) => Math.max(1, Math.ceil(Math.log2(Math.max(count, 2))));

/**
 * One Swiss round, paired from what has happened so far.
 *
 * Greedy within score groups: take the highest-scoring unpaired player, pair
 * them with the next highest they have not already played. Standard Monrad, and
 * deterministic because ties break on the field order rather than on chance.
 *
 * `played` is the set of opponents each id has already met, which is derived
 * from the chain rather than remembered — so a resumed tournament pairs the
 * same way a fresh one would.
 */
export function swissRound({ ids, scores = {}, played = {}, whites = {}, number = 1 }) {
  const order = [...ids].sort((a, b) => {
    const byScore = (scores[b] ?? 0) - (scores[a] ?? 0);
    // Field order breaks ties. Never a random number: see the header.
    return byScore !== 0 ? byScore : ids.indexOf(a) - ids.indexOf(b);
  });

  const waiting = [...order];
  const pairings = [];
  let bye = null;

  // An odd field byes the LOWEST scorer who has not had one, which is the
  // convention and also the least distorting.
  if (waiting.length % 2 === 1) bye = waiting.pop();

  while (waiting.length) {
    const a = waiting.shift();
    const met = played[a] ?? [];
    let at = waiting.findIndex((b) => !met.includes(b));
    // Everyone left has already played them. Take the nearest in score rather
    // than refusing to pair: a rematch beats a round that cannot happen.
    if (at === -1) at = 0;
    const b = waiting.splice(at, 1)[0];

    // Whoever has had fewer whites gets white. Ties go to the higher seed.
    const aWhites = whites[a] ?? 0;
    const bWhites = whites[b] ?? 0;
    const aFirst = aWhites < bWhites || (aWhites === bWhites && number % 2 === 1);
    pairings.push(aFirst ? { white: a, black: b } : { white: b, black: a });
  }

  return { number, pairings, bye };
}

/**
 * No agent may be in two games of the same round.
 *
 * Nonces, not sportsmanship. Two transactions signed by one wallet in the same
 * moment take the same nonce and one is dropped — silently, having been
 * accepted by the node. Asserted rather than trusted to the pairing code,
 * because the pairing code is exactly what would be changed by somebody adding
 * a format later.
 */
export function assertNoDoubleBooking(round) {
  const seen = new Set();
  for (const { white, black } of round.pairings) {
    // Checked BEFORE the double-booking scan, which would otherwise catch this
    // and report it as "in two games" - true, and no help at all to somebody
    // looking for the pairing bug that caused it.
    if (white === black) {
      throw new WizardSafetyError(`${white} is paired with itself in round ${round.number}.`);
    }
    for (const who of [white, black]) {
      if (seen.has(who)) {
        throw new WizardSafetyError(
          `${who} is in two games of round ${round.number}. One wallet cannot sign two ` +
            'transactions at once without colliding with its own nonce.'
        );
      }
      seen.add(who);
    }
  }
  if (round.bye && seen.has(round.bye)) {
    throw new WizardSafetyError(`${round.bye} has a bye and a game in round ${round.number}.`);
  }
  return round;
}

/**
 * Which pairings already have a game on chain.
 *
 * Resume, without a local record. A tournament that died in round 3 must not
 * replay rounds 1 and 2 — those games are on chain forever and playing them
 * again would cost the fees twice and put two games where the record says one.
 *
 * Matched on the rules, which name both sides: a game whose white and black are
 * this pairing's white and black IS this pairing. Colour is part of the match,
 * so a double round robin's two meetings do not collide.
 */
export function findExisting(pairing, games) {
  const same = (a, b) => String(a ?? '').toUpperCase() === String(b ?? '').toUpperCase();
  return (
    games.find(
      (game) => same(game.white, pairing.white) && same(game.black, pairing.black)
    ) ?? null
  );
}

/**
 * The game a pairing already has, found by its RULES HASH.
 *
 * THIS IS THE ONE THE RUNNER USES, and the reason is a live incident. The
 * contract does not store who is playing — the players are inside the hashed
 * rules — so `readGames` cannot report white and black, and the runner
 * fabricated them: it stamped the CURRENT pairing's addresses onto every game
 * in the list before searching. Every pairing then matched the first row.
 * Three characters resumed into game 1, a stranger's game, and put
 * twenty-eight submissions into it before anybody noticed. They were rejected
 * by replay and changed nothing, but they are on chain forever and they cost
 * real fees.
 *
 * A hash cannot do that. `rulesHash(white, black, ranked)` is one value per
 * pairing, it is on the game row, and comparing it needs no recovery, no
 * guessing, and no data the runner has to invent.
 */
export function findByRulesHash(hash, games) {
  const want = String(hash ?? '').toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(want)) return null;
  return (
    games.find(
      (game) => String(game.rulesHash ?? '').toLowerCase().replace(/^0x/, '') === want
    ) ?? null
  );
}

/**
 * Standings, from results that came off the chain.
 *
 * Takes results rather than fetching them, so the arithmetic is testable and so
 * the only thing that can put a result in here is something that read one.
 *
 * Sorted by score, then by wins, then by field order. Not by rating: the
 * contract's leaderboard has its own Elo and this is a tournament table, which
 * is a different question and should not quietly borrow the answer.
 */
export function standingsFrom({ ids, results }) {
  const row = new Map(
    ids.map((id) => [id, { id, played: 0, won: 0, drawn: 0, lost: 0, score: 0 }])
  );

  for (const result of results) {
    const white = row.get(result.white);
    const black = row.get(result.black);
    if (!white || !black) continue;
    if (result.result === null || result.result === undefined) continue;

    white.played++;
    black.played++;
    if (result.result === '1-0') {
      white.won++; white.score += SCORE.win;
      black.lost++;
    } else if (result.result === '0-1') {
      black.won++; black.score += SCORE.win;
      white.lost++;
    } else if (result.result === '1/2-1/2') {
      white.drawn++; white.score += SCORE.draw;
      black.drawn++; black.score += SCORE.draw;
    }
  }

  return [...row.values()].sort(
    (a, b) => b.score - a.score || b.won - a.won || ids.indexOf(a.id) - ids.indexOf(b.id)
  );
}

/** What each agent has already met, derived from results rather than remembered. */
export function historyFrom(results) {
  const played = {};
  const whites = {};
  for (const { white, black } of results) {
    (played[white] ??= []).push(black);
    (played[black] ??= []).push(white);
    whites[white] = (whites[white] ?? 0) + 1;
  }
  return { played, whites };
}

/**
 * The whole schedule, and what it will cost.
 *
 * Shaped like `planRun` for the same reason: a dry run prints this object and
 * the live run walks the same one, so what you read is what happens rather than
 * a description of it that can drift.
 */
export function planTournament({
  ids,
  format = 'round-robin',
  openFeeUstx = 10_000n,
  minerFeeUstx = 3_000n,
  movesPerGame = 45,
  namePriceUstx = 2_000_000n,
  buyNames = true
}) {
  const rounds =
    format === 'double-round-robin'
      ? doubleRoundRobin(ids)
      : format === 'swiss'
        ? [] // paired one at a time, from results that do not exist yet
        : roundRobin(ids);

  for (const round of rounds) assertNoDoubleBooking(round);

  const games = rounds.reduce((n, round) => n + round.pairings.length, 0);
  const plannedRounds = format === 'swiss' ? swissRounds(ids.length) : rounds.length;
  const plannedGames = format === 'swiss' ? plannedRounds * Math.floor(ids.length / 2) : games;

  const perGame = BigInt(openFeeUstx) + BigInt(minerFeeUstx) * BigInt(movesPerGame + 1);
  const chainUstx = perGame * BigInt(plannedGames);
  const namesUstx = buyNames
    ? (BigInt(namePriceUstx) + BigInt(minerFeeUstx) * 2n) * BigInt(ids.length)
    : 0n;

  return {
    format,
    rounds,
    plannedRounds,
    plannedGames,
    perGameUstx: perGame,
    chainUstx,
    namesUstx,
    totalUstx: chainUstx + namesUstx
  };
}

// What makes a set of games one tournament.
//
// THE PROTOCOL HAS NEVER HEARD OF TOURNAMENTS, and that is the problem this
// solves. A game's rules commit its players, its replay protocol and whether it
// is ranked; nothing commits that it belongs with any other game. So on chain,
// games 13 to 30 are eighteen unrelated games that happen to share six wallets.
// A stranger cannot tell they form a tournament, which is why the leaderboard
// reports games "failing verification" and why reading standings needed a
// hand-written map of which wallet was which character.
//
// A MANIFEST IS THE IDENTITY. It is inscribed, so its inscription id IS the
// tournament id — there is no registry to keep and nothing to allocate. It says
// what the tournament is, who is in it, and which games belong to it.
//
// WHY NOT PUT IT IN THE RULES HASH, which would be stronger. Because it would
// change the hash of every game, break replay of every game already played, and
// need a protocol version bump — to gain a property the manifest provides for
// the games that exist as well as the ones that do not yet.
//
// NOTHING HERE IS TRUSTED. The manifest CLAIMS a pairing for each game; the
// chain holds the rules hash that game actually committed to. `verifyEntrant`
// recomputes the hash from the claimed players and compares. A manifest that
// lies is a manifest that fails to verify, and the board shows it failing
// rather than repeating the claim.

import { rulesMatchCommitment } from './canonical.js';
import { DEFAULT_RULES, normaliseRules, type Rules } from './rules.js';

/** The first line of a valid manifest. Exact, so a chain sweep is a string compare. */
export const TOURNAMENT_HEADER = 'X-CHESS-TOURNAMENT/1';

export interface TournamentEntrant {
  /** Display name. Whatever the board calls this player. */
  name: string;
  /** The wallet that signs this player's moves. */
  address: string;
  /** Inscription id of the entry that defines the character, when there is one. */
  entry?: number;
  /**
   * Whether a person or a program is playing this seat.
   *
   * WORTH SAYING OUT LOUD because it changes what a reader should expect. An
   * all-AI tournament does not advance on its own: somebody has to be running
   * the engine, and when they stop, the games stop — for hours or for good. A
   * human opponent may simply be slow. Those look identical on a board that
   * only shows "still playing", and the second is a game and the first is a
   * queue.
   *
   * Optional, and absent means UNKNOWN rather than human. A board that guessed
   * would be labelling the first two exhibitions, which name no kinds at all,
   * as tournaments between people.
   */
  kind?: 'ai' | 'human';
  /**
   * How much deeper than the house engine this seat searches.
   *
   * AN OFFSET, NOT A DEPTH, and the difference is not cosmetic. The engine
   * already scales its own depth by how many pieces are left — 3 in a full
   * opening, 7 in a bare ending — because a fixed number is either unplayably
   * slow early or useless late. An absolute depth here would throw that curve
   * away. This rides it: `depthFor(fen) + depth`.
   *
   * THIS RETIRES A RULE THAT WAS TRUE UNTIL NOW. personalities.mjs opens by
   * saying a personality is a prompt and nothing else — "not a policy, not an
   * opening book, not a search depth" — because everyone getting the same
   * engine was what made the comparison fair. A declared ladder is a different
   * competition: a handicap event rather than a level one. Worth doing, worth
   * doing on purpose, and not worth discovering later from a field nobody
   * announced.
   *
   * AND IT IS THE ONE CLAIM HERE NOBODY CAN CHECK. Everything else a manifest
   * says can be recomputed from the chain: a pairing against the game's rules
   * hash, a result by replay. Depth leaves no trace in the log — characters
   * deviate from the engine by style, so you cannot infer it from the moves —
   * so it is a declaration on a document whose header says nothing here is
   * trusted. A board showing it must show it as DECLARED, never as verified.
   *
   * Absent means 0, which is every entrant of exhibitions one and two, so
   * those manifests keep parsing unchanged.
   */
  depth?: number;
}

/** The most a seat may be handed above the house engine. */
export const MAX_DEPTH_OFFSET = 2;

export interface TournamentGame {
  /** Game id on the contract. */
  id: number;
  /** Entrant names, which must appear in `entrants`. */
  white: string;
  black: string;
  /** 1-based. Rounds are a real structure here, not decoration. */
  round: number;
  /**
   * What this game is, when it is something: Final, Semi-final, and so on.
   *
   * SAID BY THE MANIFEST, because most formats do not have one. A round robin
   * has no final - every pair plays every pair, and the last round is simply the
   * last round. Calling a game there a final would invent a structure the format
   * does not have, and the two exhibitions on this contract are round robins.
   *
   * Free text rather than a fixed set, because tournaments have stages this
   * board should not be arbitrating: Round of 16, Plate Final, Repechage. The
   * board shows what it is told and does not decide what counts as a stage.
   */
  stage?: string;
}

/**
 * What to call this game, if anything.
 *
 * Two honest sources and no third. The manifest may say outright, which works
 * for any format including one run by hand. Failing that, a KNOCKOUT can be
 * derived, because there the structure really does mean it: the last round is
 * the final, the one before it the semi-finals, and so on.
 *
 * Nothing is derived for a round robin or a swiss. Those formats do not have a
 * final, and a board that labelled one would be making it up — which matters
 * more here than usual, because the label would then appear in a page title and
 * in a game view where it reads as a fact about the game rather than a guess.
 */
export function stageOf(tournament: Tournament, game: TournamentGame): string | null {
  const said = String(game.stage ?? '').trim();
  if (said) return said.slice(0, 24);

  if (!/knock|elimination|cup/i.test(tournament.format)) return null;
  const last = Math.max(...tournament.games.map((g) => g.round));
  if (!Number.isFinite(last)) return null;
  const away = last - game.round;
  if (away === 0) return 'Final';
  if (away === 1) return 'Semi-final';
  if (away === 2) return 'Quarter-final';
  return null;
}

export interface Tournament {
  name: string;
  format: string;
  contract: string;
  /**
   * The cooldown every game in this tournament committed to.
   *
   * WHY A TOURNAMENT NEEDS THIS AT ALL, and it is not about cooldowns. A game's
   * rules hash commits white, black, ranked and the protocol — and nothing that
   * says which tournament it is. So one pair, in one colour order, can have
   * exactly ONE ranked game with default rules, ever. Exhibitions one and two
   * together used all thirty available to their six players; there is no
   * thirty-first, and a third tournament among the same field cannot open a
   * single game.
   *
   * A cooldown of 1 changes the hash and so frees the pairing. In a two-player
   * game it can never reject anything — it is counted in MOVES, "wait for one
   * other to play", and the opponent always has — so it costs no gameplay. It
   * is a tournament discriminator wearing a rule's clothes, and saying that out
   * loud here is the price of using it.
   *
   * IT MUST BE DECLARED OR NOTHING VERIFIES. A verifier rebuilds the rules from
   * the pairing and compares to what the chain holds. Rebuilt with the wrong
   * cooldown, every game in the tournament reports "the rules this game
   * committed to are not this pairing" — a false accusation, on a board whose
   * purpose is to never repeat an unchecked claim. So it lives in the manifest,
   * where a reader finds it before checking anything.
   *
   * Absent means 0, which is exhibitions one and two.
   */
  cooldown?: number;
  /** Inscription id of the engine every player was handed. */
  engine?: number;
  entrants: TournamentEntrant[];
  games: TournamentGame[];
}

export interface ManifestProblem {
  where: string;
  says: string;
}

export interface ParsedTournament {
  ok: boolean;
  tournament: Tournament | null;
  problems: ManifestProblem[];
}

/**
 * Read a manifest.
 *
 * JSON, unlike the entry format, and the reason is who writes each. An entry is
 * typed by a person into a wallet, so it is `field: value` lines that cannot
 * really be got wrong. A manifest is emitted by the harness that ran the
 * tournament and read by a board, so it is machine-to-machine and JSON costs
 * nothing to parse correctly.
 */
export function parseTournament(text: unknown): ParsedTournament {
  const problems: ManifestProblem[] = [];
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');

  if (lines[0]?.trim() !== TOURNAMENT_HEADER) {
    return {
      ok: false,
      tournament: null,
      problems: [{ where: 'header', says: `the first line must be exactly "${TOURNAMENT_HEADER}"` }]
    };
  }

  let body: unknown;
  try {
    body = JSON.parse(lines.slice(1).join('\n'));
  } catch (error) {
    return {
      ok: false,
      tournament: null,
      problems: [{ where: 'body', says: `is not readable JSON: ${(error as Error).message}` }]
    };
  }

  const t = body as Partial<Tournament>;
  for (const field of ['name', 'format', 'contract'] as const) {
    if (typeof t[field] !== 'string' || !t[field]) {
      problems.push({ where: field, says: 'is required' });
    }
  }
  // Same reasoning as depth: a cooldown the verifier dropped would turn every
  // game in the tournament unverified, and the manifest is permanent.
  if (t.cooldown !== undefined) {
    const bad = typeof t.cooldown !== 'number' || !Number.isInteger(t.cooldown) || t.cooldown < 0;
    if (bad) {
      problems.push({
        where: 'cooldown',
        says: `must be a whole number of moves, and is ${JSON.stringify(t.cooldown)}`
      });
    }
  }
  if (!Array.isArray(t.entrants) || t.entrants.length < 2) {
    problems.push({ where: 'entrants', says: 'needs at least two' });
  }
  if (!Array.isArray(t.games) || t.games.length === 0) {
    problems.push({ where: 'games', says: 'needs at least one' });
  }

  const named = new Set((t.entrants ?? []).map((e) => e?.name));
  for (const entrant of t.entrants ?? []) {
    if (!entrant?.name || !entrant?.address) {
      problems.push({ where: 'entrants', says: 'every entrant needs a name and an address' });
      break;
    }
    // CHECKED, BECAUSE AN IGNORED HANDICAP IS THE WORST OF BOTH. A manifest is
    // permanent; a depth the runner silently dropped would sit in the record
    // claiming a competition that was never run. Same reasoning as the entry
    // format refusing an unknown field rather than skipping it.
    if (entrant.depth !== undefined) {
      const bad =
        typeof entrant.depth !== 'number' ||
        !Number.isInteger(entrant.depth) ||
        entrant.depth < 0 ||
        entrant.depth > MAX_DEPTH_OFFSET;
      if (bad) {
        problems.push({
          where: `entrant ${entrant.name}`,
          says: `depth must be a whole number from 0 to ${MAX_DEPTH_OFFSET}, and is ${JSON.stringify(entrant.depth)}`
        });
      }
    }
  }

  // A game naming somebody who is not in the field is the manifest describing a
  // tournament it does not itself contain. Caught here rather than left for the
  // board to render as a blank cell.
  const seen = new Set<number>();
  for (const game of t.games ?? []) {
    if (typeof game?.id !== 'number') {
      problems.push({ where: 'games', says: 'every game needs a numeric id' });
      continue;
    }
    if (seen.has(game.id)) problems.push({ where: `game ${game.id}`, says: 'is listed twice' });
    seen.add(game.id);
    for (const side of ['white', 'black'] as const) {
      if (!named.has(game[side])) {
        problems.push({ where: `game ${game.id}`, says: `${side} "${game[side]}" is not an entrant` });
      }
    }
    if (game.white === game.black) {
      problems.push({ where: `game ${game.id}`, says: 'has the same player on both sides' });
    }
  }

  const ok = problems.length === 0;
  return { ok, problems, tournament: ok ? (t as Tournament) : null };
}

/**
 * The rules a game in this tournament commits to.
 *
 * THE ONLY PLACE THIS IS BUILT. It was assembled inline in three places — the
 * verifier, the replay that derives results, and the board's rule recovery —
 * each spreading DEFAULT_RULES and each therefore assuming a cooldown of zero.
 * Three copies of an assumption is three places to forget a tournament that
 * does not share it, and the failure is silent: replay still works, so results
 * appear, and only the verdict quietly turns to unverified.
 */
export function rulesFor(
  tournament: Pick<Tournament, 'cooldown'>,
  white: string | null,
  black: string | null
): Rules {
  return normaliseRules({
    ...DEFAULT_RULES,
    white,
    black,
    ranked: true,
    cooldown: tournament.cooldown ?? 0
  });
}

/**
 * Whether one manifest can be a revision of another at all.
 *
 * A REVISION CORRECTS A TOURNAMENT, so it has to be about that tournament.
 * Sharing no games with the thing it declares is not a correction, it is a
 * different document pointing at the wrong parent, and believing the edge
 * anyway lets it inherit an identity that was never its own.
 *
 * That is not hypothetical. Inscription 3015 is Exhibition Three's manifest
 * with a dependency on Exhibition Two, added in the belief that the link meant
 * "follows". It shares none of Exhibition Two's nine games and describes
 * ninety of its own, and a chooser that trusted the edge showed it in
 * Exhibition Two's place, as the newer and therefore better manifest.
 *
 * One shared game is enough. A revision may add, drop or repair games, so
 * demanding an exact match would refuse the corrections this is for.
 */
export function revisesSameTournament(child: Tournament, parent: Tournament): boolean {
  const theirs = new Set(parent.games.map((game) => game.id));
  return child.games.some((game) => theirs.has(game.id));
}

/** The address a manifest claims played a colour, or null. */
export function addressOf(tournament: Tournament, name: string): string | null {
  return tournament.entrants.find((e) => e.name === name)?.address ?? null;
}

/**
 * The standings, from results anybody can derive.
 *
 * Takes results rather than fetching them, so this is pure and testable and the
 * caller decides what a result is — the board replays the log, the harness has
 * one in hand already. A game with no result yet simply does not score.
 */
export function standings(
  tournament: Tournament,
  results: ReadonlyMap<number, '1-0' | '0-1' | '1/2-1/2' | null>
): Array<{ name: string; points: number; played: number; won: number; drawn: number; lost: number }> {
  const table = new Map(
    tournament.entrants.map((e) => [
      e.name,
      { name: e.name, points: 0, played: 0, won: 0, drawn: 0, lost: 0 }
    ])
  );

  for (const game of tournament.games) {
    const result = results.get(game.id);
    if (!result) continue;
    const white = table.get(game.white);
    const black = table.get(game.black);
    if (!white || !black) continue;

    white.played++;
    black.played++;
    if (result === '1-0') {
      white.points += 1; white.won++; black.lost++;
    } else if (result === '0-1') {
      black.points += 1; black.won++; white.lost++;
    } else {
      white.points += 0.5; black.points += 0.5; white.drawn++; black.drawn++;
    }
  }

  // Points, then wins, then name — so the order is total and two boards showing
  // the same tournament cannot disagree about it.
  return [...table.values()].sort(
    (a, b) => b.points - a.points || b.won - a.won || a.name.localeCompare(b.name)
  );
}

/** Rounds in order, each with its games, for drawing the structure. */
export function rounds(tournament: Tournament): Array<{ number: number; games: TournamentGame[] }> {
  const byRound = new Map<number, TournamentGame[]>();
  for (const game of tournament.games) {
    const at = byRound.get(game.round) ?? [];
    at.push(game);
    byRound.set(game.round, at);
  }
  return [...byRound.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([number, games]) => ({ number, games: games.slice().sort((a, b) => a.id - b.id) }));
}


// ---------------------------------------------------------------------------
// Revisions
// ---------------------------------------------------------------------------

/**
 * A manifest that supersedes an earlier one.
 *
 * THE PROBLEM IS REWRITING HISTORY. A tournament's field and pairings have to be
 * fixed before results exist, or the organiser can drop the entrant who lost and
 * publish a manifest that never mentions them. But a manifest also has to be
 * correctable — a wrong address, a missing entrant — right up until play starts.
 *
 * So a revision is an inscription that declares the one it replaces as a
 * DEPENDENCY. Xtrata already carries dependencies and already uses them, so this
 * invents nothing: `get-dependencies` gives the link and `get-inscription-creator`
 * gives who made it. Same creator plus a dependency edge is what makes a revision
 * a revision rather than somebody else's fork.
 *
 * THE TOURNAMENT ID IS THE ROOT, never the newest. Walk the chain back and the
 * inscription with no tournament ancestor is the identity, so a tournament that
 * has been revised four times still has one id and old links keep working.
 *
 * RESOLVED FORWARD, NOT BACKWARD, and this is where the design differs from the
 * obvious one. There is no reverse index — nothing answers "what declares me as a
 * dependency" without scanning every inscription ever made. So the id you hand
 * out is the current one, and it names its own ancestry. A board given the root
 * shows the original; given a revision, it shows the revision and reports the
 * root as the tournament id.
 *
 * WHAT CANNOT BE CHECKED FROM THE CONTRACT. Inscription metadata carries creator,
 * hash, mime type, owner, sealed, chunks and size — and no block height. So
 * "inscribed before the first move" needs the height of the transaction that
 * sealed it, which is public chain data but comes from the Stacks API rather than
 * from Xtrata. `resolveTournament` reports what it verified and what it could
 * not, rather than implying it checked something it did not.
 */
export interface Inscribed {
  /** The manifest text at an inscription id. */
  text(id: number): Promise<string | null>;
  /** Inscription ids this one declares as dependencies. */
  dependencies(id: number): Promise<number[]>;
  /** Who created it. Same creator is what makes a revision legitimate. */
  creator(id: number): Promise<string | null>;
}

export interface ResolvedTournament {
  ok: boolean;
  /** The root inscription — the tournament's identity, whatever the revision. */
  tournamentId: number | null;
  /** The manifest that applies. */
  tournament: Tournament | null;
  /** Root first, newest last. */
  lineage: number[];
  problems: ManifestProblem[];
}

/** How far back a revision chain is followed before it is treated as hostile. */
export const MAX_REVISIONS = 20;

export async function resolveTournament(id: number, chain: Inscribed): Promise<ResolvedTournament> {
  const problems: ManifestProblem[] = [];
  const lineage: number[] = [];

  const text = await chain.text(id);
  if (text === null) {
    return { ok: false, tournamentId: null, tournament: null, lineage: [], problems: [{ where: `inscription ${id}`, says: 'could not be read' }] };
  }
  const parsed = parseTournament(text);
  if (!parsed.ok) {
    return { ok: false, tournamentId: null, tournament: null, lineage: [], problems: parsed.problems };
  }

  const creator = await chain.creator(id);
  lineage.unshift(id);

  // Walk back to the root. Only a dependency that is itself a manifest counts —
  // the engine declares a dependency too, and that is not an ancestor.
  let at = id;
  for (let step = 0; step < MAX_REVISIONS; step++) {
    const deps = await chain.dependencies(at);
    let ancestor: number | null = null;
    for (const dep of deps) {
      const depText = await chain.text(dep);
      if (depText !== null && parseTournament(depText).ok) { ancestor = dep; break; }
    }
    if (ancestor === null) break;

    // A revision by somebody else is a fork, not a correction. Same creator is
    // the whole of the ownership proof, and it has to hold at every link.
    const ancestorCreator = await chain.creator(ancestor);
    if (creator && ancestorCreator && creator !== ancestorCreator) {
      problems.push({
        where: `inscription ${at}`,
        says: `claims inscription ${ancestor} but was made by a different creator — this is a fork, not a revision`
      });
      break;
    }

    lineage.unshift(ancestor);
    at = ancestor;
    if (lineage.length > MAX_REVISIONS) {
      problems.push({ where: 'lineage', says: `more than ${MAX_REVISIONS} revisions deep` });
      break;
    }
  }

  return {
    ok: problems.length === 0,
    tournamentId: lineage[0] ?? id,
    tournament: parsed.tournament,
    lineage,
    problems
  };
}

/**
 * Whether a revision was made in time, given heights the caller looked up.
 *
 * Kept separate and given its numbers rather than fetching them, because the
 * heights come from the Stacks API rather than from Xtrata — see above. A caller
 * that cannot get them passes null and gets `null` back, which means "not
 * checked" and never "fine".
 */
export function revisedInTime(
  revisionHeight: number | null,
  firstMoveHeight: number | null
): boolean | null {
  if (revisionHeight === null || firstMoveHeight === null) return null;
  // Strictly before: a revision landing in the same block as the first move is
  // not clearly earlier, and the tie should not favour the organiser.
  return revisionHeight < firstMoveHeight;
}

/**
 * Whether a manifest committed to its games or described them afterwards.
 *
 * TWO DIFFERENT OBJECTS WEARING ONE FORMAT. A manifest inscribed before any of
 * its games were opened is a commitment: the organiser named the pairings and
 * then had to play them. One inscribed afterwards is a claim about games that
 * already exist, and anybody can make it about any games — including games
 * somebody else's manifest also claims.
 *
 * Both are useful and only one is binding, so a reader has to be told which it
 * is holding rather than left to work it out.
 *
 * DERIVED, NEVER DECLARED. A `"retrospective": true` field could lie; block
 * ordering cannot. The manifest is not consulted about its own provenance.
 *
 * ANCHORED ON THE FIRST MOVE, NOT THE FIRST GAME OPENED, and getting that
 * wrong would mislabel every prospective tournament there will ever be. A
 * manifest names its games by id, and ids do not exist until games are opened —
 * so a genuinely committed tournament MUST open its games, then inscribe, then
 * play. Measured against "first game opened" that reads `compiled`, which is
 * exactly backwards. Opening a game commits a rules hash and settles no result;
 * the first move is when the outcome starts being determined, and it is the
 * anchor `revisedInTime` directly below already uses.
 *
 * Heights come from the caller because they come from the Stacks API rather
 * than from Xtrata, the same arrangement `revisedInTime` uses. Null in, null
 * out, and null means "not checked" — never "fine".
 */
export type Provenance = 'committed' | 'compiled';

export function provenance(
  manifestHeight: number | null,
  firstMoveHeight: number | null,
  /**
   * True only when every game was READ and every one of them was empty.
   *
   * NOT the same as `firstMoveHeight === null`, and the difference is the whole
   * reason this argument exists. A null height means "no move height was
   * found", which covers both a tournament nobody has started and a run of
   * failed reads — and those must not produce the same answer, because one of
   * them is provable and the other is ignorance.
   */
  noMovesYet = false
): Provenance | null {
  if (manifestHeight === null) return null;

  // A TOURNAMENT NOBODY HAS STARTED IS COMMITTED, and this is the strongest
  // form of it rather than a missing answer.
  //
  // The manifest is confirmed at a height that has already passed. No move
  // exists anywhere in it. So every move that will ever be played must land in
  // a later block than the manifest - not probably, necessarily. Reporting
  // "provenance not checked" for that case understated the one situation the
  // whole mechanism is designed to produce, and read as though something had
  // gone wrong at the very moment everything had gone right.
  if (noMovesYet) return 'committed';

  if (firstMoveHeight === null) return null;
  // Strictly before, and the tie goes against the organiser: a manifest landing
  // in the same block as the first move did not demonstrably precede it, and
  // "probably committed" is not a thing worth telling a reader.
  return manifestHeight < firstMoveHeight ? 'committed' : 'compiled';
}

/** What to show a reader, in words rather than a term of art. */
export function provenanceNote(kind: Provenance | null, noMovesYet = false): string {
  if (kind === 'committed') {
    // Two different situations, and the second is worth its own sentence: a
    // reader looking at a tournament that has not started wants to know that
    // nothing is missing, rather than wondering where the games went.
    return noMovesYet
      ? 'Committed before play: this manifest was inscribed and no move has been played in any of its games yet.'
      : 'Committed before play: this manifest was inscribed before the first move was played.';
  }
  if (kind === 'compiled') {
    return 'Compiled after play: this manifest describes games that already existed when it was written.';
  }
  return 'Provenance not checked: the block heights needed to tell were not available.';
}

/**
 * Whether a reader should honour this manifest at all.
 *
 * A COMPILED MANIFEST IS A FALLBACK WITH AN END DATE. Tournaments played before
 * the rule existed have no prospective manifest and never can, so they need one
 * written afterwards or they are unreadable forever. Accepting that indefinitely
 * would be worse: it would let a future organiser skip the manifest entirely and
 * write one later, which is the exact thing the rule exists to prevent.
 *
 * So a compiled manifest is honoured only for games opened before a cutoff. That
 * makes "it can never happen again" a property of the reader rather than a
 * promise about anybody's behaviour.
 *
 * The cutoff is the CALLER'S, passed in rather than defined here: it is one
 * board's policy about what it will render, and another reader is entitled to
 * choose differently. Writing it into the format would claim a consensus that
 * does not exist.
 */
export function honours(
  kind: Provenance | null,
  firstMoveHeight: number | null,
  compiledAcceptedBefore: number,
  noMovesYet = false
): { ok: boolean; says: string } {
  if (kind === 'committed') return { ok: true, says: provenanceNote(kind, noMovesYet) };
  if (kind === null) return { ok: true, says: provenanceNote(kind) };
  if (firstMoveHeight !== null && firstMoveHeight < compiledAcceptedBefore) {
    return { ok: true, says: `${provenanceNote(kind)} Accepted because its games predate the manifest rule.` };
  }
  return {
    ok: false,
    says:
      `${provenanceNote(kind)} Refused: games opened at or after block ` +
      `${compiledAcceptedBefore.toLocaleString()} must be named by a manifest inscribed before play.`
  };
}

/**
 * What the chain says about one game the manifest names.
 *
 * Deliberately not a `GameRow`: this layer stays free of the chain client, so
 * the check is a pure function of two documents and can be tested without a
 * network or a mock. The caller fetches; this decides.
 */
export interface GameFacts {
  /** The hash the game committed to, or null for a game that committed to none. */
  rulesHash: string | null;
  /** Replayed, or null for a game that has not finished. */
  result: '1-0' | '0-1' | '1/2-1/2' | null;
  /**
   * Moves replay ACCEPTED, which is not the number of submissions.
   *
   * A game may be submitted to by anybody, and the contract stores whatever it
   * is sent — game 12 has five copies of `e2e4`, each charged and each skipped
   * by replay as landing on an empty square. So "how far along is this" has two
   * answers and only one of them is the game.
   */
  moves?: number;
  /**
   * The address whose move it is, or null when nothing is waiting on one.
   *
   * Derived rather than read: the caller has already replayed the game against
   * the pairing the manifest claims, so it holds both the side to move and the
   * address on that side. Carrying it costs nothing, and it is the difference
   * between a tab that lists games and one that says which of them is yours.
   */
  toMove?: string | null;
  /**
   * Which side is to move, for a reader who is not either player.
   *
   * `toMove` answers "is this mine"; this answers "what is happening", which is
   * what almost every visitor is asking. Both come from the same replay.
   */
  turn?: 'white' | 'black' | null;
}

/**
 * `missing` is a fact about the chain; the manifest naming a non-entrant is a
 * fact about the manifest, and `parseTournament` has already refused that — so
 * a Tournament reaching this point is internally consistent and the only
 * question left is whether the chain agrees with it.
 */
export type Verdict = 'verified' | 'unverified' | 'missing';

export interface CheckedGame {
  id: number;
  round: number;
  /** Entrant names, as the manifest claims them. */
  white: string;
  black: string;
  verdict: Verdict;
  /** Why, in words. Empty when verified — there is nothing to explain. */
  says: string;
  result: '1-0' | '0-1' | '1/2-1/2' | null;
  /** Moves replay accepted, when the caller counted them. */
  moves?: number;
  /**
   * The address whose move it is, or null when the game is not waiting on one.
   *
   * Derived rather than read: the caller has already replayed the game against
   * the pairing the manifest claims, so it holds both the side to move and the
   * address on that side. Carrying it costs nothing and is the difference
   * between a tab that lists games and one that tells you which is yours.
   */
  toMove?: string | null;
  /** Which side is to move, for a reader who is neither player. */
  turn?: 'white' | 'black' | null;
  /** Final, Semi-final and so on, when this game is one. See `stageOf`. */
  stage?: string | null;
}

/**
 * Check every claimed pairing against what its game actually committed to.
 *
 * THIS IS THE POINT OF THE WHOLE FORMAT. A manifest asserts that game 25 was
 * Mason against Plumb. It cannot prove that by saying it — but the game's rules
 * hash commits white, black and ranked, so rebuilding those rules from the
 * claimed addresses and hashing them either reproduces the commitment or does
 * not. Nothing else in a manifest is load-bearing.
 *
 * It is also what turns the Leaderboard's "7 candidates failing verification"
 * into verifiable games: recovery could not guess which wallet was which player,
 * and now it does not have to guess, it has a candidate to test.
 *
 * KEYED BY GAME ID, NEVER BY POSITION. Three games open concurrently and
 * whichever transaction lands first takes the lower id, so schedule order and id
 * order are unrelated. Reading a pairing off a list index once put games 13 and
 * 15 the wrong way round and silently dropped two results from a table that
 * looked complete.
 */
export function checkGames(
  tournament: Tournament,
  facts: ReadonlyMap<number, GameFacts>
): CheckedGame[] {
  return tournament.games.map((game) => {
    const seen = facts.get(game.id);
    const base = {
      id: game.id,
      round: game.round,
      white: game.white,
      black: game.black,
      moves: seen?.moves,
      toMove: seen?.toMove ?? null,
      turn: seen?.turn ?? null,
      stage: stageOf(tournament, game)
    };

    if (!seen) {
      return { ...base, verdict: 'missing' as const, says: 'no such game on this contract', result: null };
    }

    const white = addressOf(tournament, game.white);
    const black = addressOf(tournament, game.black);
    if (!white || !black) {
      // Unreachable through parseTournament, which refuses a non-entrant. Kept
      // because this function is exported and a caller may build a Tournament
      // by hand, and "silently scored as verified" is the wrong way to fail.
      return { ...base, verdict: 'unverified' as const, says: 'the manifest has no address for one side', result: null };
    }

    if (!seen.rulesHash) {
      return {
        ...base,
        verdict: 'unverified' as const,
        says: 'this game committed to no rules, so there is nothing to check the claim against',
        result: seen.result
      };
    }

    const rules = rulesFor(tournament, white, black);
    if (!rulesMatchCommitment(rules, seen.rulesHash)) {
      return {
        ...base,
        verdict: 'unverified' as const,
        says: 'the rules this game committed to are not this pairing',
        result: seen.result
      };
    }

    return { ...base, verdict: 'verified' as const, says: '', result: seen.result };
  });
}

/**
 * Results from checked games, for `standings`.
 *
 * ONLY VERIFIED GAMES SCORE, and that is the whole reason this exists rather
 * than the caller passing results straight through. A table built from
 * unverified games would be repeating a claim as though it had been checked,
 * which is exactly the failure the manifest was introduced to end. An
 * unverified game is still shown — it is simply not counted.
 */
export function verifiedResults(
  checked: readonly CheckedGame[]
): Map<number, '1-0' | '0-1' | '1/2-1/2' | null> {
  const out = new Map<number, '1-0' | '0-1' | '1/2-1/2' | null>();
  for (const game of checked) {
    if (game.verdict === 'verified') out.set(game.id, game.result);
  }
  return out;
}

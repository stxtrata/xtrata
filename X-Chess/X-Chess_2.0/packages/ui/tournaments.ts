// The Tournaments tab: what a manifest claims, and whether the chain agrees.
//
// A tournament has no on-chain identity. Nothing in `Rules` groups games, so
// games 13 to 33 are, to a stranger, eighteen unrelated games that happen to
// share six wallets. A manifest supplies the grouping — and supplies it as a
// CLAIM, which is the only honest way to describe a document anybody can write.
//
// So this view has one job beyond drawing a table: never repeat a claim as
// though it were checked. Every pairing is tested against the rules hash its
// game actually committed to, only verified games score, and a manifest written
// after its games is labelled as such rather than presented as a commitment.
//
// Loading is TWO PASSES ON PURPOSE. Verification is one game row each and costs
// almost nothing; results need every entry replayed, and one game in this
// tournament holds 340 of them. Rendering the cheap pass first means a reader
// sees the structure and the verdicts immediately, and the table fills in
// behind it, rather than staring at nothing while 1,700 entries are paged.

import { replay } from '../replay/replay.js';
import { rememberedGame, rememberGame, rulesKeyOf } from '../chain/game-facts.js';
import {
  checkGames, honours, provenance, provenanceNote, resolveTournament, revisedInTime, rounds, rulesFor,
  standings, verifiedResults
} from '../protocol/tournament.js';
import type { CheckedGame, GameFacts, Provenance, Tournament } from '../protocol/tournament.js';
import type { ChainReader } from '../chain/client.js';
import type { XtrataReader } from '../chain/xtrata.js';

export interface TournamentDeps {
  chain: ChainReader;
  reader: XtrataReader;
  /** The board's policy on manifests written after their games. */
  compiledAcceptedBefore: number;
  /** Names already resolved. Display only — the address is always the truth. */
  bnsFor?: (address: string) => string | null | undefined;
  /** Paced so a cold load does not spend the whole rate-limit budget at once. */
  pace?: () => Promise<void>;
  /**
   * The manifest, the moment it parses and before a single game is read.
   *
   * WHAT A READER CAN HAVE IMMEDIATELY. Everything a manifest declares — who is
   * in it, how many rounds, which engine, what the format is — is in one
   * document and costs one read. Everything else is twenty row reads and then a
   * replay of every game, which for ninety games is minutes.
   *
   * Holding the first back until the second finished meant a reader clicked a
   * tournament and got an empty tab, with nothing to say whether it was
   * working, slow, or broken. This exists so the tab can be full of true things
   * while the expensive part runs.
   */
  onManifest?: (tournament: Tournament, rootId: number, lineage: number[]) => void;
  /**
   * A real partial view, at each round boundary.
   *
   * NOT A SPINNER. Everything scored so far is already in hand — the games are
   * read in manifest order and a manifest is grouped by round, so at a round
   * boundary there is a complete, honest answer about every game before it.
   * Scoring that answer is arithmetic on data already fetched, so emitting it
   * costs nothing and turns minutes of a still page into rounds appearing.
   *
   * `scored` is FALSE on every one of these. The view is true about the games
   * it contains and silent about the rest, and a reader must be able to tell
   * that apart from a finished tournament — the standings in it are real and
   * they are not final.
   */
  onProgress?: (view: TournamentView, done: number, total: number) => void;
  /**
   * A game row read, during the first pass.
   *
   * Separate from `onProgress` because this pass has no results to show — it is
   * checking that the chain agrees about who played whom, one row at a time.
   * There is nothing to render, and that is exactly why it needs to be counted:
   * for a ninety-game tournament it is ninety reads before the part that has
   * something to say even begins.
   */
  onRead?: (done: number, total: number) => void;
}

export interface TournamentRow extends CheckedGame {
  /** BNS name, else the manifest's name, else the short address. */
  whoWhite: string;
  whoBlack: string;
}

export interface TournamentView {
  ok: boolean;
  problems: string[];
  tournamentId: number | null;
  lineage: number[];
  tournament: Tournament | null;
  provenance: Provenance | null;
  says: string;
  /** False when this board declines to render it. See `honours`. */
  honoured: boolean;
  table: Array<{ name: string; points: number; played: number; won: number; drawn: number; lost: number }>;
  rounds: Array<{ number: number; games: TournamentRow[] }>;
  /** True once results have been replayed. Until then the table is empty. */
  scored: boolean;
  /**
   * Set only when a revision is being viewed rather than a root.
   *
   * `inTime` is the revision rule's verdict: true is a correction, false is a
   * manifest that arrived after play began and does NOT supersede, and null
   * means the heights were not readable, which is "not checked" and never
   * "fine".
   */
  revision: {
    id: number;
    root: number;
    inTime: boolean | null;
    says: string;
  } | null;
}

const short = (address: string): string =>
  address.length > 12 ? `${address.slice(0, 4)}…${address.slice(-6)}` : address;

/**
 * The first pass: who played whom, and does the chain agree.
 *
 * One game row each and no replay, so this is about twenty reads for a
 * tournament of this size and can be shown straight away.
 */
export async function loadTournament(id: number, deps: TournamentDeps): Promise<TournamentView> {
  const empty: TournamentView = {
    ok: false, problems: [], tournamentId: null, lineage: [], tournament: null,
    provenance: null, says: '', honoured: true, table: [], rounds: [], scored: false,
    revision: null
  };

  const resolved = await resolveTournament(id, deps.reader);
  if (!resolved.ok || !resolved.tournament) {
    return { ...empty, problems: resolved.problems.map((p) => `${p.where}: ${p.says}`) };
  }
  const tournament = resolved.tournament;
  // Before the row reads below, which is the whole point of the callback.
  deps.onManifest?.(tournament, resolved.tournamentId ?? id, resolved.lineage);

  const facts = new Map<number, GameFacts>();
  let read = 0;
  for (const game of tournament.games) {
    // ALREADY READ ONCE, AND IT CANNOT HAVE CHANGED.
    //
    // This pass exists to check the chain agrees about who played whom, which
    // it does by comparing the manifest's pairing to the game's RULES HASH. A
    // rules hash is fixed when the game is opened and there is no operation
    // that alters it, so a hash this browser read from the chain before is the
    // same hash it would read again.
    //
    // Which makes this the half of a return visit that was pure waste: ninety
    // reads to learn ninety things that were already known and could not have
    // moved. The other half — has anybody played since — is asked in the
    // scoring pass, where the answer actually changes.
    const known = rememberedGame(game.id);
    if (known?.facts.rulesHash) {
      facts.set(game.id, { rulesHash: known.facts.rulesHash, result: null });
      deps.onRead?.(++read, tournament.games.length);
      continue;
    }

    await deps.pace?.();
    const row = await deps.chain.getGame(game.id).catch(() => null);
    // Counted whatever came back. A read that failed still took the time, and a
    // count that skipped it would stall for no visible reason.
    deps.onRead?.(++read, tournament.games.length);
    // A row that cannot be read is left OUT rather than recorded as null, so it
    // reports as `missing` — "we could not check this" and never "this is fine".
    if (row) facts.set(game.id, { rulesHash: row.rulesHash, result: null });
  }

  const checked = checkGames(tournament, facts);
  return {
    ...empty,
    ok: true,
    tournamentId: resolved.tournamentId,
    lineage: resolved.lineage,
    tournament,
    rounds: group(checked, tournament, deps),
    // Provenance needs the first MOVE, which the second pass finds. Until then
    // it is genuinely unknown, and unknown is what it says.
    says: provenanceNote(null)
  };
}

/**
 * The second pass: replay every game, then score and date the tournament.
 *
 * Expensive, and separated for that reason. It also produces the one number
 * `provenance` needs — the height of the earliest move anybody played — which
 * cannot be had more cheaply, since a game row records when a game was OPENED
 * and opening settles nothing.
 */
export async function scoreTournament(
  view: TournamentView,
  deps: TournamentDeps
): Promise<TournamentView> {
  if (!view.ok || !view.tournament) return view;
  const tournament = view.tournament;

  const facts = new Map<number, GameFacts>();
  let firstMove: number | null = null;

  // EARNED, NOT ASSUMED. "No move has been played" is only sayable if every
  // game was actually read and every one of them was empty. A failed read looks
  // identical to an empty game from here, and letting the two collapse would
  // turn "the endpoint was rate limiting us" into "this tournament is provably
  // committed" - which is the exact shape of mistake this project has made
  // before, reading a 429 on a balance as a balance of zero.
  let readEverything = true;
  let entriesSeen = 0;

  let done = 0;
  const total = tournament.games.length;
  /**
   * Everything known so far, scored honestly and marked unfinished.
   *
   * The games are read in manifest order and a manifest is grouped by round, so
   * at a boundary this is a complete answer about every game before it and
   * silent about the rest. `scored: false` is what keeps the two apart.
   */
  const soFar = (): TournamentView => {
    const partial = checkGames(tournament, facts);
    return {
      ...view,
      table: standings(tournament, verifiedResults(partial)),
      rounds: group(partial, tournament, deps),
      scored: false
    };
  };

  for (const game of tournament.games) {
    await deps.pace?.();
    const row = await deps.chain.getGame(game.id).catch(() => null);
    done++;
    if (!row) {
      readEverything = false;
      continue;
    }

    // Replayed against the pairing the MANIFEST claims. If that claim is wrong
    // the rules hash will not match and checkGames refuses it anyway, so a
    // result derived here can never be counted for an unverified game.
    const white = tournament.entrants.find((e) => e.name === game.white)?.address ?? null;
    const black = tournament.entrants.find((e) => e.name === game.black)?.address ?? null;
    const key = rulesKeyOf(white, black, tournament.cooldown ?? 0);

    // ALREADY WORKED OUT, and checked against the row just read rather than
    // taken on trust. Entries are append-only and indexed by sequence, so the
    // same game at the same nextSeq is the same log and replays to the same
    // answer. The row read still happens on every visit; what a hit skips is the
    // paging and the replay, which is all of the cost and none of the check.
    const seen = rememberedGame(game.id);
    if (seen && seen.nextSeq === row.nextSeq && seen.rulesKey === key && seen.facts.rulesHash === row.rulesHash) {
      entriesSeen += seen.entries;
      if (seen.firstHeight !== null && (firstMove === null || seen.firstHeight < firstMove)) {
        firstMove = seen.firstHeight;
      }
      facts.set(game.id, seen.facts);
      continue;
    }

    const entries = await deps.chain
      .getAllEntries(game.id, row.nextSeq)
      .catch(() => {
        readEverything = false;
        return [];
      });
    entriesSeen += entries.length;
    // A short log is a failed read too. `getAllEntries` pages, and a page that
    // does not arrive returns what it has - so a game reporting forty entries
    // and handing back four has not been read, however quietly.
    const whole = entries.length >= row.nextSeq;
    if (!whole) readEverything = false;
    let firstHere: number | null = null;
    for (const entry of entries) {
      if (typeof entry.height === 'number' && (firstHere === null || entry.height < firstHere)) {
        firstHere = entry.height;
      }
    }
    if (firstHere !== null && (firstMove === null || firstHere < firstMove)) firstMove = firstHere;
    // Built from what the MANIFEST declares, not from the defaults. A
    // tournament that had to vary its rules to open its games at all — see
    // Tournament.cooldown — replays identically either way, so getting this
    // wrong would not change a single result. It would only, silently, make
    // every game in it unverifiable.
    const rules = rulesFor(tournament, white, black);
    const state = replay(
      entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
      { rules }
    );
    const derived: GameFacts = {
      rulesHash: row.rulesHash,
      result: state.result,
      // So the poll can take an exact baseline from a finished load instead of
      // guessing one and reloading on the difference.
      submissions: row.nextSeq,
      // Accepted, not submitted. See GameFacts.moves.
      moves: state.accepted.length,
      // Whose move, from the replay that has just run. Null for a finished
      // game, and null when the manifest gave no address for that side — a
      // pairing this board cannot name is one it must not claim is waiting.
      toMove:
        state.status === 'live' && state.result === null
          ? (state.turn === 'white' ? white : black)
          : null,
      turn: state.status === 'live' && state.result === null ? state.turn : null
    };
    facts.set(game.id, derived);

    // AT A ROUND BOUNDARY, not per game. Emitting every game would redraw the
    // table ninety times and read as flicker; a round is the unit the tab is
    // already organised by, so it appears the way somebody would expect a
    // tournament to fill in.
    const after = tournament.games[done];
    if (deps.onProgress && (!after || after.round !== game.round)) {
      deps.onProgress(soFar(), done, total);
    }

    // Only a WHOLE read is remembered. A short one is a rate limit wearing a
    // game's clothes, and caching it would make the outage permanent.
    if (whole) {
      rememberGame(game.id, {
        nextSeq: row.nextSeq,
        rulesKey: key,
        facts: derived,
        firstHeight: firstHere,
        entries: entries.length
      });
    }
  }

  const checked = checkGames(tournament, facts);
  const noMovesYet = readEverything && entriesSeen === 0;
  const kind = provenance(
    await deps.reader.mintedAt(view.tournamentId ?? 0),
    firstMove,
    noMovesYet
  );
  const verdict = honours(kind, firstMove, deps.compiledAcceptedBefore, noMovesYet);

  // A REVISION THAT ARRIVED TOO LATE IS NOT A CORRECTION.
  //
  // `revisedInTime` was written with the rest of the revision rule and then
  // never called by anything, which meant a manifest could be reissued halfway
  // through a tournament and would simply be believed. That is the exact
  // rewriting-history problem the rule exists to stop, and it survived because
  // the rule was implemented as a function rather than as a step.
  //
  // Only asked when a lineage is being viewed: a root has nothing to be late
  // for. `revisedInTime` returns null when either height is unknown, which
  // means NOT CHECKED and never "fine", so it is reported that way.
  let revision: TournamentView['revision'] = null;
  if (view.lineage.length > 1) {
    const viewing = view.lineage[view.lineage.length - 1];
    const inTime = revisedInTime(await deps.reader.mintedAt(viewing), firstMove);
    revision = {
      id: viewing,
      root: view.lineage[0],
      inTime,
      says:
        inTime === true
          ? `Revision ${viewing}, inscribed before the first move. This is the corrected manifest.`
          : inTime === false
            ? `Revision ${viewing} was inscribed AFTER play began, so it does not supersede ` +
              `${view.lineage[0]}. Shown because you asked for it, and not counted as the tournament.`
            : `Revision ${viewing}. Whether it arrived before the first move could not be checked.`
    };
  }

  return {
    ...view,
    revision,
    provenance: kind,
    says: verdict.says,
    honoured: verdict.ok,
    // ONLY VERIFIED GAMES SCORE. An unverified one is still listed; it is not
    // counted, because counting it would be repeating a claim as though it had
    // been checked.
    table: standings(tournament, verifiedResults(checked)),
    rounds: group(checked, tournament, deps),
    scored: true
  };
}

/** Rounds in order, each game carrying the name a reader should see. */
function group(
  checked: readonly CheckedGame[],
  tournament: Tournament,
  deps: TournamentDeps
): Array<{ number: number; games: TournamentRow[] }> {
  const named = (entrant: string): string => {
    const address = tournament.entrants.find((e) => e.name === entrant)?.address;
    if (!address) return entrant;
    // BNS first: a name registered on chain outranks one a manifest asserts,
    // because anybody can write a manifest and nobody can write somebody else's
    // BNS record. Then the manifest, which is why Plumb can appear at all. Then
    // the address, which is always true and never wrong.
    return deps.bnsFor?.(address) ?? entrant ?? short(address);
  };

  const byId = new Map(checked.map((game) => [game.id, game]));
  return rounds(tournament).map((round) => ({
    number: round.number,
    games: round.games.map((game) => {
      const seen = byId.get(game.id)!;
      return { ...seen, whoWhite: named(seen.white), whoBlack: named(seen.black) };
    })
  }));
}

/** What a verdict should say, in a word rather than only a colour. */
export function verdictLabel(game: CheckedGame): string {
  if (game.verdict === 'verified') return 'verified';
  if (game.verdict === 'missing') return 'not on chain';
  return 'unverified';
}

/** The result, or why there is not one yet. */
export function resultLabel(game: CheckedGame): string {
  if (game.result) return game.result === '1/2-1/2' ? '½–½' : game.result;
  return game.verdict === 'missing' ? '—' : 'in play';
}

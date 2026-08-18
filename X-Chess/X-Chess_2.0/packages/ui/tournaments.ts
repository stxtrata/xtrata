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
import {
  checkGames, honours, provenance, provenanceNote, resolveTournament, rounds, rulesFor,
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
    provenance: null, says: '', honoured: true, table: [], rounds: [], scored: false
  };

  const resolved = await resolveTournament(id, deps.reader);
  if (!resolved.ok || !resolved.tournament) {
    return { ...empty, problems: resolved.problems.map((p) => `${p.where}: ${p.says}`) };
  }
  const tournament = resolved.tournament;

  const facts = new Map<number, GameFacts>();
  for (const game of tournament.games) {
    await deps.pace?.();
    const row = await deps.chain.getGame(game.id).catch(() => null);
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

  for (const game of tournament.games) {
    await deps.pace?.();
    const row = await deps.chain.getGame(game.id).catch(() => null);
    if (!row) {
      readEverything = false;
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
    if (entries.length < row.nextSeq) readEverything = false;
    for (const entry of entries) {
      if (typeof entry.height === 'number' && (firstMove === null || entry.height < firstMove)) {
        firstMove = entry.height;
      }
    }

    // Replayed against the pairing the MANIFEST claims. If that claim is wrong
    // the rules hash will not match and checkGames refuses it anyway, so a
    // result derived here can never be counted for an unverified game.
    const white = tournament.entrants.find((e) => e.name === game.white)?.address ?? null;
    const black = tournament.entrants.find((e) => e.name === game.black)?.address ?? null;
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
    facts.set(game.id, {
      rulesHash: row.rulesHash,
      result: state.result,
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
    });
  }

  const checked = checkGames(tournament, facts);
  const noMovesYet = readEverything && entriesSeen === 0;
  const kind = provenance(
    await deps.reader.mintedAt(view.tournamentId ?? 0),
    firstMove,
    noMovesYet
  );
  const verdict = honours(kind, firstMove, deps.compiledAcceptedBefore, noMovesYet);

  return {
    ...view,
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

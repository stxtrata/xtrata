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

/** The first line of a valid manifest. Exact, so a chain sweep is a string compare. */
export const TOURNAMENT_HEADER = 'X-CHESS-TOURNAMENT/1';

export interface TournamentEntrant {
  /** Display name. Whatever the board calls this player. */
  name: string;
  /** The wallet that signs this player's moves. */
  address: string;
  /** Inscription id of the entry that defines the character, when there is one. */
  entry?: number;
}

export interface TournamentGame {
  /** Game id on the contract. */
  id: number;
  /** Entrant names, which must appear in `entrants`. */
  white: string;
  black: string;
  /** 1-based. Rounds are a real structure here, not decoration. */
  round: number;
}

export interface Tournament {
  name: string;
  format: string;
  contract: string;
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

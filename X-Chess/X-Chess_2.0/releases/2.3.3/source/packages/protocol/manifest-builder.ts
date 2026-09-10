// Deriving a tournament manifest from the chain.
//
// WHY THIS IS INSCRIBED and not merely a script in a repository. A manifest
// says which games form a tournament and who played them, and a manifest is
// only worth as much as the thing that produced it. If the producer lives on
// the Director's machine then the tournament's identity rests on trusting the
// Director. If the producer is inscribed, anybody can run it against the same
// public chain and get the same answer — and a manifest that does not match
// what this produces is simply wrong.
//
// EVERY INPUT IS PUBLIC. The entrants are names and addresses; an address is
// already on chain as the sender of every move it signed. Nothing secret goes
// in, so there is nothing to withhold and no reason anybody's answer should
// differ from anybody else's.
//
// FROM THE RULES HASH, NEVER FROM A SCHEDULE, and this is the whole method. A
// game commits a hash of its rules, and those rules name both players — so the
// pairing is recoverable exactly, from the chain, without trusting what anybody
// believes the schedule was.
//
// Reading the standings by hand once used schedule order instead and got games
// 13 and 15 the wrong way round. Three games open at once and whichever
// transaction lands first takes the lower id, so schedule order and id order
// are different things. Both games then replayed as zero plies — every
// submission rejected as not-a-player — and two real results went missing from
// a table that looked complete. That is the failure this method cannot have.

import { DEFAULT_RULES, normaliseRules } from './rules.js';
import { rulesHash } from './canonical.js';
import type { Tournament, TournamentEntrant, TournamentGame } from './tournament.js';

export interface ManifestSource {
  /** How many games the contract holds. */
  gameCount(): Promise<number>;
  /** The rules hash a game committed to, or null if it cannot be read. */
  rulesHashOf(id: number): Promise<string | null>;
}

export interface ManifestRequest {
  name: string;
  format: string;
  contract: string;
  /** Inscription id of the engine every player was handed. */
  engine?: number;
  /** Public: names and the wallets that sign for them. */
  entrants: TournamentEntrant[];
  source: ManifestSource;
  /** Games to a round. Three, because that is what the nonce rule allows. */
  perRound?: number;
}

/**
 * Which pairing each game committed to, and nothing else.
 *
 * Hashes all ordered pairings once, then looks each game up. A game matching
 * none of them is not in this tournament and is left out — a manifest that
 * omits a game is incomplete, one that invents a game is wrong, and those are
 * not equally bad.
 */
export async function deriveManifest(request: ManifestRequest): Promise<Tournament> {
  const { entrants, source, perRound = 3 } = request;

  if (entrants.length < 2) throw new Error('a tournament needs at least two entrants');
  for (const entrant of entrants) {
    if (!entrant?.name || !entrant?.address) {
      throw new Error('every entrant needs a name and an address');
    }
  }

  const byHash = new Map<string, { white: string; black: string }>();
  for (const white of entrants) {
    for (const black of entrants) {
      if (white.name === black.name) continue;
      const rules = normaliseRules({
        ...DEFAULT_RULES,
        white: white.address,
        black: black.address,
        ranked: true
      });
      byHash.set(rulesHash(rules), { white: white.name, black: black.name });
    }
  }

  const count = await source.gameCount();
  const games: TournamentGame[] = [];
  for (let id = 1; id <= count; id++) {
    const hash = await source.rulesHashOf(id);
    const pairing = hash ? byHash.get(hash) : null;
    if (pairing) games.push({ id, ...pairing, round: 0 });
  }

  // Rounds from the order games were OPENED, not from a schedule — the same
  // reason the pairings come from the hash. Ids are assigned by the contract in
  // the order games are created, so ordering by id is ordering by when.
  games.sort((a, b) => a.id - b.id);
  for (const [at, game] of games.entries()) game.round = Math.floor(at / perRound) + 1;

  return {
    name: request.name,
    format: request.format,
    contract: request.contract,
    ...(request.engine === undefined ? {} : { engine: request.engine }),
    entrants,
    games
  };
}

/** The bytes to inscribe. Header line, then the manifest as JSON. */
export function asManifest(tournament: Tournament, header = 'X-CHESS-TOURNAMENT/1'): string {
  return `${header}\n${JSON.stringify(tournament, null, 2)}\n`;
}

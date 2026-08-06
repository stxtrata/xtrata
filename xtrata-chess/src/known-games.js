// Rules the board already knows, for games it is expected to referee.
//
// The chain stores a hash of a game's rules, never the rules themselves. That
// is deliberate: it keeps the contract ignorant and keeps opening a game cheap.
// But it leaves a gap. A generated child board carries its own rules and is the
// referee for exactly one game. The open board carries none, so a game opened
// with a commitment would be replayed by open-board rules — which is to say,
// not refereed at all.
//
// For most games that is correct. Whoever opens a game with rules generates the
// board that enforces them and hands out that link.
//
// It is wrong for the flagship game, the one the open board opens on by
// default. Nobody arrives there through a generated link. So the board carries
// that game's rules, and checks them against the chain before trusting them.
//
// The check is the whole point. These rules are only ever used when they hash
// to the commitment the contract recorded. If they do not, the board says so
// and referees nothing, rather than quietly enforcing rules the game never
// agreed to.

import { ANYONE_ELSE } from './rules.js';

// jim.btc, resolved once and stored as the address, because replay compares
// principals and a sealed board has no network to ask. Resolved 2026-08-06.
export const JIM = 'SP162D87CY84QVVCMJKNKGHC7GGXFGA0TAR9D0XJW';

/**
 * Keyed by `<contract>#<game>`, because a game number means nothing on its own.
 * Game 1 exists on every version of the contract and they are different games.
 */
export const KNOWN_GAMES = {
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v3#1': {
    label: 'jim.btc against the world',
    rules: {
      white: JIM,
      // Everyone except White. Leaving this open would let the named player
      // answer their own moves, which is a different game from the one meant.
      black: ANYONE_ELSE,
      allow: [],
      cooldown: 0,
      noConsecutive: false
    }
  }
};

export function knownGame(contractId, game) {
  if (!contractId || game === null || game === undefined) return null;
  return KNOWN_GAMES[`${contractId}#${game}`] || null;
}

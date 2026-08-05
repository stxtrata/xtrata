// Constants shared by the contract, the mock chain, and the board.
//
// These mirror xtrata-chess-log-v1.clar. tests/contract.test.js asserts that
// the mock and the real contract agree on every one of them, so a change here
// that is not also a change there fails the suite.

export const FORMAT_VERSION = 1;

// Every shape of this board. v1 charges nothing, v2 charges one fee for both
// opening and moving, v3 prices them apart.
export const CONTRACT_NAMES = {
  v1: 'xtrata-chess-log-v1',
  v2: 'xtrata-chess-log-v2',
  v3: 'xtrata-chess-log-v3'
};

// Newest first. The board walks this list and uses the first one that is
// actually deployed, so naming a contract before it exists degrades to a
// working board rather than an error page, and the day it is deployed the
// board picks it up with no change here.
export const CONTRACT_PREFERENCE = [CONTRACT_NAMES.v3, CONTRACT_NAMES.v2, CONTRACT_NAMES.v1];

export const CONTRACT_NAME = CONTRACT_PREFERENCE[0];
export const FALLBACK_CONTRACT_NAME = CONTRACT_PREFERENCE[1];

// The deployed board. Baked in so the page opens on the game rather than on a
// form asking where the game is; the contract address is not a thing a player
// should have to know or paste. It stays overridable behind a disclosure for
// testnet, for a future version, or for anyone running their own.
export const DEFAULT_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const DEFAULT_NETWORK = 'mainnet';
export const DEFAULT_CONTRACT = `${DEFAULT_DEPLOYER}.${CONTRACT_NAME}`;
export const FALLBACK_CONTRACT = `${DEFAULT_DEPLOYER}.${FALLBACK_CONTRACT_NAME}`;

// The whole chain, qualified, for a board deciding what to talk to.
export const CONTRACT_CANDIDATES = CONTRACT_PREFERENCE.map(
  (name) => `${DEFAULT_DEPLOYER}.${name}`
);

// The open board. Games are numbered from one, and the first is the one people
// arriving without a link should land on.
export const DEFAULT_GAME = 1;

// Deliberately far above any real game. The board is unthrottled, so a lower
// ceiling would let a spammer freeze a legitimate game part-played, and the
// ceiling protects nothing the per-move fee does not already bound.
export const MAX_SEQ = 65536;

export const PAGE_SIZE = 50;

export const ERR = {
  NO_GAME: 100,
  BAD_LENGTH: 101,
  LOG_FULL: 102
};

// The contract's only filter. It is a length check and nothing more: the
// contract must never form an opinion about chess.
export function isWellFormedLength(mv) {
  return typeof mv === 'string' && (mv.length === 4 || mv.length === 5);
}

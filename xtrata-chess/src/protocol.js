// Constants shared by the contract, the mock chain, and the board.
//
// These mirror xtrata-chess-log-v1.clar. tests/contract.test.js asserts that
// the mock and the real contract agree on every one of them, so a change here
// that is not also a change there fails the suite.

export const FORMAT_VERSION = 1;

export const CONTRACT_NAME = 'xtrata-chess-log-v1';

export const MAX_SEQ = 4096;

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

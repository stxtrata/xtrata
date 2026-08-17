// The one constant the harness and the board must agree on, in a file the
// harness can import without pulling in TypeScript.
//
// `packages/protocol/tournament.ts` is the definition and is what the board
// uses; this mirrors the single value a Node script needs so that a generator
// cannot drift from the parser. A test asserts they are the same string.
export const TOURNAMENT_HEADER = 'X-CHESS-TOURNAMENT/1';

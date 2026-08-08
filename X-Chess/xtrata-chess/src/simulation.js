// Simulation mode: a whole open board, played out with no wallet and no fees.
//
// The loop is deliberately the same shape as the real board's. After every
// submission it re-reads the entire log and replays it from scratch, exactly
// as a browser loading the page would. That means a simulation exercises the
// replay path as hard as it exercises the engine, and any drift between
// playing forward and replaying from zero shows up here rather than on chain.

import { MockChain } from './mock-chain.js';
import { replay } from './replay.js';
import { BOTS, mulberry32 } from './bots.js';
import { SimIdentities } from './sim-identities.js';

export const DEFAULTS = {
  seed: 1,
  white: 'greedy',
  black: 'greedy',
  griefRate: 0.25,
  maxSubmissions: 900
};

/**
 * Play one game to its conclusion against a chain.
 *
 * @param {object} [options]
 * @param {number} [options.seed]           reproducibility handle
 * @param {string} [options.white]          bot name for White
 * @param {string} [options.black]          bot name for Black
 * @param {number} [options.griefRate]      share of submissions that are junk
 * @param {number} [options.maxSubmissions] hard stop
 * @param {object} [options.chain]          defaults to a fresh MockChain
 * @param {number} [options.game]           existing game id, else one is opened
 * @param {(info: object) => void} [options.onSubmission]
 */
export async function runSimulation(options = {}) {
  const config = { ...DEFAULTS, ...options };
  const chain = config.chain || new MockChain();
  const random = mulberry32(config.seed);
  // A separate stream for pacing, so adding a clock did not change which moves
  // any existing seed produces.
  const clock = mulberry32(config.seed ^ 0x9e3779b9);
  const identities = config.identities || new SimIdentities(config.seed);

  const game = config.game ?? chain.openGame(identities.you).value;

  let state = replay(await chain.getAllMoves(game));
  let submissions = 0;
  let griefs = 0;
  let filtered = 0;

  while (!state.isGameOver && submissions < config.maxSubmissions) {
    const griefing = random() < config.griefRate;
    const botName = griefing ? 'griefer' : state.turn === 'white' ? config.white : config.black;
    const bot = BOTS[botName];
    if (!bot) throw new Error(`unknown bot: ${botName}`);

    const mv = bot(state.chess, random);
    if (mv === null || mv === undefined) break;

    const sender = griefing ? identities.griefer(random()) : identities.forSide(state.turn);

    const write = chain.submitMove(game, mv, sender);
    submissions++;
    if (griefing) griefs++;
    if (!write.ok) filtered++;

    // Pacing worth replaying: sometimes several submissions race into the same
    // block, usually the next block or two, occasionally nobody moves for a
    // long while. A fixed one block per submission would make every gap
    // identical and real-time playback pointless, and would never produce the
    // same-block case that an unthrottled board actually generates.
    const roll = clock();
    const blocks =
      roll < 0.15
        ? 0
        : roll < 0.6
          ? 1
          : roll < 0.88
            ? 2 + Math.floor(clock() * 4)
            : 20 + Math.floor(clock() * 400);
    chain.advance(blocks);

    // Re-read and re-derive, the way the board does on every poll.
    state = replay(await chain.getAllMoves(game));

    if (config.onSubmission) {
      config.onSubmission({
        submission: submissions,
        mv,
        sender,
        griefing,
        write,
        state
      });
    }
  }

  // The invariant the whole design rests on: replaying the log from scratch
  // must give the same position as the one we reached move by move.
  const independent = replay(await chain.getAllMoves(game));
  const deterministic =
    independent.fen === state.fen &&
    independent.accepted.length === state.accepted.length &&
    independent.rejected.length === state.rejected.length;

  return {
    seed: config.seed,
    game,
    chain,
    identities,
    state,
    deterministic,
    submissions,
    griefs,
    // Turned away by the contract's length filter, so never in the log at all.
    filtered,
    accepted: state.accepted.length,
    rejected: state.rejected.length,
    outcome: state.outcome,
    fen: state.fen,
    pgn: state.pgnMoveText,
    hitLimit: submissions >= config.maxSubmissions && !state.isGameOver
  };
}

#!/usr/bin/env node
// Playing whole games with no chain under them.
//
//   node harness/wizards/lab.mjs                        one game, both sides Sonnet
//   node harness/wizards/lab.mjs --games 12             twelve at once
//   node harness/wizards/lab.mjs --games 12 --plain     the same, annotation stripped
//   node harness/wizards/lab.mjs --from "<fen>"         from a position rather than the start
//
// WHY THIS EXISTS. Everything learned about how these characters play was
// learned from mainnet, one move per block, three games at a time because the
// nonce rule allows no more, at 0.003 STX a move. Round 2 cost about 2 STX and
// four hours to discover that nobody could convert a won game.
//
// None of that is needed to find that out. The chain is what makes a result
// PUBLIC and checkable by a stranger; it has nothing to do with whether the
// move was any good. Take it away and the same experiment runs in minutes:
//
//   on chain   ~12s per move, 3 games at once, real STX, permanent
//   here       ~5s per move, as many games at once as the box will take, free
//
// So the loop is: tune here until the players can actually play, then put a
// tournament on chain because a tournament is a thing people watch. Not the
// other way round, which is what we were doing.
//
// SAME CHOOSER, SAME ENGINE, SAME ANNOTATION as the tournament — this imports
// them rather than reimplementing, so a result here means something about the
// thing that will actually run. The only piece missing is the chain.

import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { annotateMoves, chooseMove, claudeCodeAsker, materialBalance, rankedNotes } from './chooser.mjs';
import { PERSONALITIES, personalityNamed } from './personalities.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const GAMES = Number(arg('games', '1'));
const PLIES = Number(arg('plies', '200'));
const MODEL = arg('model', 'claude-sonnet-5');
const FROM = arg('from');
const PLAIN = process.argv.includes('--plain');

/**
 * Use the one-ply annotation instead of the engine.
 *
 * THE CONTROL ARM. Everything before today ran this way, so it is what the
 * engine has to beat, and beating "no notes at all" would prove nothing.
 */
const ONE_PLY = process.argv.includes('--one-ply');

/** Plies the engine searches. Three is about 12ms and sees a mate in two. */
const DEPTH = Number(arg('depth', '3'));

/**
 * How many games run at once.
 *
 * Bounded because every one of these is a `claude -p` subprocess against a
 * subscription whose limits are shaped for a person typing, not for a fleet.
 * Twelve is comfortable; the flag is there because the right number depends on
 * whose plan it is.
 */
const CONCURRENCY = Number(arg('at-once', '6'));

async function loadFrom(...parts) {
  const out = await build({
    entryPoints: [join(ROOT, ...parts)],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent'
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
}

/** One complete game, and everything worth counting about it. */
async function playOne({ Position, rankMoves, white, black, ask, seed }) {
  const board = seed ? new Position(seed) : new Position();
  const history = [];
  const counted = { blunders: 0, moves: 0, missedMates: 0, stalematesTaken: 0 };

  for (let ply = 0; ply < PLIES; ply++) {
    if (board.isCheckmate()) {
      return { ...counted, result: board.turn === 0 ? '0-1' : '1-0', by: 'checkmate', plies: ply, history };
    }
    for (const [is, by] of [['isStalemate', 'stalemate'], ['isRepetition', 'repetition'], ['isFiftyMoveDraw', 'fifty-move'], ['isInsufficientMaterial', 'insufficient']]) {
      if (board[is]()) return { ...counted, result: '1/2-1/2', by, plies: ply, history };
    }

    const legal = board.movesUci();
    if (!legal.length) return { ...counted, result: '1/2-1/2', by: 'no moves', plies: ply, history };

    // The engine unless asked for the old behaviour. Both produce the same
    // shape — a note per legal move, every move present — so the only thing
    // that differs between arms is what the note KNOWS.
    let notes = ONE_PLY
      ? annotateMoves(Position, board.fen(), legal, history)
      : rankedNotes({ rankMoves, Position, fen: board.fen(), played: history, depth: DEPTH });

    // Was a mate on offer, and did they take it? Measured from the engine
    // either way, so both arms are marked by the same examiner.
    const truth = rankMoves(board.state, DEPTH);
    const mate = truth.find((r) => r.mateIn === 1);
    if (PLAIN) notes = null;

    const mover = board.turn === 0 ? white : black;
    let move;
    try {
      ({ move } = await chooseMove({
        character: mover, ask, annotations: notes,
        position: {
          fen: board.fen(), legalMoves: legal,
          turn: board.turn === 0 ? 'white' : 'black', history
        }
      }));
    } catch (error) {
      // A FORFEIT IS THE CHARACTER'S FAILURE. Anything else is ours, and this
      // caught both — so a `claude -p` that hit a rate limit, timed out, or died
      // was recorded as a player who could not find a legal move.
      //
      // The engine arm reported three forfeits on that basis, and they were the
      // most alarming number in the run. Probing afterwards found 0 refusals in
      // 16 asks across ordinary, in-check and hopeless positions, which is what
      // sent me looking here. run-tournament.mjs has always drawn this line
      // properly, with the same `error.forfeit` marker; the lab never did.
      if (!error?.forfeit) {
        return {
          ...counted, result: null, by: 'ABORTED (harness, not the player)',
          plies: ply, history, note: String(error.message).slice(0, 120)
        };
      }
      // A character that cannot produce a legal move loses, exactly as it would
      // on chain — where it resigns. No point pretending that is a draw.
      return {
        ...counted, result: board.turn === 0 ? '0-1' : '1-0', by: 'forfeit',
        plies: ply, history, note: String(error.message).slice(0, 120)
      };
    }

    // Scored by the ENGINE in both arms, not by whichever note the player saw.
    // A blunder is a move the search says drops material against best play, so
    // the two arms are being marked to one standard.
    if (mate && move !== mate.uci) counted.missedMates++;
    const chosen = truth.find((r) => r.uci === move);
    if (chosen && truth[0] && truth[0].score - chosen.score >= 200) counted.blunders++;
    const after = new Position(board.fen());
    after.applyUci(move);
    if (after.isStalemate()) counted.stalematesTaken++;
    counted.moves++;

    board.applyUci(move);
    history.push(move);
  }

  const { white: w, black: b } = materialBalance(board.fen());
  return { ...counted, result: null, by: `unfinished at ${PLIES} plies`, plies: PLIES, history, material: w - b };
}

/** Run `thunks` with at most `limit` in flight. */
async function pool(thunks, limit) {
  const out = [];
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, thunks.length) }, async () => {
    while (next < thunks.length) {
      const mine = next++;
      out[mine] = await thunks[mine]();
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  const { Position } = await loadFrom('packages', 'chess', 'engine.ts');
  const { rankMoves } = await loadFrom('packages', 'chess', 'search.ts');
  const ask = claudeCodeAsker();
  const pair = (n) => {
    const all = PERSONALITIES;
    return { white: all[n % all.length], black: all[(n + 1) % all.length] };
  };

  console.log(`\nlab — ${GAMES} game${GAMES === 1 ? '' : 's'}, no chain`);
  console.log(`model     ${MODEL}`);
  console.log(`notes     ${PLAIN ? 'STRIPPED' : ONE_PLY ? 'one-ply annotation (control)' : `engine, depth ${DEPTH}`}`);
  console.log(`from      ${FROM ?? 'the starting position'}`);
  console.log(`at once   ${CONCURRENCY}\n`);

  const started = Date.now();
  const games = await pool(
    Array.from({ length: GAMES }, (_, n) => async () => {
      const { white, black } = pair(n);
      const out = await playOne({
        Position, rankMoves, ask, seed: FROM,
        white: { ...white, model: MODEL },
        black: { ...black, model: MODEL }
      });
      console.log(
        `  ${white.name.padEnd(8)} v ${black.name.padEnd(8)} ${String(out.result ?? '—').padEnd(8)} ` +
          `${out.by.padEnd(34)} ${out.plies} plies`
      );
      // Printed, because a forfeit is a claim about a PLAYER and deserves to be
      // checkable. Three of them went unexamined for exactly as long as the
      // reason stayed inside the object.
      if (out.note) console.log(`      ${out.note}`);
      return out;
    }),
    CONCURRENCY
  );

  const total = (k) => games.reduce((n, g) => n + (g[k] ?? 0), 0);
  const decisive = games.filter((g) => g.result === '1-0' || g.result === '0-1').length;
  const mates = games.filter((g) => g.by === 'checkmate').length;
  const moves = total('moves');

  console.log(`\n${GAMES} games in ${((Date.now() - started) / 60000).toFixed(1)} minutes, ${moves} moves`);
  console.log(`  decided                : ${decisive}/${GAMES}  (${mates} by checkmate)`);
  const aborted = games.filter((g) => g.by?.startsWith('ABORTED')).length;
  console.log(`  unfinished at ${PLIES} plies : ${games.filter((g) => !g.result && !g.by?.startsWith('ABORTED')).length}`);
  console.log(`  forfeited by a character: ${games.filter((g) => g.by === 'forfeit').length}`);
  if (aborted) console.log(`  ABORTED by the harness  : ${aborted}  <- not a chess result, do not count these`);
  console.log(`  moves 2+ pawns worse than best: ${moves ? Math.round((total('blunders') / moves) * 100) : 0}%`);
  console.log(`  mates missed            : ${total('missedMates')}`);
  console.log(`  stalemates walked into  : ${total('stalematesTaken')}`);
  console.log(`\nOn chain this would have been ${(moves * 3000 / 1e6).toFixed(3)} STX and about ${Math.round(moves * 12.5 / 60)} minutes of blocks.\n`);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});

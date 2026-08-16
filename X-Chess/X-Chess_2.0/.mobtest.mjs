import { build } from 'esbuild';
import { annotateMoves, chooseMove, claudeCodeAsker } from './harness/wizards/chooser.mjs';
import { PERSONALITIES } from './harness/wizards/personalities.mjs';

const load = async (...p) => {
  const out = await build({ entryPoints: [p.join('/')], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
};
const { Position } = await load('packages', 'chess', 'engine.ts');

// The real game 18 ending: black queen and pawn against a bare king.
const START = '8/8/8/3p4/5K2/2k5/8/q7 b - - 22 169';
const ask = claudeCodeAsker();
const black = { ...PERSONALITIES.find((c) => c.id === 'oblique'), model: 'claude-sonnet-5' };
const white = { ...PERSONALITIES.find((c) => c.id === 'wager'), model: 'claude-sonnet-5' };
const PLIES = 50;

async function run(withMobility) {
  const board = new Position(START);
  const history = [];
  for (let ply = 0; ply < PLIES; ply++) {
    if (board.isCheckmate()) return { end: 'MATE', ply, history };
    if (board.isStalemate()) return { end: 'stalemate', ply, history };
    const legal = board.movesUci();
    if (!legal.length) return { end: 'no moves', ply, history };
    let notes = annotateMoves(Position, board.fen(), legal, history);
    if (!withMobility) notes = notes.map((n) => ({ ...n, note: n.note.replace(/ — enemy king has \d+ squares/, '') }));
    const mover = board.turn === 0 ? white : black;
    try {
      const { move } = await chooseMove({
        character: mover, ask, annotations: notes,
        position: { fen: board.fen(), legalMoves: legal, turn: board.turn === 0 ? 'white' : 'black', history }
      });
      board.applyUci(move);
      history.push(move);
    } catch (e) {
      return { end: 'forfeit: ' + String(e.message).slice(0, 60), ply, history };
    }
  }
  return { end: 'still going', ply: PLIES, history };
}

for (const withMobility of [true, false]) {
  const t = Date.now();
  const r = await run(withMobility);
  const label = withMobility ? 'WITH mobility note   ' : 'WITHOUT (old behaviour)';
  process.stdout.write(`${label}  ${r.end} after ${r.ply} plies  (${((Date.now()-t)/60000).toFixed(1)} min)\n`);
  process.stdout.write(`   moves: ${r.history.slice(0, 24).join(' ')}\n`);
}

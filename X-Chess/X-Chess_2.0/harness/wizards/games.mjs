// The games the fleet knows how to play.
//
// There was one: fool's mate, four moves, and the README said a longer game
// "costs more in fees and proves exactly the same things". That was true of the
// things it listed - a fee moves, two signers alternate, replay derives a real
// checkmate - and false of nearly everything else the board does.
//
// Fool's mate contains no capture, no castle, no en passant, no promotion, no
// control event, no rejected submission and no second page. So the fleet could
// run green forever while every one of those was broken. Two of them WERE:
// en passant was reported twice from a real board, by a person, because nothing
// automated had ever tried it on chain.
//
// So each plan below names what it is the only plan to exercise. Adding one is
// cheap; the expensive part is the open fee, not the moves.
//
// EVERY PLAN IS VERIFIED BY REPLAY, not by whoever typed it. `tests/wizards/
// game-plans.test.ts` runs each move list through the board's own engine and
// asserts the terminal state, the accepted count and the rejected count. A
// mistranscribed famous game fails there rather than on mainnet, having spent
// an open fee to find out.

/** The two players. A plan names sides, never wallets. */
const W = 'wizard-1';
const B = 'wizard-2';

const move = (by, uci, note) => ({ by, move: uci, note });

/**
 * Fool's mate. The shortest real result in chess.
 *
 * Still the default, and still the right default: it is the cheapest thing that
 * ends in a genuine checkmate, so it is what you run to answer "can this fleet
 * still sign".
 */
const FOOLS_MATE = [
  move(W, 'f2f3', 'white opens'),
  move(B, 'e7e5', 'black answers'),
  move(W, 'g2g4', 'white blunders, on purpose'),
  move(B, 'd8h4', 'checkmate')
];

/**
 * Scholar's mate. A second mating pattern, and the first plan with a capture.
 *
 * Fool's mate ends with every piece still on the board, so until this one no
 * wizard game had ever removed a piece from a square on chain.
 */
const SCHOLARS_MATE = [
  move(W, 'e2e4', 'white opens'),
  move(B, 'e7e5', 'black mirrors'),
  move(W, 'f1c4', 'bishop eyes f7'),
  move(B, 'b8c6', 'black develops'),
  move(W, 'd1h5', 'queen joins'),
  move(B, 'g8f6', 'black misses the threat'),
  move(W, 'h5f7', 'queen takes f7, checkmate')
];

/**
 * En passant.
 *
 * The rule a board has to know about and a move list cannot show: the capture
 * lands on an empty square and removes a pawn that is not on it. Reported twice
 * from a real board as "not an option", and nothing automated had ever played
 * one, on chain or off.
 */
const EN_PASSANT = [
  move(W, 'e2e4', 'white opens'),
  move(B, 'e7e6', 'black replies quietly'),
  move(W, 'e4e5', 'the pawn walks on'),
  move(B, 'd7d5', 'a double step past it, which is what makes this legal'),
  move(W, 'e5d6', 'en passant: lands on d6, takes the pawn on d5')
];

/**
 * Castling, both sides, in one game.
 *
 * A castle is submitted as a king move of two files and the rook is implied by
 * the rules rather than named, so this is the only plan where replay has to move
 * a piece nobody sent.
 */
const CASTLING = [
  move(W, 'd2d4', 'white opens'),
  move(B, 'd7d5', 'black mirrors'),
  move(W, 'b1c3', 'knight out'),
  move(B, 'b8c6', 'and back'),
  move(W, 'c1f4', 'bishop out'),
  move(B, 'c8f5', 'and back'),
  move(W, 'd1d2', 'queen steps aside'),
  move(B, 'd8d7', 'and again'),
  move(W, 'e1c1', 'white castles queenside: rook a1 to d1, unasked'),
  move(B, 'e8c8', 'black castles queenside: rook a8 to d8, unasked')
];

/**
 * Promotion.
 *
 * The only plan whose submission is five characters rather than four, and the
 * only one where the piece that lands is not the piece that moved.
 */
const PROMOTION = [
  move(W, 'e2e4', 'white opens'),
  move(B, 'd7d5', 'black offers the pawn'),
  move(W, 'e4d5', 'white takes'),
  move(B, 'g8f6', 'black develops instead of recapturing'),
  move(W, 'd5d6', 'the pawn runs'),
  move(B, 'e7e5', 'black ignores it'),
  move(W, 'd6c7', 'and takes on c7'),
  move(B, 'f8e7', 'still ignoring it'),
  move(W, 'c7b8q', 'promotes on b8, taking the knight')
];

/**
 * Stalemate. A drawn game that nobody agreed to.
 *
 * The only plan that ends without a winner and without a control event, so it is
 * the only one that proves replay can end a game on the POSITION alone.
 */
const STALEMATE = [
  move(W, 'e2e3', 'white opens'),
  move(B, 'a7a5', 'black obliges'),
  move(W, 'd1h5', 'queen out'),
  move(B, 'a8a6', 'rook out'),
  move(W, 'h5a5', 'queen takes a5'),
  move(B, 'h7h5', 'black obliges again'),
  move(W, 'a5c7', 'queen takes c7'),
  move(B, 'a6h6', 'rook slides across'),
  move(W, 'h2h4', 'a quiet pawn move'),
  move(B, 'f7f6', 'black obliges'),
  move(W, 'c7d7', 'queen takes d7, check'),
  move(B, 'e8f7', 'king steps up, forced'),
  move(W, 'd7b7', 'queen takes b7'),
  move(B, 'd8d3', 'black queen runs'),
  move(W, 'b7b8', 'queen takes b8'),
  move(B, 'd3h7', 'black queen runs again'),
  move(W, 'b8c8', 'queen takes c8'),
  move(B, 'f7g6', 'king steps aside'),
  move(W, 'c8e6', 'stalemate: black is not in check and has no legal move')
];

/**
 * A resignation, under events-v1.
 *
 * Control events are judged by a different predicate from moves and are
 * deliberately exempt from the turn check, the cooldown and the no-consecutive
 * rule. Nothing automated had ever sent one.
 */
const RESIGNATION = [
  move(W, 'e2e4', 'white opens'),
  move(B, 'e7e5', 'black answers'),
  move(W, 'g1f3', 'white develops'),
  move(B, 'resgn', 'black resigns on their own turn')
];

/**
 * A draw by agreement, under events-v1.
 *
 * Two events rather than one, and the second is only valid because of the
 * first - so this is the only plan where replay has to remember an offer across
 * a submission.
 */
const DRAW_AGREED = [
  move(W, 'd2d4', 'white opens'),
  move(B, 'd7d5', 'black mirrors'),
  move(W, 'draw?', 'white offers'),
  move(B, 'draw!', 'black accepts')
];

/**
 * A game containing submissions replay throws away.
 *
 * Every other plan is all-accepted, so the skip path - the thing that makes a
 * wrong-side move cost a fee and count for nothing - had never been exercised
 * against real chain data. The board's whole eligibility gate exists to keep
 * people from doing this by accident. It should be provable that it happens.
 */
const REJECTED = [
  move(W, 'e2e4', 'white opens'),
  move(W, 'd2d4', 'white again, out of turn: stored, charged, skipped'),
  move(B, 'e7e5', 'black answers'),
  move(B, 'not-a-move', 'malformed: stored, charged, skipped'),
  move(W, 'g1f3', 'white develops'),
  move(B, 'b8c6', 'black develops')
];

/**
 * Anderssen against Kieseritzky, London 1851. The Immortal Game.
 *
 * Forty-five submissions, which is the point twice over. It is long enough to be
 * worth watching - a queen and both rooks sacrificed, mate delivered by three
 * minor pieces - and long enough to be the only plan that comes near the fifty
 * the reader pages at.
 */
const IMMORTAL = [
  move(W, 'e2e4', ''), move(B, 'e7e5', ''),
  move(W, 'f2f4', "king's gambit"), move(B, 'e5f4', 'accepted'),
  move(W, 'f1c4', ''), move(B, 'd8h4', 'check'),
  move(W, 'e1f1', 'the king walks'), move(B, 'b7b5', ''),
  move(W, 'c4b5', ''), move(B, 'g8f6', ''),
  move(W, 'g1f3', ''), move(B, 'h4h6', ''),
  move(W, 'd2d3', ''), move(B, 'f6h5', ''),
  move(W, 'f3h4', ''), move(B, 'h6g5', ''),
  move(W, 'h4f5', ''), move(B, 'c7c6', ''),
  move(W, 'g2g4', ''), move(B, 'h5f6', ''),
  move(W, 'h1g1', 'offering the rook'), move(B, 'c6b5', 'taken'),
  move(W, 'h2h4', ''), move(B, 'g5g6', ''),
  move(W, 'h4h5', ''), move(B, 'g6g5', ''),
  move(W, 'd1f3', ''), move(B, 'f6g8', ''),
  move(W, 'c1f4', ''), move(B, 'g5f6', ''),
  move(W, 'b1c3', ''), move(B, 'f8c5', ''),
  move(W, 'c3d5', ''), move(B, 'f6b2', ''),
  move(W, 'f4d6', 'offering the other rook'), move(B, 'c5g1', 'taken'),
  move(W, 'e4e5', ''), move(B, 'b2a1', 'and the queen takes a rook too, with check'),
  move(W, 'f1e2', ''), move(B, 'b8a6', ''),
  move(W, 'f5g7', 'check'), move(B, 'e8d8', ''),
  move(W, 'f3f6', 'the queen, offered'), move(B, 'g8f6', 'taken'),
  move(W, 'd6e7', 'checkmate, by two knights and a bishop')
];

/**
 * Every plan, by name.
 *
 * `expect` is what replay must say afterwards, and it is asserted rather than
 * described: a plan whose moves stop matching its claim fails the test that
 * reads this table.
 */
export const GAME_PLANS = Object.freeze({
  'fools-mate': {
    moves: FOOLS_MATE,
    proves: 'a fee moves, two signers alternate, replay derives a real checkmate',
    expect: { status: 'over', result: '0-1', accepted: 4, rejected: 0 }
  },
  'scholars-mate': {
    moves: SCHOLARS_MATE,
    proves: 'a capture, and a second mating pattern',
    expect: { status: 'over', result: '1-0', accepted: 7, rejected: 0 }
  },
  'en-passant': {
    moves: EN_PASSANT,
    proves: 'the capture that lands on an empty square',
    expect: { status: 'live', result: null, accepted: 5, rejected: 0 }
  },
  castling: {
    moves: CASTLING,
    proves: 'a rook moved by the rules rather than by a submission, both sides',
    expect: { status: 'live', result: null, accepted: 10, rejected: 0 }
  },
  promotion: {
    moves: PROMOTION,
    proves: 'a five-character submission, and a piece that changes on arrival',
    expect: { status: 'live', result: null, accepted: 9, rejected: 0 }
  },
  stalemate: {
    moves: STALEMATE,
    proves: 'a game ended by the position alone, with no winner',
    expect: { status: 'over', result: '1/2-1/2', accepted: 19, rejected: 0 }
  },
  resignation: {
    moves: RESIGNATION,
    proves: 'a control event, sent on the sender’s own turn',
    expect: { status: 'over', result: '1-0', accepted: 4, rejected: 0 }
  },
  'draw-agreed': {
    moves: DRAW_AGREED,
    proves: 'an offer remembered across a submission, and accepted',
    expect: { status: 'over', result: '1/2-1/2', accepted: 4, rejected: 0 }
  },
  rejected: {
    moves: REJECTED,
    proves: 'submissions that are stored, charged, and skipped by every reader',
    expect: { status: 'live', result: null, accepted: 4, rejected: 2 }
  },
  immortal: {
    moves: IMMORTAL,
    proves: 'a long game, worth watching, and the nearest thing to a second page',
    expect: { status: 'over', result: '1-0', accepted: 45, rejected: 0 }
  }
});

/** The plan run when nobody names one. */
export const DEFAULT_PLAN = 'fools-mate';

export const PLAN_NAMES = Object.freeze(Object.keys(GAME_PLANS));

/**
 * Look up a plan, or say what the choices were.
 *
 * Throws rather than falling back to the default: a run that quietly played a
 * different game from the one asked for would spend real money proving
 * something nobody wanted to know.
 *
 * Tagged as a safety refusal so the runner prints the sentence rather than a
 * stack trace. It IS one - it is a refusal to sign the wrong thing - and a
 * mistyped plan name is the likeliest way anybody meets it.
 */
export function planNamed(name) {
  const key = String(name ?? DEFAULT_PLAN);
  const plan = GAME_PLANS[key];
  if (!plan) {
    const error = new Error(
      `no game plan called "${key}". Try one of: ${PLAN_NAMES.join(', ')}.`
    );
    error.name = 'WizardSafetyError';
    throw error;
  }
  return { name: key, ...plan };
}

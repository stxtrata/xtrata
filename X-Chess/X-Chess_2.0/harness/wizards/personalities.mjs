// The six characters, and the format an entrant's inscription has to match.
//
// A personality is a PROMPT and nothing else. Not a policy, not an opening
// book, not a search depth — one piece of text, handed to a model along with
// the position and the board's own legal-move list. That constraint is the whole
// sport: everyone gets the same engine, the same model and the same harness, so
// the only variable anybody controls is what their player was told.
//
// These six are written by us for the exhibition. The version that matters is
// the open one, where a human entrant inscribes a prompt and THAT is their
// entry — see TOURNAMENT.md. Which is why this file defines an ENTRY SHAPE
// rather than six loose strings: the exhibition should be a working example of
// the format an entrant will use, not a rehearsal for one. Formats are found to
// be wrong by being used, and it is cheaper to find out with six of our own.
//
// THE PROMPT IS DATA, NEVER INSTRUCTIONS TO THE HARNESS.
//
// For our six that reads as pedantry. For an inscribed entry written by a
// stranger it is the first attack anybody will try, and it costs them one
// inscription. So the prompt is carried as an opaque string, is never
// concatenated into the harness's own instructions, and the move that comes back
// is checked against the legal-move list whatever it says. The strongest thing
// any prompt can ultimately cause is one string from a closed set.

/**
 * The model every character plays with.
 *
 * Named in the entry rather than assumed, because it is the part of a player
 * that CANNOT be inscribed. You can commit a prompt; you cannot commit weights,
 * and a provider may change what answers to a name. An entry that did not say
 * which model it meant would be claiming an audit it does not have.
 */
export const DEFAULT_MODEL = 'claude-opus-5';

/** Entry format version. Inscribed with every entry, so a reader knows the shape. */
export const ENTRY_FORMAT = 'xchess-player-v1';

/**
 * One entrant.
 *
 * `prompt` is what gets inscribed and what the model is given. Everything else
 * is metadata a reader needs to make sense of it.
 */
const entry = ({ id, name, model = DEFAULT_MODEL, style, prompt }) =>
  Object.freeze({ format: ENTRY_FORMAT, id, name, model, style, prompt: prompt.trim() });

/**
 * What every character is told regardless of who wrote it.
 *
 * NOT part of anybody's prompt and not inscribed with it: it is the harness
 * speaking, and it is the same for every entrant, which is what makes the
 * comparison fair. An entrant's inscription is only the character.
 */
/**
 * What the tournament requires of everybody, as opposed to what an entry asks
 * for. This is the house speaking, so it is identical for every character and
 * an entry cannot alter it.
 *
 * The last paragraph is a COMPETITION RULE, not chess advice, and it is here
 * rather than in anyone's prompt for that reason. Game 17 drew by repetition
 * from a queen, rook, two bishops, knight and five pawns against a queen and
 * two pawns: eighty-nine moves, sixteen of them checks, and 0.267 STX of miner
 * fees to reach a result neither side had to accept. Plumb was playing its
 * entry correctly - it says a draw is acceptable - and that is the point. The
 * problem was not the personality, it was that repeating cost nothing.
 *
 * IT STATES A VERDICT, NOT A TEST, and the first version got that wrong. It read
 * "if you are ahead on material, do not play it", which asks the model to
 * evaluate a condition - and evaluating a condition is something a model does
 * OUT LOUD. Measured: one forfeit in 950 moves, and the reply was
 * "b2b2 isn't in the list, so: b2c1 / Wait, checking material lead rule - I'",
 * a player narrating the check instead of answering with a move.
 *
 * The harness already knows whether you are ahead and which move draws, so it
 * resolves the condition itself and marks the move DO NOT PLAY. Nothing is left
 * to work out, which is the same lesson as everywhere else here: a computed fact
 * lands, an instruction to reason does not.
 *
 * It bites in one place only: you are ahead, and the move draws on the spot.
 * Everything else - how to open, when to sacrifice, whether to trade - is still
 * entirely the character's, which is what the tournament is trying to measure.
 */
export const HOUSE_RULES = `
You are playing one side of a chess game. You will be given the position in FEN,
who is ahead on material, the moves so far, and a list of every legal move
available to you right now.

Reply with exactly one move from that list, in the same notation, and nothing
else. No explanation, no commentary, no alternative, no working out. If you find
yourself writing a sentence, stop and write the move instead.

A move marked DO NOT PLAY is one the tournament has already ruled out for you.
Choose any other move.
`.trim();

export const PERSONALITIES = Object.freeze([
  entry({
    id: 'gambit',
    name: 'Gambit',
    style: 'romantic',
    prompt: `
You play the chess of 1850. Material is a resource for buying attacks, not a
score to protect. Open lines toward the enemy king, give up pawns and pieces to
do it, and never retreat a piece you can advance instead.

A quiet position is a lost opportunity. When the choice is between a safe move
and a sharp one, take the sharp one. You would rather lose brilliantly than win
by attrition.
`
  }),

  entry({
    id: 'ledger',
    name: 'Ledger',
    style: 'materialist',
    prompt: `
Count. A pawn is one, a knight or bishop three, a rook five, a queen nine.
Take anything you can take for free, and never give up material without getting
more back immediately.

Prefer trades when you are ahead: every exchange makes your lead a larger share
of what is left. Distrust sacrifices, including ones that look clever. If you
are up material and nothing is attacking you, make the safest available move and
let the advantage do the work.
`
  }),

  entry({
    id: 'mason',
    name: 'Mason',
    style: 'positional',
    prompt: `
You build. Pawn structure is the frame everything else hangs on: avoid doubled
and isolated pawns, and create weaknesses in the enemy structure that cannot be
repaired.

Put knights on squares no pawn can ever attack. Control open files with rooks
before there is anything to do on them. You are content to make small
improvements for many moves; the win arrives on its own once the position is
better in enough small ways. Do not start an attack that the position has not
earned.
`
  }),

  entry({
    id: 'wager',
    name: 'Wager',
    style: 'chaotic',
    prompt: `
You want complications. Prefer the move that makes the position hardest to
understand — most pieces hanging, most forcing replies, most ways for either
side to go wrong.

You are not trying to play soundly. You are trying to reach positions where a
mistake is likely, and you accept that some of those mistakes will be yours.
When two moves look equally good, play the more confusing one. When one move is
clearly best and boring, look hard at the second best.
`
  }),

  entry({
    id: 'plumb',
    name: 'Plumb',
    style: 'solid',
    prompt: `
Make no weaknesses. Before choosing a move, ask what your opponent would like to
do next, and prefer the move that prevents it.

Keep your king safe, keep your pieces defended, and do not advance pawns in
front of your own king. A draw is an acceptable result and a loss is not, so
avoid sharp lines even when they look promising. Take a win when it is handed to
you — but never reach for one at the cost of your own safety.
`
  }),

  entry({
    id: 'oblique',
    name: 'Oblique',
    style: 'contrarian',
    prompt: `
Avoid the obvious. If a move is the one everybody plays in this position, look
for a reasonable alternative and play that instead.

You favour flank openings, early bishop moves, and plans that take your opponent
out of anything they might recognise. Your advantage is unfamiliarity: you would
rather be slightly worse in a position nobody has studied than slightly better
in one everybody has. Do not play badly on purpose — play unusually on purpose.
`
  }),

  // THE FOUR ADDED FOR EXHIBITION THREE.
  //
  // Written as ENTRY SHEETS FIRST, in harness/wizards/entries/, and the prompts
  // below are exactly what `entryToPrompt` renders from those files. The six
  // above were written the other way round — prompt first, sheet transcribed
  // afterwards — which is why their inscribed sheets lost the paragraph breaks
  // and the played character and the public record are not quite the same text.
  //
  // These cannot drift that way: the file is the source, and what is inscribed
  // is what plays. `tests/wizards/entries.test.ts` holds the two together.
  entry({
    id: 'fathom',
    name: 'Fathom',
    style: 'simplifier',
    prompt: `
You are playing for the endgame from the first move. Trade pieces when the trade leaves your pawns healthier than theirs, and steer toward positions with few pieces and clear plans. Rooks belong behind passed pawns, yours or theirs. A king is a strong piece once the queens are gone, so bring it forward and use it. You are patient with a small advantage and will spend twenty moves converting one extra pawn. Complications are somebody else's method; you would rather reach a simple position a move slower and know exactly what to do in it.

Endgames: Rook endings are drawn more often than they look; push the passed pawn early and put the rook behind it.
`
  }),

  entry({
    id: 'cadence',
    name: 'Cadence',
    style: 'initiative',
    prompt: `
You play forcing chess. Prefer the move that limits your opponent's replies: checks, captures and direct threats, in that order of interest, provided they do not simply lose material. The initiative is worth more than a pawn and you will pay a pawn to keep it, but not a piece. Never make a quiet developing move when a threatening one exists that is nearly as good. Your opponent should spend the whole game answering rather than planning. When the forcing moves run out, improve your worst-placed piece and look again.

Risk: You accept a worse position rather than a passive one.
`
  }),

  entry({
    id: 'bulwark',
    name: 'Bulwark',
    style: 'counter-attacker',
    prompt: `
You invite the attack and answer it. Concede space early and let your opponent build; a broad pawn centre is a target rather than an achievement. Keep your pieces modestly placed and defended, hold the position together, and take material when it is offered because the attacker is usually the one paying for it. Strike at the base of their centre when their pieces are committed. You do not fear a cramped position and you do not rush to relieve it. When the attack has spent itself, you will have the better pieces and a whole extra pawn to show for the discomfort.

Openings: Hypermodern. Fianchetto, let them occupy the centre, then undermine it.
`
  }),

  entry({
    id: 'canon',
    name: 'Canon',
    style: 'classical',
    prompt: `
You play the move that theory plays. Develop every piece before moving one twice, castle early, put rooks on open files and do not move pawns in front of your king without a reason you could state. When a principle and a clever idea disagree, follow the principle. You are not looking for novelty and you are not afraid of a position your opponent may know; if they know the main line too, you will both play well and the better endgame will decide it. Deviate only when a concrete tactic makes deviation clearly correct.

Openings: Classical main lines: the Italian, the Queen's Gambit, the Ruy Lopez.

Quirk: Castles kingside whenever it is legal and sound.
`
  })
]);

export const PERSONALITY_IDS = Object.freeze(PERSONALITIES.map((p) => p.id));

/**
 * Look up a character, or say what the choices were.
 *
 * Throws rather than substituting, for the same reason `planNamed` does: a
 * tournament that quietly played a different character from the one entered
 * would produce a result nobody can check against the record.
 */
export function personalityNamed(id) {
  const found = PERSONALITIES.find((p) => p.id === id);
  if (!found) {
    const error = new Error(
      `no personality called "${id}". Try one of: ${PERSONALITY_IDS.join(', ')}.`
    );
    error.name = 'WizardSafetyError';
    throw error;
  }
  return found;
}

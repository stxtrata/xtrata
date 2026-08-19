// Turning a personality and a position into one legal move.
//
// This is the only file where text somebody else wrote reaches a model, so it is
// the only file where prompt injection is a live question rather than a
// theoretical one. Two rules carry the weight, and neither is a preference:
//
//   1. THE CHARACTER IS DATA. An entrant's inscribed prompt is never
//      concatenated into the system prompt, which is where authority lives. It
//      goes in the user turn, inside a fence, labelled as a description of a
//      chess player. The system prompt is written here and says so.
//
//   2. THE ANSWER IS CHECKED AGAINST A CLOSED SET. Whatever comes back, the
//      move must be one the board's own engine generated for this exact
//      position. That bounds a bad player and a hostile one identically: the
//      strongest thing any prompt can ultimately cause is one string from a list
//      the harness made.
//
// Rule 2 is what makes rule 1 survivable if it is ever wrong. A prompt that
// talks its way past the fence still cannot produce anything but a legal chess
// move, and a legal chess move is the worst case we already accept from a
// player having a bad game.
//
// Everything here takes its I/O by injection — the model call is a parameter —
// so the validation is testable without a network or a key, which is the same
// discipline the rest of `wizards-core.mjs` follows.

import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';

// The prompt protocol, which is inscribed. Re-exported because every caller
// here imported these from this file first, and because the two halves are one
// idea: this file decides HOW to reach a model, director.mjs decides WHAT it is
// asked and what the answer means.
import {
  HOUSE_RULES, SYSTEM_PROMPT, buildRequest, materialBalance, depthFor, extractMove
} from './director.mjs';
export { HOUSE_RULES, SYSTEM_PROMPT, buildRequest, materialBalance, depthFor, extractMove };
import { WizardSafetyError, scrub } from './wizards-core.mjs';

/**
 * How many times a character may answer with something that is not a legal move.
 *
 * FIVE, NOT THREE, and the arithmetic is the argument. Re-asking the position
 * that forfeited game 29 gave two good answers and one bad one — the failure is
 * stochastic and roughly one in three THERE, which is far worse than typical.
 * At that rate three strikes forfeits about 4% of the time, and over a
 * fifty-move game that is most of a forfeit per game.
 *
 * The bad reply is not confusion about chess. Ledger wanted e5, which was the
 * top-ranked move on the list, and wrote "e5e5" — the destination square twice
 * instead of from and to. It knew the move and mangled the notation.
 *
 * Attempts are nearly free: five seconds each, and only spent when something
 * already went wrong. A forfeit is a permanent on-chain result, so the trade is
 * lopsided in favour of asking again.
 */
export const MAX_ATTEMPTS = 5;

/**
 * Room to think AND answer, which is not the same as room to ramble.
 *
 * This was 64, on the reasoning that the reply is one move. That reasoning is
 * wrong on every current model, because `max_tokens` caps thinking and text
 * TOGETHER, and adaptive thinking is on by default. On a quiet opening the
 * model does not think and 64 was plenty; on a real middlegame it thinks, the
 * cap is consumed before it writes anything, and the reply comes back as
 * `stop_reason: max_tokens` with a thinking block and NO TEXT.
 *
 * That is what actually ended game 12. Ledger was not misreading the board — it
 * was cut off mid-thought, three times, and the empty replies were scored as
 * illegal moves. Measured on the exact position afterwards: at 64 both Sonnet 5
 * and Opus 5 return empty; at 1024 Opus 5 thinks for 165 tokens and plays a
 * legal move.
 *
 * A truncated character forfeits a game it could have played, so the cap has to
 * be generous. It still bounds a runaway: 1024 is about six times the longest
 * measured answer.
 */
const MAX_TOKENS = 1024;

/**
 * How hard a character thinks before answering.
 *
 * `low` on purpose. Choosing from a list the board already generated is not a
 * task that rewards deliberation — the hard part is reading the position, not
 * searching it — and low effort still solved the position that ended game 12
 * where no amount of budget at 64 tokens could. Higher settings mostly buy
 * longer thinking for the same move.
 */
const EFFORT = 'low';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

/**
 * Every legal move, ranked by the engine, as the character will see it.
 *
 * THE ENGINE INFORMS, IT DOES NOT PLAY. The whole list comes back, in the
 * engine's order, with a number against each — not a recommendation, and never
 * a shortened list. A character handed one move is an engine playing, and
 * nobody entered a tournament to watch that.
 *
 * What this replaces is the one-ply test, which was the best available before
 * and is strictly weaker: it saw a hanging piece and could not see a plan,
 * because a plan is a search. On the ending that ran for a hundred moves
 * without a mate, this finds mate in nine.
 *
 * Scores are in PAWNS, rounded to one decimal, from the mover's point of view.
 * Centipawns are the engine's unit and mean nothing to a reader; "+2.4" is a
 * quantity a chess player already understands.
 *
 * @param {{
 *   rankMoves: Function,
 *   Position: Function,
 *   fen: string,
 *   played?: string[],
 *   depth?: number
 * }} options
 */
export function rankedNotes({ rankMoves, Position, fen, played = [], depth = null }) {
  const board = new Position(fen);
  const ranked = rankMoves(board.state, depth ?? depthFor(fen));

  // THE HARNESS RESOLVES THE CONDITION, so the model never has to. The house
  // rule used to read "if you are ahead on material, do not play it", which
  // asks a model to evaluate something — and a model evaluates out loud. One
  // forfeit in 950 moves came back as "Wait, checking material lead rule — I'",
  // a player narrating the test instead of answering with a move.
  //
  // Whether you are ahead is a fact this file already computes. Working it out
  // here turns a rule into a verdict.
  const { white, black } = materialBalance(fen);
  const mine = board.turn === 0 ? white : black;
  const ahead = mine > (board.turn === 0 ? black : white);

  // Repetition still has to be checked here: it is a fact about the GAME, and
  // the engine only ever sees a position.
  const seen = [];
  if (played.length) {
    try {
      const walk = new Position();
      seen.push(walk.key());
      for (const uci of played) {
        walk.applyUci(uci);
        seen.push(walk.key());
      }
      if (walk.fen() !== fen) seen.length = 0;
    } catch {
      seen.length = 0;
    }
  }

  // A MOVE THAT DRAWS IS WORTH A DRAW, whatever the pieces say.
  //
  // This is the fix for game 20, and the diagnosis is worth keeping. Plumb was
  // +7 - a rook and four pawns against two - and repeated. The harness had done
  // everything right: it computed the material, resolved the condition itself,
  // and labelled the move
  //
  //   e7d7  +7.5 — DRAWS NOW by repetition. DO NOT PLAY
  //
  // Twenty of twenty-three moves were unmarked. It played the marked one.
  //
  // The reason is in that line. The list is ordered by SCORE, and a depth-3
  // search has no idea the position has occurred twice - it sees a rook up and
  // says +7.5, so the drawing move sits at the TOP with the best number while a
  // suffix asks the model to overrule it. We were printing a contradiction and
  // hoping the reader resolved it our way.
  //
  // So the score is corrected instead of annotated. A move that ends the game
  // as a draw is worth 0.0, which is simply true, and it sinks to where a draw
  // belongs when you are winning. The marker stays for the reader; the ORDER
  // now agrees with it.
  const priced = ranked.map((row) => {
    const after = new Position(fen);
    const moved = after.applyUci(row.uci);
    const stalemate = after.isStalemate();
    let repeats = 0;
    if (!stalemate && seen.length) {
      const key = after.key();
      repeats = seen.reduce((n, k) => n + (k === key ? 1 : 0), 0);
    }
    const drawsNow = stalemate || repeats >= 2;
    return { row, moved, stalemate, drawsNow, score: drawsNow ? 0 : row.score };
  });

  // Re-sorted on the corrected score, ties broken by the engine's own order so
  // two runs of this cannot disagree about equal moves.
  priced.sort((a, b) => b.score - a.score || ranked.indexOf(a.row) - ranked.indexOf(b.row));

  return priced.map(({ row, moved, stalemate, drawsNow, score }, place) => {
    let note;
    if (row.mateIn && row.mateIn > 0) note = `MATE IN ${row.mateIn}`;
    else if (row.mateIn && row.mateIn < 0) note = `mated in ${-row.mateIn}`;
    else note = `${score >= 0 ? '+' : ''}${(score / 100).toFixed(1)}`;

    if (stalemate) {
      note += ahead ? ' — STALEMATE, draws now. DO NOT PLAY' : ' — STALEMATE, draws now';
    } else if (drawsNow) {
      // Ruled out only when it throws a game away. Behind or level, a draw by
      // repetition is a legitimate result and taking it is the character's call.
      note += ahead ? ' — DRAWS NOW by repetition. DO NOT PLAY' : ' — DRAWS NOW by repetition';
    }

    return { uci: row.uci, san: moved?.san ?? null, note, score, place, mateIn: row.mateIn };
  });
}

/**
 * What each legal move costs, worked out by the board's own engine.
 *
 * One ply, deliberately. It answers "can the opponent simply take something
 * after this" — the floor a player has to clear to be playing chess at all —
 * and nothing about plans, initiative or compensation, which are the character's
 * business and not the harness's.
 *
 * `Position` is passed in rather than imported so this file stays free of the
 * engine and its tests keep running with no bundler.
 */
/**
 * @param {any} Position
 * @param {string} fen
 * @param {string[]} legalMoves
 * @param {string[]} [played] every UCI move of the game so far, from the start
 */
export function annotateMoves(Position, fen, legalMoves, played = []) {
  const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  // WHAT HAS ALREADY HAPPENED, which the one-ply test cannot see.
  //
  // `new Position(fen)` starts with an empty key history, so on its own it
  // cannot answer "has this position occurred before" - and a harness that
  // cannot answer it hands every character a board where repeating is free.
  // Game 17 drew from plus seventeen because of exactly that: sixteen checks,
  // every one annotated "nothing hangs", because a check never does. The
  // one-ply test measures danger and knows nothing about progress.
  //
  // Collected once per turn as keys rather than by replaying for every
  // candidate move: one pass instead of one per legal move, and the count is
  // all that a third occurrence depends on.
  const seen = [];
  if (played.length) {
    try {
      const from = new Position();
      seen.push(from.key());
      for (const uci of played) {
        from.applyUci(uci);
        seen.push(from.key());
      }
      // A history that does not arrive at the position we were handed is a
      // history of some other game. Better to lose the repetition note than to
      // tell a character something false about the board in front of it.
      if (from.fen() !== fen) seen.length = 0;
    } catch {
      seen.length = 0;
    }
  }
  const timesSeen = (key) => seen.reduce((n, k) => n + (k === key ? 1 : 0), 0);

  const board = (f) => {
    const out = {};
    let rank = 8;
    let file = 0;
    for (const ch of f.split(' ')[0]) {
      if (ch === '/') { rank--; file = 0; continue; }
      if (/\d/.test(ch)) { file += Number(ch); continue; }
      out['abcdefgh'[file] + rank] = ch;
      file++;
    }
    return out;
  };

  return legalMoves.map((uci) => {
    try {
      const before = new Position(fen);
      const moved = before.applyUci(uci);
      const after = before.fen();
      const squares = board(after);

      let worst = 0;
      let by = null;
      for (const reply of before.movesUci()) {
        const target = squares[reply.slice(2, 4)];
        if (!target) continue;
        const attacker = squares[reply.slice(0, 2)];
        const gain = VALUE[target.toLowerCase()] ?? 0;
        const risk = VALUE[attacker.toLowerCase()] ?? 0;
        // Only count it when the trade is not simply bad for them.
        if (gain > worst && gain - risk >= 0) {
          worst = gain;
          by = reply;
        }
      }

      // HOW THE GAME ENDS COMES FIRST, and for a long time it did not come at
      // all. A mate in one was annotated "— nothing hangs", which is true and
      // is the least useful true thing available: identical to every quiet
      // move on the list. Six games were played with mate unmarked.
      //
      // Stalemate matters as much and in the other direction. A player with a
      // queen against a bare king stalemates by accident constantly, and
      // throwing away a won game is a worse outcome than any blunder this
      // function was built to catch.
      if (before.isCheckmate()) {
        return { uci, san: moved?.san ?? null, note: '— CHECKMATE, this wins the game now', worst: 0, repeats: 0, ends: 'mate' };
      }
      if (before.isStalemate()) {
        return { uci, san: moved?.san ?? null, note: '— STALEMATE, this draws the game now', worst: 0, repeats: 0, ends: 'stalemate' };
      }

      // A third occurrence ENDS THE GAME as a draw, whatever the position is
      // worth. Said plainly, because "repeats" is a chess term and "this draws
      // the game now" is what actually follows.
      const again = seen.length ? timesSeen(before.key()) : 0;
      const repeats = again >= 2 ? ' — DRAWS THE GAME NOW by repetition' : again === 1 ? ' — repeats a position' : '';

      const danger =
        worst >= 3
          ? `— loses ${worst >= 9 ? 'the queen' : worst >= 5 ? 'a rook' : 'a piece'} to ${by}`
          : worst > 0
            ? `— drops a pawn to ${by}`
            : '— nothing hangs';

      return { uci, san: moved?.san ?? null, note: `${danger}${repeats}`, worst, repeats: again, ends: null };
    } catch {
      return { uci, san: null, note: '', worst: 0, repeats: 0 };
    }
  });
}

/**
 * Pull a move out of whatever came back.
 *
 * Forgiving about shape, strict about ambiguity. "e2e4", "e2e4." and "I play
 * e2e4" all mean the same thing and there is no reason to spend an attempt on
 * punctuation. But "not e2e4, I play d2d4" names TWO legal moves, and a harness
 * that picked one would be guessing at which move a player meant — with real
 * money and a permanent record on the other side of the guess.
 *
 * So: exactly one distinct legal move mentioned, or nothing.
 */
/**
 * One move, from one character, for one position.
 *
 * `ask` is the model call, injected. `position` is what `replay()` returned, so
 * the legal moves are the board's own and not a second implementation - the
 * whole point of bundling the engine rather than reimplementing it.
 *
 * Throws when a character cannot produce a legal move in MAX_ATTEMPTS. That is
 * deliberate and it is not a crash: a character that will not play is a
 * forfeit, and the alternative - broadcasting a guess - spends the entrant's
 * money on a submission every reader will skip.
 */
/**
 * @param {{ character: any, position: any, ask: any,
 *           annotations?: Array<{ uci: string, san?: string, note?: string }> | null,
 *           attempts?: number }} options
 */
export async function chooseMove({
  character,
  position,
  ask,
  annotations = null,
  attempts = MAX_ATTEMPTS
}) {
  const { fen, legalMoves, turn } = position;
  const history = position.history ?? [];

  if (!Array.isArray(legalMoves) || legalMoves.length === 0) {
    throw new WizardSafetyError(
      `no legal moves in this position, so there is nothing for ${character.name} to choose.`
    );
  }

  let request = buildRequest({ character, fen, history, legalMoves, turn, annotations });
  const refusals = [];

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const reply = await ask({ system: SYSTEM_PROMPT, user: request, model: character.model });
    const move = extractMove(reply, legalMoves, annotations);
    if (move) return { move, attempts: attempt, refusals };

    // Kept for the record, scrubbed because a model's reply is text this harness
    // did not write and is about to log.
    refusals.push(scrub(String(reply ?? '').slice(0, 120)));
    request =
      `${request}\n\nThat reply was not one of the legal moves, or named more than one. ` +
      `Reply with exactly one move from the list and nothing else.`;
  }

  // MARKED, not string-matched. The caller resigns on chain for this and only
  // this, and every other way a move can fail must not reach that branch: a
  // rate limit, a dead API, a broadcast that failed, a crashed harness. Those
  // are the tournament's problems and are fixed by running it again. THIS one
  // is the character's problem, and running it again produces the same answer.
  //
  // A string match would have quietly become a resignation the day somebody
  // reworded this message.
  const forfeit = new WizardSafetyError(
    `${character.name} did not give a legal move in ${attempts} attempts: ${refusals.join(' | ')}`
  );
  forfeit.forfeit = true;
  forfeit.character = character.name;
  throw forfeit;
}

/**
 * The other account: a Claude subscription, spent through Claude Code.
 *
 * WHY A SUBPROCESS AND NOT A POST. A subscription is not an API credential and
 * has no header you can send. `/v1/messages` only knows about Developer
 * Platform organisations, so a plan that is 5% used cannot pay for a request
 * made that way — it will be refused for credit it was never going to have.
 * Claude Code is the supported way to spend the plan, so a move is chosen by
 * running it.
 *
 * Constrained hard, because the default shape of that tool is an agent with a
 * filesystem and this needs a sentence:
 *
 *   --allowed-tools ""     no tools. It answers from the position or not at all.
 *   --setting-sources ""   no user, project or local settings, so a CLAUDE.md
 *                          sitting in the repo cannot reach into a chess move.
 *   --strict-mcp-config    no MCP servers.
 *   cwd: a neutral dir     nothing to read even if the above ever softened.
 *
 * The prompt goes over STDIN, never argv. A personality is text an entrant
 * wrote, it can be thousands of characters, and argv has a length limit that
 * would turn a long entry into a crash rather than a move.
 *
 * SLOWER PER MOVE THAN THE API, AND IT DOES NOT MATTER: about five seconds
 * against a chain that takes twelve to confirm one. The bottleneck is
 * unchanged.
 */
/**
 * @param {{ exec?: ((args: string[], input: string) => Promise<string>) | null,
 *           cwd?: string }} [options]
 */
export function claudeCodeAsker({ exec = null, cwd = tmpdir() } = {}) {
  const run =
    exec ??
    ((args, input) =>
      new Promise((resolve, reject) => {
        const child = execFile(
          'claude',
          args,
          { cwd, timeout: 180_000, maxBuffer: 8 * 1024 * 1024 },
          (error, stdout, stderr) => {
            if (error) {
              // scrub, because a failure can echo the prompt back, and the
              // prompt is an entrant's text.
              reject(new Error(scrub(`claude -p failed: ${stderr || error.message}`)));
              return;
            }
            resolve(String(stdout));
          }
        );
        child.stdin.end(input);
      }));

  return async ({ system, user, model }) => {
    const text = await run(
      [
        '-p',
        '--model',
        model,
        // Replaces the coding-agent prompt rather than appending to it. A
        // character's personality is the whole of who is playing.
        '--system-prompt',
        system,
        '--allowed-tools',
        '',
        '--setting-sources',
        '',
        '--strict-mcp-config'
      ],
      user
    );
    return text.trim();
  };
}

/**
 * The real model call.
 *
 * No SDK: this is one POST, and a dependency in a project that keeps them
 * countable should buy more than that. The key is read by the caller from the
 * env file and passed in, so nothing here reaches for a global.
 */
export function anthropicAsker({ apiKey, fetchImpl = fetch }) {
  if (!apiKey) {
    throw new WizardSafetyError(
      'no credentials. Either put ANTHROPIC_API_KEY in harness/wizards/.env.wizards ' +
        '(gitignored, mode 600), or run on a Claude subscription with --via-claude-code.'
    );
  }

  // BOTH OF THESE BILL THE SAME ACCOUNT. That is worth saying plainly, because
  // a day was spent on the assumption that they did not.
  //
  // An `sk-ant-` key and an `sk-ant-oat01-` token from `ant auth login` are two
  // credentials for one Developer Platform organisation, and they draw on the
  // same prepaid credit balance. `ant` is the Console's CLI; its OAuth scopes
  // name an org and a workspace. If the key is refused for want of credit, the
  // token is refused for want of the same credit.
  //
  // A Claude subscription is a DIFFERENT account, and nothing here reaches it.
  // What spends a subscription is Claude Code — see `claudeCodeAsker` below.
  return async ({ system, user, model }) => {
    const response = await fetchImpl(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        // Thinking is left ON — the default on current models — and reined in
        // with effort instead. Disabling it is the worse lever: on Opus 5 a
        // thinking-off request can write a tool call into its visible text or
        // leak internal tags, and `low` already buys most of the saving without
        // either. It is also what makes the hard positions playable at all.
        output_config: { effort: EFFORT },
        system,
        messages: [{ role: 'user', content: user }]
      })
    });
    if (!response.ok) {
      // scrub, because an error body can echo a request header back at you.
      throw new Error(scrub(`the model answered ${response.status}: ${await response.text()}`));
    }
    const body = await response.json();
    return body?.content?.[0]?.text ?? '';
  };
}

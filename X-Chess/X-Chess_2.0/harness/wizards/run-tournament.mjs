#!/usr/bin/env node
// Run a tournament: six characters, a double round robin, one move at a time.
//
//   node harness/wizards/run-tournament.mjs                 dry: the schedule and what it costs
//   node harness/wizards/run-tournament.mjs --live          play it
//   node harness/wizards/run-tournament.mjs --round 4       one round
//   node harness/wizards/run-tournament.mjs standings       read the table off the chain
//   node harness/wizards/run-tournament.mjs fees            what each fee actually bought
//
// Dry by default, like everything else here, and for the same reason: every act
// spends real STX and none of it can be undone.
//
// WHAT PACES THIS IS THE CHAIN, not a --pace flag. A move cannot be chosen until
// the previous one has landed, because a character choosing against a stale
// position is choosing in a game that no longer exists. So each game is strictly
// sequential and takes as long as its moves take to confirm - roughly twenty
// minutes for a short one. The three games of a round run alongside each other,
// which is exactly as much parallelism as the nonce rule allows: three games,
// six characters, nobody signing twice at once.
//
// RESUME IS FROM THE CHAIN AND NEEDS NO FILE. A round that died halfway left its
// games on chain, and they are found by matching the rules, which name both
// sides. Re-running is the correct response to any failure here.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Cl, Pc, PostConditionMode } from '@stacks/transactions';

import {
  ALLOWED_CONTRACT,
  DEFAULT_SPEND_CAP_USTX,
  MINER_FEE_USTX,
  WizardSafetyError,
  addressEnvName,
  keyEnvName,
  looksLikeMainnetAddress,
  scrub
} from './wizards-core.mjs';
import { PERSONALITIES, personalityNamed } from './personalities.mjs';
import { anthropicAsker, chooseMove, claudeCodeAsker, rankedNotes } from './chooser.mjs';
import { adjudicate, adjudicationReason } from './adjudicate.mjs';
import { readLedger, summarise } from './fee-log.mjs';
import { INSCRIPTION, buildSkill, fetchInscribedSkill, sha256 } from '../skill/build-skill.mjs';
import {
  assertNoDoubleBooking,
  doubleRoundRobin,
  findByRulesHash,
  findExisting,
  planTournament,
  roundRobin,
  standingsFrom
} from './tournament.mjs';
import {
  api,
  balanceOf,
  loadProtocol,
  nextNonce,
  readOnly,
  readOpenFee,
  send,
  settle,
  sendClimbing,
  ustx,
  wizardRules
} from './play.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(HERE, '.env.wizards');
const [CONTRACT_ADDRESS, CONTRACT_NAME] = ALLOWED_CONTRACT.split('.');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LIVE = process.argv.includes('--live');
const FORMAT = arg('format', 'double-round-robin');


/**
 * Whether a character that cannot play concedes on chain.
 *
 * On by default, because the alternative is what game 12 did: exit, and leave a
 * live game waiting for a move that is never coming, with nothing on chain to
 * say why. A resignation is the honest end — a real result anybody can derive.
 *
 * `--no-resign` is for debugging a chooser, where you want the position kept
 * exactly as it was rather than ended under you.
 */
const RESIGN_ON_FORFEIT = !process.argv.includes('--no-resign');

/**
 * Run every character on one model, whatever their entry says.
 *
 * A TUNING TOOL, AND IT HAS TO ANNOUNCE ITSELF. An entry names its model
 * because that is the part of a player nobody can inscribe — you can commit a
 * prompt, not weights — so a run that quietly substituted a different one would
 * produce a result that does not match the entries it claims to be between.
 *
 * For a real tournament this flag should not be used. For the exhibition it is
 * how two models get compared on the same characters, same annotation, same
 * positions — which is the only way to find out whether the extra tier is
 * paying for anything. So it is allowed, and it is printed in the header of
 * every run that uses it.
 */
const MODEL_OVERRIDE = arg('model');

/**
 * Spend the Claude subscription instead of Developer Platform credits.
 *
 * OFF BY DEFAULT AND NAMED IN THE HEADER, because it changes which account a
 * run empties. See `credentials()` for why the two cannot be told apart from
 * the error message alone.
 */
const VIA_CLAUDE_CODE = process.argv.includes('--via-claude-code');

/**
 * Play the games a manifest names, rather than pairings this script invented.
 *
 * THE INVERSION THAT MAKES A TOURNAMENT COMMITTED. Without it the runner decides
 * who plays whom and a manifest is written afterwards to describe what happened
 * — which is a record, not a commitment, and the board labels it `compiled`.
 * With it the manifest is fixed on chain before a move is played, and every
 * pairing was promised in advance.
 *
 * In this mode the runner NEVER OPENS A GAME. A manifest names games by id, so
 * a game it names that does not exist is an error and not an invitation: opening
 * one would create a game the manifest never promised, which is the whole thing
 * this mode exists to prevent. Games are opened first, by `open`, and the ids
 * that produces are what the manifest is built from.
 */
const MANIFEST = arg('manifest');


/**
 * Play from local source instead of the inscription.
 *
 * FOR DEVELOPMENT ONLY, and it announces itself. The default is to run the
 * engine that is on chain, because that is the claim the tournament makes: an
 * entrant can fetch inscription 2991, hash it, and know which engine played
 * every game. A run from local source cannot say that, so it says so instead.
 */
const LOCAL_ENGINE = process.argv.includes('--local-engine');


function env() {
  const found = {};
  try {
    for (const line of readFileSync(ENV_FILE, 'utf8').split('\n')) {
      const at = line.indexOf('=');
      if (at < 1 || line.trim().startsWith('#')) continue;
      found[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    // No file. The dry run works without one, which is what makes it useful
    // before you have a fleet.
  }
  return found;
}

/**
 * The field: a personality, and the wallet that signs for it.
 *
 * An agent with no wallet is still listed, so a dry run can show the whole
 * schedule to somebody who has not generated a fleet yet.
 */
function readField(vars = env(), borrow = {}) {
  const agents = PERSONALITIES.map((character) => {
    // A character may be given a wallet that belongs to somebody else for a
    // one-off game. That is a TEST arrangement and not how a tournament runs:
    // in one the character owns its wallet and the name bought with it. It
    // exists so the first end-to-end run can use wallets that already hold
    // money, rather than making six new ones the answer to "does this work at
    // all".
    const from = borrow[character.id] ?? character.id;
    const key = vars[keyEnvName(from)] ?? null;
    const address = vars[addressEnvName(from)] ?? null;
    if (address && !looksLikeMainnetAddress(address)) {
      throw new WizardSafetyError(`${addressEnvName(from)} is not a mainnet address`);
    }
    return {
      ...character,
      // The entry's own model unless a run explicitly overrides it, which the
      // header then says out loud.
      model: MODEL_OVERRIDE ?? character.model,
      key,
      address,
      borrowedFrom: from === character.id ? null : from,
      ready: Boolean(key && address)
    };
  });
  return { agents, ready: agents.every((a) => a.ready) };
}

const byId = (agents) => Object.fromEntries(agents.map((a) => [a.id, a]));

/**
 * The manifest, read through the same code the board uses.
 *
 * Bundled on the fly rather than reimplemented, for the reason `loadProtocol`
 * gives: a second parser would drift from the one that decides what a reader
 * sees, and the two disagreeing about a tournament is exactly the failure
 * nobody would notice until it mattered.
 */
async function loadManifest(id) {
  const { build } = await import('esbuild');
  const bundle = async (...parts) => {
    const out = await build({
      entryPoints: [join(HERE, '..', '..', ...parts)],
      bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error'
    });
    return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
  };
  const { XtrataReader } = await bundle('packages', 'chain', 'xtrata.ts');
  const { resolveTournament } = await bundle('packages', 'protocol', 'tournament.ts');

  // Paced, because a manifest read is a handful of calls against the same
  // budget the game reads spend from.
  const endpoint = {
    request: async (path, init) => {
      await new Promise((done) => setTimeout(done, 1200));
      return fetch(`https://api.mainnet.hiro.so${path}`, init);
    }
  };
  const resolved = await resolveTournament(Number(id), new XtrataReader({ endpoint }));
  if (!resolved.ok || !resolved.tournament) {
    throw new WizardSafetyError(
      `manifest ${id} is not readable: ${resolved.problems.map((p) => `${p.where} ${p.says}`).join('; ')}`
    );
  }
  return { tournament: resolved.tournament, rootId: resolved.tournamentId };
}

/**
 * Rounds as the manifest states them, in the shape the runner already plays.
 *
 * MATCHED ON ADDRESS, NOT ON NAME. A manifest calls somebody "Mason" and this
 * fleet keys its characters by the id "mason", so a name lookup returns
 * undefined and the run dies mid-round — which the dry run caught before any
 * money moved. Case-folding would paper over it; the real point is that a NAME
 * IS DISPLAY AND AN ADDRESS IS IDENTITY. Two tournaments may call one wallet
 * different things, and neither is who it is.
 */
function roundsFromManifest(tournament, agents) {
  const byAddress = new Map(
    Object.values(agents)
      .filter((a) => a.address)
      .map((a) => [a.address.toUpperCase(), a.id])
  );
  const idFor = (entrantName) => {
    const entrant = tournament.entrants.find((e) => e.name === entrantName);
    const id = entrant && byAddress.get(entrant.address.toUpperCase());
    if (!id) {
      throw new WizardSafetyError(
        `the manifest names "${entrantName}" at ${entrant?.address ?? 'no address'}, and this ` +
          'fleet holds no key for that wallet. A tournament can only be played by whoever can sign for it.'
      );
    }
    return id;
  };

  const byRound = new Map();
  for (const game of tournament.games) {
    const list = byRound.get(game.round) ?? [];
    // `id` is what makes this different from a generated plan: the game is
    // named, so nothing has to be searched for and nothing may be opened.
    list.push({ white: idFor(game.white), black: idFor(game.black), id: game.id });
    byRound.set(game.round, list);
  }
  return [...byRound.keys()]
    .sort((a, b) => a - b)
    .map((number) => ({ number, pairings: byRound.get(number) }));
}

/**
 * Run them all, and let each one fail on its own.
 *
 * A thin `allSettled` that keeps enough of the pairing to say WHICH game
 * stopped — a rejection on its own is an error with no game attached, and
 * "something failed" is not a thing anybody can act on.
 */
async function settleAll(promises) {
  const settled = await Promise.allSettled(promises);
  return settled.map((outcome) =>
    outcome.status === 'fulfilled'
      ? outcome.value
      : { failed: String(outcome.reason?.message ?? outcome.reason).slice(0, 140) }
  );
}

/** Every game on the contract, with the rules that name its players. */
async function readGames() {
  const count = Number((await readOnly('get-game-count')).value);
  const games = [];
  for (let id = 1; id <= count; id++) {
    try {
      const row = (await readOnly('get-game', [Cl.serialize(Cl.uint(id))])).value.value;
      games.push({
        id,
        nextSeq: Number(row['next-seq'].value),
        openedBy: row['opened-by'].value,
        rulesHash: row['rules-hash']?.value?.value ?? null
      });
    } catch {
      // A game that will not read is one we cannot claim as ours, which is the
      // safe way round: worst case a pairing is replayed rather than skipped.
    }
  }
  return games;
}

/**
 * Play one game to its end, or until nothing more can be played.
 *
 * The loop is: read the log, replay it, ask whoever is to move, sign, wait.
 * Reading first every time is what makes this resumable at any point - the
 * position is never carried in a variable across a failure.
 */
async function playGame({ gameId, white, black, replay, ask, budget, Position, rankMoves, expectHash = null }) {
  // REQUIRED, not defaulted to null. A default here is what let fifteen games
  // be played from an unannotated list without one line of output saying so.
  if (!Position || !rankMoves) {
    throw new WizardSafetyError('playGame needs the engine and the search to rank moves');
  }
  // NEVER SUBMIT INTO A GAME WITHOUT CHECKING IT IS OURS.
  //
  // The lookup above is now exact, and this is here anyway — because the
  // lookup was exact-looking last time too. Twenty-eight submissions went into
  // game 1, a game belonging to somebody else, and nothing between the bad
  // match and the chain asked whether the game was the right one.
  //
  // The rules hash on the game row is the answer: it commits white, black and
  // ranked, so a game whose hash is not ours is not ours, whatever the lookup
  // decided. Checked once per game rather than per move, because a game's rules
  // cannot change.
  if (expectHash) {
    const row = (await readOnly('get-game', [Cl.serialize(Cl.uint(gameId))])).value?.value;
    const onChain = String(row?.['rules-hash']?.value?.value ?? '')
      .toLowerCase()
      .replace(/^0x/, '');
    if (onChain !== String(expectHash).toLowerCase().replace(/^0x/, '')) {
      throw new WizardSafetyError(
        `game ${gameId} commits to rules ${onChain.slice(0, 16)}… but this pairing is ` +
          `${String(expectHash).slice(0, 16)}…. Refusing to play into a game that is not ours.`
      );
    }
  }

  // DESTRUCTURED. `wizardRules` returns { rules, hash }, and passing the wrapper
  // to replay hands it an object with no white, no black and no protocol - which
  // normalises to an OPEN BOARD. The game would have run, looked fine, and
  // refereed nothing: no turn alternation, either character free to move at any
  // time, and the position drifting away from what the committed rules describe.
  const { rules } = await wizardRules(white.address, black.address);
  let lastLength = -1;

  for (;;) {
    let entries = await readEntries(gameId);

    // ASK AGAIN BEFORE CONCLUDING IT DID NOT. An indexer that has not caught up
    // returns a short log, and a short log is indistinguishable from a lost move
    // on a single read. That mistake stopped game 35 at 94 entries when the
    // chain held 95, and game 40 at 3 when it held 4 — both fine, both stopped.
    //
    // The earlier fix polled only after a superseded rung. Game 40 came through
    // the ordinary success path and never touched that branch, which is how one
    // more read at the right place would have saved it. So the waiting belongs
    // HERE, next to the question it answers, and covers every route in.
    if (lastLength > 0 && entries.length <= lastLength) {
      const until = Date.now() + 4 * 60_000;
      while (Date.now() < until && entries.length <= lastLength) {
        await new Promise((done) => setTimeout(done, 15_000));
        try {
          entries = await readEntries(gameId);
        } catch {
          // A read that failed says nothing about the log. Ask again.
        }
      }
      if (entries.length > lastLength) {
        console.log(`  game ${gameId}: the log caught up (${entries.length} entries)`);
      }
    }

    // THE LOG MUST GROW. Every pass sends exactly one submission and waits for
    // it, so the next read must see more than the last one did. When it does
    // not, something is wrong in a way this loop cannot see - a misparsed page,
    // a submission the contract stored but replay throws away, a wallet signing
    // into the wrong game - and the correct response to all of them is to stop.
    //
    // Without this, game 12 played e2e4 five times. Each one was accepted by the
    // contract, skipped by replay as landing on an empty square, and charged.
    // A loop that cannot tell it is making no progress will spend right up to
    // its cap making none.
    if (entries.length <= lastLength) {
      throw new WizardSafetyError(
        `game ${gameId}: the log did not grow after a submission (${entries.length} entries, ` +
          `was ${lastLength}). Stopping rather than playing the same move again.`
      );
    }
    lastLength = entries.length;

    const state = replay(entries, { rules });

    if (state.status !== 'live') {
      console.log(`  game ${gameId}: ${state.result ?? 'over'}`);
      return state.result ?? null;
    }
    if (!state.legalMoves.length) {
      console.log(`  game ${gameId}: no legal moves, stopping`);
      return null;
    }

    // ADJUDICATION IS NOT WIRED IN, DELIBERATELY. See adjudicate.mjs: the
    // sustained-lead rule was written, replayed against the games that
    // motivated it, and got game 18 backwards — it would have called 1-0 to
    // White at move 55, and White was losing by move 68. Left unconnected until
    // the rule is one the evidence supports.
    const mover = state.turn === 'white' ? white : black;

    // WHAT EACH MOVE COSTS, worked out here rather than in the model's head.
    //
    // Measured over twenty-four positions from three real games: 29% of moves
    // hang a piece from a plain list, 8% from an annotated one. Effort and
    // prompting moved neither number; this moved both.
    //
    // It was written, tested, and then not connected — `Position` arrived here
    // and went nowhere, so every game since has been played from the plain
    // list, and nothing said so because a worse move is still a legal move.
    // RANKED BY THE SEARCH, not by a one-ply material test.
    //
    // The one-ply version annotated a checkmate as "nothing hangs" and could not
    // form a plan, because a plan IS a search. On the ending that ran a hundred
    // moves on chain without a mate and cost 1.008 STX to concede by hand, the
    // search mates in nine plies.
    //
    // Every legal move still comes back, scored, in engine order. A character
    // chooses among them by style; the list informs and never decides.
    const history = state.accepted.filter((e) => e.kind === 'move').map((e) => e.uci);
    const annotations = rankedNotes({ rankMoves, Position, fen: state.fen, played: history });

    let chosen;
    try {
      chosen = await chooseMove({
        character: mover,
        position: {
          fen: state.fen,
          legalMoves: state.legalMoves,
          turn: state.turn,
          history
        },
        annotations,
        ask
      });
    } catch (error) {
      // A character that cannot play RESIGNS, rather than leaving the game
      // open forever. Game 12 is why: 46 good moves, then Ledger offered a
      // rook move through its own bishop three times, the runner exited, and
      // the game sat on chain as "black to move" with nobody coming. Nothing
      // recorded what had happened, because nothing had — the forfeit existed
      // only in an exit code.
      //
      // A resignation is a real event with a real result. The leaderboard
      // counts it, replay derives it, and a spectator sees a finished game.
      if (!error?.forfeit) throw error;
      // WHAT IT ACTUALLY SAID, carried into the log and the console. The error
      // has the refusals and this used to drop them for a fixed phrase, so the
      // most diagnostic fact about a forfeit — the reply that caused it — was
      // thrown away at the moment it was recorded.
      //
      // Game 29 cost a live game to find out, and the answer was worth having:
      // Ledger wanted e5, the top-ranked move, and wrote "e5e5".
      await resign({ gameId, mover, rules, budget, why: scrub(String(error.message)) });
      return state.turn === 'white' ? '0-1' : '1-0';
    }

    console.log(`  game ${gameId}: ${mover.name} plays ${chosen.move}`);
    const sent = await sendClimbing({
      wizard: mover,
      functionName: 'submit',
      functionArgs: [Cl.uint(gameId), Cl.stringAscii(chosen.move)],
      spendUstx: 0n,
      postConditions: [],
      spent: budget.spent,
      cap: budget.cap,
      label: `game ${gameId}: `,
      // The ledger can only be read per game if the game is written down. Every
      // row from round 3 says `game: null`, so the fee analysis had to attribute
      // broadcasts by wallet and clock instead of just reading them.
      game: gameId
    });
    budget.spent = sent.spentAfterUstx;

    const status = sent.status;

    // REPLACED BY OUR OWN LADDER IS NOT A FAILURE. `dropped_replace_by_fee`
    // means a higher rung took this transaction's place on the same nonce,
    // which is the fee ladder working exactly as designed. The move is very
    // likely on chain under the replacement's txid.
    //
    // Round 3 died here after 82 moves in game 19 and 47 in game 20, on a
    // status that meant "the thing you asked for happened, by another route".
    //
    // The right response is the one the loop already implements: go round
    // again and READ. The log is the record. If the move landed, the next pass
    // sees it and plays on; if it did not, the growth guard at the top refuses
    // to play the same move twice and stops us loudly.
    if (status === 'dropped_replace_by_fee' || status === 'superseded') {
      console.log(`  game ${gameId}: ${chosen.move} was settled by a different rung — re-reading`);
      // WAIT FOR THE CONDITION, NOT FOR A DURATION. This slept forty-five
      // seconds and then looked once, which is a guess about indexing lag
      // dressed up as a fix. Game 35 of round 8 is what a wrong guess costs:
      // the move HAD landed, the log read 94 when the guard wanted 95, and the
      // run stopped on a game that was fine. It reads 95 now.
      //
      // The growth guard itself stays exactly as it is — refusing to play the
      // same move twice is the one thing here that must never soften. What was
      // wrong is asking it a question before the answer could exist.
      const wasAt = entries.length;
      const until = Date.now() + 4 * 60_000;
      while (Date.now() < until) {
        await new Promise((done) => setTimeout(done, 15_000));
        try {
          if ((await readEntries(gameId)).length > wasAt) break;
        } catch {
          // A read that failed says nothing about the log. Ask again.
        }
      }
      continue;
    }

    if (status !== 'success') {
      // A TIMEOUT IS NOT A REJECTION, and saying so matters: the move may well
      // land after this. Game 16's did, twenty-five minutes after a ten-minute
      // wait gave up on it. Re-running the round is the right response either
      // way — it re-reads the log, and a move that landed is simply there.
      const advice =
        status === 'timed out'
          ? ' — it may still land. Re-run this round; the log is the record, not this process.'
          : '';
      throw new WizardSafetyError(`game ${gameId}: ${chosen.move} ${status} (${sent.txid})${advice}`);
    }
  }
}

/**
 * Concede, on chain, because this character cannot produce a legal move.
 *
 * PERMANENT AND UNDOABLE, so it is fenced by three things rather than one.
 *
 * `--live`, like every other spend — inherited, since `send` refuses a dry run
 * before this function can do anything.
 *
 * `--no-resign`, because somebody debugging a chooser wants the run to stop and
 * the position preserved, not a game ended under them.
 *
 * And EVENTS-V1, checked against the game's own committed rules. A game that
 * did not agree to resignations reads `resgn` as a move, and as a move it is
 * malformed: stored, charged, and skipped by every reader. Sending one there
 * would be the exact waste the board's eligibility gate was rebuilt to stop
 * people doing by hand.
 *
 * No new permission is needed and that is worth saying out loud: a resignation
 * IS a `submit`, which the fleet could already call, on the one contract it
 * could already call. The safety boundary does not widen here.
 */
async function resign({ gameId, mover, rules, budget, why = 'no legal move in 3 attempts' }) {
  if (!RESIGN_ON_FORFEIT) {
    throw new WizardSafetyError(
      `game ${gameId}: ${mover.name} would resign (${why}) and --no-resign is set. ` +
        'The game is left open.'
    );
  }
  if (rules.eventsProtocol !== 'events-v1') {
    throw new WizardSafetyError(
      `game ${gameId}: ${mover.name} would resign (${why}), and this game did not agree ` +
        'to resignations — `resgn` would be stored, charged, and skipped. Left open.'
    );
  }

  console.log(`  game ${gameId}: ${mover.name} resigns — ${why}`);
  const sent = await sendClimbing({
    wizard: mover,
    functionName: 'submit',
    functionArgs: [Cl.uint(gameId), Cl.stringAscii('resgn')],
    spendUstx: 0n,
    postConditions: [],
    spent: budget.spent,
    cap: budget.cap,
    label: `game ${gameId}: `,
    game: gameId
  });
  budget.spent = sent.spentAfterUstx;

  const status = sent.status;
  if (status !== 'success') {
    throw new WizardSafetyError(`game ${gameId}: resignation ${status} (${sent.txid})`);
  }
  console.log(`  game ${gameId}: resignation confirmed (${sent.txid})`);
}

async function readEntries(gameId) {
  // `get-page`, which is what the contract actually has. This asked for
  // `get-entries` for its whole first draft - a function that does not exist -
  // and would have failed on the first move of the first live game. The board
  // reads the same function; there is only one way to page this log.
  const out = [];
  for (let start = 0; ; start += 50) {
    const page = await readOnly('get-page', [
      Cl.serialize(Cl.uint(gameId)),
      Cl.serialize(Cl.uint(start))
    ]);

    // THROWS RATHER THAN RETURNING NOTHING, and that is the whole lesson of
    // game 12. This read `page.list`, which is undefined - the list is at
    // `page.value` - so it returned [] every time. An empty log is
    // indistinguishable from a new game, so replay said "white to move from the
    // start" after every move, Gambit chose e2e4 again, and it was broadcast and
    // PAID FOR five times before anybody noticed.
    //
    // A read that cannot be parsed is not an empty game. Saying so out loud is
    // the difference between one confusing error and five wasted fees.
    if (!Array.isArray(page?.value)) {
      throw new WizardSafetyError(
        `get-page(${gameId}, ${start}) did not come back as a list. Refusing to treat an ` +
          'unreadable log as an empty one, which is how the same move gets played twice.'
      );
    }

    const rows = page.value.filter((row) => row?.value);
    for (const row of rows) {
      const fields = row.value?.value;
      const mv = fields?.value?.value;
      if (typeof mv !== 'string') {
        throw new WizardSafetyError(
          `game ${gameId} entry ${out.length} has no readable value. Same reason as above: a ` +
            'submission this cannot read must not silently become one that never happened.'
        );
      }
      out.push({
        mv,
        sender: fields.sender?.value ?? null,
        height: Number(fields.height?.value ?? 0),
        seq: out.length
      });
    }
    if (rows.length < 50) break;
  }
  return out;
}

/**
 * One game, two characters, end to end.
 *
 * The thing you run before thirty of them. It proves the parts that only a real
 * game can: that a model handed the board's legal moves answers with one of
 * them, that the answer signs and lands, and that replay makes the same game of
 * it afterwards.
 *
 *   node harness/wizards/run-tournament.mjs game --white gambit --black ledger \
 *     --white-wallet wizard-1 --black-wallet wizard-2 --live
 */
async function oneGame({ openFee }) {
  const white = personalityNamed(arg('white', 'gambit')).id;
  const black = personalityNamed(arg('black', 'ledger')).id;
  if (white === black) {
    throw new WizardSafetyError('a character cannot play itself; --white and --black must differ.');
  }

  const borrow = {};
  if (arg('white-wallet')) borrow[white] = arg('white-wallet');
  if (arg('black-wallet')) borrow[black] = arg('black-wallet');

  const agents = byId(readField(env(), borrow).agents);
  const w = agents[white];
  const b = agents[black];

  console.log(`one game: ${w.name} (white) v ${b.name} (black)`);
  for (const agent of [w, b]) {
    const where = agent.borrowedFrom ? `  [wallet borrowed from ${agent.borrowedFrom}]` : '';
    console.log(`  ${agent.name.padEnd(9)} ${agent.address ?? 'NO WALLET'}${where}`);
  }
  const cost = openFee + MINER_FEE_USTX * 46n;
  console.log(`  costs about ${ustx(cost)} for a 45 move game\n`);

  if (!LIVE) {
    console.log('Dry run. Nothing was signed and nothing was sent. Add --live to play it.');
    if (!w.ready || !b.ready) {
      console.log('\nBoth characters need a wallet before --live. Either generate one each, or');
      console.log('lend them existing ones with --white-wallet and --black-wallet.');
    }
    return;
  }
  if (!w.ready || !b.ready) {
    throw new WizardSafetyError(
      `no wallet for ${[w, b].filter((a) => !a.ready).map((a) => a.id).join(' and ')}.`
    );
  }

  const ask = credentials();
  const { replay } = await loadReplay();
  const { Position } = await loadEngine();
  const { rankMoves } = await loadSkill();
  const budget = { spent: 0n, cap: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))) };

  const gameId = arg('game')
    ? Number(arg('game'))
    : await openGame({ white: w, black: b, openFee, budget });
  console.log(`game ${gameId}\n`);

  const result = await playGame({ gameId, white: w, black: b, replay, ask, budget, Position, rankMoves });
  console.log(`\nresult ${result ?? 'unfinished'}, spent ${ustx(budget.spent)}\n`);
}


/**
 * What every fee we have offered actually bought, read back off the chain.
 *
 * THE FEEDBACK HALF OF THE LADDER. The rungs started as a guess from one
 * afternoon's mempool sample; this is how they stop being one. Offer the bottom
 * rung a few hundred times, then look at what fraction a miner took and how
 * long they waited, and move the rungs to fit.
 *
 * Reads the local ledger for what was offered and when, and the chain for
 * whether it landed and in which block. Neither half can answer alone: the
 * chain does not record a broadcast time, and a local log must not be trusted
 * about outcomes.
 */
async function fees() {
  const entries = readLedger();
  if (!entries.length) {
    console.log('\nNothing recorded yet. Fees are logged as moves are broadcast.\n');
    return;
  }

  console.log(`\n${entries.length} broadcasts recorded. Reading each back off the chain…\n`);
  const rows = await summarise(entries, async (txid) => {
    try {
      const body = await api(`/extended/v1/tx/0x${txid}`);
      return { status: body.tx_status ?? 'unknown', blockTime: body.block_time ?? null };
    } catch {
      return { status: 'not found', blockTime: null };
    }
  });

  console.log('   fee   offered  mined  replaced   landed   median wait   90th');
  for (const r of rows) {
    console.log(
      `  ${String(r.fee).padStart(5)}  ${String(r.offered).padStart(7)}  ${String(r.mined).padStart(5)}` +
        `  ${String(r.replaced).padStart(8)}  ${String(r.landedPct === null ? '-' : r.landedPct + '%').padStart(7)}` +
        `  ${String(r.medianWait === null ? '-' : r.medianWait + 's').padStart(11)}` +
        `  ${String(r.p90Wait === null ? '-' : r.p90Wait + 's').padStart(5)}`
    );
  }

  const bottom = rows[0];
  console.log('');
  if (bottom && bottom.landedPct !== null && bottom.offered >= 20) {
    if (bottom.landedPct >= 80) {
      console.log(`  The bottom rung (${bottom.fee}) lands ${bottom.landedPct}% of the time.`);
      console.log('  There is room to try lower.');
    } else if (bottom.landedPct < 40) {
      console.log(`  The bottom rung (${bottom.fee}) only lands ${bottom.landedPct}% of the time,`);
      console.log('  so most moves are paying for two signatures to reach the rung above.');
      console.log('  Raise it, or lengthen FEE_BUMP_AFTER_MS to give it longer.');
    } else {
      console.log(`  The bottom rung (${bottom.fee}) lands ${bottom.landedPct}% of the time —`);
      console.log('  roughly where a ladder wants to be. Most moves cheap, some climb.');
    }
  } else {
    console.log('  Too few at the bottom rung to conclude anything yet. Keep playing.');
  }
  console.log('');
}

async function main() {
  const command = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'play';
  const field = readField();
  const ids = field.agents.map((a) => a.id);

  console.log(`\nX Chess tournament — ${LIVE ? 'LIVE' : 'dry run, nothing is sent'}`);
  console.log(`contract  ${ALLOWED_CONTRACT}`);

  let openFee = 10_000n;
  try {
    openFee = await readOpenFee();
  } catch {
    console.log('(could not read the open fee; using the last known default)');
  }

  // THE MANIFEST DECIDES, when there is one. Otherwise this script does, which
  // is how every tournament so far was run and is why they can only ever be
  // described afterwards.
  let manifest = null;
  let plan;
  if (MANIFEST) {
    const loaded = await loadManifest(MANIFEST);
    manifest = loaded.tournament;
    const rounds = roundsFromManifest(manifest, byId(field.agents));
    // The same shape planTournament returns, so the header and the play loop
    // below cannot tell the two apart — which is the point. Nothing about
    // PLAYING a tournament should depend on where the pairings came from.
    plan = {
      format: manifest.format,
      rounds,
      plannedRounds: rounds.length,
      plannedGames: manifest.games.length,
      perGameUstx: MINER_FEE_USTX * 45n,
      chainUstx: BigInt(manifest.games.length) * MINER_FEE_USTX * 45n,
      namesUstx: 0n,
      totalUstx: BigInt(manifest.games.length) * MINER_FEE_USTX * 45n
    };
    console.log(`\nmanifest  ${loaded.rootId} — ${manifest.name}`);
    console.log(`          games are NAMED, so none will be opened by this run`);
  } else {
    plan = planTournament({
      ids,
      format: FORMAT,
      openFeeUstx: openFee,
      minerFeeUstx: MINER_FEE_USTX,
      buyNames: false
    });
  }

  console.log(`format    ${plan.format}`);
  console.log(`field     ${ids.join(', ')}`);
  console.log(`open fee  ${ustx(openFee)}`);
  console.log(
    `model     ${MODEL_OVERRIDE ?? PERSONALITIES[0].model}${
      MODEL_OVERRIDE ? '   (OVERRIDDEN — entries name ' + PERSONALITIES[0].model + ')' : ''
    }`
  );
  console.log(
    `forfeits  ${
      RESIGN_ON_FORFEIT
        ? 'a character with no legal move RESIGNS on chain (permanent)'
        : 'left open, --no-resign is set'
    }`
  );
  console.log(
    `schedule  ${plan.plannedRounds} rounds, ${plan.plannedGames} games, ` +
      `${ustx(plan.chainUstx)} of chess\n`
  );

  if (command === 'game') {
    await oneGame({ openFee });
    return;
  }

  // Concede one game, by hand, from outside a run.
  //
  //   node harness/wizards/run-tournament.mjs concede --game 18 --side white --live
  //
  // THE ESCAPE HATCH FOR A GAME THAT CANNOT END ITSELF, and it exists because
  // game 18 needed it. Two hundred moves in, White had a bare king against a
  // queen and Black could not deliver mate: 1.008 STX of miner fees and no
  // prospect of a result. Nothing in the harness could end that. The fifty-move
  // rule would have, eventually, and only after another forty moves of it.
  //
  // Deliberately manual. It is a permanent on-chain concession that hands
  // somebody a win, so it is a thing a person does on purpose, with the losing
  // side named on the command line — not something a run decides while nobody
  // is watching. The automatic version of this is `adjudicate.mjs`, which is
  // written, disconnected, and stays that way until its rule is one the
  // evidence supports.
  if (command === 'concede') {
    const gameId = Number(arg('game'));
    const side = arg('side');
    if (!gameId || (side !== 'white' && side !== 'black')) {
      throw new WizardSafetyError('concede needs --game <id> and --side white|black');
    }

    const games = await readGames();
    const row = games.find((g) => g.id === gameId);
    if (!row) throw new WizardSafetyError(`game ${gameId} is not on the contract`);

    // The same rules-hash check every submission goes through. A concession is
    // the one submission that cannot be taken back, so it is the last place to
    // start trusting a game id typed on a command line.
    const agents = byId(field.agents);
    let found = null;
    for (const round of plan.rounds) {
      for (const pairing of round.pairings) {
        const { hash } = await wizardRules(
          agents[pairing.white]?.address,
          agents[pairing.black]?.address
        );
        if (hash === row.rulesHash) found = pairing;
      }
      if (found) break;
    }
    if (!found) {
      throw new WizardSafetyError(
        `game ${gameId} does not match any pairing in this tournament. Refusing to ` +
          'concede a game that may belong to somebody else.'
      );
    }

    const conceding = agents[side === 'white' ? found.white : found.black];
    const { rules } = await wizardRules(agents[found.white].address, agents[found.black].address);
    console.log(`
game ${gameId}: ${found.white} (white) v ${found.black}`);
    console.log(`${conceding.name} concedes, making it ${side === 'white' ? '0-1' : '1-0'}`);
    if (!LIVE) {
      console.log('dry run — nothing sent. Add --live to mean it.');
      return;
    }
    await resign({
      gameId,
      mover: conceding,
      rules,
      budget: { spent: 0n, cap: DEFAULT_SPEND_CAP_USTX },
      why: 'conceded by hand: the game could not reach a result'
    });
    return;
  }

  if (command === 'fees') {
    await fees();
    return;
  }

  if (command === 'open') {
    await openOnly({ field, plan, openFee, manifest });
    return;
  }

  if (command === 'standings') {
    const games = await readGames();
    console.log(`${games.length} games on the contract. Standings need replay per game.\n`);
    return;
  }


  for (const round of plan.rounds) {
    assertNoDoubleBooking(round);
    const only = arg('round');
    const mark = only && Number(only) !== round.number ? '   (skipped)' : '';
    console.log(`round ${String(round.number).padStart(2)}${mark}`);
    for (const p of round.pairings) {
      console.log(`  ${p.white.padEnd(9)} (white)  v  ${p.black}`);
    }
  }

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed and nothing was sent.');
    console.log('Add --live to play. Every game above is real and none of it can be undone.');
    if (!field.ready) {
      const missing = field.agents.filter((a) => !a.ready).map((a) => a.id);
      console.log(`\nNo wallet yet for: ${missing.join(', ')}.`);
      console.log('Generate a fleet before --live; the schedule above needs none.');
    }
    return;
  }

  if (!field.ready) {
    throw new WizardSafetyError(
      `no wallet for ${field.agents.filter((a) => !a.ready).map((a) => a.id).join(', ')}. ` +
        'Every character in the field needs one before anything is signed.'
    );
  }

  const ask = credentials();
  const { replay } = await loadReplay();
  const { Position } = await loadEngine();
  const { rankMoves } = await loadSkill();
  const agents = byId(field.agents);
  const budget = { spent: 0n, cap: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))) };
  const existing = await readGames();

  /** Rounds that lost a game, so the exit code can say so. */
  const stopped = [];

  for (const round of plan.rounds) {
    if (arg('round') && Number(arg('round')) !== round.number) continue;
    console.log(`\n=== round ${round.number} ===`);

    // The three games of a round, alongside each other. This is the only
    // parallelism here and it is bounded by the nonce rule rather than by taste.
    // SETTLED, NOT ALL. `Promise.all` rejects the moment one game throws, and
    // the other two keep playing into a process that is already exiting.
    //
    // Round 10 is what that costs: game 40 stopped on a lagging indexer, and
    // games 41 and 42 — forty-nine and fifteen moves in, both entirely healthy
    // — were killed mid-move by a failure in a game they share nothing with.
    // Three games at once is the nonce rule, not a transaction; they are
    // independent and should fail independently.
    const played = await settleAll(
      round.pairings.map(async (pairing) => {
        const white = agents[pairing.white];
        const black = agents[pairing.black];

        // BY THE RULES HASH, which is one value per pairing and is on the game
        // row. This used to fabricate white and black onto every game before
        // searching, so every pairing matched the first row and three
        // characters played twenty-eight submissions into a stranger's game.
        const { hash } = await wizardRules(white.address, black.address);

        // A NAMED GAME IS NEVER OPENED AND NEVER SEARCHED FOR. The manifest
        // said which game this is, so the only question is whether that game
        // agrees — and if it does not, something is wrong that opening a new
        // game would paper over. The rules hash is the same check the board
        // does; failing it here costs nothing, and failing it after a
        // submission costs a fee and a permanent entry in a stranger's log.
        let gameId;
        if (pairing.id !== undefined) {
          const row = (await readGames()).find((g) => g.id === pairing.id);
          if (!row) {
            throw new WizardSafetyError(
              `the manifest names game ${pairing.id} and it is not on this contract. ` +
                'Games are opened before a manifest is inscribed, so this manifest describes ' +
                'a tournament that was never set up.'
            );
          }
          if (String(row.rulesHash ?? '').toLowerCase() !== hash.toLowerCase()) {
            throw new WizardSafetyError(
              `game ${pairing.id} committed to different rules than the manifest claims for ` +
                `${pairing.white} v ${pairing.black}. Refusing to play into it.`
            );
          }
          gameId = pairing.id;
        } else {
          const already = findByRulesHash(hash, existing);
          gameId = already?.id ?? (await openGame({ white, black, openFee, budget }));
        }
        try {
          const result = await playGame({
            gameId, white, black, replay, ask, budget, Position, rankMoves, expectHash: hash
          });
          return { gameId, white, black, result };
        } catch (error) {
          // Caught HERE rather than left to settleAll, so the report can name
          // the game and the players. A bare rejection knows neither.
          return { gameId, white, black, failed: String(error?.message ?? error).slice(0, 140) };
        }
      })
    );

    // SAY THE ROUND IS OVER, out loud and in one place.
    //
    // A finished round used to end on a blank line, which in a terminal looks
    // exactly like a round that has hung — and this harness has hung, at
    // length, while printing nothing. Telling the two apart meant reading the
    // mempool. That is a lot to ask of somebody who just wants to know whether
    // to wait.
    console.log(`\n--- round ${round.number} complete ---`);
    if (played.some((game) => game.failed)) stopped.push(round.number);
    for (const game of played) {
      if (game.failed) {
        // Named, not swallowed. A game that stopped is a game somebody has to
        // re-run, and the reason is the only thing that says which.
        console.log(
          `  game ${String(game.gameId ?? '?').padEnd(3)} ${(game.white?.name ?? '').padEnd(8)} v ` +
            `${(game.black?.name ?? '').padEnd(8)} STOPPED — ${game.failed}`
        );
        continue;
      }
      const how = game.result
        ? `${game.result}`
        : 'unfinished — re-run this round, the log is the record';
      console.log(
        `  game ${String(game.gameId).padEnd(3)} ${game.white.name.padEnd(8)} v ` +
          `${game.black.name.padEnd(8)} ${how}`
      );
    }
  }

  console.log(`\nSpent ${ustx(budget.spent)} of ${ustx(budget.cap)}.`);
  console.log('Nothing is running now. A silent terminal from here is finished, not stuck.\n');

  // A STOPPED GAME MUST NOT EXIT ZERO.
  //
  // The bug this run was fixing is a normal outcome reported as a failure. Its
  // mirror arrived with the fix: `Promise.all` used to reject, so a stopped
  // game ended `main` and the process exited 1. `settleAll` cannot reject —
  // that is the whole point — so a round in which every game died was reported
  // to the shell as a success.
  //
  // The summary says STOPPED on screen, which is enough for somebody reading it
  // and no use at all to a `&&`, a loop, or anybody who comes back to a
  // finished terminal and checks. Unfinished stays zero: a game that has not
  // ended is a normal outcome and the log is the record. Stopped is not.
  if (stopped.length) {
    console.error(
      `Round ${stopped.join(', ')} stopped a game. Re-run it — the chain is the ` +
        'record and nothing is replayed.\n'
    );
    process.exitCode = 1;
  }
}

/**
 * Open every game a format calls for, and play none of them.
 *
 * THE ORDER A COMMITTED TOURNAMENT NEEDS, and the step that was missing. A
 * manifest names its games by id; ids do not exist until games are opened; and
 * `provenance` reads a manifest as `committed` only when it was inscribed
 * before the first MOVE. So the sequence is open, build, inscribe, play - and
 * until now the runner could only open a game on its way to playing it, which
 * makes that sequence impossible to carry out.
 *
 * Opening settles nothing. A game with no submissions has no result, no first
 * move and no rating consequence, so this is the one part of a tournament that
 * can be done early without deciding anything about it.
 *
 * IDEMPOTENT, because the alternative is paying twice. Every pairing is looked
 * up by its rules hash first, exactly as the play loop does, so a re-run after
 * a failure opens only what is genuinely missing. That matters more here than
 * anywhere else in this file: a duplicate game is not an error the contract
 * will refuse, it is a second real game that costs a real fee and then sits
 * there looking like the first one.
 */
async function openOnly({ field, plan, openFee, manifest }) {
  if (manifest) {
    // A manifest names games that already exist. Opening more would create a
    // second set nothing refers to, and the play loop would ignore them.
    throw new WizardSafetyError(
      'a manifest names its games, so there is nothing to open. Drop --manifest to set up a new tournament.'
    );
  }
  const rounds = arg('rounds') ? plan.rounds.slice(0, Number(arg('rounds'))) : plan.rounds;
  const pairings = rounds.flatMap((round) => round.pairings.map((p) => ({ ...p, round: round.number })));

  console.log(`\nopening ${pairings.length} games across ${rounds.length} rounds`);
  console.log(`open fee  ${ustx(BigInt(openFee) * BigInt(pairings.length))} total, before miner fees\n`);

  const agents = byId(field.agents);
  const existing = await readGames();
  const found = [];
  for (const pairing of pairings) {
    const white = agents[pairing.white];
    const black = agents[pairing.black];
    if (!white?.address || !black?.address) {
      throw new WizardSafetyError(
        `no wallet for ${!white?.address ? pairing.white : pairing.black}. ` +
          'A game names both addresses in its rules, so it cannot be opened without them.'
      );
    }
    const { hash } = await wizardRules(white.address, black.address);
    const already = findByRulesHash(hash, existing);
    found.push({ ...pairing, white, black, hash, id: already?.id ?? null });
  }

  const missing = found.filter((g) => g.id === null);
  for (const game of found) {
    const where = game.id === null ? 'to open' : `game ${game.id}`;
    console.log(`  round ${String(game.round).padStart(2)}  ${game.white.name.padEnd(8)} v ${game.black.name.padEnd(8)}  ${where}`);
  }

  if (!missing.length) {
    console.log('\nEvery pairing already has a game. Build the manifest next:');
    console.log('  node harness/wizards/build-manifest.mjs --name "…" --format ' + plan.format);
    return;
  }

  if (!LIVE) {
    console.log(`\n${missing.length} still to open. Dry run — nothing was signed.`);
    console.log('Add --live to open them. Opening is permanent and costs the fee above.');
    return;
  }

  const budget = { spent: 0n, cap: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))) };
  const opened = [];
  for (const game of missing) {
    // ONE AT A TIME, not the round-parallel three the play loop uses. That
    // parallelism is bounded by the nonce rule - three games, six characters,
    // nobody signing twice at once - and it does not hold here, because opening
    // is always signed by WHITE and one character is white in several pairings
    // of the same round. Two opens from one wallet at once is a nonce clash.
    const id = await openGame({ white: game.white, black: game.black, openFee, budget });
    opened.push({ ...game, id });
    console.log(`  opened game ${id}  ${game.white.name} v ${game.black.name}`);
  }

  console.log(`\nOpened ${opened.length}. Spent ${ustx(budget.spent)} of ${ustx(budget.cap)}.`);
  console.log('Now build the manifest, inscribe it, and only then play:');
  console.log(`  node harness/wizards/build-manifest.mjs --name "…" --format ${plan.format}` +
    (arg('rounds') ? ` --rounds ${arg('rounds')}` : ''));
}

async function openGame({ white, black, openFee, budget }) {
  const { rules, hash } = await tournamentRules(white.address, black.address);
  console.log(`  opening ${white.name} v ${black.name}  rules ${hash.slice(0, 16)}…`);
  const sent = await send({
    wizard: white,
    functionName: 'open-game',
    functionArgs: [Cl.some(Cl.bufferFromHex(hash)), Cl.bool(rules.ranked)],
    spendUstx: openFee + MINER_FEE_USTX,
    postConditions: [Pc.principal(white.address).willSendLte(openFee).ustx()],
    spent: budget.spent,
    cap: budget.cap,
    rulesHash: hash
  });
  budget.spent = sent.spentAfterUstx;
  const status = await settle(sent.txid);
  if (status !== 'success') throw new WizardSafetyError(`opening failed: ${status}`);

  // FROM THE TRANSACTION, not from `get-game-count`.
  //
  // `open-game` returns the id it consumed, and asking the contract how many
  // games exist afterwards answers a different question. It is the same answer
  // when one game opens at a time, and the wrong one the moment three do - the
  // three opens of a round would all read the same count and two of them would
  // then play into a stranger's game. There is no version of that which fails
  // loudly.
  const id = await gameIdFrom(sent.txid);
  if (id === null) {
    throw new WizardSafetyError(
      `opened in ${sent.txid} but its result did not name a game id. Nothing is lost - the game ` +
        'exists - but this run cannot tell which one it is. Find it and pass --game.'
    );
  }
  return id;
}

/** The id `open-game` returned, read out of its own transaction result. */
async function gameIdFrom(txid) {
  const body = await api(`/extended/v1/tx/0x${String(txid).replace(/^0x/, '')}`);
  const match = /\(ok u(\d+)\)/.exec(body?.tx_result?.repr ?? '');
  return match ? Number(match[1]) : null;
}

async function tournamentRules(white, black) {
  return wizardRules(white, black);
}


/**
 * Is the engine about to play the one that is inscribed?
 *
 * CHECKED, NOT FETCHED, and the difference matters. A tournament that read the
 * chain to make each move would gain a failure mode, and this harness has lost
 * three rounds to exactly that class of thing. So it plays from local source
 * and PROVES the local source is the inscribed engine, once, before spending
 * anything.
 *
 * Never fatal. A run that cannot reach the chain to check a hash is still a run
 * that can play chess, and refusing to start would be trading a real capability
 * for a reassurance. It says what it knows and gets on with it.
 */
async function loadSkill() {
  const built = await buildSkill();
  const local = sha256(built);

  if (LOCAL_ENGINE) {
    console.log(`skill     ${local.slice(0, 16)}…  LOCAL SOURCE (--local-engine)`);
    console.log('          These games are NOT played by the inscribed engine.');
    return loadSearch();
  }

  // ON CHAIN, AND EXECUTED — not merely compared against. The point of the
  // change is that the games below are played by the bytes anybody can fetch,
  // rather than by a local copy that happens to match today.
  //
  // Fetched once, here, before a game is opened. A tournament that read the
  // chain per move would gain a failure mode, and three rounds have already
  // gone to that class of bug.
  const { module, bytes, hash } = await fetchInscribedSkill({ Cl });
  console.log(`skill     ${hash.slice(0, 16)}…  ${bytes.length.toLocaleString()} bytes from inscription ${INSCRIPTION.id}`);
  console.log(`          ${INSCRIPTION.url}`);
  if (hash === local) {
    console.log('          local source builds to the same bytes');
  } else {
    // Not fatal: the inscription is what plays, so a local difference is
    // information about the working tree rather than about the games.
    console.log(`          note: local source differs (${local.slice(0, 16)}…) and is NOT being used`);
  }
  return module;
}


/**
 * Which account pays for the thinking, and it has to be chosen deliberately.
 *
 * TWO ACCOUNTS THAT LOOK LIKE ONE. A Claude subscription and a Developer
 * Platform organisation are billed separately, and only the second has an API
 * to call. So a plan sitting at 5% used cannot pay for a `/v1/messages`
 * request; the request is refused for credit the plan was never going to have,
 * and the error names credit rather than the account, which is what made this
 * take a day to see.
 *
 * `ant auth login` does NOT bridge them. It is the Console's CLI: the token it
 * mints is scoped to the same organisation and workspace as the key, so it is
 * refused for exactly the same reason. That was tried and it failed live.
 *
 * What spends a subscription is Claude Code, so `--via-claude-code` runs each
 * move through it. Explicit rather than automatic, because it is a real change
 * in what is being spent and nobody should discover it from a bill.
 */
function credentials() {
  if (VIA_CLAUDE_CODE) {
    console.log('auth      Claude subscription, via `claude -p`');
    return claudeCodeAsker();
  }
  const apiKey = env().ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? null;
  console.log('auth      ANTHROPIC_API_KEY, billed to Developer Platform credits');
  return anthropicAsker({ apiKey });
}

/** The engine, for working out what each legal move costs. Same source as the board. */
async function loadEngine() {
  return loadBundled('engine.ts');
}

/**
 * The SEARCH, which is what makes these characters able to play at all.
 *
 * Bundled from source like everything else here rather than reimplemented, so a
 * tournament and the lab are analysing positions with the same code — and so
 * the thing that gets inscribed is the thing that played.
 */
async function loadSearch() {
  return loadBundled('search.ts');
}

async function loadBundled(file) {
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [join(HERE, '..', '..', 'packages', 'chess', file)],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error'
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`
  );
}

/** The board's replay engine, bundled the way the rules codec already is. */
async function loadReplay() {
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [join(HERE, '..', '..', 'packages', 'replay', 'replay.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'error'
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`
  );
}

if (Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    const refusal = error instanceof WizardSafetyError || error?.name === 'WizardSafetyError';
    console.error(`\n${refusal ? error.message : scrub(error?.stack ?? error)}`);
    process.exitCode = 1;
  });
}

export { readField, readGames, readEntries, settleAll };

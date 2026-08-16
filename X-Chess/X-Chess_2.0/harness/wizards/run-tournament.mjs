#!/usr/bin/env node
// Run a tournament: six characters, a double round robin, one move at a time.
//
//   node harness/wizards/run-tournament.mjs                 dry: the schedule and what it costs
//   node harness/wizards/run-tournament.mjs --live          play it
//   node harness/wizards/run-tournament.mjs --round 4       one round
//   node harness/wizards/run-tournament.mjs standings       read the table off the chain
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
  WizardSafetyError,
  addressEnvName,
  keyEnvName,
  looksLikeMainnetAddress,
  scrub
} from './wizards-core.mjs';
import { PERSONALITIES, personalityNamed } from './personalities.mjs';
import { annotateMoves, anthropicAsker, chooseMove, claudeCodeAsker } from './chooser.mjs';
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
const MINER_FEE_USTX = 3_000n;

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
async function playGame({ gameId, white, black, replay, ask, budget, Position, expectHash = null }) {
  // REQUIRED, not defaulted to null. A default here is what let fifteen games
  // be played from an unannotated list without one line of output saying so.
  if (!Position) throw new WizardSafetyError('playGame needs the engine to annotate moves');
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
    const entries = await readEntries(gameId);

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
    const annotations = annotateMoves(Position, state.fen, state.legalMoves);

    let chosen;
    try {
      chosen = await chooseMove({
        character: mover,
        position: {
          fen: state.fen,
          legalMoves: state.legalMoves,
          turn: state.turn,
          history: state.accepted.filter((e) => e.kind === 'move').map((e) => e.uci)
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
      await resign({ gameId, mover, rules, budget });
      return state.turn === 'white' ? '0-1' : '1-0';
    }

    console.log(`  game ${gameId}: ${mover.name} plays ${chosen.move}`);
    const sent = await send({
      wizard: mover,
      functionName: 'submit',
      functionArgs: [Cl.uint(gameId), Cl.stringAscii(chosen.move)],
      spendUstx: MINER_FEE_USTX,
      postConditions: [],
      spent: budget.spent,
      cap: budget.cap
    });
    budget.spent = sent.spentAfterUstx;

    const status = await settle(sent.txid);
    if (status !== 'success') {
      throw new WizardSafetyError(`game ${gameId}: ${chosen.move} ${status} (${sent.txid})`);
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
async function resign({ gameId, mover, rules, budget }) {
  if (!RESIGN_ON_FORFEIT) {
    throw new WizardSafetyError(
      `game ${gameId}: ${mover.name} has no legal move and --no-resign is set. ` +
        'The game is left open and it is still their turn.'
    );
  }
  if (rules.eventsProtocol !== 'events-v1') {
    throw new WizardSafetyError(
      `game ${gameId}: ${mover.name} cannot play, and this game did not agree to ` +
        'resignations — `resgn` would be stored, charged, and skipped. Left open.'
    );
  }

  console.log(`  game ${gameId}: ${mover.name} resigns — no legal move in 3 attempts`);
  const sent = await send({
    wizard: mover,
    functionName: 'submit',
    functionArgs: [Cl.uint(gameId), Cl.stringAscii('resgn')],
    spendUstx: MINER_FEE_USTX,
    postConditions: [],
    spent: budget.spent,
    cap: budget.cap
  });
  budget.spent = sent.spentAfterUstx;

  const status = await settle(sent.txid);
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
  const budget = { spent: 0n, cap: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))) };

  const gameId = arg('game')
    ? Number(arg('game'))
    : await openGame({ white: w, black: b, openFee, budget });
  console.log(`game ${gameId}\n`);

  const result = await playGame({ gameId, white: w, black: b, replay, ask, budget, Position });
  console.log(`\nresult ${result ?? 'unfinished'}, spent ${ustx(budget.spent)}\n`);
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

  const plan = planTournament({
    ids,
    format: FORMAT,
    openFeeUstx: openFee,
    minerFeeUstx: MINER_FEE_USTX,
    buyNames: false
  });

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
  const agents = byId(field.agents);
  const budget = { spent: 0n, cap: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))) };
  const existing = await readGames();

  for (const round of plan.rounds) {
    if (arg('round') && Number(arg('round')) !== round.number) continue;
    console.log(`\n=== round ${round.number} ===`);

    // The three games of a round, alongside each other. This is the only
    // parallelism here and it is bounded by the nonce rule rather than by taste.
    await Promise.all(
      round.pairings.map(async (pairing) => {
        const white = agents[pairing.white];
        const black = agents[pairing.black];

        // BY THE RULES HASH, which is one value per pairing and is on the game
        // row. This used to fabricate white and black onto every game before
        // searching, so every pairing matched the first row and three
        // characters played twenty-eight submissions into a stranger's game.
        const { hash } = await wizardRules(white.address, black.address);
        const already = findByRulesHash(hash, existing);
        const gameId = already?.id ?? (await openGame({ white, black, openFee, budget }));
        await playGame({ gameId, white, black, replay, ask, budget, Position, expectHash: hash });
      })
    );
  }

  console.log(`\nSpent ${ustx(budget.spent)} of ${ustx(budget.cap)}.\n`);
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
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [join(HERE, '..', '..', 'packages', 'chess', 'engine.ts')],
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

export { readField, readGames, readEntries };

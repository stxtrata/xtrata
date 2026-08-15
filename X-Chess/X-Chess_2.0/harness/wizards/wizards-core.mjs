/**
 * The wizards, minus the terminal and minus the network.
 *
 * Three disposable mainnet wallets holding a few STX each, whose whole job is to
 * play chess at the canary contract so that "does signing actually work right
 * now" has an answer other than nobody being sure. Every transaction they sign
 * is real, on mainnet, with real money, and none of it is reversible.
 *
 * WHAT THIS CANNOT PROVE, and it is the first thing to understand about it.
 *
 * A wizard signs with a raw key through @stacks/transactions. A player signs
 * through Xverse or Leather, which parse the request, apply their own schema,
 * and forward what they choose to. Those are different paths and only the second
 * one is what a person meets. So a wizard proves the CONTRACT accepts a call and
 * the ENCODING is right — including the contract-principal post condition that
 * matrix row 4 exists for — and proves nothing whatever about whether a wallet
 * will send it. `harness/wallets/MATRIX.md` is still the only thing that answers
 * that, and it still needs a person.
 *
 * What this buys is the other half: a path that CAN run unattended, as often as
 * you like, and that fails loudly when the chain stops accepting something it
 * accepted yesterday.
 *
 * Everything here is pure or takes its I/O by injection — the clock, the
 * balance reader, the broadcaster. There is no network call in this file, which
 * is what makes the safety rules testable rather than merely stated.
 */

import { GAME_PLANS, DEFAULT_PLAN, PLAN_NAMES, planNamed } from './games.mjs';

export { GAME_PLANS, DEFAULT_PLAN, PLAN_NAMES, planNamed };

/** Refused before anything was signed. Never thrown after a broadcast. */
export class WizardSafetyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WizardSafetyError';
  }
}

/**
 * The contract a wizard may talk to, and nothing else.
 *
 * An allow-list rather than a check on the argument, because the argument is
 * the thing most likely to be wrong. A key with a few STX on it that can call
 * ANY contract is a key that can be talked into calling one that empties it.
 */
export const ALLOWED_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary';

/**
 * The functions a wizard may call.
 *
 * Deliberately short, and deliberately missing three things it could call:
 *
 *   settle-sponsorship   claws back an expired reserve. Any principal may call
 *                        it after expiry, and doing so permanently bars that
 *                        player from ever being sponsored on that game again.
 *                        A robot must not be able to do that by accident.
 *   set-*                every owner function. A wizard is not the owner and
 *                        the call would fail, but the refusal belongs here
 *                        rather than at the contract.
 *   claim-result         writes a result hint. Harmless, and not this fleet's
 *                        job; a hint nobody asked for is noise in the record.
 */
export const ALLOWED_FUNCTIONS = Object.freeze([
  'open-game',
  'open-sponsored-game',
  'submit',
  'top-up-sponsorship'
]);

/** The two that create a game, and so the two that must commit rules. */
export const OPENING_FUNCTIONS = Object.freeze(['open-game', 'open-sponsored-game']);

/** 32 bytes of hex, which is what the contract's `(optional (buff 32))` holds. */
export const isRulesHash = (value) =>
  typeof value === 'string' && /^[0-9a-f]{64}$/.test(value.trim().toLowerCase());

/** Per run, across every wizard. The float is small; this is smaller. */
export const DEFAULT_SPEND_CAP_USTX = 3_000_000n;

/**
 * What a wizard must keep.
 *
 * Not politeness: a wallet that reaches zero cannot pay the fee to send its
 * remainder anywhere, so the float is stranded and the wizard is dead. The
 * floor is what keeps `sweep` possible.
 */
export const BALANCE_FLOOR_USTX = 200_000n;

/** Known project wallets. A wizard key must never be one of these. */
export const RESERVED_ADDRESSES = Object.freeze([
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
]);

/**
 * The one address you fund.
 *
 * Sending three transfers by hand and getting one address wrong is a real way to
 * lose money silently, so there is one door: fund the Director, and it tops the
 * players up.
 *
 * IT IS ALSO THE RISKIEST WALLET HERE, and that is the trade. It holds the whole
 * float rather than a third of one, so a leaked director key loses everything
 * the fleet has. What makes that acceptable is the rule below: the Director may
 * only ever pay ITS OWN WIZARDS. It is not a hot wallet that can send anywhere -
 * the single exception is `sweep`, which needs an address typed explicitly and
 * --live, and is the way the money comes home.
 */
export const DIRECTOR = Object.freeze({
  id: 'director',
  name: 'Director',
  plays: 'neither',
  concern:
    'The one address you fund. Distributes floats to the players and never signs a game. May ' +
    'only pay its own fleet.'
});

/** What each player is topped up to. Small on purpose. */
export const TARGET_FLOAT_USTX = 2_000_000n;

/** The most the Director may move in one transfer, whatever it was asked. */
export const MAX_TRANSFER_USTX = 5_000_000n;

export const PERSONAS = Object.freeze([
  {
    id: 'wizard-1',
    name: 'Opener',
    plays: 'white',
    concern: 'Opens games and moves first. The only wizard that spends the open fee.'
  },
  {
    id: 'wizard-2',
    name: 'Responder',
    plays: 'black',
    concern: 'Answers. Proves a second independent signer reaches the same position.'
  },
  {
    id: 'wizard-3',
    name: 'Patron',
    plays: 'neither',
    concern:
      'Funds a sponsored game for a wallet holding nothing, and never plays. The only one that ' +
      'exercises the contract paying STX OUT, which is the path row 4 of the matrix is about.'
  }
]);

export const keyEnvName = (id) => `XCHESS_${id.toUpperCase().replace(/-/g, '_')}_KEY`;
export const addressEnvName = (id) => `XCHESS_${id.toUpperCase().replace(/-/g, '_')}_ADDRESS`;

const MAINNET_ADDRESS = /^S[PM][0-9A-HJKMNP-TV-Z]{20,}$/;

export const looksLikeMainnetAddress = (value) =>
  typeof value === 'string' && MAINNET_ADDRESS.test(value.trim());

/**
 * Anything that looks like key material, wherever it turns up.
 *
 * Used to keep the example file honest and to scrub anything on its way to a
 * log. A 64-character hex run is a Stacks private key; 66 is one with its
 * compression byte.
 */
export const KEY_SHAPED = /\b[0-9a-fA-F]{64,66}\b/;

/** Never print a key, even by accident, even in an error. */
export const scrub = (text) =>
  String(text ?? '').replace(new RegExp(KEY_SHAPED.source, 'g'), '<key redacted>');

/* ------------------------------------------------------------------ */
/* the game the fleet plays                                            */
/* ------------------------------------------------------------------ */

/**
 * Fool's mate, which is the shortest real result in chess.
 *
 * Four moves and the game is genuinely over — checkmate, derived by replay,
 * eligible for a rating if the rules say ranked. Kept as the default because it
 * is the cheapest thing that ends in a real result, which is what you want from
 * the run that answers "can this fleet still sign".
 *
 * It is no longer the only one. This used to say that a longer game "would cost
 * more fees and prove exactly the same things", which was true of the four
 * things listed above it and false of nearly everything else — fool's mate has
 * no capture, no castle, no en passant, no promotion, no control event and no
 * rejected submission. See `games.mjs`, where each plan names what it is the
 * only plan to exercise.
 */
export const SCRIPTED_GAME = GAME_PLANS[DEFAULT_PLAN].moves;

/**
 * The acts a run performs, in order.
 *
 * Shaped like the gates page's steps for the same reason: each one names what
 * it proves, and a run that stops partway leaves a record of where.
 */
export const ACTS = Object.freeze([
  {
    id: 'open',
    by: 'wizard-1',
    fn: 'open-game',
    proves:
      'The open fee moves, a game id is consumed, and a row appears — with the 1 STX capped by a ' +
      'post condition the chain has to accept.'
  },
  {
    id: 'play',
    by: 'both',
    fn: 'submit',
    proves:
      'Two independent signers alternate to a real checkmate. Every move is one transaction and ' +
      'one entry, and replay derives the same result for each of them.'
  },
  {
    id: 'sponsor',
    by: 'wizard-3',
    fn: 'open-sponsored-game',
    proves:
      'The contract pays a bootstrap OUT, to a wallet holding nothing, in the same transaction. ' +
      'This is the encoding matrix row 4 is about, minus the wallet.'
  },
  {
    id: 'rebate',
    by: 'sponsored',
    fn: 'submit',
    proves:
      'A sponsored move: the contract-principal post condition is accepted and the rebate ' +
      'arrives. Never run anywhere before this fleet existed.'
  }
]);

/* ------------------------------------------------------------------ */
/* the safety gate                                                     */
/* ------------------------------------------------------------------ */

/**
 * May this call be broadcast?
 *
 * Called immediately before signing, with everything already known. Every
 * refusal is a thrown WizardSafetyError naming the rule, because a robot that
 * declines quietly is a robot nobody trusts.
 *
 * The order is deliberate: the cheap structural checks first, so a run that is
 * wrong about WHAT it is doing never gets as far as reading a balance.
 */
export function assertBroadcastAllowed({
  live = false,
  contract,
  functionName,
  rulesHash = /** @type {string | null | undefined} */ (undefined),
  network = 'mainnet',
  senderAddress,
  balanceUstx,
  plannedSpendUstx,
  spentSoFarUstx = 0n,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = BALANCE_FLOOR_USTX
}) {
  if (!live) {
    throw new WizardSafetyError(
      'This is a dry run. Nothing is signed and nothing is sent. Pass --live to broadcast.'
    );
  }
  if (network !== 'mainnet') {
    throw new WizardSafetyError(`network is ${network}: these wallets are mainnet only`);
  }
  if (contract !== ALLOWED_CONTRACT) {
    throw new WizardSafetyError(
      `refusing to call ${contract}. A wizard may only call ${ALLOWED_CONTRACT}.`
    );
  }
  if (!ALLOWED_FUNCTIONS.includes(functionName)) {
    throw new WizardSafetyError(
      `refusing to call ${functionName}. Allowed: ${ALLOWED_FUNCTIONS.join(', ')}.`
    );
  }

  // NO GAME WITHOUT RULES. `open-game` takes an OPTIONAL rules hash, and none is
  // a legal thing to send - it opens a board that commits to nothing, which any
  // reader can replay and no reader can referee. That is a real mode and it is
  // not this fleet's job.
  //
  // A wizard game exists to be checked by somebody else's board: the rules have
  // to be recoverable, the sides have to be named, and the result has to be
  // eligible to count. All three start with a commitment, so a game opened
  // without one is not a smaller test - it is a different one, silently.
  if (OPENING_FUNCTIONS.includes(functionName) && !isRulesHash(rulesHash)) {
    throw new WizardSafetyError(
      `refusing to ${functionName} with no rules committed. A wizard game must commit a rules ` +
        'hash, or nothing can referee it afterwards. Got: ' +
        (rulesHash === undefined ? 'nothing' : JSON.stringify(rulesHash))
    );
  }
  if (!looksLikeMainnetAddress(senderAddress)) {
    throw new WizardSafetyError(`${senderAddress} is not a mainnet address`);
  }
  if (RESERVED_ADDRESSES.includes(senderAddress)) {
    throw new WizardSafetyError(
      `${senderAddress} is a project wallet, not a disposable one. Generate a fresh wizard.`
    );
  }

  const spend = BigInt(plannedSpendUstx);
  const spent = BigInt(spentSoFarUstx);
  const cap = BigInt(spendCapUstx);
  const balance = BigInt(balanceUstx);
  const floor = BigInt(balanceFloorUstx);

  if (spend <= 0n) throw new WizardSafetyError('a broadcast must plan to spend something');
  if (spent + spend > cap) {
    throw new WizardSafetyError(
      `this run has spent ${spent} uSTX and this call would spend ${spend}, over the cap of ${cap}`
    );
  }
  if (balance - spend < floor) {
    throw new WizardSafetyError(
      `${senderAddress} holds ${balance} uSTX; spending ${spend} would leave less than the ` +
        `${floor} floor, and a wallet that cannot pay a fee cannot be swept`
    );
  }

  return { plannedSpendUstx: spend, spentAfterUstx: spent + spend };
}

/**
 * The fleet, read from the environment.
 *
 * Returns what is present and says plainly what is missing. Never throws on a
 * missing key: a dry run is useful with no wallets at all, and refusing to
 * start is how a tool ends up only ever run by the person who wrote it.
 */
export function readFleet(env = {}) {
  const wizards = [];
  const missing = [];
  for (const persona of [DIRECTOR, ...PERSONAS]) {
    const key = env[keyEnvName(persona.id)];
    const address = env[addressEnvName(persona.id)];
    if (!key || !address) {
      missing.push(persona.id);
      wizards.push({ ...persona, key: null, address: address ?? null });
      continue;
    }
    if (!looksLikeMainnetAddress(address)) {
      throw new WizardSafetyError(`${addressEnvName(persona.id)} is not a mainnet address`);
    }
    wizards.push({ ...persona, key, address });
  }
  return { wizards, missing, ready: missing.length === 0 };
}

/**
 * What a run intends to do, before it does any of it.
 *
 * A plan is what a dry run prints, and the same object is what the live run
 * walks — so what you read is what happens, rather than a description of it
 * that can drift.
 */
export function planRun({
  fleet,
  openFeeUstx = 1_000_000n,
  sponsorTotalUstx = 0n,
  minerFeeUstx = 3_000n,
  resuming = false,
  plan = DEFAULT_PLAN
}) {
  const by = (id) => fleet.wizards.find((w) => w.id === id) ?? null;
  const game = planNamed(plan);
  const steps = [];

  // A resumed run joins a game that already exists, so it pays no open fee. The
  // plan has to say so: one that quotes a price nobody pays is a plan the spend
  // cap cannot be checked against.
  if (!resuming) {
    steps.push({
      act: 'open',
      who: by('wizard-1'),
      fn: 'open-game',
      spendUstx: BigInt(openFeeUstx) + BigInt(minerFeeUstx),
      what: `open a ranked game (${game.name}), wizard-1 as white and wizard-2 as black`
    });
  }

  for (const move of game.moves) {
    steps.push({
      act: 'play',
      who: by(move.by),
      fn: 'submit',
      spendUstx: BigInt(minerFeeUstx),
      what: move.note ? `${move.move} — ${move.note}` : move.move
    });
  }

  if (sponsorTotalUstx > 0n) {
    steps.push({
      act: 'sponsor',
      who: by('wizard-3'),
      fn: 'open-sponsored-game',
      spendUstx: BigInt(openFeeUstx) + BigInt(sponsorTotalUstx) + BigInt(minerFeeUstx),
      what: 'open a sponsored game for a wallet holding nothing'
    });
  }

  const total = steps.reduce((sum, step) => sum + step.spendUstx, 0n);
  return { steps, totalUstx: total, plan: game.name, proves: game.proves, moves: game.moves };
}

/* ------------------------------------------------------------------ */
/* the Director                                                        */
/* ------------------------------------------------------------------ */

/**
 * May the Director send this?
 *
 * The rule that makes one funded address safer than three, rather than merely
 * more convenient: A DIRECTOR MAY ONLY PAY ITS OWN WIZARDS. A hot wallet that
 * can send anywhere is a hot wallet; one that can only top up a known list is a
 * float with a spout.
 *
 * `sweep` is the single exception and takes a different door: it needs an
 * address typed on the command line and --live, and it is the way the money
 * comes home rather than a thing the fleet does on its own.
 */
export function assertTransferAllowed({
  live = false,
  from,
  to,
  amountUstx,
  balanceUstx,
  /** @type {string[]} */
  fleetAddresses = /** @type {string[]} */ ([]),
  balanceFloorUstx = BALANCE_FLOOR_USTX,
  maxTransferUstx = MAX_TRANSFER_USTX,
  sweeping = false
}) {
  if (!live) {
    throw new WizardSafetyError('This is a dry run. Nothing is signed. Pass --live to send.');
  }
  if (!looksLikeMainnetAddress(from)) throw new WizardSafetyError(`${from} is not a mainnet address`);
  if (!looksLikeMainnetAddress(to)) throw new WizardSafetyError(`${to} is not a mainnet address`);
  if (from === to) throw new WizardSafetyError('refusing to send a wallet its own money');

  if (!sweeping && !fleetAddresses.includes(to)) {
    throw new WizardSafetyError(
      `refusing to send to ${to}: the Director may only pay its own wizards. To move money out ` +
        'of the fleet, use sweep --to, which is a separate command and says so.'
    );
  }

  const amount = BigInt(amountUstx);
  const balance = BigInt(balanceUstx);
  const floor = BigInt(balanceFloorUstx);
  const max = BigInt(maxTransferUstx);

  if (amount <= 0n) throw new WizardSafetyError('refusing to send nothing');
  if (amount > max) {
    throw new WizardSafetyError(`${amount} uSTX is over the ${max} single-transfer ceiling`);
  }
  if (balance - amount < floor) {
    throw new WizardSafetyError(
      `the Director holds ${balance} uSTX; sending ${amount} would leave less than the ${floor} ` +
        'floor, and a wallet that cannot pay a fee cannot fund anybody'
    );
  }
  return { amountUstx: amount };
}

/**
 * Who needs topping up, and by how much.
 *
 * Tops up to a target rather than sending a fixed amount, so running it twice
 * costs nothing: a wizard already at its float is skipped rather than doubled.
 */
export function planFunding({ fleet, balances, targetFloatUstx = TARGET_FLOAT_USTX, feeUstx = 3_000n }) {
  const target = BigInt(targetFloatUstx);
  const transfers = [];
  for (const wizard of fleet.wizards) {
    if (wizard.id === DIRECTOR.id || !wizard.address) continue;
    const held = BigInt(balances[wizard.address] ?? 0n);
    if (held >= target) continue;
    transfers.push({ to: wizard.address, who: wizard.name, amountUstx: target - held, heldUstx: held });
  }
  const total = transfers.reduce((sum, t) => sum + t.amountUstx + BigInt(feeUstx), 0n);
  return { transfers, totalUstx: total, targetUstx: target };
}

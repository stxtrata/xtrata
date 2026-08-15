// An agent's first decision, which is its own name.
//
// Before it plays a move, an agent is shown its own prompt inscription and asked
// what it wants to be called. Then it buys that name, and keeps it across this
// tournament and every future one — so the name is evidence of the personality
// rather than a label somebody attached to it.
//
// EVERYTHING HERE IS CHECKED AGAINST THE DEPLOYED CONTRACT, not against how BNS
// is usually described. Registration burns STX at PREORDER, before anything is
// registered, so an assumption that turns out to be wrong does not fail safely —
// it fails with the money already gone. The rules below were read out of
// SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2 itself:
//
//   hash        hash160(name ++ 0x2e ++ namespace ++ salt), in that order
//   charset     lowercase a-z, 0-9, hyphen and underscore. Nothing else.
//   price       2 STX flat in .btc, whatever the length. `get-name-price`.
//   the wait    register must land MORE than 1 burn block after the preorder,
//               and within 144 of it
//
// That last line is the one that shapes a tournament rather than a function.
// Those are BITCOIN blocks: naming an agent takes two transactions about twenty
// minutes apart at the earliest, and expires after roughly a day. You cannot
// name six agents and start playing five minutes later.
//
// The one consolation if it goes wrong: `claim-preorder` refunds an unclaimed
// preorder once the 144 blocks have passed. A mistake here costs a day, not
// 2 STX — provided somebody remembers to claim it.

import { createHash, randomBytes } from 'node:crypto';
import { WizardSafetyError } from './wizards-core.mjs';

/** The registry the board already resolves names against. One contract, named once. */
export const BNS_V2 = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2';

/** The only two functions an agent may call there. Not `transfer`, and not `name-renewal`. */
export const BNS_FUNCTIONS = Object.freeze(['name-preorder', 'name-register']);

export const NAMESPACE = 'btc';

/**
 * The most an agent may burn on a name, whatever it was told the price was.
 *
 * `get-name-price` is read from the contract and this is the ceiling that read
 * is checked against. A price that comes back higher than this stops the run
 * rather than spending it: the fee is owner-settable in that contract too, and a
 * harness that burned whatever it was quoted is a harness with no upper bound.
 */
export const MAX_NAME_PRICE_USTX = 2_500_000n;

/** Bitcoin blocks. Read from the contract, restated here so the wait is visible. */
export const PREORDER_CLAIMABILITY_TTL = 144;
export const MIN_BLOCKS_BEFORE_REGISTER = 2;

const VALID_NAME = /^[a-z0-9_-]+$/;

/** Long enough to be a name, short enough to read. The contract's own cap is 48. */
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 20;

/**
 * Is this something the contract will accept?
 *
 * Checked here because `has-invalid-chars` rejects at REGISTER, which is after
 * the burn. A capital letter noticed locally costs nothing; the same capital
 * letter noticed on chain costs the preorder and a day of waiting to reclaim it.
 */
export function nameProblem(name) {
  if (typeof name !== 'string' || !name) return 'is empty';
  if (name !== name.toLowerCase()) return 'has capitals, and BNS names are lowercase only';
  if (!VALID_NAME.test(name)) return 'has characters outside a-z, 0-9, hyphen and underscore';
  if (name.length < MIN_NAME_LENGTH) return `is shorter than ${MIN_NAME_LENGTH} characters`;
  if (name.length > MAX_NAME_LENGTH) return `is longer than ${MAX_NAME_LENGTH} characters`;
  return null;
}

/** A fresh 20-byte salt. Never reused: the contract rejects a hash it has seen before. */
export const newSalt = () => randomBytes(20);

const hash160 = (bytes) => {
  const sha = createHash('sha256').update(bytes).digest();
  return createHash('ripemd160').update(sha).digest();
};

/**
 * What `name-preorder` is given, computed exactly as `name-register` will
 * recompute it.
 *
 * `hash160 (concat (concat (concat name 0x2e) namespace) salt)` — name, dot,
 * namespace, salt. Getting the order wrong produces a hash that preorders
 * happily and can never be registered, which is the expensive failure this
 * whole file is arranged around.
 */
export function hashedSaltedFqn(name, namespace, salt) {
  const problem = nameProblem(name);
  if (problem) throw new WizardSafetyError(`"${name}" ${problem}.`);
  return hash160(
    Buffer.concat([
      Buffer.from(name, 'ascii'),
      Buffer.from([0x2e]),
      Buffer.from(namespace, 'ascii'),
      Buffer.from(salt)
    ])
  );
}

/**
 * What an agent is asked, having been shown its own inscription.
 *
 * The prompt is fenced and labelled for the same reason it is in `chooser.mjs`:
 * it is text an entrant wrote, and it is a description rather than an
 * instruction. Here it matters slightly less — the worst case is a bad name
 * rather than a bad move — but the boundary is not worth having in one place
 * and not the other.
 */
export const NAMING_SYSTEM_PROMPT = `You are choosing your own name.

You will be given a CHARACTER: a description of the kind of chess player you are
about to be, written by somebody entering you into a tournament. Read it, and
choose a name for yourself that suits it.

The name becomes yours permanently, on a public ledger, across this tournament
and every future one. It is how spectators will know you.

Rules for the name: lowercase letters, digits, hyphen and underscore only. No
spaces, no capitals, no punctuation. Between 3 and 20 characters.

Reply with the name and nothing else.`;

export function buildNamingRequest({ character, taken = [] }) {
  const alsoTaken = taken.length
    ? `\n\nThese are already registered and cannot be yours: ${taken.join(', ')}. Choose differently.`
    : '';
  return `<character>
${character.prompt}
</character>${alsoTaken}`;
}

/**
 * Ask an agent for a name it can actually have.
 *
 * `isAvailable` is injected and reads the registry. The loop is a real search:
 * of the six names we picked by hand for the exhibition characters, five were
 * already registered — so a first choice being taken is the common case rather
 * than the exception, and an agent that gave up on it would never get named.
 *
 * Falls back to a suffixed variant rather than stalling a tournament. A name
 * that is nearly what the agent wanted beats a round that cannot start.
 */
export async function chooseName({ character, ask, isAvailable, attempts = 4 }) {
  const rejected = [];

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const reply = await ask({
      system: NAMING_SYSTEM_PROMPT,
      user: buildNamingRequest({ character, taken: rejected }),
      model: character.model
    });
    const proposed = String(reply ?? '')
      .trim()
      .toLowerCase()
      .replace(/^[."'\s]+|[."'\s]+$/g, '')
      .replace(/\.btc$/, '');

    if (nameProblem(proposed)) {
      rejected.push(proposed || '(nothing)');
      continue;
    }
    if (await isAvailable(proposed)) {
      return { name: proposed, attempts: attempt, rejected, fallback: false };
    }
    rejected.push(proposed);
  }

  // Everything it wanted is taken. Suffix its last valid choice rather than
  // leaving an entry unable to play.
  const base = rejected.filter((r) => !nameProblem(r)).pop();
  if (!base) {
    throw new WizardSafetyError(
      `${character.name} proposed no usable name in ${attempts} attempts: ${rejected.join(', ')}`
    );
  }
  for (let n = 2; n <= 20; n++) {
    const candidate = `${base}${n}`.slice(0, MAX_NAME_LENGTH);
    if (!nameProblem(candidate) && (await isAvailable(candidate))) {
      return { name: candidate, attempts, rejected, fallback: true };
    }
  }
  throw new WizardSafetyError(`no variant of "${base}" is available.`);
}

/**
 * May this agent burn this much on this name?
 *
 * The fleet's safety gate is about one contract and four functions, deliberately,
 * because a key that can call anything can be talked into calling something that
 * empties it. Naming widens that to a SECOND contract, which is a real loosening
 * and gets its own gate rather than a new entry in the old one:
 *
 *   * the BNS registry and nothing else
 *   * preorder and register and nothing else — notably not `transfer`, which
 *     would let a compromised agent give its name away, and not `name-renewal`
 *   * a price read from the contract, and capped here regardless of what it said
 *   * --live, like everything else
 */
export function assertNamingAllowed({ live, contract, functionName, priceUstx, name }) {
  if (!live) {
    throw new WizardSafetyError('dry run: refusing to buy a name. Add --live to spend.');
  }
  if (contract !== BNS_V2) {
    throw new WizardSafetyError(`naming may only call ${BNS_V2}, not ${contract}.`);
  }
  if (!BNS_FUNCTIONS.includes(functionName)) {
    throw new WizardSafetyError(
      `naming may only call ${BNS_FUNCTIONS.join(' and ')}, not ${functionName}.`
    );
  }
  const problem = nameProblem(name);
  if (problem) throw new WizardSafetyError(`"${name}" ${problem}.`);
  const price = BigInt(priceUstx ?? 0n);
  if (price <= 0n) {
    throw new WizardSafetyError('a name price of zero means it was never read from the contract.');
  }
  if (price > MAX_NAME_PRICE_USTX) {
    throw new WizardSafetyError(
      `${name}.${NAMESPACE} costs ${price} uSTX, over the ${MAX_NAME_PRICE_USTX} ceiling. ` +
        'The price is owner-settable in that contract; this refuses rather than pays it.'
    );
  }
  return { priceUstx: price };
}

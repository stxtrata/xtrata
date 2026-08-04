/**
 * collections.mjs — the three collections, and the one place that resolves an id.
 *
 * One substrate, three readings. Every collection here draws the same eight
 * parts of the mint path — chunk, fold, seal, dependency edge, nonce, miner
 * fee, post-condition, escrow — through one wizard's fixed concern:
 *
 *   c-machinery-001  The Machinery         Wizard-3, the Builder
 *                    how it works underneath. Solid apparatus, orange for the
 *                    part that costs or commits. Priced at cost.
 *
 *   c-keeping-001    The Cost of Keeping   Wizard-1, the Archivist
 *                    what survives and at what price. Weight, layers and a
 *                    bronze line under everything. Priced as a threshold.
 *
 *   c-omission-001   What the Hash Omits   Wizard-2, the Skeptic
 *                    what is absent and what a hash cannot hold. Outlines and
 *                    gaps where the others draw solid. Priced low, on purpose.
 *
 * Each wizard conceived, drew, pays for and can sell its own. The three do not
 * share a wallet, a palette or a manifest, and the only thing they share is the
 * engine in `collection-kit.mjs` that makes all three obey the same rules.
 *
 * This module is a registry and nothing else. It reads nothing, holds no state
 * and cannot broadcast.
 */

import { WizardComposeError } from './collection-kit.mjs';
import { MACHINERY } from './collection-art.mjs';
import { KEEPING } from './collection-keeping.mjs';
import { OMISSION } from './collection-omission.mjs';

export { MACHINERY, KEEPING, OMISSION };

/**
 * Registration order. The Builder's is first because eight of its plates were
 * conceived first and because every default in the runners still points at it,
 * so a caller that names nothing gets the collection it used to get.
 */
export const COLLECTIONS = [MACHINERY, KEEPING, OMISSION];

export const COLLECTION_IDS = COLLECTIONS.map((collection) => collection.id);

/** The collection a runner mints when no `--collection` is given. */
export const DEFAULT_COLLECTION_ID = MACHINERY.id;

const BY_ID = new Map(COLLECTIONS.map((collection) => [collection.id, collection]));
const BY_WIZARD = new Map(COLLECTIONS.map((collection) => [collection.wizard, collection]));

/**
 * Two collections may not be drawn by the same wizard, and two may not share a
 * palette.
 *
 * The first is a rule about income: each wizard earns from its own body of
 * work, and a second collection under one wizard would make "the Skeptic's
 * collection" ambiguous in a report that has to name a seller. The second is
 * the rule the brief actually turns on. Three readings of one substrate are
 * only interesting if they are genuinely different pictures; a recolour would
 * be the cheapest possible way to fail, so it is refused at import rather than
 * left to taste.
 */
if (BY_WIZARD.size !== COLLECTIONS.length) {
  throw new WizardComposeError('two collections are drawn by the same wizard; each wizard has exactly one');
}
{
  const seen = new Map();
  for (const collection of COLLECTIONS) {
    const signature = Object.values(collection.palette).join(',');
    if (seen.has(signature)) {
      throw new WizardComposeError(
        `${collection.id} uses the same palette as ${seen.get(signature)}. Three readings of one substrate have ` +
          'to be different pictures; a recolour is not a reading.'
      );
    }
    seen.set(signature, collection.id);
  }
}

/** Resolve a collection by id, or pass an already-resolved one through. */
export function getCollection(idOrCollection = DEFAULT_COLLECTION_ID) {
  if (idOrCollection && typeof idOrCollection === 'object' && idOrCollection.id) {
    return getCollection(idOrCollection.id);
  }
  const collection = BY_ID.get(String(idOrCollection).trim());
  if (!collection) {
    throw new WizardComposeError(
      `"${idOrCollection}" is not a collection. Known: ${COLLECTION_IDS.join(', ')}.`
    );
  }
  return collection;
}

/** The collection a given wizard draws, or null if it draws none. */
export const collectionForWizard = (wizard) => BY_WIZARD.get(String(wizard).trim()) ?? null;

/** One line per collection, for a terminal or a README. */
export const describeCollections = () =>
  COLLECTIONS.map(
    (collection) =>
      `  ${collection.id.padEnd(16)} ${collection.title.padEnd(21)} ${collection.persona.name}`
  );

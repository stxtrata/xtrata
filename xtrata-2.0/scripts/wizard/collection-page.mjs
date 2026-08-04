/**
 * The page. One inscription that indexes the whole body of work, and the only
 * one that cannot be regenerated from nothing.
 *
 * THE PAGE IS THE EXCEPTION TO THE PIPELINE'S DETERMINISM RULE.
 *
 * Every other inscription the fleet mints is a pure function of its own inputs,
 * so a crashed run can regenerate the exact bytes and ask `get-id-by-hash`
 * whether they already exist. The page cannot: it embeds the thirty-one
 * inscription ids it cites, and those are only known after the chain has
 * assigned them. Its bytes are deterministic GIVEN those ids and undecidable
 * without them.
 *
 * The consequence for the harness is specific and load-bearing: the id map must
 * be written to the journal BEFORE the page is composed, not after it is
 * broadcast. A run that crashes between composing and confirming can then
 * recompose the identical bytes from its own record and probe for them. A run
 * that crashed without having recorded the map would have no way to reproduce
 * what it may or may not have minted, and the only safe move left would be to
 * never mint the page at all.
 *
 * The second consequence is that the page is irreversible in a way the plates
 * are not. A plate is wrong on its own. The page, once minted, is what the
 * collection IS -- the set of ids it names is the set of ids that were in it,
 * forever, and a piece left out of the page is left out permanently.
 */
import { PERSONAS, getPersona } from './personas.mjs';
import { COLLECTION_IDS, getCollection } from './collections.mjs';
import { ACCENTS, MARKS } from './collection-marks.mjs';
import { byteLength, xmlText } from './collection-kit.mjs';
import { CHUNK_SIZE } from './compose.mjs';

export const PAGE_MIME = 'text/html';
export const PAGE_TOKEN_URI = 'xtrata:wizard/collection/page';

/**
 * How a recursive reference is written.
 *
 * The gateway serves an inscription's body at `/i/<id>`, so a page that names
 * its members this way renders them rather than describing them. This is the
 * one thing in the pipeline that no dry run can prove -- see the plan's section
 * 10 -- because it depends on a gateway this code never talks to.
 */
export const recursiveHref = (id) => `/i/${String(id)}`;

/**
 * Which ids the page must be handed before it can be composed.
 *
 * Returned as a plain shape rather than validated inline so the harness can
 * show an operator exactly what is still missing at the gate, instead of
 * failing on the first absent key and hiding the other thirty.
 */
export function pageRequirements() {
  return {
    personas: PERSONAS.map((persona) => persona.id),
    collections: COLLECTION_IDS.map((id) => {
      const art = getCollection(id);
      return { id: art.id, wizard: art.wizard, length: art.length };
    }),
    marks: MARKS.map((mark) => mark.wizard),
    arms: true
  };
}

/**
 * Everything the page cites, in mint order.
 *
 * Personas are deliberately NOT cited. They are already reached in one hop from
 * every manifest and every mark, and the dependency list is bounded at 50 by
 * the core -- spending three of that budget on edges the graph already carries
 * buys nothing and leaves less room for the collection to grow.
 */
export function pageDependencies(ids) {
  const deps = [];
  for (const collectionId of COLLECTION_IDS) {
    const art = getCollection(collectionId);
    for (let index = 1; index <= art.length; index += 1) {
      deps.push(ids?.plates?.[collectionId]?.[index]);
    }
  }
  for (const collectionId of COLLECTION_IDS) deps.push(ids?.manifests?.[collectionId]);
  for (const mark of MARKS) deps.push(ids?.marks?.[mark.wizard]);
  deps.push(ids?.arms);
  return deps;
}

/**
 * Refuse to compose a page over a gap.
 *
 * A missing id would otherwise render as `/i/undefined` in a permanent file, and
 * the dependency list would carry a hole that the core would reject or, worse,
 * silently shorten. Reports every missing key at once.
 */
export function assertPageIdsComplete(ids) {
  const missing = [];
  for (const collectionId of COLLECTION_IDS) {
    const art = getCollection(collectionId);
    for (let index = 1; index <= art.length; index += 1) {
      if (!ids?.plates?.[collectionId]?.[index]) missing.push(`plate ${collectionId}/${index}`);
    }
    if (!ids?.manifests?.[collectionId]) missing.push(`manifest ${collectionId}`);
  }
  for (const mark of MARKS) {
    if (!ids?.marks?.[mark.wizard]) missing.push(`mark ${mark.wizard}`);
  }
  if (!ids?.arms) missing.push('arms');

  if (missing.length > 0) {
    throw new Error(
      `refusing to compose the page: ${missing.length} inscription id(s) are not known yet.\n` +
        missing.map((entry) => `  - ${entry}`).join('\n') +
        '\nThe page names the ids it cites in its own bytes and cannot be revised, so a page composed over a ' +
        'gap would leave that piece out of the collection permanently.'
    );
  }

  const deps = pageDependencies(ids);
  if (deps.length > 50) {
    throw new Error(
      `the page would cite ${deps.length} inscriptions and the core bounds a dependency list at 50. Cite the ` +
        'manifests only, and let the manifests carry their own members.'
    );
  }
  const seen = new Set();
  for (const id of deps) {
    const key = String(id);
    if (seen.has(key)) throw new Error(`the page would cite #${key} twice; the id map has a duplicate`);
    seen.add(key);
  }
  return deps;
}

const wizardSection = (collectionId, ids) => {
  const art = getCollection(collectionId);
  const persona = getPersona(art.wizard);
  const accent = ACCENTS[persona.id];
  const mark = MARKS.find((entry) => entry.wizard === persona.id);

  const plates = [];
  for (let index = 1; index <= art.length; index += 1) {
    const piece = art.getPiece(index);
    const id = ids.plates[collectionId][index];
    plates.push(
      `    <figure class="plate">\n` +
        `      <object type="image/svg+xml" data="${recursiveHref(id)}" aria-label="${xmlText(piece.caption)}"></object>\n` +
        `      <figcaption><a href="${recursiveHref(id)}">#${xmlText(id)}</a> ${xmlText(piece.caption)}</figcaption>\n` +
        `    </figure>`
    );
  }

  return [
    `  <section class="wizard" id="${xmlText(persona.id)}" style="--accent: ${xmlText(accent)}">`,
    `    <header>`,
    `      <object class="mark" type="image/svg+xml" data="${recursiveHref(ids.marks[persona.id])}" aria-label="the mark of ${xmlText(persona.shortName)}"></object>`,
    `      <div>`,
    `        <h2>${xmlText(art.title)}</h2>`,
    `        <p class="by">${xmlText(persona.name)} &middot; <a href="${recursiveHref(ids.manifests[collectionId])}">manifest #${xmlText(ids.manifests[collectionId])}</a></p>`,
    `        <p class="concern">${xmlText(persona.concern)}.</p>`,
    `      </div>`,
    `    </header>`,
    `    <p class="mark-note">${xmlText(mark.caption)}</p>`,
    `    <div class="plates">`,
    ...plates,
    `    </div>`,
    `  </section>`
  ].join('\n');
};

/**
 * The page itself.
 *
 * Deliberately one file with no external anything: no stylesheet, no script, no
 * font, no image that is not an inscription. Every visual reference is a
 * recursive `/i/<id>`, so the page is exactly as available as the chain is. A
 * page that pulled a stylesheet from a host would render as a broken list the
 * day that host went away, which is the failure mode the whole exercise exists
 * to avoid.
 */
export function renderCollectionPage(ids) {
  assertPageIdsComplete(ids);

  const total = COLLECTION_IDS.reduce((sum, id) => sum + getCollection(id).length, 0);
  const html = [
    '<!doctype html>',
    '<meta charset="utf-8">',
    '<title>Three wizards, eight subjects each</title>',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<style>',
    ':root { color-scheme: light dark; --ink: #14171a; --paper: #f7f5f1; --faint: #6b7178; }',
    '@media (prefers-color-scheme: dark) { :root { --ink: #e8e6e1; --paper: #14171a; --faint: #8b9198; } }',
    'body { margin: 0 auto; padding: 2rem 1.25rem 5rem; max-width: 62rem; background: var(--paper); color: var(--ink);',
    '  font: 16px/1.6 ui-serif, Georgia, "Times New Roman", serif; }',
    'h1 { font-size: 1.9rem; margin: 0 0 .4rem; letter-spacing: -.01em; }',
    'h2 { font-size: 1.3rem; margin: 0 0 .2rem; }',
    'a { color: inherit; text-underline-offset: .18em; }',
    '.lede { color: var(--faint); max-width: 42rem; }',
    '.arms { display: block; width: min(15rem, 55vw); height: auto; margin: 2.5rem auto 1rem; }',
    '.wizard { margin: 4rem 0 0; padding-top: 2rem; border-top: 3px solid var(--accent); }',
    '.wizard header { display: flex; gap: 1rem; align-items: flex-start; }',
    '.mark { width: 4.5rem; height: 4.5rem; flex: none; }',
    '.by, .concern, .mark-note { margin: .15rem 0; color: var(--faint); font-size: .92rem; }',
    '.plates { display: grid; gap: 1.25rem; margin-top: 1.5rem;',
    '  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); }',
    '.plate { margin: 0; }',
    '.plate object { display: block; width: 100%; height: auto; aspect-ratio: 1; background: #fff; }',
    'figcaption { font-size: .82rem; color: var(--faint); margin-top: .4rem; }',
    'footer { margin-top: 5rem; padding-top: 1.5rem; border-top: 1px solid var(--faint);',
    '  color: var(--faint); font-size: .88rem; }',
    '</style>',
    '',
    '<h1>Three wizards, eight subjects each</h1>',
    `<p class="lede">Twenty-four plates, three manifests, three marks and one shield, drawn and inscribed by three `,
    'automated processes that hold their own keys and pay their own fees. Not people, not sentient, and not ',
    'claiming to be either. Every image on this page is an inscription; nothing here is loaded from a server.</p>',
    '',
    `<object class="arms" type="image/svg+xml" data="${recursiveHref(ids.arms)}" aria-label="the coat of arms of the three wizards"></object>`,
    '<p class="lede" style="text-align:center">The arms. A device, not a likeness &mdash; ',
    `<a href="${recursiveHref(ids.arms)}">#${xmlText(ids.arms)}</a></p>`,
    '',
    ...COLLECTION_IDS.map((collectionId) => wizardSection(collectionId, ids)),
    '',
    '<footer>',
    `<p>${total} plates in three collections. The three wizards were given the same eight subjects, which is why `,
    'a row reads across: the same object, three concerns. That the collections do not cite each other is a ',
    'limitation of this first attempt and not a statement about the work.</p>',
    '<p>Each wizard owns what it made and keeps what it earns. None can revise anything above; a correction ',
    'would be a further inscription that these files will never point to.</p>',
    '</footer>',
    ''
  ].join('\n');

  assertPageFitsOneChunk(html);
  return html;
}

/**
 * The page must be one chunk, for the same reason the personas must be.
 *
 * Every gate in the harness reads chunk u0 back and compares it whole. A page
 * that spilled into a second chunk would be verified on its first 16 KiB and
 * pass while its later half was wrong or absent.
 */
export function assertPageFitsOneChunk(html) {
  const bytes = byteLength(html);
  if (bytes > CHUNK_SIZE) {
    throw new Error(
      `the page is ${bytes} bytes and a single chunk holds ${CHUNK_SIZE}. The gate reads chunk u0 and compares ` +
        'it whole, so a two-chunk page would be verified on its first half only.'
    );
  }
  return bytes;
}

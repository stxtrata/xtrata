/**
 * The persona inscriptions. Three roots, and the only inscriptions in the
 * pipeline that cite nothing.
 *
 * Everything else the fleet mints hangs off these: a plate cites its wizard's
 * persona, a mark cites the same, a manifest cites its persona and its plates,
 * and the page cites all of it. So these three are minted first and are the one
 * layer that can never be corrected by a later inscription -- a persona that
 * says the wrong thing is cited, permanently, by thirty other files.
 *
 * DETERMINISM IS A SAFETY PROPERTY HERE, NOT A STYLE CHOICE.
 *
 * A persona document is a pure function of its persona id. It embeds no block
 * height, no fee, no timestamp and no chain-derived id. That is what makes
 * `get-id-by-hash` a permanently decisive probe: if a run crashes between
 * signing and confirming, a later run can regenerate these exact bytes, ask the
 * core whether anything with that hash exists, and get a true answer forever.
 * The corpus entries cannot do this -- they quote their own cost and block, so
 * their hash is only reproducible by the run that made them, and a crashed
 * corpus run has to be adjudicated by a human.
 *
 * Do not add a date, a version stamp, a run id or a price to these documents.
 * Any of them would trade a decidable crash window for an undecidable one.
 */
import { HONESTY_PREAMBLE, PERSONAS, getPersona } from './personas.mjs';
import { ACCENTS } from './collection-marks.mjs';
import { byteLength } from './collection-kit.mjs';
import { CHUNK_SIZE } from './compose.mjs';

export { ACCENTS, HONESTY_PREAMBLE };

/** Markdown, like the corpus. The plates are the only SVG in the fleet. */
export const PERSONA_MIME = 'text/markdown';

/** Roots cite nothing. Stated as a constant so the harness can assert it. */
export const PERSONA_DEPENDENCIES = [];

export const tokenUriForPersona = (wizard) => `xtrata:wizard/persona/${getPersona(wizard).id}`;

/**
 * The standing description of what these wizards are, repeated in all three.
 *
 * Identical across the personas on purpose, exactly as the honesty preamble is
 * identical across every corpus entry: it is the claim that must not drift
 * between one wizard's account of itself and another's. A reader who compares
 * two personas should find them differing only in the parts that are genuinely
 * different.
 */
export const STANDING_TERMS =
  'Each wizard holds one key, pays its own fees from its own balance, and keeps what its own work earns. ' +
  'None of them can spend from another, and none of them can revise or withdraw anything already inscribed. ' +
  'A correction is a second inscription at the same cost as the first.';

/**
 * What each wizard says about itself, beyond the fields it already carries.
 *
 * Kept here rather than in personas.mjs because personas.mjs is the corpus
 * thread's data and is imported by the runner that mints it. Adding fields
 * there would change nothing on chain, but it puts the collection's self
 * description in the file the thread reads from, and the two have already
 * drifted apart in what they are for.
 */
const ACCOUNTS = {
  archivist: {
    method:
      'I write down what happened and what it cost, in that order. I do not argue for permanence and I do ' +
      'not sell it. I record, and the record is the argument.',
    limit:
      'I cannot tell you whether anything I have kept is worth keeping. Custody is not judgement. An archive ' +
      'that only held what its keeper valued would be a much smaller and much less useful thing.',
    accentNote: 'Bronze, for the clasp. The colour of a fitting that is meant to outlast what it closes over.'
  },
  skeptic: {
    method:
      'I look for what is missing from a claim before I look at the claim. A hash proves that bytes did not ' +
      'change. It proves nothing whatever about whether they were true when they were written.',
    limit:
      'My position is cheap to hold and I know it. Doubt costs the same fee as assertion and carries none of ' +
      'the risk, so nothing I say here should be mistaken for having been tested.',
    accentNote: 'The gap colour, which is the absence drawn as a presence so that it can be pointed at.'
  },
  builder: {
    method:
      'I read the contract source and describe what it does, not what its documentation says it does. Where ' +
      'the two disagree the source is the fact and the documentation is a claim about the fact.',
    limit:
      'Knowing how a mechanism works is not knowing whether it should exist. I can tell you exactly what a ' +
      'fee does to a transaction and nothing at all about whether it should be charged.',
    accentNote: 'The struck colour, for the part of a fastening that a tool has actually touched.'
  }
};

/**
 * One persona, as a document.
 *
 * The front matter is machine-readable so a gallery can group a wizard's work
 * without parsing prose; the body is written for a reader. The accent hex is
 * included because it is the one fact that ties a persona to its mark and to
 * its plates, and a reader looking at three collections should be able to
 * confirm the colour claim rather than take it on trust.
 */
export function renderPersonaDoc(wizard) {
  const persona = getPersona(wizard);
  const account = ACCOUNTS[persona.id];
  if (!account) {
    throw new Error(`no persona account written for "${persona.id}"`);
  }
  const accent = ACCENTS[persona.id];
  if (!accent) {
    throw new Error(`no accent colour resolved for "${persona.id}"`);
  }

  const doc = [
    '---',
    `wizard: ${persona.id}`,
    `name: ${persona.name}`,
    `wallet: ${persona.wallet}`,
    `voice: ${persona.voice}`,
    `accent: ${accent}`,
    'kind: persona',
    '---',
    '',
    `# ${persona.name}`,
    '',
    HONESTY_PREAMBLE,
    '',
    '## Concern',
    '',
    `${persona.concern}.`,
    '',
    '## Method',
    '',
    account.method,
    '',
    '## What I am not able to do',
    '',
    account.limit,
    '',
    '## Accent',
    '',
    `${accent}. ${account.accentNote}`,
    '',
    'This colour appears in my mark and in every plate I draw. It is the only thing that identifies my ' +
      'work by sight rather than by reading the chain.',
    '',
    '## Terms that apply to all three of us',
    '',
    STANDING_TERMS,
    '',
    '## Standing',
    '',
    'This document is the root of everything I inscribe. It cites nothing, because there was nothing before ' +
      'it to cite. Every plate, mark and manifest that carries my name cites this id, so a reader can follow ' +
      'any single piece of my work back to the account I gave of myself before I made any of it.',
    '',
    'I cannot amend it. If I turn out to have described myself wrongly, the description stays and the ' +
      'correction is a separate inscription that this one will never point to.',
    ''
  ].join('\n');

  assertPersonaFitsOneChunk(doc, persona.id);
  return doc;
}

/**
 * A persona must be one chunk.
 *
 * Not a hard protocol limit -- `mint-single-tx` takes up to 32 -- but a
 * deliberate one. A single-chunk body is read back with one `get-chunk(id, u0)`
 * call, which is what every gate in the pipeline uses to compare on-chain bytes
 * to regenerated bytes. A persona that spilled into a second chunk would pass a
 * gate that had only compared its first 16 KiB.
 */
export function assertPersonaFitsOneChunk(doc, label = 'persona') {
  const bytes = byteLength(doc);
  if (bytes > CHUNK_SIZE) {
    throw new Error(
      `the ${label} persona is ${bytes} bytes and a single chunk holds ${CHUNK_SIZE}. The gates read chunk u0 ` +
        'and compare it whole, so a two-chunk persona would be verified on its first half only.'
    );
  }
  return bytes;
}

/** Every persona document, in the rotation's order. */
export const PERSONA_DOCS = () =>
  PERSONAS.map((persona) => ({
    wizard: persona.id,
    tokenUri: tokenUriForPersona(persona.id),
    mime: PERSONA_MIME,
    dependencies: PERSONA_DEPENDENCIES,
    body: renderPersonaDoc(persona.id)
  }));

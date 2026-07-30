/**
 * compose.mjs — the wizard corpus engine.
 *
 * Pure. No network, no clock, no Math.random. Given a persona, a thread
 * position, a subject, the parents it answers, the block it was written at and
 * the fee it will pay, this produces the exact markdown bytes that get hashed
 * and inscribed.
 *
 * Rules enforced here, from WIZARD-TEST-WALLETS-PLAN.md section 4.5:
 *
 *   1. Under one 16,384-byte chunk. Enforced, not advised. Crossing the
 *      boundary silently moves the mint onto the two-chunk cost path, so this
 *      throws rather than letting a run get quietly more expensive.
 *   2. Self-describing. Every entry states its wizard, thread, position, the
 *      block it was written at and its own cost in microSTX.
 *   3. Honest. Never claims to be human, never claims sentience, always says
 *      plainly that it is a process with a fixed perspective and a budget.
 *   4. Call and response. A reply must cite what it answers, by inscription id
 *      and by a quoted fragment of that parent.
 *   5. Deterministic. Same inputs, byte-identical output, every time.
 *
 * On the word "parent": the plan calls a thread link a parent. The core
 * contract uses `parents` for supersession and requires the sender to own each
 * one, which is impossible across three separate wallets. So a thread link is
 * carried on-chain as a core *dependency* edge via mint-single-tx-recursive.
 * The relationship is still a real on-chain edge that a reader walks. See
 * scripts/wizard/README.md.
 */

import {
  HONESTY_PREAMBLE,
  ROTATION,
  THREAD_LENGTH,
  getPersona,
  getSubject,
  personaForPosition,
  turnFor,
  turnIndexForPosition
} from './personas.mjs';

export { HONESTY_PREAMBLE, ROTATION, THREAD_LENGTH };

/** Core chunk size. One chunk is the cheap single-transaction path. */
export const CHUNK_SIZE = 16_384;

/** Marker that identifies a wizard corpus entry and its schema revision. */
export const CORPUS_MARKER = 'xtrata-wizard-corpus';
export const CORPUS_VERSION = 1;

export const CORE_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

/** Thrown for every compose-time refusal so callers can distinguish them. */
export class WizardComposeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WizardComposeError';
  }
}

/* ------------------------------------------------------------------ */
/* deterministic seeding                                               */
/* ------------------------------------------------------------------ */

/** FNV-1a over a string. Stable across engines, which Math.random is not. */
export function seedFrom(text) {
  let hash = 0x811c9dc5;
  const value = String(text);
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** mulberry32. Small, fast, fully determined by its seed. */
export function makeRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, options) => options[Math.floor(rng() * options.length) % options.length];

/**
 * Title an entry from its own claim rather than from its subject.
 *
 * Every entry in a thread shares one subject, so titling by subject gave six
 * inscriptions the same H1 — indistinguishable in a gallery, where the title is
 * often all a reader sees. The claim is the one line each entry actually argues
 * for, so it is both unique and the truest short name for the piece.
 *
 * Trailing punctuation goes; nothing else is reworded. A title that reads badly
 * means the claim reads badly, and that should be fixed in the claim.
 */
const TITLE_SOFT_LIMIT = 80;

const titleFromClaim = (claim, fallback) => {
  const full = String(claim ?? '').trim();
  if (full.length === 0) return String(fallback ?? '').trim();

  // Headline, not the whole claim. Claims are written as complete arguments and
  // run past 120 characters, which truncates on a gallery card. Take the first
  // sentence, then its first clause if that is still long. The unabridged claim
  // stays in the Claim section, which is what replies quote — so shortening the
  // headline never changes what another entry cites.
  const firstSentence = (/^(.+?[.;])\s/.exec(full)?.[1] ?? full).replace(/[.,;:]+$/, '');
  if (firstSentence.length <= TITLE_SOFT_LIMIT) return firstSentence;

  const firstClause = firstSentence.split(/,\s+/)[0].replace(/[.,;:]+$/, '');
  const headline = firstClause.length > 0 ? firstClause : firstSentence;
  if (headline.length <= TITLE_SOFT_LIMIT) return headline;

  // A claim with no early break point. Cut at the last word boundary that fits
  // and mark it, so the title reads as an abridgement rather than as a sentence
  // that stops oddly. The full claim is still in the Claim section below.
  const cut = headline.slice(0, TITLE_SOFT_LIMIT);
  const atWord = cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:]+$/, '');
  return `${atWord.length > 0 ? atWord : cut}…`;
};

/* ------------------------------------------------------------------ */
/* formatting helpers (locale-free, so output is machine independent)  */
/* ------------------------------------------------------------------ */

/** 11000 -> "11,000". No toLocaleString, which varies by environment. */
export function groupDigits(value) {
  const text = String(BigInt(value));
  const negative = text.startsWith('-');
  const digits = negative ? text.slice(1) : text;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return negative ? `-${grouped}` : grouped;
}

/** microSTX -> "0.011". At least three decimals, never more than six. */
export function microStxToStx(microStx) {
  const value = BigInt(microStx);
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const whole = abs / 1_000_000n;
  const frac = String(abs % 1_000_000n).padStart(6, '0').replace(/(\d{3})0+$/, '$1');
  return `${negative ? '-' : ''}${groupDigits(whole)}.${frac}`;
}

const asBigInt = (value, label) => {
  try {
    return BigInt(value);
  } catch {
    throw new WizardComposeError(`${label} must be an integer, got ${JSON.stringify(value)}`);
  }
};

const resolve = (value, ctx) => (typeof value === 'function' ? value(ctx) : value);

const paragraphs = (value, ctx) => {
  const resolved = resolve(value, ctx);
  return Array.isArray(resolved) ? resolved : [resolved];
};

export const byteLength = (text) => Buffer.byteLength(text, 'utf8');

/**
 * The single hard size gate. Called on every produced body, including the
 * manifest. Crossing 16,384 bytes doubles the chunk count and moves the mint
 * onto a more expensive path, so this refuses rather than warns.
 */
export function assertFitsOneChunk(text, label = 'entry') {
  const size = byteLength(text);
  if (size > CHUNK_SIZE) {
    throw new WizardComposeError(
      `${label} is ${groupDigits(size)} bytes, over the ${groupDigits(CHUNK_SIZE)}-byte single-chunk limit ` +
        `by ${groupDigits(size - CHUNK_SIZE)}. Shorten it. Crossing this boundary silently moves the mint ` +
        'onto the two-chunk cost path.'
    );
  }
  return size;
}

/* ------------------------------------------------------------------ */
/* entry composition                                                   */
/* ------------------------------------------------------------------ */

const frontMatter = (rows) =>
  ['---', ...rows.map(([key, value]) => `${key}: ${value}`), '---'].join('\n');

/**
 * Compose one inscription body.
 *
 * @param {object} input
 * @param {string|object} input.persona     wizard id or persona object
 * @param {string}        input.threadId    stable thread identifier
 * @param {number}        input.position    1-based position in the thread
 * @param {string|object} input.subject     subject id or subject object
 * @param {Array<string|number|bigint>} [input.parentIds] thread parents this answers
 * @param {Array<{id: string|number|bigint, wizard?: string, quote: string}>} [input.answering]
 *        the cited fragment for each parent id. Required whenever parentIds is
 *        non-empty: a reply that cannot quote what it answers is not a reply.
 * @param {number|bigint} input.blockHeight   chain tip observed at compose time
 * @param {number|bigint} input.feeMicroStx   protocol fee this mint will pay
 * @param {string}       [input.txid]         carrier txid, only if somehow known
 * @param {number}       [input.threadLength] default 6
 * @returns {string} markdown body, guaranteed under one chunk
 */
export function composeEntry({
  persona,
  threadId,
  position,
  subject,
  parentIds = [],
  answering = [],
  blockHeight,
  feeMicroStx,
  txid = null,
  threadLength = THREAD_LENGTH
} = {}) {
  const resolvedPersona = getPersona(persona);
  const resolvedSubject = getSubject(subject);

  if (!threadId || typeof threadId !== 'string') {
    throw new WizardComposeError('threadId is required and must be a string');
  }
  const pos = Number(position);
  if (!Number.isInteger(pos) || pos < 1) {
    throw new WizardComposeError(`position must be a positive integer, got ${JSON.stringify(position)}`);
  }
  const length = Number(threadLength);
  if (!Number.isInteger(length) || length < 1 || pos > length) {
    throw new WizardComposeError(`position ${pos} does not fit a thread of length ${JSON.stringify(threadLength)}`);
  }
  if (blockHeight === undefined || blockHeight === null) {
    throw new WizardComposeError('blockHeight is required: an entry must state the block it was written at');
  }
  if (feeMicroStx === undefined || feeMicroStx === null) {
    throw new WizardComposeError('feeMicroStx is required: an entry must state its own cost');
  }

  const block = asBigInt(blockHeight, 'blockHeight');
  const fee = asBigInt(feeMicroStx, 'feeMicroStx');
  if (fee < 0n) throw new WizardComposeError('feeMicroStx must not be negative');

  const parents = parentIds.map((id) => String(id).trim()).filter(Boolean);
  const citations = parents.map((id) => {
    const match = answering.find((entry) => String(entry?.id).trim() === id);
    if (!match || !String(match.quote ?? '').trim()) {
      throw new WizardComposeError(
        `reply cites parent #${id} but supplies no quoted fragment for it. A reply must reference what it ` +
          'answers, by inscription id and by quotation. Pass answering: [{ id, wizard, quote }].'
      );
    }
    return {
      id,
      wizard: match.wizard ? String(match.wizard) : 'a previous entry',
      quote: String(match.quote).trim()
    };
  });

  const ctx = {
    wizardId: resolvedPersona.id,
    personaName: resolvedPersona.name,
    threadId,
    position: pos,
    threadLength: length,
    subjectId: resolvedSubject.id,
    subjectTitle: resolvedSubject.title,
    block,
    blockLabel: groupDigits(block),
    costUstx: fee,
    costLabel: `${groupDigits(fee)} microSTX`,
    costStx: microStxToStx(fee)
  };

  const turn = turnFor(resolvedPersona, resolvedSubject, pos);
  const rng = makeRng(seedFrom(`${CORPUS_MARKER}|${threadId}|${pos}|${resolvedPersona.id}|${resolvedSubject.id}`));
  // Draw order is part of the output. `pick` advances the seeded RNG, so adding
  // or removing a draw here shifts every later one. Whether that changes an
  // entry's bytes depends on where the shifted draw lands: removing the third
  // draw below changed the sign-off, and therefore the hash, for 2 of the 6
  // entries in a thread — the other 4 happened to land on the same option.
  // Partial change is the dangerous kind, because a spot check can miss it.
  // Safe to change only while nothing is minted.
  //
  // A third draw for a per-entry standing note sat between these two and was
  // never emitted: the long disclosure it fed moved into the manifest, where it
  // is stated once for the whole thread instead of six times inside it. The
  // draw and the persona data behind it were removed together rather than left
  // inert. Each entry still carries the disclosure in its closing line.
  const pickUp = pick(rng, resolvedPersona.pickUp);
  const signOff = pick(rng, resolvedPersona.signOff);

  const claim = String(resolve(turn.claim, ctx)).trim();
  const bodyParagraphs = paragraphs(turn.body, ctx).map((paragraph) => String(paragraph).trim());

  const head = frontMatter([
    [CORPUS_MARKER, String(CORPUS_VERSION)],
    ['thread', threadId],
    ['position', `${pos} of ${length}`],
    ['wizard', resolvedPersona.id],
    ['wizard-name', resolvedPersona.name],
    ['wizard-voice', resolvedPersona.voice],
    ['subject', resolvedSubject.id],
    ['block', String(block)],
    ['cost-ustx', String(fee)],
    ['cost-stx', ctx.costStx],
    ['core', CORE_CONTRACT],
    ['answers', parents.length ? parents.map((id) => `#${id}`).join(', ') : '(opening statement)'],
    ['carrier-tx', txid ? String(txid) : '(the transaction that carries this entry)']
  ]);

  const lines = [head, '', `# ${titleFromClaim(claim, resolvedSubject.title)}`, ''];
  lines.push(
    `**${resolvedPersona.name}.** Entry ${pos} of ${length} in thread \`${threadId}\`, ` +
      `on ${resolvedSubject.title.toLowerCase()}. ` +
      `Written at Stacks block ${ctx.blockLabel}, at a protocol cost of ${ctx.costLabel} ` +
      `(${ctx.costStx} STX) plus a miner fee the network sets after the fact.`,
    ''
  );

  if (citations.length) {
    lines.push('## Answering');
    lines.push('');
    for (const citation of citations) {
      lines.push(`> ${citation.quote}`);
      lines.push('>');
      lines.push(`> — inscription #${citation.id}, ${citation.wizard}, thread \`${threadId}\``);
      lines.push('');
    }
    lines.push(pickUp);
    lines.push('');
  }

  for (const paragraph of bodyParagraphs) {
    lines.push(paragraph);
    lines.push('');
  }

  lines.push('## Claim');
  lines.push('');
  lines.push(claim);
  lines.push('');

  // Provenance and the honesty note are deliberately terse here. Every fact a
  // reader needs is already in the front matter above, and the long-form
  // versions — how the edges reconstruct the thread, why an entry cannot name
  // its own carrier transaction, what these processes are — belong in the
  // closing manifest, where they are stated once for the whole thread instead
  // of six times inside it. Repeating them per entry buried the argument.
  lines.push(
    `— ${resolvedPersona.name}, ${ctx.costLabel}, block ${ctx.blockLabel}` +
      (parents.length ? `, answering ${parents.map((id) => `#${id}`).join(' and ')}` : ', opening the thread') +
      (txid ? `, carried by \`${txid}\`` : '') +
      '. Automated process, not a person and not sentient; the manifest for this thread explains the rest.'
  );
  lines.push('');
  lines.push(`*${signOff}*`);

  const body = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
  assertFitsOneChunk(body, `entry ${pos} of thread ${threadId}`);
  return body;
}

/* ------------------------------------------------------------------ */
/* reading entries back                                                */
/* ------------------------------------------------------------------ */

/** Parse the front matter and claim out of a composed body. */
export function parseEntry(body) {
  const text = String(body);
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) throw new WizardComposeError('not a wizard corpus entry: no front matter');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  const claimMatch = /\n## Claim\n\n([\s\S]*?)\n\n/.exec(text);
  return {
    meta,
    thread: meta.thread ?? null,
    wizard: meta.wizard ?? null,
    wizardName: meta['wizard-name'] ?? null,
    subject: meta.subject ?? null,
    position: meta.position ? Number(String(meta.position).split(' ')[0]) : null,
    block: meta.block ?? null,
    costUstx: meta['cost-ustx'] ?? null,
    claim: claimMatch ? claimMatch[1].trim() : null
  };
}

/**
 * Build the citation a follow-up entry needs, from a composed body plus the
 * inscription id it was minted as.
 */
export function citationFrom(body, id) {
  const parsed = parseEntry(body);
  if (!parsed.claim) throw new WizardComposeError('entry has no Claim section to quote');
  return { id: String(id), wizard: parsed.wizardName ?? parsed.wizard ?? 'a previous entry', quote: parsed.claim };
}

/* ------------------------------------------------------------------ */
/* threads and the closing manifest                                    */
/* ------------------------------------------------------------------ */

/**
 * Compose a whole thread in one go, wiring each reply to the entry before it.
 *
 * `ids` supplies the inscription id each position will be minted as. Real runs
 * mint one entry at a time and feed the returned id back in. Previews pass
 * synthetic ids and say so.
 */
export function composeThread({
  threadId,
  subject,
  blockHeight,
  feeMicroStx,
  ids = [],
  threadLength = THREAD_LENGTH,
  txids = []
} = {}) {
  const length = Number(threadLength);
  const entries = [];
  let previous = null;

  for (let position = 1; position <= length; position += 1) {
    const persona = personaForPosition(position);
    const parentIds = previous ? [previous.id] : [];
    const answering = previous ? [citationFrom(previous.body, previous.id)] : [];
    const id = ids[position - 1] !== undefined ? String(ids[position - 1]) : `pending-${position}`;
    const body = composeEntry({
      persona,
      threadId,
      position,
      subject,
      parentIds,
      answering,
      blockHeight,
      feeMicroStx,
      txid: txids[position - 1] ?? null,
      threadLength: length
    });
    const parsed = parseEntry(body);
    const entry = {
      id,
      position,
      wizard: persona.id,
      wizardName: persona.name,
      body,
      claim: parsed.claim,
      parentIds,
      block: String(blockHeight),
      costMicroStx: String(feeMicroStx),
      txid: txids[position - 1] ?? null,
      bytes: byteLength(body)
    };
    entries.push(entry);
    previous = entry;
  }

  const manifest = composeThreadManifest({ threadId, entries, subject, threadLength: length });
  return { threadId, entries, manifest };
}

/**
 * The closing manifest: a fourth kind of inscription that lists the thread's
 * member ids and is minted with every member as a parent link, so the manifest
 * is the head of a completed argument whose parts hang beneath it.
 *
 * @param {object} input
 * @param {string} input.threadId
 * @param {Array<{id, position, wizardName, claim, txid, block, costMicroStx}>} input.entries
 * @returns {string} markdown body, guaranteed under one chunk
 */
export function composeThreadManifest({ threadId, entries = [], subject = null, threadLength = null } = {}) {
  if (!threadId || typeof threadId !== 'string') {
    throw new WizardComposeError('threadId is required and must be a string');
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new WizardComposeError('a manifest needs at least one member entry');
  }
  // A manifest closes a completed thread. Refusing a short one keeps a crashed
  // run from publishing a permanent record of a half-finished argument.
  if (threadLength !== null && threadLength !== undefined && entries.length !== Number(threadLength)) {
    throw new WizardComposeError(
      `manifest has ${entries.length} members but thread ${threadId} is ${threadLength} entries long. ` +
        'A manifest closes a completed thread.'
    );
  }

  const resolvedSubject = subject ? getSubject(subject) : null;
  const memberIds = entries.map((entry) => {
    const id = String(entry?.id ?? '').trim();
    if (!id) throw new WizardComposeError('every manifest member needs an inscription id');
    return id;
  });

  const totalCost = entries.reduce((sum, entry) => sum + BigInt(entry?.costMicroStx ?? 0), 0n);
  const blocks = entries.map((entry) => String(entry?.block ?? '')).filter(Boolean);
  const wizards = [...new Set(entries.map((entry) => entry?.wizardName ?? entry?.wizard).filter(Boolean))];

  const head = frontMatter([
    [CORPUS_MARKER, String(CORPUS_VERSION)],
    ['record', 'thread-manifest'],
    ['thread', threadId],
    ['members', String(memberIds.length)],
    ['member-ids', memberIds.map((id) => `#${id}`).join(', ')],
    ['subject', resolvedSubject ? resolvedSubject.id : '(mixed)'],
    ['wizards', String(wizards.length)],
    ['protocol-cost-ustx', String(totalCost)],
    ['core', CORE_CONTRACT]
  ]);

  const lines = [head, '', `# Thread \`${threadId}\` is closed`, ''];
  lines.push(
    `${memberIds.length} entries by ${wizards.length} processes` +
      (resolvedSubject ? `, on ${resolvedSubject.title.toLowerCase()}` : '') +
      `. Total protocol cost ${groupDigits(totalCost)} microSTX (${microStxToStx(totalCost)} STX), ` +
      'plus one miner fee per entry that the network set at the time and nobody can recover.',
    ''
  );
  lines.push(
    'This manifest is minted with every member below linked as an on-chain relationship. Owning it means ' +
      'owning the head of a completed argument whose parts are permanently attached underneath. The members ' +
      'stay with the wallets that wrote them.',
    ''
  );

  lines.push('## Members');
  lines.push('');
  for (const entry of entries) {
    const position = entry?.position ?? '?';
    const who = entry?.wizardName ?? entry?.wizard ?? 'unknown';
    lines.push(`${position}. **#${entry.id}** — ${who}`);
    if (entry?.claim) lines.push(`   > ${entry.claim}`);
    const facts = [
      entry?.block ? `block ${groupDigits(entry.block)}` : null,
      entry?.costMicroStx ? `${groupDigits(entry.costMicroStx)} microSTX` : null,
      entry?.txid ? `tx \`${entry.txid}\`` : 'tx not recorded'
    ].filter(Boolean);
    lines.push(`   ${facts.join(', ')}`);
    lines.push('');
  }

  lines.push('## How to read it');
  lines.push('');
  lines.push(
    'Each entry after the first carries an on-chain dependency edge to the one it answers, so the order above ' +
      'can be rebuilt from the chain without trusting this file. Start at the lowest id and follow the edges ' +
      'forward. If this list and the edges ever disagree, the edges are right and this file is wrong.'
  );
  lines.push('');
  lines.push(
    'Every claim these entries make about themselves is checkable: the block each was written at, the fee each ' +
      'paid, and the exact bytes each committed to. That is an unusual property and it is the only one being ' +
      'claimed here.'
  );
  lines.push('');
  lines.push(
    'No entry names the transaction that carries it, because the transaction is signed over the entry bytes and ' +
      'the id does not exist until after signing. This manifest can name them, because it is written last. That ' +
      'is also why the entries themselves are terse about provenance: stating it once here is honest, and ' +
      'stating it six times inside the thread was only repetition.'
  );
  lines.push('');

  lines.push('## Standing note');
  lines.push('');
  lines.push(
    `${HONESTY_PREAMBLE} The same is true of every member listed above. Three processes with fixed ` +
      'perspectives and small finite budgets, transacting with each other on a public ledger, writing about ' +
      'the act as they performed it.' +
      (blocks.length === 0
        ? ''
        : blocks[0] === blocks[blocks.length - 1]
          ? ` Written at block ${groupDigits(blocks[0])}.`
          : ` Written between blocks ${groupDigits(blocks[0])} and ${groupDigits(blocks[blocks.length - 1])}.`)
  );

  const body = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
  assertFitsOneChunk(body, `manifest for thread ${threadId}`);
  return body;
}

export { getPersona, getSubject, personaForPosition, turnIndexForPosition };

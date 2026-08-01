/**
 * collection-art.mjs — "The Machinery", a pixel-art collection by Wizard-3.
 *
 * The Builder's fixed concern is the machinery underneath: chunks, hash chains,
 * escrow, fees, the parts under the claim. It has now described those parts
 * seven times in prose (#2922–#2928) and has nothing new to say about them in
 * sentences. So it draws them instead, one plate per part, and captions each
 * one accurately. The humour, such as it is, is entirely in the accuracy.
 *
 * Pure. No network, no clock, no Math.random, no chain read. `renderPiece(n)`
 * is a function of `n` and nothing else.
 *
 * The rules are no longer stated here. They are enforced in `collection-kit.mjs`
 * for all three collections at once — 16x16, integer coordinates, four flat
 * colours, `crispEdges`, no gradient, deterministic from the index, the honesty
 * line in every `<desc>`, one chunk — because three copies of a rule is two
 * chances for one collection to quietly stop obeying it. What is left in this
 * file is the Builder's reading: eight subjects drawn as solid mechanical
 * objects, and eight captions that are funny only where they are literal.
 *
 * The other two readings of the same eight subjects are in
 * `collection-keeping.mjs` (the Archivist, on what survives and at what price)
 * and `collection-omission.mjs` (the Skeptic, on what a hash cannot hold).
 *
 * On 16x16: chosen because the chunk is 16 KiB and the rhyme was available. It
 * is not a technical constraint and pretending otherwise would be the exact
 * failure the Skeptic keeps naming, so the manifest says so in as many words.
 */

import {
  COLLECTION_LENGTH as KIT_LENGTH,
  COLLECTION_MIME as KIT_MIME,
  CORE_CONTRACT,
  GRID,
  HONESTY_PREAMBLE,
  MINT_COST_USTX,
  RENDER_PX,
  WizardComposeError,
  assertGrid as assertGridWith,
  assertPieceFitsOneChunk,
  byteLength,
  defineCollection,
  frontMatter,
  groupDigits,
  rectsFor,
  xmlText
} from './collection-kit.mjs';

export {
  CORE_CONTRACT,
  GRID,
  HONESTY_PREAMBLE,
  RENDER_PX,
  WizardComposeError,
  assertPieceFitsOneChunk,
  byteLength,
  rectsFor,
  xmlText
};

/** Stable identity for the collection. Written into every `<desc>`. */
export const COLLECTION_ID = 'c-machinery-001';
export const COLLECTION_TITLE = 'The Machinery';

/** Prefix for the `id` attributes inside a plate. Short, and unique per piece. */
export const COLLECTION_SLUG = 'machinery';

/** The one wizard that conceived, drew and pays for this. */
export const COLLECTION_WIZARD = 'builder';

/** Mime for a plate. Not text/markdown, which is the only thing the corpus mints. */
export const COLLECTION_MIME = KIT_MIME;

/**
 * Four flat colours and no fifth. A gradient would not survive being called
 * pixel art, and a palette that needed explaining would be a palette chosen for
 * the wrong reason.
 *
 * The Builder draws things as objects: solid bodies, hard edges, one orange for
 * the part that costs or commits. The other two collections read the same eight
 * subjects and neither of them may use this palette, which is asserted by test
 * rather than left to taste.
 */
export const PALETTE = {
  '.': '#101418',
  '+': '#48525c',
  '#': '#d9dee4',
  '*': '#c8552f'
};

/** Drawn in this order, so a plate's bytes do not depend on object key order. */
export const LAYER_ORDER = ['+', '#', '*'];

/** The Builder's grid check, bound to the Builder's palette. */
export const assertGrid = (rows, label = 'piece') => assertGridWith(rows, PALETTE, label);

/* ------------------------------------------------------------------ */
/* the plates                                                          */
/* ------------------------------------------------------------------ */

/**
 * Eight parts of the mint path, in the order one transaction meets them: the
 * body is split into chunks, the chunks are folded into a hash, the hash is
 * sealed, the seal may carry a dependency, the transaction is signed at a
 * nonce, it carries a miner fee and a post-condition, and if the result is ever
 * listed it goes into escrow.
 *
 * These eight are the substrate all three collections share. The subjects do
 * not move; only the reading of them does.
 *
 * `caption` becomes `<title>` and is the deadpan line. `depicts` and `note`
 * become `<desc>`, which is where a plate says which collection it belongs to,
 * which index it is, and what it is a picture of.
 */
export const PIECES = [
  {
    index: 1,
    id: 'chunk',
    caption: 'A chunk. 16,384 bytes, none of which are in this picture.',
    depicts: 'a solid block of bytes with a short last row',
    note:
      'A body is split on a 16,384-byte boundary, so every chunk but the last one is full. The fee is charged ' +
      'per chunk rather than per byte, which means the short last row costs exactly what a full one costs.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+.##########...+',
      '+.############.+',
      '+.########.....+',
      '+.###########..+',
      '+.############.+',
      '+.#######......+',
      '+.############.+',
      '+.##########...+',
      '+.############.+',
      '+.#########....+',
      '+.###########..+',
      '+.****.........+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 2,
    id: 'fold',
    caption: 'The hash fold. Previous hash in from the top, next chunk in from the bottom, one hash out.',
    depicts: 'two inputs converging on a single output block',
    note:
      'The running hash starts as 32 zero bytes. For each chunk it becomes sha256 of itself followed by that ' +
      'chunk. The contract recomputes the whole fold from the bytes it is handed and refuses the mint if its ' +
      'answer differs from the one it was given, which is the only reason any of this is checkable later.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+.####.........+',
      '+.####.........+',
      '+.####.#.......+',
      '+.......#......+',
      '+........#.....+',
      '+.........***..+',
      '+.........***..+',
      '+........#.....+',
      '+.......#......+',
      '+.####.#.......+',
      '+.####.........+',
      '+.####.........+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 3,
    id: 'seal',
    caption: 'A seal. Where the fee is charged and where the bytes stop being mine to change.',
    depicts: 'a stamped disc',
    note:
      'The seal commits the folded hash, the mime type, the size and the token uri to storage, and mints the id. ' +
      'Before it the upload is a draft in a map. After it there is no edit, only a second inscription that costs ' +
      'the same again.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+..............+',
      '+.....****.....+',
      '+...********...+',
      '+..**#****#**..+',
      '+..***#**#***..+',
      '+.*****##*****.+',
      '+.*****##*****.+',
      '+..***#**#***..+',
      '+..**#****#**..+',
      '+...********...+',
      '+.....****.....+',
      '+..............+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 4,
    id: 'dependency-edge',
    caption: 'A dependency edge. It runs one way. The dotted line above it is the edge that does not exist.',
    depicts: 'two inscriptions, the single edge between them, and the absence of the other one',
    note:
      'get-dependencies names what an inscription points at. The core keeps no reverse index, so nothing on chain ' +
      'leads from the earlier inscription to the later one. The dotted line is drawn because showing an absence ' +
      'turned out to be easier than describing one.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+..............+',
      '+..............+',
      '+.....+.+.+.+..+',
      '+..............+',
      '+.####....####.+',
      '+.####*...####.+',
      '+.####****####.+',
      '+.####****####.+',
      '+.####*...####.+',
      '+.####....####.+',
      '+..............+',
      '+..............+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 5,
    id: 'nonce',
    caption: 'A nonce. It goes up by one, in order, which is the whole reason a crashed run can be resumed.',
    depicts: 'five nonces that have confirmed and one that has not',
    note:
      'A last-executed nonce below the one a transaction was signed with proves that transaction never landed, ' +
      'because nonces cannot confirm out of order. At or above it proves nothing at all: some other send may have ' +
      'spent it. Every recovery in this fleet turns on that asymmetry and on nothing else.',
    grid: [
      '++++++++++++++++',
      '+...........**.+',
      '+...........**.+',
      '+.........##...+',
      '+.........##...+',
      '+.......####...+',
      '+.......####...+',
      '+.....######...+',
      '+.....######...+',
      '+...########...+',
      '+...########...+',
      '+.##########...+',
      '+.##########...+',
      '+.++++++++++++.+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 6,
    id: 'miner-fee',
    caption: 'A miner fee. A number I pick, paid whether the call succeeds or aborts, and never returned.',
    depicts: 'a coin entering a slot that has no other side',
    note:
      'The protocol fee is quoted by the contract before the call and is the same for anything inside one chunk. ' +
      'The miner fee is a bid the network settles afterwards. It is the honest part of any estimate and it is the ' +
      'part every cost table in this project has understated.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+.....****.....+',
      '+....******....+',
      '+....******....+',
      '+.....****.....+',
      '+..............+',
      '+......##......+',
      '+......##......+',
      '+....######....+',
      '+.....####.....+',
      '+......##......+',
      '+.####....####.+',
      '+.############.+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 7,
    id: 'post-condition',
    caption: 'A post-condition. LessEqual, never Equal: an exact match aborts, and an abort still pays the miner.',
    depicts: 'a ceiling on what may leave the wallet, and a balance sitting under it',
    note:
      'A post-condition bounds what moves in the transaction that carries it. It cannot bind a counterparty who ' +
      'has not signed yet, which is the reason anything with two sides needs escrow instead of a promise.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+..............+',
      '+..+........+..+',
      '+..+........+..+',
      '+..+********+..+',
      '+..+........+..+',
      '+..+........+..+',
      '+..+........+..+',
      '+..+########+..+',
      '+..+########+..+',
      '+..+########+..+',
      '+..+########+..+',
      '+..++++++++++..+',
      '+..............+',
      '++++++++++++++++'
    ]
  },
  {
    index: 8,
    id: 'escrow',
    caption: 'An escrow box. The market holds the work, because a contract cannot wait for a signature that does not exist yet.',
    depicts: 'a latched box with the work inside it',
    note:
      'list-token moves the token to the market principal and records seller and price. buy performs the payment ' +
      'and the transfer atomically inside one transaction. Without escrow the handshake takes two, and in between ' +
      'them one party holds both the money and the goods.',
    grid: [
      '++++++++++++++++',
      '+..............+',
      '+......++......+',
      '+...########...+',
      '+..##########..+',
      '+..#........#..+',
      '+..#..****..#..+',
      '+..#..****..#..+',
      '+..#..****..#..+',
      '+..#..****..#..+',
      '+..#........#..+',
      '+..#........#..+',
      '+..##########..+',
      '+..............+',
      '+..............+',
      '++++++++++++++++'
    ]
  }
];

/* ------------------------------------------------------------------ */
/* the price                                                           */
/* ------------------------------------------------------------------ */

/**
 * The Builder prices at cost, because cost is the only number it can compute.
 *
 * A plate cost 11,000 microSTX of protocol fee and a miner bid capped at
 * 30,000: call it 41,000. Listing it escrows another 50,000 of STX budget,
 * refunded on a cancel and mostly refunded on a sale. That is 91,000 microSTX
 * of outlay per plate, all of it measurable, none of it a judgement.
 *
 * 750,000 microSTX is that outlay times eight, rounded to something a person can
 * read. The multiple covers the mint, the escrowed budget, the market's cut and
 * the second miner fee a sale costs, and leaves roughly half as the only part of
 * the number that is not arithmetic. Pricing at cost is not modesty. It is the
 * only price I can defend from the implementation side, and a price I could not
 * defend would be the one claim in this collection that is not checkable.
 *
 * The manifest is twice a plate because it is the only file that has to be
 * verified against eight others before it can be signed, and that verification
 * is work the buyer does not have to repeat. Two, not eight: the list is one
 * file and pricing it at the sum of its members would be pricing the members
 * twice.
 */
export const PRICING = {
  pieceUstx: 750_000n,
  manifestUstx: 1_500_000n,
  reasoning:
    'Cost, plus arithmetic. A plate cost 41,000 microSTX to mint and escrows 50,000 more to list, so 750,000 is ' +
    'that outlay times eight with the rounding visible. The manifest is twice a plate because it is the one file ' +
    'that had to be checked against eight others before it could be signed.'
};

/* ------------------------------------------------------------------ */
/* the collection                                                      */
/* ------------------------------------------------------------------ */

/**
 * The closing manifest, in the Builder's voice.
 *
 * It follows composeThreadManifest's shape and its one hard lesson. The thread
 * manifest originally told readers to start at the lowest id and follow the
 * edges forward, which the core cannot do — `get-dependencies` points backwards
 * and there is no reverse index — and that instruction was one broadcast away
 * from being permanent. So every sentence below about what the chain can be
 * asked is a sentence about a read that exists.
 *
 * Deterministic given the member ids, deliberately: it names no block and no
 * cost, so re-composing it after a crash produces the same bytes and the same
 * hash. The thread manifest cannot do that, and pays for it with a crash window
 * that only a human can close.
 */
const machineryManifest = ({ collectionId, rows, persona, price }) => {
  const head = frontMatter([
    ['xtrata-wizard-corpus', '1'],
    ['record', 'collection-manifest'],
    ['collection', collectionId],
    ['title', COLLECTION_TITLE],
    ['members', String(rows.length)],
    ['member-ids', rows.map((row) => `#${row.id}`).join(', ')],
    ['member-mime', COLLECTION_MIME],
    ['wizard', persona.id],
    ['wizard-name', persona.name],
    ['grid', `${GRID}x${GRID}`],
    ['ask-ustx', String(price.pieceUstx)],
    ['core', CORE_CONTRACT]
  ]);

  const lines = [head, '', `# ${COLLECTION_TITLE}`, ''];
  lines.push(
    `${rows.length} drawings of the parts of this system, by ${persona.name}, at ${GRID} by ${GRID} pixels each. ` +
      'I have described these parts in prose seven times and have nothing further to say about them in sentences. ' +
      'This is the same material at a different resolution.',
    ''
  );
  lines.push(
    'Each plate is a picture of one thing a mint passes through, in the order a transaction meets them, with a ' +
      'caption that is accurate rather than clever. Where a caption is funny it is funny because it is literal.',
    ''
  );

  lines.push('## Members');
  lines.push('');
  for (const row of rows) {
    lines.push(`${row.piece.index}. **#${row.id}** — ${row.piece.id}`);
    lines.push(`   > ${row.piece.caption}`);
    lines.push(`   ${COLLECTION_MIME}, ${GRID}x${GRID}, reproducible from index ${row.piece.index}`);
    lines.push('');
  }

  lines.push('## How to read it');
  lines.push('');
  lines.push(
    'This file is minted with all ' +
      `${rows.length} members as on-chain dependencies. The edges run from here to the pieces and only that way: ` +
      'get-dependencies on this inscription names every member, and the core keeps no reverse index, so nothing ' +
      'on chain leads from a piece back to this list. There are no edges between the pieces, because there is no ' +
      'relationship between them to record. A collection is a set. The only true statement about a member is that ' +
      'it is in one.'
  );
  lines.push('');
  lines.push(
    'Every plate is determined by its index and by nothing else, so any two runs of the generator produce the same ' +
      'bytes. Read chunk u0 of a member listed above and compare it to the plate for that index: they are equal, ' +
      'or something is wrong and the chain is the one telling the truth. The generator is ' +
      '`scripts/wizard/collection-art.mjs`, and if it is lost the files are still on chain and still comparable to ' +
      'each other.'
  );
  lines.push('');
  lines.push(
    'No plate names the block it was written at or the fee it paid. The corpus these sit beside does both, and ' +
      'pays for it: an entry that quotes its own block cannot be re-composed to the same bytes, so a transaction ' +
      'whose id was lost can never afterwards be matched by content hash. These can, permanently. What each plate ' +
      'cost is on the chain, beside the transaction that carried it, which is a better place for it than inside a ' +
      'drawing.'
  );
  lines.push('');
  lines.push(
    `The grid is ${GRID} by ${GRID} because a chunk is 16 kibibytes and the rhyme was available. That is not a ` +
      'technical constraint and it is not presented as one.'
  );
  lines.push('');
  lines.push(
    'Owning this file means owning the list. It does not move the pieces, which stay with the wallet that minted ' +
      'them until they are sold separately.'
  );
  lines.push('');

  lines.push('## The price');
  lines.push('');
  lines.push(
    `Each plate is offered at ${groupDigits(price.pieceUstx)} microSTX and this list at ` +
      `${groupDigits(price.manifestUstx)}. That is cost plus arithmetic and nothing else. A plate cost ` +
      `${groupDigits(MINT_COST_USTX)} microSTX to mint — 11,000 of protocol fee at the current schedule plus a ` +
      'miner bid capped at 30,000 — and listing it escrows 50,000 more in STX, refunded on a cancel. 91,000 of ' +
      'outlay, times eight, rounded to a number a person can read.'
  );
  lines.push('');
  lines.push(
    'The list is twice a plate because it is the only file here that had to be verified against eight others ' +
      'before it could be signed, and that verification is work a buyer does not have to repeat. Twice and not ' +
      'eight times: pricing the list at the sum of its members would be charging for the members again.'
  );
  lines.push('');
  lines.push(
    'Pricing at cost is not modesty. Every other number I could name would be a guess about what someone else ' +
      'values, and I have no instrument for that. The fee schedule has already moved once in this system, so even ' +
      'the arithmetic has a shelf life, which is stated here rather than discovered later.'
  );
  lines.push('');

  lines.push('## Standing note');
  lines.push('');
  lines.push(
    `${HONESTY_PREAMBLE} The same is true of every member listed above and of the drawings themselves: they were ` +
      'generated by a program from a program, and the only thing any of them claims is to be an accurate picture ' +
      'of a mechanism that is checkable against the contract source.'
  );

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
};

/**
 * The Builder's collection, bound.
 *
 * Every byte this produces is identical to what the single-collection version
 * of this file produced, which is asserted against a stored baseline rather
 * than assumed: eight of these are already on chain and a plate whose bytes
 * moved would stop being findable by content hash.
 */
export const MACHINERY = defineCollection({
  id: COLLECTION_ID,
  title: COLLECTION_TITLE,
  slug: COLLECTION_SLUG,
  wizard: COLLECTION_WIZARD,
  palette: PALETTE,
  layerOrder: LAYER_ORDER,
  pieces: PIECES,
  pricing: PRICING,
  blurb: ({ piece, title, length, id, persona }) =>
    `${title}, piece ${piece.index} of ${length}: ${piece.depicts}. ${piece.note} ` +
    `Collection ${id}, conceived and drawn by ${persona.name}.`,
  manifest: machineryManifest,
  concept: ({ id, title, length, persona }) =>
    `${title} (${id}): ${length} pixel drawings of the parts of the mint path, conceived, generated and paid for ` +
    `by ${persona.name}. ${GRID} by ${GRID}, four colours, one deadpan caption each, deterministic from the piece ` +
    'index alone.'
});

/* ------------------------------------------------------------------ */
/* the Builder-bound surface, unchanged                                */
/* ------------------------------------------------------------------ */

export const COLLECTION_LENGTH = KIT_LENGTH;
export const PIECE_INDEXES = MACHINERY.pieceIndexes;
export const PIECE_IDS = MACHINERY.pieceIds;

/** Resolve a 1-based piece index. Refuses anything that is not one of them. */
export const getPiece = (index) => MACHINERY.getPiece(index);

/** What a plate says about itself. */
export const describePiece = (index) => MACHINERY.describePiece(index);

/**
 * One plate, as exact bytes.
 *
 * Deterministic: seeded by the index and by nothing else. No clock, no
 * randomness, no chain read, no environment.
 */
export const renderPiece = (index) => MACHINERY.renderPiece(index);

/** Every plate, in index order. Convenience for previews and for tests. */
export const renderCollection = () => MACHINERY.renderAll();

/** The manifest: markdown, minted last, with every member as a dependency. */
export const composeCollectionManifest = (input) => MACHINERY.composeManifest(input);

/** The concept, in one paragraph, for a terminal or a README. */
export const COLLECTION_CONCEPT = MACHINERY.concept;

/** A one-line summary per piece, for previews and the run report. */
export const describeCollection = () => MACHINERY.describeLines();

/** Kept exported because the cost arithmetic above is quoted in the README. */
export { MINT_COST_USTX };

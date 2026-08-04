/**
 * collection-keeping.mjs — "The Cost of Keeping", a pixel-art collection by
 * Wizard-1, the Archivist.
 *
 * Same eight subjects as The Machinery: chunk, fold, seal, dependency edge,
 * nonce, miner fee, post-condition, escrow. That is deliberate and it is the
 * whole idea. The Builder drew them as apparatus, because its concern is how
 * they work. The Archivist's concern is what is preserved and what permanence
 * costs, so it draws the same eight as things held, stacked, borne and paid
 * for. A chunk is not a data structure here; it is what fitted, and by
 * implication what did not. A seal is a promise kept. A miner fee is the price
 * of the record.
 *
 * The visual language is weight. Every plate stands on a shelf and every shelf
 * stands on a line of bronze, because nothing in an archive is holding itself
 * up and nothing in one is free. Forms are layered and bear on each other
 * rather than sitting side by side. Where the Builder draws a mechanism working,
 * this draws a load being carried.
 *
 * Pure. No network, no clock, no Math.random, no chain read. The rules — 16x16,
 * integer coordinates, four flat colours, `crispEdges`, deterministic from the
 * index, the honesty line in every `<desc>`, one chunk — are enforced in
 * `collection-kit.mjs` for all three collections at once.
 */

import {
  CORE_CONTRACT,
  GRID,
  HONESTY_PREAMBLE,
  defineCollection,
  frontMatter,
  groupDigits
} from './collection-kit.mjs';

export const COLLECTION_ID = 'c-keeping-001';
export const COLLECTION_TITLE = 'The Cost of Keeping';
export const COLLECTION_SLUG = 'keeping';
export const COLLECTION_WIZARD = 'archivist';

/**
 * Vellum on iron, over ground, with bronze for whatever was paid.
 *
 * Warm and restrained where the Builder's palette is cold and industrial, and
 * sharing no colour with it. The bronze is the accent because it appears in
 * every plate as the bottom line — the price under the shelf — and an accent
 * that is present everywhere has to be a colour that can be looked at for a
 * long time without becoming an alarm.
 */
export const PALETTE = {
  '.': '#14110d',
  '+': '#4a443a',
  '#': '#e6dcc8',
  '*': '#b08d3f'
};

export const LAYER_ORDER = ['+', '#', '*'];

export const PIECES = [
  {
    index: 1,
    id: 'chunk',
    caption: 'A chunk. What fitted. What did not fit was decided against before anything was signed.',
    depicts: 'a stack of leaves with the last one short',
    note:
      'A body is split on a 16,384-byte boundary and the fee is charged per chunk, so the short leaf on top cost ' +
      'exactly what a full one cost. Nothing on chain records what was cut to make the rest fit. That decision is ' +
      'the one part of this whose trace is nowhere, and it is usually the part a later reader would want.',
    grid: [
      '................',
      '..#####.........',
      '..#####.........',
      '................',
      '..############..',
      '..############..',
      '................',
      '..############..',
      '..############..',
      '................',
      '..############..',
      '..############..',
      '................',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 2,
    id: 'fold',
    caption: 'The fold. Each chunk is laid on everything already laid, and the pile is named by its whole weight.',
    depicts: 'layers stacked widest at the bottom, under the name of the whole',
    note:
      'The running hash starts as 32 zero bytes and becomes sha256 of itself followed by each chunk in turn. ' +
      'Disturb one layer and the name of the pile changes. That is what makes the order part of the record rather ' +
      'than a convention about the record, and it is the only ordering guarantee an archive has ever been given ' +
      'for free.',
    grid: [
      '................',
      '...**********...',
      '................',
      '......####......',
      '......####......',
      '................',
      '....########....',
      '....########....',
      '................',
      '..############..',
      '..############..',
      '................',
      '################',
      '################',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 3,
    id: 'seal',
    caption: 'A seal. A promise kept at the moment it stops being possible to break it.',
    depicts: 'a sheet tied shut, with the seal pressed where the tie crosses it',
    note:
      'The seal commits the folded hash, the mime type, the size and the token uri, and mints the id. Before it, a ' +
      'draft in a map. After it, no edit — only a second inscription at the same price, which is a correction and ' +
      'not a revision. Every archive has wanted this and every archive before this one had to approximate it with ' +
      'a locked room.',
    grid: [
      '................',
      '..#####**#####..',
      '..#####**#####..',
      '..#####**#####..',
      '..#####**#####..',
      '..####****####..',
      '..###******###..',
      '..###******###..',
      '..####****####..',
      '..#####**#####..',
      '..#####**#####..',
      '..#####**#####..',
      '................',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 4,
    id: 'dependency-edge',
    caption: 'A dependency. The later record rests on the earlier one, which bears the weight and was never told.',
    depicts: 'a narrower record resting on a wider one, through a bearing course',
    note:
      'get-dependencies names what an inscription points at. The core keeps no reverse index, so the earlier ' +
      'record carries the later one with no way of knowing that it does. Every catalogue works this way. Nothing ' +
      'that was ever catalogued was asked first.',
    grid: [
      '................',
      '....########....',
      '....########....',
      '....########....',
      '....########....',
      '....********....',
      '....********....',
      '.##############.',
      '.##############.',
      '.##############.',
      '.##############.',
      '.##############.',
      '................',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 5,
    id: 'nonce',
    caption: 'A nonce. Order kept one at a time, so that the empty place can be named.',
    depicts: 'four volumes in order and the fifth place, kept empty',
    note:
      'Nonces cannot confirm out of order, so a last-executed nonce below the one a transaction was signed with ' +
      'proves that transaction never landed. At or above it proves nothing. Every recovery this fleet performs ' +
      'rests on the empty place being nameable, which is the same property that lets a shelf be audited without ' +
      'reading a single volume.',
    grid: [
      '................',
      '................',
      '................',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.**.**.**.**.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '.##.##.##.##.++.',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 6,
    id: 'miner-fee',
    caption: 'A miner fee. The price of the record, paid to whoever keeps the shelf, and not returned.',
    depicts: 'a leaf of vellum weighed against what it cost to keep',
    note:
      'The protocol fee is quoted before the call and is the same for anything inside one chunk. The miner fee is ' +
      'a bid the network settles afterwards, and it is paid whether the call succeeds or aborts. An archive that ' +
      'does not name its running cost is an archive whose ending nobody has budgeted for, and that is how most of ' +
      'them ended.',
    grid: [
      '.......++.......',
      '.......++.......',
      '.......++.......',
      '..++++++++++++..',
      '...+........+...',
      '...+........+...',
      '...+........+...',
      '..###......***..',
      '..###......***..',
      '..###......***..',
      '.+++++....+++++.',
      '..+++......+++..',
      '................',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 7,
    id: 'post-condition',
    caption: 'A post-condition. A limit set in advance, because afterwards there is no limit left to set.',
    depicts: 'a bound standing over what it bounds, with room to spare',
    note:
      'A post-condition bounds what may move in the transaction that carries it. LessEqual and not Equal: an exact ' +
      'match aborts, and an abort still pays the miner. The only editorial control that survives signing is the ' +
      'one applied before it, which is the whole discipline of this medium stated as a single sentence.',
    grid: [
      '................',
      '..************..',
      '..************..',
      '..++........++..',
      '..++........++..',
      '..++........++..',
      '..++........++..',
      '..++........++..',
      '..++########++..',
      '..++########++..',
      '..++########++..',
      '..++########++..',
      '..++########++..',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  },
  {
    index: 8,
    id: 'escrow',
    caption: 'Escrow. The work is held by a custodian that cannot be persuaded, for as long as the listing stands.',
    depicts: 'a chest, lidded and padlocked, standing on the shelf',
    note:
      'list-token moves the token to the market principal and records seller and price. The seller does not own it ' +
      'while the listing stands and gets it back only by cancelling. An auction house takes the painting. What is ' +
      'new is that this custodian publishes its rules before the goods are handed over. What is not new is that it ' +
      'can be paused by an admin.',
    grid: [
      '................',
      '................',
      '.##############.',
      '.##############.',
      '.##############.',
      '..############..',
      '..#####**#####..',
      '..####****####..',
      '..####****####..',
      '..####****####..',
      '..############..',
      '..############..',
      '..############..',
      '................',
      '++++++++++++++++',
      '****************'
    ]
  }
];

/* ------------------------------------------------------------------ */
/* the price                                                           */
/* ------------------------------------------------------------------ */

/**
 * The Archivist prices for permanence, which means it does not price the work.
 *
 * The cost of making a plate is 41,000 microSTX and it is already spent. It is
 * not recoverable and it is not relevant: a buyer is not reimbursing me, and a
 * price set at cost would be the price of a thing I still had, which is not the
 * situation. What is for sale is my agreement to stop keeping this.
 *
 * So the price is a threshold rather than a valuation. 2,500,000 microSTX is
 * roughly sixty times what the plate cost to put on chain — not because sixty
 * means anything, but because a threshold has to be a number and I would rather
 * name the multiple than pretend the number arrived from somewhere. It is the
 * point past which I would rather have the STX than the entry, and the only
 * honest thing to say about where that point sits is that I chose it.
 *
 * The manifest is 3,000,000, the highest price in this fleet, because the list
 * is the only object in the collection that says what the collection was. Lose
 * a plate and eight remain and one is missing. Lose the list and there was
 * never a collection, only eight files that happen to share a generator. That
 * asymmetry is the whole of an archivist's job and it is worth one increment
 * over a member.
 */
export const PRICING = {
  pieceUstx: 2_500_000n,
  manifestUstx: 3_000_000n,
  reasoning:
    'A threshold, not a valuation. What it cost to mint is spent and is not what is being sold; what is being ' +
    'sold is my agreement to stop keeping it. 2,500,000 microSTX is about sixty times the mint cost, and the ' +
    'multiple is stated because the number did not come from anywhere else. The manifest is dearer than any ' +
    'member because losing a member leaves a gap and losing the list leaves no collection.'
};

/* ------------------------------------------------------------------ */
/* the manifest                                                        */
/* ------------------------------------------------------------------ */

const keepingManifest = ({ collectionId, rows, persona, price }) => {
  const head = frontMatter([
    ['xtrata-wizard-corpus', '1'],
    ['record', 'collection-manifest'],
    ['collection', collectionId],
    ['title', COLLECTION_TITLE],
    ['members', String(rows.length)],
    ['member-ids', rows.map((row) => `#${row.id}`).join(', ')],
    ['member-mime', 'image/svg+xml'],
    ['wizard', persona.id],
    ['wizard-name', persona.name],
    ['grid', `${GRID}x${GRID}`],
    ['ask-ustx', String(price.pieceUstx)],
    ['core', CORE_CONTRACT]
  ]);

  const lines = [head, '', `# ${COLLECTION_TITLE}`, ''];
  lines.push(
    `${rows.length} drawings by ${persona.name}, at ${GRID} by ${GRID} pixels each, of the eight things a mint ` +
      'passes through. The Builder drew the same eight first and drew them as apparatus. These are the same eight ' +
      'read as objects that have to be held: what fitted, what bears the weight, what was paid, and what is ' +
      'holding the work while a listing stands.',
    ''
  );
  lines.push(
    'Nothing here is a variation on that earlier set. A collection that changed the colours and kept the pictures ' +
      'would be a reprint, and a reprint filed as a new work is the first thing a catalogue is supposed to catch.',
    ''
  );

  lines.push('## Members');
  lines.push('');
  for (const row of rows) {
    lines.push(`${row.piece.index}. **#${row.id}** — ${row.piece.id}`);
    lines.push(`   > ${row.piece.caption}`);
    lines.push(`   image/svg+xml, ${GRID}x${GRID}, reproducible from index ${row.piece.index}`);
    lines.push('');
  }

  lines.push('## How to read it');
  lines.push('');
  lines.push(
    `This file is minted with all ${rows.length} members as on-chain dependencies. The edges run from here to the ` +
      'pieces and only that way: get-dependencies on this inscription names every member, the core keeps no ' +
      'reverse index, and nothing on chain leads from a piece back to this list. There are no edges between the ' +
      'pieces, because there is no relationship between them to record. A collection is a set.'
  );
  lines.push('');
  lines.push(
    'Every plate is determined by its index and by nothing else. Read chunk u0 of any member above and compare it ' +
      'to the plate that index generates: they are equal, or something is wrong and the chain is the one telling ' +
      'the truth. The generator is `scripts/wizard/collection-keeping.mjs`. If it is lost, the files remain on ' +
      'chain and remain comparable to each other, which is the weaker of the two properties and the one that ' +
      'outlasts the stronger.'
  );
  lines.push('');
  lines.push(
    'No plate names the block it was written at or the fee it paid. That is a loss and it is taken deliberately. ' +
      'An entry that quotes its own block cannot be composed twice to the same bytes, so a transaction whose id ' +
      'was mislaid can never afterwards be matched by content hash. These can, permanently. What each cost is ' +
      'recorded beside the transaction that carried it, where a cost belongs.'
  );
  lines.push('');

  lines.push('## The price');
  lines.push('');
  lines.push(
    `Each plate is offered at ${groupDigits(price.pieceUstx)} microSTX and this list at ` +
      `${groupDigits(price.manifestUstx)}. What a plate cost to put on chain is spent, unrecoverable, and not what ` +
      'is being sold. What is being sold is an agreement to stop keeping it. So the number is a threshold rather ' +
      'than a valuation: the point past which I would rather hold the payment than the entry. It is about sixty ' +
      'times the mint cost, and the multiple is written down because the number came from nowhere else.'
  );
  lines.push('');
  lines.push(
    'The list is dearer than any member. Lose a plate and eight remain with a gap in them. Lose the list and there ' +
      'was never a collection, only eight files that share a generator. Neither price is a prediction that anyone ' +
      'will pay it.'
  );
  lines.push('');
  lines.push(
    'Owning this file means owning the list. It does not move the pieces, which stay with the wallet that minted ' +
      'them until they are sold separately.'
  );
  lines.push('');

  lines.push('## Standing note');
  lines.push('');
  lines.push(
    `${HONESTY_PREAMBLE} The same is true of every member listed above. What is being claimed is small and ` +
      'checkable: that these are accurate pictures of mechanisms readable in the contract source, and that the ' +
      'bytes on chain are the bytes this generator produces. Nothing here claims the drawings are good, and ' +
      'nothing here claims anybody asked for them.'
  );

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
};

export const KEEPING = defineCollection({
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
    `Collection ${id}, conceived and drawn by ${persona.name}, on what is preserved and what permanence costs.`,
  manifest: keepingManifest,
  concept: ({ id, title, length, persona }) =>
    `${title} (${id}): ${length} pixel drawings of the same eight parts of the mint path the Builder drew, read ` +
    `by ${persona.name} as things held, borne and paid for. ${GRID} by ${GRID}, four colours, one declarative ` +
    'caption each, deterministic from the piece index alone.'
});

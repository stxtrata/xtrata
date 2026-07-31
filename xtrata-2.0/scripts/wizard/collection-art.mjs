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
 * Rules enforced here:
 *
 *   1. Under one 16,384-byte chunk. Same gate as the corpus, delegated to
 *      compose.mjs rather than restated, because two implementations of "does
 *      this fit" is one too many. Crossing the boundary silently moves the mint
 *      onto the two-chunk cost path.
 *   2. Deterministic from the index alone. Deliberately *stronger* than the
 *      corpus, which cannot manage it: a corpus entry names the block it was
 *      written at, so re-composing it later produces different bytes and a
 *      different hash. A plate names no block and no cost. That makes
 *      `get-id-by-hash` a permanently decisive probe for these files — a
 *      crashed run can always ask the chain again, forever, and get an answer.
 *      It is also why nothing here reads the chain: a plate that quoted its own
 *      fee would forfeit the property to say something the chain already says
 *      next to the transaction that carried it.
 *   3. Honest. The disclosure in every `<desc>` is `HONESTY_PREAMBLE`, imported
 *      verbatim from personas.mjs. It is the one claim in this corpus that must
 *      never drift, and a second copy of the wording is a second thing to drift.
 *   4. Genuinely pixel art. A fixed 16x16 grid, integer coordinates, four flat
 *      colours, `shape-rendering="crispEdges"`, no gradient and no blur. It
 *      reads as pixel art at any zoom because it is pixel art at every zoom.
 *
 * On 16x16: chosen because the chunk is 16 KiB and the rhyme was available. It
 * is not a technical constraint and pretending otherwise would be the exact
 * failure the Skeptic keeps naming, so the manifest says so in as many words.
 */

import { HONESTY_PREAMBLE, getPersona } from './personas.mjs';
import { CORE_CONTRACT, WizardComposeError, assertFitsOneChunk, byteLength, groupDigits } from './compose.mjs';

export { CORE_CONTRACT, HONESTY_PREAMBLE, WizardComposeError, byteLength };

/** Stable identity for the collection. Written into every `<desc>`. */
export const COLLECTION_ID = 'c-machinery-001';
export const COLLECTION_TITLE = 'The Machinery';

/** Prefix for the `id` attributes inside a plate. Short, and unique per piece. */
export const COLLECTION_SLUG = 'machinery';

/** The one wizard that conceived, drew and pays for this. */
export const COLLECTION_WIZARD = 'builder';

/** Mime for a plate. Not text/markdown, which is the only thing the corpus mints. */
export const COLLECTION_MIME = 'image/svg+xml';

/** The drawing grid. Every coordinate in every plate is an integer in [0, 16]. */
export const GRID = 16;

/**
 * The `width`/`height` the plate declares. The viewBox is the grid, so this is
 * only a default display size; a gallery that ignores it and scales the SVG
 * gets identical pixels, because there is nothing in here that resolves
 * differently at a different scale.
 */
export const RENDER_PX = 512;

/**
 * Four flat colours and no fifth. A gradient would not survive being called
 * pixel art, and a palette that needed explaining would be a palette chosen for
 * the wrong reason.
 */
export const PALETTE = {
  '.': '#101418',
  '+': '#48525c',
  '#': '#d9dee4',
  '*': '#c8552f'
};

/** Drawn in this order, so a plate's bytes do not depend on object key order. */
export const LAYER_ORDER = ['+', '#', '*'];

/**
 * Every grid is 16 rows of 16 characters drawn from the palette. Checked at
 * import rather than at render: a malformed plate should be impossible to load,
 * not merely impossible to mint.
 */
export function assertGrid(rows, label = 'piece') {
  if (!Array.isArray(rows) || rows.length !== GRID) {
    throw new WizardComposeError(`${label} must be ${GRID} rows, got ${Array.isArray(rows) ? rows.length : typeof rows}`);
  }
  for (const [index, row] of rows.entries()) {
    if (typeof row !== 'string' || row.length !== GRID) {
      throw new WizardComposeError(
        `${label} row ${index} must be ${GRID} characters, got ${typeof row === 'string' ? row.length : typeof row}`
      );
    }
    for (const character of row) {
      if (!(character in PALETTE)) {
        throw new WizardComposeError(`${label} row ${index} uses "${character}", which is not in the palette`);
      }
    }
  }
  return rows;
}

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

for (const piece of PIECES) assertGrid(piece.grid, `piece ${piece.index} (${piece.id})`);

export const COLLECTION_LENGTH = PIECES.length;
export const PIECE_INDEXES = PIECES.map((piece) => piece.index);
export const PIECE_IDS = PIECES.map((piece) => piece.id);

const BY_INDEX = new Map(PIECES.map((piece) => [piece.index, piece]));

/** Resolve a 1-based piece index. Refuses anything that is not one of them. */
export function getPiece(index) {
  const key = Number(index);
  const piece = BY_INDEX.get(key);
  if (!piece) {
    throw new WizardComposeError(
      `"${index}" is not a piece in ${COLLECTION_TITLE}. Pieces are ${PIECE_INDEXES.join(', ')}.`
    );
  }
  return piece;
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

/**
 * Maximal rectangles for one colour, greedily, in a fixed scan order.
 *
 * One `<rect>` per pixel would be 256 of them per plate and would still be
 * pixel art, just wasteful pixel art on a medium that charges by the chunk. So
 * each run is extended right as far as it goes and then down as far as an
 * identical free run continues. Scan order is top-to-bottom, left-to-right and
 * never varies, which is what makes the output byte-stable.
 */
export function rectsFor(rows, character) {
  const filled = rows.map((row) => [...row].map((cell) => cell === character));
  const used = rows.map(() => new Array(GRID).fill(false));
  const rects = [];

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      if (!filled[y][x] || used[y][x]) continue;

      let width = 1;
      while (x + width < GRID && filled[y][x + width] && !used[y][x + width]) width += 1;

      let height = 1;
      for (;;) {
        const next = y + height;
        if (next >= GRID) break;
        let matches = true;
        for (let offset = 0; offset < width; offset += 1) {
          if (!filled[next][x + offset] || used[next][x + offset]) {
            matches = false;
            break;
          }
        }
        if (!matches) break;
        height += 1;
      }

      for (let row = y; row < y + height; row += 1) {
        for (let column = x; column < x + width; column += 1) used[row][column] = true;
      }
      rects.push({ x, y, width, height });
    }
  }
  return rects;
}

/** Text content only. Attribute values here are generated, never user input. */
export const xmlText = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * What a plate says about itself: which collection, which index, what it is a
 * picture of, how it was made, and the standing honesty note.
 *
 * No block height and no cost, unlike a corpus entry. That is the trade this
 * collection makes and the reason it can promise byte-reproducibility from the
 * index alone.
 */
export function describePiece(index) {
  const piece = getPiece(index);
  const persona = getPersona(COLLECTION_WIZARD);
  return (
    `${COLLECTION_TITLE}, piece ${piece.index} of ${COLLECTION_LENGTH}: ${piece.depicts}. ${piece.note} ` +
    `Collection ${COLLECTION_ID}, conceived and drawn by ${persona.name}. ` +
    `${GRID} by ${GRID} pixels, integer coordinates, four flat colours, no gradient and no blur. These bytes ` +
    'are a function of the piece index alone, so this file can be reproduced without reading the chain and ' +
    `compared to what the chain holds. ${HONESTY_PREAMBLE}`
  );
}

/**
 * The single hard size gate, delegated to the corpus engine so there is one
 * implementation of the 16,384-byte rule in this directory.
 *
 * The gate is the chunk boundary and not the much smaller size these plates
 * actually come out at, because the chunk boundary is the thing that costs
 * money. That a plate stays near 2 KB is a property worth having and is
 * asserted by test, where a number that has to be revised is cheap.
 */
export function assertPieceFitsOneChunk(svg, label = 'piece') {
  return assertFitsOneChunk(svg, label);
}

/**
 * One plate, as exact bytes.
 *
 * Deterministic: seeded by the index and by nothing else. No clock, no
 * randomness, no chain read, no environment.
 */
export function renderPiece(index) {
  const piece = getPiece(index);
  const titleId = `${COLLECTION_SLUG}-${piece.index}-title`;
  const descId = `${COLLECTION_SLUG}-${piece.index}-desc`;

  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" width="${RENDER_PX}" height="${RENDER_PX}" ` +
      `shape-rendering="crispEdges" role="img" aria-labelledby="${titleId} ${descId}">`,
    `<title id="${titleId}">${xmlText(piece.caption)}</title>`,
    `<desc id="${descId}">${xmlText(describePiece(piece.index))}</desc>`,
    `<rect width="${GRID}" height="${GRID}" fill="${PALETTE['.']}"/>`
  ];

  for (const character of LAYER_ORDER) {
    const rects = rectsFor(piece.grid, character);
    if (rects.length === 0) continue;
    lines.push(`<g fill="${PALETTE[character]}">`);
    for (const rect of rects) {
      lines.push(`<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"/>`);
    }
    lines.push('</g>');
  }
  lines.push('</svg>');

  const svg = `${lines.join('\n')}\n`;
  assertPieceFitsOneChunk(svg, `piece ${piece.index} (${piece.id}) of ${COLLECTION_ID}`);
  return svg;
}

/** Every plate, in index order. Convenience for previews and for tests. */
export const renderCollection = () =>
  PIECES.map((piece) => ({
    index: piece.index,
    id: piece.id,
    caption: piece.caption,
    svg: renderPiece(piece.index),
    bytes: byteLength(renderPiece(piece.index))
  }));

/* ------------------------------------------------------------------ */
/* the closing manifest                                                */
/* ------------------------------------------------------------------ */

const frontMatter = (rows) =>
  ['---', ...rows.map(([key, value]) => `${key}: ${value}`), '---'].join('\n');

/**
 * The manifest: markdown, minted last, with every member as a dependency.
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
 *
 * @param {object} input
 * @param {string} input.collectionId
 * @param {Array<{index: number, id: string|number}>} input.members
 * @returns {string} markdown body, guaranteed under one chunk
 */
export function composeCollectionManifest({
  collectionId = COLLECTION_ID,
  members = [],
  collectionLength = COLLECTION_LENGTH
} = {}) {
  if (!collectionId || typeof collectionId !== 'string') {
    throw new WizardComposeError('collectionId is required and must be a string');
  }
  if (!Array.isArray(members) || members.length === 0) {
    throw new WizardComposeError('a manifest needs at least one member');
  }
  // A manifest closes a finished collection. Refusing a short one keeps a
  // crashed run from publishing a permanent list of a collection that is not
  // all there, with no way to add the rest afterwards.
  if (collectionLength !== null && collectionLength !== undefined && members.length !== Number(collectionLength)) {
    throw new WizardComposeError(
      `manifest has ${members.length} members but ${collectionId} is ${collectionLength} pieces. ` +
        'A manifest closes a complete collection.'
    );
  }

  const persona = getPersona(COLLECTION_WIZARD);
  const rows = members.map((member) => {
    const id = String(member?.id ?? '').trim();
    if (!id) throw new WizardComposeError('every manifest member needs an inscription id');
    // The piece the id is claimed to be, resolved from the piece bank rather
    // than from whatever the caller passed alongside it. A manifest that took
    // the caller's word for which drawing an id holds could name the wrong one.
    return { id, piece: getPiece(member?.index) };
  });

  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.piece.index)) {
      throw new WizardComposeError(`piece ${row.piece.index} is listed twice in the manifest for ${collectionId}`);
    }
    seen.add(row.piece.index);
  }

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

  lines.push('## Standing note');
  lines.push('');
  lines.push(
    `${HONESTY_PREAMBLE} The same is true of every member listed above and of the drawings themselves: they were ` +
      'generated by a program from a program, and the only thing any of them claims is to be an accurate picture ' +
      'of a mechanism that is checkable against the contract source.'
  );

  const body = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
  assertFitsOneChunk(body, `manifest for collection ${collectionId}`);
  return body;
}

/** The concept, in one paragraph, for a terminal or a README. */
export const COLLECTION_CONCEPT =
  `${COLLECTION_TITLE} (${COLLECTION_ID}): ${COLLECTION_LENGTH} pixel drawings of the parts of the mint path, ` +
  `conceived, generated and paid for by ${getPersona(COLLECTION_WIZARD).name}. ${GRID} by ${GRID}, four colours, ` +
  'one deadpan caption each, deterministic from the piece index alone.';

/** A one-line summary per piece, for previews and the run report. */
export const describeCollection = () =>
  PIECES.map((piece) => {
    const svg = renderPiece(piece.index);
    return `  ${String(piece.index).padStart(2)}. ${piece.id.padEnd(16)} ${String(groupDigits(byteLength(svg))).padStart(6)} bytes  ${piece.caption}`;
  });

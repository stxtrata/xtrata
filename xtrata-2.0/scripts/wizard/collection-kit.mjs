/**
 * collection-kit.mjs — the drawing engine three collections share.
 *
 * One wizard drew one collection first. `collection-art.mjs` held the grid
 * rules, the greedy run-merge, the size gate and the manifest scaffolding
 * alongside the Builder's own eight plates, which was correct while there was
 * one of them and wrong the moment there were three. Three copies of "does this
 * fit in a chunk" is two too many, and three copies of the rasteriser is three
 * chances for one collection to drift into producing bytes the others cannot.
 *
 * So the mechanism lives here and the *readings* live in the three collection
 * files. What a plate is — 16x16, integer coordinates, four flat colours,
 * `crispEdges`, no gradient, deterministic from the index alone, honest in its
 * `<desc>`, under one chunk — is decided once, here, and cannot be opted out of
 * by a collection that finds it inconvenient.
 *
 * What a collection supplies is a palette, a layer order, eight grids, eight
 * captions, the prose for its own manifest and a price it can argue for. What
 * it does not supply is any way to render differently.
 *
 * Pure. No network, no clock, no Math.random, no chain read. Every function
 * here is a function of its arguments and nothing else.
 */

import { HONESTY_PREAMBLE, getPersona } from './personas.mjs';
import { CORE_CONTRACT, WizardComposeError, assertFitsOneChunk, byteLength, groupDigits } from './compose.mjs';

export { CORE_CONTRACT, HONESTY_PREAMBLE, WizardComposeError, byteLength, groupDigits, getPersona };

/** The drawing grid. Every coordinate in every plate is an integer in [0, 16]. */
export const GRID = 16;

/**
 * The `width`/`height` a plate declares. The viewBox is the grid, so this is
 * only a default display size; a gallery that ignores it and scales the SVG
 * gets identical pixels, because there is nothing in a plate that resolves
 * differently at a different scale.
 */
export const RENDER_PX = 512;

/** Mime for a plate. Not text/markdown, which is the only thing the corpus mints. */
export const COLLECTION_MIME = 'image/svg+xml';

/** Every collection is eight plates and one manifest. Asserted, not assumed. */
export const COLLECTION_LENGTH = 8;

/** The four palette slots, in the order a plate declares them. */
export const PALETTE_KEYS = ['.', '+', '#', '*'];

/**
 * Every grid is 16 rows of 16 characters drawn from that collection's palette.
 * Checked at import rather than at render: a malformed plate should be
 * impossible to load, not merely impossible to mint.
 */
export function assertGrid(rows, palette, label = 'piece') {
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
      if (!(character in palette)) {
        throw new WizardComposeError(`${label} row ${index} uses "${character}", which is not in the palette`);
      }
    }
  }
  return rows;
}

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

/** Front matter, in a fixed key order, so a manifest's bytes never depend on one. */
export const frontMatter = (rows) =>
  ['---', ...rows.map(([key, value]) => `${key}: ${value}`), '---'].join('\n');

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
 * The layout is fixed here and not per collection: same element order, same
 * attribute order, same one-rect-per-line. Three collections that agreed on the
 * rules but disagreed on the whitespace would be three formats.
 */
export function renderPlate({ slug, palette, layerOrder, grid, index, caption, desc }) {
  const titleId = `${slug}-${index}-title`;
  const descId = `${slug}-${index}-desc`;

  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" width="${RENDER_PX}" height="${RENDER_PX}" ` +
      `shape-rendering="crispEdges" role="img" aria-labelledby="${titleId} ${descId}">`,
    `<title id="${titleId}">${xmlText(caption)}</title>`,
    `<desc id="${descId}">${xmlText(desc)}</desc>`,
    `<rect width="${GRID}" height="${GRID}" fill="${palette['.']}"/>`
  ];

  for (const character of layerOrder) {
    const rects = rectsFor(grid, character);
    if (rects.length === 0) continue;
    lines.push(`<g fill="${palette[character]}">`);
    for (const rect of rects) {
      lines.push(`<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"/>`);
    }
    lines.push('</g>');
  }
  lines.push('</svg>');

  return `${lines.join('\n')}\n`;
}

/**
 * The standing tail of every `<desc>`: how the file was made, what property
 * that buys, and the honesty disclosure imported verbatim from personas.mjs.
 *
 * Shared across all three collections deliberately. The disclosure is the one
 * claim in this corpus that must never drift, and three wordings of it is three
 * things to drift. The sentence about reproducibility is here for the same
 * reason: it is a promise about the generator, not a matter of voice, and a
 * collection that reworded it could quietly weaken it.
 */
export const PLATE_PROVENANCE =
  `${GRID} by ${GRID} pixels, integer coordinates, four flat colours, no gradient and no blur. These bytes ` +
  'are a function of the piece index alone, so this file can be reproduced without reading the chain and ' +
  `compared to what the chain holds. ${HONESTY_PREAMBLE}`;

/* ------------------------------------------------------------------ */
/* pricing                                                             */
/* ------------------------------------------------------------------ */

/**
 * What a plate cost to put on chain, at the schedule these were minted under.
 *
 * 11,000 microSTX protocol fee for anything inside one chunk, plus a miner bid
 * the runner caps at 30,000. Both numbers are live and both have moved before,
 * which is exactly why a price expressed as a multiple of them is stated with
 * the multiple visible rather than as a round number with a story attached.
 */
export const MINT_COST_USTX = 41_000n;

/**
 * The escrowed sponsorship budget a sponsored listing takes, in STX, on all
 * three markets. Refunded in full on cancel. A price below this is a price that
 * cannot pay for its own listing.
 */
export const LISTING_BUDGET_USTX = 50_000n;

/** Every price in this directory sits in this band, so the fleet can trade with itself. */
export const PRICE_FLOOR_USTX = 500_000n;
export const PRICE_CEILING_USTX = 3_000_000n;

/**
 * A price is a position, so it is validated like one: inside the band, a whole
 * number of microSTX, and above the cost of listing it. A collection that
 * priced below its own listing budget would lose money on every sale and the
 * reasoning in its manifest would be fiction.
 */
export function assertPricing(pricing, label = 'collection') {
  const check = (value, name) => {
    let amount;
    try {
      amount = BigInt(value);
    } catch {
      throw new WizardComposeError(`${label} ${name} must be an integer number of microSTX`);
    }
    if (amount < PRICE_FLOOR_USTX || amount > PRICE_CEILING_USTX) {
      throw new WizardComposeError(
        `${label} ${name} is ${groupDigits(amount)} microSTX, outside the ${groupDigits(PRICE_FLOOR_USTX)} to ` +
          `${groupDigits(PRICE_CEILING_USTX)} band every wizard price sits in so the fleet can still trade with itself.`
      );
    }
    if (amount <= MINT_COST_USTX + LISTING_BUDGET_USTX) {
      throw new WizardComposeError(
        `${label} ${name} is ${groupDigits(amount)} microSTX, at or below what it costs to mint and list the thing ` +
          `(${groupDigits(MINT_COST_USTX + LISTING_BUDGET_USTX)}). A sale would cost more than it returned.`
      );
    }
    return amount;
  };
  if (!pricing?.reasoning || typeof pricing.reasoning !== 'string') {
    throw new WizardComposeError(`${label} pricing needs written reasoning: a price with no argument is a round number`);
  }
  return { pieceUstx: check(pricing.pieceUstx, 'piece price'), manifestUstx: check(pricing.manifestUstx, 'manifest price') };
}

/* ------------------------------------------------------------------ */
/* defining a collection                                               */
/* ------------------------------------------------------------------ */

/**
 * Bind a collection spec into the object every caller uses.
 *
 * The spec supplies the reading: palette, grids, captions, notes, manifest
 * prose and a price. This supplies the mechanism and the refusals, so that a
 * new collection cannot accidentally ship a plate that is not 16x16, a manifest
 * that names a piece twice, a `<desc>` without the honesty line, or a body over
 * one chunk.
 *
 * @param {object} spec
 * @param {string} spec.id            stable collection id, written into every desc
 * @param {string} spec.title
 * @param {string} spec.slug          prefix for the `id` attributes inside a plate
 * @param {string} spec.wizard        the persona that conceived and pays for it
 * @param {Record<string,string>} spec.palette      four flat colours, keyed by grid character
 * @param {string[]} spec.layerOrder                draw order, so bytes do not depend on key order
 * @param {Array<object>} spec.pieces               eight, each { index, id, caption, depicts, note, grid }
 * @param {object} spec.pricing                     { pieceUstx, manifestUstx, reasoning }
 * @param {(input: object) => string} spec.blurb    the one-paragraph reading, for a desc
 * @param {(input: object) => string} spec.manifest the manifest body, in that wizard's voice
 * @param {(input: object) => string} spec.concept  one line for a terminal or a README
 */
export function defineCollection(spec) {
  const {
    id,
    title,
    slug,
    wizard,
    palette,
    layerOrder,
    pieces,
    pricing,
    blurb,
    manifest: manifestBody,
    concept: conceptLine
  } = spec;

  if (!id || typeof id !== 'string') throw new WizardComposeError('a collection needs a string id');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    throw new WizardComposeError(`"${id}" is not a usable collection id: it has to survive being a journal file name`);
  }
  for (const key of PALETTE_KEYS) {
    if (typeof palette?.[key] !== 'string') {
      throw new WizardComposeError(`${id} has no colour for palette slot "${key}"`);
    }
  }
  if (Object.keys(palette).length !== PALETTE_KEYS.length) {
    throw new WizardComposeError(`${id} has ${Object.keys(palette).length} palette entries; four flat colours and no fifth`);
  }
  if (!Array.isArray(layerOrder) || layerOrder.length !== 3 || layerOrder.includes('.')) {
    throw new WizardComposeError(`${id} needs a draw order over the three ink colours, background excluded`);
  }
  if (!Array.isArray(pieces) || pieces.length !== COLLECTION_LENGTH) {
    throw new WizardComposeError(`${id} is ${pieces?.length ?? 0} pieces; a collection here is ${COLLECTION_LENGTH}`);
  }

  const persona = getPersona(wizard);
  const price = assertPricing(pricing, id);

  for (const [position, piece] of pieces.entries()) {
    if (piece.index !== position + 1) {
      throw new WizardComposeError(`${id} piece at position ${position + 1} is indexed ${piece.index}`);
    }
    assertGrid(piece.grid, palette, `${id} piece ${piece.index} (${piece.id})`);
  }

  const byIndex = new Map(pieces.map((piece) => [piece.index, piece]));
  const pieceIndexes = pieces.map((piece) => piece.index);
  const pieceIds = pieces.map((piece) => piece.id);

  /** Resolve a 1-based piece index. Refuses anything that is not one of them. */
  const getPiece = (index) => {
    const piece = byIndex.get(Number(index));
    if (!piece) {
      throw new WizardComposeError(`"${index}" is not a piece in ${title}. Pieces are ${pieceIndexes.join(', ')}.`);
    }
    return piece;
  };

  /**
   * What a plate says about itself: which collection, which index, what it is a
   * picture of, how it was made, and the standing honesty note.
   *
   * No block height and no cost, unlike a corpus entry. That is the trade every
   * collection here makes and the reason each can promise byte-reproducibility
   * from the index alone.
   */
  const describePiece = (index) => {
    const piece = getPiece(index);
    return `${blurb({ piece, title, length: COLLECTION_LENGTH, id, persona })} ${PLATE_PROVENANCE}`;
  };

  const renderPiece = (index) => {
    const piece = getPiece(index);
    const svg = renderPlate({
      slug,
      palette,
      layerOrder,
      grid: piece.grid,
      index: piece.index,
      caption: piece.caption,
      desc: describePiece(piece.index)
    });
    assertPieceFitsOneChunk(svg, `piece ${piece.index} (${piece.id}) of ${id}`);
    return svg;
  };

  /**
   * The closing manifest: markdown, minted last, with every member as a
   * dependency.
   *
   * The validation is here and the prose is in the spec, because every one of
   * these refusals exists to stop a permanent record being wrong and none of
   * them is a matter of voice. A short list would publish an unfinishable
   * collection. A duplicated index would name the same drawing twice. Taking
   * the caller's word for which drawing an id holds could name the wrong one
   * forever, so each row is resolved from the piece bank instead.
   */
  const composeManifest = ({ collectionId = id, members = [], collectionLength = COLLECTION_LENGTH } = {}) => {
    if (!collectionId || typeof collectionId !== 'string') {
      throw new WizardComposeError('collectionId is required and must be a string');
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new WizardComposeError('a manifest needs at least one member');
    }
    if (collectionLength !== null && collectionLength !== undefined && members.length !== Number(collectionLength)) {
      throw new WizardComposeError(
        `manifest has ${members.length} members but ${collectionId} is ${collectionLength} pieces. ` +
          'A manifest closes a complete collection.'
      );
    }

    const rows = members.map((member) => {
      const memberId = String(member?.id ?? '').trim();
      if (!memberId) throw new WizardComposeError('every manifest member needs an inscription id');
      return { id: memberId, piece: getPiece(member?.index) };
    });

    const seen = new Set();
    for (const row of rows) {
      if (seen.has(row.piece.index)) {
        throw new WizardComposeError(`piece ${row.piece.index} is listed twice in the manifest for ${collectionId}`);
      }
      seen.add(row.piece.index);
    }

    const body = manifestBody({ collectionId, rows, persona, title, price });
    assertFitsOneChunk(body, `manifest for collection ${collectionId}`);
    return body;
  };

  const collection = {
    id,
    title,
    slug,
    wizard: persona.id,
    persona,
    mime: COLLECTION_MIME,
    palette,
    layerOrder,
    pieces,
    length: COLLECTION_LENGTH,
    pieceIndexes,
    pieceIds,
    price,
    pricing: { ...price, reasoning: pricing.reasoning },
    getPiece,
    describePiece,
    renderPiece,
    composeManifest,
    renderAll: () =>
      pieces.map((piece) => ({
        index: piece.index,
        id: piece.id,
        caption: piece.caption,
        svg: renderPiece(piece.index),
        bytes: byteLength(renderPiece(piece.index))
      })),
    /** A one-line summary per piece, for previews and the run report. */
    describeLines: () =>
      pieces.map(
        (piece) =>
          `  ${String(piece.index).padStart(2)}. ${piece.id.padEnd(16)} ` +
          `${String(groupDigits(byteLength(renderPiece(piece.index)))).padStart(6)} bytes  ${piece.caption}`
      )
  };

  collection.concept = conceptLine({ ...collection, persona });
  return collection;
}

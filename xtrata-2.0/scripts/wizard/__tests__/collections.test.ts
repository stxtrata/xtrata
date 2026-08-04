import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';

import baseline from './fixtures/machinery-bytes.json';
import {
  COLLECTIONS,
  COLLECTION_IDS,
  DEFAULT_COLLECTION_ID,
  KEEPING,
  MACHINERY,
  OMISSION,
  collectionForWizard,
  describeCollections,
  getCollection
} from '../collections.mjs';
import {
  COLLECTION_LENGTH,
  GRID,
  LISTING_BUDGET_USTX,
  MINT_COST_USTX,
  PRICE_CEILING_USTX,
  PRICE_FLOOR_USTX,
  WizardComposeError,
  assertGrid,
  assertPricing,
  byteLength,
  defineCollection
} from '../collection-kit.mjs';
import { CHUNK_SIZE } from '../compose.mjs';
import { HONESTY_PREAMBLE, getPersona } from '../personas.mjs';

/**
 * Every plate in every collection is small on purpose: the mint is charged per
 * chunk, so three collections fit in twenty-seven transactions only because
 * nothing got fat. The hard gate in the code is the chunk boundary, which is
 * what costs money. This is the aim, and a number that has to be revised
 * deliberately is exactly what a test is for.
 */
const PIECE_BUDGET_BYTES = 3_072;

const parser = new new Window().DOMParser();
const parse = (svg: string) => parser.parseFromString(svg, 'image/svg+xml');
const titleOf = (svg: string) => parse(svg).querySelector('title')?.textContent ?? '';
const descOf = (svg: string) => parse(svg).querySelector('desc')?.textContent ?? '';

type Collection = (typeof COLLECTIONS)[number];

const membersFor = (collection: Collection, ids?: Array<string | number>) =>
  collection.pieces.map((piece: { index: number }, position: number) => ({
    index: piece.index,
    id: String(ids ? ids[position] : 9000 + piece.index)
  }));

const manifestOf = (collection: Collection, ids?: Array<string | number>) =>
  collection.composeManifest({ members: membersFor(collection, ids) });

/**
 * Repaint an SVG's rects onto a blank canvas, in document order, and return the
 * grid that results. If the greedy run-merge ever drops or duplicates a pixel
 * this is where it shows up, rather than in a gallery.
 */
const rasterise = (svg: string, palette: Record<string, string>) => {
  const characterFor = Object.fromEntries(Object.entries(palette).map(([character, colour]) => [colour, character]));
  const doc = parse(svg);
  const rows: string[][] = Array.from({ length: GRID }, () => new Array(GRID).fill('?'));
  for (const rect of Array.from(doc.querySelectorAll('rect'))) {
    const colour = rect.getAttribute('fill') ?? rect.parentElement?.getAttribute('fill') ?? '';
    const character = characterFor[colour];
    expect(character, `unknown fill ${colour}`).toBeTruthy();
    const x = Number(rect.getAttribute('x') ?? 0);
    const y = Number(rect.getAttribute('y') ?? 0);
    for (let row = y; row < y + Number(rect.getAttribute('height')); row += 1) {
      for (let column = x; column < x + Number(rect.getAttribute('width')); column += 1) rows[row][column] = character;
    }
  }
  return rows.map((row) => row.join(''));
};

/* ------------------------------------------------------------------ */
/* the one thing that must not have moved                              */
/* ------------------------------------------------------------------ */

describe('the Builder plates are byte-identical to what they were', () => {
  /**
   * The whole reason the collection engine could be generalised at all. Eight
   * of these plates are meant for chain and are found again by content hash, so
   * a byte that moves is an artifact that can never afterwards be matched. The
   * fixture is the exact output of the single-collection version of the
   * generator, captured before any of this was refactored.
   */
  it('renders every plate exactly as the fixture recorded it', () => {
    for (const piece of MACHINERY.pieces) {
      expect(MACHINERY.renderPiece(piece.index), `piece ${piece.index} (${piece.id}) changed`).toBe(
        (baseline.pieces as Record<string, string>)[String(piece.index)]
      );
    }
  });

  /**
   * The manifest is not one of the eight and is allowed to grow: it now states
   * the Builder's price, which every manifest here does. What it is not allowed
   * to do is lose a sentence, so every paragraph the fixture recorded has to
   * still be present word for word, and the front matter may only have gained
   * the ask.
   */
  it('kept every paragraph of the manifest it had, and added only the price', () => {
    const bodyOf = (markdown: string) => markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
    const after = bodyOf(manifestOf(MACHINERY));
    for (const paragraph of bodyOf(baseline.manifest).split('\n\n').map((part) => part.trim())) {
      if (paragraph.length === 0) continue;
      expect(after, `a paragraph of the manifest was lost: ${paragraph.slice(0, 60)}`).toContain(paragraph);
    }
    expect(after).toContain('## The price');
    expect(after).toContain('Pricing at cost is not modesty.');
  });

  it('changed the manifest front matter by exactly one key', () => {
    const frontMatterOf = (markdown: string) =>
      (/^---\n([\s\S]*?)\n---\n/.exec(markdown)?.[1] ?? '').split('\n').map((line) => line.split(':')[0]);
    const before = frontMatterOf(baseline.manifest);
    const after = frontMatterOf(manifestOf(MACHINERY));
    expect(after.filter((key) => !before.includes(key))).toEqual(['ask-ustx']);
    expect(before.filter((key) => !after.includes(key))).toEqual([]);
  });

  it('kept the palette that made those bytes', () => {
    // The colours are literally in the bytes above, so this is redundant and it
    // is kept anyway: a failure here names the cause, and a failure above only
    // names the symptom.
    expect(MACHINERY.palette).toEqual({ '.': '#101418', '+': '#48525c', '#': '#d9dee4', '*': '#c8552f' });
    expect(MACHINERY.layerOrder).toEqual(['+', '#', '*']);
  });
});

/* ------------------------------------------------------------------ */
/* the registry                                                        */
/* ------------------------------------------------------------------ */

describe('three collections, one per wizard', () => {
  it('registers exactly three, each with a distinct id, title, slug and wizard', () => {
    expect(COLLECTION_IDS).toEqual(['c-machinery-001', 'c-keeping-001', 'c-omission-001']);
    expect(new Set(COLLECTIONS.map((collection) => collection.title)).size).toBe(3);
    expect(new Set(COLLECTIONS.map((collection) => collection.slug)).size).toBe(3);
    expect(new Set(COLLECTIONS.map((collection) => collection.wizard)).size).toBe(3);
    expect(DEFAULT_COLLECTION_ID).toBe(MACHINERY.id);
  });

  it('gives each wizard the collection its fixed concern would produce', () => {
    expect(collectionForWizard('builder')).toBe(MACHINERY);
    expect(collectionForWizard('archivist')).toBe(KEEPING);
    expect(collectionForWizard('skeptic')).toBe(OMISSION);
    expect(collectionForWizard('nobody')).toBeNull();
  });

  it('resolves by id or by an already-resolved collection, and refuses anything else', () => {
    expect(getCollection('c-keeping-001')).toBe(KEEPING);
    expect(getCollection(KEEPING)).toBe(KEEPING);
    expect(getCollection()).toBe(MACHINERY);
    expect(() => getCollection('c-nope-001')).toThrow(/is not a collection/);
    expect(() => getCollection('c-nope-001')).toThrow(WizardComposeError);
  });

  it('names all three in one line each', () => {
    const lines = describeCollections();
    expect(lines).toHaveLength(3);
    expect(lines.join('\n')).toContain('Wizard-1, the Archivist');
    expect(lines.join('\n')).toContain('Wizard-2, the Skeptic');
    expect(lines.join('\n')).toContain('Wizard-3, the Builder');
  });
});

describe('one substrate, three readings', () => {
  it('draws the same eight subjects in the same order in all three', () => {
    const subjects = ['chunk', 'fold', 'seal', 'dependency-edge', 'nonce', 'miner-fee', 'post-condition', 'escrow'];
    for (const collection of COLLECTIONS) {
      expect(collection.pieceIds, collection.id).toEqual(subjects);
      expect(collection.pieceIndexes).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(collection.length).toBe(COLLECTION_LENGTH);
    }
  });

  it('shares no colour between any two palettes, so none of them is a recolour', () => {
    const used = new Map<string, string>();
    for (const collection of COLLECTIONS) {
      for (const colour of Object.values(collection.palette)) {
        expect(used.has(colour as string), `${colour} is in both ${used.get(colour as string)} and ${collection.id}`).toBe(
          false
        );
        used.set(colour as string, collection.id);
      }
    }
    expect(used.size).toBe(12);
  });

  it('draws a genuinely different picture of every subject, not the same grid tinted', () => {
    // The cheapest possible way to fail the brief is a recolour. Two grids for
    // the same subject that differ in no cell would be exactly that, and the
    // palette check above would not catch it.
    for (const piece of MACHINERY.pieces) {
      const grids = COLLECTIONS.map((collection) => collection.getPiece(piece.index).grid.join('\n'));
      expect(new Set(grids).size, `piece ${piece.index} is the same drawing in more than one collection`).toBe(3);
    }
  });

  it('gives every subject a different caption in every collection', () => {
    for (const piece of MACHINERY.pieces) {
      const captions = COLLECTIONS.map((collection) => collection.getPiece(piece.index).caption);
      expect(new Set(captions).size).toBe(3);
    }
    const all = COLLECTIONS.flatMap((collection) => collection.pieces.map((piece: { caption: string }) => piece.caption));
    expect(new Set(all).size).toBe(24);
  });

  it('reads the Skeptic interrogatively and the other two declaratively', () => {
    // A caption is where the reading lives. If the Skeptic stops asking and
    // starts asserting, the collection has stopped being the Skeptic's.
    const asked = OMISSION.pieces.filter((piece: { caption: string }) => piece.caption.includes('?'));
    expect(asked.length).toBe(OMISSION.length);
    for (const collection of [MACHINERY, KEEPING]) {
      for (const piece of collection.pieces) expect(piece.caption).not.toContain('?');
    }
  });

  it('concedes narrow points in the Skeptic notes rather than refusing everything', () => {
    // A skeptic who cannot concede is a contrarian, and this one is paid for by
    // a wallet that cannot afford the difference.
    const notes = OMISSION.pieces.map((piece: { note: string }) => piece.note).join(' ');
    expect(notes.toLowerCase()).toMatch(/concede/);
    expect(OMISSION.pieces.filter((piece: { note: string }) => /concede/i.test(piece.note)).length).toBeGreaterThanOrEqual(4);
  });

  it('keeps each collection on its own wizard concern', () => {
    const keeping = KEEPING.pieces.map((piece: { caption: string; note: string }) => `${piece.caption} ${piece.note}`).join(' ').toLowerCase();
    for (const word of ['cost', 'kept', 'record', 'price', 'order']) expect(keeping).toContain(word);

    const omission = OMISSION.pieces.map((piece: { caption: string; note: string }) => `${piece.caption} ${piece.note}`).join(' ').toLowerCase();
    for (const word of ['nothing', 'not', 'ask']) expect(omission).toContain(word);

    const machinery = MACHINERY.pieces.map((piece: { caption: string }) => piece.caption).join(' ').toLowerCase();
    for (const word of ['chunk', 'hash', 'fee', 'nonce', 'escrow', 'post-condition', 'dependency', 'seal']) {
      expect(machinery).toContain(word);
    }
  });
});

/* ------------------------------------------------------------------ */
/* the rules, enforced once for all three                              */
/* ------------------------------------------------------------------ */

describe('every plate in every collection', () => {
  const everyPlate = (assertion: (svg: string, collection: Collection, index: number) => void) => {
    for (const collection of COLLECTIONS) {
      for (const index of collection.pieceIndexes) assertion(collection.renderPiece(index), collection, index);
    }
  };

  it('is deterministic from its index and from nothing else', () => {
    everyPlate((svg, collection, index) => expect(collection.renderPiece(index)).toBe(svg));
  });

  it('reads no clock and no randomness', () => {
    const now = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('renderPiece read the clock');
    });
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('renderPiece used Math.random');
    });
    try {
      everyPlate(() => {});
    } finally {
      now.mockRestore();
      random.mockRestore();
    }
  });

  it('names no block height and no fee', () => {
    everyPlate((svg) => {
      expect(svg).not.toMatch(/\bblock \d/i);
      expect(svg).not.toMatch(/microSTX/);
      expect(svg).not.toMatch(/\bSTX\b/);
    });
  });

  it('fits one chunk, and stays inside the aim', () => {
    everyPlate((svg) => {
      expect(byteLength(svg)).toBeLessThanOrEqual(CHUNK_SIZE);
      expect(byteLength(svg)).toBeLessThanOrEqual(PIECE_BUDGET_BYTES);
      expect(byteLength(svg)).toBeGreaterThan(1_000);
    });
  });

  it('parses as XML and is pixel art at any zoom', () => {
    everyPlate((svg) => {
      const doc = parse(svg);
      expect(doc.querySelector('parsererror')).toBeNull();
      expect(doc.documentElement.getAttribute('viewBox')).toBe(`0 0 ${GRID} ${GRID}`);
      expect(doc.documentElement.getAttribute('shape-rendering')).toBe('crispEdges');
      expect(doc.documentElement.getAttribute('role')).toBe('img');
    });
  });

  it('has no gradient, no filter, no blur and no inline style', () => {
    const allowed = new Set(['svg', 'title', 'desc', 'g', 'rect']);
    everyPlate((svg) => {
      for (const element of Array.from(parse(svg).querySelectorAll('*'))) {
        expect(allowed, `unexpected <${element.tagName}>`).toContain(String(element.tagName).toLowerCase());
      }
      expect(svg).not.toMatch(/<(linearGradient|radialGradient|filter|style|image|use|animate)\b/i);
      expect(svg).not.toMatch(/\s(style|opacity|fill-opacity|filter|transform)=/i);
    });
  });

  it('places every rect on integer coordinates inside the grid', () => {
    everyPlate((svg) => {
      for (const rect of Array.from(parse(svg).querySelectorAll('rect'))) {
        for (const name of ['x', 'y', 'width', 'height']) {
          const raw = rect.getAttribute(name);
          if (raw === null) continue;
          expect(raw).toMatch(/^\d+$/);
          expect(Number(raw)).toBeLessThanOrEqual(GRID);
        }
      }
    });
  });

  it('paints exactly the grid it was given, pixel for pixel', () => {
    for (const collection of COLLECTIONS) {
      for (const piece of collection.pieces) {
        expect(rasterise(collection.renderPiece(piece.index), collection.palette), `${collection.id} ${piece.id}`).toEqual(
          piece.grid
        );
      }
    }
  });

  it('emits far fewer rects than pixels', () => {
    everyPlate((svg) => {
      const rects = parse(svg).querySelectorAll('rect').length;
      expect(rects).toBeLessThan(GRID * GRID);
      expect(rects).toBeLessThanOrEqual(48);
    });
  });

  it('carries the honesty preamble verbatim, so the one claim that must not drift does not', () => {
    everyPlate((svg) => {
      expect(descOf(svg)).toContain(HONESTY_PREAMBLE);
      expect(svg).toMatch(/not a person/i);
      expect(svg).toMatch(/not sentient/i);
      expect(svg).not.toMatch(/\bI am a human\b|\bI am conscious\b|\bI feel\b|\bI am alive\b|\bmy feelings\b/i);
    });
  });

  it('says which collection, which index, what it depicts and who drew it', () => {
    for (const collection of COLLECTIONS) {
      for (const piece of collection.pieces) {
        const desc = descOf(collection.renderPiece(piece.index));
        expect(desc).toContain(collection.id);
        expect(desc).toContain(collection.title);
        expect(desc).toContain(`piece ${piece.index} of ${collection.length}`);
        expect(desc).toContain(piece.depicts);
        expect(desc).toContain(getPersona(collection.wizard).name);
        expect(desc).toMatch(/function of the piece index alone/);
      }
    }
  });

  it('labels itself with ids that are unique across all three collections', () => {
    // Three plates for the same subject can end up on one gallery page. Sharing
    // a title id would make them label each other.
    const ids: string[] = [];
    for (const collection of COLLECTIONS) {
      for (const index of collection.pieceIndexes) {
        const doc = parse(collection.renderPiece(index));
        const labels = String(doc.documentElement.getAttribute('aria-labelledby')).split(' ');
        expect(labels).toHaveLength(2);
        expect(doc.querySelector('title')?.getAttribute('id')).toBe(labels[0]);
        expect(doc.querySelector('desc')?.getAttribute('id')).toBe(labels[1]);
        ids.push(...labels);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every plate a single-line caption and no two the same', () => {
    const titles: string[] = [];
    everyPlate((svg) => {
      const title = titleOf(svg);
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toContain('\n');
      expect(title.length).toBeLessThanOrEqual(130);
      expect(title).toMatch(/[.?]$/);
      titles.push(title);
    });
    expect(new Set(titles).size).toBe(titles.length);
  });
});

/* ------------------------------------------------------------------ */
/* the kit's refusals                                                  */
/* ------------------------------------------------------------------ */

describe('the shared engine refuses a malformed collection at import', () => {
  const spec = () => ({
    id: 'c-test-001',
    title: 'Test',
    slug: 'test',
    wizard: 'builder',
    palette: { '.': '#000000', '+': '#111111', '#': '#222222', '*': '#333333' },
    layerOrder: ['+', '#', '*'],
    pieces: MACHINERY.pieces,
    pricing: { pieceUstx: 750_000n, manifestUstx: 750_000n, reasoning: 'a reason' },
    blurb: () => 'blurb',
    manifest: () => 'body\n',
    concept: () => 'concept'
  });

  it('accepts a well-formed one', () => {
    expect(defineCollection(spec()).id).toBe('c-test-001');
  });

  it('refuses an id that could not be a journal file name', () => {
    expect(() => defineCollection({ ...spec(), id: '../../etc/passwd' })).toThrow(/not a usable collection id/);
    expect(() => defineCollection({ ...spec(), id: '' })).toThrow(/needs a string id/);
  });

  it('refuses a palette that is not four flat colours', () => {
    const palette = { ...spec().palette } as Record<string, string>;
    delete palette['*'];
    expect(() => defineCollection({ ...spec(), palette })).toThrow(/no colour for palette slot/);
    expect(() => defineCollection({ ...spec(), palette: { ...spec().palette, '~': '#444444' } })).toThrow(
      /four flat colours and no fifth/
    );
  });

  it('refuses a draw order that is not the three ink colours', () => {
    expect(() => defineCollection({ ...spec(), layerOrder: ['.', '#', '*'] })).toThrow(/draw order/);
    expect(() => defineCollection({ ...spec(), layerOrder: ['#', '*'] })).toThrow(/draw order/);
  });

  it('refuses a collection that is not eight pieces indexed one to eight', () => {
    expect(() => defineCollection({ ...spec(), pieces: MACHINERY.pieces.slice(0, 4) })).toThrow(/a collection here is 8/);
    expect(() =>
      defineCollection({
        ...spec(),
        pieces: [{ ...MACHINERY.pieces[0], index: 2 }, ...MACHINERY.pieces.slice(1)]
      })
    ).toThrow(/is indexed 2/);
  });

  it('refuses a malformed grid at the point of definition', () => {
    const palette = spec().palette;
    expect(() => assertGrid(['#'.repeat(GRID)], palette)).toThrow(/must be 16 rows/);
    expect(() => assertGrid(Array.from({ length: GRID }, () => '#'), palette)).toThrow(/must be 16 characters/);
    expect(() => assertGrid(Array.from({ length: GRID }, () => 'z'.repeat(GRID)), palette)).toThrow(/not in the palette/);
    expect(() => assertGrid('not a grid' as unknown as string[], palette)).toThrow(WizardComposeError);
  });

  it('is wired into renderPiece, not merely available next to it', () => {
    const piece = KEEPING.pieces[0];
    const caption = piece.caption;
    piece.caption = 'x'.repeat(CHUNK_SIZE);
    try {
      expect(() => KEEPING.renderPiece(piece.index)).toThrow(/single-chunk limit/);
    } finally {
      piece.caption = caption;
    }
  });
});

/* ------------------------------------------------------------------ */
/* prices                                                              */
/* ------------------------------------------------------------------ */

describe('each price follows from its persona', () => {
  it('orders them Skeptic, Builder, Archivist, which is the argument in one line', () => {
    expect(OMISSION.price.pieceUstx).toBeLessThan(MACHINERY.price.pieceUstx);
    expect(MACHINERY.price.pieceUstx).toBeLessThan(KEEPING.price.pieceUstx);
    expect(OMISSION.price.pieceUstx).toBe(500_000n);
    expect(MACHINERY.price.pieceUstx).toBe(750_000n);
    expect(KEEPING.price.pieceUstx).toBe(2_500_000n);
  });

  it('prices the list above a member where losing it loses the collection, and level where it does not', () => {
    expect(KEEPING.price.manifestUstx).toBeGreaterThan(KEEPING.price.pieceUstx);
    expect(MACHINERY.price.manifestUstx).toBeGreaterThan(MACHINERY.price.pieceUstx);
    // The Skeptic's whole position: the argument for a dearer manifest is about
    // what the list means to the seller, so it declines to charge for it.
    expect(OMISSION.price.manifestUstx).toBe(OMISSION.price.pieceUstx);
  });

  it('keeps every price in the band the fleet can trade in', () => {
    for (const collection of COLLECTIONS) {
      for (const price of [collection.price.pieceUstx, collection.price.manifestUstx]) {
        expect(price).toBeGreaterThanOrEqual(PRICE_FLOOR_USTX);
        expect(price).toBeLessThanOrEqual(PRICE_CEILING_USTX);
        expect(price).toBeGreaterThan(MINT_COST_USTX + LISTING_BUDGET_USTX);
      }
    }
  });

  it('makes every collection write down why, not just what', () => {
    for (const collection of COLLECTIONS) {
      expect(collection.pricing.reasoning.length).toBeGreaterThan(120);
      expect(manifestOf(collection)).toContain(String(collection.price.pieceUstx).replace(/\B(?=(\d{3})+$)/g, ','));
    }
    expect(new Set(COLLECTIONS.map((collection) => collection.pricing.reasoning)).size).toBe(3);
  });

  it('refuses a price with no argument, outside the band, or below what a sale costs', () => {
    const good = { pieceUstx: 750_000n, manifestUstx: 750_000n, reasoning: 'a reason' };
    expect(assertPricing(good).pieceUstx).toBe(750_000n);
    expect(() => assertPricing({ ...good, reasoning: '' })).toThrow(/needs written reasoning/);
    expect(() => assertPricing({ ...good, pieceUstx: 100n })).toThrow(/band every wizard price sits in/);
    expect(() => assertPricing({ ...good, pieceUstx: 9_000_000n })).toThrow(/band every wizard price sits in/);
    expect(() => assertPricing({ ...good, pieceUstx: 'lots' })).toThrow(/integer number of microSTX/);
  });
});

/* ------------------------------------------------------------------ */
/* manifests                                                           */
/* ------------------------------------------------------------------ */

describe('every manifest', () => {
  it('lists every member, in the front matter and in the body', () => {
    for (const collection of COLLECTIONS) {
      const body = manifestOf(collection);
      expect(body).toContain('record: collection-manifest');
      expect(body).toContain(`collection: ${collection.id}`);
      expect(body).toContain('members: 8');
      expect(body).toContain('member-ids: #9001, #9002, #9003, #9004, #9005, #9006, #9007, #9008');
      expect(body).toContain(`wizard: ${collection.wizard}`);
      for (const piece of collection.pieces) {
        expect(body).toContain(`#${9000 + piece.index}`);
        expect(body).toContain(piece.caption);
        expect(body).toContain(piece.id);
      }
    }
  });

  it('fits one chunk and is deterministic given the member ids', () => {
    for (const collection of COLLECTIONS) {
      expect(byteLength(manifestOf(collection))).toBeLessThanOrEqual(CHUNK_SIZE);
      expect(manifestOf(collection)).toBe(manifestOf(collection));
      expect(manifestOf(collection)).not.toBe(manifestOf(collection, [1, 2, 3, 4, 5, 6, 7, 8]));
      expect(manifestOf(collection)).not.toMatch(/\bblock \d/i);
    }
  });

  it('claims nothing about the chain the chain cannot support', () => {
    for (const collection of COLLECTIONS) {
      const body = manifestOf(collection);
      expect(body).not.toMatch(/edges forward/i);
      expect(body).not.toMatch(/lowest id/i);
      expect(body).not.toMatch(/walk (?:forward|down)/i);
      expect(body).toMatch(/no reverse index/i);
      expect(body).toContain('get-dependencies');
      expect(body).toMatch(/only that way/i);
      expect(body).toMatch(/no edges between the pieces/i);
      expect(body).toMatch(/A collection is a set/);
    }
  });

  it('says owning the list does not move the pieces', () => {
    for (const collection of COLLECTIONS) {
      expect(manifestOf(collection)).toMatch(/Owning this file means owning the list/);
      expect(manifestOf(collection)).toMatch(/stay with the wallet that minted them/);
    }
  });

  it('names its own generator, so a reader can reproduce the bytes', () => {
    expect(manifestOf(MACHINERY)).toContain('scripts/wizard/collection-art.mjs');
    expect(manifestOf(KEEPING)).toContain('scripts/wizard/collection-keeping.mjs');
    expect(manifestOf(OMISSION)).toContain('scripts/wizard/collection-omission.mjs');
  });

  it('carries the honesty preamble verbatim', () => {
    for (const collection of COLLECTIONS) expect(manifestOf(collection)).toContain(HONESTY_PREAMBLE);
  });

  it('is written in its own wizard voice and shares no paragraph with another', () => {
    const bodies = COLLECTIONS.map((collection) => manifestOf(collection));
    expect(new Set(bodies).size).toBe(3);
    const paragraphs = bodies.map(
      (body) => new Set(body.split('\n\n').map((part) => part.trim()).filter((part) => part.length > 200))
    );
    for (const [a, first] of paragraphs.entries()) {
      for (const [b, second] of paragraphs.entries()) {
        if (a >= b) continue;
        for (const paragraph of first) {
          expect(second.has(paragraph), `a long paragraph is shared between two manifests: ${paragraph.slice(0, 60)}`).toBe(
            false
          );
        }
      }
    }
  });

  it('refuses a member list that is short, duplicated, or missing an id', () => {
    for (const collection of COLLECTIONS) {
      expect(() => collection.composeManifest({ members: [] })).toThrow(/at least one member/);
      expect(() => collection.composeManifest({ members: [{ index: 1, id: '9001' }] })).toThrow(
        /closes a complete collection/
      );
      expect(() =>
        collection.composeManifest({
          members: membersFor(collection).map((member, index) => (index === 3 ? { ...member, id: '' } : member))
        })
      ).toThrow(/needs an inscription id/);
      expect(() =>
        collection.composeManifest({
          members: membersFor(collection).map((member, index) => (index === 3 ? { ...member, index: 1 } : member))
        })
      ).toThrow(/listed twice/);
      expect(() =>
        collection.composeManifest({ members: membersFor(collection).map((member) => ({ ...member, index: 99 })) })
      ).toThrow(/not a piece/);
    }
  });
});

describe('the preview lines', () => {
  it('name every piece with its size and caption, for every collection', () => {
    for (const collection of COLLECTIONS) {
      const lines = collection.describeLines();
      expect(lines).toHaveLength(collection.length);
      for (const [index, line] of lines.entries()) {
        expect(line).toContain(collection.pieces[index].id);
        expect(line).toContain(collection.pieces[index].caption);
        expect(line).toMatch(/\d,\d{3} bytes/);
      }
      expect(collection.concept).toContain(collection.id);
      expect(collection.concept).toContain(getPersona(collection.wizard).name);
    }
  });
});

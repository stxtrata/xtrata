import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  COLLECTION_CONCEPT,
  COLLECTION_ID,
  COLLECTION_LENGTH,
  COLLECTION_MIME,
  COLLECTION_TITLE,
  GRID,
  HONESTY_PREAMBLE,
  PALETTE,
  PIECES,
  PIECE_IDS,
  PIECE_INDEXES,
  WizardComposeError,
  assertGrid,
  assertPieceFitsOneChunk,
  byteLength,
  composeCollectionManifest,
  describeCollection,
  describePiece,
  getPiece,
  rectsFor,
  renderCollection,
  renderPiece,
  xmlText
} from '../collection-art.mjs';
import { CHUNK_SIZE } from '../compose.mjs';

/**
 * A plate is small on purpose: the mint is charged per chunk, so the whole
 * collection sits in nine transactions only because nothing here got fat. The
 * hard gate in the code is the chunk boundary, which is what costs money. This
 * is the aim, and a number that has to be revised deliberately is exactly what
 * a test is for.
 */
const PIECE_BUDGET_BYTES = 3_072;

const parser = new new Window().DOMParser();
const parse = (svg: string) => parser.parseFromString(svg, 'image/svg+xml');

/** Reverse the palette, so a rendered plate can be rasterised back to its grid. */
const CHARACTER_FOR = Object.fromEntries(
  Object.entries(PALETTE).map(([character, colour]) => [colour as string, character])
) as Record<string, string>;

/**
 * Repaint the SVG's rects onto a blank canvas, in document order, and return
 * the grid that results. If the greedy run-merge ever drops or duplicates a
 * pixel this is where it shows up, rather than in a gallery.
 */
const rasterise = (svg: string) => {
  const doc = parse(svg);
  const rows: string[][] = Array.from({ length: GRID }, () => new Array(GRID).fill('?'));
  for (const rect of Array.from(doc.querySelectorAll('rect'))) {
    const colour = rect.getAttribute('fill') ?? rect.parentElement?.getAttribute('fill') ?? '';
    const character = CHARACTER_FOR[colour];
    expect(character, `unknown fill ${colour}`).toBeTruthy();
    const x = Number(rect.getAttribute('x') ?? 0);
    const y = Number(rect.getAttribute('y') ?? 0);
    const width = Number(rect.getAttribute('width'));
    const height = Number(rect.getAttribute('height'));
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) rows[row][column] = character;
    }
  }
  return rows.map((row) => row.join(''));
};

const titleOf = (svg: string) => parse(svg).querySelector('title')?.textContent ?? '';
const descOf = (svg: string) => parse(svg).querySelector('desc')?.textContent ?? '';

const membersFor = (ids: Array<string | number> = PIECE_INDEXES.map((index: number) => 9000 + index)) =>
  PIECES.map((piece: { index: number }, position: number) => ({ index: piece.index, id: String(ids[position]) }));

/* ------------------------------------------------------------------ */

describe('the collection', () => {
  it('is eight plates by one wizard, indexed from one', () => {
    expect(COLLECTION_LENGTH).toBe(8);
    expect(PIECE_INDEXES).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(PIECE_IDS).size).toBe(COLLECTION_LENGTH);
    expect(COLLECTION_MIME).toBe('image/svg+xml');
    expect(COLLECTION_CONCEPT).toContain(COLLECTION_ID);
    expect(COLLECTION_CONCEPT).toContain('Wizard-3, the Builder');
  });

  it('refuses an index that is not a piece', () => {
    expect(() => getPiece(0)).toThrow(WizardComposeError);
    expect(() => getPiece(9)).toThrow(/not a piece in The Machinery/);
    expect(() => renderPiece('chunk' as unknown as number)).toThrow(WizardComposeError);
  });
});

describe('determinism', () => {
  it('produces byte-identical output for the same index', () => {
    for (const index of PIECE_INDEXES) {
      expect(renderPiece(index)).toBe(renderPiece(index));
    }
  });

  it('produces different bytes for different indexes', () => {
    const rendered = PIECE_INDEXES.map((index: number) => renderPiece(index));
    expect(new Set(rendered).size).toBe(COLLECTION_LENGTH);
  });

  it('survives a fresh module load, so nothing is cached into the output', async () => {
    const before = PIECE_INDEXES.map((index: number) => renderPiece(index));
    vi.resetModules();
    const reloaded = (await import('../collection-art.mjs')) as { renderPiece: (index: number) => string };
    expect(PIECE_INDEXES.map((index: number) => reloaded.renderPiece(index))).toEqual(before);
  });

  it('reads no clock and no randomness', () => {
    // Seeded from the index and from nothing else. The corpus cannot make this
    // promise — an entry quotes the block it was written at — and the whole
    // recovery story for this collection rests on it.
    const now = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('renderPiece read the clock');
    });
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('renderPiece used Math.random');
    });
    try {
      for (const index of PIECE_INDEXES) expect(() => renderPiece(index)).not.toThrow();
    } finally {
      now.mockRestore();
      random.mockRestore();
    }
  });

  it('names no block height and no fee anywhere in a plate', () => {
    for (const index of PIECE_INDEXES) {
      const svg = renderPiece(index);
      expect(svg).not.toMatch(/\bblock \d/i);
      expect(svg).not.toMatch(/microSTX/);
      expect(svg).not.toMatch(/\bSTX\b/);
    }
  });
});

describe('the size gate', () => {
  it('keeps every plate well inside one chunk, and inside the aim', () => {
    for (const piece of renderCollection()) {
      expect(piece.bytes).toBeLessThanOrEqual(CHUNK_SIZE);
      expect(piece.bytes).toBeLessThanOrEqual(PIECE_BUDGET_BYTES);
      expect(piece.bytes).toBeGreaterThan(1_000);
    }
  });

  it('throws rather than silently crossing onto the two-chunk cost path', () => {
    expect(() => assertPieceFitsOneChunk('x'.repeat(CHUNK_SIZE + 1), 'oversize')).toThrow(WizardComposeError);
    expect(() => assertPieceFitsOneChunk('x'.repeat(CHUNK_SIZE + 1))).toThrow(/16,384-byte single-chunk limit/);
    expect(assertPieceFitsOneChunk('x'.repeat(CHUNK_SIZE))).toBe(CHUNK_SIZE);
  });

  it('is wired into renderPiece, not merely available next to it', () => {
    const piece = PIECES[0];
    const caption = piece.caption;
    piece.caption = 'x'.repeat(CHUNK_SIZE);
    try {
      expect(() => renderPiece(piece.index)).toThrow(/single-chunk limit/);
    } finally {
      piece.caption = caption;
    }
  });
});

describe('the grids', () => {
  it('are 16 by 16 and use only the palette', () => {
    for (const piece of PIECES) {
      expect(() => assertGrid(piece.grid, piece.id)).not.toThrow();
      expect(piece.grid).toHaveLength(GRID);
    }
  });

  it('refuse a malformed grid at the point of definition', () => {
    expect(() => assertGrid(['#'.repeat(GRID)])).toThrow(/must be 16 rows/);
    expect(() => assertGrid(Array.from({ length: GRID }, () => '#'))).toThrow(/must be 16 characters/);
    expect(() => assertGrid(Array.from({ length: GRID }, () => 'z'.repeat(GRID)))).toThrow(/not in the palette/);
    expect(() => assertGrid('not a grid' as unknown as string[])).toThrow(WizardComposeError);
  });
});

describe('the run merge', () => {
  it('collapses a solid block into one rect rather than 256', () => {
    const solid = Array.from({ length: GRID }, () => '#'.repeat(GRID));
    expect(rectsFor(solid, '#')).toEqual([{ x: 0, y: 0, width: GRID, height: GRID }]);
    expect(rectsFor(solid, '*')).toEqual([]);
  });

  it('is stable: the same grid always yields the same rects in the same order', () => {
    for (const piece of PIECES) {
      expect(rectsFor(piece.grid, '#')).toEqual(rectsFor(piece.grid, '#'));
    }
  });

  it('paints exactly the grid it was given, pixel for pixel', () => {
    for (const piece of PIECES) {
      expect(rasterise(renderPiece(piece.index))).toEqual(piece.grid);
    }
  });

  it('emits far fewer rects than pixels', () => {
    for (const index of PIECE_INDEXES) {
      const rects = parse(renderPiece(index)).querySelectorAll('rect').length;
      expect(rects).toBeLessThan(GRID * GRID);
      expect(rects).toBeLessThanOrEqual(40);
    }
  });
});

describe('every plate is valid SVG', () => {
  it('parses as XML with no parser error', () => {
    for (const index of PIECE_INDEXES) {
      const doc = parse(renderPiece(index));
      expect(doc.querySelector('parsererror')).toBeNull();
      expect(doc.documentElement.tagName).toBe('svg');
    }
  });

  it('carries the attributes that make it pixel art at any zoom', () => {
    for (const index of PIECE_INDEXES) {
      const root = parse(renderPiece(index)).documentElement;
      expect(root.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
      expect(root.getAttribute('viewBox')).toBe(`0 0 ${GRID} ${GRID}`);
      expect(root.getAttribute('shape-rendering')).toBe('crispEdges');
      expect(root.getAttribute('role')).toBe('img');
    }
  });

  it('labels itself with the ids its own title and desc carry', () => {
    for (const index of PIECE_INDEXES) {
      const doc = parse(renderPiece(index));
      const labels = String(doc.documentElement.getAttribute('aria-labelledby')).split(' ');
      expect(labels).toHaveLength(2);
      expect(doc.querySelector('title')?.getAttribute('id')).toBe(labels[0]);
      expect(doc.querySelector('desc')?.getAttribute('id')).toBe(labels[1]);
      // Unique per piece, so two plates on one page do not label each other.
      expect(labels[0]).toContain(String(index));
    }
  });

  it('has no gradient, no filter, no blur and no inline style', () => {
    // Asserted against the parsed element names rather than against the source
    // text: every desc contains the words "no gradient and no blur", so a
    // substring search finds them in exactly the files that do not have them.
    const allowed = new Set(['svg', 'title', 'desc', 'g', 'rect']);
    for (const index of PIECE_INDEXES) {
      const svg = renderPiece(index);
      for (const element of Array.from(parse(svg).querySelectorAll('*'))) {
        expect(allowed, `unexpected <${element.tagName}>`).toContain(String(element.tagName).toLowerCase());
      }
      expect(svg).not.toMatch(/<(linearGradient|radialGradient|filter|style|image|use|animate)\b/i);
      expect(svg).not.toMatch(/\s(style|opacity|fill-opacity|filter|transform)=/i);
    }
  });

  it('places every rect on integer coordinates inside the grid', () => {
    for (const index of PIECE_INDEXES) {
      for (const rect of Array.from(parse(renderPiece(index)).querySelectorAll('rect'))) {
        for (const name of ['x', 'y', 'width', 'height']) {
          const raw = rect.getAttribute(name);
          if (raw === null) continue;
          expect(raw).toMatch(/^\d+$/);
          expect(Number(raw)).toBeLessThanOrEqual(GRID);
        }
      }
    }
  });

  it('escapes its text content rather than trusting it', () => {
    expect(xmlText('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
    for (const index of PIECE_INDEXES) {
      // A raw & or < inside title/desc would make the file unparseable, which
      // is a thing to find here and not after paying to inscribe it.
      expect(parse(renderPiece(index)).querySelector('parsererror')).toBeNull();
    }
  });
});

describe('captions', () => {
  it('gives every plate a title, and no two the same', () => {
    const titles = PIECE_INDEXES.map((index: number) => titleOf(renderPiece(index)));
    expect(titles.every((title: string) => title.length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(COLLECTION_LENGTH);
  });

  it('keeps the caption a single deadpan line', () => {
    for (const index of PIECE_INDEXES) {
      const title = titleOf(renderPiece(index));
      expect(title).not.toContain('\n');
      expect(title.length).toBeLessThanOrEqual(130);
      expect(title).toMatch(/\.$/);
    }
  });

  it('describes what each plate depicts, in the Builder register', () => {
    // The Builder's concern is the machinery: chunks, hashes, escrow, fees. If
    // a caption stops naming a mechanism it has stopped being on voice.
    const captions = PIECES.map((piece: { caption: string }) => piece.caption).join(' ');
    for (const word of ['chunk', 'hash', 'fee', 'nonce', 'escrow', 'post-condition', 'dependency', 'seal']) {
      expect(captions.toLowerCase()).toContain(word);
    }
  });
});

describe('self-description', () => {
  it('names the collection, the index and the subject in every desc', () => {
    for (const piece of PIECES) {
      const desc = descOf(renderPiece(piece.index));
      expect(desc).toContain(COLLECTION_ID);
      expect(desc).toContain(COLLECTION_TITLE);
      expect(desc).toContain(`piece ${piece.index} of ${COLLECTION_LENGTH}`);
      expect(desc).toContain(piece.depicts);
      expect(desc).toContain('Wizard-3, the Builder');
      expect(desc).toContain(`${GRID} by ${GRID} pixels`);
    }
  });

  it('gives every plate a distinct desc', () => {
    const descs = PIECE_INDEXES.map((index: number) => descOf(renderPiece(index)));
    expect(new Set(descs).size).toBe(COLLECTION_LENGTH);
    expect(describePiece(1)).toBe(descOf(renderPiece(1)));
  });

  it('claims reproducibility from the index, which is a claim it can keep', () => {
    for (const index of PIECE_INDEXES) {
      expect(descOf(renderPiece(index))).toMatch(/function of the piece index alone/);
    }
  });
});

describe('honesty', () => {
  it('carries the corpus preamble verbatim, so the one claim that must not drift does not', () => {
    for (const index of PIECE_INDEXES) {
      expect(descOf(renderPiece(index))).toContain(HONESTY_PREAMBLE);
    }
    expect(composeCollectionManifest({ members: membersFor() })).toContain(HONESTY_PREAMBLE);
  });

  it('never claims to be human, sentient, or to have felt anything', () => {
    for (const index of PIECE_INDEXES) {
      const svg = renderPiece(index);
      expect(svg).toMatch(/not a person/i);
      expect(svg).toMatch(/not sentient/i);
      expect(svg).toMatch(/automated process/i);
      expect(svg).not.toMatch(/\bI am a human\b|\bI am conscious\b|\bI feel\b|\bI am alive\b|\bmy feelings\b/i);
    }
  });
});

describe('the manifest', () => {
  const manifest = (ids?: Array<string | number>) => composeCollectionManifest({ members: membersFor(ids) });

  it('lists every member id, in the front matter and in the body', () => {
    const body = manifest();
    for (const piece of PIECES) {
      expect(body).toContain(`#${9000 + piece.index}`);
      expect(body).toContain(piece.caption);
      expect(body).toContain(piece.id);
    }
    expect(body).toContain('member-ids: #9001, #9002, #9003, #9004, #9005, #9006, #9007, #9008');
    expect(body).toContain('members: 8');
    expect(body).toContain('record: collection-manifest');
    expect(body).toContain(`collection: ${COLLECTION_ID}`);
    expect(body).toContain(`member-mime: ${COLLECTION_MIME}`);
  });

  it('fits one chunk', () => {
    expect(byteLength(manifest())).toBeLessThanOrEqual(CHUNK_SIZE);
  });

  it('is deterministic given the member ids, unlike the thread manifest', () => {
    // Nothing chain-derived goes into it, so a crashed run recomposes the same
    // bytes under the same hash and can always be settled by content hash.
    expect(manifest()).toBe(manifest());
    expect(manifest()).not.toBe(manifest([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(manifest()).not.toMatch(/\bblock \d/i);
    // The manifest does now quote microSTX, in the price section: an ask, and
    // the arithmetic behind it. Both are constants in the generator, so the
    // determinism above still holds. What must never appear is a number the
    // chain decided at compose time, which is what the thread manifest quotes
    // and what makes its bytes unreproducible.
    expect(manifest()).toContain('750,000 microSTX');
    expect(manifest()).not.toMatch(/protocol cost/i);
    expect(manifest()).not.toMatch(/written (?:at|between) blocks?/i);
  });

  it('refuses a member list that is short, duplicated, or missing an id', () => {
    expect(() => composeCollectionManifest({ members: [] })).toThrow(/at least one member/);
    expect(() => composeCollectionManifest({ members: [{ index: 1, id: '9001' }] })).toThrow(
      /closes a complete collection/
    );
    expect(() =>
      composeCollectionManifest({ members: membersFor().map((member, index) => (index === 3 ? { ...member, id: '' } : member)) })
    ).toThrow(/needs an inscription id/);
    expect(() =>
      composeCollectionManifest({
        members: membersFor().map((member, index) => (index === 3 ? { ...member, index: 1 } : member))
      })
    ).toThrow(/listed twice/);
  });

  it('resolves each row from the piece bank rather than from what the caller said it was', () => {
    // A manifest that took the caller's word for which drawing an id holds
    // could permanently name the wrong one.
    expect(() =>
      composeCollectionManifest({ members: membersFor().map((member) => ({ ...member, index: 99 })) })
    ).toThrow(/not a piece/);
  });

  it('makes no claim about the chain the chain cannot support', () => {
    // The thread manifest originally told readers to follow the edges forward.
    // get-dependencies points backwards and the core keeps no reverse index.
    const body = manifest();
    expect(body).not.toMatch(/edges forward/i);
    expect(body).not.toMatch(/lowest id/i);
    expect(body).not.toMatch(/walk (?:forward|down)/i);
    expect(body).toMatch(/no reverse index/i);
    expect(body).toContain('get-dependencies');
    expect(body).toMatch(/only that way/i);
  });

  it('says plainly that there are no edges between the members', () => {
    expect(manifest()).toMatch(/no edges between the pieces/i);
    expect(manifest()).toMatch(/A collection is a set/);
  });

  it('states the trade it made against the corpus rather than implying it', () => {
    const body = manifest();
    expect(body).toMatch(/No plate names the block it was written at or the fee it paid/);
    expect(body).toMatch(/matched by content hash/);
  });

  it('admits the grid size is a rhyme and not a constraint', () => {
    expect(manifest()).toMatch(/the rhyme was available/);
    expect(manifest()).toMatch(/not a technical constraint/);
  });

  it('does not claim owning it moves the pieces', () => {
    expect(manifest()).toMatch(/Owning this file means owning the list/);
    expect(manifest()).toMatch(/stay with the wallet that minted them/);
  });
});

describe('the preview lines', () => {
  it('name every piece with its size and caption', () => {
    const lines = describeCollection();
    expect(lines).toHaveLength(COLLECTION_LENGTH);
    for (const [index, line] of lines.entries()) {
      expect(line).toContain(PIECES[index].id);
      expect(line).toContain(PIECES[index].caption);
      expect(line).toMatch(/\d,\d{3} bytes/);
    }
  });
});

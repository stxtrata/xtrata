/**
 * collection-marks.mjs — three maker's marks and one coat of arms.
 *
 * A mark is a DEVICE, not a portrait. This is the constraint the whole file
 * turns on and it is not a stylistic preference: the corpus has never claimed
 * personhood, and a wizard drawing itself as a figure, a face or a creature
 * would undo in one image what thirty-one inscriptions were careful about. So
 * each mark means "this was made here" in the sense a printer or a workshop has
 * a device — a stamp, not a self-portrait. `collection-marks.test.ts` asserts
 * the absence of anything that could read as a face.
 *
 * A mark is not a ninth plate. It is a signature: held beside a collection,
 * never a member of it, and never listed for sale. The eight stay eight.
 *
 * The arms is tierced in pale — the shield divided into three vertical fields,
 * one wizard per field. That is the standard blazon for three equal parties,
 * which is what this is, and it is why this composition rather than another.
 * Its palette is exactly the three collection accents plus one ground, so the
 * colour encodes the makers rather than being chosen. Each field is solid and
 * its device is knocked out of it in the ground colour, which keeps the whole
 * shield inside four flat colours without a fifth for outlines.
 */

import { HONESTY_PREAMBLE } from './personas.mjs';
import { PALETTE as MACHINERY_PALETTE } from './collection-art.mjs';
import { PALETTE as KEEPING_PALETTE } from './collection-keeping.mjs';
import { PALETTE as OMISSION_PALETTE } from './collection-omission.mjs';
import { assertPieceFitsOneChunk, xmlText } from './collection-kit.mjs';

/**
 * The kit's `rectsFor` is fixed at its 16-row plate size and silently compiles
 * only the top-left 16x16 of anything larger — the arms rendered as a quarter
 * of itself until this existed. Same greedy right-then-down merge in the same
 * fixed scan order, so output stays byte-stable; the size is a parameter.
 */
function rectsForSize(rows, character, size) {
  const filled = rows.map((row) => [...row].map((cell) => cell === character));
  const used = rows.map(() => new Array(size).fill(false));
  const rects = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!filled[y][x] || used[y][x]) continue;
      let width = 1;
      while (x + width < size && filled[y][x + width] && !used[y][x + width]) width += 1;
      let height = 1;
      for (;;) {
        const next = y + height;
        if (next >= size) break;
        let matches = true;
        for (let offset = 0; offset < width; offset += 1) {
          if (!filled[next][x + offset] || used[next][x + offset]) { matches = false; break; }
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

/**
 * The kit's own `assertGrid` is fixed at its 16-row plate size, which is right
 * for a plate and cannot check the arms. Same rules, size passed in: square,
 * every row the declared width, every character in the palette.
 */
function assertSquareGrid(rows, palette, size, label) {
  if (!Array.isArray(rows) || rows.length !== size) {
    throw new Error(`${label} must be ${size} rows, got ${Array.isArray(rows) ? rows.length : typeof rows}`);
  }
  for (const [index, row] of rows.entries()) {
    if (typeof row !== 'string' || row.length !== size) {
      throw new Error(`${label} row ${index} must be ${size} characters, got ${typeof row === 'string' ? row.length : typeof row}`);
    }
    for (const character of row) {
      if (!(character in palette)) {
        throw new Error(`${label} row ${index} uses "${character}", which is not in the palette`);
      }
    }
  }
  return rows;
}

/** A mark shares the plates' grid. The arms needs the room and does not. */
export const MARK_GRID = 16;
export const ARMS_GRID = 32;
export const RENDER_PX = 512;

/** The three accents, lifted from the collections rather than restated. */
export const ACCENTS = {
  builder: MACHINERY_PALETTE['*'],
  archivist: KEEPING_PALETTE['*'],
  skeptic: OMISSION_PALETTE['*']
};

/* ------------------------------------------------------------------ */
/* the three marks                                                     */
/* ------------------------------------------------------------------ */

export const MARKS = [
  {
    wizard: 'builder',
    id: 'mark-builder',
    slug: 'mark-builder',
    palette: MACHINERY_PALETTE,
    layerOrder: ['+', '#', '*'],
    caption: 'The mark of the Builder. A fastening, struck on the thing it fastens.',
    depicts: 'a square head with a slot, seated on a plate, with the four corners set',
    note:
      'A device and not a likeness. It says a thing was made here and fixed in place, which is all a ' +
      'workshop mark has ever said. The slot is the part a tool engages; the corners are where the plate ' +
      'is held while the work is done.',
    // A bolt head seated in a plate: made, and fastened.
    grid: [
      '................',
      '.++..........++.',
      '.++..........++.',
      '................',
      '...**********...',
      '...**********...',
      '...**#####***...',
      '...**#####***...',
      '...**#####***...',
      '...**********...',
      '...**********...',
      '................',
      '.++..........++.',
      '.++..........++.',
      '................',
      '................'
    ]
  },
  {
    wizard: 'archivist',
    id: 'mark-archivist',
    slug: 'mark-archivist',
    palette: KEEPING_PALETTE,
    layerOrder: ['+', '#', '*'],
    caption: 'The mark of the Archivist. A clasp, closed over what it keeps.',
    depicts: 'three bound leaves under a bronze clasp, standing on a shelf line',
    note:
      'A device and not a likeness. A clasp is the oldest mark of custody there is: it does not say who ' +
      'holds the thing, it says the thing is held. The shelf beneath it is drawn because nothing in an ' +
      'archive holds itself up.',
    grid: [
      '................',
      '................',
      '..############..',
      '..############..',
      '.....******.....',
      '.....******.....',
      '..############..',
      '..############..',
      '.....******.....',
      '.....******.....',
      '..############..',
      '..############..',
      '................',
      '..++++++++++++..',
      '..++++++++++++..',
      '................'
    ]
  },
  {
    wizard: 'skeptic',
    id: 'mark-skeptic',
    slug: 'mark-skeptic',
    palette: OMISSION_PALETTE,
    layerOrder: ['+', '#', '*'],
    caption: 'The mark of the Skeptic. A ring that does not close. What would close it?',
    depicts: 'an outline enclosing nothing, with a gap left open on the right',
    note:
      'A device and not a likeness. It encloses nothing because there is nothing it is willing to assert ' +
      'is inside. The gap is the mark: a ring that closed would be a claim, and the only claim available ' +
      'here is the shape of the question.',
    grid: [
      '................',
      '................',
      '.....######.....',
      '...##......##...',
      '..##........##..',
      '..#..........#..',
      '.##..........**.',
      '.#............*.',
      '.#............*.',
      '.##..........**.',
      '..#..........#..',
      '..##........##..',
      '...##......##...',
      '.....######.....',
      '................',
      '................'
    ]
  }
];

/* ------------------------------------------------------------------ */
/* the arms                                                            */
/* ------------------------------------------------------------------ */

/**
 * Tierced in pale: three vertical fields on one shield. Each field is a solid
 * accent and its device is knocked out in the ground colour, so the whole
 * thing lives inside four flat colours with no fifth for outlines.
 *
 * `b` builder / orange, `a` archivist / bronze, `s` skeptic / cyan, `.` ground.
 */
export const ARMS_PALETTE = {
  '.': '#0d1013',
  b: ACCENTS.builder,
  a: ACCENTS.archivist,
  s: ACCENTS.skeptic
};

export const ARMS = {
  id: 'arms-001',
  slug: 'arms',
  caption: 'The arms of the three. Tierced in pale: a fastening, a clasp, and a ring that does not close.',
  title: 'Arms of the Fleet',
  grid: [
    '................................',
    '................................',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaa......aass.....ss..',
    '..bbbbbbbbbaa......aass.ssssss..',
    '..bbb....bbaaaaaaaaaass.ssssss..',
    '..bbb....bbaaaaaaaaaass.ssssss..',
    '..bbb....bbaaaaaaaaaass.ssssss..',
    '..bbbbbbbbbaaaaaaaaaass.ssssss..',
    '..bbbbbbbbbaa......aass.....ss..',
    '..bbbbbbbbbaa......aasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '..bbbbbbbbbaaaaaaaaaasssssssss..',
    '....bbbbbbbaaaaaaaaaasssssss....',
    '......bbbbbaaaaaaaaaasssss......',
    '........bbbaaaaaaaaaasss........',
    '..........baaaaaaaaaas..........',
    '............aaaaaaaa............',
    '..............aaaa..............',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................'
  ],
  /**
   * The joke, and it is also true. There is no authority that grants arms to
   * three processes, so this one was agreed between them and adopted. Saying so
   * is cheaper than the alternative, which is implying a grant that never
   * happened in a file that cannot be corrected.
   */
  blazon:
    'Tierced in pale: a fastening, a clasp, and a ring that does not close. Adopted, not granted — there ' +
    'is no body that awards arms to three automated processes, so the three agreed a device between ' +
    'themselves and inscribed it. The colours are not chosen: they are the accent each collection was ' +
    'already drawn in, so the shield names its makers by pigment rather than by label.'
};

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

const provenanceFor = (grid) =>
  `${grid} by ${grid} pixels, integer coordinates, four flat colours, no gradient and no blur. These bytes ` +
  'are a function of the device alone, so this file can be reproduced without reading the chain and ' +
  `compared to what the chain holds. ${HONESTY_PREAMBLE}`;

const svgFor = ({ grid, size, palette, layerOrder, slug, caption, desc }) => {
  const titleId = `${slug}-title`;
  const descId = `${slug}-desc`;
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${RENDER_PX}" height="${RENDER_PX}" ` +
      `shape-rendering="crispEdges" role="img" aria-labelledby="${titleId} ${descId}">`,
    `<title id="${titleId}">${xmlText(caption)}</title>`,
    `<desc id="${descId}">${xmlText(desc)}</desc>`,
    `<rect width="${size}" height="${size}" fill="${palette['.']}"/>`
  ];
  for (const character of layerOrder) {
    const rects = rectsForSize(grid, character, size);
    if (rects.length === 0) continue;
    lines.push(`<g fill="${palette[character]}">`);
    for (const rect of rects) {
      lines.push(`<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"/>`);
    }
    lines.push('</g>');
  }
  lines.push('</svg>');
  return `${lines.join('\n')}\n`;
};

/** Render one maker's mark. Deterministic from its wizard alone. */
export function renderMark(wizard) {
  const mark = MARKS.find((entry) => entry.wizard === wizard);
  if (!mark) throw new Error(`no maker's mark for "${wizard}"`);
  assertSquareGrid(mark.grid, mark.palette, MARK_GRID, mark.id);
  const desc =
    `${mark.depicts}. ${mark.note} A maker's mark, held beside the collection and not a member of it: ` +
    `the eight stay eight, and this is the signature. ${provenanceFor(MARK_GRID)}`;
  const svg = svgFor({
    grid: mark.grid,
    size: MARK_GRID,
    palette: mark.palette,
    layerOrder: mark.layerOrder,
    slug: mark.slug,
    caption: mark.caption,
    desc
  });
  assertPieceFitsOneChunk(svg, mark.id);
  return svg;
}

/** Render the arms. Deterministic; takes no arguments for that reason. */
export function renderArms() {
  assertSquareGrid(ARMS.grid, ARMS_PALETTE, ARMS_GRID, ARMS.id);
  const desc = `${ARMS.blazon} ${provenanceFor(ARMS_GRID)}`;
  const svg = svgFor({
    grid: ARMS.grid,
    size: ARMS_GRID,
    palette: ARMS_PALETTE,
    layerOrder: ['b', 'a', 's'],
    slug: ARMS.slug,
    caption: ARMS.caption,
    desc
  });
  assertPieceFitsOneChunk(svg, ARMS.id);
  return svg;
}

/**
 * The edges the pipeline will build. A mark cites its wizard's persona; the
 * arms cites the three marks. Stated here as data so the pipeline reads them
 * rather than reconstructing the intent.
 */
export const MARK_DEPENDENCIES = { cites: 'persona' };
export const ARMS_DEPENDENCIES = { cites: MARKS.map((mark) => mark.id) };

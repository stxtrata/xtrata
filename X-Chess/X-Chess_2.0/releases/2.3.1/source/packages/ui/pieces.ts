// The pieces, and the two things that were wrong with them.
//
// Unicode has two chess sets: U+2654-2659 drawn as OUTLINES, nominally white,
// and U+265A-265F drawn FILLED, nominally black. Using them as named is the
// obvious thing to do and it caused both complaints about this board.
//
//   * White could never be solid. An outline glyph has a transparent interior,
//     so colouring it white coloured the outline and the square showed through
//     the middle. The white pieces looked hollow because they were.
//   * The two sets have different metrics, and on several systems they are
//     served from different FONTS entirely, so the two sides disagreed about
//     size.
//
// So BOTH colours use the FILLED set, and colour tells them apart. Six glyphs,
// not twelve. White is solid white with a dark edge; black is near-black with a
// light one. The two sides are now metrically identical by construction and can
// never disagree about size again.
//
// That leaves one problem the codepoints cannot solve. Within a single set the
// proportions are a font designer's business, not chess's: a pawn is a short
// wide shape that fills its em box, while a bishop is tall and narrow with
// headroom above it. At one font-size the pawn reads LARGER than the bishop,
// which is the opposite of a chess set. Hence SCALE, below.

export type PieceKey = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

/**
 * The filled set, used for both colours.
 *
 * U+265A-265F. Deliberately NOT the outline block: see above, and see the
 * artefact test that fails if the outline codepoints reappear.
 */
export const GLYPH: Record<PieceKey, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚'
};

/**
 * How large each piece is drawn, against the square's own size.
 *
 * A design decision rather than a font workaround, which is why it is a ratio
 * and not a pixel table: it holds at any board size and in any font, because
 * every value is relative to the same base.
 *
 * The proportions are a real chess set's. A pawn is three-quarters the height
 * of a king, the minor pieces sit between, and the queen and king stand
 * tallest. Reading the numbers down the list should feel like looking along a
 * set from the pawn to the king.
 */
export const SCALE: Record<PieceKey, number> = {
  p: 0.75,
  n: 0.89,
  b: 0.91,
  r: 0.86,
  q: 1.02,
  k: 1.05
};

const NAME: Record<PieceKey, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
};

/** Engine piece type (1-6) to the key used here. */
export const KEY_BY_TYPE: Record<number, PieceKey> = {
  1: 'p',
  2: 'n',
  3: 'b',
  4: 'r',
  5: 'q',
  6: 'k'
};

export function pieceKeyName(key: PieceKey): string {
  return NAME[key];
}

/** The CSS that sizes each piece. Generated, so it cannot drift from SCALE. */
export const SCALE_CSS = (Object.keys(SCALE) as PieceKey[])
  .map((key) => `.pc--${key} { font-size: ${SCALE[key]}em; }`)
  .join('\n');

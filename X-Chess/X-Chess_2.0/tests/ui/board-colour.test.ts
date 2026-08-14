// What colour a square is.
//
// This file exists because nothing asserted it, and for that reason the board
// shipped with all sixty-four squares inverted: a1 drawn light when a1 is dark,
// h1 drawn dark against "light square on your right", and both queens appearing
// to stand off their own colour. It was inscribed that way, and it was found by
// the first two people to play a real game rather than by 662 tests.
//
// THE POINT OF THESE ASSERTIONS IS THAT THEY ARE ABOUT CHESS, NOT ABOUT THE
// CODE. The expression that was wrong looked entirely reasonable - `(file +
// rank) % 2 === 0` - and a test written by reading it would have restated the
// bug and passed. So every expectation here comes from the board a player sets
// up on a table, and none of them from the renderer:
//
//   a1 is dark. h1 is light. The queens start on their own colour.
//
// Nothing about the PIECES belongs in this file. Where they stand is covered by
// perft over 590 million positions, and this defect never touched it.

import { describe, expect, it, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderBoard } from '../../packages/ui/board.js';
import { Position } from '../../packages/chess/engine.js';

let dom: JSDOM;
let root: HTMLElement;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><div id="board"></div>');
  const g = globalThis as unknown as { document: Document };
  g.document = dom.window.document;
  root = dom.window.document.getElementById('board') as unknown as HTMLElement;
});

/** Draw the opening position and report the class on one square. */
function colourOf(square: string, flipped = false): 'dark' | 'light' {
  renderBoard(
    root,
    {
      position: new Position(),
      legalMoves: [],
      flipped,
      selected: null,
      lastMove: null,
      readOnly: true
    },
    { onSquare: () => {} }
  );
  const node = root.querySelector(`[data-square="${square}"]`);
  if (!node) throw new Error(`the board did not render a square called ${square}`);
  if (node.classList.contains('sq--dark')) return 'dark';
  if (node.classList.contains('sq--light')) return 'light';
  throw new Error(`${square} is neither sq--dark nor sq--light`);
}

describe('the colour of the squares', () => {
  // The four corners pin the parity in both directions. Getting any one of them
  // right by accident is possible; getting all four right by accident is not.
  it('draws a1 dark, which is the anchor the whole board hangs off', () => {
    expect(colourOf('a1')).toBe('dark');
  });

  it('draws h1 light, because the light square goes on your right', () => {
    expect(colourOf('h1')).toBe('light');
  });

  it('draws a8 light and h8 dark', () => {
    expect(colourOf('a8')).toBe('light');
    expect(colourOf('h8')).toBe('dark');
  });

  // The check a chess player actually performs on a newly set up board, and the
  // one the testers performed. "Queen on her own colour": the white queen starts
  // on d1 and d1 is light; the black queen starts on d8 and d8 is dark.
  it('puts each queen on a square of her own colour', () => {
    expect(colourOf('d1'), 'the white queen must start on a LIGHT square').toBe('light');
    expect(colourOf('d8'), 'the black queen must start on a DARK square').toBe('dark');
  });

  it('puts each king on the other colour, which is the same fact stated twice', () => {
    expect(colourOf('e1')).toBe('dark');
    expect(colourOf('e8')).toBe('light');
  });

  // Flipping turns the board around. It does not repaint it. This is worth its
  // own case because the flip happens by reversing the square array, which is
  // exactly the kind of operation that could take the colouring with it.
  it('keeps every square its own colour when the board is flipped', () => {
    expect(colourOf('a1', true), 'a1 is dark from either side of the table').toBe('dark');
    expect(colourOf('h1', true)).toBe('light');
    expect(colourOf('d1', true)).toBe('light');
    expect(colourOf('d8', true)).toBe('dark');
  });

  it('draws thirty-two of each, so no parity error can hide in the middle', () => {
    renderBoard(
      root,
      {
        position: new Position(),
        legalMoves: [],
        flipped: false,
        selected: null,
        lastMove: null,
        readOnly: true
      },
      { onSquare: () => {} }
    );
    expect(root.querySelectorAll('.sq--dark')).toHaveLength(32);
    expect(root.querySelectorAll('.sq--light')).toHaveLength(32);
  });
});

// ---------------------------------------------------------------------------
// En passant, which is the only capture that lands on an empty square.
//
// The destination marker asked whether the target square held a piece, so the
// one capture a player cannot work out from the geometry was drawn as a quiet
// pawn push - a plain dot, beside a real capture wearing a ring. Two players in
// two days concluded the board had not implemented the rule. It always had:
// replaying the real game showed `f5g6` in the legal moves and `g6` in the FEN.
// ---------------------------------------------------------------------------

describe('an en passant capture', () => {
  // 1.e4 d6 2.e5 f5 - white's e5 pawn may take on f6, and the pawn it takes
  // stands on f5. That is the whole difficulty: three squares, and the two a
  // player looks at are not the one the piece is on.
  const FEN = 'rnbqkbnr/ppp1p1pp/3p4/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3';

  const shown = (): Document => {
    const dom = new JSDOM('<!doctype html><html><body><div id="board"></div></body></html>');
    const position = new Position(FEN);
    renderBoard(dom.window.document.getElementById('board') as HTMLElement, {
      position,
      legalMoves: position.movesUci(),
      selected: 'e5',
      flipped: false,
      lastMove: null,
      pending: [],
      readOnly: false
    }, { onSquare: () => {} });
    return dom.window.document;
  };

  const at = (doc: Document, square: string): DOMTokenList =>
    (doc.querySelector(`[data-square="${square}"]`) as HTMLElement).classList;

  it('is drawn as a capture, not as a quiet move', () => {
    expect(at(shown(), 'f6').contains('sq--capture'), 'en passant still looks like a push').toBe(
      true
    );
    expect(at(shown(), 'f6').contains('sq--target')).toBe(false);
  });

  it('marks the pawn it would take, which is on neither square', () => {
    expect(at(shown(), 'f5').contains('sq--en-passant'), 'the taken pawn is unmarked').toBe(true);
  });

  it('leaves an ordinary quiet move a quiet move', () => {
    // e6 is a push onto an empty square and must not now claim to capture.
    expect(at(shown(), 'e6').contains('sq--target')).toBe(true);
    expect(at(shown(), 'e6').contains('sq--capture')).toBe(false);
  });

  it('leaves an ordinary capture alone', () => {
    // e5 takes d6, a pawn that is actually there.
    expect(at(shown(), 'd6').contains('sq--capture')).toBe(true);
    expect(at(shown(), 'd6').contains('sq--en-passant')).toBe(false);
  });
});

// The coordinates around the edge of the board.
//
// Asked for by peacelovemusic.btc: "Please can we add grid markings A-G, 1-8
// around the edges of the board?" (The files are a-h; a-g would be seven.)
//
// They are drawn INSIDE the edge squares rather than in a ring of their own,
// which is the whole reason these tests are cheap to satisfy. A ring would mean
// two extra grid tracks and a taller board, and the landscape phone layout is
// already the tightest dimension in the application.
//
// The case that matters most is the FLIP. A static ring of labels keeps its
// letters where they are while the board turns around underneath, so it ends up
// reading "a" beneath what is now the h file - confidently wrong, which is worse
// than no labels at all. Here both the position and the text come from the array
// the squares are already drawn from, so there is nothing else for them to
// follow.

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

/** Render, and report the coordinate marks on one square. */
function marksOn(square: string, flipped = false): { rank: string | null; file: string | null } {
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
  if (!node) throw new Error(`no square called ${square}`);
  return {
    rank: node.querySelector('.co--rank')?.textContent ?? null,
    file: node.querySelector('.co--file')?.textContent ?? null
  };
}

describe('the coordinates around the board', () => {
  it('runs a to h along the bottom and 1 to 8 up the left', () => {
    expect(marksOn('a1').file).toBe('a');
    expect(marksOn('h1').file).toBe('h');
    expect(marksOn('a1').rank).toBe('1');
    expect(marksOn('a8').rank).toBe('8');
  });

  it('marks only the edges, so the board is not covered in letters', () => {
    // e4 is in the middle: no marks at all.
    expect(marksOn('e4')).toEqual({ rank: null, file: null });
    // h8 is on an edge, but not the LEFT or BOTTOM one.
    expect(marksOn('h8')).toEqual({ rank: null, file: null });
  });

  it('puts both marks on the corner square, not one string', () => {
    expect(marksOn('a1')).toEqual({ rank: '1', file: 'a' });
  });

  it('draws exactly sixteen marks, never more', () => {
    renderBoard(
      root,
      { position: new Position(), legalMoves: [], flipped: false, selected: null, lastMove: null, readOnly: true },
      { onSquare: () => {} }
    );
    expect(root.querySelectorAll('.co')).toHaveLength(16);
  });

  // The case a separate label row would get wrong. Flipping turns the board
  // around, so the bottom-left square becomes h8 - and the marks must move with
  // it. A static ring of labels would still read "a" under what is now the h
  // file, which is worse than no labels because it is confidently wrong.
  it('follows the board when it is flipped', () => {
    expect(marksOn('h8', true), 'flipped, h8 is the bottom-left square').toEqual({
      rank: '8',
      file: 'h'
    });
    expect(marksOn('a1', true), 'flipped, a1 is the top-right square').toEqual({
      rank: null,
      file: null
    });
    renderBoard(
      root,
      { position: new Position(), legalMoves: [], flipped: true, selected: null, lastMove: null, readOnly: true },
      { onSquare: () => {} }
    );
    expect(root.querySelectorAll('.co'), 'still sixteen from the other side').toHaveLength(16);
  });

  it('hides them from screen readers, which already hear the square name', () => {
    renderBoard(
      root,
      { position: new Position(), legalMoves: [], flipped: false, selected: null, lastMove: null, readOnly: true },
      { onSquare: () => {} }
    );
    for (const mark of root.querySelectorAll('.co')) {
      expect(mark.getAttribute('aria-hidden')).toBe('true');
    }
    // And the name itself is untouched: it still starts with the coordinate.
    expect(root.querySelector('[data-square="a1"]')!.getAttribute('aria-label')).toMatch(/^a1/);
  });
});

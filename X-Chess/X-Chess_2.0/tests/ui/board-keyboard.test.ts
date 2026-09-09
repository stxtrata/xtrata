import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderBoard } from '../../packages/ui/board.js';
import { Position } from '../../packages/chess/engine.js';
it('retains focus across selection, navigates flipped squares, and never activates read-only squares', () => {
  const dom = new JSDOM('<div id="board"></div>'); globalThis.document = dom.window.document;
  const root = document.getElementById('board')!; let clicks = 0;
  const draw = (flipped: boolean) => renderBoard(root, {position: new Position(), legalMoves: [], selected: null, flipped, lastMove: null, readOnly: true}, {onSquare: () => clicks++});
  const key = (key: string) => root.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key, bubbles: true}));
  draw(false); root.focus(); key('ArrowRight');
  expect(root.dataset.focusSquare).toBe('b8');
  draw(false); expect(document.activeElement).toBe(root); expect(root.dataset.focusSquare).toBe('b8');
  draw(true); key('ArrowRight'); expect(root.dataset.focusSquare).toBe('a8');
  key('Enter'); key(' '); expect(clicks).toBe(0);
  expect(root.querySelectorAll('[tabindex="-1"]')).toHaveLength(64);
  dom.window.close();
});

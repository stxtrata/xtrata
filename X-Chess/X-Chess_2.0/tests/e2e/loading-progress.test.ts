// A long read that says how far it has got.
//
// Both slow paths on this board — replaying a tournament and walking every
// ranked game — showed nothing at all until the whole answer arrived, which
// for ninety games is minutes of a page that could equally be broken.
//
// What these hold is that the bar means something. It moves because work
// finished, never on a timer, so a stalled read shows a stalled bar. An
// indeterminate spinner cannot say that, which is the whole reason not to use
// one.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

function board(): ChessApp {
  const chain = new MockChain({ balances: {} });
  mountShell(dom.window.document);
  return new ChessApp({
    chain: chain as never,
    document: dom.window.document,
    connect: async () => ({ address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }),
    disconnect: async () => {}
  });
}

const inner = (app: ChessApp) =>
  app as unknown as {
    progress: { done: number; total: number; what: string } | null;
    progressBar(): HTMLElement | null;
  };

describe('the bar under a long read', () => {
  it('shows nothing when nothing is running', () => {
    const app = board();
    expect(inner(app).progress).toBe(null);
    expect(inner(app).progressBar()).toBe(null);
  });

  it('fills in proportion to work actually finished', () => {
    const app = board();
    inner(app).progress = { done: 45, total: 90, what: 'games read' };
    const bar = inner(app).progressBar()!;
    expect(bar.querySelector<HTMLElement>('.bar__fill')!.style.width).toBe('50%');
    expect(bar.textContent).toContain('45 of 90 games read');
  });

  it('says where it is to a screen reader, not just in pixels', () => {
    const app = board();
    inner(app).progress = { done: 3, total: 12, what: 'ranked games replayed' };
    const bar = inner(app).progressBar()!;
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuemax')).toBe('12');
  });

  it('refuses to draw a bar it cannot honestly fill', () => {
    // A total of zero would divide by nothing and show a full bar over no work.
    const app = board();
    inner(app).progress = { done: 0, total: 0, what: 'games read' };
    expect(inner(app).progressBar()).toBe(null);
  });

  it('does not move on its own', () => {
    // The property that makes it worth having. Two draws with no work between
    // them are the same bar, so a read that has stalled looks stalled.
    const app = board();
    inner(app).progress = { done: 7, total: 20, what: 'games read' };
    const first = inner(app).progressBar()!.querySelector<HTMLElement>('.bar__fill')!.style.width;
    const second = inner(app).progressBar()!.querySelector<HTMLElement>('.bar__fill')!.style.width;
    expect(second).toBe(first);
  });
});

// The manual, and why it is not in the board.
//
// A board is permanent and documentation is the thing most likely to be wrong.
// So the manual is a separate inscription, found by the wallet it was sent to,
// and a correction is a new inscription rather than a new board.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_HEADER, parseDocs, splitRefs } from '../../packages/protocol/docs.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

const doc = (body: string): string => `${DOCS_HEADER}\nA title\n${body}`;

describe('reading an inscribed manual', () => {
  it('refuses anything that is not one', () => {
    expect(parseDocs('# not a manual').ok).toBe(false);
    expect(parseDocs('').ok).toBe(false);
    expect(parseDocs(null).ok).toBe(false);
  });

  it('needs a title, because the board shows one', () => {
    expect(parseDocs(`${DOCS_HEADER}\n\nsome text`).ok).toBe(false);
  });

  it('splits on headings and joins wrapped lines into paragraphs', () => {
    const parsed = parseDocs(doc('\n## One\nwrapped\nover lines\n\nsecond\n\n## Two\nmore\n'));
    expect(parsed.ok).toBe(true);
    expect(parsed.docs!.sections.map((s) => s.title)).toEqual(['One', 'Two']);
    expect(parsed.docs!.sections[0].blocks.map((b) => (b as { text: string }).text)).toEqual([
      'wrapped over lines',
      'second'
    ]);
  });

  it('keeps text before the first heading', () => {
    const parsed = parseDocs(doc('\nopening words\n\n## One\nbody\n'));
    expect(parsed.docs!.intro.map((b) => (b as { text: string }).text)).toEqual(['opening words']);
    expect(parsed.docs!.sections[0].title).toBe('One');
  });

  it('offers inscription references as pieces, never as markup', () => {
    // The renderer builds nodes from these. Anybody may send an inscription to
    // the wallet the manual is found in, so its text is a stranger's until its
    // creator is checked — and markup from a stranger is the one thing an
    // inscribed page must never render.
    const parts = splitRefs('the engine is #2991 and nothing else');
    expect(parts.map((p) => p.text).join('')).toBe('the engine is #2991 and nothing else');
    expect(parts.find((p) => p.inscription)?.inscription).toBe(2991);
  });

  it('does not mistake a number for a reference', () => {
    expect(splitRefs('about 2991 moves').every((p) => p.inscription === null)).toBe(true);
  });

  it('parses the manual this repository ships', () => {
    // The one that will actually be inscribed, so a change that breaks it is
    // caught here rather than after 0.3 STX.
    const text = readFileSync(resolve(ROOT, 'docs/manual/xchess-manual.txt'), 'utf8');
    const parsed = parseDocs(text);
    expect(parsed.ok, parsed.problem ?? '').toBe(true);
    expect(parsed.docs!.sections.length).toBeGreaterThan(5);
    // Every heading gets a distinct id, or the index sends two entries to one
    // place and the manual feels broken exactly where it is most needed.
    const ids = parsed.docs!.sections.map((x) => x.id);
    expect(new Set(ids).size, 'two headings share an id').toBe(ids.length);
    expect(Buffer.byteLength(text, 'utf8'), 'one chunk, so one transaction').toBeLessThan(16_384);
  });

  it('reads the constructs a manual needs to be navigable', () => {
    const parsed = parseDocs(
      doc('\n## One\nprose\n\n- a step\n\n$ run this --live\n\nterm :: what it means\n')
    );
    expect(parsed.ok).toBe(true);
    expect(parsed.docs!.sections[0].blocks.map((b) => b.kind)).toEqual([
      'text',
      'item',
      'command',
      'define'
    ]);
  });

  it('nests a sub-heading under its section', () => {
    const parsed = parseDocs(doc('\n## Top\na\n\n### Under\nb\n'));
    expect(parsed.docs!.sections.map((x) => [x.level, x.title])).toEqual([
      [2, 'Top'],
      [3, 'Under']
    ]);
  });

  it('does not read ordinary prose as a definition', () => {
    // The marker is deliberately unusual, because a colon in a sentence is far
    // more likely than a glossary line and turning prose into a definition
    // would silently reformat the manual.
    const parsed = parseDocs(doc('\n## One\nthe rule is: play a move\n'));
    expect(parsed.docs!.sections[0].blocks[0].kind).toBe('text');
  });

  it('gives every heading a distinct id, even when two read alike', () => {
    const parsed = parseDocs(doc('\n## Fees\na\n\n## Fees\nb\n'));
    const ids = parsed.docs!.sections.map((x) => x.id);
    expect(new Set(ids).size).toBe(2);
  });
});

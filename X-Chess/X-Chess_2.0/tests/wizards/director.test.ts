// The prompt protocol has to work for somebody who FETCHED it.
//
// It is the last piece of a game that lived only on one machine: the engine,
// the sheets, the pairings, every move and the referee are all on chain, and
// with all of them you still could not reproduce a move, because the text
// handed to the model was in a harness nobody else had.
//
// So the property under test is not "these functions are correct" — the chooser
// suite covers that. It is that the file is SELF-CONTAINED and EXECUTABLE from
// bytes alone, because an inscription is fetched and run, not imported from a
// repository. A single import statement would make it permanently useless, and
// nothing else in the suite would notice.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = join(
  dirname(fileURLToPath(import.meta.url)), '..', '..', 'harness', 'wizards', 'director.mjs'
);
const source = readFileSync(FILE, 'utf8');

/** Exactly how a reader gets it: bytes in, module out, nothing on disk. */
async function asInscription(): Promise<Record<string, unknown>> {
  const bytes = Buffer.from(source, 'utf8');
  return (await import(`data:text/javascript;base64,${bytes.toString('base64')}`)) as never;
}

describe('the prompt protocol as an inscription', () => {
  it('has no imports at all', () => {
    // The one line that would make it permanently useless. Checked as text
    // rather than by loading, because a bare `import` of something that happens
    // to resolve on THIS machine would load here and fail everywhere else.
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toMatch(/\brequire\s*\(/);
  });

  it('says what it is on its first line', () => {
    // How the inscriber recognises it, and how a stranger who finds the bytes
    // knows what they have.
    expect(source.split('\n')[0]).toMatch(/^\/\/ X-CHESS-DIRECTOR\/1\b/);
  });

  it('runs from its own bytes and builds a prompt', async () => {
    const module = await asInscription();
    const buildRequest = module.buildRequest as (input: unknown) => string;

    const prompt = buildRequest({
      character: { prompt: 'You play like nobody else.' },
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      history: [],
      legalMoves: ['e2e4', 'd2d4'],
      turn: 'white'
    });

    expect(prompt).toContain('You play like nobody else.');
    expect(prompt).toContain('<character>');
    expect(prompt).toContain('e2e4');
    expect(prompt).toContain('Material: level.');
  });

  it('carries the house rules the harness speaks, not the entrant', async () => {
    const module = await asInscription();
    expect(module.SYSTEM_PROMPT as string).toContain(module.HOUSE_RULES as string);
    // The rule an entry must not be able to switch off. See the chooser suite
    // for why it states a verdict rather than a condition.
    expect(module.HOUSE_RULES as string).toContain('DO NOT PLAY');
  });

  it('turns a reply back into a move, which is half of what it is for', async () => {
    const module = await asInscription();
    const extractMove = module.extractMove as (reply: string, legal: string[]) => unknown;
    expect(extractMove('e2e4', ['e2e4', 'd2d4'])).toBe('e2e4');
    expect(extractMove('h7h8', ['e2e4'])).toBe(null);
  });

  it('exposes the depth curve a handicap rides on', async () => {
    // `TournamentEntrant.depth` is an OFFSET on this. Without it inscribed, a
    // declared ladder cannot be reproduced even with every sheet in hand.
    const module = await asInscription();
    const depthFor = module.depthFor as (fen: string) => number;
    const opening = depthFor('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const ending = depthFor('8/8/4k3/8/8/4K3/8/8 w - - 0 1');
    expect(ending).toBeGreaterThan(opening);
  });
});

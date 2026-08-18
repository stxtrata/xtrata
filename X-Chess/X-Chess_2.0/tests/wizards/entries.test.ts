// The sheet and the player must be the same character.
//
// A character exists twice: as an inscribable entry in harness/wizards/entries/,
// and as a prompt in personalities.mjs that the harness actually hands to the
// model. Nothing at runtime reads the entry files, so the two can drift, and a
// drift would mean the record on chain describes a player that never played.
//
// THE FIRST SIX ALREADY DRIFTED, in a small way that is instructive. They were
// written prompt-first and transcribed into sheets afterwards, and the entry
// format joins continuation lines with a space — so the inscribed sheets at
// 2995-3000 have the same words and none of the paragraph breaks. That is
// recorded in docs/PLAN-tournament-three.md as a confound rather than fixed,
// because the sheets are on chain and the games are played.
//
// The four written for exhibition three go the other way: the file is the
// source and the prompt is what the file renders. This holds that.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { entryToPrompt, parseEntry } from '../../packages/protocol/entry.js';
import { PERSONALITIES } from '../../harness/wizards/personalities.mjs';

const ENTRIES = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'harness', 'wizards', 'entries');
const sheet = (id: string): string => readFileSync(join(ENTRIES, `${id}.txt`), 'utf8');

/** Written sheet-first. What is inscribed is what plays, exactly. */
const SHEET_FIRST = ['fathom', 'cadence', 'bulwark', 'canon'];

describe('every character has a sheet that validates', () => {
  for (const character of PERSONALITIES) {
    it(`${character.id} parses, within the entry budget`, () => {
      const parsed = parseEntry(sheet(character.id));
      expect(parsed.problems).toEqual([]);
      expect(parsed.ok).toBe(true);
      expect(parsed.entry?.name).toBe(character.name);
    });
  }
});

describe('the sheet-first characters play exactly what is inscribed', () => {
  for (const id of SHEET_FIRST) {
    it(`${id}'s prompt is what its sheet renders`, () => {
      // Not "contains" and not normalised. If these two strings differ at all,
      // the tournament is playing a character the record does not describe.
      const rendered = entryToPrompt(parseEntry(sheet(id)).entry!);
      const played = PERSONALITIES.find((p) => p.id === id)!.prompt;
      expect(played).toBe(rendered);
    });
  }
});

describe('the field itself', () => {
  it('has ten characters with distinct ids and names', () => {
    expect(PERSONALITIES).toHaveLength(10);
    expect(new Set(PERSONALITIES.map((p) => p.id)).size).toBe(10);
    expect(new Set(PERSONALITIES.map((p) => p.name)).size).toBe(10);
  });
});

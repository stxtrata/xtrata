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

/** Written prompt-first and transcribed. Their sheets are on chain at 2995-3000. */
const TRANSCRIBED = PERSONALITIES.map((p) => p.id).filter((id) => !SHEET_FIRST.includes(id));

/**
 * Hard-wrapped source as the entry format renders it.
 *
 * This is the whole of the drift, and asserting it is the point: the runner now
 * plays what the SHEET says, so anything this does not explain is a word that
 * changed between the player and the record.
 */
const unwrap = (text: string): string => text.replace(/\s*\n\s*/g, ' ').trim();

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

describe('the transcribed six differ from their sheets, and only in wrapping', () => {
  // NOT a formality now that it decides play. The runner reads prompts from
  // chain, so from Exhibition Three round 3 these six are played as their
  // sheets render — and that is a real change to what the model is handed, made
  // at a round boundary on purpose.
  //
  // What must hold is that it is a change of SHAPE and not of WORDS. The local
  // prompts are hard-wrapped prose; the sheets carry the same text with the
  // wrapping collapsed, six to eight newlines becoming none. If `unwrap` ever
  // stops explaining the whole difference, somebody has edited one side.
  for (const id of TRANSCRIBED) {
    it(`${id} says the same words with none of the line breaks`, () => {
      const rendered = entryToPrompt(parseEntry(sheet(id)).entry!);
      const played = PERSONALITIES.find((p) => p.id === id)!.prompt;

      // It IS a difference. Recorded rather than smoothed over, because a test
      // that only checked `unwrap` would pass just as happily if they matched.
      expect(played).not.toBe(rendered);
      expect(unwrap(played)).toBe(rendered);
      expect(rendered).not.toContain('\n');
    });
  }

  it('leaves the sheet-first four alone, wrapping and all', () => {
    // The counter-case. These keep their line structure in both, which is what
    // makes the six above a transcription artefact rather than the format.
    for (const id of SHEET_FIRST) {
      const rendered = entryToPrompt(parseEntry(sheet(id)).entry!);
      expect(rendered).toContain('\n');
    }
  });
});

describe('the field itself', () => {
  it('has ten characters with distinct ids and names', () => {
    expect(PERSONALITIES).toHaveLength(10);
    expect(new Set(PERSONALITIES.map((p) => p.id)).size).toBe(10);
    expect(new Set(PERSONALITIES.map((p) => p.name)).size).toBe(10);
  });
});

// The inscribed engine, and keeping the repository honest about it.
//
// An inscription is permanent and costs money, so the bytes that go up should
// be reviewable in a diff BEFORE they are paid for — not produced by a script
// at the moment of inscribing, when the only person who could catch a mistake
// is the one busy making it.
//
// Inscription 2991 on xtrata-v3-2-3 is byte-identical to what the build here
// produces. That is the property an entrant relies on: fetch the inscription,
// run the build, confirm they are the same engine.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  BUILDER_FILE, BUILDER_INSCRIPTION, CHUNK_BYTES, ENTRY_FILE, ENTRY_INSCRIPTION, INSCRIBED_SHA256, INSCRIPTION,
  SKILL_FILE, TOURNAMENT_INSCRIPTION, buildBuilder, buildEntry, buildSkill, sha256
} from '../../harness/skill/build-skill.mjs';

describe('the inscription-ready build', () => {
  it('reproduces the bytes that are on chain', async () => {
    // Not a coincidence to be preserved by luck. If this fails, either the
    // engine changed — in which case re-inscribe and update this hash — or the
    // build recipe drifted, which would quietly break the audit that the whole
    // arrangement exists to provide.
    expect(sha256(await buildSkill())).toBe(INSCRIBED_SHA256);
  });

  it('keeps the checked-in artefact identical to the source', async () => {
    // The clean-diff rule. Either the committed file matches what the source
    // produces, or this says so before anybody inscribes a stale copy.
    const built = await buildSkill();
    const committed = readFileSync(SKILL_FILE);
    expect(
      Buffer.compare(committed, built),
      'harness/skill/chess-engine.js is stale — run build-skill.mjs and commit'
    ).toBe(0);
  });

  it('fits in one Xtrata chunk', async () => {
    // Over this it becomes a two-transaction upload, which is a different
    // operation with a different failure mode, not a slightly bigger one.
    const built = await buildSkill();
    expect(built.length).toBeLessThanOrEqual(CHUNK_BYTES);
  });

  it('says where on chain it lives, so the check has something to compare to', () => {
    expect(INSCRIPTION.id).toBe(2991);
    expect(INSCRIPTION.contract).toContain('xtrata-v3-2-3');
  });

  it('carries no local path, only the program', async () => {
    // esbuild's first banner names a directory on whoever's machine ran the
    // build. Everything inscribed is permanent and public; a build path is
    // neither interesting nor anybody's business.
    const text = (await buildSkill()).toString('utf8');
    expect(text).not.toMatch(/\/Users\/|\/home\/|C:\\\\/);
  });

  it('is the engine, not something that merely bundles', async () => {
    const text = (await buildSkill()).toString('utf8');
    expect(text).toContain('X-CHESS-SKILL/1');
    expect(text).toMatch(/export \{[\s\S]*rankMoves[\s\S]*\}/);
  });
});

describe('the runner plays the inscribed engine', () => {
  const runner = readFileSync(
    new URL('../../harness/wizards/run-tournament.mjs', import.meta.url),
    'utf8'
  );

  it('executes what is on chain, not a local copy that happens to match', () => {
    // The claim the tournament makes is that an entrant can fetch inscription
    // 2991, hash it, and know which engine played. A local build that agrees
    // today cannot support that claim tomorrow.
    expect(runner).toMatch(/fetchInscribedSkill/);
    expect(runner).toMatch(/const \{ rankMoves \} = await loadSkill\(\)/);
  });

  it('keeps a local escape hatch that announces itself', () => {
    // Development needs it. A run using it must say so, or the games it
    // produces make a claim they cannot keep.
    expect(runner).toMatch(/--local-engine/);
    expect(runner).toMatch(/NOT played by the inscribed engine/);
  });

  it('fetches once, not per move', () => {
    // Three rounds have been lost to a chain read in a hot path. After startup
    // the run is local and offline for the rest of its life.
    expect((runner.match(/fetchInscribedSkill\(/g) ?? []).length).toBe(1);
  });
});

describe('running code from a chain', () => {
  const skill = readFileSync(
    new URL('../../harness/skill/build-skill.mjs', import.meta.url),
    'utf8'
  );

  it('verifies the hash BEFORE importing anything', () => {
    // WHAT MAKES THIS SAFE IS THE PIN, not the chain. Executing bytes because
    // they are on a blockchain is executing whatever the owner of that id
    // decided to put there.
    const check = skill.indexOf('hash !== INSCRIBED_SHA256');
    const run = skill.indexOf('await import(`data:text/javascript');
    expect(check).toBeGreaterThan(-1);
    expect(check, 'the hash must be checked before the import').toBeLessThan(run);
  });

  it('refuses on a mismatch rather than warning', () => {
    const block = skill.slice(skill.indexOf('hash !== INSCRIBED_SHA256'));
    expect(block.slice(0, 600)).toMatch(/throw new Error/);
    expect(block.slice(0, 600)).toMatch(/Refusing to run code that is not the pinned engine/);
  });

  it('pins the hash that is actually on chain', () => {
    expect(skill).toContain(INSCRIBED_SHA256);
  });
});

describe('what is on chain, and what it descends from', () => {
  it('pins the builder that derived the manifest', async () => {
    // Inscribing the builder rather than only its output is what makes the
    // manifest reproducible: fetch 2992, run it against the same public chain
    // with the same public addresses, get the same 2,817 bytes.
    expect(BUILDER_INSCRIPTION.id).toBe(2992);
    expect(sha256(await buildBuilder())).toBe(BUILDER_INSCRIPTION.sha256);
  });

  it('names 2993 as the tournament, owned by the Director', () => {
    // The organiser owns the tournament — a different wallet from the one that
    // created the engine, and the only one that can ever revise this manifest.
    expect(TOURNAMENT_INSCRIPTION.id).toBe(2993);
    expect(TOURNAMENT_INSCRIPTION.creator).toBe('SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S');
  });

  it('keeps the builder artefact identical to its source', async () => {
    const built = await buildBuilder();
    expect(
      Buffer.compare(readFileSync(BUILDER_FILE), built),
      'harness/skill/manifest-builder.js is stale — rebuild and commit'
    ).toBe(0);
  });
});

/** Characters written for exhibition three whose sheets are not inscribed yet. */
const AWAITING_INSCRIPTION = ['Fathom', 'Cadence', 'Bulwark', 'Canon'];

describe('the character sheets on chain', () => {
  it('names the validator and all six sheets', () => {
    expect(ENTRY_INSCRIPTION.validator).toBe(2994);
    expect(Object.keys(ENTRY_INSCRIPTION.sheets)).toHaveLength(6);
  });

  it('keeps the validator artefact identical to its source', async () => {
    const built = await buildEntry();
    expect(
      Buffer.compare(readFileSync(ENTRY_FILE), built),
      'harness/skill/entry-builder.js is stale — rebuild and commit'
    ).toBe(0);
  });

  it('has a sheet for every personality that played', async () => {
    // A character with no sheet is a player the record cannot describe.
    const { PERSONALITIES } = await import('../../harness/wizards/personalities.mjs');
    for (const character of PERSONALITIES) {
      if (AWAITING_INSCRIPTION.includes(character.name)) continue;
      expect(
        ENTRY_INSCRIPTION.sheets[character.name as keyof typeof ENTRY_INSCRIPTION.sheets],
        `${character.name} has no inscribed sheet`
      ).toBeGreaterThan(0);
    }
  });

  it('names the characters that may not play yet', () => {
    // WRITTEN, NOT YET ON CHAIN. Listed rather than skipped, because the rule
    // above is the one that matters and an exception nobody can see is an
    // exception that becomes permanent. Anybody here MUST NOT be entered into a
    // tournament: a player whose sheet is a file on one machine is exactly the
    // thing inscribing the sheets was meant to end.
    //
    // Emptying this list is a step in setting up exhibition three, not a
    // formality, and the assertion is here so that finishing it is visible.
    expect(AWAITING_INSCRIPTION).toEqual(['Fathom', 'Cadence', 'Bulwark', 'Canon']);
  });
});

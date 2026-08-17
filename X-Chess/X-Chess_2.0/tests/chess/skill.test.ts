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
  CHUNK_BYTES, INSCRIPTION, SKILL_FILE, buildSkill, sha256
} from '../../harness/skill/build-skill.mjs';

/** The hash on chain, and the one this build has to keep reproducing. */
const INSCRIBED_SHA256 = 'f40fa65a4fb2f102769526f023ff520bb8b7ed6882d11a99ab60540858d2ad29';

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

describe('the runner says which engine is about to play', () => {
  const runner = readFileSync(
    new URL('../../harness/wizards/run-tournament.mjs', import.meta.url),
    'utf8'
  );

  it('checks before anything is spent, and in a dry run too', () => {
    expect(runner).toMatch(/await reportSkill\(\)/);
    const at = runner.indexOf('await reportSkill()');
    const dry = runner.indexOf('Dry run. Nothing was signed and nothing was sent.', at);
    expect(at, 'the check must come before the dry-run exit').toBeLessThan(dry);
  });

  it('does not fetch the engine per move, only checks it once', () => {
    // A tournament that read the chain to make each move would gain a failure
    // mode, and three rounds have already been lost to that class of thing.
    // It plays from local source and PROVES the source is what is inscribed.
    expect(runner).toMatch(/loadSearch/);
    expect((runner.match(/reportSkill\(\)/g) ?? []).length).toBeLessThanOrEqual(2);
  });

  it('is never fatal, because a hash check is not a reason to refuse to play', () => {
    const block = runner.slice(runner.indexOf('async function reportSkill'));
    expect(block.slice(0, 2400)).toMatch(/catch \(error\)/);
    expect(block.slice(0, 2400)).not.toMatch(/throw new WizardSafetyError/);
  });
});

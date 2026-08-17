// The byte budget, in the unit that actually costs money.
//
// Xtrata uploads in CHUNKS of 16,384 bytes, and `add-chunk-batch` takes
// `(list 32 (buff 16384))` - so THIRTY-TWO chunks, 524,288 bytes, go up in a
// single transaction. That is the real step in the cost: within one transaction
// the marginal chunk is network fee proportional to its bytes, and the thing
// that actually changes the shape of an upload is needing a SECOND transaction.
//
// So the budget is one transaction's worth, and the gate is at 32.
//
// An earlier version of this file asserted 8, which was not a protocol limit at
// all - it was the number of chunks the artefact happened to occupy on the day
// it was written, mistaken for a ceiling. That error made a 9.4 KB saving look
// like a precondition for every other change, which it is not.
//
// The file still exists for the reason it was written: two features landed and
// spent 1,620 bytes, nothing in the project said so, and the only size gate in
// the suite permitted 250,000 bytes without comment. A budget nobody can see is
// not a budget.
//
// Two assertions, doing different jobs:
//
//   * The CHUNK COUNT is the hard stop: past it the artefact no longer uploads
//     in one transaction. Moving it should take a deliberate decision and an ADR.
//   * The PER-PACKAGE ROWS are the early warning, and in practice they are what
//     will actually fire. They sit far below the chunk gate - their ceilings sum
//     to about 142 KB against 512 KB - so a package that starts growing is caught
//     while it is still a surprise, rather than after the artefact has quietly
//     tripled. They also give a regression an ADDRESS, which the chunk count
//     alone never can.
//
// The rows are seeded from a measured run and each carries the figure it was
// measured at, so "is this ceiling real or aspirational" is answerable by
// reading it.

import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const MANIFEST_PATH = resolve(ROOT, 'dist/manifest.json');

/**
 * What Xtrata charges in. Mirrored from `packages/build/build.mjs`, and
 * asserted against the manifest below rather than trusted, so the two cannot
 * drift apart silently.
 */
const CHUNK_BYTES = 16_384;

/**
 * The chunks that fit in one `add-chunk-batch` transaction.
 *
 * Taken from the live contract: `xtrata-v3.4.0.clar` declares
 * `(list 32 (buff 16384))`. Crossing it does not make an upload impossible, it
 * makes it a two-transaction upload - which is a real change to how the artefact
 * ships, and the thing worth being told about before it happens rather than
 * after.
 */
const CHUNKS = 32;

/**
 * Per-package ceilings, in minified bundle bytes.
 *
 * Measured on 2026-08-12 at commit 79f9502f, and re-seeded per package as work
 * lands, with the figure each was measured at recorded beside it. The chain row
 * moved from 16,432 when tx-status.ts arrived; that is the table doing its job,
 * and the point is that raising a row is a deliberate line in a diff. Coarse on purpose - one row per package - so that
 * moving a file between modules does not churn the table.
 *
 * `packages/storage` was deliberately absent until 2026-08-14: it was
 * tree-shaken out entirely, because nothing imported `CachingReader`. It is here
 * now, which was exactly the change this note was written to make visible.
 */
// RE-BASED ONCE ON 2026-08-17, because these rows had stopped measuring
// anything useful and started taxing ordinary work.
//
// The number that matters is not on this table. `add-chunk-batch` takes 32
// chunks of 16,384 bytes, so ONE TRANSACTION CARRIES 524,288 BYTES — and the
// artefact is 161,397, which is ten chunks, thirty-one per cent, twenty-two
// chunks spare. Meanwhile three rows below sat at 88, 96 and 89 per cent of
// their ceiling, and packages/protocol had been raised TWICE in one day and was
// already back at 96.
//
// A row that moves every time somebody adds a feature is not a regression
// detector, it is a tripwire: it fails saying "you are 200 bytes over" and
// points at a diff that is not the problem. That happened twice in one day.
//
// So each row is now roughly 1.5x what it uses — quiet for ordinary work, loud
// for a package that doubles unexpectedly. The check that makes this safe is
// the sum: every row at its NEW ceiling totals 268,850 bytes, which is
// seventeen chunks, still one transaction and still half the real limit.
//
// The chunk test above stays the only hard gate, because it is the only one
// describing a property of the contract rather than a preference of ours.
const BUDGETS: Array<{ group: string; ceiling: number; measured: number }> = [
  // Moved from 95,000 on 2026-08-14. The list grew a filter row, an identity
  // field, a sponsorship lookup and a concurrent read path in one day; the row
  // did its job by stopping just short, and this is the deliberate line.
  //
  // Moved again to 103,500 on 2026-08-16, and the reason to record is that the
  // row had 71 BYTES LEFT before this change. At that margin it had stopped
  // being a regression detector and become a tripwire on the next edit of any
  // size, whatever that edit was.
  //
  // What the 632 bytes bought: an arrowhead on the pending-move arrow, so a
  // move sitting in the mempool reads as "this piece is going there" rather
  // than a line between two squares. Built as two SVG markers in the shell
  // markup rather than a triangle drawn per arrow - which was tried first and
  // cost 734, and a version with the explanation inside the template literal
  // cost 1,276, because a comment in a template literal is an inscribed byte.
  { group: 'packages/ui', ceiling: 170_000, measured: 113_602 },
  { group: 'packages/chain', ceiling: 33_000, measured: 21_825 },
  // Raised to 18,000 on 2026-08-17, and this one was arithmetic rather than a
  // surprise: step 0 of the Tournaments tab measured it before any UI existed.
  //
  // tournament.ts was in the tree but imported by nothing, so it cost zero and
  // the row looked healthy at 11,423. The tab imports it — the manifest parser,
  // standings, rounds, revision walking, provenance and the pairing check — and
  // that is 4,523 bytes, landing at 15,946.
  //
  // Headroom to 18,000 rather than to the nearest round number above 15,946,
  // because the tab is not finished and a ceiling that has to move again next
  // week is not a ceiling.
  { group: 'packages/protocol', ceiling: 26_000, measured: 17_364 },
  { group: 'packages/chess', ceiling: 14_000, measured: 9_207 },
  // Moved from 6,000 when connect.ts arrived: the connect policy left
  // apps/chess, where it was untestable, and became 819 bytes of this package
  // with a suite of its own. That is a fair trade and this is where it is
  // recorded, but the row moving is a line in a diff either way.
  { group: 'packages/wallet', ceiling: 9_700, measured: 6_446 },
  { group: 'packages/replay', ceiling: 6_100, measured: 4_057 },
  // Arrived 2026-08-14. This row is the note below coming true: something
  // started using the cache. 3 KB, and it takes a return visitor's game list
  // from 51 reads to 26 by not asking for entries that cannot have changed.
  { group: 'packages/storage', ceiling: 4_800, measured: 3_208 },
  { group: 'packages/ratings', ceiling: 3_600, measured: 2_395 },
  { group: 'apps/chess', ceiling: 1_650, measured: 1_086 }
];

/** The same bundle the build produces, measured rather than guessed. */
async function measure(): Promise<Record<string, number>> {
  const result = await build({
    entryPoints: ['apps/chess/main.ts'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2022'],
    minify: true,
    write: false,
    legalComments: 'none',
    metafile: true,
    define: { __XCHESS_BUILD__: '"measuring"' }
  });

  const inputs = Object.values(result.metafile.outputs)[0].inputs;
  const totals: Record<string, number> = {};
  for (const [path, entry] of Object.entries(inputs)) {
    const match = path.match(/^(packages\/[^/]+|apps\/[^/]+)/);
    const group = match ? match[1] : path;
    totals[group] = (totals[group] ?? 0) + entry.bytesInOutput;
  }
  return totals;
}

describe('the permanent byte budget', () => {
  it('fits in the chunks it is budgeted for', () => {
    if (!existsSync(MANIFEST_PATH)) {
      throw new Error('dist/manifest.json is missing. Run `npm run build` before this suite.');
    }
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as {
      bytes: number;
      xtrataChunks: number;
      xtrataChunkBytes: number;
    };

    // The build is the authority on the chunk size; this file only mirrors it.
    expect(
      manifest.xtrataChunkBytes,
      'the build and this budget disagree about how big a chunk is'
    ).toBe(CHUNK_BYTES);

    const ceiling = CHUNKS * CHUNK_BYTES;
    const headroom = ceiling - manifest.bytes;

    expect(
      manifest.xtrataChunks,
      `the artefact is ${manifest.bytes.toLocaleString()} bytes and takes ` +
        `${manifest.xtrataChunks} Xtrata chunks, which is more than the ${CHUNKS} that fit ` +
        `in one add-chunk-batch transaction (${ceiling.toLocaleString()} bytes). It is ` +
        `${(-headroom).toLocaleString()} bytes over, so this would now be a ` +
        'two-transaction upload. Either take bytes out, or decide that is acceptable: ' +
        'raise CHUNKS here, write the ADR, and pass --allow-chunk to the release.'
    ).toBeLessThanOrEqual(CHUNKS);

    // Not a failure - room left is the good case - but it is the figure every
    // proposal to add something is priced against.
    expect(headroom, 'the artefact is somehow larger than its own chunk count').toBeGreaterThan(0);
  });

  it('says where the bytes are, so a regression has an address', async () => {
    const totals = await measure();

    for (const { group, ceiling, measured } of BUDGETS) {
      const bytes = totals[group] ?? 0;
      expect(
        bytes,
        `${group} contributed nothing, so it is not in the bundle at all`
      ).toBeGreaterThan(0);
      expect(
        bytes,
        `${group} is ${bytes.toLocaleString()} bytes against a ceiling of ` +
          `${ceiling.toLocaleString()} (measured at ${measured.toLocaleString()})`
      ).toBeLessThan(ceiling);
    }
  });

  it('has a row for every group in the bundle', async () => {
    // Without this, a new package could grow without limit and the table would
    // simply not mention it - which is how a budget stops being one.
    const totals = await measure();
    const known = new Set(BUDGETS.map((row) => row.group));
    const unlisted = Object.keys(totals).filter((group) => !known.has(group));

    expect(
      unlisted,
      `these groups are in the bundle and have no budget row: ${unlisted.join(', ')}. ` +
        'Add them to BUDGETS with the figure they measure at today.'
    ).toEqual([]);
  });
});

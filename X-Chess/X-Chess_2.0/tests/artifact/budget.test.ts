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
 * `packages/storage` is deliberately absent: it is tree-shaken out entirely,
 * because nothing imports `CachingReader`. If it ever appears here, something
 * started using the cache, which is a real change and worth noticing.
 */
const BUDGETS: Array<{ group: string; ceiling: number; measured: number }> = [
  { group: 'packages/ui', ceiling: 95_000, measured: 88_630 },
  { group: 'packages/chain', ceiling: 21_000, measured: 18_575 },
  { group: 'packages/protocol', ceiling: 11_500, measured: 10_411 },
  { group: 'packages/chess', ceiling: 10_000, measured: 9_199 },
  { group: 'packages/wallet', ceiling: 6_000, measured: 5_447 },
  { group: 'packages/replay', ceiling: 4_500, measured: 4_067 },
  { group: 'packages/ratings', ceiling: 2_700, measured: 2_393 },
  { group: 'apps/chess', ceiling: 1_600, measured: 1_340 }
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

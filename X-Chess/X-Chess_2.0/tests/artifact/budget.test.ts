// The byte budget, in the unit that actually costs money.
//
// Xtrata does not charge by the byte. It charges by the CHUNK, and a chunk is
// 16,384 bytes. So the number that matters is not "how big is the page", it is
// "how many chunks does it buy", and the only moment that number matters is the
// moment it goes up.
//
// This exists because it very nearly went up without anybody noticing. Two
// features landed and spent 1,620 bytes; nothing in the project said so, and
// the only size gate in the suite permitted 250,000 bytes - sixteen chunks -
// which is not a budget, it is the absence of one.
//
// Two assertions, doing different jobs:
//
//   * The CHUNK COUNT is the gate. It is a single number with a price attached,
//     and moving it should require a deliberate decision and an ADR.
//   * The PER-PACKAGE ROWS are a map. They do not gate anything the chunk count
//     does not already gate; they exist so that when the chunk assertion goes
//     red, the next line of output says WHERE the bytes went. Their ceilings sum
//     to more than eight chunks on purpose - they are for locating a regression,
//     not for rationing.
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
 * The chunk count this artefact is budgeted at.
 *
 * Raising this buys a permanent chunk. It is not a number to adjust because a
 * build went over: it is a number to adjust because somebody decided the extra
 * chunk was worth paying for, wrote down why, and passed `--allow-chunk` to the
 * release.
 */
const CHUNKS = 8;

/**
 * Per-package ceilings, in minified bundle bytes.
 *
 * Measured on 2026-08-12 at commit 79f9502f, with the figure each was measured
 * at recorded beside it. Coarse on purpose - one row per package - so that
 * moving a file between modules does not churn the table.
 *
 * `packages/storage` is deliberately absent: it is tree-shaken out entirely,
 * because nothing imports `CachingReader`. If it ever appears here, something
 * started using the cache, which is a real change and worth noticing.
 */
const BUDGETS: Array<{ group: string; ceiling: number; measured: number }> = [
  { group: 'packages/ui', ceiling: 88_000, measured: 81_080 },
  { group: 'packages/chain', ceiling: 18_000, measured: 16_432 },
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
      `the artefact is ${manifest.bytes.toLocaleString()} bytes and now takes ` +
        `${manifest.xtrataChunks} Xtrata chunks, not ${CHUNKS}. The ${CHUNKS}-chunk ` +
        `ceiling is ${ceiling.toLocaleString()} bytes, so it is ${(-headroom).toLocaleString()} ` +
        'bytes over. Either take bytes out, or decide to buy a chunk: raise CHUNKS ' +
        'here, write the ADR, and pass --allow-chunk to the release.'
    ).toBe(CHUNKS);

    // Not a failure - a permanent artefact with room left is the good case -
    // but it is the figure every proposal to add something is priced against.
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

#!/usr/bin/env node
// Do the documents still describe this repository?
//
//   node harness/docs-audit.mjs
//
// ops/ was written in a single commit and then not touched while the code moved
// through a dozen. The result was not merely stale, it was contradictory: two
// files told an arriving reader that the application did not exist and must not
// be inscribed, while it was live on mainnet with real games on it. The byte
// figures were half the truth and the test count was wrong in three places,
// three different ways.
//
// ONLY MECHANICALLY CHECKABLE CLAIMS LIVE HERE. Whether a risk is closed, or a
// decision still holds, is a judgement and belongs to a person. A byte count is
// not, and neither is a test count, and those are exactly the ones that rot
// silently because nobody re-reads a number they have already read once.
//
// Every failure names the file, the claim, and the truth, so fixing it needs no
// investigation.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

const problems = [];
const warnings = [];
const complain = (file, claim, truth) => problems.push({ file, claim, truth });

// ---------------------------------------------------------------------------
// The size of the thing, which is in the manifest the build just wrote.
// ---------------------------------------------------------------------------

const MANIFEST = resolve(ROOT, 'dist/manifest.json');
if (!existsSync(MANIFEST)) {
  warnings.push('dist/manifest.json is missing, so byte claims were not checked. Run npm run build.');
} else {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const actual = Number(manifest.bytes);

  // Scoped to the documents, and only to figures written as a size, so an
  // unrelated number is never mistaken for a claim about the artefact.
  const SIZE = /(\d+(?:[.,]\d+)?)\s*(KB|kB|bytes)\b/g;
  for (const file of ['ops/STATUS.md', 'ops/LAUNCH.md', 'README.md']) {
    if (!existsSync(resolve(ROOT, file))) continue;
    for (const line of read(file).split('\n')) {
      // Other artefacts and other moments have their own sizes, and they are
      // not wrong for differing. The gates page is a second file; a figure next
      // to an inscription id is a historical record of what WAS inscribed, and
      // correcting that would be falsifying it.
      if (/gates|inscription|inscribed|chunk/i.test(line)) continue;
      for (const [whole, figure, unit] of line.matchAll(SIZE)) {
        const value = Number(figure.replace(/,/g, ''));
        if (!Number.isFinite(value)) continue;
        const bytes = unit.toLowerCase() === 'kb' ? value * 1000 : value;
        // Only sizes plausibly ABOUT the artefact. A chunk size or a fee is not.
        if (bytes < 20_000 || bytes > 400_000) continue;
        if (Math.abs(bytes - actual) / actual > 0.05) {
          complain(file, `"${whole.trim()}"`, `the artefact is ${actual.toLocaleString()} bytes`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The number of tests, which the suite itself knows.
// ---------------------------------------------------------------------------

const COUNT = /\*?\*?(\d{2,5})\*?\*?\s+tests\b/gi;
const claimedCounts = [];
for (const file of ['ops/STATUS.md', 'README.md']) {
  if (!existsSync(resolve(ROOT, file))) continue;
  for (const [whole, figure] of read(file).matchAll(COUNT)) {
    claimedCounts.push({ file, whole, value: Number(figure) });
  }
}
if (claimedCounts.length) {
  // Not run here - that would make this gate cost two minutes. The claims are
  // checked against EACH OTHER, which catches the failure that actually
  // happened: three files saying three different numbers.
  const distinct = [...new Set(claimedCounts.map((c) => c.value))];
  if (distinct.length > 1) {
    complain(
      claimedCounts.map((c) => c.file).join(', '),
      `test counts disagree: ${distinct.join(', ')}`,
      'they should all be the same number, or say what they are counting'
    );
  }
}

// ---------------------------------------------------------------------------
// Every test directory should be described somewhere.
// ---------------------------------------------------------------------------

const suites = readdirSync(resolve(ROOT, 'tests'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const readme = existsSync(resolve(ROOT, 'README.md')) ? read('README.md') : '';
const undocumented = suites.filter((name) => !readme.includes(`tests/${name}`));
if (undocumented.length) {
  complain('README.md', `no mention of ${undocumented.map((n) => `tests/${n}`).join(', ')}`,
    'every suite should be listed, or a reader cannot tell what is covered');
}

// ---------------------------------------------------------------------------
// The build target the README describes.
// ---------------------------------------------------------------------------

if (readme.includes('dist/target.json')) {
  complain('README.md', '"dist/target.json"',
    'the build remembers its target in .xchess-build-target.json; living in dist/ was the bug');
}

// ---------------------------------------------------------------------------
// Contradiction: is it live, or must it not be inscribed?
// ---------------------------------------------------------------------------

const inscribed = /inscription\s+\d{3,}/i.test(readme);
if (inscribed) {
  for (const file of ['ops/STATUS.md', 'ops/LAUNCH.md']) {
    if (!existsSync(resolve(ROOT, file))) continue;
    const text = read(file);
    if (/must not be inscribed/i.test(text)) {
      complain(file, '"must not be inscribed"',
        'README.md says an inscription is live, so these two cannot both be true');
    }
  }
}

// ---------------------------------------------------------------------------

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (!problems.length) {
  console.log(`docs audit: ${suites.length} suites, no contradictions found.`);
  process.exit(0);
}

console.error(`\nThe documents disagree with the repository, in ${problems.length} place(s):\n`);
for (const { file, claim, truth } of problems) {
  console.error(`  ${file}`);
  console.error(`    says   ${claim}`);
  console.error(`    but    ${truth}\n`);
}
console.error('These are the claims a machine can check. Everything else is a judgement.');
process.exit(1);

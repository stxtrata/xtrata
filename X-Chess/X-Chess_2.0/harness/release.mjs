#!/usr/bin/env node
// The release gate.
//
//   npm run release
//
// This exists to REFUSE. An inscription is permanent and a deployed contract is
// immutable, so the expensive mistake is not a failed release, it is a release
// that should have failed.
//
// It runs everything `verify` runs, with nothing skipped, then the gates that
// need a built artefact, then the ones that need a person. It exits non-zero
// and names what is missing rather than producing something that looks
// finished.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const run = (command, args, env = {}) =>
  spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32'
  });

const refusals = [];
const refuse = (why) => refusals.push(why);

function gate(name, command, args, env) {
  console.log(`\n---- ${name}\n`);
  const outcome = run(command, args, env);
  if (outcome.status !== 0) refuse(`${name} failed`);
  return outcome.status === 0;
}

// ---------------------------------------------------------------------------
// 1. Everything verify runs, with NOTHING skipped.
// ---------------------------------------------------------------------------

const verified = gate('verify, with deep perft', 'node', ['harness/verify.mjs', '--deep']);

// ---------------------------------------------------------------------------
// 2. Build, then test the thing that was built.
// ---------------------------------------------------------------------------

if (verified) {
  gate('build', 'node', ['packages/build/build.mjs', ...process.argv.slice(2)]);
  gate('the built artefact', 'npx', ['vitest', 'run', 'tests/artifact', 'tests/runtime']);
} else {
  refuse('build and artefact gates were not reached, because verify failed');
}

// ---------------------------------------------------------------------------
// 3. The artefact's own provenance.
// ---------------------------------------------------------------------------

const HTML = resolve(ROOT, 'dist/xchess.html');
const MANIFEST = resolve(ROOT, 'dist/manifest.json');

let manifest = null;
let htmlHash = null;

if (!existsSync(HTML) || !existsSync(MANIFEST)) {
  refuse('there is no built artefact in dist/');
} else {
  const html = readFileSync(HTML, 'utf8');
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  htmlHash = createHash('sha256').update(html).digest('hex');

  if (htmlHash !== manifest.htmlSha256) {
    refuse('the manifest hash does not match the file in dist/');
  }
  if (manifest.exact !== true) {
    // A board that could fall back to another contract would let one failed
    // request show a different log under the same game number.
    refuse('the build is not bound exactly to one contract');
  }
  if (String(manifest.contract).startsWith('SP000000000000000000002Q6VF78')) {
    refuse(`the build names a placeholder contract (${manifest.contract})`);
  }
  if (String(manifest.build).includes('dev')) {
    refuse(`the build version is still a development one (${manifest.build})`);
  }

  // `add-chunk-batch` takes `(list 32 (buff 16384))`, so 32 chunks - 524,288
  // bytes - go up in ONE transaction. Past that an upload needs a second one,
  // which is a real change to how the artefact ships. Going over is allowed;
  // going over WITHOUT HAVING DECIDED TO is what this stops.
  const BUDGETED_CHUNKS = 32;
  const chunks = Number(manifest.xtrataChunks);
  if (chunks > BUDGETED_CHUNKS && !process.argv.includes('--allow-chunk')) {
    refuse(
      `the artefact takes ${chunks} Xtrata chunks (${Number(manifest.bytes).toLocaleString()} ` +
        `bytes), more than the ${BUDGETED_CHUNKS} that fit in one add-chunk-batch ` +
        'transaction. Take bytes out, or pass --allow-chunk with an ADR recording that a ' +
        'two-transaction upload is acceptable, and raise CHUNKS in tests/artifact/budget.test.ts.'
    );
  }
}

// ---------------------------------------------------------------------------
// 4. The gates a machine cannot close.
// ---------------------------------------------------------------------------

const MATRIX = resolve(ROOT, 'harness/wallets/MATRIX.md');
if (!existsSync(MATRIX)) {
  refuse('harness/wallets/MATRIX.md is missing');
} else {
  const matrix = readFileSync(MATRIX, 'utf8');

  // EVIDENCE, NOT THE ABSENCE OF A PHRASE.
  //
  // This used to refuse when the file contained "not run", which made the
  // table's only machine-readable property a string whose absence was treated
  // as proof of work done. Editing fourteen cells to "done" satisfied it with
  // no evidence whatsoever, and typing "pending" satisfied it by accident.
  //
  // A row now passes only if it carries a RESULT LINE, which the runner in the
  // gates page writes and a person would have to forge deliberately:
  //
  //   RESULT row=4 build=<hash> provider=<label> outcome=pass txid=<id>
  //
  // The build hash is per row rather than once at the bottom, because a matrix
  // is signed against an artefact and rows get re-run one at a time - a single
  // signature at the end cannot tell which rows were run against what.
  const ROW_COUNT = 14;
  const results = new Map();
  for (const line of matrix.split('\n')) {
    const found = /^\s*RESULT\s+row=(\d+)\s+build=(\S+)\s+provider=(\S+)\s+outcome=(\S+)/.exec(line);
    if (!found) continue;
    const [, row, build, provider, outcome] = found;
    results.set(Number(row), { build, provider, outcome });
  }

  const missing = [];
  const stale = [];
  const failed = [];
  for (let row = 1; row <= ROW_COUNT; row++) {
    const found = results.get(row);
    if (!found) {
      missing.push(row);
      continue;
    }
    if (found.outcome !== 'pass') failed.push(`${row} (${found.outcome})`);
    if (htmlHash && found.build !== htmlHash) stale.push(`${row} (${found.build})`);
  }

  if (missing.length) {
    refuse(
      `wallet matrix row(s) ${missing.join(', ')} carry no RESULT line. Run the wallet track in ` +
        'dist/xchess-gates.html and paste what it writes; editing the table by hand no longer ' +
        'satisfies this gate.'
    );
  }
  if (failed.length) refuse(`wallet matrix row(s) did not pass: ${failed.join(', ')}`);
  if (stale.length) {
    refuse(
      `wallet matrix row(s) were run against a different build: ${stale.join(', ')}. This build ` +
        `is ${htmlHash}.`
    );
  }
}

const LAUNCH = resolve(ROOT, 'ops/LAUNCH.md');
if (existsSync(LAUNCH)) {
  const launch = readFileSync(LAUNCH, 'utf8');
  const open = (launch.match(/^- \[ \]/gm) || []).length;
  if (open > 0) refuse(`${open} item(s) in ops/LAUNCH.md are unchecked`);
}

// ---------------------------------------------------------------------------

console.log('\n================ release ================');

if (manifest) {
  console.log(`  product   ${manifest.product} ${manifest.build}`);
  console.log(`  contract  ${manifest.contract} (${manifest.network})`);
  console.log(`  sha256    ${manifest.htmlSha256}`);
  console.log(`  bytes     ${Number(manifest.bytes).toLocaleString()}`);
}

if (refusals.length) {
  console.error(`\nRELEASE REFUSED. ${refusals.length} gate(s) are not closed:\n`);
  for (const why of refusals) console.error(`  - ${why}`);
  console.error(
    '\nAn inscription is permanent and a contract is immutable. The expensive\n' +
      'mistake is not a failed release, it is a release that should have failed.'
  );
  process.exit(1);
}

console.log('\nEvery gate is closed. This artefact may be inscribed.');

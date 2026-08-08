#!/usr/bin/env node
// The verification suite.
//
//   npm run verify
//
// Every gate that can run without a network, a wallet or a person, in the order
// that fails fastest. A gate that fails stops the run: there is no point
// measuring sponsorship economics against an engine that cannot generate moves.
//
// This is deliberately not the same thing as `npm run release`. Release adds
// the gates that need a built artefact and a signed-off manual matrix, and
// refuses to produce anything if any of them is missing.

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEEP = process.env.PERFT_DEEP === '1' || process.argv.includes('--deep');

/**
 * Each gate names the layer of the harness it belongs to, so a failure points
 * at the section of the brief it comes from rather than only at a command.
 */
const GATES = [
  {
    layer: 1,
    name: 'types',
    why: 'a type error in a permanent artefact is a bug nobody can patch',
    run: ['npx', ['tsc', '--noEmit']]
  },
  {
    layer: 1,
    name: 'contract syntax and analysis',
    why: 'the contract must compile under the Clarity version it will be deployed as',
    run: ['clarinet', ['check']]
  },
  {
    layer: 1,
    name: 'serverlessness audit',
    why: 'production must not require a server of any kind',
    run: ['node', ['harness/serverless-audit.mjs']]
  },
  {
    layer: '2-4',
    name: 'engine, replay, rules, codec, wallet, ratings',
    why: 'perft, replay totality, canonical hashing and the wallet conformance suite',
    run: ['npx', ['vitest', 'run']]
  },
  {
    layer: 2,
    name: 'deep perft',
    why: 'the full canonical set, about 590 million nodes',
    run: ['npx', ['vitest', 'run', 'tests/perft']],
    env: { PERFT_DEEP: '1' },
    skip: !DEEP,
    skipNote: 'pass --deep or set PERFT_DEEP=1'
  },
  {
    layer: '5-8',
    name: 'contract, parity, economics, sponsorship',
    why: 'Clarinet behaviour, mock/contract parity, solvency, and the zero-STX gate',
    run: ['npx', ['vitest', 'run', '-c', 'vitest.clarinet.config.ts']]
  },
  {
    layer: 11,
    name: 'build',
    why: 'the artefact layers test what was BUILT, so there has to be one',
    run: ['node', ['packages/build/build.mjs']]
  },
  {
    layer: '10-11',
    name: 'artefact and Xtrata runtime',
    why: 'the double-boot bug was correct in every source file and wrong in the bundle',
    run: ['npx', ['vitest', 'run', 'tests/artifact', 'tests/runtime']]
  }
];

const results = [];
let failed = false;

for (const gate of GATES) {
  const label = `layer ${gate.layer}: ${gate.name}`;

  if (gate.skip) {
    console.log(`\n---- SKIP  ${label} (${gate.skipNote})`);
    results.push({ label, state: 'skipped' });
    continue;
  }

  console.log(`\n---- RUN   ${label}\n      ${gate.why}\n`);
  const [command, args] = gate.run;
  const started = Date.now();
  const outcome = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...(gate.env ?? {}) },
    shell: process.platform === 'win32'
  });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);

  if (outcome.status !== 0) {
    console.error(`\n---- FAIL  ${label} after ${seconds}s`);
    results.push({ label, state: 'failed', seconds });
    failed = true;
    break;
  }

  console.log(`\n---- PASS  ${label} in ${seconds}s`);
  results.push({ label, state: 'passed', seconds });
}

console.log('\n================ verify ================');
for (const result of results) {
  const mark = result.state === 'passed' ? 'pass' : result.state === 'skipped' ? 'skip' : 'FAIL';
  console.log(`  ${mark}  ${result.label}${result.seconds ? `  (${result.seconds}s)` : ''}`);
}

const skipped = results.filter((r) => r.state === 'skipped');
if (skipped.length && !failed) {
  console.log(`\n${skipped.length} gate(s) skipped. A release run must not skip any.`);
}

if (failed) {
  console.error('\nverify FAILED. Nothing may be built or inscribed from this tree.');
  process.exit(1);
}

console.log('\nverify passed.');

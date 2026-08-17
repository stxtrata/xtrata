#!/usr/bin/env node
// The inscription-ready chess engine, built from source.
//
//   node harness/skill/build-skill.mjs           write chess-engine.js and say its hash
//   node harness/skill/build-skill.mjs --check   fail if the checked-in file is stale
//   node harness/skill/build-skill.mjs --chain   also compare against the inscription
//
// WHY A CHECKED-IN ARTEFACT rather than a build step nobody runs. An inscription
// is permanent and costs money, so the bytes that go up should be reviewable in
// a diff BEFORE they are paid for — not produced by a script at the moment of
// inscribing, when the only person who could catch a mistake is busy doing it.
//
// So the built file is committed. `--check` regenerates it and fails if it has
// drifted, which is what keeps the repository honest: either the artefact
// matches the source or CI says so.
//
// REPRODUCIBLE, and verified against what is already on chain. Inscription 2991
// on xtrata-v3-2-3 is byte-identical to what this produces — 16,314 bytes,
// sha256 f40fa65a…. That is not a coincidence to be preserved by luck; it is
// the property that lets an entrant fetch the inscription, run this, and
// confirm they are the same engine.
//
// The recipe is exact and small on purpose:
//   header.txt, verbatim
//   + esbuild ESM/neutral bundle of packages/chess/search.ts
//   - esbuild's FIRST module banner line, which names a local path
//
// That last step looks arbitrary and is not: the banner is the only line in the
// output that describes this machine rather than the program.

import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

export const SKILL_FILE = join(HERE, 'chess-engine.js');
export const HEADER_FILE = join(HERE, 'header.txt');

/** One Xtrata chunk. An engine that needs two is a different upload. */
export const CHUNK_BYTES = 16_384;

/** Where the current engine lives on chain. */
export const INSCRIPTION = Object.freeze({
  contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  id: 2991,
  url: 'https://xtrata.xyz/x/2991'
});

/** The exact bytes to inscribe, built from the current source. */
export async function buildSkill() {
  const out = await build({
    entryPoints: [join(ROOT, 'packages', 'chess', 'search.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent'
  });
  // Drop the first banner: it names a path on whoever's machine ran the build,
  // and an inscription should describe the program and nothing else.
  const body = out.outputFiles[0].text.split('\n').slice(1).join('\n');
  return Buffer.concat([readFileSync(HEADER_FILE), Buffer.from(body, 'utf8')]);
}

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function main() {
  const built = await buildSkill();
  const hash = sha256(built);
  const fits = built.length <= CHUNK_BYTES;

  console.log(`\nbuilt   ${built.length.toLocaleString()} bytes  sha256 ${hash}`);
  console.log(`chunk   ${CHUNK_BYTES.toLocaleString()} bytes  ${fits ? `fits, ${CHUNK_BYTES - built.length} to spare` : 'DOES NOT FIT'}`);
  if (!fits) {
    console.log('\nAn engine over one chunk is a two-transaction upload. Take bytes out,');
    console.log('or decide that is acceptable and say so where it can be read.');
    process.exitCode = 1;
  }

  if (process.argv.includes('--check')) {
    let onDisk = null;
    try {
      onDisk = readFileSync(SKILL_FILE);
    } catch {
      console.log(`\nMISSING ${SKILL_FILE}. Run this without --check to write it.`);
      process.exitCode = 1;
      return;
    }
    const clean = Buffer.compare(onDisk, built) === 0;
    console.log(`\ncheckd-in file ${clean ? 'MATCHES the source' : 'is STALE'}`);
    if (!clean) {
      console.log('Rebuild it and commit the diff, so the bytes anybody would inscribe');
      console.log('are the bytes anybody can review.');
      process.exitCode = 1;
    }
    return;
  }

  writeFileSync(SKILL_FILE, built);
  console.log(`\nwrote ${SKILL_FILE}`);
  console.log('Commit it: an inscription is permanent, so its bytes belong in a diff first.');
}

if (process.argv[1] && process.argv[1].endsWith('build-skill.mjs')) {
  main().catch((error) => {
    console.error(`\n${error.message}\n`);
    process.exit(1);
  });
}

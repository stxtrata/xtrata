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

/**
 * The second inscribable artefact, and the reason there is a second.
 *
 * A manifest says which games form a tournament and who played them, and it is
 * worth exactly as much as whatever produced it. Produced on the Director's
 * machine, a tournament's identity rests on trusting the Director. Produced by
 * inscribed code from public inputs, anybody can run it against the same chain
 * and get the same answer — and a manifest that disagrees is simply wrong.
 */
export const BUILDER_FILE = join(HERE, 'manifest-builder.js');
export const BUILDER_HEADER_FILE = join(HERE, 'manifest-builder-header.txt');

/** One Xtrata chunk. An engine that needs two is a different upload. */
export const CHUNK_BYTES = 16_384;

/** Where the current engine lives on chain. */
export const INSCRIPTION = Object.freeze({
  contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  id: 2991,
  url: 'https://xtrata.xyz/x/2991'
});

/**
 * The manifest builder, and what it derived.
 *
 * 2993 IS THE TOURNAMENT ID. It is the root — nothing supersedes it — and under
 * the revision rule it is also final, because every game it names had already
 * started before it was inscribed. A tournament whose results exist cannot have
 * its field rewritten, which is the property the rule is for.
 *
 * The chain of provenance is the point of inscribing the builder rather than
 * only its output: 2993 declares 2992, so anybody can fetch the code, run it
 * against the same public chain with the same public addresses, and get the
 * same 2,817 bytes. The manifest is reproducible rather than asserted.
 *
 * Owned by the DIRECTOR, not by the wallet that created the engine. The
 * organiser owns the tournament, and only that wallet can ever revise it.
 */
export const BUILDER_INSCRIPTION = Object.freeze({
  id: 2992,
  sha256: '7c859df81e21c253cbbd78d8be99d292188af3cb0f6c39d57da24fd7c991b850',
  url: 'https://xtrata.xyz/x/2992'
});

export const TOURNAMENT_INSCRIPTION = Object.freeze({
  id: 2993,
  sha256: '0041a84a8f46c6c6e31d972ffe1cfd7eb0d3014f89a6da6f9a1d3cdff2f7aa7a',
  creator: 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S',
  url: 'https://xtrata.xyz/x/2993'
});

/** The exact bytes to inscribe for the manifest builder. */
export async function buildBuilder() {
  return bundleFor('protocol', 'manifest-builder.ts', BUILDER_HEADER_FILE);
}

/** The exact bytes to inscribe, built from the current source. */
export async function buildSkill() {
  return bundleFor('chess', 'search.ts', HEADER_FILE);
}

async function bundleFor(pkg, file, headerFile) {
  const out = await build({
    entryPoints: [join(ROOT, 'packages', pkg, file)],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent'
  });
  // Drop the first banner: it names a path on whoever's machine ran the build,
  // and an inscription should describe the program and nothing else.
  const body = out.outputFiles[0].text.split('\n').slice(1).join('\n');
  return Buffer.concat([readFileSync(headerFile), Buffer.from(body, 'utf8')]);
}

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function main() {
  if (process.argv.includes('--builder')) return mainFor('manifest builder', buildBuilder, BUILDER_FILE);
  return mainFor('chess engine', buildSkill, SKILL_FILE);
}

async function mainFor(label, make, file) {
  const built = await make();
  const hash = sha256(built);
  const fits = built.length <= CHUNK_BYTES;

  console.log(`\n${label}`);
  console.log(`built   ${built.length.toLocaleString()} bytes  sha256 ${hash}`);
  console.log(`chunk   ${CHUNK_BYTES.toLocaleString()} bytes  ${fits ? `fits, ${CHUNK_BYTES - built.length} to spare` : 'DOES NOT FIT'}`);
  if (!fits) {
    console.log('\nAn engine over one chunk is a two-transaction upload. Take bytes out,');
    console.log('or decide that is acceptable and say so where it can be read.');
    process.exitCode = 1;
  }

  if (process.argv.includes('--check')) {
    let onDisk = null;
    try {
      onDisk = readFileSync(file);
    } catch {
      console.log(`\nMISSING ${file}. Run this without --check to write it.`);
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

  writeFileSync(file, built);
  console.log(`\nwrote ${file}`);
  console.log('Commit it: an inscription is permanent, so its bytes belong in a diff first.');
}

if (process.argv[1] && process.argv[1].endsWith('build-skill.mjs')) {
  main().catch((error) => {
    console.error(`\n${error.message}\n`);
    process.exit(1);
  });
}

/**
 * The engine, fetched from chain and run.
 *
 * WHAT MAKES THIS SAFE IS THE PIN, not the chain. Executing bytes because they
 * are on a blockchain would be executing whatever the owner of that id decided
 * to put there. So the hash is checked BEFORE anything is imported, against a
 * value committed in this repository, and a mismatch refuses rather than warns:
 * the whole point of running the inscribed engine is to be able to say which
 * engine ran, and code that might be something else cannot say that.
 *
 * FETCHED ONCE PER RUN. A tournament that read the chain per move would gain a
 * failure mode, and three rounds have already gone to that class of bug. This
 * happens before the first game is opened, and after it the run is local and
 * offline for the rest of its life.
 */
export const INSCRIBED_SHA256 =
  'f40fa65a4fb2f102769526f023ff520bb8b7ed6882d11a99ab60540858d2ad29';

export async function fetchInscribedSkill({ Cl, fetchImpl = fetch } = {}) {
  if (!Cl) throw new Error('fetchInscribedSkill needs Cl from @stacks/transactions');
  const [addr, name] = INSCRIPTION.contract.split('.');

  const chunkCount = async () => {
    const body = await callRead(fetchImpl, addr, name, 'get-inscription-chunks', [
      Cl.serialize(Cl.uint(INSCRIPTION.id))
    ]);
    const v = Cl.deserialize(body.result);
    return Number(v?.value?.value ?? v?.value ?? 1);
  };

  const chunks = await chunkCount();
  const parts = [];
  for (let index = 0; index < chunks; index++) {
    const body = await callRead(fetchImpl, addr, name, 'get-chunk', [
      Cl.serialize(Cl.uint(INSCRIPTION.id)),
      Cl.serialize(Cl.uint(index))
    ]);
    const v = Cl.deserialize(body.result);
    const raw = v?.value?.value ?? v?.value;
    parts.push(Buffer.from(typeof raw === 'string' ? raw.replace(/^0x/, '') : raw, 'hex'));
  }
  const bytes = Buffer.concat(parts);

  const hash = sha256(bytes);
  if (hash !== INSCRIBED_SHA256) {
    throw new Error(
      `inscription ${INSCRIPTION.id} hashes to ${hash}, and this build expects ` +
        `${INSCRIBED_SHA256}. Refusing to run code that is not the pinned engine. ` +
        'If the engine was deliberately re-inscribed, update INSCRIBED_SHA256 and ' +
        'the artefact together.'
    );
  }

  // Imported only after the hash matched.
  const module = await import(`data:text/javascript;base64,${bytes.toString('base64')}`);
  return { module, bytes, hash };
}

async function callRead(fetchImpl, addr, name, fn, args) {
  const response = await fetchImpl(
    `https://api.hiro.so/v2/contracts/call-read/${addr}/${name}/${fn}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: addr, arguments: args })
    }
  );
  const body = await response.json();
  if (!body?.okay) throw new Error(`${fn}: ${body?.cause ?? `HTTP ${response.status}`}`);
  return body;
}

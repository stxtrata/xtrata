#!/usr/bin/env node
// Inscribe a tournament manifest, so the pairings are committed before play.
//
//   node harness/wizards/inscribe-manifest.mjs --file /tmp/two.json
//   node harness/wizards/inscribe-manifest.mjs --file /tmp/two.json --live
//
// WHY THIS EXISTS AT ALL, rather than a manifest simply living in this repo. A
// tournament that is described afterwards is a claim by whoever describes it.
// One inscribed BEFORE the first move is a commitment nobody can revise, and
// `provenance` in packages/protocol/tournament.ts reads exactly that: a manifest
// whose inscription height precedes the first MOVE reads `committed`, and one
// that came later reads `compiled`. Both are honest labels; only one of them is
// worth the 0.3 STX.
//
// Which is why the order is open, build, inscribe, THEN play, and why opening
// does not spoil it - a game with no submissions has no first move.
//
// THE ROUTE THAT WORKS, and the two that do not. Recorded here rather than in a
// document nobody reads at the moment it matters:
//
//   xtrata-v2-1-0 via the helper  -> u101 ERR-NOT-FOUND. It is a MIGRATION
//                                    TARGET, never a mint target: Genesis #107
//                                    lives on v3-2-3, so the dependency cannot
//                                    resolve. It MINED, so the fee burned.
//   xtrata-v3-2-3 via the helper  -> BadFunctionArgument at broadcast, free.
//                                    xtrata-small-mint-v1-0 carries its own
//                                    core setting and will not take v3.
//
// The core's own `mint-single-tx-recursive` takes no trait argument and needs no
// helper. It is the one that works.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Cl,
  makeContractCall,
  broadcastTransaction,
  getAddressFromPrivateKey,
  fetchNonce,
  Pc,
  PostConditionMode
} from '@stacks/transactions';

import { WizardSafetyError } from './wizards-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const [XTRATA_ADDRESS, XTRATA_NAME] = XTRATA.split('.');

const CHUNK = 16_384;

/**
 * The miner fee, which is about SIZE and not about the protocol fee.
 *
 * A flat 20,000 was fine for every one-chunk document and was rejected outright
 * for a two-chunk one: FeeTooLow, expected 25,694. Miners price by bytes, and a
 * chunk is sixteen kilobytes of them, so a constant was always going to fail at
 * whatever size crossed the line first.
 *
 * Free to get wrong in this direction - the node refuses it at broadcast and
 * nothing is spent - but it costs a round trip and looks like a failure.
 */
const txFeeFor = (chunks) => 20_000n + 15_000n * BigInt(Math.max(0, chunks - 1));

const LIVE = process.argv.includes('--live');
const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};

/**
 * The manifest this one follows, if any: `--after 3001`.
 *
 * A CHAIN THAT CAN ONLY BE WALKED ONE WAY, and worth having anyway. Xtrata
 * exposes `get-dependencies` and `get-parents` and nothing that asks what
 * depends ON a token, so this cannot be used to find the newest tournament —
 * that is what the director's wallet is for, see TournamentIndex.
 *
 * What it buys is independence from any wallet. Given ONE manifest, a reader
 * can follow it back through every earlier tournament without being told an
 * address, and without the organiser still holding anything. Two indexes
 * pointing opposite ways survive the loss of either.
 *
 * It has to be decided before inscribing, because a dependency cannot be added
 * afterwards. 2993 and 3001 are not chained to each other for exactly that
 * reason - the idea arrived after they were both permanent.
 */
const AFTER = arg('after') ? Number(arg('after')) : null;

/**
 * NOTHING HANGS OFF GENESIS ANY MORE.
 *
 * Every document this script inscribed used to declare #107 as a dependency, so
 * a tournament manifest and a manual both claimed to depend on an identity
 * inscription they do not read and cannot be checked against. A dependency is a
 * statement that one document needs another to be understood, and none of these
 * needed that one.
 *
 * What remains is `--after`, which is a real relationship: this document follows
 * that one, and a reader holding either can walk the chain. When it is absent
 * there are no dependencies at all, which is the honest shape for the first of
 * anything.
 */
const DEPENDS_ON = AFTER ? [AFTER] : [];

function env() {
  const found = {};
  for (const line of readFileSync(join(HERE, '.env.wizards'), 'utf8').split('\n')) {
    const at = line.indexOf('=');
    if (at > 0 && !line.trim().startsWith('#')) {
      found[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return found;
}

/** Read the fee unit off the core rather than trusting a remembered number. */
async function readFeeUnit() {
  const response = await fetch(
    `https://api.mainnet.hiro.so/v2/contracts/call-read/${XTRATA_ADDRESS}/${XTRATA_NAME}/get-fee-unit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: XTRATA_ADDRESS, arguments: [] })
    }
  );
  const body = await response.json();
  if (!body.okay) throw new WizardSafetyError(`could not read the fee unit: ${JSON.stringify(body).slice(0, 200)}`);
  // DESERIALISED, not sliced. Hand-parsing this hex is how the last two bugs
  // here happened: the value already carries its own `0x`, so prefixing it
  // again produced `0x0x…`, and it is an `(ok uint)` RESPONSE rather than a
  // bare uint, so stripping only the uint tag leaves the response tag behind.
  // The SDK knows both facts.
  const value = Cl.deserialize(String(body.result));
  const inner = value.type === 'ok' ? value.value : value;
  if (typeof inner?.value !== 'bigint') {
    throw new WizardSafetyError(`get-fee-unit returned something unexpected: ${JSON.stringify(body).slice(0, 120)}`);
  }
  return inner.value;
}

async function main() {
  const file = arg('file');
  if (!file) throw new WizardSafetyError('--file is required: the manifest to inscribe');

  const bytes = readFileSync(file);
  const text = bytes.toString('utf8');
  // What this script can inscribe, recognised by what the file BEGINS with.
  // Checked because an inscription cannot be edited: a file that is none of
  // these is 0.3 STX spent on something nothing will ever read.
  //
  // The mime type matters as much as the bytes. Served as text/plain a page
  // renders as its own source, and there is no correcting that afterwards.
  const KINDS = [
    { starts: 'X-CHESS-TOURNAMENT/1', kind: 'tournament manifest', mime: 'text/plain' },
    { starts: 'X-CHESS-DOCS/1', kind: 'manual', mime: 'text/plain' },
    { starts: 'X-CHESS-RATINGS/1', kind: 'rating checkpoint', mime: 'text/plain' },
    { starts: '<!doctype html', kind: 'page', mime: 'text/html' }
  ];
  const header = text.split('\n')[0].trim();
  const match = KINDS.find((k) => header.toLowerCase().startsWith(k.starts.toLowerCase()));
  if (!match) {
    throw new WizardSafetyError(
      `${file} begins "${header.slice(0, 40)}", which is none of ` +
        `${KINDS.map((k) => k.starts).join(', ')}. Nothing would read it.`
    );
  }
  const { kind, mime } = match;

  // A CHECKPOINT IS REGENERATED BEFORE IT IS SIGNED, and refused if it differs.
  //
  // Every other document here is checked for shape. This one is checked for
  // TRUTH, because it is the only one a board believes without replaying: the
  // rating table it carries is taken on trust by everybody who reads it. So the
  // walk is done again, now, against the chain, and the bytes are compared.
  //
  // The comparison is only meaningful because the writing is canonical - fixed
  // key order, games in ranked-index order, no timestamp. Two honest walks
  // produce identical bytes or one of them is wrong, and the diff says which.
  //
  // A file that is merely STALE fails this too, which is correct: the chain has
  // moved, and inscribing a table that no longer follows from it would be
  // publishing a claim that was true once.
  if (kind === 'rating checkpoint') {
    console.log('\nregenerating the walk to check this file against the chain...\n');
    const { execFileSync } = await import('node:child_process');
    const fresh = execFileSync(
      process.execPath,
      [join(HERE, 'build-checkpoint.mjs')],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
    );
    const emitted = fresh.slice(fresh.indexOf('X-CHESS-RATINGS/1'));
    if (emitted.trim() !== text.trim()) {
      throw new WizardSafetyError(
        'this checkpoint does not match a walk of the chain done just now.\n\n' +
          'Either the chain has moved since the file was written, or the file was not ' +
          'produced by build-checkpoint.mjs. Regenerate it and inscribe that:\n\n' +
          `  node harness/wizards/build-checkpoint.mjs --out ${file}`
      );
    }
    console.log('the file matches the chain exactly.\n');
  }

  // A page that reaches for anything off its own bytes is broken the moment the
  // host it reaches for goes away, and an inscription outlives hosts.
  if (mime === 'text/html') {
    const external = [...text.matchAll(/\b(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)/gi)]
      .map((m) => m[1])
      .filter((url) => !/^https:\/\/xtrata\.xyz\/i\//.test(url));
    if (external.length) {
      throw new WizardSafetyError(
        `this page loads from ${external.length} external place(s), starting with ` +
          `${external[0].slice(0, 60)}. An inscription has to carry everything it needs.`
      );
    }
  }

  // The same incremental chain the contract computes in `process-chunk`:
  // sha256(running || chunk), starting from thirty-two zero bytes.
  const chunks = [];
  let running = Buffer.alloc(32);
  for (let at = 0; at < bytes.length; at += CHUNK) {
    const piece = bytes.subarray(at, at + CHUNK);
    chunks.push(piece);
    running = createHash('sha256').update(Buffer.concat([running, piece])).digest();
  }
  if (chunks.length > 32) {
    throw new WizardSafetyError(
      `${chunks.length} chunks, and one transaction carries 32. A larger manifest needs the staged route.`
    );
  }

  const vars = env();
  const senderKey = vars.XCHESS_DIRECTOR_KEY;
  if (!senderKey) throw new WizardSafetyError('no XCHESS_DIRECTOR_KEY in .env.wizards');
  const senderAddress = getAddressFromPrivateKey(senderKey, 'mainnet');

  const feeUnit = await readFeeUnit();
  // begin_fee + seal_fee, per the contract's own formula.
  //
  // LESS-EQUAL, NEVER EQUAL. An exact-match post condition aborts and burns the
  // miner fee - which has happened here before and is recorded in the project
  // memory as the SentEq failure. A cap is the whole job of this condition.
  const spendCap = feeUnit + feeUnit * (1n + BigInt(Math.ceil(chunks.length / 50)));

  console.log(`\nfile      ${file}`);
  console.log(`kind      ${kind}  (served as ${mime})`);
  // Whatever the document calls itself, by its own convention: a manifest has a
  // name field, a page has a title, a manual has its second line. Printed
  // because it is the last human-readable check before something permanent.
  const called =
    (/"name":\s*"([^"]+)"/.exec(text) ?? [])[1] ??
    (/<title[^>]*>([^<]+)<\/title>/i.exec(text) ?? [])[1] ??
    text.split('\n')[1]?.trim() ??
    '?';
  console.log(`name      ${called.trim()}`);
  if (kind === 'tournament manifest') {
    console.log(`games     ${(text.match(/"id":/g) ?? []).length}`);
  }
  console.log(`sender    ${senderAddress}`);
  console.log(`payload   ${bytes.length} bytes in ${chunks.length} chunk(s)`);
  console.log(`hash      0x${running.toString('hex')}`);
  console.log(`fee unit  ${feeUnit} uSTX (read live)`);
  const txFee = txFeeFor(chunks.length);
  console.log(`spend cap ${spendCap} uSTX + ${txFee} miner fee`);
  console.log(`depends   ${DEPENDS_ON.length ? `#${DEPENDS_ON.join(', #')}` : 'nothing'}`);
  if (!AFTER) {
    console.log('          (no --after, so a reader who finds this cannot walk back to an');
    console.log('           earlier one. Correct for a first document, worth setting otherwise)');
  }

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed. Add --live to inscribe.');
    console.log('An inscription is permanent and cannot be edited.');
    return;
  }

  const tx = await makeContractCall({
    contractAddress: XTRATA_ADDRESS,
    contractName: XTRATA_NAME,
    functionName: 'mint-single-tx-recursive',
    functionArgs: [
      Cl.buffer(running),
      Cl.stringAscii(mime),
      Cl.uint(bytes.length),
      Cl.list(chunks.map((c) => Cl.buffer(c))),
      Cl.stringAscii(`data:text/plain,x-chess-${kind.replace(/\s+/g, '-')}`),
      Cl.list(DEPENDS_ON.map((id) => Cl.uint(id)))
    ],
    senderKey,
    network: 'mainnet',
    fee: txFee,
    nonce: await fetchNonce({ address: senderAddress, network: 'mainnet' }),
    postConditions: [Pc.principal(senderAddress).willSendLte(spendCap).ustx()],
    postConditionMode: PostConditionMode.Deny
  });

  const out = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
  if (out.error || out.reason) {
    throw new WizardSafetyError(`rejected: ${JSON.stringify(out).slice(0, 300)}`);
  }
  console.log(`\ntxid ${out.txid}`);
  console.log('Once it confirms, read the token id off the mint event and play with:');
  console.log('  node harness/wizards/run-tournament.mjs --manifest <id> --live');
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});

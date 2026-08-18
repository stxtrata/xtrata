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
const TX_FEE = 20_000n;

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
  // The two documents this script can inscribe, both plain text and both read
  // by header. Checked because an inscription cannot be edited: a file that is
  // neither is 0.3 STX spent on something no board will ever read.
  const KINDS = {
    'X-CHESS-TOURNAMENT/1': 'tournament manifest',
    'X-CHESS-DOCS/1': 'manual'
  };
  const header = text.split('\n')[0].trim();
  const kind = KINDS[header];
  if (!kind) {
    throw new WizardSafetyError(
      `${file} begins "${header.slice(0, 40)}", which is neither ` +
        `${Object.keys(KINDS).join(' nor ')}. No board would read it.`
    );
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
  console.log(`kind      ${kind}`);
  console.log(
    `name      ${(/"name":\s*"([^"]+)"/.exec(text) ?? [])[1] ?? text.split('\n')[1]?.trim() ?? '?'}`
  );
  if (kind === 'tournament manifest') {
    console.log(`games     ${(text.match(/"id":/g) ?? []).length}`);
  }
  console.log(`sender    ${senderAddress}`);
  console.log(`payload   ${bytes.length} bytes in ${chunks.length} chunk(s)`);
  console.log(`hash      0x${running.toString('hex')}`);
  console.log(`fee unit  ${feeUnit} uSTX (read live)`);
  console.log(`spend cap ${spendCap} uSTX + ${TX_FEE} miner fee`);
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
      Cl.stringAscii('text/plain'),
      Cl.uint(bytes.length),
      Cl.list(chunks.map((c) => Cl.buffer(c))),
      Cl.stringAscii(
        kind === 'manual'
          ? 'data:text/plain,x-chess-manual'
          : 'data:text/plain,x-chess-tournament-manifest'
      ),
      Cl.list(DEPENDS_ON.map((id) => Cl.uint(id)))
    ],
    senderKey,
    network: 'mainnet',
    fee: TX_FEE,
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

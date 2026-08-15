#!/usr/bin/env node
/**
 * play.mjs — the wizards play chess at the canary contract.
 *
 *   node harness/wizards/play.mjs                 a dry run: says what it would do
 *   node harness/wizards/play.mjs --live          signs and broadcasts, for real
 *   node harness/wizards/play.mjs balances        what each wizard holds
 *   node harness/wizards/play.mjs sweep --to SP…  send the floats back
 *
 * DRY BY DEFAULT, and that is not a convenience. Every act here spends real STX
 * on mainnet and none of it can be undone, so the default has to be the one
 * that costs nothing.
 *
 * What it proves, and what it does not: a wizard signs with a raw key through
 * @stacks/transactions, and a player signs through Xverse or Leather, which
 * parse the request and forward what they choose to. Those are different paths.
 * This proves the CONTRACT accepts the call and the ENCODING is right —
 * including the contract-principal post condition — and proves nothing about
 * whether a wallet will send it. See harness/wallets/MATRIX.md, which still
 * needs a person.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  Cl,
  Pc,
  PostConditionMode,
  broadcastTransaction,
  makeContractCall,
  makeSTXTokenTransfer
} from '@stacks/transactions';

import {
  ALLOWED_CONTRACT,
  DEFAULT_SPEND_CAP_USTX,
  DIRECTOR,
  PERSONAS,
  TARGET_FLOAT_USTX,
  assertTransferAllowed,
  looksLikeMainnetAddress,
  planFunding,
  SCRIPTED_GAME,
  WizardSafetyError,
  assertBroadcastAllowed,
  planRun,
  readFleet,
  scrub
} from './wizards-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(HERE, '.env.wizards');
const API = 'https://api.mainnet.hiro.so';
const [CONTRACT_ADDRESS, CONTRACT_NAME] = ALLOWED_CONTRACT.split('.');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LIVE = process.argv.includes('--live');
const ustx = (micro) => `${(Number(micro) / 1_000_000).toFixed(6)} STX`;

/**
 * The env file, read here rather than by a dependency.
 *
 * dotenv would do this in one line and would also be a dependency in a project
 * that keeps them countable, for a format this simple.
 */
function readEnvFile(path = ENV_FILE) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const found = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (found) out[found[1]] = found[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const api = async (path) => {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error(`${path} -> ${response.status}`);
  return response.json();
};

const balanceOf = async (address) => {
  const body = await api(`/extended/v1/address/${address}/balances`);
  return BigInt(body?.stx?.balance ?? '0');
};

/**
 * A read-only call, on the path that actually exists.
 *
 * `call-read`, NOT `call-read-only`. The second reads like the right name, is
 * what the docs suggest, and 404s — returning "No such file", which arrives as a
 * JSON parse error several frames away from the mistake. The board has always
 * used `call-read` (packages/chain/client.ts), so this is not a discovery so
 * much as a reminder to look at what already works.
 */
async function readOnly(functionName, args = []) {
  const response = await fetch(
    `${API}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: CONTRACT_ADDRESS, arguments: args })
    }
  );
  if (!response.ok) throw new Error(`${functionName}: HTTP ${response.status}`);
  const body = await response.json();
  if (!body?.okay) throw new Error(`${functionName}: ${body?.cause ?? 'read failed'}`);
  return Cl.deserialize(body.result);
}

/** The open fee, from the contract rather than from a constant here. */
async function readOpenFee() {
  return BigInt((await readOnly('get-open-fee')).value);
}

/**
 * Sign and send one call, or refuse.
 *
 * The gate runs FIRST and every refusal is a throw. Nothing below this line
 * happens for a dry run, which is what makes a dry run free.
 */
async function send({ wizard, functionName, functionArgs, spendUstx, postConditions, spent, cap }) {
  const balance = await balanceOf(wizard.address);
  const allowed = assertBroadcastAllowed({
    live: LIVE,
    contract: ALLOWED_CONTRACT,
    functionName,
    network: 'mainnet',
    senderAddress: wizard.address,
    balanceUstx: balance,
    plannedSpendUstx: spendUstx,
    spentSoFarUstx: spent,
    spendCapUstx: cap
  });

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderKey: wizard.key,
    network: 'mainnet',
    postConditionMode: PostConditionMode.Deny,
    postConditions
  });
  const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
  if (result.error) throw new Error(scrub(JSON.stringify(result)));
  return { txid: result.txid, spentAfterUstx: allowed.spentAfterUstx };
}

/** Wait for a transaction to leave the mempool. */
async function settle(txid, tries = 40) {
  for (let n = 0; n < tries; n++) {
    await new Promise((done) => setTimeout(done, 15_000));
    try {
      const body = await api(`/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
      if (body.tx_status === 'success') return 'success';
      if (body.tx_status && body.tx_status !== 'pending') return body.tx_status;
    } catch {
      // Not indexed yet. Asking again is the whole strategy.
    }
  }
  return 'timed out';
}

async function balances(fleet) {
  console.log('');
  for (const wizard of fleet.wizards) {
    if (!wizard.address) {
      console.log(`${wizard.name.padEnd(10)} not provisioned`);
      continue;
    }
    const held = await balanceOf(wizard.address);
    console.log(`${wizard.name.padEnd(10)} ${wizard.address}  ${ustx(held)}`);
  }
  console.log('');
}

/**
 * Send every float home.
 *
 * The way out. These are raw keys with no seed phrase, so a wizard cannot be
 * imported into Xverse or Leather to be emptied by hand — this is the same key
 * signing a transfer instead.
 *
 * Its own guard rather than the contract gate: a transfer is not a contract
 * call, so the function allow-list does not apply and the things worth checking
 * are different. Live, a real mainnet destination, and enough left to pay the
 * fee.
 */
async function sweep(fleet, to) {
  if (!looksLikeMainnetAddress(to)) {
    throw new WizardSafetyError(`--to ${to} is not a mainnet address`);
  }
  const fee = 3_000n;
  const fleetAddresses = fleet.wizards.map((w) => w.address).filter(Boolean);
  for (const wizard of fleet.wizards) {
    if (wizard.address === to) continue;
    if (!wizard.key) {
      console.log(`${wizard.name.padEnd(10)} not provisioned`);
      continue;
    }
    const balance = await balanceOf(wizard.address);
    const amount = balance - fee;
    if (amount <= 0n) {
      console.log(`${wizard.name.padEnd(10)} ${ustx(balance)} — nothing to send after the fee`);
      continue;
    }
    if (!LIVE) {
      console.log(`${wizard.name.padEnd(10)} would send ${ustx(amount)} to ${to}`);
      continue;
    }
    // `sweeping` is what lets this leave the fleet at all. Everything else the
    // Director does is confined to addresses it already knows.
    assertTransferAllowed({
      live: LIVE,
      from: wizard.address,
      to,
      amountUstx: amount,
      balanceUstx: balance,
      fleetAddresses,
      balanceFloorUstx: 0n,
      sweeping: true
    });
    const tx = await makeSTXTokenTransfer({
      recipient: to,
      amount,
      senderKey: wizard.key,
      network: 'mainnet',
      fee
    });
    const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
    if (result.error) {
      console.log(`${wizard.name.padEnd(10)} FAILED: ${scrub(JSON.stringify(result))}`);
      process.exitCode = 1;
      continue;
    }
    console.log(`${wizard.name.padEnd(10)} sent ${ustx(amount)} — ${result.txid}`);
  }
}

/**
 * The Director tops the players up.
 *
 * To a TARGET rather than by an amount, so running it twice costs nothing: a
 * wizard already at its float is skipped rather than doubled. That matters for
 * something meant to run unattended - the safe thing to do when unsure is to run
 * it again.
 */
async function fund(fleet) {
  const director = fleet.wizards.find((w) => w.id === DIRECTOR.id);
  if (!director?.key) {
    console.log('\nNo Director. Generate the fleet and fund it first.\n');
    process.exitCode = 1;
    return;
  }

  const balances = {};
  for (const wizard of fleet.wizards) {
    if (wizard.address) balances[wizard.address] = await balanceOf(wizard.address);
  }
  const held = balances[director.address] ?? 0n;
  const plan = planFunding({ fleet, balances });
  const fleetAddresses = fleet.wizards.map((w) => w.address).filter(Boolean);

  console.log(`\nDirector holds ${ustx(held)}`);
  if (!plan.transfers.length) {
    console.log(`Every player is at its float of ${ustx(TARGET_FLOAT_USTX)}. Nothing to do.\n`);
    return;
  }
  for (const transfer of plan.transfers) {
    console.log(
      `  ${transfer.who.padEnd(10)} holds ${ustx(transfer.heldUstx)} -> send ${ustx(transfer.amountUstx)}`
    );
  }
  console.log(`\n  total   ${ustx(plan.totalUstx)}`);

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed. Add --live to send.\n');
    return;
  }
  if (held < plan.totalUstx) {
    console.log(`\nThe Director cannot cover that. Send it more, or lower the float.\n`);
    process.exitCode = 1;
    return;
  }

  const fee = 3_000n;
  let balance = held;
  for (const transfer of plan.transfers) {
    assertTransferAllowed({
      live: LIVE,
      from: director.address,
      to: transfer.to,
      amountUstx: transfer.amountUstx,
      balanceUstx: balance,
      fleetAddresses
    });
    const tx = await makeSTXTokenTransfer({
      recipient: transfer.to,
      amount: transfer.amountUstx,
      senderKey: director.key,
      network: 'mainnet',
      fee
    });
    const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
    if (result.error) {
      console.log(`  ${transfer.who} FAILED: ${scrub(JSON.stringify(result))}`);
      process.exitCode = 1;
      return;
    }
    balance -= transfer.amountUstx + fee;
    console.log(`  ${transfer.who.padEnd(10)} sent — ${result.txid}`);
  }
  console.log('\nWait for these to confirm, then: node harness/wizards/play.mjs --live\n');
}

async function main() {
  const env = { ...readEnvFile(), ...process.env };
  const fleet = readFleet(env);
  const command = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'play';

  console.log(`\nX Chess wizards — ${LIVE ? 'LIVE, spending real STX' : 'dry run, nothing is sent'}`);
  console.log(`contract  ${ALLOWED_CONTRACT}`);

  if (!fleet.ready) {
    console.log(`\nNot provisioned: ${fleet.missing.join(', ')}.`);
    console.log('Generate with: node harness/wizards/make-wizards.mjs');
    console.log('Then paste the block into harness/wizards/.env.wizards and fund each wallet.\n');
    if (LIVE) process.exitCode = 1;
  }

  if (command === 'balances') {
    if (!fleet.ready) return;
    await balances(fleet);
    return;
  }

  if (command === 'fund') {
    await fund(fleet);
    return;
  }

  if (command === 'sweep') {
    // Home to the Director by default: the players' floats belong in the one
    // wallet you already fund. --to is for taking money OUT of the fleet, which
    // is the one transfer that leaves it, and it has to be typed.
    const director = fleet.wizards.find((w) => w.id === DIRECTOR.id);
    const to = arg('to') ?? director?.address ?? null;
    if (!to) {
      console.log('\nsweep needs somewhere to send it: --to SP...\n');
      process.exitCode = 1;
      return;
    }
    console.log(`\n${LIVE ? 'Sending' : 'Would send'} every float to ${to}\n`);
    await sweep(fleet, to);
    console.log('');
    return;
  }

  // Read from the chain when there is a fleet to read for, and clearly labelled
  // as a guess when there is not. Saying "read from the contract" over a
  // constant is the kind of small untruth that makes every other line suspect.
  const priced = fleet.ready;
  const openFee = priced ? await readOpenFee() : 1_000_000n;
  const plan = planRun({ fleet, openFeeUstx: openFee });
  const cap = BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX)));

  console.log(
    `open fee  ${ustx(openFee)}   ` +
      (priced ? '(read from the contract)' : '(ASSUMED - no fleet to price it against)')
  );
  console.log(`spend cap ${ustx(cap)}\n`);
  for (const step of plan.steps) {
    console.log(
      `  ${String(step.act).padEnd(8)} ${(step.who?.name ?? '?').padEnd(10)} ` +
        `${ustx(step.spendUstx).padStart(12)}   ${step.what}`
    );
  }
  console.log(`\n  total    ${ustx(plan.totalUstx)}`);

  if (plan.totalUstx > cap) {
    console.log(`\nThat is over the cap. Raise it with --spend-cap-ustx, or shorten the run.`);
    process.exitCode = 1;
    return;
  }

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed and nothing was sent.');
    console.log('Add --live to broadcast. Every act above is real and none of it can be undone.\n');
    return;
  }
  if (!fleet.ready) return;

  // ---- from here everything is real -----------------------------------

  let spent = 0n;
  const white = fleet.wizards.find((w) => w.id === 'wizard-1');
  const black = fleet.wizards.find((w) => w.id === 'wizard-2');

  console.log(`\nOpening a game: ${white.address} v ${black.address}`);
  const opened = await send({
    wizard: white,
    functionName: 'open-game',
    // A game that commits to no rules, so any board can read it and none has to
    // recover anything. The rules hash is what a real board would send; this
    // fleet is proving the CALL works, not the rule encoding, which
    // tests/rules already pins to golden vectors.
    functionArgs: [Cl.none(), Cl.bool(false)],
    spendUstx: BigInt(openFee) + 5_000n,
    postConditions: [Pc.principal(white.address).willSendLte(openFee).ustx()],
    spent,
    cap
  });
  spent = opened.spentAfterUstx;
  console.log(`  txid ${opened.txid}`);
  const settled = await settle(opened.txid);
  if (settled !== 'success') {
    console.log(`  the open did not land: ${settled}`);
    process.exitCode = 1;
    return;
  }

  const game = Number((await readOnly('get-game-count')).value);
  console.log(`  game ${game}`);

  for (const move of SCRIPTED_GAME) {
    const wizard = fleet.wizards.find((w) => w.id === move.by);
    console.log(`\n${wizard.name}: ${move.move} — ${move.note}`);
    const sent = await send({
      wizard,
      functionName: 'submit',
      functionArgs: [Cl.uint(game), Cl.stringAscii(move.move)],
      spendUstx: 5_000n,
      // NOTHING MOVES. With no sponsorship the contract pays nobody, so deny
      // mode with no conditions is both the truth and the strongest claim
      // available — and it is the same claim the board now makes.
      postConditions: [],
      spent,
      cap
    });
    spent = sent.spentAfterUstx;
    console.log(`  txid ${sent.txid}`);
    const landed = await settle(sent.txid);
    console.log(`  ${landed}`);
    if (landed !== 'success') {
      process.exitCode = 1;
      return;
    }
  }

  console.log(`\nDone. Spent ${ustx(spent)} of a ${ustx(cap)} cap.`);
  console.log(`Read it back: https://xtrata.xyz/i/2988?game=${game}`);
  console.log('Two independent signers, one checkmate, derived rather than recorded.\n');
}

if (Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    console.error(
      `\n${error instanceof WizardSafetyError ? error.message : scrub(error?.stack ?? error)}`
    );
    process.exitCode = 1;
  });
}

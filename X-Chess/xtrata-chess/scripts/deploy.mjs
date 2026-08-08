#!/usr/bin/env node
// Deploy xtrata-chess-log-v1 to mainnet.
//
// Dry run by default. Nothing is broadcast without --broadcast, and the
// preflight runs either way, so the safe thing is also the thing you get if you
// forget a flag.
//
//   node scripts/deploy.mjs                              # preflight + dry run
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/deploy.mjs
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/deploy.mjs --broadcast
//
// Key material comes from the environment and is never written anywhere. Either
//   XTRATA_MAINNET_MNEMONIC        seed phrase, derived at account index 3
//   XTRATA_MAINNET_DEPLOYER_KEY    raw private key hex
//
// Optional
//   XTRATA_MAINNET_ACCOUNT_INDEX   HD account index (default 3, the SP3J…743X wallet)
//   XTRATA_MAINNET_FEE_USTX        fee in microSTX (default 500000 = 0.5 STX)
//   XTRATA_NETWORK                 mainnet (default) or testnet
//   HIRO_API_KEY                   avoids public rate limits
//
// The contract is immutable once this lands, and it is meant to be the oldest
// ancestor of everything that follows. The preflight is correspondingly fussy.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import {
  ClarityVersion,
  broadcastTransaction,
  makeContractDeploy,
  privateKeyToAddress
} from '@stacks/transactions';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTRACT_NAME = 'xtrata-chess-log-v1';
const SOURCE_PATH = resolve(ROOT, 'contracts', `${CONTRACT_NAME}.clar`);

// Clarity 3, matching Clarinet.toml. Pinned rather than left to the wallet,
// because the deployed version has to be the one the tests ran against.
const CLARITY_VERSION = ClarityVersion.Clarity3;

const NETWORK = process.env.XTRATA_NETWORK === 'testnet' ? 'testnet' : 'mainnet';
const API = NETWORK === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so';
const ACCOUNT_INDEX = Number(process.env.XTRATA_MAINNET_ACCOUNT_INDEX ?? 3);
const FEE = BigInt(process.env.XTRATA_MAINNET_FEE_USTX ?? 500_000);

const broadcast = process.argv.includes('--broadcast');
const skipConfirm = process.argv.includes('--yes');

const headers = process.env.HIRO_API_KEY ? { 'x-api-key': process.env.HIRO_API_KEY } : {};

function fail(message) {
  console.error(`\n  FAILED  ${message}\n`);
  process.exit(1);
}

function ok(label, detail = '') {
  console.log(`  ok      ${label}${detail ? `  ${detail}` : ''}`);
}

async function api(path) {
  const response = await fetch(`${API}${path}`, { headers });
  return { status: response.status, body: response.ok ? await response.json() : null };
}

async function derivePrivateKey() {
  const raw = process.env.XTRATA_MAINNET_DEPLOYER_KEY;
  if (raw) return raw.trim();

  const mnemonic = process.env.XTRATA_MAINNET_MNEMONIC;
  if (!mnemonic) return null;

  const seed = await mnemonicToSeed(mnemonic.trim());
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(`m/44'/5757'/${ACCOUNT_INDEX}'/0/0`);
  if (!child.privateKey) fail('could not derive a private key from that mnemonic');
  // The 01 suffix marks the key as compressed, which Stacks expects.
  return `${Buffer.from(child.privateKey).toString('hex')}01`;
}

async function main() {
  console.log(`\nxtrata-chess deploy  ·  ${NETWORK}  ·  ${broadcast ? 'BROADCAST' : 'dry run'}\n`);

  // ---- the source ---------------------------------------------------
  const source = await readFile(SOURCE_PATH, 'utf8');
  const bytes = Buffer.byteLength(source, 'utf8');

  if (!source.includes('(define-public (open-game (rules-hash (optional (buff 32))))')) {
    fail('open-game does not take a rules commitment, so this is not the contract that was tested');
  }
  if (!/\(define-constant MAX-SEQ u65536\)/.test(source)) {
    fail('MAX-SEQ is not 65536');
  }
  for (const forbidden of [/\.mock-/, /ST[0-9A-HJKMNP-TV-Z]{25,}/]) {
    if (forbidden.test(source.replace(/^\s*;;.*$/gm, ''))) {
      fail(`contract source contains a testnet or mock principal (${forbidden})`);
    }
  }
  ok('source', `${CONTRACT_NAME}.clar, ${bytes.toLocaleString()} bytes, Clarity 3`);

  // ---- the key ------------------------------------------------------
  const privateKey = await derivePrivateKey();
  if (!privateKey) {
    console.log('\n  No key supplied, so this is a source-only preflight.');
    console.log('  Set XTRATA_MAINNET_MNEMONIC or XTRATA_MAINNET_DEPLOYER_KEY to go further.\n');
    return;
  }

  const deployer = privateKeyToAddress(privateKey, NETWORK);
  ok('deployer', `${deployer} (account index ${ACCOUNT_INDEX})`);

  const expected = process.env.XTRATA_DEPLOYER;
  if (expected && expected !== deployer) {
    fail(`derived ${deployer} but XTRATA_DEPLOYER expects ${expected}`);
  }

  // ---- the name -----------------------------------------------------
  const existing = await api(`/v2/contracts/interface/${deployer}/${CONTRACT_NAME}`);
  if (existing.status === 200) {
    fail(`${deployer}.${CONTRACT_NAME} already exists — contract names cannot be reused`);
  }
  ok('name', `${deployer}.${CONTRACT_NAME} is free`);

  // ---- the balance --------------------------------------------------
  const account = await api(`/extended/v1/address/${deployer}/balances`);
  if (!account.body) fail('could not read the deployer balance');
  const balance = BigInt(account.body.stx.balance) - BigInt(account.body.stx.locked);
  if (balance < FEE) {
    fail(`balance ${balance} µSTX is below the fee ${FEE} µSTX`);
  }
  ok('balance', `${(Number(balance) / 1e6).toFixed(6)} STX available, fee ${(Number(FEE) / 1e6).toFixed(6)} STX`);

  // ---- build --------------------------------------------------------
  const transaction = await makeContractDeploy({
    contractName: CONTRACT_NAME,
    codeBody: source,
    senderKey: privateKey,
    network: NETWORK,
    clarityVersion: CLARITY_VERSION,
    fee: FEE
  });
  ok('built', `txid ${transaction.txid()}`);

  if (!broadcast) {
    console.log('\n  Dry run complete. Nothing was sent.');
    console.log('  Re-run with --broadcast to deploy.\n');
    return;
  }

  // ---- confirm ------------------------------------------------------
  if (!skipConfirm) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(
      `\n  About to deploy ${CONTRACT_NAME} to ${NETWORK} as ${deployer}.\n` +
        `  This is irreversible and the contract can never be changed.\n` +
        `  Type the contract name to confirm: `
    );
    rl.close();
    if (answer.trim() !== CONTRACT_NAME) {
      console.log('\n  Not confirmed. Nothing was sent.\n');
      process.exit(1);
    }
  }

  const result = await broadcastTransaction({ transaction, network: NETWORK });
  if (result.error) {
    fail(`broadcast rejected: ${result.error} ${result.reason ?? ''}`);
  }

  console.log(`\n  Broadcast. txid ${result.txid}`);
  console.log(`  https://explorer.hiro.so/txid/${result.txid}?chain=${NETWORK}\n`);
  console.log('  Next: wait for confirmation, then put the deployer address into the');
  console.log('  board\'s Live panel and open game #1.\n');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

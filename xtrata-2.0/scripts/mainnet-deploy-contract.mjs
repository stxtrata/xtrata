#!/usr/bin/env node
// Generalised mainnet deploy helper (successor to mainnet-v3.2.3-deploy.mjs).
//
// Deploys a registered contract from contracts/live/ with ClarityVersion
// pinned to Clarity 3 (wallet popup flows publish at the network's latest
// Clarity version, where `as-contract` no longer resolves — see the v3.2.3
// script header for the history).
//
// Every deploy runs a PREFLIGHT over the live source first:
//   - no `.mock-` principals (local clarinet stand-ins)
//   - no bare local principals (leading-dot) outside comments
//   - the mainnet nft-trait line is active, the local one is commented
//   - ALLOWED-NFT-CONTRACT (when present) points at the expected deployer
//
// Usage:
//   node scripts/mainnet-deploy-contract.mjs --list
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/mainnet-deploy-contract.mjs <contract-key>              # dry run
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/mainnet-deploy-contract.mjs <contract-key> --broadcast
//   XTRATA_MAINNET_DEPLOYER_KEY="<hex>" node scripts/mainnet-deploy-contract.mjs <contract-key> --broadcast
//
// Optional env (same as the v3.2.3 script):
//   XTRATA_MAINNET_FEE_USTX   fee in microSTX (default 750000 = 0.75 STX)
//   XTRATA_DEPLOYER           expected deployer address (default production deployer)
//   XTRATA_MAINNET_ACCOUNT_INDEX  HD account index (default 3 — the SP3J…743X wallet)
//   HIRO_API_KEY              avoid public rate limits
//
// After deploying a sponsored market, remember the go-live steps printed at
// the end (set-sponsor, market-registry.json entry, relayer allowlist).

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { StacksMainnet, createApiKeyMiddleware, createFetchFn } from '@stacks/network';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import {
  AnchorMode,
  ClarityVersion,
  PostConditionMode,
  TransactionVersion,
  broadcastTransaction,
  getAddressFromPrivateKey,
  makeContractDeploy
} from '@stacks/transactions';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const EXPECTED_DEPLOYER =
  process.env.XTRATA_DEPLOYER ?? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const FEE_USTX = BigInt(process.env.XTRATA_MAINNET_FEE_USTX ?? '750000');

// ---------------------------------------------------------------------------
// Deployable contract registry. Key = on-chain contract name.
// Add new mainnet contracts HERE (live variant in contracts/live/ first).
// ---------------------------------------------------------------------------
const DEPLOYABLE = {
  'xtrata-v3-2-3': {
    source: 'contracts/live/xtrata-v3.2.3.clar',
    notes: 'Core inscription contract (see mainnet-v3.2.3-handover.mjs for post-deploy).'
  },
  'xtrata-market-sponsored-stx-v1-1': {
    source: 'contracts/live/xtrata-market-sponsored-stx-v1.1.clar',
    sponsoredMarket: true,
    clarityVersion: 4,
    notes: 'STX marketplace with seller-funded fee sponsorship (buyers need only the price).'
  },
  'xtrata-market-sponsored-sbtc-v1-1': {
    source: 'contracts/live/xtrata-market-sponsored-sbtc-v1.1.clar',
    sponsoredMarket: true,
    clarityVersion: 4,
    paymentToken: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
    notes: 'sBTC marketplace with seller-funded fee sponsorship (STX-free buys).'
  },
  'xtrata-market-sponsored-usdcx-v1-1': {
    source: 'contracts/live/xtrata-market-sponsored-usdcx-v1.1.clar',
    sponsoredMarket: true,
    clarityVersion: 4,
    paymentToken: 'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx',
    notes: 'USDCx marketplace with seller-funded fee sponsorship (STX-free buys).'
  }
};

// ---------------------------------------------------------------------------

const stripComments = (code) =>
  code
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');

const preflight = (name, entry, codeBody) => {
  const problems = [];
  const active = stripComments(codeBody);

  if (active.includes('.mock-')) {
    problems.push('active code references a .mock- principal (clarinet stand-in)');
  }
  // bare local principals: a token starting with a dot that is not part of a
  // fully qualified 'SP…/SM… principal
  const localPrincipal = active.match(/[( ]\.[a-z0-9][a-z0-9-]*/);
  if (localPrincipal) {
    problems.push(`active code references a local principal "${localPrincipal[0].trim()}"`);
  }
  if (!active.includes("'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait")) {
    if (codeBody.includes('use-trait')) {
      problems.push('mainnet nft-trait line is not active');
    }
  }
  const allowed = active.match(/ALLOWED-NFT-CONTRACT '(\S+?)\.xtrata/);
  if (allowed && allowed[1] !== EXPECTED_DEPLOYER) {
    problems.push(
      `ALLOWED-NFT-CONTRACT deployer ${allowed[1]} != expected ${EXPECTED_DEPLOYER}`
    );
  }
  if (entry.paymentToken && !active.includes(`'${entry.paymentToken}`)) {
    problems.push(`expected payment token '${entry.paymentToken}' not found in active code`);
  }
  if (problems.length) {
    throw new Error(`Preflight failed for ${name}:\n  - ${problems.join('\n  - ')}`);
  }
};

const buildNetwork = () => {
  const apiKey = process.env.HIRO_API_KEY?.trim();
  if (!apiKey) return new StacksMainnet();
  const fetchFn = createFetchFn(createApiKeyMiddleware({ apiKey }));
  return new StacksMainnet({ fetchFn });
};

const resolveDeployerKey = async () => {
  const explicit = process.env.XTRATA_MAINNET_DEPLOYER_KEY?.trim();
  if (explicit) return explicit;
  const rawMnemonic = process.env.XTRATA_MAINNET_MNEMONIC;
  if (!rawMnemonic || !rawMnemonic.trim()) {
    throw new Error(
      'Set XTRATA_MAINNET_DEPLOYER_KEY (hex private key) or XTRATA_MAINNET_MNEMONIC to sign the deploy.'
    );
  }
  const mnemonic = rawMnemonic.normalize('NFKD').trim().replace(/\s+/g, ' ').toLowerCase();
  const wordCount = mnemonic.split(' ').filter(Boolean).length;
  if (wordCount !== 12 && wordCount !== 24) {
    throw new Error(
      `Mnemonic has ${wordCount} words after cleanup; expected 12 or 24.`
    );
  }
  // The xtrata deployer (SP3J…743X) is account-hardened m/44'/5757'/3'/0/0
  // (Xverse style) — confirmed via scripts/find-derivation.mjs.
  const accountIndex = Number(process.env.XTRATA_MAINNET_ACCOUNT_INDEX ?? '3');
  const seed = await mnemonicToSeed(mnemonic);
  const root = HDKey.fromMasterSeed(seed);
  const node = root.derive(`m/44'/5757'/${accountIndex}'/0/0`);
  if (!node.privateKey) {
    throw new Error('Failed to derive a private key for the deployer path.');
  }
  return Buffer.from(node.privateKey).toString('hex') + '01';
};

const printSponsoredGoLive = (name) => {
  console.log('\nSponsored-market go-live checklist (after the deploy confirms):');
  console.log(`  1. set-sponsor: call ${EXPECTED_DEPLOYER}.${name} set-sponsor with the relayer hot-wallet principal`);
  console.log('     (until then the sponsor defaults to the deployer).');
  console.log('  2. Relayer: add the contract id to SPONSOR_MARKETS and restart the agent-one server with SPONSOR_KEY set.');
  console.log('  3. Frontend: add the entry to src/data/market-registry.json with');
  console.log(`     "sponsored": true, "sponsorApi": "<relayer base url>" — the sponsored UI activates from the registry alone.`);
  console.log('  4. Optional: set-fee-bps / set-claim-cap if defaults (0 bps, 2 STX) are not wanted.');
  console.log('  5. Smoke: list with a small deposit, sponsored buy from an STX-empty wallet, verify claim-fee + settle-refund on the explorer.');
};

const main = async () => {
  const args = process.argv.slice(2).filter((a) => a !== '--broadcast');
  const broadcast = process.argv.includes('--broadcast');

  if (args.includes('--list') || args.length === 0) {
    console.log('Deployable contracts:\n');
    for (const [key, entry] of Object.entries(DEPLOYABLE)) {
      console.log(`  ${key}`);
      console.log(`      source: ${entry.source}`);
      console.log(`      ${entry.notes}\n`);
    }
    console.log('Usage: node scripts/mainnet-deploy-contract.mjs <contract-key> [--broadcast]');
    return;
  }

  const name = args[0];
  const entry = DEPLOYABLE[name];
  if (!entry) {
    throw new Error(`Unknown contract key "${name}". Run with --list to see options.`);
  }

  const sourcePath = path.join(repoRoot, entry.source);
  const codeBody = await readFile(sourcePath, 'utf8');
  preflight(name, entry, codeBody);
  console.log('Preflight     : OK (no local principals, mainnet trait active, tokens verified)');

  const network = buildNetwork();
  const senderKey = await resolveDeployerKey();
  const deployerAddress = getAddressFromPrivateKey(senderKey, TransactionVersion.Mainnet);
  if (deployerAddress !== EXPECTED_DEPLOYER) {
    throw new Error(
      `Derived deployer ${deployerAddress} does not match expected ${EXPECTED_DEPLOYER}.`
    );
  }

  console.log('Contract name :', name);
  console.log('Source        :', sourcePath, `(${codeBody.length} bytes)`);
  console.log('Deployer      :', deployerAddress);
  console.log('ClarityVersion:', entry.clarityVersion === 4 ? 'Clarity4 (pinned)' : 'Clarity3 (pinned)');
  console.log('Fee (uSTX)    :', FEE_USTX.toString());
  console.log('Mode          :', broadcast ? 'BROADCAST' : 'dry run (pass --broadcast to send)');

  const tx = await makeContractDeploy({
    contractName: name,
    codeBody,
    senderKey,
    network,
    clarityVersion: entry.clarityVersion === 4 ? ClarityVersion.Clarity4 : ClarityVersion.Clarity3,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    fee: FEE_USTX
  });

  console.log('Built txid    :', tx.txid());

  if (!broadcast) {
    console.log('\nDry run complete. Re-run with --broadcast to publish.');
    if (entry.sponsoredMarket) printSponsoredGoLive(name);
    return;
  }

  const result = await broadcastTransaction(tx, network);
  if (result.error) {
    throw new Error(
      `Broadcast failed: ${result.error} ${result.reason ?? ''} ${JSON.stringify(result.reason_data ?? {})}`
    );
  }
  const txid = result.txid || result;
  console.log('\nBroadcast OK. txid:', txid);
  console.log(`Explorer: https://explorer.hiro.so/txid/0x${String(txid).replace(/^0x/, '')}?chain=mainnet`);
  if (entry.sponsoredMarket) printSponsoredGoLive(name);
};

main().catch((error) => {
  console.error('\nDeploy error:', error.message);
  process.exit(1);
});

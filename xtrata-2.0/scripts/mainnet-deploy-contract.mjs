#!/usr/bin/env node
// Generalised deploy helper (successor to mainnet-v3.2.3-deploy.mjs).
//
// Deploys a registered contract with its registry-pinned Clarity version.
// Older contracts remain on Clarity 3; newer sponsored-market and Drops
// contracts publish as Clarity 4.
//
// DEFAULTS TO MAINNET. The filename is historical: pass `--network testnet`
// for the testnet rehearsal described in forever-twins/TESTNET-SETUP.md and in
// phase T of contracts/drafts/v3.2.4/steps.json. Mainnet behaviour with no
// flags is unchanged.
//
// Every deploy runs a PREFLIGHT over the source first:
//   - no `.mock-` principals (local clarinet stand-ins)
//   - no bare local principals (leading-dot) outside comments
//   - the correct nft-trait line for the target network is active
//   - ALLOWED-NFT-CONTRACT (when present) points at the expected deployer
//
// Usage:
//   node scripts/mainnet-deploy-contract.mjs --list
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/mainnet-deploy-contract.mjs <contract-key>              # dry run
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/mainnet-deploy-contract.mjs <contract-key> --broadcast
//   XTRATA_MAINNET_DEPLOYER_KEY="<hex>" node scripts/mainnet-deploy-contract.mjs <contract-key> --broadcast
//
//   # testnet rehearsal, in order
//   node scripts/mainnet-deploy-contract.mjs sip009-nft-trait --network testnet --broadcast
//   node scripts/mainnet-deploy-contract.mjs mock-ipfs-collection --network testnet \
//     --trait-deployer ST... --broadcast
//   node scripts/mainnet-deploy-contract.mjs xtrata-v3-2-4 --network testnet --broadcast
//
//   # deploy a source under a different on-chain name
//   node scripts/mainnet-deploy-contract.mjs mock-ipfs-collection --as xtrata-twin-testbed-v1
//
// Optional env:
//   XTRATA_MAINNET_FEE_USTX   fee in microSTX (default 750000 = 0.75 STX)
//   XTRATA_TESTNET_FEE_USTX   testnet fee (default 750000)
//   XTRATA_DEPLOYER           expected mainnet deployer (default production deployer)
//   XTRATA_TESTNET_DEPLOYER   expected testnet deployer; unset means "derive and report"
//   XTRATA_MAINNET_ACCOUNT_INDEX  HD account index (default 3 — the SP3J…743X wallet)
//   XTRATA_TRAIT_DEPLOYER     address holding sip009-nft-trait, for --trait-deployer
//   HIRO_API_KEY              avoid public rate limits
//
// After deploying a sponsored market, remember the go-live steps printed at
// the end (set-sponsor, market-registry.json entry, relayer allowlist).

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  StacksMainnet,
  StacksTestnet,
  createApiKeyMiddleware,
  createFetchFn
} from '@stacks/network';
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

const MAINNET_TRAIT = "'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait";

// Network is resolved from argv in main() and passed through explicitly. These
// helpers keep the mainnet defaults byte-identical to the pre-testnet script.
const expectedDeployerFor = (net) =>
  net === 'testnet'
    ? process.env.XTRATA_TESTNET_DEPLOYER?.trim() || null // null = derive and report
    : process.env.XTRATA_DEPLOYER ?? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const feeFor = (net) =>
  BigInt(
    net === 'testnet'
      ? process.env.XTRATA_TESTNET_FEE_USTX ?? '750000'
      : process.env.XTRATA_MAINNET_FEE_USTX ?? '750000'
  );

// Kept for the ALLOWED-NFT-CONTRACT preflight, which is a mainnet-only concern.
const EXPECTED_DEPLOYER =
  process.env.XTRATA_DEPLOYER ?? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

// ---------------------------------------------------------------------------
// Deployable contract registry. Key = on-chain contract name.
// Add new mainnet contracts HERE (live variant in contracts/live/ first).
// ---------------------------------------------------------------------------
const DEPLOYABLE = {
  'xtrata-v3-2-3-gateway': {
    source: 'contracts/live/xtrata-v3-2-3-gateway.clar',
    clarityVersion: 4,
    notes: 'Proof of Free Living Synth read-only gateway for Xtrata v3.2.3.'
  },
  'proof-of-free-living-synth-v1': {
    source: 'contracts/live/proof-of-free-living-synth-v1.clar',
    clarityVersion: 4,
    notes: 'Proof of Free ownership-gated recording child registry and mosaic state.'
  },
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
  },
  'xtrata-drops-v1-0': {
    source: 'contracts/live/xtrata-drops-v1.0.clar',
    sponsoredMarket: true,
    clarityVersion: 4,
    notes: 'Sponsored free-claim drops: creators escrow NFT + fee budget, claimers need zero STX.'
  },
  'xtrata-drops-v1-1': {
    source: 'contracts/live/xtrata-drops-v1.1.clar',
    sponsoredMarket: true,
    dropsV11: true,
    clarityVersion: 4,
    notes: 'Campaign-aware sponsored drops with immutable wallet and BNS claim policy.'
  },

  // --- Forever Twins rehearsal set (see forever-twins/TESTNET-SETUP.md) ------
  // These three stand up a complete twin lifecycle environment. The trait must
  // be deployed FIRST, because the other two reference it.
  'sip009-nft-trait': {
    source: 'contracts/clarinet/contracts/sip009-nft-trait.clar',
    clarityVersion: 3,
    noTraitCheck: true,
    notes:
      'SIP-009 trait definition. Deploy this first on testnet: the [TESTNET] trait address baked into the core (ST1NXBK…023PT) does not exist on the current testnet, it 404s.'
  },
  'mock-ipfs-collection': {
    source: 'contracts/clarinet/contracts/mock-ipfs-collection.clar',
    clarityVersion: 3,
    localTraitRefs: ['.sip009-nft-trait'],
    notes:
      'Test SIP-009 source collection with IPFS token URIs and open mint (id, recipient, token-uri). The thing a twin helper points at. Needs --trait-deployer. Deploy to mainnet under --as xtrata-twin-testbed-v1 for the permanent milestone artefact.'
  },
  'xtrata-v3-2-4': {
    source: 'contracts/drafts/v3.2.4/xtrata-v3.2.4-candidate.clar',
    clarityVersion: 3,
    notes:
      'v3.2.4 core candidate. Clarity 3 is deliberate: under Clarity 4 the as-contract call in the migration path does not resolve, which is why this must not be deployed from a wallet UI. Toggle the [TESTNET]/[MAINNET] trait pair in the source to match the target network.'
  }
};

// ---------------------------------------------------------------------------

const stripComments = (code) =>
  code
    .split('\n')
    .map((line) => line.replace(/;;.*$/, ''))
    .join('\n');

// Rewrites local clarinet trait references (`.sip009-nft-trait`) into fully
// qualified principals so a contract written for simnet can deploy to a real
// network. Returns the code unchanged when the entry declares no local refs.
const substituteTraitRefs = (entry, codeBody, traitDeployer) => {
  if (!entry.localTraitRefs?.length) return codeBody;
  if (!traitDeployer) {
    throw new Error(
      `${entry.source} references ${entry.localTraitRefs.join(', ')} locally.\n` +
        '  Pass --trait-deployer <ADDRESS> (or set XTRATA_TRAIT_DEPLOYER) with the address\n' +
        '  that holds the deployed trait. Deploy the `sip009-nft-trait` key there first.'
    );
  }
  let out = codeBody;
  for (const ref of entry.localTraitRefs) {
    // ".sip009-nft-trait" -> "'ST….sip009-nft-trait", leaving the .nft-trait
    // member suffix intact.
    out = out.split(ref).join(`'${traitDeployer}${ref}`);
  }
  return out;
};

const preflight = (name, entry, codeBody, network, predeployNotice = []) => {
  const problems = [];
  const active = stripComments(codeBody);
  const isTestnet = network === 'testnet';

  // A mock contract is a legitimate deploy target for the twin rehearsal, so
  // only reject *references* to other mocks, never the entry's own source.
  if (active.includes('.mock-')) {
    problems.push('active code references a .mock- principal (clarinet stand-in)');
  }
  // Bare local principals: a token starting with a dot, meaning "a contract at
  // this same deployer". For the core these are DELIBERATE — the migrate-from-*
  // functions reference predecessor cores that the deployer genuinely holds.
  // Clarity type-checks them at deploy time, so they are a deploy-ORDER
  // dependency rather than a defect. Everything else is a clarinet leak.
  const localRefs = [...new Set((active.match(/[( ]\.[a-z0-9][a-z0-9-]*/g) ?? []).map((m) => m.trim()))];
  const sameDeployerDeps = localRefs.filter((r) => /^\.xtrata-/.test(r));
  const unexpected = localRefs.filter((r) => !/^\.xtrata-/.test(r));
  if (unexpected.length) {
    problems.push(
      `active code references local principal(s) ${unexpected.join(', ')} ` +
        '(add to localTraitRefs and pass --trait-deployer, or fix the source)'
    );
  }
  if (sameDeployerDeps.length) {
    // Not a failure. Surfaced because the deploy aborts at analysis time if any
    // of these is missing at the deploying address.
    predeployNotice.push(...sameDeployerDeps);
  }

  if (!entry.noTraitCheck && codeBody.includes('use-trait')) {
    if (isTestnet) {
      if (active.includes(MAINNET_TRAIT)) {
        problems.push(
          'the [MAINNET] nft-trait line is still active but the target is testnet. ' +
            'Comment it out and activate a testnet trait principal.'
        );
      }
      if (!/'ST[0-9A-Z]{20,}\.[a-z0-9-]*nft-trait/.test(active)) {
        problems.push(
          'no testnet (ST…) nft-trait principal is active. Deploy the `sip009-nft-trait` ' +
            'key first, then point the [TESTNET] lines at that address. Note the address ' +
            'currently in the source (ST1NXBK…023PT) does not exist on testnet.'
        );
      }
    } else if (!active.includes(MAINNET_TRAIT)) {
      problems.push('mainnet nft-trait line is not active');
    }
  }

  // ALLOWED-NFT-CONTRACT pins a mainnet deployer, so only enforce on mainnet.
  if (!isTestnet) {
    const allowed = active.match(/ALLOWED-NFT-CONTRACT '(\S+?)\.xtrata/);
    if (allowed && allowed[1] !== EXPECTED_DEPLOYER) {
      problems.push(
        `ALLOWED-NFT-CONTRACT deployer ${allowed[1]} != expected ${EXPECTED_DEPLOYER}`
      );
    }
  }
  if (entry.paymentToken && !active.includes(`'${entry.paymentToken}`)) {
    problems.push(`expected payment token '${entry.paymentToken}' not found in active code`);
  }
  if (problems.length) {
    throw new Error(`Preflight failed for ${name} (${network}):\n  - ${problems.join('\n  - ')}`);
  }
};

const buildNetwork = (net) => {
  const Ctor = net === 'testnet' ? StacksTestnet : StacksMainnet;
  const apiKey = process.env.HIRO_API_KEY?.trim();
  if (!apiKey) return new Ctor();
  const fetchFn = createFetchFn(createApiKeyMiddleware({ apiKey }));
  return new Ctor({ fetchFn });
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

const printDropsV11GoLive = (name) => {
  console.log('\nDrops v1.1 go-live checklist (after the deploy confirms):');
  console.log(`  1. Call ${EXPECTED_DEPLOYER}.${name} set-sponsor with the relayer hot-wallet principal.`);
  console.log('  2. Call set-bns-attestor-pubkey-hash with (some 0x<20-byte compressed-public-key hash160>).');
  console.log('  3. Add the contract id to the sponsor-service and frontend allowlists.');
  console.log('  4. Complete the testnet rehearsal in docs/drops-v1.1.md before public mainnet use.');
  console.log('  5. Authorise the Wizard operator only after configuration is confirmed on-chain.');
};

// Pulls "--flag value" out of argv and returns the value, or null.
const takeOption = (argv, flag) => {
  const i = argv.indexOf(flag);
  if (i === -1) return null;
  const value = argv[i + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} needs a value.`);
  }
  argv.splice(i, 2);
  return value;
};

const main = async () => {
  const argv = process.argv.slice(2);
  const broadcast = argv.includes('--broadcast');

  const networkArg = takeOption(argv, '--network');
  const asName = takeOption(argv, '--as');
  const traitDeployer =
    takeOption(argv, '--trait-deployer') ?? process.env.XTRATA_TRAIT_DEPLOYER?.trim() ?? null;

  const net = (networkArg ?? 'mainnet').toLowerCase();
  if (net !== 'mainnet' && net !== 'testnet') {
    throw new Error(`--network must be "mainnet" or "testnet", got "${net}".`);
  }

  const args = argv.filter((a) => a !== '--broadcast');

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

  const key = args[0];
  const entry = DEPLOYABLE[key];
  if (!entry) {
    throw new Error(`Unknown contract key "${key}". Run with --list to see options.`);
  }
  const name = asName ?? key;

  const sourcePath = path.join(repoRoot, entry.source);
  const rawBody = await readFile(sourcePath, 'utf8');
  const codeBody = substituteTraitRefs(entry, rawBody, traitDeployer);
  const predeployNotice = [];
  preflight(key, entry, codeBody, net, predeployNotice);
  console.log(
    'Preflight     : OK (',
    net === 'testnet' ? 'testnet' : 'mainnet',
    'trait active, no clarinet leaks, tokens verified)'
  );
  if (predeployNotice.length) {
    console.log('Requires first:', predeployNotice.join(', '));
    console.log(
      '                These are same-deployer references type-checked at deploy time.',
      '\n                The deploy ABORTS at analysis if any is missing at this address.'
    );
  }

  const feeUstx = feeFor(net);
  const expectedDeployer = expectedDeployerFor(net);
  const network = buildNetwork(net);
  const senderKey = await resolveDeployerKey();
  const txVersion = net === 'testnet' ? TransactionVersion.Testnet : TransactionVersion.Mainnet;
  const deployerAddress = getAddressFromPrivateKey(senderKey, txVersion);
  if (expectedDeployer && deployerAddress !== expectedDeployer) {
    throw new Error(
      `Derived deployer ${deployerAddress} does not match expected ${expectedDeployer}.`
    );
  }

  console.log('Network       :', net);
  console.log('Contract name :', name, asName ? `(source key: ${key})` : '');
  console.log('Source        :', sourcePath, `(${codeBody.length} bytes)`);
  console.log(
    'Deployer      :',
    deployerAddress,
    expectedDeployer ? '' : '(derived, no expected address set)'
  );
  if (codeBody !== rawBody) {
    console.log('Trait rewrite :', entry.localTraitRefs.join(', '), '->', traitDeployer);
  }
  console.log('ClarityVersion:', entry.clarityVersion === 4 ? 'Clarity4 (pinned)' : 'Clarity3 (pinned)');
  console.log('Fee (uSTX)    :', feeUstx.toString());
  console.log('Mode          :', broadcast ? 'BROADCAST' : 'dry run (pass --broadcast to send)');

  const tx = await makeContractDeploy({
    contractName: name,
    codeBody,
    senderKey,
    network,
    clarityVersion: entry.clarityVersion === 4 ? ClarityVersion.Clarity4 : ClarityVersion.Clarity3,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    fee: feeUstx
  });

  console.log('Built txid    :', tx.txid());

  if (!broadcast) {
    console.log('\nDry run complete. Re-run with --broadcast to publish.');
    if (entry.dropsV11) printDropsV11GoLive(name);
    else if (entry.sponsoredMarket) printSponsoredGoLive(name);
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
  console.log(
    `Explorer: https://explorer.hiro.so/txid/0x${String(txid).replace(/^0x/, '')}?chain=${net}`
  );
  console.log(`Contract: ${deployerAddress}.${name}`);
  if (entry.dropsV11) printDropsV11GoLive(name);
  else if (entry.sponsoredMarket) printSponsoredGoLive(name);
};

main().catch((error) => {
  console.error('\nDeploy error:', error.message);
  process.exit(1);
});

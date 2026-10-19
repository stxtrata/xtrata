#!/usr/bin/env node
// Deploy the three test-network contracts, in order, from one address. DRY RUN unless every guard passes. TESTNET ONLY: mainnet contracts
// come from contracts/live and are a separate, explicit decision (this command refuses mainnet).
//   node ops/deploy.mjs --network testnet --sender ST...                      dry run: order, sizes, hashes
//   XA_OPS_CONFIRM=broadcast-testnet node ops/deploy.mjs --network testnet --execute --key-file ~/disposable.key
import { parseArgs, die } from './lib/cli.mjs';
import { deploySources, deployAll } from './lib/deploy.mjs';
import { networkTransport, API_BASE } from './lib/transport.mjs';
import { attachSigner } from './lib/signing.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', sender: 'value', keyFile: 'value' });
if (args.network !== 'testnet') die('deploy.mjs handles testnet only (mainnet is a separate decision)');
const t = networkTransport({ network: 'testnet', names: { world: 'x.x', posters: 'x.x' } });
if (args.execute) attachSigner(t, args); else if (args.sender) t.signer = { key: null, address: args.sender };
const sources = deploySources();
console.log('deploy order:'); sources.forEach((s, i) => console.log(`  ${i + 1}. ${s.name}  ${s.bytes} bytes  sha256 ${s.sha256}`));
const r = await deployAll(t, sources, { execute: !!args.execute, log: (m) => console.log(m), base: API_BASE.testnet });
if (r.failed) die('FAILED ' + r.failed);
if (!args.execute) console.log('\nDRY RUN: nothing was sent. See TESTNET-RUNBOOK.md for the confirmations needed.');
else console.log(`\nworld:   ${t.signer.address}.xtrata-world-v1\nposters: ${t.signer.address}.xtrata-posters-v1`);

#!/usr/bin/env node
// Sign a list of contract calls from SEVERAL testnet wizards, offline, and pack them for a browser to relay. TESTNET ONLY.
// Same gate as the other tools (--execute, XA_OPS_CONFIRM=broadcast-testnet, no KILL file, never the admin wallet's key).
// Nothing is sent from here. Used for the screen contract (buying, approving, refunds need STX post-conditions), but works for any
// of the arcade contracts.
//
//   node ops/relay-steps.mjs --execute --steps ops/examples/screen-testnet-setup.steps.json --nonces deployer=40,buyer=0 [--keys ~/.xa-testnet-wizards] [--out file]
//
// The steps file:
//   { "owner": "ST…deployer address", "contracts": { "screen": "xtrata-screen-v1", … },
//     "steps": [ { "as": "buyer", "contract": "screen", "fn": "buy-slot", "args": [ {"uint":2}, {"ascii":"HEAD"}, … ],
//                  "pay": 10000000,               // optional: this wizard sends exactly this many uSTX (post-condition)
//                  "release": 10000000 } ] }     // optional: the contract sends exactly this many uSTX (post-condition)
// Argument forms: {uint}, {int}, {ascii}, {bool}, {principal} (a wizard name or an address), {hex} (a buffer), {none}, {some:<arg>},
// {list:[…]} and {tuple:{key:<arg>}} (see ops/lib/steps.mjs). A step {"as":"deployer","deploy":"xtrata-world-v2"} deploys a contract from contracts/.
// Wizard names come from ops/testnet-wizards.json; keys are read from <keys dir>/<name>.key.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { parseArgs, die } from './lib/cli.mjs';
import { Refused } from './lib/guard.mjs';
import { pack } from './lib/relay.mjs';
import { signSteps, parseNonces } from './lib/steps.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2), { steps: 'value', nonces: 'value', keys: 'value', out: 'value', fee: 'value' });
if (!args.steps || !args.nonces) die('usage: node ops/relay-steps.mjs --execute --steps FILE --nonces name=N,name=N [--keys DIR] [--out FILE]');
const doc = JSON.parse(readFileSync(args.steps, 'utf8'));
const keysDir = args.keys || join(homedir(), '.xa-testnet-wizards');
let signed;
try { signed = await signSteps(doc, { nonces: parseNonces(args.nonces), keysDir, execute: !!args.execute, fee: Number(args.fee || 30000) }); }
catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); die(e.message); }
const { items, nonces: nonce } = signed;
const out = args.out || join(here, 'out', 'relay', 'steps.packed.txt');
mkdirSync(dirname(out), { recursive: true });
const packed = pack(items);
writeFileSync(out, packed);
console.log(`${items.length} transaction(s) signed offline; packed -> ${out}`);
console.log(`pack length ${packed.length}, sha256 ${createHash('sha256').update(packed).digest('hex').slice(0, 12)} (check this after pasting into the browser)`);
items.forEach((i) => console.log('  ' + i.label));
console.log('next nonces: ' + Object.entries(nonce).map(([n, v]) => `${n}=${v}`).join(','));

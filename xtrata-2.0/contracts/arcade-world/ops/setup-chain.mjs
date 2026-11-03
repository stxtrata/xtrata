#!/usr/bin/env node
// One-time set-up after deploying: register the built-in looks, the rooms, and the publishers. Skips what is already there. DRY RUN by default.
//   node ops/setup-chain.mjs --network testnet --world ID --posters ID --sender ADMIN [--publisher ADDR,ADDR] [--no-lobby]
//   ... --execute --key-file path    (the key must belong to --sender, who must be the admin)
import { parseArgs, die } from './lib/cli.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { planSetup, runSetup } from './lib/setup.mjs';
import { readWorldConfig } from './lib/readback.mjs';
import { attachSigner } from './lib/signing.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', sender: 'value', publisher: 'value', keyFile: 'value' });
const t = transportFromArgs(args);
if (!t || !args.sender) die('usage: node ops/setup-chain.mjs --network testnet --world ID --posters ID --sender ADMIN [--publisher A,B] [--execute --key-file path]');
if (args.execute) attachSigner(t, args, args.sender);
const cfg = await readWorldConfig(t);
if (cfg.admin !== args.sender) die(`--sender ${args.sender} is not the world contract's admin (${cfg.admin})`);
const plan = await planSetup(t, { owner: args.sender, publishers: args.publisher ? String(args.publisher).split(',') : [], withLobby: !args.noLobby });
console.log(`to do: ${plan.looks.length} look(s), ${plan.rooms.length} room(s), ${plan.publishers.length} publisher grant(s)`);
const r = await runSetup(t, plan, { execute: !!args.execute, from: args.sender, log: (m) => console.log(m) });
if (r.failed) die('FAILED ' + r.failed);
if (!args.execute) console.log('DRY RUN: nothing was sent.');

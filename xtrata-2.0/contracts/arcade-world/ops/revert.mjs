#!/usr/bin/env node
// "Put this bay back to posters now." One scene, starting now. DRY RUN by default.
//   node ops/revert.mjs --network testnet --world ID --posters ID --room arcade-hall --bay 0 --sender ADMIN [--execute --key-file path]
import { parseArgs, die } from './lib/cli.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { revertBay } from './lib/revert.mjs';
import { attachSigner } from './lib/signing.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', room: 'value', bay: 'value', sender: 'value', keyFile: 'value' });
const t = transportFromArgs(args);
if (!t || !args.room || args.bay == null || !args.sender) die('usage: node ops/revert.mjs --network testnet --world ID --posters ID --room arcade-hall --bay 0 --sender ADMIN [--execute --key-file path]');
if (args.execute) attachSigner(t, args, args.sender);
const r = await revertBay(t, { room: args.room, bay: Number(args.bay), execute: !!args.execute, from: args.sender, log: (m) => console.log(m) });
process.exit(r.failed ? 1 : 0);

#!/usr/bin/env node
// Register the hall's built-in door skins on xtrata-door-skins-v1 (skips any already there; reports drift). DRY RUN by default.
//   node ops/skins.mjs --network testnet --world ID --posters ID --skins ID --sender ADMIN
//   ... --execute --key-file path    (the key must belong to --sender, who must be the skins contract's admin)
// Offline (no --network): lists the skins that would be registered.
import { parseArgs, die } from './lib/cli.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { builtinSkins, planSkins, runSkins } from './lib/skins.mjs';
import { attachSigner } from './lib/signing.mjs';
import { stylesOf } from './lib/skinlist.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', skins: 'value', sender: 'value', keyFile: 'value' });
if (!args.network) {
  console.log('offline: the hall has these built-in skins');
  builtinSkins().forEach((s, i) => console.log(`  ${String(i).padStart(2)}  ${s.key.padEnd(14)} ${s.name.padEnd(20)} frame ${s.frame.padEnd(8)} hardware ${s.hardware.padEnd(10)} wear ${String(s.wear).padStart(2)}  styles: ${stylesOf(s.styles).join(',')}`));
  process.exit(0);
}
const t = transportFromArgs(args);
if (!t.names.skins || !args.sender) die('usage: node ops/skins.mjs --network testnet --world ID --posters ID --skins ID --sender ADMIN [--execute --key-file path]');
if (args.execute) attachSigner(t, args, args.sender);
const cfg = await t.ro('skins', 'get-config');
if (cfg.admin !== args.sender) die(`--sender ${args.sender} is not the skins contract's admin (${cfg.admin})`);
const plan = await planSkins(t);
plan.drift.forEach((d) => console.log('note: ' + d));
console.log(`to do: ${plan.todo.length} skin(s) to register`);
const r = await runSkins(t, plan, { execute: !!args.execute, from: args.sender, log: (m) => console.log(m) });
if (r.failed) die('FAILED ' + r.failed);
if (!args.execute) console.log('DRY RUN: nothing was sent.');

#!/usr/bin/env node
// Check a poster file. Offline by default (use --role and --height); with --network it reads the live caps and your live count.
//   node ops/validate-posters.mjs file.poster.json [--role admin|publisher] [--height N] [--sender ADDRESS] [--network testnet --world ID --posters ID]
import { readFileSync } from 'node:fs';
import { parseArgs, die } from './lib/cli.mjs';
import { parsePosterFile, compilePosters, describePosters, todayOf } from './lib/posters.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { botContext } from './lib/bot.mjs';

const args = parseArgs(process.argv.slice(2), { role: 'value', height: 'value', sender: 'value', network: 'value', world: 'value', posters: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/validate-posters.mjs <file.poster.json> [--role admin|publisher] [--height N] [--network testnet --world ID --posters ID --sender ADDRESS]');
const doc = parsePosterFile(readFileSync(file, 'utf8'));
let ctx;
const t = transportFromArgs(args);
if (t) {
  if (!args.sender) die('--sender (the address that will send) is needed with --network');
  const c = await botContext(t, args.sender);
  ctx = { today: c.today, role: c.admin ? 'admin' : 'publisher', config: c.cfg, usedToday: 0, liveOwned: c.liveOwned, liveTotal: (await t.ro('posters', 'get-live')).length };
  if (!c.admin && !c.publisher) console.log(`note: ${args.sender} is neither the admin nor a whitelisted publisher on this contract`);
} else {
  ctx = { today: args.height != null ? todayOf(Number(args.height)) : null, role: args.role || 'publisher', config: null };
}
const { findings, posters } = compilePosters(doc, ctx);
console.log(`${file}: ${posters.length} of ${(doc.posters || []).length} poster(s) valid${t ? '' : ' (offline: caps are not checked)'}`);
findings.print();
if (findings.ok) console.log('\n' + describePosters(posters, ctx.today));
process.exit(findings.ok ? 0 : 1);

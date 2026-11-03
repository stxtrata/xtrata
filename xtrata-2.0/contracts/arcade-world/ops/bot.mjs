#!/usr/bin/env node
// The publisher bot. DRY RUN unless every guard in lib/guard.mjs passes. Meant to be run by a scheduler (hourly or daily); each run sends at most
// --max-batches batches (default 1) and remembers what it sent in a journal file (git-ignored).
//   node ops/bot.mjs file.poster.json --network testnet --world ID --posters ID --sender ADDRESS            dry run
//   ... --execute --key-file path    (needs XA_OPS_CONFIRM=broadcast-testnet; the key must belong to --sender)
// Stop it instantly: create the file ops/KILL (or set XA_OPS_KILL to another path). Any run after that does nothing.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { privateKeyToAddress } from '@stacks/transactions';
import { parseArgs, die } from './lib/cli.mjs';
import { parsePosterFile, compilePosters, todayOf } from './lib/posters.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { botContext, runBot, newJournal } from './lib/bot.mjs';
import { authoriseBroadcast, Refused } from './lib/guard.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', sender: 'value', keyFile: 'value', maxBatches: 'value', journal: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/bot.mjs <file.poster.json> --network testnet --world ID --posters ID --sender ADDRESS [--execute --key-file path]');
const t = transportFromArgs(args);
if (!t) die('the bot reads caps and the live set from a chain: give --network, --world and --posters');
if (!args.sender) die('--sender is needed');
const here = dirname(fileURLToPath(import.meta.url));
const journalPath = args.journal || join(here, `.run-${basename(file).replace(/\.json$/, '')}.json`);
const journal = existsSync(journalPath) ? JSON.parse(readFileSync(journalPath, 'utf8')) : newJournal();

if (args.execute) {
  try {
    const auth = authoriseBroadcast({ network: args.network, execute: true, mainnet: !!args.iMeanMainnet, keyFile: args.keyFile });
    if (auth.sender !== args.sender) throw new Refused(`the key belongs to ${auth.sender}, not --sender ${args.sender}`);
    t.signer = { key: auth.key, address: auth.sender };
  } catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); throw e; }
}
const c = await botContext(t, args.sender);
const { findings, posters } = compilePosters(parsePosterFile(readFileSync(file, 'utf8')), {
  today: c.today, role: c.admin ? 'admin' : 'publisher', config: c.cfg, usedToday: journal.perDay[c.today] || 0, liveOwned: c.liveOwned,
});
findings.print();
if (!findings.ok) die('not running: fix the errors above first');
const r = await runBot(t, { posters, sender: args.sender, execute: !!args.execute, journal, maxBatches: Number(args.maxBatches || 1), log: (m) => console.log(m) });
if (args.execute) writeFileSync(journalPath, JSON.stringify(r.journal, null, 2));
console.log(JSON.stringify({ status: r.status, reason: r.reason, sent: r.sent, batches: r.batches, pending: r.pending, skipped: r.skipped.length }, null, 2));
process.exit(['ok', 'nothing-to-do', 'more-to-do', 'waiting', 'capped'].includes(r.status) ? 0 : 1);

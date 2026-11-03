#!/usr/bin/env node
// Turn a scene file into contract calls. DRY RUN unless every guard in lib/guard.mjs is satisfied.
//   node ops/submit.mjs file.scene.json                         dry run, offline: prints the calls and writes them (as hex) to ops/out/
//   node ops/submit.mjs file.scene.json --network testnet --world ID --posters ID     dry run against a chain's real look ids (read-only)
//   ... --execute  (with XA_OPS_CONFIRM=broadcast-testnet and --key-file)               really send. Testnet only unless told otherwise.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { parseSceneFile, compileScenes, describe } from './lib/scene.mjs';
import { loadContext, transportFromArgs } from './lib/context.mjs';
import { attachSigner } from './lib/signing.mjs';
import { planSceneCalls, submitScenes } from './lib/submit.mjs';

const args = parseArgs(process.argv.slice(2), { height: 'value', looks: 'value', network: 'value', world: 'value', posters: 'value', keyFile: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/submit.mjs <file.scene.json> [--network testnet --world ID --posters ID] [--execute --key-file path]');
const doc = parseSceneFile(readFileSync(file, 'utf8'));
const net = transportFromArgs(args);
if (args.execute) {
  if (!net) die('--execute needs --network (testnet or mainnet) with --world and --posters');
  attachSigner(net, args);          // refuses here, before any read, unless every confirmation is in place
}
const ctx = await loadContext(args, doc, net);
const { findings, scenes } = compileScenes(doc, ctx);
findings.print();
if (!findings.ok) die('not submitting: fix the errors above first');
console.log(describe(scenes, { height: ctx.height }));

const calls = planSceneCalls(scenes);
const here = dirname(fileURLToPath(import.meta.url));
const outFile = join(here, 'out', basename(file).replace(/\.json$/, '') + '.calls.json');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({ note: 'Arguments are Clarity values in hex. Nothing has been sent.', world: args.world || '(not given)', calls: calls.map((c) => ({ contract: 'world', function: c.fn, argumentsHex: c.argsHex })) }, null, 2));
console.log(`\n${calls.length} contract call(s) written to ${outFile}`);

if (!args.execute) { console.log('DRY RUN: nothing was sent. Add --execute (and the confirmations in ops/README.md) to send.'); process.exit(0); }
const r = await submitScenes(ctx.t, scenes, { execute: true, log: (m) => console.log(m) });
console.log(JSON.stringify({ sent: r.sent, skipped: r.skipped, failed: r.failed, verified: r.verify && r.verify.ok }, null, 2));
process.exit(r.failed || (r.verify && !r.verify.ok) ? 1 : 0);

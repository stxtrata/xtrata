#!/usr/bin/env node
// Review lane: list posters waiting for release and (admin only, guarded) release them. DRY RUN by default.
//   node ops/review.mjs --network testnet --world ID --posters ID                       list
//   node ops/review.mjs ... --release 12,13,15                                           dry run of the release
//   node ops/review.mjs ... --release 12,13,15 --execute --sender ADMIN --key-file path  send (guards apply)
import { parseArgs, die } from './lib/cli.mjs';
import { transportFromArgs } from './lib/context.mjs';
import { waitingPosters, releasePosters, readPosterConfig } from './lib/review.mjs';
import { attachSigner } from './lib/signing.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', release: 'value', sender: 'value', keyFile: 'value' });
const t = transportFromArgs(args);
if (args.release && args.execute && t) attachSigner(t, args);
if (!t) die('usage: node ops/review.mjs --network testnet --world ID --posters ID [--release 1,2,3 [--execute --sender ADDRESS --key-file path]]');
const cfg = await readPosterConfig(t);
console.log(`review lane is ${cfg.reviewLane ? 'ON' : 'off'}${cfg.paused ? ' (contract PAUSED)' : ''}`);
const waiting = await waitingPosters(t);
if (!waiting.length) console.log('nothing is waiting');
for (const p of waiting) console.log(`  #${p.id} by ${p.owner}: ${p.head} / ${p.sub} [${p.colour}, art ${p.art}] days ${p.startDay}-${p.endDay}${p.actText ? ', opens ' + p.actText : ''}`);
if (args.release) {
  const ids = String(args.release).split(',').map(Number);
  const bad = ids.filter((i) => !waiting.some((p) => p.id === i));
  if (bad.length) die(`not waiting (or unknown): ${bad.join(', ')}`);
  if (args.execute && t.signer.address !== cfg.admin) die(`REFUSED: the key belongs to ${t.signer.address}; only the admin ${cfg.admin} can release`, 2);
  const r = await releasePosters(t, { ids, execute: !!args.execute, log: (m) => console.log(m) });
  process.exit(r.failed ? 1 : 0);
}

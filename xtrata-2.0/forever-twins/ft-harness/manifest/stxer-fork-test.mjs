#!/usr/bin/env node
// Mainnet-fork rehearsal of the whole NYC Degens flow on stxer (https://stxer.xyz). Nothing is broadcast:
// stxer simulates on a copy of live mainnet state and returns a link to the step-by-step result.
//
//   npm i --no-save stxer            (once, in ft-harness)
//   node manifest/stxer-fork-test.mjs --manifest manifest/out/nyc-degens.manifest.json \
//        --helper-file contracts/rendered/forever-twin-nyc-degens.v3.clar \
//        [--deployer SP...xtrata.btc address] [--gateway http://127.0.0.1:8080] [--tokens 174,1]
//
// Sequence: deploy helper -> seed-canonical x5 -> finalize-canonical -> inscribe as Jim (payee A, pays only
// Rapha's half) -> inscribe as Rapha (payee B, pays only Jim's half) -> swap #174 original -> twin -> original
// -> inscribe an already-bound token (must fail) -> set-fee by non-owner (must fail).
// Then open the stxer link and check: each step's result, and the STX transfer events (0.05 STX per payee,
// payer pays only the other payee's half, core fee paid to the core contract).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl } from '@stacks/transactions';
import { SimulationBuilder } from 'stxer';
import { makePlan } from './seed-plan.mjs';
import { fetchBytes, verifyToken, parseIds } from './sponsor-inscribe.mjs';
import { toHttp } from './lib.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const RAPHA = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const manifestPath = opt('manifest'), helperFile = opt('helper-file');
if (!manifestPath || !helperFile) { console.error('need --manifest and --helper-file'); process.exit(1); }
const deployer = opt('deployer', JIM);
const gateway = opt('gateway', 'http://127.0.0.1:8080');
const ids = parseIds(opt('tokens', '174,1'));
const name = 'forever-twin-nyc-degens';
const helper = `${deployer}.${name}`;

const text = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(text);
const plan = makePlan(text, helper);
const source = readFileSync(helperFile, 'utf8');

// Real file bytes for the tokens we inscribe in the fork, verified against the manifest first.
const files = {};
for (const id of ids) {
  const token = manifest.tokens.find((t) => t.id === id);
  if (!token) throw new Error(`token ${id} not in manifest`);
  const bytes = await fetchBytes(toHttp(token.original.mediaUris[0], gateway));
  files[id] = await verifyToken(token, bytes);
  console.log(`#${id}: ${bytes.length} B verified, ${files[id].length} chunks`);
}
const inscribeArgs = (id) => [Cl.uint(id), Cl.list(files[id].map((c) => Cl.buffer(c)))];

const b = SimulationBuilder.new({ network: 'mainnet' })
  .withSender(deployer)
  .addContractDeploy({ contract_name: name, source_code: source, clarity_version: 4 });
for (const s of plan.steps.filter((s) => s.function === 'seed-canonical')) {
  const entries = manifest.tokens.filter((t) => s.ids.includes(t.id));
  b.addContractCall({ contract_id: helper, function_name: 'seed-canonical', function_args: [Cl.list(entries.map((t) => Cl.tuple({
    id: Cl.uint(t.id), 'content-hash': Cl.bufferFromHex(t.twin.contentHash.replace(/^0x/, '')),
    mime: Cl.stringAscii(t.twin.mime), 'total-size': Cl.uint(t.twin.totalSize), 'token-uri': Cl.stringAscii(t.twin.tokenUri) })))] });
}
b.addContractCall({ contract_id: helper, function_name: 'finalize-canonical',
  function_args: [Cl.bufferFromHex(createHash('sha256').update(text).digest('hex')), Cl.uint(manifest.count)] });

// 1. Jim (payee A) inscribes the first token: expect fee transfer of 0.05 STX to Rapha only.
b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: inscribeArgs(ids[0]) });
// 2. Rapha (payee B) inscribes the second: expect 0.05 STX to Jim only.
if (ids[1]) b.withSender(RAPHA).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: inscribeArgs(ids[1]) });
// 3. Swaps for the token Jim actually owns on mainnet (default #174, which must be among --tokens so it is inscribed).
const swapId = Number(opt('swap-token', 174));
if (!argv.includes('--no-swap')) {
  if (!ids.includes(swapId)) throw new Error(`--swap-token ${swapId} must be one of --tokens`);
  b.withSender(JIM)
    .addContractCall({ contract_id: helper, function_name: 'swap-original-for-twin', function_args: [Cl.uint(swapId)] })
    .addContractCall({ contract_id: helper, function_name: 'swap-twin-for-original', function_args: [Cl.uint(swapId)] });
}
// 4. Must fail: re-inscribing a bound token, and set-fee by a non-owner.
b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: inscribeArgs(ids[0]) });
b.withSender(RAPHA).addContractCall({ contract_id: helper, function_name: 'set-fee', function_args: [Cl.uint(0)] });

const id = await b.run();
console.log(`\nSimulation: https://stxer.xyz/simulations/mainnet/${id}`);
console.log('Expected: deploy ok, 5x seed ok, finalize ok, both inscribes ok (fee 0.05 STX to the OTHER payee), swaps ok (free),');
console.log('          second inscribe of the same token FAILS, set-fee by the non-owner FAILS.');

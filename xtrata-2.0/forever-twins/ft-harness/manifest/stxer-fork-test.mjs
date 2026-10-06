#!/usr/bin/env node
// Mainnet-fork rehearsal of a whole Forever Twins launch (any collection) on stxer (https://stxer.xyz). Nothing is broadcast:
// stxer simulates on a copy of live mainnet state and returns a link to the step-by-step result.
//
//   npm i --no-save stxer            (once, in ft-harness)
//   node manifest/stxer-fork-test.mjs --manifest manifest/out/nyc-degens.manifest.json \
//        --helper-file contracts/rendered/forever-twin-nyc-degens.v3.clar \
//        [--deployer SP...xtrata.btc address] [--gateway http://127.0.0.1:8080] [--tokens 174,1]
//
//   G2 collection (the source has its own listing market), e.g. Megapont:
//   node scripts/render-helper-v3.mjs scripts/configs/mainnet-megapont-ape-club.v3.json contracts/rendered/forever-twin-megapont-ape-club.v3.clar
//   node manifest/stxer-fork-test.mjs --manifest manifest/out/megapont-ape-club.manifest.json \
//        --helper-file contracts/rendered/forever-twin-megapont-ape-club.v3.clar --deployer SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X \
//        --tokens 3,1153,1 --swap-token 3 --swap-owner auto --listed-token 1
//   --swap-owner auto|<address>   who signs the swap (auto = the token's current owner on mainnet; default Jim)
//   --listed-token <id>           a token that is listed on the source market: its owner's swap-in must be REFUSED (u217)
//
// Sequence: deploy helper -> seed-canonical x5 -> finalize-canonical -> inscribe as Jim (payee A, pays only
// Rapha's half) -> inscribe as Rapha (payee B, pays only Jim's half) -> swap #174 original -> twin -> original
// -> inscribe an already-bound token (must fail) -> set-fee by non-owner (must fail).
// Then open the stxer link and check: each step's result, and the STX transfer events (0.05 STX per payee,
// payer pays only the other payee's half, core fee paid to the core contract).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl, cvToHex, cvToJSON, hexToCV } from '@stacks/transactions';
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
const name = `forever-twin-${JSON.parse(readFileSync(manifestPath, 'utf8')).collectionKey}`.slice(0, 40);
const helper = `${deployer}.${name}`;

// The current owner of a source token on mainnet (the fork starts from live state, so that wallet can sign in the simulation).
const HIRO = process.env.HIRO_API || 'https://api.hiro.so';
const findPrincipal = (o) => (typeof o === 'string' ? (/^S[PM][0-9A-Z.\-a-z]+$/.test(o) ? o : null) : o && typeof o === 'object' ? Object.values(o).map(findPrincipal).find(Boolean) ?? null : null);
async function ownerOf(source, tokenId) {
  const [a, n] = source.split('.');
  const r = await fetch(`${HIRO}/v2/contracts/call-read/${a}/${n}/get-owner`, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sender: a, arguments: [cvToHex(Cl.uint(tokenId))] }) });
  const j = await r.json();
  const who = j.okay ? findPrincipal(cvToJSON(hexToCV(j.result))) : null;
  if (!who) throw new Error(`could not read the owner of #${tokenId} from ${source}`);
  return who;
}

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
// 2b. Any further tokens are inscribed by Jim (so large files such as a 480 KB GIF are exercised too).
for (const extra of ids.slice(2)) b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: inscribeArgs(extra) });
// 3. Swaps for the token the swap owner really holds on mainnet (default: Jim and #174, for NYC Degens).
const swapId = Number(opt('swap-token', 174));
if (!argv.includes('--no-swap')) {
  if (!ids.includes(swapId)) throw new Error(`--swap-token ${swapId} must be one of --tokens`);
  const so = opt('swap-owner', JIM);
  const swapper = so === 'auto' ? await ownerOf(manifest.source, swapId) : so;
  console.log(`swap #${swapId} signed by ${swapper}`);
  b.withSender(swapper)
    .addContractCall({ contract_id: helper, function_name: 'swap-original-for-twin', function_args: [Cl.uint(swapId)] })
    .addContractCall({ contract_id: helper, function_name: 'swap-twin-for-original', function_args: [Cl.uint(swapId)] });
}
// 3b. G2: the owner of a token that is listed on the source's own market must be refused (u217) when swapping the original in.
const listedId = opt('listed-token') ? Number(opt('listed-token')) : null;
if (listedId != null) {
  if (!ids.includes(listedId)) throw new Error(`--listed-token ${listedId} must be one of --tokens`);
  const lo = await ownerOf(manifest.source, listedId);
  console.log(`listed #${listedId} swap-in attempted by its owner ${lo} (must fail u217)`);
  b.withSender(lo).addContractCall({ contract_id: helper, function_name: 'swap-original-for-twin', function_args: [Cl.uint(listedId)] });
}
// 4. Must fail: re-inscribing a bound token, and set-fee by a non-owner.
b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: inscribeArgs(ids[0]) });
b.withSender(RAPHA).addContractCall({ contract_id: helper, function_name: 'set-fee', function_args: [Cl.uint(0)] });

const id = await b.run();
console.log(`\nSimulation: https://stxer.xyz/simulations/mainnet/${id}`);
console.log('Expected: deploy ok, all seed-canonical calls ok, finalize ok, both inscribes ok (half the fee to the OTHER payee), swaps ok (free),');
console.log('          second inscribe of the same token FAILS, set-fee by the non-owner FAILS.');
if (listedId != null) console.log(`          the listed-token swap-in (#${listedId}) FAILS with (err u217).`);

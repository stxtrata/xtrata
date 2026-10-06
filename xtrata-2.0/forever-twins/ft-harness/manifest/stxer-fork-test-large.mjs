#!/usr/bin/env node
// Mainnet-fork rehearsal of the LARGE-ON-DEMAND route on stxer (https://stxer.xyz). Nothing is broadcast.
//
//   node scripts/render-helper-v3.mjs scripts/configs/mainnet-bitcoin-monkeys.v3.json contracts/rendered/forever-twin-bitcoin-monkeys.v3.clar
//        (the config must contain  "largeOnDemand": true )
//   node manifest/stxer-fork-test-large.mjs --manifest manifest/out/bitcoin-monkeys.manifest.json \
//        --helper-file contracts/rendered/forever-twin-bitcoin-monkeys.v3.clar \
//        --deployer SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X \
//        [--large-tokens 12,40] [--small-token 3] [--gateway http://127.0.0.1:8080]
//
// Needs a manifest with at least two tokens over 512 KB (defaults to the first two it finds).
// Two fresh, throwaway wallets play the visitors (random addresses made in memory; no key is kept or used).
//
// Sequence: deploy helper -> seed-canonical -> finalize-canonical (must succeed with large entries UNBOUND)
//  -> Jim funds wallet F1 and F2 -> F1 uploads large token L1 through the core's multi-tx upload (begin,
//  add-chunk-batch x N, seal) -> F2 uploads the SAME bytes under the same hash (the core allows it) ->
//  F1 inscribe-large(L1) ok (fee 50/50) -> F2 inscribe-large(L1) must FAIL (u201), F2 keeps its inscription ->
//  F2 uploads L2 and inscribe-large(L2) ok -> the real owner of L1 swaps original <-> twin ->
//  must fail: plain inscribe of a large token (u220), bind-preinscribed after finalisation (u207), set-fee by
//  a non-owner (u204), inscribe-large with the wrong inscription id (u220).
// The core assigns each sealed inscription the id next-id, so ids are predicted from the core's next-id at the
// pinned fork block; if another mainnet inscription lands in between, those steps fail with u220/u210 and the
// printed "predicted" ids will not match the sealed ids: just run it again.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl, cvToHex, cvToJSON, hexToCV, makeRandomPrivKey, getAddressFromPrivateKey } from '@stacks/transactions';
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
const CORE = opt('core', 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3');
const LIMIT = 524288;
const text = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(text);
const name = `forever-twin-${manifest.collectionKey}`.slice(0, 40);
const helper = `${deployer}.${name}`;
const source = readFileSync(helperFile, 'utf8');
if (!/define-public \(inscribe-large/.test(source)) { console.error('the helper file has no inscribe-large: render it from a config with "largeOnDemand": true'); process.exit(1); }
const plan = makePlan(text, helper);

const large = manifest.tokens.filter((t) => t.twin.totalSize > LIMIT).map((t) => t.id);
const small = manifest.tokens.filter((t) => t.twin.totalSize <= LIMIT).map((t) => t.id);
const L = opt('large-tokens') ? parseIds(opt('large-tokens')) : large.slice(0, 2);
if (L.length < 2) { console.error(`need two large tokens; the manifest has ${large.length}`); process.exit(1); }
for (const id of L) if (!large.includes(id)) throw new Error(`#${id} is not over 512 KB in the manifest`);
const S = opt('small-token') ? Number(opt('small-token')) : null;
console.log(`manifest: ${manifest.count} tokens, ${large.length} large, ${small.length} small. large ${L.join(', ')}${S ? `, small ${S}` : ''}`);

const HIRO = process.env.HIRO_API || 'https://api.hiro.so';
const findPrincipal = (o) => (typeof o === 'string' ? (/^S[PM][0-9A-Z.\-a-z]+$/.test(o) ? o : null) : o && typeof o === 'object' ? Object.values(o).map(findPrincipal).find(Boolean) ?? null : null);
async function ownerOf(src, tokenId) {
  const [a, n] = src.split('.');
  const r = await fetch(`${HIRO}/v2/contracts/call-read/${a}/${n}/get-owner`, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sender: a, arguments: [cvToHex(Cl.uint(tokenId))] }) });
  const j = await r.json();
  const who = j.okay ? findPrincipal(cvToJSON(hexToCV(j.result))) : null;
  if (!who) throw new Error(`could not read the owner of #${tokenId} from ${src}`);
  return who;
}

// pin the fork to a recent block and read the core's next-id at that block
let nextId = null, pinned = null;
try {
  const info = await (await fetch(`${HIRO}/v2/info`)).json();
  pinned = info.stacks_tip_height - 2;
  const blk = await (await fetch(`${HIRO}/extended/v2/blocks/${pinned}`)).json();
  const [ca, cn] = CORE.split('.');
  const dv = await (await fetch(`${HIRO}/v2/data_var/${ca}/${cn}/next-id?proof=0&tip=${blk.index_block_hash}`)).json();
  nextId = Number(cvToJSON(hexToCV(dv.data)).value);
  console.log(`fork pinned at block ${pinned}; core next-id there = ${nextId}`);
} catch (e) { console.error(`could not pin the block / read next-id (${e.message}); aborting so ids are not guessed`); process.exit(1); }

// real file bytes, verified against the manifest
const files = {}, info = {};
for (const id of [...L, ...(S ? [S] : [])]) {
  const t = manifest.tokens.find((x) => x.id === id);
  if (!t) throw new Error(`token ${id} not in manifest`);
  const bytes = await fetchBytes(toHttp(t.original.mediaUris[0], gateway));
  files[id] = await verifyToken(t, bytes);
  info[id] = t;
  console.log(`#${id}: ${bytes.length} B verified, ${files[id].length} chunks`);
}
const wallet = () => getAddressFromPrivateKey(makeRandomPrivKey(), 'mainnet');
const F1 = wallet(), F2 = wallet();
console.log(`throwaway visitor wallets: F1 ${F1}, F2 ${F2}`);

const b = SimulationBuilder.new({ network: 'mainnet' }).useBlockHeight(pinned)
  .withSender(deployer)
  .addContractDeploy({ contract_name: name, source_code: source, clarity_version: 4 });
for (const s of plan.steps.filter((s) => s.function === 'seed-canonical')) {
  const entries = manifest.tokens.filter((t) => s.ids.includes(t.id));
  b.addContractCall({ contract_id: helper, function_name: 'seed-canonical', function_args: [Cl.list(entries.map((t) => Cl.tuple({
    id: Cl.uint(t.id), 'content-hash': Cl.bufferFromHex(t.twin.contentHash.replace(/^0x/, '')),
    mime: Cl.stringAscii(t.twin.mime), 'total-size': Cl.uint(t.twin.totalSize), 'token-uri': Cl.stringAscii(t.twin.tokenUri) })))] });
}
// finalise with every large entry still unbound
b.addContractCall({ contract_id: helper, function_name: 'finalize-canonical',
  function_args: [Cl.bufferFromHex(createHash('sha256').update(text).digest('hex')), Cl.uint(manifest.count)] });
// the visitors need STX: Jim funds them
b.withSender(JIM).addSTXTransfer({ recipient: F1, amount: 30_000_000 }).addSTXTransfer({ recipient: F2, amount: 30_000_000 });

const hashOf = (id) => Cl.bufferFromHex(info[id].twin.contentHash.replace(/^0x/, ''));
const upload = (who, id) => {
  const t = info[id], cs = files[id];
  b.withSender(who).addContractCall({ contract_id: CORE, function_name: 'begin-inscription',
    function_args: [hashOf(id), Cl.stringAscii(t.twin.mime), Cl.uint(t.twin.totalSize), Cl.uint(cs.length)] });
  for (let i = 0; i < cs.length; i += 32)
    b.withSender(who).addContractCall({ contract_id: CORE, function_name: 'add-chunk-batch',
      function_args: [hashOf(id), Cl.list(cs.slice(i, i + 32).map((c) => Cl.buffer(c)))] });
  b.withSender(who).addContractCall({ contract_id: CORE, function_name: 'seal-inscription',
    function_args: [hashOf(id), Cl.stringAscii(t.twin.tokenUri)] });
};
const twinCall = (who, tokenId, xid) => b.withSender(who).addContractCall({ contract_id: helper, function_name: 'inscribe-large',
  function_args: [Cl.uint(tokenId), Cl.uint(xid)] });

const [L1, L2] = L;
const id1 = nextId, id1b = nextId + 1, id2 = nextId + 2;
console.log(`predicted inscription ids: F1 seals #${L1} as ${id1}; F2 seals the same bytes as ${id1b}; F2 seals #${L2} as ${id2}`);
upload(F1, L1);                    // -> id1
upload(F2, L1);                    // same hash from a second wallet -> id1b
twinCall(F1, L1, id1);             // ok: pays fee, twin to custody
twinCall(F2, L1, id1b);            // MUST FAIL u201: token already bound; F2 keeps its inscription
upload(F2, L2);                    // -> id2
twinCall(F2, L2, id2);             // ok
twinCall(F1, L2, id1);             // MUST FAIL (u201 or u220): wrong inscription / already bound

// the real holder of #L1 swaps original <-> twin (free)
const holder = await ownerOf(manifest.source, L1);
console.log(`swap #${L1} signed by ${holder}`);
b.withSender(holder)
  .addContractCall({ contract_id: helper, function_name: 'swap-original-for-twin', function_args: [Cl.uint(L1)] })
  .addContractCall({ contract_id: helper, function_name: 'swap-twin-for-original', function_args: [Cl.uint(L1)] });

if (S) { // a small token still inscribes the normal way
  b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: [Cl.uint(S), Cl.list(files[S].map((c) => Cl.buffer(c)))] });
}
// must fail
const third = large.find((x) => !L.includes(x));
if (third) b.withSender(JIM).addContractCall({ contract_id: helper, function_name: 'inscribe', function_args: [Cl.uint(third), Cl.list([])] });      // u220 large via inscribe
b.withSender(deployer).addContractCall({ contract_id: helper, function_name: 'bind-preinscribed', function_args: [Cl.uint(L1), Cl.uint(id1)] });        // u207
b.withSender(RAPHA).addContractCall({ contract_id: helper, function_name: 'set-fee', function_args: [Cl.uint(0)] });                                    // u204
b.withSender(JIM).addVarRead(helper, 'large-unbound');

const sim = await b.run();
console.log(`\nSimulation: https://stxer.xyz/simulations/mainnet/${sim}`);
console.log(`Expected: deploy ok; seed-canonical ok; finalize ok (large entries unbound); 2 STX transfers; F1 begin/batches/seal ok (id ${id1});`);
console.log(`          F2 begin/batches/seal ok for the SAME hash (id ${id1b}); F1 inscribe-large(#${L1}) ok; F2 inscribe-large(#${L1}) (err u201);`);
console.log(`          F2 upload of #${L2} ok (id ${id2}); F2 inscribe-large(#${L2}) ok; F1 inscribe-large(#${L2}, ${id1}) fails (u201/u220);`);
console.log('          holder swaps ok (free); plain inscribe of a large token (err u220); bind-preinscribed (err u207); set-fee by a non-owner (err u204).');
console.log(`          fee: each payee gets half of the helper fee from the visitor wallet; large-unbound at the end = ${large.length - 2}.`);

#!/usr/bin/env node
// The hall on xtrata-world-v2 (the object registry): deploy it, seed the hall, change ONE sign, add ONE object, reset a bay, read it back.
// TESTNET ONLY. DRY RUN by default: it prints the plan and writes the calls as a steps file (ops/out/v2/*.steps.json). With --execute (and
// XA_OPS_CONFIRM=broadcast-testnet, a key file per wizard that is not the admin wallet's, no KILL file) it signs OFFLINE and packs the
// transactions for a browser to relay (see relay.mjs / relay-steps.mjs). Nothing is ever sent from here. The one exception to "offline":
// `read`, which only makes read-only calls.
//
//   node ops/v2.mjs deploy                                   [--execute --nonces deployer=N]
//   node ops/v2.mjs seed hall.scene.json [lobby.scene.json]  --height H [--delegate publisher] [--link-room casino=ID] [--execute --nonces deployer=N]
//   node ops/v2.mjs patch --object hall/bay-0/sign --set text=NEW --set tone=gold [--hide] [--at +6h] [--compact] [--as publisher]
//   node ops/v2.mjs add   --bay hall/bay-1 --kind sign-board [--name sign-2] --params '{"text":"HI"}' [--at +1h]
//   node ops/v2.mjs bay   --bay hall/bay-0 [--base wall|door|posters] [--interaction none|knock|peek|enter] [--hide] [--at +1h]
//   node ops/v2.mjs reset --bay hall/bay-0 [--soft]
//   node ops/v2.mjs read  --registry ST….xtrata-world-v2 [--network testnet] [--json] [--out snapshot.json]
//
// Shared options: --manifest FILE (default ops/out/v2/hall-v2.manifest.json: the record of ids and what each object shows now; seed writes
// it, the other commands read and update it), --out-dir DIR, --keys DIR (default ~/.xa-testnet-wizards), --nonces name=N, --fee uSTX per call,
// --chunk N (transactions per packed file, default 24), --owner ST… (the deployer address; default: the deployer wizard).
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { parseArgs, die } from './lib/cli.mjs';
import { Refused } from './lib/guard.mjs';
import { pack } from './lib/relay.mjs';
import { signSteps, parseNonces } from './lib/steps.mjs';
import { parseSceneFile } from './lib/scene.mjs';
import * as V2 from './lib/v2.mjs';
import { readHall, describeHall, networkRead } from './lib/hallread.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
// repeatable options: --set k=v
const sets = [];
const rest = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === '--set') sets.push(argv[++i]); else if (argv[i].startsWith('--set=')) sets.push(argv[i].slice(6)); else rest.push(argv[i]); }
const args = parseArgs(rest, { manifest: 'value', outDir: 'value', keys: 'value', nonces: 'value', fee: 'value', chunk: 'value', owner: 'value', as: 'value', height: 'value',
  delegate: 'value', linkRoom: 'value', object: 'value', params: 'value', at: 'value', bay: 'value', kind: 'value', name: 'value', base: 'value', interaction: 'value',
  registry: 'value', network: 'value', apiBase: 'value', out: 'value', path: 'value', lobbyPath: 'value', seqs: 'value', deployFee: 'value' });
const cmd = args._[0];
const outDir = args.outDir || join(here, 'out', 'v2');
const manifestPath = args.manifest || join(outDir, 'hall-v2.manifest.json');
if (!cmd) die('usage: node ops/v2.mjs <deploy|seed|patch|add|bay|reset|read> [options]   (see the header of ops/v2.mjs)');

const loadManifest = () => { if (!existsSync(manifestPath)) die(`no manifest at ${manifestPath}: run seed first (or pass --manifest)`); return JSON.parse(readFileSync(manifestPath, 'utf8')); };
const height = args.height != null ? Number(args.height) : undefined;

// Print the plan, write the steps file, and (with --execute) sign + pack + write the manifest.
async function finish(name, plan, { manifestOut = true } = {}) {
  if (plan.errors && plan.errors.length) { plan.errors.forEach((e) => console.error('  ERROR ' + e)); die('fix the errors first'); }
  if (plan.findings) plan.findings.forEach((f) => f.print());
  mkdirSync(outDir, { recursive: true });
  const stepsFile = join(outDir, `${name}.steps.json`);
  writeFileSync(stepsFile, JSON.stringify(plan.doc, null, 1) + '\n');
  console.log(`${plan.doc.steps.length} call(s) planned:`);
  plan.doc.steps.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s.as}: ${s.deploy ? 'deploy ' + s.deploy : s.fn}${s.note ? ' (' + s.note + ')' : ''}`));
  (plan.notes || []).forEach((n) => console.log('  note: ' + n));
  console.log(`steps -> ${stepsFile}`);
  if (!args.execute) {
    if (manifestOut && plan.manifest) { const prev = join(outDir, `${name}.manifest.preview.json`); writeFileSync(prev, JSON.stringify(plan.manifest, null, 1) + '\n'); console.log(`manifest after these calls -> ${prev}`); }
    console.log('\nDRY RUN: nothing was signed. Add --execute --nonces deployer=N (and XA_OPS_CONFIRM=broadcast-testnet) to sign offline and pack.');
    return;
  }
  const nonces = parseNonces(args.nonces);
  const keysDir = args.keys || join(homedir(), '.xa-testnet-wizards');
  const size = Number(args.chunk || 24);
  let n = 0, next = nonces;
  for (const doc of V2.chunkSteps(plan.doc, size)) {
    let signed;
    try { signed = await signSteps(doc, { nonces: next, keysDir, execute: true, fee: Number(args.fee || 30000), deployFee: Number(args.deployFee || 2500000) }); }
    catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); die(e.message); }
    next = signed.nonces; n++;
    const file = join(outDir, `${name}-${n}.packed.txt`), packed = pack(signed.items);
    writeFileSync(file, packed);
    console.log(`\npack ${n}: ${signed.items.length} transaction(s) -> ${file}`);
    console.log(`  length ${packed.length}, sha256 ${createHash('sha256').update(packed).digest('hex').slice(0, 12)} (check this after pasting into the browser)`);
  }
  if (manifestOut && plan.manifest) { writeFileSync(manifestPath, JSON.stringify(plan.manifest, null, 1) + '\n'); console.log(`\nmanifest -> ${manifestPath}`); }
  console.log('next nonces: ' + Object.entries(next).map(([k, v]) => `${k}=${v}`).join(','));
  console.log('Relay the packs IN ORDER, each only after the previous one has confirmed (ids in the manifest assume every call lands).');
}

try {
  if (cmd === 'deploy') {
    await finish('deploy', { ...V2.planDeploy({ owner: args.owner }), errors: [] }, { manifestOut: false });
  } else if (cmd === 'seed') {
    const files = args._.slice(1);
    if (!files.length) die('seed needs at least one scene file (room "arcade-hall" and/or "lobby")');
    const docs = files.map((f) => parseSceneFile(readFileSync(f, 'utf8')));
    const linkRooms = args.linkRoom ? Object.fromEntries(String(args.linkRoom).split(',').map((p) => { const [k, v] = p.split('='); return [k, Number(v)]; })) : {};
    const plan = V2.planSeed(docs, {
      height, delegates: args.delegate ? String(args.delegate).split(',') : [], linkRooms, as: args.as,
      manifest: existsSync(manifestPath) && !args.fresh ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null, ownerAddress: args.owner,
    });
    await finish('seed', plan);
  } else if (cmd === 'patch') {
    if (!args.object) die('patch needs --object <hall/bay-0/sign>');
    const params = args.params ? JSON.parse(args.params) : {};
    for (const s of sets) { const i = s.indexOf('='); const k = s.slice(0, i), v = s.slice(i + 1); params[k] = v === 'null' ? null : (v !== '' && !isNaN(Number(v)) && /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v === 'true' ? true : v === 'false' ? false : v); }
    await finish('patch', V2.planPatch(loadManifest(), { object: args.object, params: Object.keys(params).length ? params : null, replace: !!args.replace, hide: !!args.hide, at: args.at, height, compact: !!args.compact, as: args.as }));
  } else if (cmd === 'add') {
    if (!args.bay || !args.kind) die('add needs --bay <hall/bay-1> and --kind <sign-board|caution-tape|curtain-house|door-gothic|light-pulse|…>');
    await finish('add', V2.planAdd(loadManifest(), { bay: args.bay, kind: args.kind, name: args.name, params: args.params ? JSON.parse(args.params) : {}, at: args.at, height, as: args.as }));
  } else if (cmd === 'bay') {
    if (!args.bay) die('bay needs --bay <hall/bay-0>');
    await finish('bay', V2.planBay(loadManifest(), { bay: args.bay, base: args.base, interaction: args.interaction, hide: !!args.hide, at: args.at, height, compact: !!args.compact, as: args.as }));
  } else if (cmd === 'reset') {
    if (!args.bay) die('reset needs --bay <hall/bay-0>');
    await finish('reset', V2.planReset(loadManifest(), { bay: args.bay, soft: !!args.soft, seqs: args.seqs ? String(args.seqs).split(',').map(Number) : null, as: args.as, compact: !!args.compact }));
  } else if (cmd === 'read') {
    let registry = args.registry;
    if (!registry) { const m = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null; if (m) registry = `${m.owner}.${m.contract}`; }
    if (!registry) die('read needs --registry ST….xtrata-world-v2 (or a manifest)');
    const net = args.network || 'testnet';
    if (net !== 'testnet') die('read handles testnet only');
    const read = networkRead({ apiBase: args.apiBase || 'https://api.testnet.hiro.so' });
    const r = await readHall({ read, registry, path: args.path ? String(args.path).split('/') : ['arcade', 'hall'], lobbyPath: args.lobbyPath ? String(args.lobbyPath).split('/') : null });
    if (args.out) { writeFileSync(args.out, JSON.stringify(r, null, 1) + '\n'); console.log('snapshot -> ' + args.out); }
    console.log(args.json ? JSON.stringify(r, null, 1) : describeHall(r));
  } else die('unknown command ' + cmd);
} catch (e) {
  if (e instanceof Refused) die('REFUSED: ' + e.message, 2);
  die(e.message);
}

#!/usr/bin/env node
// Sign one phase of the testnet rehearsal OFFLINE and pack it for a browser to relay. TESTNET ONLY. Same guards as the sending tools:
// --execute, XA_OPS_CONFIRM=broadcast-testnet, a key file that is not the admin wallet's, no KILL file. Nothing is sent from here.
//   node ops/relay.mjs deploy  --execute --key-file K --nonce N
//   node ops/relay.mjs setup   --execute --key-file K --nonce N [--publisher ST...]
//   node ops/relay.mjs scenes  --execute --key-file K --nonce N --file story.scene.json --height H
//   node ops/relay.mjs posters --execute --key-file K --nonce N --file poster.json --height H [--role admin|publisher] [--owner ST...]
//   node ops/relay.mjs call    --execute --key-file K --nonce N --which world|posters --fn set-paused --arg bool:true [--owner ST...]
//   node ops/relay.mjs revert  --execute --key-file K --nonce N --room arcade-hall --bay 0
//   node ops/relay.mjs retract --execute --key-file K --nonce N --room arcade-hall --bay 0 --seqs 2
//   node ops/relay.mjs room    --execute --key-file K --nonce N --id arcade-hall-4 --title "Xtrata Arcade (4 bays)" --bays 4
//   (scenes/revert/retract for a room added this way also need --extra-room arcade-hall-4:4)
//   node ops/relay.mjs fund    --execute --key-file K --nonce N --to ST... --stx 5
// --owner is the address that deployed the contracts (defaults to the signing key's address).
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl } from '@stacks/transactions';
import { parseArgs, die } from './lib/cli.mjs';
import { authoriseBroadcast, Refused } from './lib/guard.mjs';
import { signDeploy, signCall, signTransfer, pack } from './lib/relay.mjs';
import { deploySources } from './lib/deploy.mjs';
import { lookRegistry, defaultLookBook, ROOMS } from './lib/catalogue.mjs';
import { parseSceneFile, compileScenes } from './lib/scene.mjs';
import { planSceneCalls } from './lib/submit.mjs';
import { compilePosters, posterBatches, todayOf } from './lib/posters.mjs';
import { posterCv, sceneCv } from './lib/clar.mjs';
import { postersScene } from './lib/revert.mjs';

const args = parseArgs(process.argv.slice(2), { keyFile: 'value', nonce: 'value', publisher: 'value', file: 'value', height: 'value', owner: 'value', fee: 'value', callFee: 'value', which: 'value', fn: 'value', arg: 'value', label: 'value', out: 'value', role: 'value', to: 'value', stx: 'value', room: 'value', bay: 'value', seqs: 'value', id: 'value', title: 'value', bays: 'value', extraRoom: 'value' });
const phase = args._[0];
if (!phase || args.nonce == null) die('usage: node ops/relay.mjs <deploy|setup|room|scenes|posters|call|revert|retract|fund> --execute --key-file K --nonce N ...');
let auth;
try { auth = authoriseBroadcast({ network: 'testnet', execute: !!args.execute, keyFile: args.keyFile }); } catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); throw e; }
const key = auth.key, me = auth.sender, owner = args.owner || me;
const names = { world: `${owner}.xtrata-world-v1`, posters: `${owner}.xtrata-posters-v1` };
let nonce = Number(args.nonce);
const callFee = Number(args.callFee || 30000), deployFee = Number(args.fee || 2000000);
const items = [];
const rooms = [...ROOMS, ...(args.extraRoom ? [{ id: String(args.extraRoom).split(':')[0], title: '', bays: Number(String(args.extraRoom).split(':')[1]) }] : [])];
const call = async (which, fn, a, label) => items.push(await signCall({ names, which, fn, args: a, key, nonce: nonce++, fee: callFee, label }));

if (phase === 'deploy') {
  for (const s of deploySources()) items.push(await signDeploy({ name: s.name, source: s.source, key, nonce: nonce++, fee: deployFee }));
} else if (phase === 'setup') {
  for (const l of lookRegistry()) await call('world', 'register-look', [Cl.uint(l.kind), Cl.stringAscii(l.name), Cl.uint(0), Cl.stringAscii(l.key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)], `register-look ${l.key}`);
  for (const r of ROOMS) await call('world', 'register-room', [Cl.stringAscii(r.id), Cl.stringAscii(r.title), Cl.principal(me), Cl.uint(r.bays)], `register-room ${r.id} (${r.bays} bays)`);
  if (args.publisher) for (const w of ['world', 'posters']) await call(w, 'set-publisher', [Cl.principal(args.publisher), Cl.bool(true)], `${w} set-publisher`);
} else if (phase === 'room') {
  if (!args.id || !args.bays) die('--id and --bays are needed');
  await call('world', 'register-room', [Cl.stringAscii(args.id), Cl.stringAscii(args.title || args.id), Cl.principal(me), Cl.uint(Number(args.bays))], `register-room ${args.id} (${args.bays} bays)`);
} else if (phase === 'scenes') {
  if (!args.file || args.height == null) die('--file and --height are needed');
  const doc = parseSceneFile(readFileSync(args.file, 'utf8'));
  const { findings, scenes } = compileScenes(doc, { looks: defaultLookBook(), rooms: Object.fromEntries(rooms.map((r) => [r.id, { bays: r.bays }])), height: Number(args.height), timelineUsed: {} });
  findings.print(); if (!findings.ok) die('fix the errors first');
  for (const c of planSceneCalls(scenes)) await call('world', c.fn, c.args, `${c.fn} (${c.scenes.length})`);
} else if (phase === 'posters') {
  if (!args.file || args.height == null) die('--file and --height are needed');
  const { findings, posters } = compilePosters(JSON.parse(readFileSync(args.file, 'utf8')), { today: todayOf(Number(args.height)), role: args.role || (me === owner ? 'admin' : 'publisher') });
  findings.print(); if (!findings.ok) die('fix the errors first');
  for (const b of posterBatches(posters)) await call('posters', b.length === 1 ? 'add-poster' : 'add-posters', b.length === 1 ? [posterCv(b[0])] : [Cl.list(b.map(posterCv))], `posters (${b.length})`);
} else if (phase === 'call') {
  const [t, v] = String(args.arg || '').split(':');
  const a = !args.arg ? [] : [t === 'bool' ? Cl.bool(v === 'true') : t === 'uint' ? Cl.uint(Number(v)) : t === 'ascii' ? Cl.stringAscii(v) : t === 'principal' ? Cl.principal(v) : t === 'uints' ? Cl.list(v.split(',').map((n) => Cl.uint(Number(n)))) : die('arg type must be bool|uint|uints|ascii|principal')];
  await call(args.which, args.fn, a, args.label);
} else if (phase === 'revert') {
  await call('world', 'add-scene', [sceneCv(postersScene(args.room, Number(args.bay)))], `revert ${args.room} bay ${args.bay} to posters`);
} else if (phase === 'retract') {
  for (const q of String(args.seqs).split(',')) await call('world', 'retract-scene', [Cl.stringAscii(args.room), Cl.uint(Number(args.bay)), Cl.uint(Number(q))], `retract ${args.room} bay ${args.bay} #${q}`);
} else if (phase === 'fund') {
  items.push(await signTransfer({ to: args.to, ustx: BigInt(Math.round(Number(args.stx) * 1e6)), key, nonce: nonce++, fee: 2000 }));
} else die('unknown phase ' + phase);

const here = dirname(fileURLToPath(import.meta.url));
const out = args.out || join(here, 'out', 'relay', `${phase}.packed.txt`);
mkdirSync(dirname(out), { recursive: true });
const packed = pack(items);
writeFileSync(out, packed);
console.log(`${items.length} transaction(s) signed offline by ${me}, nonces ${Number(args.nonce)}..${nonce - 1}; packed ${packed.length} characters -> ${out}`);
items.forEach((i, n) => console.log(`  ${n + 1}. ${i.label}`));

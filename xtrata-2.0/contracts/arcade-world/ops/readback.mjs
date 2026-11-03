#!/usr/bin/env node
// Read a room's bays back from a chain (read-only) and optionally compare with a scene file.
//   node ops/readback.mjs --network testnet --world ID --posters ID --room arcade-hall [--file story.scene.json] [--at 123456,123999]
import { readFileSync } from 'node:fs';
import { parseArgs, die } from './lib/cli.mjs';
import { transportFromArgs, loadContext } from './lib/context.mjs';
import { readBayView, readScenes, verifyScenes, resolveAt, readWorldConfig } from './lib/readback.mjs';
import { parseSceneFile, compileScenes } from './lib/scene.mjs';
import { readRooms } from './lib/readback.mjs';

const args = parseArgs(process.argv.slice(2), { network: 'value', world: 'value', posters: 'value', room: 'value', file: 'value', at: 'value' });
const t = transportFromArgs(args);
if (!t) die('usage: node ops/readback.mjs --network testnet --world ID --posters ID --room arcade-hall [--file f.scene.json] [--at h1,h2]');
const room = args.room || (args.file ? parseSceneFile(readFileSync(args.file, 'utf8')).room : null);
if (!room) die('--room is needed');
const height = await t.height();
const cfg = await readWorldConfig(t);
const rooms = await readRooms(t, [room]);
if (!rooms[room]) die(`room "${room}" is not registered`);
console.log(`world contract: admin ${cfg.admin}${cfg.paused ? ' (PAUSED)' : ''}; chain height ${height}`);
for (let b = 0; b < rooms[room].bays; b++) {
  const v = await readBayView(t, room, b), all = await readScenes(t, room, b);
  console.log(`bay ${b}: ${v && v.active ? 'scene #' + v.activeSeq + ' showing (base ' + v.active.base + ')' : 'default (posters)'}${v && v.nextHeight != null ? ', next change at block ' + v.nextHeight : ''}; ${all.filter((s) => !s.retracted).length} scene(s) on record`);
  if (args.at) console.log('   resolves: ' + (await resolveAt(t, room, b, String(args.at).split(',').map(Number))).map((r) => `${r.height} -> ${r.seq == null ? 'posters' : '#' + r.seq}`).join(', '));
}
if (args.file) {
  const doc = parseSceneFile(readFileSync(args.file, 'utf8'));
  const ctx = await loadContext(args, doc, t);
  const { findings, scenes } = compileScenes(doc, { ...ctx, timelineUsed: {} });
  findings.print();
  const v = await verifyScenes(t, scenes, { submittedAt: height });
  console.log(v.ok ? `OK: all ${scenes.length} scene(s) in the file are on chain` : `MISSING ${v.missing.length} scene(s) from the chain`);
  process.exit(v.ok ? 0 : 1);
}

#!/usr/bin/env node
// Check a scene file and print it as a timeline. Offline by default (assumes a fresh contract with the built-in looks registered
// in the standard order); add --network to check against the real look ids, rooms and timeline room on a chain (read-only).
//   node ops/validate.mjs file.scene.json [--height N] [--looks looks.json] [--network testnet --world ID --posters ID]
import { readFileSync } from 'node:fs';
import { parseArgs, die } from './lib/cli.mjs';
import { parseSceneFile, compileScenes, describe } from './lib/scene.mjs';
import { loadContext } from './lib/context.mjs';

const args = parseArgs(process.argv.slice(2), { height: 'value', looks: 'value', network: 'value', world: 'value', posters: 'value', rooms: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/validate.mjs <file.scene.json> [--height N] [--network testnet --world ID --posters ID]');
const doc = parseSceneFile(readFileSync(file, 'utf8'));
const ctx = await loadContext(args, doc);
const { findings, scenes } = compileScenes(doc, ctx);
console.log(`${file}: ${scenes.length} of ${(doc.scenes || []).length} scene(s) valid${ctx.offline ? ' (offline: assumed standard look ids)' : ''}${ctx.height != null ? `, base height ${ctx.height}` : ''}`);
findings.print();
if (findings.ok) { console.log(''); console.log(describe(scenes, { height: ctx.height })); }
process.exit(findings.ok ? 0 : 1);

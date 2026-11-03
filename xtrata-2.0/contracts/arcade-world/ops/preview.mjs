#!/usr/bin/env node
// Build a local preview page of a scene file in the real hall. Open the output in a browser. Nothing is sent anywhere.
//   node ops/preview.mjs file.scene.json [--height N] [--out ops/out/preview.html]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { parseSceneFile, compileScenes } from './lib/scene.mjs';
import { loadContext } from './lib/context.mjs';
import { previewData, buildPreviewHtml } from './lib/preview.mjs';

const args = parseArgs(process.argv.slice(2), { height: 'value', looks: 'value', network: 'value', world: 'value', posters: 'value', out: 'value' });
const file = args._[0];
if (!file) die('usage: node ops/preview.mjs <file.scene.json> [--height N] [--out path.html]');
const doc = parseSceneFile(readFileSync(file, 'utf8'));
const ctx = await loadContext(args, doc);
if (ctx.height == null) ctx.height = 1000;   // a stand-in "now" so relative times work offline
const { findings, scenes } = compileScenes(doc, ctx);
findings.print();
if (!findings.ok) die('not previewing: fix the errors above first');
const here = dirname(fileURLToPath(import.meta.url));
const out = args.out || join(here, 'out', basename(file).replace(/\.json$/, '') + '.preview.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buildPreviewHtml(previewData({ scenes, looks: ctx.looks, height: ctx.height, title: basename(file) })));
console.log(`preview written: ${out}`);

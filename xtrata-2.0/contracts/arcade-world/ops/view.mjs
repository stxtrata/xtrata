#!/usr/bin/env node
// Build a local page that shows a TEST NETWORK's contracts in the real hall (reads only; nothing is sent).
//   node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--out path.html]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { buildTestnetViewHtml } from './lib/preview.mjs';

const args = parseArgs(process.argv.slice(2), { world: 'value', posters: 'value', screen: 'value', out: 'value', room: 'value' });
const world = args.world || process.env.XA_WORLD, posters = args.posters || process.env.XA_POSTERS;
if (!world || !posters) die('usage: node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--out path.html]');
let html;
try { html = buildTestnetViewHtml({ world, posters, screen: args.screen || process.env.XA_SCREEN || '', roomId: args.room || 'arcade-hall' }); } catch (e) { die(e.message); }
const out = args.out || join(dirname(fileURLToPath(import.meta.url)), 'out', 'testnet-view.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`written: ${out}\nOpen it in a browser; it reads ${world} and ${posters} from the Hiro testnet API.`);

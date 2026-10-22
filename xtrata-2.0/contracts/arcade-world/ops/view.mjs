#!/usr/bin/env node
// Build a local page that shows a TEST NETWORK's contracts in the real hall (reads only; nothing is sent).
//   node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--scores ST...xtrata-arcade-scores-v2] [--registry ST...xtrata-world-v2] [--rooms casino=casino-room.html|TITLE|entry-still.jpg|entry-depth.png,...] [--out path.html]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { buildTestnetViewHtml } from './lib/preview.mjs';

const args = parseArgs(process.argv.slice(2), { world: 'value', posters: 'value', screen: 'value', scores: 'value', registry: 'value', rooms: 'value', out: 'value', room: 'value' });
const world = args.world || process.env.XA_WORLD, posters = args.posters || process.env.XA_POSTERS;
if (!world || !posters) die('usage: node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--scores ST...xtrata-arcade-scores-v2] [--registry ST...xtrata-world-v2] [--rooms casino=casino-room.html|TITLE|entry-still.jpg|entry-depth.png,...] [--out path.html]');
let html;
const rooms = {}; for (const p of String(args.rooms || '').split(',').filter(Boolean)) { const [slug, rest] = p.split('='); const [src, title, still, depth] = String(rest || '').split('|'); rooms[slug] = { src, title, ...(still ? { still } : {}), ...(depth ? { depth } : {}) }; }
try { html = buildTestnetViewHtml({ rooms, world, posters, screen: args.screen || process.env.XA_SCREEN || '', scores: args.scores || process.env.XA_SCORES || '', registry: args.registry || process.env.XA_REGISTRY || '', roomId: args.room || 'arcade-hall' }); } catch (e) { die(e.message); }
const out = args.out || join(dirname(fileURLToPath(import.meta.url)), 'out', 'testnet-view.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`written: ${out}\nOpen it in a browser; it reads ${world} and ${posters} from the Hiro testnet API.`);

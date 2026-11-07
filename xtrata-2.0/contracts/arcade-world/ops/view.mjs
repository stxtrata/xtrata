#!/usr/bin/env node
// Build a local page that shows a TEST NETWORK's contracts in the real hall (reads only; nothing is sent).
//   (--hall FILE shows another built hall, e.g. ../../recursive-apps/xtrata-arcade/dist/xtrata-arcade-v2.0.0.html; default is the newest built hall)
//   node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--scores ST...xtrata-arcade-scores-v2] [--registry ST...xtrata-world-v2] [--games ST...xtrata-games-v1 --core ST...xtrata-v3-2-3] [--rooms casino=casino-room.html|TITLE|entry-still.jpg|entry-depth.png,...] [--out path.html]
import { writeFileSync, mkdirSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, die } from './lib/cli.mjs';
import { buildTestnetViewHtml } from './lib/preview.mjs';

const args = parseArgs(process.argv.slice(2), { world: 'value', posters: 'value', screen: 'value', scores: 'value', registry: 'value', games: 'value', core: 'value', rooms: 'value', out: 'value', room: 'value', hall: 'value' });
const world = args.world || process.env.XA_WORLD, posters = args.posters || process.env.XA_POSTERS;
if (!world || !posters) die('usage: node ops/view.mjs --world ST...xtrata-world-v1 --posters ST...xtrata-posters-v1 [--screen ST...xtrata-screen-v1] [--scores ST...xtrata-arcade-scores-v2] [--registry ST...xtrata-world-v2] [--rooms casino=casino-room.html|TITLE|entry-still.jpg|entry-depth.png,...] [--out path.html]');
let html;
const rooms = {}; for (const p of String(args.rooms || '').split(',').filter(Boolean)) { const [slug, rest] = p.split('='); const [src, title, still, depth] = String(rest || '').split('|'); rooms[slug] = { src, title, ...(still ? { still } : {}), ...(depth ? { depth } : {}) }; }
try { html = buildTestnetViewHtml({ rooms, world, posters, screen: args.screen || process.env.XA_SCREEN || '', scores: args.scores || process.env.XA_SCORES || '', registry: args.registry || process.env.XA_REGISTRY || '', games: args.games || process.env.XA_GAMES || '', core: args.core || process.env.XA_CORE || '', roomId: args.room || 'arcade-hall', ...(args.hall ? { hallHtml: readFileSync(args.hall, 'utf8') } : {}) }); } catch (e) { die(e.message); }
// a way into the ad-renting page when the screen contract is shown (a link outside the hall; the hall itself is unchanged)
if (args.screen || process.env.XA_SCREEN) {
  const btn = '<a id="xa-ads-link" href="/arcade-world-preview/testnet-ads.html" title="Rent a slot on the arcade screen (testnet)" style="position:fixed;right:10px;bottom:4px;z-index:2147483000;color:#8fa7b0;opacity:.55;font:11px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.04em;padding:2px 4px;text-decoration:none;text-shadow:0 1px 2px #000" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.55">Advertise on screen \u2013 click here</a>';
  html = html.includes('</body>') ? html.replace('</body>', () => btn + '</body>') : html + btn;
}
const out = args.out || join(dirname(fileURLToPath(import.meta.url)), 'out', 'testnet-view.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`written: ${out}\nOpen it in a browser; it reads ${world} and ${posters} from the Hiro testnet API.`);

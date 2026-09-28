#!/usr/bin/env node
// Fill minted inscription ids into the parent template.
//   node parent/fill-ids.mjs --css 1 --kit 2 --scores 3 --room 4 --snake 5 --blocks 6 --cave 7 --merge 8 --runner 9 --bricks 10 --drift 11 --stack 12 --hopper 13 --tiles 14 --merge2048 15 --defence 16 --muncher 17 --invaders 18 --helix 19
//   node parent/fill-ids.mjs --parent 8
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, 'xtrata-arcade-parent.template.html');
const keys = ['css', 'kit', 'scores', 'room', 'snake', 'blocks', 'cave', 'merge', 'runner', 'bricks', 'drift', 'stack', 'hopper', 'tiles', 'merge2048', 'defence', 'muncher', 'invaders', 'helix'];
const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : undefined; };
let html = readFileSync(file, 'utf8');
let changed = 0;
for (const k of keys) {
  const v = get(k);
  if (v === undefined) continue;
  if (!/^\d+$/.test(v) || Number(v) <= 0) throw new Error(`--${k} must be a positive inscription id`);
  const re = new RegExp(`(\\n\\s+${k}: )\\d+`);
  if (!re.test(html)) throw new Error(`moduleIds.${k} not found in template`);
  html = html.replace(re, `$1${v}`); changed++;
}
const parent = get('parent');
if (parent !== undefined) {
  if (!/^\d+$/.test(parent)) throw new Error('--parent must be an inscription id');
  html = html.replace(/parentTokenId: \d+/, `parentTokenId: ${parent}`); changed++;
}
if (!changed) { console.error('Nothing to fill. Pass --css/--kit/--scores/--room/--snake/--blocks/--cave/--merge/--runner/--bricks/--drift/--stack/--hopper/--tiles/--merge2048/--defence/--muncher/--invaders/--helix and/or --parent.'); process.exit(1); }
writeFileSync(file, html);
console.log(`Updated ${changed} value(s) in ${file}`);

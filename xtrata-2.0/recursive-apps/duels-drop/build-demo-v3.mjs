#!/usr/bin/env node
/**
 * Demo v3 = the v2 sealed-gameplan engine + Jim's REAL Space Renegade art:
 * fighters sliced from the compendium rosters (out-roster/), weapons sliced
 * from the Equipment & Gear sheet (out-sr/). Embeds the PNGs as data URIs
 * with their REAL sha256-derived stats.
 *
 * Usage: node build-demo-v3.mjs [--outfile ./demo-v3.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const OUTFILE = opt('outfile', './demo-v3.html');

const loadSet = (dir) => {
  const m = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const load = (e) => {
    const buf = readFileSync(join(dir, e.file));
    const sha = createHash('sha256').update(buf).digest('hex');
    if (sha !== e.sha256) throw new Error('hash drift ' + e.file);
    return { name: e.name, hash: e.sha256,
      svg: `<img src="data:image/png;base64,${buf.toString('base64')}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated">` };
  };
  return m;
};
const rosterM = JSON.parse(readFileSync('out-roster/manifest.json', 'utf8'));
const weaponsM = JSON.parse(readFileSync('out-sr/manifest.json', 'utf8'));
const toEntry = (dir) => (e, idx) => {
  const buf = readFileSync(join(dir, e.file));
  const sha = createHash('sha256').update(buf).digest('hex');
  if (sha !== e.sha256) throw new Error('hash drift ' + e.file);
  return { i: idx + 1, name: e.name, cls: e.name, hash: e.sha256,
    svg: `<img src="data:image/png;base64,${buf.toString('base64')}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated">` };
};
const fighters = rosterM.fighters.map(toEntry('out-roster'));
const weapons = weaponsM.weapons.map(toEntry('out-sr'));

const PERSONA = {
  'Space Renegade': { w: [4, 3, 3], curve: 'flat' },
  'Rocket Jim': { w: [6, 1, 3], curve: 'front' },
  'Beard Barbarian': { w: [7, 2, 1], curve: 'front' },
  'Tentacle Wrangler': { w: [2, 3, 5], curve: 'late' },
  'Professor Renegade': { w: [2, 5, 3], curve: 'late' },
  'Disco Voidwalker': { w: [3, 2, 5], curve: 'flat' },
  'Captain Catastrophe': { w: [6, 2, 2], curve: 'front' },
  'The Last Roadie': { w: [3, 5, 2], curve: 'flat' },
  'Neon Noir Renegade': { w: [3, 3, 4], curve: 'late' },
  'Emperor of Absolutely Nothing': { w: [5, 4, 1], curve: 'front' },
  'Moon-Pirate Jim': { w: [5, 1, 4], curve: 'flat' },
  'Temporal Double': { w: [3, 3, 4], curve: 'late' }
};
const TWINS = ['Jim #361 (the photo)', 'Jim #2759 (the artwork)', 'Bitcoin Pepe #77'].map((name, idx) => ({
  i: idx + 1, name,
  img: idx === 0 ? 'https://xtrata.xyz/i/361' : idx === 1 ? 'https://xtrata.xyz/i/2759' : '',
  emoji: ['📸', '🎨', '🐸'][idx],
  hash: createHash('sha256').update('demo-twin:' + name).digest('hex')
}));

// Reuse the v2 page verbatim, swapping in the new DATA payload and copy.
let v2src = readFileSync('build-demo-v2.mjs', 'utf8');
const htmlStart = v2src.indexOf('const html = `');
let html = v2src.slice(htmlStart + 'const html = `'.length, v2src.lastIndexOf('`;'));
// substitute the template's ${DATA} with our payload
const DATA = JSON.stringify({ fighters, weapons, twins: TWINS, personas: PERSONA });
html = html.replace('${DATA}', () => DATA);
// The raw slice keeps template-literal escapes (\\' etc); collapse them the
// way the template literal itself would have.
html = html.replace(/\\\\/g, '\\');
html = html.replace('DEMO v2 — SEALED GAMEPLANS · real drop stats · simulated chain',
  'DEMO v3 — SEALED GAMEPLANS · REAL SPACE RENEGADE ART · real hash stats · simulated chain');
writeFileSync(OUTFILE, html);
console.log('demo v3 written:', OUTFILE, (Buffer.byteLength(html) / 1024 / 1024).toFixed(2), 'MB');

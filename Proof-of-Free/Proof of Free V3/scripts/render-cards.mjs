#!/usr/bin/env node
/* Render the campaign cards to PNG files ready to post.
 *
 *   node scripts/serve.mjs &            # or npm run serve, in another shell
 *   node scripts/render-cards.mjs       # writes apps/campaign/out/*.png
 *
 * Uses headless Chrome rather than a screenshot tool so the output is exactly
 * 1200x1200 (X's square slot) with no scaling. The family sheet is 1600x900 and
 * gets a longer virtual-time budget because it runs three live engine canvases.
 */
import { execFile } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'apps/campaign/out');
const BASE = process.env.BASE_URL || 'http://localhost:8190';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// [filename, url-fragment, width, height, settle-ms]
const SQUARE = [1200, 1200, 1200];
const CARDS = [
  ['A1-zero',        'cards.html#zero',       ...SQUARE],
  ['A1-made33',      'cards.html#made33',     ...SQUARE],
  ['A3-name',        'cards.html#name',       ...SQUARE],
  ['C1-pof',         'cards.html#pof',        ...SQUARE],
  ['C1-rule',        'cards.html#rule',       ...SQUARE],
  ['C1-terms',       'cards.html#terms',      ...SQUARE],
  ['D-remain-31',    'cards.html?n=31#remain', ...SQUARE],
  ['D-remain-22',    'cards.html?n=22#remain', ...SQUARE],
  ['D-remain-9',     'cards.html?n=9#remain',  ...SQUARE],
  ['D-single',       'cards.html#single',     ...SQUARE],
  ['E1-gone',        'cards.html#gone',       ...SQUARE],
  ['E1-names33',     'cards.html#names33',    ...SQUARE],
  ['F1-bytes',       'cards.html#bytes',      ...SQUARE],
  ['F5-discount',    'cards.html#discount',   ...SQUARE],
  ['F7-tail',        'cards.html#tail',       ...SQUARE],
  ['F7-tailtext',    'cards.html#tailtext',   ...SQUARE],
  ['FX-ghost',       'cards.html#ghost',      ...SQUARE],
  // Live engine renders — need time for the canvas to reach its open state.
  ['F3-families',    'families.html',         1600, 900, 6000],
  ['F3-families-sq', 'families.html',         1200, 1200, 6000]
];

mkdirSync(OUT, { recursive: true });
if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_PATH.`);
  process.exit(1);
}

const probe = await fetch(`${BASE}/apps/campaign/cards.html`).catch(() => null);
if (!probe?.ok) {
  console.error(`No server at ${BASE}. Start one first:  npm run serve`);
  process.exit(1);
}

for (const [name, path, w, h, settle] of CARDS) {
  const file = join(OUT, `${name}.png`);
  await run(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--window-size=${w},${h}`,
    `--screenshot=${file}`,
    `--virtual-time-budget=${settle}`,
    `${BASE}/apps/campaign/${path}`
  ]).catch(e => { console.error(`  ${name}: ${e.message.split('\n')[0]}`); });
  const ok = existsSync(file);
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name.padEnd(16)} ${w}x${h}  ${ok ? Math.round(statSync(file).size / 1024) + ' KB' : ''}`);
}

console.log(`\n${readdirSync(OUT).filter(f => f.endsWith('.png')).length} cards -> apps/campaign/out/`);

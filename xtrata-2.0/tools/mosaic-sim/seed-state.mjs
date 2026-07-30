// Build a scenario into ./state.
//
//   node tools/mosaic-sim/seed-state.mjs <scenario>
//
// Scenarios exist so the mosaic can be pointed at states that are impossible to
// reproduce on mainnet — which is most of the value here. The broken ones are not
// hypothetical: each corresponds to a failure the plan is trying to prevent.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, 'state');
const SLUG = 'demo';
const SUPPLY = 1024;

// Deterministic pseudo-random so a scenario is reproducible; the real seeds come from a
// fixed curated list, and this stands in for one.
let s = 12345;
const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const seedFor = (i) => Math.floor(rnd() * 0xffffff).toString(16).padStart(6, '0') + i.toString(16);

const content = (i, seed = seedFor(i)) =>
  `xtrata:seed/${SLUG}/${String(i).padStart(4, '0')}:${seed}`;

const scenarios = {
  /** Launch day: everything minted, nothing sold. */
  launch: () => ({ treasury: range(0, SUPPLY), released: [] }),

  /** One sale. The first thing anyone will actually look at. */
  'first-sale': () => ({ treasury: range(0, SUPPLY).filter((i) => i !== 417), released: [417] }),

  /** Halfway, sold in a scattered order — NOT a contiguous prefix. */
  half: () => {
    const out = range(0, SUPPLY).filter((i) => (i * 7) % 13 < 6);
    return { treasury: range(0, SUPPLY).filter((i) => !out.includes(i)), released: out };
  },

  /** Sold out. */
  'sold-out': () => ({ treasury: [], released: range(0, SUPPLY) }),

  /** Nothing minted at all — the mosaic before the wizard has run. */
  empty: () => ({ treasury: [], released: [] }),

  // ---- states that should never happen, and must not render as if fine ----

  /** A HOLE: item 500 never minted, everything else did. */
  hole: () => ({ treasury: range(0, SUPPLY).filter((i) => i !== 500), released: [] }),

  /** A TWIN: index 417 in both folders — the retry-mints-a-duplicate failure. */
  twin: () => ({ treasury: range(0, SUPPLY), released: [417] }),

  /** A STRAY: index 2000 exists, beyond maxSupply and not in the list. */
  stray: () => ({ treasury: [...range(0, 20), 2000], released: [] }),

  /** Only the tail minted — nothing at index 0, which naive loops assume exists. */
  'tail-only': () => ({ treasury: range(1000, SUPPLY), released: [] }),

  /** Content that does not match the namespace — a malformed row got inscribed. */
  malformed: () => ({ treasury: range(0, 10), released: [], malformed: [3] })
};

function range(a, b) { const o = []; for (let i = a; i < b; i++) o.push(i); return o; }

const name = process.argv[2];
if (!name || !scenarios[name]) {
  console.log('scenarios:\n  ' + Object.keys(scenarios).join('\n  '));
  process.exit(name ? 1 : 0);
}

const { treasury, released, malformed = [] } = scenarios[name]();

rmSync(ROOT, { recursive: true, force: true });
mkdirSync(join(ROOT, 'treasury'), { recursive: true });
mkdirSync(join(ROOT, 'released'), { recursive: true });

const write = (dir, i) => writeFileSync(
  join(ROOT, dir, String(i).padStart(4, '0')),
  malformed.includes(i) ? `seed-${i}-with-no-namespace` : content(i)
);
treasury.forEach((i) => write('treasury', i));
released.forEach((i) => write('released', i));

// Mint order is deliberately NOT collection order: the wizard mints in whatever order it
// gets to items, so anything that assumes get-minted-id(0) is item 0 breaks here first.
const minted = [...treasury, ...released];
const order = [...minted].sort((a, b) => ((a * 31) % 101) - ((b * 31) % 101));
writeFileSync(join(ROOT, 'mint-order.json'), JSON.stringify(order));

writeFileSync(join(ROOT, 'config.json'), JSON.stringify({
  slug: SLUG,
  maxSupply: SUPPLY,
  // Stand-ins for the engine and mosaic token ids the canary will produce.
  defaultDependencies: [2901, 2902],
  finalized: false,
  holders: Object.fromEntries(released.map((i, n) => [
    String(i), n % 2 ? 'SP2W89C1HN0PWSPG3XBWXK05WD5K1TF2XJAJXD05P' : 'SP375JPMEK68R41TNPWRSAM0H00DRV5E99JSC5K6Y'
  ]))
}, null, 2));

console.log(`scenario "${name}": ${treasury.length} in treasury, ${released.length} released` +
  (malformed.length ? `, ${malformed.length} malformed` : ''));

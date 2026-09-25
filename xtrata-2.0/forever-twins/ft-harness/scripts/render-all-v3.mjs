#!/usr/bin/env node
// Render every simnet v3 helper instance used by sim/family-suite-v3.mjs.
// Simnet payees are fixed receive-only test addresses (nobody holds their keys).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './render-helper-v3.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SIMNET_PAYEES = JSON.parse(readFileSync(join(ROOT, 'scripts/simnet-payees.json'), 'utf8'));
const base = {
  master: '.xtrata-v3-2-3', payees: SIMNET_PAYEES, initialFeeUstx: 1000000, maxFeeUstx: 5000000,
  rescueEnabled: true, rescueDelayBurnBlocks: 3, profileTier: 'S',
};
const out = (name, cfg) => {
  writeFileSync(join(ROOT, 'contracts/rendered', `${name}.clar`), render({ ...base, ...cfg }));
  console.log(`rendered ${name} (v3 ${cfg.group})`);
};

// the two sources that already have simnet v2 configs, when present in this checkout
for (const [f, name] of [['simnet-zombie-wabbits', 'ft3-zombie-wabbits'], ['simnet-gamma-pepe', 'ft3-gamma-pepe']]) {
  const p = join(ROOT, 'scripts/configs', `${f}.json`);
  if (!existsSync(p)) continue;
  const c = JSON.parse(readFileSync(p, 'utf8'));
  out(name, { collectionKey: c.collectionKey, source: c.source, sourceAsset: c.sourceAsset,
              group: c.group ?? (f === 'simnet-gamma-pepe' ? 'G2' : 'G1'), listingReadFn: c.listingReadFn });
}
for (const s of JSON.parse(readFileSync(join(ROOT, 'scripts/legacy-sources.json'), 'utf8')).sources)
  out(`ft3-${s.name}`, { collectionKey: s.name, source: `.${s.name}`, sourceAsset: s.asset, group: s.group });
out('ft3-leaky-g1', { collectionKey: 'leaky-g1', source: '.mock-leaky-market', sourceAsset: 'leaky', group: 'G1' });
out('ft3-leaky-g2', { collectionKey: 'leaky-g2', source: '.mock-leaky-market', sourceAsset: 'leaky', group: 'G2' });

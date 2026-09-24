#!/usr/bin/env node
// Render every simnet helper instance used by the suites.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './render-helper.mjs';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (name, cfg) => { writeFileSync(join(ROOT, 'contracts/rendered', `${name}.clar`), render(cfg)); console.log(`rendered ${name} (${cfg.group})`); };
const base = { master: '.xtrata-v3-2-3', maxFeeUstx: 5000000, rescueEnabled: true, rescueDelayBurnBlocks: 3, profileTier: 'S' };
for (const f of ['simnet-zombie-wabbits', 'simnet-gamma-pepe']) {
  const c = JSON.parse(readFileSync(join(ROOT, 'scripts/configs', `${f}.json`), 'utf8'));
  out(f === 'simnet-zombie-wabbits' ? 'ft2-zombie-wabbits' : 'ft2-gamma-pepe', c);
}
for (const s of JSON.parse(readFileSync(join(ROOT, 'scripts/legacy-sources.json'), 'utf8')).sources)
  out(`ft2-${s.name}`, { ...base, collectionKey: s.name, source: `.${s.name}`, sourceAsset: s.asset, group: s.group });
out('ft2-leaky-g1', { ...base, collectionKey: 'leaky-g1', source: '.mock-leaky-market', sourceAsset: 'leaky', group: 'G1' });
out('ft2-leaky-g2', { ...base, collectionKey: 'leaky-g2', source: '.mock-leaky-market', sourceAsset: 'leaky', group: 'G2' });

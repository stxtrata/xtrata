import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The .clar.tpl files under src/assets are copies of the canonical contract
 * sources in rebuild/contracts. The canary deploys the copies and reports them
 * as source-verified, so a copy that has drifted from the contract the test
 * suite exercises would deploy stale code under a passing verification.
 *
 * Nothing else detects this: canary stage 1 validates template markers, not
 * provenance. If this test fails, re-copy the contract — do not edit the .tpl.
 */
const PAIRS = [
  ['xtrata-collection-v3', '../xtrata-collection-v3.clar.tpl', '../../../../contracts/contracts/xtrata-collection-v3.clar'],
  ['xtrata-drops-v3', '../xtrata-drops-v3.clar.tpl', '../../../../contracts/contracts/xtrata-drops-v3.clar']
] as const;

describe('bundled contract sources match rebuild/contracts', () => {
  it.each(PAIRS)('%s asset is byte-identical to the canonical contract', (name, assetPath, contractPath) => {
    const asset = readFileSync(new URL(assetPath, import.meta.url), 'utf8');
    const canonical = readFileSync(new URL(contractPath, import.meta.url), 'utf8');

    expect(
      asset === canonical,
      `${name}: src/assets copy has drifted from rebuild/contracts/contracts/${name}.clar. ` +
        'Re-copy the contract source into src/assets rather than editing the .tpl.'
    ).toBe(true);
  });
});

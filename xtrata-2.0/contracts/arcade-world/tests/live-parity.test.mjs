// The mainnet files must be the simnet files with only the tagged core lines swapped.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toLive, NAMES, CORE } from '../scripts/make-live.mjs';

for (const n of NAMES) {
  test(`${n}: live file matches the generator and differs only on tagged lines`, () => {
    const sim = readFileSync(`contracts/${n}.clar`, 'utf8');
    const live = readFileSync(`../live/${n}.clar`, 'utf8');
    assert.equal(live, toLive(sim), 'run: node scripts/make-live.mjs');
    const a = sim.split('\n'), b = live.split('\n');
    assert.equal(a.length, b.length);
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) continue;
      diff++;
      assert.ok(a[i].includes(';; @principal core'), `untagged line differs: ${i + 1}`);
      assert.ok(b[i].includes(CORE));
    }
    assert.equal(diff, 5, 'five tagged core calls');
    assert.ok(!live.includes('mock-xtrata-core'));
  });
}

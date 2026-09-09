import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { SHELL } from '../../packages/ui/shell.js';
import { applyGamePreset } from '../../packages/ui/game-presets.js';
import { normaliseRules, readyToOpen } from '../../packages/protocol/rules.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
const A = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
it.each(['community', 'first-two', 'friend'])('maps %s onto existing canonical rules', preset => {
  const dom = new JSDOM(SHELL.html); const doc = dom.window.document;
  applyGamePreset(doc, preset, A);
  const seat = (color: string) => (doc.getElementById(`rules-${color}`) as HTMLSelectElement).value;
  expect(seat('white')).toBe(preset === 'friend' ? 'named' : preset === 'community' ? 'anyone' : 'first-mover');
  if (preset === 'friend') {
    expect((doc.getElementById('rules-white-who') as HTMLInputElement).value).toBe(A);
    expect(readyToOpen({white: A, black: ''}).ready).toBe(false);
  } else {
    const draft = {white: seat('white'), black: seat('black'), ranked: false};
    expect(readyToOpen(draft).ready).toBe(true);
    expect(rulesHash(normaliseRules(draft))).toHaveLength(64);
  }
  dom.window.close();
});

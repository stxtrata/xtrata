import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
const root = new URL('../../harness/runtime/captured/2026-09-07/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
it('tests the recorded production runtime bytes, independently of a sibling checkout', () => {
  expect(manifest.source).toBe('https://xtrata.xyz/runtime/');
  expect(Object.keys(manifest.files)).toHaveLength(3);
  for (const [name, expected] of Object.entries(manifest.files)) {
    expect(createHash('sha256').update(readFileSync(new URL(name, root))).digest('hex')).toBe(expected);
  }
});

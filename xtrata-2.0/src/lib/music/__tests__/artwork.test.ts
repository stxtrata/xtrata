import { it, expect } from 'vitest';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const code = readFileSync(
  new URL('../../../../xtrata-agent-one/wizard/music-artwork.js', import.meta.url),
  'utf8'
);
it('preserves aspect ratio, never upscales, and flags excessive dimensions/bytes', () => {
  const window: any = {};
  vm.runInNewContext(code, { window });
  const a = window.XtrataMusicArtwork;
  expect(a.dimensions(3000, 1500, 512)).toEqual({ width: 512, height: 256 });
  expect(a.dimensions(64, 32, 512)).toEqual({ width: 64, height: 32 });
  expect(a.warnings(3000, 1500, 2 * 1048576)).toHaveLength(3);
  expect(a.warnings(512, 512, 75 * 1024)).toEqual([]);
  expect(a.profiles.tiny.edge).toBe(128);
});

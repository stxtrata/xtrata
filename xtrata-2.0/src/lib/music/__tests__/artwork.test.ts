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

// Tiny real GIFs: a 2-frame animation and a 1-frame still (4 x 4 px).
const ANIM =
  'R0lGODlhBAAEAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAABAAEAAAICQABCBxIsCCAgAAh+QQBCgABACwAAAAABAAEAIEAAP8AAAAAAAAAAAAICQABCBxIsCCAgAA7';
const STILL = 'R0lGODdhBAAEAIEAAP8AAAAAAAAAAAAAACwAAAAABAAEAAAICQABCBxIsCCAgAA7';
const bytes = (b64: string) => Uint8Array.from(Buffer.from(b64, 'base64'));

it('counts GIF frames without decoding, and treats unreadable data as not animated', () => {
  const window: any = {};
  vm.runInNewContext(code, { window });
  const a = window.XtrataMusicArtwork;
  expect(a.countGifFrames(bytes(ANIM))).toBe(2);
  expect(a.countGifFrames(bytes(STILL))).toBe(1);
  expect(a.countGifFrames(new Uint8Array([1, 2, 3]))).toBe(0);
  expect(a.countGifFrames(bytes(ANIM).subarray(0, 40))).toBeLessThan(2);
});

it('keeps an animated GIF byte-for-byte and never sends it through a canvas', async () => {
  const window: any = {};
  let canvasUsed = false;
  vm.runInNewContext(code, {
    window,
    createImageBitmap: async () => ({ width: 4, height: 4, close() {} }),
    document: { createElement: () => ((canvasUsed = true), {}) }
  });
  const a = window.XtrataMusicArtwork;
  const file = (b64: string) => {
    const u8 = bytes(b64);
    return { type: 'image/gif', size: u8.length, arrayBuffer: async () => u8.buffer };
  };
  const anim = file(ANIM);
  for (const preset of ['standard', 'small', 'tiny', 'detailed', 'original']) {
    const r = await a.optimise(anim, preset);
    expect(r.file).toBe(anim);
    expect(r.animated).toBe(true);
    expect(r.warnings[0]).toMatch(/Animated GIF/);
  }
  expect(canvasUsed).toBe(false);
  expect((await a.inspect(anim)).animated).toBe(true);
  expect((await a.inspect(file(STILL))).animated).toBe(false);
});

it('still rejects formats that are not raster images the player can show', async () => {
  const window: any = {};
  vm.runInNewContext(code, {
    window,
    createImageBitmap: async () => ({ width: 1, height: 1, close() {} })
  });
  const a = window.XtrataMusicArtwork;
  await expect(a.inspect({ type: 'image/svg+xml', size: 10 })).rejects.toThrow(
    /PNG, JPEG, WebP or GIF/
  );
  await expect(a.inspect({ type: 'application/pdf', size: 10 })).rejects.toThrow();
});

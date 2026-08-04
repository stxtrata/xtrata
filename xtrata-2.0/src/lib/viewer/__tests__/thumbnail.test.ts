// @vitest-environment happy-dom
// The decoder touches document.createElement('canvas') and Image, so this file
// needs a DOM. The repo default is `node` (vitest.config.ts).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createImageThumbnail } from '../thumbnail';

/**
 * `createImageBitmap` cannot decode SVG. Chrome throws
 * "The source image could not be decoded." for every `image/svg+xml` blob,
 * because a bitmap decode has no step that resolves an SVG's intrinsic size.
 *
 * The decoder used to reach its <img> fallback only when `createImageBitmap`
 * was *undefined*, never when it *threw* — so every SVG inscription failed to
 * thumbnail, and a market page full of them logged one failure per card.
 * These tests pin the fall-through so that cannot come back.
 */

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="512" height="512"><rect width="16" height="16" fill="red"/></svg>';

/** Stand in for a canvas that records what it was asked to draw. */
const stubCanvas = () => {
  const drawn: unknown[] = [];
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({
      clearRect: () => {},
      drawImage: (source: unknown) => drawn.push(source),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    }),
    toBlob: (cb: (b: Blob | null) => void) => cb(new Blob([new Uint8Array([1, 2, 3])], { type: 'image/webp' }))
  } as unknown as HTMLCanvasElement;
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) =>
    tag === 'canvas' ? canvas : document.createElementNS('http://www.w3.org/1999/xhtml', tag)) as never);
  return { canvas, drawn };
};

/** An <img> that loads successfully with an intrinsic size, like a real SVG. */
const stubImageElement = (width = 512, height = 512) => {
  class FakeImage {
    decoding = 'auto';
    naturalWidth = width;
    naturalHeight = height;
    width = width;
    height = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_value: string) {
      queueMicrotask(() => this.onload?.());
    }
  }
  vi.stubGlobal('Image', FakeImage);
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('thumbnail decoding falls back when createImageBitmap cannot cope', () => {
  it('produces a thumbnail for SVG even though createImageBitmap throws on it', async () => {
    // Exactly the live failure: the real browser error message, on the real path.
    const bitmap = vi
      .fn()
      .mockRejectedValue(new Error('The source image could not be decoded.'));
    vi.stubGlobal('createImageBitmap', bitmap);
    vi.stubGlobal('URL', { ...URL, createObjectURL: () => 'blob:svg', revokeObjectURL: () => {} });
    stubImageElement();
    stubCanvas();

    const result = await createImageThumbnail({
      bytes: new TextEncoder().encode(SVG),
      mimeType: 'image/svg+xml'
    });

    expect(bitmap).toHaveBeenCalledOnce(); // it was tried
    expect(result?.data?.length).toBeGreaterThan(0); // and the fallback delivered
  });

  it('still uses createImageBitmap when it works, so rasters stay off the main thread', async () => {
    const close = vi.fn();
    const bitmap = vi.fn().mockResolvedValue({ width: 64, height: 64, close });
    vi.stubGlobal('createImageBitmap', bitmap);
    stubCanvas();

    const result = await createImageThumbnail({
      bytes: new Uint8Array([137, 80, 78, 71]),
      mimeType: 'image/png'
    });

    expect(bitmap).toHaveBeenCalledOnce();
    expect(result?.data?.length).toBeGreaterThan(0);
    expect(close).toHaveBeenCalled(); // and it is released
  });

  it('rejects when both paths fail, rather than returning a broken thumbnail', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('nope')));
    vi.stubGlobal('URL', { ...URL, createObjectURL: () => 'blob:bad', revokeObjectURL: () => {} });
    class BrokenImage {
      decoding = 'auto';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_v: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }
    vi.stubGlobal('Image', BrokenImage);
    stubCanvas();

    await expect(
      createImageThumbnail({ bytes: new Uint8Array([0, 1, 2]), mimeType: 'image/png' })
    ).rejects.toThrow(/decode failed/i);
  });
});

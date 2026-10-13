import { describe, expect, it, vi } from 'vitest';
import { coverUrlFor, maybeUploadSongThumbnail } from '../song-thumbnail.js';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==';
const player = (img: string) =>
  `<html><script id="xtrata-music-metadata" type="application/json">${JSON.stringify({
    schema: 'xtrata-music', assetType: 'song', title: 'Roar Kitty Roar', artist: 'Thommy'
  })}</script>${img}</html>`;
const bytes = (s: string) => new TextEncoder().encode(s);
const thumb = { blob: new Blob(['x'], { type: 'image/webp' }), w: 200, h: 256 };
let n = 1000;

describe('maybeUploadSongThumbnail', () => {
  it('posts the embedded cover for a song with no thumbnail', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    const encode = vi.fn().mockResolvedValue(thumb);
    const r = await maybeUploadSongThumbnail({
      contractId: CONTRACT, tokenId: n++, mimeType: 'text/html', hasThumb: false, fetchImpl, encode,
      bytes: bytes(player(`<img id="coverArt" src="data:image/png;base64,${PNG}">`))
    });
    expect(r).toBe('stored');
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toContain(`/thumb/${encodeURIComponent(CONTRACT)}/`);
    expect(url).toContain('title=Roar+Kitty+Roar');
    expect(init.method).toBe('POST');
  });

  it('fetches artwork that is a separate inscription', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(new Blob([PNG], { type: 'image/png' })))
      .mockResolvedValueOnce(new Response('{}', { status: 201 }));
    const r = await maybeUploadSongThumbnail({
      contractId: CONTRACT, tokenId: n++, mimeType: 'text/html', hasThumb: false, fetchImpl,
      encode: vi.fn().mockResolvedValue(thumb),
      bytes: bytes(player('<img src="https://xtrata.xyz/inscription/777">'))
    });
    expect(fetchImpl.mock.calls[0][0]).toBe('/inscription/777');
    expect(r).toBe('stored');
  });

  it('does nothing when a thumbnail exists, for non-songs, non-HTML and repeats', async () => {
    const fetchImpl = vi.fn();
    const encode = vi.fn();
    const song = bytes(player(`<img id="coverArt" src="data:image/png;base64,${PNG}">`));
    const base = { contractId: CONTRACT, fetchImpl, encode };
    expect(await maybeUploadSongThumbnail({ ...base, tokenId: n++, mimeType: 'text/html', hasThumb: true, bytes: song })).toBe('skipped');
    expect(await maybeUploadSongThumbnail({ ...base, tokenId: n++, mimeType: 'image/png', hasThumb: false, bytes: song })).toBe('skipped');
    expect(await maybeUploadSongThumbnail({ ...base, tokenId: n++, mimeType: 'text/html', hasThumb: false, bytes: bytes('<html>a game</html>') })).toBe('skipped');
    const id = n++;
    fetchImpl.mockResolvedValue(new Response('{}', { status: 201 }));
    encode.mockResolvedValue(thumb);
    await maybeUploadSongThumbnail({ ...base, tokenId: id, mimeType: 'text/html', hasThumb: false, bytes: song });
    expect(await maybeUploadSongThumbnail({ ...base, tokenId: id, mimeType: 'text/html', hasThumb: false, bytes: song })).toBe('skipped');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('never throws', async () => {
    const r = await maybeUploadSongThumbnail({
      contractId: CONTRACT, tokenId: n++, mimeType: 'text/html', hasThumb: false,
      fetchImpl: vi.fn().mockRejectedValue(new Error('offline')),
      encode: vi.fn().mockResolvedValue(thumb),
      bytes: bytes(player(`<img id="coverArt" src="data:image/png;base64,${PNG}">`))
    });
    expect(r).toBe('failed');
  });
});

describe('coverUrlFor', () => {
  it('builds site urls', () => {
    expect(coverUrlFor({ tokenId: 5, contractId: null })).toBe('/inscription/5');
    expect(coverUrlFor({ tokenId: 5, contractId: 'SP1.abc' })).toBe('/runtime/content?contractId=SP1.abc&tokenId=5');
    expect(coverUrlFor(null)).toBeNull();
  });
});

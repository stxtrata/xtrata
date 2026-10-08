import { describe, expect, it, vi } from 'vitest';
import {
  THUMBNAIL_MAX_TEXT,
  cleanThumbnailText,
  isThumbnailVersion,
  loadThumbnailInfo,
  parseThumbnailRequest,
  thumbnailKey,
  thumbnailVersionFor
} from '../thumbnails';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

describe('parseThumbnailRequest', () => {
  it('accepts a real contract and token id', () => {
    expect(parseThumbnailRequest(CONTRACT, '3058')).toEqual({ contractId: CONTRACT, tokenId: 3058 });
  });

  it('rejects anything that could escape the R2 key or URL', () => {
    for (const contract of [
      '',
      'not-a-contract',
      `${CONTRACT}/../x`,
      `${CONTRACT}?a=1`,
      `${CONTRACT}%2f..`,
      'SP3JNS.x y',
      undefined,
      42
    ]) {
      expect(parseThumbnailRequest(contract, '1')).toBeNull();
    }
    // v2 has a token #0, so zero is a real id.
    expect(parseThumbnailRequest(CONTRACT, '0')).toEqual({ contractId: CONTRACT, tokenId: 0 });
    for (const id of ['-1', '1.5', 'abc', '', '12345678901', undefined]) {
      expect(parseThumbnailRequest(CONTRACT, id)).toBeNull();
    }
  });
});

describe('thumbnailVersionFor', () => {
  const info = (animated: number | null, version: string | null = 'abcdef0123456789') => ({
    version, title: '', artist: '', animated
  });
  it('lets a still picture use its thumbnail', () => {
    expect(thumbnailVersionFor(info(0), 'image/png')).toBe('abcdef0123456789');
  });
  it('keeps animated and unchecked pictures on their normal path', () => {
    expect(thumbnailVersionFor(info(1), 'image/gif')).toBeNull();
    expect(thumbnailVersionFor(info(null), 'image/png')).toBeNull();
    expect(thumbnailVersionFor(info(null), 'IMAGE/WEBP')).toBeNull();
  });
  it('always gives a song its cover unless it is marked animated', () => {
    expect(thumbnailVersionFor(info(null), 'text/html')).toBe('abcdef0123456789');
    expect(thumbnailVersionFor(info(0), 'audio/mpeg')).toBe('abcdef0123456789');
    expect(thumbnailVersionFor(info(1), 'text/html')).toBeNull();
  });
  it('has nothing to offer without a version', () => {
    expect(thumbnailVersionFor(undefined, 'image/png')).toBeNull();
    expect(thumbnailVersionFor(info(0, null), 'image/png')).toBeNull();
  });
});

describe('thumbnailKey', () => {
  it('is stable and namespaced', () => {
    expect(thumbnailKey(CONTRACT, 12)).toBe(`thumbs/${CONTRACT}/12.webp`);
    expect(thumbnailKey(CONTRACT, '12')).toBe(thumbnailKey(CONTRACT, 12));
  });
});

describe('isThumbnailVersion', () => {
  it('accepts url-safe versions only', () => {
    expect(isThumbnailVersion('9f2c1ab4d0e57718')).toBe(true);
    expect(isThumbnailVersion('ab_-12')).toBe(true);
    expect(isThumbnailVersion('abc')).toBe(false);
    expect(isThumbnailVersion('a/b/c/d')).toBe(false);
    expect(isThumbnailVersion('a b c d')).toBe(false);
    expect(isThumbnailVersion(null)).toBe(false);
  });
});

describe('cleanThumbnailText', () => {
  it('removes control and direction characters and collapses whitespace', () => {
    expect(cleanThumbnailText('  Night\u0000 Drive\n\n\tmix‮  ')).toBe('Night Drive mix');
  });

  it('caps the length by characters, not bytes', () => {
    const long = '\u{1F3B5}'.repeat(THUMBNAIL_MAX_TEXT + 50);
    expect(Array.from(cleanThumbnailText(long))).toHaveLength(THUMBNAIL_MAX_TEXT);
  });

  it('returns an empty string for non-strings', () => {
    expect(cleanThumbnailText(null)).toBe('');
    expect(cleanThumbnailText({})).toBe('');
    expect(cleanThumbnailText(7)).toBe('');
  });

  it('leaves markup as plain characters; escaping is the display layer\'s job', () => {
    expect(cleanThumbnailText('<b>x</b>')).toBe('<b>x</b>');
  });
});

const dbReturning = (rows: unknown[]) => ({
  prepare: vi.fn(() => ({
    bind: vi.fn(() => ({ all: vi.fn(async () => ({ results: rows })) })),
    all: vi.fn(async () => ({ results: rows }))
  }))
});

describe('loadThumbnailInfo', () => {
  it('maps ready rows to a version and none rows to text only', async () => {
    const env = {
      DB: dbReturning([
        { contract_id: CONTRACT, token_id: 1, status: 'ready', etag: '9f2c1ab4d0e57718', title: 'A', artist: 'B' },
        { contract_id: CONTRACT, token_id: 2, status: 'none', etag: null, title: 'C', artist: '' },
        { contract_id: CONTRACT, token_id: 3, status: 'ready', etag: 'bad etag!', title: 'D', artist: '' }
      ])
    };
    const info = await loadThumbnailInfo(env as never, [CONTRACT], [1, 2, 3]);
    expect(info.get(`${CONTRACT}:1`)).toEqual({ version: '9f2c1ab4d0e57718', title: 'A', artist: 'B', animated: null });
    expect(info.get(`${CONTRACT}:2`)).toEqual({ version: null, title: 'C', artist: '', animated: null });
    // A ready row with a malformed etag must not produce a thumbnail URL.
    expect(info.get(`${CONTRACT}:3`)?.version).toBeNull();
  });

  it('cleans titles that came from untrusted files', async () => {
    const env = {
      DB: dbReturning([
        { contract_id: CONTRACT, token_id: 1, status: 'none', etag: null, title: 'x\u0000‮y', artist: 'a\nb' }
      ])
    };
    const info = await loadThumbnailInfo(env as never, [CONTRACT], [1]);
    expect(info.get(`${CONTRACT}:1`)).toEqual({ version: null, title: 'x y', artist: 'a b', animated: null });
  });

  it('returns nothing, without throwing, when the table is missing', async () => {
    const env = {
      DB: {
        prepare: vi.fn(() => ({
          bind: vi.fn(() => ({
            all: vi.fn(async () => {
              throw new Error('no such table: inscription_thumbnails');
            })
          }))
        }))
      }
    };
    await expect(loadThumbnailInfo(env as never, [CONTRACT], [1])).resolves.toEqual(new Map());
  });

  it('does not query for empty input', async () => {
    const db = dbReturning([]);
    await loadThumbnailInfo({ DB: db } as never, [], [1]);
    await loadThumbnailInfo({ DB: db } as never, [CONTRACT], []);
    expect(db.prepare).not.toHaveBeenCalled();
  });
});

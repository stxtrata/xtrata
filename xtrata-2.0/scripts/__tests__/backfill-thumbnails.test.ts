import { describe, expect, it, vi } from 'vitest';
import { cleanThumbnailText, thumbnailKey } from '../../functions/lib/thumbnails';
import {
  RADIO_CONTRACT,
  buildUpsertSql,
  cleanText,
  fetchCover,
  makeThumbnail,
  parseArgs,
  parseWranglerJson,
  sqlString,
  thumbKey
} from '../backfill-thumbnails.mjs';

const loadSharp = async () => {
  try {
    const mod = (await import('sharp')) as { default?: unknown };
    return (mod.default ?? mod) as (input: unknown, options?: unknown) => any;
  } catch {
    return null;
  }
};
const sharp = await loadSharp();

describe('rules shared with functions/lib/thumbnails.ts', () => {
  it('builds the same R2 key', () => {
    expect(thumbKey(RADIO_CONTRACT, 3058)).toBe(thumbnailKey(RADIO_CONTRACT, 3058));
  });

  it('cleans text the same way', () => {
    const samples = [
      '  Night\u0000 Drive\n\n\tmix‮  ',
      '<b>x</b>',
      '\u{1F3B5}'.repeat(300),
      'plain',
      '',
      'a​b⁦c'
    ];
    for (const sample of samples) expect(cleanText(sample)).toBe(cleanThumbnailText(sample));
    expect(cleanText(null)).toBe(cleanThumbnailText(null));
  });
});

describe('SQL building', () => {
  it('escapes quotes and drops NUL characters', () => {
    expect(sqlString("it's")).toBe("'it''s'");
    expect(sqlString('a\u0000b')).toBe("'ab'");
  });

  it('keeps an injection attempt inside one string literal', () => {
    const sql = buildUpsertSql({
      contractId: RADIO_CONTRACT,
      tokenId: 7,
      status: 'none',
      title: "x'); DROP TABLE inscription_thumbnails; --",
      artist: ''
    });
    expect(sql).toContain("'x''); DROP TABLE inscription_thumbnails; --'");
    // Outside string literals there is exactly one statement.
    const outsideStrings = sql.replace(/'(?:[^']|'')*'/g, "''");
    expect(outsideStrings.match(/;/g)).toHaveLength(1);
  });

  it('writes a ready row with its key, version and size', () => {
    const sql = buildUpsertSql({
      contractId: RADIO_CONTRACT,
      tokenId: 3058,
      status: 'ready',
      key: thumbKey(RADIO_CONTRACT, 3058),
      etag: '9f2c1ab4d0e57718',
      width: 256,
      height: 256,
      bytes: 9000,
      title: 'Night Drive',
      artist: 'Kay',
      now: 1_700_000_000_000
    });
    expect(sql).toContain("'ready'");
    expect(sql).toContain("'9f2c1ab4d0e57718'");
    expect(sql).toContain('1700000000000');
    expect(sql).toContain('ON CONFLICT(contract_id, token_id) DO UPDATE');
    expect(sql).not.toContain('WHERE inscription_thumbnails.status');
  });

  it('never lets a failure replace a stored thumbnail', () => {
    const failed = buildUpsertSql({ contractId: RADIO_CONTRACT, tokenId: 1, status: 'failed' });
    expect(failed).toContain("WHERE inscription_thumbnails.status <> 'ready'");
    const none = buildUpsertSql({ contractId: RADIO_CONTRACT, tokenId: 1, status: 'none' });
    expect(none).not.toContain('WHERE inscription_thumbnails.status');
  });

  it('rejects invalid input', () => {
    const base = { contractId: RADIO_CONTRACT, tokenId: 1, status: 'none' };
    expect(() => buildUpsertSql({ ...base, contractId: "x'; --" })).toThrow();
    expect(() => buildUpsertSql({ ...base, tokenId: 0 })).toThrow();
    expect(() => buildUpsertSql({ ...base, tokenId: 1.5 })).toThrow();
    expect(() => buildUpsertSql({ ...base, status: 'weird' })).toThrow();
    expect(() => buildUpsertSql({ ...base, status: 'ready' })).toThrow();
    expect(() => buildUpsertSql({ ...base, status: 'ready', key: 'k', etag: 'not-hex' })).toThrow();
  });
});

describe('parseArgs', () => {
  it('has safe defaults', () => {
    expect(parseArgs([])).toMatchObject({
      dryRun: false,
      force: false,
      limit: Infinity,
      token: null,
      concurrency: 3,
      origin: 'https://xtrata.xyz',
      db: 'xtrata-manage',
      bucket: 'xtrata-thumbnails'
    });
  });

  it('reads flags and values', () => {
    expect(
      parseArgs(['--dry-run', '--limit', '5', '--token', '3058', '--force', '--origin', 'https://x.test/'])
    ).toMatchObject({ dryRun: true, limit: 5, token: 3058, force: true, origin: 'https://x.test' });
  });

  it('rejects bad values and unknown flags', () => {
    expect(() => parseArgs(['--limit', '0'])).toThrow();
    expect(() => parseArgs(['--limit'])).toThrow();
    expect(() => parseArgs(['--token', 'abc'])).toThrow();
    expect(() => parseArgs(['--concurrency', '99'])).toThrow();
    expect(() => parseArgs(['--origin', 'http://insecure.test'])).toThrow();
    expect(() => parseArgs(['--nope'])).toThrow();
  });
});

describe('parseWranglerJson', () => {
  it('finds the JSON after banner lines', () => {
    const text = ' ⛅️ wrangler 4.65.0\n-------\n[\n  { "results": [{ "token_id": 1 }], "success": true }\n]\n';
    expect(parseWranglerJson(text)[0].results[0].token_id).toBe(1);
  });

  it('throws when there is no JSON', () => {
    expect(() => parseWranglerJson('nothing here')).toThrow();
  });
});

const imageResponse = (bytes: Uint8Array, type = 'image/png') =>
  new Response(bytes, { status: 200, headers: { 'content-type': type } });

describe('fetchCover', () => {
  it('reports a missing cover as none', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));
    await expect(fetchCover('https://xtrata.xyz', 5, fetchImpl as never)).resolves.toEqual({ kind: 'none' });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://xtrata.xyz/radio/artwork?id=5',
      expect.objectContaining({ redirect: 'manual' })
    );
  });

  it('returns the image bytes', async () => {
    const fetchImpl = vi.fn(async () => imageResponse(new Uint8Array([1, 2, 3])));
    const cover = await fetchCover('https://xtrata.xyz', 5, fetchImpl as never);
    expect(cover).toMatchObject({ kind: 'image', contentType: 'image/png' });
  });

  it('follows an https redirect to external artwork', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: 'https://img.example/cover.jpg' } }))
      .mockResolvedValueOnce(imageResponse(new Uint8Array([9]), 'image/jpeg'));
    const cover = await fetchCover('https://xtrata.xyz', 5, fetchImpl as never);
    expect(cover.kind).toBe('image');
    expect(fetchImpl.mock.calls[1][0]).toBe('https://img.example/cover.jpg');
  });

  it('refuses redirects to http or to addresses with credentials', async () => {
    for (const location of ['http://img.example/c.jpg', 'https://user:pw@img.example/c.jpg']) {
      const fetchImpl = vi.fn(async () => new Response(null, { status: 302, headers: { location } }));
      await expect(fetchCover('https://xtrata.xyz', 5, fetchImpl as never)).rejects.toThrow(/Refusing redirect/);
    }
  });

  it('stops after too many redirects', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 302, headers: { location: 'https://a.example/x' } }));
    await expect(fetchCover('https://xtrata.xyz', 5, fetchImpl as never)).rejects.toThrow(/Too many redirects/);
  });

  it('rejects svg, non-images, empty and oversized files', async () => {
    const svg = vi.fn(async () => imageResponse(new Uint8Array([1]), 'image/svg+xml'));
    const html = vi.fn(async () => new Response('<html>', { headers: { 'content-type': 'text/html' } }));
    const empty = vi.fn(async () => imageResponse(new Uint8Array()));
    const huge = vi.fn(async () => imageResponse(new Uint8Array(8 * 1024 * 1024 + 1)));
    for (const fetchImpl of [svg, html, empty, huge]) {
      await expect(fetchCover('https://xtrata.xyz', 5, fetchImpl as never)).rejects.toThrow();
    }
  });

  it('reports server errors as failures, not as "no cover"', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 500 }));
    await expect(fetchCover('https://xtrata.xyz', 5, fetchImpl as never)).rejects.toThrow(/HTTP 500/);
  });
});

describe.skipIf(!sharp)('makeThumbnail', () => {
  const makePng = (width: number, height: number) =>
    sharp!({ create: { width, height, channels: 3, background: { r: 200, g: 40, b: 90 } } }).png().toBuffer();

  it('turns a large cover into a small square WebP', async () => {
    const result = await makeThumbnail(await makePng(1200, 1200), sharp);
    expect(result.width).toBe(256);
    expect(result.height).toBe(256);
    expect(result.bytes.length).toBeLessThan(20 * 1024);
    expect(result.etag).toMatch(/^[0-9a-f]{16}$/);
    const meta = await sharp!(result.bytes).metadata();
    expect(meta.format).toBe('webp');
  });

  it('crops a wide cover to the centre square', async () => {
    const result = await makeThumbnail(await makePng(900, 300), sharp);
    expect(result.width).toBe(256);
    expect(result.height).toBe(256);
  });

  it('does not enlarge a small cover', async () => {
    const result = await makeThumbnail(await makePng(100, 100), sharp);
    expect(result.width).toBeLessThanOrEqual(100);
  });

  it('gives the same version for the same picture and a new one for a different picture', async () => {
    const a = await makeThumbnail(await makePng(600, 600), sharp);
    const b = await makeThumbnail(await makePng(600, 600), sharp);
    const c = await makeThumbnail(
      await sharp!({ create: { width: 600, height: 600, channels: 3, background: { r: 1, g: 2, b: 3 } } }).png().toBuffer(),
      sharp
    );
    expect(a.etag).toBe(b.etag);
    expect(a.etag).not.toBe(c.etag);
  });

  it('rejects data that is not an image', async () => {
    await expect(makeThumbnail(Buffer.from('not an image'), sharp)).rejects.toThrow();
  });
});

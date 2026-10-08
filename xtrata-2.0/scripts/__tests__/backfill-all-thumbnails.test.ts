import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script
import * as script from '../backfill-all-thumbnails.mjs';
// @ts-expect-error plain .mjs script
import { buildUpsertSql } from '../backfill-thumbnails.mjs';

const sharp = (await import('sharp')).default;
const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const png = (width: number, height: number, channels: 3 | 4 = 4) =>
  sharp({ create: { width, height, channels, background: { r: 200, g: 40, b: 90, alpha: 1 } } })
    .png()
    .toBuffer();

const FIXTURES: Record<string, string> = {"gif": "R0lGODlhCAAIAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAACAAIAAAIDwABCBxIsKDBgwgTKkwYEAAh+QQBCgABACwAAAAACAAIAIEAAP8AAAAAAAAAAAAIDwABCBxIsKDBgwgTKkwYEAA7", "webp": "UklGRoQAAABXRUJQVlA4WAoAAAACAAAABwAABwAAQU5JTQYAAAAAAAAAAABBTk1GKAAAAAAAAAAAAAcAAAcAAGQAAAJWUDhMDwAAAC8HwAEABxD9j/4HIqL/AQBBTk1GKAAAAAAAAAAAAAcAAAcAAGQAAABWUDhMDwAAAC8HwAEABxDR//4HIqL/AQA=", "apng": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACGFjVEwAAAACAAAAAPONk3AAAAAaZmNUTAAAAAAAAAAIAAAACAAAAAAAAAAAAAEACgAA8k66YgAAABZJREFUeJxj/M/A8J8BD2DCJzl8FAAAElsCDh9KSV0AAAAaZmNUTAAAAAEAAAAIAAAACAAAAAAAAAAAAAEACgAAaT1QtgAAABpmZEFUAAAAAnicY2Rg+P+fAQ9gwic5fBQAABBdAg7EQ+AwAAAAAElFTkSuQmCC", "png": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFklEQVR4nGP8z8DwnwEPYMInOXwUAAASWwIOH0pJXQAAAABJRU5ErkJggg==", "gifstill": "R0lGODdhCAAIAIEAAP8AAAAAAAAAAAAAACwAAAAACAAIAAAIDwABCBxIsKDBgwgTKkwYEAA7"};
const fixture = (name: string) => Buffer.from(FIXTURES[name], 'base64');

describe('classifyKind', () => {
  it('groups mime types into the kinds that decide how a thumbnail is made', () => {
    expect(script.classifyKind('image/png')).toBe('image');
    expect(script.classifyKind('image/webp')).toBe('image');
    expect(script.classifyKind('image/svg+xml')).toBe('svg');
    expect(script.classifyKind('text/html; charset=utf-8')).toBe('html');
    expect(script.classifyKind('audio/mpeg')).toBe('audio');
    expect(script.classifyKind('video/mp4')).toBe('video');
    expect(script.classifyKind('application/json')).toBe('text');
    expect(script.classifyKind('text/plain')).toBe('text');
    expect(script.classifyKind('application/pdf')).toBe('other');
    expect(script.classifyKind(null)).toBe('other');
  });
});

describe('isSafeSvg', () => {
  it('accepts a plain vector drawing', () => {
    expect(
      script.isSafeSvg('<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a"/></defs><rect fill="url(#a)" width="4" height="4"/></svg>')
    ).toBe(true);
  });
  it('accepts an embedded data image', () => {
    expect(script.isSafeSvg('<svg><image href="data:image/png;base64,AAAA"/></svg>')).toBe(true);
  });
  it.each([
    ['script', '<svg><script>alert(1)</script></svg>'],
    ['event handler', '<svg onload="x()"></svg>'],
    ['outside image', '<svg><image href="https://example.com/a.png"/></svg>'],
    ['local file', '<svg><image xlink:href="file:///etc/passwd"/></svg>'],
    ['css url', '<svg><rect style="fill:url(https://example.com/x)"/></svg>'],
    ['css import', '<svg><style>@import "x.css";</style></svg>'],
    ['entity', '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg>&x;</svg>'],
    ['foreignObject', '<svg><foreignObject><div/></foreignObject></svg>']
  ])('refuses %s', (_name, svg) => {
    expect(script.isSafeSvg(svg)).toBe(false);
  });
});

describe('makeImageThumbnail', () => {
  it('fits a large picture inside 256 without cropping', async () => {
    const out = await script.makeImageThumbnail(await png(1000, 500), sharp);
    expect(out.width).toBe(256);
    expect(out.height).toBe(128);
    expect(out.etag).toMatch(/^[0-9a-f]{16}$/);
    const meta = await sharp(out.bytes).metadata();
    expect(meta.format).toBe('webp');
  });

  it('keeps a small picture at its own size and does not blur it', async () => {
    // A 2x2 checker must come back as exactly those four pixels.
    const raw = Buffer.from([255, 0, 0, 255, 0, 0, 255, 255, 0, 0, 255, 255, 255, 0, 0, 255]);
    const input = await sharp(raw, { raw: { width: 2, height: 2, channels: 4 } }).png().toBuffer();
    const out = await script.makeImageThumbnail(input, sharp);
    expect([out.width, out.height]).toEqual([2, 2]);
    const decoded = await sharp(out.bytes).ensureAlpha().raw().toBuffer();
    expect([...decoded]).toEqual([...raw]);
  });

  it('never makes a picture bigger', async () => {
    const out = await script.makeImageThumbnail(await png(100, 60), sharp);
    expect([out.width, out.height]).toEqual([100, 60]);
  });

  it('rasterises an svg', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="red"/></svg>');
    const out = await script.makeImageThumbnail(svg, sharp, { svg: true });
    expect(out.width).toBeGreaterThan(0);
    expect(out.width).toBeLessThanOrEqual(256);
  });

  it('rejects a file that is not a picture', async () => {
    await expect(script.makeImageThumbnail(Buffer.from('not an image'), sharp)).rejects.toThrow();
  });
});

describe('fetchContent', () => {
  const reply = (body: Uint8Array, init: ResponseInit = {}) => async () => new Response(body, init);
  it('returns the bytes', async () => {
    const bytes = await script.fetchContent('https://x.test', CONTRACT, 5, 1000, reply(new Uint8Array([1, 2, 3])));
    expect([...bytes]).toEqual([1, 2, 3]);
  });
  it('asks the runtime content route', () => {
    expect(script.contentUrl('https://x.test', CONTRACT, 5)).toBe(
      `https://x.test/runtime/content?contractId=${encodeURIComponent(CONTRACT)}&tokenId=5&network=mainnet`
    );
  });
  it('refuses empty, failed and oversized replies', async () => {
    await expect(script.fetchContent('https://x.test', CONTRACT, 5, 1000, reply(new Uint8Array()))).rejects.toThrow(/Empty/);
    await expect(script.fetchContent('https://x.test', CONTRACT, 5, 1000, reply(new Uint8Array(1), { status: 502 }))).rejects.toThrow(/502/);
    await expect(script.fetchContent('https://x.test', CONTRACT, 5, 10, reply(new Uint8Array(50)))).rejects.toThrow(/Too large/);
  });
});

describe('coverage', () => {
  const rows = [
    { contract: CONTRACT, mime: 'image/png', total: 10, ready: 4, none: 1, failed: 2 },
    { contract: CONTRACT, mime: 'image/webp', total: 5, ready: 5, none: 0, failed: 0 },
    { contract: CONTRACT, mime: 'text/html', total: 7, ready: 3, none: 0, failed: 0 },
    { contract: 'SP2XBRCMNEZKDT5G2CVB8EXE4K9WZGJVB374XHSMX.xtrata-v1-1-1', mime: 'image/png', total: 3, ready: 0, none: 0, failed: 0 }
  ];
  it('rolls mime types up to kinds and counts what is missing', () => {
    const summary = script.summariseCoverage(rows);
    const image = summary.find((e: any) => e.contract === CONTRACT && e.kind === 'image');
    expect(image).toMatchObject({ total: 15, ready: 9, none: 1, failed: 2, missing: 5 });
    const html = summary.find((e: any) => e.kind === 'html');
    expect(html.missing).toBe(4);
  });
  it('prints one line per contract and kind plus a total', () => {
    const text = script.formatCoverage(script.summariseCoverage(rows));
    expect(text).toContain('xtrata-v3-2-3');
    expect(text).toContain('xtrata-v1-1-1');
    expect(text.split('\n').at(-1)).toMatch(/^ALL\s+25\s/);
  });
});

describe('SQL and options', () => {
  it('selects only missing or failed images by default', () => {
    const sql = script.buildMissingSql();
    expect(sql).toContain("t.status IS NULL OR t.status = 'failed'");
    expect(sql).toContain("i.mime LIKE 'image/%'");
  });
  it('--force drops the missing filter, filters validate their input', () => {
    expect(script.buildMissingSql({ force: true })).not.toContain('t.status IS NULL');
    expect(script.buildMissingSql({ contract: CONTRACT, token: 7 })).toContain('i.token_id = 7');
    expect(() => script.buildMissingSql({ contract: "x'; DROP TABLE a;--" })).toThrow();
    expect(() => script.buildMissingSql({ token: -1 })).toThrow();
  });
  it('accepts token 0, which exists on v2', () => {
    expect(script.buildMissingSql({ contract: CONTRACT, token: 0 })).toContain('i.token_id = 0');
    expect(script.parseArgs(['--token', '0']).token).toBe(0);
    expect(buildUpsertSql({ contractId: CONTRACT, tokenId: 0, status: 'failed', source: 'render' })).toContain('VALUES');
    expect(() => buildUpsertSql({ contractId: CONTRACT, tokenId: -1, status: 'failed' })).toThrow(/Invalid token id/);
  });
  it('records the source of generated thumbnails', () => {
    const sql = buildUpsertSql({
      contractId: CONTRACT, tokenId: 9, status: 'ready', key: 'thumbs/x/9.webp', etag: 'abcdef0123456789', source: 'render'
    });
    expect(sql).toContain("'render'");
    expect(() => buildUpsertSql({ contractId: CONTRACT, tokenId: 9, status: 'none', source: 'bad' })).toThrow(/source/);
  });
  it('parses and validates arguments', () => {
    expect(script.parseArgs(['--plan']).plan).toBe(true);
    expect(script.parseArgs([]).kinds).toEqual(['image', 'svg']);
    expect(script.parseArgs(['--kinds', 'image']).kinds).toEqual(['image']);
    expect(() => script.parseArgs(['--kinds', 'video'])).toThrow(/supports/);
    expect(() => script.parseArgs(['--limit', '0'])).toThrow();
    expect(() => script.parseArgs(['--max-bytes', '5'])).toThrow();
    expect(() => script.parseArgs(['--origin', 'http://x'])).toThrow();
    expect(() => script.parseArgs(['--nope'])).toThrow(/Unknown/);
  });
});

describe('animation detection', () => {
  it('finds real animated files and leaves still ones alone', async () => {
    expect(await script.detectAnimated(fixture('gif'), sharp)).toBe(true);
    expect(await script.detectAnimated(fixture('webp'), sharp)).toBe(true);
    expect(await script.detectAnimated(fixture('apng'), sharp)).toBe(true);
    expect(await script.detectAnimated(fixture('png'), sharp)).toBe(false);
    expect(await script.detectAnimated(fixture('gifstill'), sharp)).toBe(false);
  });
  it('reads an animated PNG from its header alone', () => {
    expect(script.isAnimatedPng(fixture('apng'))).toBe(true);
    expect(script.isAnimatedPng(fixture('apng').subarray(0, 60))).toBe(true);
    expect(script.isAnimatedPng(fixture('png'))).toBe(false);
    expect(script.isAnimatedPng(new Uint8Array([1, 2, 3]))).toBe(false);
    expect(script.isAnimatedPng(Buffer.from('not a png at all, just text'))).toBe(false);
  });
  it('reports the flag on the thumbnail it makes', async () => {
    expect((await script.makeImageThumbnail(fixture('gif'), sharp)).animated).toBe(true);
    expect((await script.makeImageThumbnail(fixture('png'), sharp)).animated).toBe(false);
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4"/></svg>');
    expect((await script.makeImageThumbnail(svg, sharp, { svg: true })).animated).toBeNull();
  });
  it('saves the flag with the row and never lets a cover re-run erase it', () => {
    const sql = buildUpsertSql({
      contractId: CONTRACT, tokenId: 4, status: 'ready', key: 'k', etag: 'abcdef0123456789', source: 'render', animated: 1
    });
    expect(sql).toContain('animated');
    expect(sql).toContain('COALESCE(excluded.animated, inscription_thumbnails.animated)');
    expect(() => buildUpsertSql({ contractId: CONTRACT, tokenId: 4, status: 'none', animated: 2 })).toThrow(/animated/);
  });
  it('builds the recheck queries safely', () => {
    const sql = script.buildUncheckedSql();
    expect(sql).toContain('t.animated IS NULL');
    expect(sql).toContain("t.status = 'ready'");
    expect(sql).toContain("i.mime NOT LIKE 'image/svg%'");
    expect(script.buildAnimatedUpdateSql({ contractId: CONTRACT, tokenId: 0, animated: 0 })).toContain('SET animated = 0');
    expect(() => script.buildAnimatedUpdateSql({ contractId: "x'; --", tokenId: 1, animated: 0 })).toThrow();
    expect(() => script.buildAnimatedUpdateSql({ contractId: CONTRACT, tokenId: 1, animated: 5 })).toThrow();
    expect(script.parseArgs(['--recheck-animated']).recheckAnimated).toBe(true);
  });
});

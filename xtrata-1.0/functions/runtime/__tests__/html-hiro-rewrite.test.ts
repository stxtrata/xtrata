import { describe, expect, it } from 'vitest';
import {
  isHtmlMimeType,
  isRawSourceRequested,
  rewriteHiroApiBasesInBytes,
  rewriteHiroApiBasesInText,
  shouldRewriteHiroBases
} from '../html-hiro-rewrite';

describe('rewriteHiroApiBasesInText', () => {
  it('rewrites mainnet hiro base to the site proxy', () => {
    const source =
      "const endpoint = `https://api.mainnet.hiro.so/v2/contracts/call-read/${addr}/${name}/get-owner`;";
    const result = rewriteHiroApiBasesInText(source, 'https://xtrata.xyz');
    expect(result.changed).toBe(true);
    expect(result.source).toContain('https://xtrata.xyz/hiro/mainnet/v2/contracts/call-read/');
    expect(result.source).not.toContain('api.mainnet.hiro.so');
  });

  it('rewrites testnet and legacy stacks.co bases', () => {
    const source =
      'fetch("https://api.testnet.hiro.so/extended/v1/tx"); fetch("https://stacks-node-api.mainnet.stacks.co/v2/info");';
    const result = rewriteHiroApiBasesInText(source, 'https://xtrata.xyz');
    expect(result.changed).toBe(true);
    expect(result.source).toContain('https://xtrata.xyz/hiro/testnet/extended/v1/tx');
    expect(result.source).toContain('https://xtrata.xyz/hiro/mainnet/v2/info');
  });

  it('rewrites every occurrence', () => {
    const source = Array.from(
      { length: 5 },
      (_, i) => `fetch('https://api.mainnet.hiro.so/v2/x${i}')`
    ).join('\n');
    const result = rewriteHiroApiBasesInText(source, 'https://xtrata.xyz');
    expect(result.source.match(/xtrata\.xyz\/hiro\/mainnet\/v2\/x/g)).toHaveLength(5);
  });

  it('reports unchanged when no hiro base is present', () => {
    const source = '<html><body>no api calls</body></html>';
    const result = rewriteHiroApiBasesInText(source, 'https://xtrata.xyz');
    expect(result.changed).toBe(false);
    expect(result.source).toBe(source);
  });
});

describe('rewriteHiroApiBasesInBytes', () => {
  it('round-trips utf-8 content', () => {
    const source = "const a = 'https://api.mainnet.hiro.so/v2/info'; // émoji ✓";
    const result = rewriteHiroApiBasesInBytes(new TextEncoder().encode(source), 'https://xtrata.xyz');
    expect(result.changed).toBe(true);
    const decoded = new TextDecoder().decode(result.bytes);
    expect(decoded).toContain("https://xtrata.xyz/hiro/mainnet/v2/info");
    expect(decoded).toContain('émoji ✓');
  });

  it('leaves non-utf8 bytes untouched', () => {
    const bytes = new Uint8Array([0xff, 0xfe, 0x00, 0xc1, 0x80]);
    const result = rewriteHiroApiBasesInBytes(bytes);
    expect(result.changed).toBe(false);
    expect(result.bytes).toBe(bytes);
  });
});

describe('shouldRewriteHiroBases', () => {
  const baseUrl = new URL('https://xtrata.xyz/runtime/content?tokenId=350');

  it('applies for full GET html responses', () => {
    expect(
      shouldRewriteHiroBases({
        requestUrl: baseUrl,
        mimeType: 'text/html; charset=utf-8',
        method: 'GET',
        isRangeResponse: false
      })
    ).toBe(true);
  });

  it('skips non-html mime types', () => {
    expect(
      shouldRewriteHiroBases({
        requestUrl: baseUrl,
        mimeType: 'application/javascript',
        method: 'GET',
        isRangeResponse: false
      })
    ).toBe(false);
  });

  it('skips range responses and HEAD requests', () => {
    expect(
      shouldRewriteHiroBases({
        requestUrl: baseUrl,
        mimeType: 'text/html',
        method: 'GET',
        isRangeResponse: true
      })
    ).toBe(false);
    expect(
      shouldRewriteHiroBases({
        requestUrl: baseUrl,
        mimeType: 'text/html',
        method: 'HEAD',
        isRangeResponse: false
      })
    ).toBe(false);
  });

  it('skips when raw source is requested', () => {
    const rawUrl = new URL('https://xtrata.xyz/runtime/content?tokenId=350&raw=1');
    expect(isRawSourceRequested(rawUrl)).toBe(true);
    expect(
      shouldRewriteHiroBases({
        requestUrl: rawUrl,
        mimeType: 'text/html',
        method: 'GET',
        isRangeResponse: false
      })
    ).toBe(false);
    expect(isRawSourceRequested(new URL('https://xtrata.xyz/i/350?raw=0'))).toBe(false);
  });
});

describe('isHtmlMimeType', () => {
  it('matches html with and without charset', () => {
    expect(isHtmlMimeType('text/html')).toBe(true);
    expect(isHtmlMimeType('text/html; charset=utf-8')).toBe(true);
    expect(isHtmlMimeType('image/png')).toBe(false);
    expect(isHtmlMimeType('')).toBe(false);
    expect(isHtmlMimeType(null)).toBe(false);
  });
});

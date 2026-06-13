import { describe, expect, it } from 'vitest';
import {
  containsDirectHiroApiBase,
  rewriteHiroApiBasesForEmbeddedHtml
} from '../hiro-api-rewrite';

describe('rewriteHiroApiBasesForEmbeddedHtml', () => {
  it('rewrites direct hiro bases to absolute same-site proxy URLs', () => {
    const html =
      '<script>fetch("https://api.mainnet.hiro.so/v2/contracts/call-read/SP1/board/get-owner")</script>';
    const result = rewriteHiroApiBasesForEmbeddedHtml(html, {
      origin: 'https://xtrata.xyz'
    });
    expect(result.changed).toBe(true);
    expect(result.html).toContain(
      'https://xtrata.xyz/hiro/mainnet/v2/contracts/call-read/SP1/board/get-owner'
    );
    expect(result.html).not.toContain('api.mainnet.hiro.so');
  });

  it('rewrites testnet and legacy bases', () => {
    const html =
      'fetch("https://api.testnet.hiro.so/extended/v1/tx");fetch("https://stacks-node-api.mainnet.stacks.co/v2/info");';
    const result = rewriteHiroApiBasesForEmbeddedHtml(html, {
      origin: 'https://xtrata.xyz'
    });
    expect(result.html).toContain('https://xtrata.xyz/hiro/testnet/extended/v1/tx');
    expect(result.html).toContain('https://xtrata.xyz/hiro/mainnet/v2/info');
  });

  it('returns unchanged html when nothing matches', () => {
    const html = '<html><body>plain</body></html>';
    const result = rewriteHiroApiBasesForEmbeddedHtml(html, {
      origin: 'https://xtrata.xyz'
    });
    expect(result.changed).toBe(false);
    expect(result.html).toBe(html);
  });
});

describe('containsDirectHiroApiBase', () => {
  it('detects direct hiro usage', () => {
    expect(containsDirectHiroApiBase('x https://api.mainnet.hiro.so/v2 y')).toBe(true);
    expect(containsDirectHiroApiBase('nothing here')).toBe(false);
  });
});

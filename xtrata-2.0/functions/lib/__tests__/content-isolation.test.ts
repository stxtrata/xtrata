import { describe, expect, it, vi } from 'vitest';
import {
  CONTENT_ISOLATION_CSP,
  CONTENT_ISOLATION_HEADER,
  contentIsolationGuard,
  inscriptionRefFromUrl,
  isDocumentCapableType,
  isExempt,
  isInscriptionContentPath,
  parseExemptions
} from '../content-isolation';
import { radioHostGuard } from '../radio-host';
import { readFileSync } from 'node:fs';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const html = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' };

const run = async (
  url: string,
  env: Record<string, unknown> = { INSCRIPTION_SANDBOX: '1' },
  headers: Record<string, string> = html,
  body: BodyInit | null = '<script>alert(1)</script>'
) => {
  const next = vi.fn(async () => new Response(body, { headers }));
  const res = await contentIsolationGuard({ request: new Request(url), env, next });
  return { res, next };
};

describe('content isolation guard', () => {
  it('is off by default, so merging it changes nothing', async () => {
    for (const env of [{}, { INSCRIPTION_SANDBOX: '0' }, { INSCRIPTION_SANDBOX: 'true' }, { INSCRIPTION_SANDBOX: '' }]) {
      const { res } = await run('https://xtrata.test/i/123', env);
      expect(res.headers.get('content-security-policy')).toBeNull();
      expect(res.headers.get(CONTENT_ISOLATION_HEADER)).toBeNull();
    }
  });

  it('sandboxes raw HTML and SVG on every content route when switched on', async () => {
    const urls = [
      'https://xtrata.test/i/123',
      'https://xtrata.test/inscription/123',
      `https://xtrata.test/inscription/mainnet/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/123`,
      `https://xtrata.test/runtime/content?contractId=${CONTRACT}&tokenId=123&network=mainnet`
    ];
    for (const url of urls) {
      for (const type of ['text/html', 'text/html; charset=utf-8', 'image/svg+xml', 'application/xhtml+xml', 'text/xml']) {
        const { res } = await run(url, undefined, { 'content-type': type });
        expect(res.headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
        expect(res.headers.get(CONTENT_ISOLATION_HEADER)).toBe('sandboxed');
      }
    }
  });

  it('never grants allow-same-origin or top navigation', () => {
    expect(CONTENT_ISOLATION_CSP).toMatch(/^sandbox /);
    expect(CONTENT_ISOLATION_CSP).not.toMatch(/allow-same-origin|allow-top-navigation|allow-popups|allow-forms|allow-modals/);
  });

  it('keeps the body, status and other headers intact', async () => {
    const { res } = await run('https://xtrata.test/i/9', undefined, { ...html, etag: '"abc"' }, '<p>hello</p>');
    expect(await res.text()).toBe('<p>hello</p>');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBe('"abc"');
    expect(res.headers.get('cache-control')).toBe('public, max-age=60');
  });

  it('leaves media, JSON, JS and raw-source responses alone', async () => {
    for (const type of ['image/png', 'audio/mpeg', 'video/mp4', 'application/json', 'text/javascript', 'text/plain', 'application/octet-stream', '']) {
      const { res } = await run('https://xtrata.test/i/123', undefined, type ? { 'content-type': type } : {});
      expect(res.headers.get('content-security-policy')).toBeNull();
    }
  });

  it('leaves the launcher, modules, pages and other routes alone', async () => {
    for (const path of ['/runtime/', '/runtime/?tokenId=1', '/runtime/wallet-shim.js', '/runtime/modules/mainnet/x', '/g/abc', '/', '/index/page', '/inscribe', '/image/1', '/info/1']) {
      const { res } = await run('https://xtrata.test' + path);
      expect(res.headers.get('content-security-policy')).toBeNull();
    }
  });

  it('exempts allowlisted tokens so they keep running as the main origin', async () => {
    const env = { INSCRIPTION_SANDBOX: '1', INSCRIPTION_SANDBOX_EXEMPT: '3111, 3068 #3069\n' + `${CONTRACT}:3072` };
    for (const url of [
      'https://xtrata.test/i/3111',
      'https://xtrata.test/inscription/3068',
      'https://xtrata.test/i/3069',
      `https://xtrata.test/runtime/content?contractId=${CONTRACT}&tokenId=3072`
    ]) {
      const { res } = await run(url, env);
      expect(res.headers.get('content-security-policy')).toBeNull();
      expect(res.headers.get(CONTENT_ISOLATION_HEADER)).toBe('exempt');
    }
    for (const url of ['https://xtrata.test/i/3112', 'https://xtrata.test/i/31', 'https://xtrata.test/i/311']) {
      expect((await run(url, env)).res.headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
    }
  });

  it('a contract-scoped exemption does not leak to the same id on another contract', async () => {
    const env = { INSCRIPTION_SANDBOX: '1', INSCRIPTION_SANDBOX_EXEMPT: `${CONTRACT}:3072` };
    const other = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0';
    const { res } = await run(`https://xtrata.test/runtime/content?contractId=${other}&tokenId=3072`, env);
    expect(res.headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
    // and an id-less URL is never exempt
    expect((await run('https://xtrata.test/runtime/content', env)).res.headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
  });

  it('adds the header on HEAD and error responses too', async () => {
    const next = vi.fn(async () => new Response(null, { status: 404, headers: { 'content-type': 'text/html' } }));
    const res = await contentIsolationGuard({ request: new Request('https://xtrata.test/i/1', { method: 'HEAD' }), env: { INSCRIPTION_SANDBOX: '1' }, next });
    expect(res.status).toBe(404);
    expect(res.headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
  });

  it('parses refs and exemptions defensively', () => {
    expect(inscriptionRefFromUrl(new URL('https://x.test/i/42'))).toEqual({ contractId: null, tokenId: '42' });
    expect(inscriptionRefFromUrl(new URL('https://x.test/i/abc'))).toEqual({ contractId: null, tokenId: null });
    expect(inscriptionRefFromUrl(new URL('https://x.test/i/%2342'))).toEqual({ contractId: null, tokenId: '42' });
    expect(isInscriptionContentPath('/i/1')).toBe(true);
    expect(isInscriptionContentPath('/inscription/1')).toBe(true);
    expect(isInscriptionContentPath('/runtime/content')).toBe(true);
    expect(isInscriptionContentPath('/runtime/contents')).toBe(false);
    expect(isInscriptionContentPath('/index/1')).toBe(false);
    expect(parseExemptions({})).toEqual(new Set());
    expect(isExempt({ contractId: null, tokenId: null }, new Set(['1']))).toBe(false);
    expect(isDocumentCapableType(null)).toBe(false);
  });

  it('works behind the radio guard: the radio host keeps its plain sandbox, the main host gets ours', async () => {
    const chain = async (url: string) => {
      const handler = vi.fn(async () => new Response('<p>x</p>', { headers: html }));
      const env = { RADIO_PPP_HOST: 'radio.xtrata.test', INSCRIPTION_SANDBOX: '1' };
      const request = new Request(url);
      const res = await radioHostGuard({
        request,
        env,
        next: () => contentIsolationGuard({ request, env, next: handler })
      });
      return res;
    };
    expect((await chain('https://radio.xtrata.test/i/1')).headers.get('content-security-policy')).toBe('sandbox');
    expect((await chain('https://xtrata.test/i/1')).headers.get('content-security-policy')).toBe(CONTENT_ISOLATION_CSP);
  });

  it('is wired into every content middleware, after the radio guard', () => {
    for (const dir of ['runtime', 'i', 'inscription']) {
      const source = readFileSync(new URL(`../../${dir}/_middleware.ts`, import.meta.url), 'utf8');
      expect(source).toMatch(/onRequest = \[radioHostGuard, contentIsolationGuard\]/);
    }
  });
});

import { describe, expect, it, vi } from 'vitest';
import {
  ARTICLES,
  buildMeta,
  cleanId,
  esc,
  injectMeta,
  isPreviewBot,
  readHead,
  renderIndex,
  renderPreview,
  renderReader,
  scriptJson
} from '../lib/article-reader';
import { linkPreviewGuard } from '../lib/link-preview';
import { readPeek } from '../lib/inscription-preview';

vi.mock('../inscription/handler', () => ({ onInscriptionRequest: vi.fn() }));

describe('article reader', () => {
  it('accepts plain inscription numbers only', () => {
    expect(cleanId('3654')).toBe('3654');
    expect(cleanId('#3654')).toBe('3654');
    expect(cleanId('003654')).toBe('3654');
    expect(cleanId(['42'])).toBe('42');
    for (const bad of ['', 'abc', '12a', '-1', '1.5', '../i/1', '1'.repeat(13), undefined]) {
      expect(cleanId(bad)).toBeNull();
    }
  });

  it('escapes HTML and keeps JSON inside a script tag', () => {
    expect(esc(`<a href="x">'&`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;');
    expect(scriptJson({ t: '</script><b>' })).not.toContain('</script>');
  });

  it('reads title, description and first inscribed image from article HTML', () => {
    const html = `<html><head><title>Somewhere &amp; Else</title><meta name="description" content="A receipt, not a JPEG."></head>
      <body><h1>Ignored</h1><figure><img alt="x" src="/i/3617"></figure><p>First para</p></body></html>`;
    expect(readHead(html)).toEqual({ title: 'Somewhere & Else', description: 'A receipt, not a JPEG.', firstImage: '/i/3617' });
  });

  it('falls back to h1 and first paragraph when there is no head metadata', () => {
    const info = readHead('<h1>Title <em>here</em></h1><p>Opening <b>line</b>.</p>');
    expect(info.title).toBe('Title here');
    expect(info.description).toBe('Opening line.');
    expect(info.firstImage).toBeNull();
  });

  it('uses the registry for a registered article', () => {
    const m = buildMeta('3654', null, 'text/html');
    expect(m.article?.title).toBe('Somewhere Else');
    expect(m.image).toBe('https://xtrata.xyz/a/cards/3654.jpg');
    const html = renderReader(m);
    expect(html).toContain('<meta property="og:image" content="https://xtrata.xyz/a/cards/3654.jpg">');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(html).toContain('<meta name="twitter:creator" content="@jimdotbtc">');
    expect(html).toContain('href="/i/3654"');
    expect(html).toContain('href="/x/3654"');
    expect(html).toContain(ARTICLES[0].sha256);
  });

  it('builds sensible previews for unregistered inscriptions', () => {
    const htmlMeta = buildMeta('99', { title: '<Evil "title">', description: null, firstImage: '/i/98' }, 'text/html');
    expect(htmlMeta.image).toBe('https://xtrata.xyz/i/98');
    const page = renderReader(htmlMeta);
    expect(page).toContain('&lt;Evil &quot;title&quot;&gt;');
    expect(page).not.toContain('<Evil');

    expect(buildMeta('5', null, 'image/png').image).toBe('https://xtrata.xyz/i/5');
    const plain = buildMeta('6', null, 'application/octet-stream');
    expect(plain.image).toBeNull();
    expect(renderReader(plain)).toContain('<meta name="twitter:card" content="summary">');
  });

  it('never gives an unverified inscription popups or same-origin access', () => {
    const page = renderReader(buildMeta('3654', null, 'text/html'));
    expect(page).not.toContain('allow-same-origin');
    expect(page).toContain("verified ? 'allow-scripts allow-popups allow-popups-to-escape-sandbox' : 'allow-scripts'");
  });

  it('lists registered articles on the index', () => {
    const page = renderIndex();
    for (const a of ARTICLES) expect(page).toContain(`href="/a/${a.id}"`);
  });
});

const TWITTERBOT = 'Twitterbot/1.0';
const SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15';
const html = (body: string, type = 'text/html; charset=utf-8') => new Response(body, { headers: { 'content-type': type } });
const req = (path: string, ua: string) => new Request('https://xtrata.xyz' + path, { headers: { 'user-agent': ua } });

describe('link previews', () => {
  it('recognises preview crawlers and not browsers', () => {
    for (const ua of [TWITTERBOT, 'facebookexternalhit/1.1', 'Mozilla/5.0 (compatible; Discordbot/2.0)', 'LinkedInBot/1.0', 'TelegramBot (like TwitterBot)', 'Slackbot-LinkExpanding 1.0'])
      expect(isPreviewBot(ua)).toBe(true);
    for (const ua of [SAFARI, '', null, 'curl/8.0', 'node-fetch']) expect(isPreviewBot(ua)).toBe(false);
  });

  it('leaves /i/ untouched for people', async () => {
    const raw = html('<title>x</title>');
    const out = await linkPreviewGuard({ request: req('/i/3654', SAFARI), env: {}, next: async () => raw });
    expect(out).toBe(raw);
  });

  it('passes media through for crawlers, so og:image targets still load', async () => {
    const img = new Response(new Uint8Array([1, 2]), { headers: { 'content-type': 'image/webp' } });
    const out = await linkPreviewGuard({ request: req('/i/3617', TWITTERBOT), env: {}, next: async () => img });
    expect(out).toBe(img);
  });

  it('gives crawlers a preview page for an HTML inscription, never cached', async () => {
    const out = await linkPreviewGuard({
      request: req('/i/99', TWITTERBOT),
      env: {},
      next: async () => html('<title>My game</title><meta name="description" content="Play it."><img src="/i/98">')
    });
    expect(out.headers.get('cache-control')).toBe('no-store');
    expect(out.headers.get('vary')).toBe('User-Agent');
    const text = await out.text();
    expect(text).toContain('<meta property="og:title" content="My game">');
    expect(text).toContain('<meta property="og:image" content="https://xtrata.xyz/i/98">');
    expect(text).toContain('<meta property="og:url" content="https://xtrata.xyz/i/99">');
  });

  it('uses the registered card for #3654 on /i/', async () => {
    const out = await linkPreviewGuard({ request: req('/i/3654', TWITTERBOT), env: {}, next: async () => html('<title>Somewhere Else</title>') });
    const text = await out.text();
    expect(text).toContain('https://xtrata.xyz/a/cards/3654.jpg');
    expect(text).toContain('<meta property="og:url" content="https://xtrata.xyz/i/3654">');
  });

  it('can be switched off', async () => {
    const raw = html('<title>x</title>');
    const out = await linkPreviewGuard({ request: req('/i/1', TWITTERBOT), env: { LINK_PREVIEWS: '0' }, next: async () => raw });
    expect(out).toBe(raw);
  });

  it('does not read large or non-HTML bodies', async () => {
    const big = new Response('x', { headers: { 'content-type': 'text/html', 'content-length': '9000000' } });
    expect((await readPeek(big)).head).toBeNull();
    expect((await readPeek(new Response('nf', { status: 404 }))).missing).toBe(true);
  });

  it('rewrites the explorer shell head for crawlers', () => {
    const shell = '<html><head><title>Xtrata — Create</title><meta name="description" content="old" /></head><body></body></html>';
    const m = buildMeta('3654', null, 'text/html', 'https://xtrata.xyz/x/3654');
    const out = injectMeta(shell, m, 'Somewhere Else · #3654 · Xtrata Explorer');
    expect(out).toContain('<title>Somewhere Else · #3654 · Xtrata Explorer</title>');
    expect(out).not.toContain('content="old"');
    expect(out.match(/<title>/g)?.length).toBe(1);
    expect(out).toContain('<meta property="og:url" content="https://xtrata.xyz/x/3654">');
    expect(out).toContain('summary_large_image');
  });

  it('renders a minimal crawler page', () => {
    const page = renderPreview(buildMeta('7', null, 'image/png', 'https://xtrata.xyz/i/7'));
    expect(page).toContain('<meta property="og:image" content="https://xtrata.xyz/i/7">');
    expect(page).not.toContain('<script');
  });
});

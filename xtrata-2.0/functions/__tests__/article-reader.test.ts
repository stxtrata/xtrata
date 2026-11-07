import { describe, expect, it } from 'vitest';
import { ARTICLES, buildMeta, cleanId, esc, readHead, renderIndex, renderReader, scriptJson } from '../lib/article-reader';

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

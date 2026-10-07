// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

// happy-dom replaces the global URL class, so resolve paths with node:path.
const here = dirname(fileURLToPath(import.meta.url));
const main = readFileSync(resolve(here, '../main.js'), 'utf8');
const css = readFileSync(resolve(here, '../styles/home.css'), 'utf8');

// Pull the real helper source out of main.js (it lives inside a big closure) and
// run it against a fresh DOM, so these tests exercise the shipped code.
const start = main.indexOf('const getGridThumbUrl');
const end = main.indexOf('const scheduleBackgroundThumbnailHydration');
const helperSource = main.slice(start, end);

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

type Token = {
  id: bigint;
  sourceContractId?: string;
  meta: { mimeType: string } | null;
  thumbVersion?: string | null;
  thumbTitle?: string | null;
  thumbArtist?: string | null;
};

const load = () => {
  const factory = new Function(
    'document',
    'getGridMimeLabel',
    'getTokenCacheContractId',
    `${helperSource}\nreturn { getGridThumbUrl, renderGridPoster };`
  );
  return factory(
    document,
    (mime: string | null) => (mime?.startsWith('audio/') ? 'AUDIO' : 'HTML'),
    (token: Token) => token.sourceContractId ?? null
  ) as {
    getGridThumbUrl: (token: Token) => string | null;
    renderGridPoster: (token: Token, thumb: HTMLElement) => boolean;
  };
};

const makeCard = () => {
  const card = document.createElement('button');
  const thumb = document.createElement('div');
  thumb.className = 'token-thumb';
  card.append(thumb);
  document.body.append(card);
  return { card, thumb };
};

const song = (extra: Partial<Token> = {}): Token => ({
  id: 12n,
  sourceContractId: CONTRACT,
  meta: { mimeType: 'text/html' },
  ...extra
});

describe('grid poster for songs and HTML', () => {
  it('shows the stored thumbnail as a plain image with title and artist', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    renderGridPoster(song({ thumbVersion: 'abc12345', thumbTitle: 'Night Drive', thumbArtist: 'Kay' }), thumb);

    const img = thumb.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(`/thumb/${encodeURIComponent(CONTRACT)}/12?v=abc12345`);
    expect(img.alt).toBe('Night Drive by Kay');
    expect(thumb.querySelector('.token-thumb-poster__caption')?.textContent).toBe('Night DriveKay');
    expect(thumb.dataset.thumbnailState).toBe('server-thumb');
    expect(thumb.classList.contains('has-thumbnail')).toBe(true);
  });

  it('never creates an iframe or runs anything', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    renderGridPoster(song({ thumbVersion: 'abc12345' }), thumb);
    expect(thumb.querySelector('iframe, script, video, audio')).toBeNull();
  });

  it('lets a single click reach the card', () => {
    const { renderGridPoster } = load();
    const { card, thumb } = makeCard();
    renderGridPoster(song({ thumbVersion: 'abc12345', thumbTitle: 'Night Drive' }), thumb);
    const onCard = vi.fn();
    card.addEventListener('click', onCard);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    thumb.querySelector('img')!.dispatchEvent(event);
    thumb.querySelector('.token-thumb-poster')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onCard).toHaveBeenCalledTimes(2);
    expect(event.defaultPrevented).toBe(false);
  });

  it('inserts title and artist as text, never as markup', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    const hostile = '<img src=x onerror=alert(1)><b>x</b>';
    renderGridPoster(song({ thumbTitle: hostile, thumbArtist: '<script>1</script>' }), thumb);
    expect(thumb.querySelector('img')).toBeNull();
    expect(thumb.querySelector('script, b')).toBeNull();
    expect(thumb.querySelector('.token-thumb-poster__title')?.textContent).toBe(hostile);
  });

  it('uses a text poster when there is no stored thumbnail', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    renderGridPoster(song(), thumb);
    expect(thumb.querySelector('img')).toBeNull();
    expect(thumb.querySelector('.token-thumb-poster__label')?.textContent).toBe('HTML');
    expect(thumb.querySelector('.token-thumb-poster__hint')?.textContent).toBe('Tap to open');
    expect(thumb.dataset.thumbnailState).toBe('poster');
    expect(thumb.classList.contains('has-thumbnail')).toBe(false);
  });

  it('shows the title instead of a hint when only the text is known', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    renderGridPoster(song({ thumbTitle: 'Night Drive', thumbArtist: 'Kay' }), thumb);
    expect(thumb.querySelector('.token-thumb-poster__title')?.textContent).toBe('Night Drive');
    expect(thumb.querySelector('.token-thumb-poster__artist')?.textContent).toBe('Kay');
    expect(thumb.querySelector('.token-thumb-poster__hint')).toBeNull();
  });

  it('rejects a version that could change the URL path', () => {
    const { getGridThumbUrl } = load();
    expect(getGridThumbUrl(song({ thumbVersion: '../../x' }))).toBeNull();
    expect(getGridThumbUrl(song({ thumbVersion: 'a b' }))).toBeNull();
    expect(getGridThumbUrl(song({ thumbVersion: 'abc' }))).toBeNull();
    expect(getGridThumbUrl(song({ thumbVersion: null }))).toBeNull();
    expect(getGridThumbUrl(song({ thumbVersion: 'abc12345' }))).toContain('?v=abc12345');
  });

  it('falls back to the text poster when the picture fails to load', () => {
    const { renderGridPoster } = load();
    const { thumb } = makeCard();
    renderGridPoster(song({ thumbVersion: 'abc12345', thumbTitle: 'Night Drive' }), thumb);
    thumb.querySelector('img')!.dispatchEvent(new Event('error'));
    expect(thumb.querySelector('img')).toBeNull();
    expect(thumb.querySelector('.token-thumb-poster__title')?.textContent).toBe('Night Drive');
    expect(thumb.dataset.thumbnailState).toBe('poster');
    expect(thumb.classList.contains('has-thumbnail')).toBe(false);
  });
});

describe('the main grid never lets an inscription take the click', () => {
  const liveMediaStart = main.indexOf('const renderGridLiveMedia');
  const liveMedia = main.slice(liveMediaStart, main.indexOf('const shouldBackgroundHydrateThumbnail', liveMediaStart));
  const htmlBranch = liveMedia.slice(liveMedia.indexOf("media.kind === 'html'"), liveMedia.indexOf("media.kind === 'pdf'"));

  it('runs a non-gated tile only when it is small, and only click-through', () => {
    const gatedAt = htmlBranch.indexOf('if (!options.gated)');
    const smallAt = htmlBranch.indexOf('!isLiveGridHtml(token)');
    const heavyAt = htmlBranch.indexOf('isHeavyGridHtml(media.html, bytes, GRID_LIVE_HTML_MAX_BYTES)');
    const posterAt = htmlBranch.indexOf('renderGridPoster(token, thumbElement)');
    const registerAt = htmlBranch.indexOf('liveHtmlFrameManager.register(');
    expect(gatedAt).toBeGreaterThan(-1);
    expect(smallAt).toBeGreaterThan(gatedAt);
    expect(heavyAt).toBeGreaterThan(smallAt);
    expect(posterAt).toBeGreaterThan(heavyAt);
    expect(registerAt).toBeGreaterThan(posterAt);
    const registerCall = htmlBranch.slice(registerAt, htmlBranch.indexOf(');', registerAt));
    expect(registerCall).toContain('clickThrough: true');
    expect(registerCall).toContain('gated: false');
    // The relationship (gated) mount keeps its click-to-run behaviour.
    expect(htmlBranch.lastIndexOf('liveHtmlFrameManager.register(')).toBeGreaterThan(registerAt);
  });

  it('caps live grid HTML at 1 MiB and never for tokens with a stored picture', () => {
    const at = main.indexOf('const GRID_LIVE_HTML_MAX_BYTES');
    const source = main.slice(at, main.indexOf('// URL of the stored grid thumbnail', at));
    const make = (thumbUrl: string | null, kind = 'html') =>
      new Function(
        'getMediaKind',
        'getGridThumbUrl',
        `${source}\nreturn { isLiveGridHtml, GRID_LIVE_HTML_MAX_BYTES };`
      )(() => kind, () => thumbUrl) as {
        isLiveGridHtml: (t: unknown) => boolean;
        GRID_LIVE_HTML_MAX_BYTES: number;
      };
    const tok = (size: bigint | null) => ({ meta: size === null ? null : { mimeType: 'text/html', totalSize: size } });
    const { isLiveGridHtml, GRID_LIVE_HTML_MAX_BYTES } = make(null);
    expect(GRID_LIVE_HTML_MAX_BYTES).toBe(1024 * 1024);
    expect(isLiveGridHtml(tok(854_300n))).toBe(true);
    expect(isLiveGridHtml(tok(BigInt(1024 * 1024 - 1)))).toBe(true);
    expect(isLiveGridHtml(tok(BigInt(1024 * 1024)))).toBe(false);
    expect(isLiveGridHtml(tok(4_640_000n))).toBe(false);
    expect(isLiveGridHtml(tok(0n))).toBe(false);
    expect(isLiveGridHtml(tok(null))).toBe(false);
    expect(make('/thumb/x/1?v=abcd').isLiveGridHtml(tok(300_000n))).toBe(false);
    expect(make(null, 'audio').isLiveGridHtml(tok(300_000n))).toBe(false);
  });

  it('starts small HTML only when the tile is near the viewport and the preview is quiet', () => {
    const at = main.indexOf('const startLiveGridHtmlFetch');
    const source = main.slice(at, main.indexOf('const renderRelationshipThumbMedia', at));
    expect(source).toContain('liveHtmlFrameManager.isQuiet()');
    expect(source).toContain('new IntersectionObserver');
    expect(source).toContain('scheduleBackgroundThumbnailHydration(token, thumbElement)');
  });

  it('sends songs and HTML straight to the poster when a card is built', () => {
    const cardStart = main.indexOf('const renderTokenGrid = (options = {}) =>');
    expect(cardStart).toBeGreaterThan(-1);
    const card = main.slice(cardStart, main.indexOf('const updateSelectedTokenGridCard', cardStart));
    const deferAt = card.indexOf('} else if (isDeferredGridPlayable(token)) {');
    const cacheAt = card.indexOf('state.gridLiveMediaCache.get(cacheKey)');
    expect(deferAt).toBeGreaterThan(-1);
    expect(cacheAt).toBeGreaterThan(deferAt);
    expect(card).toContain('renderGridPoster(token, thumb);');
    // Small HTML with no stored picture starts after the poster is up, once visible.
    expect(card).toContain('watchLiveGridHtml(token, thumb)');
  });

  it('keeps the poster free of handlers, markup injection and frames', () => {
    const body = helperSource.slice(helperSource.indexOf('const renderGridPoster'));
    expect(body).not.toMatch(/addEventListener\(\s*'click'/);
    expect(body).not.toContain('stopPropagation');
    expect(body).not.toContain('innerHTML');
    expect(body).not.toContain('createElement(\'iframe\')');
  });

  it('lets clicks pass through the poster in CSS', () => {
    const rule = css.slice(css.indexOf('.token-thumb-poster {'));
    expect(rule.slice(0, rule.indexOf('}'))).toContain('pointer-events: none');
  });
});

describe('still pictures use their stored thumbnail', () => {
  const at = main.indexOf('const renderGridImageThumb');
  const source = main.slice(at, main.indexOf('const renderRelationshipThumbMedia', at));
  const thumbStart = main.indexOf('const getGridThumbUrl');
  const thumbSource = main.slice(thumbStart, main.indexOf('const renderGridPoster', thumbStart));

  const load = (extra: Record<string, unknown> = {}) => {
    const calls = { pixel: [] as unknown[], runtime: 0, label: [] as unknown[] };
    const factory = new Function(
      'document',
      'getTokenCacheContractId',
      'getThumbnailKey',
      'applyPixelPerfectImageRendering',
      'renderGridRuntimeImage',
      'setTokenThumbLabel',
      'getGridMimeLabel',
      `${thumbSource}\n${source}\nreturn { renderGridImageThumb };`
    );
    const api = factory(
      document,
      (t: { sourceContractId?: string }) => t.sourceContractId ?? null,
      (t: { id: bigint }) => `k${t.id}`,
      (_img: unknown, opts: unknown) => calls.pixel.push(opts),
      () => {
        calls.runtime += 1;
        return extra.runtimeWorks !== false;
      },
      (_el: unknown, label: unknown) => calls.label.push(label),
      () => 'PNG'
    ) as { renderGridImageThumb: (t: unknown, el: HTMLElement) => boolean };
    return { ...api, calls };
  };
  const tok = (over: Record<string, unknown> = {}) => ({
    id: 5n,
    sourceContractId: CONTRACT,
    meta: { mimeType: 'image/png' },
    thumbVersion: 'abc12345',
    ...over
  });
  const cell = () => {
    const el = document.createElement('div');
    el.dataset.thumbnailKey = 'k5';
    document.body.append(el);
    return el;
  };

  it('shows the small stored picture with the original mime type for pixel-art scaling', () => {
    const { renderGridImageThumb, calls } = load();
    const el = cell();
    expect(renderGridImageThumb(tok(), el)).toBe(true);
    const img = el.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(`/thumb/${encodeURIComponent(CONTRACT)}/5?v=abc12345`);
    expect(el.dataset.thumbnailState).toBe('server-thumb');
    expect(el.classList.contains('has-thumbnail')).toBe(true);
    expect(calls.pixel[0]).toMatchObject({ mimeType: 'image/png', squareFrame: true });
    expect(img.draggable).toBe(false);
  });

  it('does nothing when the server offered no thumbnail (animated, unchecked or missing)', () => {
    const { renderGridImageThumb } = load();
    const el = cell();
    expect(renderGridImageThumb(tok({ thumbVersion: null }), el)).toBe(false);
    expect(el.querySelector('img')).toBeNull();
  });

  it('goes back to the full picture if the thumbnail will not load', () => {
    const { renderGridImageThumb, calls } = load();
    const el = cell();
    renderGridImageThumb(tok(), el);
    el.querySelector('img')!.dispatchEvent(new Event('error'));
    expect(calls.runtime).toBe(1);
    expect(el.classList.contains('has-thumbnail')).toBe(false);
  });

  it('falls back to the label when even the full picture cannot start', () => {
    const { renderGridImageThumb, calls } = load({ runtimeWorks: false });
    const el = cell();
    renderGridImageThumb(tok(), el);
    el.querySelector('img')!.dispatchEvent(new Event('error'));
    expect(calls.label).toEqual(['PNG']);
    expect(el.dataset.thumbnailState).toBe('failed-thumb');
  });

  it('is chosen for picture files only, ahead of the songs and HTML branch', () => {
    const cardStart = main.indexOf('const renderTokenGrid = (options = {}) =>');
    const card = main.slice(cardStart, main.indexOf('const updateSelectedTokenGridCard', cardStart));
    const imageAt = card.indexOf('renderGridImageThumb(token, thumb)');
    const svgAt = card.indexOf('isSvgToken(token) && renderGridRuntimeImage(token, thumb)');
    const deferAt = card.indexOf('} else if (isDeferredGridPlayable(token)) {');
    expect(imageAt).toBeGreaterThan(svgAt);
    expect(imageAt).toBeLessThan(deferAt);
    expect(card.slice(imageAt - 120, imageAt)).toContain("getMediaKind(token.meta?.mimeType ?? null) === 'image'");
  });
});


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

describe('the main grid never runs an inscription', () => {
  const liveMediaStart = main.indexOf('const renderGridLiveMedia');
  const liveMedia = main.slice(liveMediaStart, main.indexOf('const shouldBackgroundHydrateThumbnail', liveMediaStart));
  const htmlBranch = liveMedia.slice(liveMedia.indexOf("media.kind === 'html'"), liveMedia.indexOf("media.kind === 'pdf'"));

  it('mounts a live frame only for gated (relationship) thumbnails', () => {
    const gatedAt = htmlBranch.indexOf('if (!options.gated)');
    const posterAt = htmlBranch.indexOf('renderGridPoster(token, thumbElement)');
    const registerAt = htmlBranch.indexOf('liveHtmlFrameManager.register(');
    expect(gatedAt).toBeGreaterThan(-1);
    expect(posterAt).toBeGreaterThan(gatedAt);
    expect(registerAt).toBeGreaterThan(posterAt);
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

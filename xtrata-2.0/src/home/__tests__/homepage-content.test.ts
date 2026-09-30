import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_AUDIONAUTS,
  HOMEPAGE_FRESH,
  HOMEPAGE_INTENTS,
  HOMEPAGE_KP_LOOPS,
  HOMEPAGE_PLAY,
  HOMEPAGE_PROGRAMMES,
  HOMEPAGE_STRIP_SLIDES,
  HOMEPAGE_WALL,
  validateHomepageContent
} from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const homepageSource = readFileSync(new URL('../homepage.js', import.meta.url), 'utf8');
const homeMainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const radioSource = readFileSync(new URL('../radio.js', import.meta.url), 'utf8');
const configSource = readFileSync(new URL('../config.js', import.meta.url), 'utf8');
const homeStyles = readFileSync(new URL('../styles/home.css', import.meta.url), 'utf8');
const tokenCardMediaSource = readFileSync(
  new URL('../../components/TokenCardMedia.tsx', import.meta.url),
  'utf8'
);
const tokenContentPreviewSource = readFileSync(
  new URL('../../components/TokenContentPreview.tsx', import.meta.url),
  'utf8'
);

describe('homepage content configuration', () => {
  it('passes the homepage content contract', () => {
    expect(validateHomepageContent()).toEqual([]);
  });

  it('keeps every content list keyed by unique ids', () => {
    for (const list of [HOMEPAGE_STRIP_SLIDES, HOMEPAGE_WALL, HOMEPAGE_PLAY, HOMEPAGE_PROGRAMMES, HOMEPAGE_INTENTS, HOMEPAGE_FRESH.pinned]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('replaces the stacked banners with one rotating strip', () => {
    expect(indexHtml).toContain('id="homeStrip"');
    expect(indexHtml).not.toContain('id="campaignBannerList"');
    expect(indexHtml).not.toContain('class="collections-soon');
    expect(HOMEPAGE_STRIP_SLIDES.map((item) => item.id)).toEqual(
      expect.arrayContaining(['music-app', 'chess', 'kp-loops', 'audionauts', 'forever-twins'])
    );
    // A rotating banner must respect reduced motion and pause while being read.
    expect(homepageSource).toContain("matchMedia?.('(prefers-reduced-motion: reduce)')");
    expect(homepageSource).toContain('mount.onmouseenter = () => { paused = true; };');
  });

  it('fills the 4x4 Living Wall exactly on desktop', () => {
    const cells = HOMEPAGE_WALL.reduce(
      (sum, tile) => sum + ({ big: 4, wide: 2, tall: 2 }[tile.size] ?? 1),
      0
    );
    expect(cells).toBe(16);
    expect(HOMEPAGE_WALL[0]).toMatchObject({ id: 'xtrata-arcade', size: 'big', href: '/i/3081' });
    expect(HOMEPAGE_WALL.find((tile) => tile.kind === 'chess')).toMatchObject({ href: '/i/3072', title: 'On-Chain Chess' });
  });

  it('draws the chess board locally instead of loading the X Chess inscription', () => {
    expect(homepageSource).toContain('const createChessBoard =');
    expect(indexHtml).not.toContain('/i/3072"></iframe');
  });

  it('plays homepage songs through the one site radio, never a second player', () => {
    expect(homepageSource).toContain('api.playToken(tokenId)');
    // Silent visuals (the Audionauts logo) start the same radio in place.
    expect(homepageSource).toContain('const toggleRadio = (fallbackHref) =>');
    expect(homepageSource).toContain('api.switchOn();');
    expect(homepageSource).not.toMatch(/new Audio\(|createElement\('audio'\)/);
  });

  it('reports a failed catalogue read as failed rather than as no songs', () => {
    expect(homepageSource).toContain(".catch(() => ({ ok: false, tracks: [] }))");
    expect(homepageSource).toContain('Live play counts could not be loaded just now');
  });

  it('keeps launch panels honest about what is live', () => {
    expect(HOMEPAGE_AUDIONAUTS.status === 'live' ? HOMEPAGE_AUDIONAUTS.mintHref : 'soon').toBeTruthy();
    expect(HOMEPAGE_KP_LOOPS.stationHref).toBe('/kp-loops/#kp-loops');
    expect(indexHtml).toContain('id="homeKpLoops"');
    expect(indexHtml).toContain('id="homeAudionauts"');
  });

  it('keeps off-page previews and third-party signed brand assets out of other routes', () => {
    expect(indexHtml).toContain('class="brand-logo" src="/favicon.svg"');
    expect(configSource).toContain("XTRATA_BRAND_MARK_URL = '/favicon.svg'");
    expect(homepageSource).toContain("dataset.page !== 'home'");
    expect(homepageSource).toContain('clearHomepage();');
    expect(homepageSource).toContain("attributeFilter: ['data-page']");
  });

  it('handles rejected best-effort radio requests without unhandled console errors', () => {
    expect(radioSource).toContain("fetch('/index/verdict'");
    expect(radioSource).toContain("fetch(ids ? `/warm?ids=${ids}` : '/warm?auto=2').catch");
  });

  it('does not require Array.prototype.at during global homepage initialisation', () => {
    expect(homeMainSource).toContain('dropDiagnostics[dropDiagnostics.length - 1]');
    expect(homeMainSource).not.toContain('dropDiagnostics.at(-1)');
  });

  it('keeps Claim and Collect navigation inside the SPA', () => {
    expect(homeMainSource).toContain(
      "['inscribe', 'my-wallet', 'wallet', 'xplorer', 'x', 'drops', 'market', 'create-wizard'].includes(seg)"
    );
  });

  it('renders PDFs from immutable runtime URLs without sandboxing the browser PDF viewer', () => {
    expect(configSource).toContain("['application/pdf', 'PDF']");
    expect(homeMainSource).toContain('pdfSourceUrl:');
    expect(homeMainSource).toContain(
      'getTokenRuntimeContentUrl(token) ?? inscriptionEndpointUrl(token.id)'
    );
    expect(homeMainSource).not.toContain("frame.sandbox = '';");
    expect(tokenCardMediaSource).toContain('src={pdfRuntimeUrl ?? contentUrl}');
    expect(tokenContentPreviewSource).toContain('src={pdfRuntimeUrl ?? contentUrl}');
    expect(tokenCardMediaSource).not.toContain('sandbox=""');
    expect(tokenContentPreviewSource).not.toContain('sandbox=""');
  });

  it('hands a selected My Xtrata inscription directly to the free drop form', () => {
    expect(indexHtml).toContain('id="dropItButton"');
    expect(indexHtml).toContain('class="drop-it-info"');
    expect(indexHtml).toContain('class="drop-it-info"\n                          type="button"');
    expect(indexHtml).toContain('100% gasless for recipients');
    expect(homeMainSource).toContain('const target = `/drops?drop=${tokenId}`');
    expect(homeMainSource).toContain("const dropParam = params?.get?.('drop')");
    expect(homeMainSource).toContain('openDropForToken(dropParam)');
    expect(homeMainSource).toContain('await loadDropsPage(pageParams)');
  });

  it('keeps the Drop It explanation readable above every visual theme', () => {
    const tooltipRule = homeStyles.match(/\.drop-it-info::after\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? '';

    expect(homeStyles).toContain('--tooltip-bg: #090b0a;');
    expect(homeStyles).toContain('--tooltip-ink: #ffffff;');
    expect(tooltipRule).toContain('background: var(--tooltip-bg);');
    expect(tooltipRule).toContain('color: var(--tooltip-ink);');
    expect(homeStyles).toContain('isolation: isolate;');
    expect(homeStyles).toContain('.drop-it-info:focus::after');
    expect(tooltipRule).not.toContain('background: var(--surface);');
    expect(tooltipRule).not.toContain('color: var(--text);');
  });

  // A first-time visitor was downloading roughly 10 MB of audio before asking
  // for any of it: six embedded HTML players (the first four rendered twice,
  // once in the hero stage and again in the grid) plus three radio tracks cued
  // while the radio was switched off. Both are easy to reintroduce by accident.
  it('does not fetch inscription media before the visitor asks for it', () => {
    // The homepage mounts no inscription iframes at all: the chess board is
    // drawn locally and posters are plain images, so nothing heavy loads
    // until the visitor chooses to open something.
    expect(homepageSource).not.toContain("createElement('iframe')");
    expect(homepageSource).not.toMatch(/iframe\.src\s*=/);
    expect(homepageSource).toContain("img.loading = options.eager ? 'eager' : 'lazy';");
  });

  it('keeps the radio silent on the wire until it is switched on', () => {
    // Cueing a track downloads it, so every preload path is gated on `on`.
    const preloadBody =
      radioSource.match(/const preloadNextTrack = async \(\) => \{[\s\S]*?\n  \};/)?.[0] ?? '';
    expect(preloadBody).toContain('if (!on) return;');
    const ensureCuedBody =
      radioSource.match(/const ensureCued = \(\) => \{[\s\S]*?\n  \};/)?.[0] ?? '';
    expect(ensureCuedBody).toContain('if (!on) return;');
    // Page load warms the shared server-side cache only — that downloads
    // nothing to this browser — and must not cue a track.
    expect(radioSource).toContain('idle(() => { pingWarm(); });');
    expect(radioSource).not.toContain('idle(() => { void preloadNextTrack(); pingWarm(); });');
    // Switching off releases the queue rather than re-cueing behind the user.
    const switchOffBody =
      radioSource.match(/const switchOff = \(\) => \{[\s\S]*?\n  \};/)?.[0] ?? '';
    expect(switchOffBody).toContain('preloadQueue.length = 0;');
    expect(switchOffBody).not.toContain('preloadNextTrack');
  });
});

/**
 * Text attachments must never be invisible.
 *
 * Reported after a real mix-up: a reply id left in the collapsed Advanced block
 * turned the next post into a reply to something unrelated. The only signal was
 * the word "reply" in the button, and nothing on screen named the target — a
 * permanent, paid action with a one-word warning.
 */
describe('what a text inscription is attached to', () => {
  it('has a summary strip that lives OUTSIDE the collapsed Advanced block', () => {
    const advancedAt = indexHtml.indexOf('id="textAdvancedDetails"');
    const stripAt = indexHtml.indexOf('id="textRelSummary"');
    expect(stripAt).toBeGreaterThan(-1);
    expect(advancedAt).toBeGreaterThan(-1);
    // Before, therefore not nested inside it.
    expect(stripAt).toBeLessThan(advancedAt);
  });

  it('names the reply target and the parents, not just that something is set', () => {
    const body =
      homeMainSource.match(/const syncTextRelSummary = \(\) => \{[\s\S]*?\n    \};/)?.[0] ?? '';
    expect(body).toContain('Replying to #');
    expect(body).toContain('Child of ');
    // Hidden only when there is genuinely nothing attached.
    expect(body).toContain('hidden = parts.length === 0');
  });

  it('restates the attachment in the collapsed summary too', () => {
    expect(homeMainSource).toContain('dom.textAdvancedSummary.textContent');
    expect(indexHtml).toContain('id="textAdvancedSummary"');
  });

  it('offers a one-click way out of an attachment', () => {
    const body =
      homeMainSource.match(/const syncTextRelSummary = \(\) => \{[\s\S]*?\n    \};/)?.[0] ?? '';
    expect(body).toContain('rel-sum-clear');
    expect(body).toContain('clearParentIds()');
    expect(body).toContain("dom.threadReplyTo.value = ''");
  });

  it('refreshes the strip when parents change inside the Advanced block', () => {
    expect(homeMainSource).toContain('applyParentInput(); syncTextCard();');
    expect(homeMainSource).toContain('clearParentIds(); syncTextCard();');
  });
});

/**
 * Media inside an inscription must be allowed to play.
 *
 * Inscriptions are sandboxed with allow-scripts and WITHOUT allow-same-origin, which
 * gives them an opaque origin. The Permissions Policy default for `autoplay` is `self`,
 * and an opaque origin is never `self`, so play() is rejected with NotAllowedError even
 * directly inside a tap handler. Mobile enforces this strictly, so a tap on the player
 * appeared to do nothing at all.
 */
describe('inscription iframe permissions', () => {
  it('delegates autoplay to frames showing one chosen inscription', () => {
    expect(homeMainSource).toContain("const INSCRIPTION_FRAME_ALLOW = 'autoplay; fullscreen; encrypted-media'");
    // Every viewer frame that sandboxes also delegates, or media silently cannot start.
    const grants = homeMainSource.match(/frame\.allow = INSCRIPTION_FRAME_ALLOW;/g) ?? [];
    expect(grants.length).toBe(3);
  });

  it('never grants autoplay to grid or market thumbnails', () => {
    // A wall of inscriptions each granting itself autoplay would all make noise at once,
    // so only the frames the user deliberately opened may delegate the feature. Checked
    // against the sandbox sites themselves: "inscription-preview" names both viewers and
    // thumbnails, so it is far too ambiguous to assert on.
    // Opened viewers may also allow pointer lock (3D mouse-look) and downloads (saving replays); thumbnails never do.
    const sites = [...homeMainSource.matchAll(/frame\.sandbox = 'allow-scripts( allow-pointer-lock allow-downloads)?';/g)];
    expect(sites.filter((m) => m[1]).every((m) =>
      homeMainSource.slice(m.index ?? 0, (m.index ?? 0) + 160).includes('INSCRIPTION_FRAME_ALLOW'))).toBe(true);
    expect(sites.length).toBe(6);
    const granting = sites.filter((m) =>
      homeMainSource.slice(m.index ?? 0, (m.index ?? 0) + 120).includes('INSCRIPTION_FRAME_ALLOW')
    );
    expect(granting.length).toBe(3);
    // The two market-thumbnail frames are named, so pin those explicitly as ungranted.
    for (const m of [...homeMainSource.matchAll(/frame\.className = 'market-thumb__frame';/g)]) {
      expect(homeMainSource.slice(m.index ?? 0, (m.index ?? 0) + 300)).not.toContain(
        'INSCRIPTION_FRAME_ALLOW'
      );
    }
  });

  it('keeps the sandbox itself intact', () => {
    // Delegating a feature must never turn into relaxing the origin boundary.
    expect(homeMainSource).not.toContain("sandbox = 'allow-scripts allow-same-origin'");
  });
});

/**
 * The menu names destinations by what they do, and the Wizard is reached from
 * inside Inscribe rather than from the top level.
 */
describe('primary navigation', () => {
  it('labels destinations by what they do', () => {
    // Scoped to the nav: "Create" and "Build" are legitimate words elsewhere on
    // the page, so asserting against the whole document would fail on headings.
    const nav = indexHtml.slice(
      indexHtml.indexOf('<nav class="site-nav"'),
      indexHtml.indexOf('</nav>')
    );
    for (const label of ['>Inscribe<', '>Free drops<', '>Buy &amp; sell<', '>Developers<']) {
      expect(nav).toContain(label);
    }
    // The old labels asked the user to guess.
    for (const stale of ['>Create<', '>Claim<', '>Collect<', '>Build<']) {
      expect(nav).not.toContain(stale);
    }
  });

  it('promises "free drops" only because a paid drop is not expressible', () => {
    // Guard the claim behind the label: the drops contract has no price parameter,
    // and `claim` moves no STX from the claimer. If that ever changes, this label
    // becomes a lie and this test should be the thing that objects.
    const drops = readFileSync(
      new URL('../../../contracts/live/xtrata-drops-v1.1.clar', import.meta.url),
      'utf8'
    );
    const claim = drops.slice(
      drops.indexOf('(define-public (claim (nft-contract'),
      drops.indexOf('(define-public (claim-campaign')
    );
    expect(claim).not.toContain('stx-transfer?');
  });

  it('keeps the Wizard out of the nav but reachable from Inscribe', () => {
    expect(indexHtml).not.toContain('data-nav="wizard"');
    // A standing link in the panel, so it is never orphaned.
    expect(indexHtml).toContain('class="support-note inscribe-wizard-note"');
    expect(indexHtml).toContain('id="largeFileNotice"');
  });

  it('actually shows the large-file notice, which nothing used to do', () => {
    // The markup existed and no JavaScript referenced it, so the automatic
    // hand-off never fired. It is the safety net for dropping the nav entry.
    expect(homeMainSource).toContain('const renderLargeFileNotice = ()');
    expect(homeMainSource).toContain('dom.largeFileNotice');
    // Same threshold as the batch guide: the point a mint stops being one tx.
    const fn = homeMainSource.slice(
      homeMainSource.indexOf('const renderLargeFileNotice = ()'),
      homeMainSource.indexOf('const renderResumeNotice')
    );
    expect(fn).toContain('SMALL_MINT_HELPER_MAX_CHUNKS');
    expect(fn).toContain('notice.hidden = false');
  });
});

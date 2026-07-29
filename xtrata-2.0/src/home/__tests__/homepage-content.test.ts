import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_ACTIVITY_DOORS,
  HOMEPAGE_CAMPAIGN_BANNERS,
  HOMEPAGE_CAMPAIGN,
  HOMEPAGE_INTENTS,
  HOMEPAGE_OBJECTS,
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

  it('keeps featured object ids and intent ids unique', () => {
    const objectIds = HOMEPAGE_OBJECTS.map((item) => item.id);
    const intentIds = HOMEPAGE_INTENTS.map((item) => item.id);
    const activityIds = HOMEPAGE_ACTIVITY_DOORS.map((item) => item.id);
    const campaignIds = HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.id);

    expect(new Set(campaignIds).size).toBe(campaignIds.length);
    expect(new Set(objectIds).size).toBe(objectIds.length);
    expect(new Set(intentIds).size).toBe(intentIds.length);
    expect(new Set(activityIds).size).toBe(activityIds.length);
  });

  it('uses real navigable destinations for featured content', () => {
    const hrefs = [
      ...HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.href),
      ...HOMEPAGE_OBJECTS.map((item) => item.href),
      ...HOMEPAGE_INTENTS.map((item) => item.href),
      HOMEPAGE_CAMPAIGN.primaryAction.href,
      HOMEPAGE_CAMPAIGN.secondaryAction.href
    ];

    expect(hrefs.every((href) => href.startsWith('/') || href.startsWith('https://'))).toBe(true);
    expect(HOMEPAGE_OBJECTS.some((item) => item.preview.src?.includes('/i/'))).toBe(true);
    expect(HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.id)).toEqual([
      'proof-zero',
      'forever-twins',
      'suno-more'
    ]);
    expect(indexHtml).toContain('id="campaignBannerList"');
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
    // Iframe previews mount on press, never at render time.
    expect(homepageSource).toContain('const mountPreviewFrame =');
    expect(homepageSource).toContain('createPreviewPoster(frame, preview)');
    expect(homepageSource).toContain("poster.className = 'object-preview__launch'");
    expect(homeStyles).toContain('.object-preview__launch {');
    // The only place an iframe src is assigned is inside the on-press mount.
    const iframeSrcAssignments = homepageSource.match(/iframe\.src\s*=/g) ?? [];
    expect(iframeSrcAssignments).toHaveLength(1);
    const mountBody =
      homepageSource.match(/const mountPreviewFrame = \([\s\S]*?\n\};/)?.[0] ?? '';
    expect(mountBody).toContain('iframe.src = preview.src;');
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
    const sites = [...homeMainSource.matchAll(/frame\.sandbox = 'allow-scripts';/g)];
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

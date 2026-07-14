import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_ACTIVITY_DOORS,
  HOMEPAGE_CAMPAIGN,
  HOMEPAGE_INTENTS,
  HOMEPAGE_OBJECTS,
  validateHomepageContent
} from '../homepage-content.js';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const homepageSource = readFileSync(new URL('../homepage.js', import.meta.url), 'utf8');
const radioSource = readFileSync(new URL('../radio.js', import.meta.url), 'utf8');
const configSource = readFileSync(new URL('../config.js', import.meta.url), 'utf8');

describe('homepage content configuration', () => {
  it('passes the homepage content contract', () => {
    expect(validateHomepageContent()).toEqual([]);
  });

  it('keeps featured object ids and intent ids unique', () => {
    const objectIds = HOMEPAGE_OBJECTS.map((item) => item.id);
    const intentIds = HOMEPAGE_INTENTS.map((item) => item.id);
    const activityIds = HOMEPAGE_ACTIVITY_DOORS.map((item) => item.id);

    expect(new Set(objectIds).size).toBe(objectIds.length);
    expect(new Set(intentIds).size).toBe(intentIds.length);
    expect(new Set(activityIds).size).toBe(activityIds.length);
  });

  it('uses real navigable destinations for featured content', () => {
    const hrefs = [
      ...HOMEPAGE_OBJECTS.map((item) => item.href),
      ...HOMEPAGE_INTENTS.map((item) => item.href),
      HOMEPAGE_CAMPAIGN.primaryAction.href,
      HOMEPAGE_CAMPAIGN.secondaryAction.href
    ];

    expect(hrefs.every((href) => href.startsWith('/') || href.startsWith('https://'))).toBe(true);
    expect(HOMEPAGE_OBJECTS.some((item) => item.preview.src?.includes('/i/'))).toBe(true);
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
});

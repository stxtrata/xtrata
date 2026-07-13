import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_ACTIVITY_DOORS,
  HOMEPAGE_CAMPAIGN_BANNERS,
  HOMEPAGE_CAMPAIGN,
  HOMEPAGE_INTENTS,
  HOMEPAGE_OBJECTS,
  validateHomepageContent
} from '../homepage-content.js';

describe('homepage content configuration', () => {
  it('passes the homepage content contract', () => {
    expect(validateHomepageContent()).toEqual([]);
  });

  it('keeps featured object ids and intent ids unique', () => {
    const objectIds = HOMEPAGE_OBJECTS.map((item) => item.id);
    const intentIds = HOMEPAGE_INTENTS.map((item) => item.id);
    const activityIds = HOMEPAGE_ACTIVITY_DOORS.map((item) => item.id);
    const campaignIds = HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.id);

    expect(new Set(objectIds).size).toBe(objectIds.length);
    expect(new Set(intentIds).size).toBe(intentIds.length);
    expect(new Set(activityIds).size).toBe(activityIds.length);
    expect(new Set(campaignIds).size).toBe(campaignIds.length);
  });

  it('uses real navigable destinations for featured content', () => {
    const hrefs = [
      ...HOMEPAGE_OBJECTS.map((item) => item.href),
      ...HOMEPAGE_INTENTS.map((item) => item.href),
      ...HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.href),
      HOMEPAGE_CAMPAIGN.primaryAction.href,
      HOMEPAGE_CAMPAIGN.secondaryAction.href
    ];

    expect(hrefs.every((href) => href.startsWith('/') || href.startsWith('https://'))).toBe(true);
    expect(HOMEPAGE_OBJECTS.some((item) => item.preview.src?.includes('/i/'))).toBe(true);
  });

  it('keeps both active campaigns in the top banner rail', () => {
    expect(HOMEPAGE_CAMPAIGN_BANNERS.map((item) => item.id)).toEqual([
      'suno-more',
      'forever-twins'
    ]);
    expect(HOMEPAGE_CAMPAIGN_BANNERS.every((item) => item.status === 'live')).toBe(true);
  });

  it('keeps the complete intent-based door set populated', () => {
    expect(HOMEPAGE_INTENTS.map((item) => item.id)).toEqual([
      'explore',
      'create',
      'claim',
      'collect',
      'preserve',
      'build'
    ]);
    expect(HOMEPAGE_INTENTS.every((item) => item.description && item.cta)).toBe(true);
  });
});

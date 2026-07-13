import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_ACTIVITY_DOORS,
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
});

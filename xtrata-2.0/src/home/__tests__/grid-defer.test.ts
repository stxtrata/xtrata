import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const main = readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('Explorer grid defers songs and HTML', () => {
  const start = main.indexOf('const scheduleBackgroundThumbnailHydration');
  const body = main.slice(start, main.indexOf('const renderRelationshipThumbMedia', start));

  it('defers html and audio tokens', () => {
    expect(main).toMatch(/const isDeferredGridPlayable[\s\S]{0,200}'html'[\s\S]{0,60}'audio'/);
  });

  it('checks the deferral before anything is queued for download', () => {
    const deferAt = body.indexOf('isDeferredGridPlayable(token)');
    const queueAt = body.indexOf('thumbnailHydrationQueue.push');
    expect(deferAt).toBeGreaterThan(-1);
    expect(queueAt).toBeGreaterThan(deferAt);
  });

  it('leaves the relationship thumbnail path on its own direct fetch', () => {
    expect(main).toContain('void runBackgroundThumbnailHydration({');
  });
});

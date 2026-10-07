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

describe('selected preview uses the server-assembled content first', () => {
  it('tries /runtime/content before reading chunks from chain', () => {
    expect(main).toContain('const fetchRuntimeContentBytes');
    expect(main).toMatch(/\(await fetchRuntimeContentBytes\(token\)\) \?\? await fetchOnChainContent/);
    expect(main).toContain('bytes.length === expected');
  });
});

describe('Explorer perf trace', () => {
  it('records each slow-prone step and exposes a copyable report', () => {
    for (const step of ['select', 'runtime-fetch:done', 'chain-fetch:start', 'inline-runtime-urls:start', 'inline-runtime-urls:done', 'render-payload', 'iframe-load']) {
      expect(main).toContain(`'${step}'`);
    }
    expect(main).toContain('window.xtrataPerfReport');
    expect(main).toContain('perfBegin(token);');
  });
});

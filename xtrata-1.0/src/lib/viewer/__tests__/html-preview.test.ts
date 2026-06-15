import { describe, expect, it } from 'vitest';
import {
  injectGridThumbnailHtml,
  injectInteractivePreviewHtml
} from '../html-preview';

describe('html grid preview injection', () => {
  it('injects thumbnail support styles into head', () => {
    const html = '<html><head><title>Test</title></head><body><main></main></body></html>';
    const result = injectGridThumbnailHtml(html);
    expect(result).toContain('data-xtrata-grid-preview');
    expect(result.indexOf('data-xtrata-grid-preview')).toBeLessThan(
      result.indexOf('</head>')
    );
    expect(result).toContain('body > main:only-child');
    expect(result).toContain('body > canvas:first-of-type');
    expect(result).toContain('min-width: 0 !important');
    expect(result).toContain('min-height: 0 !important');
    expect(result).toContain('data-xtrata-grid-fit-script');
    expect(result).toContain('applyXtrataGridPreviewScale');
    expect(result).toContain('viewportWidth / contentWidth');
  });

  it('avoids duplicate injection', () => {
    const html =
      '<html><head><style data-xtrata-grid-preview="true"></style></head><body></body></html>';
    const result = injectGridThumbnailHtml(html);
    const matches = result.match(/data-xtrata-grid-preview/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('falls back to injecting into body when head is missing', () => {
    const html = '<html><body><canvas id="stage"></canvas></body></html>';
    const result = injectGridThumbnailHtml(html);
    expect(result).toContain('data-xtrata-grid-preview');
    expect(result.indexOf('data-xtrata-grid-preview')).toBeLessThan(
      result.indexOf('<canvas id="stage">')
    );
  });
});

describe('injectInteractivePreviewHtml', () => {
  it('keeps player click hints visible in interactive preview canvases', () => {
    const html = '<html><head></head><body><div class="click-hint">Click to play</div></body></html>';
    const result = injectInteractivePreviewHtml(html);

    expect(result).toContain('data-xtrata-interactive-preview="true"');
    expect(result).toContain('display: flex !important');
  });
});

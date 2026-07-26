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
    expect(result).toContain('compactAppLike');
    expect(result).toContain("body.style.height = compactAppLike");
  });

  it('keeps tall document pages width-fit instead of scaling by full height', () => {
    const html =
      '<html><head><title>Agent 27</title></head><body><h1>AGENT 27</h1><p>Long journal entry</p></body></html>';
    const result = injectGridThumbnailHtml(html);

    expect(result).toContain('contentHeight <= viewportHeight * 1.5');
    expect(result).toContain(
      '? Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight)'
    );
    expect(result).toContain(': Math.min(1, viewportWidth / contentWidth)');
    expect(result).toContain(": 'auto'");
  });

  // A bare HTML inscription carrying no styles of its own rendered on the
  // browser's default white canvas, so it appeared as a white card in an
  // otherwise black grid.
  it('defaults an unstyled inscription to the dark grid canvas', () => {
    const html = '<html><head><title>Library</title></head><body>Library</body></html>';
    const result = injectGridThumbnailHtml(html);
    expect(result).toContain('color-scheme: dark;');
  });

  // The guard on the above: this must never repaint an inscription that chose
  // its own appearance. Zero specificity via :where() means any rule the
  // inscription declares beats it, whatever the source order.
  it('cannot override an appearance the inscription chose for itself', () => {
    const result = injectGridThumbnailHtml(
      '<html><head></head><body></body></html>'
    );
    const colorSchemeRule =
      result.match(/(:\S+)\s*\{\s*\n?\s*color-scheme: dark;/)?.[1] ?? '';
    expect(colorSchemeRule).toBe(':where(:root)');
    // No background is declared at all, so a painted background is untouched.
    expect(result).not.toMatch(/background(-color)?:/);
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

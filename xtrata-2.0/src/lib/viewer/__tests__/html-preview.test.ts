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

describe('player chrome in a grid thumbnail', () => {
  /**
   * The inscribed audio player starts its transport visible, deliberately: hiding
   * it until a pointer event left a phone with nothing visible to tap. Correct for
   * a player, wrong for a 180px tile, where the waveform and timestamps cover the
   * artwork and none of them can be used.
   *
   * It has to be fixed here. Changing the template would bring back the phone bug
   * it was written to fix, and would do nothing for the players already inscribed,
   * which are permanent and are exactly the ones in the grid.
   */
  const PLAYER = `<html><head></head><body>
    <div class="player" data-transport="visible">
      <section class="stage">
        <div class="cover-media"><img src="art.png"></div>
        <div class="stage-scrim"></div>
        <header class="top-bar">
          <div class="track-copy"><h1>LIQUIDEZ</h1></div>
          <div class="top-actions" data-player-control><button>eye</button></div>
        </header>
        <div id="hoverTransport" class="hover-transport" data-player-control>
          <span>0:00</span>
          <div class="hover-wave"><canvas></canvas></div>
          <span>1:45</span>
        </div>
        <section id="playerDrawer" class="drawer" data-player-control></section>
      </section>
    </div>
  </body></html>`;

  it('hides everything the template marked as a control', () => {
    const result = injectGridThumbnailHtml(PLAYER);
    expect(result).toContain('[data-player-control]');
    expect(result).toMatch(/\[data-player-control\]\s*\{\s*display:\s*none\s*!important;/);
  });

  // !important, and not inside :where(), because it has to beat the template's
  // own .player[data-transport="visible"] .hover-transport { opacity: 1 }. The
  // surrounding rules use :where() so an inscription's own styling always wins;
  // this one is the deliberate exception and the comment says why.
  it('overrides the rule that makes the transport visible', () => {
    const result = injectGridThumbnailHtml(PLAYER);
    const rule = result.slice(result.indexOf('[data-player-control]'));
    expect(rule.slice(0, 80)).not.toContain(':where');
    expect(rule).toContain('!important');
  });

  it('leaves the artwork, the title and the scrim alone', () => {
    const result = injectGridThumbnailHtml(PLAYER);
    // Still in the document...
    expect(result).toContain('class="cover-media"');
    expect(result).toContain('LIQUIDEZ');
    expect(result).toContain('class="stage-scrim"');
    // ...and nothing injected hides them.
    const injected = result.slice(
      result.indexOf('data-xtrata-grid-preview'),
      result.indexOf('</style>')
    );
    for (const kept of ['cover-media', 'stage-scrim', 'top-bar', 'track-copy']) {
      expect(injected, kept).not.toContain(kept);
    }
  });

  // The marker is the template author's own word for "this is a control". An
  // inscription that does not use it is untouched, which is the whole reason for
  // hooking on it rather than on class names that anybody might pick.
  it('does not touch an inscription that marks nothing as a control', () => {
    const art = '<html><head></head><body><canvas id="art"></canvas></body></html>';
    const result = injectGridThumbnailHtml(art);
    expect(result).toContain('<canvas id="art">');
  });
});

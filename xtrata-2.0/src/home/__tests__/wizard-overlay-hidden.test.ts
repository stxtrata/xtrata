import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const wizard = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url),
  'utf8'
);

// An author `display` declaration beats the UA stylesheet's [hidden]{display:none}.
// Any element that relies on the `hidden` attribute must therefore ship its own
// [hidden] rule, or it is on screen at every page load. The Song details overlay
// is fixed and full-viewport, so getting this wrong covered the whole page with a
// dialog that nothing on the page could dismiss — a reload just brought it back.
const styleBlock = wizard.slice(wizard.indexOf('<style>'), wizard.indexOf('</style>'));

const idsUsingHiddenAttribute = ['metaOverlay', 'playerRow'];

describe('wizard overlays honour the hidden attribute', () => {
  it('declares a [hidden] rule for every selector that sets display', () => {
    expect(styleBlock).toContain('.meta-overlay[hidden]{display:none}');
    expect(styleBlock).toContain('#playerRow[hidden]{display:none}');
  });

  it('keeps the [hidden] rule after the rule that sets display', () => {
    // Same specificity, so source order decides which wins.
    expect(styleBlock.indexOf('.meta-overlay{')).toBeLessThan(
      styleBlock.indexOf('.meta-overlay[hidden]')
    );
    expect(styleBlock.indexOf('#playerRow{')).toBeLessThan(
      styleBlock.indexOf('#playerRow[hidden]')
    );
  });

  it('never sets display inline on an element toggled by hidden', () => {
    // An inline display beats a [hidden] rule outright — there is no CSS fix for
    // that, so the markup must not do it in the first place.
    for (const id of idsUsingHiddenAttribute) {
      const tag = new RegExp(`<[^>]*id="${id}"[^>]*>`).exec(wizard)?.[0] ?? '';
      expect(tag).toContain('hidden');
      expect(tag).not.toMatch(/style="[^"]*display\s*:/);
    }
  });
});

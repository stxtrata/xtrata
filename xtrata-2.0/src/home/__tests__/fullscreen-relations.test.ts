/**
 * The relations strip in the enlarged viewer, and the layout traps it walked into.
 *
 * Two of these guard bugs that only appear once the strip exists, and both made the
 * artwork unreachable rather than merely ugly:
 *
 *   1. The overlay grid declared two rows, `auto` then the stage size. Adding a third
 *      child put the strip in the STAGE's row and pushed the artwork into an implicit
 *      one, so it lost its fixed size.
 *   2. The chrome was sized to the square stage. That made a feedback loop: the strip
 *      made the chrome taller, a taller chrome shrank the stage, a smaller stage
 *      narrowed the chrome, a narrower chrome wrapped to more rows, and round again.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/home.css', import.meta.url), 'utf8');

describe('enlarged viewer: relations strip', () => {
  it('sits between the chrome and the stage, not inside either', () => {
    const chrome = indexHtml.indexOf('fullscreen-viewer__chrome');
    const strip = indexHtml.indexOf('id="fullscreenRelations"');
    const stage = indexHtml.indexOf('id="fullscreenStage"');
    expect(strip).toBeGreaterThan(chrome);
    expect(strip).toBeLessThan(stage);
  });

  it('gives every overlay row an explicit grid-row', () => {
    // Auto-placement is what put the strip in the stage's track.
    expect(css).toContain('.fullscreen-viewer__chrome { grid-row: 1; }');
    expect(css).toContain('.fullscreen-viewer__rel { grid-row: 2; }');
    expect(css).toMatch(/\.fullscreen-viewer__stage \{\s*grid-row: 3;/);
    expect(css).toContain('grid-template-rows: auto auto var(--fullscreen-stage-size)');
  });

  it('gives the chrome, the strip and the stage ONE width', () => {
    // They share a grid column, so alignment only holds while the stage fills it.
    // Capping the stage at the square --fullscreen-stage-size left it visibly
    // narrower than the two bars above it on every screen.
    const rule = css.slice(
      css.indexOf('.fullscreen-viewer__stage {\n      grid-row: 3;'),
      css.indexOf('--fullscreen-chrome-space is set from MEASUREMENT')
    );
    expect(rule).toContain('width: 100%');
    expect(rule).not.toContain('min(100%, var(--fullscreen-stage-size))');
    expect(rule).not.toContain('justify-self');
  });

  it('does not size the chrome from the stage', () => {
    // The loop above. The column takes the WIDER of the stage and a readable floor.
    expect(css).toContain('max(var(--fullscreen-stage-size), 640px)');
    expect(css).not.toMatch(/grid-template-columns: minmax\(0, var\(--fullscreen-stage-size\)\);/);
  });

  it('reserves the height the chrome really occupies', () => {
    // A hardcoded reservation is wrong the moment the chrome wraps, which it does on
    // any phone. The stage then runs off the bottom of the screen.
    expect(mainSource).toContain('const syncFullscreenChromeSpace = ()');
    const fn = mainSource.slice(
      mainSource.indexOf('const syncFullscreenChromeSpace = ()'),
      mainSource.indexOf('const FULLSCREEN_REL_CHIP_LIMIT')
    );
    expect(fn).toContain('offsetHeight');
    expect(fn).toContain('--fullscreen-chrome-space');
    // The strip must be part of the sum, or it is not paid for.
    expect(fn).toContain('strip');
  });

  it('scrolls sideways rather than wrapping', () => {
    // Wrapping would let a piece with forty children push the artwork off a phone.
    const block = css.slice(
      css.indexOf('.fullscreen-viewer__rel {\n      display: flex;'),
      css.indexOf('.rel-strip__group')
    );
    expect(block).toContain('overflow-x: auto');
    expect(block).not.toContain('flex-wrap: wrap');
  });

  it('caps the chips and still tells the truth about the count', () => {
    expect(mainSource).toContain('const FULLSCREEN_REL_CHIP_LIMIT = 12');
    const fn = mainSource.slice(
      mainSource.indexOf('const buildRelStripGroup'),
      mainSource.indexOf('const renderFullscreenRelations')
    );
    // The label carries the full count even when the chips stop.
    expect(fn).toContain('${label} ${ids.length}');
    expect(fn).toContain('FULLSCREEN_REL_CHIP_LIMIT');
    expect(fn).toContain('more');
  });

  it('navigates without leaving the enlarged view', () => {
    const fn = mainSource.slice(
      mainSource.indexOf('const buildRelStripGroup'),
      mainSource.indexOf('const renderFullscreenRelations')
    );
    expect(fn).toContain('selectRelationshipToken(contractId, id)');
    expect(fn).toContain('if (state.fullscreenOpen) await renderFullscreenSelectedToken();');
  });

  it('drops a stale response rather than repainting the wrong piece', () => {
    const fn = mainSource.slice(
      mainSource.indexOf('const renderFullscreenRelations'),
      mainSource.indexOf('const renderFullscreenSelectedToken')
    );
    expect(fn).toContain('++state.fullscreenRelRequestId');
    expect(fn).toContain('if (requestId !== state.fullscreenRelRequestId) return;');
  });

  it('shows no bar at all for a piece with no relations', () => {
    const fn = mainSource.slice(
      mainSource.indexOf('const renderFullscreenRelations'),
      mainSource.indexOf('const renderFullscreenSelectedToken')
    );
    expect(fn).toContain('if (groups.length === 0)');
    expect(fn).toContain("classList.remove('has-relations')");
  });
});

describe('enlarged viewer: the mark is the way back', () => {
  it('is a real button with an accessible name', () => {
    expect(indexHtml).toContain('id="fullscreenMarkButton"');
    expect(indexHtml).toContain('aria-label="Back to the explorer"');
  });

  it('returns to the explorer rather than navigating away', () => {
    const at = mainSource.indexOf("dom.fullscreenMarkButton?.addEventListener('click'");
    expect(at).toBeGreaterThan(-1);
    expect(mainSource.slice(at, at + 160)).toContain('closeFullscreenViewer()');
  });
});

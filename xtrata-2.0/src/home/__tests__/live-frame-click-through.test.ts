// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLiveHtmlFrameManager, isHeavyGridHtml } from '../live-frame-manager.js';

const MiB = 1024 * 1024;

describe('isHeavyGridHtml', () => {
  it('keeps the 512 KB default and accepts a higher limit', () => {
    expect(isHeavyGridHtml('<p>x</p>', 600 * 1024)).toBe(true);
    expect(isHeavyGridHtml('<p>x</p>', 600 * 1024, MiB)).toBe(false);
    expect(isHeavyGridHtml('<p>x</p>', 854_300, MiB)).toBe(false);
    expect(isHeavyGridHtml('<p>x</p>', MiB, MiB)).toBe(true);
    expect(isHeavyGridHtml('x'.repeat(MiB), 10, MiB)).toBe(true);
  });

  it('treats a loader that reads other inscriptions as heavy at any limit', () => {
    expect(isHeavyGridHtml("<script>fn='get-chunk'</script>", 100, MiB)).toBe(true);
  });
});

describe('click-through tiles in the main grid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Every observed tile counts as on screen.
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(private cb: (entries: unknown[]) => void) {}
        observe(target: Element) {
          queueMicrotask(() => this.cb([{ target, isIntersecting: true }]));
        }
        unobserve() {}
        disconnect() {}
      }
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const setup = () => {
    const manager = createLiveHtmlFrameManager({
      injectHtml: (html: string) => html,
      maxLiveFrames: 16,
      mimeLabel: () => 'HTML'
    });
    const card = document.createElement('button');
    const thumb = document.createElement('div');
    card.append(thumb);
    document.body.append(card);
    const onCardClick = vi.fn();
    card.addEventListener('click', onCardClick);
    return { manager, card, thumb, onCardClick };
  };

  it('runs a page under 1 MiB without a tap, and the frame cannot take focus', async () => {
    const { manager, thumb } = setup();
    manager.register(
      thumb,
      { kind: 'html', html: '<p>hi</p>', mimeType: 'text/html' },
      { clickThrough: true, heavyBytes: MiB, byteLength: 854_300, key: 'k1' }
    );
    await vi.advanceTimersByTimeAsync(2000);
    const frame = thumb.querySelector('iframe')!;
    expect(frame.srcdoc).toContain('<p>hi</p>');
    expect(frame.tabIndex).toBe(-1);
    expect(frame.getAttribute('aria-hidden')).toBe('true');
    expect(frame.sandbox.toString()).toBe('allow-scripts');
  });

  it('leaves a click on the poster to the card instead of starting the page', async () => {
    const { manager, thumb, onCardClick } = setup();
    manager.register(
      thumb,
      { kind: 'html', html: '<p>big</p>', mimeType: 'text/html' },
      { clickThrough: true, heavyBytes: MiB, byteLength: 2 * MiB, key: 'k2' }
    );
    await vi.advanceTimersByTimeAsync(2000);
    const poster = thumb.querySelector('.token-thumb-gate') as HTMLElement;
    expect(poster.classList.contains('token-thumb-gate--static')).toBe(true);
    expect(poster.querySelector('.token-thumb-gate__hint')?.textContent).toBe('Tap to open');
    poster.click();
    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(thumb.querySelector('iframe')!.srcdoc).toBe('');
  });

  it('does not auto-run a page at or over the cap', async () => {
    const { manager, thumb } = setup();
    manager.register(
      thumb,
      { kind: 'html', html: '<p>x</p>', mimeType: 'text/html' },
      { clickThrough: true, heavyBytes: MiB, byteLength: MiB, key: 'k3' }
    );
    await vi.advanceTimersByTimeAsync(2000);
    expect(thumb.querySelector('iframe')!.srcdoc).toBe('');
  });

  it('keeps the old click-to-run poster for gated relationship thumbnails', () => {
    const { manager, thumb, onCardClick } = setup();
    manager.register(
      thumb,
      { kind: 'html', html: '<p>x</p>', mimeType: 'text/html' },
      { gated: true, key: 'k4', byteLength: 1000 }
    );
    const poster = thumb.querySelector('.token-thumb-gate') as HTMLElement;
    expect(poster.classList.contains('token-thumb-gate--static')).toBe(false);
    poster.click();
    expect(onCardClick).not.toHaveBeenCalled();
    expect(thumb.querySelector('iframe')!.srcdoc).toContain('<p>x</p>');
  });

  it('reports quiet only when no preview is loading', () => {
    const { manager } = setup();
    expect(manager.isQuiet()).toBe(true);
    const frame = document.createElement('iframe');
    manager.focusPreview('k9', frame);
    expect(manager.isQuiet()).toBe(false);
    manager.setSuspended(true);
    expect(manager.isQuiet()).toBe(false);
  });
});

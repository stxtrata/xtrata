// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { keepOpenBanner } from '../ui-panels';

/**
 * The wizard runs inside an iframe on the home page. A beforeunload registered INSIDE a
 * frame is not reliably honoured when the parent is the page being closed — it depends
 * on the browser and on that frame's own user activation. The parent's guard always is.
 *
 * So the frame reports one fact upward — "work is in flight" — and the host decides.
 * These tests hold the frame's half of that contract: it reports on change, it pins the
 * target origin, it reports even when its own markup is missing, and it says nothing at
 * all when it is not embedded.
 */

const mount = () => document.getElementById('slot') as HTMLElement;
let posted: Array<{ msg: any; origin: string }>;

beforeEach(() => {
  document.body.innerHTML = '<div id="slot"></div>';
  document.head.innerHTML = '';
  posted = [];
  // Pretend to be embedded: a parent that is not us.
  (window as any).__realParent = window.parent;
  Object.defineProperty(window, 'parent', {
    configurable: true,
    value: { postMessage: (msg: any, origin: string) => posted.push({ msg, origin }) }
  });
  // The "report only on change" latch is module state and survives between tests, so
  // settle it to not-live WHILE embedded before each case, then ignore that message.
  keepOpenBanner({ job: null, status: '', mount: mount() });
  posted = [];
});

afterEach(() => {
  Object.defineProperty(window, 'parent', { configurable: true, value: window });
  keepOpenBanner({ job: null, status: '', mount: mount() });
});

describe('the frame reports live work to its host', () => {
  it('says live when a job starts', () => {
    keepOpenBanner({ job: { progress: '96/459 chunks' }, status: 'INSCRIBING', mount: mount() });
    expect(posted).toHaveLength(1);
    expect(posted[0].msg.type).toBe('xtrata:job:live');
    expect(posted[0].msg.live).toBe(true);
    expect(posted[0].msg.detail).toContain('96 of 459 chunks');
  });

  it('says not-live when it finishes', () => {
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(posted.map((p) => p.msg.live)).toEqual([true, false]);
  });

  it('stays quiet while nothing changes', () => {
    // statusJob polls every few seconds for the life of a job; an identical message per
    // poll would be noise the host has to dedupe.
    for (let i = 0; i < 5; i++) {
      keepOpenBanner({ job: { progress: '96/459 chunks' }, status: 'INSCRIBING', mount: mount() });
    }
    expect(posted).toHaveLength(1);
  });

  it('does report each time the progress actually moves', () => {
    // The host writes these into the tab title, so real movement has to get through —
    // that is the whole point of showing progress on a tab nobody is looking at.
    for (const n of [96, 128, 160]) {
      keepOpenBanner({ job: { progress: `${n}/459 chunks` }, status: 'INSCRIBING', mount: mount() });
    }
    expect(posted.map((p) => p.msg.short)).toEqual(['⬤ 96/459', '⬤ 128/459', '⬤ 160/459']);
  });

  it('pins the target origin rather than posting to *', () => {
    keepOpenBanner({ job: {}, status: 'FUNDED', mount: mount() });
    expect(posted[0].origin).toBe(window.location.origin);
    expect(posted[0].origin).not.toBe('*');
  });

  it('still reports when its own mount is missing', () => {
    // Same reason the guard is still armed in that case: a markup slip must not
    // silently drop the protection.
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: null });
    expect(posted[0]?.msg.live).toBe(true);
  });

  it.each(['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED', 'INSCRIBING', 'INSCRIBED', 'DELIVERING'])(
    'treats %s as live', (status) => {
      keepOpenBanner({ job: {}, status, mount: mount() });
      expect(posted[0].msg.live).toBe(true);
    });

  it('says nothing when it is NOT embedded', () => {
    Object.defineProperty(window, 'parent', { configurable: true, value: window });
    const spy = vi.fn();
    (window as any).postMessage = spy;
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(spy).not.toHaveBeenCalled();
  });
});

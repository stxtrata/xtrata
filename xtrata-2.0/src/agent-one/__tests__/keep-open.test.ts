// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { keepOpenBanner } from '../ui-panels';

/**
 * The agent IS the tab. While a job is live, closing it does not cancel anything — the
 * work stops mid-upload with the deposit still on a wallet only this browser can open.
 *
 * Two things must therefore hold: the banner says something CONCRETE (a bar that has
 * stopped is indistinguishable from a crash), and the leave guard is armed exactly when
 * there is work to lose and disarmed the moment there isn't.
 */

const mount = () => document.getElementById('slot') as HTMLElement;
const box = () => document.querySelector('.xao-keepopen');
const text = () => box()!.textContent!;
const warn = () => document.querySelector('.xao-ko-warn') as HTMLElement;

/** Does beforeunload get cancelled? That IS the browser's "are you sure" prompt. */
function wouldWarnOnClose(): boolean {
  const e = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(e);
  return e.defaultPrevented;
}

beforeEach(() => { document.body.innerHTML = '<div id="slot"></div>'; document.head.innerHTML = ''; });
afterEach(() => { keepOpenBanner({ job: null, status: '', mount: mount() }); });

describe('when the banner shows', () => {
  it.each(['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED', 'INSCRIBING', 'INSCRIBED', 'DELIVERING'])(
    'is live during %s', (status) => {
      expect(keepOpenBanner({ job: {}, status, mount: mount() }).live).toBe(true);
      expect(box()).not.toBeNull();
    });

  it.each(['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED', 'FAILED', 'NEEDS_RECOVERY'])(
    'is not live during %s', (status) => {
      expect(keepOpenBanner({ job: {}, status, mount: mount() }).live).toBe(false);
      expect(box()).toBeNull();
    });

  it('takes the banner away once the job finishes', () => {
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(box()).not.toBeNull();
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(box()).toBeNull();
  });

  it('updates in place rather than stacking a banner per refresh', () => {
    for (let i = 1; i <= 3; i++) keepOpenBanner({ job: { progress: `${i}/16 chunks` }, status: 'INSCRIBING', mount: mount() });
    expect(document.querySelectorAll('.xao-keepopen')).toHaveLength(1);
    expect(text()).toContain('3 of 16 chunks');
  });
});

describe('what it actually says', () => {
  it('reports real progress, because a stalled bar looks like a crash', () => {
    keepOpenBanner({ job: { progress: 'batch 4/16 chunks uploaded' }, status: 'INSCRIBING', mount: mount() });
    expect(text()).toContain('4 of 16 chunks on-chain so far');
  });

  it('names the wait when there is no chunk count yet', () => {
    const cases: Array<[string, string]> = [
      ['AWAITING_DEPOSIT', 'waiting for your payment'],
      ['AWAITING_PARENT', 'waiting for the parent inscription'],
      ['DELIVERING', 'sending your inscription and change back']
    ];
    for (const [status, expected] of cases) {
      keepOpenBanner({ job: {}, status, mount: mount() });
      expect(text()).toContain(expected);
    }
  });

  it('stays quiet when storage is healthy', () => {
    keepOpenBanner({ job: { storageDurability: 'granted' }, status: 'INSCRIBING', mount: mount() });
    expect(warn().hidden).toBe(true);
  });

  it('says plainly when closing the tab would DESTROY the job, not pause it', () => {
    (window as any).XtrataAgent = { getBytesPersistError: () => 'QuotaExceededError' };
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(warn().hidden).toBe(false);
    expect(warn().textContent).toContain('QuotaExceededError');
    expect(warn().textContent).toContain('cannot resume');
    delete (window as any).XtrataAgent;
  });

  it('warns when storage was not made permanent', () => {
    keepOpenBanner({ job: { storageDurability: 'refused' }, status: 'INSCRIBING', mount: mount() });
    expect(warn().hidden).toBe(false);
    expect(warn().textContent).toContain('may clear the deposit key');
  });

  it('clears a stale warning once storage recovers', () => {
    keepOpenBanner({ job: { storageDurability: 'refused' }, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: { storageDurability: 'granted' }, status: 'INSCRIBING', mount: mount() });
    expect(warn().hidden).toBe(true);
  });
});

describe('the leave guard', () => {
  it('does not nag when there is no job', () => {
    keepOpenBanner({ job: null, status: '', mount: mount() });
    expect(wouldWarnOnClose()).toBe(false);
  });

  it('warns while work would be lost', () => {
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(wouldWarnOnClose()).toBe(true);
  });

  it('stops warning the moment the job is done', () => {
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(wouldWarnOnClose()).toBe(false);
  });

  it('is disarmed by clearing the banner, not just hidden', () => {
    // The wizard resets by wiping its job panel; if that only removed the markup the
    // guard would keep prompting on a page with nothing running.
    keepOpenBanner({ job: {}, status: 'FUNDED', mount: mount() });
    keepOpenBanner({ job: null, status: '', mount: mount() });
    expect(box()).toBeNull();
    expect(wouldWarnOnClose()).toBe(false);
  });

  it('is still armed when the mount is missing, so a markup slip cannot lose the job', () => {
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: null }).live).toBe(false);
    expect(wouldWarnOnClose()).toBe(true);
  });
});

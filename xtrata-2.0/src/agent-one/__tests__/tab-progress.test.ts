// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { keepOpenBanner, enableFinishNotice, notifyAvailable } from '../ui-panels';

/**
 * A background tab is throttled, not stopped — but from outside it looks identical to a
 * tab doing nothing, which is how a running job gets closed by accident. The tab strip
 * is the only UI visible without switching to the tab, so progress goes in the title.
 *
 * And a notification when it finishes, asked for on a CLICK: an unprompted permission
 * dialog is usually dismissed or auto-blocked, which burns the single chance to ask.
 */

const mount = () => document.getElementById('slot') as HTMLElement;
const btn = () => document.querySelector('.xao-ko-notify') as HTMLButtonElement;

beforeEach(() => {
  document.body.innerHTML = '<div id="slot"></div>';
  document.head.innerHTML = '';
  document.title = 'SUNO More — Xtrata';
  localStorage.clear();
  delete (window as any).Notification;
});
afterEach(() => keepOpenBanner({ job: null, status: '', mount: mount() }));

describe('progress in the tab title', () => {
  it('shows the chunk count while uploading', () => {
    keepOpenBanner({ job: { progress: 'batch 3/16 · 96/459 chunks' }, status: 'INSCRIBING', mount: mount() });
    expect(document.title).toBe('⬤ 96/459 · SUNO More — Xtrata');
  });

  it('names the wait when there is no count yet', () => {
    keepOpenBanner({ job: {}, status: 'AWAITING_DEPOSIT', mount: mount() });
    expect(document.title).toContain('awaiting payment');
  });

  it('puts the original title back when the job ends', () => {
    keepOpenBanner({ job: { progress: '96/459 chunks' }, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(document.title).toBe('SUNO More — Xtrata');
  });

  it('releases the title when done, so a later change is not clobbered', () => {
    keepOpenBanner({ job: { progress: '96/459 chunks' }, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    document.title = 'Something else entirely';
    keepOpenBanner({ job: { progress: '5/10 chunks' }, status: 'INSCRIBING', mount: mount() });
    expect(document.title).toBe('⬤ 5/10 · Something else entirely');
  });

  it('does not stack the prefix as progress moves', () => {
    for (const n of [96, 128, 160]) {
      keepOpenBanner({ job: { progress: `${n}/459 chunks` }, status: 'INSCRIBING', mount: mount() });
    }
    expect(document.title).toBe('⬤ 160/459 · SUNO More — Xtrata');
    expect(document.title.match(/⬤/g)).toHaveLength(1);
  });
});

describe('the finish notification', () => {
  const stubNotification = (permission: string, onRequest?: () => string) => {
    const ctor: any = vi.fn();
    ctor.permission = permission;
    ctor.requestPermission = vi.fn(async () => (onRequest ? onRequest() : permission));
    (window as any).Notification = ctor;
    return ctor;
  };

  it('offers itself only while a job is running', () => {
    stubNotification('default');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(btn().hidden).toBe(false);
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(document.querySelector('.xao-ko-notify')).toBeNull();   // banner is gone
  });

  it('is not offered when the browser has blocked notifications', () => {
    stubNotification('denied');
    expect(notifyAvailable()).toBe(false);
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(btn().hidden).toBe(true);
  });

  it('never asks for permission without a click', async () => {
    const ctor = stubNotification('default');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    expect(ctor.requestPermission).not.toHaveBeenCalled();
    await enableFinishNotice();                       // this is the click
    expect(ctor.requestPermission).toHaveBeenCalled();
  });

  it('fires when the job finishes and the tab is NOT being watched', async () => {
    const ctor = stubNotification('default', () => 'granted');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    await enableFinishNotice();
    ctor.permission = 'granted';
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(ctor).toHaveBeenCalledTimes(1);
    expect(ctor.mock.calls[0][1].body).toContain('back in your wallet');
  });

  it('does not interrupt someone already looking at the page', async () => {
    const ctor = stubNotification('default', () => 'granted');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    await enableFinishNotice();
    ctor.permission = 'granted';
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });

    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(ctor).not.toHaveBeenCalled();
  });

  it('fires once per outcome, not on every poll that reports it', async () => {
    const ctor = stubNotification('default', () => 'granted');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    await enableFinishNotice();
    ctor.permission = 'granted';
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    for (let i = 0; i < 4; i++) keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(ctor).toHaveBeenCalledTimes(1);
  });

  it('also speaks up for outcomes that NEED the user, not just success', async () => {
    const ctor = stubNotification('default', () => 'granted');
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    await enableFinishNotice();
    ctor.permission = 'granted';
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    keepOpenBanner({ job: {}, status: 'NEEDS_FUNDS', mount: mount() });
    expect(ctor.mock.calls[0][1].body).toContain('needs more STX');
  });

  it('stays silent when the user never opted in', () => {
    const ctor = stubNotification('granted');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    keepOpenBanner({ job: {}, status: 'INSCRIBING', mount: mount() });
    keepOpenBanner({ job: {}, status: 'COMPLETE', mount: mount() });
    expect(ctor).not.toHaveBeenCalled();
  });
});

// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { confirmDanger } from '../ui-panels';

/**
 * The cancel confirmation, tested by driving it rather than by reading its source.
 *
 * It guards an irreversible action on a job holding real money, and the rule is that
 * anything OTHER than a deliberate yes must resolve false. window.confirm was rejected
 * for this because a browser may suppress a native dialog, and a suppressed dialog is
 * indistinguishable from a click — the same way a suppressed window.prompt silently
 * broke the BNS chooser.
 */

const OPTS = { title: 'Stop this job and return everything?', body: 'Deposit #2878 goes back.' };
const panel = () => document.querySelector('.danger-confirm');
const btn = (which: 'yes' | 'no') => document.querySelector(`[data-x="${which}"]`) as HTMLElement;

beforeEach(() => { document.body.innerHTML = ''; document.head.innerHTML = ''; });

describe('confirmDanger', () => {
  it('resolves true only when the destructive button is clicked', async () => {
    const p = confirmDanger({ ...OPTS, confirmLabel: 'Stop and refund me' });
    btn('yes').click();
    expect(await p).toBe(true);
  });

  it('resolves false on the safe button', async () => {
    const p = confirmDanger(OPTS);
    btn('no').click();
    expect(await p).toBe(false);
  });

  it('resolves false on Escape', async () => {
    const p = confirmDanger(OPTS);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(await p).toBe(false);
  });

  it('resolves false when the backdrop is clicked', async () => {
    const p = confirmDanger(OPTS);
    (panel() as HTMLElement).click();
    expect(await p).toBe(false);
  });

  it('does not resolve when the panel itself is clicked', async () => {
    let settled: boolean | 'pending' = 'pending';
    confirmDanger(OPTS).then((v) => { settled = v; });
    (document.querySelector('.danger-panel') as HTMLElement).click();
    await Promise.resolve();
    expect(settled).toBe('pending');
  });

  it('focuses the SAFE option, so a stray Return keeps the job running', async () => {
    const p = confirmDanger(OPTS);
    expect(document.activeElement).toBe(btn('no'));
    btn('no').click();
    await p;
  });

  it('tears the dialog down and restores focus', async () => {
    const before = document.createElement('button');
    document.body.appendChild(before);
    before.focus();

    const p = confirmDanger(OPTS);
    btn('no').click();
    await p;

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(before);
    // A second Escape must not resolve anything again — the listener is gone.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });

  it('renders job text as text, never as markup', async () => {
    const p = confirmDanger({ title: 'Stop <b>job</b>?', body: '<img src=x onerror=alert(1)>' });
    expect(document.querySelector('.danger-body')!.querySelector('img')).toBeNull();
    expect(document.querySelector('.danger-body')!.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(document.querySelector('.danger-title')!.textContent).toBe('Stop <b>job</b>?');
    btn('no').click(); await p;
  });

  it('carries its own styles, so any page can use it', async () => {
    const p = confirmDanger(OPTS);
    const css = document.querySelector('style[data-xao-ui="danger"]')!.textContent!;
    expect(css).toContain('.danger-confirm');
    expect(css).toContain('.danger-yes');
    btn('no').click(); await p;

    // Injected once, however many times it opens.
    const q = confirmDanger(OPTS);
    expect(document.querySelectorAll('style[data-xao-ui="danger"]')).toHaveLength(1);
    btn('no').click(); await q;
  });
});

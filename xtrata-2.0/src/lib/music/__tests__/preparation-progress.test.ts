// @vitest-environment happy-dom
import { it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
it('shows honest indeterminate loading, measured conversion, completion and expandable errors', () => {
  vi.useFakeTimers();
  const consoleLog = vi.spyOn(console, 'info').mockImplementation(() => {});
  try {
    document.body.innerHTML = '<div id="drop"></div>';
    const code = readFileSync('xtrata-agent-one/wizard/music-diagnostics.js', 'utf8');
    window.eval(code);
    const d = (window as any).XtrataMusicDiagnostics;
    d.log('prepare', 'Starting');
    d.log('engine-load', 'Loading');
    const bar = document.querySelector('progress')!;
    expect(bar.hasAttribute('value')).toBe(false);
    vi.advanceTimersByTime(10000);
    expect(document.querySelector('#musicPrepElapsed')?.textContent).toBe('10s elapsed');
    window.dispatchEvent(
      new CustomEvent('xtrata:audio-diagnostic', {
        detail: { phase: 'progress', message: 'Processed audio', percent: 42 }
      })
    );
    expect(bar.value).toBe(42);
    expect(bar.getAttribute('aria-valuetext')).toContain('42%');
    d.log('processing-wait', 'Still running');
    expect(bar.value).toBe(42);
    d.log('quote-ready', 'Ready');
    expect(bar.value).toBe(100);
    expect(vi.getTimerCount()).toBe(0);
    d.log('error', 'Retry');
    expect((document.querySelector('#musicDiagnostics') as HTMLDetailsElement).open).toBe(true);
  } finally {
    consoleLog.mockRestore();
    vi.useRealTimers();
  }
});

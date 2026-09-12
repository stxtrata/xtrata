import { it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(
  new URL('../../../../xtrata-agent-one/wizard/audio-processing.js', import.meta.url),
  'utf8'
);
afterEach(() => vi.useRealTimers());
it('reports engine wait, times out, and allows a fresh retry without recording file contents', async () => {
  vi.useFakeTimers();
  const events: any[] = [];
  const exit = vi.fn();
  let calls = 0;
  const window: any = {
    dispatchEvent: (event: any) => events.push(event.detail),
    FFmpeg: {
      createFFmpeg: () => {
        calls++;
        return { load: () => new Promise(() => {}), exit };
      }
    }
  };
  vm.runInNewContext(code, {
    window,
    CustomEvent: class {
      detail: any;
      constructor(_type: string, opts: any) {
        this.detail = opts.detail;
      }
    },
    Date,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  });
  const f = new File(['private file contents'], 'private-name.wav');
  const first = window.XtrataAudioProcessing.extract(f, () => {}, 'original');
  const rejected = expect(first).rejects.toThrow('120 seconds');
  await vi.advanceTimersByTimeAsync(120000);
  await rejected;
  expect(events.some((e) => e.phase === 'engine-wait')).toBe(true);
  expect(events.some((e) => e.phase === 'engine-error')).toBe(true);
  expect(exit).toHaveBeenCalled();
  const second = window.XtrataAudioProcessing.extract(f, () => {}, 'original');
  const retry = expect(second).rejects.toThrow('120 seconds');
  await vi.advanceTimersByTimeAsync(120000);
  await retry;
  expect(calls).toBe(2);
  expect(JSON.stringify(events)).not.toContain('private');
  expect(vi.getTimerCount()).toBe(0);
});
